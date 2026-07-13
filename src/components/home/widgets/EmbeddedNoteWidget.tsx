

import React, { memo, useState, useCallback, useMemo, useReducer } from 'react';
import { TFile } from 'obsidian';
import { FolderOpen } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { EmbeddedNoteConfig } from '../../../settings/types';
import { t } from '../../../lang/helpers';
import { EmbeddedMarkdownNote } from '../../shared/EmbeddedMarkdownNote';
import { NoteFilePicker } from '../../shared/NoteFilePicker';

interface EmbeddedNoteWidgetProps {
  plugin: JournalitPlugin;
  instanceId: string;
}

export const EmbeddedNoteWidget = memo<EmbeddedNoteWidgetProps>(
  ({ plugin, instanceId }) => {
    const [showFilePicker, setShowFilePicker] = useState(false);
    const [, refreshConfig] = useReducer((version: number) => version + 1, 0);

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
      },
      [instanceId, plugin]
    );

    const handleFileRename = useCallback(
      async (file: TFile, oldPath: string) => {
        const embeddedNotes = plugin.settings.home?.embeddedNotes;
        const currentConfig = embeddedNotes?.[instanceId];
        if (!currentConfig || currentConfig.filePath !== oldPath) return;

        embeddedNotes[instanceId] = {
          ...currentConfig,
          filePath: file.path,
        };
        refreshConfig();

        try {
          await plugin.saveSettings();
        } catch (err) {
          console.error('Failed to save renamed embedded note path:', err);
        }
      },
      [instanceId, plugin]
    );

    const displayTitle =
      customTitle ||
      (filePath
        ? filePath.split('/').pop()?.replace('.md', '')
        : t('home.widget.embedded-note.title'));

    if (showFilePicker || !filePath) {
      return (
        <div className="journalit-home-embedded-note journalit-home-embedded-note--picker">
          <NoteFilePicker
            files={allFiles}
            title={t('home.widget.embedded-note.select-note')}
            onSelectFile={(file) => void handleSelectFile(file)}
            onCancel={filePath ? () => setShowFilePicker(false) : undefined}
          />
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
            onClick={() => void plugin.openFile(filePath, true)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              void plugin.openFile(filePath, true);
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

        <EmbeddedMarkdownNote
          key={filePath}
          plugin={plugin}
          filePath={filePath}
          contentClassName="journalit-home-embedded-note__content"
          onFileRename={handleFileRename}
        />
      </div>
    );
  }
);

EmbeddedNoteWidget.displayName = 'EmbeddedNoteWidget';
