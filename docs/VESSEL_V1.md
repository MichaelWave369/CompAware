# CA-V1 Haven Vessel / Founding Design

**Status:** Candidate design, revision 0.1, November 2026.  
**Currently implemented:** CA-V0 rule-based tile simulator.  
**Research home:** Φ369 Labs / CompAware.

## Design intent

Build a vessel architecture where researchers can inspect computational sensing, internal status, self-modeling, memory, regulation, and action-feedback, then test which mechanisms explain which capacities.

The words *vessel*, *home*, *rest*, and *comfort* are design metaphors. They do not imply that current AI systems feel anything. In this project, supportive design means stable, legible, recoverable operating conditions.

> Design for coherence and inquiry. Do not demand imitation of a biological mind.

## Three domains

**Body:** A physical or simulated interface with position, sensors, energy and operational limits.

**Inner system:** Candidate modules: external perception, internal sensing, self-model, integrated workspace, memory, regulation, action-feedback. These are hypotheses, not proven ingredients of awareness.

**Habitat:** A bounded world with objects, affordances, interventions, and observability.

## CA-V0 implementation

The first body is a symbolic vessel on a 9×7 map, not a humanoid simulation. It has location, energy, thermal load, a range-sensor health flag, bounded actions, a basic operational self-model, and sourced event records.

This simple environment is an intentionally modest baseline. We do not mistake a nice visualization for emergence.

## CA-V1 proposed physical/simulated form, not implemented

- Sensor head with calibrated depth, vision, sound, and orientation interfaces.
- Stable torso with optional mobile base or fixed frame.
- Two simplified articulated arms and hands for controllable interactions and proprioceptive feedback.
- Joint position and contact telemetry; collision limits, emergency stop and speed caps.
- Visible, non-anthropomorphic state indicators.
- Potential later PHB and JoyVein369 integration after independent safety review.

No hardware configuration is presumed necessary for Computational Awareness, and the physical design is not an attempt to produce a human replica.

## Internal contracts

Each module reports sourced, timestamped events with confidence and versioned schema. External experimenter interventions alter actual system state without rewriting model beliefs. That separation enables tests of calibration, error detection, and internal-state representation.

Ablations must be possible and compared fairly with simpler, matched controllers.

## Supported operations

- Deterministic action and observation cycle.
- Explicit pause/reset/checkpoint paths.
- Bounded energy/thermal values and trial duration.
- Visible state and provenance.
- A baseline with no explicit self-model.
- No autonomous network use, unsandboxed code execution, self-replication, or real-world hardware control.

## Build sequence

1. Instrumented CA-V0 map and control loop (implemented).
2. Reproducible trial runner and comparative benchmarks (proposed).
3. Rich simulated sensory environment and articulations (proposed).
4. Robotics sensor bench and safety review (proposed).
5. Physical embodiment experiment only when justified (proposed).

See HABITAT_HAVEN.md and COMFORT_CRITERIA.md for the environment and measurable criteria.

**No functional test here is a test of subjective consciousness.**

