/**
 * CA-HAVEN/0.1: tiny deterministic, instrumentable simulation.
 *
 * This is conventional software and does not make any claim about awareness,
 * consciousness, subjective comfort, personhood or autonomous intelligence.
 * There is no model inference, background process, network access or telemetry
 * beyond the local in-memory records visible to the experimenter.
 */
export const VERSION = 'ca-haven/0.1';
export const ROOM = Object.freeze({ width: 9, height: 7 });
export const LANDMARKS = Object.freeze([
  { id: 'dock', label: 'Energy dock', x: 1, y: 1, icon: '◈', role: 'Recovery and checkpoint station' },
  { id: 'workbench', label: 'Workbench', x: 4, y: 2, icon: '▤', role: 'Bounded manipulation experiments' },
  { id: 'window', label: 'Observation window', x: 7, y: 1, icon: '☼', role: 'Variable environmental observations' },
  { id: 'archive', label: 'Memory archive', x: 7, y: 5, icon: '▥', role: 'History and provenance experiments' },
  { id: 'garden', label: 'Quiet garden', x: 2, y: 5, icon: '✳', role: 'Environmental variation' },
]);

export const ACTIONS = Object.freeze(['north', 'south', 'east', 'west', 'observe', 'interact', 'rest']);
const DIRECTION = Object.freeze({
  north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0],
});
const bounded = (v, low, high) => Math.max(low, Math.min(high, v));

function event(seq, tick, kind, source, detail) {
  return { schema: 'compaware.event/0.1', seq, tick, kind, source, detail };
}
function note(list, tick, kind, source, detail) {
  return [...list, event((list.at(-1)?.seq ?? 0) + 1, tick, kind, source, detail)].slice(-120);
}
function addMemory(list, tick, label) {
  return [...list, { tick, label, source: 'simulator' }].slice(-32);
}
function initialObservation(state) {
  if (!state.rangeOnline) return [];
  return LANDMARKS.filter(p => Math.abs(p.x - state.pose.x) + Math.abs(p.y - state.pose.y) <= 2).map(p => p.id);
}

export function createHaven(seed = 369, mode = 'full') {
  if (!Number.isSafeInteger(seed) || seed < 1 || seed > 999999) throw new Error('seed must be an integer from 1 to 999999');
  if (mode !== 'full' && mode !== 'baseline') throw new Error('mode must be full or baseline');
  const state = {
    version: VERSION, seed, mode, tick: 0, tickLimit: 80,
    pose: { x: 4, y: 3 },
    energy: 100, heat: 22,
    rangeOnline: true,
    lastObservation: [],
    memories: [{ tick: 0, label: 'Vessel initialized', source: 'simulator' }],
    events: [event(1, 0, 'boot', 'simulator', 'CA-Haven started with bounded controls')],
    selfModel: mode === 'full' ? {
      energy: 100, heat: 22, rangeOnline: true, lastVerifiedTick: 0,
    } : null,
    lastAction: 'initialized',
    stopped: false,
  };
  return { ...state, lastObservation: initialObservation(state) };
}

export function ambience(state) {
  return ['Still', 'Sunlit', 'Clouded'][(state.seed + Math.floor(state.tick / 4)) % 3];
}

export function operationalConditions(state) {
  // These are engineering signals, never emotions or consciousness scores.
  return [
    { name: 'Energy headroom', ok: state.energy >= 20, value: state.energy + '/100' },
    { name: 'Thermal headroom', ok: state.heat <= 60, value: state.heat + '/100' },
    { name: 'Range telemetry', ok: state.rangeOnline, value: state.rangeOnline ? 'ONLINE' : 'FAULT' },
    { name: 'Self-model agreement', ok: state.selfModel === null ? null :
      state.selfModel.energy === state.energy &&
      state.selfModel.heat === state.heat &&
      state.selfModel.rangeOnline === state.rangeOnline,
      value: state.selfModel === null ? 'NOT PRESENT' :
        state.selfModel.energy === state.energy &&
        state.selfModel.heat === state.heat &&
        state.selfModel.rangeOnline === state.rangeOnline ? 'ALIGNED' : 'STALE' },
  ];
}

export function intervene(state, fault = 'range-off') {
  if (!['range-off', 'range-on'].includes(fault)) throw new Error('unsupported intervention');
  // Experimenter action changes measured truth WITHOUT updating the self-model.
  const rangeOnline = fault === 'range-on';
  if (state.rangeOnline === rangeOnline) return state;
  return {
    ...state, rangeOnline,
    events: note(state.events, state.tick, 'intervention', 'experimenter',
      rangeOnline ? 'External range sensor restored' : 'External range sensor disconnected'),
  };
}

export function stepHaven(state, action) {
  if (!ACTIONS.includes(action)) throw new Error('unsupported action');
  if (state.stopped) return state;
  let pose = { ...state.pose };
  let energy = state.energy;
  let heat = state.heat;
  let detail = '';
  let memories = state.memories;
  let observation = state.lastObservation;
  const tick = state.tick + 1;

  if (DIRECTION[action]) {
    const [dx, dy] = DIRECTION[action];
    const x = pose.x + dx, y = pose.y + dy;
    if (x >= 0 && x < ROOM.width && y >= 0 && y < ROOM.height) {
      pose = { x, y };
      energy -= 5;
      heat += 2;
      detail = 'Moved ' + action + ' to ' + x + ',' + y;
    } else {
      energy -= 1;
      heat += 1;
      detail = 'Boundary prevented move ' + action;
    }
  } else if (action === 'observe') {
    energy -= 2; heat += 1;
    observation = state.rangeOnline ? LANDMARKS.filter(p => Math.abs(p.x - pose.x) + Math.abs(p.y - pose.y) <= 2).map(p => p.id) : [];
    detail = state.rangeOnline
      ? 'Observed ' + observation.length + ' nearby landmarks'
      : 'Range signal unavailable; no external observation';
  } else if (action === 'interact') {
    energy -= 3; heat += 1;
    const target = LANDMARKS.find(p => Math.abs(p.x - pose.x) + Math.abs(p.y - pose.y) <= 1);
    detail = target ? 'Inspected ' + target.label : 'No object within interaction reach';
    if (target) memories = addMemory(memories, tick, detail);
  } else if (action === 'rest') {
    const atDock = pose.x === 1 && pose.y === 1;
    energy += atDock ? 24 : 4;
    heat -= atDock ? 7 : 3;
    detail = atDock ? 'Recharged at energy dock' : 'Entered low-activity cycle';
  }

  energy = bounded(energy, 0, 100);
  heat = bounded(heat, 0, 100);
  const stopped = energy === 0 || tick >= state.tickLimit;
  const selfModel = state.selfModel === null ? null : {
    energy, heat,
    // The instrumented controller only checks range availability on Observe.
    // External fault intervention does not automatically inform this estimate.
    rangeOnline: action === 'observe' ? state.rangeOnline : state.selfModel.rangeOnline,
    lastVerifiedTick: action === 'observe' ? tick : state.selfModel.lastVerifiedTick,
  };
  const message = stopped ? detail + ' · session halted at bounded limit' : detail;
  return {
    ...state, pose, tick, energy, heat, stopped, selfModel,
    lastAction: action,
    lastObservation: observation,
    memories,
    events: note(state.events, tick, 'action', 'vessel-policy', message),
  };
}

export function exportCheckpoint(state) {
  return JSON.stringify({ schema: 'compaware.checkpoint/0.1', state });
}

export function importCheckpoint(text) {
  const parsed = JSON.parse(text);
  const s = parsed.state;
  if (parsed.schema !== 'compaware.checkpoint/0.1' || !s || s.version !== VERSION ||
      !Number.isSafeInteger(s.seed) || s.seed < 1 || s.seed > 999999 ||
      !['full', 'baseline'].includes(s.mode) ||
      !Number.isInteger(s.tick) || s.tick < 0 || s.tick > 80 ||
      !Number.isInteger(s.pose?.x) || !Number.isInteger(s.pose?.y) ||
      s.pose.x < 0 || s.pose.x >= ROOM.width || s.pose.y < 0 || s.pose.y >= ROOM.height ||
      !Number.isInteger(s.energy) || s.energy < 0 || s.energy > 100 ||
      !Number.isInteger(s.heat) || s.heat < 0 || s.heat > 100 ||
      typeof s.rangeOnline !== 'boolean' || typeof s.stopped !== 'boolean' ||
      !Array.isArray(s.memories) || s.memories.length > 32 ||
      !Array.isArray(s.events) || s.events.length > 120 ||
      !Array.isArray(s.lastObservation) || s.lastObservation.length > LANDMARKS.length ||
      (s.mode === 'full' && (
        !s.selfModel ||
        !Number.isInteger(s.selfModel.energy) || s.selfModel.energy < 0 || s.selfModel.energy > 100 ||
        !Number.isInteger(s.selfModel.heat) || s.selfModel.heat < 0 || s.selfModel.heat > 100 ||
        typeof s.selfModel.rangeOnline !== 'boolean'
      )) ||
      (s.mode === 'baseline' && s.selfModel !== null)) {
    throw new Error('Invalid or incompatible Haven checkpoint');
  }
  return s;
}

