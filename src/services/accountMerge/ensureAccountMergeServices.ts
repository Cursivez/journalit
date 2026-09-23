

import type JournalitPlugin from '../../main';
import { AccountMergeService } from './AccountMergeService';

export async function ensureAccountMergeServices(
  plugin: JournalitPlugin
): Promise<void> {
  if (!plugin.accountPageService) {
    plugin.accountPageService =
      await plugin.serviceManager.getAccountPageService();
  }
  if (!plugin.accountMergeService) {
    plugin.accountMergeService = new AccountMergeService(plugin);
  }
}
