import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export async function initProjectBrain({ root = process.cwd(), docs, name, idea, overwrite = false } = {}) {
  const projectRoot = resolve(root);
  const docsDir = docs ? resolve(projectRoot, docs) : resolve(projectRoot, 'docs', 'planning');
  const project = {
    name: cleanText(name) || inferNameFromRoot(projectRoot),
    idea: cleanText(idea) || 'Describe the product idea before implementation.'
  };
  const documents = greenfieldDocuments(project);
  const generatedDocs = [];

  for (const document of documents) {
    const path = join(docsDir, document.relativePath);
    const action = await writeDocument({ path, content: document.content, overwrite });
    generatedDocs.push({ path, relativePath: document.relativePath, action });
  }

  return {
    root: projectRoot,
    docs: docsDir,
    project,
    generated_docs: generatedDocs
  };
}

async function writeDocument({ path, content, overwrite }) {
  await mkdir(dirname(path), { recursive: true });
  const existed = existsSync(path);
  if (existed && !overwrite) return 'skipped';
  await writeFile(path, content, 'utf8');
  return existed ? 'updated' : 'created';
}

function greenfieldDocuments(project) {
  return [
    doc('00-index.md', indexDoc(project)),
    doc('00-agent-retrieval-map.md', retrievalMapDoc()),
    doc('00-current-state.md', currentStateDoc(project)),
    doc('01-product/product-vision.md', productVisionDoc(project)),
    doc('01-product/users-and-use-cases.md', usersAndUseCasesDoc(project)),
    doc('01-product/roadmap.md', roadmapDoc(project)),
    doc('02-architecture/system-overview.md', systemOverviewDoc(project)),
    doc('03-modules/modules-overview.md', modulesOverviewDoc(project)),
    doc('05-adrs/ADR-0001-initial-product-direction.md', initialAdrDoc(project))
  ];
}

function doc(relativePath, content) {
  return { relativePath, content };
}

function cleanText(value) {
  return String(value || '').trim();
}

function inferNameFromRoot(root) {
  return root.split('/').filter(Boolean).at(-1) || 'New Project';
}

function frontmatter({ id, type, status = 'draft', relatedAdrs = [], relatedSkills = [] }) {
  return `---
id: ${id}
type: ${type}
status: ${status}
related_adrs:
${yamlList(relatedAdrs)}
related_skills:
${yamlList(relatedSkills)}
---
`;
}

function yamlList(values) {
  if (values.length === 0) return '  []';
  return values.map((value) => `  - "${value}"`).join('\n');
}

function indexDoc(project) {
  return `${frontmatter({
    id: 'INDEX',
    type: 'index',
    status: 'confirmed',
    relatedAdrs: ['[[ADR-0001-initial-product-direction]]']
  })}
> Context Links: [[00-agent-retrieval-map]] · [[00-current-state]] · [[product-vision]] · [[system-overview]]

# ${project.name} Context Vault

${project.idea}

## 권위 문서

- 제품 비전: [[product-vision]]
- 사용자와 유스케이스: [[users-and-use-cases]]
- 로드맵: [[roadmap]]
- 시스템 개요: [[system-overview]]
- 모듈 개요: [[modules-overview]]
- 초기 ADR: [[ADR-0001-initial-product-direction]]
`;
}

function retrievalMapDoc() {
  return `${frontmatter({
    id: 'AGENT-RETRIEVAL-MAP',
    type: 'index',
    relatedAdrs: ['[[ADR-0001-initial-product-direction]]']
  })}
> Context Links: [[00-index]] · [[product-vision]] · [[system-overview]] · [[modules-overview]]

# Agent Retrieval Map

## 작업별 첫 문서

| 작업 유형 | 먼저 읽을 문서 | 금지된 추론 |
| --- | --- | --- |
| 제품 범위 조정 | [[product-vision]], [[roadmap]], [[00-current-state]] | 사용자 아이디어를 확정 요구사항으로 과장하지 않는다. |
| 구현 계획 | [[system-overview]], [[modules-overview]], [[ADR-0001-initial-product-direction]] | ContextPack 없이 계획을 확정하지 않는다. |
| 문서 갱신 | [[00-current-state]], [[roadmap]], [[modules-overview]] | 코드 변경과 무관한 문서 재작성을 섞지 않는다. |
`;
}

function currentStateDoc(project) {
  return `${frontmatter({
    id: 'CURRENT-STATE',
    type: 'state',
    relatedAdrs: ['[[ADR-0001-initial-product-direction]]']
  })}
> Context Links: [[00-index]] · [[product-vision]] · [[roadmap]]

# 현재 상태

## 확정된 입력

- 프로젝트 이름: ${project.name}
- 사용자 아이디어: ${project.idea}

## 열린 결정

- 기술 스택은 아직 확정하지 않는다.
- 모듈 경계는 MVP 검증 후 조정한다.
`;
}

function productVisionDoc(project) {
  return `${frontmatter({
    id: 'PRODUCT-VISION',
    type: 'product',
    relatedAdrs: ['[[ADR-0001-initial-product-direction]]']
  })}
> Context Links: [[00-index]] · [[users-and-use-cases]] · [[roadmap]]

# Product Vision

## 제품 이름

${project.name}

## 아이디어

${project.idea}

## 문제

사용자의 초기 아이디어를 구현 전에 검증 가능한 제품 문제로 구체화해야 한다.

## 성공 기준

- MVP 사용자가 한 가지 핵심 흐름을 끝까지 수행한다.
- 구현 계획은 [[system-overview]]와 [[modules-overview]]를 통과한다.
`;
}

function usersAndUseCasesDoc(project) {
  return `${frontmatter({
    id: 'USERS-AND-USE-CASES',
    type: 'product'
  })}
> Context Links: [[00-index]] · [[product-vision]] · [[modules-overview]]

# Users And Use Cases

## Primary User

- ${project.name}의 초기 사용자는 핵심 문제를 빠르게 해결하려는 사용자다.

## UC-001: MVP 핵심 흐름

- 사용자는 목표를 입력한다.
- 시스템은 최소 산출물을 만든다.
- 사용자는 결과를 검토하고 다음 행동을 결정한다.
`;
}

function roadmapDoc(project) {
  return `${frontmatter({
    id: 'ROADMAP',
    type: 'product',
    relatedAdrs: ['[[ADR-0001-initial-product-direction]]']
  })}
> Context Links: [[00-index]] · [[product-vision]] · [[system-overview]]

# Roadmap

## Phase 0: Project Brain

- ${project.name}의 제품 문제, 사용자, 시스템 경계를 문서화한다.

## Phase 1: MVP

- [[modules-overview]]의 MVP module을 구현한다.
- 구현 후 architecture drift를 확인한다.
`;
}

function systemOverviewDoc(project) {
  return `${frontmatter({
    id: 'SYSTEM-OVERVIEW',
    type: 'architecture',
    relatedAdrs: ['[[ADR-0001-initial-product-direction]]']
  })}
> Context Links: [[00-index]] · [[product-vision]] · [[modules-overview]]

# System Overview

${project.name}는 구현 전에 ContextPack을 통해 제품 의도, 모듈 책임, ADR을 확인한다.

## Runtime Flow

사용자 요청 -> ContextQuery -> ContextPack -> 구현 계획 -> 코드 변경 -> drift verification
`;
}

function modulesOverviewDoc(project) {
  return `${frontmatter({
    id: 'MODULES-OVERVIEW',
    type: 'module-index',
    relatedAdrs: ['[[ADR-0001-initial-product-direction]]']
  })}
> Context Links: [[00-index]] · [[system-overview]] · [[users-and-use-cases]]

# Modules Overview

## Module Candidates

| Module | Responsibility | Status |
| --- | --- | --- |
| MVP-MODULE | ${project.name}의 핵심 사용자 흐름을 처리한다. | draft |

## TraceLinks

- MVP-MODULE satisfies [[users-and-use-cases]]
`;
}

function initialAdrDoc(project) {
  return `${frontmatter({
    id: 'ADR-0001',
    type: 'adr',
    status: 'draft'
  })}
> Context Links: [[00-index]] · [[product-vision]] · [[system-overview]]

# ADR-0001: Initial Product Direction

## 상태

Draft

## 맥락

${project.name}는 다음 아이디어에서 출발한다: ${project.idea}

## 결정

코드 구현 전에 Context Vault를 기준선으로 삼고, 구현 계획은 ContextPack을 통과한다.

## 결과

- 제품 방향과 구현 계획이 같은 문서 기준선을 공유한다.
- 기술 스택과 세부 아키텍처는 아직 확정하지 않는다.

## 영향받는 문서

Impacts: [[product-vision]], [[system-overview]], [[modules-overview]]
`;
}
