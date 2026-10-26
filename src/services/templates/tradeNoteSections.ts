

import type JournalitPlugin from '../../main';
import type { TradeNoteBodySection } from '../../types/reviewV2';
import { resolveDefaultTradeTemplate } from './defaultTradeTemplateMetadata';

function renderTradeNoteSections(
  sections: readonly TradeNoteBodySection[]
): string {
  const lines: string[] = [];
  for (const section of sections) {
    if (section.type === 'header') {
      const text = section.text.trim();
      if (!text) continue;
      if (lines.length > 0 && lines[lines.length - 1] !== '') lines.push('');
      const level = Math.max(1, Math.min(6, Math.round(section.level)));
      lines.push(`${'#'.repeat(level)} ${text}`);
    } else {
      
      if (!section.text.trim()) continue;
      lines.push(section.text.trimEnd(), '');
    }
  }
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}


export function getDefaultTradeNoteSectionsMarkdown(
  plugin: JournalitPlugin
): string {
  return renderTradeNoteSections(
    resolveDefaultTradeTemplate(plugin).noteSections ?? []
  );
}
