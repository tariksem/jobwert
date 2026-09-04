import type {Metadata} from 'next';

export const metadata:Metadata={title:'Premium Jobwechsel-Bericht | JobWert',description:'Verdichte deinen Jobvergleich zu einem klaren Entscheidungsbericht mit Break-even, Zielgehalt, Zeitvergleich und Verhandlungsgrundlage.'};

export default function Page(){
  const checkout=process.env.NEXT_PUBLIC_PREMIUM_REPORT_URL||'';
  const price=process.env.NEXT_PUBLIC_PREMIUM_REPORT_PRICE||'9,90';
  return <main className="landing"><div className="brand"><a href="/"><strong>Job</strong>Wert</a></div><h1>Premium Jobwechsel-Bericht</h1><p>Ein kompakter Entscheidungsbericht für deinen Jobwechsel: finanzielle Differenz, Break-even, Zielgehalt, Zeitvergleich und eine strukturierte Grundlage für deine Gehaltsverhandlung.</p><section className="premiumCard"><div><span>Einmalig</span><strong>{price} €</strong></div><div><h2>Geplant für den Bericht</h2><ul><li>Zusammenfassung beider Jobangebote</li><li>Monatlicher und jährlicher finanzieller Unterschied</li><li>Break-even- und Zielgehalt</li><li>Arbeits- und Pendelzeitvergleich</li><li>Argumentationsgrundlage für die Gehaltsverhandlung</li><li>Downloadbare, druckfreundliche Zusammenfassung</li></ul></div>{checkout?<a className="cta" href={checkout} rel="nofollow sponsored">Premium-Bericht kaufen</a>:<div className="legalWarning"><strong>Checkout noch nicht aktiviert.</strong><p>Die Produktseite ist technisch vorbereitet. Sobald der Zahlungslink konfiguriert ist, kann der Verkauf ohne eigenes Payment-Backend starten.</p></div>}</section><p className="negotiationHint">Der Bericht ist eine Entscheidungshilfe und keine Steuer-, Rechts- oder Finanzberatung.</p><footer><span>© 2026 JobWert</span><a href="/datenschutz">Datenschutz</a><a href="/impressum">Impressum</a></footer></main>;
}
