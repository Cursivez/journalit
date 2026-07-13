

import { App } from 'obsidian';
import React from 'react';
import { TradeNote } from './TradeNote';
import { TradeFormData, TradeFormOpenOptions } from '../forms/trade/types';
import { BaseComponentRenderer } from '../base/BaseComponentRenderer';
import { normalizeStringArray } from '../../utils/dataUtils';
import { parseDisplayText } from '../../utils/tagSchema';
import { CustomFieldDefinition } from '../../types/customFields';
import { parseTradeDividendTransactions } from '../../utils/tradeUtils';
import { normalizeTradeExecution } from '../../services/trade/core/TradeExecutionNormalization';
import { safeString } from '../../utils/safeString';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function normalizeFrontmatterStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return normalizeStringArray(value);
  }

  if (!value || typeof value !== 'string') {
    return [];
  }

  if (!value.startsWith('[') || !value.endsWith(']')) {
    return [value];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return normalizeStringArray(parsed);
    }
  } catch {
    // intentional
  }

  const trimmed = value.slice(1, -1).trim();
  return trimmed ? trimmed.split(',').map((item) => item.trim()) : [];
}

interface JournalitPluginForTradeNote {
  openTradeFormInEditMode?: (
    data: Partial<TradeFormData>,
    filePath: string,
    openOptions?: TradeFormOpenOptions
  ) => void;
  tradeService?: {
    updateTrade: (
      data: Partial<TradeFormData>,
      filePath: string,
      source?: string
    ) => Promise<void>;
  };
  missedTradeService?: {
    updateMissedTrade: (
      data: Partial<TradeFormData>,
      filePath: string
    ) => Promise<void>;
  };
  customFieldsService?: {
    getFields: () => CustomFieldDefinition[];
  };
}

function getJournalitPlugin(app: App): JournalitPluginForTradeNote | undefined {
  const plugins = app.plugins?.plugins;
  const plugin = plugins?.journalit;
  return isRecord(plugin) ? (plugin as JournalitPluginForTradeNote) : undefined;
}

export class TradeNoteRenderer extends BaseComponentRenderer {
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
      '.trade-note-container.trade-note-mounted'
    );
    if (existingComponent) {
      return; 
    }

    this.renderTradeNote(container, data, filePath, viewId, contextId);
  }

  
  public renderTradeNote(
    container: HTMLElement,
    frontmatter: Record<string, unknown>,
    sourcePath: string,
    viewId: string,
    contextId?: string
  ): void {
    try {
      
      
      
      if (
        !container ||
        (!container.isConnected &&
          container.getAttribute('data-mode') !== 'export')
      ) {
        return;
      }

      
      
      const rootId = contextId
        ? `${sourcePath}-${viewId}-${contextId}`
        : `${sourcePath}-${viewId}`;

      
      const tradeData = this.processTradeData(frontmatter);

      
      container.setAttribute('data-displaying-file', sourcePath);

      
      const leaf = this.findContainingLeaf(container);

      

      
      const existingWrapper = container.querySelector(
        '.journalit-trade-note-wrapper'
      );
      if (existingWrapper) {
        
        const existingTradeNote = existingWrapper.querySelector(
          '.trade-note-mounted'
        );
        if (existingTradeNote) {
          return; 
        }
        
        this.unmountContainer(container);
        container.classList.remove('trade-note-mounted');
        container.removeAttribute('data-mounted-at');
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
          existingRoot.domContainer.querySelector('.trade-note-mounted')
        ) {
          return; 
        }
      }

      
      this.unmountContainer(container);
      container.classList.remove('trade-note-mounted');
      container.removeAttribute('data-mounted-at');
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
            tradeData,
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
          tradeData,
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
            tradeData,
            sourcePath
          );
        } else {
          
          rootContext.root.render(
            this.wrapWithSharedProviders(
              this.createReactElement(tradeData, sourcePath),
              this.getDisplayPolicyPrivacyModeOverride(tradeData)
            )
          );
        }
      }
    } catch (error) {
      console.error('[TradeNote] Error rendering trade note:', error);
      container.setText(
        'Error rendering trade note: ' +
          (error instanceof Error ? error.message : String(error))
      );
    }
  }

  
  protected getComponentClassName(): string {
    return 'journalit-trade-view';
  }

  
  protected getWrapperClassName(): string {
    return 'journalit-trade-note-wrapper';
  }

  protected getDisplayPolicyPrivacyModeOverride(
    data: unknown
  ): boolean | undefined {
    return isRecord(data) &&
      (data.isBacktestTrade === true || data.type === 'backtest-trade')
      ? false
      : undefined;
  }

  
  protected createReactElement(
    data: Partial<TradeFormData>,
    filePath: string,
    _openNoteFn?: (path: string, createNewLeaf?: boolean) => void
  ): React.ReactElement {
    const handleEditClick = (
      tradeData: Partial<TradeFormData>,
      openOptions?: TradeFormOpenOptions
    ) => {
      
      const plugin = getJournalitPlugin(this.app);
      if (!plugin) {
        console.error('Cannot access plugin instance for edit action');
        return;
      }

      
      if (plugin.openTradeFormInEditMode) {
        
        try {
          const activeEl = window.activeDocument.activeElement;
          if (activeEl?.instanceOf(HTMLElement)) activeEl.blur();
          const cm = window.activeDocument.querySelector('.cm-editor');
          if (cm?.instanceOf(HTMLElement)) cm.blur();
        } catch {
          // intentional
        }

        
        try {
          window.requestAnimationFrame(() => {
            window.setTimeout(() => {
              try {
                plugin.openTradeFormInEditMode?.(
                  tradeData,
                  filePath,
                  openOptions
                );
              } catch (err) {
                console.error('Failed to open trade form in edit mode:', err);
              }
            }, 0);
          });
        } catch {
          
          try {
            plugin.openTradeFormInEditMode?.(tradeData, filePath, openOptions);
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        console.warn('Edit mode not available - plugin method missing');
      }
    };

    const handleDataUpdate = async (updatedData: Partial<TradeFormData>) => {
      
      const plugin = getJournalitPlugin(this.app);
      if (!plugin) {
        console.error('Cannot access plugin instance for data update');
        return;
      }

      try {
        if (data.isMissedTrade === true) {
          if (!plugin.missedTradeService) {
            console.error('Cannot access missed trade service for data update');
            return;
          }

          await plugin.missedTradeService.updateMissedTrade(
            updatedData,
            filePath
          );
          return;
        }

        if (!plugin.tradeService) {
          console.error('Cannot access trade service for data update');
          return;
        }

        await plugin.tradeService.updateTrade(
          updatedData,
          filePath,
          'user-input'
        );
      } catch (error) {
        console.error('[TradeNote] Error updating trade data:', error);
      }
    };

    return React.createElement(TradeNote, {
      data: { ...data, filePath },
      onEditClick: (
        nextData: typeof data,
        openOptions?: TradeFormOpenOptions
      ) => void handleEditClick(nextData, openOptions),
      onDataUpdate: (nextData: typeof data) => void handleDataUpdate(nextData),
    });
  }

  
  public unmountTradeNote(
    sourcePath: string,
    viewId: string,
    leafId?: string,
    _contextId?: string
  ): boolean {
    return this.unmountComponent(sourcePath, viewId, leafId);
  }

  
  public unmountAllTradeNotes(): void {
    this.unmountAllComponents();
  }

  
  public unmountLeafTradeNotes(leafId: string): void {
    this.unmountLeafComponents(leafId);
  }

  
  private processTradeData(
    frontmatter: Record<string, unknown>
  ): Partial<TradeFormData> {
    
    const tradeData = { ...frontmatter };

    
    if (frontmatter.images) {
      // intentional
    }

    
    if (frontmatter.images) {
      tradeData.images = this.normalizeImagePaths(frontmatter.images);
    }

    
    for (const field of ['setup', 'mistake', 'account', 'tags', 'customTags']) {
      tradeData[field] = normalizeStringArray(
        normalizeFrontmatterStringArray(tradeData[field])
      );
    }

    
    if (tradeData.tags && Array.isArray(tradeData.tags)) {
      tradeData.customTags = tradeData.tags;
    }

    const normalizedExecution = normalizeTradeExecution(frontmatter, {
      deriveMissingExplicitness: true,
    });
    const totalEntrySize = normalizedExecution.entries.reduce(
      (sum, entry) =>
        entry.size !== null && entry.size > 0 ? sum + entry.size : sum,
      0
    );
    const firstEntryPrice = normalizedExecution.entries.find(
      (entry) => entry.price !== null
    )?.price;

    tradeData.entryPrice =
      normalizedExecution.weightedEntryPrice ??
      normalizedExecution.entryPrice ??
      firstEntryPrice ??
      0;
    tradeData.exitPrice =
      normalizedExecution.resolvedExitPrice ??
      normalizedExecution.exitPrice ??
      0;
    tradeData.positionSize =
      totalEntrySize > 0
        ? totalEntrySize
        : (normalizedExecution.positionSize ?? 0);
    tradeData.useDirectPnLInput = normalizedExecution.useDirectPnLInput;
    tradeData.hasExplicitExitPrice = normalizedExecution.hasExplicitExitPrice;

    if (normalizedExecution.firstEntryTime) {
      tradeData.entryTime = normalizedExecution.firstEntryTime;
    }
    if (normalizedExecution.lastExitTime) {
      tradeData.exitTime = normalizedExecution.lastExitTime;
    }

    tradeData.entries = normalizedExecution.entries.map((entry) => ({
      time: entry.time,
      price: entry.price ?? 0,
      size: entry.size ?? 0,
      ...(entry.notional !== undefined ? { notional: entry.notional } : {}),
    }));

    tradeData.exits = normalizedExecution.exits.map((exit) => ({
      time: exit.time,
      price: exit.price ?? 0,
      size: exit.size ?? 0,
      ...(exit.notional !== undefined ? { notional: exit.notional } : {}),
      ...(exit.hasExplicitPrice !== undefined
        ? { hasExplicitPrice: exit.hasExplicitPrice }
        : {}),
    }));

    const parsedDividends = parseTradeDividendTransactions(
      frontmatter.dividends,
      {
        parseTime: (value) =>
          typeof value === 'string' || value instanceof Date
            ? new Date(value)
            : null,
      }
    );
    if (parsedDividends) {
      tradeData.dividends = parsedDividends;
    }

    
    ['entryTime', 'exitTime'].forEach((field) => {
      if (tradeData[field] && typeof tradeData[field] === 'string') {
        try {
          tradeData[field] = new Date(tradeData[field]);
        } catch (e) {
          console.error(`[TradeNote] Failed to parse date: ${field}`, e);
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
        tradeData[field] !== undefined &&
        typeof tradeData[field] !== 'number'
      ) {
        try {
          tradeData[field] = parseFloat(safeString(tradeData[field]));
        } catch (e) {
          console.error(`[TradeNote] Failed to parse number: ${field}`, e);
        }
      }
    });

    
    
    if (tradeData.pnl !== undefined && tradeData.pnl !== null) {
      tradeData.originalPnl = tradeData.pnl;
    }

    if (
      frontmatter.type === 'missed-trade' ||
      frontmatter.isMissedTrade === true
    ) {
      tradeData.isMissedTrade = true;
      tradeData.isBacktestTrade = false;
    }

    if (
      frontmatter.type === 'backtest-trade' ||
      frontmatter.isBacktestTrade === true
    ) {
      tradeData.isBacktestTrade = true;
      tradeData.isMissedTrade = false;
    }

    
    ['useDirectPnLInput'].forEach((field) => {
      if (
        tradeData[field] !== undefined &&
        typeof tradeData[field] !== 'boolean'
      ) {
        try {
          tradeData[field] = Boolean(tradeData[field]);
        } catch (e) {
          console.error(`[TradeNote] Failed to parse boolean: ${field}`, e);
        }
      }
    });

    
    if (typeof frontmatter.currency === 'string') {
      tradeData.currency = frontmatter.currency;
    }

    
    
    
    const thesisValue =
      typeof frontmatter.thesis === 'string' ? frontmatter.thesis : undefined;
    tradeData.thesis = parseDisplayText(thesisValue) || '';

    const missedReasonValue =
      typeof frontmatter.missedReason === 'string'
        ? frontmatter.missedReason
        : undefined;
    tradeData.missedReason = parseDisplayText(missedReasonValue) || '';

    const mtCommentValue =
      typeof frontmatter.mtComment === 'string'
        ? frontmatter.mtComment
        : undefined;
    const normalizedMTComment = parseDisplayText(mtCommentValue).trim();
    if (normalizedMTComment) {
      tradeData.mtComment = normalizedMTComment;
    } else {
      delete tradeData.mtComment;
    }

    
    
    
    try {
      const plugin = getJournalitPlugin(this.app);
      if (plugin?.customFieldsService) {
        const customFieldDefinitions = plugin.customFieldsService.getFields();
        const customFields: Record<string, unknown> = {};

        
        customFieldDefinitions.forEach((fieldDef: CustomFieldDefinition) => {
          const fieldKey = fieldDef.fieldKey;
          if (fieldKey && frontmatter[fieldKey] !== undefined) {
            customFields[fieldDef.id] = frontmatter[fieldKey];
          }
        });

        
        if (Object.keys(customFields).length > 0) {
          tradeData.customFields = customFields;
        }
      }
    } catch (error) {
      console.error('[TradeNote] Error reconstructing custom fields:', error);
    }

    return tradeData;
  }

  
  private normalizeImagePaths(images: unknown): string[] {
    if (!images) return [];

    
    if (Array.isArray(images)) {
      return images.flatMap((img) => {
        if (typeof img !== 'string') {
          const trimmed = String(img).replace(/['`"]/g, '').trim();
          return trimmed ? [trimmed] : [];
        }
        const trimmed = img.replace(/['`"]/g, '').trim();
        return trimmed ? [trimmed] : [];
      });
    }

    
    if (
      typeof images === 'string' &&
      images.startsWith('[') &&
      images.endsWith(']')
    ) {
      try {
        const trimmedStr = images.slice(1, -1).trim();
        if (!trimmedStr) return [];

        return trimmedStr.split(',').flatMap((item) => {
          const trimmed = item.trim().replace(/['`"]/g, '');
          return trimmed ? [trimmed] : [];
        });
      } catch (e) {
        console.error('[TradeNote] Failed to parse images string:', e);
        return [images.replace(/['"`]/g, '').trim()];
      }
    }

    
    if (typeof images === 'string') {
      return [images.replace(/['"`]/g, '').trim()];
    }

    return [];
  }
}
