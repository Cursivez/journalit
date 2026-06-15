

export async function writeClipboardText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
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

export async function readClipboardItems(): Promise<ClipboardItem[]> {
  return navigator.clipboard.read();
}
