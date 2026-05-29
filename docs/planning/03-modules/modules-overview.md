---
id: MODULES-OVERVIEW
type: module-index
status: draft
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skills-overview]]"
---

> Context Links: [[00-index]] · [[system-overview]] · [[interface-contracts]] · [[skills-overview]]

# 모듈 개요

## 모듈 맵

| 모듈 | 책임 | 주요 출력 |
| --- | --- | --- |
| [[module-context-bootstrap]] | 프로젝트 상태 판별과 초기 경로 선택 | `ProjectSnapshot` |
| [[module-repository-analyzer]] | 기존 저장소 구조와 관례 분석 | 분석 evidence |
| [[module-context-vault-manager]] | 문서 볼트 생성/갱신/상태 관리 | vault files |
| [[module-context-indexer]] | 문서와 코드의 검색 인덱스 생성 | index |
| [[module-context-retriever]] | 작업 관련 컨텍스트 검색 | `ContextPack` |
| [[module-constraint-extractor]] | 문서에서 제약 추출 | `Constraint[]` |
| [[module-planning-guard]] | 구현 계획에 컨텍스트와 제약 반영 | plan guidance |
| [[module-output-guard]] | 코드 출력 전후 제약 확인 | warning report |
| [[module-drift-detector]] | 문서-코드 불일치 탐지 | `VerificationFinding[]` |
| [[module-doc-update-recommender]] | 문서 갱신 초안 제안 | doc update draft |

## 의존 방향

`context-bootstrap`이 작업 모드를 결정하고, `repository-analyzer`와 `context-vault-manager`가 기준 자료를 만든다. 이후 `context-indexer`, `context-retriever`, `constraint-extractor`가 공통 파이프라인을 구성한다. planning/output/drift/doc-update 모듈은 이 파이프라인의 결과만 사용한다.

## 공통 검증

- 모든 모듈은 입력과 출력을 [[interface-contracts]]의 계약으로 설명한다.
- 모듈 간 직접 의존은 문서에 기록된 방향을 넘지 않는다.
- Brownfield 분석 결과는 evidence 없이 confirmed 상태가 될 수 없다.

