import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readme = readFileSync(join(root, 'README.md'), 'utf8');

// From "## Evals" up to the next "## ", so another section's bullets never count as cases.
function evalsSection(text) {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.trimEnd() === '## Evals');
  if (start === -1) return null;
  const end = lines.findIndex((line, i) => i > start && line.startsWith('## '));
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n');
}

// --case and --tag pick cases; --eval-dir swaps the folder they come from. Any of them and it's no longer the whole suite.
const FILTER = /(?:^|\s)(--case|--tag|--eval-dir)(?=[\s=]|$)/g;

// A trailing \ carries the command onto the next line, so a filter there is still part of it.
function evalCommands(section) {
  const lines = section.split('\n');
  return lines.flatMap((line, i) => {
    if (!line.trimStart().startsWith('claude plugin eval')) return [];
    let end = i;
    while (lines[end].trimEnd().endsWith('\\') && end + 1 < lines.length) end++;
    return [lines.slice(i, end + 1).join('\n')];
  });
}

function commandProblems(section) {
  const commands = evalCommands(section);
  if (commands.length !== 1) return [`expected one claude plugin eval line, found ${commands.length}`];
  return [...commands[0].matchAll(FILTER)].map((m) => `the eval command carries ${m[1]}, so it doesn't run every case`);
}

function caseNames(section) {
  return section.split('\n').flatMap((line) => line.match(/^- `([^`]+)`/)?.slice(1) ?? []);
}

function listProblems(names, folders) {
  const problems = [];
  const seen = new Set();
  for (const name of names) {
    if (seen.has(name)) problems.push(`${name}: listed more than once`);
    seen.add(name);
    if (!folders.includes(name)) problems.push(`${name}: listed in the README but has no folder under evals/`);
  }
  for (const folder of folders) if (!seen.has(folder)) problems.push(`${folder}: a folder under evals/ the README doesn't list`);
  return problems;
}

// The runner globs <eval dir>/**/case.yaml and prompt.md, so one below a case folder would run without a bullet.
function nestedCaseFiles(paths) {
  return paths
    .map((path) => path.split('/'))
    .filter((parts) => parts.length > 2 && parts[0] !== 'results' && ['case.yaml', 'prompt.md'].includes(parts.at(-1)))
    .map((parts) => `evals/${parts.join('/')}: a case file below a case folder, which the README's list can't name`);
}

// experimental.evals moves the eval dir off evals/, and then the folders compared here aren't the ones that run.
function manifestProblems(text) {
  return JSON.parse(text).experimental?.evals === undefined
    ? []
    : ['.claude-plugin/plugin.json sets experimental.evals, so the cases may not come from evals/'];
}

// results/ is run output git ignores, not a case.
const folders = readdirSync(join(root, 'evals'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'results')
  .map((entry) => entry.name);
const evalPaths = readdirSync(join(root, 'evals'), { recursive: true }).map((path) => String(path).split(sep).join('/'));
const manifest = readFileSync(join(root, '.claude-plugin', 'plugin.json'), 'utf8');
const section = evalsSection(readme);

test("the README's eval command carries no case filter", () => {
  assert.ok(section, 'README.md has no ## Evals section');
  assert.deepEqual(commandProblems(section), []);
});

test("the README's case list matches the case folders under evals/, name for name", (t) => {
  const names = caseNames(section);
  t.diagnostic(`${names.length} listed, ${folders.length} folders`);
  assert.deepEqual(listProblems(names, folders), []);
  assert.deepEqual([...names].sort(), [...folders].sort());
  assert.ok(folders.length > 0, 'found no case folders under evals/');
});

test('a case filter on the command is flagged by name', () => {
  const real = readme.match(/^claude plugin eval .*$/m)[0];
  const planted = [
    ['--case fast-path', '--case'],
    ['--case=fast-path', '--case'],
    ['--tag spine', '--tag'],
    ['--tag=spine', '--tag'],
    ['--eval-dir other', '--eval-dir'],
  ];
  for (const [extra, flag] of planted) {
    const text = readme.replace(real, `${real} ${extra}`);
    assert.deepEqual(commandProblems(evalsSection(text)), [`the eval command carries ${flag}, so it doesn't run every case`], extra);
  }
  const wrapped = readme.replace(real, `${real} \\\n  --case fast-path`);
  assert.deepEqual(commandProblems(evalsSection(wrapped)), ["the eval command carries --case, so it doesn't run every case"], 'wrapped');
});

test('a missing, invented or repeated case name is flagged by name', () => {
  const names = caseNames(section);
  assert.deepEqual(listProblems(names.filter((name) => name !== 'replay'), folders), [
    "replay: a folder under evals/ the README doesn't list",
  ]);
  assert.deepEqual(listProblems([...names, 'made-up-case'], folders), [
    'made-up-case: listed in the README but has no folder under evals/',
  ]);
  assert.deepEqual(listProblems([...names, 'fast-path'], folders), ['fast-path: listed more than once']);
});

test('the runner finds its cases in the top-level folders of evals/ and nowhere else', () => {
  assert.deepEqual(nestedCaseFiles(evalPaths), []);
  assert.deepEqual(manifestProblems(manifest), []);
});

test('a case file below a case folder, or a manifest eval dir, is flagged by name', () => {
  assert.deepEqual(nestedCaseFiles([...evalPaths, 'fast-path/sub/case.yaml', 'results/run/fast-path/prompt.md']), [
    "evals/fast-path/sub/case.yaml: a case file below a case folder, which the README's list can't name",
  ]);
  const moved = JSON.stringify({ ...JSON.parse(manifest), experimental: { evals: 'other' } });
  assert.deepEqual(manifestProblems(moved), [
    '.claude-plugin/plugin.json sets experimental.evals, so the cases may not come from evals/',
  ]);
});
