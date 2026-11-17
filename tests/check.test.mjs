import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BRIEF_OK_LINE, checkDir, EPICS_OK_LINE, OK_LINE, PRD_OK_LINE, SPINE_OK_LINE } from '../lib/check.mjs';

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

// Requirements keeps its ### lines and gains one prose line, but loses every bullet and anything indented under one.
const proseRequirements = (s) => s.replace(/(## Requirements\n)([^]*?)(?=## Non-functional)/,
  (_, head, body) => `${head}Volunteers run the counter.\n${body.replace(/^(- |  ).*\n/gm, '')}`);

const INTEGRATED = '- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.\n';

// The epic limits, as edits to the epics file alone, so the full check and --epics can share them.
const epicLimits = {
  sixIds: [inEpic('E-02', (s) => s.replace('NFR-01, NFR-02\n', 'NFR-01, NFR-02, CAT-01, CAT-02\n')),
    'epics.md: E-02: Requirements: 6 IDs, expected at most 5'],
  oneItem: [inEpic('E-03', (s) => s.replace(INTEGRATED, '')), 'epics.md: E-03: Done when: 1 item, expected 2 to 5'],
  sixItems: [inEpic('E-02', (s) => s.replace('**Done when:**\n', '**Done when:**\n- A volunteer sees every open loan.\n- A member sees their own loans.\n')),
    'epics.md: E-02: Done when: 6 items, expected 2 to 5'],
  laterEpic: [inEpic('E-01', (s) => s.replace('**Depends on:** None', '**Depends on:** E-02')),
    'epics.md: E-01: Depends on: "E-02" is not an epic earlier in the file'],
};

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
  ['an empty decision', (dir) => edit(dir, 'spine.md', (s) => s.replace(/(## S-03: .*\n)[^#]*/, '$1')), ['spine.md: S-03: decision: empty section']],
  ['a spine with no decisions', (dir) => writeFileSync(join(dir, 'spine.md'), '# Toolshed - architecture spine\n'), ['spine.md: no decisions']],
  ['a decision with no Kind line', (dir) => edit(dir, 'spine.md', (s) => s.replace('Kind: how state changes\n', '')), ['spine.md: S-01: Kind: missing line']],
  ['a kind outside the six', (dir) => edit(dir, 'spine.md', (s) => s.replace('Kind: stack\n', 'Kind: security\n')),
    ['spine.md: S-04: Kind: "security" is not one of the six kinds']],
  ['a second Kind line', (dir) => edit(dir, 'spine.md', (s) => s.replace('Kind: design approach\n', 'Kind: design approach\nKind: stack\n')),
    ['spine.md: S-02: Kind: line appears more than once']],
  // The Kind line isn't the decision, so a body of only that line gets the empty line and no Kind line.
  ['a decision whose body is only its Kind line', (dir) => edit(dir, 'spine.md', (s) => s.replace(/(## S-05: .*\nKind: hosting\n)[^#]*/, '$1\n')),
    ['spine.md: S-05: decision: empty section']],
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
  // Prose is not a requirement: each requirement section needs one ID'd bullet.
  ['a Requirements section with only prose', (dir) => edit(dir, 'prd.md', proseRequirements), ['prd.md: Requirements: no "- **CAT-01**: text" requirement']],
  ['a Non-functional requirements section with only prose',
    (dir) => edit(dir, 'prd.md', (s) => s.replace(/(## Non-functional requirements\n)[^#]*/, '$1Checkouts stay quick on a phone.\n\n')),
    ['prd.md: Non-functional requirements: no "- **CAT-01**: text" requirement']],
  ['a requirement section whose only bullet is malformed',
    (dir) => edit(dir, 'prd.md', (s) => s.replace(/(## Non-functional requirements\n)[^#]*/, '$1- NFR-01: Checkouts stay quick.\n\n')),
    ['prd.md: Non-functional requirements: "- NFR-01: Checkouts stay quick." is not a "- **CAT-01**: text" requirement',
      'prd.md: Non-functional requirements: no "- **CAT-01**: text" requirement']],
  ['an epic field holding only the tag', (dir) => edit(dir, 'epics.md', inEpic('E-01', (s) => s.replace(/^\*\*Outcome:\*\*.*$/m, '**Outcome:** [ASSUMPTION]'))),
    ['epics.md: E-01: Outcome: empty field']],
  ['an epic with 6 requirement IDs', (dir) => edit(dir, 'epics.md', epicLimits.sixIds[0]), [epicLimits.sixIds[1]]],
  ['an epic with 1 done-when item', (dir) => edit(dir, 'epics.md', epicLimits.oneItem[0]), [epicLimits.oneItem[1]]],
  ['an epic with 6 done-when items', (dir) => edit(dir, 'epics.md', epicLimits.sixItems[0]), [epicLimits.sixItems[1]]],
  // The one-line form: label-line text is no item, so this done-when has none.
  ['a done-when only on its label line', (dir) => edit(dir, 'epics.md', inEpic('E-03', (s) => s.replace(/\*\*Done when:\*\*\n- (.*)\n- .*\n/, '**Done when:** $1\n'))),
    ['epics.md: E-03: Done when: 0 items, expected 2 to 5']],
  ['an epic depending on a later one', (dir) => edit(dir, 'epics.md', epicLimits.laterEpic[0]), [epicLimits.laterEpic[1]]],
  ['an epic depending on an ID no epic has', (dir) => edit(dir, 'epics.md', inEpic('E-02', (s) => s.replace('**Depends on:** E-01', '**Depends on:** E-09'))),
    ['epics.md: E-02: Depends on: "E-09" is not an epic earlier in the file']],
];

for (const [name, breakIt, expected] of cases) {
  test(`${name} fails, naming what is wrong`, (t) => {
    const dir = copy(t);
    breakIt(dir);
    assert.deepEqual(checkDir(dir), expected);
  });
}

// FORMAT.md promises Cadence's reader this line, so the bullet reader has to keep calling it prose.
test('a Retired line under Requirements passes the full check and --prd', (t) => {
  const dir = copy(t);
  edit(dir, 'prd.md', (s) => s.replace('## Requirements\n', '## Requirements\nRetired: CAT-03, LOAN-04\n'));
  assert.deepEqual(checkDir(dir), []);
  const r = run('--prd', dir);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), PRD_OK_LINE);
});

// The spine's Retired line sits above the first decision, where no rule reads.
test('a Retired line under the spine title passes the full check and --spine', (t) => {
  const dir = copy(t);
  edit(dir, 'spine.md', (s) => s.replace(/^(# .*\n)/, '$1\nRetired: S-07, S-08\n'));
  assert.deepEqual(checkDir(dir), []);
  const r = run('--spine', dir);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), SPINE_OK_LINE);
});

// A split-off epic takes the next unused number wherever it sits, so position decides, not the number.
test('an epic may depend on a higher-numbered epic placed before it', (t) => {
  const dir = copy(t);
  const e04 = `## E-04: Categories\n**Outcome:** Volunteers group tools into categories.\n**Boundaries:** Categories only.\n**Done when:**\n`
    + `- A volunteer can add a category.\n${INTEGRATED}**Depends on:** E-01\n**Requirements:** CAT-02\n**Spine decisions:** S-02, S-04, S-05\n\n`;
  edit(dir, 'epics.md', (s) => s.replace('## E-02: Lending', `${e04}## E-02: Lending`).replace('**Depends on:** E-01\n**Requirements:** LOAN-01', '**Depends on:** E-04\n**Requirements:** LOAN-01'));
  assert.deepEqual(checkDir(dir), []);
});

// The epics' Retired line sits above the first epic too; after the last one it would join that epic's last field.
test('a Retired line under the epics title passes the full check and --epics', (t) => {
  const dir = copy(t);
  edit(dir, 'epics.md', (s) => s.replace(/^(# .*\n)/, '$1\nRetired: E-07, E-08\n'));
  assert.deepEqual(checkDir(dir), []);
  const r = run('--epics', dir);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), EPICS_OK_LINE);
});

test('a missing or non-directory argument exits 2', () => {
  const none = run();
  assert.equal(none.status, 2);
  assert.match(none.stderr, /usage: node lib\/check\.mjs \[--brief \| --prd \| --spine \| --epics\] <dir>/);
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

test('--prd on a PRD whose Requirements hold only prose exits 1, naming Requirements', (t) => {
  const dir = only(t, 'prd.md');
  edit(dir, 'prd.md', proseRequirements);
  const r = run('--prd', dir);
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'prd.md: Requirements: no "- **CAT-01**: text" requirement');
});

test('--spine on the samples exits 0 with the spine line', () => {
  const r = run('--spine', samples);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), SPINE_OK_LINE);
});

test('--spine passes a folder holding only the spine', (t) => {
  const r = run('--spine', only(t, 'spine.md'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), SPINE_OK_LINE);
});

// The three faults the spine step has to catch before the epics exist.
for (const [name, change, expected] of [
  ['no Kind line', (s) => s.replace('Kind: how state changes\n', ''), 'spine.md: S-01: Kind: missing line'],
  ['a kind outside the six', (s) => s.replace('Kind: stack\n', 'Kind: security\n'), 'spine.md: S-04: Kind: "security" is not one of the six kinds'],
  ['an empty body', (s) => s.replace(/(## S-05: .*\nKind: hosting\n)[^#]*/, '$1\n'), 'spine.md: S-05: decision: empty section'],
]) {
  test(`--spine on a decision with ${name} exits 1, naming the decision and the problem`, (t) => {
    const dir = only(t, 'spine.md');
    edit(dir, 'spine.md', change);
    const r = run('--spine', dir);
    assert.equal(r.status, 1);
    assert.equal(r.stdout.trim(), expected);
  });
}

test('--spine on a folder with no spine exits 1 with a missing file', (t) => {
  const r = run('--spine', temp(t));
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'spine.md: missing file');
});

test('--spine with no directory exits 2', () => {
  const r = run('--spine');
  assert.equal(r.status, 2);
  assert.match(r.stderr, /usage:/);
});

test('--epics on the samples exits 0 with the epics line', () => {
  const r = run('--epics', samples);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), EPICS_OK_LINE);
});

test('--epics passes a folder holding only the epics', (t) => {
  const r = run('--epics', only(t, 'epics.md'));
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), EPICS_OK_LINE);
});

test('--epics on an epic missing Done when exits 1, naming the epic and the field', (t) => {
  const dir = only(t, 'epics.md');
  edit(dir, 'epics.md', inEpic('E-02', (s) => s.replace(/^\*\*Done when:\*\*.*\n/m, '')));
  const r = run('--epics', dir);
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'epics.md: E-02: Done when: missing field');
});

// The limits fail closed through the step's own mode, not just the full check.
for (const [name, [change, expected]] of Object.entries(epicLimits)) {
  test(`--epics on an epic over a limit (${name}) exits 1, naming the epic and the field`, (t) => {
    const dir = only(t, 'epics.md');
    edit(dir, 'epics.md', change);
    const r = run('--epics', dir);
    assert.equal(r.status, 1);
    assert.equal(r.stdout.trim(), expected);
  });
}

test('--epics on a folder with no epics exits 1 with a missing file', (t) => {
  const r = run('--epics', temp(t));
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'epics.md: missing file');
});

test('--epics with no directory exits 2', () => {
  const r = run('--epics');
  assert.equal(r.status, 2);
  assert.match(r.stderr, /usage:/);
});
