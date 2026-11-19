import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { MyFriendBrand } from "@/components/myfriend-brand";
import { MyFriendMessageHandoff } from "@/components/myfriend-message-handoff";
import { ACCOUNT_SESSION_COOKIE, myfriendAppPath } from "@/lib/myfriend";
import { readAccountSession } from "@/lib/myfriend-session";
import { requestHostFromHeaders } from "@/lib/elder-companion-seo";
export const dynamic = "force-dynamic";
export default async function MessagesPage() {
  const host = requestHostFromHeaders(await headers());
  if (!readAccountSession((await cookies()).get(ACCOUNT_SESSION_COOKIE)?.value))
    redirect(myfriendAppPath(host, "/login"));
  return (
    <main className="min-h-dvh bg-[#fffdf9] px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="flex justify-center">
          <MyFriendBrand />
        </div>
        <h1 className="mt-12 text-center text-[38px] font-medium leading-tight tracking-[-1.3px] text-[#262019]">
          Let’s stay in touch.
        </h1>
        <p className="mt-4 text-center text-base leading-relaxed text-black/55">
          You’re set up. We’ll take it from here, together.
        </p>
        <MyFriendMessageHandoff />
      </div>
    </main>
  );
}
