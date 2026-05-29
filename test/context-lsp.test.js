import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createProjectSnapshot } from '../src/core/bootstrap.js';
import { buildIndex } from '../src/core/indexer.js';
import { extractConstraints } from '../src/core/constraints.js';
import { normalizeContextQuery, retrieveContextPack } from '../src/core/retriever.js';
import { verifyVault } from '../src/core/verify.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureVault = join(__dirname, 'fixtures', 'vault');
const brokenVault = join(__dirname, 'fixtures', 'broken-vault');
const greenfieldRoot = join(__dirname, 'fixtures', 'greenfield');
const docsOnlyRoot = join(__dirname, 'fixtures', 'docs-only');
const brownfieldRoot = join(__dirname, 'fixtures', 'brownfield');
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

test('retrieveContextPack assembles relevant docs, constraints, confidence, and gaps', async () => {
  const index = await buildIndex({ docsDir: fixtureVault });
  const query = normalizeContextQuery({
    task: '구현 계획을 작성하기 전에 ContextPack을 검색해줘',
    task_type: 'plan',
    target_concepts: ['ContextPack', '계획']
  });

  const pack = retrieveContextPack(index, query);

  assert.equal(pack.query.task_type, 'plan');
  assert.equal(pack.confidence, 'high');
  assert.equal(pack.gaps.length, 0);
  assert.ok(pack.documents.some((doc) => doc.id === 'SKILL-PLAN-WITH-PROJECT-BRAIN'));
  assert.ok(pack.documents.some((doc) => doc.id === 'ADR-0001'));
  assert.ok(pack.constraints.some((constraint) => constraint.level === 'must'));
  assert.ok(pack.constraints.some((constraint) => constraint.level === 'warn'));
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
