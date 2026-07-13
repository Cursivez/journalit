import React, { memo, useCallback, useEffect, useReducer, useRef } from 'react';
import { Component, MarkdownRenderer, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import {
  readFileContentForMutation,
  replaceFileContent,
} from '../../utils/fileMutation';
import {
  isExcalidrawFile,
  resolveVaultMediaFile,
} from '../../utils/imageMediaUtils';
import { ExcalidrawMediaEmbed } from '../image/ExcalidrawMediaEmbed';

interface EmbeddedMarkdownNoteProps {
  plugin: JournalitPlugin;
  filePath: string;
  className?: string;
  contentClassName?: string;
  allowCheckboxToggle?: boolean;
  stripFrontmatter?: boolean;
  emptyMessage?: string;
  sourcePath?: string;
  onOpenMedia?: (path: string) => void;
  onContentStateChange?: (hasContent: boolean) => void;
  onFileRename?: (file: TFile, oldPath: string) => void | Promise<void>;
}

interface EmbeddedMarkdownNoteState {
  content: string;
  error: string | null;
  isLoading: boolean;
  file: TFile | null;
  isExcalidraw: boolean;
}

type EmbeddedMarkdownNoteAction =
  | { type: 'loading' }
  | { type: 'not-found'; error: string }
  | { type: 'excalidraw'; file: TFile }
  | { type: 'content'; file: TFile; content: string }
  | { type: 'error'; error: string }
  | { type: 'deleted'; error: string };

const INITIAL_EMBEDDED_MARKDOWN_NOTE_STATE: EmbeddedMarkdownNoteState = {
  content: '',
  error: null,
  isLoading: true,
  file: null,
  isExcalidraw: false,
};

function embeddedMarkdownNoteReducer(
  state: EmbeddedMarkdownNoteState,
  action: EmbeddedMarkdownNoteAction
): EmbeddedMarkdownNoteState {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true, error: null };
    case 'not-found':
      return {
        content: '',
        error: action.error,
        isLoading: false,
        file: null,
        isExcalidraw: false,
      };
    case 'excalidraw':
      return {
        content: '',
        error: null,
        isLoading: false,
        file: action.file,
        isExcalidraw: true,
      };
    case 'content':
      return {
        content: action.content,
        error: null,
        isLoading: false,
        file: action.file,
        isExcalidraw: false,
      };
    case 'error':
    case 'deleted':
      return {
        content: '',
        error: action.error,
        isLoading: false,
        file: null,
        isExcalidraw: false,
      };
  }
}

export const EmbeddedMarkdownNote = memo<EmbeddedMarkdownNoteProps>(
  ({
    plugin,
    filePath,
    className,
    contentClassName,
    allowCheckboxToggle = true,
    stripFrontmatter = true,
    emptyMessage = '',
    sourcePath = '',
    onOpenMedia,
    onContentStateChange,
    onFileRename,
  }) => {
    const [{ content, error, isLoading, file, isExcalidraw }, dispatch] =
      useReducer(
        embeddedMarkdownNoteReducer,
        INITIAL_EMBEDDED_MARKDOWN_NOTE_STATE
      );
    const containerRef = useRef<HTMLDivElement>(null);

    const loadContent = useCallback(async () => {
      try {
        dispatch({ type: 'loading' });

        const resolvedFile = resolveVaultMediaFile(
          plugin.app,
          filePath,
          sourcePath
        );
        if (!(resolvedFile instanceof TFile)) {
          onContentStateChange?.(false);
          dispatch({
            type: 'not-found',
            error: t('home.widget.embedded-note.error.not-found', {
              path: filePath,
            }),
          });
          return;
        }

        if (isExcalidrawFile(resolvedFile, plugin.app)) {
          onContentStateChange?.(true);
          dispatch({ type: 'excalidraw', file: resolvedFile });
          return;
        }

        const fileContent = await plugin.app.vault.read(resolvedFile);
        if (isExcalidrawMarkdownContent(fileContent)) {
          onContentStateChange?.(true);
          dispatch({ type: 'excalidraw', file: resolvedFile });
          return;
        }

        const renderedContent = stripFrontmatter
          ? fileContent.replace(/^---[\s\S]*?---\n*/, '')
          : fileContent;
        onContentStateChange?.(renderedContent.trim().length > 0);
        dispatch({
          type: 'content',
          file: resolvedFile,
          content: renderedContent,
        });
      } catch (err) {
        console.error('Failed to load embedded note:', err);
        onContentStateChange?.(false);
        dispatch({
          type: 'error',
          error: t('home.widget.embedded-note.error.load-failed'),
        });
      }
    }, [
      filePath,
      onContentStateChange,
      plugin.app,
      sourcePath,
      stripFrontmatter,
    ]);

    useEffect(() => {
      void loadContent();
    }, [loadContent]);

    
    useEffect(() => {
      const handleModify = (modifiedFile: TFile) => {
        if (modifiedFile.path === file?.path) void loadContent();
      };

      const handleDelete = (deletedFile: TFile) => {
        if (deletedFile.path === file?.path) {
          onContentStateChange?.(false);
          dispatch({
            type: 'deleted',
            error: t('home.widget.embedded-note.error.deleted'),
          });
        }
      };

      const handleRename = (renamedFile: TFile, oldPath: string) => {
        if (renamedFile !== file && oldPath !== filePath) return;
        void Promise.resolve(onFileRename?.(renamedFile, oldPath)).catch(
          (err: unknown) => {
            console.error('Failed to handle embedded note rename:', err);
          }
        );
      };

      const modifyRef = plugin.app.vault.on('modify', handleModify);
      const deleteRef = plugin.app.vault.on('delete', handleDelete);
      const renameRef = plugin.app.vault.on('rename', handleRename);

      return () => {
        plugin.app.vault.offref(modifyRef);
        plugin.app.vault.offref(deleteRef);
        plugin.app.vault.offref(renameRef);
      };
    }, [
      file,
      filePath,
      loadContent,
      onContentStateChange,
      onFileRename,
      plugin.app.vault,
    ]);

    const toggleCheckbox = useCallback(
      async (lineIndex: number) => {
        if (!file || !allowCheckboxToggle) return;

        try {
          const fileContent = await readFileContentForMutation(
            plugin.app,
            file
          );
          const lines = fileContent.split('\n');
          let taskLineIndex = 0;
          let inFrontmatter = false;
          let targetLineIndex = -1;

          for (let i = 0; i < lines.length; i += 1) {
            const line = lines[i];
            if (i === 0 && line === '---') {
              inFrontmatter = true;
              continue;
            }
            if (inFrontmatter && line === '---') {
              inFrontmatter = false;
              continue;
            }
            if (inFrontmatter) continue;

            const taskMatch = line.match(/^(\s*[-*]\s*)\[([ xX])\]/);
            if (!taskMatch) continue;

            if (taskLineIndex === lineIndex) {
              targetLineIndex = i;
              break;
            }

            taskLineIndex += 1;
          }

          if (targetLineIndex === -1) return;

          const targetLine = lines[targetLineIndex];
          const targetTaskMatch = targetLine.match(/^(\s*[-*]\s*)\[([ xX])\]/);
          if (!targetTaskMatch) return;

          const isChecked = targetTaskMatch[2].toLowerCase() === 'x';
          lines[targetLineIndex] = targetLine.replace(
            /\[([ xX])\]/,
            `[${isChecked ? ' ' : 'x'}]`
          );
          await replaceFileContent(plugin.app, file, lines.join('\n'));
        } catch (err) {
          console.error('Failed to toggle checkbox:', err);
        }
      },
      [allowCheckboxToggle, file, plugin.app]
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !content || error || !file) return;

      const renderComponent = new Component();
      renderComponent.load();
      container.empty();
      void MarkdownRenderer.render(
        plugin.app,
        content,
        container,
        file.path,
        renderComponent
      );

      const checkboxHandlers: Array<{
        checkbox: Element;
        handler: EventListener;
      }> = [];
      const timeoutId = allowCheckboxToggle
        ? window.setTimeout(() => {
            const checkboxes = container.querySelectorAll(
              'input.task-list-item-checkbox'
            );
            checkboxes.forEach((checkbox, index) => {
              const handler: EventListener = (event) => {
                event.preventDefault();
                event.stopPropagation();
                void toggleCheckbox(index);
              };
              checkbox.addEventListener('click', handler);
              checkboxHandlers.push({ checkbox, handler });
            });
          }, 50)
        : null;

      return () => {
        if (timeoutId !== null) window.clearTimeout(timeoutId);
        checkboxHandlers.forEach(({ checkbox, handler }) => {
          checkbox.removeEventListener('click', handler);
        });
        renderComponent.unload();
      };
    }, [
      allowCheckboxToggle,
      content,
      error,
      file,
      filePath,
      plugin.app,
      toggleCheckbox,
    ]);

    const rootClassName = className
      ? `journalit-embedded-markdown-note ${className}`
      : 'journalit-embedded-markdown-note';
    const contentClasses = contentClassName
      ? `journalit-embedded-note-content markdown-rendered ${contentClassName}`
      : 'journalit-embedded-note-content markdown-rendered';

    if (isLoading) {
      return <div className={rootClassName}>{t('common.loading')}</div>;
    }

    if (error) {
      return <div className={rootClassName}>{error}</div>;
    }

    if (file && isExcalidraw) {
      const embed = (
        <ExcalidrawMediaEmbed path={file.path} sourcePath={sourcePath} />
      );
      return (
        <div className={rootClassName}>
          {onOpenMedia ? (
            <div
              className="journalit-embedded-markdown-note__media-button"
              onClick={() => onOpenMedia(file.path)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                onOpenMedia(file.path);
              }}
              role="button"
              tabIndex={0}
              aria-label={t('image.viewer.title-fullscreen')}
            >
              {embed}
            </div>
          ) : (
            embed
          )}
        </div>
      );
    }

    if (!content.trim()) {
      return <div className={rootClassName}>{emptyMessage}</div>;
    }

    return <div ref={containerRef} className={contentClasses} />;
  }
);

EmbeddedMarkdownNote.displayName = 'EmbeddedMarkdownNote';

function isExcalidrawMarkdownContent(content: string): boolean {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  return Boolean(frontmatterMatch?.[1].includes('excalidraw-plugin'));
}
