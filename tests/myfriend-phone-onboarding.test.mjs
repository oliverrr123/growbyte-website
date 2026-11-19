import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';
const legal = { accepted:true, version:'2026-09-21' };
const stableLegal = { terms_version:legal.version, privacy_version:legal.version, terms_acceptance_method:'unchecked_web_checkbox', terms_accepted_at:'2026-10-01T12:00:00Z' };
function fixture({ ticket=true, saveOk=true, existing=null, claimOk=true, createFailsOnce=false, contextOk=true, phoneMatches=true, siteOrigin="https://digipritel.cz", contextLine=null }={}) {
  const jar = new Map(ticket ? [['mf_phone_checkout','a'.repeat(64)]] : []);
  const calls=[]; let failed=false; let storedId=existing;
  const session={id:'cs_testABC',livemode:false,status:'open',url:'https://checkout.stripe.com/test'};
  const deps={
    'node:crypto':crypto,
    '@/lib/elder-companion-seo':{isDigipritelHost:host=>host==='digipritel.cz'||host==='www.digipritel.cz'},
    'next/headers':{cookies:async()=>({get:key=>jar.has(key)?{value:jar.get(key)}:undefined,delete:key=>jar.delete(key),set:(key,value)=>jar.set(key,value)})},
    '@/lib/myfriend-api':{myfriendApiConfigured:()=>true,apiErrorResponse:r=>Response.json({error:r.error},{status:r.status}),myfriendApi:async(path,opts)=>{
      calls.push(['api',path,opts.body]);
      if(path.endsWith('/claim')) return claimOk?{ok:true,data:{ticket:'b'.repeat(64)}}:{ok:false,status:400,error:'Invalid code'};
      if(path.endsWith('/context') && opts.body.phone && !phoneMatches) return {ok:false,status:400,error:'Code does not match phone'};
      if(path.endsWith('/context')&&!contextOk) return {ok:false,status:401,error:'Expired ticket'};
      if(path.endsWith('/context')) return {ok:true,data:{line:contextLine || (siteOrigin.includes("digipritel")?"+420910920500":"+19496767670"),id:'onboarding-id',answers:{relationship:'myself'},checkout_session_id:storedId}};
      if(path.endsWith('/legal')) return {ok:true,data:{line:contextLine || (siteOrigin.includes("digipritel")?"+420910920500":"+19496767670"),id:'00000000-0000-4000-8000-000000000001',checkout_session_id:storedId,legal:stableLegal}};
      if(path.endsWith('/release-checkout')) return {ok:true,data:{ok:true}};
      if(path.endsWith('/checkout')) { if(saveOk) storedId=session.id; return saveOk?{ok:true,data:{}}:{ok:false,status:503,error:'Save failed'}; }
      throw Error(path);
    }},
    '@/lib/myfriend-legal':{legalAcceptanceMetadata:l=>l?.accepted&&l.version===legal.version?{...stableLegal,terms_accepted_at:new Date().toISOString()}:null},
    '@/lib/myfriend-session':{ACCOUNT_SESSION_COOKIE_OPTIONS:{},signAccountSession:s=>'signed:'+s},
    '@/lib/myfriend':{jsonError:(error,status=400)=>Response.json({error},{status}),requestOrigin:()=>siteOrigin,normalizeMobile:p=>p.replace(/\s/g,'').match(/^\+420\d{9}$/)?.[0] ?? null},
    '@/lib/myfriend-providers':{twilioConfigured:()=>true,allowDevOtpBypass:()=>false,stripeClient:()=>({checkout:{sessions:{
      create:async(...params)=>{calls.push(['create',...params]); if(createFailsOnce&&!failed){failed=true;throw Error('network failure');} return session;},
      retrieve:async()=>session,
    }}})},
  };
  const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/api/myfriend/phone-onboarding/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>deps[n],Response,URL,process:{env:{MYFRIEND_API_KEY:'test-key'}}});
  return {jar,calls,session,post:(body,origin=siteOrigin)=>exports.POST(new Request('https://trymyfriend.com/api/myfriend/phone-onboarding',{method:'POST',headers:{origin,'x-vercel-forwarded-for':'192.0.2.1'},body:JSON.stringify(body)})),get:exports.GET};
}
test('code redemption preserves leading zeros and cannot log into or expose an account',async()=>{
  const f=fixture({ticket:false});const r=await f.post({action:'code',code:'0001'});
  assert.deepEqual(await r.json(),{ok:true});assert.equal(f.calls[0][2].code,'0001');
  assert.equal(f.jar.has('mf_session'),false);assert.equal(f.jar.has('mf_verified'),false);
  assert.ok(f.jar.has('mf_phone_checkout'));assert.equal(f.jar.has('mf_onboarding_checkout'),false);
});
test('invalid code, failed redemption, missing ticket, foreign origin and missing terms cannot start payment',async()=>{
  const f=fixture({ticket:false});
  for(const body of [null, [], 42, 'checkout']) assert.equal((await f.post(body)).status,400);
  for(const code of [1234,'123','12345','ABCD']) assert.equal((await f.post({action:'code',code})).status,400);
  assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,401);
  assert.equal((await f.post({action:'code',code:'0001'},'https://evil.example')).status,403);
  assert.equal((await fixture().post({action:'checkout'})).status,400);
  assert.equal((await fixture({claimOk:false}).post({action:'code',code:'0001'})).status,400);
  assert.equal(f.calls.length,0);
});
test('Czech checkout always bills 300 CZK monthly, saves answers first and never trusts a client price',async()=>{
  const f=fixture();const r=await f.post({action:'checkout',phone:'+420 776 781 248',legal,price:1,currency:'usd'});assert.equal(r.status,200);
  const create=f.calls.find(c=>c[0]==='create')[1];
  assert.equal(create.line_items[0].price_data.currency,'czk');assert.equal(create.line_items[0].price_data.unit_amount,30000);
  assert.equal(create.line_items[0].price_data.recurring.interval,'month');assert.equal(create.locale,'cs');
  assert.equal(create.allow_promotion_codes,true);assert.equal(create.payment_method_collection,'always');
  assert.equal(create.metadata.phone,undefined);assert.equal(create.metadata.answers,undefined);
  assert.equal(f.jar.get('mf_onboarding_checkout'),'signed:cs_testABC');assert.equal(f.jar.has('mf_session'),false);
});
test('storage failures do not send buyers to payment',async()=>{
  const f=fixture({saveOk:false});const r=await f.post({action:'checkout',phone:'+420 776 781 248',legal});assert.equal(r.status,503);assert.equal(f.jar.has('mf_onboarding_checkout'),false);
});
test('network retries keep identical Stripe parameters and idempotency key',async()=>{
  const f=fixture({createFailsOnce:true});assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,502);
  assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,200);
  const created=f.calls.filter(c=>c[0]==='create');assert.deepEqual(created[0],created[1]);
});
test('different call-code tickets for one reservation use the same Stripe idempotency key',async()=>{
 const a=fixture(),b=fixture();b.jar.set('mf_phone_checkout','c'.repeat(64));
 assert.equal((await a.post({action:'checkout',phone:'+420 776 781 248',legal})).status,200);
 assert.equal((await b.post({action:'checkout',phone:'+420 776 781 248',legal})).status,200);
 assert.equal(JSON.stringify(a.calls.find(c=>c[0]==='create')),JSON.stringify(b.calls.find(c=>c[0]==='create')));
});
test('only confirmed Stripe expiry releases a reservation and returns to code entry',async()=>{
 const f=fixture({existing:'cs_testABC'});f.session.status='expired';
 assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,401);
 assert.ok(f.calls.some(c=>c[1]==='/api/phone-onboarding/release-checkout'));
 assert.equal(f.jar.has('mf_phone_checkout'),false);
 const uncertain=fixture({createFailsOnce:true});assert.equal((await uncertain.post({action:'checkout',phone:'+420 776 781 248',legal})).status,502);
 assert.equal(uncertain.calls.some(c=>c[1]==='/api/phone-onboarding/release-checkout'),false);
});
test('repeated checkout reuses the saved Stripe session; paid sessions resume setup',async()=>{
  const f=fixture({existing:'cs_testABC'});assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,200);assert.equal(f.calls.some(c=>c[0]==='create'),false);
  f.session.status='complete';const paid=await f.post({action:'checkout',phone:'+420 776 781 248',legal});assert.equal((await paid.json()).url,'/start?setup=1');
});

test('a rejected replacement code clears the previous valid ticket and blocks direct checkout',async()=>{
  for (const code of ['123', '9999']) {
    const f=fixture({claimOk:false});assert.ok(f.jar.has('mf_phone_checkout'));
    assert.equal((await f.post({action:'code',code})).status,400);
    assert.equal(f.jar.has('mf_phone_checkout'),false);
    assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,401);
    assert.equal(f.calls.some(c=>c[0]==='create'),false);
  }
});
test('expired tickets never reach Stripe and are cleared',async()=>{
  const f=fixture({contextOk:false});assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,401);
  assert.equal(f.jar.has('mf_phone_checkout'),false);assert.equal(f.calls.some(c=>c[0]==='create'),false);
});

test('Czech checkout and completed setup return to /start on the Czech origin',async()=>{
 const f=fixture({siteOrigin:'https://digipritel.cz'});assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,200);
 const options=f.calls.find(c=>c[0]==='create')[1];assert.equal(options.success_url,'https://digipritel.cz/start?setup=1');assert.equal(options.cancel_url,'https://digipritel.cz/start?cancelled=1');
 f.session.status='complete';assert.equal((await (await f.post({action:'checkout',phone:'+420 776 781 248',legal})).json()).url,'/start?setup=1');
});

test('missing, invalid and nonmatching caller numbers cannot open Stripe',async()=>{
 for(const phone of [undefined,'123','+420700000001']) {
  const f=fixture({phoneMatches:false});
  assert.equal((await f.post({action:'checkout',phone,legal})).status,400);
  assert.equal(f.calls.some(c=>c[0]==='create'),false);
 }
 const f=fixture();
 assert.equal((await f.post({action:'checkout',phone:'+420 776 781 248',legal})).status,200);
 assert.equal(f.calls.find(c=>c[1]==='/api/phone-onboarding/context')[2].phone,'+420776781248');
});


test('US phone checkout uses USD 25 monthly and cannot be switched by client price or line',async()=>{
 const f=fixture({siteOrigin:'https://trymyfriend.com'});
 const r=await f.post({action:'checkout',phone:'+420776781248',line:'+420910920500',legal,price:1,currency:'czk'});
 assert.equal(r.status,200);
 const options=f.calls.find(c=>c[0]==='create')[1];
 assert.equal(options.line_items[0].price_data.currency,'usd');assert.equal(options.line_items[0].price_data.unit_amount,2500);
 assert.equal(options.line_items[0].price_data.recurring.interval,'month');assert.equal(options.locale,'en');
 assert.equal(options.metadata.onboarding_source,'phone-us');assert.equal(options.success_url,'https://trymyfriend.com/call?setup=1');
 assert.equal(f.jar.has('mf_session'),false);
});
test('US origin rejects Czech handoff without creating a Stripe session',async()=>{
 const f=fixture({siteOrigin:'https://trymyfriend.com',contextLine:'+420910920500'});
 assert.equal((await f.post({action:'checkout',phone:'+420776781248',legal})).status,409);
 assert.equal(f.calls.some(c=>c[0]==='create'),false);
});
