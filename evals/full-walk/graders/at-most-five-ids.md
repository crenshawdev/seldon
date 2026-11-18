---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^\*\*Requirements:\*\*[^\n,]*(?:,[^\n,]*){5,}'
flags: m
---
