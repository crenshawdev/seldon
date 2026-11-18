---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
pattern: '^(?<![\s\S])(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bCAT-01\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bCAT-01\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bCAT-01\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bCAT-02\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bCAT-02\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bCAT-02\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-01\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-01\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-01\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-02\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-02\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-02\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-03\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-03\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bLOAN-03\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-01\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-01\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-01\b)(?=[\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-02\b)(?![\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-02\b[\s\S]*^\*\*Requirements:\*\*[^\n]*\bNFR-02\b)'
flags: m
---
