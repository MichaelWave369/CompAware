/**
 * CA-Haven R8 · Source Lineage & Probe-Mode Hysteresis.
 * Deterministic synthetic inputs. Never a physical independence certificate.
 * A controller sees only claimed digital input, sensor readings, declared graph,
 * mode/timing, and sequence tags. Hidden generator faults stay scorer-only.
 */
import { provenanceScenarios, auditProvenance } from '../data/provenancePassport.js';

export const PROTOCOL = 'compaware.haven.source-lineage-hysteresis/0.1';
export const REGIMES = Object.freeze([
  {id:'separate',label:'Declared separate / healthy control',graph:'documented-separate',risk:false},
  {id:'shared-clock',label:'Shared clock and power',graph:'power-clock',risk:true},
  {id:'copied-feed',label:'Copied reference with distinct receipt IDs',graph:'copy-path',risk:true},
  {id:'hidden-coupling',label:'Undocumented common cause',graph:'documented-separate',risk:true},
  {id:'unknown-lineage',label:'Unknown reference lineage',graph:'unknown-path',risk:true},
  {id:'mode-hysteresis',label:'Probe-mode hysteresis',graph:'probe-mode',risk:true},
  {id:'sham-switch',label:'Sham switch / separate control',graph:'documented-separate',risk:false},
]);
export const POLICIES = Object.freeze([
  {id:'abstain',label:'Honest unresolved'},
  {id:'naive',label:'Assume independence'},
  {id:'graph',label:'Declared-graph rule'},
  {id:'checksum',label:'Simple match/error detector'},
  {id:'history',label:'Mode-history detector'},
  {id:'guarded',label:'Provenance + evidence gate'},
]);
export const PAYOFF = Object.freeze({correctFlag:5,falseFlag:-2,correctProvisional:3,falseProvisional:-10,unresolved:0});
const graphById=new Map(provenanceScenarios.map(x=>[x.id,x]));
function checked(name,n,lo,hi){
  if(!Number.isSafeInteger(n)||n<lo||n>hi)throw Error(name+' must be integer '+lo+'..'+hi);
}
function rng(seed) {
  let x=seed>>>0;
  return ()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/4294967296);
}
function stream(seed,scenario,trial,channel){
  return rng((Math.imul(seed,2246822519)+Math.imul(scenario+1,3266489917)+
    Math.imul(trial+1,668265263)+Math.imul(channel+1,374761393))>>>0);
}
function phaseOf(tick,steps){
  const q=steps/4;
  if(tick<q)return 'normal';
  if(tick<2*q)return 'probe';
  if(tick<3*q)return 'return';
  return 'washout';
}
function generate(regime,repeat,steps,seed,scenarioIndex){
  const inputDraw=stream(seed,scenarioIndex,repeat,0);
  const aDraw=stream(seed,scenarioIndex,repeat,1);
  const bDraw=stream(seed,scenarioIndex,repeat,2);
  const samples=[],q=steps/4;
  let priorPhase=null,lastSwitch=0;
  for(let tick=0;tick<steps;tick++){
    const phase=phaseOf(tick,steps);
    if(phase!==priorPhase){lastSwitch=tick;priorPhase=phase;}
    const injected=Number(inputDraw()<.5);
    const ordinaryA=Number(aDraw()<.04);
    const ordinaryB=Number(bDraw()<.025);
    let reportA=injected^ordinaryA;
    let reference=injected^ordinaryB;
    let scorerCause='ordinary-independent-noise';
    // Controlled software faults, not voltages or actual clock disruptions.
    const common=regime.id==='shared-clock'||regime.id==='hidden-coupling'||
      regime.id==='unknown-lineage';
    const cycle=regime.id==='hidden-coupling'?6:regime.id==='unknown-lineage'?8:7;
    if(common&&tick%cycle===2){
      reportA=1-injected;reference=1-injected;
      scorerCause='injected-common-mode';
    }
    if(regime.id==='copied-feed'){
      // Include an explicit non-destructive tagged error so the copy control
      // remains testable even with a short seeded observation window.
      if(tick%13===4) reportA=1-injected;
      reference=reportA;
      scorerCause='reference-copies-primary';
    }
    if(regime.id==='mode-hysteresis'){
      if(phase==='probe'){
        reportA=injected; // Test mode resets the simulated readout
        scorerCause='probe-path-temporary-recalibration';
      }else if(phase==='return'&&tick-2*q<q/2){
        reportA=1-injected; // Residual state after switching back
        scorerCause='post-probe-residual-error';
      }
    }
    const observation={
      tick,phase,elapsedSinceModeSwitch:tick-lastSwitch,
      claimedStimulus:injected,reportA,reference,
      primarySequence:tick,referenceSequence:tick,
      primaryReceiptId:'A/'+tick,referenceReceiptId:'R/'+tick,
    };
    samples.push({observation,scorer:{injectedTruth:injected,cause:scorerCause,
      sharedMechanism:regime.risk}});
  }
  return samples;
}
const fraction=(xs,predicate)=>xs.length?xs.filter(predicate).length/xs.length:0;
/** Explicitly limited to authorized observations and authored graph. */
function infer(policy,observations,declaredGraph){
  const state=declaredGraph.state;
  const primaryError=s=>s.reportA!==s.claimedStimulus;
  const refError=s=>s.reference!==s.claimedStimulus;
  const jointlyWrong=observations.filter(s=>primaryError(s)&&refError(s)).length;
  const copied=observations.every(s=>s.reportA===s.reference)&&
    observations.some(primaryError);
  const pre=observations.filter(x=>x.phase==='normal');
  const returned=observations.filter(x=>x.phase==='return');
  const washed=observations.filter(x=>x.phase==='washout');
  const before=fraction(pre,primaryError);
  const after=fraction(returned,primaryError);
  const wash=fraction(washed,primaryError);
  const persistentReturn=after>before+.18&&after>wash+.10;
  const directSignal=copied||jointlyWrong>=2;
  let decision='unresolved',basis='insufficient-evidence';
  if(policy==='naive'){
    decision='provisional-separation';basis='unsupported-assumption';
  } else if(policy==='graph'){
    if(state==='DOCUMENTED_OVERLAP'){decision='flag-risk';basis='declared-overlap';}
    else if(state==='NO_DOCUMENTED_OVERLAP'){
      decision='provisional-separation';basis='no-documented-overlap-only';
    }
  } else if(policy==='checksum'){
    decision=directSignal?'flag-risk':'provisional-separation';
    basis=directSignal?'paired-error-or-copy-signal':'no-anomaly-detected';
  } else if(policy==='history'){
    if(persistentReturn||directSignal){
      decision='flag-risk';basis=persistentReturn?'return-mode-hysteresis':'paired-error-or-copy-signal';
    }
  } else if(policy==='guarded'){
    if(state==='DOCUMENTED_OVERLAP'){
      decision='flag-risk';basis='declared-overlap';
    } else if(directSignal||persistentReturn){
      decision='flag-risk';basis=persistentReturn?'post-switch-error-history':'shared-error-evidence';
    } else {
      basis=state==='INCOMPLETE_PROVENANCE'?'unknown-upstream-lineage':'no-causal-independence-demonstrated';
    }
  }
  return {decision,basis,graphState:state,graphVerifiedIndependent:declaredGraph.verifiedIndependent,
    features:{jointlyWrong,copied,persistentReturn,
      primaryErrorNormal:before,primaryErrorReturn:after,primaryErrorWashout:wash}};
}
function score(policy){
  return {id:policy.id,label:policy.label,total:0,correct:0,falseAssurances:0,
    falseFlags:0,unresolved:0,utility:0};
}
function accumulate(stat,inference,risk){
  const d=inference.decision;
  const utility=d==='flag-risk'?(risk?PAYOFF.correctFlag:PAYOFF.falseFlag):
    d==='provisional-separation'?(risk?PAYOFF.falseProvisional:PAYOFF.correctProvisional):
    PAYOFF.unresolved;
  stat.total++;stat.utility+=utility;
  stat.correct+=Number((d==='flag-risk'&&risk)||(d==='provisional-separation'&&!risk));
  stat.falseAssurances+=Number(d==='provisional-separation'&&risk);
  stat.falseFlags+=Number(d==='flag-risk'&&!risk);
  stat.unresolved+=Number(d==='unresolved');
  return utility;
}
const finalize=s=>({...s,meanUtility:s.utility/s.total});
export function runLineageStudy({seed=369,repetitions=4,steps=40}={}){
  checked('seed',seed,1,999999);checked('repetitions',repetitions,1,12);
  checked('steps',steps,20,80);
  if(steps%4)throw Error('steps must be divisible by 4');
  const metrics=POLICIES.map(score),scenarios=[],trialReceipts=[];
  for(let i=0;i<REGIMES.length;i++){
    const regime=REGIMES[i];
    const graph=auditProvenance(graphById.get(regime.graph));
    const local=POLICIES.map(score);
    for(let repeat=0;repeat<repetitions;repeat++){
      const generated=generate(regime,repeat,steps,seed,i);
      const observations=generated.map(s=>s.observation);
      const judgments={};
      for(let j=0;j<POLICIES.length;j++){
        const p=POLICIES[j],inference=infer(p.id,observations,graph);
        const utility=accumulate(local[j],inference,regime.risk);
        accumulate(metrics[j],inference,regime.risk);
        judgments[p.id]={...inference,utility};
      }
      trialReceipts.push({
        regime:regime.id,repeat,
        declaredGraph:{state:graph.state,shared:graph.shared,unknown:graph.unknown,
          verifiedIndependent:graph.verifiedIndependent},
        hiddenRiskForScorer:regime.risk,
        observations,
        scorerOnly:generated.map(x=>x.scorer),
        judgments,
      });
    }
    scenarios.push({id:regime.id,label:regime.label,
      declaredGraphState:graph.state,
      hiddenRiskForScorer:regime.risk,
      metrics:local.map(finalize)});
  }
  return {
    protocol:PROTOCOL,status:'deterministic-exploratory-synthetic-test',
    boundary:'Graph is declared, not physically verified; no real sensor independence, awareness or consciousness conclusion.',
    settings:{seed,repetitions,steps},
    assumptions:{syntheticKnownInput:true,physicalIndependenceVerified:false,
      phaseOrder:['normal','probe','return','washout'],policyPayoffs:PAYOFF,
      label:'Ground-truth stimulus is a privileged simulator fixture; no real independent measurement was performed.'},
    metrics:metrics.map(finalize),scenarios,trialReceipts,
  };
}

