

import { App } from 'obsidian';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { MarkdownViewHeaderAction } from '../MarkdownViewHeaderAction';
import { SHARE_IMAGE_ACTION_ICON } from '../shareActionIcon';
import { ReviewShareModal } from './ReviewShareModal';

const SHAREABLE_REVIEW_TYPES: ReadonlySet<unknown> = new Set([
  'drc',
  'weekly-review',
  'monthly-review',
  'quarterly-review',
  'yearly-review',
]);

export class ReviewShareAction {
  private readonly headerAction: MarkdownViewHeaderAction;

  constructor(app: App, plugin: JournalitPlugin) {
    this.headerAction = new MarkdownViewHeaderAction(app, plugin, {
      icon: SHARE_IMAGE_ACTION_ICON,
      title: () => t('share.review.action'),
      appliesTo: (file) =>
        SHAREABLE_REVIEW_TYPES.has(
          app.metadataCache.getFileCache(file)?.frontmatter?.type
        ),
      onClick: (view, file) => {
        new ReviewShareModal(app, plugin, file, view).open();
      },
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
}
