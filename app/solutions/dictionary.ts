import type { Locale } from "./data";

export type Dictionary = {
  pageTitle: string;
  pageDescription: string;
  listHeading: string;
  exploreCta: string;
  back: string;
  writtenByHuman: string;
  founderCeoOf: string;
  contactFooterTitle: string;
  langSwitcherLabel: string;
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    pageTitle: "Solutions",
    pageDescription:
      "AI-powered automation and tools that help your business save time and grow — chatbots, cold outreach, and custom builds.",
    listHeading: "SOLUTIONS",
    exploreCta: "EXPLORE \u00a0\u00a0→",
    back: "<\u00a0 Back to solutions",
    writtenByHuman: "Written by human:",
    founderCeoOf: "Founder & CEO of",
    contactFooterTitle: "Want to see more solutions?\nContact me through the links below:",
    langSwitcherLabel: "Language",
  },
  cs: {
    pageTitle: "Řešení",
    pageDescription:
      "AI automatizace a nástroje, které firmám šetří čas a přinášejí výsledky — chatboti, cold outreach a řešení na míru.",
    listHeading: "ŘEŠENÍ",
    exploreCta: "ZJISTIT VÍCE \u00a0\u00a0→",
    back: "<\u00a0 Zpět na řešení",
    writtenByHuman: "Napsal člověk:",
    founderCeoOf: "zakladatel & CEO společnosti",
    contactFooterTitle: "Chcete vidět další řešení?\nKontaktujte mě přes odkazy níže:",
    langSwitcherLabel: "Jazyk",
  },
  sk: {
    pageTitle: "Riešenia",
    pageDescription:
      "AI automatizácie a nástroje, ktoré firmám šetria čas a prinášajú výsledky — chatboty, cold outreach a riešenia na mieru.",
    listHeading: "RIEŠENIA",
    exploreCta: "ZISTIŤ VIAC \u00a0\u00a0→",
    back: "<\u00a0 Späť na riešenia",
    writtenByHuman: "Napísal človek:",
    founderCeoOf: "zakladateľ & CEO spoločnosti",
    contactFooterTitle: "Chcete vidieť ďalšie riešenia?\nKontaktujte ma cez odkazy nižšie:",
    langSwitcherLabel: "Jazyk",
  },
  de: {
    pageTitle: "Lösungen",
    pageDescription:
      "KI-Automatisierung und Tools, die Unternehmen Zeit sparen und Wachstum bringen — Chatbots, Cold Outreach und Custom Builds.",
    listHeading: "LÖSUNGEN",
    exploreCta: "ENTDECKEN \u00a0\u00a0→",
    back: "<\u00a0 Zurück zu den Lösungen",
    writtenByHuman: "Verfasst von einem Menschen:",
    founderCeoOf: "Gründer & CEO von",
    contactFooterTitle: "Willst du mehr Lösungen sehen?\nKontaktiere mich über die Links unten:",
    langSwitcherLabel: "Sprache",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
