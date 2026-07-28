import type { Locale } from "@/app/solutions/data";
import { LOCALES } from "@/app/solutions/data";

/**
 * Human-facing path per GrowByte site locale.
 * Dedicated product domains rewrite/redirect these (digipritel.cz, trymyfriend.com, myfriend.jp).
 */
export const ELDER_COMPANION_PATH: Record<Locale, string> = {
  en: "/myfriend",
  cs: "/digipritel",
  sk: "/digipriatel",
  // Internal app route; myfriend.jp serves this as `/` (and growbyte redirects here → jp).
  ja: "/myfriend-jp",
};

export function elderCompanionPath(locale: Locale): string {
  return ELDER_COMPANION_PATH[locale];
}

export function elderCompanionLanguageAlternateUrls(siteUrl: string): Record<string, string> {
  return LOCALES.reduce<Record<string, string>>((acc, l) => {
    acc[l] = `${siteUrl}${ELDER_COMPANION_PATH[l]}`;
    return acc;
  }, {});
}
