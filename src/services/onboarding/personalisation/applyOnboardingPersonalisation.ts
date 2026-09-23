

import type JournalitPlugin from '../../../main';
import { eventBus } from '../../events/EventBus';
import type { OnboardingService } from '../OnboardingService';
import type { OnboardingAnswers } from '../types';
import { buildPersonalisationPlan, type PersonalisationLever } from './plan';


const PERSONALISATION_PATHS = [
  'home.layouts',
  'home.activeLayout',
  'home.streaks',
  'home.goals',
  'home.quickLinks',
  'home.positionSizeDefaults',
  'navigation.items',
  'trade.autoOpenCreatedTrades',
  'trade.analyticsDateBasis',
  'trade.maeMfeDisplayUnit',
  'trade.tradeFormLayout',
  'backendIntegration.showNewTradeNotifications',
  'drc.autoCreateDRCOnNavigation',
  'weekly.autoCreateWeeklyReviewOnNavigation',
  'account.defaultAccountType',
  'account.defaultDrawdownType',
] as const;

type SettingsRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is SettingsRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function readPath(root: SettingsRecord, path: string): unknown {
  let current: unknown = root;
  for (const key of path.split('.')) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

function writePath(root: SettingsRecord, path: string, value: unknown): void {
  const keys = path.split('.');
  let current: SettingsRecord = root;
  for (const key of keys.slice(0, -1)) {
    const next = current[key];
    if (!isRecord(next)) return;
    current = next;
  }
  const last = keys[keys.length - 1];
  if (value === undefined) {
    delete current[last];
  } else {
    current[last] = value;
  }
}

const snapshot = (settings: SettingsRecord): SettingsRecord => {
  const result: SettingsRecord = {};
  for (const path of PERSONALISATION_PATHS) {
    const value = readPath(settings, path);
    if (value !== undefined) result[path] = structuredClone(value);
  }
  return result;
};

const sameValue = (a: unknown, b: unknown): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

export async function applyOnboardingPersonalisation(
  plugin: JournalitPlugin,
  service: OnboardingService,
  answers: OnboardingAnswers
): Promise<PersonalisationLever[]> {
  const settings: SettingsRecord = plugin.settings;
  const previous = service.getState().personalisation;
  
  
  const userEdited: SettingsRecord = {};
  if (previous) {
    for (const path of PERSONALISATION_PATHS) {
      const current = readPath(settings, path);
      if (sameValue(current, previous.applied[path])) {
        writePath(settings, path, structuredClone(previous.baseline[path]));
      } else if (path in previous.applied || path in previous.baseline) {
        userEdited[path] = structuredClone(current);
      }
    }
  }

  const baseline = snapshot(settings);
  const changes = buildPersonalisationPlan(answers, plugin.settings);
  for (const change of changes) {
    change.apply(plugin.settings);
  }
  for (const [path, value] of Object.entries(userEdited)) {
    writePath(settings, path, value);
  }
  
  
  const applied = snapshot(settings);
  for (const path of PERSONALISATION_PATHS) {
    if (sameValue(baseline[path], applied[path])) {
      delete baseline[path];
      delete applied[path];
    }
  }

  if (changes.length === 0 && !previous) return [];

  await plugin.saveSettings();
  await service.setPersonalisationRecord({ baseline, applied });
  eventBus.publish('settings:changed', {
    source: 'onboarding',
    section: 'personalisation',
    settings: plugin.settings,
  });
  return Array.from(new Set(changes.map((change) => change.lever)));
}
