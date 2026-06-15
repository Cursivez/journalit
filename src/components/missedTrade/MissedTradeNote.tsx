import { logger } from '../../utils/logger';


import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { TFile } from 'obsidian';
import { MissedTradeNoteData } from './types';
import { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import { usePlugin } from '../../hooks/usePlugin';
import { TradeNavigation } from '../trade/TradeNavigation';
import {
  TradeHeader,
  TradeImageSection,
  TradeMetadataSection,
  TradeCustomFieldsSection,
  TradeDetailsSection,
} from '../trade/components';
import { useTradeMetrics } from '../trade/hooks';
import {
  getTradingDayRange,
  getTradingDayString,
} from '../../utils/tradingDayUtils';
import { ReviewButton } from '../shared/ReviewButton';
import { useEventBus, eventBus } from '../../services/events';
import { TradeReview } from '../trade/LossReview';
import { TradeTemplateService } from '../../services/templates/TradeTemplateService';
import { TradeTemplate } from '../../types/reviewV2';
import { LossReviewSettings } from '../../settings/types';
import { LossReviewData } from '../../services/backend/types';
import { t } from '../../lang/helpers';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';

interface MissedTradeNoteProps {
  data: PartialTradeFrontmatter & {
    isMissedTrade: true;
  };
  onEditClick?: (data: MissedTradeNoteProps['data']) => void;
  onDataUpdate?: (updatedData: Partial<MissedTradeNoteData>) => void;
}

const getKeyedTextLines = (text: string) => {
  const occurrences = new Map<string, number>();
  return text.split('\n').map((line) => {
    const occurrence = (occurrences.get(line) ?? 0) + 1;
    occurrences.set(line, occurrence);
    return { line, key: `${line}-${occurrence}` };
  });
};

export const MissedTradeNote: React.FC<MissedTradeNoteProps> = React.memo(
  ({ data, onEditClick }) => {
    
    const [filePath, setFilePath] = useState<string>(
      data.filePath || 'unknown'
    );

    
    const [reviewStatus, setReviewStatus] = useState({
      reviewed: data.reviewed,
      reviewedAt: data.reviewedAt,
    });

    
    useEffect(() => {
      setReviewStatus({
        reviewed: data.reviewed,
        reviewedAt: data.reviewedAt,
      });
    }, [data.reviewed, data.reviewedAt]);

    
    const containerRef = useRef<HTMLDivElement>(null);

    
    const plugin = usePlugin();

    
    const { metrics, formatTime } = useTradeMetrics({
      data,
      breakEvenRange: plugin?.settings?.trade,
    });

    
    const [templateRefreshKey, setTemplateRefreshKey] = useState(0);

    
    const [missedReviewData, setMissedReviewData] = useState<
      LossReviewData | undefined
    >(data.lossReview);

    
    useEffect(() => {
      setMissedReviewData(data.lossReview);
    }, [data.lossReview]);

    
    useEffect(() => {
      return eventBus.subscribe('trade-template:changed', () => {
        setTemplateRefreshKey((k) => k + 1);
      });
    }, []);

    

    const tradeTemplate = useMemo<TradeTemplate | null>(() => {
      if (!plugin) return null;
      try {
        const tradeTemplateService = new TradeTemplateService(plugin);
        
        if (typeof data.templateId === 'string') {
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
        console.error('[MissedTradeNote] Error loading trade template:', error);
        return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- initial data load is controlled by trade identity, not every derived dependency
    }, [plugin, data.templateId, templateRefreshKey]);

    
    const reviewSettings = useMemo<LossReviewSettings>(() => {
      if (!tradeTemplate?.sections?.review) {
        return { enabled: false, sections: [] };
      }

      const reviewConfig = tradeTemplate.sections.review;

      
      const sections = reviewConfig.sections || [];

      return {
        enabled: true,
        sections: sections.map((s) => ({
          id: s.id,
          type: s.type,
          title: s.title,
          content: s.content,
          placeholder: s.placeholder,
          items: s.items,
        })),
      };
    }, [tradeTemplate]);

    
    const updateMissedReview = useCallback(
      async (newData: LossReviewData) => {
        if (!plugin?.missedTradeService || !filePath || filePath === 'unknown')
          return;

        
        const previousData = missedReviewData;

        
        setMissedReviewData(newData);

        try {
          
          await plugin.missedTradeService.updateMissedTradeReview(
            filePath,
            newData
          );
        } catch (error) {
          console.error(
            '[MissedTradeNote] Error updating missed trade review:',
            error
          );
          
          setMissedReviewData(previousData);
        }
      },
      [plugin, filePath, missedReviewData]
    );

    
    useEffect(() => {
      
      

      
      if (containerRef.current) {
        containerRef.current.classList.add('missed-trade-note-mounted');
        containerRef.current.setAttribute(
          'data-mounted-at',
          Date.now().toString()
        );

        
        const parentContainer = containerRef.current.closest(
          '.journalit-missed-trade-view'
        );
        if (parentContainer) {
          parentContainer.classList.add('missed-trade-note-mounted');
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
        const normalizeAccountIdentifier = (value: string): string => {
          let normalized = value.trim();

          
          for (let i = 0; i < 3; i++) {
            const unwrapped = normalized
              .replace(/^(["'`])(.*)\1$/u, '$2')
              .trim();
            if (unwrapped === normalized) break;
            normalized = unwrapped;
          }

          return normalized;
        };

        let accountName = normalizeAccountIdentifier(accountIdOrName);

        
        if (plugin.accountPageService) {
          try {
            const allAccounts =
              await plugin.accountPageService.getAccountCatalog();
            const account = allAccounts.find((acc) => {
              const accId = normalizeAccountIdentifier(String(acc.id ?? ''));
              const accName = normalizeAccountIdentifier(
                String(acc.name ?? '')
              );
              return accId === accountName || accName === accountName;
            });

            
            if (account?.name) {
              accountName = account.name;
            }
          } catch (error) {
            console.warn(
              'Could not resolve account via AccountPageService, using provided value:',
              error
            );
          }
        }

        if (!accountName) {
          console.error(`Could not find account: ${accountIdOrName}`);
          return;
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
      if (plugin?.missedTradeService && filePath && filePath !== 'unknown') {
        const timestamp = new Date().toISOString();

        
        setReviewStatus({
          reviewed: true,
          reviewedAt: timestamp,
        });

        
        try {
          await plugin.missedTradeService.updateMissedTradeReviewStatus(
            filePath,
            true,
            timestamp
          );
          logger.debug('Missed trade marked as reviewed');
        } catch (error: unknown) {
          console.error(
            '[MissedTradeNote] Error updating review status:',
            error
          );
          
          setReviewStatus({
            reviewed: data.reviewed,
            reviewedAt: data.reviewedAt,
          });
        }
      }
    }, [plugin, filePath, data.reviewed, data.reviewedAt]);

    return (
      <div
        className="missed-trade-note-container"
        ref={setContainerRef}
        data-file-path={filePath}
      >
        
        <DisplayPolicyProvider privacyModeOverride={false}>
          <TradeHeader
            instrument={data.instrument}
            direction={data.direction}
            isProfit={metrics.isProfit}
            isBreakeven={metrics.isBreakeven}
            pnl={metrics.pnl}
            percentChange={metrics.percentChange}
            useDirectPnLInput={data.useDirectPnLInput}
            isMissedTrade={true} 
            isBacktestTrade={false} 
            assetType={data.assetType}
            optionType={data.optionType}
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
            rMultiple={data.rMultiple}
            displayRMultiples={
              plugin?.settings?.trade?.displayRMultiples ?? false
            }
            riskAmount={data.riskAmount}
          />
        </DisplayPolicyProvider>

        
        {(data.entryTime || data.useDirectPnLInput) && (
          <TradeNavigationSection
            data={data}
            filePath={filePath}
            onEditClick={onEditClick}
            handleEditClick={handleEditClick}
          />
        )}

        
        <div className="missed-trade-note-content">
          
          <TradeImageSection
            images={data.images}
            onEditClick={handleEditClick}
            sourcePath={filePath}
          />

          
          <TradeMetadataSection
            data={data}
            onAccountClick={handleAccountClick}
          />

          <TradeCustomFieldsSection data={data} />

          
          <TradeDetailsSection
            data={data}
            metrics={metrics}
            formatTime={formatTime}
            onEditClick={handleEditClick}
          />

          
          {data.missedReason && (
            <div className="missed-trade-reason-section">
              <div className="details-card">
                <h4>{t('missed-trade.reason-title')}</h4>
                <div className="missed-trade-reason-content">
                  {getKeyedTextLines(data.missedReason).map(
                    (item, index, lines) => (
                      <React.Fragment key={item.key}>
                        {item.line}
                        {index < lines.length - 1 && <br />}
                      </React.Fragment>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          
          {(() => {
            
            const reviewShowMode =
              tradeTemplate?.sections?.review?.show ?? 'losses-only';
            if (reviewShowMode === 'never') return false;

            const showForMissed =
              tradeTemplate?.sections?.review?.showForMissed ?? false;
            return showForMissed;
          })() && (
            <TradeReview
              settings={reviewSettings}
              data={missedReviewData}
              onUpdate={updateMissedReview}
              filePath={filePath}
            />
          )}

          
          <div className="missed-trade-note-review-section">
            <ReviewButton
              reviewed={reviewStatus.reviewed}
              reviewedAt={reviewStatus.reviewedAt}
              onMarkReviewed={handleMarkReviewed}
            />
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    
    return (
      prevProps.data.pnl === nextProps.data.pnl &&
      prevProps.data.entryTime === nextProps.data.entryTime &&
      prevProps.data.exitTime === nextProps.data.exitTime &&
      prevProps.data.instrument === nextProps.data.instrument &&
      prevProps.data.direction === nextProps.data.direction &&
      prevProps.data.missedReason === nextProps.data.missedReason &&
      prevProps.data.templateId === nextProps.data.templateId &&
      JSON.stringify(prevProps.data.images) ===
        JSON.stringify(nextProps.data.images) &&
      JSON.stringify(prevProps.data.lossReview) ===
        JSON.stringify(nextProps.data.lossReview) &&
      JSON.stringify(prevProps.data.customFields) ===
        JSON.stringify(nextProps.data.customFields) &&
      prevProps.onEditClick === nextProps.onEditClick
    );
  }
);

MissedTradeNote.displayName = 'MissedTradeNote';


const TradeNavigationSection: React.FC<{
  data: MissedTradeNoteProps['data'];
  filePath: string;
  onEditClick?: (data: MissedTradeNoteProps['data']) => void;
  handleEditClick?: () => void;
}> = React.memo(({ data, filePath, onEditClick, handleEditClick }) => {
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

    
    if (filePath && filePath !== 'unknown') {
      
      const pathMatch = filePath.match(/(\d{2})(\d{2})(\d{2})-M\d+\.md$/);
      if (pathMatch) {
        const [, day, month, year] = pathMatch;
        const fullYear = 2000 + parseInt(year, 10);
        return new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));
      }
    }

    
    return new Date();
  }, [data.entryTime, filePath]);

  
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
    (payload: { action: string }) => {
      const { action } = payload;

      if (action === 'created' || action === 'updated') {
        if (cacheKey && plugin) {
          window.setTimeout(() => {
            plugin.app.saveLocalStorage(`trade-nav-${cacheKey}`, null);
            plugin.app.saveLocalStorage(`missed-trade-nav-${cacheKey}`, null);

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

  

  useEffect(() => {
    if (
      !isVisible ||
      !dateRange ||
      !plugin?.tradeService ||
      !plugin?.missedTradeService ||
      !cacheKey
    ) {
      return;
    }

    let isMounted = true;
    let fetchTimeoutId: number | null = null;

    const fetchDataOnce = async () => {
      try {
        if (isLoading) return;

        fetchTimeoutId = window.setTimeout(() => {
          void (async () => {
            try {
              if (!isMounted) return;
              setIsLoading(true);

              
              const [dayTrades, dayMissedTrades] = await Promise.all([
                plugin.tradeService.getTrades(
                  dateRange.startDate,
                  dateRange.endDate
                ),
                plugin.missedTradeService.getMissedTrades(
                  dateRange.startDate,
                  dateRange.endDate
                ),
              ]);

              if (isMounted) {
                setTrades(dayTrades);
                setMissedTrades(dayMissedTrades);
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

    void fetchDataOnce();

    return () => {
      isMounted = false;
      if (fetchTimeoutId) {
        window.clearTimeout(fetchTimeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigation fetch intentionally excludes loading state to avoid cleanup races
  }, [
    isVisible,
    dateRange,
    plugin?.tradeService,
    plugin?.missedTradeService,
    cacheKey,
    refreshTrigger,
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

  const getYearlyReviewPath = useCallback(() => {
    return null;
  }, []);

  
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
        <div className="missed-trade-note-loading-placeholder">
          <div className="missed-trade-note-loading-text">
            {t('missed-trade.loading-navigation')}
          </div>
        </div>
      )}
    </div>
  );
});

TradeNavigationSection.displayName = 'TradeNavigationSection';
