import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';

function fixture() {
  const jar = new Map(); let checks = 0, sends = 0;
  const config = { NODE_ENV: 'production', MYFRIEND_VERIFY_SECRET: 'isolated-test-secret' };
  const helpers = {
    VERIFIED_COOKIE: 'mf_verified',
    isMyFriendAudience: v => ['myself', 'loved-one'].includes(v),
    normalizeMobile: v => /^\+\d{10,15}$/.test(v) ? v : null,
    requestOrigin: () => 'https://digipritel.cz',
    jsonError: (error, status = 400) => Response.json({ error }, { status }),
  };
  const deps = {
    crypto,
    '@/lib/myfriend-sms-limit': { reserveSmsSend: async () => null },
    '@/lib/myfriend': helpers,
    'next/headers': { cookies: async () => ({ get: k => ({ value: jar.get(k) }), set: (k,v) => jar.set(k,v) }) },
    '@/lib/myfriend-providers': {
      allowDevOtpBypass: () => false, twilioConfigured: () => true,
      twilioClient: () => ({ verify: { v2: { services: () => ({
        verifications: { create: async () => { sends++; return {}; } },
        verificationChecks: { create: async ({code}) => { checks++; if (checks > 1) throw Error('OTP already consumed'); return {status: code === '123456' ? 'approved' : 'pending'}; } },
      }) } } }),
    },
  };
  function load(file) {
    const exports = {};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
      {exports, require:n=>deps[n], Buffer, Date, Response, URL, process:{env:config}, console:{error:()=>{}}});
    return exports;
  }
  deps['@/lib/myfriend-auth'] = load('lib/myfriend-auth.ts');
  const routes = {check:load('app/api/myfriend/verify/check/route.ts'),send:load('app/api/myfriend/verify/send/route.ts')};
  return {jar, get checks(){return checks;}, get sends(){return sends;},
    post:(kind,body,origin='https://digipritel.cz')=>routes[kind].POST(new Request('https://digipritel.cz/api/myfriend/verify/'+kind,{method:'POST',headers:{origin},body:JSON.stringify(body)}))};
}
const input={phone:'+420700000001',audience:'myself',code:'123456'};
test('retry after a downstream failure reuses signed OTP proof without another Twilio check or extending expiry',async()=>{
  const f=fixture(); assert.equal((await f.post('check',input)).status,200);
  const token=f.jar.get('mf_verified');
  assert.equal((await f.post('check',input)).status,200); assert.equal(f.checks,1); assert.equal(f.jar.get('mf_verified'),token);
});
test('approved proof cannot verify a different number, audience, or tampered token',async()=>{
  for(const scenario of ['phone','audience','tamper']) {
    const f=fixture(); await f.post('check',input); const body={...input};
    if(scenario==='phone')body.phone='+420700000002';
    if(scenario==='audience')body.audience='loved-one';
    if(scenario==='tamper')f.jar.set('mf_verified',Buffer.from(Buffer.from(f.jar.get('mf_verified'),'base64url').toString().replace('+420700000001','+420700000002')).toString('base64url'));
    assert.equal((await f.post('check',body)).status,400); assert.equal(f.checks,2);
  }
});
test('unverified or incorrect codes never create authentication proof',async()=>{
  const f=fixture(); assert.equal((await f.post('check',{...input,code:'000000'})).status,400); assert.equal(f.jar.size,0);
});
for(const kind of ['send','check'])test(`${kind} rejects foreign origins and malformed input before provider calls`,async()=>{
  const f=fixture(); assert.equal((await f.post(kind,input,'https://other.example')).status,403);
  for(const body of [null,[],{...input,phone:123},{...input,phone:{}},{...input,audience:'invalid'}])assert.equal((await f.post(kind,body)).status,400);
  assert.equal(f.checks,0); assert.equal(f.sends,0);
});
