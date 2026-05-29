---
id: MOD-DOC-UPDATE-RECOMMENDER
type: module
status: draft
related_adrs:
  - "[[ADR-0002-obsidian-wikilink-vault]]"
related_skills:
  - "[[skill-update-project-brain]]"
---

> Context Links: [[00-index]] · [[module-drift-detector]] · [[context-vault-model]] · [[templates/template-context-note]]

# 모듈: Doc Update Recommender

## 책임

검증 결과와 변경 파일을 바탕으로 어떤 문서를 어떻게 갱신해야 하는지 초안을 제안한다.

## 입력

- `VerificationFinding[]`
- 변경된 코드 경로
- 관련 문서와 ADR
- 문서 템플릿

## 출력

- 갱신 대상 문서 목록
- 추가/수정할 섹션 초안
- 새 TraceLink 후보
- 사용자 승인 필요 여부

## 의존 모듈

- [[module-drift-detector]]
- [[module-context-vault-manager]]

## 실패 모드

- 코드 변경보다 넓은 문서 리라이트를 제안한다.
- ADR이 필요한 결정을 일반 문서 변경으로만 처리한다.
- 사용자가 승인하지 않은 상태에서 권위 문서를 덮어쓴다.

## 검증 방법

- 제안은 변경 파일과 finding에 직접 연결된다.
- 새 결정은 ADR 후보로 표시한다.
- 문서 갱신은 최소 범위로 제안한다.

