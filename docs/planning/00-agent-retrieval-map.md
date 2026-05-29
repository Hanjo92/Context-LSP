---
id: AGENT-RETRIEVAL-MAP
type: index
status: draft
related_adrs:
  - "[[ADR-0003-local-rag-lite-first]]"
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
---

> Context Links: [[00-index]] · [[interface-contracts]] · [[retrieval-pipeline]] · [[skills-overview]]

# 에이전트 검색 지도

이 문서는 미래 Codex/서브 에이전트가 Context-LSP 작업을 시작할 때 가장 먼저 읽는 탐색 지도다. 작업 목적을 모르면 이 문서와 [[00-current-state]], [[product-vision]]을 먼저 읽는다.

## 공통 규칙

- 추론보다 근거를 우선한다. 문서, 코드 경로, ADR, 테스트 결과 중 하나를 출처로 남긴다.
- `ContextPack` 없이 구현 계획이나 코드 수정 제안을 확정하지 않는다.
- Greenfield와 Brownfield는 시작점만 다르고 [[interface-contracts#ContextPack]]으로 합류한다.
- 문서가 오래됐거나 코드와 충돌하면 [[module-drift-detector]]의 finding으로 기록하고, [[skill-update-project-brain]]으로 문서 갱신 초안을 만든다.

## 작업 유형별 첫 문서

| 작업 유형 | 먼저 읽을 문서 3개 | 필수 ADR | 관련 스킬 | 금지된 추론 |
| --- | --- | --- | --- | --- |
| 제품 방향 변경 | [[product-vision]], [[roadmap]], [[00-current-state]] | [[ADR-0001-codex-centered-runtime]] | [[skill-update-project-brain]] | 제품 범위를 LSP 전체 제품으로 확장한다고 단정하지 않는다. |
| 빈 프로젝트 부트스트랩 | [[skill-init-project-brain]], [[context-vault-model]], [[templates/template-context-note]] | [[ADR-0004-greenfield-and-brownfield-bootstrap]] | [[skill-context-bootstrap]], [[skill-init-project-brain]] | 코드 생성부터 시작하지 않는다. |
| 기존 프로젝트 분석 | [[skill-reverse-engineer-project]], [[module-repository-analyzer]], [[traceability-model]] | [[ADR-0004-greenfield-and-brownfield-bootstrap]] | [[skill-reverse-engineer-project]] | 폴더명만 보고 아키텍처를 확정하지 않는다. |
| 구현 계획 작성 | [[skill-plan-with-project-brain]], [[retrieval-pipeline]], [[interface-contracts]] | [[ADR-0005-context-pack-contract]] | [[skill-retrieve-project-context]], [[skill-plan-with-project-brain]] | 관련 없는 문서까지 대량 주입하지 않는다. |
| 코드 출력 | [[skill-generate-compliant-code]], [[module-output-guard]], [[architecture-review-checklist]] | [[ADR-0006-warning-first-architecture-guard]] | [[skill-generate-compliant-code]] | warning을 사용자 승인 없는 hard block으로 바꾸지 않는다. |
| 설계 검증 | [[skill-verify-architecture-drift]], [[module-drift-detector]], [[retrieval-quality-checklist]] | [[ADR-0006-warning-first-architecture-guard]] | [[skill-verify-architecture-drift]] | 코드와 문서 중 하나만 진실이라고 가정하지 않는다. |
| 구현 보장 확인 | [[implementation-guarantees]], [[acceptance-scenarios]], [[architecture-review-checklist]] | [[ADR-0006-warning-first-architecture-guard]] | [[skill-verify-architecture-drift]] | 테스트나 검증 명령 없는 보장을 추가하지 않는다. |

## 최소 검색 순서

1. 사용자 요청을 `ContextQuery`로 요약한다.
2. [[glossary]]에서 용어를 정규화한다.
3. 작업 유형별 첫 문서와 필수 ADR을 읽는다.
4. [[module-context-retriever]]를 통해 관련 문서, 코드 경로, ADR을 `ContextPack`에 담는다.
5. [[module-constraint-extractor]]로 강제 규칙과 권장 규칙을 분리한다.
