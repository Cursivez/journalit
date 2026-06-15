

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { useReviewTrades } from '../hooks';
import { InvalidContextMessage } from './InvalidContextMessage';
import { SkeletonBox } from '../../shared';
import type { DemonTrackerEntry } from '../../../services/monthly/types';
import type { DemonTrackerWidgetConfig } from '../../../types/reviewV2';
import type { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import {
  aggregateDemonTrackerData,
  resolveDemonTrackerModes,
} from './shared/demonTrackerAggregation';

const asDemonTrades = (value: unknown): PartialTradeFrontmatter[] =>
  Array.isArray(value)
    ? value.filter((item): item is PartialTradeFrontmatter =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

interface DemonTrackerWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: DemonTrackerWidgetConfig;
  preview?: boolean;
  previewData?: DemonTrackerPreviewData;
}

interface DemonTrackerPreviewData {
  demons: DemonTrackerEntry[];
  noteType?: 'monthly-review' | 'quarterly-review' | 'yearly-review';
}


const STOP_TRADING_THRESHOLD = 6;


const MONTHLY_COLUMNS = ['DEMON', '1', '2', '3', '4', '5', 'STOP TRADING'];


const EXTENDED_COLUMNS = ['DEMON', 'OCCURRENCES'];


const getColumnLabel = (col: string): string => {
  switch (col) {
    case 'DEMON':
      return t('widget.demon-tracker.column.demon');
    case 'OCCURRENCES':
      return t('widget.demon-tracker.column.occurrences');
    case 'STOP TRADING':
      return t('widget.demon-tracker.column.stop-trading');
    default:
      return col; 
  }
};


const ALLOWED_NOTE_TYPES = [
  'monthly-review',
  'quarterly-review',
  'yearly-review',
];



export const DemonTrackerWidget: React.FC<DemonTrackerWidgetProps> = React.memo(
  ({ filePath, plugin, config, preview = false, previewData }) => {
    
    const {
      trades,
      sessionMistakesByTradingDay,
      filters,
      loading: cacheLoading,
      noteType,
    } = useReviewTrades(filePath, plugin);

    const loading = preview ? false : cacheLoading;

    const scalperDefaultCountMode =
      plugin.settings.reviewV2?.scalperDefaults?.countMode;
    const scalperDefaultSourceMode =
      plugin.settings.reviewV2?.scalperDefaults?.sourceMode;

    const { countMode, sourceMode } = useMemo(
      () =>
        resolveDemonTrackerModes(config, {
          countMode: scalperDefaultCountMode,
          sourceMode: scalperDefaultSourceMode,
        }),
      [config, scalperDefaultCountMode, scalperDefaultSourceMode]
    );

    
    const demons = useMemo(() => {
      
      if (preview && previewData) {
        return [...previewData.demons];
      }

      return aggregateDemonTrackerData({
        trades: asDemonTrades(trades),
        sessionMistakesByTradingDay,
        countMode,
        sourceMode,
        plugin,
        mistakesFilter: filters?.mistakes,
      });
    }, [
      trades,
      sessionMistakesByTradingDay,
      countMode,
      sourceMode,
      plugin,
      filters?.mistakes,
      preview,
      previewData,
    ]);

    
    const summaryStats = useMemo(() => {
      const totalUnique = demons.length;
      const totalOccurrences = demons.reduce(
        (sum, d) => sum + d.occurrences,
        0
      );
      const criticalCount = demons.filter(
        (d) => d.occurrences >= STOP_TRADING_THRESHOLD
      ).length;
      return { totalUnique, totalOccurrences, criticalCount };
    }, [demons]);

    if (loading) {
      
      const rowCount = 4;
      return (
        <div className="journalit-demon-tracker journalit-reviewv2-table-container journalit-reviewv2-demontracker">
          <table className="journalit-reviewv2-table journalit-reviewv2-table--compact">
            <thead>
              <tr>
                {MONTHLY_COLUMNS.map((col) => (
                  <th
                    key={col}
                    className={[
                      'journalit-reviewv2-table-header-cell',
                      col === 'STOP TRADING'
                        ? 'journalit-reviewv2-demontracker-header-stop'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {getColumnLabel(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <tr
                  key={`skeleton-row-${i + 1}-of-${rowCount}`}
                  className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
                >
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-demontracker-demon-cell">
                    <SkeletonBox width={80} height={14} borderRadius="4px" />
                  </td>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <td
                      key={`occ-${num}`}
                      className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact"
                    >
                      <SkeletonBox width={16} height={16} borderRadius="4px" />
                    </td>
                  ))}
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                    <SkeletonBox width={24} height={24} borderRadius="50%" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="journalit-reviewv2-demontracker-summary">
            <div className="journalit-reviewv2-demontracker-summary-item">
              <span className="journalit-reviewv2-demontracker-summary-label">
                Unique Mistakes:
              </span>
              <SkeletonBox width={20} height={16} borderRadius="4px" />
            </div>
            <div className="journalit-reviewv2-demontracker-summary-item">
              <span className="journalit-reviewv2-demontracker-summary-label">
                Total Occurrences:
              </span>
              <SkeletonBox width={20} height={16} borderRadius="4px" />
            </div>
          </div>
        </div>
      );
    }

    
    if (!preview && noteType && !ALLOWED_NOTE_TYPES.includes(noteType)) {
      return (
        <InvalidContextMessage
          widgetType={t('widget.demon-tracker.name')}
          reason={t('widget.invalid-context.monthly-quarterly-yearly')}
        />
      );
    }

    
    
    const effectiveNoteType =
      preview && previewData?.noteType ? previewData.noteType : noteType;
    const useExtendedLayout =
      effectiveNoteType === 'quarterly-review' ||
      effectiveNoteType === 'yearly-review';

    if (demons.length === 0) {
      const periodText = useExtendedLayout
        ? effectiveNoteType === 'yearly-review'
          ? t('widget.demon-tracker.period.this-year')
          : t('widget.demon-tracker.period.this-quarter')
        : t('widget.demon-tracker.period.this-month');
      return (
        <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
          <div className="journalit-u-mb-8">
            {t('widget.demon-tracker.empty.title', { period: periodText })}
          </div>
          <div className="journalit-reviewv2-text-sm">
            {t('widget.demon-tracker.empty.description')}
          </div>
        </div>
      );
    }

    
    if (useExtendedLayout) {
      return (
        <div className="journalit-demon-tracker journalit-reviewv2-table-container journalit-reviewv2-demontracker">
          <table className="journalit-reviewv2-table journalit-reviewv2-table--compact">
            <thead>
              <tr>
                {EXTENDED_COLUMNS.map((col) => (
                  <th
                    key={col}
                    className={[
                      'journalit-reviewv2-table-header-cell',
                      col === 'DEMON' ? 'journalit-reviewv2-align-left' : '',
                      col === 'OCCURRENCES'
                        ? 'journalit-reviewv2-col-occurrences'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {getColumnLabel(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demons.map((demon) => (
                <tr
                  key={demon.mistake}
                  className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
                >
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-align-left journalit-reviewv2-demontracker-demon-cell">
                    {demon.mistake}
                  </td>
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-table-cell--emphasis">
                    <span
                      className={[
                        'journalit-reviewv2-demontracker-count',
                        demon.occurrences >= 10
                          ? 'journalit-reviewv2-demontracker-count--high'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {demon.occurrences}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
          <div className="journalit-reviewv2-demontracker-summary">
            <div className="journalit-reviewv2-demontracker-summary-item">
              <span className="journalit-reviewv2-demontracker-summary-label">
                {t('widget.demon-tracker.summary.unique')}
              </span>
              <span className="journalit-reviewv2-demontracker-summary-value">
                {summaryStats.totalUnique}
              </span>
            </div>
            <div className="journalit-reviewv2-demontracker-summary-item">
              <span className="journalit-reviewv2-demontracker-summary-label">
                {t('widget.demon-tracker.summary.total')}
              </span>
              <span className="journalit-reviewv2-demontracker-summary-value">
                {summaryStats.totalOccurrences}
              </span>
            </div>
          </div>
        </div>
      );
    }

    
    return (
      <div className="journalit-demon-tracker journalit-reviewv2-table-container journalit-reviewv2-demontracker">
        <table className="journalit-reviewv2-table journalit-reviewv2-table--compact">
          <thead>
            <tr>
              {MONTHLY_COLUMNS.map((col) => (
                <th
                  key={col}
                  className={[
                    'journalit-reviewv2-table-header-cell',
                    col === 'STOP TRADING'
                      ? 'journalit-reviewv2-demontracker-header-stop'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {getColumnLabel(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {demons.map((demon) => (
              <tr
                key={demon.mistake}
                className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
              >
                <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-demontracker-demon-cell">
                  {demon.mistake}
                </td>
                {[1, 2, 3, 4, 5].map((num) => (
                  <td
                    key={`occ-${num}`}
                    className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact"
                  >
                    {demon.occurrences >= num ? (
                      <span className="journalit-reviewv2-demontracker-x">
                        &#10007;
                      </span>
                    ) : (
                      <span className="journalit-reviewv2-demontracker-empty-mark">
                        -
                      </span>
                    )}
                  </td>
                ))}
                <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                  {demon.occurrences >= STOP_TRADING_THRESHOLD ? (
                    <span className="journalit-reviewv2-demontracker-x journalit-reviewv2-demontracker-x--stop">
                      &#10007;
                    </span>
                  ) : (
                    <span className="journalit-reviewv2-demontracker-empty-mark">
                      -
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
        <div className="journalit-reviewv2-demontracker-summary">
          <div className="journalit-reviewv2-demontracker-summary-item">
            <span className="journalit-reviewv2-demontracker-summary-label">
              {t('widget.demon-tracker.summary.unique')}
            </span>
            <span className="journalit-reviewv2-demontracker-summary-value">
              {summaryStats.totalUnique}
            </span>
          </div>
          <div className="journalit-reviewv2-demontracker-summary-item">
            <span className="journalit-reviewv2-demontracker-summary-label">
              {t('widget.demon-tracker.summary.total')}
            </span>
            <span className="journalit-reviewv2-demontracker-summary-value">
              {summaryStats.totalOccurrences}
            </span>
          </div>
          {summaryStats.criticalCount > 0 && (
            <div className="journalit-reviewv2-demontracker-summary-item">
              <span className="journalit-reviewv2-demontracker-summary-label">
                {t('widget.demon-tracker.summary.critical')}
              </span>
              <span className="journalit-reviewv2-demontracker-summary-value journalit-reviewv2-demontracker-summary-value--warning">
                {summaryStats.criticalCount}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

DemonTrackerWidget.displayName = 'DemonTrackerWidget';

export {};
