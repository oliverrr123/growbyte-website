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
    pageTitle: "Case studies",
    pageDescription:
      "Discover how GrowByte builds AI solutions that help businesses grow and succeed.",
    listHeading: "SOLUTIONS",
    exploreCta: "EXPLORE \u00a0\u00a0→",
    back: "<\u00a0 Back to solutions",
    writtenByHuman: "Written by human:",
    founderCeoOf: "Founder & CEO of",
    contactFooterTitle: "Want to see more solutions?\nContact me through the links below:",
    langSwitcherLabel: "Language",
  },
  cs: {
    pageTitle: "Případové studie",
    pageDescription:
      "Jak GrowByte staví AI produkty, které reálným firmám vydělávají více peněz. Přečtěte si naše případové studie.",
    listHeading: "PŘÍPADOVÉ \u00a0STUDIE",
    exploreCta: "ZJISTIT VÍCE \u00a0\u00a0→",
    back: "<\u00a0 Zpět na případové studie",
    writtenByHuman: "Napsal člověk:",
    founderCeoOf: "zakladatel & CEO společnosti",
    contactFooterTitle: "Chcete vidět více případových studií?\nKontaktujte mě přes odkazy níže:",
    langSwitcherLabel: "Jazyk",
  },
  sk: {
    pageTitle: "Prípadové štúdie",
    pageDescription:
      "Ako GrowByte stavia AI produkty, ktoré reálnym firmám zarábajú viac peňazí. Prečítajte si naše prípadové štúdie.",
    listHeading: "PRÍPADOVÉ \u00a0ŠTÚDIE",
    exploreCta: "ZISTIŤ VIAC \u00a0\u00a0→",
    back: "<\u00a0 Späť na prípadové štúdie",
    writtenByHuman: "Napísal človek:",
    founderCeoOf: "zakladateľ & CEO spoločnosti",
    contactFooterTitle: "Chcete vidieť viac prípadových štúdií?\nKontaktujte ma cez odkazy nižšie:",
    langSwitcherLabel: "Jazyk",
  },
  de: {
    pageTitle: "Fallstudien",
    pageDescription:
      "Wie GrowByte KI-Produkte baut, die echten Unternehmen mehr Geld einbringen. Lies unsere Fallstudien.",
    listHeading: "FALLSTUDIEN",
    exploreCta: "ENTDECKEN \u00a0\u00a0→",
    back: "<\u00a0 Zurück zu den Fallstudien",
    writtenByHuman: "Verfasst von einem Menschen:",
    founderCeoOf: "Gründer & CEO von",
    contactFooterTitle: "Möchtest du mehr Fallstudien sehen?\nKontaktiere mich über die Links unten:",
    langSwitcherLabel: "Sprache",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
