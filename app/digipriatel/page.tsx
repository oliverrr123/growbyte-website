import Image from "next/image";
import Link from "next/link";
import { LocalizedHomeLink } from "@/components/localized-home-link";
import {
  ELDER_COMPANION_ALTERNATES,
  ELDER_COMPANION_CANONICALS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <LocalizedHomeLink
          fallbackLocale="sk"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; Späť na hlavnú stránku
        </LocalizedHomeLink>
        <div className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <Image
            src="/images/robo-companion/robo-companion.png"
            alt="DigiPriateľ – robotický spoločník"
            className="rounded-xl w-48 sm:w-64 object-cover"
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

        <section className="space-y-12 sm:space-y-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Na Slovensku žije veľké množstvo seniorov bez pravidelných návštev rodiny alebo v domácnostiach, kde už len zriedka vstúpi hosť. Mnohým chýba spoločnosť v každom dni a samota sa stáva zvykom, nie výnimkou.
              </p>
            </div>
            <div className="w-full md:w-96 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/map.png"
                alt="Štatistiky súvisiace so seniormi žijúcimi sami"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
          </div>

          <div className="text-center py-6 sm:py-8">
            <p className="text-xl sm:text-2xl font-semibold">
              Preto sme vytvorili{" "}
              <span className="caveat-bold-font text-3xl sm:text-4xl">
                digi<span className="italic text-orange-500">priateľa</span>
              </span>
              .
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image
                src="/images/robo-companion/myfriend-talking-to-senior.jpg"
                alt="Malý robotický spoločník počas konverzácie"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                <strong>DigiPriateľ je kamarát na telefóne</strong>, ktorý seniorom ponúka to, čo im najčastejšie chýba — spoločnosť a oporu. Môžu sa s ním rozprávať a lepšie zvládnuť pocit prázdnoty doma. Zároveň pomáha vo všedných situáciách: pripomenie ovládanie televízora, vysvetlí použitie rúry alebo pomôže nájsť recept.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                DigiPriateľ sa{" "}
                <strong>
                  prispôsobuje každej osobe — učí sa záujmy a začína rozhovor sám
                </strong>
                . Niekedy zavolá len tak, aby sa porozprával, niekedy pripomenie dôležitú udalosť alebo povinnosti.
              </p>
            </div>
            <div className="w-full md:w-96 bg-green-200 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/myfriend-greeting-senior.jpg"
                alt="Robot sa rozpráva so seniorom"
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
                alt="Pripomenutia na pohyb a aktivity"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Okrem rozprávania DigiPriateľ{" "}
                <strong>dohliada aj na pohodu seniorov</strong>. Pripomína užívanie liekov, nabáda na ľahké cvičenie a mentálne aktivity a hravými prvkami z nich robí menšie výzvy. Zdravší režim tak pôsobí prirodzenejšie a príjemnejšie.
              </p>
            </div>
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
          Chcete vyskúšať DigiPriateľa?
          <br />
          Kontaktujte ma cez odkazy nižšie:
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Profil na X">
            <Image
              src="/icons/twitter-x.svg"
              alt="X"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Profil na LinkedIn">
            <Image
              src="/icons/linkedin.svg"
              alt="LinkedIn"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="E-mail">
            <Image src="/icons/mail.svg" alt="E-mail" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="tel:+420776781248" target="_blank" aria-label="Telefón">
            <Image src="/icons/phone.svg" alt="Telefón" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
        </div>
        <h6 className="py-6 text-center text-black">© {new Date().getFullYear()} GrowByte</h6>
      </footer>
    </>
  );
}
