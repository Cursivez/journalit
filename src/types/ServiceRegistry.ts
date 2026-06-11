

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


interface ServiceRegistry {
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
}


export type ServiceName = keyof ServiceRegistry;


export type GetServiceType<K extends ServiceName> = ServiceRegistry[K];

export {};
