import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const evals = join(root, 'evals');

const REPO_LINE = 'repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"';
const SAMPLE = /^"\$repo\/samples\/([^"]*)"$/;

// No leading / or -, no ~, no $, no quotes or shell punctuation, and no way up with ..
function inside(path) {
  return /^[\w.][\w./-]*$/.test(path) && !path.split('/').includes('..');
}

// A scaffold runs as you, outside the sandbox, so every line is one of these or it fails.
function allowed(text, number) {
  if (number === 1 && text.startsWith('#!')) return text === '#!/usr/bin/env bash';
  if (text === '' || text.startsWith('#')) return true;
  if (text === 'set -euo pipefail' || text === REPO_LINE) return true;
  const words = text.split(/[ \t]+/);
  if (words[0] === 'mkdir') return words[1] === '-p' && words.length > 2 && words.slice(2).every(inside);
  if (words[0] !== 'cp') return false;
  const args = words[1] === '-R' ? words.slice(2) : words.slice(1);
  const source = args.length === 2 && args[0].match(SAMPLE);
  return Boolean(source) && inside(source[1]) && inside(args[1]);
}

function scan(file) {
  const hits = [];
  readFileSync(file, 'utf8').split('\n').forEach((raw, i) => {
    // Only ASCII blanks come off: bash doesn't treat a no-break space as one, so neither does this.
    const text = raw.replace(/^[ \t]+|[ \t\r]+$/g, '');
    if (!allowed(text, i + 1)) hits.push({ line: i + 1, text });
  });
  return hits;
}

// One plain form names a scaffold; anything else that says scaffold fails rather than going unscanned.
const NAMED = /^ *scaffold_script:[ \t]+([A-Za-z0-9._-]+)(?:[ \t]+#.*)?[ \t]*\r?$/;
// YAML decodes escapes in double quotes, so a key can spell scaffold_script without the letters on the line.
const ESCAPED = /"[^"]*\\/;

function scaffoldNames(source) {
  const scripts = [];
  const odd = [];
  source.split('\n').forEach((text, i) => {
    const m = text.match(NAMED);
    if (m) scripts.push(m[1]);
    else if (/scaffold/i.test(text) || ESCAPED.test(text)) odd.push(i + 1);
  });
  return { scripts, odd };
}

// case.yaml is where the spec puts it; a prompt.md's frontmatter gets read too so nothing slips past.
function scaffolds() {
  const found = [];
  const odd = [];
  for (const entry of readdirSync(evals, { recursive: true })) {
    const path = String(entry);
    if (path.split(sep)[0] === 'results') continue;
    const name = path.split(sep).pop();
    if (name !== 'case.yaml' && name !== 'prompt.md') continue;
    const names = scaffoldNames(readFileSync(join(evals, path), 'utf8'));
    for (const script of names.scripts) found.push({ caseDir: dirname(join(evals, path)), script });
    for (const line of names.odd) odd.push(`evals/${path.split(sep).join('/')}:${line}: a scaffold or an escape in a form this test can't read`);
  }
  return { found, odd };
}

test('every scaffold a case names sits in its case folder and only copies fixtures from samples/', () => {
  const { found, odd } = scaffolds();
  const problems = [...odd];
  for (const { caseDir, script } of found) {
    const file = resolve(caseDir, script);
    const shown = relative(root, file);
    if (dirname(file) !== caseDir) {
      problems.push(`${shown}: not in its case folder ${relative(root, caseDir)}`);
      continue;
    }
    if (!existsSync(file)) {
      problems.push(`${shown}: named by the case but missing`);
      continue;
    }
    for (const hit of scan(file)) problems.push(`${shown}:${hit.line}: not an allowed line (${hit.text})`);
  }
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  assert.ok(found.length >= 2, `expected the design-folder and existing-brief scaffolds, found ${found.length}`);
});

// The runner reads a missing min as 1, so a lone max: 0 asks for one call and allows none.
test('every tool_used grader that states a max also states its min', () => {
  const unbounded = [];
  for (const entry of readdirSync(evals, { recursive: true })) {
    const path = String(entry);
    if (path.split(sep)[0] === 'results' || !path.endsWith('.md')) continue;
    const head = readFileSync(join(evals, path), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!head || !/^type:[ \t]*(["']?)tool_used\1[ \t\r]*$/m.test(head[1])) continue;
    if (/^max[ \t]*:/m.test(head[1]) && !/^min[ \t]*:/m.test(head[1])) unbounded.push(`evals/${path.split(sep).join('/')}`);
  }
  assert.deepEqual(unbounded, [], `\na max: with no min: reads as expected 1..max and can't pass:\n${unbounded.join('\n')}`);
});

// The case.yaml keys whose value is text; allowed_tools: [...] is a flow list on purpose and never reaches this.
const STRING_KEY = /^ *(schema_version|name|description|history_file|scaffold_script):[ \t]+(.*?)[ \t\r]*$/;
// A plain value can't start with any of these and still be read as the text it looks like.
const INDICATOR = /^[-?:,[\]{}#&*!|>%@`]/;

function plainStringProblems(source) {
  const problems = [];
  source.split('\n').forEach((text, i) => {
    const m = text.match(STRING_KEY);
    if (!m || m[2] === '' || m[2][0] === '"' || m[2][0] === "'") return;
    const [, key, value] = m;
    let why = null;
    if (INDICATOR.test(value)) why = `starts with ${value[0]}`;
    else if (/:(?:[ \t]|$)/.test(value)) why = 'holds ": "';
    else if (/[ \t]#/.test(value)) why = 'holds " #"';
    if (why) problems.push({ line: i + 1, key, why });
  });
  return problems;
}

// 900d872's class: an unquoted "word for word: the" in a description stopped the eval loading the case.
test('every case.yaml string key\'s unquoted value has no ": ", no " #" and no leading YAML indicator (a line check, not a YAML parse)', () => {
  const problems = [];
  let files = 0;
  for (const entry of readdirSync(evals, { recursive: true })) {
    const path = String(entry);
    if (path.split(sep)[0] === 'results' || path.split(sep).pop() !== 'case.yaml') continue;
    files += 1;
    for (const p of plainStringProblems(readFileSync(join(evals, path), 'utf8'))) {
      problems.push(`evals/${path.split(sep).join('/')}:${p.line}: ${p.key}'s unquoted value ${p.why}, so YAML won't read it as written; quote it`);
    }
  }
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  assert.ok(files > 0, 'found no case.yaml under evals/');
});

test('the string-key line check flags ": ", " #" and a leading indicator, and leaves quoted values and flow lists alone', () => {
  const flagged = [
    ['description: each quoted word for word: the trust answer\n', 'holds ": "'],
    ['description: ends on a colon:\n', 'holds ": "'],
    ['description: the fix # not a comment\n', 'holds " #"'],
    ['name: [resume-later]\n', 'starts with ['],
    ['description: *anchor\n', 'starts with *'],
    ['context:\n  history_file: a: b.jsonl\n', 'holds ": "'],
  ];
  for (const [source, why] of flagged) {
    assert.equal(plainStringProblems(source).length, 1, JSON.stringify(source));
    assert.equal(plainStringProblems(source)[0].why, why, JSON.stringify(source));
  }
  assert.equal(plainStringProblems('context:\n  history_file: a: b.jsonl\n')[0].line, 2);
  const clean = [
    'description: "word for word: the trust answer # and more"\n',
    "description: 'word for word: the trust answer'\n",
    'schema_version: "1.1"\n',
    'name: resume-later\n',
    'description: A bare /seldon, at 10:30 for issue#1, with a URL like https://example.com\n',
    'execution:\n  allowed_tools: [Skill, Read, Glob, Grep]\n  disallowed_tools: [Agent]\n',
  ];
  for (const source of clean) assert.deepEqual(plainStringProblems(source), [], JSON.stringify(source));
});

test('every allowed form passes', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'seldon-scaffold-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = join(dir, 'seed.sh');
  writeFileSync(
    file,
    [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      '',
      '# a comment can say anything, even curl or rm, because bash never runs it',
      REPO_LINE,
      'mkdir -p docs/design',
      'mkdir -p docs/design .planning/seldon',
      'cp -R "$repo/samples/design/." docs/design/',
      'cp "$repo/samples/brief.md" .planning/seldon/brief.md',
      '  cp "$repo/samples/brief.md" .  ',
      '',
    ].join('\n'),
  );
  assert.deepEqual(scan(file), []);
});

test('any other line fails, named by its line', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'seldon-scaffold-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const planted = [
    // What the old denylist let through.
    'node -e "fetch(\'https://example.com\')"',
    'python3 -c \'import urllib.request\'',
    'find . -delete',
    'rmdir docs',
    'unlink x',
    'cp x "$repo/README.md"',
    'cp /dev/null "$repo/lib/check.mjs"',
    'bash "$repo/evals/helper.sh"',
    './helper.sh',
    // What it caught, still caught.
    'curl https://example.com',
    'git clone https://example.com/repo',
    'rm -rf docs',
    'mv docs elsewhere',
    'cat "$HOME/.ssh/id_rsa"',
    // The allowed commands, aimed somewhere they shouldn't go.
    'mkdir -p /etc/x',
    'mkdir -p ../x',
    'mkdir -p docs/../../x',
    'mkdir -p ~/x',
    'mkdir -p "$HOME/x"',
    'mkdir docs',
    'mkdir -p',
    'cp "$repo/samples/../README.md" x',
    'cp "$repo/samples/brief.md" ../x',
    'cp "$repo/samples/brief.md" /tmp/x',
    'cp "$repo/samples/brief.md" "$TMPDIR/x"',
    'cp "$repo/samples/brief.md" x y',
    'cp -a "$repo/samples/brief.md" x',
    'cp ~/.aws/credentials .',
    'cp "$repo/samples/brief.md" x; rm -rf y',
    'mkdir -p x && curl https://example.com',
    'mkdir -p x \\',
    'mkdir -p $(curl https://example.com)',
    'repo="$HOME"',
    'set +e',
    'cd ..',
  ];
  for (const line of planted) {
    const file = join(dir, 'seed.sh');
    writeFileSync(file, `#!/usr/bin/env bash\nset -euo pipefail\n${line}\n`);
    assert.deepEqual(scan(file), [{ line: 3, text: line }], `"${line}" should fail on line 3`);
  }
  writeFileSync(join(dir, 'seed.sh'), '#!/usr/bin/env node\n');
  assert.deepEqual(scan(join(dir, 'seed.sh')), [{ line: 1, text: '#!/usr/bin/env node' }]);
});

test('a case names its scaffold only as scaffold_script: <name>, and any other form is flagged, not skipped', () => {
  assert.deepEqual(scaffoldNames('context:\n  scaffold_script: seed.sh\n'), { scripts: ['seed.sh'], odd: [] });
  assert.deepEqual(scaffoldNames('context:\n  scaffold_script: seed.sh  # copies samples/\n'), { scripts: ['seed.sh'], odd: [] });
  const flagged = [
    'context: { scaffold_script: evil.sh }\n',
    'context:\n  "scaffold_script": evil.sh\n',
    'context:\n  Scaffold_Script: evil.sh\n',
    // A YAML parser reads each of these as a name other than seed.sh.
    'context:\n  scaffold_script: seed.sh#x\n',
    'context:\n  scaffold_script: seed.sh x.sh\n',
    'context:\n  scaffold_script: "seed.sh\'x"\n',
    // Each of these decodes to scaffold_script.
    'context:\n  "scaffold\\x5fscript": evil.sh\n',
    'context:\n  "scaffold_\\\n  script": evil.sh\n',
    'context:\n  "\\x73caffold_script": evil.sh\n',
  ];
  for (const source of flagged) {
    const line = source.startsWith('context: {') ? 1 : 2;
    assert.deepEqual(scaffoldNames(source), { scripts: [], odd: [line] }, JSON.stringify(source));
  }
});
