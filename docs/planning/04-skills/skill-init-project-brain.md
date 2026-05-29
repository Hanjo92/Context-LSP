---
id: SKILL-INIT-PROJECT-BRAIN
type: skill
status: draft
related_adrs:
  - "[[ADR-0002-obsidian-wikilink-vault]]"
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
related_skills:
  - "[[skill-context-bootstrap]]"
---

> Context Links: [[00-index]] · [[context-vault-model]] · [[module-context-vault-manager]] · [[templates/template-context-note]]

# 스킬: init-project-brain

## 호출 조건

빈 프로젝트나 문서가 거의 없는 프로젝트에서 사용자의 아이디어를 기획/설계 문서로 먼저 구체화해야 할 때 호출한다.

## 필요한 컨텍스트

- 사용자 아이디어
- 선호 기술 스택 또는 미정 상태
- 제품 범위와 성공 기준
- 생성할 vault root

## 실행 단계

1. 제품 문제, 사용자, 유스케이스를 질문 또는 현재 입력에서 추출한다.
2. [[templates/template-context-note]]와 [[templates/template-adr]]를 사용해 초기 문서를 만든다.
3. 핵심 ADR 후보와 모듈 후보를 연결한다.
4. [[module-context-vault-manager]]로 frontmatter와 wikilink를 정리한다.
5. 이후 구현 계획이 [[interface-contracts#ContextPack]]을 통과하게 안내한다.

## 생성/수정 가능한 산출물

- product/architecture/module/ADR 초안
- project glossary
- roadmap
- 초기 retrieval map

## 금지 행동

- 기획 문서 없이 보일러플레이트 코드부터 만들지 않는다.
- 사용자가 확정하지 않은 기술 선택을 ADR confirmed로 기록하지 않는다.
- 과도한 엔터프라이즈 구조를 기본값으로 만들지 않는다.

## 연결 모듈

- [[module-context-vault-manager]]
- [[module-context-indexer]]

