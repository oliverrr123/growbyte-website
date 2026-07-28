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
  /** Webovka marketing site — path segment en/cs/sk; JA uses English */
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
      "MyFriend is an AI companion for seniors through a regular phone call. It helps with loneliness, important reminders and everyday support without requiring a smartphone, app or internet.",
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
          "DigiPřítel je AI společník pro seniory přes běžný telefonní hovor. Pomáhá proti samotě, připomíná důležité věci a nabízí oporu bez nutnosti chytrého telefonu, aplikace nebo internetu.",
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
          "DigiPriateľ je AI spoločník pre seniorov cez bežný telefonický hovor. Pomáha proti samote, pripomína dôležité veci a ponúka oporu bez potreby smartfónu, aplikácie alebo internetu.",
        image: "gradient-3.jpg",
        alt: "AI spoločník pre seniorov DigiPriateľ",
        link: { type: "elder-companion" },
      },
    ],
  },
  ja: {
    metadataTitle: "GrowByte",
    metadataDescription:
      "AIで収益を伸ばす — オーダーメイド自動化、ウェブサイト、シニア向けMyFriendなどのプロダクト。",
    taglineLead: "~ ",
    taglineEmphasis: "AI",
    taglineTail: " で、もっと稼げるように",
    sectionHeading: "何を作っているか？",
    findOutMore: "詳しく見る",
    skills: [
      {
        title: "オーダーメイドソリューション",
        description:
          "自動化して時間を節約し、売上を伸ばしましょう。ビジネスプロセスを自動化する、あなた向けのソリューションを構築します。",
        image: "gradient-1.jpg",
        alt: "企業向け自動化とオーダーメイドソリューション",
        link: { type: "solutions" },
      },
      {
        title: "ウェブサイト",
        description:
          "シンプルな紹介サイトから複雑なSaaSアプリまで — どちらもお任せください。",
        image: "gradient-2.jpg",
        alt: "ウェブサイトとWebアプリケーション",
        link: { type: "webovka" },
      },
      {
        title: "シニア向けコンパニオン",
        description:
          "MyFriendは、通常の電話で使えるシニア向けAIコンパニオンです。孤独感の軽減、大切なリマインダー、日常のサポートを、スマホ・アプリ・インターネットなしで提供します。",
        image: "gradient-3.jpg",
        alt: "シニア向けAIコンパニオン MyFriend",
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
