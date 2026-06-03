---
name: generate-compliant-code
description: Use before generating or modifying code when Context-LSP constraints, target paths, and warning-first output guard checks must be respected.
---

# Generate Compliant Code

Use this skill after `retrieve-project-context` and before code edits that must respect Context-LSP planning docs.

## Workflow

1. Retrieve code context for the task:

```bash
context-lsp retrieve --docs docs/planning --root . --task "<task>" --type code --target <path-or-module>
```

2. Run the warning-first output guard:

```bash
context-lsp output-guard --docs docs/planning --root . --task "<task>" --type code --target <path-or-module> --plan "<implementation-plan>"
```

3. Read `findings`, `evidence`, `recommended_action`, and `alternative`.
4. Adjust the implementation plan or target paths when the guard reports warnings.
5. Make only the scoped code changes.
6. Run:

```bash
context-lsp verify --docs docs/planning --root . --changed <path-or-module>
```

## Rules

- Do not treat output-guard warnings as hard blocks unless the user asks.
- Do not ignore a warning without recording the assumption or alternative.
- Do not generate code for target paths absent from the retrieved ContextPack without retrieving narrower context first.
- Keep unrelated refactors out of the code change.
