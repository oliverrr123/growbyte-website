import Link from "next/link";
import type { ReactNode } from "react";

export function MyFriendLegalPage({ title, children, locale = "en" }: { title: string; children: ReactNode; locale?: "en" | "cs" }) {
  const cs = locale === "cs";
  const home = cs ? "/digipritel" : "/myfriend";
  return (
    <div className="min-h-screen bg-white px-6 py-12 text-[#302b24] sm:py-20">
      <div className="mx-auto max-w-[720px]">
        <Link href={home} aria-label={cs ? "DigiPřítel – úvodní stránka" : "MyFriend home"} className="caveat-bold-font text-[44px] no-underline">
          <span className="text-black">{cs ? "digi" : "my"}</span><span className="text-[#ff8804]">{cs ? "přítel" : "friend"}</span>
        </Link>
        <h1 className="mb-3 mt-12 text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
        <p className="mb-10 text-sm text-black/50">{cs ? "Poslední aktualizace: 21. září 2026" : "Last updated September 21, 2026"}</p>
        <article className="space-y-8 text-[17px] leading-relaxed [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-medium [&_p]:my-3 [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </article>
        <nav aria-label={cs ? "Právní informace a kontakt" : "Legal and contact"} className="mt-14 flex flex-wrap gap-6 border-t border-black/10 pt-6 text-sm text-black/60 [&_a]:underline [&_a]:underline-offset-4">
          <Link href={home}>{cs ? "Zpět na DigiPřítele" : "Back to MyFriend"}</Link>
          <Link href={cs ? "/digipritel/soukromi" : "/myfriend/privacy"}>{cs ? "Soukromí" : "Privacy"}</Link>
          <Link href={cs ? "/digipritel/podminky" : "/myfriend/terms"}>{cs ? "Podmínky" : "Terms"}</Link>
          <Link href={`${home}#contact`}>{cs ? "Kontakt" : "Contact"}</Link>
        </nav>
      </div>
    </div>
  );
}
