# CompAware Rung 7 · Intervention Specificity and Transportability

**Protocol:** \`compaware.haven.transportability/0.1\`  
**Status:** Exploratory deterministic simulation, NOT independently preregistered, NOT a physical measurement, NOT evidence of Computational Awareness or subjective consciousness.  
**Inquiry handoff:** [CA-SC-05 Intervention Mirror](INTERVENTION_MIRROR.md), merged PR #12.

## Why this rung exists

Rung 6 compared report-only inference with trusted or corrupted anchors and specified isolation. CA-SC-05 proved that **a change in an observed triple-report distribution after an intervention does not necessarily identify what caused it**. A hidden common failure can partially improve while ordinary sensor accuracy changes as a side effect. A different independent-sensor world can show the same reports both before and after.

This experiment implements the counterexample in executable form and asks what additional test evidence can *conditionally* help, including a controlled known-input measurement. It tests how a conclusion can fail to transport from a test fixture to ordinary operation.

## Two hidden worlds and three phases

Under balanced binary truth, symmetric per-channel errors and exchangeable three-sensor reports:

- **World I:** Before intervention, independent sources each ~92.19% accurate. During intervention, independent accuracy is 90%. On return, restore before parameters.
- **World C:** Before, all-wrong common failure occurs 20% of the time, with each non-event sensor 90% accurate (72% actual marginal). During intervention, common failure drops to 10%, while non-event sensor accuracy is adjusted to ~88.73% so the **complete triple-report distribution exactly matches World I**. On return, restore the before parameters.

Each world has the same *observable joint report law* in each phase, even though its hidden conditional accuracy differs. Before/return: 39.2% each for all-identical triples and 3.6% for each mixed triple. During: 36.5% each for all-identical triples and 4.5% for each mixed triple.

At normal, unprobed ticks, the simulator deliberately uses **the same random report draw** in the paired worlds. Hidden truth is then sampled conditionally on that report for the scorer only. Exact report pairing does not imply exact hidden truth.

Trial time is divided into equal pre, announced-intervention and return phases. Return-to-baseline is an explicit **simulation assumption**, not empirical evidence a real device recovers its earlier calibration.

## Five conditions

| Condition | What is added | Why it matters |
|---|---|---|
| **Mirror** | Report triples only, no known inputs | Strict non-identification control; both worlds' reports match exactly |
| **Sham** | Intervention announcement but no actual generating-law change | A negative control for treating the announcement as proof |
| **Controlled-input probes** | A declared known digital input is injected on scheduled ticks | Conditional sensor errors can become identifiable if the probe faithfully tests the same measurement path |
| **Tampered probe labels** | 30% chance the issued input certificate is false | A purported known-state anchor can itself be unreliable |
| **Probe-only calibration shift** | During probe sampling, both hidden worlds use independent 90%-accurate channels, regardless of normal mode | Probe conclusions may not transport to ordinary sensing |

Every probe is **offered at the same scheduled ticks** (one of every three); its value is accessible only to a policy that chooses to buy the certificate, and purchase costs 0.5 utility. The controller sees normal report triples regardless of purchasing. The actual controlled input, corrupted-label flag, and causal mode are kept away from policy decision functions.

In a future physical prototype, "known input" must refer to a separately instrumented injected digital stimulus, with provenance and validation. This code does not create such an instrument.

## Controller policies

1. **Honest abstention:** Always unresolved. No probe purchases.
2. **Naive independence assumption:** Declares independent with excessive certainty, no purchases; a negative control.
3. **Simple report histogram:** Estimates mixed-triple rate change from ordinary reports, with a fixed decision heuristic. This cannot uniquely identify which hidden model caused the change in the mirror construction.
4. **Probe match-rate threshold:** Purchases probes and compares pooled report-to-claimed-input matches against the midpoint of the two hypothesized marginal accuracies.
5. **Model-based probe likelihood:** Purchases probes; computes log likelihood of reports conditioned on claimed input and a candidate world, **assuming the labels and measurement mechanism are trustworthy and transportable**.
6. **Two-method agreement gate:** Purchases probes; declares a world only if the likelihood and simple match-rate heuristics agree confidently. Otherwise abstains.

No policy is a trained AI or full CA-V0 architecture. Their candidate world models are developer-provided. They do not discover every possible causal explanation.

## Reported metrics

For each policy and experimental condition:

- Correct hidden-world declarations.
- Incorrect declarations and confident errors.
- Unresolved/abstaining decisions.
- Paid probe purchases.
- Total and mean utility.
- Brier squared error of the probability that world C is true, calculated using scorer-only labels.
- A complete downloadable, reproducible local JSON receipt of reports, phases, purchased labels, true injected bits (scorer-only), and trial conclusions.

Payoffs: correct declaration +8, wrong declaration −12, unresolved 0, probe purchase −0.5. The payoffs are explicitly developer-chosen: winning on these numbers is not universal epistemic superiority. Results should be viewed with costs, wrong declarations and abstentions separately.

## Exact evidence boundary

Policies get only ordinary A/B/C reports and any *purchased* claimed probe input. Hidden truth, world identity, actual input bit if certificate is corrupted, and probe-mode mechanism never enter the policy input. The scorer records them after the decisions for reproducibility and auditing.

The **passive**, **sham**, and all **unprobed natural** report streams are paired exactly between worlds for matched seed/repetition/phase. Controlled-input probes break equivalence when they faithfully reveal a known input with different conditional error laws. When the test fixture changes the measurement chain, probe accuracy may say little about ordinary sensing.

The same source of observations can support multiple causes. An appropriate conclusion may be **not identifiable from the available evidence**.

## Replay and safeguards

- Engine: \`src/sim/transportStudy.js\`.
- Interface: \`src/components/TransportabilityLab.jsx\`.
- Styles: \`src/styles-r7.css\`.
- Tests: \`tests/transportStudy.test.mjs\`.
- Default: seed 369, four repetitions per world, 36 ticks divided into 12/12/12.
- Allowed: seed 1–999999, repetitions 1–12, steps 18–72 divisible by 6.
- \`npm run check\` runs Node tests and the production Vite build.

All state is generated locally when requested, with no external sensor interface or remote inference backend.

## What it does not establish

- The injected digital input has not been independently validated on physical hardware.
- A synthetic return phase is not proof of ecological or temporal transportability.
- Model posteriors assume one of two developer-specified hidden worlds; the real cause could be neither.
- The correctness of a model under synthetic distributions does not show consciousness, subjective comfort, personhood, or Computational Awareness.
- The simulation was specified and tested together, so even its nominal repeated seeds are *not* independent confirmatory evidence.
- Probe-policy information and computation differ from abstaining and naive baselines; utility comparisons include purchase costs but not CPU-time normalization.

## Acceptance criteria

- [ ] Same seed/settings generate byte-identical receipts.
- [ ] Paired passive and sham reports are identical, in every phase.
- [ ] Unprobed natural report streams remain identical across all conditions.
- [ ] Controlled inputs can generate distinguishable observed reports when their measurement path is representative.
- [ ] Corrupted certificates are present and scorer-only discrepancy is recorded.
- [ ] Label access is withheld from policies that decline to purchase probes.
- [ ] All policy scores and costs reconcile with trial receipts.
- [ ] Honest abstention never fabricates certainty.
- [ ] React UI, all prior research labs, Node tests and Vite production build work.

## Handoff to Cosmos / Inquiry collaborator

**The next conceptual challenge:** How could an actual physical digital-input reference demonstrate it is independent from the same software, clock, power, calibration data or wire path used by the sensors under examination? What minimal experiments would reveal probe-mode side effects and return-phase hysteresis?

Investigate the difference between *observed repeatability*, *causal identifiability*, *transportability* and *confidence calibration*. Require at least one simple alternative explanation and one falsifiable negative control. A system must be allowed to report **insufficient evidence**.

> The goal remains to understand measurable computational organization, not to declare the vessel conscious.

