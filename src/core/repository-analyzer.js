import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { createProjectSnapshot } from './bootstrap.js';
import { listCodeFiles } from './code-search.js';

const MANIFESTS = ['package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'pom.xml', 'build.gradle'];
const SOURCE_DIRS = ['src', 'lib', 'app', 'packages'];
const TEST_DIRS = ['test', 'tests', '__tests__', 'spec'];
const LANGUAGE_BY_MANIFEST = {
  'package.json': 'javascript',
  'pyproject.toml': 'python',
  'Cargo.toml': 'rust',
  'go.mod': 'go',
  'pom.xml': 'java',
  'build.gradle': 'java'
};
const LANGUAGE_BY_EXTENSION = {
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.py': 'python',
  '.rs': 'rust',
  '.go': 'go',
  '.java': 'java',
  '.cs': 'csharp'
};

export async function analyzeRepository({ root = process.cwd() } = {}) {
  const projectRoot = resolve(root);
  const snapshot = await createProjectSnapshot({ root: projectRoot });
  const manifests = existingPaths(projectRoot, MANIFESTS).map((item) => evidenceItem(item, 'dependency manifest'));
  const sourceDirs = existingPaths(projectRoot, SOURCE_DIRS).map((item) => evidenceItem(item, 'source directory'));
  const testDirs = existingPaths(projectRoot, TEST_DIRS).map((item) => evidenceItem(item, 'test directory'));
  const codeFiles = await listCodeFiles(projectRoot);
  const codeFileRecords = codeFiles.map((path) => ({
    path,
    relativePath: normalizeRelative(projectRoot, path)
  }));
  const sourceFiles = codeFileRecords.filter((file) => !isTestPath(file.relativePath));
  const testFiles = codeFileRecords.filter((file) => isTestPath(file.relativePath));
  const packageMetadata = await readPackageMetadata(projectRoot);
  const languages = inferLanguages({ manifests, codeFiles: codeFileRecords });
  const frameworks = inferFrameworks(packageMetadata);
  const entrypoints = inferEntrypoints(sourceFiles);
  const modules = inferModules(sourceDirs, sourceFiles);
  const testStructure = {
    paths: testDirs,
    files: testFiles.map((file) => evidenceItem(file, 'test file')),
    runner: inferTestRunner(packageMetadata)
  };
  const evidence = [
    ...manifests,
    ...sourceDirs,
    ...testDirs,
    ...entrypoints.map((entrypoint) => ({ path: entrypoint.path, relativePath: entrypoint.relativePath, reason: 'entrypoint candidate' })),
    ...testStructure.files
  ];

  return {
    root: projectRoot,
    mode: snapshot.mode,
    docs_state: snapshot.docs_state,
    manifests,
    languages,
    frameworks,
    source_dirs: sourceDirs,
    entrypoints,
    test_structure: testStructure,
    modules,
    assumptions: buildAssumptions({ modules, frameworks, testStructure }),
    evidence
  };
}

export async function reverseEngineerProject({ root = process.cwd(), docs, overwrite = false } = {}) {
  const projectRoot = resolve(root);
  const docsDir = resolve(docs || join(projectRoot, 'docs', 'planning'));
  const analysis = await analyzeRepository({ root: projectRoot });
  const documents = brownfieldDocuments(analysis);
  const generatedDocs = [];

  for (const document of documents) {
    const path = join(docsDir, document.relativePath);
    const action = await writeDocument({ path, content: document.content, overwrite });
    generatedDocs.push({ path, relativePath: document.relativePath, action });
  }

  return {
    root: projectRoot,
    docs: docsDir,
    analysis,
    generated_docs: generatedDocs
  };
}

function existingPaths(root, names) {
  return names
    .map((name) => ({ name, path: resolve(root, name), relativePath: name }))
    .filter((item) => existsSync(item.path));
}

function evidenceItem(item, reason) {
  return {
    path: item.path,
    relativePath: item.relativePath,
    reason,
    confidence: 'confirmed'
  };
}

function normalizeRelative(root, path) {
  return relative(root, path).replace(/\\/g, '/');
}

async function readPackageMetadata(root) {
  const packagePath = resolve(root, 'package.json');
  if (!existsSync(packagePath)) return null;
  try {
    return JSON.parse(await readFile(packagePath, 'utf8'));
  } catch {
    return null;
  }
}

function inferLanguages({ manifests, codeFiles }) {
  const byName = new Map();
  for (const manifest of manifests) {
    const name = basename(manifest.relativePath);
    const language = LANGUAGE_BY_MANIFEST[name];
    if (language) byName.set(language, languageRecord(language, 'confirmed', manifest.relativePath));
  }

  for (const file of codeFiles) {
    const language = LANGUAGE_BY_EXTENSION[extname(file.relativePath)];
    if (language && !byName.has(language)) byName.set(language, languageRecord(language, 'assumed', file.relativePath));
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function languageRecord(name, confidence, evidencePath) {
  return {
    name,
    confidence,
    evidence: [{ path: evidencePath }]
  };
}

function inferFrameworks(packageMetadata) {
  if (!packageMetadata) return [];
  const dependencies = {
    ...packageMetadata.dependencies,
    ...packageMetadata.devDependencies
  };
  const known = ['next', 'react', 'vue', 'svelte', 'express', 'vite'];
  return known
    .filter((name) => dependencies?.[name])
    .map((name) => ({
      name,
      confidence: 'confirmed',
      evidence: [{ path: 'package.json' }]
    }));
}

function inferEntrypoints(sourceFiles) {
  const preferred = ['src/index.js', 'src/index.ts', 'src/main.js', 'src/main.ts', 'src/app.js', 'src/app.ts'];
  const selected = preferred
    .map((path) => sourceFiles.find((file) => file.relativePath === path))
    .filter(Boolean);
  const entrypoints = selected.length > 0 ? selected : sourceFiles.slice(0, 1);
  return entrypoints.map((file) => ({
    path: file.path,
    relativePath: file.relativePath,
    confidence: selected.length > 0 ? 'confirmed' : 'assumed'
  }));
}

function inferModules(sourceDirs, sourceFiles) {
  const modules = [];
  for (const sourceDir of sourceDirs) {
    const filesInDir = sourceFiles.filter((file) => file.relativePath.startsWith(`${sourceDir.relativePath}/`));
    const childNames = [...new Set(filesInDir.map((file) => firstChildUnder(file.relativePath, sourceDir.relativePath)))].filter(Boolean);
    modules.push({
      name: sourceDir.relativePath,
      confidence: 'assumed',
      evidence: [{ path: sourceDir.relativePath }],
      code_paths: filesInDir.map((file) => file.relativePath),
      children: childNames
    });
  }
  return modules;
}

function firstChildUnder(relativePath, rootDir) {
  const rest = relativePath.slice(rootDir.length + 1);
  return rest.split('/')[0];
}

function isTestPath(relativePath) {
  return TEST_DIRS.some((dir) => relativePath === dir || relativePath.startsWith(`${dir}/`)) || /\.(test|spec)\.[A-Za-z0-9]+$/.test(relativePath);
}

function inferTestRunner(packageMetadata) {
  if (!packageMetadata?.scripts?.test) return 'unknown';
  return packageMetadata.scripts.test;
}

function buildAssumptions({ modules, frameworks, testStructure }) {
  const assumptions = [];
  if (modules.length > 0) assumptions.push('Source directory names are module boundary candidates, not confirmed architecture boundaries.');
  if (frameworks.length === 0) assumptions.push('No framework dependency was confirmed from package metadata.');
  if (testStructure.files.length === 0) assumptions.push('No test files were found by the Phase 1 analyzer.');
  return assumptions;
}

async function writeDocument({ path, content, overwrite }) {
  await mkdir(dirname(path), { recursive: true });
  const existed = existsSync(path);
  if (existed && !overwrite) return 'skipped';
  await writeFile(path, content, 'utf8');
  return existed ? 'updated' : 'created';
}

function brownfieldDocuments(analysis) {
  return [
    doc('00-index.md', indexDoc()),
    doc('00-current-state.md', currentStateDoc(analysis)),
    doc('02-architecture/repository-overview.md', repositoryOverviewDoc(analysis)),
    doc('02-architecture/module-map.md', moduleMapDoc(analysis)),
    doc('02-architecture/test-structure.md', testStructureDoc(analysis)),
    doc('02-architecture/architecture-assumptions.md', architectureAssumptionsDoc(analysis))
  ];
}

function doc(relativePath, content) {
  return { relativePath, content };
}

function indexDoc() {
  return `---
id: INDEX
type: index
status: confirmed
related_adrs: []
related_skills: []
---

> Context Links: [[00-current-state]] · [[repository-overview]] · [[module-map]] · [[test-structure]]

# Brownfield Context Vault

이 볼트는 기존 저장소를 역분석해 생성한 초기 Context Vault다.

## 시작점

- 현재 상태: [[00-current-state]]
- 저장소 개요: [[repository-overview]]
- 모듈 맵: [[module-map]]
- 테스트 구조: [[test-structure]]
- 아키텍처 가정: [[architecture-assumptions]]
`;
}

function currentStateDoc(analysis) {
  return `---
id: CURRENT-STATE
type: state
status: confirmed
related_adrs: []
related_skills: []
---

> Context Links: [[00-index]] · [[repository-overview]] · [[module-map]] · [[architecture-assumptions]]

# 현재 상태

## 판별

- 모드: ${analysis.mode}
- 문서 상태: ${analysis.docs_state}
- 분석 기준: evidence-backed brownfield reverse engineering

## 확인된 근거

${listEvidence(analysis.evidence)}
`;
}

function repositoryOverviewDoc(analysis) {
  return `---
id: REPOSITORY-OVERVIEW
type: architecture
status: confirmed
related_adrs: []
related_skills: []
---

> Context Links: [[00-index]] · [[00-current-state]] · [[module-map]] · [[test-structure]]

# Repository Overview

## Manifests

${listRecords(analysis.manifests, 'No dependency manifest was found.')}

## Languages

${analysis.languages.map((language) => `- ${language.name}: ${language.confidence}, evidence ${language.evidence.map((item) => `\`${item.path}\``).join(', ')}`).join('\n') || '- unknown'}

## Frameworks

${analysis.frameworks.map((framework) => `- ${framework.name}: ${framework.confidence}`).join('\n') || '- unknown'}

## Entrypoints

${listRecords(analysis.entrypoints, 'No entrypoint candidate was found.')}
`;
}

function moduleMapDoc(analysis) {
  const traceLines = analysis.modules
    .flatMap((module) => module.code_paths.map((path) => `- \`${path}\` implements [[module-map]]`))
    .join('\n');

  return `---
id: MODULE-MAP
type: architecture
status: draft
related_adrs: []
related_skills: []
---

> Context Links: [[00-index]] · [[repository-overview]] · [[architecture-assumptions]]

# Module Map

## Module Candidates

${analysis.modules.map((module) => `- ${module.name}: ${module.confidence}, evidence ${module.evidence.map((item) => `\`${item.path}\``).join(', ')}`).join('\n') || '- unknown'}

## TraceLinks

${traceLines || '- No code TraceLink candidates were found.'}
`;
}

function testStructureDoc(analysis) {
  const traceLines = analysis.test_structure.files
    .map((file) => `- \`${file.relativePath}\` verifies [[test-structure]]`)
    .join('\n');

  return `---
id: TEST-STRUCTURE
type: architecture
status: confirmed
related_adrs: []
related_skills: []
---

> Context Links: [[00-index]] · [[repository-overview]] · [[module-map]]

# Test Structure

## Test Directories

${listRecords(analysis.test_structure.paths, 'No test directory was found.')}

## Test Files

${listRecords(analysis.test_structure.files, 'No test file was found.')}

## Runner

- ${analysis.test_structure.runner}

## TraceLinks

${traceLines || '- No test TraceLink candidates were found.'}
`;
}

function architectureAssumptionsDoc(analysis) {
  return `---
id: ARCHITECTURE-ASSUMPTIONS
type: architecture
status: draft
related_adrs: []
related_skills: []
---

> Context Links: [[00-index]] · [[repository-overview]] · [[module-map]]

# Architecture Assumptions

이 문서는 확정 설계가 아니라 기존 코드에서 나온 가정과 unknown을 분리해 기록한다.

## Assumptions

${analysis.assumptions.map((assumption) => `- assumed: ${assumption}`).join('\n') || '- none'}

## Unknowns

- unknown: module ownership and architectural boundaries require human confirmation.
`;
}

function listRecords(records, fallback) {
  if (records.length === 0) return `- ${fallback}`;
  return records.map((record) => `- \`${record.relativePath}\`: ${record.confidence || 'confirmed'}`).join('\n');
}

function listEvidence(records) {
  if (records.length === 0) return '- No evidence found.';
  return records.map((record) => `- \`${record.relativePath}\`: ${record.reason}`).join('\n');
}
