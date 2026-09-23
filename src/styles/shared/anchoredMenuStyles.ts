export const ANCHORED_MENU_STYLES = `
.journalit-anchored-menu {
  position: fixed;
  top: var(--journalit-anchored-menu-top);
  left: var(--journalit-anchored-menu-left);
  z-index: var(--layer-menu);
  display: flex;
  flex-direction: column;
  width: var(--journalit-anchored-menu-width);
  max-height: var(--journalit-anchored-menu-max-height);
  padding: 0;
  overflow-y: auto;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
`;
