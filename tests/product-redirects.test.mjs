import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { NextRequest } from 'next/server.js';
const require = createRequire(import.meta.url);
function load(file) {
  const exports = {};
  const resolve = name => name.startsWith('.') ? load(path.resolve(path.dirname(file), name + '.ts')) : name.startsWith('@/') ? load(path.resolve(name.slice(2) + '.ts')) : require(name);
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { exports, require: resolve, Response, Request, URL, process, console });
  return exports;
}
const { middleware } = load(path.resolve('middleware.ts'));
const go = (p) => middleware(new NextRequest('https://growbyte.co' + p, { headers: { host: 'growbyte.co' } }));
for (const [from, to, status] of [
  ['/myfriend', 'https://trymyfriend.com/', 301],
  ['/myfriend/more', 'https://trymyfriend.com/more', 301],
  ['/myfriend/login?x=1', 'https://trymyfriend.com/login?x=1', 301],
  ['/myfriend/privacy', 'https://trymyfriend.com/myfriend/privacy', 301],
  ['/digipritel', 'https://digipritel.cz/', 301],
  ['/digipritel/events', 'https://digipritel.cz/udalosti', 301],
  ['/digipritel/dashboard', 'https://digipritel.cz/dashboard', 301],
  ['/start', 'https://digipritel.cz/start', 301],
  ['/myfriend-jp/more', 'https://myfriend.jp/more', 301],
  ['/api/myfriend/stripe/webhook', 'https://trymyfriend.com/api/myfriend/stripe/webhook', 308],
]) test(`${from} -> ${to}`, () => { const r = go(from); assert.equal(r.status, status); assert.equal(r.headers.get('location'), to); });
for (const p of ['/', '/en', '/solutions/en', '/digipriatel', '/lets-talk']) test(`${p} is served by GrowByte`, () => assert.equal(go(p).headers.get('location'), null));
