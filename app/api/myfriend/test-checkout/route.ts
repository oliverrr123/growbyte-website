import Stripe from "stripe";
import { checkoutEmail } from "@/lib/myfriend-checkout-email";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { legalAcceptanceMetadata } from "@/lib/myfriend-legal";
import { readAccountSession, signAccountSession } from "@/lib/myfriend-session";

const COOKIE = "mf_local_test_checkout";

function sandbox(request: Request) {
  const url = new URL(request.url);
  const key = process.env.STRIPE_TEST_SECRET_KEY;
  if (process.env.NODE_ENV !== "development" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || !key?.startsWith("sk_test_")) return null;
  return { stripe: new Stripe(key), origin: url.origin };
}

export async function GET(request: Request) {
  const test = sandbox(request);
  if (!test) return new Response(null, { status: 404 });
  const id = readAccountSession((await cookies()).get(COOKIE)?.value)?.phone;
  if (!id) return Response.json({ paid: false });
  try {
    const session = await test.stripe.checkout.sessions.retrieve(id);
    const paid = !session.livemode && session.status === "complete" && session.payment_status === "paid";
    return Response.json({ paid, ...(paid ? { email: checkoutEmail(session) } : {}) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Testovací platbu se nepodařilo načíst." }, { status: 502 }); }
}

export async function POST(request: Request) {
  const test = sandbox(request);
  if (!test) return new Response(null, { status: 404 });
  if (request.headers.get("origin") !== test.origin) return new Response(null, { status: 403 });
  const body = await request.json().catch(() => null);
  if (body?.action === "code") {
    if (body.code !== "4242") return Response.json({ error: "Neplatný testovací kód." }, { status: 400 });
    return Response.json({ ok: true, testCheckout: true });
  }
  const legal = legalAcceptanceMetadata(body?.legal);
  if (!legal) return Response.json({ error: "Potvrďte souhlas s podmínkami." }, { status: 400 });
  try {
    const jar = await cookies();
    const id = readAccountSession(jar.get(COOKIE)?.value)?.phone;
    const previous = id ? await test.stripe.checkout.sessions.retrieve(id).catch(() => null) : null;
    if (previous?.status === "open" && !previous.livemode && previous.url) return Response.json({ url: previous.url });
    // Separate cookie and metadata: this preview never claims a phone code or activates an account.
    const session = await test.stripe.checkout.sessions.create({
      mode: "subscription", payment_method_types: ["card"], locale: "cs",
      allow_promotion_codes: true, payment_method_collection: "always",
      success_url: `${test.origin}/start?testCheckout=1&testPaid=1`,
      cancel_url: `${test.origin}/start?testCheckout=1`,
      metadata: { ...legal, flow: "local-checkout-preview" },
      subscription_data: { metadata: { flow: "local-checkout-preview" } },
      line_items: [{ quantity: 1, price_data: { currency: "czk", unit_amount: 30000, recurring: { interval: "month" }, product_data: { name: "DigiPřítel / MyFriend", description: "Telefonní AI společník — 300 Kč měsíčně" } } }],
    }, { idempotencyKey: `local-preview-${randomUUID()}` });
    if (session.livemode || !session.url) throw new Error("Expected test checkout");
    jar.set(COOKIE, signAccountSession(session.id), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 86400 });
    return Response.json({ url: session.url });
  } catch { return Response.json({ error: "Testovací platbu se nepodařilo otevřít." }, { status: 502 }); }
}
