'use client';
declare global { interface Window { gtag?: (...args:any[])=>void } }
let used=false;
export function trackEvent(name:string,params:Record<string,unknown>={}){if(typeof window!=='undefined'&&window.gtag)window.gtag('event',name,params)}
export function trackCalculatorUseOnce(){if(used)return;used=true;trackEvent('calculator_used')}
