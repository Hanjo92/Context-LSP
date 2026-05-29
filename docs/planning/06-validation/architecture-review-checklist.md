---
id: ARCHITECTURE-REVIEW-CHECKLIST
type: validation
status: draft
related_adrs:
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-verify-architecture-drift]]"
---

> Context Links: [[00-index]] · [[module-output-guard]] · [[module-drift-detector]] · [[traceability-model]]

# 아키텍처 리뷰 체크리스트

## 계획 전

- [ ] `ContextQuery`가 작성되었다.
- [ ] 관련 ADR과 모듈 문서가 검색되었다.
- [ ] `ContextPack.confidence`와 gaps가 명시되었다.
- [ ] must/should/warn Constraint가 분리되었다.

## 코드 출력 전

- [ ] 변경 파일이 계획 범위 안에 있다.
- [ ] 관련 모듈 책임을 침범하지 않는다.
- [ ] 설계 위반 가능성은 source가 있는 warning으로 표현된다.
- [ ] hard block은 사용자 승인 없이 수행하지 않는다.

## 코드 출력 후

- [ ] 변경 파일과 관련 문서가 다시 연결되었다.
- [ ] ADR과 충돌하는 변경이 있는지 확인했다.
- [ ] 문서 갱신 후보가 있으면 [[skill-update-project-brain]]으로 넘긴다.
- [ ] finding에는 evidence와 recommended action이 있다.

## 문서 품질

- [ ] 문서에는 frontmatter가 있다.
- [ ] 문서에는 `Context Links`가 있다.
- [ ] 관련 ADR, 모듈, 스킬이 wikilink로 연결된다.
- [ ] confirmed/assumed/stale 상태가 혼동되지 않는다.

