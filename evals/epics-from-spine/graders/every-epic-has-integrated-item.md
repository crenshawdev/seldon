---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^## E-\d{2,}:[^\n]*(?:\n(?!- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing\.$)(?!## )[^\n]*)*(?=\n## |(?![\s\S]))'
flags: m
---
