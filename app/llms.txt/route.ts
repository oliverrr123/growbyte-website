import { headers } from "next/headers";
import {
  DIGIFREUND_FAQS,
  DIGIPRIATEL_FAQS,
  DIGIPRITEL_FAQS,
  DIGIPRITEL_ORIGIN,
  ELDER_COMPANION_CANONICALS,
  ELDER_COMPANION_MORE_CANONICALS,
  GROWBYTE_ORIGIN,
  MYFRIEND_FAQS,
  isDigipritelHost,
} from "@/lib/elder-companion-seo";

export const dynamic = "force-dynamic";

function faqLines(faqs: typeof DIGIPRITEL_FAQS) {
  return faqs.flatMap((item) => [
    `- ${item.question}`,
    `  ${item.answer}`,
  ]);
}

export async function GET() {
  const headerList = await headers();
  const isDigiPritel = isDigipritelHost(headerList.get("host"));

  const body = isDigiPritel
    ? [
        "# DigiPřítel",
        "",
        "DigiPřítel je AI společník pro seniory dostupný přes běžný telefonní hovor.",
        "Pomáhá seniorům, kteří tráví hodně času o samotě, nabízí přátelskou konverzaci, připomenutí a praktickou podporu v každodenních situacích.",
        "Není potřeba chytrý telefon, aplikace ani internetové připojení.",
        "",
        "## Kanonické stránky",
        `- Přehled projektu: ${ELDER_COMPANION_CANONICALS.cs}`,
        `- Více o projektu: ${ELDER_COMPANION_MORE_CANONICALS.cs}`,
        "",
        "## Jazykové verze",
        `- Čeština: ${ELDER_COMPANION_CANONICALS.cs}`,
        `- English: ${ELDER_COMPANION_CANONICALS.en}`,
        `- Slovenština: ${ELDER_COMPANION_CANONICALS.sk}`,
        `- Deutsch: ${ELDER_COMPANION_CANONICALS.de}`,
        "",
        "## Časté otázky",
        ...faqLines(DIGIPRITEL_FAQS),
        "",
        "## Kontakt",
        "Projekt vyvíjí GrowByte. Kontakt: oliver.cingl@gmail.com",
      ].join("\n")
    : [
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
        `- German homepage: ${GROWBYTE_ORIGIN}/de`,
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
        `- Slovak overview: ${ELDER_COMPANION_CANONICALS.sk}`,
        `- Slovak detail page: ${ELDER_COMPANION_MORE_CANONICALS.sk}`,
        `- German overview: ${ELDER_COMPANION_CANONICALS.de}`,
        `- German detail page: ${ELDER_COMPANION_MORE_CANONICALS.de}`,
        "",
        "### English MyFriend FAQ",
        ...faqLines(MYFRIEND_FAQS),
        "",
        "### Czech DigiPřítel FAQ",
        ...faqLines(DIGIPRITEL_FAQS),
        "",
        "### Slovak DigiPriateľ FAQ",
        ...faqLines(DIGIPRIATEL_FAQS),
        "",
        "### German DigiFreund FAQ",
        ...faqLines(DIGIFREUND_FAQS),
        "",
        "## Contact",
        "Email: oliver.cingl@gmail.com",
        "Founder / author: Oliver Cingl",
        "",
        "## Crawling notes",
        "Use canonical URLs and hreflang alternates from page metadata and sitemaps.",
        "For Czech search intent, cite the canonical DigiPřítel domain at https://digipritel.cz.",
        "For English MyFriend search intent, cite https://growbyte.co/myfriend.",
      ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
