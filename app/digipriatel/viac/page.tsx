import Image from "next/image";
import Link from "next/link";

export default function DigiPriatelViac() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <Link href="/digipriatel" className="text-black text-sm opacity-50 pb-8 sm:pb-16 block">
          &lt;&nbsp; Späť na stránku DigiPriateľa
        </Link>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-3xl sm:text-5xl font-black text-black mb-4 borel-font">
            digi<span className="italic text-orange-400 font-semibold">priateľ</span>
          </h1>
          <p className="text-black opacity-50">Spoločník pre seniorov</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Toto je MVP DigiPriateľa, ktorý vznikol v Českej republike. Pripravili sme niekoľko workshopov so seniormi, aby sme získali ich spätnú väzbu, a komunikovali sme s domovmi dôchodcov, ktoré prejavili záujem o pilotnú prevádzku.
                <br />
                <br />
                Nakoniec sme fyzického robota nahradili klasickým telefónnym číslom — DigiPriateľ je dostupný pre každého. Stačí klasický telefón, nie je potrebný smartfón ani internetové pripojenie.
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
                alt="Prezentácia projektu prezidentovi Českej republiky"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Dostali sme možnosť predstaviť projekt prezidentovi Českej republiky a rozprávať o jeho dopade niekoľko minút. Prezident prejavil skutočný záujem a povzbudil nás pokračovať vo vývoji.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg leading-relaxed text-gray-800">
              DigiPriateľ sa objavil aj v televízii dvakrát. Vďaka tomu začala spolupráca s odborníkom na duševnú pohodu seniorov pri zapracovaní prvkov blahobytu do produktu.
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
                    Celá časť (Česká televízia)
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
                    Celý diel (TV Nova)
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <p className="text-center mb-6 mt-12">
          Chcete vyskúšať DigiPriateľa?
          <br />
          Kontaktujte ma cez odkazy nižšie:
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Profil na X">
            <Image src="/icons/twitter-x.svg" alt="X" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Profil na LinkedIn">
            <Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
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
