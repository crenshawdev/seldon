PLAN COMPLETE
Plan: /code/seldon/.planning/phases/8/PLAN-4.md
Tasks: 2 of 2
| Task | Commit | Note |
|---|---|---|
| 1 - Write the design with one crossed boundary | 2bea78b | samples/readiness/{prd,spine,epics}.md + ELSEWHERE entry. Stamps from `--stale` over a scratch seed: spine `prd.md sha256:82ab766cb0a09dda`, epics `spine.md sha256:13d597adba767ef4`. (1) --prd/--spine/--epics each exit 0 with their conforms line. (2) samples.test.mjs 5/5 pass; without the entry the stamp test fails with exactly `samples/readiness/prd.md: stamped, but no parent found`. (3) every PRD ID on exactly one epic, crossing = [E-02] (clean samples: []), `grep -ci repair` on the spine prints 0. (4) scratch seed of brief + the three reads `seldon check: no stale link`, exit 0. |
| 2 - Write the epics that leave one requirement out | 917f630 | samples/readiness-uncovered/epics.md (stamp `spine.md sha256:13d597adba767ef4`, E-01 now CAT-02 only, two done-when items) + ELSEWHERE entry. (1) --epics exits 0, conforms. (2) samples.test.mjs 5/5 pass; without the entry the stamp test fails with exactly `samples/readiness-uncovered/epics.md: stamped, but no parent found`. (3) CAT-01 on 0 epics, every other ID on 1, crossing still [E-02]. (4) scratch seed of brief + readiness prd + readiness spine + this file reads `seldon check: no stale link`, exit 0. |

Static analysis: detect-commands found no lint or typecheck, and workflow.lint_command is null, so it was skipped.
Full suite: workflow.test_command is null and there's no package.json, so I ran CI's `node --test tests/*.test.mjs` (.github/workflows/test.yml:31): 111 of 111 pass.
Deviations: none
Open items: none
