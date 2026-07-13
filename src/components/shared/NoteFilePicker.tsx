import React, { memo, useMemo, useState } from 'react';
import type { TFile } from 'obsidian';
import { t } from '../../lang/helpers';
import { FileText } from './icons/ObsidianIcon';

interface NoteFilePickerProps {
  files: TFile[];
  title: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showHeader?: boolean;
  onSelectFile: (file: TFile) => void;
  onCancel?: () => void;
}

export const NoteFilePicker = memo<NoteFilePickerProps>(
  ({
    files,
    title,
    searchPlaceholder = t('home.widget.embedded-note.search-placeholder'),
    emptyMessage = t('home.widget.embedded-note.no-notes'),
    showHeader = true,
    onSelectFile,
    onCancel,
  }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredFiles = useMemo(
      () =>
        searchQuery
          ? files.filter(
              (file) =>
                file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                file.basename.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : files,
      [files, searchQuery]
    );

    return (
      <div className="journalit-note-file-picker">
        {showHeader ? (
          <div className="journalit-note-file-picker__header">
            <div className="journalit-note-file-picker__header-label">
              {title}
            </div>
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="journalit-note-file-picker__cancel-button"
              >
                {t('button.cancel')}
              </button>
            ) : null}
          </div>
        ) : null}

        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="journalit-note-file-picker__search"
        />

        <div className="journalit-note-file-picker__file-list">
          {filteredFiles.length === 0 ? (
            <div className="journalit-note-file-picker__file-empty">
              {emptyMessage}
            </div>
          ) : (
            filteredFiles.slice(0, 60).map((file) => (
              <div
                key={file.path}
                role="button"
                tabIndex={0}
                onClick={() => onSelectFile(file)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  onSelectFile(file);
                }}
                className="jl-recent-item-hover journalit-note-file-picker__file-item"
              >
                <FileText
                  size={14}
                  className="journalit-note-file-picker__file-icon"
                />
                <div className="journalit-note-file-picker__file-text">
                  <div className="journalit-note-file-picker__file-name">
                    {file.basename}
                  </div>
                  <div className="journalit-note-file-picker__file-path">
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
);

NoteFilePicker.displayName = 'NoteFilePicker';
