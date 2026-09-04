export type TaxClass = 1|2|3|4|5|6;
export type ChurchTaxRate = 0|8|9;
type Opts={children:0|1|2|3|4|5;healthAdditionalRate:number;taxClass:TaxClass;churchTaxRate:ChurchTaxRate};
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));
function incomeTax2026(zve:number,taxClass:TaxClass){
  const x=Math.max(0,zve);
  let tax=0;
  if(x<=12348) tax=0;
  else if(x<=17799){const y=(x-12348)/10000;tax=(914.51*y+1400)*y;}
  else if(x<=69878){const z=(x-17799)/10000;tax=(173.10*z+2397)*z+1034.87;}
  else if(x<=277825) tax=0.42*x-11135.63;
  else tax=0.45*x-19470.38;
  if(taxClass===3) tax*=0.62;
  if(taxClass===5) tax*=1.18;
  if(taxClass===6) tax*=1.28;
  if(taxClass===2) tax*=0.96;
  return Math.max(0,tax);
}
export function estimateNet2026(grossAnnual:number,o:Opts){
  const gross=Math.max(0,grossAnnual);
  const healthBBG=69750, pensionBBG=101400;
  const healthBase=Math.min(gross,healthBBG), pensionBase=Math.min(gross,pensionBBG);
  const pension=pensionBase*0.093;
  const unemployment=pensionBase*0.013;
  const health=healthBase*((0.146+o.healthAdditionalRate/100)/2);
  let careRate=o.children===0?0.024:0.018;
  if(o.children>=2) careRate-=Math.min(4,o.children-1)*0.0025;
  const care=healthBase*clamp(careRate,0.008,0.024);
  const social=pension+unemployment+health+care;
  const taxable=Math.max(0,gross-social-1230);
  const incomeTax=incomeTax2026(taxable,o.taxClass);
  const soliAllowance=(o.taxClass===3?40700:20350);
  const soli=incomeTax>soliAllowance?incomeTax*0.055:0;
  const church=incomeTax*(o.churchTaxRate/100);
  const annualNet=Math.max(0,gross-social-incomeTax-soli-church);
  return {annualNet,monthlyNet:annualNet/12,incomeTax,soli,church,social};
}
