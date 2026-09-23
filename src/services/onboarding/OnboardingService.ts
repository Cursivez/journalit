

import { Component } from 'obsidian';
import type JournalitPlugin from '../../main';
import { hasOnboardingBeenShown } from '../../utils/homeVisitState';
import {
  createDefaultOnboardingData,
  isOnboardingCompletionReason,
  isOnboardingPendingCompletion,
  isOnboardingStatus,
  isOnboardingStepId,
  ONBOARDING_VERSION,
  type OnboardingAnswers,
  type OnboardingCompletionReason,
  type OnboardingData,
  type OnboardingPendingCompletion,
  type OnboardingPersonalisationRecord,
  type OnboardingStepId,
} from './types';

const ONBOARDING_DATA_KEY = 'onboarding';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

function readTimestamp(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

const pick = <T extends string>(
  value: unknown,
  allowed: readonly T[]
): T | undefined => allowed.find((candidate) => candidate === value);

function parseAnswers(value: unknown): OnboardingAnswers {
  const record = asRecord(value);
  if (!record) return {};
  const answers: OnboardingAnswers = {};
  const obsidianFamiliarity = pick(record.obsidianFamiliarity, [
    'new',
    'experienced',
  ]);
  if (obsidianFamiliarity) answers.obsidianFamiliarity = obsidianFamiliarity;
  const dataSource = pick(record.dataSource, [
    'broker',
    'file',
    'fresh',
    'sample',
  ]);
  if (dataSource) answers.dataSource = dataSource;
  if (typeof record.brokerId === 'string' && record.brokerId.trim()) {
    answers.brokerId = record.brokerId;
  }
  const tradingStyle = pick(record.tradingStyle, [
    'scalping',
    'intraday',
    'swing',
    'position',
  ]);
  if (tradingStyle) answers.tradingStyle = tradingStyle;
  const accountKind = pick(record.accountKind, [
    'personal',
    'practice',
    'prop',
  ]);
  if (accountKind) answers.accountKind = accountKind;
  const assetFocus = pick(record.assetFocus, [
    'stock',
    'futures',
    'forex',
    'crypto',
    'options',
    'mixed',
  ]);
  if (assetFocus) answers.assetFocus = assetFocus;
  return answers;
}

function parsePersonalisationRecord(
  value: unknown
): OnboardingPersonalisationRecord | undefined {
  const record = asRecord(value);
  const baseline = asRecord(record?.baseline);
  const applied = asRecord(record?.applied);
  return baseline && applied ? { baseline, applied } : undefined;
}


export function migrateOnboardingData(
  persisted: unknown,
  context: { onboardingEverShown: boolean }
): OnboardingData {
  const record = asRecord(persisted);
  const data = createDefaultOnboardingData();
  if (!record) {
    return data;
  }

  if (record.version === ONBOARDING_VERSION) {
    if (isOnboardingStatus(record.status)) data.status = record.status;
    if (isOnboardingStepId(record.step)) data.step = record.step;
    data.answers = parseAnswers(record.answers);
    data.pendingCompletion = isOnboardingPendingCompletion(
      record.pendingCompletion
    )
      ? record.pendingCompletion
      : null;
    data.personalisation = parsePersonalisationRecord(record.personalisation);
    data.sampleExplored = record.sampleExplored === true;
    data.startedAt = readTimestamp(record.startedAt);
    data.completedAt = readTimestamp(record.completedAt);
    data.completedVia = isOnboardingCompletionReason(record.completedVia)
      ? record.completedVia
      : undefined;
    data.skippedAt = readTimestamp(record.skippedAt);
    if (data.status !== 'in-progress') {
      
      data.pendingCompletion = null;
    }
    return data;
  }

  
  const completed = record.completed === true;
  const skipped = record.skipped === true;
  if (completed) {
    data.status = 'completed';
    data.completedAt = readTimestamp(record.completedAt);
  } else if (skipped) {
    data.status = 'skipped';
    data.skippedAt = readTimestamp(record.skippedAt);
  } else if (context.onboardingEverShown) {
    data.status = 'skipped';
  }
  return data;
}

export class OnboardingService extends Component {
  private plugin: JournalitPlugin;
  private data: OnboardingData = createDefaultOnboardingData();
  private readonly listeners = new Set<() => void>();
  private saveQueue: Promise<void> = Promise.resolve();

  constructor(_app: unknown, plugin: JournalitPlugin) {
    super();
    this.plugin = plugin;
  }

  async initialize(): Promise<void> {
    await this.loadData();
  }

  
  readonly getState = (): Readonly<OnboardingData> => this.data;

  
  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  
  shouldLaunchAtStartup(): boolean {
    if (this.data.status === 'in-progress') return true;
    return (
      this.data.status === 'not-started' &&
      !hasOnboardingBeenShown(this.plugin.app)
    );
  }

  isInProgress(): boolean {
    return this.data.status === 'in-progress';
  }

  
  async restart(): Promise<void> {
    await this.update({
      ...createDefaultOnboardingData(),
      
      personalisation: this.data.personalisation,
      status: 'in-progress',
      startedAt: Date.now(),
    });
  }

  
  async advance(
    step: OnboardingStepId,
    answers?: Partial<OnboardingAnswers>
  ): Promise<void> {
    await this.update({
      ...this.data,
      status: 'in-progress',
      step,
      answers: { ...this.data.answers, ...answers },
      pendingCompletion: null,
      startedAt: this.data.startedAt ?? Date.now(),
    });
  }

  
  async awaitCompletion(pending: OnboardingPendingCompletion): Promise<void> {
    await this.update({
      ...this.data,
      status: 'in-progress',
      step: 'awaiting-completion',
      pendingCompletion: pending,
      startedAt: this.data.startedAt ?? Date.now(),
    });
  }

  
  async awaitSampleJournal(
    origin: 'data-source' | 'first-trade'
  ): Promise<void> {
    await this.update({
      ...this.data,
      status: 'in-progress',
      step: 'preparing-sample',
      
      
      answers:
        origin === 'data-source'
          ? { ...this.data.answers, dataSource: 'sample' }
          : this.data.answers,
      pendingCompletion: 'sample-journal',
      startedAt: this.data.startedAt ?? Date.now(),
    });
  }

  
  async enterSampleExploring(): Promise<void> {
    await this.update({
      ...this.data,
      status: 'in-progress',
      step: 'sample-exploring',
      pendingCompletion: null,
      sampleExplored: true,
    });
  }

  isExploringSample(): boolean {
    return (
      this.data.status === 'in-progress' &&
      this.data.step === 'sample-exploring'
    );
  }

  
  async resumeAfterSample(): Promise<void> {
    const fromFreshPath = this.data.answers.dataSource === 'fresh';
    const answers: OnboardingAnswers = { ...this.data.answers };
    delete answers.dataSource;
    delete answers.brokerId;
    delete answers.assetFocus;
    await this.update({
      ...this.data,
      status: 'in-progress',
      step: fromFreshPath ? 'first-trade' : 'data-source',
      answers: fromFreshPath ? this.data.answers : answers,
      pendingCompletion: null,
    });
  }

  
  async leaveSampleJourney(): Promise<void> {
    if (this.data.pendingCompletion !== 'sample-journal') return;
    await this.update({
      ...this.data,
      status: 'in-progress',
      step:
        this.data.answers.dataSource === 'fresh'
          ? 'first-trade'
          : 'data-source',
      pendingCompletion: null,
    });
  }

  
  async setPersonalisationRecord(
    record: OnboardingPersonalisationRecord
  ): Promise<void> {
    await this.update({ ...this.data, personalisation: record });
  }

  async complete(via: OnboardingCompletionReason): Promise<void> {
    await this.update({
      ...this.data,
      status: 'completed',
      pendingCompletion: null,
      completedAt: Date.now(),
      completedVia: via,
    });
  }

  async skip(): Promise<void> {
    await this.update({
      ...this.data,
      status: 'skipped',
      pendingCompletion: null,
      skippedAt: Date.now(),
    });
  }

  private async update(next: OnboardingData): Promise<void> {
    await this.saveData(next);
    this.data = next;
    for (const listener of this.listeners) listener();
  }

  private async loadData(): Promise<void> {
    try {
      const pluginData = asRecord(await this.plugin.loadData());
      const localMeta = asRecord(pluginData?.localMeta);
      this.data = migrateOnboardingData(localMeta?.[ONBOARDING_DATA_KEY], {
        onboardingEverShown: hasOnboardingBeenShown(this.plugin.app),
      });
    } catch (error) {
      console.error(
        '[OnboardingService] Failed to load onboarding data:',
        error
      );
      this.data = createDefaultOnboardingData();
    }
  }

  private async saveData(data: OnboardingData): Promise<void> {
    this.saveQueue = this.saveQueue
      .catch(() => {
        // intentional
      })
      .then(() => this.saveDataInternal(data));
    await this.saveQueue;
  }

  private async saveDataInternal(data: OnboardingData): Promise<void> {
    try {
      
      
      if (this.plugin.settingsManager?.updateRealLocalMetaSection) {
        await this.plugin.settingsManager.updateRealLocalMetaSection(
          ONBOARDING_DATA_KEY,
          data
        );
        return;
      }

      const pluginData = asRecord(await this.plugin.loadData()) ?? {};
      const localMeta = asRecord(pluginData.localMeta) ?? {};
      localMeta[ONBOARDING_DATA_KEY] = data;
      await this.plugin.saveData({ ...pluginData, localMeta });
    } catch (error) {
      console.error(
        '[OnboardingService] Failed to save onboarding data:',
        error
      );
      throw error;
    }
  }

  onunload(): void {
    this.listeners.clear();
  }
}
