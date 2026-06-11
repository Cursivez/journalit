

import { useState, useEffect, useRef } from 'react';
import type JournalitPlugin from '../../../main';
import type { CachedReviewData } from '../../../services/reviewV2/ReviewDataCache';


interface UseReviewDataResult {
  
  data: CachedReviewData | null;
  
  loading: boolean;
  
  version: number;
  
  refresh: () => void;
}


export function useReviewData(
  filePath: string,
  plugin: JournalitPlugin
): UseReviewDataResult {
  
  
  const initialData = plugin.reviewDataCache?.get(filePath) ?? null;

  const [data, setData] = useState<CachedReviewData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [version, setVersion] = useState(initialData?.version ?? 0);

  
  const isMountedRef = useRef(true);

  
  const filePathRef = useRef(filePath);

  useEffect(() => {
    isMountedRef.current = true;
    filePathRef.current = filePath;

    const cache = plugin.reviewDataCache;
    if (!cache) {
      
      console.warn('[useReviewData] ReviewDataCache not available');
      setLoading(false);
      return;
    }

    
    const currentData = cache.get(filePath);
    if (currentData) {
      if (!data || currentData.version !== data.version) {
        setData(currentData);
        setVersion(currentData.version);
      }
      setLoading(false);
    } else {
      
      setLoading(true);
      (async () => {
        try {
          await cache.populate(filePath);
          if (!isMountedRef.current || filePathRef.current !== filePath) return;

          const populatedData = cache.get(filePath);
          setData(populatedData);
          setVersion(populatedData?.version ?? 0);
          setLoading(false);
        } catch (error) {
          console.error('[useReviewData] Failed to populate cache:', error);
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      })();
    }

    
    const unsubscribe = cache.subscribe(filePath, (newData) => {
      if (!isMountedRef.current || filePathRef.current !== filePath) return;

      setData(newData);
      setVersion(newData?.version ?? 0);
      
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- data intentionally excluded: subscription handles updates via callback, including data would cause redundant unsubscribe/resubscribe cycles
  }, [filePath, plugin]);

  
  const refresh = () => {
    const cache = plugin.reviewDataCache;
    if (!cache) return;

    setLoading(true);
    (async () => {
      try {
        await cache.populate(filePath);
        if (!isMountedRef.current) return;

        const refreshedData = cache.get(filePath);
        setData(refreshedData);
        setVersion(refreshedData?.version ?? 0);
        setLoading(false);
      } catch (error) {
        console.error('[useReviewData] Failed to refresh cache:', error);
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    })();
  };

  return { data, loading, version, refresh };
}


export function useReviewTrades(
  filePath: string,
  plugin: JournalitPlugin
): {
  trades: CachedReviewData['trades'];
  entryBasisTrades: CachedReviewData['trades'];
  analyticsBasisTrades: CachedReviewData['trades'];
  sessionMistakesByTradingDay: CachedReviewData['sessionMistakesByTradingDay'];
  loading: boolean;
  filters: CachedReviewData['filters'] | null;
  dateRange: CachedReviewData['dateRange'] | null;
  noteType: CachedReviewData['noteType'] | null;
  currencyConversion: CachedReviewData['currencyConversion'] | null;
  refresh: () => void;
} {
  const { data, loading, refresh } = useReviewData(filePath, plugin);
  const entryBasisTrades = data?.trades ?? [];
  const analyticsBasisTrades = data?.analyticsBasisTrades ?? entryBasisTrades;

  return {
    trades: analyticsBasisTrades,
    entryBasisTrades,
    analyticsBasisTrades,
    sessionMistakesByTradingDay: data?.sessionMistakesByTradingDay ?? {},
    loading,
    filters: data?.filters ?? null,
    dateRange: data?.dateRange ?? null,
    noteType: data?.noteType ?? null,
    currencyConversion: data?.currencyConversion ?? null,
    refresh,
  };
}
