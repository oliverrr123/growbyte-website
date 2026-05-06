import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { MuxVideo } from "@/components/mux-video";

export function ChatbotArticleCs() {
  return (
    <>
      <p>
        {`Už jste někdy zkoušeli chatbota na nějakém webu? Nic moc, že? No, nemusí to tak být. Před AI nebyli chatboti na webech moc oblíbení, protože pořádně nefungovali. Uměli odpovědět jen na předdefinované otázky a když jste se zeptali na něco trochu jiného, prostě se rozsypali. Ale teď s AI můžeme mít skutečnou lidskou podporu! (možná ještě lepší než člověka...)`}
      </p>
      <p>
        {`Představte si to takhle. Přijdete na web a chcete zjistit cenu konkrétní služby, kterou hledáte. Místo abyste proklikávali všechny stránky a snažili se to ručně najít, všimnete si vpravo dole chatbota, který už vám rovnou nabízí vaši otázku! „Jaká je cena X?", tak na ni kliknete, zeptáte se přesně na to, co potřebujete, a chatbot vám okamžitě dá cenu se všemi důležitými detaily. Pak navrhne: „Chcete si zarezervovat krátký hovor, kde můžeme probrat, jak vám můžeme dál pomoct?", vy si jen vyberete čas a je rezervováno! A to celé během pár sekund.`}
      </p>
      <p>
        {`A teď si představte tohle na svém webu. Vaši návštěvníci dostanou všechny informace, které potřebují, vám se sníží počet hovorů a aniž byste hnuli prstem, získáváte nové leady a zarezervované hovory!`}
      </p>
      <p>
        {`Můžete se podívat na 40sekundové demo, ať to vidíte v akci:`}
      </p>

      <div className="my-6 w-full">
        <MuxVideo
          playbackId="JwfhdQQrUUQFeFPeD3SZ8S5oTyaek01j5b01A9qTjTpfQ"
          title="chatbot-demo"
          aspectRatio="1624 / 1080"
        />
      </div>

      <div className="mb-16">
        <p>Chcete tohle na svém webu? Zavolejte mi nebo mi napište:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Pokud nevíte, co napsat, klidně jen „ahoj" a ozvu se vám.`}
        </p>
      </div>
    </>
  );
}

export function AutomailerArticleCs() {
  return (
    <>
      <p>
        {`Jednou si mě najala firma, abych jim zautomatizoval rozesílání cold emailů. Jejich setup byl obchodník s tabulkou leadů, který si proklikal každý web, prostudoval ho a pak ručně napsal personalizovaný email. Zní vám to povědomě? No díky bohu, že tohle čtete, protože tohle už dělat nebudete muset!`}
      </p>
      <p>
        {`Místo veškeré té ruční práce to za vás udělá naše AI. Stačí jí dát seznam leadů, krátkou představu, co má email komunikovat, a vaši cílovou skupinu. Počkat, žádné leady nemáte? Žádný problém! Naše AI vám je vygeneruje na základě vašeho ideálního zákazníka. Pak jen řeknete, kolik emailů denně chcete posílat, a šup, najednou rozesíláte stovky personalizovaných emailů každý den a nemusíte pro to vůbec nic dělat.`}
      </p>

      <div className="mb-16">
        <p>Připraveni si zjednodušit život? Zavolejte mi nebo mi napište:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Pokud nevíte, co napsat, klidně jen „ahoj" a ozvu se vám.`}
        </p>
      </div>
    </>
  );
}
