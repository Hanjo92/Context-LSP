---
id: CONTEXT-VAULT-MODEL
type: architecture
status: draft
related_adrs:
  - "[[ADR-0002-obsidian-wikilink-vault]]"
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
related_skills:
  - "[[skill-init-project-brain]]"
  - "[[skill-update-project-brain]]"
---

> Context Links: [[00-index]] · [[glossary]] · [[traceability-model]] · [[templates/template-context-note]]

# Context Vault 모델

## 목적

Context Vault는 사람과 Codex가 함께 읽는 프로젝트 기억 장치다. 프로젝트의 Why, What, How, Current State를 Markdown 문서와 wikilink로 연결한다.

## 기본 구성

| 문서군 | 설명 | 예시 |
| --- | --- | --- |
| Product | 문제, 사용자, 유스케이스, 로드맵 | [[product-vision]], [[users-and-use-cases]] |
| Architecture | 시스템 구조, 계약, 검색, 추적성 | [[system-overview]], [[interface-contracts]] |
| Modules | 구현 단위의 책임과 경계 | [[modules-overview]] |
| Skills | Codex가 수행할 워크플로우 | [[skills-overview]] |
| ADRs | 되돌리기 어려운 결정과 대안 | [[ADR-0001-codex-centered-runtime]] |
| Validation | 수용 기준과 품질 체크 | [[acceptance-scenarios]] |

## 문서 상태

- `draft`: 초기 설계 또는 아직 검증되지 않은 문서.
- `confirmed`: 코드, 테스트, 사용자 결정으로 확인된 문서.
- `stale`: 코드 또는 결정과 충돌 가능성이 있는 문서.
- `archived`: 현재 제품 흐름에서는 사용하지 않는 문서.

## 신뢰도 규칙

Brownfield 분석으로 생성한 내용은 기본적으로 `assumed` 또는 `confirmed-by-evidence`를 구분한다. 코드 경로, 테스트 결과, manifest, ADR 같은 근거가 없는 설명은 confirmed로 쓰지 않는다.

## 문서 갱신 규칙

코드가 바뀌면 [[module-doc-update-recommender]]는 영향을 받은 모듈/스킬/ADR을 찾아 업데이트 초안을 제안한다. 자동 갱신은 사용자가 승인한 문서에만 적용한다.

## 링크 규칙

- 모든 문서는 `[[00-index]]`로 돌아갈 수 있어야 한다.
- 모듈 문서는 관련 스킬과 ADR을 연결한다.
- 스킬 문서는 호출 조건과 생성 산출물을 연결한다.
- ADR은 영향을 받는 모듈/스킬/유스케이스를 역링크로 남긴다.

