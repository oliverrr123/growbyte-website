import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = process.env.ONBOARDING_UI_BASE || 'http://localhost:3000';

const browser = await chromium.launch({headless:true,channel:'chrome'});
try {
  const page = await browser.newPage({viewport:{width:402,height:740},reducedMotion:'reduce'});
  let stage = 'thank-you';
  await page.route('**/api/myfriend/onboarding', route => {
    if (route.request().method() === 'POST') {
      assert.equal(route.request().postDataJSON().action, 'thank-you');
      stage = 'buyer';
      return route.fulfill({json:{ok:true,stage}});
    }
    return route.fulfill({json:{paid:true,stage}});
  });
  await page.goto(base + '/myfriend/onboarding?setup=1');
  await page.getByRole('heading',{name:'Thank you!',exact:true}).waitFor();
  assert.equal(await page.locator('.mf-payment-success img').count(), 0);
  assert.equal(await page.locator('input[type=tel]').count(), 0);
  const height = await page.locator('body').evaluate(el => el.scrollHeight);
  assert.ok(height <= 745, `Thank-you screen should fit the phone viewport, got ${height}px`);
  await page.screenshot({path:'/tmp/myfriend-thank-you-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.getByRole('heading',{name:'First, verify your phone.',exact:true}).waitFor();
  await page.reload();
  await page.getByRole('heading',{name:'First, verify your phone.',exact:true}).waitFor();
  console.log('PASS: mobile thank-you fits; Continue opens verification; reload resumes verification.');
} finally {
  await browser.close();
}
