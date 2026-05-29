---
id: RETRIEVAL-PIPELINE
type: architecture
status: draft
related_adrs:
  - "[[ADR-0003-local-rag-lite-first]]"
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
---

> Context Links: [[00-index]] · [[interface-contracts]] · [[module-context-indexer]] · [[module-context-retriever]]

# 검색 파이프라인

## 목표

검색 파이프라인은 Codex에게 많은 문서를 던지는 기능이 아니다. 작업에 필요한 문서, ADR, 코드 경로, 제약을 선별해 `ContextPack`으로 구성하는 기능이다.

## 단계

1. Query Normalize: 사용자 요청을 [[interface-contracts#ContextQuery]]로 바꾼다.
2. Candidate Search: 파일명, heading, wikilink, tag, 키워드, 코드 경로를 검색한다.
3. Graph Expansion: 직접 관련 문서의 ADR, 모듈, 스킬 역링크를 한 단계 확장한다.
4. Evidence Ranking: 출처, 최근성, 상태, 작업 유형 적합도를 기준으로 정렬한다.
5. Constraint Extraction: [[module-constraint-extractor]]가 must/should/warn 규칙을 분리한다.
6. Pack Assembly: 중복을 제거하고 [[interface-contracts#ContextPack]]을 만든다.

## v1 검색 방식

- Markdown heading과 wikilink 파싱
- `rg` 기반 키워드 검색
- 파일 경로와 코드 심볼 후보 검색
- frontmatter의 `id`, `type`, `status`, `related_adrs`, `related_skills` 사용

임베딩 검색은 후속 확장으로 둔다. v1은 로컬에서 재현 가능하고 설명 가능한 rag-lite를 우선한다.

## 랭킹 기준

| 신호 | 우선도 | 설명 |
| --- | --- | --- |
| 필수 ADR 직접 링크 | 높음 | 해당 작업의 결정 근거다. |
| 모듈/스킬 직접 링크 | 높음 | 구현 경계를 설명한다. |
| confirmed 상태 | 높음 | 증거가 있는 문서다. |
| stale 상태 | 낮음 | drift 후보로만 사용한다. |
| 키워드 단독 매칭 | 중간 | graph link가 없으면 보조 신호다. |

## 실패 처리

- 검색 결과가 없으면 `ContextPack.confidence`를 `low`로 둔다.
- 필수 문서가 없으면 [[skill-update-project-brain]]으로 문서 생성 후보를 제안한다.
- 결과가 너무 많으면 작업 유형별 첫 문서와 ADR을 우선한다.

