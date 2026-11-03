import test from 'node:test';
import assert from 'node:assert/strict';
import { interventionMirror,matchedCommonBaseAccuracy,INTERVENTION_MODEL } from '../src/data/interventionTransport.js';

const near=(x,y,msg='')=>assert.ok(Math.abs(x-y)<1e-10,`${msg}: ${x} != ${y}`);

test('both stories match the complete 8-report law before and after intervention',()=>{
 const study=interventionMirror();
 assert.equal(study.rows.length,8);
 for(const row of study.rows){
   near(row.beforeIndependent,row.beforeCommon,row.pattern+' pre');
   near(row.afterIndependent,row.afterCommon,row.pattern+' post');
 }
 near(study.rows.reduce((a,r)=>a+r.beforeCommon,0),1);
 near(study.rows.reduce((a,r)=>a+r.afterCommon,0),1);
});

test('default illustration has visible change but no identifiable hidden story',()=>{
 const study=interventionMirror();
 near(study.before.independentReliability,.9219004621945798);
 near(study.before.commonActualReliability,.72);
 near(study.before.reportPairAgreement,.856);
 near(study.after.independentReliability,.9);
 near(study.after.commonFailureRate,.1);
 near(study.after.commonBaseAccuracy,.8872983346207417);
 near(study.after.commonActualReliability,.7985685011586675);
 near(study.after.reportPairAgreement,.82);
 const all=study.rows.filter(r=>r.pattern==='000'||r.pattern==='111');
 all.forEach(row=>{near(row.beforeIndependent,.392);near(row.afterIndependent,.365);});
});

test('all supported post-intervention accuracy slider positions remain equivalent',()=>{
 for(let p=85;p<=95;p++){
  const study=interventionMirror({afterIndependentAccuracy:p/100});
  for(const row of study.rows) near(row.afterIndependent,row.afterCommon,p+':'+row.pattern);
  near(study.rows.reduce((a,r)=>a+r.afterIndependent,0),1);
  near(study.rows.reduce((a,r)=>a+r.afterCommon,0),1);
 }
});

test('identifiability boundary cannot be bypassed with out-of-range assumptions',()=>{
 assert.throws(()=>matchedCommonBaseAccuracy(.4,.1),/independent accuracy/);
 assert.throws(()=>matchedCommonBaseAccuracy(.9,1),/common failure rate/);
 assert.throws(()=>matchedCommonBaseAccuracy(.9,-.1),/common failure rate/);
 assert.throws(()=>matchedCommonBaseAccuracy(NaN,.1),/independent accuracy/);
 assert.throws(()=>interventionMirror({afterIndependentAccuracy:Infinity}),/independent accuracy/);
 assert.equal(matchedCommonBaseAccuracy(.5,.5),null);
 assert.match(INTERVENTION_MODEL.claimsBoundary,/Analytical probabilities/);
});
