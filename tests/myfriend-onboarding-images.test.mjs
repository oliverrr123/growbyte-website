import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const exports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/myfriend-onboarding-images.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports });
for (const relationship of ['mom', 'dad', 'grandmother', 'grandfather', 'partner', 'someone-else', '']) {
  test(`${relationship || 'unselected'}: all illustration scenes use the correct variant and real assets`, () => {
    for (const scene of ['intro', 'reflection', 'technology', 'reminders', 'reports', 'thankYou']) {
      const image = exports.onboardingImage(scene, relationship);
      const male = scene !== 'intro' && (relationship === 'dad' || relationship === 'grandfather');
      assert.equal(image.src.includes('-male'), male);
      assert.ok(image.alt.includes(male ? 'man' : 'woman'));
      assert.ok(fs.existsSync('public' + image.src), image.src);
      assert.ok(image.width > image.height);
    }
  });
}
