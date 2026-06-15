

import React, { useEffect } from 'react';
import { createSvgPlaceholderDataUri } from '../../utils/placeholderImage';
import {
  ReviewTemplate,
  WidgetPlacement,
  ReviewTemplateType,
} from '../../types/reviewV2';
import { previewDataBundle } from '../../data/mockTemplateData';
import JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { Tooltip } from '../shared/Tooltip';
import {
  getWidgetByTypeAndConfig,
  getWidgetByType,
  getWidgetNameByPlacement,
} from '../../data/widgetRegistry';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';


import { GoalsWidget } from '../reviewV2/widgets/GoalsWidget';
import { ChecklistWidget } from '../reviewV2/widgets/ChecklistWidget';
import { HeaderWidget } from '../reviewV2/widgets/HeaderWidget';
import { ReviewWidget } from '../reviewV2/widgets/ReviewWidget';
import { ReviewContextFieldsWidget } from '../reviewV2/widgets/ReviewContextFieldsWidget';
import { StatsWidget } from '../reviewV2/widgets/StatsWidget';
import { AccountBreakdownWidget } from '../reviewV2/widgets/AccountBreakdownWidget';
import { TradeTableWidget } from '../reviewV2/widgets/TradeTableWidget';
import { PnLChartWidget } from '../reviewV2/widgets/PnLChartWidget';
import { DrawdownChartWidget } from '../reviewV2/widgets/DrawdownChartWidget';
import { SetupPerformanceWidget } from '../reviewV2/widgets/SetupPerformanceWidget';
import { BestWorstTradesWidget } from '../reviewV2/widgets/BestWorstTradesWidget';
import { BestWorstDaysWidget } from '../reviewV2/widgets/BestWorstDaysWidget';
import { BestWorstWeeksWidget } from '../reviewV2/widgets/BestWorstWeeksWidget';
import { BestWorstMonthsWidget } from '../reviewV2/widgets/BestWorstMonthsWidget';
import { BestWorstQuartersWidget } from '../reviewV2/widgets/BestWorstQuartersWidget';
import { TradesDailyWidget } from '../reviewV2/widgets/TradesDailyWidget';
import { TradesWeeklyWidget } from '../reviewV2/widgets/TradesWeeklyWidget';
import { TradesMonthlyWidget } from '../reviewV2/widgets/TradesMonthlyWidget';
import { TradesQuarterlyWidget } from '../reviewV2/widgets/TradesQuarterlyWidget';
import { TradesScatterWidget } from '../reviewV2/widgets/TradesScatterWidget';
import { DirectionalPnLWidget } from '../reviewV2/widgets/DirectionalPnLWidget';
import { DirectionalDrawdownWidget } from '../reviewV2/widgets/DirectionalDrawdownWidget';
import { BreakdownTableWidget } from '../reviewV2/widgets/BreakdownTableWidget';
import { ImageWidget } from '../reviewV2/widgets/ImageWidget';
import { MarkReviewedWidget } from '../reviewV2/widgets/MarkReviewedWidget';
import { TechnicalGameWidget } from '../reviewV2/widgets/TechnicalGameWidget';
import { MentalGameWidget } from '../reviewV2/widgets/MentalGameWidget';
import { DemonTrackerWidget } from '../reviewV2/widgets/DemonTrackerWidget';
import { KeyLevelsWidget } from '../reviewV2/widgets/KeyLevelsWidget';
import { KeyEventsWidget } from '../reviewV2/widgets/KeyEventsWidget';
import { MissedTradesWidget } from '../reviewV2/widgets/MissedTradesWidget';
import { BacktestTradesWidget } from '../reviewV2/widgets/BacktestTradesWidget';
import { SessionMistakesWidget } from '../reviewV2/widgets/SessionMistakesWidget';
import { PreviousTradingDayContextWidget } from '../reviewV2/widgets/PreviousTradingDayContextWidget';
import { WeeklyDRCContextWidget } from '../reviewV2/widgets/WeeklyDRCContextWidget';
export const TEMPLATE_PREVIEW_WIDGET_HOVER_STYLES = `
          .journalit-template-builder-container .template-preview-widget {
            position: relative;
            border-radius: var(--radius-m);
          }
          .journalit-template-builder-container .template-preview-widget::after {
            content: '';
            position: absolute;
            inset: -2px;
            border: 2px dashed transparent;
            border-radius: var(--radius-m);
            pointer-events: none;
            z-index: 100;
            transition: border-color 0.15s ease;
          }
          .journalit-template-builder-container .tooltip-trigger:hover > .template-preview-widget::after {
            border-color: var(--interactive-accent);
          }
`;

interface TemplatePreviewProps {
  template: ReviewTemplate;
  plugin: JournalitPlugin;
  containerRef?: (element: HTMLDivElement | null) => void;
}


const WidgetPlaceholder: React.FC<{
  widgetType: string;
  description?: string;
}> = ({ widgetType, description }) => {
  const formatName = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="template-preview-placeholder">
      <div
        className={`template-preview-placeholder-title${
          description ? ' template-preview-placeholder-title--spaced' : ''
        }`}
      >
        {formatName(widgetType)}
      </div>
      {description && (
        <div className="template-preview-placeholder-description">
          {description}
        </div>
      )}
    </div>
  );
};


const MarkdownZonePlaceholder: React.FC<{ id?: string; text?: string }> = ({
  id,
  text,
}) => {
  const hasText = text !== undefined && text.trim().length > 0;
  return (
    <div className="template-preview-markdown-zone">
      <span
        className={`template-preview-markdown-text${hasText ? ' template-preview-markdown-text--content' : ''}`}
      >
        {hasText
          ? text
          : id
            ? t('template.preview.markdown-zone-placeholder-with-id', { id })
            : t('template.preview.markdown-zone-placeholder')}
      </span>
    </div>
  );
};


const WidgetTooltipContent: React.FC<{
  name: string;
  description?: string;
}> = React.memo(({ name, description }) => (
  <div>
    <div className={description ? 'template-preview-tooltip-title' : undefined}>
      <span className="template-preview-tooltip-label">Widget: </span>
      <span className="template-preview-tooltip-name">{name}</span>
    </div>
    {description && (
      <div className="template-preview-tooltip-description">{description}</div>
    )}
  </div>
));
WidgetTooltipContent.displayName = 'WidgetTooltipContent';


function getWidgetPreviewContent({
  widget,
  templateType,
  plugin,
}: {
  widget: WidgetPlacement;
  templateType: ReviewTemplateType;
  plugin: JournalitPlugin;
}): React.ReactNode {
  const {
    tradesDaily,
    tradesWeekly,
    tradesMonthly,
    tradesQuarterly,
    tradesYearly,
    goals,
    checklist,
    headerData,
    weeklyGamePerformance,
    monthlyMentalGameData,
    monthlyTechnicalGameData,
    keyLevels,
    keyEvents,
    missedTradesDaily,
    missedTradesWeekly,
    backtestTradesDaily,
    backtestTradesWeekly,
    backtestTradesMonthly,
    sessionMistakes,
  } = previewDataBundle;

  
  
  const trades =
    templateType === 'yearly'
      ? tradesYearly
      : templateType === 'quarterly'
        ? tradesQuarterly
        : templateType === 'monthly'
          ? tradesMonthly
          : templateType === 'weekly'
            ? tradesWeekly
            : tradesDaily;

  const reviewNoteType =
    templateType === 'yearly'
      ? 'yearly-review'
      : templateType === 'quarterly'
        ? 'quarterly-review'
        : templateType === 'monthly'
          ? 'monthly-review'
          : templateType === 'weekly'
            ? 'weekly-review'
            : 'drc';

  
  const missedTrades =
    templateType === 'weekly' ? missedTradesWeekly : missedTradesDaily;

  const backtestTrades =
    templateType === 'weekly'
      ? backtestTradesWeekly
      : templateType === 'monthly' ||
          templateType === 'quarterly' ||
          templateType === 'yearly'
        ? backtestTradesMonthly
        : backtestTradesDaily;

  
  const commonProps = {
    filePath: '', 
    plugin,
    preview: true,
  };

  switch (widget.type) {
    
    case 'header':
      return (
        <div className="journalit-widget journalit-header">
          <HeaderWidget
            {...commonProps}
            previewData={headerData[templateType]}
          />
        </div>
      );

    
    case 'goals':
      return <GoalsWidget {...commonProps} previewData={{ goals }} />;

    
    case 'review': {
      const reviewConfig = widget.config as
        | { gradeScale?: 'letter' | 'numeric' }
        | undefined;
      const gradeScale =
        reviewConfig?.gradeScale ||
        (templateType === 'drc' ? 'letter' : 'numeric');
      return (
        <ReviewWidget
          {...commonProps}
          config={widget.config}
          previewData={{
            mentalGrade: gradeScale === 'letter' ? 'B' : 4,
            technicalGrade: gradeScale === 'letter' ? 'A' : 5,
            gradeScale,
          }}
        />
      );
    }

    case 'review-context-fields':
      return (
        <div className="journalit-widget journalit-review-context-fields">
          <ReviewContextFieldsWidget
            {...commonProps}
            config={widget.config}
            previewReviewType={templateType}
          />
        </div>
      );

    
    case 'stats':
      
      return (
        <div className="journalit-widget journalit-stats">
          <StatsWidget
            {...commonProps}
            config={widget.config}
            previewData={{ trades }}
          />
        </div>
      );

    case 'account-breakdown':
      return (
        <div className="journalit-widget journalit-account-breakdown">
          <AccountBreakdownWidget {...commonProps} previewData={{ trades }} />
        </div>
      );

    
    case 'trades':
      
      return (
        <div className="journalit-widget journalit-trades">
          <TradeTableWidget
            {...commonProps}
            config={widget.config}
            previewData={{ trades, noteType: reviewNoteType }}
          />
        </div>
      );

    
    case 'pnl-chart':
      return (
        <PnLChartWidget
          {...commonProps}
          config={widget.config}
          previewData={{ trades }}
        />
      );

    case 'drawdown-chart':
      return (
        <DrawdownChartWidget
          {...commonProps}
          config={widget.config}
          previewData={{ trades }}
        />
      );

    
    case 'setup-performance':
      return (
        <SetupPerformanceWidget
          {...commonProps}
          config={widget.config}
          previewData={{ trades }}
        />
      );

    
    case 'best-worst': {
      const periodConfig = widget.config as
        | { period?: 'trades' | 'days' | 'weeks' | 'months' | 'quarters' }
        | undefined;
      const period = periodConfig?.period || 'trades';
      switch (period) {
        case 'days':
          return (
            <BestWorstDaysWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
        case 'weeks':
          return (
            <BestWorstWeeksWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
        case 'months':
          return (
            <BestWorstMonthsWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
        case 'quarters':
          return (
            <BestWorstQuartersWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
        default:
          return (
            <BestWorstTradesWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
      }
    }

    
    case 'trades-chart': {
      const periodConfig = widget.config as
        | { period?: 'trades' | 'daily' | 'weekly' | 'monthly' | 'quarterly' }
        | undefined;
      const period = periodConfig?.period || 'trades';
      switch (period) {
        case 'daily':
          return (
            <TradesDailyWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
        case 'weekly':
          return (
            <TradesWeeklyWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
        case 'monthly':
          return (
            <TradesMonthlyWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
        case 'quarterly':
          return (
            <TradesQuarterlyWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
        default:
          return (
            <TradesScatterWidget
              {...commonProps}
              config={widget.config}
              previewData={{ trades }}
            />
          );
      }
    }

    case 'directional-pnl':
      return (
        <DirectionalPnLWidget
          {...commonProps}
          config={widget.config}
          previewData={{ trades }}
        />
      );

    case 'directional-drawdown':
      return (
        <DirectionalDrawdownWidget
          {...commonProps}
          config={widget.config}
          previewData={{ trades }}
        />
      );

    case 'long-drawdown':
      return (
        <DirectionalDrawdownWidget
          {...commonProps}
          config={{
            ...widget.config,
            showLong: true,
            showShort: false,
            singleDirectionTitle: t('widget.long-drawdown.name'),
          }}
          previewData={{ trades }}
        />
      );

    case 'short-drawdown':
      return (
        <DirectionalDrawdownWidget
          {...commonProps}
          config={{
            ...widget.config,
            showLong: false,
            showShort: true,
            singleDirectionTitle: t('widget.short-drawdown.name'),
          }}
          previewData={{ trades }}
        />
      );

    
    case 'breakdown': {
      const periodConfig = widget.config as
        | { period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' }
        | undefined;
      const period = periodConfig?.period || 'daily';
      return (
        <BreakdownTableWidget
          {...commonProps}
          config={widget.config}
          previewData={{ trades }}
          period={period}
        />
      );
    }

    case 'previous-trading-day-context':
      return (
        <PreviousTradingDayContextWidget
          {...commonProps}
          config={widget.config}
          preview={true}
        />
      );

    case 'weekly-drc-context':
      return (
        <div className="journalit-widget journalit-weekly-drc-context-widget">
          <WeeklyDRCContextWidget
            {...commonProps}
            config={widget.config}
            preview={true}
          />
        </div>
      );

    
    case 'images':
      return (
        <ImageWidget
          {...commonProps}
          config={widget.config}
          previewData={{
            images: [
              createSvgPlaceholderDataUri(
                400,
                300,
                '#1a1a2e',
                '#eeeeee',
                'Chart Screenshot'
              ),
              createSvgPlaceholderDataUri(
                400,
                300,
                '#16213e',
                '#eeeeee',
                'Trade Setup'
              ),
            ],
          }}
        />
      );

    
    case 'markdown-zone': {
      const config = widget.config as { text?: string } | undefined;
      return <MarkdownZonePlaceholder id={widget.id} text={config?.text} />;
    }

    
    case 'markdown-header': {
      const config = widget.config as
        | { level?: number; text?: string }
        | undefined;
      const level = config?.level ?? 2;
      const text = config?.text || 'Section Header';
      const fontSizes: Record<number, string> = {
        1: '2em',
        2: '1.5em',
        3: '1.25em',
        4: '1em',
        5: '0.875em',
        6: '0.85em',
      };
      return React.createElement(
        `h${level}`,
        {
          style: {
            fontSize: fontSizes[level],
            fontWeight: level === 1 ? 700 : 600,
            margin: '0.5rem 0',
            color: 'var(--text-normal)',
          },
        },
        text
      );
    }

    
    case 'mark-reviewed':
      return (
        <MarkReviewedWidget
          {...commonProps}
          previewData={{
            reviewed: true,
            reviewedAt: new Date().toISOString(),
          }}
        />
      );

    
    case 'technical-game': {
      
      const gameNoteType =
        templateType === 'yearly'
          ? 'yearly-review'
          : templateType === 'quarterly'
            ? 'quarterly-review'
            : 'monthly-review';
      return (
        <div className="journalit-widget journalit-technical-game">
          <TechnicalGameWidget
            {...commonProps}
            config={widget.config}
            previewData={{
              weeks: weeklyGamePerformance,
              noteType: gameNoteType,
              
              monthlyData:
                templateType === 'yearly'
                  ? monthlyTechnicalGameData
                  : undefined,
            }}
          />
        </div>
      );
    }

    case 'mental-game': {
      
      const gameNoteType =
        templateType === 'yearly'
          ? 'yearly-review'
          : templateType === 'quarterly'
            ? 'quarterly-review'
            : 'monthly-review';
      return (
        <div className="journalit-widget journalit-mental-game">
          <MentalGameWidget
            {...commonProps}
            config={widget.config}
            previewData={{
              weeks: weeklyGamePerformance,
              noteType: gameNoteType,
              
              monthlyData:
                templateType === 'yearly' ? monthlyMentalGameData : undefined,
            }}
          />
        </div>
      );
    }

    
    case 'checklist':
      return (
        <ChecklistWidget
          {...commonProps}
          previewData={{ items: checklist }}
          previewReviewType={
            templateType === 'weekly' ? 'weekly-review' : 'drc'
          }
        />
      );

    case 'session-mistakes':
      return (
        <div className="journalit-widget journalit-session-mistakes">
          <SessionMistakesWidget
            {...commonProps}
            previewData={{ mistakes: sessionMistakes }}
          />
        </div>
      );

    case 'key-levels':
      return (
        <div className="journalit-widget journalit-key-levels">
          <KeyLevelsWidget
            {...commonProps}
            config={widget.config}
            previewData={{ keyLevels }}
          />
        </div>
      );

    case 'missed-trades':
      return (
        <div className="journalit-widget journalit-missed-trades">
          <MissedTradesWidget
            {...commonProps}
            config={widget.config}
            previewData={{
              missedTrades,
              noteType: templateType === 'weekly' ? 'weekly-review' : 'drc',
            }}
          />
        </div>
      );

    case 'backtest-trades':
      return (
        <div className="journalit-widget journalit-backtest-trades">
          <BacktestTradesWidget
            {...commonProps}
            config={widget.config}
            previewData={{ trades: backtestTrades }}
          />
        </div>
      );

    case 'key-events':
      return (
        <div className="journalit-widget journalit-key-events">
          <KeyEventsWidget
            {...commonProps}
            previewData={{
              events: keyEvents,
              reviewMode: templateType === 'weekly' ? 'weekly-review' : 'drc',
            }}
          />
        </div>
      );

    case 'game-performance':
      return (
        <WidgetPlaceholder
          widgetType={widget.type}
          description={t('template.preview.widget.game-performance-desc')}
        />
      );

    case 'demon-tracker': {
      
      const demonNoteType =
        templateType === 'yearly'
          ? 'yearly-review'
          : templateType === 'quarterly'
            ? 'quarterly-review'
            : 'monthly-review';
      return (
        <div className="journalit-widget journalit-demon-tracker">
          <DemonTrackerWidget
            {...commonProps}
            config={widget.config}
            previewData={{
              demons: previewDataBundle.demonData,
              noteType: demonNoteType,
            }}
          />
        </div>
      );
    }

    default:
      return (
        <WidgetPlaceholder
          widgetType={widget.type}
          description={t('template.preview.widget.unknown-desc')}
        />
      );
  }
}

const WidgetRenderer: React.FC<{
  widget: WidgetPlacement;
  templateType: ReviewTemplateType;
  plugin: JournalitPlugin;
}> = ({ widget, templateType, plugin }) => {
  return <>{getWidgetPreviewContent({ widget, templateType, plugin })}</>;
};


export const TemplatePreview: React.FC<TemplatePreviewProps> = React.memo(
  ({ template, plugin, containerRef }) => {
    
    useEffect(() => {}, []);

    
    useEffect(() => {
      // intentional
    }, []);

    if (!template || !template.widgets || template.widgets.length === 0) {
      return (
        <div className="template-preview-empty">
          {t('template.preview.empty')}
        </div>
      );
    }

    
    
    return (
      <DisplayPolicyProvider privacyModeOverride={false}>
        <div className="template-preview" ref={containerRef}>
          
          <div className="template-preview-header">
            <div>
              <div className="template-preview-title">{template.name}</div>
              <div className="template-preview-subtitle">
                {t('template.preview.summary', {
                  type: template.type.toUpperCase(),
                  count: String(template.widgets.length),
                })}
              </div>
            </div>
            <div className="template-preview-mode-badge">
              {t('template.preview.mode')}
            </div>
          </div>

          
          <div className="template-preview-content">
            
            {template.widgets.map((widget, index) => {
              
              
              const widgetDef =
                getWidgetByTypeAndConfig(widget.type, widget.config) ||
                getWidgetByType(widget.type);
              const widgetName = getWidgetNameByPlacement(
                widget.type,
                widget.config
              );
              const widgetDescription = widgetDef?.description;

              return (
                <Tooltip
                  key={`${widget.type}-${widget.id || index}`}
                  content={
                    <WidgetTooltipContent
                      name={widgetName}
                      description={widgetDescription}
                    />
                  }
                  delay={400}
                  preferredPosition="top"
                  block
                >
                  <div className="template-preview-widget">
                    <WidgetRenderer
                      widget={widget}
                      templateType={template.type}
                      plugin={plugin}
                    />
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </DisplayPolicyProvider>
    );
  }
);

TemplatePreview.displayName = 'TemplatePreview';
