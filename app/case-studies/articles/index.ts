import type { ComponentType } from "react";
import type { CaseStudyId, Locale } from "../data";
import { CvSearchEngineArticleEn, MarketingAnalyzerArticleEn } from "./en";
import { CvSearchEngineArticleCs, MarketingAnalyzerArticleCs } from "./cs";
import { CvSearchEngineArticleSk, MarketingAnalyzerArticleSk } from "./sk";
import { CvSearchEngineArticleDe, MarketingAnalyzerArticleDe } from "./de";

export const ARTICLES: Record<Locale, Record<CaseStudyId, ComponentType>> = {
  en: {
    "cv-search-engine": CvSearchEngineArticleEn,
    "marketing-analyzer": MarketingAnalyzerArticleEn,
  },
  cs: {
    "cv-search-engine": CvSearchEngineArticleCs,
    "marketing-analyzer": MarketingAnalyzerArticleCs,
  },
  sk: {
    "cv-search-engine": CvSearchEngineArticleSk,
    "marketing-analyzer": MarketingAnalyzerArticleSk,
  },
  de: {
    "cv-search-engine": CvSearchEngineArticleDe,
    "marketing-analyzer": MarketingAnalyzerArticleDe,
  },
};

export function getArticleComponent(locale: Locale, id: CaseStudyId): ComponentType | undefined {
  return ARTICLES[locale]?.[id];
}
