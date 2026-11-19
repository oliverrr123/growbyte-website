import { isDigipritelHost } from "@/lib/elder-companion-seo";
import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { myfriendApi, apiErrorResponse, myfriendApiConfigured } from "@/lib/myfriend-api";
import { legalAcceptanceMetadata } from "@/lib/myfriend-legal";
import { ACCOUNT_SESSION_COOKIE_OPTIONS, signAccountSession } from "@/lib/myfriend-session";
import { jsonError, normalizeMobile, requestOrigin } from "@/lib/myfriend";
import { stripeClient, twilioConfigured, allowDevOtpBypass } from "@/lib/myfriend-providers";

const TICKET_COOKIE = "mf_phone_checkout";
const SETUP_COOKIE = "mf_onboarding_checkout";
type Context = { line: string; id: string; answers: { relationship: string }; checkout_session_id: string | null };

const CZ_LINE = "+420910920500";
const US_LINE = "+19496767670";
function requestedLine(request: Request, supplied?: unknown) {
  const host = new URL(requestOrigin(request)).hostname;
  if (isDigipritelHost(host)) return CZ_LINE;
  if (host === "trymyfriend.com" || host === "www.trymyfriend.com" || host === "testing.trymyfriend.com") return US_LINE;
  return supplied === CZ_LINE ? CZ_LINE : US_LINE;
}
export async function GET(request: Request) {
  const ticket = (await cookies()).get(TICKET_COOKIE)?.value;
  if (!ticket) return Response.json({ ready: false });
  const line = requestedLine(request, new URL(request.url).searchParams.get("line"));
  const context = await myfriendApi<Context>("/api/phone-onboarding/context", { method: "POST", body: { ticket, line } });
  return Response.json({ ready: context.ok && context.data.line === line }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = new URL(requestOrigin(request)).origin;
  if (request.headers.get("origin") !== origin) return jsonError("Invalid request.", 403);
  let body;
  try { body = await request.json(); } catch { return jsonError("Invalid request."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return jsonError("Invalid request.");
  if (!myfriendApiConfigured()) return jsonError("Service is temporarily unavailable.", 503);
  const line = requestedLine(request, body.line);
  const cs = line === CZ_LINE;
  const t = (czech: string, english: string) => cs ? czech : english;
  const apiFailure = (result: { ok: false; status: number; error: string }) => cs ? apiErrorResponse(result) : jsonError(result.status === 401 ? "Enter your call code again." : result.status === 400 ? "Check the call code and the phone number you called from. The code may have expired. After too many attempts, wait 15 minutes." : result.status === 409 ? "This code or number is already linked to another checkout or plan. Use the website given during your call, or sign in to manage your account." : "This step is temporarily unavailable. Please try again.", result.status);
  const jar = await cookies();
  if (body.action === "code") {
    // A rejected replacement code must never fall back to an earlier checkout.
    jar.delete(TICKET_COOKIE);
    if (typeof body.code !== "string" || !/^\d{4}$/.test(body.code.replace(/\s/g, ""))) return jsonError(t("Zadejte čtyři číslice z hovoru.", "Enter the four digits from your call."));
    const secret = process.env.MYFRIEND_API_KEY;
    if (!secret) return jsonError("Service is temporarily unavailable.", 503);
    // Vercel supplies this header; other hosts must overwrite X-Forwarded-For
    // at their trusted ingress. Never use a browser-supplied rate-limit key.
    const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const client_hash = createHmac("sha256", secret).update(`phone-code:${ip}`).digest("hex");
    const result = await myfriendApi<{ ticket: string }>("/api/phone-onboarding/claim", { method: "POST", body: { code: body.code, client_hash, line } });
    if (!result.ok) return apiFailure(result);
    if (!/^[a-f0-9]{64}$/.test(result.data.ticket ?? "")) return jsonError(t("Kód se nepodařilo ověřit. Zkuste to znovu.", "Could not verify the code. Please try again."), 502);
    jar.set(TICKET_COOKIE, result.data.ticket, { ...ACCOUNT_SESSION_COOKIE_OPTIONS, maxAge: 3600 });
    return Response.json({ ok: true }); // Never reveal a caller's phone, name or answers.
  }
  if (body.action !== "checkout") return jsonError("Invalid request.");
  const legal = legalAcceptanceMetadata(body.legal);
  if (!legal) return jsonError(t("Potvrďte souhlas s podmínkami.", "Please accept the terms."));
  const stripe = stripeClient();
  if (!stripe || (!twilioConfigured() && !allowDevOtpBypass())) return jsonError(t("Platbu teď nelze dokončit. Zkuste to později.", "Checkout is temporarily unavailable. Please try again later."), 503);
  const ticket = jar.get(TICKET_COOKIE)?.value;
  if (!ticket) return jsonError(t("Nejdřív zadejte kód z hovoru.", "Enter your call code first."), 401);
  const phone = typeof body.phone === "string" ? normalizeMobile(body.phone) : null;
  if (!phone) return jsonError(t("Zadejte telefonní číslo, ze kterého jste volali.", "Enter the phone number you called from."));
  const context = await myfriendApi<Context>("/api/phone-onboarding/context", { method: "POST", body: { ticket, phone, line } });
  if (!context.ok) {
    if (context.status === 401) jar.delete(TICKET_COOKIE);
    return apiFailure(context);
  }
  if (context.data.line !== line) return jsonError(t("Použijte web uvedený během hovoru.", "Use the website given during your call."), 409);
  const callPath = cs ? "/start" : ["trymyfriend.com", "www.trymyfriend.com", "testing.trymyfriend.com"].includes(new URL(origin).hostname) ? "/call" : "/myfriend/call";
  try {
    const acceptance = await myfriendApi<{ id: string; line: string; checkout_session_id: string | null; legal: Record<string, string> }>("/api/phone-onboarding/legal", { method: "POST", body: { ticket, legal, line } });
    if (!acceptance.ok) return apiFailure(acceptance);
    const reservation = acceptance.data;
    if (reservation.line !== line) return jsonError(t("Použijte web uvedený během hovoru.", "Use the website given during your call."), 409);
    if (!/^[a-f0-9-]{36}$/.test(reservation.id ?? "")) return jsonError(t("Platbu teď nelze připravit.", "Could not prepare checkout."), 503);
    const metadata = { ...reservation.legal, audience: "loved-one", flow: "loved-one-onboarding", onboarding_source: cs ? "phone-cz" : "phone-us", phone_onboarding_id: reservation.id, plan: "monthly" };
    let session;
    if (reservation.checkout_session_id) {
      session = await stripe.checkout.sessions.retrieve(reservation.checkout_session_id);
    } else {
      session = await stripe.checkout.sessions.create({
        mode: "subscription", payment_method_types: ["card"], locale: cs ? "cs" : "en",
        allow_promotion_codes: true, payment_method_collection: "always",
        success_url: `${origin}${callPath}?setup=1`, cancel_url: `${origin}${callPath}?cancelled=1`,
        metadata, subscription_data: { metadata },
        line_items: [{ quantity: 1, price_data: { currency: cs ? "czk" : "usd", unit_amount: cs ? 30000 : 2500, recurring: { interval: "month" }, product_data: { name: cs ? "DigiPřítel / MyFriend" : "MyFriend", description: cs ? "Telefonní AI společník — 300 Kč měsíčně" : "AI phone companion — $25 monthly" } } }],
      }, { idempotencyKey: `${cs ? "phone-cz" : "phone-us"}-reserved-${reservation.id}` });
    }
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    const canceled = session.status === "complete" && subscriptionId
      ? (await stripe.subscriptions.retrieve(subscriptionId)).status === "canceled" : false;
    if (session.status === "expired" || canceled) {
      const released = await myfriendApi("/api/phone-onboarding/release-checkout", { method: "POST", body: { ticket, checkout_session_id: session.id } });
      if (!released.ok) return apiFailure(released);
      jar.delete(TICKET_COOKIE); jar.delete(SETUP_COOKIE);
      return jsonError(t("Platnost této platby skončila. Zavolejte si pro nový kód.", "This checkout has expired. Please call for a new code."), 401);
    }
    const saved = await myfriendApi("/api/phone-onboarding/checkout", { method: "POST", body: { ticket, phone_onboarding_id: reservation.id, checkout_session_id: session.id, livemode: session.livemode } });
    if (!saved.ok) return apiFailure(saved);
    jar.set(SETUP_COOKIE, signAccountSession(session.id), { ...ACCOUNT_SESSION_COOKIE_OPTIONS, maxAge: 7 * 86400 });
    if (session.status === "complete") return Response.json({ url: `${callPath}?setup=1` });
    if (!session.url) return jsonError(t("Platbu se nepodařilo otevřít.", "Could not open checkout."), 502);
    return Response.json({ url: session.url });
  } catch { return jsonError(t("Platbu se nepodařilo otevřít. Zkuste to znovu.", "Could not open checkout. Please try again."), 502); }
}
