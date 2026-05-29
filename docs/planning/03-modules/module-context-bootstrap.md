---
id: MOD-CONTEXT-BOOTSTRAP
type: module
status: draft
related_adrs:
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-init-project-brain]]"
  - "[[skill-reverse-engineer-project]]"
---

> Context Links: [[00-index]] · [[modules-overview]] · [[interface-contracts]] · [[skill-context-bootstrap]]

# 모듈: Context Bootstrap

## 책임

현재 작업 폴더가 Greenfield, Brownfield, mixed 중 어디에 가까운지 판별하고 다음 스킬 경로를 선택한다.

## 입력

- 작업 루트 경로
- 사용자 요청
- 기존 `docs/planning` 존재 여부
- manifest, source directory, test directory 후보

## 출력

- [[interface-contracts#ProjectSnapshot]]
- 추천 다음 스킬: [[skill-init-project-brain]] 또는 [[skill-reverse-engineer-project]]
- 부족한 문서/근거 목록

## 의존 모듈

- [[module-repository-analyzer]]: Brownfield일 때 상세 분석에 사용
- [[module-context-vault-manager]]: Greenfield일 때 초기 vault 생성에 사용

## 실패 모드

- 비어 있지 않지만 코드와 문서가 모두 부족한 mixed 상태를 잘못 판별한다.
- 숨겨진 빌드 파일이나 monorepo 구조를 놓친다.
- 사용자 요청만 보고 코드 생성으로 바로 넘어간다.

## 검증 방법

- 빈 폴더에서 Greenfield로 판별한다.
- manifest와 source tree가 있는 폴더에서 Brownfield로 판별한다.
- 문서만 있고 코드가 없는 폴더는 mixed로 판별하고 사용자 의도 확인 대상으로 표시한다.

