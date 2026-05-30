---
id: IMPLEMENTATION-GUARANTEES
type: validation
status: confirmed
related_adrs:
  - "[[ADR-0003-local-rag-lite-first]]"
  - "[[ADR-0005-context-pack-contract]]"
  - "[[ADR-0006-warning-first-architecture-guard]]"
related_skills:
  - "[[skill-context-bootstrap]]"
  - "[[skill-retrieve-project-context]]"
  - "[[skill-verify-architecture-drift]]"
---

> Context Links: [[00-index]] · [[acceptance-scenarios]] · [[retrieval-quality-checklist]] · [[architecture-review-checklist]]

# 구현 보장점

이 문서는 현재 코드와 검증 명령으로 보장되는 동작만 기록한다. 보장점의 machine-readable source는 `node src/cli.js guarantees` 출력이다.

## 검증 명령

```bash
npm test
npm run verify
node src/cli.js retrieve --docs docs/planning --root . --task "ContextPack code_refs 확인" --type code --concept ContextPack --target src
node src/cli.js verify --docs docs/planning --root . --changed src/core/retriever.js
python3 /Users/song/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /Users/song/Projects/Context-LSP
```

## 보장점 목록

| ID | 보장 | 근거 |
| --- | --- | --- |
| `G-BOOTSTRAP-SNAPSHOT` | Greenfield, Brownfield, mixed 상태를 `ProjectSnapshot` JSON으로 판별한다. | `src/core/bootstrap.js`, `test/context-lsp.test.js` |
| `G-INDEX-WIKILINKS` | frontmatter, heading, path, wikilink를 색인한다. | `src/core/indexer.js`, `src/core/markdown.js` |
| `G-BROKEN-LINK-FINDINGS` | 깨진 wikilink를 source path와 함께 warning finding으로 보고한다. | `src/core/indexer.js`, `src/core/verify.js` |
| `G-DUPLICATE-IDS` | 중복 문서 ID를 error finding으로 보고한다. | `src/core/indexer.js`, `src/core/verify.js` |
| `G-HEADING-FRAGMENTS` | 대상 문서는 존재하지만 heading fragment가 없는 wikilink를 warning finding으로 보고한다. | `src/core/indexer.js`, `src/core/verify.js` |
| `G-CONTEXTPACK` | `ContextQuery`를 정규화하고 `ContextPack` JSON을 조립한다. | `src/core/retriever.js`, `src/cli.js` |
| `G-CODE-REFS` | `ContextPack.code_refs`를 작업 concept와 target path에 맞는 저장소 소스 경로로 채운다. | `src/core/code-search.js`, `src/core/retriever.js`, `src/cli.js` |
| `G-CODE-DOC-DRIFT` | 변경 코드 경로에 명시 TraceLink가 없거나 stale/금지 제약과 충돌하면 검색된 TraceLink evidence가 포함된 warning finding으로 보고한다. | `src/core/verify.js`, `src/cli.js` |
| `G-CONSTRAINT-SOURCES` | `must`, `should`, `warn` 제약을 source path와 함께 추출한다. | `src/core/constraints.js` |
| `G-WARNING-FIRST` | v1 검증은 finding을 보고하지만 사용자 작업을 hard block하지 않는다. | `src/core/verify.js`, [[ADR-0006-warning-first-architecture-guard]] |
| `G-PLUGIN-SCAFFOLD` | repo-local Codex plugin manifest와 CLI 연동 스킬 스캐폴드가 유효하다. | `.codex-plugin/plugin.json`, `skills/*/SKILL.md` |

## 명시적 비보장

- 임베딩 기반 의미 검색은 아직 제공하지 않는다.
- `ContextPack.code_refs`는 regex 기반 symbol/keyword 검색이며 AST 또는 embedding 기반 의미 검색은 아니다.
- drift detector는 명시 Markdown TraceLink와 코드 경로 언급을 확인하며, 실제 diff hunk나 의미론적 아키텍처 일치까지 판단하지 않는다.
- 언어/프레임워크 추론은 Phase 1에서 얕은 evidence 판별만 제공한다.
- heading fragment matching은 Phase 1에서 정확한 heading text 기준으로만 동작한다.
- Codex plugin은 repo-local scaffold이며 marketplace 배포 또는 skill workflow end-to-end 실행 테스트 상태가 아니다.
- LSP diagnostic adapter는 아직 구현되지 않았다.
