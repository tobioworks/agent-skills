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
