

import { Notice } from 'obsidian';
import { t } from '../lang/helpers';
import type JournalitPlugin from '../main';
import { OnboardingCompletionWatcher } from '../services/onboarding/OnboardingCompletionWatcher';
import type { OnboardingService } from '../services/onboarding/OnboardingService';
import {
  hasFirstHomeVisitPending,
  hasOnboardingBeenShown,
  markFirstHomeVisitPending,
  markHomeVisited,
  markOnboardingShown,
} from '../utils/homeVisitState';

export class OnboardingManager {
  private isOnboardingLaunchInProgress = false;
  private watcher: OnboardingCompletionWatcher | null = null;
  private unsubscribeGuideGate: (() => void) | null = null;

  constructor(private plugin: JournalitPlugin) {}

  
  async showOnboardingModal(): Promise<boolean> {
    try {
      const onboardingService = await this.getService();
      await onboardingService.restart();
      await this.plugin.viewManager.openOnboardingView();
      
      markOnboardingShown(this.plugin.app);
      return true;
    } catch (error) {
      console.error('Failed to launch onboarding flow:', error);
      new Notice(t('notice.error.open-onboarding'));
      return false;
    }
  }

  
  async checkAndShowOnboarding(): Promise<boolean> {
    if (this.isOnboardingLaunchInProgress) {
      return false;
    }

    try {
      const onboardingService = await this.getService();

      if (!onboardingService.shouldLaunchAtStartup()) {
        
        
        if (!hasOnboardingBeenShown(this.plugin.app)) {
          markOnboardingShown(this.plugin.app);
          markHomeVisited(this.plugin.app);
        } else if (!hasFirstHomeVisitPending(this.plugin.app)) {
          markHomeVisited(this.plugin.app);
        }
        return false;
      }

      this.isOnboardingLaunchInProgress = true;

      if (onboardingService.isInProgress()) {
        
        await this.plugin.viewManager.openOnboardingView();
        markOnboardingShown(this.plugin.app);
        return true;
      }

      markFirstHomeVisitPending(this.plugin.app);
      return await this.showOnboardingModal();
    } catch (error) {
      console.error('Error checking/showing onboarding:', error);
      
      return false;
    } finally {
      this.isOnboardingLaunchInProgress = false;
    }
  }

  destroy(): void {
    this.watcher?.stop();
    this.watcher = null;
    this.unsubscribeGuideGate?.();
    this.unsubscribeGuideGate = null;
  }

  
  async ensureCompletionWatcher(): Promise<void> {
    try {
      await this.getService();
    } catch (error) {
      console.error(
        '[Onboarding] Failed to start the completion watcher:',
        error
      );
    }
  }

  private async getService(): Promise<OnboardingService> {
    const service = await this.plugin.serviceManager.getOnboardingService();
    if (!this.watcher) {
      this.watcher = new OnboardingCompletionWatcher(this.plugin, service);
      this.watcher.start();
    }
    
    
    const guideService = this.plugin.viewGuideService;
    if (guideService && !this.unsubscribeGuideGate) {
      this.unsubscribeGuideGate = service.subscribe(() =>
        guideService.notifyAutoShowGateChanged()
      );
      guideService.notifyAutoShowGateChanged();
    }
    return service;
  }
}
