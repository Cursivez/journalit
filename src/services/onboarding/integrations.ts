

import type JournalitPlugin from '../../main';
import type { OnboardingService } from './OnboardingService';

interface SampleJournalIntegration {
  
  explore: (origin: 'data-source' | 'first-trade') => Promise<void>;
}

export function resolveSampleJournalIntegration(
  plugin: JournalitPlugin,
  service: OnboardingService
): SampleJournalIntegration | null {
  const demo = plugin.demoSessionService;
  if (!demo) return null;
  return {
    explore: async (origin) => {
      await service.awaitSampleJournal(origin);
      await demo.startOrOpen();
    },
  };
}
