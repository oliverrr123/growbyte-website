import Image from "next/image";
import Link from "next/link";
import { LocalizedHomeLink } from "@/components/localized-home-link";
import { LonelySeniorsGraphic } from "@/components/lonely-seniors-graphic";
import { FaqAccordion } from "@/components/faq-accordion";
import { SoftFadeImage } from "@/components/soft-fade-image";
import { STORY_CLIP_PATHS } from "@/lib/story-clip-paths";
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <LocalizedHomeLink
          fallbackLocale="ja"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; トップページへ戻る
        </LocalizedHomeLink>
        <div className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <SoftFadeImage
            src="/images/robo-companion/robo-companion.png"
            alt="MyFriend コンパニオンロボット"
            className="w-48 sm:w-64"
            imageClassName="rounded-xl w-full h-auto object-cover"
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

        <section className="space-y-20 sm:space-y-28">
          <div className="mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
            <p>
              MyFriendは、<strong>通常の電話で使えるシニア向けAIコンパニオン</strong>
              です。
            </p>
            <p>
              孤独感の軽減、大切なことのリマインダー、わかりやすいサポートを、スマホ・アプリ・インターネットなしで提供します。
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="flex-1 order-2 md:order-1 mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
              <p>
                日本では、<strong>高齢者の3人に1人が一人暮らし</strong>
                をしています。
              </p>
              <p>
                それは<strong>約700万人の孤独な高齢者</strong>
                です。
              </p>
              <p>
                家族とほとんど会えない、あるいは全く会えない人も多く、孤独が日常の一部になってしまっています。
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <LonelySeniorsGraphic label="高齢者の3人に1人が一人暮らし" />
            </div>
          </div>

          <div className="text-center py-8 sm:py-12">
            <p className="text-xl sm:text-2xl font-semibold text-black/80">
              だから私は{" "}
              <span className="caveat-bold-font text-3xl sm:text-4xl text-black">
                my<span className="italic text-orange-500">friend</span>
              </span>
              {" を作りました"}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="w-full md:w-[32rem] flex items-center justify-center order-1">
              <SoftFadeImage
                src="/images/robo-companion/myfriend-talking-to-senior.jpg"
                alt="コンパニオンロボットとの会話"
                className="w-full"
                imageClassName="w-full h-auto object-cover"
                width={804}
                height={603}
                clipPath={STORY_CLIP_PATHS.talking}
              />
            </div>
            <div className="flex-1 order-2 mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
              <p>
                <strong>MyFriendは電話の友だち</strong>
                です。シニアがしばしば最も欠けているもの — 寄り添いと支え — を届けます。
              </p>
              <p>
                24時間いつでも電話して雑談したり、質問したり、困りごとの解決を頼んだり、服薬などのリマインダーを設定したりできます。
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="flex-1 order-2 md:order-1 mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
              <p>
                MyFriendは<strong>一人ひとりに合わせて育ちます</strong>。
              </p>
              <p>
                興味を学び、これまでの会話を覚え、まるで人間の友だちのように寄り添います。
              </p>
              <p>
                雑談のために自分から電話したり、その人の興味に合わせた嬉しいニュースやアイデアを届けたりします。
              </p>
            </div>
            <div className="w-full md:w-[32rem] flex items-center justify-center order-1 md:order-2">
              <SoftFadeImage
                src="/images/robo-companion/myfriend-greeting-senior.jpg"
                alt="シニアと話すロボット"
                className="w-full"
                imageClassName="w-full h-auto object-cover"
                width={804}
                height={603}
                clipPath={STORY_CLIP_PATHS.greeting}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="w-full md:w-[32rem] flex items-center justify-center order-1">
              <SoftFadeImage
                src="/images/robo-companion/senior-exercising.jpg"
                alt="健康とウェルネスのリマインダー"
                className="w-full"
                imageClassName="w-full h-auto object-cover"
                width={804}
                height={603}
                clipPath={STORY_CLIP_PATHS.exercising}
              />
            </div>
            <div className="flex-1 order-2 mx-auto max-w-md space-y-4 text-center text-base sm:text-lg leading-relaxed text-gray-800">
              <p>会話だけでなく、MyFriendは心と体の調子にも気を配ります。</p>
              <p>
                服薬の時間を知らせ、軽い運動や頭の体操をすすめ、ゲーム感覚で楽しく続けられるようにします。
              </p>
              <p>健康で活動的でいることが、もっと楽しく続けやすくなります。</p>
            </div>
          </div>

          <div className="pt-8 sm:pt-12">
            <p className="text-center mb-6 text-lg">
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
            <FaqAccordion items={MYFRIEND_JA_FAQS} />
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
              src="/icons/twitter-x.svg?v=5"
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
              src="/icons/linkedin.svg?v=5"
              alt="LinkedIn"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="メール">
            <Image
              src="/icons/mail.svg?v=5"
              alt="メール"
              className="w-8 h-8 hover:opacity-100 transition-opacity"
              width={32}
              height={32}
            />
          </a>
          <a href="tel:+14153771909" target="_blank" aria-label="電話">
            <Image
              src="/icons/phone.svg?v=5"
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
