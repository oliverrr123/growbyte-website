import { createHmac } from "node:crypto";
import { apiErrorResponse, myfriendApi } from "./myfriend-api";
import { jsonError } from "./myfriend";

export async function reserveSmsSend(request: Request, phone: string): Promise<Response | null> {
  const secret = process.env.MYFRIEND_API_KEY;
  if (!secret) return jsonError("Phone verification is temporarily unavailable.", 503);
  // Vercel overwrites this at its trusted ingress. Other hosts must likewise
  // overwrite forwarded headers; never accept a rate-limit key from the body.
  const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const client_hash = createHmac("sha256", secret).update(`sms-client:${ip}`).digest("hex");
  const result = await myfriendApi("/api/phone-verification/reserve", { method: "POST", body: { phone, client_hash } });
  return result.ok ? null : apiErrorResponse(result);
}
