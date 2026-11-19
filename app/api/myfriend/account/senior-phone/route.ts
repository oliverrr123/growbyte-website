import { completePhoneChange, verifyPhoneChange } from "@/lib/myfriend-phone-change";
import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { jsonError, normalizeMobile } from "@/lib/myfriend";
import { apiErrorResponse, myfriendApi } from "@/lib/myfriend-api";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const session = await dashboardAccount();
  if (!session) {
    return jsonError("Log in to change that number.", 401);
  }

  let body: { senior_phone?: string; for_myself?: boolean; code?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Enter a phone number.");
  }

  const seniorPhone = body.for_myself
    ? session.buyer_phone_number
    : normalizeMobile(body.senior_phone ?? "");
  if (!seniorPhone) {
    return jsonError("Enter a valid phone number, including the country code.");
  }

  const verificationError = await verifyPhoneChange(session.buyer_phone_number, seniorPhone, "senior", body.code);
  if (verificationError) return verificationError;
  const result = await myfriendApi("/api/account/senior-phone", {
    method: "POST",
    body: {
      buyer_phone: session.buyer_phone_number,
      senior_phone: seniorPhone,
      for_myself: Boolean(body.for_myself),
    },
  });
  if (!result.ok) return apiErrorResponse(result);
  await completePhoneChange("senior");

  return Response.json(result.data);
}
