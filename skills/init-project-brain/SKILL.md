---
name: init-project-brain
description: Use when a greenfield project or product idea needs an initial Context-LSP planning vault before code generation.
---

# Init Project Brain

Use this skill when `context-bootstrap` reports a greenfield project or the user gives a new product idea that needs planning docs first.

## CLI

Use `context-lsp` when it is installed globally or linked from this repo. In another project where the binary is missing, run the same command with `npx context-lsp@latest`.

## Workflow

1. Extract a short project name and one-sentence idea from the user request.
2. Run:

```bash
context-lsp init-project-brain --root . --docs docs/planning --name "<project-name>" --idea "<product-idea>"
```

3. Inspect the generated docs:
   - `docs/planning/00-index.md`
   - `docs/planning/00-agent-retrieval-map.md`
   - `docs/planning/01-product/product-vision.md`
   - `docs/planning/02-architecture/system-overview.md`
   - `docs/planning/03-modules/modules-overview.md`
   - `docs/planning/05-adrs/ADR-0001-initial-product-direction.md`
4. Run:

```bash
context-lsp verify --docs docs/planning
```

5. Use `retrieve-project-context` before implementation planning.

## Rules

- Do not start boilerplate code before the initial Context Vault exists.
- Keep generated product, module, and ADR docs as draft until the user confirms them.
- Do not overwrite existing planning docs unless the user explicitly asks for `--overwrite`.
