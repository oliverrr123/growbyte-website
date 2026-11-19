import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [baseline,out]=process.argv.slice(2);assert(baseline&&out&&!fs.existsSync(out));fs.cpSync(baseline,out,{recursive:true});
const changed=[];
function edit(file,before,after){const target=path.join(out,file),s=fs.readFileSync(target,'utf8');assert.equal(s.split(before).length,2,'Unique anchor: '+file);fs.writeFileSync(target,s.replace(before,after));if(!changed.includes(file))changed.push(file);}
function copy(file){const target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target);changed.push(file);}
const route='app/api/myfriend/onboarding/route.ts',local=fs.readFileSync(path.join(root,route),'utf8');
const live=fs.readFileSync(path.join(out,route),'utf8');
edit(route,live.slice(live.indexOf('    return Response.json({ paid: true'),live.indexOf('  } catch {')),local.slice(local.indexOf('    let forMyself = false;'),local.indexOf('  } catch {')));
const begin='    if (body.action === "buyer") {',end='    const account = readAccountSession';
edit(route,live.slice(live.indexOf(begin),live.indexOf(end)),local.slice(local.indexOf(begin),local.indexOf(end)));
for(const f of ['middleware.ts','components/myfriend-try-button.tsx','app/digipritel/page.tsx','app/digipritel/vice/page.tsx','lib/elder-companion-seo.ts','lib/myfriend-legal.ts','app/api/myfriend/phone-onboarding/route.ts','app/myfriend/call/page.tsx','components/myfriend-phone-onboarding.tsx'])copy(f);
const sha=p=>fs.existsSync(p)?crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'):null;
fs.mkdirSync(path.join(out,'.vercel'));fs.writeFileSync(path.join(out,'.vercel/project.json'),JSON.stringify({projectId:'prj_Z2q7EUESCYsZTS2cTWhES92cKMpR',orgId:'team_CXbPkX3pinBHoaE3ALbAfYim',projectName:'growbyte-website'}));
fs.writeFileSync(path.join(out,'phone-release-manifest.json'),JSON.stringify({baseline:'dpl_12vZrqwqWJr4CQGobPr6cxkDH6te',changed:Object.fromEntries(changed.map(f=>[f,{before:sha(path.join(baseline,f)),after:sha(path.join(out,f))}]))},null,2));
console.log('Prepared '+changed.length+' scoped website changes');
