import type { TFile } from 'obsidian';
import type { FolderPathService } from '../core/FolderPathService';


export function isTradeIndexEligible(
  file: Pick<TFile, 'path'>,
  frontmatter: Record<string, unknown> | null | undefined,
  folderPathService: Pick<FolderPathService, 'isJournalPath'>
): boolean {
  if (
    !file.path.endsWith('.md') ||
    !folderPathService.isJournalPath(file.path)
  ) {
    return false;
  }

  if (frontmatter?.isMissedTrade) {
    return false;
  }

  if (frontmatter?.type === 'trade' || frontmatter?.type === 'backtest-trade') {
    return true;
  }

  return /\/trades\//.test(file.path);
}
