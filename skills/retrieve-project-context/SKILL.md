---
name: retrieve-project-context
description: Use before planning, code output, or review to build a ContextPack from Context-LSP planning docs and local rag-lite retrieval.
---

# Retrieve Project Context

Use this skill to create a `ContextPack` before deciding implementation scope.

## CLI

Use `context-lsp` when it is installed globally or linked from this repo. In another project where the binary is missing, run the same command with `npx context-lsp@latest`.

## Workflow

1. Convert the user request into a short task sentence and task type: `plan`, `code`, `review`, `bootstrap`, `analyze`, `product`, or `docs-update`.
2. Run:

```bash
context-lsp retrieve --docs docs/planning --root . --task "<task>" --type <task-type>
```

3. Read `documents`, `constraints`, `confidence`, and `gaps`.
4. Carry the `constraints` into the next plan, code, or review step.

## Rules

- Do not finalize plans or code changes without a `ContextPack`.
- Treat `confidence: low` as a blocker for strong claims.
- Keep retrieved context scoped to the current task.
