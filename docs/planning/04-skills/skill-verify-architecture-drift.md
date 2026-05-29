---
id: SKILL-VERIFY-ARCHITECTURE-DRIFT
type: skill
status: draft
related_adrs:
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-update-project-brain]]"
---

> Context Links: [[00-index]] · [[module-drift-detector]] · [[traceability-model]] · [[architecture-review-checklist]]

# 스킬: verify-architecture-drift

## 호출 조건

코드 변경, 계획 변경, 문서 변경 후 설계와 구현 상태가 어긋났는지 확인해야 할 때 호출한다.

## 필요한 컨텍스트

- 변경 파일 목록
- 관련 `ContextPack`
- 기존 TraceLink
- 검증 기준

## 실행 단계

1. 변경 경로와 관련 문서를 다시 검색한다.
2. [[module-drift-detector]]로 finding을 만든다.
3. severity와 evidence를 붙인다.
4. 문서 갱신이 필요하면 [[skill-update-project-brain]]으로 넘긴다.
5. 최종 보고서에 남은 risk와 다음 조치를 쓴다.

## 생성/수정 가능한 산출물

- `VerificationFinding[]`
- drift report
- doc update request

## 금지 행동

- 테스트 통과만으로 설계 일치까지 보장한다고 말하지 않는다.
- evidence 없는 finding을 만들지 않는다.
- stale 문서를 조용히 authoritative로 쓰지 않는다.

## 연결 모듈

- [[module-drift-detector]]
- [[module-context-retriever]]
- [[module-doc-update-recommender]]

