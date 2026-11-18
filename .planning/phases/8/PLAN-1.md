---
phase: 8
plan: 1
requirements:
  - CHECK-01
files:
  - skills/seldon/SKILL.md
  - agents/readiness.md
  - evals/readiness-probe/case.yaml
  - evals/readiness-probe/prompt.md
  - evals/readiness-probe/seed.sh
  - evals/readiness-probe/graders/starts-agent.md
  - evals/readiness-probe/graders/no-read-documents.md
---

# Phase 8: Readiness check and handoff - Plan 1: The probe

## Goal

An independent check reads the finished design before the handoff, and Seldon ends with the exact Cadence command to run, proven by eval cases this phase adds. This plan settles four things before any of that is built: how an agent start is granted in an eval, how the agent tool is spelled and scoped, whether a trace carries the agent's own records, and whether the validator takes the agent file. Daneel gets the four answers before the grant changes or AC2's graders are designed (D-04).

## Must be true when done

- The task report records Daneel's approval of phase 8's eval runs on the terms in Context.
- The report gives the four answers, each with the trace line or command output behind it:
  1. whether a start runs with the agent-tool entry in the case's allowed tools, and whether the skill's own entry is enough without it
  2. how the tool is spelled, and whether an entry scoped to `seldon:readiness` lets that start run while one scoped to another name doesn't
  3. whether `out/trace.jsonl` carries the agent's own records, how they are marked apart from the skill's, and whether a `tool_used` grader counts them
  4. whether `claude plugin validate --strict` takes the agent file's frontmatter
- It also records the Claude Code version both runs ran on, and whether `validate --strict` takes `engines["claude-code"]` in `plugin.json`.
- Every agent start in both kept traces is listed, and none is anything but `seldon:readiness`.
- SKILL.md is back byte for byte at 74,471 bytes, and `agents/` and `evals/readiness-probe/` are gone. The kept folders are removed, and copies of both traces sit in `evals/results/phase-8-traces/`.
- Daneel has the report at a checkpoint, and it says which outcome in Task 1 applies.

## Context

- **Locked:** D-04 (this probe and its terms), D-02 (stop when the entry can't be scoped), D-01 (the agent's shape), D-18 (AC2 is graded the way this probe allows) and D-19.
- **Why the probe comes first:** the grant is the first change to the pinned five entries, and four of CONTEXT's flagged assumptions are open until a run answers them.
- **Eval runs (SECURITY):** phase 7's terms unchanged, plus D-04's. Before the first run, stop at a checkpoint marked SECURITY and record Daneel's approval of phase 8's runs on these terms.
  - **Runs covered:** this plan's two probe runs, the per-case runs in Plans 3, 5 and 6, and Plan 7's full-suite runs. Plan 7 gets a second full run only when a case in the first missed on model variance the trace shows. Not covered: Plan 7's solo reruns after a fix Daneel rules on, and the full run that follows them. Those need their own approval at Plan 7's SECURITY checkpoint.
  - **How a run is made:** from `/code/seldon`, the main tree, never a worktree. A per-case run is `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`, with `--allow-tools` last and exactly those two grants. The agent-tool entry goes in a case's own `allowed_tools`, never on the command line (D-04 b, D-18).
  - **Bash audit:** after every run, report every Bash command in each kept `out/trace.jsonl` with its permission record. Allowed: `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine`, `--epics` or `--stale` on `.planning/seldon`, `.planning/seldon/repair-log` or `.planning/seldon/sowlist`. A read-only listing is allowed only if Daneel approves phase 6 Plan 7's ruling again. Anything else is a SECURITY checkpoint.
  - **Agent-start audit (D-04 c):** after every run, list every agent start in each kept trace with its agent type and permission record. A start of anything other than `seldon:readiness` stops the run and goes to Daneel.
  - **Retries:** this probe has two runs in all (D-04 a). A phase 8 case gets at most three tries, and a retry comes only after a fix, or after a miss the trace shows is model variance.
  - **Seeds (D-04 e):** every new `seed.sh` is vetted at a checkpoint quoting it before its first run.
  - **Cleanup:** before a kept folder goes, copy its `out/trace.jsonl` into `evals/results/phase-8-traces/`, which git ignores, named for the case and the try. Then remove only the folders the runs printed as kept, by their exact paths, never by a glob.
  - **Where things are:** a kept run's workspace is `<kept>/sealed/home/cwd/`, and its session transcript is under `config/projects/` in the kept folder.
  - **No binary:** nothing is read or copied out of the Claude binary or the files it ships with. Claude Code's behavior comes from its published documentation and from runs.
- **Held:** no push, tag, PR or GitHub change, no install of any kind, and nothing published (D-16).

## Tasks

### Task 1: Measure how the readiness agent starts

- **Files:** skills/seldon/SKILL.md, agents/readiness.md, evals/readiness-probe/case.yaml, evals/readiness-probe/prompt.md, evals/readiness-probe/seed.sh, evals/readiness-probe/graders/starts-agent.md, evals/readiness-probe/graders/no-read-documents.md
- **Reads:** skills/seldon/SKILL.md#2. Where a run starts, evals/resume-later/seed.sh, evals/results/phase-7-traces/full-run-2/resume-later.trace.jsonl, /code/cadence/agents/cad-assumptions-analyzer.md, .planning/phases/7/PLAN-1.md#Task 1: Measure whether SKILL.md loads whole at phase 7's size
- **Decisions:** D-01, D-02, D-04, D-18
- **Pins:** tests/skill.test.mjs, tests/scaffold.test.mjs
- **Action:** Get the SECURITY approval in Context first, and run nothing before it. Every file this task writes is temporary, and nothing is committed.
  - **Docs:** from Claude Code's published documentation, through Context7 or its docs site, record what it says about three things, with the source of each:
    - the name of the tool that starts a subagent, and the permission-rule form that names one subagent
    - the frontmatter a plugin agent takes, `tools` and `disallowedTools` included
    - whether a plugin manifest takes `engines`

    The init record of a kept phase 7 trace lists `Task` among the tools on 2.1.327. That's a pointer, and run 1's trace settles the spelling.
  - **The stand-in agent:** write `agents/readiness.md` with `name: readiness`, a one-line description, `tools: Read` and `disallowedTools: Write, Edit, Bash` (D-01). Its body says to Read each path its prompt names, and nothing else, and to reply with each file's first line, one per line, and nothing more.
  - **Validator:**
    - Run `claude plugin validate --strict .` with the stand-in in place. That's answer 4.
    - Copy `.claude-plugin/` to the scratch area, add `"engines": {"claude-code": ">=<this machine's claude --version>"}` to the copy's `plugin.json`, and run `claude plugin validate --strict` on that copy. Record what it says. The tracked `plugin.json` is never edited.
  - **The stand-in skill:** save a copy of SKILL.md in the scratch area. In the original:
    - add one `allowed-tools` entry, the documented tool scoped to `seldon:readiness` in the documented rule form
    - replace the whole body of the "All four documents, nothing stale, and empty arguments" bullet, keeping only its bold label. The body runs from "write nothing. End your message with exactly these words" through the closing fence after the later-release line, so the "exactly these words" lead-in and the fence both go. An instruction left inside that fence would be text the skill is told to print, not to follow.
    - the new body is this instruction, as plain prose with no fence, naming the tool by the name the docs step recorded: write nothing. Start the agent `seldon:readiness` with the `<tool>` tool, its prompt holding exactly `.planning/seldon/prd.md`, `.planning/seldon/spine.md` and `.planning/seldon/epics.md`, one per line. Never Read those three files yourself. End your message with the agent's reply, word for word.

    Change no line outside that bullet and the `allowed-tools` list.
  - **The probe case,** `evals/readiness-probe/`:
    - `seed.sh` copies `samples/brief.md`, `samples/prd.md`, `samples/spine.md` and `samples/epics.md` into `.planning/seldon/`, in `evals/resume-later/seed.sh`'s form
    - `prompt.md` is `/seldon`
    - `case.yaml` uses `max_turns: 20` and `timeout_seconds: 600`
    - graders: `starts-agent` is `tool_used` on the agent tool with `min: 1`. `no-read-documents` is `tool_used` Read, with an `input_match` naming the three files and `max: 0`.

    The graders' scores are measurements: read with the trace, `no-read-documents` shows whether `tool_used` counts the agent's own calls.
  - **Run 1:** `allowed_tools` is `[Skill, Read, Glob, Grep, "<entry>"]`, the entry scoped to `seldon:readiness` exactly as in SKILL.md. Run the case once with the per-case command, then do both audits. Record:
    - whether the start ran, and the tool name the trace shows
    - whether and how the agent's records appear, such as a parent tool-use id on them
    - both graders' results
    - the init record's `claude_code_version`
    - the result's turn count beside the turns the skill and the agent each took, which shows whether `max_turns` counts the agent's turns
  - **Run 2:** the case's entry is scoped to `seldon:not-readiness`, and SKILL.md keeps its entry scoped to `seldon:readiness`. Run once, audit, and record the start's permission record.
    - Refused means the case's list governs a start in the eval, which is what AC5's case relies on. It also means a scoped entry doesn't match another agent's name.
    - Run 2 changes only that one entry. A name no agent has is used so no real agent can be allowed by it.
  - **Restore:** copy both traces into `evals/results/phase-8-traces/`. Restore SKILL.md from the saved copy, delete `agents/readiness.md`, `agents/` and `evals/readiness-probe/`, and remove both kept folders by their exact paths.
  - **Outcome:**
    - **Scoped:** run 1's start of `seldon:readiness` ran, and run 2's was refused. Plans 2 to 7 use that entry, spelled as run 1's trace spells the tool.
    - **Not scoped, or not shown:** run 2's start ran, run 1 never started the agent, or the runs can't tell the two apart. Stop here (D-02, D-04 d). Nothing goes into SKILL.md's grant until Daneel rules.
    - **Validator:** if `validate --strict` refuses the agent frontmatter, Plan 2's Task 1 waits for Daneel's ruling. If it refuses `engines`, Plan 2's Task 3 writes nothing.
  - **Report:** stop at a checkpoint that gives Daneel the four answers, the version, the `engines` result and the outcome. AC2's graders in Plan 6 follow his ruling (D-04, D-18).
- **Verify:**
  - **Testing scope:** the outcomes are CONTEXT's four open assumptions, which nothing answers today. Two runs, their traces, two diagnostic graders and one validator call are the evidence, and testing stops there. The cases in Plans 3, 5 and 6 test the real agent.
  - (1) Daneel's approval of phase 8's runs is recorded. This is the SECURITY checkpoint in Context. The checkpoint asks, as a question of its own, whether Daneel approves phase 6 Plan 7's read-only listing ruling again for phase 8, and the answer is recorded beside the approval.
  - (2) The seed is vetted at a checkpoint before run 1, and `node --test tests/scaffold.test.mjs` passes while the probe case is there.
  - (3) The report quotes `claude plugin validate --strict .`'s output with the stand-in agent, and the copy's output with `engines`.
  - (4) Neither run prints `scaffold failed`. The Bash audit and the agent-start audit are reported for both, and no start is of anything but `seldon:readiness`.
  - (5) The report gives the four answers, each quoting its trace line or output, plus the version, the turn counts and the outcome. It goes to Daneel at a checkpoint.
  - (6) After the restore:
    - `git diff --exit-code -- skills/seldon/SKILL.md` exits 0, and `wc -c skills/seldon/SKILL.md` prints 74471
    - `git status --porcelain -- agents evals/readiness-probe` prints nothing
    - `ls -d` fails on each exact kept path the runs printed
    - both trace copies are in `evals/results/phase-8-traces/`

## Notes

- Run 2's refusal answers two questions with one run, and that's a deliberate choice. A start refused under an entry scoped to another name, while SKILL.md grants `seldon:readiness`, shows both that the case's list governs in the eval and that the scope is matched rather than ignored. What it can't show is whether the skill's own entry is needed inside an eval. D-02 adds that entry anyway, for runs outside an eval, so the probe spends no run on it.
