import type {Metadata} from 'next';

export const metadata:Metadata={
  title:'JobWert – İş Tekliflerini ve Gerçek Kazancı Karşılaştır',
  description:'Maaş, vergi, konut, ulaşım, çalışma süresi ve home office koşullarını karşılaştır; yeni iş teklifinin gerçekte ne kadar değerli olduğunu gör.',
  alternates:{canonical:'/tr/',languages:{'de-DE':'/','en':'/en/','tr':'/tr/'}},
};

export default function TurkishLayout({children}:{children:React.ReactNode}){return children;}
