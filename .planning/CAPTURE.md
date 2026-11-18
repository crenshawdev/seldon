## Todos

- None.
- [ ] (phase 9) Inside the eval sandbox every granted Bash call to the check reports "Exit code 1" even when the check printed its pass line, because the shell wrapper can't write its cwd file there ("zsh:1: read-only file system"). A model that retries on that false error costs turns. Find out whether the check can report its result in a way that survives the read-only cwd, or whether the skill should say to trust the pass line.
- [ ] (phase 9) Anchor the recommends-fast-path pattern (multiline, ^...$) in both evals/fast-path and evals/cadence-dump graders, so a bold, mid-sentence or split recommendation fails, as SKILL.md §6's plain-text line requires.
- [ ] (phase 9) In real users' sessions, the spine step's "never a shell command" and its secret-file rule are guarded by prose only. In the evals, the model ran a shell listing in 4 of 4 spine runs despite the rule (plan-7.md rows 11, 16, 19, 20), and Claude Code auto-allowed it as read-only. Unverified: the same auto-allow likely applies in a user's session, so a shell read of .env there rests only on the skill's wording. Find a guard that doesn't rest on prose, or tell users how to deny reads of secret files.
- [ ] (phase 9) Nothing in Claude Code's permissions limits which agent the skill starts. In phase 8's probe, a start of seldon:readiness ran with no Agent entry anywhere (evals/results/phase-8-traces/readiness-probe-run-3.trace.jsonl), and the eval's init record lists claude, Explore, general-purpose, Plan and statusline-setup as startable too. In real users' sessions the one-agent rule rests on SKILL.md's wording, and in the evals on the no-other-agent grader. Find a guard that doesn't rest on wording. Unverified: that a user's session outside the eval behaves as run 3 did.
- [ ] (phase 9, must) No case shows the readiness agent raising a real "Decision left open". Phase 8 narrowed that kind after full run 2, so it comes only from what an epic or the PRD needs, never from a detail only the spine mentions. Add a fixture where two epics' own text needs a choice no spine decision makes, and prove the kind still fires after that change.

## Seeds

- None.

## Notes

- None.

## Debt markers

- None.
