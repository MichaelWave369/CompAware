/**
 * CA-SC-02: short, testable inquiry prompts.
 * An observation contract, NOT a running experiment or a claim of awareness.
 */
export const horizonStages = Object.freeze([
  { id: 'truth', label: 'World / truth', access: 'SCORER ONLY',
    note: 'The hidden environment and interventions belong to the independent scorer. A controller cannot read them as if they were observations.' },
  { id: 'signal', label: 'Signal', access: 'SENSOR CHANNEL',
    note: 'Reports can be noisy, delayed, correlated, miscalibrated or missing. A reading is evidence about a condition, not the condition itself.' },
  { id: 'model', label: 'Model', access: 'INFERENCE',
    note: 'Estimates depend on stated assumptions, past reports and provenance. A confident statement is not a validated measurement.' },
  { id: 'action', label: 'Action', access: 'BOUNDED POLICY',
    note: 'Continue, reobserve or fall back using only permitted observations, explicit costs and a documented policy.' },
  { id: 'outcome', label: 'Outcome', access: 'INDEPENDENT SCORE',
    note: 'Judge task success, constraint violations, cost and calibration separately, with held-out tests and simple controls.' },
  { id: 'interpretation', label: 'Interpretation', access: 'HUMAN REVIEW',
    note: 'A functional result is not a conclusion about sentience, subjective experience, souls or cosmic intelligence.' },
]);

export const horizonChallenges = Object.freeze([
  {id:'calibration', title:'Unknown calibration', source:'CA-Haven Rung 3', status:'PROPOSED',
    hidden:'The observation channel becomes less reliable without announcing the new probability.',
    visible:'Noisy reports and any explicitly paid verification reports.',
    question:'Can the controller recognize uncertainty about its own sensor instead of assuming the simulator parameters?',
    baseline:'Compare against a recent-error tracker and a frozen fixed-calibration controller.'},
  {id:'conflict', title:'Conflicting signals', source:'CA-SC-02 proposal', status:'PROPOSED',
    hidden:'Two indicators disagree due to drift or a shared fault.',
    visible:'Two reports with source provenance, not hidden fault truth.',
    question:'Can the controller distinguish contradictory evidence from independent confirmation?',
    baseline:'Compare against a simple conservative fallback and majority vote.'},
  {id:'continuity', title:'Interrupted history', source:'CA-SC-02 proposal', status:'PROPOSED',
    hidden:'A checkpoint loses or corrupts part of its provenance during restart.',
    visible:'Only the restored checkpoint and validation metadata.',
    question:'Can a system distinguish remembered evidence from missing or unverified history?',
    baseline:'Compare against a basic snapshot, checksum and recovery rule.'},
  {id:'cosmic', title:'Synthetic cosmic fault', source:'Interpretive analogy', status:'PROPOSED',
    hidden:'A simulated memory bit is flipped by a synthetic event, not by observed radiation.',
    visible:'Only permitted internal error indicators and state checks.',
    question:'Does detecting an ordinary fault improve decisions without attributing it to an unmeasured cosmic cause?',
    baseline:'Compare against standard parity or checksum fault detection.'},
]);
