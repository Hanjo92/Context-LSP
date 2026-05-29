# Context-LSP

Context-LSP is a Codex-centered context layer for project planning, code output, and architecture drift checks.

The current Phase 1 MVP implements local rag-lite over Markdown planning docs:

- index `docs/planning` by frontmatter, headings, wikilinks, and paths
- retrieve a JSON `ContextPack` for planning/code/review tasks
- extract source-backed `must`, `should`, and `warn` constraints
- report warning-first architecture findings
- expose bootstrap/index/retrieve/verify through a local CLI
- provide repo-local Codex skill scaffolding under `skills/`

## Commands

```bash
npm test
npm run verify

node src/cli.js bootstrap --root . --docs docs/planning
node src/cli.js index --docs docs/planning
node src/cli.js retrieve --docs docs/planning --task "기능 구현 계획 작성" --type plan
node src/cli.js verify --docs docs/planning
```

## Planning Vault

Start from:

- `docs/planning/00-index.md`
- `docs/planning/00-agent-retrieval-map.md`
- `docs/planning/02-architecture/interface-contracts.md`

The v1 guard is warning-first. Findings provide evidence and recommended actions but do not hard block changes.

