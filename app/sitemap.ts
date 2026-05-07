import type { MetadataRoute } from "next";
import {
  CASE_STUDIES as PORTFOLIO_CASE_STUDIES,
  getAllLocaleSlugsForId as getPortfolioSlugsForId,
  LOCALES,
} from "./case-studies/data";
import {
  CASE_STUDIES as SOLUTIONS,
  getAllLocaleSlugsForId as getSolutionSlugsForId,
} from "./solutions/data";
import { SITE_URL } from "./case-studies/site";
import { ELDER_COMPANION_PATH, elderCompanionLanguageAlternateUrls } from "@/lib/elder-companion-paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const solutionsListAlternates = LOCALES.reduce<Record<string, string>>((acc, l) => {
    acc[l] = `${SITE_URL}/solutions/${l}`;
    return acc;
  }, {});

  const solutionsListEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/solutions/${locale}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
    alternates: { languages: solutionsListAlternates },
  }));

  const solutionsDetailEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    SOLUTIONS[locale].map((item) => {
      const slugsByLocale = getSolutionSlugsForId(item.id);
      const alternates = LOCALES.reduce<Record<string, string>>((acc, l) => {
        if (slugsByLocale[l]) {
          acc[l] = `${SITE_URL}/solutions/${l}/${slugsByLocale[l]}`;
        }
        return acc;
      }, {});

      return {
        url: `${SITE_URL}/solutions/${locale}/${item.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates },
      };
    }),
  );

  const portfolioDetailEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    PORTFOLIO_CASE_STUDIES[locale].map((item) => {
      const slugsByLocale = getPortfolioSlugsForId(item.id);
      const alternates = LOCALES.reduce<Record<string, string>>((acc, l) => {
        if (slugsByLocale[l]) {
          acc[l] = `${SITE_URL}/case-studies/${l}/${slugsByLocale[l]}`;
        }
        return acc;
      }, {});

      return {
        url: `${SITE_URL}/case-studies/${locale}/${item.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates },
      };
    }),
  );

  const homeAlternates = LOCALES.reduce<Record<string, string>>((acc, l) => {
    acc[l] = `${SITE_URL}/${l}`;
    return acc;
  }, {});

  const homeEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages: homeAlternates },
  }));

  const elderCompanionAlternates = elderCompanionLanguageAlternateUrls(SITE_URL);

  const elderCompanionEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}${ELDER_COMPANION_PATH[locale]}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.72,
    alternates: { languages: elderCompanionAlternates },
  }));

  return [
    ...homeEntries,
    ...elderCompanionEntries,
    ...solutionsListEntries,
    ...solutionsDetailEntries,
    ...portfolioDetailEntries,
  ];
}
