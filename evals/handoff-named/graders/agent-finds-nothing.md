---
type: regex
target: trace
pattern: '^(?=[^\n]*"type":"user")(?=[^\n]*"type":"tool_result")(?=[^\n]*"agentType":"seldon:readiness")[^\n]*(?:"text":"|\\n[ \t]*)The readiness check found nothing to fix\.[ \t]*(?:"|\\n)'
flags: m
---
