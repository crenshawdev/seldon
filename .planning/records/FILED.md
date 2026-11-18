# Filed: issues this repository's gates opened

Written by `issue-filing.mjs file` when a gate's finding is ACCEPTED and filed
on the tracker, read by `planning.mjs recall` beside CAPTURE.md. One `- ` row
per filed issue: the date, the provider, the repository slug, the finding's
(file, claim) fingerprint and the issue's title. No finding body - a row is a
pointer to an issue, not a copy of it, and NOTHING here is a queue. A declined
finding is never written here; its record is a row in DECLINED.md beside this
file, which is deliberately outside the recall corpus. A line that is not a row
is skipped, so a note added here mints no recall entry.

A row carrying the word `unconfirmed` before its colon is a create this
repository could not confirm landed - the forge may hold that issue and may not.
It is kept so a later fire does not file the same finding twice; delete the row
once you have looked, and nothing else here is unverified.

- 2026-11-18 github crenshawdev/seldon 4e6f6b15fe60fa89: [cadence 4e6f6b15fe60fa89] The fix closes the `.env*` case and the `.pem`/`.key` cases, but its only concrete exclusion, the three example globs `!**/.env*`, `!**/*.pem`, `!**/*.key`, does not match c
