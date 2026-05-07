import {
  CASE_STUDIES as SOLUTION_ENTRIES,
  type Locale,
} from "../data";
import {
  CASE_STUDIES as PORTFOLIO_CASE_STUDIES,
} from "../../case-studies/data";
import { getDictionary } from "../dictionary";
import { SITE_URL } from "../site";

/**
 * Structured data for the combined index: solutions first, then case studies.
 */
export function CombinedSolutionsListJsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const solutions = SOLUTION_ENTRIES[locale];
  const portfolio = PORTFOLIO_CASE_STUDIES[locale];
  const listUrl = `${SITE_URL}/solutions/${locale}`;

  let position = 0;
  const itemListElement = [
    ...solutions.map((cs) => {
      position += 1;
      return {
        "@type": "ListItem",
        position,
        url: `${SITE_URL}/solutions/${locale}/${cs.slug}`,
        name: cs.title,
      };
    }),
    ...portfolio.map((cs) => {
      position += 1;
      return {
        "@type": "ListItem",
        position,
        url: `${SITE_URL}/case-studies/${locale}/${cs.slug}`,
        name: cs.title,
      };
    }),
  ];

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${listUrl}#collection`,
    url: listUrl,
    name: dict.pageTitle,
    description: dict.pageDescription,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "GrowByte",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
    />
  );
}
