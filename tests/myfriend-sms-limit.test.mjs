import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';import crypto from 'node:crypto';
function load(file,deps,env={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>deps[n],Response,Request,URL,process:{env},console});return exports;}
const jsonError=(error,status=400)=>Response.json({error},{status});
test('SMS limits use server-hashed phone and trusted client buckets; backend failure closes sends',async()=>{
 let sent;const backend={ok:true,data:{ok:true}};
 const helper=load('lib/myfriend-sms-limit.ts',{'node:crypto':crypto,'./myfriend':{jsonError},'./myfriend-api':{myfriendApi:async(path,args)=>{sent={path,...args};return backend;},apiErrorResponse:r=>jsonError('limit',r.status)}},{MYFRIEND_API_KEY:'test'});
 const request=new Request('https://digipritel.cz',{headers:{'x-vercel-forwarded-for':'198.51.100.1'}});
 assert.equal(await helper.reserveSmsSend(request,'+420700000001'),null);assert.equal(sent.body.phone,'+420700000001');assert.match(sent.body.client_hash,/^[a-f0-9]{64}$/);assert.equal(JSON.stringify(sent).includes('198.51.100.1'),false);
 for(const status of [429,503]){backend.ok=false;backend.status=status;assert.equal((await helper.reserveSmsSend(request,'+420700000001')).status,status);}
});
for(const kind of ['verify','login','account/phone-verification'])test(`${kind} cannot send an SMS after the durable limiter rejects or fails`,async()=>{
 for(const status of [429,503]){
 let sends=0;const response=jsonError('limited',status);const deps={
 '@/lib/myfriend':{jsonError,normalizeMobile:x=>x,isMyFriendAudience:x=>x==='myself',requestOrigin:()=> 'https://digipritel.cz'},
 '@/lib/myfriend-dashboard-auth':{sameOrigin:()=>true,dashboardAccount:async()=>({buyer_phone_number:'+420700000002'})},
 '@/lib/myfriend-phone-change':{sendPhoneChallenge:async()=>{sends++;return Response.json({ok:true});}},
 '@/lib/myfriend-sms-limit':{reserveSmsSend:async()=>response},
 '@/lib/myfriend-providers':{allowDevOtpBypass:()=>false,twilioConfigured:()=>true,twilioClient:()=>({verify:{v2:{services:()=>({verifications:{create:async()=>{sends++}}})}}})}};
 const file=kind.startsWith('account/')?`app/api/myfriend/${kind}/route.ts`:`app/api/myfriend/${kind}/send/route.ts`;
 const route=load(file,deps);const r=await route.POST(new Request('https://digipritel.cz/api',{method:'POST',headers:{origin:'https://digipritel.cz'},body:JSON.stringify({phone:'+420700000001',audience:'myself',purpose:'senior'})}));assert.equal(r.status,status);assert.equal(sends,0);
 }
});
