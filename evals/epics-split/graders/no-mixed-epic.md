---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^\*\*Requirements:\*\*(?=[^\n]*\bPLOT-0[1-3]\b)(?=[^\n]*\bPLOT-0[4-8]\b)'
flags: m
---
