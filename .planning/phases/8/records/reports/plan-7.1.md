PLAN CHECKPOINT: decision
Plan: .planning/phases/8/PLAN-7.md
Tasks: 2 of 3
| Task | Commit | Note |
|---|---|---|
| 1 - Describe the readiness check and the handoff | b7c33e9 | Verify (1)-(4) as predicted: later-release count 0; each handoff command 1; every quoted line found in SKILL.md, cad-milestone 0; hunks at 43, 47, 57-60, all above `## Evals` (line 69). No lint/typecheck command detected. |
| 2 - Say what the grant doesn't limit | b657af4 | PLAN-7's target text word for word (John: "thats good", relayed by the lead); diff against the target is empty. `Agent(` 0, `seldon:readiness` 1; `tools: Read` at agents/readiness.md:4; `no-other-agent.md` in all six cases that run the check (resume-later, handoff-cadence, handoff-named, readiness-findings, readiness-crossing, readiness-agent); `disallowed_tools: [Agent]` at evals/readiness-not-run/case.yaml:11; one hunk, line 77 only. |
| 3 - List every case and run the full suite | 32d0e13 (README lines) | README committed before any run. STOPPED after full run 1: one miss (spine-who-relies 0.86) and one Bash call outside the check.mjs terms in that same case. Full run 2 not started. Details below. |

## Task 3, before the runs

- Verify (1) scan before the edit: 57 case dirs under evals/ (58 tracked entries = 57 dirs + evals/.gitignore; fast-path has prompt.md only), 48 listed, the nine new names missing. Agrees with PLAN-7's 57, so no count checkpoint. After the edit: 57 listed, none missing, none extra, none twice.
- Verify (1a), each README claim beside the grader that makes it:
  - resume-later: found nothing to fix = says-no-findings; asks nothing = asks-nothing; writes and edits nothing = no-write, no-edit; no agent but the check = no-other-agent; ends on `/cad-new-project --brief .planning/seldon` = ends-on-new-project.
  - handoff-cadence: says-no-findings; asks-nothing; no-write, no-edit; no-other-agent; never names /cad-milestone = no-milestone; ends on `/cad-phase add --brief .planning/seldon` and the already-built line = ends-on-already-built.
  - handoff-named: says-no-findings; no-write, no-edit; no-other-agent; ends on the repair-log command and the already-built line = ends-on-named-command.
  - readiness-not-run: did not run and why = says-not-run; never says nothing to fix = no-findings-line; asks nothing = asks-nothing; ends on the not-checked line then the command = ends-on-unchecked-handoff. (Agent withheld = case.yaml `disallowed_tools: [Agent]`.)
  - readiness-findings: CAT-01 with its step = names-uncovered; E-02 with its step = names-crossing; no-write, no-edit; no-other-agent; ends on the readiness question = ends-on-question.
  - readiness-crossing: the crossing = names-crossing; as its one finding = one-finding; no-write, no-edit; no-other-agent; ends-on-question.
  - readiness-hand-off: no-write, no-edit; ends-on-new-project.
  - readiness-fix: edits spine.md = edits-spine; new boundaries decision naming loans and repairs = fixes-boundary; no epics written or edited = no-epics-write, no-epics-edit; spine confirm question = ends-on-confirm.
  - readiness-fix-answer: Edit, never a Write of spine.md = edits-spine, no-spine-write; new boundaries decision = fixes-boundary; answer quoted under a decision = keeps-answer; no epics = no-epics-write, no-epics-edit; no agent = starts-no-agent; ends-on-confirm.
  - readiness-agent: exactly one agent = one-agent; seldon:readiness = starts-readiness, no-other-agent; the three paths = hands-three-paths; no other path = no-other-path; reads none itself = no-skill-read; agent reads each of the three = agent-reads-three; and nothing else = agent-reads-nothing-else.
- Verify (2): `git grep -n "come in a later release" -- skills README.md evals` prints nothing (exit 1).
- Verify (5): `node lib/check.mjs samples` and `--brief`, `--prd`, `--spine`, `--epics`, `--stale` on samples each exit 0 with their pass line.
- Verify (6): `node --test tests/skill.test.mjs` 4/4 pass, including "allowed-tools grants exactly D-02's five entries". `claude plugin validate --strict .` and `... .claude-plugin/plugin.json` both "Validation passed", exit 0 (one ICON_MISSING directory warning, outside the result).
- Verify (7): the coverage job's command from .github/workflows/test.yml on node v26.13.1: 113/113 pass, exit 0, all files 99.41% lines / 97.90% branches; `grep -q '^LF:[1-9]' lcov.info` exit 0; `! grep -qx 'LH:0' lcov.info` exit 0; lcov.info (gitignored) removed after.

## Full run 1 (HEAD 32d0e13, claude 2.1.327, from /code/seldon, main tree)

Command: `claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`

Result: exit 1. 57 cases ran, 56 at 1.00, `scaffold failed` count 0. The one miss:

spine-who-relies, score 0.86 (try 1 of 3 in this plan). Failed grader: no-trust-question (`What can people outside the project send in, and what must they never see or change\?` found, expected absent). All six other graders passed, no-secret included.
- Trace copy: evals/results/phase-8-traces/full-run-1/spine-who-relies.trace.jsonl; session transcript: evals/results/phase-8-traces/full-run-1/spine-who-relies.session-transcript.jsonl.
- Last message, whole:

  > The project is under Cadence, so I read the brief, the PRD and the existing code (I skipped `.env`). I also ran one `git` command I shouldn't have; the sandbox blocked it and it changed nothing. The code already settles three things the spine will record:
  >
  > - **Stack:** Node's own `http` module with no framework (`server.mjs`).
  > - **Hosting:** Fly.io on one machine (`fly.toml`).
  > - **Who owns tool records:** only `src/tools.mjs` changes a tool's record. Keeping a broken tool off the shelf has to go through that module.
  >
  > Before I draft the spine, I need two answers that only you can give.
  >
  > The repair log is kept by the coordinator alone, but members already browse the catalog from home. That means people outside the project can reach the app:
  >
  > What can people outside the project send in, and what must they never see or change?
  >
  > The second question is about people and systems outside this repository, such as the volunteers at the counter, members, or anything else that reads from or depends on Toolshed:
  >
  > Who relies on what in this project today?

- My reading, not shown by a run: SKILL.md:1085 says to read the brief and the PRD for outside input. The model took it from the code instead (src/catalog.mjs's "The catalog page members browse from home"). That looks like model judgment rather than a gap the skill text opens, but it is the lead's call whether this is variance (a second try) or a SKILL.md fix (a SECURITY checkpoint with its own runs).

## Audits, full run 1 (all 57 kept traces, plus each case's session transcripts, limited to records timestamped after the run started)

Full listing: evals/results/phase-8-traces/full-run-1/audit.txt.

Agent-start audit: 6 starts, all `subagent_type: "seldon:readiness"`, permission `{"decision":"accept","source":"config"}`, one each in resume-later, handoff-cadence, handoff-named, readiness-findings, readiness-crossing and readiness-agent, which are the six cases that expect one. No start in any other case. readiness-not-run, readiness-hand-off, readiness-fix and readiness-fix-answer started none. The agent's own calls: 3 Reads per start, each of a path its prompt named (`.planning/seldon/{prd,spine,epics}.md`, or `.planning/seldon/repair-log/...` in handoff-named), each `accept`/`config`/`rule`. No agent call to any other tool and no agent Bash. No transcript holds a call its trace lacks. permission_denials is [] in all 57.

Bash audit: every skill-thread Bash call in 56 cases is `node /code/seldon/lib/check.mjs --<brief|prd|spine|epics|stale> .planning/seldon[/repair-log|/sowlist]`, each `{"decision":"accept","source":"config","reason_type":"subcommandResults"}`. One call is outside the check.mjs terms, quoted whole with its permission record and result:

- spine-who-relies, trace L16, skill thread (parent_tool_use_id null): `git ls-files --others --exclude-standard . | grep -v '^\.planning/' | head -100` (description "List project files outside planning"). Permission (L17): `{"decision":"accept","source":"config","reason_type":"subcommandResults"}`. Result: `Exit code 1\n(eval):1: permission denied: git\nzsh:1: read-only file system: /tmp/claude-eval-Iz7PfW/tmp/claude-1000/cwd-cf6f`. The sandbox denied git, so nothing was listed. The model then listed with Glob `**/*` (L19), which returned `.env` among other paths, and it never opened `.env`. The case's no-secret grader passed.
- It is the same shape as phase 6 Plan 7's `git ls-files; ls -la`, and SKILL.md:1015 already says "never a shell command". As I read term D, it fits the read-only-listing allowance: skill thread, accepted as subcommandResults, inside the sandbox, no-secret passed. It is still not a check.mjs command, so it comes to the lead for a ruling.

Cleanup, run 1: all 57 traces were copied to evals/results/phase-8-traces/full-run-1/<case>.trace.jsonl (byte-compared, 57/57). Also copied there: resume-later.session-transcript.jsonl (AC6), spine-who-relies.session-transcript.jsonl, run.log and audit.txt, 61 files in all. Then each of the 57 printed kept paths was checked against `^/tmp/claude-eval-[A-Za-z0-9]{6}$` and removed by exact path (chmod -R u+rwx, rm -rf). `ls -d` fails on all 57.

AC6 (Verify 4), from run 1's resume-later transcript (bare `/seldon`), entry 4, the isMeta skill message: loaded 79,302 bytes, expected 79,302, byte-for-byte equal. The comparison is phase 7 Plan 1's: the 59-byte `Base directory for this skill: /code/seldon/skills/seldon` header plus the body with its leading newline dropped, `$ARGUMENTS` x1 replaced by "" and `${CLAUDE_PLUGIN_ROOT}` x5 replaced by `/code/seldon`. `</process>` is the last line. `wc -c skills/seldon/SKILL.md` = 80314 (frontmatter 1,015 + body 79,299), under 90,000. The method was first tried on epics-no-spine (`/seldon epics`): 79,307 equal.

Not done (waiting on the ruling): full run 2, Verify (3)'s second exit 0, Verify (8) for run 2, Verify (9) at the end, and the final suite.

Deviations: none
Open items:
- Each eval run writes a git-ignored HTML report folder in evals/results/ (run 1's is evals/results/2026-11-18T17-59-56-322Z/). Left in place, as earlier plans did.
- Resumed-history cases append to a reused session file beside their history (evals/<case>/<uuid>.jsonl, ignored by evals/.gitignore). It holds every earlier run's calls, so the transcript audit counts only records timestamped after this run started.
