import assert from 'node:assert/strict';
import test from 'node:test';
import {annualSalary,buildEstimatedJobs,estimateHousing,realAdvantageRange,verdictFromRange} from '../lib/quickEstimate';

test('monthly salary is annualized',()=>{
  assert.equal(annualSalary({salary:5000,period:'month',city:'Berlin',officeDays:3,transport:'car'}),60000);
});

test('family housing estimate is higher than single-person estimate',()=>{
  assert.ok(estimateHousing('Berlin','family').rent>estimateHousing('Berlin','alone').rent);
});

test('moving from Muenster to Berlin changes estimated housing cost',()=>{
  const current={salary:4200,period:'month' as const,city:'Münster',officeDays:3,transport:'car' as const};
  const next={salary:5000,period:'month' as const,city:'Berlin',officeDays:3,transport:'car' as const};
  const r=buildEstimatedJobs(current,next,{taxClass:1,household:'family',moving:true});
  assert.ok(r.b.rent>r.a.rent);
  assert.equal(r.nextResidence,'Berlin');
});

test('not moving keeps housing estimate at current city and adds intercity commute',()=>{
  const current={salary:4200,period:'month' as const,city:'Münster',officeDays:3,transport:'car' as const};
  const next={salary:5000,period:'month' as const,city:'Berlin',officeDays:3,transport:'public' as const};
  const r=buildEstimatedJobs(current,next,{taxClass:1,household:'alone',moving:false});
  assert.equal(r.a.rent,r.b.rent);
  assert.equal(r.nextResidence,'Münster');
  assert.equal(r.nextCommute.intercity,true);
  assert.ok(r.nextCommute.monthlyCost>r.currentCommute.monthlyCost);
});

test('advantage range and verdict are conservative',()=>{
  const range=realAdvantageRange(600,{aLow:1000,aHigh:1200,bLow:1100,bHigh:1300});
  assert.deepEqual(range,{low:300,high:700});
  assert.equal(verdictFromRange(range),'positive');
  assert.equal(verdictFromRange({low:-50,high:80}),'unclear');
  assert.equal(verdictFromRange({low:-500,high:-120}),'negative');
});
