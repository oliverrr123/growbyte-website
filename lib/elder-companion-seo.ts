import type { Metadata } from "next";
import type { Locale } from "@/app/solutions/data";

export const GROWBYTE_ORIGIN = "https://growbyte.co";
export const DIGIPRITEL_ORIGIN = "https://digipritel.cz";
export const TRYMYFRIEND_ORIGIN = "https://trymyfriend.com";
export const MYFRIEND_JP_ORIGIN = "https://myfriend.jp";

export const ELDER_COMPANION_CANONICALS: Record<Locale, string> = {
  cs: DIGIPRITEL_ORIGIN,
  en: TRYMYFRIEND_ORIGIN,
  sk: `${GROWBYTE_ORIGIN}/digipriatel`,
  ja: MYFRIEND_JP_ORIGIN,
};

export const ELDER_COMPANION_MORE_CANONICALS: Record<Locale, string> = {
  cs: `${DIGIPRITEL_ORIGIN}/vice`,
  en: `${TRYMYFRIEND_ORIGIN}/more`,
  sk: `${GROWBYTE_ORIGIN}/digipriatel/viac`,
  ja: `${MYFRIEND_JP_ORIGIN}/more`,
};

export const ELDER_COMPANION_EVENTS_CANONICALS: Record<"cs" | "en" | "ja", string> = {
  cs: `${DIGIPRITEL_ORIGIN}/udalosti`,
  en: `${TRYMYFRIEND_ORIGIN}/events`,
  ja: `${MYFRIEND_JP_ORIGIN}/events`,
};

/** @deprecated Use ELDER_COMPANION_EVENTS_CANONICALS.en */
export const ELDER_COMPANION_EVENTS_CANONICAL =
  ELDER_COMPANION_EVENTS_CANONICALS.en;

export const ELDER_COMPANION_ALTERNATES: Record<string, string> = {
  cs: ELDER_COMPANION_CANONICALS.cs,
  en: ELDER_COMPANION_CANONICALS.en,
  sk: ELDER_COMPANION_CANONICALS.sk,
  ja: ELDER_COMPANION_CANONICALS.ja,
  "x-default": ELDER_COMPANION_CANONICALS.en,
};

export const ELDER_COMPANION_MORE_ALTERNATES: Record<string, string> = {
  cs: ELDER_COMPANION_MORE_CANONICALS.cs,
  en: ELDER_COMPANION_MORE_CANONICALS.en,
  sk: ELDER_COMPANION_MORE_CANONICALS.sk,
  ja: ELDER_COMPANION_MORE_CANONICALS.ja,
  "x-default": ELDER_COMPANION_MORE_CANONICALS.en,
};

export const ELDER_COMPANION_EVENTS_ALTERNATES: Record<string, string> = {
  cs: ELDER_COMPANION_EVENTS_CANONICALS.cs,
  en: ELDER_COMPANION_EVENTS_CANONICALS.en,
  ja: ELDER_COMPANION_EVENTS_CANONICALS.ja,
  "x-default": ELDER_COMPANION_EVENTS_CANONICALS.en,
};

export const ELDER_COMPANION_IMAGE = `${GROWBYTE_ORIGIN}/images/robo-companion/robo-companion.png`;
export const DIGIPRITEL_BANNER_IMAGE = `${GROWBYTE_ORIGIN}/images/robo-companion/digipritel-banner.png`;
export const MYFRIEND_BANNER_IMAGE = `${GROWBYTE_ORIGIN}/images/robo-companion/myfriend-banner.jpg`;

export const DIGIPRITEL_FAQS = [
  {
    question: "Co je DigiPřítel?",
    answer:
      "DigiPřítel je telefonní AI společník pro seniory. Po aktivaci mu můžete 24/7 zavolat, popovídat si, získat pomoc s běžnými otázkami nebo si nastavit připomínky. Noví uživatelé začínají úvodním hovorem a předplatné stojí 300 Kč měsíčně. Stávající bezplatní uživatelé zůstávají zdarma.",
  },
  {
    question: "Komu DigiPřítel pomáhá?",
    answer:
      "DigiPřítel je určený hlavně seniorům, kteří tráví hodně času o samotě, mají méně pravidelný kontakt s rodinou nebo potřebují jednoduchou oporu během dne. Využívat ho ale samozřejmě může kdokoliv. Já (autor) ho také využívám např. na připomínky ;)",
  },
  {
    question: "Je k používání potřeba chytrý telefon nebo internet?",
    answer:
      "Ne. DigiPřítel funguje přes běžný telefonní hovor, takže senior nepotřebuje chytrý telefon, aplikaci ani internetové připojení.",
  },
  {
    question: "S čím umí DigiPřítel pomoci?",
    answer:
      "DigiPřítel nabízí přátelskou konverzaci, připomíná důležité věci, pomáhá s běžnými otázkami doma a podporuje lehký pohyb, mentální aktivity a pravidelný režim.",
  },
  {
    question: "Kolik to stojí?",
    answer:
      "Pro nové uživatele stojí DigiPřítel 300 Kč měsíčně. Začněte úvodním hovorem a pak použijte kód z hovoru na digipritel.cz/start k dokončení platby. Předplatné se obnovuje každý měsíc do zrušení. Stávající bezplatní uživatelé zůstávají zdarma. Hovorné se řídí tarifem vašeho operátora.",
  },
  {
    question: "Jak mohu vyzkoušet DigiPřítele?",
    answer:
      "Zavolejte na +420 910 920 500. DigiPřítel se představí, zeptá se, pro koho službu hledáte, a předá vám čtyřmístný kód pro dokončení platby na digipritel.cz/start.",
  },
  {
    question: "Kdo vytvořil DigiPřítele?",
    answer:
      "DigiPřítele vytvořil středoškolský student Oliver Cingl ve spolupráci se seniorem Zdeňkem Svobodou, který pořádá workshopy a přednášky pro seniory, většinou na téma mentálního zdraví.",
  },
];

export const MYFRIEND_FAQS = [
  {
    question: "What is MyFriend?",
    answer:
      "MyFriend is an AI phone companion for seniors. A senior can call its phone number 24/7 and simply chat, get help with different problems, or set reminders for important events such as taking medication.",
  },
  {
    question: "Who does MyFriend help?",
    answer:
      "MyFriend is mainly designed for seniors who spend a lot of time alone, have less regular contact with family, or need simple support during the day. Of course, anyone can use it. I, the author, also use it for reminders.",
  },
  {
    question: "Do seniors need a smartphone or internet connection?",
    answer:
      "No. MyFriend works through a regular phone call, so a senior does not need a smartphone, an app, or an internet connection.",
  },
  {
    question: "What can MyFriend help with?",
    answer:
      "MyFriend offers friendly conversation, reminds seniors about important things, helps with everyday questions at home, and supports light movement, mental activities, and a regular routine.",
  },
  {
    question: "How much does it cost?",
    answer:
      "MyFriend is $25 per month. If you come from a background that cannot afford that, you can request need-based access by contacting me.",
  },
  {
    question: "How do I get MyFriend?",
    answer:
      "Call MyFriend at +1 949 676 7670 to get to know each other and talk about who it is for. Then open trymyfriend.com/call, tap “I have a code”, enter the four-digit code from your call, and subscribe for $25/month. Verify your phone number to finish setup. If it is for a loved one, you can add their number too.",
    link: { href: "#get-myfriend", label: "Call, then enter your code" },
  },
  {
    question: "Who created MyFriend?",
    answer:
      "MyFriend was created by high school student Oliver Cingl in cooperation with senior Zdeněk Svoboda, who organizes workshops and talks for seniors, mostly focused on mental health.",
  },
];

export const MYFRIEND_JA_FAQS = [
  {
    question: "MyFriendとは何ですか？",
    answer:
      "MyFriendはシニア向けのAI電話コンパニオンです。専用番号に24時間無料で電話でき、雑談したり、困りごとの相談をしたり、服薬などの大切な予定のリマインダーを設定できます。",
  },
  {
    question: "誰のためのサービスですか？",
    answer:
      "主に、一人で過ごす時間が長い、家族との連絡が減っている、日中ちょっとした支えがほしいシニア向けです。もちろん誰でも使えます。作者の私もリマインダーなどに使っています。",
  },
  {
    question: "スマホやインターネットは必要ですか？",
    answer:
      "いいえ。MyFriendは通常の電話で動くので、スマホもアプリもインターネットも不要です。",
  },
  {
    question: "何を手伝ってくれますか？",
    answer:
      "フレンドリーな会話、大切なことのリマインダー、家での日常の質問へのサポート、軽い運動や頭の体操、規則正しい生活の後押しなどです。",
  },
  {
    question: "料金はいくらですか？",
    answer:
      "現在は無料です。いまはテストと改善のフェーズだからです。将来はサブスクリプションになる予定ですが、その前にすべてのユーザーへ事前にお知らせします。",
  },
  {
    question: "どうやって試せますか？",
    answer:
      "いつでも無料でお電話ください。米国は +1 234 603 6167、ヨーロッパ / チェコは +420 910 920 500 です。",
  },
  {
    question: "誰が作りましたか？",
    answer:
      "高校生の Oliver Cingl が、主にメンタルヘルスをテーマにシニア向けワークショップや講演を行うシニアの Zdeněk Svoboda さんと協力して作りました。",
  },
];

export const DIGIPRIATEL_FAQS = [
  {
    question: "Čo je DigiPriateľ?",
    answer:
      "DigiPriateľ je telefonický AI spoločník pre seniorov. Senior mu môže 24/7 zadarmo zavolať na jeho telefónne číslo a len tak sa porozprávať, získať pomoc s rôznymi problémami alebo si nastaviť pripomienky na dôležité udalosti, napríklad užívanie liekov.",
  },
  {
    question: "Komu DigiPriateľ pomáha?",
    answer:
      "DigiPriateľ je určený hlavne seniorom, ktorí trávia veľa času osamote, majú menej pravidelný kontakt s rodinou alebo potrebujú jednoduchú oporu počas dňa. Využívať ho však môže, samozrejme, ktokoľvek. Ja, autor, ho tiež používam napríklad na pripomienky.",
  },
  {
    question: "Je na používanie potrebný smartfón alebo internet?",
    answer:
      "Nie. DigiPriateľ funguje cez bežný telefonický hovor, takže senior nepotrebuje smartfón, aplikáciu ani internetové pripojenie.",
  },
  {
    question: "S čím vie DigiPriateľ pomôcť?",
    answer:
      "DigiPriateľ ponúka priateľský rozhovor, pripomína dôležité veci, pomáha s bežnými otázkami doma a podporuje ľahký pohyb, mentálne aktivity a pravidelný režim.",
  },
  {
    question: "Koľko to stojí?",
    answer:
      "DigiPriateľ je zadarmo. Ako je to možné? Súčasná fáza projektu je zameraná na testovanie a zlepšovanie. V budúcnosti bude fungovať na základe predplatného, ale skôr než sa tak stane, všetci používatelia budú vopred informovaní.",
  },
  {
    question: "Ako môžem vyskúšať DigiPriateľa?",
    answer:
      "Zavolajte kedykoľvek zadarmo na telefónne číslo +420 910 920 500.",
  },
  {
    question: "Kto vytvoril DigiPriateľa?",
    answer:
      "DigiPriateľa vytvoril stredoškolský študent Oliver Cingl v spolupráci so seniorom Zdeňkom Svobodom, ktorý organizuje workshopy a prednášky pre seniorov, väčšinou na tému mentálneho zdravia.",
  },
];

export function normalizeHost(host: string | null): string {
  return (host ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
}

export function requestHostFromHeaders(headers: Pick<Headers, "get">): string {
  return normalizeHost(
    headers.get("x-forwarded-host") ??
      headers.get("host") ??
      headers.get("x-forwarded-server"),
  );
}

export function isDigipritelHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return normalized === "digipritel.cz" || normalized === "www.digipritel.cz";
}

export function isDigipritelComHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return normalized === "digipritel.com" || normalized === "www.digipritel.com";
}

export function isGrowbyteHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return normalized === "growbyte.co" || normalized === "www.growbyte.co";
}

export function isTryMyFriendHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return (
    normalized === "trymyfriend.com" || normalized === "www.trymyfriend.com" ||
    normalized === "testing.trymyfriend.com"
  );
}

export function isMyFriendJpHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return normalized === "myfriend.jp" || normalized === "www.myfriend.jp";
}

export function elderCompanionMetadata({
  locale,
  title,
  description,
  canonical,
  alternates,
  ogImage,
}: {
  locale: string;
  title: string;
  description: string;
  canonical: string;
  alternates: Record<string, string>;
  ogImage?: { url: string; width: number; height: number };
}): Metadata {
  const image = ogImage ?? { url: ELDER_COMPANION_IMAGE, width: 1000, height: 1000 };
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName:
        locale === "cs"
          ? "DigiPřítel"
          : locale === "ja" || locale === "en"
            ? "MyFriend"
            : "GrowByte",
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: title,
        },
      ],
      locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function elderCompanionJsonLd({
  name,
  description,
  url,
  inLanguage,
}: {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        name,
        url,
        inLanguage,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name,
        description,
        url,
        image: ELDER_COMPANION_IMAGE,
        applicationCategory: "HealthApplication",
        operatingSystem: "Phone",
        inLanguage,
      },
      {
        "@type": "Organization",
        "@id": `${GROWBYTE_ORIGIN}#organization`,
        name: "GrowByte",
        url: GROWBYTE_ORIGIN,
      },
    ],
  };
}

export function faqJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
