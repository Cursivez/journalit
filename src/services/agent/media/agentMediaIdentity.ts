import type { TFile } from 'obsidian';



export type AgentMediaType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'image/gif';

export async function sha256Hex(value: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    Uint8Array.from(value).buffer
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

export function agentMediaHashInput(
  installationId: string,
  path: string
): Uint8Array {
  return new TextEncoder().encode(JSON.stringify([installationId, path]));
}


export async function agentMediaId(
  installationId: string,
  path: string,
  hash: (value: Uint8Array) => Promise<string> = sha256Hex
): Promise<string> {
  const digest = await hash(agentMediaHashInput(installationId, path));
  if (!/^[0-9a-f]{64}$/.test(digest)) {
    throw new Error('Media hash returned an invalid digest.');
  }
  return `media_${digest}`;
}


export function agentMediaType(file: TFile): AgentMediaType | undefined {
  switch (file.extension.toLowerCase()) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return undefined;
  }
}
