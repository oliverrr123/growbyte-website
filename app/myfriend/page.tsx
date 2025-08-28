import Image from "next/image";
import Link from "next/link";

export default function RoboCompanion() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <Link href="/" className="text-black text-sm opacity-50 pb-8 sm:pb-16 block">&lt;&nbsp; Back to main page</Link>
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
          <h1 className="text-3xl sm:text-5xl font-black text-black mb-4 borel-font">my<span className="italic text-orange-400 font-semibold">friend</span></h1>
          <p className="text-black opacity-50">A companion for elderly</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
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
            <p className="text-xl sm:text-2xl font-semibold">That&apos;s why we created <span className="borel-font">my<span className="italic text-orange-500">friend</span></span>.</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image 
                src="/images/robo-companion/myfriend-talking-to-senior.png" 
                alt="Small companion robot" 
                className="w-full h-full object-cover rounded-xl" 
                width={400} 
                height={400} 
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                MyFriend is a <strong>small, one foot tall companion robot</strong> that gives seniors something they often miss most: company and support. Seniors can talk with it, and it helps them overcome loneliness. It can also assist with everyday problems, such as reminding them how to use the TV remote, showing how to set the oven, or helping them find a favorite recipe.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                MyFriend adapts to each individual. It learns about their interests and can even start conversations. For example, when a senior comes home from the store, MyFriend might greet them, ask what they bought, or chat about what they plan to cook.
              </p>
            </div>
            <div className="w-full md:w-96 bg-green-200 rounded-xl flex items-center justify-center order-1 md:order-2">
              <Image 
                src="/images/robo-companion/myfriend-greeting-senior.png" 
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
                src="/images/robo-companion/senior-exercising.png" 
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

          {/* <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-lg text-gray-800 mb-6">
              We want MyFriend to be accessible to every senior. That's why we're working with senior facilities and institutions that can provide it to those who need it most.
            </p>
            <div className="w-96 bg-orange-300 rounded-xl mx-auto flex items-center justify-center">
              <Image 
                src="/images/robo-companion/senior-facility.png" 
                alt="Senior facilities and accessibility" 
                className="w-full h-full object-cover rounded-xl" 
                width={400} 
                height={200} 
              />
            </div>
          </div> */}
        </section>
      </div>

      <footer className="mt-24">
        <div className="flex justify-center gap-4 pt-16">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Twitter profile">
            <Image src="/icons/twitter-x.svg" alt="Twitter" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Linkedin profile">
            <Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="mailto:hello@growbyte.co" target="_blank" aria-label="Email">
            <Image src="/icons/mail.svg" alt="Email" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="tel:+14155056006" target="_blank" aria-label="Phone">
            <Image src="/icons/phone.svg" alt="Phone" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
        </div>
        <h6 className="py-6 text-center text-black">© 2025 GrowByte</h6>
      </footer>
    </>
  );
}
