import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/app/case-studies/data";
import {
    CvSearchEngineArticle,
    MarketingAnalyzerArticle,
} from "@/app/case-studies/article-content";

const ARTICLE_COMPONENTS = {
    "cv-search-engine": CvSearchEngineArticle,
    "marketing-analyzer": MarketingAnalyzerArticle,
} as const;

export function generateStaticParams() {
    return CASE_STUDIES.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export default async function CaseStudyDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const caseStudy = getCaseStudyBySlug(slug);

    if (!caseStudy) {
        notFound();
    }

    const ArticleComponent = ARTICLE_COMPONENTS[slug as keyof typeof ARTICLE_COMPONENTS];

    if (!ArticleComponent) {
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

                <div className="mb-6 flex flex-col md:flex-row md:gap-1">
                    <p className="text-sm text-foreground">{caseStudy.readTime}</p>
                    <p className="text-sm text-foreground/60">•</p>
                    <p className="text-sm text-foreground/60">Written by human:</p>
                    <p className="text-sm text-foreground/60"><a href={caseStudy.authorUrl} target="_blank" className="underline decoration-foreground/60">{caseStudy.authorName}</a>, <span className="text-sm text-foreground/60">Founder & CEO of <a href={caseStudy.companyUrl} target="_blank" className="underline decoration-foreground/60">{caseStudy.companyName}</a></span></p>
                </div>

                <div className="space-y-6 text-foreground/80 leading-relaxed text-base sm:text-lg">
                    <ArticleComponent />
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
