

import { App, MarkdownView, Notice, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { captureBrandedPng } from '../../services/share/brandedCapture';
import { writeClipboardPendingPng } from '../../utils/clipboard';
import { MarkdownViewHeaderAction } from '../share/MarkdownViewHeaderAction';
import { SHARE_IMAGE_ACTION_ICON } from '../share/shareActionIcon';

const TRADE_NOTE_HOST_SELECTOR = '.journalit-trade-view';
const TRADE_NOTE_CARD_SELECTOR = '.journalit-trade-note-wrapper';

export class TradeNoteShareAction {
  private readonly headerAction: MarkdownViewHeaderAction;
  private readonly capturingViews = new WeakSet<MarkdownView>();

  constructor(
    app: App,
    private readonly plugin: JournalitPlugin,
    isTradeNote: (file: TFile) => boolean
  ) {
    this.headerAction = new MarkdownViewHeaderAction(app, plugin, {
      icon: SHARE_IMAGE_ACTION_ICON,
      title: () => t('trade.share.copy-screenshot'),
      appliesTo: isTradeNote,
      onClick: (view, file) => this.copyScreenshot(view, file),
    });
  }

  initialize(): void {
    this.headerAction.initialize();
  }

  cleanup(): void {
    this.headerAction.cleanup();
  }

  runOnActiveView(checking: boolean): boolean {
    return this.headerAction.runOnActiveView(checking);
  }

  
  private findVisibleTradeNoteHost(
    view: MarkdownView,
    file: TFile
  ): HTMLElement | null {
    const hosts = view.containerEl.querySelectorAll<HTMLElement>(
      TRADE_NOTE_HOST_SELECTOR
    );
    return (
      Array.from(hosts).find(
        (host) =>
          host.getClientRects().length > 0 &&
          host.getAttribute('data-file-path') === file.path
      ) ?? null
    );
  }

  private copyScreenshot(view: MarkdownView, file: TFile): void {
    if (this.capturingViews.has(view)) return;

    const host = this.findVisibleTradeNoteHost(view, file);
    const card = host?.querySelector<HTMLElement>(TRADE_NOTE_CARD_SELECTOR);
    if (!host || !card) {
      new Notice(t('trade.share.not-ready'));
      return;
    }

    this.capturingViews.add(view);
    
    
    const { display, trade } = this.plugin.settings;
    const png = captureBrandedPng(card, host, {
      
      hideDollarAmounts:
        (display?.hideDollarAmountsInShares ?? false) &&
        Boolean(trade.displayRMultiples),
    });
    
    
    png.catch((error: unknown) => {
      console.error('[Journalit] Failed to render trade screenshot:', error);
    });
    writeClipboardPendingPng(png)
      .then(() => {
        new Notice(t('trade.share.copied'));
      })
      .catch((error: unknown) => {
        console.error('[Journalit] Failed to copy trade screenshot:', error);
        new Notice(t('trade.share.failed'));
      })
      .finally(() => {
        this.capturingViews.delete(view);
      });
  }
}
