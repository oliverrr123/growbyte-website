import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file,deps){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>deps[n],Response,Request,URL,process:{env:{}},console});return exports;}
const error=(error,status=400)=>Response.json({error},{status});
for(const file of ['checkins','senior-phone']) test(`${file} ignores client account identifiers`,async()=>{
 let sent;const m=load(`app/api/myfriend/account/${file}/route.ts`,{'@/lib/myfriend-phone-change':{verifyPhoneChange:async()=>null,completePhoneChange:async()=>{}},'@/lib/myfriend-dashboard-auth':{dashboardAccount:async()=>({buyer_phone_number:'+12025550123'}),sameOrigin:()=>true},'@/lib/myfriend':{jsonError:error,requestOrigin:()=> 'http://localhost',normalizeMobile:x=>x},'@/lib/myfriend-api':{myfriendApi:async(path,args)=>{sent=args.body;return{ok:true,data:{ok:true}};},apiErrorResponse:error}});
 const r=await m.POST(new Request('http://localhost/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({buyer_phone:'+12025550999',senior_phone:'+12025550111',enabled:false})}));assert.equal(r.status,200);assert.equal(sent.buyer_phone,'+12025550123');
});
test('email verification stores tokens server-side but never returns them to the browser',async()=>{
 let saved;const m=load('app/api/myfriend/email-login/check/route.ts',{'@/lib/myfriend-dashboard-auth':{sameOrigin:()=>true,saveEmailSession:async x=>{saved=x;}},'@/lib/myfriend':{jsonError:error},'@/lib/myfriend-api':{myfriendApi:async()=>({ok:true,data:{access_token:'secret',refresh_token:'refresh',expires_in:3600}}),apiErrorResponse:error}});
 const r=await m.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify({email:'a@example.com',code:'123456'})}));assert.equal(r.status,200);assert.equal(saved.access_token,'secret');assert.equal(JSON.stringify(await r.json()).includes('secret'),false);
});
test('cross-origin changes are rejected before account lookup',async()=>{
 const m=load('app/api/myfriend/account/senior-phone/route.ts',{'@/lib/myfriend-dashboard-auth':{sameOrigin:()=>false,dashboardAccount:()=>{throw new Error('must not authenticate');}},'@/lib/myfriend':{jsonError:error},'@/lib/myfriend-api':{}});assert.equal((await m.POST(new Request('http://localhost',{method:'POST'}))).status,403);
});
test('payer edit uses the signed-in account, never a submitted account identifier',async()=>{
 let sent;
 const m=load('app/api/myfriend/account/buyer-phone/route.ts',{
  '@/lib/myfriend-phone-change':{verifyPhoneChange:async()=>null,completePhoneChange:async()=>{}},
  'next/headers':{cookies:async()=>({get:()=>undefined})},
  '@/lib/myfriend-dashboard-auth':{sameOrigin:()=>true,dashboardAccount:async()=>({buyer_phone_number:'+12025550123'})},
  '@/lib/myfriend':{jsonError:error,normalizeMobile:x=>x},
  '@/lib/myfriend-api':{myfriendApi:async(path,args)=>{sent=args.body;return{ok:true,data:{buyer_phone_number:args.body.new_phone}}},apiErrorResponse:error},
  '@/lib/myfriend-session':{},
 });
 const r=await m.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify({buyer_phone:'+12025550999',new_phone:'+12025550124'})}));
 assert.equal(r.status,200);assert.equal(sent.buyer_phone,'+12025550123');assert.equal(sent.new_phone,'+12025550124');
});

for (const kind of ['buyer','senior']) test(`${kind} save rejects missing verification before calling the backend`,async()=>{
 let writes=0;
 const m=load(`app/api/myfriend/account/${kind}-phone/route.ts`,{
  '@/lib/myfriend-phone-change':{verifyPhoneChange:async()=>error('Verify first',403)},
  '@/lib/myfriend-dashboard-auth':{sameOrigin:()=>true,dashboardAccount:async()=>({buyer_phone_number:'+12025550123'})},
  '@/lib/myfriend':{jsonError:error,normalizeMobile:x=>x},
  '@/lib/myfriend-api':{myfriendApi:async()=>{writes++;},apiErrorResponse:error},
  'next/headers':{},'@/lib/myfriend-session':{},
 });
 const r=await m.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify({new_phone:'+12025550124',senior_phone:'+12025550124',for_myself:true})}));
 assert.equal(r.status,403);assert.equal(writes,0);
});

test('message opt-in uses only the signed-in account and explicit consent',async()=>{
 let path,sent;
 const m=load('app/api/myfriend/account/message-updates/route.ts',{'@/lib/myfriend-dashboard-auth':{dashboardAccount:async()=>({buyer_phone_number:'+12025550123'}),sameOrigin:()=>true},'@/lib/myfriend':{jsonError:error},'@/lib/myfriend-api':{myfriendApi:async(p,args)=>{path=p;sent=args.body;return{ok:true,data:{opted_in:true,activation:{status:'activation_required'}}}},apiErrorResponse:error}});
 const r=await m.POST(new Request('http://localhost/api',{method:'POST',body:JSON.stringify({buyer_phone:'+12025550999',enabled:true,recipient_consent:true,digest_timezone:'Europe/Prague'})}));
 assert.equal(r.status,200);assert.equal(path,'/api/account/message-updates');assert.equal(sent.buyer_phone,'+12025550123');assert.equal(sent.recipient_consent,true);assert.equal(sent.digest_timezone,'Europe/Prague');assert.equal((await r.json()).activation.status,'activation_required');
});
test('cross-origin message opt-in is rejected before authentication or backend writes',async()=>{
 const m=load('app/api/myfriend/account/message-updates/route.ts',{'@/lib/myfriend-dashboard-auth':{sameOrigin:()=>false,dashboardAccount:()=>{throw Error('unexpected')}},'@/lib/myfriend':{jsonError:error},'@/lib/myfriend-api':{}});
 assert.equal((await m.POST(new Request('http://localhost',{method:'POST'}))).status,403);
});
test('schedule changes cannot queue a welcome message or grant recipient opt-in',async()=>{
 const calls=[];
 const schedule={enabled:true,frequency:'daily',weekdays:[0,1,2,3,4,5,6],windows:[{start:600,end:660}],timezone:'Europe/Prague'};
 const m=load('app/api/myfriend/account/schedule/route.ts',{'@/lib/myfriend-dashboard-auth':{dashboardAccount:async()=>({buyer_phone_number:'+12025550123'}),sameOrigin:()=>true},'@/lib/myfriend':{jsonError:error},'@/lib/myfriend-checkin-schedule':{validateCheckinSchedule:()=>({schedule})},'@/lib/myfriend-api':{myfriendApi:async(path,args)=>{calls.push({path,args});return{ok:true,data:{ok:true}}},apiErrorResponse:error}});
 const r=await m.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify(schedule)}));
 assert.equal(r.status,200);assert.equal(calls.length,1);assert.equal(calls[0].path,'/api/account/friendly-calls');assert.equal(Object.hasOwn(calls[0].args.body,'message_updates'),false);
});
