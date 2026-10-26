

function unquoteYamlScalar(value: string): string {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed === 'string') return parsed;
    } catch {
      return value.slice(1, -1);
    }
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }
  return value;
}

function emitRawScalar(scalars: string[], value: string): void {
  const trimmed = value.trim();
  if (trimmed.length === 0) return;
  scalars.push(trimmed);
  const unquoted = unquoteYamlScalar(trimmed);
  if (unquoted.length > 0 && unquoted !== trimmed) scalars.push(unquoted);
}

function splitCommasOutsideQuotes(value: string): string[] {
  const entries: string[] = [];
  let current = '';
  let quote: '"' | "'" | undefined;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote !== undefined) {
      current += char;
      if (quote === '"' && char === '\\') {
        if (index + 1 < value.length) {
          current += value[index + 1];
          index += 1;
        }
        continue;
      }
      if (quote === "'" && char === "'" && value[index + 1] === "'") {
        current += value[index + 1];
        index += 1;
        continue;
      }
      if (char === quote) quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === ',') {
      entries.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  entries.push(current);
  return entries;
}

function emitQuotedScalars(raw: string, scalars: string[]): void {
  let index = 0;
  while (index < raw.length) {
    const char = raw[index];
    if (char !== '"' && char !== "'") {
      index += 1;
      continue;
    }
    const quote = char;
    let end = index + 1;
    while (end < raw.length) {
      if (quote === '"' && raw[end] === '\\') {
        end += 2;
        continue;
      }
      if (quote === "'" && raw[end] === "'" && raw[end + 1] === "'") {
        end += 2;
        continue;
      }
      if (raw[end] === quote) break;
      end += 1;
    }
    if (end >= raw.length) break;
    emitRawScalar(scalars, raw.slice(index, end + 1));
    index = end + 1;
  }
}

function isYamlWhitespace(char: string): boolean {
  return char === ' ' || char === '\t';
}

function stripUnquotedYamlComment(value: string): string {
  let quote: '"' | "'" | undefined;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote === '"') {
      if (char === '\\') {
        index += 1;
        continue;
      }
      if (char === '"') quote = undefined;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && value[index + 1] === "'") {
        index += 1;
        continue;
      }
      if (char === "'") quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '#' && (index === 0 || isYamlWhitespace(value[index - 1]))) {
      return value.slice(0, index).trimEnd();
    }
  }
  return value;
}

function findUnquotedClosingBracket(value: string): number {
  let quote: '"' | "'" | undefined;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote === '"') {
      if (char === '\\') {
        index += 1;
        continue;
      }
      if (char === '"') quote = undefined;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && value[index + 1] === "'") {
        index += 1;
        continue;
      }
      if (char === "'") quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === ']') return index;
  }
  return -1;
}

function findUnquotedColon(value: string): number {
  let quote: '"' | "'" | undefined;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote === '"') {
      if (char === '\\') {
        index += 1;
        continue;
      }
      if (char === '"') quote = undefined;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && value[index + 1] === "'") {
        index += 1;
        continue;
      }
      if (char === "'") quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === ':') return index;
  }
  return -1;
}

function findUnquotedClosingBrace(value: string): number {
  let quote: '"' | "'" | undefined;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote === '"') {
      if (char === '\\') {
        index += 1;
        continue;
      }
      if (char === '"') quote = undefined;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && value[index + 1] === "'") {
        index += 1;
        continue;
      }
      if (char === "'") quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '}') return index;
  }
  return -1;
}

function emitColonSeparatedValues(raw: string, scalars: string[]): void {
  const colon = findUnquotedColon(raw);
  if (colon < 0) return;
  emitRawScalar(scalars, raw.slice(colon + 1));
}

function emitFlowMappingValues(raw: string, scalars: string[]): void {
  let quote: '"' | "'" | undefined;
  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    if (quote === '"') {
      if (char === '\\') {
        index += 1;
        continue;
      }
      if (char === '"') quote = undefined;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && raw[index + 1] === "'") {
        index += 1;
        continue;
      }
      if (char === "'") quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char !== '{') continue;
    const body = raw.slice(index + 1);
    const close = findUnquotedClosingBrace(body);
    const inner = close === -1 ? body : body.slice(0, close);
    const entries = splitCommasOutsideQuotes(inner);
    for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
      emitColonSeparatedValues(entries[entryIndex], scalars);
    }
    if (close === -1) return;
    index += close + 1;
  }
}

export function extractRawYamlScalars(raw: string): string[] {
  const scalars: string[] = [];
  const cleanedLines: string[] = [];
  const lines = raw.split('\n');
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    cleanedLines.push(
      stripUnquotedYamlComment(lines[lineIndex].replace(/\r$/, ''))
    );
  }
  const cleaned = cleanedLines.join('\n');
  emitQuotedScalars(cleaned, scalars);

  for (let lineIndex = 0; lineIndex < cleanedLines.length; lineIndex += 1) {
    const trimmed = cleanedLines[lineIndex].trim();
    if (!trimmed.startsWith('-')) continue;
    emitRawScalar(scalars, trimmed.slice(1).trim());
  }

  const separator = cleaned.indexOf(':');
  if (separator >= 0) {
    const remainder = cleaned.slice(separator + 1).trim();
    if (remainder.length > 0) {
      emitRawScalar(scalars, remainder);
      if (remainder.startsWith('[')) {
        const body = remainder.slice(1);
        const close = findUnquotedClosingBracket(body);
        const inner = close === -1 ? body : body.slice(0, close);
        const entries = splitCommasOutsideQuotes(inner);
        for (let index = 0; index < entries.length; index += 1) {
          emitRawScalar(scalars, entries[index]);
        }
      }
    }
  }
  emitNaiveYamlScalars(raw, scalars);
  for (let lineIndex = 0; lineIndex < cleanedLines.length; lineIndex += 1) {
    emitColonSeparatedValues(cleanedLines[lineIndex], scalars);
  }
  emitFlowMappingValues(cleaned, scalars);
  return scalars;
}

function stripNaiveYamlComment(value: string): string {
  for (let index = 0; index < value.length; index += 1) {
    if (
      value[index] === '#' &&
      (index === 0 || isYamlWhitespace(value[index - 1]))
    ) {
      return value.slice(0, index).trimEnd();
    }
  }
  return value;
}

function emitNaiveScalar(scalars: string[], value: string): void {
  const trimmed = value.trim();
  if (trimmed.length === 0) return;
  scalars.push(trimmed);
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    const decoded = unquoteYamlScalar(trimmed);
    if (decoded.length > 0 && decoded !== trimmed) scalars.push(decoded);
    const stripped = trimmed.slice(1, -1);
    if (stripped.length > 0 && stripped !== trimmed && stripped !== decoded) {
      scalars.push(stripped);
    }
  }
}

function emitNaiveYamlScalars(raw: string, scalars: string[]): void {
  const cleanedLines: string[] = [];
  const lines = raw.split('\n');
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    cleanedLines.push(
      stripNaiveYamlComment(lines[lineIndex].replace(/\r$/, ''))
    );
  }
  const cleaned = cleanedLines.join('\n');

  for (let lineIndex = 0; lineIndex < cleanedLines.length; lineIndex += 1) {
    const trimmed = cleanedLines[lineIndex].trim();
    if (!trimmed.startsWith('-')) continue;
    emitNaiveScalar(scalars, trimmed.slice(1).trim());
  }

  const separator = cleaned.indexOf(':');
  if (separator < 0) return;
  const remainder = cleaned.slice(separator + 1).trim();
  if (remainder.length === 0) return;
  emitNaiveScalar(scalars, remainder);
  if (!remainder.startsWith('[')) return;
  const close = remainder.indexOf(']');
  const inner = close === -1 ? remainder.slice(1) : remainder.slice(1, close);
  const entries = inner.split(',');
  for (let index = 0; index < entries.length; index += 1) {
    emitNaiveScalar(scalars, entries[index]);
  }
}
