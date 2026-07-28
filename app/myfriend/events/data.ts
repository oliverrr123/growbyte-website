export type MyFriendEvent = {
  id: string;
  title: string;
  description?: string;
  /** Czech title (DigiPřítel) */
  titleCs: string;
  /** Czech description */
  descriptionCs?: string;
  /** Japanese title (myfriend.jp) */
  titleJa: string;
  /** Japanese description */
  descriptionJa?: string;
  image: string;
  imageAlt: string;
  imageAltCs: string;
  imageAltJa: string;
  /** Optional display date, e.g. "March 12, 2026" */
  date?: string;
  /** Czech display date, e.g. "25. 6. 2026" */
  dateCs?: string;
  /** Japanese display date, e.g. "2026年6月25日" */
  dateJa?: string;
};

/** Add MyFriend / DigiPřítel events here — EN + CS + JA copy. */
export const EVENTS: MyFriendEvent[] = [
  {
    id: "buena-vista-manor-house",
    title: "MyFriend showcase at a senior care home in San Francisco",
    description:
      "Second showcase of MyFriend in the US, this one was pretty quick, since they had a tight schedule, but the people there were very excited about it! One lady there was from the Czech Republic too, so we got to chat in Czech for a bit.",
    titleCs: "Představení DigiPřítele v domově seniorů v San Franciscu",
    descriptionCs:
      "Druhé představení DigiPřítele v USA. Bylo to poměrně krátké, protože měli nabitý program, ale lidé tam z toho byli opravdu nadšení! Jedna paní byla také z České republiky, tak jsme si chvíli popovídali česky.",
    titleJa: "サンフランシスコの介護施設でのMyFriend紹介",
    descriptionJa:
      "アメリカでの2回目の紹介。スケジュールが詰まっていたので短めでしたが、みなさんとてもワクワクしていました！チェコ出身の方もいて、少しチェコ語で話せました。",
    image: "/images/robo-companion/buena-vista-manor-house.jpg",
    imageAlt: "Buena Vista Manor House event",
    imageAltCs: "Akce v Buena Vista Manor House",
    imageAltJa: "Buena Vista Manor Houseでのイベント",
    date: "Jun 25, 2026",
    dateCs: "25. 6. 2026",
    dateJa: "2026年6月25日",
  },
  {
    id: "zygmunt-arendt-house",
    title: "MyFriend event at a senior care home in San Francisco",
    description:
      "This was the first time getting users in the US! We went to a senior home to present MyFriend and brought some snacks for them. Got to chat with the people there a lot, it was very exciting.",
    titleCs: "Akce DigiPřítele v domově seniorů v San Franciscu",
    descriptionCs:
      "Tohle bylo poprvé, co jsme získali uživatele v USA! Šli jsme do domova seniorů představit DigiPřítele a přinesli jsme jim i nějaké dobroty. Hodně jsme si s lidmi povídali, bylo to skvělé.",
    titleJa: "サンフランシスコの介護施設でのMyFriendイベント",
    descriptionJa:
      "アメリカで初めてユーザーを得た回です！介護施設でMyFriendを紹介し、お菓子も持っていきました。みなさんとたくさん話せて、とてもワクワクしました。",
    image: "/images/robo-companion/zygmunt-arendt-house.jpg",
    imageAlt: "Zygmunt Arendt House event",
    imageAltCs: "Akce v Zygmunt Arendt House",
    imageAltJa: "Zygmunt Arendt Houseでのイベント",
    date: "Jun 24, 2026",
    dateCs: "24. 6. 2026",
    dateJa: "2026年6月24日",
  },
  {
    id: "komunitni-centrum-louka",
    title: "MyFriend showcase at a senior community center in Prague",
    description:
      "This time I went to a senior community center in Prague to present MyFriend, also stayed to help the seniors with some tech and answered their questions about MyFriend.",
    titleCs: "Představení DigiPřítele v komunitním centru pro seniory v Praze",
    descriptionCs:
      "Tentokrát jsem šel do komunitního centra pro seniory v Praze představit DigiPřítele, pak jsem zůstal a pomáhal seniorům s různými tehcnickými problémy a odpovídal na jejich dotazy ohledně DigiPřítele.",
    titleJa: "プラハのシニアコミュニティセンターでのMyFriend紹介",
    descriptionJa:
      "プラハのシニア向けコミュニティセンターでMyFriendを紹介し、その後も残って技術的なサポートやMyFriendについての質問に答えました。",
    image: "/images/robo-companion/komunitni-centrum-louka.jpg",
    imageAlt: "MyFriend showcase at a senior community center in Prague",
    imageAltCs: "Představení DigiPřítele v komunitním centru pro seniory v Praze",
    imageAltJa: "プラハのシニアコミュニティセンターでのMyFriend紹介",
    date: "Jun 11, 2026",
    dateCs: "11. 6. 2026",
    dateJa: "2026年6月11日",
  },
  {
    id: "digipritel-domov-senioru",
    title: "MyFriend event at a senior care home in Prague",
    description:
      "This was the first event focused solely on MyFriend. I came to a senior home to present MyFriend, then stayed to help the seniors individually with some tech problems that they had. There it was one lady's first encounter with AI, she was very excited about it, I was also very excited that thanks to what I've built, someone can access something they previously couldn't (she didn't have a smartphone).",
    titleCs: "Akce DigiPřítele v domově seniorů v Praze",
    descriptionCs:
      "Tohle byla první akce zaměřená výhradně na DigiPřítele. Přišel jsem do domova seniorů představit DigiPřítele a pak jsem zůstal a pomáhal seniorům individuálně s jejich technickými problémy. Pro jednu paní to bylo první setkání s AI, byla z toho nadšená a já taky, protože díky tomu, co jsem postavil, může někdo používat něco, k čemu dřív neměl přístup (neměla chytrý telefon).",
    titleJa: "プラハの介護施設でのMyFriendイベント",
    descriptionJa:
      "MyFriendだけに焦点を当てた初めてのイベントです。介護施設で紹介したあと、一人ひとりの技術的な困りごとにも付き合いしました。ある方にとっては初めてのAI体験で、とても喜んでいました。スマホを持っていない方でも使えるものを作れたことが、自分にとっても嬉しかったです。",
    image: "/images/robo-companion/digipritel-domov-senioru.jpg",
    imageAlt: "MyFriend event at a senior care home in Prague",
    imageAltCs: "Akce DigiPřítele v domově seniorů v Praze",
    imageAltJa: "プラハの介護施設でのMyFriendイベント",
    date: "Jun 8, 2026",
    dateCs: "8. 6. 2026",
    dateJa: "2026年6月8日",
  },
  {
    id: "moudra-sit-senior-event",
    title: "MyFriend showcase at a nonprofit senior event in Prague",
    description:
      "This event was organized by Moudrá síť, there were a lot of presentations for the seniors on how to stay safe online, how to use different apps to their advantage, and I also gave a talk about MyFriend. Then volunteers collectively helped the seniors individually with different tech problems. This was a very heartwarming experience.",
    titleCs: "Představení DigiPřítele na neziskové akci pro seniory v Praze",
    descriptionCs:
      "Tuto akci pořádala Moudrá síť. Na začátek byly prezentace pro seniory o tom, jak zůstat v bezpečí online, jak využívat různé aplikace, a já jsem taky mluvil o DigiPříteli. Pak dobrovolníci společně pomáhali seniorům individuálně s různými technickými problémy. Byl to opravdu milý zážitek.",
    titleJa: "プラハの非営利シニアイベントでのMyFriend紹介",
    descriptionJa:
      "Moudrá síť主催のイベントで、オンラインの安全やアプリの活用についての発表があり、私もMyFriendについて話しました。その後ボランティアと一緒に、シニア一人ひとりの技術的な困りごとに付き合いました。とても温かい体験でした。",
    image: "/images/robo-companion/moudra-sit-senior-event.jpg",
    imageAlt: "MyFriend showcase at a Moudrá síť senior event in Prague",
    imageAltCs: "Představení DigiPřítele na akci Moudré sítě v Praze",
    imageAltJa: "プラハのMoudrá síťシニアイベントでのMyFriend紹介",
    date: "Jun 3, 2026",
    dateCs: "3. 6. 2026",
    dateJa: "2026年6月3日",
  },
  {
    id: "maker-fair-digipritel",
    title: "MyFriend showcase at Maker Faire Prague",
    description:
      "Maker Faire Prague is a yearly conference where builders from the whole country showcase their projects. This year, I attended showcasing MyFriend. This was the first presentation of the working product to the public and it was amazing. So many people came to the booth, many were interested in it and we gave out more than 200 flyers and got 100+ new users and even some collaborations.",
    titleCs: "DigiPřítel na Maker Faire Prague",
    descriptionCs:
      "Maker Faire Prague je každoroční konference, kde tvůrci z celé země ukazují své projekty. Letos jsem tam představil DigiPřítele. Bylo to první veřejné představení funkčního produktu a bylo to úžasné. Ke stánku přišlo spoustu lidí, mnozí měli zájem, rozdali jsme přes 200 letáků, získali jsme přes 100 nových uživatelů a dokonce i nějaké spolupráce.",
    titleJa: "Maker Faire PragueでのMyFriend紹介",
    descriptionJa:
      "Maker Faire Pragueは、全国の作り手がプロジェクトを展示する年次イベントです。今年はMyFriendを出展しました。動くプロダクトの初めての一般公開で、とても素晴らしい体験でした。ブースにはたくさんの方が来て関心を持ち、チラシを200枚以上配り、100人以上の新規ユーザーと、いくつかのコラボも生まれました。",
    image: "/images/robo-companion/maker-faire-digipritel.jpg",
    imageAlt: "MyFriend / DigiPřítel booth at Maker Faire Prague",
    imageAltCs: "Stánek DigiPřítele na Maker Faire Prague",
    imageAltJa: "Maker Faire PragueのMyFriendブース",
    date: "May 9–10, 2026",
    dateCs: "9.–10. 5. 2026",
    dateJa: "2026年5月9–10日",
  },
];
