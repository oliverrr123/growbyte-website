import type { Locale } from "@/app/solutions/data";

const WEBOVKA_HOME_BY_LOCALE: Record<Locale, string> = {
  en: "https://webovka.online/en",
  cs: "https://webovka.online/cs",
  sk: "https://webovka.online/sk",
  ja: "https://webovka.online/en",
};

export function webovkaHomeUrl(locale: Locale): string {
  return WEBOVKA_HOME_BY_LOCALE[locale];
}
