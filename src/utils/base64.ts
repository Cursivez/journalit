
export function encodeBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binaryString = '';

  for (const byte of bytes) {
    binaryString += String.fromCharCode(byte);
  }

  return btoa(binaryString);
}
