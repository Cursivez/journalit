
import React, { useMemo } from 'react';
import type { Setup } from '../../services/setup/types';
import { t, type TranslationKey } from '../../lang/helpers';
import type { DropdownMenuOption } from '../shared/DropdownMenu';
import { EmptyState } from '../shared/EmptyState';
import { ToolbarButton } from '../shared/ToolbarButton';
import { ChevronDown } from '../shared/icons/ObsidianIcon';
import { SetupPerformanceMetricSelect } from './SetupPairsPanel';
import type { SetupOverviewMetricKey } from './setupsViewTypes';
import { Button } from '../ui/Button';


interface SetupPerformanceHeaderContent {
  summary: React.ReactNode;
  metricKey: SetupOverviewMetricKey;
  metricLabel: string;
  showOutcomeControl: boolean;
}

export type SetupPerformanceHeaderRenderer = (
  content: SetupPerformanceHeaderContent
) => React.ReactNode;


export const OVERVIEW_LINE_CHART_HEIGHT = 340;


export function getOverviewChartHeight(setupCount: number): number {
  return Math.max(OVERVIEW_LINE_CHART_HEIGHT, setupCount * 30 + 48);
}

type SetupPerformanceEmptyReason =
  | 'pairs'
  | 'ranking'
  | 'wins'
  | 'losses'
  | 'outcomePrivacy'
  | 'timesSeen';

const EMPTY_STATE_COPY = {
  pairs: {
    message: 'setups.view.pairs.empty',
    subMessage: 'setups.view.pairs.empty-submessage',
  },
  ranking: {
    message: 'setups.view.ranking.empty',
    subMessage: 'setups.view.ranking.empty-submessage',
  },
  wins: {
    message: 'setups.view.overview.outcome.empty.wins',
    subMessage: 'setups.view.overview.outcome.empty-submessage',
  },
  losses: {
    message: 'setups.view.overview.outcome.empty.losses',
    subMessage: 'setups.view.overview.outcome.empty-submessage',
  },
  outcomePrivacy: {
    message: 'setups.view.ranking.privacy',
    subMessage: 'setups.view.overview.outcome.privacy-submessage',
  },
  timesSeen: {
    message: 'setups.view.times-seen.empty',
    subMessage: 'setups.view.ranking.empty-submessage',
  },
} as const satisfies Record<
  SetupPerformanceEmptyReason,
  { message: TranslationKey; subMessage: TranslationKey }
>;

export const SetupPerformanceEmptyState: React.FC<{
  reason: SetupPerformanceEmptyReason;
}> = ({ reason }) => (
  <EmptyState
    className="journalit-setups-chart-empty-state"
    iconSize={34}
    message={t(EMPTY_STATE_COPY[reason].message)}
    subMessage={t(EMPTY_STATE_COPY[reason].subMessage)}
  />
);

SetupPerformanceEmptyState.displayName = 'SetupPerformanceEmptyState';

export const SetupPerformanceWidgetHeader: React.FC<{
  headerSummary: React.ReactNode;
  outcomeControl: React.ReactNode;
  metricMenuOpen: boolean;
  setupMenuOpen: boolean;
  metricKey: SetupOverviewMetricKey;
  currentMetricLabel: string;
  metricMenuRef: React.RefObject<HTMLDivElement | null>;
  setupMenuRef: React.RefObject<HTMLDivElement | null>;
  metricOptions: Array<DropdownMenuOption<SetupOverviewMetricKey>>;
  effectiveSelectedSetupIds: string[];
  setupSelectionLabel: string;
  setups: Setup[];
  onMetricKeyChange: (metricKey: SetupOverviewMetricKey) => void;
  onMetricMenuOpenChange: (open: boolean) => void;
  onSetupMenuOpenChange: (open: boolean) => void;
  onSelectedSetupIdsChange: (setupIds: string[] | undefined) => void;
}> = ({
  headerSummary,
  outcomeControl,
  metricMenuOpen,
  setupMenuOpen,
  metricKey,
  currentMetricLabel,
  metricMenuRef,
  setupMenuRef,
  metricOptions,
  effectiveSelectedSetupIds,
  setupSelectionLabel,
  setups,
  onMetricKeyChange,
  onMetricMenuOpenChange,
  onSetupMenuOpenChange,
  onSelectedSetupIdsChange,
}) => (
  <div className="journalit-setups-performance-widget__header">
    <div className="journalit-setups-performance-widget__heading">
      {headerSummary}
    </div>
    <div className="journalit-chart-widget__selector">
      {outcomeControl}
      <SetupPerformanceMetricSelect
        menuOpen={metricMenuOpen}
        metricKey={metricKey}
        metricLabel={currentMetricLabel}
        menuRef={metricMenuRef}
        onMetricKeyChange={onMetricKeyChange}
        onMenuOpenChange={onMetricMenuOpenChange}
        options={metricOptions}
      />
      <SetupOverviewSetupSelector
        menuOpen={setupMenuOpen}
        menuRef={setupMenuRef}
        selectedSetupIds={effectiveSelectedSetupIds}
        label={setupSelectionLabel}
        setups={setups}
        onMenuOpenChange={onSetupMenuOpenChange}
        onSelectedSetupIdsChange={onSelectedSetupIdsChange}
      />
    </div>
  </div>
);

SetupPerformanceWidgetHeader.displayName = 'SetupPerformanceWidgetHeader';

const SetupOverviewSetupSelector: React.FC<{
  menuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  selectedSetupIds: string[];
  label: string;
  setups: Setup[];
  onMenuOpenChange: (open: boolean) => void;
  onSelectedSetupIdsChange: (setupIds: string[] | undefined) => void;
}> = ({
  menuOpen,
  menuRef,
  selectedSetupIds,
  label,
  setups,
  onMenuOpenChange,
  onSelectedSetupIdsChange,
}) => {
  const selectedSet = useMemo(
    () => new Set(selectedSetupIds),
    [selectedSetupIds]
  );
  const sortedSetups = useMemo(
    () =>
      [...setups].sort((first, second) =>
        first.name.localeCompare(second.name)
      ),
    [setups]
  );

  const handleToggleSetup = (setupId: string) => {
    const nextSelected = new Set(selectedSet);
    if (nextSelected.has(setupId)) {
      nextSelected.delete(setupId);
    } else {
      nextSelected.add(setupId);
    }
    const nextIds = [...nextSelected];
    onSelectedSetupIdsChange(
      nextIds.length === setups.length ? undefined : nextIds
    );
  };

  return (
    <div
      className="journalit-setups-performance-widget__metric-menu"
      ref={menuRef}
    >
      <ToolbarButton
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label={t('setups.view.overview.setup-filter.aria')}
        className="journalit-setups-performance-widget__metric-trigger journalit-setups-performance-widget__setup-trigger"
        onClick={() => onMenuOpenChange(!menuOpen)}
        type="button"
      >
        <span>{label}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`journalit-home-period-chevron${menuOpen ? ' journalit-home-period-chevron--open' : ''}`}
        />
      </ToolbarButton>
      {menuOpen ? (
        <div
          className="journalit-setups-performance-widget__metric-dropdown journalit-setups-performance-widget__setup-dropdown"
          role="menu"
        >
          <div className="journalit-setups-performance-widget__setup-actions">
            <Button
              variant="plain"
              size="small"
              className="journalit-setups-performance-widget__setup-action"
              onClick={() => onSelectedSetupIdsChange(undefined)}
            >
              {t('setups.view.overview.setup-filter.select-all')}
            </Button>
            <Button
              variant="plain"
              size="small"
              className="journalit-setups-performance-widget__setup-action"
              onClick={() => onSelectedSetupIdsChange([])}
            >
              {t('setups.view.overview.setup-filter.clear')}
            </Button>
          </div>
          <div className="journalit-setups-performance-widget__setup-list">
            {sortedSetups.map((setup) => (
              <button
                aria-checked={selectedSet.has(setup.id)}
                className={
                  selectedSet.has(setup.id)
                    ? 'journalit-home-period-option journalit-home-period-option--active'
                    : 'journalit-home-period-option'
                }
                key={setup.id}
                onClick={() => handleToggleSetup(setup.id)}
                role="menuitemcheckbox"
                type="button"
              >
                <span
                  className="journalit-home-period-option__check"
                  aria-hidden="true"
                >
                  {selectedSet.has(setup.id) ? '✓' : ''}
                </span>
                <span className="journalit-home-period-option__label">
                  {setup.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

SetupOverviewSetupSelector.displayName = 'SetupOverviewSetupSelector';
