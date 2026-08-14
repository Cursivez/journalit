export type MediaReferenceTransform =
  | { kind: 'keep' }
  | { kind: 'remove' }
  | { kind: 'rewrite'; target: string; suffix?: string };
