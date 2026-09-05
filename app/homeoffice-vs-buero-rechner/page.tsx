import type {Metadata} from 'next';

export const metadata:Metadata={
  title:'Homeoffice vs. Büro Rechner: Was lohnt sich mehr? | JobWert',
  description:'Vergleiche Homeoffice und Büro nach Nettogehalt, Pendelzeit, Pendelkosten, Arbeitszeit und verfügbarem Einkommen. Kostenloser JobWert-Rechner für Deutschland.',
  alternates:{canonical:'/homeoffice-vs-buero-rechner'}
};

const faq=[
  ['Ist Homeoffice finanziell immer besser?','Nein. Homeoffice kann Pendelzeit und bestimmte Fahrtkosten reduzieren, aber entscheidend bleiben Gehalt, Wohnkosten, weitere laufende Kosten und die konkrete Zahl der Bürotage. JobWert stellt diese Faktoren getrennt gegenüber.'],
  ['Wie wird die Pendelzeit berechnet?','Du gibst die einfache Fahrzeit ein. JobWert berücksichtigt Hin- und Rückweg für die Bürotage und zeigt daraus die wöchentliche Gesamtzeitbelastung.'],
  ['Werden Pendelkosten automatisch durch Homeoffice reduziert?','Nein. Die monatlichen Pendelkosten werden als eigener Eingabewert verwendet. So kannst du deine tatsächlichen Kosten selbst angeben, statt mit einer pauschalen Annahme zu rechnen.'],
  ['Kann ein Job mit weniger Gehalt durch mehr Homeoffice trotzdem besser sein?','Ja. Weniger Pendelzeit, geringere laufende Kosten und ein höherer effektiver Stundenwert können einen niedrigeren Bruttolohn teilweise oder vollständig ausgleichen. Der Rechner zeigt Geld und Zeit deshalb getrennt.']
];

export default function Page(){
  const faqLd={
    '@context':'https://schema.org',
    '@type':'FAQPage',
    mainEntity:faq.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))
  };

  return <main className="landing">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqLd)}} />
    <div className="brand"><a href="/"><strong>Job</strong>Wert</a><small> · Bessere Entscheidungen. Mehr vom Leben.</small></div>
    <header>
      <h1>Homeoffice vs. Büro: Welches Jobmodell lohnt sich wirklich?</h1>
      <p>Ein höheres Gehalt ist nicht automatisch das bessere Angebot. Vergleiche Homeoffice und Büro nach geschätztem Nettogehalt, Pendelzeit, Pendelkosten, Arbeitszeit, Wohnkosten und verfügbarem Einkommen.</p>
      <a className="cta" href="/#rechner">Homeoffice und Büro vergleichen</a>
    </header>
    <section className="details">
      <h2>Homeoffice und Büro nicht nur nach Bruttogehalt vergleichen</h2>
      <p>Zwei Jobs können auf dem Papier ähnlich wirken und sich im Alltag trotzdem deutlich unterscheiden. Zusätzliche Bürotage bedeuten häufig mehr Pendelzeit und höhere Fahrtkosten. Mehr Homeoffice kann dagegen Zeit sparen, ohne dass sich das Bruttogehalt verändert. JobWert kombiniert deshalb Geld- und Zeitfaktoren in einem direkten Vergleich.</p>

      <h2>Pendelkosten und Pendelzeit getrennt berücksichtigen</h2>
      <p>Die monatlichen Pendelkosten gibst du selbst ein. Zusätzlich hinterlegst du die einfache Fahrzeit und die Zahl der Homeoffice-Tage. Daraus ergibt sich die Pendelzeit pro Woche. Die Kosten werden bewusst nicht automatisch aus den Homeoffice-Tagen abgeleitet, weil Ticket, Auto, Leasing oder andere Mobilitätskosten sehr unterschiedlich sein können.</p>

      <h2>Wie viele Stunden kostet dich der Job wirklich?</h2>
      <p>Zur vertraglichen Arbeitszeit kommt bei Bürotagen die Hin- und Rückfahrt hinzu. Ein Angebot mit 40 Wochenstunden und langer Anfahrt kann deshalb deutlich mehr persönliche Zeit beanspruchen als ein Job mit ähnlicher Arbeitszeit und mehreren Homeoffice-Tagen.</p>

      <h2>Effektiver Stundenwert inklusive Pendeln</h2>
      <p>JobWert setzt das verfügbare Einkommen ins Verhältnis zur gesamten wöchentlichen Zeitbelastung aus Arbeit und Pendeln. So erkennst du, ob ein höheres Gehalt den zusätzlichen Zeitaufwand tatsächlich kompensiert oder ob ein flexibleres Modell pro eingesetzter Stunde attraktiver ist.</p>

      <h2>Beispiel: weniger Gehalt, aber mehr Homeoffice</h2>
      <p>Ein Job kann trotz niedrigerem Brutto interessant sein, wenn du dadurch deutlich weniger pendelst, niedrigere laufende Kosten hast oder mehr freie Zeit gewinnst. Für genau diesen Fall gibt es zusätzlich die Seite <a href="/weniger-gehalt-mehr-homeoffice">Weniger Gehalt, mehr Homeoffice</a>.</p>

      <h2>Wann ist das Büro-Angebot trotzdem besser?</h2>
      <p>Wenn das höhere verfügbare Einkommen die zusätzlichen Kosten und den Zeitaufwand klar übersteigt, kann ein Bürojob die bessere Wahl sein. Für einen umfassenden Wechselvergleich kannst du auch den <a href="/jobwechsel-rechner">Jobwechsel-Rechner</a> oder den Vergleich für <a href="/jobangebote-vergleichen">zwei Jobangebote</a> nutzen.</p>

      <h2>Häufige Fragen</h2>
      {faq.map(([q,a])=><div key={q}><h3>{q}</h3><p>{a}</p></div>)}

      <p><a className="cta" href="/#rechner">Jetzt Homeoffice und Büro vergleichen</a></p>
    </section>
    <footer><span>© 2026 JobWert</span><a href="/methodik">Methodik</a><a href="/datenschutz">Datenschutz</a><a href="/impressum">Impressum</a></footer>
  </main>
}
