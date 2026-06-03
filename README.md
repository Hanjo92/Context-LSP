# Context-LSP

Context-LSP is a Codex-centered context layer for project planning, ContextPack retrieval, and warning-first architecture drift checks.

The current Phase 1 MVP implements local rag-lite over Markdown planning docs:

- index `docs/planning` by frontmatter, headings, wikilinks, and paths
- retrieve a JSON `ContextPack` for planning/code/review tasks
- populate `ContextPack.code_refs` from local source files when `--root` is provided
- extract source-backed `must`, `should`, and `warn` constraints
- run warning-first output guard checks before code generation
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
node src/cli.js output-guard --docs docs/planning --root . --task "ContextPack 기반 코드 생성" --type code --target src/core/retriever.js --plan "Use retrieved ContextPack constraints before editing."
node src/cli.js verify --docs docs/planning
node src/cli.js verify --docs docs/planning --root . --changed src/core/retriever.js
node src/cli.js init-project-brain --root . --docs docs/planning --name "My Project" --idea "One sentence product idea"
node src/cli.js reverse-engineer --root . --docs docs/planning
node src/cli.js guarantees
```

## Cross-Project Testing

Install the CLI from this repository once:

```bash
npm link
```

Register the repo skills globally:

```bash
ln -sfn /Users/song/Projects/Context-LSP/skills/context-bootstrap ~/.codex/skills/context-bootstrap
ln -sfn /Users/song/Projects/Context-LSP/skills/init-project-brain ~/.codex/skills/init-project-brain
ln -sfn /Users/song/Projects/Context-LSP/skills/reverse-engineer-project ~/.codex/skills/reverse-engineer-project
ln -sfn /Users/song/Projects/Context-LSP/skills/retrieve-project-context ~/.codex/skills/retrieve-project-context
ln -sfn /Users/song/Projects/Context-LSP/skills/plan-with-project-brain ~/.codex/skills/plan-with-project-brain
ln -sfn /Users/song/Projects/Context-LSP/skills/generate-compliant-code ~/.codex/skills/generate-compliant-code
ln -sfn /Users/song/Projects/Context-LSP/skills/verify-architecture-drift ~/.codex/skills/verify-architecture-drift
ln -sfn /Users/song/Projects/Context-LSP/skills/update-project-brain ~/.codex/skills/update-project-brain
```

Then open another project and run:

```bash
context-lsp bootstrap --root . --docs docs/planning
context-lsp init-project-brain --root . --docs docs/planning --name "My Project" --idea "One sentence product idea"
context-lsp reverse-engineer --root . --docs docs/planning
context-lsp retrieve --docs docs/planning --root . --task "기능 구현 계획 작성" --type plan
context-lsp output-guard --docs docs/planning --root . --task "기능 구현" --type code --target src
context-lsp verify --docs docs/planning
```

If the other project has no `docs/planning` vault yet, start with `context-lsp bootstrap` and create the vault before retrieval/verification.

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
