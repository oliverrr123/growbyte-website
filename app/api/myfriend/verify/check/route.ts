import { cookies } from "next/headers";
import { readVerifiedPhone, signVerifiedPhone } from "@/lib/myfriend-auth";
import { isMyFriendAudience, jsonError, normalizeMobile, requestOrigin, VERIFIED_COOKIE } from "@/lib/myfriend";
import { allowDevOtpBypass, twilioClient, twilioConfigured } from "@/lib/myfriend-providers";

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(requestOrigin(request)).origin) return jsonError("Invalid request origin.", 403);
  let body: { phone?: string; audience?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Enter the code we sent.");
  }

  if (!body || !isMyFriendAudience(body.audience)) {
    return jsonError("Pick who this is for.");
  }

  const phone = typeof body.phone === "string" ? normalizeMobile(body.phone) : null;
  const code = typeof body.code === "string" ? body.code.replace(/\s/g, "") : "";
  if (!phone) return jsonError("That doesn't look like a mobile number.");
  if (!/^\d{6}$/.test(code)) return jsonError("Enter the 6-digit code.");

  // Twilio consumes an approved OTP. A later account-save failure must be
  // retryable using the existing signed proof, without extending its lifetime.
  const jar = await cookies();
  const verified = readVerifiedPhone(jar.get(VERIFIED_COOKIE)?.value);
  if (verified?.phone === phone && verified.audience === body.audience) {
    return Response.json({ ok: true, phone });
  }

  if (allowDevOtpBypass()) {
    if (code !== "000000") return jsonError("Dev mode: use 000000.");
  } else {
    if (!twilioConfigured()) {
      return jsonError("Phone verification isn't set up yet.", 503);
    }
    try {
      const check = await twilioClient()!
        .verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verificationChecks.create({ to: phone, code });
      if (check.status !== "approved") {
        return jsonError("That code didn't match. Try again.");
      }
    } catch (error) {
      console.error("Twilio verify check failed", error);
      return jsonError("That code didn't match. Try again.");
    }
  }

  const token = signVerifiedPhone(phone, body.audience);
  jar.set(VERIFIED_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 60,
    path: "/",
  });

  return Response.json({ ok: true, phone });
}
