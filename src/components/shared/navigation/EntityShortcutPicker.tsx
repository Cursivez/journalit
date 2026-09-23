import React, { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { List, type RowComponentProps } from 'react-window';

import type {
  EntityShortcut,
  EntityShortcutTarget,
} from '../../../settings/types';
import {
  entityShortcutTargetKey,
  type EntityShortcutCatalogItem,
} from '../../../hooks/useEntityShortcutCatalog';
import { t } from '../../../lang/helpers';
import { resolveIcon } from '../../../utils/iconResolver';
import { virtualItemStyle } from '../../../styles/inlineStylePolicy';
import { Check, Plus, Search, X } from '../icons/ObsidianIcon';

const VIRTUALIZATION_THRESHOLD = 30;
const VIRTUAL_ROW_HEIGHT = 44;

interface EntityShortcutPickerProps {
  shortcuts: EntityShortcut[];
  items: EntityShortcutCatalogItem[];
  loading: boolean;
  error: string | null;
  onAdd: (target: EntityShortcutTarget) => void | Promise<void>;
  onClose: () => void;
}

type ShortcutPickerRow =
  | {
      type: 'section';
      id: 'accounts' | 'setups';
      title: string;
      count: number;
      spaced: boolean;
    }
  | { type: 'item'; item: EntityShortcutCatalogItem };

interface VirtualShortcutRowProps {
  rows: ShortcutPickerRow[];
  existingKeys: ReadonlySet<string>;
  onAdd: (target: EntityShortcutTarget) => void | Promise<void>;
}

export const EntityShortcutPicker: React.FC<EntityShortcutPickerProps> = ({
  shortcuts,
  items,
  loading,
  error,
  onAdd,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const onCloseEvent = useEffectEvent(onClose);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onCloseEvent();
    };
    window.activeDocument.addEventListener('keydown', handleEscape, true);
    return () =>
      window.activeDocument.removeEventListener('keydown', handleEscape, true);
  }, []);
  const existingKeys = useMemo(
    () =>
      new Set(shortcuts.map(({ target }) => entityShortcutTargetKey(target))),
    [shortcuts]
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          !normalizedQuery ||
          item.label.toLocaleLowerCase().includes(normalizedQuery)
      ),
    [items, normalizedQuery]
  );
  const rows = useMemo(() => {
    const accountItems = filteredItems.filter(
      (item) => item.target.kind === 'account'
    );
    const setupItems = filteredItems.filter(
      (item) => item.target.kind === 'setup'
    );
    const pickerRows: ShortcutPickerRow[] = [];
    if (accountItems.length > 0) {
      pickerRows.push({
        type: 'section',
        id: 'accounts',
        title: t('navigation.shortcuts.accounts'),
        count: accountItems.length,
        spaced: false,
      });
      pickerRows.push(
        ...accountItems.map(
          (item): ShortcutPickerRow => ({
            type: 'item',
            item,
          })
        )
      );
    }
    if (setupItems.length > 0) {
      pickerRows.push({
        type: 'section',
        id: 'setups',
        title: t('navigation.shortcuts.setups'),
        count: setupItems.length,
        spaced: accountItems.length > 0,
      });
      pickerRows.push(
        ...setupItems.map(
          (item): ShortcutPickerRow => ({
            type: 'item',
            item,
          })
        )
      );
    }
    return pickerRows;
  }, [filteredItems]);
  const virtualRowProps = useMemo<VirtualShortcutRowProps>(
    () => ({ rows, existingKeys, onAdd }),
    [existingKeys, onAdd, rows]
  );
  const shouldVirtualize = items.length >= VIRTUALIZATION_THRESHOLD;

  return (
    <div
      className="journalit-shared-selector-overlay journalit-entity-shortcut-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`journalit-shared-selector-modal journalit-entity-shortcut-picker${shouldVirtualize ? ' journalit-entity-shortcut-picker--virtualized' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="journalit-entity-shortcut-picker-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className="journalit-shared-selector-header">
          <span
            id="journalit-entity-shortcut-picker-title"
            className="journalit-shared-selector-title"
          >
            {t('navigation.shortcuts.add')}
          </span>
          <button
            type="button"
            className="journalit-shared-selector-close"
            aria-label={t('navigation.shortcuts.close')}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="journalit-nav-search">
          <div className="journalit-nav-search-input-wrapper">
            <div className="journalit-nav-search-icon">
              <Search size={14} aria-hidden="true" />
            </div>
            <input
              className="journalit-nav-search-input"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('navigation.shortcuts.search')}
              aria-label={t('navigation.shortcuts.search')}
              autoFocus
            />
            {query && (
              <button
                className="journalit-nav-search-clear"
                type="button"
                aria-label={t('navigation.search.clear')}
                onClick={() => setQuery('')}
              >
                <X size={12} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div
          className={`journalit-shared-selector-content${shouldVirtualize ? ' journalit-entity-shortcut-virtual-host' : ''}`}
        >
          {loading && (
            <div className="journalit-shared-selector-empty">
              {t('common.loading')}
            </div>
          )}
          {!loading && error && (
            <div className="journalit-shared-selector-empty">{error}</div>
          )}
          {!loading && shouldVirtualize && rows.length > 0 && (
            <List
              className="journalit-entity-shortcut-virtual-list"
              defaultHeight={480}
              rowComponent={VirtualShortcutRow}
              rowCount={rows.length}
              rowHeight={VIRTUAL_ROW_HEIGHT}
              rowProps={virtualRowProps}
              overscanCount={4}
            />
          )}
          {!loading &&
            !shouldVirtualize &&
            rows.map((row) =>
              row.type === 'section' ? (
                <ShortcutSectionHeader
                  key={`section:${row.id}`}
                  title={row.title}
                  count={row.count}
                  spaced={row.spaced}
                />
              ) : (
                <ShortcutOption
                  key={entityShortcutTargetKey(row.item.target)}
                  item={row.item}
                  selected={existingKeys.has(
                    entityShortcutTargetKey(row.item.target)
                  )}
                  onAdd={onAdd}
                />
              )
            )}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="journalit-shared-selector-empty">
              {t('navigation.shortcuts.empty')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function VirtualShortcutRow({
  index,
  style,
  rows,
  existingKeys,
  onAdd,
  ariaAttributes,
}: RowComponentProps<VirtualShortcutRowProps>): React.ReactElement {
  const row = rows[index];
  if (row.type === 'section') {
    return (
      <div style={virtualItemStyle(style)} {...ariaAttributes}>
        <ShortcutSectionHeader
          title={row.title}
          count={row.count}
          spaced={row.spaced}
        />
      </div>
    );
  }
  return (
    <div style={virtualItemStyle(style)} {...ariaAttributes}>
      <ShortcutOption
        item={row.item}
        selected={existingKeys.has(entityShortcutTargetKey(row.item.target))}
        onAdd={onAdd}
      />
    </div>
  );
}

interface ShortcutSectionHeaderProps {
  title: string;
  count: number;
  spaced?: boolean;
}

const ShortcutSectionHeader: React.FC<ShortcutSectionHeaderProps> = ({
  title,
  count,
  spaced = false,
}) => (
  <div
    className={`journalit-shared-selector-section journalit-entity-shortcut-section${spaced ? ' journalit-shared-selector-section--spaced' : ''}`}
  >
    <span>{title}</span>
    <span className="journalit-entity-shortcut-count">{count}</span>
  </div>
);

interface ShortcutOptionProps {
  item: EntityShortcutCatalogItem;
  selected: boolean;
  onAdd: (target: EntityShortcutTarget) => void | Promise<void>;
}

const ShortcutOption: React.FC<ShortcutOptionProps> = ({
  item,
  selected,
  onAdd,
}) => {
  const IconComponent = resolveIcon(item.icon);
  return (
    <button
      type="button"
      className={`journalit-native-button journalit-native-button--unstyled journalit-shared-selector-item journalit-entity-shortcut-option${selected ? ' journalit-entity-shortcut-option--selected' : ''}`}
      disabled={selected}
      onClick={() => void onAdd(item.target)}
    >
      <span className="journalit-shared-selector-icon">
        <IconComponent size={16} aria-hidden="true" />
      </span>
      <span className="journalit-shared-selector-body">
        <span className="journalit-shared-selector-item-title">
          {item.label}
          {selected ? ` (${t('navigation.shortcuts.added')})` : ''}
        </span>
      </span>
      <span className="journalit-entity-shortcut-action" aria-hidden="true">
        {selected ? <Check size={15} /> : <Plus size={15} />}
      </span>
    </button>
  );
};
