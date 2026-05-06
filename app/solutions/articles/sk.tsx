import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { MuxVideo } from "@/components/mux-video";

export function ChatbotArticleSk() {
  return (
    <>
      <p>
        {`Už ste niekedy skúšali chatbota na nejakom webe? Nič moc, však? Lenže nemusí to tak byť. Pred AI neboli chatboti na weboch moc populárni, pretože poriadne nefungovali. Vedeli odpovedať len na preddefinované otázky a keď ste sa opýtali na niečo trochu iné, jednoducho sa rozsypali. Ale teraz s AI môžeme mať naozaj ľudskú podporu! (možno aj lepšiu ako človeka...)`}
      </p>
      <p>
        {`Predstavte si to takto. Prídete na web a chcete zistiť cenu konkrétnej služby, ktorú hľadáte. Namiesto toho, aby ste preklikávali všetky stránky a snažili sa to ručne nájsť, všimnete si vpravo dole chatbota, ktorý vám už rovno ponúka vašu otázku! „Aká je cena X?", tak na ňu kliknete, opýtate sa presne na to, čo potrebujete, a chatbot vám okamžite dá cenu so všetkými dôležitými detailmi. Potom navrhne: „Chcete si zarezervovať krátky hovor, kde môžeme prebrať, ako vám môžeme ďalej pomôcť?", vy si len vyberiete čas a je rezervované! A to celé za pár sekúnd.`}
      </p>
      <p>
        {`A teraz si predstavte toto na svojom webe. Vaši návštevníci dostanú všetky informácie, ktoré potrebujú, vám klesne počet hovorov a bez toho, aby ste hli prstom, získavate nové leady a zarezervované hovory!`}
      </p>
      <p>
        {`Môžete sa pozrieť na 40-sekundové demo, aby ste to videli v akcii:`}
      </p>

      <div className="my-6 w-full">
        <MuxVideo
          playbackId="JwfhdQQrUUQFeFPeD3SZ8S5oTyaek01j5b01A9qTjTpfQ"
          title="chatbot-demo"
          aspectRatio="1624 / 1080"
        />
      </div>

      <div className="mb-16">
        <p>Chcete toto na svojom webe? Zavolajte mi alebo mi napíšte:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Ak neviete, čo napísať, kľudne len „ahoj" a ozvem sa vám.`}
        </p>
      </div>
    </>
  );
}

export function AutomailerArticleSk() {
  return (
    <>
      <p>
        {`Raz si ma najala firma, aby som im zautomatizoval rozosielanie cold emailov. Ich setup bol obchodník s tabuľkou leadov, ktorý si preklikal každý web, preštudoval ho a potom ručne napísal personalizovaný email. Znie vám to povedome? No vďakabohu, že toto čítate, pretože toto už robiť nebudete musieť!`}
      </p>
      <p>
        {`Namiesto všetkej tej ručnej práce to za vás urobí naša AI. Stačí jej dať zoznam leadov, krátku predstavu, čo má email komunikovať, a vašu cieľovú skupinu. Počkať, žiadne leady nemáte? Žiadny problém! Naša AI vám ich vygeneruje na základe vášho ideálneho zákazníka. Potom len poviete, koľko emailov denne chcete posielať, a šup, zrazu rozosielate stovky personalizovaných emailov každý deň a nemusíte pre to vôbec nič robiť.`}
      </p>

      <div className="mb-16">
        <p>Pripravení si zjednodušiť život? Zavolajte mi alebo mi napíšte:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Ak neviete, čo napísať, kľudne len „ahoj" a ozvem sa vám.`}
        </p>
      </div>
    </>
  );
}
