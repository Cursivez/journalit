import type { SessionModeWindow } from '../../types/sessionMode';


export function normalizePreferredSessionIds(
  preferences: readonly string[],
  sessionWindows: readonly SessionModeWindow[]
): string[] {
  const selectableWindows = sessionWindows.filter(
    (sessionWindow) => sessionWindow.name.trim().length > 0
  );
  const windowsById = new Map(
    selectableWindows.map((sessionWindow) => [sessionWindow.id, sessionWindow])
  );
  const windowsByName = new Map<string, SessionModeWindow[]>();

  for (const sessionWindow of selectableWindows) {
    const name = sessionWindow.name.trim();
    const matches = windowsByName.get(name) ?? [];
    matches.push(sessionWindow);
    windowsByName.set(name, matches);
  }

  const normalizedIds = preferences.flatMap((preference) => {
    if (windowsById.has(preference)) return [preference];
    const nameMatches = windowsByName.get(preference.trim()) ?? [];
    return nameMatches.length === 1 ? [nameMatches[0].id] : [];
  });

  return [...new Set(normalizedIds)];
}

export function resolvePreferredSessionNames(
  preferences: readonly string[],
  sessionWindows: readonly SessionModeWindow[]
): string[] {
  const namesById = new Map(
    sessionWindows.flatMap((sessionWindow) => {
      const name = sessionWindow.name.trim();
      return name.length === 0 ? [] : [[sessionWindow.id, name] as const];
    })
  );

  return normalizePreferredSessionIds(preferences, sessionWindows).map(
    (sessionId) => namesById.get(sessionId) ?? sessionId
  );
}
