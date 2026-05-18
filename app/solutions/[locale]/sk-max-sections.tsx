"use client";

import Image from "next/image";
import { useSkMaxCampaign } from "@/components/sk-max-campaign-context";
import { SK_MAX_LEGAL_CASE_STUDIES } from "../sk-max-data";

export function SkMaxLegalCaseStudies() {
  const { active } = useSkMaxCampaign();
  if (!active) return null;

  return (
    <section className="space-y-20 sm:space-y-28 text-foreground pb-20 sm:pb-28">
      {SK_MAX_LEGAL_CASE_STUDIES.map((cs) => (
        <div key={cs.id} className="flex flex-col md:flex-row md:items-center md:gap-12">
          <div className="flex-1 w-full md:w-96 flex items-center aspect-16/11 justify-center bg-foreground/10">
            <Image
              src={cs.image}
              alt={cs.imageAlt}
              className="w-full h-full object-cover"
              width={400}
              height={400}
            />
          </div>
          <div className="flex-1 flex flex-col gap-3 items-start mt-4 md:mt-0">
            <p className="text-2xl font-medium sm:text-3xl max-w-11/12">{cs.title}</p>
            <p className="text-foreground/70 leading-relaxed">{cs.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export function SkMaxPageHeading({ fallback }: { fallback: string }) {
  const { active } = useSkMaxCampaign();

  if (!active) {
    return (
      <h1 className="text-4xl sm:text-5xl tracking-tight text-foreground mb-4">{fallback}</h1>
    );
  }

  return (
    <div>
      <h1 className="text-4xl sm:text-5xl tracking-tight text-foreground mb-3">
        Pomáhame právnikom šetriť čas pomocou AI
      </h1>
      <p className="text-foreground/60 text-sm mb-20">Nižšie sú naše úspechy a case studies</p>
      <h2 className="text-3xl sm:text-4xl tracking-tight text-foreground mb-1">{fallback}</h2>
    </div>
  );
}

export function SkMaxAboutUs() {
  const { active } = useSkMaxCampaign();
  if (!active) return null;

  return (
    <section className="mt-24 sm:mt-32 mb-0 text-foreground">
      <div className="bg-foreground/5 p-8 sm:p-12 space-y-6">
        <h3 className="text-xl font-medium tracking-tight">O nás</h3>
        <p className="text-foreground/80 leading-relaxed">
          Sme partia mladých podnikateľov a technologických nadšencov, ktorí pomáhajú firmám šetriť
          čas pomocou AI a automatizácií. Špecializujeme sa na moderné systémy pre právnikov, firmy
          a podnikateľov — od AI asistentov až po inteligentné workflowy a CRM riešenia.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Náš tím tvoria Oliver Cingl, Maximilián Ján Jozef Oravec a Matúš Tomaškin. Spájame
          technológie, biznis a kreativitu, aby sme vytvárali riešenia, ktoré firmám reálne
          zjednodušujú fungovanie a odstraňujú zbytočnú manuálnu prácu.
        </p>
      </div>
    </section>
  );
}
