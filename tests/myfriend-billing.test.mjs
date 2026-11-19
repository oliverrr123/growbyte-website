import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file,deps,env={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>deps[n],Response,URL,process:{env:{STRIPE_WEBHOOK_SECRET:'test',...env}},console});return exports;}
test('renewal dates support Stripe item periods and legacy subscriptions',()=>{
 const m=load('lib/myfriend-billing.ts',{'@/lib/myfriend-api':{}});
 assert.equal(m.periodEndFromSubscription({items:{data:[{current_period_end:1800000000}]}}),new Date(1800000000000).toISOString());
 assert.equal(m.periodEndFromSubscription({current_period_end:1800000000}),new Date(1800000000000).toISOString());
 assert.equal(m.periodEndFromSubscription({items:{data:[]}}),null);
});
for(const type of ['invoice.paid','invoice.payment_failed','customer.subscription.updated','customer.subscription.deleted']){
 test(`${type} retries database failures and uses current Stripe state`,async()=>{
  let current=false;
  const route=load('app/api/myfriend/stripe/webhook/route.ts',{
   '@/lib/myfriend':{jsonError:(error,status)=>Response.json({error},{status})},
   '@/lib/myfriend-providers':{stripeClient:()=>({webhooks:{constructEvent:()=>({type,data:{object:{id:'sub_test',parent:{subscription_details:{subscription:'sub_test'}}}}})},subscriptions:{retrieve:async()=>{current=true;return {id:'sub_test',status:'canceled'};}}})},
   '@/lib/myfriend-billing':{syncFromStripeSubscription:async sub=>{assert.equal(sub.status,'canceled');return{ok:false,status:503,error:'DB unavailable'};}}
  });
  const response=await route.POST(new Request('http://localhost/webhook',{method:'POST',headers:{'stripe-signature':'test'},body:'{}'}));
  assert.equal(response.status,503);assert.equal(current,true);
 });
}
test('activation refuses an unpaid session',async()=>{
 let called=false;const m=load('lib/myfriend-billing.ts',{'@/lib/myfriend-api':{myfriendApi:()=>{called=true;}}});
 const result=await m.activateFromCheckoutSession({}, {metadata:{phone:'+12025550189'},status:'open',payment_status:'unpaid'});
 assert.equal(result.ok,false);assert.equal(called,false);
});

test('Stripe test objects cannot activate or update the production API',async()=>{
 let writes=0;const m=load('lib/myfriend-billing.ts',{'@/lib/myfriend-api':{myfriendApi:async()=>{writes++;return{ok:true};}}},{MYFRIEND_API_URL:'https://api-nameless-water-1932.fly.dev'});
 assert.equal((await m.activateFromCheckoutSession({}, {livemode:false,status:'complete',payment_status:'paid',metadata:{phone:'+420700000001'}})).status,409);
 assert.equal((await m.syncFromStripeSubscription({livemode:false,id:'sub_test'})).status,409);assert.equal(writes,0);
 assert.equal((await m.syncFromStripeSubscription({livemode:true,id:'sub_live',metadata:{},items:{data:[]}})).ok,true);assert.equal(writes,1);
});

test('checkout return only grants an account session after paid checkout and successful activation',async()=>{
 for(const scenario of [
  {status:'complete',payment_status:'paid',activation:{ok:false,status:409},allowed:false},
  {status:'complete',payment_status:'paid',activation:{ok:false,status:503},allowed:false},
  {status:'complete',payment_status:'unpaid',activation:{ok:true},allowed:false},
  {status:'open',payment_status:'unpaid',activation:{ok:true},allowed:false},
  {status:'complete',payment_status:'paid',activation:{ok:true},allowed:true},
 ]) {
  const issued=[];
  const route=load('app/api/myfriend/checkout/complete/route.ts',{
   'next/server':{NextResponse:{redirect:url=>({url,cookies:{set:(...args)=>issued.push(args)}})}},
   '@/lib/myfriend':{ACCOUNT_SESSION_COOKIE:'mf_session',myfriendAppPath:()=>'/myfriend/messages',requestOrigin:()=> 'https://trymyfriend.com'},
   '@/lib/myfriend-session':{ACCOUNT_SESSION_COOKIE_OPTIONS:{},signAccountSession:phone=>'signed:'+phone},
   '@/lib/elder-companion-seo':{isTryMyFriendHost:()=>true},
   '@/lib/myfriend-providers':{stripeClient:()=>({checkout:{sessions:{retrieve:async()=>({...scenario,metadata:{phone:'+420700000001'}})}}})},
   '@/lib/myfriend-billing':{activateFromCheckoutSession:async()=>scenario.activation},
  });
  await route.GET(new Request('https://trymyfriend.com/api/myfriend/checkout/complete?session_id=cs_test'));
  assert.equal(issued.length,scenario.allowed?1:0,JSON.stringify(scenario));
 }
});
