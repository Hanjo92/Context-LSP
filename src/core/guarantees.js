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
    id: 'G-CODE-REFS',
    status: 'verified',
    statement: 'ContextPack retrieval can populate code_refs from repository source files using task concepts and target paths.',
    verification: ['npm test', 'test/context-lsp.test.js:searchCodeRefs ignores dependency, build, coverage, context, and generated directories', 'test/context-lsp.test.js:searchCodeRefs narrows target paths by path segment', 'test/context-lsp.test.js:retrieveContextPack includes evidence-backed code_refs when root is provided'],
    implementation_refs: ['src/core/code-search.js', 'src/core/retriever.js', 'src/cli.js'],
    source_docs: ['docs/planning/02-architecture/interface-contracts.md', 'docs/planning/03-modules/module-context-retriever.md'],
    limitations: ['Source symbol extraction is regex-based and supports common JavaScript export patterns first.', 'Code search excludes dependency, dist/build, coverage, generated, and .context-lsp directories by directory name.']
  },
  {
    id: 'G-CODE-DOC-DRIFT',
    status: 'verified',
    statement: 'Verification can report changed code paths that lack explicit planning TraceLinks and include retrieved TraceLink evidence for stale or conflicting planning docs.',
    verification: ['npm test', 'test/context-lsp.test.js:verifyCodeDrift reports changed code paths missing from planning trace links', 'test/context-lsp.test.js:verifyCodeDrift accepts repository scan input', 'test/context-lsp.test.js:verifyCodeDrift reports stale docs and constraint conflicts for changed code paths', 'test/context-lsp.test.js:CLI verify accepts changed paths and returns code-doc drift findings', 'test/context-lsp.test.js:CLI verify warning findings do not hard block with non-zero exit'],
    implementation_refs: ['src/core/verify.js', 'src/cli.js'],
    source_docs: ['docs/planning/03-modules/module-drift-detector.md', 'docs/planning/02-architecture/traceability-model.md'],
    limitations: ['Current drift detection checks explicit Markdown TraceLink lines and code-path mentions, not semantic architecture equivalence.']
  },
  {
    id: 'G-OUTPUT-GUARD',
    status: 'verified',
    statement: 'The output guard checks proposed code output against ContextPack constraints and returns source-backed warning findings with alternatives without hard blocking.',
    verification: ['npm test', 'test/context-lsp.test.js:guardOutput returns warning-first findings with source-backed alternatives', 'test/context-lsp.test.js:guardOutput normalizes target paths without substring false positives', 'test/context-lsp.test.js:guardOutput passes when target paths are represented and no constraints apply', 'test/context-lsp.test.js:CLI output-guard checks a proposed path against ContextPack constraints'],
    implementation_refs: ['src/core/output-guard.js', 'src/cli.js', 'skills/generate-compliant-code/SKILL.md'],
    source_docs: ['docs/planning/03-modules/module-output-guard.md', 'docs/planning/04-skills/skill-generate-compliant-code.md', 'docs/planning/06-validation/architecture-review-checklist.md'],
    limitations: ['v1 evaluates retrieved constraints and target path traceability; it does not prove semantic code compliance.']
  },
  {
    id: 'G-DOC-UPDATE-RECOMMENDER',
    status: 'verified',
    statement: 'The doc update recommender converts verification findings into minimal planning doc recommendations, TraceLink candidates, and ADR candidates.',
    verification: ['npm test', 'test/context-lsp.test.js:recommendDocUpdates converts drift findings into TraceLink and ADR suggestions', 'test/context-lsp.test.js:CLI recommend-doc-updates reports minimal document update suggestions'],
    implementation_refs: ['src/core/doc-update-recommender.js', 'src/cli.js', 'skills/update-project-brain/SKILL.md'],
    source_docs: ['docs/planning/03-modules/module-doc-update-recommender.md', 'docs/planning/04-skills/skill-update-project-brain.md', 'docs/planning/02-architecture/traceability-model.md'],
    limitations: ['Recommendations are drafts that require user approval before authoritative planning docs are changed.']
  },
  {
    id: 'G-BROWNFIELD-REVERSE-ENGINEER',
    status: 'verified',
    statement: 'The reverse-engineer flow can analyze an existing repository and create an indexable initial Context Vault with evidence-backed repository docs.',
    verification: ['npm test', 'test/context-lsp.test.js:analyzeRepository reports brownfield structure with evidence', 'test/context-lsp.test.js:reverseEngineerProject creates an indexable Context Vault for brownfield repositories', 'test/context-lsp.test.js:CLI reverse-engineer creates planning docs for another brownfield project'],
    implementation_refs: ['src/core/repository-analyzer.js', 'src/cli.js', 'skills/reverse-engineer-project/SKILL.md'],
    source_docs: ['docs/planning/04-skills/skill-reverse-engineer-project.md', 'docs/planning/03-modules/module-repository-analyzer.md'],
    limitations: ['Generated module boundaries are evidence-backed candidates, not confirmed architecture decisions.']
  },
  {
    id: 'G-GREENFIELD-INIT-PROJECT-BRAIN',
    status: 'verified',
    statement: 'The init-project-brain flow can create an indexable initial Context Vault from a greenfield product idea.',
    verification: ['npm test', 'test/context-lsp.test.js:initProjectBrain creates an indexable Context Vault for greenfield ideas', 'test/context-lsp.test.js:CLI init-project-brain creates planning docs for a greenfield project', 'test/context-lsp.test.js:CLI init-project-brain resolves relative docs under the target root'],
    implementation_refs: ['src/core/project-brain.js', 'src/cli.js', 'skills/init-project-brain/SKILL.md'],
    source_docs: ['docs/planning/04-skills/skill-init-project-brain.md', 'docs/planning/03-modules/module-context-vault-manager.md'],
    limitations: ['Generated product and module docs are drafts until the user confirms scope and technical decisions.']
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
    implementation_refs: ['.codex-plugin/plugin.json', 'skills/context-bootstrap/SKILL.md', 'skills/init-project-brain/SKILL.md', 'skills/reverse-engineer-project/SKILL.md', 'skills/retrieve-project-context/SKILL.md', 'skills/plan-with-project-brain/SKILL.md', 'skills/generate-compliant-code/SKILL.md', 'skills/verify-architecture-drift/SKILL.md', 'skills/update-project-brain/SKILL.md'],
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
