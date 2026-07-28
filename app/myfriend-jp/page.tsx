import Image from "next/image";
import Link from "next/link";
import { LocalizedHomeLink } from "@/components/localized-home-link";
import {
  ELDER_COMPANION_ALTERNATES,
  ELDER_COMPANION_CANONICALS,
  MYFRIEND_JA_FAQS,
  MYFRIEND_BANNER_IMAGE,
  elderCompanionJsonLd,
  elderCompanionMetadata,
  faqJsonLd,
} from "@/lib/elder-companion-seo";

const title = "MyFriend - シニア向けAI電話コンパニオン";
const description =
  "MyFriendは、会話・日常サポート・服薬リマインダー・やさしいウェルネスの声かけを提供する、シニア向けAI電話コンパニオンです。";

export const metadata = elderCompanionMetadata({
  locale: "ja",
  title,
  description,
  canonical: ELDER_COMPANION_CANONICALS.ja,
  alternates: ELDER_COMPANION_ALTERNATES,
  ogImage: { url: MYFRIEND_BANNER_IMAGE, width: 1200, height: 630 },
});

export default function MaiFurendoLanding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "MyFriend",
              description,
              url: ELDER_COMPANION_CANONICALS.ja,
              inLanguage: "ja",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(MYFRIEND_JA_FAQS)),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <LocalizedHomeLink
          fallbackLocale="ja"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; トップページへ戻る
        </LocalizedHomeLink>
        <div className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <Image
            src="/images/robo-companion/robo-companion.png"
            alt="MyFriend コンパニオンロボット"
            className="rounded-xl w-48 sm:w-64 object-cover"
            width={1000}
            height={1000}
          />
        </div>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">
            my<span className="italic text-orange-400">friend</span>
          </h1>
          <p className="text-black opacity-50">シニア向けコンパニオン</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
          <p className="text-base sm:text-lg leading-relaxed text-gray-800 w-full md:max-w-1/2 md:mx-auto md:text-center mb-32 -mt-8">
            MyFriendは、<strong>通常の電話で使えるシニア向けAIコンパニオン</strong>
            です。孤独感の軽減、大切なことのリマインダー、わかりやすいサポートを、スマホ・アプリ・インターネットなしで提供します。
          </p>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                日本では、<strong>約700万人の高齢者が一人暮らし</strong>
                をしています。家族とほとんど会えない、あるいは全く会えない人も多く、孤独が日常の一部になってしまっています。
              </p>
            </div>
            <div className="w-full md:w-96 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/map.png"
                alt="一人暮らしの高齢者のイメージ"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
          </div>

          <div className="text-center py-6 sm:py-8">
            <p className="text-xl sm:text-2xl font-semibold">
              だから私たちは{" "}
              <span className="caveat-bold-font text-3xl sm:text-4xl">
                my<span className="italic text-orange-500">friend</span>
              </span>
              {" を作りました"}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image
                src="/images/robo-companion/myfriend-talking-to-senior.jpg"
                alt="コンパニオンロボットとの会話"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                <strong>MyFriendは電話の友だち</strong>
                です。シニアがしばしば最も欠けているもの — 寄り添いと支え —
                を届けます。話をして孤独感と向き合いやすくし、テレビの使い方、オーブンの設定、好きなレシピ探しなど、日常の困りごとにも手伝います。
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                MyFriendは<strong>一人ひとりに合わせて育ちます</strong>
                。興味を学び、自分から会話を始めることもできます。雑談のために電話したり、大切な予定を思い出させたりします。
              </p>
            </div>
            <div className="w-full md:w-96 bg-green-200 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/myfriend-greeting-senior.jpg"
                alt="シニアと話すロボット"
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
                alt="健康とウェルネスのリマインダー"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                会話だけでなく、MyFriendは心と体の調子にも気を配ります。服薬の時間を知らせ、軽い運動や頭の体操をすすめ、ゲーム感覚の小さなチャレンジに変えます。健康で活動的でいることが、もっと楽しく続けやすくなります。
              </p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-center mb-4 text-lg">
              MyFriendを試してみませんか？
              <br />
              いつでも無料でお電話ください:
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 pb-8 sm:pb-12">
              <div className="text-center text-3xl sm:text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg">
                <span className="block text-sm font-normal text-gray-500 mb-1">
                  日本
                </span>
                <span className="text-2xl sm:text-3xl text-gray-400">近日公開</span>
              </div>
              <a
                href="tel:+12346036167"
                className="text-center text-3xl sm:text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg"
              >
                <span className="block text-sm font-normal text-gray-500 mb-1">
                  米国
                </span>
                +1 234 603 6167
              </a>
              <a
                href="tel:+420910920500"
                className="text-center text-3xl sm:text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg"
              >
                <span className="block text-sm font-normal text-gray-500 mb-1">
                  ヨーロッパ / チェコ
                </span>
                +420 910 920 500
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950">
                よくある質問
              </h2>
            </div>
            <div className="grid gap-4">
              {MYFRIEND_JA_FAQS.map((item) => (
                <article
                  key={item.question}
                  className="rounded-lg border border-gray-200 px-5 py-5"
                >
                  <h3 className="text-lg font-semibold text-gray-950 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-800">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 py-16">
          <Link
            href="/myfriend-jp/more"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors"
          >
            プロジェクトについてもっと知る
          </Link>
          <Link
            href="/myfriend-jp/events"
            className="bg-transparent border border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors"
          >
            イベント
          </Link>
        </div>
      </div>

      <footer>
        <p className="text-center mb-6">
          MyFriendについて質問・フィードバック・アイデアはありますか？
          <br />
          下のリンクからご連絡ください:
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Xプロフィール">
            <Image
              src="/icons/twitter-x.svg"
              alt="X"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a
            href="https://linkedin.com/in/olivercingl"
            target="_blank"
            aria-label="LinkedInプロフィール"
          >
            <Image
              src="/icons/linkedin.svg"
              alt="LinkedIn"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="メール">
            <Image
              src="/icons/mail.svg"
              alt="メール"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="tel:+420776781248" target="_blank" aria-label="電話">
            <Image
              src="/icons/phone.svg"
              alt="電話"
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
