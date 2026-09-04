import assert from 'node:assert/strict';
import test from 'node:test';
import {buildNegotiationText,negotiationStats} from '../lib/negotiation';

test('negotiation stats calculate absolute and percentage difference',()=>{
  const r=negotiationStats({offerSalary:68000,targetSalary:75000});
  assert.equal(r.difference,7000);
  assert.ok(Math.abs(r.percent-10.2941)<0.01);
});

test('generated text contains target and delta in German format',()=>{
  const text=buildNegotiationText({offerSalary:68000,targetSalary:75000});
  assert.match(text,/75\.000 €/);
  assert.match(text,/7\.000 €/);
});

test('no delta sentence is added when target is not above offer',()=>{
  const text=buildNegotiationText({offerSalary:75000,targetSalary:70000});
  assert.doesNotMatch(text,/über dem aktuellen Angebot/);
});

test('zero target returns empty text',()=>{
  assert.equal(buildNegotiationText({offerSalary:68000,targetSalary:0}),'');
});
