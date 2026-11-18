PLAN COMPLETE
Plan: /code/seldon/.planning/phases/7/PLAN-3.md
Tasks: 2 of 2
| Task | Commit | Note |
|---|---|---|
| 1 - Stamp every sample PRD, spine and epics file | 87709cb | 12 files, one line each (line 2), each copied from the `stamp for` line of `check.mjs --stale` on a scratch folder holding the parent, parent before child. Verify (1)-(3) matched the prediction: all five modes exit 0 on samples/; prd-rerun, spine-rerun and epics-rerun exit 1 with only their own stale line; the other 21 seeded cases exit 0 under --stale and every per-file mode. tests/check.test.mjs 99/99. |
| 2 - Pin the samples' stamps and stale stories in the unit suite | ca877eb | tests/samples.test.mjs, 5 tests, 5 pass. Mutation check: one byte appended to samples/spine.md failed the pin with `samples/epics.md: stamp fce47dade8bb786c is not the hash of samples/spine.md (003851d5ae9801b8)`; restored with `git checkout -- samples/spine.md`, `git diff --exit-code -- samples/` exit 0. The pin also fails an unstamped sample PRD, spine or epics, which holds AC1's "each carries one stamp". |
| Suite | - | workflow.test_command is null and there is no package.json, so the suite was the coverage job's command from .github/workflows/test.yml (same tests/*.test.mjs set as the node-test job) on Node v26.13.1: 110/110 pass, lib/check.mjs 99.41% lines, 97.90% branches, exit 0. Both lcov guards exit 0. No lint or typecheck command found (detect-commands returned null for both). |
Deviations: none
Open items: none
