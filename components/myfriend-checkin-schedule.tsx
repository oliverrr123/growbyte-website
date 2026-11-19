"use client";
import { useMyFriendAccountLocale } from "@/components/myfriend-account-locale";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MyFriendReveal } from "@/components/myfriend-reveal";
import { myfriendToast } from "@/lib/myfriend-toast";
import { defaultCheckinSchedule, type CheckinSchedule } from "@/lib/myfriend-checkin-schedule";

export function MyFriendCheckinSchedule({ person, children, hasPhone, phoneLabel }: { person: string; children?: ReactNode; hasPhone: boolean; phoneLabel: string }) {
  const { cs, t, request } = useMyFriendAccountLocale();
  const [saved, setSaved] = useState<CheckinSchedule | null>(null);
  const [error, setError] = useState("");
  const toggleRevision = useRef(0);
  const toggleQueue = useRef(Promise.resolve());
  const initialLoad = useRef<Promise<void> | null>(null);
  const confirmed = useRef<CheckinSchedule | null>(null);
  const load = useCallback(async () => {
    setError("");
    try {
      const response = await request("/api/myfriend/account/schedule");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("Couldn't load your schedule.", "Nastavení hovorů se nepodařilo načíst."));
      const schedule = data.schedule as CheckinSchedule;
      if (!data.saved) schedule.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || schedule.timezone;
      confirmed.current = schedule;
      if (!toggleRevision.current) {
        setSaved(schedule);
      } else {
        setSaved(current => ({...schedule, enabled: current?.enabled ?? false}));
      }
    } catch(error) { setError(error instanceof Error ? error.message : t("Couldn't load your schedule.", "Nastavení hovorů se nepodařilo načíst.")); }
  }, [request, t]);
  useEffect(() => { initialLoad.current ??= load(); }, [load]);
  function toggle(enabled: boolean) {
    if (!hasPhone) { myfriendToast((cs ? `Nejdřív přidejte číslo (${phoneLabel}).` : `First add ${phoneLabel}.`)); return; }
    const revision = ++toggleRevision.current;
    const next = {...(saved ?? defaultCheckinSchedule()), enabled};
    setSaved(next); setError("");
    // Serialize writes; superseded responses must never reset the latest UI choice.
    toggleQueue.current = toggleQueue.current.then(async () => {
      await initialLoad.current;
      if (revision !== toggleRevision.current) return;
      try {
        if (!confirmed.current) throw new Error(t("Couldn't load your schedule. Please try again.", "Nastavení hovorů se nepodařilo načíst. Zkuste to znovu."));
        const schedule = {...confirmed.current, enabled};
        const response = await request("/api/myfriend/account/schedule", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...schedule,digest_timezone:Intl.DateTimeFormat().resolvedOptions().timeZone})});
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || t("Couldn't save your schedule.", "Nastavení hovorů se nepodařilo uložit."));
        confirmed.current = data.schedule;
        if (revision === toggleRevision.current) {
          setSaved(data.schedule);
          if (data.message_error) myfriendToast((cs ? "Hovory jsou uložené. Nastavení zpráv se nepodařilo dokončit." : `Check-ins saved. ${data.message_error}`));
        }
      } catch (error) {
        if (revision !== toggleRevision.current) return;
        setSaved(confirmed.current);
        myfriendToast(error instanceof Error ? error.message : t("Couldn't save your schedule.", "Nastavení hovorů se nepodařilo uložit."));
      }
    });
  }
  const recipient = person.replace(/^Your /, "your ");
  return <section className="myfriend-settings-card" aria-labelledby="schedule-heading">
    {!hasPhone ? <button type="button" aria-disabled="true" onClick={() => myfriendToast((cs ? `Nejdřív přidejte číslo (${phoneLabel}).` : `First add ${phoneLabel}.`))} className="myfriend-settings-item flex w-full cursor-pointer items-center justify-between gap-5 text-left text-[#a1a1aa] focus-visible:outline-2 focus-visible:outline-[#ff8804]">
      <span id="schedule-heading" className="text-base">{t("Daily check-in calls", "Pravidelné hovory")}</span>
      <span aria-hidden="true" className="myfriend-settings-switch opacity-40" />
    </button> : <label className="myfriend-settings-item flex cursor-pointer items-center justify-between gap-5">
      <span id="schedule-heading" className="text-base">{t("Daily check-in calls", "Pravidelné hovory")}</span>
      <input type="checkbox" className="myfriend-settings-switch" aria-labelledby="schedule-heading" aria-controls="checkin-details" checked={Boolean(saved?.enabled)} onChange={e=>void toggle(e.target.checked)} />
    </label>}
    <MyFriendReveal open={Boolean(hasPhone && saved?.enabled)}>{saved && <div id="checkin-details" className="myfriend-settings-details">
    <p className="text-sm leading-6 text-[#827363]">{cs ? "DigiPřítel se během hovoru domluví na časech, které vašemu blízkému vyhovují." : <>MyFriend will ask {recipient} for their preferred call times.</>}</p>
    {children}
    </div>}</MyFriendReveal>
    {error && <div className="px-5 pb-5 text-sm"><p role="alert" className="text-red-700">{error}</p>{!saved&&<button className="mt-2 underline" onClick={load}>{t("Try again", "Zkusit znovu")}</button>}</div>}
  </section>;
}
