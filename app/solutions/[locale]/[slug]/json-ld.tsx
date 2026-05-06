import {
  CASE_STUDY_META,
  type CaseStudy,
  type Locale,
} from "../../data";
import { getDictionary } from "../../dictionary";
import { SITE_URL } from "../../site";

/**
 * Server-rendered structured data so search engines and AI crawlers
 * (Google, Bing, ChatGPT, Perplexity, Claude) can extract:
 *   - Article: headline, author, dates, language, image, publisher
 *   - BreadcrumbList: site → solutions → this article
 *   - Person: author identity for E-E-A-T signals
 *
 * Renders an inline <script type="application/ld+json">. Per Google guidance,
 * this is the preferred format over Microdata or RDFa.
 */
export function CaseStudyJsonLd({
  locale,
  caseStudy,
}: {
  locale: Locale;
  caseStudy: CaseStudy;
}) {
  const dict = getDictionary(locale);
  const meta = CASE_STUDY_META[caseStudy.id];
  const url = `${SITE_URL}/solutions/${locale}/${caseStudy.slug}`;
  const imageUrl = `${SITE_URL}${caseStudy.image}`;
  const authorImageUrl = `${SITE_URL}${caseStudy.authorImage}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: caseStudy.title,
    description: caseStudy.description,
    inLanguage: locale,
    image: [imageUrl],
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt,
    author: {
      "@type": "Person",
      "@id": caseStudy.authorUrl,
      name: caseStudy.authorName,
      url: caseStudy.authorUrl,
      image: authorImageUrl,
      jobTitle: `${dict.founderCeoOf} ${caseStudy.companyName}`,
      worksFor: {
        "@type": "Organization",
        name: caseStudy.companyName,
        url: caseStudy.companyUrl,
      },
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: caseStudy.companyName,
      url: caseStudy.companyUrl,
      // TODO: add a square logo at /public/logo.png (min 112x112) and
      // re-enable. Google recommends a publisher logo for rich results.
      // logo: {
      //   "@type": "ImageObject",
      //   url: `${SITE_URL}/logo.png`,
      // },
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: caseStudy.companyName,
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.pageTitle,
        item: `${SITE_URL}/solutions/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: caseStudy.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
