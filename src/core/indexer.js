import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parseMarkdownFile } from './markdown.js';

const DEFAULT_EXCLUDES = new Set(['.git', 'node_modules', 'dist', 'coverage', '.context-lsp']);

export async function buildIndex({ docsDir, exclude = DEFAULT_EXCLUDES } = {}) {
  if (!docsDir) throw new Error('docsDir is required');

  const markdownFiles = await listMarkdownFiles(docsDir, exclude);
  const documents = [];
  const documentsById = new Map();
  const documentsByStem = new Map();
  const documentsByRelativePath = new Map();
  const duplicateIds = [];

  for (const filePath of markdownFiles) {
    const content = await readFile(filePath, 'utf8');
    const doc = parseMarkdownFile({ filePath, rootDir: docsDir, content });
    documents.push(doc);

    if (documentsById.has(doc.id)) {
      duplicateIds.push({ id: doc.id, paths: [documentsById.get(doc.id).path, doc.path] });
    } else {
      documentsById.set(doc.id, doc);
    }

    documentsByStem.set(doc.stem, doc);
    documentsByRelativePath.set(doc.relativePath.replace(/\.md$/, ''), doc);
  }

  const brokenLinks = findBrokenLinks(documents, {
    documentsByStem,
    documentsByRelativePath
  });

  return {
    root: docsDir,
    documents,
    documentsById,
    documentsByStem,
    documentsByRelativePath,
    duplicateIds,
    brokenLinks
  };
}

async function listMarkdownFiles(dir, exclude) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (exclude.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdownFiles(fullPath, exclude));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function findBrokenLinks(documents, lookup) {
  const broken = [];

  for (const doc of documents) {
    for (const link of doc.wikilinks) {
      if (!resolveDoc(link.target, lookup)) {
        broken.push({
          sourcePath: doc.path,
          sourceRelativePath: doc.relativePath,
          target: link.target,
          raw: link.raw
        });
      }
    }
  }

  return broken;
}

export function resolveDoc(target, { documentsByStem, documentsByRelativePath }) {
  if (!target) return null;
  const normalized = target.replace(/\.md$/, '');
  const basenameTarget = normalized.split('/').at(-1);
  return (
    documentsByRelativePath.get(normalized) ||
    documentsByStem.get(normalized) ||
    documentsByStem.get(basenameTarget) ||
    null
  );
}

export function serializeIndex(index) {
  return {
    root: index.root,
    documents: index.documents.map(summarizeDocument),
    duplicateIds: index.duplicateIds,
    brokenLinks: index.brokenLinks
  };
}

export function summarizeDocument(doc) {
  return {
    id: doc.id,
    type: doc.type,
    status: doc.status,
    path: doc.path,
    relativePath: doc.relativePath,
    title: doc.title,
    headings: doc.headings,
    wikilinks: doc.wikilinks
  };
}

export function pathFromRoot(root, filePath) {
  return relative(root, filePath);
}

