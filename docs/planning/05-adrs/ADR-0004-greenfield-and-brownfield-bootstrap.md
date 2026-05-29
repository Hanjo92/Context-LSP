---
id: ADR-0004
type: adr
status: accepted
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-init-project-brain]]"
  - "[[skill-reverse-engineer-project]]"
---

> Context Links: [[00-index]] · [[users-and-use-cases]] · [[module-context-bootstrap]] · [[system-overview]]

# ADR-0004: Greenfield와 Brownfield 부트스트랩을 모두 1급 흐름으로 둔다

## 상태

Accepted

## 맥락

원본 대화의 마지막 요구는 "프로젝트 분석을 시키면서 구축하는 기능"과 "빈 프로젝트에서 초기 설계"를 모두 고려해야 한다는 것이다. 두 흐름은 컨텍스트 구축 방향이 반대다.

## 결정

Context-LSP는 Greenfield와 Brownfield를 모두 1급 흐름으로 제공한다. Greenfield는 top-down으로 기획/설계를 먼저 만들고, Brownfield는 bottom-up으로 코드 관례를 근거 기반 문서로 만든다.

## 결과

- 빈 프로젝트와 기존 프로젝트 모두 같은 제품 철학으로 다룬다.
- 시작점은 다르지만 둘 다 `ContextPack` 계약으로 합류한다.
- mixed 상태는 자동 단정하지 않고 부족한 근거를 드러낸다.

## 대안

- Greenfield만 지원: 신규 설계는 좋지만 실제 기존 저장소 활용성이 떨어진다.
- Brownfield만 지원: 분석 도구가 되고 초기 설계 도구 가치는 약해진다.

## 영향받는 문서

Impacts: [[skill-context-bootstrap]], [[skill-init-project-brain]], [[skill-reverse-engineer-project]]

