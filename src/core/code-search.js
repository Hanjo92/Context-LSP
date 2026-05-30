import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const EXCLUDED_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.context-lsp', 'generated']);
const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.py', '.go', '.rs', '.cs']);

export async function searchCodeRefs({ root, query, limit = 10 } = {}) {
  if (!root) return [];

  const projectRoot = resolve(root);
  const files = await listCodeFiles(projectRoot);
  const targetPaths = normalizeList(query?.target_paths || []);
  const terms = [...new Set([...(query?.terms || []), ...(query?.target_concepts || [])].map((term) => String(term).toLowerCase()))];
  const scored = [];

  for (const filePath of files) {
    const relativePath = relative(projectRoot, filePath);
    if (targetPaths.length > 0 && !targetPaths.some((target) => pathMatchesTarget(relativePath, target))) {
      continue;
    }

    const content = await readFile(filePath, 'utf8');
    const haystack = `${relativePath}\n${content}`.toLowerCase();
    const score = terms.reduce((total, term) => total + (term && haystack.includes(term) ? 1 : 0), 0);
    const targetPathBoost = targetPaths.length > 0 ? 1 : 0;
    const totalScore = score + targetPathBoost;
    if (totalScore === 0) continue;

    scored.push({
      path: filePath,
      relativePath,
      symbol: extractSymbol(content),
      confidence: totalScore >= 2 ? 'high' : 'medium',
      why_relevant: buildReason({ terms, relativePath, content, targetPaths })
    });
  }

  return scored
    .sort((a, b) => confidenceRank(b.confidence) - confidenceRank(a.confidence) || a.relativePath.localeCompare(b.relativePath))
    .slice(0, limit);
}

export async function listCodeFiles(root) {
  return listCodeFilesRecursive(resolve(root));
}

async function listCodeFilesRecursive(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      files.push(...await listCodeFilesRecursive(join(dir, entry.name)));
    } else if (entry.isFile() && CODE_EXTENSIONS.has(extname(entry.name))) {
      files.push(join(dir, entry.name));
    }
  }

  return files.sort();
}

function extractSymbol(content) {
  const patterns = [
    /export\s+function\s+([A-Za-z0-9_$]+)/,
    /export\s+class\s+([A-Za-z0-9_$]+)/,
    /export\s+const\s+([A-Za-z0-9_$]+)/,
    /function\s+([A-Za-z0-9_$]+)/
  ];
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function buildReason({ terms, relativePath, content, targetPaths }) {
  const lower = `${relativePath}\n${content}`.toLowerCase();
  const matchedTerms = terms.filter((term) => term && lower.includes(term));
  const reasons = matchedTerms.map((term) => `matches term: ${term}`);
  if (targetPaths.some((target) => pathMatchesTarget(relativePath, target))) {
    reasons.push('matches target path');
  }
  return reasons.join('; ') || 'matched code search';
}

function normalizeList(value) {
  if (value === undefined || value === null) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map((item) => String(item).replace(/^\.\//, '').replace(/\/$/, '')).filter(Boolean);
}

function confidenceRank(confidence) {
  return confidence === 'high' ? 2 : 1;
}

function pathMatchesTarget(relativePath, target) {
  return relativePath === target || relativePath.startsWith(`${target}/`);
}
