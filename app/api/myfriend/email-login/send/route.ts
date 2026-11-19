import { myfriendApi, apiErrorResponse } from "@/lib/myfriend-api";
import { sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { jsonError } from "@/lib/myfriend";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.",403);
  const body = await request.json().catch(()=>null);
  if (typeof body?.email !== "string") return jsonError("Enter your email.");
  const result = await myfriendApi("/api/email-login/send", {method:"POST",body:{email:body.email,client_ip:request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0] || "local"}});
  return result.ok ? Response.json(result.data) : apiErrorResponse(result);
}
