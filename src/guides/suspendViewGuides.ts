

const SUSPEND_VIEW_GUIDES_ATTRIBUTE = 'data-journalit-suspend-view-guides';


const MENU_SUSPENSION = 'menu';


export const VIEW_GUIDE_SUSPENDING_SELECTOR = `[data-journalit-modal-guide-overlay], [${SUSPEND_VIEW_GUIDES_ATTRIBUTE}]`;


export const VIEW_GUIDE_BLOCKING_SELECTOR = `[data-journalit-modal-guide-overlay], [${SUSPEND_VIEW_GUIDES_ATTRIBUTE}]:not([${SUSPEND_VIEW_GUIDES_ATTRIBUTE}="${MENU_SUSPENSION}"])`;


export const SUSPEND_VIEW_GUIDES_MENU_PROPS = {
  [SUSPEND_VIEW_GUIDES_ATTRIBUTE]: MENU_SUSPENSION,
} as const;


export function suspendViewGuidesWhileOpen(modalEl: HTMLElement): void {
  modalEl.setAttribute(SUSPEND_VIEW_GUIDES_ATTRIBUTE, '');
}
