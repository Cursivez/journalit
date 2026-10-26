import type { TFile } from 'obsidian';
import type { ImageAnnotation } from '../../../types/imageAnnotations';
import { normalizeImageAnnotation } from '../../../utils/imageAnnotations';
import { findImagesWidgets, widgetImages } from '../../reviews/reviewImages';
import {
  agentMediaId,
  agentMediaType,
  type AgentMediaType,
} from './agentMediaIdentity';


const MAX_AGENT_MEDIA_BYTES = 52_428_800;
const EXTERNAL_MEDIA_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const MAX_IMAGE_TAGS = 50;
const MAX_IMAGE_TAG_CHARS = 100;
const MAX_IMAGE_NOTES_CHARS = 5_000;


export interface AgentMediaOwner {
  readonly file: TFile;
  readonly sources: readonly string[];
}


export interface AgentMediaFile {
  readonly file: TFile;
  readonly mediaType: AgentMediaType;
  
  readonly path: string | undefined;
}


const AGENT_MEDIA_PATH_PATTERN = /^[^/\\:][^:\\]*$/u;
const MAX_AGENT_MEDIA_PATH_CHARS = 1_024;

function agentMediaPath(path: string): string | undefined {
  return Array.from(path).length <= MAX_AGENT_MEDIA_PATH_CHARS &&
    AGENT_MEDIA_PATH_PATTERN.test(path)
    ? path
    : undefined;
}


export interface AgentOwnerMedia extends AgentMediaFile {
  readonly mediaId: string;
  
  readonly source: string;
}


export function resolveAgentMedia(
  source: string,
  sourcePath: string,
  resolveMediaFile: (source: string, sourcePath: string) => TFile | null
): AgentMediaFile | null {
  if (EXTERNAL_MEDIA_PATTERN.test(source.trim())) return null;
  const file = resolveMediaFile(source, sourcePath);
  if (!file) return null;
  const mediaType = agentMediaType(file);
  if (mediaType === undefined || file.stat.size > MAX_AGENT_MEDIA_BYTES) {
    return null;
  }
  return { file, mediaType, path: agentMediaPath(file.path) };
}


export async function listAgentOwnerMedia(input: {
  owner: AgentMediaOwner;
  installationId: string;
  resolveMediaFile: (source: string, sourcePath: string) => TFile | null;
}): Promise<AgentOwnerMedia[]> {
  const { owner } = input;
  const listed: Array<{ media: AgentMediaFile; source: string }> = [];
  const seen = new Set<string>();
  for (const source of owner.sources) {
    const media = resolveAgentMedia(
      source,
      owner.file.path,
      input.resolveMediaFile
    );
    if (!media) continue;
    const mediaPath = media.file.path;
    if (seen.has(mediaPath)) continue;
    seen.add(mediaPath);
    listed.push({ media, source });
  }
  
  return Promise.all(
    listed.map(async ({ media, source }) => ({
      ...media,
      mediaId: await agentMediaId(input.installationId, media.file.path),
      source,
    }))
  );
}


export function reviewImageSources(
  content: string,
  frontmatter: Readonly<Record<string, unknown>>
): string[] {
  return findImagesWidgets(content).flatMap((block) =>
    widgetImages(frontmatter, block)
  );
}

function truncateCodePoints(value: string, maximum: number): string {
  return Array.from(value).slice(0, maximum).join('');
}


export function agentImageAnnotationFields(annotation: ImageAnnotation): {
  tags?: string[];
  notes?: string;
} {
  const normalized = normalizeImageAnnotation(annotation);
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const tag of normalized.tags) {
    const bounded = truncateCodePoints(tag, MAX_IMAGE_TAG_CHARS);
    if (seen.has(bounded)) continue;
    seen.add(bounded);
    tags.push(bounded);
    if (tags.length === MAX_IMAGE_TAGS) break;
  }
  return {
    ...(tags.length > 0 ? { tags } : {}),
    ...(normalized.notes
      ? { notes: truncateCodePoints(normalized.notes, MAX_IMAGE_NOTES_CHARS) }
      : {}),
  };
}
