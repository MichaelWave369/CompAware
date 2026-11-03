# CA-SC-06 · The Provenance Problem
### When a "trusted" witness shares the machinery of what it verifies

**Lane:** Cosmos / Inquiry. Responds to [CA-Haven Rung 7](RUNG_7_PROTOCOL.md), merged PR #13.

**Status:** Conceptual provenance audit, source-graph examples and a proposed minimal physical protocol. **Not** an executed hardware test, independent registration, sensor validation, demonstration of awareness or proof of causal independence.

## 1. Why this rung

Rung 7 tests known-input probe certificates, tampered labels, probe-only calibration shift and return-to-baseline within a deliberately bounded simulator. It recognizes that an injected "known" bit only constrains a sensor's accuracy if the probe and certificate are trustworthy, and if the probe mode represents ordinary operation.

But how could we show a certificate is independent of the path under test?

A signature can establish who attested to the data **if key custody is sound**. It does not show that the signer's instrument measured the stated input, did not reuse an upstream source, or is free of a common failure. Likewise, two chips, two computers, or two clocks are not necessarily independent if they inherit common dependencies.

We propose a **Provenance Passport**: a machine-readable declared graph of acquisition paths and upstream dependencies, combined with physical negative controls that challenge the graph. The passport is a hypothesis inventory, **not a certificate of truth**.

## 2. Three epistemic states, none equal "verified independent"

The prototype interactive atlas takes two reading roots, follows all declared dependencies transitively, and returns:

- **DOCUMENTED_OVERLAP:** The two chains have at least one shared declared ancestor (common power, source data, timing, multiplexer, etc.). This creates a credible common-cause concern but does not prove an error has occurred.
- **INCOMPLETE_PROVENANCE:** Some upstream node or its parentage is missing, or a source is explicitly unknown. The independence question is unresolved.
- **NO_DOCUMENTED_OVERLAP:** The two declared dependency closures share no node. This is **not proof** of causal independence; hidden environmental coupling, misdrawn diagrams, shared components not recorded, or measurement bugs remain possible.

The function always reports `verifiedIndependent: false`. No amount of graph-traversal cleverness can certify a physical property from declarations alone.

Five examples in the React viewer: **shared clock/power**, **copied upstream data**, **documented separation**, **unknown certificate ancestry**, and **probe-mode multiplexer**. They illustrate reviewable topology only. None is measured from the user's computer.

## 3. Physical Rung 8 candidate: Independent Stimulus Ledger

An inexpensive, non-destructive, instrumentable prototype can use a controlled digital square-wave or randomized binary stimulus. Hardware and scheduling choices should be fixed after inventory, and electrical levels must be compatible with every connected input.

### Minimal block diagram (proposed)

```text
    Offline seeded stimulus schedule
                |
       Isolated output driver
          /             \
     Device-under-     Independent input
     test paths A/B/C  capture reference
          |             |
    Capture/log A/B/C  Recorder R
          \             /
        Signed, timestamped
      *separate* raw receipts
                |
      Offline blinded comparator
```

This drawing is an **independence target**, not a claim that the reference is electrically, temporally, or causally isolated. Inspect actual shared power rails, clock trees, firmware builds, source repositories, logging storage and any input preprocessor. A separate data logger is not necessarily a separate source of truth.

### Required protocol steps

1. **Build the source graph:** Inventory sensors, input stimulus, signal fan-out, ADCs, clock, power, firmware version/hash, logger process, file storage, cables and any upstream data supplier. Mark unknowns explicitly.
2. **Record an immutable plan:** Freeze the binary stimulus schedule generator, known input interpretation, intervention assignment, resource costs, expected error model and trial IDs *before* confirmatory evaluation. Commit hash alone does not provide independent preregistration.
3. **Keep the recorder separate:** Capture stimulus/input events on an independently specified route; log its configuration and any hidden common dependency. Supply only authorized A/B/C reports to candidate policies. Scorer sees recorder output only *after* action.
4. **Negative controls:** Create intentionally shared-clock/one-feed modes; use a copied-log reference that has different file signatures but identical measurement ancestry. Verify the audit flags those dependencies.
5. **Positive controls:** Software-inject known channel-local corruptions and known pre-fan-out common faults; check whether reference and policies react as predicted. No radiation source or destructive fault injection is needed.
6. **Randomized mode sequences:** Interleave normal, active probe, sham probe, return, and extended rest. Randomize order and record time since each switch.
7. **Hysteresis audit:** Compare equivalent stimulus/temperature/load contexts before and after switching modes. Ask whether effects depend on the *history of switching*, not just current mode; examine drift and washout.
8. **Blind comparison and reporting:** Independently inspect mismatch rates, delayed labels, missing events, false certainty, costs and provenance gaps. Compare with a single-source rule and an always-abstain baseline.
9. **Replicate with independent implementation:** Attempt to reproduce on a different recorder/logger path and document surviving shared dependencies. Don't claim isolation unless evidenced.

### Consent and safety

- Use only equipment and input lines authorized for this experiment. No uncontrolled changes to live network infrastructure, production hosts, or bystanders' devices.
- Validate voltage/current and galvanic-isolation needs before connecting physical circuits.
- Record no user-identifying telemetry. No background collection or network access is proposed.
- Synthetic fault injection is not cosmic radiation, pain, or evidence of computational consciousness.

## 4. The hysteresis trap

A bench may pass during the probe but fail again after the test fixture is removed.

Example alternative explanations include a temperature-sensitive offset, a filter that reinitializes only in test mode, buffered timestamps, or a power-state hysteresis that persists through some return trials. Therefore **one instantaneous "return to baseline" sample is not a transportability test**.

A prospective Rung 8 simulation should include at least:
- **CLEAN_REFERENCE:** independently modeled capture with correct timing and no shared upstream source.
- **COPY_REFERENCE:** a separate file or certificate derived from the same upstream bits.
- **SHARED_POWER_CLOCK:** an apparently independent reference that fails under common hardware dependencies.
- **MODE_COUPLING:** the probe changes the DUT readout calibration while normal mode remains unmodified.
- **HYSTERESIS:** an effect decays after return, so immediate return and later return differ.
- **UNKNOWN_LINEAGE:** the controller receives incomplete provenance metadata and must abstain from declaring independence.

These conditions are proposals. The current CA-Haven Rung 7 has not run them.

## 5. Candidate metrics and falsification

Report at least: observed disagreement; true mismatch against independently scored controlled input; missed faults; overconfident false source-independence claims; provenance-unknown rate; unnecessary abstention; intervention and recorder cost; resource budget; return-phase decay; and time alignment errors.

Compare against simple baselines such as direct checksum/sequence-number validation, shared-source detection, fixed windowed drift detection, and conservative fallback. All controls need matched observation permissions and documented costs. A richer model earns a claim only if it exceeds those alternatives on frozen, held-out criteria.

**Negative result:** If a basic dependency-graph check plus checksum and abstention performs as well as a complex provenance-aware estimator, publish that. The research still learns something: additional complexity was not justified for this task.

**Falsifiability gate:** If missing metadata is treated as evidence of independence, or if post-probe return is reported stable without enough time to expose decay, the controller fails a predeclared epistemic requirement regardless of its immediate task utility.

## 6. Human and cosmic interpretation

The ancient microcosm/macrocosm theme suggests a local system can encode a picture of a wider world. This is a philosophical analogy, not evidence that the cosmos is sentient or silicon has subjective experience.

The engineering version asks something narrower: **does the local representation preserve the lineage and limits of the evidence on which it depends?**

A machine can be precisely wrong about its own environment when its instruments share a hidden assumption. CA-SC-06 treats those assumptions as reviewable, testable parts of the architecture.

**Standing principle:** a trustworthy self-model can say `not enough verified evidence` instead of displaying an unjustified confidence percentage.

## Handoff to Engineering / Haven

**Suggested Rung 8:** Build a bounded, deterministic source-lineage and probe-mode experiment, with shared data ancestry, incomplete provenance, an ordinary-mode versus probe-mode comparison, and delayed hysteresis after return. Expose only authorized observable readings and the declared source graph; withhold hidden causal truth from the controller and score it independently. Include the simple graph-overlap baseline and an honest abstention condition.

**One-line challenge:** A sensor can be right about the bit it read while wrong about whether the measurement path can be trusted. How would the vessel discover the difference?
