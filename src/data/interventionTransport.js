/**
 * CA-SC-05 / The Intervention Mirror.
 *
 * Two distinct hidden source models can have identical complete three-report
 * distributions both BEFORE and AFTER a declared intervention, even when the
 * intervention changes those distributions.
 *
 * This is a mathematical thought experiment, NOT measured data or an
 * intervention run. It reuses CA-SC-04's balanced binary truth, symmetric
 * errors, stationary-within-regime, exchangeable three-source models.
 */
import { threeWitnessWorlds, REPORT_PATTERNS } from './independenceIllusion.js';

export const INTERVENTION_MODEL = Object.freeze({
  before: Object.freeze({ commonFailureRate: 0.20, baseAccuracy: 0.90 }),
  afterCommonFailureRate: 0.10,
  defaultAfterIndependentAccuracy: 0.90,
  claimsBoundary: 'Analytical probabilities only. No causal identification, real instruments, or awareness verdict.',
});

/**
 * For a given independent-model accuracy p, construct a model with a
 * common all-wrong event rate q and independent per-sensor accuracy r
 * outside the event, whose full three-report law matches the independent
 * model (under the assumptions documented in CA-SC-04).
 *
 * No solutions outside [0.5,1] are accepted.
 */
export function matchedCommonBaseAccuracy(p,q) {
  if(typeof p!=='number'||!Number.isFinite(p)||p<.5||p>1)
    throw new RangeError('independent accuracy must be finite in [0.5, 1]');
  if(typeof q!=='number'||!Number.isFinite(q)||q<0||q>=1)
    throw new RangeError('common failure rate must be finite in [0, 1)');
  const independentPairAgreement=p*p+(1-p)*(1-p);
  const requiredOrdinaryAgreement=(independentPairAgreement-q)/(1-q);
  const radicand=2*requiredOrdinaryAgreement-1;
  if(radicand< -1e-12||radicand>1+1e-12)
    return null;
  return (1+Math.sqrt(Math.min(1,Math.max(0,radicand))))/2;
}

export function interventionMirror({afterIndependentAccuracy=INTERVENTION_MODEL.defaultAfterIndependentAccuracy}={}) {
  const q=INTERVENTION_MODEL.afterCommonFailureRate;
  const afterBase=matchedCommonBaseAccuracy(afterIndependentAccuracy,q);
  if(afterBase===null) throw new RangeError('post-intervention model cannot be matched at this accuracy');

  const before=threeWitnessWorlds(INTERVENTION_MODEL.before);
  const after=threeWitnessWorlds({commonFailureRate:q,baseAccuracy:afterBase});
  const rows=REPORT_PATTERNS.map((pattern,i)=>({
    pattern,
    beforeIndependent:before.rows[i].independent,
    beforeCommon:before.rows[i].shared,
    afterIndependent:after.rows[i].independent,
    afterCommon:after.rows[i].shared,
  }));
  return {
    status:'analytical-probabilities-not-measurements',
    boundary:INTERVENTION_MODEL.claimsBoundary,
    before:{
      independentReliability:before.matchedIndependentAccuracy,
      commonFailureRate:before.commonFailureRate,
      commonBaseAccuracy:before.baseAccuracy,
      commonActualReliability:before.trueSharedSensorAccuracy,
      reportPairAgreement:before.pairwiseAgreement,
    },
    after:{
      independentReliability:afterIndependentAccuracy,
      commonFailureRate:q,
      commonBaseAccuracy:afterBase,
      commonActualReliability:(1-q)*afterBase,
      reportPairAgreement:after.pairwiseAgreement,
    },
    rows,
    interventionVisible:true,
    causalStoryIndependent:'Declared intervention also changes otherwise-independent channel reliability.',
    causalStoryCommon:'Declared intervention reduces common events but changes non-event sensor accuracy as a side effect.',
    necessaryExtraEvidence:'Justified trusted-state measurements or independently validated intervention mechanism and transport assumptions.',
  };
}
