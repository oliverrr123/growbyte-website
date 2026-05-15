import Image from "next/image";
import Link from "next/link";
import {
  ELDER_COMPANION_MORE_ALTERNATES,
  ELDER_COMPANION_MORE_CANONICALS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
} from "@/lib/elder-companion-seo";

const title = "Mehr zum Projekt DigiFreund";
const description =
  "Die Geschichte hinter DigiFreund: tschechisches MVP, Workshops mit Seniorinnen und Senioren, Interesse von Pflegeheimen, TV-Berichte und die einfache Telefonnummer.";

export const metadata = elderCompanionMetadata({
  locale: "de",
  title,
  description,
  canonical: ELDER_COMPANION_MORE_CANONICALS.de,
  alternates: ELDER_COMPANION_MORE_ALTERNATES,
});

export default function DigiFreundMore() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "DigiFreund",
              description,
              url: ELDER_COMPANION_MORE_CANONICALS.de,
              inLanguage: "de-DE",
            }),
          ),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <Link href="/digifreund" className="text-black text-sm opacity-50 pb-8 sm:pb-16 block">
          &lt;&nbsp; Zurück zu DigiFreund
        </Link>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">
            digi<span className="italic text-orange-400">freund</span>
          </h1>
          <p className="text-black opacity-50">Begleitung für Menschen im Alter</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Das hier ist das MVP von DigiFreund aus der Tschechischen Republik. Wir haben Workshops mit Seniorinnen und Senioren durchgeführt, haben mit Pflegeheimen gesprochen und Interesse an einem Pilotbetrieb bekommen.
                <br />
                <br />
                Am Ende haben wir den physischen Roboter durch eine einfache Telefonnummer ersetzt. Damit ist DigiFreund ohne Smartphone und ohne Internet für jede und jeden erreichbar.
              </p>
            </div>
            <div className="w-full md:w-96 rounded-xl flex items-center justify-center order-1 md:order-2">
              <iframe
                src="https://player.mux.com/82ykVI701AZjsytyQAXjAy400yUpD72uTzpJ32zSjPcwg?metadata-video-title=myfriend-mvp&video-title=myfriend-mvp&accent-color=%23ff8906"
                style={{ width: "100%", border: "none", aspectRatio: "9/16" }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              ></iframe>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image
                src="/images/robo-companion/president.jpg"
                alt="Projektvorstellung beim Präsidenten der Tschechischen Republik"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Wir durften das Projekt dem Präsidenten der Tschechischen Republik vorstellen und einige Minuten über die Wirkung sprechen. Er zeigte echtes Interesse und ermutigte uns, weiterzuentwickeln.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg leading-relaxed text-gray-800">
              DigiFreund war zweimal im tschechischen Fernsehen zu sehen – seitdem arbeiten wir mit Experten für das Wohlbefinden im Alter zusammen und verstärken entsprechende Angebote im Projekt.
            </p>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full flex-1 space-y-3">
                <div className="bg-green-200 rounded-xl flex items-center justify-center">
                  <iframe
                    src="https://player.mux.com/ByAm1xwJ9018UZIyJaWKtLoDF9Pk25MyKhLPDIu92GY4?metadata-video-title=myfriend-tv-nova&video-title=myfriend-tv-nova&accent-color=%23ff8906"
                    style={{ width: "100%", border: "none", aspectRatio: "16/9" }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="w-full h-full object-cover rounded-xl"
                    width={400}
                    height={400}
                  ></iframe>
                </div>
                <p className="text-sm sm:text-base">
                  <a
                    className="underline"
                    href="https://www.ceskatelevize.cz/porady/14021364946-bilance/224452801250001/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ganze Sendung (ČT, 23:42)
                  </a>
                </p>
              </div>

              <div className="w-full flex-1 space-y-3">
                <div className="bg-green-200 rounded-xl flex items-center justify-center">
                  <iframe
                    src="https://player.mux.com/fPl02nyRWIbVWbbcIuE00VVtJ8JaQODcisQ2Z5hcxUC84?metadata-video-title=myfriend-tv-one&video-title=myfriend-tv-one&accent-color=%23ff8906"
                    style={{ width: "100%", border: "none", aspectRatio: "16/9" }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="w-full h-full object-cover rounded-xl"
                    width={400}
                    height={400}
                  ></iframe>
                </div>
                <p className="text-sm sm:text-base">
                  <a
                    className="underline"
                    href="https://tv.nova.cz/porad/strepiny/video-epizoda/538187-12-4-2026"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ganze Folge (Nova, 20:11)
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <p className="text-center mb-6 mt-12">
          DigiFreund ausprobieren?
          <br />
          Schreiben Sie mir über die Links unten:
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="X-Profil">
            <Image src="/icons/twitter-x.svg" alt="X" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="LinkedIn-Profil">
            <Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="E-Mail">
            <Image src="/icons/mail.svg" alt="E-Mail" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="tel:+420776781248" target="_blank" aria-label="Telefon">
            <Image src="/icons/phone.svg" alt="Telefon" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
        </div>
        <h6 className="py-6 text-center text-black">© {new Date().getFullYear()} GrowByte</h6>
      </footer>
    </>
  );
}
