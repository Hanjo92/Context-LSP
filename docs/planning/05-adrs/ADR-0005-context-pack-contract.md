---
id: ADR-0005
type: adr
status: accepted
related_adrs:
  - "[[ADR-0001-codex-centered-runtime]]"
  - "[[ADR-0003-local-rag-lite-first]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
  - "[[skill-plan-with-project-brain]]"
---

> Context Links: [[00-index]] · [[interface-contracts]] · [[retrieval-pipeline]] · [[module-planning-guard]]

# ADR-0005: ContextPack을 planning/code/review 공통 계약으로 둔다

## 상태

Accepted

## 맥락

스킬이 각자 문서를 읽으면 단계마다 다른 컨텍스트를 사용하게 된다. 그러면 planning에서 본 제약이 code output에서 사라지거나, review가 다른 기준으로 판단할 수 있다.

## 결정

`ContextPack`을 planning, code output, review 단계가 공유하는 공통 계약으로 둔다. 모든 작업은 `ContextQuery`에서 시작하고, 관련 문서/코드/ADR/Constraint/TraceLink를 `ContextPack`에 담는다.

## 결과

- 단계 간 컨텍스트 일관성이 생긴다.
- 검색 결과의 confidence와 gaps를 명시할 수 있다.
- 스킬과 모듈 경계가 계약 중심으로 정리된다.

## 대안

- 각 스킬이 독립 검색: 구현은 쉽지만 결과가 흔들린다.
- 전체 vault 주입: 간단하지만 토큰 낭비와 노이즈가 커진다.

## 영향받는 문서

Impacts: [[interface-contracts]], [[skill-retrieve-project-context]], [[module-context-retriever]]

