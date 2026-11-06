import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const domains = join(root, 'domains');
const catalog = JSON.parse(readFileSync(join(root, 'validation/examples.json'), 'utf8'));
const posix = (path) => relative(root, path).split(sep).join('/');
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});
const packageDirs = readdirSync(domains, { withFileTypes: true })
  .filter((entry) => entry.isDirectory()).map((entry) => join(domains, entry.name));
const templateDirs = [join(root, 'templates'), ...packageDirs.map((path) => join(path, 'templates'))]
  .filter(existsSync);
const templates = templateDirs.flatMap(walk);
const docs = packageDirs.flatMap(walk).filter((path) => path.endsWith('.md'));
const runnableSuffixes = ['.mjs', '.js', '.ts', '.jsonl', '.json', '.py', '.sh'];

function readUtf8(path) {
  return new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(path));
}

function withoutFences(markdown) {
  return markdown.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
}

function hasBalancedFences(markdown) {
  let opened = null;
  for (const line of markdown.split(/\r?\n/)) {
    const marker = /^(?<fence>`{3,}|~{3,})(?<rest>.*)$/.exec(line);
    if (!marker) continue;
    if (!opened) {
      opened = marker.groups.fence;
    } else if (marker.groups.fence[0] === opened[0]
      && marker.groups.fence.length >= opened.length
      && marker.groups.rest.trim() === '') {
      opened = null;
    }
  }
  return opened === null;
}

function materialize(directory, assembled = new Map()) {
  for (const path of walk(directory)) {
    if (!path.endsWith('.template') && !path.endsWith('.md')) continue;
    if (path.endsWith('README.md') && dirname(path) === directory) continue; // Copy instructions, not project output.
    const target = relative(directory, path).split(sep).join('/').replace(/\.template$/, '');
    const content = readUtf8(path).replace(/\$\{([A-Z_][A-Z0-9_]*)\}/g,
      (_, name) => `example-${name.toLowerCase().replaceAll('_', '-')}`);
    assembled.set(target, content);
  }
  return assembled;
}

function checkMaterializedLinks(name, files) {
  assert.ok(files.size > 0, `Empty template composition: ${name}`);
  for (const [file, body] of files) {
    assert.doesNotMatch(body, /\$\{[A-Z_][A-Z0-9_]*\}/, `Unfilled placeholder: ${name}/${file}`);
    for (const match of withoutFences(body).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const href = match[1].trim().replace(/^<|>$/g, '').split('#')[0];
      if (!href || /^(?:[a-z]+:|\/)/i.test(href)) continue;
      const target = join(dirname(file), decodeURIComponent(href)).split(sep).join('/');
      const exists = href.endsWith('/')
        ? [...files.keys()].some((key) => key.startsWith(target.endsWith('/') ? target : `${target}/`))
        : files.has(target);
      assert.ok(exists, `Broken materialized link: ${name}/${file} -> ${href}`);
    }
  }
}

describe('Given copyable packages and an example catalog', () => {
  it('registers every runnable template file with an existing behavior test', () => {
    assert.equal(catalog.schemaVersion, 1);
    const registered = catalog.runnable.flatMap((item) => item.files);
    assert.equal(new Set(registered).size, registered.length, 'Runnable files must have one owner');
    const discovered = templates.filter((path) => runnableSuffixes.some((suffix) => path.endsWith(suffix)))
      .map(posix).sort();
    assert.deepEqual(registered.toSorted(), discovered);
    for (const item of catalog.runnable) {
      assert.ok(item.id && item.entry && item.test);
      assert.ok(item.files.includes(item.entry));
      assert.ok(existsSync(join(root, item.test)), `Missing test: ${item.test}`);
      for (const file of item.files) assert.ok(existsSync(join(root, file)), `Missing example: ${file}`);
    }
  });

  it('discovers every documentary template and checks readable content', () => {
    assert.ok(templates.length > 0);
    for (const path of templates) {
      const suffix = extname(path);
      assert.ok(['.md', '.template', ...runnableSuffixes].includes(suffix), `Unclassified template: ${posix(path)}`);
      assert.ok(readUtf8(path).trim().length > 0, `Empty template: ${posix(path)}`);
    }
  });

  it('materializes every SFAD starter composition with resolved internal links', () => {
    const base = join(domains, 'spec-first-agentic-development/templates/adoption-profiles/base');
    const project = join(domains, 'spec-first-agentic-development/templates/agentic-project');
    const core = join(domains, 'spec-first-agentic-development/templates/spec-first-methodology/core');
    const flavor = join(domains, 'spec-first-agentic-development/templates/spec-first-methodology/flavors/frontend-react');
    checkMaterializedLinks('compact-base', materialize(base));
    checkMaterializedLinks('agentic-project', materialize(project));
    checkMaterializedLinks('full-core', materialize(core));
    checkMaterializedLinks('full-react-flavor', materialize(flavor, materialize(core)));
  });

  it('keeps package documentation portable and source-project neutral', () => {
    const forbidden = /\b(?:Beehouse|LEGGERO CRM|v1_beehouse_admin_dashboard)\b/i;
    for (const path of docs) {
      const markdown = readUtf8(path);
      assert.doesNotMatch(markdown, forbidden, `Project-specific reference: ${posix(path)}`);
      assert.ok(hasBalancedFences(markdown), `Unbalanced code fence: ${posix(path)}`);
      for (const match of withoutFences(markdown).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
        const href = match[1].trim().replace(/^<|>$/g, '').split('#')[0];
        if (!href || /^(?:[a-z]+:|\/)/i.test(href)) continue;
        assert.ok(existsSync(resolve(dirname(path), decodeURIComponent(href))),
          `Broken package link: ${posix(path)} -> ${href}`);
      }
    }
  });
});
