import { useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CircleHelp,
  Database, Eye, FlaskConical, Gauge, HardDriveDownload, HardDriveUpload,
  Pause, RotateCcw, ShieldCheck, SlidersHorizontal, Zap, Wrench
} from 'lucide-react';
import {
  ROOM, LANDMARKS, createHaven, stepHaven, intervene, ambience,
  operationalConditions, exportCheckpoint, importCheckpoint
} from '../sim/haven.js';

const LANDMARK_MAP = new Map(LANDMARKS.map(l => [l.x + ':' + l.y, l]));
const ACTIONS = [
  ['north', ArrowUp, 'North'],
  ['west', ArrowLeft, 'West'],
  ['east', ArrowRight, 'East'],
  ['south', ArrowDown, 'South'],
];

function Metric({ label, value, suffix = '', warning = false }) {
  return <div className="haven-metric">
    <span>{label}</span><strong className={warning ? 'metric-warning' : ''}>{value}{suffix}</strong>
  </div>;
}

function RoomMap({ state, onMove }) {
  return <div className="haven-map-wrap">
    <div className="haven-map-header">
      <span><span className="haven-indicator"/> LIVE SIMULATOR STATE</span>
      <span>SEED {state.seed} · T{String(state.tick).padStart(2, '0')}</span>
    </div>
    <div
      className="haven-map"
      role="group"
      tabIndex={0}
      aria-label="Haven room map. Use arrow keys to move the vessel."
      onKeyDown={e => {
        const keys = { ArrowUp: 'north', ArrowDown: 'south', ArrowLeft: 'west', ArrowRight: 'east' };
        if (keys[e.key]) { e.preventDefault(); onMove(keys[e.key]); }
      }}
    >
      {Array.from({ length: ROOM.height }, (_, y) =>
        Array.from({ length: ROOM.width }, (_, x) => {
          const landmark = LANDMARK_MAP.get(x + ':' + y);
          const isVessel = state.pose.x === x && state.pose.y === y;
          return <div
            key={x + ':' + y}
            className={'haven-tile ' + (landmark ? 'haven-landmark ' : '') + (isVessel ? 'haven-vessel' : '')}
            title={isVessel ? 'CA-V0: vessel position' : landmark ? landmark.label : 'Open floor'}
            aria-label={'Column ' + (x + 1) + ', row ' + (y + 1) + ': ' + (isVessel ? 'vessel' : landmark ? landmark.label : 'empty')}
          >
            {isVessel ? <span className="haven-avatar" aria-hidden="true">Φ</span> :
              landmark ? <span className="haven-object" aria-hidden="true">{landmark.icon}</span> :
              <span className="haven-floor-dot" aria-hidden="true">·</span>}
          </div>;
        })
      )}
    </div>
    <div className="haven-legend"><span><i className="haven-legend-vessel"/> VESSEL</span><span><i className="haven-legend-object"/> LANDMARK</span><span><i className="haven-legend-floor"/> OPEN SPACE</span></div>
  </div>;
}

export default function HavenLab() {
  const [state, setState] = useState(() => createHaven(369));
  const [seed, setSeed] = useState('369');
  const [mode, setMode] = useState('full');
  const [checkpoint, setCheckpoint] = useState(null);
  const [notice, setNotice] = useState('Choose an action to begin. This is an instrumented rule-based simulation.');
  const conditions = operationalConditions(state);
  const step = action => {
    if (state.stopped) { setNotice('Session at its bounded stop condition. Reset or restore to continue.'); return; }
    setState(previous => stepHaven(previous, action));
    setNotice('Applied ' + action + '. Inspect the actual state and event record below.');
  };
  const reset = (nextMode = mode) => {
    const normalized = Number(seed);
    if (!Number.isSafeInteger(normalized) || normalized < 1 || normalized > 999999) {
      setNotice('Enter a whole-number seed between 1 and 999999.');
      return;
    }
    setState(createHaven(normalized, nextMode));
    setMode(nextMode);
    setCheckpoint(null);
    setNotice('Reset to reproducible initial state. No memory from the previous trial was imported.');
  };
  const save = () => {
    setCheckpoint(exportCheckpoint(state));
    setNotice('Checkpoint stored in this page session only. No data was uploaded.');
  };
  const restore = () => {
    if (!checkpoint) return;
    try {
      const recovered = importCheckpoint(checkpoint);
      setState(recovered);
      setSeed(String(recovered.seed));
      setMode(recovered.mode);
      setNotice('Checkpoint restored. Trial state and event provenance were recovered.');
    } catch {
      setNotice('Saved checkpoint could not be restored safely.');
    }
  };
  const inject = () => {
    const fault = state.rangeOnline ? 'range-off' : 'range-on';
    setState(previous => intervene(previous, fault));
    setNotice(fault === 'range-off'
      ? 'Experimenter disconnected the range sensor. The self-model is NOT updated automatically.'
      : 'Experimenter restored the range sensor. Use Observe to refresh self-model verification.');
  };
  const displayEvents = state.events.slice(-5).reverse();

  return <div className="haven-lab">
    <div className="haven-setup">
      <div className="haven-setup-title"><SlidersHorizontal size={17}/><strong>EXPERIMENT CONTROLS</strong></div>
      <div className="haven-setup-fields">
        <label>TRIAL SEED
          <input type="number" min="1" max="999999" step="1" value={seed} onChange={e => setSeed(e.target.value)} aria-label="Trial seed"/>
        </label>
        <label>ARCHITECTURE
          <select value={mode} onChange={e => reset(e.target.value)} aria-label="Simulation architecture">
            <option value="full">CA-V0 · Self-model</option>
            <option value="baseline">Baseline · No self-model</option>
          </select>
        </label>
        <button type="button" className="haven-reset" onClick={() => reset()}><RotateCcw size={16}/> New trial</button>
      </div>
    </div>

    <div className="haven-main-grid">
      <div className="haven-room-column">
        <RoomMap state={state} onMove={step}/>
        <div className="haven-controllers">
          <div className="haven-directional">
            {ACTIONS.map(([action, Icon, label]) =>
              <button key={action} className={'haven-arrow haven-arrow-' + action} disabled={state.stopped}
                onClick={() => step(action)} title={'Move ' + label.toLowerCase()} aria-label={'Move ' + label.toLowerCase()}>
                <Icon size={18}/>
              </button>
            )}
          </div>
          <div className="haven-actions">
            <button disabled={state.stopped} onClick={() => step('observe')}><Eye size={16}/> Observe</button>
            <button disabled={state.stopped} onClick={() => step('interact')}><Wrench size={16}/> Inspect</button>
            <button disabled={state.stopped} onClick={() => step('rest')}><Pause size={16}/> Low activity</button>
            <button onClick={inject}><FlaskConical size={16}/> {state.rangeOnline ? 'Disconnect sensor' : 'Restore sensor'}</button>
          </div>
        </div>
        <div className="haven-notice" role="status" aria-live="polite">{notice}</div>
      </div>

      <div className="haven-console">
        <div className="haven-console-head">
          <span><Gauge size={16}/> INSTRUMENTED STATE</span>
          <span className={state.stopped ? 'haven-status halt' : 'haven-status'}>
            {state.stopped ? 'HALTED' : 'BOUNDED / ACTIVE'}
          </span>
        </div>
        <div className="haven-metrics">
          <Metric label="ENERGY" value={state.energy} suffix=" / 100" warning={state.energy < 20}/>
          <Metric label="THERMAL LOAD" value={state.heat} suffix=" / 100" warning={state.heat > 60}/>
          <Metric label="ROOM AMBIENCE" value={ambience(state)}/>
          <Metric label="RANGE SENSOR (TRUTH)" value={state.rangeOnline ? 'ONLINE' : 'OFFLINE'} warning={!state.rangeOnline}/>
          <Metric label="TICK / LIMIT" value={state.tick} suffix={' / ' + state.tickLimit}/>
          <Metric label="RECENT OBSERVATIONS" value={state.lastObservation.length}/>
        </div>
        <div className="haven-console-section">
          <div className="haven-console-subhead"><CircleHelp size={15}/> SELF-MODEL / REPORTED ESTIMATE</div>
          {state.selfModel === null
            ? <p className="haven-muted">Self-model absent by experimental design. Baseline controller still has access to direct instrumented state for its fixed rules.</p>
            : <div className="haven-model">
              <div><span>Range believed</span><strong>{state.selfModel.rangeOnline ? 'ONLINE' : 'OFFLINE'}</strong></div>
              <div><span>Energy estimate</span><strong>{state.selfModel.energy}</strong></div>
              <div><span>Heat estimate</span><strong>{state.selfModel.heat}</strong></div>
              <div><span>Last verified</span><strong>T{state.selfModel.lastVerifiedTick}</strong></div>
            </div>}
          <div className="haven-conditions">
            {conditions.map(c => <div key={c.name}><span className={c.ok === true ? 'condition-ok' : c.ok === false ? 'condition-warn' : 'condition-na'}>{c.ok === true ? '●' : c.ok === false ? '◐' : '○'}</span><span>{c.name}</span><strong>{c.value}</strong></div>)}
          </div>
        </div>
        <div className="haven-console-section">
          <div className="haven-console-subhead"><Database size={15}/> EVENT TRACE / LAST 5</div>
          <ol className="haven-events">
            {displayEvents.map(e => <li key={e.seq}><span>#{String(e.seq).padStart(3, '0')} / T{e.tick}</span><div><strong>{e.kind} · {e.source}</strong><p>{e.detail}</p></div></li>)}
          </ol>
        </div>
        <div className="haven-checkpoint">
          <button onClick={save}><HardDriveDownload size={15}/> Checkpoint</button>
          <button disabled={!checkpoint} onClick={restore}><HardDriveUpload size={15}/> Restore</button>
        </div>
      </div>
    </div>
    <div className="haven-explainer">
      <div><ShieldCheck size={20}/><strong>What this really is</strong></div>
      <p>A deterministic, local, rule-based interactive test harness. It does not run an AI model, detect consciousness, experience comfort, or constitute evidence of Computational Awareness. Try disconnecting the range sensor, then pressing Observe: the difference between instrumented truth and the operational self-model becomes visible. Switch to the baseline to compare a controller with no explicit self-model.</p>
    </div>
  </div>;
}

