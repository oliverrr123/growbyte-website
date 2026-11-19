import { PostHog } from "posthog-node";
import { createHash } from "node:crypto";
import type Stripe from "stripe";
import { ANALYTICS_EVENTS, ANALYTICS_VERSION, anonymousAnalyticsId } from "./myfriend-analytics";

export async function capturePaidCheckout(session: Stripe.Checkout.Session) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  const distinctId = anonymousAnalyticsId(session.metadata?.analytics_distinct_id);
  if (!key || !distinctId || session.metadata?.flow !== "loved-one-onboarding" ||
      session.status !== "complete" || session.payment_status !== "paid") return;
  const client = new PostHog(key, { host: "https://us.i.posthog.com", requestTimeout: 1500, fetchRetryCount: 0, disableGeoip: true });
  const hash = createHash("sha256").update(`myfriend-payment-${session.id}`).digest("hex");
  const uuid = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
  try {
    await client.captureImmediate({
      distinctId,
      event: ANALYTICS_EVENTS.paid,
      uuid,
      properties: {
        // Same ID for webhook retries and the verified return-page fallback.
        flow_version: ANALYTICS_VERSION,
        analytics_environment: session.livemode && session.metadata?.analytics_environment === "production" ? "production" : "test",
        billing_plan: session.metadata?.plan === "annual" ? "annual" : "monthly",
      },
    });
  } catch {
    // An analytics outage must not interrupt a payment or account activation.
    console.warn("MyFriend payment analytics unavailable");
  } finally {
    await client.shutdown().catch(() => {});
  }
}
