import Image from "next/image";
import Link from "next/link";
import { LocalizedHomeLink } from "@/components/localized-home-link";
import { LonelySeniorsGraphic } from "@/components/lonely-seniors-graphic";
import { FaqAccordion } from "@/components/faq-accordion";
import { SoftFadeImage } from "@/components/soft-fade-image";
import { STORY_CLIP_PATHS } from "@/lib/story-clip-paths";
import {
  DIGIPRIATEL_FAQS,
  ELDER_COMPANION_ALTERNATES,
  ELDER_COMPANION_CANONICALS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
  faqJsonLd,
} from "@/lib/elder-companion-seo";

const title = "DigiPriateľ - AI spoločník pre seniorov";
const description =
  "DigiPriateľ je telefonický AI spoločník pre seniorov, ktorý ponúka rozhovor, oporu, pripomienky a praktickú pomoc v každodennom živote.";

export const metadata = elderCompanionMetadata({
  locale: "sk",
  title,
  description,
  canonical: ELDER_COMPANION_CANONICALS.sk,
  alternates: ELDER_COMPANION_ALTERNATES,
});

export default function DigiPriatel() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "DigiPriateľ",
              description,
              url: ELDER_COMPANION_CANONICALS.sk,
              inLanguage: "sk-SK",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(DIGIPRIATEL_FAQS)),
        }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <LocalizedHomeLink
          fallbackLocale="sk"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; Späť na hlavnú stránku
        </LocalizedHomeLink>
        <div className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <SoftFadeImage
            src="/images/robo-companion/robo-companion.png"
            alt="DigiPriateľ – robotický spoločník"
            className="w-48 sm:w-64"
            imageClassName="rounded-xl w-full h-auto object-cover"
            width={1000}
            height={1000}
          />
        </div>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">
            digi<span className="italic text-orange-400">priateľ</span>
          </h1>
          <p className="text-black opacity-50">Spoločník pre seniorov</p>
        </div>

        <section className="space-y-20 sm:space-y-28">
          <div className="mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
            <p>
              DigiPriateľ je <strong>AI spoločník pre seniorov cez bežný telefonický hovor</strong>.
            </p>
            <p>
              Pomáha proti samote, pripomína dôležité veci a ponúka zrozumiteľnú oporu bez potreby
              smartfónu, aplikácie alebo internetu.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="flex-1 order-2 md:order-1 mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
              <p>
                Na Slovensku žije <strong>každý tretí senior úplne osamote</strong>.
              </p>
              <p>
                To je cez <strong>200&nbsp;000 osamelých seniorov</strong>.
              </p>
              <p>
                Mnohí z nich sa so svojou rodinou vídajú len zriedka alebo vôbec a samota sa stáva
                súčasťou ich každodenného života.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <LonelySeniorsGraphic label="Každý tretí senior žije osamote" />
            </div>
          </div>

          <div className="text-center py-8 sm:py-12">
            <p className="text-xl sm:text-2xl font-semibold text-black/80">
              Preto som vytvoril{" "}
              <span className="caveat-bold-font text-3xl sm:text-4xl text-black">
                digi<span className="italic text-orange-500">priateľa</span>
              </span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="w-full md:w-[32rem] flex items-center justify-center order-1">
              <SoftFadeImage
                src="/images/robo-companion/myfriend-talking-to-senior.jpg"
                alt="Malý robotický spoločník počas konverzácie"
                className="w-full"
                imageClassName="w-full h-auto object-cover"
                width={804}
                height={603}
                clipPath={STORY_CLIP_PATHS.talking}
              />
            </div>
            <div className="flex-1 order-2 mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
              <p>
                <strong>DigiPriateľ je kamarát na telefóne</strong>, ktorý seniorom dáva to, čo im
                často najviac chýba: spoločnosť a oporu.
              </p>
              <p>
                Môžu mu zavolať 24/7 len tak sa porozprávať, spýtať sa, získať pomoc s riešením
                problémov, alebo nastaviť pripomienky napríklad na užívanie liekov.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="flex-1 order-2 md:order-1 mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
              <p>
                DigiPriateľ sa <strong>prispôsobuje každému človeku</strong>.
              </p>
              <p>
                Učí sa o jeho záujmoch a pamätá si minulé rozhovory, rovnako ako ľudský priateľ.
              </p>
              <p>
                Občas seniorovi sám zavolá, aby sa len tak porozprával, alebo aby sa podelil o
                zaujímavé novinky a nápady podľa jeho záujmov.
              </p>
            </div>
            <div className="w-full md:w-[32rem] flex items-center justify-center order-1 md:order-2">
              <SoftFadeImage
                src="/images/robo-companion/myfriend-greeting-senior.jpg"
                alt="Robot sa rozpráva so seniorom"
                className="w-full"
                imageClassName="w-full h-auto object-cover"
                width={804}
                height={603}
                clipPath={STORY_CLIP_PATHS.greeting}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="w-full md:w-[32rem] flex items-center justify-center order-1">
              <SoftFadeImage
                src="/images/robo-companion/senior-exercising.jpg"
                alt="Pripomenutia na pohyb a aktivity"
                className="w-full"
                imageClassName="w-full h-auto object-cover"
                width={804}
                height={603}
                clipPath={STORY_CLIP_PATHS.exercising}
              />
            </div>
            <div className="flex-1 order-2 mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
              <p>Okrem konverzácie DigiPriateľ pečuje aj o pohodu seniorov.</p>
              <p>
                Pripomína užívanie liekov načas, motivuje k ľahkému cvičeniu a mentálnym aktivitám a
                zároveň to robí zábavnou formou gamifikácie.
              </p>
              <p>Vďaka tomu je jednoduchšie a príjemnejšie zostať zdravý a aktívny.</p>
            </div>
          </div>

          <div className="pt-8 sm:pt-12">
            <p className="text-center mb-6 text-lg">
              Chcete vyskúšať DigiPriateľa?
              <br />
              Zavolajte kedykoľvek zadarmo:
            </p>
            <h3 className="flex w-full justify-center items-center pb-8 sm:pb-12">
              <a
                href="tel:+420910920500"
                className="text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg"
              >
                +420 910 920 500
              </a>
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950">
                Časté otázky
              </h2>
            </div>
            <FaqAccordion items={DIGIPRIATEL_FAQS} />
          </div>
        </section>
        <div className="w-full flex flex-col items-center justify-center py-16">
          <Link
            href="/digipriatel/viac"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors"
          >
            Viac o projekte
          </Link>
        </div>
      </div>

      <footer>
        <p className="text-center mb-6">
          Máte akékoľvek otázky, pripomienky alebo nápady na DigiPriateľa?
          <br />
          Kontaktujte ma cez odkazy nižšie:
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Profil na X">
            <Image
              src="/icons/twitter-x.svg?v=5"
              alt="X"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Profil na LinkedIn">
            <Image
              src="/icons/linkedin.svg?v=5"
              alt="LinkedIn"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="E-mail">
            <Image src="/icons/mail.svg?v=5" alt="E-mail" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="tel:+14153771909" target="_blank" aria-label="Telefón">
            <Image src="/icons/phone.svg?v=5" alt="Telefón" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
        </div>
        <h6 className="py-6 text-center text-black">© {new Date().getFullYear()} GrowByte</h6>
      </footer>
    </>
  );
}
