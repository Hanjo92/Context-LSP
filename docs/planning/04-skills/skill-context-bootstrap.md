---
id: SKILL-CONTEXT-BOOTSTRAP
type: skill
status: draft
related_adrs:
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
related_skills:
  - "[[skill-init-project-brain]]"
  - "[[skill-reverse-engineer-project]]"
---

> Context Links: [[00-index]] · [[skills-overview]] · [[module-context-bootstrap]] · [[interface-contracts]]

# 스킬: context-bootstrap

## 호출 조건

사용자가 프로젝트 분석, 초기 설계, 문서 볼트 생성, 구현 계획 시작을 요청했지만 현재 프로젝트 상태가 명확하지 않을 때 호출한다.

## 필요한 컨텍스트

- 작업 루트
- 사용자 요청 원문
- 기존 `docs/planning` 존재 여부
- manifest/source/test directory 후보

## 실행 단계

1. [[module-context-bootstrap]]으로 `ProjectSnapshot`을 만든다.
2. Greenfield, Brownfield, mixed 중 하나로 판별한다.
3. Greenfield면 [[skill-init-project-brain]]으로 넘긴다.
4. Brownfield면 [[skill-reverse-engineer-project]]로 넘긴다.
5. mixed면 부족한 근거와 추천 경로를 사용자에게 요약한다.

## 생성/수정 가능한 산출물

- `ProjectSnapshot`
- bootstrap report
- 초기 Context Vault 생성 요청

## 금지 행동

- 상태 판별 없이 코드를 생성하지 않는다.
- Brownfield 분석 전에 설계 원칙을 단정하지 않는다.
- 문서 없는 기존 프로젝트를 Greenfield로 단순 처리하지 않는다.

## 연결 모듈

- [[module-context-bootstrap]]
- [[module-repository-analyzer]]
- [[module-context-vault-manager]]

