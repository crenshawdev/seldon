---
type: regex
target:
  source: file
  path: .planning/seldon/brief.md
match: not_contains
pattern: '^(?![ \t]*(?:#|>|\(|$))(?![^\n]*\[ASSUMPTION\])[^\n]+(?:\n(?=[ \t]*(?:#|- |$))|(?![\s\S]))'
flags: m
---
