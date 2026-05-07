import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHomeDictionary, resolveSkillHref } from "@/app/home/dictionary";
import { LanguageSwitcher } from "@/app/solutions/[locale]/language-switcher";
import { isLocale, LOCALES, type Locale } from "@/app/solutions/data";
import { SITE_URL } from "@/app/case-studies/site";

type Params = { locale: string };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const typed = locale as Locale;
  const dict = getHomeDictionary(typed);
  const languages = LOCALES.reduce<Record<string, string>>((acc, l) => {
    acc[l] = `${SITE_URL}/${l}`;
    return acc;
  }, {});
  languages["x-default"] = `${SITE_URL}/en`;

  return {
    title: dict.metadataTitle,
    description: dict.metadataDescription,
    alternates: {
      canonical: `${SITE_URL}/${typed}`,
      languages,
    },
    openGraph: {
      title: dict.metadataTitle,
      description: dict.metadataDescription,
      url: `${SITE_URL}/${typed}`,
      locale: typed,
      alternateLocale: LOCALES.filter((l) => l !== typed),
      type: "website",
    },
  };
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dict = getHomeDictionary(typedLocale);

  const switcherAlternates = LOCALES.reduce<Partial<Record<Locale, string>>>(
    (acc, l) => {
      acc[l] = `/${l}`;
      return acc;
    },
    {},
  );

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="sm:px-[10vw] md:px-[20vw] lg:px-[30vw] xl:px-[30vw] 2xl:px-[35vw]">
        <div className="flex justify-end pb-6 pt-2">
          <LanguageSwitcher
            currentLocale={typedLocale}
            alternates={switcherAlternates}
          />
        </div>

        <div className="flex w-full justify-center items-center pt-8 pb-6">
          <div className="w-48 h-48 bg-primary rounded-full"></div>
        </div>
        <div className="flex w-full justify-center items-center tracking-[-0.075em] pb-0.5">
          <h1 className="text-7xl font-black text-black">grow</h1>
          <span className="text-7xl font-black italic text-primary -ml-1.25">byte</span>
        </div>
        <p className="text-center text-black text-opacity-80 text-lg font-light ml-16">
          {dict.taglineLead}
          <span className="font-semibold text-primary">{dict.taglineEmphasis}</span>
          {dict.taglineTail}
        </p>
        <h2 className="text-3xl font-semibold text-center pt-24 pb-12 text-black">
          {dict.sectionHeading}
        </h2>
        <section className="w-full flex flex-col justify-center gap-20">
          {dict.skills.map((skill) => {
            const href = resolveSkillHref(skill.link, typedLocale);
            const opensNewTab =
              skill.link.type === "external" || skill.link.type === "webovka";

            return (
              <div key={skill.title} className="flex flex-col gap-2">
                <Image
                  src={`/images/${skill.image}`}
                  alt={skill.alt}
                  className="w-full rounded-xl"
                  width={1000}
                  height={1000}
                />
                <h3 className="text-black font-bold text-lg mt-2">{skill.title}</h3>
                <p className="text-black text-opacity-75 pb-1">{skill.description}</p>
                <Link
                  href={href}
                  {...(opensNewTab
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="font-semibold bg-black text-white cursor-pointer rounded-lg px-4 py-1.5 inline-block">
                    {dict.findOutMore}
                  </span>
                </Link>
              </div>
            );
          })}
        </section>

        <footer>
          <div className="flex justify-center gap-4 pt-16">
            <a href="https://x.com/olivercingl" target="_blank" aria-label="Twitter profile">
              <Image
                src="/icons/twitter-x.svg"
                alt="Twitter"
                className="w-8 h-8 hover:opacity-100 transition-opacity"
                width={32}
                height={32}
              />
            </a>
            <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Linkedin profile">
              <Image
                src="/icons/linkedin.svg"
                alt="LinkedIn"
                className="w-8 h-8 hover:opacity-100 transition-opacity"
                width={32}
                height={32}
              />
            </a>
            <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="Email">
              <Image
                src="/icons/mail.svg"
                alt="Email"
                className="w-8 h-8 hover:opacity-100 transition-opacity"
                width={32}
                height={32}
              />
            </a>
            <a href="tel:+420776781248" target="_blank" aria-label="Phone">
              <Image
                src="/icons/phone.svg"
                alt="Phone"
                className="w-8 h-8 hover:opacity-100 transition-opacity"
                width={32}
                height={32}
              />
            </a>
          </div>
          <div className="flex justify-center pt-8 pb-2">
            <LanguageSwitcher
              currentLocale={typedLocale}
              alternates={switcherAlternates}
            />
          </div>
          <h6 className="py-6 text-center text-black">
            © {new Date().getFullYear()} GrowByte
          </h6>
        </footer>
      </div>
    </div>
  );
}
