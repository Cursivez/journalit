import type { JournalSettingsContext } from '../../../demo/DemoSettingsScope';

export function canApplyJournalFolderEdit(
  originContext: JournalSettingsContext,
  currentContext: JournalSettingsContext
): boolean {
  return originContext === 'real' && currentContext === originContext;
}
