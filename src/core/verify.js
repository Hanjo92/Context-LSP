import { relative, resolve } from 'node:path';
import { listCodeFiles } from './code-search.js';

export function verifyVault(index) {
  const findings = [];

  for (const duplicate of index.duplicateIds) {
    findings.push({
      severity: 'error',
      kind: 'duplicate-document-id',
      message: `Duplicate document id: ${duplicate.id}`,
      evidence: duplicate.paths.map((path) => ({ path })),
      recommended_action: 'Give each planning document a unique frontmatter id.'
    });
  }

  for (const broken of index.brokenLinks) {
    findings.push({
      severity: 'warning',
      kind: 'broken-wikilink',
      message: `Broken wikilink [[${broken.raw}]] in ${broken.sourceRelativePath}`,
      evidence: [{ path: broken.sourcePath }],
      recommended_action: 'Create the target document or replace the placeholder with non-link text.'
    });
  }

  for (const broken of index.brokenFragments || []) {
    findings.push({
      severity: 'warning',
      kind: 'broken-wikilink-fragment',
      message: `Broken wikilink heading fragment [[${broken.raw}]] in ${broken.sourceRelativePath}`,
      evidence: [{ path: broken.sourcePath }, { path: broken.targetPath }],
      recommended_action: 'Update the heading fragment or rename the target heading to match the link.'
    });
  }

  return findings;
}

export async function verifyCodeDrift({ index, root, changedPaths = [], scan = false } = {}) {
  if (!root) return [];

  const paths = normalizeChangedPaths(
    changedPaths.length > 0
      ? changedPaths
      : scan
        ? await codeFilesRelativeToRoot(root)
        : []
  );
  const findings = [];

  for (const changedPath of paths) {
    const relatedDocs = index.documents
      .map((doc) => ({
        doc,
        mentionsPath: doc.content.includes(changedPath),
        traceLinks: extractTraceLinks(doc, changedPath)
      }))
      .filter((record) => record.mentionsPath || record.traceLinks.length > 0);
    const tracedDocs = relatedDocs.filter((record) => record.traceLinks.length > 0);

    if (tracedDocs.length === 0) {
      findings.push({
        severity: 'warning',
        kind: 'missing-code-trace',
        message: `Changed code path has no planning trace: ${changedPath}`,
        evidence: [{ path: resolve(root, changedPath) }, ...relatedDocs.map(({ doc }) => ({ path: doc.path }))],
        recommended_action: 'Add a TraceLink or module note that references this code path.'
      });
    }

    for (const { doc, traceLinks } of relatedDocs) {
      if (doc.status === 'stale') {
        const staleRelation = traceLinks.length > 0 ? 'traced through' : 'mentioned by';
        findings.push({
          severity: 'warning',
          kind: 'stale-doc-for-code-path',
          message: `Changed code path is ${staleRelation} stale planning doc ${doc.relativePath}: ${changedPath}`,
          evidence: [{ path: resolve(root, changedPath) }, { path: doc.path }, ...traceLinks.map((traceLink) => ({ trace_link: traceLink }))],
          recommended_action: 'Refresh the stale planning doc before relying on it as implementation context.'
        });
      }

      if (hasConstraintConflict(doc, changedPath)) {
        findings.push({
          severity: 'warning',
          kind: 'constraint-conflict',
          message: `Changed code path conflicts with planning constraint in ${doc.relativePath}: ${changedPath}`,
          evidence: [{ path: resolve(root, changedPath) }, { path: doc.path }, ...traceLinks.map((traceLink) => ({ trace_link: traceLink }))],
          recommended_action: 'Review the planning constraint and update the plan or document the exception before implementation.'
        });
      }
    }
  }

  return findings;
}

async function codeFilesRelativeToRoot(root) {
  const files = await listCodeFiles(root);
  return files.map((file) => relative(root, file));
}

function normalizeChangedPaths(paths) {
  const values = Array.isArray(paths) ? paths : [paths];
  return [...new Set(values.map((path) => normalizePath(path)).filter(Boolean))];
}

function hasConstraintConflict(doc, changedPath) {
  return doc.content
    .split('\n')
    .some((line) => line.includes(changedPath) && /금지|must not|do not|forbid/i.test(line));
}

function extractTraceLinks(doc, changedPath) {
  const traceLinks = [];
  const linkPattern = /`([^`]+)`\s+(satisfies|constrains|implements|verifies|updates)\s+\[\[([^\]#|]+)(?:#[^\]|]+)?(?:\|[^\]]+)?]]/gi;

  for (const line of doc.content.split('\n')) {
    let match;
    while ((match = linkPattern.exec(line)) !== null) {
      const sourcePath = normalizePath(match[1]);
      if (sourcePath !== changedPath) continue;

      traceLinks.push({
        from: { type: 'code', id: changedPath },
        to: { type: doc.type || 'doc', id: targetIdFor(doc, match[3]) },
        relation: match[2].toLowerCase(),
        evidence: doc.relativePath,
        source_line: line.trim()
      });
    }
  }

  return traceLinks;
}

function targetIdFor(doc, rawTarget) {
  const target = rawTarget.trim();
  const docPathWithoutExtension = doc.relativePath.replace(/\.md$/, '');
  if (target === doc.stem || target === docPathWithoutExtension) return doc.id || target;
  return target;
}

function normalizePath(path) {
  return String(path).replace(/^\.\//, '').replace(/\\/g, '/').trim();
}
