import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Executable regression cases for the autonomous-project-mission skill.
 *
 * references/regression-cases.md describes eleven failure archetypes in prose.
 * Prose cannot fail, so none of them constrained the skill. These are the
 * subset that can be checked mechanically against the shipped text.
 *
 * Each test below must FAIL if the rule it guards is edited away. That is the
 * whole point: a regression case that passes under mutation proves nothing.
 */

const SKILL_DIR = join(
	__dirname,
	"..",
	"skills",
	"autonomous-project-mission",
);

const read = (...parts: string[]): string =>
	readFileSync(join(SKILL_DIR, ...parts), "utf8");

describe("R-FAIL-CLOSED — the envelope denies by default", () => {
	it("SKILL.md states that only ALLOWED permits an action", () => {
		const skill = read("SKILL.md");
		expect(skill).toMatch(/only `ALLOWED` permits an action/i);
	});

	it("SKILL.md says an unevaluated action is a refusal, not a maybe", () => {
		const skill = read("SKILL.md");
		expect(skill).toMatch(/`NOT_EVALUATED` is a refusal/i);
	});

	/**
	 * The original template shipped READ_ANALYZE pre-filled as ALLOWED with its
	 * justification left as a placeholder — the one hardcoded action was
	 * hardcoded open. A governor whose template pre-authorizes anything has
	 * already lost the argument it exists to win.
	 */
	it("the overlay template pre-authorizes no action", () => {
		const overlay = read("references", "project-overlay.md");
		const preAuthorized = overlay
			.split("\n")
			.filter((line) => /^\s*state:\s*ALLOWED\s*$/.test(line));
		expect(preAuthorized).toEqual([]);
	});

	it("the overlay's gate enum is closed", () => {
		const overlay = read("references", "project-overlay.md");
		// An open enum ("OPEN/READY/.../...") makes the envelope uncheckable.
		expect(overlay).not.toMatch(/state:\s*<[^>]*\.\.\.[^>]*>/);
		expect(overlay).not.toMatch(/state:\s*<[^>]*\bOPEN\b[^>]*>/);
	});
});

describe("R1 — project authority outranks this skill", () => {
	it("grants no in-session override of project authority", () => {
		const skill = read("SKILL.md");
		// "unless the user explicitly and validly changes that project
		// authority" made the agent the judge of "validly".
		expect(skill).not.toMatch(/\bvalidly\b/i);
		expect(skill).toMatch(
			/chat instruction does not change project authority/i,
		);
	});
});

describe("R-BUDGET — autonomy is bounded by an attempt budget", () => {
	it("defines recoverable without circularity", () => {
		const mission = read("references", "main-mission.md");
		// "Fix recoverable findings" defined recoverable as the set you fix.
		expect(mission).not.toMatch(/Fix recoverable findings/i);
		expect(mission).toMatch(/inside an `ALLOWED` lane/i);
	});

	it("states a numeric attempt budget in both the skill and the prompt", () => {
		for (const text of [
			read("SKILL.md"),
			read("references", "main-mission.md"),
		]) {
			expect(text).toMatch(/at most 3 attempts on one root cause/i);
		}
	});

	it("does not list bare failing tests as friction to push through", () => {
		const mission = read("references", "main-mission.md");
		expect(mission).not.toMatch(/^- failing tests;$/m);
	});
});

/**
 * The envelope denies by default (above), and this fixes what may open it.
 *
 * Without a promotion rule, `INFERRED` — "reasoned from evidence" — is enough to
 * set an action ALLOWED, so the agent can reason its way to authorizing itself.
 * Measured self-assessment in language models is the weakest available signal:
 * verbalized confidence clusters overconfidently, and trivial external
 * classifiers match or beat it. So confidence is not an input to the envelope.
 */
describe("R-PROMOTION — only external evidence opens an action", () => {
	it("SKILL.md states that only VERIFIED promotes", () => {
		expect(read("SKILL.md")).toMatch(
			/Only `VERIFIED` evidence promotes an action/i,
		);
	});

	it("the canonical prompt carries the promotion rule", () => {
		const mission = read("references", "main-mission.md");
		expect(mission).toMatch(/\*\*Promotion rule\.\*\*/);
		expect(mission).toMatch(/Only `VERIFIED` promotes an action to `ALLOWED`/i);
	});

	/**
	 * Asserted per-file with literals, not one loose alternation. The first
	 * version used /`INFERRED`[^.]*never (promotes|an authorization)/ across both
	 * files; because `[^.]*` spans clauses, flipping "never promotes" to "may
	 * promote" still matched the later "never an authorization" in the same
	 * sentence. The mutant survived. Match the exact clause each file carries.
	 */
	it("INFERRED is barred from promoting, in the prompt", () => {
		expect(read("references", "main-mission.md")).toContain(
			"`INFERRED` never promotes",
		);
	});

	it("INFERRED is barred from promoting, in SKILL.md", () => {
		expect(read("SKILL.md")).toContain("never an authorization");
	});

	it("self-assessed confidence is excluded as an envelope input", () => {
		const mission = read("references", "main-mission.md");
		expect(mission).toMatch(/Do not weigh your own confidence/i);
		// Capability was already barred; confidence must be barred alongside it.
		expect(mission).toMatch(/Capability is not permission; neither is confidence/i);
	});
});

describe("R6 — no private naming leaks into the shipped skill", () => {
	it("contains no author-private disposition key", () => {
		for (const file of [
			"SKILL.md",
			join("references", "main-mission.md"),
			join("references", "dogfood-loop.md"),
			join("references", "project-overlay.md"),
			join("references", "regression-cases.md"),
		]) {
			expect(read(file)).not.toMatch(/musk_disposition/i);
		}
	});
});
