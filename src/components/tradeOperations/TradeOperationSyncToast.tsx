import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type JournalitPlugin from '../../main';
import {
  ensureBottomLeftNotificationHost,
  mountBottomLeftNotification,
  removeBottomLeftNotification,
} from '../notifications/BottomLeftNotificationHost';
import type { TradeOperationResult } from '../../services/tradeOperations/types';
import { TradeOperationResultCard } from './TradeOperationResultCard';

export class TradeOperationSyncToast {
  private containerEl: HTMLElement | null = null;
  private root: Root | null = null;
  private operationId: string | null = null;
  private hideTimeoutId: number | null = null;
  private readonly unsubscribe: () => void;

  constructor(private readonly plugin: JournalitPlugin) {
    ensureBottomLeftNotificationHost();
    this.unsubscribe = plugin
      .ensureTradeOperationResultService()
      .subscribe(() => {
        const recentResult = plugin
          .ensureTradeOperationResultService()
          .getSnapshot().recentResult;
        if (this.operationId && recentResult?.id !== this.operationId) {
          this.hide();
        }
      });
  }

  show(result: TradeOperationResult): void {
    if (result.kind !== 'sync') return;
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    this.operationId = result.id;
    if (
      this.containerEl &&
      (!this.containerEl.isConnected ||
        this.containerEl.ownerDocument !== window.activeDocument)
    ) {
      this.removeContainer();
    }
    if (!this.containerEl) {
      this.containerEl = mountBottomLeftNotification(
        'journalit-sync-result-toast-mount'
      );
      this.root = createRoot(this.containerEl);
    }
    this.root?.render(
      <TradeOperationResultCard
        key={result.id}
        plugin={this.plugin}
        result={result}
        presentation="toast"
        onDismiss={() => this.dismissCurrentResult()}
      />
    );
    const container = this.containerEl;
    window.requestAnimationFrame(() => {
      if (this.containerEl === container && container?.isConnected) {
        container.classList.add('journalit-sync-result-toast-mount--visible');
      }
    });
  }

  cleanup(): void {
    this.unsubscribe();
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    this.operationId = null;
    this.removeContainer();
  }

  private dismissCurrentResult(): void {
    const operationId = this.operationId;
    this.operationId = null;
    const service = this.plugin.ensureTradeOperationResultService();
    if (service.getSnapshot().recentResult?.id === operationId) {
      service.clearRecentResult();
    }
    this.hide();
  }

  private hide(): void {
    this.operationId = null;
    if (!this.containerEl) return;
    this.containerEl.classList.remove(
      'journalit-sync-result-toast-mount--visible'
    );
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
    }
    this.hideTimeoutId = window.setTimeout(() => {
      this.removeContainer();
      this.hideTimeoutId = null;
    }, 220);
  }

  private removeContainer(): void {
    this.root?.unmount();
    this.root = null;
    if (this.containerEl) {
      removeBottomLeftNotification(this.containerEl);
      this.containerEl = null;
    }
  }
}
