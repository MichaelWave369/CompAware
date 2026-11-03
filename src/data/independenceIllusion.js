/**
 * CA-SC-04 · analytic THREE-witness observational-equivalence example.
 *
 * Unobserved truth is uniform binary. Each sensor's conditional error is
 * symmetric and the mechanism is stationary.
 *
 * WORLD A: Three independent sensors, accuracy p.
 * WORLD B: With probability q, a hidden common event flips ALL three
 * readings away from truth. Otherwise, three conditionally independent
 * sensors have individual accuracy r.
 *
 * Matching p gives the SAME full 8-outcome joint report distribution.
 * Without a trusted truth anchor, the three reports cannot distinguish
 * these two models, including with arbitrarily many report observations.
 *
 * Analytic model only: NOT physical telemetry, simulation observations,
 * an algorithm evaluating consciousness, or evidence of cosmic causation.
 */
export const DEFAULT_COMMON_RATE=0.20;
export const DEFAULT_BASE_ACCURACY=0.90;
export const REPORT_PATTERNS=Object.freeze(['000','001','010','011','100','101','110','111']);

function probability(name,x,min,max) {
  if(typeof x!=='number'||!Number.isFinite(x)||x<min||x>max) {
    throw new RangeError(name+' must be finite and in ['+min+', '+max+']');
  }
}

export function twoSensorAgreementWithCommonFailure(q,r) {
  probability('common failure rate',q,0,1);
  probability('base sensor accuracy',r,.5,1);
  return q+(1-q)*(r*r+(1-r)*(1-r));
}

export function matchedIndependentAccuracy(q,r) {
  const a=twoSensorAgreementWithCommonFailure(q,r);
  return (1+Math.sqrt(Math.max(0,2*a-1)))/2;
}

function reportProbability(pattern,world,accuracy,q) {
  let sum=0;
  for(const truth of ['0','1']) {
    const allOpposite=[...pattern].every(bit=>bit!==truth);
    let independent=1;
    for(const bit of pattern) independent*=bit===truth?accuracy:1-accuracy;
    sum+=.5*(world==='shared' ? (q*(allOpposite?1:0)+(1-q)*independent) : independent);
  }
  return sum;
}

/** The two distributions match in every cell, not just in pair agreement.
 * All probabilities are MODEL EXPECTATIONS, never sampled data.
 */
export function threeWitnessWorlds({commonFailureRate=DEFAULT_COMMON_RATE,
  baseAccuracy=DEFAULT_BASE_ACCURACY}={}) {
  const q=commonFailureRate,r=baseAccuracy;
  const agreement=twoSensorAgreementWithCommonFailure(q,r);
  const inferred=matchedIndependentAccuracy(q,r);
  const trueSharedAccuracy=(1-q)*r;
  const rows=REPORT_PATTERNS.map(pattern=>({
    pattern,
    independent:reportProbability(pattern,'independent',inferred,0),
    shared:reportProbability(pattern,'shared',r,q),
  }));
  return {
    commonFailureRate:q,baseAccuracy:r,
    pairwiseAgreement:agreement,
    matchedIndependentAccuracy:inferred,
    trueSharedSensorAccuracy:trueSharedAccuracy,
    overestimate:inferred-trueSharedAccuracy,
    rows,
    claim:'Same observed triple reports, different hidden source reliability under explicit model assumptions.',
    status:'analytical-probabilities-not-measurements',
  };
}
