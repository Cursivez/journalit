#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const failures = [];

function walk(dir) {
  if (!existsSync(dir)) return [];
  const entries = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === '.cache')
      continue;
    const fullPath = path.join(dir, name);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) entries.push(...walk(fullPath));
    else entries.push(fullPath);
  }
  return entries;
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/');
}

function lineColumn(text, index) {
  const before = text.slice(0, index);
  const lines = before.split('\n');
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

function validateBalancedCss(filePath, css) {
  const stack = [];
  let state = 'normal';
  let quote = '';

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    const next = css[i + 1];

    if (state === 'comment') {
      if (char === '*' && next === '/') {
        state = 'normal';
        i += 1;
      }
      continue;
    }

    if (state === 'string') {
      if (char === '\\') {
        i += 1;
      } else if (char === quote) {
        state = 'normal';
      }
      continue;
    }

    if (char === '/' && next === '*') {
      state = 'comment';
      i += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      state = 'string';
      quote = char;
      continue;
    }

    if (char === '{') stack.push(i);
    else if (char === '}') {
      if (!stack.pop()) {
        const location = lineColumn(css, i);
        failures.push(
          `${relative(filePath)}:${location.line}:${location.column} unexpected }`
        );
      }
    }
  }

  if (stack.length > 0) {
    const location = lineColumn(css, stack[stack.length - 1]);
    failures.push(
      `${relative(filePath)}:${location.line}:${location.column} unclosed {`
    );
  }

  if (state === 'comment')
    failures.push(`${relative(filePath)}: unclosed CSS comment`);
  if (state === 'string')
    failures.push(`${relative(filePath)}: unclosed CSS string`);
}

const cssFiles = walk(root).filter((filePath) => filePath.endsWith('.css'));
for (const filePath of cssFiles) {
  const css = readFileSync(filePath, 'utf8');
  validateBalancedCss(filePath, css);

  const lines = css.split('\n');
  lines.forEach((line, index) => {
    const location = `${relative(filePath)}:${index + 1}`;
    if (line.includes('!important')) {
      failures.push(`${location}: avoid !important`);
    }
    if (/\btransition\s*:\s*all\b/.test(line)) {
      failures.push(`${location}: avoid transition: all`);
    }
    if (line.includes(':has(')) {
      failures.push(`${location}: avoid :has selectors`);
    }
    if (/\bclip-path\s*:/.test(line)) {
      failures.push(`${location}: avoid clip-path`);
    }
    if (/\btext-decoration(?:-[\w-]+)?\s*:/.test(line)) {
      failures.push(`${location}: avoid text-decoration`);
    }
    if (/\btext-indent\s*:/.test(line)) {
      failures.push(`${location}: avoid text-indent`);
    }
    if (
      /(?:^|[{;])\s*(?:columns|column-count|column-width|column-gap)\s*:/.test(
        line
      )
    ) {
      failures.push(`${location}: avoid multicolumn properties`);
    }
    if (/(?:^|[{;])\s*all\s*:/.test(line)) {
      failures.push(`${location}: avoid all property`);
    }
    if (line.includes('\\0')) {
      failures.push(`${location}: avoid CSS hack units`);
    }
  });
}

if (failures.length > 0) {
  console.error(
    `CSS review validation failed (${failures.length} finding(s)):`
  );
  for (const failure of failures.slice(0, 200)) console.error(`- ${failure}`);
  if (failures.length > 200) console.error(`... ${failures.length - 200} more`);
  process.exit(1);
}

console.log(`CSS review validation passed (${cssFiles.length} CSS file(s)).`);
