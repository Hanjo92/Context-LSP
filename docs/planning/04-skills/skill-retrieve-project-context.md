---
id: SKILL-RETRIEVE-PROJECT-CONTEXT
type: skill
status: draft
related_adrs:
  - "[[ADR-0003-local-rag-lite-first]]"
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-plan-with-project-brain]]"
  - "[[skill-generate-compliant-code]]"
---

> Context Links: [[00-index]] · [[retrieval-pipeline]] · [[module-context-retriever]] · [[interface-contracts]]

# 스킬: retrieve-project-context

## 호출 조건

구현 계획, 코드 수정, 설계 검증, 문서 갱신 전에 작업 관련 컨텍스트를 모아야 할 때 호출한다.

## 필요한 컨텍스트

- 사용자 요청
- 작업 유형
- 대상 파일/모듈 힌트
- Context Vault index

## 실행 단계

1. 요청을 [[interface-contracts#ContextQuery]]로 정규화한다.
2. [[module-context-retriever]]가 관련 문서와 코드 경로를 찾는다.
3. [[module-constraint-extractor]]가 제약을 추출한다.
4. 중복과 low-value 문서를 제거해 `ContextPack`을 만든다.
5. confidence와 gaps를 명시한다.

## 생성/수정 가능한 산출물

- `ContextQuery`
- `ContextPack`
- retrieval gaps report

## 금지 행동

- 관련 없는 문서를 대량 주입하지 않는다.
- low-confidence 결과를 확정 근거로 사용하지 않는다.
- 필수 ADR 누락을 조용히 넘어가지 않는다.

## 연결 모듈

- [[module-context-indexer]]
- [[module-context-retriever]]
- [[module-constraint-extractor]]

