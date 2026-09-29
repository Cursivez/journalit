

import React, { useEffect, useRef } from 'react';
import { t } from '../../lang/helpers';
import {
  MANUAL_IMPORT_BROKER_ID,
  type TradeSyncSuggestion,
} from '../../services/onboarding/brokerCatalog';
import type { TradeImportSourceOption } from '../../services/tradeImport/tradeImportSources';
import {
  BrokerPicker,
  type BrokerPickerItem,
} from '../shared/brokerPicker/BrokerPicker';
import { BrokerMark } from '../shared/brokerPicker/BrokerMark';
import {
  ExternalLink,
  FileSpreadsheet,
  RefreshCw,
  Star,
  Zap,
} from '../shared/icons/ObsidianIcon';

const toPickerItems = (
  sources: TradeImportSourceOption[]
): BrokerPickerItem[] => [
  ...sources.map((source) => ({
    id: source.id,
    label: source.label,
    logo: source.logo,
    ...(source.tradeSync?.coverage === 'full'
      ? {
          badge: {
            icon: <Zap size={12} />,
            label: t('trade-import.source.sync-available'),
          },
        }
      : {}),
  })),
  {
    id: MANUAL_IMPORT_BROKER_ID,
    label: t('trade-import.source.manual.tile'),
    icon: <FileSpreadsheet size={20} />,
    pinned: true,
  },
];

interface SourceGridProps {
  sources: TradeImportSourceOption[];
  selectedId: string;
  busy: boolean;
  autoFocusSearch?: boolean;
  onSelect: (brokerId: string) => void;
}

export const TradeImportSourceGrid: React.FC<SourceGridProps> = ({
  sources,
  selectedId,
  busy,
  autoFocusSearch,
  onSelect,
}) => (
  <BrokerPicker
    className="journalit-trade-import-source-grid"
    items={toPickerItems(sources)}
    selectedId={selectedId || undefined}
    disabled={busy}
    autoFocusSearch={autoFocusSearch}
    searchPlaceholder={t('trade-import.source.search')}
    onSelect={(item) => onSelect(item.id)}
  />
);

interface SourceSummaryProps {
  source: TradeImportSourceOption | undefined;
  brokerId: string;
  isFavorite: boolean;
  guideUrl: string | undefined;
  busy: boolean;
  onChange: () => void;
  onToggleFavorite: () => void;
  onOpenGuide: (url: string) => void;
}


export const TradeImportSourceSummary: React.FC<SourceSummaryProps> = ({
  source,
  brokerId,
  isFavorite,
  guideUrl,
  busy,
  onChange,
  onToggleFavorite,
  onOpenGuide,
}) => {
  const isManual = brokerId === MANUAL_IMPORT_BROKER_ID;
  const label = isManual
    ? t('trade-import.source.manual.title')
    : (source?.label ?? brokerId);
  return (
    <div className="journalit-trade-import-source-summary">
      <BrokerMark
        label={label}
        logo={source?.logo}
        icon={isManual ? <FileSpreadsheet size={18} /> : undefined}
        size="md"
      />
      <div className="journalit-trade-import-source-summary__text">
        <span className="journalit-trade-import-source-summary__eyebrow">
          {t('trade-import.label.broker')}
        </span>
        <strong>{label}</strong>
        <span className="journalit-trade-import-source-summary__hint">
          {isManual
            ? t('trade-import.source.manual.hint')
            : t('trade-import.source.native.hint')}
        </span>
      </div>
      <div className="journalit-trade-import-source-summary__actions">
        {guideUrl && (
          <button
            type="button"
            className="journalit-trade-import-guide-link"
            disabled={busy}
            onClick={() => onOpenGuide(guideUrl)}
          >
            {t('trade-import.source.guide')}
            <ExternalLink size={13} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className={`journalit-trade-import-favorite-button${isFavorite ? ' is-favorite' : ''}`}
          aria-label={
            isFavorite
              ? t('csv.broker.remove-favorite-aria')
              : t('csv.broker.set-favorite-aria')
          }
          disabled={busy}
          onClick={onToggleFavorite}
        >
          <Star size={14} />
        </button>
        <button
          type="button"
          className="journalit-trade-import-source-summary__change"
          disabled={busy}
          onClick={onChange}
        >
          {t('trade-import.source.change')}
        </button>
      </div>
    </div>
  );
};


export const TradeImportSyncSuggestion: React.FC<{
  suggestion: TradeSyncSuggestion;
  sourceLabel: string;
  syncOnly: boolean;
  busy: boolean;
  
  revealRequest?: number;
  onOpenTradeSync: () => void;
}> = ({
  suggestion,
  sourceLabel,
  syncOnly,
  busy,
  revealRequest = 0,
  onOpenTradeSync,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (revealRequest === 0) return;
    const card = cardRef.current;
    if (!card) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    card.scrollIntoView({
      block: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    card.querySelector('button')?.focus({ preventScroll: true });
  }, [revealRequest]);
  const variant = syncOnly ? 'sync-only' : suggestion.coverage;
  let title: string;
  let body: string;
  switch (variant) {
    case 'sync-only':
      title = t('trade-import.sync-suggestion.sync-only.title', {
        broker: sourceLabel,
      });
      body = t('trade-import.sync-suggestion.sync-only.body', {
        broker: sourceLabel,
      });
      break;
    case 'full':
      title = t('trade-import.sync-suggestion.full.title', {
        broker: sourceLabel,
      });
      body = t('trade-import.sync-suggestion.full.body');
      break;
    case 'partial':
      title = t('trade-import.sync-suggestion.partial.title', {
        provider: suggestion.providerLabel,
      });
      body = t('trade-import.sync-suggestion.partial.body', {
        provider: suggestion.providerLabel,
      });
      break;
  }
  return (
    <div
      ref={cardRef}
      className="journalit-trade-import-sync-suggestion"
      role="note"
    >
      <span className="journalit-trade-import-sync-suggestion__icon">
        <Zap size={16} />
      </span>
      <div className="journalit-trade-import-sync-suggestion__text">
        <strong>{title}</strong>
        <span>{body}</span>
      </div>
      <button
        type="button"
        className="mod-cta journalit-trade-import-sync-suggestion__action"
        disabled={busy}
        onClick={onOpenTradeSync}
      >
        <RefreshCw size={14} aria-hidden="true" />
        {syncOnly
          ? t('trade-import.sync-suggestion.action.open')
          : t('trade-import.sync-suggestion.action')}
      </button>
    </div>
  );
};
