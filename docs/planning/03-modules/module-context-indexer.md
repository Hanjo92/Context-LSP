---
id: MOD-CONTEXT-INDEXER
type: module
status: draft
related_adrs:
  - "[[ADR-0003-local-rag-lite-first]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
---

> Context Links: [[00-index]] · [[retrieval-pipeline]] · [[module-context-retriever]] · [[retrieval-quality-checklist]]

# 모듈: Context Indexer

## 책임

Markdown 문서, wikilink, frontmatter, 코드 경로, heading을 검색 가능한 인덱스로 만든다.

## 입력

- Context Vault 경로
- 저장소 코드 경로
- 제외 패턴
- 인덱스 갱신 요청

## 출력

- 문서 ID -> 파일 경로 매핑
- wikilink graph
- heading/tag/frontmatter index
- 코드 파일 경로와 심볼 후보

## 의존 모듈

- [[module-context-vault-manager]]: 문서 상태와 frontmatter를 읽는다.
- [[module-context-retriever]]: 생성된 인덱스를 소비한다.

## 실패 모드

- 동일한 문서 ID가 여러 파일에 존재한다.
- 깨진 wikilink를 조용히 무시한다.
- dependency/build output을 색인해 검색 품질을 떨어뜨린다.

## 검증 방법

- 깨진 wikilink와 중복 ID를 report한다.
- `rg` 기반 검색과 frontmatter 검색 결과가 같은 문서를 찾는지 샘플링한다.
- [[retrieval-quality-checklist]]의 색인 항목을 통과한다.

