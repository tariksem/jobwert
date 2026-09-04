import type {Metadata} from 'next';

export const metadata:Metadata={
  title:'JobWert – Compare Job Offers and Real Disposable Income',
  description:'Compare salary, taxes, housing, commuting, work time and home office to see what a new job offer is really worth.',
  alternates:{canonical:'/en/',languages:{'de-DE':'/','en':'/en/','tr':'/tr/'}},
};

export default function EnglishLayout({children}:{children:React.ReactNode}){return children;}
