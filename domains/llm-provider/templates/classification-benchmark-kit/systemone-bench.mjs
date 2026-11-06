// Portable Node 20+ benchmark for a System One style typed-decision endpoint.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (name) => {
  const value = args.find((arg) => arg === `--${name}` || arg.startsWith(`--${name}=`));
  return value === undefined ? undefined : value.includes('=') ? value.slice(value.indexOf('=') + 1) : 'true';
};
const required = (name) => {
  const value = flag(name);
  if (!value || value === 'true') throw new Error(`Missing --${name}=PATH`);
  return value;
};
const percent = (number, total) => total ? `${Math.round(100 * number / total)}%` : 'n/a';
const percentile = (values, n) => {
  if (!values.length) return 'n/a';
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(n * sorted.length) - 1)];
};
const csv = (value) => {
  const string = String(value ?? '');
  return /[",\r\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
};
const argmax = (probabilities) => Object.entries(probabilities ?? {})
  .sort((a, b) => b[1] - a[1])[0]?.[0];

function readTarget(target, answer) {
  if (answer?.type === 'choice') return { value: answer.choice, confidence: answer.confidence };
  if (answer?.type === 'score') {
    const index = Number(argmax(answer.probabilities));
    return { value: target.levels?.[index], confidence: answer.confidence };
  }
  if (answer?.type === 'noul') {
    // Derived decision certainty, not a confidence field returned by the provider.
    return { value: String(answer.noul >= 0.5), confidence: Math.abs(answer.noul - 0.5) * 2 };
  }
  return { value: undefined, confidence: undefined };
}

async function ask(task, state) {
  const key = process.env[task.apiKeyEnv];
  if (!key) throw new Error(`Missing credential: ${task.apiKeyEnv}`);
  const request = { model: flag('model') ?? task.model, state, questions: task.questions };
  for (let attempt = 0; attempt < 4; attempt++) {
    const started = Date.now();
    const response = await fetch(flag('endpoint') ?? task.endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const ms = Date.now() - started;
    const responseText = await response.text();
    if ((response.status === 429 || response.status === 529) && attempt < 3) {
      await new Promise((done) => setTimeout(done, 500 * 2 ** attempt));
      continue;
    }
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${responseText.slice(0, 300)}`);
      error.responseText = responseText;
      throw error;
    }
    const result = JSON.parse(responseText);
    if (!result.answers || typeof result.answers !== 'object') throw new Error('Response has no answers object');
    return { result, responseText, ms, request };
  }
  throw new Error('Retry limit exceeded');
}

function validateTask(task) {
  if (!task.endpoint || !task.apiKeyEnv || !task.model || !task.questions || !task.buildState) {
    throw new Error('Task needs endpoint, apiKeyEnv, model, questions, and buildState');
  }
  if (!Array.isArray(task.targets) || !task.targets.length) throw new Error('Task needs targets');
  for (const target of task.targets) {
    if (!target.key || !target.answer || !['ordinal', 'nominal'].includes(target.kind)) {
      throw new Error('Each target needs key, answer, and ordinal or nominal kind');
    }
    if (target.kind === 'ordinal' && (!Array.isArray(target.levels) || target.levels.length < 2)) {
      throw new Error(`Ordinal target ${target.key} needs ordered levels`);
    }
  }
}

function escalationReasons(task, prediction, confidence, signals) {
  const reasons = [];
  if (task.alwaysEscalate?.(prediction)) reasons.push('always');
  for (const [key, minimum] of Object.entries(task.gates ?? {})) {
    if (!Number.isFinite(confidence[key]) || confidence[key] < minimum) reasons.push(`confidence:${key}`);
  }
  for (const [key, maximum] of Object.entries(task.signalGates ?? {})) {
    if (Number.isFinite(signals[key]) && signals[key] >= maximum) reasons.push(`signal:${key}`);
  }
  return reasons;
}

async function runCase(task, record, raw) {
  const state = task.buildState(record);
  const base = { id: record.id, group: record.group ?? 'all', expected: record.expected };
  try {
    const { result, responseText, ms, request } = await ask(task, state);
    raw.push({ id: record.id, request, responseText, latency_ms: ms });
    const prediction = {};
    const confidence = {};
    for (const target of task.targets) {
      const read = readTarget(target, result.answers[target.answer]);
      if (read.value === undefined || !Number.isFinite(read.confidence)) {
        throw new Error(`Missing or invalid answer for ${target.answer}`);
      }
      prediction[target.key] = read.value;
      confidence[target.key] = read.confidence;
    }
    const signals = {};
    for (const name of task.signals ?? []) {
      const answer = result.answers[name];
      if (answer?.type === 'noul' && Number.isFinite(answer.noul)) signals[name] = answer.noul;
    }
    const hard = (task.hardErrors ?? []).filter((rule) => rule.when(prediction, record)).map((rule) => rule.name);
    return {
      ...base, ok: true, prediction, confidence, signals, hard,
      reasons: escalationReasons(task, prediction, confidence, signals),
      ms, inputTokens: result.usage?.input_tokens ?? null,
      cost: result.usage?.cost ?? null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    raw.push({ id: record.id, request_state: state, error: message, responseText: error.responseText ?? null });
    return { ...base, ok: false, error: message, prediction: {}, confidence: {}, signals: {}, hard: [], reasons: ['call-failed'], ms: null, inputTokens: null, cost: null };
  }
}

function report(task, outcomes) {
  const good = outcomes.filter((outcome) => outcome.ok);
  const failures = outcomes.filter((outcome) => !outcome.ok);
  console.log(`\n${task.name}: ${good.length}/${outcomes.length} calls succeeded`);
  for (const rule of task.hardErrors ?? []) {
    const hits = good.filter((outcome) => outcome.hard.includes(rule.name));
    console.log(`Hard error ${rule.name}: ${hits.length} ${hits.map((hit) => hit.id).join(', ')}`);
  }
  for (const target of task.targets) {
    const exact = good.filter((outcome) => outcome.prediction[target.key] === outcome.expected[target.key]);
    console.log(`\n${target.key}: exact ${exact.length}/${good.length} (${percent(exact.length, good.length)})`);
    if (target.kind === 'ordinal') {
      const adjacent = good.filter((outcome) => {
        const predicted = target.levels.indexOf(outcome.prediction[target.key]);
        const expected = target.levels.indexOf(outcome.expected[target.key]);
        return predicted >= 0 && expected >= 0 && Math.abs(predicted - expected) <= 1;
      });
      console.log(`Adjacent: ${adjacent.length}/${good.length} (${percent(adjacent.length, good.length)})`);
    }
    const labels = target.kind === 'ordinal'
      ? target.levels
      : [...new Set(good.flatMap((outcome) => [outcome.expected[target.key], outcome.prediction[target.key]]))].sort();
    console.log('Confusion (expected => predicted counts):');
    for (const expected of labels) {
      const counts = Object.fromEntries(labels.map((predicted) => [predicted,
        good.filter((outcome) => outcome.expected[target.key] === expected && outcome.prediction[target.key] === predicted).length]));
      console.log(`  ${expected}: ${JSON.stringify(counts)}`);
    }
    console.log('Calibration (confidence bucket => exact):');
    const buckets = [[0.95, 1.01], [0.9, 0.95], [0.7, 0.9], [0.5, 0.7], [0, 0.5]];
    for (const [low, high] of buckets) {
      const cases = good.filter((outcome) => outcome.confidence[target.key] >= low && outcome.confidence[target.key] < high);
      const correct = cases.filter((outcome) => outcome.prediction[target.key] === outcome.expected[target.key]).length;
      console.log(`  ${low}-${high}: n=${cases.length}, exact=${percent(correct, cases.length)}`);
    }
  }
  const escalated = good.filter((outcome) => outcome.reasons.length);
  const autonomous = good.filter((outcome) => !outcome.reasons.length);
  const first = task.targets[0].key;
  const autoCorrect = autonomous.filter((outcome) => outcome.prediction[first] === outcome.expected[first]).length;
  console.log(`\nEscalation: ${escalated.length}/${good.length} (${percent(escalated.length, good.length)})`);
  console.log(`Autonomous exact (${first}): ${autoCorrect}/${autonomous.length} (${percent(autoCorrect, autonomous.length)})`);
  const reasons = {};
  for (const outcome of escalated) for (const reason of outcome.reasons) reasons[reason] = (reasons[reason] ?? 0) + 1;
  console.log(`Escalation reasons: ${JSON.stringify(reasons)}`);
  if (task.signals?.length) {
    console.log('Diagnostic signal means by expected class:');
    const classes = [...new Set(good.map((outcome) => outcome.expected[first]))];
    for (const name of task.signals) {
      const means = Object.fromEntries(classes.map((label) => {
        const values = good.filter((outcome) => outcome.expected[first] === label && Number.isFinite(outcome.signals[name]))
          .map((outcome) => outcome.signals[name]);
        return [label, values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null];
      }));
      console.log(`  ${name}: ${JSON.stringify(means)}`);
    }
  }
  const groups = [...new Set(good.map((outcome) => outcome.group))];
  if (groups.length > 1) for (const group of groups) {
    const cases = good.filter((outcome) => outcome.group === group);
    const correct = cases.filter((outcome) => outcome.prediction[first] === outcome.expected[first]).length;
    console.log(`Group ${group}: ${correct}/${cases.length} (${percent(correct, cases.length)})`);
  }
  const latencies = good.map((outcome) => outcome.ms);
  const tokens = good.map((outcome) => outcome.inputTokens).filter(Number.isFinite);
  const costs = good.map((outcome) => outcome.cost).filter(Number.isFinite);
  console.log(`Latency ms: p50=${percentile(latencies, 0.5)}, p95=${percentile(latencies, 0.95)}`);
  console.log(`Input tokens: ${tokens.length === good.length ? tokens.reduce((a, b) => a + b, 0) : 'incomplete'}`);
  console.log(`Reported cost: ${costs.length === good.length ? costs.reduce((a, b) => a + b, 0) : 'unavailable or incomplete'}`);
  for (const failure of failures) console.log(`Call failed ${failure.id}: ${failure.error}`);
}

function dumpFiles(task, outcomes, raw, directory) {
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, 'raw-responses.jsonl'), raw.map((item) => JSON.stringify(item)).join('\n') + '\n');
  const keys = task.targets.map((target) => target.key);
  const headers = ['id', 'group', 'call_ok', ...keys.flatMap((key) => [`exp_${key}`, `got_${key}`, `ok_${key}`, `conf_${key}`]),
    ...(task.signals ?? []), 'escalated', 'reasons', 'hard', 'latency_ms', 'input_tokens', 'cost', 'error'];
  const rows = outcomes.map((outcome) => [outcome.id, outcome.group, outcome.ok,
    ...keys.flatMap((key) => [outcome.expected[key], outcome.prediction[key],
      outcome.ok ? outcome.prediction[key] === outcome.expected[key] : '', outcome.confidence[key]]),
    ...(task.signals ?? []).map((name) => outcome.signals[name]),
    outcome.reasons.length > 0, outcome.reasons.join('|'), outcome.hard.join('|'), outcome.ms,
    outcome.inputTokens, outcome.cost, outcome.error ?? ''].map(csv).join(','));
  writeFileSync(resolve(directory, 'outcomes.csv'), [headers.join(','), ...rows].join('\n') + '\n');
  console.log(`Evidence written to ${resolve(directory)}`);
}

async function main() {
  const task = (await import(pathToFileURL(resolve(required('task'))).href)).default;
  validateTask(task);
  if (!process.env[task.apiKeyEnv]) throw new Error(`Missing credential: ${task.apiKeyEnv}`);
  const records = readFileSync(resolve(required('data')), 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const limit = flag('limit') === undefined ? records.length : Number(flag('limit'));
  if (!Number.isInteger(limit) || limit < 1 || !records.length) throw new Error('Dataset is empty or --limit is invalid');
  const selected = records.slice(0, limit);
  for (const record of selected) {
    if (!record.id || !record.expected || typeof record.expected !== 'object') throw new Error('Each record needs id and expected');
  }
  if (flag('probe') !== undefined) {
    const { result, responseText, ms } = await ask(task, task.buildState(selected[0]));
    console.log(`Probe: ${ms} ms, model=${result.model ?? 'unknown'}`);
    console.log(responseText);
    return;
  }
  const raw = [];
  const outcomes = [];
  for (const record of selected) {
    const outcome = await runCase(task, record, raw);
    outcomes.push(outcome);
    console.log(`${record.id}: ${outcome.ok ? JSON.stringify(outcome.prediction) : outcome.error}`);
  }
  report(task, outcomes);
  if (flag('dump') !== undefined) dumpFiles(task, outcomes, raw, flag('out') ?? './reports/systemone-bench');
  if (outcomes.some((outcome) => !outcome.ok || outcome.hard.length)) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
