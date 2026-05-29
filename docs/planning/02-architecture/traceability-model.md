---
id: TRACEABILITY-MODEL
type: architecture
status: draft
related_adrs:
  - "[[ADR-0002-obsidian-wikilink-vault]]"
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-verify-architecture-drift]]"
  - "[[skill-update-project-brain]]"
---

> Context Links: [[00-index]] · [[context-vault-model]] · [[interface-contracts]] · [[module-drift-detector]]

# 추적성 모델

## 목적

Traceability는 "이 코드가 왜 이렇게 생겼는가"를 찾기 위한 연결 구조다. Context-LSP는 요구사항, ADR, 모듈, 스킬, 코드 경로, 테스트를 `TraceLink`로 연결한다.

## 연결 종류

| Relation | 의미 | 예시 |
| --- | --- | --- |
| `satisfies` | 유스케이스를 충족한다. | [[module-planning-guard]] satisfies [[users-and-use-cases#UC-PLAN]] |
| `constrains` | 결정이 구현을 제한한다. | [[ADR-0006-warning-first-architecture-guard]] constrains [[module-output-guard]] |
| `implements` | 코드가 모듈 책임을 구현한다. | `src/context/retriever.ts` implements [[module-context-retriever]] |
| `verifies` | 테스트/체크가 요구를 검증한다. | [[acceptance-scenarios]] verifies [[product-vision]] |
| `updates` | 변경 후 문서 갱신이 필요하다. | [[skill-update-project-brain]] updates [[context-vault-model]] |

## Drift 판단

Drift는 문서와 코드가 다르다는 사실만으로 error가 아니다. v1은 다음처럼 구분한다.

- `info`: 문서 업데이트가 필요해 보이지만 설계 위반은 아니다.
- `warning`: 설계 제약과 다른 구현 방향이 보인다.
- `error`: 사용자가 명시한 must 제약을 어길 가능성이 높다.

## 문서 갱신 우선순위

1. ADR과 충돌하는 변경
2. 모듈 책임 또는 공개 인터페이스 변경
3. 테스트/검증 방식 변경
4. 단순 코드 경로 추가

## Backlink 품질 기준

- ADR은 영향을 받는 모듈과 스킬을 링크한다.
- 모듈은 자신을 호출하는 스킬과 만족하는 유스케이스를 링크한다.
- 스킬은 생성/수정 가능한 산출물을 링크한다.
- 검증 문서는 어떤 제품 요구를 확인하는지 링크한다.

