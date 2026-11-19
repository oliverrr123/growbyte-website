import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { jsonError } from "@/lib/myfriend";
import { myfriendApi, apiErrorResponse } from "@/lib/myfriend-api";

export async function GET() {
  const account = await dashboardAccount();
  if (!account) return jsonError("Please log in to view message settings.", 401);
  const result = await myfriendApi("/api/account/message-updates", { query: { buyer_phone: account.buyer_phone_number } });
  return result.ok ? Response.json(result.data) : apiErrorResponse(result);
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const account = await dashboardAccount();
  if (!account) return jsonError("Please log in to change message settings.", 401);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.enabled !== "boolean") return jsonError("Choose whether to receive daily messages.");
  const result = await myfriendApi("/api/account/message-updates", { method: "POST", body: {
    buyer_phone: account.buyer_phone_number, enabled: body.enabled,
    recipient_consent: body.recipient_consent, digest_timezone: body.digest_timezone,
  } });
  return result.ok ? Response.json(result.data) : apiErrorResponse(result);
}
