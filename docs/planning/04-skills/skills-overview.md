---
id: SKILLS-OVERVIEW
type: skill-index
status: draft
related_adrs:
  - "[[ADR-0001-codex-centered-runtime]]"
related_skills:
  - "[[skill-context-bootstrap]]"
---

> Context Links: [[00-index]] · [[codex-runtime-and-agent-policy]] · [[modules-overview]] · [[interface-contracts]]

# 스킬 개요

## 스킬 체인

1. [[skill-context-bootstrap]]: 프로젝트 상태를 판별한다.
2. [[skill-init-project-brain]] 또는 [[skill-reverse-engineer-project]]: Context Vault를 구축한다.
3. [[skill-retrieve-project-context]]: 작업 관련 컨텍스트를 검색한다.
4. [[skill-plan-with-project-brain]]: 컨텍스트 기반 계획을 만든다.
5. [[skill-generate-compliant-code]]: 제약을 반영해 코드 출력을 가드한다.
6. [[skill-verify-architecture-drift]]: 변경 후 설계 drift를 검증한다.
7. [[skill-update-project-brain]]: 필요한 문서 갱신을 제안한다.

## 공통 금지 행동

- `ContextPack` 없이 구현 계획을 확정하지 않는다.
- Brownfield에서 증거 없는 추정을 confirmed로 기록하지 않는다.
- 사용자 승인 없이 아키텍처 경고를 hard block으로 바꾸지 않는다.
- unrelated refactor나 광범위한 문서 재작성으로 범위를 넓히지 않는다.

## 스킬 설계 기준

각 스킬 문서는 호출 조건, 필요한 컨텍스트, 실행 단계, 생성/수정 가능한 산출물, 금지 행동, 연결 모듈을 포함한다.

