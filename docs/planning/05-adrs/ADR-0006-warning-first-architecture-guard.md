---
id: ADR-0006
type: adr
status: accepted
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-generate-compliant-code]]"
  - "[[skill-verify-architecture-drift]]"
---

> Context Links: [[00-index]] · [[module-output-guard]] · [[module-drift-detector]] · [[architecture-review-checklist]]

# ADR-0006: v1 아키텍처 가드는 warning-first로 동작한다

## 상태

Accepted

## 맥락

"땜질 코드"는 제품의 핵심 감지 대상이지만 주관성이 크다. v1에서 자동 차단을 하면 잘못된 문서나 낮은 confidence 검색 결과가 개발을 막을 수 있다.

## 결정

v1은 아키텍처 위반 가능성을 warning/report로 제시한다. must 제약 위반이 명확해도 사용자 승인 없는 hard block은 하지 않는다.

## 결과

- 사용자는 근거와 대안을 보고 결정할 수 있다.
- 잘못된 문서가 개발을 막는 위험을 줄인다.
- 추후 confidence와 팀 정책이 안정되면 block mode를 선택 기능으로 확장할 수 있다.

## 대안

- Hard block 우선: 강한 통제는 가능하지만 오탐 비용이 크다.
- No guard: 빠르지만 제품 핵심 가치가 사라진다.

## 영향받는 문서

Impacts: [[module-output-guard]], [[module-drift-detector]], [[skill-generate-compliant-code]]

