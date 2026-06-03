export function recommendDocUpdates({ findings = [], changedPaths = [] } = {}) {
  const normalizedChangedPaths = normalizeList(changedPaths).map(normalizePath).filter(Boolean);
  const recommendations = [];
  const traceLinkCandidates = [];
  const adrCandidates = [];

  for (const finding of findings) {
    const changedPath = changedPathFor(finding, normalizedChangedPaths);

    if (finding.kind === 'missing-code-trace') {
      const candidate = traceLinkCandidate({ finding, changedPath });
      traceLinkCandidates.push(candidate);
      recommendations.push({
        id: `DOCREC-${recommendations.length + 1}`,
        kind: 'add-trace-link',
        finding_kind: finding.kind,
        changed_path: changedPath,
        target_doc: candidate.target_doc,
        draft: candidate.snippet,
        approval_required: true,
        recommended_action: 'Add the smallest TraceLink that ties the changed code path to an existing or new module note.'
      });
    }

    if (finding.kind === 'stale-doc-for-code-path') {
      const targetDoc = firstMarkdownEvidence(finding);
      recommendations.push({
        id: `DOCREC-${recommendations.length + 1}`,
        kind: 'refresh-stale-doc',
        finding_kind: finding.kind,
        changed_path: changedPath,
        target_doc: targetDoc,
        draft: `Refresh stale context for \`${changedPath}\` and keep existing TraceLinks intact.`,
        approval_required: true,
        recommended_action: 'Update only the stale planning section that directly describes the changed code path.'
      });
    }

    if (finding.kind === 'constraint-conflict') {
      const candidate = adrCandidate({ finding, changedPath });
      adrCandidates.push(candidate);
      recommendations.push({
        id: `DOCREC-${recommendations.length + 1}`,
        kind: 'create-adr-candidate',
        finding_kind: finding.kind,
        changed_path: changedPath,
        target_doc: candidate.recommended_path,
        draft: candidate.title,
        approval_required: true,
        recommended_action: 'Create an ADR candidate before changing code that conflicts with an existing planning constraint.'
      });
    }
  }

  return {
    recommendations,
    trace_link_candidates: dedupeBy(traceLinkCandidates, (candidate) => `${candidate.source_path}:${candidate.target_doc}`),
    adr_candidates: dedupeBy(adrCandidates, (candidate) => `${candidate.changed_path}:${candidate.title}`),
    approval_required: recommendations.length > 0
  };
}

function traceLinkCandidate({ finding, changedPath }) {
  const targetDoc = firstMarkdownEvidence(finding) || 'docs/planning/00-current-state.md';
  const target = `TODO-module-for-${slugFor(changedPath)}`;
  return {
    source_path: changedPath,
    relation: 'implements',
    target: `[[${target}]]`,
    target_doc: targetDoc,
    snippet: `- \`${changedPath}\` implements [[${target}]]`
  };
}

function adrCandidate({ finding, changedPath }) {
  const slug = slugFor(changedPath);
  return {
    changed_path: changedPath,
    title: `ADR candidate: Document constraint exception for ${changedPath}`,
    reason: `constraint conflict from ${finding.kind}: ${finding.message}`,
    recommended_path: `docs/planning/05-adrs/ADR-next-${slug}-constraint-exception.md`
  };
}

function changedPathFor(finding, changedPaths) {
  const message = finding.message || '';
  const fromChanged = changedPaths.find((path) => message.includes(path) || evidenceMentions(finding, path));
  if (fromChanged) return fromChanged;

  const codeEvidence = (finding.evidence || [])
    .map((item) => normalizePath(item.path || ''))
    .find((path) => path && !path.endsWith('.md'));
  return codeEvidence || 'unknown';
}

function evidenceMentions(finding, changedPath) {
  return (finding.evidence || []).some((item) => normalizePath(item.path || '').endsWith(changedPath));
}

function firstMarkdownEvidence(finding) {
  const evidence = (finding.evidence || []).find((item) => String(item.path || '').endsWith('.md'));
  return evidence?.path || null;
}

function dedupeBy(items, keyFor) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = keyFor(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function normalizeList(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizePath(path) {
  return String(path || '').replace(/^\.\//, '').replace(/\\/g, '/').trim();
}

function slugFor(path) {
  return normalizePath(path).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown';
}
