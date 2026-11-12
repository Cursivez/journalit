import { useState } from 'react';
import type JournalitPlugin from '../../../main';


export type KeyEventsDayRow = 'news-question' | 'no-news' | null;

interface UseKeyEventsNoNewsOptions {
  plugin: JournalitPlugin;
  filePath: string;
  isDrc: boolean;
  
  canAddFromDrc: boolean;
  eventCount: number;
}

function resolveDayRow(
  isDrc: boolean,
  canAddFromDrc: boolean,
  hasNoEvents: boolean,
  isMarked: boolean
): KeyEventsDayRow {
  if (!isDrc || !hasNoEvents) return null;
  if (isMarked) return 'no-news';
  
  return canAddFromDrc ? 'news-question' : null;
}


export function useKeyEventsNoNews({
  plugin,
  filePath,
  isDrc,
  canAddFromDrc,
  eventCount,
}: UseKeyEventsNoNewsOptions) {
  const [isMarked, setIsMarked] = useState(false);
  const hasNoEvents = eventCount === 0;

  
  const setNoNews = async (noNews: boolean) => {
    setIsMarked(noNews);
    try {
      await plugin.drcService.setKeyEventsNoNews(filePath, noNews);
    } catch (error) {
      console.error('[KeyEventsWidget] Failed to update no-news mark:', error);
      setIsMarked(!noNews);
    }
  };

  
  const clearAfterEventAdded = async () => {
    if (isMarked) await setNoNews(false);
  };

  return {
    clearAfterEventAdded,
    
    setIsMarked,
    setNoNews,
    dayRow: resolveDayRow(isDrc, canAddFromDrc, hasNoEvents, isMarked),
  };
}
