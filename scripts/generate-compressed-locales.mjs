import fs from 'fs';
import { createHash } from 'crypto';
import { deflateRawSync } from 'zlib';

const localeCodes = [
  'en',
  'es',
  'de',
  'fr',
  'vi',
  'pt-BR',
  'zh',
  'zh-TW',
  'ja',
  'ko',
  'ru',
];

function readLocaleObjectLiteral(localeCode) {
  const source = fs.readFileSync(`src/lang/locale/${localeCode}.ts`, 'utf8');
  const match = source.match(
    /const\s+\w+\s*(?::\s*(?:Partial<)?Lang>?)?\s*=\s*([\s\S]*?);\s*(?:\n\s*export\s+type\s+[^;]+;)*\s*\n\s*export\s+default\s+\w+\s*;/
  );
  if (!match) {
    throw new Error(`Unable to extract locale object from ${localeCode}`);
  }
  return match[1];
}

function loadLocale(localeCode) {
  return Function(
    `"use strict"; return (${readLocaleObjectLiteral(localeCode)});`
  )();
}

function compressJson(value) {
  return deflateRawSync(Buffer.from(JSON.stringify(value), 'utf8'), {
    level: 9,
  }).toString('base64');
}

function hashKeys(keys) {
  return createHash('sha256')
    .update(keys.join('\n'))
    .digest('hex')
    .slice(0, 16);
}

const locales = Object.fromEntries(
  localeCodes.map((localeCode) => [localeCode, loadLocale(localeCode)])
);
const englishLocale = locales.en;
const englishKeys = Object.keys(englishLocale);
const keyHash = hashKeys(englishKeys);

const localePacks = Object.fromEntries(
  localeCodes
    .filter((localeCode) => localeCode !== 'en')
    .map((localeCode) => {
      const locale = locales[localeCode];
      const values = englishKeys.map((key) =>
        Object.prototype.hasOwnProperty.call(locale, key) ? locale[key] : null
      );
      return [localeCode, compressJson(values)];
    })
);

const localeEntries = Object.entries(localePacks)
  .map(
    ([localeCode, data]) =>
      `  '${localeCode}': { format: 'values', data: '${data}' },`
  )
  .join('\n');

const metadataEntries = Object.entries(locales)
  .map(([localeCode, locale]) => {
    const translatedKeyCount = Object.keys(locale).length;
    const completeness = translatedKeyCount / englishKeys.length;
    return `    '${localeCode}': { translatedKeyCount: ${translatedKeyCount}, completeness: ${completeness.toFixed(4)} },`;
  })
  .join('\n');

const output = `\nexport const englishPack = '${compressJson(englishLocale)}';\n\nexport const localePacks = {\n${localeEntries}\n} as const;\n\nexport const localeBuildInfo = {\n  schemaVersion: 2,\n  keyHash: '${keyHash}',\n  keyCount: ${englishKeys.length},\n  locales: {\n${metadataEntries}\n  },\n} as const;\n`;

const outputPath = 'src/lang/compressedLocales.generated.ts';

if (process.argv.includes('--check')) {
  const existingOutput = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, 'utf8')
    : '';

  if (existingOutput !== output) {
    console.error(
      `${outputPath} is stale. Run pnpm run i18n:generate-compressed.`
    );
    process.exit(1);
  }
} else {
  fs.writeFileSync(outputPath, output);
}
