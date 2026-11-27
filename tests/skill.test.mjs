import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = join(root, 'skills', 'seldon', 'SKILL.md');
const agentPath = join(root, 'agents', 'readiness.md');

// D-02's grant, in full. Anything that writes and isn't on this list is a security change, not a tidy-up.
const GRANT = [
  'Read',
  'Glob',
  'Grep',
  'Edit(.planning/seldon/**)',
  'Bash(node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs:*)',
];

function readSkill() {
  const text = readFileSync(skillPath, 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  assert.equal(lines[0], '---', 'SKILL.md does not open with frontmatter');
  const end = lines.indexOf('---', 1);
  assert.ok(end > 0, 'SKILL.md frontmatter is never closed');
  return { front: lines.slice(1, end), body: lines.slice(end + 1).join('\n') };
}

// Reads the block-list form only; an inline or flow value is a form this refuses to guess at.
function allowedTools(front) {
  const at = front.findIndex((line) => /^allowed-tools:/.test(line));
  assert.ok(at !== -1, 'SKILL.md frontmatter has no allowed-tools field');
  const rest = front[at].slice('allowed-tools:'.length).trim();
  assert.equal(rest, '', `allowed-tools is not a block list, one entry per line: ${rest}`);
  const entries = [];
  for (const line of front.slice(at + 1)) {
    if (!/^\s/.test(line)) break;
    const item = /^\s+-\s+(.+?)\s*$/.exec(line);
    assert.ok(item, `allowed-tools has a line that isn't a list entry: ${line.trim()}`);
    entries.push(item[1]);
  }
  assert.ok(entries.length > 0, 'allowed-tools is empty');
  return entries;
}

test('allowed-tools grants exactly D-02\'s five entries', () => {
  const entries = allowedTools(readSkill().front);
  for (const entry of entries) {
    assert.ok(GRANT.includes(entry), `allowed-tools grants an entry D-02 doesn't: ${entry}`);
  }
  for (const entry of GRANT) {
    assert.ok(entries.includes(entry), `allowed-tools is missing D-02's entry: ${entry}`);
  }
});

// The skill's grant doesn't limit which agent it starts, so the agent's own frontmatter is the only thing keeping it to Read.
test('the readiness agent gets Read and nothing that writes or runs a command', () => {
  const lines = readFileSync(agentPath, 'utf8').replace(/\r\n/g, '\n').split('\n');
  assert.equal(lines[0], '---', 'agents/readiness.md does not open with frontmatter');
  const end = lines.indexOf('---', 1);
  assert.ok(end > 0, 'agents/readiness.md frontmatter is never closed');
  const front = lines.slice(1, end);
  const field = (name) => {
    const found = front.filter((line) => line.startsWith(`${name}:`));
    assert.equal(found.length, 1, `agents/readiness.md has ${found.length} ${name} lines, not 1`);
    return found[0].slice(name.length + 1).trim();
  };
  assert.equal(field('tools'), 'Read', 'the readiness agent\'s tools are not exactly Read');
  assert.equal(field('disallowedTools'), 'Write, Edit, Bash', 'the readiness agent\'s disallowedTools are not exactly Write, Edit, Bash');
});

// If the body's command drifts from the grant, the check prompts or gets refused mid-run.
test('every check command in the body starts with the Bash rule\'s command', () => {
  const { front, body } = readSkill();
  const rule = allowedTools(front).find((entry) => entry.startsWith('Bash('));
  assert.ok(rule?.endsWith(':*)'), `the Bash rule isn't a prefix rule: ${rule}`);
  const prefix = rule.slice('Bash('.length, -':*)'.length);
  for (const [command] of body.matchAll(/node\s+\S*lib\/check\.mjs/g)) {
    assert.equal(command, prefix, `the body runs the check without the plugin root: ${command}`);
  }
  assert.ok(body.includes(`${prefix} --brief .planning/seldon`), `the body never runs: ${prefix} --brief .planning/seldon`);
  // The project's folder, not the design's: the IDs live in Cadence's file, whichever design is open.
  assert.ok(body.split('\n').includes(`${prefix} --ids .planning`), `no body line is exactly: ${prefix} --ids .planning`);
  // Which Cadence path is the script's answer, so a step never decides it by looking for a file itself.
  assert.ok(body.split('\n').includes(`${prefix} --cadence .planning`), `no body line is exactly: ${prefix} --cadence .planning`);
  // Any mention, however it's worded, is a step looking for the old path's file instead of asking the check.
  assert.ok(!body.includes('PROJECT.md'), 'the skill still names PROJECT.md, so a step may decide the path by looking for it');
});

// Each answer of the path check gets its own command, so a new-path project is never sent to /cad-phase add.
test('the handoff gives each Cadence path its command, and a new project both, the new path first', () => {
  const { body } = readSkill();
  const start = body.indexOf('\n## 23. The handoff\n');
  assert.ok(start !== -1, 'SKILL.md has no "## 23. The handoff" heading');
  const end = body.indexOf('\n## ', start + 1);
  const section = body.slice(start, end === -1 ? undefined : end);
  const arm = (answer) => {
    const at = section.indexOf(`- **\`${answer}\`:**`);
    assert.ok(at !== -1, `the handoff has no arm for ${answer}`);
    const next = section.indexOf('\n- **', at + 1);
    return section.slice(at, next === -1 ? undefined : next);
  };
  const commands = (text) => [...text.matchAll(/^ {2}(\/cad-[a-z-]+(?: add)? --brief \.planning\/seldon)$/gm)].map((m) => m[1]);
  const built = /^ {2}If Cadence has already built this design, there's nothing to hand off\.$/m;
  assert.deepEqual(commands(arm('cadence: agile')), ['/cad-agile --brief .planning/seldon']);
  assert.match(arm('cadence: agile'), built);
  assert.deepEqual(commands(arm('cadence: old')), ['/cad-phase add --brief .planning/seldon']);
  assert.match(arm('cadence: old'), built);
  assert.deepEqual(commands(arm('cadence: none')), ['/cad-agile --brief .planning/seldon', '/cad-new-project --brief .planning/seldon']);
  assert.doesNotMatch(arm('cadence: none'), built);
});

// The loader pastes this run's arguments over every token, so one in prose reads "look at ``" on a bare /seldon.
test('$ARGUMENTS appears once, on its own line inside the seldon-arguments markers', () => {
  const text = readFileSync(skillPath, 'utf8').replace(/\r\n/g, '\n');
  assert.equal(text.split('$ARGUMENTS').length - 1, 1, 'SKILL.md holds $ARGUMENTS other than exactly once');
  const lines = text.split('\n');
  const at = lines.findIndex((line) => line.includes('$ARGUMENTS'));
  assert.equal(lines[at], '$ARGUMENTS', `$ARGUMENTS shares its line with other text: ${lines[at]}`);
  assert.equal(lines[at - 1], '<seldon-arguments>', 'the line before $ARGUMENTS is not <seldon-arguments>');
  assert.equal(lines[at + 1], '</seldon-arguments>', 'the line after $ARGUMENTS is not </seldon-arguments>');
  // The prose says "the block above", so the block has to stay where that prose can see it.
  const heading = lines.indexOf('## 1. Where the conversation stands');
  const look = lines.findIndex((line) => line.startsWith('Before anything else, look at this run\'s arguments'));
  assert.ok(heading !== -1, 'SKILL.md has no "## 1. Where the conversation stands" heading');
  assert.ok(look !== -1, 'SKILL.md has no line starting "Before anything else, look at this run\'s arguments"');
  assert.ok(heading < at - 1, 'the <seldon-arguments> block sits before section 1\'s heading');
  assert.ok(at - 1 < look, 'the <seldon-arguments> block sits after "Before anything else, look at this run\'s arguments"');
});
