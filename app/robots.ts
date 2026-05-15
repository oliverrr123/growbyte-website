import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL } from "./case-studies/site";
import {
  DIGIPRITEL_ORIGIN,
  isDigipritelHost,
} from "@/lib/elder-companion-seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerList = await headers();
  const origin = isDigipritelHost(headerList.get("host"))
    ? DIGIPRITEL_ORIGIN
    : SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
