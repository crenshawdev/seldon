import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflows = join(root, '.github', 'workflows');

// \s+ spans newlines too, so a folded >- block can't hide the command by splitting it.
const EVAL = /\bclaude\s+plugin\s+eval\b/g;
const MODEL_KEY = /ANTHROPIC_API_KEY/gi;
// Every mention of secrets counts, not just secrets.X: toJSON(secrets) and secrets: inherit hand over the lot.
const SECRETS = /\bsecrets\b/gi;
// Expression contexts ignore case, so secrets.github_token is the same token.
const GITHUB_TOKEN = /^\s*(?:\.\s*GITHUB_TOKEN\b|\[\s*(['"])GITHUB_TOKEN\1\s*\])/i;
// \x, \u and \U are YAML's only escapes that spell any character, so banning them beats decoding YAML.
const ESCAPE = /\\[xuU]/g;

function workflowProblems(text) {
  const problems = [];
  const lineOf = (index) => text.slice(0, index).split('\n').length;
  for (const m of text.matchAll(ESCAPE)) problems.push({ line: lineOf(m.index), why: 'a YAML escape that can spell a hidden name' });
  for (const m of text.matchAll(EVAL)) problems.push({ line: lineOf(m.index), why: 'runs claude plugin eval' });
  for (const m of text.matchAll(MODEL_KEY)) problems.push({ line: lineOf(m.index), why: 'names ANTHROPIC_API_KEY' });
  for (const m of text.matchAll(SECRETS)) {
    if (!GITHUB_TOKEN.test(text.slice(m.index + m[0].length))) problems.push({ line: lineOf(m.index), why: 'reaches a secret other than GITHUB_TOKEN' });
  }
  return problems;
}

test('no workflow runs the eval suite or sees a model key', () => {
  const files = readdirSync(workflows, { recursive: true })
    .map(String)
    .filter((path) => statSync(join(workflows, path)).isFile());
  assert.ok(files.length > 0, 'found no files under .github/workflows/');
  const problems = files.flatMap((path) =>
    workflowProblems(readFileSync(join(workflows, path), 'utf8')).map(
      (p) => `.github/workflows/${path.split(sep).join('/')}:${p.line}: ${p.why}`,
    ),
  );
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});

test('the eval command, a model key and any secret but GITHUB_TOKEN are each flagged on their line', () => {
  const flagged = [
    ['steps:\n  - run: claude plugin eval .\n', 2, 'runs claude plugin eval'],
    ['steps:\n  - run: >-\n      claude plugin\n      eval . --no-publish\n', 3, 'runs claude plugin eval'],
    ['env:\n  ANTHROPIC_API_KEY: x\n', 2, 'names ANTHROPIC_API_KEY'],
    ['env:\n  KEY: ${{ secrets.MODEL_KEY }}\n', 2, 'reaches a secret other than GITHUB_TOKEN'],
    ["env:\n  KEY: ${{ secrets['CLAUDE_CODE_OAUTH_TOKEN'] }}\n", 2, 'reaches a secret other than GITHUB_TOKEN'],
    ['env:\n  KEY: ${{ secrets.SONAR_TOKEN }}\n', 2, 'reaches a secret other than GITHUB_TOKEN'],
    // \\ so a real backslash reaches the guard; a bare \x73 would be JS spelling "s" before the test sees it.
    ['run: "${{ \\x73ecrets.MODEL_KEY }}"\n', 1, 'a YAML escape that can spell a hidden name'],
    ['env:\n  K: "\\u0041NTHROPIC_API_KEY"\n', 2, 'a YAML escape that can spell a hidden name'],
    ['"\\U00000073ecrets"\n', 1, 'a YAML escape that can spell a hidden name'],
  ];
  for (const [text, line, why] of flagged) assert.deepEqual(workflowProblems(text), [{ line, why }], JSON.stringify(text));
  const clean = [
    '      - run: claude plugin validate --strict .\n',
    '# No eval runs here and no step sees a model key; evals run locally under /cad-verify.\n',
    '        env:\n          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n',
  ];
  for (const text of clean) assert.deepEqual(workflowProblems(text), [], JSON.stringify(text));
});
