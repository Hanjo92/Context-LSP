---
id: ADR-0003
type: adr
status: accepted
related_adrs:
  - "[[ADR-0002-obsidian-wikilink-vault]]"
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
---

> Context Links: [[00-index]] · [[retrieval-pipeline]] · [[module-context-indexer]] · [[module-context-retriever]]

# ADR-0003: v1은 local rag-lite를 먼저 구현한다

## 상태

Accepted

## 맥락

원본 대화에서는 간이 RAG가 핵심으로 제안됐다. 하지만 초기부터 외부 임베딩, 벡터 DB, 지식 그래프 DB를 모두 도입하면 재현성과 구현 범위가 흔들린다.

## 결정

v1 검색은 로컬 Markdown/frontmatter/wikilink/heading/키워드/코드 경로 검색으로 시작한다. 임베딩 검색은 코어 계약이 안정된 뒤 확장한다.

## 결과

- 로컬에서 재현 가능한 검색 결과를 얻는다.
- 검색 실패와 누락 이유를 설명하기 쉽다.
- 의미 기반 검색 품질은 제한되므로 [[retrieval-quality-checklist]]로 보완한다.

## 대안

- 벡터 DB 우선: recall은 좋아질 수 있지만 운영 부담이 커진다.
- 수동 문서 주입: 단순하지만 자동화 가치가 낮다.

## 영향받는 문서

Impacts: [[retrieval-pipeline]], [[module-context-indexer]], [[module-context-retriever]]

