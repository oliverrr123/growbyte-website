import Image from "next/image";
import Link from "next/link";

export default function RoboCompanion() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <Link href="/myfriend" className="text-black text-sm opacity-50 pb-8 sm:pb-16 block">&lt;&nbsp; Back to MyFriend page</Link>
        
        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-3xl sm:text-5xl font-black text-black mb-4 borel-font">my<span className="italic text-orange-400 font-semibold">friend</span></h1>
          <p className="text-black opacity-50">A companion for elderly</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                This is the MVP of MyFriend, built in the Czech Republic. We organized several workshops with seniors to gather feedback, and we spoke with senior care homes that confirmed interest in a pilot program.
                <br />
                <br />
                In the end, we decided to replace the physical robot with a simple phone number. That makes MyFriend accessible to everyone. No smartphone or internet connection is required.
              </p>
            </div>
            <div className="w-full md:w-96 rounded-xl flex items-center justify-center order-1 md:order-2">
              <video 
                src="/images/robo-companion/myfriend-mvp.MOV"
                poster="/images/robo-companion/myfriend-mvp.jpg"
                controls
                className="w-full h-full object-cover rounded-xl" 
                width={400} 
                height={400}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image 
                src="/images/robo-companion/president.jpg" 
                alt="Project presentation to the President" 
                className="w-full h-full object-cover rounded-xl" 
                width={400} 
                height={400} 
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                We had the opportunity to present the project to the President of the Czech Republic and spoke about its impact for several minutes. He showed genuine interest and encouraged us to continue development.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                MyFriend also appeared on the Czech Republic national TV. Thanks to that, we got a partnership with a senior wellbeing expert, that helps us with integrating wellbeing features into the project. <a className="underline" href="https://www.ceskatelevize.cz/porady/14021364946-bilance/224452801250001/">Full episode (23:42)</a>
              </p>
            </div>
            <div className="w-full md:w-96 bg-green-200 rounded-xl flex items-center justify-center order-1 md:order-2">
              <video 
                src="/images/robo-companion/myfriend-tv.mp4" 
                poster="/images/robo-companion/myfriend-tv.jpg"
                controls
                className="w-full h-full object-cover rounded-xl" 
                width={400} 
                height={400}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <p className="text-center mb-6 mt-12">Want to try MyFriend?<br />Contact me through the links below:</p>
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
