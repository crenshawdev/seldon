---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '^## S-\d{2,}:[^\n]*(?:\n(?!## )[^\n]*)*?\n([ \t]*)> [^\n]*plinkward[^\n]*(?:\n\1> [^\n]*)*\n\1\(src/tools\.mjs\)[ \t]*$'
flags: m
---
