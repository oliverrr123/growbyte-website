import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as phones from 'libphonenumber-js';
const exports={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/myfriend.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,require:n=>n==='libphonenumber-js'?phones:{}});
test('Czech local numbers fall through invalid US parsing, while international and US numbers retain their country',()=>{
 for(const [input,expected] of [['776 781 248','+420776781248'],['+420 776 781 248','+420776781248'],['415 555 2671','+14155552671'],['+44 7911 123456','+447911123456'],['+420',null],['abc',null],['',null]])assert.equal(exports.normalizeMobile(input),expected,input);
});
