import Image from "next/image";
import Link from "next/link";
import {
  ELDER_COMPANION_EVENTS_ALTERNATES,
  ELDER_COMPANION_EVENTS_CANONICALS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
} from "@/lib/elder-companion-seo";
import { EVENTS } from "@/app/myfriend/events/data";

const title = "Akce DigiPřítele";
const description =
  "Workshopy, ukázky a komunitní akce DigiPřítele — telefonního AI společníka pro seniory.";

export const metadata = elderCompanionMetadata({
  locale: "cs",
  title,
  description,
  canonical: ELDER_COMPANION_EVENTS_CANONICALS.cs,
  alternates: ELDER_COMPANION_EVENTS_ALTERNATES,
});

export default function DigiPritelEventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "Akce DigiPřítele",
              description,
              url: ELDER_COMPANION_EVENTS_CANONICALS.cs,
              inLanguage: "cs-CZ",
            }),
          ),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-0">
        <Link
          href="/digipritel"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; Zpět na stránku DigiPřítele
        </Link>

        <div className="text-center mb-12 sm:mb-20">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">
            digi<span className="italic text-orange-400">přítel</span>
          </h1>
          <p className="text-black opacity-50">Akce</p>
        </div>

        {EVENTS.length === 0 ? (
          <p className="text-center text-base sm:text-lg text-gray-800 opacity-70 pb-16">
            Nové akce se zde brzy objeví.
          </p>
        ) : (
          <section className="space-y-20 sm:space-y-28 text-black pb-4">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row md:items-start md:gap-12"
              >
                <div className="w-full md:w-96 aspect-16/11 rounded-xl overflow-hidden bg-orange-50 flex items-center justify-center shrink-0">
                  <Image
                    src={event.image}
                    alt={event.imageAltCs}
                    className="w-full h-full object-cover rounded-xl"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-3 sm:gap-4 items-start">
                  {event.dateCs || event.date ? (
                    <p className="text-sm text-gray-500 mt-4 sm:mt-8">
                      {event.dateCs ?? event.date}
                    </p>
                  ) : null}
                  <p
                    className={`text-2xl font-medium sm:text-3xl max-w-11/12 ${
                      event.dateCs || event.date ? "" : "mt-4 sm:mt-8"
                    }`}
                  >
                    {event.titleCs}
                  </p>
                  {event.descriptionCs ? (
                    <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                      {event.descriptionCs}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      <footer className="mt-24 sm:mt-32">
        <p className="text-center mb-6">
          Máte jakékoliv dotazy, připomínky, nebo nápady na DigiPřítele?
          <br />
          Kontaktujte mě přes odkazy níže:
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://x.com/olivercingl"
            target="_blank"
            aria-label="Twitter profil"
          >
            <Image
              src="/icons/twitter-x.svg"
              alt="Twitter"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a
            href="https://linkedin.com/in/olivercingl"
            target="_blank"
            aria-label="Linkedin profil"
          >
            <Image
              src="/icons/linkedin.svg"
              alt="LinkedIn"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a
            href="mailto:oliver.cingl@gmail.com"
            target="_blank"
            aria-label="E-mail"
          >
            <Image
              src="/icons/mail.svg"
              alt="E-mail"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="tel:+420776781248" target="_blank" aria-label="Telefon">
            <Image
              src="/icons/phone.svg"
              alt="Telefon"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
        </div>
        <h6 className="py-6 text-center text-black">
          © {new Date().getFullYear()} GrowByte
        </h6>
      </footer>
    </>
  );
}
