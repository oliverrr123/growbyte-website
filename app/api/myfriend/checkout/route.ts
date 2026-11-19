import { legalAcceptanceMetadata } from "@/lib/myfriend-legal";
import { cookies } from "next/headers";
import { readVerifiedPhone } from "@/lib/myfriend-auth";
import {
  checkoutReturnPaths,
  jsonError,
  MYFRIEND_MONTHLY_CENTS,
  VERIFIED_COOKIE,
} from "@/lib/myfriend";
import { stripeClient } from "@/lib/myfriend-providers";

export async function POST(request: Request) {
  let body;
  try { body = await request.json(); } catch { return jsonError("Please agree to the current terms before checkout."); }
  const legal = legalAcceptanceMetadata(body?.legal);
  if (!legal) return jsonError("Please agree to the current terms before checkout.");
  const jar = await cookies();
  const verified = readVerifiedPhone(jar.get(VERIFIED_COOKIE)?.value);
  if (!verified) {
    return jsonError("Confirm the phone number first.", 401);
  }

  const stripe = stripeClient();
  if (!stripe) {
    return jsonError("Checkout isn't set up yet.", 503);
  }

  const { successUrl, cancelUrl } = checkoutReturnPaths(request);
  // "duo" = one plan for two numbers. Seats come from the Stripe price metadata.
  const duo = body?.plan === "duo";
  if (duo && !process.env.STRIPE_PRICE_ID_DUO) return jsonError("That plan isn't available yet.", 503);
  const priceId = duo ? process.env.STRIPE_PRICE_ID_DUO : process.env.STRIPE_PRICE_ID;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...legal,
        phone: verified.phone,
        audience: verified.audience,
      },
      subscription_data: {
        metadata: {
          ...legal,
          phone: verified.phone,
          audience: verified.audience,
        },
      },
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: MYFRIEND_MONTHLY_CENTS,
                recurring: { interval: "month" },
                product_data: {
                  name: "MyFriend",
                  description: "AI phone companion, $25 per month",
                },
              },
            },
          ],
    });

    if (!session.url) {
      return jsonError("Couldn't start checkout.", 502);
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    return jsonError("Couldn't start checkout.", 502);
  }
}
