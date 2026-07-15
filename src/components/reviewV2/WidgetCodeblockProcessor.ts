

import {
  Editor,
  MarkdownPostProcessor,
  MarkdownPostProcessorContext,
  MarkdownPreviewRenderer,
  MarkdownRenderChild,
  MarkdownSectionInformation,
  TFile,
} from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { createElement, type ReactElement } from 'react';
import { replaceFileContent } from '../../utils/fileMutation';
import type {
  ReviewContextFieldsWidgetConfig,
  ReviewWidgetType,
} from '../../types/reviewV2';
import {
  HeaderWidget,
  GoalsWidget,
  ChecklistWidget,
  ReviewWidget,
  ReviewContextFieldsWidget,
  StatsWidget,
  AccountBreakdownWidget,
  PnLChartWidget,
  DrawdownChartWidget,
  PreviousTradingDayContextWidget,
  WeeklyDRCContextWidget,
  SessionLogWidget,
} from './widgets';
import { TradeTableWidget } from './widgets/TradeTableWidget';
import { TradeReviewWidget } from './widgets/TradeReviewWidget';
import {
  parseTradeReviewQuestions,
  type TradeReviewCardField,
  type TradeReviewWidgetConfig,
} from './widgets/tradeReviewConfig';
import { BreakdownTableWidget } from './widgets/BreakdownTableWidget';
import {
  SetupPerformanceWidget,
  SetupPerformanceWidgetConfig,
} from './widgets/SetupPerformanceWidget';
import { BestWorstTradesWidget } from './widgets/BestWorstTradesWidget';
import { BestWorstDaysWidget } from './widgets/BestWorstDaysWidget';
import { BestWorstWeeksWidget } from './widgets/BestWorstWeeksWidget';
import { BestWorstMonthsWidget } from './widgets/BestWorstMonthsWidget';
import { BestWorstQuartersWidget } from './widgets/BestWorstQuartersWidget';
import { TradesScatterWidget } from './widgets/TradesScatterWidget';
import { TradesDailyWidget } from './widgets/TradesDailyWidget';
import { TradesWeeklyWidget } from './widgets/TradesWeeklyWidget';
import { TradesMonthlyWidget } from './widgets/TradesMonthlyWidget';
import { TradesQuarterlyWidget } from './widgets/TradesQuarterlyWidget';
import {
  DirectionalPnLWidget,
  DirectionalPnLWidgetConfig,
} from './widgets/DirectionalPnLWidget';
import {
  DirectionalDrawdownWidget,
  DirectionalDrawdownWidgetConfig,
} from './widgets/DirectionalDrawdownWidget';
import {
  ImageWidget,
  ImageWidgetCodeblockContext,
  ImageWidgetConfig,
} from './widgets/ImageWidget';
import { MarkReviewedWidget } from './widgets/MarkReviewedWidget';
import { TechnicalGameWidget } from './widgets/TechnicalGameWidget';
import { MentalGameWidget } from './widgets/MentalGameWidget';
import { DemonTrackerWidget } from './widgets/DemonTrackerWidget';
import { parseDemonTrackerWidgetConfig } from './widgets/shared/demonTrackerConfigParser';
import { SessionMistakesWidget } from './widgets/SessionMistakesWidget';
import { KeyLevelsWidget } from './widgets/KeyLevelsWidget';
import { KeyEventsWidget } from './widgets/KeyEventsWidget';
import { MissedTradesWidget } from './widgets/MissedTradesWidget';
import { BacktestTradesWidget } from './widgets/BacktestTradesWidget';
import type { WeeklyDRCContextConfig } from './widgets/WeeklyDRCContextWidget';

const WEEKLY_DRC_DAY_SCOPES = new Set([
  'all',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]);

function findConfigSeparator(line: string): number {
  return line.search(/:/);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getRecordValue(value: unknown, key: string): unknown {
  return isRecord(value) ? value[key] : undefined;
}

function getStringArrayValue(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const strings: string[] = [];
  for (const item of value) {
    if (typeof item === 'string') strings.push(item);
  }
  return strings;
}

function parseReviewWidgetConfig(source: string): {
  gradeScale?: 'letter' | 'numeric';
} {
  const parsed: unknown = JSON.parse(source);
  if (!isRecord(parsed)) {
    return {};
  }

  return parsed.gradeScale === 'letter' || parsed.gradeScale === 'numeric'
    ? { gradeScale: parsed.gradeScale }
    : {};
}
import type JournalitPlugin from '../../main';
import { CurrencyProvider } from '../../contexts/CurrencyContext';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';
import { t } from '../../lang/helpers';

const globallyRegisteredCodeblockProcessors = new Map<
  string,
  MarkdownPostProcessor
>();
import { generateUUID } from '../../utils/uuid';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import {
  isMarkdownView,
  isViewWithTFile,
} from '../../types/obsidian-extensions';


class ReactRenderChild extends MarkdownRenderChild {
  private root: Root | null = null;
  private onUnloadCallback: (() => void) | null = null;

  constructor(containerEl: HTMLElement, onUnload?: () => void) {
    super(containerEl);
    this.onUnloadCallback = onUnload || null;
  }

  setRoot(root: Root): void {
    this.root = root;
  }

  onunload(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.onUnloadCallback) {
      this.onUnloadCallback();
    }
  }
}



function isWeeklyDRCDayScope(
  value: string
): value is NonNullable<WeeklyDRCContextConfig['dayScope']> {
  return WEEKLY_DRC_DAY_SCOPES.has(value);
}

function parseSetupPerformanceSortBy(
  value: string
): SetupPerformanceWidgetConfig['sortBy'] | undefined {
  switch (value) {
    case 'pnl':
    case 'winRate':
    case 'tradeCount':
      return value;
    default:
      return undefined;
  }
}

function parseDirectionalLayout(
  value: string
): 'stacked' | 'side-by-side' | undefined {
  switch (value) {
    case 'stacked':
    case 'side-by-side':
      return value;
    default:
      return undefined;
  }
}

function parseImageLayout(value: string): 'carousel' | 'stacked' | undefined {
  switch (value) {
    case 'carousel':
    case 'stacked':
      return value;
    default:
      return undefined;
  }
}

function parseTradeReviewFields(value: string): TradeReviewCardField[] {
  return value.split(',').flatMap((field): TradeReviewCardField[] => {
    const normalizedField = field
      .trim()
      .replaceAll('[', '')
      .replaceAll(']', '')
      .replaceAll('"', '')
      .replaceAll("'", '');
    switch (normalizedField) {
      case 'entry':
      case 'exit':
      case 'duration':
      case 'risk':
      case 'positionSize':
      case 'stopLoss':
      case 'takeProfit':
      case 'fees':
      case 'commission':
      case 'mae':
      case 'mfe':
      case 'account':
      case 'setup':
      case 'mistakes':
      case 'tags':
      case 'thesis':
      case 'notes':
      case 'customFields':
        return [normalizedField];
      default:
        return [];
    }
  });
}

export class WidgetCodeblockProcessor {
  private plugin: JournalitPlugin;
  private roots: Map<HTMLElement, Root> = new Map();
  private registeredTypes: Set<string> = new Set();
  private registeredPostProcessors: Map<string, MarkdownPostProcessor> =
    new Map();
  private fileLineCache: Map<string, { mtime: number; lines: string[] }> =
    new Map();
  private imageCodeblockIndex: Map<
    string,
    { docId: string; mtime: number; index: number; starts: number[] }
  > = new Map();
  private imageWidgetIdMigration: Map<string, Promise<boolean>> = new Map();

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  registerAll(): void {
    

    
    
    const widgetTypes: ReviewWidgetType[] = [
      
      'header',
      'goals',
      'checklist',
      'session-mistakes',
      'session-log',
      'key-levels',
      'trades',
      'trade-review',
      'review',
      'review-context-fields',
      'missed-trades',
      'backtest-trades',
      'stats',
      'account-breakdown',

      
      'key-events',
      'previous-trading-day-context',
      'weekly-drc-context',
      'pnl-chart',
      'drawdown-chart',
      'breakdown', 
      'best-worst', 
      'trades-chart', 

      
      'technical-game',
      'mental-game',
      'demon-tracker',

      
      'setup-performance',
      'directional-pnl',
      'directional-drawdown',
      'long-drawdown',
      'short-drawdown',
      'images',
      'mark-reviewed',

      
      
      
    ];

    for (const widgetType of widgetTypes) {
      this.registerProcessor(widgetType);
    }
  }

  
  private registerProcessor(widgetType: ReviewWidgetType): void {
    const codeblockType = `journalit-${widgetType}`;
    if (this.registeredTypes.has(codeblockType)) {
      return;
    }

    const existingProcessor =
      globallyRegisteredCodeblockProcessors.get(codeblockType);
    if (existingProcessor) {
      try {
        MarkdownPreviewRenderer.unregisterPostProcessor(existingProcessor);
      } catch (error) {
        console.warn(
          `[Journalit] Failed to unregister stale codeblock processor for ${codeblockType}:`,
          error
        );
      }
      globallyRegisteredCodeblockProcessors.delete(codeblockType);
    }

    const postProcessor = this.plugin.registerMarkdownCodeBlockProcessor(
      codeblockType,
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        return this.processCodeblock(widgetType, source, el, ctx);
      }
    );

    this.registeredPostProcessors.set(codeblockType, postProcessor);
    globallyRegisteredCodeblockProcessors.set(codeblockType, postProcessor);
    this.registeredTypes.add(codeblockType);
  }

  
  private async processCodeblock(
    widgetType: ReviewWidgetType,
    source: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext
  ): Promise<void> {
    if (widgetType === 'images') {
      await this.ensureImageWidgetIds(ctx.sourcePath);
    }

    const codeblockContext =
      widgetType === 'images'
        ? await this.getImagesCodeblockContext(
            ctx.sourcePath,
            ctx.docId,
            ctx.getSectionInfo(el)
          )
        : undefined;

    
    el.empty();

    
    el.addClass('journalit-widget', `journalit-${widgetType}`);

    
    const widget = this.createWidget(
      widgetType,
      source,
      ctx.sourcePath,
      codeblockContext
    );

    
    const renderChild = new ReactRenderChild(el, () => {
      this.roots.delete(el);
    });

    
    const root = createRoot(el);
    root.render(
      createElement(
        CurrencyProvider,
        null,
        createElement(DisplayPolicyProvider, null, widget)
      )
    );

    
    renderChild.setRoot(root);
    this.roots.set(el, root);

    
    ctx.addChild(renderChild);
  }

  
  private createWidget(
    widgetType: ReviewWidgetType,
    source: string,
    filePath: string,
    codeblockContext?: ImageWidgetCodeblockContext
  ): ReactElement {
    
    if (widgetType === 'header') {
      return createElement(HeaderWidget, { filePath, plugin: this.plugin });
    }

    
    if (widgetType === 'goals') {
      return createElement(GoalsWidget, { filePath, plugin: this.plugin });
    }

    
    if (widgetType === 'checklist') {
      return createElement(ChecklistWidget, { filePath, plugin: this.plugin });
    }

    
    if (widgetType === 'review') {
      
      let config: { gradeScale?: 'letter' | 'numeric' } = {};
      try {
        if (source.trim()) {
          config = parseReviewWidgetConfig(source);
        }
      } catch {
        
        console.warn(
          '[WidgetCodeblockProcessor] Invalid config for review widget:',
          source
        );
      }
      return createElement(ReviewWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    if (widgetType === 'review-context-fields') {
      const config: ReviewContextFieldsWidgetConfig = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex <= 0) continue;
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          if (
            key === 'selectionMode' &&
            (value === 'all' || value === 'group' || value === 'fields')
          ) {
            config.selectionMode = value;
          }
          if (key === 'groupId') config.groupId = value;
          if (key === 'fieldIds') config.fieldIds = value;
          if (key === 'showInherited') config.showInherited = value === 'true';
          if (key === 'showLocal') config.showLocal = value === 'true';
          if (key === 'hideEmpty') config.hideEmpty = value === 'true';
        }
      }
      return createElement(ReviewContextFieldsWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    if (widgetType === 'trade-review') {
      const config: TradeReviewWidgetConfig = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex <= 0) continue;
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          if (key === 'defaultExpanded')
            config.defaultExpanded = value === 'true';
          if (key === 'showReviewedTrades') {
            config.showReviewedTrades = value === 'true';
          }
          if (key === 'showOpenTrades')
            config.showOpenTrades = value === 'true';
          if (key === 'showImages') config.showImages = value === 'true';
          if (key === 'fields') config.fields = parseTradeReviewFields(value);
          if (key === 'primaryMetrics')
            config.primaryMetrics = parseTradeReviewFields(value);
          if (key === 'classificationFields')
            config.classificationFields = parseTradeReviewFields(value);
          if (key === 'moreContextFields')
            config.moreContextFields = parseTradeReviewFields(value);
          if (key === 'winQuestions') {
            config.winQuestions = parseTradeReviewQuestions(value);
          }
          if (key === 'lossQuestions') {
            config.lossQuestions = parseTradeReviewQuestions(value);
          }
          if (key === 'breakevenQuestions') {
            config.breakevenQuestions = parseTradeReviewQuestions(value);
          }
          if (key === 'openQuestions') {
            config.openQuestions = parseTradeReviewQuestions(value);
          }
        }
      }
      return createElement(TradeReviewWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    if (widgetType === 'previous-trading-day-context') {
      const config: {
        headings?: string;
        headingsJson?: string;
        fallbackMode?: 'expected-only' | 'nearest-earlier';
      } = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'headings') config.headings = value;
            if (key === 'headingsJson') config.headingsJson = value;
            if (
              key === 'fallbackMode' &&
              (value === 'expected-only' || value === 'nearest-earlier')
            ) {
              config.fallbackMode = value;
            }
          }
        }
      }
      return createElement(PreviousTradingDayContextWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    if (widgetType === 'weekly-drc-context') {
      const config: WeeklyDRCContextConfig = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'headings') config.headings = value;
            if (key === 'headingsJson') config.headingsJson = value;
            if (key === 'dayScope' && isWeeklyDRCDayScope(value)) {
              config.dayScope = value;
            }
            if (key === 'defaultExpanded') {
              config.defaultExpanded = value === 'true';
            }
          }
        }
      }
      return createElement(WeeklyDRCContextWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    
    if (widgetType === 'stats') {
      
      const config: Record<string, unknown> = {};
      try {
        if (source.trim()) {
          const lines = source.trim().split('\n');
          for (const line of lines) {
            const colonIndex = findConfigSeparator(line);
            if (colonIndex > 0) {
              const key = line.substring(0, colonIndex).trim();
              const value = line.substring(colonIndex + 1).trim();
              if (key === 'columns') {
                config.columns = parseInt(value, 10);
              }
            }
          }
        }
      } catch {
        console.warn(
          '[WidgetCodeblockProcessor] Invalid config for stats widget:',
          source
        );
      }
      return createElement(StatsWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    if (widgetType === 'account-breakdown') {
      return createElement(AccountBreakdownWidget, {
        filePath,
        plugin: this.plugin,
      });
    }

    
    if (widgetType === 'pnl-chart') {
      const config: { height?: number } = {};
      try {
        if (source.trim()) {
          const lines = source.trim().split('\n');
          for (const line of lines) {
            const colonIndex = findConfigSeparator(line);
            if (colonIndex > 0) {
              const key = line.substring(0, colonIndex).trim();
              const value = line.substring(colonIndex + 1).trim();
              if (key === 'height') {
                config.height = parseInt(value, 10);
              }
            }
          }
        }
      } catch {
        console.warn(
          '[WidgetCodeblockProcessor] Invalid config for pnl-chart widget:',
          source
        );
      }
      return createElement(PnLChartWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    
    if (widgetType === 'drawdown-chart') {
      const config: { height?: number } = {};
      try {
        if (source.trim()) {
          const lines = source.trim().split('\n');
          for (const line of lines) {
            const colonIndex = findConfigSeparator(line);
            if (colonIndex > 0) {
              const key = line.substring(0, colonIndex).trim();
              const value = line.substring(colonIndex + 1).trim();
              if (key === 'height') {
                config.height = parseInt(value, 10);
              }
            }
          }
        }
      } catch {
        console.warn(
          '[WidgetCodeblockProcessor] Invalid config for drawdown-chart widget:',
          source
        );
      }
      return createElement(DrawdownChartWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    
    if (widgetType === 'trades') {
      const config: Record<string, unknown> = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'showOpenTrades')
              config.showOpenTrades = value === 'true';
            if (key === 'pageSize') config.pageSize = parseInt(value, 10);
          }
        }
      }
      return createElement(TradeTableWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    
    if (widgetType === 'breakdown') {
      const config: Record<string, unknown> = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'period') config.period = value;
            if (key === 'groupBy') config.groupBy = value;
          }
        }
      }
      
      const period =
        config.period === 'weekly' ||
        config.period === 'monthly' ||
        config.period === 'quarterly'
          ? config.period
          : 'daily';
      return createElement(BreakdownTableWidget, {
        filePath,
        plugin: this.plugin,
        config,
        period,
      });
    }

    
    if (widgetType === 'setup-performance') {
      const config: SetupPerformanceWidgetConfig = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'showChart') config.showChart = value === 'true';
            if (key === 'showTable') config.showTable = value === 'true';
            if (key === 'topN') config.topN = parseInt(value, 10);
            if (key === 'sortBy') {
              config.sortBy = parseSetupPerformanceSortBy(value);
            }
            if (key === 'height') config.height = parseInt(value, 10);
          }
        }
      }
      return createElement(SetupPerformanceWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    
    if (widgetType === 'best-worst') {
      const config: Record<string, unknown> = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'period') config.period = value;
            if (key === 'showBest') config.showBest = value === 'true';
            if (key === 'showWorst') config.showWorst = value === 'true';
            if (key === 'showDuration') config.showDuration = value === 'true';
            if (key === 'showSetups') config.showSetups = value === 'true';
            if (key === 'showMistakes') config.showMistakes = value === 'true';
          }
        }
      }
      const period = config.period || 'trades';
      
      switch (period) {
        case 'trades':
          return createElement(BestWorstTradesWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        case 'days':
          return createElement(BestWorstDaysWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        case 'weeks':
          return createElement(BestWorstWeeksWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        case 'months':
          return createElement(BestWorstMonthsWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        case 'quarters':
          return createElement(BestWorstQuartersWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        default:
          return createElement(BestWorstTradesWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
      }
    }

    
    if (widgetType === 'trades-chart') {
      const config: Record<string, unknown> = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'period') config.period = value;
            if (key === 'height') config.height = parseInt(value, 10);
          }
        }
      }
      const period = config.period || 'trades';
      
      switch (period) {
        case 'trades':
          return createElement(TradesScatterWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        case 'daily':
          return createElement(TradesDailyWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        case 'weekly':
          return createElement(TradesWeeklyWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        case 'monthly':
          return createElement(TradesMonthlyWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        case 'quarterly':
          return createElement(TradesQuarterlyWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
        default:
          return createElement(TradesScatterWidget, {
            filePath,
            plugin: this.plugin,
            config,
          });
      }
    }

    
    if (widgetType === 'directional-pnl') {
      const config: DirectionalPnLWidgetConfig = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'showLong') config.showLong = value === 'true';
            if (key === 'showShort') config.showShort = value === 'true';
            if (key === 'height') config.height = parseInt(value, 10);
            if (key === 'layout') {
              config.layout = parseDirectionalLayout(value);
            }
          }
        }
      }
      return createElement(DirectionalPnLWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    if (
      widgetType === 'directional-drawdown' ||
      widgetType === 'long-drawdown' ||
      widgetType === 'short-drawdown'
    ) {
      const config: DirectionalDrawdownWidgetConfig = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'showLong') config.showLong = value === 'true';
            if (key === 'showShort') config.showShort = value === 'true';
            if (key === 'height') config.height = parseInt(value, 10);
            if (key === 'layout') {
              config.layout = parseDirectionalLayout(value);
            }
          }
        }
      }

      if (widgetType === 'long-drawdown') {
        config.showLong = true;
        config.showShort = false;
        config.singleDirectionTitle = t('widget.long-drawdown.name');
      }

      if (widgetType === 'short-drawdown') {
        config.showLong = false;
        config.showShort = true;
        config.singleDirectionTitle = t('widget.short-drawdown.name');
      }

      return createElement(DirectionalDrawdownWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    
    if (widgetType === 'images') {
      const config: ImageWidgetConfig = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'id') config.id = value;
            if (key === 'maxImages') config.maxImages = parseInt(value, 10);
            if (key === 'showUploader') config.showUploader = value === 'true';
            if (key === 'layout') {
              config.layout = parseImageLayout(value);
            }
          }
        }
      }
      return createElement(ImageWidget, {
        filePath,
        plugin: this.plugin,
        config,
        codeblockContext,
      });
    }

    
    if (widgetType === 'mark-reviewed') {
      return createElement(MarkReviewedWidget, {
        filePath,
        plugin: this.plugin,
      });
    }

    
    if (widgetType === 'technical-game') {
      return createElement(TechnicalGameWidget, {
        filePath,
        plugin: this.plugin,
      });
    }

    
    if (widgetType === 'mental-game') {
      return createElement(MentalGameWidget, { filePath, plugin: this.plugin });
    }

    
    if (widgetType === 'demon-tracker') {
      const config = parseDemonTrackerWidgetConfig(source);

      return createElement(DemonTrackerWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    
    if (widgetType === 'session-mistakes') {
      return createElement(SessionMistakesWidget, {
        filePath,
        plugin: this.plugin,
      });
    }

    if (widgetType === 'session-log') {
      return createElement(SessionLogWidget, {
        filePath,
        plugin: this.plugin,
      });
    }

    
    if (widgetType === 'key-levels') {
      return createElement(KeyLevelsWidget, { filePath, plugin: this.plugin });
    }

    
    if (widgetType === 'key-events') {
      return createElement(KeyEventsWidget, { filePath, plugin: this.plugin });
    }

    
    if (widgetType === 'missed-trades') {
      return createElement(MissedTradesWidget, {
        filePath,
        plugin: this.plugin,
      });
    }

    
    if (widgetType === 'backtest-trades') {
      const config: Record<string, unknown> = {};
      if (source.trim()) {
        const lines = source.trim().split('\n');
        for (const line of lines) {
          const colonIndex = findConfigSeparator(line);
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key === 'showOpenTrades')
              config.showOpenTrades = value === 'true';
            if (key === 'pageSize') config.pageSize = parseInt(value, 10);
          }
        }
      }
      return createElement(BacktestTradesWidget, {
        filePath,
        plugin: this.plugin,
        config,
      });
    }

    
    return this.createPlaceholderWidget(widgetType, source, filePath);
  }

  private async ensureImageWidgetIds(filePath: string): Promise<boolean> {
    const existing = this.imageWidgetIdMigration.get(filePath);
    if (existing) {
      return await existing;
    }

    const task = this.runImageWidgetIdMigration(filePath);
    this.imageWidgetIdMigration.set(filePath, task);
    try {
      return await task;
    } finally {
      this.imageWidgetIdMigration.delete(filePath);
    }
  }

  private getEditorContext(
    filePath: string
  ): { lines: string[]; editor: Editor } | null {
    const leaves = this.plugin.app.workspace.getLeavesOfType('markdown');
    for (const leaf of leaves) {
      const view = leaf.view;
      if (!isMarkdownView(view) || !isViewWithTFile(view)) {
        continue;
      }

      if (view.file.path !== filePath) {
        continue;
      }

      const content = view.editor?.getValue();
      if (content === undefined) {
        continue;
      }

      return { lines: content.split('\n'), editor: view.editor };
    }

    return null;
  }

  private async waitForEditorUpdate(): Promise<void> {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 0);
    });
  }

  private async runImageWidgetIdMigration(filePath: string): Promise<boolean> {
    const editorContext = this.getEditorContext(filePath);
    let lines = editorContext?.lines ?? null;

    let file: TFile | null = null;
    if (!lines) {
      const abstractFile =
        this.plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(abstractFile instanceof TFile)) {
        return false;
      }
      file = abstractFile;
      const content = await this.plugin.app.vault.read(file);
      lines = content.split('\n');
    } else {
      const abstractFile =
        this.plugin.app.vault.getAbstractFileByPath(filePath);
      if (abstractFile instanceof TFile) {
        file = abstractFile;
      }
    }

    if (!lines || !file) {
      return false;
    }

    const { blocks, inserts, replacements } = this.parseImageCodeblocks(lines);
    if (!blocks.length) {
      return false;
    }

    let didUpdate = false;

    if (inserts.length > 0 || replacements.length > 0) {
      didUpdate = true;
      const sortedInserts = [...inserts].sort((a, b) => b.line - a.line);
      const sortedReplacements = [...replacements].sort(
        (a, b) => b.line - a.line
      );

      const updatedLines = [...lines];
      for (const replacement of sortedReplacements) {
        updatedLines[replacement.line] = `id: ${replacement.id}`;
      }
      for (const insert of sortedInserts) {
        updatedLines.splice(insert.line, 0, `id: ${insert.id}`);
      }

      if (editorContext?.editor) {
        await this.waitForEditorUpdate();
        for (const replacement of sortedReplacements) {
          const lineText = editorContext.editor.getLine(replacement.line);
          editorContext.editor.replaceRange(
            `id: ${replacement.id}`,
            { line: replacement.line, ch: 0 },
            { line: replacement.line, ch: lineText.length }
          );
        }
        for (const insert of sortedInserts) {
          editorContext.editor.replaceRange(`id: ${insert.id}\n`, {
            line: insert.line,
            ch: 0,
          });
        }
      } else {
        await replaceFileContent(
          this.plugin.app,
          file,
          updatedLines.join('\n')
        );
      }
      lines = updatedLines;
      this.fileLineCache.delete(filePath);
      this.imageCodeblockIndex.delete(filePath);
    }

    const firstId = blocks[0]?.id;
    if (!firstId) {
      return didUpdate;
    }

    const cache = this.plugin.app.metadataCache.getFileCache(file);
    const cacheFrontmatter: unknown = cache?.frontmatter;
    const cachedLegacyImages = getRecordValue(cacheFrontmatter, 'images');
    const legacyImages = Array.isArray(cachedLegacyImages)
      ? cachedLegacyImages.filter(
          (item): item is string => typeof item === 'string'
        )
      : [];
    const cachedImagesByWidgetSource = getRecordValue(
      cacheFrontmatter,
      'imagesByWidget'
    );
    const cachedImagesByWidget = isRecord(cachedImagesByWidgetSource)
      ? cachedImagesByWidgetSource
      : {};
    const cachedWidgetKeys = Object.keys(cachedImagesByWidget);
    const hasMatchingWidgetId = cachedWidgetKeys.some((key) =>
      blocks.some((block) => block.id === key)
    );

    if (!legacyImages.length) {
      if (!hasMatchingWidgetId && cachedWidgetKeys.length === 1 && firstId) {
        const legacyKey = cachedWidgetKeys[0];
        const legacyBucket = Array.isArray(cachedImagesByWidget[legacyKey])
          ? (cachedImagesByWidget[legacyKey] as unknown[]).filter(
              (item): item is string => typeof item === 'string'
            )
          : [];

        if (legacyBucket.length > 0) {
          await this.plugin.app.fileManager.processFrontMatter(
            file,
            (frontmatter: unknown) => {
              if (!isRecord(frontmatter)) return;
              const existingByWidgetSource = frontmatter.imagesByWidget;
              const existingByWidget = isRecord(existingByWidgetSource)
                ? existingByWidgetSource
                : {};
              const existingLegacyBucket = existingByWidget[legacyKey];
              const resolvedLegacyBucket = Array.isArray(existingLegacyBucket)
                ? existingLegacyBucket.filter(
                    (item): item is string => typeof item === 'string'
                  )
                : legacyBucket;

              const nextImagesByWidget: Record<string, unknown> = {
                ...existingByWidget,
                [firstId]: resolvedLegacyBucket,
              };

              if (legacyKey !== firstId) {
                delete nextImagesByWidget[legacyKey];
              }

              frontmatter.imagesByWidget = nextImagesByWidget;
            }
          );

          await forceMetadataCacheRefresh(this.plugin.app, file);
          return true;
        }
      }

      return didUpdate;
    }

    await this.plugin.app.fileManager.processFrontMatter(
      file,
      (frontmatter: unknown) => {
        if (!isRecord(frontmatter)) return;
        const existingByWidgetSource = frontmatter.imagesByWidget;
        const existingByWidget = isRecord(existingByWidgetSource)
          ? existingByWidgetSource
          : {};

        const existingImages = getStringArrayValue(existingByWidget[firstId]);

        const seen = new Set<string>();
        const merged: string[] = [];
        for (const image of legacyImages) {
          if (!seen.has(image)) {
            seen.add(image);
            merged.push(image);
          }
        }
        for (const image of existingImages) {
          if (!seen.has(image)) {
            seen.add(image);
            merged.push(image);
          }
        }

        frontmatter.imagesByWidget = {
          ...existingByWidget,
          [firstId]: merged,
        };

        delete frontmatter.images;
      }
    );

    await forceMetadataCacheRefresh(this.plugin.app, file);
    return true;
  }

  private parseImageCodeblocks(lines: string[]): {
    blocks: Array<{ start: number; end: number; id: string }>;
    inserts: Array<{ line: number; id: string }>;
    replacements: Array<{ line: number; id: string }>;
  } {
    const blocks: Array<{ start: number; end: number; id: string }> = [];
    const inserts: Array<{ line: number; id: string }> = [];
    const replacements: Array<{ line: number; id: string }> = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line?.trim().startsWith('```journalit-images')) {
        continue;
      }

      const start = i;
      let end = lines.length - 1;
      let id: string | null = null;
      let idLine: number | null = null;

      for (let j = i + 1; j < lines.length; j++) {
        const trimmed = lines[j]?.trim();
        if (trimmed === '```') {
          end = j;
          break;
        }
        if (trimmed?.startsWith('id:')) {
          const value = trimmed.slice('id:'.length).trim();
          if (value) {
            id = value;
            idLine = j;
          }
        }
      }

      if (!id || seenIds.has(id)) {
        const newId = `images-${generateUUID()}`;
        id = newId;
        if (idLine !== null) {
          replacements.push({ line: idLine, id: newId });
        } else {
          inserts.push({ line: start + 1, id: newId });
        }
      }

      seenIds.add(id);
      blocks.push({ start, end, id });
      i = end;
    }

    return { blocks, inserts, replacements };
  }

  private async getImagesCodeblockContext(
    filePath: string,
    docId: string,
    sectionInfo?: MarkdownSectionInformation | null
  ): Promise<ImageWidgetCodeblockContext> {
    const lines = await this.getFileLines(filePath);
    if (!lines) {
      return { isLegacyOwner: false };
    }

    const sectionLineStart = sectionInfo?.lineStart;
    const sectionLineEnd = sectionInfo?.lineEnd;
    const sectionIsImage =
      sectionLineStart !== undefined &&
      sectionLineStart !== null &&
      sectionLineStart >= 0 &&
      sectionLineStart < lines.length &&
      lines[sectionLineStart]?.trim().startsWith('```journalit-images');

    const codeblockStart = sectionIsImage
      ? sectionLineStart
      : this.getSequentialImagesCodeblockStart(filePath, lines, docId);

    const codeblockEnd =
      codeblockStart !== null
        ? this.findCodeblockEndLine(
            lines,
            codeblockStart,
            sectionIsImage ? sectionLineEnd : null
          )
        : null;

    const firstImagesLine = this.findFirstImagesCodeblockLine(lines);
    const isLegacyOwner =
      codeblockStart !== null && codeblockStart === firstImagesLine;
    const codeblockId =
      codeblockStart !== null
        ? this.findCodeblockId(lines, codeblockStart, codeblockEnd)
        : undefined;
    const imageStarts = this.collectImageCodeblockStarts(lines);
    const codeblockIndex =
      codeblockStart !== null ? imageStarts.indexOf(codeblockStart) : -1;

    return {
      lineStart: codeblockStart ?? undefined,
      lineEnd: codeblockEnd ?? undefined,
      index: codeblockIndex >= 0 ? codeblockIndex : undefined,
      isLegacyOwner,
      id: codeblockId ?? undefined,
    };
  }

  private async getFileLines(filePath: string): Promise<string[] | null> {
    const editorContext = this.getEditorContext(filePath);
    if (editorContext?.lines) {
      return editorContext.lines;
    }

    const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      return null;
    }

    const cached = this.fileLineCache.get(filePath);
    if (cached && cached.mtime === file.stat.mtime) {
      return cached.lines;
    }

    const text = await this.plugin.app.vault.cachedRead(file);
    const lines = text.split('\n');
    this.fileLineCache.set(filePath, { mtime: file.stat.mtime, lines });
    return lines;
  }

  private getSequentialImagesCodeblockStart(
    filePath: string,
    lines: string[],
    docId: string
  ): number | null {
    const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
    const mtime = file instanceof TFile ? file.stat.mtime : Date.now();
    const starts = this.collectImageCodeblockStarts(lines);
    if (!starts.length) {
      return null;
    }

    const cached = this.imageCodeblockIndex.get(filePath);
    const hasSameStarts =
      cached?.starts.length === starts.length &&
      cached.starts.every((start, index) => start === starts[index]);
    const shouldReset = !cached || cached.docId !== docId || !hasSameStarts;
    const nextIndex = shouldReset ? 0 : cached.index;
    const safeIndex = nextIndex >= starts.length ? 0 : nextIndex;

    const entry = {
      docId,
      mtime,
      index: (safeIndex + 1) % starts.length,
      starts,
    };
    this.imageCodeblockIndex.set(filePath, entry);

    return starts[safeIndex] ?? null;
  }

  private collectImageCodeblockStarts(lines: string[]): number[] {
    const starts: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.trim().startsWith('```journalit-images')) {
        starts.push(i);
      }
    }
    return starts;
  }

  private findCodeblockEndLine(
    lines: string[],
    startLine: number,
    hintEnd?: number | null
  ): number {
    if (hintEnd !== null && hintEnd !== undefined) {
      const clamped = Math.min(
        Math.max(hintEnd, startLine + 1),
        lines.length - 1
      );
      if (lines[clamped]?.trim() === '```') {
        return clamped;
      }
    }

    for (let i = startLine + 1; i < lines.length; i++) {
      if (lines[i]?.trim() === '```') {
        return i;
      }
    }
    return Math.min(startLine + 1, lines.length - 1);
  }

  private findCodeblockId(
    lines: string[],
    startLine: number,
    endLine: number | null
  ): string | null {
    const limit = endLine ?? Math.min(startLine + 20, lines.length - 1);
    for (let i = startLine + 1; i <= limit; i++) {
      const trimmed = lines[i]?.trim();
      if (!trimmed) continue;
      if (trimmed === '```') {
        break;
      }
      if (trimmed.startsWith('id:')) {
        return trimmed.slice('id:'.length).trim();
      }
    }
    return null;
  }

  private findFirstImagesCodeblockLine(lines: string[]): number | null {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.trim().startsWith('```journalit-images')) {
        return i;
      }
    }
    return null;
  }

  
  private createPlaceholderWidget(
    widgetType: ReviewWidgetType,
    source: string,
    filePath: string
  ): ReactElement {
    return createElement(
      'div',
      {
        className: 'journalit-placeholder-widget',
        style: {
          padding: '1rem',
          border: '1px dashed var(--text-muted)',
          borderRadius: '4px',
          textAlign: 'center',
          color: 'var(--text-muted)',
        },
      },
      [
        createElement(
          'div',
          {
            key: 'title',
            style: { fontWeight: 'bold', marginBottom: '0.5rem' },
          },
          `${widgetType} widget`
        ),
        createElement(
          'div',
          { key: 'path', style: { fontSize: '0.8rem' } },
          `File: ${filePath}`
        ),
        source &&
          createElement(
            'div',
            {
              key: 'source',
              style: { fontSize: '0.8rem', marginTop: '0.5rem' },
            },
            `Source: ${source.substring(0, 50)}${source.length > 50 ? '...' : ''}`
          ),
      ].filter(Boolean)
    );
  }

  
  unregisterAll(): void {
    
    for (const [, root] of this.roots.entries()) {
      try {
        root.unmount();
      } catch {
        // intentional
      }
    }

    for (const [codeblockType, postProcessor] of this
      .registeredPostProcessors) {
      try {
        MarkdownPreviewRenderer.unregisterPostProcessor(postProcessor);
      } catch {
        // intentional
      }

      if (
        globallyRegisteredCodeblockProcessors.get(codeblockType) ===
        postProcessor
      ) {
        globallyRegisteredCodeblockProcessors.delete(codeblockType);
      }
    }

    this.roots.clear();
    this.registeredTypes.clear();
    this.registeredPostProcessors.clear();
    this.fileLineCache.clear();
    this.imageCodeblockIndex.clear();
    this.imageWidgetIdMigration.clear();
  }

  
  getRegisteredTypes(): string[] {
    return Array.from(this.registeredTypes);
  }
}
