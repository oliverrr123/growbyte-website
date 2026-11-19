import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser = await chromium.launch({headless:true,channel:'chrome'});
try {
  const page = await browser.newPage({viewport:{width:402,height:740},reducedMotion:'reduce'});
  await page.route('**/api/myfriend/onboarding', r => r.fulfill({json:{paid:true,stage:'buyer'}}));
  let sent;
  await page.route('**/api/myfriend/verify/send', r => { sent=r.request().postDataJSON(); return r.fulfill({json:{ok:true,phone:'+14153771909'}}); });
  await page.goto('http://localhost:3000/myfriend/onboarding?setup=1');
  const input=page.locator('input[type=tel]');
  await input.fill('+14153771909'); assert.equal(await input.inputValue(), '+1 415 377 1909');
  await input.fill('4153771909'); assert.equal(await input.inputValue(), '(415) 377-1909');
  await input.fill(''); await input.pressSequentially('4153771909'); assert.equal(await input.inputValue(), '(415) 377-1909');
  await input.evaluate(e => { e.focus(); e.setSelectionRange(6,6); });
  await input.press('Backspace'); assert.equal((await input.inputValue()).replace(/\D/g,''), '413771909');
  await input.fill('+420776781248'); assert.equal(await input.inputValue(), '+420 776 781 248');
  await input.fill('4153771909'); await page.screenshot({path:'/tmp/myfriend-formatted-phone.png',fullPage:true});
  await page.getByRole('button',{name:'Send verification code',exact:true}).click();
  await page.getByRole('heading',{name:'Enter the verification code',exact:true}).waitFor();
  assert.equal(sent.phone, '(415) 377-1909');
  assert.ok((await page.locator('.mf-onboarding').innerText()).includes('+1 415 377 1909'));
  console.log('PASS: typing, pasting, separator deletion, international numbers, and verification display. No SMS sent.');
} finally { await browser.close(); }
