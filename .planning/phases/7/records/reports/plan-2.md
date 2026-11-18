PLAN COMPLETE
Plan: /code/seldon/.planning/phases/7/PLAN-2.md
Tasks: 3 of 3
| Task | Commit | Note |
|---|---|---|
| 1 - Add the stale check mode | 66af993 | `--stale <dir>` beside MODES; `--stale samples` exits 0 with three stamp lines matching `sha256sum`; 7 new tests pass (89/89 in check.test.mjs); full check and per-file modes unchanged on samples; coverage command 99.38% lines / 97.10% branches, both lcov guards pass |
| 2 - Hold a present stamp to its form | 833b2dc | `checkStamp` in checkPrd/checkSpine/checkEpics, sharing `stampLines` and `STAMP_FORM` with --stale; scratch `sha256:ZZ` gives one `prd.md: Built from` line and exit 1, the printed stamp passes --prd and the full check; 10 new tests, 105/105 under the coverage command (99.41% / 97.89%), both lcov guards pass |
| 3 - Document stamps and the stale check | 769aed5 | `## Stamps` after "IDs are stable", `### Stale links` under "The check", stamp sentence in the full check and the three per-file modes, one architecture.md bullet; greps print 1 / 1 / 2; quoted lines copied from `--stale` on samples, on a scratch stale folder and from Task 2's output. Also reworded the spine and epics `Retired:` placement ("directly under the title, or under the stamp line when there is one"), which the stamp placement would otherwise contradict |
| Fix - review diff-77e8e63-769aed5 finding 1 | 04b49da | docs/FORMAT.md:240 and :251 said the zone before the first spine decision or epic is text "which no rule reads", but `checkStamp` (lib/check.mjs:83-91, called at :171 and :244) holds every line there starting `Built from:` to the stamp form. Both bullets now say that below the title the only line the check reads there is one starting `Built from:`. "Below the title" is there because `parse` also requires the first non-blank line to be a `# ` title. Probe on a scratch spine: a `Retired:` line plus a prose line passes `--spine` (exit 0), and a `Built from: the kickoff notes` line under them exits 1 with one `spine.md: Built from:` line. Suite 105/105 |
Full suite: `node --test tests/*.test.mjs` (the CI node-test job's command; workflow.test_command is null and there is no package.json) - 105 pass, 0 fail, rerun after the fix commit 04b49da.
Deviations: none
Open items: none
