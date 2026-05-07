import { SK_MAX_UTM_SOURCE } from "@/app/solutions/sk-max-contacts";

const SK_SOLUTIONS_OR_CASE_SK = /^\/(?:solutions|case-studies)\/sk(?:\/|$|\?|#)/;

/**
 * Adds `utm_source=max` only for Slovak `/solutions/sk` / `/case-studies/sk` subtree.
 */
export function appendSkSolutionsCaseStudiesUtm(
  href: string,
  campaignActive: boolean,
): string {
  if (!campaignActive) return href;
  if (typeof href !== "string" || !href.startsWith("/")) return href;
  if (!SK_SOLUTIONS_OR_CASE_SK.test(href)) return href;
  if (/[\?&#]utm_source=/i.test(href)) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}utm_source=${SK_MAX_UTM_SOURCE}`;
}
