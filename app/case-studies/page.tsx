import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./data";

/**
 * Redirects /case-studies → /case-studies/{user's preferred locale}.
 * Falls back to the default locale (en) if no match.
 */
export default async function CaseStudiesIndex() {
  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") ?? "";

  const detected = pickPreferredLocale(acceptLanguage) ?? DEFAULT_LOCALE;
  redirect(`/case-studies/${detected}`);
}

function pickPreferredLocale(header: string): Locale | undefined {
  // Parse "Accept-Language" tags by quality; first supported locale wins.
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
