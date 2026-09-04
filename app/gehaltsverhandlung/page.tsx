'use client';
import {useEffect,useMemo,useState} from 'react';
import {trackEvent} from '../analytics';
import {buildNegotiationText,negotiationStats} from '../../lib/negotiation';

const money=(n:number)=>Math.round(n).toLocaleString('de-DE');

export default function GehaltsverhandlungPage(){
  const[offer,setOffer]=useState(68000);
  const[target,setTarget]=useState(75000);
  const[copied,setCopied]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const rawOffer=Number(params.get('offer'));
    const rawTarget=Number(params.get('target'));
    if(Number.isFinite(rawOffer)&&rawOffer>=0&&rawOffer<=2000000)setOffer(rawOffer);
    if(Number.isFinite(rawTarget)&&rawTarget>=0&&rawTarget<=2000000)setTarget(rawTarget);
  },[]);

  const stats=useMemo(()=>negotiationStats({offerSalary:offer,targetSalary:target}),[offer,target]);
  const text=useMemo(()=>buildNegotiationText({offerSalary:offer,targetSalary:target}),[offer,target]);
  const copy=async()=>{
    if(!text)return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(()=>setCopied(false),2200);
    trackEvent('negotiation_text_copied',{offer_salary:offer,target_salary:target});
  };
  const clamp=(n:number)=>Math.min(2000000,Math.max(0,n||0));

  return <main><nav className="topbar"><a className="logo" href="/"><strong>Job</strong>Wert<span>Bessere Entscheidungen. Mehr vom Leben.</span></a><div className="navlinks"><a href="/jobangebote-vergleichen">Jobangebote vergleichen</a><a href="/gehaltserhoehung-rechner">Gehaltserhöhung</a><a href="/umzug-fuer-job-rechner">Umzug für Job</a><a href="/homeoffice-vs-buero-rechner">Homeoffice vs. Büro</a></div><a className="startBtn" href="/#rechner">Rechner starten</a></nav><section className="landing negotiationPage"><h1>Gehaltsverhandlung vorbereiten</h1><p>Formuliere aus deinem Angebot und deinem Zielgehalt einen sachlichen, sofort nutzbaren Verhandlungstext.</p><div className="negotiationGrid"><section className="jobCard current"><div className="cardHead"><div className="iconBox">€</div><div><h2>Deine Zahlen</h2><p>Angebot und Ziel eingeben</p></div></div><div className="cardBody"><label className="field"><span>Aktuelles Angebot brutto/Jahr</span><div className="inputWrap"><input type="number" min="0" max="2000000" step="500" value={offer} onChange={e=>setOffer(clamp(Number(e.target.value)))}/><b>€</b></div></label><label className="field"><span>Dein Ziel brutto/Jahr</span><div className="inputWrap"><input type="number" min="0" max="2000000" step="500" value={target} onChange={e=>setTarget(clamp(Number(e.target.value)))}/><b>€</b></div></label><div className="negotiationNumbers"><div><span>Differenz</span><strong>{stats.difference>=0?'+ ':''}{money(stats.difference)} €</strong></div><div><span>Abweichung</span><strong>{stats.percent>=0?'+ ':''}{stats.percent.toFixed(1)} %</strong></div></div></div></section><section className="resultCard"><div className="cardHead resultHead"><div className="iconBox">✎</div><div><h2>Verhandlungstext</h2><p>Professionell und sachlich formuliert</p></div></div><div className="resultBody"><div className="negotiationPreview">{text||'Bitte gib ein Zielgehalt ein.'}</div><button className="primary" onClick={copy} disabled={!text}>{copied?'Text kopiert':'Text kopieren'}</button><p className="negotiationHint">Der Text ist eine Formulierungshilfe. Passe Ton, Verantwortungsumfang und Zusatzleistungen an deine konkrete Situation an.</p></div></section></div><div className="negotiationTips"><h2>So nutzt du die Zahl sinnvoll</h2><p>Das Zielgehalt sollte nicht nur aus einem Prozentaufschlag bestehen. Berücksichtige auch Pendelkosten, Wohnkosten, Arbeitszeit und den finanziellen Break-even aus dem JobWert-Rechner. Wenn du vom Rechner kommst, werden Angebot und Ziel automatisch übernommen.</p><a className="cta" href="/#rechner">Jobangebot vollständig vergleichen</a></div></section></main>;
}
