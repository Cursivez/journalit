

import { Component } from 'obsidian';
import JournalitPlugin from '../../main';
import { ONBOARDING_VERSION, OnboardingData } from './types';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

export class OnboardingService extends Component {
  private plugin: JournalitPlugin;
  private data: OnboardingData;

  private saveTimeout: number | null = null;
  private isSaving = false;
  private pendingSaveResolvers: Array<() => void> = [];

  constructor(_app: unknown, plugin: JournalitPlugin) {
    super();
    this.plugin = plugin;
    this.data = this.getDefaultData();
  }

  async initialize(): Promise<void> {
    await this.loadData();
  }

  shouldShowOnboarding(): boolean {
    return !this.data.completed && !this.data.skipped;
  }

  async startOnboarding(): Promise<void> {
    
    this.data = {
      ...this.getDefaultData(),
      completed: false,
      skipped: false,
      completedAt: undefined,
      skippedAt: undefined,
    };

    await this.saveData();
  }

  async skipOnboarding(): Promise<void> {
    this.data = {
      ...this.data,
      skipped: true,
      skippedAt: Date.now(),
    };

    await this.saveData();
  }

  async completeOnboarding(): Promise<void> {
    this.data = {
      ...this.data,
      completed: true,
      completedAt: Date.now(),
    };

    await this.saveData();
  }

  private getDefaultData(): OnboardingData {
    return {
      version: ONBOARDING_VERSION,
      completed: false,
      skipped: false,
    };
  }

  private async loadData(): Promise<void> {
    try {
      const pluginData = asRecord(await this.plugin.loadData());
      const localMeta = asRecord(pluginData?.localMeta);
      const persisted = localMeta?.onboarding;

      if (persisted) {
        this.data = this.migrateData(persisted);
        return;
      }

      this.data = this.getDefaultData();
    } catch (error) {
      console.error(
        '[OnboardingService] Failed to load onboarding data:',
        error
      );
      this.data = this.getDefaultData();
    }
  }

  private migrateData(oldData: unknown): OnboardingData {
    const oldDataRecord = asRecord(oldData);
    const data: OnboardingData = this.getDefaultData();

    if (!oldDataRecord) {
      return data;
    }

    if (typeof oldDataRecord.completed === 'boolean') {
      data.completed = oldDataRecord.completed;
    }
    if (typeof oldDataRecord.completedAt === 'number') {
      data.completedAt = oldDataRecord.completedAt;
    }

    if (typeof oldDataRecord.skipped === 'boolean') {
      data.skipped = oldDataRecord.skipped;
    }
    if (typeof oldDataRecord.skippedAt === 'number') {
      data.skippedAt = oldDataRecord.skippedAt;
    }

    
    if (typeof oldDataRecord.version === 'number') {
      data.version = oldDataRecord.version;
    }

    return data;
  }

  private async saveData(): Promise<void> {
    
    if (this.saveTimeout !== null) {
      window.clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    return new Promise((resolve) => {
      this.pendingSaveResolvers.push(resolve);

      
      this.saveTimeout = window.setTimeout(() => {
        void this.performSave();
      }, 100);
    });
  }

  private resolvePendingSaves(): void {
    if (this.pendingSaveResolvers.length === 0) {
      return;
    }

    const resolvers = this.pendingSaveResolvers;
    this.pendingSaveResolvers = [];

    for (const resolve of resolvers) {
      resolve();
    }
  }

  private async performSave(): Promise<void> {
    if (this.isSaving) {
      this.saveTimeout = window.setTimeout(() => void this.performSave(), 50);
      return;
    }

    this.isSaving = true;

    try {
      const pluginData = asRecord(await this.plugin.loadData()) ?? {};
      const localMeta = asRecord(pluginData.localMeta) ?? {};

      localMeta.onboarding = this.data;
      pluginData.localMeta = localMeta;

      await this.plugin.saveData(pluginData);
    } catch (error) {
      console.error(
        '[OnboardingService] Failed to save onboarding data:',
        error
      );
    } finally {
      this.isSaving = false;
      this.resolvePendingSaves();
    }
  }

  onunload(): void {
    if (this.saveTimeout !== null) {
      window.clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    void this.performSave().catch((error: unknown) => {
      console.error(
        '[OnboardingService] Final save failed during unload:',
        error
      );
    });
  }
}
