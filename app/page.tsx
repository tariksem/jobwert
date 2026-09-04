'use client';

import {useEffect,useMemo,useState,type ReactNode} from 'react';
import {trackCalculatorUseOnce,trackEvent} from './analytics';
import {estimateNet2026,type TaxClass,type ChurchTaxRate} from '../lib/net2026';

type ChildrenCount=0|1|2|3|4|5;
type Job={salary:number;hours:number;workdays:number;homeoffice:number;commute:number;commuteMinutes:number;rent:number;other:number;taxClass:TaxClass;churchTaxRate:ChurchTaxRate;children:ChildrenCount;healthAdditionalRate:number};

const initialA:Job={salary:55000,hours:40,workdays:5,homeoffice:1,commute:100,commuteMinutes:30,rent:800,other:200,taxClass:1,churchTaxRate:0,children:0,healthAdditionalRate:2.9};
const initialB:Job={salary:68000,hours:40,workdays:5,homeoffice:2,commute:150,commuteMinutes:45,rent:1100,other:250,taxClass:1,churchTaxRate:0,children:0,healthAdditionalRate:2.9};
const money=(n:number)=>Math.round(n).toLocaleString('de-DE');
const keys:(keyof Job)[]=['salary','hours','workdays','homeoffice','commute','commuteMinutes','rent','other','taxClass','churchTaxRate','children','healthAdditionalRate'];
const maxValues:Partial<Record<keyof Job,number>>={salary:2000000,hours:100,workdays:7,homeoffice:7,commute:20000,commuteMinutes:240,rent:20000,other:20000,healthAdditionalRate:10};

function readJob(params:URLSearchParams,prefix:'a'|'b',fallback:Job):Job{
  const next={...fallback};
  for(const key of keys){
    const raw=params.get(`${prefix}_${key}`);
    if(raw===null)continue;
    const value=Number(raw);
    if(!Number.isFinite(value)||value<0)continue;
    const max=maxValues[key];
    (next as unknown as Record<string,number>)[key]=max===undefined?value:Math.min(max,value);
  }
  if(![1,2,3,4,5,6].includes(next.taxClass))next.taxClass=fallback.taxClass;
  if(![0,8,9].includes(next.churchTaxRate))next.churchTaxRate=fallback.churchTaxRate;
  if(![0,1,2,3,4,5].includes(next.children))next.children=fallback.children;
  next.workdays=Math.max(1,Math.min(7,next.workdays||fallback.workdays));
  next.homeoffice=Math.min(next.workdays,next.homeoffice);
  return next;
}

function appendJob(params:URLSearchParams,prefix:'a'|'b',job:Job){for(const key of keys)params.set(`${prefix}_${key}`,String(job[key]));}

function monthlyDisposable(job:Job,salary=job.salary){
  const net=estimateNet2026(salary,{children:job.children,healthAdditionalRate:job.healthAdditionalRate,taxClass:job.taxClass,churchTaxRate:job.churchTaxRate});
  return net.monthlyNet-job.commute-job.rent-job.other;
}

function breakEvenSalary(targetDisposable:number,job:Job):number|null{
  const maxSalary=2000000;
  let low=0,high=Math.min(maxSalary,Math.max(job.salary*2,250000));
  while(monthlyDisposable(job,high)<targetDisposable&&high<maxSalary)high=Math.min(maxSalary,high*2);
  if(monthlyDisposable(job,high)<targetDisposable)return null;
  for(let i=0;i<42;i++){
    const mid=(low+high)/2;
    if(monthlyDisposable(job,mid)>=targetDisposable)high=mid;else low=mid;
  }
  return Math.ceil(high/100)*100;
}

function weeklyTime(job:Job){
  const officeDays=Math.max(0,job.workdays-Math.min(job.workdays,job.homeoffice));
  const commuteHours=(job.commuteMinutes*2*officeDays)/60;
  return {officeDays,commuteHours,total:job.hours+commuteHours};
}

function Field({label,value,onChange,step=1,suffix,max,min=0}:{label:string,value:number,onChange:(v:number)=>void,step?:number,suffix?:string,max?:number,min?:number}){
  return <label className="field"><span>{label}</span><div className="inputWrap"><input type="number" min={min} max={max} step={step} value={value} onChange={e=>{trackCalculatorUseOnce();const raw=Number(e.target.value)||0;onChange(Math.min(max??Number.POSITIVE_INFINITY,Math.max(min,raw)))}}/>{suffix&&<b>{suffix}</b>}</div></label>;
}

function SelectField({label,value,onChange,children}:{label:string;value:number;onChange:(v:number)=>void;children:ReactNode}){
  return <label className="field"><span>{label}</span><select className="selectField" value={value} onChange={e=>{trackCalculatorUseOnce();onChange(Number(e.target.value))}}>{children}</select></label>;
}

function JobCard({kind,title,subtitle,j,setJ}:{kind:'current'|'new';title:string;subtitle:string;j:Job;setJ:(x:Job)=>void}){
  const f=(k:keyof Job)=>(v:number)=>setJ({...j,[k]:v} as Job);
  const setWorkdays=(v:number)=>setJ({...j,workdays:v,homeoffice:Math.min(v,j.homeoffice)});
  return <section className={'jobCard '+kind}>
    <div className="cardHead"><div className="iconBox">{kind==='current'?'▣':'▥'}</div><div><h2>{title}</h2><p>{subtitle}</p></div></div>
    <div className="cardBody">
      <Field label="Bruttojahresgehalt" value={j.salary} onChange={f('salary')} suffix="€" max={2000000}/>
      <SelectField label="Steuerklasse" value={j.taxClass} onChange={v=>setJ({...j,taxClass:v as TaxClass})}>{[1,2,3,4,5,6].map(v=><option key={v} value={v}>Steuerklasse {v}</option>)}</SelectField>
      <SelectField label="Kirchensteuer" value={j.churchTaxRate} onChange={v=>setJ({...j,churchTaxRate:v as ChurchTaxRate})}><option value="0">Nein</option><option value="8">8 %</option><option value="9">9 %</option></SelectField>
      <SelectField label="Kinder" value={j.children} onChange={v=>setJ({...j,children:v as ChildrenCount})}>{[0,1,2,3,4,5].map(v=><option key={v} value={v}>{v===0?'Keine':v===5?'5+':v}</option>)}</SelectField>
      <Field label="KV-Zusatzbeitrag" value={j.healthAdditionalRate} onChange={f('healthAdditionalRate')} step={0.1} suffix="%" max={10}/>
      <Field label="Wöchentliche Arbeitszeit" value={j.hours} onChange={f('hours')} step={0.5} suffix="Stunden" max={100}/>
      <Field label="Arbeitstage pro Woche" value={j.workdays} onChange={setWorkdays} max={7} min={1}/>
      <Field label="Homeoffice-Tage pro Woche" value={j.homeoffice} onChange={f('homeoffice')} max={j.workdays}/>
      <Field label="Pendelzeit einfach" value={j.commuteMinutes} onChange={f('commuteMinutes')} step={5} suffix="Minuten" max={240}/>
      <Field label="Monatliche Wohnkosten" value={j.rent} onChange={f('rent')} suffix="€" max={20000}/>
      <Field label="Monatliche Pendelkosten" value={j.commute} onChange={f('commute')} suffix="€" max={20000}/>
      <Field label="Weitere monatliche Kosten" value={j.other} onChange={f('other')} suffix="€" max={20000}/>
    </div>
  </section>;
}

export default function Home(){
  const[a,setA]=useState(initialA),[b,setB]=useState(initialB),[shared,setShared]=useState(false),[targetGain,setTargetGain]=useState(300);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.toString()){
      setA(readJob(params,'a',initialA));
      setB(readJob(params,'b',initialB));
      const g=Number(params.get('targetGain'));
      if(Number.isFinite(g)&&g>=0&&g<=10000)setTargetGain(g);
    }
  },[]);

  const r=useMemo(()=>{
    const na=estimateNet2026(a.salary,{children:a.children,healthAdditionalRate:a.healthAdditionalRate,taxClass:a.taxClass,churchTaxRate:a.churchTaxRate});
    const nb=estimateNet2026(b.salary,{children:b.children,healthAdditionalRate:b.healthAdditionalRate,taxClass:b.taxClass,churchTaxRate:b.churchTaxRate});
    const da=monthlyDisposable(a),db=monthlyDisposable(b),diff=db-da;
    const timeA=weeklyTime(a),timeB=weeklyTime(b);
    const hourly=(d:number,totalHours:number)=>totalHours?d/(totalHours*4.33):0;
    const timeSavedWeekly=timeA.total-timeB.total;
    const timeSavedMonthly=timeSavedWeekly*4.33;
    const timeSavedAnnualDays=(timeSavedWeekly*46)/8;
    const breakEven=breakEvenSalary(da,b);
    const targetSalary=breakEvenSalary(da+targetGain,b);
    const moneyBetter=diff>25,moneyWorse=diff<-25,timeBetter=timeSavedMonthly>1,timeWorse=timeSavedMonthly<-1;
    let decision='Finanziell und zeitlich nahezu ausgeglichen';
    if(moneyBetter&&timeBetter)decision='Finanziell besser und zeitlich attraktiver';
    else if(moneyBetter&&timeWorse)decision='Finanziell besser, aber zeitlich belastender';
    else if(moneyWorse&&timeBetter)decision='Finanziell schwächer, aber mit deutlichem Zeitgewinn';
    else if(moneyWorse&&timeWorse)decision='Finanziell und zeitlich schwächer';
    else if(moneyBetter)decision='Finanziell besser bei ähnlichem Zeitaufwand';
    else if(moneyWorse)decision='Finanziell schwächer bei ähnlichem Zeitaufwand';
    else if(timeBetter)decision='Finanziell ähnlich, aber zeitlich attraktiver';
    else if(timeWorse)decision='Finanziell ähnlich, aber zeitlich belastender';
    return{na,nb,da,db,diff,timeA,timeB,timeSavedWeekly,timeSavedMonthly,timeSavedAnnualDays,hA:hourly(da,timeA.total),hB:hourly(db,timeB.total),breakEven,offerVsBreakEven:breakEven===null?null:b.salary-breakEven,targetSalary,offerVsTarget:targetSalary===null?null:b.salary-targetSalary,decision};
  },[a,b,targetGain]);

  const share=async()=>{
    const params=new URLSearchParams();appendJob(params,'a',a);appendJob(params,'b',b);params.set('targetGain',String(targetGain));
    const url=`${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try{
      if(navigator.share)await navigator.share({title:'JobWert Vergleich',text:'Mein Jobvergleich mit JobWert',url});else await navigator.clipboard.writeText(url);
      setShared(true);window.setTimeout(()=>setShared(false),2500);trackEvent('share_clicked');
    }catch{}
  };

  const negotiationHref=r.targetSalary===null?'/gehaltsverhandlung':`/gehaltsverhandlung?offer=${Math.round(b.salary)}&target=${Math.round(r.targetSalary)}`;

  return <main>
    <nav className="topbar"><a className="logo" href="/"><strong>Job</strong>Wert<span>Bessere Entscheidungen. Mehr vom Leben.</span></a><div className="navlinks"><a href="/jobangebote-vergleichen">Jobangebote vergleichen</a><a href="/gehaltserhoehung-rechner">Gehaltserhöhung</a><a href="/umzug-fuer-job-rechner">Umzug für Job</a><a href="/homeoffice-vs-buero-rechner">Homeoffice vs. Büro</a><a href="/gehaltsverhandlung">Verhandlung</a></div><a className="startBtn" href="#rechner">Rechner starten</a></nav>
    <header className="hero"><h1>Was ist dein Jobangebot wirklich wert?</h1><p>Vergleiche Gehalt, Steuern, Lebenshaltungskosten und Zeitaufwand und finde heraus,<br/>ob sich der neue Job für dich wirklich lohnt.</p></header>
    <section className="trustRow"><div>♢ <span>2026 Steuer- & Sozialabgaben</span></div><div>⌂ <span>Lebenshaltungskosten berücksichtigt</span></div><div>◴ <span>Arbeits- und Pendelzeit im Vergleich</span></div><div>▢ <span>Rechnerdaten nur im Browser</span></div></section>
    <section id="rechner" className="compareGrid">
      <JobCard kind="current" title="Aktueller Job" subtitle="Deine aktuelle Position und Konditionen" j={a} setJ={setA}/>
      <JobCard kind="new" title="Neues Jobangebot" subtitle="Die neue Position und Konditionen" j={b} setJ={setB}/>
      <section className="resultCard">
        <div className="cardHead resultHead"><div className="iconBox">↗</div><div><h2>Ergebnis</h2><p>Der direkte Vergleich</p></div></div>
        <div className="resultBody">
          <div className={'verdict '+(r.diff>=0?'positive':'negative')}><b>{r.decision}</b><span>Finanziell bleiben dir monatlich etwa {money(Math.abs(r.diff))} € {r.diff>=0?'mehr':'weniger'}.</span>{Math.abs(r.timeSavedMonthly)>=0.5&&<span>Zeitlich sind es etwa {Math.abs(r.timeSavedMonthly).toFixed(1)} Stunden pro Monat {r.timeSavedMonthly>=0?'mehr freie Zeit':'zusätzliche Belastung'}.</span>}</div>
          <div className="table"><div className="tr head"><span></span><b>Aktueller Job</b><b>Neues Angebot</b></div><div className="tr"><span>Bruttojahresgehalt</span><b>{money(a.salary)} €</b><b>{money(b.salary)} €</b></div><div className="tr"><span>Nettomonatsgehalt (ca.)</span><b>{money(r.na.monthlyNet)} €</b><b>{money(r.nb.monthlyNet)} €</b></div><div className="tr"><span>Wohnkosten</span><b>{money(a.rent)} €</b><b>{money(b.rent)} €</b></div><div className="tr"><span>Pendelkosten</span><b>{money(a.commute)} €</b><b>{money(b.commute)} €</b></div><div className="tr"><span>Pendelzeit / Woche</span><b>{r.timeA.commuteHours.toFixed(1)} Std.</b><b>{r.timeB.commuteHours.toFixed(1)} Std.</b></div><div className="tr"><span>Weitere Kosten</span><b>{money(a.other)} €</b><b>{money(b.other)} €</b></div><div className="tr total"><span>Verfügbares Einkommen</span><b>{money(r.da)} €</b><b>{money(r.db)} €</b></div></div>
          <div className="diffCards"><div><span>Monatlicher Unterschied</span><strong>{r.diff>=0?'+ ':''}{money(r.diff)} €</strong></div><div><span>Jährlicher Unterschied</span><strong>{r.diff>=0?'+ ':''}{money(r.diff*12)} €</strong></div></div>
          <div className="breakEven"><span>Dein finanzieller Break-even</span><strong>{r.breakEven===null?'Über 2 Mio. €':`${money(r.breakEven)} € brutto/Jahr`}</strong><p>{r.breakEven===null?'Mit den eingegebenen Kosten liegt der Break-even außerhalb des unterstützten Bereichs.':'Ab ungefähr diesem Jahresgehalt gleicht das neue Angebot dein aktuelles verfügbares Einkommen aus.'}</p>{r.offerVsBreakEven!==null&&<b className={r.offerVsBreakEven>=0?'good':'bad'}>{r.offerVsBreakEven>=0?`${money(r.offerVsBreakEven)} € über Break-even`:`${money(Math.abs(r.offerVsBreakEven))} € unter Break-even`}</b>}</div>
          <div className="salaryTarget"><div><span>Was solltest du verlangen?</span><p>Wie viel möchtest du monatlich real mehr zur Verfügung haben?</p></div><div className="targetControl"><div className="inputWrap"><input aria-label="Gewünschter monatlicher Mehrbetrag" type="number" min="0" max="10000" step="50" value={targetGain} onChange={e=>{trackCalculatorUseOnce();setTargetGain(Math.min(10000,Math.max(0,Number(e.target.value)||0)));trackEvent('salary_target_changed')}}/><b>€/Monat</b></div></div><strong>{r.targetSalary===null?'Ziel außerhalb des Bereichs':`${money(r.targetSalary)} € brutto/Jahr`}</strong><small>{r.targetSalary===null?'Bitte reduziere den gewünschten Mehrbetrag oder die eingegebenen Kosten.':`Damit hättest du nach den eingegebenen Kosten ungefähr ${money(targetGain)} € pro Monat mehr als heute.`}</small>{r.offerVsTarget!==null&&<b className={r.offerVsTarget>=0?'good':'bad'}>{r.offerVsTarget>=0?`Aktuelles Angebot liegt ${money(r.offerVsTarget)} € darüber`:`Für dein Ziel fehlen etwa ${money(Math.abs(r.offerVsTarget))} € brutto/Jahr`}</b>}<a className="negotiationLink" href={negotiationHref}>Verhandlung mit diesem Ziel vorbereiten →</a></div>
          <div className="miniCards"><div><span>Effektiver Stundenwert inkl. Pendelzeit</span><b>{r.hA.toFixed(1)} € → {r.hB.toFixed(1)} €</b></div><div><span>Gesamtzeit pro Woche</span><b>{r.timeA.total.toFixed(1)} → {r.timeB.total.toFixed(1)} Std.</b></div><div><span>Arbeitstage / Homeoffice</span><b>{a.workdays}/{a.homeoffice} → {b.workdays}/{b.homeoffice}</b></div><div><span>{r.timeSavedMonthly>=0?'Zeitgewinn':'Zusätzlicher Zeitaufwand'}</span><b>{Math.abs(r.timeSavedMonthly).toFixed(1)} Std./Monat · {Math.abs(r.timeSavedAnnualDays).toFixed(1)} 8-Std.-Tage/Jahr*</b></div></div>
          <button className="primary" onClick={share}>▦ {shared?'Link kopiert':'Vergleich teilen'}</button>
          <button className="secondary" onClick={()=>{setA(initialA);setB(initialB);setTargetGain(300);history.replaceState(null,'',window.location.pathname)}}>↻ Eingaben zurücksetzen</button>
        </div>
      </section>
    </section>
    <section className="more"><h2>Mehr als nur Brutto-Netto</h2><p>JobWert trennt Geld und Zeit, damit du beide Auswirkungen selbst bewerten kannst.</p><div className="featureGrid"><div><b>♢ Steuern & Sozialabgaben 2026</b><span>Lohnsteuer auf Basis des BMF-PAP; Sozialabgaben als Näherungsmodell.</span></div><div><b>⌂ Lebenshaltungskosten</b><span>Miete, Pendeln und weitere Kosten vergleichen.</span></div><div><b>◴ Zeit ist auch ein Faktor</b><span>Arbeitstage, Homeoffice, Arbeitszeit und Pendelzeit einbeziehen.</span></div><div><b>▣ Bessere Entscheidungen</b><span>Break-even und Zielgehalt statt nur Brutto-Vergleich.</span></div></div></section>
    <p className="disclaimer">Die Berechnung ist eine Näherung und keine amtliche Lohnabrechnung, Steuer- oder Rechtsberatung. Pendelkosten werden als eingegebener Monatswert verwendet und nicht automatisch aus Homeoffice-Tagen abgeleitet. *Die Jahres-Zeitanzeige verwendet 46 Arbeitswochen und rechnet 8 Stunden als einen Vergleichstag. Geteilte Links enthalten die eingegebenen Vergleichswerte in der URL.</p>
    <footer><span>© 2026 JobWert</span><a href="/jobwechsel-rechner">Jobwechsel Rechner</a><a href="/gehaltsverhandlung">Gehaltsverhandlung</a><a href="/datenschutz">Datenschutz</a><a href="/impressum">Impressum</a></footer>
  </main>;
}
