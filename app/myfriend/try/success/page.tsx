import Link from "next/link";
import { headers } from "next/headers";
import { MYFRIEND_ACCENT, MYFRIEND_CTA, myfriendAppPath, myfriendLineFor } from "@/lib/myfriend";
import { stripeClient } from "@/lib/myfriend-providers";
import { CallMeButton } from "@/components/myfriend-call-me-button";
import { requestHostFromHeaders } from "@/lib/elder-companion-seo";

export const dynamic = "force-dynamic";

function Brand() {
  return (
    <span className="caveat-bold-font text-[56px] leading-none tracking-tight sm:text-[72px]">
      <span className="text-black">my</span>
      <span style={{ color: MYFRIEND_ACCENT }}>friend</span>
    </span>
  );
}

export default async function MyFriendCheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const host = requestHostFromHeaders(await headers());
  const dashboardPath = myfriendAppPath(host, "/messages");
  const stripe = stripeClient();

  if (!sessionId || !stripe) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <Brand />
        <p className="mt-8 text-[22px] text-black/60">We couldn&apos;t find that checkout.</p>
        <Link href="/myfriend" className="mt-6 inline-block text-[18px] text-black/50 underline">
          Back to MyFriend
        </Link>
      </main>
    );
  }

  let session: Awaited<ReturnType<NonNullable<ReturnType<typeof stripeClient>>["checkout"]["sessions"]["retrieve"]>>;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <Brand />
        <p className="mt-8 text-[22px] text-black/60">We couldn&apos;t find that checkout.</p>
        <Link href="/myfriend" className="mt-6 inline-block text-[18px] text-black/50 underline">
          Back to MyFriend
        </Link>
      </main>
    );
  }
  if (session.status !== "complete") {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <Brand />
        <p className="mt-8 text-[22px] text-black/60">Payment isn&apos;t finished yet.</p>
        <Link href="/myfriend" className="mt-6 inline-block text-[18px] text-black/50 underline">
          Back to MyFriend
        </Link>
      </main>
    );
  }

  const phone = session.metadata?.phone ?? "";
  const line = myfriendLineFor(phone || "+1");
  const forLovedOne = session.metadata?.audience === "loved-one";

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center px-6 py-16 text-center">
      <Brand />
      <h1 className="mt-8 m-0 font-medium text-black/80 text-[32px] tracking-[-0.4px] sm:text-[40px]">
        You&apos;re in.
      </h1>
      <p className="mt-4 m-0 max-w-md text-[18px] leading-relaxed text-black/55">
        {forLovedOne
          ? "This is the number they can call anytime — or tap below and MyFriend will ring them now to get started."
          : "This is your number to call anytime — or tap below and MyFriend will ring you now to get started."}
      </p>

      <a
        href={line.href}
        className="mt-10 block w-full max-w-md rounded-[28px] bg-black/[0.04] px-6 py-8 text-[32px] font-medium tracking-tight text-black sm:text-[40px]"
      >
        {line.display}
      </a>
      {phone ? (
        <p className="mt-3 m-0 text-[15px] text-black/40">Confirmed for {phone}</p>
      ) : null}

      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        <a
          href={line.href}
          className="inline-flex h-14 items-center justify-center rounded-[20px] font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: MYFRIEND_CTA, fontSize: 20 }}
        >
          Call this now
        </a>
        <CallMeButton
          sessionId={sessionId}
          label={forLovedOne ? "Have MyFriend call them" : "Have MyFriend call you"}
          successMessage={
            forLovedOne ? "MyFriend is calling them now." : "MyFriend is calling you now."
          }
        />
        <Link
          href={dashboardPath}
          className="inline-flex h-14 items-center justify-center rounded-[20px] border border-black/10 font-medium text-black/70 transition-colors hover:bg-black/[0.04]"
          style={{ fontSize: 20 }}
        >
          Continue in Messages
        </Link>
      </div>

      <Link href="/myfriend" className="mt-10 text-[16px] text-black/35 underline decoration-[1px] underline-offset-2 hover:text-black/55">
        Back to MyFriend
      </Link>
    </main>
  );
}
