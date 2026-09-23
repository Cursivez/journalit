

import type JournalitPlugin from '../../main';

export type ModalGuideStatus = 'completed' | 'skipped';

interface ModalGuidePersistedState {
  guideId: string;
  version: number;
  status: ModalGuideStatus;
  updatedAt: number;
}

export interface ModalGuideIdentity {
  guideId: string;
  version: number;
  
  dataKey: string;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

function parseModalGuideState(
  value: unknown,
  guideId: string
): ModalGuidePersistedState | null {
  const record = asRecord(value);
  if (
    !record ||
    record.guideId !== guideId ||
    typeof record.version !== 'number' ||
    typeof record.updatedAt !== 'number' ||
    (record.status !== 'completed' && record.status !== 'skipped')
  ) {
    return null;
  }
  return {
    guideId,
    version: record.version,
    status: record.status,
    updatedAt: record.updatedAt,
  };
}

async function loadModalGuideState(
  plugin: JournalitPlugin,
  identity: ModalGuideIdentity
): Promise<ModalGuidePersistedState | null> {
  if (plugin.settingsManager.isSampleContextActive()) {
    return parseModalGuideState(
      plugin.settingsManager.getSampleLocalMetaSection(identity.dataKey),
      identity.guideId
    );
  }
  const pluginData = asRecord(await plugin.loadData());
  const localMeta = asRecord(pluginData?.localMeta);
  return parseModalGuideState(localMeta?.[identity.dataKey], identity.guideId);
}


export async function shouldAutoShowModalGuide(
  plugin: JournalitPlugin,
  identity: ModalGuideIdentity
): Promise<boolean> {
  const persisted = await loadModalGuideState(plugin, identity);
  return !persisted || persisted.version !== identity.version;
}

export async function saveModalGuideState(
  plugin: JournalitPlugin,
  identity: ModalGuideIdentity,
  status: ModalGuideStatus
): Promise<void> {
  const nextState: ModalGuidePersistedState = {
    guideId: identity.guideId,
    version: identity.version,
    status,
    updatedAt: Date.now(),
  };
  await plugin.settingsManager.updateLocalMetaSection(
    identity.dataKey,
    nextState
  );
}
