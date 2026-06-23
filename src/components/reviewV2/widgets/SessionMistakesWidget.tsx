

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TFile } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { ComboBox } from '../../core/ComboBox';
import { SkeletonBox } from '../../shared';
import { InvalidContextMessage } from './InvalidContextMessage';
import { OptionType } from '../../../services/options/CustomOptionsService';
import { batchAddMistakes } from '../../tradelog/batchOperations';
import { useEventBus } from '../../../hooks/useEventBus';
import {
  formatLocalDateString,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import { getTradingDayString } from '../../../utils/tradingDayUtils';
import { t } from '../../../lang/helpers';

interface SessionMistakesPreviewData {
  mistakes: string[];
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;

interface SessionMistakeTradeRecord extends Record<string, unknown> {
  entryTime: string | number | Date;
  path: string;
}

const isSessionMistakeTradeRecord = (
  value: Record<string, unknown>
): value is SessionMistakeTradeRecord =>
  typeof value.path === 'string' &&
  (typeof value.entryTime === 'string' ||
    typeof value.entryTime === 'number' ||
    value.entryTime instanceof Date);

interface SessionMistakesWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  preview?: boolean;
  previewData?: SessionMistakesPreviewData;
}

const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;

const normalizeMistakes = (values: string[]): string[] => {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const rawValue of values) {
    const trimmed = String(rawValue || '').trim();
    if (!trimmed) continue;

    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(trimmed);
  }

  return result;
};

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;

  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) return false;
  }

  return true;
};

export const SessionMistakesWidget: React.FC<SessionMistakesWidgetProps> =
  React.memo(({ filePath, plugin, preview, previewData }) => {
    const [sessionMistakes, setSessionMistakes] = useState<string[]>([]);
    const [mistakeOptions, setMistakeOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isValidContext, setIsValidContext] = useState(true);

    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<number | null>(null);

    const loadOptions = useCallback(() => {
      if (!plugin.optionsService) {
        setMistakeOptions([]);
        return;
      }

      const options = plugin.optionsService.getOptions(OptionType.MISTAKE);
      setMistakeOptions(options);
    }, [plugin.optionsService]);

    const loadSessionMistakes = useCallback(async () => {
      
      if (preview && previewData) {
        setSessionMistakes(normalizeMistakes(previewData.mistakes || []));
        setLoading(false);
        setIsValidContext(true);
        return;
      }

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;

      if (!frontmatter) {
        if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
          retryCountRef.current++;

          if (retryTimeoutRef.current) {
            window.clearTimeout(retryTimeoutRef.current);
          }

          retryTimeoutRef.current = window.setTimeout(
            () => void loadSessionMistakes(),
            FRONTMATTER_RETRY_DELAY_MS
          );
          return;
        }

        setIsValidContext(false);
        setLoading(false);
        return;
      }

      if (frontmatter.type !== 'drc') {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const loadedMistakes = Array.isArray(frontmatter.sessionMistakes)
        ? normalizeMistakes(
            frontmatter.sessionMistakes.filter(
              (value: unknown): value is string => typeof value === 'string'
            )
          )
        : [];

      setSessionMistakes(loadedMistakes);
      setIsValidContext(true);
      setLoading(false);
    }, [filePath, plugin, preview, previewData]);

    useEffect(() => {
      retryCountRef.current = 0;
      setLoading(true);
      void loadSessionMistakes();
      loadOptions();

      return () => {
        if (retryTimeoutRef.current) {
          window.clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
      };
    }, [loadSessionMistakes, loadOptions]);

    useEffect(() => {
      if (preview) return;

      const handleMetadataChanged = (file: TFile) => {
        if (file.path === filePath) {
          void loadSessionMistakes();
        }
      };

      plugin.app.metadataCache.on('changed', handleMetadataChanged);

      return () => {
        plugin.app.metadataCache.off('changed', handleMetadataChanged);
      };
    }, [filePath, loadSessionMistakes, plugin, preview]);

    useEventBus(
      'options:changed',
      () => {
        loadOptions();
      },
      !preview
    );

    const applySessionMistakesToDayTrades = useCallback(
      async (mistakesToApply: string[]) => {
        if (preview || mistakesToApply.length === 0) return;

        const shouldAutoApply =
          plugin.settings.reviewV2?.scalperDefaults
            ?.autoApplySessionMistakesToTrades === true;

        if (!shouldAutoApply || !plugin.tradeService) {
          return;
        }

        try {
          const drcFile = plugin.app.vault.getAbstractFileByPath(filePath);
          if (!(drcFile instanceof TFile)) return;

          const frontmatter = asRecord(
            plugin.app.metadataCache.getFileCache(drcFile)?.frontmatter
          );
          const rawDate = frontmatter?.date;
          if (typeof rawDate !== 'string') return;

          const parsedDate = parseLocalDateSafe(rawDate);
          if (!parsedDate) return;

          
          
          
          const targetTradingDay = formatLocalDateString(parsedDate);

          const allTrades = await plugin.tradeService.getTradeData({
            fresh: false,
          });

          const tradeFilePaths = allTrades.flatMap((trade) => {
            if (!isSessionMistakeTradeRecord(trade)) {
              return [];
            }

            const entryDate = new Date(trade.entryTime);
            if (isNaN(entryDate.getTime())) {
              return [];
            }

            return getTradingDayString(entryDate, plugin) === targetTradingDay
              ? [trade.path]
              : [];
          });

          if (tradeFilePaths.length === 0) {
            return;
          }

          await batchAddMistakes(plugin.app, tradeFilePaths, mistakesToApply);
        } catch (error) {
          console.error(
            '[SessionMistakesWidget] Failed to auto-apply session mistakes to trades:',
            error
          );
        }
      },
      [filePath, plugin, preview]
    );

    const handleSaveMistakeOption = useCallback(
      async (option: string) => {
        if (!plugin.optionsService) return;

        try {
          await plugin.optionsService.addOption(OptionType.MISTAKE, option);
        } catch (error) {
          console.error(
            '[SessionMistakesWidget] Failed to save custom mistake option:',
            error
          );
        }
      },
      [plugin.optionsService]
    );

    const handleMistakesChange = useCallback(
      async (value: string | string[]) => {
        if (preview) return;

        const selectedValues = Array.isArray(value)
          ? value
          : value
            ? [value]
            : [];
        const normalized = normalizeMistakes(selectedValues);

        if (arraysEqual(normalized, sessionMistakes)) {
          return;
        }

        const previous = sessionMistakes;
        const previousKeys = new Set(
          previous.map((item) => item.toLowerCase())
        );
        const addedMistakes = normalized.filter(
          (item) => !previousKeys.has(item.toLowerCase())
        );

        setSessionMistakes(normalized);

        if (plugin.optionsService && normalized.length > 0) {
          try {
            await plugin.optionsService.addOptions(
              OptionType.MISTAKE,
              normalized
            );
          } catch (error) {
            console.error(
              '[SessionMistakesWidget] Failed to persist mistake options:',
              error
            );
          }
        }

        try {
          await plugin.drcService.updateDRCFrontmatter(
            filePath,
            {
              sessionMistakes: normalized,
            },
            'session-mistakes-widget'
          );

          await applySessionMistakesToDayTrades(addedMistakes);
        } catch (error) {
          setSessionMistakes(previous);
          console.error(
            '[SessionMistakesWidget] Failed to update DRC frontmatter:',
            error
          );
        }
      },
      [
        applySessionMistakesToDayTrades,
        filePath,
        plugin,
        preview,
        sessionMistakes,
      ]
    );

    if (loading) {
      return (
        <div className="journalit-reviewv2-card-wrapper">
          <div className="journalit-reviewv2-card journalit-reviewv2-card--centered journalit-reviewv2-sessionmistakes">
            <div className="journalit-reviewv2-card-header journalit-reviewv2-card-header--center">
              <SkeletonBox width={160} height={14} borderRadius="4px" />
            </div>
            <SkeletonBox width="100%" height={44} borderRadius="6px" />
            <SkeletonBox width="60%" height={12} borderRadius="4px" />
          </div>
        </div>
      );
    }

    if (!isValidContext) {
      return (
        <InvalidContextMessage
          widgetType={t('widget.session-mistakes.name')}
          reason={t('widget.session-mistakes.invalid-context')}
        />
      );
    }

    return (
      <div className="journalit-reviewv2-card-wrapper">
        <div className="journalit-reviewv2-card journalit-reviewv2-card--centered journalit-reviewv2-sessionmistakes">
          <div className="journalit-reviewv2-card-header journalit-reviewv2-card-header--center">
            <div className="journalit-reviewv2-card-title journalit-reviewv2-card-title--uppercase">
              {t('widget.session-mistakes.title')}
            </div>
          </div>

          <div className="journalit-reviewv2-sessionmistakes-input">
            {preview ? (
              sessionMistakes.length > 0 ? (
                <div className="journalit-reviewv2-list">
                  {sessionMistakes.map((mistake) => (
                    <div key={mistake} className="journalit-reviewv2-list-item">
                      <span className="journalit-reviewv2-item-text">
                        {mistake}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="journalit-reviewv2-empty">
                  {t('widget.session-mistakes.empty')}
                </div>
              )
            ) : (
              <>
                <ComboBox
                  options={mistakeOptions}
                  value={sessionMistakes}
                  onChange={(value) => void handleMistakesChange(value)}
                  allowCreate={true}
                  isMulti={true}
                  optionType={OptionType.MISTAKE}
                  onSaveOption={handleSaveMistakeOption}
                  placeholder={t('widget.session-mistakes.placeholder')}
                  portalDropdown={true}
                />
                <div className="journalit-reviewv2-sessionmistakes-helper journalit-reviewv2-text-sm journalit-reviewv2-text-muted">
                  {t('widget.session-mistakes.subtitle')}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  });

SessionMistakesWidget.displayName = 'SessionMistakesWidget';

export {};
