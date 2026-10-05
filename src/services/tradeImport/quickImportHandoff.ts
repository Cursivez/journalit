import type {
  ClassifiedPreviewTrade,
  TradeImportAnalyseResponse,
  TradeImportPreviewResponse,
} from './types';
import type { ManualImportMode } from '../csv/types';

type AssetType = 'stock' | 'options' | 'futures' | 'forex' | 'crypto';

interface QuickImportTradeImportHandoff {
  file: File;
  broker: string;
  accountName: string;
  assetType: AssetType;
  manualMode?: ManualImportMode;
  dateFormat?: string;
  sheetName?: string | null;
  headerRowIndex?: number | null;
  templateId?: string;
  templateName?: string;
  columnMappings: Record<string, string[]>;
  aiMappingEnabled: boolean;
  analyse: TradeImportAnalyseResponse | null;
  preview: TradeImportPreviewResponse | null;
  previewOwnerUserId: string | null;
  classified: ClassifiedPreviewTrade[];
  
  previewOnOpen?: boolean;
  
  changeSource?: boolean;
}

let pendingQuickImportHandoff: QuickImportTradeImportHandoff | null = null;

export function setQuickImportTradeImportHandoff(
  handoff: QuickImportTradeImportHandoff
): void {
  pendingQuickImportHandoff = handoff;
}

export function consumeQuickImportTradeImportHandoff(): QuickImportTradeImportHandoff | null {
  const handoff = pendingQuickImportHandoff;
  pendingQuickImportHandoff = null;
  return handoff;
}

export function clearQuickImportTradeImportHandoff(): void {
  pendingQuickImportHandoff = null;
}
