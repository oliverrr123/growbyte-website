import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { jsonError } from "./myfriend";
import { twilioClient, twilioConfigured } from "./myfriend-providers";

export type PhonePurpose = "buyer" | "senior" | "member";
type Challenge = { buyer: string; phone: string; purpose: PhonePurpose; sid: string; sentAt: number; expires: number; approved?: boolean };
const cookieName = (purpose: PhonePurpose) => `mf_phone_change_${purpose}`;
const secret = () => process.env.MYFRIEND_VERIFY_SECRET || process.env.TWILIO_AUTH_TOKEN || "";
function encode(challenge: Challenge) {
  if (!secret()) throw new Error("Verification isn't configured.");
  const payload = Buffer.from(JSON.stringify(challenge)).toString("base64url");
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
export async function readPhoneChallenge(purpose: PhonePurpose): Promise<Challenge | null> {
  const token = (await cookies()).get(cookieName(purpose))?.value;
  if (!token || !secret()) return null;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const expected = createHmac("sha256", secret()).update(payload).digest();
    const provided = Buffer.from(signature, "base64url");
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
    const challenge = JSON.parse(Buffer.from(payload, "base64url").toString()) as Challenge;
    return challenge.purpose === purpose && challenge.expires > Date.now() ? challenge : null;
  } catch { return null; }
}
export async function sendPhoneChallenge(buyer: string, phone: string, purpose: PhonePurpose) {
  if (!twilioConfigured()) return jsonError("Phone verification isn't available. Please try again later.", 503);
  const previous = await readPhoneChallenge(purpose);
  if (previous?.buyer === buyer && Date.now() - previous.sentAt < 30_000)
    return jsonError("Wait 30 seconds before requesting another code.", 429);
  try {
    const verification = await twilioClient()!.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({ to: phone, channel: "sms" });
    const sentAt = Date.now();
    (await cookies()).set(cookieName(purpose), encode({ buyer, phone, purpose, sid: verification.sid, sentAt, expires: sentAt + 10 * 60_000 }), {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600,
    });
    return Response.json({ ok: true, phone, retry_after: 30 });
  } catch { return jsonError("Couldn't send the code right now. Please try again shortly.", 502); }
}

// Called by both mutation routes, before any account data is written. No development bypass.
export async function verifyPhoneChange(buyer: string, phone: string, purpose: PhonePurpose, code: unknown): Promise<Response | null> {
  const challenge = await readPhoneChallenge(purpose);
  if (!challenge || challenge.buyer !== buyer || challenge.phone !== phone)
    return jsonError("Request a verification code for this number first.", 403);
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) return jsonError("Enter the 6-digit code.");
  if (challenge.approved) return null;
  if (!twilioConfigured()) return jsonError("Phone verification isn't available. Please try again later.", 503);
  try {
    const check = await twilioClient()!.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({ verificationSid: challenge.sid, code });
    if (check.status !== "approved" || check.to !== phone)
      return jsonError("That code didn't match. Try again.");
    // Keep the original expiry. The following backend save can fail after
    // Twilio has consumed the OTP; retain signed proof until that save succeeds.
    (await cookies()).set(cookieName(purpose), encode({ ...challenge, approved: true }), {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/",
      maxAge: Math.max(1, Math.ceil((challenge.expires - Date.now()) / 1000)),
    });
    return null;
  } catch { return jsonError("That code is incorrect or expired. Try again or request a new one."); }
}

export async function completePhoneChange(purpose: PhonePurpose) {
  (await cookies()).delete(cookieName(purpose));
}
