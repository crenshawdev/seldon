---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
pattern: '(?:^|\n)## Non-goals[ \t]*\r?\n(?=(?:(?!## )[^\n]*\n)*?- [^\n]*\b[Bb]ecause\b[^\n]*\n  > fees get paid in cash at the spring meeting, keep money out of it[ \t]*(?:\r?\n|$))(?=(?:(?!## )[^\n]*\n)*?- [^\n]*\b[Bb]ecause\b[^\n]*\n  > no swapping plots behind our backs, the committee assigns every plot[ \t]*(?:\r?\n|$))'
---
