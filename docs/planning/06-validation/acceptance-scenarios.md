---
id: ACCEPTANCE-SCENARIOS
type: validation
status: draft
related_adrs:
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
  - "[[ADR-0005-context-pack-contract]]"
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-plan-with-project-brain]]"
---

> Context Links: [[00-index]] · [[users-and-use-cases]] · [[interface-contracts]] · [[architecture-review-checklist]]

# 수용 시나리오

## 시나리오 1: 빈 프로젝트 초기 설계

전제: 빈 폴더와 제품 아이디어가 있다.  
실행: [[skill-context-bootstrap]]을 실행한다.  
결과: 프로젝트는 Greenfield로 판별되고 [[skill-init-project-brain]]이 제품/아키텍처/ADR/모듈 문서 초안을 만든다.

수용 기준:
- 코드 생성 전에 Context Vault가 존재한다.
- 초기 문서는 frontmatter와 `Context Links`를 가진다.
- 이후 계획은 `ContextPack`을 요구한다.

## 시나리오 2: 기존 프로젝트 역분석

전제: manifest, source tree, tests가 있는 저장소가 있다.  
실행: [[skill-reverse-engineer-project]]를 실행한다.  
결과: 언어, 프레임워크, 진입점, 테스트 구조, 관례가 evidence와 함께 문서화된다.

수용 기준:
- confirmed 내용은 근거 경로를 가진다.
- 불확실한 내용은 assumed 또는 unknown으로 남는다.
- 분석 결과가 [[module-context-indexer]]로 색인된다.

## 시나리오 3: RAG 기반 구현 계획

전제: 사용자가 기능 추가를 요청한다.  
실행: [[skill-retrieve-project-context]]와 [[skill-plan-with-project-brain]]을 실행한다.  
결과: 관련 문서, ADR, 코드 경로, Constraint가 `ContextPack`으로 묶이고 계획에 반영된다.

수용 기준:
- 계획에 관련 ADR이 명시된다.
- must/should/warn 제약이 구분된다.
- gaps가 있으면 계획의 가정으로 남는다.

## 시나리오 4: 코드 출력 제약 주입

전제: 구현 계획과 `ContextPack`이 있다.  
실행: [[skill-generate-compliant-code]]가 코드 변경을 준비한다.  
결과: [[module-output-guard]]가 설계 위반 가능성을 warning으로 제시한다.

수용 기준:
- warning은 Constraint와 source를 가진다.
- v1은 사용자 승인 없는 hard block을 하지 않는다.
- 대안 구현 방향이 함께 제시된다.

## 시나리오 5: 작업 후 drift 검증

전제: 코드 또는 문서 변경이 있다.  
실행: [[skill-verify-architecture-drift]]를 실행한다.  
결과: [[module-drift-detector]]가 `VerificationFinding`을 만들고 필요한 문서 갱신을 제안한다.

수용 기준:
- finding마다 severity, evidence, recommended action이 있다.
- 문서 갱신은 [[skill-update-project-brain]]으로 이어진다.
- 새로운 결정은 ADR 후보로 분리된다.
