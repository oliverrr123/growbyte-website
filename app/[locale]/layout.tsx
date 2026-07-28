import { notFound } from "next/navigation";
import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";
import { isLocale, LOCALES, type Locale } from "@/app/solutions/data";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <LangAttribute locale={locale as Locale} />
      {children}
    </>
  );
}
