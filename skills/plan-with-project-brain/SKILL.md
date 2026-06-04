---
name: plan-with-project-brain
description: Use when writing an implementation plan that must respect Context-LSP planning docs, ADRs, module boundaries, and constraints.
---

# Plan With Project Brain

Use this skill when the user asks for an implementation plan or when code work needs a plan.

## CLI

Use `context-lsp` when it is installed globally or linked from this repo. In another project where the binary is missing, run the same command with `npx context-lsp@latest`.

## Workflow

1. Run `retrieve-project-context` for the request with `--type plan`.
2. Read related ADRs, modules, and skills from the returned `ContextPack`.
3. Write the plan with:
   - affected files or modules
   - constraints from the `ContextPack`
   - verification commands
   - required document updates
4. If gaps exist, state them as assumptions instead of silent decisions.

## Rules

- Do not write a plan that ignores must-level constraints.
- Do not include unrelated refactors.
- Prefer a small vertical slice over broad scaffolding.
