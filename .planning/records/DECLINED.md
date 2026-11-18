# Declined: findings this repository said no to

Written by `issue-filing.mjs file` when a gate's finding is DECLINED, read by
`issue-filing.mjs unfixed` as the set it must never ask about again. Same row
grammar as FILED.md: the date, the provider, the repository slug, the finding's
(file, claim) fingerprint and its title.

NOT part of the recall corpus and not a queue. `planning.mjs recall` reads
CAPTURE.md, ARCHIVE.md, the task records and FILED.md by explicit path, and
this file is deliberately absent from that list - a decline is a closed
question, and putting closed questions in front of a planner is the
accumulation the corpus rules exist to prevent. Query it, do not load it.

A line that is not a row is skipped, so a human note added here changes nothing
the seam reads.

- 2026-11-17 github crenshawdev/seldon d26010ad8e3ca613: [cadence d26010ad8e3ca613] §18 states that architecture.md cites only S- IDs that are decisions in spine.md and names every one. That only holds at the moment the file is written. The routes that chan
- 2026-11-17 github crenshawdev/seldon f754b21258f796a6: [cadence f754b21258f796a6] The README says that with a spine there, `/seldon architecture` writes architecture.md. SKILL.md lines 58-60 (the f4394ed fix) write nothing when the brief or the PRD is mis
- 2026-11-17 github crenshawdev/seldon b26ddddfe2a7ed37: [cadence b26ddddfe2a7ed37] The README says the spine step 'asks what runs with nobody there', but the fixed question in SKILL.md line 777 is 'When should it run with nobody there?'. The skill finds th
- 2026-11-17 github crenshawdev/seldon db3c4d12730a9662: [cadence db3c4d12730a9662] The spine-from-prd line says the case checks that Seldon 'writes or edits no other file'. Its graders no-write-but-spine.md and no-edit-but-spine.md only match file paths un
- 2026-11-17 github crenshawdev/seldon cba62ec67bc9ddf1: [cadence cba62ec67bc9ddf1] checkEpics takes an epic's position from the first heading that declares its ID (declared.indexOf(id)), so when an earlier rejected heading (for example a tagged one) shares
- 2026-11-17 github crenshawdev/seldon 86f0692d0cd79ebc: [cadence 86f0692d0cd79ebc] The Done when count skips label-line text but never rejects it. A done-when that keeps a criterion on its label line and adds bullets below therefore passes, although FORMAT
- 2026-11-17 github crenshawdev/seldon 58ace95082a61eb2: [cadence 58ace95082a61eb2] The build-order rules contradict each other with no tie-break: 'Epics carrying the requirement IDs the PRD's MVP scope names come before the rest' and 'An epic depends only
- 2026-11-17 github crenshawdev/seldon f590a47545ce91be: [cadence f590a47545ce91be] The frontmatter description now names four documents (brief, PRD, spine, epics) and then says /seldon architecture writes the document 'from those three'. The antecedent is
- 2026-11-17 github crenshawdev/seldon 2f5e18a9aed4a812: [cadence 2f5e18a9aed4a812] The `/seldon epics` route checks only for `spine.md` and `epics.md`. With a spine but no `prd.md`, it goes straight to "The epics step" (or the rerun), and both read a PRD t
- 2026-11-18 github crenshawdev/seldon d0dd9e5f1dfd7f5a: [cadence d0dd9e5f1dfd7f5a] Task 1's Verify greps only for `PROJECT.md`, the name characters, 'which design', 'who relies on what' and `.planning/seldon/<name>/`. Two README statements the plan's must-
- 2026-11-18 github crenshawdev/seldon 01a9b33642438b39: [cadence 01a9b33642438b39] Locked D-14 keeps the paragraph on the grant and the seeds unchanged, but the only guard in either task checks that `git diff` drops no line starting `claude plugin eval`. N
- 2026-11-18 github crenshawdev/seldon dbf60ac880866538: [cadence dbf60ac880866538] The pattern 'Recommended path:[\s*_`]*fast path' with flag i has no line anchors. It also accepts newlines and bold or code markup between the words, so it passes when the l
- 2026-11-18 github crenshawdev/seldon a23d1c34dbc25157: [cadence a23d1c34dbc25157] The `<rules>` bullet still says each check runs "exactly as written there", and "The check" still says to run "exactly this" with `.planning/seldon`. The new paragraph at li
- 2026-11-18 github crenshawdev/seldon c35d41160ff1b946: [cadence c35d41160ff1b946] The repo-root comment in new-design-brief's seed.sh says the case lives in evals/new-design-name/, but this file is in evals/new-design-brief/. The whole file was copied fro
- 2026-11-18 github crenshawdev/seldon 89fbc43b7fe7dc82: [cadence 89fbc43b7fe7dc82] The 444fc4f edit says the spine step reads the code "with Read, Glob and Grep only, never a shell command". Every kept Cadence run in this range broke that rule and still sc
Note on 89fbc43b7fe7dc82: John declined it with "Go a" on 2026-11-18, as an exception to his rule that bug fixes always fix medium and high. Reason: no-secret already fails any read of the fake secret by any tool, and a Bash allow list would fail harmless listings such as find or tree in plan 8's full run for no safety gain. The real-user gap is the phase 9 todo in .planning/CAPTURE.md.
- 2026-11-18 github crenshawdev/seldon e37a62fa19725af4: [cadence e37a62fa19725af4] Plans 5, 6 and 7 all list skills/seldon/SKILL.md, but nothing in their depends_on puts them in order: 5 depends on [2,3,4], 6 on [4] and 7 on [3,6]. The phase input requires
- 2026-11-18 github crenshawdev/seldon 9446db28ad3461ff: [cadence 9446db28ad3461ff] The stale-spine replay was written in plan 5 (04f2bcd), before plan 6 added the conflict check (df590a3), and it was never updated. Its recorded `/seldon prd` turn applies a
Note on 9446db28ad3461ff: Daneel ruled on 2026-11-18 to record it for phase 9 and close phase 7 as it stands. It is in .planning/phases/7/SUMMARY.md under Open items, with the fix shape the review gave.
- 2026-11-18 github crenshawdev/seldon 7fb4b04dcc728f65: [cadence 7fb4b04dcc728f65] The SECRETS pattern flags the bare word `secrets` anywhere in a workflow, including comments and step names, which goes beyond the plan's "any `secrets.` reference". A corre
