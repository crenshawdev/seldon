import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const evals = join(root, 'evals');

// A scaffold runs as you, outside the sandbox, so it gets to copy from samples/ and that's it.
const FORBIDDEN = [
  ['network', /\b(?:curl|wget|nc|ncat|netcat|ssh|scp|sftp|rsync|ftp|telnet)\b|\/dev\/(?:tcp|udp)\b/],
  ['git', /\bgit\b/],
  // Anywhere, not just outside the run dir: a grep can't tell the two apart and copying needs neither.
  ['rm or mv', /\b(?:rm|mv)\b/],
  ['home', /\$\{?HOME\b|(?:^|[\s"'=:(])~/],
];

// Every line, comments included - a commented-out curl is one edit from running.
function scan(file) {
  const hits = [];
  readFileSync(file, 'utf8').split('\n').forEach((text, i) => {
    for (const [group, pattern] of FORBIDDEN) {
      const m = text.match(pattern);
      if (m) hits.push({ line: i + 1, group, match: m[0].trim() });
    }
  });
  return hits;
}

// case.yaml is where the spec puts it; a prompt.md's frontmatter gets read too so nothing slips past.
function scaffolds() {
  const found = [];
  for (const entry of readdirSync(evals, { recursive: true })) {
    const path = String(entry);
    if (path.split(sep)[0] === 'results') continue;
    const name = path.split(sep).pop();
    if (name !== 'case.yaml' && name !== 'prompt.md') continue;
    const m = readFileSync(join(evals, path), 'utf8').match(/^\s*scaffold_script:\s*["']?([^"'#\s]+)/m);
    if (m) found.push({ caseDir: dirname(join(evals, path)), script: m[1] });
  }
  return found;
}

test('every scaffold a case names sits in its case folder and only copies', () => {
  const problems = [];
  for (const { caseDir, script } of scaffolds()) {
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
    for (const hit of scan(file)) problems.push(`${shown}:${hit.line}: ${hit.group} (${hit.match})`);
  }
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});

test('the scan catches one planted line from every forbidden group', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'seldon-scaffold-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const planted = [
    ['curl https://example.com', 'network'],
    ['wget -q https://example.com/x', 'network'],
    ['nc example.com 80', 'network'],
    ['ncat example.com 80', 'network'],
    ['netcat example.com 80', 'network'],
    ['ssh host true', 'network'],
    ['scp a host:b', 'network'],
    ['sftp host', 'network'],
    ['rsync -a a host:b', 'network'],
    ['ftp host', 'network'],
    ['telnet host 23', 'network'],
    ['exec 3<>/dev/tcp/example.com/80', 'network'],
    ['echo hi > /dev/udp/example.com/53', 'network'],
    ['git clone https://example.com/repo', 'git'],
    ['rm -rf docs', 'rm or mv'],
    ['mv docs elsewhere', 'rm or mv'],
    ['# rm -rf / is commented out but still caught', 'rm or mv'],
    ['cat "$HOME/.ssh/id_rsa"', 'home'],
    ['cp "${HOME}/.netrc" .', 'home'],
    ['cp ~/.aws/credentials .', 'home'],
  ];
  for (const [i, [line, group]] of planted.entries()) {
    const file = join(dir, `plant-${i}.sh`);
    writeFileSync(file, `#!/usr/bin/env bash\nset -euo pipefail\n${line}\n`);
    const hits = scan(file);
    assert.ok(
      hits.some((h) => h.line === 3 && h.group === group),
      `"${line}" should be caught as ${group}, got ${JSON.stringify(hits)}`,
    );
  }
});

test('a copy-only script reports nothing', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'seldon-scaffold-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = join(dir, 'seed.sh');
  writeFileSync(
    file,
    [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      '# copy the fixture into the run workspace, nothing more',
      'repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"',
      'mkdir -p docs/design .planning/seldon',
      'cp -R "$repo/samples/design/." docs/design/',
      'cp "$repo/samples/brief.md" .planning/seldon/brief.md',
      '',
    ].join('\n'),
  );
  assert.deepEqual(scan(file), []);
});
