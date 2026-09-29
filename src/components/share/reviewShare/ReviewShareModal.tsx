

import React, { useEffect, useMemo, useState } from 'react';
import { App, MarkdownView, Modal, Notice, TFile } from 'obsidian';
import type { Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import {
  captureElementPng,
  hasShareLoadingContent,
  observeShareLoadingContent,
} from '../../../services/share/brandedCapture';
import { writeClipboardPendingPng } from '../../../utils/clipboard';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { Button } from '../../ui/Button';
import { DEFAULT_SETTINGS } from '../../../settings/types';
import { eventBus } from '../../../services/events/EventBus';
import { ReviewShareCard } from './ReviewShareCard';
import {
  AlignLeft,
  Heading,
  Image,
  LayoutDashboard,
} from '../../shared/icons/ObsidianIcon';
import {
  groupReviewNoteSections,
  isSharedByDefault,
  reviewNoteBlockLabel,
  reviewNoteSectionItemIds,
  selectedReviewNoteBlocks,
  splitReviewNoteBlocks,
  type ReviewNoteBlock,
  type ReviewNoteSection,
} from './reviewNoteBlocks';



const CARD_WIDTH = 720;
const CARD_PIXEL_RATIO = 1.5;

const MAX_PREVIEW_SCALE = 1;
const FALLBACK_PREVIEW_SCALE = 0.6;


function useLayoutSize(
  element: HTMLElement | null
): { width: number; height: number } | null {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(() => {
      setSize({ width: element.clientWidth, height: element.offsetHeight });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return size;
}


function useShareCardLoading(card: HTMLElement | null): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!card) return;
    return observeShareLoadingContent(card, setLoading);
  }, [card]);

  return loading;
}

const BLOCK_ICONS = {
  widget: LayoutDashboard,
  heading: Heading,
  media: Image,
  text: AlignLeft,
} as const;

const LEGEND_LABEL_KEYS = {
  widget: 'share.review.legend.widget',
  heading: 'share.review.legend.heading',
  media: 'share.review.legend.media',
  text: 'share.review.legend.text',
} as const satisfies Record<ReviewNoteBlock['kind'], string>;

const BLOCK_KINDS = ['widget', 'heading', 'media', 'text'] as const;


const SectionToggle: React.FC<{
  section: ReviewNoteSection;
  selected: ReadonlySet<string>;
  onChange: (ids: string[], include: boolean) => void;
}> = ({ section, selected, onChange }) => {
  const ids = reviewNoteSectionItemIds(section);
  const selectedCount = ids.filter((id) => selected.has(id)).length;
  const all = ids.length > 0 && selectedCount === ids.length;

  return (
    <label className="journalit-review-share-section-row">
      <input
        type="checkbox"
        checked={all}
        ref={(input) => {
          if (input) input.indeterminate = selectedCount > 0 && !all;
        }}
        onChange={() => onChange(ids, !all)}
      />
      <span className="journalit-review-share-row-label">
        {section.heading ? section.heading.text : t('share.review.section.top')}
      </span>
    </label>
  );
};

const ReviewSharePanel: React.FC<{
  plugin: JournalitPlugin;
  file: TFile;
  blocks: ReviewNoteBlock[];
}> = ({ plugin, file, blocks }) => {
  const sections = useMemo(() => groupReviewNoteSections(blocks), [blocks]);
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => {
    const initial = new Set<string>();
    for (const block of blocks) {
      if (isSharedByDefault(block)) initial.add(block.id);
    }
    return initial;
  });
  const [copying, setCopying] = useState(false);
  
  const rMultiplesOn = Boolean(plugin.settings.trade.displayRMultiples);
  const [hideDollarAmounts, setHideDollarAmounts] = useState(
    () =>
      rMultiplesOn &&
      (plugin.settings.display?.hideDollarAmountsInShares ?? false)
  );
  const changeHideDollarAmounts = (hide: boolean) => {
    setHideDollarAmounts(hide);
    
    plugin.settings.display = {
      ...(plugin.settings.display ?? DEFAULT_SETTINGS.display!),
      hideDollarAmountsInShares: hide,
    };
    void plugin.saveSettings().then(() => {
      eventBus.publish('settings:changed', {
        section: 'display',
        source: 'share-hide-dollar-amounts',
      });
    });
  };
  
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const [card, setCard] = useState<HTMLDivElement | null>(null);
  const [preview, setPreview] = useState<HTMLDivElement | null>(null);
  const cardHeight = useLayoutSize(card)?.height ?? 0;
  
  
  const cardLoading = useShareCardLoading(card);
  
  const previewWidth = useLayoutSize(preview)?.width ?? 0;
  const previewScale =
    previewWidth > 0
      ? Math.min(MAX_PREVIEW_SCALE, previewWidth / CARD_WIDTH)
      : FALLBACK_PREVIEW_SCALE;

  const sharedBlocks = useMemo(
    () => selectedReviewNoteBlocks(sections, selected),
    [sections, selected]
  );

  const setIncluded = (ids: string[], include: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      for (const id of ids) {
        if (include) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };
  const allIds = sections.flatMap(reviewNoteSectionItemIds);
  
  
  const hasSections = sections.some((section) => section.heading !== null);
  const presentKinds = new Set(
    sections.flatMap((section) => section.items.map((item) => item.kind))
  );

  const copyCard = () => {
    
    
    if (
      !frame ||
      !card ||
      copying ||
      cardLoading ||
      hasShareLoadingContent(card)
    ) {
      return;
    }

    setCopying(true);
    
    const png = captureElementPng(card, frame, CARD_PIXEL_RATIO);
    png.catch((error: unknown) => {
      console.error('[Journalit] Failed to render review share card:', error);
    });
    writeClipboardPendingPng(png)
      .then(() => {
        new Notice(t('share.review.copied'));
      })
      .catch((error: unknown) => {
        console.error('[Journalit] Failed to copy review share card:', error);
        new Notice(t('share.review.failed'));
      })
      .finally(() => {
        setCopying(false);
      });
  };

  return (
    <div className="journalit-review-share-layout">
      
      <div ref={setPreview} className="journalit-review-share-preview">
        <div
          className="journalit-review-share-preview-box"
          inert
          style={cssVars({
            '--journalit-share-preview-scale': previewScale,
            '--journalit-share-preview-height': `${cardHeight * previewScale}px`,
          })}
        >
          <div ref={setFrame} className="journalit-share-card-frame">
            <ReviewShareCard
              ref={setCard}
              filePath={file.path}
              plugin={plugin}
              blocks={sharedBlocks}
              hideDollarAmounts={hideDollarAmounts}
            />
          </div>
        </div>
      </div>
      <div className="journalit-review-share-controls">
        <div className="journalit-review-share-picker-actions">
          <Button
            variant="text"
            size="small"
            onClick={() => setIncluded(allIds, true)}
          >
            {t('share.review.select-all')}
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => setIncluded(allIds, false)}
          >
            {t('share.review.clear')}
          </Button>
        </div>
        <div className="journalit-review-share-legend">
          {BLOCK_KINDS.filter((kind) => presentKinds.has(kind)).map((kind) => {
            const Icon = BLOCK_ICONS[kind];
            return (
              <span key={kind} className="journalit-review-share-legend-item">
                <Icon
                  size={12}
                  className="journalit-review-share-item-icon"
                  aria-hidden="true"
                />
                <span className="journalit-review-share-legend-label">
                  {t(LEGEND_LABEL_KEYS[kind])}
                </span>
              </span>
            );
          })}
        </div>
        <div className="journalit-review-share-sections">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`journalit-review-share-section${hasSections ? '' : ' is-flat'}`}
            >
              {hasSections && (
                <SectionToggle
                  section={section}
                  selected={selected}
                  onChange={setIncluded}
                />
              )}
              {section.items.map((item) => {
                const Icon = BLOCK_ICONS[item.kind];
                return (
                  <label
                    key={item.id}
                    className="journalit-review-share-item-row"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() =>
                        setIncluded([item.id], !selected.has(item.id))
                      }
                    />
                    <Icon
                      size={14}
                      className="journalit-review-share-item-icon"
                      aria-hidden="true"
                    />
                    <span className="journalit-review-share-row-label">
                      {reviewNoteBlockLabel(item)}
                    </span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <label
          className={`journalit-review-share-option${rMultiplesOn ? '' : ' is-disabled'}`}
        >
          <input
            type="checkbox"
            checked={hideDollarAmounts}
            disabled={!rMultiplesOn}
            onChange={() => changeHideDollarAmounts(!hideDollarAmounts)}
          />
          <span className="journalit-review-share-option-text">
            <span>{t('share.review.hide-dollar-amounts')}</span>
            <span className="journalit-review-share-option-hint">
              {rMultiplesOn
                ? t('share.review.hide-dollar-amounts-hint')
                : t('share.review.hide-dollar-amounts-needs-r')}
            </span>
          </span>
        </label>
        <Button
          variant="primary"
          fullWidth
          onClick={copyCard}
          loading={copying || (cardLoading && sharedBlocks.length > 0)}
          disabled={copying || cardLoading || sharedBlocks.length === 0}
        >
          {t('share.review.copy')}
        </Button>
      </div>
    </div>
  );
};

export class ReviewShareModal extends Modal {
  private root: Root | null = null;

  constructor(
    app: App,
    private readonly plugin: JournalitPlugin,
    private readonly file: TFile,
    private readonly sourceView: MarkdownView
  ) {
    super(app);
  }

  
  private async readNote(): Promise<string> {
    
    
    await this.plugin.processorManager
      .getWidgetCodeblockProcessor()
      .ensureImageWidgetIds(this.file.path);
    return this.sourceView.file === this.file
      ? this.sourceView.editor.getValue()
      : this.app.vault.cachedRead(this.file);
  }

  async onOpen(): Promise<void> {
    this.titleEl.setText(t('share.review.modal-title'));
    this.modalEl.addClass('journalit-review-share-modal');
    this.contentEl.empty();
    const mountPoint = this.contentEl.createDiv({
      cls: 'journalit-review-share-root',
    });

    const [{ createRoot }, content] = await Promise.all([
      import('react-dom/client'),
      this.readNote(),
    ]);
    
    
    
    if (!mountPoint.isConnected) return;
    this.root = createRoot(mountPoint);
    this.root.render(
      <ReviewSharePanel
        plugin={this.plugin}
        file={this.file}
        blocks={splitReviewNoteBlocks(content)}
      />
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
  }
}
