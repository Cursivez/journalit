import React, { useCallback, useId, useMemo, useState } from 'react';

import type JournalitPlugin from '../../main';
import type { SetupDirection } from '../../services/setup/types';
import { t } from '../../lang/helpers';
import { UNTAGGED_SETUP_FILTER_VALUE } from '../../utils/setupTagFilter';
import { Tag } from '../shared/icons/ObsidianIcon';
import { Tooltip } from '../shared/Tooltip';
import type { App } from 'obsidian';
import { CascadingFilterMenu } from '../shared/filters/menu/CascadingFilterMenu';
import {
  type FilterMenuEntry,
  checklistNode,
} from '../shared/filters/menu/menuModel';
import { FILTER_MENU_ICONS } from '../shared/filters/menu/filterMenuIcons';
import type { SetupViewModel } from './setupsViewTypes';

export { UNTAGGED_SETUP_FILTER_VALUE };

export type SetupDirectionFilter = SetupDirection | 'unspecified';
const SETUP_DIRECTION_FILTERS: SetupDirectionFilter[] = [
  'long',
  'short',
  'both',
  'unspecified',
];

function normalizeTagKey(tag: string): string {
  return tag.trim().toLowerCase();
}

export function getAvailableSetupTags(viewModels: SetupViewModel[]): string[] {
  const tagsByKey = new Map<string, string>();
  for (const { setup } of viewModels) {
    for (const tag of setup.tags) {
      const key = normalizeTagKey(tag);
      if (key && !tagsByKey.has(key)) tagsByKey.set(key, tag.trim());
    }
  }
  return Array.from(tagsByKey.values()).sort((first, second) =>
    first.localeCompare(second)
  );
}

export function filterSetupViewModelsByTags(
  viewModels: SetupViewModel[],
  selectedTags: string[]
): SetupViewModel[] {
  if (selectedTags.length === 0) return viewModels;

  const includeUntagged = selectedTags.includes(UNTAGGED_SETUP_FILTER_VALUE);
  const selectedKeys = new Set<string>();
  for (const tag of selectedTags) {
    if (tag !== UNTAGGED_SETUP_FILTER_VALUE) {
      selectedKeys.add(normalizeTagKey(tag));
    }
  }

  return viewModels.filter(({ setup }) => {
    if (setup.tags.length === 0) return includeUntagged;
    return setup.tags.some((tag) => selectedKeys.has(normalizeTagKey(tag)));
  });
}

export function filterSetupViewModelsByDirections(
  viewModels: SetupViewModel[],
  selectedDirections: SetupDirectionFilter[]
): SetupViewModel[] {
  if (selectedDirections.length === 0) return viewModels;
  const selected = new Set(selectedDirections);
  return viewModels.filter(({ setup }) =>
    setup.direction
      ? selected.has(setup.direction)
      : selected.has('unspecified')
  );
}

function getValidSetupTagFilters(
  availableTags: string[],
  selectedTags: string[]
): string[] {
  const availableTagKeys = new Set(availableTags.map(normalizeTagKey));
  return selectedTags.filter(
    (tag) =>
      tag === UNTAGGED_SETUP_FILTER_VALUE ||
      availableTagKeys.has(normalizeTagKey(tag))
  );
}

export function useSetupOverviewTagFilter({
  plugin,
  viewModels,
  selectedSetupIds,
  onSelectedSetupIdsChange,
  isGuideActive = false,
}: {
  plugin: JournalitPlugin;
  viewModels: SetupViewModel[];
  selectedSetupIds: string[];
  onSelectedSetupIdsChange: (setupIds: string[]) => void;
  isGuideActive?: boolean;
}) {
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>(
    () => plugin.uiStateManager.getState().setupOverviewSelectedTags ?? []
  );
  const [selectedDirectionFilters, setSelectedDirectionFilters] = useState<
    SetupDirectionFilter[]
  >(
    () => plugin.uiStateManager.getState().setupOverviewSelectedDirections ?? []
  );
  const availableTags = useMemo(
    () => getAvailableSetupTags(viewModels),
    [viewModels]
  );
  const validSelectedTagFilters = useMemo(
    () => getValidSetupTagFilters(availableTags, selectedTagFilters),
    [availableTags, selectedTagFilters]
  );
  const filterViewModels = useCallback(
    (tags: string[], directions: SetupDirectionFilter[]) =>
      filterSetupViewModelsByDirections(
        filterSetupViewModelsByTags(viewModels, tags),
        directions
      ),
    [viewModels]
  );
  const filteredViewModels = useMemo(
    () =>
      isGuideActive
        ? viewModels
        : filterViewModels(validSelectedTagFilters, selectedDirectionFilters),
    [
      filterViewModels,
      isGuideActive,
      selectedDirectionFilters,
      validSelectedTagFilters,
      viewModels,
    ]
  );
  const visibleSetupIds = useMemo(
    () => new Set(filteredViewModels.map(({ setup }) => setup.id)),
    [filteredViewModels]
  );
  const visibleSelectedSetupIds = selectedSetupIds.filter((setupId) =>
    visibleSetupIds.has(setupId)
  );
  const handleFiltersChange = useCallback(
    (nextTags: string[], nextDirections: SetupDirectionFilter[]) => {
      setSelectedTagFilters(nextTags);
      setSelectedDirectionFilters(nextDirections);
      void plugin.uiStateManager.updateState({
        setupOverviewSelectedTags: nextTags,
        setupOverviewSelectedDirections: nextDirections,
      });
      if (isGuideActive) return viewModels.length;

      const nextValidTags = getValidSetupTagFilters(availableTags, nextTags);
      const nextVisibleSetupIds = new Set(
        filterViewModels(nextValidTags, nextDirections).map(
          ({ setup }) => setup.id
        )
      );
      const nextCompareSelection = selectedSetupIds.filter((setupId) =>
        nextVisibleSetupIds.has(setupId)
      );
      if (nextCompareSelection.length !== selectedSetupIds.length) {
        onSelectedSetupIdsChange(nextCompareSelection);
      }
      return nextVisibleSetupIds.size;
    },
    [
      availableTags,
      filterViewModels,
      isGuideActive,
      onSelectedSetupIdsChange,
      plugin.uiStateManager,
      selectedSetupIds,
      viewModels.length,
    ]
  );
  const handleTagFiltersChange = useCallback(
    (nextTags: string[]) =>
      handleFiltersChange(nextTags, selectedDirectionFilters),
    [handleFiltersChange, selectedDirectionFilters]
  );
  const handleDirectionFiltersChange = useCallback(
    (nextDirections: SetupDirectionFilter[]) =>
      handleFiltersChange(validSelectedTagFilters, nextDirections),
    [handleFiltersChange, validSelectedTagFilters]
  );

  return {
    availableTags,
    filteredViewModels,
    handleDirectionFiltersChange,
    handleFiltersChange,
    handleTagFiltersChange,
    selectedDirectionFilters,
    selectedTagFilters,
    visibleSelectedSetupIds,
  };
}

interface SetupTagSummaryProps {
  tags: string[];
}

interface SetupTagsTooltipProps {
  tags: string[];
  triggerClassName: string;
  children: React.ReactNode;
}

const SetupTagsTooltipContent: React.FC<{ tags: string[] }> = ({ tags }) => (
  <div className="journalit-setup-tags-tooltip">
    <div className="journalit-setup-tags-tooltip__title">
      {t('setups.view.tags')}
    </div>
    <div className="journalit-setup-tags-tooltip__list">
      {tags.map((tag, index) => (
        <React.Fragment key={tag}>
          {index > 0 ? (
            <span
              aria-hidden="true"
              className="journalit-setup-tags-tooltip__separator"
            >
              {'\u00a0• '}
            </span>
          ) : null}
          <span className="journalit-setup-tags-tooltip__item">
            {tag.replace(/ /g, '\u00a0')}
          </span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

SetupTagsTooltipContent.displayName = 'SetupTagsTooltipContent';

const SetupTagsTooltip: React.FC<SetupTagsTooltipProps> = ({
  tags,
  triggerClassName,
  children,
}) => (
  <Tooltip
    className="journalit-setup-tags-tooltip-popover"
    content={<SetupTagsTooltipContent tags={tags} />}
    delay={0}
    disclosureLabel={`${t('setups.view.tags')}: ${tags.join(', ')}`}
    preferredPosition="top"
    triggerClassName={triggerClassName}
  >
    {children}
  </Tooltip>
);

SetupTagsTooltip.displayName = 'SetupTagsTooltip';

export const SetupTagSummary: React.FC<SetupTagSummaryProps> = ({ tags }) => {
  if (tags.length === 0) return null;

  return (
    <div className="journalit-setup-tag-summary">
      <SetupTagsTooltip
        tags={tags}
        triggerClassName="journalit-setup-tag-summary__trigger"
      >
        <span className="journalit-setup-tag-summary__indicator">
          <Tag size={13} aria-hidden="true" />
          <span
            aria-hidden="true"
            className="journalit-setup-tag-summary__count"
          >
            {tags.length}
          </span>
        </span>
      </SetupTagsTooltip>
      <span className="journalit-setups-view__sr-only">{tags.join(', ')}</span>
    </div>
  );
};

SetupTagSummary.displayName = 'SetupTagSummary';

export const SetupTagIndicator: React.FC<{ tags: string[] }> = ({ tags }) => {
  if (tags.length === 0) return null;

  return (
    <SetupTagsTooltip
      tags={tags}
      triggerClassName="journalit-setup-card__tag-tooltip-trigger"
    >
      <span className="journalit-setup-card__tag-indicator">
        <Tag size={16} aria-hidden="true" />
        <span className="journalit-setup-card__tag-count" aria-hidden="true">
          {tags.length}
        </span>
      </span>
    </SetupTagsTooltip>
  );
};

SetupTagIndicator.displayName = 'SetupTagIndicator';

interface SetupOverviewFilterProps {
  app: App;
  availableTags: string[];
  selectedTags: string[];
  selectedDirections: SetupDirectionFilter[];
  onTagsChange: (tags: string[]) => void;
  onDirectionsChange: (directions: SetupDirectionFilter[]) => void;
  onReset: () => void;
}

const directionLabel = (direction: SetupDirectionFilter) =>
  direction === 'unspecified'
    ? t('setups.create.direction.any')
    : t(`setups.create.direction.${direction}`);


function selectedTagOptionValues(
  options: ReadonlyArray<{ value: string }>,
  selectedTags: readonly string[]
): string[] {
  const selectedKeys = new Set(selectedTags.map(normalizeTagKey));
  const values: string[] = [];
  for (const option of options) {
    if (selectedKeys.has(normalizeTagKey(option.value))) {
      values.push(option.value);
    }
  }
  return values;
}


export const SetupOverviewFilter: React.FC<SetupOverviewFilterProps> = ({
  app,
  availableTags,
  selectedTags,
  selectedDirections,
  onTagsChange,
  onDirectionsChange,
  onReset,
}) => {
  const triggerLabelId = useId();
  const tagOptions = useMemo(() => {
    const displayedTags = new Map<string, string>();
    for (const tag of availableTags) {
      if (tag === UNTAGGED_SETUP_FILTER_VALUE) continue;
      const key = normalizeTagKey(tag);
      if (key && !displayedTags.has(key)) displayedTags.set(key, tag);
    }
    return [
      {
        value: UNTAGGED_SETUP_FILTER_VALUE,
        label: t('setups.view.overview.tag-filter.untagged'),
      },
      ...Array.from(displayedTags.values()).map((tag) => ({
        value: tag,
        label: tag,
      })),
    ];
  }, [availableTags]);
  const validTags = useMemo(
    () => getValidSetupTagFilters(availableTags, selectedTags),
    [availableTags, selectedTags]
  );

  
  const entries = useMemo<FilterMenuEntry[]>(
    () => [
      checklistNode({
        id: 'tags',
        label: t('setups.view.tags'),
        icon: FILTER_MENU_ICONS.tags,
        options: tagOptions,
        
        
        selected: selectedTagOptionValues(tagOptions, validTags),
        onToggle: (tag) => {
          const key = normalizeTagKey(tag);
          onTagsChange(
            validTags.some((selected) => normalizeTagKey(selected) === key)
              ? validTags.filter(
                  (selected) => normalizeTagKey(selected) !== key
                )
              : [...validTags, tag]
          );
        },
        onClear: () => onTagsChange([]),
      }),
      checklistNode({
        id: 'direction',
        label: t('setups.create.field.direction'),
        icon: FILTER_MENU_ICONS.direction,
        options: SETUP_DIRECTION_FILTERS.map((direction) => ({
          value: direction,
          label: directionLabel(direction),
        })),
        selected: selectedDirections,
        onToggle: (value) => {
          const direction = SETUP_DIRECTION_FILTERS.find(
            (candidate) => candidate === value
          );
          if (!direction) return;
          onDirectionsChange(
            selectedDirections.includes(direction)
              ? selectedDirections.filter((selected) => selected !== direction)
              : [...selectedDirections, direction]
          );
        },
        onClear: () => onDirectionsChange([]),
      }),
    ],
    [
      onDirectionsChange,
      onTagsChange,
      selectedDirections,
      tagOptions,
      validTags,
    ]
  );

  return (
    <>
      <span id={triggerLabelId} className="journalit-setups-view__sr-only">
        {t('setups.view.overview.tag-filter.aria')}
      </span>
      <CascadingFilterMenu
        app={app}
        entries={entries}
        onReset={onReset}
        className="journalit-setups-filter-button"
        ariaLabelledBy={triggerLabelId}
      />
    </>
  );
};

SetupOverviewFilter.displayName = 'SetupOverviewFilter';
