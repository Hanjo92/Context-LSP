---
name: reverse-engineer-project
description: Use when an existing repository needs Context-LSP planning docs bootstrapped from code, manifests, tests, and evidence-backed architecture assumptions.
---

# Reverse Engineer Project

Use this skill when `context-bootstrap` reports a brownfield project with missing or incomplete `docs/planning`.

## CLI

Use `context-lsp` when it is installed globally or linked from this repo. In another project where the binary is missing, run the same command with `npx context-lsp@latest`.

## Workflow

1. Run:

```bash
context-lsp reverse-engineer --root . --docs docs/planning
```

2. Read the generated `analysis`, `generated_docs`, and evidence paths.
3. Inspect the generated docs:
   - `docs/planning/00-current-state.md`
   - `docs/planning/02-architecture/repository-overview.md`
   - `docs/planning/02-architecture/module-map.md`
   - `docs/planning/02-architecture/test-structure.md`
   - `docs/planning/02-architecture/architecture-assumptions.md`
4. Run:

```bash
context-lsp verify --docs docs/planning
```

5. Use `retrieve-project-context` before writing an implementation plan.

## Rules

- Treat generated module boundaries as candidates until a human confirms them.
- Do not overwrite existing planning docs unless the user explicitly asks for `--overwrite`.
- Keep confirmed claims tied to evidence paths.
