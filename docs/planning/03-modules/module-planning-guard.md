---
id: MOD-PLANNING-GUARD
type: module
status: draft
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-plan-with-project-brain]]"
---

> Context Links: [[00-index]] · [[users-and-use-cases#UC-PLAN]] · [[module-constraint-extractor]] · [[skill-plan-with-project-brain]]

# 모듈: Planning Guard

## 책임

Codex가 구현 계획을 작성하기 전에 `ContextPack`과 `Constraint`를 계획 구조에 반영하게 한다.

## 입력

- `ContextPack`
- 사용자 요청
- 작업 범위 후보

## 출력

- 컨텍스트 요약
- 계획 제약 요약
- 영향을 받는 모듈/문서/테스트 후보
- 계획에서 금지할 우회 구현

## 의존 모듈

- [[module-context-retriever]]
- [[module-constraint-extractor]]

## 실패 모드

- 검색 결과 없이 계획을 확정한다.
- 과도한 문서 요약으로 실제 구현 단계가 흐려진다.
- 관련 ADR을 언급하지만 계획 step에는 반영하지 않는다.

## 검증 방법

- 계획에는 관련 ADR과 검증 방법이 포함된다.
- low-confidence 컨텍스트는 가정으로 표시된다.
- [[acceptance-scenarios]]의 planning 시나리오를 통과한다.

