import { type App, Notice, Platform } from 'obsidian';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { t } from '../../lang/helpers';
import { Select } from '../core/Select';
import { showActionConfirmationModal } from '../shared/ConfirmationModal';
import {
  serializeTradeLogExport,
  type TradeLogExportFormat,
  type TradeLogExportTable,
} from './tradeLogExport';

export async function offerTradeLogExport(
  app: App,
  doc: Document,
  table: TradeLogExportTable,
  signal: AbortSignal
): Promise<void> {
  if (table.rows.length === 0 || table.columns.length === 0) {
    new Notice(t('tradelog.export.empty'));
    return;
  }
  let format: TradeLogExportFormat = 'csv';
  const confirmed = await showActionConfirmationModal<boolean>(app, {
    signal,
    title: t('tradelog.export.title'),
    message: [
      {
        text: t('tradelog.export.scope', {
          count: String(table.rows.length),
          columns: String(table.columns.length),
        }),
      },
      { text: t('tradelog.export.raw') },
      ...(Platform.isMobileApp ? [{ text: t('tradelog.export.mobile') }] : []),
    ],
    renderContent: (contentEl) => {
      const root = createRoot(contentEl.createDiv());
      root.render(
        createElement(Select, {
          label: t('tradelog.export.format'),
          className: 'dropdown',
          defaultValue: format,
          options: [
            { value: 'csv', label: 'CSV' }, 
            { value: 'json', label: 'JSON' }, 
            { value: 'md', label: 'Markdown' }, 
          ],
          onChange: (value) => {
            if (value === 'csv' || value === 'json' || value === 'md')
              format = value;
          },
        })
      );
      return () => root.unmount();
    },
    actions: [
      { value: false, label: t('button.cancel'), initialFocus: true },
      { value: true, label: t('tradelog.export.button'), variant: 'primary' },
    ],
    cancelValue: false,
  });
  if (!confirmed || signal.aborted) return;

  const { content, mimeType } = serializeTradeLogExport(table, format);
  const filename = `journalit-trades-${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}.${format}`;
  if (Platform.isMobileApp) {
    await app.vault.create(filename, content);
    new Notice(t('tradelog.export.saved', { filename }));
    return;
  }

  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const anchor = doc.body.createEl('a');
  anchor.href = url;
  anchor.download = filename;
  try {
    anchor.click();
  } finally {
    anchor.remove();
    
    
    
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}
