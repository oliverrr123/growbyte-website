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
    title: "How to find the perfect candidate burried in 50 000 CVs?",
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
  // {
  //   slug: "auto-mailer",
  //   title: "How MarketUp ditched spreadsheets for an AI-first marketing analysis tool",
  //   image: "/images/case-studies/case2.jpg",
  //   imageAlt: "Marketing performance dashboard and competitor benchmarking",
  //   readTime: "2 min read",
  //   authorName: "Oliver Cingl",
  //   authorUrl: "https://olivercingl.com",
  //   companyName: "GrowByte",
  //   companyUrl: "https://growbyte.co",
  // },
  // {
  //   slug: "slai",
  //   title: "How MarketUp ditched spreadsheets for an AI-first marketing analysis tool",
  //   image: "/images/case-studies/case2.jpg",
  //   imageAlt: "Marketing performance dashboard and competitor benchmarking",
  //   readTime: "2 min read",
  //   authorName: "Oliver Cingl",
  //   authorUrl: "https://olivercingl.com",
  //   companyName: "GrowByte",
  //   companyUrl: "https://growbyte.co",
  // },
];

export function getCaseStudyBySlug(slug: string) {
  return CASE_STUDIES.find((caseStudy) => caseStudy.slug === slug);
}
