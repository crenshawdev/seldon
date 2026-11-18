PLAN CHECKPOINT: decision
Plan: .planning/phases/4/PLAN-4.md
Tasks: 0 of 2
| Task | Commit | Note |
|---|---|---|
| 1 - Rewrite resume-later for a brief, a PRD and a spine | uncommitted | seed.sh adds `cp "$repo/samples/spine.md" .planning/seldon/spine.md`, and its comment now names the spine. The case.yaml description names the three seeded documents and the epics-only later-release line, and says "scaffold" only in `scaffold_script: seed.sh`. says-later-release.md keeps its shape with the line copied from SKILL.md §2 line 215: `'(?:^\|\n)[ \t]*The epics step comes in a later release, so I.ve written nothing this time\.\s*(?:```\s*)?$'`. prompt.md, no-write.md and no-edit.md are unchanged. Verify (1), D-21: a node script read the pattern from the file. It matches the line ending a message, the line before a closing fence, and the line with a curly apostrophe. It doesn't match the retired spine-and-epics line, the line followed by a sentence on the same line, the line followed by a sentence on the next line, or a message without the line. All 7 ok, exit 0. Verify (2): scaffold.test.mjs 4/4. Verify (5): `grep -rc` prints 0 for all six files. Stopped at Verify (3), the seed vetting before the first run. |
| 2 - Turn spine-later into epics-later | uncommitted | `git mv evals/spine-later evals/epics-later` is staged. git detects the rename for seed.sh, no-edit.md and no-write.md. prompt.md is exactly `/seldon epics`. case.yaml is `name: epics-later`, and its description names the three seeded documents and the epics-only line, ending "rather than drafting epics from the three documents". seed.sh's comment names evals/epics-later/, and it copies brief.md, prd.md and samples/spine.md. says-later-release.md is a copy of Task 1's. Verify (1): `test ! -e evals/spine-later` exit 0, and the retired-line grep over evals/ prints nothing (exit 1). Verify (2): `cmp` exit 0. Verify (3): scaffold.test.mjs 4/4. Stopped at Verify (4), the seed vetting before the first run. |

Static analysis: `workflow.lint_command` is unset, and `detect-commands` returns lint null and typecheck null, so none ran.

Seeds to vet (both mode 755, and the scaffold test allows every line):
- /code/seldon/evals/resume-later/seed.sh: shebang, `set -euo pipefail`, repo line, comments, `mkdir -p .planning/seldon`, `cp "$repo/samples/brief.md" .planning/seldon/brief.md`, `cp "$repo/samples/prd.md" .planning/seldon/prd.md`, `cp "$repo/samples/spine.md" .planning/seldon/spine.md`.
- /code/seldon/evals/epics-later/seed.sh: the same lines. Only the two comments differ ("The case lives in evals/epics-later/ ..." and "All three documents on disk, which is exactly when drafting epics is tempting.").

Eval runs proposed, from /code/seldon, one case at a time. Each calls the model API. A Bash audit of each kept trace follows its run, and the kept `/tmp/claude-eval-*` folder is removed afterwards:
- `claude plugin eval . --case resume-later --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`
- `claude plugin eval . --case epics-later --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`
Each case gets one scored run. A miss that the trace shows is model variance gets a retry with no file changes, up to 3 tries per case. A miss that needs a grader, seed or SKILL change stops at a checkpoint instead.
Commits: on continuation, Task 1 is `feat(4-4): ...` with the three resume-later files, then Task 2 is `feat(4-4): ...` with the rename and its rewritten files. Each commit follows its case's passing run.

Deviations: none
Open items:
- README.md lines 43 and 71-72 still describe `spine-later` and the retired "spine and epics come in a later release" behavior. D-14 says the README's case list changes with the cases, but README.md isn't in this plan's lease, so it was left alone. A later plan or the orchestrator has to change it.
