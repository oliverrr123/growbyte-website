import { headers } from "next/headers";
import { isDigipritelHost, requestHostFromHeaders } from "@/lib/elder-companion-seo";
import { MyFriendLogin } from "@/components/myfriend-login";
import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";
export default async function LoginPage() {
  const locale = isDigipritelHost(requestHostFromHeaders(await headers())) ? "cs" : "en";
  return <><LangAttribute locale={locale} /><MyFriendLogin locale={locale} /></>;
}
