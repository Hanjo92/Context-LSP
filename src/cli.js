#!/usr/bin/env node
import { resolve } from 'node:path';
import { createProjectSnapshot } from './core/bootstrap.js';
import { listGuarantees } from './core/guarantees.js';
import { buildIndex, serializeIndex } from './core/indexer.js';
import { normalizeContextQuery, retrieveContextPack } from './core/retriever.js';
import { verifyVault } from './core/verify.js';

const args = process.argv.slice(2);
const command = args.shift();

try {
  const options = parseOptions(args);

  if (command === 'index') {
    const index = await buildIndex({ docsDir: requiredPath(options.docs, 'docs') });
    printJson(serializeIndex(index));
  } else if (command === 'retrieve') {
    const index = await buildIndex({ docsDir: requiredPath(options.docs, 'docs') });
    const query = normalizeContextQuery({
      task: options.task || '',
      task_type: options.type || 'plan',
      target_concepts: options.concept || []
    });
    printJson(retrieveContextPack(index, query));
  } else if (command === 'verify') {
    const index = await buildIndex({ docsDir: requiredPath(options.docs, 'docs') });
    printJson(verifyVault(index));
  } else if (command === 'bootstrap') {
    printJson(await createProjectSnapshot({ root: options.root || process.cwd(), docs: options.docs }));
  } else if (command === 'guarantees') {
    printJson(listGuarantees());
  } else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

function parseOptions(rawArgs) {
  const options = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const value = rawArgs[index + 1] && !rawArgs[index + 1].startsWith('--') ? rawArgs[++index] : true;
    if (options[key] === undefined) {
      options[key] = key === 'concept' ? [value] : value;
    } else if (Array.isArray(options[key])) {
      options[key].push(value);
    } else {
      options[key] = [options[key], value];
    }
  }
  return options;
}

function requiredPath(value, name) {
  if (!value) throw new Error(`--${name} is required`);
  return resolve(String(value));
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function usage() {
  console.error(`Usage:
  context-lsp index --docs docs/planning
  context-lsp retrieve --docs docs/planning --task "..." --type plan [--concept ContextPack]
  context-lsp verify --docs docs/planning
  context-lsp bootstrap --root . --docs docs/planning
  context-lsp guarantees`);
}
