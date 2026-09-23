import type JournalitPlugin from '../../main';
import { generateUUID } from '../../utils/uuid';
import { Mutex } from '../../utils/mutex';
import { eventBus } from '../events/EventBus';
import { normalizePropFirmProfileCatalog } from './normalization';
import type {
  PropChallengeConfig,
  PropFirmProfileChallenge,
  PropFirmProfileSelection,
} from './types';

export interface PersonalPropFirmProfile {
  id: string;
  revision: number;
  updatedAt: string;
  firmName: string;
  challenge: PropFirmProfileChallenge;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}


export function normalizePersonalProfiles(
  value: unknown
): PersonalPropFirmProfile[] {
  if (value === undefined) return [];
  if (!Array.isArray(value))
    throw new Error('Invalid personal profile library.');
  const profiles: PersonalPropFirmProfile[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      !item.id ||
      typeof item.revision !== 'number' ||
      !Number.isInteger(item.revision) ||
      item.revision < 1 ||
      typeof item.updatedAt !== 'string' ||
      !Number.isFinite(Date.parse(item.updatedAt)) ||
      typeof item.firmName !== 'string' ||
      !item.firmName.trim() ||
      !isRecord(item.challenge) ||
      item.challenge.id !== item.id ||
      !Array.isArray(item.challenge.phases)
    ) {
      throw new Error('Invalid saved personal profile.');
    }
    const catalog = normalizePropFirmProfileCatalog({
      version: item.revision,
      updatedAt: item.updatedAt.slice(0, 10),
      firms: [
        {
          id: item.id,
          name: item.firmName,
          verifiedAt: item.updatedAt.slice(0, 10),
          sources: [],
          challenges: [item.challenge],
        },
      ],
    });
    const challenge = catalog?.firms[0]?.challenges[0];
    if (!challenge || challenge.phases.length !== item.challenge.phases.length)
      throw new Error('Invalid saved profile phases.');
    for (const [index, phase] of item.challenge.phases.entries()) {
      if (
        !isRecord(phase) ||
        !Array.isArray(phase.rules) ||
        phase.rules.length !== challenge.phases[index].rules.length ||
        (phase.stage !== 'evaluation' &&
          phase.stage !== 'sim_funded' &&
          phase.stage !== 'live_funded')
      ) {
        throw new Error('Invalid saved profile rules or stage.');
      }
    }
    profiles.push({
      id: item.id,
      revision: item.revision,
      updatedAt: item.updatedAt,
      firmName: item.firmName,
      challenge,
    });
  }
  if (new Set(profiles.map((profile) => profile.id)).size !== profiles.length)
    throw new Error('Duplicate personal profile IDs.');
  return structuredClone(profiles);
}

export function personalProfileSelection(
  profile: PersonalPropFirmProfile
): PropFirmProfileSelection {
  return {
    source: 'personal',
    firmId: profile.id,
    firmName: profile.firmName,
    catalogVersion: profile.revision,
    verifiedAt: profile.updatedAt.slice(0, 10),
    challenge: structuredClone(profile.challenge),
  };
}

export function createPersonalProfile(
  config: PropChallengeConfig,
  currency: string,
  previous?: PersonalPropFirmProfile,
  now = new Date()
): PersonalPropFirmProfile {
  if (
    !config.firmName?.trim() ||
    !config.challengeName.trim() ||
    !currency.trim() ||
    !config.phases.length
  ) {
    throw new Error(
      'Enter a firm name, challenge name, currency and at least one phase.'
    );
  }
  const id = previous?.id ?? generateUUID();
  const challenge: PropFirmProfileChallenge = {
    id,
    name: config.challengeName.trim(),
    accountSize: config.phases[0].startingBalance,
    currency,
    phases: config.phases.map((phase) => {
      if (!phase.stage)
        throw new Error('Choose an explicit stage for every phase.');
      for (const rule of phase.rules) {
        if (!rule.enabled)
          throw new Error(
            'Enable or remove disabled rules before saving a profile.'
          );
        if (
          ('amount' in rule &&
            (!Number.isFinite(rule.amount) || rule.amount <= 0)) ||
          ('days' in rule && (!Number.isInteger(rule.days) || rule.days < 1)) ||
          ('maxContracts' in rule && rule.maxContracts <= 0) ||
          ('maxBestDayPercent' in rule &&
            (rule.maxBestDayPercent <= 0 || rule.maxBestDayPercent > 100))
        ) {
          throw new Error(
            'Complete the rule values before saving a reusable profile.'
          );
        }
      }
      return {
        name: phase.name,
        stage: phase.stage,
        startingBalance: phase.startingBalance,
        rules: phase.rules.map(
          ({ id: _id, enabled: _enabled, ...rule }) => rule
        ),
        ...(phase.payoutPolicy ? { payoutPolicy: phase.payoutPolicy } : {}),
      };
    }),
  };
  return normalizePersonalProfiles([
    {
      id,
      revision: (previous?.revision ?? 0) + 1,
      updatedAt: now.toISOString(),
      firmName: config.firmName.trim(),
      challenge,
    },
  ])[0];
}

type Store = Pick<JournalitPlugin, 'settings' | 'saveSettings'>;
const locks = new WeakMap<Store, Mutex>();

export async function changePersonalProfiles(
  plugin: Store,
  change: (profiles: PersonalPropFirmProfile[]) => PersonalPropFirmProfile[]
): Promise<void> {
  let lock = locks.get(plugin);
  if (!lock) {
    lock = new Mutex();
    locks.set(plugin, lock);
  }
  await lock.lock();
  const previous = plugin.settings.personalPropFirmProfiles;
  
  
  
  const previousQuarantine = plugin.settings.personalPropFirmProfilesQuarantine;
  try {
    const next = normalizePersonalProfiles(
      change(structuredClone(previous ?? []))
    );
    plugin.settings.personalPropFirmProfiles = next;
    delete plugin.settings.personalPropFirmProfilesQuarantine;
    try {
      await plugin.saveSettings();
    } catch (error) {
      plugin.settings.personalPropFirmProfiles = previous;
      if (previousQuarantine !== undefined) {
        plugin.settings.personalPropFirmProfilesQuarantine = previousQuarantine;
      }
      throw error;
    }
    eventBus.publish('settings:changed', {
      section: 'personalPropFirmProfiles',
      source: 'personal-profiles',
    });
  } finally {
    lock.unlock();
  }
}
