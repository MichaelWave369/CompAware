/**
 * CA-SC-03: analytical counterexample to identifying individual sensor
 * reliabilities from two channels without ground-truth labels.
 *
 * ASSUMPTIONS (required): a balanced hidden binary truth; both sensors have
 * symmetric error rates; errors are conditionally independent given truth;
 * parameters do not vary over time. This is an idealized thought experiment,
 * not evidence about real sensors or computational awareness.
 */
export const WITNESS_MODEL = Object.freeze({
  targetAgreement: 0.68,
  reference: Object.freeze({ a: 0.8, b: 0.8 }),
  exampleAlternative: Object.freeze({ a: 0.95, b: 0.7 }),
  assumptions: Object.freeze([
    'Hidden binary truth is equally likely to be true or false.',
    'Each sensor has the same error probability for either truth value.',
    'Sensor errors are independent conditional on the hidden truth.',
    'Reliabilities are constant over the comparison interval.',
  ]),
});

export function agreement(a,b) {
  if (![a,b].every(x=>typeof x==='number' && Number.isFinite(x) && x>=0 && x<=1)) {
    throw new RangeError('Sensor reliabilities must be numbers in [0, 1]');
  }
  return a*b+(1-a)*(1-b);
}

/** Calculate B reliability that yields a specified observed agreement with A.
 * Valid only when A is not 0.5, where all B values produce 0.5 agreement.
 */
export function matchingReliability(a,targetAgreement=WITNESS_MODEL.targetAgreement) {
  if (typeof a!=='number' || !Number.isFinite(a) || a<0 || a>1 ||
      typeof targetAgreement!=='number' || !Number.isFinite(targetAgreement) ||
      targetAgreement<0 || targetAgreement>1) {
    throw new RangeError('Reliability and agreement must be in [0, 1]');
  }
  if (Math.abs(2*a-1)<1e-12) return null;
  const b=(targetAgreement-(1-a))/(2*a-1);
  return b>=-1e-10 && b<=1+1e-10 ? Math.max(0,Math.min(1,b)) : null;
}

/** Under balanced truth, conditional independence and symmetric errors.
 * All four report-pair probabilities depend ONLY on observed agreement.
 */
export function observablePairs(a,b) {
  const same=agreement(a,b);
  return Object.freeze([
    { id:'00', label:'Both report healthy', probability:same/2 },
    { id:'01', label:'A healthy, B fault', probability:(1-same)/2 },
    { id:'10', label:'A fault, B healthy', probability:(1-same)/2 },
    { id:'11', label:'Both report fault', probability:same/2 },
  ]);
}

/** Optional illustration only: with three stationary conditionally
 * independent symmetric >50%-accurate sources, pairwise agreements can
 * identify all three reliabilities, assuming the positive orientation.
 * Without those assumptions, identifiability is not guaranteed.
 */
export function inferThreeIndependentReliabilities(a12,a13,a23) {
  for(const v of [a12,a13,a23]) {
    if(typeof v!=='number'||!Number.isFinite(v)||v<=0.5||v>1) {
      throw new RangeError('Pairwise agreement must be above 0.5 and at most 1');
    }
  }
  const x12=2*a12-1,x13=2*a13-1,x23=2*a23-1;
  const strengths=[
    Math.sqrt(x12*x13/x23),
    Math.sqrt(x12*x23/x13),
    Math.sqrt(x13*x23/x12),
  ];
  if(strengths.some(x=>x>1+1e-10 || !Number.isFinite(x))) {
    throw new RangeError('Agreements incompatible with this three-witness model');
  }
  return strengths.map(s=>(1+Math.min(1,s))/2);
}
