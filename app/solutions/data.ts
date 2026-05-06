export const LOCALES = ["en", "cs", "sk", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export type CaseStudyId = "chatbot" | "automailer";

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
  chatbot: {
    publishedAt: "2026-05-06",
    updatedAt: "2026-05-06",
  },
  automailer: {
    publishedAt: "2026-05-06",
    updatedAt: "2026-05-06",
  },
};

const COMMON = {
  authorName: "Oliver Cingl",
  authorUrl: "https://olivercingl.com",
  authorImage: "/images/case-studies/oliver-cingl-profile-picture.jpg",
  companyName: "GrowByte",
  companyUrl: "https://growbyte.co",
} as const;

/**
 * Per-locale article input. `slug` is optional — when omitted, it
 * defaults to the article's `id` (which is stable across locales and
 * never changes). Override `slug` only when you want a localized,
 * SEO-friendly URL for a specific locale.
 */
type CaseStudyInput = {
  id: CaseStudyId;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  readTime: string;
  slug?: string;
};

function buildStudies(entries: CaseStudyInput[]): CaseStudy[] {
  return entries.map((entry) => ({
    ...entry,
    slug: entry.slug ?? entry.id,
    ...COMMON,
  }));
}

export const CASE_STUDIES: Record<Locale, CaseStudy[]> = {
  en: buildStudies([
    {
      id: "chatbot",
      title: "Automate support, get leads and book meetings without lifting a finger",
      description:
        "How an AI chatbot turns your website into a 24/7 support agent that answers questions, suggests next steps, and books calls — all without lifting a finger.",
      image: "/images/solutions/solution1.jpg",
      imageAlt: "AI chatbot answering questions and booking meetings on a website",
      readTime: "2 min read",
    },
    {
      id: "automailer",
      title: "Send hundreds of hyper personalized emails every day, all automated",
      description:
        "How AI replaces a sales rep with a spreadsheet — generating leads, writing personalized cold emails, and sending hundreds of them every day, fully automated.",
      image: "/images/solutions/solution2.jpg",
      imageAlt: "AI generating and sending personalized cold emails at scale",
      readTime: "2 min read",
    },
  ]),
  cs: buildStudies([
    {
      id: "chatbot",
      title: "Automatizujte zákaznickou podporu, získávejte leady a booklé cally, aniž byste hnuli prstem",
      description:
        "Jak AI chatbot promění váš web v 24/7 zákaznickou podporu, která odpovídá na otázky, navrhuje další kroky a bookuje cally — aniž byste hnuli prstem.",
      image: "/images/solutions/solution1.jpg",
      imageAlt: "AI chatbot odpovídající na otázky a bookující cally na webu",
      readTime: "2 min čtení",
    },
    {
      id: "automailer",
      title: "Posílejte stovky personalizovaných emailů každý den, vše automatizovaně",
      description:
        "Jak AI nahradí obchodníka s tabulkou — generuje leady, píše personalizované cold emaily a posílá jich stovky denně, plně automatizovaně.",
      image: "/images/solutions/solution2.jpg",
      imageAlt: "AI generující a rozesílající personalizované cold emaily ve velkém",
      readTime: "2 min čtení",
    },
  ]),
  sk: buildStudies([
    {
      id: "chatbot",
      title: "Automatizujte zákaznickú podporu, získávejte leady a booknuté cally bez toho, aby ste pohli prstom",
      description:
        "Ako AI chatbot premení váš web na 24/7 zákaznícku podporu, ktorá odpovedá na otázky, navrhuje ďalšie kroky a bookuje cally — bez toho, aby ste hli prstom.",
      image: "/images/solutions/solution1.jpg",
      imageAlt: "AI chatbot odpovedajúci na otázky a bookujúci cally na webe",
      readTime: "2 min čítania",
    },
    {
      id: "automailer",
      title: "Posielajte stovky personalizovaných emailov každý deň, všetko automatizovane",
      description:
        "Ako AI nahradí obchodníka s tabuľkou — generuje leady, píše personalizované cold emaily a posiela ich stovky denne, plne automatizovane.",
      image: "/images/solutions/solution2.jpg",
      imageAlt: "AI generujúca a rozosielajúca personalizované cold emaily vo veľkom",
      readTime: "2 min čítania",
    },
  ]),
  de: buildStudies([
    {
      id: "chatbot",
      title: "Kundensupport automatisieren, Leads bekommen und Calls buchen, ohne einen Finger zu rühren",
      description:
        "Wie ein AI-Chatbot deine Website in einen 24/7-Kundensupport verwandelt — beantwortet Fragen, schlägt nächste Schritte vor und bucht Calls, ohne dass du einen Finger rühren musst.",
      image: "/images/solutions/solution1.jpg",
      imageAlt: "AI-Chatbot beantwortet Fragen und bucht Calls auf einer Website",
      readTime: "2 Min. Lesezeit",
    },
    {
      id: "automailer",
      title: "Versende täglich hunderte personalisierter Emails, alles automatisiert",
      description:
        "Wie AI einen Sales-Mitarbeiter mit Spreadsheet ersetzt — generiert Leads, schreibt personalisierte Cold Emails und versendet täglich hunderte davon, vollautomatisch.",
      image: "/images/solutions/solution2.jpg",
      imageAlt: "AI generiert und versendet personalisierte Cold Emails im großen Stil",
      readTime: "2 Min. Lesezeit",
    },
  ]),
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
 * Used by middleware to redirect legacy /solutions/{slug} URLs.
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
