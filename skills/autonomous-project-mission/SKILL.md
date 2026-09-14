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

Read the target project's current authority before writing anything. Repository-local operating contracts, accepted decisions, canonical program issues, current git state, and explicit operator gates outrank this skill. If the skill and project disagree, the project wins. A chat instruction does not change project authority — authority changes only when the project's own authority files change. If the user asks for something the project forbids, surface the conflict and name the file that would have to change; do not adjudicate it yourself.

Do not infer approval from tool capability, a broad request to “continue,” or the existence of a branch. **Capability to mutate is not authority to mutate.**

Keep **authority** and **freshness** separate. A named authority surface can be stale; a newer observation can be real without becoming canonical authority. Reconcile both using the repository's precedence/freshness rules, exact refs, and explicit contradictions. Never silently replace authority with recency or recency with authority.

## Workflow

1. **Inventory the active project surface.**
   - Include a project when the user explicitly names it, or when live issues/PRs/recent project evidence show substantive open work.
   - Do not equate “not archived” with “currently active.”
   - Keep support/governance repos distinct from the product/project whose truth they reference.

2. **Recon before mission design.**
   - Read `AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, program/gate issues, accepted ADRs, current-state files, and PR/WIP constraints when present.
   - Inspect live default branch, relevant open issues/PRs, exact current gate, and any newer local/unreconciled lineage evidence available through authorized tools.
   - Compare authority rank and freshness explicitly. If a current-state pointer is stale, report the stale projection and the newer evidence separately rather than silently choosing one.

3. **Apply the subtraction sequence before adding work.**
   - **Question** the requirement and name the real user/operator pain.
   - **Delete/reuse** duplicate, stale, unsupported, or already-solved surface first.
   - **Simplify** to one causal layer and the smallest proof path.
   - **Accelerate** the binding trust/cycle-time blocker, not the loudest backlog item.
   - **Automate last** only after repeated utility or a clear deterministic need exists.
   - Inspect the **shape behind headline scalars** such as test counts, coverage, WIP, latency, or scores before deciding from the aggregate.

4. **Build an action envelope.** Classify each action separately:
   - `READ_ANALYZE`
   - `BUILD_LOCAL`
   - `TEST_VERIFY`
   - `CREATE_BRANCH`
   - `PUSH`
   - `OPEN_PR`
   - `PROMOTE_MERGE`
   - `DEPLOY_EXTERNAL_WRITE`

   Set each to `ALLOWED`, `BLOCKED`, `OPERATOR_ONLY`, or `NOT_EVALUATED`, with the authority/evidence that controls it. A blocked later action must not stop earlier allowed work.

   **Default is closed. Only `ALLOWED` permits an action.** `NOT_EVALUATED` is a refusal, not a maybe: an action stays unperformed until evidence is recorded that promotes it to `ALLOWED`. An envelope you did not finish filling in authorizes nothing.

5. **Create a thin project overlay.** Use `references/project-overlay.md`.
   - Cite dynamic state instead of copying large mutable backlogs into the prompt.
   - Carry a `checked_at` value or exact ref when available.
   - Preserve explicit unknowns, stale projections, and contradictions.
   - Never make the overlay a competing project authority.

6. **Render the mission contract.** Use `references/main-mission.md` as the canonical LLM prompt.
   - Give the agent a goal, constraints, proofs, escalation boundaries, and output contract.
   - Tell it to continue through recoverable engineering failures and around blocked branches. **Recoverable means the cause is identified and the fix lies entirely inside an `ALLOWED` lane.** Budget: at most 3 attempts on one root cause, or 2 consecutive attempts producing no new diagnostic information — then stop that lane and report what was learned.
   - Make `NO PR` / `NO BUILD` valid outcomes when evidence does not justify a mutation.

7. **Execute only authorized lanes.**
   - Resolve normal compiler/test/refactor/search failures autonomously.
   - Stop only the dependent branch when a business, authority, security/privacy, irreversible-action, or external-contract decision is unresolved. **Unresolved means: proceeding would require an action not marked `ALLOWED`, or would produce an irreversible or externally-visible effect.** Difficulty, tedium and repeated failure are not gates.
   - Continue all independent work.

8. **Verify claims at the right proof level.** Keep these distinct unless project-specific authority defines a stricter ladder:
   - specified/planned;
   - implemented;
   - statically checked/compiled;
   - tests authored;
   - tests executed;
   - runtime observed;
   - externally accepted/production proven.

   Bind important claims to exact commit/head/artifact identity when the project supports it. Never turn green CI into proof of external business correctness.

9. **Run an independent adversarial pass.** Ask whether the implementation can violate authority, use stale state as current truth, leak private data, silently expand scope, duplicate truth, retry an ambiguous external action, pass a vacuous test, or overclaim proof.

10. **Dogfood before generalizing.** Follow `references/dogfood-loop.md` and the regression archetypes in `references/regression-cases.md`.
   - Promote generic skill changes only when they fix a P0 authority/safety failure or recur across materially different projects.
   - Keep project/private/customer facts out of the reusable skill.

## Escalation contract

Escalate only for:
- unresolved business semantics with materially different outcomes;
- explicit operator/approval gates;
- production/external/irreversible action;
- privacy, secrets, sensitive data, or security boundaries;
- conflicting authorities or authority/freshness contradictions that cannot be reconciled from current evidence;
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
- **authority/freshness collapse** — a stale authority projection is treated as current, or a newer observation is silently promoted into authority;
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
2. authority/freshness reconciliation and action envelope per project;
3. subtraction decision: what was questioned/deleted/reused/simplified/accelerated and what was deliberately not automated;
4. mission/overlay generated per project;
5. work actually executed versus intentionally blocked;
6. verification and adversarial results;
7. recurring lessons promoted into the skill versus project-local lessons retained locally;
8. exact branches/PRs/artifacts created;
9. next human gates.

For the reusable prompt itself, use `references/main-mission.md` directly so different LLMs receive one canonical contract rather than drifting copies.