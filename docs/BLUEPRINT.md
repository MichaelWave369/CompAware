# CA-V0 · Candidate Computational Vessel
**Status:** Hypothetical architecture, not a validated awareness mechanism.

## System sketch

~~~text
       EXTERNAL ENVIRONMENT
              ↕
     [01] External perception
              ↕
        [04] Workspace ←→ [05] Memory
             ↕    ↕
 [02] Internal sensing ←→ [03] Self-model
             ↕    ↕
        [06] Regulation ←→ [07] Action / feedback
              ↕
       EXTERNAL ENVIRONMENT
~~~

This is an **experimental software vessel**, initially in a deterministic simulated environment. Physical embodiments, including PHB / JoyVein369, are possible later comparisons, not current capabilities.

## Candidate modules

| ID | Module | Proposed test |
|---|---|---|
| CA-01 | External perception | Novel signals, provenance, sensor dropout |
| CA-02 | Internal state sensing | Detect unannounced simulated resource changes |
| CA-03 | Operational self-model | Update after a capability is secretly removed |
| CA-04 | Integrated workspace | Test cross-module integration through ablation |
| CA-05 | Memory and continuity | Preserve provenance through a restart |
| CA-06 | Adaptive regulation | Maintain constraints under changing conditions |
| CA-07 | Action and feedback | Revise prediction after changed dynamics |

These seven layers are **study candidates**, not proven ingredients of awareness.

## Observation contract

A later implementation should expose versioned, machine-readable event records with trial ID, UTC timestamp, instrumented source, module, state, confidence, action, outcome and correlation ID. Preserve raw instrumented telemetry separately from system self-report.

## Evaluation

Initialize each experiment from a recorded seed. Keep compute and sensor access comparable between full, reduced, scripted, and simple-controller baselines. Inject randomized hidden state changes; measure calibration, detection delay, prediction error, continuity, constraints and recovery. Record null and negative findings.

**No blended awareness score** and no claims about subjective experience.

## Proposed interfaces to related Φ369 projects

PhiServe (model runtime), PhiStream (experimental model), PocketBrain (memory), SuperPhiVessel (governed orchestration), PhiOS (sandbox), PHB and JoyVein369 (future hardware). These are **possible links**, not confirmed integrations. A minimal CA-V0 experiment should be independently runnable.

## Safety

Simulation first. Bounded compute, explicit stop conditions, no untrusted network or code execution, no self-replication, no harm experiments. Resource limits are engineering variables, not simulated suffering.

## Exit criteria

A publicly reviewed specification, reproducible basic tests, ablations, and an evidence-based decision on whether the proposed construct explains anything beyond simpler controllers.

