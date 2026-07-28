import Image from "next/image";
import Link from "next/link";
import {
  ELDER_COMPANION_MORE_ALTERNATES,
  ELDER_COMPANION_MORE_CANONICALS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
} from "@/lib/elder-companion-seo";

const title = "MyFriendプロジェクトについてもっと知る";
const description =
  "MyFriendの背景：チェコでのMVP、シニア向けワークショップ、介護施設からの関心、テレビ出演、そしてシンプルな電話番号への移行。";

export const metadata = elderCompanionMetadata({
  locale: "ja",
  title,
  description,
  canonical: ELDER_COMPANION_MORE_CANONICALS.ja,
  alternates: ELDER_COMPANION_MORE_ALTERNATES,
});

export default function MaiFurendoMore() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "MyFriend",
              description,
              url: ELDER_COMPANION_MORE_CANONICALS.ja,
              inLanguage: "ja",
            }),
          ),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <Link
          href="/"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; MyFriendページへ戻る
        </Link>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">
            my<span className="italic text-orange-400">friend</span>
          </h1>
          <p className="text-black opacity-50">シニア向けコンパニオン</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                これはチェコ共和国で作られたMyFriendのMVPです。シニアとのワークショップを何度か開きフィードバックを集め、介護施設とも話し、パイロットへの関心を確認しました。
                <br />
                <br />
                最終的に、物理ロボットの代わりにシンプルな電話番号にしました。誰でも使えるようにするためです。スマホもインターネットも不要です。
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
                alt="大統領へのプロジェクト紹介"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                チェコ共和国大統領にプロジェクトを紹介する機会があり、その影響について数分間お話ししました。真摯な関心を示し、開発の継続を励ましてくださいました。
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg leading-relaxed text-gray-800">
              MyFriendはテレビにも2回登場しました。そのおかげで、心と体のウェルビーイングの専門家と協力を始め、プロジェクトに心身のケア機能を組み込んでいます。
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
                    フルエピソード (23:42)
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
                    フルエピソード (20:11)
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="-mb-16 mt-20">
            <p className="text-center mb-4 text-lg">
              MyFriendを試してみませんか？
              <br />
              いつでも無料でお電話ください:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-8 sm:pb-12">
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
        </section>
      </div>

      <footer>
        <p className="text-center mb-6 mt-12">
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
