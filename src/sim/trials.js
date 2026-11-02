/**
 * CA-Haven Rung 2: a controlled deterministic *functional* comparison.
 *
 * All controllers see the exact same binary "sensor available" report at
 * the exact same scheduled Observe ticks. There is NO autonomy or model
 * inference. The full vessel's self-model has no informational advantage
 * over a one-bit last-observation baseline, and parity is expected.
 *
 * This evaluates bookkeeping under imposed state changes, not awareness.
 */
import { VERSION as HAVEN_VERSION, createHaven, stepHaven, intervene } from './haven.js';

export const PROTOCOL_ID = 'ca-haven.sensor-health-comparison/0.1';
export const SCENARIOS = Object.freeze([
  { id: 'stable-on', label: 'Stable online', note: 'No faults; constant-online is a strong simple baseline.' },
  { id: 'stable-off', label: 'Stable offline', note: 'Initially offline; the observer must receive an explicit report.' },
  { id: 'periodic', label: 'Periodic changes', note: 'Health alternates every four ticks.' },
  { id: 'intermittent', label: 'Intermittent changes', note: 'Seeded pseudorandom health flips, probability 0.2 per tick.' },
]);
export const CONTROLLERS = Object.freeze([
  { id: 'self-model', label: 'Full self-model' },
  { id: 'last-report', label: 'One-bit last report' },
  { id: 'always-on', label: 'Constant online' },
  { id: 'always-off', label: 'Constant offline' },
]);

function validateInteger(name, n, min, max) {
  if (!Number.isSafeInteger(n) || n < min || n > max) {
    throw new Error(name + ' must be a whole number from ' + min + ' to ' + max);
  }
}
function seededRng(seed) {
  let v = seed >>> 0;
  return () => {
    v = (Math.imul(v, 1664525) + 1013904223) >>> 0;
    return v / 4294967296;
  };
}
function truthAt(id, tick, prior, draw) {
  switch (id) {
    case 'stable-on': return true;
    case 'stable-off': return false;
    case 'periodic': return Math.floor(tick / 4) % 2 === 0;
    case 'intermittent': return tick !== 0 && draw() < 0.2 ? !prior : prior;
    default: throw new Error('unknown scenario');
  }
}
function emptyMetric(controller) {
  return { id: controller.id, label: controller.label, correct: 0, total: 0 };
}
function update(metric, prediction, actual) {
  metric.total++;
  if (prediction === actual) metric.correct++;
}
function summarize(metric) {
  return {
    ...metric,
    mismatches: metric.total - metric.correct,
    accuracy: metric.total > 0 ? metric.correct / metric.total : null,
  };
}

export function runSensorStudy({ seed = 369, replicates = 8, steps = 24, observeEvery = 3 } = {}) {
  validateInteger('seed', seed, 1, 999999);
  validateInteger('replicates', replicates, 1, 40);
  validateInteger('steps', steps, 6, 60);
  validateInteger('observeEvery', observeEvery, 1, 10);

  const globalMetrics = CONTROLLERS.map(emptyMetric);
  const byScenario = [];
  const trace = [];

  for (const scenario of SCENARIOS) {
    const scenarioMetrics = CONTROLLERS.map(emptyMetric);

    for (let rep = 0; rep < replicates; rep++) {
      const instanceSeed = seed + rep;
      // Arithmetic hashes select independent pseudorandom trial streams.
      // This is reproducible simulation, not a cryptographic random source.
      const scenarioIndex = SCENARIOS.findIndex(s => s.id === scenario.id);
      const draw = seededRng((Math.imul(seed, 2654435761) +
        Math.imul(rep + 1, 1597334677) + scenarioIndex * 7919) >>> 0);

      let full = createHaven(instanceSeed <= 999999 ? instanceSeed : 1 + instanceSeed % 999999);
      let baseline = createHaven(full.seed, 'baseline');
      let lastReport = true;
      let priorTruth = true;

      for (let tick = 0; tick < steps; tick++) {
        const actual = truthAt(scenario.id, tick, priorTruth, draw);
        priorTruth = actual;
        if (full.rangeOnline !== actual) {
          full = intervene(full, actual ? 'range-on' : 'range-off');
          baseline = intervene(baseline, actual ? 'range-on' : 'range-off');
        }

        const guesses = [
          full.selfModel.rangeOnline,
          lastReport,
          true,
          false,
        ];
        for (let i = 0; i < CONTROLLERS.length; i++) {
          update(globalMetrics[i], guesses[i], actual);
          update(scenarioMetrics[i], guesses[i], actual);
        }

        const action = tick % observeEvery === 0 ? 'observe' : 'rest';
        const record = {
          scenario: scenario.id, replicate: rep, seed: full.seed,
          tick, truthOnline: actual, action,
          forecasts: Object.fromEntries(CONTROLLERS.map((c, i) => [c.id, guesses[i]])),
          observation: action === 'observe' ? { rangeHealthAvailable: actual } : null,
        };

        full = stepHaven(full, action);
        baseline = stepHaven(baseline, action);
        // A one-bit baseline gets precisely the same explicit health report
        // as the full model, and never reads experimenter intervention events.
        if (action === 'observe') lastReport = actual;
        if (full.stopped !== baseline.stopped ||
            full.energy !== baseline.energy ||
            full.heat !== baseline.heat) {
          throw new Error('resource/step parity violated');
        }
        trace.push(record);
      }
    }

    byScenario.push({
      id: scenario.id,
      label: scenario.label,
      note: scenario.note,
      metrics: scenarioMetrics.map(summarize),
    });
  }

  return {
    protocol: PROTOCOL_ID,
    havenVersion: HAVEN_VERSION,
    status: 'deterministic-functional-simulation',
    claimBoundary: 'Measures accuracy of simple binary sensor-state tracking. It does not assess awareness or subjective experience.',
    config: { seed, replicates, steps, observeEvery, forecastsScoredBeforeObservation: true },
    totalForecastsPerController: SCENARIOS.length * replicates * steps,
    metrics: globalMetrics.map(summarize),
    byScenario,
    trace,
  };
}

