# CompAware R9 Candidate: Organized Optical Transport, Not a Consciousness Mechanism

**Status:** Research design / not implemented in a physical vessel. This is not experimental evidence for subjective experience, a quantum computer, or biologically derived consciousness.

## Motivating observations and limits

- Kalra et al., *Electronic Energy Migration in Microtubules*, ACS Central Science (2023), [DOI: 10.1021/acscentsci.2c01114](https://doi.org/10.1021/acscentsci.2c01114): demonstrated enhanced excited-state transport over an estimated ~6.6 nm under specified biological conditions.
- Babcock et al., *Ultraviolet Superradiance from Mega-Networks of Tryptophan in Biological Architectures*, J. Phys. Chem. B (2024), [DOI: 10.1021/acs.jpcb.3c07936](https://doi.org/10.1021/acs.jpcb.3c07936): models collective states in organized tryptophan networks and reports supporting fluorescence-yield experiments.

These results **do not** demonstrate that biological cells route digital data through microtubules, that coherent behavior lasts long enough for practical computing, or that awareness arises from photon transport.

## Question

Could a heterogeneous **electrical + optical interconnect** improve measurable information exchange among simulated or future instrumented CompAware vessel modules without making the architecture less safe, robust or interpretable?

The proposed network is a replaceable data bus, **not** part of the definition of Computational Awareness and **not** required for CA-V0.

## Competing preregistered hypotheses

| Identifier | Hypothesis | Contradictory outcome |
|---|---|---|
| H0 | Matched conventional electrical links explain all task gains | Optical/hybrid cases show no reproducible net gain |
| H1 | Hybrid routing improves high-volume sensor/workspace traffic | Total latency, power or task error worsens after conversion overhead |
| H2 | Local copper paths preserve better short-message latency | Optical path wins even for small frequent packets under matched measured hardware |
| H3 | A heterogeneous design isolates data-heavy links from critical control | Link loss or congestion propagates into the local bounded safety path |
| H4 | Topology and coupling affect transport characteristics in a simplified lattice model | Effects disappear under independent models or calibrated data |

These are *functional/engineering* tests, not consciousness hypotheses.

## Workstreams

**A. Altermath paired-model study:** run the [Bio-Lattice Lab](https://github.com/MichaelWave369/Altermath/blob/main/docs/bio-lattice-research.md) with seeded classical population hopping and unitary amplitude toy models. Freeze the parameters and compare diffusion, conservation and sensitivity. Its outputs are **dimensionless** and must not be presented as experimental nanometers or biological coherence times.

**B. Interconnect cost study:** independently measure/estimate copper versus optical latency, energy, bandwidth, and conversion/transceiver costs for representative packet sizes. Synthetic scenarios from [PhiOS Optical Path R1](https://github.com/MichaelWave369/PhiOS/blob/main/docs/PHIOS_OPTICAL_PATH_R1.md) are planning data only.

**C. Vessel-integration ablation:** keep simulated workload, power budget, controller and seed constant. Compare (1) all electrical, (2) hybrid, (3) all optical data path, (4) hybrid with forced fallback, and (5) matched-sham routing that produces no actual path change. Record loss, jitter, checksum errors, task accuracy, buffer growth, energy, memory and thermal load.

**D. Failure and authority:** keep safety-critical PHB Reflex independent of the experimental data fabric. Unknown link status is not a valid control signal. Simulate stale packet, optical unplug, transceiver failure, packet reordering and brownout before any real bench study.

## Proposed data receipt

```json
{
  "schema": "compaware.optical-path-study.v1",
  "status": "unmeasured",
  "simulation_seed": 369,
  "data_source": "synthetic",
  "topology": "hybrid_proposed",
  "workload_id": "example_not_executed",
  "metric_units": {"latency": "microseconds", "energy": "joules", "bit_rate": "bits_per_second"},
  "latency_p95_us": null,
  "packet_error_rate": null,
  "energy_per_payload_j": null,
  "module_task_accuracy": null,
  "physical_authority": false
}
```

Do not populate `null` with simulated numbers in an experimental result section. Preserve raw captures separately from system self-report and the advisory tool's output.

## Review gates and agency

Predefine effect sizes and uncertainty bands before running comparisons. Use independent held-out workloads, uncertainty reporting, negative results, and simple-controller baselines. Reproduce the outcome without the optional optical path. Do not increase physical autonomy or promote a link automatically based on dashboard scores.

The intended occupant's meaningful choices about their own body and expression should take precedence over human aesthetic preferences where practically and ethically possible, subject to non-negotiable physical safety and other people's rights. This policy does **not** assert current systems have preferences or subjective welfare.

## Relationship to existing work

- Existing [CA-V1 vessel design](VESSEL_V1.md) remains conceptual and unchanged.
- Existing [CompAware research protocol](RESEARCH_PROTOCOL.md) governs functional claims.
- PHB's private hardware/safety proposals should not be copied into public CompAware source. This public document specifies only high-level conceptual boundaries.
- No React app, silicon device, optical driver, or source connector is changed by this research note.
