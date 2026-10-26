

const CANONICAL_UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';


export function isCanonicalNonNilUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value !== NIL_UUID &&
    CANONICAL_UUID_PATTERN.test(value)
  );
}


export function generateUUID(): string {
  
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    
    bytes[6] = (bytes[6] & 0x0f) | 0x40;

    
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    
    const hex = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, '0')
    ).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }

  throw new Error('No crypto API available for secure UUID generation');
}
