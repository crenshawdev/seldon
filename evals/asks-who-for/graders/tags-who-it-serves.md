---
type: regex
target:
  source: file
  path: .planning/seldon/brief.md
pattern: '## Who it serves[ \t]*\r?\n(?:(?!## )[^\n]*\n)*?(?!## )[^\n]*\[ASSUMPTION\]'
---
