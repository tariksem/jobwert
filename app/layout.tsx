import './style.css';
import './extra.css';
import type { Metadata } from 'next';
import AnalyticsConsent from './AnalyticsConsent';
import {legal} from './legal';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwert.de';
const gaId = legal.gaId;
const indexable = process.env.NEXT_PUBLIC_INDEXABLE !== 'false';
const socialImage='/jobwert-social.svg';

export const metadata: Metadata = {
  title: 'JobWert – Was ist dein Jobangebot wirklich wert?',
  description: 'Vergleiche Gehalt, Steuern, Wohn- und Pendelkosten und finde heraus, ob sich ein neuer Job wirklich lohnt.',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: siteUrl,
    siteName: 'JobWert',
    title: 'JobWert – Was ist dein Jobangebot wirklich wert?',
    description: 'Vergleiche Gehalt, Steuern, Wohn- und Pendelkosten und finde heraus, ob sich ein neuer Job wirklich lohnt.',
    images:[{url:socialImage,width:1200,height:630,alt:'JobWert – Jobangebote real vergleichen'}],
  },
  twitter:{
    card:'summary_large_image',
    title:'JobWert – Was ist dein Jobangebot wirklich wert?',
    description:'Vergleiche Gehalt, Wohn- und Pendelkosten, Arbeitszeit und Homeoffice kostenlos.',
    images:[socialImage],
  },
  robots: {
    index: indexable,
    follow: indexable,
    googleBot: { index: indexable, follow: indexable },
  },
};

const structuredData={
  '@context':'https://schema.org',
  '@type':'WebApplication',
  name:'JobWert',
  url:siteUrl,
  applicationCategory:'BusinessApplication',
  operatingSystem:'Web',
  inLanguage:'de-DE',
  description:'Kostenloser Rechner zum Vergleich eines aktuellen Jobs mit einem neuen Jobangebot anhand von geschätztem Netto, Wohn- und Pendelkosten sowie Arbeits- und Pendelzeit.',
  offers:{'@type':'Offer',price:'0',priceCurrency:'EUR'},
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="de"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/>{children}<AnalyticsConsent gaId={gaId}/></body></html>;
}
