---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^## E-\d{2,}:[^\n]*(?:\n(?!\*\*Spine decisions:\*\*(?=[^\n]*\bS-02\b)(?=[^\n]*\bS-04\b)(?=[^\n]*\bS-05\b))(?!## )[^\n]*)*(?=\n## |(?![\s\S]))'
flags: m
---
