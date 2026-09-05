'use client';

import {useEffect} from 'react';

// The single root layout (app/layout.tsx) sets <html lang="de">, which is
// required for the German routes and cannot vary per-route without splitting
// the app into multiple root layouts (a much larger routing change).
// This component corrects the document language for the /en and /tr routes
// after mount, without touching route structure or static export output.
export default function HtmlLangSetter({lang}:{lang:string}){
  useEffect(()=>{
    document.documentElement.lang=lang;
  },[lang]);
  return null;
}
