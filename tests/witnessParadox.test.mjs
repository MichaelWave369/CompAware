import test from 'node:test';
import assert from 'node:assert/strict';
import {
 WITNESS_MODEL, agreement, matchingReliability, observablePairs,
 inferThreeIndependentReliabilities,
} from '../src/data/witnessParadox.js';

const close=(x,y)=>assert.ok(Math.abs(x-y)<1e-10, `${x} != ${y}`);

test('two physically distinct reliability pairs yield the same exact agreement',()=>{
 close(agreement(.8,.8),.68);
 close(agreement(.95,.7),.68);
 assert.notDeepEqual(WITNESS_MODEL.reference,WITNESS_MODEL.exampleAlternative);
});

test('entire observable joint report law matches for the two worlds',()=>{
 const one=observablePairs(.8,.8),two=observablePairs(.95,.7);
 assert.deepEqual(one.map(x=>x.label),two.map(x=>x.label));
 for(let i=0;i<one.length;i++) close(one[i].probability,two[i].probability);
 [.34,.16,.16,.34].forEach((expected,i)=>close(one[i].probability,expected));
 close(one.reduce((sum,x)=>sum+x.probability,0),1);
});

test('A in range 70%-95% can yield matching B for the same visible law',()=>{
 for(let a=70;a<=95;a+=5) {
  const b=matchingReliability(a/100);
  assert.ok(b>=.7-1e-10 && b<=.95+1e-10);
  close(agreement(a/100,b),WITNESS_MODEL.targetAgreement);
 }
 close(matchingReliability(.8),.8);
 close(matchingReliability(.95),.7);
});

test('strict bounds and unidentifiable half-accurate sensor are explicit',()=>{
 assert.equal(matchingReliability(.5),null);
 assert.throws(()=>agreement(-.1,.7),/reliabilities/);
 assert.throws(()=>agreement(1,NaN),/reliabilities/);
 assert.throws(()=>matchingReliability(.1,3),/Reliability/);
 assert.throws(()=>matchingReliability(Infinity),/Reliability/);
});

test('three independent symmetric better-than-chance witnesses are solvable under assumptions',()=>{
 const p=[.9,.8,.7];
 const a12=agreement(p[0],p[1]),a13=agreement(p[0],p[2]),a23=agreement(p[1],p[2]);
 const inferred=inferThreeIndependentReliabilities(a12,a13,a23);
 for(let i=0;i<3;i++)close(inferred[i],p[i]);
 assert.throws(()=>inferThreeIndependentReliabilities(.6,.9,.55),/incompatible/i);
 assert.throws(()=>inferThreeIndependentReliabilities(.4,.7,.6),/above 0.5/);
});
