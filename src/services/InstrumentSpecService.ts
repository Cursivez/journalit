

import {
  FUTURES_SPECS,
  FOREX_SPECS,
  FuturesSpec,
  ForexSpec,
} from '../data/instrumentSpecs';
import { extractBaseSymbol } from '../utils/symbolNormalizer';
import type JournalitPlugin from '../main';
import type { SymbolMapping } from '../settings/types';
import { eventBus, Unsubscribe } from './events';


interface CfdSpec {
  contractSize: number;
  name?: string;
}

type InstrumentSpecs = FuturesSpec | ForexSpec | CfdSpec;


export class InstrumentSpecService {
  private plugin: JournalitPlugin;
  private customMappings: Map<string, string>;
  
  private customInstrumentsCache: Map<string, any>;
  
  private unsubscribeOptions?: Unsubscribe;

  
  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
    this.customMappings = new Map<string, string>();
    this.customInstrumentsCache = new Map<string, any>();

    
    this.unsubscribeOptions = eventBus.subscribe('options:changed', () => {
      this.refreshCustomInstrumentsCache();
    });
  }

  
  public dispose(): void {
    this.unsubscribeOptions?.();
    this.customMappings.clear();
    this.customInstrumentsCache.clear();
  }

  
  public loadMappings(): void {
    const symbolMappings: SymbolMapping[] =
      this.plugin.settings.symbolMappings || [];

    
    this.customMappings.clear();

    
    for (const mapping of symbolMappings) {
      this.customMappings.set(
        mapping.importedSymbol.toUpperCase(),
        mapping.baseSymbol.toUpperCase()
      );
    }

    
    this.customInstrumentsCache.clear();

    const customOptions = this.plugin.optionsService?.getAllOptions?.();
    const customInstruments = customOptions?.instrument || [];
    for (const inst of customInstruments) {
      const key = `${inst.name.toUpperCase()}_${inst.assetType}`;
      this.customInstrumentsCache.set(key, inst);
    }
  }

  
  public refreshCustomInstrumentsCache(): void {
    this.customInstrumentsCache.clear();

    const customOptions = this.plugin.optionsService?.getAllOptions?.();
    const customInstruments = customOptions?.instrument || [];
    for (const inst of customInstruments) {
      const key = `${inst.name.toUpperCase()}_${inst.assetType}`;
      this.customInstrumentsCache.set(key, inst);
    }
  }

  
  public getSpecsForSymbol(
    symbol: string,
    assetType: string
  ): InstrumentSpecs | null {
    if (!symbol || !assetType) {
      return null;
    }

    const upperSymbol = symbol.toUpperCase();

    
    
    const cacheKey = `${upperSymbol}_${assetType}`;
    const customInstrument = this.customInstrumentsCache.get(cacheKey);

    if (customInstrument) {
      
      if (assetType === 'futures' && customInstrument.futuresData) {
        const futuresData = customInstrument.futuresData;
        
        if (
          futuresData.dollarPerPoint &&
          futuresData.dollarPerPoint > 0 &&
          futuresData.tickSize &&
          futuresData.tickSize > 0 &&
          futuresData.tickValue &&
          futuresData.tickValue > 0
        ) {
          return {
            dollarPerPoint: futuresData.dollarPerPoint,
            tickSize: futuresData.tickSize,
            tickValue: futuresData.tickValue,
            name: customInstrument.name,
            exchange: undefined,
          } as FuturesSpec;
        }
      } else if (assetType === 'forex' && customInstrument.forexData) {
        const forexData = customInstrument.forexData;
        
        if (
          forexData.lotSize &&
          forexData.lotSize > 0 &&
          forexData.pipValue &&
          forexData.pipValue > 0 &&
          forexData.pipSize &&
          forexData.pipSize > 0
        ) {
          return {
            lotSize: forexData.lotSize,
            pipValue: forexData.pipValue,
            pipSize: forexData.pipSize,
            name: customInstrument.name,
          } as ForexSpec;
        }
      } else if (assetType === 'cfd' && customInstrument.cfdData) {
        const cfdData = customInstrument.cfdData;
        if (cfdData.contractSize && cfdData.contractSize > 0) {
          return {
            contractSize: cfdData.contractSize,
            name: customInstrument.name,
          } as CfdSpec;
        }
      }
    }

    
    const specsDatabase =
      assetType === 'futures'
        ? FUTURES_SPECS
        : assetType === 'forex'
          ? FOREX_SPECS
          : null;

    if (!specsDatabase) {
      
      return null;
    }

    
    if (specsDatabase[upperSymbol]) {
      return specsDatabase[upperSymbol];
    }

    
    if (this.customMappings.has(upperSymbol)) {
      const mappedSymbol = this.customMappings.get(upperSymbol)!;
      if (specsDatabase[mappedSymbol]) {
        return specsDatabase[mappedSymbol];
      } else {
        console.warn(
          `InstrumentSpecService: Custom mapping ${upperSymbol} → ${mappedSymbol} points to ` +
            `non-existent symbol. Update mapping in Settings > Custom Options > Symbol Mappings.`
        );
      }
    }

    
    if (assetType === 'futures') {
      const baseSymbol = extractBaseSymbol(upperSymbol);
      if (baseSymbol && baseSymbol !== upperSymbol) {
        
        if (specsDatabase[baseSymbol]) {
          return specsDatabase[baseSymbol];
        }
      }
    }

    
    return null;
  }

  
  public async saveMapping(
    importedSymbol: string,
    baseSymbol: string,
    autoDetected: boolean
  ): Promise<boolean> {
    if (!importedSymbol?.trim() || !baseSymbol?.trim()) {
      console.warn(
        'InstrumentSpecService: Both importedSymbol and baseSymbol are required'
      );
      return false;
    }

    const upperImportedSymbol = importedSymbol.trim().toUpperCase();
    const upperBaseSymbol = baseSymbol.trim().toUpperCase();

    
    if (!FUTURES_SPECS[upperBaseSymbol] && !FOREX_SPECS[upperBaseSymbol]) {
      console.warn(
        `InstrumentSpecService: Base symbol "${upperBaseSymbol}" not found in specs database. ` +
          `Mapping will be saved but lookups will fail. ` +
          `Available futures: ${Object.keys(FUTURES_SPECS).join(', ')}. ` +
          `Available forex: ${Object.keys(FOREX_SPECS).join(', ')}`
      );
      
    }

    
    const pluginInstance = this.plugin;
    if (!pluginInstance.settings.symbolMappings) {
      pluginInstance.settings.symbolMappings = [];
    }

    
    const existingIndex = pluginInstance.settings.symbolMappings.findIndex(
      (m: SymbolMapping) =>
        m.importedSymbol.toUpperCase() === upperImportedSymbol
    );
    const previousMapping: SymbolMapping | undefined =
      existingIndex !== -1
        ? pluginInstance.settings.symbolMappings[existingIndex]
        : undefined;
    const previousInMemoryValue = this.customMappings.get(upperImportedSymbol);

    const newMapping: SymbolMapping = {
      importedSymbol: upperImportedSymbol,
      baseSymbol: upperBaseSymbol,
      autoDetected,
      dateCreated: new Date().toISOString(),
    };

    
    this.customMappings.set(upperImportedSymbol, upperBaseSymbol);
    if (existingIndex !== -1) {
      pluginInstance.settings.symbolMappings[existingIndex] = newMapping;
    } else {
      pluginInstance.settings.symbolMappings.push(newMapping);
    }

    
    try {
      await pluginInstance.saveSettings();
      return true;
    } catch (error) {
      console.error(
        `InstrumentSpecService: Failed to persist symbol mapping "${upperImportedSymbol}" -> "${upperBaseSymbol}":`,
        error
      );

      
      if (previousInMemoryValue !== undefined) {
        this.customMappings.set(upperImportedSymbol, previousInMemoryValue);
      } else {
        this.customMappings.delete(upperImportedSymbol);
      }

      
      if (previousMapping !== undefined) {
        pluginInstance.settings.symbolMappings[existingIndex] = previousMapping;
      } else {
        
        pluginInstance.settings.symbolMappings.pop();
      }

      return false;
    }
  }

  
  public getAllMappings(): SymbolMapping[] {
    return this.plugin.settings.symbolMappings || [];
  }

  
  public async deleteMapping(importedSymbol: string): Promise<void> {
    const trimmed = importedSymbol?.trim();
    if (!trimmed) {
      return;
    }

    const upperImportedSymbol = trimmed.toUpperCase();
    const pluginInstance = this.plugin;

    if (!pluginInstance.settings.symbolMappings) {
      
      this.customMappings.delete(upperImportedSymbol);
      return;
    }

    
    const previousInMemoryValue = this.customMappings.get(upperImportedSymbol);
    const previousSettingsMappings = [
      ...pluginInstance.settings.symbolMappings,
    ];

    
    this.customMappings.delete(upperImportedSymbol);
    const filteredMappings = pluginInstance.settings.symbolMappings.filter(
      (m: SymbolMapping) =>
        m.importedSymbol.toUpperCase() !== upperImportedSymbol
    );
    pluginInstance.settings.symbolMappings = filteredMappings;

    
    try {
      await pluginInstance.saveSettings();
    } catch (error) {
      console.error(
        `InstrumentSpecService: Failed to persist deletion of mapping "${upperImportedSymbol}":`,
        error
      );

      
      if (previousInMemoryValue !== undefined) {
        this.customMappings.set(upperImportedSymbol, previousInMemoryValue);
      }

      
      pluginInstance.settings.symbolMappings = previousSettingsMappings;

      throw error;
    }
  }
}
