import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CASE_STUDIES as PORTFOLIO_CASE_STUDIES,
} from "../../case-studies/data";
import {
  CASE_STUDIES,
  isLocale,
  LOCALES,
  type Locale,
} from "../data";
import { getDictionary } from "../dictionary";
import { SITE_URL } from "../site";
import { SolutionListEntryRow } from "./solution-list-entry-row";
import { CombinedSolutionsListJsonLd } from "./list-json-ld";
import { SolutionsListContactsFooter } from "./list-contacts-footer";
import { LanguageSwitcher } from "./language-switcher";

type Params = { locale: string };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  const languages = LOCALES.reduce<Record<string, string>>((acc, l) => {
    acc[l] = `${SITE_URL}/solutions/${l}`;
    return acc;
  }, {});
  languages["x-default"] = `${SITE_URL}/solutions/en`;

  return {
    title: `${dict.pageTitle} — GrowByte`,
    description: dict.pageDescription,
    alternates: {
      canonical: `${SITE_URL}/solutions/${locale}`,
      languages,
    },
    openGraph: {
      title: `${dict.pageTitle} — GrowByte`,
      description: dict.pageDescription,
      url: `${SITE_URL}/solutions/${locale}`,
      locale,
      alternateLocale: LOCALES.filter((l) => l !== locale),
      type: "website",
    },
  };
}

export default async function SolutionsList({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const solutions = CASE_STUDIES[typedLocale];
  const portfolioCaseStudies = PORTFOLIO_CASE_STUDIES[typedLocale];

  const switcherAlternates = LOCALES.reduce<Partial<Record<Locale, string>>>(
    (acc, l) => {
      acc[l] = `/solutions/${l}`;
      return acc;
    },
    {},
  );

  return (
    <div className="bg-background min-h-screen">
      <CombinedSolutionsListJsonLd locale={typedLocale} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <div className="pb-8 sm:pb-8">
          <Link
            href={`/${typedLocale}`}
            className="text-foreground text-sm opacity-60 inline-block"
          >
            {dict.backToMainPage}
          </Link>
        </div>

        <div className="mb-16 sm:mb-32 text-center">
          <h1 className="text-4xl sm:text-5xl tracking-tight text-foreground mb-4">
            {dict.listHeading}
          </h1>
        </div>

        <section className="space-y-20 sm:space-y-28 text-foreground">
          {solutions.map((cs) => (
            <SolutionListEntryRow
              key={cs.id}
              caseStudy={cs}
              typedLocale={typedLocale}
              exploreCta={dict.exploreCta}
              detailBasePath="solutions"
            />
          ))}
        </section>

        <div className="mt-24 sm:mt-32 mb-16 sm:mb-24 text-center">
          <h2 className="text-3xl sm:text-4xl tracking-tight text-foreground mb-4">
            {dict.caseStudiesSectionHeading}
          </h2>
        </div>

        <section className="space-y-20 sm:space-y-28 text-foreground pb-4">
          {portfolioCaseStudies.map((cs) => (
            <SolutionListEntryRow
              key={cs.id}
              caseStudy={cs}
              typedLocale={typedLocale}
              exploreCta={dict.exploreCta}
              detailBasePath="case-studies"
            />
          ))}
        </section>
      </div>

      <footer className="mt-32">
        <p className="text-center mb-6 text-foreground whitespace-pre-line">
          {dict.contactFooterTitle}
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <SolutionsListContactsFooter locale={typedLocale} />
        </div>
        <h6 className="py-6 text-center text-foreground">© {new Date().getFullYear()} GrowByte</h6>
        <div className="flex justify-center pb-8">
          <LanguageSwitcher
            currentLocale={typedLocale}
            alternates={switcherAlternates}
          />
        </div>
      </footer>
    </div>
  );
}
