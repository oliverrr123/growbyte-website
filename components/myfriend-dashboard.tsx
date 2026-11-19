"use client";
import { useMyFriendAccountLocale, MyFriendAccountProvider } from "@/components/myfriend-account-locale";

import { useEffect, useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { Settings } from "lucide-react";
import { MyFriendBrand } from "@/components/myfriend-brand";
import { MyFriendDashboardForm } from "@/components/myfriend-dashboard-form";
import type { MyFriendAccount } from "@/lib/myfriend-api";
import { clientMyFriendAppPath } from "@/lib/myfriend";

function DashboardLoading() {
  const { t } = useMyFriendAccountLocale();
  return <div role="status" aria-label={t("Loading your dashboard", "Načítání vašeho účtu")} className="space-y-6">
    <span className="sr-only">{t("Loading your dashboard…", "Načítání vašeho účtu…")}</span>
    <div aria-hidden="true" className="myfriend-settings-card myfriend-settings-item">
      <div className="myfriend-setting-row"><span className="myfriend-loading-line w-32 max-w-full" /><span className="myfriend-loading-line w-40 max-w-full justify-self-end" /></div>
    </div>
    <div aria-hidden="true" className="myfriend-settings-card">
      {[0, 1].map(row => <div key={row} className="myfriend-settings-item"><div className="myfriend-setting-row"><span className={`myfriend-loading-line max-w-full ${row ? "w-24" : "w-32"}`} /><span className="myfriend-loading-line w-36 max-w-full justify-self-end" /></div></div>)}
    </div>
    <div aria-hidden="true" className="myfriend-settings-card myfriend-settings-item flex items-center justify-between gap-5">
      <span className="myfriend-loading-line w-40 max-w-full" /><span className="myfriend-loading-line !h-[31px] w-[51px] shrink-0 !rounded-full" />
    </div>
  </div>;
}

export function MyFriendDashboard({ locale = "en", preview = false, forMyself = false }: { locale?: "en" | "cs"; preview?: boolean; forMyself?: boolean }) {
  return <MyFriendAccountProvider locale={locale} preview={preview} forMyself={forMyself}><DashboardContent /></MyFriendAccountProvider>;
}

function DashboardContent() {
  const { cs, t, request, locale, preview } = useMyFriendAccountLocale();
  const [account, setAccount] = useState<MyFriendAccount | null>(null);
  const [error, setError] = useState("");
  const [action, setAction] = useState<"billing" | "logout" | null>(null);
  useEffect(() => {
    let cancelled = false;
    request("/api/myfriend/account").then(async (response) => {
      if (response.status === 401) { window.location.href = (cs ? "/digipritel/login" : clientMyFriendAppPath("/login")); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("Couldn't load your account.", "Účet se nepodařilo načíst."));
      if (!cancelled) setAccount(data);
    }).catch(error => { if (!cancelled) setError(error.message); });
    return () => { cancelled = true; };
  }, [cs, request, t]);

  async function accountAction(nextAction: "billing" | "logout") {
    if (preview) {
      if (nextAction === "logout") { window.location.href = "/start"; return; }
      setError("Správa předplatného je dostupná po skutečné aktivaci účtu."); return;
    }
    setAction(nextAction); setError("");
    try {
      const response = await request(nextAction === "billing" ? "/api/myfriend/account/billing" : "/api/myfriend/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || (nextAction === "billing" ? t("Couldn't open your subscription.", "Předplatné se nepodařilo otevřít.") : t("Couldn't log out. Please try again.", "Odhlášení se nepodařilo. Zkuste to znovu.")));
      window.location.href = nextAction === "billing" ? data.url : (cs ? "/digipritel/login" : clientMyFriendAppPath("/login"));
    } catch (error) {
      setError(error instanceof Error ? error.message : t("Please try again.", "Zkuste to prosím znovu."));
      setAction(null);
    }
  }

  return (
    <main className="myfriend-dashboard min-h-dvh bg-[#f2f2f7] px-5 pb-12 pt-7 text-[#292219] sm:px-8 sm:pt-9">
      <header className="mx-auto grid max-w-[520px] grid-cols-[44px_1fr_44px] items-center">
        <span aria-hidden="true" />
        <a className="justify-self-center" href={cs ? "/digipritel" : clientMyFriendAppPath("/")} aria-label={t("MyFriend home", "DigiPřítel – úvodní stránka")}><MyFriendBrand locale={locale} className="text-[42px] sm:text-[48px]" /></a>
        <Menu.Root>
          <Menu.Trigger aria-label={t("Settings", "Nastavení")} disabled={action !== null} className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[#71717a] transition-colors hover:bg-[#e5e5ea] hover:text-[#27272a] focus-visible:outline-2 focus-visible:outline-[#a1a1aa] disabled:opacity-50">
            <Settings size={21} strokeWidth={1.6} />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end" sideOffset={8} className="z-50">
              <Menu.Popup className="myfriend-settings-menu min-w-[210px] rounded-2xl border border-[#e5e5ea] bg-white p-1.5 text-[#27272a] shadow-[0_8px_30px_rgba(0,0,0,0.09)] outline-none">
                <Menu.Item disabled={!account || action !== null} onClick={() => accountAction("billing")} className="flex min-h-11 cursor-pointer items-center rounded-xl px-3 text-sm outline-none data-[highlighted]:bg-[#e5e5ea] data-[disabled]:opacity-40">{t("Manage subscription", "Spravovat předplatné")}</Menu.Item>
                <Menu.Item disabled={action !== null} onClick={() => accountAction("logout")} className="flex min-h-11 cursor-pointer items-center rounded-xl px-3 text-sm outline-none data-[highlighted]:bg-[#e5e5ea] data-[disabled]:opacity-40">{t("Log out", "Odhlásit se")}</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </header>
      <div className="mx-auto max-w-[520px] pt-12 sm:pt-16">
        {action && <p role="status" className="mb-5 text-sm text-[#827363]">{action === "billing" ? t("Opening Stripe…", "Otevírám Stripe…") : t("Logging out…", "Odhlašuji…")}</p>}
        {error && <p role="alert" className="mb-5 text-sm text-red-700">{error}</p>}
        {account ? <MyFriendDashboardForm account={account} /> : !error && <DashboardLoading />}
        <p className="mt-10 text-sm leading-6 text-[#827363]">
          {t("Need help?", "Potřebujete pomoc?")}{" "}
          <a href="tel:+14153771909" className="underline underline-offset-4 hover:text-[#292219]">{t("Call", "Zavolejte")}</a>
          {t(" or ", " nebo ")}
          <a href="mailto:oliver.cingl@gmail.com" className="underline underline-offset-4 hover:text-[#292219]">{t("message", "napište")}</a>
          {t(" the founder", " zakladateli")}
        </p>
      </div>
    </main>
  );
}
