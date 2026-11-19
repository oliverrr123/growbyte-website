"use client";

import { MyFriendBrand } from "@/components/myfriend-brand";
import type { ReactNode } from "react";

export function MyFriendPaymentSuccess({ locale = "en", children }: {
  locale?: "en" | "cs";
  children: ReactNode;
}) {
  const cs = locale === "cs";
  return <div className="mf-payment-success">
    <div role="img" aria-label={cs ? "DigiPřítel" : "MyFriend"} className="mf-payment-brand"><MyFriendBrand locale={locale} className="text-[34px]" /></div>
    <div className="mf-payment-celebration">
      <div className="mf-payment-check" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="m12 25 8 8 16-18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      <h1 className="mf-payment-title">{cs ? "Děkujeme!" : "Thank you!"}</h1>
      <p className="mf-payment-copy">{cs ? "Vaše platba je potvrzená." : "Your payment is confirmed."}</p>
    </div>
    <div className="mf-payment-action"><p>{cs ? "Pojďme dokončit nastavení Vašeho DigiPřítele." : "Let’s finish setting up your MyFriend."}</p>{children}</div>
  </div>;
}
