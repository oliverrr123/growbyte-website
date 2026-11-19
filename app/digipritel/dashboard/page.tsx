import { headers } from "next/headers";
import { MyFriendDashboard } from "@/components/myfriend-dashboard";
import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";
export const metadata = { title: "Váš účet | DigiPřítel", robots: { index: false, follow: false } };
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ preview?: string; forMyself?: string }> }) {
  const host = (await headers()).get("host")?.split(":")[0];
  const preview = process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1"].includes(host || "") && (await searchParams).preview === "1";
  return <><LangAttribute locale="cs" /><MyFriendDashboard locale="cs" preview={preview} forMyself={preview && (await searchParams).forMyself === "1"} /></>;
}
