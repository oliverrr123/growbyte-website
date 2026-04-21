export type CaseStudy = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  readTime: string;
  authorName: string;
  authorUrl: string;
  companyName: string;
  companyUrl: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "cv-search-engine",
    title: "AI-powered search engine for 50,000 CV documents",
    image: "/images/case-studies/case1.jpg",
    imageAlt: "AI search interface and data-driven hiring workflow",
    readTime: "2 min read",
    authorName: "Oliver Cingl",
    authorUrl: "https://olivercingl.com",
    companyName: "GrowByte",
    companyUrl: "https://growbyte.co",
  },
  {
    slug: "marketing-analyzer",
    title: "How MarketUp ditched spreadsheets for an AI-first marketing analysis tool",
    image: "/images/case-studies/case2.jpg",
    imageAlt: "Marketing performance dashboard and competitor benchmarking",
    readTime: "2 min read",
    authorName: "Oliver Cingl",
    authorUrl: "https://olivercingl.com",
    companyName: "GrowByte",
    companyUrl: "https://growbyte.co",
  },
];

export function getCaseStudyBySlug(slug: string) {
  return CASE_STUDIES.find((caseStudy) => caseStudy.slug === slug);
}
