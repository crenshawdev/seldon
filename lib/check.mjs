// node lib/check.mjs <dir>, or --brief <dir> / --prd <dir> / --spine <dir> / --epics <dir> for that one file alone,
// or --stale <dir> for the links whose parent moved on, or --ids <dir> for each prefix's highest number in the
// project's REQUIREMENTS.md - mirrors docs/FORMAT.md, and nothing past it.
import { createHash } from 'node:crypto';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const OK_LINE = 'seldon check: all four documents conform';
export const BRIEF_OK_LINE = 'seldon check: brief.md conforms';
export const PRD_OK_LINE = 'seldon check: prd.md conforms';
export const SPINE_OK_LINE = 'seldon check: spine.md conforms';
export const EPICS_OK_LINE = 'seldon check: epics.md conforms';
export const STALE_OK_LINE = 'seldon check: no stale link';
export const NO_IDS_LINE = 'seldon check: no project IDs';

const BRIEF_SECTIONS = ['Problem', 'Solution', 'Who it serves', "What's different", 'Success criteria', 'Scope', 'What it refuses', 'Vision'];
const PRD_SECTIONS = ['Requirements', 'Non-functional requirements', 'User journeys', 'Non-goals', 'MVP scope'];
const FIELDS = ['Outcome', 'Boundaries', 'Done when', 'Depends on', 'Requirements', 'Spine decisions'];
const KINDS = ['design approach', 'boundaries', 'how state changes', 'who owns shared data', 'stack', 'hosting'];
const KIND = 'Kind: ';

// Cadence's REQ_ID_EXACT, narrowed to Seldon's two-or-more-digit numbers.
const REQ_ID = /^(?=[A-Z0-9]{2,8}-)[A-Z0-9]*[A-Z][A-Z0-9]*-\d{2,}$/;
// The same admission shape unanchored, any digit count; the lookbehind stops a 9-letter run passing as its last 8.
const PROJECT_ID = /(?<![\w-])((?=[A-Z0-9]*[A-Z])[A-Z0-9]{2,8})-(\d+)(?!\w)/g;
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
// The tag marks text, it isn't text: a body or field holding only the tag is empty.
const TAG = '[ASSUMPTION]';
const empty = (s) => s.replaceAll(TAG, '').trim() === '';
const blank = (lines) => lines.every(empty);

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

// Child and parent, in chain order. The brief has no parent, and architecture.md is no link at all.
const CHAIN = [['prd.md', 'brief.md'], ['spine.md', 'prd.md'], ['epics.md', 'spine.md']];
const PARENT = Object.fromEntries(CHAIN);
const STAMP = 'Built from:';
const STAMP_FORM = Object.fromEntries(CHAIN.map(([child, parent]) =>
  [child, new RegExp(`^${STAMP} ${parent.replace('.', '\\.')} sha256:([0-9a-f]{16})$`)]));

// Raw bytes, stamp line and all, so a parent's new stamp is a new hash and the change rides down the chain.
const hashOf = (bytes) => createHash('sha256').update(bytes).digest('hex').slice(0, 16);

// Every line above the first ## that claims to be a stamp, well-formed or not.
function stampLines(text) {
  const lines = text.split(/\r?\n/);
  const end = lines.findIndex((l) => l.startsWith('## '));
  return lines.slice(0, end === -1 ? lines.length : end).filter((l) => l.startsWith(STAMP));
}

// The hash a child's one well-formed stamp holds; none, a bad one or two all read unstamped, and unstamped is fresh.
function stampedHash(child, text) {
  const lines = stampLines(text);
  return lines.length === 1 ? (STAMP_FORM[child].exec(lines[0])?.[1] ?? null) : null;
}

// Exact, like a Kind line, and only when present: no stamp passes. Hashes are --stale's business, not this.
function checkStamp(file, text, problems) {
  const lines = stampLines(text);
  if (lines.length > 1) problems.push(`${file}: Built from: line appears more than once`);
  for (const line of lines) {
    if (!STAMP_FORM[file].test(line)) {
      problems.push(`${file}: Built from: ${quote(line)} is not a "${STAMP} ${PARENT[file]} sha256:<16 lowercase hex digits>" stamp`);
    }
  }
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

// Reports each bad bullet; true when the section holds at least one well-formed requirement.
function checkBullets(section, name, needsCategory, ids, problems) {
  let inCategory = false;
  let any = false;
  for (const line of section.body) {
    if (line.startsWith('### ')) inCategory = true;
    if (!line.startsWith('- ')) continue;
    const m = BULLET.exec(line);
    if (!m || !REQ_ID.test(m[1])) {
      problems.push(`prd.md: ${name}: ${quote(line)} is not a "- **CAT-01**: text" requirement`);
      continue;
    }
    any = true;
    if (needsCategory && !inCategory) problems.push(`prd.md: ${m[1]}: ${name}: requirement comes before the first ### category`);
    if (ids.has(m[1])) problems.push(`prd.md: ${m[1]}: ${name}: ID appears more than once`);
    ids.add(m[1]);
  }
  return any;
}

function checkPrd(text, problems) {
  // In each file's own check, so the full check and that file's mode both hold the stamp, as with the bullets below.
  checkStamp('prd.md', text, problems);
  const found = checkNamed('prd.md', text, PRD_SECTIONS, problems);
  const ids = new Set();
  for (const name of ['Requirements', 'Non-functional requirements']) {
    const s = found.get(name);
    if (!s) continue;
    // A prd.md rule, so the full check and --prd both apply it; an empty section already has its line.
    if (!checkBullets(s, name, name === 'Requirements', ids, problems) && !blank(s.body)) {
      problems.push(`prd.md: ${name}: no "- **CAT-01**: text" requirement`);
    }
  }
}

// Spine and epics share one shape: every ## heading is "<ID>: <text>", each ID once, at least one.
function idSections(file, text, prefix, kind, example, problems) {
  // The lookahead keeps the tag out of the heading, as exact matching does for brief and PRD names.
  const head = new RegExp(`^(${prefix}-\\d{2,}): (?!.*\\[ASSUMPTION\\])\\S`);
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
  checkStamp('spine.md', text, problems);
  for (const { id, body } of idSections('spine.md', text, 'S', 'decisions', '## S-01: decision', problems)) {
    const kinds = body.filter((l) => l.startsWith(KIND));
    // The Kind line names the decision without stating it, so alone it's an empty body, and one line says so.
    if (blank(body.filter((l) => !l.startsWith(KIND)))) {
      problems.push(`spine.md: ${id}: decision: empty section`);
      continue;
    }
    if (kinds.length === 0) problems.push(`spine.md: ${id}: Kind: missing line`);
    if (kinds.length > 1) problems.push(`spine.md: ${id}: Kind: line appears more than once`);
    // Exact, like section names: no trim, no case folding, and a tag on the line makes it no kind.
    for (const line of kinds) {
      const kind = line.slice(KIND.length);
      if (!KINDS.includes(kind)) problems.push(`spine.md: ${id}: Kind: ${quote(kind)} is not one of the six kinds`);
    }
  }
}

// earlier: the epic IDs whose headings sit above this one, the only ones Depends on may name.
function checkEpic(id, body, earlier, problems) {
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
    if (empty(value)) {
      problems.push(`${where}: ${label}: empty field`);
      continue;
    }
    if (label === 'Done when') {
      // Only column-0 bullets below the label count: label-line text and indented lines are no items.
      const n = f.value.slice(1).filter((l) => l.startsWith('- ')).length;
      if (n < 2 || n > 5) problems.push(`${where}: Done when: ${n} ${n === 1 ? 'item' : 'items'}, expected 2 to 5`);
    }
    const ids = ID_FIELDS[label];
    if (!ids || (ids.none && value === 'None')) continue;
    const items = value.split(',').map((x) => x.trim());
    if (label === 'Requirements' && items.length > 5) problems.push(`${where}: Requirements: ${items.length} IDs, expected at most 5`);
    for (const item of items) {
      if (!ids.re.test(item)) problems.push(`${where}: ${label}: ${quote(item)} is not ${ids.what}`);
      else if (label === 'Depends on' && !earlier.includes(item)) problems.push(`${where}: Depends on: ${quote(item)} is not an epic earlier in the file`);
    }
  }
  const order = [...found.keys()];
  if (order.length === FIELDS.length && order.some((l, i) => l !== FIELDS[i])) {
    problems.push(`${where}: fields: out of order, expected ${FIELDS.join(', ')}`);
  }
}

function checkEpics(text, problems) {
  checkStamp('epics.md', text, problems);
  // File order is build order, by position and never by number; a heading bad only past its ID still declares it.
  const declared = text.split(/\r?\n/).flatMap((l) => /^## (E-\d{2,}):/.exec(l)?.slice(1) ?? []);
  for (const { id, body } of idSections('epics.md', text, 'E', 'epics', '## E-01: name', problems)) {
    checkEpic(id, body, declared.slice(0, declared.indexOf(id)), problems);
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

// A one-file mode: the file it reads and the line it passes with.
const MODES = {
  '--brief': [['brief.md'], BRIEF_OK_LINE],
  '--prd': [['prd.md'], PRD_OK_LINE],
  '--spine': [['spine.md'], SPINE_OK_LINE],
  '--epics': [['epics.md'], EPICS_OK_LINE],
};

// The stale check: several files and no format rule, so it sits beside MODES rather than in it.
function checkStale(dir) {
  const bytes = {};
  for (const file of ['brief.md', ...CHAIN.map(([child]) => child)]) {
    try {
      bytes[file] = readFileSync(join(dir, file));
    } catch {
      // Unreadable is as good as absent here: no hash to compare, and the full check names why.
      bytes[file] = null;
    }
  }
  const stale = [];
  const stamps = [];
  for (const [child, parent] of CHAIN) {
    if (!bytes[parent]) continue;
    const now = hashOf(bytes[parent]);
    stamps.push(`stamp for ${child}: ${STAMP} ${parent} sha256:${now}`);
    const was = bytes[child] && stampedHash(child, bytes[child].toString('utf8'));
    if (was && was !== now) stale.push(`stale: ${child} was built from an earlier ${parent}`);
  }
  console.log([...(stale.length ? stale : [STALE_OK_LINE]), ...stamps].join('\n'));
  return stale.length ? 1 : 0;
}

// The project's IDs: one file outside the design folder and no format rule, so it sits beside MODES too.
function checkIds(dir) {
  let text;
  try {
    text = readFileSync(join(dir, 'REQUIREMENTS.md'), 'utf8');
  } catch (err) {
    // Not --stale's leniency: an ID is never renumbered, so numbering blind past a file we couldn't read is for good.
    if (err.code !== 'ENOENT') {
      console.log(`REQUIREMENTS.md: cannot read (${err.code})`);
      return 1;
    }
    text = '';
  }
  const highest = new Map();
  for (const [, prefix, digits] of text.matchAll(PROJECT_ID)) {
    // BigInt, so GH-12 beats GH-9 and a twenty-digit number still prints as itself.
    const n = BigInt(digits);
    if (!highest.has(prefix) || n > highest.get(prefix)) highest.set(prefix, n);
  }
  const prefixes = [...highest.keys()].sort();
  console.log(prefixes.length ? prefixes.map((p) => `highest for ${p}: ${highest.get(p)}`).join('\n') : NO_IDS_LINE);
  return 0;
}

export function main(args) {
  // Only an exact token switches mode; anything else first is the directory, as before.
  // hasOwn, so a folder named "constructor" is still just a folder.
  const mode = Object.hasOwn(MODES, args[0]) ? MODES[args[0]] : null;
  const stale = args[0] === '--stale';
  const ids = args[0] === '--ids';
  const [files, ok] = mode ?? [Object.keys(CHECKS), OK_LINE];
  const dir = mode || stale || ids ? args[1] : args[0];
  if (!dir || !isDir(dir)) {
    console.error(dir ? `check: ${quote(dir)} is not a directory` : 'usage: node lib/check.mjs [--brief | --prd | --spine | --epics | --stale | --ids] <dir>');
    return 2;
  }
  if (stale) return checkStale(dir);
  if (ids) return checkIds(dir);
  const problems = checkFiles(dir, files);
  console.log(problems.length === 0 ? ok : problems.join('\n'));
  return problems.length === 0 ? 0 : 1;
}

// realpath both sides: an installed plugin path through a symlink must still run, not exit 0 silently.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
