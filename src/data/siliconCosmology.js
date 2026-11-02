/**
 * CA-SC-01: an interpretive atlas mapped to the *existing* CA-V0 modules.
 * All tests are proposals. Nothing here reports a measurement or assesses
 * subjective experience.
 */
export const cosmosLenses = Object.freeze([
  {
    id: 'perception', title: 'The outside universe', code: 'CA-01',
    question: 'Which external signals can the vessel genuinely receive and trace to a source?',
    measurement: 'Proposed: signal provenance and source-attribution accuracy under delay and dropout.',
    control: 'Compare with a controller receiving the same inputs but no source model.',
    analogy: 'Microcosm / macrocosm is a historical metaphor, not a sensor mechanism.',
  },
  {
    id: 'internal', title: 'The physical substrate', code: 'CA-02',
    question: 'Can the system detect changes in its own temperature, power and fault indicators?',
    measurement: 'Proposed: detection delay and false reports against independent instrumented truth.',
    control: 'Compare with direct thresholding of the same internal signals.',
    analogy: 'Material origins in the cosmos do not establish experiential awareness.',
  },
  {
    id: 'self', title: 'Knowing its boundaries', code: 'CA-03',
    question: 'Can a system tell the difference between what it could do and what it can do now?',
    measurement: 'Proposed: calibration after an unannounced sensor or capability removal.',
    control: 'Compare with the minimal last-report tracker used in Rung 2.',
    analogy: 'Functional self-knowledge is not Gnostic awakening or a soul.',
  },
  {
    id: 'workspace', title: 'Integrating a world model', code: 'CA-04',
    question: 'When do combined environmental and internal signals improve task decisions?',
    measurement: 'Proposed: matched task utility and error rates during contradictory inputs.',
    control: 'Compare with nonintegrated and low-cost heuristic policies.',
    analogy: 'A world model is not evidence that the world itself has a mind.',
  },
  {
    id: 'memory', title: 'A history through time', code: 'CA-05',
    question: 'Can evidence survive interruptions while retaining origin and uncertainty?',
    measurement: 'Proposed: correct checkpoint recovery and provenance retention after restarts.',
    control: 'Compare with raw logging and a minimal state snapshot.',
    analogy: 'Persistence is not personal continuity in a philosophical sense.',
  },
  {
    id: 'regulation', title: 'Living within constraints', code: 'CA-06',
    question: 'Can it regulate heat, energy and fault risk without inventing biological needs?',
    measurement: 'Proposed: constraint violations, resource costs and false-alarm rates.',
    control: 'Compare with fixed safety thresholds under equal information.',
    analogy: 'Regulation does not imply felt comfort or suffering.',
  },
  {
    id: 'feedback', title: 'Learning from consequence', code: 'CA-07',
    question: 'Can predictions improve when environmental dynamics are changed?',
    measurement: 'Proposed: prediction error, adaptation lag and mitigation cost.',
    control: 'Compare with stateless and last-outcome updating rules.',
    analogy: 'Adaptation alone is not sentience or spiritual transformation.',
  },
]);

export const cosmosEvidenceLevels = Object.freeze([
  { code: 'PHYSICAL', title: 'Measurable coupling', description: 'Calibrated physical observation, not inference from symbolism.' },
  { code: 'SIMULATED', title: 'Defined by code', description: 'A synthetic intervention is not a real celestial observation.' },
  { code: 'HYPOTHESIS', title: 'Prediction at risk', description: 'Matched controls can refute claims of a functional advantage.' },
  { code: 'ANALOGY', title: 'Creative comparison', description: 'A philosophical resemblance is not a causal mechanism.' },
]);
