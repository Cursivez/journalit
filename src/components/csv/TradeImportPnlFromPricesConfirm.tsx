

import React, { useId } from 'react';
import { t } from '../../lang/helpers';
import type { TradeImportAssetType } from '../../services/tradeImport/tradeImportSources';
import { Button } from '../ui/Button';

const ASSET_TYPES: ReadonlyArray<[TradeImportAssetType, () => string]> = [
  ['stock', () => t('trade-import.asset.stock')],
  ['forex', () => t('trade-import.asset.forex')],
  ['futures', () => t('trade-import.asset.futures')],
  ['crypto', () => t('trade-import.asset.crypto')],
  ['options', () => t('trade-import.asset.options')],
];

export const TradeImportPnlFromPricesConfirm: React.FC<{
  assetType: TradeImportAssetType;
  contractSizeMapped: boolean;
  busy: boolean;
  onConfirm: (assetType: TradeImportAssetType) => void;
}> = ({ assetType, contractSizeMapped, busy, onConfirm }) => {
  const titleId = useId();
  const needsContractSize =
    !contractSizeMapped && (assetType === 'forex' || assetType === 'futures');
  return (
    <section
      className="csv-message csv-message--info journalit-trade-import-pnl-confirm"
      aria-labelledby={titleId}
    >
      <strong id={titleId}>{t('trade-import.pnl-from-prices.title')}</strong>
      <p>{t('trade-import.pnl-from-prices.body')}</p>
      <div
        className="journalit-trade-import-pnl-confirm__types"
        role="group"
        aria-labelledby={titleId}
      >
        {ASSET_TYPES.map(([value, label]) => (
          <Button
            key={value}
            size="small"
            variant={value === assetType ? 'primary' : 'secondary'}
            disabled={busy}
            onClick={() => onConfirm(value)}
          >
            {label()}
          </Button>
        ))}
      </div>
      {needsContractSize ? (
        <p className="journalit-trade-import-pnl-confirm__note">
          {t('trade-import.pnl-from-prices.contract-size')}
        </p>
      ) : null}
    </section>
  );
};
