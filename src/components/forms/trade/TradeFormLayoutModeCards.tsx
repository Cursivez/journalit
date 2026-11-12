

import React from 'react';
import { Select } from '../../core/Select';
import { SegmentedControl } from '../../shared/SegmentedControl';
import { Tooltip } from '../../shared/Tooltip';
import { Info } from '../../shared/icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import type {
  TradeFormAssetTypeMode,
  TradeFormDefaultAssetType,
  TradeFormInputMode,
} from '../../../settings/types';
import type { TradeFormEntryPreferences } from './tradeFormEntryPreferences';

const getAssetTypeOptions = () => [
  { value: 'stock', label: t('form.field.asset-type.stock') },
  { value: 'options', label: t('form.field.asset-type.options') },
  { value: 'futures', label: t('form.field.asset-type.futures') },
  { value: 'forex', label: t('form.field.asset-type.forex') },
  { value: 'crypto', label: t('form.field.asset-type.crypto') },
  { value: 'cfd', label: t('form.field.asset-type.cfd') },
];

interface InputModeCardProps {
  value: TradeFormInputMode;
  onChange: (value: TradeFormInputMode) => void;
}

export const InputModeCard: React.FC<InputModeCardProps> = ({
  value,
  onChange,
}) => (
  <div className="journalit-trade-form-layout-editor__mode-card">
    <div className="journalit-trade-form-layout-editor__mode-heading">
      <div className="journalit-trade-form-layout-editor__mode-title">
        {t('form.layout.input-mode')}
      </div>
      <Tooltip
        className="trade-form-input-mode-tooltip"
        triggerClassName="journalit-trade-form-layout-editor__mode-info-trigger"
        preferredPosition="top"
        content={
          <div className="journalit-trade-form-layout-editor__mode-tooltip">
            <div className="journalit-trade-form-layout-editor__mode-tooltip-row">
              <strong>{t('form.layout.input-mode-prices')}</strong>
              <span>{t('form.layout.input-mode-prices-desc')}</span>
            </div>
            <div className="journalit-trade-form-layout-editor__mode-tooltip-row">
              <strong>{t('form.layout.input-mode-pnl-risk')}</strong>
              <span>{t('form.layout.input-mode-pnl-risk-desc')}</span>
            </div>
          </div>
        }
      >
        <span
          className="journalit-dashboard-metric-info journalit-trade-form-layout-editor__mode-info"
          aria-label={t('form.layout.input-mode')}
        >
          <Info size={10} aria-hidden="true" />
        </span>
      </Tooltip>
    </div>
    <SegmentedControl<TradeFormInputMode>
      options={[
        { value: 'prices', label: t('form.layout.input-mode-prices') },
        { value: 'pnl-risk', label: t('form.layout.input-mode-pnl-risk') },
      ]}
      value={value}
      onChange={onChange}
      size="small"
      fullWidth={false}
    />
  </div>
);

InputModeCard.displayName = 'InputModeCard';

interface AssetTypeModeCardProps {
  assetTypeMode: TradeFormAssetTypeMode;
  defaultAssetType: TradeFormDefaultAssetType;
  onAssetTypeModeChange: (value: TradeFormAssetTypeMode) => void;
  onDefaultAssetTypeChange: (value: string) => void;
}

export const AssetTypeModeCard: React.FC<AssetTypeModeCardProps> = ({
  assetTypeMode,
  defaultAssetType,
  onAssetTypeModeChange,
  onDefaultAssetTypeChange,
}) => (
  <div className="journalit-trade-form-layout-editor__mode-card">
    <div className="journalit-trade-form-layout-editor__mode-title">
      {t('form.layout.asset-type-mode')}
    </div>
    <div className="journalit-trade-form-layout-editor__asset-controls">
      <SegmentedControl<TradeFormAssetTypeMode>
        options={[
          { value: 'show', label: t('form.layout.asset-type-mode-show') },
          { value: 'fixed', label: t('form.layout.asset-type-mode-fixed') },
        ]}
        value={assetTypeMode}
        onChange={onAssetTypeModeChange}
        size="small"
        fullWidth={false}
      />
      {assetTypeMode === 'fixed' && (
        <Select
          className="journalit-trade-form-layout-editor__asset-select"
          value={defaultAssetType}
          onChange={onDefaultAssetTypeChange}
          options={getAssetTypeOptions()}
          aria-label={t('form.layout.default-asset-type')}
        />
      )}
    </div>
  </div>
);

AssetTypeModeCard.displayName = 'AssetTypeModeCard';

interface EntryModeCardProps<T extends string> {
  title: string;
  info: React.ReactNode;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function EntryModeCard<T extends string>({
  title,
  info,
  options,
  value,
  onChange,
}: EntryModeCardProps<T>) {
  return (
    <div className="journalit-trade-form-layout-editor__mode-card">
      <div className="journalit-trade-form-layout-editor__mode-heading">
        <div className="journalit-trade-form-layout-editor__mode-title">
          {title}
        </div>
        <Tooltip
          className="trade-form-input-mode-tooltip"
          triggerClassName="journalit-trade-form-layout-editor__mode-info-trigger"
          preferredPosition="top"
          content={
            <div className="journalit-trade-form-layout-editor__mode-tooltip">
              {info}
            </div>
          }
        >
          <span
            className="journalit-dashboard-metric-info journalit-trade-form-layout-editor__mode-info"
            aria-label={title}
          >
            <Info size={10} aria-hidden="true" />
          </span>
        </Tooltip>
      </div>
      <SegmentedControl<T>
        ariaLabel={title}
        options={options}
        value={value}
        onChange={onChange}
        size="small"
        fullWidth={false}
      />
    </div>
  );
}

interface EntryPreferenceCardsProps {
  entry: TradeFormEntryPreferences;
  onChange: (change: Partial<TradeFormEntryPreferences>) => void;
}


export function EntryPreferenceCards({
  entry,
  onChange,
}: EntryPreferenceCardsProps) {
  return (
    <>
      <EntryModeCard<'quantity' | 'dollar'>
        title={t('form.field.position-size')}
        info={
          <>
            <span>{t('settings.general.dollar-value-input-desc')}</span>
            <span>{t('form.layout.position-size-home-widget')}</span>
          </>
        }
        options={[
          { value: 'quantity', label: t('form.layout.position-size-quantity') },
          { value: 'dollar', label: t('settings.general.dollar-value') },
        ]}
        value={entry.useDollarValueInput ? 'dollar' : 'quantity'}
        onChange={(value) =>
          onChange({ useDollarValueInput: value === 'dollar' })
        }
      />
      <EntryModeCard<'minutes' | 'seconds'>
        title={t('form.layout.trade-times')}
        info={<span>{t('settings.general.show-seconds-desc')}</span>}
        options={[
          { value: 'minutes', label: t('form.layout.trade-times-minutes') },
          { value: 'seconds', label: t('form.layout.trade-times-seconds') },
        ]}
        value={entry.showSeconds ? 'seconds' : 'minutes'}
        onChange={(value) => onChange({ showSeconds: value === 'seconds' })}
      />
    </>
  );
}

type MaeMfeInputMode = TradeFormEntryPreferences['maeMfeInputMode'];


export function MaeMfeEntryControl({
  value,
  onChange,
}: {
  value: MaeMfeInputMode;
  onChange: (value: MaeMfeInputMode) => void;
}) {
  return (
    <div className="journalit-trade-form-layout-editor__target-unit">
      <span className="journalit-trade-form-layout-editor__target-unit-label">
        {t('form.layout.mae-mfe-entry')}
      </span>
      <SegmentedControl<MaeMfeInputMode>
        ariaLabel={t('form.layout.mae-mfe-entry')}
        options={[
          {
            value: 'price',
            label: t('settings.general.mae-mfe-input-mode-price'),
          },
          {
            value: 'dollar',
            label: t('settings.general.mae-mfe-input-mode-dollar'),
          },
        ]}
        value={value}
        onChange={onChange}
        size="small"
        fullWidth={false}
      />
    </div>
  );
}
