import type { TFile } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { SETTINGS_TAB_IDS } from '../../../settings/types';
import { writeTradeSyncProviderPreference } from '../../tradeSync/tradeSyncProviderPreference';
import { createTradeLogFilters } from '../../../settings/viewFiltersDefaults';
import { CustomFieldType } from '../../../types/customFields';
import { openTradeLogWithFilters } from '../../../utils/openTradeLogWithFilters';
import type { NavigationManager } from '../../../navigation/NavigationManager';
import type { TemplateBuilderSelectionRequest } from '../../../views/TemplateBuilderView';
import type { TradeLogFilters } from '../../tradelog/types';
import type { FilterState } from '../../../components/dashboard/dashboardTypes';
import type { DashboardComparisonFilters } from '../../../components/dashboard/compare/dashboardComparison';
import type { CustomFieldsService } from '../../CustomFieldsService';
import type { ReviewTemplateService } from '../../templates/ReviewTemplateService';
import type { AgentEntityIdentityService } from '../identity';
import type { AgentTradeIdentityService } from '../identity';
import type { NavigateJournalitRequest } from '../protocol/generated/navigate_journalit.request.generated';
import type { AgentReviewReadService } from '../reviews';
import {
  readPersistedDashboardCompare,
  readPersistedDashboardFilters,
  requestDashboardView,
} from '../../../components/dashboard/dashboardViewState';
import { getWeekStartDaySetting } from '../../../utils/dateUtils';
import {
  type RollingDatePreset,
  selectDatePreset,
} from '../../../utils/datePresets';
import { readSavedComparisons } from '../../../components/dashboard/compare/savedComparisonStore';
import { withSharedDateRange } from '../../../components/dashboard/compare/dashboardComparison';
import { createDashboardFilters } from '../../../settings/viewFiltersDefaults';
import {
  DashboardFilterError,
  type WireFilterResolver,
  dashboardFiltersFromWire,
  dashboardSideFromWire,
  withSetupNamesResolved,
} from '../dashboard/dashboardFilters';

type NavigationTarget = NavigateJournalitRequest['target'];
type WireDatePreset = NonNullable<
  Extract<NavigationTarget, { kind: 'trade_log' }>['date_preset']
>;

const DATE_PRESETS: Record<WireDatePreset, RollingDatePreset> = {
  today: 'today',
  yesterday: 'yesterday',
  this_week: 'thisWeek',
  this_month: 'thisMonth',
  this_quarter: 'thisQuarter',
  this_year: 'thisYear',
};


function datePresetDates(
  preset: WireDatePreset,
  plugin: JournalitPlugin
): Pick<FilterState, 'dateRange' | 'datePreset' | 'recentPeriod'> {
  return {
    ...selectDatePreset(
      DATE_PRESETS[preset],
      getWeekStartDaySetting(plugin),
      new Date()
    ),
    recentPeriod: undefined,
  };
}

type WireRecentPeriod = NonNullable<
  Extract<NavigationTarget, { kind: 'dashboard' }>['recent']
>;


function recentPeriodDates(
  recent: WireRecentPeriod
): Pick<FilterState, 'dateRange' | 'datePreset' | 'recentPeriod'> {
  return {
    dateRange: [null, null],
    datePreset: undefined,
    recentPeriod: { unit: recent.unit, count: recent.count },
  };
}


function assertSingleDateSource(target: {
  date_preset?: WireDatePreset;
  recent?: WireRecentPeriod;
  filters?: { date?: unknown; recent?: unknown };
}): void {
  const sources = [
    target.date_preset,
    target.recent,
    target.filters?.date,
    target.filters?.recent,
  ].filter((source) => source !== undefined);
  if (sources.length > 1) {
    throw new AgentNavigationError('invalid_request');
  }
}
type TradeFilters = Extract<NavigationTarget, { kind: 'trade_log' }>['filters'];
type SettingsSection = Extract<
  NavigationTarget,
  { kind: 'settings' }
>['section'];


const SETTINGS_SECTION_TABS: Record<
  SettingsSection,
  (typeof SETTINGS_TAB_IDS)[keyof typeof SETTINGS_TAB_IDS]
> = {
  custom_options: SETTINGS_TAB_IDS.JOURNAL,
  accounts: SETTINGS_TAB_IDS.ACCOUNTS,
  session_mode: SETTINGS_TAB_IDS.SESSION_MODE,
  analytics_calculation: SETTINGS_TAB_IDS.CALCULATIONS,
  date_time_display: SETTINGS_TAB_IDS.CURRENCY_AND_DATES,
  display_preferences: SETTINGS_TAB_IDS.PREFERENCES,
  trading_day: SETTINGS_TAB_IDS.CALCULATIONS,
  risk_display: SETTINGS_TAB_IDS.CALCULATIONS,
  break_even: SETTINGS_TAB_IDS.CALCULATIONS,
  
  trade_entry: SETTINGS_TAB_IDS.JOURNAL,
  review_automation: SETTINGS_TAB_IDS.REVIEWS,
  economic_calendar: SETTINGS_TAB_IDS.ECONOMIC_CALENDAR,
  session_schedule: SETTINGS_TAB_IDS.SESSION_MODE,
};

export class AgentNavigationError extends Error {
  constructor(
    public readonly code:
      | 'invalid_request'
      | 'not_found'
      | 'unsupported_capability'
  ) {
    super('Agent navigation failed.');
    this.name = 'AgentNavigationError';
  }
}

interface AgentNavigationDependencies {
  plugin: JournalitPlugin;
  navigationManager: Pick<NavigationManager, 'openResolvedFile'>;
  getTradeIdentityService(): Promise<
    Pick<AgentTradeIdentityService, 'resolveTradeId'>
  >;
  getEntityIdentityService(): Promise<
    Pick<AgentEntityIdentityService, 'resolveAccountId' | 'resolveSetupRecord'>
  >;
  getReviewReadService(): Promise<
    Pick<AgentReviewReadService, 'resolveFile' | 'identityForDate'>
  >;
  
  getReviewTemplateService(): Promise<
    Pick<ReviewTemplateService, 'getTemplate'>
  >;
  
  openAgentActivity(): void;
  
  openPositionSizeCalculator(): void;
  customFieldsService: Pick<CustomFieldsService, 'getField'>;
  
  dashboardFilterResolver: WireFilterResolver;
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

async function boundary<T>(
  signal: AbortSignal,
  operation: () => Promise<T>
): Promise<T> {
  throwIfAborted(signal);
  const result = await operation();
  throwIfAborted(signal);
  return result;
}

function parseDate(value: string | undefined): Date | null {
  if (value === undefined) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new AgentNavigationError('invalid_request');
  }
  return date;
}

function imageAnnotationStatus(
  values: NonNullable<TradeFilters>['image_annotation_status']
): TradeLogFilters['imageAnnotationStatus'] {
  return (values ?? []).map((value) => {
    switch (value) {
      case 'tagged':
      case 'untagged':
        return value;
      case 'has_notes':
        return 'hasNotes';
      case 'no_notes':
        return 'noNotes';
    }
  });
}


async function dashboardFilters<T>(map: () => Promise<T>): Promise<T> {
  try {
    return await map();
  } catch (error) {
    if (error instanceof DashboardFilterError) {
      throw new AgentNavigationError(error.code);
    }
    throw error;
  }
}

export class AgentNavigationService {
  constructor(private readonly dependencies: AgentNavigationDependencies) {}

  async navigate(target: NavigationTarget, signal: AbortSignal): Promise<void> {
    throwIfAborted(signal);
    switch (target.kind) {
      case 'home':
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openHomeView('overview')
        );
        return;
      case 'dashboard': {
        assertSingleDateSource(target);
        const plugin = this.dependencies.plugin;
        const preset =
          target.date_preset !== undefined
            ? datePresetDates(target.date_preset, plugin)
            : target.recent !== undefined
              ? recentPeriodDates(target.recent)
              : {};
        if (target.filters !== undefined) {
          const wire = target.filters;
          const filters = await boundary(signal, () =>
            dashboardFilters(() =>
              dashboardFiltersFromWire(
                wire,
                this.dependencies.dashboardFilterResolver
              )
            )
          );
          requestDashboardView(plugin, { ...filters, ...preset }, null);
        } else if (
          target.date_preset !== undefined ||
          target.recent !== undefined
        ) {
          
          const state = plugin.uiStateManager.getState();
          requestDashboardView(
            plugin,
            {
              ...(readPersistedDashboardFilters(state) ??
                createDashboardFilters()),
              ...preset,
            },
            readPersistedDashboardCompare(state)
          );
        }
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openDashboardView()
        );
        return;
      }
      case 'dashboard_comparison': {
        const comparison = await boundary(signal, () =>
          this.resolveComparison(target)
        );
        const plugin = this.dependencies.plugin;
        
        
        assertSingleDateSource({
          date_preset: target.date_preset,
          recent: target.recent,
          filters: { date: target.date },
        });
        const dates: Pick<
          FilterState,
          'dateRange' | 'datePreset' | 'recentPeriod'
        > = target.date_preset
          ? datePresetDates(target.date_preset, plugin)
          : target.recent
            ? recentPeriodDates(target.recent)
            : target.date
              ? {
                  dateRange: [
                    parseDate(target.date.from),
                    parseDate(target.date.to),
                  ],
                }
              : (readPersistedDashboardFilters(
                  plugin.uiStateManager.getState()
                ) ?? createDashboardFilters());
        requestDashboardView(
          plugin,
          withSharedDateRange(comparison.a, dates),
          comparison.b
        );
        await boundary(signal, () => plugin.viewManager.openDashboardView());
        return;
      }
      case 'trade_log': {
        assertSingleDateSource(target);
        const resolved = await boundary(signal, () =>
          this.resolveTradeLogFilters(target.filters, signal)
        );
        const filters =
          target.date_preset === undefined
            ? resolved
            : {
                ...resolved,
                ...datePresetDates(
                  target.date_preset,
                  this.dependencies.plugin
                ),
              };
        await boundary(signal, () =>
          openTradeLogWithFilters(this.dependencies.plugin, filters)
        );
        return;
      }
      case 'trade': {
        const identityService = await boundary(signal, () =>
          this.dependencies.getTradeIdentityService()
        );
        const record = await boundary(signal, () =>
          identityService.resolveTradeId(target.trade_id)
        );
        if (record === null) throw new AgentNavigationError('not_found');
        await this.openFile(record.file, signal);
        return;
      }
      case 'setup': {
        const identityService = await boundary(signal, () =>
          this.dependencies.getEntityIdentityService()
        );
        const setup = await boundary(signal, () =>
          identityService.resolveSetupRecord(target.setup_id)
        );
        if (setup === null) throw new AgentNavigationError('not_found');
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openSetupsView({
            page: 'detail',
            setupId: setup.id,
            setupName: setup.name,
            setupPath: setup.filePath,
          })
        );
        return;
      }
      case 'account': {
        const identityService = await boundary(signal, () =>
          this.dependencies.getEntityIdentityService()
        );
        const name = await boundary(signal, () =>
          identityService.resolveAccountId(target.account_id)
        );
        if (name === null) throw new AgentNavigationError('not_found');
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openAccountPageView(name)
        );
        return;
      }
      case 'period_review': {
        const reviewReadService = await boundary(signal, () =>
          this.dependencies.getReviewReadService()
        );
        const file = await boundary(signal, () =>
          reviewReadService.resolveFile(target.review, signal)
        );
        if (file === null) throw new AgentNavigationError('not_found');
        await this.openFile(file, signal);
        return;
      }
      case 'importer':
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openCSVImportView()
        );
        return;
      case 'integration':
        this.openIntegration(target.integration);
        throwIfAborted(signal);
        return;
      case 'session_mode':
        await boundary(signal, () =>
          this.dependencies.plugin.openSessionMode()
        );
        return;
      case 'template_builder': {
        const selection = await this.resolveTemplateSelection(
          target.template_id,
          signal
        );
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openTemplateBuilderView(
            selection ?? undefined
          )
        );
        return;
      }
      case 'account_dashboard':
        await boundary(signal, () =>
          this.dependencies.plugin.openAccountDashboard()
        );
        return;
      case 'setups':
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openSetupsView()
        );
        return;
      case 'economic_calendar':
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openEconomicCalendarView()
        );
        return;
      case 'review_for_date': {
        const reviewReadService = await boundary(signal, () =>
          this.dependencies.getReviewReadService()
        );
        const review = reviewReadService.identityForDate(
          target.period,
          target.date
        );
        if (review === null) throw new AgentNavigationError('invalid_request');
        const file = await boundary(signal, () =>
          reviewReadService.resolveFile(review, signal)
        );
        if (file === null) throw new AgentNavigationError('not_found');
        await this.openFile(file, signal);
        return;
      }
      case 'agent_activity':
        this.dependencies.openAgentActivity();
        throwIfAborted(signal);
        return;
      case 'calendar_sidebar':
        await boundary(signal, () =>
          this.dependencies.plugin.openCalendarSidebar()
        );
        return;
      case 'navigation_sidebar':
        await boundary(signal, () =>
          this.dependencies.plugin.openNavigationSidebar()
        );
        return;
      case 'position_size_calculator':
        this.dependencies.openPositionSizeCalculator();
        throwIfAborted(signal);
        return;
      case 'release_notes':
        await boundary(signal, async () => {
          const service = this.dependencies.plugin.updateNotificationService;
          if (!service)
            throw new AgentNavigationError('unsupported_capability');
          await service.openReleaseNotes();
        });
        return;
      case 'settings':
        this.dependencies.plugin.openSettingsToTab(
          SETTINGS_SECTION_TABS[target.section]
        );
        throwIfAborted(signal);
        return;
    }
  }

  
  private async resolveComparison(
    target: Extract<NavigationTarget, { kind: 'dashboard_comparison' }>
  ): Promise<{ a: DashboardComparisonFilters; b: DashboardComparisonFilters }> {
    if (target.comparison_id !== undefined) {
      const saved = readSavedComparisons(this.dependencies.plugin).find(
        (comparison) => comparison.id === target.comparison_id
      );
      if (!saved) throw new AgentNavigationError('not_found');
      return saved;
    }
    
    const { a, b } = target;
    if (a === undefined || b === undefined) {
      throw new AgentNavigationError('invalid_request');
    }
    const resolver = await withSetupNamesResolved(
      [a, b],
      this.dependencies.dashboardFilterResolver
    );
    return {
      a: await dashboardFilters(() => dashboardSideFromWire(a, resolver)),
      b: await dashboardFilters(() => dashboardSideFromWire(b, resolver)),
    };
  }

  
  private async resolveTemplateSelection(
    templateId: string | undefined,
    signal: AbortSignal
  ): Promise<TemplateBuilderSelectionRequest | null> {
    if (templateId === undefined) return null;

    const templateService = await boundary(signal, () =>
      this.dependencies.getReviewTemplateService()
    );
    const template = templateService.getTemplate(templateId);
    if (template === undefined) throw new AgentNavigationError('not_found');
    throwIfAborted(signal);

    return {
      type: 'template',
      id: template.id,
      templateType: template.type,
    };
  }

  private async openFile(file: TFile, signal: AbortSignal): Promise<void> {
    await boundary(signal, () =>
      this.dependencies.navigationManager.openResolvedFile(file)
    );
  }

  private openIntegration(
    integration: Extract<
      NavigationTarget,
      { kind: 'integration' }
    >['integration']
  ): void {
    if (integration === 'trade_import') {
      this.dependencies.plugin.openSettingsToTab(
        SETTINGS_TAB_IDS.TRADE_IMPORT_SYNC
      );
      return;
    }
    writeTradeSyncProviderPreference(this.dependencies.plugin.app, integration);
    this.dependencies.plugin.openSettingsToTab(SETTINGS_TAB_IDS.TRADE_SYNC);
  }

  private async resolveTradeLogFilters(
    canonical: TradeFilters,
    signal: AbortSignal
  ): Promise<TradeLogFilters> {
    if (canonical?.pnl !== undefined) {
      throw new AgentNavigationError('unsupported_capability');
    }

    const filters = createTradeLogFilters();
    const from = parseDate(canonical?.date?.from);
    const to = parseDate(canonical?.date?.to);
    if (from !== null && to !== null && from.getTime() > to.getTime()) {
      throw new AgentNavigationError('invalid_request');
    }
    if (canonical?.recent !== undefined) {
      if (canonical.date !== undefined) {
        throw new AgentNavigationError('invalid_request');
      }
      filters.recentPeriod = { ...canonical.recent };
    } else {
      filters.dateRange = [from, to];
    }
    filters.tickers = [...(canonical?.tickers ?? [])];
    filters.tags = [...(canonical?.tags ?? [])];
    filters.mistakes = [...(canonical?.mistakes ?? [])];
    filters.directions = [...(canonical?.directions ?? [])];
    filters.statuses = [...(canonical?.status ?? [])];
    filters.tradeTypes = canonical?.trade_types
      ? [...canonical.trade_types]
      : filters.tradeTypes;
    filters.reviewStatus = [...(canonical?.review_status ?? [])];
    filters.ratings = [...(canonical?.ratings ?? [])];
    filters.marketBias = [...(canonical?.market_bias ?? [])];
    filters.sessionLogTags = [...(canonical?.session_log_tags ?? [])];
    filters.imageAnnotationStatus = imageAnnotationStatus(
      canonical?.image_annotation_status
    );
    filters.imageTags = [...(canonical?.image_tags ?? [])];

    const accountIds = canonical?.account_ids ?? [];
    const setupIds = canonical?.setup_ids ?? [];
    if (accountIds.length > 0 || setupIds.length > 0) {
      const entityIdentityService = await boundary(signal, () =>
        this.dependencies.getEntityIdentityService()
      );
      for (const accountId of accountIds) {
        const name = await boundary(signal, () =>
          entityIdentityService.resolveAccountId(accountId)
        );
        if (name === null) throw new AgentNavigationError('not_found');
        filters.accounts.push(name);
      }
      for (const setupId of setupIds) {
        const setup = await boundary(signal, () =>
          entityIdentityService.resolveSetupRecord(setupId)
        );
        if (setup === null) throw new AgentNavigationError('not_found');
        filters.setups.push(setup.name);
      }
    }

    const seenCustomFields = new Set<string>();
    for (const clause of canonical?.custom_fields ?? []) {
      const field = this.dependencies.customFieldsService.getField(
        clause.field_id
      );
      if (field === undefined) throw new AgentNavigationError('not_found');
      if (seenCustomFields.has(field.id)) {
        throw new AgentNavigationError('unsupported_capability');
      }
      seenCustomFields.add(field.id);
      const supportedOperator =
        (field.type === CustomFieldType.DROPDOWN &&
          clause.operator === 'equals') ||
        (field.type === CustomFieldType.MULTISELECT &&
          (clause.operator === 'equals' || clause.operator === 'contains'));
      if (!supportedOperator) {
        throw new AgentNavigationError('unsupported_capability');
      }
      if (typeof clause.value !== 'string' || clause.value.trim() === '') {
        if (Array.isArray(clause.value)) {
          throw new AgentNavigationError('unsupported_capability');
        }
        throw new AgentNavigationError('invalid_request');
      }
      filters.customFieldFilters[field.id] = [clause.value];
    }
    return filters;
  }
}
