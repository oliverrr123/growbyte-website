import Image from "next/image";
import Link from "next/link";

export default function RoboCompanion() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <Link href="/myfriend" className="text-black text-sm opacity-50 pb-8 sm:pb-16 block">&lt;&nbsp; Back to MyFriend page</Link>

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


        <h3 className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <Image
              src="/images/robo-companion/robo-companion.png"
              alt="MyFriend Robot Companion"
              className="rounded-xl w-24 sm:w-40 object-cover"
              width={256}
              height={256}
            />
        </h3>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-4xl sm:text-5xl text-black mb-2 caveat-bold-font">my<span className="italic text-orange-400">friend</span></h1>
          <p className="text-sm text-black opacity-50">A companion for elderly</p>
        </div>
      </div>

      <footer>
        <h6 className="py-6 text-center text-black">© {new Date().getFullYear()} GrowByte</h6>
      </footer>
    </>
  );
}
