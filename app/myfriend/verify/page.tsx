import { headers } from "next/headers";
import Link from "next/link";
import { MyFriendBrand } from "@/components/myfriend-brand";
import { MyFriendVerifyForm } from "@/components/myfriend-verify-form";
import { myfriendAppPath } from "@/lib/myfriend";
import { requestHostFromHeaders } from "@/lib/elder-companion-seo";

export default async function MyFriendVerifyPage() {
  const host = requestHostFromHeaders(await headers());
  const homePath = myfriendAppPath(host, "/");

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center px-6 py-16 text-center">
      <MyFriendBrand />
      <h1 className="mt-8 m-0 font-medium text-black/80 text-[32px] tracking-[-0.4px]">
        I have a verification code
      </h1>
      <p className="mt-4 m-0 max-w-md text-[18px] leading-relaxed text-black/55">
        Enter the 6-digit code MyFriend told you on the call. Then you&apos;ll pay $25/month.
      </p>
      <div className="mt-8 w-full">
        <MyFriendVerifyForm />
      </div>
      <Link
        href={homePath}
        className="mt-10 text-[16px] text-black/35 underline decoration-[1px] underline-offset-2 hover:text-black/55"
      >
        Back to MyFriend
      </Link>
    </main>
  );
}
