

import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle,
} from '../../shared/icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';


const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

interface Trade {
  id: number;
  ticker: string;
  direction: 'LONG' | 'SHORT';
  status: 'WIN' | 'LOSS';
  pnl: string;
}

const DEMO_TRADES: Trade[] = [
  {
    id: 1,
    ticker: 'EURUSD',
    direction: 'LONG',
    status: 'WIN',
    pnl: '+$245.50',
  },
  {
    id: 2,
    ticker: 'GBPJPY',
    direction: 'SHORT',
    status: 'WIN',
    pnl: '+$180.25',
  },
  {
    id: 3,
    ticker: 'USDJPY',
    direction: 'LONG',
    status: 'LOSS',
    pnl: '-$95.00',
  },
  {
    id: 4,
    ticker: 'XAUUSD',
    direction: 'SHORT',
    status: 'WIN',
    pnl: '+$320.75',
  },
  {
    id: 5,
    ticker: 'AUDUSD',
    direction: 'LONG',
    status: 'WIN',
    pnl: '+$165.40',
  },
  {
    id: 6,
    ticker: 'EURGBP',
    direction: 'SHORT',
    status: 'LOSS',
    pnl: '-$110.25',
  },
];

const SyncingTradesGraphicComponent: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [syncingState, setSyncingState] = useState<'syncing' | 'complete'>(
    'syncing'
  );
  const [visibleTrades, setVisibleTrades] = useState<number[]>([]);
  const isMountedRef = useRef(true);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    
    isMountedRef.current = true;

    
    if (prefersReducedMotion) {
      setVisibleTrades(DEMO_TRADES.map((_, i) => i));
      setSyncingState('complete');
      return;
    }

    
    const createTimeout = (
      callback: () => void,
      delay: number
    ): Promise<void> => {
      return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            callback();
            resolve();
          }
        }, delay);
        timeoutsRef.current.push(timeoutId);
      });
    };

    
    const showTrades = async () => {
      if (!isMountedRef.current) return;

      
      setSyncingState('syncing');
      setVisibleTrades([]);

      
      for (let i = 0; i < DEMO_TRADES.length; i++) {
        if (!isMountedRef.current) return;
        await createTimeout(() => {
          setVisibleTrades((prev) => [...prev, i]);
        }, 600);
      }

      
      if (!isMountedRef.current) return;
      await createTimeout(() => {
        setSyncingState('complete');
      }, 400);

      
      if (!isMountedRef.current) return;
      await createTimeout(() => {
        showTrades();
      }, 10000);
    };

    showTrades();

    
    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, [prefersReducedMotion]);

  const directionLabels: Record<Trade['direction'], string> = {
    LONG: t('onboarding.features.graphic.direction.long'),
    SHORT: t('onboarding.features.graphic.direction.short'),
  };

  const statusLabels: Record<Trade['status'], string> = {
    WIN: t('onboarding.features.graphic.status.win'),
    LOSS: t('onboarding.features.graphic.status.loss'),
  };

  return (
    <div className="syncing-trades-graphic">
      
      <div className="sync-header">
        <div className={`sync-icon ${syncingState}`}>
          {syncingState === 'syncing' ? (
            <RefreshCw size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
        </div>
        <span className="sync-status">
          {syncingState === 'syncing'
            ? t('onboarding.features.graphic.syncing')
            : t('onboarding.features.graphic.complete')}
        </span>
      </div>

      
      <div className="trade-cards-container">
        {DEMO_TRADES.map((trade, index) => (
          <div
            key={trade.id}
            className={`trade-card-mini ${visibleTrades.includes(index) ? 'visible' : ''} ${prefersReducedMotion ? 'reduced-motion' : ''}`}
            style={cssVars({
              '--journalit-sync-card-delay': prefersReducedMotion
                ? '0ms'
                : `${index * 50}ms`,
            })}
          >
            <div className="trade-card-header">
              <span className="trade-ticker">{trade.ticker}</span>
              <span
                className={`trade-direction ${trade.direction.toLowerCase()}`}
              >
                {directionLabels[trade.direction]}
              </span>
            </div>
            <div className="trade-card-body">
              <div className="trade-pnl-row">
                <span className={`trade-pnl ${trade.status.toLowerCase()}`}>
                  {trade.status === 'WIN' ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {trade.pnl}
                </span>
                <span
                  className={`trade-status-badge ${trade.status.toLowerCase()}`}
                >
                  {statusLabels[trade.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SyncingTradesGraphic = React.memo(SyncingTradesGraphicComponent);
