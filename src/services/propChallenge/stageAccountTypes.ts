import type { PropChallengeStage } from './types';

const PROP_CHALLENGE_STAGES: readonly PropChallengeStage[] = [
  'evaluation',
  'sim_funded',
  'live_funded',
];

export const DEFAULT_CHALLENGE_STAGE_ACCOUNT_TYPES: Partial<
  Record<PropChallengeStage, string>
> = {
  evaluation: 'evaluation',
  sim_funded: 'funded',
  live_funded: 'funded',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function normalizeChallengeStageAccountTypes(
  value: unknown
): Partial<Record<PropChallengeStage, string>> {
  if (!isRecord(value)) return {};
  const result: Partial<Record<PropChallengeStage, string>> = {};
  for (const stage of PROP_CHALLENGE_STAGES) {
    const raw = value[stage];
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    result[stage] = trimmed;
  }
  return result;
}

export function resolveStageAccountType(
  mapping: Partial<Record<PropChallengeStage, string>> | undefined,
  stage: PropChallengeStage | undefined,
  availableTypes: readonly string[]
): string | undefined {
  const mapped = mapping?.[stage ?? 'evaluation'];
  if (typeof mapped !== 'string') return undefined;
  const needle = mapped.trim().toLowerCase();
  if (!needle) return undefined;
  return availableTypes.find((type) => type.toLowerCase() === needle);
}

export function removeAccountTypeFromStageMapping(
  mapping: Partial<Record<PropChallengeStage, string>> | undefined,
  type: string
): Partial<Record<PropChallengeStage, string>> {
  const needle = type.trim().toLowerCase();
  const result: Partial<Record<PropChallengeStage, string>> = {};
  for (const stage of PROP_CHALLENGE_STAGES) {
    const current = mapping?.[stage];
    if (typeof current !== 'string') continue;
    if (needle && current.trim().toLowerCase() === needle) continue;
    result[stage] = current;
  }
  return result;
}

export function replaceAccountTypeInStageMapping(
  mapping: Partial<Record<PropChallengeStage, string>> | undefined,
  oldType: string,
  newType: string
): Partial<Record<PropChallengeStage, string>> {
  const oldNeedle = oldType.trim().toLowerCase();
  const nextType = newType.trim();
  const result: Partial<Record<PropChallengeStage, string>> = {};
  for (const stage of PROP_CHALLENGE_STAGES) {
    const current = mapping?.[stage];
    if (typeof current !== 'string') continue;
    if (oldNeedle && current.trim().toLowerCase() === oldNeedle) {
      if (nextType) result[stage] = nextType;
      continue;
    }
    result[stage] = current;
  }
  return result;
}
