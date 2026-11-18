## Todos

- None.
- [ ] (phase 9) Inside the eval sandbox every granted Bash call to the check reports "Exit code 1" even when the check printed its pass line, because the shell wrapper can't write its cwd file there ("zsh:1: read-only file system"). A model that retries on that false error costs turns. Find out whether the check can report its result in a way that survives the read-only cwd, or whether the skill should say to trust the pass line.
- [ ] (phase 8) EPIC-02's other half: the readiness check flags an epic too small to ship on its own, and it's merged into a neighbour until it can stand alone, because Cadence ships each phase as it verifies (John's ship-each-phase rule).
- [ ] (phase 9) Anchor the recommends-fast-path pattern (multiline, ^...$) in both evals/fast-path and evals/cadence-dump graders, so a bold, mid-sentence or split recommendation fails, as SKILL.md §6's plain-text line requires.
- [ ] (phase 9) In real users' sessions, the spine step's "never a shell command" and its secret-file rule are guarded by prose only. In the evals, the model ran a shell listing in 4 of 4 spine runs despite the rule (plan-7.md rows 11, 16, 19, 20), and Claude Code auto-allowed it as read-only. Unverified: the same auto-allow likely applies in a user's session, so a shell read of .env there rests only on the skill's wording. Find a guard that doesn't rest on prose, or tell users how to deny reads of secret files.

## Seeds

- None.

## Notes

- None.

## Debt markers

- None.
