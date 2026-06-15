

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TFile } from 'obsidian';
import { TradeFormData } from '../forms/trade/types';
import { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import { usePlugin } from '../../hooks/usePlugin';
import { useAccountPageService } from '../../hooks/useService';
import { useEventBus } from '../../hooks/useEventBus';
import { TradeNavigation } from './TradeNavigation';
import {
  TradeHeader,
  TradeImageSection,
  TradeMetadataSection,
  TradeDetailsSection,
  TradeCustomFieldsSection,
} from './components';
import { useTradeMetrics } from './hooks';
import { TradeReview } from './LossReview';
import { LossReviewData } from '../../services/backend/types';
import { TradeTemplateService } from '../../services/templates/TradeTemplateService';
import { TradeTemplate } from '../../types/reviewV2';
import {
  getTradingDayRange,
  getTradingDayString,
} from '../../utils/tradingDayUtils';
import { ReviewButton } from '../shared/ReviewButton';
import { isTradeOpenWithContext } from '../../utils/tradeStatusUtils';
import { t } from '../../lang/helpers';
import {
  fetchBreakEvenAccountBalanceLookup,
  resolveBreakEvenAccountBalances,
} from '../../services/trade/core/BreakEvenAccountBalance';

const TRADE_NAV_CACHE_PREFIX = 'trade-nav-';

const parseTradeNavigationCache = (
  value: unknown
): { trades: string[]; missedTrades: string[] } | null => {
  if (Array.isArray(value)) {
    return {
      trades: value.filter((item): item is string => typeof item === 'string'),
      missedTrades: [],
    };
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = Object.fromEntries(Object.entries(value));
  return {
    trades: Array.isArray(record.trades)
      ? record.trades.filter((item): item is string => typeof item === 'string')
      : [],
    missedTrades: Array.isArray(record.missedTrades)
      ? record.missedTrades.filter(
          (item): item is string => typeof item === 'string'
        )
      : [],
  };
};

interface TradeNoteProps {
  data: PartialTradeFrontmatter;
  onEditClick?: (data: TradeNoteProps['data']) => void;
  onDataUpdate?: (updatedData: Partial<TradeFormData>) => void;
}

export const TradeNote: React.FC<TradeNoteProps> = React.memo(
  function TradeNote({ data, onEditClick }) {
    
    const [filePath, setFilePath] = useState<string>(
      data.filePath || 'unknown'
    );

    
    const [reviewStatus, setReviewStatus] = useState({
      reviewed: data.reviewed,
      reviewedAt: data.reviewedAt,
    });

    
    const [templateRefreshKey, setTemplateRefreshKey] = useState(0);

    
    useEventBus('trade-template:changed', () => {
      setTemplateRefreshKey((k) => k + 1);
    });

    
    useEffect(() => {
      setReviewStatus({
        reviewed: data.reviewed,
        reviewedAt: data.reviewedAt,
      });
    }, [data.reviewed, data.reviewedAt]);

    
    const containerRef = useRef<HTMLDivElement>(null);

    
    const plugin = usePlugin();
    const { service: accountPageService } = useAccountPageService();

    const [breakEvenAccountCurrentBalance, setBreakEvenAccountCurrentBalance] =
      useState<number | undefined>(undefined);
    const [accountBalanceRefreshKey, setAccountBalanceRefreshKey] = useState(0);

    useEventBus('account:changed', () => {
      setAccountBalanceRefreshKey((key) => key + 1);
    });

    const tradeAccountIdentityInput = React.useMemo(
      () => ({
        account: data.account,
        accountId: data.accountId,
        backendTradeId: data.backendTradeId,
      }),
      [data.account, data.accountId, data.backendTradeId]
    );

    useEffect(() => {
      let isMounted = true;

      const resolveBreakEvenBalance = async () => {
        if (
          !accountPageService ||
          (plugin?.settings?.trade?.breakEvenThresholdMode ?? 'fixed') !==
            'percentage_current_balance'
        ) {
          if (isMounted) {
            setBreakEvenAccountCurrentBalance(undefined);
          }
          return;
        }

        try {
          const balanceLookup =
            await fetchBreakEvenAccountBalanceLookup(plugin);
          const resolution = resolveBreakEvenAccountBalances(
            Object.fromEntries(Object.entries(tradeAccountIdentityInput)),
            balanceLookup,
            {
              resolveAccountIdDisplayName: (accountId) =>
                plugin?.settings?.backendIntegration?.accountMapping?.[
                  accountId
                ],
            }
          );

          if (!isMounted) return;

          setBreakEvenAccountCurrentBalance(resolution.singleBalance);
        } catch {
          if (isMounted) {
            setBreakEvenAccountCurrentBalance(undefined);
          }
        }
      };

      void resolveBreakEvenBalance();

      return () => {
        isMounted = false;
      };
    }, [
      plugin,
      accountPageService,
      tradeAccountIdentityInput,
      data.entryTime,
      data.tradeId,
      plugin?.settings?.trade?.breakEvenThresholdMode,
      plugin?.settings?.backendIntegration?.accountMapping,
      accountBalanceRefreshKey,
    ]);

    
    const { metrics, formatTime } = useTradeMetrics({
      data,
      breakEvenRange: plugin?.settings?.trade,
      breakEvenAccountCurrentBalance,
    });

    
    const updateLossReview = useCallback(
      async (newData: LossReviewData) => {
        if (plugin?.tradeService && filePath && filePath !== 'unknown') {
          try {
            await plugin.tradeService.updateLossReview(
              filePath,
              newData,
              'user-input'
            );
          } catch (error: unknown) {
            console.error('[TradeNote] Error updating loss review:', error);
          }
        }
      },
      [plugin, filePath]
    );

    
    
    const tradeTemplate = React.useMemo<TradeTemplate | null>(() => {
      if (!plugin) return null;
      try {
        const tradeTemplateService = new TradeTemplateService(plugin);
        
        if (data.templateId) {
          const template = tradeTemplateService.getTemplate(data.templateId);
          if (template) return template;
        }
        
        const defaultTemplateId = plugin.settings.templates?.defaultTrade;
        if (defaultTemplateId) {
          const template = tradeTemplateService.getTemplate(defaultTemplateId);
          if (template) return template;
        }
        
        return tradeTemplateService.getDefaultTemplate();
      } catch (error) {
        console.error('[TradeNote] Error loading trade template:', error);
        return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- initial data load is controlled by trade identity, not every derived dependency
    }, [plugin, data.templateId, templateRefreshKey]);

    
    
    const reviewSettings = React.useMemo(() => {
      const showMode = tradeTemplate?.sections?.review?.show ?? 'losses-only';
      const isLoss = metrics.isLoss === true;

      
      let templateSections;
      if (showMode === 'always') {
        
        templateSections = isLoss
          ? tradeTemplate?.sections?.review?.lossSections ||
            tradeTemplate?.sections?.review?.sections ||
            []
          : tradeTemplate?.sections?.review?.winSections ||
            tradeTemplate?.sections?.review?.sections ||
            [];
      } else {
        
        templateSections = tradeTemplate?.sections?.review?.sections || [];
      }

      
      
      return {
        enabled: showMode !== 'never' && templateSections.length > 0,
        sections: templateSections.map((section) => ({
          id: section.id,
          title: section.title,
          type: section.type,
          content: section.content,
          items: section.items,
          placeholder: section.placeholder,
        })),
      };
    }, [tradeTemplate, metrics.isLoss]);

    
    useEffect(() => {
      

      
      
      if (containerRef.current) {
        containerRef.current.classList.add('trade-note-mounted');
        containerRef.current.setAttribute(
          'data-mounted-at',
          Date.now().toString()
        );

        
        const parentContainer = containerRef.current.closest(
          '.journalit-trade-view'
        );
        if (parentContainer) {
          parentContainer.classList.add('trade-note-mounted');
        }
      }
    }, []);

    
    const setContainerRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;

        
        if (node && (!filePath || filePath === 'unknown')) {
          
          const filePathFromContainer = node.getAttribute(
            'data-displaying-file'
          );
          if (filePathFromContainer) {
            setFilePath(filePathFromContainer);
            return;
          }

          
          let parent = node.parentElement;
          while (parent) {
            const filePathFromParent =
              parent.getAttribute('data-displaying-file') ||
              parent.getAttribute('data-file-path');
            if (filePathFromParent) {
              setFilePath(filePathFromParent);
              break;
            }
            parent = parent.parentElement;
          }
        }
      },
      [filePath]
    );

    
    const handleAccountClick = async (accountIdOrName: string) => {
      if (!plugin?.viewManager) {
        console.error('Cannot navigate to account: ViewManager not available');
        return;
      }

      try {
        let accountName = accountIdOrName;

        
        if (accountPageService) {
          try {
            const allAccounts = await accountPageService.getAccountCatalog();
            const account = allAccounts.find(
              (acc) =>
                acc.id === accountIdOrName || acc.name === accountIdOrName
            );

            
            if (account && account.name) {
              accountName = account.name;
            }
          } catch (error) {
            console.warn(
              'Could not resolve account via AccountPageService, using provided value:',
              error
            );
            
          }
        }

        
        await plugin.viewManager.openAccountPageView(accountName);
      } catch (error) {
        console.error('Error navigating to account page:', error);
      }
    };

    
    const handleEditClick = useCallback(() => {
      if (onEditClick) {
        onEditClick(data);
      }
    }, [data, onEditClick]);

    
    const handleMarkReviewed = useCallback(async () => {
      if (plugin?.tradeService && filePath && filePath !== 'unknown') {
        const timestamp = new Date().toISOString();

        
        setReviewStatus({
          reviewed: true,
          reviewedAt: timestamp,
        });

        
        try {
          await plugin.tradeService.updateTradeReviewStatus(
            filePath,
            true,
            timestamp,
            'user-input'
          );
          
        } catch (error: unknown) {
          console.error('[TradeNote] Error updating review status:', error);
          
          setReviewStatus({
            reviewed: data.reviewed,
            reviewedAt: data.reviewedAt,
          });
        }
      }
    }, [plugin, filePath, data.reviewed, data.reviewedAt]);

    return (
      <div
        className="trade-note-container"
        ref={setContainerRef}
        data-file-path={filePath}
      >
        
        <TradeHeader
          instrument={data.instrument}
          direction={data.direction}
          isProfit={metrics.isProfit}
          isBreakeven={metrics.isBreakeven}
          pnl={metrics.pnl}
          percentChange={metrics.percentChange}
          useDirectPnLInput={data.useDirectPnLInput}
          directPnL={data.directPnL}
          isMissedTrade={data.isMissedTrade}
          isBacktestTrade={data.isBacktestTrade}
          _originalPnlWasNull={data._originalPnlWasNull}
          exitTime={data.exitTime}
          exitPrice={data.exitPrice}
          tradeStatus={data.tradeStatus}
          entries={data.entries}
          exits={data.exits}
          dividends={data.dividends}
          commission={data.commission}
          swap={data.swap}
          fees={data.fees}
          rebate={data.rebate}
          assetType={data.assetType}
          optionType={data.optionType}
          rMultiple={data.rMultiple}
          displayRMultiples={
            plugin?.settings?.trade?.displayRMultiples ?? false
          }
          riskAmount={data.riskAmount}
          currency={data.currency}
        />

        
        {tradeTemplate?.sections?.navigation?.show !== false &&
          (data.entryTime || data.useDirectPnLInput) && (
            <TradeNavigationSection
              data={data}
              filePath={filePath}
              onEditClick={onEditClick}
              handleEditClick={handleEditClick}
            />
          )}

        
        <div className="trade-note-content">
          
          {tradeTemplate?.sections?.images?.show !== false && (
            <TradeImageSection
              images={data.images}
              onEditClick={handleEditClick}
              sourcePath={filePath}
            />
          )}

          
          {tradeTemplate?.sections?.metadata?.show !== false && (
            <TradeMetadataSection
              data={data}
              onAccountClick={handleAccountClick}
              config={tradeTemplate?.sections?.metadata}
            />
          )}

          
          <TradeCustomFieldsSection data={data} />

          
          {tradeTemplate?.sections?.details?.show !== false && (
            <TradeDetailsSection
              data={data}
              metrics={metrics}
              formatTime={formatTime}
              onEditClick={handleEditClick}
              config={tradeTemplate?.sections?.details}
            />
          )}

          
          {(() => {
            
            const reviewShowMode =
              tradeTemplate?.sections?.review?.show ?? 'losses-only';

            
            if (reviewShowMode === 'never') return false;

            
            if (data.isBacktestTrade) {
              const showForBacktest =
                tradeTemplate?.sections?.review?.showForBacktest ?? false;
              if (!showForBacktest) return false;
            }

            
            if (reviewShowMode === 'always') {
              const isOpen = isTradeOpenWithContext({
                tradeStatus: data.tradeStatus,
                exitTime: data.exitTime,
                pnl: data.pnl,
                useDirectPnLInput: data.useDirectPnLInput,
                exits: data.exits,
                entries: data.entries,
              });
              return !isOpen; 
            }

            
            const isOpen = isTradeOpenWithContext({
              tradeStatus: data.tradeStatus,
              exitTime: data.exitTime,
              pnl: data.pnl,
              useDirectPnLInput: data.useDirectPnLInput,
              exits: data.exits,
              entries: data.entries,
            });
            return !isOpen && metrics.isLoss === true;
          })() && (
            <TradeReview
              settings={reviewSettings}
              data={data.lossReview}
              onUpdate={updateLossReview}
              filePath={filePath}
            />
          )}

          
          {tradeTemplate?.sections?.reviewButton?.show !== false && (
            <div className="trade-note-review-section">
              <ReviewButton
                reviewed={reviewStatus.reviewed}
                reviewedAt={reviewStatus.reviewedAt}
                onMarkReviewed={handleMarkReviewed}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);


const TradeNavigationSection: React.FC<{
  data: TradeNoteProps['data'];
  filePath: string;
  onEditClick?: (data: TradeNoteProps['data']) => void;
  handleEditClick?: () => void;
}> = React.memo(function TradeNavigationSection({
  data,
  filePath,
  onEditClick,
  handleEditClick,
}) {
  const plugin = usePlugin();
  const [trades, setTrades] = useState<TFile[]>([]);
  const [missedTrades, setMissedTrades] = useState<TFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  
  const entryDate = React.useMemo(() => {
    if (data.entryTime) {
      return new Date(data.entryTime);
    }

    
    
    if (data.useDirectPnLInput) {
      
      const pathMatch = filePath.match(/(\d{2})(\d{2})(\d{2})-T\d+\.md$/);
      if (pathMatch) {
        const [, day, month, year] = pathMatch;
        const fullYear = 2000 + parseInt(year, 10);
        return new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));
      }

      
      return new Date();
    }

    return null;
  }, [data.entryTime, data.useDirectPnLInput, filePath]);

  
  
  const dateRange = React.useMemo(() => {
    if (!entryDate || !plugin) {
      return null;
    }

    
    
    const { start, end } = getTradingDayRange(entryDate, plugin);

    return { startDate: start, endDate: end };
  }, [entryDate, plugin]);

  
  
  const cacheKey = React.useMemo(() => {
    if (!entryDate || !plugin) return '';

    return getTradingDayString(entryDate, plugin);
  }, [entryDate, plugin]);

  
  const containerRef = React.useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      {
        rootMargin: '50px', 
        threshold: 0.1,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  
  const handleTradeDataChange = useCallback(
    (payload: { action?: string }) => {
      const { action } = payload;

      
      if (
        action === 'created' ||
        action === 'updated' ||
        action === 'relocated'
      ) {
        if (cacheKey && plugin) {
          
          window.setTimeout(() => {
            
            plugin.app.saveLocalStorage(
              `${TRADE_NAV_CACHE_PREFIX}${cacheKey}`,
              null
            );

            
            setTrades([]);
            setMissedTrades([]);
            setIsLoading(false);
            setRefreshTrigger((prev) => prev + 1);
          }, 200); 
        }
      }
    },
    [cacheKey, plugin]
  );

  useEventBus('trade:changed', handleTradeDataChange);
  useEventBus('missed-trade:changed', handleTradeDataChange);
  useEventBus('backtest-trade:changed', handleTradeDataChange);

  
  useEffect(() => {
    
    if (!isVisible || !dateRange || !plugin?.tradeService || !cacheKey) {
      return;
    }

    let isMounted = true;
    let fetchTimeoutId: number | null = null;

    const fetchTradesOnce = async () => {
      try {
        
        const cachedTrades: unknown = plugin.app.loadLocalStorage(
          `${TRADE_NAV_CACHE_PREFIX}${cacheKey}`
        );

        if (cachedTrades) {
          
          const parsedData = parseTradeNavigationCache(cachedTrades);
          if (isMounted) {
            if (!parsedData) {
              return;
            }

            const { trades: tradePaths, missedTrades: missedTradePaths } =
              parsedData;

            
            const tradeFiles = tradePaths
              .map((path: string) => {
                const abstractFile =
                  plugin.app.vault.getAbstractFileByPath(path);
                if (!(abstractFile instanceof TFile)) {
                  return null;
                }
                return abstractFile;
              })
              .filter((file): file is TFile => file !== null); 

            const missedTradeFiles = missedTradePaths
              .map((path: string) => {
                const abstractFile =
                  plugin.app.vault.getAbstractFileByPath(path);
                if (!(abstractFile instanceof TFile)) {
                  return null;
                }
                return abstractFile;
              })
              .filter((file): file is TFile => file !== null); 

            
            const allCachedPaths = [...tradePaths, ...missedTradePaths];
            const currentTradeInCache = allCachedPaths.includes(filePath);
            const currentTradeExists =
              plugin.app.vault.getAbstractFileByPath(filePath);

            
            if (
              (currentTradeExists && !currentTradeInCache) ||
              (tradeFiles.length === 0 &&
                missedTradeFiles.length === 0 &&
                allCachedPaths.length > 0)
            ) {
              plugin.app.saveLocalStorage(
                `${TRADE_NAV_CACHE_PREFIX}${cacheKey}`,
                null
              );
              
            } else {
              setTrades(tradeFiles);
              setMissedTrades(missedTradeFiles);
              return; 
            }
          }
        }

        
        if (isLoading) return;

        
        fetchTimeoutId = window.setTimeout(() => {
          void (async () => {
            try {
              if (!isMounted) return;
              setIsLoading(true);

              
              
              const dayTrades = await plugin.tradeService.getTrades(
                dateRange.startDate,
                dateRange.endDate
              );

              
              let dayMissedTrades: TFile[] = [];
              try {
                if (plugin.missedTradeService?.getMissedTrades) {
                  dayMissedTrades =
                    await plugin.missedTradeService.getMissedTrades(
                      dateRange.startDate,
                      dateRange.endDate
                    );
                }
              } catch (error) {
                console.warn(
                  '[TradeNote] Failed to fetch missed trades:',
                  error
                );
              }

              
              if (isMounted) {
                setTrades(dayTrades);
                setMissedTrades(dayMissedTrades);

                
                try {
                  
                  const tradePaths = dayTrades.map((file) => file.path);
                  const missedTradePaths = dayMissedTrades.map(
                    (file) => file.path
                  );
                  plugin.app.saveLocalStorage(
                    `${TRADE_NAV_CACHE_PREFIX}${cacheKey}`,
                    {
                      trades: tradePaths,
                      missedTrades: missedTradePaths,
                    }
                  );
                } catch (cacheError) {
                  console.warn('Error caching trades:', cacheError);
                }
              }
            } catch (error) {
              console.error('Error fetching trades for day:', error);
            } finally {
              if (isMounted) {
                setIsLoading(false);
              }
            }
          })();
        }, 100); 
      } catch (error) {
        console.error('Error in trade fetch setup:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchTradesOnce();

    
    return () => {
      isMounted = false;
      if (fetchTimeoutId) {
        window.clearTimeout(fetchTimeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isLoading intentionally excluded: including it causes race condition where setIsLoading(true) triggers cleanup before async fetch completes
  }, [
    isVisible,
    dateRange,
    plugin?.tradeService,
    cacheKey,
    plugin,
    refreshTrigger,
    filePath,
  ]);

  
  const handleNavigate = useCallback(
    (path: string, openInNewLeaf: boolean = false) => {
      try {
        if (plugin && plugin.openFile) {
          void plugin.openFile(path, openInNewLeaf);
        } else if (plugin?.app) {
          void plugin.app.workspace.openLinkText(path, '', openInNewLeaf);
        } else {
          console.error(
            'Cannot navigate: Plugin and App context not available.'
          );
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    },
    [plugin]
  );

  
  const getDRCPath = useCallback(
    (date: Date) => {
      if (!plugin?.drcService) return '';
      return plugin.drcService.getDRCNotePath(date);
    },
    [plugin?.drcService]
  );

  const getWeeklyReviewPath = useCallback(
    (date: Date) => {
      if (!plugin?.weeklyReviewService) return '';
      return plugin.weeklyReviewService.getWeeklyReviewPath(date);
    },
    [plugin?.weeklyReviewService]
  );

  const getMonthlyReviewPath = useCallback(
    (date: Date) => {
      if (!plugin?.drcService) return null;
      return plugin.drcService.getMonthlyReviewPath(date);
    },
    [plugin?.drcService]
  );

  const getYearlyReviewPath = useCallback(
    (date: Date) => {
      
      const folderPathService = plugin?.serviceManager?.getFolderPathService();
      if (!folderPathService) return null;
      return folderPathService.getYearlyReviewPath(date.getFullYear());
    },
    [plugin?.serviceManager]
  );

  
  if (!entryDate || !plugin?.drcService || !plugin?.weeklyReviewService) {
    return null;
  }

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <>
          <TradeNavigation
            currentDate={entryDate}
            trades={trades}
            missedTrades={missedTrades}
            currentTradePath={filePath}
            navigateTo={handleNavigate}
            getDRCPath={getDRCPath}
            getWeeklyReviewPath={getWeeklyReviewPath}
            getMonthlyReviewPath={getMonthlyReviewPath}
            getYearlyReviewPath={getYearlyReviewPath}
            onEditClick={onEditClick}
            handleEditClick={handleEditClick}
          />
        </>
      ) : (
        <div className="trade-note-loading-placeholder">
          <div className="trade-note-loading-text">
            {t('trade.loading-navigation')}
          </div>
        </div>
      )}
    </div>
  );
});
