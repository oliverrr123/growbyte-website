import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function pure(file) { const exports = {}; vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports }); return exports; }
const legalModule = pure('lib/myfriend-legal.ts');
const analyticsModule = pure('lib/myfriend-analytics.ts');
const acceptedLegal = { accepted: true, version: legalModule.MYFRIEND_LEGAL_VERSION };
const answers={relationship:'grandmother',committed:false,goals:['conversation'],habits:['none'],cadence:'daily'};

// Exercise the route with provider doubles; never send SMS or create real charges.
function fixture({ paid = true, stage, phone, verified, account, activationOk = true, saveOk = true, phoneFlow = false, phoneSource = 'phone-cz', forMyself = false, callerPhone = '+420700000001', checkoutEmail, syncOk = true } = {}) {
  const jar = new Map([['mf_onboarding_checkout', 'signed:cs_test']]);
  if (verified) jar.set('mf_verified', verified);
  if (account) jar.set('mf_session', { phone: account });
  const session = { id: 'cs_test', status: paid ? 'complete' : 'open', payment_status: paid ? 'paid' : 'unpaid', subscription: 'sub_test', customer: 'cus_test', url: 'https://checkout.stripe.com/test', metadata: { flow: 'loved-one-onboarding', setup_stage: stage, phone } };
  session.customer_details = { email: checkoutEmail };
  const calls = [];
  if (phoneFlow) session.metadata.onboarding_source = phoneSource;
  const stripe = {
    checkout: { sessions: {
      retrieve: async () => session,
      create: async data => { calls.push(['create', data]); return session; },
      update: async (_, data) => { Object.assign(session.metadata, data.metadata); calls.push(['update', data]); return session; },
      expire: async () => calls.push(['expire']),
    } },
    subscriptions: { update: async (_, data) => { calls.push(['subscription', data]); return { metadata: { phone, ...data.metadata } }; } },
    customers: { update: async (_, data) => calls.push(['customer', data]) },
  };
  const deps = {
    'next/server': { after: () => {} },
    '@/lib/myfriend-dashboard-auth': { EMAIL_ACCESS_COOKIE:'mf_email_access', EMAIL_REFRESH_COOKIE:'mf_email_refresh' },
    '@/lib/myfriend-legal': legalModule,
    '@/lib/myfriend-checkout-email': pure('lib/myfriend-checkout-email.ts'),
    '@/lib/myfriend-analytics': analyticsModule,
    '@/lib/myfriend-analytics-server': { capturePaidCheckout: async () => {} },
    'next/headers': { cookies: async () => ({ get: key => jar.has(key) ? { value: jar.get(key) } : undefined, set: (key, value) => jar.set(key, value), delete: key => jar.delete(key) }) },
    '@/lib/myfriend-auth': { readVerifiedPhone: value => value },
    '@/lib/myfriend-session': { readAccountSession: value => typeof value === 'string' ? (value.startsWith('signed:') ? { phone: value.slice(7) } : null) : value, signAccountSession: value => `signed:${value}`, ACCOUNT_SESSION_COOKIE_OPTIONS: {} },
    '@/lib/myfriend': { ACCOUNT_SESSION_COOKIE: 'mf_session', VERIFIED_COOKIE: 'mf_verified', jsonError: (error, status = 400) => Response.json({ error }, { status }), requestOrigin: () => 'http://localhost:3000', myfriendAppPath: () => '/myfriend/onboarding' },
    '@/lib/myfriend-providers': { stripeClient: () => stripe, twilioConfigured: () => true, allowDevOtpBypass: () => false },
    '@/lib/myfriend-billing': { activateFromCheckoutSession: async () => { calls.push(['activate']); return activationOk ? { ok: true } : { ok: false, status: 503, error: 'Unavailable' }; }, syncFromStripeSubscription: async (_, data) => { calls.push(['sync', data]); return syncOk ? { ok: true } : {ok:false,status:503,error:'Sync unavailable'}; } },
    '@/lib/myfriend-api': { myfriendApiConfigured: () => true, myfriendApi: async (path, data) => { calls.push(['api', data]); if(path === '/api/phone-onboarding/setup') return {ok:true,data:{phone:callerPhone,for_myself:forMyself}}; return saveOk ? { ok: true } : { ok:false,status:503,error:'Database unavailable' }; }, apiErrorResponse: result => Response.json({ error: result.error }, { status: result.status }) },
    '@/lib/myfriend-onboarding': {restoreOnboardingAnswers:value=>value??{}},
  };
  const source = fs.readFileSync('app/api/myfriend/onboarding/route.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: name => { assert.ok(deps[name], name); return deps[name]; }, Response, URL, console });
  return { jar, calls, session, get: exports.GET, post: body => exports.POST(new Request('http://localhost:3000/api/myfriend/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({answers,legal:acceptedLegal,...body}) })) };
}

test('answers are saved before checkout is returned and failures remain retryable',async()=>{
  const f=fixture({paid:false,saveOk:false});f.jar.delete('mf_onboarding_checkout');
  assert.equal((await f.post({action:'checkout',plan:'annual'})).status,503);
  assert.deepEqual(f.calls.find(c=>c[0]==='api')[1].body.answers,answers);
  assert.equal(f.jar.get('mf_onboarding_checkout'),'signed:cs_test');
});
test('missing relationship, goals, or schedule cannot start a checkout',async()=>{
  for (const incomplete of [{}, {...answers,relationship:''}, {...answers,goals:[]}, {...answers,cadence:''}]) {
    const f=fixture({paid:false});
    assert.equal((await f.post({action:'checkout',plan:'annual',answers:incomplete})).status,400);
    assert.equal(f.calls.length,0);
  }
});

test('checkout saves the new preferences without a pledge or an age answer',async()=>{
  const f=fixture({paid:false});f.jar.delete('mf_onboarding_checkout');
  const preferences={...answers,age:'',committed:false};
  assert.equal((await f.post({action:'checkout',plan:'monthly',answers:preferences})).status,200);
  assert.deepEqual(f.calls.find(c=>c[0]==='api')[1].body.answers,preferences);
});

test('unpaid checkout cannot activate an account', async () => {
  const f = fixture({ paid: false, verified: { phone: '+14155552671', audience: 'myself' } });
  assert.equal((await f.post({ action: 'buyer' })).status, 403);
  assert.equal(f.calls.length, 0);
});
test('setup requires the signed checkout capability', async () => {
  const f = fixture(); f.jar.delete('mf_onboarding_checkout');
  assert.equal((await f.post({ action: 'buyer' })).status, 401);
});
test('buyer must verify their own phone, not the senior phone', async () => {
  const f = fixture({ verified: { phone: '+14155552671', audience: 'loved-one' } });
  assert.equal((await f.post({ action: 'buyer' })).status, 401);
});
test('verified buyer activates subscription and gets an account session', async () => {
  const f = fixture({ verified: { phone: '+14155552671', audience: 'myself' } });
  assert.equal((await f.post({ action: 'buyer' })).status, 200);
  assert.equal(f.session.metadata.phone, '+14155552671');
  assert.equal(f.session.metadata.setup_stage, 'senior');
  assert.equal(f.jar.get('mf_session'), 'signed:+14155552671');
  assert.equal(f.jar.has('mf_verified'), false);
});
test('activation failure does not advance setup or issue an account session', async () => {
  const f = fixture({ verified: { phone: '+14155552671', audience: 'myself' }, activationOk: false });
  assert.equal((await f.post({ action: 'buyer' })).status, 503);
  assert.equal(f.jar.has('mf_session'), false);
  assert.notEqual(f.session.metadata.setup_stage, 'senior');
});
test('paid order cannot be rebound to another buyer', async () => {
  const f = fixture({ phone: '+14155552671', verified: { phone: '+14155552672', audience: 'myself' } });
  assert.equal((await f.post({ action: 'buyer' })).status, 409);
});
test('verified senior is saved against the authenticated buyer', async () => {
  const f = fixture({ phone: '+14155552671', account: '+14155552671', verified: { phone: '+14155552672', audience: 'loved-one' } });
  assert.equal((await f.post({ action: 'senior' })).status, 200);
  assert.equal(f.calls.find(c => c[0] === 'api')[1].body.senior_phone, '+14155552672');
  assert.equal(f.session.metadata.setup_stage, 'email');
});
test('skip senior preserves account and moves to email', async () => {
  const f = fixture({ phone: '+14155552671', account: '+14155552671' });
  assert.equal((await f.post({ action: 'skip-senior' })).status, 200);
  assert.equal(f.session.metadata.setup_stage, 'email');
  assert.ok(!f.calls.some(c => c[0] === 'api'));
});
test('recovery email validates and persists to subscription and account', async () => {
  const f = fixture({ phone: '+14155552671', account: '+14155552671' });
  assert.equal((await f.post({ action: 'email', email: 'bad' })).status, 400);
  assert.equal((await f.post({ action: 'email', email: 'person@example.com' })).status, 200);
  assert.equal(f.session.metadata.recovery_email, 'person@example.com');
  assert.equal(f.calls.find(c => c[0] === 'sync')[1].email, 'person@example.com');
});
test('annual checkout bills $250 per year and binds its session', async () => {
  const f = fixture({ paid: false }); f.jar.delete('mf_onboarding_checkout');
  assert.equal((await f.post({ action: 'checkout', plan: 'annual' })).status, 200);
  const data = f.calls.find(c => c[0] === 'create')[1];
  assert.equal(data.line_items[0].price_data.unit_amount, 25000);
  assert.equal(data.line_items[0].price_data.recurring.interval, 'year');
  assert.equal(f.jar.get('mf_onboarding_checkout'), 'signed:cs_test');
});
test('monthly checkout bills $25 per month; invalid plan is rejected', async () => {
  const f = fixture({ paid: false }); f.jar.delete('mf_onboarding_checkout');
  assert.equal((await f.post({ action: 'checkout', plan: 'free' })).status, 400);
  assert.equal((await f.post({ action: 'checkout', plan: 'monthly' })).status, 200);
  const data = f.calls.find(c => c[0] === 'create')[1];
  assert.equal(data.line_items[0].price_data.unit_amount, 2500);
  assert.equal(data.line_items[0].price_data.recurring.interval, 'month');
});
test('setup resumes the persisted paid stage', async () => {
  const f = fixture({ stage: 'email' });
  const data = await (await f.get()).json();
  assert.equal(data.paid, true); assert.equal(data.stage, 'email');
});

test('confirmed payment opens thank-you; Continue persists the phone-verification stage', async () => {
  const f = fixture();
  assert.equal((await (await f.get()).json()).stage, 'thank-you');
  assert.deepEqual(await (await f.post({action:'thank-you'})).json(), {ok:true,stage:'buyer'});
  assert.equal((await (await f.get()).json()).stage, 'buyer');
});
test('thank-you cannot confirm unpaid checkout or bypass its browser session', async () => {
  const unpaid = fixture({paid:false});
  assert.equal((await (await unpaid.get()).json()).paid, false);
  assert.equal((await unpaid.post({action:'thank-you'})).status, 403);
  assert.equal(unpaid.calls.length, 0);
  const missing = fixture(); missing.jar.delete('mf_onboarding_checkout');
  assert.equal((await missing.post({action:'thank-you'})).status, 401);
});
test('retrying thank-you never resets a later setup stage', async () => {
  for (const stage of ['buyer','senior','email','welcome','done']) {
    const f = fixture({stage});
    assert.equal((await (await f.post({action:'thank-you'})).json()).stage, stage);
    assert.equal(f.calls.length, 0);
  }
});


test('missing, false, and stale terms acceptance cannot start checkout', async () => {
  for (const legal of [null, {}, {accepted:false,version:acceptedLegal.version}, {accepted:'true',version:acceptedLegal.version}, {accepted:true,version:'old'}]) {
    const f=fixture({paid:false});
    assert.equal((await f.post({action:'checkout',plan:'monthly',legal})).status,400);
    assert.equal(f.calls.length,0);
  }
});
test('new checkout stores acceptance without changing analytics attribution',async()=>{
  const f=fixture({paid:false}); f.jar.delete('mf_onboarding_checkout');
  const id='019959cd-44d0-7000-8000-000000000001';
  assert.equal((await f.post({action:'checkout',plan:'monthly',analytics:{distinct_id:id}})).status,200);
  const data=f.calls.find(c=>c[0]==='create')[1];
  assert.equal(data.metadata.terms_version,acceptedLegal.version);
  assert.ok(Date.parse(data.metadata.terms_accepted_at));
  assert.equal(data.metadata.analytics_distinct_id,id);
  assert.equal(data.subscription_data.metadata.terms_version,acceptedLegal.version);
});
test('reused checkout records current acceptance and preserves existing analytics',async()=>{
  const f=fixture({paid:false});
  Object.assign(f.session.metadata,{plan:'monthly',terms_version:'old',analytics_distinct_id:'existing'});
  assert.equal((await f.post({action:'checkout',plan:'monthly'})).status,200);
  assert.equal(f.session.metadata.terms_version,acceptedLegal.version);
  assert.equal(f.session.metadata.analytics_distinct_id,'existing');
  assert.equal(f.calls.some(c=>c[0]==='create'),false);
});
test('legacy checkout also requires and records terms acceptance',async()=>{
  const calls=[];
  const deps={
    'next/headers':{cookies:async()=>({get:()=>({value:'verified'})})},
    '@/lib/myfriend-legal':legalModule,
    '@/lib/myfriend-auth':{readVerifiedPhone:()=>({phone:'+12025550123',audience:'myself'})},
    '@/lib/myfriend':{VERIFIED_COOKIE:'verified',MYFRIEND_MONTHLY_CENTS:2500,checkoutReturnPaths:()=>({successUrl:'http://localhost/success',cancelUrl:'http://localhost/cancel'}),jsonError:(error,status=400)=>Response.json({error},{status})},
    '@/lib/myfriend-providers':{stripeClient:()=>({checkout:{sessions:{create:async data=>{calls.push(data);return {url:'https://checkout.stripe.com/test'};}}}})},
  };
  const exports={};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/api/myfriend/checkout/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,require:n=>deps[n],Response,process:{env:{}},console});
  const post=legal=>exports.POST(new Request('http://localhost/api/myfriend/checkout',{method:'POST',body:JSON.stringify({legal})}));
  assert.equal((await post(null)).status,400);
  assert.equal(calls.length,0);
  assert.equal((await post(acceptedLegal)).status,200);
  assert.equal(calls[0].metadata.terms_version,acceptedLegal.version);
});

test('Czech payment codes cannot activate a different verified caller account',async()=>{
 const f=fixture({phoneFlow:true,verified:{phone:'+420700000002',audience:'myself'}});
 assert.equal((await f.post({action:'buyer'})).status,403);
 assert.equal(f.calls.some(c=>c[0]==='activate'),false);assert.equal(f.jar.has('mf_session'),false);
});
test('Czech self-use links the verified caller as the companion and skips the relative step',async()=>{
 const f=fixture({phoneFlow:true,forMyself:true,verified:{phone:'+420700000001',audience:'myself'}});
 const response=await f.post({action:'buyer'});assert.equal(response.status,200);assert.equal((await response.json()).stage,'email');
 assert.equal(f.session.metadata.setup_stage,'email');
 assert.equal(f.calls.find(c=>c[0]==='api'&&c[1].body.for_myself)?.[1].body.senior_phone,'+420700000001');
});
test('Czech family use still requires the loved one number and preserves separate consent',async()=>{
 const f=fixture({phoneFlow:true,forMyself:false,verified:{phone:'+420700000001',audience:'myself'}});
 const response=await f.post({action:'buyer'});assert.equal((await response.json()).stage,'senior');
 assert.equal(f.calls.some(c=>c[0]==='api'&&c[1].body.for_myself),false);
});

test('self-use correction links only the paid, verified owner and survives reload and retry', async()=>{
 const phone='+420700000001';
 const f=fixture({phoneFlow:true,stage:'senior',phone,account:phone});
 const response=await f.post({action:'use-myself',phone:'+420700000099'});
 assert.equal(response.status,200);assert.equal((await response.json()).stage,'email');
 const link=f.calls.find(c=>c[0]==='api'&&c[1].body.for_myself);
 assert.equal(link[1].body.buyer_phone,phone);assert.equal(link[1].body.senior_phone,phone);
 assert.equal((await (await f.get()).json()).for_myself,true);
 const writes=f.calls.filter(c=>c[0]==='api'&&c[1].body.for_myself).length;
 assert.equal((await f.post({action:'use-myself'})).status,200);
 assert.equal(f.calls.filter(c=>c[0]==='api'&&c[1].body.for_myself).length,writes);
});
test('self-use correction rejects unpaid, unverified, mismatched and out-of-order requests',async()=>{
 const phone='+420700000001';
 for (const opts of [{paid:false,account:phone},{},{account:'+420700000099'},{account:phone,stage:'buyer'}]) {
  const f=fixture({phoneFlow:true,stage:'senior',phone,...opts});
  assert.ok((await f.post({action:'use-myself'})).status>=400);
  assert.equal(f.calls.some(c=>c[0]==='api'&&c[1].body.for_myself),false);
 }
});
test('failed self-use correction stays on the relative screen and remains retryable',async()=>{
 const phone='+420700000001';const f=fixture({phoneFlow:true,stage:'senior',phone,account:phone,saveOk:false});
 assert.equal((await f.post({action:'use-myself'})).status,503);
 assert.equal(f.session.metadata.setup_stage,'senior');assert.notEqual(f.session.metadata.setup_for_myself,'true');
});

for(const action of ['senior','skip-senior','use-myself'])test(`${action} reuses Stripe email and persists it before skipping the email screen`,async()=>{
 const phone='+420700000001';
 const f=fixture({phoneFlow:true,stage:'senior',phone,account:phone,checkoutEmail:'buyer@example.com',verified:{phone:'+420700000002',audience:'loved-one'}});
 const response=await f.post({action});assert.equal(response.status,200);assert.equal((await response.json()).stage,'welcome');
 assert.equal(f.calls.find(c=>c[0]==='sync')[1].email,'buyer@example.com');
 assert.equal(f.session.metadata.recovery_email,'buyer@example.com');
 assert.equal((await (await f.get()).json()).stage,'welcome');
});
test('Czech self-use from the call skips both relative and email when Stripe provides email',async()=>{
 const f=fixture({phoneFlow:true,forMyself:true,checkoutEmail:'self@example.com',verified:{phone:'+420700000001',audience:'myself'}});
 const response=await f.post({action:'buyer'});assert.equal(response.status,200);assert.equal((await response.json()).stage,'welcome');
 assert.equal(f.calls.find(c=>c[0]==='sync')[1].email,'self@example.com');
});
test('missing or invalid Stripe email still requires the fallback email form',async()=>{
 for(const checkoutEmail of [undefined,'','invalid']){
  const phone='+420700000001';const f=fixture({stage:'senior',phone,account:phone,checkoutEmail});
  assert.equal((await (await f.post({action:'skip-senior'})).json()).stage,'email');
  assert.equal(f.calls.some(c=>c[0]==='sync'),false);
 }
});
test('email sync failure does not advance and can be retried',async()=>{
 const phone='+420700000001';const f=fixture({stage:'senior',phone,account:phone,checkoutEmail:'buyer@example.com',syncOk:false});
 assert.equal((await f.post({action:'skip-senior'})).status,503);assert.equal(f.session.metadata.setup_stage,'senior');
});

for (const phoneSource of ['phone-us', 'phone-cz']) {
  test(`${phoneSource}: wrong verified caller cannot activate a paid checkout`, async () => {
    const f = fixture({phoneFlow:true,phoneSource,callerPhone:'+12025550101',verified:{phone:'+12025550102',audience:'myself'}});
    const result=await f.post({action:'buyer'});
    assert.equal(result.status,403);
    assert.equal(f.calls.some(c=>c[0]==='activate'),false);
    assert.equal(f.jar.has('mf_session'),false);
    if(phoneSource==='phone-us')assert.match((await result.json()).error,/same phone number/);
  });
  test(`${phoneSource}: call answers route self-use directly to welcome using Stripe email`, async () => {
    const f=fixture({phoneFlow:true,phoneSource,forMyself:true,callerPhone:'+12025550101',verified:{phone:'+12025550101',audience:'myself'},checkoutEmail:'self@example.com'});
    assert.equal((await (await f.post({action:'buyer'})).json()).stage,'welcome');
    assert.equal(f.calls.find(c=>c[0]==='api'&&c[1].body.for_myself)[1].body.senior_phone,'+12025550101');
    assert.equal(f.calls.find(c=>c[0]==='sync')[1].email,'self@example.com');
  });
  test(`${phoneSource}: family setup requires a separately verified recipient`, async () => {
    const phone='+12025550101';
    const f=fixture({phoneFlow:true,phoneSource,forMyself:false,callerPhone:phone,verified:{phone,audience:'myself'}});
    assert.equal((await (await f.post({action:'buyer'})).json()).stage,'senior');
    assert.equal((await f.post({action:'senior',phone:'+12025550102'})).status,401);
    assert.equal(f.calls.some(c=>c[0]==='api'&&c[1].body.senior_phone),false);
  });
}

for(const action of ['buyer','finish'])test(`${action} replaces an older email login with the verified paid account`,async()=>{
 const phone='+12025550101';
 const f=fixture({phoneFlow:true,phoneSource:'phone-us',callerPhone:phone,phone,account:phone,verified:{phone,audience:'myself'}});
 f.jar.set('mf_email_access','older-account-access');f.jar.set('mf_email_refresh','older-account-refresh');
 assert.equal((await f.post({action})).status,200);
 assert.equal(f.jar.get('mf_session'),'signed:'+phone);
 assert.equal(f.jar.has('mf_email_access'),false);assert.equal(f.jar.has('mf_email_refresh'),false);
});
