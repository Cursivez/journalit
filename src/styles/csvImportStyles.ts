

const CSV_IMPORT_STYLES = `

.journalit-csv-import-view-container .view-content {
	padding: 0 !important;
	margin: 0 !important;
}

.journalit-csv-import {
	flex: 1 1 auto;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 0 24px 24px 24px;
	width: 100%;
	background: var(--background-primary);
}

.journalit-csv-import > * {
	max-width: 1040px;
	margin-left: auto;
	margin-right: auto;
}

.journalit-csv-import.journalit-trade-import-simple {
	padding-top: 14px;
}

.journalit-csv-import.journalit-trade-import-gate-view {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding-top: 62px;
}

.journalit-csv-import .journalit-trade-import-gate-card {
	width: min(100%, 620px);
	margin: 0 auto;
	padding: 38px 44px 34px;
	border: 1px solid var(--background-modifier-border-hover);
	border-radius: 16px;
	background: var(--background-primary-alt);
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
	text-align: center;
}

.journalit-csv-import .journalit-trade-import-gate-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 18px;
	color: var(--interactive-accent);
}

.journalit-csv-import .journalit-trade-import-gate-eyebrow {
	margin: 0 0 8px 0;
	color: var(--text-accent);
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.journalit-csv-import .journalit-trade-import-gate-copy h1 {
	margin: 0;
	color: var(--text-normal);
	font-size: 25px;
	font-weight: 700;
	letter-spacing: -0.02em;
}

.journalit-csv-import .journalit-trade-import-gate-description {
	max-width: 430px;
	margin: 12px auto 0 auto;
	color: var(--text-muted);
	font-size: 15px;
	line-height: 1.5;
}

.journalit-csv-import .journalit-trade-import-gate-benefits {
	display: grid;
	gap: 12px;
	max-width: 510px;
	margin: 24px auto 22px;
	padding: 16px 18px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 11px;
	background: var(--background-secondary);
	text-align: left;
}

.journalit-csv-import .journalit-trade-import-gate-benefits div {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	gap: 10px;
	color: var(--text-normal);
	font-size: 13px;
	line-height: 1.45;
	text-align: left;
}

.journalit-csv-import .journalit-trade-import-gate-benefits svg {
	flex: 0 0 auto;
	margin-top: 1px;
	color: var(--interactive-accent);
}

.journalit-csv-import .journalit-trade-import-gate-actions {
	display: flex;
	justify-content: center;
	gap: 10px;
	flex-wrap: wrap;
}

.journalit-csv-import .journalit-trade-import-gate-primary,
.journalit-csv-import .journalit-trade-import-gate-secondary {
	min-height: 38px;
	padding: 8px 20px;
	border-radius: 8px;
	font-weight: 600;
}

.journalit-csv-import .journalit-trade-import-gate-primary {
	border-color: var(--interactive-accent);
	background: var(--interactive-accent);
	color: var(--text-on-accent);
}

.journalit-csv-import .journalit-trade-import-gate-primary:hover {
	border-color: var(--interactive-accent-hover);
	background: var(--interactive-accent-hover);
}

.journalit-csv-import .journalit-trade-import-gate-secondary {
	border-color: var(--background-modifier-border-hover);
	background: var(--background-primary);
	color: var(--text-normal);
}

.journalit-csv-import .csv-import-header {
	margin-bottom: 24px;
}

.journalit-csv-import .journalit-trade-import-simple-header {
	text-align: center;
}

.journalit-csv-import .journalit-trade-import-simple-header h1 {
	justify-content: center;
	font-size: 30px;
}

.journalit-csv-import .journalit-trade-import-stepper {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	max-width: 900px;
	margin-bottom: 18px;
}

.journalit-csv-import .journalit-trade-import-step {
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
	padding: 12px 14px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary-alt);
	color: var(--text-muted);
	text-align: left;
	cursor: pointer;
}

.journalit-csv-import .journalit-trade-import-step.is-active {
	border-color: var(--background-modifier-border-hover);
	color: var(--text-muted);
}

.journalit-csv-import .journalit-trade-import-step.is-current {
	border-color: var(--interactive-accent);
	background: var(--background-primary);
	color: var(--text-normal);
	box-shadow: inset 0 0 0 1px var(--interactive-accent);
}

.journalit-csv-import .journalit-trade-import-step:disabled {
	cursor: default;
	opacity: 0.65;
}

.journalit-csv-import .journalit-trade-import-step span {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 999px;
	background: var(--background-modifier-border);
	font-size: 12px;
	font-weight: 700;
}

.journalit-csv-import .journalit-trade-import-step.is-active span {
	background: var(--background-modifier-border);
	color: var(--text-muted);
}

.journalit-csv-import .journalit-trade-import-step.is-current span {
	background: var(--interactive-accent);
	color: var(--text-on-accent);
}

.journalit-csv-import .journalit-trade-import-step strong {
	font-size: 13px;
	font-weight: 600;
}

.journalit-csv-import .journalit-trade-import-layout {
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;
}

.journalit-csv-import .csv-import-header h1,
.journalit-csv-import .csv-import-card h2 {
	display: flex;
	align-items: center;
	gap: 8px;
}

.journalit-csv-import .csv-import-header h1 {
	margin: 0 0 8px 0;
	color: var(--text-normal);
	font-size: 24px;
	font-weight: 600;
}

.journalit-csv-import .csv-import-header p {
	margin: 0;
	color: var(--text-muted);
	font-size: 14px;
}

.journalit-csv-import .csv-import-card {
	margin-bottom: 0;
	padding: 22px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary-alt);
	box-shadow: var(--shadow-s);
}

.journalit-csv-import .journalit-trade-import-panel {
	max-width: 900px;
	width: 100%;
	margin-left: auto;
	margin-right: auto;
}

.journalit-csv-import .csv-import-card h2 {
	margin-top: 0;
	margin-bottom: 14px;
	font-size: 18px;
	font-weight: 600;
	color: var(--text-normal);
}

.journalit-csv-import .csv-import-card label {
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin: 10px 0;
	font-size: 13px;
	font-weight: 500;
	color: var(--text-muted);
}

.journalit-csv-import .csv-import-card input,
.journalit-csv-import .csv-import-card select {
	width: 100%;
	max-width: none;
}

.journalit-csv-import .journalit-trade-import-form-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(240px, 320px));
	gap: 14px;
	align-items: start;
	justify-content: center;
}

.journalit-csv-import .journalit-trade-import-account-picker,
.journalit-csv-import .journalit-trade-import-account-trigger,
.journalit-csv-import .journalit-trade-import-broker-picker,
.journalit-csv-import .journalit-trade-import-broker-trigger {
	width: 100%;
	max-width: 320px;
}

.journalit-csv-import .journalit-trade-import-template-picker,
.journalit-csv-import .journalit-trade-import-template-trigger {
	width: 100%;
}

.journalit-csv-import .journalit-trade-import-account-trigger,
.journalit-csv-import .journalit-trade-import-broker-trigger,
.journalit-csv-import .journalit-trade-import-template-trigger {
	justify-content: space-between;
	min-height: 31px;
	font-size: 13px;
}

.journalit-csv-import .journalit-trade-import-template-trigger span:first-child {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.journalit-csv-import .journalit-trade-import-dropdown {
	width: 100%;
}

.journalit-csv-import .journalit-trade-import-dropdown-trigger {
	justify-content: space-between;
	width: 100%;
	min-height: 31px;
	font-size: 13px;
}

.journalit-csv-import .journalit-trade-import-dropdown-trigger span:first-child {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.journalit-csv-import .journalit-trade-import-dropdown-menu {
	left: 0;
	right: auto;
	width: 100%;
	max-height: 280px;
	overflow-y: auto;
	z-index: 30;
}

.journalit-csv-import .journalit-trade-import-account-menu,
.journalit-csv-import .journalit-trade-import-broker-menu,
.journalit-csv-import .journalit-trade-import-template-select-menu {
	left: 0;
	right: auto;
	width: 100%;
	max-height: 320px;
	overflow-y: auto;
	z-index: 20;
}

.journalit-csv-import .journalit-trade-import-account-menu .journalit-home-period-option,
.journalit-csv-import .journalit-trade-import-broker-menu .journalit-home-period-option,
.journalit-csv-import .journalit-trade-import-template-select-menu .journalit-home-period-option {
	gap: 10px;
	min-height: 34px;
}

.journalit-csv-import .journalit-trade-import-favorite-option {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 0;
}

.journalit-csv-import .journalit-trade-import-favorite-option__select {
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
	flex: 1 1 auto;
	min-height: 34px;
	padding: 6px 0 6px 8px;
	border: 0;
	background: transparent;
	box-shadow: none;
	color: inherit;
	font: inherit;
	text-align: left;
	cursor: pointer;
}

.journalit-csv-import .journalit-trade-import-favorite-option__select:hover,
.journalit-csv-import .journalit-trade-import-favorite-option__select:focus-visible {
	background: transparent;
	box-shadow: none;
}

.journalit-csv-import .journalit-trade-import-favorite-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	width: 28px;
	min-height: 28px;
	margin-right: 4px;
	padding: 0;
	border: 0;
	border-radius: 4px;
	background: transparent;
	box-shadow: none;
	color: var(--text-muted);
	line-height: 1;
	cursor: pointer;
}

.journalit-csv-import .journalit-trade-import-favorite-button:hover,
.journalit-csv-import .journalit-trade-import-favorite-button:focus-visible {
	background: var(--background-modifier-hover);
	color: var(--text-normal);
	box-shadow: none;
}

.journalit-csv-import .journalit-trade-import-favorite-button.is-favorite {
	color: var(--interactive-accent);
}

.journalit-csv-import .journalit-trade-import-favorite-button.is-favorite svg,
.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-button.is-favorite svg {
	fill: currentColor;
}

.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	width: 28px;
	min-height: 28px;
	margin-right: 4px;
	padding: 0;
	border: 0;
	border-radius: 4px;
	background: transparent;
	box-shadow: none;
	color: var(--text-muted);
	line-height: 1;
	cursor: pointer;
}

.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-button:hover,
.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-button:focus-visible {
	background: var(--background-modifier-hover);
	color: var(--text-normal);
	box-shadow: none;
}

.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-button.is-favorite {
	color: var(--interactive-accent);
}

.journalit-home-period-menu.journalit-trade-import-dropdown-menu--portal {
	position: fixed;
	top: var(--trade-import-menu-top);
	left: var(--trade-import-menu-left);
	right: auto;
	margin-top: 0;
	z-index: 1000;
	width: var(--trade-import-menu-width);
	max-height: var(--trade-import-menu-max-height);
	overflow-y: auto;
}

.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-option {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 0;
}

.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-option__select {
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
	flex: 1 1 auto;
	min-height: 34px;
	padding: 6px 8px;
	border: 0;
	background: transparent;
	box-shadow: none;
	color: inherit;
	font: inherit;
	text-align: left;
	cursor: pointer;
}

.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-option__select:hover,
.journalit-trade-import-dropdown-menu--portal .journalit-trade-import-favorite-option__select:focus-visible {
	background: transparent;
	box-shadow: none;
}

.journalit-csv-import .journalit-trade-import-file-picker {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 150px;
	margin: 18px 0;
	padding: 24px;
	border: 1px dashed var(--background-modifier-border);
	border-radius: 6px;
	background: var(--background-primary);
	text-align: center;
	cursor: pointer;
	transition:
		border-color 120ms ease,
		background-color 120ms ease;
}

.journalit-csv-import .journalit-trade-import-file-picker:hover {
	border-color: var(--interactive-accent);
	background: var(--background-secondary);
}

.journalit-csv-import .journalit-trade-import-file-picker.is-dragging {
	border-color: var(--interactive-accent);
	background: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.12);
	box-shadow:
		0 0 0 1px var(--interactive-accent),
		0 0 0 6px rgba(var(--interactive-accent-rgb), 0.08);
}

.journalit-csv-import .journalit-trade-import-file-picker.is-dragging span {
	color: var(--text-accent);
}

.journalit-csv-import .journalit-trade-import-file-picker svg {
	margin-bottom: 10px;
	color: var(--text-accent);
}

.journalit-csv-import .journalit-trade-import-file-picker input {
	position: absolute;
	width: 1px;
	height: 1px;
	top: 50%;
	left: 50%;
	opacity: 0;
	pointer-events: none;
}

.journalit-csv-import .journalit-trade-import-file-picker-label {
	display: block;
	margin-top: 8px;
	color: var(--text-normal);
	font-size: 16px;
	font-weight: 600;
}

.journalit-csv-import .journalit-trade-import-guide-prompt {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
	margin-top: 8px;
	color: var(--text-muted);
	font-size: 12px;
	line-height: 1.4;
}

.journalit-csv-import .journalit-trade-import-guide-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	min-height: 0;
	padding: 0;
	border: 0;
	background: transparent;
	box-shadow: none;
	color: var(--text-accent);
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
}

.journalit-csv-import .journalit-trade-import-guide-link:hover,
.journalit-csv-import .journalit-trade-import-guide-link:focus-visible {
	color: var(--text-accent-hover);
	text-decoration: underline;
}

.journalit-csv-import .journalit-trade-import-guide-link svg {
	margin: 0;
	color: currentColor;
}

.journalit-csv-import .journalit-trade-import-file-types {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 6px;
	margin-top: 10px;
}

.journalit-csv-import .journalit-trade-import-file-types span {
	display: inline-flex;
	align-items: center;
	padding: 2px 8px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 999px;
	background: var(--background-secondary);
	color: var(--text-muted);
	font-size: 11px;
	font-weight: 500;
}

.journalit-csv-import .journalit-trade-import-privacy-note {
	margin: 0;
	color: var(--text-muted);
	font-size: 13px;
	line-height: 1.5;
}

.journalit-csv-import button.journalit-trade-import-inline-link,
.journalit-quick-import-modal button.journalit-trade-import-inline-link {
	display: inline;
	width: auto;
	height: auto;
	min-height: 0;
	padding: 0;
	border: 0;
	background: transparent;
	background-color: transparent;
	box-shadow: none;
	color: var(--text-accent);
	font: inherit;
	line-height: inherit;
	text-decoration: underline;
	cursor: pointer;
}

.journalit-csv-import button.journalit-trade-import-inline-link:hover,
.journalit-csv-import button.journalit-trade-import-inline-link:focus-visible,
.journalit-quick-import-modal button.journalit-trade-import-inline-link:hover,
.journalit-quick-import-modal button.journalit-trade-import-inline-link:focus-visible {
	background: transparent;
	background-color: transparent;
	box-shadow: none;
	color: var(--text-accent-hover, var(--text-accent));
}

.journalit-csv-import .csv-import-card label.journalit-trade-import-ai-toggle {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 10px;
	width: 100%;
	margin: 10px 0 0 0;
	padding: 10px 12px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
	color: var(--text-normal);
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
}

.journalit-csv-import .csv-import-card label.journalit-trade-import-ai-toggle:hover {
	border-color: var(--interactive-accent);
}

.journalit-csv-import .csv-import-card label.journalit-trade-import-ai-toggle input {
	appearance: none;
	width: 16px;
	height: 16px;
	min-width: 16px;
	max-width: none;
	margin: 0;
	border: 1px solid var(--background-modifier-border-hover);
	border-radius: 4px;
	background: var(--background-primary);
}

.journalit-csv-import .csv-import-card label.journalit-trade-import-ai-toggle input:checked {
	border-color: var(--interactive-accent);
	background: var(--interactive-accent);
}

.journalit-csv-import .csv-import-card label.journalit-trade-import-ai-toggle input:disabled {
	cursor: not-allowed;
}

.journalit-csv-import .csv-import-card label.journalit-trade-import-ai-toggle span {
	line-height: 1.3;
}

.journalit-csv-import .journalit-trade-import-accordion {
	margin-top: 12px;
	margin-bottom: 0;
	overflow: visible;
}

.journalit-csv-import .journalit-trade-import-accordion .journalit-settings-accordion__container,
.journalit-csv-import .journalit-trade-import-accordion .journalit-settings-accordion__content {
	overflow: visible;
}

.journalit-csv-import .journalit-trade-import-accordion .journalit-settings-accordion__header {
	min-height: 42px;
}

.journalit-csv-import .journalit-trade-import-accordion .journalit-settings-accordion__content p {
	margin: 0 0 12px 0;
	color: var(--text-muted);
	font-size: 13px;
	line-height: 1.45;
}

.journalit-csv-import .journalit-trade-import-template-picker-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 8px;
	align-items: end;
}

.journalit-csv-import .journalit-trade-import-template-menu-wrapper {
	position: relative;
	margin-bottom: 10px;
}

.journalit-csv-import .journalit-trade-import-template-menu-trigger {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 34px;
	height: 34px;
	padding: 0;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
	color: var(--text-muted);
}

.journalit-csv-import .journalit-trade-import-template-menu-trigger:hover {
	border-color: var(--interactive-accent);
	color: var(--text-normal);
}

.journalit-csv-import .journalit-trade-import-template-menu-trigger > span {
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 0;
}

.journalit-csv-import .journalit-trade-import-template-menu-trigger svg {
	display: block;
}

.journalit-csv-import .journalit-trade-import-template-menu {
	position: absolute;
	top: calc(100% + 6px);
	right: 0;
	z-index: 20;
	display: grid;
	gap: 2px;
	min-width: 190px;
	padding: 6px 0;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-secondary);
	box-shadow: var(--shadow-l);
	overflow: hidden;
}

.journalit-csv-import .journalit-trade-import-template-menu button {
	display: flex;
	align-items: center;
	gap: 10px;
	justify-content: flex-start;
	width: 100%;
	min-height: 36px;
	padding: 8px 12px;
	border: 0;
	border-radius: 0;
	background: transparent;
	color: var(--text-normal);
	text-align: left;
	box-shadow: none;
}

.journalit-csv-import .journalit-trade-import-template-menu button:hover:not(:disabled) {
	background: color-mix(in srgb, var(--interactive-accent) 16%, transparent);
}

.journalit-csv-import .journalit-trade-import-template-menu button:disabled {
	color: var(--text-faint);
	opacity: 0.7;
}

.journalit-csv-import .journalit-trade-import-template-menu button svg {
	color: currentColor;
	stroke: currentColor;
}

.journalit-trade-import-template-menu.journalit-trade-import-template-menu--portal {
	position: fixed;
	top: var(--trade-import-menu-top);
	left: var(--trade-import-menu-left);
	right: auto;
	margin-top: 0;
	z-index: 1001;
	display: grid;
	gap: 2px;
	width: var(--trade-import-menu-width);
	max-height: var(--trade-import-menu-max-height);
	padding: 6px 0;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-secondary);
	box-shadow: var(--shadow-l);
	overflow: hidden;
}

.journalit-trade-import-template-menu--portal button {
	display: flex;
	align-items: center;
	gap: 10px;
	justify-content: flex-start;
	width: 100%;
	min-height: 36px;
	padding: 8px 12px;
	border: 0;
	border-radius: 0;
	background: transparent;
	color: var(--text-normal);
	text-align: left;
	box-shadow: none;
}

.journalit-trade-import-template-menu--portal button:hover:not(:disabled) {
	background: color-mix(in srgb, var(--interactive-accent) 16%, transparent);
}

.journalit-trade-import-template-menu--portal button:disabled {
	color: var(--text-faint);
	opacity: 0.7;
}

.journalit-trade-import-template-menu--portal button svg {
	color: currentColor;
	stroke: currentColor;
}

.journalit-csv-import .journalit-trade-import-template-panel {
	display: grid;
	gap: 8px;
	margin: 10px 0 4px 0;
	padding: 10px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
}

.journalit-csv-import .journalit-trade-import-template-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.journalit-csv-import .journalit-trade-import-template-actions button,
.journalit-csv-import .journalit-trade-import-template-panel button {
	min-height: 32px;
}

.journalit-csv-import .journalit-trade-import-template-panel textarea {
	width: 100%;
	min-height: 74px;
	resize: vertical;
	font-family: var(--font-monospace);
	font-size: 12px;
}

.journalit-csv-import .journalit-trade-import-primary,
.journalit-csv-import .journalit-trade-import-confirm-button {
	margin-top: 16px;
	background: var(--interactive-accent);
	color: var(--text-on-accent);
}

.journalit-csv-import .journalit-trade-import-primary:disabled,
.journalit-csv-import .journalit-trade-import-actions button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.journalit-csv-import .journalit-trade-import-diagnostics {
	margin: 12px 0;
	padding-left: 18px;
}

.journalit-csv-import .journalit-trade-import-sample {
	max-height: 220px;
}

.journalit-csv-import .journalit-trade-import-review-controls {
	display: grid;
	grid-template-columns: minmax(120px, 160px) minmax(110px, 140px) minmax(240px, 320px);
	gap: 12px;
	align-items: end;
	margin: 14px 0 12px;
	padding: 12px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
}

.journalit-csv-import .journalit-trade-import-review-controls label {
	margin: 0;
	gap: 5px;
}

.journalit-csv-import .journalit-trade-import-review-controls label > span {
	color: var(--text-muted);
	font-size: 12px;
	font-weight: 500;
}

.journalit-csv-import .journalit-trade-import-review-controls select,
.journalit-csv-import .journalit-trade-import-review-controls input {
	min-height: 30px;
}

.journalit-csv-import .journalit-trade-import-date-format-control {
	max-width: 320px;
}

.journalit-csv-import .journalit-trade-import-summary-grid {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 6px 12px;
	max-width: 420px;
	margin: 12px 0;
	padding: 14px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
}

.journalit-csv-import .journalit-trade-import-summary-grid strong {
	font-size: 18px;
}

.journalit-csv-import .journalit-trade-import-summary-grid span {
	color: var(--text-muted);
}

.journalit-csv-import .journalit-trade-import-actions {
	display: flex;
	align-items: center;
	gap: 10px;
	justify-content: flex-end;
	margin-top: 16px;
}

.journalit-csv-import .journalit-trade-import-actions button {
	margin-top: 0;
}

.journalit-csv-import .journalit-trade-import-results {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.journalit-csv-import .journalit-trade-import-results h3 {
	margin: 0 0 4px;
	font-size: 20px;
}

.journalit-csv-import .result-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 14px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
}

.journalit-csv-import .result-success {
	border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.4);
	background: rgba(var(--color-green-rgb, 67, 160, 71), 0.1);
}

.journalit-csv-import .result-warning {
	border-color: rgba(var(--color-orange-rgb, 245, 124, 0), 0.4);
	background: rgba(var(--color-orange-rgb, 245, 124, 0), 0.1);
}

.journalit-csv-import .result-info .result-text,
.journalit-csv-import .result-text--muted {
	color: var(--text-muted);
}

.journalit-csv-import .imported-trades-preview {
	padding: 12px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
}

.journalit-csv-import .preview-header {
	margin-bottom: 10px;
	font-weight: 600;
}

.journalit-csv-import .csv-trades-list {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.journalit-csv-import .csv-trade-preview-header {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
	gap: 10px;
	padding: 0 12px 2px;
	color: var(--text-muted);
	font-size: 12px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.03em;
}

.journalit-csv-import .csv-trade-preview-item {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
	gap: 10px;
	align-items: center;
	width: 100%;
	min-height: 36px;
	padding: 7px 12px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-secondary);
	text-align: left;
	cursor: pointer;
}

.journalit-csv-import .csv-trade-preview-item:hover {
	border-color: var(--interactive-accent);
	background: var(--background-modifier-hover);
}

.journalit-csv-import .csv-trade-symbol {
	font-weight: 700;
}

.journalit-csv-import .csv-trade-date,
.journalit-csv-import .csv-trade-quantity,
.journalit-csv-import .csv-trade-status {
	color: var(--text-muted);
}

.journalit-csv-import .csv-column-mapper {
	margin-top: 4px;
}

.journalit-csv-import .journalit-trade-import-inline-mapper {
	margin-top: 18px;
	padding-top: 18px;
	border-top: 1px solid var(--background-modifier-border);
}

.journalit-csv-import .csv-mapper-header {
	margin-bottom: 16px;
}

.journalit-csv-import .csv-mapper-header h3 {
	margin: 0 0 6px 0;
	font-size: 16px;
	font-weight: 600;
}

.journalit-csv-import .csv-mapper-header p {
	margin: 0;
	color: var(--text-muted);
	font-size: 13px;
}

.journalit-csv-import .csv-message {
	margin: 12px 0;
	padding: 12px 14px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
}

.journalit-csv-import .csv-message--info {
	border-color: var(--interactive-accent);
	background: color-mix(in srgb, var(--interactive-accent) 8%, transparent);
}

.journalit-csv-import .csv-message--error {
	border-color: var(--text-error);
	background: color-mix(in srgb, var(--text-error) 8%, transparent);
	color: var(--text-normal);
}

.journalit-csv-import .csv-message-spaced-bottom {
	margin-bottom: 14px;
}

.journalit-csv-import .csv-tip-text {
	margin: 4px 0 0;
	color: var(--text-muted);
	font-size: 13px;
}

.journalit-csv-import .csv-mapper-grid-container {
	max-height: 320px;
	overflow-y: auto;
	padding-right: 4px;
}

.journalit-csv-import .csv-mapper-grid {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.journalit-csv-import .csv-mapper-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto minmax(220px, 1fr);
	align-items: center;
	gap: 16px;
	padding: 12px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
}

.journalit-csv-import .csv-column-name {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	font-weight: 600;
	color: var(--text-normal);
}

.journalit-csv-import .csv-column-sample {
	margin-top: 4px;
	color: var(--text-muted);
	font-size: 12px;
}

.journalit-csv-import .csv-sample-value {
	font-family: var(--font-monospace);
	color: var(--text-faint);
}

.journalit-csv-import .csv-mapper-arrow {
	color: var(--text-muted);
	font-size: 20px;
	font-weight: 600;
}

.journalit-csv-import .csv-mapper-target select {
	width: 100%;
}

.journalit-csv-import .csv-mapper-target .journalit-trade-import-dropdown-menu {
	max-height: 320px;
}

.journalit-csv-import .csv-required-badge {
	display: inline-flex;
	align-items: center;
	padding: 2px 6px;
	border: 1px solid var(--text-error);
	border-radius: 999px;
	color: var(--text-error);
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.journalit-csv-import .csv-required-badge--source {
	background: color-mix(in srgb, var(--text-error) 10%, transparent);
}

.journalit-csv-import .csv-mapper-summary--box {
	margin-top: 16px;
	padding: 14px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
	color: var(--text-normal);
}

.journalit-csv-import .csv-mapper-summary-success {
	margin-left: 12px;
	color: var(--text-success);
}

.journalit-csv-import .csv-mapper-fields-section {
	margin-top: 14px;
}

.journalit-csv-import .csv-mapper-fields-reference {
	display: grid;
	gap: 12px;
}

.journalit-csv-import .csv-mapper-fields-desc {
	margin: 0;
	color: var(--text-muted);
	font-size: 13px;
	line-height: 1.45;
}

.journalit-csv-import .csv-field-category {
	padding: 10px 12px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
	background: var(--background-primary);
}

.journalit-csv-import .csv-field-category-title {
	margin: 0 0 8px 0;
	color: var(--text-normal);
	font-size: 13px;
	font-weight: 700;
}

.journalit-csv-import .csv-field-category-list {
	display: grid;
	gap: 6px;
}

.journalit-csv-import .csv-field-item {
	display: flex;
	align-items: baseline;
	gap: 6px;
	color: var(--text-muted);
	font-size: 12px;
	line-height: 1.35;
}

.journalit-csv-import .csv-field-item--mapped {
	color: var(--text-normal);
}

.journalit-csv-import .csv-field-item-icon {
	width: 14px;
	color: var(--text-faint);
	font-weight: 700;
}

.journalit-csv-import .csv-field-item--mapped .csv-field-item-icon {
	color: var(--text-success);
}

.journalit-csv-import .csv-field-required {
	display: inline-flex;
	align-items: center;
	padding: 1px 5px;
	border-radius: 999px;
	font-size: 9px;
	font-weight: 700;
	letter-spacing: 0.04em;
}

.journalit-csv-import .csv-field-required--mapped {
	background: color-mix(in srgb, var(--text-success) 14%, transparent);
	color: var(--text-success);
}

.journalit-csv-import .csv-field-required--unmapped {
	background: color-mix(in srgb, var(--text-error) 12%, transparent);
	color: var(--text-error);
}

.journalit-csv-import .csv-field-help {
	color: var(--text-faint);
}

.journalit-csv-import .csv-preview-table-wrapper {
	overflow-x: auto;
	max-height: 400px;
	margin: 12px 0;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
}

.journalit-csv-import .csv-preview-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;
}

.journalit-csv-import .csv-preview-table th,
.journalit-csv-import .csv-preview-table td {
	padding: 10px 12px;
	border-bottom: 1px solid var(--background-modifier-border);
	text-align: left;
	vertical-align: top;
}

.journalit-csv-import .csv-preview-table th {
	background: var(--background-secondary);
	font-weight: 600;
	position: sticky;
	top: 0;
	z-index: 1;
}

.journalit-csv-import .csv-preview-table td {
	background: var(--background-primary);
}

@media (max-width: 720px) {
	.journalit-csv-import .journalit-trade-import-stepper {
		grid-template-columns: 1fr;
	}

	.journalit-csv-import .journalit-trade-import-form-grid {
		grid-template-columns: 1fr;
	}

	.journalit-csv-import .journalit-trade-import-actions {
		flex-direction: column;
	}
}
`;

const QUICK_IMPORT_MODAL_STYLES = `
.journalit-quick-import-modal-shell .modal-content {
  padding-top: var(--size-4-2);
}

.journalit-quick-import-modal {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-4);
  min-width: min(520px, 80vw);
}

.journalit-quick-import-modal__header {
  display: flex;
  align-items: flex-start;
  gap: var(--size-4-3);
}

.journalit-quick-import-modal__header h2 {
  margin: 0;
  font-size: var(--font-ui-large);
}

.journalit-quick-import-modal__header p,
.journalit-quick-import-modal > p {
  margin: var(--size-2-1) 0 0;
  color: var(--text-muted);
}

.journalit-quick-import-setup {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-2-2);
  padding: var(--size-4-2);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-quick-import-setup span {
  padding: var(--size-2-1) var(--size-2-3);
  border-radius: var(--radius-s);
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: var(--font-ui-small);
}

.journalit-quick-import-privacy-note {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.5;
}

.journalit-quick-import-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--size-2-2);
  min-height: 150px;
  padding: var(--size-4-6);
  border: 1px dashed var(--background-modifier-border);
  border-radius: var(--radius-l);
  background: var(--background-secondary);
  color: var(--text-muted);
  cursor: pointer;
  text-align: center;
  transition:
    border-color 120ms ease,
    background-color 120ms ease;
}

.journalit-quick-import-dropzone:hover,
.journalit-quick-import-dropzone.is-dragging {
  border-color: var(--interactive-accent);
  background: var(--background-modifier-hover);
}

.journalit-quick-import-dropzone strong {
  color: var(--text-normal);
}

.journalit-quick-import-file-input {
  display: none;
}

.journalit-quick-import-status {
  margin: 0;
  color: var(--text-muted);
  text-align: center;
}

.journalit-quick-import-processing {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
}

.journalit-quick-import-file-card {
  display: flex;
  align-items: center;
  gap: var(--size-4-3);
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-quick-import-file-card > div {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--size-2-1);
  min-width: 0;
}

.journalit-quick-import-file-card strong,
.journalit-quick-import-file-card span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-quick-import-file-card span {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-quick-import-replace-file-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-2-2);
}

.journalit-quick-import-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
}

.journalit-quick-import-skeleton span {
  height: 34px;
  border-radius: var(--radius-s);
  background: linear-gradient(
    90deg,
    var(--background-secondary),
    var(--background-modifier-hover),
    var(--background-secondary)
  );
  background-size: 200% 100%;
  animation: journalit-quick-import-skeleton 1.2s ease-in-out infinite;
}

@keyframes journalit-quick-import-skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.journalit-quick-import-callout {
  display: flex;
  align-items: flex-start;
  gap: var(--size-2-2);
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
  color: var(--text-muted);
}

.journalit-quick-import-summary {
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-quick-import-summary h3 {
  margin: 0 0 var(--size-4-2);
  font-size: var(--font-ui-medium);
}

.journalit-quick-import-summary p {
  margin: 0;
  color: var(--text-muted);
}

.journalit-quick-import-summary__grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--size-2-2) var(--size-4-4);
  color: var(--text-muted);
}

.journalit-quick-import-summary__grid strong {
  color: var(--text-normal);
}

.journalit-quick-import-preview-table-wrap {
  margin-top: var(--size-4-3);
  overflow-x: auto;
}

.journalit-quick-import-preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-ui-small);
}

.journalit-quick-import-preview-table th,
.journalit-quick-import-preview-table td {
  padding: var(--size-2-2) var(--size-2-3);
  border-top: 1px solid var(--background-modifier-border);
  text-align: left;
  white-space: nowrap;
}

.journalit-quick-import-preview-table th {
  color: var(--text-muted);
  font-weight: var(--font-medium);
}

.journalit-quick-import-preview-table td {
  color: var(--text-normal);
}

.journalit-quick-import-preview-table th:last-child,
.journalit-quick-import-preview-table td:last-child {
  text-align: right;
}

.journalit-quick-import-result-icon {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
}

.journalit-quick-import-result-icon.is-new {
  color: var(--text-success);
}

.journalit-quick-import-result-icon.is-duplicate,
.journalit-quick-import-result-icon.is-update {
  color: var(--text-accent);
}

.journalit-quick-import-result-icon.is-failed {
  color: var(--text-error);
}

.journalit-quick-import-preview-more {
  padding-top: var(--size-2-1);
  font-size: var(--font-ui-small);
}

.journalit-quick-import-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-2-2);
}

.journalit-quick-import-actions__primary {
  display: flex;
  justify-content: flex-end;
  gap: var(--size-2-2);
  margin-left: auto;
}
`;

export function injectCSVImportStyles(): void {
  // intentional
}

export function removeCSVImportStyles(): void {
  // intentional
}

export function ensureCSVImportStyles(): void {
  injectCSVImportStyles();
}
