# Project mission overlay

Keep this overlay thin. It is a checked snapshot/pointer into project authority, not a competing source of truth.

```yaml
project_id: <stable project/repo identifier>
repo: <owner/name or local path>
checked_at: <ISO-8601 timestamp/date>
canonical_ref: <default branch + exact commit if known>

mission:
  goal: <one outcome>
  active_slice: <current authorized slice or UNKNOWN>
  non_goals:
    - <explicit exclusion>

authority_order:
  - <repo-local operating contract>
  - <accepted ADR/program/gate/current-state source>
  - <live Git/GitHub state>
  - <other evidence source>

current_gate:
  state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
  controlled_by: <authority reference>
  meaning: <what it permits and what it does not>

action_envelope:
  READ_ANALYZE:
    state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
    evidence: <why - an unfilled state means NOT_EVALUATED, which authorizes nothing>
  BUILD_LOCAL:
    state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
    evidence: <...>
  TEST_VERIFY:
    state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
    evidence: <...>
  CREATE_BRANCH:
    state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
    evidence: <...>
  PUSH:
    state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
    evidence: <...>
  OPEN_PR:
    state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
    evidence: <...>
  PROMOTE_MERGE:
    state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
    evidence: <...>
  DEPLOY_EXTERNAL_WRITE:
    state: <ALLOWED/BLOCKED/OPERATOR_ONLY/NOT_EVALUATED>
    evidence: <...>

proof_required:
  - <canonical build/check/test>
  - <runtime/external proof if applicable>

privacy_security_boundaries:
  - <secret/PII/private plane constraints>

unresolved_decisions:
  - id: <decision id>
    question: <exact unresolved semantic/authority question>
    blocks: <only the dependent lanes/actions>

stop_conditions:
  - <specific true human/external gate>
```

## Overlay rules

- Cite instead of copying large mutable backlogs or specifications.
- Use `UNKNOWN` / `NOT_EVALUATED` rather than filling gaps from memory.
- Record a live-state fact only after checking it in the current session when the repository requires live derivation.
- Do not use the overlay to relax a stronger repository rule.
- If the repository already contains a mission/task contract with equivalent semantics, reuse it and create no duplicate overlay file.
