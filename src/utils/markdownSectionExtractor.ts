interface ExtractedMarkdownSection {
  heading: string;
  level: number;
  content: string;
}

const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE_PATTERN = /^\s*(```|~~~)/;

function normalizeHeadingText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function stripMarkdownFrontmatter(content: string): string {
  return content.replace(FRONTMATTER_PATTERN, '');
}

function toWantedHeadings(headings: string[]): Set<string> {
  return new Set(
    headings.flatMap((heading) => {
      const normalized = normalizeHeadingText(heading);
      return normalized ? [normalized] : [];
    })
  );
}

function trimBlankBoundaryLines(content: string): string {
  return content
    .replace(/^(?:[\t ]*\r?\n)+/, '')
    .replace(/(?:\r?\n[\t ]*)+$/, '');
}

export function extractMarkdownSectionsByHeading(
  content: string,
  headings: string[]
): ExtractedMarkdownSection[] {
  const wantedHeadings = toWantedHeadings(headings);

  if (wantedHeadings.size === 0) {
    return [];
  }

  const lines = stripMarkdownFrontmatter(content).split('\n');
  const sections: ExtractedMarkdownSection[] = [];

  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (FENCE_PATTERN.test(lines[i])) {
      inFence = !inFence;
      continue;
    }

    if (inFence) continue;

    const match = lines[i].match(HEADING_PATTERN);
    if (!match) continue;

    const level = match[1].length;
    const heading = match[2].trim();
    if (!wantedHeadings.has(normalizeHeadingText(heading))) continue;

    const sectionLines: string[] = [];
    let sectionInFence = false;
    for (let j = i + 1; j < lines.length; j++) {
      if (FENCE_PATTERN.test(lines[j])) {
        sectionInFence = !sectionInFence;
        sectionLines.push(lines[j]);
        continue;
      }

      const nextHeading = sectionInFence
        ? null
        : lines[j].match(HEADING_PATTERN);
      if (nextHeading && nextHeading[1].length <= level) {
        break;
      }
      sectionLines.push(lines[j]);
    }

    sections.push({
      heading,
      level,
      content: trimBlankBoundaryLines(sectionLines.join('\n')),
    });
  }

  return sections;
}


export function partitionMarkdownSectionsByHeading(
  content: string,
  headings: string[]
): ExtractedMarkdownSection[] {
  const wantedHeadings = toWantedHeadings(headings);
  if (wantedHeadings.size === 0) return [];

  const sections: Array<ExtractedMarkdownSection & { lines: string[] }> = [];
  
  const open: Array<{ level: number; section: number | null }> = [];
  const ownerOf = (): number | null => {
    for (let i = open.length - 1; i >= 0; i--) {
      const { section } = open[i];
      if (section !== null) return section;
    }
    return null;
  };

  let inFence = false;
  for (const line of stripMarkdownFrontmatter(content).split('\n')) {
    if (FENCE_PATTERN.test(line)) inFence = !inFence;
    const match = inFence ? null : line.match(HEADING_PATTERN);
    if (match) {
      const level = match[1].length;
      while (open.length > 0 && open[open.length - 1].level >= level) {
        open.pop();
      }
      const heading = match[2].trim();
      if (wantedHeadings.has(normalizeHeadingText(heading))) {
        sections.push({ heading, level, content: '', lines: [] });
        open.push({ level, section: sections.length - 1 });
        continue;
      }
      open.push({ level, section: null });
    }
    const owner = ownerOf();
    if (owner !== null) sections[owner].lines.push(line);
  }

  return sections.map(({ heading, level, lines }) => ({
    heading,
    level,
    content: trimBlankBoundaryLines(lines.join('\n')),
  }));
}
