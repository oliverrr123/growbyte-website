// Run against an isolated `next build && next start` with no production credentials.
// PRODUCTION_GUARD_BASE=http://localhost:3109 node tests/myfriend-production-guards-browser.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.PRODUCTION_GUARD_BASE;
assert.ok(base, 'Set PRODUCTION_GUARD_BASE to an isolated production build');
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Use a local isolated build');
for (const method of ['GET', 'POST']) {
  assert.equal((await fetch(base + '/api/myfriend/test-checkout', { method })).status, 404);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/start?testCheckout=1&testPaid=1');
  assert.equal(await page.getByRole('heading', { name: 'Děkujeme!', exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Mám kód', exact: true }).click();
  await page.getByRole('textbox').fill('4242');
  await page.getByRole('button', { name: 'Pokračovat', exact: true }).click();
  await page.locator('[role=alert]').waitFor();
  assert.equal(await page.getByRole('heading', { name: 'Děkujeme!', exact: true }).count(), 0);
  await page.goto(base + '/digipritel/dashboard?preview=1');
  await page.waitForURL('**/digipritel/login');
  assert.deepEqual(errors, []);
  console.log('PASS: production rejects test checkout, testPaid, preview code, and dashboard bypasses.');
} finally {
  await browser.close();
}

for (const [host, path, expected] of [
  ['digipritel.cz', '/', 'DigiPřítel'],
  ['digipritel.cz', '/start', 'DigiPřítel'],
  ['digipritel.cz', '/login', 'Přihlásit'],
  ['digipritel.cz', '/podminky', 'podmínky'],
  ['digipritel.cz', '/soukromi', 'soukromí'],
  ['trymyfriend.com', '/', 'MyFriend'],
  ['trymyfriend.com', '/onboarding', 'MyFriend'],
]) {
  // Emulate the deployment proxy without sending traffic to the public site.
  const response = await fetch(base + path, { headers: { 'x-forwarded-host': host } });
  assert.equal(response.status, 200, host + path);
  assert.ok((await response.text()).toLowerCase().includes(expected.toLowerCase()), host + path);
}
console.log('PASS: Czech and English production hostname routing.');
