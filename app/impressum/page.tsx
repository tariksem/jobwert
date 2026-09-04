import {legal,legalReady} from '../legal';

export default function Page(){
  return <main className="card legalPage">
    <h1>Impressum</h1>
    {!legalReady&&<div className="legalWarning"><strong>Noch nicht für den öffentlichen Launch konfiguriert.</strong><p>Für das Impressum fehlen öffentliche Anbieterangaben. Die Website bleibt deshalb weiterhin auf noindex.</p></div>}
    {legalReady&&<>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>{legal.name}<br/>{legal.address}</p>
      <h2>Kontakt</h2>
      <p>E-Mail: <a href={`mailto:${legal.email}`}>{legal.email}</a>{legal.phone&&<><br/>Telefon: {legal.phone}</>}</p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>{legal.name}<br/>{legal.address}</p>
    </>}
    <p className="legalNote">JobWert stellt Rechen- und Entscheidungshilfen bereit und ersetzt keine Steuer-, Rechts- oder Finanzberatung.</p>
    <a href="/">Zurück zu JobWert</a>
  </main>;
}
