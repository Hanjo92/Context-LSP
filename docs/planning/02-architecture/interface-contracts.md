---
id: INTERFACE-CONTRACTS
type: architecture
status: draft
related_adrs:
  - "[[ADR-0005-context-pack-contract]]"
related_skills:
  - "[[skill-retrieve-project-context]]"
  - "[[skill-plan-with-project-brain]]"
---

> Context Links: [[00-index]] · [[retrieval-pipeline]] · [[module-context-retriever]] · [[module-constraint-extractor]]

# 공개 인터페이스 계약

이 문서는 스킬과 모듈이 공유하는 데이터 형태를 고정한다. 실제 구현 언어가 정해지기 전까지는 JSON-like 구조를 권위 계약으로 사용한다.

## ProjectSnapshot

저장소의 현재 상태를 요약한다.

```json
{
  "root": "/path/to/project",
  "mode": "greenfield | brownfield | mixed",
  "languages": ["typescript"],
  "frameworks": ["nextjs"],
  "entrypoints": [{"path": "src/app/page.tsx", "confidence": "confirmed"}],
  "test_structure": {"paths": ["tests"], "runner": "unknown"},
  "docs_state": "missing | partial | ready | stale",
  "evidence": [{"path": "package.json", "reason": "framework detection"}]
}
```

## ContextQuery

사용자 요청을 검색 가능한 형태로 정규화한다.

```json
{
  "task": "결제 모듈에 카카오페이 추가",
  "task_type": "plan | code | review | bootstrap | analyze | product | docs-update",
  "target_paths": ["src/payments"],
  "target_concepts": ["payment", "external-api"],
  "must_include": ["ADR", "module"],
  "risk_hints": ["architecture-drift", "external-provider"]
}
```

## ContextPack

Codex가 계획이나 코드 출력 전에 읽는 최소 컨텍스트 묶음이다.

```json
{
  "query": "ContextQuery",
  "documents": [{"id": "ADR-0005", "path": "docs/planning/05-adrs/ADR-0005-context-pack-contract.md", "why_relevant": "contract rule"}],
  "code_refs": [{"path": "src/payments/service.ts", "symbol": "PaymentService", "confidence": "confirmed"}],
  "constraints": ["Constraint"],
  "trace_links": ["TraceLink"],
  "confidence": "high | medium | low",
  "gaps": ["테스트 구조를 찾지 못함"]
}
```

## Constraint

설계와 구현이 지켜야 하는 규칙이다.

```json
{
  "id": "CONSTRAINT-PAYMENT-PORT",
  "level": "must | should | warn",
  "statement": "외부 결제사는 port/adapter 경계 뒤에 둔다.",
  "source": {"doc": "ADR-0005-context-pack-contract", "section": "Decision"},
  "applies_to": ["plan", "code", "review"]
}
```

## TraceLink

요구사항, 문서, 코드, 테스트의 연결이다.

```json
{
  "from": {"type": "use-case", "id": "UC-PLAN"},
  "to": {"type": "module", "id": "MOD-PLANNING-GUARD"},
  "relation": "satisfies | constrains | implements | verifies | updates",
  "evidence": "docs/planning/03-modules/module-planning-guard.md"
}
```

## VerificationFinding

검증 결과를 사람이 판단 가능한 단위로 기록한다.

```json
{
  "severity": "info | warning | error",
  "kind": "architecture-drift | missing-doc | stale-doc | weak-evidence",
  "message": "결제 구현은 adapter에 있으나 모듈 문서가 갱신되지 않았다.",
  "evidence": [{"path": "src/payments/kakao.ts"}, {"doc": "module-output-guard"}],
  "recommended_action": "module 문서에 새 provider를 추가한다."
}
```

## SkillInvocation

Codex 스킬 호출 조건과 산출물을 기록한다.

```json
{
  "skill": "plan-with-project-brain",
  "trigger": "사용자가 구현 계획을 요청함",
  "inputs": ["ContextQuery", "ContextPack"],
  "outputs": ["implementation-plan", "constraints-summary"],
  "forbidden_actions": ["ContextPack 없이 구현 범위 확정"]
}
```
