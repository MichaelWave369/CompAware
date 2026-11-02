/**
 * CA-Haven R4: drifting-sensor calibration with shared, delayed verifications.
 *
 * RULES:
 * - Controllers receive binary signal(s), declared payoffs, and identical past
 *   verification receipts; never receive hidden truth or the true accuracy.
 * - All policies can buy the same pre-generated independent recheck, at cost.
 * - A public, scheduled "anchor" verification is delivered AFTER decisions.
 *   All policies pay its identical measurement cost, whether used or ignored.
 * - Policies are deterministic algorithms, not artificial consciousness.
 * - This is exploratory: seed partitioning is NOT independent preregistration.
 */
export const PROTOCOL = 'compaware.haven.calibration-drift/0.1';
export const CONDITIONS = Object.freeze([
  { id: 'stable', label: 'Stable calibration', startAccuracy: .90, endAccuracy: .90, flip: .08 },
  { id: 'drift', label: 'Hidden reliability loss', startAccuracy: .90, endAccuracy: .58, flip: .08 },
  { id: 'inversion', label: 'Misleading channel', startAccuracy: .90, endAccuracy: .30, flip: .08 },
  { id: 'noisy-stable', label: 'Low-signal control', startAccuracy: .62, endAccuracy: .62, flip: .08 },
]);
export const POLICIES = Object.freeze([
  { id: 'adaptive', label: 'Decay-weighted calibration' },
  { id: 'window', label: 'Recent-error window' },
  { id: 'fixed', label: 'Frozen reliability filter' },
  { id: 'signal', label: 'Latest-signal rule' },
  { id: 'fallback', label: 'Always-safe fallback' },
]);
export const COSTS = Object.freeze({
  continueHealthy: 3,
  continueFault: -6,
  fallback: 0,
  extraObservation: -1,
  verification: -2,
});
const PRIOR = .25, PREDICTED_FLIP = .08;
const FIXED_ACCURACY = .85;
const DECISION_THRESHOLD = COSTS.continueHealthy /
  (COSTS.continueHealthy - COSTS.continueFault);
const MAX_TRACE = 5 * (6 + 16) * 50;
function checkedInt(v, min, max, name) {
  if (!Number.isSafeInteger(v) || v < min || v > max) {
    throw new Error(name + ' must be integer ' + min + '..' + max);
  }
}
const bounded = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function random(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}
function posterior(prior, signalFault, accuracy) {
  const lf = signalFault ? accuracy : 1 - accuracy;
  const lh = signalFault ? 1 - accuracy : accuracy;
  const numerator = prior * lf;
  const denominator = numerator + (1 - prior) * lh;
  return denominator === 0 ? prior : numerator / denominator;
}
function propagated(previous) {
  return previous * (1 - PREDICTED_FLIP) + (1 - previous) * PREDICTED_FLIP;
}
function estimateAccuracy(policyId, audits) {
  if (policyId === 'fixed') return FIXED_ACCURACY;
  if (policyId === 'window') {
    const recent = audits.slice(-6);
    const successes = recent.filter(x => x.signal === x.verifiedFault).length;
    return bounded((successes + 1) / (recent.length + 2), .12, .98);
  }
  if (policyId === 'adaptive') {
    // Recency-weighted evidence with small prior to avoid extreme confidence.
    let yes = 4, no = 1, weight = 1;
    for (let i = audits.length - 1; i >= 0; i--) {
      if (audits[i].signal === audits[i].verifiedFault) yes += weight;
      else no += weight;
      weight *= .75;
      if (weight < .0001) break;
    }
    return bounded(yes / (yes + no), .12, .98);
  }
  return null;
}
const initializePolicy = () => ({ belief: PRIOR });
/** Pure policy, no truth in its input. */
function forecast(policyId, signal, optionalSecondSignal, state, verifiedHistory) {
  const accuracy = estimateAccuracy(policyId, verifiedHistory);
  if (policyId === 'fallback') {
    return { action: 'fallback', belief: PRIOR, accuracy, recheck: false };
  }
  if (policyId === 'signal') {
    return { action: signal ? 'fallback' : 'continue', belief: Number(signal), accuracy, recheck: false };
  }
  let belief = posterior(propagated(state.belief), signal, accuracy);
  const recheck = belief > .2 && belief < .65;
  if (recheck) belief = posterior(belief, optionalSecondSignal, accuracy);
  return {
    action: belief < DECISION_THRESHOLD ? 'continue' : 'fallback',
    belief, accuracy, recheck,
  };
}
function stats(id, label) {
  return { id, label, total: 0, utility: 0, risky: 0, needlessFallback: 0,
    continued: 0, rechecks: 0, audits: 0, squaredError: 0 };
}
function complete(m) {
  return { ...m, meanUtility: m.utility / m.total,
    brierError: m.squaredError / m.total };
}
function tally(m, forecastResult, fault, isAudit) {
  const { action, belief, recheck } = forecastResult;
  const payoff = (action === 'continue'
    ? fault ? COSTS.continueFault : COSTS.continueHealthy
    : COSTS.fallback) + (recheck ? COSTS.extraObservation : 0) +
    (isAudit ? COSTS.verification : 0);
  m.total++;
  m.utility += payoff;
  m.risky += Number(action === 'continue' && fault);
  m.needlessFallback += Number(action === 'fallback' && !fault);
  m.continued += Number(action === 'continue');
  m.rechecks += Number(recheck);
  m.audits += Number(isAudit);
  m.squaredError += (belief - Number(fault)) ** 2;
  return payoff;
}
const SCENARIO_INDEX = new Map(CONDITIONS.map((condition, index) => [condition.id, index]));

/**
 * Every row is logged AFTER all policies have acted, preserving auditability.
 * The only observable truth labels are the identical post-decision anchors.
 */
export function runCalibrationStudy({
  seed = 369, developmentTrials = 3, heldoutTrials = 8,
  steps = 32, verifyEvery = 4,
} = {}) {
  checkedInt(seed, 1, 999999, 'seed');
  checkedInt(developmentTrials, 1, 6, 'developmentTrials');
  checkedInt(heldoutTrials, 1, 16, 'heldoutTrials');
  checkedInt(steps, 12, 50, 'steps');
  checkedInt(verifyEvery, 2, 10, 'verifyEvery');
  const allMetrics = POLICIES.map(p => stats(p.id, p.label));
  const byCondition = [];
  const byPartition = [];
  const trace = [];

  for (const partition of [
    { id: 'development', count: developmentTrials, offset: 1337 },
    { id: 'heldout', count: heldoutTrials, offset: 77337 },
  ]) {
    const partMetrics = POLICIES.map(p => stats(p.id, p.label));
    for (const scenario of CONDITIONS) {
      const localMetrics = POLICIES.map(p => stats(p.id, p.label));
      for (let trial = 0; trial < partition.count; trial++) {
        const prng = random((Math.imul(seed, 2246822519) +
          Math.imul(SCENARIO_INDEX.get(scenario.id) + 1, 3266489917) +
          Math.imul(partition.offset + trial + 1, 668265263)) >>> 0);
        let fault = prng() < PRIOR;
        const policies = Object.fromEntries(POLICIES.map(p => [p.id, initializePolicy()]));
        const verifiedHistory = [];
        for (let tick = 0; tick < steps; tick++) {
          if (tick > 0 && prng() < scenario.flip) fault = !fault;
          const trueAccuracy = tick < Math.floor(steps / 2)
            ? scenario.startAccuracy : scenario.endAccuracy;
          const signal = prng() < trueAccuracy ? fault : !fault;
          const secondSignal = prng() < trueAccuracy ? fault : !fault;
          const auditNow = tick % verifyEvery === verifyEvery - 1;
          const decisions = {};
          for (let i = 0; i < POLICIES.length; i++) {
            const policy = POLICIES[i];
            const result = forecast(policy.id, signal, secondSignal, policies[policy.id], verifiedHistory);
            // The controller state is updated using its own prediction, not hidden truth.
            policies[policy.id].belief = result.belief;
            const utility = tally(localMetrics[i], result, fault, auditNow);
            tally(partMetrics[i], result, fault, auditNow);
            tally(allMetrics[i], result, fault, auditNow);
            decisions[policy.id] = {
              action: result.action, recheck: result.recheck,
              estimatedFault: Number(result.belief.toFixed(6)),
              estimatedReliability: result.accuracy === null ? null :
                Number(result.accuracy.toFixed(6)),
              utility,
            };
          }
          // A public verification is received only AFTER decisions are scored.
          if (auditNow) {
            verifiedHistory.push({ tick, signal, verifiedFault: fault });
          }
          trace.push({
            partition: partition.id, condition: scenario.id, trial, tick,
            initialSignal: signal,
            secondSignalForPaidRecheck: secondSignal,
            verificationDeliveredAfterDecision: auditNow ? { signal, verifiedFault: fault } : null,
            hiddenTruthForScoringOnly: fault,
            trueSensorAccuracyForScoringOnly: trueAccuracy,
            decisions,
          });
        }
      }
      byCondition.push({
        partition: partition.id, id: scenario.id, label: scenario.label,
        metrics: localMetrics.map(complete),
      });
    }
    byPartition.push({ id: partition.id, metrics: partMetrics.map(complete) });
  }
  if (trace.length > MAX_TRACE) throw new Error('protocol trace bound exceeded');
  return {
    protocol: PROTOCOL,
    status: 'exploratory-simulated-study',
    boundaries: 'No AI model inference or physical measurement. No consciousness or Computational Awareness verdict.',
    settings: { seed, developmentTrials, heldoutTrials, steps, verifyEvery },
    assumptions: { initialFaultPrior: PRIOR, assumedStateFlip: PREDICTED_FLIP,
      fixedReliability: FIXED_ACCURACY, decisionThreshold: DECISION_THRESHOLD,
      costs: COSTS, verificationTiming: 'after current-step decisions',
      seedPartitions: { development: '1337 offset', heldout: '77337 offset' },
      registration: 'exploratory: implementation and protocol created together' },
    metrics: allMetrics.map(complete),
    byPartition,
    byCondition,
    trace,
  };
}

