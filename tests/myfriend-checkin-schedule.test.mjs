import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
function load(file,deps={},extra={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,{exports,require:n=>deps[n],Intl,Date,Response,Request,console,...extra});return exports;}
const policy=load('lib/myfriend-checkin-schedule.ts');
test('daily evening schedule and weekly day selection are normalized',()=>{
 const p={...policy.defaultCheckinSchedule(),enabled:true};
 assert.equal(policy.scheduleSummary(policy.validateCheckinSchedule(p).schedule),'Every day · 6 PM–9 PM');
 const weekly=policy.validateCheckinSchedule({...p,frequency:'weekly',weekdays:[5,1,1]}).schedule;
 assert.equal(JSON.stringify(weekly.weekdays),'[1,5]');assert.equal(policy.scheduleSummary(weekly),'Mon, Fri · 6 PM–9 PM');
});
test('rejects missing weekdays, overlapping windows, backwards ranges, invalid timezone and too many calls',()=>{
 const p={...policy.defaultCheckinSchedule(),enabled:true};
 for(const patch of [{frequency:'weekly',weekdays:[]},{frequency:'multiple',windows:[{start:540,end:660},{start:600,end:720}]},{windows:[{start:1260,end:1080}]},{timezone:'Pacific-ish'},{frequency:'multiple',windows:Array(5).fill({start:540,end:600})}])assert(policy.validateCheckinSchedule({...p,...patch}).error);
 assert(policy.validateCheckinSchedule({...p,frequency:'multiple',windows:[{start:1080,end:1260},{start:540,end:600}]}).schedule);
});
test('local persistence survives reads and is separated by account, even after a phone edit',async()=>{
 const directory=await fsp.mkdtemp(path.join(os.tmpdir(),'myfriend-schedule-test-'));
 try{
 const local=load('lib/myfriend-local-schedule.ts',{'node:crypto':crypto,'node:fs/promises':fsp,'node:path':path,'./myfriend-checkin-schedule':policy},{process:{env:{NODE_ENV:'development'},cwd:()=>directory}});
 const owner={stripe_customer_id:'fixture-owner',buyer_phone_number:'+12025550111'};
 const p={...policy.defaultCheckinSchedule(),enabled:true};
 await local.writeLocalSchedule(owner,p);
 assert.equal((await local.readLocalSchedule({...owner,buyer_phone_number:'+12025550112'})).enabled,true);
 assert.equal(await local.readLocalSchedule({stripe_customer_id:'fixture-other'}),null);
 const production=load('lib/myfriend-local-schedule.ts',{'node:crypto':crypto,'node:fs/promises':fsp,'node:path':path,'./myfriend-checkin-schedule':policy},{process:{env:{NODE_ENV:'production'},cwd:()=>directory}});
 await assert.rejects(()=>production.writeLocalSchedule(owner,p),/only available in development/);
 }finally{await fsp.rm(directory,{recursive:true,force:true});}
});
test('schedule API uses signed-in account rather than submitted identifiers',async()=>{
 let target;
 const endpoint=load('app/api/myfriend/account/schedule/route.ts',{'@/lib/myfriend-dashboard-auth':{sameOrigin:()=>true,dashboardAccount:async()=>({stripe_customer_id:'signed-in',buyer_phone_number:'+12025550111'})},'@/lib/myfriend':{jsonError:(error,status=400)=>Response.json({error},{status})},'@/lib/myfriend-checkin-schedule':policy,'@/lib/myfriend-api':{myfriendApi:async(_path,init)=>{if(_path==="/api/account/friendly-calls")target=init.body;return {ok:true,data:{ok:true}}},apiErrorResponse:()=>Response.json({error:'failed'},{status:500})}},{process:{env:{NODE_ENV:'development'}}});
 const r=await endpoint.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify({...policy.defaultCheckinSchedule(),enabled:true,stripe_customer_id:'other'})}));
 assert.equal(r.status,200);assert.equal(target.buyer_phone,'+12025550111');assert.equal(target.schedule.stripe_customer_id,undefined);assert.equal(target.message_updates,undefined);assert.equal((await r.json()).active,false);
});
test('confirmed schedule displays actual day-specific windows and caller timezone',async()=>{
 const endpoint=load('app/api/myfriend/account/schedule/route.ts',{'@/lib/myfriend-dashboard-auth':{dashboardAccount:async()=>({buyer_phone_number:'+12025550111'})},'@/lib/myfriend':{jsonError:(error,status=400)=>Response.json({error},{status})},'@/lib/myfriend-checkin-schedule':policy,'@/lib/myfriend-api':{myfriendApi:async()=>({ok:true,data:{confirmed:true,timezone:'Europe/Prague',proposed_schedule:{...policy.defaultCheckinSchedule(),enabled:true},calling_preferences:[{weekdays:'1',hour_range_from:'18:00',hour_range_to:'19:00'},{weekdays:'5',hour_range_from:'09:00',hour_range_to:'10:00'}]}})}});
 const data=await(await endpoint.GET()).json();
 assert.equal(data.active,true); assert.equal(data.confirmed_timezone,'Europe/Prague');
 assert.equal(data.confirmed_summary,'Mon · 6 PM–7 PM; Fri · 9 AM–10 AM');
});

test('schedule save never initiates a messaging connection or welcome text',async()=>{
 const requests=[];
 const endpoint=load('app/api/myfriend/account/schedule/route.ts',{
  '@/lib/myfriend-dashboard-auth':{sameOrigin:()=>true,dashboardAccount:async()=>({buyer_phone_number:'+12025550111'})},
  '@/lib/myfriend':{jsonError:(error,status=400)=>Response.json({error},{status})},
  '@/lib/myfriend-checkin-schedule':policy,
  '@/lib/myfriend-api':{myfriendApi:async(path,init)=>{requests.push({path,...init});return path==='/api/family/connect'?{ok:false,status:503,error:'Messaging is unavailable.'}:{ok:true,data:{ok:true}};}}
 });
 const response=await endpoint.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify({...policy.defaultCheckinSchedule(),enabled:true})}));
 const data=await response.json();
 assert.equal(response.status,200);assert.equal(data.saved,true);assert.equal(data.schedule.enabled,true);
 assert.equal(data.message_error,undefined);assert.equal(requests.length,1);assert.equal(requests[0].path,'/api/account/friendly-calls');
 requests.length=0;
 await endpoint.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify({...policy.defaultCheckinSchedule(),enabled:false})}));
 assert.equal(requests.length,1);
});

test('message connection uses the current dashboard account after email login',async()=>{
 let body;
 const endpoint=load('app/api/myfriend/messages/route.ts',{
  '@/lib/myfriend-dashboard-auth':{sameOrigin:()=>true,dashboardAccount:async()=>({buyer_phone_number:'+12025550111'})},
  '@/lib/myfriend':{jsonError:(error,status=400)=>Response.json({error},{status})},
  '@/lib/myfriend-api':{myfriendApi:async(path,init)=>{body=init.body;return{ok:true,data:{ok:true}}}}
 });
 const response=await endpoint.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify({buyer_phone:'+12025550999'})}));
 assert.equal(response.status,200);assert.equal(body.buyer_phone,'+12025550111');
});

test('daily digest timezone is forwarded separately from call timezone and rejects invalid zones',async()=>{
 const requests=[];
 const endpoint=load('app/api/myfriend/account/schedule/route.ts',{
  '@/lib/myfriend-dashboard-auth':{sameOrigin:()=>true,dashboardAccount:async()=>({buyer_phone_number:'+12025550111'})},
  '@/lib/myfriend':{jsonError:(error,status=400)=>Response.json({error},{status})},
  '@/lib/myfriend-checkin-schedule':policy,
  '@/lib/myfriend-api':{myfriendApi:async(path,init)=>{requests.push({path,...init});return{ok:true,data:{ok:true}}}}
 });
 const send=digest_timezone=>endpoint.POST(new Request('http://localhost',{method:'POST',body:JSON.stringify({...policy.defaultCheckinSchedule(),enabled:true,timezone:'Europe/Prague',digest_timezone})}));
 assert.equal((await send('America/Los_Angeles')).status,200);
 assert.equal(requests[0].body.digest_timezone,'America/Los_Angeles');assert.equal(requests[0].body.schedule.timezone,'Europe/Prague');
 requests.length=0;
 for(const invalid of ['Pacific-ish',42,null])assert.equal((await send(invalid)).status,400);
 assert.equal(requests.length,0);
});
