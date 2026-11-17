// node lib/check.mjs <dir>, or --brief <dir> for the brief alone - mirrors docs/FORMAT.md, and nothing past it.
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const OK_LINE = 'seldon check: all four documents conform';
export const BRIEF_OK_LINE = 'seldon check: brief.md conforms';

const BRIEF_SECTIONS = ['Problem', 'Solution', 'Who it serves', "What's different", 'Success criteria', 'Scope', 'Vision'];
const PRD_SECTIONS = ['Requirements', 'Non-functional requirements', 'User journeys', 'Non-goals', 'MVP scope'];
const FIELDS = ['Outcome', 'Boundaries', 'Done when', 'Depends on', 'Requirements', 'Spine decisions'];

// Cadence's REQ_ID_EXACT, narrowed to Seldon's two-or-more-digit numbers.
const REQ_ID = /^(?=[A-Z0-9]{2,8}-)[A-Z0-9]*[A-Z][A-Z0-9]*-\d{2,}$/;
const SPINE_ID = /^S-\d{2,}$/;
const EPIC_ID = /^E-\d{2,}$/;
const BULLET = /^- \*\*([^*]*)\*\*: \S/;
const LABEL = new RegExp(`^\\*\\*(${FIELDS.join('|')}):\\*\\*(.*)$`);

const ID_FIELDS = {
  'Depends on': { re: EPIC_ID, none: true, what: 'an epic ID' },
  Requirements: { re: REQ_ID, none: false, what: 'a requirement ID' },
  'Spine decisions': { re: SPINE_ID, none: true, what: 'a spine ID' },
};

// JSON quoting so a stray control character in a document never reaches the terminal raw.
const quote = (s) => JSON.stringify(s);
const blank = (lines) => lines.every((l) => l.trim() === '');

function parse(file, text, problems) {
  const lines = text.split(/\r?\n/);
  const first = lines.find((l) => l.trim() !== '') ?? '';
  if (!first.startsWith('# ')) problems.push(`${file}: title: first line is not a "# " title`);
  const sections = [];
  let cur = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      // No trim: FORMAT.md matches names exactly, so "## Vision " is not Vision.
      cur = { heading: line.slice(3), body: [] };
      sections.push(cur);
    } else if (cur) {
      cur.body.push(line);
    }
  }
  return sections;
}

function checkNamed(file, text, names, problems) {
  const found = new Map();
  for (const s of parse(file, text, problems)) {
    if (!names.includes(s.heading)) problems.push(`${file}: ${quote('## ' + s.heading)}: not a section of ${file}`);
    else if (found.has(s.heading)) problems.push(`${file}: ${s.heading}: section appears more than once`);
    else found.set(s.heading, s);
  }
  for (const name of names) {
    const s = found.get(name);
    if (!s) problems.push(`${file}: ${name}: missing section`);
    else if (blank(s.body)) problems.push(`${file}: ${name}: empty section`);
  }
  // Order only means something once every section is there, same as the epic fields.
  const order = [...found.keys()];
  if (order.length === names.length && order.some((n, i) => n !== names[i])) {
    problems.push(`${file}: sections: out of order, expected ${names.join(', ')}`);
  }
  return found;
}

function checkBullets(section, name, needsCategory, ids, problems) {
  let inCategory = false;
  for (const line of section.body) {
    if (line.startsWith('### ')) inCategory = true;
    if (!line.startsWith('- ')) continue;
    const m = BULLET.exec(line);
    if (!m || !REQ_ID.test(m[1])) {
      problems.push(`prd.md: ${name}: ${quote(line)} is not a "- **CAT-01**: text" requirement`);
      continue;
    }
    if (needsCategory && !inCategory) problems.push(`prd.md: ${m[1]}: ${name}: requirement comes before the first ### category`);
    if (ids.has(m[1])) problems.push(`prd.md: ${m[1]}: ${name}: ID appears more than once`);
    ids.add(m[1]);
  }
}

function checkPrd(text, problems) {
  const found = checkNamed('prd.md', text, PRD_SECTIONS, problems);
  const ids = new Set();
  for (const name of ['Requirements', 'Non-functional requirements']) {
    if (found.has(name)) checkBullets(found.get(name), name, name === 'Requirements', ids, problems);
  }
}

// Spine and epics share one shape: every ## heading is "<ID>: <text>", each ID once, at least one.
function idSections(file, text, prefix, kind, example, problems) {
  const head = new RegExp(`^(${prefix}-\\d{2,}): \\S`);
  const sections = parse(file, text, problems);
  if (sections.length === 0) problems.push(`${file}: no ${kind}`);
  const seen = new Set();
  const out = [];
  for (const s of sections) {
    const m = head.exec(s.heading);
    if (!m) {
      problems.push(`${file}: ${quote('## ' + s.heading)}: not a "${example}" heading`);
    } else if (seen.has(m[1])) {
      problems.push(`${file}: ${m[1]}: heading: ID appears more than once`);
    } else {
      seen.add(m[1]);
      out.push({ id: m[1], body: s.body });
    }
  }
  return out;
}

function checkSpine(text, problems) {
  for (const { id, body } of idSections('spine.md', text, 'S', 'decisions', '## S-01: decision', problems)) {
    if (blank(body)) problems.push(`spine.md: ${id}: decision: empty section`);
  }
}

function checkEpic(id, body, problems) {
  const where = `epics.md: ${id}`;
  const fields = [];
  let cur = null;
  let stray = false;
  for (const line of body) {
    const m = LABEL.exec(line);
    if (m) {
      cur = { label: m[1], value: [m[2]] };
      fields.push(cur);
    } else if (cur) {
      cur.value.push(line);
    } else if (line.trim() !== '' && !stray) {
      stray = true;
      problems.push(`${where}: Outcome: text before the **Outcome:** line`);
    }
  }
  const found = new Map();
  for (const f of fields) {
    if (found.has(f.label)) problems.push(`${where}: ${f.label}: field appears more than once`);
    else found.set(f.label, f);
  }
  for (const label of FIELDS) {
    const f = found.get(label);
    if (!f) {
      problems.push(`${where}: ${label}: missing field`);
      continue;
    }
    const value = f.value.join(' ').trim();
    if (value === '') {
      problems.push(`${where}: ${label}: empty field`);
      continue;
    }
    const ids = ID_FIELDS[label];
    if (!ids || (ids.none && value === 'None')) continue;
    for (const item of value.split(',').map((x) => x.trim())) {
      if (!ids.re.test(item)) problems.push(`${where}: ${label}: ${quote(item)} is not ${ids.what}`);
    }
  }
  const order = [...found.keys()];
  if (order.length === FIELDS.length && order.some((l, i) => l !== FIELDS[i])) {
    problems.push(`${where}: fields: out of order, expected ${FIELDS.join(', ')}`);
  }
}

function checkEpics(text, problems) {
  for (const { id, body } of idSections('epics.md', text, 'E', 'epics', '## E-01: name', problems)) {
    checkEpic(id, body, problems);
  }
}

const CHECKS = {
  'brief.md': (text, problems) => checkNamed('brief.md', text, BRIEF_SECTIONS, problems),
  'prd.md': checkPrd,
  'spine.md': checkSpine,
  'epics.md': checkEpics,
};

// Every problem in the named files, one line each; empty means they conform.
function checkFiles(dir, files) {
  const problems = [];
  for (const file of files) {
    let text;
    try {
      text = readFileSync(join(dir, file), 'utf8');
    } catch (err) {
      problems.push(`${file}: ${err.code === 'ENOENT' ? 'missing file' : `cannot read (${err.code})`}`);
      continue;
    }
    CHECKS[file](text, problems);
  }
  return problems;
}

// The full check: all four files, whatever else the folder holds or lacks.
export function checkDir(dir) {
  return checkFiles(dir, Object.keys(CHECKS));
}

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

export function main(args) {
  // Only the exact token switches mode; anything else first is the directory, as before.
  const brief = args[0] === '--brief';
  const dir = brief ? args[1] : args[0];
  if (!dir || !isDir(dir)) {
    console.error(dir ? `check: ${quote(dir)} is not a directory` : 'usage: node lib/check.mjs [--brief] <dir>');
    return 2;
  }
  const problems = checkFiles(dir, brief ? ['brief.md'] : Object.keys(CHECKS));
  console.log(problems.length === 0 ? (brief ? BRIEF_OK_LINE : OK_LINE) : problems.join('\n'));
  return problems.length === 0 ? 0 : 1;
}

// realpath both sides: an installed plugin path through a symlink must still run, not exit 0 silently.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
