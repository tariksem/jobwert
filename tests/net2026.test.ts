import assert from 'node:assert/strict';
import test from 'node:test';
import {estimateNet2026} from '../lib/net2026';

const base={children:0 as const,healthAdditionalRate:2.9,churchTaxRate:0 as const};

test('zero gross produces zero net and deductions',()=>{
  const r=estimateNet2026(0,{...base,taxClass:1});
  assert.equal(r.annualNet,0);
  assert.equal(r.monthlyNet,0);
  assert.equal(r.incomeTax,0);
  assert.equal(r.soli,0);
  assert.equal(r.church,0);
  assert.equal(r.social,0);
});

test('higher gross produces higher monthly net',()=>{
  const low=estimateNet2026(45000,{...base,taxClass:1});
  const high=estimateNet2026(70000,{...base,taxClass:1});
  assert.ok(high.monthlyNet>low.monthlyNet);
});

test('tax classes materially affect wage tax result',()=>{
  const gross=70000;
  const stkl1=estimateNet2026(gross,{...base,taxClass:1});
  const stkl3=estimateNet2026(gross,{...base,taxClass:3});
  const stkl5=estimateNet2026(gross,{...base,taxClass:5});
  assert.ok(stkl3.monthlyNet>stkl1.monthlyNet,'Steuerklasse III should produce more monthly net than I for this reference case');
  assert.ok(stkl1.monthlyNet>stkl5.monthlyNet,'Steuerklasse I should produce more monthly net than V for this reference case');
});

test('church tax reduces net and is reported separately',()=>{
  const gross=65000;
  const none=estimateNet2026(gross,{...base,taxClass:1});
  const church=estimateNet2026(gross,{...base,taxClass:1,churchTaxRate:9});
  assert.ok(church.church>0);
  assert.ok(church.monthlyNet<none.monthlyNet);
});

test('children reduce employee care-insurance burden in the model',()=>{
  const gross=60000;
  const childless=estimateNet2026(gross,{...base,taxClass:1});
  const withChildren=estimateNet2026(gross,{...base,taxClass:1,children:2});
  assert.ok(withChildren.social<childless.social);
  assert.ok(withChildren.monthlyNet>childless.monthlyNet);
});

test('all standard tax classes return finite non-negative values',()=>{
  for(const taxClass of [1,2,3,4,5,6] as const){
    const r=estimateNet2026(55000,{...base,taxClass});
    for(const value of [r.annualNet,r.monthlyNet,r.incomeTax,r.soli,r.church,r.social]){
      assert.ok(Number.isFinite(value));
      assert.ok(value>=0);
    }
  }
});
