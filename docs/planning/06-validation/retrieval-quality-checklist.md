---
id: RETRIEVAL-QUALITY-CHECKLIST
type: validation
status: draft
related_adrs:
  - "[[ADR-0003-local-rag-lite-first]]"
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
---

> Context Links: [[00-index]] · [[retrieval-pipeline]] · [[module-context-indexer]] · [[module-context-retriever]]

# 검색 품질 체크리스트

## 인덱스 품질

- [ ] 모든 문서 ID가 유일하다.
- [ ] 모든 wikilink가 존재하는 문서 또는 의도된 future note를 가리킨다.
- [ ] build output, dependency directory, generated files는 색인에서 제외된다.
- [ ] heading, frontmatter, wikilink, 파일 경로가 검색 대상에 포함된다.

## 검색 결과 품질

- [ ] 작업 유형별 첫 문서가 [[00-agent-retrieval-map]]과 일치한다.
- [ ] 관련 ADR이 누락되지 않는다.
- [ ] 관련 모듈과 스킬이 최소 한 개 이상 연결된다.
- [ ] low-confidence 결과는 `ContextPack.gaps`에 남는다.

## Constraint 품질

- [ ] 모든 Constraint는 source를 가진다.
- [ ] must/should/warn 수준이 구분된다.
- [ ] 충돌 제약은 하나로 합치지 않고 finding 또는 gaps로 남긴다.

## Brownfield 분석 품질

- [ ] confirmed 분석에는 코드 경로 또는 manifest 근거가 있다.
- [ ] assumed 분석은 사용자 확인 또는 추가 evidence가 필요하다고 표시된다.
- [ ] unknown은 임의로 채우지 않는다.

