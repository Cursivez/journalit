import type { PersonalPropFirmProfile } from './PersonalPropFirmProfiles';
import { normalizePersonalProfiles } from './PersonalPropFirmProfiles';
import { normalizePropChallengeConfig } from './normalization';
import {
  requiresProtectedChallengeStorage,
  requiresProtectedPersonalProfileStorage,
} from './PropChallengeStorageProtection';
import type { PropChallengeConfig } from './types';

const STORAGE_VERSION = 1;
const CHALLENGE_FORMAT = 'journalit-prop-challenge-protected';
const PERSONAL_PROFILES_FORMAT = 'journalit-personal-profiles-protected';

interface ProtectedStorageEnvelope {
  format: string;
  version: number;
  payload: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

type StoredPayload =
  | { kind: 'raw'; payload: unknown }
  | { kind: 'protected'; payload: unknown }
  | { kind: 'invalid' };

function storedPayload(value: unknown, format: string): StoredPayload {
  if (!isRecord(value) || value.format !== format) {
    return { kind: 'raw', payload: value };
  }
  if (value.version !== STORAGE_VERSION || !('payload' in value)) {
    return { kind: 'invalid' };
  }
  return { kind: 'protected', payload: value.payload };
}

function envelope(format: string, payload: unknown): ProtectedStorageEnvelope {
  return { format, version: STORAGE_VERSION, payload };
}

export function protectPropChallengeForStorage(
  config: PropChallengeConfig
): PropChallengeConfig | ProtectedStorageEnvelope {
  return requiresProtectedChallengeStorage(config)
    ? envelope(CHALLENGE_FORMAT, config)
    : config;
}

export function normalizeStoredPropChallenge(
  value: unknown
): PropChallengeConfig | undefined {
  const stored = storedPayload(value, CHALLENGE_FORMAT);
  return stored.kind === 'invalid'
    ? undefined
    : normalizePropChallengeConfig(stored.payload);
}


export function recoverProtectedPropChallenge(
  value: unknown
): PropChallengeConfig | undefined {
  const stored = storedPayload(value, CHALLENGE_FORMAT);
  return stored.kind === 'protected'
    ? normalizePropChallengeConfig(stored.payload)
    : undefined;
}

export function protectPersonalProfilesForStorage(
  profiles: PersonalPropFirmProfile[]
): PersonalPropFirmProfile[] | ProtectedStorageEnvelope {
  return requiresProtectedPersonalProfileStorage(profiles)
    ? envelope(PERSONAL_PROFILES_FORMAT, profiles)
    : profiles;
}

export function normalizeStoredPersonalProfiles(
  value: unknown
): PersonalPropFirmProfile[] {
  const stored = storedPayload(value, PERSONAL_PROFILES_FORMAT);
  if (stored.kind === 'invalid') {
    throw new Error('Invalid protected personal profile library.');
  }
  return normalizePersonalProfiles(stored.payload);
}


export function recoverProtectedPersonalProfiles(
  value: unknown
): PersonalPropFirmProfile[] | undefined {
  const stored = storedPayload(value, PERSONAL_PROFILES_FORMAT);
  if (stored.kind !== 'protected') return undefined;
  try {
    return normalizePersonalProfiles(stored.payload);
  } catch {
    return undefined;
  }
}
