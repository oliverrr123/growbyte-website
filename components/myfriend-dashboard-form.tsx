"use client";
import { useMyFriendAccountLocale } from "@/components/myfriend-account-locale";

import { useEffect, useState } from "react";
import { MyFriendCheckinSchedule } from "@/components/myfriend-checkin-schedule";
import { MyFriendCheckins } from "@/components/myfriend-checkins";
import { MyFriendPlanNumbers } from "@/components/myfriend-plan-numbers";
import { MYFRIEND_PHONES } from "@/lib/myfriend";
import type { MyFriendAccount } from "@/lib/myfriend-api";
import { myfriendToast } from "@/lib/myfriend-toast";
import { formatPhoneNumber } from "@/lib/myfriend-phone-format";

const relations: Record<string, string> = {
  mom: "Mom", dad: "Dad", grandmother: "Grandma", grandfather: "Grandpa", partner: "Your partner",
};
const rowClass = "myfriend-settings-item";
const labelClass = "text-base text-[#292219]";
const numberClass = "min-w-0 text-base sm:text-[18px]";
const valueActionClass = `${numberClass} myfriend-setting-value`;
const editClass = "min-h-11 shrink-0 text-sm text-[#827363] underline underline-offset-4 hover:text-[#292219] disabled:opacity-50";

export function MyFriendDashboardForm({ account }: { account: MyFriendAccount }) {
  const { cs, t, request } = useMyFriendAccountLocale();
  const [saved, setSaved] = useState(account);
  const [seniorPhone, setSeniorPhone] = useState(formatPhoneNumber(account.senior_phone_number ?? ""));
  const [buyerPhone, setBuyerPhone] = useState(formatPhoneNumber(account.buyer_phone_number));
  const [editingSenior, setEditingSenior] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState(false);
  const [busy, setBusy] = useState<"senior" | "buyer" | null>(null);
  const [feedback, setFeedback] = useState<{ section: string; message: string; error?: boolean } | null>(null);
  const [verification, setVerification] = useState<{ section: "senior" | "buyer"; phone: string } | null>(null);
  const [code, setCode] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);
  useEffect(() => {
    const tick = () => setResendSeconds(Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)));
    tick();
    if (!resendAt) return;
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [resendAt]);
  function beginEdit(section: "senior" | "buyer") {
    setSeniorPhone(formatPhoneNumber(saved.senior_phone_number ?? ""));
    setBuyerPhone(formatPhoneNumber(saved.buyer_phone_number));
    setEditingSenior(section === "senior"); setEditingBuyer(section === "buyer");
    setVerification(null); setCode(""); setFeedback(null);
  }
  function cancelEdit() {
    setEditingSenior(false); setEditingBuyer(false); setVerification(null); setCode(""); setFeedback(null);
    setSeniorPhone(formatPhoneNumber(saved.senior_phone_number ?? ""));
    setBuyerPhone(formatPhoneNumber(saved.buyer_phone_number));
  }
  async function sendCode(section: "senior" | "buyer") {
    setBusy(section); setFeedback(null);
    try {
      const response = await request("/api/myfriend/account/phone-verification", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: section, phone: verification?.section === section ? verification.phone : section === "senior" ? seniorPhone : buyerPhone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("Couldn't send the code.", "Kód se nepodařilo odeslat."));
      setVerification({ section, phone: data.phone }); setCode("");
      setResendSeconds(30); setResendAt(Date.now() + 30_000);
    } catch (error) {
      setFeedback({ section, error: true, message: error instanceof Error ? error.message : t("Couldn't send the code.", "Kód se nepodařilo odeslat.") });
    } finally { setBusy(null); }
  }
  const csRelations: Record<string, string> = { mom: "Maminka", dad: "Tatínek", grandmother: "Babička", grandfather: "Dědeček", partner: "Partner či partnerka" };
  const person = (cs ? csRelations : relations)[saved.relationship ?? ""] || saved.senior_first_name || t("Your loved one", "Váš blízký");
  const servicePhone = cs ? MYFRIEND_PHONES.eu : MYFRIEND_PHONES.us;
  const seniorLabel = saved.using_own_number ? t("Number for calls", "Číslo pro hovory") : cs ? `Telefon: ${person}` : `${person}’s number`;

  async function saveNumber(event: React.FormEvent | null, section: "senior" | "buyer", verificationCode = code) {
    event?.preventDefault();
    if (verification?.section !== section) { await sendCode(section); return; }
    setBusy(section); setFeedback(null);
    try {
      const response = await request(`/api/myfriend/account/${section}-phone`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section === "senior" ? { senior_phone: verification.phone, for_myself: false, code: verificationCode } : { new_phone: verification.phone, code: verificationCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("Couldn't save that number.", "Číslo se nepodařilo uložit."));
      setSaved(data);
      setVerification(null); setCode("");
      setSeniorPhone(formatPhoneNumber(data.senior_phone_number ?? ""));
      setBuyerPhone(formatPhoneNumber(data.buyer_phone_number));
      if (section === "senior") setEditingSenior(false); else setEditingBuyer(false);
      myfriendToast(t("Number saved.", "Číslo bylo uloženo."));
    } catch (error) {
      setFeedback({ section, message: error instanceof Error ? error.message : t("Couldn't save that number.", "Číslo se nepodařilo uložit."), error: true });
    } finally { setBusy(null); }
  }

  function finishNumberEdit(section: "senior" | "buyer") {
    if (!(section === "senior" ? editingSenior : editingBuyer) || busy || verification?.section === section) return;
    const value = section === "senior" ? seniorPhone : buyerPhone;
    const previous = section === "senior" ? saved.senior_phone_number ?? "" : saved.buyer_phone_number;
    if (value.replace(/\D/g, "") === previous.replace(/\D/g, "")) {
      cancelEdit();
      return;
    }
    void sendCode(section);
  }

  function message(section: string) {
    return feedback?.section === section ? <p role={feedback.error ? "alert" : "status"} className={`myfriend-motion-enter mt-3 text-sm ${feedback.error ? "text-red-700" : "text-[#51714d]"}`}>{feedback.message}</p> : null;
  }

  function numberField(section: "senior" | "buyer") {
    const label = section === "senior" ? seniorLabel : t("Your number", "Vaše číslo");
    const value = section === "senior" ? seniorPhone : buyerPhone;
    const previous = section === "senior" ? saved.senior_phone_number ?? "" : saved.buyer_phone_number;
    const setValue = section === "senior" ? setSeniorPhone : setBuyerPhone;
    const editing = section === "senior" ? editingSenior : editingBuyer;
    return (verification?.section === section ? <input
            key={`${section}-code`} autoFocus aria-label={t("Verification code", "Ověřovací kód")} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
            value={code} disabled={busy !== null} placeholder={t("6-digit code", "Šestimístný kód")}
            className="myfriend-motion-enter min-w-0 w-full bg-transparent text-right text-base outline-none sm:text-[18px]"
            onChange={event => { const next = event.target.value.replace(/\D/g, ""); setCode(next); if (next.length === 6) void saveNumber(null, section, next); }}
            onKeyDown={event => { if (event.key === "Enter" && code.length === 6) { event.preventDefault(); void saveNumber(null, section); } if (event.key === "Escape") cancelEdit(); }}
          /> : <div className="flex min-w-0 items-center justify-end"><input
            key={`${section}-number`} aria-label={label} type="tel" inputMode="tel" autoComplete={section === "buyer" ? "tel" : "off"} enterKeyHint="done"
            value={value} placeholder={section === "senior" ? t("Not added yet", "Zatím nepřidáno") : undefined} disabled={busy !== null}
            className="min-w-0 w-full bg-transparent text-right text-base outline-none placeholder:text-[#827363] focus:underline focus:decoration-[#d1d1d6] focus:underline-offset-4 sm:text-[18px]"
            onFocus={() => { if (!editing) beginEdit(section); }}
            onChange={event => setValue(event.target.value)}
            onBlur={() => { if (value.replace(/\D/g, "") === previous.replace(/\D/g, "")) cancelEdit(); }}
            onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); finishNumberEdit(section); } if (event.key === "Escape") { cancelEdit(); } }}
          /><span className="myfriend-inline-action" style={cs && editing ? { width: 50 } : undefined} data-visible={editing} aria-hidden={!editing} inert={!editing}><button type="button" disabled={busy !== null || !editing} onMouseDown={event => event.preventDefault()} onClick={() => finishNumberEdit(section)} className="relative shrink-0 text-sm font-medium leading-6 text-[#e57900] before:absolute before:inset-x-0 before:top-1/2 before:h-11 before:-translate-y-1/2 disabled:opacity-50">{t("Done", "Hotovo")}</button></span></div>);
  }

  function numberFeedback(section: "senior" | "buyer") {
    return <>
        {busy === section && <p role="status" className="myfriend-motion-enter mt-2 text-right text-sm text-[#827363]">{verification?.section === section ? t("Verifying…", "Ověřuji…") : t("Sending a verification code…", "Posílám ověřovací kód…")}</p>}
        {verification?.section === section && <div className="myfriend-motion-enter mt-2 text-right text-sm text-[#827363]">
          <p>{cs ? `Zadejte kód odeslaný na ${formatPhoneNumber(verification.phone)}.` : `Enter the code sent to ${formatPhoneNumber(verification.phone)} above.`}</p>
          <div className="mt-1 flex justify-end gap-4">
            <button type="button" disabled={busy !== null || resendSeconds > 0} className={editClass} onClick={() => sendCode(section)}>{resendSeconds > 0 ? (cs ? `Poslat znovu za ${resendSeconds} s` : `Resend in ${resendSeconds}s`) : t("Resend code", "Poslat kód znovu")}</button>
            <button type="button" disabled={busy !== null} className={editClass} onClick={cancelEdit}>{t("Cancel", "Zrušit")}</button>
          </div>
        </div>}
        {message(section)}
    </>;
  }

  return (
    <div className="myfriend-settings-groups space-y-6">
      <section className="myfriend-settings-card myfriend-settings-item" aria-labelledby="myfriend-number-heading">
        <div className="myfriend-setting-row">
            <h2 id="myfriend-number-heading" className={labelClass}>{t("MyFriend’s number", "Číslo DigiPřítele")}</h2>
          <button type="button" aria-label={t("Copy MyFriend’s number", "Zkopírovat číslo DigiPřítele")} className={valueActionClass} onClick={async () => {
            try { await navigator.clipboard.writeText(servicePhone.e164); myfriendToast(t("Number copied.", "Číslo bylo zkopírováno.")); }
            catch { myfriendToast(t("Press and hold the number to copy it.", "Číslo zkopírujete jeho podržením.")); }
          }}>{servicePhone.display}</button>
        </div>
      </section>

      <div className="myfriend-settings-card">
      <section className={rowClass} aria-labelledby="senior-heading">
        <div className="myfriend-setting-row">
            <h2 id="senior-heading" className={labelClass}>{seniorLabel}</h2>
          {numberField("senior")}
        </div>
        {numberFeedback("senior")}
      </section>

      <section className={rowClass} aria-label={t("Your account", "Váš účet")}>
        <div className="myfriend-setting-row">
          <h2 className={labelClass}>{t("Your number", "Vaše číslo")}</h2>
          {numberField("buyer")}
        </div>
        {numberFeedback("buyer")}

      </section>
      </div>

      <MyFriendPlanNumbers account={saved} onChange={setSaved} />

      <MyFriendCheckinSchedule person={person} hasPhone={Boolean(saved.senior_phone_number)} phoneLabel={seniorLabel}><MyFriendCheckins key={`${saved.buyer_phone_number}:${saved.senior_phone_number}`} relationship={saved.relationship} /></MyFriendCheckinSchedule>
    </div>
  );
}
