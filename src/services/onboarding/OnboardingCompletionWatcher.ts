

import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { eventBus } from '../events/EventBus';
import type { Unsubscribe } from '../events/types';
import { t } from '../../lang/helpers';
import { ONBOARDING_VIEW_TYPE } from '../../views/OnboardingView';
import { HOME_VIEW_TYPE } from '../../views/HomeView';
import type { OnboardingService } from './OnboardingService';
import type {
  OnboardingCompletionReason,
  OnboardingPendingCompletion,
} from './types';
import type { TradeCommitReceipt } from '../trade/core/tradeCoreTypes';


type WatchedSource = OnboardingPendingCompletion | 'sample-exploring';


function isOperationCreatedReceipt(receipt: TradeCommitReceipt): boolean {
  return Boolean(receipt.canonicalTradeId || receipt.tradeImportId);
}

export class OnboardingCompletionWatcher {
  private unsubscribeState: (() => void) | null = null;
  private unsubscribeSources: Unsubscribe[] = [];
  private lastSeenOperationId: string | null = null;
  private completing = false;
  private watchedSource: WatchedSource | null = null;
  private readonly activeTransitions = new Set<
    'sample-arrived' | 'sample-exited'
  >();

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly service: OnboardingService
  ) {}

  start(): void {
    if (this.unsubscribeState) return;
    this.unsubscribeState = this.service.subscribe(() => this.sync());
    this.sync();
  }

  stop(): void {
    this.unsubscribeState?.();
    this.unsubscribeState = null;
    this.detachSources();
  }

  private sync(): void {
    const state = this.service.getState();
    const watched: WatchedSource | null =
      state.status !== 'in-progress'
        ? null
        : state.pendingCompletion !== null
          ? state.pendingCompletion
          : state.step === 'sample-exploring'
            ? 'sample-exploring'
            : null;
    if (watched === null) {
      this.detachSources();
      return;
    }
    if (this.watchedSource !== watched) {
      this.detachSources();
      this.watchedSource = watched;
    }
    this.attachSources(watched);
  }

  private attachSources(watched: WatchedSource): void {
    if (this.unsubscribeSources.length > 0) return;

    if (watched === 'sample-journal') {
      this.attachSampleJournalSource();
      return;
    }
    if (watched === 'sample-exploring') {
      this.attachSampleExitSource();
      return;
    }

    const resultService = this.plugin.ensureTradeOperationResultService();
    
    
    this.lastSeenOperationId =
      resultService.getSnapshot().recentResult?.id ?? null;
    this.unsubscribeSources.push(
      resultService.subscribe(() => {
        const result = resultService.getSnapshot().recentResult;
        if (!result || result.id === this.lastSeenOperationId) return;
        this.lastSeenOperationId = result.id;
        if (result.counts.created < 1) return;
        void this.complete(
          result.kind === 'sync' ? 'first-sync' : 'first-import'
        );
      })
    );

    this.unsubscribeSources.push(
      eventBus.subscribe('trade:committed', (payload) => {
        if (payload.change.action !== 'created') return;
        
        if (this.plugin.settingsManager?.isSampleContextActive()) return;
        if (isOperationCreatedReceipt(payload.receipt)) return;
        void this.complete('first-trade');
      })
    );
  }

  
  private attachSampleJournalSource(): void {
    const demo = this.plugin.demoSessionService;
    if (!demo) return;
    const check = () => {
      if (demo.getSnapshot().phase === 'active') {
        void this.transition(
          'sample-arrived',
          () => this.service.getState().pendingCompletion === 'sample-journal',
          async () => {
            await this.service.enterSampleExploring();
            await this.handOffOnboardingLeaves();
          }
        );
      }
    };
    this.unsubscribeSources.push(demo.subscribe(check));
    check();
  }

  
  private attachSampleExitSource(): void {
    const demo = this.plugin.demoSessionService;
    if (!demo) return;
    const check = () => {
      const snapshot = demo.getSnapshot();
      if (snapshot.active || snapshot.busy || demo.hasRecoverableSession()) {
        return;
      }
      void this.transition(
        'sample-exited',
        () => this.service.isExploringSample(),
        async () => {
          await this.service.resumeAfterSample();
          await this.plugin.viewManager.openOnboardingView();
        }
      );
    };
    this.unsubscribeSources.push(demo.subscribe(check));
    check();
  }

  
  private async transition(
    kind: 'sample-arrived' | 'sample-exited',
    precondition: () => boolean,
    work: () => Promise<void>
  ): Promise<void> {
    if (this.activeTransitions.has(kind)) return;
    if (!this.service.isInProgress() || !precondition()) return;
    this.activeTransitions.add(kind);
    try {
      await work();
    } catch (error) {
      console.error(
        '[Onboarding] Failed to advance the sample journey:',
        error
      );
    } finally {
      this.activeTransitions.delete(kind);
    }
  }

  private detachSources(): void {
    for (const unsubscribe of this.unsubscribeSources) unsubscribe();
    this.unsubscribeSources = [];
    this.watchedSource = null;
    this.lastSeenOperationId = null;
  }

  private async complete(via: OnboardingCompletionReason): Promise<void> {
    if (this.completing || !this.service.isInProgress()) return;
    this.completing = true;
    try {
      await this.service.complete(via);
      await this.handOffOnboardingLeaves();
      new Notice(t('onboarding.notice.completed'));
    } catch (error) {
      console.error('[Onboarding] Failed to complete onboarding:', error);
    } finally {
      this.completing = false;
    }
  }

  
  private async handOffOnboardingLeaves(): Promise<void> {
    const workspace = this.plugin.app.workspace;
    const [first, ...rest] = workspace.getLeavesOfType(ONBOARDING_VIEW_TYPE);
    for (const leaf of rest) leaf.detach();
    if (!first) return;
    if (workspace.getLeavesOfType(HOME_VIEW_TYPE).length > 0) {
      first.detach();
      return;
    }
    try {
      await this.plugin.viewManager.registerHomeView();
      await first.setViewState({
        type: HOME_VIEW_TYPE,
        state: { mode: 'overview' },
      });
    } catch (error) {
      console.error('[Onboarding] Failed to hand off onboarding tab:', error);
      first.detach();
    }
  }
}
