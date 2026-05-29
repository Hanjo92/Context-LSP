---
id: CODEX-RUNTIME-AND-AGENT-POLICY
type: architecture
status: draft
related_adrs:
  - "[[ADR-0001-codex-centered-runtime]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-plan-with-project-brain]]"
  - "[[skill-verify-architecture-drift]]"
---

> Context Links: [[00-index]] · [[skills-overview]] · [[system-overview]] · [[00-current-state]]

# Codex 런타임과 에이전트 정책

## 기본 런타임

v1은 Codex 스킬/플러그인을 1차 실행 표면으로 둔다. CLI와 LSP는 같은 코어 모듈을 호출하는 후속 어댑터다. 이 결정은 [[ADR-0001-codex-centered-runtime]]에 기록한다.

## Codex Skill 실행 원칙

- 스킬은 사용자의 요청 단계에 맞춰 명시적으로 호출된다.
- 계획 또는 코드 수정 전에 [[skill-retrieve-project-context]]가 `ContextPack`을 만든다.
- 코드 변경 후 [[skill-verify-architecture-drift]]가 설계 충돌과 문서 갱신 필요성을 점검한다.
- 스킬은 문서를 대량으로 주입하지 않고 작업 관련 근거만 선별한다.

## 서브 에이전트 사용 원칙

- 병렬 검토, 독립 문서 리뷰, 검색 품질 검증처럼 공유 상태 충돌이 적은 작업에 서브 에이전트를 쓴다.
- 파일을 직접 수정하는 병렬 작업은 write set이 명확히 분리된 경우에만 허용한다.
- 사용이 끝난 서브 에이전트는 종료한다.
- 서브 에이전트 결과는 그대로 믿지 않고, 최종 검증은 현재 세션에서 수행한다.

## GitHub 이슈 정책

- 저장소가 GitHub 원격을 가진 Git 저장소라면 제품 기능, 문서 패키지, 버그, 검증 작업을 이슈로 관리한다.
- 현재 `/Users/song/Projects/Context-LSP`는 초기 문서 작성 시점에 Git 저장소가 아니므로 이슈 생성은 제외한다.
- GitHub 원격이 생기면 작업 시작 전에 이슈 존재 여부를 확인하고, 없으면 새 이슈를 만든다.

## 읽기/쓰기 권한 경계

- 분석 단계는 저장소와 문서를 읽고 `ContextPack`을 만든다.
- 문서 생성/갱신은 사용자 요청 또는 명시된 스킬 흐름에서만 수행한다.
- 코드 변경은 계획과 제약 확인 후 진행한다.
- v1 guard는 사용자 승인 없는 destructive 변경, 자동 revert, hard block을 수행하지 않는다.

