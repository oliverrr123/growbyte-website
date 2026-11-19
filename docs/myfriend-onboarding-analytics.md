# MyFriend onboarding analytics

Live since September 19, 2026. Dashboard: https://us.posthog.com/project/215678/dashboard/2114495

- Every onboarding screen → paid: https://us.posthog.com/project/215678/insights/CG3vzbUn
- Optional contact questions: https://us.posthog.com/project/215678/insights/6oTjZ1P5
- After payment → account ready: https://us.posthog.com/project/215678/insights/P8I16sJu

Funnels count unique PostHog visitors in order, allow intervening events, use a 7-day conversion window, and show percentages relative to the previous step over the last 30 days. The 17 common question screens form the main funnel. The two optional contact questions have a separate branch. Reloads and returning visitors can resume without manufacturing earlier screen views. Historical visits cannot be reconstructed.

Events:

| Event | When |
| --- | --- |
| myfriend_onboarding_step_viewed | Restored screen becomes visible; step_id and questions/setup phase |
| myfriend_checkout_started | Checkout API succeeds, immediately before redirect |
| myfriend_checkout_failed | Checkout API fails; no error text or answers attached |
| myfriend_payment_completed | Stripe-signed completed checkout, or server-verified paid return; requires complete and paid |
| myfriend_onboarding_completed | Server accepts final setup action, before dashboard navigation |

The browser's anonymous PostHog UUID is passed through Stripe metadata to join payment to onboarding. Only UUID identifiers are accepted; custom events don't include answers, phone numbers, email or OTP values. Payment events have a deterministic UUID for retries. Captures respect browser opt-out; analytics failures never fail payment/account activation. Payments remain best-effort analytics, not a billing ledger.

All saved funnels require analytics_environment=production and flow_version=loved-one-v4. Browser production means trymyfriend.com or www.trymyfriend.com; server payments also require Stripe livemode. Local/preview events and test-mode payments are excluded. Older checkout sessions without analytics metadata may not appear. Ad blockers and opted-out browsers will not be represented.

Release: dpl_GibkpPBeNW3rZWrdpbEyQKKoqbXS
https://growbyte-website-2lf8suse1-olivers-projects-d2129a21.vercel.app

Built from the SHA-1-verified source of prior live deployment dpl_FxNouF3MGm585qmxUj9aLKXXZir9, with only analytics edits. Assigned only trymyfriend.com and www.trymyfriend.com; growbyte.co and www.growbyte.co remained on dpl_FzxHvKvYBfhkrSt7wD4xzsWFNFrv. Isolated patch: artifacts/status/myfriend-onboarding-analytics.patch.

Validation: TypeScript and production builds passed; 16 focused unit/regression tests passed. Headless Chrome verified both 19-screen and 17-screen paths, restored history, checkout failure/success redirect capture, all paid setup stages and completion, on the isolated local production build and live MyFriend domain. All payment/SMS/setup APIs and analytics were intercepted for those browser suites: no real payments, codes or customer messages. A separate two-screen local test was ingested into PostHog with analytics_environment=test and confirmed by the native funnel query (1→1). Existing lint warnings are unrelated to this patch.

Run:

```sh
node --test tests/myfriend-analytics.test.mjs tests/myfriend-billing.test.mjs tests/myfriend-onboarding-history.test.mjs
ANALYTICS_TEST_URL=http://localhost:3107 node tests/myfriend-analytics-browser.mjs
```
