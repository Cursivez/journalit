

import { App, MarkdownView, Notice, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { TradeShareModal } from '../share/tradeShare/TradeShareModal';
import { availableTradeShareSections } from '../share/tradeShare/tradeShareModel';
import { MarkdownViewHeaderAction } from '../share/MarkdownViewHeaderAction';
import { SHARE_IMAGE_ACTION_ICON } from '../share/shareActionIcon';
import type { TradeNoteRenderer } from './TradeNoteRenderer';

const TRADE_NOTE_HOST_SELECTOR = '.journalit-trade-view';
const TRADE_NOTE_CARD_SELECTOR = '.journalit-trade-note-wrapper';

export class TradeNoteShareAction {
  private readonly headerAction: MarkdownViewHeaderAction;

  constructor(
    private readonly app: App,
    private readonly plugin: JournalitPlugin,
    isTradeNote: (file: TFile) => boolean,
    private readonly renderer: TradeNoteRenderer
  ) {
    this.headerAction = new MarkdownViewHeaderAction(app, plugin, {
      icon: SHARE_IMAGE_ACTION_ICON,
      title: () => t('share.trade.modal-title'),
      appliesTo: isTradeNote,
      onClick: (view, file) => this.openShareComposer(view, file),
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

  private openShareComposer(view: MarkdownView, file: TFile): void {
    const host = this.findVisibleTradeNoteHost(view, file);
    const card = host?.querySelector<HTMLElement>(TRADE_NOTE_CARD_SELECTOR);
    if (!host || !card) {
      new Notice(t('trade.share.not-ready'));
      return;
    }

    new TradeShareModal(
      this.app,
      this.plugin,
      file,
      availableTradeShareSections(card),
      this.renderer
    ).open();
  }
}
