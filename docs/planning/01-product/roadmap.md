---
id: ROADMAP
type: product
status: draft
related_adrs:
  - "[[ADR-0001-codex-centered-runtime]]"
  - "[[ADR-0003-local-rag-lite-first]]"
related_skills:
  - "[[skill-context-bootstrap]]"
---

> Context Links: [[00-index]] · [[product-vision]] · [[modules-overview]] · [[skills-overview]]

# 로드맵

## 단계 0: 기획 볼트

- 제품 비전, 시스템 구조, 모듈, 스킬, ADR, 검증 문서를 만든다.
- 미래 에이전트가 [[00-agent-retrieval-map]]에서 작업별 문서를 찾을 수 있게 한다.

완료 기준: 모든 문서가 frontmatter와 `Context Links`를 가진다.

## 단계 1: Codex Skill MVP

- `context-bootstrap`, `retrieve-project-context`, `plan-with-project-brain`, `verify-architecture-drift`를 우선 구현한다.
- Markdown 파일 검색, wikilink 그래프, 키워드 기반 rag-lite를 제공한다.
- 코드 변경은 자동 차단하지 않고 warning/report를 낸다.

완료 기준: Greenfield/Brownfield 샘플 저장소에서 `ContextPack`과 drift report를 생성한다.

현재 상태: 구현됨. 보장 범위는 [[implementation-guarantees]]에 등록한다.

## 단계 2: Local CLI and Index

- 로컬 CLI로 vault 초기화, 인덱스 갱신, 검색, 검증을 실행한다.
- JSON 기반 `ContextPack`과 `VerificationFinding` 출력을 안정화한다.
- 보장점 레지스트리를 CLI 출력으로 제공한다.

완료 기준: Codex 스킬이 CLI 결과를 읽어 계획에 반영한다.

## 단계 3: LSP Adapter

- 같은 코어 인덱스와 검증기를 LSP diagnostic으로 노출한다.
- IDE에서는 실시간 경고만 제공하고 결정은 Codex/사용자 흐름에서 처리한다.

완료 기준: 코드 위치와 관련 ADR/문서 링크가 diagnostic에 포함된다.
