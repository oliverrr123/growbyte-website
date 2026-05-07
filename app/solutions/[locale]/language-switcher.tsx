import { LanguageSwitcherNavClient } from "@/components/language-switcher-nav-client";

import type { Locale } from "../data";
import { getDictionary } from "../dictionary";

/**
 * Inline language switcher. Renders one link per locale that points at the
 * equivalent page (list or article) in that language. Includes hrefLang on
 * each link so crawlers and assistive tech understand the alternates.
 *
 * Slovak `utm_source=max` is appended via client context (`SkMaxCampaignProvider`).
 */
export function LanguageSwitcher({
  currentLocale,
  alternates,
}: {
  currentLocale: Locale;
  alternates: Partial<Record<Locale, string>>;
}) {
  const dict = getDictionary(currentLocale);
  return <LanguageSwitcherNavClient ariaLabel={dict.langSwitcherLabel} currentLocale={currentLocale} alternates={alternates} />;
}
