

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WorkspaceLeaf, setIcon } from 'obsidian';
import { ReleaseNotesView } from './ReleaseNotesView';
import { usePlugin } from '../../hooks/usePlugin';
import { getReleasesData } from '../../data/releasesData';
import { t } from '../../lang/helpers';
import { compareReleaseVersions } from './versionSort';
import { openExternalUrl } from '../../utils/externalLinks';
import { Accordion } from '../shared/Accordion';

interface Props {
  leaf: WorkspaceLeaf;
  view: ReleaseNotesView;
}

interface ChangelogEntry {
  version: string;
  content: string;
}

function sanitizeExternalHref(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function parseInlineReleaseMarkdownNodes(
  text: string,
  keyPrefix: string
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let textStart = 0;
  let key = 0;

  const flushText = (end: number) => {
    if (end > textStart) {
      nodes.push(text.slice(textStart, end));
    }
  };

  const findChar = (char: string, fromIndex: number): number => {
    for (let index = fromIndex; index < text.length; index++) {
      if (text[index] === char) return index;
    }
    return -1;
  };

  const findToken = (token: string, fromIndex: number): number => {
    for (let index = fromIndex; index <= text.length - token.length; index++) {
      if (text.startsWith(token, index)) return index;
    }
    return -1;
  };

  while (i < text.length) {
    
    if (text[i] === '[') {
      const closeBracket = findChar(']', i + 1);
      const openParen =
        closeBracket !== -1 ? findChar('(', closeBracket + 1) : -1;
      const closeParen = openParen !== -1 ? findChar(')', openParen) : -1;

      if (
        closeBracket !== -1 &&
        openParen === closeBracket + 1 &&
        closeParen !== -1
      ) {
        flushText(i);

        const label = text.slice(i + 1, closeBracket);
        const href = text.slice(openParen + 1, closeParen);
        const safeHref = sanitizeExternalHref(href);

        const labelNodes = parseInlineReleaseMarkdownNodes(
          label,
          `${keyPrefix}-link-text-${key}`
        );

        if (safeHref) {
          nodes.push(
            <a
              key={`${keyPrefix}-link-${key++}`}
              href={safeHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {labelNodes}
            </a>
          );
        } else {
          
          nodes.push(
            <span key={`${keyPrefix}-link-invalid-${key++}`}>{labelNodes}</span>
          );
        }

        i = closeParen + 1;
        textStart = i;
        continue;
      }
    }

    
    if (text[i] === '`') {
      const end = findChar('`', i + 1);
      if (end !== -1) {
        flushText(i);
        const code = text.slice(i + 1, end);
        nodes.push(<code key={`${keyPrefix}-code-${key++}`}>{code}</code>);
        i = end + 1;
        textStart = i;
        continue;
      }
    }

    
    if (text.startsWith('**', i)) {
      const end = findToken('**', i + 2);
      if (end !== -1) {
        flushText(i);
        const inner = text.slice(i + 2, end);
        nodes.push(
          <strong key={`${keyPrefix}-strong-${key++}`}>
            {parseInlineReleaseMarkdownNodes(
              inner,
              `${keyPrefix}-strong-inner-${key}`
            )}
          </strong>
        );
        i = end + 2;
        textStart = i;
        continue;
      }
    }

    
    if (text.startsWith('__', i)) {
      const end = findToken('__', i + 2);
      if (end !== -1) {
        flushText(i);
        const inner = text.slice(i + 2, end);
        nodes.push(
          <strong key={`${keyPrefix}-strong2-${key++}`}>
            {parseInlineReleaseMarkdownNodes(
              inner,
              `${keyPrefix}-strong2-inner-${key}`
            )}
          </strong>
        );
        i = end + 2;
        textStart = i;
        continue;
      }
    }

    
    if (text[i] === '*' && !text.startsWith('**', i)) {
      const end = findChar('*', i + 1);
      if (end !== -1) {
        flushText(i);
        const inner = text.slice(i + 1, end);
        nodes.push(
          <em key={`${keyPrefix}-em-${key++}`}>
            {parseInlineReleaseMarkdownNodes(
              inner,
              `${keyPrefix}-em-inner-${key}`
            )}
          </em>
        );
        i = end + 1;
        textStart = i;
        continue;
      }
    }

    
    if (text[i] === '_' && !text.startsWith('__', i)) {
      const end = findChar('_', i + 1);
      if (end !== -1) {
        flushText(i);
        const inner = text.slice(i + 1, end);
        nodes.push(
          <em key={`${keyPrefix}-em2-${key++}`}>
            {parseInlineReleaseMarkdownNodes(
              inner,
              `${keyPrefix}-em2-inner-${key}`
            )}
          </em>
        );
        i = end + 1;
        textStart = i;
        continue;
      }
    }

    i++;
  }

  flushText(text.length);
  return nodes;
}

interface ReleaseMarkdownLine {
  
  line: number;
  text: string;
}

type ReleaseMarkdownBlock = { line: number } & (
  | { kind: 'heading'; level: 2 | 3 | 4; text: string }
  | { kind: 'image'; alt: string; url: string }
  | { kind: 'list'; items: ReleaseMarkdownLine[] }
  | { kind: 'paragraph'; text: string }
);

const RELEASE_HEADING_PREFIXES = [
  ['# ', 2],
  ['## ', 3],
  ['### ', 4],
] as const;

const RELEASE_LIST_ITEM = /^[\s]*[-*]\s+/;


const releaseStandaloneBlock = (
  line: string,
  lineNumber: number
): ReleaseMarkdownBlock | undefined => {
  for (const [prefix, level] of RELEASE_HEADING_PREFIXES) {
    if (line.startsWith(prefix)) {
      return {
        line: lineNumber,
        kind: 'heading',
        level,
        text: line.slice(prefix.length),
      };
    }
  }
  const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (!imageMatch) return undefined;
  const [, alt, url] = imageMatch;
  
  if (url.startsWith('./') || url.startsWith('../')) {
    console.warn(
      '[ReleaseNotes] Relative image paths not supported, use remote URLs:',
      url
    );
  }
  return { line: lineNumber, kind: 'image', alt, url };
};


const parseReleaseMarkdownBlocks = (
  content: string
): ReleaseMarkdownBlock[] => {
  const blocks: ReleaseMarkdownBlock[] = [];
  let list: ReleaseMarkdownLine[] | null = null;
  content.split('\n').forEach((line, lineNumber) => {
    if (line.trim() === '') {
      list = null;
      return;
    }
    const standalone = releaseStandaloneBlock(line, lineNumber);
    if (!standalone && RELEASE_LIST_ITEM.test(line)) {
      if (!list) {
        list = [];
        blocks.push({ line: lineNumber, kind: 'list', items: list });
      }
      list.push({
        line: lineNumber,
        text: line.replace(RELEASE_LIST_ITEM, ''),
      });
      return;
    }
    list = null;
    blocks.push(
      standalone ?? { line: lineNumber, kind: 'paragraph', text: line }
    );
  });
  return blocks;
};

const ReleaseMarkdownHeading: React.FC<{
  level: 2 | 3 | 4;
  children: React.ReactNode;
}> = ({ level, children }) => {
  const Tag = `h${level}` as const;
  return <Tag>{children}</Tag>;
};

const ReleaseMarkdownBlockView: React.FC<{
  block: ReleaseMarkdownBlock;
  keyPrefix: string;
}> = ({ block, keyPrefix }) => {
  switch (block.kind) {
    case 'heading':
      return (
        <ReleaseMarkdownHeading level={block.level}>
          {parseInlineReleaseMarkdownNodes(block.text, keyPrefix)}
        </ReleaseMarkdownHeading>
      );
    case 'image':
      return (
        <div className="changelog-image">
          <img src={block.url} alt={block.alt} />
        </div>
      );
    case 'list':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item.line}>
              {parseInlineReleaseMarkdownNodes(
                item.text,
                `${keyPrefix}-${item.line}`
              )}
            </li>
          ))}
        </ul>
      );
    case 'paragraph':
      return <p>{parseInlineReleaseMarkdownNodes(block.text, keyPrefix)}</p>;
  }
};

function ReleaseMarkdown({ content }: { content: string }) {
  const blocks = parseReleaseMarkdownBlocks(content);
  return (
    <>
      {blocks.map((block) => (
        <ReleaseMarkdownBlockView
          key={block.line}
          block={block}
          keyPrefix={`${block.kind}-${block.line}`}
        />
      ))}
    </>
  );
}

const loadBundledChangelogs = (): ChangelogEntry[] => {
  try {
    const releases = getReleasesData();
    const entries: ChangelogEntry[] = [];
    for (const [version, release] of Object.entries(releases)) {
      if (release.content) {
        entries.push({ version, content: release.content });
      }
    }
    return entries.sort((a, b) => compareReleaseVersions(a.version, b.version));
  } catch (error) {
    console.error('Failed to load changelogs:', error);
    return [];
  }
};

export const ReleaseNotesRenderer: React.FC<Props> = ({
  leaf: _leaf,
  view: _view,
}) => {
  
  const plugin = usePlugin();
  const changelogs = useMemo(loadBundledChangelogs, []);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(
    changelogs[0]?.version ?? null
  );

  
  const docsIconRef = useRef<HTMLSpanElement>(null);
  const discordIconRef = useRef<HTMLSpanElement>(null);
  const githubIconRef = useRef<HTMLSpanElement>(null);

  
  useEffect(() => {
    const iconTargets: Array<
      [React.RefObject<HTMLSpanElement | null>, string]
    > = [
      [docsIconRef, 'book-open'],
      [discordIconRef, 'messages-square'],
      [githubIconRef, 'github'],
    ];
    for (const [ref, icon] of iconTargets) {
      if (ref.current) setIcon(ref.current, icon);
    }
  }, []);

  
  if (!plugin) {
    return (
      <div className="release-notes-view">
        <div className="loading">{t('release-notes.loading-plugin')}</div>
      </div>
    );
  }

  return (
    <div className="release-notes-view">
      <div className="release-notes-header">
        <h2>{t('release-notes.title')}</h2>
        <div className="release-notes-header-actions">
          <button
            className="release-notes-action-button"
            onClick={() => openExternalUrl('https://journalit.co/docs')}
          >
            <span ref={docsIconRef} className="button-icon" />
            <span>{t('release-notes.link.docs')}</span>
          </button>
          <button
            className="release-notes-action-button"
            onClick={() => openExternalUrl('https://discord.gg/AkSw3D9h8b')}
          >
            <span ref={discordIconRef} className="button-icon" />
            <span>{t('release-notes.link.discord')}</span>
          </button>
          <button
            className="release-notes-action-button"
            onClick={() =>
              openExternalUrl('https://github.com/Cursivez/journalit')
            }
          >
            <span ref={githubIconRef} className="button-icon" />
            <span>{t('release-notes.link.github')}</span>
          </button>
        </div>
        <div className="current-version">
          {t('release-notes.current-version', {
            version: plugin.manifest.version,
          })}
        </div>
      </div>

      {changelogs.length === 0 ? (
        <div className="no-content">{t('release-notes.no-content')}</div>
      ) : (
        <div className="changelog-list">
          {changelogs.map(({ version, content }) => (
            <Accordion
              key={version}
              title={t('release-notes.version', { version })}
              className="release-notes-accordion"
              expanded={expandedVersion === version}
              onExpandedChange={(expanded) => {
                setExpandedVersion(expanded ? version : null);
              }}
            >
              <div className="changelog-content">
                <ReleaseMarkdown content={content} />
              </div>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
};
