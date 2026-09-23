

export const LEGACY_CHALLENGE_ONBOARDING_STYLES = `
.journalit-legacy-challenge-onboarding-modal {
  width: min(680px, 94vw);
  max-width: 94vw;
}

.journalit-legacy-challenge-onboarding-modal
  .journalit-legacy-challenge-onboarding__body {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
  width: 100%;
  min-width: 0;
}

.journalit-legacy-challenge-onboarding__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--size-4-4);
}

.journalit-legacy-challenge-onboarding__legend {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.4;
}

.journalit-legacy-challenge-onboarding__archive-toggle {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  white-space: nowrap;
  flex: 0 0 auto;
}

.journalit-legacy-challenge-onboarding__list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  overflow: hidden;
  max-height: 58vh;
  overflow-y: auto;
}

.journalit-legacy-challenge-onboarding__row {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto 180px;
  align-items: center;
  gap: var(--size-4-2);
  padding: var(--size-2-3) var(--size-4-2);
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-legacy-challenge-onboarding__row:last-child {
  border-bottom: none;
}

.journalit-legacy-challenge-onboarding__row.is-grouped {
  background: color-mix(in srgb, var(--interactive-accent) 6%, transparent);
}

.journalit-legacy-challenge-onboarding__row.is-done {
  color: var(--text-muted);
}

.journalit-legacy-challenge-onboarding__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid transparent;
  font-size: 10px;
  font-weight: var(--font-semibold);
  color: var(--text-on-accent);
}

.journalit-legacy-challenge-onboarding__marker.is-group {
  background: var(--interactive-accent);
}

.journalit-legacy-challenge-onboarding__marker.is-suggested {
  background: transparent;
  border-color: var(--interactive-accent);
  color: var(--interactive-accent);
}

.journalit-legacy-challenge-onboarding__row.is-done
  .journalit-legacy-challenge-onboarding__marker {
  background: var(--color-green);
  border-color: var(--color-green);
  color: var(--text-on-accent);
}

.journalit-legacy-challenge-onboarding__row-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-ui-small);
}

.journalit-legacy-challenge-onboarding__suggested {
  margin-left: var(--size-2-2);
  color: var(--text-accent);
  font-size: 10px;
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.journalit-legacy-challenge-onboarding__row-meta {
  display: inline-flex;
  align-items: center;
  gap: var(--size-4-2);
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
  white-space: nowrap;
  text-transform: capitalize;
}

.journalit-legacy-challenge-onboarding__assign {
  min-width: 0;
  display: flex;
  justify-content: flex-end;
}

.journalit-legacy-challenge-onboarding__row-done {
  justify-self: end;
  color: var(--color-green);
  font-size: var(--font-ui-smaller);
}

.journalit-legacy-challenge-onboarding__empty {
  padding: var(--size-4-3);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  text-align: center;
}

.journalit-legacy-challenge-onboarding__actions {
  display: flex;
  align-items: center;
  gap: var(--size-4-2);
  border-top: 1px solid var(--background-modifier-border);
  padding-top: var(--size-4-2);
}

.journalit-legacy-challenge-onboarding__actions-spacer {
  flex: 1 1 auto;
}

@media (max-width: 640px) {
  .journalit-legacy-challenge-onboarding__row {
    grid-template-columns: 22px minmax(0, 1fr) 150px;
  }

  .journalit-legacy-challenge-onboarding__row-meta {
    display: none;
  }
}
`;
