

import { getWidgetNameByPlacement } from '../../../data/widgetRegistry';
import { t } from '../../../lang/helpers';
import { hasMediaFileExtension } from '../../../utils/imageMediaUtils';

export type ReviewNoteBlock =
  | {
      kind: 'widget';
      id: string;
      widgetType: string;
      config: Record<string, string>;
      markdown: string;
    }
  | {
      kind: 'heading';
      id: string;
      level: number;
      text: string;
      markdown: string;
    }
  | { kind: 'media'; id: string; name: string; markdown: string }
  | { kind: 'text'; id: string; markdown: string };

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;
const WIDGET_FENCE = /^```journalit-([\w-]+)\s*$/;
const FENCE = /^(```|~~~)/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;

const WIKI_EMBED = /^\s*!\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]\s*$/;
const MARKDOWN_EMBED = /^\s*!\[[^\]]*\]\(<?([^)\s>]+)>?(?:\s+"[^"]*")?\)\s*$/;

const REMOTE_OR_INLINE = /^(https?:|data:)/i;


function mediaEmbedTarget(line: string): string | null {
  const target =
    line.match(WIKI_EMBED)?.[1].trim() ?? line.match(MARKDOWN_EMBED)?.[1];
  if (!target) return null;
  return REMOTE_OR_INLINE.test(target) || hasMediaFileExtension(target)
    ? target
    : null;
}

function decodePathPart(part: string): string {
  try {
    return decodeURIComponent(part);
  } catch {
    
    return part;
  }
}


function mediaName(target: string, parts: number): string {
  const segments = target.split(/[?#]/)[0].split('/').filter(Boolean);
  return segments.slice(-parts).map(decodePathPart).join('/') || target;
}


const DEFAULT_SHARED_WIDGETS = new Set([
  'header',
  'pnl-chart',
  'stats',
  'setup-performance',
  'best-worst',
]);

function parseWidgetConfig(lines: string[]): Record<string, string> {
  const config: Record<string, string> = {};
  for (const line of lines) {
    const separator = line.indexOf(':');
    if (separator > 0) {
      config[line.slice(0, separator).trim()] = line
        .slice(separator + 1)
        .trim();
    }
  }
  return config;
}

export function splitReviewNoteBlocks(content: string): ReviewNoteBlock[] {
  const lines = content.replace(FRONTMATTER, '').split(/\r?\n/);
  const blocks: ReviewNoteBlock[] = [];
  let pending: string[] = [];
  let pendingHeading: { level: number; text: string } | null = null;
  const mediaTargets = new Map<number, string>();

  const flush = () => {
    const markdown = pending.join('\n').trim();
    const id = `block-${blocks.length}`;
    if (pendingHeading) {
      blocks.push({ kind: 'heading', id, ...pendingHeading, markdown });
    } else if (markdown) {
      blocks.push({ kind: 'text', id, markdown });
    }
    pending = [];
    pendingHeading = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const widget = line.match(WIDGET_FENCE);
    if (widget) {
      flush();
      const body: string[] = [];
      let end = index + 1;
      while (end < lines.length && !lines[end].startsWith('```')) {
        body.push(lines[end]);
        end += 1;
      }
      blocks.push({
        kind: 'widget',
        id: `block-${blocks.length}`,
        widgetType: widget[1],
        config: parseWidgetConfig(body),
        markdown: lines.slice(index, end + 1).join('\n'),
      });
      index = end;
      continue;
    }

    
    
    if (FENCE.test(line)) {
      const fence = line.slice(0, 3);
      pending.push(line);
      while (index + 1 < lines.length) {
        index += 1;
        pending.push(lines[index]);
        if (lines[index].startsWith(fence)) break;
      }
      continue;
    }

    
    
    const media = mediaEmbedTarget(line);
    if (media) {
      flush();
      blocks.push({
        kind: 'media',
        id: `block-${blocks.length}`,
        name: mediaName(media, 1),
        markdown: line.trim(),
      });
      mediaTargets.set(blocks.length - 1, media);
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      flush();
      pendingHeading = { level: heading[1].length, text: heading[2] };
    }
    pending.push(line);
  }
  flush();

  
  
  const nameCounts = new Map<string, number>();
  for (const block of blocks) {
    if (block.kind === 'media') {
      nameCounts.set(block.name, (nameCounts.get(block.name) ?? 0) + 1);
    }
  }
  return blocks.map((block, index) => {
    const target = mediaTargets.get(index);
    return block.kind === 'media' &&
      target !== undefined &&
      (nameCounts.get(block.name) ?? 0) > 1
      ? { ...block, name: mediaName(target, 2) }
      : block;
  });
}

export function reviewNoteBlockLabel(block: ReviewNoteBlock): string {
  switch (block.kind) {
    case 'widget':
      
      return block.widgetType === 'header'
        ? t('widget.header.name')
        : getWidgetNameByPlacement(block.widgetType, block.config);
    case 'heading':
      return block.text;
    case 'media':
      return block.name;
    case 'text': {
      const firstLine = block.markdown
        .split('\n')[0]
        .replace(/[#>*_`[\]]/g, '');
      return firstLine.length > 40 ? `${firstLine.slice(0, 40)}…` : firstLine;
    }
  }
}

export function isSharedByDefault(block: ReviewNoteBlock): boolean {
  return (
    block.kind === 'widget' && DEFAULT_SHARED_WIDGETS.has(block.widgetType)
  );
}


export interface ReviewNoteSection {
  id: string;
  heading: Extract<ReviewNoteBlock, { kind: 'heading' }> | null;
  items: ReviewNoteBlock[];
}


export function groupReviewNoteSections(
  blocks: ReviewNoteBlock[]
): ReviewNoteSection[] {
  const levels = blocks.flatMap((block) =>
    block.kind === 'heading' ? [block.level] : []
  );
  const topLevel = levels.length > 0 ? Math.min(...levels) : 0;
  const sections: ReviewNoteSection[] = [];
  let current: ReviewNoteSection = {
    id: 'section-top',
    heading: null,
    items: [],
  };

  for (const block of blocks) {
    if (block.kind === 'heading' && block.level === topLevel) {
      if (current.heading || current.items.length > 0) sections.push(current);
      
      
      
      const [headingLine, ...rest] = block.markdown.split('\n');
      const text = rest.join('\n').trim();
      current = {
        id: `section-${block.id}`,
        heading: { ...block, markdown: headingLine },
        items: text
          ? [{ kind: 'text', id: `${block.id}-text`, markdown: text }]
          : [],
      };
    } else {
      current.items.push(block);
    }
  }
  if (current.heading || current.items.length > 0) sections.push(current);
  return sections;
}


export function selectedReviewNoteBlocks(
  sections: ReviewNoteSection[],
  selected: ReadonlySet<string>
): ReviewNoteBlock[] {
  return sections.flatMap((section) => {
    const items = section.items.filter((item) => selected.has(item.id));
    const includeHeading =
      section.heading !== null &&
      (items.length > 0 ||
        (section.items.length === 0 && selected.has(section.heading.id)));
    return section.heading && includeHeading
      ? [section.heading, ...items]
      : items;
  });
}


export function reviewNoteSectionItemIds(section: ReviewNoteSection): string[] {
  return section.items.length > 0 || !section.heading
    ? section.items.map((item) => item.id)
    : [section.heading.id];
}
