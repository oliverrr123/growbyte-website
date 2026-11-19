import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { stripeClient } from "@/lib/myfriend-providers";
import { jsonError, myfriendAppPath, requestOrigin } from "@/lib/myfriend";
import { isDigipritelHost } from "@/lib/elder-companion-seo";
export async function POST(request:Request) {
 if(!sameOrigin(request))return jsonError("Invalid request origin.",403);
 const account=await dashboardAccount();
 if(!account)return jsonError("Please log in.",401);
 const stripe=stripeClient();
 if(!stripe||!account.stripe_customer_id)return jsonError("Billing isn't available.",503);
 try {
  const url=new URL(requestOrigin(request));
  const body=await request.json().catch(()=>null);
  const cs=isDigipritelHost(url.host)||body?.locale==="cs";
  const dashboard=cs&&!isDigipritelHost(url.host)?"/digipritel/dashboard":myfriendAppPath(url.host,"/dashboard");
  const session=await stripe.billingPortal.sessions.create({customer:account.stripe_customer_id,locale:cs?"cs":"en",return_url:new URL(dashboard,url.origin).toString()});
  return Response.json({url:session.url});
 } catch {return jsonError("Couldn't open billing.",503);}
}
