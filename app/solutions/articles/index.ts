import type { ComponentType } from "react";
import type { CaseStudyId, Locale } from "../data";
import { ChatbotArticleEn, AutomailerArticleEn } from "./en";
import { ChatbotArticleCs, AutomailerArticleCs } from "./cs";
import { ChatbotArticleSk, AutomailerArticleSk } from "./sk";
import { ChatbotArticleDe, AutomailerArticleDe } from "./de";

export const ARTICLES: Record<Locale, Record<CaseStudyId, ComponentType>> = {
  en: {
    chatbot: ChatbotArticleEn,
    automailer: AutomailerArticleEn,
  },
  cs: {
    chatbot: ChatbotArticleCs,
    automailer: AutomailerArticleCs,
  },
  sk: {
    chatbot: ChatbotArticleSk,
    automailer: AutomailerArticleSk,
  },
  de: {
    chatbot: ChatbotArticleDe,
    automailer: AutomailerArticleDe,
  },
};

export function getArticleComponent(locale: Locale, id: CaseStudyId): ComponentType | undefined {
  return ARTICLES[locale]?.[id];
}
