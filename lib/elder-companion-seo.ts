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

/** German DigiFreund product (outside GrowByte site locales). */
export const DIGIFREUND_CANONICAL = `${GROWBYTE_ORIGIN}/digifreund`;
export const DIGIFREUND_MORE_CANONICAL = `${GROWBYTE_ORIGIN}/digifreund/more`;

export const ELDER_COMPANION_MORE_CANONICALS: Record<Locale, string> = {
  cs: `${DIGIPRITEL_ORIGIN}/vice`,
  en: `${TRYMYFRIEND_ORIGIN}/more`,
  sk: `${GROWBYTE_ORIGIN}/digipriatel/viac`,
  ja: `${MYFRIEND_JP_ORIGIN}/more`,
};

export const ELDER_COMPANION_EVENTS_CANONICALS: Record<"cs" | "en", string> = {
  cs: `${DIGIPRITEL_ORIGIN}/udalosti`,
  en: `${TRYMYFRIEND_ORIGIN}/events`,
};

/** @deprecated Use ELDER_COMPANION_EVENTS_CANONICALS.en */
export const ELDER_COMPANION_EVENTS_CANONICAL =
  ELDER_COMPANION_EVENTS_CANONICALS.en;

export const ELDER_COMPANION_ALTERNATES: Record<string, string> = {
  cs: ELDER_COMPANION_CANONICALS.cs,
  en: ELDER_COMPANION_CANONICALS.en,
  sk: ELDER_COMPANION_CANONICALS.sk,
  ja: ELDER_COMPANION_CANONICALS.ja,
  // Keep DigiFreund in hreflang even though GrowByte site locale is no longer `de`.
  de: DIGIFREUND_CANONICAL,
  "x-default": ELDER_COMPANION_CANONICALS.en,
};

export const ELDER_COMPANION_MORE_ALTERNATES: Record<string, string> = {
  cs: ELDER_COMPANION_MORE_CANONICALS.cs,
  en: ELDER_COMPANION_MORE_CANONICALS.en,
  sk: ELDER_COMPANION_MORE_CANONICALS.sk,
  ja: ELDER_COMPANION_MORE_CANONICALS.ja,
  de: DIGIFREUND_MORE_CANONICAL,
  "x-default": ELDER_COMPANION_MORE_CANONICALS.en,
};

export const ELDER_COMPANION_EVENTS_ALTERNATES: Record<string, string> = {
  cs: ELDER_COMPANION_EVENTS_CANONICALS.cs,
  en: ELDER_COMPANION_EVENTS_CANONICALS.en,
  "x-default": ELDER_COMPANION_EVENTS_CANONICALS.en,
};

export const ELDER_COMPANION_IMAGE = `${GROWBYTE_ORIGIN}/images/robo-companion/robo-companion.png`;
export const DIGIPRITEL_BANNER_IMAGE = `${GROWBYTE_ORIGIN}/images/robo-companion/digipritel-banner.png`;
export const MYFRIEND_BANNER_IMAGE = `${GROWBYTE_ORIGIN}/images/robo-companion/myfriend-banner.jpg`;

export const DIGIPRITEL_FAQS = [
  {
    question: "Co je DigiPřítel?",
    answer:
      "DigiPřítel je telefonní AI společník pro seniory. Senior mu může 24/7 zdarma zavolat na jeho telefonní číslo a jen tak si s ním popovídat, získat pomoc s různými problémy, nebo si nastavit připomínky na důležité události, jako je braní léků.",
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
      "DigiPřítel je zdarma. Jakto? Nynější fáze projektu je zaměřena na testování a vylepšování. V budoucnu bude fungovat na základě předplatného, ale než se tak stane, všichni uživatelé budou předem informováni.",
  },
  {
    question: "Jak mohu vyzkoušet DigiPřítele?",
    answer:
      "Zavolejte kdykoliv zdarma na telefonní číslo +420 910 920 500.",
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
      "MyFriend is an AI phone companion for seniors. A senior can call its phone number 24/7 for free and simply chat, get help with different problems, or set reminders for important events such as taking medication.",
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
      "MyFriend is free. Why? The current phase of the project is focused on testing and improving it. In the future it will work as a subscription, but before that happens, all users will be informed in advance.",
  },
  {
    question: "How can I try MyFriend?",
    answer:
      "Call anytime for free. In the US, use +1 234 603 6167. In Europe or Czechia, use +420 910 920 500.",
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

export const DIGIFREUND_FAQS = [
  {
    question: "Was ist DigiFreund?",
    answer:
      "DigiFreund ist ein KI-Telefonbegleiter für Senioren. Eine ältere Person kann seine Telefonnummer rund um die Uhr kostenlos anrufen, einfach plaudern, Hilfe bei verschiedenen Problemen bekommen oder Erinnerungen an wichtige Ereignisse wie die Medikamenteneinnahme einstellen.",
  },
  {
    question: "Wem hilft DigiFreund?",
    answer:
      "DigiFreund richtet sich vor allem an Senioren, die viel Zeit allein verbringen, weniger regelmäßigen Kontakt zur Familie haben oder tagsüber einfache Unterstützung brauchen. Natürlich kann ihn aber jeder nutzen. Ich, der Autor, nutze ihn zum Beispiel auch für Erinnerungen.",
  },
  {
    question: "Braucht man ein Smartphone oder Internet?",
    answer:
      "Nein. DigiFreund funktioniert über einen normalen Telefonanruf, daher braucht die ältere Person kein Smartphone, keine App und keine Internetverbindung.",
  },
  {
    question: "Wobei kann DigiFreund helfen?",
    answer:
      "DigiFreund bietet freundliche Gespräche, erinnert an wichtige Dinge, hilft bei Alltagsfragen zu Hause und unterstützt leichte Bewegung, mentale Aktivitäten und eine regelmäßige Routine.",
  },
  {
    question: "Wie viel kostet es?",
    answer:
      "DigiFreund ist kostenlos. Warum? Die aktuelle Projektphase konzentriert sich auf Tests und Verbesserungen. In Zukunft wird DigiFreund auf Basis eines Abonnements funktionieren, aber bevor das passiert, werden alle Nutzer vorab informiert.",
  },
  {
    question: "Wie kann ich DigiFreund ausprobieren?",
    answer:
      "Rufen Sie jederzeit kostenlos die Telefonnummer +420 910 920 500 an.",
  },
  {
    question: "Wer hat DigiFreund entwickelt?",
    answer:
      "DigiFreund wurde vom Gymnasiasten Oliver Cingl in Zusammenarbeit mit dem Senior Zdeněk Svoboda entwickelt, der Workshops und Vorträge für Senioren organisiert, meistens zum Thema mentale Gesundheit.",
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
    normalized === "trymyfriend.com" || normalized === "www.trymyfriend.com"
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

export function faqJsonLd(faqs: typeof DIGIPRITEL_FAQS) {
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
