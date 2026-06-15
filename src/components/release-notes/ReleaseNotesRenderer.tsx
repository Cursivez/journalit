

import React, { useState, useEffect, useRef } from 'react';
import { WorkspaceLeaf, setIcon } from 'obsidian';
import { ReleaseNotesView } from './ReleaseNotesView';
import { usePlugin } from '../../hooks/usePlugin';
import releasesData from '../../../changelog/releases.json';
import { t } from '../../lang/helpers';
import { compareReleaseVersions } from './versionSort';
import { openExternalUrl } from '../../utils/externalLinks';
import { Accordion } from '../shared/Accordion';

interface ReleaseEntry {
  title: string;
  description: string;
  imageUrl?: string;
  features: string[];
  content?: string;
}

interface Props {
  leaf: WorkspaceLeaf;
  view: ReleaseNotesView;
}

interface ChangelogEntry {
  version: string;
  content: string;
}

interface ReleaseMarkdownListItem {
  key: string;
  nodes: React.ReactNode[];
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

function ReleaseMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactElement[] = [];
  let listItems: ReleaseMarkdownListItem[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key++}`}>
          {listItems.map((item) => (
            <li key={item.key}>{item.nodes}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    
    if (line.trim() === '') {
      flushList();
      continue;
    }

    
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${key++}`}>
          {parseInlineReleaseMarkdownNodes(line.slice(2), `h2-${key}`)}
        </h2>
      );
      continue;
    }

    
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${key++}`}>
          {parseInlineReleaseMarkdownNodes(line.slice(3), `h3-${key}`)}
        </h3>
      );
      continue;
    }

    
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${key++}`}>
          {parseInlineReleaseMarkdownNodes(line.slice(4), `h4-${key}`)}
        </h4>
      );
      continue;
    }

    
    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      flushList();
      const [, alt, url] = imageMatch;

      
      
      const resolvedUrl = url;

      
      if (url.startsWith('./') || url.startsWith('../')) {
        console.warn(
          '[ReleaseNotes] Relative image paths not supported, use remote URLs:',
          url
        );
      }

      elements.push(
        <div key={`img-${key++}`} className="changelog-image">
          <img src={resolvedUrl} alt={alt} />
        </div>
      );
      continue;
    }

    
    if (line.match(/^[\s]*[-*]\s+/)) {
      const itemContent = line.replace(/^[\s]*[-*]\s+/, '');
      listItems.push({
        key: `li-${key}-${listItems.length}-${itemContent}`,
        nodes: parseInlineReleaseMarkdownNodes(
          itemContent,
          `li-${key}-${listItems.length}`
        ),
      });
      continue;
    }

    
    flushList();
    elements.push(
      <p key={`p-${key++}`}>
        {parseInlineReleaseMarkdownNodes(line, `p-${key}`)}
      </p>
    );
  }

  flushList();

  return <>{elements}</>;
}

export const ReleaseNotesRenderer: React.FC<Props> = ({
  leaf: _leaf,
  view: _view,
}) => {
  
  const plugin = usePlugin();
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  
  const docsIconRef = useRef<HTMLSpanElement>(null);
  const discordIconRef = useRef<HTMLSpanElement>(null);
  const githubIconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!plugin) return;
    loadChangelogs();
  }, [plugin]);

  
  useEffect(() => {
    if (docsIconRef.current) setIcon(docsIconRef.current, 'book-open');
    if (discordIconRef.current)
      setIcon(discordIconRef.current, 'messages-square');
    if (githubIconRef.current) setIcon(githubIconRef.current, 'github');
  }, []);

  
  if (!plugin) {
    return (
      <div className="release-notes-view">
        <div className="loading">{t('release-notes.loading-plugin')}</div>
      </div>
    );
  }

  const loadChangelogs = () => {
    try {
      setLoading(true);

      
      const releases = releasesData as Record<string, ReleaseEntry>;

      
      const entries: ChangelogEntry[] = [];
      for (const [version, release] of Object.entries(releases)) {
        if (release.content) {
          entries.push({
            version,
            content: release.content,
          });
        }
      }

      
      entries.sort((a, b) => compareReleaseVersions(a.version, b.version));

      setChangelogs(entries);

      
      if (entries.length > 0) {
        setExpandedVersion(entries[0].version);
      }
    } catch (error) {
      console.error('Failed to load changelogs:', error);
      setChangelogs([]);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <div className="loading">{t('release-notes.loading')}</div>
      ) : changelogs.length === 0 ? (
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
