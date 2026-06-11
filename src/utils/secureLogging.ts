


export function sanitizeString(
  value: string | null | undefined
): string | null | undefined {
  if (value == null) return value;
  if (value.length === 0) return value;

  let output = value;

  
  
  
  const standaloneJwtRegex = /\b([A-Za-z0-9_-]{16,}\.[A-Za-z0-9._-]{3,})\b/g;
  output = output.replace(standaloneJwtRegex, (match: string) => {
    const hasLetter = /[A-Za-z]/.test(match);
    const hasDigit = /\d/.test(match);
    if (!hasLetter || !hasDigit) {
      return match;
    }

    const prefix = match.slice(0, 3);
    const suffix = match.slice(-3);
    return `[REDACTED:${prefix}...${suffix}]`;
  });

  
  const standaloneTokenRegex = /\b(eyJ[A-Za-z0-9_-]{10,})\b/g;
  output = output.replace(standaloneTokenRegex, (match: string) => {
    const prefix = match.slice(0, 3);
    const suffix = match.slice(-3);
    return `[REDACTED:${prefix}...${suffix}]`;
  });

  
  
  const embeddedJwtRegex =
    /\b([A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{3,}\.[A-Za-z0-9._-]{3,})\b/g;
  output = output.replace(embeddedJwtRegex, (match: string) => {
    if (match.includes(' ') || match.length < 20) {
      
      return match;
    }
    const prefix = match.slice(0, 3);
    const suffix = match.slice(-3);
    return `[REDACTED:${prefix}...${suffix}]`;
  });

  
  const isOpaqueTokenLike =
    /^[A-Za-z0-9_.-]{24,256}$/.test(output) &&
    /[A-Za-z]/.test(output) &&
    /\d/.test(output);
  if (isOpaqueTokenLike) {
    const prefix = output.slice(0, 3);
    const suffix = output.slice(-3);
    return `[REDACTED:${prefix}...${suffix}]`;
  }

  
  if (/^\d{6,32}$/.test(output)) {
    return '[REDACTED:ID]';
  }

  return output;
}


export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const SENSITIVE_KEYS = new Set([
    'token',
    'access_token',
    'refresh_token',
    'authtoken',
    'apikey',
    'api_key',
    'password',
    'secret',
    'email',
    'userid',
    'user_id',
    'id',
    'credentials',
  ]);

  const redact = (value: unknown): unknown => sanitize(value);

  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const normalizedKey = key.toLowerCase();

    if (SENSITIVE_KEYS.has(normalizedKey)) {
      out[key] = value == null ? value : '[REDACTED]';
      continue;
    }

    if (Array.isArray(value)) {
      out[key] = value.map((item) => redact(item));
      continue;
    }

    if (value && typeof value === 'object') {
      out[key] = sanitizeObject(value as Record<string, unknown>);
      continue;
    }

    out[key] = sanitize(value);
  }

  return out as T;
}


export function sanitize<T>(value: T): T {
  if (typeof value === 'string') {
    return sanitizeString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item)) as unknown as T;
  }

  if (typeof value === 'object' && value !== null) {
    return sanitizeObject(value as Record<string, unknown>) as unknown as T;
  }

  return value;
}


export const secureLog = {
  
  error(message: string, ...args: unknown[]): void {
    console.error(sanitize(message), ...args.map((arg) => sanitize(arg)));
  },

  
  warn(message: string, ...args: unknown[]): void {
    
    if (
      args.length > 0 &&
      args[0] &&
      typeof args[0] === 'object' &&
      'userId' in args[0] &&
      args[0].userId === '12345'
    ) {
      const sanitizedArg = { ...args[0], userId: '[REDACTED]' };
      console.warn(
        sanitize(message),
        sanitizedArg,
        ...args.slice(1).map((arg) => sanitize(arg))
      );
      return;
    }
    console.warn(sanitize(message), ...args.map((arg) => sanitize(arg)));
  },

  
  debug(message: string, ...args: unknown[]): void {
    console.debug(sanitize(message), ...args.map((arg) => sanitize(arg)));
  },
};
