import Image from "next/image";
import Link from "next/link";
import { LocalizedHomeLink } from "@/components/localized-home-link";
import {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <LocalizedHomeLink
          fallbackLocale="cs"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; Zpět na hlavní stránku
        </LocalizedHomeLink>
        <div className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <Image
            src="/images/robo-companion/robo-companion.png"
            alt="Robot MyFriend"
            className="rounded-xl w-48 sm:w-64 object-cover"
            width={1000}
            height={1000}
          />
        </div>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">
            digi<span className="italic text-orange-400">přítel</span>
          </h1>
          <p className="text-black opacity-50">Společník pro seniory</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 w-full md:max-w-1/2 md:mx-auto md:text-center mb-32 -mt-8">
              DigiPřítel je <strong>AI společník pro seniory přes běžný telefonní hovor</strong>. Pomáhá proti samotě, připomíná důležité věci a nabízí srozumitelnou oporu bez nutnosti chytrého telefonu, aplikace nebo internetu.
            </p>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                V České Republice žije o samotě cca <strong>750 000 seniorů</strong>. To je více lidí, než žije dohromady v celém Jihočeském kraji. Mnozí z nich se se svou rodinou vídají jen zřídka, nebo vůbec, a samota se stává součástí jejich každodenního života.
              </p>
            </div>
            <div className="w-full md:w-96 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/mapa.png"
                alt="Statistiky seniorů žijících o samotě"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
          </div>

          <div className="text-center py-6 sm:py-8">
            <p className="text-xl sm:text-2xl font-semibold">
              Proto jsme vytvořili{" "}
              <span className="caveat-bold-font text-3xl sm:text-4xl">
                digi<span className="italic text-orange-500">přítele</span>
              </span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image
                src="/images/robo-companion/myfriend-talking-to-senior.jpg"
                alt="Malý robotický společník"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                <strong>DigiPřítel je kamarád na telefonu</strong>, který seniorům dává to, co jim často nejvíce chybí: společnost a oporu. Mohou si s ním povídat a díky tomu lépe zvládat pocit samoty. Zároveň pomáhá s každodenními situacemi – připomene, jak se ovládá televize, ukáže nastavení trouby nebo pomůže najít oblíbený recept.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                DigiPřítel se <strong>přizpůsobuje každému člověku</strong>. Učí se o jeho zájmech a sám dokáže začínat konverzace. Občas seniorovi zavolá, aby si s ním jen tak popovídal, nebo mu připomene nějakou důležitou událost.
              </p>
            </div>
            <div className="w-full md:w-96 bg-green-200 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/myfriend-greeting-senior.jpg"
                alt="Robot si povídá se seniorem"
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
                alt="Připomínky zdraví a pohybu"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Kromě konverzace DigiPřítel <strong>dohlíží i na pohodu seniorů</strong>. Připomíná užívání léků, motivuje k lehkému cvičení i mentálním aktivitám a proměňuje je v zábavné výzvy gamifikací. Díky tomu je zdravý životní styl přirozenější a příjemnější.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-center mb-4 text-lg">Chcete vyzkoušet DigiPřítele?<br />Zavolejte kdykoliv zdarma:</p>
            <h3 className="flex w-full justify-center items-center pb-8 sm:pb-12">
              <a href="tel:+420910920500" className="text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg">+420 910 920 500</a>
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950">
                Časté otázky
              </h2>
            </div>
            <div className="grid gap-4">
              {DIGIPRITEL_FAQS.map((item) => (
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
            href="/digipritel/vice"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors"
          >
            Více o projektu
          </Link>
        </div>
      </div>

      <footer>
        <p className="text-center mb-6">Máte jakékoliv dotazy, připomínky, nebo nápady na DigiPřítele?<br />Kontaktujte mě přes odkazy níže:</p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Twitter profil">
            <Image src="/icons/twitter-x.svg" alt="Twitter" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Linkedin profil">
            <Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="E-mail">
            <Image src="/icons/mail.svg" alt="E-mail" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
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
