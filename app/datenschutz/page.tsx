import {legal,legalReady} from '../legal';

export default function Page(){
  return <main className="card legalPage">
    <h1>Datenschutzerklärung</h1>
    {!legalReady&&<div className="legalWarning"><strong>Hinweis vor dem öffentlichen Launch</strong><p>Die verantwortliche Stelle ist noch nicht mit den finalen öffentlichen Kontaktdaten konfiguriert. Die Website bleibt deshalb weiterhin auf noindex.</p></div>}

    <h2>1. Verantwortliche Stelle</h2>
    {legalReady?<p>{legal.name}<br/>{legal.address}<br/>E-Mail: <a href={`mailto:${legal.email}`}>{legal.email}</a></p>:<p>Wird vor dem öffentlichen Launch mit den finalen Anbieterangaben ergänzt.</p>}

    <h2>2. Verarbeitung im Rechner</h2>
    <p>Die von dir in den JobWert-Rechner eingegebenen Vergleichsdaten werden im Browser verarbeitet. JobWert betreibt für diese Eingaben keine eigene serverseitige Speicherung.</p>

    <h2>3. Geteilte Vergleichslinks</h2>
    <p>Wenn du die Funktion „Vergleich teilen“ verwendest, werden die eingegebenen Vergleichswerte in der URL als Abfrageparameter gespeichert. Wer den Link erhält, kann diese Werte sehen. Teile solche Links daher nur mit Personen, denen du die enthaltenen Angaben zeigen möchtest.</p>

    <h2>4. Hosting</h2>
    <p>Die Website wird über Cloudflare Pages bereitgestellt. Beim Aufruf der Website können technisch notwendige Verbindungs- und Protokolldaten, insbesondere IP-Adresse, Zeitpunkt des Zugriffs und angeforderte Ressource, durch den Hosting-Anbieter verarbeitet werden, um die Website auszuliefern sowie Sicherheit und Stabilität zu gewährleisten.</p>

    <h2>5. Optionale Reichweitenmessung</h2>
    {legal.gaId?<p>Google Analytics wird nur geladen, wenn du im Einwilligungsbanner ausdrücklich zustimmst. Ohne Zustimmung wird das Analytics-Skript nicht geladen. Deine Auswahl wird lokal im Browser gespeichert. Die Konfiguration deaktiviert Google Signals und personalisierte Werbesignale.</p>:<p>Aktuell ist keine externe Reichweitenmessung aktiviert. Die Anwendung enthält lediglich die technische Möglichkeit, Analytics später nach Einwilligung zu aktivieren.</p>}

    <h2>6. Lokale Speicherung</h2>
    <p>Für die Speicherung deiner Analytics-Auswahl wird ausschließlich ein Eintrag im Local Storage deines Browsers verwendet. Die Rechnerwerte selbst werden dadurch nicht dauerhaft gespeichert.</p>

    <h2>7. Deine Rechte</h2>
    <p>Dir können nach der DSGVO insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch zustehen. Außerdem besteht das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.</p>

    <h2>8. Stand</h2>
    <p>September 2026</p>
    <a href="/">Zurück zu JobWert</a>
  </main>;
}
