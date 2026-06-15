

import React, { useState, useEffect, useRef } from 'react';
import { TFile } from 'obsidian';
import JournalitPlugin from '../../../main';
import { InvalidContextMessage } from './InvalidContextMessage';
import { SkeletonBox } from '../../shared';
import type { KeyLevel, KeyLevels } from '../../drc/types';
import {
  getWeekAnchorDate,
  getWeekStartDaySetting,
  getWeekStringForDate,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import {
  getCurrentLanguage,
  t,
  type TranslationKey,
} from '../../../lang/helpers';


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;

interface KeyLevelsPreviewData {
  keyLevels: KeyLevels;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- component has no props but keeps an explicit props alias
interface KeyLevelsWidgetConfig {
  
}

interface KeyLevelsWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: KeyLevelsWidgetConfig;
  
  preview?: boolean;
  
  previewData?: KeyLevelsPreviewData;
}

type ImportanceLevel = 'High' | 'Medium' | 'Low' | null;
type ReviewMode = 'drc' | 'weekly-review' | 'monthly-review';
type KeyLevelSource = 'current' | 'weekly' | 'monthly';
type KeyLevelType = 'support' | 'resistance';

interface DisplayKeyLevel extends KeyLevel {
  source: KeyLevelSource;
  currentIndex?: number;
  sourcePath?: string;
  sourceLabel?: string;
}

interface EditingState {
  type: KeyLevelType;
  index: number;
  value: string;
}


const WIDGET_CLASS = 'journalit-key-levels-widget';
const EMPTY_KEY_LEVELS: KeyLevels = { support: [], resistance: [] };

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

const parseReviewMode = (value: unknown): ReviewMode | null => {
  switch (value) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
      return value;
    default:
      return null;
  }
};

const FlagSvg: React.FC<{ color: string; size?: number }> = ({
  color,
  size = 14,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const KeyLevelsFlagIcon: React.FC<{ importance: ImportanceLevel }> = ({
  importance,
}) => {
  const colorClass = importance
    ? `key-levels-flag--${importance.toLowerCase()}`
    : 'key-levels-flag--default';

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`key-levels-flag ${colorClass}`}
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
};

const SupportArrow: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="key-levels-arrow"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const ResistanceArrow: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="key-levels-arrow"
  >
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

const isKeyLevels = (value: unknown): value is KeyLevels => {
  const record = asRecord(value);
  return Boolean(
    record && Array.isArray(record.support) && Array.isArray(record.resistance)
  );
};

const normalizeKeyLevel = (level: unknown): KeyLevel | null => {
  const keyLevel = asRecord(level);
  if (!keyLevel || keyLevel.price === undefined || keyLevel.price === null) {
    return null;
  }

  const rawPrice = keyLevel.price;
  if (typeof rawPrice !== 'string' && typeof rawPrice !== 'number') {
    return null;
  }

  const price = String(rawPrice).trim();
  if (!price) return null;

  return {
    price,
    importance:
      keyLevel.importance === 'High' ||
      keyLevel.importance === 'Medium' ||
      keyLevel.importance === 'Low'
        ? keyLevel.importance
        : null,
  };
};

const normalizeKeyLevelArray = (levels: unknown[]): KeyLevel[] =>
  levels.flatMap((level) => {
    const normalized = normalizeKeyLevel(level);
    return normalized ? [normalized] : [];
  });

const normalizeKeyLevels = (value: unknown): KeyLevels => {
  if (!isKeyLevels(value)) return { support: [], resistance: [] };
  return {
    support: normalizeKeyLevelArray(value.support),
    resistance: normalizeKeyLevelArray(value.resistance),
  };
};

interface KeyLevelGroup {
  levels: KeyLevels;
  source: KeyLevelSource;
  sourcePath?: string;
  sourceLabel?: string;
}

const getPriceNumber = (price: string): number | null => {
  const value = Number.parseFloat(price.replace(/,/g, '').trim());
  return Number.isFinite(value) ? value : null;
};

const sortLevelsForType = <T extends KeyLevel>(
  type: KeyLevelType,
  levels: T[]
): T[] => {
  return [...levels].sort((a, b) => {
    const aValue = getPriceNumber(a.price);
    const bValue = getPriceNumber(b.price);

    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    return type === 'support' ? bValue - aValue : aValue - bValue;
  });
};

const sortKeyLevels = (levels: KeyLevels): KeyLevels => ({
  support: sortLevelsForType('support', levels.support),
  resistance: sortLevelsForType('resistance', levels.resistance),
});

const dedupeLevels = (
  type: KeyLevelType,
  groups: KeyLevelGroup[]
): DisplayKeyLevel[] => {
  const seen = new Set<string>();
  const result: DisplayKeyLevel[] = [];

  for (const group of groups) {
    group.levels[type].forEach((level, index) => {
      const key = level.price.trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      result.push({
        ...level,
        source: group.source,
        currentIndex: group.source === 'current' ? index : undefined,
        sourcePath: group.sourcePath,
        sourceLabel: group.sourceLabel,
      });
    });
  }

  return sortLevelsForType(type, result);
};

const getDateFromFrontmatter = (
  frontmatter: Record<string, unknown>
): Date | null => {
  if (typeof frontmatter.date === 'string') {
    return parseLocalDateSafe(frontmatter.date);
  }

  return getMonthAnchorDate(frontmatter);
};

const getMonthAnchorDate = (
  frontmatter: Record<string, unknown>
): Date | null => {
  const year = Number(frontmatter.year);
  const month = Number(frontmatter.month);
  if (Number.isFinite(year) && Number.isFinite(month)) {
    return new Date(year, month - 1, 1);
  }

  return null;
};

const getMonthLabel = (date: Date): string =>
  date.toLocaleString(getCurrentLanguage(), { month: 'short' });


const FlagPicker: React.FC<{
  value: ImportanceLevel;
  onChange: (value: ImportanceLevel) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target;
      if (
        containerRef.current &&
        (!(target instanceof Node) || !containerRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.activeDocument.addEventListener('mousedown', handleClickOutside);
    }
    return () =>
      window.activeDocument.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, [isOpen]);

  const options: { value: ImportanceLevel; color: string; label: string }[] = [
    {
      value: null,
      color: 'var(--text-faint)',
      label: t('widget.key-levels.importance.none'),
    },
    {
      value: 'High',
      color: 'var(--color-red)',
      label: t('widget.key-levels.importance.high'),
    },
    {
      value: 'Medium',
      color: 'var(--color-orange)',
      label: t('widget.key-levels.importance.medium'),
    },
    {
      value: 'Low',
      color: 'var(--color-blue)',
      label: t('widget.key-levels.importance.low'),
    },
  ];

  const currentOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={containerRef} className="journalit-key-levels-importance">
      <button
        type="button"
        className="clickable-icon journalit-key-levels-importance-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('widget.key-levels.select-importance')}
      >
        <FlagSvg color={currentOption.color} />
      </button>

      {isOpen && (
        <div className="journalit-home-period-menu journalit-key-levels-importance-dropdown">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`journalit-home-period-option journalit-key-levels-importance-option ${
                value === option.value
                  ? 'journalit-home-period-option--active journalit-key-levels-importance-option--selected'
                  : ''
              }`}
              aria-label={option.label}
            >
              <span className="journalit-key-levels-importance-option-icon">
                <FlagSvg color={option.color} size={16} />
              </span>
              <span className="journalit-home-period-option__label journalit-key-levels-importance-option-label">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function KeyLevelsSkeleton() {
  const getSectionSkeleton = (
    titleKey: TranslationKey,
    tone: 'support' | 'resistance'
  ) => (
    <div className="key-levels-skeleton-section">
      <div
        className={`key-levels-skeleton-header key-levels-skeleton-header--${tone}`}
      >
        <SkeletonBox width={12} height={12} borderRadius="2px" />
        <span className="key-levels-skeleton-title">{t(titleKey)}</span>
      </div>
      <div className="key-levels-skeleton-body">
        {[1, 2].map((rowNumber) => (
          <div
            key={`${tone}-skeleton-${rowNumber}`}
            className={`key-levels-skeleton-row ${
              rowNumber === 2 ? 'key-levels-skeleton-row--last' : ''
            }`}
          >
            <div className="key-levels-skeleton-row-content">
              <SkeletonBox
                width={14}
                height={14}
                borderRadius="2px"
                className="key-levels-skeleton-icon"
              />
              <SkeletonBox width={60} height={14} borderRadius="4px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={WIDGET_CLASS}>
      {getSectionSkeleton('widget.key-levels.support', 'support')}
      {getSectionSkeleton('widget.key-levels.resistance', 'resistance')}
    </div>
  );
}

function useKeyLevelsWidgetModel({
  filePath,
  plugin,
  preview,
  previewData,
}: KeyLevelsWidgetProps) {
  const [keyLevels, setKeyLevels] = useState<KeyLevels>({
    support: [],
    resistance: [],
  });
  const [displayLevels, setDisplayLevels] = useState<{
    support: DisplayKeyLevel[];
    resistance: DisplayKeyLevel[];
  }>({ support: [], resistance: [] });
  const [reviewMode, setReviewMode] = useState<ReviewMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidContext, setIsValidContext] = useState(true);
  const [editing, setEditing] = useState<EditingState | null>(null);

  
  const [newSupportLevel, setNewSupportLevel] = useState('');
  const [newResistanceLevel, setNewResistanceLevel] = useState('');
  const [supportImportance, setSupportImportance] =
    useState<ImportanceLevel>(null);
  const [resistanceImportance, setResistanceImportance] =
    useState<ImportanceLevel>(null);

  const supportInputRef = useRef<HTMLInputElement>(null);
  const resistanceInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const retryCountRef = useRef(0);
  const dependencyPathsRef = useRef<Set<string>>(new Set([filePath]));
  const inheritedGroupsRef = useRef<KeyLevelGroup[]>([]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editing?.index, editing?.type]);

  useEffect(() => {
    
    if (preview && previewData) {
      setKeyLevels(previewData.keyLevels);
      setDisplayLevels({
        support: sortLevelsForType(
          'support',
          previewData.keyLevels.support.map((level) => ({
            ...level,
            source: 'current' as const,
          }))
        ),
        resistance: sortLevelsForType(
          'resistance',
          previewData.keyLevels.resistance.map((level) => ({
            ...level,
            source: 'current' as const,
          }))
        ),
      });
      setLoading(false);
      setIsValidContext(true);
      return;
    }

    retryCountRef.current = 0;
    dependencyPathsRef.current = new Set([filePath]);
    void loadKeyLevels();

    
    const handleMetadataChange = (file: TFile) => {
      if (dependencyPathsRef.current.has(file.path)) {
        void loadKeyLevels();
      }
    };

    plugin.app.metadataCache.on('changed', handleMetadataChange);

    return () => {
      plugin.app.metadataCache.off('changed', handleMetadataChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadKeyLevels is intentionally not in deps to prevent infinite loops
  }, [filePath, preview, previewData, plugin.app.metadataCache]);

  const getLevelsFromPath = (path: string): KeyLevels => {
    const file = plugin.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return { ...EMPTY_KEY_LEVELS };
    const frontmatter =
      plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    return normalizeKeyLevels(frontmatter?.keyLevels);
  };

  const buildDisplayLevels = async (
    mode: ReviewMode,
    frontmatter: Record<string, unknown>,
    currentLevels: KeyLevels
  ) => {
    const date = getDateFromFrontmatter(frontmatter);
    const monthlyDate =
      mode === 'weekly-review'
        ? (getMonthAnchorDate(frontmatter) ?? date)
        : date;
    const groups: KeyLevelGroup[] = [
      { levels: currentLevels, source: 'current' },
    ];
    const dependencyPaths = new Set<string>([filePath]);

    if (date && mode === 'drc') {
      const weeklyService = plugin.serviceManager
        ? await plugin.serviceManager.getWeeklyReviewService()
        : plugin.weeklyReviewService;
      const weeklyPath = weeklyService?.getWeeklyReviewPath(date);
      if (weeklyPath && weeklyPath !== filePath) {
        dependencyPaths.add(weeklyPath);
        groups.push({
          levels: getLevelsFromPath(weeklyPath),
          source: 'weekly',
          sourcePath: weeklyPath,
          sourceLabel: getWeekStringForDate(
            getWeekAnchorDate(date, getWeekStartDaySetting(plugin))
          ),
        });
      }
    }

    if (monthlyDate && mode !== 'monthly-review') {
      const monthlyService = plugin.serviceManager
        ? await plugin.serviceManager.getMonthlyReviewService()
        : plugin.monthlyReviewService;
      const monthlyPath = monthlyService?.getMonthlyReviewPath(monthlyDate);
      if (monthlyPath && monthlyPath !== filePath) {
        dependencyPaths.add(monthlyPath);
        groups.push({
          levels: getLevelsFromPath(monthlyPath),
          source: 'monthly',
          sourcePath: monthlyPath,
          sourceLabel: getMonthLabel(monthlyDate),
        });
      }
    }

    dependencyPathsRef.current = dependencyPaths;
    inheritedGroupsRef.current = groups.filter(
      (group) => group.source !== 'current'
    );
    setDisplayLevels({
      support: dedupeLevels('support', groups),
      resistance: dedupeLevels('resistance', groups),
    });
  };

  const loadKeyLevels = async () => {
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
        window.setTimeout(
          () => void loadKeyLevels(),
          FRONTMATTER_RETRY_DELAY_MS
        );
        return;
      }
      setIsValidContext(false);
      setLoading(false);
      return;
    }

    const mode = parseReviewMode(frontmatter.type);
    if (!mode) {
      setIsValidContext(false);
      setLoading(false);
      return;
    }
    const levels = normalizeKeyLevels(frontmatter.keyLevels);

    setReviewMode(mode);
    setKeyLevels(levels);
    await buildDisplayLevels(mode, frontmatter, levels);
    setIsValidContext(true);
    setLoading(false);
  };

  const updateFrontmatter = async (updatedLevels: KeyLevels) => {
    const file = plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile) || !reviewMode) return;

    try {
      if (reviewMode === 'drc') {
        await plugin.drcService.updateDRCFrontmatter(
          filePath,
          {
            keyLevels: updatedLevels,
          },
          'user-input'
        );
      } else if (reviewMode === 'weekly-review') {
        const weeklyService = plugin.serviceManager
          ? await plugin.serviceManager.getWeeklyReviewService()
          : plugin.weeklyReviewService;
        if (!weeklyService) return;
        await weeklyService.updateWeeklyReviewFrontmatter(filePath, {
          keyLevels: updatedLevels,
        });
      } else {
        const monthlyService = plugin.serviceManager
          ? await plugin.serviceManager.getMonthlyReviewService()
          : plugin.monthlyReviewService;
        if (!monthlyService) return;
        await monthlyService.updateMonthlyReviewFrontmatter(filePath, {
          keyLevels: updatedLevels,
        });
      }
    } catch (error) {
      console.error('[KeyLevelsWidget] Failed to update frontmatter:', error);
    }
  };

  const commitKeyLevels = async (updatedLevels: KeyLevels) => {
    const sortedLevels = sortKeyLevels(updatedLevels);
    setKeyLevels(sortedLevels);
    setDisplayLevels({
      support: dedupeLevels('support', [
        { levels: sortedLevels, source: 'current' },
        ...inheritedGroupsRef.current,
      ]),
      resistance: dedupeLevels('resistance', [
        { levels: sortedLevels, source: 'current' },
        ...inheritedGroupsRef.current,
      ]),
    });
    await updateFrontmatter(sortedLevels);
    await loadKeyLevels();
  };

  const addSupportLevel = async () => {
    if (preview) return;
    const price = newSupportLevel.trim();
    if (!price) return;

    const newLevel: KeyLevel = {
      price,
      importance: supportImportance,
    };

    const updatedLevels: KeyLevels = {
      ...keyLevels,
      support: [...keyLevels.support, newLevel],
    };

    setNewSupportLevel('');
    setSupportImportance(null);
    await commitKeyLevels(updatedLevels);

    
    supportInputRef.current?.focus();
  };

  const addResistanceLevel = async () => {
    if (preview) return;
    const price = newResistanceLevel.trim();
    if (!price) return;

    const newLevel: KeyLevel = {
      price,
      importance: resistanceImportance,
    };

    const updatedLevels: KeyLevels = {
      ...keyLevels,
      resistance: [...keyLevels.resistance, newLevel],
    };

    setNewResistanceLevel('');
    setResistanceImportance(null);
    await commitKeyLevels(updatedLevels);

    
    resistanceInputRef.current?.focus();
  };

  const removeSupportLevel = async (index: number) => {
    if (preview) return;
    const updatedSupport = keyLevels.support.filter((_, i) => i !== index);
    const updatedLevels: KeyLevels = {
      ...keyLevels,
      support: updatedSupport,
    };

    await commitKeyLevels(updatedLevels);
  };

  const removeResistanceLevel = async (index: number) => {
    if (preview) return;
    const updatedResistance = keyLevels.resistance.filter(
      (_, i) => i !== index
    );
    const updatedLevels: KeyLevels = {
      ...keyLevels,
      resistance: updatedResistance,
    };

    await commitKeyLevels(updatedLevels);
  };

  const startEditing = (type: KeyLevelType, index: number, level: KeyLevel) => {
    if (preview) return;
    setEditing({ type, index, value: level.price });
  };

  const cancelEditing = () => setEditing(null);

  const commitEditing = async () => {
    if (!editing) return;
    const price = editing.value.trim();
    if (!price) {
      cancelEditing();
      return;
    }

    const levels = keyLevels[editing.type];
    const updatedTypeLevels = levels.map((level, index) =>
      index === editing.index ? { ...level, price } : level
    );
    const updatedLevels: KeyLevels = {
      ...keyLevels,
      [editing.type]: updatedTypeLevels,
    };

    setEditing(null);
    await commitKeyLevels(updatedLevels);
  };

  const handleSupportKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void addSupportLevel();
    }
  };

  const handleResistanceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void addResistanceLevel();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void commitEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  };

  return {
    displayLevels,
    loading,
    isValidContext,
    editing,
    setEditing,
    newSupportLevel,
    setNewSupportLevel,
    newResistanceLevel,
    setNewResistanceLevel,
    supportImportance,
    setSupportImportance,
    resistanceImportance,
    setResistanceImportance,
    supportInputRef,
    resistanceInputRef,
    editInputRef,
    addSupportLevel,
    addResistanceLevel,
    removeSupportLevel,
    removeResistanceLevel,
    startEditing,
    commitEditing,
    handleSupportKeyDown,
    handleResistanceKeyDown,
    handleEditKeyDown,
  };
}

export const KeyLevelsWidget: React.FC<KeyLevelsWidgetProps> = (props) => {
  const { plugin, preview } = props;
  const {
    displayLevels,
    loading,
    isValidContext,
    editing,
    setEditing,
    newSupportLevel,
    setNewSupportLevel,
    newResistanceLevel,
    setNewResistanceLevel,
    supportImportance,
    setSupportImportance,
    resistanceImportance,
    setResistanceImportance,
    supportInputRef,
    resistanceInputRef,
    editInputRef,
    addSupportLevel,
    addResistanceLevel,
    removeSupportLevel,
    removeResistanceLevel,
    startEditing,
    commitEditing,
    handleSupportKeyDown,
    handleResistanceKeyDown,
    handleEditKeyDown,
  } = useKeyLevelsWidgetModel(props);

  if (loading) {
    return <KeyLevelsSkeleton />;
  }

  if (!isValidContext) {
    return (
      <InvalidContextMessage
        widgetType={t('widget.key-levels.title')}
        reason={t('widget.key-levels.invalid-context')}
      />
    );
  }

  const removeButtonClassName = 'journalit-key-levels-remove-button';

  const openSourceReview = async (path: string) => {
    const file = plugin.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await plugin.openFile(path, true);
    }
  };

  const getSourceTag = (level: DisplayKeyLevel) => {
    if (level.source === 'current') return null;
    const label =
      level.sourceLabel ??
      (level.source === 'weekly'
        ? t('widget.key-levels.source.weekly')
        : t('widget.key-levels.source.monthly'));

    if (!level.sourcePath) {
      return (
        <span
          className={`key-levels-source-tag key-levels-source-tag--${level.source}`}
        >
          {label}
        </span>
      );
    }

    return (
      <button
        type="button"
        className={`key-levels-source-tag key-levels-source-tag--clickable key-levels-source-tag--${level.source}`}
        onClick={() => void openSourceReview(level.sourcePath!)}
        aria-label={t('widget.key-levels.open-source-review', { label })}
      >
        {label}
      </button>
    );
  };

  const getLevelItem = (
    level: DisplayKeyLevel,
    index: number,
    type: KeyLevelType,
    isLast: boolean
  ) => {
    const isCurrent = level.source === 'current';
    const currentIndex = isCurrent ? (level.currentIndex ?? -1) : -1;
    const isEditing =
      editing?.type === type && editing.index === currentIndex && isCurrent;
    const canEditLevel = isCurrent && !preview && currentIndex >= 0;

    return (
      <div
        key={`${type}-${level.source}-${level.currentIndex ?? level.sourcePath ?? 'inherited'}-${level.price}`}
        className={`key-levels-item ${isLast ? 'key-levels-item--last' : ''}`}
      >
        <div className="key-levels-item-content">
          <KeyLevelsFlagIcon importance={level.importance} />
          {isEditing ? (
            <input
              ref={editInputRef}
              value={editing.value}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, value: e.target.value } : prev
                )
              }
              onKeyDown={(event) => void handleEditKeyDown(event)}
              onBlur={() => void commitEditing()}
              className="key-levels-edit-input"
            />
          ) : canEditLevel ? (
            <span
              className="key-levels-price key-levels-price--editable"
              role="button"
              tabIndex={0}
              onClick={() => startEditing(type, currentIndex, level)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                startEditing(type, currentIndex, level);
              }}
            >
              {level.price}
            </span>
          ) : (
            <span className="key-levels-price">{level.price}</span>
          )}
          {getSourceTag(level)}
        </div>
        {!preview && isCurrent && currentIndex >= 0 && (
          <button
            onClick={() =>
              type === 'support'
                ? void removeSupportLevel(currentIndex)
                : void removeResistanceLevel(currentIndex)
            }
            className={`clickable-icon ${removeButtonClassName}`}
            aria-label={t('widget.key-levels.remove-level')}
          >
            [x]
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={WIDGET_CLASS}>
      
      <div className="key-levels-section key-levels-section--support">
        <div className="key-levels-section-header">
          <SupportArrow />
          <span>{t('widget.key-levels.support')}</span>
        </div>

        <div className="key-levels-section-body">
          {displayLevels.support.length > 0 ? (
            displayLevels.support.map((level, index) =>
              getLevelItem(
                level,
                index,
                'support',
                index === displayLevels.support.length - 1
              )
            )
          ) : (
            <div className="key-levels-empty">
              {t('widget.key-levels.no-levels')}
            </div>
          )}
        </div>

        {!preview && (
          <div className="key-levels-input-row">
            <input
              ref={supportInputRef}
              type="text"
              value={newSupportLevel}
              onChange={(e) => setNewSupportLevel(e.target.value)}
              onKeyDown={(event) => void handleSupportKeyDown(event)}
              placeholder={t('widget.key-levels.price-placeholder')}
              className="key-levels-input"
            />
            <FlagPicker
              value={supportImportance}
              onChange={setSupportImportance}
            />
            <button
              onClick={() => void addSupportLevel()}
              disabled={!newSupportLevel.trim()}
              className="key-levels-add-button"
            >
              +
            </button>
          </div>
        )}
      </div>

      
      <div className="key-levels-section key-levels-section--resistance">
        <div className="key-levels-section-header">
          <ResistanceArrow />
          <span>{t('widget.key-levels.resistance')}</span>
        </div>

        <div className="key-levels-section-body">
          {displayLevels.resistance.length > 0 ? (
            displayLevels.resistance.map((level, index) =>
              getLevelItem(
                level,
                index,
                'resistance',
                index === displayLevels.resistance.length - 1
              )
            )
          ) : (
            <div className="key-levels-empty">
              {t('widget.key-levels.no-levels')}
            </div>
          )}
        </div>

        {!preview && (
          <div className="key-levels-input-row">
            <input
              ref={resistanceInputRef}
              type="text"
              value={newResistanceLevel}
              onChange={(e) => setNewResistanceLevel(e.target.value)}
              onKeyDown={(event) => void handleResistanceKeyDown(event)}
              placeholder={t('widget.key-levels.price-placeholder')}
              className="key-levels-input"
            />
            <FlagPicker
              value={resistanceImportance}
              onChange={setResistanceImportance}
            />
            <button
              onClick={() => void addResistanceLevel()}
              disabled={!newResistanceLevel.trim()}
              className="key-levels-add-button"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

KeyLevelsWidget.displayName = 'KeyLevelsWidget';

export {};
