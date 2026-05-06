import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { Testimonial } from "@/components/testimonial";

export function MarketingAnalyzerArticleSk() {
  return (
    <>
      <p>
        <a href="https://marketup.eu" target="_blank" className="underline">
          MarketUp
        </a>
        {`, významná pražská marketingová agentúra, predtým porovnávala reklamy svojich klientov s konkurenciou ručne. Prechádzanie `}
        <a
          href="https://www.facebook.com/ads/library/"
          target="_blank"
          className="underline"
        >
          knižnice Meta Ads
        </a>
        {` a manuálne porovnávanie každej reklamy je nielen časovo náročné, ale chýba mu aj kontext. Čo keby chceli porovnať priemerný dosah všetkých aktívnych reklám za posledný mesiac, konkrétne na Instagrame? Museli by prejsť každú reklamu zvlášť, kopírovať dosah do tabuľky a z nej až potom generovať graf.`}
        <br />
        {`To jednoducho nedáva zmysel.`}
        <br />
        <br />
        {`Preto sme vytvorili nástroj, ktorý túto rutinnú prácu úplne odstraňuje a necháva vás sústrediť sa na to dôležité — na samotné čítanie a analýzu dát, nie na ich zber. Stačí vybrať klientske a konkurenčné stránky, ktoré chcete porovnať (kľudne aj viac naraz!) a kliknúť na analyzovať. Systém stiahne všetky reklamy z Mety, takže si ich môžete okamžite prezrieť vedľa seba. Generuje aj grafy, ktoré ukážu dosah a cieľové skupiny naprieč všetkými reklamami, takže sa nemusíte dotknúť žiadnej tabuľky. Po asi minúte je AI analýza hotová a ukáže to skutočne podstatné — trendy, rozdiely a návrhy na zlepšenie. Napríklad uvidíte, že vaše tradičné carousel reklamy majú mediánový dosah, ale jedna video reklama má výrazne väčší zásah — návrh? Robte viac video reklám!`}
        <br />
        {`AI analýza dokáže odhaliť aj hlbšie vzorce — beží konkurencia reklamy dlhšiu dobu? Sústredí sa na konkrétny produkt alebo ponúka časovo obmedzenú akciu?`}
        <br />
        {`Keď si dáta prezriete, môžete ich so všetkými grafmi a insightmi exportovať do PDF reportu a zdieľať priamo s klientom.`}
        <br />
        <br />
        {`Vďaka tomuto systému teraz MarketUp šetrí čas a sústredí sa na to, čo je v ich práci skutočne dôležité, namiesto aby strácali čas s tabuľkami. Zároveň prinášajú pridanú hodnotu svojim klientom tým, že im k nástroju dávajú prístup, takže si sami môžu overiť, ako si ich reklamy stoja oproti konkurencii.`}
      </p>
      <Testimonial
        text={`„Oliver dodal presne to, čo sme potrebovali — nástroj, ktorý nás zbavuje straty času zberom dát a namiesto toho odhaľuje cenné insighty.
          To, čo predtým zabralo hodiny ručnej práce vo verejných knižniciach reklám, teraz s AI analýzou trvá len pár minút.
          Spolupráca s Oliverom bola radosť: rýchlo reaguje, je technicky zdatný a vždy sa sústredí na dodanie reálnej hodnoty."`}
        name="Radek Štěpán"
        company="MarketUp"
        companyUrl="https://marketup.eu"
        profilePictureUrl="/images/case-studies/radek-stepan-profile-picture.jpg"
      />
      <div className="mb-16">
        <p>Chcete posunúť svoju firmu ako MarketUp? Zavolajte mi alebo mi napíšte:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Ak neviete, čo napísať, kľudne len „ahoj“, ozvem sa ;)`}
          <br />
          {`Zavolať môžete kedykoľvek. Ak to nezdvihnem, zavolám vám späť.`}
        </p>
      </div>
    </>
  );
}

export function CvSearchEngineArticleSk() {
  return (
    <>
      <p>
        <a href="https://atollon.com" target="_blank" className="underline">
          Atollon
        </a>
        {`, zavedená pražská spoločnosť vyvíjajúca ERP softvér, nás požiadala, aby sme pre ich klienta postavili nástroj, ktorý umožní nájsť ideálneho kandidáta v ich databáze 50 000+ životopisov. Bez takého nástroja neexistoval žiaden rozumný spôsob, ako v nej efektívne hľadať. Tisíce životopisov, každý v inom formáte a štruktúre — aj jednoduché vyhľadávanie podľa kľúčových slov tu naráža na strop. Museli sme postaviť robustné riešenie, ktoré si poradí s ľubovoľnou podobou životopisu a poskytne prehľadný štruktúrovaný profil každého kandidáta.`}
      </p>
      <p>
        {`Prvou úlohou bolo nejako dostať dáta zo všetkých dokumentov do jednotného štruktúrovaného formátu. Potrebovali sme dobrý OCR nástroj, ktorý si poradí aj s tými najpodivnejšími PDF. Po výskume a testovaní sme sa rozhodli pre `}
        <a href="https://unstructured.io" target="_blank" className="underline">
          unstructured.io
        </a>
        {`, ktorý v testoch podával najlepšie výsledky a navyše je open source — mohli sme si ho hostiť na vlastných serveroch a predísť tak akémukoľvek úniku dát. Po extrakcii sme dáta ešte vektorizovali, aby sa dali dotazovať sémantickým vyhľadávaním.`}
      </p>
      <p>
        {`Potom prišiel na rad samotný vyhľadávač. Aby správne zoraďoval kandidátov, potrebovali sme kombináciu sémantického vyhľadávania a štruktúrovaných filtrov (BM25). Sémantické vyhľadávanie hľadá najlepšie zhody s dopytom, štruktúrované filtre zužujú výsledky na najrelevantnejších kandidátov. K časti o extrakcii dát som ale ešte nedopovedal všetko. Okrem extrakcie a vektorizácie sme vytvorili aj jednotný štruktúrovaný formát pre zručnosti, vzdelanie a predchádzajúce pracovné skúsenosti. AI vezme extrahovaný text zo životopisu a namapuje ho do tohto formátu — vrátane rýchleho AI súhrnu kandidáta. Až vďaka tomu sme dosiahli špičkový výkon.`}
      </p>
      <p>
        {`Vďaka tomuto nástroju teraz klient Atollonu vyhľadáva jednoducho v prirodzenom jazyku. Zadá napríklad `}
        <i>
          „senior python developer s 10+ rokmi skúseností vo fintechu a titulom z
          informatiky z MIT“
        </i>
        {` a systém mu vyhodí ideálnych kandidátov zoradených od najlepšieho. Môžu sa konečne sústrediť na to, čo je skutočne dôležité, namiesto aby sa topili v tisícoch životopisov.`}
      </p>

      <div className="mb-16">
        <p>
          {`Chcete posunúť svoje procesy ako klient Atollonu? Zavolajte mi alebo mi napíšte:`}
        </p>
        <CaseStudyContactCopyButtons />
        <p>{`Ak neviete, čo napísať, kľudne len „ahoj“ a ozvem sa vám.`}</p>
      </div>
    </>
  );
}
