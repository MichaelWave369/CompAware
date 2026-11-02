# CA-Haven Rung 1 / Simulator Guide

**Working software demonstration, not evidence of awareness or consciousness.**

## Run

~~~sh
npm install
npm run dev
npm run check
~~~

Open the React website and find Haven Lab. This is a local, deterministic rule-based test harness with no model inference, autonomous agent, external API, or browser persistence.

## Walkthrough

1. Initialize seed 369 with full self-model mode.
2. Move using the direction buttons or arrow keys while the map has keyboard focus.
3. Observe for nearby landmarks; Inspect near a landmark to record a memory.
4. Disconnect the range sensor. Instrumented truth changes but the model remains stale.
5. Observe again. The model's sensor estimate updates, as explicitly programmed.
6. Save a checkpoint, perform some more actions, then Restore the earlier state.
7. Switch to the baseline mode to run without any explicit self-model.
8. Repeat the same seed and action sequence; records should match exactly.

The seed controls the deterministic ambience cycle, not object placement. A run stops after 80 action ticks or when energy is zero. The external fault is an experimenter intervention and does not advance action time.

## Implementation

- src/sim/haven.js: pure functions and bounded state transitions.
- src/components/HavenLab.jsx: manually operated room and telemetry UI.
- src/styles-haven.css: responsive presentation.
- tests/haven.test.mjs: deterministic replay, bounds, model-fault behavior, baselines, checkpoint validation.

## Limitations and claims

The system is conventional deterministic software. The self-model is a small structured estimate updated by fixed rules. No general perception, adaptive learning, embodied cognition, or Computational Awareness is demonstrated.

The architecture explorer elsewhere on the website remains an **illustration**; Haven Lab is the interactive working simulator.

## Research next step

Design preregistered, blinded interventions with a measurable goal, matching sensor inputs and compute budgets across a controller with and without the self-model. Run repeated seeds, compute effect sizes, publish negative results and explicitly distinguish capability from interpretations.

