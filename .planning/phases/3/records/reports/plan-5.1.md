PLAN CHECKPOINT: decision
Plan: .planning/phases/3/PLAN-5.md
Tasks: 1 of 3
| Task | Commit | Note |
|---|---|---|
| 1 - Rerun the brief in place | f6ad1f1 | SKILL.md: `brief` step name reopens or takes the documents-question dump; new "Brief change answered" position; "Documents question answered" splits into rerun and go-on; "The brief rerun" in "The draft" (Edit only, untouched items byte-identical, never touches prd.md). Both 8868b83 and 0d8c4c4 changes kept. Text check failed before, passes after; tests/skill.test.mjs 2/2; plugin validate --strict exit 0 (icon warning only). No lint/typecheck command found. |
| 2 - Add the brief-rerun case | uncommitted | All 8 files written, untracked. Done: D-21 checks pass (keeps-untouched-item rejects a one-word quote change; carries-change rejects samples/brief.md; both input_match patterns match Write/Edit JSON to <ws>/.planning/seldon/prd.md and reject brief.md). tests/scaffold.test.mjs 4/4 with the new seed scanned. Waiting on: Verify (3) eval run, Verify (4) cmp of the workspace prd.md against samples/prd.md, then the commit. |
| 3 - Add the brief-rerun-dump case | uncommitted | All 5 files written, untracked. Done: Verify (1) history's last record is an assistant message ending in the documents question, copied from SKILL.md; grep finds neither "Alder Street School" nor "thirty seconds" in samples/brief.md. Verify (2) D-21 checks pass. Verify (3) scaffold test 4/4. Waiting on: Verify (4) eval run, then Verify (5) and the commit. |

Checkpoint: per the dispatch, the coordinator vets the new seeds before the first eval run.
- Seeds to vet (both untracked, neither task is done yet):
  - /code/seldon/evals/brief-rerun/seed.sh: mkdir -p .planning/seldon; cp samples/brief.md and samples/prd.md into it
  - /code/seldon/evals/brief-rerun-dump/seed.sh: mkdir -p .planning/seldon; cp samples/brief.md into it
- Eval runs the continuation will make, from /code/seldon, one case per run, at most three tries each:
  - claude plugin eval . --case brief-rerun --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"
  - claude plugin eval . --case brief-rerun-dump --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"
- After each run, before cleanup: report the Bash audit from the kept trace; for brief-rerun, cmp the workspace .planning/seldon/prd.md against samples/prd.md. Then, on the printed /tmp/claude-eval-* folders only: chmod 700 on the folder and its sealed/, chmod -R u+rwX, rm -rf.
- Continuation also: commit Task 2's 8 files and Task 3's 5 files as separate commits once each run scores 1.00, then the full suite.

Deviations: none
Open items: none
