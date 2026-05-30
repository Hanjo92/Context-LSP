---
id: MOD-DRIFT-DETECTOR
type: module
status: draft
related_adrs:
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-verify-architecture-drift]]"
  - "[[skill-update-project-brain]]"
---

> Context Links: [[00-index]] · [[traceability-model]] · [[interface-contracts]] · [[architecture-review-checklist]]

# 모듈: Drift Detector

## 책임

코드 변경, 문서 상태, TraceLink를 비교해 설계 위반 또는 문서 갱신 필요성을 finding으로 만든다.

## 입력

- 변경된 파일 목록
- 관련 `ContextPack`
- 기존 TraceLink
- 문서 상태와 ADR
- 선택 입력: repository root와 전체 scan 여부

## 출력

- [[interface-contracts#VerificationFinding]] 배열
- 심각도: info, warning, error
- 문서 갱신 후보
- 명시 TraceLink가 있는 finding의 TraceLink evidence
- v1 finding 종류: `missing-code-trace`, `stale-doc-for-code-path`, `constraint-conflict`

## 의존 모듈

- [[module-context-retriever]]: 변경과 관련된 문서 재검색
- [[module-doc-update-recommender]]: 갱신 초안 생성

## 실패 모드

- 단순 파일 추가를 아키텍처 위반으로 과장한다.
- 실제 must 제약 위반을 info로 낮춘다.
- 변경된 코드가 어떤 문서를 stale하게 만들었는지 찾지 못한다.

## 검증 방법

- finding마다 evidence와 recommended action이 있다.
- info/warning/error 구분이 [[traceability-model]] 기준과 일치한다.
- 코드 변경 후 관련 문서 갱신 후보가 최소 하나 이상 제안된다.
- v1은 warning-first로 동작하며 finding만으로 CLI를 실패 종료하지 않는다.
