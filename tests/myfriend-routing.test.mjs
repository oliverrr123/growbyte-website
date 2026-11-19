import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { NextRequest } from 'next/server.js';
const require=createRequire(import.meta.url);
function load(file,window){
 const exports={};
 const resolve=name=>name.startsWith('.')?load(path.resolve(path.dirname(file),name+'.ts'),window):name.startsWith('@/')?load(path.resolve(name.slice(2)+'.ts'),window):require(name);
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:resolve,Response,Request,URL,process,console,...(window?{window}:{})});return exports;
}
const {middleware}=load(path.resolve('middleware.ts'));
for(const route of ['/myfriend/login','/myfriend/dashboard','/myfriend/onboarding','/myfriend/verify','/myfriend/messages'])test(`${route} stays on MyFriend`,()=>{
 const res=middleware(new NextRequest('https://trymyfriend.com'+route,{headers:{host:'trymyfriend.com'}}));assert.equal(res.headers.get('location'),null);assert.equal(res.headers.get('x-middleware-next'),'1');
});
for(const route of ['/login','/dashboard','/onboarding'])test(`${route} rewrites to its app route`,()=>{
 const res=middleware(new NextRequest('https://trymyfriend.com'+route+'?next=ok',{headers:{host:'trymyfriend.com'}}));assert.equal(res.headers.get('location'),null);assert.equal(res.headers.get('x-middleware-rewrite'),'https://trymyfriend.com/myfriend'+route+'?next=ok');
});
for(const hostname of ['trymyfriend.com','www.trymyfriend.com','localhost'])test(`browser navigation on ${hostname}`,()=>{
 const m=load(path.resolve('lib/myfriend.ts'),{location:{hostname}});
 for(const route of ['/login','/dashboard'])assert.equal(m.clientMyFriendAppPath(route),hostname==='localhost'?'/myfriend'+route:route);
});
test('server render keeps stable shared home link',()=>assert.equal(load(path.resolve('lib/myfriend.ts')).clientMyFriendAppPath('/'),'/myfriend'));

for(const route of ['/login','/dashboard'])test(`Czech ${route} stays on DigiPřítel`,()=>{
 const res=middleware(new NextRequest('https://digipritel.cz'+route,{headers:{host:'digipritel.cz'}}));assert.equal(res.headers.get('location'),null);assert.equal(res.headers.get('x-middleware-rewrite'),'https://digipritel.cz/digipritel'+route);
});
