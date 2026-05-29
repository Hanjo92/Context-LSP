---
name: verify-architecture-drift
description: Use after code or planning document changes to run Context-LSP warning-first architecture drift checks.
---

# Verify Architecture Drift

Use this skill after implementation, documentation changes, or review preparation.

## Workflow

1. Run:

```bash
node src/cli.js verify --docs docs/planning
```

2. Read each `VerificationFinding`.
3. Treat `warning` findings as evidence-backed review items, not automatic hard blocks.
4. If a finding requires a document update, use `update-project-brain`.

## Rules

- Do not claim architecture alignment without running verification.
- Do not convert warning-first findings into hard blocks unless the user asks.
- Keep evidence paths in the final report.

