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

  if (frontmatter?.isMissedTrade || frontmatter?.type === 'missed-trade') {
    return false;
  }

  if (frontmatter?.type === 'trade' || frontmatter?.type === 'backtest-trade') {
    return true;
  }

  return /\/trades\//.test(file.path);
}


export function isMissedTradeNote(
  file: Pick<TFile, 'path'>,
  frontmatter: Record<string, unknown> | null | undefined,
  folderPathService: Pick<FolderPathService, 'isJournalPath'>
): boolean {
  return (
    file.path.endsWith('.md') &&
    /\/trades\//.test(file.path) &&
    folderPathService.isJournalPath(file.path) &&
    (frontmatter?.type === 'missed-trade' ||
      Boolean(frontmatter?.isMissedTrade))
  );
}
