

import type JournalitPlugin from '../../main';
import type {
  ReviewStreakItem,
  ScheduledReviewStreakKind,
} from '../../utils/reviewStreaks';


export class ReviewStreakService {
  private readonly plugin: JournalitPlugin;

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  async getItems(kind: ScheduledReviewStreakKind): Promise<ReviewStreakItem[]> {
    switch (kind) {
      case 'drc-review':
        return (
          await this.plugin.serviceManager.getDRCService()
        ).getReviewStreakItems();
      case 'weekly-review':
        return (
          await this.plugin.serviceManager.getWeeklyReviewService()
        ).getReviewStreakItems();
      case 'monthly-review':
        return (
          await this.plugin.serviceManager.getMonthlyReviewService()
        ).getReviewStreakItems();
    }
  }
}
