import type {TaxClass} from './net2026';
import type {Job} from './jobCompare';

export type Household='alone'|'pair'|'family';
export type Transport='car'|'public'|'bike'|'walk';
export type SalaryPeriod='month'|'year';

export type QuickJobInput={
  salary:number;
  period:SalaryPeriod;
  city:string;
  officeDays:number;
  transport:Transport;
};

export type QuickProfile={
  taxClass:TaxClass;
  household:Household;
  moving:boolean;
};

type CityProfile={rentFactor:number;costFactor:number;commuteMinutes:number;lat:number;lon:number};

const CITY:Record<string,CityProfile>={
  berlin:{rentFactor:1.34,costFactor:1.08,commuteMinutes:38,lat:52.52,lon:13.405},
  hamburg:{rentFactor:1.30,costFactor:1.07,commuteMinutes:36,lat:53.551,lon:9.994},
  munchen:{rentFactor:1.66,costFactor:1.14,commuteMinutes:36,lat:48.137,lon:11.576},
  koln:{rentFactor:1.28,costFactor:1.07,commuteMinutes:34,lat:50.938,lon:6.96},
  frankfurt:{rentFactor:1.40,costFactor:1.10,commuteMinutes:34,lat:50.11,lon:8.682},
  stuttgart:{rentFactor:1.38,costFactor:1.09,commuteMinutes:33,lat:48.775,lon:9.182},
  dusseldorf:{rentFactor:1.29,costFactor:1.07,commuteMinutes:32,lat:51.227,lon:6.773},
  dortmund:{rentFactor:1.04,costFactor:1.00,commuteMinutes:29,lat:51.514,lon:7.466},
  essen:{rentFactor:1.06,costFactor:1.00,commuteMinutes:29,lat:51.456,lon:7.012},
  leipzig:{rentFactor:1.02,costFactor:.98,commuteMinutes:28,lat:51.34,lon:12.374},
  bremen:{rentFactor:1.06,costFactor:1.00,commuteMinutes:29,lat:53.079,lon:8.802},
  dresden:{rentFactor:1.00,costFactor:.98,commuteMinutes:28,lat:51.05,lon:13.738},
  hannover:{rentFactor:1.10,costFactor:1.01,commuteMinutes:30,lat:52.375,lon:9.732},
  nurnberg:{rentFactor:1.12,costFactor:1.02,commuteMinutes:29,lat:49.452,lon:11.077},
  duisburg:{rentFactor:.98,costFactor:.98,commuteMinutes:28,lat:51.434,lon:6.762},
  bochum:{rentFactor:1.00,costFactor:.99,commuteMinutes:28,lat:51.482,lon:7.216},
  wuppertal:{rentFactor:.98,costFactor:.98,commuteMinutes:29,lat:51.257,lon:7.15},
  bielefeld:{rentFactor:1.00,costFactor:.99,commuteMinutes:27,lat:52.03,lon:8.533},
  bonn:{rentFactor:1.22,costFactor:1.04,commuteMinutes:30,lat:50.737,lon:7.099},
  munster:{rentFactor:1.18,costFactor:1.03,commuteMinutes:27,lat:51.961,lon:7.626},
  karlsruhe:{rentFactor:1.18,costFactor:1.03,commuteMinutes:28,lat:49.006,lon:8.403},
  mannheim:{rentFactor:1.13,costFactor:1.02,commuteMinutes:29,lat:49.487,lon:8.467},
  augsburg:{rentFactor:1.16,costFactor:1.02,commuteMinutes:27,lat:48.37,lon:10.898},
  wiesbaden:{rentFactor:1.25,costFactor:1.05,commuteMinutes:30,lat:50.078,lon:8.239},
  gelsenkirchen:{rentFactor:.91,costFactor:.96,commuteMinutes:27,lat:51.517,lon:7.085},
  monchengladbach:{rentFactor:.96,costFactor:.98,commuteMinutes:27,lat:51.181,lon:6.442},
  aachen:{rentFactor:1.10,costFactor:1.01,commuteMinutes:28,lat:50.776,lon:6.084},
  freiburg:{rentFactor:1.30,costFactor:1.06,commuteMinutes:27,lat:47.999,lon:7.842},
  mainz:{rentFactor:1.24,costFactor:1.05,commuteMinutes:29,lat:49.993,lon:8.247},
  kiel:{rentFactor:1.08,costFactor:1.00,commuteMinutes:27,lat:54.323,lon:10.122},
  saarbrucken:{rentFactor:.96,costFactor:.98,commuteMinutes:27,lat:49.24,lon:6.997},
  potsdam:{rentFactor:1.24,costFactor:1.04,commuteMinutes:31,lat:52.39,lon:13.064},
  erlangen:{rentFactor:1.20,costFactor:1.03,commuteMinutes:26,lat:49.589,lon:11.011},
  regensburg:{rentFactor:1.17,costFactor:1.03,commuteMinutes:27,lat:49.013,lon:12.101},
};

const HOUSEHOLD_SPACE:Record<Household,number>={alone:50,pair:70,family:90};
const OTHER_BASE:Record<Household,number>={alone:610,pair:920,family:1260};
const BASE_WARM_RENT_SQM=12.8;

function normalizeCity(city:string){
  return city.trim().toLowerCase().replace(/ß/g,'ss').replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'');
}

export function cityProfile(city:string):CityProfile|null{
  const key=normalizeCity(city);
  if(!key)return null;
  if(CITY[key])return CITY[key];
  const aliases:Record<string,string>={muenchen:'munchen',muenster:'munster',koeln:'koln',duesseldorf:'dusseldorf',nuernberg:'nurnberg',moenchengladbach:'monchengladbach',saarbruecken:'saarbrucken'};
  return CITY[aliases[key]??'']??null;
}

function round10(n:number){return Math.round(n/10)*10;}
function range(value:number,pct:number){return{low:round10(value*(1-pct)),high:round10(value*(1+pct))};}

export function annualSalary(input:QuickJobInput){
  return Math.max(0,input.salary)*(input.period==='month'?12:1);
}

export function estimateHousing(city:string,household:Household){
  const p=cityProfile(city);
  const rentFactor=p?.rentFactor??1;
  const costFactor=p?.costFactor??1;
  const rent=round10(HOUSEHOLD_SPACE[household]*BASE_WARM_RENT_SQM*rentFactor);
  const other=round10(OTHER_BASE[household]*costFactor);
  return{
    rent,
    rentRange:range(rent,p?0.15:0.22),
    other,
    otherRange:range(other,p?0.10:0.16),
    recognized:!!p,
  };
}

function haversineKm(a:CityProfile,b:CityProfile){
  const rad=(x:number)=>x*Math.PI/180;
  const dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon);
  const q=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q));
}

export function estimateCommute(residenceCity:string,workCity:string,officeDays:number,transport:Transport){
  const days=Math.max(0,Math.min(5,Math.round(officeDays)));
  if(days===0)return{monthlyCost:0,costRange:{low:0,high:0},oneWayMinutes:0,recognized:true,intercity:false,distanceKm:0};
  const home=cityProfile(residenceCity),work=cityProfile(workCity);
  const same=normalizeCity(residenceCity)===normalizeCity(workCity);
  let distanceKm=0;
  let oneWayMinutes=30;
  let monthlyCost=0;
  let recognized=!!home&&!!work;
  let intercity=false;

  if(!same&&home&&work){
    distanceKm=haversineKm(home,work)*1.18;
    if(distanceKm>12){
      intercity=true;
      const speed=transport==='car'?82:transport==='public'?105:transport==='bike'?18:5;
      const buffer=transport==='public'?25:transport==='car'?10:5;
      oneWayMinutes=Math.round((distanceKm/speed)*60+buffer);
      if(transport==='car')monthlyCost=distanceKm*2*days*4.33*.35;
      else if(transport==='public')monthlyCost=Math.max(63,distanceKm*2*days*4.33*.10);
      else if(transport==='bike')monthlyCost=12;
      else monthlyCost=0;
    }
  }

  if(!intercity){
    const p=work??home;
    const base=p?.commuteMinutes??30;
    const timeFactor:Record<Transport,number>={car:.92,public:1.12,bike:.82,walk:.68};
    oneWayMinutes=Math.max(10,Math.round(base*timeFactor[transport]));
    if(transport==='car')monthlyCost=10*2*days*4.33*.35+25;
    else if(transport==='public')monthlyCost=63;
    else if(transport==='bike')monthlyCost=12;
    else monthlyCost=0;
    recognized=!!p;
  }

  monthlyCost=round10(monthlyCost);
  return{
    monthlyCost,
    costRange:range(monthlyCost,recognized?0.20:0.30),
    oneWayMinutes,
    recognized,
    intercity,
    distanceKm:Math.round(distanceKm),
  };
}

export function buildEstimatedJobs(current:QuickJobInput,next:QuickJobInput,profile:QuickProfile){
  const currentHousing=estimateHousing(current.city,profile.household);
  const nextResidence=profile.moving?next.city:current.city;
  const nextHousing=profile.moving?estimateHousing(next.city,profile.household):currentHousing;
  const currentCommute=estimateCommute(current.city,current.city,current.officeDays,current.transport);
  const nextCommute=estimateCommute(nextResidence,next.city,next.officeDays,next.transport);

  const makeJob=(input:QuickJobInput,housing:ReturnType<typeof estimateHousing>,commute:ReturnType<typeof estimateCommute>):Job=>({
    salary:annualSalary(input),
    hours:40,
    workdays:5,
    homeoffice:Math.max(0,5-Math.max(0,Math.min(5,input.officeDays))),
    commute:commute.monthlyCost,
    commuteMinutes:commute.oneWayMinutes,
    rent:housing.rent,
    other:housing.other,
    taxClass:profile.taxClass,
    churchTaxRate:0,
    children:0,
    healthAdditionalRate:2.9,
  });

  const a=makeJob(current,currentHousing,currentCommute);
  const b=makeJob(next,nextHousing,nextCommute);
  const aLow=currentHousing.rentRange.low+currentHousing.otherRange.low+currentCommute.costRange.low;
  const aHigh=currentHousing.rentRange.high+currentHousing.otherRange.high+currentCommute.costRange.high;
  const bLow=nextHousing.rentRange.low+nextHousing.otherRange.low+nextCommute.costRange.low;
  const bHigh=nextHousing.rentRange.high+nextHousing.otherRange.high+nextCommute.costRange.high;

  return{
    a,b,
    currentHousing,nextHousing,currentCommute,nextCommute,nextResidence,
    confidence:(currentHousing.recognized&&nextHousing.recognized&&currentCommute.recognized&&nextCommute.recognized?'high':'low') as 'high'|'low',
    costRanges:{aLow,aHigh,bLow,bHigh},
  };
}

export function realAdvantageRange(netDiff:number,costRanges:{aLow:number;aHigh:number;bLow:number;bHigh:number}){
  const low=Math.round(netDiff-(costRanges.bHigh-costRanges.aLow));
  const high=Math.round(netDiff-(costRanges.bLow-costRanges.aHigh));
  return low<=high?{low,high}:{low:high,high:low};
}

export function verdictFromRange(r:{low:number;high:number}){
  if(r.low>75)return 'positive' as const;
  if(r.high<-75)return 'negative' as const;
  return 'unclear' as const;
}

export const citySuggestions=['Berlin','Hamburg','München','Köln','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nürnberg','Duisburg','Bochum','Wuppertal','Bielefeld','Bonn','Münster','Karlsruhe','Mannheim','Augsburg','Wiesbaden','Aachen','Freiburg','Mainz','Kiel','Potsdam','Erlangen','Regensburg'];
