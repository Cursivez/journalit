

import {
  Notice,
  Platform,
  requestUrl,
  requireApiVersion,
  setIcon,
} from 'obsidian';
import { CustomUpdateToast } from '../components/notifications/CustomUpdateToast';
import { InstalledUpdatePopup } from '../components/notifications/InstalledUpdatePopup';
import { RELEASE_NOTES_VIEW_TYPE } from '../components/release-notes/ReleaseNotesView';
import { getReleasesData, type ReleaseMetadata } from '../data/releasesData';
import { DemoSyncGate } from '../demo/DemoSyncGate';
import { t } from '../lang/helpers';
import type JournalitPlugin from '../main';
import { openObsidianPluginPage } from '../utils/externalLinks';
import { logger } from '../utils/logger';

const PUBLIC_MANIFEST_URL =
  'https://raw.githubusercontent.com/Cursivez/journalit/main/manifest.json';
const PUBLIC_VERSIONS_URL =
  'https://raw.githubusercontent.com/Cursivez/journalit/main/versions.json';
const RELEASE_MANIFEST_BASE_URL =
  'https://github.com/Cursivez/journalit/releases/download/';
const AVAILABILITY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const AVAILABILITY_POLL_INTERVAL_MS = 60 * 60 * 1000;

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

interface RemoteManifest {
  version: string;
  minAppVersion: string;
}

type VersionCompatibility = Record<string, string>;

type AvailabilityLookupResult =
  | { kind: 'success'; version: string | null }
  | { kind: 'cancelled' }
  | { kind: 'unavailable' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeVersion(version: string): string | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
  if (!match) return null;
  return `${match[1]}.${match[2]}.${match[3]}`;
}

function compareVersions(left: string, right: string): number | null {
  const normalizedLeft = normalizeVersion(left);
  const normalizedRight = normalizeVersion(right);
  if (!normalizedLeft || !normalizedRight) return null;

  const leftParts = normalizedLeft.split('.').map(Number);
  const rightParts = normalizedRight.split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    const difference = leftParts[index] - rightParts[index];
    if (difference !== 0) return difference;
  }
  return 0;
}

function isNewerVersion(candidate: string, current: string): boolean {
  const comparison = compareVersions(candidate, current);
  return comparison !== null && comparison > 0;
}

function parseRemoteManifest(text: string): RemoteManifest | null {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isRecord(value)) return null;

  const version = value.version;
  const minAppVersion = value.minAppVersion;
  if (
    typeof version !== 'string' ||
    normalizeVersion(version) !== version ||
    typeof minAppVersion !== 'string' ||
    !normalizeVersion(minAppVersion)
  ) {
    return null;
  }
  return { version, minAppVersion };
}

function parseVersionCompatibility(text: string): VersionCompatibility | null {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isRecord(value)) return null;

  const versions: VersionCompatibility = {};
  for (const [version, minAppVersion] of Object.entries(value)) {
    if (
      normalizeVersion(version) === version &&
      typeof minAppVersion === 'string' &&
      normalizeVersion(minAppVersion)
    ) {
      versions[version] = minAppVersion;
    }
  }
  return versions;
}

function hasFreshAvailabilityCheck(lastCheckedAt: string | undefined): boolean {
  if (!lastCheckedAt) return false;
  const checkedAt = Date.parse(lastCheckedAt);
  return (
    Number.isFinite(checkedAt) &&
    Date.now() - checkedAt >= 0 &&
    Date.now() - checkedAt < AVAILABILITY_CACHE_TTL_MS
  );
}

export class UpdateNotificationService {
  private currentToast: CustomUpdateToast | null = null;
  private installedNotice: InstalledUpdatePopup | null = null;
  
  private availableUpdateStatusBarItem: HTMLElement | null = null;
  private availableUpdateStatusBarVersion: string | null = null;
  private isCheckingForUpdates = false;
  private settingsRecheckPending = false;
  private availabilityCheckIntervalId: number | null = null;
  private availabilityCheckGeneration = 0;
  private availableToastShownForVersion: string | null = null;
  private disposed = false;

  constructor(private readonly plugin: JournalitPlugin) {}

  
  async checkForUpdates(): Promise<void> {
    if (this.disposed) return;
    if (DemoSyncGate.isActive()) return;
    if (this.isCheckingForUpdates) return;
    if (
      this.plugin.settings.backendIntegration?.showUpdateNotifications === false
    ) {
      return;
    }

    this.isCheckingForUpdates = true;
    try {
      const installedNotificationPending =
        await this.checkForInstalledVersionChange();
      await this.checkForAvailableUpdate(!installedNotificationPending);
    } finally {
      await this.finishCheck();
    }
  }

  startPeriodicAvailabilityChecks(): void {
    if (this.availabilityCheckIntervalId !== null) return;

    this.availabilityCheckIntervalId = this.plugin.registerInterval(
      window.setInterval(() => {
        void this.refreshAvailableUpdate();
      }, AVAILABILITY_POLL_INTERVAL_MS)
    );
  }

  async refreshAvailableUpdate(): Promise<void> {
    if (this.disposed) return;
    if (DemoSyncGate.isActive()) return;
    if (this.isCheckingForUpdates) return;
    if (!this.availableNotificationsEnabled()) {
      return;
    }

    this.isCheckingForUpdates = true;
    try {
      await this.checkForAvailableUpdate(this.installedNotice === null);
    } finally {
      await this.finishCheck();
    }
  }

  handleNotificationSettingChanged(): void {
    this.availabilityCheckGeneration += 1;
    if (!this.availableNotificationsEnabled()) {
      this.replaceCurrentToast();
      this.removeAvailableUpdateStatusBar();
    }
    if (
      this.plugin.settings.backendIntegration?.showUpdateNotifications === false
    ) {
      this.installedNotice?.cleanup();
      this.installedNotice = null;
    } else {
      if (this.isCheckingForUpdates) {
        this.settingsRecheckPending = true;
      } else {
        void this.checkForUpdates();
      }
    }
  }

  private async finishCheck(): Promise<void> {
    this.isCheckingForUpdates = false;
    if (this.settingsRecheckPending) {
      this.settingsRecheckPending = false;
      await this.checkForUpdates();
    }
  }

  private availableNotificationsEnabled(): boolean {
    const settings = this.plugin.settings.backendIntegration;
    return (
      settings?.showUpdateNotifications !== false &&
      settings?.showAvailableUpdateNotifications !== false
    );
  }

  
  private async checkForInstalledVersionChange(): Promise<boolean> {
    const currentVersion = this.plugin.manifest.version;
    const settings = this.plugin.settings.backendIntegration;
    if (!settings) return false;

    const lastSeenVersion = settings.lastSeenVersion;
    let dismissedVersion = settings.dismissedVersion;
    let settingsModified = false;

    if (!lastSeenVersion) {
      settings.lastSeenVersion = currentVersion;
      settings.dismissedVersion = currentVersion;
      settingsModified = true;
    } else {
      if (!dismissedVersion) {
        settings.dismissedVersion = lastSeenVersion;
        dismissedVersion = lastSeenVersion;
        settingsModified = true;
      }

      if (lastSeenVersion !== currentVersion) {
        settings.lastSeenVersion = currentVersion;
        settingsModified = true;
      }
    }

    const knownAvailableVersion = settings.lastKnownAvailableVersion;
    if (
      knownAvailableVersion &&
      !isNewerVersion(knownAvailableVersion, currentVersion)
    ) {
      settings.lastKnownAvailableVersion = '';
      settings.dismissedAvailableVersion = '';
      this.availableToastShownForVersion = null;
      settingsModified = true;
      this.removeAvailableUpdateStatusBar();
    }

    if (settingsModified) {
      await this.saveSettingsSafely();
    }

    if (
      this.disposed ||
      DemoSyncGate.isActive() ||
      settings.showUpdateNotifications === false
    ) {
      return false;
    }

    if (this.installedNotice) return true;

    if (
      lastSeenVersion &&
      this.shouldShowInstalledNotification(currentVersion, dismissedVersion)
    ) {
      return this.showInstalledUpdateNotification(currentVersion);
    }

    return false;
  }

  private shouldShowInstalledNotification(
    currentVersion: string,
    dismissedVersion: string | undefined
  ): boolean {
    return (
      !dismissedVersion || isNewerVersion(currentVersion, dismissedVersion)
    );
  }

  private async checkForAvailableUpdate(allowToast: boolean): Promise<void> {
    const settings = this.plugin.settings.backendIntegration;
    if (!settings || !this.availableNotificationsEnabled() || this.disposed) {
      return;
    }

    const checkGeneration = this.availabilityCheckGeneration;

    let availableVersion = settings.lastKnownAvailableVersion || null;
    const hasFreshSuccessfulCheck = hasFreshAvailabilityCheck(
      settings.lastAvailableUpdateCheckAt
    );
    const hasFreshAttempt = hasFreshAvailabilityCheck(
      settings.lastAvailableUpdateAttemptAt
    );
    if (!hasFreshSuccessfulCheck && !hasFreshAttempt) {
      const attemptedAt = new Date().toISOString();
      const lookup = await this.lookupAvailableVersion(checkGeneration);
      if (
        lookup.kind === 'cancelled' ||
        !this.isAvailabilityCheckCurrent(checkGeneration)
      )
        return;
      
      settings.lastAvailableUpdateAttemptAt = attemptedAt;
      if (lookup.kind === 'success') {
        availableVersion = lookup.version;
        settings.lastAvailableUpdateCheckAt = attemptedAt;
        settings.lastKnownAvailableVersion = lookup.version || '';
      }
      await this.saveSettingsSafely();
      if (!this.isAvailabilityCheckCurrent(checkGeneration)) return;
    }

    if (!this.isAvailabilityCheckCurrent(checkGeneration)) return;

    if (
      !availableVersion ||
      !isNewerVersion(availableVersion, this.plugin.manifest.version)
    ) {
      this.removeAvailableUpdateStatusBar();
      return;
    }

    this.showAvailableUpdateStatusBar(availableVersion);
    if (!allowToast) return;

    const dismissedVersion = settings.dismissedAvailableVersion;
    if (
      !dismissedVersion ||
      isNewerVersion(availableVersion, dismissedVersion)
    ) {
      if (this.availableToastShownForVersion === availableVersion) return;
      this.showAvailableUpdateNotification(availableVersion);
      this.availableToastShownForVersion = availableVersion;
    }
  }

  private async lookupAvailableVersion(
    checkGeneration: number
  ): Promise<AvailabilityLookupResult> {
    const latestManifest = await this.fetchManifest(PUBLIC_MANIFEST_URL);
    if (!latestManifest) return { kind: 'unavailable' };
    if (!this.isAvailabilityCheckCurrent(checkGeneration)) {
      return { kind: 'cancelled' };
    }

    let candidateVersion: string | null = null;
    if (requireApiVersion(latestManifest.minAppVersion)) {
      candidateVersion = latestManifest.version;
    } else {
      const versions = await this.fetchVersionCompatibility();
      if (!versions) return { kind: 'unavailable' };
      if (!this.isAvailabilityCheckCurrent(checkGeneration)) {
        return { kind: 'cancelled' };
      }
      candidateVersion = this.selectLatestCompatibleVersion(
        versions,
        latestManifest.version
      );
    }

    if (
      !candidateVersion ||
      !isNewerVersion(candidateVersion, this.plugin.manifest.version)
    ) {
      return { kind: 'success', version: null };
    }

    const releaseManifest = await this.fetchManifest(
      `${RELEASE_MANIFEST_BASE_URL}${candidateVersion}/manifest.json`
    );
    if (!releaseManifest) return { kind: 'unavailable' };
    if (!this.isAvailabilityCheckCurrent(checkGeneration)) {
      return { kind: 'cancelled' };
    }
    if (
      releaseManifest.version !== candidateVersion ||
      !requireApiVersion(releaseManifest.minAppVersion)
    ) {
      return { kind: 'unavailable' };
    }

    return { kind: 'success', version: candidateVersion };
  }

  private isAvailabilityCheckCurrent(checkGeneration: number): boolean {
    return (
      !this.disposed &&
      this.availabilityCheckGeneration === checkGeneration &&
      this.availableNotificationsEnabled()
    );
  }

  private selectLatestCompatibleVersion(
    versions: VersionCompatibility,
    latestVersion: string
  ): string | null {
    let latestCompatible: string | null = null;
    for (const [version, minAppVersion] of Object.entries(versions)) {
      const comparedWithLatest = compareVersions(version, latestVersion);
      if (comparedWithLatest === null || comparedWithLatest > 0) continue;
      if (!requireApiVersion(minAppVersion)) continue;
      if (!latestCompatible || isNewerVersion(version, latestCompatible)) {
        latestCompatible = version;
      }
    }
    return latestCompatible;
  }

  private async fetchManifest(url: string): Promise<RemoteManifest | null> {
    const text = await this.requestText(url);
    return text === null ? null : parseRemoteManifest(text);
  }

  private async fetchVersionCompatibility(): Promise<VersionCompatibility | null> {
    const text = await this.requestText(PUBLIC_VERSIONS_URL);
    return text === null ? null : parseVersionCompatibility(text);
  }

  private async requestText(url: string): Promise<string | null> {
    if (DemoSyncGate.isActive()) return null;
    try {
      const response = await requestUrl({ url, method: 'GET', throw: false });
      if (response.status < 200 || response.status >= 300) return null;
      return response.text;
    } catch (error) {
      logger.debug('[UpdateNotification] Availability check unavailable', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  private async showInstalledUpdateNotification(
    version: string
  ): Promise<boolean> {
    try {
      const releaseInfo =
        this.loadReleaseMetadata()[this.normalizeVersionForLookup(version)];
      if (!releaseInfo) {
        new Notice(t('notice.plugin-updated', { version }), 8000);
        await this.handleInstalledNotificationDismissed(version);
        return true;
      }

      this.replaceCurrentToast();
      this.installedNotice = new InstalledUpdatePopup({
        version,
        release: releaseInfo,
        onLearnMore: () => void this.openReleaseNotes(),
        onDismiss: () =>
          void this.handleInstalledNotificationDismissed(version),
      });
      this.installedNotice.open();
      return true;
    } catch (error) {
      this.installedNotice?.cleanup();
      this.installedNotice = null;
      console.error(
        '[UpdateNotification] Failed to show installed update notification:',
        error
      );
      new Notice(t('notice.plugin-updated', { version }), 8000);
      await this.handleInstalledNotificationDismissed(version);
      return true;
    }
  }

  private showAvailableUpdateNotification(version: string): void {
    if (!this.availableNotificationsEnabled()) {
      return;
    }

    this.replaceCurrentToast();
    this.currentToast = new CustomUpdateToast();
    this.currentToast.show({
      title: 'Journalit',
      description: t('update.available.ready'),
      primaryAction: {
        label: t('button.open'),
        icon: 'download',
        onClick: () => openObsidianPluginPage('journalit'),
        persistDismissalAfterClick: false,
      },
      onDismiss: () => this.handleAvailableNotificationDismissed(version),
    });
  }

  private loadReleaseMetadata(): ReleaseMetadata {
    return getReleasesData();
  }

  private normalizeVersionForLookup(version: string): string {
    return version.replace(/-\d{13}$/, '');
  }

  private async handleInstalledNotificationDismissed(
    version: string
  ): Promise<void> {
    this.installedNotice = null;
    const settings = this.plugin.settings.backendIntegration;
    if (settings) {
      settings.dismissedVersion = version;
      await this.saveSettingsSafely();
    }
  }

  private async handleAvailableNotificationDismissed(
    version: string
  ): Promise<void> {
    const settings = this.plugin.settings.backendIntegration;
    if (!settings) return;
    settings.dismissedAvailableVersion = version;
    await this.saveSettingsSafely();
  }

  private showAvailableUpdateStatusBar(version: string): void {
    if (!Platform.isDesktopApp) return;
    if (
      this.availableUpdateStatusBarItem &&
      this.availableUpdateStatusBarVersion === version
    ) {
      return;
    }
    this.removeAvailableUpdateStatusBar();
    this.availableUpdateStatusBarItem = this.createStatusBarItem({
      version,
      label: t('status-bar.update-available-branded'),
      icon: 'download',
      onClick: () => openObsidianPluginPage('journalit'),
    });
    this.availableUpdateStatusBarVersion = version;
  }

  private createStatusBarItem(args: {
    version: string;
    label: string;
    icon: string;
    onClick: () => void | Promise<void>;
  }): HTMLElement {
    const statusBarItem = this.plugin.addStatusBarItem();
    statusBarItem.addClass('journalit-update-status-bar');

    const iconSpan = statusBarItem.createSpan({
      cls: 'journalit-update-status-icon',
    });
    setIcon(iconSpan, args.icon);
    statusBarItem.createSpan({
      text: args.label,
      cls: 'journalit-update-status-text',
    });
    statusBarItem.setAttribute(
      'aria-label',
      t('status-bar.update-aria-label', { version: args.version })
    );
    statusBarItem.addClass('mod-clickable');
    this.plugin.registerDomEvent(statusBarItem, 'click', () => {
      void args.onClick();
    });
    return statusBarItem;
  }

  private removeAvailableUpdateStatusBar(): void {
    this.availableUpdateStatusBarItem?.remove();
    this.availableUpdateStatusBarItem = null;
    this.availableUpdateStatusBarVersion = null;
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

  private replaceCurrentToast(): void {
    this.currentToast?.cleanup();
    this.currentToast = null;
  }

  private async saveSettingsSafely(): Promise<void> {
    try {
      await this.plugin.saveSettings();
    } catch (error) {
      console.error('[UpdateNotification] Failed to save settings:', error);
    }
  }

  cleanup(): void {
    this.disposed = true;
    this.availabilityCheckGeneration += 1;
    if (this.availabilityCheckIntervalId !== null) {
      window.clearInterval(this.availabilityCheckIntervalId);
      this.availabilityCheckIntervalId = null;
    }

    this.replaceCurrentToast();
    this.installedNotice?.cleanup();
    this.installedNotice = null;
    this.removeAvailableUpdateStatusBar();
  }
}
