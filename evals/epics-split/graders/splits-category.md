---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
pattern: '^\*\*Requirements:\*\*[^\n]*\bPLOT-0[1-3]\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-0[4-8]\b|^\*\*Requirements:\*\*[^\n]*\bPLOT-0[4-8]\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-0[1-3]\b'
flags: m
---
