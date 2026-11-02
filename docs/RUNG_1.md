# Rung 1 / Haven Foundation

**Purpose:** Turn the founding vessel concept into bounded, inspectable software without presuming awareness.

## Deliverables

- [x] Vessel specification: body, inner organization, habitat.
- [x] Operational support criteria.
- [x] Fixed 9×7 Haven map and five stations.
- [x] Deterministic simulator with manual actions and engineering resources.
- [x] Instrumented truth and fallible operational self-model.
- [x] External sensor fault intervention.
- [x] No-self-model baseline.
- [x] Bounded sourced events and simple memory records.
- [x] In-memory versioned checkpoint and restore.
- [x] React map and telemetry UI within existing website.
- [x] Automated unit tests included through existing CI.

## Validation checklist

- [ ] Same input state/actions yield identical trace (unit test).
- [ ] Resources and coordinates stay bounded (unit test).
- [ ] External fault is not instantly copied to self-model (unit test).
- [ ] Observe updates model's sensor estimate (unit test).
- [ ] Baseline mode contains no explicit model (unit test).
- [ ] Checkpoint round trip and invalid rejection (unit test).
- [ ] Vite production build passes CI.
- [ ] Live GitHub Pages manual smoke test after merge.

Status above represents implementation targets; CI boxes should only be checked after successful runs. This is not a completed scientific study.

## Rung 2 proposal

Define a real task where self-modeling could improve decisions; make a baseline with matched observations; preregister measurements; add blinded capability changes and trial export; report both null and positive outcomes.

## Hard boundary

No claims of subjective experience, personal awareness, comfort as a feeling, or a biological equivalent. No autonomous hardware or network actions.

**The vessel is a research environment, not a predetermined conclusion.**

