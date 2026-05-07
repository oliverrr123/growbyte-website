import { notFound, permanentRedirect } from "next/navigation";
import { isLocale, LOCALES } from "../data";

type Params = { locale: string };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Case-study index merged into /solutions — keep this URL as a permanent redirect
 * so existing links and bookmarks keep working.
 */
export default async function CaseStudiesListRedirect({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  permanentRedirect(`/solutions/${locale}`);
}
