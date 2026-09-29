
export const BROKER_PICKER_STYLES = `
.journalit-broker-picker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.journalit-broker-picker .journalit-broker-picker__search {
  position: relative;
  display: flex;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: var(--background-secondary);
  color: var(--text-muted);
  transition: border-color 0.15s ease;
}


.journalit-broker-picker .journalit-broker-picker__search:hover {
  border-color: var(--background-modifier-border-hover);
}

.journalit-broker-picker .journalit-broker-picker__search:focus-within {
  border-color: var(--interactive-accent);
}

.journalit-broker-picker .journalit-broker-picker__search > svg,
.journalit-broker-picker .journalit-broker-picker__search > .journalit-obsidian-icon {
  position: absolute;
  top: 50%;
  left: 0.85rem;
  transform: translateY(-50%);
  pointer-events: none;
}

.journalit-broker-picker .journalit-broker-picker__search input,
.journalit-broker-picker .journalit-broker-picker__search input:hover,
.journalit-broker-picker .journalit-broker-picker__search input:active,
.journalit-broker-picker .journalit-broker-picker__search input:focus,
.journalit-broker-picker .journalit-broker-picker__search input:focus-visible {
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0 0.85rem 0 calc(0.85rem + 16px + 0.6rem);
  border: none;
  border-radius: 10px;
  outline: none;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font-size: 0.95rem;
  cursor: text;
}

.journalit-broker-picker .journalit-broker-picker__tiles {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 0.6rem;
}

.journalit-broker-picker .journalit-broker-picker__tiles > li {
  display: flex;
  min-width: 0;
}

.journalit-broker-picker .journalit-broker-picker__tile {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-width: 0;
  height: auto;
  min-height: 118px;
  padding: 0.9rem 0.6rem;
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  background: var(--background-secondary);
  color: var(--text-normal);
  font: inherit;
  box-shadow: none;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;
}

.journalit-broker-picker .journalit-broker-picker__tile:hover:not(:disabled) {
  border-color: var(--interactive-accent);
  transform: translateY(-1px);
}

.journalit-broker-picker .journalit-broker-picker__tile:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}

.journalit-broker-picker .journalit-broker-picker__tile.is-pinned {
  border-style: dashed;
  color: var(--text-muted);
}

.journalit-broker-picker .journalit-broker-picker__tile.is-selected {
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 1px var(--interactive-accent);
  background: color-mix(in srgb, var(--interactive-accent) 8%, var(--background-secondary));
}

.journalit-broker-picker .journalit-broker-picker__label {
  font-size: 0.85rem;
  line-height: 1.25;
  text-align: center;
  white-space: normal;
}

.journalit-broker-picker .journalit-broker-picker__badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}


.journalit-broker-mark {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  overflow: hidden;
}


.journalit-broker-mark.has-logo {
  background: var(--journalit-broker-mark-background, #fff);
  padding: 6px;
}

.journalit-broker-mark img,
.journalit-broker-mark__mono {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}


.journalit-broker-mark__mono {
  width: 70%;
  height: 70%;
  background: currentColor;
  mask: var(--journalit-broker-mark) center / contain no-repeat;
  -webkit-mask: var(--journalit-broker-mark) center / contain no-repeat;
}

.journalit-broker-mark--lg img,
.journalit-broker-mark--lg .journalit-broker-mark__mono {
  width: 36px;
  height: 36px;
}

.journalit-broker-mark--md {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 0.85rem;
}

.journalit-broker-mark--md.has-logo {
  padding: 5px;
}

@media (max-width: 768px) {
  .journalit-broker-picker .journalit-broker-picker__tiles {
    grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  }
}
`;
