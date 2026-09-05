'use client';

import {useEffect,useState} from 'react';
import {trackEvent} from '../analytics';
import {type Job,initialA,initialB,readJob,compareJobs,decisionIndex} from '../../lib/jobCompare';
import {buildNegotiationText} from '../../lib/negotiation';

const decisions=['Finanziell und zeitlich nahezu ausgeglichen','Finanziell besser und zeitlich attraktiver','Finanziell besser, aber zeitlich belastender','Finanziell schwächer, aber mit deutlichem Zeitgewinn','Finanziell und zeitlich schwächer','Finanziell besser bei ähnlichem Zeitaufwand','Finanziell schwächer bei ähnlichem Zeitaufwand','Finanziell ähnlich, aber zeitlich attraktiver','Finanziell ähnlich, aber zeitlich belastender'];
const money=(n:number)=>Math.round(n).toLocaleString('de-DE');
const today=()=>new Date().toLocaleDateString('de-DE',{year:'numeric',month:'long',day:'numeric'});

function nextSteps(offer:number,target:number|null,offerVsTarget:number|null){
  const steps:string[]=[];
  if(target!==null&&offerVsTarget!==null&&offerVsTarget<0)steps.push(`Bereite ein Gegenangebot von rund ${money(target)} € brutto/Jahr vor, bevor du unterschreibst.`);
  steps.push('Kläre die vereinbarten Homeoffice-Tage schriftlich, da sie deine tatsächlichen Pendelkosten direkt beeinflussen.');
  steps.push('Vergleiche die Kündigungsfrist deines aktuellen Vertrags mit dem gewünschten Starttermin des neuen Jobs.');
  steps.push('Frage nach Nebenleistungen (Bonus, Urlaubstage, Jobticket, Altersvorsorge), falls beim Grundgehalt kein Spielraum besteht.');
  steps.push('Nutze den Verhandlungstext unten als Ausgangspunkt für dein Gespräch oder deine E-Mail – passe Ton und Details an deine Situation an.');
  return steps;
}

function Report({a,b,targetGain}:{a:Job;b:Job;targetGain:number}){
  const r=compareJobs(a,b,targetGain);
  const decision=decisions[decisionIndex(r.diff,r.timeSavedMonthly)];
  const negotiationText=r.targetSalary!==null?buildNegotiationText({offerSalary:b.salary,targetSalary:r.targetSalary}):'';
  useEffect(()=>{trackEvent('premium_report_viewed')},[]);
  return <main className="landing reportPage">
    <div className="brand"><a href="/"><strong>Job</strong>Wert</a></div>
    <div className="reportMeta"><span>Persönlicher Jobwechsel-Bericht</span><span>Erstellt am {today()}</span></div>
    <h1>Dein Jobvergleich im Überblick</h1>
    <div className={'verdict '+(r.diff>=0?'positive':'negative')}><b>{decision}</b><span>{r.diff>=0?`Finanziell bleiben dir monatlich etwa ${money(r.diff)} € mehr.`:`Finanziell bleiben dir monatlich etwa ${money(Math.abs(r.diff))} € weniger.`}</span>{Math.abs(r.timeSavedMonthly)>=0.5&&<span>{r.timeSavedMonthly>=0?`Zeitlich sind es etwa ${r.timeSavedMonthly.toFixed(1)} Stunden pro Monat mehr freie Zeit.`:`Zeitlich sind es etwa ${Math.abs(r.timeSavedMonthly).toFixed(1)} Stunden pro Monat zusätzliche Belastung.`}</span>}</div>

    <h2>Vergleich im Detail</h2>
    <div className="table">
      <div className="tr head"><span></span><b>Aktueller Job</b><b>Neues Angebot</b></div>
      <div className="tr"><span>Bruttojahresgehalt</span><b>{money(a.salary)} €</b><b>{money(b.salary)} €</b></div>
      <div className="tr"><span>Nettomonatsgehalt (ca.)</span><b>{money(r.na.monthlyNet)} €</b><b>{money(r.nb.monthlyNet)} €</b></div>
      <div className="tr"><span>Monatliche Wohnkosten</span><b>{money(a.rent)} €</b><b>{money(b.rent)} €</b></div>
      <div className="tr"><span>Monatliche Pendelkosten</span><b>{money(a.commute)} €</b><b>{money(b.commute)} €</b></div>
      <div className="tr"><span>Pendelzeit / Woche</span><b>{r.timeA.commuteHours.toFixed(1)} h</b><b>{r.timeB.commuteHours.toFixed(1)} h</b></div>
      <div className="tr"><span>Weitere monatliche Kosten</span><b>{money(a.other)} €</b><b>{money(b.other)} €</b></div>
      <div className="tr total"><span>Verfügbares Einkommen</span><b>{money(r.da)} €</b><b>{money(r.db)} €</b></div>
    </div>

    <h2>Break-even und Zielgehalt</h2>
    <p>{r.breakEven===null?'Mit den eingegebenen Kosten liegt der finanzielle Break-even außerhalb des unterstützten Bereichs.':`Ab etwa ${money(r.breakEven)} € brutto/Jahr gleicht das neue Angebot dein aktuelles verfügbares Einkommen aus. Das aktuelle Angebot liegt ${r.offerVsBreakEven!==null&&r.offerVsBreakEven>=0?`${money(Math.abs(r.offerVsBreakEven))} € darüber`:`${money(Math.abs(r.offerVsBreakEven??0))} € darunter`}.`}</p>
    {r.targetSalary!==null&&<p>Wenn du monatlich {money(targetGain)} € mehr zur Verfügung haben möchtest als heute, liegt dein Zielgehalt bei etwa {money(r.targetSalary)} € brutto/Jahr.</p>}

    <h2>Verhandlungstext</h2>
    {negotiationText?<div className="negotiationPreview">{negotiationText}</div>:<p>Für einen Verhandlungstext benötigt dein Vergleich ein gültiges Zielgehalt.</p>}

    <h2>Nächste Schritte</h2>
    <ul className="reportSteps">{nextSteps(b.salary,r.targetSalary,r.offerVsTarget).map((s,i)=><li key={i}>{s}</li>)}</ul>

    <div className="reportActions"><button className="primary" onClick={()=>{trackEvent('premium_report_pdf_saved');window.print()}}>Als PDF speichern</button><a className="secondary reportBackLink" href="/#rechner">Zurück zum Rechner</a></div>

    <p className="negotiationHint">Dieser Bericht ist eine Entscheidungshilfe auf Basis deiner eigenen Angaben und keine Steuer-, Rechts- oder Finanzberatung. Die Nettoberechnung ist eine Schätzung auf Grundlage des BMF-Programmablaufplans 2026; Sozialabgaben sind ein Näherungsmodell. Details siehe <a href="/methodik">Methodik</a>.</p>
    <footer><span>© 2026 JobWert</span><a href="/datenschutz">Datenschutz</a><a href="/impressum">Impressum</a></footer>
  </main>;
}

function Marketing(){
  const checkout=process.env.NEXT_PUBLIC_PREMIUM_REPORT_URL||'';
  const price=process.env.NEXT_PUBLIC_PREMIUM_REPORT_PRICE||'9,90';
  return <main className="landing">
    <div className="brand"><a href="/"><strong>Job</strong>Wert</a></div>
    <h1>Premium Jobwechsel-Bericht</h1>
    <p>Ein kompakter Entscheidungsbericht für deinen Jobwechsel: finanzielle Differenz, Break-even, Zielgehalt, ein fertiger Verhandlungstext und konkrete nächste Schritte – als druckfertige Seite.</p>
    <div className="legalWarning"><strong>Nutze zuerst den Rechner.</strong><p>Der Bericht wird aus deinem persönlichen Vergleich erstellt. <a href="/#rechner">Öffne den Rechner</a>, vergleiche deine beiden Jobs und klicke danach auf „Bericht ansehen“, um deine Vorschau hier zu sehen.</p></div>
    <section className="premiumCard">
      <div><span>Einmalig</span><strong>{price} €</strong></div>
      <div>
        <h2>Enthalten im Bericht</h2>
        <ul>
          <li>Zusammenfassung beider Jobangebote</li>
          <li>Monatlicher und jährlicher finanzieller Unterschied</li>
          <li>Break-even- und Zielgehalt</li>
          <li>Fertig formulierter Verhandlungstext</li>
          <li>Konkrete nächste Schritte für deine Entscheidung</li>
          <li>Druckfertig / als PDF speicherbar</li>
        </ul>
      </div>
      {checkout?<a className="cta" href={checkout} rel="nofollow sponsored">Premium-Bericht kaufen</a>:<div className="legalWarning"><strong>Checkout noch nicht aktiviert.</strong><p>Die Vorschau oben ist bereits nutzbar. Ein Bezahlvorgang ist noch nicht angebunden.</p></div>}
    </section>
    <p className="negotiationHint">Der Bericht ist eine Entscheidungshilfe und keine Steuer-, Rechts- oder Finanzberatung.</p>
    <footer><span>© 2026 JobWert</span><a href="/datenschutz">Datenschutz</a><a href="/impressum">Impressum</a></footer>
  </main>;
}

export default function PremiumReport(){
  const[data,setData]=useState<{a:Job;b:Job;targetGain:number}|null>(null);
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.toString()){
      const a=readJob(params,'a',initialA);
      const b=readJob(params,'b',initialB);
      const g=Number(params.get('targetGain'));
      setData({a,b,targetGain:Number.isFinite(g)&&g>=0&&g<=10000?g:300});
    }
  },[]);
  return data?<Report a={data.a} b={data.b} targetGain={data.targetGain}/>:<Marketing/>;
}
