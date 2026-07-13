import { logger } from '../../utils/logger';


import { App, TFile } from 'obsidian';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import {
  normalizedEquals,
  deduplicateOptions,
  normalizeOptionKey,
} from '../../utils/stringNormalization';
import { TAG_BUCKETS, formatTagForYAML } from '../../utils/tagSchema';
import {
  ensureTradeIdentityFrontmatter,
  isTradeIdentityEligibleNote,
} from '../../utils/tradeIdentity';
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';
import { eventBus, OptionsChangedPayload } from '../events';
import { LabelColor, normalizeLabelColor } from '../../types/labelColor';

interface PluginWithSettings {
  app: App;
  
  
  
  settings?: unknown;
  loadData(): Promise<unknown>;
  saveData(data: unknown): Promise<void>;
  saveSettings?: () => Promise<void>;
}

function normalizeFrontmatterTagValues(value: unknown): string[] {
  const values = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? [value]
      : [];
  return deduplicateOptions(
    values.flatMap((entry) => {
      if (typeof entry !== 'string') return [];
      const trimmed = entry.trim();
      return trimmed ? [trimmed] : [];
    })
  );
}

function isTradeOptionUpdateEligibleNote(
  frontmatter: Record<string, unknown>,
  filePath: string
): boolean {
  if (isTradeIdentityEligibleNote(frontmatter, filePath)) {
    return true;
  }

  return (
    inferStoredTradeType({
      filePath,
      type: frontmatter.type,
      isMissedTrade:
        frontmatter.isMissedTrade === true ||
        frontmatter.isMissedTrade === 'true',
      isBacktestTrade: frontmatter.isBacktestTrade,
    }) === 'missed'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
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

function normalizeStringOptions(value: unknown): string[] {
  return deduplicateOptions(
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : []
  );
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
  [OptionType.SETUP]: string[];
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
  [OptionType.SETUP]: [],
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
    { name: 'EURUSD', assetType: 'forex' },
  ],
  [OptionType.ACCOUNT]: [],
  [OptionType.ACCOUNT_TYPE]: ['Demo', 'Evaluation', 'Funded', 'Archived'],
  [OptionType.SETUP]: ['Breakout Setup', 'Reversal Pattern'],
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


export class CustomOptionsService {
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

  
  constructor(plugin: PluginWithSettings, config?: CustomOptionsServiceConfig) {
    this.plugin = plugin;

    
    if (config?.namespace) {
      this.namespace = config.namespace;
    }

    
    void this.loadOptions();

    
    void this.initializeDefaultOptionsIfNeeded();

    
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

  private getPersistedOptions(): CustomOptionsData {
    return {
      ...this.options,
      tagColors: { ...this.options.tagColors },
    };
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
    this.options[OptionType.SETUP] = normalizeStringOptions(
      loadedOptions[OptionType.SETUP]
    );
    this.options[OptionType.MISTAKE] = normalizeStringOptions(
      loadedOptions[OptionType.MISTAKE]
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
            
            void this.initializeDefaultOptionsIfNeeded();

            
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
    let removedCount = 0;

    const typesToClean = [
      OptionType.TAG,
      OptionType.MISTAKE,
      OptionType.SETUP,
      OptionType.ACCOUNT,
      OptionType.ACCOUNT_TYPE,
    ];

    for (const type of typesToClean) {
      
      if (type === OptionType.EVENT) continue;

      
      if (type === OptionType.INSTRUMENT) continue;

      const options = this.options[type];
      const originalCount = options.length;

      
      const cleaned = deduplicateOptions(options);

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

  
  private async saveOptions(): Promise<void> {
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
    }
  }

  
  public getOptions(type: OptionType): string[] {
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

  public getUserDefinedSetupOptions(): string[] {
    const shippedDefaults = new Set(
      INITIAL_DEFAULT_OPTIONS[OptionType.SETUP].map((option) =>
        option.toLowerCase()
      )
    );
    return this.options[OptionType.SETUP].filter(
      (option) => !shippedDefaults.has(option.toLowerCase())
    );
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
    type: OptionType,
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

    
    const cleanValue = value.trim();

    
    if (!cleanValue) {
      return false;
    }

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
        normalizedEquals(option, cleanValue)
      );

      if (exists) {
        return false;
      }

      
      this.options[type] = [...this.options[type], cleanValue];

      if (type === OptionType.ACCOUNT_TYPE) {
        this.appendAccountTypeToDashboardOrder(cleanValue);
      }
    }

    
    await this.saveOptions();

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
    type: OptionType,
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
          normalizedEquals(existing, trimmed)
        );
      });

      
      const uniqueValues = deduplicateOptions(filteredValues);

      if (!uniqueValues.length) {
        return 0;
      }

      
      this.options[type] = [...this.options[type], ...uniqueValues];

      
      await this.saveOptions();

      return uniqueValues.length;
    }
  }

  
  public async removeOption(type: OptionType, value: string): Promise<boolean> {
    
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
      if (type === OptionType.TAG) {
        const colorKey = Object.keys(this.options.tagColors).find((key) =>
          normalizedEquals(key, value)
        );
        if (colorKey) delete this.options.tagColors[colorKey];
      }

      if (type === OptionType.ACCOUNT_TYPE) {
        this.removeAccountTypeFromDashboardOrder(value);
      }

      
      await this.saveOptions();

      
      
      await new Promise((resolve) => window.setTimeout(resolve, 200));

      
      this.notifyOptionsChanged();
    } else {
      console.warn(
        `Failed to remove option '${value}' from ${type} - option not found`
      );
    }

    return removed;
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

    
    let updatedNotes = 0;
    if (updateNotes && identityChanged) {
      updatedNotes = await this.updateNotesWithOption(
        OptionType.INSTRUMENT,
        oldName,
        cleanNewName
      );
    }

    const hasValidSpecs =
      (assetType === 'futures' &&
        this.hasValidFuturesSpecs(updatedInstrument.futuresData)) ||
      (assetType === 'forex' &&
        this.hasValidForexSpecs(updatedInstrument.forexData)) ||
      (assetType === 'cfd' && this.hasValidCfdSpecs(updatedInstrument.cfdData));

    const shouldApplyToTrades =
      hasValidSpecs && specsChanged && (!identityChanged || updateNotes);

    this.notifyOptionsChanged({
      optionType: OptionType.INSTRUMENT,
      action: 'updated',
      instrument: cleanNewName,
      assetType,
      applyToTrades: shouldApplyToTrades,
    });
    return { success: true, updatedNotes };
  }

  
  public async updateOption(
    type: OptionType,
    oldValue: string,
    newValue: string,
    updateNotes: boolean = false
  ): Promise<{ success: boolean; updatedNotes?: number }> {
    const cleanNewValue = newValue.trim();

    
    if (!cleanNewValue) {
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

        if (type === OptionType.TAG) {
          const colorKey = Object.keys(this.options.tagColors).find((key) =>
            normalizedEquals(key, oldValue)
          );
          if (colorKey) {
            const color = this.options.tagColors[colorKey];
            delete this.options.tagColors[colorKey];
            this.options.tagColors[cleanNewValue] = color;
          }
        }

        if (type === OptionType.ACCOUNT_TYPE) {
          this.replaceAccountTypeInDashboardOrder(oldValue, cleanNewValue);
        }

        success = true;
      }
    }

    if (!success) return { success: false };

    
    await this.saveOptions();

    
    let updatedNotes = 0;
    if (updateNotes) {
      updatedNotes = await this.updateNotesWithOption(type, oldValue, newValue);
    }

    this.notifyOptionsChanged(); 
    return { success: true, updatedNotes };
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

    const updatedNotes = await this.updateNotesWithOption(
      type,
      oldValue,
      cleanNewValue
    );
    this.notifyOptionsChanged();
    return updatedNotes;
  }

  public async removeOptionValueFromNotes(
    type: OptionType,
    value: string
  ): Promise<number> {
    if (type !== OptionType.SETUP) {
      throw new Error(
        'Removing note option values is only supported for setups'
      );
    }
    const updatedNotes = await this.updateNotesWithOption(
      type,
      value,
      null,
      true
    );
    this.notifyOptionsChanged();
    return updatedNotes;
  }

  
  private async updateNotesWithOption(
    type: OptionType,
    oldValue: string,
    newValue: string | null,
    failOnError: boolean = false
  ): Promise<number> {
    try {
      
      const files = this.getApp().vault.getMarkdownFiles();
      const generalSettings = asRecord(asRecord(this.plugin.settings)?.general);
      const configuredJournalFolderPath = generalSettings?.journalFolderPath;
      const journalFolderPath =
        typeof configuredJournalFolderPath === 'string' &&
        configuredJournalFolderPath.length > 0
          ? configuredJournalFolderPath
          : '!Journalit';
      const isJournalPath = (filePath: string): boolean => {
        const normalizedPath = filePath.replace(/\\/g, '/');
        const normalizedJournalFolder = journalFolderPath
          .replace(/\\/g, '/')
          .replace(/^\/+|\/+$/g, '');
        if (normalizedPath.includes('-backup-')) return false;
        return (
          normalizedPath === normalizedJournalFolder ||
          normalizedPath.startsWith(`${normalizedJournalFolder}/`)
        );
      };

      
      
      const propertyMap: Record<string, string[]> = {
        [OptionType.INSTRUMENT]: ['instrument'],
        [OptionType.ACCOUNT]: ['account'],
        [OptionType.SETUP]: ['setup'],
        [OptionType.MISTAKE]: ['mistake'],
        [OptionType.TAG]: ['tags', 'customTags'],
        [OptionType.EVENT]: ['keyEvents'],
      };

      
      const propertyNames = propertyMap[type];
      if (!propertyNames || propertyNames.length === 0) {
        console.warn(`No property names defined for option type: ${type}`);
        return 0;
      }

      
      let updatedCount = 0;
      const updatedFilePaths: string[] = [];

      
      for (const file of files) {
        if (
          (type === OptionType.TAG || type === OptionType.SETUP) &&
          !isJournalPath(file.path)
        ) {
          continue;
        }

        let fileUpdated = false;
        let noteModified = false;

        try {
          const cache = this.getApp().metadataCache.getFileCache(file);
          if (cache && !cache.frontmatter) {
            continue;
          }

          await this.getApp().fileManager.processFrontMatter(
            file,
            (frontmatter: Record<string, unknown>) => {
              let identityBackfilled = false;
              if (
                isJournalPath(file.path) &&
                isTradeIdentityEligibleNote(frontmatter, file.path)
              ) {
                const identityResult =
                  ensureTradeIdentityFrontmatter(frontmatter);
                identityBackfilled = identityResult.changed;
              }

              if (
                (type === OptionType.TAG || type === OptionType.SETUP) &&
                !isTradeOptionUpdateEligibleNote(frontmatter, file.path)
              ) {
                return;
              }

              let modified = false;
              const updatePropertyNames =
                type === OptionType.SETUP && frontmatter.setup !== undefined
                  ? ['setup']
                  : propertyNames;

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
                          this.optionValueMatches(eventValue, oldValue)
                        ) {
                          entryRecord.event = newValue;
                          modified = true;
                        }
                      }
                    }
                  } else if (typeof keyEvents === 'string') {
                    if (this.optionValueMatches(keyEvents, oldValue)) {
                      frontmatter[propName] = newValue;
                      modified = true;
                    }
                  }

                  continue;
                }

                const value = frontmatter[propName];
                if (Array.isArray(value)) {
                  let changed = false;
                  const valueEntries = value as unknown[];
                  const updatedValues = valueEntries.flatMap((entry) => {
                    if (
                      typeof entry === 'string' &&
                      this.optionValueMatches(entry, oldValue)
                    ) {
                      changed = true;
                      return newValue === null ? [] : [newValue];
                    }
                    return [entry];
                  });

                  if (changed) {
                    frontmatter[propName] = updatedValues;
                    modified = true;
                  }
                } else if (typeof value === 'string') {
                  if (this.optionValueMatches(value, oldValue)) {
                    frontmatter[propName] =
                      newValue === null && type === OptionType.SETUP
                        ? []
                        : newValue;
                    modified = true;
                  }
                }
              }

              if (type === OptionType.TAG) {
                const hasLegacyCustomTags = 'customTags' in frontmatter;

                if (hasLegacyCustomTags) {
                  frontmatter.tags = deduplicateOptions([
                    ...normalizeFrontmatterTagValues(frontmatter.tags),
                    ...normalizeFrontmatterTagValues(frontmatter.customTags),
                  ]);
                  frontmatter.customTags = undefined;
                  modified = true;
                }
              }

              if (
                type === OptionType.ACCOUNT &&
                newValue !== null &&
                Array.isArray(frontmatter.tags)
              ) {
                const oldTag = `${TAG_BUCKETS.ACCOUNT}/${formatTagForYAML(
                  oldValue
                )}`;
                const newTag = `${TAG_BUCKETS.ACCOUNT}/${formatTagForYAML(
                  newValue
                )}`;
                let tagsChanged = false;

                const updatedTags = frontmatter.tags.map((tag: string) => {
                  if (tag === oldTag) {
                    tagsChanged = true;
                    return newTag;
                  }
                  return tag;
                });

                if (tagsChanged) {
                  frontmatter.tags = updatedTags;
                  modified = true;
                }
              }

              if (modified) {
                noteModified = true;
              }

              if (modified || identityBackfilled) {
                fileUpdated = true;
              }
            }
          );

          if (fileUpdated) {
            
            await forceMetadataCacheRefresh(this.getApp(), file);

            
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

      if (updatedFilePaths.length > 0) {
        eventBus.publish('trade:changed', {
          action: 'updated',
          filePaths: updatedFilePaths,
        });
      }

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
      | OptionType.SETUP
      | OptionType.MISTAKE
      | OptionType.TAG
  ): string[] {
    return [...INITIAL_DEFAULT_OPTIONS[type]];
  }

  
  public async clearOptions(type: OptionType): Promise<number> {
    const count = this.options[type].length;

    if (count === 0) {
      return 0;
    }

    this.options[type] = [];
    if (type === OptionType.TAG) {
      this.options.tagColors = {};
    }

    
    await this.saveOptions();

    
    
    await new Promise((resolve) => window.setTimeout(resolve, 200));

    
    this.notifyOptionsChanged();

    return count;
  }

  
  public async resetOptionsToDefaults(type: OptionType): Promise<boolean> {
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
      case OptionType.SETUP:
      case OptionType.MISTAKE:
      case OptionType.TAG:
        this.options[type] = this.getInitialStringOptionsForType(type);
        if (type === OptionType.TAG) {
          this.options.tagColors = {};
        }
        break;
    }

    await this.saveOptions();

    
    
    await new Promise((resolve) => window.setTimeout(resolve, 200));

    
    this.notifyOptionsChanged();

    return true;
  }

  
  public async resetAllOptions(): Promise<void> {
    this.options = {
      [OptionType.INSTRUMENT]: this.getInitialInstrumentOptions(),
      [OptionType.ACCOUNT]: this.getInitialStringOptionsForType(
        OptionType.ACCOUNT
      ),
      [OptionType.ACCOUNT_TYPE]: this.getInitialStringOptionsForType(
        OptionType.ACCOUNT_TYPE
      ),
      [OptionType.SETUP]: this.getInitialStringOptionsForType(OptionType.SETUP),
      [OptionType.MISTAKE]: this.getInitialStringOptionsForType(
        OptionType.MISTAKE
      ),
      [OptionType.TAG]: this.getInitialStringOptionsForType(OptionType.TAG),
      [OptionType.EVENT]: this.getInitialEventOptions(),
      tagColors: {},
    };
    await this.saveOptions();

    
    
    await new Promise((resolve) => window.setTimeout(resolve, 200));

    
    this.notifyOptionsChanged();
  }

  
  public async reloadOptions(): Promise<void> {
    await this.loadOptions();
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

      for (const type of Object.values(OptionType)) {
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
    
    if (this.namespace === namespace) {
      return;
    }

    

    
    this.namespace = namespace;

    
    this.options = { ...DEFAULT_OPTIONS_DATA };

    
    await this.loadOptions();

    
    this.notifyOptionsChanged();
  }
}
