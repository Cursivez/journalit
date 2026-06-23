

import { useEffect, useReducer, useRef } from 'react';
import type JournalitPlugin from '../../../main';
import type { CachedReviewData } from '../../../services/reviewV2/ReviewDataCache';


interface UseReviewDataResult {
  
  data: CachedReviewData | null;
  
  loading: boolean;
  
  version: number;
  
  refresh: () => void;
}

interface ReviewDataState {
  data: CachedReviewData | null;
  loading: boolean;
  version: number;
}

type ReviewDataAction =
  | { type: 'loading'; loading: boolean }
  | { type: 'loaded'; data: CachedReviewData | null }
  | { type: 'cache-update'; data: CachedReviewData | null };

const reviewDataReducer = (
  state: ReviewDataState,
  action: ReviewDataAction
): ReviewDataState => {
  switch (action.type) {
    case 'loading':
      return state.loading === action.loading
        ? state
        : { ...state, loading: action.loading };
    case 'loaded':
      return {
        data: action.data,
        loading: false,
        version: action.data?.version ?? 0,
      };
    case 'cache-update':
      return {
        ...state,
        data: action.data,
        version: action.data?.version ?? 0,
      };
  }
};


export function useReviewData(
  filePath: string,
  plugin: JournalitPlugin
): UseReviewDataResult {
  
  
  const initialData = plugin.reviewDataCache?.get(filePath) ?? null;

  const [state, dispatch] = useReducer(reviewDataReducer, {
    data: initialData,
    loading: !initialData,
    version: initialData?.version ?? 0,
  });
  const { data, loading, version } = state;

  
  const isMountedRef = useRef(true);

  
  const filePathRef = useRef(filePath);

  useEffect(() => {
    isMountedRef.current = true;
    filePathRef.current = filePath;

    const cache = plugin.reviewDataCache;
    if (!cache) {
      
      console.warn('[useReviewData] ReviewDataCache not available');
      dispatch({ type: 'loading', loading: false });
      return;
    }

    
    const currentData = cache.get(filePath);
    if (currentData) {
      if (!data || currentData.version !== data.version) {
        dispatch({ type: 'loaded', data: currentData });
      } else {
        dispatch({ type: 'loading', loading: false });
      }
    } else {
      
      dispatch({ type: 'loading', loading: true });
      void (async () => {
        try {
          await cache.populate(filePath);
          if (!isMountedRef.current || filePathRef.current !== filePath) return;

          const populatedData = cache.get(filePath);
          dispatch({ type: 'loaded', data: populatedData });
        } catch (error) {
          console.error('[useReviewData] Failed to populate cache:', error);
          if (isMountedRef.current) {
            dispatch({ type: 'loading', loading: false });
          }
        }
      })();
    }

    
    const unsubscribe = cache.subscribe(filePath, (newData) => {
      if (!isMountedRef.current || filePathRef.current !== filePath) return;

      dispatch({ type: 'cache-update', data: newData });
      
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

    dispatch({ type: 'loading', loading: true });
    void (async () => {
      try {
        await cache.populate(filePath);
        if (!isMountedRef.current) return;

        const refreshedData = cache.get(filePath);
        dispatch({ type: 'loaded', data: refreshedData });
      } catch (error) {
        console.error('[useReviewData] Failed to refresh cache:', error);
        if (isMountedRef.current) {
          dispatch({ type: 'loading', loading: false });
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
