import type { App, TFile } from 'obsidian';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import { eventBus } from '../events/EventBus';

type ReviewType = 'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface CreatedReview {
  file: TFile;
  type: ReviewType;
}


export class ReviewCreationBatch {
  private created: CreatedReview[] = [];
  private closed = false;
  private published = false;

  constructor(private readonly app: App) {}

  public register(file: TFile, type: ReviewType): void {
    if (this.closed) {
      throw new Error(
        'Cannot register a review after its creation batch flushed'
      );
    }
    this.created.push({ file, type });
  }

  public async flush(): Promise<void> {
    if (this.published) return;
    this.closed = true;
    await Promise.all(
      this.created.map(({ file }) => forceMetadataCacheRefresh(this.app, file))
    );
    this.published = true;
    const pathsByType = new Map<ReviewType, string[]>();
    for (const { file, type } of this.created) {
      const paths = pathsByType.get(type) ?? [];
      paths.push(file.path);
      pathsByType.set(type, paths);
    }
    for (const [type, filePaths] of pathsByType) {
      eventBus.publish('review:changed', {
        type,
        action: 'created',
        filePaths,
        source: 'sample-journal',
      });
    }
  }

  public async abandon(): Promise<void> {
    if (this.published) return;
    this.closed = true;
    await Promise.allSettled(
      this.created.map(({ file }) => forceMetadataCacheRefresh(this.app, file))
    );
    this.created = [];
  }
}
