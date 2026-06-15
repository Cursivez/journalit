
export const ACCORDION_STYLES = `
  
  .journalit-settings-accordion {
    margin-bottom: 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    overflow: hidden;
    transition: box-shadow 150ms ease-out;
  }

  .journalit-settings-accordion:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .journalit-settings-accordion__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-normal);
    user-select: none;
    background-color: var(--background-secondary);
    transition: background-color 150ms ease-out;
    border: none;
    width: 100%;
    text-align: left;
  }

  .journalit-settings-accordion__header:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-settings-accordion__chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: var(--text-muted);
  }

  .journalit-settings-accordion__chevron svg {
    transition: transform 250ms ease-in-out;
  }

  .journalit-settings-accordion[data-expanded="false"] .journalit-settings-accordion__chevron svg {
    transform: rotate(-90deg);
  }

  .journalit-settings-accordion__title {
    margin-left: 8px;
  }

  .journalit-settings-accordion__container {
    height: var(--journalit-accordion-height, 0px);
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transition: height 150ms ease-out, opacity 125ms ease-out;
  }

  .journalit-settings-accordion[data-expanded="true"] .journalit-settings-accordion__container,
  .custom-fields-accordion[data-expanded="true"] .journalit-settings-accordion__container {
    opacity: 1;
    visibility: visible;
  }

  .journalit-settings-accordion__content {
    padding: 16px;
    background-color: var(--background-primary);
  }

  
  .custom-fields-accordion-chevron {
    transition: transform 250ms ease-in-out;
    color: var(--text-muted);
  }

  .custom-fields-accordion[data-expanded="false"] .custom-fields-accordion-chevron {
    transform: rotate(-90deg);
  }

  .custom-fields-accordion-content {
    padding-top: 0;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 0;
    background-color: transparent;
  }
`;
