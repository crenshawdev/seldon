import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflows = join(root, '.github', 'workflows');

// Key on the subcommand: npx or a pinned package name still says "plugin eval", and \ or a folded >- can't split it.
const EVAL = /\bplugin(?:\s|\\)+eval\b/gi;
const MODEL_KEY = /ANTHROPIC_API_KEY/gi;
// Every mention of secrets counts, not just secrets.X: toJSON(secrets) and secrets: inherit hand over the lot.
const SECRETS = /\bsecrets\b/gi;
// Expression contexts ignore case, so secrets.github_token is the same token.
const GITHUB_TOKEN = /^\s*(?:\.\s*GITHUB_TOKEN\b|\[\s*(['"])GITHUB_TOKEN\1\s*\])/i;
// Every YAML escape starts with a backslash, and with none YAML can only fold lines with a space, so no split name rejoins.
const ESCAPE = /\\/g;
// An OIDC token logs a job into Bedrock or Vertex, and that reaches a model with no key to grep for.
const ID_TOKEN = /\bid-token['"]?\s*:/g;
// write-all grants id-token without naming it; the bare word still counts behind an alias, a tag or a line break.
const WRITE_ALL = /\bwrite-all\b/g;

function workflowProblems(text) {
  const problems = [];
  const lineOf = (index) => text.slice(0, index).split('\n').length;
  for (const m of text.matchAll(ESCAPE)) problems.push({ line: lineOf(m.index), why: 'a YAML escape that can spell a hidden name' });
  for (const m of text.matchAll(ID_TOKEN)) problems.push({ line: lineOf(m.index), why: 'a cloud login that can reach a model without a key' });
  for (const m of text.matchAll(WRITE_ALL)) problems.push({ line: lineOf(m.index), why: 'a cloud login that can reach a model without a key' });
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

// \u0041 is "A", so the raw text never says ANTHROPIC and only the escape check can catch it.
const ESCAPED_KEY = 'env:\n  K: "\\u0041NTHROPIC_API_KEY"\n';

test('an escaped model key is caught as an escape, not by name', () => {
  assert.ok(ESCAPED_KEY.includes('\\u0041') && !ESCAPED_KEY.includes('ANTHROPIC'));
  const reasons = workflowProblems(ESCAPED_KEY).map((p) => p.why);
  assert.ok(reasons.includes('a YAML escape that can spell a hidden name'));
  assert.ok(!reasons.includes('names ANTHROPIC_API_KEY'));
});

// A \ before a line break in a double-quoted scalar drops the break, so YAML reads this as secrets.MODEL_KEY.
const SPLIT_SECRET = 'KEY: "${{ secr\\\n   ets.MODEL_KEY }}"\n';

test('a name split by an escaped line break is caught as an escape', () => {
  assert.ok(SPLIT_SECRET.includes('secr\\\n') && !SPLIT_SECRET.includes('secrets'));
  assert.deepEqual(workflowProblems(SPLIT_SECRET), [{ line: 1, why: 'a YAML escape that can spell a hidden name' }]);
});

test('the eval command, a model key and any secret but GITHUB_TOKEN are each flagged on their line', () => {
  const flagged = [
    ['steps:\n  - run: claude plugin eval .\n', 2, 'runs claude plugin eval'],
    ['steps:\n  - run: >-\n      claude plugin\n      eval . --no-publish\n', 3, 'runs claude plugin eval'],
    ['  - run: npx -y @anthropic-ai/claude-code@2.1.327 plugin eval .\n', 1, 'runs claude plugin eval'],
    ['  - run: |\n      claude plugin \\\n        eval .\n', 2, 'a YAML escape that can spell a hidden name', 'runs claude plugin eval'],
    ['env:\n  ANTHROPIC_API_KEY: x\n', 2, 'names ANTHROPIC_API_KEY'],
    ['env:\n  KEY: ${{ secrets.MODEL_KEY }}\n', 2, 'reaches a secret other than GITHUB_TOKEN'],
    ["env:\n  KEY: ${{ secrets['CLAUDE_CODE_OAUTH_TOKEN'] }}\n", 2, 'reaches a secret other than GITHUB_TOKEN'],
    ['env:\n  KEY: ${{ secrets.SONAR_TOKEN }}\n', 2, 'reaches a secret other than GITHUB_TOKEN'],
    // \\ so a real backslash reaches the guard; a bare \x73 would be JS spelling "s" before the test sees it.
    ['run: "${{ \\x73ecrets.MODEL_KEY }}"\n', 1, 'a YAML escape that can spell a hidden name'],
    [ESCAPED_KEY, 2, 'a YAML escape that can spell a hidden name'],
    ['"\\U00000073ecrets"\n', 1, 'a YAML escape that can spell a hidden name'],
    ['permissions:\n  id-token: write\n', 2, 'a cloud login that can reach a model without a key'],
    ['permissions: write-all\n', 1, 'a cloud login that can reach a model without a key'],
    ['jobs:\n  test:\n    permissions: "write-all"\n', 3, 'a cloud login that can reach a model without a key'],
  ];
  for (const [text, line, ...whys] of flagged) {
    assert.deepEqual(workflowProblems(text), whys.map((why) => ({ line, why })), JSON.stringify(text));
  }
  const clean = [
    '      - run: claude plugin validate --strict .\n',
    '# No eval runs here and no step sees a model key; evals run locally under /cad-verify.\n',
    '        env:\n          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n',
  ];
  for (const text of clean) assert.deepEqual(workflowProblems(text), [], JSON.stringify(text));
});
