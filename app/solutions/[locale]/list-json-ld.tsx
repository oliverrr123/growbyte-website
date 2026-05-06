import {
  CASE_STUDIES,
  type Locale,
} from "../data";
import { getDictionary } from "../dictionary";
import { SITE_URL } from "../site";

/**
 * Structured data for the solutions list page:
 *   - CollectionPage: marks this as an index of articles
 *   - ItemList: lets Google/AI crawlers enumerate every solution and
 *     understand their order
 */
export function CaseStudiesListJsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const studies = CASE_STUDIES[locale];
  const listUrl = `${SITE_URL}/solutions/${locale}`;

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
      itemListElement: studies.map((cs, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/solutions/${locale}/${cs.slug}`,
        name: cs.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
    />
  );
}
