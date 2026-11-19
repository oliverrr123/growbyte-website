import Link from "next/link";
import { MYFRIEND_ACCENT } from "@/lib/myfriend";

export default function MyFriendCheckoutCancel() {
  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <span className="caveat-bold-font text-[56px] leading-none tracking-tight sm:text-[72px]">
        <span className="text-black">my</span>
        <span style={{ color: MYFRIEND_ACCENT }}>friend</span>
      </span>
      <h1 className="mt-8 m-0 font-medium text-black/80 text-[32px]">Checkout canceled</h1>
      <p className="mt-4 m-0 text-[18px] text-black/55">
        No charge was made. You can pick it up again whenever you&apos;re ready.
      </p>
      <Link
        href="/myfriend"
        className="mt-8 inline-block text-[18px] text-black/50 underline decoration-[1px] underline-offset-2 hover:text-black/70"
      >
        Back to MyFriend
      </Link>
    </main>
  );
}
