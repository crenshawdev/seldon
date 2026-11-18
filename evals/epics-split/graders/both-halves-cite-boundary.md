---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^## E-\d{2,}:[^\n]*(?=(?:\n(?!## )[^\n]*)*?\n\*\*Requirements:\*\*[^\n]*\bPLOT-0[1-8]\b)(?:\n(?!\*\*Spine decisions:\*\*[^\n]*\bS-02\b)(?!## )[^\n]*)*(?=\n## |(?![\s\S]))'
flags: m
---
