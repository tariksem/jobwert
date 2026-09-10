'use client';

import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {trackCalculatorUseOnce,trackEvent} from './analytics';
import {type TaxClass,type ChurchTaxRate} from '../lib/net2026';
import {type Job,type ChildrenCount,appendJob,compareJobs,readJob} from '../lib/jobCompare';
import {buildEstimatedJobs,citySuggestions,realAdvantageRange,verdictFromRange,type Household,type QuickJobInput,type Transport} from '../lib/quickEstimate';

type Locale='de'|'en'|'tr';
type View='input'|'result';

const copy={
  de:{
    tagline:'Bessere Entscheidungen. Für deinen nächsten Schritt.',navHow:'So funktioniert’s',navGuide:'Ratgeber',navMethod:'Methodik',start:'Kostenlos starten',
    hero:'Neuer Job? Lohnt sich das wirklich?',heroSub:'Vergleiche schnell, was nach Steuern, Lebenshaltungskosten und Arbeitsweg wirklich für dich übrig bleibt.',fast:'In 2 Minuten zum Ergebnis',estimates:'Realistische Schätzungen',free:'100 % kostenlos & unverbindlich',
    current:'1. Deine aktuelle Situation',currentSub:'Wo stehst du jetzt?',next:'2. Dein neues Job-Angebot',nextSub:'Was ist geplant?',salary:'Bruttogehalt',month:'pro Monat',year:'pro Jahr',currentCity:'Dein aktueller Ort',newCity:'Arbeitsort',office:'Wie oft im Büro?',transport:'Hauptsächliches Verkehrsmittel',
    office0:'Nie / Remote',office1:'1 Tag pro Woche',office2:'2 Tage pro Woche',office3:'3 Tage pro Woche',office4:'4 Tage pro Woche',office5:'5 Tage pro Woche',car:'Auto',public:'ÖPNV / Bahn',bike:'Fahrrad',walk:'Zu Fuß',
    profile:'Für eine bessere Schätzung',taxClass:'Steuerklasse',household:'Wohnsituation',alone:'Allein',pair:'Paar',family:'Familie',moving:'Für den neuen Job umziehen?',yes:'Ja',no:'Nein',
    infoTitle:'Job vergleichen. Mit gutem Gefühl entscheiden.',info1:'Steuern & Abgaben berücksichtigt',info2:'Lebenshaltungskosten am neuen Standort',info3:'Pendeln: Kosten und Zeitaufwand',info4:'Effektiver Stundenwert',info5:'Mindestgehalt für einen echten Vorteil',tip:'Du musst nicht alle Details kennen. Wir schätzen fehlende Werte für dich – du kannst sie später anpassen.',
    compare:'Jetzt vergleichen',privacy:'Keine Registrierung nötig. Deine Rechnerdaten bleiben im Browser.',edit:'Angaben bearbeiten',resultTitle:'Dein Ergebnis auf einen Blick',resultSub:'Mehr als nur Gehalt: Wir zeigen dir, was voraussichtlich wirklich für dich übrig bleibt.',
    currentJob:'Dein aktueller Job',newJob:'Neues Job-Angebot',net:'Nettogehalt',housing:'Wohnkosten',living:'Lebenshaltung ohne Miete',commuteCost:'Pendelkosten',commuteTime:'Pendelzeit / Woche',estimated:'geschätzt',adjusted:'angepasst',real:'Dein realer Vorteil',afterCosts:'nach Steuern & geschätzten Lebenshaltungskosten',
    verdict:'Fazit',positive:'Der neue Job lohnt sich voraussichtlich für dich.',negative:'Der neue Job lohnt sich finanziell voraussichtlich nicht.',unclear:'Das Ergebnis ist zu knapp für eine klare Aussage.',positiveSub:'Selbst im vorsichtigen Szenario bleibt ein Vorteil.',negativeSub:'Selbst im günstigen Szenario bleibt ein Nachteil.',unclearSub:'Die Schätzspanne überschneidet den Break-even. Prüfe die Details.',
    range:'Voraussichtliche Spanne',mid:'Mittelwert',moreCommute:'mehr Pendel-/Arbeitszeit pro Monat',lessCommute:'weniger Pendel-/Arbeitszeit pro Monat',hourlyUp:'Effektiver Stundenwert steigt',hourlyDown:'Effektiver Stundenwert sinkt',minimum:'Mindestgehalt für einen echten Vorteil',minimumSub:'Für rund 100 € mehr verfügbares Einkommen pro Monat.',
    details:'Details anpassen',detailsSub:'Miete, Pendelstrecke, Arbeitszeit und Steuerdetails individuell bearbeiten.',share:'Ergebnis teilen',shared:'Link kopiert',report:'Vollständigen Bericht ansehen',newCompare:'Neuen Vergleich starten',
    detailsTitle:'Details anpassen',detailsHint:'Die folgenden Werte wurden zunächst geschätzt. Wenn du sie kennst, kannst du sie hier ersetzen.',hours:'Wöchentliche Arbeitszeit',rent:'Wohnkosten / Monat',other:'Lebenshaltung ohne Miete / Monat',commuteMonth:'Pendelkosten / Monat',commuteOneWay:'Pendelzeit einfach',minutes:'Min.',children:'Kinder (Pflegeversicherung)',church:'Kirchensteuer',health:'KV-Zusatzbeitrag',apply:'Ergebnis aktualisieren',
    confidenceLow:'Mindestens ein Ort ist nicht im Stadtmodell hinterlegt. Dafür verwenden wir Deutschland-Durchschnittswerte mit größerer Spanne.',method:'Wie wir schätzen',disclaimer:'Alle Werte sind Näherungen für 2026. Wohn- und Pendelkosten sind Orientierungswerte, keine Miet-, Steuer- oder Rechtsberatung.',
  },
  en:{
    tagline:'Better decisions. For your next step.',navHow:'How it works',navGuide:'Guides',navMethod:'Method',start:'Start free',hero:'New job? Is it really worth it?',heroSub:'Quickly compare what is likely to remain after taxes, living costs and commuting.',fast:'Result in 2 minutes',estimates:'Realistic estimates',free:'100% free & non-binding',current:'1. Your current situation',currentSub:'Where are you now?',next:'2. Your new job offer',nextSub:'What is planned?',salary:'Gross salary',month:'per month',year:'per year',currentCity:'Your current city',newCity:'Work location',office:'Days in the office?',transport:'Main transport',office0:'Never / Remote',office1:'1 day per week',office2:'2 days per week',office3:'3 days per week',office4:'4 days per week',office5:'5 days per week',car:'Car',public:'Public transport / train',bike:'Bicycle',walk:'Walk',profile:'For a better estimate',taxClass:'Tax class',household:'Household',alone:'Alone',pair:'Couple',family:'Family',moving:'Move for the new job?',yes:'Yes',no:'No',infoTitle:'Compare jobs. Decide with confidence.',info1:'Taxes & contributions included',info2:'Living costs at the new location',info3:'Commute cost and time',info4:'Effective hourly value',info5:'Minimum salary for a real advantage',tip:'You do not need to know every detail. We estimate missing values and you can adjust them later.',compare:'Compare now',privacy:'No registration. Calculator data stays in your browser.',edit:'Edit inputs',resultTitle:'Your result at a glance',resultSub:'More than salary: see what is likely to remain for you.',currentJob:'Your current job',newJob:'New job offer',net:'Net salary',housing:'Housing costs',living:'Living costs excl. rent',commuteCost:'Commute costs',commuteTime:'Commute time / week',estimated:'estimated',adjusted:'adjusted',real:'Your real advantage',afterCosts:'after taxes & estimated living costs',verdict:'Conclusion',positive:'The new job is likely worth it for you.',negative:'The new job is likely not financially worth it.',unclear:'The result is too close to call.',positiveSub:'Even the cautious scenario remains positive.',negativeSub:'Even the favorable scenario remains negative.',unclearSub:'The estimate range crosses break-even. Review the details.',range:'Estimated range',mid:'Midpoint',moreCommute:'more work/commute time per month',lessCommute:'less work/commute time per month',hourlyUp:'Effective hourly value increases',hourlyDown:'Effective hourly value decreases',minimum:'Minimum salary for a real advantage',minimumSub:'For roughly €100 more disposable income per month.',details:'Adjust details',detailsSub:'Edit rent, commute, working time and tax details.',share:'Share result',shared:'Link copied',report:'View full report',newCompare:'Start new comparison',detailsTitle:'Adjust details',detailsHint:'These values were estimated first. Replace them here when you know the actual values.',hours:'Weekly working hours',rent:'Housing / month',other:'Living excl. rent / month',commuteMonth:'Commute / month',commuteOneWay:'One-way commute',minutes:'min',children:'Children (care insurance)',church:'Church tax',health:'Health insurance add-on',apply:'Update result',confidenceLow:'At least one city is not in the city model. German average values are used with a wider range.',method:'How estimates work',disclaimer:'All values are 2026 estimates. Housing and commute figures are orientation values, not rental, tax or legal advice.',
  },
  tr:{
    tagline:'Daha iyi kararlar. Bir sonraki adımın için.',navHow:'Nasıl çalışır?',navGuide:'Rehber',navMethod:'Metodoloji',start:'Ücretsiz başla',hero:'Yeni iş? Gerçekten değer mi?',heroSub:'Vergi, yaşam maliyeti ve yol giderlerinden sonra gerçekte ne kalacağını hızlıca karşılaştır.',fast:'2 dakikada sonuç',estimates:'Gerçekçi tahminler',free:'%100 ücretsiz ve bağlayıcı değil',current:'1. Mevcut durumun',currentSub:'Şimdi neredesin?',next:'2. Yeni iş teklifin',nextSub:'Plan nedir?',salary:'Brüt maaş',month:'aylık',year:'yıllık',currentCity:'Mevcut şehrin',newCity:'İş yeri',office:'Haftada kaç gün ofis?',transport:'Ana ulaşım şekli',office0:'Hiç / Uzaktan',office1:'Haftada 1 gün',office2:'Haftada 2 gün',office3:'Haftada 3 gün',office4:'Haftada 4 gün',office5:'Haftada 5 gün',car:'Araba',public:'Toplu taşıma / tren',bike:'Bisiklet',walk:'Yürüyerek',profile:'Daha iyi tahmin için',taxClass:'Vergi sınıfı',household:'Hane durumu',alone:'Tek kişi',pair:'Çift',family:'Aile',moving:'Yeni iş için taşınacak mısın?',yes:'Evet',no:'Hayır',infoTitle:'İşleri karşılaştır. Daha emin karar ver.',info1:'Vergi ve kesintiler dahil',info2:'Yeni şehirde yaşam maliyeti',info3:'Yol maliyeti ve zaman',info4:'Efektif saatlik değer',info5:'Gerçek avantaj için minimum maaş',tip:'Her ayrıntıyı bilmek zorunda değilsin. Eksik değerleri biz tahmin ederiz; sonra değiştirebilirsin.',compare:'Şimdi karşılaştır',privacy:'Kayıt gerekmez. Hesaplama verileri tarayıcıda kalır.',edit:'Bilgileri düzenle',resultTitle:'Sonucun tek bakışta',resultSub:'Sadece maaş değil: gerçekte elinde ne kalacağını tahmin ediyoruz.',currentJob:'Mevcut işin',newJob:'Yeni iş teklifi',net:'Net maaş',housing:'Konut gideri',living:'Kira hariç yaşam gideri',commuteCost:'Yol gideri',commuteTime:'Haftalık yol süresi',estimated:'tahmin',adjusted:'düzenlendi',real:'Gerçek avantajın',afterCosts:'vergi ve tahmini yaşam maliyetlerinden sonra',verdict:'Sonuç',positive:'Yeni iş senin için büyük olasılıkla avantajlı.',negative:'Yeni iş finansal olarak büyük olasılıkla avantajlı değil.',unclear:'Net karar vermek için sonuç fazla yakın.',positiveSub:'Temkinli senaryoda bile avantaj devam ediyor.',negativeSub:'İyimser senaryoda bile dezavantaj devam ediyor.',unclearSub:'Tahmin aralığı başa baş noktasını kesiyor. Detayları kontrol et.',range:'Tahmini aralık',mid:'Orta değer',moreCommute:'aylık daha fazla iş/yol süresi',lessCommute:'aylık daha az iş/yol süresi',hourlyUp:'Efektif saatlik değer artıyor',hourlyDown:'Efektif saatlik değer düşüyor',minimum:'Gerçek avantaj için minimum maaş',minimumSub:'Ayda yaklaşık 100 € daha fazla kullanılabilir gelir için.',details:'Detayları düzenle',detailsSub:'Kira, yol, çalışma süresi ve vergi ayrıntılarını değiştir.',share:'Sonucu paylaş',shared:'Bağlantı kopyalandı',report:'Tam raporu görüntüle',newCompare:'Yeni karşılaştırma',detailsTitle:'Detayları düzenle',detailsHint:'Bu değerler önce tahmin edildi. Gerçek değerleri biliyorsan buradan değiştirebilirsin.',hours:'Haftalık çalışma süresi',rent:'Konut / ay',other:'Kira hariç yaşam / ay',commuteMonth:'Yol / ay',commuteOneWay:'Tek yön yol',minutes:'dk.',children:'Çocuk (bakım sigortası)',church:'Kilise vergisi',health:'Sağlık sigortası ek oranı',apply:'Sonucu güncelle',confidenceLow:'En az bir şehir şehir modelimizde yok. Daha geniş aralıkla Almanya ortalaması kullanılıyor.',method:'Tahmini nasıl yapıyoruz?',disclaimer:'Tüm değerler 2026 için yaklaşık tahmindir. Konut ve yol değerleri yön gösterir; kira, vergi veya hukuk danışmanlığı değildir.',
  },
} as const;

const defaults={
  current:{salary:4200,period:'month',city:'Münster',officeDays:3,transport:'car'} as QuickJobInput,
  next:{salary:5000,period:'month',city:'Berlin',officeDays:3,transport:'car'} as QuickJobInput,
};

function money(n:number,locale:Locale){return Math.round(n).toLocaleString(locale==='de'?'de-DE':locale==='tr'?'tr-TR':'en-GB');}
function signed(n:number,locale:Locale,suffix=' €'){return `${n>0?'+ ':n<0?'− ':''}${money(Math.abs(n),locale)}${suffix}`;}
function clamp(n:number,min:number,max:number){return Math.min(max,Math.max(min,n));}
function officeLabel(t:typeof copy[Locale],days:number){return [t.office0,t.office1,t.office2,t.office3,t.office4,t.office5][clamp(Math.round(days),0,5)];}

function SalaryField({t,value,onChange,onStart}:{t:typeof copy[Locale];value:QuickJobInput;onChange:(v:QuickJobInput)=>void;onStart:()=>void}){
  const set=(patch:Partial<QuickJobInput>)=>{onStart();onChange({...value,...patch});};
  return <div className="qw-field"><span>{t.salary}</span><div className="qw-salary"><input aria-label={t.salary} type="number" min="0" step="100" value={value.salary} onChange={e=>set({salary:Math.max(0,Number(e.target.value)||0)})}/><b>€</b></div><div className="qw-period"><label><input type="radio" checked={value.period==='month'} onChange={()=>set({period:'month'})}/>{t.month}</label><label><input type="radio" checked={value.period==='year'} onChange={()=>set({period:'year'})}/>{t.year}</label></div></div>;
}

function SelectText({label,value,onChange,children}:{label:string;value:string|number;onChange:(v:string)=>void;children:ReactNode}){
  return <label className="qw-field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{children}</select></label>;
}

function NumberDetail({label,value,onChange,suffix,step=1,max=20000}:{label:string;value:number;onChange:(n:number)=>void;suffix:string;step?:number;max?:number}){
  return <label className="qw-field"><span>{label}</span><div className="qw-salary"><input type="number" min="0" max={max} step={step} value={value} onChange={e=>onChange(clamp(Number(e.target.value)||0,0,max))}/><b>{suffix}</b></div></label>;
}

function LanguageSwitcher({locale,search}:{locale:Locale;search:string}){
  return <div className="languageSwitcher" aria-label="Language"><a className={locale==='de'?'active':''} href={`/${search}`}>DE</a><a className={locale==='en'?'active':''} href={`/en/${search}`}>EN</a><a className={locale==='tr'?'active':''} href={`/tr/${search}`}>TR</a></div>;
}

export default function LocalizedCalculator({locale}:{locale:Locale}){
  const t=copy[locale];
  const [current,setCurrent]=useState<QuickJobInput>(defaults.current);
  const [next,setNext]=useState<QuickJobInput>(defaults.next);
  const [taxClass,setTaxClass]=useState<TaxClass>(1);
  const [household,setHousehold]=useState<Household>('alone');
  const [moving,setMoving]=useState(true);
  const [view,setView]=useState<View>('input');
  const [search,setSearch]=useState('');
  const [detailsOpen,setDetailsOpen]=useState(false);
  const [customized,setCustomized]=useState(false);
  const [copied,setCopied]=useState(false);
  const startTracked=useRef(false);

  const estimate=useMemo(()=>buildEstimatedJobs(current,next,{taxClass,household,moving}),[current,next,taxClass,household,moving]);
  const [jobA,setJobA]=useState<Job>(estimate.a);
  const [jobB,setJobB]=useState<Job>(estimate.b);

  const markStart=()=>{
    trackCalculatorUseOnce();
    if(!startTracked.current){startTracked.current=true;trackEvent('quick_compare_started');}
  };

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    setSearch(window.location.search);
    const parseJob=(prefix:'qa'|'qb',fallback:QuickJobInput):QuickJobInput=>{
      const period=p.get(`${prefix}_period`)==='year'?'year':'month';
      const transportValue=p.get(`${prefix}_transport`);
      const transport:Transport=transportValue==='public'||transportValue==='bike'||transportValue==='walk'?transportValue:'car';
      return{
        salary:Math.max(0,Number(p.get(`${prefix}_salary`))||fallback.salary),
        period,
        city:p.get(`${prefix}_city`)||fallback.city,
        officeDays:clamp(Number(p.get(`${prefix}_office`))||fallback.officeDays,0,5),
        transport,
      };
    };
    if(p.has('qa_salary')||p.has('qb_salary')){
      const qa=parseJob('qa',defaults.current),qb=parseJob('qb',defaults.next);
      const rawTax=Number(p.get('q_tax'));
      const qTax:TaxClass=([1,2,3,4,5,6].includes(rawTax)?rawTax:1) as TaxClass;
      const qHouse:Household=p.get('q_household')==='pair'?'pair':p.get('q_household')==='family'?'family':'alone';
      const qMoving=p.get('q_moving')!=='0';
      setCurrent(qa);setNext(qb);setTaxClass(qTax);setHousehold(qHouse);setMoving(qMoving);
      const est=buildEstimatedJobs(qa,qb,{taxClass:qTax,household:qHouse,moving:qMoving});
      if(p.has('a_salary')&&p.has('b_salary')){
        setJobA(readJob(p,'a',est.a));setJobB(readJob(p,'b',est.b));setCustomized(p.get('custom')==='1');
      }else{setJobA(est.a);setJobB(est.b);}
      if(p.get('view')==='result')setView('result');
    }
  },[]);

  const result=useMemo(()=>compareJobs(jobA,jobB,100),[jobA,jobB]);
  const netDiff=result.nb.monthlyNet-result.na.monthlyNet;
  const range=customized?{low:Math.round(result.diff-75),high:Math.round(result.diff+75)}:realAdvantageRange(netDiff,estimate.costRanges);
  const verdict=verdictFromRange(range);
  const canCompare=current.salary>0&&next.salary>0&&current.city.trim().length>1&&next.city.trim().length>1;
  const estimatedLabel=customized?t.adjusted:t.estimated;

  const compare=()=>{
    if(!canCompare)return;
    markStart();
    const fresh=buildEstimatedJobs(current,next,{taxClass,household,moving});
    setJobA(fresh.a);setJobB(fresh.b);setCustomized(false);setDetailsOpen(false);setView('result');
    trackEvent('quick_compare_completed',{moving,household,estimate_confidence:fresh.confidence});
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const updateDetail=(side:'a'|'b',patch:Partial<Job>)=>{
    const setter=side==='a'?setJobA:setJobB;
    setter(prev=>({...prev,...patch}));
    setCustomized(true);trackEvent('estimated_value_changed',{field:Object.keys(patch)[0],side});
  };
  const updateBoth=(patch:Partial<Job>)=>{setJobA(prev=>({...prev,...patch}));setJobB(prev=>({...prev,...patch}));setCustomized(true);trackEvent('estimated_value_changed',{field:Object.keys(patch)[0],side:'both'});};

  const buildShareParams=()=>{
    const p=new URLSearchParams();
    p.set('qa_salary',String(current.salary));p.set('qa_period',current.period);p.set('qa_city',current.city);p.set('qa_office',String(current.officeDays));p.set('qa_transport',current.transport);
    p.set('qb_salary',String(next.salary));p.set('qb_period',next.period);p.set('qb_city',next.city);p.set('qb_office',String(next.officeDays));p.set('qb_transport',next.transport);
    p.set('q_tax',String(taxClass));p.set('q_household',household);p.set('q_moving',moving?'1':'0');p.set('view','result');
    appendJob(p,'a',jobA);appendJob(p,'b',jobB);if(customized)p.set('custom','1');
    return p;
  };

  const share=async()=>{
    const url=`${window.location.origin}${locale==='de'?'/':`/${locale}/`}?${buildShareParams().toString()}`;
    try{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{window.prompt('Link',url);}
    trackEvent('result_shared');
  };

  const reportHref=()=>{const p=new URLSearchParams();appendJob(p,'a',jobA);appendJob(p,'b',jobB);p.set('targetGain','100');return `/premium-report/?${p.toString()}`;};
  const formatSalary=(input:QuickJobInput)=>`${money(input.salary,locale)} € / ${input.period==='month'?t.month:t.year}`;
  const weeklyCommute=(job:Job)=>((job.commuteMinutes*2*Math.max(0,job.workdays-job.homeoffice))/60);
  const timeDelta=Math.abs(result.timeSavedMonthly);

  const header=<header className="topbar"><a className="logo" href={locale==='de'?'/':`/${locale}/`}><strong>JobWert</strong><span>{t.tagline}</span></a><nav className="navlinks"><a href="#rechner">{t.navHow}</a><a href="/jobwechsel-rechner/">{t.navGuide}</a><a href="/methodik/">{t.navMethod}</a></nav><LanguageSwitcher locale={locale} search={search}/><a className="startBtn" href="#rechner">{t.start}</a></header>;

  if(view==='input')return <>
    {header}
    <main>
      <section className="qw-hero"><h1>{t.hero}</h1><p>{t.heroSub}</p><div className="qw-trust"><span>⚡ {t.fast}</span><span>▣ {t.estimates}</span><span>◇ {t.free}</span></div></section>
      <section className="qw-shell" id="rechner">
        <div className="qw-columns">
          <div className="qw-column"><h2>{t.current}</h2><p>{t.currentSub}</p><SalaryField t={t} value={current} onChange={setCurrent} onStart={markStart}/><label className="qw-field"><span>{t.currentCity}</span><input list="jobwert-cities" value={current.city} onChange={e=>{markStart();setCurrent({...current,city:e.target.value});}}/></label><SelectText label={t.office} value={current.officeDays} onChange={v=>{markStart();setCurrent({...current,officeDays:Number(v)});}}>{[0,1,2,3,4,5].map(n=><option key={n} value={n}>{officeLabel(t,n)}</option>)}</SelectText><SelectText label={t.transport} value={current.transport} onChange={v=>{markStart();setCurrent({...current,transport:v as Transport});}}><option value="car">{t.car}</option><option value="public">{t.public}</option><option value="bike">{t.bike}</option><option value="walk">{t.walk}</option></SelectText></div>
          <div className="qw-column qw-next"><h2>{t.next}</h2><p>{t.nextSub}</p><SalaryField t={t} value={next} onChange={setNext} onStart={markStart}/><label className="qw-field"><span>{t.newCity}</span><input list="jobwert-cities" value={next.city} onChange={e=>{markStart();setNext({...next,city:e.target.value});}}/></label><SelectText label={t.office} value={next.officeDays} onChange={v=>{markStart();setNext({...next,officeDays:Number(v)});}}>{[0,1,2,3,4,5].map(n=><option key={n} value={n}>{officeLabel(t,n)}</option>)}</SelectText><SelectText label={t.transport} value={next.transport} onChange={v=>{markStart();setNext({...next,transport:v as Transport});}}><option value="car">{t.car}</option><option value="public">{t.public}</option><option value="bike">{t.bike}</option><option value="walk">{t.walk}</option></SelectText></div>
        </div>
        <aside className="qw-info"><div className="qw-info-title"><span>▣</span><strong>{t.infoTitle}</strong></div>{[t.info1,t.info2,t.info3,t.info4,t.info5].map(x=><div className="qw-check" key={x}>✓ <span>{x}</span></div>)}<div className="qw-tip"><b>💡 Tipp:</b> {t.tip}</div></aside>
        <div className="qw-profile"><strong>{t.profile}</strong><SelectText label={t.taxClass} value={taxClass} onChange={v=>{markStart();setTaxClass(Number(v) as TaxClass);}}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}</SelectText><SelectText label={t.household} value={household} onChange={v=>{markStart();setHousehold(v as Household);}}><option value="alone">{t.alone}</option><option value="pair">{t.pair}</option><option value="family">{t.family}</option></SelectText><SelectText label={t.moving} value={moving?'1':'0'} onChange={v=>{markStart();setMoving(v==='1');}}><option value="1">{t.yes}</option><option value="0">{t.no}</option></SelectText></div>
        <button className="qw-compare" disabled={!canCompare} onClick={compare}>▣ {t.compare} →</button><p className="qw-privacy">{t.privacy}</p>
      </section>
      <datalist id="jobwert-cities">{citySuggestions.map(c=><option key={c} value={c}/>)}</datalist>
    </main>
    <footer><span>© 2026 JobWert</span><a href="/methodik/">{t.navMethod}</a><a href="/datenschutz/">Datenschutz</a><a href="/impressum/">Impressum</a></footer>
  </>;

  return <>
    {header}
    <main className="qr-page" id="rechner">
      <div className="qr-stepper"><span className="done">✓</span><b>1</b><span className="done">✓</span><b>2</b><span className="active">3</span><b>{locale==='de'?'Ergebnis':locale==='tr'?'Sonuç':'Result'}</b><span>4</span><b>{locale==='de'?'Details (optional)':locale==='tr'?'Detaylar (opsiyonel)':'Details (optional)'}</b><button onClick={()=>setView('input')}>← {t.edit}</button></div>
      <div className="qr-title"><div><h1>{t.resultTitle}</h1><p>{t.resultSub}</p></div><div className="qr-title-actions"><button className="secondary" onClick={share}>{copied?t.shared:t.share}</button><a className="primary" href={reportHref()}>{t.report}</a></div></div>
      {estimate.confidence==='low'&&<div className="qr-warning">ⓘ {t.confidenceLow}</div>}
      <section className="qr-grid">
        <div className="qr-comparison">
          <div className="qr-job-head"><div><small>{t.currentJob}</small><strong>{current.city}</strong><span>{formatSalary(current)}</span></div><i>→</i><div><small>{t.newJob}</small><strong>{next.city}</strong><span>{formatSalary(next)}</span></div></div>
          <div className="qr-row"><span>{t.net} <em>{t.estimated}</em></span><b>{money(result.na.monthlyNet,locale)} €</b><b>{money(result.nb.monthlyNet,locale)} €</b><strong className={netDiff>=0?'good':'bad'}>{signed(netDiff,locale)}</strong></div>
          <div className="qr-row"><span>{t.housing} <em>{estimatedLabel}</em></span><b>{money(jobA.rent,locale)} €</b><b>{money(jobB.rent,locale)} €</b><strong className={jobA.rent-jobB.rent>=0?'good':'bad'}>{signed(jobA.rent-jobB.rent,locale)}</strong></div>
          <div className="qr-row"><span>{t.living} <em>{estimatedLabel}</em></span><b>{money(jobA.other,locale)} €</b><b>{money(jobB.other,locale)} €</b><strong className={jobA.other-jobB.other>=0?'good':'bad'}>{signed(jobA.other-jobB.other,locale)}</strong></div>
          <div className="qr-row"><span>{t.commuteCost} <em>{estimatedLabel}</em></span><b>{money(jobA.commute,locale)} €</b><b>{money(jobB.commute,locale)} €</b><strong className={jobA.commute-jobB.commute>=0?'good':'bad'}>{signed(jobA.commute-jobB.commute,locale)}</strong></div>
          <div className="qr-row"><span>{t.commuteTime}</span><b>{weeklyCommute(jobA).toFixed(1)} Std.</b><b>{weeklyCommute(jobB).toFixed(1)} Std.</b><strong className={result.timeSavedMonthly>=0?'good':'bad'}>{result.timeSavedMonthly>=0?'− ':'+ '}{Math.abs((weeklyCommute(jobB)-weeklyCommute(jobA))).toFixed(1)} Std.</strong></div>
          <div className="qr-real"><div><span>{t.real}</span><small>{t.afterCosts}</small></div><div><strong>{signed(range.low,locale)} – {signed(range.high,locale)}</strong><small>{t.mid}: {signed(result.diff,locale)}/Monat</small></div></div>
        </div>
        <aside className="qr-insights">
          <div className={`qr-verdict ${verdict}`}><small>{t.verdict}</small><strong>{verdict==='positive'?t.positive:verdict==='negative'?t.negative:t.unclear}</strong><p>{verdict==='positive'?t.positiveSub:verdict==='negative'?t.negativeSub:t.unclearSub}</p><div><b>{t.range}:</b> {signed(range.low,locale)} – {signed(range.high,locale)} / Monat</div></div>
          <div className="qr-insight"><span>◷</span><div><strong>{timeDelta.toFixed(1)} Std. {result.timeSavedMonthly>=0?t.lessCommute:t.moreCommute}</strong><p>{locale==='de'?'Arbeitszeit und Pendelzeit zusammen.':locale==='tr'?'Çalışma ve yol süresi birlikte.':'Work and commute time combined.'}</p></div></div>
          <div className="qr-insight"><span>€</span><div><strong>{result.hB>=result.hA?t.hourlyUp:t.hourlyDown}</strong><p>{money(result.hA,locale)} € → {money(result.hB,locale)} € / Std.</p></div></div>
          <div className="qr-insight"><span>▥</span><div><strong>{t.minimum}</strong><p>{result.targetSalary?`${money(result.targetSalary/12,locale)} € ${t.month}`:'—'}</p><small>{t.minimumSub}</small></div></div>
        </aside>
      </section>

      <section className="qr-actions"><button onClick={()=>{setDetailsOpen(!detailsOpen);if(!detailsOpen)trackEvent('details_opened');}}><b>{t.details}</b><span>{t.detailsSub}</span></button><button onClick={share}><b>{copied?t.shared:t.share}</b><span>{locale==='de'?'Speichere oder sende deinen Vergleich als Link.':locale==='tr'?'Karşılaştırmanı bağlantı olarak kaydet veya gönder.':'Save or send your comparison as a link.'}</span></button><a href={reportHref()}><b>{t.report}</b><span>{locale==='de'?'Break-even, Zielgehalt und Verhandlungsansatz.':locale==='tr'?'Başa baş, hedef maaş ve görüşme yaklaşımı.':'Break-even, target salary and negotiation approach.'}</span></a><button onClick={()=>{setView('input');setCustomized(false);setDetailsOpen(false);}}><b>{t.newCompare}</b><span>{locale==='de'?'Andere Gehälter, Städte oder Homeoffice-Tage testen.':locale==='tr'?'Başka maaş, şehir veya ofis gününü dene.':'Try other salaries, cities or office days.'}</span></button></section>

      {detailsOpen&&<section className="qr-details"><div className="qr-details-head"><h2>{t.detailsTitle}</h2><p>{t.detailsHint}</p></div><div className="qr-detail-grid"><div><h3>{t.currentJob}</h3><NumberDetail label={t.hours} value={jobA.hours} suffix="Std." step={.5} max={80} onChange={v=>updateDetail('a',{hours:v})}/><NumberDetail label={t.rent} value={jobA.rent} suffix="€" step={10} onChange={v=>updateDetail('a',{rent:v})}/><NumberDetail label={t.other} value={jobA.other} suffix="€" step={10} onChange={v=>updateDetail('a',{other:v})}/><NumberDetail label={t.commuteMonth} value={jobA.commute} suffix="€" step={10} onChange={v=>updateDetail('a',{commute:v})}/><NumberDetail label={t.commuteOneWay} value={jobA.commuteMinutes} suffix={t.minutes} step={5} max={360} onChange={v=>updateDetail('a',{commuteMinutes:v})}/></div><div><h3>{t.newJob}</h3><NumberDetail label={t.hours} value={jobB.hours} suffix="Std." step={.5} max={80} onChange={v=>updateDetail('b',{hours:v})}/><NumberDetail label={t.rent} value={jobB.rent} suffix="€" step={10} onChange={v=>updateDetail('b',{rent:v})}/><NumberDetail label={t.other} value={jobB.other} suffix="€" step={10} onChange={v=>updateDetail('b',{other:v})}/><NumberDetail label={t.commuteMonth} value={jobB.commute} suffix="€" step={10} onChange={v=>updateDetail('b',{commute:v})}/><NumberDetail label={t.commuteOneWay} value={jobB.commuteMinutes} suffix={t.minutes} step={5} max={360} onChange={v=>updateDetail('b',{commuteMinutes:v})}/></div><div className="qr-tax-details"><h3>{t.profile}</h3><SelectText label={t.children} value={jobA.children} onChange={v=>updateBoth({children:Number(v) as ChildrenCount})}>{[0,1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</SelectText><SelectText label={t.church} value={jobA.churchTaxRate} onChange={v=>updateBoth({churchTaxRate:Number(v) as ChurchTaxRate})}><option value="0">0 %</option><option value="8">8 %</option><option value="9">9 %</option></SelectText><NumberDetail label={t.health} value={jobA.healthAdditionalRate} suffix="%" step={.1} max={10} onChange={v=>updateBoth({healthAdditionalRate:v})}/></div></div><button className="qw-compare qr-apply" onClick={()=>{setDetailsOpen(false);trackEvent('details_applied');window.scrollTo({top:120,behavior:'smooth'});}}>{t.apply}</button></section>}

      <div className="qr-method"><span>ⓘ {t.disclaimer}</span><a href="/methodik/">{t.method} →</a></div>
    </main>
    <footer><span>© 2026 JobWert</span><a href="/methodik/">{t.navMethod}</a><a href="/datenschutz/">Datenschutz</a><a href="/impressum/">Impressum</a></footer>
  </>;
}
