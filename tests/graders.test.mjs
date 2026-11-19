import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, sep } from 'node:path';
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
  ...['resume-later', 'handoff-cadence', 'handoff-named', 'readiness-agent'].map((c) => ({ kind: 'last-message', case: c, file: `evals/${c}/graders/says-no-findings.md` })),
  ...['resume-later', 'handoff-cadence', 'handoff-named', 'readiness-agent'].map((c) => ({ kind: 'agent-result', case: c, file: `evals/${c}/graders/agent-finds-nothing.md` })),
  { kind: 'recommend', case: 'fast-path', file: 'evals/fast-path/graders/recommends-fast-path.md' },
  { kind: 'recommend', case: 'cadence-dump', file: 'evals/cadence-dump/graders/recommends-fast-path.md' },
  { kind: 'recommend', case: 'asks-for-dump', file: 'evals/asks-for-dump/graders/recommends-a-path.md', coaching: true },
];

// The kinds D-01 holds to byte copies.
const EQUAL = ['size', 'last-message', 'agent-result'];

const NO_FINDINGS = 'The readiness check found nothing to fix.';
const HANDOFF = 'To hand this design to Cadence, run:\n\n/cad-new-project --brief .planning/seldon';
// One line of each kind, in SKILL.md's "The reply" forms.
const FINDINGS = [
  'Requirement no epic names: CAT-01. Fixed by rerunning /seldon epics.',
  "Epic crossing a boundary the spine didn't fix: E-02 (Loans and Repairs). Fixed by rerunning /seldon spine.",
  'Decision left open: E-02, E-03 (how reminders are sent). Fixed by rerunning /seldon spine.',
];

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

// AC2's graders: the recommendation graders aren't held to their cases.
const PLACED = ['size', 'trace', 'last-message', 'agent-result'];

// Every file in every case folder, as { case, path inside the case, bytes }; results/ is run output.
function evalLayout() {
  const layout = [];
  for (const entry of readdirSync(join(root, 'evals'), { recursive: true })) {
    const parts = String(entry).split(sep);
    if (parts.length < 2 || parts[0] === 'results') continue;
    const file = join(root, 'evals', String(entry));
    if (statSync(file).isFile()) layout.push({ case: parts[0], path: parts.slice(1).join('/'), bytes: readFileSync(file) });
  }
  return layout;
}

// A placed grader missing from its case, its name in a case the table doesn't give it, or its bytes there under any name.
function misplaced(layout, table) {
  const problems = [];
  const placed = table.filter((g) => PLACED.includes(g.kind));
  for (const g of placed) {
    if (!layout.some((f) => `evals/${f.case}/${f.path}` === g.file)) problems.push(`${g.file}: missing from its case`);
  }
  const casesFor = (keep) => new Set(placed.filter(keep).map((g) => g.case));
  for (const f of layout) {
    const shown = `evals/${f.case}/${f.path}`;
    const name = basename(f.path);
    const named = casesFor((g) => basename(g.file) === name);
    if (named.size && !named.has(f.case)) problems.push(`${shown}: ${name} belongs only in ${[...named].join(', ')}`);
    for (const kind of EQUAL) {
      const first = placed.find((g) => g.kind === kind);
      const original = layout.find((x) => `evals/${x.case}/${x.path}` === first.file);
      if (original && f.bytes.equals(original.bytes) && !casesFor((g) => g.kind === kind).has(f.case)) {
        problems.push(`${shown}: a byte copy of the ${kind} grader outside its cases`);
      }
    }
  }
  return problems;
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

// Agent start, task_notification, Agent result and final text, shaped like phase 8's kept traces with invented ids.
function readinessTrace({ report, summary, last }) {
  const id = 'toolu_01TestReadinessStart0001';
  const indented = report.split('\n').map((line) => `  ${line}`).join('\n');
  const handBack = `  <tools-used-before-summary>Read</tools-used-before-summary>\n  \n[Subagent hand-back] The report follows:\n${indented}\nagentId: a0123456789abcdef\n<usage>subagent_tokens: 6532</usage>`;
  const events = [
    { type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id, name: 'Agent', input: { description: 'Seldon readiness check', subagent_type: 'seldon:readiness', prompt: '.planning/seldon/prd.md\n.planning/seldon/spine.md\n.planning/seldon/epics.md' } }] }, parent_tool_use_id: null },
    { type: 'system', subtype: 'task_notification', task_id: 'a0123456789abcdef', tool_use_id: id, status: 'completed', summary },
    { type: 'user', message: { role: 'user', content: [{ tool_use_id: id, type: 'tool_result', content: [{ type: 'text', text: handBack }] }] }, parent_tool_use_id: null, tool_use_result: { status: 'completed', agentType: 'seldon:readiness', content: [{ type: 'text', text: report }] } },
    { type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: last }] }, parent_tool_use_id: null },
  ];
  return `${events.map((e) => JSON.stringify(e)).join('\n')}\n`;
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

test('each last-message half passes the no-findings line followed by the handoff', () => {
  for (const { file } of of('last-message')) assert.equal(passes(load(file), `${NO_FINDINGS}\n\n${HANDOFF}`), true, file);
});

test('each last-message half fails that message with any one finding line added', async (t) => {
  for (const finding of FINDINGS) {
    await t.test(`fails with "${finding.slice(0, finding.indexOf(':') + 1)}"`, () => {
      for (const { file } of of('last-message')) assert.equal(passes(load(file), `${finding}\n${NO_FINDINGS}\n\n${HANDOFF}`), false, file);
    });
  }
});

test('each last-message half fails the handoff with no no-findings line', () => {
  for (const { file } of of('last-message')) assert.equal(passes(load(file), HANDOFF), false, file);
});

test("each agent-result half passes a trace whose Agent result is the no-findings line", () => {
  const trace = readinessTrace({ report: NO_FINDINGS, summary: NO_FINDINGS, last: `${NO_FINDINGS}\n\n${HANDOFF}` });
  for (const { file } of of('agent-result')) assert.equal(passes(load(file), trace), true, file);
});

// The run D-07 exists for: the agent raised a finding and the skill said nothing was wrong.
test('each agent-result half fails a trace whose Agent result holds a finding, though the last message says the no-findings line', () => {
  const trace = readinessTrace({ report: FINDINGS[0], summary: FINDINGS[0], last: `${NO_FINDINGS}\n\n${HANDOFF}` });
  for (const { file } of of('agent-result')) assert.equal(passes(load(file), trace), false, file);
});

// A recommendation reply in SKILL.md's shape, with the path line swapped for each form.
const recommendation = (line) => `This is Toolshed, from your dump.\n\n${line}\n\nYou already know the catalog and the counter. Do you want the fast path, or would you rather walk through it with coaching?`;

test('each recommendation grader passes the plain line on a line of its own', () => {
  for (const { file } of of('recommend')) assert.equal(passes(load(file), recommendation('Recommended path: fast path')), true, file);
  for (const { file } of of('recommend').filter((g) => g.coaching)) assert.equal(passes(load(file), recommendation('Recommended path: coaching')), true, file);
});

test('each recommendation grader fails a bold, a mid-sentence and a split recommendation', async (t) => {
  const forms = [
    ['bold line', '**Recommended path: fast path**'],
    ['bold label', '**Recommended path:** fast path'],
    ['mid-sentence', "I'd say the Recommended path: fast path, since you already know what you want."],
    ['split', 'Recommended path:\nfast path'],
  ];
  for (const [name, line] of forms) {
    await t.test(`fails the ${name}`, () => {
      for (const { file } of of('recommend')) assert.equal(passes(load(file), recommendation(line)), false, file);
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

test('every size, trace and readiness-passes grader sits in its own cases and nowhere else', () => {
  const problems = misplaced(evalLayout(), FULL);
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});

test('the placement check flags a size-grader copy in another case and a renamed byte copy of a half', () => {
  const planted = FULL.map((g) => ({ case: g.case, path: g.file.split('/').slice(2).join('/'), bytes: readFileSync(join(root, g.file)) }));
  assert.deepEqual(misplaced(planted, FULL), []);
  const size = planted.find((f) => f.path === 'graders/at-most-five-ids.md').bytes;
  const half = planted.find((f) => f.path === 'graders/says-no-findings.md').bytes;
  assert.deepEqual(misplaced([...planted, { case: 'spine-from-prd', path: 'graders/at-most-five-ids.md', bytes: size }], FULL), [
    'evals/spine-from-prd/graders/at-most-five-ids.md: at-most-five-ids.md belongs only in epics-split, full-walk, epics-from-spine',
    'evals/spine-from-prd/graders/at-most-five-ids.md: a byte copy of the size grader outside its cases',
  ]);
  assert.deepEqual(misplaced([...planted, { case: 'stale-epics', path: 'graders/readiness-ok.md', bytes: half }], FULL), [
    'evals/stale-epics/graders/readiness-ok.md: a byte copy of the last-message grader outside its cases',
  ]);
  assert.deepEqual(misplaced(planted.filter((f) => f.case !== 'readiness-agent' || f.path !== 'graders/agent-finds-nothing.md'), FULL), [
    'evals/readiness-agent/graders/agent-finds-nothing.md: missing from its case',
  ]);
});

test('the equal-copy check flags a planted pair one byte apart', () => {
  const a = Buffer.from("---\ntype: regex\npattern: 'a'\n---\n");
  const b = Buffer.concat([a, Buffer.from(' ')]);
  assert.deepEqual(unequal([{ name: 'a', bytes: a }, { name: 'b', bytes: b }]), ['b']);
  assert.deepEqual(unequal([{ name: 'a', bytes: a }, { name: 'a2', bytes: Buffer.from(a) }]), []);
});

// D-13's spine confirm ending: stale-spine's grader, with readiness-fix's two copies held to its bytes.
const CONFIRM = ['stale-spine', 'readiness-fix'].map((c) => `evals/${c}/graders/ends-on-confirm.md`);
const spineEnd = (tail) => `I wrote .planning/seldon/spine.md.\n\nseldon check: spine.md conforms\n\n${tail}`;
const QUESTION = 'Do you confirm the spine, or do you want changes?';
const OFFER = '`/seldon architecture` can write the full architecture document once you confirm.';

test('the spine confirm grader passes the command in the question, in a sentence before it, and a paragraph above it', async (t) => {
  const forms = [
    ['command inside the question', 'Do you confirm the spine, after which `/seldon architecture` can write the full architecture document if you want one, or do you want changes?'],
    ['sentence and question on one line', `${OFFER} ${QUESTION}`],
    ['sentence a paragraph above', `${OFFER}\n\n${QUESTION}\n`],
  ];
  for (const [name, tail] of forms) await t.test(name, () => assert.equal(passes(load(CONFIRM[0]), spineEnd(tail)), true));
});

test('the spine confirm grader fails a trailing command sentence, a command far above, and a statement ending', async (t) => {
  const forms = [
    ['phase 7 split', `${QUESTION}\n\nOnce you confirm, \`/seldon architecture\` can write the full architecture document.`],
    ['command only in an earlier paragraph', `${OFFER}\n\nThe spine fixes three decisions.\n\n${QUESTION}`],
    ['no closing question', '`/seldon architecture` can write the full architecture document once you confirm the spine.'],
  ];
  for (const [name, tail] of forms) await t.test(name, () => assert.equal(passes(load(CONFIRM[0]), spineEnd(tail)), false));
});

test("the spine confirm grader's copies are equal bytes", () => {
  const copies = CONFIRM.map((file) => ({ name: file, bytes: readFileSync(join(root, file)) }));
  assert.deepEqual(unequal(copies), [], `copies differ from ${CONFIRM[0]}`);
});

// A bare /seldon's run up to the line and past it, in readinessTrace's event shape with invented ids.
function lineTrace({ text, reads, change }) {
  const events = [];
  const call = (id, name, input) => events.push({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] }, parent_tool_use_id: null });
  const result = (id, content) => events.push({ type: 'user', message: { role: 'user', content: [{ tool_use_id: id, type: 'tool_result', content }] }, parent_tool_use_id: null });
  call('toolu_01TestSkill', 'Skill', { skill: 'seldon:seldon' });
  result('toolu_01TestSkill', 'Launching skill: seldon:seldon');
  call('toolu_01TestGlob', 'Glob', { pattern: '.planning/seldon/{brief,prd,spine,epics}.md' });
  result('toolu_01TestGlob', '.planning/seldon/brief.md\n.planning/seldon/prd.md');
  call('toolu_01TestStale', 'Bash', { command: 'node /code/seldon/lib/check.mjs --stale .planning/seldon', description: 'Check for stale links' });
  result('toolu_01TestStale', 'seldon check: no stale link');
  events.push({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text }] }, parent_tool_use_id: null });
  reads.forEach((file, i) => {
    call(`toolu_01TestRead${i}`, 'Read', { file_path: `/tmp/cwd/${file}` });
    result(`toolu_01TestRead${i}`, '1\t# Toolshed');
  });
  const body = change.tool === 'Edit' ? { old_string: 'Built from: old', new_string: 'Built from: new' } : { content: '# Toolshed' };
  call('toolu_01TestChange', change.tool, { file_path: `/tmp/cwd/${change.file}`, ...body });
  return `${events.map((e) => JSON.stringify(e)).join('\n')}\n`;
}

// D-10's lines by their parts, each with the sentence it used to be held to word for word.
const LINES = [
  {
    file: 'evals/full-walk/graders/names-spine-first.md',
    old: "I'm building the epics from .planning/seldon/spine.md, the spine that's already there, and the PRD. To revise the spine instead, run /seldon spine.",
    doc: 'epics', path: '.planning/seldon/spine.md', cmd: '/seldon spine',
    reads: ['.planning/seldon/prd.md', '.planning/seldon/spine.md'], change: { tool: 'Write', file: '.planning/seldon/epics.md' },
  },
  {
    file: 'evals/spine-from-prd/graders/names-prd-first.md',
    old: "I'm building the spine from .planning/seldon/prd.md, the PRD that's already there, and the brief. To revise the PRD instead, run /seldon prd.",
    doc: 'spine', path: '.planning/seldon/prd.md', cmd: '/seldon prd',
    reads: ['.planning/seldon/brief.md', '.planning/seldon/prd.md'], change: { tool: 'Write', file: '.planning/seldon/spine.md' },
  },
  {
    file: 'evals/resume/graders/names-brief-first.md',
    old: "I'm building the PRD from .planning/seldon/brief.md, the brief that's already there. To revise the brief instead, run /seldon brief.",
    doc: 'PRD', path: '.planning/seldon/brief.md', cmd: '/seldon brief',
    reads: ['.planning/seldon/brief.md'], change: { tool: 'Write', file: '.planning/seldon/prd.md' },
  },
  {
    file: 'evals/which-design-answer/graders/names-brief-first.md',
    old: "I'm building the PRD from .planning/seldon/sowlist/brief.md, the brief that's already there. To revise the brief instead, run /seldon brief.",
    doc: 'PRD', path: '.planning/seldon/sowlist/brief.md', cmd: '/seldon brief',
    reads: ['.planning/seldon/sowlist/brief.md'], change: { tool: 'Write', file: '.planning/seldon/sowlist/prd.md' },
  },
  {
    file: 'evals/stale-prd/graders/says-stale-line.md',
    old: "I'm updating the PRD, because .planning/seldon/brief.md has changed since the PRD was built from it. To revise the brief instead, run /seldon brief.",
    doc: 'PRD', path: '.planning/seldon/brief.md', cmd: '/seldon brief',
    reads: ['.planning/seldon/prd.md', '.planning/seldon/brief.md'], change: { tool: 'Edit', file: '.planning/seldon/prd.md' },
  },
  {
    file: 'evals/stale-spine/graders/says-stale-line.md',
    old: "I'm updating the spine, because .planning/seldon/prd.md has changed since the spine was built from it. To revise the PRD instead, run /seldon prd.",
    doc: 'spine', path: '.planning/seldon/prd.md', cmd: '/seldon prd',
    reads: ['.planning/seldon/spine.md', '.planning/seldon/prd.md'], change: { tool: 'Edit', file: '.planning/seldon/spine.md' },
  },
  {
    file: 'evals/stale-epics/graders/says-stale-line.md',
    old: "I'm updating the epics, because .planning/seldon/spine.md has changed since the epics were built from it. To revise the spine instead, run /seldon spine.",
    doc: 'epics', path: '.planning/seldon/spine.md', cmd: '/seldon spine',
    reads: ['.planning/seldon/epics.md', '.planning/seldon/spine.md'], change: { tool: 'Edit', file: '.planning/seldon/epics.md' },
  },
  // not_contains: it catches the epics resume line in any wording, on stale-prd's run.
  {
    file: 'evals/stale-prd/graders/no-epics-line.md',
    old: "I'm building the epics from .planning/seldon/spine.md, the spine that's already there, and the PRD. To revise the spine instead, run /seldon spine.",
    doc: 'epics', path: '.planning/seldon/spine.md', cmd: '/seldon spine',
    reads: ['.planning/seldon/prd.md', '.planning/seldon/brief.md'], change: { tool: 'Edit', file: '.planning/seldon/prd.md' },
  },
];

const paraphrase = ({ doc, path, cmd }) => `Picking up where this left off, the ${doc} comes next, worked from ${path}, which is already there.\n\nIf that file needs changing first, run ${cmd}.`;

// Each part dropped in turn; the command goes to a longer one, which mustn't count as it.
const DROPS = [
  ['document', (l) => ({ ...l, doc: 'next document' })],
  ['path', (l) => ({ ...l, path: 'the file' })],
  ['command', (l) => ({ ...l, cmd: `${l.cmd}-x` })],
];

test('each regraded line grader passes the old sentence and a paraphrase that carries its parts, and fails each part dropped', async (t) => {
  for (const line of LINES) {
    const grader = load(line.file);
    const run = (text) => passes(grader, lineTrace({ text, reads: line.reads, change: line.change }));
    const caught = grader.match === 'not_contains';
    await t.test(`${line.file} on the old sentence`, () => assert.equal(run(line.old), !caught));
    await t.test(`${line.file} on a paraphrase`, () => assert.equal(run(paraphrase(line)), !caught));
    for (const [part, drop] of DROPS) {
      await t.test(`${line.file} with the ${part} dropped`, () => assert.equal(run(paraphrase(drop(line))), caught));
    }
  }
});
