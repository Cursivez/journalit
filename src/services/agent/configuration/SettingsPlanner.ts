import type {
  SettingsChange,
  SettingsChangeSummary,
  SettingsProjection,
} from './configurationChangeTypes';
import {
  throwIfAborted,
  type PlannedConfigurationChange,
} from './configurationPlan';
import {
  SettingsConfigurationError,
  applySettingsChange,
  copyOwnedSettings,
  effectiveSettingsGroup,
  projectSettingsConfiguration,
  selectChangedSettings,
  settingsGroupRevision,
  settingsGroupsEqual,
  type RawOwnedSettings,
} from './settingsConfiguration';

export interface SettingsChangePlanSummary {
  
  base_revision: string;
  
  resulting_revision: string;
  change: SettingsChangeSummary;
  settings: SettingsProjection;
}

export interface PlannedSettingsChange extends PlannedConfigurationChange<
  SettingsChangePlanSummary,
  SettingsExecution
> {
  
  readonly previous: Readonly<Record<string, unknown>>;
}


export interface SettingsExecution {
  
  readonly restorable: boolean;
}

interface SettingsPlannerDependencies {
  getSettings(): RawOwnedSettings;
  
  saveSettings(settings: RawOwnedSettings): Promise<void>;
}


export class SettingsPlanner {
  constructor(private readonly dependencies: SettingsPlannerDependencies) {}

  async plan(
    change: SettingsChange,
    signal: AbortSignal
  ): Promise<PlannedSettingsChange> {
    throwIfAborted(signal);
    const snapshot = copyOwnedSettings(this.dependencies.getSettings());
    
    const applied = applySettingsChange(snapshot, change);
    const [baseRevision, resultingRevision, settings] = await Promise.all([
      settingsGroupRevision(snapshot, change.kind),
      settingsGroupRevision(applied.next, change.kind),
      projectSettingsConfiguration(applied.next),
    ]);
    throwIfAborted(signal);
    const summary: SettingsChangePlanSummary = {
      base_revision: baseRevision,
      resulting_revision: resultingRevision,
      change: applied.summary,
      settings,
    };
    return {
      summary,
      previous: applied.previous,
      execute: (executionSignal) =>
        this.execute(change, summary, executionSignal),
    };
  }

  private async execute(
    change: SettingsChange,
    planned: SettingsChangePlanSummary,
    signal: AbortSignal
  ): Promise<SettingsExecution> {
    throwIfAborted(signal);
    const snapshot = copyOwnedSettings(this.dependencies.getSettings());
    const captured = effectiveSettingsGroup(snapshot, change.kind);
    if (
      (await settingsGroupRevision(snapshot, change.kind)) !==
      planned.base_revision
    ) {
      throw new SettingsConfigurationError('conflict');
    }
    const applied = applySettingsChange(snapshot, change);
    if (
      (await settingsGroupRevision(applied.next, change.kind)) !==
      planned.resulting_revision
    ) {
      throw new SettingsConfigurationError('conflict');
    }
    throwIfAborted(signal);
    
    if (
      !settingsGroupsEqual(
        captured,
        effectiveSettingsGroup(this.dependencies.getSettings(), change.kind),
        change.kind
      )
    ) {
      throw new SettingsConfigurationError('conflict');
    }
    if (applied.summary.changed_fields.length > 0) {
      await this.dependencies.saveSettings(
        selectChangedSettings(
          applied.next,
          change.kind,
          applied.summary.changed_fields
        )
      );
    }
    return { restorable: applied.restorable };
  }
}
