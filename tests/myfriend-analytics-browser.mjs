import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
const base = process.env.ANALYTICS_TEST_URL || 'http://localhost:3107';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
function eventsFrom(request) {
  let b = request.postDataBuffer();
  if (!b) return [];
  try {
    if (b[0] === 31 && b[1] === 139) b = gunzipSync(b);
    let str = b.toString();
    if (str.startsWith('data=')) str = Buffer.from(new URLSearchParams(str).get('data'), 'base64').toString();
    const x = JSON.parse(str);
    return Array.isArray(x) ? x : [x];
  } catch { return []; }
}
try {
 for (const together of [false, true]) {
  const context = await browser.newContext({ reducedMotion: 'reduce', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' });
  // PostHog intentionally filters automation. Simulate a regular browser for this intercepted test.
  await context.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  const page = await context.newPage();
  const events = [], requests = [], errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', async route => {
    const req = route.request();
    if (/posthog\.com|\/ingest\//.test(req.url())) {
      events.push(...eventsFrom(req).filter(x => x.event?.startsWith('myfriend_')));
      if (new URL(req.url()).pathname.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: '' });
      return route.fulfill({ json: { status: 1, featureFlags: {}, supportedCompression: [] } });
    }
    if (req.url().includes('/api/myfriend/')) {
      if (req.method() === 'GET') return route.fulfill({ json: { paid: false } });
      requests.push(req.postDataJSON());
      return route.fulfill({ status: 503, json: { error: 'Test checkout failure' } });
    }
    return route.continue();
  });
  await page.goto(base + '/myfriend/onboarding');
  const expected = ['intro','relationship','goals','capabilities','age','distance',...(!together ? ['remote-contact','physical-contact'] : []),'reflection','technology','technology-response','habits','reminders','cadence','reports','building','plan','cost','pricing'];
  for (const step of expected) {
    const section = page.locator('.mf-step-' + step);
    await section.waitFor();
    await page.waitForFunction(() => document.querySelector('[data-testid="onboarding-content"]')?.dataset.transitionPhase === 'idle');
    await page.waitForFunction(step => JSON.parse(sessionStorage.getItem('myfriend-loved-one-v4') || '{}').stepId === step, step);
    if (step === 'pricing') break;
    if (step === 'building') continue;
    if (step === 'distance') await section.getByRole('button', { name: together ? 'We live together' : 'We live far apart', exact: true }).click();
    else if (['relationship','age','remote-contact','physical-contact','technology','cadence'].includes(step)) await section.locator('button[aria-pressed]').first().click();
    else {
      if (['goals','habits'].includes(step)) await section.locator('button[aria-pressed]').first().click();
      await section.locator('.mf-primary').click();
    }
  }
  // Wait for the real SDK to deliver the last screen event, not just React's effect.
  await page.waitForTimeout(500);
  assert.deepEqual(events.filter(e => e.event === 'myfriend_onboarding_step_viewed').map(e => e.properties.step_id), expected);
  const id = events[0].properties.distinct_id;
  await page.getByRole('button', { name: 'Continue with annual', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Test checkout failure' }).waitFor();
  await page.waitForTimeout(200);
  assert.equal(requests[0].analytics.distinct_id, id);
  assert.equal(events.filter(e => e.event === 'myfriend_checkout_failed').length, 1);
  assert.equal(events.filter(e => e.event === 'myfriend_payment_completed').length, 0);
  // Reload restores pricing without manufacturing views for preceding history entries.
  const before = events.length;
  await page.reload();
  await page.locator('.mf-step-pricing').waitFor();
  await page.waitForTimeout(600);
  assert.deepEqual(events.slice(before).filter(e => e.event === 'myfriend_onboarding_step_viewed').map(e => e.properties.step_id), ['pricing']);
  await page.route('**/api/myfriend/onboarding', route => route.fulfill({ json: { url: '/mock-stripe' } }));
  await page.route('**/mock-stripe', route => route.fulfill({ contentType: 'text/html', body: 'Mock checkout' }));
  await page.getByRole('button', { name: 'Continue with annual', exact: true }).click();
  await page.waitForURL('**/mock-stripe');
  await page.waitForTimeout(200);
  assert.equal(events.filter(e => e.event === 'myfriend_checkout_started').length, 1);
  for (const e of events) {
    assert.equal(e.properties.analytics_environment, /^(www\.)?trymyfriend\.com$/.test(new URL(base).hostname) ? 'production' : 'test');
    for (const field of ['answers','phone','email','relationship','goals','habits']) assert.equal(e.properties[field], undefined);
  }
  assert.deepEqual(errors, []);
  console.log(`PASS ${together ? 'together' : 'apart'}: ${expected.length} real screen events; checkout identity, error, restored history and privacy checks`);
  await context.close();
 }
 // Resume each paid setup screen; synthetic server responses never charge or send codes.
 const context = await browser.newContext({ reducedMotion: 'reduce', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' });
 await context.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
 const page = await context.newPage();
 const events = [];
 let stage = 'thank-you';
 await page.route('**/*', route => {
   const req = route.request();
   if (/posthog\.com|\/ingest\//.test(req.url())) {
     events.push(...eventsFrom(req).filter(x => x.event?.startsWith('myfriend_')));
     return new URL(req.url()).pathname.endsWith('.js') ? route.fulfill({ contentType: 'text/javascript', body: '' }) : route.fulfill({ json: { status: 1, featureFlags: {}, supportedCompression: [] } });
   }
   if (req.url().includes('/api/myfriend/')) return route.fulfill({ json: req.method() === 'GET' ? { paid: true, stage } : { ok: true } });
   if (req.url().endsWith('/dashboard')) return route.fulfill({ contentType: 'text/html', body: 'Mock dashboard' });
   return route.continue();
 });
 for (stage of ['thank-you','buyer','senior','email','welcome']) {
   const before = events.length;
   await page.goto(base + '/myfriend/onboarding?setup=1');
   await page.locator('[data-testid="onboarding-content"]').waitFor();
   await page.waitForTimeout(400);
   assert.deepEqual(events.slice(before).filter(e => e.event === 'myfriend_onboarding_step_viewed').map(e => e.properties.step_id), [stage]);
 }
 await page.getByRole('button', { name: 'Open my dashboard', exact: true }).click();
 await page.waitForURL('**/dashboard');
 await page.waitForTimeout(200);
 assert.equal(events.filter(e => e.event === 'myfriend_onboarding_completed').length, 1);
 assert.equal(events.filter(e => e.event === 'myfriend_payment_completed').length, 0);
 console.log('PASS paid setup: each restored stage and confirmed completion; browser never manufactures payment events');
 await context.close();
} finally { await browser.close(); }
