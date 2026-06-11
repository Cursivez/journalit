

import React from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import { TradeLog } from '../components/tradelog/TradeLog';
import JournalitPlugin from '../main';
import { t } from '../lang/helpers';


export const TRADE_LOG_VIEW_TYPE = 'journalit-trade-log-view';


export class TradeLogView extends ReactView {
  private plugin: JournalitPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-trade-log-view-container',
    });
    this.plugin = plugin;
  }

  
  getDisplayText(): string {
    return t('tradelog.title');
  }

  
  getViewType(): string {
    return TRADE_LOG_VIEW_TYPE;
  }

  
  getIcon(): string {
    return 'folder-tree';
  }

  
  async onOpen(): Promise<void> {
    try {
      
      await super.onOpen();

      
    } catch (error) {
      console.error('Error in TradeLogView.onOpen:', error);
    }
  }

  
  async onClose(): Promise<void> {
    try {
      
      

      
      await super.onClose();
    } catch (error) {
      console.error('Error in TradeLogView.onClose:', error);
    }
  }

  
  protected getRenderFunction(): RenderFunction {
    const render = () => <TradeLog plugin={this.plugin} leaf={this.leaf} />;
    render.displayName = 'TradeLogViewRenderer';
    return render;
  }
}
