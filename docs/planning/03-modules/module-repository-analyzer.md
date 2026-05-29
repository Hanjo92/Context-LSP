---
id: MOD-REPOSITORY-ANALYZER
type: module
status: draft
related_adrs:
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
related_skills:
  - "[[skill-reverse-engineer-project]]"
---

> Context Links: [[00-index]] · [[modules-overview]] · [[traceability-model]] · [[skill-reverse-engineer-project]]

# 모듈: Repository Analyzer

## 책임

기존 저장소의 언어, 프레임워크, 폴더 구조, 주요 진입점, 테스트 구조, 코드 관례를 증거 기반으로 분석한다.

## 입력

- 작업 루트 경로
- `ProjectSnapshot`
- 제외 패턴: build output, dependency directory, generated files

## 출력

- 언어/프레임워크 후보와 confidence
- entrypoint, test runner, dependency manifest
- 레이어/모듈 관례 후보
- evidence가 포함된 분석 메모

## 의존 모듈

- [[module-context-vault-manager]]: 분석 결과를 문서화할 때 사용
- [[module-context-indexer]]: 코드 경로와 심볼 후보를 색인할 때 사용

## 실패 모드

- 폴더 이름만 보고 아키텍처를 확정한다.
- 테스트가 없다는 사실과 테스트 구조를 찾지 못했다는 사실을 혼동한다.
- 생성 파일이나 외부 dependency를 실제 코드로 분석한다.

## 검증 방법

- 분석 결과마다 근거 경로가 붙어 있는지 확인한다.
- confidence가 낮은 추정은 `assumed`로 기록한다.
- [[retrieval-quality-checklist]]의 Brownfield 항목을 통과해야 한다.

