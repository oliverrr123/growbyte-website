import type { Metadata } from "next";
import type { Locale } from "@/app/solutions/data";

export const GROWBYTE_ORIGIN = "https://growbyte.co";
export const DIGIPRITEL_ORIGIN = "https://digipritel.cz";

export const ELDER_COMPANION_CANONICALS: Record<Locale, string> = {
  cs: DIGIPRITEL_ORIGIN,
  en: `${GROWBYTE_ORIGIN}/myfriend`,
  sk: `${GROWBYTE_ORIGIN}/digipriatel`,
  de: `${GROWBYTE_ORIGIN}/digifreund`,
};

export const ELDER_COMPANION_MORE_CANONICALS: Record<Locale, string> = {
  cs: `${DIGIPRITEL_ORIGIN}/vice`,
  en: `${GROWBYTE_ORIGIN}/myfriend/more`,
  sk: `${GROWBYTE_ORIGIN}/digipriatel/viac`,
  de: `${GROWBYTE_ORIGIN}/digifreund/more`,
};

export const ELDER_COMPANION_ALTERNATES: Record<string, string> = {
  cs: ELDER_COMPANION_CANONICALS.cs,
  en: ELDER_COMPANION_CANONICALS.en,
  sk: ELDER_COMPANION_CANONICALS.sk,
  de: ELDER_COMPANION_CANONICALS.de,
  "x-default": ELDER_COMPANION_CANONICALS.en,
};

export const ELDER_COMPANION_MORE_ALTERNATES: Record<string, string> = {
  cs: ELDER_COMPANION_MORE_CANONICALS.cs,
  en: ELDER_COMPANION_MORE_CANONICALS.en,
  sk: ELDER_COMPANION_MORE_CANONICALS.sk,
  de: ELDER_COMPANION_MORE_CANONICALS.de,
  "x-default": ELDER_COMPANION_MORE_CANONICALS.en,
};

export const ELDER_COMPANION_IMAGE = `${GROWBYTE_ORIGIN}/images/robo-companion/robo-companion.png`;

export function normalizeHost(host: string | null): string {
  return (host ?? "").split(":")[0].toLowerCase();
}

export function isDigipritelHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return normalized === "digipritel.cz" || normalized === "www.digipritel.cz";
}

export function isDigipritelComHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return normalized === "digipritel.com" || normalized === "www.digipritel.com";
}

export function isGrowbyteHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return normalized === "growbyte.co" || normalized === "www.growbyte.co";
}

export function elderCompanionMetadata({
  locale,
  title,
  description,
  canonical,
  alternates,
}: {
  locale: Locale;
  title: string;
  description: string;
  canonical: string;
  alternates: Record<string, string>;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: locale === "cs" ? "DigiPřítel" : "GrowByte",
      images: [
        {
          url: ELDER_COMPANION_IMAGE,
          width: 1000,
          height: 1000,
          alt: title,
        },
      ],
      locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function elderCompanionJsonLd({
  name,
  description,
  url,
  inLanguage,
}: {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        name,
        url,
        inLanguage,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name,
        description,
        url,
        image: ELDER_COMPANION_IMAGE,
        applicationCategory: "HealthApplication",
        operatingSystem: "Phone",
        inLanguage,
      },
      {
        "@type": "Organization",
        "@id": `${GROWBYTE_ORIGIN}#organization`,
        name: "GrowByte",
        url: GROWBYTE_ORIGIN,
      },
    ],
  };
}
