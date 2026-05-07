import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CASE_STUDIES,
  CASE_STUDY_META,
  getAllLocaleSlugsForId,
  getCaseStudyBySlug,
  isLocale,
  LOCALES,
  type Locale,
} from "../../data";
import { getDictionary } from "../../dictionary";
import { getArticleComponent } from "../../articles";
import { SITE_URL } from "../../site";
import { CaseStudyJsonLd } from "./json-ld";
import { LanguageSwitcher } from "../language-switcher";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CASE_STUDIES[locale].map((caseStudy) => ({
      locale,
      slug: caseStudy.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const caseStudy = getCaseStudyBySlug(locale as Locale, slug);
  if (!caseStudy) return {};

  const slugsByLocale = getAllLocaleSlugsForId(caseStudy.id);
  const languages = LOCALES.reduce<Record<string, string>>((acc, l) => {
    const slugForLocale = slugsByLocale[l];
    if (slugForLocale) {
      acc[l] = `${SITE_URL}/case-studies/${l}/${slugForLocale}`;
    }
    return acc;
  }, {});
  if (slugsByLocale.en) {
    languages["x-default"] = `${SITE_URL}/case-studies/en/${slugsByLocale.en}`;
  }

  const url = `${SITE_URL}/case-studies/${locale}/${slug}`;
  const meta = CASE_STUDY_META[caseStudy.id];

  return {
    title: `${caseStudy.title} — GrowByte`,
    description: caseStudy.description,
    authors: [{ name: caseStudy.authorName, url: caseStudy.authorUrl }],
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description,
      url,
      locale,
      alternateLocale: LOCALES.filter((l) => l !== locale),
      type: "article",
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt,
      authors: [caseStudy.authorUrl],
      siteName: caseStudy.companyName,
      images: [
        {
          url: caseStudy.image,
          alt: caseStudy.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description: caseStudy.description,
      images: [caseStudy.image],
    },
  };
}

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const typedLocale = locale as Locale;

  const caseStudy = getCaseStudyBySlug(typedLocale, slug);
  if (!caseStudy) {
    notFound();
  }

  const ArticleComponent = getArticleComponent(typedLocale, caseStudy.id);
  if (!ArticleComponent) {
    notFound();
  }

  const dict = getDictionary(typedLocale);

  const slugsByLocale = getAllLocaleSlugsForId(caseStudy.id);
  const switcherAlternates = LOCALES.reduce<Partial<Record<Locale, string>>>(
    (acc, l) => {
      const slugForLocale = slugsByLocale[l];
      if (slugForLocale) {
        acc[l] = `/case-studies/${l}/${slugForLocale}`;
      }
      return acc;
    },
    {},
  );

  return (
    <div className="bg-background min-h-screen text-foreground">
      <CaseStudyJsonLd locale={typedLocale} caseStudy={caseStudy} />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="flex justify-between items-center pb-8 sm:pb-8 gap-4">
          <Link
            href={`/solutions/${typedLocale}`}
            className="text-foreground text-sm opacity-60"
          >
            {dict.back}
          </Link>
          <LanguageSwitcher
            currentLocale={typedLocale}
            alternates={switcherAlternates}
          />
        </div>

        <div className="mb-8 aspect-16/11 overflow-hidden bg-foreground/10">
          <Image
            src={caseStudy.image}
            alt={caseStudy.imageAlt}
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        <h1 className="text-3xl sm:text-5xl font-medium leading-tight mb-6">
          {caseStudy.title}
        </h1>

        <p className="mb-6 text-sm text-foreground/60 leading-relaxed">
          <span className="text-foreground">{caseStudy.readTime}</span>
          {" • "}
          {dict.writtenByHuman}{" "}
          <a
            href={caseStudy.authorUrl}
            target="_blank"
            className="underline decoration-foreground/60"
          >
            {caseStudy.authorName}
          </a>
          {", "}
          {dict.founderCeoOf}{" "}
          <a
            href={caseStudy.companyUrl}
            target="_blank"
            className="underline decoration-foreground/60"
          >
            {caseStudy.companyName}
          </a>
        </p>

        <div className="space-y-6 text-foreground/80 leading-relaxed text-base sm:text-lg">
          <ArticleComponent />
        </div>
        <Link
          href={`/solutions/${typedLocale}`}
          className="text-foreground text-sm opacity-60 pb-8 sm:pb-8 block"
        >
          {dict.back}
        </Link>
      </article>

      <footer>
        <h6 className="py-6 text-center text-foreground">
          © {new Date().getFullYear()} GrowByte
        </h6>
      </footer>
    </div>
  );
}
