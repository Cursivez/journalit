import type { ItemView, View } from 'obsidian';

type ExportAction = (checking: boolean) => boolean;
const actions = new WeakMap<View, ExportAction>();


export function registerTradeLogExportAction(
  view: ItemView,
  action: ExportAction
): () => void {
  actions.set(view, action);
  return () => {
    if (actions.get(view) === action) actions.delete(view);
  };
}

export function runTradeLogExport(
  view: View | null | undefined,
  checking: boolean
): boolean {
  return view ? (actions.get(view)?.(checking) ?? false) : false;
}
