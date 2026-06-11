

import { Component } from 'obsidian';
import JournalitPlugin from '../../main';
import { ONBOARDING_VERSION, OnboardingData } from './types';

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
      const pluginData = await this.plugin.loadData();
      const persisted = pluginData?.localMeta?.onboarding;

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

  

  private migrateData(oldData: any): OnboardingData {
    const data: OnboardingData = this.getDefaultData();

    if (typeof oldData.completed === 'boolean') {
      data.completed = oldData.completed;
    }
    if (typeof oldData.completedAt === 'number') {
      data.completedAt = oldData.completedAt;
    }

    if (typeof oldData.skipped === 'boolean') {
      data.skipped = oldData.skipped;
    }
    if (typeof oldData.skippedAt === 'number') {
      data.skippedAt = oldData.skippedAt;
    }

    
    if (typeof oldData.version === 'number') {
      data.version = oldData.version;
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

      
      this.saveTimeout = window.setTimeout(async () => {
        await this.performSave();
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
      this.saveTimeout = window.setTimeout(() => this.performSave(), 50);
      return;
    }

    this.isSaving = true;

    try {
      const pluginData = (await this.plugin.loadData()) || {};

      if (!pluginData.localMeta) {
        pluginData.localMeta = {};
      }

      pluginData.localMeta.onboarding = this.data;

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

  async onunload(): Promise<void> {
    if (this.saveTimeout !== null) {
      window.clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    try {
      await this.performSave();
    } catch (error) {
      console.error(
        '[OnboardingService] Final save failed during unload:',
        error
      );
    }
  }
}
