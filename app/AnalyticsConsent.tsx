'use client';

import Script from 'next/script';
import {useEffect,useState} from 'react';

const STORAGE_KEY='jobwert_analytics_consent';

type Consent='accepted'|'declined'|null;

export default function AnalyticsConsent({gaId}:{gaId?:string}){
  const[consent,setConsent]=useState<Consent>(null);
  const[ready,setReady]=useState(false);

  useEffect(()=>{
    const stored=window.localStorage.getItem(STORAGE_KEY);
    if(stored==='accepted'||stored==='declined')setConsent(stored);
    setReady(true);
  },[]);

  const choose=(value:Exclude<Consent,null>)=>{
    window.localStorage.setItem(STORAGE_KEY,value);
    setConsent(value);
  };

  if(!gaId)return null;

  return <>
    {consent==='accepted'&&<>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive"/>
      <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}</Script>
    </>}
    {ready&&consent===null&&<aside className="consentBanner" role="dialog" aria-label="Analytics-Einwilligung">
      <div><strong>Datenschutz-Einstellungen</strong><p>Wir möchten optionale, pseudonyme Nutzungsstatistiken mit Google Analytics erheben. Der Rechner funktioniert auch ohne Analytics.</p></div>
      <div className="consentActions"><button className="secondary" onClick={()=>choose('declined')}>Nur notwendige</button><button className="primary" onClick={()=>choose('accepted')}>Analytics erlauben</button></div>
    </aside>}
  </>;
}
