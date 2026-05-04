import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CASE_STUDIES,
  isLocale,
  LOCALES,
  type Locale,
} from "../data";
import { getDictionary } from "../dictionary";
import { SITE_URL } from "../site";
import { CaseStudiesListJsonLd } from "./list-json-ld";
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
    acc[l] = `${SITE_URL}/case-studies/${l}`;
    return acc;
  }, {});
  languages["x-default"] = `${SITE_URL}/case-studies/en`;

  return {
    title: `${dict.pageTitle} — GrowByte`,
    description: dict.pageDescription,
    alternates: {
      canonical: `${SITE_URL}/case-studies/${locale}`,
      languages,
    },
    openGraph: {
      title: `${dict.pageTitle} — GrowByte`,
      description: dict.pageDescription,
      url: `${SITE_URL}/case-studies/${locale}`,
      locale,
      alternateLocale: LOCALES.filter((l) => l !== locale),
      type: "website",
    },
  };
}

export default async function CaseStudiesList({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const studies = CASE_STUDIES[typedLocale];

  const switcherAlternates = LOCALES.reduce<Partial<Record<Locale, string>>>(
    (acc, l) => {
      acc[l] = `/case-studies/${l}`;
      return acc;
    },
    {},
  );

  return (
    <div className="bg-background min-h-screen">
      <CaseStudiesListJsonLd locale={typedLocale} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <div className="mb-16 sm:mb-32 text-center">
          <h1 className="text-4xl sm:text-5xl tracking-tight text-foreground mb-4">
            {dict.listHeading}
          </h1>
        </div>

        <section className="space-y-20 sm:space-y-28 text-foreground">
          {studies.map((caseStudy) => (
            <div
              key={caseStudy.id}
              className="flex flex-col md:flex-row md:items-start md:gap-12"
            >
              <div className="flex-1 w-full md:w-96 flex items-center aspect-16/11 justify-center bg-foreground/10">
                <Image
                  src={caseStudy.image}
                  alt={caseStudy.imageAlt}
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                />
              </div>
              <div className="flex-1 flex flex-col gap-6 items-start">
                <p className="text-2xl font-medium sm:text-3xl mt-4 sm:mt-8 max-w-11/12">
                  {caseStudy.title}
                </p>
                <Link
                  href={`/case-studies/${typedLocale}/${caseStudy.slug}`}
                  className="bg-transparent border border-foreground px-4 py-2 inline hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer"
                >
                  <p>{dict.exploreCta}</p>
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>

      <footer className="mt-32">
        <p className="text-center mb-6 text-foreground whitespace-pre-line">
          {dict.contactFooterTitle}
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Twitter profile">
            <Image
              src="/icons/twitter-x.svg"
              alt="Twitter"
              className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Linkedin profile">
            <Image
              src="/icons/linkedin.svg"
              alt="LinkedIn"
              className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="Email">
            <Image
              src="/icons/mail.svg"
              alt="Email"
              className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="tel:+420776781248" target="_blank" aria-label="Phone">
            <Image
              src="/icons/phone.svg"
              alt="Phone"
              className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
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
