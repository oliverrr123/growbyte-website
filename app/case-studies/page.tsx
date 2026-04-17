import Image from "next/image";
import Link from "next/link";

export default function RoboCompanion() {
    return (
        <div className="bg-black min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-0 sm:pb-0 pt-8 sm:pt-16">
                {/* <Link href="/" className="text-white text-sm opacity-50 pb-2 block">&lt;&nbsp; Back to main page</Link> */}

                <div className="mb-16 sm:mb-32 text-center">
                    <h1 className="text-4xl sm:text-5xl tracking-tight text-white mb-4">CASE  &nbsp;STUDIES</h1>
                    {/* <p className="text-white opacity-50">A companåion for elderly</p> */}
                </div>

                <section className="space-y-20 sm:space-y-28 text-white">
                    <div className="flex flex-col md:flex-row md:items-start md:gap-12">
                        <div className="flex-1 w-full md:w-96 flex items-center justify-center">
                            <Image
                                src="/images/case-studies/case1.jpg"
                                alt="Seniors living alone statistics"
                                className="w-full h-full object-cover"
                                width={400}
                                height={400}
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-6 items-start">
                            <p className="text-2xl font-medium sm:text-3xl mt-4 sm:mt-8 max-w-11/12">
                                AI-powered search engine for&nbsp;50,000 CV documents
                            </p>
                            <Link
                                href="/case-studies/cv-search-engine"
                                className="bg-transparent border border-white border-[0.5px] px-4 py-2 inline hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
                            >
                                <p>EXPLORE &nbsp;&nbsp;→</p>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row md:items-start gap-0 md:gap-12">
                        <div className="flex-1 flex flex-col gap-6 items-start">
                            <p className="text-2xl font-medium sm:text-3xl mt-4 sm:mt-8 max-w-11/12">
                                AI marketing analyzer comparing client vs competition
                            </p>
                            <Link
                                href="/case-studies/marketing-analyzer"
                                className="bg-transparent border border-white px-4 py-2 inline hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
                            >
                                <p>EXPLORE &nbsp;&nbsp;→</p>
                            </Link>
                        </div>
                        <div className="flex-1 w-full md:w-96 flex items-center justify-center">
                            <Image
                                src="/images/case-studies/case2.jpg"
                                alt="Seniors living alone statistics"
                                className="w-full h-full object-cover"
                                width={400}
                                height={400}
                            />
                        </div>
                    </div>
                </section>
                {/* <div className="w-full flex flex-col items-center justify-center mt-32">
                    <Link
                        href="/myfriend/more"
                        className="bg-transparent border border-white text-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
                    >
                        EXPLORE MORE &nbsp;&nbsp; →
                    </Link>
                </div> */}
            </div>

            <footer className="mt-32">
                <p className="text-center mb-6 text-white">Want to see more case studies?<br />Contact me through the links below:</p>
                <div className="flex justify-center gap-4">
                    <a href="https://x.com/olivercingl" target="_blank" aria-label="Twitter profile">
                        <Image src="/icons/twitter-x.svg" alt="Twitter" className="w-8 h-8 brightness-0 invert hover:opacity-100 transition-opacity" width={32} height={32} />
                    </a>
                    <a href="https://linkedin.com/in/olivercingl" target="_blank" aria-label="Linkedin profile">
                        <Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 brightness-0 invert hover:opacity-100 transition-opacity" width={32} height={32} />
                    </a>
                    <a href="mailto:oliver.cingl@gmail.com" target="_blank" aria-label="Email">
                        <Image src="/icons/mail.svg" alt="Email" className="w-8 h-8 brightness-0 invert hover:opacity-100 transition-opacity" width={32} height={32} />
                    </a>
                    <a href="tel:+420776781248" target="_blank" aria-label="Phone">
                        <Image src="/icons/phone.svg" alt="Phone" className="w-8 h-8 brightness-0 invert hover:opacity-100 transition-opacity" width={32} height={32} />
                    </a>
                </div>
                <h6 className="py-6 text-center text-white">© {new Date().getFullYear()} GrowByte</h6>
            </footer>
        </div>
    );
}
