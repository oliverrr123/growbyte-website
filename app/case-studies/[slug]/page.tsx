import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EnvelopeOpenIcon, WhatsappLogoIcon, PhoneCallIcon } from "@phosphor-icons/react/ssr";

const CASE_STUDIES = {
    "cv-search-engine": {
        title: "AI-powered search engine for 50,000 CV documents",
        image: "/images/case-studies/case1.jpg",
        imageAlt: "AI search interface and data-driven hiring workflow",
    },
    "marketing-analyzer": {
        title: "AI ad analyzer comparing client's vs competitor's ads",
        image: "/images/case-studies/case2.jpg",
        imageAlt: "Marketing performance dashboard and competitor benchmarking",
    },
} as const;

type CaseStudySlug = keyof typeof CASE_STUDIES;

export default async function CaseStudyDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const caseStudy = CASE_STUDIES[slug as CaseStudySlug];

    if (!caseStudy) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen text-foreground">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
                <Link href="/case-studies" className="text-foreground text-sm opacity-60 pb-8 sm:pb-8 block">
                    &lt;&nbsp; Back to case studies
                </Link>

                <div className="mb-8 aspect-16/11 overflow-hidden bg-foreground/10">
                    <Image
                        src={caseStudy.image}
                        alt={caseStudy.imageAlt}
                        width={1200}
                        height={700}
                        className="w-full h-auto object-cover"
                        priority
                    />
                </div>


                <h1 className="text-3xl sm:text-5xl font-medium leading-tight mb-6">{caseStudy.title}</h1>

                <div className="mb-6">
                    {/* <p className="text-sm mb-2 text-foreground/60">Written by human:</p> */}
                    <div className="flex items-center gap-3">
                        {/* <a href="https://olivercingl.com" target="_blank"><Image src="/images/case-studies/oliver-cingl-profile-picture.jpg" alt="Profile picture" width={100} height={100} className="rounded-full w-12 h-12 aspect-square object-cover" /></a> */}
                        <div className="flex items-center gap-1">
                            <p className="text-sm text-foreground/60">Written by human:</p>
                            <p className="text-sm"><a href="https://olivercingl.com" target="_blank" className="underline decoration-foreground/60">Oliver Cingl</a>, <span className="text-sm text-foreground/60">Founder & CEO of <a href="https://growbyte.co" target="_blank" className="underline decoration-foreground/60">GrowByte</a></span></p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 text-foreground/80 leading-relaxed text-base sm:text-lg">
                    <p>
                        <a href="https://marketup.eu" target="_blank" className="underline">MarketUp</a>, a major marketing agency in Prague, used to compare their client's vs competitor's ads manually.
                        Going through the <a href="https://www.facebook.com/ads/library/" target="_blank" className="underline">Meta Ad Library</a> and comparing every ad manually is not only very time consuming, but also lacks context.
                        What if I they wanted to compare the average reach of all the active ads in the last month specifically on Instagram?
                        They would have to go thorugh every ad manually and copy paste the reach into some spreadsheet and then generate a graph from it.
                        <br />That just doesn't make sense.
                        <br />
                        <br />
                        That's why we built a tool that takes all the hassle away and just lets you focus on the important stuff - actually reading and analysing the data, not just gathering it.
                        You simply select the client and competitor pages that you want to compare (you can even select multiple of them!) and click analyze.
                        The system pulls all the ads from Meta so you can instantly view and inspect them side by side.
                        It also generates graphs, which let you easily see the reach and target groups across all ads, so you don't need to touch any spreadsheets.
                        After about a minute, the AI analysis is completed and lets you see the actually important data - the trends, differences and suggestions for improvement.
                        For example, you can see that your traditional carousel ads are at the median reach, but then there's one video ad with way bigger reach - suggestion? Make more video ads!
                        <br />The AI analysis can also spot insightful patterns - is your competitor running ads for longer periods of time? Are they focusing on a specific product or running a special limited time offer?
                        <br />After you're done with observing the data, you can export it with all the graphs and insights into a pdf report and share it directly with your client.
                        <br />
                        <br />
                        Thanks to this system, MarketUp now saves time and focuses on the actually important part of their job, instead of wasting time on spreadsheets.
                        They also provide added value for their clients by giving them access to this tool, so they can see for themselves how their ads are performing compared to their competition.
                    </p>
                    <div className="border border-foreground/10 px-6 py-5">
                        <p className="italic mb-4">
                            "This is some random text. You can replace this with anything you like! Here is another sentence to show random content in this paragraph. This is not a real paragraph, it's just here to show you how the text looks like."
                        </p>
                        <div className="flex items-center gap-3">
                            <Image src="/icons/person.svg" alt="" width={100} height={100} className="rounded-full w-11 h-11 aspect-square object-cover bg-foreground/10" />
                            <div className="">
                                <p className="text-sm">Name Surname</p>
                                <p className="text-sm text-foreground/60">Position at <a href="https://marketup.eu" target="_blank" className="underline decoration-foreground/60">MarketUp</a></p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-16">
                        <p>Want to level up your company just like MarketUp? Call me or send me a message:</p>
                        <div className="flex items-center gap-2 my-5">
                            <div className="border border-foreground/10 px-4 py-2 flex items-center gap-2">
                                <EnvelopeOpenIcon className="text-foreground/60" size={20} />
                                <p className="text-sm">oliver.cingl@gmail.com</p>
                            </div>
                            <div className="border border-foreground/10 px-4 py-2 flex items-center gap-2">
                                <WhatsappLogoIcon size={20} />
                                <p className="text-sm">+420 776 781 248</p>
                            </div>
                            <div className="border border-foreground/10 px-4 py-2 flex items-center gap-2">
                                <PhoneCallIcon size={20} />
                                <p className="text-sm">+420 776 781 248</p>
                            </div>
                        </div>
                        <p>If you're unsure what to send, just say "hey", I'll get back to you ;)<br />You can call any time. If I don't pick up, I'll call you back.</p>
                    </div>
                </div>
                <Link href="/case-studies" className="text-foreground text-sm opacity-60 pb-8 sm:pb-8 block">
                    &lt;&nbsp; Back to case studies
                </Link>
            </article>

            <footer>
                <h6 className="py-6 text-center text-foreground">© {new Date().getFullYear()} GrowByte</h6>
            </footer>
        </div>
    );
}
