---
id: SOURCE-GEMINI-IDEA
type: reference
status: draft
related_adrs:
  - "[[ADR-0001-codex-centered-runtime]]"
  - "[[ADR-0004-greenfield-and-brownfield-bootstrap]]"
related_skills:
  - "[[skill-context-bootstrap]]"
---

> Context Links: [[00-index]] · [[product-vision]] · [[users-and-use-cases]] · [[system-overview]]

# 원본 Gemini 아이디어 요약

Source file: `/Users/song/Downloads/AI-대학원-커리큘럼-및-학습-로드맵.md`

## 핵심 문제의식

프로젝트 규모가 커질수록 초기 기획과 설계에서 벗어난 임시방편 코드가 생긴다. AI 코딩 도구는 열린 파일 몇 개만 보고 작업할 때 프로젝트의 큰 그림을 잃고, 그 결과 환각과 아키텍처 부식이 생긴다.

## 제품 아이디어

프로젝트의 기획, 설계, 구현 현황, ADR, 코드 경로를 Obsidian형 지식 그래프로 관리하고, Codex 스킬이 planning과 code output 단계에서 이 지식 그래프를 통과하게 만든다.

## 대화에서 나온 스킬 흐름

- `Retrieve_Project_Context`: 작업 요청과 관련된 문서와 코드 맥락을 검색한다.
- `Generate_Compliant_Code`: 검색된 설계 제약을 코드 생성 컨텍스트에 주입한다.
- `Init_Project_Architect`: 빈 프로젝트에서 초기 설계 문서와 폴더 구조를 먼저 만든다.
- `Reverse_Engineer_Context`: 기존 프로젝트에서 코드 구조와 관례를 역으로 문서화한다.
- `Verify_Architecture`: 생성 코드가 설계 문서와 충돌하는지 검증한다.

## 보강한 요구

- 단순 문서 관리가 아니라 에이전트 실행 전후의 컨텍스트 게이트로 설계한다.
- Greenfield와 Brownfield를 분리하되 같은 `ContextPack` 계약으로 합류시킨다.
- 문서 신뢰도, drift 감지, 문서 업데이트 제안 흐름을 추가한다.
- v1은 LSP 실시간 경고보다 Codex 스킬/로컬 CLI 기반 실행 가능성을 우선한다.

