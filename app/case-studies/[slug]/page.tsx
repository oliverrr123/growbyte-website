import { notFound } from "next/navigation";
import { SunIcon, MoonIcon } from "@phosphor-icons/react";

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

var mode = "dark";

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
        <div className="bg-black min-h-screen text-white">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
                <div className="flex justify-between">
                    <Link href="/case-studies" className="text-white text-sm opacity-60 pb-8 sm:pb-12 block">
                        &lt;&nbsp; Back to case studies
                    </Link>
                    <button onClick={() => mode = mode === "dark" ? "light" : "dark"}>
                        {mode === "dark" ? <SunIcon className="opacity-60" /> : <MoonIcon className="opacity-60" />}
                    </button>
                </div>

                <div className="mb-8 sm:mb-12">
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

                <div className="space-y-6 text-white/80 leading-relaxed text-base sm:text-lg">
                    <p>
                        MarketUp, a major marketing agency in Prague, used to compare their client's vs competitor's ads manually.
                        Going through the meta ad library and comparing every ad manually is not only very time consuming, but also lacks context.
                        What if I want to compare the average reach of all the active ads in the last month specifically on instagram?
                        I have to go thorugh every ad manually and copy paste the reach into some spreadsheet and then generate a graph from it.
                        That just doesn't make sense.
                    </p>
                    <p>
                        That's why we built a tool that takes all the hassle away and just lets you focus on the important stuff - actually reading and analysing the data, not just gathering it.
                        You simply select the client and competitor pages, define the time period and click analyze.
                        The system then pulls all the ads in that period from meta and generates so you can instantly analyze them side by side.
                        It also generates graphs, which let you easily see the reach and target groups across all ads, so you don't need to touch any spreadsheets.
                        After about a minute, the AI analysis is done and lets you see the actually important data - the trends, differences and suggestions for improvement.
                        For example, you can see that your traditional carousel ads are at the median reach, but then there's one video ad with way bigger reach - suggestion? Make more video ads!
                        The AI analysis can also spot insightful patterns - is your competitor running ads for longer periods of time? Are they focusing on a specific product or running a special limited time offer?
                        After you're done with observing the data, you can export it with all the graphs and insights into a pdf report and share it directly with your client.
                    </p>
                    <p>
                        Curabitur ac purus nec justo pulvinar suscipit. This paragraph is another sample section
                        for results, lessons learned, and next steps, so the page feels like a complete article.
                    </p>
                </div>
            </article>

            <footer>
                <h6 className="py-6 text-center text-white">© {new Date().getFullYear()} GrowByte</h6>
            </footer>
        </div>
    );
}
