import { cookies } from "next/headers";
import { jsonError, normalizeMobile } from "@/lib/myfriend";
import { allowDevOtpBypass, twilioClient, twilioConfigured } from "@/lib/myfriend-providers";
import {
  ACCOUNT_SESSION_COOKIE_OPTIONS,
  signAccountSession,
} from "@/lib/myfriend-session";
import { ACCOUNT_SESSION_COOKIE } from "@/lib/myfriend";
import { apiErrorResponse, myfriendApi } from "@/lib/myfriend-api";

export async function POST(request: Request) {
  let body: { phone?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Enter the code we sent.");
  }

  const phone = normalizeMobile(body.phone ?? "");
  const code = (body.code ?? "").replace(/\s/g, "");
  if (!phone) return jsonError("That doesn't look like a mobile number.");
  if (!/^\d{6}$/.test(code)) return jsonError("Enter the 6-digit code.");

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
      console.error("Twilio login check failed", error);
      return jsonError("That code didn't match. Try again.", 502);
    }
  }

  const account = await myfriendApi("/api/account", {
    query: { phone },
  });
  if (!account.ok) {
    if (account.status === 404) {
      return jsonError("No MyFriend account for this number.", 404);
    }
    return apiErrorResponse(account);
  }

  const jar = await cookies();
  jar.set(
    ACCOUNT_SESSION_COOKIE,
    signAccountSession(phone),
    ACCOUNT_SESSION_COOKIE_OPTIONS,
  );

  return Response.json({ ok: true, phone });
}
