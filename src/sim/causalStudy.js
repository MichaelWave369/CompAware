/**
 * CompAware Rung 6: causal provenance and fallible anchors.
 *
 * Deterministic exploratory simulator, not an awareness detector.
 * Every decision policy gets only reports, announced interventions and
 * purchased anchors. Hidden world and truth are scorer-only.
 */
import { threeWitnessWorlds, REPORT_PATTERNS } from '../data/independenceIllusion.js';

export const PROTOCOL = 'compaware.haven.causal-provenance/0.1';
export const WORLDS = Object.freeze([
  { id:'independent', label:'Independent witnesses' },
  { id:'common', label:'Hidden common-cause failures' },
]);
export const CONDITIONS = Object.freeze([
  {id:'passive',label:'Passive three-witness observation',anchor:'none',intervention:false,effective:false},
  {id:'trusted',label:'Independent trusted anchor',anchor:'trusted',intervention:false,effective:false},
  {id:'corrupt',label:'Corrupted calibration anchor',anchor:'corrupt',intervention:false,effective:false},
  {id:'copied',label:'Shared-source false anchor',anchor:'copied',intervention:false,effective:false},
  {id:'isolation',label:'Effective source isolation',anchor:'none',intervention:true,effective:true},
  {id:'placebo',label:'Placebo source isolation',anchor:'none',intervention:true,effective:false},
  {id:'combined',label:'Trusted anchor plus effective isolation',anchor:'trusted',intervention:true,effective:true},
]);
export const POLICIES = Object.freeze([
  {id:'abstain',label:'Honest abstention'},
  {id:'naive',label:'Assume independence'},
  {id:'window',label:'Simple agreement-window rule'},
  {id:'anchor',label:'Anchor-only evidence'},
  {id:'causal',label:'Intervention-only evidence'},
  {id:'combined',label:'Combined evidence'},
  {id:'guarded',label:'Require two corroborating channels'},
]);
export const RULES=Object.freeze({
  baseReliability:.9,
  commonFailureRate:.2,
  declaredAnchorReliability:.98,
  actualTrustedAnchorReliability:.98,
  actualCorruptedAnchorReliability:.60,
  anchorCopiedFromA:.97,
  anchorCost:2,
  correctDeclaration:5,
  falseDeclaration:-10,
  abstention:0,
  declareThreshold:.85,
  anchorEvery:4,
});
// Precompute the analytical matched reliability once per loaded module.
// Rebuilding eight probability rows for every likelihood call is unnecessary.
const MATCHED_INDEPENDENT_ACCURACY = threeWitnessWorlds().matchedIndependentAccuracy;
function int(name,v,min,max) {
  if(!Number.isSafeInteger(v)||v<min||v>max) throw Error(name+' must be an integer '+min+'..'+max);
}
function rng(seed) {
  let s=seed>>>0;
  return ()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);
}
function stream(seed,scenario,repeat,world,tag) {
  return rng((Math.imul(seed,2246822519)+Math.imul(scenario+1,3266489917)+
    Math.imul(repeat+1,668265263)+Math.imul(world+1,374761393)+
    Math.imul(tag+1,1274126177))>>>0);
}
function modelJoint(world, pattern, truth, afterIsolation) {
  const p=MATCHED_INDEPENDENT_ACCURACY;
  const r=RULES.baseReliability;
  const q=world==='common'?(afterIsolation?0:RULES.commonFailureRate):0;
  const accuracy=world==='independent'?p:r;
  let independent=1;
  for(const bit of pattern) independent*=Number(bit)===truth?accuracy:1-accuracy;
  const forcedWrong=[...pattern].every(bit=>Number(bit)!==truth);
  return .5*(q*Number(forcedWrong)+(1-q)*independent);
}
function patternProbability(world,pattern,afterIsolation) {
  return modelJoint(world,pattern,0,afterIsolation)+modelJoint(world,pattern,1,afterIsolation);
}
function samplePattern(draw,world,afterIsolation) {
  const n=draw();
  let sum=0;
  for(const pattern of REPORT_PATTERNS) {
    sum+=patternProbability(world,pattern,afterIsolation);
    if(n<sum+1e-12) return pattern;
  }
  return REPORT_PATTERNS.at(-1);
}
function truthPosterior(world,pattern,afterIsolation) {
  const yes=modelJoint(world,pattern,1,afterIsolation);
  return yes/patternProbability(world,pattern,afterIsolation);
}
function anchorProbability(world,pattern,anchor,afterIsolation) {
  const t0=modelJoint(world,pattern,0,afterIsolation);
  const t1=modelJoint(world,pattern,1,afterIsolation);
  const a=RULES.declaredAnchorReliability;
  return (anchor?(t1*a+t0*(1-a)):(t0*a+t1*(1-a)));
}
function evidenceRatio(pattern,anchor,afterIsolation,includeAnchor) {
  const i=includeAnchor?anchorProbability('independent',pattern,anchor,false):
    patternProbability('independent',pattern,false);
  const c=includeAnchor?anchorProbability('common',pattern,anchor,afterIsolation):
    patternProbability('common',pattern,afterIsolation);
  return Math.log(c/i);
}
function logistic(logOdds) {
  if(logOdds>=0) return 1/(1+Math.exp(-logOdds));
  const z=Math.exp(logOdds);
  return z/(1+z);
}
function verdict(probability) {
  if(probability>=RULES.declareThreshold) return 'common';
  if(probability<=1-RULES.declareThreshold) return 'independent';
  return 'unresolved';
}
function makeState() {
  return { anchorLog:0, causalLog:0, jointLog:0, purchases:0,
    pre:[], post:[], observed:0 };
}
function buyAnchor(policyId,offered) {
  return Boolean(offered && ['anchor','combined','guarded'].includes(policyId));
}
/**
 * No hidden truth, actual anchor accuracy, world ID or effective isolation
 * enters policy update. The "announced intervention" is an assumption only.
 */
function updateState(policyId,state,{pattern,interventionAnnounced,anchorOffered},paidAnchor) {
  state.observed++;
  const mixed=Number(![...pattern].every(bit=>bit===pattern[0]));
  (interventionAnnounced?state.post:state.pre).push(mixed);
  if(!['naive','abstain','window'].includes(policyId)) {
    const causal=evidenceRatio(pattern,null,interventionAnnounced,false);
    state.causalLog+=causal;
    if(paidAnchor!==null) {
      state.purchases++;
      const anchored=evidenceRatio(pattern,paidAnchor,false,true);
      state.anchorLog+=anchored;
    }
    const joint=evidenceRatio(pattern,paidAnchor,interventionAnnounced,paidAnchor!==null);
    state.jointLog+=joint;
  }
}
function summarizePolicy(policyId,state) {
  let probability=.5;
  if(policyId==='naive') probability=.01;
  else if(policyId==='anchor') probability=logistic(state.anchorLog);
  else if(policyId==='causal') probability=logistic(state.causalLog);
  else if(policyId==='combined') probability=logistic(state.jointLog);
  else if(policyId==='guarded') {
    const a=logistic(state.anchorLog),c=logistic(state.causalLog);
    if(state.purchases>0 && state.post.length>0 &&
      ((a>=.8 && c>=.8)||(a<=.2 && c<=.2))) {
      probability=logistic((state.anchorLog+state.causalLog)/2);
    }
  } else if(policyId==='window') {
    if(state.pre.length>=8 && state.post.length>=8) {
      const first=state.pre.reduce((a,b)=>a+b,0)/state.pre.length;
      const second=state.post.reduce((a,b)=>a+b,0)/state.post.length;
      probability=second-first>=.08?.9:.5;
    }
  }
  return { probability, verdict:verdict(probability), purchases:state.purchases };
}
function stats(policy) {
  return {id:policy.id,label:policy.label,total:0,correct:0,incorrect:0,
    abstained:0,overconfidentErrors:0,purchases:0,totalUtility:0,brierSum:0};
}
function finish(m) {
  return {...m,coverage:(m.correct+m.incorrect)/m.total,
    brier:m.brierSum/m.total,meanUtility:m.totalUtility/m.total};
}
function addMetric(m,world,p) {
  const correct=p.verdict===world;
  const wrong=p.verdict!=='unresolved'&&!correct;
  const abstained=p.verdict==='unresolved';
  const utility=(correct?RULES.correctDeclaration:wrong?RULES.falseDeclaration:RULES.abstention)-
    p.purchases*RULES.anchorCost;
  m.total++;m.correct+=Number(correct);m.incorrect+=Number(wrong);
  m.abstained+=Number(abstained);
  m.overconfidentErrors+=Number(wrong && (p.probability>=.95||p.probability<=.05));
  m.purchases+=p.purchases;m.totalUtility+=utility;
  m.brierSum+=(p.probability-Number(world==='common'))**2;
  return utility;
}
/** Initial environment world identity is scorer-only. */
export function runCausalStudy({seed=369,repetitions=4,steps=48}={}) {
  int('seed',seed,1,999999);
  int('repetitions',repetitions,1,12);
  int('steps',steps,16,64);
  const metrics=POLICIES.map(stats),scenarios=[],trace=[],trialSummaries=[];
  for(let scenarioIndex=0;scenarioIndex<CONDITIONS.length;scenarioIndex++) {
    const condition=CONDITIONS[scenarioIndex];
    const local=POLICIES.map(stats);
    for(let repeat=0;repeat<repetitions;repeat++) {
      for(let worldIndex=0;worldIndex<WORLDS.length;worldIndex++) {
        const world=WORLDS[worldIndex].id;
        // Report RNG is the same in paired worlds for identical conditions.
        // Truth and anchor RNG are independent scorer-only streams.
        const reportDraw=stream(seed,scenarioIndex,repeat,0,0);
        const truthDraw=stream(seed,scenarioIndex,repeat,worldIndex,1);
        const anchorDraw=stream(seed,scenarioIndex,repeat,worldIndex,2);
        const policies=Object.fromEntries(POLICIES.map(p=>[p.id,makeState()]));
        for(let tick=0;tick<steps;tick++) {
          const interventionAnnounced=condition.intervention && tick>=Math.floor(steps/2);
          const actualIsolation=interventionAnnounced && condition.effective && world==='common';
          const pattern=samplePattern(reportDraw,world,actualIsolation);
          const truth=Number(truthDraw()<truthPosterior(world,pattern,actualIsolation));
          const anchorOffered=condition.anchor!=='none' &&
            (tick%RULES.anchorEvery===RULES.anchorEvery-1);
          let anchorValue=null;
          if(anchorOffered) {
            if(condition.anchor==='copied') {
              const bit=Number(pattern[0]);
              anchorValue=Number(anchorDraw()<RULES.anchorCopiedFromA?bit:1-bit);
            } else {
              const accuracy=condition.anchor==='trusted'?
                RULES.actualTrustedAnchorReliability:RULES.actualCorruptedAnchorReliability;
              anchorValue=Number(anchorDraw()<accuracy?truth:1-truth);
            }
          }
          const sharedInput={pattern,interventionAnnounced,anchorOffered};
          const purchases={};
          for(const policy of POLICIES) {
            const purchased=buyAnchor(policy.id,anchorOffered);
            const paidAnchor=purchased?anchorValue:null;
            updateState(policy.id,policies[policy.id],sharedInput,paidAnchor);
            purchases[policy.id]={bought:purchased,seenAnchor:paidAnchor};
          }
          trace.push({condition:condition.id,worldForScorer:world,repetition:repeat,tick,
            reports:pattern,interventionAnnounced,
            anchorOffered,anchorValueForScorer:anchorValue,
            truthForScorer:truth,actualIsolationForScorer:actualIsolation,purchases});
        }
        const decisions={};
        for(let i=0;i<POLICIES.length;i++) {
          const policy=POLICIES[i],state=policies[policy.id];
          const result=summarizePolicy(policy.id,state);
          const utility=addMetric(local[i],world,result);
          addMetric(metrics[i],world,result);
          decisions[policy.id]={...result,probability:Number(result.probability.toFixed(6)),utility};
        }
        trialSummaries.push({condition:condition.id,worldForScorer:world,repetition:repeat,decisions});
      }
    }
    scenarios.push({...condition,metrics:local.map(finish)});
  }
  return {
    protocol:PROTOCOL,status:'exploratory-deterministic-simulator',
    boundary:'No validated awareness, consciousness, physical fault diagnosis or independent preregistration.',
    settings:{seed,repetitions,steps},
    modelAssumptions:{
      hiddenBalancedBinaryTruth:true,symmetricStationaryErrors:true,
      commonFailureRate:RULES.commonFailureRate,
      baseReliability:RULES.baseReliability,
      matchedIndependentAccuracy:MATCHED_INDEPENDENT_ACCURACY,
      interventionEffect:'In effective-isolation conditions only, common-world shared failure is eliminated after midpoint.',
      anchorTrust:'Policies assume 98% independent anchor even when the simulator corrupts or copies it.',
      criterion:'World declaration at posterior >=85% or <=15%; otherwise unresolved.',
      costs:RULES,
    },
    analytical:threeWitnessWorlds(),
    metrics:metrics.map(finish),scenarios,trialSummaries,trace,
  };
}

