---
id: MOD-CONTEXT-VAULT-MANAGER
type: module
status: draft
related_adrs:
  - "[[ADR-0002-obsidian-wikilink-vault]]"
related_skills:
  - "[[skill-init-project-brain]]"
  - "[[skill-update-project-brain]]"
---

> Context Links: [[00-index]] · [[context-vault-model]] · [[templates/template-context-note]] · [[module-doc-update-recommender]]

# 모듈: Context Vault Manager

## 책임

Context Vault의 디렉터리, 템플릿, frontmatter, 상태 값을 생성하고 갱신한다.

## 입력

- vault root
- 문서 타입: product, architecture, module, skill, ADR, validation
- 생성 또는 갱신 요청
- 관련 ADR/스킬/모듈 링크

## 출력

- 생성된 Markdown 문서
- 갱신된 frontmatter
- 문서 상태 변경 기록

## 의존 모듈

- [[module-context-indexer]]: 문서 생성 후 색인 갱신
- [[module-doc-update-recommender]]: 갱신 초안을 실제 문서에 반영할 때 사용

## 실패 모드

- 문서가 생겼지만 `Context Links`가 없어 검색 시작점에서 고립된다.
- ADR과 모듈/스킬 역링크가 한쪽에만 존재한다.
- stale 문서를 confirmed처럼 사용하게 만든다.

## 검증 방법

- 모든 문서에 frontmatter와 `Context Links`가 있는지 확인한다.
- ADR, 모듈, 스킬 간 wikilink가 최소 한 번 이상 연결되는지 확인한다.
- 템플릿 문서에는 필요한 공통 섹션이 포함된다.

