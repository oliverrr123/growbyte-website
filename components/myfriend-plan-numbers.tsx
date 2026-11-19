"use client";
import { useState } from "react";
import { useMyFriendAccountLocale } from "@/components/myfriend-account-locale";
import type { MyFriendAccount } from "@/lib/myfriend-api";
import { myfriendToast } from "@/lib/myfriend-toast";
import { formatPhoneNumber } from "@/lib/myfriend-phone-format";

const rowClass = "myfriend-settings-item";
const labelClass = "text-base text-[#292219]";
const actionClass = "min-h-11 shrink-0 text-sm text-[#827363] underline underline-offset-4 hover:text-[#292219] disabled:opacity-50";
const primaryClass = "min-h-11 shrink-0 text-sm font-medium text-[#e57900] disabled:opacity-50";
const inputClass = "min-w-0 w-full bg-transparent text-right text-base outline-none placeholder:text-[#827363] sm:text-[18px]";

const ordinals = ["Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];
const csOrdinals = ["Druhé", "Třetí", "Čtvrté", "Páté", "Šesté", "Sedmé", "Osmé", "Deváté", "Desáté"];

function money(cents: number, currency: string, cs: boolean) {
  return new Intl.NumberFormat(cs ? "cs-CZ" : "en-US", { style: "currency", currency: currency.toUpperCase(), maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
}

/** Extra numbers on multi-person plans, and the upgrade offer on single-person plans. */
export function MyFriendPlanNumbers({ account, onChange }: { account: MyFriendAccount; onChange: (account: MyFriendAccount) => void }) {
  const { cs, t, request } = useMyFriendAccountLocale();
  const seats = account.seat_limit ?? 1;
  const members = account.members ?? [];
  const freeSeats = Math.max(0, seats - 1 - members.length);
  const buyerUsed = account.senior_phone_number === account.buyer_phone_number || members.some(m => m.phone_number === account.buyer_phone_number);

  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offer, setOffer] = useState<{ amount: number; currency: string } | null>(null);

  async function post(path: string, body: unknown) {
    const response = await request(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || t("Something went wrong. Please try again.", "Něco se nepovedlo. Zkuste to prosím znovu."));
    return data;
  }
  async function run(task: () => Promise<void>) {
    setBusy(true); setError(null);
    try { await task(); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); }
  }

  const sendCode = () => run(async () => {
    const data = await post("/api/myfriend/account/phone-verification", { purpose: "member", phone });
    setPending(data.phone); setCode("");
  });
  const add = (body: Record<string, unknown>) => run(async () => {
    const data = await post("/api/myfriend/account/members", { action: "add", ...body });
    onChange(data); setPhone(""); setPending(null); setCode("");
    myfriendToast(t("Number added. It can call MyFriend now.", "Číslo bylo přidáno. Už může volat."));
  });
  const remove = (memberPhone: string) => run(async () => {
    const data = await post("/api/myfriend/account/members", { action: "remove", member_phone: memberPhone });
    onChange(data);
    myfriendToast(t("Number removed.", "Číslo bylo odebráno."));
  });
  const showOffer = () => run(async () => {
    const data = await post("/api/myfriend/account/upgrade", { preview: true });
    setOffer({ amount: data.amount, currency: data.currency });
  });
  const upgrade = () => run(async () => {
    await post("/api/myfriend/account/upgrade", {});
    // The plan row is updated by the sync; re-read until it shows the new seats.
    for (let attempt = 0; attempt < 8; attempt++) {
      const response = await request("/api/myfriend/account");
      const latest = response.ok ? await response.json() as MyFriendAccount : null;
      if (latest && (latest.seat_limit ?? 1) >= 2) { onChange(latest); setOffer(null); myfriendToast(t("Upgraded. You can add another number now.", "Hotovo. Teď můžete přidat další číslo.")); return; }
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    setOffer(null);
    throw new Error(t("Your plan was upgraded. Refresh the page in a minute to add the number.", "Tarif byl změněn. Za minutu obnovte stránku a přidejte číslo."));
  });

  const feedback = error ? <p role="alert" className="myfriend-motion-enter mt-3 text-sm text-red-700">{error}</p> : null;

  if (seats <= 1) {
    if (account.status !== "active") return null;
    return (
      <div className="myfriend-settings-card">
        <section className={rowClass} aria-labelledby="myfriend-upgrade-heading">
          <div className="myfriend-setting-row">
            <h2 id="myfriend-upgrade-heading" className={labelClass}>{t("Add another person", "Přidat další osobu")}</h2>
            {!offer && <button type="button" className={`${primaryClass} justify-self-end`} disabled={busy} onClick={showOffer}>{busy ? t("Loading…", "Načítám…") : t("Add", "Přidat")}</button>}
          </div>
          {!offer && <p className="mt-1 text-sm text-[#827363]">{t("Let a second phone number call MyFriend on the same plan, for example yourself and a loved one.", "Umožněte volat druhému telefonnímu číslu na stejný tarif, například vám i vašemu blízkému.")}</p>}
          {offer && <div className="myfriend-motion-enter mt-2 text-sm text-[#292219]">
            <p>{cs
              ? `Tarif pro 2 čísla stojí ${money(offer.amount, offer.currency, cs)} měsíčně. Poměrný rozdíl za tento měsíc se připočte k další platbě.`
              : `Your plan becomes ${money(offer.amount, offer.currency, cs)} per month for 2 numbers. The difference for the rest of this month is added to your next bill.`}</p>
            <div className="mt-2 flex justify-end gap-4">
              <button type="button" className={actionClass} disabled={busy} onClick={() => setOffer(null)}>{t("Cancel", "Zrušit")}</button>
              <button type="button" className={primaryClass} disabled={busy} onClick={upgrade}>{busy ? t("Upgrading…", "Měním tarif…") : t("Confirm upgrade", "Potvrdit")}</button>
            </div>
          </div>}
          {feedback}
        </section>
      </div>
    );
  }

  return (
    <div className="myfriend-settings-card">
      {members.map((member, index) => (
        <section key={member.phone_number} className={rowClass} aria-label={t("Number on your plan", "Číslo na vašem tarifu")}>
          <div className="myfriend-setting-row">
            <h2 className={labelClass}>
              {member.phone_number === account.buyer_phone_number ? t("You", "Vy") : member.first_name || (cs ? `${csOrdinals[index] ?? "Další"} číslo` : `${ordinals[index] ?? "Extra"} number`)}
            </h2>
            <div className="flex min-w-0 items-center justify-end gap-4">
              <span className="min-w-0 text-base sm:text-[18px]">{formatPhoneNumber(member.phone_number)}</span>
              <button type="button" className={actionClass} disabled={busy} onClick={() => remove(member.phone_number)}>{t("Remove", "Odebrat")}</button>
            </div>
          </div>
          {!member.active && <p className="mt-1 text-right text-sm text-[#827363]">{t("Not included in your current plan.", "Není součástí vašeho současného tarifu.")}</p>}
        </section>
      ))}
      {freeSeats > 0 && (
        <section className={rowClass} aria-labelledby="myfriend-add-number-heading">
          <div className="myfriend-setting-row">
            <h2 id="myfriend-add-number-heading" className={labelClass}>{cs ? `${csOrdinals[members.length] ?? "Další"} číslo` : `${ordinals[members.length] ?? "Extra"} number`}</h2>
            {pending ? <input
              autoFocus aria-label={t("Verification code", "Ověřovací kód")} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
              value={code} disabled={busy} placeholder={t("6-digit code", "Šestimístný kód")} className={inputClass}
              onChange={event => { const next = event.target.value.replace(/\D/g, ""); setCode(next); if (next.length === 6) void add({ member_phone: pending, code: next }); }}
            /> : <div className="flex min-w-0 items-center justify-end gap-3">
              <input aria-label={t("Phone number to add", "Telefonní číslo k přidání")} type="tel" inputMode="tel" autoComplete="off" value={phone} disabled={busy}
                placeholder={t("Not added yet", "Zatím nepřidáno")} className={inputClass}
                onChange={event => setPhone(event.target.value)}
                onKeyDown={event => { if (event.key === "Enter" && phone.trim()) { event.preventDefault(); void sendCode(); } }} />
              {phone.trim() && <button type="button" className={primaryClass} disabled={busy} onClick={sendCode}>{t("Done", "Hotovo")}</button>}
            </div>}
          </div>
          {busy && <p role="status" className="mt-2 text-right text-sm text-[#827363]">{pending ? t("Verifying…", "Ověřuji…") : t("Working…", "Pracuji…")}</p>}
          {pending && <div className="myfriend-motion-enter mt-2 text-right text-sm text-[#827363]">
            <p>{cs ? `Zadejte kód odeslaný na ${formatPhoneNumber(pending)}.` : `Enter the code sent to ${formatPhoneNumber(pending)}. If it's someone else's phone, ask them to read it to you.`}</p>
            <div className="mt-1 flex justify-end gap-4">
              <button type="button" className={actionClass} disabled={busy} onClick={sendCode}>{t("Resend code", "Poslat kód znovu")}</button>
              <button type="button" className={actionClass} disabled={busy} onClick={() => { setPending(null); setCode(""); setError(null); }}>{t("Cancel", "Zrušit")}</button>
            </div>
          </div>}
          {!pending && !buyerUsed && <div className="mt-1 flex justify-end">
            <button type="button" className={actionClass} disabled={busy} onClick={() => add({ for_myself: true })}>{t("Use my own number", "Použít moje číslo")}</button>
          </div>}
          {feedback}
        </section>
      )}
      {freeSeats === 0 && feedback && <section className={rowClass}>{feedback}</section>}
    </div>
  );
}
