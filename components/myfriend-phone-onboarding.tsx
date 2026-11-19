"use client";

import Link from "next/link";
import { validSetupEmail } from "@/lib/myfriend-checkout-email";
import { MyFriendPaymentSuccess } from "@/components/myfriend-payment-success";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, LoaderCircle } from "lucide-react";
import { MYFRIEND_LEGAL_VERSION } from "@/lib/myfriend-legal";
import styles from "./myfriend-phone-onboarding.module.css";

const api = async (path: string, body?: unknown) => {
  const response = await fetch(path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { cache: "no-store" });
  const data = await response.json();
  if (!response.ok || data.error) throw Object.assign(new Error(data.error || "Něco se nepovedlo. Zkuste to znovu."), { status: response.status });
  return data;
};
const field = "mt-3 w-full rounded-2xl border border-black/10 bg-[#f6f6f6] px-5 py-4 text-lg outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5";
const primary = "mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff8804] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#e87900] disabled:opacity-50";

export function MyFriendPhoneOnboarding({ locale = "cs" }: { locale?: "cs" | "en" }) {
  const cs = locale === "cs";
  const t = (czech: string, english: string) => cs ? czech : english;
  const line = cs ? "+420910920500" : "+19496767670";
  const number = cs ? "+420 910 920 500" : "+1 949 676 7670";
  const brand = cs ? "DigiPřítel" : "MyFriend";
  const prefix = cs ? "+420 " : "+1 ";
  const dashboard = cs ? "/digipritel/dashboard" : "/myfriend/dashboard";
  const phoneApi = (body?: Record<string, unknown>) => api("/api/myfriend/phone-onboarding?line=" + encodeURIComponent(line), body ? { ...body, line } : undefined);
  const [step, setStep] = useState("call");
  const [testCheckout, setTestCheckout] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeEntryStarted = useRef(false);
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState(prefix);
  const [sms, setSms] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [self, setSelf] = useState(false);
  useEffect(() => {
    let active = true;
    void (async () => {
      const params = new URLSearchParams(window.location.search);
      if (cs && process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname) && params.get("testCheckout") === "1") {
        setTestCheckout(true);
        setStep("payment");
        if (params.has("testPaid")) {
          try {
            const result = await api("/api/myfriend/test-checkout");
            if (active && result.paid) { setEmail(result.email || ""); setStep("thank-you"); }
            else if (active) setError(t("Testovací platba zatím není potvrzená.", "The test payment is not confirmed yet."));
          } catch (e) { if (active) setError((e as Error).message); }
        }
        return;
      }
      const setup = params.has("setup");
      try {
        if (setup) {
          const data = await api("/api/myfriend/onboarding");
          if (active && data.paid) { if (data.stage === "email" && validSetupEmail(data.email)) { await api("/api/myfriend/onboarding", { action: "email", email: data.email }); if (!active) return; data.stage = "welcome"; } setStep(data.stage || "thank-you"); setEmail(data.email || ""); setSelf(data.for_myself === true); }
          else if (active) setError(t("Platbu zatím nemáme potvrzenou. Obnovte stránku za chvíli.", "Payment is not confirmed yet. Please refresh in a moment."));
        } else {
          const data = await phoneApi();
          if (active && !codeEntryStarted.current && data.ready === true) setStep("payment");
        }
      } catch (e) { if (active && !codeEntryStarted.current) setError((e as Error).message); }
    })();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!testCheckout || step !== "email") return;
    let active = true;
    // Also resume an already-open local preview created before email was restored.
    void api("/api/myfriend/test-checkout").then(data => {
      if (active && data.paid && validSetupEmail(data.email)) {
        setEmail(data.email);
        setStep("welcome");
      }
    }).catch(() => { /* Keep the manual email fallback available. */ });
    return () => { active = false; };
  }, [testCheckout, step]);
  async function run(action: () => Promise<void>) {
    setBusy(true); setError("");
    try { await action(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function verify(event: FormEvent) {
    event.preventDefault();
    await run(async () => {
      const audience = step === "buyer" ? "myself" : "loved-one";
      if (!sent) {
        const result = await api("/api/myfriend/verify/send", { phone, audience });
        if (result.preview) throw new Error(t("Skutečné ověřovací SMS nejsou nakonfigurované.", "SMS verification is not configured."));
        setSent(true); return;
      }
      await api("/api/myfriend/verify/check", { phone, audience, code: sms });
      if (testCheckout) {
        setStep(step === "buyer" && !self ? "senior" : validSetupEmail(email) ? "welcome" : "email"); setSent(false); setSms(""); setPhone(prefix);
        return;
      }
      const data = await api("/api/myfriend/onboarding", { action: step });
      if (typeof data.for_myself === "boolean") setSelf(data.for_myself);
      setStep(data.stage || (step === "buyer" ? "senior" : "email")); setSent(false); setSms(""); setPhone(prefix);
    });
  }
  if (step === "thank-you") return <main className="mf-onboarding min-h-dvh bg-[#fffdf9] text-black"><div className="mf-onboarding-content mx-auto w-full max-w-[600px] px-5 pb-10 pt-3 sm:px-8 sm:pb-14 sm:pt-4"><MyFriendPaymentSuccess locale={locale}><button disabled={busy} className={primary} onClick={() => void run(async () => { if (testCheckout) { setStep("buyer"); return; } const data = await api("/api/myfriend/onboarding", { action: "thank-you" }); setStep(data.stage || "buyer"); })}>{busy ? t("Chvilku prosím…", "Please wait…") : t("Pokračovat", "Continue")}</button></MyFriendPaymentSuccess>{error && <p role="alert" className="mt-4 text-red-700">{error}</p>}</div></main>;
  return (
    <main className="flex min-h-[100svh] flex-col bg-white text-[#111]">
      <header className="flex h-24 shrink-0 items-center justify-between px-6 sm:h-28 sm:px-12">
        <Link href={cs ? "/digipritel" : "/myfriend"} className="text-lg tracking-tight text-black/40 hover:text-black">{brand}</Link>
      </header>
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center px-6 pb-16 pt-8 sm:px-10 sm:pb-28">
        <div key={`${step}-${sent}`} className={styles.screen}>
          {step === "call" && <>
            <h1 className="text-[34px] font-medium leading-[1.12] tracking-[-1.4px] sm:text-[48px] sm:tracking-[-2px]">{t("Zavolejte DigiPříteli.", "Call MyFriend.")}</h1>
            <p className="mt-4 max-w-xl text-xl leading-relaxed text-black/55 sm:text-[25px]">{t("Seznamte se. Popovídejte si. Stačí zavolat.", "Say hello. Have a chat. Just call.")}</p>
            <div className="mt-10 flex items-center justify-between gap-2 rounded-[28px] bg-[#f5f5f5] px-5 py-6 sm:mt-12 sm:px-8 sm:py-7">
              <a href={"tel:" + line} className="min-w-0">
                <span className="block text-base text-black/45 sm:text-lg">{brand}</span>
                <span className="mt-1 block whitespace-nowrap text-[clamp(22px,7vw,31px)] font-medium tracking-[-1px] sm:text-[40px]">{number}</span>
              </a>
              <button type="button" aria-label={copied ? t("Číslo zkopírováno", "Number copied") : t("Zkopírovat číslo", "Copy number")} className="flex size-10 shrink-0 items-center justify-center rounded-full text-black/40 transition hover:bg-black/5 hover:text-black" onClick={async () => { try { await navigator.clipboard.writeText(line); setCopied(true); } catch { setError(t("Číslo se nepodařilo zkopírovat. Můžete ho označit a zkopírovat ručně.", "Could not copy the number. You can select and copy it manually.")); } }}>
                {copied ? <Check size={22} /> : <Copy size={22} strokeWidth={1.6} />}
              </button>
            </div>
            <button onClick={() => { codeEntryStarted.current = true; setAccepted(false); setError(""); setStep("code"); }} className="mt-8 inline-flex min-h-11 items-center gap-2 text-lg text-black/55 underline decoration-black/25 underline-offset-4 transition hover:text-black">{t("Mám kód", "I have a code")} <ArrowRight size={17} /></button>
          </>}
          {step === "code" && <form onSubmit={e => { e.preventDefault(); void run(async () => { codeEntryStarted.current = true; setAccepted(false); setStep("code"); const localTest = cs && process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname) && code === "4242"; const data = await (localTest ? api("/api/myfriend/test-checkout", { action: "code", code }) : phoneApi({ action: "code", code })); if (data.ok !== true) throw new Error(t("Kód se nepodařilo ověřit. Zkuste to znovu.", "Could not verify the code. Please try again.")); setTestCheckout(localTest && data.testCheckout === true); setStep("payment"); }); }}>
            <button type="button" onClick={() => { setStep("call"); setError(""); }} className="mb-8 flex min-h-11 items-center gap-2 text-sm text-black/45 hover:text-black"><ArrowLeft size={17} /> {t("Zpět", "Back")}</button>
            <h1 className="text-[34px] font-medium leading-tight tracking-[-1px] sm:text-[44px]">{t("Zadejte kód z hovoru", "Enter your call code")}</h1>
            <div className="mt-8 flex items-stretch gap-3">
              <label htmlFor="call-code" className="sr-only">{t("Čtyřmístný kód", "Four-digit code")}</label>
              <input id="call-code" autoFocus inputMode="numeric" autoComplete="off" pattern="[0-9]{4}" maxLength={4} required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0000" className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-[#f6f6f6] px-4 py-4 text-center text-3xl tracking-[0.35em] outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5" />
              <button type="submit" disabled={busy || code.length !== 4} aria-label={busy ? t("Ověřuji…", "Checking…") : t("Pokračovat", "Continue")} aria-busy={busy} className="flex w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ff8804] text-white transition hover:bg-[#e87900] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8804] disabled:opacity-50">{busy ? <LoaderCircle size={24} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight size={24} aria-hidden="true" />}</button>
            </div>
          </form>}
          {step === "payment" && <>
            <h1 className="text-[34px] font-medium leading-tight tracking-[-1px] sm:text-[44px]">{t("DigiPřítel - AI společník na telefonu", "MyFriend - AI companion on the phone")}</h1>
            <p className="mt-4 leading-7 text-black/60">{t("Dokončete nastavení a začněte si povídat.", "Finish setting up and start chatting.")}</p>
            <p className="mt-7 text-4xl font-semibold">{t("300 Kč", "$25")} <span className="text-base font-normal text-black/45">{t("/ měsíc", "/ month")}</span></p>
            {!testCheckout && <label className="mt-7 block text-sm font-medium">{t("Číslo, ze kterého jste volali", "The phone number you called from")}<input className={field} type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} required /></label>}
            <label className="mt-7 flex items-start gap-3 text-sm leading-6 text-black/60"><span className="relative mt-1 inline-flex size-4 shrink-0"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="peer size-4 appearance-none rounded-[3px] border border-black/40 checked:border-[#ff8804] checked:bg-[#ff8804] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8804]" /><Check size={14} strokeWidth={3} aria-hidden="true" className="pointer-events-none absolute inset-[1px] hidden text-white peer-checked:block" /></span><span>{t("Souhlasím s", "I agree to the")} <a className="underline" href={cs ? "/digipritel/podminky" : "/myfriend/terms"} target="_blank" rel="noreferrer">{t("podmínkami", "terms")}</a> {t("a beru na vědomí", "and acknowledge the")} <a className="underline" href={cs ? "/digipritel/soukromi" : "/myfriend/privacy"} target="_blank" rel="noreferrer">{t("zásady soukromí", "privacy policy")}</a>{t(". Předplatné 300 Kč se obnovuje každý měsíc do zrušení.", ". The $25 subscription renews monthly until canceled.")}</span></label>
            <button disabled={busy || !accepted} className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff8804] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#e87900] disabled:opacity-50" onClick={() => void run(async () => { try { const data = await (testCheckout ? api("/api/myfriend/test-checkout", { action: "checkout", phone, legal: { accepted, version: MYFRIEND_LEGAL_VERSION } }) : phoneApi({ action: "checkout", phone, legal: { accepted, version: MYFRIEND_LEGAL_VERSION } })); window.location.assign(data.url); } catch (e) { if ((e as Error & { status?: number }).status === 401) { codeEntryStarted.current = true; setStep("code"); setAccepted(false); setCode(""); } throw e; } })}>{busy ? t("Otevírám platbu…", "Opening checkout…") : t("Zaplatit 300 Kč měsíčně", "Pay $25 monthly")}<ArrowRight size={18} /></button>
            {!testCheckout && <button type="button" disabled={busy} className="mt-5 text-sm text-black/55 underline underline-offset-4" onClick={() => { codeEntryStarted.current = true; setStep("code"); setAccepted(false); setCode(""); setError(""); }}>{t("Zadat jiný kód", "Enter a different code")}</button>}
          </>}
          {(step === "buyer" || step === "senior") && <form onSubmit={e => void verify(e)}>
            <h1 className="text-3xl font-semibold">{sent ? t("Zadejte kód z SMS", "Enter the code from your text message") : step === "buyer" ? t("Zadejte Vaše telefonní číslo", "Enter your phone number") : t("Číslo vašeho blízkého", "Your loved one’s phone number")}</h1>
            {(sent || step === "senior") && <p className="mt-4 leading-7 text-black/60">{sent ? t("Poslali jsme vám šestimístný ověřovací kód.", "We sent you a six-digit verification code.") : t("Domluvte se se svým blízkým, zda chce DigiPřítele používat. Ověřovací SMS přijde na jeho telefon.", "Check that your loved one would like to use MyFriend. The verification text will go to their phone.")}</p>}
            <label className="mt-6 block text-sm font-medium">{sent ? t("Kód z SMS", "Verification code") : t("Telefonní číslo", "Phone number")}<input className={field} type={sent ? "text" : "tel"} inputMode={sent ? "numeric" : "tel"} autoComplete={sent ? "one-time-code" : "tel"} value={sent ? sms : phone} maxLength={sent ? 6 : 30} onChange={e => sent ? setSms(e.target.value.replace(/\D/g, "").slice(0, 6)) : setPhone(e.target.value)} required /></label>
            <button disabled={busy} className={primary}>{busy ? t("Chvilku prosím…", "Please wait…") : sent ? t("Ověřit číslo", "Verify number") : t("Poslat ověřovací SMS", "Send verification code")}</button>
            {sent && <button type="button" onClick={() => { setSent(false); setSms(""); }} className="mt-5 w-full text-sm underline">{t("Změnit číslo nebo poslat SMS znovu", "Change number or resend code")}</button>}
            {step === "senior" && <button type="button" disabled={busy} className="mt-5 w-full text-sm text-black/60 underline underline-offset-4 disabled:opacity-50" onClick={() => void run(async () => { const data = testCheckout ? { stage: validSetupEmail(email) ? "welcome" : "email" } : await api("/api/myfriend/onboarding", { action: "use-myself" }); setSelf(true); setSent(false); setSms(""); setStep(data.stage || "email"); })}>{t("Používám DigiPřítele pro sebe", "I’m using MyFriend for myself")}</button>}
            {step === "senior" && <button type="button" disabled={busy} className="mt-5 w-full text-sm underline" onClick={() => void run(async () => { const data = testCheckout ? { stage: validSetupEmail(email) ? "welcome" : "email" } : await api("/api/myfriend/onboarding", { action: "skip-senior" }); setStep(data.stage || "email"); })}>{t("Přidat číslo později", "Add the number later")}</button>}
          </form>}
          {step === "email" && <form onSubmit={e => { e.preventDefault(); void run(async () => { if (!testCheckout) await api("/api/myfriend/onboarding", { action: "email", email }); setStep("welcome"); }); }}><h1 className="text-3xl font-semibold">{t("Kam vám můžeme napsat?", "Where can we reach you?")}</h1><p className="mt-4 leading-7 text-black/60">{t("E-mail slouží také pro přihlášení a správu předplatného.", "Your email also lets you sign in and manage your subscription.")}</p><label className="mt-6 block text-sm font-medium">{t("E-mail", "Email")}<input className={field} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><button disabled={busy} className={primary}>{t("Pokračovat", "Continue")}</button></form>}
          {(step === "welcome" || step === "done") && <><h1 className="text-3xl font-semibold">{t("Vítejte u DigiPřítele.", "Welcome to MyFriend.")}</h1><p className="mt-4 leading-7 text-black/60">{self ? t("Teď už můžete zavolat ze svého ověřeného čísla a začít si povídat.", "You can now call from your verified number and start chatting.") : t("Váš blízký může zavolat ze svého ověřeného čísla. Pokud jste ho zatím nepřidali, dokončete to ve správě účtu.", "Your loved one can call from their verified number. If you have not added it yet, you can do that in your account.")} {t("Pravidelné hovory a sdílení shrnutí nastavíme až po souhlasu člověka, který bude DigiPřítele používat.", "Regular calls and family summaries are set up only with the consent of the person using MyFriend.")}</p><a className={primary} href={"tel:" + line}>{number}</a><button disabled={busy} className="mt-5 w-full text-sm underline" onClick={() => void run(async () => { if (!testCheckout) await api("/api/myfriend/onboarding", { action: "finish" }); window.location.assign(testCheckout ? `/digipritel/dashboard?preview=1${self ? "&forMyself=1" : ""}` : dashboard); })}>{t("Otevřít můj účet", "Open my account")}</button></>}
          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</p>}
        </div>
      </div>
      <p className="px-6 pb-7 text-center text-xs text-black/30">{t("DigiPřítel je AI společník.", "MyFriend is an AI companion.")}</p>
    </main>
  );
}
