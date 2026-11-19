import type Stripe from "stripe";
import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { stripeClient } from "@/lib/myfriend-providers";
import { jsonError } from "@/lib/myfriend";
import { planFromSubscription, syncFromStripeSubscription } from "@/lib/myfriend-billing";

// Switches the customer's single-person subscription to the two-person price in
// the same currency. Prices are found by Stripe lookup key "myfriend_duo_<currency>"
// (e.g. myfriend_duo_usd, myfriend_duo_czk); STRIPE_PRICE_ID_DUO is a USD fallback.
// { preview: true } only returns the new monthly price; nothing is changed.
export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const account = await dashboardAccount();
  if (!account) return jsonError("Please log in.", 401);
  const stripe = stripeClient();
  if (!stripe || !account.stripe_customer_id) return jsonError("Upgrading isn't available yet.", 503);
  if (account.status !== "active") return jsonError("Your plan needs to be active before upgrading.", 409);
  if ((account.seat_limit ?? 1) >= 2) return jsonError("Your plan already includes more than one person.", 409);
  const body = await request.json().catch(() => null) as { preview?: boolean } | null;

  try {
    const list = await stripe.subscriptions.list({ customer: account.stripe_customer_id, status: "active", limit: 3 });
    const current = list.data.filter(sub => !sub.metadata?.phone || sub.metadata.phone === account.buyer_phone_number);
    if (current.length !== 1) return jsonError("We couldn't find your plan to upgrade. Please contact us.", 409);
    const subscription: Stripe.Subscription = current[0];
    const item = subscription.items.data[0];
    if (!item || subscription.items.data.length !== 1) return jsonError("We couldn't upgrade this plan automatically. Please contact us.", 409);
    const currency = item.price.currency;
    const found = await stripe.prices.list({ lookup_keys: [`myfriend_duo_${currency}`], active: true, limit: 1 });
    const price = found.data[0] ?? (currency === "usd" && process.env.STRIPE_PRICE_ID_DUO ? await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID_DUO) : null);
    if (!price) return jsonError("Adding another person isn't available for your plan yet. Please contact us.", 409);
    if (item.price.currency !== price.currency || price.recurring?.interval !== item.price.recurring?.interval)
      return jsonError("We couldn't upgrade this plan automatically. Please contact us.", 409);
    if (!price.active || !price.unit_amount) return jsonError("Upgrading isn't available yet.", 503);

    if (body?.preview) {
      return Response.json({ amount: price.unit_amount, currency: price.currency, interval: price.recurring?.interval, seats: planFromSubscription({ items: { data: [{ price }] } } as unknown as Stripe.Subscription).seat_limit ?? 2 });
    }

    const updated = await stripe.subscriptions.update(subscription.id, {
      items: [{ id: item.id, price: price.id }],
      proration_behavior: "create_prorations",
    }, { idempotencyKey: `myfriend-upgrade-${subscription.id}-${price.id}` });
    // The webhook also syncs this; doing it here makes the dashboard update immediately.
    try {
      const synced = await syncFromStripeSubscription(updated, { buyerPhone: account.buyer_phone_number });
      if (!synced.ok) console.error("upgrade sync failed; webhook will retry", synced);
    } catch (error) { console.error("upgrade sync failed; webhook will retry", error); }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("MyFriend upgrade failed", error);
    return jsonError("Couldn't upgrade right now. You haven't been charged.", 502);
  }
}
