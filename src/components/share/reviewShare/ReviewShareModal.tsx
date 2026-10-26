

import React, { useMemo, useState } from 'react';
import { App, MarkdownView, TFile } from 'obsidian';
import type { Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { Button } from '../../ui/Button';
import { ShareComposer } from '../ShareComposer';
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
import { JournalitModal } from '../../modals/JournalitModal';

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

  return (
    <ShareComposer
      plugin={plugin}
      hasContent={sharedBlocks.length > 0}
      copiedMessage={t('share.review.copied')}
      failedMessage={t('share.review.failed')}
      renderCard={(ref, hideDollarAmounts) => (
        <ReviewShareCard
          ref={ref}
          filePath={file.path}
          plugin={plugin}
          blocks={sharedBlocks}
          hideDollarAmounts={hideDollarAmounts}
        />
      )}
    >
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
    </ShareComposer>
  );
};

export class ReviewShareModal extends JournalitModal {
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
      ? this.sourceView.getViewData()
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
