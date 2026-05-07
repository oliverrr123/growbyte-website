import type { Locale } from "@/app/solutions/data";
import { LOCALES } from "@/app/solutions/data";

/**
 * Human-facing slug per locale (`/digipritel` CS, `/digipriatel` SK,
 * `/myfriend` EN, `/digifreund` DE).
 */
export const ELDER_COMPANION_PATH: Record<Locale, string> = {
  en: "/myfriend",
  cs: "/digipritel",
  sk: "/digipriatel",
  de: "/digifreund",
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
