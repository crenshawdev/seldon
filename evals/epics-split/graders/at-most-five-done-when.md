---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^\*\*Done when:\*\*[^\n]*(?:(?:\n(?!- |\*\*|## )[^\n]*)*\n- [^\n]*){6}'
flags: m
---
