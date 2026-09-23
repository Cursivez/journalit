import type { JournalitSettings } from './types';

interface DisplayNameSettingsOwner {
  settings: Pick<JournalitSettings, 'general'>;
  saveSettings: () => Promise<void>;
}

export const DISPLAY_NAME_CHANGED_EVENT = 'journalit:display-name-changed';

interface DisplayNameChangedEventDetail {
  displayName: string;
}

const displayNameSaveQueues = new WeakMap<
  DisplayNameSettingsOwner,
  Promise<void>
>();

const isDisplayNameChangedEventDetail = (
  value: unknown
): value is DisplayNameChangedEventDetail => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return typeof Reflect.get(value, 'displayName') === 'string';
};

export const subscribeToDisplayNameChanges = (
  eventTarget: EventTarget,
  onDisplayNameChange: (displayName: string) => void
): (() => void) => {
  const handleDisplayNameChange = (event: Event) => {
    if (!(event instanceof CustomEvent)) {
      return;
    }

    const detail: unknown = event.detail;
    if (!isDisplayNameChangedEventDetail(detail)) {
      return;
    }

    onDisplayNameChange(detail.displayName);
  };

  eventTarget.addEventListener(
    DISPLAY_NAME_CHANGED_EVENT,
    handleDisplayNameChange
  );
  return () =>
    eventTarget.removeEventListener(
      DISPLAY_NAME_CHANGED_EVENT,
      handleDisplayNameChange
    );
};

async function persistDisplayName(
  plugin: DisplayNameSettingsOwner,
  displayName: string
): Promise<void> {
  const generalSettings = plugin.settings.general;
  if (!generalSettings) {
    throw new Error(
      'General settings must be initialized before saving a display name'
    );
  }

  const previousDisplayName = generalSettings.displayName || '';
  generalSettings.displayName = displayName;

  try {
    await plugin.saveSettings();
    window.dispatchEvent(
      new CustomEvent(DISPLAY_NAME_CHANGED_EVENT, {
        detail: { displayName },
      })
    );
  } catch (error) {
    generalSettings.displayName = previousDisplayName;
    throw error;
  }
}

export function saveDisplayName(
  plugin: DisplayNameSettingsOwner,
  displayName: string
): Promise<void> {
  const previousSave = displayNameSaveQueues.get(plugin) ?? Promise.resolve();
  const currentSave = previousSave
    .catch(() => undefined)
    .then(() => persistDisplayName(plugin, displayName));

  displayNameSaveQueues.set(plugin, currentSave);
  return currentSave.finally(() => {
    if (displayNameSaveQueues.get(plugin) === currentSave) {
      displayNameSaveQueues.delete(plugin);
    }
  });
}
