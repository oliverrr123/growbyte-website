import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { jsonError, normalizeMobile } from "@/lib/myfriend";
import { sendPhoneChallenge } from "@/lib/myfriend-phone-change";
import { reserveSmsSend } from "@/lib/myfriend-sms-limit";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const account = await dashboardAccount();
  if (!account) return jsonError("Please log in to change a number.", 401);
  const body = await request.json().catch(() => null);
  if (body?.purpose !== "buyer" && body?.purpose !== "senior" && body?.purpose !== "member") return jsonError("Choose which number to change.");
  const phone = typeof body.phone === "string" ? normalizeMobile(body.phone) : null;
  if (!phone) return jsonError("Enter a valid phone number, including the country code.");
  const limited = await reserveSmsSend(request, phone);
  if (limited) return limited;
  return sendPhoneChallenge(account.buyer_phone_number, phone, body.purpose);
}
