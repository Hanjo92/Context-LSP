const MUST_PATTERNS = [/반드시/, /해야 한다/, /\bmust\b/i, /\brequired\b/i, /금지/, /하지 않는다/];
const SHOULD_PATTERNS = [/권장/, /제안/, /\bshould\b/i];
const WARN_PATTERNS = [/warning/i, /warn/i, /경고/, /hard block/i, /차단/];

export function extractConstraints(documents) {
  const constraints = [];
  const seen = new Set();

  for (const doc of documents) {
    for (const [index, line] of doc.content.split('\n').entries()) {
      const statement = normalizeLine(line);
      if (!statement || statement.startsWith('---') || statement.startsWith('> Context Links:')) continue;

      const level = classifyConstraint(statement);
      if (!level) continue;

      const key = `${doc.path}:${index}:${level}:${statement}`;
      if (seen.has(key)) continue;
      seen.add(key);

      constraints.push({
        id: `CONSTRAINT-${constraints.length + 1}`,
        level,
        statement,
        source: {
          doc: doc.id,
          path: doc.path,
          line: index + 1
        },
        applies_to: inferAppliesTo(doc)
      });
    }
  }

  return constraints;
}

function classifyConstraint(statement) {
  if (WARN_PATTERNS.some((pattern) => pattern.test(statement))) return 'warn';
  if (MUST_PATTERNS.some((pattern) => pattern.test(statement))) return 'must';
  if (SHOULD_PATTERNS.some((pattern) => pattern.test(statement))) return 'should';
  return null;
}

function normalizeLine(line) {
  return line
    .replace(/^[-*]\s+/, '')
    .replace(/^#+\s+/, '')
    .trim();
}

function inferAppliesTo(doc) {
  if (doc.type === 'adr') return ['plan', 'code', 'review'];
  if (doc.type === 'skill') return ['plan', 'code'];
  if (doc.type === 'validation') return ['review'];
  return ['plan'];
}
