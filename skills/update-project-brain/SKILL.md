---
name: update-project-brain
description: Use when code, plans, or ADR decisions require updating Context-LSP planning docs and trace links.
---

# Update Project Brain

Use this skill when implementation changes make planning docs stale or incomplete.

## Workflow

1. Run `verify-architecture-drift` and collect findings.
2. Ask Context-LSP for minimal doc update recommendations:

```bash
context-lsp recommend-doc-updates --docs docs/planning --root . --changed <path-or-module>
```

3. Identify the smallest affected docs under `docs/planning`.
4. Update frontmatter, `Context Links`, module/skill responsibilities, or ADR references as needed.
5. If the change is a new durable decision, create an ADR instead of hiding it in a module note.
6. Re-run:

```bash
context-lsp verify --docs docs/planning
```

## Rules

- Do not rewrite unrelated planning docs.
- Do not mark inferred Brownfield facts as confirmed without evidence.
- Preserve wikilink traceability.
