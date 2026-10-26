

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useReducer,
} from 'react';
import { TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { TradeFormData } from '../forms/trade/types';
import { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import { usePlugin } from '../../hooks/usePlugin';
import { useAccountPageService } from '../../hooks/useService';
import { useEventBus } from '../../hooks/useEventBus';
import { TradeNavigation } from './TradeNavigation';
import {
  TradeHeader,
  TradeImageSection,
  TradeMetadataSection,
  TradeDetailsSection,
  TradeCustomFieldsSection,
} from './components';
import { hasTradeCustomFieldDisplayEntries } from './components/TradeCustomFieldsSection';
import { TradeRatingCard } from './components/TradeRatingCard';
import {
  areSnapshotKeysClaimedByCustomFields,
  calculateUnrealizedPnL,
} from '../../utils/unrealizedPnl';
import { useTradeMetrics } from './hooks';
import { resolveDefaultTradeTemplate } from '../../services/templates/defaultTradeTemplateMetadata';
import {
  TradeNoteSectionId,
  TradeTemplate,
  TradeTemplateAssetType,
} from '../../types/reviewV2';
import {
  getTradingDay,
  getTradingDayRange,
  getTradingDayString,
} from '../../utils/tradingDayUtils';
import { formatDateDisplay, getUserDateFormat } from '../../utils/dateUtils';
import { t } from '../../lang/helpers';
import {
  fetchBreakEvenAccountBalanceLookup,
  resolveBreakEvenAccountBalances,
} from '../../services/trade/core/BreakEvenAccountBalance';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';
import { CircleHelp } from '../shared/icons/ObsidianIcon';
import { CustomFieldDefinition } from '../../types/customFields';
import { useTradeLabelColorData } from '../../hooks/useTradeLabelColorData';
import { extractPriceMoveValueFields } from '../../utils/priceMoveValue';
import { shareCaptureExcludeProps } from '../../services/share/brandedCapture';
import {
  resolveTradeShareImageLayout,
  tradeShareSectionProps,
  type TradeShareOptions,
} from '../share/tradeShare/tradeShareModel';
import { calculateTradeReturnPercent } from '../tradelog/tradeMetricUtils';

const TRADE_NAV_CACHE_PREFIX = 'trade-nav-';

const DEFAULT_TRADE_NOTE_SECTION_ORDER: TradeNoteSectionId[] = [
  'images',
  'metrics',
  'thesis',
  'missedReason',
  'metadata',
  'reviewButton',
];

async function updateTradeNoteReviewStatus(
  plugin: JournalitPlugin,
  data: Pick<PartialTradeFrontmatter, 'isMissedTrade' | 'isBacktestTrade'>,
  filePath: string,
  reviewed: boolean,
  reviewedAt: string
): Promise<void> {
  if (data.isMissedTrade === true) {
    const missedTradeService = plugin.serviceManager
      ? await plugin.serviceManager.getMissedTradeService()
      : plugin.missedTradeService;
    await missedTradeService.updateMissedTradeReviewStatus(
      filePath,
      reviewed,
      reviewedAt
    );
    return;
  }

  if (data.isBacktestTrade === true) {
    const backtestTradeService = plugin.serviceManager
      ? await plugin.serviceManager.getBacktestTradeService()
      : plugin.backtestTradeService;
    await backtestTradeService.updateBacktestTradeReviewStatus(
      filePath,
      reviewed,
      reviewedAt
    );
    return;
  }

  await plugin.tradeService.updateTradeReviewStatus(
    filePath,
    reviewed,
    reviewedAt,
    'user-input'
  );
}

function isTradeTemplateAssetType(
  value: string | undefined
): value is TradeTemplateAssetType {
  switch (value) {
    case 'stock':
    case 'options':
    case 'futures':
    case 'forex':
    case 'crypto':
    case 'cfd':
      return true;
    default:
      return false;
  }
}

function mergeSectionConfig<K extends keyof TradeTemplate['sections']>(
  baseSections: TradeTemplate['sections'],
  overrideSections: Partial<TradeTemplate['sections']> | undefined,
  key: K
): TradeTemplate['sections'][K] {
  return {
    ...baseSections[key],
    ...(overrideSections?.[key] ?? {}),
  };
}

function getEffectiveTradeTemplate(
  template: TradeTemplate | null,
  assetType: string | undefined
): TradeTemplate | null {
  if (!template || !isTradeTemplateAssetType(assetType)) return template;

  const override = template.assetOverrides?.[assetType];
  if (!override) return template;

  return {
    ...template,
    sectionOrder: override.sectionOrder ?? template.sectionOrder,
    sections: {
      header: template.sections.header,
      navigation: mergeSectionConfig(
        template.sections,
        override.sections,
        'navigation'
      ),
      images: mergeSectionConfig(
        template.sections,
        override.sections,
        'images'
      ),
      metadata: mergeSectionConfig(
        template.sections,
        override.sections,
        'metadata'
      ),
      details: mergeSectionConfig(
        template.sections,
        override.sections,
        'details'
      ),
      reviewButton: mergeSectionConfig(
        template.sections,
        override.sections,
        'reviewButton'
      ),
      missedReason: mergeSectionConfig(
        template.sections,
        override.sections,
        'missedReason'
      ),
      rating: mergeSectionConfig(
        template.sections,
        override.sections,
        'rating'
      ),
    },
  };
}

const isMissedReasonVisible = (template: TradeTemplate | null): boolean =>
  template?.sections.missedReason?.show !== false;

const MissedTradeReasonSection: React.FC<{ reason: string }> = ({ reason }) => (
  <section
    className="missed-trade-reason-section"
    {...tradeShareSectionProps('missedReason')}
  >
    <div className="missed-trade-reason-header">
      <div className="missed-trade-reason-title">
        <CircleHelp size={17} />
        <h4>{t('missed-trade.reason-title')}</h4>
      </div>
    </div>
    <div className="missed-trade-reason-content">
      {getKeyedTextLines(reason).map((item, index, lines) => (
        <React.Fragment key={item.key}>
          {item.line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  </section>
);

function getTradeNoteSectionOrder(
  template: TradeTemplate | null
): TradeNoteSectionId[] {
  const configured = template?.sectionOrder ?? [];
  const valid = configured.filter(
    (sectionId): sectionId is TradeNoteSectionId =>
      DEFAULT_TRADE_NOTE_SECTION_ORDER.includes(sectionId)
  );
  const missing = DEFAULT_TRADE_NOTE_SECTION_ORDER.filter(
    (sectionId) => !valid.includes(sectionId)
  );
  return [...valid, ...missing];
}

function isTradeThesisSectionVisible(template: TradeTemplate | null): boolean {
  const detailsConfig = template?.sections.details;
  return detailsConfig?.show !== false && detailsConfig?.showThesis !== false;
}

function ReviewedCheckmark() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const TradeNoteReviewButton: React.FC<{
  reviewed?: boolean;
  reviewedAt?: string;
  onToggleReviewed: () => void | Promise<void>;
}> = ({ reviewed = false, reviewedAt, onToggleReviewed }) => {
  const dateFormat = getUserDateFormat();

  return (
    <div className="trade-note-review-control">
      <button
        type="button"
        className={`journalit-weekly-drc-mark-reviewed-button ${reviewed ? 'journalit-weekly-drc-mark-reviewed-button--reviewed' : ''}`}
        onClick={() => void onToggleReviewed()}
        aria-pressed={reviewed}
      >
        <span
          className={`journalit-weekly-drc-mark-reviewed-icon ${reviewed ? 'journalit-weekly-drc-mark-reviewed-icon--reviewed' : ''}`}
          aria-hidden="true"
        >
          {reviewed && <ReviewedCheckmark />}
        </span>
        {reviewed
          ? t('widget.trade-review.status.reviewed')
          : t('widget.trade-review.status.pending')}
      </button>
      {reviewed && reviewedAt && (
        <span className="trade-note-reviewed-timestamp">
          {t('trade.review.reviewed-on', {
            date: formatDateDisplay(reviewedAt, dateFormat),
          })}
        </span>
      )}
    </div>
  );
};

const parseTradeNavigationCache = (
  value: unknown
): { trades: string[]; missedTrades: string[] } | null => {
  if (Array.isArray(value)) {
    return {
      trades: value.filter((item): item is string => typeof item === 'string'),
      missedTrades: [],
    };
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = Object.fromEntries(Object.entries(value));
  return {
    trades: Array.isArray(record.trades)
      ? record.trades.filter((item): item is string => typeof item === 'string')
      : [],
    missedTrades: Array.isArray(record.missedTrades)
      ? record.missedTrades.filter(
          (item): item is string => typeof item === 'string'
        )
      : [],
  };
};

const getKeyedTextLines = (text: string) => {
  const occurrences = new Map<string, number>();
  return text.split('\n').map((line) => {
    const occurrence = (occurrences.get(line) ?? 0) + 1;
    occurrences.set(line, occurrence);
    return { line, key: `${line}-${occurrence}` };
  });
};

interface TradeNoteProps {
  data: PartialTradeFrontmatter;
  onEditClick?: (data: TradeNoteProps['data']) => void;
  onDataUpdate?: (updatedData: Partial<TradeFormData>) => void;
  shareOptions?: TradeShareOptions;
}

type TradeNoteMetrics = ReturnType<typeof useTradeMetrics>['metrics'];

const tradeOutcomeKind = (
  metrics: TradeNoteMetrics
): 'breakeven' | 'profit' | 'loss' => {
  if (metrics.isBreakeven) return 'breakeven';
  return metrics.isProfit ? 'profit' : 'loss';
};

const tradeNoteKind = (
  data: PartialTradeFrontmatter
): 'backtest-trade' | 'missed-trade' | 'trade' => {
  if (data.isBacktestTrade) return 'backtest-trade';
  return data.isMissedTrade ? 'missed-trade' : 'trade';
};


const showsSessionNavigation = (
  data: PartialTradeFrontmatter,
  shareOptions: TradeShareOptions | undefined,
  showNavigationSection: boolean
): boolean =>
  !shareOptions &&
  showNavigationSection &&
  Boolean(data.entryTime || data.useDirectPnLInput);

const displaysRMultiples = (plugin: ReturnType<typeof usePlugin>): boolean =>
  plugin?.settings?.trade?.displayRMultiples ?? false;



const snapshotUnrealizedPnL = (
  plugin: ReturnType<typeof usePlugin>,
  data: PartialTradeFrontmatter
) =>
  areSnapshotKeysClaimedByCustomFields(plugin?.customFieldsService?.getFields())
    ? null
    : calculateUnrealizedPnL(data);


const TradeNoteHeader: React.FC<{
  data: PartialTradeFrontmatter;
  filePath: string;
  plugin: ReturnType<typeof usePlugin>;
  metrics: TradeNoteMetrics;
  shareOptions: TradeShareOptions | undefined;
  reviewed: boolean;
  showNavigationSection: boolean;
  onEditClick: () => void;
  onToggleReviewed: (() => void) | undefined;
}> = ({
  data,
  filePath,
  plugin,
  metrics,
  shareOptions,
  reviewed,
  showNavigationSection,
  onEditClick,
  onToggleReviewed,
}) => {
  if (shareOptions && !shareOptions.sections.has('header')) return null;
  const header = (
    <TradeHeader
      instrument={data.instrument}
      direction={data.direction}
      entryTime={data.entryTime}
      sourcePath={filePath}
      onEditClick={onEditClick}
      sessionNavigation={
        showsSessionNavigation(data, shareOptions, showNavigationSection) ? (
          <TradeNavigationSection data={data} filePath={filePath} />
        ) : null
      }
      showReviewNavigation={showNavigationSection}
      reviewed={reviewed}
      onToggleReviewed={onToggleReviewed}
      outcome={{ kind: tradeOutcomeKind(metrics) }}
      pnl={metrics.pnl}
      percentChange={metrics.percentChange}
      sharePnlDisplay={
        shareOptions
          ? {
              mode: shareOptions.pnlMode,
              accountBalance: shareOptions.accountBalance,
              positionReturn: calculateTradeReturnPercent(data),
            }
          : undefined
      }
      pnlInput={{
        useDirectPnLInput: data.useDirectPnLInput,
        directPnL: data.directPnL,
        originalPnlWasNull: data._originalPnlWasNull,
      }}
      noteKind={tradeNoteKind(data)}
      exitTime={data.exitTime}
      exitPrice={data.exitPrice}
      tradeStatus={data.tradeStatus}
      entries={data.entries}
      exits={data.exits}
      dividends={data.dividends}
      commission={data.commission}
      commissionType={data.commissionType}
      swap={data.swap}
      fees={data.fees}
      rebate={data.rebate}
      optionType={data.optionType}
      {...extractPriceMoveValueFields(data)}
      rMultiple={data.rMultiple}
      rMultipleDisplay={{
        enabled: displaysRMultiples(plugin),
        riskAmount: data.riskAmount,
      }}
      currency={data.currency}
      unrealizedPnL={
        
        
        snapshotUnrealizedPnL(plugin, data)
      }
      unrealizedPriceSnapshotTime={data.unrealizedPriceSnapshotTime}
    />
  );
  return data.isMissedTrade === true ? (
    <DisplayPolicyProvider privacyModeOverride={false}>
      {header}
    </DisplayPolicyProvider>
  ) : (
    header
  );
};

export const TradeNote: React.FC<TradeNoteProps> = React.memo(
  function TradeNote({ data, onEditClick, shareOptions }) {
    
    const [filePath, setFilePath] = useState<string>(
      data.filePath || 'unknown'
    );

    
    const [reviewStatus, setReviewStatus] = useState({
      reviewed: data.reviewed,
      reviewedAt: data.reviewedAt,
    });
    const reviewStatusRef = useRef(reviewStatus);
    const reviewStatusWriteInFlightRef = useRef(false);
    const queuedReviewStatusRef = useRef<{
      reviewed: boolean;
      reviewedAt: string | undefined;
      persistedReviewedAt: string;
    } | null>(null);

    
    const [templateRefreshKey, setTemplateRefreshKey] = useState(0);

    
    useEventBus('trade-template:changed', () => {
      setTemplateRefreshKey((k) => k + 1);
    });
    useEventBus('default-template:changed', ({ type }) => {
      if (type === 'trade') setTemplateRefreshKey((k) => k + 1);
    });

    
    useEffect(() => {
      if (
        reviewStatusWriteInFlightRef.current ||
        queuedReviewStatusRef.current
      ) {
        return;
      }

      const nextReviewStatus = {
        reviewed: data.reviewed,
        reviewedAt: data.reviewedAt,
      };
      reviewStatusRef.current = nextReviewStatus;
      setReviewStatus({
        reviewed: data.reviewed,
        reviewedAt: data.reviewedAt,
      });
    }, [data.reviewed, data.reviewedAt]);

    
    const containerRef = useRef<HTMLDivElement>(null);

    
    const plugin = usePlugin();
    const isShare = shareOptions !== undefined;
    const liveLabelColors = useTradeLabelColorData(isShare ? null : plugin);
    const labelColors = shareOptions
      ? shareOptions.presentation.labelColors
      : liveLabelColors;
    const { service: accountPageService } = useAccountPageService();
    const [customFieldDefinitions, setCustomFieldDefinitions] = useState<
      CustomFieldDefinition[]
    >(() => plugin?.customFieldsService?.getFields() || []);

    useEffect(() => {
      if (!plugin) return;

      const updateFields = () => {
        setCustomFieldDefinitions(
          plugin.customFieldsService?.getFields() || []
        );
      };

      updateFields();
      plugin.app.workspace.on('journalit-custom-fields-changed', updateFields);

      return () => {
        plugin.app.workspace.off(
          'journalit-custom-fields-changed',
          updateFields
        );
      };
    }, [plugin]);

    const hasCustomFieldContent = React.useMemo(
      () =>
        hasTradeCustomFieldDisplayEntries(
          data,
          customFieldDefinitions,
          plugin?.settings.trade.dateFormat
        ),
      [data, customFieldDefinitions, plugin?.settings.trade.dateFormat]
    );

    const [
      liveBreakEvenAccountCurrentBalance,
      dispatchBreakEvenAccountBalance,
    ] = useReducer(
      (_state: number | undefined, balance: number | undefined) => balance,
      undefined
    );
    const [accountBalanceRefreshKey, setAccountBalanceRefreshKey] = useState(0);

    useEventBus('account:changed', () => {
      setAccountBalanceRefreshKey((key) => key + 1);
    });

    const tradeAccountIdentityInput = React.useMemo(
      () => ({ account: data.account }),
      [data.account]
    );

    useEffect(() => {
      if (isShare) return;
      let isMounted = true;

      const resolveBreakEvenBalance = async () => {
        if (
          !accountPageService ||
          (plugin?.settings?.trade?.breakEvenThresholdMode ?? 'fixed') !==
            'percentage_current_balance'
        ) {
          if (isMounted) {
            dispatchBreakEvenAccountBalance(undefined);
          }
          return;
        }

        try {
          const balanceLookup =
            await fetchBreakEvenAccountBalanceLookup(plugin);
          const resolution = resolveBreakEvenAccountBalances(
            tradeAccountIdentityInput,
            balanceLookup
          );

          if (!isMounted) return;

          dispatchBreakEvenAccountBalance(resolution.singleBalance);
        } catch {
          if (isMounted) {
            dispatchBreakEvenAccountBalance(undefined);
          }
        }
      };

      void resolveBreakEvenBalance();

      return () => {
        isMounted = false;
      };
    }, [
      plugin,
      accountPageService,
      tradeAccountIdentityInput,
      data.entryTime,
      data.tradeId,
      plugin?.settings?.trade?.breakEvenThresholdMode,
      plugin?.settings?.backendIntegration?.accountMapping,
      accountBalanceRefreshKey,
      isShare,
    ]);

    
    const { metrics, formatTime } = useTradeMetrics({
      data,
      breakEvenRange: plugin?.settings?.trade,
      breakEvenAccountCurrentBalance: shareOptions
        ? shareOptions.presentation.breakEvenAccountCurrentBalance
        : liveBreakEvenAccountCurrentBalance,
    });

    
    
    
    const tradeTemplate = React.useMemo<TradeTemplate | null>(() => {
      if (!plugin) return null;
      return resolveDefaultTradeTemplate(plugin);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- templateRefreshKey is the change signal for settings-backed layouts
    }, [plugin, templateRefreshKey]);

    const effectiveTradeTemplate = React.useMemo(
      () => getEffectiveTradeTemplate(tradeTemplate, data.assetType),
      [tradeTemplate, data.assetType]
    );
    const tradeNoteSectionOrder = React.useMemo(
      () => getTradeNoteSectionOrder(effectiveTradeTemplate),
      [effectiveTradeTemplate]
    );

    useEffect(() => {
      
      
      const container = containerRef.current;
      if (container) {
        container.classList.add('trade-note-mounted');
        container.setAttribute('data-mounted-at', Date.now().toString());

        const parentContainer = container.closest('.journalit-trade-view');
        if (parentContainer) {
          parentContainer.classList.add('trade-note-mounted');
          parentContainer.setAttribute(
            'data-mounted-at',
            Date.now().toString()
          );
          parentContainer.removeAttribute('data-rendering-started-at');
        }

        return () => {
          container.classList.remove('trade-note-mounted');
          container.removeAttribute('data-mounted-at');

          if (parentContainer) {
            parentContainer.classList.remove('trade-note-mounted');
            parentContainer.removeAttribute('data-mounted-at');
          }
        };
      }

      return undefined;
    }, []);

    
    const setContainerRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;

        
        if (node && (!filePath || filePath === 'unknown')) {
          
          const filePathFromContainer = node.getAttribute(
            'data-displaying-file'
          );
          if (filePathFromContainer) {
            setFilePath(filePathFromContainer);
            return;
          }

          
          let parent = node.parentElement;
          while (parent) {
            const filePathFromParent =
              parent.getAttribute('data-displaying-file') ||
              parent.getAttribute('data-file-path');
            if (filePathFromParent) {
              setFilePath(filePathFromParent);
              break;
            }
            parent = parent.parentElement;
          }
        }
      },
      [filePath]
    );

    
    const handleAccountClick = async (accountIdOrName: string) => {
      if (!plugin?.viewManager) {
        console.error('Cannot navigate to account: ViewManager not available');
        return;
      }

      try {
        let accountName = accountIdOrName;

        
        if (accountPageService) {
          try {
            const allAccounts = await accountPageService.getAccountCatalog();
            const account = allAccounts.find(
              (acc) =>
                acc.id === accountIdOrName || acc.name === accountIdOrName
            );

            
            if (account && account.name) {
              accountName = account.name;
            }
          } catch (error) {
            console.warn(
              'Could not resolve account via AccountPageService, using provided value:',
              error
            );
            
          }
        }

        
        await plugin.viewManager.openAccountPageView(accountName);
      } catch (error) {
        console.error('Error navigating to account page:', error);
      }
    };

    
    const handleEditClick = useCallback(() => {
      if (onEditClick) {
        onEditClick(data);
      }
    }, [data, onEditClick]);

    const flushQueuedReviewStatus = useCallback(() => {
      if (
        reviewStatusWriteInFlightRef.current ||
        !plugin ||
        !filePath ||
        filePath === 'unknown'
      ) {
        return;
      }

      if (data.isMissedTrade !== true && !plugin.tradeService) return;

      const nextReviewStatus = queuedReviewStatusRef.current;
      if (!nextReviewStatus) return;
      queuedReviewStatusRef.current = null;
      reviewStatusWriteInFlightRef.current = true;
      void (async () => {
        try {
          await updateTradeNoteReviewStatus(
            plugin,
            data,
            filePath,
            nextReviewStatus.reviewed,
            nextReviewStatus.persistedReviewedAt
          );
        } catch (error: unknown) {
          console.error('[TradeNote] Error updating review status:', error);
          queuedReviewStatusRef.current = null;
          const revertedReviewStatus = {
            reviewed: data.reviewed,
            reviewedAt: data.reviewedAt,
          };
          reviewStatusRef.current = revertedReviewStatus;
          setReviewStatus(revertedReviewStatus);
        } finally {
          reviewStatusWriteInFlightRef.current = false;
          if (queuedReviewStatusRef.current) {
            flushQueuedReviewStatus();
          }
        }
      })();
    }, [plugin, filePath, data]);

    
    const handleToggleReviewed = useCallback(() => {
      if (!plugin || !filePath || filePath === 'unknown') return;
      if (data.isMissedTrade !== true && !plugin.tradeService) return;

      const nextReviewed = reviewStatusRef.current.reviewed !== true;
      const timestamp = nextReviewed ? new Date().toISOString() : '';
      const nextReviewStatus = {
        reviewed: nextReviewed,
        reviewedAt: nextReviewed ? timestamp : undefined,
      };

      reviewStatusRef.current = nextReviewStatus;
      queuedReviewStatusRef.current = {
        ...nextReviewStatus,
        persistedReviewedAt: timestamp,
      };
      setReviewStatus(nextReviewStatus);
      flushQueuedReviewStatus();
    }, [plugin, filePath, data.isMissedTrade, flushQueuedReviewStatus]);

    const showNavigationSection =
      effectiveTradeTemplate?.sections?.navigation?.show !== false;
    const showReviewButtonSection =
      effectiveTradeTemplate?.sections?.reviewButton?.show !== false;
    
    const showRating =
      effectiveTradeTemplate?.sections?.rating?.show !== false &&
      (!shareOptions ||
        (shareOptions.sections.has('rating') &&
          data.tradeRating !== undefined));

    return (
      <div
        className="trade-note-container"
        ref={setContainerRef}
        data-file-path={filePath}
      >
        
        <TradeNoteHeader
          data={data}
          filePath={filePath}
          plugin={plugin}
          metrics={metrics}
          shareOptions={shareOptions}
          reviewed={reviewStatus.reviewed === true}
          showNavigationSection={showNavigationSection}
          onEditClick={handleEditClick}
          onToggleReviewed={
            showReviewButtonSection
              ? () => void handleToggleReviewed()
              : undefined
          }
        />

        
        <div className="trade-note-content">
          {tradeNoteSectionOrder.map((sectionId) => {
            if (
              shareOptions &&
              (sectionId === 'navigation' ||
                sectionId === 'reviewButton' ||
                !shareOptions.sections.has(sectionId))
            )
              return null;
            switch (sectionId) {
              case 'navigation':
                return null;
              case 'images':
                return effectiveTradeTemplate?.sections?.images?.show !==
                  false ? (
                  <TradeImageSection
                    key={sectionId}
                    images={data.images}
                    onEditClick={handleEditClick}
                    sourcePath={filePath}
                    layout={resolveTradeShareImageLayout(
                      shareOptions?.imageLayout ?? 'current',
                      effectiveTradeTemplate?.sections?.images?.layout ??
                        'carousel'
                    )}
                  />
                ) : null;
              case 'metrics':
                return effectiveTradeTemplate?.sections?.details?.show !==
                  false ? (
                  <TradeDetailsSection
                    key={sectionId}
                    data={data}
                    metrics={metrics}
                    defaultRiskAmount={
                      plugin?.settings?.trade?.defaultRiskAmount
                    }
                    formatTime={formatTime}
                    config={effectiveTradeTemplate?.sections?.details}
                    section="metrics"
                    shareOptions={shareOptions}
                    rating={
                      showRating ? (
                        <TradeRatingCard
                          data={data}
                          filePath={filePath}
                          readOnly={Boolean(shareOptions)}
                        />
                      ) : null
                    }
                  />
                ) : null;
              case 'thesis':
                return isTradeThesisSectionVisible(effectiveTradeTemplate) ? (
                  <TradeDetailsSection
                    key={sectionId}
                    data={data}
                    metrics={metrics}
                    defaultRiskAmount={
                      plugin?.settings?.trade?.defaultRiskAmount
                    }
                    formatTime={formatTime}
                    config={effectiveTradeTemplate?.sections?.details}
                    section="thesis"
                  />
                ) : null;
              case 'missedReason':
                return data.isMissedTrade === true &&
                  data.missedReason &&
                  isMissedReasonVisible(effectiveTradeTemplate) ? (
                  <MissedTradeReasonSection
                    key={sectionId}
                    reason={data.missedReason}
                  />
                ) : null;
              case 'metadata':
                return effectiveTradeTemplate?.sections?.metadata?.show !==
                  false ? (
                  <TradeMetadataSection
                    key={sectionId}
                    data={data}
                    onAccountClick={handleAccountClick}
                    config={effectiveTradeTemplate?.sections?.metadata}
                    labelColors={labelColors}
                  >
                    {effectiveTradeTemplate?.sections?.metadata
                      ?.showCustomFields !== false &&
                      hasCustomFieldContent && (
                        <TradeCustomFieldsSection data={data} />
                      )}
                  </TradeMetadataSection>
                ) : null;
              case 'reviewButton':
                return effectiveTradeTemplate?.sections?.reviewButton?.show !==
                  false ? (
                  <div
                    key={sectionId}
                    className="trade-note-review-section"
                    {...shareCaptureExcludeProps}
                  >
                    <TradeNoteReviewButton
                      reviewed={reviewStatus.reviewed}
                      reviewedAt={reviewStatus.reviewedAt}
                      onToggleReviewed={handleToggleReviewed}
                    />
                  </div>
                ) : null;
            }
          })}
        </div>
      </div>
    );
  }
);


const TradeNavigationSection: React.FC<{
  data: TradeNoteProps['data'];
  filePath: string;
}> = React.memo(function TradeNavigationSection({ data, filePath }) {
  const plugin = usePlugin();
  const [navigationState, dispatchNavigationState] = useReducer(
    (
      state: { trades: TFile[]; missedTrades: TFile[]; isLoading: boolean },
      action:
        | { type: 'clear' }
        | { type: 'loading'; isLoading: boolean }
        | { type: 'loaded'; trades: TFile[]; missedTrades: TFile[] }
    ) => {
      switch (action.type) {
        case 'clear':
          return { trades: [], missedTrades: [], isLoading: false };
        case 'loading':
          return { ...state, isLoading: action.isLoading };
        case 'loaded':
          return {
            trades: action.trades,
            missedTrades: action.missedTrades,
            isLoading: false,
          };
      }
    },
    { trades: [], missedTrades: [], isLoading: false }
  );
  const { trades, missedTrades, isLoading } = navigationState;
  const [isVisible, setIsVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  
  const entryDate = React.useMemo(() => {
    if (data.entryTime) {
      return new Date(data.entryTime);
    }

    
    
    if (data.useDirectPnLInput) {
      
      const pathMatch = filePath.match(/(\d{2})(\d{2})(\d{2})-T\d+\.md$/);
      if (pathMatch) {
        const [, day, month, year] = pathMatch;
        const fullYear = 2000 + parseInt(year, 10);
        return new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));
      }

      
      return new Date();
    }

    return null;
  }, [data.entryTime, data.useDirectPnLInput, filePath]);

  
  
  const dateRange = React.useMemo(() => {
    if (!entryDate || !plugin) {
      return null;
    }

    
    
    const { start, end } = getTradingDayRange(entryDate, plugin);

    return {
      startDate: start,
      endDate: end,
      tradingDay: getTradingDay(entryDate, plugin),
    };
  }, [entryDate, plugin]);

  
  
  const cacheKey = React.useMemo(() => {
    if (!entryDate || !plugin) return '';

    return getTradingDayString(entryDate, plugin);
  }, [entryDate, plugin]);

  
  const containerRef = React.useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      {
        rootMargin: '50px', 
        threshold: 0.1,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  
  const handleTradeDataChange = useCallback(
    (payload: { action?: string }) => {
      const { action } = payload;

      
      if (
        action === 'created' ||
        action === 'updated' ||
        action === 'relocated'
      ) {
        if (cacheKey && plugin) {
          
          window.setTimeout(() => {
            
            plugin.app.saveLocalStorage(
              `${TRADE_NAV_CACHE_PREFIX}${cacheKey}`,
              null
            );

            
            dispatchNavigationState({ type: 'clear' });
            setRefreshTrigger((prev) => prev + 1);
          }, 200); 
        }
      }
    },
    [cacheKey, plugin]
  );

  useEventBus('trade:changed', handleTradeDataChange);
  useEventBus('missed-trade:changed', handleTradeDataChange);
  useEventBus('backtest-trade:changed', handleTradeDataChange);

  
  useEffect(() => {
    
    if (!isVisible || !dateRange || !plugin?.tradeService || !cacheKey) {
      return;
    }

    let isMounted = true;
    let fetchTimeoutId: number | null = null;

    const fetchTradesOnce = async () => {
      try {
        
        const cachedTrades: unknown = plugin.app.loadLocalStorage(
          `${TRADE_NAV_CACHE_PREFIX}${cacheKey}`
        );

        if (cachedTrades) {
          
          const parsedData = parseTradeNavigationCache(cachedTrades);
          if (isMounted) {
            if (!parsedData) {
              return;
            }

            const { trades: tradePaths, missedTrades: missedTradePaths } =
              parsedData;

            
            const tradeFiles = tradePaths.flatMap((path: string) => {
              const abstractFile = plugin.app.vault.getAbstractFileByPath(path);
              return abstractFile instanceof TFile ? [abstractFile] : [];
            });

            const missedTradeFiles = missedTradePaths.flatMap(
              (path: string) => {
                const abstractFile =
                  plugin.app.vault.getAbstractFileByPath(path);
                return abstractFile instanceof TFile ? [abstractFile] : [];
              }
            );

            
            const allCachedPaths = [...tradePaths, ...missedTradePaths];
            const currentTradeInCache = allCachedPaths.includes(filePath);
            const currentTradeExists =
              plugin.app.vault.getAbstractFileByPath(filePath);

            
            if (
              (currentTradeExists && !currentTradeInCache) ||
              (tradeFiles.length === 0 &&
                missedTradeFiles.length === 0 &&
                allCachedPaths.length > 0)
            ) {
              plugin.app.saveLocalStorage(
                `${TRADE_NAV_CACHE_PREFIX}${cacheKey}`,
                null
              );
              
            } else {
              dispatchNavigationState({
                type: 'loaded',
                trades: tradeFiles,
                missedTrades: missedTradeFiles,
              });
              return; 
            }
          }
        }

        
        if (isLoading) return;

        
        fetchTimeoutId = window.setTimeout(() => {
          void (async () => {
            try {
              if (!isMounted) return;
              dispatchNavigationState({ type: 'loading', isLoading: true });

              
              
              const dayTrades = await plugin.tradeService.getTrades(
                dateRange.startDate,
                dateRange.endDate
              );

              
              let dayMissedTrades: TFile[] = [];
              try {
                if (plugin.missedTradeService?.getMissedTrades) {
                  dayMissedTrades =
                    await plugin.missedTradeService.getMissedTrades(
                      dateRange.tradingDay,
                      dateRange.tradingDay
                    );
                }
              } catch (error) {
                console.warn(
                  '[TradeNote] Failed to fetch missed trades:',
                  error
                );
              }

              
              if (isMounted) {
                dispatchNavigationState({
                  type: 'loaded',
                  trades: dayTrades,
                  missedTrades: dayMissedTrades,
                });

                
                try {
                  
                  const tradePaths = dayTrades.map((file) => file.path);
                  const missedTradePaths = dayMissedTrades.map(
                    (file) => file.path
                  );
                  plugin.app.saveLocalStorage(
                    `${TRADE_NAV_CACHE_PREFIX}${cacheKey}`,
                    {
                      trades: tradePaths,
                      missedTrades: missedTradePaths,
                    }
                  );
                } catch (cacheError) {
                  console.warn('Error caching trades:', cacheError);
                }
              }
            } catch (error) {
              console.error('Error fetching trades for day:', error);
            } finally {
              if (isMounted) {
                dispatchNavigationState({ type: 'loading', isLoading: false });
              }
            }
          })();
        }, 100); 
      } catch (error) {
        console.error('Error in trade fetch setup:', error);
        if (isMounted) {
          dispatchNavigationState({ type: 'loading', isLoading: false });
        }
      }
    };

    void fetchTradesOnce();

    
    return () => {
      isMounted = false;
      if (fetchTimeoutId) {
        window.clearTimeout(fetchTimeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isLoading intentionally excluded: including it causes race condition where dispatchNavigationState({ type: 'loading', isLoading: true }) triggers cleanup before async fetch completes
  }, [
    isVisible,
    dateRange,
    plugin?.tradeService,
    cacheKey,
    plugin,
    refreshTrigger,
    filePath,
  ]);

  
  const handleNavigate = useCallback(
    (path: string, openInNewLeaf: boolean = false) => {
      try {
        if (plugin && plugin.openFile) {
          void plugin.openFile(path, openInNewLeaf);
        } else if (plugin?.app) {
          void plugin.app.workspace.openLinkText(path, '', openInNewLeaf);
        } else {
          console.error(
            'Cannot navigate: Plugin and App context not available.'
          );
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    },
    [plugin]
  );

  
  if (!entryDate) {
    return null;
  }

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <TradeNavigation
          trades={trades}
          missedTrades={missedTrades}
          currentTradePath={filePath}
          navigateTo={handleNavigate}
        />
      ) : null}
    </div>
  );
});
