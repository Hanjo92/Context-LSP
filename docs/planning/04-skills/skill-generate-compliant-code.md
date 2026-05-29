---
id: SKILL-GENERATE-COMPLIANT-CODE
type: skill
status: draft
related_adrs:
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
  - "[[skill-verify-architecture-drift]]"
---

> Context Links: [[00-index]] · [[module-output-guard]] · [[architecture-review-checklist]] · [[interface-contracts]]

# 스킬: generate-compliant-code

## 호출 조건

Codex가 코드 생성 또는 수정에 들어가기 전에 설계 제약을 확인해야 할 때 호출한다.

## 필요한 컨텍스트

- 구현 계획
- `ContextPack`
- 대상 파일
- 관련 Constraint

## 실행 단계

1. `ContextPack`과 Constraint를 검토한다.
2. 코드 수정 범위를 계획과 비교한다.
3. 위반 가능성이 있으면 [[module-output-guard]]로 warning과 대안을 만든다.
4. 허용된 범위 안에서만 코드 변경을 진행한다.
5. 변경 후 [[skill-verify-architecture-drift]]를 호출한다.

## 생성/수정 가능한 산출물

- compliant code changes
- warning report
- post-change verification request

## 금지 행동

- warning을 무시하고 우회 구현을 진행하지 않는다.
- 사용자 승인 없이 unrelated refactor를 하지 않는다.
- 설계 문서와 충돌하는 변경을 조용히 적용하지 않는다.

## 연결 모듈

- [[module-output-guard]]
- [[module-drift-detector]]

