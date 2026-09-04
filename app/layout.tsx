import './style.css';
import type { Metadata } from 'next';
import AnalyticsConsent from './AnalyticsConsent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwert.pages.dev';
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const indexable = process.env.NEXT_PUBLIC_INDEXABLE === 'true';

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
  },
  robots: {
    index: indexable,
    follow: indexable,
    googleBot: { index: indexable, follow: indexable },
  },
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="de"><body>{children}<AnalyticsConsent gaId={gaId}/></body></html>;
}
