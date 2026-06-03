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
node src/cli.js output-guard --docs docs/planning --root . --task "ContextPack code_refs 확인" --type code --target src/core/retriever.js --plan "Use retrieved ContextPack constraints before editing."
node src/cli.js verify --docs docs/planning --root . --changed src/core/retriever.js
node src/cli.js diagnostics --docs docs/planning --root . --changed src/core/retriever.js
node src/cli.js recommend-doc-updates --docs docs/planning --root . --changed src/core/retriever.js
node src/cli.js init-project-brain --root /tmp/context-lsp-greenfield --name "Sample" --idea "Sample product idea"
node src/cli.js reverse-engineer --root test/fixtures/brownfield --docs /tmp/context-lsp-brownfield-docs
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
| `G-OUTPUT-GUARD` | 코드 출력 후보를 `ContextPack` 제약과 대상 경로 traceability에 대조해 source-backed warning과 대안을 hard block 없이 보고한다. | `src/core/output-guard.js`, `src/cli.js`, `skills/generate-compliant-code/SKILL.md` |
| `G-DOC-UPDATE-RECOMMENDER` | drift finding을 최소 문서 갱신 추천, TraceLink 후보, ADR 후보로 변환한다. | `src/core/doc-update-recommender.js`, `src/cli.js`, `skills/update-project-brain/SKILL.md` |
| `G-LSP-DIAGNOSTICS` | verification finding을 관련 계획 문서 정보가 포함된 advisory LSP-style diagnostic으로 변환한다. | `src/core/lsp-diagnostics.js`, `src/cli.js` |
| `G-BROWNFIELD-REVERSE-ENGINEER` | 기존 저장소의 manifest/source/test evidence를 분석해 색인 가능한 초기 Context Vault를 생성한다. | `src/core/repository-analyzer.js`, `src/cli.js`, `skills/reverse-engineer-project/SKILL.md` |
| `G-GREENFIELD-INIT-PROJECT-BRAIN` | Greenfield 제품 아이디어에서 색인 가능한 초기 Context Vault를 생성한다. | `src/core/project-brain.js`, `src/cli.js`, `skills/init-project-brain/SKILL.md` |
| `G-CONSTRAINT-SOURCES` | `must`, `should`, `warn` 제약을 source path와 함께 추출한다. | `src/core/constraints.js` |
| `G-WARNING-FIRST` | v1 검증은 finding을 보고하지만 사용자 작업을 hard block하지 않는다. | `src/core/verify.js`, [[ADR-0006-warning-first-architecture-guard]] |
| `G-PLUGIN-SCAFFOLD` | repo-local Codex plugin manifest와 CLI 연동 스킬 스캐폴드가 유효하다. | `.codex-plugin/plugin.json`, `skills/*/SKILL.md` |

## 명시적 비보장

- 임베딩 기반 의미 검색은 아직 제공하지 않는다.
- `ContextPack.code_refs`는 regex 기반 symbol/keyword 검색이며 AST 또는 embedding 기반 의미 검색은 아니다.
- drift detector는 명시 Markdown TraceLink와 코드 경로 언급을 확인하며, 실제 diff hunk나 의미론적 아키텍처 일치까지 판단하지 않는다.
- output guard는 검색된 제약과 target path 근거를 보고하며, 실제 코드의 의미론적 준수 여부를 증명하지 않는다.
- doc update recommender는 초안 후보만 만들며 사용자 승인 없이 권위 문서를 직접 수정하지 않는다.
- 언어/프레임워크 추론은 Phase 1에서 얕은 evidence 판별만 제공한다.
- reverse-engineer 문서는 module boundary를 후보로 기록하며, confirmed architecture decision으로 승격하지 않는다.
- init-project-brain 문서는 제품/모듈/ADR 초안을 draft로 생성하며 사용자 확정을 대신하지 않는다.
- heading fragment matching은 Phase 1에서 정확한 heading text 기준으로만 동작한다.
- Codex plugin은 repo-local scaffold이며 marketplace 배포 또는 skill workflow end-to-end 실행 테스트 상태가 아니다.
- 실시간 LSP 서버 프로세스는 아직 구현되지 않았고, Phase 1은 CLI JSON diagnostic adapter만 제공한다.
