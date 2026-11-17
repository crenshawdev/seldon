PLAN COMPLETE
Plan: .planning/phases/3/PLAN-1.md
Tasks: 6 of 6
| Task | Commit | Note |
|---|---|---|
| 1 - Add the PRD-only check mode | 264f817 | `--prd` reads only prd.md, exports PRD_OK_LINE; 5 mirrored tests, usage assertion updated; FORMAT.md "The PRD alone". Verify 1-5 as predicted; coverage 99.15% lines / 97.78% branches, both lcov guards pass. No lint/typecheck command detected. |
| 2 - Require an ID'd requirement in both requirement sections | dbd89be | Rule in checkPrd (`prd.md: <section>: no "- **CAT-01**: text" requirement`), skipped for missing/empty sections. Prose-only fixtures exited 0 before, exit 1 after. 3 new `cases` rows + 1 `--prd` test; existing `cases` unchanged. 58/58 pass; coverage 99.18% / 96.77%, guards pass. |
| 3 - Extend the user's-own-words rule to the PRD | 2bc2686 | New "In the PRD" subsection under "The user's own words"; covers line now names brief.md and prd.md. Example prd.md: LEDG-01 and MEMB-01 quote the example brief, NFR-01 tagged. Covers grep 1 -> 0; example script: 3 bullets, 2 quoted, 1 tagged, all quotes found in the brief block; samples pass. |
| 4 - Carry the brief's refusals into the PRD's Non-goals | 6a2ae21 | `### Non-goals` under `## prd.md` names the `because` bullet with the brief's quote, five sections kept, refuses-nothing case, check unchanged. Example Non-goals is now the invoice refusal with its quote. Script finds the bullet + quote; samples pass. |
| 5 - Document the Retired line for dropped requirement IDs | dcd5d04 | Rule in "IDs are stable" (placement under `## Requirements` before the first `###`, plain comma list, extend-in-place, never reused); "Requirement IDs" points to it. One test: Retired line passes full check and `--prd`. grep 0 -> 1; 59/59 pass. |
| 6 - Make samples/prd.md follow the PRD's quote and refusal rules | 860e338 | CAT-02, LOAN-01, LOAN-02 quote the brief's Solution line; LOAN-03 alone quotes Scope; CAT-01, NFR-01, NFR-02 tagged (no brief words for them). Non-goals = the brief's three refusals as `because` bullets with their quotes. IDs and wording unchanged. Both checks pass; script finds 4 quoted, 3 tagged, all quotes in the brief, 3/3 refusals; 59/59 pass. |
Deviations: none
Open items: none
Suite: the coverage job command from .github/workflows/test.yml (workflow.test_command is null, no package.json), run once after task 6: 59/59 pass, check.mjs 99.18% lines / 96.77% branches, both lcov guards pass.
