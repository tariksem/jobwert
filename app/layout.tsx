import './style.css';
import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwert.pages.dev';
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: 'JobWert – Was ist dein Jobangebot wirklich wert?',
  description: 'Vergleiche Gehalt, Steuern, Wohn- und Pendelkosten und finde heraus, ob sich ein neuer Job wirklich lohnt.',
  metadataBase: new URL(siteUrl),
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="de"><body>{children}{gaId&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive"/><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script></>}</body></html>;
}
