import { logger } from '../../utils/logger';


import { App, TFile, parseYaml } from 'obsidian';
import {
  forceMetadataCacheRefresh,
  waitForMetadataReparse,
} from '../../utils/dataRefresh';
import { isMetadataCacheCurrent } from '../base/metadataCacheReadiness';
import {
  isOpenInEditor,
  readFileContentForMutation,
} from '../../utils/fileMutation';

import {
  normalizedEquals,
  deduplicateOptions,
  normalizeOptionKey,
} from '../../utils/stringNormalization';
import { TAG_BUCKETS, formatTagForYAML } from '../../utils/tagSchema';
import {
  normalizeTradeSelectionForWrite,
  readTradeSelectionEntry,
  type TradeSelectionField,
} from '../../utils/tradeTagNormalization';
import { isSyntheticSetupTagFilterValue } from '../../utils/setupTagFilter';
import {
  ensureTradeIdentityFrontmatter,
  getTradeIdentityFields,
  isTradeIdentityEligibleNote,
} from '../../utils/tradeIdentity';
import { eventBus } from '../events/EventBus';
import { OptionsChangedPayload } from '../events/types';
import {
  isJournalitJournalPath,
  isSetupDefinitionNote,
  isTagOptionTradeEligibleNote,
  resolveJournalFolderPath,
} from '../../utils/tagOptionNoteEligibility';
import {
  selectionOptionKey,
  storedTagDedupeKey,
  storedTagValuesMatch,
} from '../../utils/tradeTagNormalization';
import { LabelColor, normalizeLabelColor } from '../../types/labelColor';
import {
  normalizeChallengeStageAccountTypes,
  removeAccountTypeFromStageMapping,
  replaceAccountTypeInStageMapping,
} from '../propChallenge/stageAccountTypes';
import {
  OptionCatalogMutationError,
  type OwnedOptionFields,
} from '../agent/configuration/optionCatalogMutation';
import type { NoteRewritePlan } from '../agent/configuration/noteRewritePlan';
import {
  isEventRewriteChange,
  isMistakeRewriteChange,
  isTagRewriteChange,
} from '../agent/configuration/noteRewritePlan';
import {
  installNoteRewriteNotes,
  type NoteRewriteNoteInstall,
} from './noteRewriteWriter';
import {
  withSetupOptionWriter,
  type SetupOptionWriter,
  type SetupOptionMutationResult,
} from './setupOptionWriter';
import { SetupInUseError } from '../setup/setupDeletionErrors';
import {
  galleryAnnotationNotePath,
  resolveGalleryAnnotationNotePath,
} from '../imageGallery/ImageGalleryAnnotationStore';
import {
  isReviewNoteType,
  REVIEW_TYPE_TO_SOURCE,
  type ReviewSourceType,
} from '../imageGallery/ImageGalleryInternal';
import { rewriteImageAnnotationTags } from '../../utils/imageAnnotations';
import {
  DAY_TRADE_FIELDS_KEY,
  applyDayTradeFieldOptionWrites,
  planDayTradeFieldOptionRewrite,
  type DayTradeFieldOptionRewrite,
  type DayTradeFieldRetainedValues,
  type DayTradeSelectionField,
} from '../drc/dayTradeFields';
import { DAY_TRADE_FIELD_SOURCES_KEY } from '../trade/core/TradeJournalFields';

interface PluginWithSettings {
  app: App;
  
  
  
  settings?: unknown;
  loadData(): Promise<unknown>;
  saveData(data: unknown): Promise<void>;
  saveSettings?: () => Promise<void>;
  serviceManager?: {
    getFolderPathService(): {
      isJournalPath(path: string): boolean;
      getPath(...segments: string[]): string;
    };
  };
}

export type AgentOptionsPersistenceCommand =
  | {
      kind: 'settings_only';
      ownedFields: OwnedOptionFields;
      prepareVerification?(): Promise<void>;
      verifyCurrent(
        rawOptions: unknown,
        rawAccountSettings: unknown
      ): Promise<void>;
    }
  | {
      kind: 'note_rewrite';
      ownedFields:
        | Extract<OwnedOptionFields, { catalog: 'tags' }>
        | Extract<OwnedOptionFields, { catalog: 'mistakes' }>
        | Extract<OwnedOptionFields, { catalog: 'events' }>;
      plan: NoteRewritePlan;
      verifyCurrent(
        rawOptions: unknown,
        rawAccountSettings: unknown
      ): Promise<void>;
    };

const AGENT_OPTIONS_INTERNAL_ERROR =
  'Agent option settings persistence is temporarily unavailable';

type SetupOptionMutation =
  | {
      kind: 'rename';
      oldValue: string;
      newValue: string;
      updateNotes: boolean;
    }
  | { kind: 'delete'; oldValue: string; expectNone: boolean };

interface OptionNoteSnapshot {
  file: TFile;
  
  reviewNote?: boolean;
  guardedKeys: readonly string[];
  frontmatterBefore?: Record<string, unknown>;
  frontmatterAfter?: Record<string, unknown>;
  mutationApplied: boolean;
}

type OptionNoteTransaction = Map<string, OptionNoteSnapshot>;
type PeriodicReviewSourceType = Exclude<ReviewSourceType, 'drc'>;

const SETUP_REFERENCE_IDENTITY_FIELDS = [
  'tradeId',
  'schemaVersion',
  'type',
  'isMissedTrade',
  'isBacktestTrade',
] as const;
function cloneOptionFrontmatter(
  frontmatter: Record<string, unknown>,
  keys?: readonly string[]
): Record<string, unknown> {
  let source = frontmatter;
  if (keys) {
    source = {};
    for (const key of keys) {
      if (optionFrontmatterHasKey(frontmatter, key))
        source[key] = frontmatter[key];
    }
  }
  const cloned: unknown = structuredClone(source);
  const clone = asRecord(cloned);
  if (!clone) {
    throw new Error('Failed to clone option frontmatter');
  }
  for (const [key, value] of Object.entries(clone)) {
    if (value === undefined) delete clone[key];
  }
  return clone;
}

function optionFrontmatterValuesEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function optionFrontmatterHasKey(
  frontmatter: Record<string, unknown>,
  key: string
): boolean {
  return Object.keys(frontmatter).includes(key);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function snapshotAgentRewriteCatalog(
  rawOptions: unknown,
  ownedFields: Extract<
    OwnedOptionFields,
    { catalog: 'tags' | 'mistakes' | 'events' }
  >
): unknown {
  const options = asRecord(rawOptions) ?? {};
  const field = (key: string): unknown =>
    Object.prototype.hasOwnProperty.call(options, key)
      ? { present: true, value: structuredClone(options[key]) }
      : { present: false };
  switch (ownedFields.catalog) {
    case 'tags':
      return { tag: field(OptionType.TAG), tagColors: field('tagColors') };
    case 'mistakes':
      return { mistake: field(OptionType.MISTAKE) };
    case 'events':
      return { event: field(OptionType.EVENT) };
  }
}

function normalizeNumberProperty(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function normalizeFuturesData(
  value: unknown
): FuturesInstrumentData | undefined {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }

  return {
    dollarPerPoint: normalizeNumberProperty(record.dollarPerPoint),
    tickSize: normalizeNumberProperty(record.tickSize),
    tickValue: normalizeNumberProperty(record.tickValue),
  };
}

function normalizeForexData(value: unknown): ForexInstrumentData | undefined {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }

  return {
    lotSize: normalizeNumberProperty(record.lotSize),
    pipValue: normalizeNumberProperty(record.pipValue),
    pipSize: normalizeNumberProperty(record.pipSize),
  };
}

function normalizeCfdData(value: unknown): CfdInstrumentData | undefined {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }

  return {
    contractSize: normalizeNumberProperty(record.contractSize),
  };
}

function normalizeCommissionRule(
  value: unknown
): InstrumentCommissionRule | undefined {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }

  const method = record.method;
  if (method !== 'perSide' && method !== 'roundTrip') {
    return undefined;
  }

  return {
    account: typeof record.account === 'string' ? record.account : undefined,
    method,
    entryCommission: normalizeNumberProperty(record.entryCommission),
    exitCommission: normalizeNumberProperty(record.exitCommission),
    roundTripCommission: normalizeNumberProperty(record.roundTripCommission),
  };
}

function normalizeCommissionRules(
  value: unknown
): InstrumentCommissionRule[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const rules = value.flatMap((rule) => {
    const normalized = normalizeCommissionRule(rule);
    return normalized ? [normalized] : [];
  });
  return rules.length > 0 ? rules : undefined;
}

function stringOptionValues(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function normalizeStringOptions(value: unknown): string[] {
  return deduplicateOptions(stringOptionValues(value));
}

function normalizeTagColors(
  value: unknown,
  tagOptions: string[]
): Record<string, LabelColor> {
  const record = asRecord(value);
  if (!record) return {};

  const colors: Record<string, LabelColor> = {};
  const tagsByKey = new Map(
    tagOptions.map((tag) => [normalizeOptionKey(tag), tag] as const)
  );
  for (const [storedKey, storedColor] of Object.entries(record)) {
    const tag = tagsByKey.get(normalizeOptionKey(storedKey));
    if (!tag) continue;

    const color = normalizeLabelColor(storedColor);
    if (color) {
      colors[tag] = color;
    }
  }
  return colors;
}

function normalizeInstrumentOptions(value: unknown): InstrumentData[] {
  if (!Array.isArray(value)) {
    return [];
  }

  if (typeof value[0] === 'string') {
    return value.flatMap((name) =>
      typeof name === 'string' ? [{ name, assetType: 'stock' }] : []
    );
  }

  return value.flatMap((item) => {
    const record = asRecord(item);
    if (!record) return [];
    const name = record.name;
    if (typeof name !== 'string') {
      return [];
    }

    return [
      {
        name,
        assetType:
          typeof record.assetType === 'string' ? record.assetType : 'stock',
        currency:
          typeof record.currency === 'string' ? record.currency : undefined,
        commissionRules: normalizeCommissionRules(record.commissionRules),
        futuresData: normalizeFuturesData(record.futuresData),
        forexData: normalizeForexData(record.forexData),
        cfdData: normalizeCfdData(record.cfdData),
      },
    ];
  });
}


export enum OptionType {
  INSTRUMENT = 'instrument',
  ACCOUNT = 'account',
  ACCOUNT_TYPE = 'account_type',
  SETUP = 'setup',
  MISTAKE = 'mistake',
  TAG = 'tag',
  EVENT = 'event',
}


export type StoredOptionType = Exclude<OptionType, OptionType.SETUP>;

const STORED_OPTION_TYPES: readonly StoredOptionType[] = [
  OptionType.INSTRUMENT,
  OptionType.ACCOUNT,
  OptionType.ACCOUNT_TYPE,
  OptionType.MISTAKE,
  OptionType.TAG,
  OptionType.EVENT,
];


const LEGACY_SETUP_OPTIONS_KEY = 'setup';


const LEGACY_SEEDED_SETUP_NAMES = ['Breakout Setup', 'Reversal Pattern'];


function getSelectionOptionField(type: OptionType): TradeSelectionField | null {
  if (type === OptionType.SETUP) return 'setup';
  if (type === OptionType.MISTAKE) return 'mistake';
  return null;
}

function normalizeOptionList(type: OptionType, values: string[]): string[] {
  const field = getSelectionOptionField(type);
  return field
    ? normalizeTradeSelectionForWrite(values, field)
    : deduplicateOptions(values);
}

function optionValuesEqual(type: OptionType, a: string, b: string): boolean {
  const field = getSelectionOptionField(type);
  if (!field) return normalizedEquals(a, b);
  return selectionOptionKey(a, field) === selectionOptionKey(b, field);
}


export interface FuturesInstrumentData {
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
}

export type InstrumentCommissionRuleMethod = 'perSide' | 'roundTrip';

export interface InstrumentCommissionRule {
  account?: string;
  method: InstrumentCommissionRuleMethod;
  entryCommission?: number;
  exitCommission?: number;
  roundTripCommission?: number;
}


export interface ForexInstrumentData {
  lotSize?: number;
  pipValue?: number;
  pipSize?: number;
}


export interface CfdInstrumentData {
  contractSize?: number;
}


export interface InstrumentData {
  name: string;
  assetType: string;
  currency?: string;
  commissionRules?: InstrumentCommissionRule[];
  futuresData?: FuturesInstrumentData;
  forexData?: ForexInstrumentData;
  cfdData?: CfdInstrumentData;
}


export interface EventOptionData {
  name: string;
  color: string;
  notes?: string;
}

export interface CustomOptionsData {
  [OptionType.INSTRUMENT]: InstrumentData[];
  [OptionType.ACCOUNT]: string[];
  [OptionType.ACCOUNT_TYPE]: string[];
  [OptionType.MISTAKE]: string[];
  [OptionType.TAG]: string[];
  [OptionType.EVENT]: EventOptionData[];
  tagColors: Record<string, LabelColor>;
}

function cloneInstrumentOption(option: InstrumentData): InstrumentData {
  return {
    ...option,
    commissionRules: option.commissionRules?.map((rule) => ({ ...rule })),
    futuresData: option.futuresData ? { ...option.futuresData } : undefined,
    forexData: option.forexData ? { ...option.forexData } : undefined,
    cfdData: option.cfdData ? { ...option.cfdData } : undefined,
  };
}

function cloneEventOption(option: EventOptionData): EventOptionData {
  return { ...option };
}


export const DEFAULT_OPTIONS_DATA: CustomOptionsData = {
  [OptionType.INSTRUMENT]: [],
  [OptionType.ACCOUNT]: [],
  [OptionType.ACCOUNT_TYPE]: [],
  [OptionType.MISTAKE]: [],
  [OptionType.TAG]: [],
  [OptionType.EVENT]: [], 
  tagColors: {},
};


const INITIAL_DEFAULT_OPTIONS: CustomOptionsData = {
  [OptionType.INSTRUMENT]: [
    { name: 'AAPL', assetType: 'stock' },
    { name: 'MSFT', assetType: 'stock' },
    { name: 'TSLA', assetType: 'stock' },
    {
      name: 'ES1',
      assetType: 'futures',
      futuresData: {
        dollarPerPoint: 50,
        tickSize: 0.25,
        tickValue: 12.5,
      },
    },
    {
      name: 'NQ1',
      assetType: 'futures',
      futuresData: {
        dollarPerPoint: 20,
        tickSize: 0.25,
        tickValue: 5,
      },
    },
    {
      name: 'MNQ',
      assetType: 'futures',
      futuresData: {
        dollarPerPoint: 2,
        tickSize: 0.25,
        tickValue: 0.5,
      },
    },
    {
      name: 'MES',
      assetType: 'futures',
      futuresData: {
        dollarPerPoint: 5,
        tickSize: 0.25,
        tickValue: 1.25,
      },
    },
    { name: 'EURUSD', assetType: 'forex' },
  ],
  [OptionType.ACCOUNT]: [],
  [OptionType.ACCOUNT_TYPE]: ['Demo', 'Evaluation', 'Funded', 'Archived'],
  [OptionType.MISTAKE]: ['Early Entry', 'Poor Position Sizing'],
  [OptionType.TAG]: [
    'Swing Trade',
    'Day Trade',
    'Momentum',
    'Reversal',
    'Earnings',
  ],
  [OptionType.EVENT]: [
    { name: 'FOMC Meeting', color: 'gray' },
    { name: 'Earnings Announcement', color: 'gray' },
    { name: 'Economic Data Release', color: 'gray' },
    { name: 'Fed Speech', color: 'gray' },
    { name: 'Market Holiday', color: 'gray' },
  ],
  tagColors: {},
};


interface CustomOptionsServiceConfig {
  
  namespace?: string;
}

export type PreviousTagAssignments =
  | readonly string[]
  | (() => Promise<readonly string[]>);


export class CustomOptionsService {
  private optionMutationTail: Promise<void> = Promise.resolve();
  private readonly tagRetirementVersions = new Map<string, number>();
  private readonly mistakeRetirementVersions = new Map<string, number>();
  private readonly eventRetirementVersions = new Map<string, number>();

  private enqueueOptionMutation<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.optionMutationTail.then(operation, operation);
    this.optionMutationTail = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  public runWithTagAssignments<T>(
    tags: readonly string[],
    operation: () => Promise<T>,
    previousTags: PreviousTagAssignments = []
  ): Promise<T> {
    return this.runTagAssignmentOperation(tags, operation, previousTags, false);
  }

  public runWithSetupTagAssignments<T>(
    tags: readonly string[],
    operation: (writer: SetupOptionWriter) => Promise<T>,
    previousTags: PreviousTagAssignments = []
  ): Promise<T> {
    return this.runTagAssignmentOperation(
      tags,
      () =>
        withSetupOptionWriter(
          {
            rename: (oldName, newName, updateNotes) =>
              this.mutateSetupReferences({
                kind: 'rename',
                oldValue: oldName,
                newValue: newName.trim(),
                updateNotes,
              }),
            remove: (name, options) =>
              this.mutateSetupReferences({
                kind: 'delete',
                oldValue: name,
                expectNone: options?.expectNone ?? false,
              }),
          },
          operation
        ),
      previousTags,
      true
    );
  }

  private runTagAssignmentOperation<T>(
    tags: readonly string[],
    operation: () => Promise<T>,
    previousTags: PreviousTagAssignments,
    queueEmptyAssignment: boolean
  ): Promise<T> {
    const requestedTags = deduplicateOptions(
      tags.flatMap((tag) => {
        const cleanTag = tag.trim();
        return cleanTag ? [cleanTag] : [];
      })
    );
    if (requestedTags.length === 0 && !queueEmptyAssignment) return operation();

    const staticPreviousTags =
      typeof previousTags === 'function' ? undefined : previousTags;
    const staticPreviousTagKeys = staticPreviousTags
      ? new Set(staticPreviousTags.map((tag) => normalizeOptionKey(tag)))
      : undefined;
    const staticRetirementVersions = new Map<string, number>();
    if (staticPreviousTagKeys) {
      for (const tag of requestedTags) {
        const key = normalizeOptionKey(tag);
        if (staticPreviousTagKeys.has(key)) {
          staticRetirementVersions.set(
            key,
            this.tagRetirementVersions.get(key) ?? 0
          );
        }
      }
    }

    return this.enqueueOptionMutation(async () => {
      if (requestedTags.length === 0) return operation();
      const resolvedPreviousTags =
        typeof previousTags === 'function'
          ? await previousTags()
          : previousTags;
      const normalizedPreviousTags = new Set(
        resolvedPreviousTags.map((tag) => normalizeOptionKey(tag))
      );
      const introducedTags = requestedTags.filter(
        (tag) => !normalizedPreviousTags.has(normalizeOptionKey(tag))
      );
      const unavailableTags = introducedTags.filter(
        (tag) =>
          !this.options[OptionType.TAG].some((option) =>
            normalizedEquals(option, tag)
          )
      );
      const retiredWhileWaiting = staticPreviousTagKeys
        ? requestedTags.filter((tag) => {
            const key = normalizeOptionKey(tag);
            const versionAtRequest = staticRetirementVersions.get(key);
            return (
              versionAtRequest !== undefined &&
              (this.tagRetirementVersions.get(key) ?? 0) !== versionAtRequest
            );
          })
        : [];
      const rejectedTags = deduplicateOptions([
        ...unavailableTags,
        ...retiredWhileWaiting,
      ]);
      if (rejectedTags.length > 0) {
        throw new Error(
          `Cannot assign unavailable tags: ${rejectedTags.join(', ')}`
        );
      }
      return operation();
    });
  }

  private recordTagRetirement(tag: string): void {
    const key = normalizeOptionKey(tag);
    this.tagRetirementVersions.set(
      key,
      (this.tagRetirementVersions.get(key) ?? 0) + 1
    );
  }

  private recordMistakeRetirement(value: string): void {
    const key = normalizeOptionKey(value);
    this.mistakeRetirementVersions.set(
      key,
      (this.mistakeRetirementVersions.get(key) ?? 0) + 1
    );
  }

  private mistakeRetirementKey(value: string): string | undefined {
    const cleaned = value.trim();
    if (!cleaned) return undefined;
    return normalizeOptionKey(cleaned);
  }

  private mistakeVersionChangedWhileWaiting(
    key: string,
    versionAtRequest: number
  ): boolean {
    return (this.mistakeRetirementVersions.get(key) ?? 0) !== versionAtRequest;
  }

  private recordEventRetirement(name: string): void {
    const key = this.eventRetirementKey(name);
    if (key === undefined) return;
    this.eventRetirementVersions.set(
      key,
      (this.eventRetirementVersions.get(key) ?? 0) + 1
    );
  }

  private eventRetirementKey(name: string): string | undefined {
    const cleaned = name.trim();
    if (!cleaned) return undefined;
    return cleaned.toLowerCase();
  }

  private eventVersionChangedWhileWaiting(
    key: string,
    versionAtRequest: number
  ): boolean {
    return (this.eventRetirementVersions.get(key) ?? 0) !== versionAtRequest;
  }

  private recordRewriteRetirement(plan: NoteRewritePlan): void {
    if (isTagRewriteChange(plan.change)) {
      this.recordTagRetirement(
        plan.change.kind === 'delete_tag'
          ? plan.change.value
          : plan.change.source_value
      );
      return;
    }
    if (isMistakeRewriteChange(plan.change)) {
      this.recordMistakeRetirement(
        plan.change.kind === 'delete_mistake'
          ? plan.change.value
          : plan.change.source_value
      );
      return;
    }
    if (isEventRewriteChange(plan.change)) {
      this.recordEventRetirement(
        plan.change.kind === 'delete_event'
          ? plan.change.name
          : plan.change.source_name
      );
      return;
    }
    const exhaustive: never = plan.change;
    return exhaustive;
  }

  private appendAccountTypeToDashboardOrder(accountType: string): void {
    const accountSettings = asRecord(asRecord(this.plugin.settings)?.account);

    if (!accountSettings) {
      return;
    }

    const normalizedAccountType = accountType.toLowerCase();
    const currentOrder = normalizeStringOptions(
      accountSettings.accountTypeOrder
    );

    if (
      currentOrder.some((type) => type.toLowerCase() === normalizedAccountType)
    ) {
      return;
    }

    const archivedIndex = currentOrder.findIndex(
      (type) => type.toLowerCase() === 'archived'
    );

    accountSettings.accountTypeOrder =
      archivedIndex === -1
        ? [...currentOrder, normalizedAccountType]
        : [
            ...currentOrder.slice(0, archivedIndex),
            normalizedAccountType,
            ...currentOrder.slice(archivedIndex),
          ];
  }

  private replaceAccountTypeInDashboardOrder(
    oldAccountType: string,
    newAccountType: string
  ): void {
    const accountSettings = asRecord(asRecord(this.plugin.settings)?.account);

    if (!accountSettings) {
      return;
    }

    const accountTypeOrder = normalizeStringOptions(
      accountSettings.accountTypeOrder
    );

    if (accountTypeOrder.length === 0) {
      return;
    }

    const normalizedOldType = oldAccountType.toLowerCase();
    const normalizedNewType = newAccountType.toLowerCase();
    let replaced = false;

    accountSettings.accountTypeOrder = accountTypeOrder.map((type) => {
      if (type.toLowerCase() !== normalizedOldType) {
        return type;
      }

      replaced = true;
      return normalizedNewType;
    });

    if (!replaced) {
      this.appendAccountTypeToDashboardOrder(newAccountType);
    }
  }

  private removeAccountTypeFromDashboardOrder(accountType: string): void {
    const accountSettings = asRecord(asRecord(this.plugin.settings)?.account);

    if (!accountSettings) {
      return;
    }

    const accountTypeOrder = normalizeStringOptions(
      accountSettings.accountTypeOrder
    );

    if (accountTypeOrder.length === 0) {
      return;
    }

    const normalizedAccountType = accountType.toLowerCase();
    accountSettings.accountTypeOrder = accountTypeOrder.filter(
      (type) => type.toLowerCase() !== normalizedAccountType
    );
  }

  private removeAccountTypeFromChallengeStageMapping(
    accountType: string
  ): void {
    const accountSettings = asRecord(asRecord(this.plugin.settings)?.account);

    if (!accountSettings) {
      return;
    }

    accountSettings.challengeStageAccountTypes =
      removeAccountTypeFromStageMapping(
        normalizeChallengeStageAccountTypes(
          accountSettings.challengeStageAccountTypes
        ),
        accountType
      );
  }

  private replaceAccountTypeInChallengeStageMapping(
    oldAccountType: string,
    newAccountType: string
  ): void {
    const accountSettings = asRecord(asRecord(this.plugin.settings)?.account);

    if (!accountSettings) {
      return;
    }

    accountSettings.challengeStageAccountTypes =
      replaceAccountTypeInStageMapping(
        normalizeChallengeStageAccountTypes(
          accountSettings.challengeStageAccountTypes
        ),
        oldAccountType,
        newAccountType
      );
  }

  private normalizeEventOptions(rawOptions: unknown): EventOptionData[] {
    if (!Array.isArray(rawOptions)) {
      return [];
    }

    return rawOptions.flatMap((eventOption) => {
      if (typeof eventOption === 'string') {
        return [{ name: eventOption, color: 'gray' }];
      }

      const eventOptionRecord = asRecord(eventOption);
      if (eventOptionRecord && typeof eventOptionRecord.name === 'string') {
        const notes =
          typeof eventOptionRecord.notes === 'string'
            ? eventOptionRecord.notes
            : undefined;

        return [
          {
            name: eventOptionRecord.name,
            color:
              typeof eventOptionRecord.color === 'string'
                ? eventOptionRecord.color
                : 'gray',
            notes,
          },
        ];
      }

      return [];
    });
  }

  private plugin: PluginWithSettings;
  private options: CustomOptionsData = {
    ...DEFAULT_OPTIONS_DATA,
    tagColors: {},
  };
  private namespace: string = '';
  
  private legacySetupNames: string[] | null = null;
  private readonly initialLoad: Promise<void>;

  
  constructor(plugin: PluginWithSettings, config?: CustomOptionsServiceConfig) {
    this.plugin = plugin;

    
    if (config?.namespace) {
      this.namespace = config.namespace;
    }

    
    
    this.initialLoad = this.enqueueOptionMutation(async () => {
      await this.loadOptions();
      await this.initializeDefaultOptionsIfNeeded();
    });

    
    this.cleanupCorruptedOptions().catch((error) => {
      console.error(
        'CustomOptionsService: Failed to cleanup corrupted options:',
        error
      );
    });
  }

  
  private getOptionsKey(): string {
    return this.namespace ? `customOptions_${this.namespace}` : 'customOptions';
  }

  private getPersistedOptions(): CustomOptionsData & {
    [LEGACY_SETUP_OPTIONS_KEY]?: string[];
  } {
    return {
      ...this.options,
      tagColors: { ...this.options.tagColors },
      
      ...(this.legacySetupNames
        ? { [LEGACY_SETUP_OPTIONS_KEY]: [...this.legacySetupNames] }
        : {}),
    };
  }

  
  public async migrateLegacySetupOptions(
    createSetupNotes: (names: string[]) => Promise<boolean>
  ): Promise<void> {
    await this.initialLoad;
    const legacyNames = this.legacySetupNames;
    if (legacyNames === null) return;

    const namespace = this.namespace;
    const seededKeys = new Set(
      LEGACY_SEEDED_SETUP_NAMES.map((name) => name.toLowerCase())
    );
    const migrated = await createSetupNotes(
      legacyNames.filter((name) => !seededKeys.has(name.toLowerCase()))
    );
    if (!migrated) return;

    await this.enqueueOptionMutation(async () => {
      if (this.namespace !== namespace || this.legacySetupNames === null) {
        return;
      }
      this.legacySetupNames = null;
      await this.saveOptions(true);
    });
  }

  private applyLoadedOptions(rawOptions: unknown): void {
    const loadedOptions = asRecord(rawOptions);
    if (!loadedOptions) {
      return;
    }

    this.options[OptionType.INSTRUMENT] = normalizeInstrumentOptions(
      loadedOptions[OptionType.INSTRUMENT]
    ).map((instrument) => ({
      ...instrument,
      currency: this.normalizeInstrumentCurrency(instrument.currency),
    }));
    this.options[OptionType.ACCOUNT] = normalizeStringOptions(
      loadedOptions[OptionType.ACCOUNT]
    );
    this.options[OptionType.ACCOUNT_TYPE] = normalizeStringOptions(
      loadedOptions[OptionType.ACCOUNT_TYPE]
    );
    this.legacySetupNames =
      LEGACY_SETUP_OPTIONS_KEY in loadedOptions
        ? normalizeOptionList(
            OptionType.SETUP,
            stringOptionValues(loadedOptions[LEGACY_SETUP_OPTIONS_KEY])
          )
        : null;
    this.options[OptionType.MISTAKE] = normalizeOptionList(
      OptionType.MISTAKE,
      stringOptionValues(loadedOptions[OptionType.MISTAKE])
    );
    this.options[OptionType.TAG] = normalizeStringOptions(
      loadedOptions[OptionType.TAG]
    );
    this.options.tagColors = normalizeTagColors(
      loadedOptions.tagColors,
      this.options[OptionType.TAG]
    );
    this.options[OptionType.EVENT] = this.normalizeEventOptions(
      loadedOptions[OptionType.EVENT]
    );
  }

  
  private async loadOptions(): Promise<void> {
    this.legacySetupNames = null;
    try {
      
      const optionsKey = this.getOptionsKey();

      
      const pluginInstance = this.plugin;
      const settingsRecord = asRecord(pluginInstance.settings);

      const storedOptions = settingsRecord?.[optionsKey];

      if (storedOptions && typeof storedOptions === 'object') {
        
        const loadedOptions = {
          ...DEFAULT_OPTIONS_DATA, 
          ...(storedOptions as Partial<CustomOptionsData>),
        };
        this.applyLoadedOptions(loadedOptions);
      } else {
        
        const defaultStoredOptions = settingsRecord?.customOptions;

        if (
          !this.namespace &&
          defaultStoredOptions &&
          typeof defaultStoredOptions === 'object'
        ) {
          
          const loadedOptions = {
            ...DEFAULT_OPTIONS_DATA,
            ...(defaultStoredOptions as Partial<CustomOptionsData>),
          };

          
          
          this.applyLoadedOptions(loadedOptions);
        } else {
          
          const savedData = asRecord(await this.plugin.loadData());
          const legacyKey = this.namespace
            ? `customOptions_${this.namespace}`
            : 'customOptions';

          if (savedData && savedData[legacyKey]) {
            
            const loadedOptions = {
              ...DEFAULT_OPTIONS_DATA,
              ...(asRecord(savedData[legacyKey]) ?? {}),
            };

            
            
            this.applyLoadedOptions(loadedOptions);

            
            if (settingsRecord && pluginInstance.saveSettings) {
              settingsRecord[optionsKey] = this.getPersistedOptions();
              await pluginInstance.saveSettings();
            }
          } else if (!this.namespace && savedData && savedData.customOptions) {
            
            const loadedOptions = {
              ...DEFAULT_OPTIONS_DATA,
              ...(asRecord(savedData.customOptions) ?? {}),
            };

            
            this.applyLoadedOptions(loadedOptions);

            
            if (settingsRecord && pluginInstance.saveSettings) {
              settingsRecord[optionsKey] = this.getPersistedOptions();
              await pluginInstance.saveSettings();
            }
          } else {
            this.options = { ...DEFAULT_OPTIONS_DATA, tagColors: {} };
            
            await this.initializeDefaultOptionsIfNeeded();

            
            if (settingsRecord && pluginInstance.saveSettings) {
              settingsRecord[optionsKey] = this.getPersistedOptions();
              await pluginInstance.saveSettings();
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load custom options:', error);
      
      this.options = { ...DEFAULT_OPTIONS_DATA, tagColors: {} };
      
    }
  }

  
  public async cleanupCorruptedOptions(): Promise<number> {
    return this.enqueueOptionMutation(() =>
      this.cleanupCorruptedOptionsInternal()
    );
  }

  private async cleanupCorruptedOptionsInternal(): Promise<number> {
    let removedCount = 0;

    const typesToClean = [
      OptionType.TAG,
      OptionType.MISTAKE,
      OptionType.ACCOUNT,
      OptionType.ACCOUNT_TYPE,
    ] as const;

    for (const type of typesToClean) {
      const options = this.options[type];
      const originalCount = options.length;

      
      const cleaned = normalizeOptionList(type, options);

      this.options[type] = cleaned;
      removedCount += originalCount - cleaned.length;
    }

    if (removedCount > 0) {
      logger.debug(
        `CustomOptionsService: Cleaned ${removedCount} corrupted option entries`
      );
      await this.saveOptions();
    }

    return removedCount;
  }

  
  private async saveOptions(throwOnError: boolean = false): Promise<void> {
    try {
      
      const optionsKey = this.getOptionsKey();

      
      const pluginInstance = this.plugin;
      const settingsRecord = asRecord(pluginInstance.settings);

      if (settingsRecord && pluginInstance.saveSettings) {
        
        settingsRecord[optionsKey] = this.getPersistedOptions();

        
        await pluginInstance.saveSettings();
      } else {
        
        console.warn(
          `Plugin settings not accessible, using legacy save method with key: ${optionsKey}`
        );

        
        const existingData = asRecord(await this.plugin.loadData()) ?? {};

        
        const updatedData = {
          ...existingData,
          [optionsKey]: this.getPersistedOptions(),
        };

        
        await this.plugin.saveData(updatedData);
      }
    } catch (error) {
      console.error(
        `Failed to save custom options with key: ${this.getOptionsKey()}:`,
        error
      );
      if (throwOnError) throw error;
    }
  }

  
  public getOptions(type: StoredOptionType): string[] {
    if (type === OptionType.EVENT) {
      
      return this.options[OptionType.EVENT].map((option) => option.name);
    } else if (type === OptionType.INSTRUMENT) {
      
      return this.options[OptionType.INSTRUMENT].map((option) => option.name);
    }

    
    if (!this.options[type]) {
      console.warn(
        `Options for type ${type} not initialized, returning empty array`
      );
      return [];
    }

    
    return [...this.options[type]];
  }

  
  public getInstrumentsForAssetType(assetType: string): string[] {
    return this.options[OptionType.INSTRUMENT].flatMap((instrument) =>
      instrument.assetType === assetType ? [instrument.name] : []
    );
  }

  
  public isInstrumentValidForAssetType(
    instrumentName: string,
    assetType: string
  ): boolean {
    if (!instrumentName || !assetType) return false;

    return this.options[OptionType.INSTRUMENT].some(
      (instrument) =>
        instrument.name.toLowerCase() === instrumentName.toLowerCase() &&
        instrument.assetType === assetType
    );
  }

  
  public getInstrument(
    instrumentName: string,
    assetType?: string
  ): InstrumentData | undefined {
    if (!instrumentName) return undefined;

    return this.options[OptionType.INSTRUMENT].find(
      (instrument) =>
        instrument.name.toLowerCase() === instrumentName.toLowerCase() &&
        (assetType ? instrument.assetType === assetType : true)
    );
  }

  
  public getAssetTypeForInstrument(instrumentName: string): string | undefined {
    return this.getInstrument(instrumentName)?.assetType;
  }

  
  public getFuturesDataForInstrument(
    instrumentName: string
  ): FuturesInstrumentData | undefined {
    if (!instrumentName) return undefined;

    const instrument = this.options[OptionType.INSTRUMENT].find(
      (instrument) =>
        instrument.name.toLowerCase() === instrumentName.toLowerCase() &&
        instrument.assetType === 'futures'
    );

    return instrument?.futuresData;
  }

  
  public getCfdDataForInstrument(
    instrumentName: string
  ): CfdInstrumentData | undefined {
    if (!instrumentName) return undefined;

    const instrument = this.options[OptionType.INSTRUMENT].find(
      (instrument) =>
        instrument.name.toLowerCase() === instrumentName.toLowerCase() &&
        instrument.assetType === 'cfd'
    );

    return instrument?.cfdData;
  }

  
  public async setCfdDataForInstrument(
    instrumentName: string,
    cfdData: CfdInstrumentData,
    applyToTrades: boolean = false
  ): Promise<boolean> {
    return this.enqueueOptionMutation(() =>
      this.setCfdDataForInstrumentInternal(
        instrumentName,
        cfdData,
        applyToTrades
      )
    );
  }

  private async setCfdDataForInstrumentInternal(
    instrumentName: string,
    cfdData: CfdInstrumentData,
    applyToTrades: boolean
  ): Promise<boolean> {
    if (!instrumentName) return false;

    const instrumentIndex = this.options[OptionType.INSTRUMENT].findIndex(
      (instrument) =>
        instrument.name.toLowerCase() === instrumentName.toLowerCase() &&
        instrument.assetType === 'cfd'
    );

    if (instrumentIndex === -1) return false;

    const sanitizedData = { ...cfdData };
    if (sanitizedData.contractSize === 0) {
      sanitizedData.contractSize = undefined;
    }

    this.options[OptionType.INSTRUMENT][instrumentIndex].cfdData = {
      ...this.options[OptionType.INSTRUMENT][instrumentIndex].cfdData,
      ...sanitizedData,
    };

    await this.saveOptions();

    const updatedCfdData =
      this.options[OptionType.INSTRUMENT][instrumentIndex].cfdData;

    const shouldApplyToTrades =
      applyToTrades && this.hasValidCfdSpecs(updatedCfdData);

    this.notifyOptionsChanged({
      optionType: OptionType.INSTRUMENT,
      action: 'updated',
      instrument: instrumentName,
      assetType: 'cfd',
      applyToTrades: shouldApplyToTrades,
    });

    return true;
  }

  
  public async setFuturesDataForInstrument(
    instrumentName: string,
    futuresData: FuturesInstrumentData,
    applyToTrades: boolean = false
  ): Promise<boolean> {
    return this.enqueueOptionMutation(() =>
      this.setFuturesDataForInstrumentInternal(
        instrumentName,
        futuresData,
        applyToTrades
      )
    );
  }

  private async setFuturesDataForInstrumentInternal(
    instrumentName: string,
    futuresData: FuturesInstrumentData,
    applyToTrades: boolean
  ): Promise<boolean> {
    if (!instrumentName) return false;

    const instrumentIndex = this.options[OptionType.INSTRUMENT].findIndex(
      (instrument) =>
        instrument.name.toLowerCase() === instrumentName.toLowerCase() &&
        instrument.assetType === 'futures'
    );

    if (instrumentIndex === -1) return false;

    
    const sanitizedData = { ...futuresData };
    if (sanitizedData.dollarPerPoint === 0) {
      sanitizedData.dollarPerPoint = undefined;
    }

    
    this.options[OptionType.INSTRUMENT][instrumentIndex].futuresData = {
      ...this.options[OptionType.INSTRUMENT][instrumentIndex].futuresData,
      ...sanitizedData,
    };

    
    await this.saveOptions();

    const updatedFuturesData =
      this.options[OptionType.INSTRUMENT][instrumentIndex].futuresData;

    const shouldApplyToTrades =
      applyToTrades && this.hasValidFuturesSpecs(updatedFuturesData);

    
    this.notifyOptionsChanged({
      optionType: OptionType.INSTRUMENT,
      action: 'updated',
      instrument: instrumentName,
      assetType: 'futures',
      applyToTrades: shouldApplyToTrades,
    });

    return true;
  }

  
  public async setForexDataForInstrument(
    instrumentName: string,
    forexData: ForexInstrumentData,
    applyToTrades: boolean = false
  ): Promise<boolean> {
    return this.enqueueOptionMutation(() =>
      this.setForexDataForInstrumentInternal(
        instrumentName,
        forexData,
        applyToTrades
      )
    );
  }

  private async setForexDataForInstrumentInternal(
    instrumentName: string,
    forexData: ForexInstrumentData,
    applyToTrades: boolean
  ): Promise<boolean> {
    if (!instrumentName) return false;

    const instrumentIndex = this.options[OptionType.INSTRUMENT].findIndex(
      (instrument) =>
        instrument.name.toLowerCase() === instrumentName.toLowerCase() &&
        instrument.assetType === 'forex'
    );

    if (instrumentIndex === -1) return false;

    const mergedForexData = {
      ...(this.options[OptionType.INSTRUMENT][instrumentIndex].forexData || {}),
    };
    Object.entries(forexData).forEach(([key, value]) => {
      if (value !== undefined) {
        (mergedForexData as Record<string, unknown>)[key] = value;
      }
    });

    this.options[OptionType.INSTRUMENT][instrumentIndex].forexData =
      mergedForexData;

    await this.saveOptions();

    const updatedForexData =
      this.options[OptionType.INSTRUMENT][instrumentIndex].forexData;

    const shouldApplyToTrades =
      applyToTrades && this.hasValidForexSpecs(updatedForexData);

    this.notifyOptionsChanged({
      optionType: OptionType.INSTRUMENT,
      action: 'updated',
      instrument: instrumentName,
      assetType: 'forex',
      applyToTrades: shouldApplyToTrades,
    });

    return true;
  }

  private hasValidFuturesSpecs(futuresData?: FuturesInstrumentData): boolean {
    return Boolean(
      futuresData &&
      futuresData.dollarPerPoint &&
      futuresData.dollarPerPoint > 0 &&
      futuresData.tickSize &&
      futuresData.tickSize > 0 &&
      futuresData.tickValue &&
      futuresData.tickValue > 0
    );
  }

  private hasValidForexSpecs(forexData?: ForexInstrumentData): boolean {
    return Boolean(
      forexData &&
      forexData.lotSize &&
      forexData.lotSize > 0 &&
      forexData.pipValue &&
      forexData.pipValue > 0 &&
      forexData.pipSize &&
      forexData.pipSize > 0
    );
  }

  private hasValidCfdSpecs(cfdData?: CfdInstrumentData): boolean {
    return Boolean(cfdData && cfdData.contractSize && cfdData.contractSize > 0);
  }

  private normalizeCommissionRules(
    rules?: InstrumentCommissionRule[]
  ): InstrumentCommissionRule[] | undefined {
    if (!rules?.length) return undefined;

    const normalized = rules.flatMap((rule) => {
      const normalizedRule = {
        account: rule.account?.trim() || undefined,
        method: rule.method,
        entryCommission:
          rule.method === 'perSide' ? rule.entryCommission || 0 : undefined,
        exitCommission:
          rule.method === 'perSide' ? rule.exitCommission || 0 : undefined,
        roundTripCommission:
          rule.method === 'roundTrip'
            ? rule.roundTripCommission || 0
            : undefined,
      };
      const hasPositiveCommission =
        normalizedRule.method === 'roundTrip'
          ? (normalizedRule.roundTripCommission ?? 0) > 0
          : (normalizedRule.entryCommission ?? 0) > 0 ||
            (normalizedRule.exitCommission ?? 0) > 0;
      return hasPositiveCommission ? [normalizedRule] : [];
    });

    const allAccountsRule = normalized.find((rule) => !rule.account);
    if (allAccountsRule) {
      return [allAccountsRule];
    }

    return normalized.length ? normalized : undefined;
  }

  public calculateInstrumentCommission(input: {
    instrument: string;
    assetType?: string;
    account?: string | string[];
    positionSize: number;
    exitedPositionSize?: number;
    hasExit?: boolean;
  }): number | undefined {
    if (input.assetType === 'cfd') return undefined;

    const account = Array.isArray(input.account)
      ? input.account[0]
      : input.account;
    const instrument = this.options[OptionType.INSTRUMENT].find(
      (option) =>
        option.name.toLowerCase() === input.instrument.toLowerCase() &&
        (!input.assetType || option.assetType === input.assetType)
    );
    const rules = instrument?.commissionRules;
    if (!rules?.length) return undefined;

    const rule =
      rules.find(
        (candidate) => candidate.account && candidate.account === account
      ) || rules.find((candidate) => !candidate.account);
    if (!rule) return undefined;

    const quantity = Math.abs(input.positionSize || 0);
    if (quantity <= 0) return undefined;

    const commission =
      rule.method === 'roundTrip'
        ? input.hasExit === false
          ? 0
          : (rule.roundTripCommission || 0) *
            Math.abs(input.exitedPositionSize ?? input.positionSize ?? 0)
        : (rule.entryCommission || 0) * quantity +
          (input.hasExit === false
            ? 0
            : (rule.exitCommission || 0) *
              Math.abs(input.exitedPositionSize ?? input.positionSize ?? 0));
    return commission > 0 ? commission : undefined;
  }

  private normalizeInstrumentCurrency(
    currency?: string | null
  ): string | undefined {
    if (!currency) return undefined;

    const normalized = currency.trim().toUpperCase();
    return /^[A-Z]{3}$/.test(normalized) ? normalized : undefined;
  }

  
  public getAllOptions(): CustomOptionsData {
    return {
      ...this.options,
      tagColors: { ...this.options.tagColors },
    };
  }

  public persistAgentOptionsCommand(
    command: AgentOptionsPersistenceCommand
  ): Promise<void> {
    return this.enqueueOptionMutation(async () => {
      try {
        if (command.kind === 'note_rewrite') {
          await this.persistNoteRewriteCommand(command);
          return;
        }
        await this.persistSettingsOnlyCommand(command);
      } catch (error) {
        if (error instanceof OptionCatalogMutationError) throw error;
        if (
          error instanceof Error &&
          error.message === AGENT_OPTIONS_INTERNAL_ERROR
        ) {
          throw error;
        }
        throw new Error(AGENT_OPTIONS_INTERNAL_ERROR);
      }
    });
  }

  private requireAgentSettings(): Record<string, unknown> {
    const settings = asRecord(this.plugin.settings);
    if (!settings || !this.plugin.saveSettings) {
      throw new Error(AGENT_OPTIONS_INTERNAL_ERROR);
    }
    return settings;
  }

  private async persistSettingsOnlyCommand(
    command: Extract<AgentOptionsPersistenceCommand, { kind: 'settings_only' }>
  ): Promise<void> {
    if (command.prepareVerification) {
      await command.prepareVerification();
    }
    const settings = this.requireAgentSettings();
    const optionsKey = this.getOptionsKey();
    const rawOptions = settings[optionsKey];
    const rawAccountSettings = settings.account;
    await command.verifyCurrent(rawOptions, rawAccountSettings);
    const latest = this.requireAgentSettings();
    if (
      latest !== settings ||
      latest[optionsKey] !== rawOptions ||
      latest.account !== rawAccountSettings
    ) {
      throw new OptionCatalogMutationError('conflict');
    }
    const nextOptions = await this.persistOwnedSettings(
      latest,
      command.ownedFields
    );
    this.applyLoadedOptions(nextOptions);
  }

  private async persistNoteRewriteCommand(
    command: Extract<AgentOptionsPersistenceCommand, { kind: 'note_rewrite' }>
  ): Promise<void> {
    const settings = this.requireAgentSettings();
    const optionsKey = this.getOptionsKey();
    const rawOptions = settings[optionsKey];
    await command.verifyCurrent(rawOptions, settings.account);
    const latest = this.requireAgentSettings();
    if (latest !== settings || latest[optionsKey] !== rawOptions) {
      throw new OptionCatalogMutationError('conflict');
    }
    const verifiedCatalogSnapshot = snapshotAgentRewriteCatalog(
      rawOptions,
      command.ownedFields
    );
    const installedNotes: NoteRewriteNoteInstall =
      await installNoteRewriteNotes(this.getApp(), command.plan);
    const afterInstall = this.requireAgentSettings();
    if (
      afterInstall !== latest ||
      afterInstall[optionsKey] !== rawOptions ||
      !optionFrontmatterValuesEqual(
        verifiedCatalogSnapshot,
        snapshotAgentRewriteCatalog(rawOptions, command.ownedFields)
      )
    ) {
      const incomplete = await installedNotes.rollback();
      if (incomplete) {
        console.error('Agent option settings rollback was incomplete.');
      }
      throw new OptionCatalogMutationError('conflict');
    }
    let nextOptions: unknown;
    try {
      nextOptions = await this.persistOwnedSettings(
        afterInstall,
        command.ownedFields
      );
    } catch {
      const incomplete = await installedNotes.rollback();
      if (incomplete) {
        console.error('Agent option settings rollback was incomplete.');
      }
      throw new OptionCatalogMutationError('internal_error');
    }
    this.recordRewriteRetirement(command.plan);
    try {
      this.applyLoadedOptions(nextOptions);
    } catch {
      console.error('Agent option settings reconciliation was incomplete.');
    }
  }

  private async persistOwnedSettings(
    settings: Record<string, unknown>,
    ownedFields: OwnedOptionFields
  ): Promise<unknown> {
    const optionsKey = this.getOptionsKey();
    const currentRawOptions = settings[optionsKey];
    const currentAccount = settings.account;
    const currentOptionsRecord = asRecord(currentRawOptions) ?? {};
    const nextOptions: Record<string, unknown> = {
      ...currentOptionsRecord,
    };
    const previous = new Map<string, { present: boolean; value: unknown }>();
    const installed = new Map<string, unknown>();
    const cloneUnknown = (value: unknown): unknown => {
      const cloned: unknown = structuredClone(value);
      return cloned;
    };
    const installOptionField = (key: string, value: unknown): void => {
      previous.set(key, {
        present:
          Object.prototype.hasOwnProperty.call(currentOptionsRecord, key) ===
          true,
        value: cloneUnknown(currentOptionsRecord[key]),
      });
      const cloned = cloneUnknown(value);
      nextOptions[key] = cloned;
      installed.set(key, cloned);
    };
    switch (ownedFields.catalog) {
      case 'tags':
        installOptionField(OptionType.TAG, ownedFields.tag);
        installOptionField('tagColors', ownedFields.tagColors);
        break;
      case 'mistakes':
        installOptionField(OptionType.MISTAKE, ownedFields.mistake);
        break;
      case 'account_types':
        installOptionField(OptionType.ACCOUNT_TYPE, ownedFields.account_type);
        break;
      case 'events':
        installOptionField(OptionType.EVENT, ownedFields.event);
        break;
    }

    const currentAccountRecord = asRecord(currentAccount) ?? {};
    const accountFieldInstalls: {
      key: string;
      had: boolean;
      previous: unknown;
      installed: unknown;
    }[] = [];
    const metadataInstalls: {
      key: string;
      previousType: unknown;
      installedType: string;
    }[] = [];
    let nextMetadata: Record<string, unknown> | undefined;
    if (ownedFields.catalog === 'account_types') {
      const installAccountField = (key: string, value: unknown): void => {
        accountFieldInstalls.push({
          key,
          had:
            Object.prototype.hasOwnProperty.call(currentAccountRecord, key) ===
            true,
          previous: cloneUnknown(currentAccountRecord[key]),
          installed: cloneUnknown(value),
        });
      };
      installAccountField('accountTypeOrder', ownedFields.accountTypeOrder);
      if (ownedFields.defaultAccountType !== undefined) {
        installAccountField(
          'defaultAccountType',
          ownedFields.defaultAccountType
        );
      }
      if (ownedFields.excludedAccountTypes !== undefined) {
        installAccountField(
          'excludedAccountTypes',
          ownedFields.excludedAccountTypes
        );
      }
      if (ownedFields.includeWithdrawalsFromExcluded !== undefined) {
        installAccountField(
          'includeWithdrawalsFromExcluded',
          ownedFields.includeWithdrawalsFromExcluded
        );
      }
      const patch = ownedFields.metadataAccountTypePatch;
      if (patch !== undefined) {
        const patchKeys = Object.keys(patch);
        if (patchKeys.length > 0) {
          const currentMetadata = asRecord(
            currentAccountRecord.accountMetadata
          );
          if (!currentMetadata) {
            throw new OptionCatalogMutationError('conflict');
          }
          nextMetadata = { ...currentMetadata };
          for (let index = 0; index < patchKeys.length; index += 1) {
            const key = patchKeys[index];
            const assignment = patch[key];
            const entry = asRecord(currentMetadata[key]);
            if (!entry || entry.accountType !== assignment.from) {
              throw new OptionCatalogMutationError('conflict');
            }
            nextMetadata[key] = {
              ...entry,
              accountType: assignment.to,
            };
            metadataInstalls.push({
              key,
              previousType: cloneUnknown(entry.accountType),
              installedType: assignment.to,
            });
          }
        }
      }
    }
    let nextAccount: unknown = currentAccount;
    if (ownedFields.catalog === 'account_types') {
      const nextAccountRecord: Record<string, unknown> = {
        ...currentAccountRecord,
      };
      for (let index = 0; index < accountFieldInstalls.length; index += 1) {
        const field = accountFieldInstalls[index];
        nextAccountRecord[field.key] = cloneUnknown(field.installed);
      }
      if (nextMetadata !== undefined) {
        nextAccountRecord.accountMetadata = nextMetadata;
      }
      nextAccount = nextAccountRecord;
    }

    settings[optionsKey] = nextOptions;
    if (ownedFields.catalog === 'account_types') settings.account = nextAccount;
    try {
      await this.plugin.saveSettings?.();
    } catch {
      let rollbackNeeded = false;
      const latestOptions = asRecord(settings[optionsKey]);
      if (latestOptions) {
        for (const [key, installedValue] of installed) {
          if (
            JSON.stringify(latestOptions[key]) !==
            JSON.stringify(installedValue)
          ) {
            continue;
          }
          const original = previous.get(key);
          if (!original) continue;
          if (original.present)
            latestOptions[key] = cloneUnknown(original.value);
          else delete latestOptions[key];
          rollbackNeeded = true;
        }
      }
      if (ownedFields.catalog === 'account_types') {
        const latestAccount = asRecord(settings.account);
        if (latestAccount) {
          for (let index = 0; index < accountFieldInstalls.length; index += 1) {
            const field = accountFieldInstalls[index];
            if (
              JSON.stringify(latestAccount[field.key]) !==
              JSON.stringify(field.installed)
            ) {
              continue;
            }
            if (field.had) {
              latestAccount[field.key] = cloneUnknown(field.previous);
            } else {
              delete latestAccount[field.key];
            }
            rollbackNeeded = true;
          }
          const latestMetadata = asRecord(latestAccount.accountMetadata);
          if (latestMetadata) {
            for (let index = 0; index < metadataInstalls.length; index += 1) {
              const install = metadataInstalls[index];
              const entry = asRecord(latestMetadata[install.key]);
              if (!entry || entry.accountType !== install.installedType) {
                continue;
              }
              entry.accountType = cloneUnknown(install.previousType);
              latestMetadata[install.key] = entry;
              rollbackNeeded = true;
            }
          }
        }
      }
      try {
        if (rollbackNeeded) await this.plugin.saveSettings?.();
        this.applyLoadedOptions(settings[optionsKey]);
      } catch {
        console.error('Agent option settings rollback was incomplete.');
      }
      throw new Error(AGENT_OPTIONS_INTERNAL_ERROR);
    }
    return nextOptions;
  }

  public getTagColor(tag: string): LabelColor | undefined {
    const storedTag = this.options[OptionType.TAG].find((option) =>
      normalizedEquals(option, tag)
    );
    return storedTag ? this.options.tagColors[storedTag] : undefined;
  }

  public getTagColors(): Record<string, LabelColor> {
    return { ...this.options.tagColors };
  }

  public async setTagColor(
    tag: string,
    color: LabelColor | undefined
  ): Promise<boolean> {
    return this.enqueueOptionMutation(() =>
      this.setTagColorInternal(tag, color)
    );
  }

  private async setTagColorInternal(
    tag: string,
    color: LabelColor | undefined
  ): Promise<boolean> {
    const storedTag = this.options[OptionType.TAG].find((option) =>
      normalizedEquals(option, tag)
    );
    if (!storedTag) return false;

    const cleanColor = normalizeLabelColor(color);
    if (!cleanColor) {
      delete this.options.tagColors[storedTag];
    } else {
      this.options.tagColors[storedTag] = cleanColor;
    }

    await this.saveOptions();
    this.notifyOptionsChanged({
      optionType: OptionType.TAG,
      action: 'updated',
    });
    return true;
  }

  
  public async addOption(
    type: StoredOptionType,
    value: string,
    assetType?: string,
    futuresData?: FuturesInstrumentData,
    forexData?: ForexInstrumentData,
    cfdData?: CfdInstrumentData,
    instrumentCurrency?: string,
    commissionRules?: InstrumentCommissionRule[]
  ): Promise<boolean> {
    const retirementKey =
      type === OptionType.MISTAKE
        ? this.mistakeRetirementKey(value)
        : undefined;
    const versionAtRequest =
      retirementKey === undefined
        ? undefined
        : (this.mistakeRetirementVersions.get(retirementKey) ?? 0);
    return this.enqueueOptionMutation(async () => {
      if (
        retirementKey !== undefined &&
        versionAtRequest !== undefined &&
        this.mistakeVersionChangedWhileWaiting(retirementKey, versionAtRequest)
      ) {
        return false;
      }
      return this.addOptionInternal(
        type,
        value,
        assetType,
        futuresData,
        forexData,
        cfdData,
        instrumentCurrency,
        commissionRules
      );
    });
  }

  private async addOptionInternal(
    type: StoredOptionType,
    value: string,
    assetType?: string,
    futuresData?: FuturesInstrumentData,
    forexData?: ForexInstrumentData,
    cfdData?: CfdInstrumentData,
    instrumentCurrency?: string,
    commissionRules?: InstrumentCommissionRule[]
  ): Promise<boolean> {
    
    if (type === OptionType.EVENT) {
      console.warn(`Use addOrUpdateEventOption to add events with colors.`);
      return false;
    }

    
    
    const selectionField = getSelectionOptionField(type);
    const cleanValue =
      type === OptionType.TAG
        ? (deduplicateOptions([value])[0] ?? '')
        : selectionField
          ? (readTradeSelectionEntry(value, selectionField) ?? '')
          : value.trim();

    
    if (!cleanValue) {
      return false;
    }
    if (type === OptionType.TAG && isSyntheticSetupTagFilterValue(cleanValue)) {
      return false;
    }

    const previousTagOptions =
      type === OptionType.TAG ? [...this.options[OptionType.TAG]] : null;

    if (type === OptionType.INSTRUMENT) {
      
      if (!assetType) {
        console.warn('Asset type is required when adding an instrument');
        return false;
      }

      
      const exists = this.options[OptionType.INSTRUMENT].some(
        (instrument) =>
          instrument.name.toLowerCase() === cleanValue.toLowerCase() &&
          instrument.assetType === assetType
      );

      if (exists) {
        return false;
      }

      
      const newInstrument: InstrumentData = {
        name: cleanValue,
        assetType,
        currency: this.normalizeInstrumentCurrency(instrumentCurrency),
        commissionRules: this.normalizeCommissionRules(commissionRules),
      };

      
      if (assetType === 'futures' && futuresData) {
        newInstrument.futuresData = futuresData;
      }

      
      if (assetType === 'forex' && forexData) {
        newInstrument.forexData = forexData;
      }

      
      if (assetType === 'cfd' && cfdData) {
        newInstrument.cfdData = cfdData;
      }

      
      this.options[OptionType.INSTRUMENT].push(newInstrument);
    } else {
      

      
      const exists = this.options[type].some((option) =>
        optionValuesEqual(type, option, cleanValue)
      );

      if (exists) {
        return false;
      }

      
      this.options[type] = [...this.options[type], cleanValue];

      if (type === OptionType.ACCOUNT_TYPE) {
        this.appendAccountTypeToDashboardOrder(cleanValue);
      }
    }

    
    try {
      await this.saveOptions(type === OptionType.TAG);
    } catch (error) {
      if (previousTagOptions) {
        this.options[OptionType.TAG] = previousTagOptions;
        try {
          await this.saveOptions(true);
        } catch (recoveryError) {
          throw new AggregateError(
            [error, recoveryError],
            'Tag creation failed and recovery was incomplete'
          );
        }
      }
      throw error;
    }

    if (type === OptionType.INSTRUMENT) {
      const instrument = this.options[OptionType.INSTRUMENT].find(
        (entry) =>
          entry.name.toLowerCase() === cleanValue.toLowerCase() &&
          entry.assetType === assetType
      );

      const shouldApplyToTrades =
        (assetType === 'futures' &&
          this.hasValidFuturesSpecs(instrument?.futuresData)) ||
        (assetType === 'forex' &&
          this.hasValidForexSpecs(instrument?.forexData)) ||
        (assetType === 'cfd' && this.hasValidCfdSpecs(instrument?.cfdData));

      this.notifyOptionsChanged({
        optionType: type,
        action: 'created',
        instrument: cleanValue,
        assetType,
        applyToTrades: shouldApplyToTrades,
      });
    } else {
      this.notifyOptionsChanged({
        optionType: type,
        action: 'created',
      });
    }

    return true;
  }

  
  public async addOrUpdateEventOption(
    name: string,
    color: string,
    notes?: string
  ): Promise<boolean> {
    const retirementKey = this.eventRetirementKey(name);
    const versionAtRequest =
      retirementKey === undefined
        ? undefined
        : (this.eventRetirementVersions.get(retirementKey) ?? 0);
    return this.enqueueOptionMutation(async () => {
      if (
        retirementKey !== undefined &&
        versionAtRequest !== undefined &&
        this.eventVersionChangedWhileWaiting(retirementKey, versionAtRequest)
      ) {
        return false;
      }
      return this.addOrUpdateEventOptionInternal(name, color, notes);
    });
  }

  private async addOrUpdateEventOptionInternal(
    name: string,
    color: string,
    notes?: string
  ): Promise<boolean> {
    const cleanName = name.trim();
    const validColors = ['red', 'orange', 'yellow', 'gray'];
    const cleanColor = validColors.includes(color) ? color : 'gray'; 

    if (!cleanName) {
      return false;
    }

    const existingIndex = this.options[OptionType.EVENT].findIndex(
      (option) => option.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingIndex !== -1) {
      
      this.options[OptionType.EVENT][existingIndex].color = cleanColor;
      if (notes !== undefined) {
        this.options[OptionType.EVENT][existingIndex].notes = notes;
      }
    } else {
      
      this.options[OptionType.EVENT].push({
        name: cleanName,
        color: cleanColor,
        notes,
      });
    }

    await this.saveOptions();
    this.notifyOptionsChanged(); 
    return true;
  }

  
  public async addOptions(
    type: StoredOptionType,
    values: string[],
    assetType?: string
  ): Promise<number> {
    if (type === OptionType.TAG) {
      return this.enqueueOptionMutation(async () => {
        let addedCount = 0;
        for (const value of deduplicateOptions(values)) {
          if (await this.addOptionInternal(type, value)) addedCount++;
        }
        return addedCount;
      });
    }
    const versionsAtRequest = new Map<string, number>();
    if (type === OptionType.MISTAKE) {
      for (let index = 0; index < values.length; index += 1) {
        const key = this.mistakeRetirementKey(values[index]);
        if (key === undefined || versionsAtRequest.has(key)) continue;
        versionsAtRequest.set(
          key,
          this.mistakeRetirementVersions.get(key) ?? 0
        );
      }
    }
    return this.enqueueOptionMutation(() => {
      const accepted =
        type === OptionType.MISTAKE
          ? values.filter((value) => {
              const key = this.mistakeRetirementKey(value);
              if (key === undefined) return false;
              const versionAtRequest = versionsAtRequest.get(key);
              return (
                versionAtRequest !== undefined &&
                !this.mistakeVersionChangedWhileWaiting(key, versionAtRequest)
              );
            })
          : values;
      return this.addOptionsInternal(type, accepted, assetType);
    });
  }

  private async addOptionsInternal(
    type: StoredOptionType,
    values: string[],
    assetType?: string
  ): Promise<number> {
    
    if (type === OptionType.EVENT) {
      console.warn(
        `Use addOrUpdateEventOption to add events with colors. Skipping addOptions for EVENT.`
      );
      return 0;
    }

    if (!values.length) {
      return 0;
    }

    
    const cleanedValues = values.flatMap((value) => {
      const cleanedValue = value.trim();
      return cleanedValue ? [cleanedValue] : [];
    });

    if (!cleanedValues.length) {
      return 0;
    }

    if (type === OptionType.INSTRUMENT) {
      
      if (!assetType) {
        console.warn('Asset type is required when adding instruments');
        return 0;
      }

      
      let addedCount = 0;

      for (const value of cleanedValues) {
        const exists = this.options[OptionType.INSTRUMENT].some(
          (instrument) =>
            instrument.name.toLowerCase() === value.toLowerCase() &&
            instrument.assetType === assetType
        );

        if (!exists) {
          
          const newInstrument: InstrumentData = { name: value, assetType };

          
          if (assetType === 'futures') {
            newInstrument.futuresData = {
              dollarPerPoint: 0,
              tickSize: 0,
              tickValue: 0,
            };
          }

          this.options[OptionType.INSTRUMENT].push(newInstrument);
          addedCount++;
        }
      }

      if (addedCount > 0) {
        
        await this.saveOptions();
      }

      return addedCount;
    } else {
      
      const filteredValues = cleanedValues.filter((value) => {
        const trimmed = value?.trim();
        if (!trimmed) return false;

        
        return !this.options[type].some((existing) =>
          optionValuesEqual(type, existing, trimmed)
        );
      });

      
      const uniqueValues = normalizeOptionList(type, filteredValues);

      if (!uniqueValues.length) {
        return 0;
      }

      
      this.options[type] = [...this.options[type], ...uniqueValues];

      
      await this.saveOptions();

      return uniqueValues.length;
    }
  }

  
  public async removeOption(
    type: StoredOptionType,
    value: string
  ): Promise<boolean> {
    return this.enqueueOptionMutation(() =>
      type === OptionType.TAG
        ? this.removeTagOption(value)
        : this.removeOptionInternal(type, value)
    );
  }

  private async removeOptionInternal(
    type: StoredOptionType,
    value: string
  ): Promise<boolean> {
    
    if (
      type === OptionType.ACCOUNT_TYPE &&
      value.toLowerCase() === 'archived'
    ) {
      console.warn('Cannot remove reserved "archived" account type');
      return false;
    }

    let removed = false;

    if (type === OptionType.EVENT) {
      const initialLength = this.options[OptionType.EVENT].length;
      this.options[OptionType.EVENT] = this.options[OptionType.EVENT].filter(
        (option) => option.name.toLowerCase() !== value.toLowerCase() 
      );
      removed = initialLength !== this.options[OptionType.EVENT].length;
    } else if (type === OptionType.INSTRUMENT) {
      const initialLength = this.options[OptionType.INSTRUMENT].length;
      this.options[OptionType.INSTRUMENT] = this.options[
        OptionType.INSTRUMENT
      ].filter(
        (instrument) => instrument.name.toLowerCase() !== value.toLowerCase() 
      );
      removed = initialLength !== this.options[OptionType.INSTRUMENT].length;
    } else {
      
      const initialLength = this.options[type].length;
      this.options[type] = this.options[type].filter(
        (option) => option.toLowerCase() !== value.toLowerCase()
      );
      removed = initialLength !== this.options[type].length;
    }

    if (removed) {
      if (type === OptionType.ACCOUNT_TYPE) {
        this.removeAccountTypeFromDashboardOrder(value);
        this.removeAccountTypeFromChallengeStageMapping(value);
      }

      
      await this.saveOptions();
      if (type === OptionType.MISTAKE) {
        this.recordMistakeRetirement(value);
      }

      
      this.notifyOptionsChanged();
    } else {
      console.warn(
        `Failed to remove option '${value}' from ${type} - option not found`
      );
    }

    return removed;
  }

  private async removeTagOption(value: string): Promise<boolean> {
    const exists = this.options[OptionType.TAG].some((option) =>
      normalizedEquals(option, value)
    );
    if (!exists) {
      console.warn(
        `Failed to remove option '${value}' from tag - option not found`
      );
      return false;
    }

    const previousTags = [...this.options[OptionType.TAG]];
    const previousTagColors = { ...this.options.tagColors };
    const transaction: OptionNoteTransaction = new Map();

    try {
      await this.updateNotesWithOption(
        OptionType.TAG,
        value,
        null,
        true,
        transaction
      );
      this.options[OptionType.TAG] = this.options[OptionType.TAG].filter(
        (option) => !normalizedEquals(option, value)
      );
      const colorKey = Object.keys(this.options.tagColors).find((key) =>
        normalizedEquals(key, value)
      );
      if (colorKey) delete this.options.tagColors[colorKey];

      await this.saveOptions(true);
      this.recordTagRetirement(value);
      this.notifyOptionsChanged();
      return true;
    } catch (error) {
      this.options[OptionType.TAG] = previousTags;
      this.options.tagColors = previousTagColors;
      const recoveryErrors: unknown[] = [];
      try {
        await this.rollbackOptionNoteTransaction(transaction, error);
      } catch (rollbackError) {
        recoveryErrors.push(rollbackError);
      }
      try {
        await this.saveOptions(true);
      } catch (saveError) {
        recoveryErrors.push(saveError);
      }
      if (recoveryErrors.length > 0) {
        throw new AggregateError(
          [error, ...recoveryErrors],
          'Tag deletion failed and recovery was incomplete'
        );
      }
      throw error;
    }
  }

  
  public async updateInstrument(
    oldName: string,
    newName: string,
    assetType: string,
    futuresData?: FuturesInstrumentData,
    updateNotes: boolean = false,
    forexData?: ForexInstrumentData,
    cfdData?: CfdInstrumentData,
    oldAssetType?: string,
    instrumentCurrency?: string | null,
    commissionRules?: InstrumentCommissionRule[]
  ): Promise<{ success: boolean; updatedNotes?: number }> {
    return this.enqueueOptionMutation(async () => {
      const result = await this.updateInstrumentInternal(
        oldName,
        newName,
        assetType,
        futuresData,
        updateNotes,
        forexData,
        cfdData,
        oldAssetType,
        instrumentCurrency,
        commissionRules
      );
      if (!result.success) return { success: false };
      const updatedNotes =
        updateNotes && result.identityChanged
          ? await this.updateNotesWithOption(
              OptionType.INSTRUMENT,
              oldName,
              result.instrument
            )
          : 0;
      this.notifyOptionsChanged({
        optionType: OptionType.INSTRUMENT,
        action: 'updated',
        instrument: result.instrument,
        assetType,
        applyToTrades: result.shouldApplyToTrades,
      });
      return { success: true, updatedNotes };
    });
  }

  private async updateInstrumentInternal(
    oldName: string,
    newName: string,
    assetType: string,
    futuresData?: FuturesInstrumentData,
    updateNotes: boolean = false,
    forexData?: ForexInstrumentData,
    cfdData?: CfdInstrumentData,
    oldAssetType?: string,
    instrumentCurrency?: string | null,
    commissionRules?: InstrumentCommissionRule[]
  ): Promise<
    | { success: false }
    | {
        success: true;
        identityChanged: boolean;
        instrument: string;
        shouldApplyToTrades: boolean;
      }
  > {
    const cleanNewName = newName.trim();

    
    if (!cleanNewName) {
      return { success: false };
    }

    
    if (!assetType) {
      return { success: false };
    }

    
    const previousAssetType = oldAssetType || assetType;
    const index = this.options[OptionType.INSTRUMENT].findIndex(
      (instrument) =>
        instrument.name.toLowerCase() === oldName.toLowerCase() &&
        (instrument.assetType || 'stock') === previousAssetType
    );

    if (index === -1) {
      console.warn(
        `Instrument '${oldName}' with asset type '${previousAssetType}' not found`
      );
      return { success: false };
    }

    
    const newNameExists = this.options[OptionType.INSTRUMENT].some(
      (instrument, i) =>
        i !== index &&
        instrument.name.toLowerCase() === cleanNewName.toLowerCase() &&
        instrument.assetType === assetType
    );

    if (newNameExists) {
      console.warn(
        `Instrument '${cleanNewName}' already exists with asset type '${assetType}'`
      );
      return { success: false };
    }

    const previousInstrument = this.options[OptionType.INSTRUMENT][index];

    
    const updatedInstrument: InstrumentData = {
      name: cleanNewName,
      assetType,
      currency:
        instrumentCurrency !== undefined
          ? this.normalizeInstrumentCurrency(instrumentCurrency)
          : previousInstrument.currency,
      commissionRules:
        commissionRules !== undefined
          ? this.normalizeCommissionRules(commissionRules)
          : previousInstrument.commissionRules,
    };

    
    if (assetType === 'futures') {
      
      updatedInstrument.futuresData = futuresData ||
        previousInstrument.futuresData || {
          dollarPerPoint: 0,
          tickSize: 0,
          tickValue: 0,
        };
    }

    
    if (assetType === 'forex') {
      
      
      if (forexData) {
        const mergedForexData = { ...(previousInstrument.forexData || {}) };
        Object.entries(forexData).forEach(([key, value]) => {
          if (value !== undefined) {
            (mergedForexData as Record<string, unknown>)[key] = value;
          }
        });
        updatedInstrument.forexData = mergedForexData;
      } else {
        updatedInstrument.forexData = previousInstrument.forexData;
      }
    }

    
    if (assetType === 'cfd') {
      updatedInstrument.cfdData = cfdData || previousInstrument.cfdData;
    }

    const specsChanged =
      previousInstrument.assetType !== updatedInstrument.assetType ||
      JSON.stringify(previousInstrument.futuresData || {}) !==
        JSON.stringify(updatedInstrument.futuresData || {}) ||
      JSON.stringify(previousInstrument.forexData || {}) !==
        JSON.stringify(updatedInstrument.forexData || {}) ||
      JSON.stringify(previousInstrument.cfdData || {}) !==
        JSON.stringify(updatedInstrument.cfdData || {}) ||
      JSON.stringify(previousInstrument.commissionRules || []) !==
        JSON.stringify(updatedInstrument.commissionRules || []);

    const identityChanged = oldName !== cleanNewName;

    
    this.options[OptionType.INSTRUMENT][index] = updatedInstrument;

    
    await this.saveOptions();

    const hasValidSpecs =
      (assetType === 'futures' &&
        this.hasValidFuturesSpecs(updatedInstrument.futuresData)) ||
      (assetType === 'forex' &&
        this.hasValidForexSpecs(updatedInstrument.forexData)) ||
      (assetType === 'cfd' && this.hasValidCfdSpecs(updatedInstrument.cfdData));

    const shouldApplyToTrades =
      hasValidSpecs && specsChanged && (!identityChanged || updateNotes);

    return {
      success: true,
      identityChanged,
      instrument: cleanNewName,
      shouldApplyToTrades,
    };
  }

  
  public async updateOption(
    type: StoredOptionType,
    oldValue: string,
    newValue: string,
    updateNotes: boolean = false
  ): Promise<{ success: boolean; updatedNotes?: number }> {
    if (type === OptionType.TAG) {
      const cleanNewValue = deduplicateOptions([newValue])[0] ?? '';
      if (!cleanNewValue || isSyntheticSetupTagFilterValue(cleanNewValue)) {
        return { success: false };
      }
      return this.enqueueOptionMutation(() =>
        this.updateTagOption(oldValue, cleanNewValue, updateNotes)
      );
    }
    const cleanNewValue = newValue.trim();
    return this.enqueueOptionMutation(() =>
      this.updateOptionWithNotes(type, oldValue, cleanNewValue, updateNotes)
    );
  }

  private async installSetupReferenceChanges(
    oldValue: string,
    newValue: string | null,
    expectNone = false
  ) {
    const transaction: OptionNoteTransaction = new Map();
    try {
      const updatedNotes = await this.updateNotesWithOption(
        OptionType.SETUP,
        oldValue,
        newValue,
        true,
        transaction,
        expectNone
      );
      return {
        updatedNotes,
        rollback: () => this.rollbackOptionNoteTransaction(transaction),
      };
    } catch (error) {
      await this.rollbackOptionNoteTransaction(transaction, error);
      throw error;
    }
  }

  
  public listSetupReferenceNotePaths(name: string): string[] {
    if (!name.trim()) return [];
    const folderPathService =
      this.plugin.serviceManager?.getFolderPathService();
    if (!folderPathService) {
      throw new Error('FolderPathService is unavailable');
    }
    const paths: string[] = [];
    
    const dayFieldRewrite = this.dayTradeFieldOptionRewrite(
      OptionType.SETUP,
      name,
      null
    );
    for (const file of this.getApp().vault.getMarkdownFiles()) {
      if (!folderPathService.isJournalPath(file.path)) continue;
      const frontmatter = asRecord(
        this.getApp().metadataCache.getFileCache(file)?.frontmatter
      );
      if (!frontmatter) continue;
      const referencesSetup =
        this.isNoteEligibleForOptionUpdate(
          OptionType.SETUP,
          frontmatter,
          file.path
        ) &&
        this.frontmatterContainsOptionValue(
          OptionType.SETUP,
          this.getOptionUpdatePropertyNames(
            OptionType.SETUP,
            ['setup'],
            frontmatter
          ),
          frontmatter,
          name
        );
      if (
        referencesSetup ||
        (dayFieldRewrite &&
          Object.keys(
            planDayTradeFieldOptionRewrite(frontmatter, dayFieldRewrite)
          ).length > 0)
      ) {
        paths.push(file.path);
      }
    }
    return paths;
  }

  
  private async mutateSetupReferences(
    command: SetupOptionMutation
  ): Promise<SetupOptionMutationResult> {
    const { oldValue } = command;
    if (!oldValue.trim()) return { success: false };
    const newValue = command.kind === 'rename' ? command.newValue : null;
    if (command.kind === 'rename' && !newValue) return { success: false };
    if (command.kind === 'rename' && !command.updateNotes)
      return { success: true, updatedNotes: 0, rollback: async () => {} };
    const notes = await this.installSetupReferenceChanges(
      oldValue,
      newValue,
      command.kind === 'delete' && command.expectNone
    );
    return {
      success: true,
      updatedNotes: notes.updatedNotes,
      rollback: notes.rollback,
    };
  }

  private async updateOptionWithNotes(
    type: StoredOptionType,
    oldValue: string,
    newValue: string,
    updateNotes: boolean
  ): Promise<{ success: boolean; updatedNotes?: number }> {
    const result = await this.updateOptionInternal(type, oldValue, newValue);
    if (!result.success) return result;
    const updatedNotes = updateNotes
      ? await this.updateNotesWithOption(type, oldValue, newValue)
      : 0;
    this.notifyOptionsChanged();
    return { success: true, updatedNotes };
  }

  private async updateOptionInternal(
    type: StoredOptionType,
    oldValue: string,
    newValue: string
  ): Promise<{ success: boolean; updatedNotes?: number }> {
    const cleanNewValue =
      type === OptionType.TAG
        ? (deduplicateOptions([newValue])[0] ?? '')
        : newValue.trim();

    
    if (!cleanNewValue) {
      return { success: false };
    }
    if (
      type === OptionType.TAG &&
      isSyntheticSetupTagFilterValue(cleanNewValue)
    ) {
      return { success: false };
    }

    
    if (type === OptionType.INSTRUMENT) {
      console.warn(`Use updateInstrument method for instruments`);
      return { success: false };
    }

    let success = false;
    let index = -1;

    if (type === OptionType.EVENT) {
      
      const newValueExists = this.options[OptionType.EVENT].some(
        (option) =>
          option.name.toLowerCase() === cleanNewValue.toLowerCase() &&
          option.name.toLowerCase() !== oldValue.toLowerCase()
      );
      if (newValueExists) return { success: false };

      index = this.options[OptionType.EVENT].findIndex(
        (option) => option.name.toLowerCase() === oldValue.toLowerCase()
      );

      if (index !== -1) {
        
        this.options[OptionType.EVENT][index].name = cleanNewValue;
        success = true;
      }
    } else {
      
      const newValueExists = this.options[type].some(
        (option) =>
          option.toLowerCase() === cleanNewValue.toLowerCase() &&
          option.toLowerCase() !== oldValue.toLowerCase() 
      );

      if (newValueExists) {
        return { success: false };
      }

      
      index = this.options[type].findIndex(
        (option) => option.toLowerCase() === oldValue.toLowerCase()
      );

      if (index !== -1) {
        
        this.options[type][index] = cleanNewValue;

        if (type === OptionType.ACCOUNT_TYPE) {
          this.replaceAccountTypeInDashboardOrder(oldValue, cleanNewValue);
          this.replaceAccountTypeInChallengeStageMapping(
            oldValue,
            cleanNewValue
          );
        }

        success = true;
      }
    }

    if (!success) return { success: false };

    
    await this.saveOptions();
    if (type === OptionType.MISTAKE) {
      this.recordMistakeRetirement(oldValue);
    }

    return { success: true };
  }

  private async updateTagOption(
    oldValue: string,
    newValue: string,
    updateNotes: boolean
  ): Promise<{ success: boolean; updatedNotes?: number }> {
    const existingIndex = this.options[OptionType.TAG].findIndex((option) =>
      normalizedEquals(option, oldValue)
    );
    if (existingIndex === -1) return { success: false };
    if (
      this.options[OptionType.TAG].some(
        (option, index) =>
          index !== existingIndex && normalizedEquals(option, newValue)
      )
    ) {
      return { success: false };
    }

    const previousTags = [...this.options[OptionType.TAG]];
    const previousTagColors = { ...this.options.tagColors };
    const transaction: OptionNoteTransaction = new Map();

    try {
      const updatedNotes = updateNotes
        ? await this.updateNotesWithOption(
            OptionType.TAG,
            oldValue,
            newValue,
            true,
            transaction
          )
        : 0;
      this.options[OptionType.TAG][existingIndex] = newValue;
      const colorKey = Object.keys(this.options.tagColors).find((key) =>
        normalizedEquals(key, oldValue)
      );
      if (colorKey) {
        const color = this.options.tagColors[colorKey];
        delete this.options.tagColors[colorKey];
        this.options.tagColors[newValue] = color;
      }
      await this.saveOptions(true);
      this.recordTagRetirement(oldValue);
      this.notifyOptionsChanged();
      return { success: true, updatedNotes };
    } catch (error) {
      this.options[OptionType.TAG] = previousTags;
      this.options.tagColors = previousTagColors;
      const recoveryErrors: unknown[] = [];
      try {
        await this.rollbackOptionNoteTransaction(transaction, error);
      } catch (rollbackError) {
        recoveryErrors.push(rollbackError);
      }
      try {
        await this.saveOptions(true);
      } catch (saveError) {
        recoveryErrors.push(saveError);
      }
      if (recoveryErrors.length > 0) {
        throw new AggregateError(
          [error, ...recoveryErrors],
          'Tag rename failed and recovery was incomplete'
        );
      }
      throw error;
    }
  }

  
  public async updateNotesForOptionValue(
    type: OptionType,
    oldValue: string,
    newValue: string
  ): Promise<number> {
    const cleanNewValue = newValue.trim();
    if (!cleanNewValue) {
      return 0;
    }

    if (type === OptionType.SETUP) {
      return this.enqueueOptionMutation(async () => {
        const result = await this.installSetupReferenceChanges(
          oldValue,
          cleanNewValue
        );
        this.notifyOptionsChanged();
        return result.updatedNotes;
      });
    }
    const transaction: OptionNoteTransaction | undefined =
      type === OptionType.TAG ? new Map() : undefined;
    let updatedNotes: number;
    try {
      updatedNotes = await this.updateNotesWithOption(
        type,
        oldValue,
        cleanNewValue,
        type === OptionType.TAG,
        transaction
      );
    } catch (error) {
      if (transaction) {
        await this.rollbackOptionNoteTransaction(transaction, error);
      }
      throw error;
    }
    this.notifyOptionsChanged();
    return updatedNotes;
  }

  public async removeOptionValueFromNotes(
    type: OptionType,
    value: string
  ): Promise<number> {
    if (type !== OptionType.SETUP && type !== OptionType.TAG) {
      throw new Error(
        'Removing note option values is only supported for setups and tags'
      );
    }
    if (type === OptionType.SETUP) {
      return this.enqueueOptionMutation(
        async () =>
          (await this.installSetupReferenceChanges(value, null)).updatedNotes
      );
    }
    const transaction: OptionNoteTransaction = new Map();
    try {
      return await this.updateNotesWithOption(
        type,
        value,
        null,
        true,
        transaction
      );
    } catch (error) {
      await this.rollbackOptionNoteTransaction(transaction, error);
      throw error;
    }
  }

  private async rollbackOptionNoteTransaction(
    transaction: OptionNoteTransaction,
    operationError?: unknown
  ): Promise<void> {
    const rollbackErrors: unknown[] = [];
    const refreshedPaths: string[] = [];
    const refreshedReviewPaths: string[] = [];
    const snapshots = Array.from(transaction.values()).reverse();

    for (const snapshot of snapshots) {
      const { file, frontmatterBefore, frontmatterAfter, mutationApplied } =
        snapshot;
      if (!mutationApplied) continue;
      try {
        if (!frontmatterBefore || !frontmatterAfter) {
          throw new Error(
            `Cannot safely roll back ${file.path}: frontmatter changes were not captured`
          );
        }
        await this.getApp().fileManager.processFrontMatter(
          file,
          (currentFrontmatter: Record<string, unknown>) => {
            for (const key of snapshot.guardedKeys) {
              if (
                optionFrontmatterHasKey(currentFrontmatter, key) !==
                  optionFrontmatterHasKey(frontmatterAfter, key) ||
                !optionFrontmatterValuesEqual(
                  currentFrontmatter[key],
                  frontmatterAfter[key]
                )
              ) {
                throw new Error(
                  `Cannot safely roll back ${file.path}: note identity changed`
                );
              }
            }
            const changedKeys = new Set([
              ...Object.keys(frontmatterBefore),
              ...Object.keys(frontmatterAfter),
            ]);
            const operationChangedKeys = Array.from(changedKeys).filter(
              (key) => {
                const beforeHasKey = optionFrontmatterHasKey(
                  frontmatterBefore,
                  key
                );
                const afterHasKey = optionFrontmatterHasKey(
                  frontmatterAfter,
                  key
                );
                return (
                  beforeHasKey !== afterHasKey ||
                  !optionFrontmatterValuesEqual(
                    frontmatterBefore[key],
                    frontmatterAfter[key]
                  )
                );
              }
            );
            const conflictingKeys = operationChangedKeys.filter((key) => {
              const currentHasKey = optionFrontmatterHasKey(
                currentFrontmatter,
                key
              );
              const beforeHasKey = optionFrontmatterHasKey(
                frontmatterBefore,
                key
              );
              const afterHasKey = optionFrontmatterHasKey(
                frontmatterAfter,
                key
              );
              const matchesBefore =
                currentHasKey === beforeHasKey &&
                optionFrontmatterValuesEqual(
                  currentFrontmatter[key],
                  frontmatterBefore[key]
                );
              const matchesAfter =
                currentHasKey === afterHasKey &&
                optionFrontmatterValuesEqual(
                  currentFrontmatter[key],
                  frontmatterAfter[key]
                );
              return !matchesBefore && !matchesAfter;
            });
            if (conflictingKeys.length > 0) {
              throw new Error(
                `Cannot safely roll back ${file.path}: concurrently changed frontmatter fields ${conflictingKeys.join(', ')}`
              );
            }

            for (const key of operationChangedKeys) {
              const currentHasKey = optionFrontmatterHasKey(
                currentFrontmatter,
                key
              );
              const afterHasKey = optionFrontmatterHasKey(
                frontmatterAfter,
                key
              );
              const matchesAfter =
                currentHasKey === afterHasKey &&
                optionFrontmatterValuesEqual(
                  currentFrontmatter[key],
                  frontmatterAfter[key]
                );
              if (!matchesAfter) continue;

              if (optionFrontmatterHasKey(frontmatterBefore, key)) {
                currentFrontmatter[key] = structuredClone(
                  frontmatterBefore[key]
                );
              } else {
                delete currentFrontmatter[key];
              }
            }
          }
        );
      } catch (error) {
        rollbackErrors.push(error);
      }
      try {
        
        
        await forceMetadataCacheRefresh(this.getApp(), file);
        if (snapshot.reviewNote) refreshedReviewPaths.push(file.path);
        else refreshedPaths.push(file.path);
        window.activeDocument.dispatchEvent(
          new CustomEvent(`journalit:${this.namespace}-updated`, {
            detail: { id: file.path },
          })
        );
      } catch (error) {
        rollbackErrors.push(error);
      }
    }

    if (refreshedPaths.length > 0) {
      eventBus.publish('trade:changed', {
        action: 'updated',
        filePaths: refreshedPaths,
      });
    }
    for (const filePath of refreshedReviewPaths) {
      eventBus.publish('review:changed', {
        type: 'drc',
        action: 'updated',
        filePath,
      });
    }

    if (rollbackErrors.length > 0) {
      throw new AggregateError(
        operationError === undefined
          ? rollbackErrors
          : [operationError, ...rollbackErrors],
        'Option note update failed and rollback was incomplete'
      );
    }
  }

  
  private dayTradeFieldOptionRewrite(
    type: OptionType,
    oldValue: string,
    newValue: string | null
  ): DayTradeFieldOptionRewrite | undefined {
    const fields: Partial<Record<OptionType, DayTradeSelectionField>> = {
      [OptionType.SETUP]: 'setup',
      [OptionType.MISTAKE]: 'mistake',
      [OptionType.TAG]: 'tags',
    };
    const field = fields[type];
    if (!field) return undefined;
    return {
      field,
      matches: (value) =>
        this.storedOptionValueMatches(type, field, value, oldValue),
      rewrite: (values) =>
        (
          this.rewriteOptionEntries(type, field, values, oldValue, newValue) ??
          values
        ).filter((value): value is string => typeof value === 'string'),
    };
  }

  
  private retainedDayFieldValues(
    type: OptionType,
    frontmatter: Record<string, unknown>,
    oldValue: string,
    newValue: string | null
  ): DayTradeFieldRetainedValues | undefined {
    const selectionField = getSelectionOptionField(type);
    const propertyNames =
      type === OptionType.TAG
        ? ['tags']
        : selectionField
          ? [selectionField]
          : [];
    if (!propertyNames.length) return undefined;
    const values: string[] = [];
    for (const propertyName of propertyNames) {
      const raw = frontmatter[propertyName];
      const entries: unknown[] = Array.isArray(raw) ? raw : [raw];
      const rewritten =
        this.rewriteOptionEntries(
          type,
          propertyName,
          entries,
          oldValue,
          newValue
        ) ?? entries;
      for (const entry of rewritten) {
        if (typeof entry === 'string') values.push(entry);
      }
    }
    return {
      values,
      key: selectionField
        ? (value) => selectionOptionKey(value, selectionField)
        : storedTagDedupeKey,
    };
  }

  
  private rewriteOptionEntries(
    type: OptionType,
    propertyName: string,
    entries: readonly unknown[],
    oldValue: string,
    newValue: string | null
  ): unknown[] | undefined {
    const matches = (entry: unknown): entry is string =>
      typeof entry === 'string' &&
      this.storedOptionValueMatches(type, propertyName, entry, oldValue);
    if (!entries.some(matches)) return undefined;
    const selectionField = getSelectionOptionField(type);
    const dedupeKey: ((value: string) => string) | null =
      type === OptionType.TAG
        ? storedTagDedupeKey
        : selectionField
          ? (value) => selectionOptionKey(value, selectionField)
          : null;
    const seen = new Set<string>();
    const next: unknown[] = [];
    for (const entry of entries) {
      const rewritten = matches(entry) ? newValue : entry;
      if (rewritten === null) continue;
      if (dedupeKey && typeof rewritten === 'string') {
        const key = dedupeKey(rewritten);
        if (seen.has(key)) continue;
        seen.add(key);
      }
      next.push(rewritten);
    }
    return next;
  }

  private isNoteEligibleForOptionUpdate(
    type: OptionType,
    frontmatter: Record<string, unknown>,
    filePath: string
  ): boolean {
    if (type === OptionType.TAG) {
      return (
        isTagOptionTradeEligibleNote(frontmatter, filePath) ||
        isSetupDefinitionNote(frontmatter)
      );
    }
    if (type === OptionType.SETUP) {
      return isTagOptionTradeEligibleNote(frontmatter, filePath);
    }
    return true;
  }

  private getOptionUpdatePropertyNames(
    type: OptionType,
    propertyNames: string[],
    frontmatter: Record<string, unknown>
  ): string[] {
    if (type === OptionType.SETUP && frontmatter.setup !== undefined) {
      return ['setup'];
    }
    
    if (type === OptionType.MISTAKE && frontmatter.type === 'drc') {
      return ['sessionMistakes'];
    }
    return propertyNames;
  }

  private storedOptionValueMatches(
    type: OptionType,
    propertyName: string,
    value: string,
    oldValue: string
  ): boolean {
    const candidate =
      type === OptionType.EVENT && propertyName === 'keyEvents'
        ? value.trim()
        : value;
    if (type === OptionType.TAG) {
      return storedTagValuesMatch(candidate, oldValue);
    }
    
    if (getSelectionOptionField(type)) {
      return optionValuesEqual(type, candidate, oldValue);
    }
    return this.optionValueMatches(candidate, oldValue);
  }

  private frontmatterContainsOptionValue(
    type: OptionType,
    propertyNames: string[],
    frontmatter: Record<string, unknown>,
    oldValue: string
  ): boolean {
    return propertyNames.some((propertyName) => {
      const value = frontmatter[propertyName];
      if (
        type === OptionType.EVENT &&
        propertyName === 'keyEvents' &&
        Array.isArray(value)
      ) {
        return value.some((entry) => {
          const eventValue = asRecord(entry)?.event;
          return (
            typeof eventValue === 'string' &&
            this.storedOptionValueMatches(
              type,
              propertyName,
              eventValue,
              oldValue
            )
          );
        });
      }
      if (Array.isArray(value)) {
        return value.some(
          (entry) =>
            typeof entry === 'string' &&
            this.storedOptionValueMatches(type, propertyName, entry, oldValue)
        );
      }
      return (
        typeof value === 'string' &&
        this.storedOptionValueMatches(type, propertyName, value, oldValue)
      );
    });
  }

  private assertOptionRewriteFrontmatter(
    type: OptionType,
    frontmatter: Record<string, unknown>,
    filePath: string
  ): void {
    if (
      type === OptionType.SETUP &&
      isTagOptionTradeEligibleNote(frontmatter, filePath)
    ) {
      const value = frontmatter.setup;
      if (
        value !== undefined &&
        value !== null &&
        typeof value !== 'string' &&
        (!Array.isArray(value) ||
          !value.every((entry) => typeof entry === 'string'))
      ) {
        throw new Error(
          'Invalid setup references. Repair the affected trade note before retrying.'
        );
      }
      return;
    }
    if (type !== OptionType.TAG || !isSetupDefinitionNote(frontmatter)) return;
    const tags = frontmatter.tags;
    if (
      tags !== undefined &&
      (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string'))
    ) {
      throw new Error(
        `Invalid setup tags in ${filePath}: expected an array of strings`
      );
    }
  }

  private async readCurrentOptionFrontmatter(
    file: TFile
  ): Promise<Record<string, unknown> | undefined> {
    const content = await readFileContentForMutation(this.getApp(), file);
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return undefined;
    const parsed: unknown = parseYaml(match[1]);
    if (parsed === null || parsed === undefined) return {};
    const frontmatter = asRecord(parsed);
    if (!frontmatter) {
      throw new Error(
        `Invalid frontmatter in ${file.path}: expected a mapping`
      );
    }
    return frontmatter;
  }

  private getAccountTagAlias(type: OptionType, value: string): string | null {
    return type === OptionType.ACCOUNT
      ? `${TAG_BUCKETS.ACCOUNT}/${formatTagForYAML(value)}`
      : null;
  }

  private frontmatterContainsAccountTag(
    type: OptionType,
    frontmatter: Record<string, unknown>,
    oldValue: string,
    newValue: string | null
  ): boolean {
    if (newValue === null) return false;
    const accountTag = this.getAccountTagAlias(type, oldValue);
    if (accountTag === null || !Array.isArray(frontmatter.tags)) return false;
    return new Set(frontmatter.tags).has(accountTag);
  }

  
  private async updateNotesWithOption(
    type: OptionType,
    oldValue: string,
    newValue: string | null,
    failOnError: boolean = false,
    transaction?: OptionNoteTransaction,
    
    expectNone: boolean = false
  ): Promise<number> {
    try {
      
      const folderPathService =
        this.plugin.serviceManager?.getFolderPathService();
      if (!folderPathService) {
        throw new Error('FolderPathService is unavailable');
      }
      const isJournalPath = (filePath: string): boolean =>
        folderPathService.isJournalPath(filePath);
      
      
      const galleryNotePath =
        type === OptionType.TAG
          ? resolveGalleryAnnotationNotePath(
              this.getApp().vault,
              galleryAnnotationNotePath(
                resolveJournalFolderPath(this.plugin.settings)
              )
            )
          : undefined;
      const isRewrittenPath = (filePath: string): boolean =>
        isJournalPath(filePath) || filePath === galleryNotePath;
      const files = this.getApp()
        .vault.getMarkdownFiles()
        .filter((file) => isRewrittenPath(file.path));
      const journalFolderPath = resolveJournalFolderPath(this.plugin.settings);
      const rewriteAnnotations = (
        frontmatter: Record<string, unknown>,
        filePath: string
      ) =>
        type === OptionType.TAG
          ? rewriteImageAnnotationTags(frontmatter.imageAnnotations, {
              source: oldValue,
              target: newValue ?? undefined,
              emptied: filePath === galleryNotePath ? 'remove' : 'tombstone',
            })
          : ({ changed: false } as const);

      
      
      const propertyMap: Record<string, string[]> = {
        [OptionType.INSTRUMENT]: ['instrument'],
        [OptionType.ACCOUNT]: ['account'],
        [OptionType.SETUP]: ['setup'],
        [OptionType.MISTAKE]: ['mistake'],
        [OptionType.TAG]: ['tags'],
        [OptionType.EVENT]: ['keyEvents'],
      };

      
      const propertyNames = propertyMap[type];
      if (!propertyNames || propertyNames.length === 0) {
        console.warn(`No property names defined for option type: ${type}`);
        return 0;
      }

      
      let updatedCount = 0;
      const updatedFilePaths: string[] = [];
      const updatedReviewPaths: string[] = [];
      const updatedPeriodicReviews: Array<{
        filePath: string;
        type: PeriodicReviewSourceType;
      }> = [];
      let annotationsChanged = false;
      const snapshotKeys =
        type === OptionType.SETUP
          ? [
              'setup',
              DAY_TRADE_FIELDS_KEY,
              DAY_TRADE_FIELD_SOURCES_KEY,
              ...SETUP_REFERENCE_IDENTITY_FIELDS,
            ]
          : undefined;
      
      const dayFieldRewrite = this.dayTradeFieldOptionRewrite(
        type,
        oldValue,
        newValue
      );
      const referencesDayField = (frontmatter: Record<string, unknown>) =>
        dayFieldRewrite !== undefined &&
        Object.keys(
          planDayTradeFieldOptionRewrite(frontmatter, dayFieldRewrite)
        ).length > 0;
      
      
      const pendingReparses: Promise<void>[] = [];

      
      for (const file of files) {
        if (!isRewrittenPath(file.path)) {
          continue;
        }

        let fileUpdated = false;
        let noteModified = false;
        let isDrcNote = false;
        let periodicReviewType: PeriodicReviewSourceType | undefined;
        let isTradeNote = false;
        let annotationsModified = false;
        let expectedSetupReference: Record<string, unknown> | undefined;

        try {
          const cache = this.getApp().metadataCache.getFileCache(file);
          const cachedFrontmatter = asRecord(cache?.frontmatter);
          const frontmatterRequiresUpdate = (
            frontmatter: Record<string, unknown>,
            validateCanonical: boolean
          ): boolean => {
            if (validateCanonical) {
              this.assertOptionRewriteFrontmatter(type, frontmatter, file.path);
            }
            const identityFields = getTradeIdentityFields(frontmatter);
            const needsIdentityBackfill =
              type !== OptionType.SETUP &&
              isJournalitJournalPath(file.path, journalFolderPath) &&
              isTradeIdentityEligibleNote(frontmatter, file.path) &&
              (!identityFields.tradeId || !identityFields.schemaVersion);
            const isEligibleForOptionUpdate =
              this.isNoteEligibleForOptionUpdate(type, frontmatter, file.path);
            const cachedPropertyNames = this.getOptionUpdatePropertyNames(
              type,
              propertyNames,
              frontmatter
            );
            const containsOptionValue = this.frontmatterContainsOptionValue(
              type,
              cachedPropertyNames,
              frontmatter,
              oldValue
            );
            const containsAccountTag = this.frontmatterContainsAccountTag(
              type,
              frontmatter,
              oldValue,
              newValue
            );

            return (
              needsIdentityBackfill ||
              referencesDayField(frontmatter) ||
              rewriteAnnotations(frontmatter, file.path).changed ||
              (isEligibleForOptionUpdate &&
                (containsOptionValue || containsAccountTag))
            );
          };

          const cacheRequiresUpdate = cachedFrontmatter
            ? frontmatterRequiresUpdate(cachedFrontmatter, false)
            : false;
          if (type === OptionType.SETUP) {
            const current = await this.readCurrentOptionFrontmatter(file);
            if (!current || !frontmatterRequiresUpdate(current, true)) continue;
            
            if (expectNone) throw new SetupInUseError();
            expectedSetupReference = cloneOptionFrontmatter(
              current,
              snapshotKeys
            );
          } else if (!cacheRequiresUpdate) {
            if (type !== OptionType.TAG) {
              if (cache) continue;
            } else if (
              cache &&
              !isOpenInEditor(this.getApp(), file) &&
              isMetadataCacheCurrent(this.getApp(), file)
            ) {
              continue;
            } else {
              
              
              const currentFrontmatter =
                await this.readCurrentOptionFrontmatter(file);
              if (
                !currentFrontmatter ||
                !frontmatterRequiresUpdate(currentFrontmatter, true)
              ) {
                continue;
              }
            }
          }

          if (transaction && !transaction.has(file.path)) {
            transaction.set(file.path, {
              file,
              guardedKeys:
                type === OptionType.SETUP
                  ? SETUP_REFERENCE_IDENTITY_FIELDS
                  : [],
              mutationApplied: false,
            });
          }

          const write = this.getApp().fileManager.processFrontMatter(
            file,
            (frontmatter: Record<string, unknown>) => {
              const snapshot = transaction?.get(file.path);
              if (snapshot && !snapshot.frontmatterBefore) {
                snapshot.frontmatterBefore = cloneOptionFrontmatter(
                  frontmatter,
                  snapshotKeys
                );
              }
              this.assertOptionRewriteFrontmatter(type, frontmatter, file.path);
              if (
                expectedSetupReference &&
                !optionFrontmatterValuesEqual(
                  expectedSetupReference,
                  cloneOptionFrontmatter(frontmatter, snapshotKeys)
                )
              ) {
                throw new Error(
                  'Setup references changed during the update. Review them before retrying.'
                );
              }
              let identityBackfilled = false;
              if (
                type !== OptionType.SETUP &&
                isJournalitJournalPath(file.path, journalFolderPath) &&
                isTradeIdentityEligibleNote(frontmatter, file.path)
              ) {
                const identityResult =
                  ensureTradeIdentityFrontmatter(frontmatter);
                identityBackfilled = identityResult.changed;
              }

              const reviewSource =
                typeof frontmatter.type === 'string' &&
                isReviewNoteType(frontmatter.type)
                  ? REVIEW_TYPE_TO_SOURCE[frontmatter.type]
                  : undefined;
              isDrcNote = reviewSource === 'drc';
              periodicReviewType =
                reviewSource === 'drc' ? undefined : reviewSource;
              if (snapshot) snapshot.reviewNote = isDrcNote;
              const recordChange = (modified: boolean) => {
                if (modified) {
                  noteModified = true;
                }

                if (modified || identityBackfilled) {
                  fileUpdated = true;
                  if (snapshot) {
                    snapshot.mutationApplied = true;
                    snapshot.frontmatterAfter = cloneOptionFrontmatter(
                      frontmatter,
                      snapshotKeys
                    );
                  }
                }
              };

              
              
              let modified =
                dayFieldRewrite !== undefined &&
                applyDayTradeFieldOptionWrites(
                  frontmatter,
                  planDayTradeFieldOptionRewrite(
                    frontmatter,
                    dayFieldRewrite,
                    isDrcNote
                      ? undefined
                      : this.retainedDayFieldValues(
                          type,
                          frontmatter,
                          oldValue,
                          newValue
                        )
                  )
                );

              const annotations = rewriteAnnotations(frontmatter, file.path);
              if (annotations.changed) {
                if (annotations.value === undefined) {
                  delete frontmatter.imageAnnotations;
                } else {
                  frontmatter.imageAnnotations = annotations.value;
                }
                annotationsModified = true;
                modified = true;
              }

              isTradeNote = this.isNoteEligibleForOptionUpdate(
                type,
                frontmatter,
                file.path
              );
              if (!isTradeNote) {
                recordChange(modified);
                return;
              }

              const updatePropertyNames = this.getOptionUpdatePropertyNames(
                type,
                propertyNames,
                frontmatter
              );

              for (const propName of updatePropertyNames) {
                if (propName === 'keyEvents' && type === OptionType.EVENT) {
                  const keyEvents = frontmatter[propName];

                  if (Array.isArray(keyEvents)) {
                    for (const entry of keyEvents) {
                      const entryRecord = asRecord(entry);
                      if (entryRecord) {
                        const eventValue =
                          typeof entryRecord.event === 'string'
                            ? entryRecord.event.trim()
                            : '';
                        if (
                          eventValue &&
                          this.storedOptionValueMatches(
                            type,
                            propName,
                            eventValue,
                            oldValue
                          )
                        ) {
                          entryRecord.event = newValue;
                          modified = true;
                        }
                      }
                    }
                  } else if (typeof keyEvents === 'string') {
                    if (
                      this.storedOptionValueMatches(
                        type,
                        propName,
                        keyEvents,
                        oldValue
                      )
                    ) {
                      frontmatter[propName] = newValue;
                      modified = true;
                    }
                  }

                  continue;
                }

                const value = frontmatter[propName];
                if (Array.isArray(value)) {
                  const updatedValues = this.rewriteOptionEntries(
                    type,
                    propName,
                    value as unknown[],
                    oldValue,
                    newValue
                  );
                  if (updatedValues) {
                    frontmatter[propName] = updatedValues;
                    modified = true;
                  }
                } else if (typeof value === 'string') {
                  if (
                    this.storedOptionValueMatches(
                      type,
                      propName,
                      value,
                      oldValue
                    )
                  ) {
                    frontmatter[propName] =
                      newValue === null &&
                      (type === OptionType.SETUP || type === OptionType.TAG)
                        ? []
                        : newValue;
                    modified = true;
                  }
                }
              }

              if (
                type === OptionType.ACCOUNT &&
                newValue !== null &&
                Array.isArray(frontmatter.tags)
              ) {
                const oldTag = this.getAccountTagAlias(type, oldValue);
                const newTag = this.getAccountTagAlias(type, newValue);
                let tagsChanged = false;

                const updatedTags = frontmatter.tags.map((tag: string) => {
                  if (oldTag !== null && tag === oldTag) {
                    tagsChanged = true;
                    return newTag ?? tag;
                  }
                  return tag;
                });

                if (tagsChanged) {
                  frontmatter.tags = updatedTags;
                  modified = true;
                }
              }

              recordChange(modified);
            }
          );
          const reparsed = waitForMetadataReparse(
            this.getApp(),
            file,
            100,
            write
          );
          await write;

          if (fileUpdated) {
            pendingReparses.push(reparsed);

            
            const event = new CustomEvent(
              `journalit:${this.namespace}-updated`,
              {
                detail: { id: file.path },
              }
            );
            window.activeDocument.dispatchEvent(event);

            if (noteModified) {
              updatedCount++;
            }
            if (annotationsModified) annotationsChanged = true;
            
            
            
            if (isDrcNote) updatedReviewPaths.push(file.path);
            else if (periodicReviewType)
              updatedPeriodicReviews.push({
                filePath: file.path,
                type: periodicReviewType,
              });
            else if (isTradeNote || !annotationsModified)
              updatedFilePaths.push(file.path);

            
            if (
              type === OptionType.INSTRUMENT &&
              noteModified &&
              newValue !== null
            ) {
              await this.updateFileNameForInstrument(file, oldValue, newValue);
            }
          }
        } catch (error) {
          console.error(`Error processing file ${file.path}:`, error);
          if (failOnError) throw error;
          
        }
      }

      await Promise.all(pendingReparses);
      if (updatedFilePaths.length > 0) {
        eventBus.publish('trade:changed', {
          action: 'updated',
          filePaths: updatedFilePaths,
        });
      }
      for (const filePath of updatedReviewPaths) {
        eventBus.publish('review:changed', {
          type: 'drc',
          action: 'updated',
          filePath,
        });
      }
      for (const review of updatedPeriodicReviews) {
        eventBus.publish('review:changed', {
          type: review.type,
          action: 'updated',
          filePath: review.filePath,
        });
      }
      if (annotationsChanged) eventBus.publish('image-gallery:changed');

      return updatedCount;
    } catch (error) {
      console.error('Error updating notes with new option value:', error);
      if (failOnError) throw error;
      return 0;
    }
  }

  
  private optionValueMatches(value: string, optionValue: string): boolean {
    return value.toLowerCase() === optionValue.toLowerCase();
  }

  
  private async updateFileNameForInstrument(
    file: TFile,
    oldTicker: string,
    newTicker: string
  ): Promise<void> {
    try {
      
      
      const oldTickerPart = this.extractTickerPart(oldTicker);
      const newTickerPart = this.extractTickerPart(newTicker);

      
      const sanitizedOldTicker = this.sanitizeTickerForFilename(oldTickerPart);
      const sanitizedNewTicker = this.sanitizeTickerForFilename(newTickerPart);

      

      
      const pathParts = file.path.split('/');
      const filename = pathParts.pop() || '';
      const parentPath = pathParts.join('/');

      
      
      if (!filename.match(/^[A-Z0-9-]+-[0-9]{6}-T\d+\.md$/)) {
        
        return;
      }

      
      if (!filename.startsWith(`${sanitizedOldTicker}-`)) {
        
        return;
      }

      
      const newFilename = filename.replace(
        new RegExp(`^${sanitizedOldTicker}-`),
        `${sanitizedNewTicker}-`
      );
      const newPath = `${parentPath}/${newFilename}`;

      if (newPath === file.path) {
        
        return;
      }

      

      
      await this.getApp().fileManager.renameFile(file, newPath);
      
    } catch (error) {
      console.error(`Error updating filename for '${file.path}':`, error);
    }
  }

  
  private extractTickerPart(instrument: string): string {
    
    if (!instrument) return '';

    
    const tickerMatch = instrument.match(/^([A-Z0-9.^-]+)(?:\s+-\s+|$)/);
    if (tickerMatch && tickerMatch[1]) {
      return tickerMatch[1].trim();
    }

    
    return instrument;
  }

  
  private sanitizeTickerForFilename(ticker: string): string {
    if (!ticker) return 'UNKNOWN';

    
    let sanitized = ticker.trim().toUpperCase();

    
    sanitized = sanitized
      .replace(/[\\/:*?"<>|+]/g, '') 
      .replace(/[\s.[\](){}#%&=;]/g, '-') 
      .replace(/--+/g, '-') 
      .replace(/^-|-$/g, ''); 

    
    if (!sanitized) return 'UNKNOWN';

    
    const MAX_TICKER_LENGTH = 20;
    if (sanitized.length > MAX_TICKER_LENGTH) {
      sanitized = sanitized.substring(0, MAX_TICKER_LENGTH);
    }

    return sanitized;
  }

  
  private getApp() {
    return this.plugin.app;
  }

  private getInitialInstrumentOptions(): InstrumentData[] {
    return INITIAL_DEFAULT_OPTIONS[OptionType.INSTRUMENT].map(
      cloneInstrumentOption
    );
  }

  private getInitialEventOptions(): EventOptionData[] {
    return INITIAL_DEFAULT_OPTIONS[OptionType.EVENT].map(cloneEventOption);
  }

  private getInitialStringOptionsForType(
    type:
      | OptionType.ACCOUNT
      | OptionType.ACCOUNT_TYPE
      | OptionType.MISTAKE
      | OptionType.TAG
  ): string[] {
    return [...INITIAL_DEFAULT_OPTIONS[type]];
  }

  
  public async clearOptions(type: StoredOptionType): Promise<number> {
    return this.enqueueOptionMutation(() => this.clearOptionsInternal(type));
  }

  private async clearOptionsInternal(type: StoredOptionType): Promise<number> {
    const count = this.options[type].length;

    if (count === 0) {
      return 0;
    }

    this.options[type] = [];
    if (type === OptionType.TAG) {
      this.options.tagColors = {};
    }

    
    await this.saveOptions();

    
    this.notifyOptionsChanged();

    return count;
  }

  
  public async resetOptionsToDefaults(
    type: StoredOptionType
  ): Promise<boolean> {
    return this.enqueueOptionMutation(() =>
      this.resetOptionsToDefaultsInternal(type)
    );
  }

  private async resetOptionsToDefaultsInternal(
    type: StoredOptionType
  ): Promise<boolean> {
    const currentOptions = this.options[type];
    const defaultOptions =
      type === OptionType.INSTRUMENT
        ? this.getInitialInstrumentOptions()
        : type === OptionType.EVENT
          ? this.getInitialEventOptions()
          : this.getInitialStringOptionsForType(type);
    const didChange =
      JSON.stringify(currentOptions) !== JSON.stringify(defaultOptions) ||
      (type === OptionType.TAG &&
        Object.keys(this.options.tagColors).length > 0);

    if (!didChange) {
      return false;
    }

    switch (type) {
      case OptionType.INSTRUMENT:
        this.options[OptionType.INSTRUMENT] =
          this.getInitialInstrumentOptions();
        break;
      case OptionType.EVENT:
        this.options[OptionType.EVENT] = this.getInitialEventOptions();
        break;
      case OptionType.ACCOUNT:
      case OptionType.ACCOUNT_TYPE:
      case OptionType.MISTAKE:
      case OptionType.TAG:
        this.options[type] = this.getInitialStringOptionsForType(type);
        if (type === OptionType.TAG) {
          this.options.tagColors = {};
        }
        break;
    }

    await this.saveOptions();

    
    this.notifyOptionsChanged();

    return true;
  }

  
  public async resetAllOptions(): Promise<void> {
    return this.enqueueOptionMutation(() => this.resetAllOptionsInternal());
  }

  private async resetAllOptionsInternal(): Promise<void> {
    this.options = {
      [OptionType.INSTRUMENT]: this.getInitialInstrumentOptions(),
      [OptionType.ACCOUNT]: this.getInitialStringOptionsForType(
        OptionType.ACCOUNT
      ),
      [OptionType.ACCOUNT_TYPE]: this.getInitialStringOptionsForType(
        OptionType.ACCOUNT_TYPE
      ),
      [OptionType.MISTAKE]: this.getInitialStringOptionsForType(
        OptionType.MISTAKE
      ),
      [OptionType.TAG]: this.getInitialStringOptionsForType(OptionType.TAG),
      [OptionType.EVENT]: this.getInitialEventOptions(),
      tagColors: {},
    };
    await this.saveOptions();

    
    this.notifyOptionsChanged();
  }

  
  public async reloadOptions(): Promise<void> {
    return this.enqueueOptionMutation(() => this.loadOptions());
  }

  
  private async initializeDefaultOptionsIfNeeded(): Promise<void> {
    try {
      let optionsAdded = false; 
      const pluginInstance = this.plugin;
      const settingsRecord = asRecord(pluginInstance.settings);
      const initializedOptionTypes = settingsRecord?.initializedOptionTypes;
      const initializedTypes: string[] = Array.isArray(initializedOptionTypes)
        ? initializedOptionTypes.filter(
            (value): value is string => typeof value === 'string'
          )
        : [];
      const newlyInitializedTypes: string[] = [];
      const initializedTypeSet = new Set(initializedTypes);

      for (const type of STORED_OPTION_TYPES) {
        if (
          this.options[type].length === 0 &&
          INITIAL_DEFAULT_OPTIONS[type].length > 0 &&
          !initializedTypeSet.has(type)
        ) {
          optionsAdded = true; 
          

          if (type === OptionType.EVENT) {
            
            const defaultEvents = INITIAL_DEFAULT_OPTIONS[OptionType.EVENT];
            const existingEventNames = new Set(
              this.options[OptionType.EVENT].map((opt) =>
                opt.name.toLowerCase()
              )
            );
            for (const eventOption of defaultEvents) {
              
              
              const normalizedEventName = eventOption.name.toLowerCase();
              if (!existingEventNames.has(normalizedEventName)) {
                
                this.options[OptionType.EVENT].push({
                  name: eventOption.name,
                  color: eventOption.color || 'gray',
                });
                existingEventNames.add(normalizedEventName);
              }
            }
            newlyInitializedTypes.push(type);
          } else if (type === OptionType.INSTRUMENT) {
            
            const defaultInstruments =
              INITIAL_DEFAULT_OPTIONS[OptionType.INSTRUMENT];
            const existingInstrumentNames = new Set(
              this.options[OptionType.INSTRUMENT].map((opt) =>
                opt.name.toLowerCase()
              )
            );
            for (const instrument of defaultInstruments) {
              
              const normalizedInstrumentName = instrument.name.toLowerCase();
              if (!existingInstrumentNames.has(normalizedInstrumentName)) {
                
                this.options[OptionType.INSTRUMENT].push({
                  name: instrument.name,
                  assetType: instrument.assetType,
                  futuresData: instrument.futuresData, 
                });
                existingInstrumentNames.add(normalizedInstrumentName);
              }
            }
            newlyInitializedTypes.push(type);
          } else {
            
            const defaultOptions = INITIAL_DEFAULT_OPTIONS[type];
            
            this.options[type] = [...this.options[type], ...defaultOptions];
            newlyInitializedTypes.push(type);
          }
        }
      }
      
      if (optionsAdded) {
        await this.saveOptions();

        
        if (
          newlyInitializedTypes.length > 0 &&
          settingsRecord &&
          pluginInstance.saveSettings
        ) {
          const existingRaw = settingsRecord.initializedOptionTypes;
          const existing: string[] = Array.isArray(existingRaw)
            ? existingRaw.filter(
                (value): value is string => typeof value === 'string'
              )
            : [];

          settingsRecord.initializedOptionTypes = [
            ...new Set([...existing, ...newlyInitializedTypes]),
          ];

          await pluginInstance.saveSettings();
        }
      }
    } catch (error) {
      console.error('Failed to initialize default options:', error);
    }
  }

  
  public notifyOptionsChanged(
    payload?: Partial<Omit<OptionsChangedPayload, 'timestamp' | 'namespace'>>
  ): void {
    try {
      
      
      const eventPayload: OptionsChangedPayload = {
        ...(payload ?? {}),
        timestamp: Date.now(),
      };

      if (this.namespace) {
        eventPayload.namespace = this.namespace;
      }

      eventBus.publish('options:changed', eventPayload);

      
    } catch (error) {
      console.error('Failed to publish options changed event:', error);
    }
  }

  
  public getEventOptionByName(name: string): EventOptionData | undefined {
    const cleanName = name.trim().toLowerCase();
    return this.options[OptionType.EVENT].find(
      (option) => option.name.toLowerCase() === cleanName
    );
  }

  
  public getNamespace(): string {
    return this.namespace;
  }

  
  public async setNamespace(namespace: string): Promise<void> {
    return this.enqueueOptionMutation(() =>
      this.setNamespaceInternal(namespace)
    );
  }

  private async setNamespaceInternal(namespace: string): Promise<void> {
    
    if (this.namespace === namespace) {
      return;
    }

    

    
    this.namespace = namespace;

    
    this.options = { ...DEFAULT_OPTIONS_DATA };

    
    await this.loadOptions();

    
    this.notifyOptionsChanged();
  }
}
