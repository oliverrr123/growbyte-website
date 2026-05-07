import { LanguageSwitcherNavClient } from "@/components/language-switcher-nav-client";

import type { Locale } from "../data";
import { getDictionary } from "../dictionary";

/**
 * Inline language switcher (client). Internal links can receive `utm_source=max`
 * when the Slovak campaign cookie is active — see `SkMaxCampaignProvider`.
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
