import type JournalitPlugin from '../../main';
import type { TradeTemplate } from '../../types/reviewV2';
import { TradeTemplateService } from './TradeTemplateService';

interface DefaultTradeTemplateMetadata {
  templateId: string;
  templateVersion: number;
}


export function resolveDefaultTradeTemplate(
  plugin: JournalitPlugin
): TradeTemplate {
  const tradeTemplateService = new TradeTemplateService(plugin);
  const configuredDefaultId = plugin.settings.templates?.defaultTrade;
  const configuredTemplate = configuredDefaultId
    ? tradeTemplateService.getTemplate(configuredDefaultId)
    : undefined;
  return configuredTemplate ?? tradeTemplateService.getDefaultTemplate();
}

export function getDefaultTradeTemplateMetadata(
  plugin: JournalitPlugin
): DefaultTradeTemplateMetadata {
  const template = resolveDefaultTradeTemplate(plugin);
  return {
    templateId: template.id,
    templateVersion: template.version,
  };
}
