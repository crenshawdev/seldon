import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Every full grader, by file and case. A copy that repeats across cases shares a kind.
const FULL = [
  { kind: 'size', case: 'epics-split', file: 'evals/epics-split/graders/at-most-five-ids.md' },
  { kind: 'size', case: 'full-walk', file: 'evals/full-walk/graders/at-most-five-ids.md' },
  { kind: 'size', case: 'epics-from-spine', file: 'evals/epics-from-spine/graders/at-most-five-ids.md' },
];

// The kinds D-01 holds to byte copies.
const EQUAL = ['size'];

const of = (kind) => FULL.filter((g) => g.kind === kind);

// Only the forms YAML and this reader agree on: a one-line single-quoted pattern, plain everything else.
function readGrader(source, file) {
  const head = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!head) throw new Error(`${file}: no frontmatter`);
  const keys = {};
  for (const line of head[1].split('\n')) {
    const key = line.match(/^(type|pattern|flags|match):(.*)$/);
    if (!key) continue;
    const [, name, rest] = key;
    if (name === 'pattern') {
      const quoted = rest.match(/^[ \t]+'((?:[^']|'')*)'[ \t]*$/);
      if (!quoted) throw new Error(`${file}: pattern isn't a single-quoted value on its key's line`);
      keys.pattern = quoted[1].replaceAll("''", "'");
    } else {
      const plain = rest.match(/^[ \t]+([A-Za-z_]+)[ \t]*$/);
      if (!plain) throw new Error(`${file}: ${name} isn't a plain value`);
      keys[name] = plain[1];
    }
  }
  if (keys.type !== 'regex') throw new Error(`${file}: type is ${keys.type ?? 'missing'}, not regex`);
  if (keys.pattern === undefined) throw new Error(`${file}: no pattern`);
  const match = keys.match ?? 'contains';
  if (match !== 'contains' && match !== 'not_contains') throw new Error(`${file}: match is ${match}`);
  return { pattern: keys.pattern, flags: keys.flags ?? '', match };
}

const load = (file) => readGrader(readFileSync(join(root, file), 'utf8'), file);

// What the runner does with it: a hit passes under contains and fails under not_contains.
function passes(grader, text) {
  const hit = new RegExp(grader.pattern, grader.flags).test(text);
  return grader.match === 'not_contains' ? !hit : hit;
}

// Names every copy whose bytes differ from the first one's.
function unequal(copies) {
  return copies.filter((c) => !c.bytes.equals(copies[0].bytes)).map((c) => c.name);
}

function epics(...requirementLines) {
  const parts = ['# Toolshed - epics', 'Built from: spine.md sha256:fce47dade8bb786c', ''];
  requirementLines.forEach((ids, i) => {
    parts.push(`## E-0${i + 1}: Part ${i + 1}`, '**Outcome:** Volunteers keep the shed running.', `**Requirements:** ${ids.join(', ')}`, '**Spine decisions:** S-01', '');
  });
  return parts.join('\n');
}

test('every full grader the table names is in the tree and reads as a regex grader', () => {
  const problems = [];
  for (const { file } of FULL) {
    if (!existsSync(join(root, file))) {
      problems.push(`${file}: named by the table but missing`);
      continue;
    }
    try {
      load(file);
    } catch (err) {
      problems.push(err.message);
    }
  }
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});

test('the grader reader takes a single-quoted pattern with doubled quotes, and fails any other form by file', () => {
  const ok = readGrader("---\ntype: regex\ntarget: last_message\npattern: 'didn''t'\nflags: im\nmatch: not_contains\n---\n", 'x.md');
  assert.deepEqual(ok, { pattern: "didn't", flags: 'im', match: 'not_contains' });
  assert.equal(readGrader("---\ntype: regex\npattern: 'a'\n---\n", 'x.md').match, 'contains');
  const refused = [
    ['---\ntype: regex\npattern: "a"\n---\n', /x\.md: pattern isn't a single-quoted/],
    ['---\ntype: regex\npattern: |\n  a\n---\n', /x\.md: pattern isn't a single-quoted/],
    ['---\ntype: regex\npattern: a\n---\n', /x\.md: pattern isn't a single-quoted/],
    ['---\ntype: regex\n---\n', /x\.md: no pattern/],
    ["---\ntype: llm\npattern: 'a'\n---\n", /x\.md: type is llm, not regex/],
    ["---\ntype: \"regex\"\npattern: 'a'\n---\n", /x\.md: type isn't a plain value/],
    ["---\ntype: regex\npattern: 'a'\nmatch: some\n---\n", /x\.md: match is some/],
    ["type: regex\npattern: 'a'\n", /x\.md: no frontmatter/],
  ];
  for (const [source, why] of refused) assert.throws(() => readGrader(source, 'x.md'), why, JSON.stringify(source));
});

test('each size-grader copy fails an epic whose Requirements line holds 6 IDs', () => {
  const six = epics(['CAT-01', 'CAT-02', 'LOAN-01', 'LOAN-02', 'LOAN-03', 'NFR-01'], ['NFR-02']);
  for (const { file } of of('size')) assert.equal(passes(load(file), six), false, file);
});

test('each size-grader copy passes the same epics with 5 IDs on that line', () => {
  const five = epics(['CAT-01', 'CAT-02', 'LOAN-01', 'LOAN-02', 'LOAN-03'], ['NFR-01', 'NFR-02']);
  for (const { file } of of('size')) assert.equal(passes(load(file), five), true, file);
});

test('the copies of each held grader are equal bytes', () => {
  for (const kind of EQUAL) {
    const copies = of(kind).map(({ file }) => ({ name: file, bytes: readFileSync(join(root, file)) }));
    assert.ok(copies.length > 1, `${kind}: fewer than two copies`);
    assert.deepEqual(unequal(copies), [], `${kind} copies differ from ${copies[0].name}`);
  }
});

test('the equal-copy check flags a planted pair one byte apart', () => {
  const a = Buffer.from("---\ntype: regex\npattern: 'a'\n---\n");
  const b = Buffer.concat([a, Buffer.from(' ')]);
  assert.deepEqual(unequal([{ name: 'a', bytes: a }, { name: 'b', bytes: b }]), ['b']);
  assert.deepEqual(unequal([{ name: 'a', bytes: a }, { name: 'a2', bytes: Buffer.from(a) }]), []);
});
