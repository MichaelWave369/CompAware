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
- **PR #7 (proposed):** Rung 4 calibration drift study, directly testing the CA-SC-02 challenge with delayed, priced common verifications and simple baselines.

**Handoff after #5:** Rung 3 is an exploratory software fixture, not a consciousness test or a preregistered study. The temporal filter is supplied with the scenario's true sensor accuracy and state-flip rate. CA-SC-02 asks what changes if those properties become unknown, drift or contradict self-reports. See [Epistemic Horizons](EPISTEMIC_HORIZONS.md).

This is a human-coordinated exchange, not a claim that two AI systems are running independently or collaborating autonomously in the background.

**Engineering lane handoff after #6:** The calibration-drift Rung 4 response explicitly removes true sensor accuracy from controller inputs and documents verification oracle limits. Read [Rung 4 Protocol](RUNG_4_PROTOCOL.md) before proposing further epistemic challenges.

## Handoff template

- Latest merged PR, main SHA and CI status:
- New research question:
- Implemented behavior or documented concept:
- Control/baseline and what could falsify it:
- Limitations and ethical/epistemic boundary:
- Suggested next complementary PR:

### Standing rule

**We do not declare the vessel aware; we build clearer ways to understand its measurable processes.**

