import {calculate} from 'lohnsteuerrechner';

export type TaxClass = 1|2|3|4|5|6;
export type ChurchTaxRate = 0|8|9;
type Opts={children:0|1|2|3|4|5;healthAdditionalRate:number;taxClass:TaxClass;churchTaxRate:ChurchTaxRate};

const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));

/**
 * Approximate employee social-insurance contributions for a standard employee
 * in statutory health/pension insurance outside Saxony. Wage tax, solidarity
 * surcharge and the church-tax assessment base are calculated with the official
 * BMF PAP 2026 algorithm through the lohnsteuerrechner package.
 */
export function estimateNet2026(grossAnnual:number,o:Opts){
  const gross=Math.max(0,grossAnnual);
  const healthBBG=69750;
  const pensionBBG=101400;
  const healthBase=Math.min(gross,healthBBG);
  const pensionBase=Math.min(gross,pensionBBG);

  const pension=pensionBase*0.093;
  const unemployment=pensionBase*0.013;
  const health=healthBase*((0.146+o.healthAdditionalRate/100)/2);
  let careRate=o.children===0?0.024:0.018;
  if(o.children>=2)careRate-=Math.min(4,o.children-1)*0.0025;
  const care=healthBase*clamp(careRate,0.008,0.024);
  const social=pension+unemployment+health+care;

  const monthlyGrossCents=Math.round((gross/12)*100);
  const pap=calculate(2026,{
    LZZ:2,
    RE4:monthlyGrossCents,
    STKL:o.taxClass,
    R:o.churchTaxRate>0?1:0,
    ZKF:o.children,
    KRV:0,
    PKV:0,
    KVZ:o.healthAdditionalRate,
    PVZ:o.children===0?1:0,
    PVS:0,
    PVA:Math.min(4,Math.max(0,o.children-1)),
    af:0,
  });

  const monthlyIncomeTax=pap.LSTLZZ/100;
  const monthlySoli=pap.SOLZLZZ/100;
  const monthlyChurchBase=pap.BK/100;
  const monthlyChurch=monthlyChurchBase*(o.churchTaxRate/100);

  const incomeTax=monthlyIncomeTax*12;
  const soli=monthlySoli*12;
  const church=monthlyChurch*12;
  const annualNet=Math.max(0,gross-social-incomeTax-soli-church);

  return{
    annualNet,
    monthlyNet:annualNet/12,
    incomeTax,
    soli,
    church,
    social,
  };
}
