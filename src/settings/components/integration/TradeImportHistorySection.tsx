import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Menu } from 'obsidian';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
} from '../../../components/shared/icons/ObsidianIcon';
import { showConfirmationModal } from '../../../components/shared/ConfirmationModal';
import { Button } from '../../../components/ui';
import { IconButton } from '../../../components/ui/IconButton';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import {
  TradeImportManagementClient,
  type TradeImportHistoryEntry,
} from '../../../services/tradeImport/TradeImportManagementClient';
import { deleteTradeImportFromServer } from '../../../services/tradeImport/tradeImportServerDeletion';
import { syncServerDeletedTrades } from '../../../services/tradeSync/ServerDeletedTradeSync';
import { formatLocalizedDateTime } from '../../../utils/localizedDateTime';
import { logger } from '../../../utils/logger';

interface HistoryState {
  status: 'loading' | 'loaded' | 'failed';
  imports: TradeImportHistoryEntry[];
  nextCursor: string | null;
  deletingImportId: string | null;
  loadingMore: boolean;
}

type HistoryAction =
  | { type: 'reload' }
  | {
      type: 'loaded';
      imports: TradeImportHistoryEntry[];
      nextCursor: string | null;
      append: boolean;
    }
  | { type: 'failed' }
  | { type: 'load-more' }
  | { type: 'deleting'; importId: string | null };

const initialState: HistoryState = {
  status: 'loading',
  imports: [],
  nextCursor: null,
  deletingImportId: null,
  loadingMore: false,
};

function historyReducer(
  state: HistoryState,
  action: HistoryAction
): HistoryState {
  switch (action.type) {
    case 'reload':
      return { ...state, status: 'loading' };
    case 'loaded':
      return {
        ...state,
        status: 'loaded',
        imports: action.append
          ? [...state.imports, ...action.imports]
          : action.imports,
        nextCursor: action.nextCursor,
        loadingMore: false,
      };
    case 'failed':
      return { ...state, status: 'failed', loadingMore: false };
    case 'load-more':
      return { ...state, loadingMore: true };
    case 'deleting':
      return { ...state, deletingImportId: action.importId };
  }
}

interface TradeImportHistorySectionProps {
  plugin: JournalitPlugin;
  
  onDeleted: () => void;
  
  defaultOpen?: boolean;
  
  revision: number;
}


export const TradeImportHistorySection: React.FC<
  TradeImportHistorySectionProps
> = ({ plugin, onDeleted, defaultOpen = false, revision }) => {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  const [open, setOpen] = useState(defaultOpen);
  const client = React.useMemo(() => new TradeImportManagementClient(), []);

  const loadPage = useCallback(
    async (before: string | null) => {
      try {
        const page = await client.listImportHistory(before);
        dispatch({
          type: 'loaded',
          imports: page.imports,
          nextCursor: page.nextCursor,
          append: before !== null,
        });
      } catch (error) {
        logger.error('Trade Import history load failed', error);
        dispatch({ type: 'failed' });
      }
    },
    [client]
  );

  useEffect(() => {
    void loadPage(null);
  }, [loadPage, revision]);

  useEffect(() => {
    
    
    void syncServerDeletedTrades(plugin).catch((error: unknown) => {
      logger.warn('Server-deleted trade cleanup failed', error);
    });
  }, [plugin]);

  const deleteImport = async (entry: TradeImportHistoryEntry) => {
    const confirmed = await showConfirmationModal(plugin.app, {
      title: t('trade-import.history.delete.title'),
      message: t('trade-import.history.delete.message', {
        count: String(entry.liveTradeCount),
        account: entry.accountDisplayName,
      }),
      confirmLabel: t('trade-import.history.delete.confirm'),
      cancelLabel: t('button.cancel'),
      destructive: true,
    });
    if (!confirmed) return;
    dispatch({ type: 'deleting', importId: entry.importId });
    try {
      const deleted = await deleteTradeImportFromServer(
        plugin,
        entry.importId,
        client
      );
      if (deleted) {
        dispatch({ type: 'reload' });
        await loadPage(null);
        onDeleted();
      }
    } finally {
      dispatch({ type: 'deleting', importId: null });
    }
  };

  const busy = state.deletingImportId !== null || state.loadingMore;

  const openActions = (
    event: React.MouseEvent<HTMLButtonElement>,
    entry: TradeImportHistoryEntry
  ) => {
    const menu = new Menu();
    menu.addItem((item) =>
      item
        .setTitle(t('trade-import.server-deletion.account.button'))
        .setIcon('trash-2')
        .setWarning(true)
        .onClick(() => void deleteImport(entry))
    );
    menu.showAtMouseEvent(event.nativeEvent);
  };
  const countLabel =
    state.status === 'loaded'
      ? ` (${String(state.imports.length)}${state.nextCursor ? '+' : ''})`
      : '';

  return (
    <section className="journalit-trade-import-history">
      <button
        type="button"
        className="journalit-trade-import-history__toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span>
          {t('trade-import.history.title')}
          {countLabel}
        </span>
      </button>
      {open && state.status === 'loading' && (
        <div className="journalit-trade-import-sync-placeholder">
          {t('trade-import.history.loading')}
        </div>
      )}
      {open && state.status === 'failed' && (
        <div className="journalit-trade-import-sync-placeholder">
          {t('trade-import.history.load-failed')}
        </div>
      )}
      {open && state.status === 'loaded' && state.imports.length === 0 && (
        <div className="journalit-trade-import-sync-placeholder">
          {t('trade-import.history.empty')}
        </div>
      )}
      {open && state.status === 'loaded' && state.imports.length > 0 && (
        <ul className="journalit-trade-import-history__list">
          {state.imports.map((entry) => (
            <li
              key={entry.importId}
              className="journalit-trade-import-history__row"
            >
              <div className="journalit-trade-import-history__details">
                <strong>{entry.accountDisplayName}</strong>
                <span>
                  {formatLocalizedDateTime(entry.committedAt)} · {entry.broker}{' '}
                  ·{' '}
                  {t('trade-import.history.trades-on-server', {
                    count: String(entry.liveTradeCount),
                  })}
                </span>
              </div>
              <IconButton
                ariaLabel={t('trade-sync.import.more-actions')}
                disabled={busy}
                onClick={(event) => openActions(event, entry)}
              >
                <MoreHorizontal size={16} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
      {open && state.status === 'loaded' && state.nextCursor && (
        <Button
          variant="secondary"
          size="small"
          disabled={busy}
          loading={state.loadingMore}
          onClick={() => {
            dispatch({ type: 'load-more' });
            void loadPage(state.nextCursor);
          }}
        >
          {t('trade-import.history.load-more')}
        </Button>
      )}
    </section>
  );
};
