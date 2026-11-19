"use client";
import { useMyFriendAccountLocale } from "@/components/myfriend-account-locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from "@/lib/myfriend-phone-format";

type MessageSettings = {
  opted_in: boolean;
  checkins_enabled: boolean;
  sharing_allowed: boolean;
  delivery_enabled: boolean;
  recipient_phone: string;
  timezone: string | null;
  provider: string | null;
  activation: { status: "activated" | "activation_required" | "not_registered" | "unavailable"; assigned_phone: string | null; activation_url: string | null } | null;
};
export function MyFriendCheckins({ relationship }: { relationship?: string | null }) {
  const { cs, t, request } = useMyFriendAccountLocale();
  const labels: Record<string, string> = { mom: "mom", dad: "dad", grandmother: "grandma", grandfather: "grandpa", partner: "partner" };
  const person = labels[relationship ?? ""] ?? "loved one";
  const [settings, setSettings] = useState<MessageSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    request("/api/myfriend/account/message-updates", { signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("Couldn't load message settings.", "Nastavení zpráv se nepodařilo načíst."));
      if (!controller.signal.aborted) setSettings(data);
    }).catch(error => { if (!controller.signal.aborted) setError(error.message); });
    return () => controller.abort();
  }, [request, t]);
  async function update(enabled?: boolean) {
    setBusy(true); setError("");
    try {
      const response = await request("/api/myfriend/account/message-updates", enabled === undefined ? {} : {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, recipient_consent: enabled,
          digest_timezone: settings?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("Couldn't save message settings.", "Nastavení zpráv se nepodařilo uložit."));
      setSettings(data);
    } catch (error) { setError(error instanceof Error ? error.message : t("Couldn't save message settings.", "Nastavení zpráv se nepodařilo uložit.")); }
    finally { setBusy(false); }
  }
  const activation = settings?.activation;
  const pendingActivation = settings?.opted_in && activation?.status === "activation_required";
  return <fieldset className="border-t border-[#e4e4e7] pt-5">
    <legend className="sr-only">{t("Daily family messages", "Denní zprávy pro rodinu")}</legend>
    <p className="text-sm leading-6 text-[#827363]">{cs ? <>Každý den ve 20:00{settings?.timezone ? ` (${settings.timezone.replaceAll("_", " ")})` : " ve vašem časovém pásmu"} dostanete shrnutí povídání a připomínek, pokud s tím váš blízký souhlasí. Pokud nezvedne žádný hovor, zpráva vám doporučí se ozvat.</> : <>Get an update about your {person}’s chats and reminders at 8 pm{settings?.timezone ? ` (${settings.timezone.replaceAll("_", " ")})` : " in your timezone"}, when they agree to share. If they miss every call, the update will suggest checking in.</>}</p>
    <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#29251e]">
      <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#ff8804]" checked={settings?.opted_in ?? false} disabled={!settings || busy} onChange={event => void update(event.target.checked)} />
      <span>{cs ? <>Chci dostávat textové zprávy od DigiPřítele{settings?.recipient_phone ? ` na ${formatPhoneNumber(settings.recipient_phone)}` : " na své číslo"}: nejvýše 1 shrnutí denně o hovorech a připomínkách. Mohou být účtovány poplatky operátora. Odhlásíte se odpovědí STOP, nápovědu získáte odpovědí HELP. <Link href="/myfriend/privacy" target="_blank" className="underline">Zásady ochrany osobních údajů</Link></> : <>I want MyFriend text messages{settings?.recipient_phone ? ` at ${formatPhoneNumber(settings.recipient_phone)}` : " at my number"}: up to 1 update a day about calls and reminders. Msg &amp; data rates may apply. Reply STOP to opt out or HELP for help. <Link href="/myfriend/privacy" target="_blank" className="underline">Privacy Policy</Link></>}</span>
    </label>
    {!settings && !error && <p role="status" className="mt-3 text-sm text-[#827363]">{t("Checking message settings…", "Načítání nastavení zpráv…")}</p>}
    {settings?.opted_in && <div role="status" className="mt-4 rounded-2xl bg-[#f2f2f8] p-4 text-sm leading-6 text-[#514a40]">
      {pendingActivation ? <>
        <p className="font-medium">{t("One more step: activate your number", "Ještě jeden krok: aktivujte své číslo")}</p>
        <p>{cs ? <>Z čísla {formatPhoneNumber(settings.recipient_phone)} pošlete START na {activation?.assigned_phone}. Tím umožníte DigiPříteli odpovídat. Denní zprávy vám začnou chodit po aktivaci.</> : <>From {formatPhoneNumber(settings.recipient_phone)}, send START to {activation?.assigned_phone}. This lets MyFriend reply to you. Daily updates cannot reach you until messaging is activated.</>}</p>
        {activation?.activation_url && <a className="mt-3 inline-block rounded-full bg-[#ff8804] px-4 py-2 font-medium text-white" href={activation.activation_url}>{t("Open Messages to activate", "Otevřít zprávy a aktivovat")}</a>}
        <p className="mt-2 text-xs">{t("Opening Messages prepares the text; you send it yourself.", "Otevřením zpráv se připraví text. Odešlete ho sami.")}</p>
      </> : activation && activation.status !== "activated" ? <p>{t("We haven’t confirmed messaging activation. Your permission is saved, but delivery is not ready yet. Try checking again or contact the founder for help.", "Aktivace zpráv zatím není potvrzená. Váš souhlas je uložený, ale doručování ještě není připravené. Zkuste stav zkontrolovat znovu nebo kontaktujte zakladatele.")}</p>
        : !settings.delivery_enabled ? <p>{t("Your permission is saved. Message delivery is temporarily unavailable.", "Váš souhlas je uložený. Doručování zpráv je dočasně nedostupné.")}</p>
        : !settings.checkins_enabled ? <p>{t("Daily check-ins are paused. Turn them on to resume daily updates.", "Pravidelné hovory jsou pozastavené. Zapněte je pro obnovení denních zpráv.")}</p>
        : !settings.timezone ? <p>{t("Confirm your timezone by turning daily messages off and on again.", "Potvrďte časové pásmo vypnutím a opětovným zapnutím denních zpráv.")}</p>
        : !settings.sharing_allowed ? <p>{cs ? "Váš souhlas je uložený. DigiPřítel ještě potřebuje souhlas vašeho blízkého se sdílením zpráv." : <>Your permission is saved. MyFriend still needs your {person}’s permission to share updates.</>}</p>
        : <p>{t("Daily messages are enabled for 8 pm.", "Denní zprávy jsou zapnuté na 20:00.")}{activation?.status === "activated" ? t(" Your number is activated for messaging.", " Vaše číslo je aktivované pro zprávy.") : ""}</p>}
      <button type="button" disabled={busy} onClick={() => void update()} className="mt-3 underline underline-offset-4 disabled:opacity-50">{busy ? t("Checking…", "Kontroluji…") : t("Check activation", "Zkontrolovat aktivaci")}</button>
    </div>}
    {error && <div className="mt-3 text-sm"><p role="alert" className="text-red-700">{error}</p><button type="button" disabled={busy} className="mt-2 underline" onClick={() => void update()}>{t("Try again", "Zkusit znovu")}</button></div>}
    <p className="mt-4 text-xs text-[#a1a1aa]">{t("WhatsApp and Telegram updates are coming soon.", "Zprávy přes WhatsApp a Telegram připravujeme.")}</p>
  </fieldset>;
}
