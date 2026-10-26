

import type { TradeService } from '../services/trade/TradeService';
import type { SetupService } from '../services/setup/SetupService';
import type { DRCService } from '../services/drc/DRCService';
import type { WeeklyReviewService } from '../services/weekly/WeeklyReviewService';
import type { MonthlyReviewService } from '../services/monthly/MonthlyReviewService';
import type { QuarterlyReviewService } from '../services/quarterly/QuarterlyReviewService';
import type { YearlyReviewService } from '../services/yearly/YearlyReviewService';
import type { CustomOptionsService } from '../services/options';
import type { CustomFieldsService } from '../services/CustomFieldsService';
import type { CustomReviewFieldsService } from '../services/CustomReviewFieldsService';
import type { ReviewContextInheritanceService } from '../services/ReviewContextInheritanceService';
import type { MissedTradeService } from '../services/missedTrade/MissedTradeService';
import type { BacktestTradeService } from '../services/backtestTrade/BacktestTradeService';
import type { AccountPageService } from '../services/accountPage';
import type { BackendIntegrationService } from '../services/backend';
import type { OnboardingService } from '../services/onboarding';
import type { FolderPathService } from '../services/core/FolderPathService';
import type { PropFirmProfileCatalogService } from '../services/propChallenge';
import type { ReviewStreakService } from '../services/reviewStreak/ReviewStreakService';
import type { EconomicCalendarService } from '../services/economicCalendar/EconomicCalendarService';
import type {
  AgentEntityIdentityService,
  AgentTradeIdentityService,
} from '../services/agent/identity';
import type { AgentToolRegistry } from '../services/agent/AgentToolRegistry';
import type { AgentResultCache } from '../services/agent/AgentResultCache';
import type { ActionBatchService } from '../services/actions/ActionBatchService';
import type { AgentTradeReadService } from '../services/agent/trades';
import type { AgentAnalyticsReadService } from '../services/agent/analytics';
import type { AgentReviewReadService } from '../services/agent/reviews';
import type { AgentNavigationService } from '../services/agent/navigation';
import type { AgentIntegrationService } from '../services/agent/integrations';
import type { AgentAccessSessionService } from '../services/agent/registration';
import type { AgentRelaySessionService } from '../services/agent/relay';


export interface ServiceRegistry {
  tradeService: TradeService;
  setupService: SetupService;
  drcService: DRCService;
  weeklyReviewService: WeeklyReviewService;
  monthlyReviewService: MonthlyReviewService;
  quarterlyReviewService: QuarterlyReviewService;
  yearlyReviewService: YearlyReviewService;
  optionsService: CustomOptionsService;
  customFieldsService: CustomFieldsService;
  customReviewFieldsService: CustomReviewFieldsService;
  reviewContextInheritanceService: ReviewContextInheritanceService;
  missedTradeService: MissedTradeService;
  backtestTradeService: BacktestTradeService;
  accountPageService: AccountPageService;
  backendIntegrationService: BackendIntegrationService;
  onboardingService: OnboardingService;
  folderPathService: FolderPathService;
  propFirmProfileCatalogService: PropFirmProfileCatalogService;
  reviewStreakService: ReviewStreakService;
  economicCalendarService: EconomicCalendarService;
  agentEntityIdentityService: AgentEntityIdentityService;
  agentTradeIdentityService: AgentTradeIdentityService;
  agentTradeReadService: AgentTradeReadService;
  agentAnalyticsReadService: AgentAnalyticsReadService;
  agentReviewReadService: AgentReviewReadService;
  actionBatchService: ActionBatchService;
  agentNavigationService: AgentNavigationService;
  agentIntegrationService: AgentIntegrationService;
  agentToolRegistry: AgentToolRegistry;
  agentResultCache: AgentResultCache;
  agentAccessSessionService: AgentAccessSessionService;
  agentRelaySessionService: AgentRelaySessionService;
}


export type ServiceName = keyof ServiceRegistry;


export type GetServiceType<K extends ServiceName> = ServiceRegistry[K];

export {};
