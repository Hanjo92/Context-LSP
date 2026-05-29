---
id: ADR-0001
type: adr
status: accepted
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-plan-with-project-brain]]"
---

> Context Links: [[00-index]] · [[codex-runtime-and-agent-policy]] · [[skills-overview]] · [[system-overview]]

# ADR-0001: Codex 중심 런타임을 v1 기본값으로 둔다

## 상태

Accepted

## 맥락

제품명은 Context-LSP지만, 원본 아이디어의 핵심은 실시간 IDE 프로토콜보다 Codex 스킬이 planning, code output, review 단계에서 프로젝트 컨텍스트를 통과하는 것이다. LSP를 먼저 만들면 에디터 통합과 diagnostic 처리에 제품 위험이 커진다.

## 결정

v1은 Codex 스킬/플러그인과 로컬 코어 모듈을 1차 런타임으로 둔다. CLI와 LSP는 같은 코어를 호출하는 후속 어댑터로 설계한다.

## 결과

- 초기 제품은 Codex workflow 안에서 바로 검증할 수 있다.
- LSP diagnostic보다 `ContextPack`, planning guard, output guard 계약을 먼저 안정화한다.
- 제품명이 주는 기대와 v1 범위 사이의 차이는 [[roadmap]]과 [[00-current-state]]에 명시한다.

## 대안

- LSP 우선: IDE 경험은 강하지만 구현 범위가 커진다.
- CLI 우선: 재현성은 좋지만 Codex 스킬 경험이 약해진다.

## 영향받는 문서

Impacts: [[skills-overview]], [[codex-runtime-and-agent-policy]], [[roadmap]]

