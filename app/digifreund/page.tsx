import Image from "next/image";
import Link from "next/link";
import { LocalizedHomeLink } from "@/components/localized-home-link";
import {
  DIGIFREUND_FAQS,
  ELDER_COMPANION_ALTERNATES,
  ELDER_COMPANION_CANONICALS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
  faqJsonLd,
} from "@/lib/elder-companion-seo";

const title = "DigiFreund - KI-Telefonbegleiter für Senioren";
const description =
  "DigiFreund ist ein KI-Telefonbegleiter für Senioren, der Gespräche, Alltagshilfe, Erinnerungen und sanfte Impulse für das Wohlbefinden bietet.";

export const metadata = elderCompanionMetadata({
  locale: "de",
  title,
  description,
  canonical: ELDER_COMPANION_CANONICALS.de,
  alternates: ELDER_COMPANION_ALTERNATES,
});

export default function DigiFreundLanding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "DigiFreund",
              description,
              url: ELDER_COMPANION_CANONICALS.de,
              inLanguage: "de-DE",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(DIGIFREUND_FAQS)),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <LocalizedHomeLink
          fallbackLocale="de"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; Zur Startseite
        </LocalizedHomeLink>
        <div className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <Image
            src="/images/robo-companion/robo-companion.png"
            alt="DigiFreund Begleiterroboter"
            className="rounded-xl w-48 sm:w-64 object-cover"
            width={1000}
            height={1000}
          />
        </div>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">
            digi<span className="italic text-orange-400">freund</span>
          </h1>
          <p className="text-black opacity-50">Begleitung für Menschen im Alter</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
          <p className="text-base sm:text-lg leading-relaxed text-gray-800 w-full md:max-w-1/2 md:mx-auto md:text-center mb-32 -mt-8">
            DigiFreund ist ein <strong>KI-Begleiter für Senioren über einen normalen Telefonanruf</strong>. Er hilft gegen Einsamkeit, erinnert an wichtige Dinge und bietet verständliche Unterstützung ohne Smartphone, App oder Internet.
          </p>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                In der Tschechischen Republik leben rund <strong>750.000 Senioren allein</strong>. Das sind mehr Menschen, als in der gesamten Südböhmischen Region leben. Viele von ihnen sehen ihre Familie nur selten oder gar nicht, und Einsamkeit wird Teil ihres Alltags.
              </p>
            </div>
            <div className="w-full md:w-96 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/map.png"
                alt="Illustration zu Alleinsein im Alter"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
          </div>

          <div className="text-center py-6 sm:py-8">
            <p className="text-xl sm:text-2xl font-semibold">
              Darum haben wir{" "}
              <span className="caveat-bold-font text-3xl sm:text-4xl">
                digi<span className="italic text-orange-500">freund</span>
              </span>
              {" entwickelt"}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image
                src="/images/robo-companion/myfriend-talking-to-senior.jpg"
                alt="Kleiner Begleitroboter unterhält sich"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                <strong>DigiFreund ist ein Freund am Telefon</strong>, der Senioren das gibt, was ihnen oft am meisten fehlt: Gesellschaft und Halt. Sie können mit ihm sprechen und das Gefühl von Einsamkeit besser bewältigen. Gleichzeitig hilft er in Alltagssituationen – er erinnert daran, wie der Fernseher bedient wird, erklärt Ofeneinstellungen oder hilft, ein Lieblingsrezept zu finden.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                DigiFreund <strong>passt sich jedem Menschen an</strong>. Er lernt Interessen kennen und kann selbst Gespräche beginnen. Manchmal ruft er einen Senior einfach zum Plaudern an oder erinnert an ein wichtiges Ereignis.
              </p>
            </div>
            <div className="w-full md:w-96 bg-green-200 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/myfriend-greeting-senior.jpg"
                alt="Robot unterhält sich mit Seniorin"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-purple-200 rounded-xl flex items-center justify-center order-1">
              <Image
                src="/images/robo-companion/senior-exercising.jpg"
                alt="Erinnerungen an Bewegung und Wohlbefinden"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Neben der Konversation <strong>kümmert sich DigiFreund auch um das Wohlbefinden von Senioren</strong>. Er erinnert an die Einnahme von Medikamenten, motiviert zu leichter Bewegung und mentalen Aktivitäten und verwandelt sie durch Gamification in unterhaltsame Herausforderungen. Dadurch wird ein gesunder Lebensstil natürlicher und angenehmer.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-center mb-4 text-lg">DigiFreund ausprobieren?<br />Rufen Sie jederzeit kostenlos an:</p>
            <h3 className="flex w-full justify-center items-center pb-8 sm:pb-12">
              <a href="tel:+420910920500" className="text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg">+420 910 920 500</a>
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950">
                Häufige Fragen
              </h2>
            </div>
            <div className="grid gap-4">
              {DIGIFREUND_FAQS.map((item) => (
                <article
                  key={item.question}
                  className="rounded-lg border border-gray-200 px-5 py-5"
                >
                  <h3 className="text-lg font-semibold text-gray-950 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-800">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full flex flex-col items-center justify-center py-16">
          <Link
            href="/digifreund/more"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors"
          >
            Mehr zum Projekt
          </Link>
        </div>
      </div>

      <footer>
        <p className="text-center mb-6">
          Haben Sie Fragen, Feedback oder Ideen zu DigiFreund?
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
