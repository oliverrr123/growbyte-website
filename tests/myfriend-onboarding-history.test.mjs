import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, dependencies = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, require: name => dependencies[name] });
  return exports;
}
const onboarding = load('lib/myfriend-onboarding.ts');
const { readFunnelHistory, writeFunnelHistory, initializeFunnelHistory } = load(
  'lib/myfriend-onboarding-history.ts', { './myfriend-onboarding': onboarding },
);
function browserHistory() {
  const entries = [{ state: { __NA: true, tree: 'router-state' }, url: '/onboarding' }];
  let index = 0;
  return {
    get state() { return entries[index].state; },
    get length() { return entries.length; },
    get url() { return entries[index].url; },
    pushState(state, _, url) { entries.splice(index + 1); entries.push({ state, url: url ?? entries[index].url }); index++; },
    replaceState(state, _, url) { entries[index] = { state, url: url ?? entries[index].url }; },
    back() { if (index > 0) index--; },
    forward() { if (index < entries.length - 1) index++; },
  };
}

test('fresh entry, native back/forward, and reload retain the right step without duplicates', () => {
  const history = browserHistory();
  initializeFunnelHistory(history, onboarding.FUNNEL_STEPS, 'intro', '/onboarding');
  assert.equal(history.length, 1);
  writeFunnelHistory(history, 'relationship', 'push');
  writeFunnelHistory(history, 'goals', 'push');
  history.back();
  assert.equal(readFunnelHistory(history.state).step, 'relationship');
  initializeFunnelHistory(history, onboarding.FUNNEL_STEPS, 'relationship', '/onboarding');
  assert.equal(history.length, 3);
  assert.equal(history.state.tree, 'router-state');
  history.forward();
  assert.equal(readFunnelHistory(history.state).step, 'goals');
});

test('restored draft creates back history and omits skipped contact steps and completed loader', () => {
  const history = browserHistory();
  const steps = onboarding.onboardingSteps({ ...onboarding.EMPTY_ONBOARDING_ANSWERS, distance: 'together' });
  initializeFunnelHistory(history, steps, 'pricing', '/onboarding');
  const visited = [];
  do {
    visited.push(readFunnelHistory(history.state).step);
    if (readFunnelHistory(history.state).index === 0) break;
    history.back();
  } while (true);
  assert.equal(visited[0], 'pricing');
  assert.equal(visited.at(-1), 'intro');
  for (const omitted of ['remote-contact', 'physical-contact', 'building']) assert.ok(!visited.includes(omitted));
});

test('completed loader is replaced so Back from plan reaches reports', () => {
  const history = browserHistory();
  initializeFunnelHistory(history, onboarding.FUNNEL_STEPS, 'reports', '/onboarding');
  writeFunnelHistory(history, 'building', 'push');
  writeFunnelHistory(history, 'plan', 'replace');
  history.back();
  assert.equal(readFunnelHistory(history.state).step, 'reports');
});

test('a changed answer replaces the forward branch instead of retaining skipped questions', () => {
  const history = browserHistory();
  initializeFunnelHistory(history, onboarding.FUNNEL_STEPS, 'distance', '/onboarding');
  writeFunnelHistory(history, 'remote-contact', 'push');
  history.back();
  writeFunnelHistory(history, 'reflection', 'push');
  history.back();
  history.forward();
  assert.equal(readFunnelHistory(history.state).step, 'reflection');
});

test('unrelated or malformed browser entries are ignored', () => {
  for (const state of [null, {}, { myfriendOnboarding: { step: 'unknown', index: 1 } }, { myfriendOnboarding: { step: 'intro', index: -1 } }]) {
    assert.equal(readFunnelHistory(state), null);
  }
});
