---
id: INDEX
type: index
status: draft
related_adrs:
  - "[[ADR-0001-codex-centered-runtime]]"
  - "[[ADR-0002-obsidian-wikilink-vault]]"
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-plan-with-project-brain]]"
---

> Context Links: [[00-agent-retrieval-map]] · [[00-current-state]] · [[product-vision]] · [[system-overview]]

# Context-LSP 기획 볼트

Context-LSP는 AI 코딩 에이전트가 프로젝트의 기획/설계 의도를 planning, code output, review 단계에서 반드시 통과하게 만드는 Codex 중심 컨텍스트 레이어다.

## 권위 문서

- 제품 방향: [[product-vision]]
- 사용자 흐름: [[users-and-use-cases]]
- 시스템 구조: [[system-overview]]
- 공개 계약: [[interface-contracts]]
- 검색/컨텍스트 흐름: [[retrieval-pipeline]]
- 모듈 목록: [[modules-overview]]
- Codex 스킬 목록: [[skills-overview]]
- 검증 시나리오: [[acceptance-scenarios]]

## 작업별 진입점

| 작업 | 먼저 읽을 문서 | 반드시 확인할 결정 |
| --- | --- | --- |
| 빈 프로젝트 초기 설계 | [[skill-init-project-brain]], [[context-vault-model]], [[ADR-0004-greenfield-and-brownfield-bootstrap]] | 설계 문서가 코드보다 먼저 생성된다. |
| 기존 프로젝트 역분석 | [[skill-reverse-engineer-project]], [[module-repository-analyzer]], [[traceability-model]] | 코드 관례는 추론이 아니라 증거 기반으로 기록한다. |
| 구현 계획 작성 | [[skill-plan-with-project-brain]], [[retrieval-pipeline]], [[ADR-0005-context-pack-contract]] | 계획 전에 `ContextPack`을 만든다. |
| 코드 출력 제약 | [[skill-generate-compliant-code]], [[module-output-guard]], [[ADR-0006-warning-first-architecture-guard]] | v1은 차단보다 경고와 근거 제시를 우선한다. |
| 설계 drift 검증 | [[skill-verify-architecture-drift]], [[module-drift-detector]], [[architecture-review-checklist]] | 문서와 코드의 불일치를 finding으로 남긴다. |

## 핵심 흐름

Greenfield 흐름은 사용자 아이디어에서 시작해 [[skill-context-bootstrap]]이 빈 저장소를 감지하고, [[skill-init-project-brain]]이 초기 기획/ADR/모듈 문서를 만든 뒤 같은 Context Vault를 이후 작업에 재사용한다.

Brownfield 흐름은 기존 저장소 분석에서 시작해 [[skill-reverse-engineer-project]]가 코드 구조, 관례, 의존성, 테스트 구조를 문서화하고, 그 결과를 기준선으로 삼아 이후 변경 작업을 검증한다.

공통 런타임 흐름은 `ContextQuery` -> `ContextPack` -> `Constraint` 추출 -> planning guard -> output guard -> drift verification -> doc update recommendation이다.

## 비범위

- v1은 모든 IDE를 실시간으로 제어하는 완전한 LSP 제품이 아니다.
- v1은 아키텍처 위반을 자동으로 차단하지 않는다.
- v1은 문서가 틀린 경우에도 무조건 문서를 우선하지 않는다. 신뢰도와 증거를 함께 기록한다.

