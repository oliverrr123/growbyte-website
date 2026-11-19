"use client";

import { useState } from "react";
import { toast } from "sonner";

export function CallMeButton({
  sessionId,
  label = "Have MyFriend call you",
  successMessage = "MyFriend is calling you now.",
}: {
  sessionId: string;
  label?: string;
  successMessage?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function callMe() {
    setBusy(true);
    try {
      const res = await fetch("/api/myfriend/call-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't place the call.");
      toast.success(successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't place the call.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={callMe}
      disabled={busy}
      className="inline-flex h-14 cursor-pointer items-center justify-center rounded-[20px] border border-black/10 bg-white font-medium text-black/80 transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
      style={{ fontSize: 20 }}
    >
      {busy ? "Calling…" : label}
    </button>
  );
}
