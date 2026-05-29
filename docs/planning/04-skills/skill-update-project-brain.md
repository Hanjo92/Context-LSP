---
id: SKILL-UPDATE-PROJECT-BRAIN
type: skill
status: draft
related_adrs:
  - "[[ADR-0002-obsidian-wikilink-vault]]"
related_skills:
  - "[[skill-verify-architecture-drift]]"
---

> Context Links: [[00-index]] · [[module-doc-update-recommender]] · [[context-vault-model]] · [[templates/template-context-note]]

# 스킬: update-project-brain

## 호출 조건

코드나 계획 변경으로 Context Vault 문서를 갱신해야 할 때 호출한다.

## 필요한 컨텍스트

- `VerificationFinding[]`
- 변경 요약
- 영향을 받은 문서
- 관련 ADR과 TraceLink

## 실행 단계

1. [[module-doc-update-recommender]]로 갱신 후보를 만든다.
2. 기존 문서의 상태와 권위 수준을 확인한다.
3. 최소 범위의 수정 초안을 작성한다.
4. 새 결정이 필요하면 ADR 후보로 분리한다.
5. 갱신 후 [[module-context-indexer]] 재색인을 요청한다.

## 생성/수정 가능한 산출물

- 문서 수정 초안
- 새 TraceLink
- ADR 후보
- stale -> draft/confirmed 상태 변경 제안

## 금지 행동

- 사용자 승인 없는 대규모 문서 재작성을 하지 않는다.
- 코드 변경과 무관한 문서 품질 개선을 섞지 않는다.
- 기존 결정의 의미를 바꾸면서 ADR을 남기지 않는 일을 피한다.

## 연결 모듈

- [[module-doc-update-recommender]]
- [[module-context-vault-manager]]
- [[module-context-indexer]]

