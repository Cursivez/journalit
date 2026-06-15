#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const outputArgIndex = args.findIndex((arg) => arg === '--output');
const outputPath = outputArgIndex >= 0 ? args[outputArgIndex + 1] : null;
const passThroughArgs = args.filter(
  (_arg, index) => index !== outputArgIndex && index !== outputArgIndex + 1
);

const eslintArgs = [
  './node_modules/eslint/bin/eslint.js',
  'src',
  'manifest.json',
  '--format',
  'json',
  '--cache',
  '--cache-location',
  '.cache/eslint-review/.eslintcache',
  '--max-warnings',
  '0',
  ...passThroughArgs,
];

const result = spawnSync(process.execPath, eslintArgs, {
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 100,
});

const stdout = result.stdout.trim();
const stderr = result.stderr.trim();

let report;
try {
  report = stdout ? JSON.parse(stdout) : [];
} catch (error) {
  if (stderr) console.error(stderr);
  console.error(stdout);
  throw new Error(`Failed to parse ESLint JSON output: ${error.message}`);
}

const grouped = new Map();
for (const fileReport of report) {
  for (const message of fileReport.messages ?? []) {
    const ruleId = message.ruleId ?? 'parse-or-config-error';
    const current = grouped.get(ruleId) ?? {
      ruleId,
      errors: 0,
      warnings: 0,
      samples: [],
    };

    if (message.severity === 2) current.errors += 1;
    else current.warnings += 1;

    if (current.samples.length < 10) {
      current.samples.push({
        filePath: fileReport.filePath,
        line: message.line,
        column: message.column,
        message: message.message,
      });
    }

    grouped.set(ruleId, current);
  }
}

const findings = [...grouped.values()].sort(
  (a, b) => b.errors + b.warnings - (a.errors + a.warnings)
);

const summary = {
  errorCount: report.reduce((total, item) => total + item.errorCount, 0),
  warningCount: report.reduce((total, item) => total + item.warningCount, 0),
  fixableErrorCount: report.reduce(
    (total, item) => total + item.fixableErrorCount,
    0
  ),
  fixableWarningCount: report.reduce(
    (total, item) => total + item.fixableWarningCount,
    0
  ),
  groupedRuleCount: findings.length,
  findings,
};

const acceptedUnsafeTypeAssertionFindings = new Map([
  [
    'src/services/base/CustomDataService.ts',
    {
      count: 3,
      reason:
        'CustomDataService stores generic query/cache values behind caller-owned cache keys; the remaining assertions are the typed read side of that internal cache contract.',
    },
  ],
  [
    'src/services/backend/ApiClient.ts',
    {
      count: 2,
      reason:
        'ApiClient is the generic HTTP transport boundary; service callers own endpoint-specific response contracts and validate domain data after transport.',
    },
  ],
]);

const unsafeCounts = new Map();
const unsafeResult = spawnSync(
  process.execPath,
  [
    './node_modules/eslint/bin/eslint.js',
    'src',
    '--format',
    'json',
    '--rule',
    '@typescript-eslint/no-unsafe-type-assertion:warn',
    '--cache',
    '--cache-location',
    '.cache/eslint-review-unsafe/.eslintcache',
  ],
  {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 100,
  }
);

let unsafeReport;
try {
  unsafeReport = unsafeResult.stdout.trim()
    ? JSON.parse(unsafeResult.stdout.trim())
    : [];
} catch (error) {
  if (unsafeResult.stderr.trim()) console.error(unsafeResult.stderr.trim());
  console.error(unsafeResult.stdout);
  throw new Error(
    `Failed to parse unsafe type assertion ESLint JSON output: ${error.message}`
  );
}

for (const fileReport of unsafeReport) {
  const relativePath = fileReport.filePath.replace(`${process.cwd()}/`, '');
  const count = (fileReport.messages ?? []).filter(
    (message) =>
      message.ruleId === '@typescript-eslint/no-unsafe-type-assertion'
  ).length;
  if (count > 0) unsafeCounts.set(relativePath, count);
}

const unsafeViolations = [];
for (const [relativePath, count] of unsafeCounts) {
  const accepted = acceptedUnsafeTypeAssertionFindings.get(relativePath);
  if (!accepted || accepted.count !== count) {
    unsafeViolations.push({ relativePath, count, accepted });
  }
}
for (const [relativePath, accepted] of acceptedUnsafeTypeAssertionFindings) {
  if (!unsafeCounts.has(relativePath)) {
    unsafeViolations.push({ relativePath, count: 0, accepted });
  }
}

summary.acceptedUnsafeTypeAssertions = [
  ...acceptedUnsafeTypeAssertionFindings.entries(),
].map(([relativePath, accepted]) => ({
  relativePath,
  count: accepted.count,
  reason: accepted.reason,
}));

if (unsafeViolations.length > 0) {
  summary.unsafeTypeAssertionViolations = unsafeViolations;
  summary.errorCount += unsafeViolations.length;
}

const rendered = JSON.stringify(summary, null, 2);
if (outputPath) writeFileSync(outputPath, `${rendered}\n`);
console.log(rendered);

if (stderr) console.error(stderr);
process.exit(summary.errorCount > 0 || summary.warningCount > 0 ? 1 : 0);
