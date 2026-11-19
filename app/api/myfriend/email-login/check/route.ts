import { myfriendApi, apiErrorResponse } from "@/lib/myfriend-api";
import { sameOrigin, saveEmailSession, type EmailTokens } from "@/lib/myfriend-dashboard-auth";
import { jsonError } from "@/lib/myfriend";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.",403);
  const body=await request.json().catch(()=>null);
  if(typeof body?.email!=="string"||typeof body?.code!=="string")return jsonError("Enter your email and code.");
  const result=await myfriendApi<EmailTokens>("/api/email-login/check",{method:"POST",body:{email:body.email,code:body.code}});
  if(!result.ok)return apiErrorResponse(result);
  await saveEmailSession(result.data);
  return Response.json({ok:true});
}
