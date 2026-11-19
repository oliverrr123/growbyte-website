import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.PHONE_UI_BASE||'http://127.0.0.1:3110';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const myself of [true,false]){
  const context=await browser.newContext({viewport:{width:393,height:852},locale:'cs-CZ'});const page=await context.newPage();
  const actions=[];
  await page.route('**/api/myfriend/**',async route=>{
   const req=route.request(),b=req.method()==='POST'?req.postDataJSON():{};actions.push(b);const url=req.url();let payload={ok:true};
   if(url.endsWith('/phone-onboarding'))payload=req.method()==='GET'?{ready:false}:{ok:true};
   else if(url.endsWith('/onboarding'))payload=req.method()==='GET'?{paid:true,stage:'thank-you',for_myself:myself}:b.action==='thank-you'?{ok:true,stage:'buyer'}:b.action==='buyer'?{ok:true,stage:myself?'email':'senior'}:{ok:true};
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(payload)});
  });
  await page.goto(base+'/myfriend/call');await page.getByRole('button',{name:'Mám kód'}).click();await page.getByLabel('Čtyřmístný kód').fill('0001');await page.getByRole('button',{name:'Pokračovat'}).click();
  await page.getByRole('heading',{name:'DigiPřítel - AI společník na telefonu'}).waitFor();assert.equal(actions.find(x=>x.action==='code').code,'0001');
  const pay=page.getByRole('button',{name:'Zaplatit 300 Kč měsíčně'});assert.equal(await pay.isDisabled(),true);await page.getByRole('checkbox').check();await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('Zaplatit 300')).disabled);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto(base+'/myfriend/call?setup=1');await page.getByRole('button',{name:'Pokračovat'}).click();
  await page.getByLabel('Telefonní číslo',{exact:true}).fill('+420700000001');await page.getByRole('button',{name:'Poslat ověřovací SMS'}).click();await page.getByLabel('Kód z SMS',{exact:true}).fill('123456');await page.getByRole('button',{name:'Ověřit číslo'}).click();
  if(!myself){await page.getByRole('heading',{name:'Číslo vašeho blízkého'}).waitFor();await page.getByLabel('Telefonní číslo',{exact:true}).fill('+420700000002');await page.getByRole('button',{name:'Poslat ověřovací SMS'}).click();await page.getByLabel('Kód z SMS',{exact:true}).fill('654321');await page.getByRole('button',{name:'Ověřit číslo'}).click();}
  await page.getByLabel('E-mail',{exact:true}).fill('example@example.com');await page.getByRole('button',{name:'Pokračovat'}).click();await page.getByRole('heading',{name:'Vítejte u DigiPřítele.'}).waitFor();
  assert.equal(actions.filter(x=>x.action==='senior').length,myself?0:1);
  await context.close();console.log(myself?'Self-use setup passes':'Family setup passes');
 }
 for(const locale of ['cs-CZ','en-US']) {
  const page=await browser.newPage({locale,viewport:{width:1440,height:1000}});await page.goto(base+'/myfriend');const cta=page.getByRole('link',{name:'Try MyFriend',exact:true}).first();await cta.waitFor();await page.waitForFunction(expected=>Array.from(document.querySelectorAll('a')).some(a=>a.textContent.trim()==='Try MyFriend'&&a.getAttribute('href')===expected),['localhost','127.0.0.1'].includes(new URL(base).hostname)?'/start':locale==='cs-CZ'?'https://digipritel.cz/start':'/myfriend/onboarding');console.log(locale+' CTA passes');await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto(base+'/myfriend/call');fs.mkdirSync('artifacts/phone-onboarding',{recursive:true});await page.screenshot({path:'artifacts/phone-onboarding/call-desktop-release.png',fullPage:true});await page.close();
} finally {await browser.close();}
