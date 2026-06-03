export function guardOutput({ contextPack, proposal = {} } = {}) {
  const pack = contextPack || {};
  const normalizedProposal = normalizeProposal(proposal);
  const findings = [
    ...gapFindings(pack),
    ...constraintFindings(pack),
    ...targetPathFindings(pack, normalizedProposal)
  ];

  return {
    query: pack.query || null,
    proposal: normalizedProposal,
    context: {
      confidence: pack.confidence || 'low',
      document_count: pack.documents?.length || 0,
      constraint_count: pack.constraints?.length || 0,
      code_ref_count: pack.code_refs?.length || 0
    },
    decision: findings.length > 0 ? 'warn' : 'pass',
    hard_blocked: false,
    findings
  };
}

function gapFindings(pack) {
  return (pack.gaps || []).map((gap) => ({
    severity: 'warning',
    kind: 'context-gap',
    message: `ContextPack has a retrieval gap: ${gap}`,
    evidence: [],
    recommended_action: 'Resolve the context gap or state the assumption before code generation.',
    alternative: 'Pause code output and retrieve or create the missing planning context.'
  }));
}

function constraintFindings(pack) {
  return (pack.constraints || [])
    .filter((constraint) => ['must', 'warn'].includes(constraint.level))
    .filter((constraint) => appliesToCode(constraint, pack.query?.task_type))
    .map((constraint) => ({
      severity: 'warning',
      kind: `${constraint.level}-constraint-review`,
      message: `Proposed output must account for constraint: ${constraint.statement}`,
      evidence: [constraintEvidence(constraint)],
      recommended_action: 'Check the proposed code against this source-backed constraint before writing or changing files.',
      alternative: 'Narrow the change, update the plan, or document an explicit exception before implementation.'
    }));
}

function targetPathFindings(pack, proposal) {
  return proposal.target_paths
    .filter((targetPath) => !pathHasContext(pack, targetPath))
    .map((targetPath) => ({
      severity: 'warning',
      kind: 'untraced-target-path',
      message: `Proposed target path is not present in the retrieved ContextPack: ${targetPath}`,
      evidence: [{ path: targetPath }],
      recommended_action: 'Retrieve more specific context, add a planning TraceLink, or choose a target path already tied to the ContextPack.',
      alternative: alternativeTarget(pack)
    }));
}

function appliesToCode(constraint, taskType) {
  const appliesTo = constraint.applies_to || [];
  return taskType === 'code' || appliesTo.includes('code');
}

function constraintEvidence(constraint) {
  return {
    doc: constraint.source?.doc,
    path: constraint.source?.path,
    line: constraint.source?.line
  };
}

function pathHasContext(pack, targetPath) {
  const normalizedTarget = normalizePath(targetPath);
  if (!normalizedTarget) return true;

  return [
    ...(pack.code_refs || []).map((ref) => ref.relativePath || ref.path),
    ...(pack.trace_links || []).map((link) => link.evidence),
    ...(pack.documents || []).map((doc) => doc.relativePath || doc.path)
  ].some((path) => pathMatches(normalizePath(path), normalizedTarget));
}

function alternativeTarget(pack) {
  const codeRef = (pack.code_refs || [])[0];
  if (codeRef?.relativePath) return `Use retrieved code path ${codeRef.relativePath} or retrieve context for the proposed target.`;
  return 'Retrieve a ContextPack with a more specific --target value before code output.';
}

function normalizeProposal(proposal) {
  return {
    summary: String(proposal.summary || '').trim(),
    target_paths: [...new Set(normalizeList(proposal.targetPaths || proposal.target_paths || [])
      .map(normalizePath)
      .filter(Boolean))]
  };
}

function normalizeList(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizePath(path) {
  return String(path || '').replace(/^\.\//, '').replace(/\\/g, '/').trim();
}

function pathMatches(contextPath, targetPath) {
  if (!contextPath || !targetPath) return false;
  return (
    contextPath === targetPath ||
    contextPath.startsWith(`${targetPath}/`) ||
    targetPath.startsWith(`${contextPath}/`)
  );
}
