export const LOCALES = ["en", "cs", "sk", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export type CaseStudyId = "cv-search-engine" | "marketing-analyzer";

export type CaseStudy = {
  id: CaseStudyId;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  readTime: string;
  authorName: string;
  authorUrl: string;
  authorImage: string;
  companyName: string;
  companyUrl: string;
};

/**
 * Article-level metadata that doesn't depend on language.
 * Dates are ISO-8601; used for JSON-LD `datePublished` / `dateModified`
 * and for OpenGraph `article:published_time` / `article:modified_time`.
 */
export const CASE_STUDY_META: Record<
  CaseStudyId,
  { publishedAt: string; updatedAt: string }
> = {
  "cv-search-engine": {
    publishedAt: "2025-03-01",
    updatedAt: "2025-03-01",
  },
  "marketing-analyzer": {
    publishedAt: "2025-05-01",
    updatedAt: "2025-05-01",
  },
};

const COMMON = {
  authorName: "Oliver Cingl",
  authorUrl: "https://olivercingl.com",
  authorImage: "/images/case-studies/oliver-cingl-profile-picture.jpg",
  companyName: "GrowByte",
  companyUrl: "https://growbyte.co",
} as const;

export const CASE_STUDIES: Record<Locale, CaseStudy[]> = {
  en: [
    {
      id: "cv-search-engine",
      slug: "cv-search-engine",
      title: "How to find the perfect candidate burried in 50 000 CVs?",
      description:
        "Building an AI-powered CV search engine for Atollon: semantic search, structured filters and unified candidate profiles across 50 000+ documents.",
      image: "/images/case-studies/case1.jpg",
      imageAlt: "AI search interface and data-driven hiring workflow",
      readTime: "2 min read",
      ...COMMON,
    },
    {
      id: "marketing-analyzer",
      slug: "marketing-analyzer",
      title: "How MarketUp ditched spreadsheets for an AI-first marketing analysis tool",
      description:
        "How we built an AI-first ad analysis tool for MarketUp that replaces hours of spreadsheet work with instant side-by-side competitor insights.",
      image: "/images/case-studies/case2.jpg",
      imageAlt: "Marketing performance dashboard and competitor benchmarking",
      readTime: "2 min read",
      ...COMMON,
    },
  ],
  cs: [
    {
      id: "cv-search-engine",
      slug: "vyhledavac-cv",
      title: "Jak najít perfektního kandidáta mezi 50 000 životopisy?",
      description:
        "Jak jsme pro Atollon postavili AI nástroj na hledání životopisů: sémantické vyhledávání, strukturované filtry a sjednocené profily kandidátů napříč 50 000+ dokumenty.",
      image: "/images/case-studies/case1.jpg",
      imageAlt: "AI rozhraní pro vyhledávání a datově řízený nábor",
      readTime: "2 min čtení",
      ...COMMON,
    },
    {
      id: "marketing-analyzer",
      slug: "marketingovy-analyzator",
      title: "Jak MarketUp vyměnil tabulky za AI nástroj pro analýzu marketingu",
      description:
        "Jak jsme pro MarketUp postavili AI nástroj na analýzu reklam, který nahradil hodiny práce v tabulkách okamžitým srovnáním s konkurencí.",
      image: "/images/case-studies/case2.jpg",
      imageAlt: "Marketingový dashboard a srovnání s konkurencí",
      readTime: "2 min čtení",
      ...COMMON,
    },
  ],
  sk: [
    {
      id: "cv-search-engine",
      slug: "vyhladavac-cv",
      title: "Ako nájsť perfektného kandidáta medzi 50 000 životopismi?",
      description:
        "Ako sme pre Atollon postavili AI nástroj na hľadanie životopisov: sémantické vyhľadávanie, štruktúrované filtre a zjednotené profily kandidátov naprieč 50 000+ dokumentmi.",
      image: "/images/case-studies/case1.jpg",
      imageAlt: "AI rozhranie pre vyhľadávanie a dátovo riadený nábor",
      readTime: "2 min čítania",
      ...COMMON,
    },
    {
      id: "marketing-analyzer",
      slug: "marketingovy-analyzator",
      title: "Ako MarketUp vymenil tabuľky za AI nástroj na analýzu marketingu",
      description:
        "Ako sme pre MarketUp postavili AI nástroj na analýzu reklám, ktorý nahradil hodiny práce s tabuľkami okamžitým porovnaním s konkurenciou.",
      image: "/images/case-studies/case2.jpg",
      imageAlt: "Marketingový dashboard a porovnanie s konkurenciou",
      readTime: "2 min čítania",
      ...COMMON,
    },
  ],
  de: [
    {
      id: "cv-search-engine",
      slug: "lebenslauf-suchmaschine",
      title: "Wie findet man den perfekten Kandidaten unter 50 000 Lebensläufen?",
      description:
        "Wie wir für Atollon eine KI-gestützte Lebenslauf-Suchmaschine gebaut haben: semantische Suche, strukturierte Filter und einheitliche Kandidatenprofile über 50 000+ Dokumente hinweg.",
      image: "/images/case-studies/case1.jpg",
      imageAlt: "KI-Suchoberfläche und datengetriebener Recruiting-Workflow",
      readTime: "2 Min. Lesezeit",
      ...COMMON,
    },
    {
      id: "marketing-analyzer",
      slug: "marketing-analyse-tool",
      title: "Wie MarketUp Tabellen gegen ein KI-basiertes Marketing-Analyse-Tool eintauschte",
      description:
        "Wie wir für MarketUp ein KI-basiertes Anzeigen-Analyse-Tool gebaut haben, das stundenlange Tabellenarbeit durch sofortige Wettbewerbsvergleiche ersetzt.",
      image: "/images/case-studies/case2.jpg",
      imageAlt: "Marketing-Performance-Dashboard und Wettbewerbs-Benchmarking",
      readTime: "2 Min. Lesezeit",
      ...COMMON,
    },
  ],
};

export function getCaseStudyBySlug(locale: Locale, slug: string) {
  return CASE_STUDIES[locale].find((cs) => cs.slug === slug);
}

export function getCaseStudyById(locale: Locale, id: CaseStudyId) {
  return CASE_STUDIES[locale].find((cs) => cs.id === id);
}

/**
 * Look up the same case study (by stable id) in every other locale.
 * Used to build hreflang alternates and language-switcher links.
 */
export function getAllLocaleSlugsForId(id: CaseStudyId): Record<Locale, string> {
  return LOCALES.reduce(
    (acc, locale) => {
      const match = getCaseStudyById(locale, id);
      if (match) acc[locale] = match.slug;
      return acc;
    },
    {} as Record<Locale, string>,
  );
}

/**
 * Try to find a case study in any locale by its slug.
 * Used by middleware to redirect legacy /case-studies/{slug} URLs.
 */
export function findCaseStudyByAnySlug(
  slug: string,
): { locale: Locale; caseStudy: CaseStudy } | undefined {
  for (const locale of LOCALES) {
    const match = getCaseStudyBySlug(locale, slug);
    if (match) return { locale, caseStudy: match };
  }
  return undefined;
}
