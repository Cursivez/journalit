import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Component, MarkdownRenderer, TFile } from 'obsidian';

import type JournalitPlugin from '../../main';
import type { Setup } from '../../services/setup/types';
import { replaceSetupLinkedNotePath } from '../../services/setup/linkedNotePaths';
import { getSetupHistoryDateRange } from '../../services/setup/setupHistoryRange';
import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { useGuideAction, useGuideTarget } from '../../guides/GuideRuntimeLayer';
import {
  SETUPS_BACK_BUTTON_TARGET_ID,
  SETUPS_DETAIL_ACTIONS_TARGET_ID,
  SETUPS_DETAIL_CONTEXT_TARGET_ID,
  SETUPS_DETAIL_HEADER_TARGET_ID,
  SETUPS_DETAIL_PLAYBOOK_TARGET_ID,
  SETUPS_OVERVIEW_OPENED_ACTION_ID,
} from '../../guides/setupsGuideIds';
import { openTradeLogWithFilters } from '../../utils/openTradeLogWithFilters';
import { openImageGalleryWithFilters } from '../../utils/openImageGalleryWithFilters';
import { FullscreenImageViewer } from '../image/FullscreenImageViewer';
import { FullscreenPortal } from '../image/FullscreenPortal';
import { MediaPreview } from '../image/MediaPreview';
import { EmbeddedMarkdownNote } from '../shared/EmbeddedMarkdownNote';
import {
  CheckCircle2,
  Edit,
  ExternalLink,
  FolderOpen,
  Image,
  MoveLeft,
  Plus,
  ScanSearch,
} from '../shared/icons/ObsidianIcon';
import { SetupStatusBadge } from './SetupStatusBadge';
import { SetupRulesPanel } from './SetupRulesPanel';
import { SetupDetailPerformanceSection } from './SetupDetailPerformanceSection';
import type {
  SetupLinkedTrade,
  SetupViewModel,
  SetupsViewState,
} from './setupsViewTypes';
import {
  buildSetupAttentionItems,
  getRecentSetupScreenshots,
  getSetupBriefHealthItems,
  getSetupBriefProfileRows,
  getSetupTradeLogFilterLabels,
  openSetupLinkedNote,
  openSetupLinkedNotePath,
  openSetupLinkedNotesModal,
  openSetupPlaybookNoteModal,
  triggerSetupLinkedNoteHover,
} from './setupsViewModel';

export const SetupDetailPage: React.FC<{
  hoverParent: Component;
  plugin: JournalitPlugin;
  viewModel: SetupViewModel;
  linkedTrades: SetupLinkedTrade[];
  onBack: () => void;
  onEditSetup: (setup: Setup) => void;
}> = ({
  hoverParent,
  plugin,
  viewModel,
  linkedTrades,
  onBack,
  onEditSetup,
}) => {
  const { setup } = viewModel;
  const emitGuideAction = useGuideAction();
  const registerBackButtonTarget = useGuideTarget(SETUPS_BACK_BUTTON_TARGET_ID);
  const registerDetailHeaderTarget = useGuideTarget(
    SETUPS_DETAIL_HEADER_TARGET_ID
  );
  const registerDetailActionsTarget = useGuideTarget(
    SETUPS_DETAIL_ACTIONS_TARGET_ID
  );
  const handleBack = () => {
    onBack();
    emitGuideAction(SETUPS_OVERVIEW_OPENED_ACTION_ID);
  };
  const handleViewTrades = () => {
    void openTradeLogWithFilters(plugin, {
      setups: getSetupTradeLogFilterLabels(setup),
    });
  };
  const handleViewGallery = () => {
    void openImageGalleryWithFilters(plugin, {
      setups: getSetupTradeLogFilterLabels(setup),
    });
  };

  return (
    <div className="journalit-setups-view">
      <header
        className="journalit-setups-detail-header"
        ref={registerDetailHeaderTarget}
      >
        <div className="journalit-setups-detail-header__back">
          <button
            className="journalit-setups-detail-back-button"
            onClick={handleBack}
            ref={registerBackButtonTarget}
          >
            <MoveLeft size={15} strokeWidth={2} aria-hidden="true" />
            {t('setups.view.detail.back')}
          </button>
        </div>
        <div className="journalit-setups-detail-header__identity">
          <h1 className="journalit-setups-view__title">{setup.name}</h1>
          <div className="journalit-setups-badges">
            <SetupStatusBadge status={setup.status} />
          </div>
        </div>
        <div className="journalit-setups-detail-header__actions">
          <div
            className="journalit-setups-detail-header__action-buttons"
            ref={registerDetailActionsTarget}
          >
            <button
              aria-label={t('setups.view.detail.action.view-trades')}
              className="journalit-setups-icon-button journalit-setups-detail-action-icon"
              onClick={handleViewTrades}
            >
              <ScanSearch size={15} />
            </button>
            <button
              aria-label={t('setups.view.detail.action.gallery')}
              className="journalit-setups-icon-button journalit-setups-detail-action-icon"
              onClick={handleViewGallery}
            >
              <Image size={15} />
            </button>
            <button
              aria-label={t('setups.view.detail.action.edit')}
              className="journalit-setups-icon-button journalit-setups-detail-action-icon journalit-setups-detail-action-icon--primary"
              onClick={() => onEditSetup(setup)}
            >
              <Edit size={15} />
            </button>
          </div>
        </div>
      </header>

      <SetupDetailScaffold
        hoverParent={hoverParent}
        plugin={plugin}
        viewModel={viewModel}
        linkedTrades={linkedTrades}
        onEditSetup={onEditSetup}
      />
    </div>
  );
};

SetupDetailPage.displayName = 'SetupDetailPage';

export function openSetupsOverview(
  _plugin: JournalitPlugin,
  onStateChange: (state: SetupsViewState) => void
): void {
  onStateChange({ page: 'overview' });
}

export async function loadSetupMissedTradeData(
  plugin: JournalitPlugin
): Promise<Array<Record<string, unknown>>> {
  const missedTradeService =
    await plugin.serviceManager.getMissedTradeService();
  const { startDate, endDate } = getSetupHistoryDateRange();
  const files = await missedTradeService.getMissedTrades(startDate, endDate);

  return Promise.all(
    files.map(async (file) => ({
      ...(await plugin.tradeService.readFrontmatter(file)),
      path: file.path,
    }))
  );
}

export async function loadSetupBacktestTradeData(
  plugin: JournalitPlugin
): Promise<unknown[]> {
  const backtestTradeService =
    await plugin.serviceManager.getBacktestTradeService();
  const { startDate, endDate } = getSetupHistoryDateRange();
  return backtestTradeService.getBacktestTrades(startDate, endDate);
}

const SetupDetailScaffold: React.FC<{
  hoverParent: Component;
  plugin: JournalitPlugin;
  viewModel: SetupViewModel;
  linkedTrades: SetupLinkedTrade[];
  onEditSetup: (setup: Setup) => void;
}> = ({ hoverParent, plugin, viewModel, linkedTrades, onEditSetup }) => {
  return (
    <div className="journalit-setups-detail-scaffold">
      <SetupDetailPerformanceSection
        plugin={plugin}
        viewModel={viewModel}
        linkedTrades={linkedTrades}
      />

      <SetupBriefPanel
        hoverParent={hoverParent}
        plugin={plugin}
        viewModel={viewModel}
        linkedTrades={linkedTrades}
        onEditSetup={onEditSetup}
      />

      <SetupPlaybookPanel plugin={plugin} setup={viewModel.setup} />

      <SetupRulesPanel plugin={plugin} setup={viewModel.setup} />
    </div>
  );
};

SetupDetailScaffold.displayName = 'SetupDetailScaffold';

export const SetupInlinePlaybook: React.FC<{
  plugin: JournalitPlugin;
  setup: Setup;
}> = ({ plugin, setup }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const component = new Component();
    component.load();
    container.replaceChildren();
    void MarkdownRenderer.render(
      plugin.app,
      setup.playbookMarkdown,
      container,
      setup.filePath ?? '',
      component
    ).catch((error: unknown) => {
      console.error('Failed to render setup playbook markdown:', error);
    });

    return () => {
      component.unload();
      container.replaceChildren();
    };
  }, [plugin.app, setup.filePath, setup.playbookMarkdown]);

  return (
    <div
      ref={containerRef}
      className="journalit-setups-playbook-note-embed journalit-setups-playbook-note-embed__content markdown-rendered"
    />
  );
};

SetupInlinePlaybook.displayName = 'SetupInlinePlaybook';

export const SetupPlaybookPanel: React.FC<{
  plugin: JournalitPlugin;
  setup: Setup;
}> = ({ plugin, setup }) => {
  const registerDetailPlaybookTarget = useGuideTarget(
    SETUPS_DETAIL_PLAYBOOK_TARGET_ID
  );
  const [selectedPlaybookNotePath, setSelectedPlaybookNotePath] = useState(
    setup.linkedNotes[0] ?? ''
  );
  const [playbookNoteHasContent, setPlaybookNoteHasContent] = useState(false);
  useEffect(() => {
    setSelectedPlaybookNotePath(setup.linkedNotes[0] ?? '');
    setPlaybookNoteHasContent(false);
  }, [setup.id, setup.linkedNotes]);
  const [fullscreenPlaybookMediaPath, setFullscreenPlaybookMediaPath] =
    useState<string | null>(null);

  const handleLinkPlaybookNote = useCallback(() => {
    openSetupPlaybookNoteModal(plugin, setup, setSelectedPlaybookNotePath);
  }, [plugin, setup]);
  const handleOpenPlaybookNote = useCallback(() => {
    if (!selectedPlaybookNotePath) return;
    void openSetupLinkedNotePath(
      plugin,
      selectedPlaybookNotePath,
      setup.filePath ?? ''
    );
  }, [plugin, selectedPlaybookNotePath, setup.filePath]);
  const handlePlaybookNoteRename = useCallback(
    async (renamedFile: TFile, oldPath: string) => {
      const linkedNotes = replaceSetupLinkedNotePath(
        setup.linkedNotes,
        oldPath,
        renamedFile.path
      );
      setSelectedPlaybookNotePath(renamedFile.path);
      const setupService = await plugin.serviceManager.getSetupService();
      await setupService.updateSetup(setup.id, { linkedNotes });
    },
    [plugin, setup.id, setup.linkedNotes]
  );

  return (
    <>
      <section
        className="journalit-setups-detail-scaffold__panel journalit-setups-detail-scaffold__playbook journalit-setups-playbook-notebook"
        ref={registerDetailPlaybookTarget}
      >
        <header className="journalit-setups-playbook-notebook__header">
          <h2>{t('setups.view.detail.playbook')}</h2>
          <div className="journalit-setups-playbook-notebook__actions">
            {selectedPlaybookNotePath && playbookNoteHasContent ? (
              <button
                type="button"
                className="journalit-setups-icon-button journalit-setups-detail-action-icon"
                onClick={handleOpenPlaybookNote}
                aria-label={t('home.widget.embedded-note.open-note')}
              >
                <ExternalLink size={15} />
              </button>
            ) : null}
            <button
              type="button"
              className="journalit-setups-icon-button journalit-setups-detail-action-icon"
              onClick={handleLinkPlaybookNote}
              aria-label={
                selectedPlaybookNotePath
                  ? t('setups.view.detail.change-playbook-note')
                  : t('setups.view.detail.link-playbook-note')
              }
            >
              {selectedPlaybookNotePath ? (
                <FolderOpen size={15} />
              ) : (
                <Plus size={15} />
              )}
            </button>
          </div>
        </header>

        {!selectedPlaybookNotePath && setup.playbookMarkdown.trim() ? (
          <SetupInlinePlaybook plugin={plugin} setup={setup} />
        ) : !selectedPlaybookNotePath ? (
          <p className="journalit-setups-playbook-notebook__empty">
            {t('setups.view.detail.no-playbook-note')}
          </p>
        ) : (
          <EmbeddedMarkdownNote
            key={selectedPlaybookNotePath}
            plugin={plugin}
            filePath={selectedPlaybookNotePath}
            sourcePath={setup.filePath ?? ''}
            className="journalit-setups-playbook-note-embed"
            contentClassName="journalit-setups-playbook-note-embed__content"
            emptyMessage={t('setups.view.detail.empty-playbook-note')}
            onOpenMedia={setFullscreenPlaybookMediaPath}
            onContentStateChange={setPlaybookNoteHasContent}
            onFileRename={handlePlaybookNoteRename}
          />
        )}
      </section>

      {fullscreenPlaybookMediaPath ? (
        <FullscreenPortal
          isOpen={Boolean(fullscreenPlaybookMediaPath)}
          onClose={() => setFullscreenPlaybookMediaPath(null)}
          className="journalit-setup-fullscreen-portal"
        >
          <FullscreenImageViewer
            imagePath={fullscreenPlaybookMediaPath}
            onClose={() => setFullscreenPlaybookMediaPath(null)}
            useResolveMediaPath
            sourcePath={selectedPlaybookNotePath}
            navigationContext={{
              images: [fullscreenPlaybookMediaPath],
              currentIndex: 0,
              onNavigate: () => undefined,
              sourcePath: selectedPlaybookNotePath,
            }}
          />
        </FullscreenPortal>
      ) : null}
    </>
  );
};

SetupPlaybookPanel.displayName = 'SetupPlaybookPanel';

const SetupBriefPanel: React.FC<{
  hoverParent: Component;
  plugin: JournalitPlugin;
  viewModel: SetupViewModel;
  linkedTrades: SetupLinkedTrade[];
  onEditSetup: (setup: Setup) => void;
}> = ({ hoverParent, plugin, viewModel, linkedTrades, onEditSetup }) => {
  const { setup } = viewModel;
  const registerDetailContextTarget = useGuideTarget(
    SETUPS_DETAIL_CONTEXT_TARGET_ID
  );
  const [fullscreenScreenshotIndex, setFullscreenScreenshotIndex] = useState<
    number | null
  >(null);
  const screenshots = getRecentSetupScreenshots(linkedTrades);
  const healthItems = getSetupBriefHealthItems(
    setup,
    linkedTrades.length,
    screenshots.length
  );
  const completedHealthItems = healthItems.filter((item) => item.complete);
  const healthPercent = Math.round(
    (completedHealthItems.length / Math.max(1, healthItems.length)) * 100
  );
  const profileRows = getSetupBriefProfileRows(setup);
  const profilePreviewRows = profileRows.slice(0, 3);
  const hiddenProfileCount = Math.max(0, profileRows.length - 3);
  const hasHiddenNotes = setup.linkedNotes.length > 3;
  const notesPreview = setup.linkedNotes.slice(0, hasHiddenNotes ? 2 : 3);
  const hiddenNotes = setup.linkedNotes.slice(2);
  const screenshotPreview = screenshots.slice(0, 3);
  const countItems = [
    splitCountLabel(
      t('setups.view.detail.brief.count.rules', {
        count: String(setup.rules.length),
      })
    ),
    splitCountLabel(
      t('setups.view.detail.brief.count.notes', {
        count: String(setup.linkedNotes.length),
      })
    ),
    splitCountLabel(
      t('setups.view.detail.brief.count.images', {
        count: String(screenshots.length),
      })
    ),
    splitCountLabel(
      t('setups.view.detail.brief.count.trades', {
        count: String(linkedTrades.length),
      })
    ),
  ];

  const currentFullscreenIndex =
    fullscreenScreenshotIndex === null
      ? 0
      : Math.min(fullscreenScreenshotIndex, screenshots.length - 1);
  const currentFullscreenScreenshot = screenshots[currentFullscreenIndex];

  return (
    <>
      <aside
        className="journalit-setups-detail-scaffold__evidence journalit-setups-detail-scaffold__panel journalit-setups-brief"
        ref={registerDetailContextTarget}
      >
        <section className="journalit-setups-brief__section">
          <div className="journalit-setups-brief__section-header">
            <h2>{t('setups.view.detail.brief.health')}</h2>
            <span className="journalit-setups-brief__health-value">
              {healthPercent}%
            </span>
          </div>
          <div
            className="journalit-setups-brief__health-bar"
            aria-hidden="true"
          >
            {healthItems.map((item) => (
              <span
                className={
                  item.complete
                    ? 'journalit-setups-brief__health-segment journalit-setups-brief__health-segment--complete'
                    : 'journalit-setups-brief__health-segment'
                }
                key={item.key}
              />
            ))}
          </div>
          <div className="journalit-setups-brief__count-rail">
            {countItems.map((item) => (
              <span key={`${item.value}-${item.label}`}>
                <strong>{item.value}</strong>
                {item.label ? <span>{item.label}</span> : null}
              </span>
            ))}
          </div>
        </section>

        <SetupNeedsAttentionPanel
          viewModel={viewModel}
          linkedTrades={linkedTrades}
        />

        {profilePreviewRows.length > 0 ? (
          <section className="journalit-setups-brief__section">
            <h2>{t('setups.view.detail.brief.profile')}</h2>
            <dl className="journalit-setups-brief__profile-list">
              {profilePreviewRows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            {hiddenProfileCount > 0 ? (
              <span className="journalit-setups-brief__more-note">
                {t('setups.view.detail.brief.more', {
                  count: String(hiddenProfileCount),
                })}
              </span>
            ) : null}
          </section>
        ) : null}

        <section className="journalit-setups-brief__section">
          <div className="journalit-setups-brief__section-header">
            <h2>
              {t('setups.view.detail.brief.linked-notes', {
                count: String(setup.linkedNotes.length),
              })}
            </h2>
            <button
              type="button"
              aria-label={t('setups.view.detail.brief.linked-notes-add')}
              className="journalit-setups-icon-button journalit-setups-brief__section-action"
              onClick={() => onEditSetup(setup)}
            >
              <Plus size={14} strokeWidth={2.1} aria-hidden="true" />
            </button>
          </div>
          {notesPreview.length === 0 ? (
            <p className="journalit-setups-muted">
              {t('setups.view.detail.no-linked-notes')}
            </p>
          ) : (
            <ul className="journalit-setups-brief__notes-list">
              {notesPreview.map((note) => (
                <li key={note}>
                  <a
                    className="journalit-setups-brief__note-link"
                    data-href={note}
                    href={note}
                    onClick={(event) =>
                      void openSetupLinkedNote(
                        plugin,
                        event,
                        note,
                        setup.filePath ?? ''
                      )
                    }
                    onMouseOver={(event) =>
                      triggerSetupLinkedNoteHover({
                        plugin,
                        event: event.nativeEvent,
                        hoverParent,
                        targetEl: event.currentTarget,
                        linktext: note,
                        sourcePath: setup.filePath ?? '',
                      })
                    }
                  >
                    {note}
                  </a>
                </li>
              ))}
              {hasHiddenNotes ? (
                <li>
                  <span
                    className="journalit-setups-brief__more-note"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      openSetupLinkedNotesModal(
                        plugin,
                        setup.name,
                        setup.filePath ?? '',
                        setup.linkedNotes
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      event.preventDefault();
                      openSetupLinkedNotesModal(
                        plugin,
                        setup.name,
                        setup.filePath ?? '',
                        setup.linkedNotes
                      );
                    }}
                  >
                    {t('setups.view.detail.brief.more', {
                      count: String(hiddenNotes.length),
                    })}
                  </span>
                </li>
              ) : null}
            </ul>
          )}
        </section>

        <section className="journalit-setups-brief__section journalit-setups-brief__screenshots-section">
          <div className="journalit-setups-brief__section-header">
            <h2>
              {t('setups.view.detail.brief.screenshots', {
                count: String(screenshots.length),
              })}
            </h2>
          </div>
          {screenshotPreview.length === 0 ? (
            <p className="journalit-setups-muted">
              {t('setups.view.detail.brief.no-screenshots')}
            </p>
          ) : (
            <div className="journalit-setups-brief__screenshot-grid">
              {screenshotPreview.map((screenshot, index) => (
                <button
                  aria-label={t('setups.view.detail.brief.screenshot-open', {
                    index: String(index + 1),
                  })}
                  className="journalit-setups-brief__screenshot-button"
                  key={screenshot.key}
                  onClick={() => setFullscreenScreenshotIndex(index)}
                >
                  <MediaPreview
                    app={plugin.app}
                    alt={t('setups.view.detail.brief.screenshot-alt', {
                      index: String(index + 1),
                    })}
                    displayPath={screenshot.imagePath}
                    imageClassName="journalit-setups-brief__screenshot"
                    path={screenshot.imagePath}
                    sourcePath={screenshot.sourcePath}
                    useResolveMediaPath
                  />
                </button>
              ))}
            </div>
          )}
        </section>
      </aside>

      <FullscreenPortal
        isOpen={fullscreenScreenshotIndex !== null}
        onClose={() => setFullscreenScreenshotIndex(null)}
        portalId="journalit-setups-screenshot-fullscreen-portal"
      >
        {currentFullscreenScreenshot ? (
          <FullscreenImageViewer
            alt={t('setups.view.detail.brief.screenshot-alt', {
              index: String(currentFullscreenIndex + 1),
            })}
            imagePath={currentFullscreenScreenshot.imagePath}
            sourcePath={currentFullscreenScreenshot.sourcePath}
            navigationContext={{
              images: screenshots.map((screenshot) => screenshot.imagePath),
              currentIndex: currentFullscreenIndex,
              onNavigate: setFullscreenScreenshotIndex,
              altPrefix: setup.name,
              useResolveMediaPath: true,
              sourcePath: currentFullscreenScreenshot.sourcePath,
            }}
            onClose={() => setFullscreenScreenshotIndex(null)}
            useResolveMediaPath
          />
        ) : null}
      </FullscreenPortal>
    </>
  );
};

SetupBriefPanel.displayName = 'SetupBriefPanel';

const SetupNeedsAttentionPanel: React.FC<{
  viewModel: SetupViewModel;
  linkedTrades: SetupLinkedTrade[];
}> = ({ viewModel, linkedTrades }) => {
  const { shouldMask } = useDisplayFormatter();
  const [isExpanded, setIsExpanded] = useState(false);
  const screenshotCount = getRecentSetupScreenshots(linkedTrades).length;
  const isPerformanceMasked = shouldMask('pnl') || shouldMask('metric');
  const items = useMemo(
    () =>
      buildSetupAttentionItems(
        viewModel,
        linkedTrades,
        screenshotCount,
        isPerformanceMasked
      ),
    [isPerformanceMasked, linkedTrades, screenshotCount, viewModel]
  );
  const visibleAttentionLimit = 2;
  const hiddenItemCount = Math.max(0, items.length - visibleAttentionLimit);
  const visibleItems = isExpanded
    ? items
    : items.slice(0, visibleAttentionLimit);

  useEffect(() => {
    setIsExpanded(false);
  }, [viewModel.setup.id]);

  if (items.length === 0) return null;

  return (
    <section className="journalit-setups-brief__attention journalit-setups-needs-attention">
      <header className="journalit-setups-needs-attention__header">
        <h2>{t('setups.view.detail.attention.title')}</h2>
        {items.length > 0 ? (
          <span className="journalit-setups-needs-attention__count">
            {t('setups.view.detail.attention.count', {
              count: String(items.length),
            })}
          </span>
        ) : null}
      </header>

      {visibleItems.length === 0 ? (
        <div className="journalit-setups-needs-attention__empty">
          <CheckCircle2 size={16} strokeWidth={2.1} aria-hidden="true" />
          <span>{t('setups.view.detail.attention.empty')}</span>
        </div>
      ) : (
        <ul className="journalit-setups-needs-attention__list">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                className={`journalit-setups-needs-attention__item journalit-setups-needs-attention__item--${item.severity}`}
                key={item.key}
              >
                <span className="journalit-setups-needs-attention__icon">
                  <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
                </span>
                <span className="journalit-setups-needs-attention__content">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </span>
              </li>
            );
          })}
          {hiddenItemCount > 0 ? (
            <li className="journalit-setups-needs-attention__more-row">
              <button
                type="button"
                className="journalit-setups-needs-attention__more-button"
                onClick={() => setIsExpanded((expanded) => !expanded)}
              >
                {isExpanded
                  ? t('setups.view.detail.attention.show-less')
                  : t('setups.view.detail.attention.show-more', {
                      count: String(hiddenItemCount),
                    })}
              </button>
            </li>
          ) : null}
        </ul>
      )}
    </section>
  );
};

SetupNeedsAttentionPanel.displayName = 'SetupNeedsAttentionPanel';

function splitCountLabel(text: string): { value: string; label: string } {
  const [value, ...labelParts] = text.split(' ');

  return {
    value,
    label: labelParts.join(' '),
  };
}
