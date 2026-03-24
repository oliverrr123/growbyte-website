import Image from "next/image";
import Link from "next/link";

export default function DigiPritelVice() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <Link href="/digipritel" className="text-black text-sm opacity-50 pb-8 sm:pb-16 block">&lt;&nbsp; Zpět na stránku DigiPřítele</Link>

        <div className="text-center mb-16 sm:mb-28">
          <h1 className="text-3xl sm:text-5xl font-black text-black mb-4 borel-font">my<span className="italic text-orange-400 font-semibold">friend</span></h1>
          <p className="text-black opacity-50">Společník pro seniory</p>
        </div>

        <section className="space-y-12 sm:space-y-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Toto je MVP DigiPřítele vytvořené v České republice. Uspořádali jsme několik workshopů se seniory, abychom získali jejich zpětnou vazbu, a mluvili jsme s domovy seniorů, které nám potvrdily zájem o zkušební provoz.
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
                Váš prohlížeč nepodporuje video tag.
              </video>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="w-full md:w-96 bg-blue-200 rounded-xl flex items-center justify-center order-1">
              <Image
                src="/images/robo-companion/president.jpg"
                alt="Prezentace projektu prezidentovi"
                className="w-full h-full object-cover rounded-xl"
                width={400}
                height={400}
              />
            </div>
            <div className="flex-1 order-2">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                Dostali jsme možnost představit projekt prezidentovi České republiky a několik minut jsme se bavili o jeho dopadu. Prezident projevil opravdový zájem a povzbudil nás, abychom ve vývoji pokračovali.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1 order-2 md:order-1">
              <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                DigiPřítel se objevil také v pořadu České televize. Díky tomu jsme navázali spolupráci s odborníkem na wellbeing seniorů, který nám pomáhá začlenit do projektu prvky duševního i fyzického zdraví. <a className="underline" href="https://www.ceskatelevize.cz/porady/14021364946-bilance/224452801250001/">Celý díl (23:42)</a>
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
                Váš prohlížeč nepodporuje video tag.
              </video>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <p className="text-center mb-6 mt-12">Chcete podpořit DigiPřítele?<br />Kontaktujte mě přes odkazy níže:</p>
        <div className="flex justify-center gap-4">
          <a href="https://x.com/olivercingl" target="_blank" aria-label="Twitter profil">
            <Image src="/icons/twitter-x.svg" alt="Twitter" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Linkedin profil">
            <Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="E-mail">
            <Image src="/icons/mail.svg" alt="E-mail" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
          <a href="tel:+14155056006" target="_blank" aria-label="Telefon">
            <Image src="/icons/phone.svg" alt="Telefon" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} />
          </a>
        </div>
        <h6 className="py-6 text-center text-black">© {new Date().getFullYear()} GrowByte</h6>
      </footer>
    </>
  );
}

