import { completePhoneChange, verifyPhoneChange } from "@/lib/myfriend-phone-change";
import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { jsonError, normalizeMobile } from "@/lib/myfriend";
import { apiErrorResponse, myfriendApi } from "@/lib/myfriend-api";

// Adds or removes an extra number (seat 2+) on a multi-person plan.
export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const session = await dashboardAccount();
  if (!session) return jsonError("Log in to manage numbers.", 401);
  const body = await request.json().catch(() => null) as { action?: string; member_phone?: string; for_myself?: boolean; code?: string } | null;
  const buyer = session.buyer_phone_number;

  if (body?.action === "remove") {
    const phone = normalizeMobile(body.member_phone ?? "");
    if (!phone || !session.members?.some(m => m.phone_number === phone)) return jsonError("That number isn't on your plan.", 404);
    const result = await myfriendApi("/api/account/members/remove", { method: "POST", body: { buyer_phone: buyer, member_phone: phone } });
    return result.ok ? Response.json(result.data) : apiErrorResponse(result);
  }
  if (body?.action !== "add") return jsonError("Choose what to do.");

  // The buyer's own number is already verified by their login, so it needs no SMS code.
  const phone = body.for_myself ? buyer : normalizeMobile(body.member_phone ?? "");
  if (!phone) return jsonError("Enter a valid phone number, including the country code.");
  if (phone !== buyer) {
    const verificationError = await verifyPhoneChange(buyer, phone, "member", body.code);
    if (verificationError) return verificationError;
  }
  const result = await myfriendApi("/api/account/members", { method: "POST", body: { buyer_phone: buyer, member_phone: phone } });
  if (!result.ok) return apiErrorResponse(result);
  if (phone !== buyer) await completePhoneChange("member");
  return Response.json(result.data);
}
