import { logger } from '../utils/logger';
import { normalizePersonalProfiles } from '../services/propChallenge/PersonalPropFirmProfiles';


import { App, Notice, PluginManifest } from 'obsidian';
import {
  JournalitSettings,
  DEFAULT_SETTINGS,
  DEFAULT_ECONOMIC_CALENDAR_SETTINGS,
  ECONOMIC_CALENDAR_IMPACTS,
  type EconomicCalendarImpact,
  type EconomicCalendarSettings,
  resolveTradeFormLayoutSettings,
  QUICK_LINK_ACTIONS,
  QuickLinkAction,
  SidebarNavItem,
  type EntityShortcut,
} from './types';
import { isEconomicCalendarCurrency } from '../services/economicCalendar/economicCalendarScope';
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
  TradeGateOutcomeType,
  TradeGateQuestion,
  TradeGateQuestionOption,
  TradeGateRoute,
  TradeGateRouteTarget,
  SessionModeWindow,
  TradeGateWorkflow,
} from '../types/sessionMode';
import { getDefaultOutcomeDescription } from '../components/sessionMode/tradeGateUtils';
import { normalizeSessionModePhaseLayouts } from '../utils/sessionModeLayout';
import {
  normalizePropChallengeConfig,
  normalizePropFirmIndexCache,
  normalizePropFirmProfileCatalogCache,
} from '../services/propChallenge/normalization';
import { normalizeChallengeStageAccountTypes } from '../services/propChallenge/stageAccountTypes';
import { normalizeGalleryFolders } from './settingsNormalization';
import { normalizeHomeBackgroundImagePath } from '../components/home/homeBackgroundUtils';
import { normalizeHomeWidgetOpacity } from './homeWidgetOpacity';
import { migrateLegacyMetaTraderBrokerSettings } from '../services/tradeImport/brokerIds';
import { migrateSettingsSchema } from './settingsSchema';
import type { LocalCSVTemplate } from '../services/csv/types';
import type {
  PerformanceBreakdownMetric,
  PerformanceBreakdownViewMode,
} from './types';
import {
  composeSampleSettings,
  createDefaultSampleSettings,
  createSampleSettingsDocument,
  extractJournalScopedSettings,
  mergeRealGlobalSettings,
  parseSampleSettingsDocument,
  type JournalSettingsContext,
  type SampleSettingsDocument,
} from '../demo/DemoSettingsScope';
import {
  ensureDemoStateDirectory,
  getDemoStateDirectoryPath,
} from '../demo/DemoManifest';


const BACKUP_FILENAME = 'data.backup.json';
const SAMPLE_SETTINGS_FILENAME = 'settings.json';



function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeEconomicCalendarSettings(
  value: unknown
): EconomicCalendarSettings {
  const record = isRecord(value) ? value : {};
  const currencies: string[] = [];
  const seenCurrencies = new Set<string>();
  if (Array.isArray(record.defaultCurrencies)) {
    for (const item of record.defaultCurrencies) {
      if (
        typeof item === 'string' &&
        isEconomicCalendarCurrency(item) &&
        !seenCurrencies.has(item)
      ) {
        seenCurrencies.add(item);
        currencies.push(item);
      }
    }
  }

  const impacts: EconomicCalendarImpact[] = [];
  if (Array.isArray(record.impacts)) {
    const savedImpacts = new Set<unknown>(record.impacts);
    for (const impact of ECONOMIC_CALENDAR_IMPACTS) {
      if (savedImpacts.has(impact)) {
        impacts.push(impact);
      }
    }
  } else {
    impacts.push(...DEFAULT_ECONOMIC_CALENDAR_SETTINGS.impacts);
  }

  return {
    defaultCurrencies: currencies,
    impacts,
    
    
    includeHolidays: record.includeHolidays !== false,
    autoImport: record.autoImport === true,
  };
}

function normalizePerformanceBreakdownMetric(
  value: unknown,
  fallback: PerformanceBreakdownMetric
): PerformanceBreakdownMetric {
  return value === 'net' || value === 'winRate' ? value : fallback;
}

function normalizePerformanceBreakdownViewMode(
  value: unknown,
  fallback: PerformanceBreakdownViewMode
): PerformanceBreakdownViewMode {
  return value === 'bestAndWorst' || value === 'best' || value === 'worst'
    ? value
    : fallback;
}

function isCSVTemplateAssetType(
  value: unknown
): value is LocalCSVTemplate['asset_type'] {
  return (
    value === 'stock' ||
    value === 'options' ||
    value === 'futures' ||
    value === 'forex' ||
    value === 'crypto'
  );
}

function isCSVColumnMappings(
  value: unknown
): value is LocalCSVTemplate['column_mappings'] {
  if (!isRecord(value)) return false;
  return Object.values(value).every(
    (mapping) =>
      typeof mapping === 'string' ||
      (Array.isArray(mapping) &&
        mapping.every((column) => typeof column === 'string'))
  );
}

function getLocalCSVTemplatesSetting(value: unknown): LocalCSVTemplate[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.broker_type !== 'string' ||
      !isCSVColumnMappings(item.column_mappings) ||
      typeof item.has_headers !== 'boolean' ||
      typeof item.created_at !== 'string' ||
      typeof item.usage_count !== 'number' ||
      !Number.isFinite(item.usage_count)
    ) {
      return [];
    }

    const mappingVersion =
      item.mapping_version === 1 || item.mapping_version === 2
        ? item.mapping_version
        : undefined;
    const manualMode =
      item.manual_mode === 'price_based' || item.manual_mode === 'direct_pnl'
        ? item.manual_mode
        : undefined;
    const headerRowIndex =
      Number.isInteger(item.header_row_index) &&
      Number(item.header_row_index) >= 1
        ? Number(item.header_row_index)
        : undefined;

    return [
      {
        id: item.id,
        name: item.name,
        broker_type: item.broker_type,
        asset_type: isCSVTemplateAssetType(item.asset_type)
          ? item.asset_type
          : 'stock',
        column_mappings: item.column_mappings,
        mapping_version: mappingVersion,
        manual_mode: manualMode,
        date_format:
          typeof item.date_format === 'string' ? item.date_format : undefined,
        header_row_index: headerRowIndex,
        delimiter:
          typeof item.delimiter === 'string' ? item.delimiter : undefined,
        has_headers: item.has_headers,
        created_at: item.created_at,
        last_used:
          typeof item.last_used === 'string' ? item.last_used : undefined,
        usage_count: item.usage_count,
      },
    ];
  });
}

function normalizeLoadedTradeImportSettings(
  settings: JournalitSettings,
  rawRecord: Record<string, unknown>
): boolean {
  let changed = false;

  const rawFavoriteBroker = rawRecord.csvFavoriteBroker;
  if (
    rawFavoriteBroker !== undefined &&
    typeof rawFavoriteBroker !== 'string'
  ) {
    settings.csvFavoriteBroker = DEFAULT_SETTINGS.csvFavoriteBroker;
    changed = true;
  }

  const rawHiddenBrokers = rawRecord.csvHiddenBrokers;
  if (rawHiddenBrokers !== undefined) {
    const hiddenBrokers = Array.isArray(rawHiddenBrokers)
      ? rawHiddenBrokers.filter(
          (broker): broker is string => typeof broker === 'string'
        )
      : [...(DEFAULT_SETTINGS.csvHiddenBrokers ?? [])];
    if (JSON.stringify(hiddenBrokers) !== JSON.stringify(rawHiddenBrokers)) {
      settings.csvHiddenBrokers = hiddenBrokers;
      changed = true;
    }
  }

  const rawLastAssetType = rawRecord.csvLastAssetType;
  if (rawLastAssetType !== undefined) {
    const lastAssetType: Record<string, string> = {};
    if (isRecord(rawLastAssetType)) {
      for (const [broker, assetType] of Object.entries(rawLastAssetType)) {
        if (typeof assetType === 'string') {
          lastAssetType[broker] = assetType;
        }
      }
    }
    if (JSON.stringify(lastAssetType) !== JSON.stringify(rawLastAssetType)) {
      settings.csvLastAssetType = lastAssetType;
      changed = true;
    }
  }

  const rawTemplates = rawRecord.csvTemplates;
  if (rawTemplates !== undefined) {
    const templates = getLocalCSVTemplatesSetting(rawTemplates);
    settings.csvTemplates = templates;
    if (JSON.stringify(templates) !== JSON.stringify(rawTemplates)) {
      changed = true;
    }
  }

  return changed;
}

const QUICK_LINK_ACTION_SET = new Set<string>(QUICK_LINK_ACTIONS);

function isQuickLinkAction(value: unknown): value is QuickLinkAction {
  return typeof value === 'string' && QUICK_LINK_ACTION_SET.has(value);
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

function getEntityShortcutsSetting(value: unknown): EntityShortcut[] {
  if (!Array.isArray(value)) return [];

  const shortcuts: EntityShortcut[] = [];
  const seenIds = new Set<string>();
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.order !== 'number' ||
      !isRecord(item.target)
    ) {
      continue;
    }

    const id = item.id.trim();
    if (!id || seenIds.has(id)) continue;

    if (
      item.target.kind === 'account' &&
      typeof item.target.accountName === 'string'
    ) {
      const accountName = item.target.accountName.trim();
      if (!accountName) continue;
      seenIds.add(id);
      shortcuts.push({
        id,
        target: { kind: 'account', accountName },
        order: item.order,
      });
      continue;
    }

    if (
      item.target.kind === 'setup' &&
      typeof item.target.setupId === 'string'
    ) {
      const setupId = item.target.setupId.trim();
      if (!setupId) continue;
      seenIds.add(id);
      shortcuts.push({
        id,
        target: { kind: 'setup', setupId },
        order: item.order,
      });
    }
  }

  return shortcuts;
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

function isTradeGateOutcomeType(value: unknown): value is TradeGateOutcomeType {
  return value === 'green-light' || value === 'no-trade' || value === 'wait';
}

function getTradeGateQuestions(value: unknown): TradeGateQuestion[] | null {
  if (!Array.isArray(value)) return null;

  const questions: TradeGateQuestion[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.title !== 'string' ||
      typeof item.prompt !== 'string' ||
      !Array.isArray(item.options)
    ) {
      continue;
    }

    const options: TradeGateQuestionOption[] = [];
    for (const option of item.options) {
      if (
        !isRecord(option) ||
        typeof option.id !== 'string' ||
        typeof option.label !== 'string'
      ) {
        continue;
      }
      options.push({ id: option.id, label: option.label });
    }

    questions.push({
      id: item.id,
      title: item.title,
      prompt: item.prompt,
      options,
    });
  }
  return questions;
}

function getTradeGateOutcomeTarget(
  rawTarget: Record<string, unknown>
): Extract<TradeGateRouteTarget, { kind: 'outcome' }> | null {
  if (!isTradeGateOutcomeType(rawTarget.outcome)) return null;
  const target: Extract<TradeGateRouteTarget, { kind: 'outcome' }> = {
    kind: 'outcome',
    outcome: rawTarget.outcome,
  };
  if (typeof rawTarget.note === 'string') {
    target.note = rawTarget.note;
  }
  return target;
}


function getTradeGateWorkflows(
  value: unknown,
  questions: TradeGateQuestion[]
): TradeGateWorkflow[] | null {
  if (!Array.isArray(value)) return null;

  const questionsById = new Map<string, TradeGateQuestion>();
  for (const question of questions) {
    if (!questionsById.has(question.id)) {
      questionsById.set(question.id, question);
    }
  }

  const workflows: TradeGateWorkflow[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      !Array.isArray(item.routes)
    ) {
      continue;
    }

    let rawNodes: Array<{ id: string; questionId: string }>;
    let rawStartNodeId: string;
    let routesKeyedByQuestion: boolean;
    if (Array.isArray(item.nodes)) {
      rawNodes = [];
      for (const node of item.nodes) {
        if (
          isRecord(node) &&
          typeof node.id === 'string' &&
          typeof node.questionId === 'string'
        ) {
          rawNodes.push({ id: node.id, questionId: node.questionId });
        }
      }
      rawStartNodeId =
        typeof item.startNodeId === 'string' ? item.startNodeId : '';
      routesKeyedByQuestion = false;
    } else if (Array.isArray(item.questionIds)) {
      rawNodes = [];
      for (const questionId of item.questionIds) {
        if (typeof questionId === 'string') {
          rawNodes.push({ id: questionId, questionId });
        }
      }
      rawStartNodeId =
        typeof item.startQuestionId === 'string' ? item.startQuestionId : '';
      routesKeyedByQuestion = true;
    } else {
      continue;
    }

    const nodes: TradeGateWorkflow['nodes'] = [];
    const nodeIds = new Set<string>();
    for (const node of rawNodes) {
      if (nodeIds.has(node.id) || !questionsById.has(node.questionId)) {
        continue;
      }
      nodes.push({ id: node.id, questionId: node.questionId });
      nodeIds.add(node.id);
    }
    const nodesById = new Map(nodes.map((node) => [node.id, node]));

    const startNodeId = nodeIds.has(rawStartNodeId) ? rawStartNodeId : '';

    const routes: TradeGateRoute[] = [];
    for (const route of item.routes) {
      if (!isRecord(route) || typeof route.optionId !== 'string') {
        continue;
      }
      const sourceKey = routesKeyedByQuestion ? route.questionId : route.nodeId;
      if (typeof sourceKey !== 'string') continue;

      const sourceNode = nodesById.get(sourceKey);
      const sourceQuestion = sourceNode
        ? questionsById.get(sourceNode.questionId)
        : undefined;
      if (
        !sourceNode ||
        !sourceQuestion ||
        !sourceQuestion.options.some((option) => option.id === route.optionId)
      ) {
        continue;
      }

      const rawTarget = route.target;
      if (!isRecord(rawTarget) || typeof rawTarget.kind !== 'string') {
        continue;
      }

      let target: TradeGateRouteTarget;
      if (rawTarget.kind === 'node' || rawTarget.kind === 'question') {
        const targetNodeId =
          rawTarget.kind === 'node' ? rawTarget.nodeId : rawTarget.questionId;
        if (typeof targetNodeId !== 'string' || !nodeIds.has(targetNodeId)) {
          continue;
        }
        target = { kind: 'node', nodeId: targetNodeId };
      } else if (rawTarget.kind === 'outcome') {
        const outcomeTarget = getTradeGateOutcomeTarget(rawTarget);
        if (!outcomeTarget) continue;
        target = outcomeTarget;
      } else {
        continue;
      }

      routes.push({
        nodeId: sourceNode.id,
        optionId: route.optionId,
        target,
      });
    }

    workflows.push({
      id: item.id,
      name: item.name,
      startNodeId,
      nodes,
      routes,
    });
  }
  return workflows;
}

interface LegacyTradeGateQuestionNode {
  id: string;
  title: string;
  prompt: string;
  options: Array<{
    id: string;
    label: string;
    targetNodeId?: string;
  }>;
}

interface LegacyTradeGateOutcomeNode {
  id: string;
  outcome: TradeGateOutcomeType;
  description?: string;
}

type LegacyTradeGateNode =
  | { kind: 'question'; node: LegacyTradeGateQuestionNode }
  | { kind: 'outcome'; node: LegacyTradeGateOutcomeNode };

interface MigratedTradeGateSettings {
  questions: TradeGateQuestion[];
  workflows: TradeGateWorkflow[];
}

function migrateLegacyTradeGateWorkflows(
  value: unknown
): MigratedTradeGateSettings | null {
  if (!Array.isArray(value)) return null;

  
  
  
  
  
  
  const isLegacyWorkflow = (item: unknown): item is Record<string, unknown> =>
    isRecord(item) &&
    Array.isArray(item.nodes) &&
    item.nodes.some((node) => isRecord(node) && typeof node.type === 'string');

  const hasLegacyWorkflow = value.some(isLegacyWorkflow);
  if (!hasLegacyWorkflow) return null;

  const questions: TradeGateQuestion[] = [];
  const workflows: TradeGateWorkflow[] = [];

  for (const item of value) {
    if (
      !isLegacyWorkflow(item) ||
      !Array.isArray(item.nodes) ||
      typeof item.id !== 'string' ||
      typeof item.name !== 'string'
    ) {
      continue;
    }

    const nodesById = new Map<string, LegacyTradeGateNode>();
    const questionNodes: LegacyTradeGateQuestionNode[] = [];

    for (const rawNode of item.nodes) {
      if (
        !isRecord(rawNode) ||
        typeof rawNode.id !== 'string' ||
        typeof rawNode.type !== 'string'
      ) {
        continue;
      }

      if (
        rawNode.type === 'question' &&
        typeof rawNode.title === 'string' &&
        typeof rawNode.prompt === 'string' &&
        Array.isArray(rawNode.options)
      ) {
        const node: LegacyTradeGateQuestionNode = {
          id: rawNode.id,
          title: rawNode.title,
          prompt: rawNode.prompt,
          options: [],
        };
        for (const rawOption of rawNode.options) {
          if (
            !isRecord(rawOption) ||
            typeof rawOption.id !== 'string' ||
            typeof rawOption.label !== 'string'
          ) {
            continue;
          }
          node.options.push({
            id: rawOption.id,
            label: rawOption.label,
            ...(typeof rawOption.targetNodeId === 'string'
              ? { targetNodeId: rawOption.targetNodeId }
              : {}),
          });
        }
        questionNodes.push(node);
        if (!nodesById.has(node.id)) {
          nodesById.set(node.id, { kind: 'question', node });
        }
        continue;
      }

      if (
        rawNode.type === 'outcome' &&
        isTradeGateOutcomeType(rawNode.outcome) &&
        typeof rawNode.title === 'string'
      ) {
        const node: LegacyTradeGateOutcomeNode = {
          id: rawNode.id,
          outcome: rawNode.outcome,
          ...(typeof rawNode.description === 'string'
            ? { description: rawNode.description }
            : {}),
        };
        if (!nodesById.has(node.id)) {
          nodesById.set(node.id, { kind: 'outcome', node });
        }
      }
    }

    
    
    const workflowNodes: TradeGateWorkflow['nodes'] = [];
    const nodeIds = new Set<string>();
    for (const question of questionNodes) {
      questions.push({
        id: question.id,
        title: question.title,
        prompt: question.prompt,
        options: question.options.map(({ id, label }) => ({ id, label })),
      });
      if (!nodeIds.has(question.id)) {
        workflowNodes.push({ id: question.id, questionId: question.id });
        nodeIds.add(question.id);
      }
    }

    const routes: TradeGateRoute[] = [];
    for (const question of questionNodes) {
      for (const option of question.options) {
        if (!option.targetNodeId) continue;
        const targetNode = nodesById.get(option.targetNodeId);
        if (!targetNode) continue;

        let target: TradeGateRouteTarget;
        if (targetNode.kind === 'question') {
          if (!nodeIds.has(targetNode.node.id)) continue;
          target = {
            kind: 'node',
            nodeId: targetNode.node.id,
          };
        } else {
          const { outcome, description } = targetNode.node;
          target = { kind: 'outcome', outcome };
          if (
            description !== undefined &&
            description !== getDefaultOutcomeDescription(outcome)
          ) {
            target = { ...target, note: description };
          }
        }

        routes.push({
          nodeId: question.id,
          optionId: option.id,
          target,
        });
      }
    }

    const startNodeId =
      typeof item.startNodeId === 'string' && nodeIds.has(item.startNodeId)
        ? item.startNodeId
        : '';

    workflows.push({
      id: item.id,
      name: item.name,
      startNodeId,
      nodes: workflowNodes,
      routes,
    });
  }

  return { questions, workflows };
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

  private activeContext: JournalSettingsContext = 'real';
  private realSettings: JournalitSettings | null = null;
  private sampleDocument: SampleSettingsDocument | null = null;
  private lastPersistedRealSettingsJson = '';

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
    this.realSettings = settings;
    this.lastPersistedRealSettingsJson = JSON.stringify(settings);

    
    if (recoveredFromBackup) {
      
      this.plugin.app.workspace.onLayoutReady(() => {
        new Notice(t('notice.info.settings-recovered'), 10000);
      });
    }

    return settings;
  }

  getActiveContext(): JournalSettingsContext {
    return this.activeContext;
  }

  isSampleContextActive(): boolean {
    return this.activeContext === 'sample';
  }

  getRealSettings(): JournalitSettings {
    if (!this.realSettings) {
      throw new Error('Real settings are not loaded');
    }
    return this.realSettings;
  }

  getSampleSettingsPath(): string {
    return `${this.getSampleSettingsDirectoryPath()}/${SAMPLE_SETTINGS_FILENAME}`;
  }

  getSampleLocalMetaSection(key: string): unknown {
    return this.sampleDocument?.localMeta[key];
  }

  async activateSampleContext(
    seedSettings?: Partial<JournalitSettings>,
    options: { preferPersisted?: boolean } = {}
  ): Promise<JournalitSettings> {
    const realSettings = this.getRealSettings();
    const persisted = options.preferPersisted
      ? await this.loadSampleSettingsDocument()
      : seedSettings
        ? createSampleSettingsDocument(seedSettings)
        : await this.loadSampleSettingsDocument();
    await this.flushPendingWrites();
    this.sampleDocument =
      persisted ??
      createSampleSettingsDocument(
        seedSettings ?? createDefaultSampleSettings()
      );
    this.activeContext = 'sample';

    const composed = composeSampleSettings(
      realSettings,
      this.sampleDocument.settings
    );
    this.plugin.settings = composed;
    this.lastKnownKeyCount = Object.keys(composed).length;
    this.lastKnownKeys = new Set(Object.keys(composed));
    await this.saveSampleSettingsDocument();
    return composed;
  }

  async activateRealContext(): Promise<JournalitSettings> {
    await this.flushPendingWrites();
    const realSettings = this.getRealSettings();
    this.activeContext = 'real';
    this.plugin.settings = realSettings;
    this.lastKnownKeyCount = Object.keys(realSettings).length;
    this.lastKnownKeys = new Set(Object.keys(realSettings));
    return realSettings;
  }

  private async flushPendingWrites(): Promise<void> {
    await this.debouncedSave.flush();
    await this.saveMutex.withLock(async () => undefined);
  }

  async removeSampleSettings(): Promise<void> {
    const path = this.getSampleSettingsPath();
    if (await this.plugin.app.vault.adapter.exists(path)) {
      await this.plugin.app.vault.adapter.remove(path);
    }
    this.sampleDocument = null;
  }

  private migrateLoadedSettings(
    settings: JournalitSettings,
    rawData: unknown
  ): boolean {
    let migrated = migrateSettingsSchema(settings, rawData, { mode: 'load' });

    const rawRecord = isRecord(rawData) ? rawData : {};
    const rawSessionMode = isRecord(rawRecord.sessionMode)
      ? rawRecord.sessionMode
      : {};
    const migratedTradeGateSettings = migrateLegacyTradeGateWorkflows(
      rawSessionMode.tradeGateWorkflows
    );
    if (migratedTradeGateSettings) {
      settings.sessionMode.tradeGateQuestions =
        migratedTradeGateSettings.questions;
      settings.sessionMode.tradeGateWorkflows =
        migratedTradeGateSettings.workflows;
      migrated = true;
    }

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

    if (normalizeLoadedTradeImportSettings(settings, rawRecord)) {
      migrated = true;
    }

    if (migrateLegacyMetaTraderBrokerSettings(settings)) {
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

        if (this.activeContext === 'sample') {
          await this.saveSampleContextSettings(settings);
          return;
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
        this.realSettings = settings;
        this.lastPersistedRealSettingsJson = JSON.stringify(settings);

        
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
      if (this.activeContext === 'sample') {
        const document =
          this.sampleDocument ??
          createSampleSettingsDocument(createDefaultSampleSettings());
        document.localMeta[key] = value;
        this.sampleDocument = document;
        await this.saveSampleSettingsDocument();
        return;
      }

      await this.writeRealLocalMetaSection(key, value);
    });
  }

  
  async updateRealLocalMetaSection(key: string, value: unknown): Promise<void> {
    return this.saveMutex.withLock(() =>
      this.writeRealLocalMetaSection(key, value)
    );
  }

  private async writeRealLocalMetaSection(
    key: string,
    value: unknown
  ): Promise<void> {
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

    
    
    
    const mirrors = new Set<object>();
    if (this.realSettings) mirrors.add(this.realSettings);
    if (this.plugin.settings && typeof this.plugin.settings === 'object') {
      mirrors.add(this.plugin.settings);
    }
    for (const target of mirrors) {
      (target as { localMeta?: Record<string, unknown> }).localMeta = localMeta;
    }
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

  private getSampleSettingsDirectoryPath(): string {
    return getDemoStateDirectoryPath(this.plugin);
  }

  private async ensureSampleSettingsDirectory(): Promise<void> {
    await ensureDemoStateDirectory(this.plugin);
  }

  private async loadSampleSettingsDocument(): Promise<SampleSettingsDocument | null> {
    try {
      const path = this.getSampleSettingsPath();
      if (!(await this.plugin.app.vault.adapter.exists(path))) {
        return null;
      }
      const content = await this.plugin.app.vault.adapter.read(path);
      const parseJson: (text: string) => unknown = JSON.parse;
      return parseSampleSettingsDocument(parseJson(content));
    } catch (error) {
      console.error(
        'SettingsManager: Failed to load sample settings, using defaults:',
        error
      );
      return null;
    }
  }

  private async saveSampleSettingsDocument(): Promise<void> {
    const document =
      this.sampleDocument ??
      createSampleSettingsDocument(createDefaultSampleSettings());
    await this.ensureSampleSettingsDirectory();
    await this.plugin.app.vault.adapter.write(
      this.getSampleSettingsPath(),
      JSON.stringify(document, null, 2)
    );
  }

  private async saveSampleContextSettings(
    activeSettings: JournalitSettings
  ): Promise<void> {
    const nextRealSettings = mergeRealGlobalSettings(
      this.getRealSettings(),
      activeSettings
    );
    this.realSettings = nextRealSettings;
    this.sampleDocument = createSampleSettingsDocument(
      extractJournalScopedSettings(activeSettings),
      this.sampleDocument?.localMeta ?? {}
    );

    const realSettingsJson = JSON.stringify(nextRealSettings);
    if (realSettingsJson !== this.lastPersistedRealSettingsJson) {
      const realValidation = this.validateSettingsBeforeSave(nextRealSettings);
      if (!realValidation.isValid) {
        throw new Error(
          `Real settings validation failed: ${realValidation.errors.join(', ')}`
        );
      }
      await this.createBackup();
      await this.plugin.saveData(nextRealSettings);
      this.lastPersistedRealSettingsJson = realSettingsJson;
    }

    await this.saveSampleSettingsDocument();
    const composed = composeSampleSettings(
      nextRealSettings,
      this.sampleDocument.settings
    );
    this.plugin.settings = composed;
    this.lastKnownKeyCount = Object.keys(composed).length;
    this.lastKnownKeys = new Set(Object.keys(composed));
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

    
    
    
    const existingInstall = Object.keys(saved).length > 0;

    if (saved.personalPropFirmProfiles !== undefined) {
      try {
        merged.personalPropFirmProfiles = normalizePersonalProfiles(
          saved.personalPropFirmProfiles
        );
      } catch (error) {
        
        
        
        
        
        
        console.warn(
          'SettingsManager: quarantining invalid personal prop-firm profile library',
          error
        );
        merged.personalPropFirmProfilesQuarantine =
          saved.personalPropFirmProfiles;
        merged.personalPropFirmProfiles = [];
      }
    }

    
    if (saved.trade) {
      merged.trade = {
        ...defaults.trade,
        ...saved.trade,
        galleryFolders: normalizeGalleryFolders(saved.trade.galleryFolders),
      };

      
      if (merged.trade.skipWeekends === undefined) {
        merged.trade.skipWeekends = true;
      }

      merged.trade.tradeFormLayout = resolveTradeFormLayoutSettings(
        saved.trade.tradeFormLayout,
        { existingInstall }
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
      const tradeGateQuestions =
        getTradeGateQuestions(sessionModeRecord.tradeGateQuestions) ??
        defaults.sessionMode.tradeGateQuestions;
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
        tradeGateQuestions,
        tradeGateWorkflows:
          getTradeGateWorkflows(
            sessionModeRecord.tradeGateWorkflows,
            tradeGateQuestions
          ) ?? defaults.sessionMode.tradeGateWorkflows,
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
        tickerPerformanceMetric:
          saved.dashboard.tickerPerformanceMetric ||
          defaults.dashboard?.tickerPerformanceMetric ||
          'net',
        tickerPerformanceViewMode:
          saved.dashboard.tickerPerformanceViewMode ||
          defaults.dashboard?.tickerPerformanceViewMode ||
          'bestAndWorst',
        setupPerformanceMetric: normalizePerformanceBreakdownMetric(
          saved.dashboard.setupPerformanceMetric,
          defaults.dashboard?.setupPerformanceMetric || 'net'
        ),
        setupPerformanceViewMode: normalizePerformanceBreakdownViewMode(
          saved.dashboard.setupPerformanceViewMode,
          defaults.dashboard?.setupPerformanceViewMode || 'bestAndWorst'
        ),
        tagPerformanceMetric: normalizePerformanceBreakdownMetric(
          saved.dashboard.tagPerformanceMetric,
          defaults.dashboard?.tagPerformanceMetric || 'net'
        ),
        tagPerformanceViewMode: normalizePerformanceBreakdownViewMode(
          saved.dashboard.tagPerformanceViewMode,
          defaults.dashboard?.tagPerformanceViewMode || 'bestAndWorst'
        ),

        
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
      const accountMetadata: NonNullable<
        JournalitSettings['account']
      >['accountMetadata'] = {};
      if (isRecord(saved.account.accountMetadata)) {
        for (const [accountName, rawMetadata] of Object.entries(
          saved.account.accountMetadata
        )) {
          if (!isRecord(rawMetadata)) continue;
          const metadata = { ...rawMetadata };
          const propChallenge = normalizePropChallengeConfig(
            rawMetadata.propChallenge
          );
          if (propChallenge) {
            metadata.propChallenge = propChallenge;
          } else {
            delete metadata.propChallenge;
            
            
            
            
            if (rawMetadata.propChallenge !== undefined) {
              metadata.propChallengeQuarantine = rawMetadata.propChallenge;
            }
          }
          accountMetadata[accountName] = metadata;
        }
      }
      merged.account = {
        ...defaults.account,
        ...saved.account,
        
        excludedAccountTypes:
          saved.account.excludedAccountTypes ||
          defaults.account?.excludedAccountTypes,
        includeWithdrawalsFromExcluded:
          saved.account.includeWithdrawalsFromExcluded ||
          defaults.account?.includeWithdrawalsFromExcluded,
        accountMetadata,
        challengeStageAccountTypes: normalizeChallengeStageAccountTypes(
          saved.account.challengeStageAccountTypes ??
            defaults.account?.challengeStageAccountTypes
        ),
      };
    }

    
    if (saved.backendIntegration) {
      merged.backendIntegration = {
        ...defaults.backendIntegration,
        ...saved.backendIntegration,
      };
      const catalogCache = normalizePropFirmProfileCatalogCache(
        saved.backendIntegration.propFirmProfileCatalogCache
      );
      if (catalogCache) {
        merged.backendIntegration.propFirmProfileCatalogCache = catalogCache;
      } else {
        delete merged.backendIntegration.propFirmProfileCatalogCache;
      }
      const firmIndexCache = normalizePropFirmIndexCache(
        saved.backendIntegration.propFirmIndexCache
      );
      if (firmIndexCache) {
        merged.backendIntegration.propFirmIndexCache = firmIndexCache;
      } else {
        delete merged.backendIntegration.propFirmIndexCache;
      }
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
        widgetOpacityLight: normalizeHomeWidgetOpacity(
          saved.home.widgetOpacityLight
        ),
        widgetOpacityDark: normalizeHomeWidgetOpacity(
          saved.home.widgetOpacityDark
        ),
        backgroundImagePath: normalizeHomeBackgroundImagePath(
          saved.home.backgroundImagePath,
          defaults.home?.backgroundImagePath || undefined
        ),
        showBackgroundInDashboard:
          typeof saved.home.showBackgroundInDashboard === 'boolean'
            ? saved.home.showBackgroundInDashboard
            : (defaults.home?.showBackgroundInDashboard ?? false),
        layouts: {
          ...(defaults.home?.layouts || {}),
          ...(saved.home.layouts || {}),
        },
        recentItems: saved.home.recentItems || defaults.home?.recentItems || [],
        quickLinks: mergedQuickLinks,
        entityShortcuts: getEntityShortcutsSetting(saved.home.entityShortcuts),
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
        tabBehavior:
          saved.navigation.tabBehavior ?? defaults.navigation!.tabBehavior,
        items: mergedNavigationItems,
        entityShortcuts: getEntityShortcutsSetting(
          saved.navigation.entityShortcuts
        ),
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

    merged.economicCalendar = normalizeEconomicCalendarSettings(
      saved.economicCalendar ?? defaults.economicCalendar
    );

    
    
    
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
