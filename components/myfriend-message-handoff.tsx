"use client";
import { useEffect, useState } from "react";
export function MyFriendMessageHandoff() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/myfriend/messages")
      .then(async (r) => {
        const data = await r.json();
        setAvailable(r.ok && data.available);
      })
      .catch(() => setAvailable(false));
  }, []);
  async function connect() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/myfriend/messages", { method: "POST" });
      const data = await r.json();
      if (!r.ok)
        throw new Error(data.error || "Could not start your conversation.");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mt-8">
      <div className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-[0_12px_50px_-30px_#ff8b00]">
        <div
          aria-hidden="true"
          className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="size-6"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
          </svg>
        </div>
        <h2 className="m-0 text-2xl font-medium tracking-tight text-[#262019]">
          {sent
            ? "Check your Messages."
            : "Your family assistant, one text away."}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-black/55">
          {sent
            ? "Your first message is queued for your verified phone number. Reply there to start your conversation."
            : "Ask about shared updates, choose check-in times, or get help with your plan. It all happens in your conversation with MyFriend."}
        </p>
        {!sent && (
          <>
            <p className="mt-5 rounded-2xl bg-[#fff8ef] p-4 text-[15px] leading-relaxed text-black/60">
              “Can we set up a daily call for grandma?”
            </p>
            <button
              onClick={connect}
              disabled={!available || busy}
              className="mt-6 min-h-14 w-full rounded-[18px] bg-orange-500 px-5 py-4 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {busy
                ? "Starting your conversation…"
                : available === null
                  ? "Checking availability…"
                  : available
                    ? "Send me a message"
                    : "Messaging is being set up"}
            </button>
            {available && (
              <p className="mt-3 text-xs leading-relaxed text-black/45">
                Sends a welcome message to the number you verified. Daily
                reports are optional; ask MyFriend to enable them. Reply STOP to
                stop messages.
              </p>
            )}
            {available === false && (
              <p className="mt-3 text-sm leading-relaxed text-black/55">
                Your account is saved. Need help getting started?{" "}
                <a
                  href="tel:+14153771909"
                  className="underline underline-offset-2"
                >
                  Call Oliver
                </a>
                .
              </p>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
      <p className="mt-5 text-center text-sm leading-relaxed text-black/45">
        Your loved one keeps using phone calls. They choose whether to share
        updates with you.
      </p>
    </div>
  );
}
