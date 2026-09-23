export const PROFILE_LIBRARY_STYLES = `
.journalit-profile-amount-change {
  display: flex;
  align-items: baseline;
  gap: var(--size-4-3);
  font-size: var(--font-ui-medium);
}
.journalit-profile-amount-change > span { color: var(--text-muted); }
.journalit-profile-review__choices:empty,
.journalit-profile-review .journalit-prop-profile-picker__controls:empty { display: none; }
.journalit-profile-update-modal .journalit-profile-review { border: 0; padding-top: var(--size-4-2); }
.journalit-profile-update-modal .journalit-profile-policy-change { border: 0; padding-block: var(--size-4-2); }
.account-date-warning.journalit-profile-update-notice {
  background: var(--background-secondary);
  border-color: var(--background-modifier-border);
  flex-wrap: wrap;
}
.journalit-profile-update-notice .account-date-warning__icon {
  color: var(--text-muted);
}
.journalit-profile-update-notice .account-date-warning__content {
  min-width: 180px;
}
.account-date-warning.journalit-prop-transition-notice {
  background: var(--background-secondary);
  border-color: var(--background-modifier-border);
  flex-wrap: wrap;
}
.journalit-prop-transition-notice .account-date-warning__icon {
  color: var(--text-muted);
}
.journalit-prop-transition-notice.is-failed {
  border-color: rgba(var(--color-red-rgb), 0.35);
}
.journalit-prop-transition-notice.is-failed .account-date-warning__icon {
  color: var(--color-red);
}
.journalit-prop-transition-notice.is-passed .account-date-warning__icon {
  color: var(--color-green);
}
.journalit-prop-transition-notice.is-payout .account-date-warning__icon {
  color: var(--color-cyan);
}
.journalit-prop-transition-notice.is-unknown .account-date-warning__icon {
  color: var(--text-accent);
}
.journalit-prop-transition-notice .account-date-warning__content {
  min-width: 180px;
}
.journalit-prop-transition-notice__actions {
  display: flex;
  align-items: center;
  gap: var(--size-4-2);
  flex-shrink: 0;
}
.journalit-prop-payout-plan {
  margin-top: var(--size-4-3);
}
.journalit-prop-payout-plan .journalit-collapsible-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--size-4-2);
  min-width: 0;
}
.journalit-prop-payout-plan__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--size-4-2) var(--size-4-3);
}
.journalit-prop-payout-plan__grid label {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
  font-size: var(--font-ui-small);
  color: var(--text-muted);
}
.journalit-prop-payout-plan__grid input {
  width: 100%;
}
.journalit-prop-payout-plan__grid input[aria-invalid='true'] {
  border-color: var(--text-error);
}
.journalit-prop-payout-plan__error {
  color: var(--text-error);
  font-size: var(--font-ui-smaller);
}
.journalit-prop-payout-plan__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--size-4-2);
}
.journalit-profile-update-status {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--size-4-2);
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}
.modal.journalit-profile-update-modal {
  width: 560px;
  max-width: 95vw;
}
.journalit-profile-update-form {
  container-type: inline-size;
  min-width: 0;
}
.journalit-profile-update-source,
.journalit-profile-retain {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-2);
  padding-block: var(--size-4-3);
}
.journalit-profile-update-source > span,
.journalit-profile-retain p {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  margin: 0;
}
.journalit-profile-retain > button {
  align-self: flex-start;
}
.journalit-profile-policy-diff,
.journalit-profile-policy-change {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
  min-width: 0;
}
.journalit-profile-policy-change {
  padding-block: var(--size-4-3);
  border-bottom: 1px solid var(--background-modifier-border);
}
.journalit-profile-policy-change__heading {
  display: flex;
  justify-content: space-between;
  gap: var(--size-4-2);
}
.journalit-profile-policy-change__heading > span,
.journalit-profile-policy-column-label {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}
.journalit-profile-policy-change__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--size-4-4);
}
.journalit-profile-policy-change__columns > div {
  min-width: 0;
}
.journalit-profile-policy-diff .journalit-prop-challenge-rule-remove {
  display: none;
}
.journalit-profile-update-form .journalit-prop-profile-picker__controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--size-4-3);
}
@container (max-width: 540px) {
  .journalit-profile-policy-change__columns,
  .journalit-profile-update-form .journalit-prop-profile-picker__controls {
    grid-template-columns: minmax(0, 1fr);
  }
}
.journalit-personal-profiles,
.journalit-profile-review {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
  min-width: 0;
  container-type: inline-size;
}
.journalit-personal-profiles__selection {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--size-4-2);
}
.journalit-personal-profiles__actions,
.journalit-profile-review__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--size-4-2);
}
.journalit-personal-profiles__actions {
  margin-top: calc(-1 * var(--size-4-2));
}
.journalit-personal-profiles__delete {
  margin-left: auto;
}
.journalit-profile-review__actions {
  justify-content: flex-end;
}
.journalit-profile-update-modal .journalit-dropdown-select,
.journalit-profile-update-modal .journalit-dropdown-select__trigger {
  width: 100%;
}
.journalit-profile-update-modal .journalit-dropdown-select__trigger {
  justify-content: space-between;
}
.journalit-profile-policy-diff .journalit-prop-challenge-rule-toggle {
  grid-template-columns: minmax(0, 1fr) auto;
  padding: var(--size-4-2);
}
.journalit-profile-policy-diff .journalit-prop-challenge-rule-toggle > strong {
  display: none;
}
.journalit-profile-policy-diff .journalit-prop-challenge-rule-summary {
  grid-column: 1;
  grid-row: 1;
  white-space: normal;
  overflow: visible;
  overflow-wrap: anywhere;
  text-overflow: clip;
}
.journalit-personal-profiles p,
.journalit-profile-review p,
.journalit-profile-history p {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.journalit-profile-review {
  padding-block: var(--size-4-4);
  border-top: 1px solid var(--background-modifier-border);
}
.journalit-profile-review__comparison,
.journalit-profile-review__choices,
.journalit-profile-review__transition,
.journalit-profile-history__entries {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-2);
  min-width: 0;
  width: 100%;
}
.journalit-profile-review__transition {
  gap: var(--size-4-3);
  padding-block: var(--size-4-3);
}
.journalit-profile-review__dates,
.journalit-profile-review__drawdown {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--size-4-3);
  min-width: 0;
}
.journalit-profile-review__drawdown > strong,
.journalit-profile-review__drawdown > .jl-checkbox-wrapper {
  grid-column: 1 / -1;
}
.journalit-profile-review .jl-checkbox-wrapper {
  margin: 0;
}
.journalit-profile-review .jl-checkbox-text {
  white-space: normal;
  overflow-wrap: anywhere;
}
.journalit-profile-review .journalit-collapsible-section,
.journalit-profile-history.journalit-collapsible-section,
.journalit-profile-history .journalit-collapsible-section {
  border: 0;
  background: transparent;
  margin: 0;
}
.journalit-prop-challenge-section .journalit-profile-review :where(.journalit-collapsible-section:not(.journalit-profile-correction-details)) > .journalit-collapsible-header,
.journalit-prop-challenge-section .journalit-profile-history :where(.journalit-collapsible-section:not(.journalit-profile-correction-details)) > .journalit-collapsible-header {
  padding: var(--size-4-2) 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}
.journalit-profile-review .journalit-collapsible-title,
.journalit-profile-history .journalit-collapsible-title {
  font-size: var(--font-ui-small);
  font-weight: var(--font-medium);
  text-transform: none;
  letter-spacing: normal;
  color: var(--text-normal);
}
.journalit-profile-review .journalit-collapsible-content,
.journalit-profile-history .journalit-collapsible-content {
  padding: var(--size-4-2) 0;
}
.journalit-profile-review .journalit-profile-correction-details .journalit-collapsible-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--size-4-2);
  min-width: 0;
}
.journalit-profile-review .journalit-profile-correction-details .journalit-collapsible-content > p {
  margin: 0;
}
@container (max-width: 540px) {
  .journalit-profile-review__dates {
    grid-template-columns: minmax(0, 1fr);
  }
}
@container (max-width: 380px) {
  .journalit-personal-profiles__selection,
  .journalit-profile-review__drawdown {
    grid-template-columns: minmax(0, 1fr);
  }
  .journalit-personal-profiles__selection > .journalit-button {
    justify-self: start;
  }
}
`;
