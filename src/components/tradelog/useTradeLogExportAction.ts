import { useEffect, useLayoutEffect, useRef } from 'react';
import { ItemView, type WorkspaceLeaf } from 'obsidian';
import { t } from '../../lang/helpers';
import { useGuideTarget } from '../../guides/GuideRuntimeLayer';
import { TRADE_LOG_EXPORT_TARGET_ID } from '../../guides/tradeLogGuideIds';
import { registerTradeLogExportAction } from './tradeLogExportAction';

function setBusy(action: HTMLElement, busy: boolean): void {
  
  
  action.setAttribute('aria-disabled', String(busy));
  action.setAttribute('aria-busy', String(busy));
}


export function useTradeLogExportAction({
  leaf,
  enabled,
  isExporting,
  onExport,
}: {
  leaf: WorkspaceLeaf;
  enabled: boolean;
  isExporting: boolean;
  onExport: () => Promise<void>;
}): void {
  const registerTarget = useGuideTarget(TRADE_LOG_EXPORT_TARGET_ID);
  const actionRef = useRef<HTMLElement | null>(null);
  const current = useRef({ enabled, isExporting, onExport });

  
  
  useLayoutEffect(() => {
    current.current = { enabled, isExporting, onExport };
    if (actionRef.current) setBusy(actionRef.current, isExporting);
  }, [enabled, isExporting, onExport]);

  useEffect(() => {
    const view = leaf.view;
    
    if (!enabled || !(view instanceof ItemView)) return;

    const runExport = (checking: boolean): boolean => {
      const state = current.current;
      if (!state.enabled || state.isExporting) return false;
      if (!checking) void state.onExport();
      return true;
    };
    const action = view.addAction('download', t('tradelog.export.title'), () =>
      runExport(false)
    );
    action.addClass('journalit-tradelog-export-action');
    setBusy(action, current.current.isExporting);
    actionRef.current = action;
    registerTarget(action);
    const unregisterCommand = registerTradeLogExportAction(view, runExport);

    return () => {
      unregisterCommand();
      registerTarget(null);
      actionRef.current = null;
      action.remove();
    };
  }, [leaf, enabled, registerTarget]);
}
