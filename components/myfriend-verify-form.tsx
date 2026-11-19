"use client";

import { MyFriendLegalAcceptance } from "@/components/myfriend-legal-acceptance";
import { MYFRIEND_LEGAL_VERSION } from "@/lib/myfriend-legal";

import { useEffect, useRef, useState } from "react";
import { MYFRIEND_CTA } from "@/lib/myfriend";

export function MyFriendVerifyForm() {
  const [code, setCode] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    codeRef.current?.focus();
  }, []);

  async function confirmCode(event: React.FormEvent) {
    event.preventDefault();
    if (!legalAccepted) { setError("Please agree to the terms before checkout."); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/myfriend/verify/call-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "That code didn't match.");

      const checkout = await fetch("/api/myfriend/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ legal: { accepted: legalAccepted, version: MYFRIEND_LEGAL_VERSION } }) });
      const checkoutData = (await checkout.json()) as { url?: string; error?: string };
      if (!checkout.ok || !checkoutData.url) {
        throw new Error(checkoutData.error || "Couldn't start checkout.");
      }
      window.location.href = checkoutData.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't continue.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={confirmCode} className="w-full text-left">
      <label className="block">
        <span className="sr-only">Verification code</span>
        <input
          ref={codeRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          className="h-14 w-full rounded-[18px] border border-black/10 bg-black/[0.03] px-4 text-center text-[28px] tracking-[0.4em] text-black outline-none placeholder:tracking-[0.4em] placeholder:text-black/20 focus:border-black/25"
        />
      </label>
      {error ? <p className="mt-3 m-0 text-[15px] text-red-600">{error}</p> : null}
      <MyFriendLegalAcceptance checked={legalAccepted} onChange={setLegalAccepted} />
      <button
        type="submit"
        disabled={busy || !legalAccepted || code.length !== 6}
        className="mt-6 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-[20px] font-medium text-white origin-center transition-[scale,transform,filter,box-shadow] duration-500 ease-out hover:scale-[1.03] hover:brightness-[1.04] hover:shadow-[0_10px_24px_rgba(255,136,4,0.22)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        style={{ backgroundColor: MYFRIEND_CTA, fontSize: 20 }}
      >
        {busy ? "Continuing…" : "Continue to pay $25"}
      </button>
    </form>
  );
}
