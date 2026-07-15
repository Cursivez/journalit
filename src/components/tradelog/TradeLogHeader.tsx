

import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { isDiscreteCustomFieldFilterable } from '../../types/customFields';
import { App, Modal, WorkspaceLeaf } from 'obsidian';
import {
  ViewLevel,
  TradeLogFilters,
  SELECTABLE_TRADE_TYPES_COUNT,
  SELECTABLE_STATUSES_COUNT,
} from '../../services/tradelog/types';
import { DateRangeFilter } from '../dashboard/components/FilterControls/DateRangeFilter';
import { FilterButton } from '../shared/FilterButton';
import { openFilterModal, UnifiedFilters } from '../shared/filters';
import type {
  AvailableCustomFieldFilter,
  AvailableImageFilterOptions,
} from '../shared/filters/types';
import type { ImageGalleryService } from '../../services/imageGallery';
import { TradeLogService } from '../../services/tradelog';
import JournalitPlugin from '../../main';
import {
  openTradeLogSettingsModal,
  TradeLogSettingsModal,
} from './TradeLogSettingsModal';
import {
  ChevronDown,
  SlidersHorizontal,
  Square,
  SquareCheckBig,
} from '../shared/icons/ObsidianIcon';
import type {
  ImageGallerySize,
  ImageGallerySort,
  ImageGallerySourceType,
  ImageGalleryViewMode,
} from '../imageGallery/types';
import {
  IMAGE_GALLERY_SIZES,
  IMAGE_GALLERY_SOURCE_TYPES,
  getImageGallerySizeLabel,
  getImageGallerySortLabel,
  getImageGallerySourceTypeLabel,
  type ImageGalleryControls,
} from '../imageGallery/ImageGallery';
import { t } from '../../lang/helpers';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  TRADE_LOG_COLUMN_SETTINGS_BUTTON_TARGET_ID,
  TRADE_LOG_COLUMN_SETTINGS_OPENED_ACTION_ID,
  TRADE_LOG_FILTER_BUTTON_TARGET_ID,
  TRADE_LOG_FILTER_MODAL_CLOSED_ACTION_ID,
  TRADE_LOG_FILTER_MODAL_OPENED_ACTION_ID,
  TRADE_LOG_IMAGE_GALLERY_CONTROLS_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_GROUPING_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_MODE_BUTTON_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_SELECTED_ACTION_ID,
  TRADE_LOG_IMAGE_GALLERY_SIZE_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_SOURCE_SORT_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_MAIN_GUIDE_ID,
  TRADE_LOG_MAIN_GUIDE_ID,
  TRADE_LOG_MODE_SELECTOR_TARGET_ID,
  TRADE_LOG_MULTI_SELECT_BUTTON_TARGET_ID,
  TRADE_LOG_VIEW_SELECTOR_TARGET_ID,
} from '../../guides/tradeLogGuideIds';
import { useEventBus } from '../../hooks/useEventBus';
import { ToolbarButton } from '../shared/ToolbarButton';
import { DropdownMenu, type DropdownMenuOption } from '../shared/DropdownMenu';

const VIEW_LEVELS: ReadonlySet<string> = new Set([
  'years',
  'quarters',
  'months',
  'weeks',
  'days',
  'trades',
]);

const isViewLevel = (value: string): value is ViewLevel =>
  VIEW_LEVELS.has(value);

const VIEW_LEVEL_OPTIONS: Array<DropdownMenuOption<ViewLevel>> = [
  { value: 'trades', label: t('common.trades') },
  { value: 'years', label: t('common.years') },
  { value: 'quarters', label: t('common.quarters') },
  { value: 'months', label: t('common.months') },
  { value: 'weeks', label: t('common.weeks') },
  { value: 'days', label: t('common.days') },
];

const TRADE_LOG_GUIDE_IDS_WITH_FILTER_MODAL = new Set([
  TRADE_LOG_MAIN_GUIDE_ID,
  TRADE_LOG_IMAGE_GALLERY_MAIN_GUIDE_ID,
]);

const IMAGE_GALLERY_SORTS: ImageGallerySort[] = [
  'newest',
  'oldest',
  'best',
  'worst',
];
const IMAGE_GALLERY_SMALL_ICON_CELLS = [
  'small-1',
  'small-2',
  'small-3',
  'small-4',
  'small-5',
  'small-6',
  'small-7',
  'small-8',
  'small-9',
];
const IMAGE_GALLERY_MEDIUM_ICON_CELLS = [
  'medium-1',
  'medium-2',
  'medium-3',
  'medium-4',
];

const IMAGE_GALLERY_SOURCE_OPTIONS: Array<
  DropdownMenuOption<ImageGallerySourceType>
> = IMAGE_GALLERY_SOURCE_TYPES.map((sourceType) => ({
  value: sourceType,
  label: getImageGallerySourceTypeLabel(sourceType),
}));

const IMAGE_GALLERY_SORT_OPTIONS: Array<DropdownMenuOption<ImageGallerySort>> =
  IMAGE_GALLERY_SORTS.map((sort) => ({
    value: sort,
    label: getImageGallerySortLabel(sort),
  }));

interface TradeLogHeaderProps {
  app: App;
  plugin: JournalitPlugin;
  imageGalleryService: ImageGalleryService;
  leaf: WorkspaceLeaf;
  filters: TradeLogFilters;
  mode: 'trades' | 'imageGallery';
  onModeChange: (mode: 'trades' | 'imageGallery') => void;
  imageGalleryControls: ImageGalleryControls;
  onImageGalleryControlsChange: (
    controls: Partial<ImageGalleryControls>
  ) => void;
  onFilterChange: (filters: Partial<TradeLogFilters>) => void;
  onSettingsChange: () => void;
  isMultiSelectMode?: boolean;
  onToggleMultiSelectMode?: () => void;
}

const ImageGalleryHeaderControls: React.FC<{
  controls: ImageGalleryControls;
  onChange: (controls: Partial<ImageGalleryControls>) => void;
  filterButton: React.ReactNode;
  targetRef?: (element: HTMLElement | null) => void;
  sourceSortTargetRef?: (element: HTMLElement | null) => void;
  groupingTargetRef?: (element: HTMLElement | null) => void;
  sizeTargetRef?: (element: HTMLElement | null) => void;
}> = ({
  controls,
  onChange,
  filterButton,
  targetRef,
  sourceSortTargetRef,
  groupingTargetRef,
  sizeTargetRef,
}) => (
  <div className="trade-log-image-gallery-controls" ref={targetRef}>
    <div
      className="trade-log-image-gallery-source-sort-controls"
      ref={sourceSortTargetRef}
    >
      <ImageGalleryControlDropdown
        label={t('imageGallery.source.label')}
        options={IMAGE_GALLERY_SOURCE_OPTIONS}
        value={controls.sourceType}
        onChange={(sourceType) => onChange({ sourceType })}
      />

      <ImageGalleryControlDropdown
        label={t('imageGallery.sort.label')}
        options={IMAGE_GALLERY_SORT_OPTIONS}
        value={controls.sort}
        onChange={(sort) => onChange({ sort })}
      />
    </div>

    <div
      className="journalit-image-gallery-view-toggle"
      aria-label={t('imageGallery.view-mode-aria')}
      ref={groupingTargetRef}
      role="group"
    >
      {(['grouped', 'individual'] satisfies ImageGalleryViewMode[]).map(
        (viewMode) => (
          <button
            aria-pressed={controls.viewMode === viewMode}
            className={
              controls.viewMode === viewMode
                ? 'journalit-image-gallery-view-toggle__button journalit-image-gallery-view-toggle__button--active'
                : 'journalit-image-gallery-view-toggle__button'
            }
            key={viewMode}
            onClick={() => onChange({ viewMode })}
            type="button"
          >
            {viewMode === 'grouped'
              ? t('imageGallery.view-mode.grouped')
              : t('imageGallery.view-mode.individual')}
          </button>
        )
      )}
    </div>

    <div
      className="journalit-image-gallery-size-toggle"
      aria-label={t('imageGallery.size-aria')}
      ref={sizeTargetRef}
    >
      {IMAGE_GALLERY_SIZES.map((size) => (
        <ToolbarButton
          active={controls.size === size}
          aria-label={getImageGallerySizeLabel(size)}
          key={size}
          onClick={() => onChange({ size })}
          type="button"
          variant="icon"
        >
          <ImageGallerySizeIcon size={size} />
        </ToolbarButton>
      ))}
    </div>

    {filterButton}
  </div>
);

ImageGalleryHeaderControls.displayName = 'ImageGalleryHeaderControls';

function ImageGalleryControlDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<DropdownMenuOption<T>>;
  value: T;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof window.Node &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.activeDocument.addEventListener('mousedown', handleClickOutside);
    return () =>
      window.activeDocument.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, [isOpen]);

  const selectDropdownOption = (nextValue: T) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className="trade-log-image-gallery-control" ref={dropdownRef}>
      <span>{label}</span>
      <div className="journalit-home-period-wrapper trade-log-image-gallery-control-dropdown">
        <button
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="journalit-home-period-selector clickable-icon trade-log-image-gallery-control-trigger"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span>{selectedOption?.label ?? value}</span>
          <ChevronDown
            className={
              isOpen
                ? 'journalit-home-period-chevron journalit-home-period-chevron--open trade-log-image-gallery-control-chevron'
                : 'journalit-home-period-chevron trade-log-image-gallery-control-chevron'
            }
            size={14}
            aria-hidden="true"
          />
        </button>
        {isOpen ? (
          <DropdownMenu
            className="trade-log-image-gallery-control-menu"
            options={options}
            value={value}
            onChange={selectDropdownOption}
          />
        ) : null}
      </div>
    </div>
  );
}

const ImageGallerySizeIcon: React.FC<{ size: ImageGallerySize }> = ({
  size,
}) => {
  switch (size) {
    case 'small':
      return (
        <span
          className="trade-log-image-gallery-size-icon trade-log-image-gallery-size-icon--small"
          aria-hidden="true"
        >
          {IMAGE_GALLERY_SMALL_ICON_CELLS.map((cell) => (
            <span key={cell} />
          ))}
        </span>
      );
    case 'medium':
      return (
        <span
          className="trade-log-image-gallery-size-icon trade-log-image-gallery-size-icon--medium"
          aria-hidden="true"
        >
          {IMAGE_GALLERY_MEDIUM_ICON_CELLS.map((cell) => (
            <span key={cell} />
          ))}
        </span>
      );
    case 'large':
      return (
        <span
          className="trade-log-image-gallery-size-icon trade-log-image-gallery-size-icon--large"
          aria-hidden="true"
        />
      );
  }
};

ImageGallerySizeIcon.displayName = 'ImageGallerySizeIcon';

export const TradeLogHeader = memo<TradeLogHeaderProps>(
  ({
    app,
    plugin,
    imageGalleryService,
    leaf,
    filters,
    mode,
    onModeChange,
    imageGalleryControls,
    onImageGalleryControlsChange,
    onFilterChange,
    onSettingsChange,
    isMultiSelectMode,
    onToggleMultiSelectMode,
  }) => {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [guideVersion, setGuideVersion] = useState(0);

    
    const tradeLogServiceRef = useRef<TradeLogService | null>(null);
    if (!tradeLogServiceRef.current) {
      tradeLogServiceRef.current = new TradeLogService(plugin);
    }
    const tradeLogService = tradeLogServiceRef.current;
    const activeFilterModalRef = useRef<Modal | null>(null);
    const activeSettingsModalRef = useRef<TradeLogSettingsModal | null>(null);
    const isClosingGuideFilterModalRef = useRef(false);
    const isOpeningGuideFilterModalRef = useRef(false);
    const emitGuideAction = useGuideAction();
    const registerModeSelectorTarget = useGuideTarget(
      TRADE_LOG_MODE_SELECTOR_TARGET_ID
    );
    const registerImageGalleryModeButtonTarget = useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_MODE_BUTTON_TARGET_ID
    );
    const registerViewSelectorTarget = useGuideTarget(
      TRADE_LOG_VIEW_SELECTOR_TARGET_ID
    );
    const registerImageGalleryControlsTarget = useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_CONTROLS_TARGET_ID
    );
    const registerImageGalleryGroupingTarget = useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_GROUPING_TARGET_ID
    );
    const registerImageGallerySourceSortTarget = useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_SOURCE_SORT_TARGET_ID
    );
    const registerImageGallerySizeTarget = useGuideTarget(
      TRADE_LOG_IMAGE_GALLERY_SIZE_TARGET_ID
    );
    const registerFilterButtonTarget = useGuideTarget(
      TRADE_LOG_FILTER_BUTTON_TARGET_ID
    );
    const registerMultiSelectButtonTarget = useGuideTarget(
      TRADE_LOG_MULTI_SELECT_BUTTON_TARGET_ID
    );
    const registerColumnSettingsTarget = useGuideTarget(
      TRADE_LOG_COLUMN_SETTINGS_BUTTON_TARGET_ID
    );

    const loadAccounts = useCallback(async () => {
      if (!tradeLogService) {
        return;
      }

      const availableAccounts = await tradeLogService.getUniqueAccounts();
      setAccounts(availableAccounts);
    }, [tradeLogService]);

    
    useEffect(() => {
      let isMounted = true;

      const loadAccountsSafely = async () => {
        if (!tradeLogService) {
          return;
        }

        const availableAccounts = await tradeLogService.getUniqueAccounts();
        if (isMounted) {
          setAccounts(availableAccounts);
        }
      };

      void loadAccountsSafely();

      return () => {
        isMounted = false;
        if (tradeLogServiceRef.current) {
          tradeLogServiceRef.current.destroy();
        }
      };
    }, [tradeLogService]);

    useEffect(() => {
      if (!plugin.viewGuideService) {
        return;
      }

      return plugin.viewGuideService.subscribe(() => {
        setGuideVersion((prev) => prev + 1);
      });
    }, [plugin]);

    useEventBus('trade:changed', () => {
      void loadAccounts();
    });
    useEventBus('backtest-trade:changed', () => {
      void loadAccounts();
    });
    useEventBus('account:changed', () => {
      void loadAccounts();
    });

    useEffect(() => {
      void guideVersion;

      if (mode !== 'imageGallery') {
        return;
      }

      const guideService = plugin.viewGuideService;
      const activeLeaf = guideService?.getActiveLeaf();
      if (!guideService || !activeLeaf || activeLeaf !== leaf) {
        return;
      }

      const session = guideService.getSessionForLeaf(
        activeLeaf,
        'journalit-trade-log-view'
      );
      if (session?.currentStepId === 'switch-to-gallery') {
        emitGuideAction(TRADE_LOG_IMAGE_GALLERY_SELECTED_ACTION_ID);
      }
    }, [emitGuideAction, guideVersion, leaf, mode, plugin]);

    
    const getActiveFilterCount = (): number => {
      let count = 0;
      
      if (
        filters.tradeTypes &&
        filters.tradeTypes.length > 0 &&
        filters.tradeTypes.length < SELECTABLE_TRADE_TYPES_COUNT
      )
        count++;
      if (
        filters.statuses &&
        filters.statuses.length > 0 &&
        filters.statuses.length < SELECTABLE_STATUSES_COUNT
      )
        count++;
      if (filters.accounts && filters.accounts.length > 0) count++;
      if (filters.tickers && filters.tickers.length > 0) count++;
      if (filters.setups && filters.setups.length > 0) count++;
      if (filters.tags && filters.tags.length > 0) count++;
      if (filters.mistakes && filters.mistakes.length > 0) count++;
      if (filters.reviewStatus && filters.reviewStatus.length > 0) count++;
      if (filters.directions && filters.directions.length > 0) count++;
      if (
        filters.customFieldFilters &&
        Object.values(filters.customFieldFilters).some(
          (values) => values.length > 0
        )
      ) {
        count += Object.values(filters.customFieldFilters).filter(
          (values) => values.length > 0
        ).length;
      }
      if (mode === 'imageGallery') {
        if (filters.imageAnnotationStatus?.length) count++;
        if (filters.imageTags?.length) count++;
      }
      return count;
    };

    
    const handleOpenFilterModal = useCallback(async () => {
      if (
        activeFilterModalRef.current ||
        isOpeningGuideFilterModalRef.current
      ) {
        return;
      }

      isOpeningGuideFilterModalRef.current = true;

      let availableCustomFieldFilters: AvailableCustomFieldFilter[] = [];
      let availableImageFilterOptions: AvailableImageFilterOptions | undefined;

      try {
        availableCustomFieldFilters =
          await tradeLogService.getAvailableCustomFieldFilters(
            (plugin.customFieldsService?.getFields() || []).filter(
              isDiscreteCustomFieldFilterable
            )
          );
        if (mode === 'imageGallery') {
          availableImageFilterOptions =
            await imageGalleryService.getAvailableFilterOptions();
        }
      } catch (error) {
        console.error('[TradeLogHeader] Failed to load filter options:', error);
      }

      if (activeFilterModalRef.current) {
        isOpeningGuideFilterModalRef.current = false;
        return;
      }

      const modal = openFilterModal({
        app,
        plugin,
        context: 'tradelog',
        currentFilters: {
          accounts: filters.accounts || [],
          tickers: filters.tickers || [],
          setups: filters.setups || [],
          tags: filters.tags || [],
          mistakes: filters.mistakes || [],
          tradeTypes: filters.tradeTypes || [],
          statuses: filters.statuses || [],
          reviewStatus: filters.reviewStatus || [],
          directions: filters.directions || [],
          customFieldFilters: filters.customFieldFilters || {},
          imageAnnotationStatus: filters.imageAnnotationStatus || [],
          imageTags: filters.imageTags || [],
        },
        availableAccounts: accounts,
        availableCustomFieldFilters,
        availableImageFilterOptions,
        showImageFilters: mode === 'imageGallery',
        onApply: (newFilters: UnifiedFilters) => {
          onFilterChange({
            tradeTypes: newFilters.tradeTypes,
            statuses: newFilters.statuses,
            reviewStatus: newFilters.reviewStatus,
            directions: newFilters.directions,
            accounts: newFilters.accounts,
            tickers: newFilters.tickers,
            setups: newFilters.setups,
            tags: newFilters.tags,
            mistakes: newFilters.mistakes,
            customFieldFilters: newFilters.customFieldFilters,
            imageAnnotationStatus: newFilters.imageAnnotationStatus,
            imageTags: newFilters.imageTags,
          });
        },
        onClose: () => {
          activeFilterModalRef.current = null;
          isOpeningGuideFilterModalRef.current = false;
          if (isClosingGuideFilterModalRef.current) {
            isClosingGuideFilterModalRef.current = false;
            return;
          }
          emitGuideAction(TRADE_LOG_FILTER_MODAL_CLOSED_ACTION_ID);
        },
      });

      activeFilterModalRef.current = modal;
      isOpeningGuideFilterModalRef.current = false;
      emitGuideAction(TRADE_LOG_FILTER_MODAL_OPENED_ACTION_ID);
    }, [
      accounts,
      app,
      emitGuideAction,
      filters,
      imageGalleryService,
      mode,
      onFilterChange,
      plugin,
      tradeLogService,
    ]);

    useEffect(() => {
      void guideVersion;

      const guideService = plugin.viewGuideService;
      if (!guideService) {
        return;
      }

      const activeLeaf = guideService.getActiveLeaf();
      if (!activeLeaf) {
        return;
      }

      if (activeLeaf !== leaf) {
        return;
      }

      const session = guideService.getSessionForLeaf(
        activeLeaf,
        'journalit-trade-log-view'
      );
      if (
        !session ||
        !TRADE_LOG_GUIDE_IDS_WITH_FILTER_MODAL.has(session.guideId)
      ) {
        return;
      }

      if (
        session.currentStepId === 'filter-modal' ||
        session.currentStepId === 'gallery-filter-modal'
      ) {
        if (!activeFilterModalRef.current) {
          void handleOpenFilterModal();
        }
        return;
      }

      if (activeFilterModalRef.current) {
        isClosingGuideFilterModalRef.current = true;
        activeFilterModalRef.current.close();
        activeFilterModalRef.current = null;
      }
    }, [guideVersion, handleOpenFilterModal, leaf, plugin]);

    const handleOpenSettingsModal = useCallback(() => {
      if (activeSettingsModalRef.current?.modalEl.isConnected) {
        return;
      }

      const modal = openTradeLogSettingsModal({
        app,
        plugin,
        onSave: () => {
          onSettingsChange();
        },
        onClose: () => {
          activeSettingsModalRef.current = null;
        },
      });
      activeSettingsModalRef.current = modal;
      emitGuideAction(TRADE_LOG_COLUMN_SETTINGS_OPENED_ACTION_ID);
    }, [app, emitGuideAction, plugin, onSettingsChange]);

    useEffect(() => {
      void guideVersion;

      const guideService = plugin.viewGuideService;
      if (!guideService) {
        return;
      }

      const activeLeaf = guideService.getActiveLeaf();
      if (!activeLeaf || activeLeaf !== leaf) {
        return;
      }

      const session = guideService.getSessionForLeaf(
        activeLeaf,
        'journalit-trade-log-view'
      );
      if (
        !session ||
        !TRADE_LOG_GUIDE_IDS_WITH_FILTER_MODAL.has(session.guideId)
      ) {
        return;
      }

      const shouldHaveSettingsModal =
        session.currentStepId === 'active-columns' ||
        session.currentStepId === 'available-columns';

      if (shouldHaveSettingsModal) {
        if (!activeSettingsModalRef.current?.modalEl.isConnected) {
          handleOpenSettingsModal();
        }
        return;
      }

      activeSettingsModalRef.current?.closeWithoutUnsavedChangesCheck();
      activeSettingsModalRef.current = null;
    }, [guideVersion, handleOpenSettingsModal, leaf, plugin]);

    const handleGuideBack = useCallback(
      ({ toStepId }: { toStepId: string }) => {
        if (toStepId === 'filter-modal') {
          activeSettingsModalRef.current?.closeWithoutUnsavedChangesCheck();
          activeSettingsModalRef.current = null;
          if (!activeFilterModalRef.current) {
            void handleOpenFilterModal();
          }
          return;
        }

        if (toStepId === 'active-columns' || toStepId === 'available-columns') {
          activeFilterModalRef.current?.close();
          activeFilterModalRef.current = null;
          if (!activeSettingsModalRef.current?.modalEl.isConnected) {
            handleOpenSettingsModal();
          }
          return;
        }

        activeSettingsModalRef.current?.closeWithoutUnsavedChangesCheck();
        activeSettingsModalRef.current = null;
      },
      [handleOpenFilterModal, handleOpenSettingsModal]
    );

    useGuideBackHandler(handleGuideBack);

    return (
      <div className="trade-log-header">
        <div
          className={`trade-log-controls ${mode === 'imageGallery' ? 'trade-log-controls--image-gallery' : ''}`}
        >
          <div
            className="trade-log-mode-selector"
            aria-label={t('tradelog.mode.label')}
            ref={registerModeSelectorTarget}
          >
            <button
              type="button"
              className={`journalit-trade-log-mode-selector__button trade-log-mode-selector__button${mode === 'trades' ? ' trade-log-mode-selector__button--active' : ''}`}
              onClick={() => onModeChange('trades')}
              aria-pressed={mode === 'trades'}
            >
              {t('tradelog.mode.trades')}
            </button>
            <button
              type="button"
              className={`journalit-trade-log-mode-selector__button trade-log-mode-selector__button${mode === 'imageGallery' ? ' trade-log-mode-selector__button--active' : ''}`}
              ref={registerImageGalleryModeButtonTarget}
              onClick={() => {
                onModeChange('imageGallery');
                emitGuideAction(TRADE_LOG_IMAGE_GALLERY_SELECTED_ACTION_ID);
              }}
              aria-pressed={mode === 'imageGallery'}
            >
              {t('tradelog.mode.image-gallery')}
            </button>
          </div>

          <DateRangeFilter
            dateRange={filters.dateRange}
            onChange={(newRange) =>
              onFilterChange({
                dateRange: newRange,
              })
            }
          />

          {mode === 'imageGallery' ? (
            <ImageGalleryHeaderControls
              controls={imageGalleryControls}
              onChange={onImageGalleryControlsChange}
              filterButton={
                <div
                  className="trade-log-image-gallery-filter-action"
                  ref={registerFilterButtonTarget}
                >
                  <FilterButton
                    onClick={() => {
                      void handleOpenFilterModal();
                    }}
                    className="trade-log-image-gallery-filter-button"
                    activeFilterCount={getActiveFilterCount()}
                  />
                </div>
              }
              targetRef={registerImageGalleryControlsTarget}
              sourceSortTargetRef={registerImageGallerySourceSortTarget}
              groupingTargetRef={registerImageGalleryGroupingTarget}
              sizeTargetRef={registerImageGallerySizeTarget}
            />
          ) : null}

          <div className="trade-log-filter-actions">
            {mode === 'trades' ? (
              <div
                className="trade-log-view-selector"
                ref={registerViewSelectorTarget}
              >
                <ImageGalleryControlDropdown
                  label={`${t('tradelog.view.selector.label')}:`}
                  options={VIEW_LEVEL_OPTIONS}
                  value={filters.viewLevel}
                  onChange={(viewLevel) => {
                    if (isViewLevel(viewLevel)) {
                      onFilterChange({ viewLevel });
                    }
                  }}
                />
              </div>
            ) : null}
            {mode !== 'imageGallery' ? (
              <div ref={registerFilterButtonTarget}>
                <FilterButton
                  onClick={() => {
                    void handleOpenFilterModal();
                  }}
                  className="trade-log-image-gallery-filter-button"
                  activeFilterCount={getActiveFilterCount()}
                />
              </div>
            ) : null}
            {mode === 'trades' && filters.viewLevel === 'trades' && (
              <div
                className="journalit-filter-button-container"
                ref={registerMultiSelectButtonTarget}
              >
                <button
                  className={`journalit-filter-button clickable-icon trade-log-image-gallery-filter-button ${isMultiSelectMode ? 'active' : ''}`}
                  onClick={() => {
                    onToggleMultiSelectMode?.();
                  }}
                  aria-label={
                    isMultiSelectMode
                      ? t('tradelog.batch.disable-multi-select')
                      : t('tradelog.batch.enable-multi-select')
                  }
                >
                  {isMultiSelectMode ? (
                    <SquareCheckBig size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </div>
            )}
            {mode === 'trades' ? (
              <div className="journalit-filter-button-container">
                <button
                  ref={registerColumnSettingsTarget}
                  className="journalit-filter-button clickable-icon trade-log-image-gallery-filter-button"
                  onClick={handleOpenSettingsModal}
                  aria-label={t('tradelog.batch.column-settings')}
                >
                  <SlidersHorizontal size={16} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

TradeLogHeader.displayName = 'TradeLogHeader';
