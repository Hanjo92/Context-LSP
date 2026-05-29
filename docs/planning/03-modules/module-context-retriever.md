---
id: MOD-CONTEXT-RETRIEVER
type: module
status: draft
related_adrs:
  - "[[ADR-0003-local-rag-lite-first]]"
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
  - "[[skill-plan-with-project-brain]]"
---

> Context Links: [[00-index]] · [[retrieval-pipeline]] · [[interface-contracts]] · [[module-context-indexer]]

# 모듈: Context Retriever

## 책임

`ContextQuery`에 맞는 문서, ADR, 코드 경로, TraceLink를 찾아 `ContextPack`으로 조립한다.

## 입력

- [[interface-contracts#ContextQuery]]
- Context index
- 작업 유형별 retrieval map

## 출력

- [[interface-contracts#ContextPack]]
- 검색 confidence와 gaps

## 의존 모듈

- [[module-context-indexer]]: 검색 후보 제공
- [[module-constraint-extractor]]: 검색 결과에서 제약 추출

## 실패 모드

- 관련 없는 문서를 많이 포함해 컨텍스트 비용을 높인다.
- 필수 ADR을 누락한다.
- low-confidence 결과를 확정 근거처럼 전달한다.

## 검증 방법

- Greenfield/Brownfield/planning/code/review 작업별 샘플 query로 첫 문서 3개가 맞는지 확인한다.
- `ContextPack.gaps`가 누락 정보를 명시하는지 확인한다.
- [[00-agent-retrieval-map]]의 작업 유형과 결과가 일치해야 한다.

