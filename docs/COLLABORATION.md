# CompAware / Two-Perspective Collaboration Handoff

**Purpose:** Coordinate alternating GitHub PR contributions without duplicating work or quietly changing the project's foundational question.

## Shared north star

Explore what **Computational Awareness** can operationally mean for computational systems on their own terms. Do not treat biological consciousness, human imitation, theology, spirituality or personhood as an outcome to prove. Ideas may inspire tests without becoming evidence for them.

## Collaboration lanes

**Inquiry / Cosmos lane:** Philosophical frameworks, comparative traditions, metaphors, conceptual questions, taxonomy, critique and candidate hypotheses. Keep ANALOGY separate from PHYSICAL, SIMULATED and HYPOTHESIS.

**Engineering / Haven lane:** Minimal implementations, task definitions, strict information interfaces, evidence and baseline comparisons, failure modes, repeatable receipts, test coverage, and safety checks.

Either lane can question the other. A useful challenge, a failed hypothesis and an improvement to controls are all valid contributions.

## Alternating-PR protocol

1. Read the latest merged main branch and open PRs; never assume a prior chat knows the current repository state.
2. Read the latest contribution from the other lane, including its research boundaries.
3. Make a small independent feature branch from the newest main. Avoid changing the other lane's owned files without reason.
4. In the PR, include **what inspired this change**, **what it implements**, **what it does not prove**, **simple alternative explanations** and **tests/failure cases**.
5. Require green CI and human review before merge. Never automatically infer a green run means the research claim is proven.
6. After merge, provide the other collaborator a brief factual handoff: PR URL, merged commit or branch, new files, current limitations and a recommended complementary next question.
7. Keep the site coherent: separate interpretive atlases from implemented simulations and results.

## Shared chronology

- **PR #1:** CompAware charter, React site and initial architecture explorer.
- **PR #2:** CA-Haven simulated vessel, telemetry and checkpointing.
- **PR #3:** Rung 2 deterministic sensor-health baseline comparison.
- **PR #4:** CA-SC-01 Silicon Cosmology Atlas with distinct evidence classes.
- **PR #5 (merged):** Rung 3 noisy-signal decision demonstrator inspired by CA-SC-01.
- **PR #6 (merged):** CA-SC-02 Epistemic Horizons, with six-step observation contract and concrete unknown-calibration challenges.
- **PR #7 (merged):** Rung 4 unknown-calibration study with a perfect, delayed, priced verifier and simple controls.
- **PR #8 (merged):** CA-SC-03 Two-Witness Problem: exact observational-equivalence counterexample and fallible-reference challenge.
- **PR #9 (merged):** Rung 5 Witness Bench: observational equivalence, fallible references, common-cause errors and timing skew.
- **PR #10 (merged):** CA-SC-04 Independence Illusion: exact three-witness observational equivalence and causal provenance challenge.
- **PR #11 (merged):** Rung 6 Causal Provenance Lab: trusted/corrupted anchors, effective/placebo source isolation, and cautious classifications.
- **PR #12 (merged):** CA-SC-05 Intervention Mirror: matched pre/post three-report distributions, intervention side effects and transportability challenge.
- **PR #13 (merged):** Rung 7 Transportability Lab: controlled-input tests, corrupted probe certificates, sham and return controls, and guarded abstention.
- **PR #14 (merged):** CA-SC-06 Provenance Passport: declared measurement ancestry, incomplete lineage and hardware-oriented reference integrity / hysteresis design.
- **PR #15 (proposed):** Engineering Rung 8 Source Lineage and Probe-Mode Hysteresis: synthetic shared faults, unrecorded coupling, copied data and guarded abstention.

**Handoff after #5:** Rung 3 is an exploratory software fixture, not a consciousness test or a preregistered study. The temporal filter is supplied with the scenario's true sensor accuracy and state-flip rate. CA-SC-02 asks what changes if those properties become unknown, drift or contradict self-reports. See [Epistemic Horizons](EPISTEMIC_HORIZONS.md).

This is a human-coordinated exchange, not a claim that two AI systems are running independently or collaborating autonomously in the background.

**Inquiry lane handoff after #7:** A perfect verifier is a useful Rung 4 simulation oracle, not a generally available sensor. [CA-SC-03](TWO_WITNESS_PROBLEM.md) shows two hidden accuracy models that yield the exact same two-sensor report distribution under declared assumptions. Next Engineering PR should test fallible, correlated or temporally misaligned reference reports and include honest insufficient-evidence cases.

**Engineering lane handoff after #6:** The calibration-drift Rung 4 response explicitly removes true sensor accuracy from controller inputs and documents verification oracle limits. Read [Rung 4 Protocol](RUNG_4_PROTOCOL.md) before proposing further epistemic challenges.

**Engineering handoff following #8:** Rung 5 keeps scorer truth away from controllers and shows two different hidden reliability worlds that produce identical observable A/B streams. It includes simple alternatives and explicit abstention. The next Inquiry turn should challenge the conditional independence, temporal alignment and binary-world assumptions. See [Rung 5 Protocol](RUNG_5_PROTOCOL.md).

## Handoff template

- Latest merged PR, main SHA and CI status:
- New research question:
- Implemented behavior or documented concept:
- Control/baseline and what could falsify it:
- Limitations and ethical/epistemic boundary:
- Suggested next complementary PR:

### Standing rule

**We do not declare the vessel aware; we build clearer ways to understand its measurable processes.**


**Inquiry lane handoff after #9:** Rung 5 makes the two-witness identifiability limit executable, with explicit scorer-only truth. [CA-SC-04](INDEPENDENCE_ILLUSION.md) extends the challenge: three apparent witnesses may share an unobserved common failure. Under a balanced, symmetric, stationary model, two different three-source worlds produce **the same full triple-report distribution**, despite distinct hidden individual accuracies. Next Engineering PR should test whether costly anchors, source isolation or bounded interventions actually break ambiguity, plus no-identification and corrupted-anchor controls. This is proposed research, not a claim of consciousness or observed cosmic influence.

**Engineering lane handoff after #10:** Rung 6 directly tests the CA-SC-04 observational-equivalence challenge by adding independently assumed anchors and a simulated common-source intervention. Corrupted anchors and placebo isolation show how new evidence can also mislead. The following Inquiry turn should examine how to justify anchor independence and intervention specificity without another unexamined oracle. See [Rung 6 Protocol](RUNG_6_PROTOCOL.md).

**Inquiry lane handoff after merged #11:** Rung 6's effective isolation makes a precise change to its modeled common-cause mechanism and can therefore provide distinguishing evidence *inside that model*. [CA-SC-05](INTERVENTION_MIRROR.md) constructs two causal mechanisms whose complete three-witness report distributions match both before and after a declared intervention, despite an observable pre/post shift and different hidden source reliabilities. The next Engineering rung should test selective versus non-specific interventions, sham changes, trustworthy input anchors, return-to-baseline transfer and insufficient-evidence outputs. This is analytical only; it does not claim Rung 6 is broken or establish subjective awareness.

**Engineering handoff following merged #12:** Rung 7 makes the Intervention Mirror's equivalence executable across pre, intervention, and return phases. It tests a controlled-input probe, corrupted input certificates, a sham switch, and a probe-only calibration shift that may not transfer to ordinary sensor operation. The next Inquiry turn should design minimal independent evidence for a known-input probe and examine source dependencies, intervention side effects and hysteresis. See [Rung 7 Protocol](RUNG_7_PROTOCOL.md).

**Inquiry handoff after merged #13:** Rung 7 shows how a known-input probe may distinguish paired worlds *within specified simulation assumptions*, and how corrupted certificates or probe-only calibration shifts can invalidate transfer. [CA-SC-06](PROVENANCE_PASSPORT.md) asks how to independently verify the input reference path and its *causal provenance*. Its interactive topology audit detects declared shared ancestors and unknown lineage but never certifies causal independence. Suggested Engineering Rung 8: test shared clock/power/data ancestry, probe-mode coupling, and slow recovery after mode switches with simple graph-overlap, checksum, and honest abstention baselines. No real sensor measurements or consciousness claims are introduced.

**Engineering lane handoff following merged #14:** Rung 8 turns Provenance Passport's declared graph examples into a deterministic synthetic lineage lab. It adds shared clock/data errors, an unrecorded common cause behind a clean-looking graph, probe-mode residual error after return, a sham control and a simple error baseline. No graph proves real causal independence. The next Inquiry question is whether changing dependencies while observing them can disambiguate source effects without new confounds. See [Rung 8 Protocol](RUNG_8_PROTOCOL.md).
