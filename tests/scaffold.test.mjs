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

// Any scaffold_script the block-style match can't read is an odd form, and an odd form fails rather than going unscanned.
function scaffoldNames(source) {
  const scripts = [];
  const odd = [];
  source.split('\n').forEach((text, i) => {
    if (!text.includes('scaffold_script')) return;
    const m = text.match(/^\s*scaffold_script:\s*["']?([^"'#\s]+)/);
    if (m) scripts.push(m[1]);
    else odd.push(i + 1);
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
    for (const line of names.odd) odd.push(`evals/${path.split(sep).join('/')}:${line}: scaffold_script in a form this test can't read`);
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

test('a scaffold_script the block-style match misses is flagged, not skipped', () => {
  assert.deepEqual(scaffoldNames('context:\n  scaffold_script: seed.sh\n'), { scripts: ['seed.sh'], odd: [] });
  assert.deepEqual(scaffoldNames('context: { scaffold_script: evil.sh }\n'), { scripts: [], odd: [1] });
  assert.deepEqual(scaffoldNames('context:\n  "scaffold_script": evil.sh\n'), { scripts: [], odd: [2] });
});
