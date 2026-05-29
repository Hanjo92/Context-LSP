---
id: MOD-CONSTRAINT-EXTRACTOR
type: module
status: draft
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-plan-with-project-brain]]"
  - "[[skill-generate-compliant-code]]"
---

> Context Links: [[00-index]] · [[interface-contracts]] · [[retrieval-pipeline]] · [[module-output-guard]]

# 모듈: Constraint Extractor

## 책임

검색된 문서와 ADR에서 계획/코드/리뷰 단계에 적용할 제약을 추출한다.

## 입력

- `ContextPack.documents`
- ADR decision section
- 모듈 책임과 금지 행동
- 사용자 요청의 위험 힌트

## 출력

- [[interface-contracts#Constraint]] 배열
- must/should/warn 수준 분류
- 출처 문서와 section 정보

## 의존 모듈

- [[module-context-retriever]]: 후보 문서 제공
- [[module-planning-guard]], [[module-output-guard]]: 추출 결과 소비

## 실패 모드

- 권장 사항을 must 제약으로 과장한다.
- 출처 없는 규칙을 만들어낸다.
- 서로 충돌하는 제약을 조용히 합친다.

## 검증 방법

- 모든 Constraint가 source를 가진다.
- 충돌 제약은 `VerificationFinding` 또는 gaps로 남긴다.
- [[ADR-0006-warning-first-architecture-guard]]에 따라 v1은 hard block 대신 warning을 생성한다.

