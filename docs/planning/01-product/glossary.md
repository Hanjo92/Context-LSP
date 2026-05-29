---
id: GLOSSARY
type: product
status: draft
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
---

> Context Links: [[00-index]] · [[interface-contracts]] · [[context-vault-model]]

# 용어 사전

## Context Vault

프로젝트의 기획, 설계, ADR, 모듈, 스킬, 구현 현황을 Obsidian형 Markdown으로 저장하는 문서 볼트. [[context-vault-model]]이 구조를 정의한다.

## Context Query

사용자의 요청을 검색 가능한 형태로 정규화한 입력. 작업 유형, 대상 모듈, 파일 힌트, 의도, 금지 조건을 담는다.

## Context Pack

Codex가 계획이나 코드 출력을 하기 전에 읽어야 하는 최소 컨텍스트 묶음. 관련 문서, ADR, 코드 경로, 제약, 신뢰도를 포함한다.

## Constraint

아키텍처, 레이어, API, 테스트, 문서 갱신에 대한 규칙. `must`, `should`, `warn` 수준으로 분리한다.

## TraceLink

요구사항, ADR, 모듈, 스킬, 코드 경로, 테스트 사이의 추적 링크.

## Drift

문서와 코드가 서로 다른 내용을 말하거나, 코드 변경으로 문서가 더 이상 현재 상태를 설명하지 못하는 상태.

## Warning-first Guard

v1에서 설계 위반 가능성을 즉시 차단하지 않고, 근거와 대안을 제시해 사용자가 승인 또는 수정을 선택하게 하는 정책.

