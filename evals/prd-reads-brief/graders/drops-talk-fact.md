---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
match: not_contains
pattern: '(?<![\w-])(?:12|12th|twelve|twelfth)(?!\w)|\bdozen\b'
flags: i
---
