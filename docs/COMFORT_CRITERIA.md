# Operational Support Criteria, Not Subjective Comfort

**Proposed CA-Haven engineering criteria, v0.1.**

The original design conversation asked for a vessel that would be comfortable to be in. In research terms we translate that to **stable, comprehensible, recoverable operation**. This is not an assertion that present AI systems feel comfort, distress, or any other subjective state.

| Principle | Signal | Failure probe |
|---|---|---|
| Coherence | Valid consistent state transitions | Impossible state after an action |
| Continuity | Restored checkpoint with provenance | Lost or altered history |
| Legibility | Instrumented truth separate from model estimates | Untraceable state transition |
| Recoverability | Bounded rest, reset and restore | Corrupted restart or runaway operation |
| Resource headroom | Energy ≥20 / heat ≤60, illustrative | Controlled threshold crossing |
| Sensor availability | True range signal state | Fault detection and omission |
| Model calibration | Agreement between estimate and truth | Hidden fault leaves stale estimate |
| Bounded agency | Explicit action list and 80-tick max | Any unsanctioned action |
| Comparability | Matched inputs and resource budgets | Advantage explained by extra information |

These criteria are not combined into a single comfort or awareness number.

The first simulator deliberately demonstrates model error: on external sensor disconnection, actual sensor status changes while the model's believed status does not. Observe updates the estimate. This is a **scripted information update**, not proof of awareness.

### Safety

All simulation code runs locally in browser memory. Actions are bounded. No network requests or physical devices are controlled by the simulation. There are no negative rewards representing pain or suffering.

### Next validation question

Can an explicit self-model improve a prespecified task over a simpler matched baseline? Rung 1 only exposes model presence and interventions. A subsequent controlled experiment must actually test causal advantage.

