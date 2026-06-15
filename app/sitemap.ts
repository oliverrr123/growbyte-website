import type { MetadataRoute } from "next";
import { headers } from "next/headers";
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
import {
  ELDER_COMPANION_ALTERNATES,
  ELDER_COMPANION_CANONICALS,
  ELDER_COMPANION_MORE_ALTERNATES,
  ELDER_COMPANION_MORE_CANONICALS,
  isDigipritelHost,
  isTryMyFriendHost,
  requestHostFromHeaders,
} from "@/lib/elder-companion-seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const headerList = await headers();
  const host = requestHostFromHeaders(headerList);

  if (isDigipritelHost(host)) {
    return [
      {
        url: ELDER_COMPANION_CANONICALS.cs,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 1,
        alternates: { languages: ELDER_COMPANION_ALTERNATES },
      },
      {
        url: ELDER_COMPANION_MORE_CANONICALS.cs,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: ELDER_COMPANION_MORE_ALTERNATES },
      },
    ];
  }

  if (isTryMyFriendHost(host)) {
    return [
      {
        url: ELDER_COMPANION_CANONICALS.en,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 1,
        alternates: { languages: ELDER_COMPANION_ALTERNATES },
      },
      {
        url: ELDER_COMPANION_MORE_CANONICALS.en,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: ELDER_COMPANION_MORE_ALTERNATES },
      },
    ];
  }

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

  const elderCompanionEntries: MetadataRoute.Sitemap = LOCALES.filter(
    (locale) => locale !== "cs",
  ).map((locale) => ({
    url: ELDER_COMPANION_CANONICALS[locale],
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.72,
    alternates: { languages: ELDER_COMPANION_ALTERNATES },
  }));

  const elderCompanionMoreEntries: MetadataRoute.Sitemap = LOCALES.filter(
    (locale) => locale !== "cs",
  ).map((locale) => ({
    url: ELDER_COMPANION_MORE_CANONICALS[locale],
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
    alternates: { languages: ELDER_COMPANION_MORE_ALTERNATES },
  }));

  return [
    ...homeEntries,
    ...elderCompanionEntries,
    ...elderCompanionMoreEntries,
    ...solutionsListEntries,
    ...solutionsDetailEntries,
    ...portfolioDetailEntries,
  ];
}
