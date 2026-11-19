import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports });
  return exports;
}
const data = load('lib/myfriend-onboarding.ts');
const content = load('lib/myfriend-onboarding-content.ts');
test('reports match each call frequency and only include selected medication updates', () => {
  for (const [cadence, phrase] of [['multiple-daily', 'multiple times per day'], ['daily', 'every day'], ['few-weekly', 'a few times each week'], ['inbound-only', 'No check-ins for now']]) {
    for (const habits of [[], ['none'], ['appointments'], ['medication']]) {
      const answers = {...data.EMPTY_ONBOARDING_ANSWERS, relationship: 'grandfather', cadence, habits};
      const body = content.onboardingCopy(answers).reports.body;
      assert.ok(body.includes(phrase));
      assert.equal(body.includes('medications'), cadence !== 'inbound-only' && habits.includes('medication'));
      assert.equal(body.includes('doesn’t reach'), cadence !== 'inbound-only');
      if (cadence === 'inbound-only') {
        assert.doesNotMatch(body, /every day|each week|times per day|After each call/);
        assert.ok(body.includes('If you set them up later, MyFriend will call grandpa to check in'));
      }
    }
  }
});
const cases = [
  ['mom', 'mom', 'she', 'her', 'her', 'she’s', 'needs'],
  ['dad', 'dad', 'he', 'him', 'his', 'he’s', 'needs'],
  ['grandmother', 'grandma', 'she', 'her', 'her', 'she’s', 'needs'],
  ['grandfather', 'grandpa', 'he', 'him', 'his', 'he’s', 'needs'],
  ['partner', 'your partner', 'they', 'them', 'their', 'they’re', 'need'],
  ['someone-else', 'your loved one', 'they', 'them', 'their', 'they’re', 'need'],
];
for (const [relationship, person, subject, object, possessive, subjectBe, need] of cases) {
  test(`${relationship}: options and all screen copy agree with the relationship`, () => {
    const answers = { ...data.EMPTY_ONBOARDING_ANSWERS, relationship };
    const text = value => content.personalizeOnboardingText(value, answers);
    const goals = data.GOAL_OPTIONS.map(option => text(option.label));
    assert.equal(goals[0], `Give ${object} a companion ${subject} can call 24/7`);
    assert.equal(goals[1], `Help ${object} stay more independent`);
    assert.equal(goals[2], `Remind ${object} of important stuff like taking medications`);
    assert.equal(goals[3], `Check up on ${object} every day so you know ${subjectBe} okay`);
    assert.equal(goals[4], `Encourage me to call / message / visit ${object} more`);
    const copy = content.onboardingCopy(answers);
    assert.equal(copy.reminders.title, `MyFriend can call ${object} any time ${subject} ${need}.`);
    assert.ok(copy.reports.body.includes(`how ${subjectBe} doing`));
    assert.ok(!copy.reports.body.includes('medications'));
    assert.equal(text(data.CADENCE_OPTIONS[3].label), 'skip');
    assert.equal(text(data.TECHNOLOGY_OPTIONS[0].label), `${subject[0].toUpperCase() + subject.slice(1)} mostly ${subject === 'they' ? 'avoid' : 'avoids'} it`);
    const rendered = [
      ...Object.values(copy).flatMap(Object.values), ...goals,
      ...data.TECHNOLOGY_OPTIONS.map(option => text(option.label)),
      ...data.CADENCE_OPTIONS.map(option => text(option.label)),
      ...Object.values(content.CAPABILITY_COPY).map(text), ...content.selectedPlanCopy(answers),
    ].join('\n');
    assert.doesNotMatch(rendered, /\{\w+\}/);
    if (subject !== 'she') assert.doesNotMatch(rendered, /\b(she|her|grandma)\b/);
    if (subject === 'they') assert.doesNotMatch(rendered, /\bthey (needs|wants|chooses|avoids|uses|agrees)\b/);
    assert.ok(copy.pricing.body.includes(`your ${content.RELATIONSHIP_NOUNS[relationship]}`));
  });
}

test('setup recap follows selected goals, frequency, reminders and technology', () => {
  for (const [relationship, , subject, object] of cases) {
    for (let mask = 0; mask < 32; mask++) {
      const goals = data.GOAL_OPTIONS.filter((_, i) => mask & (1 << i)).map(option => option.value);
      for (const cadence of ['daily', 'multiple-daily', 'few-weekly', 'inbound-only']) {
        const answers = {...data.EMPTY_ONBOARDING_ANSWERS, relationship, goals, cadence, habits: ['none'], technology: 'ai'};
        const text = content.selectedPlanCopy(answers).join('\n');
        assert.equal(text.includes('A companion'), goals.includes('conversation'));
        assert.equal(text.includes('everyday problems'), goals.includes('questions'));
        assert.equal(text.includes('visit'), goals.includes('family-contact'));
        assert.equal(text.includes('Check-in calls'), cadence !== 'inbound-only');
        assert.equal(text.includes('can’t reach'), cadence !== 'inbound-only');
        assert.equal(text.includes('A short update'), cadence !== 'inbound-only' || goals.includes('checkins'));
        assert.doesNotMatch(text, /medications|Reminders for appointments|\{\w+\}/);
        assert.ok(text.includes(`AI ${subject} can use`));
        if (cadence === 'inbound-only') assert.doesNotMatch(text, /No regular check-in calls/);
        if (cadence === 'few-weekly') assert.ok(text.includes('a few times each week'));
      }
    }
  }
  const answers = {...data.EMPTY_ONBOARDING_ANSWERS, relationship: 'grandfather', cadence: 'few-weekly', goals: ['family-contact'], distance: 'together', technology: 'avoids', habits: ['medication', 'appointments']};
  const text = content.selectedPlanCopy(answers).join('\n');
  assert.ok(text.includes('Reminders for medications and appointments and plans'));
  assert.ok(text.includes('whether he said he took his medications'));
  assert.ok(text.includes('spend time with him yourself'));
  assert.ok(text.includes('no app or new technology to learn'));
  assert.doesNotMatch(text, /visit|daily routines/);
});

test('unknown relationship uses neutral pronouns and source options remain reusable', () => {
  assert.equal(content.personalizeOnboardingText('Call {object} about {possessive} day.', { relationship: '' }), 'Call them about their day.');
  assert.equal(data.GOAL_OPTIONS[0].value, 'conversation');
  assert.ok(data.GOAL_OPTIONS[0].label.includes('{object}'));
});

for (const [relationship, , subject, object, possessive] of cases) {
  test(`${relationship}: capability cards follow selected goals in screen order`, () => {
    // Cover every combination, including deselection and an empty saved selection.
    for (let mask = 0; mask < 32; mask++) {
      const goals = data.GOAL_OPTIONS.filter((_, index) => mask & (1 << index)).map(option => option.value);
      const answers = { ...data.EMPTY_ONBOARDING_ANSWERS, relationship, goals: [...goals].reverse() };
      const cards = content.selectedCapabilityCopy(answers);
      assert.equal(cards.length, goals.length);
      goals.forEach((goal, index) => assert.equal(cards[index], content.personalizeOnboardingText(content.CAPABILITY_COPY[goal], answers)));
      if (goals.includes('reminders')) assert.ok(cards.includes(`Call ${object} to remind ${object} to take ${possessive} medications so ${subject} never ${subject === 'they' ? 'forget' : 'forgets'}`));
      if (goals.includes('family-contact')) assert.ok(cards.includes(`Keep you accountable on keeping in touch with ${object} yourself`));
    }
  });
}

for (const [relationship, , subject] of cases) {
  test(`${relationship}: technology response follows the answer and uses correct pronouns`, () => {
    const titles = new Set();
    for (const technology of ['ai', 'avoids', 'web', 'unsure']) {
      const answers = { ...data.EMPTY_ONBOARDING_ANSWERS, relationship, technology };
      const result = content.onboardingCopy(answers)['technology-response'];
      titles.add(result.title);
      assert.equal(result.action, 'Continue');
      assert.match(result.body, /phone number/);
      assert.match(result.body, /internet connection needed/);
      assert.doesNotMatch(result.title + result.body, /\{\w+\}|\bthey (calls|talks|uses)\b/);
      if (subject !== 'she') assert.doesNotMatch(result.title + result.body, /\b(she|her)\b/i);
      if (technology === 'ai') assert.equal(result.title, `AI ${subject} can talk to over the phone.`);
      if (technology === 'avoids') assert.equal(result.title, 'No new technology to learn.');
      if (technology === 'web') assert.equal(result.title, `Use the phone ${subject} already ${subject === 'they' ? 'use' : 'uses'}.`);
    }
    assert.equal(titles.size, 4);
    const answers = { ...data.EMPTY_ONBOARDING_ANSWERS, relationship };
    assert.equal(content.technologyResponseCopy(answers).title, 'MyFriend is a simple phone call.');
  });
}
