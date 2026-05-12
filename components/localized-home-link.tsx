import Link from "next/link";
import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/app/solutions/data";
import { SITE_LOCALE_COOKIE } from "@/lib/site-locale-cookie";

export async function LocalizedHomeLink({
  fallbackLocale,
  className,
  children,
}: {
  fallbackLocale: Locale;
  className?: string;
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const raw = jar.get(SITE_LOCALE_COOKIE)?.value;
  const href = raw && isLocale(raw) ? `/${raw}` : `/${fallbackLocale}`;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
