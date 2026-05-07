import type { Locale } from "../solutions/data";
import { elderCompanionPath } from "@/lib/elder-companion-paths";
import { webovkaHomeUrl } from "@/lib/webovka-url";

/** How the primary CTA on a card resolves */
export type HomeSkillLink =
  | { type: "solutions" }
  | { type: "external"; href: string }
  | { type: "internal"; path: string }
  /** MyFriend / DigiPřítel landing — URL slug depends on locale */
  | { type: "elder-companion" }
  /** Webovka marketing site — path segment en/cs/sk; DE uses English */
  | { type: "webovka" };

export type HomeSkill = {
  title: string;
  description: string;
  image: string;
  alt: string;
  link: HomeSkillLink;
};

export type HomeDictionary = {
  metadataTitle: string;
  metadataDescription: string;
  /** Text before the emphasized word (e.g. AI / KI) */
  taglineLead: string;
  /** Highlighted acronym / word */
  taglineEmphasis: string;
  /** Text after emphasis (often empty) */
  taglineTail: string;
  sectionHeading: string;
  findOutMore: string;
  skills: [HomeSkill, HomeSkill, HomeSkill];
};

const SKILLS_EN: [HomeSkill, HomeSkill, HomeSkill] = [
  {
    title: "Custom solutions",
    description:
      "Automate, save time and make more money with us. We build tailored solutions that automate your business processes.",
    image: "gradient-1.jpg",
    alt: "Custom automation and business solutions",
    link: { type: "solutions" },
  },
  {
    title: "Websites",
    description:
      "Whether it's a simple presentation website or a complex SaaS application — we've got you covered.",
    image: "gradient-2.jpg",
    alt: "Websites and web applications",
    link: { type: "webovka" },
  },
  {
    title: "Companion for elderly",
    description:
      "MyFriend is an AI companion for seniors living alone. It's a phone number they can call at any time — help with daily tasks and better wellbeing through conversation and support.",
    image: "gradient-3.jpg",
    alt: "AI companion for seniors",
    link: { type: "elder-companion" },
  },
];

export const HOME_DICTIONARIES: Record<Locale, HomeDictionary> = {
  en: {
    metadataTitle: "GrowByte",
    metadataDescription:
      "Making you more money with AI — custom automation, websites, and products like MyFriend for seniors.",
    taglineLead: "~ Making you more money with ",
    taglineEmphasis: "AI",
    taglineTail: "",
    sectionHeading: "What do we build?",
    findOutMore: "Find out more",
    skills: SKILLS_EN,
  },
  cs: {
    metadataTitle: "GrowByte",
    metadataDescription:
      "Víc peněz díky AI — automatizace na míru, weby a produkty jako MyFriend pro seniory.",
    taglineLead: "~ Víc času a peněz díky ",
    taglineEmphasis: "AI",
    taglineTail: "",
    sectionHeading: "Co děláme?",
    findOutMore: "Zjistit víc",
    skills: [
      {
        title: "Řešení na míru",
        description:
          "Automatizujte, šetřete čas a vydělávejte víc. Stavíme řešení na míru, která zautomatizují procesy ve Vaší firmě.",
        image: "gradient-1.jpg",
        alt: "Automatizace a řešení na míru pro firmy",
        link: { type: "solutions" },
      },
      {
        title: "Weby",
        description:
          "Jednoduchý prezentační web nebo komplexní SaaS aplikace? Poradíme si se vším.",
        image: "gradient-2.jpg",
        alt: "Tvorba webů a webových aplikací",
        link: { type: "webovka" },
      },
      {
        title: "Společník pro seniory",
        description:
          "DigiPřítel je AI společník pro seniory žijící o samotě. Je to telefonní číslo, na které mohou kdykoliv zavolat a jen tak si popovídat, nebo dostat praktickou pomoc jako například připomenutí léků.",
        image: "gradient-3.jpg",
        alt: "AI společník pro seniory DigiPřítel",
        link: { type: "elder-companion" },
      },
    ],
  },
  sk: {
    metadataTitle: "GrowByte",
    metadataDescription:
      "Viac peňazí vďaka AI — automatizácia na mieru, weby a produkty ako DigiPriateľ pre seniorov.",
    taglineLead: "~ Viac času a peňazí vďaka ",
    taglineEmphasis: "AI",
    taglineTail: "",
    sectionHeading: "Čo budujeme?",
    findOutMore: "Zistiť viac",
    skills: [
      {
        title: "Riešenia na mieru",
        description:
          "Automatizujte, šetrite čas a zarábajte viac. Stavíme riešenia na mieru, ktoré zautomatizujú procesy vo Vašej firme.",
        image: "gradient-1.jpg",
        alt: "Automatizácia a riešenia na mieru pre firmy",
        link: { type: "solutions" },
      },
      {
        title: "Weby",
        description:
          "Jednoduchý prezentačný web alebo komplexná SaaS aplikácia? Poradíme si so všetkým.",
        image: "gradient-2.jpg",
        alt: "Tvorba webov a webových aplikácií",
        link: { type: "webovka" },
      },
      {
        title: "Spoločník pre seniorov",
        description:
          "DigiPriateľ je AI spoločník pre seniorov, ktorí žijú sami. Je to telefónne číslo, na ktoré môžu kedykoľvek zavolať a len tak sa porozprávať, alebo získať praktickú pomoc ako napríklad pripomenutie liekov.",
        image: "gradient-3.jpg",
        alt: "AI spoločník pre seniorov DigiPriateľ",
        link: { type: "elder-companion" },
      },
    ],
  },
  de: {
    metadataTitle: "GrowByte",
    metadataDescription:
      "Mehr Geld verdienen mit KI — maßgeschneiderte Automatisierung, Websites und Produkte wie DigiFreund für Senioren.",
    taglineLead: "~ Mit ",
    taglineEmphasis: "KI",
    taglineTail: " mehr Geld verdienen",
    sectionHeading: "Was bauen wir?",
    findOutMore: "Mehr erfahren",
    skills: [
      {
        title: "Individual-Lösungen",
        description:
          "Automatisieren, Zeit sparen und mehr verdienen. Wir entwickeln passgenaue Automatisierung für deine Geschäftsprozesse.",
        image: "gradient-1.jpg",
        alt: "Automatisierung und maßgeschneiderte Lösungen für Unternehmen",
        link: { type: "solutions" },
      },
      {
        title: "Websites",
        description:
          "Ob einfache Präsentationsseite oder komplexe SaaS-Anwendung — wir können beides.",
        image: "gradient-2.jpg",
        alt: "Websites und Webanwendungen",
        link: { type: "webovka" },
      },
      {
        title: "Begleiter für Senioren",
        description:
          "DigiFreund ist ein KI-Begleiter für allein lebende Senioren — eine Rufnummer, die sie jederzeit anrufen können, Unterstützung im Alltag und mehr Wohlbefinden durch Gespräch und Betreuung.",
        image: "gradient-3.jpg",
        alt: "KI-Begleiter für Senioren DigiFreund",
        link: { type: "elder-companion" },
      },
    ],
  },
};

export function getHomeDictionary(locale: Locale): HomeDictionary {
  return HOME_DICTIONARIES[locale];
}

export function resolveSkillHref(skill: HomeSkill["link"], locale: Locale): string {
  switch (skill.type) {
    case "solutions":
      return `/solutions/${locale}`;
    case "external":
      return skill.href;
    case "internal":
      return skill.path;
    case "elder-companion":
      return elderCompanionPath(locale);
    case "webovka":
      return webovkaHomeUrl(locale);
    default:
      return "/";
  }
}
