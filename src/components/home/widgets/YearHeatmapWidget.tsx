

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronRight, X } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { ContributionsHeatmap } from '../../charts/ContributionsHeatmap';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { t } from '../../../lang/helpers';
import { ensureHomeWidgetStyles } from '../../../styles/homeWidgetStyles';
import { getTradeAnalyticsTradingDay } from '../../../utils/tradeAnalyticsDate';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../shared/display/CurrencyConversionInfo';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';

interface YearHeatmapWidgetProps {
  plugin: JournalitPlugin;
}


const calculateMaxWeeks = (containerWidth: number): number | undefined => {
  
  const availableWidth = containerWidth - 64;
  const weekWidth = 14; 

  
  const fittableWeeks = Math.floor(availableWidth / weekWidth);

  
  if (fittableWeeks >= 52) {
    return undefined; 
  } else if (fittableWeeks >= 26) {
    return 26; 
  } else if (fittableWeeks >= 13) {
    return 13; 
  } else {
    return Math.max(8, fittableWeeks); 
  }
};

const YearHeatmapWidgetComponent: React.FC<YearHeatmapWidgetProps> = ({
  plugin,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxWeeks, setMaxWeeks] = useState<number | undefined | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  
  const { dashboardData } = useDashboardData();
  const analyticsDateBasis =
    plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';
  const allowReviewNavigation = analyticsDateBasis === 'entry';

  
  const availableYears = useMemo(() => {
    if (!dashboardData?.trades || dashboardData.trades.length === 0) {
      return [currentYear];
    }

    const yearsSet = new Set<number>();

    for (const trade of dashboardData.trades) {
      const analyticsDate = getTradeAnalyticsTradingDay(
        trade,
        analyticsDateBasis,
        plugin
      );
      if (analyticsDate) {
        yearsSet.add(analyticsDate.getFullYear());
      }
    }

    
    yearsSet.add(currentYear);
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [dashboardData?.trades, currentYear, analyticsDateBasis, plugin]);

  const selectedYearPnlTrades = useMemo(
    () =>
      (dashboardData?.trades || []).filter((trade) => {
        if (!isPnlContributingTrade(trade)) return false;
        const analyticsDate = getTradeAnalyticsTradingDay(
          trade,
          analyticsDateBasis,
          plugin
        );
        return analyticsDate?.getFullYear() === selectedYear;
      }),
    [dashboardData?.trades, analyticsDateBasis, plugin, selectedYear]
  );

  useEffect(() => {}, []);

  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const newMaxWeeks = calculateMaxWeeks(width);

        
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          setMaxWeeks(newMaxWeeks);
        }, 100);
      }
    });

    resizeObserver.observe(container);

    
    const initialWidth = container.getBoundingClientRect().width;
    setMaxWeeks(calculateMaxWeeks(initialWidth));

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      resizeObserver.disconnect();
    };
  }, []);

  const handleDayClick = async (date: Date) => {
    if (!allowReviewNavigation) {
      return;
    }

    try {
      
      const drcService = await plugin.serviceManager.getDRCService();
      await drcService.openDRC(date);
    } catch (error) {
      console.error('Failed to open DRC for date:', error);
    }
  };

  
  
  const getHeaderText = () => {
    if (maxWeeks === null) return '';

    const isCurrentYear = selectedYear === currentYear;

    if (!maxWeeks) {
      return t('home.widget.heatmap.year-activity', {
        year: String(selectedYear),
      });
    } else if (maxWeeks <= 13 && isCurrentYear) {
      return t('home.widget.heatmap.last-3-months');
    } else if (maxWeeks <= 26 && isCurrentYear) {
      return t('home.widget.heatmap.last-6-months');
    } else {
      return t('home.widget.heatmap.year-activity', {
        year: String(selectedYear),
      });
    }
  };

  
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsExpanded(false);
  };

  
  const getSkeletonHeaderWidth = () => {
    if (maxWeeks === null) return '95px';
    if (!maxWeeks) return '100px'; 
    if (maxWeeks <= 13) return '90px'; 
    if (maxWeeks <= 26) return '95px'; 
    return '100px';
  };

  
  const skeletonColumns = maxWeeks ?? 26;

  
  if (!dashboardData || maxWeeks === null) {
    return (
      <div ref={containerRef} className="journalit-home-heatmap">
        
        <div className="journalit-home-heatmap__loading-header">
          <SkeletonText width={getSkeletonHeaderWidth()} height="11px" />
        </div>

        
        <div className="journalit-home-heatmap__loading-center">
          
          <div className="journalit-home-heatmap__loading-grid">
            
            <div className="journalit-home-heatmap__loading-labels">
              {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                <SkeletonBox
                  key={day}
                  width={20}
                  height={11}
                  borderRadius="2px"
                />
              ))}
            </div>
            
            <div className="journalit-home-heatmap__loading-columns">
              {Array.from({ length: skeletonColumns }).map((_, colIndex) => (
                <div
                  key={`column-${colIndex + 1}-of-${skeletonColumns}`}
                  className="journalit-home-heatmap__loading-column"
                >
                  {Array.from({ length: 7 }).map((_, rowIndex) => (
                    <SkeletonBox
                      key={`row-${rowIndex + 1}`}
                      width={11}
                      height={11}
                      borderRadius="2px"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  if (isExpanded) {
    return (
      <div ref={containerRef} className="journalit-home-heatmap">
        
        <div className="journalit-home-heatmap__expanded-header">
          <span className="journalit-home-widget__eyebrow">
            {t('home.widget.heatmap.select-year')}
          </span>
          <button
            onClick={() => setIsExpanded(false)}
            className="journalit-home-heatmap__close-button"
            aria-label={t('home.widget.heatmap.close-selector')}
          >
            <X size={14} />
          </button>
        </div>

        
        <div className="journalit-home-heatmap__year-selector">
          <div className="journalit-home-heatmap__year-buttons">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={
                  year === selectedYear
                    ? 'journalit-home-heatmap__year-button journalit-home-heatmap__year-button--active'
                    : 'journalit-home-heatmap__year-button'
                }
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div
      ref={containerRef}
      className="journalit-home-heatmap journalit-home-heatmap--clickable"
      onClick={() => setIsExpanded(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(true);
        }
      }}
    >
      
      <div className="journalit-home-heatmap__header">
        <span className="journalit-home-widget__eyebrow">
          {getHeaderText()}
          <CurrencyConversionInfo
            metadata={buildCurrencyConversionMetadata(dashboardData?.metrics)}
            trades={selectedYearPnlTrades}
          />
        </span>
        <ChevronRight size={12} className="journalit-home-heatmap__chevron" />
      </div>

      <div
        className="journalit-home-heatmap__heatmap"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <ContributionsHeatmap
          trades={dashboardData?.trades || []}
          year={selectedYear}
          onDayClick={allowReviewNavigation ? handleDayClick : undefined}
          height="100%"
          maxWeeks={maxWeeks}
          
          
          rollingMode={maxWeeks !== undefined && selectedYear === currentYear}
        />
      </div>
    </div>
  );
};

export const YearHeatmapWidget = React.memo(YearHeatmapWidgetComponent);
