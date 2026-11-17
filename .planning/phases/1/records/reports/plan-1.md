PLAN COMPLETE
Plan: /code/seldon/.planning/phases/1/PLAN-1.md
Tasks: 4 of 4
| Task | Commit | Note |
|---|---|---|
| 1 - Add the node-test, coverage and plugin-validate CI jobs | 90b5553 | policy check down to the one expected problem (lib/** matches no tracked file); zizmor clean; no secret/eval/key; push has no branches filter; coverage-policy.json unchanged; lcov.info ignored |
| 2 - Document the four-file format in docs/FORMAT.md | 0ec5d75 | grep loop over all 27 required strings: 0 misses |
| 3 - Write the sample set in samples/ | 018eaf6 | node -e check: no missing ID, 3 epics, 3 spine decisions, each label once per epic, every requirement named by an epic |
| 4 - Enforce the format with lib/check.mjs and its Node tests | f6107aa | accepted coverage command at 85/85 exits 0 (30/30 pass, lib/check.mjs 99.04% lines, 97.67% branches); both LCOV guards pass; `node lib/check.mjs samples` exits 0; E-02 without Done when exits 1 printing `epics.md: E-02: Done when: missing field`; test-policy check ok:true |
| Review fix (REVIEW-diff-8807ff6-f6107aa, findings 1 and 2) - brief/PRD section order and exact heading names in lib/check.mjs | 04a0af9 | checkNamed now reports `<file>: sections: out of order, expected ...` when every section is present but misordered, the same rule checkEpic applies to fields; parse no longer trims headings, so `## Vision \t` is reported as not a section plus Vision missing. Two new cases in tests/check.test.mjs both failed before the fix (actual `[]`) and pass after; `node lib/check.mjs samples` exits 0; docs/FORMAT.md untouched |

Full suite: workflow.test_command is null and there is no package manifest, so ran the node-test job's command, `node --test tests/*.test.mjs`: 30 pass, 0 fail.
Static analysis: detect-commands found no lint and no typecheck command; skipped.
Review-fix full suite: workflow.test_command is still null with no manifest, so ran the coverage job's accepted command (Node 26.13.1, 85/85 over lib/**) over tests/*.test.mjs: exit 0, 32 pass, 0 fail, lib/check.mjs 99.07% lines and 97.75% branches; both LCOV guards pass.
Review-fix deviations: none. Review-fix open items: one order case (brief) covers the order check, because the brief and PRD both go through checkNamed; no separate PRD order case.

Deviations: none
Open items:
- commit 90b5553 uses the `ci` type, which is outside the contract's type list (chore was the fit); left as is rather than amended.
- AC5 (plugin-validate installs from the self-marketplace and runs the installed check on the installed samples) is proved only by the pushed CI run, and that job needs Plan 2's manifests and skills/seldon/SKILL.md before it can pass. Not run locally, because installs are held.
- The FORMAT.md examples aren't checked against lib/check.mjs by any test; they conform by hand. Add a test if the examples start to drift.
