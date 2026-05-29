import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const MANIFESTS = ['package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'pom.xml', 'build.gradle'];
const SOURCE_DIRS = ['src', 'lib', 'app', 'packages'];
const TEST_DIRS = ['test', 'tests', '__tests__', 'spec'];

export async function createProjectSnapshot({ root = process.cwd(), docs } = {}) {
  const projectRoot = resolve(root);
  const docsPath = resolve(docs || resolve(projectRoot, 'docs/planning'));

  const docsExists = existsSync(docsPath);
  const manifest = firstExisting(projectRoot, MANIFESTS);
  const sourceDir = firstExisting(projectRoot, SOURCE_DIRS);
  const testDir = firstExisting(projectRoot, TEST_DIRS);
  const gitDir = existsSync(resolve(projectRoot, '.git'));
  const visibleEntries = await countVisibleEntries(projectRoot);

  const hasCodeEvidence = Boolean(manifest || sourceDir || testDir);
  const mode = classifyMode({ docsExists, hasCodeEvidence, visibleEntries });

  return {
    root: projectRoot,
    mode,
    languages: inferLanguages(manifest),
    frameworks: [],
    entrypoints: sourceDir ? [{ path: sourceDir.path, confidence: 'assumed' }] : [],
    test_structure: {
      paths: testDir ? [testDir.path] : [],
      runner: 'unknown'
    },
    docs_state: docsExists ? 'ready' : 'missing',
    recommended_next_skill: recommendedSkill(mode, docsExists),
    evidence: [
      docsExists ? { path: docsPath, reason: 'planning docs exist' } : null,
      manifest ? { path: manifest.path, reason: 'package manifest exists' } : null,
      sourceDir ? { path: sourceDir.path, reason: 'source directory exists' } : null,
      testDir ? { path: testDir.path, reason: 'test directory exists' } : null,
      gitDir ? { path: resolve(projectRoot, '.git'), reason: 'git repository exists' } : null
    ].filter(Boolean)
  };
}

function classifyMode({ docsExists, hasCodeEvidence, visibleEntries }) {
  if (!docsExists && !hasCodeEvidence && visibleEntries === 0) return 'greenfield';
  if (!docsExists && hasCodeEvidence) return 'brownfield';
  if (docsExists && hasCodeEvidence) return 'brownfield';
  return 'mixed';
}

function recommendedSkill(mode, docsExists) {
  if (mode === 'greenfield') return 'init-project-brain';
  if (mode === 'brownfield' && !docsExists) return 'reverse-engineer-project';
  if (mode === 'brownfield') return 'retrieve-project-context';
  return 'context-bootstrap';
}

function firstExisting(root, names) {
  for (const name of names) {
    const path = resolve(root, name);
    if (existsSync(path)) return { name, path };
  }
  return null;
}

function inferLanguages(manifest) {
  if (!manifest) return [];
  if (manifest.name === 'package.json') return ['javascript'];
  if (manifest.name === 'pyproject.toml') return ['python'];
  if (manifest.name === 'Cargo.toml') return ['rust'];
  if (manifest.name === 'go.mod') return ['go'];
  return [];
}

async function countVisibleEntries(root) {
  try {
    const entries = await readdir(root);
    return entries.filter((entry) => !entry.startsWith('.') && entry !== 'node_modules').length;
  } catch {
    return 0;
  }
}

