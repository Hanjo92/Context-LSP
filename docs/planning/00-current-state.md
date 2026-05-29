---
id: CURRENT-STATE
type: state
status: draft
related_adrs:
  - "[[ADR-0001-codex-centered-runtime]]"
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-update-project-brain]]"
---

> Context Links: [[00-index]] · [[source-gemini-idea]] · [[roadmap]] · [[ADR-0001-codex-centered-runtime]]

# 현재 상태

## 확정 결정

- 제품 이름은 `Context-LSP`로 둔다.
- 1차 실행 형태는 Codex 중심 스킬/플러그인이다.
- 문서 볼트는 Obsidian wikilink 스타일로 작성한다.
- Greenfield와 Brownfield를 모두 1급 플로우로 다룬다.
- v1의 설계 위반 대응은 hard block이 아니라 warning/report다.
- 현재 작업 폴더는 `/Users/song/Projects/Context-LSP`이며 최초 문서 작성 시점에는 Git 저장소가 아니다.

## 열린 결정

- 실제 구현 언어와 패키지 매니저는 아직 정하지 않았다.
- 임베딩 제공자는 아직 정하지 않았다. v1 문서는 local rag-lite 우선만 결정한다.
- LSP 서버 구현 시점은 roadmap의 후순위로 남긴다.
- GitHub 원격이 생기면 이슈 기반 운영으로 전환한다.

## 최근 변경

- 원본 Gemini 대화에서 제품 문제, Codex 스킬 파이프라인, Greenfield/Brownfield 부트스트랩 요구를 추출했다.
- 전체 기획 볼트 구조를 `docs/planning` 아래에 두기로 했다.

## 다음 ADR 후보

- 구현 언어와 런타임 선택
- 저장소 인덱스 파일 형식
- CLI 명령어 표면
- Codex plugin manifest 구조

