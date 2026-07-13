

import { Notice, setIcon } from 'obsidian';
import JournalitPlugin from '../main';
import { CustomUpdateToast } from '../components/notifications/CustomUpdateToast';
import { RELEASE_NOTES_VIEW_TYPE } from '../components/release-notes/ReleaseNotesView';
import { HOME_VIEW_TYPE } from '../views/HomeView';
import { t } from '../lang/helpers';
import releasesData from '../../changelog/releases.json';

export const UPDATE_STATUS_BAR_STYLES = `
.journalit-update-status-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 0 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.journalit-update-status-bar:hover {
  background: var(--background-modifier-hover);
}

.journalit-update-status-icon {
  color: var(--text-accent);
  display: flex;
  align-items: center;
}

.journalit-update-status-icon svg {
  width: 14px;
  height: 14px;
}

.journalit-update-status-text {
  font-size: 12px;
  color: var(--text-muted);
}
`;

interface ReleaseMetadata {
  [version: string]: {
    title: string;
    description: string;
    imageUrl?: string;
    features: string[];
  };
}

export class UpdateNotificationService {
  private plugin: JournalitPlugin;
  private currentToast: CustomUpdateToast | null = null;
  
  private pendingNotificationVersion: string | null = null;
  
  private statusBarItem: HTMLElement | null = null;
  
  private isCheckingForUpdates: boolean = false;
  
  private openHomeViewTimeoutId: number | null = null;

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  getPendingNotificationVersion(): string | null {
    return this.pendingNotificationVersion;
  }

  
  async checkForUpdates(): Promise<void> {
    
    if (this.isCheckingForUpdates) {
      return;
    }

    
    if (!this.plugin.settings.backendIntegration?.showUpdateNotifications) {
      return;
    }

    this.isCheckingForUpdates = true;

    try {
      const currentVersion = this.plugin.manifest.version;
      const settings = this.plugin.settings.backendIntegration;
      if (!settings) return;

      const lastSeenVersion = settings.lastSeenVersion;
      let dismissedVersion = settings.dismissedVersion;
      let settingsModified = false;

      
      if (!lastSeenVersion) {
        settings.lastSeenVersion = currentVersion;
        settings.dismissedVersion = currentVersion;
        settingsModified = true;

        if (settingsModified) {
          try {
            await this.plugin.saveSettings();
          } catch (error) {
            console.error(
              '[UpdateNotification] Failed to save settings:',
              error
            );
          }
        }
        return;
      }

      
      
      if (lastSeenVersion && !dismissedVersion) {
        settings.dismissedVersion = lastSeenVersion;
        dismissedVersion = lastSeenVersion;
        settingsModified = true;
      }

      
      if (lastSeenVersion !== currentVersion) {
        settings.lastSeenVersion = currentVersion;
        settingsModified = true;
      }

      
      if (settingsModified) {
        try {
          await this.plugin.saveSettings();
        } catch (error) {
          console.error('[UpdateNotification] Failed to save settings:', error);
        }
      }

      
      if (this.shouldShowNotification(currentVersion, dismissedVersion)) {
        this.pendingNotificationVersion = currentVersion;
        await this.showUpdateNotification(currentVersion);
        
      }
    } finally {
      this.isCheckingForUpdates = false;
    }
  }

  
  private shouldShowNotification(
    currentVersion: string,
    dismissedVersion: string | undefined
  ): boolean {
    
    if (!dismissedVersion) {
      return true;
    }

    
    return this.isNewerVersion(currentVersion, dismissedVersion);
  }

  
  private async showUpdateNotification(version: string): Promise<void> {
    
    if (!this.plugin.settings.backendIntegration?.showUpdateNotifications) {
      return;
    }

    try {
      
      const metadata = this.loadReleaseMetadata();

      const normalizedVersion = this.normalizeVersionForLookup(version);
      const releaseInfo = metadata[normalizedVersion];

      if (!releaseInfo) {
        
        new Notice(t('notice.plugin-updated', { version }), 8000);
        return;
      }

      
      const homeLeaves =
        this.plugin.app.workspace.getLeavesOfType(HOME_VIEW_TYPE);

      if (homeLeaves.length === 0) {
        
        this.showStatusBarIndicator(version);
        return;
      }

      const homeView = homeLeaves[0].view;
      const parentContainer = homeView.containerEl;

      
      parentContainer.addClass('journalit-update-toast-container');

      
      this.currentToast = new CustomUpdateToast();

      await this.currentToast.show({
        version,
        title: releaseInfo.title,
        description: releaseInfo.description,
        imageUrl: releaseInfo.imageUrl,
        parentContainer: parentContainer, 
        onViewReleaseNotes: () => void this.openReleaseNotes(),
        onDismiss: () => this.handleNotificationDismissed(),
      });
    } catch (error) {
      console.error(
        '[UpdateNotification] Failed to show update notification:',
        error
      );
      console.error(
        '[UpdateNotification] Error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      );
      new Notice(t('notice.plugin-updated', { version }), 8000);
    }
  }

  
  private loadReleaseMetadata(): ReleaseMetadata {
    return releasesData;
  }

  
  private isNewerVersion(current: string, last: string): boolean {
    
    
    const cleanVersion = (version: string) => {
      const match = version.match(/^(\d+\.\d+\.\d+)/);
      return match ? match[1] : version;
    };

    const cleanCurrent = cleanVersion(current);
    const cleanLast = cleanVersion(last);

    const parseCurrent = cleanCurrent.split('.').map(Number);
    const parseLast = cleanLast.split('.').map(Number);

    const [cMajor = 0, cMinor = 0, cPatch = 0] = parseCurrent;
    const [lMajor = 0, lMinor = 0, lPatch = 0] = parseLast;

    
    if (
      !Number.isFinite(cMajor) ||
      !Number.isFinite(cMinor) ||
      !Number.isFinite(cPatch) ||
      !Number.isFinite(lMajor) ||
      !Number.isFinite(lMinor) ||
      !Number.isFinite(lPatch)
    ) {
      return false;
    }

    if (cMajor > lMajor) {
      return true;
    }
    if (cMajor === lMajor && cMinor > lMinor) {
      return true;
    }
    if (cMajor === lMajor && cMinor === lMinor && cPatch > lPatch) {
      return true;
    }

    return false;
  }

  
  private normalizeVersionForLookup(version: string): string {
    
    const normalized = version.replace(/-\d{13}$/, '');
    return normalized;
  }

  
  private async handleNotificationDismissed(): Promise<void> {
    
    const versionToDismiss =
      this.pendingNotificationVersion ?? this.plugin.manifest.version;

    if (this.plugin.settings.backendIntegration) {
      this.plugin.settings.backendIntegration.dismissedVersion =
        versionToDismiss;
      await this.plugin.saveSettings();
    }

    
    this.pendingNotificationVersion = null;

    
    this.removeStatusBarIndicator();
  }

  
  private showStatusBarIndicator(version: string): void {
    
    if (this.statusBarItem) {
      return;
    }

    this.statusBarItem = this.plugin.addStatusBarItem();
    this.statusBarItem.addClass('journalit-update-status-bar');

    
    const iconSpan = this.statusBarItem.createSpan({
      cls: 'journalit-update-status-icon',
    });
    setIcon(iconSpan, 'gift');

    
    this.statusBarItem.createSpan({
      text: t('status-bar.update-available'),
      cls: 'journalit-update-status-text',
    });

    
    this.statusBarItem.setAttribute(
      'aria-label',
      t('status-bar.update-aria-label', { version })
    );
    this.statusBarItem.addClass('mod-clickable');

    
    this.plugin.registerDomEvent(this.statusBarItem, 'click', async () => {
      await this.openHomeViewAndShowToast(version);
    });
  }

  
  private removeStatusBarIndicator(): void {
    if (this.statusBarItem) {
      this.statusBarItem.remove();
      this.statusBarItem = null;
    }
  }

  
  private async openHomeViewAndShowToast(version: string): Promise<void> {
    const { workspace } = this.plugin.app;

    try {
      
      let homeLeaves = workspace.getLeavesOfType(HOME_VIEW_TYPE);

      
      if (homeLeaves.length === 0) {
        const leaf = workspace.getLeaf('tab');
        await leaf.setViewState({ type: HOME_VIEW_TYPE, active: true });
        homeLeaves = workspace.getLeavesOfType(HOME_VIEW_TYPE);
      }

      if (homeLeaves.length > 0) {
        void workspace.revealLeaf(homeLeaves[0]);

        
        if (this.openHomeViewTimeoutId !== null) {
          window.clearTimeout(this.openHomeViewTimeoutId);
        }

        
        this.openHomeViewTimeoutId = window.setTimeout(() => {
          void (async () => {
            this.openHomeViewTimeoutId = null;
            
            this.removeStatusBarIndicator();
            
            await this.showUpdateNotification(version);
          })();
        }, 200);
      }
    } catch (error) {
      console.error('[UpdateNotification] Failed to open HomeView:', error);
      new Notice(
        t('notice.error.open-update-notification', {
          error: error instanceof Error ? error.message : String(error),
        }),
        5000
      );
    }
  }

  
  async openReleaseNotes(): Promise<void> {
    const { workspace } = this.plugin.app;
    let leaf = workspace.getLeavesOfType(RELEASE_NOTES_VIEW_TYPE)[0];

    try {
      if (!leaf) {
        leaf = workspace.getLeaf('tab');
        await leaf.setViewState({
          type: RELEASE_NOTES_VIEW_TYPE,
          active: true,
        });
      }

      void workspace.revealLeaf(leaf);
    } catch (error) {
      console.error(
        '[UpdateNotification] Failed to open release notes:',
        error
      );
      new Notice(
        t('notice.error.open-release-notes', {
          error: error instanceof Error ? error.message : String(error),
        }),
        5000
      );
    }
  }

  
  cleanup(): void {
    
    if (this.openHomeViewTimeoutId !== null) {
      window.clearTimeout(this.openHomeViewTimeoutId);
      this.openHomeViewTimeoutId = null;
    }

    if (this.currentToast) {
      this.currentToast.cleanup();
      this.currentToast = null;
    }

    
    this.removeStatusBarIndicator();
  }
}
