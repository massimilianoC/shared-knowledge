import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const kit = fileURLToPath(new URL('../../domains/llm-provider/templates/classification-benchmark-kit/', import.meta.url));
const labels = new Map([
  ['Shipping system is blocked', [3, 'support']],
  ['Order confirmation by tomorrow', [3, 'quote']],
  ['Request for quotation', [2, 'quote']],
  ['URGENT reply now', [1, 'info']],
  ['General information', [1, 'info']],
  ['Marketing services', [0, 'spam']],
  ['Thank you', [0, 'other']],
  ['Defect in batch 4471', [2, 'complaint']],
]);

function responseFor(subject, override) {
  const [originalPriority, intent] = labels.get(subject) ?? [];
  if (originalPriority === undefined) throw new Error(`Unexpected example subject: ${subject}`);
  const priority = override?.(subject, originalPriority) ?? originalPriority;
  return {
    model: 'local-contract-mock',
    answers: {
      priority: {
        type: 'score', score: priority, confidence: 0.99,
        probabilities: Object.fromEntries([0, 1, 2, 3].map((level) => [String(level), level === priority ? 0.99 : 0.0033])),
      },
      intent: { type: 'choice', choice: intent, confidence: 0.98, probabilities: { [intent]: 0.98 } },
      real_deadline: { type: 'noul', noul: originalPriority === 3 ? 0.99 : 0.01 },
    },
    usage: { input_tokens: 100, cost: 0.00001 },
  };
}

async function withProvider(handler, run) {
  const requests = [];
  const server = createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      const parsed = JSON.parse(body);
      requests.push(parsed);
      handler(parsed, response, requests.length);
    });
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  try {
    return await run(`http://127.0.0.1:${server.address().port}`, requests);
  } finally {
    await new Promise((done) => server.close(done));
  }
}

function sendJson(response, data, status = 200) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
}

async function runBenchmark(endpoint, extra = [], environment = {}, taskFile = 'task.example.mjs') {
  const args = [
    'systemone-bench.mjs', `--task=./${taskFile}`, '--data=./dataset.example.jsonl',
    `--endpoint=${endpoint}`, ...extra,
  ];
  const child = spawn(process.execPath, args, {
    cwd: kit,
    env: { ...process.env, OPENROUTER_API_KEY: 'local-test-key', ...environment },
  });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const code = await new Promise((done) => child.on('close', done));
  return { code, stdout, stderr };
}

describe('Given the portable typed-decision benchmark example', () => {
  it('When eight cases run against a local provider, Then the report and saved evidence agree', async () => {
    const output = mkdtempSync(join(tmpdir(), 'shared-knowledge-bench-'));
    try {
      await withProvider((request, response) => {
        assert.ok(request.state.item.subject);
        assert.equal(request.state.expected, undefined, 'Labels must not leak into provider state');
        assert.deepEqual(Object.keys(request.questions), ['priority', 'intent', 'real_deadline']);
        sendJson(response, responseFor(request.state.item.subject));
      }, async (endpoint, requests) => {
        const result = await runBenchmark(endpoint, ['--dump', `--out=${output}`]);
        assert.equal(result.code, 0, result.stderr);
        assert.match(result.stdout, /8\/8 calls succeeded/);
        assert.match(result.stdout, /Autonomous exact \(priority\): 6\/6/);
        assert.equal(requests.length, 8);
      });
      const raw = readFileSync(join(output, 'raw-responses.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
      const csv = readFileSync(join(output, 'outcomes.csv'), 'utf8').trim().split('\n');
      assert.equal(raw.length, 8);
      assert.equal(csv.length, 9);
      const headers = csv[0].split(',');
      const okColumn = headers.indexOf('ok_priority');
      assert.ok(okColumn >= 0);
      const independentlyCounted = csv.slice(1).filter((line) => line.split(',')[okColumn] === 'true').length;
      assert.equal(independentlyCounted, 8);
      assert.ok(raw.every((item) => JSON.parse(item.responseText).answers.priority));
    } finally {
      rmSync(output, { recursive: true, force: true });
    }
  });

  it('When a prohibited false critical decision occurs, Then the hard gate fails with its case ID', async () => {
    await withProvider((request, response) => {
      sendJson(response, responseFor(request.state.item.subject,
        (subject, priority) => subject === 'Marketing services' ? 3 : priority));
    }, async (endpoint) => {
      const result = await runBenchmark(endpoint, ['--limit=6']);
      assert.equal(result.code, 2);
      assert.match(result.stdout, /Hard error false-critical-on-low-or-medium: 1 EX06/);
      assert.match(result.stdout, /priority: exact 5\/6/);
    });
  });

  it('When a transient overload precedes a probe, Then it retries and returns one typed answer set', async () => {
    await withProvider((request, response, count) => {
      if (count === 1) return sendJson(response, { error: 'temporary overload' }, 429);
      sendJson(response, responseFor(request.state.item.subject));
    }, async (endpoint, requests) => {
      const result = await runBenchmark(endpoint, ['--probe']);
      assert.equal(result.code, 0, result.stderr);
      assert.match(result.stdout, /Probe:/);
      assert.equal(requests.length, 2);
    });
  });

  it('When the direct TypeSafe task is selected, Then it uses its own credential and model contract', async () => {
    await withProvider((request, response) => {
      assert.equal(request.model, 'jev-1.13.0');
      const result = responseFor(request.state.item.subject);
      delete result.usage.cost;
      sendJson(response, result);
    }, async (endpoint, requests) => {
      const result = await runBenchmark(endpoint, ['--limit=1'],
        { OPENROUTER_API_KEY: '', TYPESAFE_API_KEY: 'local-test-key' },
        'task.typesafe.example.mjs');
      assert.equal(result.code, 0, result.stderr);
      assert.match(result.stdout, /Reported cost: unavailable or incomplete/);
      assert.equal(requests.length, 1);
    });
  });

  it('When the credential is absent, Then it fails before making a provider call', async () => {
    const result = await runBenchmark('http://127.0.0.1:1', [], { OPENROUTER_API_KEY: '' });
    assert.equal(result.code, 1);
    assert.match(result.stderr, /Missing credential: OPENROUTER_API_KEY/);
  });
});
