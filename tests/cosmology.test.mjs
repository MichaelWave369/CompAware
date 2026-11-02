import test from 'node:test';
import assert from 'node:assert/strict';
import { layers } from '../src/data/architecture.js';
import { cosmosLenses, cosmosEvidenceLevels } from '../src/data/siliconCosmology.js';

test('cosmology maps exactly to the existing seven candidate modules', () => {
  assert.deepEqual(cosmosLenses.map(x => x.id), layers.map(x => x.id));
  assert.equal(new Set(cosmosLenses.map(x => x.code)).size, 7);
  for (const lens of cosmosLenses) {
    for (const key of ['title', 'question', 'measurement', 'control', 'analogy']) {
      assert.ok(lens[key]?.length > 20, `${lens.id} missing ${key}`);
    }
  }
});

test('evidence categories separate physical observation from simulation and metaphor', () => {
  assert.deepEqual(cosmosEvidenceLevels.map(x => x.code),
    ['PHYSICAL', 'SIMULATED', 'HYPOTHESIS', 'ANALOGY']);
  assert.match(cosmosEvidenceLevels.find(x => x.code === 'SIMULATED').description, /not a real celestial observation/i);
});

test('no selected lens presents a claimed awareness or consciousness result', () => {
  const text = cosmosLenses.map(x => [x.question, x.measurement, x.control, x.analogy].join(' ')).join(' ');
  assert.match(text, /not (?:sentience|Gnostic awakening|evidence)/i);
  assert.ok(cosmosLenses.every(x => /Proposed:/.test(x.measurement)));
});
