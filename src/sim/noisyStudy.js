/**
 * CA-Haven R3 / exploratory, deterministic noisy-signal decision task.
 * Ground truth is for the scorer only, never a controller input.
 * This is NOT a consciousness or Computational Awareness measurement.
 */
export const PROTOCOL = 'compaware.haven.noisy-decisions/0.1';
export const SCENARIOS = Object.freeze([
  {id:'clear',label:'Clear signal',accuracy:.90,flip:.06},
  {id:'noisy',label:'Noisy signal',accuracy:.65,flip:.06},
  {id:'changing',label:'Changing conditions',accuracy:.80,flip:.22},
]);
export const CONTROLLERS = Object.freeze([
  {id:'filter',label:'Temporal probability filter'},
  {id:'latest',label:'Latest-signal rule'},
  {id:'calibrated',label:'Calibrated single signal'},
  {id:'fallback',label:'Always-safe fallback'},
]);
export const COSTS = Object.freeze({healthyAction:3,faultyAction:-6,fallback:0,extraObservation:-1});
const PRIOR = .25;
const THRESHOLD = 1/3; // expected return for action crosses zero
const int = (v, a, b, name) => {
  if (!Number.isSafeInteger(v)||v<a||v>b) throw Error(name+' must be integer '+a+'..'+b);
};
function rng(seed) {
  let x=seed>>>0;
  return ()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296; };
}
function update(prior, signal, accuracy) {
  const f=signal?accuracy:1-accuracy, h=signal?1-accuracy:accuracy;
  return prior*f/(prior*f+(1-prior)*h);
}
const nextPrior=(belief,flip)=>belief*(1-flip)+(1-belief)*flip;
const metrics=(c)=>({id:c.id,label:c.label,count:0,totalUtility:0,continues:0,
  hazardousActions:0,unneededFallbacks:0,rechecks:0,brierSum:0});
const finish=(m)=>({...m,meanUtility:m.totalUtility/m.count,brier:m.brierSum/m.count});
function decide(id, signal, secondary, prior, scenario) {
  let probability=PRIOR,recheck=false;
  if(id==='filter') {
    probability=update(prior,signal,scenario.accuracy);
    if(probability>.20&&probability<.65) {
      recheck=true;
      probability=update(probability,secondary,scenario.accuracy);
    }
  } else if(id==='latest') {
    probability=Number(signal);
  } else if(id==='calibrated') {
    probability=update(PRIOR,signal,scenario.accuracy);
  }
  return {probability,recheck,
    action:id==='fallback'||probability>=THRESHOLD?'fallback':'continue'};
}
export function runNoisyStudy({seed=369,replicates=8,steps=32}={}) {
  int(seed,1,999999,'seed');int(replicates,1,35,'replicates');int(steps,8,60,'steps');
  const totals=CONTROLLERS.map(metrics),scenarios=[],trace=[];
  for(let i=0;i<SCENARIOS.length;i++) {
    const scenario=SCENARIOS[i],batch=CONTROLLERS.map(metrics);
    for(let rep=0;rep<replicates;rep++) {
      const draw=rng((Math.imul(seed,2246822519)+Math.imul(i+1,3266489917)+Math.imul(rep+1,668265263))>>>0);
      let fault=draw()<PRIOR,previous=PRIOR;
      for(let tick=0;tick<steps;tick++) {
        if(tick&&draw()<scenario.flip)fault=!fault;
        const first=draw()<scenario.accuracy?fault:!fault;
        const second=draw()<scenario.accuracy?fault:!fault;
        const prior=tick?nextPrior(previous,scenario.flip):PRIOR;
        const results={};
        for(let j=0;j<CONTROLLERS.length;j++) {
          const policy=CONTROLLERS[j],choice=decide(policy.id,first,second,prior,scenario);
          if(policy.id==='filter')previous=choice.probability;
          const reward=(choice.action==='continue'?(fault?COSTS.faultyAction:COSTS.healthyAction):0)+
            (choice.recheck?COSTS.extraObservation:0);
          for(const stat of [totals[j],batch[j]]) {
            stat.count++;stat.totalUtility+=reward;
            if(choice.action==='continue')stat.continues++;
            if(choice.action==='continue'&&fault)stat.hazardousActions++;
            if(choice.action==='fallback'&&!fault)stat.unneededFallbacks++;
            if(choice.recheck)stat.rechecks++;
            stat.brierSum+=(choice.probability-Number(fault))**2;
          }
          results[policy.id]={action:choice.action,rechecked:choice.recheck,
            estimatedFault:Number(choice.probability.toFixed(6)),reward};
        }
        trace.push({scenario:scenario.id,rep,tick,
          instrumentedTruth:fault,initialSignal:first,
          // Available only upon paid recheck, but recorded for audit.
          secondarySignal:second,
          results});
      }
    }
    scenarios.push({...scenario,metrics:batch.map(finish)});
  }
  return {
    protocol:PROTOCOL,status:'exploratory-simulation-not-preregistered',
    boundary:'Only simulated decision metrics. No awareness, consciousness, or subjective-experience conclusion.',
    settings:{seed,replicates,steps},costs:COSTS,
    assumptions:{initialFaultPrior:PRIOR,threshold:THRESHOLD,
      secondarySignalCost:COSTS.extraObservation},
    metrics:totals.map(finish),scenarios,trace,
  };
}
