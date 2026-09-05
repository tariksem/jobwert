import type {Metadata} from 'next';
import PremiumReport from './PremiumReport';

export const metadata:Metadata={title:'Premium Jobwechsel-Bericht | JobWert',description:'Verdichte deinen Jobvergleich zu einem klaren Entscheidungsbericht mit Break-even, Zielgehalt, Verhandlungstext und nächsten Schritten.'};

export default function Page(){
  return <PremiumReport/>;
}
