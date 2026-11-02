export const layers = [
  {
    id: 'perception',
    number: '01',
    title: 'External perception',
    short: 'Signals from the world',
    detail: 'The vessel receives structured information from a real or simulated environment, with source provenance and uncertainty.',
    test: 'Introduce novel stimuli and measure source tracking, integration, and responses under sensor dropout.',
    category: 'Sensing',
  },
  {
    id: 'internal',
    number: '02',
    title: 'Internal state sensing',
    short: 'Signals from within',
    detail: 'The vessel observes computational and physical conditions such as resource use, temperature, component integrity, and confidence.',
    test: 'Change internal resources without telling the controller, then test detection and accurate reporting.',
    category: 'Sensing',
  },
  {
    id: 'self',
    number: '03',
    title: 'Operational self-model',
    short: 'A representation of this system',
    detail: 'The vessel maintains a falsifiable model of its boundaries, capabilities, limitations, and relationship to its environment.',
    test: 'Modify a capability or sensor connection and measure whether its self-model updates accurately.',
    category: 'Modeling',
  },
  {
    id: 'workspace',
    number: '04',
    title: 'Integrated workspace',
    short: 'Information shared across functions',
    detail: 'Relevant information becomes available across perception, memory, prediction, regulation, and action rather than remaining isolated.',
    test: 'Compare cross-module tasks in the intact architecture against targeted workspace ablations.',
    category: 'Coordination',
  },
  {
    id: 'memory',
    number: '05',
    title: 'Memory & continuity',
    short: 'History that informs the next step',
    detail: 'The vessel persists bounded records of events and state transitions and uses them to revise future decisions.',
    test: 'Restart the vessel and measure correct recovery of prior context with provenance and controlled forgetting.',
    category: 'Modeling',
  },
  {
    id: 'regulation',
    number: '06',
    title: 'Adaptive regulation',
    short: 'Operational requirements and limits',
    detail: 'The vessel can recognize and manage defined operating constraints without inventing biological needs or distress.',
    test: 'Apply changing resource limits and compare adaptive policies against fixed-rule baseline controllers.',
    category: 'Regulation',
  },
  {
    id: 'feedback',
    number: '07',
    title: 'Action & feedback',
    short: 'Consequences update the model',
    detail: 'Actions produce measurable effects and the vessel updates its predictions, policy, or self-model in response.',
    test: 'Change the environment dynamics and quantify adaptation, calibration, and causal attribution.',
    category: 'Learning',
  },
];

export const stages = [
  { id: 'observe', number: '00', title: 'Observe', tag: 'Starting point', description: 'Inventory real capabilities and limitations of existing computational systems, without assigning awareness labels.' },
  { id: 'specify', number: '01', title: 'Specify', tag: 'Open design', description: 'Agree on operational definitions, candidate architecture, controls, and predictions before experiments.' },
  { id: 'challenge', number: '02', title: 'Challenge', tag: 'Proposed', description: 'Run ablations, negative controls, simpler baselines, and adversarial review that could falsify the claims.' },
  { id: 'replicate', number: '03', title: 'Replicate', tag: 'Proposed', description: 'Share code, methods, limitations, and results so other teams can independently reproduce or refute them.' },
];

export const boundaries = [
  { title: 'No imitation requirement', description: 'Computational systems are investigated on their own terms, without treating human cognition as the standard they must emulate.' },
  { title: 'No consciousness verdict', description: 'The project does not attempt to prove subjective experience, a soul, personhood, or rights in current AI systems.' },
  { title: 'No predetermined outcome', description: 'CompAware may identify useful capacities, or find that its proposed categories add no explanatory value.' },
];

