import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = join(root, 'skills', 'seldon', 'SKILL.md');

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
});
