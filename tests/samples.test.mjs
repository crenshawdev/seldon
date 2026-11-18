import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STALE_OK_LINE } from '../lib/check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const samples = join(root, 'samples');
const script = join(root, 'lib', 'check.mjs');

const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
const staleLines = (stdout) => stdout.split('\n').filter((l) => l.startsWith('stale: '));

const PARENT = { 'prd.md': 'brief.md', 'spine.md': 'prd.md', 'epics.md': 'spine.md' };
// These two folders borrow their parent from another sample folder, the way their seeds do.
const ELSEWHERE = { 'epics-rerun/spine.md': 'spine-rerun/prd.md', 'epics-no-boundary/spine.md': 'epics-split/prd.md' };
const STAMP = /^Built from: \S+ sha256:([0-9a-f]{16})$/m;

const hashOf = (file) => createHash('sha256').update(readFileSync(join(samples, file))).digest('hex').slice(0, 16);

function stampProblems() {
  const problems = [];
  for (const entry of readdirSync(samples, { recursive: true })) {
    const file = String(entry).split(sep).join('/');
    if (!Object.hasOwn(PARENT, basename(file))) continue;
    const stamp = STAMP.exec(readFileSync(join(samples, file), 'utf8'));
    if (!stamp) {
      problems.push(`samples/${file}: no Built from: stamp`);
      continue;
    }
    const sibling = join(dirname(file), PARENT[basename(file)]).split(sep).join('/');
    const parent = existsSync(join(samples, sibling)) ? sibling : ELSEWHERE[file];
    if (!parent) problems.push(`samples/${file}: stamped, but no parent found`);
    else if (stamp[1] !== hashOf(parent)) problems.push(`samples/${file}: stamp ${stamp[1]} is not the hash of samples/${parent} (${hashOf(parent)})`);
  }
  return problems;
}

test("every sample PRD, spine and epics is stamped with its parent's current hash", () => {
  const problems = stampProblems();
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});

test('--stale on the samples exits 0 with no stale link', () => {
  const r = run('--stale', samples);
  assert.equal(r.status, 0, r.stdout);
  assert.equal(r.stdout.split('\n')[0], STALE_OK_LINE);
  assert.deepEqual(staleLines(r.stdout), []);
});

const CP = /^cp "\$repo\/samples\/([^"]+)" \.planning\/seldon\/([^/\s]+)$/;

// Follow the case's own seed, so a seed change can't leave this test reading the old story.
function seeded(t, name) {
  const dir = mkdtempSync(join(tmpdir(), `seldon-${name}-`));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const line of readFileSync(join(root, 'evals', name, 'seed.sh'), 'utf8').split('\n')) {
    const m = CP.exec(line.trim());
    if (m) copyFileSync(join(samples, m[1]), join(dir, m[2]));
  }
  return dir;
}

for (const [name, line] of [
  ['prd-rerun', 'stale: prd.md was built from an earlier brief.md'],
  ['spine-rerun', 'stale: spine.md was built from an earlier prd.md'],
  ['epics-rerun', 'stale: epics.md was built from an earlier spine.md'],
]) {
  test(`the ${name} seed reads stale at its own link and no other`, (t) => {
    const r = run('--stale', seeded(t, name));
    assert.equal(r.status, 1, r.stdout);
    assert.deepEqual(staleLines(r.stdout), [line]);
  });
}
