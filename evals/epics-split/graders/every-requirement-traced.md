---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
pattern: '^(?<![\s\S])(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-01\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-01\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-01\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-02\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-02\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-02\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-03\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-03\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-03\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-04\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-04\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-04\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-05\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-05\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-05\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-06\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-06\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-06\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-07\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-07\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-07\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-08\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-08\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bPLOT-08\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-01\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-01\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-01\b)'
flags: m
---
