

import { App } from 'obsidian';
import React from 'react';
import { MissedTradeNote } from './MissedTradeNote';
import { MissedTradeFormData } from './types';
import { BaseComponentRenderer } from '../base/BaseComponentRenderer';
import { parseDisplayText } from '../../utils/tagSchema';
import { CustomFieldDefinition } from '../../types/customFields';
import { safeString } from '../../utils/safeString';

interface JournalitPluginForMissedTradeNote {
  openTradeFormInEditMode?: (
    data: Partial<MissedTradeFormData>,
    filePath: string
  ) => void;
  missedTradeService?: {
    updateMissedTrade: (
      data: Partial<MissedTradeFormData>,
      filePath: string,
      source?: string
    ) => Promise<void>;
  };
  customFieldsService?: {
    getFields: () => CustomFieldDefinition[];
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function stringArrayValue(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (!value || typeof value !== 'string') {
    return undefined;
  }

  if (!value.startsWith('[') || !value.endsWith(']')) {
    return [value];
  }

  const trimmed = value.slice(1, -1).trim();
  return trimmed ? trimmed.split(',').map((item) => item.trim()) : [];
}

function numericValue(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function optionalNumericValue(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return numericValue(value);
}

function dateValue(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }

  return null;
}

function getJournalitPlugin(
  app: App
): JournalitPluginForMissedTradeNote | undefined {
  const plugins = app.plugins?.plugins;
  const plugin = plugins?.journalit;
  return isRecord(plugin)
    ? (plugin as JournalitPluginForMissedTradeNote)
    : undefined;
}

export class MissedTradeNoteRenderer extends BaseComponentRenderer {
  constructor(app: App) {
    super(app);
  }

  
  public renderComponent(
    container: HTMLElement,
    data: Record<string, unknown>,
    filePath: string,
    viewId: string,
    contextId?: string
  ): void {
    
    const existingComponent = container.querySelector(
      '.missed-trade-note-container.missed-trade-note-mounted'
    );
    if (existingComponent) {
      return; 
    }

    this.renderMissedTradeNote(container, data, filePath, viewId, contextId);
  }

  
  public renderMissedTradeNote(
    container: HTMLElement,
    frontmatter: Record<string, unknown>,
    sourcePath: string,
    viewId: string,
    contextId?: string
  ): void {
    try {
      

      
      if (!container || !container.isConnected) {
        console.error(
          `[MissedTradeNote] Cannot render into disconnected container for ${sourcePath}`
        );
        return;
      }

      
      
      const rootId = contextId
        ? `${sourcePath}-${viewId}-${contextId}`
        : `${sourcePath}-${viewId}`;

      
      const missedTradeData = this.processMissedTradeData(frontmatter);

      
      container.setAttribute('data-displaying-file', sourcePath);

      
      const leaf = this.findContainingLeaf(container);

      

      
      const existingWrapper = container.querySelector(
        '.journalit-missed-trade-note-wrapper'
      );
      if (existingWrapper) {
        
        const existingMissedTradeNote = existingWrapper.querySelector(
          '.missed-trade-note-mounted'
        );
        if (existingMissedTradeNote) {
          return; 
        }
        
        existingWrapper.remove();
      }

      
      let domLeafId: string | null = null;
      if (leaf && leaf.view) {
        const viewContainerEl = leaf.view.containerEl;

        
        if (viewContainerEl && viewContainerEl.id) {
          domLeafId = viewContainerEl.id;
        }
      }

      
      const existingRoot = this.reactRoots.get(rootId);
      if (existingRoot && existingRoot.domContainer) {
        
        if (
          existingRoot.domContainer.isConnected &&
          existingRoot.domContainer.querySelector('.missed-trade-note-mounted')
        ) {
          return; 
        }
      }

      
      container.empty();

      
      let rootContext = this.reactRoots.get(rootId);

      
      

      
      const needsNewRoot =
        rootContext &&
        
        ((leaf && domLeafId && rootContext.leafId !== domLeafId) ||
          
          (contextId &&
            rootContext.domContainer &&
            rootContext.domContainer.getAttribute('data-context-id') !==
              contextId));

      if (needsNewRoot) {
        
        const contextSpecificRootId = contextId
          ? `${sourcePath}-context-${contextId}`
          : `${sourcePath}-${viewId}-${domLeafId}`;

        rootContext = this.reactRoots.get(contextSpecificRootId);

        if (!rootContext) {
          
          this.createReactRoot(
            container,
            contextSpecificRootId,
            domLeafId || undefined,
            contextId,
            missedTradeData,
            sourcePath
          );
          return;
        }
      }

      if (!rootContext) {
        
        this.createReactRoot(
          container,
          rootId,
          domLeafId || undefined,
          contextId,
          missedTradeData,
          sourcePath
        );
      } else {
        
        const reactContainer = rootContext.domContainer;

        
        const isContainerValid = container.contains(reactContainer);

        if (!isContainerValid) {
          
          this.createReactRoot(
            container,
            rootId,
            domLeafId || undefined,
            contextId,
            missedTradeData,
            sourcePath
          );
        } else {
          
          rootContext.root.render(
            this.wrapWithSharedProviders(
              this.createReactElement(missedTradeData, sourcePath)
            )
          );
        }
      }
    } catch (error) {
      console.error(
        '[MissedTradeNote] Error rendering missed trade note:',
        error
      );
      container.setText(
        'Error rendering missed trade note: ' +
          (error instanceof Error ? error.message : String(error))
      );
    }
  }

  
  protected getComponentClassName(): string {
    return 'journalit-missed-trade-view';
  }

  
  protected getWrapperClassName(): string {
    return 'journalit-missed-trade-note-wrapper';
  }

  
  protected createReactElement(
    data: Partial<MissedTradeFormData>,
    filePath: string,
    _openNoteFn?: (path: string, createNewLeaf?: boolean) => void
  ): React.ReactElement {
    const handleEditClick = (missedTradeData: Partial<MissedTradeFormData>) => {
      
      const plugin = getJournalitPlugin(this.app);
      if (!plugin) {
        console.error('Cannot access plugin instance for edit action');
        return;
      }

      
      if (plugin.openTradeFormInEditMode) {
        plugin.openTradeFormInEditMode(missedTradeData, filePath);
      } else {
        console.warn('Edit mode not available - plugin method missing');
      }
    };

    const handleDataUpdate = async (
      updatedData: Partial<MissedTradeFormData>
    ) => {
      
      const plugin = getJournalitPlugin(this.app);
      if (!plugin || !plugin.missedTradeService) {
        console.error('Cannot access plugin instance for data update');
        return;
      }

      try {
        
        
        await plugin.missedTradeService.updateMissedTrade(
          updatedData,
          filePath,
          'user-input'
        );
      } catch (error) {
        console.error(
          '[MissedTradeNote] Error updating missed trade data:',
          error
        );
      }
    };

    return React.createElement(MissedTradeNote, {
      data: { ...data, filePath, isMissedTrade: true as const },
      onEditClick: (nextData: typeof data) => void handleEditClick(nextData),
      onDataUpdate: (nextData: typeof data) => void handleDataUpdate(nextData),
    });
  }

  
  public unmountMissedTradeNote(
    sourcePath: string,
    viewId: string,
    leafId?: string,
    _contextId?: string
  ): boolean {
    return this.unmountComponent(sourcePath, viewId, leafId);
  }

  
  public unmountAllMissedTradeNotes(): void {
    this.unmountAllComponents();
  }

  
  public unmountLeafMissedTradeNotes(leafId: string): void {
    this.unmountLeafComponents(leafId);
  }

  
  private processMissedTradeData(
    frontmatter: Record<string, unknown>
  ): Partial<MissedTradeFormData> {
    
    const missedTradeData = { ...frontmatter };

    
    missedTradeData.isMissedTrade = true;

    
    if (frontmatter.images) {
      missedTradeData.images = this.normalizeImagePaths(frontmatter.images);
    }

    
    if (frontmatter.entries && Array.isArray(frontmatter.entries)) {
      missedTradeData.entries = frontmatter.entries
        .filter(isRecord)
        .map((entry) => ({
          time: dateValue(entry.time),
          price: numericValue(entry.price),
          size: numericValue(entry.size),
          notional: optionalNumericValue(entry.notional),
        }));
    }

    if (frontmatter.exits && Array.isArray(frontmatter.exits)) {
      missedTradeData.exits = frontmatter.exits
        .filter(isRecord)
        .map((exit) => ({
          time: dateValue(exit.time),
          price: numericValue(exit.price),
          size: numericValue(exit.size),
          notional: optionalNumericValue(exit.notional),
        }));
    }

    
    for (const field of [
      'setupIds',
      'setup',
      'mistake',
      'account',
      'tags',
      'customTags',
    ]) {
      missedTradeData[field] = stringArrayValue(missedTradeData[field]) ?? [];
    }

    
    if (missedTradeData.tags && Array.isArray(missedTradeData.tags)) {
      missedTradeData.customTags = missedTradeData.tags;
    }

    
    ['entryTime', 'exitTime'].forEach((field) => {
      if (
        missedTradeData[field] &&
        typeof missedTradeData[field] === 'string'
      ) {
        try {
          missedTradeData[field] = new Date(missedTradeData[field]);
        } catch (e) {
          console.error(`[MissedTradeNote] Failed to parse date: ${field}`, e);
        }
      }
    });

    
    [
      'entryPrice',
      'exitPrice',
      'positionSize',
      'pnl',
      'directPnL',
      'riskAmount',
      'stopLoss',
      'commission',
      'fees',
      'swap',
      'rebate',
      'mae',
      'mfe',
      'maePrice',
      'mfePrice',
      'strikePrice',
      'contractSize',
      'dollarPerPoint',
      'tickSize',
      'tickValue',
      'lotSize',
      'pipValue',
      'leverageRatio',
    ].forEach((field) => {
      if (
        missedTradeData[field] !== undefined &&
        typeof missedTradeData[field] !== 'number'
      ) {
        try {
          missedTradeData[field] = parseFloat(
            safeString(missedTradeData[field])
          );
        } catch (e) {
          console.error(
            `[MissedTradeNote] Failed to parse number: ${field}`,
            e
          );
        }
      }
    });

    
    ['useDirectPnLInput', 'isMissedTrade'].forEach((field) => {
      if (
        missedTradeData[field] !== undefined &&
        typeof missedTradeData[field] !== 'boolean'
      ) {
        try {
          missedTradeData[field] = Boolean(missedTradeData[field]);
        } catch (e) {
          console.error(
            `[MissedTradeNote] Failed to parse boolean: ${field}`,
            e
          );
        }
      }
    });

    
    
    missedTradeData.thesis =
      parseDisplayText(stringValue(frontmatter.thesis)) || '';
    missedTradeData.missedReason =
      parseDisplayText(stringValue(frontmatter.missedReason)) || '';

    
    
    
    try {
      const plugin = getJournalitPlugin(this.app);
      if (plugin && plugin.customFieldsService) {
        const customFieldDefinitions = plugin.customFieldsService.getFields();

        const customFields: Record<string, unknown> = {};

        
        customFieldDefinitions.forEach((fieldDef: CustomFieldDefinition) => {
          const fieldKey = fieldDef.fieldKey;
          if (fieldKey && frontmatter[fieldKey] !== undefined) {
            customFields[fieldDef.id] = frontmatter[fieldKey];
          }
        });

        
        if (Object.keys(customFields).length > 0) {
          missedTradeData.customFields = customFields;
        }
      }
    } catch (error) {
      console.error(
        '[MissedTradeNote] Error reconstructing custom fields:',
        error
      );
    }

    return missedTradeData;
  }

  

  private normalizeImagePaths(images: unknown): string[] {
    if (!images) {
      return [];
    }

    
    if (Array.isArray(images)) {
      const processed = images
        .map((img) => {
          if (typeof img !== 'string') return safeString(img);
          const cleaned = img.replace(/['"`]/g, '').trim();
          return cleaned;
        })
        .filter((path) => {
          const isValid =
            Boolean(path) && path.length > 0 && !path.match(/^[\s]*$/);
          return isValid;
        });
      return processed;
    }

    
    if (
      typeof images === 'string' &&
      images.startsWith('[') &&
      images.endsWith(']')
    ) {
      try {
        const trimmedStr = images.slice(1, -1).trim();
        if (!trimmedStr) return [];

        return trimmedStr
          .split(',')
          .map((item) => item.trim().replace(/['"`]/g, ''))
          .filter(Boolean);
      } catch (e) {
        console.error('[MissedTradeNote] Failed to parse images string:', e);
        return [images.replace(/['"`]/g, '').trim()];
      }
    }

    
    if (typeof images === 'string') {
      const cleaned = images.replace(/['"`]/g, '').trim();
      return cleaned ? [cleaned] : [];
    }

    return [];
  }
}
