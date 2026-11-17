## Todos

- None.
- [ ] (phase 6) FLOW-05 and ARCH-03: on a project already under Cadence, Seldon asks who relies on what today, and the spine records each answer as a constraint with an S- ID, which /cad-context then locks.
- [ ] (phase 5) EPIC-01 and EPIC-02: every epic must be shippable on its own. When it lands, main is in a state you'd release: tests green and no half-built feature showing. Its done-when includes integrated verification, as BMAD's slicing rule puts it ("Every epic delivers to production"). An epic that can't stand alone is split or merged until it can, because Cadence ships each phase as it verifies and that only works when each phase is self-contained.
- [ ] (phase 8) Inside the eval sandbox every granted Bash call to the check reports "Exit code 1" even when the check printed its pass line, because the shell wrapper can't write its cwd file there ("zsh:1: read-only file system"). A model that retries on that false error costs turns. Find out whether the check can report its result in a way that survives the read-only cwd, or whether the skill should say to trust the pass line.

## Seeds

- None.

## Notes

- None.

## Debt markers

- None.
