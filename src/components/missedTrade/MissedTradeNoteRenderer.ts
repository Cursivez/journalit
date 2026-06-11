

import { App } from 'obsidian';
import React from 'react';
import { MissedTradeNote } from './MissedTradeNote';
import { MissedTradeFormData } from './types';
import { BaseComponentRenderer } from '../base/BaseComponentRenderer';
import { parseDisplayText } from '../../utils/tagSchema';
import { CustomFieldDefinition } from '../../types/customFields';

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
        const viewContainerEl = leaf.view.containerEl as HTMLElement;

        
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
      
      const plugin = this.app.plugins?.plugins?.['journalit'];
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
      
      const plugin = this.app.plugins?.plugins?.['journalit'];
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
      onEditClick: handleEditClick,
      onDataUpdate: handleDataUpdate,
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
      missedTradeData.entries = frontmatter.entries.map(
        (entry: Record<string, unknown>) => ({
          time: entry.time ? new Date(entry.time as string) : null,
          price: parseFloat(entry.price as string) || 0,
          size: parseFloat(entry.size as string) || 0,
          notional:
            entry.notional !== undefined
              ? parseFloat(entry.notional as string)
              : undefined,
        })
      );
    }

    if (frontmatter.exits && Array.isArray(frontmatter.exits)) {
      missedTradeData.exits = frontmatter.exits.map(
        (exit: Record<string, unknown>) => ({
          time: exit.time ? new Date(exit.time as string) : null,
          price: parseFloat(exit.price as string) || 0,
          size: parseFloat(exit.size as string) || 0,
          notional:
            exit.notional !== undefined
              ? parseFloat(exit.notional as string)
              : undefined,
        })
      );
    }

    
    ['setupIds', 'setup', 'mistake', 'account', 'tags', 'customTags'].forEach(
      (field) => {
        if (missedTradeData[field]) {
          if (!Array.isArray(missedTradeData[field])) {
            if (
              typeof missedTradeData[field] === 'string' &&
              missedTradeData[field].startsWith('[') &&
              missedTradeData[field].endsWith(']')
            ) {
              try {
                const trimmedStr = missedTradeData[field].slice(1, -1).trim();
                if (trimmedStr) {
                  missedTradeData[field] = trimmedStr
                    .split(',')
                    .map((item: string) => item.trim());
                } else {
                  missedTradeData[field] = [];
                }
              } catch (e) {
                console.error(
                  `[MissedTradeNote] Failed to parse array string: ${field}`,
                  e
                );
                missedTradeData[field] = [missedTradeData[field]];
              }
            } else {
              
              missedTradeData[field] = [missedTradeData[field]];
            }
          }
        }
      }
    );

    
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
          missedTradeData[field] = parseFloat(String(missedTradeData[field]));
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
      parseDisplayText(frontmatter.thesis as string | undefined) || '';
    missedTradeData.missedReason =
      parseDisplayText(frontmatter.missedReason as string | undefined) || '';

    
    
    
    try {
      const plugin = this.app.plugins?.plugins?.['journalit'];
      if (plugin && plugin.customFieldsService) {
        const customFieldDefinitions = plugin.customFieldsService.getFields();

        const customFields: { [fieldId: string]: any } = {};

        
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

  

  private normalizeImagePaths(images: any): string[] {
    if (!images) {
      return [];
    }

    
    if (Array.isArray(images)) {
      const processed = images
        .map((img) => {
          if (typeof img !== 'string') return String(img);
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
