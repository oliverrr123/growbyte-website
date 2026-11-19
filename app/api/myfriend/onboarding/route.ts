import { checkoutEmail, validSetupEmail } from "@/lib/myfriend-checkout-email";
import { legalAcceptanceMetadata } from "@/lib/myfriend-legal";
import { cookies } from "next/headers";
import { after } from "next/server";
import { checkoutAnalyticsMetadata } from "@/lib/myfriend-analytics";
import { capturePaidCheckout } from "@/lib/myfriend-analytics-server";
import { readVerifiedPhone } from "@/lib/myfriend-auth";
import { readAccountSession, signAccountSession, ACCOUNT_SESSION_COOKIE_OPTIONS } from "@/lib/myfriend-session";
import { ACCOUNT_SESSION_COOKIE, VERIFIED_COOKIE, jsonError, requestOrigin, myfriendAppPath } from "@/lib/myfriend";
import { stripeClient, twilioConfigured, allowDevOtpBypass } from "@/lib/myfriend-providers";
import { activateFromCheckoutSession, syncFromStripeSubscription } from "@/lib/myfriend-billing";
import { myfriendApi, myfriendApiConfigured, apiErrorResponse } from "@/lib/myfriend-api";
import { restoreOnboardingAnswers } from "@/lib/myfriend-onboarding";
import { EMAIL_ACCESS_COOKIE, EMAIL_REFRESH_COOKIE } from "@/lib/myfriend-dashboard-auth";

// A signed, HTTP-only checkout capability binds post-payment setup to this browser.
const COOKIE = "mf_onboarding_checkout";
const cookieOptions = { ...ACCOUNT_SESSION_COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 };

export async function GET() {
  const jar = await cookies();
  const id = readAccountSession(jar.get(COOKIE)?.value)?.phone;
  if (!id) return Response.json({ paid: false });
  const stripe = stripeClient();
  if (!stripe) return jsonError("Checkout isn't set up yet.", 503);
  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    if (session.payment_status !== "paid" || session.status !== "complete") return Response.json({ paid: false });
    after(() => capturePaidCheckout(session));
    let forMyself = false;
    if (["phone-cz", "phone-us"].includes(session.metadata?.onboarding_source || "")) {
      const setup = await myfriendApi<{ for_myself: boolean }>("/api/phone-onboarding/setup", { method: "POST", body: { checkout_session_id: session.id } });
      if (!setup.ok) return apiErrorResponse(setup);
      forMyself = session.metadata?.setup_for_myself === "true" || setup.data.for_myself;
    }
    return Response.json({ paid: true, stage: session.metadata?.setup_stage || "thank-you", email: checkoutEmail(session), for_myself: forMyself });
  } catch {
    return jsonError("Couldn't load your setup. Please try again.", 502);
  }
}

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(requestOrigin(request)).origin) return jsonError("Invalid request origin.", 403);
  const stripe = stripeClient();
  if (!stripe) return jsonError("Checkout isn't set up yet.", 503);
  let body: { action?: string; plan?: string; email?: string; answers?: unknown; analytics?: unknown; legal?: unknown };
  try { body = await request.json(); } catch { return jsonError("Invalid request."); }
  const jar = await cookies();
  const savePhoneAccount = (phone: string) => {
    jar.set(ACCOUNT_SESSION_COOKIE, signAccountSession(phone), ACCOUNT_SESSION_COOKIE_OPTIONS);
    // A previous email login must not override the account just verified here.
    jar.delete(EMAIL_ACCESS_COOKIE);
    jar.delete(EMAIL_REFRESH_COOKIE);
  };
  const existingId = readAccountSession(jar.get(COOKIE)?.value)?.phone;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const path = myfriendAppPath(host, "/onboarding");
  try {
    if (body.action === "checkout") {
      const legal = legalAcceptanceMetadata(body.legal);
      if (!legal) return jsonError("Please agree to the current terms before checkout.");
      if (body.plan !== "monthly" && body.plan !== "annual") return jsonError("Choose a plan.");
      const answers = restoreOnboardingAnswers(body.answers);
      if (!answers.relationship || !answers.goals?.length || !answers.cadence) return jsonError("Complete the onboarding questions first.");
      const saveAnswers = (session: { id: string; livemode: boolean }) => myfriendApi("/api/onboarding", {
        method: "POST",
        body: { checkout_session_id: session.id, answers, billing_plan: body.plan, livemode: session.livemode },
      });
      if (!myfriendApiConfigured() || (!twilioConfigured() && !allowDevOtpBypass())) return jsonError("Account setup isn't available yet. Please try again later.", 503);
      if (existingId) {
        const existing = await stripe.checkout.sessions.retrieve(existingId);
        if (existing.status === "complete") return Response.json({ url: `${path}?setup=1` });
        if (existing.status === "open" && existing.metadata?.plan === body.plan && existing.url) {
          await stripe.checkout.sessions.update(existing.id, { metadata: legal });
          if (!existing.metadata?.analytics_distinct_id) {
            const analytics = checkoutAnalyticsMetadata(body.analytics, host);
            if (analytics.analytics_distinct_id) await stripe.checkout.sessions.update(existing.id, { metadata: analytics });
          }
          const saved = await saveAnswers(existing);
          if (!saved.ok) return apiErrorResponse(saved);
          return Response.json({ url: existing.url });
        }
        if (existing.status === "open") await stripe.checkout.sessions.expire(existing.id);
      }
      const annual = body.plan === "annual";
      const metadata = { audience: "loved-one", flow: "loved-one-onboarding", plan: body.plan, ...legal, ...checkoutAnalyticsMetadata(body.analytics, host) };
      const session = await stripe.checkout.sessions.create({
        mode: "subscription", payment_method_types: ["card"],
        success_url: `${requestOrigin(request)}${path}?setup=1`,
        cancel_url: `${requestOrigin(request)}${path}?cancelled=1`,
        metadata, subscription_data: { metadata },
        line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: annual ? 25000 : 2500, recurring: { interval: annual ? "year" : "month" }, product_data: { name: "MyFriend", description: "AI phone companion for your loved one" } } }],
      });
      if (!session.url) return jsonError("Couldn't start checkout.", 502);
      jar.set(COOKIE, signAccountSession(session.id), cookieOptions);
      // Keep the signed session on failure so retrying reuses the same checkout.
      // Do not send the buyer to payment until Supabase has their answers.
      const saved = await saveAnswers(session);
      if (!saved.ok) return apiErrorResponse(saved);
      return Response.json({ url: session.url });
    }
    if (!existingId) return jsonError("Return to this browser after checkout to finish setup.", 401);
    let session = await stripe.checkout.sessions.retrieve(existingId);
    if (session.status !== "complete" || session.payment_status !== "paid") return jsonError("Finish payment first.", 403);
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (!subscriptionId) return jsonError("Subscription wasn't found.", 409);
    async function saveEmailAndContinue(buyerPhone: string, email: string, metadata: Record<string, string> = {}) {
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      if (customerId) await stripe!.customers.update(customerId, { email });
      const subscription = await stripe!.subscriptions.update(subscriptionId!, { metadata: { email } });
      const result = await syncFromStripeSubscription(subscription, { buyerPhone, email });
      if (!result.ok) return apiErrorResponse(result);
      await stripe!.checkout.sessions.update(session.id, { metadata: { ...metadata, recovery_email: email, setup_stage: "welcome" } });
      return Response.json({ ok: true, stage: "welcome", email });
    }
    async function completeRecipient(buyerPhone: string, metadata: Record<string, string> = {}) {
      const email = checkoutEmail(session);
      if (email) return await saveEmailAndContinue(buyerPhone, email, metadata);
      await stripe!.checkout.sessions.update(session.id, { metadata: { ...metadata, setup_stage: "email" } });
      return Response.json({ ok: true, stage: "email" });
    }
    if (body.action === "thank-you") {
      const currentStage = session.metadata?.setup_stage;
      // A retried acknowledgment must never rewind a later setup step.
      if (currentStage && currentStage !== "thank-you") {
        return Response.json({ ok: true, stage: currentStage });
      }
      await stripe.checkout.sessions.update(session.id, { metadata: { setup_stage: "buyer" } });
      return Response.json({ ok: true, stage: "buyer" });
    }
    if (body.action === "buyer") {
      const verified = readVerifiedPhone(jar.get(VERIFIED_COOKIE)?.value);
      if (!verified || verified.audience !== "myself") return jsonError("Verify your phone number first.", 401);
      let forMyself = false;
      if (["phone-cz", "phone-us"].includes(session.metadata?.onboarding_source || "")) {
        const setup = await myfriendApi<{ phone: string; for_myself: boolean }>("/api/phone-onboarding/setup", { method: "POST", body: { checkout_session_id: session.id } });
        if (!setup.ok) return apiErrorResponse(setup);
        if (verified.phone !== setup.data.phone) return jsonError(session.metadata?.onboarding_source === "phone-us" ? "Verify the same phone number you used for your introductory call." : "Ověřte stejné telefonní číslo, ze kterého jste absolvovali úvodní hovor.", 403);
        forMyself = session.metadata?.setup_for_myself === "true" || setup.data.for_myself;
      }
      if (session.metadata?.phone && session.metadata.phone !== verified.phone) return jsonError("This order already belongs to another number.", 409);
      session = await stripe.checkout.sessions.update(session.id, { metadata: { phone: verified.phone } });
      await stripe.subscriptions.update(subscriptionId, { metadata: { phone: verified.phone } });
      const activated = await activateFromCheckoutSession(stripe, session);
      if (!activated.ok) return apiErrorResponse(activated);
      if (forMyself) {
        const linked = await myfriendApi("/api/account/senior-phone", { method: "POST", body: { buyer_phone: verified.phone, senior_phone: verified.phone, for_myself: true } });
        if (!linked.ok) return apiErrorResponse(linked);
      }
      const completion = forMyself ? await completeRecipient(verified.phone) : null;
      if (completion && !completion.ok) return completion;
      const nextStage = completion ? (await completion.json()).stage : "senior";
      if (!forMyself) await stripe.checkout.sessions.update(session.id, { metadata: { setup_stage: nextStage } });
      savePhoneAccount(verified.phone);
      jar.delete(VERIFIED_COOKIE);
      return Response.json({ ok: true, stage: nextStage, for_myself: forMyself });
    }
    const account = readAccountSession(jar.get(ACCOUNT_SESSION_COOKIE)?.value);
    if (!account || account.phone !== session.metadata?.phone) return jsonError("Log in with your verified phone number to continue.", 401);
    if (body.action === "use-myself") {
      // This is a correction by the paid order's already verified owner.
      // Never accept a phone number or account identity from this request body.
      if (!["phone-cz", "phone-us"].includes(session.metadata?.onboarding_source || "")) return jsonError("This option is available during phone onboarding.", 409);
      if (session.metadata?.setup_for_myself === "true" && session.metadata?.setup_stage !== "senior") {
        return Response.json({ ok: true, stage: session.metadata?.setup_stage || "email", for_myself: true });
      }
      if (session.metadata?.setup_stage !== "senior") return jsonError("Verify your phone number first.", 409);
      const linked = await myfriendApi("/api/account/senior-phone", { method: "POST", body: { buyer_phone: account.phone, senior_phone: account.phone, for_myself: true } });
      if (!linked.ok) return apiErrorResponse(linked);
      const completion = await completeRecipient(account.phone, { setup_for_myself: "true" });
      if (!completion.ok) return completion;
      jar.delete(VERIFIED_COOKIE);
      return Response.json({ ...(await completion.json()), for_myself: true });
    }
    if (body.action === "senior") {
      const verified = readVerifiedPhone(jar.get(VERIFIED_COOKIE)?.value);
      if (!verified || verified.audience !== "loved-one") return jsonError("Verify their phone number first.", 401);
      const result = await myfriendApi("/api/account/senior-phone", { method: "POST", body: { buyer_phone: account.phone, senior_phone: verified.phone, for_myself: false } });
      if (!result.ok) return apiErrorResponse(result);
      const completion = await completeRecipient(account.phone);
      if (completion.ok) jar.delete(VERIFIED_COOKIE);
      return completion;
    } else if (body.action === "skip-senior") {
      return await completeRecipient(account.phone);
    } else if (body.action === "email") {
      const email = typeof body.email === "string" ? body.email.trim() : "";
      if (!validSetupEmail(email)) return jsonError("Enter a valid email address.");
      return await saveEmailAndContinue(account.phone, email);
    } else if (body.action === "finish") {
      await stripe.checkout.sessions.update(session.id, { metadata: { setup_stage: "done" } });
      savePhoneAccount(account.phone);
    } else return jsonError("Unknown setup step.");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("MyFriend onboarding failed", error);
    return jsonError("Couldn't complete that step. Please try again.", 502);
  }
}
