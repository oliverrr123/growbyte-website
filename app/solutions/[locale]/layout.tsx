import { notFound, redirect } from "next/navigation";
import {
  findCaseStudyByAnySlug,
  isLocale,
  LOCALES,
  type Locale,
} from "../data";
import { LangAttribute } from "./lang-attribute";
import { SkMaxCampaignProvider } from "@/components/sk-max-campaign-context";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function SolutionsLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    // Legacy URL support: /solutions/{slug} from before localization.
    // If the segment matches a known solution slug, 308-redirect to the
    // canonical localized URL. This preserves SEO for any inbound links.
    const legacy = findCaseStudyByAnySlug(locale);
    if (legacy) {
      redirect(`/solutions/${legacy.locale}/${legacy.caseStudy.slug}`);
    }
    notFound();
  }

  return (
    <>
      <LangAttribute locale={locale as Locale} />
      <SkMaxCampaignProvider>{children}</SkMaxCampaignProvider>
    </>
  );
}
