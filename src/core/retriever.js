import { extractConstraints } from './constraints.js';
import { resolveDoc, summarizeDocument } from './indexer.js';

const TASK_TYPES = new Set(['plan', 'code', 'review', 'bootstrap', 'analyze', 'product', 'docs-update']);

const PREFERRED_DOCS = {
  bootstrap: ['skill-context-bootstrap', 'context-vault-model', 'ADR-0004-greenfield-and-brownfield-bootstrap'],
  analyze: ['skill-reverse-engineer-project', 'module-repository-analyzer', 'traceability-model'],
  plan: ['skill-plan-with-project-brain', 'retrieval-pipeline', 'interface-contracts', 'module-planning-guard'],
  code: ['skill-generate-compliant-code', 'module-output-guard', 'architecture-review-checklist', 'ADR-0006-warning-first-architecture-guard'],
  review: ['skill-verify-architecture-drift', 'module-drift-detector', 'retrieval-quality-checklist'],
  product: ['product-vision', 'roadmap', '00-current-state'],
  'docs-update': ['skill-update-project-brain', 'module-doc-update-recommender', 'context-vault-model']
};

export function normalizeContextQuery(input = {}) {
  const task = String(input.task || '').trim();
  const taskType = TASK_TYPES.has(input.task_type) ? input.task_type : 'plan';
  const targetConcepts = normalizeConcepts(input.target_concepts || []);
  const terms = [...new Set([...tokenize(task), ...targetConcepts.map((term) => term.toLowerCase())])];

  return {
    task,
    task_type: taskType,
    target_paths: input.target_paths || [],
    target_concepts: targetConcepts,
    must_include: input.must_include || [],
    risk_hints: input.risk_hints || [],
    terms
  };
}

export function retrieveContextPack(index, queryInput, { limit = 8 } = {}) {
  const query = normalizeContextQuery(queryInput);
  const selected = selectDocuments(index, query, limit);
  const expanded = expandLinkedDocuments(index, selected, limit);
  const constraints = extractConstraints(expanded);
  const traceLinks = buildTraceLinks(expanded);
  const gaps = [];

  if (expanded.length === 0) gaps.push('No relevant documents found for ContextQuery.');
  for (const broken of index.brokenLinks) {
    gaps.push(`Broken wikilink in ${broken.sourceRelativePath}: [[${broken.raw}]]`);
  }

  return {
    query,
    documents: expanded.map((doc) => ({
      ...summarizeDocument(doc),
      why_relevant: explainRelevance(doc, query)
    })),
    code_refs: [],
    constraints,
    trace_links: traceLinks,
    confidence: confidenceFor(expanded, gaps),
    gaps
  };
}

function selectDocuments(index, query, limit) {
  return index.documents
    .map((doc) => ({ doc, score: scoreDocument(doc, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.relativePath.localeCompare(b.doc.relativePath))
    .slice(0, limit)
    .map((item) => item.doc);
}

function expandLinkedDocuments(index, docs, limit) {
  const byPath = new Map(docs.map((doc) => [doc.path, doc]));

  for (const doc of docs) {
    for (const link of doc.wikilinks) {
      if (byPath.size >= limit) break;
      const linked = resolveDoc(link.target, index);
      if (linked) byPath.set(linked.path, linked);
    }
  }

  return [...byPath.values()];
}

function scoreDocument(doc, query) {
  let score = 0;
  const preferred = PREFERRED_DOCS[query.task_type] || [];
  if (preferred.includes(doc.stem)) score += 30;
  if (preferred.includes(doc.id)) score += 30;
  if (doc.type === query.task_type) score += 8;

  const haystack = [
    doc.id,
    doc.stem,
    doc.type,
    doc.status,
    doc.title,
    doc.relativePath,
    ...doc.headings,
    doc.content
  ].join('\n').toLowerCase();

  for (const term of query.terms) {
    if (haystack.includes(term.toLowerCase())) score += 4;
  }

  for (const concept of query.target_concepts) {
    if (haystack.includes(concept.toLowerCase())) score += 6;
  }

  return score;
}

function explainRelevance(doc, query) {
  const reasons = [];
  if ((PREFERRED_DOCS[query.task_type] || []).includes(doc.stem)) reasons.push(`preferred for ${query.task_type}`);
  for (const term of query.terms) {
    if (doc.content.toLowerCase().includes(term)) reasons.push(`matches term: ${term}`);
  }
  return reasons.length ? reasons.join('; ') : 'linked context';
}

function buildTraceLinks(docs) {
  const links = [];
  for (const doc of docs) {
    for (const link of doc.wikilinks) {
      links.push({
        from: { type: doc.type, id: doc.id },
        to: { type: 'doc', id: link.target },
        relation: 'links',
        evidence: doc.path
      });
    }
  }
  return links;
}

function confidenceFor(documents, gaps) {
  if (documents.length === 0) return 'low';
  if (gaps.length > 0) return 'medium';
  return documents.length >= 3 ? 'high' : 'medium';
}

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .split(/[^\p{L}\p{N}_-]+/u)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
}

function normalizeConcepts(concepts) {
  if (typeof concepts === 'string') {
    return concepts.split(',').map((term) => term.trim()).filter(Boolean);
  }
  return concepts.map((term) => String(term).trim()).filter(Boolean);
}

