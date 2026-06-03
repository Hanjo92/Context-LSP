import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const SEVERITY = {
  error: 1,
  warning: 2,
  info: 3,
  hint: 4
};

export function toLspDiagnostics({ findings = [], root = process.cwd() } = {}) {
  return findings.map((finding) => {
    const primary = primaryEvidence(finding);
    const uri = pathUri(primary?.path, root);

    return {
      uri,
      range: zeroRange(),
      severity: SEVERITY[finding.severity] || SEVERITY.warning,
      source: 'Context-LSP',
      code: finding.kind,
      message: diagnosticMessage(finding),
      relatedInformation: relatedInformation(finding, primary, root),
      data: {
        advisory: true,
        hard_blocked: false,
        finding_kind: finding.kind,
        evidence: finding.evidence || [],
        recommended_action: finding.recommended_action || null
      }
    };
  });
}

function diagnosticMessage(finding) {
  const action = finding.recommended_action ? ` recommended: ${finding.recommended_action}` : '';
  return `${finding.message}${action}`;
}

function primaryEvidence(finding) {
  const evidence = finding.evidence || [];
  return evidence.find((item) => item.path && !String(item.path).endsWith('.md')) || evidence.find((item) => item.path) || null;
}

function relatedInformation(finding, primary, root) {
  return (finding.evidence || [])
    .filter((item) => item.path && item.path !== primary?.path)
    .map((item) => ({
      location: {
        uri: pathUri(item.path, root),
        range: zeroRange()
      },
      message: relatedMessage(item)
    }));
}

function relatedMessage(item) {
  if (String(item.path || '').endsWith('.md')) return 'Related planning document';
  return 'Related evidence';
}

function pathUri(path, root) {
  const resolved = path ? resolve(root, path) : resolve(root);
  return pathToFileURL(resolved).href;
}

function zeroRange() {
  return {
    start: { line: 0, character: 0 },
    end: { line: 0, character: 0 }
  };
}
