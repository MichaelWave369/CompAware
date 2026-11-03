/**
 * CA-Haven Rung 7 · Intervention Specificity and Transportability.
 *
 * Deterministic *software* simulation. Not a consciousness experiment.
 * The controllers receive report triples and, only when purchased, a claimed
 * known-input probe bit. Ground truth, causal world, actual label integrity,
 * and whether the probe transport assumption holds remain scorer-only.
 */
import { REPORT_PATTERNS } from '../data/independenceIllusion.js';
import { interventionMirror } from '../data/interventionTransport.js';

export const PROTOCOL = 'compaware.haven.transportability/0.1';
export const REGIMES = Object.freeze([
  { id:'mirror', label:'Mirror · no anchors', mode:'mirror' },
  { id:'sham', label:'Sham intervention', mode:'sham' },
  { id:'probes', label:'Controlled-input probes', mode:'probes' },
  { id:'tampered', label:'Corrupted probe labels', mode:'tampered' },
  { id:'transport', label:'Probe-only calibration shift', mode:'transport' },
]);
export const POLICIES = Object.freeze([
  {id:'abstain',label:'No-identification abstention'},
  {id:'independence',label:'Naive independence assumption'},
  {id:'histogram',label:'Report-histogram heuristic'},
  {id:'simple',label:'Probe match-rate threshold'},
  {id:'likelihood',label:'Model-based probe likelihood'},
  {id:'guarded',label:'Two-method agreement gate'},
]);
export const SETTINGS = Object.freeze({
  correctReward:8,wrongReward:-12,unresolvedReward:0,
  probeCost:0.5,reportedLabelFlipRate:0.3,probeInterval:3,
  claimThreshold:0.8,
});
const MIRROR = interventionMirror();
const WORLD_MODEL = Object.freeze({
  independent:{
    pre:{p:MIRROR.before.independentReliability,q:0},
    post:{p:MIRROR.after.independentReliability,q:0},
  },
  common:{
    pre:{p:MIRROR.before.commonBaseAccuracy,q:MIRROR.before.commonFailureRate},
    post:{p:MIRROR.after.commonBaseAccuracy,q:MIRROR.after.commonFailureRate},
  },
});
const WORLDS = Object.freeze(['independent','common']);
const clamp = x=>Math.max(-60,Math.min(60,x));
const assertInt=(name,value,min,max)=>{
  if(!Number.isSafeInteger(value)||value<min||value>max)
    throw Error(name+' must be an integer '+min+'..'+max);
};
function rng(seed) {
  let s=seed>>>0;
  return ()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);
}
function stream(seed,regime,repeat,world,channel) {
  return rng((Math.imul(seed,2246822519)+Math.imul(regime+1,3266489917)+
    Math.imul(repeat+1,668265263)+Math.imul(world+1,374761393)+
    Math.imul(channel+1,1274126177))>>>0);
}
function phaseAt(tick,steps) {
  if(tick<steps/3)return 'pre';
  if(tick<2*steps/3)return 'post';
  return 'return';
}
function params(world,phase,regime,probe=false) {
  // A deliberately non-transportable test fixture: when a probe is injected,
  // both worlds temporarily use the same independent 90% measurement chain.
  if(probe&&regime==='transport')return {p:.9,q:0};
  return WORLD_MODEL[world][phase==='post'&&regime!=='sham'?'post':'pre'];
}
function conditionalProbability(pattern,bit,{p,q}) {
  let independent=1;
  for(const signal of pattern) independent*=Number(signal)===bit?p:1-p;
  const allWrong=[...pattern].every(signal=>Number(signal)!==bit);
  return q*Number(allWrong)+(1-q)*independent;
}
function marginalProbability(pattern,model) {
  return .5*(conditionalProbability(pattern,0,model)+
    conditionalProbability(pattern,1,model));
}
function drawPattern(draw,probabilityForPattern) {
  const u=draw();let cumulative=0;
  for(const pattern of REPORT_PATTERNS){
    cumulative+=probabilityForPattern(pattern);
    if(u<cumulative+1e-12)return pattern;
  }
  return REPORT_PATTERNS.at(-1);
}
function sampleNatural(draw,truthDraw,phase,regime,world) {
  const model=params(world,phase,regime);
  const pattern=drawPattern(draw,x=>marginalProbability(x,model));
  const likelihoodTrue=conditionalProbability(pattern,1,model);
  const total=likelihoodTrue+conditionalProbability(pattern,0,model);
  const truth=Number(truthDraw()<likelihoodTrue/total);
  return {pattern,truth};
}
function sampleProbe(draw,phase,regime,world,truth) {
  const model=params(world,phase,regime,true);
  return drawPattern(draw,x=>conditionalProbability(x,truth,model));
}
function state(){
  return { pre:[],post:[],return:[],probes:[],counts:0 };
}
function needsProbe(policyId,offered){
  return offered&&['simple','likelihood','guarded'].includes(policyId);
}
function observe(current,phase,pattern,probeLabel) {
  current[phase].push(pattern);
  if(probeLabel!==null)current.probes.push({phase,pattern,claimedInput:probeLabel});
  current.counts++;
}
function mixedRate(patterns){
  if(!patterns.length)return 0;
  return patterns.filter(p=>!([...p].every(x=>x===p[0]))).length/patterns.length;
}
function evaluate(current,policyId){
  const probes=current.probes;
  let logOdds=0,independentProbability=.5;
  // A reported input bit is regarded as genuine by the probe policies.
  // The simulated scorer can deliberately corrupt that assertion.
  for(const sample of probes){
    const phase=sample.phase==='post'?'post':'pre';
    const x=conditionalProbability(sample.pattern,sample.claimedInput,
      WORLD_MODEL.common[phase]);
    const y=conditionalProbability(sample.pattern,sample.claimedInput,
      WORLD_MODEL.independent[phase]);
    logOdds+=Math.log(x/y);
  }
  independentProbability=1/(1+Math.exp(clamp(logOdds)));
  const commonProbability=1-independentProbability;
  const likelihoodVerdict=commonProbability>=SETTINGS.claimThreshold?'common':
    commonProbability<=1-SETTINGS.claimThreshold?'independent':'unresolved';

  const observedMixed={
    pre:mixedRate(current.pre),
    post:mixedRate(current.post),
    return:mixedRate(current.return),
  };
  // Pre/post change is *not* identifying in the mirror construction. This
  // heuristic is intentionally overconfident as a negative control.
  const histogramVerdict=current.pre.length&&current.post.length&&
    observedMixed.post>observedMixed.pre+.025?'common':'independent';

  const referenceMatches=probes.reduce((sum,s)=>
    sum+[...s.pattern].filter(b=>Number(b)===s.claimedInput).length,0);
  const referenceReports=probes.length*3;
  const rate=referenceReports?referenceMatches/referenceReports:null;
  const modelAccuracyIndependent=probes.length?
    probes.reduce((sum,s)=>sum+WORLD_MODEL.independent[s.phase==='post'?'post':'pre'].p,0)/probes.length:null;
  const modelAccuracyCommon=probes.length?
    probes.reduce((sum,s)=>{
      const m=WORLD_MODEL.common[s.phase==='post'?'post':'pre'];
      return sum+(1-m.q)*m.p;
    },0)/probes.length:null;
  const midpoint=rate===null?null:(modelAccuracyIndependent+modelAccuracyCommon)/2;
  const simpleVerdict=rate===null?'unresolved':
    rate>=midpoint?'independent':'common';

  let verdict='unresolved',probability=.5;
  if(policyId==='independence'){verdict='independent';probability=.01;}
  else if(policyId==='histogram'){verdict=histogramVerdict;probability=histogramVerdict==='common'?.9:.1;}
  else if(policyId==='simple'){
    verdict=simpleVerdict;probability=simpleVerdict==='common'?.8:simpleVerdict==='independent'?.2:.5;
  } else if(policyId==='likelihood'){
    verdict=likelihoodVerdict;probability=commonProbability;
  } else if(policyId==='guarded'){
    // Strong likelihood AND independently simpler accuracy comparison must
    // agree. This reduces coverage; it does not guarantee truth.
    verdict=likelihoodVerdict!=='unresolved'&&
      likelihoodVerdict===simpleVerdict?likelihoodVerdict:'unresolved';
    probability=verdict==='unresolved'?.5:commonProbability;
  }
  const purchases=probes.length;
  return {verdict,probability,purchases,matchingRate:rate,
    mixedRates:observedMixed};
}
function newMetric(policy){
  return {id:policy.id,label:policy.label,total:0,correct:0,wrong:0,
    unresolved:0,confidentWrong:0,purchases:0,utility:0,brierSum:0};
}
function done(m){
  return {...m,meanUtility:m.utility/m.total,coverage:(m.correct+m.wrong)/m.total,
    brier:m.brierSum/m.total};
}
function addMetric(m,report,world){
  const correct=report.verdict===world,wrong=report.verdict!=='unresolved'&&!correct;
  m.total++;m.correct+=Number(correct);m.wrong+=Number(wrong);
  m.unresolved+=Number(report.verdict==='unresolved');
  m.confidentWrong+=Number(wrong&&(report.probability<=.05||report.probability>=.95));
  m.purchases+=report.purchases;
  const utility=(correct?SETTINGS.correctReward:wrong?SETTINGS.wrongReward:
    SETTINGS.unresolvedReward)-SETTINGS.probeCost*report.purchases;
  m.utility+=utility;m.brierSum+=(report.probability-Number(world==='common'))**2;
  return utility;
}
/**
 * A matched pair of hidden worlds is sampled per regime and repeat. Passive,
 * sham, and all natural non-probe ticks retain identical observable triples.
 * Controlled probes can distinguish worlds only if the probe measurements
 * actually sample the ambient causal mechanism and their labels are reliable.
 */
export function runTransportStudy({seed=369,repetitions=4,steps=36}={}){
  assertInt('seed',seed,1,999999);
  assertInt('repetitions',repetitions,1,12);
  assertInt('steps',steps,18,72);
  if(steps%6!==0)throw Error('steps must be divisible by 6');
  const totals=POLICIES.map(newMetric),scenarios=[],trace=[],trials=[];
  for(let ri=0;ri<REGIMES.length;ri++){
    const regime=REGIMES[ri],local=POLICIES.map(newMetric);
    for(let repeat=0;repeat<repetitions;repeat++){
      for(let wi=0;wi<WORLDS.length;wi++){
        const world=WORLDS[wi],naturalDraw=stream(seed,ri,repeat,0,0),
          truthDraw=stream(seed,ri,repeat,wi,1),
          probeDraw=stream(seed,ri,repeat,wi,2),
          badLabelDraw=stream(seed,ri,repeat,wi,3);
        const controllers=Object.fromEntries(POLICIES.map(p=>[p.id,state()]));
        for(let tick=0;tick<steps;tick++){
          const phase=phaseAt(tick,steps);
          const announced=tick>=steps/3 && tick<2*steps/3;
          const probeOffered=!['mirror','sham'].includes(regime.mode)&&
            tick%SETTINGS.probeInterval===SETTINGS.probeInterval-1;
          const controlledTruth=(tick+repeat)%2;
          let pattern,truth;
          if(probeOffered){
            truth=controlledTruth;
            pattern=sampleProbe(probeDraw,phase,regime.mode,world,truth);
          } else {
            ({pattern,truth}=sampleNatural(naturalDraw,truthDraw,phase,regime.mode,world));
          }
          // The input *certificate* can be wrong. A controller sees only the
          // purchased certificate, never the scorer's controlled input bit.
          const claimedInput=probeOffered?
            (regime.mode==='tampered'&&badLabelDraw()<SETTINGS.reportedLabelFlipRate
              ? 1-controlledTruth:controlledTruth):null;
          const observations={};
          for(const policy of POLICIES){
            const bought=needsProbe(policy.id,probeOffered);
            const visibleLabel=bought?claimedInput:null;
            observe(controllers[policy.id],phase,pattern,visibleLabel);
            observations[policy.id]={bought,labelSeen:visibleLabel};
          }
          trace.push({condition:regime.id,worldForScorer:world,repetition:repeat,
            tick,phase,interventionAnnounced:announced,probeOffered,
            reports:pattern,knownInputForScorer:probeOffered?controlledTruth:null,
            claimedLabelForScorer:claimedInput,truthForScorer:truth,observations});
        }
        const decisions={};
        for(let i=0;i<POLICIES.length;i++){
          const p=POLICIES[i],result=evaluate(controllers[p.id],p.id);
          const utility=addMetric(local[i],result,world);
          addMetric(totals[i],result,world);
          decisions[p.id]={...result,probability:Number(result.probability.toFixed(6)),utility};
        }
        trials.push({condition:regime.id,worldForScorer:world,repetition:repeat,decisions});
      }
    }
    scenarios.push({...regime,metrics:local.map(done)});
  }
  return {
    protocol:PROTOCOL,status:'exploratory-deterministic-simulation',
    boundary:'Not hardware measurement, independent preregistration, or a test of Computational Awareness or consciousness.',
    settings:{seed,repetitions,steps},
    assumptions:{...SETTINGS,
      model:'balanced binary hidden truth; symmetric exchangeable sensors, independent except modeled common failure',
      probeIntegrity:'Trusted except in tampered regime; transport regime uses a different probe-specific measurement mechanism',
      pre:MIRROR.before,post:MIRROR.after,
      returnPhase:'assumed restoration of pre-intervention model; not a physically proven transport guarantee',
    },
    analytical:MIRROR.rows,
    metrics:totals.map(done),scenarios,trials,trace,
  };
}

