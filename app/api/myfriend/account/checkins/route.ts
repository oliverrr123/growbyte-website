import { dashboardAccount } from "@/lib/myfriend-dashboard-auth";
import { jsonError, requestOrigin } from "@/lib/myfriend";
import { myfriendApi, apiErrorResponse } from "@/lib/myfriend-api";

export async function GET() {
  const account = await dashboardAccount();
  if (!account) return jsonError("Log in first.",401);
  const result = await myfriendApi("/api/account/checkins", { query: { buyer_phone: account.buyer_phone_number } });
  return result.ok ? Response.json(result.data) : apiErrorResponse(result);
}

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(requestOrigin(request)).origin) return jsonError("Invalid request origin.",403);
  const account = await dashboardAccount();
  if (!account) return jsonError("Log in first.",401);
  let body;
  try { body=await request.json(); } catch { return jsonError("Invalid request."); }
  const result=await myfriendApi("/api/account/checkins", { method:"POST",body:{ enabled:body.enabled, timezone:body.timezone, call_hour:body.call_hour, report_channel:body.report_channel, recipient_consent:body.recipient_consent, buyer_phone:account.buyer_phone_number } });
  return result.ok ? Response.json(result.data) : apiErrorResponse(result);
}
