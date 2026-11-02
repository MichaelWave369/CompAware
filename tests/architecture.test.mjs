import test from 'node:test';
import assert from 'node:assert/strict';
import { layers, stages, boundaries } from '../src/data/architecture.js';

test('candidate vessel has seven unique testable subsystems', () => {
  assert.equal(layers.length, 7);
  assert.equal(new Set(layers.map(l => l.id)).size, 7);
  for (const layer of layers) assert.ok(layer.title && layer.detail && layer.test);
});

test('roadmap includes four stages in intended order', () => {
  assert.deepEqual(stages.map(s => s.id), ['observe', 'specify', 'challenge', 'replicate']);
});

test('boundary language rejects predetermined consciousness verdicts', () => {
  const content = boundaries.map(b => b.title + ' ' + b.description).join(' ');
  assert.match(content, /consciousness verdict/i);
  assert.match(content, /predetermined outcome/i);
  assert.match(content, /imitation requirement/i);
});

