

import type { KeyLevel, KeyLevels } from '../../components/drc/types';


export type KeyLevelsGroupKey = string | null;


export interface KeyLevelsInput {
  readonly support: readonly Readonly<KeyLevel>[];
  readonly resistance: readonly Readonly<KeyLevel>[];
}

export interface KeyLevelGroupEntry {
  name: string;
  support: KeyLevel[];
  resistance: KeyLevel[];
}


export const KEY_LEVELS_GROUPS_CONFIG_KEY = 'levelGroups';

export const KEY_LEVELS_SHOW_INHERITED_CONFIG_KEY = 'showInheritedLevels';

export const DEFAULT_KEY_LEVELS_GROUPS: readonly KeyLevelsGroupKey[] = [null];

const MAX_GROUP_NAME_LENGTH = 80;

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;


export function keyLevelGroupMatchKey(name: string): string {
  return name.trim().toLowerCase();
}

function normalizeKeyLevel(level: unknown): KeyLevel | null {
  const keyLevel = asRecord(level);
  if (!keyLevel) return null;
  const rawPrice = keyLevel.price;
  if (typeof rawPrice !== 'string' && typeof rawPrice !== 'number') {
    return null;
  }
  const price = String(rawPrice).trim();
  if (!price) return null;
  return {
    price,
    importance:
      keyLevel.importance === 'High' ||
      keyLevel.importance === 'Medium' ||
      keyLevel.importance === 'Low'
        ? keyLevel.importance
        : null,
  };
}

const normalizeKeyLevelArray = (levels: unknown[]): KeyLevel[] =>
  levels.flatMap((level) => {
    const normalized = normalizeKeyLevel(level);
    return normalized ? [normalized] : [];
  });


function normalizeKeyLevels(value: unknown): KeyLevels {
  const record = asRecord(value);
  if (
    !record ||
    !Array.isArray(record.support) ||
    !Array.isArray(record.resistance)
  ) {
    return { support: [], resistance: [] };
  }
  return {
    support: normalizeKeyLevelArray(record.support),
    resistance: normalizeKeyLevelArray(record.resistance),
  };
}


function normalizeKeyLevelGroupName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = Array.from(value.trim())
    .slice(0, MAX_GROUP_NAME_LENGTH)
    .join('')
    .trim();
  return name ? name : null;
}


export function normalizeKeyLevelGroups(value: unknown): KeyLevelGroupEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const groups: KeyLevelGroupEntry[] = [];
  for (const entry of value) {
    const record = asRecord(entry);
    const name = normalizeKeyLevelGroupName(record?.name);
    if (!record || !name) continue;
    const matchKey = keyLevelGroupMatchKey(name);
    if (seen.has(matchKey)) continue;
    seen.add(matchKey);
    groups.push({ name, ...normalizeKeyLevels(record) });
  }
  return groups;
}


export function readKeyLevelsForGroup(
  frontmatter: Readonly<Record<string, unknown>> | undefined,
  group: KeyLevelsGroupKey
): KeyLevels {
  if (!frontmatter) return { support: [], resistance: [] };
  if (group === null) return normalizeKeyLevels(frontmatter.keyLevels);
  const matchKey = keyLevelGroupMatchKey(group);
  const entry = normalizeKeyLevelGroups(frontmatter.keyLevelGroups).find(
    (candidate) => keyLevelGroupMatchKey(candidate.name) === matchKey
  );
  return entry
    ? { support: entry.support, resistance: entry.resistance }
    : { support: [], resistance: [] };
}


export function keyLevelsGroupUpdate(
  frontmatter: Readonly<Record<string, unknown>>,
  group: KeyLevelsGroupKey,
  input: KeyLevelsInput
): Partial<Record<string, unknown>> {
  const levels: KeyLevels = {
    support: input.support.map((level) => ({ ...level })),
    resistance: input.resistance.map((level) => ({ ...level })),
  };
  if (group === null) return { keyLevels: levels };
  const stored: unknown[] = Array.isArray(frontmatter.keyLevelGroups)
    ? frontmatter.keyLevelGroups
    : [];
  const matchKey = keyLevelGroupMatchKey(group);
  
  const index = stored.findIndex((entry) => {
    const name = normalizeKeyLevelGroupName(asRecord(entry)?.name);
    return name !== null && keyLevelGroupMatchKey(name) === matchKey;
  });
  const isEmpty = levels.support.length === 0 && levels.resistance.length === 0;

  let next: unknown[];
  if (index === -1) {
    if (isEmpty) return {};
    next = [...stored, { name: group.trim(), ...levels }];
  } else if (isEmpty) {
    next = stored.filter((_, i) => i !== index);
  } else {
    next = stored.map((entry, i) =>
      i === index ? { ...asRecord(entry), ...levels } : entry
    );
  }
  
  return { keyLevelGroups: next.length > 0 ? next : undefined };
}


export function keyLevelGroupsAfter(
  stored: unknown,
  groups: ReadonlyArray<{ readonly name: string } & KeyLevelsInput>
): unknown {
  let frontmatter: Record<string, unknown> = { keyLevelGroups: stored };
  for (const { name, support, resistance } of groups) {
    frontmatter = {
      ...frontmatter,
      ...keyLevelsGroupUpdate(frontmatter, name, { support, resistance }),
    };
  }
  return frontmatter.keyLevelGroups;
}


export function normalizeKeyLevelsGroupList(
  value: unknown
): KeyLevelsGroupKey[] | null {
  if (!Array.isArray(value)) return null;
  const seen = new Set<string>();
  let hasNoGroup = false;
  const groups: KeyLevelsGroupKey[] = [];
  for (const item of value) {
    if (item === null) {
      if (hasNoGroup) continue;
      hasNoGroup = true;
      groups.push(null);
      continue;
    }
    const name = normalizeKeyLevelGroupName(item);
    if (!name) continue;
    const matchKey = keyLevelGroupMatchKey(name);
    if (seen.has(matchKey)) continue;
    seen.add(matchKey);
    groups.push(name);
  }
  return groups.length > 0 ? groups : null;
}


export function parseKeyLevelsGroupsConfig(
  raw: string
): KeyLevelsGroupKey[] | null {
  try {
    return normalizeKeyLevelsGroupList(JSON.parse(raw));
  } catch {
    return null;
  }
}


export function serializeKeyLevelsGroupsConfig(
  value: unknown
): string | undefined {
  const groups = normalizeKeyLevelsGroupList(value);
  return groups ? JSON.stringify(groups) : undefined;
}


export function resolveKeyLevelsGroups(
  config: Readonly<Record<string, unknown>> | undefined
): KeyLevelsGroupKey[] {
  return (
    normalizeKeyLevelsGroupList(config?.[KEY_LEVELS_GROUPS_CONFIG_KEY]) ?? [
      ...DEFAULT_KEY_LEVELS_GROUPS,
    ]
  );
}


export function isDefaultKeyLevelsGroups(
  groups: readonly KeyLevelsGroupKey[]
): boolean {
  return groups.length === 1 && groups[0] === null;
}
