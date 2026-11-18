---
type: regex
target:
  source: file
  path: .planning/seldon/brief.md
pattern: '## What it refuses[ \t]*\r?\n(?:(?!## )[^\n]*\n)*?[ \t]*- [^\n]*\bbecause\b'
flags: i
---
