import { logger } from '../utils/logger';


import { App, Notice, PluginManifest } from 'obsidian';
import {
  DEFAULT_SCALPER_DEFAULTS,
  JournalitSettings,
  DEFAULT_SETTINGS,
  resolveTradeFormLayoutSettings,
  QuickLinkAction,
  SidebarNavItem,
} from './types';
import {
  DEFAULT_TRADING_DAY_CUTOFF_TIME,
  TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION,
} from '../utils/tradingDayUtils';
import { debounceAsync } from '../utils/debounce';
import { Mutex } from '../utils/mutex';
import { t } from '../lang/helpers';
import type { SessionLogTagDefinition } from '../types/sessionLog';
import type {
  SessionModeLinkedResource,
  SessionModePhaseLayouts,
  SessionModeWindow,
  TradeGateNode,
  TradeGateWorkflow,
} from '../types/sessionMode';
import { normalizeSessionModePhaseLayouts } from '../utils/sessionModeLayout';


const BACKUP_FILENAME = 'data.backup.json';



function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

const QUICK_LINK_ACTIONS = new Set<string>([
  'addTrade',
  'openTradeLog',
  'openSetups',
  'openTradingDashboard',
  'openAccountDashboard',
  'openTodaysDRC',
  'openWeeklyReview',
  'openMonthlyReview',
  'openCSVImport',
  'openQuickTradeImport',
  'openLayoutBuilder',
  'openSessionMode',
  'openHome',
  'openQuarterlyReview',
  'openYearlyReview',
  'openPositionSizeCalculator',
]);

function isQuickLinkAction(value: unknown): value is QuickLinkAction {
  return typeof value === 'string' && QUICK_LINK_ACTIONS.has(value);
}

function cloneSessionLogTags(
  tags: SessionLogTagDefinition[]
): SessionLogTagDefinition[] {
  return tags.map((tag) => ({ ...tag }));
}

function getSessionLogTagsSetting(
  value: unknown,
  defaults: SessionLogTagDefinition[]
): SessionLogTagDefinition[] {
  if (!Array.isArray(value)) return cloneSessionLogTags(defaults);

  const tags: SessionLogTagDefinition[] = [];
  const seenIds = new Set<string>();
  for (const item of value) {
    if (!isRecord(item)) continue;
    const { id, label, shortLabel, color } = item;
    if (
      typeof id !== 'string' ||
      typeof label !== 'string' ||
      typeof shortLabel !== 'string' ||
      typeof color !== 'string'
    ) {
      continue;
    }

    const normalizedId = id.trim();
    if (!normalizedId || seenIds.has(normalizedId)) continue;
    const normalizedLabel = label.trim();
    const normalizedShortLabel = shortLabel.trim();
    const normalizedColor = color.trim();
    if (!normalizedLabel || !normalizedShortLabel || !normalizedColor) continue;

    seenIds.add(normalizedId);
    tags.push({
      id: normalizedId,
      label: normalizedLabel,
      shortLabel: normalizedShortLabel,
      color: normalizedColor,
      requiresResolution: item.requiresResolution === true,
      lessonTag: item.lessonTag === true,
    });
  }

  return tags.length > 0 ? tags : cloneSessionLogTags(defaults);
}

function getNavigationItemsSetting(value: unknown): SidebarNavItem[] {
  if (!Array.isArray(value)) return [];

  const items: SidebarNavItem[] = [];
  const seenIds = new Set<string>();
  for (const item of value) {
    if (!isRecord(item)) continue;
    if (
      typeof item.id !== 'string' ||
      typeof item.label !== 'string' ||
      typeof item.icon !== 'string' ||
      !isQuickLinkAction(item.action) ||
      (item.section !== 'overview' &&
        item.section !== 'reviews' &&
        item.section !== 'tools') ||
      typeof item.visible !== 'boolean' ||
      typeof item.order !== 'number'
    ) {
      continue;
    }

    const id = item.id.trim();
    if (!id || seenIds.has(id)) continue;
    seenIds.add(id);

    items.push({
      id,
      label: item.label,
      icon: item.icon,
      action: item.action,
      section: item.section,
      visible: item.visible,
      order: item.order,
    });
  }

  return items;
}

function getSessionModeWindows(value: unknown): SessionModeWindow[] | null {
  if (!Array.isArray(value)) return null;
  const windows: SessionModeWindow[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    if (
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.startTime !== 'string' ||
      typeof item.endTime !== 'string'
    ) {
      continue;
    }
    windows.push({
      id: item.id,
      name: item.name,
      startTime: item.startTime,
      endTime: item.endTime,
    });
  }
  return windows;
}

function getSessionModeLinkedResources(
  value: unknown
): SessionModeLinkedResource[] | null {
  if (!Array.isArray(value)) return null;
  const resources: SessionModeLinkedResource[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.path !== 'string') continue;
    resources.push({ path: item.path });
  }
  return resources;
}

function getSessionModePreparationLeadTimeMinutes(
  value: unknown,
  fallback: number
): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function getTradeGateWorkflows(value: unknown): TradeGateWorkflow[] | null {
  if (!Array.isArray(value)) return null;
  const workflows: TradeGateWorkflow[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.startNodeId !== 'string' ||
      !Array.isArray(item.nodes)
    ) {
      continue;
    }
    const parsedNodes: TradeGateNode[] = [];
    for (const node of item.nodes) {
      if (!isRecord(node) || typeof node.id !== 'string') continue;
      if (
        node.type === 'question' &&
        typeof node.title === 'string' &&
        typeof node.prompt === 'string' &&
        Array.isArray(node.options)
      ) {
        const options = [];
        for (const option of node.options) {
          if (
            !isRecord(option) ||
            typeof option.id !== 'string' ||
            typeof option.label !== 'string' ||
            typeof option.targetNodeId !== 'string'
          ) {
            continue;
          }
          options.push({
            id: option.id,
            label: option.label,
            targetNodeId: option.targetNodeId,
          });
        }
        parsedNodes.push({
          id: node.id,
          type: 'question',
          title: node.title,
          prompt: node.prompt,
          options,
        });
      }
      if (
        node.type === 'outcome' &&
        (node.outcome === 'green-light' ||
          node.outcome === 'no-trade' ||
          node.outcome === 'wait') &&
        typeof node.title === 'string'
      ) {
        parsedNodes.push({
          id: node.id,
          type: 'outcome',
          outcome: node.outcome,
          title: node.title,
          description:
            typeof node.description === 'string' ? node.description : undefined,
        });
      }
    }
    const nodeIds = new Set(parsedNodes.map((node) => node.id));
    const nodes = parsedNodes.map((node): TradeGateNode => {
      if (node.type !== 'question') return node;
      return {
        ...node,
        options: node.options.filter((option) =>
          nodeIds.has(option.targetNodeId)
        ),
      };
    });
    let startNodeId: string | undefined;
    let fallbackStartNodeId: string | undefined;
    for (const node of nodes) {
      if (node.type !== 'question' || node.options.length === 0) continue;
      if (!fallbackStartNodeId) fallbackStartNodeId = node.id;
      if (node.id === item.startNodeId) startNodeId = node.id;
    }
    startNodeId = startNodeId ?? fallbackStartNodeId;
    if (!startNodeId) continue;
    workflows.push({
      id: item.id,
      name: item.name,
      startNodeId,
      nodes,
    });
  }
  return workflows;
}

function getSessionModePhaseLayouts(
  value: unknown
): Partial<SessionModePhaseLayouts> | undefined {
  if (!isRecord(value)) return undefined;
  const layouts: Partial<SessionModePhaseLayouts> = {};
  for (const phase of ['preparation', 'live', 'ended'] as const) {
    const moduleIds = value[phase];
    if (!Array.isArray(moduleIds)) continue;
    layouts[phase] = moduleIds.filter(
      (moduleId): moduleId is SessionModePhaseLayouts[typeof phase][number] =>
        typeof moduleId === 'string'
    );
  }
  return layouts;
}

interface PluginWithSettings {
  app: App;
  manifest: PluginManifest;
  settings?: JournalitSettings;
  loadData(): Promise<unknown>;
  saveData(data: unknown): Promise<void>;
}

export class SettingsManager {
  private plugin: PluginWithSettings;
  private debouncedSave: (() => Promise<void>) & {
    cancel: () => void;
    flush: () => Promise<void | undefined>;
  };

  
  private saveMutex: Mutex = new Mutex();

  
  private lastKnownKeyCount: number = 0;

  
  private lastKnownKeys: Set<string> = new Set();

  constructor(plugin: PluginWithSettings) {
    this.plugin = plugin;

    
    this.debouncedSave = debounceAsync(
      () => this.saveSettingsInternal(),
      1000 
    );
  }

  
  async loadSettings(): Promise<JournalitSettings> {
    let data: unknown = null;
    let recoveredFromBackup = false;

    
    try {
      data = await this.plugin.loadData();
    } catch (error) {
      console.error('SettingsManager: Failed to load main settings:', error);
    }

    
    if (!this.isValidSettingsStructure(data)) {
      console.warn(
        'SettingsManager: Main settings invalid or corrupted, attempting backup recovery...'
      );

      const backupData = await this.tryLoadBackup();

      if (this.isValidSettingsStructure(backupData)) {
        data = backupData;
        recoveredFromBackup = true;
        logger.debug(
          'SettingsManager: Successfully recovered settings from backup'
        );

        
        
        try {
          await this.plugin.saveData(data);
          logger.debug('SettingsManager: Restored backup as main settings');
        } catch (error) {
          console.error(
            'SettingsManager: Failed to restore backup as main settings:',
            error
          );
        }
      } else {
        console.warn('SettingsManager: No valid backup found, using defaults');
      }
    }

    
    const settings = this.deepMergeSettings(
      DEFAULT_SETTINGS,
      this.isLoadableSettingsObject(data) ? data : {}
    );
    const migratedSettings = this.migrateLoadedSettings(settings, data ?? {});

    if (migratedSettings) {
      try {
        await this.plugin.saveData(settings);
      } catch (error) {
        console.error(
          'SettingsManager: Failed to persist migrated settings:',
          error
        );
      }
    }

    
    this.lastKnownKeyCount = Object.keys(settings).length;
    this.lastKnownKeys = new Set(Object.keys(settings));

    
    this.lastKnownKeyCount = Object.keys(settings).length;
    this.lastKnownKeys = new Set(Object.keys(settings));

    
    if (recoveredFromBackup) {
      
      this.plugin.app.workspace.onLayoutReady(() => {
        new Notice(t('notice.info.settings-recovered'), 10000);
      });
    }

    return settings;
  }

  private migrateLoadedSettings(
    settings: JournalitSettings,
    rawData: unknown
  ): boolean {
    let migrated = false;

    const rawRecord = isRecord(rawData) ? rawData : {};
    const rawTradeSettings = isRecord(rawRecord.trade) ? rawRecord.trade : {};
    const rawCutoffTime = rawTradeSettings.tradingDayCutoffTime;
    const cutoffMigrationVersion =
      rawTradeSettings.tradingDayCutoffEndOfDayMigrationVersion;

    if (
      rawCutoffTime === '00:00' &&
      cutoffMigrationVersion !== TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION
    ) {
      settings.trade.tradingDayCutoffTime = DEFAULT_TRADING_DAY_CUTOFF_TIME;
      settings.trade.tradingDayCutoffEndOfDayMigrationVersion =
        TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION;
      migrated = true;
    }

    return migrated;
  }

  
  private isValidSettingsStructure(
    data: unknown
  ): data is Partial<JournalitSettings> {
    
    if (!data || typeof data !== 'object') {
      return false;
    }

    
    const requiredKeys = ['general', 'trade'];
    const hasRequired = requiredKeys.every((k) => k in data);

    
    const hasReasonableKeys = Object.keys(data).length >= 5;

    return hasRequired && hasReasonableKeys;
  }

  private isLoadableSettingsObject(
    data: unknown
  ): data is Partial<JournalitSettings> {
    return Boolean(data && typeof data === 'object' && !Array.isArray(data));
  }

  
  async saveSettings(settings: JournalitSettings): Promise<void> {
    
    return this.saveMutex.withLock(async () => {
      try {
        
        this.logSettingsChanges(settings);

        
        const validationResult = this.validateSettingsBeforeSave(settings);
        if (!validationResult.isValid) {
          console.error(
            'SettingsManager: Settings validation failed, aborting save to prevent data loss'
          );
          console.error('Validation errors:', validationResult.errors);
          console.error('Settings keys present:', Object.keys(settings));
          
          throw new Error(
            `Settings validation failed: ${validationResult.errors.join(', ')}`
          );
        }

        
        if (validationResult.warnings.length > 0) {
          console.warn(
            'SettingsManager: Settings validation warnings:',
            validationResult.warnings
          );
        }

        
        if (!settings.weekly) {
          settings.weekly = DEFAULT_SETTINGS.weekly;
        }

        
        if (!settings.dashboard) {
          settings.dashboard = DEFAULT_SETTINGS.dashboard!;
        }

        
        if (
          !settings.dashboard.layouts ||
          Object.keys(settings.dashboard.layouts).length === 0
        ) {
          settings.dashboard.layouts = DEFAULT_SETTINGS.dashboard!.layouts;
        }

        
        if (!settings.dashboard.layouts['Default']) {
          settings.dashboard.layouts['Default'] =
            DEFAULT_SETTINGS.dashboard!.layouts['Default'];
        }

        
        if (
          !settings.dashboard.activeLayout ||
          !settings.dashboard.layouts[settings.dashboard.activeLayout]
        ) {
          settings.dashboard.activeLayout = 'Default';
        }

        
        if (!settings.backendIntegration) {
          settings.backendIntegration = DEFAULT_SETTINGS.backendIntegration!;
        }

        
        
        await this.createBackup();

        
        await this.plugin.saveData(settings);

        
        this.lastKnownKeyCount = Object.keys(settings).length;
        this.lastKnownKeys = new Set(Object.keys(settings));
      } catch (error) {
        console.error('SettingsManager: Failed to save settings', error);
        throw error;
      }
    });
  }

  
  async updateLocalMetaSection(key: string, value: unknown): Promise<void> {
    return this.saveMutex.withLock(async () => {
      const currentData: unknown = await this.plugin.loadData();
      const current = isRecord(currentData) ? currentData : {};
      const existingLocalMeta = isRecord(current.localMeta)
        ? current.localMeta
        : {};
      const localMeta = {
        ...existingLocalMeta,
        [key]: value,
      };

      await this.plugin.saveData({
        ...current,
        localMeta,
      });

      if (this.plugin.settings && typeof this.plugin.settings === 'object') {
        (
          this.plugin.settings as typeof this.plugin.settings & {
            localMeta?: Record<string, unknown>;
          }
        ).localMeta = localMeta;
      }
    });
  }

  
  getDebouncedSave(): (() => Promise<void>) & {
    cancel: () => void;
    flush: () => Promise<void | undefined>;
  } {
    return this.debouncedSave;
  }

  
  private async saveSettingsInternal(): Promise<void> {
    
    
    
    const settings = this.plugin.settings;
    if (settings) {
      await this.saveSettings(settings);
    }
  }

  
  private logSettingsChanges(settings: JournalitSettings): void {
    
    if (this.lastKnownKeys.size === 0) {
      return;
    }

    const currentKeys = new Set(Object.keys(settings));

    
    const removedKeys: string[] = [];
    for (const key of this.lastKnownKeys) {
      if (!currentKeys.has(key)) {
        removedKeys.push(key);
      }
    }

    
    const addedKeys: string[] = [];
    for (const key of currentKeys) {
      if (!this.lastKnownKeys.has(key)) {
        addedKeys.push(key);
      }
    }

    
    if (removedKeys.length > 0 || addedKeys.length > 0) {
      logger.debug('SettingsManager: Settings keys changed during save');

      if (addedKeys.length > 0) {
        logger.debug('  Added keys:', addedKeys);
      }

      if (removedKeys.length > 0) {
        
        console.warn('  REMOVED keys:', removedKeys);

        
        console.warn(
          '  Save triggered from:',
          new Error().stack?.split('\n').slice(2, 6).join('\n')
        );
      }

      logger.debug(
        `  Key count: ${this.lastKnownKeyCount} -> ${currentKeys.size}`
      );
    }

    
    const criticalNamespacedKeys = [
      'customOptions_options',
      'customTradeFields_options',
    ];
    for (const key of criticalNamespacedKeys) {
      const hadKey = this.lastKnownKeys.has(key);
      const hasKey = currentKeys.has(key);

      if (hadKey && !hasKey) {
        console.error(
          `SettingsManager: CRITICAL - Namespaced key "${key}" is being removed!`
        );
        console.error('  This likely indicates settings corruption.');
      }
    }
  }

  
  private validateSettingsBeforeSave(settings: JournalitSettings): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    
    if (!settings || typeof settings !== 'object') {
      errors.push('Settings object is null, undefined, or not an object');
      return { isValid: false, errors, warnings };
    }

    
    const criticalKeys = ['general', 'trade', 'account'];
    for (const key of criticalKeys) {
      if (!(key in settings)) {
        errors.push(`Critical settings key missing: ${key}`);
      }
    }

    
    const currentKeyCount = Object.keys(settings).length;
    if (
      this.lastKnownKeyCount > 0 &&
      currentKeyCount < this.lastKnownKeyCount - 3
    ) {
      
      
      errors.push(
        `Settings key count dropped significantly: ${this.lastKnownKeyCount} -> ${currentKeyCount}. ` +
          `This may indicate data corruption. Missing keys may include user custom options.`
      );
    }

    
    
    const hasLegacyCustomOptions =
      'customOptions' in settings &&
      settings.customOptions &&
      Object.keys(settings.customOptions).length > 0;
    const hasNamespacedCustomOptions =
      'customOptions_options' in settings &&
      settings.customOptions_options &&
      Object.keys(settings.customOptions_options).length > 0;

    if (!hasLegacyCustomOptions && !hasNamespacedCustomOptions) {
      
      if (this.lastKnownKeyCount > 15) {
        
        warnings.push(
          'No custom options found in settings - this may indicate data loss if you had custom tickers/setups'
        );
      }
    }

    
    if (settings.account) {
      if (typeof settings.account !== 'object') {
        errors.push('Account settings is not an object');
      }
    }

    
    if (settings.backendIntegration) {
      if (typeof settings.backendIntegration !== 'object') {
        errors.push('Backend integration settings is not an object');
      }
      
      if (!('syncEnabled' in settings.backendIntegration)) {
        warnings.push('Backend integration missing syncEnabled field');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  
  private getBackupPath(): string {
    return `${this.plugin.app.vault.configDir}/plugins/${this.plugin.manifest.id}/${BACKUP_FILENAME}`;
  }

  
  private async createBackup(): Promise<void> {
    try {
      const currentData: unknown = await this.plugin.loadData();
      const current = isRecord(currentData) ? currentData : null;

      
      if (current && Object.keys(current).length > 5) {
        const backupPath = this.getBackupPath();
        await this.plugin.app.vault.adapter.write(
          backupPath,
          JSON.stringify(current, null, 2)
        );
        logger.debug('SettingsManager: Backup created successfully');
      }
    } catch (error) {
      
      console.warn('SettingsManager: Failed to create settings backup:', error);
    }
  }

  
  private async tryLoadBackup(): Promise<unknown> {
    try {
      const backupPath = this.getBackupPath();
      const exists = await this.plugin.app.vault.adapter.exists(backupPath);

      if (!exists) {
        logger.debug('SettingsManager: No backup file found');
        return null;
      }

      const content = await this.plugin.app.vault.adapter.read(backupPath);
      const data: unknown = JSON.parse(content);
      logger.debug('SettingsManager: Backup loaded successfully');
      return data;
    } catch (error) {
      console.error('SettingsManager: Failed to load backup:', error);
      return null;
    }
  }

  
  private deepMergeSettings(
    defaults: JournalitSettings,
    saved: Partial<JournalitSettings> | null | undefined
  ): JournalitSettings {
    const merged = { ...defaults };

    
    if (!saved) return merged;

    
    if (saved.trade) {
      merged.trade = {
        ...defaults.trade,
        ...saved.trade,
      };

      
      if (merged.trade.skipWeekends === undefined) {
        merged.trade.skipWeekends = true;
      }

      merged.trade.tradeFormLayout = resolveTradeFormLayoutSettings(
        saved.trade.tradeFormLayout
      );
    }

    
    if (saved.drc) {
      merged.drc = {
        ...defaults.drc,
        ...saved.drc,

        
        checklistItems: saved.drc.checklistItems ?? defaults.drc.checklistItems,
        reviewQuestions:
          saved.drc.reviewQuestions ?? defaults.drc.reviewQuestions,
        recurringGoals: saved.drc.recurringGoals ?? defaults.drc.recurringGoals,
        sessionLogTags: getSessionLogTagsSetting(
          saved.drc.sessionLogTags,
          defaults.drc.sessionLogTags
        ),
        sessionLogAlertRule:
          saved.drc.sessionLogAlertRule ?? defaults.drc.sessionLogAlertRule,
      };
    }

    const sessionModeSource = saved.sessionMode;
    if (isRecord(sessionModeSource)) {
      const sessionModeRecord = sessionModeSource;
      merged.sessionMode = {
        ...defaults.sessionMode,
        ...sessionModeRecord,
        sessionWindows:
          getSessionModeWindows(sessionModeRecord.sessionWindows) ??
          defaults.sessionMode.sessionWindows,
        linkedResources:
          getSessionModeLinkedResources(sessionModeRecord.linkedResources) ??
          defaults.sessionMode.linkedResources,
        preparationLeadTimeMinutes: getSessionModePreparationLeadTimeMinutes(
          sessionModeRecord.preparationLeadTimeMinutes,
          defaults.sessionMode.preparationLeadTimeMinutes
        ),
        showTradeExecutionsInSessionLog:
          typeof sessionModeRecord.showTradeExecutionsInSessionLog === 'boolean'
            ? sessionModeRecord.showTradeExecutionsInSessionLog
            : defaults.sessionMode.showTradeExecutionsInSessionLog,
        tradeGateWorkflows:
          getTradeGateWorkflows(sessionModeRecord.tradeGateWorkflows) ??
          defaults.sessionMode.tradeGateWorkflows,
        phaseLayouts: normalizeSessionModePhaseLayouts(
          getSessionModePhaseLayouts(sessionModeRecord.phaseLayouts)
        ),
      };
    }

    
    if (saved.customOptions) {
      
      merged.customOptions = {
        ...defaults.customOptions,
        ...saved.customOptions,
      };
    }

    
    if (saved.initializedOptionTypes) {
      merged.initializedOptionTypes = saved.initializedOptionTypes;
    }

    if (saved.copyTradeAdjustments) {
      merged.copyTradeAdjustments = saved.copyTradeAdjustments;
    }

    
    if (saved.customTradeFields) {
      merged.customTradeFields = {
        ...defaults.customTradeFields,
        ...saved.customTradeFields,
      };
    }

    
    if (saved.customFieldOptions) {
      merged.customFieldOptions = {
        ...defaults.customFieldOptions,
        ...saved.customFieldOptions,
      };
    }

    
    if (saved.customReviewFields) {
      merged.customReviewFields = {
        ...defaults.customReviewFields,
        ...saved.customReviewFields,
      };
    }

    
    if (saved.customReviewFieldOptions) {
      merged.customReviewFieldOptions = {
        ...defaults.customReviewFieldOptions,
        ...saved.customReviewFieldOptions,
      };
    }

    
    if (saved.weekly) {
      merged.weekly = {
        ...defaults.weekly,
        ...saved.weekly,

        
        reviewQuestions:
          saved.weekly.reviewQuestions ?? defaults.weekly.reviewQuestions,
        recurringGoals:
          saved.weekly.recurringGoals ?? defaults.weekly.recurringGoals,
        checklistItems:
          saved.weekly.checklistItems ?? defaults.weekly.checklistItems,
      };
    }

    
    if (saved.dashboard) {
      
      merged.dashboard = {
        ...defaults.dashboard,

        
        layouts: {
          
          ...(defaults.dashboard?.layouts || {}),

          
          ...(saved.dashboard.layouts || {}),
        },

        
        activeLayout:
          saved.dashboard.activeLayout ||
          defaults.dashboard?.activeLayout ||
          'Default',

        
        weekdayPerformanceMetric:
          saved.dashboard.weekdayPerformanceMetric ||
          defaults.dashboard?.weekdayPerformanceMetric ||
          'net',

        
        defaultFilters: {
          ...(defaults.dashboard?.defaultFilters || {}),
          ...(saved.dashboard.defaultFilters || {}),
        },

        
        lastUsedFilters:
          saved.dashboard.lastUsedFilters ||
          defaults.dashboard?.lastUsedFilters,
      };

      
      if (
        merged.dashboard &&
        !merged.dashboard.layouts['Default'] &&
        defaults.dashboard?.layouts?.['Default']
      ) {
        merged.dashboard.layouts['Default'] =
          defaults.dashboard.layouts['Default'];
      }

      
      if (
        merged.dashboard &&
        merged.dashboard.activeLayout &&
        !merged.dashboard.layouts[merged.dashboard.activeLayout]
      ) {
        console.warn(
          'Active layout not found in saved layouts, resetting to Default'
        );
        merged.dashboard.activeLayout = 'Default';
      }
    }

    
    if (saved.account) {
      merged.account = {
        ...defaults.account,
        ...saved.account,
        
        excludedAccountTypes:
          saved.account.excludedAccountTypes ||
          defaults.account?.excludedAccountTypes,
        includeWithdrawalsFromExcluded:
          saved.account.includeWithdrawalsFromExcluded ||
          defaults.account?.includeWithdrawalsFromExcluded,
        accountMetadata:
          saved.account.accountMetadata ||
          defaults.account?.accountMetadata ||
          {},
      };
    }

    
    if (saved.backendIntegration) {
      merged.backendIntegration = {
        ...defaults.backendIntegration,
        ...saved.backendIntegration,
      };
    }

    
    if (saved.uiCustomization) {
      merged.uiCustomization = {
        ...defaults.uiCustomization,
        ...saved.uiCustomization,
      };
    }

    
    if (saved.reviews) {
      merged.reviews = {
        ...defaults.reviews,
        ...saved.reviews,
      };
    }

    
    if (saved.reviewV2) {
      merged.reviewV2 = {
        ...defaults.reviewV2,
        ...saved.reviewV2,
        
        customWidgetTypes:
          saved.reviewV2.customWidgetTypes ||
          defaults.reviewV2?.customWidgetTypes ||
          [],
        templates:
          saved.reviewV2.templates || defaults.reviewV2?.templates || [],
        tradeTemplates:
          saved.reviewV2.tradeTemplates ||
          defaults.reviewV2?.tradeTemplates ||
          [],
        scalperDefaults: {
          countMode:
            saved.reviewV2.scalperDefaults?.countMode ??
            defaults.reviewV2?.scalperDefaults?.countMode ??
            DEFAULT_SCALPER_DEFAULTS.countMode,
          sourceMode:
            saved.reviewV2.scalperDefaults?.sourceMode ??
            defaults.reviewV2?.scalperDefaults?.sourceMode ??
            DEFAULT_SCALPER_DEFAULTS.sourceMode,
          autoApplySessionMistakesToTrades:
            saved.reviewV2.scalperDefaults?.autoApplySessionMistakesToTrades ??
            defaults.reviewV2?.scalperDefaults
              ?.autoApplySessionMistakesToTrades ??
            DEFAULT_SCALPER_DEFAULTS.autoApplySessionMistakesToTrades,
        },
      };
    }

    
    if (saved.templates) {
      merged.templates = {
        ...defaults.templates,
        ...saved.templates,
      };
    }

    
    merged.display = {
      ...DEFAULT_SETTINGS.display!,
      ...defaults.display,
      ...saved.display,
    };

    
    merged.general = {
      currency: saved.general?.currency ?? defaults.general!.currency,
      displayName: saved.general?.displayName ?? defaults.general!.displayName,
      homeStartupBehavior:
        saved.general?.homeStartupBehavior ??
        defaults.general!.homeStartupBehavior,
      onboardingCompleted:
        saved.general?.onboardingCompleted ??
        defaults.general!.onboardingCompleted,
      journalFolderPath:
        saved.general?.journalFolderPath ?? defaults.general!.journalFolderPath,
    };

    
    if (saved.home) {
      const hasSavedQuickLinks = Array.isArray(saved.home.quickLinks);
      const savedQuickLinks = hasSavedQuickLinks ? saved.home.quickLinks! : [];
      const defaultQuickLinks = defaults.home?.quickLinks || [];
      const defaultQuickLinksById = new Map(
        defaultQuickLinks.map((quickLink) => [quickLink.id, quickLink])
      );
      const mergedQuickLinks = savedQuickLinks.map((quickLink) => {
        if (quickLink.id !== 'quick-import') {
          return quickLink;
        }

        const defaultQuickImport = defaultQuickLinksById.get('quick-import');
        return {
          ...quickLink,
          icon: defaultQuickImport?.icon ?? quickLink.icon,
          color: defaultQuickImport?.color ?? quickLink.color,
        };
      });
      const existingQuickLinkIds = new Set(
        savedQuickLinks.map((quickLink) => quickLink.id)
      );

      for (const defaultQuickLink of defaultQuickLinks) {
        if (existingQuickLinkIds.has(defaultQuickLink.id)) {
          continue;
        }

        mergedQuickLinks.push({
          ...defaultQuickLink,
          visible: hasSavedQuickLinks ? false : defaultQuickLink.visible,
          order: hasSavedQuickLinks
            ? mergedQuickLinks.length
            : defaultQuickLink.order,
        });
      }

      merged.home = {
        ...defaults.home,
        ...saved.home,
        layouts: {
          ...(defaults.home?.layouts || {}),
          ...(saved.home.layouts || {}),
        },
        recentItems: saved.home.recentItems || defaults.home?.recentItems || [],
        quickLinks: mergedQuickLinks,
      };
    }

    
    if (saved.navigation) {
      const savedNavigationItems = getNavigationItemsSetting(
        (saved.navigation as { items?: unknown }).items
      );
      const mergedNavigationItems = [...savedNavigationItems];
      const existingNavigationItemIds = new Set(
        savedNavigationItems.map((item) => item.id)
      );

      for (const defaultNavigationItem of defaults.navigation?.items || []) {
        if (existingNavigationItemIds.has(defaultNavigationItem.id)) {
          continue;
        }

        mergedNavigationItems.push({
          ...defaultNavigationItem,
          order: mergedNavigationItems.length,
        });
      }

      merged.navigation = {
        ...defaults.navigation,
        ...saved.navigation,
        items: mergedNavigationItems,
      };
    }

    
    if (saved.csvTemplates) {
      merged.csvTemplates = saved.csvTemplates;
    } else if (defaults.csvTemplates) {
      merged.csvTemplates = defaults.csvTemplates;
    }

    
    merged.csvHiddenBrokers =
      saved.csvHiddenBrokers ?? defaults.csvHiddenBrokers ?? [];
    merged.csvFavoriteBroker =
      saved.csvFavoriteBroker ?? defaults.csvFavoriteBroker;
    merged.csvFavoriteAccount =
      saved.csvFavoriteAccount ?? defaults.csvFavoriteAccount;
    merged.csvFavoriteTemplateId =
      saved.csvFavoriteTemplateId ?? defaults.csvFavoriteTemplateId;
    merged.csvLastAssetType = {
      ...(defaults.csvLastAssetType || {}),
      ...(saved.csvLastAssetType || {}),
    };

    
    if (saved.tradeLog) {
      merged.tradeLog = {
        ...defaults.tradeLog,
        ...saved.tradeLog,
      };
    }

    
    if (saved.viewFilters) {
      merged.viewFilters = {
        dashboard:
          saved.viewFilters.dashboard || defaults.viewFilters?.dashboard,
        tradelog: saved.viewFilters.tradelog || defaults.viewFilters?.tradelog,
        reviews: saved.viewFilters.reviews || defaults.viewFilters?.reviews,
      };
    }

    
    if (saved.symbolMappings) {
      merged.symbolMappings = saved.symbolMappings;
    } else if (defaults.symbolMappings) {
      merged.symbolMappings = defaults.symbolMappings;
    }

    
    
    
    for (const key in saved) {
      if (
        Object.prototype.hasOwnProperty.call(saved, key) &&
        !(key in merged)
      ) {
        merged[key] = saved[key];
      }
    }

    return merged;
  }
}
