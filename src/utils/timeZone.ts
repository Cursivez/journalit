
function canonicalTimeZone(value: string): string | null {
  if (value.length === 0) return null;
  try {
    const canonical = new Intl.DateTimeFormat('en-US', {
      timeZone: value,
    }).resolvedOptions().timeZone;
    
    return canonical.startsWith('+') || canonical.startsWith('-')
      ? null
      : canonical;
  } catch {
    return null;
  }
}


export function getLocalIanaTimeZone(): string | null {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timeZone ? canonicalTimeZone(timeZone) : null;
  } catch {
    return null;
  }
}
