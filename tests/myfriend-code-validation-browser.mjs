import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.PHONE_UI_BASE||'http://127.0.0.1:3112';
const browser=await chromium.launch({channel:'chrome',headless:true});
const headers=process.env.PREVIEW_PROJECT_FILE?{'x-vercel-protection-bypass':Object.keys(JSON.parse(fs.readFileSync(process.env.PREVIEW_PROJECT_FILE)).protectionBypass)[0]}:{};
const newContext=async()=>{const ctx=await browser.newContext();await ctx.route(base+'/**',r=>r.continue({headers:{...r.request().headers(),...headers}}));return ctx;};
try {
 const context=await newContext();const page=await context.newPage();let resolveRestore;const restore=new Promise(r=>resolveRestore=r);let restored=false;
 await page.route('**/api/myfriend/phone-onboarding',async route=>{
  if(route.request().method()==='GET'){await restore;await route.fulfill({json:{ready:true}});restored=true;}
  else await route.fulfill({status:400,json:{error:'Invalid code'}});
 });
 const initialRequest=page.waitForRequest(r=>r.method()==='GET'&&r.url().endsWith('/phone-onboarding'));await page.goto(base+'/myfriend/call',{waitUntil:'domcontentloaded'});await initialRequest;await page.getByRole('button',{name:'Mám kód'}).click();await page.getByLabel('Čtyřmístný kód').fill('9999');await page.getByRole('button',{name:'Pokračovat'}).click();await page.locator('p[role=alert]').waitFor();resolveRestore();
 await page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/phone-onboarding')).catch(()=>{});
 await page.waitForTimeout(200);
 const paymentVisible=await page.getByRole('heading',{name:'DigiPřítel - AI společník na telefonu'}).isVisible();
 if(process.env.EXPECT_OLD_BUG==='1'){assert.equal(paymentVisible,true);console.log('Reproduced old bug: rejected code plus late restored session displays payment');}
 else {assert.equal(paymentVisible,false);await page.getByRole('heading',{name:'Zadejte kód z hovoru'}).waitFor();console.log('Rejected code survives late session restore; payment hidden');}
 await context.close();
 if(process.env.EXPECT_OLD_BUG==='1')process.exitCode=0;
 else for(const scenario of ['invalid','unconfirmed','success','expired']){
  const ctx=await newContext();const p=await ctx.newPage();
  await p.route('**/api/myfriend/phone-onboarding',async route=>{
   const req=route.request();if(req.method()==='GET')return route.fulfill({json:{ready:false}});
   const body=req.postDataJSON();
   if(body.action==='code')return route.fulfill({status:scenario==='invalid'?400:200,json:scenario==='invalid'?{error:'Invalid code'}:scenario==='unconfirmed'?{}:{ok:true}});
   return route.fulfill({status:401,json:{error:'Expired ticket'}});
  });
  const initialized=p.waitForResponse(r=>r.request().method()==='GET'&&r.url().endsWith('/phone-onboarding'));await p.goto(base+'/myfriend/call',{waitUntil:'domcontentloaded'});await initialized;await p.getByRole('button',{name:'Mám kód'}).click();await p.getByLabel('Čtyřmístný kód').fill('0042');await p.getByRole('button',{name:'Pokračovat'}).click();
  if(['invalid','unconfirmed'].includes(scenario)){await p.locator('p[role=alert]').waitFor();assert.equal(await p.getByRole('heading',{name:'DigiPřítel - AI společník na telefonu'}).isVisible(),false);}
  else {await p.getByRole('heading',{name:'DigiPřítel - AI společník na telefonu'}).waitFor();const pay=p.getByRole('button',{name:'Zaplatit 300 Kč měsíčně'});assert.equal(await pay.isDisabled(),true);await p.getByRole('checkbox').check();if(scenario==='expired'){await pay.click();await p.getByRole('heading',{name:'Zadejte kód z hovoru'}).waitFor();await p.locator('p[role=alert]').waitFor();assert.equal(await pay.isVisible(),false);}}
  console.log(scenario+' browser flow passed');await ctx.close();
 }
}finally{await browser.close();}
