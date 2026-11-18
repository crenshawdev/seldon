PLAN CHECKPOINT: human-verify
Plan: .planning/phases/8/PLAN-7.md
Tasks: 2 of 3
| Task | Commit | Note |
|---|---|---|
| 1 - Describe the readiness check and the handoff | b7c33e9 | Earlier dispatch, not redone. Record in plan-7.1.md. |
| 2 - Say what the grant doesn't limit | b657af4 | Earlier dispatch, not redone. Record in plan-7.1.md. |
| 3 - List every case and run the full suite | 32d0e13, e6a5d54, 2481a6f, 16b791d, 900d872 (earlier dispatches), 4cf4f7c, dacedd9 | This pass wrote the lead's two ruled changes and stopped before any eval run. 4cf4f7c adds the open-decision rule to agents/readiness.md. dacedd9 adds the case.yaml string-scalar line check. The frontmatter pin passes 4 of 4, `claude plugin validate --strict .` passes, the unit suite passes 115 of 115, and the planted failure failed and named its file and line. STOPPED for the lead to accept both diffs. No `claude plugin eval` was run. |

This pass continues from the decision checkpoint after full run 2. That report was rotated to `plan-7.3.md` before this pass's first write. It holds full run 2, its audits, AC6 and the question this ruling answers.

## Checkpoint outcome (the lead, Daneel [e140f7], quoted as relayed)

"a change to agents/readiness.md, as in your (c), but anchored somewhere else than your sentence. ... The finding breaks the definition three ways: Readiness.md:55-58 says a decision left open is 'A choice between parts that an epic needs'. No epic needs this one; only the spine mentions it. :64-65 says 'A choice the spine makes at all isn't open'. :69-70 says 'An `[ASSUMPTION]` tag anywhere' is not a finding. That makes it the agent breaking written rules on one input, not a borderline the rules leave open. ... The change: one or two sentences in the decision-left-open bullets, saying: 1. The choice has to come from what an epic's Outcome, Boundaries, Done-when items or requirements, or the PRD, need. 2. A detail that only the spine mentions can't raise this finding. 3. A spine line tagged `[ASSUMPTION]` settles the choice it states. Change nothing else in the file. The frontmatter pin stays green."

On the YAML test: "(a), with one limit on its scope ... apply the check only to keys whose value is meant to be a plain string, such as name and description and any other string-valued key the case files use. Leave flow collections alone. `allowed_tools: [Skill, Read, Glob, Grep]` and `disallowed_tools: [Agent]` start with `[` on purpose and must not trip it. Before the planted failure, the test must pass on every case.yaml in the tree as it stands. Name the test for what it checks ... so nobody reads it as a full parse."

## Change 1: agents/readiness.md (4cf4f7c), whole diff

One bullet with two sentences, added as the last of the decision-left-open bullets. Sentence 1 carries points 1 and 2, and sentence 2 carries point 3. No other line in the file changes, and the frontmatter is untouched. The section names in the new bullet (Outcome, Boundaries, Done when, Requirements) are the field labels in `samples/epics.md:5-12`.

```diff
diff --git a/agents/readiness.md b/agents/readiness.md
index dfef725..fbf76c1 100644
--- a/agents/readiness.md
+++ b/agents/readiness.md
@@ -63,6 +63,10 @@ the epics and the choice in a few words. The step that fixes it is the spine.
   it once, as the crossing, never also as a decision left open.
 - A choice the spine makes at all isn't open, whether it makes it loosely or as
   an `[ASSUMPTION]` guess.
+- The choice has to come from what an epic's Outcome, Boundaries, Done-when
+  items or requirements, or the PRD, need, so a detail only the spine mentions
+  can't raise this finding. A spine line tagged `[ASSUMPTION]` settles the
+  choice it states.
 
 ## Not findings
 
```

- `wc -c agents/readiness.md`: **4731** (it was 4481, so +250).
- Predicted: `node --test tests/skill.test.mjs` would pass with fail 0, including "the readiness agent gets Read and nothing that writes or runs a command". Observed: tests 4, pass 4, fail 0, exit 0.
- Predicted: `claude plugin validate --strict .` would exit 0. Observed: "✔ Validation passed", exit 0. It lists `agents: seldon:readiness`. Its one warning, ICON_MISSING, was already there and "do[es] not change the result".
- SKILL.md: section 22 quotes only the agent's reply forms (`SKILL.md:1592-1594`), and this change doesn't touch them. Nowhere does SKILL.md restate the decision-left-open definition or its bullets, so it needs no edit and none was made. README.md:57 restates the base definition ("a choice between parts that an epic needs and no spine decision makes"). The new bullet narrows that definition without contradicting it, so README.md:57 is still true. Unchanged.
- Lint and typecheck: `workflow.lint_command` is null, and `detect-commands` returns lint null and typecheck null. Cadence finds no static-analysis command for this project, so that step was skipped.

## Change 2: tests/scaffold.test.mjs (dacedd9), whole diff

```diff
diff --git a/tests/scaffold.test.mjs b/tests/scaffold.test.mjs
index c64f9f8..ca5f2eb 100644
--- a/tests/scaffold.test.mjs
+++ b/tests/scaffold.test.mjs
@@ -104,6 +104,67 @@ test('every tool_used grader that states a max also states its min', () => {
   assert.deepEqual(unbounded, [], `\na max: with no min: reads as expected 1..max and can't pass:\n${unbounded.join('\n')}`);
 });
 
+// The case.yaml keys whose value is text; allowed_tools: [...] is a flow list on purpose and never reaches this.
+const STRING_KEY = /^ *(schema_version|name|description|history_file|scaffold_script):[ \t]+(.*?)[ \t\r]*$/;
+// A plain value can't start with any of these and still be read as the text it looks like.
+const INDICATOR = /^[-?:,[\]{}#&*!|>%@`]/;
+
+function plainStringProblems(source) {
+  const problems = [];
+  source.split('\n').forEach((text, i) => {
+    const m = text.match(STRING_KEY);
+    if (!m || m[2] === '' || m[2][0] === '"' || m[2][0] === "'") return;
+    const [, key, value] = m;
+    let why = null;
+    if (INDICATOR.test(value)) why = `starts with ${value[0]}`;
+    else if (/:(?:[ \t]|$)/.test(value)) why = 'holds ": "';
+    else if (/[ \t]#/.test(value)) why = 'holds " #"';
+    if (why) problems.push({ line: i + 1, key, why });
+  });
+  return problems;
+}
+
+// 900d872's class: an unquoted "word for word: the" in a description stopped the eval loading the case.
+test('every case.yaml string key\'s unquoted value has no ": ", no " #" and no leading YAML indicator (a line check, not a YAML parse)', () => {
+  const problems = [];
+  let files = 0;
+  for (const entry of readdirSync(evals, { recursive: true })) {
+    const path = String(entry);
+    if (path.split(sep)[0] === 'results' || path.split(sep).pop() !== 'case.yaml') continue;
+    files += 1;
+    for (const p of plainStringProblems(readFileSync(join(evals, path), 'utf8'))) {
+      problems.push(`evals/${path.split(sep).join('/')}:${p.line}: ${p.key}'s unquoted value ${p.why}, so YAML won't read it as written; quote it`);
+    }
+  }
+  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
+  assert.ok(files > 0, 'found no case.yaml under evals/');
+});
+
+test('the string-key line check flags ": ", " #" and a leading indicator, and leaves quoted values and flow lists alone', () => {
+  const flagged = [
+    ['description: each quoted word for word: the trust answer\n', 'holds ": "'],
+    ['description: ends on a colon:\n', 'holds ": "'],
+    ['description: the fix # not a comment\n', 'holds " #"'],
+    ['name: [resume-later]\n', 'starts with ['],
+    ['description: *anchor\n', 'starts with *'],
+    ['context:\n  history_file: a: b.jsonl\n', 'holds ": "'],
+  ];
+  for (const [source, why] of flagged) {
+    assert.equal(plainStringProblems(source).length, 1, JSON.stringify(source));
+    assert.equal(plainStringProblems(source)[0].why, why, JSON.stringify(source));
+  }
+  assert.equal(plainStringProblems('context:\n  history_file: a: b.jsonl\n')[0].line, 2);
+  const clean = [
+    'description: "word for word: the trust answer # and more"\n',
+    "description: 'word for word: the trust answer'\n",
+    'schema_version: "1.1"\n',
+    'name: resume-later\n',
+    'description: A bare /seldon, at 10:30 for issue#1, with a URL like https://example.com\n',
+    'execution:\n  allowed_tools: [Skill, Read, Glob, Grep]\n  disallowed_tools: [Agent]\n',
+  ];
+  for (const source of clean) assert.deepEqual(plainStringProblems(source), [], JSON.stringify(source));
+});
+
 test('every allowed form passes', (t) => {
   const dir = mkdtempSync(join(tmpdir(), 'seldon-scaffold-'));
   t.after(() => rmSync(dir, { recursive: true, force: true }));
```

What it checks, and its limits:
- **Keys:** `schema_version`, `name`, `description`, `history_file` and `scaffold_script` are the five keys with text values that the case files use, from an inventory of all 56 case.yaml files. `runs`, `max_turns` and `timeout_seconds` are integers, and `context` and `execution` are mappings. `allowed_tools` and `disallowed_tools` are not in the key list, so flow lists never reach the check.
- **Skipped:** a value that opens with `"` or `'` is quoted and skipped, and so is an empty value.
- **Fails:** an unquoted value fails in three cases:
  - it starts with one of `` -?:,[]{}#&*!|>%@` ``
  - it holds `:` followed by a blank or the end of the line
  - it holds a blank followed by `#`
- **Beyond the ruling's literal wording:**
  - A `:` at the end of the value is checked as well as `: `. YAML reads both as a mapping indicator, and once trailing blanks are trimmed, `: ` at the end of a line is a final `:`.
  - A tab before `#` counts as well as a space.
- **The message:** each problem names `evals/<case>/case.yaml:<line>`, the key and why, and says "quote it".
- **Two tests:**
  - The tree test, named "every case.yaml string key's unquoted value has no ": ", no " #" and no leading YAML indicator (a line check, not a YAML parse)", reads every case.yaml under `evals/` except `results/`.
  - A fixed-input test pins what the detector flags and what it leaves alone, so a detector that stops flagging can't pass quietly on a clean tree. Its clean list includes the two flow-list lines the ruling names, both exactly as written in the case files.

### Pass/fail record (test-first)

1. **The tree as it stands, before any plant.** Predicted: all 7 scaffold tests pass. Observed: 6 passed and 1 failed. The tree test passed on all 56 case.yaml files (counted separately: 56 scanned). The fixed-input test failed on one of my own clean fixtures, `description: A bare /seldon, at 10:30 or #1, ...`, which the check flagged as `holds " #"`. The check was right: ` #1` opens a YAML comment, so the fixture was wrong, not the detector. Fixed by changing that fixture to `issue#1`, which has no blank before the `#`. Rerun: tests 7, pass 7, fail 0. (Recorded as a deviation below.)
2. **Planted failure.** `evals/spine-conventions/case.yaml` was backed up to the scratchpad and replaced with `git show 900d872^:evals/spine-conventions/case.yaml`, the unquoted description that 900d872 fixed (`git diff --stat`: 1 line changed). Predicted: exit 1, 6 pass and 1 fail, with the tree test giving exactly one problem line. Observed: exit 1, tests 7, pass 6, fail 1. The failing test was the tree test, and its only problem line was:
   `evals/spine-conventions/case.yaml:3: description's unquoted value holds ": ", so YAML won't read it as written; quote it`
3. **Restored.** The backup was copied back. `git diff --quiet` held, and `git hash-object` equals `HEAD:evals/spine-conventions/case.yaml`. Rerun: tests 7, pass 7, fail 0.
4. **Unit suite.** Predicted: `node --test tests/*.test.mjs` gives pass 115 (the lead's 113 plus the 2 new tests), fail 0. Observed: tests 115, pass 115, fail 0, exit 0.

## Commits and lease

- Each commit was staged by name and passed `lease-check --phase 8 --plan 7` (`ok:true`, staged 1, declared 11).
  - 4cf4f7c touches only agents/readiness.md (+4).
  - dacedd9 touches only tests/scaffold.test.mjs (+61).
- No deletions in either commit.
- The git-ignored `evals/spine-conventions/cb5abfcc-...jsonl` is still ignored and in neither commit. The only tracked jsonl in that folder is `history.jsonl`.
- Unrelated working-tree changes (`.planning/STATE.md`, `.planning/records/state.json`, `.idea/`, the phase 8 REVIEW and ADJUDICATION records) were left alone and not staged.

## Not done (waiting on the lead)

- No `claude plugin eval` of any kind was run in this pass.
- These wait for the lead to accept both diffs, per the ruling, and come in a later dispatch:
  - solo runs of resume-later, handoff-cadence, handoff-named, readiness-findings, readiness-crossing and readiness-agent, whose try counts restart at this fix
  - then two full runs, all at 1.00, with any miss stopping with the lead
- Verify (3) and AC7 are still not met.
- The plan's final full suite hasn't run, because Task 3 isn't done. The unit-suite run above is this pass's own check.

Deviations:
- [deviation] PLAN-7 asserted (Verify 3, AC7) that the README's command passes with all 57 cases at 1.00 on two full runs, against agents/readiness.md as Plan 6 wrote it. In fact, full run 2 showed the agent raising "Decision left open: E-02, E-03" on a detail only the spine mentions (samples/spine.md:19, tagged `[ASSUMPTION]`). That breaks its own rules at readiness.md:55-58, :64-65 and :69-70. Done: on the lead's ruling, one bullet holding the choice to what an epic's Outcome, Boundaries, Done-when items or requirements, or the PRD, need was added to the decision-left-open bullets (4cf4f7c). The case.yaml string-scalar line check for 900d872's class was added too (dacedd9). The runs that follow are a later dispatch's.
- [deviation] Expected: all 7 scaffold tests pass on the first run after writing the check. Observed: the fixed-input test failed, because my clean fixture `... or #1 ...` really does hold a YAML comment start, which the check correctly flagged. Done: the fixture became `issue#1`. The detector didn't change.

Open items:
- **For the lead (this checkpoint):** accept or amend the two diffs above before the later dispatch runs the six solo runs and the two full runs.
- `scaffold_script` is in the new check's key list, as the ruling's "any other string-valued key the case files use" asks. The older `scaffoldNames()` deliberately accepts `scaffold_script: seed.sh  # copies samples/`, a name followed by a comment (tests/scaffold.test.mjs:184). The new check would fail that form as `holds " #"`. No case.yaml uses it today, so nothing is red, but the two checks disagree on that one form. The other way: drop `scaffold_script` from `STRING_KEY`, since `NAMED` already limits its value to `[A-Za-z0-9._-]+`, which can't hold `: ` or begin with an indicator. Lead's call. As written, it is the stricter reading of the ruling.
- A block-scalar description (`description: >` or `|` with the text on following lines) would be flagged as starting with an indicator. A line check can't read the lines that follow, so the form is flagged rather than skipped, the same stance as the scaffold-name test. No case.yaml uses it today.
- plan-7.3.md's open item asking for a YAML-parse test is closed by dacedd9, in the line-check shape the lead ruled. No parser was added.
- Carried from plan-7.3.md and plan-7.2.md: the git-ignored replay session files and HTML report folders each run adds, which are not staged. The rest stand as written there.
