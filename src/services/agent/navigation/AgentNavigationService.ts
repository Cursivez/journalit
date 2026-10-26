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
import type { CustomFieldsService } from '../../CustomFieldsService';
import type { ReviewTemplateService } from '../../templates/ReviewTemplateService';
import type { AgentEntityIdentityService } from '../identity';
import type { AgentTradeIdentityService } from '../identity';
import type { NavigateJournalitRequest } from '../protocol/generated/navigate_journalit.request.generated';
import type { AgentReviewReadService } from '../reviews';

type NavigationTarget = NavigateJournalitRequest['target'];
type TradeFilters = Extract<NavigationTarget, { kind: 'trade_log' }>['filters'];
type SettingsSection = Extract<
  NavigationTarget,
  { kind: 'settings' }
>['section'];


const SETTINGS_SECTION_TABS: Record<
  SettingsSection,
  (typeof SETTINGS_TAB_IDS)[keyof typeof SETTINGS_TAB_IDS]
> = {
  custom_options: SETTINGS_TAB_IDS.CUSTOMIZATION,
  accounts: SETTINGS_TAB_IDS.ACCOUNTS,
  session_mode: SETTINGS_TAB_IDS.SESSION_MODE,
  analytics_calculation: SETTINGS_TAB_IDS.TRADING,
  date_time_display: SETTINGS_TAB_IDS.TRADING,
  display_preferences: SETTINGS_TAB_IDS.GENERAL,
  trading_day: SETTINGS_TAB_IDS.TRADING,
  risk_display: SETTINGS_TAB_IDS.TRADING,
  break_even: SETTINGS_TAB_IDS.TRADING,
  trade_entry: SETTINGS_TAB_IDS.TRADING,
  review_automation: SETTINGS_TAB_IDS.JOURNAL,
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
      case 'dashboard':
        await boundary(signal, () =>
          this.dependencies.plugin.viewManager.openDashboardView()
        );
        return;
      case 'trade_log': {
        const filters = await boundary(signal, () =>
          this.resolveTradeLogFilters(target.filters, signal)
        );
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
    filters.dateRange = [from, to];
    filters.tickers = [...(canonical?.tickers ?? [])];
    filters.tags = [...(canonical?.tags ?? [])];
    filters.mistakes = [...(canonical?.mistakes ?? [])];
    filters.directions = [...(canonical?.directions ?? [])];
    filters.statuses = [...(canonical?.status ?? [])];
    filters.tradeTypes = canonical?.trade_types
      ? [...canonical.trade_types]
      : filters.tradeTypes;
    filters.reviewStatus = [...(canonical?.review_status ?? [])];
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
