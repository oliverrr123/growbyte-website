import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PHONE_UI_BASE || 'http://localhost:3000';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const width of [320,393,1440]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const calls=[];
  page.on('request',r=>{if(r.url().includes('/api/myfriend/'))calls.push(r.url());});
  // Payment confirmation is a fixture. This test does not charge or send SMS.
  await page.route('**/api/myfriend/test-checkout',r=>r.fulfill({json:{paid:true}}));
  await page.route('**/api/myfriend/verify/send',r=>r.fulfill({json:{ok:true,phone:r.request().postDataJSON().phone}}));
  await page.route('**/api/myfriend/verify/check',r=>{
   const valid=r.request().postDataJSON().code==='123456';
   return r.fulfill({status:valid?200:400,json:valid?{ok:true}:{error:'Invalid test code'}});
  });
  await page.goto(base+'/start?testCheckout=1&testPaid=1');
  await page.getByRole('heading',{name:'Děkujeme!',exact:true}).waitFor();
  assert.equal(await page.locator('.mf-payment-success img').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`artifacts/czech-redesign/payment-success-${width}.png`,fullPage:true});
  await page.getByRole('button',{name:'Pokračovat',exact:true}).click();
  await page.getByLabel('Telefonní číslo',{exact:true}).fill('+420700000001');
  await page.getByRole('button',{name:'Poslat ověřovací SMS'}).click();
  await page.getByLabel('Kód z SMS').fill('000000');
  await page.getByRole('button',{name:'Ověřit číslo'}).click();
  await page.locator('p[role=alert]').waitFor();
  await page.getByLabel('Kód z SMS').fill('123456');
  await page.getByRole('button',{name:'Ověřit číslo'}).click();
  await page.getByRole('button',{name:'Přidat číslo později'}).click();
  await page.getByLabel('E-mail',{exact:true}).fill('preview@example.com');
  await page.getByRole('button',{name:'Pokračovat',exact:true}).click();
  await page.getByRole('button',{name:'Otevřít můj účet'}).click();
  await page.waitForURL('**/digipritel/dashboard?preview=1');
  await page.getByRole('heading',{name:'Číslo DigiPřítele'}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Zkopírovat číslo DigiPřítele'}).innerText(),'+420 910 920 500');
  await page.getByRole('checkbox',{name:'Pravidelné hovory'}).check();
  await page.getByText('Denní zprávy pro rodinu',{exact:true}).waitFor({state:'attached'});
  await page.getByRole('checkbox',{name:/Chci dostávat denní zprávy/}).click();
  await page.getByText('Denní zprávy jsou zapnuté na 20:00.').waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`artifacts/czech-redesign/dashboard-${width}.png`,fullPage:true});
  await page.getByRole('button',{name:'Nastavení',exact:true}).click();
  await page.getByRole('menuitem',{name:'Spravovat předplatné'}).waitFor();
  await page.keyboard.press('Escape');
  const phone=page.getByRole('textbox',{name:'Vaše číslo',exact:true});
  await phone.fill('+420700000003');await phone.press('Enter');
  await page.getByRole('textbox',{name:'Ověřovací kód'}).fill('123456');
  await page.getByRole('textbox',{name:'Vaše číslo',exact:true}).waitFor();
  assert.equal(calls.filter(u=>!u.endsWith('/test-checkout')&&!u.includes('/verify/')).length,0,'Preview must not contact real account APIs; verification requests are mocked');
  await page.close();console.log(`${width}px: Czech success → simulated setup → isolated Czech dashboard passed`);
 }
 for (const locale of ['cs','en']) {
  const p=await browser.newPage();
  await p.route('**/api/myfriend/account',r=>r.fulfill({json:{buyer_phone_number:'+420700000001',senior_phone_number:'+420700000001',using_own_number:true,email:'returning@example.com',status:'active',senior_first_name:null}}));
  await p.route('**/api/myfriend/account/schedule',r=>r.fulfill({json:{saved:true,schedule:{enabled:false,frequency:'daily',weekdays:[0,1,2,3,4,5,6],windows:[{start:1080,end:1260}],timezone:'Europe/Prague'}}}));
  await p.goto(base+(locale==='cs'?'/digipritel/dashboard':'/myfriend/dashboard'));
  await p.getByRole('heading',{name:locale==='cs'?'Číslo DigiPřítele':'MyFriend’s number',exact:true}).waitFor();
  assert((await p.locator('body').innerText()).includes(locale==='cs'?'+420 910 920 500':'+1 949 676 7670'));
  await p.close();
 }
 console.log('Authenticated Czech/English dashboard fixtures preserve regional phone numbers and self-use accounts');
 const page=await browser.newPage();
 await page.route('**/api/myfriend/account',r=>r.fulfill({status:401,json:{error:'Please log in.'}}));
 await page.goto(base+'/digipritel/dashboard');await page.waitForURL('**/digipritel/login');
 await page.getByRole('heading',{name:'Přihlásit se',exact:true}).waitFor();
 await page.route('**/api/myfriend/email-login/send',r=>r.fulfill({json:{email:'preview@example.com'}}));
 await page.getByRole('textbox',{name:'E-mailová adresa'}).fill('preview@example.com');await page.getByRole('button',{name:'Poslat kód e-mailem'}).click();
 await page.getByRole('textbox',{name:'Ověřovací kód'}).waitFor();
 await page.goto(base+'/myfriend/login');await page.getByRole('heading',{name:'Log in',exact:true}).waitFor();
 await page.close();console.log('Czech authentication redirect and translated email-code UI passed; English login preserved');
} finally {await browser.close();}
