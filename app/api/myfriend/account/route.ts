import { dashboardAccount } from "@/lib/myfriend-dashboard-auth";
import { jsonError } from "@/lib/myfriend";
export async function GET() {
 const account=await dashboardAccount();
 return account ? Response.json(account) : jsonError("Please log in to view your account.",401);
}
