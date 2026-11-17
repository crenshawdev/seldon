---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
pattern: '^## E-02:[^\n]*(?=(?:\n(?!## )[^\n]*)*?\n\*\*Requirements:\*\*[^\n]*\bLOAN-01\b)(?=(?:\n(?!## )[^\n]*)*?\n\*\*Requirements:\*\*[^\n]*\bLOAN-02\b)(?=(?:\n(?!## )[^\n]*)*?\n\*\*Spine decisions:\*\*(?![^\n]*\bS-03\b))'
flags: m
---
