---
id: SYSTEM-OVERVIEW
type: architecture
status: draft
related_adrs:
  - "[[ADR-0001-codex-centered-runtime]]"
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-plan-with-project-brain]]"
---

> Context Links: [[00-index]] · [[interface-contracts]] · [[retrieval-pipeline]] · [[modules-overview]]

# 시스템 개요

## 아키텍처 목표

Context-LSP는 코드 생성기 자체가 아니라, Codex가 계획과 코드 출력을 하기 전에 프로젝트 의도를 검색하고 제약으로 변환하는 컨텍스트 레이어다. 핵심은 "더 많은 문서 주입"이 아니라 "작업에 필요한 최소 근거와 제약을 구조화해서 제공"하는 것이다.

## 런타임 구성

| 영역 | 책임 | 대표 문서 |
| --- | --- | --- |
| Codex Skill Layer | 사용자의 작업 단계에 맞는 워크플로우를 실행한다. | [[skills-overview]] |
| Core Modules | 저장소 분석, vault 관리, 검색, 제약 추출, 검증을 담당한다. | [[modules-overview]] |
| Context Vault | Markdown 문서, ADR, TraceLink의 저장소다. | [[context-vault-model]] |
| Interface Contracts | 스킬과 모듈이 주고받는 데이터 형태를 고정한다. | [[interface-contracts]] |
| Future Adapters | CLI, LSP, Git hook이 같은 코어 결과를 재사용한다. | [[roadmap]] |

## Greenfield 흐름

1. [[skill-context-bootstrap]]이 빈 저장소 또는 문서 없는 저장소를 감지한다.
2. [[skill-init-project-brain]]이 제품 비전, 유스케이스, 초기 ADR, 모듈 후보를 만든다.
3. [[module-context-vault-manager]]가 Context Vault 구조와 템플릿을 배치한다.
4. 이후 계획/코드 작업은 [[interface-contracts#ContextPack]]을 통해 같은 검색 파이프라인으로 들어온다.

## Brownfield 흐름

1. [[skill-context-bootstrap]]이 기존 코드와 부족한 문서 상태를 감지한다.
2. [[skill-reverse-engineer-project]]가 [[module-repository-analyzer]]를 실행한다.
3. 분석 결과는 "confirmed", "assumed", "unknown" 상태로 Context Vault에 기록된다.
4. 이후 계획/코드 작업은 기존 코드의 관례와 ADR을 동시에 참조한다.

## 공통 작업 흐름

사용자 요청은 `ContextQuery`로 정규화되고, [[module-context-retriever]]가 관련 문서/ADR/코드 경로를 찾아 `ContextPack`을 만든다. [[module-constraint-extractor]]는 이 묶음에서 반드시 지켜야 할 규칙을 추출한다. 이후 [[module-planning-guard]], [[module-output-guard]], [[module-drift-detector]], [[module-doc-update-recommender]]가 순서대로 실행된다.

## 주요 실패 모드

- 문서가 오래되어 코드와 충돌한다.
- 검색 결과가 너무 넓어 Codex의 컨텍스트를 낭비한다.
- 경고가 너무 많아 사용자가 무시한다.
- Brownfield 분석이 근거 없는 아키텍처 추정으로 오염된다.

각 실패 모드는 [[retrieval-quality-checklist]]와 [[architecture-review-checklist]]에서 검증한다.

