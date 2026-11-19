"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { czechAccountError } from "@/lib/myfriend-czech-errors";
import { MyFriendBrand } from "@/components/myfriend-brand";
import { MYFRIEND_CTA, clientMyFriendAppPath } from "@/lib/myfriend";

export function MyFriendLogin({ locale = "en" }: { locale?: "en" | "cs" }) {
  const cs = locale === "cs";
  const t = (en: string, cz: string) => cs ? cz : en;
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [normalized, setNormalized] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (!resendAt) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
      setResendSeconds(remaining);
      if (!remaining) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendAt]);

  async function sendCode(event?: React.FormEvent, isResend = false) {
    event?.preventDefault();
    if (busy || (isResend && Date.now() < resendAt)) return;
    const address = (isResend ? normalized : email).trim();
    // Keep native email validation without disabling text replacements in the editor.
    const validator = document.createElement("input");
    validator.type = "email";
    validator.required = true;
    validator.value = address;
    if (!validator.checkValidity()) {
      setError(t("Enter a valid email address.", "Zadejte platnou e-mailovou adresu."));
      return;
    }
    setBusy(true);
    setResending(isResend);
    setError("");
    try {
      const res = await fetch("/api/myfriend/email-login/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        email?: string;
      } | null;
      if (!data) throw new Error(t("Couldn’t reach MyFriend. Please try again shortly.", "DigiPřítel je momentálně nedostupný. Zkuste to za chvíli."));
      if (!res.ok) throw new Error((cs ? czechAccountError(data.error, res.status) : data.error) || t("Couldn't send the code.", "Kód se nepodařilo odeslat."));
      setNormalized(data.email || address);
      setStep("code");
      setCode("");
      setResendAt(Date.now() + 30_000);
      setResendSeconds(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Couldn't send the code.", "Kód se nepodařilo odeslat."));
    } finally {
      setBusy(false);
      setResending(false);
    }
  }

  async function confirmCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/myfriend/email-login/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized || email, code }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!data) throw new Error(t("Couldn’t reach MyFriend. Please try again shortly.", "DigiPřítel je momentálně nedostupný. Zkuste to za chvíli."));
      if (!res.ok) throw new Error((cs ? czechAccountError(data.error, res.status) : data.error) || t("That code didn't match.", "Kód není správný."));
      window.location.href = (cs ? "/digipritel/dashboard" : clientMyFriendAppPath("/dashboard"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Couldn't continue.", "Nepodařilo se pokračovat."));
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center px-6 py-16 text-center">
      <MyFriendBrand locale={locale} />
      <h1 className="mt-8 m-0 font-medium text-black/80 text-[32px] tracking-[-0.4px]">
        {t("Log in", "Přihlásit se")}
      </h1>
      <p className="mt-4 m-0 max-w-md text-[18px] leading-relaxed text-black/55">
        {t("Use the email you entered when setting up MyFriend. We’ll email you a sign-in code.", "Použijte e-mail z nastavení DigiPřítele. Pošleme vám přihlašovací kód.")}
      </p>
      <div className="mt-8 w-full text-left">
        {step === "email" ? (
          <form onSubmit={sendCode}>
            <label className="block">
              <span className="sr-only">{t("Email address", "E-mailová adresa")}</span>
              <input
                type="text"
                name="email"
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="on"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("you@example.com", "vas@email.cz")}
                className="h-14 w-full rounded-[18px] border border-black/10 bg-black/[0.03] px-4 text-[20px] text-black outline-none placeholder:text-black/30 focus:border-black/25"
              />
            </label>
            {error ? <p className="mt-3 m-0 text-[15px] text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="mt-6 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-[20px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: MYFRIEND_CTA, fontSize: 20 }}
            >
              {busy ? t("Sending…", "Odesílám…") : t("Email me a code", "Poslat kód e-mailem")}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmCode}>
            <p className="m-0 text-[16px] text-black/55">{cs ? `Kód byl odeslán na ${normalized}.` : `Sent to ${normalized}.`}</p>
            <label className="mt-4 block">
              <span className="sr-only">{t("Verification code", "Ověřovací kód")}</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={10}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="000000"
                className="h-14 w-full rounded-[18px] border border-black/10 bg-black/[0.03] px-4 text-center text-[28px] tracking-[0.4em] text-black outline-none placeholder:tracking-[0.4em] placeholder:text-black/20 focus:border-black/25"
              />
            </label>
            {error ? <p className="mt-3 m-0 text-[15px] text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={busy || code.length < 6}
              className="mt-6 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-[20px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: MYFRIEND_CTA, fontSize: 20 }}
            >
              {busy && !resending ? t("Continuing…", "Přihlašuji…") : t("Log in", "Přihlásit se")}
            </button>
            <button
              type="button"
              disabled={busy || resendSeconds > 0}
              onClick={() => sendCode(undefined, true)}
              className="mt-5 w-full cursor-pointer bg-transparent p-0 text-[15px] font-medium text-orange-700 underline underline-offset-2 disabled:cursor-not-allowed disabled:text-black/35 disabled:no-underline"
            >
              {resending ? t("Sending…", "Odesílám…") : resendSeconds > 0 ? (cs ? `Poslat znovu za ${resendSeconds} s` : `Resend code in ${resendSeconds}s`) : t("Resend code", "Poslat kód znovu")}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="mt-4 w-full cursor-pointer bg-transparent p-0 text-[15px] text-black/40 underline decoration-[1px] underline-offset-2 hover:text-black/65"
            >
              {t("Use a different email", "Použít jiný e-mail")}
            </button>
          </form>
        )}
      </div>
      <Link
        href={cs ? "/digipritel" : clientMyFriendAppPath("/")}
        className="mt-10 text-[16px] text-black/35 underline decoration-[1px] underline-offset-2 hover:text-black/55"
      >
        {t("Back to homepage", "Zpět na úvodní stránku")}
      </Link>
    </main>
  );
}
