"use client";

import { Fragment } from "react";

import type { Locale } from "@/app/solutions/data";
import { LOCALES } from "@/app/solutions/data";
import { SkMaxLink } from "@/components/sk-max-link";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  cs: "CS",
  sk: "SK",
  ja: "JA",
};

/**
 * Inline language switcher — client side only so internal `href`s can inherit `utm_source=max`
 * after the Slovak campaign cookie is set.
 */
export function LanguageSwitcherNavClient({
  currentLocale,
  alternates,
  ariaLabel,
}: {
  currentLocale: Locale;
  alternates: Partial<Record<Locale, string>>;
  ariaLabel: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="flex items-center gap-2 text-sm">
      {LOCALES.map((locale, i) => {
        const label = LOCALE_LABELS[locale];
        const isCurrent = locale === currentLocale;
        const href = alternates[locale];

        return (
          <Fragment key={locale}>
            {i > 0 && (
              <span aria-hidden="true" className="text-foreground/30">
                ·
              </span>
            )}
            {isCurrent ? (
              <span aria-current="true" className="text-foreground">
                {label}
              </span>
            ) : href ? (
              <SkMaxLink
                href={href}
                hrefLang={locale}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {label}
              </SkMaxLink>
            ) : (
              <span className="text-foreground/30" aria-disabled="true">
                {label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
