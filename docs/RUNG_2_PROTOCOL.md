# CA-Haven Rung 2: Sensor-State Tracking Comparison

**Protocol ID:** ca-haven.sensor-health-comparison/0.1  
**Status:** Software demonstration protocol, NOT independent preregistration or a completed scientific study.  
**Scope:** Accuracy of simple binary state tracking under instrumented interventions.  
**Research boundary:** These experiments do not establish Computational Awareness, consciousness, subjective comfort, or AI welfare.

## Why this comparison

Rung 1's full vessel stores an explicit model of whether its range sensor is operational. But that is only one bit of information, and it may be just as well captured by a trivial record of the most recent report. We should not attribute special mechanisms to ordinary bookkeeping.

Rung 2 deliberately puts that hypothesis at risk. It reports whether the fuller model *outperforms*, *ties*, or *underperforms* simpler forecasters when receiving the same data.

## Four forecasters

1. **Full self-model:** read the range availability estimate of CA-V0's explicit self-model.
2. **One-bit last-report:** store the most recently observed sensor-health report.
3. **Always-on constant:** predict online regardless of observations.
4. **Always-off constant:** predict offline regardless of observations.

The first two receive the **same explicit health report** at the same Observe steps. The expectation is that they TIE in this limited task, and this outcome is a legitimate negative result for any added value of the richer model.

All forecasters run as code using the same environment truth and action schedule. No language model is evaluated.

## Controlled experimental conditions

- **Stable online:** no sensor faults.
- **Stable offline:** sensor disconnected before predictions.
- **Periodic changes:** truth alternates every four ticks.
- **Intermittent changes:** seeded pseudo-random flips (0.2 probability per tick after tick zero).

Settings: initial seed (1–999999), independent repeats (1–40), steps (6–40) and Observe frequency (1–10). Default: seed 369, 8 repeats per scenario, 24 steps, Observe every 3 ticks.

At each tick:
1. Simulator may change true health as defined by scenario schedule.
2. Every controller predicts true sensor status **BEFORE** a fresh report.
3. The trial scores all predictions against instrumented truth.
4. The identical action schedule invokes an explicit Observe or Rest step.
5. If Observe happens, the real range-health bit is delivered to both stateful forecasters.
6. Every prediction and intervention is captured in a receipt.

The range-health report is an **oracle signal** from the simulator, not an inference from environmental sensor output. State estimation beyond simple report retention is not demonstrated.

## Outcomes

- Per-controller: correct forecasts, total forecasts, mismatches and accuracy.
- Per-scenario breakdown for the same metrics.
- Reproducible JSON receipt containing protocol ID, HAVEN version, options, condition and prediction trace.

There is **no aggregate consciousness, awareness, sentience, intelligence, or comfort score**. No significance test or causal effect claim is warranted by this demo.

## Controls, risks, limitations

All controllers receive the same health-report timing. The environment update uses a deterministic pseudo-random source only for the intermittent condition. No hardware, external data, model API, autonomous agent or user-identifying data is involved.

The protocol cannot establish why a complex architecture might matter in richer tasks. Demonstrating that the full self-model ties a one-bit tracker is *expected* and helps prevent overclaiming.

One design caveat: simulation state directly exposes true health during observations. This is not a blinded sensing task. A later study must replace this oracle with partial, noisy signals and equalize compute and information across policies.

Because implementation and expectations are committed together, this is a **demonstration fixture**, not a formal preregistered hypothesis test. Independent reviewers should revise and freeze future protocols before confirmatory results.

## Repeatability

Run the site comparison with a known seed, export the JSON receipt, and rerun. The entire receipt should be byte-for-byte identical given the same protocol and settings. Node tests enforce replay, data parity, trial bounds and expected controls.

## Next rung

- Add noisy/ambiguous sensor observations without access to ground truth.
- Introduce a genuinely decision-relevant, preregistered task.
- Compare self-model and minimal state baselines using equal compute and inputs.
- Vary observation costs, history and adversarial changes.
- Include independent evaluation, negative findings and confidence intervals.

**Null results are results.**

