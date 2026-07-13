

export async function writeClipboardText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export async function writeClipboardImage(blob: Blob): Promise<void> {
  const mimeType = blob.type || 'image/png';
  await navigator.clipboard.write([
    new ClipboardItem({
      [mimeType]: blob,
    }),
  ]);
}

export async function readClipboardText(): Promise<string> {
  return navigator.clipboard.readText();
}

export function canReadClipboardItems(): boolean {
  return typeof navigator.clipboard?.read === 'function';
}

export function canWriteClipboardText(): boolean {
  return typeof navigator.clipboard?.writeText === 'function';
}

export function canWriteClipboardItems(): boolean {
  return (
    typeof navigator.clipboard?.write === 'function' &&
    typeof ClipboardItem === 'function'
  );
}

export async function readClipboardItems(): Promise<ClipboardItem[]> {
  return navigator.clipboard.read();
}
