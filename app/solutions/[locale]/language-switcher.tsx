import { Fragment } from "react";
import Link from "next/link";
import { LOCALES, type Locale } from "../data";
import { getDictionary } from "../dictionary";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  cs: "CS",
  sk: "SK",
  de: "DE",
};

/**
 * Inline language switcher. Renders one link per locale that points at the
 * equivalent page (list or article) in that language. Includes hrefLang on
 * each link so crawlers and assistive tech understand the alternates.
 */
export function LanguageSwitcher({
  currentLocale,
  alternates,
}: {
  currentLocale: Locale;
  alternates: Partial<Record<Locale, string>>;
}) {
  const dict = getDictionary(currentLocale);

  return (
    <nav aria-label={dict.langSwitcherLabel} className="flex items-center gap-2 text-sm">
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
              <Link
                href={href}
                hrefLang={locale}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {label}
              </Link>
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
