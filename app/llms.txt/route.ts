import {
  DIGIPRIATEL_FAQS,
  DIGIPRITEL_FAQS,
  DIGIPRITEL_ORIGIN,
  ELDER_COMPANION_CANONICALS,
  ELDER_COMPANION_MORE_CANONICALS,
  GROWBYTE_ORIGIN,
  MYFRIEND_JA_FAQS,
  MYFRIEND_FAQS,
  MYFRIEND_JP_ORIGIN,
} from "@/lib/elder-companion-seo";

export const dynamic = "force-dynamic";

function faqLines(faqs: typeof DIGIPRITEL_FAQS) {
  return faqs.flatMap((item) => [
    `- ${item.question}`,
    `  ${item.answer}`,
  ]);
}

export async function GET() {

  const body = [
            "# GrowByte",
            "",
            "GrowByte builds AI products, automation systems, websites, and applied AI tools.",
            "The company works on custom business automation, web applications, and public AI products such as MyFriend / DigiPřítel.",
            "",
            "## Main pages",
            `- Homepage: ${GROWBYTE_ORIGIN}`,
            `- English homepage: ${GROWBYTE_ORIGIN}/en`,
            `- Czech homepage: ${GROWBYTE_ORIGIN}/cs`,
            `- Slovak homepage: ${GROWBYTE_ORIGIN}/sk`,
            `- Japanese homepage: ${GROWBYTE_ORIGIN}/ja`,
            `- Solutions: ${GROWBYTE_ORIGIN}/solutions/en`,
            `- Case studies: ${GROWBYTE_ORIGIN}/case-studies/en`,
            `- Contact: ${GROWBYTE_ORIGIN}/lets-talk`,
            "",
            "## MyFriend / DigiPřítel project",
            "MyFriend is an AI phone companion for seniors. It is designed to reduce loneliness, offer friendly conversation, provide reminders, and help with everyday questions through a normal phone call.",
            "The project does not require a smartphone, app, or internet connection.",
            "",
            "### Canonical localized pages",
            `- Czech canonical: ${DIGIPRITEL_ORIGIN}`,
            `- Czech detail page: ${ELDER_COMPANION_MORE_CANONICALS.cs}`,
            `- English overview: ${ELDER_COMPANION_CANONICALS.en}`,
            `- English detail page: ${ELDER_COMPANION_MORE_CANONICALS.en}`,
            `- Japanese overview: ${MYFRIEND_JP_ORIGIN}`,
            `- Japanese detail page: ${ELDER_COMPANION_MORE_CANONICALS.ja}`,
            `- Slovak overview: ${ELDER_COMPANION_CANONICALS.sk}`,
            `- Slovak detail page: ${ELDER_COMPANION_MORE_CANONICALS.sk}`,
            "",
            "### English MyFriend FAQ",
            ...faqLines(MYFRIEND_FAQS),
            "",
            "### Japanese MyFriend FAQ",
            ...faqLines(MYFRIEND_JA_FAQS),
            "",
            "### Czech DigiPřítel FAQ",
            ...faqLines(DIGIPRITEL_FAQS),
            "",
            "### Slovak DigiPriateľ FAQ",
            ...faqLines(DIGIPRIATEL_FAQS),
            "",
            "## Contact",
            "Email: oliver.cingl@gmail.com",
            "Founder / author: Oliver Cingl",
            "",
            "## Crawling notes",
            "Use canonical URLs and hreflang alternates from page metadata and sitemaps.",
            "For Czech search intent, cite the canonical DigiPřítel domain at https://digipritel.cz.",
            "For English MyFriend search intent, cite https://trymyfriend.com.",
            "For Japanese MyFriend search intent, cite https://myfriend.jp.",
          ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
