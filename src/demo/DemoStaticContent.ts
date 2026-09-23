import type { DemoMediaRecipe } from './compileDemoPack';

function hashContent(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function createDemoMediaSvg(
  recipe: DemoMediaRecipe,
  instanceId: string
): string {
  const width = 960;
  const height = 540;
  const plotLeft = 72;
  const plotTop = 92;
  const plotWidth = 816;
  const plotHeight = 340;
  const min = Math.min(...recipe.points) - 4;
  const max = Math.max(...recipe.points) + 4;
  const xForIndex = (index: number): number =>
    plotLeft + (index / Math.max(1, recipe.points.length - 1)) * plotWidth;
  const yForPoint = (point: number): number =>
    plotTop + ((max - point) / Math.max(1, max - min)) * plotHeight;
  const path = recipe.points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command}${xForIndex(index).toFixed(1)},${yForPoint(point).toFixed(1)}`;
    })
    .join(' ');
  const accent =
    recipe.tone === 'win'
      ? '#2f9e71'
      : recipe.tone === 'loss'
        ? '#d55a5a'
        : '#6f78c9';
  const markers = [
    ...(recipe.entryIndex === undefined
      ? []
      : [
          `<circle cx="${xForIndex(recipe.entryIndex).toFixed(1)}" cy="${yForPoint(recipe.points[recipe.entryIndex]).toFixed(1)}" r="9" fill="#f0b44d" stroke="#1d2330" stroke-width="3"/>`,
          `<text x="${(xForIndex(recipe.entryIndex) + 14).toFixed(1)}" y="${(yForPoint(recipe.points[recipe.entryIndex]) - 12).toFixed(1)}" font-size="18" fill="#f7f8fb">Entry</text>`,
        ]),
    ...(recipe.exitIndexes ?? []).flatMap((index, markerIndex) => [
      `<rect x="${(xForIndex(index) - 8).toFixed(1)}" y="${(yForPoint(recipe.points[index]) - 8).toFixed(1)}" width="16" height="16" rx="3" fill="#e8edf7" stroke="#1d2330" stroke-width="3"/>`,
      `<text x="${(xForIndex(index) + 13).toFixed(1)}" y="${(yForPoint(recipe.points[index]) + 6).toFixed(1)}" font-size="18" fill="#f7f8fb">Exit ${markerIndex + 1}</text>`,
    ]),
  ].join('\n  ');

  return [
    `<!-- journalit-sample-instance:${instanceId} journalit-sample-entity:${recipe.entityId} hash:${hashContent(recipe.points.join(','))} -->`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">`,
    `  <title id="title">${escapeXml(recipe.title)}</title>`,
    `  <desc id="description">${escapeXml(recipe.description)}</desc>`,
    '  <rect width="960" height="540" rx="24" fill="#151a24"/>',
    '  <rect x="48" y="58" width="864" height="398" rx="16" fill="#202837" stroke="#374257" stroke-width="2"/>',
    `  <text x="72" y="46" font-size="26" font-family="system-ui, sans-serif" fill="#f7f8fb">${escapeXml(recipe.title)}</text>`,
    '  <g stroke="#354158" stroke-width="1">',
    '    <line x1="72" y1="177" x2="888" y2="177"/>',
    '    <line x1="72" y1="262" x2="888" y2="262"/>',
    '    <line x1="72" y1="347" x2="888" y2="347"/>',
    '  </g>',
    `  <path d="${path}" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    `  ${markers}`,
    '  <text x="72" y="500" font-size="18" font-family="system-ui, sans-serif" fill="#aeb8ca">Illustrative sample path — not historical market data</text>',
    '</svg>',
  ].join('\n');
}

export function createDemoSupportNoteContent(options: {
  instanceId: string;
  entityId: string;
  title: string;
  body: string;
}): string {
  return [
    '---',
    'type: journalit-sample-support',
    `journalitSampleInstance: ${JSON.stringify(options.instanceId)}`,
    `journalitSampleEntityId: ${JSON.stringify(options.entityId)}`,
    `title: ${JSON.stringify(options.title)}`,
    '---',
    '',
    options.body,
    '',
  ].join('\n');
}
