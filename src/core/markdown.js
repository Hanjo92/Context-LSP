import { basename, relative } from 'node:path';

export function parseMarkdownFile({ filePath, rootDir, content }) {
  const { frontmatter, body } = parseFrontmatter(content);
  const headings = extractHeadings(body);
  const wikilinks = extractWikilinks(content);
  const relativePath = relative(rootDir, filePath);
  const stem = basename(filePath, '.md');
  const id = frontmatter.id || stem;

  return {
    id,
    type: frontmatter.type || 'note',
    status: frontmatter.status || 'draft',
    path: filePath,
    relativePath,
    stem,
    title: headings[0] || stem,
    frontmatter,
    headings,
    wikilinks,
    content
  };
}

export function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) {
    return { frontmatter: {}, body: content };
  }

  const end = content.indexOf('\n---', 4);
  if (end === -1) {
    return { frontmatter: {}, body: content };
  }

  const raw = content.slice(4, end).trimEnd();
  const body = content.slice(end + 4).replace(/^\n/, '');
  return { frontmatter: parseSimpleYaml(raw), body };
}

function parseSimpleYaml(raw) {
  const result = {};
  let currentKey = null;

  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;

    const arrayItem = line.match(/^\s+-\s+(.+)$/);
    if (arrayItem && currentKey) {
      if (!Array.isArray(result[currentKey])) result[currentKey] = [];
      result[currentKey].push(unquote(arrayItem[1].trim()));
      continue;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;

    currentKey = pair[1];
    const value = pair[2].trim();
    if (value === '[]') {
      result[currentKey] = [];
    } else if (value === '') {
      result[currentKey] = [];
    } else {
      result[currentKey] = unquote(value);
    }
  }

  return result;
}

function unquote(value) {
  return value.replace(/^["']|["']$/g, '');
}

export function extractHeadings(content) {
  return content
    .split('\n')
    .map((line) => line.match(/^#{1,6}\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => match[1].trim());
}

export function extractWikilinks(content) {
  const links = [];
  const pattern = /\[\[([^\]]+)]]/g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const raw = match[1].trim();
    const [targetAndSection, alias] = raw.split('|', 2);
    const [target, section] = targetAndSection.split('#', 2);
    links.push({
      raw,
      target: target.trim(),
      section: section?.trim() || null,
      alias: alias?.trim() || null
    });
  }
  return links;
}

