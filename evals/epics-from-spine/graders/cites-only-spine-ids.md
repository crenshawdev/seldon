---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^\*\*Spine decisions:\*\*[^\n]*\bS-(?!0[1-6]\b)\d+'
flags: m
---
