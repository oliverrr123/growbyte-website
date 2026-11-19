import { headers } from "next/headers";
import { isDigipritelHost, requestHostFromHeaders } from "@/lib/elder-companion-seo";
import { MyFriendDashboard } from "@/components/myfriend-dashboard";
import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";
export const metadata = { title: "MyFriend", robots: { index: false, follow: false } };
export default async function DashboardPage() {
  const locale = isDigipritelHost(requestHostFromHeaders(await headers())) ? "cs" : "en";
  return <><LangAttribute locale={locale} /><MyFriendDashboard locale={locale} /></>;
}
