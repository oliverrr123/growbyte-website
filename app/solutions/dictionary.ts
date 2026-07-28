import type { Locale } from "./data";

export type Dictionary = {
  pageTitle: string;
  pageDescription: string;
  /** First section (<h1>) — offering / solutions */
  listHeading: string;
  /** Second section (<h2>) — portfolio case studies */
  caseStudiesSectionHeading: string;
  exploreCta: string;
  back: string;
  /** Listing page: link above the first heading → site root */
  backToMainPage: string;
  writtenByHuman: string;
  founderCeoOf: string;
  contactFooterTitle: string;
  langSwitcherLabel: string;
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    pageTitle: "Solutions & case studies",
    pageDescription:
      "AI solutions and automation (chatbots, cold outreach), plus detailed case studies of real client projects.",
    listHeading: "SOLUTIONS",
    caseStudiesSectionHeading: "CASE  \u00a0STUDIES",
    exploreCta: "EXPLORE \u00a0\u00a0→",
    back: "<\u00a0 Back to solutions",
    backToMainPage: "<\u00a0 Back to main page",
    writtenByHuman: "Written by human:",
    founderCeoOf: "Founder & CEO of",
    contactFooterTitle: "Want to see more?\nContact me through the links below:",
    langSwitcherLabel: "Language",
  },
  cs: {
    pageTitle: "Řešení a případové studie",
    pageDescription:
      "AI řešení a automatizace (chatboti, cold outreach) plus případové studie z reálných projektů pro klienty.",
    listHeading: "ŘEŠENÍ",
    caseStudiesSectionHeading: "PŘÍPADOVÉ \u00a0STUDIE",
    exploreCta: "ZJISTIT VÍCE \u00a0\u00a0→",
    back: "<\u00a0 Zpět na řešení",
    backToMainPage: "<\u00a0 Zpět na hlavní stránku",
    writtenByHuman: "Napsal člověk:",
    founderCeoOf: "zakladatel & CEO společnosti",
    contactFooterTitle: "Chcete vidět více?\nKontaktujte mě přes odkazy níže:",
    langSwitcherLabel: "Jazyk",
  },
  sk: {
    pageTitle: "Riešenia a prípadové štúdie",
    pageDescription:
      "AI riešenia a automatizácia (chatboty, cold outreach) plus prípadové štúdie z reálnych klientskych projektov.",
    listHeading: "RIEŠENIA",
    caseStudiesSectionHeading: "PRÍPADOVÉ \u00a0ŠTÚDIE",
    exploreCta: "ZISTIŤ VIAC \u00a0\u00a0→",
    back: "<\u00a0 Späť na riešenia",
    backToMainPage: "<\u00a0 Späť na hlavnú stránku",
    writtenByHuman: "Napísal človek:",
    founderCeoOf: "zakladateľ & CEO spoločnosti",
    contactFooterTitle: "Chcete vidieť viac?\nKontaktujte nás cez odkazy nižšie:",
    langSwitcherLabel: "Jazyk",
  },
  ja: {
    pageTitle: "ソリューションと事例",
    pageDescription:
      "AIソリューションと自動化（チャットボット、コールドアウトリーチ）、そして実際のクライアントプロジェクトの詳細な事例。",
    listHeading: "ソリューション",
    caseStudiesSectionHeading: "事例紹介",
    exploreCta: "詳しく見る \u00a0\u00a0→",
    back: "<\u00a0 ソリューション一覧へ戻る",
    backToMainPage: "<\u00a0 トップページへ戻る",
    writtenByHuman: "人が執筆:",
    founderCeoOf: "創業者兼CEO",
    contactFooterTitle: "もっと知りたいですか？\n下のリンクからご連絡ください:",
    langSwitcherLabel: "言語",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
