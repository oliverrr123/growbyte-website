"use client";

import Image from "next/image";

import type { Locale } from "../data";
import { SkMaxLink } from "@/components/sk-max-link";
import { useSkMaxCampaign } from "@/components/sk-max-campaign-context";

export function SolutionListEntryRow({
  caseStudy,
  typedLocale,
  exploreCta,
  detailBasePath,
  skMaxImage,
  skMaxImageAlt,
}: {
  caseStudy: {
    id: string;
    slug: string;
    title: string;
    image: string;
    imageAlt: string;
  };
  typedLocale: Locale;
  exploreCta: string;
  detailBasePath: "solutions" | "case-studies";
  skMaxImage?: string;
  skMaxImageAlt?: string;
}) {
  const { active } = useSkMaxCampaign();
  const image = (active && skMaxImage) ? skMaxImage : caseStudy.image;
  const imageAlt = (active && skMaxImageAlt) ? skMaxImageAlt : caseStudy.imageAlt;

  return (
    <div className="flex flex-col md:flex-row md:items-start md:gap-12">
      <div className="flex-1 w-full md:w-96 flex items-center aspect-16/11 justify-center bg-foreground/10">
        <Image
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
          width={400}
          height={400}
        />
      </div>
      <div className="flex-1 flex flex-col gap-6 items-start">
        <p className="text-2xl font-medium sm:text-3xl mt-4 sm:mt-8 max-w-11/12">{caseStudy.title}</p>
        <SkMaxLink
          href={`/${detailBasePath}/${typedLocale}/${caseStudy.slug}`}
          className="bg-transparent border border-foreground px-4 py-2 inline hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer"
        >
          <p>{exploreCta}</p>
        </SkMaxLink>
      </div>
    </div>
  );
}
