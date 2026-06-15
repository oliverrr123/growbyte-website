import Link from "next/link";
import { cookies, headers } from "next/headers";
import { isLocale, type Locale } from "@/app/solutions/data";
import {
  isTryMyFriendHost,
  requestHostFromHeaders,
} from "@/lib/elder-companion-seo";
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
  const headerList = await headers();
  const host = requestHostFromHeaders(headerList);

  if (isTryMyFriendHost(host)) {
    return (
      <Link href="/" className={className}>
        {children}
      </Link>
    );
  }

  const jar = await cookies();
  const raw = jar.get(SITE_LOCALE_COOKIE)?.value;
  const href = raw && isLocale(raw) ? `/${raw}` : `/${fallbackLocale}`;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
