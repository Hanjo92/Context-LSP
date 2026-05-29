---
id: ADR-0002
type: adr
status: accepted
related_adrs:
  - "[[ADR-0003-local-rag-lite-first]]"
related_skills:
  - "[[skill-init-project-brain]]"
  - "[[skill-update-project-brain]]"
---

> Context Links: [[00-index]] · [[context-vault-model]] · [[traceability-model]] · [[templates/template-context-note]]

# ADR-0002: Obsidian형 wikilink vault를 문서 기본 구조로 쓴다

## 상태

Accepted

## 맥락

원본 아이디어는 프로젝트를 제2의 뇌처럼 관리하고, 백링크를 통해 기획-설계-코드의 추적성을 유지하는 것이다. 일반 Markdown 링크만 쓰면 GitHub 호환성은 좋지만 문서 간 개념 그래프가 약해진다.

## 결정

Context Vault는 Markdown과 Obsidian wikilink 문법을 기본 연결 방식으로 사용한다. 모든 문서는 frontmatter와 `Context Links`를 가진다.

## 결과

- Codex와 사람이 같은 문서 그래프를 탐색할 수 있다.
- 추적성 모델을 단순 파일 목록이 아니라 개념 링크로 구성할 수 있다.
- GitHub 렌더링에서 wikilink가 직접 링크로 동작하지 않을 수 있으므로 검색/에이전트 사용성을 우선한다.

## 대안

- 일반 Markdown 상대 링크: GitHub UX는 좋지만 Obsidian형 graph가 약하다.
- 별도 graph database: 강력하지만 v1 구현 비용이 크다.

## 영향받는 문서

Impacts: [[context-vault-model]], [[traceability-model]], [[module-context-indexer]]
