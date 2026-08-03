# Architecture

CompeteOS separates reusable workflow infrastructure from an entry-specific repository.

```text
CompeteOS harness
├── zero-dependency local CLI
├── canonical agent skills
├── stack decision records
├── deliverable generators
└── inert external-skill registry
          │
          └── creates and updates
                    │
                    ▼
Generated entry repository
├── project and brief records
├── optional selected project skills
├── implementation evidence
├── deck and demo plan
├── pitch
└── submission manifest
```

The harness never treats a generated project as its own source tree. `compete new` refuses non-empty targets, preventing accidental overwrite or mixing with existing work.

Strict mode copies no skills into the generated repository. Standard and reuse modes copy only reviewed core skills; no external skill is eligible unless it appears in the approved registry.
