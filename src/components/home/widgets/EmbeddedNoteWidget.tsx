

import React, {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { TFile, MarkdownRenderer, Component } from 'obsidian';
import {
  FileText,
  Settings,
  AlertCircle,
  FolderOpen,
} from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { EmbeddedNoteConfig } from '../../../settings/types';
import { SkeletonText } from '../../shared/SkeletonText';
import { t } from '../../../lang/helpers';
import {
  readFileContentForMutation,
  replaceFileContent,
} from '../../../utils/fileMutation';

interface EmbeddedNoteWidgetProps {
  plugin: JournalitPlugin;
  instanceId: string;
}

export const EmbeddedNoteWidget = memo<EmbeddedNoteWidgetProps>(
  ({ plugin, instanceId }) => {
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilePicker, setShowFilePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const componentRef = useRef<Component | null>(null);

    
    const config: EmbeddedNoteConfig | undefined =
      plugin.settings.home?.embeddedNotes?.[instanceId];
    const filePath = config?.filePath;
    const customTitle = config?.title;

    
    const allFiles = useMemo(
      () =>
        plugin.app.vault
          .getMarkdownFiles()
          .sort((a, b) => a.path.localeCompare(b.path)),
      [plugin.app.vault]
    );

    const filteredFiles = useMemo(
      () =>
        searchQuery
          ? allFiles.filter(
              (f) =>
                f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.basename.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : allFiles,
      [allFiles, searchQuery]
    );

    
    const loadContent = useCallback(async () => {
      if (!filePath) {
        setIsLoading(false);
        setContent('');
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const file = plugin.app.vault.getAbstractFileByPath(filePath);
        if (!(file instanceof TFile)) {
          setError(
            t('home.widget.embedded-note.error.not-found', { path: filePath })
          );
          setContent('');
          return;
        }

        const fileContent = await plugin.app.vault.read(file);

        
        const contentWithoutFrontmatter = fileContent.replace(
          /^---[\s\S]*?---\n*/,
          ''
        );
        setContent(contentWithoutFrontmatter);
      } catch (err) {
        console.error('Failed to load embedded note:', err);
        setError(t('home.widget.embedded-note.error.load-failed'));
        setContent('');
      } finally {
        setIsLoading(false);
      }
    }, [filePath, plugin.app.vault]);

    
    useEffect(() => {
      void loadContent();
    }, [loadContent]);

    
    
    useEffect(() => {
      if (!filePath) return;

      const handleModify = (file: TFile) => {
        if (file.path === filePath) {
          void loadContent();
        }
      };

      const handleDelete = (file: TFile) => {
        if (file.path === filePath) {
          setError(t('home.widget.embedded-note.error.deleted'));
          setContent('');
        }
      };

      const handleRename = async (file: TFile, oldPath: string) => {
        if (oldPath === filePath && plugin.settings.home?.embeddedNotes) {
          
          plugin.settings.home.embeddedNotes[instanceId] = {
            ...plugin.settings.home.embeddedNotes[instanceId],
            filePath: file.path,
          };
          await plugin.saveSettings();
        }
      };

      const modifyRef = plugin.app.vault.on('modify', handleModify);
      const deleteRef = plugin.app.vault.on('delete', handleDelete);
      const renameRef = plugin.app.vault.on('rename', handleRename);

      return () => {
        plugin.app.vault.offref(modifyRef);
        plugin.app.vault.offref(deleteRef);
        plugin.app.vault.offref(renameRef);
      };
    }, [filePath, instanceId, loadContent, plugin]);

    
    const toggleCheckbox = useCallback(
      async (lineIndex: number) => {
        if (!filePath) return;

        try {
          const file = plugin.app.vault.getAbstractFileByPath(filePath);
          if (!(file instanceof TFile)) return;

          const fileContent = await readFileContentForMutation(
            plugin.app,
            file
          );
          const lines = fileContent.split('\n');

          
          let taskLineIndex = 0;
          let inFrontmatter = false;

          for (let i = 0; i < lines.length; i++) {
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
            if (taskMatch) {
              if (taskLineIndex === lineIndex) {
                
                const isChecked = taskMatch[2].toLowerCase() === 'x';
                const newState = isChecked ? ' ' : 'x';
                lines[i] = line.replace(/\[([ xX])\]/, `[${newState}]`);

                
                await replaceFileContent(plugin.app, file, lines.join('\n'));
                return;
              }
              taskLineIndex++;
            }
          }
        } catch (err) {
          console.error('Failed to toggle checkbox:', err);
        }
      },
      [filePath, plugin.app]
    );

    
    
    
    useEffect(() => {
      const container = containerRef.current;
      if (!container || !content || error || showFilePicker) return;

      
      if (!componentRef.current) {
        componentRef.current = new Component();
        componentRef.current.load();
      }

      
      container.empty();

      
      void MarkdownRenderer.render(
        plugin.app,
        content,
        container,
        filePath || '',
        componentRef.current
      );

      
      const checkboxHandlers: Array<{
        checkbox: Element;
        handler: EventListener;
      }> = [];

      const timeoutId = window.setTimeout(() => {
        const checkboxes = container.querySelectorAll(
          'input.task-list-item-checkbox'
        );
        checkboxes.forEach((checkbox, index) => {
          
          
          const handler: EventListener = (e) => {
            e.preventDefault();
            e.stopPropagation();
            void toggleCheckbox(index);
          };
          checkbox.addEventListener('click', handler);
          checkboxHandlers.push({ checkbox, handler });
        });
      }, 50);

      return () => {
        window.clearTimeout(timeoutId);
        checkboxHandlers.forEach(({ checkbox, handler }) => {
          checkbox.removeEventListener('click', handler);
        });
      };
    }, [content, filePath, plugin.app, error, toggleCheckbox, showFilePicker]);

    
    useEffect(() => {
      return () => {
        if (componentRef.current) {
          componentRef.current.unload();
          componentRef.current = null;
        }
      };
    }, []);

    
    const handleSelectFile = useCallback(
      async (file: TFile) => {
        if (!plugin.settings.home) {
          plugin.settings.home = {
            layouts: { Default: { lg: [], md: [], sm: [], xs: [], xxs: [] } },
            activeLayout: 'Default',
          };
        }
        if (!plugin.settings.home.embeddedNotes) {
          plugin.settings.home.embeddedNotes = {};
        }

        plugin.settings.home.embeddedNotes[instanceId] = {
          filePath: file.path,
          title: plugin.settings.home.embeddedNotes[instanceId]?.title,
        };

        try {
          await plugin.saveSettings();
        } catch (err) {
          console.error('Failed to save embedded note settings:', err);
        }

        setShowFilePicker(false);
        setSearchQuery('');
      },
      [instanceId, plugin]
    );

    
    const displayTitle =
      customTitle ||
      (filePath
        ? filePath.split('/').pop()?.replace('.md', '')
        : t('home.widget.embedded-note.title'));

    
    if (showFilePicker || (!filePath && !isLoading)) {
      return (
        <div className="journalit-home-embedded-note journalit-home-embedded-note--picker">
          <div className="journalit-home-embedded-note__header">
            <div className="journalit-home-widget__eyebrow journalit-home-embedded-note__header-label">
              {t('home.widget.embedded-note.select-note')}
            </div>
            {filePath && (
              <button
                onClick={() => setShowFilePicker(false)}
                className="journalit-home-embedded-note__cancel-button"
              >
                {t('button.cancel')}
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder={t('home.widget.embedded-note.search-placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="journalit-home-embedded-note__search"
          />

          <div className="journalit-home-embedded-note__file-list">
            {filteredFiles.length === 0 ? (
              <div className="journalit-home-embedded-note__file-empty">
                {t('home.widget.embedded-note.no-notes')}
              </div>
            ) : (
              filteredFiles.slice(0, 50).map((file) => (
                <div
                  key={file.path}
                  role="button"
                  tabIndex={0}
                  onClick={() => void handleSelectFile(file)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    void handleSelectFile(file);
                  }}
                  className="jl-recent-item-hover journalit-home-embedded-note__file-item"
                >
                  <FileText
                    size={14}
                    className="journalit-home-embedded-note__file-icon"
                  />
                  <div className="journalit-home-embedded-note__file-text">
                    <div className="journalit-home-embedded-note__file-name">
                      {file.basename}
                    </div>
                    <div className="journalit-home-embedded-note__file-path">
                      {file.path}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    
    if (isLoading) {
      return (
        <div className="journalit-home-embedded-note journalit-home-embedded-note--loading">
          
          <div className="journalit-home-embedded-note__header journalit-home-embedded-note__header--spaced">
            <SkeletonText width="100px" height="11px" />
            <SkeletonText width="14px" height="14px" />
          </div>

          
          <div className="journalit-home-embedded-note__loading-content">
            <SkeletonText width="90%" height="13px" />
            <SkeletonText width="100%" height="13px" />
            <SkeletonText width="75%" height="13px" />
            <SkeletonText width="85%" height="13px" />
            <SkeletonText width="60%" height="13px" />
          </div>
        </div>
      );
    }

    
    if (error) {
      return (
        <div className="journalit-home-embedded-note journalit-home-embedded-note--error">
          <div className="journalit-home-embedded-note__header journalit-home-embedded-note__header--spaced">
            <div className="journalit-home-widget__eyebrow journalit-home-embedded-note__header-label">
              {displayTitle}
            </div>
            <button
              onClick={() => setShowFilePicker(true)}
              className="clickable-icon journalit-home-embedded-note__icon-button"
              aria-label={t('home.widget.embedded-note.change-note')}
            >
              <Settings size={14} />
            </button>
          </div>

          <div className="journalit-home-embedded-note__error-content">
            <AlertCircle size={24} />
            <div className="journalit-home-embedded-note__error-message">
              {error}
            </div>
            <button
              onClick={() => setShowFilePicker(true)}
              className="journalit-home-embedded-note__error-button"
            >
              {t('home.widget.embedded-note.select-different')}
            </button>
          </div>
        </div>
      );
    }

    
    return (
      <div className="journalit-home-embedded-note">
        
        <div className="journalit-home-embedded-note__header journalit-home-embedded-note__header--spaced">
          <div
            className="journalit-home-widget__eyebrow journalit-home-embedded-note__header-label journalit-home-embedded-note__header-label--interactive"
            role="button"
            tabIndex={0}
            onClick={() => {
              if (filePath) void plugin.openFile(filePath, true);
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              if (filePath) {
                void plugin.openFile(filePath, true);
              }
            }}
            aria-label={t('home.widget.embedded-note.open-note')}
          >
            {displayTitle}
          </div>
          <button
            onClick={() => setShowFilePicker(true)}
            className="jl-icon-button-hover clickable-icon journalit-home-embedded-note__icon-button"
            aria-label={t('home.widget.embedded-note.change-note')}
          >
            <FolderOpen size={14} />
          </button>
        </div>

        <div
          ref={containerRef}
          className="journalit-embedded-note-content markdown-rendered journalit-home-embedded-note__content"
        />
      </div>
    );
  }
);

EmbeddedNoteWidget.displayName = 'EmbeddedNoteWidget';
