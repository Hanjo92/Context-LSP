import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createProjectSnapshot } from '../src/core/bootstrap.js';
import { searchCodeRefs } from '../src/core/code-search.js';
import { listGuarantees } from '../src/core/guarantees.js';
import { buildIndex } from '../src/core/indexer.js';
import { extractConstraints } from '../src/core/constraints.js';
import { initProjectBrain } from '../src/core/project-brain.js';
import { normalizeContextQuery, retrieveContextPack } from '../src/core/retriever.js';
import { analyzeRepository, reverseEngineerProject } from '../src/core/repository-analyzer.js';
import { verifyCodeDrift, verifyVault } from '../src/core/verify.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureVault = join(__dirname, 'fixtures', 'vault');
const brokenVault = join(__dirname, 'fixtures', 'broken-vault');
const brokenFragmentVault = join(__dirname, 'fixtures', 'broken-fragment-vault');
const duplicateIdVault = join(__dirname, 'fixtures', 'duplicate-id-vault');
const greenfieldRoot = join(__dirname, 'fixtures', 'greenfield');
const docsOnlyRoot = join(__dirname, 'fixtures', 'docs-only');
const brownfieldRoot = join(__dirname, 'fixtures', 'brownfield');
const codeRefsRoot = join(__dirname, 'fixtures', 'code-refs');
const driftRoot = join(__dirname, 'fixtures', 'drift-project');
const cliPath = resolve(__dirname, '..', 'src', 'cli.js');

test('buildIndex parses frontmatter, headings, and wikilinks', async () => {
  const index = await buildIndex({ docsDir: fixtureVault });

  assert.equal(index.documents.length, 5);
  assert.equal(index.duplicateIds.length, 0);
  assert.equal(index.brokenLinks.length, 0);

  const retrieverDoc = index.documentsById.get('MOD-CONTEXT-RETRIEVER');
  assert.equal(retrieverDoc.type, 'module');
  assert.deepEqual(retrieverDoc.headings, ['Context Retriever', '책임', '검증 방법']);
  assert.ok(retrieverDoc.wikilinks.some((link) => link.target === 'ADR-0001-context-pack'));
});

test('buildIndex reports broken wikilinks with source paths', async () => {
  const index = await buildIndex({ docsDir: brokenVault });

  assert.equal(index.documents.length, 1);
  assert.equal(index.brokenLinks.length, 2);
  assert.deepEqual(
    index.brokenLinks.map((link) => link.target).sort(),
    ['missing-adr', 'missing-note']
  );
  assert.ok(index.brokenLinks.every((link) => link.sourcePath.endsWith('00-index.md')));
});

test('buildIndex reports broken heading fragments when target document exists', async () => {
  const index = await buildIndex({ docsDir: brokenFragmentVault });

  assert.equal(index.brokenLinks.length, 0);
  assert.equal(index.brokenFragments.length, 1);
  assert.equal(index.brokenFragments[0].target, 'target-note');
  assert.equal(index.brokenFragments[0].section, 'Missing Heading');
  assert.ok(index.brokenFragments[0].sourcePath.endsWith('source-note.md'));
});

test('retrieveContextPack assembles relevant docs, constraints, confidence, and gaps', async () => {
  const index = await buildIndex({ docsDir: fixtureVault });
  const query = normalizeContextQuery({
    task: '구현 계획을 작성하기 전에 ContextPack을 검색해줘',
    task_type: 'plan',
    target_concepts: ['ContextPack', '계획']
  });

  const pack = await retrieveContextPack(index, query);

  assert.equal(pack.query.task_type, 'plan');
  assert.equal(pack.confidence, 'high');
  assert.equal(pack.gaps.length, 0);
  assert.ok(pack.documents.some((doc) => doc.id === 'SKILL-PLAN-WITH-PROJECT-BRAIN'));
  assert.ok(pack.documents.some((doc) => doc.id === 'ADR-0001'));
  assert.ok(pack.constraints.some((constraint) => constraint.level === 'must'));
  assert.ok(pack.constraints.some((constraint) => constraint.level === 'warn'));
});

test('searchCodeRefs ignores dependency, build, coverage, context, and generated directories', async () => {
  const query = normalizeContextQuery({
    task: '카카오 결제 어댑터 구현',
    task_type: 'code',
    target_concepts: ['kakao', 'payment']
  });

  const refs = await searchCodeRefs({ root: codeRefsRoot, query });

  assert.ok(refs.some((ref) => ref.relativePath === 'src/payments/kakao-payment.js'));
  assert.ok(refs.every((ref) => !ref.relativePath.startsWith('node_modules/')));
  assert.ok(refs.every((ref) => !ref.relativePath.startsWith('dist/')));
  assert.ok(refs.every((ref) => !ref.relativePath.startsWith('build/')));
  assert.ok(refs.every((ref) => !ref.relativePath.startsWith('coverage/')));
  assert.ok(refs.every((ref) => !ref.relativePath.startsWith('.context-lsp/')));
  assert.ok(refs.every((ref) => !ref.relativePath.startsWith('generated/')));
  assert.ok(refs.every((ref) => ref.confidence === 'high' || ref.confidence === 'medium'));
});

test('searchCodeRefs narrows target paths by path segment', async () => {
  const query = normalizeContextQuery({
    task: '카카오 결제 어댑터 구현',
    task_type: 'code',
    target_concepts: ['kakao', 'payment'],
    target_paths: ['src/payments']
  });

  const refs = await searchCodeRefs({ root: codeRefsRoot, query });

  assert.ok(refs.some((ref) => ref.relativePath === 'src/payments/kakao-payment.js'));
  assert.ok(refs.every((ref) => !ref.relativePath.startsWith('src/payments-old/')));
});

test('retrieveContextPack includes evidence-backed code_refs when root is provided', async () => {
  const index = await buildIndex({ docsDir: fixtureVault });
  const query = normalizeContextQuery({
    task: '카카오 결제 어댑터 구현',
    task_type: 'code',
    target_concepts: ['kakao', 'payment']
  });

  const pack = await retrieveContextPack(index, query, { root: codeRefsRoot });

  assert.ok(pack.code_refs.some((ref) => ref.relativePath === 'src/payments/kakao-payment.js'));
  assert.ok(pack.code_refs.some((ref) => ref.symbol === 'createKakaoPaymentAdapter'));
  assert.ok(pack.code_refs.every((ref) => ref.path.startsWith(codeRefsRoot)));
});

test('extractConstraints keeps source references and classifies must and warning rules', async () => {
  const index = await buildIndex({ docsDir: fixtureVault });
  const adr = index.documentsById.get('ADR-0001');

  const constraints = extractConstraints([adr]);

  assert.ok(constraints.some((constraint) => constraint.level === 'must'));
  assert.ok(constraints.some((constraint) => constraint.level === 'warn'));
  assert.ok(constraints.every((constraint) => constraint.source.path.endsWith('ADR-0001-context-pack.md')));
});

test('verifyVault returns warning-first findings for broken links without hard blocking', async () => {
  const index = await buildIndex({ docsDir: brokenVault });
  const findings = verifyVault(index);

  assert.equal(findings.length, 2);
  assert.ok(findings.every((finding) => finding.severity === 'warning'));
  assert.ok(findings.every((finding) => finding.kind === 'broken-wikilink'));
});

test('verifyVault returns warning-first findings for broken heading fragments', async () => {
  const index = await buildIndex({ docsDir: brokenFragmentVault });
  const findings = verifyVault(index);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'warning');
  assert.equal(findings[0].kind, 'broken-wikilink-fragment');
  assert.match(findings[0].message, /Missing Heading/);
});

test('verifyVault returns error findings for duplicate document ids', async () => {
  const index = await buildIndex({ docsDir: duplicateIdVault });
  const findings = verifyVault(index);

  assert.equal(index.duplicateIds.length, 1);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'error');
  assert.equal(findings[0].kind, 'duplicate-document-id');
  assert.match(findings[0].message, /DUPLICATE-ID/);
});

test('verifyCodeDrift reports changed code paths missing from planning trace links', async () => {
  const index = await buildIndex({ docsDir: join(driftRoot, 'docs', 'planning') });
  const findings = await verifyCodeDrift({
    index,
    root: driftRoot,
    changedPaths: ['src/payments/kakao-payment.js', 'src/users/profile.js']
  });

  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'warning');
  assert.equal(findings[0].kind, 'missing-code-trace');
  assert.match(findings[0].message, /src\/users\/profile\.js/);
  assert.ok(findings[0].evidence.some((item) => item.path.endsWith('src/users/profile.js')));
  assert.ok(findings[0].recommended_action);
});

test('verifyCodeDrift accepts repository scan input', async () => {
  const index = await buildIndex({ docsDir: join(driftRoot, 'docs', 'planning') });
  const findings = await verifyCodeDrift({
    index,
    root: driftRoot,
    scan: true
  });

  assert.ok(findings.some((finding) => finding.kind === 'missing-code-trace' && finding.message.includes('src/users/profile.js')));
});

test('verifyCodeDrift reports stale docs and constraint conflicts for changed code paths', async () => {
  const index = await buildIndex({ docsDir: join(driftRoot, 'docs', 'planning') });
  const findings = await verifyCodeDrift({
    index,
    root: driftRoot,
    changedPaths: ['src/legacy/payment-hack.js']
  });

  assert.ok(findings.some((finding) => finding.kind === 'stale-doc-for-code-path'));
  assert.ok(findings.some((finding) => finding.kind === 'constraint-conflict'));
  assert.ok(findings.every((finding) => finding.severity === 'warning'));
  assert.ok(findings.every((finding) => finding.message));
  assert.ok(findings.every((finding) => finding.evidence.length > 0));
  assert.ok(findings.some((finding) => finding.evidence.some((item) => item.trace_link?.source_line?.includes('implements [[module-legacy-payments]]'))));
  assert.ok(findings.every((finding) => finding.recommended_action));
});

test('CLI retrieve outputs a JSON ContextPack', () => {
  const output = execFileSync(
    process.execPath,
    [cliPath, 'retrieve', '--docs', fixtureVault, '--task', 'ContextPack 기반 구현 계획', '--type', 'plan'],
    { encoding: 'utf8' }
  );
  const pack = JSON.parse(output);

  assert.equal(pack.query.task_type, 'plan');
  assert.ok(pack.documents.length > 0);
  assert.ok(Array.isArray(pack.constraints));
});

test('CLI retrieve accepts root and target options for code_refs', () => {
  const output = execFileSync(
    process.execPath,
    [
      cliPath,
      'retrieve',
      '--docs',
      fixtureVault,
      '--root',
      codeRefsRoot,
      '--task',
      '카카오 결제 어댑터 구현',
      '--type',
      'code',
      '--concept',
      'kakao',
      '--concept',
      'payment',
      '--target',
      'src/payments'
    ],
    { encoding: 'utf8' }
  );
  const pack = JSON.parse(output);

  assert.ok(pack.code_refs.some((ref) => ref.relativePath === 'src/payments/kakao-payment.js'));
});

test('CLI verify accepts changed paths and returns code-doc drift findings', () => {
  const output = execFileSync(
    process.execPath,
    [
      cliPath,
      'verify',
      '--docs',
      join(driftRoot, 'docs', 'planning'),
      '--root',
      driftRoot,
      '--changed',
      'src/payments/kakao-payment.js',
      '--changed',
      'src/users/profile.js'
    ],
    { encoding: 'utf8' }
  );
  const findings = JSON.parse(output);

  assert.ok(findings.some((finding) => finding.kind === 'missing-code-trace'));
});

test('CLI verify warning findings do not hard block with non-zero exit', () => {
  const output = execFileSync(
    process.execPath,
    [
      cliPath,
      'verify',
      '--docs',
      join(driftRoot, 'docs', 'planning'),
      '--root',
      driftRoot,
      '--changed',
      'src/users/profile.js'
    ],
    { encoding: 'utf8' }
  );

  const findings = JSON.parse(output);
  assert.ok(findings.every((finding) => finding.severity === 'warning'));
});

test('createProjectSnapshot classifies empty, docs-only, and manifest projects', async () => {
  const greenfield = await createProjectSnapshot({ root: greenfieldRoot });
  assert.equal(greenfield.mode, 'greenfield');
  assert.equal(greenfield.docs_state, 'missing');
  assert.equal(greenfield.recommended_next_skill, 'init-project-brain');

  const docsOnly = await createProjectSnapshot({ root: docsOnlyRoot });
  assert.equal(docsOnly.mode, 'mixed');
  assert.equal(docsOnly.docs_state, 'ready');
  assert.equal(docsOnly.recommended_next_skill, 'context-bootstrap');

  const brownfield = await createProjectSnapshot({ root: brownfieldRoot });
  assert.equal(brownfield.mode, 'brownfield');
  assert.equal(brownfield.docs_state, 'missing');
  assert.equal(brownfield.recommended_next_skill, 'reverse-engineer-project');
  assert.ok(brownfield.evidence.some((item) => item.reason === 'package manifest exists'));
  assert.ok(brownfield.evidence.some((item) => item.reason === 'source directory exists'));
  assert.ok(brownfield.evidence.some((item) => item.reason === 'test directory exists'));
});

test('analyzeRepository reports brownfield structure with evidence', async () => {
  const analysis = await analyzeRepository({ root: brownfieldRoot });

  assert.equal(analysis.mode, 'brownfield');
  assert.ok(analysis.languages.some((language) => language.name === 'javascript' && language.confidence === 'confirmed'));
  assert.ok(analysis.manifests.some((manifest) => manifest.relativePath === 'package.json'));
  assert.ok(analysis.source_dirs.some((dir) => dir.relativePath === 'src'));
  assert.ok(analysis.entrypoints.some((entrypoint) => entrypoint.relativePath === 'src/index.js'));
  assert.ok(analysis.test_structure.paths.some((testPath) => testPath.relativePath === 'test'));
  assert.ok(analysis.evidence.every((item) => item.path && item.reason));
});

test('reverseEngineerProject creates an indexable Context Vault for brownfield repositories', async () => {
  const root = await mkdtemp(join(tmpdir(), 'context-lsp-brownfield-'));
  await cp(brownfieldRoot, root, { recursive: true });

  const result = await reverseEngineerProject({ root });
  const docsDir = join(root, 'docs', 'planning');
  const index = await buildIndex({ docsDir });
  const currentState = await readFile(join(docsDir, '00-current-state.md'), 'utf8');
  const repositoryOverview = await readFile(join(docsDir, '02-architecture', 'repository-overview.md'), 'utf8');
  const moduleMap = await readFile(join(docsDir, '02-architecture', 'module-map.md'), 'utf8');
  const testStructure = await readFile(join(docsDir, '02-architecture', 'test-structure.md'), 'utf8');

  assert.ok(result.generated_docs.some((doc) => doc.relativePath === '02-architecture/repository-overview.md'));
  assert.equal(index.brokenLinks.length, 0);
  assert.equal(index.brokenFragments.length, 0);
  assert.match(currentState, /status: confirmed/);
  assert.match(repositoryOverview, /package\.json/);
  assert.match(repositoryOverview, /src\/index\.js/);
  assert.match(moduleMap, /`src\/index\.js` implements \[\[module-map]]/);
  assert.match(testStructure, /test\/index\.test\.js/);

  const pack = await retrieveContextPack(
    index,
    normalizeContextQuery({
      task: '기존 프로젝트 구조를 분석해 구현 계획을 준비한다',
      task_type: 'analyze',
      target_concepts: ['repository', 'module', 'test'],
      target_paths: ['src']
    }),
    { root }
  );
  assert.ok(pack.documents.some((doc) => doc.id === 'REPOSITORY-OVERVIEW'));
  assert.ok(pack.code_refs.some((ref) => ref.relativePath === 'src/index.js'));
});

test('initProjectBrain creates an indexable Context Vault for greenfield ideas', async () => {
  const root = await mkdtemp(join(tmpdir(), 'context-lsp-greenfield-'));
  const result = await initProjectBrain({
    root,
    name: 'Recipe Agent',
    idea: 'AI recipe assistant that plans meals from pantry ingredients.'
  });
  const docsDir = join(root, 'docs', 'planning');
  const index = await buildIndex({ docsDir });
  const productVision = await readFile(join(docsDir, '01-product', 'product-vision.md'), 'utf8');
  const systemOverview = await readFile(join(docsDir, '02-architecture', 'system-overview.md'), 'utf8');
  const moduleOverview = await readFile(join(docsDir, '03-modules', 'modules-overview.md'), 'utf8');
  const adr = await readFile(join(docsDir, '05-adrs', 'ADR-0001-initial-product-direction.md'), 'utf8');

  assert.ok(result.generated_docs.some((doc) => doc.relativePath === '00-agent-retrieval-map.md'));
  assert.ok(result.generated_docs.some((doc) => doc.relativePath === '01-product/product-vision.md'));
  assert.equal(index.brokenLinks.length, 0);
  assert.equal(index.brokenFragments.length, 0);
  assert.match(productVision, /Recipe Agent/);
  assert.match(productVision, /pantry ingredients/);
  assert.match(systemOverview, /ContextPack/);
  assert.match(moduleOverview, /MVP-MODULE/);
  assert.match(adr, /status: draft/);
  assert.match(adr, /Recipe Agent/);

  const pack = await retrieveContextPack(
    index,
    normalizeContextQuery({
      task: 'Recipe Agent 초기 구현 계획을 세운다',
      task_type: 'plan',
      target_concepts: ['Recipe Agent', 'MVP']
    })
  );
  assert.ok(pack.documents.some((doc) => doc.id === 'PRODUCT-VISION'));
});

test('CLI bootstrap outputs a ProjectSnapshot JSON document', () => {
  const output = execFileSync(
    process.execPath,
    [cliPath, 'bootstrap', '--root', brownfieldRoot],
    { encoding: 'utf8' }
  );
  const snapshot = JSON.parse(output);

  assert.equal(snapshot.mode, 'brownfield');
  assert.equal(snapshot.recommended_next_skill, 'reverse-engineer-project');
  assert.ok(snapshot.evidence.length >= 3);
});

test('CLI init-project-brain creates planning docs for a greenfield project', async () => {
  const root = await mkdtemp(join(tmpdir(), 'context-lsp-cli-greenfield-'));
  const output = execFileSync(
    process.execPath,
    [
      cliPath,
      'init-project-brain',
      '--root',
      root,
      '--name',
      'Habit Coach',
      '--idea',
      'A habit coaching app that turns goals into daily check-ins.'
    ],
    { encoding: 'utf8' }
  );
  const result = JSON.parse(output);
  const index = await buildIndex({ docsDir: join(root, 'docs', 'planning') });

  assert.equal(result.project.name, 'Habit Coach');
  assert.ok(result.generated_docs.some((doc) => doc.relativePath === '05-adrs/ADR-0001-initial-product-direction.md'));
  assert.equal(index.brokenLinks.length, 0);
});

test('CLI init-project-brain resolves relative docs under the target root', async () => {
  const root = await mkdtemp(join(tmpdir(), 'context-lsp-cli-greenfield-docs-'));
  const output = execFileSync(
    process.execPath,
    [
      cliPath,
      'init-project-brain',
      '--root',
      root,
      '--docs',
      'docs/planning',
      '--name',
      'Field Notes',
      '--idea',
      'A field note app that turns observations into searchable project context.'
    ],
    { encoding: 'utf8' }
  );
  const result = JSON.parse(output);
  const docsDir = join(root, 'docs', 'planning');
  const index = await buildIndex({ docsDir });

  assert.equal(result.docs, docsDir);
  assert.ok(result.generated_docs.every((doc) => doc.path.startsWith(docsDir)));
  assert.equal(index.brokenLinks.length, 0);
});

test('CLI reverse-engineer creates planning docs for another brownfield project', async () => {
  const root = await mkdtemp(join(tmpdir(), 'context-lsp-cli-brownfield-'));
  await cp(brownfieldRoot, root, { recursive: true });

  const output = execFileSync(
    process.execPath,
    [cliPath, 'reverse-engineer', '--root', root],
    { encoding: 'utf8' }
  );
  const result = JSON.parse(output);

  assert.equal(result.analysis.mode, 'brownfield');
  assert.ok(result.generated_docs.some((doc) => doc.relativePath === '00-index.md'));
  assert.ok(result.generated_docs.some((doc) => doc.relativePath === '02-architecture/module-map.md'));
});

test('listGuarantees returns only verification-backed implementation guarantees', () => {
  const guarantees = listGuarantees();

  assert.ok(guarantees.length >= 6);
  assert.ok(guarantees.every((guarantee) => guarantee.id.startsWith('G-')));
  assert.ok(guarantees.every((guarantee) => guarantee.status === 'verified'));
  assert.ok(guarantees.every((guarantee) => guarantee.verification.length > 0));
  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-INDEX-WIKILINKS'));
  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-HEADING-FRAGMENTS'));
  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-DUPLICATE-IDS'));
  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-WARNING-FIRST'));
});

test('CLI guarantees outputs the guarantee registry as JSON', () => {
  const output = execFileSync(process.execPath, [cliPath, 'guarantees'], { encoding: 'utf8' });
  const guarantees = JSON.parse(output);

  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-CONTEXTPACK'));
  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-CODE-REFS'));
  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-CODE-DOC-DRIFT'));
  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-BROWNFIELD-REVERSE-ENGINEER'));
  assert.ok(guarantees.some((guarantee) => guarantee.id === 'G-GREENFIELD-INIT-PROJECT-BRAIN'));
  assert.ok(guarantees.every((guarantee) => Array.isArray(guarantee.source_docs)));
});
