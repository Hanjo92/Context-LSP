---
id: SKILL-REVERSE-ENGINEER-PROJECT
type: skill
status: draft
related_adrs:
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
related_skills:
  - "[[skill-context-bootstrap]]"
---

> Context Links: [[00-index]] · [[module-repository-analyzer]] · [[traceability-model]] · [[retrieval-quality-checklist]]

# 스킬: reverse-engineer-project

## 호출 조건

기존 코드가 있는 프로젝트에서 설계 문서, 코드맵, 관례, 테스트 구조를 역으로 구축해야 할 때 호출한다.

## 필요한 컨텍스트

- 저장소 루트
- 분석 제외 패턴
- 사용자 관심 영역
- 기존 문서 위치

## 실행 단계

1. manifest, source tree, tests, config 파일을 탐색한다.
2. [[module-repository-analyzer]]로 evidence 기반 분석을 만든다.
3. 분석 결과를 confirmed/assumed/unknown으로 분류한다.
4. [[module-context-vault-manager]]로 Context Vault 문서에 기록한다.
5. [[module-context-indexer]] 갱신을 요청한다.

## 생성/수정 가능한 산출물

- repository overview
- module map
- test structure note
- architecture assumptions
- TraceLink 후보

## 금지 행동

- 증거 없는 패턴을 확정 설계로 쓰지 않는다.
- 기존 사용자 문서를 덮어쓰지 않는다.
- dead code나 unrelated refactor를 수행하지 않는다.

## 연결 모듈

- [[module-repository-analyzer]]
- [[module-context-vault-manager]]
- [[module-context-indexer]]

