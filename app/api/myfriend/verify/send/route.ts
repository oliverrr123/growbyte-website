import { isMyFriendAudience, jsonError, normalizeMobile, requestOrigin } from "@/lib/myfriend";
import { allowDevOtpBypass, twilioClient, twilioConfigured } from "@/lib/myfriend-providers";
import { reserveSmsSend } from "@/lib/myfriend-sms-limit";

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(requestOrigin(request)).origin) return jsonError("Invalid request origin.", 403);
  let body: { phone?: string; audience?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Send a phone number.");
  }

  if (!body || !isMyFriendAudience(body.audience)) {
    return jsonError("Pick who this is for.");
  }

  const phone = typeof body.phone === "string" ? normalizeMobile(body.phone) : null;
  if (!phone) {
    return jsonError("That doesn't look like a mobile number.");
  }

  if (allowDevOtpBypass()) {
    return Response.json({
      ok: true,
      phone,
      preview: true,
      message: "Dev mode: enter 000000 to continue.",
    });
  }

  if (!twilioConfigured()) {
    return jsonError("Phone verification isn't set up yet.", 503);
  }

  const limited = await reserveSmsSend(request, phone);
  if (limited) return limited;

  try {
    const client = twilioClient()!;
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({ to: phone, channel: "sms" });
  } catch (error) {
    console.error("Twilio verify send failed", error);
    return jsonError("Couldn't send the code right now. Please try again shortly.", 502);
  }

  return Response.json({ ok: true, phone });
}
