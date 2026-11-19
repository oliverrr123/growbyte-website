import { jsonError } from "@/lib/myfriend";
import { after } from "next/server";
import { capturePaidCheckout } from "@/lib/myfriend-analytics-server";
import { stripeClient } from "@/lib/myfriend-providers";
import { activateFromCheckoutSession, syncFromStripeSubscription } from "@/lib/myfriend-billing";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = stripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return jsonError("Stripe webhook isn't set up yet.", 503);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return jsonError("Missing Stripe signature.", 400);
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature failed", error);
    return jsonError("Invalid Stripe signature.", 400);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      after(() => capturePaidCheckout(session));
      const result = await activateFromCheckoutSession(stripe, session);
      if (!result.ok) {
        console.error("activateFromCheckoutSession failed", result);
        return jsonError(result.error, result.status);
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.created"
    ) {
      // Events can arrive out of order: sync the current Stripe state.
      const subscription = await stripe.subscriptions.retrieve((event.data.object as Stripe.Subscription).id);
      const result = await syncFromStripeSubscription(subscription);
      if (!result.ok && result.status !== 404) {
        console.error("syncFromStripeSubscription failed", result);
        return jsonError(result.error, result.status);
      }
    }

    if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string | Stripe.Subscription | null;
      };
      const parentSub =
        invoice.parent &&
        typeof invoice.parent === "object" &&
        "subscription_details" in invoice.parent
          ? (
              invoice.parent as {
                subscription_details?: { subscription?: string | Stripe.Subscription };
              }
            ).subscription_details?.subscription
          : null;
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription && typeof invoice.subscription === "object"
            ? invoice.subscription.id
            : typeof parentSub === "string"
              ? parentSub
              : parentSub && typeof parentSub === "object"
                ? parentSub.id
                : null;
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const result = await syncFromStripeSubscription(subscription, {
          email: invoice.customer_email,
        });
        // 404 is expected before the buyer completes phone setup.
        if (!result.ok && result.status !== 404) return jsonError(result.error, result.status);
      }
    }
  } catch (error) {
    console.error("Stripe webhook handler failed", error);
    return jsonError("Webhook handler failed.", 500);
  }

  return Response.json({ received: true });
}
