import { headers } from "next/headers";
import {
  DIGIPRITEL_FAQS,
  DIGIPRITEL_ORIGIN,
  ELDER_COMPANION_CANONICALS,
  ELDER_COMPANION_MORE_CANONICALS,
  GROWBYTE_ORIGIN,
  isDigipritelHost,
} from "@/lib/elder-companion-seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const headerList = await headers();
  const isDigiPritel = isDigipritelHost(headerList.get("host"));

  const body = isDigiPritel
    ? [
        "# DigiPřítel",
        "",
        "DigiPřítel je český AI společník pro seniory dostupný přes běžný telefonní hovor.",
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
        ...DIGIPRITEL_FAQS.flatMap((item) => [
          `- ${item.question}`,
          `  ${item.answer}`,
        ]),
        "",
        "## Kontakt",
        "Projekt vyvíjí GrowByte. Kontakt: oliver.cingl@gmail.com",
      ].join("\n")
    : [
        "# GrowByte",
        "",
        "GrowByte builds AI products and automation systems.",
        "",
        "## Elder companion project",
        `- Czech canonical: ${DIGIPRITEL_ORIGIN}`,
        `- English: ${ELDER_COMPANION_CANONICALS.en}`,
        `- Slovak: ${ELDER_COMPANION_CANONICALS.sk}`,
        `- German: ${ELDER_COMPANION_CANONICALS.de}`,
        "",
        "## Website",
        GROWBYTE_ORIGIN,
      ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
