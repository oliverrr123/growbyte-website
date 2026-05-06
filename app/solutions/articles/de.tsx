import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { MuxVideo } from "@/components/mux-video";

export function ChatbotArticleDe() {
  return (
    <>
      <p>
        {`Hast du schon mal einen Chatbot auf irgendeiner Website ausprobiert? Nicht so toll, oder? Muss aber nicht so sein. Vor AI waren Chatbots auf Websites nicht besonders beliebt, weil sie schlicht nicht gut funktioniert haben. Sie konnten nur vordefinierte Fragen beantworten, und sobald du etwas auch nur leicht anders gefragt hast, sind sie komplett auseinandergefallen. Aber jetzt mit AI können wir echten menschenähnlichen Support liefern! (vielleicht sogar besser als ein Mensch...)`}
      </p>
      <p>
        {`Stell dir das mal vor. Du gehst auf eine Website und willst den Preis für eine bestimmte Dienstleistung herausfinden. Anstatt dich durch alle Unterseiten zu klicken und es manuell zu suchen, siehst du unten rechts einen Chatbot, der dir deine Frage schon vorschlägt! „Was kostet X?", du klickst drauf, fragst nach dem, was du wissen willst, und bekommst sofort den Preis mit allen wichtigen Details. Dann schlägt er vor: „Möchtest du einen kurzen Call buchen, in dem wir besprechen, wie wir dir noch weiter helfen können?", du wählst einfach einen Termin und es ist gebucht! Alles in wenigen Sekunden.`}
      </p>
      <p>
        {`Und jetzt stell dir das Ganze auf deiner Website vor. Deine Besucher bekommen alle Informationen, die sie brauchen, du bekommst weniger Anrufe, und ohne einen Finger zu rühren bekommst du neue Leads und gebuchte Calls!`}
      </p>
      <p>
        {`Du kannst dir das 40-Sekunden-Demo ansehen, um es in Aktion zu sehen:`}
      </p>

      <div className="my-6 w-full">
        <MuxVideo
          playbackId="JwfhdQQrUUQFeFPeD3SZ8S5oTyaek01j5b01A9qTjTpfQ"
          title="chatbot-demo"
          aspectRatio="1624 / 1080"
        />
      </div>

      <div className="mb-16">
        <p>Willst du das auch auf deiner Website? Ruf mich an oder schreib mir:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Falls du nicht weißt, was du schreiben sollst — ein einfaches „hi" reicht, ich melde mich.`}
        </p>
      </div>
    </>
  );
}

export function AutomailerArticleDe() {
  return (
    <>
      <p>
        {`Ich wurde mal von einer Firma engagiert, um ihren Cold-Email-Outreach-Prozess zu automatisieren. Ihr Setup: ein Sales-Mitarbeiter mit einem Spreadsheet voller Leads, der sich jede einzelne Website angeschaut, studiert und dann manuell eine personalisierte Email geschrieben hat. Klingt das nach dir? Na Gott sei Dank liest du das hier, denn das musst du jetzt nicht mehr machen!`}
      </p>
      <p>
        {`Statt der ganzen manuellen Arbeit übernimmt das alles unsere AI für dich. Du gibst ihr nur eine Liste mit Leads, eine kurze Idee, was die Email vermitteln soll, und deine Zielgruppe. Moment, du hast keine Leads? Kein Problem! Unsere AI generiert sie dir basierend auf deinem idealen Kunden. Dann sagst du nur noch, wie viele Emails du pro Tag verschicken willst, und zack, schon verschickst du täglich hunderte personalisierte Emails und musst dafür nicht mal einen Finger rühren.`}
      </p>

      <div className="mb-16">
        <p>Bereit, dir das Leben einfacher zu machen? Ruf mich an oder schreib mir:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Falls du nicht weißt, was du schreiben sollst — ein einfaches „hi" reicht, ich melde mich.`}
        </p>
      </div>
    </>
  );
}
