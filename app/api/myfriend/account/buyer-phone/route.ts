import { completePhoneChange, verifyPhoneChange } from "@/lib/myfriend-phone-change";
import { cookies } from "next/headers";
import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { jsonError, normalizeMobile } from "@/lib/myfriend";
import { apiErrorResponse, myfriendApi, type MyFriendAccount } from "@/lib/myfriend-api";
import { ACCOUNT_SESSION_COOKIE, ACCOUNT_SESSION_COOKIE_OPTIONS, signAccountSession } from "@/lib/myfriend-session";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const account = await dashboardAccount();
  if (!account) return jsonError("Please log in to change your number.", 401);
  const body = await request.json().catch(() => null);
  const phone = typeof body?.new_phone === "string" ? normalizeMobile(body.new_phone) : null;
  if (!phone) return jsonError("Enter a valid phone number, including the country code.");
  const verificationError = await verifyPhoneChange(account.buyer_phone_number, phone, "buyer", body.code);
  if (verificationError) return verificationError;
  const result = await myfriendApi<MyFriendAccount>("/api/account/buyer-phone", {
    method: "POST", body: { buyer_phone: account.buyer_phone_number, new_phone: phone },
  });
  if (!result.ok) return apiErrorResponse(result);
  await completePhoneChange("buyer");
  const jar = await cookies();
  if (jar.get(ACCOUNT_SESSION_COOKIE)) jar.set(ACCOUNT_SESSION_COOKIE, signAccountSession(result.data.buyer_phone_number), ACCOUNT_SESSION_COOKIE_OPTIONS);
  return Response.json(result.data);
}
