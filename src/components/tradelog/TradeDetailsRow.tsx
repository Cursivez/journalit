

import React, { useState, memo, useCallback, useMemo } from 'react';
import { Modal, Notice } from 'obsidian';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Users,
  Tag,
} from '../shared/icons/ObsidianIcon';
import { Image } from '../shared/icons/ObsidianIcon';
import { imageService } from '../../services/image/ImageService';
import {
  isExcalidrawMediaPath,
  resolveMediaDisplayPath,
} from '../../utils/imageMediaUtils';
import { getApp } from '../../utils/obsidian';
import { FullscreenPortal } from '../image/FullscreenPortal';
import { FullscreenImageViewer } from '../image/FullscreenImageViewer';
import { ExcalidrawMediaEmbed } from '../image/ExcalidrawMediaEmbed';
import {
  formatDuration,
  calculateEffectiveRMultiple,
} from '../../utils/formatting';
import {
  formatDateDisplay,
  safeParseDateValue,
  safeGetTime,
  getDaysToExpiry,
} from '../../utils/dateUtils';
import { Tooltip } from '../shared/Tooltip';
import { ImageNavigationContext } from '../../types/image';
import {
  isTradeOpenWithContext,
  getTradeDisplayStatusWithContext,
  getEffectivePnL,
  hasRealizedStoredPnL,
  getPartialExitInfo,
  PartialExitInfo,
  getWeightedAverageEntryPrice,
  getResolvedWeightedAverageExitPrice,
  calculateTradePriceMove,
  getFirstEntryTime,
  getLastExitTime,
} from '../../utils/tradeStatusUtils';
import {
  calculateTradeMaxR,
  calculateTradeReturnPercent,
  getTradeMaeValue,
  getTradeMfeValue,
} from './tradeMetricUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { usePlugin } from '../../hooks/usePlugin';
import { useDisplayPolicy } from '../../hooks/useDisplayPolicy';
import {
  formatDisplayValue,
  shouldMaskValue,
  type DisplayValueOptions,
} from '../../services/display/DisplayPolicy';
import { getDisplayPnL, getAccountCount } from '../../utils/pnlUtils';
import {
  calculateStopLossRiskAmount,
  canCalculateStopLossRiskAmount,
  resolveTradeRiskAmount,
} from '../../utils/riskCalculation';
import { calculateTotalDividends } from '../../utils/pnlCalculation';
import { ColumnDefinition } from './columnConfig';
import { TradeFrontmatter } from '../../types/TradeFrontmatter';
import JournalitPlugin from '../../main';
import { CustomFieldType } from '../../types/customFields';
import { parseStoredDateLikeValue } from '../../utils/customFieldPersistence';
import {
  getCustomFieldCollapsedMultiselectDisplayMode,
  getCustomFieldDisplayValues,
  getCustomFieldRawValue,
} from './customFieldDisplay';
import { getTradeDirectionDisplayKind } from '../../services/trade/core/TradeDirection';
import { getTradeDirectionDisplayLabel } from '../../utils/tradeDirectionDisplay';
import {
  getCopyTradeAdjustment,
  getCopyTradeBaseKey,
} from '../../utils/copyTradePnL';
import { normalizeAccountLookupKey } from '../../services/trade/core/TradeAccountIdentity';
import { eventBus } from '../../services/events';


type TradeWithPath = TradeFrontmatter & {
  filePath?: string;
  path?: string;
  isCopiedTrade?: boolean;
  copiedFromAccount?: string;
  copyMultiplier?: number;
  copyAccountLookupKey?: string;
  copyPnlAdjustment?: number;
  copyBaseTradeKey?: string;
  copySourceFilePath?: string;
  copiedToAccounts?: Array<{
    account: string;
    pnl: number;
    multiplier: number;
  }>;
};

type TradeLogFilterSyncWindow = Window & {
  journalitSyncTradeLogFilters?: () => void;
};

class CopyTradePnlAdjustmentModal extends Modal {
  private readonly currentAdjustment: number;
  private readonly currentNetPnl: number;
  private readonly formatPnl: (value: number) => string;
  private readonly isPnlMasked: boolean;
  private readonly onSubmit: (adjustment: number) => void;

  constructor(
    plugin: JournalitPlugin,
    currentAdjustment: number,
    currentNetPnl: number,
    formatPnl: (value: number) => string,
    isPnlMasked: boolean,
    onSubmit: (adjustment: number) => void
  ) {
    super(plugin.app);
    this.currentAdjustment = currentAdjustment;
    this.currentNetPnl = currentNetPnl;
    this.formatPnl = formatPnl;
    this.isPnlMasked = isPnlMasked;
    this.onSubmit = onSubmit;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('journalit-copy-trade-adjustment-modal');
    this.titleEl.setText(t('tradelog.copy-trade.adjustment-title'));

    const description = contentEl.createDiv({
      cls: 'journalit-copy-trade-adjustment-modal__description',
    });
    description.createEl('p', {
      text: t('tradelog.copy-trade.adjustment-description-primary'),
    });
    description.createEl('p', {
      text: t('tradelog.copy-trade.adjustment-description-secondary'),
    });

    const input = contentEl.createEl('input', {
      type: 'number',
      value: String(this.currentAdjustment),
      attr: {
        step: '0.01',
        'aria-label': t('tradelog.copy-trade.adjustment-action'),
      },
    });

    const preview = contentEl.createDiv({
      cls: 'journalit-copy-trade-adjustment-modal__preview',
    });
    preview.createSpan({
      text: t('tradelog.copy-trade.adjustment-preview'),
    });
    const previewValue = preview.createSpan({
      cls: 'journalit-copy-trade-adjustment-modal__preview-value',
    });

    const updatePreview = () => {
      const nextAdjustment = Number(input.value);
      if (!Number.isFinite(nextAdjustment)) {
        previewValue.setText('—');
        previewValue.classList.remove('positive', 'negative', 'neutral');
        return;
      }

      const nextNetPnl =
        this.currentNetPnl - this.currentAdjustment + nextAdjustment;
      previewValue.setText(this.formatPnl(nextNetPnl));
      previewValue.classList.remove('positive', 'negative', 'neutral');
      previewValue.addClass(
        this.isPnlMasked
          ? 'neutral'
          : nextNetPnl > 0
            ? 'positive'
            : nextNetPnl < 0
              ? 'negative'
              : 'neutral'
      );
    };
    updatePreview();

    const buttonRow = contentEl.createDiv({ cls: 'modal-button-container' });
    const cancelButton = buttonRow.createEl('button', {
      text: t('button.cancel'),
    });
    const saveButton = buttonRow.createEl('button', {
      text: t('button.save-changes'),
      cls: 'mod-cta',
    });

    const submit = () => {
      const pnlAdjustment = Number(input.value);
      if (!Number.isFinite(pnlAdjustment)) {
        new Notice(t('tradelog.copy-trade.adjustment-invalid'));
        return;
      }

      this.onSubmit(pnlAdjustment);
      this.close();
    };

    saveButton.addEventListener('click', submit);
    cancelButton.addEventListener('click', () => this.close());
    input.addEventListener('input', updatePreview);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        submit();
      }
    });
    input.focus();
    input.select();
  }
}

function isTradeLogPrivacyExempt(trade: TradeWithPath): boolean {
  return (
    trade.isMissedTrade === true ||
    trade.isBacktestTrade === true ||
    trade.type === 'missed-trade' ||
    trade.type === 'backtest-trade'
  );
}

interface TradeDetailsRowProps {
  trade: TradeWithPath;
  depth: number;
  isLastChild?: boolean;
  onClick: () => void;
  viewLevel?: 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'trades';
  visibleColumns?: ColumnDefinition[];
  gridTemplate?: string;
  isSelected?: boolean;
  onToggleSelection?: (
    tradeId: string,
    e?:
      | React.MouseEvent
      | React.KeyboardEvent
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
  isMultiSelectMode?: boolean;
  isExpandedMode?: boolean;
}

function getDuplicateAwareStringKeys(values: string[]): string[] {
  const occurrenceByValue = new Map<string, number>();
  return values.map((value) => {
    const occurrence = occurrenceByValue.get(value) ?? 0;
    occurrenceByValue.set(value, occurrence + 1);
    return JSON.stringify([value, occurrence]);
  });
}


const MistakesTooltipContent = memo<{ mistakes: string[] }>(({ mistakes }) => {
  const mistakeKeys = getDuplicateAwareStringKeys(mistakes);
  return (
    <div className="mistakes-tooltip">
      <div className="tooltip-title">{t('tradelog.tooltip.mistakes')}</div>
      {mistakes.map((mistake, index) => (
        <div key={mistakeKeys[index]} className="tooltip-item">
          • {mistake}
        </div>
      ))}
    </div>
  );
});
MistakesTooltipContent.displayName = 'MistakesTooltipContent';

const SetupsTooltipContent = memo<{ setups: string[] }>(({ setups }) => {
  const setupKeys = getDuplicateAwareStringKeys(setups);
  return (
    <div className="setups-tooltip">
      <div className="tooltip-title">{t('tradelog.tooltip.setups')}</div>
      {setups.map((setup, index) => (
        <div key={setupKeys[index]} className="tooltip-item">
          • {setup}
        </div>
      ))}
    </div>
  );
});
SetupsTooltipContent.displayName = 'SetupsTooltipContent';

const CustomTagsTooltipContent = memo<{ tags: string[] }>(({ tags }) => {
  const tagKeys = getDuplicateAwareStringKeys(tags);
  return (
    <div className="custom-tags-tooltip">
      <div className="tooltip-title">{t('tradelog.tooltip.tags')}</div>
      {tags.map((tag, index) => (
        <div key={tagKeys[index]} className="tooltip-item">
          • {tag}
        </div>
      ))}
    </div>
  );
});
CustomTagsTooltipContent.displayName = 'CustomTagsTooltipContent';

const ThesisTooltipContent = memo<{ thesis: string }>(({ thesis }) => (
  <div className="thesis-tooltip">
    <div className="tooltip-title">{t('tradelog.tooltip.thesis')}</div>
    <div className="tooltip-content">{thesis}</div>
  </div>
));
ThesisTooltipContent.displayName = 'ThesisTooltipContent';

const MTCommentTooltipContent = memo<{ mtComment: string }>(({ mtComment }) => (
  <div className="mt-comment-tooltip">
    <div className="tooltip-title">{t('tradelog.tooltip.mtComment')}</div>
    <div className="tooltip-content">{mtComment}</div>
  </div>
));
MTCommentTooltipContent.displayName = 'MTCommentTooltipContent';

const AccountsTooltipContent = memo<{ accounts: string[] }>(({ accounts }) => {
  const accountKeys = getDuplicateAwareStringKeys(accounts);
  return (
    <div className="accounts-tooltip">
      <div className="tooltip-title">{t('tradelog.tooltip.accounts')}</div>
      {accounts.map((account, index) => (
        <div key={accountKeys[index]} className="tooltip-item">
          • {account}
        </div>
      ))}
    </div>
  );
});
AccountsTooltipContent.displayName = 'AccountsTooltipContent';

const CopiedAccountsTooltipContent = memo<{
  copiedToAccounts: NonNullable<TradeWithPath['copiedToAccounts']>;
  currency: string;
  formatValue: (options: DisplayValueOptions) => string;
}>(({ copiedToAccounts, currency, formatValue }) => (
  <div className="accounts-tooltip">
    <div className="tooltip-title">
      {t('tradelog.copy-trade.base-tooltip-title')}
    </div>
    {copiedToAccounts.map((copyAccount) => (
      <div key={copyAccount.account} className="tooltip-item">
        • {copyAccount.account}:{' '}
        {formatValue({
          kind: 'pnl',
          value: copyAccount.pnl,
          currencyCode: currency,
        })}{' '}
        ({copyAccount.multiplier}x)
      </div>
    ))}
  </div>
));
CopiedAccountsTooltipContent.displayName = 'CopiedAccountsTooltipContent';

const PartialExitTooltipContent = memo<{
  partialInfo: PartialExitInfo;
  currency: string;
  assetType?: string;
  totalDividends?: number;
  formatValue: (options: DisplayValueOptions) => string;
}>(({ partialInfo, currency, assetType, totalDividends = 0, formatValue }) => (
  <div className="partial-exit-tooltip">
    <div className="tooltip-title">{t('tradelog.tooltip.partial-exits')}</div>
    {partialInfo.exits.map((exit, index) => (
      <div
        key={JSON.stringify([exit.time, exit.price, exit.size, index])}
        className="tooltip-item"
      >
        • {formatValue({ kind: 'positionSize', value: exit.size })} @{' '}
        {formatValue({
          kind: 'price',
          value: exit.price,
          currencyCode: currency,
          precision: assetType === 'forex' ? 5 : 2,
        })}{' '}
        ={' '}
        {formatValue({ kind: 'pnl', value: exit.pnl, currencyCode: currency })}
      </div>
    ))}
    {totalDividends !== 0 && (
      <div className="tooltip-item">
        • {t('tradelog.column.dividends')} ={' '}
        {formatValue({
          kind: 'pnl',
          value: totalDividends,
          currencyCode: currency,
        })}
      </div>
    )}
    <div className="tooltip-item tooltip-remaining">
      {formatValue({ kind: 'positionSize', value: partialInfo.remainingSize })}{' '}
      {t('tradelog.tooltip.still-open')}
    </div>
  </div>
));
PartialExitTooltipContent.displayName = 'PartialExitTooltipContent';

const GenericListTooltipContent = memo<{
  title: string;
  values: string[];
}>(({ title, values }) => {
  const valueKeys = getDuplicateAwareStringKeys(values);
  return (
    <div className="custom-tags-tooltip">
      <div className="tooltip-title">{title}</div>
      {values.map((value, index) => (
        <div key={valueKeys[index]} className="tooltip-item">
          • {value}
        </div>
      ))}
    </div>
  );
});
GenericListTooltipContent.displayName = 'GenericListTooltipContent';

function formatCustomNumberValue(value: unknown): string | null {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return numericValue.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function formatCustomTimeValue(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatPriceMoveValue(value: number, assetType?: string): string {
  const isWholeNumber = Number.isInteger(value);
  return value.toLocaleString(undefined, {
    minimumFractionDigits: isWholeNumber ? 0 : 2,
    maximumFractionDigits: assetType === 'forex' ? 5 : 2,
  });
}

function shouldShowSimpleValueTooltip(displayValue: string): boolean {
  return displayValue.trim().length > 12;
}


function formatPositionSizeCompact(value: number): {
  display: string;
  full: string;
  needsTooltip: boolean;
} {
  if (!Number.isFinite(value)) {
    return { display: '-', full: '-', needsTooltip: false };
  }
  const full = value.toString();

  
  if (value >= 1000000) {
    const millions = value / 1000000;
    const display =
      millions >= 10
        ? `${Math.round(millions)}M`
        : `${millions.toFixed(1).replace(/\.0$/, '')}M`;
    return { display, full, needsTooltip: true };
  }
  if (value >= 10000) {
    const thousands = value / 1000;
    const display =
      thousands >= 10
        ? `${Math.round(thousands)}K`
        : `${thousands.toFixed(1).replace(/\.0$/, '')}K`;
    return { display, full, needsTooltip: true };
  }

  
  if (Number.isInteger(value)) {
    return { display: value.toLocaleString(), full, needsTooltip: false };
  }

  
  const rounded = parseFloat(value.toFixed(2));
  const display = rounded.toString();
  const needsTooltip = full !== display; 

  return { display, full, needsTooltip };
}


const TradeDetailsContent = memo<{
  trade: TradeWithPath;
  images: string[];
  status: { label: string; className: string };
  duration: string;
  onImageClick: (
    e: React.MouseEvent | React.KeyboardEvent,
    imagePath: string
  ) => void;
  onTradeActivate: () => void;
  plugin: JournalitPlugin | null;
  visibleColumns?: ColumnDefinition[];
  gridTemplate?: string;
  isSelected?: boolean;
  onToggleSelection?: (
    tradeId: string,
    e?:
      | React.MouseEvent
      | React.KeyboardEvent
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
  isMultiSelectMode?: boolean;
  isExpandedMode?: boolean;
}>(
  ({
    trade,
    images,
    status,
    duration,
    onImageClick,
    onTradeActivate,
    plugin,
    visibleColumns,
    gridTemplate: _gridTemplate,
    isSelected,
    onToggleSelection,
    isMultiSelectMode,
    isExpandedMode,
  }) => {
    const { currency: globalCurrency } = useCurrency();

    
    const currency = trade.currency || globalCurrency;

    
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const applyAccountCountMultiplier = false;
    const displayPolicy = useDisplayPolicy();
    const isPrivacyExemptTrade = isTradeLogPrivacyExempt(trade);
    const effectiveDisplayPolicy = useMemo(
      () =>
        isPrivacyExemptTrade
          ? { ...displayPolicy, privacyMode: false }
          : displayPolicy,
      [displayPolicy, isPrivacyExemptTrade]
    );
    const formatValue = useCallback(
      (options: DisplayValueOptions) =>
        formatDisplayValue(options, effectiveDisplayPolicy),
      [effectiveDisplayPolicy]
    );
    const shouldMask = useCallback(
      (kind: DisplayValueOptions['kind']) =>
        shouldMaskValue(kind, effectiveDisplayPolicy),
      [effectiveDisplayPolicy]
    );
    const isPnlMasked = shouldMask('pnl');
    const isReturnPercentMasked = shouldMask('returnPercent');
    const isRMultipleMasked = shouldMask('rMultiple');
    const isPriceMasked = shouldMask('price');
    const isPositionSizeMasked = shouldMask('positionSize');
    const isPercentageMasked = shouldMask('percentage');
    const isRiskMasked = shouldMask('risk');
    const isNotionalMasked = shouldMask('notional');
    const isFeeMasked = shouldMask('fee');
    const sourcePath = trade.filePath || trade.path || '';

    const handleCheckboxChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation(); 
        if (trade.isCopiedTrade) {
          return;
        }

        const tradeId = trade.filePath || trade.path;
        if (tradeId && onToggleSelection) {
          onToggleSelection(tradeId, e);
        }
      },
      [trade, onToggleSelection]
    );

    const handleAdjustCopiedPnL = useCallback(
      (event: React.MouseEvent | React.KeyboardEvent) => {
        event.stopPropagation();
        if (!plugin || !trade.isCopiedTrade) {
          return;
        }

        const copyAccountName = Array.isArray(trade.account)
          ? trade.account[0]
          : trade.account;
        if (!copyAccountName) {
          return;
        }

        const baseTradeKey = getCopyTradeBaseKey(trade);
        const copyAccountLookupKey =
          trade.copyAccountLookupKey ??
          normalizeAccountLookupKey(copyAccountName);
        const currentAdjustment =
          getCopyTradeAdjustment(plugin, baseTradeKey, copyAccountLookupKey)
            ?.pnlAdjustment ?? 0;

        new CopyTradePnlAdjustmentModal(
          plugin,
          currentAdjustment,
          getEffectivePnL(trade),
          (value) =>
            formatValue({
              kind: 'pnl',
              value,
              currencyCode: currency,
            }),
          isPnlMasked,
          (pnlAdjustment) => {
            const currentSettings = plugin.settings.copyTradeAdjustments ?? {};
            const accountAdjustments = currentSettings[baseTradeKey] ?? {};
            plugin.settings.copyTradeAdjustments = {
              ...currentSettings,
              [baseTradeKey]: {
                ...accountAdjustments,
                [copyAccountLookupKey]: { pnlAdjustment },
              },
            };
            void plugin.saveSettings().then(() => {
              eventBus.publish('settings:changed', {
                component: 'TradeLog',
                section: 'copyTradeAdjustments',
                source: 'copy-trade-pnl-adjustment',
              });
              window.setTimeout(() => {
                (
                  window as TradeLogFilterSyncWindow
                ).journalitSyncTradeLogFilters?.();
              }, 0);
              new Notice(t('tradelog.copy-trade.adjustment-saved'));
            });
          }
        ).open();
      },
      [currency, formatValue, isPnlMasked, plugin, trade]
    );

    const handleAdjustCopiedPnLKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        event.preventDefault();
        handleAdjustCopiedPnL(event);
      },
      [handleAdjustCopiedPnL]
    );

    const isTradeOpenForR = useMemo(
      () =>
        isTradeOpenWithContext({
          tradeStatus: trade.tradeStatus,
          exitTime: trade.exitTime,
          exitPrice: trade.exitPrice,
          pnl: trade._originalPnlWasNull ? null : trade.pnl,
          useDirectPnLInput: trade.useDirectPnLInput,
          exits: trade.exits,
          entries: trade.entries,
        }),
      [trade]
    );

    
    const effectiveRMultiple = useMemo(() => {
      const tradeRMultiple = isTradeOpenForR ? undefined : trade.rMultiple;

      return calculateEffectiveRMultiple(
        getEffectivePnL(trade),
        tradeRMultiple,
        trade.riskAmount,
        defaultRiskAmount
      );
    }, [trade, defaultRiskAmount, isTradeOpenForR]);

    const totalDividends = useMemo(
      () => calculateTotalDividends(trade),
      [trade]
    );

    const maxRMultiple = useMemo(
      () => calculateTradeMaxR(trade, defaultRiskAmount),
      [trade, defaultRiskAmount]
    );

    const displayedRiskAmount = useMemo(
      () => resolveTradeRiskAmount(trade),
      [trade]
    );

    const returnPercent = useMemo(
      () => calculateTradeReturnPercent(trade),
      [trade]
    );

    
    const getMultipliedPnL = useMemo(() => {
      const basePnL = getEffectivePnL(trade);
      if (!applyAccountCountMultiplier) {
        return basePnL;
      }
      const accountCount = getAccountCount(trade);
      return getDisplayPnL(basePnL, accountCount, applyAccountCountMultiplier);
    }, [trade, applyAccountCountMultiplier]);

    
    const mistakesArray = useMemo(() => {
      if (!trade.mistake) return [];
      return Array.isArray(trade.mistake) ? trade.mistake : [trade.mistake];
    }, [trade.mistake]);

    const setupsArray = useMemo(() => {
      if (!trade.setup) return [];
      return Array.isArray(trade.setup) ? trade.setup : [trade.setup];
    }, [trade.setup]);

    const customTagsArray = useMemo(() => {
      if (!trade.tags || !Array.isArray(trade.tags)) return [];
      
      return trade.tags
        .filter((tag: string) => typeof tag === 'string' && tag.trim())
        .map((tag: string) => tag.trim());
    }, [trade.tags]);

    const accountsArray = useMemo(() => {
      if (!trade.account) return [];
      const accounts = trade.account;
      return Array.isArray(accounts) ? accounts : [accounts];
    }, [trade.account]);

    
    const partialExitInfo = useMemo(() => {
      return getPartialExitInfo(trade);
    }, [trade]);

    const renderCustomFieldCell = useCallback(
      (column: ColumnDefinition) => {
        const field = column.customField;
        if (!field) {
          return null;
        }

        const rawValue = getCustomFieldRawValue(
          trade as Record<string, unknown>,
          field
        );

        const renderNoData = () => (
          <div key={column.id} className="trade-custom-field-cell">
            <span className="trade-no-data">-</span>
          </div>
        );

        const renderSimpleValue = (
          displayValue: string,
          className: string,
          tooltipContent?: React.ReactNode,
          tooltipClassName = 'trade-log-inline-value-tooltip'
        ) => {
          const showTooltip = shouldShowSimpleValueTooltip(displayValue);
          const content = <span className={className}>{displayValue}</span>;

          return (
            <div key={column.id} className="trade-custom-field-cell">
              {showTooltip ? (
                <Tooltip
                  content={tooltipContent || displayValue}
                  delay={0}
                  preferredPosition="top"
                  className={tooltipClassName}
                >
                  {content}
                </Tooltip>
              ) : (
                content
              )}
            </div>
          );
        };

        if (
          rawValue === undefined ||
          rawValue === null ||
          rawValue === '' ||
          (Array.isArray(rawValue) && rawValue.length === 0)
        ) {
          return renderNoData();
        }

        switch (field.type) {
          case CustomFieldType.MULTISELECT: {
            const values = getCustomFieldDisplayValues(field, rawValue);
            if (values.length === 0) {
              return renderNoData();
            }

            if (isExpandedMode) {
              return (
                <div
                  key={column.id}
                  className="trade-custom-field-cell expanded"
                >
                  <div className="expanded-pills">
                    {values.map((value, index) => (
                      <span
                        key={getDuplicateAwareStringKeys(values)[index]}
                        className="pill pill--tag"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            const collapsedDisplayMode =
              getCustomFieldCollapsedMultiselectDisplayMode(field);
            const tooltipContent = (
              <GenericListTooltipContent
                title={field.tradeLog?.columnLabel || field.label}
                values={values}
              />
            );

            if (collapsedDisplayMode === 'values') {
              return renderSimpleValue(
                values.join(', '),
                'trade-thesis',
                tooltipContent
              );
            }

            return (
              <div key={column.id} className="trade-custom-field-cell">
                <Tooltip
                  content={tooltipContent}
                  delay={0}
                  preferredPosition="top"
                >
                  <span className="journalit-count-badge journalit-count-badge--setups">
                    {values.length}
                  </span>
                </Tooltip>
              </div>
            );
          }

          case CustomFieldType.NUMBER: {
            const numericValue =
              typeof rawValue === 'number' ? rawValue : Number(rawValue);
            if (!Number.isFinite(numericValue)) {
              return renderNoData();
            }

            if (field.tradeLog?.displayAsCurrency) {
              return renderSimpleValue(
                formatValue({
                  kind: 'money',
                  value: numericValue,
                  currencyCode: currency,
                }),
                isFeeMasked
                  ? 'trade-money-value journalit-privacy-mask'
                  : 'trade-money-value'
              );
            }

            const formattedNumber = formatCustomNumberValue(numericValue);
            if (!formattedNumber) {
              return renderNoData();
            }

            return renderSimpleValue(formattedNumber, 'trade-position-size');
          }

          case CustomFieldType.DATE: {
            const parsedDate = parseStoredDateLikeValue(
              rawValue as string | Date | undefined
            );
            const displayValue = parsedDate
              ? formatDateDisplay(parsedDate, plugin?.settings.trade.dateFormat)
              : String(rawValue);

            return renderSimpleValue(displayValue, 'trade-date');
          }

          case CustomFieldType.DATETIME: {
            const parsedDateTime = parseStoredDateLikeValue(
              rawValue as string | Date | undefined,
              { includeTime: true }
            );
            const displayValue = parsedDateTime
              ? `${formatDateDisplay(parsedDateTime, plugin?.settings.trade.dateFormat)} ${formatCustomTimeValue(parsedDateTime)}`
              : String(rawValue);

            return renderSimpleValue(
              displayValue,
              'trade-custom-field-datetime-value'
            );
          }

          case CustomFieldType.TIME: {
            const parsedTime = parseStoredDateLikeValue(
              rawValue as string | Date | undefined,
              { timeOnly: true }
            );
            const displayValue = parsedTime
              ? formatCustomTimeValue(parsedTime)
              : String(rawValue);

            return renderSimpleValue(displayValue, 'trade-entry-time');
          }

          case CustomFieldType.DROPDOWN: {
            const displayValue =
              getCustomFieldDisplayValues(field, rawValue)[0] ||
              String(rawValue);
            const showTooltip = shouldShowSimpleValueTooltip(displayValue);
            const content = (
              <span className="pill pill--tag">{displayValue}</span>
            );

            return (
              <div key={column.id} className="trade-custom-field-cell">
                {showTooltip ? (
                  <Tooltip
                    content={displayValue}
                    delay={0}
                    preferredPosition="top"
                    className="trade-log-inline-value-tooltip"
                  >
                    {content}
                  </Tooltip>
                ) : (
                  content
                )}
              </div>
            );
          }

          case CustomFieldType.TEXT:
          default:
            return renderSimpleValue(String(rawValue), 'trade-thesis');
        }
      },
      [trade, isExpandedMode, plugin, currency, formatValue, isFeeMasked]
    );

    
    const renderCell = useCallback(
      (column: ColumnDefinition) => {
        if (column.customField) {
          return renderCustomFieldCell(column);
        }

        const columnId = column.id;
        switch (columnId) {
          case 'select':
            if (!isMultiSelectMode) return null;
            return (
              <div key="select" className="trade-select-cell">
                <input
                  type="checkbox"
                  className="trade-select-checkbox"
                  checked={isSelected || false}
                  disabled={trade.isCopiedTrade}
                  onChange={handleCheckboxChange}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={t('common.select-item', {
                    item: trade.instrument || t('common.trade'),
                  })}
                />
              </div>
            );

          case 'image':
            return (
              <div key="image" className="trade-image-cell">
                {images.length > 0 ? (
                  <div
                    className="trade-image-wrapper"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => onImageClick(e, images[0])}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      onImageClick(e, images[0]);
                    }}
                  >
                    <div className="trade-preview-thumbnail">
                      {isExcalidrawMediaPath(
                        getApp(),
                        images[0],
                        sourcePath
                      ) ? (
                        <div className="journalit-trade-preview-thumbnail-excalidraw">
                          <ExcalidrawMediaEmbed
                            path={images[0]}
                            sourcePath={sourcePath}
                          />
                        </div>
                      ) : (
                        <img
                          src={imageService.resolveMediaPath(
                            resolveMediaDisplayPath(
                              getApp(),
                              images[0],
                              sourcePath
                            )
                          )}
                          alt={t('common.trade')}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </div>
                    {images.length > 1 && (
                      <span className="trade-image-count">
                        +{images.length - 1}
                      </span>
                    )}
                  </div>
                ) : (
                  <Image size={20} className="trade-no-image-icon" />
                )}
              </div>
            );

          case 'ticker':
            return (
              <div key="ticker" className="trade-ticker-cell">
                <span className="trade-ticker">{trade.instrument}</span>
                {trade.performanceIndicator === 'best' && (
                  <Award
                    size={14}
                    className="performance-badge performance-badge--best"
                  />
                )}
                {trade.performanceIndicator === 'worst' && (
                  <AlertTriangle
                    size={14}
                    className="performance-badge performance-badge--worst"
                  />
                )}
              </div>
            );

          case 'direction': {
            const directionKind = getTradeDirectionDisplayKind({
              direction: trade.direction,
              assetType: trade.assetType,
              optionType: trade.optionType,
            });
            const directionLabel = getTradeDirectionDisplayLabel(
              {
                direction: trade.direction,
                assetType: trade.assetType,
                optionType: trade.optionType,
              },
              trade.direction ?? '-'
            );
            return (
              <div key="direction" className="trade-direction-cell">
                <span
                  className={`trade-direction trade-direction--${directionKind}`}
                >
                  {directionLabel}
                </span>
              </div>
            );
          }

          case 'status': {
            const isOutcomeStatus = [
              'status-win',
              'status-loss',
              'status-breakeven',
            ].includes(status.className);
            const statusLabel =
              isPnlMasked && isOutcomeStatus
                ? t('tradelog.filter.closed').toUpperCase()
                : status.label;
            const statusClassName =
              isPnlMasked && isOutcomeStatus
                ? 'status-closed'
                : status.className;

            return (
              <div key="status" className="trade-status-cell">
                <span className={`trade-status ${statusClassName}`}>
                  {statusLabel}
                </span>
              </div>
            );
          }

          case 'pnl': {
            
            if (
              status.className === 'status-open' &&
              partialExitInfo.isPartialExit
            ) {
              const partialPnL = hasRealizedStoredPnL(trade)
                ? getEffectivePnL(trade)
                : partialExitInfo.realizedPnL + totalDividends;
              
              const partialRMultiple = calculateEffectiveRMultiple(
                partialPnL,
                undefined,
                trade.riskAmount,
                defaultRiskAmount
              );
              return (
                <div key="pnl" className="trade-pnl-cell">
                  <Tooltip
                    content={
                      <PartialExitTooltipContent
                        partialInfo={partialExitInfo}
                        currency={currency}
                        assetType={trade.assetType}
                        totalDividends={totalDividends}
                        formatValue={formatValue}
                      />
                    }
                    delay={0}
                    preferredPosition="top"
                  >
                    <span
                      className={`trade-pnl partial ${
                        isPnlMasked
                          ? 'journalit-privacy-mask'
                          : partialPnL > 0
                            ? 'positive'
                            : partialPnL < 0
                              ? 'negative'
                              : 'neutral'
                      }`}
                    >
                      {formatValue({
                        kind: 'pnl',
                        value: partialPnL,
                        currencyCode: currency,
                        rMultiple: partialRMultiple,
                      })}
                      *
                    </span>
                  </Tooltip>
                </div>
              );
            }

            
            if (
              status.className === 'status-open' &&
              !hasRealizedStoredPnL(trade)
            ) {
              return (
                <div key="pnl" className="trade-pnl-cell">
                  <span className="trade-pnl open">-</span>
                </div>
              );
            }

            const pnlClassName = `trade-pnl ${
              isPnlMasked
                ? 'journalit-privacy-mask'
                : getMultipliedPnL > 0
                  ? 'positive'
                  : getMultipliedPnL < 0
                    ? 'negative'
                    : 'neutral'
            }`;

            
            const pnlText = formatValue({
              kind: 'pnl',
              value: getMultipliedPnL,
              currencyCode: currency,
              rMultiple: effectiveRMultiple,
            });

            const pnlTextContent =
              trade.isCopiedTrade && !isPnlMasked ? (
                <>
                  <span className="trade-pnl-copy-value">{pnlText}</span>
                  {trade.isCopiedTrade && !isPnlMasked ? (
                    <span className="trade-pnl-copy-multiplier">
                      {trade.copyMultiplier ?? ''}x
                    </span>
                  ) : null}
                </>
              ) : (
                pnlText
              );

            const pnlContent =
              trade.isCopiedTrade && !isPnlMasked ? (
                <span
                  role="button"
                  tabIndex={0}
                  className={`${pnlClassName} trade-pnl-copy-adjust-trigger`}
                  onClick={handleAdjustCopiedPnL}
                  onKeyDown={handleAdjustCopiedPnLKeyDown}
                  aria-label={t('tradelog.copy-trade.adjustment-action')}
                >
                  {pnlTextContent}
                </span>
              ) : (
                <span className={pnlClassName}>{pnlTextContent}</span>
              );

            return (
              <div key="pnl" className="trade-pnl-cell">
                {trade.isCopiedTrade && !isPnlMasked ? (
                  <Tooltip
                    content={t('tradelog.copy-trade.tooltip', {
                      account: trade.copiedFromAccount || '',
                      multiplier: String(trade.copyMultiplier ?? ''),
                    })}
                    delay={0}
                    preferredPosition="top"
                  >
                    {pnlContent}
                  </Tooltip>
                ) : trade.copiedToAccounts?.length && !isPnlMasked ? (
                  <Tooltip
                    content={
                      <CopiedAccountsTooltipContent
                        copiedToAccounts={trade.copiedToAccounts}
                        currency={currency}
                        formatValue={formatValue}
                      />
                    }
                    delay={0}
                    preferredPosition="top"
                  >
                    {pnlContent}
                  </Tooltip>
                ) : (
                  pnlContent
                )}
              </div>
            );
          }

          case 'returnPercent':
            return (
              <div key="returnPercent" className="trade-return-percent-cell">
                {returnPercent !== undefined ? (
                  <span
                    className={`trade-return-percent ${isReturnPercentMasked ? 'journalit-privacy-mask' : returnPercent > 0 ? 'positive' : returnPercent < 0 ? 'negative' : ''}`}
                  >
                    {formatValue({
                      kind: 'returnPercent',
                      value: returnPercent,
                      precision: 2,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'duration':
            return (
              <div key="duration" className="trade-duration-cell">
                <span className="trade-duration">{duration}</span>
              </div>
            );

          case 'date':
            return (
              <div key="date" className="trade-date-cell">
                <span className="trade-date">
                  {formatDateDisplay(
                    safeParseDateValue(trade.entryTime),
                    plugin?.settings.trade.dateFormat
                  )}
                </span>
              </div>
            );

          case 'account': {
            
            if (accountsArray.length === 0) {
              return (
                <div key="account" className="trade-account-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }

            
            if (accountsArray.length === 1) {
              const accountName = accountsArray[0];
              const maxLength = 8;
              const isTruncated = accountName.length > maxLength;
              const displayText = isTruncated
                ? accountName.substring(0, maxLength) + '...'
                : accountName;

              const cellContent = (
                <span className="trade-account-text">{displayText}</span>
              );

              return (
                <div key="account" className="trade-account-cell">
                  {isTruncated ? (
                    <Tooltip
                      content={accountName}
                      delay={0}
                      preferredPosition="top"
                    >
                      {cellContent}
                    </Tooltip>
                  ) : (
                    cellContent
                  )}
                </div>
              );
            }

            
            return (
              <div key="account" className="trade-account-cell">
                <Tooltip
                  content={<AccountsTooltipContent accounts={accountsArray} />}
                  delay={0}
                  preferredPosition="top"
                >
                  <div className="trade-account-icon-wrapper">
                    <Users size={20} className="trade-account-icon" />
                    <span className="trade-account-count-badge">
                      {accountsArray.length}
                    </span>
                  </div>
                </Tooltip>
              </div>
            );
          }

          case 'reviewed':
            return (
              <div key="reviewed" className="trade-reviewed-cell">
                {trade.reviewed ? (
                  <CheckCircle2
                    size={16}
                    className="trade-reviewed-icon trade-reviewed-icon--yes"
                  />
                ) : (
                  <Circle
                    size={16}
                    className="trade-reviewed-icon trade-reviewed-icon--no"
                  />
                )}
              </div>
            );

          case 'positionSize': {
            
            if (
              status.className === 'status-open' &&
              partialExitInfo.isPartialExit
            ) {
              const closedFormatted = formatPositionSizeCompact(
                partialExitInfo.closedSize
              );
              const totalFormatted = formatPositionSizeCompact(
                partialExitInfo.totalSize
              );
              const needsTooltip =
                closedFormatted.needsTooltip || totalFormatted.needsTooltip;
              const displayText = `${closedFormatted.display}/${totalFormatted.display}`;
              const fullText = `${closedFormatted.full}/${totalFormatted.full}`;

              if (isPositionSizeMasked) {
                return (
                  <div key="positionSize" className="trade-position-size-cell">
                    <span className="trade-position-size partial journalit-privacy-mask">
                      {formatValue({
                        kind: 'positionSize',
                        value: partialExitInfo.totalSize,
                      })}
                    </span>
                  </div>
                );
              }

              if (needsTooltip) {
                return (
                  <div key="positionSize" className="trade-position-size-cell">
                    <Tooltip
                      content={fullText}
                      delay={0}
                      preferredPosition="top"
                    >
                      <span className="trade-position-size partial">
                        {displayText}
                      </span>
                    </Tooltip>
                  </div>
                );
              }

              return (
                <div key="positionSize" className="trade-position-size-cell">
                  <span className="trade-position-size partial">
                    {displayText}
                  </span>
                </div>
              );
            }

            
            return (
              <div key="positionSize" className="trade-position-size-cell">
                <span
                  className={`trade-position-size ${isPositionSizeMasked ? 'journalit-privacy-mask' : ''}`}
                >
                  {formatValue({
                    kind: 'positionSize',
                    value: trade.positionSize ?? null,
                  })}
                </span>
              </div>
            );
          }

          case 'expirationDate':
            if (trade.assetType !== 'options' || !trade.expirationDate) {
              return (
                <div
                  key="expirationDate"
                  className="trade-expiration-date-cell"
                >
                  <span className="trade-no-data">-</span>
                </div>
              );
            }
            return (
              <div key="expirationDate" className="trade-expiration-date-cell">
                <span className="trade-expiration-date">
                  {formatDateDisplay(
                    safeParseDateValue(trade.expirationDate),
                    plugin?.settings.trade.dateFormat
                  )}
                </span>
              </div>
            );

          case 'daysToExpiry': {
            if (trade.assetType !== 'options' || !trade.expirationDate) {
              return (
                <div key="daysToExpiry" className="trade-dte-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }

            const dte = getDaysToExpiry(trade.expirationDate);

            if (dte === null) {
              return (
                <div key="daysToExpiry" className="trade-dte-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }

            if (dte < 0) {
              return (
                <div key="daysToExpiry" className="trade-dte-cell">
                  <span className="trade-dte-expired">
                    {t('tradelog.status.expired')}
                  </span>
                </div>
              );
            }

            const colorClass = dte >= 7 ? 'green' : dte >= 3 ? 'yellow' : 'red';

            return (
              <div key="daysToExpiry" className="trade-dte-cell">
                <div
                  className={`trade-dte-circle trade-dte-circle--${colorClass}`}
                >
                  <span className="trade-dte-number">{dte}</span>
                </div>
              </div>
            );
          }

          case 'mistakes':
            if (mistakesArray.length === 0) {
              return (
                <div key="mistakes" className="trade-mistakes-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }

            
            if (isExpandedMode) {
              return (
                <div key="mistakes" className="trade-mistakes-cell expanded">
                  <div className="expanded-pills">
                    {mistakesArray.map((mistake: string, index: number) => (
                      <span
                        key={getDuplicateAwareStringKeys(mistakesArray)[index]}
                        className="pill pill--mistake"
                      >
                        {mistake}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            
            return (
              <div key="mistakes" className="trade-mistakes-cell">
                <Tooltip
                  content={<MistakesTooltipContent mistakes={mistakesArray} />}
                  delay={0}
                  preferredPosition="top"
                >
                  <span className="journalit-count-badge journalit-count-badge--mistakes">
                    {mistakesArray.length}
                  </span>
                </Tooltip>
              </div>
            );

          case 'setups':
            if (setupsArray.length === 0) {
              return (
                <div key="setups" className="trade-setups-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }

            
            if (isExpandedMode) {
              return (
                <div key="setups" className="trade-setups-cell expanded">
                  <div className="expanded-pills">
                    {setupsArray.map((setup: string, index: number) => (
                      <span
                        key={getDuplicateAwareStringKeys(setupsArray)[index]}
                        className="pill pill--setup"
                      >
                        {setup}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            
            return (
              <div key="setups" className="trade-setups-cell">
                <Tooltip
                  content={<SetupsTooltipContent setups={setupsArray} />}
                  delay={0}
                  preferredPosition="top"
                >
                  <span className="journalit-count-badge journalit-count-badge--setups">
                    {setupsArray.length}
                  </span>
                </Tooltip>
              </div>
            );

          case 'tags': {
            if (customTagsArray.length === 0) {
              return (
                <div key="tags" className="trade-tags-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }

            
            if (isExpandedMode) {
              return (
                <div key="tags" className="trade-tags-cell expanded">
                  <div className="expanded-pills">
                    {customTagsArray.map((tag: string, index: number) => (
                      <span
                        key={
                          getDuplicateAwareStringKeys(customTagsArray)[index]
                        }
                        className="pill pill--tag"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            
            return (
              <div key="tags" className="trade-tags-cell">
                <Tooltip
                  content={<CustomTagsTooltipContent tags={customTagsArray} />}
                  delay={0}
                  preferredPosition="top"
                >
                  <div className="trade-tags-icon-wrapper">
                    <Tag size={20} className="trade-tags-icon" />
                    <span className="trade-tags-count-badge">
                      {customTagsArray.length}
                    </span>
                  </div>
                </Tooltip>
              </div>
            );
          }

          case 'thesis':
            return (
              <div key="thesis" className="trade-thesis-cell">
                {trade.thesis ? (
                  <Tooltip
                    content={<ThesisTooltipContent thesis={trade.thesis} />}
                    delay={0}
                    preferredPosition="top"
                  >
                    <span className="trade-thesis">
                      {trade.thesis.length > 40
                        ? trade.thesis.substring(0, 40) + '...'
                        : trade.thesis}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'mtComment':
            return (
              <div key="mtComment" className="trade-mt-comment-cell">
                {trade.mtComment ? (
                  <Tooltip
                    content={
                      <MTCommentTooltipContent mtComment={trade.mtComment} />
                    }
                    delay={0}
                    preferredPosition="top"
                  >
                    <span className="trade-mt-comment">
                      {trade.mtComment.length > 40
                        ? trade.mtComment.substring(0, 40) + '...'
                        : trade.mtComment}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'exchange': {
            const exchangeValue = trade.exchange || trade.cryptoExchange;
            return (
              <div key="exchange" className="trade-exchange-cell">
                {exchangeValue ? (
                  <span className="trade-exchange">{exchangeValue}</span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'exitDate':
            return (
              <div key="exitDate" className="trade-exit-date-cell">
                {trade.exitTime ? (
                  <span className="trade-exit-date">
                    {formatDateDisplay(
                      safeParseDateValue(trade.exitTime),
                      plugin?.settings.trade.dateFormat
                    )}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'entryPrice': {
            const avgEntryPrice = getWeightedAverageEntryPrice(trade);
            return (
              <div key="entryPrice" className="trade-entry-price-cell">
                {avgEntryPrice ? (
                  <span
                    className={`trade-entry-price ${isPriceMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {isPriceMasked
                      ? formatValue({ kind: 'price', value: avgEntryPrice })
                      : avgEntryPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits:
                            trade.assetType === 'forex' ? 5 : 2,
                        })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'exitPrice': {
            const avgExitPrice = getResolvedWeightedAverageExitPrice(trade);
            return (
              <div key="exitPrice" className="trade-exit-price-cell">
                {avgExitPrice !== null && Number.isFinite(avgExitPrice) ? (
                  <span
                    className={`trade-exit-price ${isPriceMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {isPriceMasked
                      ? formatValue({ kind: 'price', value: avgExitPrice })
                      : avgExitPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits:
                            trade.assetType === 'forex' ? 5 : 2,
                        })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'priceMove': {
            const priceMove = calculateTradePriceMove(trade);
            return (
              <div key="priceMove" className="trade-price-move-cell">
                {priceMove !== null ? (
                  <span
                    className={`trade-price-move ${isPriceMasked ? 'journalit-privacy-mask' : priceMove > 0 ? 'positive' : priceMove < 0 ? 'negative' : ''}`}
                  >
                    {isPriceMasked
                      ? formatValue({ kind: 'price', value: priceMove })
                      : `${priceMove > 0 ? '+' : ''}${formatPriceMoveValue(priceMove, trade.assetType)}`}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'entryTime': {
            const firstEntry = getFirstEntryTime(trade);
            return (
              <div key="entryTime" className="trade-entry-time-cell">
                {firstEntry ? (
                  <span className="trade-entry-time">
                    {firstEntry.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'exitTime': {
            const lastExit = getLastExitTime(trade);
            return (
              <div key="exitTime" className="trade-exit-time-cell">
                {lastExit ? (
                  <span className="trade-exit-time">
                    {lastExit.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'stopLoss':
            return (
              <div key="stopLoss" className="trade-stop-loss-cell">
                {trade.stopLoss ? (
                  <span
                    className={`trade-stop-loss ${isPriceMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {isPriceMasked
                      ? formatValue({ kind: 'price', value: trade.stopLoss })
                      : trade.stopLoss.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits:
                            trade.assetType === 'forex' ? 5 : 2,
                        })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'slDistanceDollar': {
            if (!canCalculateStopLossRiskAmount(trade)) {
              return (
                <div key="slDistanceDollar" className="trade-sl-distance-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }

            const slDistance = calculateStopLossRiskAmount(trade);
            return (
              <div key="slDistanceDollar" className="trade-sl-distance-cell">
                <span
                  className={`trade-sl-distance ${isRiskMasked ? 'journalit-privacy-mask' : ''}`}
                >
                  {formatValue({
                    kind: 'risk',
                    value: slDistance,
                    currencyCode: currency,
                    showCents: false,
                  })}
                </span>
              </div>
            );
          }

          case 'slDistancePercent': {
            if (
              !trade.stopLoss ||
              !trade.entryPrice ||
              trade.entryPrice === 0
            ) {
              return (
                <div
                  key="slDistancePercent"
                  className="trade-sl-distance-percent-cell"
                >
                  <span className="trade-no-data">-</span>
                </div>
              );
            }
            const slDistancePercent =
              Math.abs((trade.entryPrice - trade.stopLoss) / trade.entryPrice) *
              100;
            return (
              <div
                key="slDistancePercent"
                className="trade-sl-distance-percent-cell"
              >
                <span
                  className={`trade-sl-distance-percent ${isPercentageMasked ? 'journalit-privacy-mask' : ''}`}
                >
                  {formatValue({
                    kind: 'percentage',
                    value: slDistancePercent,
                    precision: 2,
                  })}
                </span>
              </div>
            );
          }

          case 'riskAmount':
            return (
              <div key="riskAmount" className="trade-risk-amount-cell">
                {displayedRiskAmount ? (
                  <span
                    className={`trade-risk-amount ${isRiskMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {formatValue({
                      kind: 'risk',
                      value: displayedRiskAmount,
                      currencyCode: currency,
                      showCents: false,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'rMultiple':
            return (
              <div key="rMultiple" className="trade-r-multiple-cell">
                {effectiveRMultiple ? (
                  <span
                    className={`trade-r-multiple ${isRMultipleMasked ? 'journalit-privacy-mask' : effectiveRMultiple > 0 ? 'positive' : effectiveRMultiple < 0 ? 'negative' : ''}`}
                  >
                    {formatValue({
                      kind: 'rMultiple',
                      value: effectiveRMultiple,
                      precision: 2,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'maxR':
            return (
              <div key="maxR" className="trade-max-r-cell">
                {maxRMultiple !== undefined ? (
                  <span
                    className={`trade-max-r ${isRMultipleMasked ? 'journalit-privacy-mask' : maxRMultiple > 0 ? 'positive' : maxRMultiple < 0 ? 'negative' : ''}`}
                  >
                    {formatValue({
                      kind: 'rMultiple',
                      value: maxRMultiple,
                      precision: 2,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'positionValue': {
            if (!trade.positionSize || !trade.entryPrice) {
              return (
                <div key="positionValue" className="trade-position-value-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }
            const posValue = trade.positionSize * trade.entryPrice;
            return (
              <div key="positionValue" className="trade-position-value-cell">
                <span
                  className={`trade-position-value ${isNotionalMasked ? 'journalit-privacy-mask' : ''}`}
                >
                  {formatValue({
                    kind: 'notional',
                    value: posValue,
                    currencyCode: currency,
                    showCents: false,
                  })}
                </span>
              </div>
            );
          }

          case 'fees': {
            const totalFees =
              (trade.fees || 0) + (trade.commission || 0) + (trade.swap || 0);
            return (
              <div key="fees" className="trade-fees-cell trade-money-cell">
                {totalFees !== 0 ? (
                  <span
                    className={`trade-fees ${isFeeMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {formatValue({
                      kind: 'fee',
                      value: totalFees,
                      currencyCode: currency,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'dividends':
            return (
              <div
                key="dividends"
                className="trade-dividends-cell trade-money-cell"
              >
                {totalDividends !== 0 ? (
                  <span
                    className={`trade-dividends ${isPnlMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {formatValue({
                      kind: 'pnl',
                      value: totalDividends,
                      currencyCode: currency,
                      showCents: false,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'maePrice':
            return (
              <div key="maePrice" className="trade-mae-price-cell">
                {trade.maePrice !== undefined ? (
                  <span
                    className={`trade-mae-price ${isPriceMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {isPriceMasked
                      ? formatValue({ kind: 'price', value: trade.maePrice })
                      : trade.maePrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits:
                            trade.assetType === 'forex' ? 5 : 2,
                        })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'mfePrice':
            return (
              <div key="mfePrice" className="trade-mfe-price-cell">
                {trade.mfePrice !== undefined ? (
                  <span
                    className={`trade-mfe-price ${isPriceMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {isPriceMasked
                      ? formatValue({ kind: 'price', value: trade.mfePrice })
                      : trade.mfePrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits:
                            trade.assetType === 'forex' ? 5 : 2,
                        })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );

          case 'mae': {
            const maeValue = getTradeMaeValue(trade);
            return (
              <div key="mae" className="trade-mae-cell">
                {maeValue !== undefined ? (
                  <span
                    className={`trade-mae ${isPnlMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {formatValue({
                      kind: 'pnl',
                      value: maeValue,
                      currencyCode: currency,
                      showCents: false,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'mfe': {
            const mfeValue = getTradeMfeValue(trade);
            return (
              <div key="mfe" className="trade-mfe-cell">
                {mfeValue !== undefined ? (
                  <span
                    className={`trade-mfe ${isPnlMasked ? 'journalit-privacy-mask' : ''}`}
                  >
                    {formatValue({
                      kind: 'pnl',
                      value: mfeValue,
                      currencyCode: currency,
                      showCents: false,
                    })}
                  </span>
                ) : (
                  <span className="trade-no-data">-</span>
                )}
              </div>
            );
          }

          case 'maePercent': {
            
            let maePercent: number | undefined;
            if (
              trade.maePrice !== undefined &&
              trade.entryPrice &&
              trade.entryPrice !== 0
            ) {
              const dir = trade.direction?.toUpperCase();
              const isShort = dir === 'SELL' || dir === 'SHORT';
              const priceDiff = isShort
                ? trade.entryPrice - trade.maePrice
                : trade.maePrice - trade.entryPrice;
              maePercent = (priceDiff / trade.entryPrice) * 100;
            } else if (
              trade.mae !== undefined &&
              trade.entryPrice &&
              trade.positionSize &&
              trade.positionSize !== 0
            ) {
              maePercent =
                (trade.mae / (trade.entryPrice * trade.positionSize)) * 100;
            }

            if (maePercent === undefined) {
              return (
                <div key="maePercent" className="trade-mae-percent-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }
            return (
              <div key="maePercent" className="trade-mae-percent-cell">
                <span
                  className={`trade-mae-percent ${isPercentageMasked ? 'journalit-privacy-mask' : ''}`}
                >
                  {formatValue({
                    kind: 'percentage',
                    value: maePercent,
                    precision: 2,
                  })}
                </span>
              </div>
            );
          }

          case 'mfePercent': {
            
            let mfePercent: number | undefined;
            if (
              trade.mfePrice !== undefined &&
              trade.entryPrice &&
              trade.entryPrice !== 0
            ) {
              const dir = trade.direction?.toUpperCase();
              const isShort = dir === 'SELL' || dir === 'SHORT';
              const priceDiff = isShort
                ? trade.entryPrice - trade.mfePrice
                : trade.mfePrice - trade.entryPrice;
              mfePercent = (priceDiff / trade.entryPrice) * 100;
            } else if (
              trade.mfe !== undefined &&
              trade.entryPrice &&
              trade.positionSize &&
              trade.positionSize !== 0
            ) {
              mfePercent =
                (trade.mfe / (trade.entryPrice * trade.positionSize)) * 100;
            }

            if (mfePercent === undefined) {
              return (
                <div key="mfePercent" className="trade-mfe-percent-cell">
                  <span className="trade-no-data">-</span>
                </div>
              );
            }
            return (
              <div key="mfePercent" className="trade-mfe-percent-cell">
                <span
                  className={`trade-mfe-percent ${isPercentageMasked ? 'journalit-privacy-mask' : ''}`}
                >
                  {formatValue({
                    kind: 'percentage',
                    value: mfePercent,
                    precision: 2,
                  })}
                </span>
              </div>
            );
          }

          default:
            return null;
        }
      },
      [
        trade,
        images,
        status,
        getMultipliedPnL,
        currency,
        plugin,
        effectiveRMultiple,
        displayedRiskAmount,
        maxRMultiple,
        returnPercent,
        accountsArray,
        mistakesArray,
        setupsArray,
        customTagsArray,
        duration,
        onImageClick,
        isMultiSelectMode,
        isSelected,
        handleCheckboxChange,
        handleAdjustCopiedPnL,
        handleAdjustCopiedPnLKeyDown,
        partialExitInfo,
        isExpandedMode,
        defaultRiskAmount,
        totalDividends,
        renderCustomFieldCell,
        formatValue,
        isPnlMasked,
        isReturnPercentMasked,
        isRMultipleMasked,
        isPriceMasked,
        isPositionSizeMasked,
        isPercentageMasked,
        isRiskMasked,
        isNotionalMasked,
        isFeeMasked,
        sourcePath,
      ]
    );

    const getCellActionProps = (columnId: string) => {
      if (columnId === 'select' || columnId === 'image') {
        return {};
      }

      return {
        role: 'button' as const,
        tabIndex: 0,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onTradeActivate();
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          e.stopPropagation();
          onTradeActivate();
        },
      };
    };

    const renderInteractiveCell = (col: ColumnDefinition) => {
      const cell = renderCell(col);
      if (!React.isValidElement(cell)) {
        return cell;
      }

      return React.cloneElement(cell, getCellActionProps(col.id));
    };

    return (
      <>
        {visibleColumns && visibleColumns.length > 0 ? (
          visibleColumns.map((col) => renderInteractiveCell(col))
        ) : (
          <span className="trade-no-data">{t('tradelog.no-columns')}</span>
        )}
      </>
    );
  }
);

TradeDetailsContent.displayName = 'TradeDetailsContent';

export const TradeDetailsRow = memo<TradeDetailsRowProps>(
  ({
    trade,
    depth,
    isLastChild = false,
    onClick,
    viewLevel,
    visibleColumns,
    gridTemplate,
    isSelected,
    onToggleSelection,
    isMultiSelectMode,
    isExpandedMode,
  }) => {
    const plugin = usePlugin();
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    
    const status = useMemo(() => {
      const displayStatus = getTradeDisplayStatusWithContext(
        trade,
        plugin?.settings.trade
      );

      switch (displayStatus) {
        case 'backtest':
          return {
            label: t('tradelog.status.backtest'),
            className: 'status-backtest',
          };
        case 'missed':
          return {
            label: t('tradelog.status.missed'),
            className: 'status-missed',
          };
        case 'open':
          return { label: t('tradelog.status.open'), className: 'status-open' };
        case 'win':
          return { label: t('tradelog.status.win'), className: 'status-win' };
        case 'loss':
          return { label: t('tradelog.status.loss'), className: 'status-loss' };
        case 'breakeven':
        default:
          return {
            label: t('tradelog.status.breakeven'),
            className: 'status-breakeven',
          };
      }
    }, [trade, plugin?.settings.trade]);

    const duration = useMemo(() => {
      if (!trade.entryTime) return 'N/A';

      
      
      const tradeIsOpen =
        trade.tradeStatus === 'OPEN' ||
        isTradeOpenWithContext({
          tradeStatus: trade.tradeStatus,
          exitTime: trade.exitTime,
          pnl: trade.pnl,
          useDirectPnLInput: trade.useDirectPnLInput,
          exits: trade.exits,
          entries: trade.entries,
        });

      
      if (tradeIsOpen) {
        const entryTime = safeGetTime(trade.entryTime);
        if (!entryTime) return 'N/A';

        const now = new Date();
        const durationMs = now.getTime() - entryTime;
        return (
          formatDuration(durationMs) + ` ${t('tradelog.duration.ongoing')}`
        );
      }

      
      const entryTime = safeGetTime(trade.entryTime);
      const exitTime = safeGetTime(trade.exitTime);

      if (!entryTime || !exitTime) return 'N/A';

      const durationMs = exitTime - entryTime;
      return formatDuration(durationMs);
    }, [
      trade.entryTime,
      trade.exitTime,
      trade.tradeStatus,
      trade.pnl,
      trade.useDirectPnLInput,
      trade.exits,
      trade.entries,
    ]);

    
    const images = useMemo(() => {
      let imagesArray: string[] = [];
      try {
        if (trade.images) {
          if (Array.isArray(trade.images)) {
            imagesArray = trade.images.map((img: unknown) =>
              String(img).trim().replace(/['"`]/g, '')
            );
          } else if (typeof trade.images === 'string') {
            const parsedImages = JSON.parse(trade.images);
            if (Array.isArray(parsedImages)) {
              imagesArray = parsedImages.map((img: unknown) =>
                String(img).trim().replace(/['"`]/g, '')
              );
            }
          }
        }
      } catch (_e) {
        // intentional
      }
      return imagesArray;
    }, [trade]);
    const sourcePath = trade.filePath || trade.path || '';

    const handleImageClick = useCallback(
      (e: React.MouseEvent | React.KeyboardEvent, imagePath: string) => {
        e.stopPropagation();
        const imageIndex = images.indexOf(imagePath);
        setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
        setIsFullscreenOpen(true);
      },
      [images]
    );

    const closeFullscreen = useCallback(() => {
      setIsFullscreenOpen(false);
    }, []);

    const handleImageNavigate = useCallback(
      (index: number) => {
        if (index >= 0 && index < images.length) {
          setCurrentImageIndex(index);
        }
      },
      [images.length]
    );

    
    const navigationContext: ImageNavigationContext | undefined =
      useMemo(() => {
        if (images.length <= 1) return undefined;

        return {
          images,
          currentIndex: currentImageIndex,
          onNavigate: handleImageNavigate,
          altPrefix: t('tradelog.alt.trade-image', {
            instrument: trade.instrument,
          }),
          useResolveMediaPath: true,
          sourcePath,
        };
      }, [
        images,
        currentImageIndex,
        handleImageNavigate,
        trade.instrument,
        sourcePath,
      ]);

    const handleTradeCellActivate = useCallback(
      (event?: React.MouseEvent | React.KeyboardEvent) => {
        if (isMultiSelectMode) {
          if (trade.isCopiedTrade) {
            return;
          }

          const tradeId = trade.filePath || trade.path;
          if (tradeId && onToggleSelection) {
            onToggleSelection(tradeId, event);
          }
          return;
        }

        onClick();
      },
      [isMultiSelectMode, onClick, onToggleSelection, trade]
    );

    return (
      <>
        <div
          className={`trade-log-node trade-log-node--trade ${isLastChild ? 'is-last-child' : ''} ${viewLevel === 'trades' ? 'trades-view' : ''}`}
        >
          
          {viewLevel !== 'trades' && (
            <div
              className="tree-structure"
              style={cssVars({
                '--journalit-tree-structure-width': `${depth * 24}px`,
              })}
            >
              {Array.from({ length: depth }).map((_, i) => (
                <span
                  key={i}
                  className={`tree-level ${i === depth - 1 && isLastChild ? 'last-level' : ''}`}
                />
              ))}
            </div>
          )}

          
          {viewLevel === 'trades' ? (
            <div
              className="trade-details-row trades-view-row"
              role="button"
              tabIndex={0}
              onClick={handleTradeCellActivate}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                handleTradeCellActivate(event);
              }}
              style={cssVars({
                '--journalit-tradelog-grid-template': gridTemplate,
              })}
            >
              <TradeDetailsContent
                trade={trade}
                images={images}
                status={status}
                duration={duration}
                onImageClick={handleImageClick}
                onTradeActivate={handleTradeCellActivate}
                plugin={plugin}
                visibleColumns={visibleColumns}
                gridTemplate={gridTemplate}
                isSelected={isSelected}
                onToggleSelection={onToggleSelection}
                isMultiSelectMode={isMultiSelectMode}
                isExpandedMode={isExpandedMode}
              />
            </div>
          ) : (
            
            <div
              className="trade-details-row tree-view-row"
              role="button"
              tabIndex={0}
              onClick={handleTradeCellActivate}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                handleTradeCellActivate(event);
              }}
              style={cssVars({
                '--journalit-tradelog-grid-template': gridTemplate,
              })}
            >
              
              <div className="tree-indicator-cell">
                {depth > 0 && (
                  <span className="tree-connector tree-connector--trade" />
                )}
                <span className="tree-leaf-node tree-leaf-node--trade" />
              </div>

              <TradeDetailsContent
                trade={trade}
                images={images}
                status={status}
                duration={duration}
                onImageClick={handleImageClick}
                onTradeActivate={handleTradeCellActivate}
                plugin={plugin}
                visibleColumns={visibleColumns}
                gridTemplate={gridTemplate}
                isExpandedMode={isExpandedMode}
                isSelected={isSelected}
                onToggleSelection={onToggleSelection}
                isMultiSelectMode={isMultiSelectMode}
              />
            </div>
          )}
        </div>

        
        {isFullscreenOpen && images.length > 0 && (
          <FullscreenPortal
            isOpen={isFullscreenOpen}
            onClose={closeFullscreen}
            title={`${trade.instrument} - ${formatDateDisplay(safeParseDateValue(trade.entryTime), plugin?.settings.trade.dateFormat, ' ')}`}
            portalId="trade-log-image-portal"
          >
            <FullscreenImageViewer
              key={images[currentImageIndex]}
              imagePath={images[currentImageIndex]}
              alt={t('tradelog.alt.trade-image-n', {
                instrument: trade.instrument,
                n: (currentImageIndex + 1).toString(),
              })}
              useResolveMediaPath={true}
              sourcePath={sourcePath}
              navigationContext={navigationContext}
              onClose={closeFullscreen}
            />
          </FullscreenPortal>
        )}
      </>
    );
  }
);

TradeDetailsRow.displayName = 'TradeDetailsRow';


function _getTradePerformanceTooltip(trade: TradeWithPath): string {
  const indicator =
    trade.performanceIndicator === 'best'
      ? t('common.best')
      : t('common.worst');
  const date = safeParseDateValue(trade.entryTime);

  if (!date) {
    return t('tradelog.tooltip.performance-trade', { indicator });
  }

  const dayStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return t('tradelog.tooltip.performance-trade-on', {
    indicator,
    date: dayStr,
  });
}
