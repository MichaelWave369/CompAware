import test from 'node:test';
import assert from 'node:assert/strict';
import { threeWitnessWorlds, matchedIndependentAccuracy,
 twoSensorAgreementWithCommonFailure, REPORT_PATTERNS } from '../src/data/independenceIllusion.js';

const near=(a,b,where='')=>assert.ok(Math.abs(a-b)<1e-11,`${where}: ${a} !== ${b}`);

test('default shared world is 72% reliable but misleadingly suggests 92.2%',()=>{
 const x=threeWitnessWorlds();
 near(x.trueSharedSensorAccuracy,.72,'actual individual accuracy');
 near(x.pairwiseAgreement,.856,'agreement');
 assert.ok(x.matchedIndependentAccuracy>.92 && x.matchedIndependentAccuracy<.93);
 assert.ok(x.overestimate>.20);
});

test('every one of the eight observable triple patterns matches exactly',()=>{
 const x=threeWitnessWorlds();
 assert.deepEqual(x.rows.map(v=>v.pattern),REPORT_PATTERNS);
 const expected={ '000':.392,'001':.036,'010':.036,'011':.036,
  '100':.036,'101':.036,'110':.036,'111':.392 };
 for(const row of x.rows) {
  near(row.shared,expected[row.pattern],row.pattern+' shared');
  near(row.independent,expected[row.pattern],row.pattern+' independent');
  near(row.shared,row.independent,row.pattern+' observational equivalence');
 }
 near(x.rows.reduce((v,y)=>v+y.shared,0),1,'shared total');
 near(x.rows.reduce((v,y)=>v+y.independent,0),1,'independent total');
});

test('observational equivalence survives different common-mode rates',()=>{
 for(const q of [0,.05,.1,.2,.25,.3,.4,.75,1]) {
  for(const r of [.5,.7,.9,1]) {
   const x=threeWitnessWorlds({commonFailureRate:q,baseAccuracy:r});
   near(x.pairwiseAgreement,twoSensorAgreementWithCommonFailure(q,r));
   near(x.matchedIndependentAccuracy,matchedIndependentAccuracy(q,r));
   for(const row of x.rows)near(row.shared,row.independent,`q=${q},r=${r},${row.pattern}`);
   near(x.rows.reduce((sum,v)=>sum+v.shared,0),1);
  }
 }
});

test('zero common-mode failure recovers the ordinary independent case',()=>{
 const x=threeWitnessWorlds({commonFailureRate:0,baseAccuracy:.9});
 near(x.matchedIndependentAccuracy,.9);
 near(x.trueSharedSensorAccuracy,.9);
});

test('strict input validation rejects invalid or non-finite probabilities',()=>{
 assert.throws(()=>threeWitnessWorlds({commonFailureRate:NaN}),/common failure rate/);
 assert.throws(()=>threeWitnessWorlds({commonFailureRate:1.1}),/common failure rate/);
 assert.throws(()=>threeWitnessWorlds({baseAccuracy:.4}),/base sensor accuracy/);
 assert.throws(()=>matchedIndependentAccuracy(-1,.9),/common failure rate/);
 assert.throws(()=>matchedIndependentAccuracy(.2,Infinity),/base sensor accuracy/);
});
