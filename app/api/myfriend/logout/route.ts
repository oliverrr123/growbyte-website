import { cookies } from "next/headers";
import { ACCOUNT_SESSION_COOKIE } from "@/lib/myfriend";
import { EMAIL_ACCESS_COOKIE, EMAIL_REFRESH_COOKIE, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { myfriendApi } from "@/lib/myfriend-api";
export async function POST(request:Request) {
 if(!sameOrigin(request))return Response.json({error:"Invalid request origin."},{status:403});
 const jar=await cookies();
 const access_token=jar.get(EMAIL_ACCESS_COOKIE)?.value;
 if(access_token)await myfriendApi("/api/email-login/logout",{method:"POST",body:{access_token}});
 for(const name of [ACCOUNT_SESSION_COOKIE,EMAIL_ACCESS_COOKIE,EMAIL_REFRESH_COOKIE])jar.delete(name);
 return Response.json({ok:true});
}
