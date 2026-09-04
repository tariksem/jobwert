export type NegotiationInput={offerSalary:number;targetSalary:number};

export function negotiationStats({offerSalary,targetSalary}:NegotiationInput){
  const offer=Math.max(0,offerSalary);
  const target=Math.max(0,targetSalary);
  const difference=target-offer;
  const percent=offer>0?(difference/offer)*100:0;
  return{offer,target,difference,percent};
}

const eur=(n:number)=>Math.round(n).toLocaleString('de-DE');

export function buildNegotiationText(input:NegotiationInput){
  const {offer,target,difference}=negotiationStats(input);
  if(target<=0)return'';
  const delta=difference>0?` Das entspricht rund ${eur(difference)} € über dem aktuellen Angebot.`:'';
  return `Vielen Dank für das Angebot. Nach meiner Bewertung des Gesamtpakets und der mit dem Wechsel verbundenen Rahmenbedingungen stelle ich mir ein Jahresbruttogehalt von etwa ${eur(target)} € vor.${delta} Wenn wir uns diesem Rahmen annähern können, sehe ich eine gute Grundlage für den nächsten Schritt.`;
}
