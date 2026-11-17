import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BRIEF_OK_LINE, checkDir, OK_LINE, PRD_OK_LINE } from '../lib/check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const samples = join(root, 'samples');
const script = join(root, 'lib', 'check.mjs');

const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

function temp(t) {
  const dir = mkdtempSync(join(tmpdir(), 'seldon-check-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

// Every broken case starts from a set known to pass, so nothing broken is committed.
function copy(t) {
  const dir = temp(t);
  cpSync(samples, dir, { recursive: true });
  return dir;
}

// One sample file and nothing else, like the folder a single step leaves behind.
function only(t, file) {
  const dir = temp(t);
  cpSync(join(samples, file), join(dir, file));
  return dir;
}

function edit(dir, file, change) {
  const path = join(dir, file);
  const before = readFileSync(path, 'utf8');
  const after = change(before);
  assert.notEqual(after, before, `the edit to ${file} changed nothing`);
  writeFileSync(path, after);
}

// Applies a change to one epic's section only.
const inEpic = (id, change) => (text) => {
  const at = text.indexOf(`## ${id}:`);
  const end = text.indexOf('\n## ', at + 1);
  const stop = end === -1 ? text.length : end;
  return text.slice(0, at) + change(text.slice(at, stop)) + text.slice(stop);
};

test('the samples conform, and the script says so with exit 0', () => {
  assert.deepEqual(checkDir(samples), []);
  const r = run(samples);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), OK_LINE);
});

for (const label of ['Outcome', 'Boundaries', 'Done when', 'Depends on', 'Requirements', 'Spine decisions']) {
  test(`an epic missing ${label} fails, naming the field and the epic`, (t) => {
    const dir = copy(t);
    edit(dir, 'epics.md', inEpic('E-02', (s) => s.replace(new RegExp(`^\\*\\*${label}:\\*\\*.*\\n`, 'm'), '')));
    assert.deepEqual(checkDir(dir), [`epics.md: E-02: ${label}: missing field`]);
  });
}

test('a missing field exits 1 and prints the field and the epic', (t) => {
  const dir = copy(t);
  edit(dir, 'epics.md', inEpic('E-02', (s) => s.replace(/^\*\*Done when:\*\*.*\n/m, '')));
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /E-02/);
  assert.match(r.stdout, /Done when/);
});

const cases = [
  ['a missing file', (dir) => rmSync(join(dir, 'brief.md')), ['brief.md: missing file']],
  ['an unreadable file', (dir) => {
    rmSync(join(dir, 'spine.md'));
    mkdirSync(join(dir, 'spine.md'));
  }, ['spine.md: cannot read (EISDIR)']],
  ['a missing brief section', (dir) => edit(dir, 'brief.md', (s) => s.replace(/## Vision\n[^#]*/, '')), ['brief.md: Vision: missing section']],
  ['a missing refusals section', (dir) => edit(dir, 'brief.md', (s) => s.replace(/## What it refuses\n[^#]*/, '')),
    ['brief.md: What it refuses: missing section']],
  ['a missing PRD section', (dir) => edit(dir, 'prd.md', (s) => s.replace(/## Non-goals\n[^#]*/, '')), ['prd.md: Non-goals: missing section']],
  ['an empty section', (dir) => edit(dir, 'brief.md', (s) => s.replace(/(## Scope\n)[^#]*/, '$1\n')), ['brief.md: Scope: empty section']],
  ['a section the format does not name', (dir) => edit(dir, 'brief.md', (s) => `${s}\n## Notes\nmore\n`), ['brief.md: "## Notes": not a section of brief.md']],
  ['a repeated section', (dir) => edit(dir, 'brief.md', (s) => `${s}\n## Vision\nagain\n`), ['brief.md: Vision: section appears more than once']],
  ['sections out of order', (dir) => edit(dir, 'brief.md', (s) => s.replace(/(## Problem\n[^#]*)(## Solution\n[^#]*)/, '$2$1')),
    ["brief.md: sections: out of order, expected Problem, Solution, Who it serves, What's different, Success criteria, Scope, What it refuses, Vision"]],
  ['a heading with trailing whitespace', (dir) => edit(dir, 'brief.md', (s) => s.replace('## Vision\n', '## Vision \t\n')),
    ['brief.md: "## Vision \\t": not a section of brief.md', 'brief.md: Vision: missing section']],
  ['a missing title', (dir) => edit(dir, 'spine.md', (s) => s.replace(/^# .*\n/, '')), ['spine.md: title: first line is not a "# " title']],
  ['a PRD bullet whose bold span is not an ID', (dir) => edit(dir, 'prd.md', (s) => s.replace('- **CAT-02**:', '- **CAT-02:**')),
    ['prd.md: Requirements: "- **CAT-02:** A member searches the catalog by name or category." is not a "- **CAT-01**: text" requirement']],
  ['a requirement before the first category', (dir) => edit(dir, 'prd.md', (s) => s.replace('### Catalog\n', '')),
    ['prd.md: CAT-01: Requirements: requirement comes before the first ### category', 'prd.md: CAT-02: Requirements: requirement comes before the first ### category']],
  ['a repeated requirement ID', (dir) => edit(dir, 'prd.md', (s) => s.replace('**NFR-02**', '**NFR-01**')),
    ['prd.md: NFR-01: Non-functional requirements: ID appears more than once']],
  ['a one-digit spine heading', (dir) => edit(dir, 'spine.md', (s) => s.replace('## S-02:', '## S-2:')),
    ['spine.md: "## S-2: One server-rendered web app": not a "## S-01: decision" heading']],
  ['a repeated spine ID', (dir) => edit(dir, 'spine.md', (s) => s.replace('## S-03:', '## S-02:')), ['spine.md: S-02: heading: ID appears more than once']],
  ['an empty decision', (dir) => edit(dir, 'spine.md', (s) => s.replace(/(## S-03: .*\n)[^#]*$/, '$1')), ['spine.md: S-03: decision: empty section']],
  ['a spine with no decisions', (dir) => writeFileSync(join(dir, 'spine.md'), '# Toolshed - architecture spine\n'), ['spine.md: no decisions']],
  ['a one-digit epic heading', (dir) => edit(dir, 'epics.md', (s) => s.replace('## E-03:', '## E-3:')),
    ['epics.md: "## E-3: Reminders": not a "## E-01: name" heading']],
  ['a bad ID in an epic field', (dir) => edit(dir, 'epics.md', inEpic('E-03', (s) => s.replace('**Requirements:** LOAN-03', '**Requirements:** loan-3'))),
    ['epics.md: E-03: Requirements: "loan-3" is not a requirement ID']],
  ['an empty epic field', (dir) => edit(dir, 'epics.md', inEpic('E-01', (s) => s.replace('**Depends on:** None', '**Depends on:**'))),
    ['epics.md: E-01: Depends on: empty field']],
  ['a repeated epic field', (dir) => edit(dir, 'epics.md', inEpic('E-03', (s) => `${s}**Outcome:** again\n`)),
    ['epics.md: E-03: Outcome: field appears more than once']],
  ['epic fields out of order', (dir) => edit(dir, 'epics.md', inEpic('E-03', (s) => s.replace(/(\*\*Outcome:\*\*.*\n)(\*\*Boundaries:\*\*.*\n)/, '$2$1'))),
    ['epics.md: E-03: fields: out of order, expected Outcome, Boundaries, Done when, Depends on, Requirements, Spine decisions']],
  ['text before the Outcome line', (dir) => edit(dir, 'epics.md', inEpic('E-01', (s) => s.replace('**Outcome:**', 'Intro.\nMore intro.\n**Outcome:**'))),
    ['epics.md: E-01: Outcome: text before the **Outcome:** line']],
  // FORMAT.md keeps the tag off every heading line, ID headings included.
  ['a tagged spine heading', (dir) => edit(dir, 'spine.md', (s) => s.replace(/^(## S-01: .*)$/m, '$1 [ASSUMPTION]')),
    ['spine.md: "## S-01: Loans are an append-only event log [ASSUMPTION]": not a "## S-01: decision" heading']],
  ['a tagged epic heading', (dir) => edit(dir, 'epics.md', (s) => s.replace('## E-01: Catalog', '## E-01: Catalog [ASSUMPTION]')),
    ['epics.md: "## E-01: Catalog [ASSUMPTION]": not a "## E-01: name" heading']],
  // A tag with nothing to mark is no content.
  ['a section holding only the tag', (dir) => edit(dir, 'brief.md', (s) => s.replace(/(## Scope\n)[^#]*/, '$1[ASSUMPTION]\n\n')),
    ['brief.md: Scope: empty section']],
  ['an epic field holding only the tag', (dir) => edit(dir, 'epics.md', inEpic('E-01', (s) => s.replace(/^\*\*Outcome:\*\*.*$/m, '**Outcome:** [ASSUMPTION]'))),
    ['epics.md: E-01: Outcome: empty field']],
];

for (const [name, breakIt, expected] of cases) {
  test(`${name} fails, naming what is wrong`, (t) => {
    const dir = copy(t);
    breakIt(dir);
    assert.deepEqual(checkDir(dir), expected);
  });
}

test('a missing or non-directory argument exits 2', () => {
  const none = run();
  assert.equal(none.status, 2);
  assert.match(none.stderr, /usage: node lib\/check\.mjs \[--brief \| --prd\] <dir>/);
  const file = run(join(samples, 'brief.md'));
  assert.equal(file.status, 2);
  assert.match(file.stderr, /is not a directory/);
});

test('--brief on the samples exits 0 with the brief line', () => {
  const r = run('--brief', samples);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), BRIEF_OK_LINE);
});

test('--brief passes a folder holding only the brief', (t) => {
  const r = run('--brief', only(t, 'brief.md'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), BRIEF_OK_LINE);
});

test('--brief on a brief missing a section exits 1, naming only that section', (t) => {
  const dir = only(t, 'brief.md');
  edit(dir, 'brief.md', (s) => s.replace(/## Vision\n[^#]*/, ''));
  const r = run('--brief', dir);
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'brief.md: Vision: missing section');
});

test('--brief on a folder with no brief exits 1 with a missing file', (t) => {
  const r = run('--brief', temp(t));
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'brief.md: missing file');
});

test('the full check still wants all four files when only the brief is there', (t) => {
  const r = run(only(t, 'brief.md'));
  assert.equal(r.status, 1);
  assert.deepEqual(r.stdout.trim().split('\n'), ['prd.md: missing file', 'spine.md: missing file', 'epics.md: missing file']);
});

test('--brief with no directory exits 2', () => {
  const r = run('--brief');
  assert.equal(r.status, 2);
  assert.match(r.stderr, /usage:/);
});

test('--prd on the samples exits 0 with the PRD line', () => {
  const r = run('--prd', samples);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), PRD_OK_LINE);
});

test('--prd passes a folder holding only the PRD', (t) => {
  const r = run('--prd', only(t, 'prd.md'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), PRD_OK_LINE);
});

test('--prd on a PRD missing a section exits 1, naming only that section', (t) => {
  const dir = only(t, 'prd.md');
  edit(dir, 'prd.md', (s) => s.replace(/## Non-goals\n[^#]*/, ''));
  const r = run('--prd', dir);
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'prd.md: Non-goals: missing section');
});

test('--prd on a folder with no PRD exits 1 with a missing file', (t) => {
  const r = run('--prd', temp(t));
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'prd.md: missing file');
});

test('--prd with no directory exits 2', () => {
  const r = run('--prd');
  assert.equal(r.status, 2);
  assert.match(r.stderr, /usage:/);
});
