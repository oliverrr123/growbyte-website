import Link from "next/link";
import { MyFriendLegalPage } from "@/components/myfriend-legal-page";

export const metadata = { title: "Podmínky používání | DigiPřítel", description: "Podmínky používání rozhovorů s AI, připomínek a rodinných shrnutí DigiPřítele." };

export default function TermsPage() {
  return <MyFriendLegalPage title="Podmínky používání" locale="cs">
    <section><p>Tyto podmínky se vztahují na službu DigiPřítel (MyFriend), kterou provozuje GrowByte, Inc. Používáním služby s nimi souhlasíte. S dotazy se obraťte na <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>.</p></section>
    <section>
      <h2>Co DigiPřítel nabízí</h2>
      <p>DigiPřítel nabízí rozhovory s AI, naplánované pravidelné hovory, připomínky a volitelná shrnutí pro rodinu. Komunikujete s umělou inteligencí, nikoliv s člověkem. Funkce a jejich dostupnost závisí na vašem předplatném, nastavení, udělených souhlasech a podporovaných komunikačních kanálech.</p>
      <p>DigiPřítel není poskytovatelem zdravotní péče, tísňovou službou ani monitorovaným bezpečnostním systémem. Nemůže stanovit diagnózu, ověřit užití léků ani zaručit, že je někdo v pořádku. Odpovědi na připomínky a rodinná shrnutí vycházejí z dostupných informací z rozhovorů a mohou být neúplné nebo nesprávné. V naléhavé situaci kontaktujte místní tísňové služby.</p>
    </section>
    <section>
      <h2>Účty a souhlasy</h2>
      <p>K vytvoření účtu musíte být dospělí. Uvádějte správné kontaktní a platební údaje, přihlašovací kódy uchovávejte v soukromí a dejte nám vědět, pokud máte podezření na neoprávněný přístup.</p>
      <p>Pokud DigiPřítele nastavujete někomu jinému, vysvětlete mu službu a ujistěte se, že ji chce používat. Jeho přání určují, zda bude přijímat hovory a sdílet shrnutí s rodinou. Nepoužívejte službu ke kontaktování lidí bez jejich souhlasu.</p>
    </section>
    <section>
      <h2>Hovory, zprávy a rodinná shrnutí</h2>
      <p>Souhlasem s hovory nebo zprávami souhlasíte s přijímáním komunikace podle svého nastavení, včetně automatických hovorů, připomínek, zpráv k účtu a vyžádaných rodinných shrnutí. Četnost závisí na službě a uložených preferencích. Operátor může účtovat poplatky za zprávy, data nebo hovory.</p>
      <p>DigiPřítele můžete požádat o zastavení naplánovaných hovorů nebo změnu sdílení. S ukončením komunikace vám také pomůžeme na kontaktním e-mailu. Doručení se může zpozdit nebo selhat kvůli operátorovi, síti či poskytovateli. Zpráva o nepřijatém hovoru sama o sobě neznamená, že je člověk v nebezpečí. Ani nepřítomnost zprávy neznamená, že je v bezpečí.</p>
    </section>
    <section>
      <h2>Předplatné a zrušení</h2>
      <p>Cena, fakturační období a případné zkušební nebo akční podmínky se zobrazují při platbě. Opakované předplatné se obnovuje a účtuje na zvolenou platební metodu až do zrušení. Objednáním předplatného tyto opakované platby povolujete.</p>
      <p>Otevřete <Link href="/digipritel/dashboard">správu účtu</Link>, zvolte nastavení a následně správu předplatného („Spravovat předplatné“), která otevře platební portál Stripe. Zrušte předplatné před dalším obnovením, aby se další platba nestrhla. S žádostí o pomoc nebo vrácení peněz se obraťte na <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>. Vypnutí hovorů samo o sobě placené předplatné nezruší.</p>
      <p>Jako spotřebitel v EU máte zpravidla 14 dní od uzavření smlouvy o online službě na odstoupení bez udání důvodu. Napište na <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a> e-mail svého účtu, datum objednávky a jasné prohlášení, že chcete odstoupit. Samotné používání DigiPřítele neznamená vzdání se zákonného práva na odstoupení či vrácení peněz. Případné srážky za již poskytnuté služby musí umožňovat příslušné právní předpisy. Vaše zákonná práva v případě vadné služby nebo služby neodpovídající popisu zůstávají zachována.</p>
    </section>
    <section>
      <h2>Odpovědné používání</h2>
      <p>Nepoužívejte DigiPřítele k protiprávní činnosti, obtěžování, vydávání se za jinou osobu, nevyžádané komunikaci ani k narušování služby či pokusům o neoprávněný přístup. K poskytnutí údajů jiné osoby musíte mít oprávnění.</p>
      <p>Práva k poskytnutému obsahu vám zůstávají. Dovolujete nám a našim poskytovatelům zpracovávat jej v rozsahu potřebném k poskytování služby, včetně vytváření odpovědí, připomínek a povolených shrnutí. Zacházení s osobními údaji popisují naše <Link href="/digipritel/soukromi">zásady ochrany soukromí</Link>.</p>
    </section>
    <section>
      <h2>Dostupnost a změny</h2>
      <p>Snažíme se udržovat DigiPřítele dostupného, nezaručujeme však nepřetržitý přístup, doručení každého hovoru či zprávy ani správnost výstupů AI. Můžeme upravovat funkce, řešit technické potíže nebo pozastavit přístup, abychom zabránili zneužití či splnili zákonné povinnosti.</p>
      <p>Tyto podmínky můžeme aktualizovat; datum změny uvedeme na této stránce. Žádné ustanovení neomezuje práva ani prostředky nápravy, které podle příslušných spotřebitelských předpisů nelze vyloučit.</p>
    </section>
  </MyFriendLegalPage>;
}
