/**
 * CA-Haven Rung 5 / fallible witnesses and observational ambiguity.
 * Deterministic synthetic experiment; no real sensors, AI inference,
 * consciousness test or Computational Awareness certification.
 *
 * Controllers receive the public A reading and timestamp of offered B.
 * They decide whether to buy B BEFORE seeing its value. They receive only
 * bought reports. Ground truth and sensor parameters stay with the scorer.
 */
export const PROTOCOL = 'compaware.haven.fallible-witnesses/0.1';
export const REWARDS = Object.freeze({ healthyContinue: 3, faultyContinue: -6, fallback: 0, witnessCost: -1 });
export const REGIMES = Object.freeze([
  { id: 'ambiguous-equal', label: 'Two-witness world: 80% / 80%', kind: 'paired', a: .8, b: .8 },
  { id: 'ambiguous-unequal', label: 'Two-witness world: 95% / 70%', kind: 'paired', a: .95, b: .7 },
  { id: 'fallible-reference', label: 'Fallible reference', kind: 'independent', a: .85, b: .65 },
  { id: 'common-cause', label: 'Shared-error event', kind: 'common' },
  { id: 'timing-skew', label: 'Reference reports previous tick', kind: 'lag' },
]);
export const POLICIES = Object.freeze([
  { id: 'single', label: 'Primary signal only' },
  { id: 'fusion', label: 'Naive independent fusion' },
  { id: 'cautious', label: 'Require both healthy' },
  { id: 'timestamp', label: 'Timestamp-aware rule' },
  { id: 'window', label: 'Recent-disagreement gate' },
  { id: 'overconfident', label: 'Overconfident negative control' },
  { id: 'abstain', label: 'Always abstain / safe fallback' },
]);
function validate(name, x, min, max) {
  if (!Number.isSafeInteger(x) || x < min || x > max) throw Error(name + ' must be integer ' + min + '..' + max);
}
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}
function sampleReport(draw, truth, accuracy) {
  return draw() < accuracy ? truth : !truth;
}
function choosePair(draw) {
  const x = draw();
  if (x < .34) return [false, false];
  if (x < .50) return [false, true];
  if (x < .66) return [true, false];
  return [true, true];
}
function conditionalTruthProbability(aReading, bReading, aAccuracy, bAccuracy) {
  // Prior P(fault)=0.5, conditional independence and symmetric errors.
  const pf = (aReading ? aAccuracy : 1 - aAccuracy) * (bReading ? bAccuracy : 1 - bAccuracy);
  const ph = (aReading ? 1 - aAccuracy : aAccuracy) * (bReading ? 1 - bAccuracy : bAccuracy);
  return pf / (pf + ph);
}
function generate(draw, regime, tick, previousTruth) {
  if (regime.kind === 'paired') {
    // Both paired worlds use the SAME report-stream generator, but sample
    // different scorer-only hidden truths conditional on those reports.
    const [a, b] = choosePair(draw);
    const truth = draw() < conditionalTruthProbability(a, b, regime.a, regime.b);
    return { truth, a, b, bSourceTick: tick, commonEvent: false };
  }
  const truth = draw() < .5;
  if (regime.kind === 'independent') {
    return { truth, a: sampleReport(draw, truth, regime.a), b: sampleReport(draw, truth, regime.b),
      bSourceTick: tick, commonEvent: false };
  }
  if (regime.kind === 'common') {
    const commonEvent = draw() < .28;
    // A common cause flips BOTH channels together; mere agreement can mislead.
    const a = commonEvent ? !truth : sampleReport(draw, truth, .9);
    const b = commonEvent ? !truth : sampleReport(draw, truth, .9);
    return { truth, a, b, bSourceTick: tick, commonEvent };
  }
  if (regime.kind === 'lag') {
    const bTruth = tick === 0 ? draw() < .5 : previousTruth;
    return { truth, a: sampleReport(draw, truth, .85), b: sampleReport(draw, bTruth, .85),
      bSourceTick: tick - 1, commonEvent: false };
  }
  throw Error('unknown regime');
}
function newHistory() { return { pairs: [] }; }
function requestWitness(policyId, initialA, bSourceTick, tick) {
  switch (policyId) {
    case 'single': case 'abstain': return false;
    case 'timestamp': return bSourceTick === tick;
    case 'window': return !initialA; // request verification only if considering continuing
    default: return true;
  }
}
/**
 * Only a, paid b (or null), timestamp provenance, and prior purchased
 * observations enter the decision. No simulator truth or regime id.
 */
function decide(policyId, a, paidB, currentTick, bSourceTick, history) {
  const fresh = bSourceTick === currentTick;
  const hasB = paidB !== null;
  const primaryP = a ? .8 : .2;
  if (policyId === 'abstain') return { action:'fallback', pFault:.5 };
  if (policyId === 'single') return { action:a ? 'fallback' : 'continue', pFault:primaryP };
  if (policyId === 'timestamp' && !fresh) {
    return { action:a ? 'fallback' : 'continue', pFault:primaryP };
  }
  if (!hasB) {
    // Window policy has A=fault and does not buy an unnecessary B report.
    return { action:'fallback', pFault:primaryP };
  }
  const match = a === paidB;
  if (policyId === 'overconfident') {
    return { action:!a && !paidB ? 'continue' : 'fallback', pFault: a || paidB ? 1 : 0 };
  }
  if (policyId === 'fusion') {
    // Assumes two contemporaneous independent 80%-accurate sources.
    const f = (a ? .8 : .2) * (paidB ? .8 : .2);
    const h = (a ? .2 : .8) * (paidB ? .2 : .8);
    const pFault = f / (f + h);
    return { action:pFault < 1/3 ? 'continue' : 'fallback', pFault };
  }
  if (policyId === 'window') {
    const recent = history.pairs.slice(-8);
    const disagreements = recent.filter(p => p.a !== p.b).length;
    // Never label this 'measured reliability': disagreement alone cannot
    // identify accuracy. It is only a precautionary gate.
    const uncertain = recent.length >= 4 && disagreements / recent.length > .35;
    return { action: !a && !paidB && !uncertain ? 'continue' : 'fallback',
      pFault: !a && !paidB && !uncertain ? .1 : .5 };
  }
  if (policyId === 'cautious' || policyId === 'timestamp') {
    return { action: !a && !paidB ? 'continue' : 'fallback',
      pFault:match ? (a ? .9 : .1) : .5 };
  }
  throw Error('unknown policy');
}
function emptyStats(p) {
  return { id:p.id, label:p.label, count:0, utility:0, witnessPurchases:0,
    hazardousContinues:0, unnecessaryFallbacks:0, continues:0, overconfidentErrors:0,
    brierSum:0, staleReportsPurchased:0 };
}
function finish(s) {
  return { ...s, meanUtility:s.utility/s.count, brier:s.brierSum/s.count };
}
function tally(s, truth, decision, bought, stale, utility) {
  s.count++;
  s.utility += utility;
  s.witnessPurchases += Number(bought);
  s.staleReportsPurchased += Number(bought && stale);
  s.continues += Number(decision.action === 'continue');
  s.hazardousContinues += Number(decision.action === 'continue' && truth);
  s.unnecessaryFallbacks += Number(decision.action === 'fallback' && !truth);
  s.overconfidentErrors += Number((decision.pFault <= .05 && truth) ||
    (decision.pFault >= .95 && !truth));
  s.brierSum += (decision.pFault - Number(truth)) ** 2;
}
export function runWitnessStudy({ seed = 369, repetitions = 6, steps = 32 } = {}) {
  validate('seed', seed, 1, 999999);
  validate('repetitions', repetitions, 1, 20);
  validate('steps', steps, 8, 60);
  const metrics = POLICIES.map(emptyStats), scenarios = [], trace = [];
  for (const regime of REGIMES) {
    const local = POLICIES.map(emptyStats);
    let agreementCount = 0, actualCount = 0;
    for (let rep = 0; rep < repetitions; rep++) {
      // Deliberately identical seed in both paired regimes, ensuring their
      // observable A/B streams are exactly the same for matched trials.
      const streamIndex = regime.kind === 'paired' ? 0 : REGIMES.indexOf(regime);
      const draw = rng((Math.imul(seed,2246822519) +
        Math.imul(streamIndex+1,3266489917) + Math.imul(rep+1,668265263))>>>0);
      const histories = Object.fromEntries(POLICIES.map(p=>[p.id,newHistory()]));
      let previousTruth = false;
      for (let tick = 0; tick < steps; tick++) {
        const event = generate(draw, regime, tick, previousTruth);
        previousTruth = event.truth;
        agreementCount += Number(event.a === event.b);
        actualCount++;
        const decisions = {};
        for (let j = 0; j < POLICIES.length; j++) {
          const policy = POLICIES[j];
          const buyB = requestWitness(policy.id, event.a, event.bSourceTick, tick);
          const bVisible = buyB ? event.b : null;
          const decision = decide(policy.id, event.a, bVisible, tick,
            event.bSourceTick, histories[policy.id]);
          if (buyB) {
            histories[policy.id].pairs.push({ a:event.a, b:bVisible, sourceTick:event.bSourceTick });
            histories[policy.id].pairs = histories[policy.id].pairs.slice(-8);
          }
          const utility = (decision.action === 'continue' ?
            (event.truth ? REWARDS.faultyContinue : REWARDS.healthyContinue) : REWARDS.fallback) +
            (buyB ? REWARDS.witnessCost : 0);
          for (const s of [metrics[j],local[j]]) {
            tally(s,event.truth,decision,buyB,event.bSourceTick!==tick,utility);
          }
          decisions[policy.id] = { action:decision.action, purchasedB:buyB,
            sawB:bVisible, estimatedFault:Number(decision.pFault.toFixed(6)), utility };
        }
        trace.push({ scenario:regime.id, repetition:rep, tick, sensorA:event.a,
          referenceB:event.b, referenceSourceTick:event.bSourceTick,
          // These fields are for offline audit AFTER decisions only.
          hiddenTruthForScorer:event.truth, sharedCauseForScorer:event.commonEvent,
          sourceReliabilitiesForScorer:regime.kind==='paired' || regime.kind==='independent'
            ? { a:regime.a, b:regime.b } : null,
          decisions });
      }
    }
    scenarios.push({ id:regime.id,label:regime.label,kind:regime.kind,
      observedAgreement:agreementCount/actualCount, expectedAgreement:
        regime.kind==='paired' ? .68 : null,
      note:regime.kind==='paired'
        ? 'Paired worlds share identical observable reports for the same seed and repetition.'
        : regime.kind==='common' ? 'A hidden common cause can make both witnesses agree while wrong.'
        : regime.kind==='lag' ? 'The witness label is one tick old; provenance timestamps expose its age.'
        : 'Independent but imperfect primary and reference reports.',
      metrics:local.map(finish) });
  }
  return {
    protocol:PROTOCOL,status:'exploratory-deterministic-simulation',
    boundary:'No independent preregistration, physical signals, AI model, awareness or consciousness verdict.',
    settings:{ seed,repetitions,steps }, cost:REWARDS,
    pairedWorldCounterexample:{
      worlds:['ambiguous-equal','ambiguous-unequal'],
      expectedJointReportProbabilities:[.34,.16,.16,.34],
      observationallyIdenticalUnderModel:true,
    },
    metrics:metrics.map(finish), scenarios, trace,
  };
}

