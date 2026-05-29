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
- 현재 작업 폴더는 `/Users/song/Projects/Context-LSP`이며 GitHub private 저장소 `Hanjo92/Context-LSP`의 `main` 브랜치와 연결되어 있다.
- Phase 1 MVP는 Node.js ESM과 표준 `node:test` 기반으로 구현되어 있다.
- 현재 구현 보장점은 [[implementation-guarantees]]와 `node src/cli.js guarantees`가 권위 source다.

## 열린 결정

- 임베딩 제공자는 아직 정하지 않았다. v1 문서는 local rag-lite 우선만 결정한다.
- LSP 서버 구현 시점은 roadmap의 후순위로 남긴다.
- persistent index 파일, LSP adapter는 아직 구현되지 않았다.

## 최근 변경

- 원본 Gemini 대화에서 제품 문제, Codex 스킬 파이프라인, Greenfield/Brownfield 부트스트랩 요구를 추출했다.
- 전체 기획 볼트 구조를 `docs/planning` 아래에 두기로 했다.
- private GitHub 저장소를 만들고 Phase 1 MVP를 `34e77e8` 커밋으로 push했다.
- 보장점 레지스트리를 코드와 문서에 등록했다.

## 다음 ADR 후보

- 저장소 인덱스 파일 형식
- heading fragment validation
- Codex plugin marketplace 배포 정책
