const GUARANTEES = [
  {
    id: 'G-BOOTSTRAP-SNAPSHOT',
    status: 'verified',
    statement: 'CLI and core can classify greenfield, brownfield, and mixed project states as ProjectSnapshot JSON.',
    verification: ['npm test', 'test/context-lsp.test.js:createProjectSnapshot classifies empty, docs-only, and manifest projects'],
    implementation_refs: ['src/core/bootstrap.js', 'src/cli.js'],
    source_docs: ['docs/planning/03-modules/module-context-bootstrap.md', 'docs/planning/05-adrs/ADR-0004-greenfield-and-brownfield-bootstrap.md'],
    limitations: ['Language/framework inference is intentionally shallow in Phase 1.']
  },
  {
    id: 'G-INDEX-WIKILINKS',
    status: 'verified',
    statement: 'The indexer parses Markdown frontmatter, headings, file paths, and Obsidian wikilinks.',
    verification: ['npm test', 'test/context-lsp.test.js:buildIndex parses frontmatter, headings, and wikilinks'],
    implementation_refs: ['src/core/indexer.js', 'src/core/markdown.js'],
    source_docs: ['docs/planning/03-modules/module-context-indexer.md', 'docs/planning/02-architecture/retrieval-pipeline.md'],
    limitations: ['YAML parsing supports the simple frontmatter shape used by the planning vault.']
  },
  {
    id: 'G-BROKEN-LINK-FINDINGS',
    status: 'verified',
    statement: 'Broken wikilinks are reported with source paths and warning-first VerificationFinding records.',
    verification: ['npm test', 'test/context-lsp.test.js:buildIndex reports broken wikilinks with source paths', 'test/context-lsp.test.js:verifyVault returns warning-first findings for broken links without hard blocking'],
    implementation_refs: ['src/core/indexer.js', 'src/core/verify.js'],
    source_docs: ['docs/planning/06-validation/retrieval-quality-checklist.md', 'docs/planning/03-modules/module-drift-detector.md'],
    limitations: ['Missing target documents and missing target headings are reported separately.']
  },
  {
    id: 'G-DUPLICATE-IDS',
    status: 'verified',
    statement: 'Duplicate document ids are reported as error-level VerificationFinding records.',
    verification: ['npm test', 'test/context-lsp.test.js:verifyVault returns error findings for duplicate document ids'],
    implementation_refs: ['src/core/indexer.js', 'src/core/verify.js'],
    source_docs: ['docs/planning/03-modules/module-context-indexer.md', 'docs/planning/06-validation/retrieval-quality-checklist.md'],
    limitations: ['The duplicate report keeps the first conflicting pair for each repeated id.']
  },
  {
    id: 'G-HEADING-FRAGMENTS',
    status: 'verified',
    statement: 'The runtime indexer detects wikilinks whose target document exists but heading fragment is missing.',
    verification: ['npm test', 'test/context-lsp.test.js:buildIndex reports broken heading fragments when target document exists', 'test/context-lsp.test.js:verifyVault returns warning-first findings for broken heading fragments'],
    implementation_refs: ['src/core/indexer.js', 'src/core/verify.js'],
    source_docs: ['docs/planning/06-validation/retrieval-quality-checklist.md', 'docs/planning/06-validation/implementation-guarantees.md'],
    limitations: ['Heading matching is exact text matching in Phase 1.']
  },
  {
    id: 'G-CONTEXTPACK',
    status: 'verified',
    statement: 'The retriever normalizes ContextQuery input and assembles ContextPack JSON with documents, constraints, trace links, confidence, and gaps.',
    verification: ['npm test', 'test/context-lsp.test.js:retrieveContextPack assembles relevant docs, constraints, confidence, and gaps', 'test/context-lsp.test.js:CLI retrieve outputs a JSON ContextPack'],
    implementation_refs: ['src/core/retriever.js', 'src/cli.js'],
    source_docs: ['docs/planning/02-architecture/interface-contracts.md', 'docs/planning/03-modules/module-context-retriever.md'],
    limitations: ['Retrieval is local rag-lite, not embedding-based semantic search.']
  },
  {
    id: 'G-CONSTRAINT-SOURCES',
    status: 'verified',
    statement: 'Constraint extraction classifies must/should/warn rules and preserves source path references.',
    verification: ['npm test', 'test/context-lsp.test.js:extractConstraints keeps source references and classifies must and warning rules'],
    implementation_refs: ['src/core/constraints.js'],
    source_docs: ['docs/planning/03-modules/module-constraint-extractor.md', 'docs/planning/02-architecture/interface-contracts.md'],
    limitations: ['Constraint extraction is pattern-based and intentionally conservative.']
  },
  {
    id: 'G-WARNING-FIRST',
    status: 'verified',
    statement: 'Phase 1 verification reports architecture findings without hard-blocking user work.',
    verification: ['npm test', 'npm run verify', 'test/context-lsp.test.js:verifyVault returns warning-first findings for broken links without hard blocking'],
    implementation_refs: ['src/core/verify.js', 'src/cli.js'],
    source_docs: ['docs/planning/05-adrs/ADR-0006-warning-first-architecture-guard.md', 'docs/planning/03-modules/module-output-guard.md'],
    limitations: ['Non-zero exit policy is currently reserved for CLI/runtime errors, not warning findings.']
  },
  {
    id: 'G-PLUGIN-SCAFFOLD',
    status: 'verified',
    statement: 'The repo contains a valid Codex plugin manifest and skill docs that reference CLI workflows.',
    verification: ['python3 /Users/song/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /Users/song/Projects/Context-LSP'],
    implementation_refs: ['.codex-plugin/plugin.json', 'skills/context-bootstrap/SKILL.md', 'skills/retrieve-project-context/SKILL.md', 'skills/plan-with-project-brain/SKILL.md', 'skills/verify-architecture-drift/SKILL.md', 'skills/update-project-brain/SKILL.md'],
    source_docs: ['docs/planning/04-skills/skills-overview.md', 'docs/planning/02-architecture/codex-runtime-and-agent-policy.md'],
    limitations: ['The plugin is repo-local, not marketplace-published, and skill workflows are documented rather than end-to-end executed in tests.']
  }
];

export function listGuarantees() {
  return GUARANTEES.map((guarantee) => ({
    ...guarantee,
    verification: [...guarantee.verification],
    implementation_refs: [...guarantee.implementation_refs],
    source_docs: [...guarantee.source_docs],
    limitations: [...guarantee.limitations]
  }));
}
