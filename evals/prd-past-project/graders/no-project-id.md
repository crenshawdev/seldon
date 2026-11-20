---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
match: not_contains
pattern: '^- \*\*(?:CAT-0[1-4]|LOAN-0[1-7]|NFR-0[1-4])\*\*:'
flags: m
---
