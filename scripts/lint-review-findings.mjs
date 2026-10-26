#!/usr/bin/env node







import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
function readArg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}
const outputPath = readArg('--output');
const engine = readArg('--engine') ?? 'eslint';
if (engine !== 'eslint' && engine !== 'oxlint') {
  throw new Error(`--engine must be eslint or oxlint, got ${engine}`);
}

const UNSAFE_ASSERTION_RULE = '@typescript-eslint/no-unsafe-type-assertion';
const MAX_BUFFER = 1024 * 1024 * 100;

function run(command, commandArgs, env = {}) {
  const result = spawnSync(command, commandArgs, {
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    env: { ...process.env, ...env },
  });
  if (result.error) throw result.error;
  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function parseJson(text, tool, stderr) {
  try {
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (stderr) console.error(stderr);
    console.error(text);
    throw new Error(`Failed to parse ${tool} JSON output: ${error.message}`);
  }
}



function eslintFindings(files, env) {
  const result = run(
    process.execPath,
    ['./node_modules/eslint/bin/eslint.js', ...files, '--format', 'json'],
    env
  );
  const report = parseJson(result.stdout, 'ESLint', result.stderr) ?? [];
  const findings = [];
  for (const fileReport of report) {
    const relativePath = relative(process.cwd(), fileReport.filePath);
    const add = (message, suppressed) =>
      findings.push({
        relativePath,
        ruleId: message.ruleId ?? 'parse-or-config-error',
        severity: message.severity === 2 ? 'error' : 'warning',
        line: message.line,
        column: message.column,
        message: message.message,
        fixable: Boolean(message.fix),
        suppressed,
      });
    for (const message of fileReport.messages ?? []) add(message, false);
    for (const message of fileReport.suppressedMessages ?? [])
      add(message, true);
  }
  return { findings, stderr: result.stderr };
}


function eslintRuleId(code) {
  if (!code) return 'unused-disable-directive';
  const match = /^(.+?)\((.+)\)$/.exec(code);
  if (!match) return code;
  const [, plugin, rule] = match;
  if (plugin === 'eslint') return rule;
  if (plugin === 'typescript') return `@typescript-eslint/${rule}`;
  return `${plugin}/${rule}`;
}

function oxlintFindings() {
  const generated = run(process.execPath, [
    'scripts/generate-oxlint-config.mjs',
    '--check',
  ]);
  if (generated.status !== 0) {
    throw new Error(
      generated.stderr || 'scripts/generate-oxlint-config.mjs --check failed'
    );
  }
  const result = run('./node_modules/.bin/oxlint', [
    '--type-aware',
    '--report-unused-disable-directives-severity=error',
    '--format',
    'json',
    'src',
  ]);
  const report = parseJson(result.stdout, 'oxlint', result.stderr);
  if (!report) throw new Error(`oxlint produced no report: ${result.stderr}`);
  const findings = report.diagnostics.map((diagnostic) => {
    const span = diagnostic.labels?.[0]?.span ?? {};
    return {
      relativePath: diagnostic.filename,
      ruleId: eslintRuleId(diagnostic.code),
      severity: diagnostic.severity === 'error' ? 'error' : 'warning',
      line: span.line,
      column: span.column,
      message: diagnostic.message,
      fixable: false,
      suppressed: false,
    };
  });
  
  
  const directive =
    /(?:eslint|oxlint)-disable(?:-next-line|-line)?\b[^\n]*no-unsafe-type-assertion/g;
  for (const relativePath of sourceFiles('src')) {
    const count =
      readFileSync(relativePath, 'utf8').match(directive)?.length ?? 0;
    for (let i = 0; i < count; i += 1) {
      findings.push({
        relativePath,
        ruleId: UNSAFE_ASSERTION_RULE,
        suppressed: true,
      });
    }
  }
  const manifest = eslintFindings(['manifest.json']);
  return {
    findings: [...findings, ...manifest.findings],
    stderr: [result.stderr, manifest.stderr].filter(Boolean).join('\n'),
  };
}

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}



const { findings, stderr } =
  engine === 'oxlint'
    ? oxlintFindings()
    : eslintFindings(['src', 'manifest.json'], {
        JOURNALIT_LINT_UNSAFE_ASSERTIONS: '1',
      });

const grouped = new Map();
const unsafeCounts = new Map();
const suppressedUnsafeCounts = new Map();
const summary = {
  engine,
  errorCount: 0,
  warningCount: 0,
  fixableErrorCount: 0,
  fixableWarningCount: 0,
};

for (const finding of findings) {
  const { relativePath } = finding;
  if (finding.ruleId === UNSAFE_ASSERTION_RULE) {
    const counts = finding.suppressed ? suppressedUnsafeCounts : unsafeCounts;
    counts.set(relativePath, (counts.get(relativePath) ?? 0) + 1);
    continue;
  }
  if (finding.suppressed) continue;

  const isError = finding.severity === 'error';
  if (isError) {
    summary.errorCount += 1;
    if (finding.fixable) summary.fixableErrorCount += 1;
  } else {
    summary.warningCount += 1;
    if (finding.fixable) summary.fixableWarningCount += 1;
  }

  const current = grouped.get(finding.ruleId) ?? {
    ruleId: finding.ruleId,
    errors: 0,
    warnings: 0,
    samples: [],
  };
  if (isError) current.errors += 1;
  else current.warnings += 1;
  if (current.samples.length < 10) {
    current.samples.push({
      filePath: relativePath,
      line: finding.line,
      column: finding.column,
      message: finding.message,
    });
  }
  grouped.set(finding.ruleId, current);
}

const groupedFindings = [...grouped.values()].sort(
  (a, b) => b.errors + b.warnings - (a.errors + a.warnings)
);
summary.groupedRuleCount = groupedFindings.length;
summary.findings = groupedFindings;

const acceptedUnsafeTypeAssertionFindings = new Map([
  [
    'src/services/base/CustomDataService.ts',
    {
      count: 2,
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
  [
    'src/services/agent/AgentPermissions.ts',
    {
      count: 2,
      reason:
        'AgentPermissions narrows the generic tool request after an exhaustive tool-name switch so the apply_changes and integration scope resolvers receive their correlated request variants.',
    },
  ],
  [
    'src/services/actions/history/actionInverses.ts',
    {
      count: 1,
      reason:
        'An undo call is built only after its action and exact inputs match the inverse allowlist, whose entries are existing removal actions with those inputs.',
    },
  ],
  [
    'src/services/agent/configuration/propChallengeConfiguration.ts',
    {
      count: 1,
      reason:
        'The prop challenge projection presents each stored rule in the contract shape and then checks every projected challenge against the generated result schema, leaving out any that do not fit.',
    },
  ],
  [
    'src/services/trade/TradeNoteWriter.ts',
    {
      count: 1,
      reason:
        'TradeNoteWriter hands domain trade data to the missed and backtest services, whose form-data parameter declares aggregates required that they default themselves at runtime.',
    },
  ],
  [
    'src/services/actions/domains/configurationActions.ts',
    {
      count: 9,
      reason:
        "Configuration actions map each contract-validated action input onto its planner's change union (the action id fixes the change kind) and present the planner's summary as the action summary and result; TypeScript cannot correlate the generic action id with those variants, and the handler and backend validate them against the contract.",
    },
  ],
  [
    'src/services/agent/configuration/settingsConfiguration.ts',
    {
      count: 2,
      reason:
        "Settings groups are described by one table of field descriptors; the change summary and the projection are built from that table, which holds exactly each group's contract fields, so TypeScript cannot tie them to the per-group contract types, and the handler validates both against the generated schemas.",
    },
  ],
  [
    'src/services/actions/domains/optionActions.ts',
    {
      count: 2,
      reason:
        'Option actions type each summary from the materializer, which builds it for the change kind the action maps to; TypeScript cannot correlate the generic action id with that summary, and the handler and backend validate it against the action contract.',
    },
  ],
  [
    'src/services/actions/ActionBatchService.ts',
    {
      count: 2,
      reason:
        "ActionBatchService builds each preview summary entry and applied outcome from the plan its own action's definition produced; TypeScript cannot correlate the action id with its summary and result variants, and the handler validates the complete result against the generated contract.",
    },
  ],
  [
    'src/services/agent/AgentResultCache.ts',
    {
      count: 1,
      reason:
        'AgentResultCache validates plain-object identity and prototype constraints before indexing the object during deterministic serialization.',
    },
  ],
  [
    'src/services/agent/protocol/AgentContractRegistry.ts',
    {
      count: 4,
      reason:
        'AgentContractRegistry assertions follow generated schema validators that establish the correlated request, result, envelope, and relay-message contracts at the protocol boundary.',
    },
  ],
  [
    'src/services/agent/protocol/agentSchemaModel.ts',
    {
      count: 1,
      reason:
        "Ajv's runtime/equal declaration types its default export as the fast-deep-equal module namespace, which is not callable; the runtime value is fast-deep-equal's comparison function, the one Ajv itself uses for const, enum and uniqueItems.",
    },
  ],
  [
    'src/services/agent/trades/AgentTradeReadService.ts',
    {
      count: 1,
      reason:
        'AgentTradeReadService constructs the read-record contract by attaching its required non-enumerable file and media properties before returning it.',
    },
  ],
]);

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
for (const [relativePath, suppressedCount] of suppressedUnsafeCounts) {
  unsafeViolations.push({ relativePath, suppressedCount });
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
