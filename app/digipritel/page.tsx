import { MyFriendLandingHero } from "@/components/myfriend-landing-hero";
import {
  DIGIPRITEL_BANNER_IMAGE,
  DIGIPRITEL_FAQS,
  ELDER_COMPANION_ALTERNATES,
  ELDER_COMPANION_CANONICALS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
  faqJsonLd,
} from "@/lib/elder-companion-seo";

const title = "DigiPřítel - AI společník pro seniory";
const description =
  "DigiPřítel je telefonní AI společník pro seniory, který pomáhá proti samotě, připomíná důležité věci a nabízí praktickou oporu v každodenním životě.";

export const metadata = elderCompanionMetadata({
  locale: "cs",
  title,
  description,
  canonical: ELDER_COMPANION_CANONICALS.cs,
  alternates: ELDER_COMPANION_ALTERNATES,
  ogImage: { url: DIGIPRITEL_BANNER_IMAGE, width: 1200, height: 630 },
});

export default function DigiPritel() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "DigiPřítel",
              description,
              url: ELDER_COMPANION_CANONICALS.cs,
              inLanguage: "cs-CZ",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(DIGIPRITEL_FAQS)),
        }}
      />
      <MyFriendLandingHero locale="cs" />
    </>
  );
}
