import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { jsonError } from "@/lib/myfriend";
import { myfriendApi, apiErrorResponse } from "@/lib/myfriend-api";

export async function GET() {
  if (!await dashboardAccount()) return jsonError("Log in first.", 401);
  const result = await myfriendApi("/api/family/status");
  return result.ok ? Response.json(result.data) : apiErrorResponse(result);
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const account = await dashboardAccount();
  if (!account) return jsonError("Log in first.", 401);
  const result = await myfriendApi("/api/family/connect", {
    method: "POST", body: { buyer_phone: account.buyer_phone_number },
  });
  return result.ok ? Response.json(result.data) : apiErrorResponse(result);
}
