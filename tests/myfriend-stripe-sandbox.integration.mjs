// Explicit integration test: real Stripe TEST sessions, simulated account API.
// Never pays, sends SMS, or writes to the production account database.
// STRIPE_SANDBOX_TEST=1 node tests/myfriend-stripe-sandbox.integration.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import Stripe from 'stripe';
import nextEnv from '@next/env';
const {loadEnvConfig}=nextEnv;
assert.equal(process.env.STRIPE_SANDBOX_TEST,'1','Explicit opt-in required');
loadEnvConfig(process.cwd(),true);
const key=process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
assert.ok(key?.startsWith('sk_test_'),'Only Stripe test credentials are allowed');
const stripe=new Stripe(key);
const jar=new Map([['mf_phone_checkout',crypto.randomBytes(32).toString('hex')]]);
const created=new Set();let savedSession=null,failSave=true,acceptance;const reservationId=crypto.randomUUID();
function load(file,deps) {
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>deps[n],Response,URL,Date,process:{env:{MYFRIEND_API_KEY:'isolated-account-api-fixture'}}});return exports;
}
const legalModule=load('lib/myfriend-legal.ts',{});
const originalCreate=stripe.checkout.sessions.create.bind(stripe.checkout.sessions);
const provider={checkout:{sessions:{
 create:async(...args)=>{const s=await originalCreate(...args);assert.equal(s.livemode,false);created.add(s.id);return s;},
 retrieve:id=>stripe.checkout.sessions.retrieve(id),
}}};
const route=load('app/api/myfriend/phone-onboarding/route.ts',{
 'node:crypto':crypto,
 '@/lib/elder-companion-seo':{isDigipritelHost:host=>host==='digipritel.cz'},
 'next/headers':{cookies:async()=>({get:k=>jar.has(k)?{value:jar.get(k)}:undefined,set:(k,v)=>jar.set(k,v),delete:k=>jar.delete(k)})},
 '@/lib/myfriend-api':{myfriendApiConfigured:()=>true,apiErrorResponse:r=>Response.json({error:r.error},{status:r.status}),myfriendApi:async(path,{body})=>{
  if(path.endsWith('/context'))return{ok:true,data:{id:'isolated-launch-audit',answers:{relationship:'myself'},checkout_session_id:savedSession}};
  if(path.endsWith('/legal')){acceptance??=body.legal;return{ok:true,data:{id:reservationId,checkout_session_id:savedSession,legal:acceptance}};}
  if(path.endsWith('/release-checkout'))return{ok:true,data:{ok:true}};
  if(path.endsWith('/checkout')){if(failSave)return{ok:false,status:503,error:'Simulated storage outage'};assert.equal(body.livemode,false);savedSession=body.checkout_session_id;return{ok:true,data:{}};}
  throw Error('Unexpected account API: '+path);
 }},
 '@/lib/myfriend-legal':legalModule,
 '@/lib/myfriend-session':{ACCOUNT_SESSION_COOKIE_OPTIONS:{},signAccountSession:id=>'signed-fixture:'+id},
 '@/lib/myfriend':{jsonError:(error,status=400)=>Response.json({error},{status}),requestOrigin:()=> 'https://digipritel.cz',normalizeMobile:p=>p},
 '@/lib/myfriend-providers':{stripeClient:()=>provider,twilioConfigured:()=>true,allowDevOtpBypass:()=>false},
});
const post=(body,origin='https://digipritel.cz')=>route.POST(new Request('https://digipritel.cz/api/myfriend/phone-onboarding',{method:'POST',headers:{origin},body:JSON.stringify(body)}));
const body={action:'checkout',phone:'+420700007705',legal:{accepted:true,version:legalModule.MYFRIEND_LEGAL_VERSION},price:1,currency:'usd'};
try{
 assert.equal((await post(body,'https://other.example')).status,403);
 assert.equal((await post({...body,legal:undefined})).status,400);
 assert.equal(created.size,0);
 assert.equal((await post(body)).status,503);
 assert.equal(jar.has('mf_onboarding_checkout'),false);
 assert.equal(created.size,1);
 failSave=false;
 const first=await post(body);assert.equal(first.status,200);const url=(await first.json()).url;
 const retry=await post(body);assert.equal((await retry.json()).url,url);assert.equal(created.size,1,'Retries must not create multiple checkouts');
 const session=await stripe.checkout.sessions.retrieve(savedSession,{expand:['line_items.data.price']});
 const price=session.line_items.data[0].price;
 assert.equal(session.livemode,false);assert.equal(session.amount_total,30000);assert.equal(session.currency,'czk');assert.equal(session.locale,'cs');assert.equal(price.recurring.interval,'month');assert.equal(price.recurring.interval_count,1);
 assert.equal(session.success_url,'https://digipritel.cz/start?setup=1');assert.equal(session.cancel_url,'https://digipritel.cz/start?cancelled=1');
 assert.equal(session.metadata.phone,undefined);assert.equal(session.metadata.onboarding_source,'phone-cz');
 assert.equal(jar.has('mf_session'),false);
 await stripe.checkout.sessions.expire(savedSession);
 assert.equal((await post(body)).status,401);
 console.log('PASS real Stripe sandbox: 300 CZK/month, Czech locale, return URLs, origin/terms gates, retry after storage failure, one Checkout Session, expired checkout rejected. No payment made. Account API simulated.');
}finally{
 for(const id of created){const s=await stripe.checkout.sessions.retrieve(id);if(s.status==='open')await stripe.checkout.sessions.expire(id);}
 console.log('All audit-created Stripe test checkout sessions expired.');
}
