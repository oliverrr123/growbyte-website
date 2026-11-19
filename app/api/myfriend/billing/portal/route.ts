import { timingSafeEqual } from "node:crypto";
import { stripeClient } from "@/lib/myfriend-providers";
import { myfriendApi, type MyFriendAccount } from "@/lib/myfriend-api";
import { jsonError } from "@/lib/myfriend";
export async function POST(request: Request) {
  const expected = process.env.MYFRIEND_API_KEY,
    token = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (
    !expected ||
    !token ||
    Buffer.byteLength(token) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  )
    return jsonError("Unauthorized.", 401);
  const body = await request.json().catch(() => null);
  if (typeof body?.buyer_phone !== "string")
    return jsonError("Missing verified phone.");
  const stripe = stripeClient();
  if (!stripe) return jsonError("Billing unavailable.", 503);
  try {
    const account = await myfriendApi<MyFriendAccount>("/api/account", {
      query: { phone: body.buyer_phone },
    });
    if (!account.ok || !account.data.stripe_customer_id)
      return jsonError("Billing account not found.", 404);
    const session = await stripe.billingPortal.sessions.create({
      customer: account.data.stripe_customer_id,
      return_url:
        process.env.MYFRIEND_PUBLIC_MESSAGES_URL ||
        "https://trymyfriend.com/messages",
    });
    return Response.json({ url: session.url });
  } catch {
    return jsonError("Could not open billing.", 503);
  }
}
