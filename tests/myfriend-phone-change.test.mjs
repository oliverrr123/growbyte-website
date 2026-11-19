import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';
function setup(){
 const jar=new Map();let approved=false,configured=true,checks=0,sendOptions;
 const service={verifications:{create:async options=>{sendOptions=options;if(options.customFriendlyName)throw new Error('60204: Service does not support this feature');return{sid:'VEtest'};}},verificationChecks:{create:async({verificationSid,code})=>{checks++;assert.equal(verificationSid,'VEtest');return{status:approved&&code==='123456'?'approved':'pending',to:'+12025550124'};}}};
 const deps={'node:crypto':crypto,'next/headers':{cookies:async()=>({get:k=>jar.get(k)?{value:jar.get(k)}:undefined,set:(k,v)=>jar.set(k,v),delete:k=>jar.delete(k)})},'./myfriend':{jsonError:(error,status=400)=>Response.json({error},{status})},'./myfriend-providers':{twilioConfigured:()=>configured,twilioClient:()=>({verify:{v2:{services:()=>service}}})}};
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/myfriend-phone-change.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>deps[n],Buffer,Date,Response,process:{env:{TWILIO_AUTH_TOKEN:'unit-test-only',TWILIO_VERIFY_SERVICE_SID:'VA-test'}}});
 return {api:exports,jar,get sendOptions(){return sendOptions;},get checks(){return checks;},approve(){approved=true;},disable(){configured=false;},send:()=>exports.sendPhoneChallenge('+12025550123','+12025550124','buyer'),verify:(buyer='+12025550123',phone='+12025550124',purpose='buyer',code='123456')=>exports.verifyPhoneChange(buyer,phone,purpose,code)};
}
test('missing, tampered and wrong account/number/purpose challenges never reach Twilio',async()=>{
 const s=setup();assert.equal((await s.verify()).status,403);await s.send();
 for(const args of [['+12025550999'],['+12025550123','+12025550999'],['+12025550123','+12025550124','senior']])assert.equal((await s.verify(...args)).status,403);
 s.jar.set('mf_phone_change_buyer',s.jar.get('mf_phone_change_buyer')+'tampered');assert.equal((await s.verify()).status,403);assert.equal(s.checks,0);
});
test('approved OTP survives a failed save; only successful save consumes its proof',async()=>{
 const s=setup();await s.send();assert.equal((await s.verify()).status,400);s.approve();assert.equal(await s.verify(),null);
 const checks=s.checks;const proof=await s.api.readPhoneChallenge('buyer');
 assert.equal(await s.verify(),null);assert.equal(s.checks,checks);
 assert.equal((await s.api.readPhoneChallenge('buyer')).expires,proof.expires);
 assert.equal((await s.verify('+12025550999')).status,403);
 assert.equal((await s.verify('+12025550123','+12025550999')).status,403);
 await s.api.completePhoneChange('buyer');assert.equal((await s.verify()).status,403);
});
test('resending has a cooldown and verification fails closed without Twilio',async()=>{
 const s=setup();assert.equal((await s.send()).status,200);assert.equal((await s.send()).status,429);s.disable();assert.equal((await s.verify()).status,503);assert.equal((await s.send()).status,503);
});
test('expired signed challenge is rejected',async()=>{
 const s=setup();await s.send();const [encoded]=s.jar.get('mf_phone_change_buyer').split('.');const data=JSON.parse(Buffer.from(encoded,'base64url'));data.expires=Date.now()-1;const payload=Buffer.from(JSON.stringify(data)).toString('base64url');s.jar.set('mf_phone_change_buyer',payload+'.'+crypto.createHmac('sha256','unit-test-only').update(payload).digest('base64url'));assert.equal((await s.verify()).status,403);assert.equal(s.checks,0);
});

test('SMS verification works without premium per-request friendly-name support',async()=>{
 const s=setup();assert.equal((await s.send()).status,200);
 assert.equal(s.sendOptions.to,'+12025550124');assert.equal(s.sendOptions.channel,'sms');
 assert.equal('customFriendlyName' in s.sendOptions,false);
 assert.ok(s.jar.has('mf_phone_change_buyer'));
});
