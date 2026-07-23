import Image from "next/image";
import Link from "next/link";
import { LocalizedHomeLink } from "@/components/localized-home-link";
import {
  ELDER_COMPANION_ALTERNATES,
  ELDER_COMPANION_CANONICALS,
  MYFRIEND_BANNER_IMAGE,
  MYFRIEND_FAQS,
  elderCompanionJsonLd,
  elderCompanionMetadata,
  faqJsonLd,
} from "@/lib/elder-companion-seo";

const title = "MyFriend - AI phone companion for seniors";
const description =
  "MyFriend is an AI phone companion for seniors that offers conversation, everyday support, medication reminders, and gentle wellness prompts.";

export const metadata = elderCompanionMetadata({
  locale: "en",
  title,
  description,
  canonical: ELDER_COMPANION_CANONICALS.en,
  alternates: ELDER_COMPANION_ALTERNATES,
  ogImage: { url: MYFRIEND_BANNER_IMAGE, width: 1200, height: 630 },
});

export default function RoboCompanion() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            elderCompanionJsonLd({
              name: "MyFriend",
              description,
              url: ELDER_COMPANION_CANONICALS.en,
              inLanguage: "en",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(MYFRIEND_FAQS)),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <LocalizedHomeLink
          fallbackLocale="en"
          className="text-black text-sm opacity-50 pb-8 sm:pb-16 block"
        >
          &lt;&nbsp; Back to main page
        </LocalizedHomeLink>
        <div className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <Image
            src="/images/robo-companion/robo-companion.png"
            alt="MyFriend Robot Companion"
            className="rounded-xl w-48 sm:w-64 object-cover"
            width={1000}
            height={1000}
          />
        </div>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-6xl text-black mb-4 caveat-bold-font">my<span className="italic text-orange-400">friend</span></h1>
          <p className="text-black opacity-50">A companion for elderly</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
          <p className="text-base sm:text-lg leading-relaxed text-gray-800 w-full md:max-w-1/2 md:mx-auto md:text-center mb-32 -mt-8">
            MyFriend is an <strong>AI companion for seniors through a regular phone call</strong>. It helps with loneliness, reminds seniors about important things, and offers clear support without requiring a smartphone, an app, or the internet.
          </p>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                In the United States, <strong>16.2 million seniors live completely alone</strong>. That&apos;s more people than the entire population of several U.S. states combined. Many of them rarely see their family, or not at all, and loneliness becomes part of their daily life.
              </p>
            </div>
            <div className="w-full md:w-96 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/map.png"
                alt="Seniors living alone statistics"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
          </div>

          <div className="text-center py-6 sm:py-8">
            <p className="text-xl sm:text-2xl font-semibold">That&apos;s why we created <span className="caveat-bold-font text-3xl sm:text-4xl">my<span className="italic text-orange-500">friend</span></span></p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image
                src="/images/robo-companion/myfriend-talking-to-senior.jpg"
                alt="Small companion robot"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                <strong>MyFriend is a buddy on the phone</strong> that gives seniors what they often miss most: company and support. They can talk with it and better manage the feeling of loneliness. It also helps with everyday situations: it can remind them how to use the TV, show oven settings, or help find a favorite recipe.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                MyFriend <strong>adapts to each person</strong>. It learns about their interests and can start conversations on its own. Sometimes it calls a senior just to chat, or reminds them about an important event.
              </p>
            </div>
            <div className="w-full md:w-96 bg-green-200 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image
                src="/images/robo-companion/myfriend-greeting-senior.jpg"
                alt="Robot having conversation with senior"
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
                alt="Health and wellness reminders"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Beyond conversation, MyFriend also looks after seniors&apos; well-being. It reminds them to take their medications on time, encourages light physical exercise and mental activities, and turns these into fun little challenges through gamification. This makes staying healthy and active easier and more enjoyable.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-center mb-4 text-lg">Want to try MyFriend?<br />Call anytime for free:</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-8 sm:pb-12">
              <a href="tel:+12346036167" className="text-center text-3xl sm:text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg">
                <span className="block text-sm font-normal text-gray-500 mb-1">US</span>
                +1 234 603 6167
              </a>
              <a href="tel:+420910920500" className="text-center text-3xl sm:text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg">
                <span className="block text-sm font-normal text-gray-500 mb-1">Europe / Czechia</span>
                +420 910 920 500
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950">
                Frequently asked questions
              </h2>
            </div>
            <div className="grid gap-4">
              {MYFRIEND_FAQS.map((item) => (
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
            href="/myfriend/more"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors"
          >
            More about project
          </Link>
          <Link
            href="/myfriend/events"
            className="bg-transparent border border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors"
          >
            Events
          </Link>
        </div>
      </div>

      <footer>
        <p className="text-center mb-6">Do you have any questions, feedback, or ideas for MyFriend?<br />Contact me through the links below:</p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Twitter profile">
            <Image src="/icons/twitter-x.svg" alt="Twitter" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Linkedin profile">
            <Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="Email">
            <Image src="/icons/mail.svg" alt="Email" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="tel:+420776781248" target="_blank" aria-label="Phone">
            <Image src="/icons/phone.svg" alt="Phone" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
        </div>
        <h6 className="py-6 text-center text-black">© {new Date().getFullYear()} GrowByte</h6>
      </footer>
    </>
  );
}
