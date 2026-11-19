import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, dependencies = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  }).outputText, {exports, require: name => dependencies[name]});
  return exports;
}
const data = load('lib/myfriend-onboarding.ts');
const content = load('lib/myfriend-onboarding-content.ts');
const {onboardingExamples} = load('lib/myfriend-onboarding-examples.ts', {'./myfriend-onboarding-content': content});

test('examples prioritize each selected goal and preserve correct pronouns', () => {
  for (const relationship of data.RELATIONSHIP_OPTIONS.map(option => option.value)) {
    for (const goal of data.GOAL_OPTIONS.map(option => option.value)) {
      const cards = onboardingExamples({...data.EMPTY_ONBOARDING_ANSWERS, relationship, goals:[goal], cadence:'inbound-only'});
      assert.equal(cards.length, 6);
      assert.equal(cards[0].id, goal);
      const text = cards.map(card => card.text).join(' ');
      assert.doesNotMatch(text, /\{\w+\}|they wants|they has|they feels|never forgot|know .* safe/);
      assert.ok(cards.find(card => card.id === 'checkins').text.includes('If you set them up later'));
      for (const card of cards) assert.ok(fs.existsSync(`public/images/robo-companion/figma-refresh/avatars/${card.portrait}.png`));
    }
  }
});
test('reminders and family examples follow the actual choices', () => {
  const cards = onboardingExamples({...data.EMPTY_ONBOARDING_ANSWERS, relationship:'dad', habits:['medication'], distance:'together', cadence:'daily'});
  assert.ok(cards.find(card => card.id === 'reminders').text.includes('his pills'));
  assert.ok(cards.find(card => card.id === 'family-contact').text.includes('sit down with him'));
  assert.ok(cards.find(card => card.id === 'checkins').text.includes('After a check-in call'));
});
