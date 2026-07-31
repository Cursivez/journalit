import type { JournalitSettings } from '../../settings/types';

export const METATRADER_BROKER_ID = 'METATRADER';
const LEGACY_METATRADER_BROKER_IDS = new Set(['JDR']);

export function canonicalTradeImportBrokerId(broker: string): string {
  const normalized = broker.trim().toUpperCase();
  return normalized === METATRADER_BROKER_ID ||
    LEGACY_METATRADER_BROKER_IDS.has(normalized)
    ? METATRADER_BROKER_ID
    : broker;
}

export function migrateLegacyMetaTraderBrokerSettings(
  settings: JournalitSettings
): boolean {
  let changed = false;

  if (settings.csvFavoriteBroker) {
    const canonical = canonicalTradeImportBrokerId(settings.csvFavoriteBroker);
    if (canonical !== settings.csvFavoriteBroker) {
      settings.csvFavoriteBroker = canonical;
      changed = true;
    }
  }

  if (settings.csvHiddenBrokers) {
    const existingCanonicalCount = settings.csvHiddenBrokers.filter(
      (broker) => broker === METATRADER_BROKER_ID
    ).length;
    const hasMetaTraderMigration = settings.csvHiddenBrokers.some(
      (broker) =>
        canonicalTradeImportBrokerId(broker) === METATRADER_BROKER_ID &&
        broker !== METATRADER_BROKER_ID
    );
    const canonicalLimit = hasMetaTraderMigration
      ? Math.max(existingCanonicalCount, 1)
      : existingCanonicalCount;
    let canonicalCount = 0;
    const canonical = settings.csvHiddenBrokers.flatMap((broker) => {
      const canonicalBroker = canonicalTradeImportBrokerId(broker);
      if (canonicalBroker !== METATRADER_BROKER_ID) return [broker];
      if (canonicalCount >= canonicalLimit) return [];
      canonicalCount += 1;
      return [canonicalBroker];
    });
    if (
      JSON.stringify(canonical) !== JSON.stringify(settings.csvHiddenBrokers)
    ) {
      settings.csvHiddenBrokers = canonical;
      changed = true;
    }
  }

  if (settings.csvLastAssetType) {
    for (const legacyId of LEGACY_METATRADER_BROKER_IDS) {
      const remembered = settings.csvLastAssetType[legacyId];
      if (remembered !== undefined) {
        settings.csvLastAssetType[METATRADER_BROKER_ID] ??= remembered;
        delete settings.csvLastAssetType[legacyId];
        changed = true;
      }
    }
  }

  if (settings.csvTemplates) {
    for (const template of settings.csvTemplates) {
      const canonical = canonicalTradeImportBrokerId(template.broker_type);
      if (canonical !== template.broker_type) {
        template.broker_type = canonical;
        changed = true;
      }
    }
  }

  return changed;
}
