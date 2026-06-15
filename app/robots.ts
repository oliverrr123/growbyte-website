import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL } from "./case-studies/site";
import {
  DIGIPRITEL_ORIGIN,
  TRYMYFRIEND_ORIGIN,
  isDigipritelHost,
  isTryMyFriendHost,
  requestHostFromHeaders,
} from "@/lib/elder-companion-seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerList = await headers();
  const host = requestHostFromHeaders(headerList);
  const origin = isDigipritelHost(host)
    ? DIGIPRITEL_ORIGIN
    : isTryMyFriendHost(host)
      ? TRYMYFRIEND_ORIGIN
      : SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
