/** Data shown exclusively on the Slovak page when utm_source=max is active. */

export type SkMaxLegalCaseStudy = {
  id: string;
  caseLabel: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const SK_MAX_LEGAL_CASE_STUDIES: SkMaxLegalCaseStudy[] = [
  {
    id: "ai-intake",
    caseLabel: "Case Study — Advokátska kancelária Bratislava",
    title: "AI Intake systém",
    description:
      "Právnická kancelária odpovedala na nové dopyty v priemere až po 8–12 hodinách, čo spôsobovalo stratu klientov. Implementovali sme AI intake systém, ktorý automaticky komunikoval s klientmi, kládol základné otázky a rezervoval konzultácie priamo do kalendára. Výsledkom bolo zrýchlenie reakčného času na menej než 2 minúty a zvýšenie počtu dohodnutých konzultácií o 37 % počas prvých 60 dní.",
    image: "/images/solutions/sk-max-intake.jpg",
    imageAlt: "AI intake systém pre právnickú kanceláriu",
  },
  {
    id: "ai-contracts",
    caseLabel: "Case Study — Firemné právne oddelenie Banská Bystrica",
    title: "AI Review zmlúv",
    description:
      "Právnici denne kontrolovali desiatky obchodných zmlúv manuálne, čo zaberalo obrovské množstvo času. Nasadili sme AI systém na analýzu zmlúv, ktorý automaticky označoval rizikové klauzuly a navrhoval úpravy podľa interných pravidiel firmy. Čas potrebný na prvotnú kontrolu zmlúv sa znížil o 65 % a tím zvládol obslúžiť viac klientov bez prijatia ďalších zamestnancov.",
    image: "/images/solutions/sk-max-contracts.jpg",
    imageAlt: "AI systém na analýzu a review zmlúv",
  },
  {
    id: "ai-legal-assistant",
    caseLabel: "Case Study — Advokátska kancelária Zvolen",
    title: "AI Právny Asistent",
    description:
      "Kancelária mala problém s rýchlym vyhľadávaním starých prípadov, paragrafov a judikatúry. Vytvorili sme interného AI asistenta napojeného na firemnú databázu dokumentov a rozhodnutí. Právnici dokázali nájsť relevantné informácie za pár sekúnd namiesto desiatok minút, čo znížilo čas researchu o viac než polovicu.",
    image: "/images/solutions/sk-max-legal-assistant.jpg",
    imageAlt: "AI asistent pre právnikov na vyhľadávanie judikatúry",
  },
  {
    id: "ai-deadline",
    caseLabel: "Case Study — Legal oddelenie Košice",
    title: "AI Monitoring termínov",
    description:
      "Firma spravovala stovky zmlúv a všetky termíny evidovala manuálne v Exceli. Implementovali sme AI monitoring systém, ktorý automaticky sledoval expirácie, termíny a compliance povinnosti s inteligentnými upozorneniami. Výsledkom bolo odstránenie zmeškaných termínov a úspora približne 20 hodín administratívy mesačne.",
    image: "/images/solutions/sk-max-deadline.jpg",
    imageAlt: "AI monitoring termínov a compliance pre právne oddelenie",
  },
  {
    id: "ai-documents",
    caseLabel: "Case Study — Advokátska kancelária Banská Bystrica",
    title: "AI Generovanie dokumentov",
    description:
      "Právnici opakovane vytvárali rovnaké typy dokumentov a zmlúv od nuly. Navrhli sme AI systém, ktorý generoval dokumenty automaticky na základe formulára vyplneného klientom. Čas tvorby základných právnych dokumentov sa skrátil z približne 1 hodiny na menej než 10 minút.",
    image: "/images/solutions/sk-max-documents.jpg",
    imageAlt: "AI generovanie právnych dokumentov a zmlúv",
  },
  {
    id: "ai-crm",
    caseLabel: "Case Study — Advokátska kancelária Banská Bystrica",
    title: "AI CRM systém pre právnikov",
    description:
      "Kancelária spravovala klientov, prípady a fakturáciu cez Excel tabuľky a emaily, čo spôsobovalo chaos v komunikácii. Implementovali sme moderný AI CRM systém, ktorý centralizoval všetky dáta, automatizoval follow-upy a sledoval stav každého prípadu. Tím získal kompletný prehľad nad klientmi a administratívna práca sa znížila o približne 40 %.",
    image: "/images/solutions/sk-max-crm.jpg",
    imageAlt: "AI CRM systém pre advokátsku kanceláriu",
  },
];

/** Max-specific image overrides for existing SK solutions. */
export const SK_MAX_SOLUTION_IMAGES: Record<string, { image: string; imageAlt: string }> = {
  chatbot: {
    image: "/images/solutions/sk-max-chatbot.jpg",
    imageAlt: "AI chatbot pre zákaznícku podporu a rezervácie",
  },
  automailer: {
    image: "/images/solutions/sk-max-automailer.jpg",
    imageAlt: "AI automatizácia emailovej komunikácie",
  },
};

/** Max-specific image overrides for SK portfolio case studies. */
export const SK_MAX_CASE_STUDY_IMAGES: Record<string, { image: string; imageAlt: string }> = {
  "cv-search-engine": {
    image: "/images/solutions/sk-max-cv-search.jpg",
    imageAlt: "AI vyhľadávanie kandidátov medzi tisíckami životopisov",
  },
  "marketing-analyzer": {
    image: "/images/solutions/sk-max-marketing.jpg",
    imageAlt: "AI analytický nástroj pre marketingové kampane",
  },
};
