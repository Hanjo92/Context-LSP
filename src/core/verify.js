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
