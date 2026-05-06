import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { Testimonial } from "@/components/testimonial";

export function MarketingAnalyzerArticleDe() {
  return (
    <>
      <p>
        <a href="https://marketup.eu" target="_blank" className="underline">
          MarketUp
        </a>
        {`, eine große Marketing-Agentur in Prag, hat die Anzeigen ihrer Kunden früher manuell mit denen der Konkurrenz verglichen. Die `}
        <a
          href="https://www.facebook.com/ads/library/"
          target="_blank"
          className="underline"
        >
          Meta Ad Library
        </a>
        {` durchzugehen und jede Anzeige einzeln zu vergleichen ist nicht nur extrem zeitaufwändig, es fehlt auch der Kontext. Was, wenn man die durchschnittliche Reichweite aller aktiven Anzeigen des letzten Monats vergleichen will, speziell auf Instagram? Dann müsste man jede Anzeige einzeln öffnen, die Reichweite in eine Tabelle kopieren und daraus erst ein Diagramm erstellen.`}
        <br />
        {`Das ergibt einfach keinen Sinn.`}
        <br />
        <br />
        {`Deshalb haben wir ein Tool gebaut, das diese Routinearbeit komplett wegnimmt und dich auf das Wesentliche konzentrieren lässt — auf das tatsächliche Lesen und Analysieren der Daten, nicht auf das Sammeln. Du wählst einfach die Kunden- und Wettbewerber-Seiten aus, die du vergleichen willst (gerne auch mehrere auf einmal!) und klickst auf Analysieren. Das System zieht alle Anzeigen aus Meta, sodass du sie sofort nebeneinander einsehen kannst. Es generiert auch Diagramme, die dir Reichweite und Zielgruppen über alle Anzeigen hinweg auf einen Blick zeigen — ohne dass du eine einzige Tabelle anfassen musst. Nach etwa einer Minute ist die KI-Analyse fertig und liefert dir das wirklich Wichtige — Trends, Unterschiede und konkrete Verbesserungsvorschläge. Du siehst zum Beispiel, dass deine klassischen Carousel-Anzeigen im Median liegen, aber eine Video-Anzeige eine deutlich höhere Reichweite hat — Vorschlag? Mach mehr Video-Anzeigen!`}
        <br />
        {`Die KI-Analyse erkennt auch tiefere Muster — schaltet die Konkurrenz ihre Anzeigen länger? Konzentriert sie sich auf ein bestimmtes Produkt oder läuft gerade ein zeitlich begrenztes Angebot?`}
        <br />
        {`Wenn du die Daten ausgewertet hast, kannst du sie mit allen Diagrammen und Insights als PDF-Report exportieren und direkt mit deinem Kunden teilen.`}
        <br />
        <br />
        {`Dank dieses Systems spart MarketUp jetzt Zeit und konzentriert sich auf den wirklich wichtigen Teil ihrer Arbeit, anstatt sich mit Tabellen aufzuhalten. Gleichzeitig liefern sie ihren Kunden zusätzlichen Mehrwert, indem sie ihnen Zugang zum Tool geben — so können sie selbst sehen, wie ihre Anzeigen im Vergleich zur Konkurrenz performen.`}
      </p>
      <Testimonial
        text={`„Oliver hat genau das geliefert, was wir brauchten — ein Tool, mit dem wir keine Zeit mehr mit dem Sammeln von Daten verschwenden, sondern stattdessen wertvolle Insights aufdecken.
          Was früher stundenlange Handarbeit in öffentlichen Anzeigen-Bibliotheken bedeutete, geschieht jetzt mit KI-Analyse in Minuten.
          Mit Oliver zu arbeiten war ein Vergnügen: schnelle Reaktion, technisch versiert und immer mit Fokus auf echtem Mehrwert."`}
        name="Radek Štěpán"
        company="MarketUp"
        companyUrl="https://marketup.eu"
        profilePictureUrl="/images/case-studies/radek-stepan-profile-picture.jpg"
      />
      <div className="mb-16">
        <p>Willst du dein Unternehmen auf das nächste Level bringen, genau wie MarketUp? Ruf mich an oder schreib mir:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`Falls du nicht weißt, was du schreiben sollst — ein einfaches „hi“ reicht, ich melde mich ;)`}
          <br />
          {`Anrufen kannst du jederzeit. Falls ich nicht rangehe, rufe ich dich zurück.`}
        </p>
      </div>
    </>
  );
}

export function CvSearchEngineArticleDe() {
  return (
    <>
      <p>
        <a href="https://atollon.com" target="_blank" className="underline">
          Atollon
        </a>
        {`, ein etabliertes ERP-Softwareunternehmen aus Prag, hat uns gebeten, für einen ihrer Kunden ein Tool zu bauen, mit dem dieser den perfekten Bewerber in einer Datenbank von 50 000+ Lebensläufen finden kann. Ohne ein solches Tool gab es schlichtweg keine sinnvolle Möglichkeit, dort etwas zu finden. Tausende Lebensläufe, jeder in einem anderen Format und einer anderen Struktur — selbst eine simple Stichwortsuche stößt da an ihre Grenzen. Wir mussten eine robuste Lösung bauen, die mit jeder erdenklichen Lebenslauf-Variante umgehen kann und einen aussagekräftigen, strukturierten Überblick über jeden Kandidaten liefert.`}
      </p>
      <p>
        {`Die erste Herausforderung war, alle Daten aus den Dokumenten irgendwie in ein einheitliches strukturiertes Format zu bringen. Wir brauchten ein gutes OCR-Tool, das selbst die seltsamsten PDFs zuverlässig parst. Nach Recherche und Tests haben wir uns für `}
        <a href="https://unstructured.io" target="_blank" className="underline">
          unstructured.io
        </a>
        {` entschieden — es lieferte in unseren Tests die besten Ergebnisse und ist außerdem Open Source, sodass wir es auf unseren eigenen Servern hosten und Datenlecks komplett ausschließen konnten. Nach der Extraktion haben wir die Daten zusätzlich vektorisiert, damit sie sich per semantischer Suche abfragen lassen.`}
      </p>
      <p>
        {`Als Nächstes die Suchmaschine selbst. Um die Kandidaten korrekt zu ranken, brauchten wir eine Kombination aus semantischer Suche und strukturierten Filtern (BM25). Die semantische Suche findet die besten Treffer für die Suchanfrage, die strukturierten Filter grenzen die Ergebnisse auf die relevantesten Kandidaten ein. Aber zur Datenextraktion habe ich noch nicht alles erzählt. Neben Extraktion und Vektorisierung haben wir auch ein einheitliches strukturiertes Format für Skills, Ausbildung und bisherige Berufserfahrung definiert. Die KI nimmt den extrahierten Text aus dem Lebenslauf und mappt ihn in dieses Format — inklusive einer kurzen KI-Zusammenfassung des Kandidaten. Erst dadurch konnten wir Spitzenleistung erreichen.`}
      </p>
      <p>
        {`Dank dieses Tools kann der Atollon-Kunde jetzt einfach in natürlicher Sprache suchen. Zum Beispiel: `}
        <i>
          „Senior Python-Entwickler mit 10+ Jahren Erfahrung im Fintech-Bereich
          und einem Informatik-Abschluss vom MIT“
        </i>
        {` — und das System liefert ihm die perfekten Kandidaten, von best zu worst geordnet. Sie können sich endlich auf das konzentrieren, was wirklich wichtig ist, anstatt in tausenden Lebensläufen unterzugehen.`}
      </p>

      <div className="mb-16">
        <p>
          {`Willst du deine Prozesse genauso aufs nächste Level bringen wie der Atollon-Kunde? Ruf mich an oder schreib mir:`}
        </p>
        <CaseStudyContactCopyButtons />
        <p>{`Falls du nicht weißt, was du schreiben sollst — ein einfaches „hi“ reicht, ich melde mich.`}</p>
      </div>
    </>
  );
}
