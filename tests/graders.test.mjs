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
  { kind: 'trace', case: 'epics-from-spine', file: 'evals/epics-from-spine/graders/every-requirement-once.md', prd: 'samples/prd.md' },
  { kind: 'trace', case: 'full-walk', file: 'evals/full-walk/graders/every-requirement-traced.md', prd: 'samples/prd.md' },
  { kind: 'trace', case: 'epics-split', file: 'evals/epics-split/graders/every-requirement-traced.md', prd: 'samples/epics-split/prd.md' },
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

// D-09: forms the runner's engine and Node read alike. \b is in on Daneel's ruling, ASCII IDs and no u flag.
const ESCAPES = 'nrtsSwWdDb';
const CLASS_ESCAPES = 'nrtsSwWdD';
const META = '^$\\.*+?()[]{}|/-';
const LOOKBEHIND = '^(?<![\\s\\S])';

// Walks one class from just past its [ and returns the index past its ].
function walkClass(pattern, i, bad) {
  if (pattern[i] === '^') i += 1;
  // [] and [^] are where engines part ways on what a leading ] means.
  if (pattern[i] === ']') {
    bad.push('empty class');
    return i + 1;
  }
  while (i < pattern.length && pattern[i] !== ']') {
    if (pattern[i] === '\\') {
      const e = pattern[i + 1];
      if (!CLASS_ESCAPES.includes(e) && !META.includes(e)) bad.push(`escape \\${e} in a class`);
      i += 2;
    } else {
      if (pattern[i] === '[') bad.push('unescaped [ in a class');
      i += 1;
    }
  }
  return i + 1;
}

// Every form outside D-09, by name; an empty list means the pattern is in.
function formProblems(pattern, flags) {
  const bad = [];
  for (const f of flags) if (f !== 'i' && f !== 'm') bad.push(`flag ${f}`);
  try {
    new RegExp(pattern, flags);
  } catch {
    bad.push("doesn't compile");
  }
  const multiline = flags.includes('m');
  let i = 0;
  while (i < pattern.length) {
    const c = pattern[i];
    if (c === '\\') {
      const e = pattern[i + 1];
      const property = pattern.slice(i).match(/^\\[pP]\{[^}]*\}/);
      if (property) {
        bad.push(`\\${e}{...}`);
        i += property[0].length;
        continue;
      }
      if (/^[1-9]$/.test(e)) bad.push(`backreference \\${e}`);
      else if (e === 'k') bad.push('backreference \\k<name>');
      else if (!ESCAPES.includes(e) && !META.includes(e)) bad.push(`escape \\${e}`);
      i += 2;
    } else if (c === '[') {
      i = walkClass(pattern, i + 1, bad);
    } else if (c === '(') {
      if (/^\(\?[:=!]/.test(pattern.slice(i))) i += 3;
      else if (/^\(\?<[=!]/.test(pattern.slice(i))) {
        bad.push('lookbehind');
        i += 4;
      } else if (pattern.startsWith('(?<', i)) {
        bad.push('named group');
        i += 3;
      } else if (pattern.startsWith('(?', i)) {
        bad.push(`group (?${pattern[i + 2]}`);
        i += 2;
      } else {
        bad.push('capturing group');
        i += 1;
      }
    } else if (c === '^' || c === '$') {
      if (!multiline) bad.push(`${c} without the m flag`);
      i += c === '^' && pattern.startsWith(LOOKBEHIND, i) ? LOOKBEHIND.length : 1;
    } else if (c === '.') {
      bad.push('.');
      i += 1;
    } else if (c === '*' || c === '+' || c === '?' || c === '{') {
      const quantifier = pattern.slice(i).match(/^(?:[*+?]|\{\d+(?:,\d*)?\})\??/);
      if (quantifier) i += quantifier[0].length;
      else {
        bad.push('unescaped {');
        i += 1;
      }
    } else {
      if (c === '}' || c === ']') bad.push(`unescaped ${c}`);
      i += 1;
    }
  }
  return bad;
}

// Names every copy whose bytes differ from the first one's.
function unequal(copies) {
  return copies.filter((c) => !c.bytes.equals(copies[0].bytes)).map((c) => c.name);
}

// The first epic's Outcome line carries outcomeIds, so an ID can sit in the file but on no Requirements line.
function epics(requirementLines, outcomeIds = []) {
  const parts = ['# Toolshed - epics', 'Built from: spine.md sha256:fce47dade8bb786c', ''];
  requirementLines.forEach((ids, i) => {
    const outcome = i === 0 && outcomeIds.length ? ` It covers ${outcomeIds.join(', ')}.` : '';
    parts.push(`## E-0${i + 1}: Part ${i + 1}`, `**Outcome:** Volunteers keep the shed running.${outcome}`, `**Requirements:** ${ids.join(', ')}`, '**Spine decisions:** S-01', '');
  });
  return parts.join('\n');
}

// A PRD's requirement IDs, read from its - **ID**: bullets.
function prdIds(file) {
  return [...readFileSync(join(root, file), 'utf8').matchAll(/^- \*\*([A-Z]+-\d+)\*\*:/gm)].map((m) => m[1]);
}

// Three IDs to an epic, each on exactly one Requirements line.
function spread(ids) {
  const lines = [];
  for (let i = 0; i < ids.length; i += 3) lines.push(ids.slice(i, i + 3));
  return lines;
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
  const six = epics([['CAT-01', 'CAT-02', 'LOAN-01', 'LOAN-02', 'LOAN-03', 'NFR-01'], ['NFR-02']]);
  for (const { file } of of('size')) assert.equal(passes(load(file), six), false, file);
});

test('each size-grader copy passes the same epics with 5 IDs on that line', () => {
  const five = epics([['CAT-01', 'CAT-02', 'LOAN-01', 'LOAN-02', 'LOAN-03'], ['NFR-01', 'NFR-02']]);
  for (const { file } of of('size')) assert.equal(passes(load(file), five), true, file);
});

test('each trace grader passes epics with every seeded PRD ID on exactly one Requirements line', () => {
  for (const { file, prd } of of('trace')) {
    const ids = prdIds(prd);
    assert.ok(ids.length > 0, `${prd}: no requirement IDs`);
    assert.equal(passes(load(file), epics(spread(ids))), true, file);
  }
});

test('each trace grader fails when any one seeded ID is on no Requirements line', async (t) => {
  for (const { file, prd } of of('trace')) {
    const grader = load(file);
    for (const id of prdIds(prd)) {
      await t.test(`${file} fails with ${id} only on an Outcome line`, () => {
        const without = spread(prdIds(prd)).map((line) => line.filter((x) => x !== id));
        assert.equal(passes(grader, epics(without, [id])), false);
      });
    }
  }
});

test("each trace grader fails a seeded ID on two epics' Requirements lines", async (t) => {
  for (const { file, prd } of of('trace')) {
    const ids = prdIds(prd);
    await t.test(`${file} fails with ${ids[0]} on two epics`, () => {
      const lines = spread(ids);
      lines.at(-1).push(ids[0]);
      assert.equal(passes(load(file), epics(lines)), false);
    });
  }
});

test("every full grader's pattern uses only D-09's forms", () => {
  const problems = [];
  for (const { file } of FULL) {
    const { pattern, flags } = load(file);
    for (const form of formProblems(pattern, flags)) problems.push(`${file}: D-09 form error: ${form}`);
  }
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});

test('the form check flags each refused form by name and passes one pattern holding every accepted form', () => {
  const refused = [
    ['a\\1', '', 'backreference \\1'],
    ['a\\k<x>', '', 'backreference \\k<name>'],
    ['(?<x>a)', '', 'named group'],
    ['\\p{L}', '', '\\p{...}'],
    ['\\P{L}', '', '\\P{...}'],
    ['(?<=a)b', '', 'lookbehind'],
    ['(?<!a)b', '', 'lookbehind'],
    ['(?<![\\s\\S])a', 'm', 'lookbehind'],
    ['(a)', '', 'capturing group'],
    ['a.b', '', '.'],
    ['^a', 'i', '^ without the m flag'],
    ['a$', '', '$ without the m flag'],
    ['^(?<![\\s\\S])a', '', '^ without the m flag'],
    ['a[^]', 'm', 'empty class'],
    ['a\\x41', '', 'escape \\x'],
    ['[\\b]', '', 'escape \\b in a class'],
    ...['s', 'u', 'g', 'y', 'd', 'v'].map((f) => ['a', `m${f}`, `flag ${f}`]),
  ];
  for (const [pattern, flags, form] of refused) {
    assert.deepEqual(formProblems(pattern, flags), [form], `/${pattern}/${flags}`);
  }
  const every = '^(?<![\\s\\S])(?=[\\s\\S]*?\\bA\\.B\\b)(?![^\\n\\r\\t]+x)(?:a|b)*?c+?d??e{2}f{2,}?g{3,4}[a-z\\s\\S\\w\\W\\d\\D\\]\\-]\\n\\r\\t\\s\\S\\w\\W\\d\\D\\*\\(\\)\\[\\]\\{\\}\\|\\/\\$\\^\\\\\\+\\?\\.h$';
  assert.deepEqual(formProblems(every, 'im'), []);
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
