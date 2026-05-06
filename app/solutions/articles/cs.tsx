import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { Testimonial } from "@/components/testimonial";

export function MarketingAnalyzerArticleCs() {
  return (
    <>
      <p>
        <a href="https://marketup.eu" target="_blank" className="underline">
          MarketUp
        </a>
        {`, významná pražská marketingová agentura, dříve porovnávala reklamy svých klientů s konkurencí ručně. Procházení `}
        <a
          href="https://www.facebook.com/ads/library/"
          target="_blank"
          className="underline"
        >
          knihovny Meta Ads
        </a>
        {` a manuální porovnávání každé reklamy je nejen časově náročné, ale postrádá také kontext. Co když by chtěli porovnat průměrný dosah všech aktivních reklam za poslední měsíc, konkrétně na Instagramu? Museli by projít každou reklamu zvlášť, kopírovat dosah do tabulky a z té teprve generovat graf.`}
        <br />
        {`To prostě nedává smysl.`}
        <br />
        <br />
        {`Proto jsme vytvořili nástroj, který tuhle rutinní práci úplně eliminuje a nechá vás soustředit se na to důležité — na samotné čtení a analýzu dat, ne na jejich sběr. Stačí vybrat klientské a konkurenční stránky, které chcete porovnat (klidně i víc najednou!) a kliknout na analyzovat. Systém stáhne všechny reklamy z Mety, takže si je můžete okamžitě prohlédnout vedle sebe. Generuje také grafy, které ukážou dosah a cílové skupiny napříč všemi reklamami, takže se nemusíte dotknout žádné tabulky. Po asi minutě je AI analýza hotová a ukáže to skutečně podstatné — trendy, rozdíly a návrhy na zlepšení. Třeba uvidíte, že vaše tradiční carousel reklamy mají mediánový dosah, ale jedna video reklama má výrazně větší zásah — návrh? Dělejte víc video reklam!`}
        <br />
        {`AI analýza dokáže odhalit i hlubší vzorce — běží konkurence reklamy delší dobu? Soustředí se na konkrétní produkt nebo nabízí časově omezenou akci?`}
        <br />
        {`Až si data prohlédnete, můžete je se všemi grafy a insighty exportovat do PDF reportu a sdílet přímo s klientem.`}
        <br />
        <br />
        {`Díky tomuto systému teď MarketUp šetří čas a soustředí se na to, co je v jejich práci skutečně důležité, místo aby ztráceli čas s tabulkami. Zároveň přidávají hodnotu svým klientům tím, že jim k nástroji dávají přístup, takže si sami můžou ověřit, jak si jejich reklamy stojí oproti konkurenci.`}
      </p>
      <Testimonial
        text={`„Oliver dodal přesně to, co jsme potřebovali — nástroj, který nás zbavuje ztráty času sběrem dat a místo toho odhaluje cenné insighty.
          To, co dřív zabralo hodiny ruční práce ve veřejných knihovnách reklam, teď s AI analýzou trvá jen pár minut.
          Spolupráce s Oliverem byla radost: rychle reaguje, je technicky zdatný a vždy se soustředí na dodání reálné hodnoty."`}
        name="Radek Štěpán"
        company="MarketUp"
        companyUrl="https://marketup.eu"
        profilePictureUrl="/images/case-studies/radek-stepan-profile-picture.jpg"
      />
      <div className="mb-16">
        <p>Chcete posunout svou firmu jako MarketUp? Zavolejte mi nebo mi napište:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Pokud nevíte, co napsat, klidně jen „ahoj“, ozvu se ;)`}
          <br />
          {`Zavolat můžete kdykoli. Pokud to nezvednu, zavolám vám zpátky.`}
        </p>
      </div>
    </>
  );
}

export function CvSearchEngineArticleCs() {
  return (
    <>
      <p>
        <a href="https://atollon.com" target="_blank" className="underline">
          Atollon
        </a>
        {`, zavedená pražská společnost vyvíjející ERP software, nás požádala, abychom pro jejich klienta postavili nástroj, který umožní najít ideálního kandidáta v jejich databázi 50 000+ životopisů. Bez takového nástroje neexistoval žádný rozumný způsob, jak v ní efektivně hledat. Tisíce CVček, každé v jiném formátu a struktuře — i prosté hledání podle klíčových slov tu naráží na strop. Museli jsme postavit robustní řešení, které si poradí s libovolnou podobou životopisu a poskytne přehledný strukturovaný profil každého kandidáta.`}
      </p>
      <p>
        {`Prvním úkolem bylo nějak dostat data ze všech dokumentů do jednotného strukturovaného formátu. Potřebovali jsme dobrý OCR nástroj, který si poradí i s těmi nejrozmařanějšími PDF. Po výzkumu a testování jsme se rozhodli pro `}
        <a href="https://unstructured.io" target="_blank" className="underline">
          unstructured.io
        </a>
        {`, který v testech podával nejlepší výsledky a navíc je open source — mohli jsme si ho hostovat na vlastních serverech a předejít tak jakémukoli úniku dat. Po extrakci jsme data ještě vektorizovali, aby je šlo dotazovat sémantickým vyhledáváním.`}
      </p>
      <p>
        {`Pak přišel na řadu samotný vyhledávač. Aby správně řadil kandidáty, potřebovali jsme kombinaci sémantického vyhledávání a strukturovaných filtrů (BM25). Sémantické vyhledávání hledá nejlepší shody s dotazem, strukturované filtry zužují výsledky na nejrelevantnější kandidáty. K části o extrakci dat jsem ale ještě nedořekl všechno. Kromě extrakce a vektorizace jsme vytvořili také jednotný strukturovaný formát pro dovednosti, vzdělání a předchozí pracovní zkušenosti. AI vezme extrahovaný text z CVčka a zmapuje ho do tohoto formátu — včetně rychlého AI shrnutí kandidáta. Teprve díky tomu jsme dosáhli špičkového výkonu.`}
      </p>
      <p>
        {`Díky tomuto nástroji teď klient Atollonu vyhledává jednoduše v přirozeném jazyce. Zadá třeba `}
        <i>
          „senior python developer s 10+ lety zkušeností ve fintechu a titulem z
          informatiky z MIT“
        </i>
        {` a systém mu vyhodí ideální kandidáty seřazené od nejlepšího. Můžou se konečně soustředit na to, co je skutečně důležité, místo aby se topili v tisících CVček.`}
      </p>

      <div className="mb-16">
        <p>
          {`Chcete posunout své procesy jako klient Atollonu? Zavolejte mi nebo mi napište:`}
        </p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Pokud nevíte, co napsat, klidně jen „ahoj“ a ozvu se vám.`}
        </p>
      </div>
    </>
  );
}
