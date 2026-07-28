import Image from "next/image";
import Link from "next/link";
import {
  ELDER_COMPANION_EVENTS_ALTERNATES,
  ELDER_COMPANION_EVENTS_CANONICALS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
} from "@/lib/elder-companion-seo";
import { EVENTS } from "@/app/myfriend/events/data";

const title = "MyFriendイベント";
const description =
  "シニア向けAI電話コンパニオン MyFriend のワークショップ、デモ、コミュニティイベント。";

export const metadata = elderCompanionMetadata({
  locale: "ja",
  title,
  description,
  canonical: ELDER_COMPANION_EVENTS_CANONICALS.ja,
  alternates: ELDER_COMPANION_EVENTS_ALTERNATES,
});

export default function MyFriendJpEventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "MyFriendイベント",
              description,
              url: ELDER_COMPANION_EVENTS_CANONICALS.ja,
              inLanguage: "ja",
            }),
          ),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-0">
        <Link
          href="/myfriend-jp"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; MyFriendページへ戻る
        </Link>

        <div className="text-center mb-12 sm:mb-20">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">
            my<span className="italic text-orange-400">friend</span>
          </h1>
          <p className="text-black opacity-50">イベント</p>
        </div>

        {EVENTS.length === 0 ? (
          <p className="text-center text-base sm:text-lg text-gray-800 opacity-70 pb-16">
            新しいイベントはここに掲載されます。
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
                    alt={event.imageAltJa}
                    className="w-full h-full object-cover rounded-xl"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-3 sm:gap-4 items-start">
                  {event.dateJa || event.date ? (
                    <p className="text-sm text-gray-500 mt-4 sm:mt-8">
                      {event.dateJa ?? event.date}
                    </p>
                  ) : null}
                  <p
                    className={`text-2xl font-medium sm:text-3xl max-w-11/12 ${
                      event.dateJa || event.date ? "" : "mt-4 sm:mt-8"
                    }`}
                  >
                    {event.titleJa}
                  </p>
                  {event.descriptionJa ? (
                    <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                      {event.descriptionJa}
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
          MyFriendについて質問・フィードバック・アイデアはありますか？
          <br />
          下のリンクからご連絡ください:
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://x.com/olivercingl"
            target="_blank"
            aria-label="Xプロフィール"
          >
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
          <a
            href="mailto:oliver.cingl@gmail.com"
            target="_blank"
            aria-label="メール"
          >
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
