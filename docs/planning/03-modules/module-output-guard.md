---
id: MOD-OUTPUT-GUARD
type: module
status: draft
related_adrs:
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-generate-compliant-code]]"
---

> Context Links: [[00-index]] · [[module-constraint-extractor]] · [[architecture-review-checklist]] · [[skill-generate-compliant-code]]

# 모듈: Output Guard

## 책임

코드 출력 전후에 설계 제약을 확인하고, 위반 가능성을 근거 있는 warning으로 제시한다.

## 입력

- `ContextPack`
- `Constraint[]`
- 계획 또는 코드 변경 후보
- 대상 파일 경로

## 출력

- warning report
- 우회 구현 위험 설명
- 대안 구현 방향
- 후속 drift 검증 요청

## 의존 모듈

- [[module-constraint-extractor]]
- [[module-drift-detector]]

## 실패 모드

- 모든 경고를 error처럼 취급해 개발 흐름을 막는다.
- "땜질 코드"를 주관적으로 판단하고 근거를 남기지 않는다.
- 경고만 남기고 대안을 제시하지 않는다.

## 검증 방법

- 각 warning은 관련 Constraint와 source를 가진다.
- v1은 사용자 승인 없는 hard block을 하지 않는다.
- [[ADR-0006-warning-first-architecture-guard]] 정책을 따른다.

