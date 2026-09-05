import {estimateNet2026,type TaxClass,type ChurchTaxRate} from './net2026';

export type ChildrenCount=0|1|2|3|4|5;
export type Job={salary:number;hours:number;workdays:number;homeoffice:number;commute:number;commuteMinutes:number;rent:number;other:number;taxClass:TaxClass;churchTaxRate:ChurchTaxRate;children:ChildrenCount;healthAdditionalRate:number};

export const initialA:Job={salary:55000,hours:40,workdays:5,homeoffice:1,commute:100,commuteMinutes:30,rent:800,other:200,taxClass:1,churchTaxRate:0,children:0,healthAdditionalRate:2.9};
export const initialB:Job={salary:68000,hours:40,workdays:5,homeoffice:2,commute:150,commuteMinutes:45,rent:1100,other:250,taxClass:1,churchTaxRate:0,children:0,healthAdditionalRate:2.9};
export const keys:(keyof Job)[]=['salary','hours','workdays','homeoffice','commute','commuteMinutes','rent','other','taxClass','churchTaxRate','children','healthAdditionalRate'];
export const maxValues:Partial<Record<keyof Job,number>>={salary:2000000,hours:100,workdays:7,homeoffice:7,commute:20000,commuteMinutes:240,rent:20000,other:20000,healthAdditionalRate:10};

export function readJob(params:URLSearchParams,prefix:'a'|'b',fallback:Job):Job{const next={...fallback};for(const key of keys){const raw=params.get(`${prefix}_${key}`);if(raw===null)continue;const value=Number(raw);if(!Number.isFinite(value)||value<0)continue;const max=maxValues[key];(next as unknown as Record<string,number>)[key]=max===undefined?value:Math.min(max,value);}if(![1,2,3,4,5,6].includes(next.taxClass))next.taxClass=fallback.taxClass;if(![0,8,9].includes(next.churchTaxRate))next.churchTaxRate=fallback.churchTaxRate;if(![0,1,2,3,4,5].includes(next.children))next.children=fallback.children;next.workdays=Math.max(1,Math.min(7,next.workdays||fallback.workdays));next.homeoffice=Math.min(next.workdays,next.homeoffice);return next;}
export function appendJob(params:URLSearchParams,prefix:'a'|'b',job:Job){for(const key of keys)params.set(`${prefix}_${key}`,String(job[key]));}
export function monthlyDisposable(job:Job,salary=job.salary){const net=estimateNet2026(salary,{children:job.children,healthAdditionalRate:job.healthAdditionalRate,taxClass:job.taxClass,churchTaxRate:job.churchTaxRate});return net.monthlyNet-job.commute-job.rent-job.other;}
export function breakEvenSalary(targetDisposable:number,job:Job):number|null{const maxSalary=2000000;let low=0,high=Math.min(maxSalary,Math.max(job.salary*2,250000));while(monthlyDisposable(job,high)<targetDisposable&&high<maxSalary)high=Math.min(maxSalary,high*2);if(monthlyDisposable(job,high)<targetDisposable)return null;for(let i=0;i<42;i++){const mid=(low+high)/2;if(monthlyDisposable(job,mid)>=targetDisposable)high=mid;else low=mid;}return Math.ceil(high/100)*100;}
export function weeklyTime(job:Job){const officeDays=Math.max(0,job.workdays-Math.min(job.workdays,job.homeoffice));const commuteHours=(job.commuteMinutes*2*officeDays)/60;return{officeDays,commuteHours,total:job.hours+commuteHours};}

export function compareJobs(a:Job,b:Job,targetGain:number){
  const na=estimateNet2026(a.salary,{children:a.children,healthAdditionalRate:a.healthAdditionalRate,taxClass:a.taxClass,churchTaxRate:a.churchTaxRate});
  const nb=estimateNet2026(b.salary,{children:b.children,healthAdditionalRate:b.healthAdditionalRate,taxClass:b.taxClass,churchTaxRate:b.churchTaxRate});
  const da=monthlyDisposable(a),db=monthlyDisposable(b),diff=db-da;
  const timeA=weeklyTime(a),timeB=weeklyTime(b);
  const hourly=(d:number,totalHours:number)=>totalHours?d/(totalHours*4.33):0;
  const timeSavedWeekly=timeA.total-timeB.total;
  const timeSavedMonthly=timeSavedWeekly*4.33;
  const timeSavedAnnualDays=(timeSavedWeekly*46)/8;
  const breakEven=breakEvenSalary(da,b);
  const targetSalary=breakEvenSalary(da+targetGain,b);
  return{na,nb,da,db,diff,timeA,timeB,timeSavedMonthly,timeSavedAnnualDays,hA:hourly(da,timeA.total),hB:hourly(db,timeB.total),breakEven,offerVsBreakEven:breakEven===null?null:b.salary-breakEven,targetSalary,offerVsTarget:targetSalary===null?null:b.salary-targetSalary};
}

export function decisionIndex(diff:number,timeSavedMonthly:number):number{
  const moneyBetter=diff>25,moneyWorse=diff<-25,timeBetter=timeSavedMonthly>1,timeWorse=timeSavedMonthly<-1;
  if(moneyBetter&&timeBetter)return 1;
  if(moneyBetter&&timeWorse)return 2;
  if(moneyWorse&&timeBetter)return 3;
  if(moneyWorse&&timeWorse)return 4;
  if(moneyBetter)return 5;
  if(moneyWorse)return 6;
  if(timeBetter)return 7;
  if(timeWorse)return 8;
  return 0;
}
