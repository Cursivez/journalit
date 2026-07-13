import type JournalitPlugin from '../../main';
import { TradeTemplateService } from './TradeTemplateService';

interface DefaultTradeTemplateMetadata {
  templateId: string;
  templateVersion: number;
}

export function getDefaultTradeTemplateMetadata(
  plugin: JournalitPlugin
): DefaultTradeTemplateMetadata {
  const tradeTemplateService = new TradeTemplateService(plugin);
  const configuredDefaultId = plugin.settings.templates?.defaultTrade;
  const configuredTemplate = configuredDefaultId
    ? tradeTemplateService.getTemplate(configuredDefaultId)
    : undefined;
  const template =
    configuredTemplate ?? tradeTemplateService.getDefaultTemplate();

  return {
    templateId: template.id,
    templateVersion: template.version,
  };
}
