import './style.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'JobWert – Was ist dein Jobangebot wirklich wert?',
  description: 'Vergleiche Gehalt, Steuern, Wohn- und Pendelkosten und finde heraus, ob sich ein neuer Job wirklich lohnt.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwert.pages.dev')
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body>{children}</body></html>}
