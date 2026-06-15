#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const bundlePath = path.join(root, 'main.js');

if (!existsSync(bundlePath)) {
  console.error(
    `Review bundle validation failed: ${bundlePath} does not exist. Run the release build first.`
  );
  process.exit(1);
}

const bundle = readFileSync(bundlePath, 'utf8');
const forbiddenPatterns = [
  {
    label: 'dynamic script element creation',
    patterns: ['createElement("script")', "createElement('script')"],
  },
  {
    label: 'dot-joined runtime string assembly',
    patterns: ['.join(".")', ".join('.')"],
  },
];

const failures = [];
for (const group of forbiddenPatterns) {
  for (const pattern of group.patterns) {
    const count = bundle.split(pattern).length - 1;
    if (count > 0) {
      failures.push(
        `${group.label}: found ${count} occurrence(s) of ${pattern}`
      );
    }
  }
}

if (failures.length > 0) {
  console.error('Review bundle validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Review bundle validation passed.');
