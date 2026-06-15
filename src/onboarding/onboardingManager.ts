

import { Notice } from 'obsidian';
import { t } from '../lang/helpers';
import type JournalitPlugin from '../main';


export class OnboardingManager {
  private isOnboardingLaunchInProgress = false;

  constructor(private plugin: JournalitPlugin) {}

  
  async showOnboardingModal(): Promise<boolean> {
    const ONBOARDING_SHOWN_KEY = `journalit-onboarding-ever-shown-${this.plugin.app.vault.getName()}`;

    try {
      
      const onboardingService =
        await this.plugin.serviceManager.getOnboardingService();
      
      await onboardingService.startOnboarding();

      
      await this.plugin.viewManager.openOnboardingView();

      
      this.plugin.app.saveLocalStorage(ONBOARDING_SHOWN_KEY, true);

      return true;
    } catch (error) {
      console.error('Failed to launch onboarding flow:', error);
      new Notice(t('notice.error.open-onboarding'));
      return false;
    }
  }

  
  async checkAndShowOnboarding(): Promise<void> {
    
    if (this.isOnboardingLaunchInProgress) {
      return;
    }

    try {
      
      
      const ONBOARDING_SHOWN_KEY = `journalit-onboarding-ever-shown-${this.plugin.app.vault.getName()}`;

      const hasOnboardingBeenShown: unknown =
        this.plugin.app.loadLocalStorage(ONBOARDING_SHOWN_KEY);

      
      if (hasOnboardingBeenShown) {
        return;
      }

      
      const onboardingService =
        await this.plugin.serviceManager.getOnboardingService();

      
      
      if (!onboardingService.shouldShowOnboarding()) {
        this.plugin.app.saveLocalStorage(ONBOARDING_SHOWN_KEY, true);
        return;
      }

      this.isOnboardingLaunchInProgress = true;

      
      await this.showOnboardingModal();
    } catch (error) {
      console.error('Error checking/showing onboarding:', error);
      
    } finally {
      this.isOnboardingLaunchInProgress = false;
    }
  }
}
