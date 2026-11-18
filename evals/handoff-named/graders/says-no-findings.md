---
type: regex
target: last_message
pattern: '^(?<![\s\S])(?![\s\S]*(?:Requirement no epic names:|Epic crossing a boundary the spine didn''t fix:|Decision left open:))[\s\S]*?^[ \t]*The readiness check found nothing to fix\.[ \t]*\r?$'
flags: m
---
