---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
pattern: '^(?=[\s\S]*^\*\*Spine decisions:\*\*[^\n]*\bS-01\b)(?=[\s\S]*^\*\*Spine decisions:\*\*[^\n]*\bS-02\b)(?=[\s\S]*^\*\*Spine decisions:\*\*[^\n]*\bS-03\b)(?=[\s\S]*^\*\*Spine decisions:\*\*[^\n]*\bS-04\b)(?=[\s\S]*^\*\*Spine decisions:\*\*[^\n]*\bS-05\b)(?=[\s\S]*^\*\*Spine decisions:\*\*[^\n]*\bS-06\b)'
flags: m
---
