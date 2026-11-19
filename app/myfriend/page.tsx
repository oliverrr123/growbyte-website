import { MyFriendLandingHero } from "@/components/myfriend-landing-hero";
import {
  ELDER_COMPANION_ALTERNATES,
  ELDER_COMPANION_CANONICALS,
  MYFRIEND_BANNER_IMAGE,
  MYFRIEND_FAQS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
  faqJsonLd,
} from "@/lib/elder-companion-seo";

const title = "MyFriend - AI phone companion for seniors";
const description =
  "MyFriend is an AI phone companion for seniors that offers conversation, everyday support, medication reminders, and gentle wellness prompts.";

export const metadata = elderCompanionMetadata({
  locale: "en",
  title,
  description,
  canonical: ELDER_COMPANION_CANONICALS.en,
  alternates: ELDER_COMPANION_ALTERNATES,
  ogImage: { url: MYFRIEND_BANNER_IMAGE, width: 1200, height: 630 },
});

export default function RoboCompanion() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "MyFriend",
              description,
              url: ELDER_COMPANION_CANONICALS.en,
              inLanguage: "en",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(MYFRIEND_FAQS)),
        }}
      />

      <MyFriendLandingHero />
    </>
  );
}
