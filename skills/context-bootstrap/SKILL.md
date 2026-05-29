---
name: context-bootstrap
description: Use when starting Context-LSP work in a repository to classify project state as greenfield, brownfield, or mixed before planning or code changes.
---

# Context Bootstrap

Use this skill before implementation planning when the repository state is not yet classified.

## Workflow

1. Run:

```bash
node src/cli.js bootstrap --root . --docs docs/planning
```

2. Read the JSON `mode`, `docs_state`, and `evidence`.
3. If `docs_state` is `missing`, create or request a Context Vault before implementation.
4. If mode is `brownfield`, run repository analysis before assuming architecture rules.
5. If mode is `greenfield`, create planning docs before code generation.

## Rules

- Do not start code generation from an unclassified repository.
- Do not treat assumptions as confirmed without evidence.
- Use `docs/planning/00-agent-retrieval-map.md` as the next navigation document.

