import React, { useState } from 'react';
import { App, Notice, TFile } from 'obsidian';
import type { Root } from 'react-dom/client';
import type JournalitPlugin from '../../../main';
import type { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import { t } from '../../../lang/helpers';
import type { TradeNoteRenderer } from '../../trade/TradeNoteRenderer';
import { Button } from '../../ui/Button';
import { Select } from '../../core/Select';
import { ShareCard } from '../ShareCard';
import { ShareComposer } from '../ShareComposer';
import {
  TRADE_SHARE_SECTION_LABELS,
  type TradeShareImageLayout,
  type TradeSharePresentation,
  type TradeShareSection,
  type TradeSharePnlMode,
} from './tradeShareModel';
import { loadTradeShareSnapshot } from './loadTradeShareSnapshot';
import { JournalitModal } from '../../modals/JournalitModal';

const PNL_OPTION_LABELS = [
  { value: 'currency', label: 'settings.general.currency' },
  { value: 'r', label: 'template.editor.metric.r-multiple' },
  { value: 'position-percent', label: 'share.trade.position-return' },
  { value: 'account-percent', label: 'share.trade.account-return' },
] as const;

const IMAGE_LAYOUT_OPTION_LABELS = [
  { value: 'current', label: 'template-picker.badge.current' },
  { value: 'carousel', label: 'template.editor.image-layout-carousel' },
  { value: 'stacked', label: 'template.editor.image-layout-stacked' },
] as const;

const TradeSharePanel: React.FC<{
  plugin: JournalitPlugin;
  data: PartialTradeFrontmatter;
  sections: TradeShareSection[];
  accountBalance: number | undefined;
  presentation: TradeSharePresentation;
  renderer: TradeNoteRenderer;
}> = ({ plugin, data, sections, accountBalance, presentation, renderer }) => {
  const [selected, setSelected] = useState<ReadonlySet<TradeShareSection>>(
    () => new Set(sections)
  );
  const [pnlMode, setPnlMode] = useState<TradeSharePnlMode>(() =>
    plugin.settings.trade.displayRMultiples ? 'r' : 'currency'
  );
  const [imageLayout, setImageLayout] =
    useState<TradeShareImageLayout>('current');
  
  const isShown = (section: TradeShareSection) =>
    selected.has(section) && (section !== 'rating' || selected.has('metrics'));
  return (
    <ShareComposer
      plugin={plugin}
      hasContent={sections.some(isShown)}
      copiedMessage={t('trade.share.copied')}
      failedMessage={t('trade.share.failed')}
      allowHideDollarAmounts={pnlMode !== 'currency'}
      hideDollarAmountsHint={t('share.trade.hide-dollar-hint')}
      renderCard={(ref, hideDollarAmounts) => (
        <ShareCard
          ref={ref}
          hideDollarAmounts={hideDollarAmounts}
          className="journalit-trade-share-card"
        >
          <div className="journalit-trade-view">
            <div className="journalit-trade-note-wrapper">
              {renderer.createShareElement(data, {
                sections: selected,
                pnlMode,
                imageLayout,
                accountBalance,
                presentation,
              })}
            </div>
          </div>
        </ShareCard>
      )}
    >
      <div className="journalit-review-share-picker-actions">
        <Button
          variant="text"
          size="small"
          onClick={() => setSelected(new Set(sections))}
        >
          {t('share.review.select-all')}
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={() => setSelected(new Set())}
        >
          {t('share.review.clear')}
        </Button>
      </div>
      <div className="journalit-review-share-sections">
        <div className="journalit-review-share-section is-flat">
          {sections.map((section) => {
            const disabled = section === 'rating' && !selected.has('metrics');
            return (
              <label
                key={section}
                className={`journalit-review-share-item-row${disabled ? ' is-disabled' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(section)}
                  disabled={disabled}
                  onChange={() =>
                    setSelected((current) => {
                      const next = new Set(current);
                      if (next.has(section)) next.delete(section);
                      else next.add(section);
                      return next;
                    })
                  }
                />
                <span className="journalit-review-share-row-label">
                  {t(TRADE_SHARE_SECTION_LABELS[section])}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      {sections.includes('images') && (
        <Select
          label={t('template.editor.image-layout')}
          value={imageLayout}
          options={IMAGE_LAYOUT_OPTION_LABELS.map(({ value, label }) => ({
            value,
            label: t(label),
          }))}
          onChange={(value) => {
            if (
              value === 'current' ||
              value === 'carousel' ||
              value === 'stacked'
            )
              setImageLayout(value);
          }}
        />
      )}
      <Select
        label={t('template.editor.metric.pnl')}
        value={pnlMode}
        options={PNL_OPTION_LABELS.map(({ value, label }) => ({
          value,
          label: t(label),
        }))}
        onChange={(value) => {
          if (
            value === 'currency' ||
            value === 'r' ||
            value === 'position-percent' ||
            value === 'account-percent'
          )
            setPnlMode(value);
        }}
      />
    </ShareComposer>
  );
};

export class TradeShareModal extends JournalitModal {
  private root: Root | null = null;
  constructor(
    app: App,
    private readonly plugin: JournalitPlugin,
    private readonly file: TFile,
    private readonly sections: TradeShareSection[],
    private readonly renderer: TradeNoteRenderer
  ) {
    super(app);
  }

  async onOpen(): Promise<void> {
    this.titleEl.setText(t('share.trade.modal-title'));
    this.modalEl.addClass('journalit-modal', 'journalit-review-share-modal');
    const mountPoint = this.contentEl.createDiv({
      cls: 'journalit-review-share-root',
    });
    mountPoint.setText(t('common.loading'));
    try {
      const [{ createRoot }, snapshot] = await Promise.all([
        import('react-dom/client'),
        loadTradeShareSnapshot(this.plugin, this.file, this.renderer),
      ]);
      
      
      if (!mountPoint.isConnected) return;
      this.root = createRoot(mountPoint);
      this.root.render(
        <TradeSharePanel
          plugin={this.plugin}
          {...snapshot}
          sections={this.sections}
          renderer={this.renderer}
        />
      );
    } catch (error) {
      console.error('[Journalit] Failed to open trade share:', error);
      new Notice(t('trade.share.failed'));
      this.close();
    }
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
  }
}
