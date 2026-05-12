import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_LOCALE_COOKIE } from "@/lib/site-locale-cookie";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./solutions/data";

/**
 * Root URL → best-matching locale home (`/{locale}`). Crawlers and shared
 * links should follow to a canonical localized URL with hreflang alternates.
 */
export default async function HomeRootRedirect() {
  const jar = await cookies();
  const saved = jar.get(SITE_LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) {
    redirect(`/${saved}`);
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") ?? "";
  const detected = pickPreferredLocale(acceptLanguage) ?? DEFAULT_LOCALE;
  redirect(`/${detected}`);
}

function pickPreferredLocale(header: string): Locale | undefined {
  const tags = header
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";");
      const q = qPart?.match(/q=([\d.]+)/);
      return { tag: tag.toLowerCase(), q: q ? Number(q[1]) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return undefined;
}
