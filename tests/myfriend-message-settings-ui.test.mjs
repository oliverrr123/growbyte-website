import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {createRequire} from 'node:module';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
function render(settings,cs=false){
 let n=0;const exports={};const states=[settings,false,''];
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('components/myfriend-checkins.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:name=>name==='react'?{useEffect(){},useState:()=>[states[n++],()=>{}]}:name==='@/components/myfriend-account-locale'?{useMyFriendAccountLocale:()=>({cs,t:(en,cz)=>cs?cz:en,request:fetch})}:require(name)});
 return renderToStaticMarkup(exports.MyFriendCheckins({relationship:'grandmother'}));
}
const settings={opted_in:true,checkins_enabled:true,sharing_allowed:true,delivery_enabled:true,recipient_phone:'+420777930904',timezone:'Europe/Prague',provider:'photon',activation:{status:'activation_required',assigned_phone:'+16287895362',activation_url:'https://spectrum.photon.codes/users/example/redirect?msg=START'}};
test('saved opt-in with pending provider activation never displays ready and offers the assigned number',()=>{
 const html=render(settings);assert.match(html,/One more step/);assert.match(html,/\+16287895362/);assert.match(html,/Open Messages to activate/);assert.doesNotMatch(html,/Daily messages are enabled/);
});
test('only complete setup displays enabled, missing sharing or timezone cannot',()=>{
 const active={...settings,activation:{...settings.activation,status:'activated'}};
 assert.match(render(active),/Daily messages are enabled for 8 pm/);
 assert.doesNotMatch(render({...active,sharing_allowed:false}),/Daily messages are enabled/);
 assert.doesNotMatch(render({...active,timezone:null}),/Daily messages are enabled/);
 assert.doesNotMatch(render({...active,checkins_enabled:false}),/Daily messages are enabled/);
 assert.doesNotMatch(render({...active,delivery_enabled:false}),/Daily messages are enabled/);
});
test('opt-out remains unchecked and never gets an activation/send action',()=>{
 const html=render({...settings,opted_in:false});assert.doesNotMatch(html,/checked=""/);assert.doesNotMatch(html,/Open Messages to activate/);
});

test('Czech activation and sharing states keep the same consent conditions',()=>{
 const html=render(settings,true);assert.match(html,/aktivujte své číslo/);assert.doesNotMatch(html,/Daily messages|One more step/);
 assert.match(render({...settings,activation:{...settings.activation,status:'activated'},sharing_allowed:false},true),/souhlas vašeho blízkého/);
});
