# Context-LSP

Context-LSP is a Codex-centered context layer for project planning, code output, and warning-first architecture context checks.

The current Phase 1 MVP implements local rag-lite over Markdown planning docs:

- index `docs/planning` by frontmatter, headings, wikilinks, and paths
- retrieve a JSON `ContextPack` for planning/code/review tasks
- populate `ContextPack.code_refs` from local source files when `--root` is provided
- extract source-backed `must`, `should`, and `warn` constraints
- report warning-first vault and code-doc drift findings
- expose bootstrap/index/retrieve/verify through a local CLI
- provide repo-local Codex skill scaffolding under `skills/`

## Commands

```bash
npm test
npm run verify

node src/cli.js bootstrap --root . --docs docs/planning
node src/cli.js index --docs docs/planning
node src/cli.js retrieve --docs docs/planning --task "기능 구현 계획 작성" --type plan
node src/cli.js retrieve --docs docs/planning --root . --task "ContextPack code refs" --type code --concept ContextPack --target src
node src/cli.js verify --docs docs/planning
node src/cli.js verify --docs docs/planning --root . --changed src/core/retriever.js
node src/cli.js guarantees
```

## Planning Vault

Start from:

- `docs/planning/00-index.md`
- `docs/planning/00-agent-retrieval-map.md`
- `docs/planning/02-architecture/interface-contracts.md`

The v1 guard is warning-first. Findings provide evidence and recommended actions but do not hard block changes.

## Guarantees

The current implementation guarantee registry is available in two forms:

- human-readable: `docs/planning/06-validation/implementation-guarantees.md`
- machine-readable: `node src/cli.js guarantees`
