import type {Metadata} from 'next';

export const metadata:Metadata={
  title:'Gehaltsverhandlung vorbereiten – Zielgehalt formulieren | JobWert',
  description:'Vergleiche Angebot und Zielgehalt und erstelle kostenlos einen sachlichen deutschen Text für deine Gehaltsverhandlung.',
};

export default function GehaltsverhandlungLayout({children}:{children:React.ReactNode}){
  return children;
}
