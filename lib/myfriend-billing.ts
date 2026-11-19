import type Stripe from "stripe";
import { myfriendApi } from "@/lib/myfriend-api";

function testPaymentTargetsProduction(livemode: boolean | undefined) {
  if (livemode !== false) return false;
  try { return new URL(process.env.MYFRIEND_API_URL || "").hostname === "api-nameless-water-1932.fly.dev"; }
  catch { return false; }
}

const testPaymentError = { ok: false as const, status: 409, error: "Test payments cannot activate or update production accounts." };

function idOf(value: unknown): string | null {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "string") return id;
  }
  return null;
}

function emailFromSession(session: Stripe.Checkout.Session) {
  return (
    session.customer_details?.email ||
    session.customer_email ||
    (typeof session.customer === "object" && session.customer && "email" in session.customer
      ? (session.customer.email as string | null)
      : null) ||
    null
  );
}

export function periodEndFromSubscription(subscription: Stripe.Subscription | null) {
  if (!subscription) return null;
  const legacy =
    "current_period_end" in subscription
      ? Number(subscription.current_period_end)
      : NaN;
  // Stripe Basil+ moved billing periods onto subscription items.
  const itemEnds = subscription.items?.data.map(item => item.current_period_end).filter(value => Number.isFinite(value) && value > 0) ?? [];
  const unix = Number.isFinite(legacy) && legacy > 0 ? legacy : itemEnds.length ? Math.min(...itemEnds) : NaN;
  if (!Number.isFinite(unix) || unix <= 0) return null;
  return new Date(unix * 1000).toISOString();
}

/** Seats come from the Stripe price metadata "seats"; env price IDs are a fallback. */
export function planFromSubscription(subscription: Stripe.Subscription | null): { seat_limit?: number; plan_price_id?: string } {
  const price = subscription?.items?.data?.[0]?.price;
  if (!price?.id) return {};
  const fromMetadata = Number(price.metadata?.seats);
  const seats = Number.isInteger(fromMetadata) && fromMetadata >= 1 && fromMetadata <= 10
    ? fromMetadata
    : price.id === process.env.STRIPE_PRICE_ID_DUO ? 2
    : price.id === process.env.STRIPE_PRICE_ID ? 1
    : undefined;
  return { plan_price_id: price.id, ...(seats ? { seat_limit: seats } : {}) };
}

export async function activateFromCheckoutSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; error: string }> {
  if (testPaymentTargetsProduction(session.livemode)) return testPaymentError;
  // Payment precedes phone setup in the loved-one flow. Read current metadata
  // because webhook payloads can predate the completed setup.
  if (session.metadata?.flow === "loved-one-onboarding") {
    session = await stripe.checkout.sessions.retrieve(session.id);
    if (testPaymentTargetsProduction(session.livemode)) return testPaymentError;
    if (!session.metadata?.phone) return { ok: true, data: { pendingSetup: true } };
  }
  if (session.payment_status !== "paid" || session.status !== "complete") {
    return { ok: false, status: 409, error: "Checkout payment is not complete." };
  }
  const phone = session.metadata?.phone;
  if (!phone) {
    return { ok: false, status: 400, error: "No phone number on this order." };
  }

  let subscription: Stripe.Subscription | null = null;
  const subscriptionId = idOf(session.subscription);
  if (subscriptionId) {
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  }

  return myfriendApi("/api/activateSubscription", {
    method: "POST",
    body: {
      buyer_phone: phone,
      ...(session.metadata?.flow === "loved-one-onboarding" ? { checkout_session_id: session.id } : {}),
      email: subscription?.metadata?.email || session.metadata?.recovery_email || emailFromSession(session),
      stripe_customer_id: idOf(session.customer),
      stripe_subscription_id: subscriptionId,
      status: subscription?.status ?? "active",
      current_period_end: periodEndFromSubscription(subscription),
      ...planFromSubscription(subscription),
    },
  });
}

export async function syncFromStripeSubscription(
  subscription: Stripe.Subscription,
  extra?: { buyerPhone?: string | null; email?: string | null },
) {
  if (testPaymentTargetsProduction(subscription.livemode)) return testPaymentError;
  return myfriendApi("/api/syncStripeSubscription", {
    method: "POST",
    body: {
      stripe_subscription_id: subscription.id,
      stripe_customer_id: idOf(subscription.customer),
      buyer_phone: extra?.buyerPhone ?? subscription.metadata?.phone ?? null,
      email: extra?.email ?? subscription.metadata?.email ?? null,
      status: subscription.status,
      current_period_end: periodEndFromSubscription(subscription),
      ...planFromSubscription(subscription),
    },
  });
}
