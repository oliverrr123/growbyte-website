import type { MetadataRoute } from "next";
import {
  CASE_STUDIES,
  getAllLocaleSlugsForId,
  LOCALES,
} from "./case-studies/data";
import { SITE_URL } from "./case-studies/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Localized list pages (one entry per locale, all linked via alternates).
  const listAlternates = LOCALES.reduce<Record<string, string>>((acc, l) => {
    acc[l] = `${SITE_URL}/case-studies/${l}`;
    return acc;
  }, {});

  const listEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/case-studies/${locale}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: { languages: listAlternates },
  }));

  // Detail pages: one entry per (locale, slug), each with alternates pointing
  // at the same case study in every other locale.
  const detailEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    CASE_STUDIES[locale].map((caseStudy) => {
      const slugsByLocale = getAllLocaleSlugsForId(caseStudy.id);
      const alternates = LOCALES.reduce<Record<string, string>>((acc, l) => {
        if (slugsByLocale[l]) {
          acc[l] = `${SITE_URL}/case-studies/${l}/${slugsByLocale[l]}`;
        }
        return acc;
      }, {});

      return {
        url: `${SITE_URL}/case-studies/${locale}/${caseStudy.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates },
      };
    }),
  );

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...listEntries,
    ...detailEntries,
  ];
}
