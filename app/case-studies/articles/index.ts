import type { ComponentType } from "react";
import type { CaseStudyId, Locale } from "../data";
import { CvSearchEngineArticleEn, MarketingAnalyzerArticleEn } from "./en";
import { CvSearchEngineArticleCs, MarketingAnalyzerArticleCs } from "./cs";
import { CvSearchEngineArticleSk, MarketingAnalyzerArticleSk } from "./sk";
import { CvSearchEngineArticleJa, MarketingAnalyzerArticleJa } from "./ja";

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
  ja: {
    "cv-search-engine": CvSearchEngineArticleJa,
    "marketing-analyzer": MarketingAnalyzerArticleJa,
  },
};

export function getArticleComponent(locale: Locale, id: CaseStudyId): ComponentType | undefined {
  return ARTICLES[locale]?.[id];
}
