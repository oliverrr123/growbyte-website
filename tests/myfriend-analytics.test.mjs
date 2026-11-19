import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';
function load(file, deps = {}, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { exports, require: name => deps[name], console, process: { env: { NEXT_PUBLIC_POSTHOG_KEY: 'test' } }, ...globals });
  return exports;
}
const core = load('lib/myfriend-analytics.ts');
const id = '019959cd-44d0-7000-8000-000000000001';
test('analytics metadata accepts only anonymous IDs and derives environment from host', () => {
  for (const value of ['person@example.com', '+420777123456', {}, null, '']) {
    assert.equal(Object.keys(core.checkoutAnalyticsMetadata({ distinct_id: value }, 'trymyfriend.com')).length, 0);
  }
  const result = core.checkoutAnalyticsMetadata({ distinct_id: id, email: 'private@example.com', environment: 'production' }, 'localhost');
  assert.equal(result.analytics_environment, 'test');
  assert.equal(result.email, undefined);
  assert.equal(core.checkoutAnalyticsMetadata({ distinct_id: id }, 'www.trymyfriend.com').analytics_environment, 'production');
  assert.equal(core.analyticsEnvironment('trymyfriend.com.evil.example'), 'test');
});
function paidModule(fail = false) {
  const calls = [];
  let closed = 0;
  class PostHog {
    async captureImmediate(event) { calls.push(event); if (fail) throw Error('offline'); }
    async shutdown() { closed++; }
  }
  return { calls, closed: () => closed, ...load('lib/myfriend-analytics-server.ts', { 'posthog-node': { PostHog }, 'node:crypto': crypto, './myfriend-analytics': core }) };
}
const paid = { id: 'cs_test_analytics', status: 'complete', payment_status: 'paid', livemode: true, metadata: { flow: 'loved-one-onboarding', analytics_distinct_id: id, analytics_environment: 'production', plan: 'annual', phone: '+420777123456', recovery_email: 'private@example.com' } };
test('only confirmed paid checkouts are captured, including retries with a stable UUID', async () => {
  const m = paidModule();
  for (const session of [{ ...paid, status: 'open' }, { ...paid, payment_status: 'unpaid' }, { ...paid, metadata: {} }]) await m.capturePaidCheckout(session);
  assert.equal(m.calls.length, 0);
  await m.capturePaidCheckout(paid);
  await m.capturePaidCheckout(paid);
  assert.equal(m.calls[0].uuid, m.calls[1].uuid);
  assert.equal(m.calls[0].distinctId, id);
  assert.equal(m.calls[0].properties.analytics_environment, 'production');
  assert.equal(JSON.stringify(m.calls).includes('private@example.com'), false);
  assert.equal(JSON.stringify(m.calls).includes('+420777123456'), false);
  await m.capturePaidCheckout({ ...paid, livemode: false });
  assert.equal(m.calls[2].properties.analytics_environment, 'test');
  assert.equal(m.closed(), 3);
});
test('analytics outage cannot fail a paid checkout', async () => {
  const m = paidModule(true);
  await m.capturePaidCheckout(paid);
  assert.equal(m.closed(), 1);
});
test('browser respects opt-out and does not wait for SDK loading', async () => {
  const client = load('lib/myfriend-analytics-client.ts', { './myfriend-analytics': core, './posthog-client': { getPostHogClient: () => new Promise(() => {}), currentPostHogClient: () => ({ has_opted_out_capturing: () => true }) } }, { window: { location: { hostname: 'trymyfriend.com' } } });
  assert.equal(client.captureOnboarding(core.ANALYTICS_EVENTS.screen, { step_id: 'intro' }), undefined);
  assert.equal(client.checkoutAnalyticsContext(), undefined);
});
test('verified checkout webhook schedules analytics without changing activation', async () => {
  const tasks = [], captures = [];
  let activated = 0;
  const route = load('app/api/myfriend/stripe/webhook/route.ts', {
    '@/lib/myfriend': { jsonError: (error, status) => Response.json({ error }, { status }) },
    'next/server': { after: fn => tasks.push(fn) },
    '@/lib/myfriend-analytics-server': { capturePaidCheckout: async session => captures.push(session) },
    '@/lib/myfriend-providers': { stripeClient: () => ({ webhooks: { constructEvent: () => ({ type: 'checkout.session.completed', data: { object: paid } }) } }) },
    '@/lib/myfriend-billing': { activateFromCheckoutSession: async () => { activated++; return { ok: true }; } },
  }, { Response, process: { env: { STRIPE_WEBHOOK_SECRET: 'test' } } });
  const response = await route.POST(new Request('https://trymyfriend.com/api/myfriend/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': 'test' }, body: '{}' }));
  assert.equal(response.status, 200);
  assert.equal(activated, 1);
  assert.equal(tasks.length, 1);
  await tasks[0]();
  assert.equal(captures[0].id, paid.id);
});
