"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { defaultCheckinSchedule } from "@/lib/myfriend-checkin-schedule";
import { czechAccountError } from "@/lib/myfriend-czech-errors";

const AccountContext = createContext({ locale: "en" as "en" | "cs", preview: false, request: fetch });

export function MyFriendAccountProvider({ locale, preview = false, forMyself = false, children }: { locale: "en" | "cs"; preview?: boolean; forMyself?: boolean; children: ReactNode }) {
  const value = useMemo(() => {
    const localPreview = preview && process.env.NODE_ENV === "development";
    let account = { buyer_phone_number: "+420700000001", senior_phone_number: forMyself ? "+420700000001" : "+420700000002", using_own_number: forMyself, email: "nahled@example.com", status: "active", current_period_end: null, senior_first_name: null, relationship: forMyself ? "myself" : "mom", stripe_customer_id: null };
    let schedule = defaultCheckinSchedule("Europe/Prague");
    let optedIn = false;
    const request: typeof fetch = async (input, init) => {
      if (!localPreview) {
        const response = await fetch(input, init);
        if (locale !== "cs" || response.ok) return response;
        const data = await response.json().catch(() => ({}));
        return Response.json({ ...data, error: czechAccountError(data.error, response.status) }, { status: response.status });
      }
      // Local UI fixture: no account, SMS, call, subscription or message is changed.
      const path = String(input);
      const body = typeof init?.body === "string" ? JSON.parse(init.body) : {};
      const json = (data: unknown, status = 200) => Promise.resolve(Response.json(data, { status }));
      if (path === "/api/myfriend/account") return json(account);
      if (path.endsWith("/schedule")) {
        if (init?.method === "POST") schedule = { ...schedule, ...body };
        return json({ schedule, saved: true });
      }
      if (path.endsWith("/message-updates")) {
        if (init?.method === "POST") optedIn = body.enabled === true;
        return json({ opted_in: optedIn, checkins_enabled: schedule.enabled, sharing_allowed: true, delivery_enabled: true, recipient_phone: account.buyer_phone_number, timezone: "Europe/Prague", provider: null, activation: null });
      }
      if (path.endsWith("/phone-verification")) return json({ phone: body.phone });
      if (path.endsWith("/senior-phone") || path.endsWith("/buyer-phone")) {
        if (body.code !== "123456") return json({ error: "Pro místní náhled použijte kód 123456." }, 400);
        account = { ...account, ...(body.senior_phone ? { senior_phone_number: body.senior_phone } : { buyer_phone_number: body.new_phone }) };
        return json(account);
      }
      return json({ error: "Tato akce není v místním náhledu dostupná." }, 400);
    };
    return { locale, preview: localPreview, request };
  }, [locale, preview, forMyself]);
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useMyFriendAccountLocale() {
  const context = useContext(AccountContext);
  const cs = context.locale === "cs";
  const t = useCallback((en: string, czech: string) => cs ? czech : en, [cs]);
  return { ...context, cs, t };
}
