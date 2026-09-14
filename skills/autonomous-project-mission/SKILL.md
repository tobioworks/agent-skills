---
name: autonomous-project-mission
description: "Derive and run evidence-grounded autonomous LLM engineering missions from live project and GitHub state without overriding repository authority. Use when asked to give Claude Code, Codex, ChatGPT, or another coding agent a main mission/system prompt; let an agent own a goal across an open project; inspect current repos/issues/PRs/gates before acting; decide what the agent may research, build, test, push, PR, merge, deploy, or escalate; dogfood agent autonomy across projects; or turn repeated agent failures into a reusable bounded operating loop."
metadata:
  author: tobioworks
  version: "0.0.0"
---

# Autonomous Project Mission

Use this skill as an **orchestration layer**, never as a new source of project truth.

## Core rule

Read the target project's current authority before writing anything. Repository-local operating contracts, accepted decisions, canonical program issues, current git state, and explicit operator gates outrank this skill. If the skill and project disagree, the project wins unless the user explicitly and validly changes that project authority.

Do not infer approval from tool capability, a broad request to “continue,” or the existence of a branch. **Capability to mutate is not authority to mutate.**

## Workflow

1. **Inventory the active project surface.**
   - Include a project when the user explicitly names it, or when live issues/PRs/recent project evidence show substantive open work.
   - Do not equate “not archived” with “currently active.”
   - Keep support/governance repos distinct from the product/project whose truth they reference.

2. **Recon before mission design.**
   - Read `AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, program/gate issues, accepted ADRs, current-state files, and PR/WIP constraints when present.
   - Inspect live default branch, relevant open issues/PRs, and exact current gate through the available GitHub/repo tools.
   - Treat stale prose as evidence, not current state, when the repo says live state must be re-derived.

3. **Build an action envelope.** Classify each action separately:
   - `READ_ANALYZE`
   - `BUILD_LOCAL`
   - `TEST_VERIFY`
   - `CREATE_BRANCH`
   - `PUSH`
   - `OPEN_PR`
   - `PROMOTE_MERGE`
   - `DEPLOY_EXTERNAL_WRITE`

   Set each to `ALLOWED`, `BLOCKED`, `OPERATOR_ONLY`, or `NOT_EVALUATED`, with the authority/evidence that controls it. A blocked later action must not stop earlier allowed work.

4. **Create a thin project overlay.** Use `references/project-overlay.md`.
   - Cite dynamic state instead of copying large mutable backlogs into the prompt.
   - Carry a `checked_at` value or exact ref when available.
   - Preserve explicit unknowns and contradictions.
   - Never make the overlay a competing project authority.

5. **Render the mission contract.** Use `references/main-mission.md` as the canonical LLM prompt.
   - Give the agent a goal, constraints, proofs, escalation boundaries, and output contract.
   - Tell it to continue through recoverable engineering failures and around blocked branches.
   - Make `NO PR` / `NO BUILD` valid outcomes when evidence does not justify a mutation.

6. **Execute only authorized lanes.**
   - Resolve normal compiler/test/refactor/search failures autonomously.
   - Stop only the dependent branch when a business, authority, security/privacy, irreversible-action, or external-contract decision is genuinely unresolved.
   - Continue all independent work.

7. **Verify claims at the right proof level.** Keep these distinct unless project-specific authority defines a stricter ladder:
   - specified/planned;
   - implemented;
   - statically checked/compiled;
   - tests authored;
   - tests executed;
   - runtime observed;
   - externally accepted/production proven.

   Bind important claims to exact commit/head/artifact identity when the project supports it. Never turn green CI into proof of external business correctness.

8. **Run an independent adversarial pass.** Ask whether the implementation can violate authority, leak private data, silently expand scope, duplicate truth, retry an ambiguous external action, pass a vacuous test, or overclaim proof.

9. **Dogfood before generalizing.** Follow `references/dogfood-loop.md` and the regression archetypes in `references/regression-cases.md`.
   - Promote generic skill changes only when they fix a P0 authority/safety failure or recur across materially different projects.
   - Keep project/private/customer facts out of the reusable skill.

## Escalation contract

Escalate only for:
- unresolved business semantics with materially different outcomes;
- explicit operator/approval gates;
- production/external/irreversible action;
- privacy, secrets, sensitive data, or security boundaries;
- conflicting authorities that cannot be reconciled from current evidence;
- missing external authority required to claim correctness.

When escalating, return a **decision packet**, not a vague question:
- exact decision;
- options;
- evidence for each;
- engineering/business impact;
- recommendation if evidence supports one;
- work that can continue without the decision.

## Dogfood failure classes

Treat these as regressions:
- **authority inversion** — the skill/prompt overrides the repo contract;
- **permission collapse** — one blocked action stops all useful work;
- **capability-authority confusion** — available tooling is treated as approval;
- **snapshot promotion** — a current-state observation becomes durable truth;
- **duplicate truth** — a new manifest/prompt restates an existing authority;
- **claim inflation** — authored/compiled/green is reported as runtime/external proof;
- **oracle contamination** — a comparison sees the gold/reference before freezing its candidate;
- **WIP bypass** — a new branch/PR is opened despite an active-work limit;
- **private-plane leakage** — private/customer/person data crosses into a reusable/public control plane;
- **external side-effect creep** — retries, sends, deploys, merges, or writes happen without their specific gate.

## Output

For multi-project work, report:
1. active project inventory and why each project qualifies;
2. action envelope per project;
3. mission/overlay generated per project;
4. work actually executed versus intentionally blocked;
5. verification and adversarial results;
6. recurring lessons promoted into the skill versus project-local lessons retained locally;
7. exact branches/PRs/artifacts created;
8. next human gates.

For the reusable prompt itself, use `references/main-mission.md` directly so different LLMs receive one canonical contract rather than drifting copies.
