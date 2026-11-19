import { MyFriendLegalPage } from "@/components/myfriend-legal-page";

export const metadata = { title: "Ochrana soukromí | DigiPřítel", description: "Jak DigiPřítel pracuje s údaji o účtu, rozhovory, připomínkami a rodinnými shrnutími." };

export default function PrivacyPage() {
  return <MyFriendLegalPage title="Ochrana soukromí" locale="cs">
    <section>
      <p>DigiPřítel (MyFriend) je AI společník provozovaný společností GrowByte, Inc. Tyto zásady vysvětlují, jak nakládáme s osobními údaji při návštěvě webu, založení účtu, hovorech s DigiPřítelem nebo přijímání rodinných shrnutí.</p>
      <p>S dotazy a žádostmi týkajícími se soukromí se obraťte na <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>.</p>
    </section>
    <section>
      <h2>Jaké údaje shromažďujeme</h2>
      <p>Údaje o účtu a nastavení zahrnují jména, e-mailové adresy, telefonní čísla, váš vztah k uživateli DigiPřítele, časová pásma, zvolené preference a stav předplatného. Pokud službu zařizujete někomu jinému, můžete některé z těchto údajů poskytnout za něj.</p>
      <p>Rozhovory mohou být nahrávány, přepisovány a shrnovány. Zpracováváme informace sdílené v hovorech a zprávách, včetně zájmů, preferencí, připomínek a zdravotních údajů, o kterých se rozhodnete mluvit. Uchováváme také pokusy o volání, výsledky hovorů, udělené souhlasy a informace o doručení zpráv.</p>
      <p>Web shromažďuje technické údaje a informace o používání, například o prohlížeči a zařízení, IP adresách, navštívených stránkách a průběhu nastavení služby. Cookies a podobné technologie slouží k přihlašování a analytice. Platby zpracovává Stripe; dostáváme informace o platbách a předplatném, nikoliv úplné údaje o vaší kartě.</p>
    </section>
    <section>
      <h2>Jak údaje používáme</h2>
      <p>Údaje používáme k poskytování a přizpůsobení rozhovorů, zapamatování preferencí, plánování hovorů a připomínek, správě účtů a plateb, poskytování podpory, řešení problémů s doručováním, prevenci zneužití a porozumění službě a jejímu zlepšování.</p>
      <p>DigiPřítel využívá AI ke zpracování rozhovorů a vytváření odpovědí a shrnutí. Tyto výstupy mohou být nepřesné. Nesdílejte prosím informace, které nechcete, aby služba zpracovávala.</p>
    </section>
    <section>
      <h2>Webová analytika a cookies</h2>
      <p>Cookies a úložiště prohlížeče používáme pro přihlášení, platby, uložené preference a webovou analytiku. PostHog nám pomocí identifikátorů prohlížeče pomáhá porozumět používání webu, krokům nastavení a výsledkům plateb. Analytika může začít při návštěvě webu.</p>
      <p>Cookies a úložiště webu můžete spravovat v nastavení prohlížeče. Blokování nezbytného úložiště může ovlivnit přihlášení nebo platbu. S dotazy k analytickým údajům nebo žádostmi týkajícími se soukromí se obraťte na <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>.</p>
    </section>
    <section>
      <h2>Rodinná shrnutí a vaše volby</h2>
      <p>Pokud uživatel DigiPřítele souhlasí se sdílením s rodinou, můžeme rodinnému kontaktu v účtu posílat krátká shrnutí. Mohou obsahovat zajímavosti z běžných rozhovorů, odpovědi na připomínky, nepřijaté hovory nebo uložené preference volání. Účelem je shrnout podstatné informace, nikoliv přeposílat úplné přepisy.</p>
      <p>Souhlas s přijímáním hovorů a souhlas se sdílením rodinných shrnutí jsou samostatné volby. Zaplacení předplatného za někoho jiného nenahrazuje jeho souhlas se sdílením. O změnu nastavení volání nebo sdílení můžete požádat DigiPřítele nebo kontaktovat nás.</p>
    </section>
    <section>
      <h2>Poskytovatelé služeb a předávání údajů</h2>
      <p>Využíváme poskytovatele hostingu, ukládání dat, zpracování rozhovorů pomocí AI, telefonních hovorů, zpráv, plateb, e-mailů a analytiky. Podle používaných služeb mezi ně patří ElevenLabs, Photon, Twilio, Stripe a PostHog. Poskytovatelé zpracovávají údaje potřebné pro tyto činnosti. Údaje mohou být zpracovávány i mimo vaši zemi, včetně Spojených států.</p>
      <p>Údaje můžeme předat také tehdy, vyžaduje-li to zákon, při řešení podvodů nebo bezpečnostních incidentů, k ochraně práv a bezpečnosti osob nebo v souvislosti s převodem podniku.</p>
    </section>
    <section>
      <h2>Uchovávání, zabezpečení a žádosti</h2>
      <p>Doba uchovávání závisí na druhu údajů a důvodu jejich potřeby, včetně poskytování služby, vedení historie účtu, řešení sporů a plnění zákonných povinností. S dotazy na uchovávání nebo žádostmi o výmaz nás kontaktujte. Některé údaje mohou zůstat v účetních záznamech, zálohách nebo záznamech vyžadovaných zákonem.</p>
      <p>Žádná online služba nemůže zaručit absolutní zabezpečení. Podle místa bydliště můžete mít právo na přístup k údajům, jejich opravu, výmaz či kopii, omezení zpracování nebo námitku proti němu, odvolání souhlasu či podání stížnosti dozorovému úřadu. Žádosti zasílejte na <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>; může být nutné ověřit vaši totožnost.</p>
      <p>Odvolání souhlasu nemá vliv na zákonnost předchozího zpracování. Svá práva můžete uplatňovat u vlastních údajů; před zpřístupněním údajů o rozhovorech jiné osoby musíme ověřit oprávnění. V EHP se můžete obrátit na místní dozorový úřad, včetně českého Úřadu pro ochranu osobních údajů na <a href="https://uoou.gov.cz/">uoou.gov.cz</a>.</p>
    </section>
    <section>
      <h2>Děti a aktualizace zásad</h2>
      <p>DigiPřítel je určen dospělým, nikoliv dětem. Pokud dítě poskytlo osobní údaje, kontaktujte nás. Tyto zásady můžeme při změnách služby aktualizovat; nové datum uvedeme na této stránce.</p>
    </section>
  </MyFriendLegalPage>;
}
