#!/usr/bin/env node
import { resolve } from 'node:path';
import { createProjectSnapshot } from './core/bootstrap.js';
import { listGuarantees } from './core/guarantees.js';
import { buildIndex, serializeIndex } from './core/indexer.js';
import { guardOutput } from './core/output-guard.js';
import { initProjectBrain } from './core/project-brain.js';
import { normalizeContextQuery, retrieveContextPack } from './core/retriever.js';
import { reverseEngineerProject } from './core/repository-analyzer.js';
import { verifyCodeDrift, verifyVault } from './core/verify.js';

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
      target_concepts: options.concept || [],
      target_paths: normalizeOptionList(options.target)
    });
    printJson(await retrieveContextPack(index, query, { root: options.root || null }));
  } else if (command === 'output-guard' || command === 'guard-output') {
    const index = await buildIndex({ docsDir: requiredPath(options.docs, 'docs') });
    const targetPaths = normalizeOptionList(options.target);
    const query = normalizeContextQuery({
      task: options.task || options.plan || '',
      task_type: options.type || 'code',
      target_concepts: options.concept || [],
      target_paths: targetPaths
    });
    const contextPack = await retrieveContextPack(index, query, { root: options.root || null });
    printJson(guardOutput({
      contextPack,
      proposal: {
        summary: options.plan || options.task || '',
        targetPaths
      }
    }));
  } else if (command === 'verify') {
    const index = await buildIndex({ docsDir: requiredPath(options.docs, 'docs') });
    const vaultFindings = verifyVault(index);
    const driftFindings = options.root || options.changed || options.scan
      ? await verifyCodeDrift({
        index,
        root: options.root || process.cwd(),
        changedPaths: normalizeOptionList(options.changed),
        scan: Boolean(options.scan)
      })
      : [];
    printJson([...vaultFindings, ...driftFindings]);
  } else if (command === 'bootstrap') {
    printJson(await createProjectSnapshot({ root: options.root || process.cwd(), docs: options.docs }));
  } else if (command === 'init-project-brain' || command === 'init-brain') {
    printJson(await initProjectBrain({
      root: options.root || process.cwd(),
      docs: options.docs,
      name: options.name,
      idea: options.idea,
      overwrite: Boolean(options.overwrite)
    }));
  } else if (command === 'reverse-engineer' || command === 'analyze') {
    printJson(await reverseEngineerProject({
      root: options.root || process.cwd(),
      docs: options.docs,
      overwrite: Boolean(options.overwrite)
    }));
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

function normalizeOptionList(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function usage() {
  console.error(`Usage:
  context-lsp index --docs docs/planning
  context-lsp retrieve --docs docs/planning --task "..." --type plan [--root .] [--concept ContextPack] [--target src]
  context-lsp output-guard --docs docs/planning --task "..." [--root .] [--target src/file.js] [--plan "..."]
  context-lsp verify --docs docs/planning [--root . --changed src/file.js]
  context-lsp bootstrap --root . --docs docs/planning
  context-lsp init-project-brain --root . --idea "..." [--name "Project Name"] [--docs docs/planning] [--overwrite]
  context-lsp reverse-engineer --root . [--docs docs/planning] [--overwrite]
  context-lsp guarantees`);
}
