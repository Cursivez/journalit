


function normalizeOptionString(value: string): string {
  if (!value) return '';

  let normalized = value.trim();

  
  while (normalized.startsWith('"') || normalized.startsWith("'")) {
    normalized = normalized.slice(1).trim();
  }

  
  while (normalized.endsWith('"') || normalized.endsWith("'")) {
    normalized = normalized.slice(0, -1).trim();
  }

  
  if (normalized.includes('/')) {
    const parts = normalized.split('/');
    normalized = parts[parts.length - 1].trim();
  }

  return normalized;
}


export function normalizedEquals(a: string, b: string): boolean {
  return (
    normalizeOptionString(a).toLowerCase() ===
    normalizeOptionString(b).toLowerCase()
  );
}


export function deduplicateOptions(options: string[]): string[] {
  if (!Array.isArray(options)) return [];

  const seen = new Map<string, string>(); 

  for (const option of options) {
    if (!option) continue; 

    const normalized = normalizeOptionString(option); 
    if (!normalized) continue; 

    const normalizedLower = normalized.toLowerCase();

    if (!seen.has(normalizedLower)) {
      seen.set(normalizedLower, normalized); 
    }
  }

  return Array.from(seen.values());
}
