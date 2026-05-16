import Image from "next/image";
import Link from "next/link";

export default function DigiFreundTry() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
        <Link href="/digifreund" className="text-black text-sm opacity-50 pb-8 sm:pb-16 block">
          &lt;&nbsp; Zurück zu DigiFreund
        </Link>

        <div className="mb-12">
          <p className="text-center mb-4 text-lg">DigiFreund ausprobieren?<br />Rufen Sie jederzeit kostenlos an:</p>
          <h3 className="flex w-full justify-center items-center pb-8 sm:pb-12">
            <a href="tel:+420910920500" className="text-4xl font-semibold bg-gray-100 px-8 py-4 rounded-lg">
              +420 910 920 500
            </a>
          </h3>
        </div>

        <h3 className="flex w-full justify-center items-center pb-8 sm:pb-12">
          <Image
            src="/images/robo-companion/robo-companion.png"
            alt="DigiFreund Begleiterroboter"
            className="rounded-xl w-24 sm:w-40 object-cover"
            width={256}
            height={256}
          />
        </h3>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-3xl sm:text-4xl text-black mb-2 caveat-bold-font">
            digi<span className="italic text-orange-400">freund</span>
          </h1>
          <p className="text-sm text-black opacity-50">Begleitung für Menschen im Alter</p>
        </div>
      </div>

      <footer>
        <h6 className="py-6 text-center text-black">© {new Date().getFullYear()} GrowByte</h6>
      </footer>
    </>
  );
}
