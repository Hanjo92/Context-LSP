---
id: USERS-AND-USE-CASES
type: product
status: draft
related_adrs:
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-reverse-engineer-project]]"
---

> Context Links: [[00-index]] · [[product-vision]] · [[interface-contracts]] · [[acceptance-scenarios]]

# 사용자와 유스케이스

## 사용자 유형

- Solo Builder: 혼자 빠르게 만들지만 설계 노트를 잃고 싶지 않은 개발자.
- Maintainer: 기존 저장소에 들어오는 변경이 아키텍처를 망치지 않게 관리하는 사람.
- Agent Operator: Codex에게 계획과 구현을 맡기되, 컨텍스트 품질을 통제하고 싶은 사람.

## UC-GREENFIELD

빈 프로젝트 초기 설계

사용자는 "작은 SaaS 백엔드를 만들고 싶다"처럼 추상적인 아이디어를 준다. [[skill-context-bootstrap]]은 빈 저장소를 감지하고 [[skill-init-project-brain]]으로 넘긴다. 결과물은 제품 비전, 주요 유스케이스, 초기 ADR, 모듈 후보, 문서 템플릿이다.

성공 기준: 코드 생성 전에 Context Vault가 만들어지고, 다음 구현 계획은 [[interface-contracts#ContextPack]]을 참조한다.

## UC-BROWNFIELD

기존 프로젝트 역분석

사용자는 이미 코드가 있는 저장소에서 "이 프로젝트 분석해줘"라고 요청한다. [[skill-reverse-engineer-project]]는 [[module-repository-analyzer]]를 통해 언어, 의존성, 폴더 구조, 테스트 구조, 주요 관례를 수집한다.

성공 기준: 추정된 규칙에는 코드 경로와 근거가 붙고, 불확실한 내용은 confirmed가 아니라 assumed로 기록된다.

## UC-PLAN

컨텍스트 기반 구현 계획

사용자는 기능 추가를 요청한다. [[skill-retrieve-project-context]]가 관련 문서와 ADR을 모아 `ContextPack`을 만들고, [[skill-plan-with-project-brain]]이 제약을 반영한 구현 계획을 작성한다.

성공 기준: 계획에는 관련 ADR, 영향 모듈, 금지할 우회 구현, 검증 방법이 포함된다.

## UC-OUTPUT-GUARD

코드 출력 제약 주입

Codex가 코드를 작성하기 전 [[skill-generate-compliant-code]]가 `Constraint`를 확인한다. 제약 위반 가능성이 있으면 사용자에게 근거가 있는 warning을 제시한다.

성공 기준: 임시방편 구현은 차단보다 경고와 대안을 먼저 제공한다.

## UC-DRIFT

작업 후 문서 갱신

코드 변경 후 [[skill-verify-architecture-drift]]가 변경 경로와 기존 문서를 비교한다. 충돌이나 누락이 있으면 [[skill-update-project-brain]]이 문서 업데이트 초안을 만든다.

성공 기준: drift finding은 `VerificationFinding`으로 남고 영향을 받은 문서가 명시된다.
