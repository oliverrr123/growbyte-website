"use client";

import { MyFriendLegalAcceptance } from "@/components/myfriend-legal-acceptance";
import { MYFRIEND_LEGAL_VERSION } from "@/lib/myfriend-legal";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { MyFriendAudience } from "@/lib/myfriend";
import { MYFRIEND_CTA } from "@/lib/myfriend";

const COPY: Record<
  MyFriendAudience,
  { title: string; hint: string; placeholder: string }
> = {
  "loved-one": {
    title: "Their phone number",
    hint: "They will get a verification code SMS",
    placeholder: "+1 555 123 4567",
  },
  myself: {
    title: "Your phone number",
    hint: "We'll text you a code to confirm it.",
    placeholder: "+1 555 123 4567",
  },
};

function OrangeButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="mt-6 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-[20px] font-medium text-white origin-center transition-[scale,transform,filter,box-shadow] duration-500 ease-out hover:scale-[1.03] hover:brightness-[1.04] hover:shadow-[0_10px_24px_rgba(255,136,4,0.22)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
      style={{ backgroundColor: MYFRIEND_CTA, fontSize: 20 }}
    >
      {children}
    </button>
  );
}

export function MyFriendSignupDialog({
  audience,
  children,
}: {
  audience: MyFriendAudience;
  children: ReactNode;
}) {
  const copy = COPY[audience];
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [normalized, setNormalized] = useState("");
  const [code, setCode] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && step === "code") codeRef.current?.focus();
  }, [open, step]);

  function reset() {
    setLegalAccepted(false);
    setStep("phone");
    setPhone("");
    setNormalized("");
    setCode("");
    setBusy(false);
    setError("");
    setHint("");
  }

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setHint("");
    try {
      const res = await fetch("/api/myfriend/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, audience }),
      });
      const data = (await res.json()) as { error?: string; phone?: string; message?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't send the code.");
      setNormalized(data.phone || phone);
      setHint(data.message || "");
      setStep("code");
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the code.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode(event: React.FormEvent) {
    event.preventDefault();
    if (!legalAccepted) { setError("Please agree to the terms before checkout."); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/myfriend/verify/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized || phone, audience, code }),
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
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <Dialog.Trigger className="group flex w-full max-w-[512px] cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-inherit">
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-8 pt-10 shadow-xl outline-none transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0">
          <Dialog.Close
            className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} />
          </Dialog.Close>

          {step === "phone" ? (
            <form onSubmit={sendCode}>
              <Dialog.Title className="m-0 text-[28px] font-medium tracking-tight text-black">
                {copy.title}
              </Dialog.Title>
              <Dialog.Description className="mt-3 m-0 text-[17px] leading-snug text-black/55">
                {copy.hint}
              </Dialog.Description>
              <label className="mt-6 block">
                <span className="sr-only">Phone number</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={copy.placeholder}
                  className="h-14 w-full rounded-[18px] border border-black/10 bg-black/[0.03] px-4 text-[20px] tracking-wide text-black outline-none placeholder:text-black/30 focus:border-black/25"
                />
              </label>
              {error ? <p className="mt-3 m-0 text-[15px] text-red-600">{error}</p> : null}
              <OrangeButton type="submit" disabled={busy || !phone.trim()}>
                {busy ? "Sending…" : audience === "loved-one" ? "Text them a code" : "Text me a code"}
              </OrangeButton>
            </form>
          ) : (
            <form onSubmit={confirmCode}>
              <Dialog.Title className="m-0 text-[28px] font-medium tracking-tight text-black">
                Enter the code
              </Dialog.Title>
              <Dialog.Description className="mt-3 m-0 text-[17px] leading-snug text-black/55">
                Sent to {normalized}. $25/month after this.
              </Dialog.Description>
              <label className="mt-6 block">
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
              {hint ? <p className="mt-3 m-0 text-[15px] text-black/45">{hint}</p> : null}
              {error ? <p className="mt-3 m-0 text-[15px] text-red-600">{error}</p> : null}
              <MyFriendLegalAcceptance checked={legalAccepted} onChange={setLegalAccepted} />
              <OrangeButton type="submit" disabled={busy || !legalAccepted || code.length !== 6}>
                {busy ? "Continuing…" : "Continue to pay $25"}
              </OrangeButton>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setError("");
                  setHint("");
                }}
                className="mt-4 w-full cursor-pointer bg-transparent p-0 text-[15px] text-black/40 underline decoration-[1px] underline-offset-2 hover:text-black/65"
              >
                Use a different number
              </button>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
