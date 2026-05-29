---
id: SKILL-PLAN-WITH-PROJECT-BRAIN
type: skill
status: draft
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
---

> Context Links: [[00-index]] · [[module-planning-guard]] · [[users-and-use-cases#UC-PLAN]] · [[acceptance-scenarios]]

# 스킬: plan-with-project-brain

## 호출 조건

사용자가 구현 계획, 리팩터링 계획, 기능 추가 계획을 요청했을 때 호출한다.

## 필요한 컨텍스트

- 사용자 요청
- [[interface-contracts#ContextPack]]
- 관련 Constraint
- 현재 문서/코드 gaps

## 실행 단계

1. `ContextPack`이 없으면 [[skill-retrieve-project-context]]를 먼저 호출한다.
2. 관련 ADR과 모듈 경계를 요약한다.
3. 금지할 우회 구현과 검증 기준을 계획에 포함한다.
4. 구현 범위를 최소 vertical slice로 나눈다.
5. 문서 갱신 필요 여부를 계획의 acceptance criteria에 포함한다.

## 생성/수정 가능한 산출물

- implementation plan
- constraints summary
- acceptance checklist

## 금지 행동

- 컨텍스트 검색 없이 계획을 확정하지 않는다.
- 구현 편의 때문에 문서화된 모듈 경계를 무시하지 않는다.
- 불확실한 내용을 확정 결정처럼 쓰지 않는다.

## 연결 모듈

- [[module-planning-guard]]
- [[module-context-retriever]]
- [[module-constraint-extractor]]

