

const en = {
  'account.profiles.no-matching-phase': 'No matching phase in this profile.',
  'account.profiles.history-unchanged': 'Earlier history stays unchanged.',
  'account.profiles.notice-title': 'Updated challenge profile available',
  'account.profiles.notice-description':
    'The source profile differs from your saved profile. Your account rules have not changed.',
  'account.profiles.review-changes': 'Review changes',
  'account.profiles.check-failed': 'Rule updates could not be checked.',
  'account.profiles.retry': 'Retry',
  'account.profiles.source-changed':
    'The source profile changed while this review was open. Reopen the review before applying.',
  'account.profiles.retain': 'Keep current rules',
  'account.profiles.retain-help':
    'Keep this account’s rules and dismiss these source changes. Later policy changes can notify you again.',
  'account.profiles.comparison-help':
    'Only differences are shown. Expand a rule to inspect its fields. Local overrides may explain differences.',
  'account.profiles.added': 'Added',
  'account.profiles.removed': 'Removed',
  'account.profiles.changed': 'Changed',
  'account.profiles.not-configured': 'Not configured',
  'account.profiles.no-rule-changes':
    'No rule or payout-policy differences for this phase.',
  'account.profiles.accept': 'Apply update',
  'account.profiles.cached':
    'Using cached profiles; the latest rules could not be checked.',
  'account.profiles.guide':
    'Review changed rules using published applicability or firm-confirmed terms. Enter the original purchase date when requested. Save templates under My firm profiles in Edit account.',
  'account.profiles.account-phase': 'Account phase',
  'account.profiles.choose': 'Choose a saved profile',
  'account.profiles.completed': 'Completed phases keep their original rules.',
  'account.profiles.confirm': 'These rules apply to my account.',
  'account.profiles.currency':
    'Choose an account currency matching the profile before applying it.',
  'account.profiles.current': 'Current account rules',
  'account.profiles.custom-transition': 'Custom transition terms',
  'account.profiles.cycle-start': 'Payout cycle start (local time)',
  'account.profiles.delete-help':
    'Delete this saved profile? Accounts already using it will not change.',
  'account.profiles.effective': 'Effective from (local time)',
  'account.profiles.correction-title': 'Catalog correction',
  'account.profiles.correction-source': 'Rule source',
  'account.profiles.correction-period': 'Affected history',
  'account.profiles.correction-guide':
    'Catalog corrections require approval before recalculating affected history.',
  'account.profiles.correction-history': 'Correction history',
  'account.profiles.correction-stale':
    'Account history changed. Reopen this review before applying the correction.',
  'account.profiles.correction-result': 'Hard-rule evaluation',
  'account.profiles.no-hard-breach': 'No detected hard breach',
  'account.profiles.correction-consent': 'Recalculate history',
  'account.profiles.correction-details': 'Details',
  'account.profiles.correction-apply': 'Apply correction',
  'account.profiles.purchase-date': 'Original purchase date',
  'account.profiles.save-purchase': 'Save purchase date',
  'account.profiles.purchase-needed':
    'Enter the original purchase date to check these terms.',
  'account.profiles.purchase-excluded':
    'This purchase keeps its existing terms.',
  'account.profiles.purchase-uncertain':
    'Applicability needs confirmation from the firm. Rules stay unchanged.',
  'account.profiles.initial-terms':
    'These terms apply from purchase or before this phase. Review the initial setup separately; history stays unchanged.',
  'account.profiles.announcement': 'Firm announcement',
  'account.profiles.firm-effective': 'Firm-confirmed effective date',
  'account.profiles.published-date': 'Published effective date',
  'account.profiles.applicability-checking': 'Checking applicability…',
  'account.profiles.error':
    'Could not save the profile. Check the values and try again.',
  'account.profiles.floor': 'Drawdown floor at transition',
  'account.profiles.history': 'Rule history',
  'account.profiles.history-help':
    'Earlier rules are retained. Use Review profile update to change a versioned phase; direct editing is locked to protect history.',
  'account.profiles.incoming': 'Incoming profile rules',
  'account.profiles.independent':
    'Saved profiles are local to this vault. Applying one creates an independent account snapshot; saving a new revision never changes existing accounts.',
  'account.profiles.keep-help':
    'Checked rules keep your local values instead of the incoming rule of that kind. Uncheck to accept the profile value. New rule kinds are added.',
  'account.profiles.keep-local': 'Keep mine:',
  'account.profiles.keep-payout': 'Keep current payout policy',
  'account.profiles.library': 'My firm profiles',
  'account.profiles.locked': 'Drawdown floor is already locked',
  'account.profiles.missing': 'This saved profile no longer exists.',
  'account.profiles.peak': 'Carried peak balance',
  'account.profiles.review': 'Review profile update',
  'account.profiles.link-source': 'Link firm profile',
  'account.profiles.save-new': 'Save as new profile',
  'account.profiles.save-revision': 'Save new revision of selected profile',
  'account.profiles.source-phase': 'Source profile phase',
  'account.profiles.transition-help':
    'No verified transition defaults are supplied. Enter firm-confirmed terms: floor, peak and payout cycle start. These are marked custom. Phase profit and lifetime payout count are retained; older trades keep their original rules.',
  'account.profiles.transition-source': 'Firm confirmation or reference',
  'account.profiles.unknown-baseline':
    'This older account has no original source snapshot. Review every difference explicitly; local overrides cannot be identified automatically.',
  'account.profiles.update-available':
    'Profile differences need review. Your account still uses its saved rules.',
  'account.profiles.up-to-date':
    'This phase uses the last reviewed profile definition; local overrides remain independent.',
  'trade.broker-synced-at': 'Broker synced {date}',
  'trade-sync.tradovate.status.setup-required': 'Account setup required',
  'trade-sync.tradovate.status.connecting': 'Connecting',
  'trade-sync.tradovate.status.paused': 'Paused',
  'trade-sync.tradovate.status.reauthorization-required':
    'Reauthorization required',
  'trade-sync.tradovate.status.deleting': 'Deleting cloud data',
  'trade-sync.tradovate.status.error': 'Connection error',

  'trade-sync.tradovate.sync-complete-connection':
    '{connection} synchronization completed.',
  'trade-sync.tradovate.sync-partial-connection':
    '{connection} synchronization completed with issues.',
  'trade-sync.tradovate.sync-all': 'Sync all',
  'trade-sync.tradovate.sync-all-complete':
    'Synchronized {succeeded} of {total} Tradovate connections.',
  'trade-sync.tradovate.sync-all-partial':
    'Synchronized {succeeded} of {total} Tradovate connections. Review the connections with issues.',
  'trade-sync.tradovate.connect-another': 'Connect another Tradovate account',
  'trade-sync.tradovate.no-connections':
    'Connect a Tradovate account on Journalit.co to configure and synchronize it here.',
  'trade-sync.tradovate.claimed-by-connection':
    'Synchronization is enabled through {connection}. Disable it there before switching this account.',
  'trade-sync.tradovate.claim-conflict':
    'Another Tradovate connection claimed this account. Review the refreshed connection cards before trying again.',
  'trade-sync.tradovate.reconciliation-issues':
    '{count} reconciliation issue(s)',
  'trade-sync.tradovate.website-connection-description':
    'Connect or reauthorize Tradovate securely on Journalit.co, then return here to choose accounts and synchronize your vault.',
  'trade-sync.tradovate.paused-website-description':
    'This Tradovate connection is paused. Manage it on Journalit.co to review or resume it.',
  'trade-sync.tradovate.plugin-sync-description':
    'One sync fetches your latest Tradovate activity and writes the resulting trades into this vault.',
  'trade-sync.tradovate.connect': 'Connect',
  'trade-sync.tradovate.manage-connection': 'Manage connection',
  'trade-sync.tradovate.setup-guide': 'Setup guide',
  'trade-sync.tradovate.setup-and-sync': 'Finish setup and sync',
  'trade-sync.tradovate.sync-to-vault': 'Sync',
  'trade-sync.tradovate.discovery-description':
    'Journalit needs to discover the Demo and Live accounts available through your Tradovate connection.',
  'trade-sync.tradovate.discover-accounts': 'Discover Tradovate accounts',
  'trade-sync.tradovate.discovering': 'Discovering accounts…',
  'trade-sync.tradovate.discovery-failed':
    'Tradovate account discovery failed. Try again or manage the connection on Journalit.co.',
  'trade-sync.tradovate.sync-account': 'Include in sync',
  'trade-sync.tradovate.history-label': 'Initial history',
  'trade-sync.tradovate.history-all': 'All available history',
  'trade-sync.tradovate.history-recent': 'Recent 90 days',
  'trade-sync.tradovate.history-custom': 'From a specific date',
  'trade-sync.tradovate.history-new': 'New trades only',
  'trade-sync.tradovate.start-date': 'Start date',

  'trade-sync.tradovate.mapping-required':
    'Choose a local vault account for every enabled Tradovate account.',
  'trade-sync.tradovate.custom-date-required':
    'Choose a start date for each custom history selection.',
  'trade-sync.tradovate.recovery-title': 'Restore missing trade notes',
  'trade-sync.tradovate.recovery-count': '{count} trade note(s) to restore',
  'trade-sync.tradovate.recovery-select-account':
    'Select a local account before restoring trade notes.',
  'trade-sync.tradovate.recovery-confirm':
    'Restore {count} trade note(s) to {account}?',

  'trade-sync.ctrader.status.setup-required': 'Account setup required',
  'trade-sync.ctrader.status.connecting': 'Connecting',
  'trade-sync.ctrader.status.paused': 'Paused',
  'trade-sync.ctrader.status.reauthorization-required':
    'Reauthorization required',
  'trade-sync.ctrader.status.deleting': 'Deleting cloud data',
  'trade-sync.ctrader.status.error': 'Connection error',
  'trade-sync.ctrader.sync-complete-connection':
    '{connection} synchronization completed.',
  'trade-sync.ctrader.sync-partial-connection':
    '{connection} synchronization completed with issues.',
  'trade-sync.ctrader.sync-all': 'Sync all',
  'trade-sync.ctrader.sync-all-complete':
    'Synchronized {succeeded} of {total} cTrader connections.',
  'trade-sync.ctrader.sync-all-partial':
    'Synchronized {succeeded} of {total} cTrader connections. Review the connections with issues.',
  'trade-sync.ctrader.connect-another': 'Connect another cTrader account',
  'trade-sync.ctrader.no-connections':
    'Connect a cTrader account on Journalit.co to configure and synchronize it here.',
  'trade-sync.ctrader.claimed-by-connection':
    'Synchronization is enabled through {connection}. Disable it there before switching this account.',
  'trade-sync.ctrader.claim-conflict':
    'Another cTrader connection claimed this account. Review the refreshed connection cards before trying again.',
  'trade-sync.ctrader.reconciliation-issues': '{count} reconciliation issue(s)',
  'trade-sync.ctrader.website-connection-description':
    'Connect or reauthorize cTrader securely on Journalit.co, then return here to choose accounts and synchronize your vault.',
  'trade-sync.ctrader.plugin-sync-description':
    'One sync fetches your latest cTrader activity and writes the resulting trades into this vault.',
  'trade-sync.ctrader.connect': 'Connect',
  'trade-sync.ctrader.manage-connection': 'Manage connection',
  'trade-sync.ctrader.setup-guide': 'Setup guide',
  'trade-sync.ctrader.setup-and-sync': 'Finish setup and sync',
  'trade-sync.ctrader.sync-to-vault': 'Sync',
  'trade-sync.ctrader.discovery-description':
    'Journalit needs to discover the Demo and Live accounts available through your cTrader connection.',
  'trade-sync.ctrader.discover-accounts': 'Discover cTrader accounts',
  'trade-sync.ctrader.discovering': 'Discovering accounts…',
  'trade-sync.ctrader.discovery-failed':
    'cTrader account discovery failed. Try again or manage the connection on Journalit.co.',
  'trade-sync.ctrader.sync-account': 'Include in sync',
  'trade-sync.ctrader.history-label': 'Initial history',
  'trade-sync.ctrader.history-all': 'All available history',
  'trade-sync.ctrader.history-recent': 'Recent 90 days',
  'trade-sync.ctrader.history-custom': 'From a specific date',
  'trade-sync.ctrader.history-new': 'New trades only',
  'trade-sync.ctrader.start-date': 'Start date',
  'trade-sync.ctrader.mapping-required':
    'Choose a local vault account for every enabled cTrader account.',
  'trade-sync.ctrader.custom-date-required':
    'Choose a start date for each custom history selection.',
  'trade-sync.ctrader.recovery-title': 'Restore missing trade notes',
  'trade-sync.ctrader.recovery-count': '{count} trade note(s) to restore',
  'trade-sync.ctrader.recovery-select-account':
    'Select a local account before restoring trade notes.',
  'trade-sync.ctrader.recovery-confirm':
    'Restore {count} trade note(s) to {account}?',
  'trade-sync.oauth.remap.title': 'Change account',
  'trade-sync.oauth.remap.message':
    'Use {newAccount} for existing notes too? Otherwise, only future broker updates will use it.',
  'trade-sync.oauth.remap.update-notes': 'Update notes',
  'trade-sync.oauth.remap.future-only': 'Future updates only',
  'trade-sync.oauth.remap.unavailable':
    'Account remapping is unavailable. Update the Journalit server and try again.',
  'trade-sync.oauth.remap.restore-in-progress':
    'Wait for Restore to finish, then try again.',
  'trade-sync.oauth.remap.operation-conflict':
    'That remap request conflicted with an earlier attempt. Try again.',
  'trade-sync.oauth.remap.account-busy':
    'This account is busy synchronizing. Retry shortly.',
  'trade-sync.oauth.remap.account-unavailable':
    'This account is no longer available. Refresh and try again.',
  'trade-sync.oauth.remap.preserved-conflicts':
    '{count} existing conflict(s) were left unchanged.',
  'trade-sync.oauth.remap.notes-pending':
    '{count} existing note update(s) are still pending. Synchronize again to retry.',
  'trade-sync.source.ctrader': 'cTrader',
  'trade-sync.source.ctrader.description':
    'Synchronize cTrader trades in the cloud and project them into this vault.',
  'trade-sync.ctrader.status-failed': 'Unable to load cTrader status.',
  'trade-sync.ctrader.last-sync': 'Last sync',
  'trade-sync.ctrader.pending-acks': '{count} pending local ACK(s)',
  'trade-sync.ctrader.never': 'Never',

  
  
  

  
  'command.add-trade': 'Add new trade',
  'command.import-trades-csv': 'Open Trade Import',

  
  'command.create-drc': 'Open DRC (daily report card)',
  'command.create-weekly-review': 'Open weekly review',
  'command.create-monthly-review': 'Open monthly review',
  'command.create-quarterly-review': 'Open quarterly review',
  'command.create-yearly-review': 'Open yearly review',

  
  'command.open-dashboard': 'Open dashboard',
  'command.open-account-dashboard': 'Open accounts',
  'command.open-trade-log': 'Open trade log',
  'command.open-home': 'Open home view',
  'command.open-settings': 'Open settings',
  'command.open-position-size-calculator': 'Open position size calculator',

  

  
  'command.replay-onboarding': 'Replay onboarding flow',
  'command.replay-current-view-guide': 'Replay guide for current view',
  'command.open-release-notes': 'View release notes',

  
  'command.open-layout-builder': 'Open layout builder',

  
  'notice.guide.replay-unavailable':
    'Guide system is not ready yet. Please try again.',
  'notice.guide.no-active-view':
    'Open a supported Journalit view first, then run this command.',
  'notice.guide.no-guide-for-view':
    'No guide is registered for this view yet ({viewType}).',
  'notice.guide.replay-failed': 'Failed to start the guide. Please try again.',
  'notice.guide.replay-started': 'Guide restarted for this view.',

  
  
  
  'template.switch-title': 'Switch layout',
  'template.switch-review-title': 'Switch {type} layout',

  'template.review-type.drc': 'DRC',
  'template.review-type.weekly': 'weekly',
  'template.review-type.monthly': 'monthly',
  'template.review-type.quarterly': 'quarterly',
  'template.review-type.yearly': 'yearly',
  'template.review-type.review': 'review',

  
  'template.builder.select-template': 'Select a layout to edit',
  'template.builder.loading': 'Loading layout builder...',
  'template.builder.create-from-sidebar':
    'Or create a new one from the sidebar',
  'template.builder.snippet-coming-soon': 'Snippet editor coming soon',

  'template.preview.empty': 'No widgets in this layout',
  'template.preview.summary': '{type} Layout - {count} widgets',
  'template.preview.mode': 'Preview Mode',
  'template.preview.markdown-zone-placeholder':
    'Markdown zone - users write here',
  'template.preview.markdown-zone-placeholder-with-id':
    'Markdown zone ({id}) - users write here',
  'template.preview.widget.game-performance-desc':
    'Mental/Technical grade distributions',
  'template.preview.widget.unknown-desc': 'Unknown widget type',

  
  'template.section.forecast': 'Forecast',
  'template.section.performance': 'Performance',
  'template.section.review': 'Review',
  'template.question.drc.q1': 'What did I do well today?',
  'template.question.drc.q2': 'What could I improve on?',
  'template.question.drc.q3': 'What will I focus on for the next session?',
  'template.question.weekly.q1': 'What worked well this week?',
  'template.question.weekly.q2': "What didn't work this week?",
  'template.question.weekly.q3': 'Which setups were most profitable?',
  'template.question.weekly.q4': 'What mistakes cost me the most money?',
  'template.question.weekly.q5': 'What could I improve for next week?',
  'template.question.monthly.q1': 'What were the key lessons from this month?',
  'template.question.monthly.q2': 'Which strategies performed best?',
  'template.question.monthly.q3': 'What patterns do I notice in my trading?',
  'template.question.monthly.q4': 'What are my goals for next month?',
  'template.question.monthly.q5': 'How can I improve my risk management?',

  'template-picker.empty': 'No layouts available.',
  'template-picker.close': 'Close',
  'template-picker.built-in': '(built-in)',
  'template-picker.badge.default': 'Default',
  'template-picker.badge.current': 'Current',
  'template-picker.cancel': 'Cancel',

  
  
  
  'auth.title.already-logged-in': 'Already logged in',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign in to Journalit',

  'auth.label.email': 'Email address',

  'auth.button.send-code': 'Send verification code',

  'auth.label.code': 'Verification code',

  'auth.button.verify': 'Verify & sign in',

  'auth.button.resend': 'Resend code',

  

  'auth.error.needs-premium': 'Pro feature',

  'auth.error.network-error': 'Connection error',

  
  
  
  'form.modal.unsaved-changes.title': 'Unsaved Changes',
  'form.modal.unsaved-changes.body1':
    'You have unsaved changes in the trade form.',
  'form.modal.unsaved-changes.body2':
    'Are you sure you want to close without saving?',
  'form.modal.unsaved-changes.continue': 'Continue Editing',
  'form.modal.unsaved-changes.discard': 'Discard Changes',

  
  
  
  'template-builder.modal.unsaved-changes.title': 'Unsaved Changes',
  'template-builder.modal.unsaved-changes.body1':
    'You have unsaved changes in this layout.',
  'template-builder.modal.unsaved-changes.body2':
    'Are you sure you want to switch without saving?',
  'template-builder.modal.unsaved-changes.continue': 'Continue Editing',
  'template-builder.modal.unsaved-changes.discard': 'Discard Changes',
  'template-builder.modal.delete.title': 'Delete Layout',
  'template-builder.modal.delete.body':
    'Are you sure you want to delete "{name}"?',
  'template-builder.modal.delete.warning': 'This action cannot be undone.',
  'template-builder.modal.delete.cancel': 'Cancel',
  'template-builder.modal.delete.confirm': 'Delete',

  
  
  
  'tradelog.settings.modal.unsaved-changes.body1':
    'You have unsaved changes in the column settings.',
  'tradelog.settings.modal.unsaved-changes.body2':
    'Are you sure you want to close without saving?',

  'notice.error.missed-trade-service-init':
    'Missed trade service is not initialized. Please wait a moment and try again.',
  'notice.error.backtest-trade-service-init':
    'Backtest trade service is not initialized. Please wait a moment and try again.',
  'notice.trade-updated': '{type} updated: {path}',
  'notice.trade-created': '{type} created: {path}',
  'notice.new-trade-created': '📈 New trade created: {instrument} {direction}',
  'notice.error.trade-update-failed': 'Failed to update {type}: {error}',
  'notice.error.trade-create-failed': 'Failed to create {type}: {error}',

  
  
  
  'form.section.trade-details': 'Trade Details',
  'form.section.trading-costs': 'Trading Costs',
  'form.section.risk-management': 'Risk Management',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': 'Analysis & Thesis',
  'form.section.custom-fields': 'Custom Fields',

  'form.section.custom-fields-empty-title': 'No advanced fields yet.',
  'form.section.custom-fields-empty-desc':
    'Track anything the built-in fields miss, like session, timeframe or setup grade. Custom fields save with every trade and can become sortable Trade Log columns.',
  'form.section.attachments': 'Attachments',

  
  
  
  'form.tab.basic': 'Basic',
  'form.tab.details': 'Details',
  'form.tab.advanced': 'Advanced',

  
  
  
  'form.import-shortcut.open': 'Import trades',
  'form.layout.customize': 'Customise form',
  'form.layout.modal-title': 'Customise Trade Form',
  'form.layout.settings-title': 'Trade Form Layout',

  'form.layout.input-mode': 'Input mode',
  'form.layout.input-mode-prices': 'Prices',
  'form.layout.input-mode-pnl-risk': 'P&L + Risk',
  'form.layout.input-mode-prices-desc':
    'Entry/exit prices. Journalit calculates P&L.',
  'form.layout.input-mode-pnl-risk-desc':
    'Direct P&L + risk. Journalit shows R.',
  'form.layout.asset-type-mode': 'Asset type',
  'form.layout.asset-type-mode-show': 'Ask',
  'form.layout.asset-type-mode-fixed': 'Fixed',
  'form.layout.default-asset-type': 'Default asset type',
  'form.layout.active-fields': 'Visible blocks',
  'form.layout.available-fields': 'Hidden blocks',
  'form.layout.active-fields-desc': 'Drag to reorder.',
  'form.layout.available-fields-desc': 'Add hidden blocks back.',
  'form.layout.empty-active': 'No optional blocks are visible.',
  'form.layout.all-active': 'All optional blocks are visible.',
  'form.layout.add-field-aria': 'Add {field} to trade form',
  'form.layout.remove-field-aria': 'Hide {field} in trade form',
  'form.layout.saved': 'Trade form layout saved',
  'form.layout.item.trading-costs.commission': 'Commission',
  'form.layout.item.import-shortcut': 'Import button',
  'form.layout.item.import-shortcut-desc':
    'Show a footer button that opens Trade Import.',
  'form.layout.item.core-details': 'Core trade details',
  'form.layout.item.core-details-desc':
    'Account, instrument, direction, and entry/exit inputs stay first.',
  'form.layout.item.asset-specific': 'Asset-specific fields',
  'form.layout.item.pnl-preview': 'P&L preview',

  'form.layout.item.trade-currency': 'Trade currency / FX rate',
  'form.layout.item.trade-currency-desc':
    'Enter a trade in another currency with an optional manual FX rate.',
  'form.layout.item.exchange-desc': 'Venue field for stock and crypto trades.',
  'form.layout.item.direct-pnl-toggle-desc':
    'Switch a single trade to entering a total P&L instead of exit prices.',
  'form.layout.manual-fx-rate': 'FX rate override',
  'form.layout.take-profit-unit': 'Take profit close amount as',
  'form.layout.take-profit-unit-percent': 'Close %',
  'form.layout.take-profit-unit-size': 'Size',
  'form.layout.result-r': 'Result in R',
  'form.layout.entry-time': 'Trade time',

  
  
  
  'form.field.account': 'Account',
  'form.field.prop-challenge-phase': 'Phase: {name}',
  'form.field.prop-challenge-phase.none': 'No phase at this time',
  'form.field.asset-type': 'Asset Type',
  'form.field.asset-type.stock': 'Stock',
  'form.field.asset-type.options': 'Options',
  'form.field.asset-type.futures': 'Futures',
  'form.field.asset-type.forex': 'Forex',
  'form.field.asset-type.crypto': 'Crypto',
  'form.field.asset-type.cfd': 'CFD',
  'form.field.direction': 'Direction',
  'form.field.direction.long': 'Long',
  'form.field.direction.short': 'Short',
  'form.field.commission': 'Commission',
  'form.field.commission-type': 'Type',
  'form.field.rebate': 'Rebate',
  'form.field.swap': 'Swap',

  'form.field.other-fees': 'Other Fees',
  'form.field.stop-loss': 'Stop Loss',
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Target Price',
  'form.field.close-percent': 'Close %',
  'form.field.close-size': 'Close Size',
  'form.field.risk-amount': 'Risk Amount',
  'form.field.profit-loss': 'Profit/Loss',
  'form.field.total-pnl': 'Trade P&L',
  'form.field.realized-pnl': 'Realized P&L',
  'form.field.floating-pnl': 'Floating P&L',
  'form.field.total-costs': 'Total Costs:',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Mistake',
  'form.field.custom-tags': 'Custom Tags',
  'form.field.trade-thesis': 'Trade Thesis',
  'form.field.time': 'Time',
  'form.field.price': 'Price',

  'form.field.entries': 'Entries',
  'form.field.exits': 'Exits',
  'form.field.dividends': 'Dividends',
  'form.field.dividend-amount': 'Dividend Amount',
  'form.field.optional': '(optional)',
  'form.field.closed': 'closed',
  'form.field.incl-costs': '(incl. costs)',
  'form.field.commission-type.fixed': 'Fixed',
  'form.field.commission-type.percentage': 'Percentage (%)',
  'form.calculated': 'Calculated',
  'form.account-empty-state.title': 'Set up your first account',
  'form.account-empty-state.description':
    'Accounts track your balance so Journalit can work out returns, risk and drawdown. Creating one only needs a name.',
  'form.account-empty-state.create-account': 'Create Account',
  'form.account-empty-state.submit-disabled':
    'Create an account first to save this trade.',
  'form.empty.take-profits': 'No take profit targets yet',
  'form.action.add-take-profit': 'Add Take Profit',
  'form.action.remove-take-profit': 'Remove take profit',

  
  'form.field.position-size': 'Position Size',
  'form.field.position-size.shares': 'Shares',
  'form.field.position-size.contracts': 'Contracts',
  'form.field.position-size.lots': 'Lots',
  'form.field.position-size.amount': 'Amount',
  'form.field.position-size.cfd-units': 'CFD Units',

  
  'form.field.instrument': 'Instrument',
  'form.field.instrument.ticker': 'Ticker',
  'form.field.instrument.option-symbol': 'Option Symbol',
  'form.field.instrument.future-symbol': 'Future Symbol',
  'form.field.instrument.forex-pair': 'Forex Pair',
  'form.field.instrument.crypto-symbol': 'Crypto Symbol',
  'form.field.instrument.cfd-symbol': 'CFD Symbol',

  
  'form.field.exchange': 'Exchange',
  'form.field.expiration-date': 'Expiration Date',
  'form.field.strike-price': 'Strike Price',
  'form.field.contract-size': 'Contract Size',
  'form.field.option-type': 'Option Type',
  'form.field.option-type.call': 'Call',
  'form.field.option-type.put': 'Put',
  'form.field.dollars-per-point': 'Dollars per point',
  'form.field.tick-size': 'Tick Size',
  'form.field.tick-value': 'Tick Value',
  'form.field.lot-size': 'Lot Size',
  'form.field.custom-lot-size': 'Custom Lot Size',
  'form.field.pip-value': 'Pip Value',
  'form.field.leverage-ratio': 'Leverage Ratio',
  'form.field.trade-currency': 'Trade Currency',
  'form.field.fx-rate': 'FX Rate to {base}',
  'form.field.fx-rate-override': 'FX Rate Override ({quote} → {base})',

  
  'form.forex.using-manual-rate': 'Using manual FX rate',
  'form.field.lot-size.standard': 'Standard (100,000)',
  'form.field.lot-size.mini': 'Mini (10,000)',
  'form.field.lot-size.micro': 'Micro (1,000)',
  'form.field.lot-size.custom': 'Custom',

  
  'form.field.image-url-placeholder': 'Paste media URL or file path...',
  'form.field.image-duplicate-error': 'This image is already added.',
  'form.field.trade-image-alt': 'Trade Image',

  'form.field.value-dollar': 'Value ($)',
  'form.field.dollar-amount-placeholder': 'Dollar amount',
  'form.field.direct-pnl-placeholder': 'Enter profit or loss amount',

  'form.field.mae-placeholder-currency': 'Max drawdown in {currency}',
  'form.field.mfe-placeholder-currency': 'Max profit in {currency}',

  
  
  
  'form.placeholder.select-accounts': 'Select accounts',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': 'Commission rebate/credit',
  'form.placeholder.swap': 'Overnight financing',
  'form.placeholder.other-fees': 'Platform/regulatory fees',
  'form.placeholder.dividend-amount': 'Cash amount, positive or negative',
  'form.placeholder.stop-loss': 'Optional stop loss price',
  'form.placeholder.target-price': 'Target price',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.close-size': '0.5',
  'form.placeholder.risk-amount': 'Planned risk in currency',
  'form.placeholder.fx-rate': '1 {currency} = ? {base} (empty: daily rate)',
  'form.placeholder.custom-tag': 'Type a custom tag and press Enter',
  'form.placeholder.thesis': 'Enter your thesis for this trade...',

  'form.placeholder.exchange-stock': 'e.g., NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'e.g., Binance, Coinbase',
  'form.placeholder.futures-point-value': 'ex: 50 for ES1',
  'form.placeholder.leverage': 'e.g., 100 for 1:100',

  
  
  
  'form.entry-exit.add-entry': '+ Add Entry',
  'form.entry-exit.add-exit': '+ Add Exit',
  'form.entry-exit.remove-entry': 'Remove Entry',
  'form.entry-exit.remove-exit': 'Remove Exit',
  'form.dividends.add-dividend': '+ Add Dividend',
  'form.dividends.remove-dividend': 'Remove Dividend',
  'form.dividends.total-dividends': 'Total Dividends:',
  'form.entry-exit.total-entry-size': 'Total Entry Size:',
  'form.entry-exit.remaining-position': 'Remaining Position:',
  'form.entry-exit.open': '(Open)',
  'form.entry-exit.closed': '(Closed)',
  'form.entry-exit.direct-pnl':
    'Enter base trade PNL directly instead of prices',
  'form.entry-exit.direct-pnl-desc':
    'Enter trade profit/loss before dividends. Commission and fees will still be applied separately.',
  'form.entry-exit.calc-pnl':
    'Calculate PNL from entry/exit prices and position sizes.',
  'form.ideal-exit.title': 'Ideal exits',

  'form.ideal-exit.price': 'Ideal Price',
  'form.ideal-exit.size': 'Size',
  'form.ideal-exit.remove': 'Remove ideal exit',

  'form.ideal-exit.copy-actual': 'Copy actual exits',

  'form.ideal-exit.tooltip':
    'Record the hindsight exit plan you wish you had executed. Supports scaled exits for capture review.',
  'form.ideal-exit.empty': 'No ideal exits yet',
  'form.unrealized.title': 'Open position snapshot',
  'form.unrealized.tooltip':
    'Record the current market price of your open position to track unrealized P&L. The snapshot is cleared automatically when the trade is closed.',
  'form.unrealized.price': 'Snapshot price',
  'form.unrealized.time': 'Snapshot time',
  'form.unrealized.preview': 'Unrealized P&L',
  'form.unrealized.captured': 'Captured {time}',
  'form.layout.item.unrealized-snapshot-desc':
    'Track unrealized P&L for open positions.',
  'trade.validation.unrealized-snapshot-price-non-negative':
    'Snapshot price must be zero or greater',
  'trade.validation.unrealized-snapshot-open-position-required':
    'Snapshot time must be during an open position.',
  
  
  
  'form.trade-type.title': 'Trade Type',
  'form.trade-type.subtitle': "Choose the type of trade you're creating",
  'form.trade-type.regular': 'Regular Trade',
  'form.trade-type.regular-desc': 'Normal trade with full entry and exit data',
  'form.trade-type.missed': 'Missed Trade',
  'form.trade-type.missed-desc':
    'Trade opportunity that you missed - PnL and Account fields optional',
  'form.trade-type.backtest': 'Backtest Trade',
  'form.trade-type.backtest-desc': 'Backtesting scenario for analysis purposes',
  'form.trade-type.missed-reason': 'Why did you miss this trade?',
  'form.trade-type.missed-reason-placeholder':
    'Describe why you missed this trade opportunity...',

  
  
  
  'button.save': 'Save',
  'button.cancel': 'Cancel',
  'button.close': 'Close',
  'button.done': 'Done',
  'button.edit': 'Edit',
  'button.delete': 'Delete',
  'button.update': 'Update',
  'button.open': 'Open',
  'button.add': 'Add',
  'button.create': 'Create',
  'button.reset': 'Reset',
  'button.reset-to-defaults': 'Reset to Defaults',

  'button.confirm': 'Confirm',

  'button.back': 'Back',

  'button.add-trade': 'Add Trade',
  'button.update-trade': 'Update Trade',
  'button.save-changes': 'Save Changes',
  'button.create-trade': 'Create Trade',
  'button.delete-all': 'Delete All',
  'button.clear-all': 'Clear All',

  'button.cancel-reset': 'Cancel Reset',
  'button.proceed-anyway': 'Proceed Anyway',
  'button.mark-reviewed': 'Mark Reviewed',
  'button.maybe-later': 'Maybe later',
  'button.upgrade-now': 'Upgrade now',

  'button.apply': 'Apply',

  'button.learn-more': 'Learn more',
  'button.upload-image': 'Upload Media',
  'button.discord': 'Discord',

  
  
  
  'form.error.image-upload-unavailable': 'Image upload not available',
  'trade.header.unknown-instrument': 'Unknown Instrument',
  'validation.edit': 'EDIT',
  'validation.fix-errors': 'Please fix the following errors:',
  'validation.setup-resolution-failed':
    'Could not prepare the selected setups. Check them and try again.',
  'validation.basic-tab-errors.one': 'Basic tab has {count} error',
  'validation.basic-tab-errors.few': 'Basic tab has {count} errors',
  'validation.basic-tab-errors.many': 'Basic tab has {count} errors',
  'validation.basic-tab-errors.other': 'Basic tab has {count} errors',
  'validation.details-tab-errors.one': 'Details tab has {count} error',
  'validation.details-tab-errors.few': 'Details tab has {count} errors',
  'validation.details-tab-errors.many': 'Details tab has {count} errors',
  'validation.details-tab-errors.other': 'Details tab has {count} errors',
  'validation.advanced-tab-errors.one': 'Advanced tab has {count} error',
  'validation.advanced-tab-errors.few': 'Advanced tab has {count} errors',
  'validation.advanced-tab-errors.many': 'Advanced tab has {count} errors',
  'validation.advanced-tab-errors.other': 'Advanced tab has {count} errors',
  'validation.complete-required': 'Please complete all required fields',

  'validation.missed-trade-requires-exit':
    'Missed trades must have exit data with non-zero prices. They represent opportunities that have already passed, so you must specify what the exit price would have been.',
  'trade.validation.entry-required': 'At least one entry is required.',
  'trade.validation.entry-time-required': 'Entry time is required.',
  'trade.validation.entry-price-required': 'Entry price is required.',
  'trade.validation.entry-size-positive':
    'Entry size must be greater than zero.',
  'trade.validation.exit-required-closed':
    'At least one exit is required for closed trades.',
  'trade.validation.exit-time-required': 'Exit time is required.',
  'trade.validation.exit-price-required': 'Exit price is required.',
  'trade.validation.exit-size-positive': 'Exit size must be greater than zero.',
  'trade.validation.exit-size-exceeds-entry':
    'Total exit size cannot exceed total entry size.',
  'trade.validation.exit-before-entry':
    'Exits cannot occur before the first entry.',
  'trade.validation.dividend-time-required': 'Dividend time is required.',
  'trade.validation.dividend-amount-nonzero':
    'Dividend amount must be a non-zero number.',
  'trade.validation.direct-pnl-required': 'Please enter a profit/loss value.',
  'trade.validation.entry-time-select': 'Please select an entry time.',
  'trade.validation.direction-required': 'Please select a direction.',
  'trade.validation.asset-type-required': 'Please select an asset type.',
  'trade.validation.ticker-required': 'Please select a Ticker.',
  'trade.validation.ticker-invalid':
    'Enter a valid ticker symbol (letters, numbers & periods only).',
  'trade.validation.account-required': 'Please select at least one account.',
  'trade.validation.exit-time-select': 'Please select an exit time.',
  'trade.validation.entry-price-invalid': 'Please enter a valid entry price.',
  'trade.validation.exit-price-invalid': 'Please enter a valid exit price.',
  'trade.validation.position-size-invalid':
    'Please enter a valid position size.',
  'trade.validation.exit-time-after-entry':
    'Exit time must be after entry time.',
  'trade.validation.expiration-date-required':
    'Please select an expiration date.',
  'trade.validation.strike-price-required': 'Please enter a strike price.',
  'trade.validation.option-type-required':
    'Please select an option type (call or put).',
  'trade.validation.contract-size-positive':
    'Contract size must be greater than zero.',
  'trade.validation.dollars-per-point-min':
    'Please enter Dollars per point (min 0.01).',
  'trade.validation.lot-size-nonnegative':
    'Lot size must be greater than zero.',
  'trade.validation.leverage-positive':
    'Leverage ratio must be greater than zero.',
  'trade.validation.commission-type-invalid':
    'Commission type must be either "fixed" or "percentage".',
  'trade.validation.commission-number': 'Commission must be a number.',
  'trade.validation.commission-percentage-range':
    'Percentage commission must be between 0 and 100.',
  'trade.validation.rebate-options-only':
    'Rebate is only allowed for options trades.',
  'trade.validation.rebate-number': 'Rebate must be a number.',
  'trade.validation.rebate-positive': 'Rebate must be a positive value.',
  'trade.validation.swap-invalid': 'Invalid swap amount.',
  'trade.validation.fees-number': 'Fees must be a number.',
  'trade.validation.risk-number': 'Risk amount must be a number.',
  'trade.validation.risk-valid-number': 'Risk amount must be a valid number.',
  'trade.validation.risk-positive': 'Risk amount must be greater than zero.',
  'trade.validation.fx-rate-number': 'FX rate must be a valid number.',
  'trade.validation.fx-rate-positive': 'FX rate must be greater than zero.',
  'trade.validation.stop-loss-number': 'Stop loss must be a number.',
  'trade.validation.stop-loss-valid-number':
    'Stop loss must be a valid number.',
  'trade.validation.take-profit-price-required':
    'Take profit price is required.',
  'trade.validation.take-profit-price-number':
    'Take profit price must be a number.',
  'trade.validation.take-profit-price-valid-number':
    'Take profit price must be a valid number.',
  'trade.validation.take-profit-close-percent-number':
    'Take profit close percent must be a number.',
  'trade.validation.take-profit-close-percent-valid-number':
    'Take profit close percent must be a valid number.',
  'trade.validation.take-profit-close-percent-range':
    'Take profit close percent must be between 1 and 100.',
  'trade.validation.take-profit-total-close-percent-range':
    'Take profit close percentages cannot exceed 100.',
  'trade.validation.take-profit-size-number':
    'Take profit size must be a valid number.',
  'trade.validation.take-profit-size-positive':
    'Take profit size must be greater than 0.',
  'trade.validation.take-profit-total-size-range':
    'Take profit sizes cannot exceed the position size.',
  'validation.custom-field.key-empty': 'Field key cannot be empty',
  'validation.custom-field.key-conflict':
    'This field name conflicts with built-in trade fields',
  'validation.custom-field.key-format':
    'Field key must start with a letter and contain only letters, numbers, and underscores',
  'validation.custom-field.required': '{label} is required',
  'validation.custom-field.text': '{label} must be text',
  'validation.custom-field.min-length':
    '{label} must be at least {minLength} characters',
  'validation.custom-field.max-length':
    '{label} must be no more than {maxLength} characters',
  'validation.custom-field.pattern-invalid': '{label} format is invalid',
  'validation.custom-field.pattern-invalid-pattern':
    '{label} has an invalid validation pattern',
  'validation.custom-field.number': '{label} must be a number',
  'validation.custom-field.min': '{label} must be at least {min}',
  'validation.custom-field.max': '{label} must be no more than {max}',
  'validation.custom-field.selection': '{label} must be a valid selection',
  'validation.custom-field.option': '{label} must be a valid option',
  'validation.custom-field.array': '{label} must be an array of selections',
  'validation.custom-field.invalid-option':
    '{label} contains invalid option: {item}',
  'validation.custom-field.date': '{label} must be a valid date',
  'validation.custom-field.time': '{label} must be a valid time',
  'validation.custom-field.time-format':
    '{label} must be a valid time format (HH:MM, HH:MM:SS, or 12-hour with AM/PM)',
  'validation.custom-field.time-values': '{label} contains invalid time values',

  
  
  

  'notice.login-success': 'Successfully logged in!',
  'notice.pro-access-ready': 'PRO access is ready.',

  'notice.logout-success': 'Successfully signed out',
  'notice.ftp-created': 'FTP credentials created successfully',
  'notice.ftp-reset': 'FTP password reset successfully! Save the new password.',
  'notice.ftp-password-rotated':
    'New FTP credentials were generated for this device. FTP sync configured on other devices (e.g. your MetaTrader EA) must be updated with the new password.',
  'notice.ftp-reused':
    'Existing FTP credentials loaded from this device. If they no longer work, use Reset password.',
  'notice.template-saved': 'Layout saved',
  'notice.template-created': 'Layout created',
  'notice.template-duplicated': 'Layout duplicated',
  'notice.template-applied': 'Applied layout: {name}',
  'notice.template-deleted': 'Layout deleted',
  'notice.default-template-updated': 'Default layout updated',
  'notice.tradelog-saved': 'TradeLog settings saved successfully',
  'notice.settings-exported': 'Settings exported to {filename}',
  'notice.settings-imported':
    'Settings imported successfully from v{version}. Restart Obsidian to apply all changes.',

  'notice.template-switched': 'Switched to: {name}',
  'notice.hotkey-set': 'Hotkey set: {hotkey}',
  'notice.auto-sync-toggled': 'Auto-sync {status}',
  'notice.auto-sync-enabled': 'enabled',
  'notice.auto-sync-disabled': 'disabled',
  'notice.reset-items': 'Reset items to defaults',

  'notice.custom-fields-imported':
    'Successfully imported {count} custom fields',

  'notice.csv-template-deleted': 'Template "{name}" deleted',
  'notice.csv-template-delete-failed': 'Failed to delete template: {error}',
  'notice.csv-template-imported': 'Template "{name}" imported successfully',
  'notice.csv-symbol-mappings-created.one': 'Created {count} symbol mapping',
  'notice.csv-symbol-mappings-created.few': 'Created {count} symbol mappings',
  'notice.csv-symbol-mappings-created.many': 'Created {count} symbol mappings',
  'notice.csv-symbol-mappings-created.other': 'Created {count} symbol mappings',
  'notice.csv-symbol-mapping-skipped': 'Skipped symbol mapping',
  'notice.csv-missing-fields':
    'Map all required fields before generating a preview.',
  'notice.setups-added': 'Added setups to {count} trades',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': 'Added mistakes to {count} trades',
  'notice.trades-duplicated.one': 'Duplicated {count} trade',
  'notice.trades-duplicated.few': 'Duplicated {count} trades',
  'notice.trades-duplicated.many': 'Duplicated {count} trades',
  'notice.trades-duplicated.other': 'Duplicated {count} trades',
  'notice.trades-deleted.one': 'Deleted {count} trade',
  'notice.trades-deleted.few': 'Deleted {count} trades',
  'notice.trades-deleted.many': 'Deleted {count} trades',
  'notice.trades-deleted.other': 'Deleted {count} trades',
  'notice.mark-reviewed.one': 'Marked {count} trade as reviewed',
  'notice.mark-reviewed.few': 'Marked {count} trades as reviewed',
  'notice.mark-reviewed.many': 'Marked {count} trades as reviewed',
  'notice.mark-reviewed.other': 'Marked {count} trades as reviewed',

  
  
  

  'notice.error.open-journalit':
    'Failed to open Journalit. Please try reloading Obsidian.',
  'notice.error.open-drc': 'Failed to open DRC: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-account-dashboard': 'Failed to open Accounts: {error}',
  'notice.error.open-trade-form-edit':
    'Failed to open trade form in edit mode: {error}',
  'notice.error.open-weekly-review': 'Failed to open Weekly Review: {error}',
  'notice.error.open-monthly-review': 'Failed to open Monthly Review: {error}',
  'notice.error.open-quarterly-review':
    'Failed to open Quarterly Review: {error}',
  'notice.error.open-yearly-review': 'Failed to open Yearly Review: {error}',
  'notice.error.open-onboarding':
    'Failed to open onboarding flow. Check console for details.',

  'notice.error.open-release-notes': 'Failed to open release notes: {error}',
  'notice.error.open-update-notification':
    'Failed to open update notification: {error}',
  'notice.error.open-layout-builder': 'Failed to open Layout Builder: {error}',
  'notice.error.switch-template': 'Failed to switch layout: {error}',
  'notice.error.switch-template-generic': 'Failed to switch layout',

  'notice.error.no-active-file': 'No active file. Open a note first.',
  'notice.error.no-template-support':
    'This note type does not support layouts.',
  'notice.error.no-templates': 'No layouts available for this note type.',
  'notice.error.asset-type-required':
    'Asset type is required when adding an instrument',
  'notice.error.column-required': 'At least one column must remain visible',
  'notice.error.save-settings': 'Error saving settings: {error}',
  'notice.error.sign-in-vault': 'Please sign in to register your vault.',
  'notice.error.sign-in-sync': 'Please sign in to use automated sync.',
  'notice.error.restore-auth':
    'Failed to restore authentication. Please sign in again from Settings → Auth.',
  'notice.error.export-settings':
    'Failed to export settings. Check console for details.',
  'notice.error.import-settings': 'Failed to import settings: {error}',
  'notice.error.reset-settings':
    'Failed to reset settings. Check console for details.',

  'notice.error.cannot-change-folder-during-sync':
    'Cannot change folder path while sync is in progress. Please wait for sync to complete.',
  'notice.error.file-not-found': 'File not found: {path}',

  'notice.error.mark-reviewed': 'Error marking trades as reviewed: {error}',
  'notice.error.add-setups': 'Error adding setups: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'Error adding mistakes: {error}',
  'notice.error.delete-trades': 'Error deleting trades: {error}',
  'notice.error.duplicate-trades': 'Error duplicating trades: {error}',
  'notice.error.csv-validation': 'CSV/XLSX/XLS validation failed: {errors}',
  'notice.error.import-failed': 'Import failed: {error}',
  'notice.error.file-too-large': 'File is too large. Maximum size is 10MB',
  'notice.error.select-csv': 'Please select a CSV/XLSX/XLS/HTML file',
  'notice.error.cannot-delete-builtin': 'Cannot delete built-in layouts',
  'notice.error.duplicate-to-customize':
    'Duplicate this layout to customise it',
  'notice.error.sign-out': 'Failed to sign out. Please try again.',
  'notice.error.open-upgrade-modal':
    'A premium feature was requested but the upgrade dialog failed to load.',

  
  
  

  'notice.plugin-updated': 'Journalit updated to v{version}!',

  'notice.info.settings-recovered':
    'Settings were recovered from backup. Some recent changes may be lost.',
  'notice.info.cannot-remove-locked': 'Cannot remove locked widgets',

  
  'notice.sync-mapping.updating':
    'Updating trade sync mappings for new folder path...',
  'notice.sync-mapping.updated': 'Trade sync mappings updated successfully',
  'notice.error.sync-mapping-update-failed':
    'Failed to update trade sync mappings. Please restart the plugin.',

  
  
  
  'tradelog.title': 'Trade Log',
  'tradelog.root.all-trades': 'All Trades',
  'tradelog.view.selector.label': 'View',

  'trade-form.guide.customization-modal.title':
    'Tailor the form to your workflow',
  'trade-form.guide.customization-modal.description':
    'Here you can show, hide, and reorder optional blocks. Keep the form focused on the fields you actually use.',
  'trade-form.guide.finish.title': 'That is the customisation feature',
  'trade-form.guide.finish.description':
    'You can revisit this button any time the Trade Form needs to match a different journaling workflow.',
  'tradelog.guide.empty.intro.title': 'Welcome to Trade Log',
  'tradelog.guide.empty.intro.description':
    'This page becomes your main place for browsing, sorting, and reviewing trades. Once you add trades, you will also get the full Trade Log tour.',
  'tradelog.guide.empty.state.title': 'No trading data available',
  'tradelog.guide.empty.state.description':
    'Import previous trades to explore your performance now, or record a new trade manually.',
  'tradelog.guide.intro.title': 'This is your Trade Log',
  'tradelog.guide.intro.description':
    'Use this page to review trades one by one, sort them, filter them, and make changes to many trades at once.',
  'tradelog.guide.view-selector.title':
    'Choose how you want to review your history',
  'tradelog.guide.view-selector.description':
    'Use this menu to switch between the full trade table and grouped time views like months, weeks, or days. Trades is the default, but grouped views are useful when you want to review by period.',
  'tradelog.guide.filters.title': 'Use filters to narrow the Trade Log',
  'tradelog.guide.filters.description':
    'Open filters when you want to review only certain accounts, setups, tags, trade types, statuses, or dates.',
  'tradelog.guide.filter-modal.title': 'These are your detailed filters',
  'tradelog.guide.filter-modal.description':
    'Use this modal when you want more control over exactly which trades are shown. Close it when you are done reviewing or changing filters.',
  'tradelog.guide.sorting.title': 'Click column headers to sort the table',
  'tradelog.guide.sorting.description':
    'In Trades view, click a sortable column header to reorder the table. For example, click Net P&L to sort by your biggest win and biggest loss.',
  'tradelog.guide.gallery-mode.title': "There's also an image gallery",
  'tradelog.guide.gallery-mode.description':
    'Switch modes here to browse your trade screenshots as a gallery. A short guide will show you around the first time you open it.',
  'tradelog.guide.multi-select.title': 'Turn on multi-select',
  'tradelog.guide.multi-select.description':
    'Click this button to select several trades at once. When multi-select is on, row clicks select trades instead of opening them.',
  'tradelog.guide.batch-actions.title': 'These are your batch actions',
  'tradelog.guide.batch-actions.description':
    'Use this bar to select all visible trades, clear your selection, mark trades as reviewed, add setups, add mistakes, duplicate trades, or delete several trades at once. You can also shift-click to select a range of trades.',
  'tradelog.guide.column-settings.title': 'Open column settings',
  'tradelog.guide.column-settings.description':
    'Click this button to choose which columns are shown and how dense or detailed the table should feel.',
  'tradelog.guide.active-columns.title':
    'Reorder or remove the columns you already use',
  'tradelog.guide.active-columns.description':
    'In Active Columns, drag a column to move it, or remove one you do not need. This changes the order of the table from left to right.',
  'tradelog.guide.available-columns.title':
    'Add hidden columns back when you need more detail',
  'tradelog.guide.available-columns.description':
    'Open Available Columns to add fields back into the table. That is where you bring back anything you removed earlier.',
  'tradelog.guide.open-trades.title':
    'Click a trade when you want to open its note',
  'tradelog.guide.open-trades.description':
    'In normal mode, clicking a trade opens it. In multi-select mode, clicking selects it instead. Switch between those two behaviours depending on what you want to do.',
  'dashboard.guide.empty.intro.title': 'Welcome to your Dashboard',
  'dashboard.guide.empty.intro.description':
    'Your Dashboard becomes useful as soon as Journalit has trading history to analyse.',
  'dashboard.guide.empty.state.title': 'Bring your trading history with you',
  'dashboard.guide.empty.state.description':
    'Import previous trades to start with meaningful performance data, or add a trade manually if you are recording your first trades.',
  'dashboard.guide.main.intro.title': 'This is your dashboard',
  'dashboard.guide.main.intro.description':
    'Use this page to track your performance, review your stats, and keep your most useful charts in one place.',
  'dashboard.guide.main.filters.title': 'Filters change the whole Dashboard',
  'dashboard.guide.main.filters.description':
    'Use filters when you want every stat and chart on this page to update for a different date range, account, setup, tag, or trade type.',
  'dashboard.guide.main.edit-layout.title':
    'Turn on edit mode to customise this page',
  'dashboard.guide.main.edit-layout.description':
    'Click Edit Layout to unlock moving, resizing, removing, and adding Dashboard widgets.',
  'dashboard.guide.main.open-widget-selector.title': 'Open Add Widget',
  'dashboard.guide.main.open-widget-selector.description':
    'Click Add Widget to add more charts and bring back widgets you removed earlier.',
  'dashboard.guide.main.widget-picker.title': 'Pick what you want to show',
  'dashboard.guide.main.widget-picker.description':
    'This picker shows the charts and metrics that are not currently on your Dashboard. Click one to add it.',
  'dashboard.guide.main.metrics.title':
    'These top cards are your quick summary',
  'dashboard.guide.main.metrics.description':
    'The top row gives you fast answers like profit, win rate, and total trades. In edit mode, you can change which cards appear and reorder them.',
  'dashboard.guide.main.bottom.title':
    'This is where moving and resizing happens',
  'dashboard.guide.main.bottom.description':
    'While Edit Layout is on, drag a widget to move it. To resize a widget, drag its bottom-right corner. This is the step many users miss.',
  'dashboard.guide.main.save-layout.title':
    'Save your layout when you are done',
  'dashboard.guide.main.save-layout.description':
    'When you finish customising, click Save Layout to keep your changes. You can come back and edit this page again anytime.',
  'home.guide.intro.title': 'Welcome home',
  'home.guide.intro.description':
    'This is your main page. It shows your trading stats, quick actions, and shortcuts to the rest of Journalit.',
  'home.guide.filters.title': 'These buttons change what your widgets show',
  'home.guide.filters.description':
    'Use these to switch the time period, trade type, or account so your Home widgets show the data you want to look at.',
  'home.guide.settings.title': 'Your Journalit settings are always close by',
  'home.guide.settings.description':
    'Use this button to open Journalit settings directly.',
  'home.guide.customize.title': 'Turn on edit mode to customise Home',
  'home.guide.customize.description':
    'Click this button to start customising. Edit mode unlocks moving, resizing, removing, and adding widgets.',
  'home.guide.quick-links-position.title':
    'Move Quick Links above or below the widgets',
  'home.guide.quick-links-position.description':
    'Use this button to choose whether the Quick Links row sits above the main widget area or below it.',
  'home.guide.quick-links.title': 'These Quick Links are your fast shortcuts',
  'home.guide.quick-links.description':
    'Quick Links give you one-click shortcuts to common actions and pages. In edit mode, you can also hide links you do not want showing here.',
  'home.guide.move-and-resize.title': 'Move and resize your widgets',
  'home.guide.widget-picker.title': 'Add widgets here',
  'home.guide.widget-picker.description':
    'Add widgets, restore hidden Quick Links, or add account and setup shortcuts.',
  'home.guide.move-and-resize.description':
    'This is the main area you can rearrange in edit mode. Drag widgets to move them, or drag a widget from its bottom-right corner to resize it.',
  'home.guide.add-widget.title': 'Add items to Home',
  'home.guide.add-widget.description':
    'Open Add Widget to add widgets, Quick Links, or account and setup shortcuts.',
  'home.guide.save-layout.title': 'Save your layout when you are done',
  'home.guide.save-layout.description':
    'When you are happy with the layout, click this button to save your changes and leave edit mode.',
  'home.guide.widget-interactions.title': 'That is the main idea of Home',
  'home.guide.widget-interactions.description':
    'Home is your customisable dashboard. Use edit mode to change the layout, and click widgets to open tools, settings, or deeper pages.',
  'layoutBuilder.guide.intro.title': 'This is your Layout Builder',
  'layoutBuilder.guide.intro.description':
    'This page controls how your review layouts are structured. The easiest way to start is to duplicate a built-in layout, then customise your copy.',
  'layoutBuilder.guide.sidebar-overview.title':
    'This sidebar is where you choose what you are editing',
  'layoutBuilder.guide.sidebar-overview.description':
    'Each section in the sidebar is a different layout type. Trade layouts are separate from your review layouts, and the Library section is for sharing layouts. After you make your own copy, you can star it to make it the default for new review notes.',
  'layoutBuilder.guide.pick-built-in.title': 'Start with a built-in DRC layout',
  'layoutBuilder.guide.pick-built-in.description':
    'For your first layout, start with one of the built-in DRC layouts. It gives you a safe starting point before you make your own copy.',
  'layoutBuilder.guide.duplicate.title': 'Duplicate the built-in layout',
  'layoutBuilder.guide.duplicate.description':
    'Built-in layouts are starting points. Duplicate one first so you can safely make your own version.',
  'layoutBuilder.guide.preview-template.title':
    'This preview shows what the layout will look like',
  'layoutBuilder.guide.preview-template.description':
    'Scroll through the preview and get a feel for the flow. This is useful for checking whether the layout reads clearly before you start editing it.',
  'layoutBuilder.guide.switch-to-editor.title': 'Switch to Editor',
  'layoutBuilder.guide.switch-to-editor.description':
    'Preview shows you what the layout will look like. Editor is where you actually change it.',
  'layoutBuilder.guide.editor-overview.title':
    'This is where you edit the layout',
  'layoutBuilder.guide.editor-overview.description':
    'Rename the layout here, review the widget list, drag the left handle to rearrange widgets, click a widget to change it, and remove anything you do not need.',
  'layoutBuilder.guide.add-widget.title': 'Add a widget to your copy',
  'layoutBuilder.guide.add-widget.description':
    'Use Add Widget to put new blocks into your layout. This is how you shape the workflow to match how you review.',
  'layoutBuilder.guide.open-widget-picker.title': 'Open the widget picker',
  'layoutBuilder.guide.open-widget-picker.description':
    'This picker shows the widgets you can add for this review type.',
  'layoutBuilder.guide.choose-widget.title': 'Choose a widget',
  'layoutBuilder.guide.choose-widget.description':
    'Type in the search box to find a widget by name, description, or category, then choose it. You can also press Next and Journalit will choose the first result for you.',
  'layoutBuilder.guide.widget-library-docs.title':
    'Use the widget library if you get stuck',
  'layoutBuilder.guide.widget-library-docs.description':
    'This opens the docs page with the widget library, examples, and availability table for each review type.',
  'layoutBuilder.guide.save-template.title': 'Save your layout',
  'layoutBuilder.guide.save-template.description':
    'Once your copy looks right, save it. You can keep refining it later as your review process improves.',
  'layoutBuilder.guide.set-default-template.title':
    'Set this copy as your default layout',
  'layoutBuilder.guide.set-default-template.description':
    'Click the star on your new layout if you want new review notes to use this layout automatically.',
  'tradelog.empty': 'No trades found',
  'tradelog.empty.submessage':
    'Start creating trade notes to see them appear in your trade log.',
  'tradelog.processing': 'Processing trade data...',
  'tradelog.node.file-not-found': 'Trade file not found: {path}',
  'tradelog.node.expand': 'Expand',
  'tradelog.node.collapse': 'Collapse',
  'tradelog.node.navigate-to-review': 'Navigate to {type} review',
  'tradelog.node.performance.year': '{indicator} performing year',
  'tradelog.node.performance.quarter':
    '{indicator} performing quarter of {year}',
  'tradelog.node.performance.month':
    '{indicator} performing month of {quarter} {year}',
  'tradelog.node.performance.week':
    '{indicator} performing week of {month} {year}',
  'tradelog.node.performance.day':
    '{indicator} performing day of {week} {year}',
  'tradelog.node.performance.period': '{indicator} performing period',
  'tradelog.filter.all': 'All Statuses',
  'tradelog.filter.all.desc': 'All trade statuses',
  'tradelog.filter.all-review-statuses': 'All Reviews',
  'tradelog.filter.all-directions': 'All Directions',
  'tradelog.filter.winners': 'Winners',
  'tradelog.filter.winners.desc': 'Winning trades',
  'tradelog.filter.losers': 'Losers',
  'tradelog.filter.losers.desc': 'Losing trades',
  'tradelog.filter.breakeven': 'Breakeven',
  'tradelog.filter.breakeven.desc': 'Breakeven trades',
  'tradelog.filter.open': 'Open',
  'tradelog.filter.open.desc': 'Currently open positions',
  'tradelog.filter.closed': 'Closed',
  'tradelog.filter.closed.desc': 'All closed positions (win/loss/breakeven)',
  'tradelog.type.all': 'All Types',
  'tradelog.type.all.desc': 'All trade types',
  'tradelog.type.regular': 'Regular',
  'tradelog.type.regular.desc': 'Standard trades',
  'tradelog.type.missed': 'Missed',
  'tradelog.type.missed.desc': 'Missed opportunities',
  'tradelog.type.backtest': 'Backtest',
  'tradelog.type.backtest.desc': 'Simulated trades',

  
  'tradelog.status.win': 'WIN',
  'tradelog.status.loss': 'LOSS',
  'tradelog.status.open': 'OPEN',
  'tradelog.status.partially-closed': 'PARTIALLY CLOSED',
  'tradelog.status.cancelled': 'CANCELLED',
  'tradelog.status.breakeven': 'BREAKEVEN',
  'tradelog.status.missed': 'MISSED',
  'tradelog.status.backtest': 'BACKTEST',
  'tradelog.status.expired': 'EXPIRED',

  
  'tradelog.no-columns': 'No columns configured',
  'tradelog.duration.ongoing': '(ongoing)',
  'tradelog.tooltip.mistakes': 'Mistakes:',
  'tradelog.tooltip.setups': 'Setups:',
  'tradelog.tooltip.tags': 'Tags:',
  'tradelog.tooltip.thesis': 'Thesis:',
  'tradelog.tooltip.mtComment': 'MT Comment:',
  'tradelog.tooltip.accounts': 'Accounts:',
  'tradelog.copy-trade.tooltip': 'Copied from {account} at {multiplier}x',
  'tradelog.tooltip.partial-exits': 'Partial Exits:',
  'tradelog.copy-trade.base-tooltip-title': 'Copied account results',
  'tradelog.copy-trade.adjustment-action': 'Adjust copied PnL',
  'tradelog.copy-trade.adjustment-title': 'Adjust copied PnL',
  'tradelog.copy-trade.adjustment-description-primary':
    'Enter the manual PnL adjustment for this copied trade.',
  'tradelog.copy-trade.adjustment-description-secondary':
    'Use a negative number for worse fills/costs.',
  'tradelog.copy-trade.adjustment-preview': 'Preview net P&L:',

  'tradelog.copy-trade.adjustment-invalid': 'Enter a valid PnL adjustment.',
  'tradelog.copy-trade.adjustment-saved': 'Copied trade PnL adjustment saved.',
  'tradelog.tooltip.still-open': 'still open',

  'tradelog.alt.trade-image': '{instrument} Image',
  'tradelog.alt.trade-image-n': '{instrument} Image {n}',

  
  'tradelog.batch.delete-confirm.title': 'Confirm Deletion',
  'tradelog.batch.delete-confirm.message.one':
    'Are you sure you want to delete {count} selected trade?',
  'tradelog.batch.delete-confirm.message.few':
    'Are you sure you want to delete {count} selected trades?',
  'tradelog.batch.delete-confirm.message.many':
    'Are you sure you want to delete {count} selected trades?',
  'tradelog.batch.delete-confirm.message.other':
    'Are you sure you want to delete {count} selected trades?',
  'tradelog.batch.delete-confirm.warning': 'This action cannot be undone.',
  'tradelog.batch.setups.title': 'Add Setups to Trades',
  'tradelog.batch.setups.placeholder': 'Select or create setups...',
  'tradelog.batch.tags.title': 'Add Tags to Trades',
  'tradelog.batch.tags.placeholder': 'Select or create tags...',
  'tradelog.batch.mistakes.title': 'Add Mistakes to Trades',
  'tradelog.batch.mistakes.placeholder': 'Select or create mistakes...',
  'tradelog.batch.none-selected': 'NONE SELECTED',
  'tradelog.batch.selected-count': '{count} SELECTED',
  'tradelog.batch.select-all.title': 'Select all visible trades',
  'tradelog.batch.select-all.label': 'Select All',

  'tradelog.batch.already-reviewed':
    'All {total} selected trades are already reviewed',
  'tradelog.batch.already-reviewed-single':
    'The selected trade is already reviewed',
  'tradelog.batch.already-reviewed-plain': 'already reviewed',
  'tradelog.batch.no-updates-needed':
    'No trades needed updates - all {total} already had these {type}',
  'tradelog.batch.already-had-all': '{count} already had all {type}',
  'tradelog.batch.errors-count.one': '{count} error occurred',
  'tradelog.batch.errors-count.few': '{count} errors occurred',
  'tradelog.batch.errors-count.many': '{count} errors occurred',
  'tradelog.batch.errors-count.other': '{count} errors occurred',
  'tradelog.batch.enable-multi-select': 'Enable multi-select',
  'tradelog.batch.disable-multi-select': 'Disable multi-select',
  'tradelog.batch.column-settings': 'Column settings',
  'tradelog.batch.marking-reviewed': 'Marking...',
  'tradelog.batch.add-setups.aria': 'Add setups',

  'tradelog.batch.add-setups.label': 'Add Setups',
  'tradelog.batch.add-tags.aria': 'Add tags',

  'tradelog.batch.add-tags.label': 'Add Tags',
  'tradelog.batch.add-mistakes.aria': 'Add mistakes',

  'tradelog.batch.add-mistakes.label': 'Add Mistakes',
  'tradelog.batch.adding': 'Adding...',
  'tradelog.batch.add-count': 'Add ({count})',
  'tradelog.batch.duplicate.aria': 'Duplicate trades',
  'tradelog.batch.duplicate.label': 'Duplicate',
  'tradelog.batch.duplicating': 'Duplicating...',
  'tradelog.batch.duplicate-skipped.one':
    '{count} selected note cannot be duplicated',
  'tradelog.batch.duplicate-skipped.few':
    '{count} selected notes cannot be duplicated',
  'tradelog.batch.duplicate-skipped.many':
    '{count} selected notes cannot be duplicated',
  'tradelog.batch.duplicate-skipped.other':
    '{count} selected notes cannot be duplicated',
  'tradelog.batch.delete.aria': 'Delete trades',

  'tradelog.batch.deleting': 'Deleting...',
  'tradelog.batch.clear.aria': 'Clear selection',

  'tradelog.batch.clear.label': 'Clear',

  
  
  
  'tradelog.settings.active-columns': 'Active Columns',
  'tradelog.settings.available-columns': 'Available Columns',
  'tradelog.settings.active-desc':
    'Drag to reorder columns. Click X to remove.',
  'tradelog.settings.available-desc': 'Click a column to add it to your table.',
  'tradelog.settings.no-active':
    'No active columns. Add columns from the Available tab.',
  'tradelog.settings.all-active': 'All columns are active.',
  'tradelog.settings.expanded-view': 'Expanded View',
  'tradelog.settings.expanded-view-desc':
    'Show tags, setups, and mistakes as pill badges',
  'tradelog.settings.expanded-view-aria': 'Toggle expanded view mode',
  'tradelog.settings.saving': 'Saving...',
  'tradelog.settings.reset': 'Reset to Defaults',

  'tradelog.category.basic': 'Basic Info',
  'tradelog.category.timing': 'Timing',
  'tradelog.category.prices': 'Prices',
  'tradelog.category.risk': 'Risk Management',
  'tradelog.category.position': 'Position & P/L',
  'tradelog.category.review': 'Review',

  'tradelog.column.image': 'Image',
  'tradelog.column.account': 'Account',
  'tradelog.column.ticker': 'Ticker',
  'tradelog.column.exchange': 'Exchange',
  'tradelog.column.status': 'Status',
  'tradelog.column.direction': 'Direction',
  'tradelog.column.date': 'Open Date',
  'tradelog.column.entryTime': 'Entry Time',
  'tradelog.column.exitDate': 'Close Date',
  'tradelog.column.exitTime': 'Exit Time',
  'tradelog.column.duration': 'Duration',
  'tradelog.column.expirationDate': 'Expiry',
  'tradelog.column.daysToExpiry': 'DTE',
  'tradelog.column.entryPrice': 'Entry',
  'tradelog.column.exitPrice': 'Exit',
  'tradelog.column.priceMove': 'Price Move',
  'tradelog.column.stopLoss': 'Stop Loss',
  'tradelog.column.slDistanceDollar': 'SL Dist $',
  'tradelog.column.slDistancePercent': 'SL Dist %',
  'tradelog.column.riskAmount': 'Risk $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.maePrice': 'MAE Price',
  'tradelog.column.mfePrice': 'MFE Price',
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': 'Size #',
  'tradelog.column.positionValue': 'Size $',
  'tradelog.column.fees': 'Fees',
  'tradelog.column.dividends': 'Dividends',
  'tradelog.column.pnl': 'Net P&L',
  'tradelog.column.returnPercent': 'Return %',
  'tradelog.column.setups': 'Setups',
  'tradelog.column.mistakes': 'Mistakes',
  'tradelog.column.tags': 'Tags',
  'tradelog.column.reviewed': 'Reviewed',
  'tradelog.column.thesis': 'Thesis',
  'tradelog.column.mtComment': 'MT Comment',

  
  
  
  'dashboard.title': 'Dashboard',
  'dashboard.empty.message': 'No trading data available',
  'dashboard.empty.submessage':
    'Import previous trades to explore your performance now, or record a new trade manually.',
  'dashboard.empty.import-action': 'Import existing trades',
  'dashboard.empty.manual-action': 'Add a trade manually',
  'dashboard.empty.filter-hint': 'Try adjusting your filter settings',
  'dashboard.error.load-failed': 'Failed to load data',
  'dashboard.no-data': 'No trading data available',
  'dashboard.button.add-widget': 'Add Widget',
  'dashboard.button.save-layout': 'Save Layout',
  'dashboard.button.edit-layout': 'Edit Layout',

  
  'dashboard.metrics.netPnL': 'Net P&L',
  'dashboard.metrics.incl-unrealized': 'incl. {value} unrealized',
  'dashboard.metrics.winRate': 'Win Rate',
  'dashboard.metrics.profitFactor': 'Profit Factor',
  'dashboard.metrics.sharpeRatio': 'Sharpe Ratio',
  'dashboard.metrics.expectancy': 'Expectancy',
  'dashboard.metrics.numTrades': 'Total Trades',

  'dashboard.metrics.numWinTrades': 'Winning Trades',
  'dashboard.metrics.numLossTrades': 'Losing Trades',
  'dashboard.metrics.avgWin': 'Avg Win',
  'dashboard.metrics.avgLoss': 'Avg Loss',
  'dashboard.metrics.totalCommission': 'Total Commission',
  'dashboard.metrics.totalFees': 'Total Fees',
  'dashboard.metrics.maxDrawdown': 'Max Drawdown',
  'dashboard.metrics.bestDay': 'Best Day',
  'dashboard.metrics.largestWin': 'Largest Win',
  'dashboard.metrics.largestLoss': 'Largest Loss',
  'dashboard.metrics.longestWinStreak': 'Best Streak',
  'dashboard.metrics.longestLossStreak': 'Worst Streak',
  'dashboard.metrics.avgHoldTime': 'Avg Hold Time',
  'dashboard.metrics.avgWinHoldTime': 'Avg Win Hold Time',
  'dashboard.metrics.avgLossHoldTime': 'Avg Loss Hold Time',
  'dashboard.metrics.avgWinnerHeat': 'Avg Winner Heat',
  'dashboard.metrics.winnerMaeP90': 'Winner MAE P90',
  'dashboard.metrics.winnerMaeMedian': 'Winner MAE Median',
  'dashboard.metrics.avgLossHeat': 'Avg Loss Heat',
  'dashboard.metrics.winnerAvgMfe': 'Winner Avg MFE',
  'dashboard.metrics.loserAvgMfe': 'Loser Avg MFE',
  'dashboard.metrics.winnerMfeP90': 'Winner MFE P90',
  'dashboard.metrics.loserMfeP90': 'Loser MFE P90',
  'dashboard.metrics.avgRR': 'Avg RR (Payoff)',
  'dashboard.metrics.avgRRRiskBased': 'Avg RR (R-Based)',
  'dashboard.avgRR.tooltip.formula': 'Formula: average win / average loss',
  'dashboard.avgRR.tooltip.no-conversion':
    'This payoff ratio is based on mixed currencies without FX conversion and may be misleading.',
  'dashboard.sharpeRatio.tooltip.title': 'Sharpe Ratio',
  'dashboard.sharpeRatio.tooltip.formula':
    'Formula: average closed-trade net P&L / sample standard deviation of closed-trade net P&L. Risk-free rate is 0 and the value is not annualized.',
  'dashboard.sharpeRatio.tooltip.coverage':
    'Computed from {valid} of {total} closed trades',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'Partial coverage: {valid} of {total} closed trades have finite net P&L.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'Requires at least two closed trades with non-zero P&L variability.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'This Sharpe Ratio is based on mixed currencies without FX conversion and may be misleading.',
  'dashboard.avgRRRiskBased.tooltip.title': 'Avg RR (R-Based)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'Formula: average winning R / average losing R',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    'Computed from {valid} of {total} closed trades with risk data',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'Risk-valid wins: {wins}, losses: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'Partial risk coverage: {valid} of {total} closed trades have valid risk data.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'Insufficient data for R-based RR. Add stop-loss/risk data and ensure there are valid winning and losing trades.',

  
  'dashboard.conversion.title': 'Converted to {currency}',
  'dashboard.conversion.converted-total': 'Converted Total',
  'dashboard.conversion.base': 'Base: {currency}',

  'dashboard.conversion.using-ecb': 'Using ECB rates ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Using broker-provided base-currency P&L for {count} {tradeLabel}',
  'dashboard.conversion.using-manual-rate':
    'Using a manual FX rate for {count} {tradeLabel}',
  'dashboard.conversion.partial-warning':
    '⚠ Costs/risk in {currencies} could not be converted and are excluded',
  'dashboard.conversion.trade-singular': 'trade',
  'dashboard.conversion.trade-plural': 'trades',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} of {total} trades ({excluded} excluded: {currencies})',
  'dashboard.conversion.original-pnl': 'Original P&L',
  'dashboard.conversion.converted-pnl': 'Converted P&L',
  'dashboard.conversion.details-label': 'Currency conversion details',

  'dashboard.top-section.add-metric': 'Add Metric',
  'dashboard.top-section.remove-metric': 'Remove metric',
  'dashboard.top-section.failed-load': 'Failed to load metrics',

  
  'dashboard.filter.date.today': 'Today',
  'dashboard.filter.date.yesterday': 'Yesterday',
  'dashboard.filter.date.this-week': 'This Week',
  'dashboard.filter.date.this-month': 'This Month',
  'dashboard.filter.date.this-quarter': 'This Quarter',
  'dashboard.filter.date.this-year': 'This Year',
  'dashboard.filter.date.all-time': 'All Time',
  'dashboard.filter.date.custom': 'Custom',
  'dashboard.filter.date.from': 'From',
  'dashboard.filter.date.to': 'To',

  
  'dashboard.filter.accounts.all': 'All Accounts',
  'dashboard.filter.accounts.n-selected': '{count} Accounts',
  'dashboard.filter.accounts.select-all': 'Select All',

  'dashboard.filter.accounts.none-found': 'No accounts found',
  'dashboard.filter.accounts.phase-now': 'now',

  
  'dashboard.filter.tags.all': 'All Tags',
  'dashboard.filter.tags.none': 'No Tags',
  'dashboard.filter.tags.n-selected': '{count} Tags',
  'dashboard.filter.tags.select-all': 'Select All',
  'dashboard.filter.tags.none-found': 'No tags found',

  
  'dashboard.filter.mistakes.all': 'All Mistakes',
  'dashboard.filter.mistakes.none': 'No Mistakes',
  'dashboard.filter.mistakes.n-selected': '{count} Mistakes',
  'dashboard.filter.mistakes.select-all': 'Select All',
  'dashboard.filter.mistakes.none-found': 'No mistakes found',

  
  'dashboard.filter.tickers.all': 'All Tickers',
  'dashboard.filter.tickers.n-selected': '{count} Tickers',
  'dashboard.filter.tickers.select-all': 'Select All',
  'dashboard.filter.tickers.none-found': 'No tickers found',

  
  'dashboard.filter.setup.all': 'All Setups',
  'dashboard.filter.setup.none': 'No Setup',
  'dashboard.filter.setup.n-selected': '{count} Setups',
  'dashboard.filter.setup.select-all': 'Select All',

  
  'dashboard.widgets.daily-performance.title': 'Daily Performance',
  'dashboard.widgets.daily-performance.period-aria': 'Period',
  'dashboard.widgets.daily-performance.period-days': '{count} Days',
  'dashboard.widgets.weekday-performance.title': 'Weekday Performance',
  'dashboard.widgets.weekday-performance.metric-aria': 'Metric',
  'dashboard.widgets.weekday-performance.metric.net': 'Net',
  'dashboard.widgets.weekday-performance.metric.win-rate': 'Win Rate',
  'dashboard.widgets.weekday-performance.metric.trades': 'Trades',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    'Win Rate: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.weekday-performance.tooltip.trades': 'Trades: {count}',
  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'No trades',
  'dashboard.widgets.hourly-performance.title': 'Hourly Performance',
  'dashboard.widgets.hourly-performance.tooltip.trades': 'Trades: {count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label': 'Win Rate',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    'Win Rate: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.hourly-performance.bucket-aria': 'Bucket size',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes}m',
  'dashboard.widgets.hourly-performance.metric-aria': 'Metric',
  'dashboard.widgets.hourly-performance.metric.total': 'Total',
  'dashboard.widgets.hourly-performance.metric.average': 'Average',

  'dashboard.widgets.hourly-performance.metric.total-r': 'Total R',

  'dashboard.widgets.setup-performance.title': 'Setup Performance',
  'dashboard.widgets.setup-performance.description':
    'Ranked bar chart comparing performance by setup',
  'dashboard.widgets.setup-performance.empty': 'No setup performance data',
  'dashboard.widgets.setup-performance.masked-label': 'Setup',
  'dashboard.widgets.tag-performance.title': 'Tag Performance',
  'dashboard.widgets.tag-performance.description':
    'Ranked bar chart comparing performance by tag',
  'dashboard.widgets.tag-performance.empty': 'No tag performance data',
  'dashboard.widgets.tag-performance.masked-label': 'Tag',
  'dashboard.widgets.ticker-performance.title': 'Ticker Performance',
  'dashboard.widgets.ticker-performance.metric-aria': 'Metric',
  'dashboard.widgets.ticker-performance.view-aria': 'View',
  'dashboard.widgets.ticker-performance.view.best-and-worst': 'Best & worst',
  'dashboard.widgets.ticker-performance.view.best': 'Best 10',
  'dashboard.widgets.ticker-performance.view.worst': 'Worst 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'Total P&L',
  'dashboard.widgets.ticker-performance.metric.total-r': 'Total R',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'Win Rate',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'Ticker: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': 'Trades: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Win Rate: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.ticker-performance.empty': 'No ticker performance data',
  'dashboard.widgets.ticker-performance.empty-submessage':
    'No closed trades with a ticker match the current filters.',
  'dashboard.widgets.ticker-performance.masked-ticker': 'Ticker',
  'dashboard.widgets.ticker-performance.omitted-count': '{count} omitted',

  'dashboard.widgets.rollingStats.title': 'Rolling Avg Win/Loss',
  'dashboard.widgets.rollingStats.period': 'Period',
  'dashboard.widgets.rollingStats.trades': '{count} Trades',
  'dashboard.widgets.rollingStats.avgWin': 'Avg Win',
  'dashboard.widgets.rollingStats.avgLoss': 'Avg Loss',
  'dashboard.widgets.rollingStats.tooltip.trade': 'Trade {label}',

  
  'dashboard.rolling_win_loss.title': 'Rolling Win/Loss Ratio',
  'dashboard.rolling_win_loss.period_aria': 'Period',
  'dashboard.rolling_win_loss.trades_count': '{count} Trades',
  'dashboard.rolling_win_loss.trade_label': 'Trade {label}',
  'dashboard.rolling_win_loss.ratio_label': 'Ratio: {ratio}',
  'dashboard.rolling_win_loss.ratio_undefined': 'Ratio: no losses in window',
  'dashboard.rolling_win_loss.avg_win_label': 'Avg Win: {value}',
  'dashboard.rolling_win_loss.no_losses_band': 'No losses',
  'dashboard.rolling_win_loss.window_not_filled':
    'Needs at least {count} closed trades',
  'dashboard.rolling_win_loss.avg_loss_label': 'Avg Loss: {value}',

  
  
  
  'home.widget.recent-items.name': 'Recent Items',
  'home.widget.recent-items.description':
    'Shows recently opened files and views',
  'home.widget.year-heatmap.name': 'Trading Heatmap',
  'home.widget.year-heatmap.description':
    'Calendar showing your trading activity for the year',
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description':
    'Checklist to help you add trading history and configure Journalit',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.account.title':
    'Set up your trading account',
  'home.widget.getting-started.item.account.description':
    'Trades are logged against an account that tracks your balance. Without one, returns and drawdown cannot be calculated.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'Set up account',
  'home.widget.getting-started.item.create.title':
    'Bring in your trading history',
  'home.widget.getting-started.item.create.description':
    'Import existing trades, connect Trade Sync, or add your first trade manually.',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Open Trade Import',
  'home.widget.getting-started.item.tradelog.title': 'Open Trade Log',
  'home.widget.getting-started.item.tradelog.description':
    'Your trade database for analysing all your trades in one place.',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta': 'Open Trade Log',
  'home.widget.getting-started.item.layouts.title': 'Open Layout Builder',
  'home.widget.getting-started.item.layouts.description':
    'Design your review layouts your way.',
  'home.widget.getting-started.item.layouts.time': '1 min',
  'home.widget.getting-started.item.layouts.cta': 'Open Layout Builder',
  'home.widget.getting-started.item.sidebar.title':
    'Open the navigation sidebar',
  'home.widget.getting-started.item.sidebar.description':
    "Keep Journalit's pages, reviews, tools, and search within reach.",
  'home.widget.getting-started.item.sidebar.time': '10s',
  'home.widget.getting-started.item.sidebar.cta': 'Open Sidebar',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    'Enable Trade Import, Trade Sync, and the Economic Calendar.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',
  'home.widget.weekly-summary.name': 'Weekly Summary',
  'home.widget.weekly-summary.description':
    'Current week metrics with daily P&L sparkline chart',
  'home.widget.key-events.name': 'Key Events',
  'home.widget.key-events.description':
    'Important news and market events from the current Weekly Review',
  'home.widget.key-events.empty-title': 'No key events yet',
  'home.widget.key-events.open-aria': "Open this week's Weekly Review",
  'home.widget.position-size.name': 'Position Size Calculator',
  'home.widget.position-size.description':
    'Calculate position size based on account risk percentage',
  'home.widget.embedded-note.name': 'Embedded Note',
  'home.widget.embedded-note.description':
    'Display any markdown note from your vault',
  'home.widget.current-streak.name': 'Current Streak',
  'home.widget.current-streak.description': 'Track trade and review streaks',
  'home.widget.best-hours.name': 'Best Hours',
  'home.widget.best-hours.description':
    'See when you trade best by time of day',
  'home.widget.setup-leaderboard.name': 'Top Breakdown',
  'home.widget.setup-leaderboard.description':
    'Compare your top setups, tags, asset types, or tickers',
  'home.widget.unreviewed-trades.name': 'Unreviewed Trades',
  'home.widget.unreviewed-trades.description': 'Trades that need your review',
  'home.widget.goals-progress.name': 'Goal Progress',
  'home.widget.goals-progress.description':
    'Track progress toward your trading goal',
  'home.widget.trading-score.name': 'Trading Score',
  'home.widget.trading-score.description':
    'Comprehensive performance score with radar chart visualization',
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description':
    'Total assets under management with 7-day trend sparkline',
  'home.widget.drawdown-monitor.name': 'Drawdown Monitor',
  'home.widget.drawdown-monitor.description':
    'Track drawdown status across accounts with limits configured',
  'home.widget.profit-target-widget.name': 'Profit Target',
  'home.widget.profit-target-widget.description':
    'Track profit target progress across accounts',
  'home.widget.eval-roi.name': 'Eval ROI',
  'home.widget.challenge-alerts.name': 'Challenge Alerts',
  'home.widget.challenge-alerts.description':
    'Prop challenge accounts that need a decision: failed, passed, or payout ready',
  'home.widget.eval-roi.description':
    'Evaluation spend vs payouts across prop challenge accounts',

  
  
  
  'account.header.title': 'Account: {name}',
  'account.header.back-to-dashboard': 'Back to dashboard',
  'account.header.add-event.aria': 'Add Deposit/Withdrawal',
  'account.header.edit-account.aria': 'Edit Account',
  'account.header.view-trades.aria': 'View trades in Trade Log',
  'account.header.type': 'Type:',
  'account.header.initial-balance': 'Initial Balance:',
  'account.header.current-balance': 'Current Balance:',
  'account.header.account-id': 'Account ID:',
  'account.header.warning.trades-before-creation.one':
    '{count} trade found before account creation date',
  'account.header.warning.trades-before-creation.few':
    '{count} trades found before account creation date',
  'account.header.warning.trades-before-creation.many':
    '{count} trades found before account creation date',
  'account.header.warning.trades-before-creation.other':
    '{count} trades found before account creation date',
  'account.header.warning.trades-before-phase.one':
    '{count} trade found before the Phase 1 start',
  'account.header.warning.trades-before-phase.few':
    '{count} trades found before the Phase 1 start',
  'account.header.warning.trades-before-phase.many':
    '{count} trades found before the Phase 1 start',
  'account.header.warning.trades-before-phase.other':
    '{count} trades found before the Phase 1 start',
  'account.header.warning.earliest-trade-phase':
    'Earliest trade: {date}. Trades before the phase start do not count toward the challenge.',
  'account.header.notice.phase-start-updated': 'Phase 1 start moved to {date}',
  'account.header.warning.earliest-trade':
    'Earliest trade: {date}. This may cause incorrect balance calculations.',
  'account.header.warning.fix-phase-start.aria': 'Fix Phase 1 start',
  'account.header.warning.fix-date.aria': 'Fix account created date',
  'account.header.warning.fixing': 'Fixing...',
  'account.header.warning.fix-date': 'Fix Date',
  'account.header.notice.date-updated':
    'Account created date updated to {date}',
  'account.header.notice.update-failed-log':
    'Failed to update account created date:',
  'account.header.notice.update-failed': 'Failed to update date: {error}',

  
  
  
  'ribbon.open-journalit': 'Open Journalit',

  
  
  

  'view.dashboard': 'Dashboard',
  'view.trade-log': 'Trade Log',
  'view.account-dashboard': 'Accounts',
  'view.account-page.title': 'Account: {name}',
  'view.account-page.title-default': 'Account Page',
  'view.account-page.no-account-selected': 'No Account Selected',
  'view.account-page.no-account-instructions':
    'Please navigate to this page from Accounts.',
  'view.account-page.service-loading': 'Loading account page service...',
  'view.account-page.balance-chart-title': 'Account Balance Chart',
  'view.account-page.balance-chart-loading': 'Loading balance chart...',
  'view.layout-builder': 'Layout Builder',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': 'Economic Calendar',
  'view.economic-calendar.this-week': 'This Week',
  'view.economic-calendar.sync.aria': 'Open Economic Calendar settings',
  'view.economic-calendar.import-count.one': 'Import {count} event',
  'view.economic-calendar.import-count.few': 'Import {count} events',
  'view.economic-calendar.import-count.many': 'Import {count} events',
  'view.economic-calendar.import-count.other': 'Import {count} events',
  'view.economic-calendar.imported': 'Imported',
  'view.economic-calendar.update-available': 'Update available',
  'view.economic-calendar.filter.currency': 'Currency',
  'view.economic-calendar.filter.impact': 'Impact',
  'view.economic-calendar.impact.high': 'High',
  'view.economic-calendar.impact.medium': 'Medium',
  'view.economic-calendar.impact.low': 'Low',
  'view.economic-calendar.impact.none': 'None',
  'view.economic-calendar.pro-required':
    'Economic calendar requires Journalit Pro',
  'view.economic-calendar.error.offline':
    'Unable to load the economic calendar while offline.',
  'view.economic-calendar.error.generic':
    'Unable to load the economic calendar.',
  'view.economic-calendar.empty': 'No economic events for this week.',
  'view.economic-calendar.refresh': 'Refresh events',
  'view.economic-calendar.retry': 'Retry',
  'view.economic-calendar.select-all': 'Select all',
  'view.economic-calendar.select-aria': 'Select {event}',
  'view.economic-calendar.impact-aria': 'Impact: {impact}',
  'view.economic-calendar.all-day': 'All day',
  'view.economic-calendar.holiday-aria': 'Holiday',
  'view.economic-calendar.forecast': 'Forecast',
  'view.economic-calendar.previous': 'Previous',
  'view.economic-calendar.actual': 'Actual',
  'view.economic-calendar.import-success':
    '{imported} imported, {updated} updated',
  'view.economic-calendar.import-failed': 'Could not import the events.',
  'view.economic-calendar.restore-missing-events':
    'Restore missing events ({count})',
  'economicCalendar.guide.main.intro.description':
    'Browse the full week here. Journalit can also keep your Weekly Review updated automatically, so manual importing is optional.',
  'economicCalendar.guide.main.filters.title':
    'These filters only change this calendar',
  'economicCalendar.guide.main.filters.description':
    'Currency and impact filters narrow what you see and select here. They do not change your automatic import rules.',
  'economicCalendar.guide.main.settings.title':
    'Configure automatic import in Settings',
  'economicCalendar.guide.main.settings.description':
    'Use this button to choose currencies, impact levels, and holidays, then enable automatic import. Journalit syncs the current week into your Weekly Review and refreshes imported readings without re-adding events you deliberately removed.',
  'economicCalendar.guide.main.manual-import.title':
    'Manual imports are optional',
  'economicCalendar.guide.main.manual-import.description':
    'Select visible rows and use Import events for a one-off import. You do not need to do this every week when automatic import is enabled.',
  'economicCalendar.guide.main.restore.title':
    'Restore missing configured events',
  'economicCalendar.guide.main.restore.description':
    'This button becomes available when events from your saved automatic-import scope are missing. It stays visible but disabled once the week is complete again.',
  'economicCalendar.guide.main.summary.title': 'Set it once, then review',
  'economicCalendar.guide.main.summary.description':
    'After automatic import is configured, your Weekly Review stays populated. Return here to browse, make one-off imports, or restore missing events.',
  'view.economic-calendar.pro-benefit':
    'High-impact events in your weekly note.',
  'view.economic-calendar.pro-benefit-trial': 'Start with a 14-day free trial.',

  'settings.economic-calendar.title': 'Economic Calendar',
  'settings.economic-calendar.description':
    "Auto-imports this week's economic events into your weekly note's Key Events.",
  'settings.economic-calendar.auto-import': 'Auto-import weekly events',
  'settings.economic-calendar.auto-import-desc':
    'Keep the current weekly note in sync with the calendar feed.',
  'settings.economic-calendar.currencies': 'Currencies',
  'settings.economic-calendar.currencies-desc':
    'Import events for these currencies. Select none to include all.',
  'settings.economic-calendar.impacts': 'Impact levels',
  'settings.economic-calendar.impacts-desc':
    'Import events with these impact levels.',
  'settings.economic-calendar.impacts-empty':
    'No releases selected. Holidays can still be imported when enabled.',
  'settings.economic-calendar.include-holidays': 'Include holidays',
  'settings.economic-calendar.include-holidays-desc':
    'Import bank holidays and central-bank minutes as all-day entries.',
  'settings.economic-calendar.open-view': 'Open Economic Calendar',
  'settings.economic-calendar.open-view-desc':
    'Review this week and import events by hand.',
  'settings.economic-calendar.pro-required':
    'Economic Calendar needs a PRO subscription.',

  
  
  

  
  
  

  
  
  
  'status-bar.update-available-branded': 'Update Journalit',
  'status-bar.release-notes-branded': 'Journalit · View release notes',
  'status-bar.update-aria-label': 'Journalit {version} - Click to view',
  'update.available.ready': 'A new version is ready',

  
  
  
  'template.transformation.orphaned-content.header':
    'Content from Previous Layout',
  'template.transformation.orphaned-content.desc1':
    'The following content did not fit the new layout.',
  'template.transformation.orphaned-content.desc2':
    'Review and integrate it above, or delete if no longer needed.',

  
  
  
  'template.editor.loading': 'Loading layout...',
  'template.editor.built-in': 'Built-in',
  'template.editor.unsaved-changes': 'Unsaved changes',

  'template.editor.built-in-notice':
    'Built-in layouts cannot be edited. Duplicate this layout or create a new one to customise.',

  'template.editor.show-review-desc':
    'When to display the review section on trade notes',

  'template.editor.section-visibility': 'Section Visibility',
  'template.editor.trade-note-layout': 'Trade Note Layout',

  'template.editor.other-asset-types': 'Others',

  'template.editor.asset-type-add': 'Asset type',

  'template.editor.remove-asset-layout': 'Remove asset layout',

  'template.editor.nav-bar': 'Navigation Bar',
  'template.editor.nav-bar-desc': 'Show trade timeline and review links',
  'template.editor.images': 'Images',
  'template.editor.images-desc': 'Show trade chart images',
  'template.editor.metrics': 'Metrics',
  'template.editor.metrics-desc':
    'Show entry, exit, duration, and plan metric cards',
  'template.editor.thesis': 'Thesis',
  'template.editor.thesis-desc': 'Show the trade thesis block',
  'template.editor.missed-reason': 'Missed Trade Reason',
  'template.editor.missed-reason-desc':
    'Show why the missed trade was not taken',
  'template.editor.metadata': 'Metadata',
  'template.editor.metadata-desc': 'Show accounts, setups, and mistakes',
  'template.editor.metric-cards': 'Metric Cards',
  'template.editor.metadata-rows': 'Metadata Rows',
  'template.editor.accounts': 'Accounts',
  'template.editor.setups': 'Setups',
  'template.editor.mistakes': 'Mistakes',
  'template.editor.tags': 'Tags',
  'template.editor.custom-fields': 'Custom fields',
  'template.editor.custom-fields-desc': '{count} configured custom fields',

  'template.editor.metric.position-size': 'Position size',
  'template.editor.metric.execution-breakdown': 'Execution breakdown',
  'template.editor.metric.pnl': 'P&L',
  'template.editor.metric.r-multiple': 'R multiple',
  'template.editor.metric.costs': 'Costs',

  'template.editor.review-button': 'Mark Reviewed Button',
  'template.editor.review-button-desc': 'Show button to mark trade as reviewed',

  
  
  

  'csv.mapper.title': 'Map Columns to Trade Fields',
  'csv.mapper.subtitle':
    'Match your columns to the trade fields they represent.',
  'csv.mapper.do-not-import': 'Do not import',
  'csv.mapper.required-badge': 'Required',
  'csv.mapper.required-label': 'REQUIRED',
  'csv.mapper.example': 'Example:',
  'csv.mapper.mode.title': 'Import Mode',
  'csv.mapper.mode.help':
    'Choose how manual rows should be interpreted. Direct PnL mode imports rows as closed trades using mapped PnL values.',

  'csv.mapper.asset-type.help':
    'Select the type of instrument in this file. This determines required fields and parsing logic.',

  'csv.mapper.tip.title': 'Tip: Map Additional Fields',
  'csv.mapper.tip.desc':
    'Mapping optional fields like commission and profit_loss improves import quality. You can also map multiple columns to list fields such as tags, images, setups, and mistakes.',
  'csv.mapper.missing-fields': 'Missing required fields for {assetType}:',
  'csv.mapper.summary.title': 'Summary:',
  'csv.mapper.summary.of': 'of',
  'csv.mapper.summary.columns-mapped': 'columns mapped',
  'csv.mapper.summary.all-mapped': 'All required fields mapped',
  'csv.mapper.available-fields.title': 'Available Trade Fields',
  'csv.mapper.available-fields.desc':
    'Organized by category with descriptions for asset-specific fields',

  'csv.template-import.label.share-code': 'Share Code',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': 'Import Template',

  'csv.template-import.error.import-failed': 'Failed to import template',

  'csv.export-template.label.share-code': 'Share Code',

  'csv.export-template.button.copied': 'Copied!',
  'csv.export-template.button.copy': 'Copy to Clipboard',

  'csv.mapper.field.symbol': 'Symbol',
  'csv.mapper.field.direction': 'Direction (Long/Short)',
  'csv.mapper.field.entry-time': 'Entry Time',
  'csv.mapper.field.exit-time': 'Exit Time',
  'csv.mapper.field.entry-price': 'Entry Price',
  'csv.mapper.field.exit-price': 'Exit Price',
  'csv.mapper.field.quantity': 'Quantity',
  'csv.mapper.field.notes': 'Notes',
  'csv.mapper.field.order-id': 'Order ID',
  'csv.mapper.field.account-id': 'Account ID',

  'csv.mapper.help.options-required': 'Required for options trades',
  'csv.mapper.help.option-type-required': 'Required for options (call or put)',
  'csv.mapper.help.contract-size':
    'Multiplier for options (usually 100) or futures',
  'csv.mapper.help.order-id': 'Used to aggregate partial fills',
  'csv.mapper.help.asset-types': 'stock, options, futures, forex, crypto',
  'csv.mapper.help.status': 'Trade status: OPEN or CLOSED',

  'csv.mapper.category.required': 'Required Fields',
  'csv.mapper.category.optional-core': 'Optional Core Fields',
  'csv.mapper.category.identifiers': 'Identifiers',
  'csv.mapper.category.other': 'Other',
  'csv.mapper.category.options': 'Options Fields',
  'csv.mapper.category.futures': 'Futures Fields',

  
  
  

  'csv.broker.label': 'Broker / Import Format',

  'csv.broker.remove-favorite-aria': 'Remove from favorites',
  'csv.broker.set-favorite-aria': 'Set as favorite',

  
  'csv.broker.ibkr': 'Interactive Brokers (IBKR)',
  'csv.broker.tradovate': 'Tradovate',
  'csv.broker.tradezero': 'TradeZero',
  'csv.broker.tradingview': 'TradingView Paper Trading',
  'csv.broker.bybit': 'Bybit (USDT Perpetuals)',
  'csv.broker.blofin': 'Blofin',
  'csv.broker.hyperliquid': 'Hyperliquid (Perpetuals)',
  'csv.broker.sierrachart': 'SierraChart (Futures)',
  'csv.broker.motivewave': 'MotiveWave',
  'csv.broker.fxreplay': 'FX Replay (Analytics)',
  'csv.broker.atas': 'ATAS (Statistics Realtime)',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker.jdr': 'MetaTrader 4 / 5',

  'csv.account-selector.favorite.remove': 'Remove from favorites',
  'csv.account-selector.favorite.set': 'Set as favorite',

  
  
  

  'csv.results.successfully-imported-suffix': ' trades',

  'csv.results.failed-to-import-prefix': 'Failed to import ',
  'csv.results.failed-to-import-suffix': ' rows (see details below)',
  'csv.results.pending-local-writes':
    '{count} trade note write(s) are still pending. Journalit will reconcile completed writes and leave unfinished projections available for restore.',
  'csv.results.pending-title': 'Import still syncing',

  
  
  

  
  
  

  'csv.image-review.count': '{count} image(s)',

  
  
  
  'image.uploader.paste-title': 'Paste media from clipboard (Ctrl+V)',
  'image.uploader.pasting': 'Pasting...',
  'image.uploader.paste': 'Paste',
  'image.uploader.url-placeholder': 'Paste media URL or file path...',
  'image.uploader.url-input-aria': 'Media URL input',
  'image.uploader.file-upload-aria': 'Upload from file',
  'image.uploader.paste-clipboard-aria': 'Paste from clipboard',
  'image.uploader.error-invalid-url':
    'Invalid media URL or file path. Please enter a supported image/video URL, vault media path, or Excalidraw link.',

  
  
  
  'image.viewer.alt-default': 'Image',
  'image.viewer.description-default': 'Media Preview',

  'image.viewer.title-fullscreen': 'Click to view fullscreen',

  'image.viewer.delete-button': 'Delete Media',
  'image.viewer.nav-prev': 'Previous image',
  'image.viewer.nav-next': 'Next image',
  'image.viewer.zoom-in-hint': 'Pinch or click to zoom in',
  'image.viewer.zoom-out-hint': '{scale}x (pinch or click to zoom out)',

  'image.viewer.close-aria': 'Close fullscreen',
  'image.viewer.copy-image': 'Copy image',

  'image.viewer.copied': 'Copied',
  'image.viewer.copy-failed': 'Failed to copy image to clipboard',
  'image.viewer.copy-unsupported':
    'Image clipboard copy is not supported in this environment',

  
  
  
  'media.viewer.video-controls': 'Video controls',
  'media.viewer.play-video': 'Play video',
  'media.viewer.pause-video': 'Pause video',
  'media.viewer.mute-video': 'Mute video',
  'media.viewer.unmute-video': 'Unmute video',
  'media.viewer.volume': 'Volume',
  'media.viewer.back-5': 'Back 5 seconds',
  'media.viewer.forward-5': 'Forward 5 seconds',
  'media.viewer.timeline': 'Video timeline',

  
  
  
  'image.carousel.no-images': 'No images to display',
  'image.carousel.prev': 'Previous image',
  'image.carousel.next': 'Next image',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'Thumbnail {index}',

  
  
  
  'paste.notice.image-pasted': '📋 Image pasted successfully',
  'paste.notice.images-pasted': '📋 {count} images pasted successfully',
  'paste.error.clipboard-not-supported': 'Clipboard API not supported',
  'paste.error.clipboard-empty': 'Nothing found in clipboard to paste',
  'paste.error.file-size-exceeds': 'File size {size}MB exceeds limit',
  'paste.error.no-images-found':
    'No images found in clipboard. Try copying an image first.',
  'paste.error.permission-denied': 'Permission denied',

  
  
  

  'datepicker.button.clear': 'Clear',
  'datepicker.button.today': 'Today',
  'datepicker.button.now': 'Now',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',

  
  
  
  'common.loading': 'Loading...',
  'common.error': 'Error',

  'common.warning': 'Warning',
  'common.info': 'Info',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.ok': 'OK',

  'common.select-option': 'Select an option',

  'common.none': 'None',
  'common.other': 'Other',
  'common.breakdown': 'Breakdown',
  'common.na': 'N/A',
  'common.unknown': 'Unknown',
  'common.unknown-error': 'Unknown error',
  'common.all': 'All',
  'common.select-all': 'Select All',
  'common.n-types': '{count} Types',
  'common.select-item': 'Select {item}',
  'common.header': 'Header',

  'common.date': 'Date',

  'common.days': 'Days',
  'common.week': 'Week',
  'common.weeks': 'Weeks',
  'common.month': 'Month',
  'common.months': 'Months',
  'common.year': 'Year',
  'common.years': 'Years',
  'common.quarter': 'Quarter',
  'common.quarters': 'Quarters',

  'common.min': 'Min',
  'common.max': 'Max',
  'common.best': 'Best',
  'common.worst': 'Worst',
  'common.profit': 'Profit',

  'common.trade': 'Trade',
  'common.trades': 'Trades',

  'common.statuses': 'Statuses',
  'common.enabled': 'enabled',
  'common.disabled': 'disabled',

  
  'common.color.gray': 'Gray',
  'common.color.red': 'Red',
  'common.color.orange': 'Orange',
  'common.color.yellow': 'Yellow',
  'common.color.label': 'Color',
  'common.color.default': 'Default',

  
  'common.day.monday': 'Monday',
  'common.day.tuesday': 'Tuesday',
  'common.day.wednesday': 'Wednesday',
  'common.day.thursday': 'Thursday',
  'common.day.friday': 'Friday',
  'common.day.saturday': 'Saturday',
  'common.day.sunday': 'Sunday',
  'common.day.all-week': 'All Week',

  
  'common.month.january': 'January',
  'common.month.february': 'February',
  'common.month.march': 'March',
  'common.month.april': 'April',
  'common.month.may': 'May',
  'common.month.june': 'June',
  'common.month.july': 'July',
  'common.month.august': 'August',
  'common.month.september': 'September',
  'common.month.october': 'October',
  'common.month.november': 'November',
  'common.month.december': 'December',

  
  'common.score.poor': 'Poor',
  'common.score.below-average': 'Below Average',
  'common.score.average': 'Average',
  'common.score.strong': 'Strong',
  'common.score.excellent': 'Excellent',

  
  
  
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'Peak realized P&L',
  'chart.tooltip.episode-start': 'Episode Start',
  'chart.tooltip.underwater-days': 'Time Underwater',
  'chart.tooltip.underwater-trades': 'Trades Underwater',

  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',
  'chart.tooltip.trade-pnl': 'Trade P&L',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'chart.loading': 'Loading chart...',

  
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'Entry',
  'chart.legend.exit': 'Exit',
  'chart.legend.trade': 'Trade',

  
  
  
  
  'calendar.day.mon': 'Mon',
  'calendar.day.tue': 'Tue',
  'calendar.day.wed': 'Wed',
  'calendar.day.thu': 'Thu',
  'calendar.day.fri': 'Fri',
  'calendar.day.sat': 'Sat',
  'calendar.day.sun': 'Sun',

  
  'calendar.month.jan': 'Jan',
  'calendar.month.feb': 'Feb',
  'calendar.month.mar': 'Mar',
  'calendar.month.apr': 'Apr',
  'calendar.month.may': 'May',
  'calendar.month.jun': 'Jun',
  'calendar.month.jul': 'Jul',
  'calendar.month.aug': 'Aug',
  'calendar.month.sep': 'Sep',
  'calendar.month.oct': 'Oct',
  'calendar.month.nov': 'Nov',
  'calendar.month.dec': 'Dec',

  
  'calendar.legend.less': 'Less',
  'calendar.legend.more': 'More',

  
  
  

  
  
  
  'settings.ftp.title': 'FTP credentials',
  'settings.ftp.title-metatrader': 'FTP credentials for MetaTrader',
  'settings.ftp.loading': 'Loading FTP credentials...',
  'settings.ftp.info-message':
    "Use these credentials to configure MetaTrader's FTP publishing settings:",
  'settings.ftp.label.server': 'FTP server:',
  'settings.ftp.label.login': 'FTP login:',
  'settings.ftp.label.password': 'FTP password:',
  'settings.ftp.aria.copy-server': 'Copy FTP server',
  'settings.ftp.aria.copy-login': 'Copy FTP login',
  'settings.ftp.aria.copy-password': 'Copy password',
  'settings.ftp.aria.password-unavailable':
    'Password not available for copying',
  'settings.ftp.aria.password-hidden': 'Password hidden',
  'settings.ftp.aria.hide-password': 'Hide password',
  'settings.ftp.aria.show-password': 'Show password',
  'settings.ftp.notice.password-masked':
    'Password is stored but not available for viewing/copying. Reset password to get a new one.',
  'settings.ftp.notice.password-save':
    'Save this password securely. It cannot be retrieved later.',
  'settings.ftp.button.reset': 'Reset FTP password',
  'settings.ftp.button.resetting': 'Resetting password...',
  'settings.ftp.reset-hint':
    'Click this button to generate a new FTP password.',
  'settings.ftp.instructions.title': 'MetaTrader 4 setup instructions:',
  'settings.ftp.instructions.step1': 'Open MetaTrader\u00A04 (MT4)',
  'settings.ftp.instructions.step2': 'Click on the "Tools" menu at the top',
  'settings.ftp.instructions.step3': 'Select "Options"',
  'settings.ftp.instructions.step4':
    'Navigate to the "FTP" tab and enter the FTP Server, Login, and Password shown above',
  'settings.ftp.instructions.step5': 'Enable "Passive mode"',
  'settings.ftp.instructions.step6':
    'Enable automatic publishing of reports via FTP and set the refresh interval to 60\u00A0minutes',
  'settings.ftp.no-credentials':
    'No FTP credentials found. Click "Create FTP Credentials" in the section above to generate them.',
  'settings.ftp.error.reset-failed': 'Failed to reset password',

  
  
  

  'settings.auth.status-offline': 'Offline',
  'settings.auth.status-online': 'Online',

  'settings.auth.signed-in': 'Signed in',
  'settings.auth.sign-in-up': 'Sign in / Sign up',
  'settings.auth.sign-out': 'Sign out',

  'settings.auth.subscription-features': 'Subscription features',

  'settings.auth.offline-mode': 'Offline mode',

  
  'settings.auth.guest': 'Guest',

  'settings.auth.your-plan': 'Your plan',

  'settings.auth.manage-subscription': 'Manage subscription',

  
  
  
  'settings.tab.general': 'General',
  'settings.tab.reviews': 'Review',

  'settings.tab.customization': 'Customisation',
  'settings.tab.journal-setup': 'Journal',
  'settings.tab.backend': 'Trade sync',
  'settings.tab.trading': 'Trade Defaults',
  'settings.tab.sync': 'Account & Sync',
  'settings.tab.accounts': 'Account',

  
  
  
  
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Weekly review',
  'settings.reviews.monthly': 'Monthly review',
  'settings.reviews.quarterly': 'Quarterly review',
  'settings.reviews.yearly': 'Yearly review',

  
  'settings.reviews.default-templates': 'Default layouts',

  'settings.reviews.trade-template': 'Trade layout',
  'settings.reviews.trade-template-desc': 'Layout used for new trade notes',
  'settings.reviews.drc-template': 'DRC layout',
  'settings.reviews.drc-template-desc':
    'Layout used for new daily report cards',
  'settings.reviews.weekly-template': 'Weekly layout',
  'settings.reviews.weekly-template-desc': 'Layout used for new weekly reviews',
  'settings.reviews.monthly-template': 'Monthly layout',
  'settings.reviews.monthly-template-desc':
    'Layout used for new monthly reviews',
  'settings.reviews.quarterly-template': 'Quarterly layout',
  'settings.reviews.quarterly-template-desc':
    'Layout used for new quarterly reviews',
  'settings.reviews.yearly-template': 'Yearly layout',
  'settings.reviews.yearly-template-desc': 'Layout used for new yearly reviews',

  
  'settings.reviews.template-builder': 'Layout builder',
  'settings.reviews.template-builder-desc':
    'Create, edit, and manage your layouts visually. The Builder View allows you to drag-and-drop sections, configure options, and preview your layouts in real-time.',
  'settings.reviews.open-builder': 'Open layout builder',
  'settings.general.review-links-new-tab':
    'Open review widget links in new tabs',
  'settings.general.review-links-new-tab-desc':
    'When off, links replace the current tab.',
  'settings.general.review-links-new-tab-aria':
    'Open review widget note links in new tabs',
  'settings.general.tab-behavior': 'Tab behavior',

  
  'settings.reviews.recurring-goals': 'Recurring goals',
  'settings.reviews.recurring-goals-desc':
    'Define goals that automatically appear on every new review. These are copied when the review is created, and can be edited per-review.',
  'settings.reviews.daily-goals': 'Daily goals',
  'settings.reviews.daily-goal-placeholder': 'Add a recurring daily goal...',
  'settings.reviews.weekly-goals': 'Weekly goals',
  'settings.reviews.weekly-goal-placeholder': 'Add a recurring weekly goal...',

  
  'settings.reviews.pre-trade-checklist': 'DRC pre-trade checklist',
  'settings.reviews.pre-trade-checklist-desc':
    'Define checklist items that automatically appear on every new Daily Report Card. These are copied to each DRC when created, and can be edited per-day.',
  'settings.reviews.checklist-placeholder': 'Add a checklist item...',
  'settings.reviews.weekly-checklist': 'Weekly preparation checklist',
  'settings.reviews.weekly-checklist-desc':
    'Define checklist items that automatically appear on every new Weekly Review. These are copied to each weekly review when created, and can be edited per-week.',
  'settings.reviews.weekly-checklist-placeholder':
    'Add a weekly checklist item...',

  
  'settings.reviews.auto-create': 'Auto-create reviews',
  'settings.reviews.global-auto-create': 'Global auto-create reviews',
  'settings.reviews.global-auto-create-desc':
    'Automatically create reviews when the first trade of the corresponding period is recorded. This setting applies to daily, weekly, monthly, quarterly, and yearly reviews.',
  'settings.reviews.global-auto-create-aria': 'Global auto-create reviews',
  'settings.reviews.auto-create-drc-nav': 'Auto-create DRC on navigation',
  'settings.reviews.auto-create-drc-nav-desc':
    "Automatically create a new Daily Report Card when navigating to a day that doesn't have one",
  'settings.reviews.auto-create-drc-nav-aria': 'Auto-create DRC on navigation',
  'settings.reviews.auto-create-weekly-nav':
    'Auto-create weekly review on navigation',
  'settings.reviews.auto-create-weekly-nav-desc':
    "Automatically create a new Weekly Review when navigating to a week that doesn't have one",
  'settings.reviews.auto-create-weekly-nav-aria':
    'Auto-create weekly review on navigation',
  'settings.reviews.auto-create-monthly-nav':
    'Auto-create monthly review on navigation',
  'settings.reviews.auto-create-monthly-nav-desc':
    "Automatically create a new Monthly Review when navigating to a month that doesn't have one",
  'settings.reviews.auto-create-monthly-nav-aria':
    'Auto-create monthly review on navigation',
  'settings.reviews.auto-create-quarterly-nav':
    'Auto-create quarterly review on navigation',
  'settings.reviews.auto-create-quarterly-nav-desc':
    "Automatically create a new Quarterly Review when navigating to a quarter that doesn't have one",
  'settings.reviews.auto-create-quarterly-nav-aria':
    'Auto-create quarterly review on navigation',
  'settings.reviews.auto-create-yearly-nav':
    'Auto-create yearly review on navigation',
  'settings.reviews.auto-create-yearly-nav-desc':
    "Automatically create a new Yearly Review when navigating to a year that doesn't have one",
  'settings.reviews.auto-create-yearly-nav-aria':
    'Auto-create yearly review on navigation',

  

  'settings.reviews.notice.builder-not-found':
    'Layout Builder command not found',
  'settings.reviews.notice.global-auto-create':
    'Auto-create for all reviews {status}',
  'settings.reviews.notice.auto-create-nav':
    'Auto-create {type} on navigation {status}',

  
  'settings.reviews.daily.checklist-title': 'Pre-trade checklist items',

  'settings.reviews.daily.questions-title': 'Review questions',

  
  
  
  'library.type.drc': 'DRC',
  'library.type.weekly': 'Weekly',
  'library.type.monthly': 'Monthly',
  'library.type.quarterly': 'Quarterly',
  'library.type.yearly': 'Yearly',
  'library.type.trade': 'Trade',
  'library.error.invalid-share-code': 'Invalid share code',
  'library.notice.import-success': 'Layout "{name}" imported successfully!',
  'library.error.import-failed': 'Failed to import layout',
  'library.notice.select-template': 'Please select a layout to export',
  'library.notice.template-not-found': 'Layout not found',
  'library.notice.code-generated': 'Share code generated!',
  'library.error.export-failed': 'Failed to export layout',
  'library.error.export-too-large':
    'This layout is too large to export as a share code.',
  'library.notice.copied': 'Share code copied to clipboard!',
  'library.error.copy-failed': 'Failed to copy to clipboard',
  'library.title.import': 'Import layout',
  'library.desc.import':
    'Paste a JRT share code to import a layout from another user.',
  'library.label.share-code': 'Share code',
  'library.placeholder.import-code': 'Paste JRT-... share code here',
  'library.button.validating': 'Validating...',
  'library.button.validate': 'Validate',
  'library.button.import': 'Import layout',
  'library.preview.valid': 'Valid layout',
  'library.preview.invalid': 'Invalid share code',
  'library.title.export': 'Export layout',
  'library.desc.export':
    'Select a layout to generate a share code that others can import.',
  'library.empty.title': 'No custom layouts to export.',
  'library.empty.hint':
    'Create a custom layout in the review or trade layouts tabs first, then come back here to share it.',
  'library.label.select-template': 'Select layout',
  'library.option.select-template': '-- Select a layout --',
  'library.button.generate-code': 'Generate share code',
  'library.button.copy-code': 'Copy to clipboard',

  'settings.reviews.daily.timeframes-title': 'Forecast timeframes',

  'settings.reviews.daily.timeframes-placeholder':
    'New timeframe (e.g., 15M, 5M)',

  
  'settings.weekly.review-questions': 'Review questions',

  'settings.weekly.forecast-timeframes': 'Forecast timeframes',

  
  
  
  'settings.shared.timeframes.title': 'Forecast timeframes',

  'settings.shared.timeframes.placeholder': 'New timeframe (e.g., 15M, 5M)',

  
  
  

  
  
  
  'shared.empty-state.message': 'No data available',

  
  
  

  'weekly.tab.review': 'Review',

  
  
  
  'weekly.review.drcs.title': 'Daily reviews for this week',

  
  
  
  'account.settings.modal.title': 'Account dashboard settings',
  'account.settings.notice.name-empty': 'Account type name cannot be empty',
  'account.settings.notice.type-exists': 'Account type "{name}" already exists',
  'account.settings.notice.reserved-name':
    '"{name}" is a reserved account type name',
  'account.settings.notice.type-added':
    'Account type "{name}" added successfully',
  'account.settings.notice.add-error': 'Error adding account type: {error}',
  'account.settings.notice.cannot-delete-archived':
    'Cannot delete the "Archived" account type - it is reserved for archiving accounts',
  'account.settings.notice.analyze-error': 'Error analyzing account type usage',
  'account.settings.notice.cannot-delete-has-accounts':
    'Cannot delete "{name}" - it has {count} associated accounts. Migration feature coming soon.',
  'account.settings.notice.saved':
    'Account dashboard settings saved successfully',
  'account.settings.notice.save-error': 'Error saving settings: {error}',
  'account.settings.notice.migration-target-required':
    'Please select a target account type for reassignment',
  'account.settings.notice.migration-failed': 'Migration failed: {error}',
  'account.settings.notice.type-deleted':
    'Account type "{name}" deleted successfully',
  'account.settings.notice.type-deleted-with-cleanup':
    'Account type "{name}" deleted successfully (cleaned up: {actions})',
  'account.settings.notice.migration-error': 'Error during migration: {error}',
  'account.settings.notice.delete-error':
    'Error deleting account type: {error}',
  'account.settings.notice.operation-failed': '{operation} failed: {error}',
  'account.settings.notice.migration-no-targets':
    'Cannot migrate accounts - no other account types available. Create a new account type first.',
  'account.settings.notice.type-deleted-migrated':
    'Account type "{name}" deleted successfully. {count} accounts {action}',
  'account.settings.operation.type-deletion': 'Account type deletion',
  'account.settings.migration.error.target-required':
    'Target type required for reassignment',
  'account.settings.migration.error.invalid-option': 'Invalid migration option',
  'account.settings.unnamed-account': 'Unnamed Account',

  'account.settings.migration.title': 'Migrate accounts before deletion',
  'account.settings.migration.warning':
    'You\'re about to delete "{name}" which has {count} associated accounts.',
  'account.settings.migration.instruction':
    'These accounts must be handled before the account type can be deleted:',
  'account.settings.migration.more-accounts': '... and {count} more',
  'account.settings.migration.choose-option':
    'Choose how to handle these accounts:',
  'account.settings.migration.option.reassign.title':
    'Reassign to different type',
  'account.settings.migration.option.reassign.desc':
    'Move all accounts to another account type',
  'account.settings.migration.target-type.label': 'Target account type:',
  'account.settings.migration.option.archive.title': 'Archive accounts',
  'account.settings.migration.option.archive.desc':
    'Move all accounts to "archived" status',
  'account.settings.migration.option.delete.title': 'Mark for deletion',
  'account.settings.migration.option.delete.desc':
    'Mark all accounts as deleted',
  'account.settings.migration.button.migrate': 'Migrate & delete type',
  'account.settings.migration.button.migrating': 'Migrating...',
  'account.settings.migration.action.reassigned': 'reassigned to "{target}"',
  'account.settings.migration.action.archived': 'moved to archived status',
  'account.settings.migration.action.deleted': 'marked for deletion',

  'account.settings.delete.title': 'Delete account type',
  'account.settings.delete.confirm-question':
    'Are you sure you want to delete the account type "{name}"?',
  'account.settings.delete.impact-analysis': 'Impact analysis:',
  'account.settings.delete.affected-accounts':
    '⚠️ {count} account(s) affected:',
  'account.settings.delete.migration-notice':
    'Note: These accounts will need to be reassigned to a different account type before deletion can proceed.',
  'account.settings.delete.no-affected':
    '✅ No accounts are using this account type',
  'account.settings.delete.cleanup-title': 'Settings that will be cleaned up:',
  'account.settings.delete.cleanup.excluded':
    '✓ Removed from excluded account types',
  'account.settings.delete.cleanup.order': '✓ Removed from display order',
  'account.settings.delete.cleanup.withdrawals':
    '✓ Removed from withdrawal settings',
  'account.settings.delete.cleanup.none': 'No settings cleanup needed',
  'account.settings.delete.button.setup-migration': 'Set up migration',
  'account.settings.delete.button.delete': 'Delete account type',
  'account.settings.delete.button.deleting': 'Deleting...',

  'account.settings.section.available-types.title': 'Available account types',
  'account.settings.section.available-types.desc':
    'Current account types in your system.',
  'account.settings.section.available-types.placeholder':
    'Enter account type name...',
  'account.settings.section.available-types.add-aria': 'Add new account type',
  'account.settings.section.available-types.delete-aria': 'Delete {name}',
  'account.settings.section.available-types.empty':
    'No custom account types defined.',
  'account.settings.section.challenge-stages.title': 'Challenge stages',
  'account.settings.section.challenge-stages.desc':
    'Account type applied when a challenge reaches this stage.',
  'account.settings.section.challenge-stages.no-change': 'No change',
  'account.settings.section.challenge-stages.aria': 'Account type for {stage}',
  'account.settings.section.inclusion.title': 'Dashboard account types',
  'account.settings.section.inclusion.desc':
    'Choose which account types appear in dashboard stats, whether withdrawals count, and their display order.',
  'account.settings.section.inclusion.include-dashboard': 'In dashboard stats',
  'account.settings.section.inclusion.include-withdrawals': 'Withdrawals',
  'account.settings.section.inclusion.empty':
    'No account types available to configure.',
  'account.settings.section.order.title': 'Display order',

  'account.settings.section.order.move-up': 'Move up',
  'account.settings.section.order.move-down': 'Move down',
  'account.settings.button.save': 'Save settings',
  'account.settings.button.saving': 'Saving...',

  'weekly.review.performance.title': 'Performance self-assessment',
  'weekly.review.performance.mental': 'Mental performance',

  'weekly.review.performance.technical': 'Technical execution',

  'weekly.review.questions.title': 'Weekly review questions',

  'weekly.review.goals.title': 'Goals for next week',

  
  
  
  'weekly.preparation.goals.title': 'Weekly goals',

  'weekly.preparation.events.title': 'Key events',

  'weekly.preparation.events.add-button': 'Add event',

  'weekly.preparation.forecast.title': 'Weekly forecast',

  
  
  
  'weekly.overview.pnl-chart.title': 'Weekly cumulative P&L',

  'weekly.overview.drawdown-chart.title': 'Weekly drawdown',

  'weekly.overview.performance.title': 'Weekly performance',

  'weekly.overview.setup-performance.title': 'Setup performance',

  'weekly.overview.trades-chart.title': 'Weekly trades',

  'weekly.overview.best-trade.title': 'Best trade of the week',

  'weekly.overview.worst-trade.title': 'Worst trade of the week',

  'weekly.overview.daily-performance.title': 'Daily performance',

  'weekly.overview.button.create-trade': 'Create trade',
  'weekly.overview.button.view-trade-details': 'View trade details',

  
  
  

  'monthly.tab.review': 'Review',

  
  
  

  

  
  
  
  'backend.title': 'Trade Sync',
  'backend.description':
    'Set up Trade Sync for supported brokers to keep your vault up to date automatically.',

  

  'trade-sync.gate.pro.description':
    'Trade Sync is a Pro feature. Upgrade to continue.',
  'trade-sync.quick.started': 'Synchronizing enabled trade sources…',
  'trade-sync.quick.running': 'Syncing…',
  'trade-sync.quick.offline':
    'Trade sync requires an internet connection. Try again when you are online.',
  'trade-sync.quick.no-sources':
    'No enabled trade sync sources were found. Configure Trade Sync in Settings.',
  'trade-sync.quick.not-ready':
    'No enabled trade sync sources are ready right now. Wait for active syncs or check Trade Sync settings.',
  'trade-sync.quick.mapping-required':
    'Imported or updated {imported} trades. Finish account mapping for {providers} in Settings → Trade Sync, then try again.',
  'trade-sync.quick.complete':
    'Trade sync complete: {sources} sources synchronized and {imported} trades imported or updated.',
  'trade-sync.quick.partial':
    'Trade sync finished with issues: {completed} of {total} sources completed and {imported} trades imported or updated.',
  'trade-sync.quick.failed':
    'Trade sync could not complete for {sources} sources. Check your Trade Sync settings and try again.',

  'trade-sync.gate.feature-unavailable.title': 'Feature unavailable',
  'trade-sync.gate.feature-unavailable.description':
    'This sync feature is not enabled for your Pro account. Refresh your status or contact support if this persists.',
  'trade-sync.trial.title': 'Automate your trading journal',
  'trade-sync.trial.description':
    'Save up to 7 hours a week with Journalit Pro.',
  'trade-sync.trial.benefit.sync': 'Automatic trade sync',
  'trade-sync.trial.benefit.import': 'Import trades from anywhere',
  'trade-sync.trial.cta': 'Start your 14-day free trial',
  'trade-sync.trial.existing-subscriber': 'Already subscribed? Sign in',
  'trade-sync.trial.eligibility':
    'Free trial available to new subscribers only.',

  

  'premium.gate.cta.continue-pro': 'Continue to PRO',

  'premium.gate.cta.refresh': 'Refresh status',

  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  

  'backend.status.connected': 'Connected',
  'backend.status.disconnected': 'Disconnected',
  'backend.status.checking': 'Checking...',

  
  'backend.register.title': 'Register Vault',
  'backend.register.description':
    'Register this vault with the backend server for sync',
  'backend.register.button': 'Register Vault',
  'backend.register.registering': 'Registering...',

  
  'backend.ftp.title': 'FTP Credentials',
  'backend.ftp.description':
    'Create FTP credentials to upload MetaTrader reports. A unique username will be generated automatically.',
  'backend.ftp.create-button': 'Create FTP Credentials',
  'backend.ftp.creating': 'Creating...',

  

  'backend.sync.auto-sync': 'Enable Auto-Sync',
  'backend.sync.auto-sync-desc':
    'Automatically sync trades from the backend server',
  'backend.sync.auto-sync-info': 'Auto-sync checks for new trades every hour',
  'backend.sync.auto-sync-aria': 'Enable auto-sync',

  'backend.sync.syncing': 'Syncing...',

  'backend.sync.last-result': 'Last Sync Result',
  'backend.sync.synced-trades': 'Synced {trades} trades ({files} new files)',
  'backend.sync.no-new-trades': 'No new trades to sync',
  'backend.sync.status': 'Sync Status',
  'backend.sync.last-sync': 'Last sync',
  'backend.sync.total-syncs': 'Total syncs',
  'backend.sync.never': 'Never',
  'backend.sync.invalid-date': 'Invalid date',

  
  'backend.notice.vault-registered': '✅ Vault registered with trading server',
  'backend.notice.sync-cancelled': '⏹️ Sync cancelled',
  'backend.notice.sync-in-progress': '⚠️ Sync already in progress',
  'backend.notice.account-info-failed': '❌ Failed to get account information',
  'backend.notice.sync-batch-progress':
    '⏳ Syncing batch: {count} trades ({progress}% complete, {remaining} remaining)',
  'backend.notice.all-trades-synced':
    '✅ All {count} trades are already synced',
  'backend.notice.account-created': '📊 Created account: {name}',
  'backend.notice.batch-complete':
    '⏳ Batch complete: {processed}/{total} trades ({progress}%). Continuing...',
  'backend.notice.sync-complete':
    '✅ Sync complete: {total} trades processed ({newFiles} new, {updated} updated) across {accounts} account(s)',
  'backend.notice.sync-complete-no-trades':
    '✅ Sync complete - no new trades found',
  'backend.notice.sync-failed': '❌ Sync failed: {error}',

  

  'backend.accounts.linked': 'Linked MT Accounts',
  'backend.accounts.linked-desc':
    'MetaTrader accounts detected from synced reports',
  'backend.accounts.server-disconnected':
    'Server is disconnected. Please check connection status.',
  'backend.accounts.loading': 'Loading accounts...',
  'backend.accounts.no-accounts': 'No accounts found.',
  'backend.accounts.sync-to-detect': 'Sync some trades to detect accounts.',
  'backend.accounts.connect-to-see':
    'Connect to the server and sync trades to see accounts.',
  'backend.accounts.account-id': 'Account ID',
  'backend.accounts.broker': 'Broker',
  'backend.accounts.first-seen': 'First seen',
  'backend.accounts.last-seen': 'Last seen',
  'backend.accounts.refresh': 'Refresh Accounts',
  'backend.accounts.unlink-title': 'Unlink MetaTrader account',
  'backend.accounts.unlink': 'Unlink',
  'backend.accounts.unlink-confirm':
    'Unlink MetaTrader account {accountId}? It will be hidden from Trade Sync and future imports will be skipped until you relink it.',
  'backend.accounts.unlink-success': 'MetaTrader account unlinked',
  'backend.accounts.relink': 'Relink',
  'backend.accounts.relink-success': 'MetaTrader account relinked',
  'backend.accounts.ignored.title': 'Unlinked accounts',
  'backend.accounts.ignored.count': '{count} hidden',
  'backend.accounts.ignored.empty': 'No unlinked accounts.',
  'backend.accounts.ignored-at': 'Unlinked',

  

  
  'backend.cards.connection.title': 'Connection',
  'backend.cards.connection.refresh': 'Refresh',
  'backend.cards.sync.title': 'Sync Status',
  'backend.cards.sync.last-sync': 'Last sync',
  'backend.cards.sync.total': 'Total syncs',
  'backend.cards.sync.button': 'Sync Now',
  'backend.cards.sync.cancel': 'Cancel sync',
  'backend.cards.accounts.title': 'Accounts',
  'backend.cards.accounts.linked': 'Linked accounts',
  'backend.cards.accounts.manage': 'Manage',

  
  'backend.section.setup.title': 'Setup & Configuration',
  'backend.section.sync.title': 'Sync Settings',
  'backend.section.accounts.title': 'Account Management',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI CSV Mapping',
  'settings.auth.feature.trade-sync': 'Trade Sync',
  'settings.auth.feature.economic-calendar': 'Economic Calendar',
  'settings.auth.feature.basic-tracking': 'Basic trade tracking',

  'settings.auth.feature.manual-entry': 'Manual trade entry',
  'settings.auth.feature.analytics-reviews': 'Analytics and reviews',
  'settings.auth.feature.priority-support': 'Priority Support',

  
  'backend.sync.just-now': 'Just now',
  'backend.sync.minutes-ago': '{count} min ago',
  'backend.sync.hours-ago': '{count} hr ago',
  'backend.sync.days-ago': '{count} days ago',

  
  
  

  'csv.format': 'Import Format: ',

  'csv.button.export-template': 'Export Template',
  'csv.button.delete-template': 'Delete Template',

  'csv.button.import-another': 'Import Another File',
  'csv.results.complete': 'Import Complete',
  'csv.results.history-ready': 'Your trading history is ready',
  'csv.results.completed-with-issues': 'Import completed with issues',
  'csv.results.failed': 'Import Failed',
  'csv.results.success.one':
    'Successfully imported {count} trade to Account: {account}',
  'csv.results.success.few':
    'Successfully imported {count} trades to Account: {account}',
  'csv.results.success.many':
    'Successfully imported {count} trades to Account: {account}',
  'csv.results.success.other':
    'Successfully imported {count} trades to Account: {account}',
  'csv.results.updated.one': 'Updated {count} existing trade',
  'csv.results.updated.few': 'Updated {count} existing trades',
  'csv.results.updated.many': 'Updated {count} existing trades',
  'csv.results.updated.other': 'Updated {count} existing trades',
  'csv.results.skipped.one':
    'Skipped {count} duplicate trade (already in vault)',
  'csv.results.skipped.few':
    'Skipped {count} duplicate trades (already in vault)',
  'csv.results.skipped.many':
    'Skipped {count} duplicate trades (already in vault)',
  'csv.results.skipped.other':
    'Skipped {count} duplicate trades (already in vault)',

  'csv.results.broker': 'Broker: {broker}',

  'csv.results.more-trades.one': 'and {count} more trade...',
  'csv.results.more-trades.few': 'and {count} more trades...',
  'csv.results.more-trades.many': 'and {count} more trades...',
  'csv.results.more-trades.other': 'and {count} more trades...',
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  

  'csv.errors.copy-report': 'Copy report',

  'csv.errors.copied': 'Copied',
  'csv.errors.rows': 'Rows: {rows}',
  'csv.errors.suggestion': 'Suggestion: ',

  'csv.errors.raw-errors-limit': 'Showing first {shown} of {total} errors',

  

  'csv.report.plugin-version': 'Plugin version: {version}',

  'csv.report.broker': 'Broker: {broker}',

  'csv.report.top-issues': 'Top issues:',

  
  

  'csv.broker-guide.tradovate.step-2':
    'Click on "Orders" tab (NOT Performance tab)',

  'csv.broker-guide.tradovate.warning.emphasis': 'Important:',
  'csv.broker-guide.tradovate.warning.message':
    'Use Orders tab only. The Performance tab is not compatible.',

  

  'csv.broker-guide.ibkr.warning.emphasis': 'Must use Orders',

  

  

  'csv.broker-guide.tradingview.step-3':
    'Select "Order History" from the dropdown',

  'csv.broker-guide.tradingview.warning.message':
    'Other export types (such as Positions or Orders) will not work for import.',

  

  

  

  'csv.broker-guide.hyperliquid.warning.emphasis': '10,000 entry limit.',

  

  'csv.broker-guide.sierrachart.step-1':
    'Open Trade Activity Log (Trade → Trade Activity Log, or Ctrl+Shift+A)',

  

  

  

  'csv.broker-guide.atas.warning.emphasis': 'Important:',
  'csv.broker-guide.atas.warning.message':
    'Do not edit the exported file. Journalit preserves trades from the “Journal” sheet and, when available, enriches commission using matching fills from the “Executions” sheet.',

  

  'csv.broker-guide.rithmic.warning.emphasis': 'Important:',

  

  'csv.broker-guide.jdr.warning.emphasis': 'Important:',

  
  'csv.date-format.auto-detect':
    'Auto-detect (recommended for ISO/standard formats)',
  'csv.date-format.us-date': 'US Date: 12/25/2024 (Schwab, Fidelity, E*TRADE)',
  'csv.date-format.us-datetime': 'US DateTime: 12/25/2024 14:30:00 (Webull)',
  'csv.date-format.us-short': 'US Short: 1/5/2024 (TradeZero)',
  'csv.date-format.us-short-datetime': 'US Short DateTime: 1/5/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'ISO DateTime: 2024-12-25 14:30:00 (Bybit, Tradovate)',
  'csv.date-format.iso-date': 'ISO Date: 2024-12-25 (Interactive Brokers)',
  'csv.date-format.eu-date': 'EU Date: 25/12/2024 (day/month/year)',
  'csv.date-format.eu-datetime': 'EU DateTime: 25/12/2024 14:30:00',
  'csv.date-format.eu-dash': 'EU Dash: 25-12-2024',
  'csv.date-format.eu-dash-datetime': 'EU Dash DateTime: 25-12-2024 14:30:00',

  
  
  
  'upgrade.title': 'Upgrade to Pro',
  'upgrade.feature-message':
    '{featureName} is a Pro feature. Upgrade to unlock advanced automation and features.',
  'upgrade.benefits-title': 'Pro Features Include:',
  'upgrade.benefit.csv': 'CSV import with AI-assisted column mapping',
  'upgrade.benefit.economic-calendar':
    'Economic Calendar with automatic weekly event imports',
  'upgrade.benefit.trade-sync': 'Trade Sync for supported brokers',
  'upgrade.benefit.multi-account': 'Multi-account support',
  'upgrade.prop-profiles.message-firms':
    'Journalit keeps the rules for {count} prop firms ready to prefill into your challenge.',
  'upgrade.prop-profiles.message-firm':
    'Journalit has the rules for every {firm} challenge ready to prefill.',
  'upgrade.prop-profiles.message':
    'Journalit keeps prop-firm rules ready to prefill into your challenge.',
  'upgrade.prop-profiles.benefits-title': 'What Pro fills in for you:',
  'upgrade.benefit.prop.rules':
    "Drawdown and daily loss limits, straight from your firm's rules",
  'upgrade.benefit.prop.payout': 'Payout thresholds and eligibility conditions',
  'upgrade.benefit.prop.phases':
    'Phase targets and progression for the challenge you pick',
  'upgrade.benefit.prop.updates': 'Rule updates when your firm changes them',
  'upgrade.trial-notice':
    'Get a 2-week free trial to import all your historical trades and try all Pro features risk-free.',

  
  
  

  'monthly.overview.drawdown': 'Monthly Drawdown',
  'monthly.overview.no-drawdown-data': 'No drawdown data to display',

  
  
  
  'settings.account-linking.title': 'Change Account Linking',
  'settings.account-linking.description':
    'Move all trades from one MT account to a different Obsidian account',
  'settings.account-linking.source.title': 'Source MT Account',
  'settings.account-linking.source.description':
    'Select the MT account whose trades you want to move',
  'settings.account-linking.source.placeholder': 'Select source account...',
  'settings.account-linking.target.title': 'Target Obsidian Account',
  'settings.account-linking.target.description':
    'Select the Obsidian account to link the trades to',
  'settings.account-linking.target.placeholder': 'Select target account...',
  'settings.account-linking.button.processing': 'Processing...',
  'settings.account-linking.button.relink': 'Relink Account',
  'settings.account-linking.warning':
    'This will update all synced trades from the source account to be linked to the target account. This operation cannot be undone.',
  'settings.account-linking.success.relinked':
    'Successfully relinked {count} trades from {source} to {target}',
  'settings.account-linking.error.select-both':
    'Please select both source and target accounts',
  'settings.account-linking.error.source-not-found': 'Source account not found',
  'settings.account-linking.error.target-not-found': 'Target account not found',
  'settings.account-linking.error.already-linked':
    'This MT account is already linked to the selected Obsidian account',
  'settings.account-linking.error.service-manager':
    'Service manager not available',
  'settings.account-linking.error.backend-service':
    'Backend service not available',
  'settings.account-linking.error.relink-failed':
    'Failed to relink account: {error}',

  
  
  
  'account.type.demo': 'Demo',
  'account.type.evaluation': 'Evaluation',
  'account.type.funded': 'Funded',
  'account.type.archived': 'Archived',

  
  
  
  'account-page.error.title': 'Error Loading Account',
  'account-page.error.not-found':
    'Could not find account data for "{accountName}"',
  'account-page.error.not-found-sub':
    'Please check if the account exists or try refreshing the page.',
  'account-page.guide.empty.intro.title': 'This page is one account in detail',
  'account-page.guide.empty.intro.description':
    'Use the Account Page to manage one account, record account events, and open its filtered Trade Log when you want to review trades.',
  'account-page.guide.empty.edit-account.title':
    'Edit Account opens the full account settings',
  'account-page.guide.empty.edit-account.description':
    'Use this button to change the account name, type, currency, drawdown rules, profit target, monthly cost, and more.',
  'account-page.guide.empty.add-event.title':
    'Add Event records deposits and withdrawals',
  'account-page.guide.empty.add-event.description':
    'Use this button whenever money moves in or out of the account outside of normal trades.',
  'account-page.guide.empty.transactions.title':
    'Cash movements are tracked here',
  'account-page.guide.empty.transactions.description':
    'This section keeps a row-by-row record of manual deposits and withdrawals, shown as Payouts on a prop-challenge account. When it is empty, use Add Event to create the first one.',
  'account-page.guide.empty.trade-log.title':
    'Open this account in the Trade Log',
  'account-page.guide.empty.trade-log.description':
    'This header button opens the Trade Log with this account already selected, so trade review stays in the dedicated Trade Log view.',
  'account-page.guide.main.intro.title': 'This page is your account breakdown',
  'account-page.guide.main.intro.description':
    'Use the Account Page to understand one account clearly: balance history, performance, risk limits, and cash movements.',
  'account-page.guide.main.balance-chart.title':
    'The balance chart shows more than just balance',
  'account-page.guide.main.balance-chart.description':
    'This chart shows the account over time, including deposits and withdrawals, plus the drawdown and profit-target levels you set for the account.',
  'account-page.guide.main.metrics.title':
    'These metrics summarise this account only',
  'account-page.guide.main.metrics.description':
    'The connected metrics panel covers profit factor, average outcomes, winning and losing trades, commissions, fees, configured one-time costs, and estimated recurring account costs.',
  'account-page.guide.main.risk.title':
    'Risk progress is tracked separately here',
  'account-page.guide.main.risk.description':
    'This section shows drawdown and profit-target progress. If the account tracks a prop challenge, its current phase and rules appear just below it.',
  'account-page.guide.main.transactions.title':
    'Cash movements stay in their own section',
  'account-page.guide.main.transactions.description':
    'Each row records one cash movement with its amount and the balance after it, so you can separate cash from trading performance. On a prop-challenge account the same table is shown as numbered Payouts.',
  'account-page.guide.main.trade-log.title':
    'View this account’s trades in the Trade Log',
  'account-page.guide.main.trade-log.description':
    'Open the Trade Log with this account already selected. On a multi-phase challenge the button follows the phase you are viewing; the arrow offers the other phases or the whole account.',
  'account-page.guide.main.add-event.title':
    'Add Event records deposits and withdrawals',
  'account-page.guide.main.add-event.description':
    'Use this whenever money is added or removed outside of normal trade results, so the account history stays accurate.',
  'account-page.guide.main.edit-account.title':
    'Edit Account changes the account settings',
  'account-page.guide.main.edit-account.description':
    'This is where you update the account details, risk rules, drawdown, and profit target if they change over time.',

  
  
  
  'account-dashboard.title': 'Accounts',
  'account-dashboard.copy-badge.base': 'BASE',
  'account-dashboard.copy-badge.copy': 'COPIER',
  'account-dashboard.copy-badge.copied-by': 'Copied by',
  'account-dashboard.copy-badge.copies-tooltip-masked': 'Copies {account}',
  'account-dashboard.copy-badge.copies-tooltip':
    'Copies {account} at {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService not initialized after multiple attempts',
  'account-dashboard.error.loading': 'Error loading accounts: {error}',
  'account-dashboard.error.retry':
    'AccountPageService not ready, retrying in {delay}ms (attempt {attempt}/{max})',
  'account-dashboard.challenges.empty.title': 'No challenges yet',
  'account-dashboard.challenges.empty.message':
    'Track a prop-firm challenge as one account with phases, rules and payouts.',
  'account-dashboard.challenges.empty.create': 'New challenge',
  'account-dashboard.challenges.empty.setup': 'Set up existing accounts',
  'account-dashboard.empty.title': 'No Accounts Found',
  'account-dashboard.empty.message':
    'Create an account to start tracking your trading performance',
  'account-dashboard.section.empty': 'No {type} accounts',
  'account-dashboard.section.empty-sub': 'Create an account to see it here',
  'account-dashboard.button.create-first': 'Create Your First Account',
  'account-dashboard.action.create': 'Create new account',
  'account-dashboard.action.settings': 'Accounts settings',
  'account-dashboard.weight-bar.aria': 'Account type AUM distribution',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: {percent}% of total AUM',
  'account-dashboard.guide.empty.intro.title':
    'This page keeps all of your accounts in one place',
  'account-dashboard.guide.empty.intro.description':
    'Use Accounts to see all of your accounts together. Once accounts exist, this page becomes the fastest way to compare them.',
  'account-dashboard.guide.empty.state.title':
    'There is nothing here yet because no accounts exist',
  'account-dashboard.guide.empty.state.description':
    'The dashboard stays empty until you create your first account. After that, it will show account totals, sections, and shortcuts into each account page.',
  'account-dashboard.guide.empty.create.title':
    'Create your first account here',
  'account-dashboard.guide.empty.create.description':
    'Click this button to create the first account you want Journalit to track.',
  'account-dashboard.guide.empty.after-create.title':
    'After you save, Journalit opens the account page',
  'account-dashboard.guide.empty.after-create.description':
    'Fill in the basic account details and save. The next guide will pick up on the Account Page for that specific account.',
  'account-dashboard.guide.main.intro.title': 'These are your accounts',
  'account-dashboard.guide.main.intro.description':
    'Use this page to compare every account in one place. Prop challenges stay in the same account groups, with their phase and rule progress shown directly on each card.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM means assets under management',
  'account-dashboard.guide.main.aum-chart.description':
    'This chart tracks your combined account value over time. When prop accounts exist, a challenge ledger beside it adds pass rate, costs, payouts, and net results.',
  'account-dashboard.guide.main.metrics.title':
    'These metrics summarise all visible accounts',
  'account-dashboard.guide.main.metrics.description':
    'Use these stats for a quick account-level snapshot before drilling into specific account types or specific accounts.',
  'account-dashboard.guide.main.mode-switch.title':
    'Overview and Challenges are two views of the same accounts',
  'account-dashboard.guide.main.mode-switch.description':
    'Overview keeps the AUM chart and portfolio totals. Switch to Challenges for prop-challenge economics: pass rate, costs, payouts, and phase bottlenecks across every challenge account.',
  'account-dashboard.guide.main.create-account.title':
    'You can create another account from here at any time',
  'account-dashboard.guide.main.create-account.description':
    'Use this button whenever you want to add a new account to the dashboard.',
  'account-dashboard.guide.main.settings-types.title':
    'Settings can manage available account types',
  'account-dashboard.guide.main.settings-types.description':
    'Inside settings, you can add custom account types and remove old ones if your workflow changes.',
  'account-dashboard.guide.main.settings-stages.title':
    'Challenge stages can set the account type',
  'account-dashboard.guide.main.settings-stages.description':
    'Pick the account type applied when a challenge reaches evaluation, sim funded, or live funded. Leave a stage on no change to keep the account type as it is.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Settings can change what counts in totals',
  'account-dashboard.guide.main.settings-inclusion.description':
    'You can hide account types from dashboard totals without deleting them, and you can separately decide whether their withdrawals still count.',
  'account-dashboard.guide.main.settings-order.title':
    'This section controls the order of account groups',
  'account-dashboard.guide.main.settings-order.description':
    'Use these controls to decide which account types appear first on the dashboard.',

  'account-dashboard.guide.main.open-account.title':
    'Open any account card to go deeper',
  'account-dashboard.guide.main.open-account.description':
    'Accounts are grouped by type so you can compare similar ones. Open any card for the full breakdown; the Account Page guide takes over there.',

  
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    'What’s new: multi-phase prop challenges',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    'Prop-challenge progress now lives directly in the Account Dashboard, with phase ribbons, challenge economics, and the same account groups you already use.',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    'Enable tracking when you create or edit an account',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    'In Create Account or Edit Account, choose Prop challenge in the account mode selector. Each phase can optionally promote the account to another account type when you advance.',
  'account-dashboard.guide.whats-new.prop-challenges.overview.title':
    'Challenge performance at a glance',
  'account-dashboard.guide.whats-new.prop-challenges.overview.description':
    'The top scorecard summarizes active challenges, pass rate, costs, payouts, and net results. The insight tables compare phase bottlenecks and, when you track multiple firms, performance by prop firm.',
  'account-dashboard.guide.whats-new.prop-challenges.ribbons.title':
    'Phase ribbons make every challenge scannable',
  'account-dashboard.guide.whats-new.prop-challenges.ribbons.description':
    'Prop account cards show completed, current, pending, and failed phases across the top, followed by live target, drawdown, daily-loss, and trading-day progress.',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    'Switch between portfolio and challenge analysis',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    'Choose Challenges to see aggregate prop-challenge economics plus phase and multi-firm insights. Overview keeps the AUM chart and portfolio totals focused.',
  'account-dashboard.guide.whats-new.prop-challenges.account-page.title':
    'Converted accounts stay in the same flow',
  'account-dashboard.guide.whats-new.prop-challenges.account-page.description':
    'When a challenge advances or converts to funded, its account type and phase history stay connected. Open the card for compliance decisions, lifecycle actions, and the full rule breakdown.',
  'account-dashboard.metrics.total-accounts': 'Total Accounts',
  'account-dashboard.metrics.total-aum': 'Total AUM',
  'account-dashboard.metrics.total-growth': 'Total Growth',
  'account-dashboard.metrics.growth-percent': 'Growth %',
  'account-dashboard.metrics.total-withdrawals': 'Total Withdrawals',
  'account-dashboard.metrics.no-withdrawals': 'No withdrawals',
  'account-dashboard.metrics.total-trades': 'Total Trades',
  'account-dashboard.prop.metrics.total': 'Challenges',
  'account-dashboard.prop.metrics.pass-rate': 'Pass rate',
  'account-dashboard.prop.metrics.costs': 'Challenge costs',
  'account-dashboard.prop.metrics.payouts': 'Payouts',
  'account-dashboard.prop.metrics.net': 'Net',
  'account-dashboard.prop.tabs.overview': 'Overview',
  'account-dashboard.mode.selector': 'Account dashboard mode',
  'account-dashboard.mode.account-overview': 'Overview',
  'account-dashboard.mode.challenges': 'Challenges',
  'account-dashboard.prop.metrics.active': 'Active challenges',
  'account-dashboard.prop.economics.title': 'Economics',
  'account-dashboard.prop.economics.roi': 'ROI',
  'account-dashboard.prop.economics.roi-no-cost': 'No cost',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    'Average cost per attempt',
  'account-dashboard.prop.economics.cost-per-funded-account':
    'Cost per funded account',
  'account-dashboard.prop.economics.payout-conversion': 'Payout conversion',
  'account-dashboard.prop.insights.title': 'Challenge insights',
  'account-dashboard.prop.phases.title': 'Phase insights',
  'account-dashboard.prop.phases.phase': 'Phase',
  'account-dashboard.prop.phases.average-duration': 'Avg duration',
  'account-dashboard.prop.phases.show-more': 'Show {count} more',
  'account-dashboard.prop.phases.show-fewer': 'Show fewer',
  'account-dashboard.prop.tooltip.open-explanation': 'Explain {metric}',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    'Not enough completed data yet',
  'account-dashboard.prop.tooltip.pass-rate.description':
    'The share of completed challenges that were passed. Active challenges and archived challenges without an outcome are excluded.',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    'Passed challenges ÷ completed challenges × 100',
  'account-dashboard.prop.tooltip.roi.description':
    'Net payout return (payouts minus challenge costs) relative to challenge costs. ROI is calculated only when all included challenges use one currency.',
  'account-dashboard.prop.tooltip.roi.formula':
    '(Payouts − challenge costs) ÷ challenge costs × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    'These challenges cost nothing, so there is no cost basis to divide by. The net return is the {payouts} of payouts.',
  'account-dashboard.prop.tooltip.average-cost.description':
    'The average challenge cost for each attempt, calculated separately for each currency.',
  'account-dashboard.prop.tooltip.average-cost.formula':
    'Challenge costs ÷ total challenge attempts',
  'account-dashboard.prop.tooltip.funded-cost.description':
    'The average challenge cost required for each passed challenge, calculated separately for each currency.',
  'account-dashboard.prop.tooltip.funded-cost.formula':
    'Challenge costs ÷ passed challenges',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    'The share of passed challenges that have produced at least one payout.',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    'Passed challenges with a payout ÷ passed challenges × 100',
  'account-dashboard.prop.tabs.phases': 'Phases',
  'account-dashboard.prop.tabs.firms': 'Firms',
  'account-dashboard.prop.firms.firm': 'Firm',
  'account-dashboard.prop.firms.attempts': 'Attempts',
  'account-dashboard.prop.phases.most-failed': 'Most failed',
  'account-dashboard.prop.phases.days': '{count} days',
  'account-dashboard.prop.phases.empty': 'No completed phases yet',
  'account-dashboard.type-header.excluded': 'Excluded',
  'account-dashboard.type-header.from-stats': 'From Stats',
  'account-dashboard.type-header.of-total-aum': 'of Total AUM',
  'account-dashboard.type-header.aum': 'AUM',
  'account-dashboard.type-header.withdrawals': 'Withdrawals',
  'account-dashboard.type-header.account': 'Account',
  'account-dashboard.type-header.accounts': 'Accounts',
  'account-dashboard.type-header.trade': 'Trade',
  'account-dashboard.type-header.trades': 'Trades',
  'account-dashboard.type-header.growth': 'Growth ({percent})',
  'account-card.metric.trades': 'Trades',
  'account-card.metric.withdrawals': 'Withdrawals',
  'account-card.metric.age': 'Age',
  'account-card.progress.profit-target': 'Profit Target',
  'account-card.progress.drawdown-used': 'Drawdown Limit Used',
  'account-card.progress.not-set': 'Not set',
  'account-card.footer.monthly': 'Monthly:',
  'account-card.footer.total-costs': 'Total Costs:',
  'account.metrics.total-account-costs': 'Estimated total costs',
  'account.metrics.total-costs': 'Total costs',
  'account.metrics.one-time-costs': 'One-time costs',
  'account.metrics.recurring-costs-to-date': 'Recurring costs to date',
  'account.metrics.monthly-cost': 'Monthly cost',

  
  'account.chart.event.added': 'Account Added',
  'account.chart.event.archived': 'Account Archived',
  'account.balance-chart.drawdown-floor-off-scale':
    'Drawdown floor {value} ({distance} below)',
  'account.balance-chart.profit-target-off-scale':
    'Profit target {value} ({distance} above)',
  'account.balance-chart.empty': 'No trades found',
  'account.balance-chart.empty-sub':
    'No trading activity available for this account',
  'account.aum-chart.empty': 'No account data',
  'account.aum-chart.empty-sub': 'Add accounts to view AUM history',
  'chart.shared.empty': 'No trades available',
  'chart.shared.empty-sub': 'Try selecting a different time period',

  
  
  
  'account.link-modal.title': 'New Trading Account Detected',
  'account.link-modal.account-id': 'Account ID:',
  'account.link-modal.broker': 'Broker:',
  'account.link-modal.first-seen': 'First Seen:',
  'account.link-modal.question': 'How would you like to handle this account?',
  'account.link-modal.option.new': 'Create new account with custom name',
  'account.link-modal.placeholder.custom-name': 'e.g., FTMO Challenge',
  'account.link-modal.account-type': 'Account Type:',
  'account.link-modal.option.existing': 'Link to existing account',
  'account.link-modal.no-accounts-available': '(no accounts available)',
  'account.link-modal.select-account': 'Select an account...',

  'account.link-modal.option.default': 'Use default name: Account-{id}',
  'account.link-modal.default-name': 'Account-{id}',
  'account.link-modal.button.linking': 'Linking...',
  'account.link-modal.notice.select-existing':
    'Please select an existing account',
  'account.link-modal.notice.failed': 'Failed to link account: {error}',

  
  
  
  'trade.review.title': 'Trade Review',

  

  'trade.details.entry': 'Entry',
  'trade.details.exit': 'Exit',

  'trade.details.duration': 'Duration',

  'trade.details.thesis': 'Thesis',

  'trade.details.entries-summary': '{count} entries',
  'trade.details.exits-summary': '{count} exits',
  'trade.details.take-profit-count': '{count} targets',

  
  'trade.metadata.account': 'Account:',

  'trade.metadata.setups': 'Setups',
  'trade.metadata.mistakes': 'Mistakes',

  
  'trade.image.no-images': 'No images for this trade',
  'trade.image.click-edit': 'Add image',
  'trade.image.alt-prefix': 'Trade image',

  

  'trade.review.reviewed': 'Reviewed',
  'trade.review.reviewed-on': 'Reviewed on {date}',

  
  
  

  'timeline.status.loss': 'Loss',

  'timeline.aria.session-navigation': 'Same-day trade navigation',
  'timeline.aria.previous-trade': 'Previous trade: {trade}',
  'timeline.aria.next-trade': 'Next trade: {trade}',
  'timeline.aria.no-previous-trade': 'No previous trade in this trading day',
  'timeline.aria.no-next-trade': 'No next trade in this trading day',

  
  
  

  
  
  

  'drc.tab.review': 'Review',

  
  
  

  
  
  

  'drc.missed-trades.label.reason': 'Reason:',

  
  
  
  'missed-trade.reason-title': 'Why I missed this trade',

  
  
  

  
  
  
  'settings.general.title': 'General Settings',
  'settings.general.docs': 'Docs',
  'settings.general.discord': 'Discord',
  'settings.general.github': 'GitHub',

  
  'settings.general.currency': 'Currency',
  'settings.general.currency-desc':
    'Choose the currency to display for all monetary values throughout the plugin',
  'settings.general.currency-aria':
    'Select currency for displaying monetary values',
  'settings.general.currency-changed':
    'Currency changed to {currency}. All components will update immediately!',
  'settings.general.currency-save-failed':
    'Failed to save currency setting. Please try again.',

  
  'settings.general.path-change.title': 'Journal Folder Location Changed',
  'settings.general.path-change.new-trades-title':
    'New trades will be created in your new folder location',
  'settings.general.path-change.new-trades-desc':
    'All future trading journals will use:',
  'settings.general.path-change.manual-title': 'Manual Action Required:',
  'settings.general.path-change.manual-desc':
    'You have existing trades in your current folder. To move them:',
  'settings.general.path-change.step.open-explorer':
    "Open your vault's file explorer",
  'settings.general.path-change.step.find-folder-prefix': 'Find your',
  'settings.general.path-change.step.find-folder-suffix': 'folder',
  'settings.general.path-change.step.drag-drop':
    'Drag and drop it to your new location when convenient',
  'settings.general.path-change.manual-note':
    'This gives you full control over when and how your files are moved.',
  'settings.general.path-change.sync-title': 'Sync Mapping Update:',
  'settings.general.path-change.sync-desc':
    'The plugin will automatically update your trade sync mappings to reflect the new folder path. This ensures your synced trades remain connected to their backend records.',
  'settings.general.path-change.button.cancel': 'Cancel',
  'settings.general.path-change.button.confirm': 'I Understand',

  
  'settings.general.display-name': 'Display Name',
  'settings.general.display-name-desc':
    'Optional name to display in the Journalit view welcome message (e.g., "Good morning, Alex")',
  'settings.general.display-name-placeholder': 'Add new display name...',
  'settings.general.display-name-aria': 'Display name for welcome message',
  'settings.general.display-name-confirm-aria': 'Confirm display name change',
  'settings.general.display-name-cancel-aria': 'Cancel display name change',
  'settings.general.display-name-saved': 'Display name saved as "{name}"',
  'settings.general.display-name-cleared': 'Display name cleared',
  'settings.general.display-name-save-failed':
    'Failed to save display name. Please try again.',

  
  'settings.general.privacy-mode': 'Privacy Mode',
  'settings.general.privacy-mode-desc':
    'Mask sensitive trading, account, price, and performance values in the UI without changing saved data.',
  'settings.general.privacy-mode-aria': 'Toggle privacy mode',

  'settings.general.home-view-settings': 'Home View Settings',
  'settings.general.home-auto-open': 'Home View Auto-Open',
  'settings.general.home-auto-open-desc':
    'Choose when to automatically open the Home view',
  'settings.general.home-auto-open-always': 'Always open + focus (default)',
  'settings.general.home-auto-open-ifnone': 'Only if no active file',
  'settings.general.home-auto-open-never': 'Never (manual only)',
  'settings.general.home-auto-open-aria': 'Select home startup behavior',
  'settings.general.home-startup-changed':
    'Journalit startup behavior changed to: {behavior}',

  'settings.general.filter-recent': 'Filter Recent Items to Journalit Files',
  'settings.general.filter-recent-desc':
    'Only show Journalit-related files in the Recent Items widget (files within the .journalit folder). Hides all other vault files from the recent items list.',
  'settings.general.filter-recent-aria':
    'Filter recent items to Journalit files',
  'settings.general.filter-recent-toggled':
    'Filter recent items to Journalit files {status}',

  'settings.general.home-background': 'Home Background Image',
  'settings.general.home-widget-opacity': 'Widget opacity',
  'settings.general.home-widget-opacity-desc':
    'Widget backgrounds with an image: 0% is transparent, 100% is solid. Applies to the current theme; light and dark values are saved separately.',
  'settings.general.home-widget-opacity-save-failed':
    'Could not save widget opacity. Please try again.',
  'settings.general.home-background-desc': 'Shown behind your Home widgets.',
  'settings.general.home-background-dashboard': 'Show background in Dashboard',
  'settings.general.home-background-dashboard-desc':
    'Use the same background image in Dashboard mode.',
  'settings.general.home-background-dashboard-aria':
    'Show Home background in Dashboard',

  'settings.general.home-background-choose': 'Choose image',
  'settings.general.home-background-clear': 'Clear',

  'settings.general.home-background-invalid-file':
    'Choose a supported image file.',
  'settings.general.home-background-saved': 'Home background image saved.',
  'settings.general.home-background-cleared': 'Home background image cleared.',
  'settings.general.home-background-save-failed':
    'Failed to save the Home background image.',

  
  'settings.general.folder-section': 'Folder Location & Image Paths',
  'settings.general.journal-folder': 'Journal Folder Location',
  'settings.general.journal-folder-desc':
    'Choose where your trading journals are stored in your vault.',
  'settings.general.journal-folder-desc-2':
    'Leave empty to use the default root folder location.',
  'settings.general.journal-folder-placeholder': 'Select custom folder...',
  'settings.general.journal-folder-default':
    'Default: Root folder (!Journalit)',

  'settings.general.update-image-paths': 'Update Image Paths',
  'settings.general.update-image-paths-desc':
    'Updates image paths in all trades to match current folder location. Use this after manually moving your !Journalit folder.',
  'settings.general.update-image-paths-updating': 'Updating...',
  'settings.general.update-image-paths-match':
    'All image paths already match current folder location',
  'settings.general.folder-updated':
    'Journal folder path updated. New trades will be created in: {path}',
  'settings.general.folder-update-failed': 'Failed to update path: {error}',
  'settings.general.update-image-paths-success':
    'Successfully updated image paths in {count} trades',
  'settings.general.update-image-paths-no-update':
    'No image paths needed updating',
  'settings.general.update-image-paths-errors':
    'Updated {updated} trades with {failed} errors. Check console for details.',
  'settings.general.update-image-paths-failed':
    'Failed to update image paths. Check console for details.',

  
  'settings.general.trade-settings': 'Trade Settings',
  'settings.general.auto-open-trades': 'Auto-open Created Trades',
  'settings.general.auto-open-trades-desc':
    'Automatically open trade notes in a new tab after they are created',
  'settings.general.auto-open-trades-aria': 'Auto-open created trades',
  'settings.general.auto-open-toggled': 'Auto-open created trades {status}',

  'settings.general.date-format': 'Date Format',
  'settings.general.date-format-desc':
    'Format for displaying dates throughout the plugin',
  'settings.general.date-format-aria': 'Select date format for trade notes',
  'settings.general.date-format-ddmmyy': 'DD/MM/YY (31/12/23)',
  'settings.general.date-format-mmddyy': 'MM/DD/YY (12/31/23)',
  'settings.general.date-format-yymmdd': 'YY/MM/DD (23/12/31)',
  'settings.general.date-format-changed':
    'Trade note date format changed to {format}',

  'settings.general.use-24-hour-time': 'Use 24-Hour Time Format',
  'settings.general.use-24-hour-time-desc':
    'Display times in 24-hour format (14:30) instead of 12-hour AM/PM format (2:30 PM)',
  'settings.general.use-24-hour-time-aria': 'Use 24-hour time format',

  'settings.general.show-seconds': 'Show Seconds in Trade Times',
  'settings.general.show-seconds-desc':
    'Display seconds when entering trade entry and exit times.',
  'settings.general.show-seconds-aria': 'Show seconds in trade times',
  'settings.general.skip-weekends': 'Exclude Weekends',
  'settings.general.skip-weekends-desc':
    'When enabled, Journalit treats weekends as non-trading days across the plugin. Disable this if you trade or review activity on Saturdays and Sundays.',
  'settings.general.skip-weekends-aria': 'Exclude weekends across Journalit',
  'settings.general.skip-weekends-toggled': 'Weekend exclusion {status}',
  'settings.general.week-start': 'Week Start Day',
  'settings.general.week-start-desc':
    'Choose which day your trading week starts on. Affects weekly reviews and reports.',
  'settings.general.week-start-aria': 'Select week start day',
  'settings.general.week-start-changed': 'Week start day changed to {day}',

  'settings.general.analytics-date-basis': 'Analytics Date Basis',
  'settings.general.analytics-date-basis-desc':
    'Best for swing traders. Uses entry date or final exit date for analytics. Exit date mode only counts closed trades and requires an exit date for direct PnL trades.',
  'settings.general.analytics-date-basis-aria': 'Select analytics date basis',
  'settings.general.analytics-date-basis-entry': 'Entry date',
  'settings.general.analytics-date-basis-exit': 'Exit date',
  'settings.general.analytics-date-basis-changed':
    'Analytics date basis changed to {basis}',

  'settings.general.dollar-value-input': 'Enter Position Size as Dollar Value',
  'settings.general.dollar-value-input-desc':
    "When enabled, enter position size as a dollar amount (e.g., $10,000) instead of quantity (shares/lots/contracts). The quantity will be calculated automatically from the price. Works best for stocks; futures/forex have contract multipliers that aren't accounted for.",
  'settings.general.dollar-value-input-aria':
    'Enter position size as dollar value',
  'settings.general.dollar-value-input-toggled': 'Position size input: {mode}',
  'settings.general.dollar-value': 'Dollar value',
  'settings.general.quantity': 'Quantity',

  'settings.general.mae-mfe-input-mode': 'MAE/MFE Input Mode',
  'settings.general.mae-mfe-input-mode-desc':
    'Choose how to enter Maximum Adverse/Favorable Excursion values in the trade form.',
  'settings.general.mae-mfe-input-mode-desc-price':
    'Price levels: Enter the lowest/highest price reached during the trade.',
  'settings.general.mae-mfe-input-mode-desc-dollar':
    'Dollar values: Enter the max drawdown/profit in dollars directly.',
  'settings.general.mae-mfe-input-mode-aria': 'Select MAE/MFE input mode',
  'settings.general.mae-mfe-input-mode-price': 'Price levels',
  'settings.general.mae-mfe-input-mode-dollar': 'Dollar values',
  'settings.general.mae-mfe-display-unit': 'MAE/MFE Display Unit',
  'settings.general.mae-mfe-display-unit-desc':
    'Display MAE/MFE in currency or futures ticks across analytics and the Trade Log. Tick mode automatically recalculates eligible existing futures trades without changing saved trade data.',
  'settings.general.mae-mfe-display-unit-aria': 'Select MAE/MFE display unit',
  'settings.general.mae-mfe-display-dollar': 'Currency',
  'settings.general.mae-mfe-display-ticks': 'Ticks',
  'common.ticks': 'ticks',
  'dashboard.mae-mfe-ticks.partial-coverage':
    'Only {eligible} of {total} trades have futures tick data. This metric excludes ineligible trades.',

  'settings.general.cutoff-time': 'Trading Day Cutoff Time',
  'settings.general.cutoff-time-desc':
    'Time that defines the end of a trading day. Trades after this time will be grouped with the next day. (24-hour format, e.g., 23:30 for 11:30 PM)',
  'settings.general.cutoff-time-aria': 'Trading day cutoff time',
  'settings.general.cutoff-time-changed':
    'Trading day cutoff time changed to {time}',

  'settings.general.break-even-threshold-mode': 'Break-even Threshold Type',
  'settings.general.break-even-threshold-mode-desc':
    "Choose whether break-even is determined by a fixed P&L range or by a percentage of each trade account's current balance.",
  'settings.general.break-even-mode-fixed': 'Fixed amount range',
  'settings.general.break-even-mode-percent':
    'Percentage of current account balance',
  'settings.general.break-even-percent': 'Break-even Percentage',
  'settings.general.break-even-percent-desc':
    'Symmetric threshold around zero (±X% of current account balance). Trades without a resolvable account balance are excluded from win/loss stats.',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'Break-even percentage of current account balance',
  'settings.general.break-even-range': 'Break Even Range',
  'settings.general.break-even-range-desc':
    'Define a P&L range to consider trades as break even. For example, setting Min: -20 and Max: 20 will treat trades between -$20 and +$20 as break even. Set both to 0 to only consider exact $0.00 as break even. Minimum must be less than or equal to maximum.',
  'settings.general.break-even-min-placeholder': 'Min',
  'settings.general.break-even-max-placeholder': 'Max',
  'settings.general.break-even-min-aria': 'Break even range minimum',
  'settings.general.break-even-max-aria': 'Break even range maximum',
  'settings.general.break-even-to': 'to',
  'settings.general.break-even-warning':
    'Warning: Minimum value is greater than maximum value. This will prevent trades from being classified as breakeven.',
  'settings.general.break-even-updated':
    'Break even range updated - views will refresh on next load',

  'settings.general.default-risk': 'Default Risk Amount',
  'settings.general.default-risk-desc':
    'Default risk amount (in account currency) used for R-multiple calculations. Leave empty to require manual entry per trade.',
  'settings.general.default-risk-aria': 'Default risk amount',

  'settings.general.display-r-multiples': 'Display R-Multiples',
  'settings.general.display-r-multiples-desc':
    'Show R-multiple values (risk-to-reward ratios) instead of currency amounts throughout the plugin',
  'settings.general.display-r-multiples-aria':
    'Display R-multiples in trade views',
  'settings.general.display-r-multiples-toggled':
    'R-multiples display {status}',

  'settings.general.include-copy-accounts-analytics':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-analytics-desc':
    'When enabled, all-account trading analytics include derived copy-account results and count them as account-level trades.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-toggled':
    'Copy accounts in all-account analytics {status}',

  'settings.general.include-unrealized-pnl':
    'Include unrealized P&L in analytics',
  'settings.general.include-unrealized-pnl-desc':
    'When enabled, net P&L totals include unrealized P&L from open positions with a price snapshot, shown separately from realized results. Trade outcome statistics such as win rate and streaks stay realized-only.',
  'settings.general.include-unrealized-pnl-aria':
    'Include unrealized P&L in analytics',
  'settings.general.include-unrealized-pnl-toggled':
    'Unrealized P&L in analytics {status}',

  
  'settings.general.notification-settings': 'Notification Settings',
  'settings.general.sync-notifications': 'Sync Notifications',
  'settings.general.sync-notifications-desc':
    'Show notifications when sync operations complete',
  'settings.general.sync-notifications-aria': 'Enable sync notifications',
  'settings.general.sync-notifications-toggled': 'Sync notifications {status}',

  'settings.general.new-trade-notifications': 'New Trade Notifications',
  'settings.general.new-trade-notifications-desc':
    'Show notifications when new trade files are detected',
  'settings.general.new-trade-notifications-aria':
    'Enable new trade notifications',
  'settings.general.new-trade-notifications-toggled':
    'New trade notifications {status}',

  'settings.general.update-notifications': 'Show Update Notifications',
  'settings.general.update-notifications-desc':
    "Check Journalit's public GitHub release metadata daily and notify you when a newer version is available",
  'settings.general.update-notifications-aria': 'Show update notifications',
  'settings.general.update-notifications-toggled':
    'Update notifications {status}',

  
  'settings.general.data-management': 'Data Management & Privacy',
  'settings.general.backup-restore-section': 'Backup, Restore & Reset',
  'settings.general.export-settings': 'Export Settings',
  'settings.general.export-settings-desc':
    'Download all plugin settings as a JSON file for backup or transfer to another vault',
  'settings.general.export-settings-exporting': 'Exporting...',

  'settings.general.import-settings': 'Import Settings',
  'settings.general.import-settings-desc':
    'Restore settings from a previously exported JSON file. Settings will be merged with current values.',
  'settings.general.import-settings-importing': 'Importing...',

  'settings.general.reset-to-defaults': 'Reset to Defaults',
  'settings.general.reset-to-defaults-desc':
    'Reset all plugin settings to their default values. A backup will be created automatically.',
  'settings.general.reset-to-defaults-warning':
    'Warning: This will remove all custom options, account settings, and layouts.',
  'settings.general.reset-to-defaults-resetting': 'Resetting...',

  
  'settings.general.enabled': 'enabled',
  'settings.general.disabled': 'disabled',

  
  
  
  'settings.customization.title': 'Customisation',
  'settings.customization.description':
    'Customise options, appearance, and behavior of the Journalit plugin.',
  'settings.customization.trade-form-layout.description':
    'Choose which fields and sections appear in the trade form.',
  'settings.customization.trade-form-layout.button': 'Customise layout',
  'settings.customization.tickers-symbols': 'Tickers/Symbols',
  'settings.customization.symbol-mappings': 'Symbol Mappings',

  'settings.customization.setups': 'Setups',
  'settings.customization.mistakes': 'Mistakes',
  'settings.customization.tags': 'Tags',
  'settings.customization.events': 'Events',

  
  
  
  'settings.customization.options.confirm.update-notes': 'OK (Update Notes)',
  'settings.customization.options.confirm.save-name': 'Save Name Only',
  'settings.customization.options.confirm.cancel': 'Cancel Action',
  'settings.customization.options.type.tickers': 'Tickers',
  'settings.customization.options.type.accounts': 'Accounts',
  'settings.customization.options.type.account-types': 'Account Types',
  'settings.customization.options.type.setups': 'Setups',
  'settings.customization.options.type.mistakes': 'Mistakes',
  'settings.customization.options.type.tags': 'Tags',
  'settings.customization.options.type.events': 'Events',
  'settings.customization.options.asset-type.cfd': 'CFD',
  'settings.customization.options.notice.empty-name':
    'Option name cannot be empty',
  'settings.customization.options.notice.invalid-ticker':
    'Invalid ticker format. Only letters, numbers, and periods are allowed.',
  'settings.customization.options.notice.added':
    'Added option "{newValue}" to {type}',
  'settings.customization.options.notice.duplicate':
    'Duplicate option: {newValue} already exists',
  'settings.customization.options.notice.asset-type-required':
    'Asset type is required for instruments',
  'settings.customization.options.notice.updated-with-notes':
    'Updated option from "{oldValue}" to "{newValue}" and updated {count} notes',
  'settings.customization.options.notice.updated':
    'Updated option from "{oldValue}" to "{newValue}"',
  'settings.customization.options.confirm.rename-message':
    'Do you want to update all existing notes that use "{oldValue}" to use "{newValue}" instead?\n\nThis will search through all notes and update the option value wherever it\'s found.',
  'settings.customization.options.notice.cannot-delete-archived':
    'Cannot delete the "Archived" account type - it is reserved for archiving accounts',
  'settings.customization.options.confirm.remove-message':
    'Are you sure you want to remove "{option}"? This cannot be undone.',
  'settings.customization.options.confirm.remove-tag-message':
    'Delete the global tag "{option}"? This removes it from every Journalit trade and setup note.',
  'settings.customization.options.notice.removed': 'Removed option "{option}"',
  'settings.customization.options.notice.remove-failed':
    'Option removal failed',
  'settings.customization.options.confirm.reset-message':
    'Are you sure you want to reset all {type} to the default options? This cannot be undone.',
  'settings.customization.options.confirm.reset-tag-message':
    'Reset the global tag list and colors to their defaults? Tags already assigned to trade and setup notes will stay in those notes.',
  'settings.customization.options.notice.reset-success':
    'Reset {type} to the default options',
  'settings.customization.options.notice.no-options-to-reset':
    'Default {type} options are already in use',
  'settings.customization.options.notice.mapping-symbols-required':
    'Both symbols are required',
  'settings.customization.options.notice.mapping-added':
    'Mapping added: {imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    'Failed to add mapping',
  'settings.customization.options.notice.mapping-deleted':
    'Mapping deleted: {symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    'Failed to delete mapping',
  'settings.customization.options.empty-state':
    'No custom {type} have been added yet.',
  'settings.customization.options.label.save-changes': 'Save changes',
  'settings.customization.options.label.cancel-editing': 'Cancel editing',
  'settings.customization.options.label.edit-option': 'Edit {option}',
  'settings.customization.options.label.remove-option': 'Remove {option}',
  'settings.customization.options.placeholder.select-asset':
    'Select asset type...',
  'settings.customization.options.field.pip-size': 'Pip Size',
  'settings.customization.options.field.priority': 'Priority:',
  'settings.customization.options.field.default-event-notes':
    'Default event notes:',
  'settings.customization.options.placeholder.default-event-notes':
    'Notes to auto-fill when this event is selected',
  'settings.customization.options.aria.confirm-add': 'Confirm add {type}',
  'settings.customization.options.label.locked': 'Locked',
  'settings.customization.options.label.archived-reserved':
    'Archived (reserved)',
  'settings.customization.options.aria.reset-all': 'Remove all custom {type}',
  'settings.customization.options.button.reset-all': 'Reset All {type}',
  'settings.customization.options.placeholder.new-name': 'New {type} Name',
  'settings.customization.options.placeholder.dollar-per-point': '$/point',
  'settings.customization.options.placeholder.tick-size': 'Tick size',
  'settings.customization.options.placeholder.tick-value': 'Tick value',
  'settings.customization.options.placeholder.lot-size': 'Lot size',
  'settings.customization.options.placeholder.pip-value': 'Pip value',
  'settings.customization.options.placeholder.pip-size': 'Pip size',
  'settings.customization.options.field.optional': '(optional)',
  'settings.customization.options.mapping.description':
    'Maps contract-specific symbols (e.g., NQZ5) to base symbols (e.g., NQ) for automatic spec lookup',
  'settings.customization.options.mapping.auto-detected': 'Auto-detected',
  'settings.customization.options.mapping.manual': 'Manual',
  'settings.customization.options.mapping.created-at': 'Created {date}',
  'settings.customization.options.mapping.no-mappings':
    'No symbol mappings yet. Mappings are created automatically during CSV imports when contract symbols are detected.',
  'settings.customization.options.mapping.placeholder-imported':
    'Imported symbol (e.g., NQZ5)',
  'settings.customization.options.mapping.placeholder-base':
    'Base symbol (e.g., NQ)',
  'settings.customization.options.mapping.button-add': 'Add Mapping',
  'settings.customization.options.placeholder.add-new': 'Add new {type}',
  'settings.customization.options.aria.delete-mapping': 'Delete mapping',
  'settings.customization.options.instrument.specs-futures':
    '${dollar}/pt, {tick} tick, ${value} tick val',
  'settings.customization.options.instrument.specs-forex':
    '{lot} lot, ${pip} pip val, {size} pip size',
  'settings.customization.options.instrument.built-in': '(built-in)',
  'settings.customization.options.instrument.mapped-to':
    "Mapped to {base} (uses {base}'s specs)",
  'settings.customization.options.instrument.no-specs': '(No specs set)',
  'settings.customization.options.commission.costs': 'Costs',
  'settings.customization.options.commission.add-rule': '+ Add cost rule',
  'settings.customization.options.commission.applies-to': 'Applies to',
  'settings.customization.options.commission.method': 'Method',
  'settings.customization.options.commission.entry': 'Entry',
  'settings.customization.options.commission.exit': 'Exit',
  'settings.customization.options.commission.round-trip': 'Round trip',
  'settings.customization.options.commission.actions': 'Actions',
  'settings.customization.options.commission.all-accounts': 'All accounts',
  'settings.customization.options.commission.per-side': 'Per side',
  'settings.customization.options.commission.remove-rule': 'Remove cost rule',

  
  
  

  
  
  
  'button.remove': 'Remove',

  'button.move-up': 'Move up',
  'button.move-down': 'Move down',

  
  
  
  'settings.customization.trade-fields': 'Custom Trade Fields',
  'settings.customization.custom-fields.description':
    "Add your own fields to every trade, like session, timeframe or setup grade. They appear in the Advanced tab of the trade form, save to the trade note's frontmatter, and can become sortable, filterable columns in the Trade Log.",
  'settings.customization.custom-fields.title': 'Custom Fields ({count})',
  'settings.customization.custom-fields.manage-desc':
    'Manage your custom trade form fields',
  'settings.customization.custom-fields.type-dropdown': 'Dropdown',
  'settings.customization.custom-fields.type-multiselect': 'Multi-select',
  'settings.customization.custom-fields.type-suffix': 'field',
  'settings.customization.custom-fields.option-count.one': '{count} option',
  'settings.customization.custom-fields.option-count.few': '{count} options',
  'settings.customization.custom-fields.option-count.many': '{count} options',
  'settings.customization.custom-fields.option-count.other': '{count} options',
  'settings.customization.custom-fields.no-fields':
    'No custom fields defined yet',
  'settings.customization.custom-fields.no-fields-desc':
    'Start with one field you will actually review later, such as the session you traded or how closely the setup matched your plan.',
  'settings.customization.custom-fields.add-new': 'Add New Field',

  'settings.customization.custom-fields.edit-field-with-name':
    'Edit “{fieldLabel}”',
  'settings.customization.custom-fields.configure-desc':
    'Configure your custom field settings below',
  'settings.customization.custom-fields.actions': 'Actions',
  'settings.customization.custom-fields.actions-desc':
    'Manage your custom fields',
  'settings.customization.custom-fields.add-button': 'Add Custom Field',
  'settings.customization.custom-fields.delete-all-button': 'Delete All Fields',

  
  'settings.customization.custom-fields.editor.title': 'Field Configuration',
  'settings.customization.custom-fields.editor.label': 'Field Label',
  'settings.customization.custom-fields.editor.label-desc':
    'Display name for this field',
  'settings.customization.custom-fields.editor.label-placeholder':
    'Enter field label',
  'settings.customization.custom-fields.editor.key': 'Frontmatter Key',
  'settings.customization.custom-fields.editor.key-desc':
    'This key will appear in your trade files: ',
  'settings.customization.custom-fields.editor.key-placeholder': 'field_name',
  'settings.customization.custom-fields.editor.key-reserved':
    '⚠️ Reserved field name',
  'settings.customization.custom-fields.editor.type': 'Field Type',
  'settings.customization.custom-fields.editor.type-desc':
    'Type of input field',
  'settings.customization.custom-fields.editor.placeholder': 'Placeholder Text',
  'settings.customization.custom-fields.editor.placeholder-desc':
    'Optional placeholder text shown in empty field',
  'settings.customization.custom-fields.editor.placeholder-input':
    'Enter placeholder text',
  'settings.customization.custom-fields.editor.trade-log': 'Trade Log',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'Control how this field appears when added as a Trade Log column',
  'settings.customization.custom-fields.editor.column-label':
    'Trade Log Column Label',
  'settings.customization.custom-fields.editor.column-label-desc':
    'Optional shorter label used only in the Trade Log header',
  'settings.customization.custom-fields.editor.column-label-placeholder':
    'Use field label by default',
  'settings.customization.custom-fields.editor.display-as-currency':
    'Display as Currency',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Format this number field as a currency value only in the Trade Log',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'Dropdown Sort Mode',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'Disabled by default. Enable sorting only when this dropdown has a meaningful order.',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'Disabled',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'Alphabetical',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'Numeric',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'Configured option order',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'Collapsed Display',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'Choose how multiselect values render when Trade Log expanded mode is off',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'Count badge',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'Value list',
  'settings.customization.custom-fields.editor.validation': 'Validation',
  'settings.customization.custom-fields.editor.validation-desc':
    'Field validation rules',
  'settings.customization.custom-fields.editor.validation.required':
    'Required Field',
  'settings.customization.custom-fields.editor.validation.required-desc':
    'Make this field mandatory',
  'settings.customization.custom-fields.editor.validation.min-length':
    'Minimum Length',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    'Minimum number of characters',
  'settings.customization.custom-fields.editor.validation.no-min': 'No minimum',
  'settings.customization.custom-fields.editor.validation.max-length':
    'Maximum Length',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    'Maximum number of characters',
  'settings.customization.custom-fields.editor.validation.no-max': 'No maximum',
  'settings.customization.custom-fields.editor.validation.min-value':
    'Minimum Value',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    'Minimum allowed number',
  'settings.customization.custom-fields.editor.validation.max-value':
    'Maximum Value',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    'Maximum allowed number',
  'settings.customization.custom-fields.editor.options': 'Options',
  'settings.customization.custom-fields.editor.options-desc':
    'Available choices for this field',
  'settings.customization.custom-fields.editor.add-option': 'Add New Option',
  'settings.customization.custom-fields.editor.add-option-desc':
    'Enter a new choice',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    'Enter new option',
  'settings.customization.custom-fields.editor.allow-create':
    'Allow Creating New Options',
  'settings.customization.custom-fields.editor.allow-create-desc':
    'Users can create new options when using this field in trade forms',
  'settings.customization.custom-fields.editor.save': 'Save Field',
  'settings.customization.custom-fields.editor.delete': 'Delete Field',

  
  'settings.customization.custom-fields.type.text': 'Text',
  'settings.customization.custom-fields.type.number': 'Number',
  'settings.customization.custom-fields.type.date': 'Date',
  'settings.customization.custom-fields.type.datetime': 'Date & Time',
  'settings.customization.custom-fields.type.time': 'Time',

  
  'settings.customization.custom-fields.error.cannot-save':
    'Cannot save field: {error}',
  'settings.customization.custom-fields.error.duplicate-key':
    'A field with this frontmatter key already exists',
  'settings.customization.custom-fields.error.save-failed':
    'Failed to save field. Please try again.',
  'settings.customization.custom-fields.notice.import-summary':
    'Imported {validCount} valid fields out of {totalCount} total',

  
  'settings.customization.custom-fields.delete.confirm-message':
    'Are you sure you want to delete the custom field "{fieldLabel}"?',
  'settings.customization.custom-fields.delete.cannot-undo':
    'This action cannot be undone.',

  
  'settings.customization.custom-fields.reset.confirm-message':
    'Are you sure you want to delete ALL custom fields?',

  
  'settings.customization.custom-fields.saved-options.title':
    'Saved Custom Options',
  'settings.customization.custom-fields.saved-options.description':
    'Manage options that users have created for custom fields',
  'settings.customization.custom-fields.saved-options.delete-error':
    'Failed to delete option. Please try again.',
  'settings.customization.custom-fields.saved-options.clear-error':
    'Failed to clear options. Please try again.',

  
  'settings.customization.custom-fields.option.delete-confirm':
    'Are you sure you want to delete the option "{optionName}"?',
  'settings.customization.custom-fields.option.clear-confirm':
    'Are you sure you want to delete ALL saved options for "{fieldLabel}"?',

  
  
  
  'settings.customization.review-fields': 'Custom Review Fields',
  'settings.customization.review-fields.description':
    'Create custom fields for review notes. These fields are stored under reviewCustomFields and can later be inherited across monthly, weekly, and daily reviews.',
  'settings.customization.review-fields.title': 'Review Fields ({count})',
  'settings.customization.review-fields.manage-desc':
    'Manage custom fields for review notes',
  'settings.customization.review-fields.no-fields':
    'No custom review fields defined yet',
  'settings.customization.review-fields.no-fields-desc':
    'Review fields will be used by review-note widgets and will not appear in the trade form or Trade Log.',
  'settings.customization.review-fields.add-button': 'Add Review Field',
  'settings.customization.review-fields.delete-all-button':
    'Delete All Review Fields',
  'settings.customization.review-fields.add-new': 'Add New Review Field',
  'settings.customization.review-fields.edit-field-with-name':
    'Edit “{fieldLabel}”',
  'settings.customization.review-fields.configure-desc':
    'Configure your review field settings below',
  'settings.customization.review-fields.actions-desc':
    'Manage your custom review fields',
  'settings.customization.review-fields.default-label': 'New Review Field',
  'settings.customization.review-fields.unknown-field': 'Unknown Review Field',
  'settings.customization.review-fields.field-summary':
    'Type: {type} • Reviews: {reviews}',
  'settings.customization.review-fields.error.save-failed':
    'Failed to save review field. Please try again.',
  'settings.customization.review-fields.delete.confirm-message':
    'Are you sure you want to delete the custom review field "{fieldLabel}"?',
  'settings.customization.review-fields.reset.confirm-message':
    'Are you sure you want to delete ALL custom review fields?',
  'settings.customization.review-fields.editor.title':
    'Review Field Configuration',
  'settings.customization.review-fields.editor.label-desc':
    'Display name for this review field',
  'settings.customization.review-fields.editor.label-placeholder':
    'Enter review field label',
  'settings.customization.review-fields.editor.key': 'Review Field Key',
  'settings.customization.review-fields.editor.key-desc':
    'This key will be stored inside review note frontmatter at',
  'settings.customization.review-fields.editor.type-desc':
    'Type of review field input',
  'settings.customization.review-fields.editor.description': 'Description',
  'settings.customization.review-fields.editor.description-desc':
    'Optional help text for this review field',
  'settings.customization.review-fields.editor.description-placeholder':
    'Explain how this field should be used',
  'settings.customization.review-fields.editor.placeholder-desc':
    'Optional placeholder text shown when entering a local review value',
  'settings.customization.review-fields.editor.placeholder-input':
    'Enter review field placeholder',

  'settings.customization.review-fields.editor.group': 'Field Group',
  'settings.customization.review-fields.editor.group-desc':
    'Choose the review field group this field belongs to.',
  'settings.customization.review-fields.groups.add-button': 'Add Group',
  'settings.customization.review-fields.groups.default-name': 'New Group',
  'settings.customization.review-fields.groups.untitled': 'Untitled Group',
  'settings.customization.review-fields.groups.ungrouped': 'Ungrouped',
  'settings.customization.review-fields.groups.field-count': '{count} fields',
  'settings.customization.review-fields.groups.empty':
    'No fields in this group yet.',
  'settings.customization.review-fields.groups.rename-prompt': 'Group name',
  'settings.customization.review-fields.groups.delete-message':
    'Delete the review field group "{groupName}"?',
  'settings.customization.review-fields.groups.delete-note':
    'Fields in this group will become ungrouped. Their saved review values are not deleted.',
  'settings.customization.review-fields.groups.error.duplicate':
    'A review field group with this name already exists.',
  'settings.customization.review-fields.groups.error.save-failed':
    'Failed to save review field group.',
  'settings.customization.review-fields.editor.compact': 'Compact Display',
  'settings.customization.review-fields.editor.compact-desc':
    'Prefer compact rendering when this field appears in review widgets',
  'settings.customization.review-fields.editor.appears-on': 'Appears On',
  'settings.customization.review-fields.editor.appears-on-desc':
    'Review note types that can show this field',
  'settings.customization.review-fields.editor.editable-on': 'Editable On',
  'settings.customization.review-fields.editor.editable-on-desc':
    'Review note types where users can enter a local value',
  'settings.customization.review-fields.editor.inherit-to': 'Inherited Into',
  'settings.customization.review-fields.editor.inherit-to-desc':
    'Lower review note types that can display inherited values from this field',
  'settings.customization.review-fields.editor.inheritance':
    'Enable Inheritance',
  'settings.customization.review-fields.editor.inheritance-desc':
    'Allow this field to be read from higher-timeframe review notes',
  'settings.customization.review-fields.editor.inheritance-mode':
    'Inheritance Mode',
  'settings.customization.review-fields.editor.inheritance-mode-desc':
    'Controls whether child reviews show inherited values, local values, or both',
  'settings.customization.review-fields.editor.sources': 'Inheritance Sources',
  'settings.customization.review-fields.editor.sources-desc':
    'Higher-timeframe review types this field can inherit from',

  'settings.customization.review-fields.editor.options-desc':
    'Available choices for this review field',
  'settings.customization.review-fields.editor.allow-create-desc':
    'Users can create new options when using this field in review notes',
  'settings.customization.review-fields.editor.save': 'Save Review Field',
  'settings.customization.review-fields.editor.delete': 'Delete Review Field',
  'settings.customization.review-fields.inheritance-mode.inherit-only':
    'Inherited only',
  'settings.customization.review-fields.inheritance-mode.local-only':
    'Local only',
  'settings.customization.review-fields.inheritance-mode.inherit-and-local':
    'Inherited and local',

  
  
  
  'onboarding.welcome.title': 'Welcome to Journalit',
  'onboarding.welcome.subtitle': 'A trading journal that lives on your device.',
  'onboarding.welcome.cta': 'Set up my journal',
  'onboarding.welcome.chart.week': 'Week {count}',
  'onboarding.view.title': 'Journalit Onboarding',

  

  

  
  
  
  'onboarding.common.continue': 'Continue',
  'onboarding.common.close': 'Close',

  'onboarding.features.badge.pro': 'PRO',

  
  
  

  
  
  

  
  'onboarding.features.graphic.syncing': 'Syncing trades...',
  'onboarding.features.graphic.complete': 'Sync complete',
  'onboarding.features.graphic.direction.long': 'LONG',
  'onboarding.features.graphic.direction.short': 'SHORT',
  'onboarding.features.graphic.status.win': 'WIN',
  'onboarding.features.graphic.status.loss': 'LOSS',

  
  
  
  'onboarding.activation.title': 'Sign In to Journalit',

  'onboarding.activation.status.initializing':
    'Generating your authentication code...',

  'onboarding.activation.status.error': 'Sign-In Failed',
  'onboarding.activation.error.init':
    'Unable to start sign-in. Please check your internet connection and try again.',
  'onboarding.activation.error.denied':
    'Sign-in was denied. You can sign in later from settings.',
  'onboarding.activation.error.expired':
    'Authentication code expired. Please restart the sign-in process.',
  'onboarding.activation.error.generic':
    'Something went wrong. Please try again.',
  'onboarding.activation.error.save':
    'Sign-in succeeded but failed to save. Please restart the plugin and try again.',
  'onboarding.activation.error.connection':
    'Connection lost. Please check your internet and try again.',
  'onboarding.activation.notice.invalid-url':
    'Invalid activation URL. Please contact support.',

  'onboarding.activation.notice.popup-blocked-manual':
    'Please open this URL in your browser: {url}',
  'onboarding.activation.notice.copy-code-failed':
    'Failed to copy code. Please copy manually.',
  'onboarding.activation.label.code': 'Your authentication code',
  'onboarding.activation.button.copy': 'Copy code',
  'onboarding.activation.button.copy-link': 'Copy link',
  'onboarding.activation.button.copied': 'Copied!',
  'onboarding.activation.step.open-browser': 'Click below to open your browser',
  'onboarding.activation.step.enter-code': 'Enter your authentication code',
  'onboarding.activation.step.complete-signin': 'Complete sign-in',
  'onboarding.activation.step.return-here':
    'Return here for automatic completion',
  'onboarding.activation.button.open-browser': 'Open Browser to Sign In',
  'onboarding.activation.waiting.title': 'Waiting for sign-in...',
  'onboarding.activation.waiting.hint': 'This usually takes less than a minute',
  'onboarding.activation.success.title': 'Sign In Complete!',

  'onboarding.notice.complete-failed':
    'Failed to save onboarding completion. Please try again later.',
  'onboarding.notice.completed': 'Your journal is set up. Onboarding complete.',
  'onboarding.familiarity.kicker': 'Quick question',
  'onboarding.familiarity.title': 'Have you used Obsidian before?',
  'onboarding.familiarity.subtitle':
    "Journalit runs inside Obsidian. If it's new to you, we'll show only what you need.",
  'onboarding.familiarity.option.yes.label': 'Yes, I know my way around',
  'onboarding.familiarity.option.yes.description': 'Skip the orientation.',
  'onboarding.familiarity.option.no.label': "No, I'm new to Obsidian",
  'onboarding.familiarity.option.no.description': 'One short screen, no tour.',
  'onboarding.orientation.kicker': 'New to Obsidian',
  'onboarding.orientation.title': 'Four things to know',
  'onboarding.orientation.subtitle': "That's all you need to use Journalit.",
  'onboarding.orientation.inside.title': 'Journalit runs inside Obsidian',
  'onboarding.orientation.inside.body':
    'No need to learn Obsidian first. This screen is a Journalit view.',
  'onboarding.orientation.sidebar.title': 'The sidebar is how you move around',
  'onboarding.orientation.sidebar.body':
    'Home, Dashboard, Trade Log and your reviews all live there.',
  'onboarding.orientation.sidebar.action': 'Show me the sidebar',
  'onboarding.orientation.sidebar.action-mobile': 'Open the sidebar',
  'onboarding.orientation.sidebar.hint':
    "That's it on the left. This screen stays open.",
  'onboarding.orientation.sidebar.hint-mobile':
    'It opens over this screen. Swipe or tap outside it to come back.',
  'onboarding.orientation.tabs.title': 'Views open as tabs',
  'onboarding.orientation.tabs.body':
    'Like this one. Switch between them at the top.',
  'onboarding.orientation.privacy.title': 'Your journal stays on your device',
  'onboarding.orientation.privacy.body':
    "Notes, screenshots and reviews are your own files. Only trades you import or sync pass through Journalit's servers.",
  'onboarding.orientation.continue': 'Got it',
  'onboarding.data-source.kicker': 'Your trades',
  'onboarding.data-source.title': 'Where are your trades right now?',
  'onboarding.data-source.subtitle':
    'Your history is part of your edge. Bring it with you and your stats mean something from day one, instead of waiting months for new trades to build up.',
  'onboarding.data-source.option.broker.label': 'On my broker or platform',
  'onboarding.data-source.option.broker.description':
    'Connect it, or import what it exports.',
  'onboarding.data-source.option.file.label': 'In a spreadsheet or file',
  'onboarding.data-source.option.file.description':
    'CSV, Excel or HTML exports.',
  'onboarding.data-source.option.fresh.label':
    "Nowhere yet, I'm starting fresh",
  'onboarding.data-source.option.fresh.description':
    'Add trades as you take them.',
  'onboarding.data-source.option.sample.label':
    'Nowhere yet, let me explore a sample',
  'onboarding.data-source.option.sample.description':
    'Look around a ready-made journal before adding your own trades.',
  'onboarding.broker.kicker': 'Your broker',
  'onboarding.broker.title': 'Which broker or platform?',
  'onboarding.awaiting.sign-in.action': 'Sign in to continue',
  'onboarding.awaiting.sign-in.body':
    'Sign in or create a free Journalit account first. Your trades then land in your journal.',
  'onboarding.broker.badge.sync': 'Auto-sync',
  'onboarding.broker.search': 'Search brokers and platforms',
  'onboarding.broker.subtitle':
    "We'll pick the best way to bring your trades in.",
  'onboarding.broker.option.unlisted.label': "It's not listed",
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title': 'Not listed yet? Tell us which broker',
  'onboarding.broker.request.body':
    'New brokers are added on request. Tell us which one (an export sample helps); until then a file export can be mapped by hand.',
  'onboarding.broker.request.discord': 'Request it on Discord',
  'onboarding.broker.request.continue': 'Continue with manual import',
  'onboarding.broker.loading': 'Checking supported brokers...',
  'onboarding.broker.offline':
    "Couldn't load the full list. You can still connect a supported broker or import a file.",
  'onboarding.personalise.kicker': 'Set up your journal',
  'onboarding.personalise.title': 'A few quick choices',
  'onboarding.personalise.subtitle':
    'We personalise Journalit based on your answers.',
  'onboarding.personalise.style.question': 'How do you trade?',
  'onboarding.personalise.style.scalping': 'Many trades a day',
  'onboarding.personalise.style.intraday':
    'A few trades a day, nothing overnight',
  'onboarding.personalise.style.swing': 'Held for days or weeks',
  'onboarding.personalise.style.position': 'Held for weeks or months',
  'onboarding.personalise.account.question': 'What kind of account?',
  'onboarding.personalise.account.personal': 'Personal',
  'onboarding.personalise.account.practice': 'Demo or practice',
  'onboarding.personalise.account.prop': 'Prop-firm challenge or funded',
  'onboarding.personalise.asset.question': 'What do you mainly trade?',
  'onboarding.personalise.asset.stock': 'Stocks',
  'onboarding.personalise.asset.futures': 'Futures',
  'onboarding.personalise.asset.forex': 'Forex',
  'onboarding.personalise.asset.crypto': 'Crypto',
  'onboarding.personalise.asset.options': 'Options',
  'onboarding.personalise.asset.mixed': 'A mix',
  'onboarding.first-trade.kicker': 'Almost there',
  'onboarding.first-trade.title': 'Add your first trade',
  'onboarding.first-trade.subtitle':
    'Your journal is ready. Log a trade and Journalit starts working from it.',
  'onboarding.first-trade.cta': 'Add my first trade',
  'onboarding.first-trade.sample': 'Explore with sample data',
  'onboarding.preparing-sample.title': 'Getting your sample journal ready',
  'onboarding.preparing-sample.body':
    'This only takes a few seconds. Obsidian may feel a little slow while the notes are being written.',
  'onboarding.preparing-sample.starting': 'Starting…',
  'onboarding.preparing-sample.hint':
    'You can remove the sample journal at any time from its badge in the corner.',
  'onboarding.preparing-sample.failed.title':
    'The sample journal could not be built',
  'onboarding.preparing-sample.failed.body':
    'You can try again, or pick another way to start.',
  'onboarding.preparing-sample.retry': 'Try again',
  'onboarding.sample-exploring.kicker': 'Sample journal',
  'onboarding.sample-exploring.title': "You're exploring the sample journal",
  'onboarding.sample-exploring.body':
    "Take your time. When you exit the sample, we'll pick up here: personalise your own journal and add your first trade.",
  'onboarding.sample-exploring.exit': 'Exit the sample and continue',
  'onboarding.sample-exploring.failed.title':
    'The sample journal could not be restored',
  'onboarding.sample-exploring.failed.body':
    'Exit the sample to remove what is left of it, then continue setting up your own journal.',
  'onboarding.awaiting.kicker': 'Waiting for your first trades',
  'onboarding.awaiting.first-sync.title': 'Finish connecting your broker',
  'onboarding.awaiting.first-sync.body':
    'Complete the connection in Settings > Trade Sync. Once your first trades sync, this setup closes on its own.',
  'onboarding.awaiting.first-sync.action': 'Open Trade Sync',
  'onboarding.awaiting.first-import.title': 'Import your file',
  'onboarding.awaiting.first-import.body':
    'Finish the import in the Trade Import tab. Once your first trades are in, this setup closes on its own.',
  'onboarding.awaiting.first-import.action': 'Open Trade Import',
  'onboarding.awaiting.first-trade.title': 'Save your first trade',
  'onboarding.awaiting.first-trade.body':
    'Once your first trade is saved, this setup closes on its own.',
  'onboarding.awaiting.first-trade.action': 'Add a trade',
  'onboarding.awaiting.change-route': 'Choose a different way',
  'onboarding.notice.personalise-failed':
    "Couldn't apply your setup choices. You can adjust them later in Settings.",
  'onboarding.notice.trade-sync-open-failed':
    'Unable to open Trade Sync. Please try again.',
  'onboarding.notice.skip-failed':
    'Failed to save onboarding skip. Please try again later.',

  
  
  

  
  
  
  
  'widget.goals.title.daily': 'Daily Goals',
  'widget.goals.title.weekly': 'Weekly Goals',
  'widget.goals.title.monthly': 'Monthly Goals',
  'widget.goals.title.quarterly': 'Quarterly Goals',
  'widget.goals.title.yearly': 'Yearly Goals',
  'widget.goals.title.default': 'Goals',
  'widget.goals.tooltip.daily':
    'Items added here only apply to this day. For recurring items on all new DRCs, go to Settings > Reviews.',
  'widget.goals.tooltip.weekly':
    'Items added here only apply to this week. For recurring items on all new weekly reviews, go to Settings > Reviews.',
  'widget.goals.tooltip.monthly':
    'Items added here only apply to this month. For recurring items on all new monthly reviews, go to Settings > Reviews.',
  'widget.goals.tooltip.quarterly':
    'Items added here only apply to this quarter. For recurring items on all new quarterly reviews, go to Settings > Reviews.',
  'widget.goals.tooltip.yearly':
    'Items added here only apply to this year. For recurring items on all new yearly reviews, go to Settings > Reviews.',
  'widget.goals.completed': '{completed}/{total} completed',
  'widget.goals.placeholder': 'Add a new goal...',
  'widget.goals.empty.preview': 'No goals configured',
  'widget.goals.empty.default': 'No goals set. Add one below.',
  'widget.goals.invalid-context':
    'Goals widget requires a review note (DRC, Weekly, Monthly, Quarterly, or Yearly)',
  'widget.goals.aria.edit': 'Edit goal',
  'widget.goals.aria.delete': 'Delete goal',

  
  'widget.header.name': 'Header',

  'widget.header.invalid-context':
    "Invalid frontmatter: requires 'type' (drc/weekly-review/monthly-review/quarterly-review/trade) and date field ('date' for reviews, 'entryTime' for trades)",
  'widget.header.aria.mark-reviewed': 'Click to mark as reviewed',
  'widget.header.aria.mark-not-reviewed': 'Click to mark as not reviewed',
  'widget.header.unknown-instrument': 'Unknown',
  'widget.header.week': 'Week {number}',
  'widget.header.quarter': 'Q{number}',
  'widget.header.drc': 'DRC',
  'widget.header.nav.prev': '← Prev',
  'widget.header.nav.next': 'Next →',
  
  'widget.header.day.0': 'Sunday',
  'widget.header.day.1': 'Monday',
  'widget.header.day.2': 'Tuesday',
  'widget.header.day.3': 'Wednesday',
  'widget.header.day.4': 'Thursday',
  'widget.header.day.5': 'Friday',
  'widget.header.day.6': 'Saturday',
  
  'widget.header.month.0': 'January',
  'widget.header.month.1': 'February',
  'widget.header.month.2': 'March',
  'widget.header.month.3': 'April',
  'widget.header.month.4': 'May',
  'widget.header.month.5': 'June',
  'widget.header.month.6': 'July',
  'widget.header.month.7': 'August',
  'widget.header.month.8': 'September',
  'widget.header.month.9': 'October',
  'widget.header.month.10': 'November',
  'widget.header.month.11': 'December',
  
  'widget.header.month-short.0': 'Jan',
  'widget.header.month-short.1': 'Feb',
  'widget.header.month-short.2': 'Mar',
  'widget.header.month-short.3': 'Apr',
  'widget.header.month-short.4': 'May',
  'widget.header.month-short.5': 'Jun',
  'widget.header.month-short.6': 'Jul',
  'widget.header.month-short.7': 'Aug',
  'widget.header.month-short.8': 'Sep',
  'widget.header.month-short.9': 'Oct',
  'widget.header.month-short.10': 'Nov',
  'widget.header.month-short.11': 'Dec',

  
  'widget.picker.placeholder': 'Select a widget...',
  'widget.picker.search-placeholder': 'Search widgets...',
  'widget.picker.search-label': 'Search widgets',
  'widget.picker.clear-search': 'Clear widget search',
  'widget.picker.results-label': 'Available widgets',
  'widget.picker.no-results': 'No widgets match your search',

  
  'widget.category.charts': 'Charts',
  'widget.category.statistics': 'Statistics',
  'widget.category.content': 'Content',
  'widget.category.tables': 'Tables',
  'widget.category.layout': 'Layout',

  
  'widget.goals.name': 'Goals',
  'widget.goals.description': 'Daily goals with completion checkboxes',
  'widget.review.name': 'Review',
  'widget.review.description': 'Mental and technical performance grades',
  'widget.review-context-fields.name': 'Review Context Fields',
  'widget.review-context-fields.description':
    'Editable custom context fields for review notes',
  'widget.review-context-fields.group.default': 'Review Context',

  'widget.review-context-fields.empty-title':
    'No review context fields configured for this review type.',
  'widget.review-context-fields.empty-desc':
    'Create review custom fields in settings to capture bias, focus, intent, and other planning context.',
  'widget.review-context-fields.configure': 'Configure Review Fields',
  'widget.review-context-fields.service-unavailable':
    'Review custom fields are not available yet.',
  'widget.review-context-fields.unsupported-type':
    'Unsupported review field type.',
  'widget.review-context-fields.source-missing':
    'This parent review does not exist yet.',
  'widget.review-context-fields.source-invalid':
    'This parent review exists but is not a valid review note.',
  'widget.review-context-fields.source-empty':
    'No inherited values are filled in this parent review yet.',

  'widget.review.title': 'Performance Review',
  'widget.review.mental-game': 'Mental Game',
  'widget.review.technical-game': 'Technical Game',
  'widget.review.star-hint': 'Click for full star, right-click for half star',
  'widget.review.invalid-context':
    "Review widget requires a DRC or Weekly Review note (frontmatter type: 'drc' or 'weekly-review')",
  'widget.checklist.name': 'Checklist',
  'widget.checklist.description': 'Pre-session preparation checklist',
  'widget.session-mistakes.name': 'Session Mistakes',
  'widget.session-mistakes.description':
    'Track end-of-session behavioral mistakes for the day',
  'widget.key-levels.name': 'Key Levels',
  'widget.key-levels.description': 'Important price levels to watch',
  'widget.key-events.name': 'Key Events',
  'widget.key-events.description': 'Important events during the period',
  'widget.key-events.title': 'Key Events',
  'widget.key-events.tooltip':
    'Key events are saved to your Weekly Review and can be added or edited here in the DRC.',
  'widget.key-events.placeholder': 'Select or create event',
  'widget.key-events.color-label': 'Color:',
  'widget.key-events.color-aria': 'Select {color} color',
  'widget.key-events.day-label': 'Day:',
  'widget.key-events.currency-label': 'Currency:',
  'widget.key-events.time-label': 'Time:',
  'widget.key-events.field-unset': 'Not set',
  'widget.key-events.notes-placeholder': 'Notes about this event (optional)',
  'widget.key-events.notes-label': 'Notes',
  'widget.key-events.default-notes-tooltip':
    'Default notes are managed in Settings → Customisation → Events. Selecting an event here will auto-fill its saved default notes.',
  'widget.key-events.add-button': 'Add Event',
  'widget.key-events.empty-state': 'No key events for today',
  'widget.key-events.empty-state-sub': 'Add events in your Weekly Review',
  'widget.key-events.open-calendar-aria': 'Open Economic Calendar',
  'widget.key-events.restore-auto-import': 'Restore auto-imported events',
  'widget.key-events.restore-missing-events':
    'Restore missing events ({count})',
  'widget.missed-trades.name': 'Missed Trades',
  'widget.missed-trades.description': 'Trades you identified but did not take',
  'widget.images.name': 'Charts & Media',
  'widget.images.description': 'Media carousel with upload support',
  'widget.images.invalid-context':
    "Media widget requires a review note (type: 'drc', 'weekly-review', 'monthly-review', 'quarterly-review', or 'yearly-review')",
  'widget.images.alt-prefix': 'Review media',
  'widget.images.stacked-alt': 'Review media {index}',
  'widget.images.open-fullscreen': 'Open media {index} fullscreen',
  'widget.images.delete': 'Delete media',
  'widget.images.empty': 'No media',
  'widget.images.placeholder': 'Paste media URL or file path...',
  'widget.images.placeholder-add-more': 'Add more media...',
  'widget.mark-reviewed.name': 'Mark as Reviewed',
  'widget.mark-reviewed.description':
    'Banner to mark review as complete with timestamp',
  'widget.mark-reviewed.status.reviewed': 'REVIEWED',
  'widget.mark-reviewed.status.pending': 'PENDING REVIEW',
  'widget.mark-reviewed.button.undo': 'Undo',
  'widget.mark-reviewed.button.mark': 'Mark as Reviewed',

  
  'widget.pnl-chart.name': 'Equity Curve',
  'widget.pnl-chart.description': 'Cumulative profit/loss over time',
  'widget.drawdown-chart.name': 'Drawdown',
  'widget.drawdown-chart.description':
    'Closed-trade drawdown amount from the prior realized P&L high',
  'widget.directional-pnl.name': 'Directional P&L',
  'widget.directional-pnl.description': 'Long vs short performance comparison',
  'widget.directional-drawdown.name': 'Directional Realized Drawdown',
  'widget.directional-drawdown.description':
    'Separate long and short closed-trade drawdown amount curves',
  'widget.long-drawdown.name': 'Long Drawdown',
  'widget.long-drawdown.description':
    'Closed-trade drawdown amount curve for long trades only',
  'widget.short-drawdown.name': 'Short Drawdown',
  'widget.short-drawdown.description':
    'Closed-trade drawdown amount curve for short trades only',
  'widget.trades-chart.name': 'Trade P&L',
  'widget.trades-chart.description': 'P&L bar for each individual trade',
  'widget.trades-chart-daily.name': 'Daily P&L',
  'widget.trades-chart-daily.description': 'P&L aggregated by day',
  'widget.trades-chart-weekly.name': 'Weekly P&L',
  'widget.trades-chart-weekly.description': 'P&L aggregated by week',
  'widget.trades-chart-monthly.name': 'Monthly P&L',
  'widget.trades-chart-monthly.description': 'P&L aggregated by month',
  'widget.trades-chart-quarterly.name': 'Quarterly P&L',
  'widget.trades-chart-quarterly.description': 'P&L aggregated by quarter',

  
  'widget.stats.name': 'Stats Grid',
  'widget.stats.description': 'Key performance metrics in grid format',
  'widget.stats.no-trades': 'No closed trades for this period',
  'widget.stats.vs-prev': 'vs prev',
  'dashboard.metrics.past-30d': 'past 30d',

  'widget.stats.net-pnl': 'Net P&L',
  'widget.stats.win-rate': 'Win Rate',
  'widget.stats.profit-factor': 'Profit Factor',
  'widget.stats.expectancy': 'Expectancy',
  'widget.stats.total-trades': 'Total Trades',
  'widget.stats.avg-win': 'Avg Win',
  'widget.stats.avg-loss': 'Avg Loss',
  'widget.stats.pl-ratio': 'P/L Ratio',
  'widget.account-breakdown.name': 'Account Breakdown',
  'widget.account-breakdown.description':
    'Compare performance across accounts in this review period',
  'widget.account-breakdown.empty': 'No closed trades for this period',
  'widget.account-breakdown.column.account': 'Account',
  'widget.account-breakdown.column.trades': 'Trades',
  'widget.account-breakdown.column.pnl': 'Net P&L',
  'widget.account-breakdown.column.win-rate': 'Win Rate',
  'widget.account-breakdown.column.profit-factor': 'Profit Factor',
  'widget.tag-performance.name': 'Tag Performance',
  'widget.tag-performance.description': 'Performance breakdown by trade tag',
  'widget.setup-performance.name': 'Setup Performance',
  'widget.setup-performance.description':
    'Performance breakdown by trading setup',
  'widget.best-worst-trades.name': 'Best/Worst Trades',
  'widget.best-worst-trades.description': 'Top winning and losing trades',
  'widget.best-worst.best-trade': 'Best Trade',
  'widget.best-worst.worst-trade': 'Worst Trade',
  'widget.best-worst.no-win-trades': 'No winning trades',
  'widget.best-worst.no-loss-trades': 'No losing trades',
  'widget.best-worst.best-month': 'Best Month',
  'widget.best-worst.worst-month': 'Worst Month',
  'widget.best-worst.no-profitable-months': 'No profitable months',
  'widget.best-worst.no-losing-months': 'No losing months',
  'widget.best-worst.n-trades': '{count} trades',
  'widget.best-worst.win-rate': '{rate}% win rate',
  'widget.best-worst-days.name': 'Best/Worst Days',
  'widget.best-worst-days.description': 'Highest and lowest P&L days',
  'widget.best-worst-days.best-day': 'Best Day',
  'widget.best-worst-days.worst-day': 'Worst Day',
  'widget.best-worst-days.no-profitable-days': 'No profitable days',
  'widget.best-worst-days.no-losing-days': 'No losing days',
  'widget.best-worst-days.trade-count.one': '{count} trade',
  'widget.best-worst-days.trade-count.few': '{count} trades',
  'widget.best-worst-days.trade-count.many': '{count} trades',
  'widget.best-worst-days.trade-count.other': '{count} trades',
  'widget.best-worst-days.win-rate': '{rate}% win rate',
  'widget.best-worst-days.invalid-context':
    'This widget is only available in Weekly and Monthly reviews',

  
  'widget.position-size.title': 'Position Size',
  'widget.position-size.save-defaults': 'Save as default',
  'widget.position-size.reset-defaults': 'Reset to defaults',
  'widget.position-size.stock-crypto': 'Stock/Crypto',
  'widget.position-size.futures': 'Futures',
  'widget.position-size.forex': 'Forex',
  'widget.position-size.account-balance': 'Account Balance',
  'widget.position-size.risk-percent': 'Risk %',
  'widget.position-size.entry-price': 'Entry Price',
  'widget.position-size.profit-target-optional': 'Profit Target (optional)',
  'widget.position-size.currency-pair': 'Currency Pair',
  'widget.position-size.stop-loss-pips': 'Stop Loss (pips)',
  'widget.position-size.target-pips-optional': 'Target (pips, optional)',
  'widget.position-size.placeholder.example': 'e.g., {value}',
  'widget.position-size.enter-values': 'enter values',
  'widget.position-size.risk': 'Risk',
  'widget.position-size.reward': 'Reward',
  'widget.position-size.stop': 'stop',
  'widget.position-size.pts': 'pts',
  'widget.position-size.mini': 'mini',
  'widget.position-size.pip-value-info':
    'Pip value: ${value} (standard lot) | Pip size: {size}',
  'widget.position-size.futures-info': '${dollar}/pt | Tick: {size} = ${value}',
  'widget.position-size.investment-dollar': 'Investment ($)',
  'widget.position-size.investment': 'Investment',
  'widget.position-size.at-price': '@ ${price}',
  'widget.best-worst-weeks.name': 'Best/Worst Weeks',
  'widget.best-worst-weeks.description': 'Highest and lowest P&L weeks',
  'widget.best-worst-weeks.best-week': 'Best Week',
  'widget.best-worst-weeks.worst-week': 'Worst Week',
  'widget.best-worst-weeks.no-profitable': 'No profitable weeks',
  'widget.best-worst-weeks.no-losing': 'No losing weeks',
  'widget.best-worst-weeks.week-name': 'Week {number} ({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} trades',
  'widget.best-worst-weeks.win-rate': '{percent}% win rate',
  'widget.best-worst-weeks.invalid-context':
    'This widget is only available in Weekly, Monthly, Quarterly, and Yearly reviews',
  'widget.best-worst-months.name': 'Best/Worst Months',
  'widget.best-worst-months.description': 'Highest and lowest P&L months',
  'widget.best-worst-months.invalid-context':
    'This widget is only available in Quarterly and Yearly reviews',
  'widget.best-worst-quarters.name': 'Best/Worst Quarters',
  'widget.best-worst-quarters.description': 'Highest and lowest P&L quarters',
  'widget.best-worst-quarters.best-quarter': 'Best Quarter',
  'widget.best-worst-quarters.worst-quarter': 'Worst Quarter',
  'widget.best-worst-quarters.no-profitable': 'No profitable quarters',
  'widget.best-worst-quarters.no-losing': 'No losing quarters',
  'widget.best-worst-quarters.trade-count': '{count} trades',
  'widget.best-worst-quarters.win-rate': '{percent}% win rate',
  'widget.best-worst-quarters.invalid-context':
    'This widget is only available in Yearly reviews',
  'widget.technical-game.name': 'Technical Game',
  'widget.technical-game.description':
    'Weekly technical grade distribution from DRCs',
  'widget.mental-game.name': 'Mental Game',
  'widget.mental-game.description':
    'Weekly mental grade distribution from DRCs',
  'widget.demon-tracker.name': 'Demon Tracker',
  'widget.demon-tracker.description': 'Track recurring trading mistakes',

  
  'widget.trading-score.title': 'Trading Score',
  'widget.trading-score.no-data': 'No trade data',
  'widget.trading-score.breakdown-title': 'Score Breakdown',
  'widget.trading-score.close-breakdown': 'Close breakdown',
  'widget.trading-score.of-weeks': 'of {count}',
  'widget.trading-score.start-trading': 'Start trading to unlock your score',
  'widget.trading-score.one-week-down': '1 week down, keep going!',
  'widget.trading-score.weeks-to-unlock.one': '{count} more week to unlock',
  'widget.trading-score.weeks-to-unlock.few': '{count} more weeks to unlock',
  'widget.trading-score.weeks-to-unlock.many': '{count} more weeks to unlock',
  'widget.trading-score.weeks-to-unlock.other': '{count} more weeks to unlock',
  'widget.trading-score.trades-to-unlock.one': '{count} more trade to unlock',
  'widget.trading-score.trades-to-unlock.few': '{count} more trades to unlock',
  'widget.trading-score.trades-to-unlock.many': '{count} more trades to unlock',
  'widget.trading-score.trades-to-unlock.other':
    '{count} more trades to unlock',
  'widget.trading-score.collect-more-data':
    'Collect a bit more data to unlock your score',
  'widget.trading-score.trades-logged.one': '{count} trade logged',
  'widget.trading-score.trades-logged.few': '{count} trades logged',
  'widget.trading-score.trades-logged.many': '{count} trades logged',
  'widget.trading-score.trades-logged.other': '{count} trades logged',
  'widget.trading-score.trades-count': '{count} trades',
  'widget.trading-score.weight': 'Weight: {weight}%',
  'widget.trading-score.weeks-suffix': '· {weeks}w',
  'widget.trading-score.axis-aria': '{axis}: {score} points, {weight}% weight',
  
  'widget.trading-score.phase.insufficient': 'Insufficient Data',
  'widget.trading-score.phase.developing': 'Developing',
  'widget.trading-score.phase.established': 'Established',
  
  'widget.trading-score.axis.profitability': 'Profitability',
  'widget.trading-score.axis.riskManagement': 'Risk Management',
  'widget.trading-score.axis.execution': 'Execution',
  'widget.trading-score.axis.consistency': 'Consistency',
  'widget.trading-score.axis.returnConsistency': 'Return Consistency',
  'widget.trading-score.axis.experience': 'Experience',
  
  'widget.trading-score.axis.profitability.desc':
    'Measures profit factor and expectancy per trade',
  'widget.trading-score.axis.riskManagement.desc':
    'Measures max drawdown control and recovery ability',
  'widget.trading-score.axis.execution.desc':
    'Measures win rate and average win/loss ratio',
  'widget.trading-score.axis.consistency.desc':
    'Measures return stability and streak control',
  'widget.trading-score.axis.returnConsistency.desc':
    'Measures uniformity of take-profits and stop-losses',
  'widget.trading-score.axis.experience.desc':
    'Measures active trading weeks and consistency',

  
  'widget.trades.name': 'Trades',
  'widget.trades.description': 'List of trades with key details',
  'widget.trade-review.name': 'Trade Review',
  'widget.trade-review.description':
    'Review each trade with images, key facts, and configurable questions',
  'widget.trade-review.question.win-what-worked': 'What worked?',
  'widget.trade-review.placeholder.win-what-worked':
    'What did you execute well in this trade?',
  'widget.trade-review.question.win-repeatable': 'Was this repeatable?',
  'widget.trade-review.placeholder.win-repeatable':
    'What made this trade repeatable?',
  'widget.trade-review.question.key-lesson': 'Key lesson',
  'widget.trade-review.placeholder.key-lesson':
    'What should you remember from this trade?',
  'widget.trade-review.question.loss-what-went-wrong': 'What went wrong?',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    'What caused this loss?',
  'widget.trade-review.question.loss-valid-or-mistake':
    'Was this a valid loss or an execution mistake?',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    'Describe whether this was process-valid or avoidable.',
  'widget.trade-review.question.loss-avoid-next-time':
    'What will I avoid next time?',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    'What specific behavior should change?',
  'widget.trade-review.question.be-managed-correctly':
    'Was this managed correctly?',
  'widget.trade-review.placeholder.be-managed-correctly':
    'Did the management match your plan?',
  'widget.trade-review.status.reviewed': 'Reviewed',
  'widget.trade-review.status.pending': 'Pending review',
  'widget.trade-review.image-alt-prefix': 'Trade review image',
  'widget.trade-review.no-image': 'No trade image',
  'widget.trade-review.placeholder.default': 'Write your thoughts...',

  'widget.trade-review.open-trade-note': 'Open trade note',

  'widget.trade-review.field.entry': 'Entry',
  'widget.trade-review.field.exit': 'Exit',
  'widget.trade-review.field.duration': 'Duration',
  'widget.trade-review.field.risk': 'Risk',
  'widget.trade-review.field.account': 'Account',
  'widget.trade-review.field.setup': 'Setup',
  'widget.trade-review.field.mistakes': 'Mistakes',
  'widget.trade-review.field.tags': 'Tags',
  'widget.trade-review.more-context': 'More context',
  'widget.trade-review.field.position-size': 'Size',
  'widget.trade-review.field.stop-loss': 'Stop loss',
  'widget.trade-review.field.take-profit': 'Take profit',
  'widget.trade-review.field.fees': 'Fees',
  'widget.trade-review.field.commission': 'Commission',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': 'Thesis',
  'widget.trade-review.field.notes': 'Notes',
  'widget.trade-review.field.custom-fields': 'Custom fields',
  'widget.trade-review.loading': 'Loading trade reviews...',
  'widget.trade-review.no-trades': 'No trades to review.',
  'widget.trade-review.time.open': 'Open',
  'widget.trade-review.fallback-title': 'Trade {index}',
  'widget.backtest-trades.name': 'Backtest Trades',
  'widget.backtest-trades.description':
    'List of backtest trades for this review period',
  'widget.breakdown-daily.name': 'Daily Summary',
  'widget.breakdown-daily.description': 'Performance table grouped by day',
  'widget.breakdown-weekly.name': 'Weekly Summary',
  'widget.breakdown-weekly.description': 'Performance table grouped by week',
  'widget.breakdown-monthly.name': 'Monthly Summary',
  'widget.breakdown-monthly.description': 'Performance table grouped by month',
  'widget.breakdown-quarterly.name': 'Quarterly Summary',
  'widget.breakdown-quarterly.description':
    'Performance table grouped by quarter',
  'widget.breakdown.empty.days-week': 'No trading days this week',
  'widget.breakdown.empty.weeks-month': 'No trading weeks this month',
  'widget.breakdown.empty.months-quarter': 'No trading months this quarter',
  'widget.breakdown.empty.quarters-year': 'No trading quarters this year',

  
  'widget.table.header.date': 'Date',
  'widget.table.header.week': 'Week',
  'widget.table.header.month': 'Month',
  'widget.table.header.quarter': 'Quarter',

  'widget.table.header.trades': 'Trades',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Win%',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.tag': 'Tag',
  'widget.table.header.setup': 'Setup',
  'widget.table.header.a-games': 'A Games',
  'widget.table.header.b-games': 'B Games',
  'widget.table.header.c-games': 'C Games',
  'widget.table.header.rating': 'Rating',
  'widget.table.header.avg-rating': 'Avg Rating',

  
  'widget.demon-tracker.column.demon': 'DEMON',
  'widget.demon-tracker.column.occurrences': 'OCCURRENCES',
  'widget.demon-tracker.column.stop-trading': 'STOP TRADING',
  'widget.demon-tracker.period.this-week': 'this week',
  'widget.demon-tracker.period.this-month': 'this month',
  'widget.demon-tracker.period.this-quarter': 'this quarter',
  'widget.demon-tracker.period.this-year': 'this year',
  'widget.demon-tracker.empty.title': 'No mistakes tracked {period}',
  'widget.demon-tracker.empty.description':
    'Mistakes logged in your trades will appear here to help identify patterns',
  'widget.demon-tracker.summary.unique': 'Unique Mistakes:',
  'widget.demon-tracker.summary.total': 'Total Occurrences:',
  'widget.demon-tracker.summary.critical': 'Critical ({threshold}+):',

  
  'widget.markdown-zone.name': 'Markdown Zone',
  'widget.markdown-zone.description': 'Free-form markdown content area',
  'widget.markdown-header.name': 'Section Header',
  'widget.markdown-header.description':
    'Markdown heading (H1-H6) with custom text',

  
  
  
  'metric.netPnL.name': 'Net P&L',
  'metric.netPnL.description': 'Total profit and loss across all trades',
  'metric.winRate.name': 'Win Rate',
  'metric.winRate.description': 'Percentage of winning trades',
  'metric.profitFactor.name': 'Profit Factor',
  'metric.profitFactor.description': 'Ratio of gross profit to gross loss',
  'metric.sharpeRatio.name': 'Sharpe Ratio',
  'metric.sharpeRatio.description':
    'Trade-level Sharpe ratio: average closed-trade net P&L divided by sample P&L volatility',
  'metric.expectancy.name': 'Expectancy',
  'metric.expectancy.description': 'Average amount won or lost per trade',
  'metric.maxDrawdown.name': 'Max Drawdown',
  'metric.maxDrawdown.description':
    'Largest closed-trade drawdown amount from a prior realized P&L high',
  'metric.bestDay.name': 'Best Day',
  'metric.bestDay.description': 'Highest single day P&L',
  'metric.largestWin.name': 'Largest Win',
  'metric.largestWin.description': 'Largest winning trade',
  'metric.largestLoss.name': 'Largest Loss',
  'metric.largestLoss.description': 'Largest losing trade',
  'metric.longestWinStreak.name': 'Best Streak',
  'metric.longestWinStreak.description':
    'Longest consecutive winning streak by exit date',
  'metric.longestLossStreak.name': 'Worst Streak',
  'metric.longestLossStreak.description':
    'Longest consecutive losing streak by exit date',
  'metric.numTrades.name': 'Total Trades',
  'metric.numTrades.description': 'Total number of closed trades',
  'metric.numWinTrades.name': 'Winning Trades',
  'metric.numWinTrades.description': 'Number of winning trades',
  'metric.numLossTrades.name': 'Losing Trades',
  'metric.numLossTrades.description': 'Number of losing trades',
  'metric.avgWin.name': 'Avg Win',
  'metric.avgWin.description': 'Average profit of winning trades',
  'metric.avgLoss.name': 'Avg Loss',
  'metric.avgLoss.description': 'Average loss of losing trades',
  'metric.avgRR.name': 'Avg RR (Payoff)',
  'metric.avgRR.description':
    'Currency-based payoff ratio: average win / average loss',
  'metric.avgRRRiskBased.name': 'Avg RR (R-Based)',
  'metric.avgRRRiskBased.description':
    'Risk-based ratio using R-multiples: average winning R / average losing R (requires stop/risk data)',
  'metric.avgHoldTime.name': 'Avg Hold Time',
  'metric.avgHoldTime.description': 'Average time in all closed trades',
  'metric.avgWinHoldTime.name': 'Avg Win Hold Time',
  'metric.avgWinHoldTime.description': 'Average time in winning closed trades',
  'metric.avgLossHoldTime.name': 'Avg Loss Hold Time',
  'metric.avgLossHoldTime.description': 'Average time in losing closed trades',
  'metric.avgWinnerHeat.name': 'Avg Winner Heat',
  'metric.avgWinnerHeat.description':
    'Average MAE for winning closed trades, using the configured MAE/MFE display unit',
  'metric.winnerMaeP90.name': 'Winner MAE P90',
  'metric.winnerMaeP90.description':
    '90th percentile MAE threshold for winning closed trades, using the configured MAE/MFE display unit',
  'metric.winnerMaeMedian.name': 'Winner MAE Median',
  'metric.winnerMaeMedian.description':
    'Median MAE for winning closed trades, using the configured MAE/MFE display unit',
  'metric.avgLossHeat.name': 'Avg Loss Heat',
  'metric.avgLossHeat.description':
    'Average MAE for losing closed trades, using the configured MAE/MFE display unit',
  'metric.winnerAvgMfe.name': 'Winner Avg MFE',
  'metric.winnerAvgMfe.description':
    'Average MFE for winning closed trades, using the configured MAE/MFE display unit',
  'metric.loserAvgMfe.name': 'Loser Avg MFE',
  'metric.loserAvgMfe.description':
    'Average MFE for losing closed trades, using the configured MAE/MFE display unit',
  'metric.winnerMfeP90.name': 'Winner MFE P90',
  'metric.winnerMfeP90.description':
    '90th percentile MFE threshold for winning closed trades, using the configured MAE/MFE display unit',
  'metric.loserMfeP90.name': 'Loser MFE P90',
  'metric.loserMfeP90.description':
    '90th percentile MFE threshold for losing closed trades, using the configured MAE/MFE display unit',
  'metric.timeInDrawdown.name': 'Time in Drawdown',
  'metric.timeInDrawdown.description':
    'Percentage of elapsed time spent below the prior realized P&L high',
  'metric.avgRecoveryTime.name': 'Avg Recovery Time',
  'metric.avgRecoveryTime.description':
    'Average time it takes closed-trade realized drawdowns to recover to a new high',
  'metric.longestDrawdown.name': 'Longest Drawdown',
  'metric.longestDrawdown.description':
    'Longest elapsed time spent in a realized drawdown episode',
  'metric.drawdownEpisodes.name': 'Drawdown Episodes',
  'metric.drawdownEpisodes.description':
    'Number of realized drawdown periods in the current filtered trade set',
  'metric.category.performance': 'Performance',
  'metric.category.volume': 'Volume',

  
  
  

  'onboarding.wizard.skip-aria': 'Skip this step',
  'onboarding.wizard.skip-onboarding': 'Skip Onboarding',

  'guide.skip-guide': 'Skip Guide',

  
  
  

  'account.linked-trades.setups': 'Setups',

  
  
  
  'account.create.title': 'Create account',
  'account.create.field.name': 'Account name',
  'account.create.field.name-desc': 'A unique name for your trading account',
  'account.create.placeholder.name': 'My Trading Account',
  'account.create.field.type': 'Account type',
  'account.create.field.type-desc': 'The type of trading account',
  'account.create.field.initial-balance': 'Initial balance',
  'account.create.field.initial-balance-desc':
    'Starting account balance (optional, defaults to 0)',
  'account.create.field.live-balance': 'Live balance',
  'account.create.field.live-balance-desc': 'Current broker account balance',
  'account.create.field.creation-date': 'Creation date',
  'account.create.field.creation-date-desc': 'When account was created',
  'account.create.field.currency': 'Currency',
  'account.create.field.currency-desc': "Account's native currency for display",
  'account.create.field.drawdown-type': 'Drawdown type',
  'account.create.field.drawdown-type-desc':
    'None | Fixed | EOD Trailing | Manual',
  'account.create.field.drawdown-amount': 'Drawdown Amount',
  'account.create.field.drawdown-amount-desc': 'Maximum drawdown limit',
  'account.create.field.profit-target-desc': 'Set a profit target for account',
  'account.create.field.monthly-cost': 'Monthly cost',
  'account.create.field.monthly-cost-desc': 'Subscription fees, platform costs',
  'account.create.field.target-type': 'Target Type',
  'account.create.field.target-type-desc': 'Absolute or percentage',
  'account.create.field.target-percent': 'Target (%)',
  'account.create.field.target-dollar': 'Target ($)',
  'account.create.field.target-percent-desc': 'Percentage gain target',
  'account.create.field.target-dollar-desc': 'Dollar amount target',
  'account.create.field.target-date': 'Target Date (Optional)',
  'account.create.field.target-date-desc': 'Date to achieve the profit target',
  'account.create.type.demo': 'Demo',
  'account.create.type.evaluation': 'Evaluation',
  'account.create.type.funded': 'Funded',
  'account.create.success': 'Account "{name}" created successfully',
  'account.create.error.name-required': 'Account name is required',
  'account.create.error.name-exists':
    'An account with the name "{name}" already exists',
  'account.create.error.rule-incomplete':
    'Every enabled rule needs a value above zero',
  'account.create.error.balance-negative': 'Initial balance cannot be negative',
  'account.create.error.invalid-live-balance': 'Live balance is invalid',
  'account.create.error.drawdown-required':
    'Drawdown amount is required when drawdown type is enabled',
  'account.create.error.profit-target-required':
    'Profit target amount is required when profit target is enabled',
  'account.create.error.invalid-date': 'Invalid creation date',
  'account.create.error.future-date': 'Creation date cannot be in the future',
  'account.create.error.cost-negative': 'Monthly cost cannot be negative',
  'account.create.error.service-unavailable':
    'Account service is not available. Please try again.',
  'account.create.error.fix-target-date':
    'Please fix the profit target date error before creating the account',
  'account.create.error.invalid-target-date': 'Invalid profit target date',
  'account.create.error.failed': 'Failed to create account: {error}',

  
  
  
  'account.add-event.title': 'Add Deposit/Withdrawal',
  'account.add-event.field.type': 'Transaction Type',
  'account.add-event.field.type-desc': 'Deposit or withdrawal',
  'account.add-event.field.amount': 'Amount',
  'account.add-event.field.amount-desc': 'Amount in {currency}',
  'account.add-event.field.date': 'Date',
  'account.add-event.field.date-desc': 'Transaction date',
  'account.add-event.field.description': 'Description (Optional)',
  'account.add-event.field.description-desc': 'Additional notes',
  'account.add-event.type.deposit': 'Deposit',
  'account.add-event.type.withdrawal': 'Withdrawal',
  'account.add-event.placeholder.deposit': 'Manual deposit',
  'account.add-event.placeholder.withdrawal': 'Manual withdrawal',
  'account.add-event.button.add': 'Add Transaction',
  'account.add-event.button.adding': 'Adding...',
  'account.add-event.success': '{type} of {amount} added successfully',
  'account.add-event.error.amount-required': 'Amount must be greater than 0',
  'account.add-event.error.date-required': 'Date is required',
  'account.add-event.error.invalid-date': 'Invalid date format',
  'account.add-event.error.future-date':
    'Transaction date cannot be in the future',
  'account.add-event.error.failed': 'Error adding transaction: {error}',
  'account.add-event.confirm.title': 'Confirm Transaction',
  'account.add-event.confirm.message':
    'Add {type} of {amount} to account "{account}" on {date}?',
  'account.add-event.confirm.description': 'Description: {description}',

  
  
  
  'account.risk-metrics.loading': 'Loading risk metrics...',
  'account.risk-metrics.title': 'Risk Management',
  'account.risk-metrics.drawdown-used': 'Drawdown Limit Used',
  'account.risk-metrics.profit-target': 'Profit Target',
  'account.risk-metrics.status.breached': 'BREACHED',
  'account.risk-metrics.status.achieved': 'ACHIEVED',
  'account.risk-metrics.status.in-progress': 'IN PROGRESS',
  'account.risk-metrics.not-set': 'Not set',
  'account.risk-metrics.no-drawdown': 'No drawdown limit set',
  'account.risk-metrics.no-profit-target': 'No profit target set',
  'account.risk-metrics.label.used': 'Used:',
  'account.risk-metrics.label.limit': 'Limit:',
  'account.risk-metrics.label.remaining': 'Remaining:',
  'account.risk-metrics.label.progress': 'Progress:',
  'account.risk-metrics.label.target': 'Target:',
  'account.risk-metrics.label.target-date': 'Target Date:',

  
  
  
  'account.edit-event.title': 'Edit {type}',
  'account.edit-event.field.type': 'Transaction Type',
  'account.edit-event.field.type-desc': 'Cannot be changed when editing',
  'account.edit-event.field.amount': 'Amount',
  'account.edit-event.field.amount-desc': 'Amount in {currency}',
  'account.edit-event.field.date': 'Date',
  'account.edit-event.field.date-desc': 'Transaction date',
  'account.edit-event.field.description': 'Description (Optional)',
  'account.edit-event.field.description-desc': 'Additional notes',
  'account.edit-event.button.save': 'Save Changes',
  'account.edit-event.button.saving': 'Saving...',
  'account.edit-event.button.delete': 'Delete {type}',
  'account.edit-event.button.deleting': 'Deleting...',
  'account.edit-event.success.update': '{type} updated successfully',
  'account.edit-event.success.delete': '{type} deleted successfully',
  'account.edit-event.error.update': 'Error updating transaction: {error}',
  'account.edit-event.error.delete': 'Error deleting transaction: {error}',
  'account.edit-event.delete-confirm.title': 'Delete {type}',
  'account.edit-event.delete-confirm.message':
    'Are you sure you want to delete this {type} of {amount} from {date}?',
  'account.edit-event.delete-confirm.warning': 'This action cannot be undone.',

  
  
  
  'account.edit.title': 'Edit Account',
  'account.edit.field.name': 'Account Name',
  'account.edit.field.name-desc': 'The unique name for this account',
  'account.edit.placeholder.name': 'e.g., My Trading Account',
  'account.edit.field.type': 'Account Type',
  'account.edit.field.type-desc': 'Type of trading account',
  'account.edit.type.demo': 'Demo',
  'account.edit.type.evaluation': 'Evaluation',
  'account.edit.type.funded': 'Funded',
  'account.edit.field.initial-balance': 'Initial Balance',
  'account.edit.field.initial-balance-desc': 'Starting account balance',
  'account.edit.field.live-balance': 'Live Balance',
  'account.edit.field.live-balance-desc': 'Current broker account balance',
  'account.edit.field.creation-date': 'Creation Date',
  'account.edit.field.creation-date-desc': 'When the account was created',
  'account.edit.field.currency': 'Currency',
  'account.edit.field.currency-desc': "Account's native currency for display",
  'account.edit.field.drawdown-type': 'Drawdown Type',

  'account.edit.field.drawdown-amount': 'Drawdown Amount',
  'account.edit.field.drawdown-amount-desc':
    'Maximum loss allowed from starting balance',
  'account.edit.field.manual-snapshots': 'Manual Drawdown Snapshots',
  'account.edit.field.manual-snapshots-desc':
    'Manage daily balance snapshots for EOD trailing drawdown calculation',
  'account.edit.field.profit-target-desc': 'Set a profit target for account',
  'account.edit.field.monthly-cost': 'Monthly Cost',
  'account.edit.field.monthly-cost-desc': 'Subscription fees, platform costs',
  'account.copy-trading.title': 'Copy trading',
  'account.copy-trading.description':
    'Derive this account’s performance from another account using historical copy periods.',
  'account.copy-trading.enable': 'This account copies another account',
  'account.copy-trading.existing-trades-warning':
    'This account already has direct trades. They will remain, and copied trades will be added from the selected start date.',
  'account.copy-trading.base-account': 'Base Account',
  'account.copy-trading.base-account-desc':
    'Only same-currency non-copy accounts can be selected.',
  'account.copy-trading.base-account-placeholder': 'Select base account',
  'account.copy-trading.multiplier': 'Multiplier',
  'account.copy-trading.multiplier-desc': 'Allowed range: 0.1x to 100x',
  'account.copy-trading.all-history': 'Copy all historical trades',
  'account.copy-trading.start-date': 'Copy From Date',
  'account.copy-trading.history': 'Copy history',
  'account.copy-trading.error.base-required':
    'Select a base account for copy trading.',
  'account.copy-trading.error.multiplier-range':
    'Copy trading multiplier must be between 0.1x and 100x.',
  'account.copy-trading.error.start-date-required':
    'Select a copy trading start date.',
  'account.copy-trading.error.base-account-is-copied':
    'This account is already used as a base account and cannot copy another account.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'This account is currently the base for another copy account.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'Base accounts cannot also be copy accounts.',

  'account.challenge.toggle.label': 'Prop firm challenge',
  'account.challenge.toggle.help':
    'Track evaluation phases, firm rules and payouts for this account.',
  'account.prop-challenge.title': 'Prop challenge',
  'account.prop-challenge.identity': 'Challenge identity',
  'account.prop-challenge.prefill.heading-link': 'Prefill from your firm',
  'account.prop-challenge.prefill.phase-link': 'Prefill rules with PRO',
  'account.prop-challenge.prefill.phase-link-firm':
    "Prefill {firm}'s rules with PRO",
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} more, rules prefilled with PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, rules prefilled with PRO',
  'account.prop-challenge.prefill.match':
    'We have {firm}: {count} challenges with rules ready',
  'account.prop-challenge.rules.empty':
    'No rules added yet. Use Add rule to define this phase.',
  'account.prop-challenge.rules': 'Rules',
  'account.prop-challenge.costs.empty': 'No costs added yet.',
  'account.prop-challenge.description':
    'Track this account through a multi-phase prop-firm challenge.',
  'account.prop-challenge.enable': 'Enable prop-challenge tracking',
  'account.prop-challenge.challenge-name': 'Challenge name',
  'account.prop-challenge.challenge-name-placeholder': 'e.g. 25K Evaluation',
  'account.prop-challenge.firm-name': 'Firm name (optional)',
  'account.prop-challenge.firm-name-placeholder': 'e.g. Apex Trader Funding',
  'account.prop-challenge.profile.title': 'Apply firm profile',
  'account.prop-challenge.profile.firm': 'Firm',
  'account.prop-challenge.profile.challenge': 'Challenge',
  'account.prop-challenge.profile.apply': 'Apply',
  'account.prop-challenge.profile.loading': 'Loading firm profiles…',
  'account.prop-challenge.profile.refreshing': 'Checking for profile updates…',
  'account.prop-challenge.profile.unavailable':
    'Firm profiles are unavailable while offline.',

  'account.prop-challenge.profile.confirm-title': 'Replace challenge setup?',
  'account.prop-challenge.profile.confirm-message':
    'Applying this profile replaces the phases and rules currently configured.',
  'account.prop-challenge.current-phase': 'Current phase',
  'account.prop-challenge.phase-rules': 'Rules for {phase}',
  'account.prop-challenge.next-phase': 'Next: {phase}',
  'account.prop-challenge.view-phase': 'View phase',
  'account.prop-challenge.unnamed-phase': 'Unnamed phase',
  'account.prop-challenge.phase-name': 'Phase name',
  'account.prop-challenge.phase-type': 'Phase type',
  'account.prop-challenge.phase-type.evaluation': 'Evaluation',
  'account.prop-challenge.phase-type.verification': 'Verification',
  'account.prop-challenge.phase-type.sim_funded': 'Sim funded',
  'account.prop-challenge.phase-type.live_funded': 'Live funded',
  'account.prop-challenge.phase-type.custom': 'Custom',
  'account.prop-challenge.starting-balance': 'Starting balance',
  'account.prop-challenge.broker-account-id': 'Broker accounts',
  'account.prop-challenge.broker-accounts.assigned': 'Assigned to {phase}',
  'account.prop-challenge.broker-accounts.trades': '{count} trades',
  'account.prop-challenge.broker-accounts.trade-one': '1 trade',
  'account.prop-challenge.phase-started': 'Started',
  'account.prop-challenge.phase-completed': 'Completed',
  'account.prop-challenge.timeline.completed-before-started':
    'Completed must be at or after started for {phase}.',
  'account.prop-challenge.timeline.out-of-order':
    '{phase} must complete at or before {next} starts.',
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} starts after a later rule change. Move the start back.',
  'account.prop-challenge.default-phase-name': 'Phase {number}',
  'account.prop-challenge.add-phase': 'Add phase',
  'account.prop-challenge.remove-phase': 'Remove phase',
  'account.prop-challenge.add-rule': 'Add rule',
  'account.prop-challenge.rule.enabled': 'Rule enabled',
  'account.prop-challenge.rule.amount': 'Amount',
  'account.prop-challenge.rule.target-type': 'Target type',
  'account.prop-challenge.rule.credit-withdrawals':
    'Count withdrawals toward target',
  'account.prop-challenge.rule.drawdown-mode': 'Drawdown mode',
  'account.prop-challenge.rule.lock-at-balance': 'Lock at balance',
  'account.prop-challenge.rule.daily-loss-model': 'Daily loss amount',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'Fixed amount',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'Increases at account profit threshold',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    'Scales with peak EOD profit',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    'Uses the fixed limit until the account closes at the activation balance. Starting the next trading day, the limit becomes the configured percentage of the highest end-of-day account profit and never decreases.',
  'account.prop-challenge.rule.scale-at-balance': 'Activation balance',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    'Peak EOD profit used as limit (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    '{value} of peak EOD profit',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    'Profit tiers from prior EOD balance',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    'Prior-EOD profit tiers',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    'Use profit:loss-limit pairs. The tier selected from the prior EOD account profit applies to the next session.',
  'account.prop-challenge.rule.loss-tiers': 'Profit tiers and loss limits',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'The higher daily loss amount activates permanently when lifetime account profit first reaches the configured percentage of starting balance.',
  'account.prop-challenge.rule.profit-threshold-percent':
    'Account profit threshold (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'Daily loss amount after threshold',
  'account.prop-challenge.rule.breach-action': 'Breach behavior',
  'account.prop-challenge.rule.breach-action.hard': 'Fail account',
  'account.prop-challenge.rule.breach-action.soft': 'Pause until next session',
  'account.prop-challenge.rule.days': 'Trading days',
  'account.prop-challenge.rule.minimum-daily-profit': 'Minimum profit per day',
  'account.prop-challenge.rule.minimum-daily-profit-summary':
    '{value}+ per day',
  'account.prop-challenge.rule.best-day-percent': 'Maximum best day (%)',
  'account.prop-challenge.rule.position-limit-model': 'Position limit model',
  'account.prop-challenge.rule.position-limit-model.fixed': 'Fixed limit',
  'account.prop-challenge.rule.position-limit-model.eod-profit-tiers':
    'EOD profit tiers',
  'account.prop-challenge.rule.position-profit-basis':
    'Position scaling profit basis',
  'account.prop-challenge.rule.position-profit-basis.cumulative':
    'Cumulative trade profit (payouts do not reduce)',
  'account.prop-challenge.rule.position-profit-basis.current-account':
    'Current account profit (payouts reduce)',
  'account.prop-challenge.rule.position-limit-model.eod-profit':
    'Scales with EOD profit',
  'account.prop-challenge.rule.position-tiers': 'Profit tiers',
  'account.prop-challenge.rule.position-tiers-help':
    'Enter each completed EOD profit threshold and its new contract limit as profit:contracts, separated by commas. A tier applies from the next trading day.',
  'account.prop-challenge.rule.position-scaling-help':
    'Each completed profit step adds one contract starting on the next trading day, up to the maximum.',
  'account.prop-challenge.rule.initial-contracts': 'Initial contracts',
  'account.prop-challenge.rule.profit-per-contract':
    'EOD profit per additional contract',
  'account.prop-challenge.rule.maximum-contracts':
    'Maximum contracts after scaling',
  'account.prop-challenge.rule.max-contracts': 'Maximum contracts',
  'account.prop-challenge.rule.profit_target': 'Profit target',
  'account.prop-challenge.rule.drawdown': 'Drawdown',
  'account.prop-challenge.rule.daily_loss_limit': 'Daily loss limit',
  'account.prop-challenge.rule.live_review_daily_profit':
    'Live-review daily profit',
  'account.prop-challenge.rule.best-profitable-day': 'Profitable day trigger',
  'account.prop-challenge.rule.daily_profit_cap': 'Daily profit credit cap',
  'account.prop-challenge.rule.per-trading-day': 'Per trading day',
  'account.prop-challenge.rule.minimum_trading_days': 'Minimum trading days',
  'account.prop-challenge.rule.minimum_profitable_days':
    'Minimum profitable days',
  'account.prop-challenge.rule.consistency-cushion-percent':
    'Consistency cushion (percentage points)',
  'account.prop-challenge.rule.consistency-cushion-short': 'cushion',
  'account.prop-challenge.rule.consistency': 'Consistency',
  'account.prop-challenge.rule.max_position_size': 'Maximum position size',
  'account.prop-challenge.drawdown.static': 'Static',
  'account.prop-challenge.drawdown.eod-trailing': 'EOD trailing',
  'account.prop-challenge.drawdown.intraday-trailing': 'Intraday trailing',
  'account.prop-challenge.summary.status.active': 'Active',
  'account.prop-challenge.summary.status.passed': 'Passed',
  'account.prop-challenge.summary.status.failed': 'Failed',
  'account.prop-challenge.summary.status.pending': 'Pending',
  'account.prop-challenge.summary.status.warning': 'Near limit',
  'account.prop-challenge.summary.status.payout_ready': 'Payout ready',
  'account.prop-challenge.ribbon.passed': '{phase} passed',
  'account.prop-challenge.ribbon.failed': '{phase} failed',
  'account.prop-challenge.ribbon.action.advance': 'Advance to {phase}',
  'account.prop-challenge.ribbon.action.advance-short': 'Advance',
  'account.prop-challenge.ribbon.action.mark-passed': 'Mark passed',
  'account.prop-challenge.ribbon.action.archive': 'Archive',
  'account.prop-challenge.ribbon.action.record-payout': 'Record payout',
  'account.prop-challenge.ribbon.action.record-payout-short': 'Payout',
  'account.prop-challenge.summary.phase-status.pending': 'Pending',
  'account.prop-challenge.summary.phase-status.active': 'Active',
  'account.prop-challenge.summary.phase-status.passed': 'Passed',
  'account.prop-challenge.summary.phase-status.failed': 'Failed',
  'account.prop-challenge.summary.rule.profit_target': 'Profit target',
  'account.prop-challenge.summary.rule.drawdown': 'Drawdown',
  'account.prop-challenge.summary.rule.drawdown-static': 'Static drawdown',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': 'EOD drawdown',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing':
    'Intraday drawdown',
  'account.prop-challenge.summary.rule.daily_loss_limit': 'Daily loss',
  'account.prop-challenge.summary.rule.live_review_daily_profit': 'Live review',
  'account.prop-challenge.summary.rule.daily_profit_cap': 'Daily profit credit',
  'account.prop-challenge.summary.rule.minimum_trading_days': 'Trading days',
  'account.prop-challenge.summary.rule.minimum_profitable_days':
    'Profitable days',
  'account.prop-challenge.summary.rule.consistency': 'Best-day consistency',
  'account.prop-challenge.summary.rule.max_position_size': 'Position size',
  'account.prop-challenge.summary.status.archived': 'Archived',
  'account.prop-challenge.summary.status.hidden': 'Hidden',
  'account.prop-challenge.payout.title': 'Payout readiness',
  'account.prop-challenge.payout.eligible': 'Payout ready',
  'account.prop-challenge.payout.available': 'Available now',
  'account.prop-challenge.payout.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.history': 'Payouts',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'Lifetime qualifying days',
  'account.prop-challenge.payout.requirement.days': 'Trading days',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'Qualifying days',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'Minimum account balance',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'Positive cycle profit',
  'account.prop-challenge.payout.requirement.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.requirement.consistency': 'Consistency',
  'account.prop-challenge.payout.requirement.minimum': 'Minimum available',
  'account.prop-challenge.payout.requirement.payouts': 'Payout allowance',
  'account.prop-challenge.payout.requirement.request-window': 'Request window',
  'account.prop-challenge.payout.timezone-invalid': 'Not a known time zone.',
  'account.prop-challenge.payout.preview-amount': 'Preview payout',
  'account.prop-challenge.payout.you-receive': 'Trader share',
  'account.prop-challenge.payout.balance-after': 'Balance after',
  'account.prop-challenge.payout.drawdown-floor': 'Drawdown floor',
  'account.prop-challenge.payout.buffer-after': 'Room before breach',
  'account.prop-challenge.payout.request-not-allowed':
    'Not eligible at this amount',
  'account.prop-challenge.payout.immediate-breach':
    'This payout would leave the account at or below its drawdown floor.',
  'account.prop-challenge.payout.account-concludes':
    'This payout completes the configured simulated-funded payout cycle.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'This payout advances the account to its next configured stage.',
  'account.prop-challenge.payout.live-review-after-payout':
    'This payout makes the account eligible for live-account review.',
  'account.prop-challenge.payout.cycle-resets':
    'Payout progress resets after an approved payout.',
  'account.prop-challenge.payout.cycle-continues':
    'Payout progress continues after an approved payout.',
  'account.prop-challenge.payout.drawdown.unchanged':
    'The current drawdown floor remains in place.',
  'account.prop-challenge.payout.drawdown.lock_at_balance':
    'The drawdown floor locks after payout.',
  'account.prop-challenge.payout.drawdown.reset_from_starting_balance':
    'The account and drawdown limits reset after payout.',
  'account.prop-challenge.ledger.value.of': '{current} of {target}',
  'account.prop-challenge.ledger.section.payout': 'Payout requirements',
  'account.prop-challenge.ledger.requirement.minimum': 'min {value}',
  'account.prop-challenge.ledger.requirement.maximum': 'max {value}',
  'account.prop-challenge.ledger.value.ratio': '{current} / {target}',
  'account.prop-challenge.payout.met-of-total': '{met} of {total} requirements',
  'account.prop-challenge.ledger.value.of-today': '{current} of {target} today',
  'account.prop-challenge.ledger.value.credited-profit':
    '{credited} credited of {actual} actual profit',
  'account.prop-challenge.ledger.value.used': '{used} used',
  'account.prop-challenge.ledger.value.consistency-goal':
    '{current} of {target} consistency goal',
  'account.prop-challenge.ledger.value.best-day-share':
    'Best day {value} of profit',
  'account.prop-challenge.ledger.value.no-profit': 'No profit yet',
  'account.prop-challenge.ledger.requirement.best-day':
    'Best day ≤ {value} of total profit',
  'account.prop-challenge.ledger.state.needs-profit': 'Needs profit',
  'account.prop-challenge.ledger.tooltip.open': 'Explain {rule}',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    'Limits how much of total phase profit can come from the single most profitable trading day.',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    'Best-day profit ÷ total phase profit × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    'Best day: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    'Total profit: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 = {share}',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    'Consistency goal: {best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    'The share falls as you add profit on other days, and a new larger best day raises the goal.',
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum} — within rule',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    'The calculation starts once total phase profit is positive.',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    'A consistency goal requires a maximum above 0%.',
  'account.prop-challenge.ledger.help.open': 'About {rule}',
  'account.prop-challenge.ledger.help.profit_target':
    'Grow the account by this amount to pass the phase. Only closed trades count.',
  'account.prop-challenge.ledger.help.profit_target.example':
    'This account needs {target} in profit: {current} so far, {remaining} to go.',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'Target reached: {current} of {target}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    'The most the balance may fall below the starting balance. The floor never moves.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    "This account's floor is {floor}; the balance must stay above it. {buffer} of the {limit} limit is left.",
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    "The floor follows your highest end-of-day balance and only moves up, until it locks at the firm's lock level.",
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'Right now the floor is {floor} (highest close minus {limit}) and it moves up with each higher close. {buffer} left.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    "The floor follows your highest balance at any moment, open profit included. Journalit only sees closed trades, so this floor trails your best balance after each close; a peak reached inside an open trade is not counted. Check the firm's own figure.",
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    "Right now the floor is {floor} (best closed-trade balance minus {limit}). {buffer} left; the firm's live figure may be tighter.",
  'account.prop-challenge.ledger.help.daily_loss_limit':
    'The most you may lose in one trading day. Reaching it fails the phase or pauses trading until the next session, depending on the firm.',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    'Today: {used} lost of the {limit} daily limit, {left} left.',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    "Only part of each day's profit is credited toward the target. Profit above the cap is kept but not counted.",
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    "Only {cap} of a day's profit is credited; {excluded} earned above the cap so far does not count.",
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'One trading day at or above this profit makes the account eligible for a live-account review.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    'One day at {trigger} or more qualifies; best day so far {bestDay}.',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    'Days with at least one closed trade. The phase cannot pass before you have this many, however fast you hit the target.',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{current} of {target} trading days done, {remaining} to go.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    "Trading days that close at or above the firm's minimum daily profit. Break-even or smaller wins do not count.",
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{current} of {target} days closed at {minimum} or more, {remaining} to go.',
  'account.prop-challenge.ledger.help.consistency':
    'Your best single day may not exceed this share of total phase profit. Fix it by earning more on other days, not by losing.',
  'account.prop-challenge.ledger.help.consistency.example':
    'Best day {bestDay} is {share} of {total} total profit; total profit must reach {goal} for it to sit at {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'Best day {bestDay} is {share} of total profit, within the {maximum} limit.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'No profit yet, so there is no best day to compare.',
  'account.prop-challenge.ledger.help.max_position_size':
    'The most contracts you may hold at once, across all open positions. Some firms raise the limit as profit grows.',
  'account.prop-challenge.ledger.help.max_position_size.example':
    'Up to {maximum} contracts at once right now; largest position so far {current}.',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'Trading days in the current payout cycle. The count restarts after an approved payout.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '{current} of {target} trading days this cycle, {remaining} to go.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    "Trading days in this cycle that close at or above the firm's minimum daily profit.",
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '{current} of {target} days at {minimum} or more this cycle, {remaining} to go.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'Profit earned since the cycle started must reach this amount before you can request.',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '{current} earned this cycle of the {target} needed.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'The balance must be at or above this level when you request.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    'Balance {current}; it must be at least {target}.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    'After the first payout, each new cycle must be in profit before another request.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'Cycle profit is {current}; it must be above zero.',
  'account.prop-challenge.ledger.help.payout.consistency':
    'Your best day may not exceed this share of cycle profit.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    'Best day {bestDay} is {share} of {total} cycle profit; cycle profit must reach {goal} for it to sit at {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'Best day {bestDay} is {share} of cycle profit, within the {maximum} limit.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'No cycle profit yet, so there is no best day to compare.',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    'The smallest payout the firm accepts. The amount available must reach it first.',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    "{current} available; the firm's minimum request is {target}.",
  'account.prop-challenge.ledger.help.payout.payout_count':
    'How many payouts this stage allows. Using the allowance completes the stage.',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '{current} of {target} payouts used this stage.',
  'account.prop-challenge.ledger.help.payout.request_window':
    "Requests are only accepted on these weekdays, in the firm's time zone.",
  'account.prop-challenge.ledger.help.payout.request_window.example':
    'Today is {today}; requests open on {days} ({timeZone}).',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'Time since the first trade of the cycle must reach this before you can request.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    "{current} of {target} hours since the cycle's first trade.",
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'Qualifying days across the whole funded phase, not just this cycle. Payouts unlock once reached.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '{current} of {target} qualifying days across the whole phase.',
  'account.prop-challenge.ledger.requirement.target': '{value} target',
  'account.prop-challenge.ledger.requirement.buffer': '{value} buffer',
  'account.prop-challenge.ledger.requirement.max': '{value} max',
  'account.prop-challenge.ledger.requirement.daily-cap':
    '{value} credited per trading day',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{days} days at {profit}+',
  'account.prop-challenge.ledger.requirement.days': '{value} days',
  'account.prop-challenge.ledger.requirement.at-most': '≤ {value}',
  'account.prop-challenge.ledger.state.not-started': 'Not started',
  'account.prop-challenge.ledger.state.in-progress': 'In progress',
  'account.prop-challenge.ledger.state.reached': 'Reached',
  'account.prop-challenge.ledger.state.met': 'Met',
  'account.prop-challenge.ledger.state.eligible': 'Eligible',
  'account.prop-challenge.ledger.state.safe': 'Safe',
  'account.prop-challenge.ledger.state.clear': 'Clear',
  'account.prop-challenge.ledger.state.within-rule': 'Within rule',
  'account.prop-challenge.ledger.state.near-limit': 'Near limit',
  'account.prop-challenge.ledger.state.limit-reached': 'Limit reached',
  'account.prop-challenge.ledger.state.cap-applied': 'Cap applied',
  'account.prop-challenge.ledger.state.within-cap': 'Within cap',
  'account.prop-challenge.ledger.state.breached': 'Breached',
  'account.prop-challenge.actions.progress-to': 'Progress to {phase}',
  'account.prop-challenge.actions.progress': 'Progress to next phase',
  'account.prop-challenge.actions.mark-passed': 'Mark challenge passed',
  'account.prop-challenge.actions.mark-failed': 'Mark as failed',
  'account.prop-challenge.actions.archive': 'Archive challenge',
  'account.prop-challenge.actions.stale':
    'This challenge was updated elsewhere. Check it and try again.',
  'account.prop-challenge.actions.reopen': 'Reopen',
  'account.prop-challenge.view-trades': 'View trades for {phase}',
  'account.prop-challenge.actions.manual': 'Manual actions',
  'account.prop-challenge.notice.failed-title': '{phase} failed',
  'account.prop-challenge.notice.failed-description':
    '{rule} breached on {date}',
  'account.prop-challenge.notice.failed-manual': 'Marked as failed',
  'account.prop-challenge.notice.keep-open': 'Keep open',
  'account.prop-challenge.notice.target-title': '{phase} target reached',
  'account.prop-challenge.notice.target-description':
    'All pass requirements are met. Ready to move to {next}?',
  'account.prop-challenge.notice.breach-after-reached':
    'Rules were broken after the target was reached at {time}. Set the transition time to keep those trades out of this phase.',
  'account.prop-challenge.notice.not-yet': 'Not yet',
  'account.prop-challenge.notice.passed-title': 'Evaluation passed',
  'account.prop-challenge.notice.passed-description':
    'All requirements are met. Mark the challenge passed?',
  'account.prop-challenge.notice.payout-title': 'Payout available: {amount}',
  'account.prop-challenge.notice.payout-plan': 'Your plan: withdraw {amount}',
  'account.prop-challenge.notice.record-payout': 'Record payout',
  'account.prop-challenge.notice.skip-cycle': 'Skip this cycle',
  'account.prop-challenge.notice.payout-description': 'Payout',
  'account.prop-challenge.notice.lost-title': 'Payout no longer available',
  'account.prop-challenge.notice.lost-description': 'Unmet: {requirements}',
  'account.prop-challenge.notice.dismiss': 'Dismiss',
  'account.prop-challenge.notice.unknown-title': 'New account {label}',
  'account.prop-challenge.notice.unknown-description':
    '{count} trades since {date} are not assigned to a phase.',
  'account.prop-challenge.notice.unknown-description-one':
    '1 trade since {date} is not assigned to a phase.',
  'account.prop-challenge.notice.same-phase': 'Same phase',
  'account.prop-challenge.notice.not-now': 'Not now',
  'account.prop-challenge.notice.error': 'Could not update the notice.',
  'account.prop-challenge.notice.type-changed':
    'Account type set to {accountType}',
  'account.prop-challenge.payout.plan.title': 'Payout plan',
  'account.prop-challenge.payout.plan.notify-minimum':
    'Notify when at least ({currency})',
  'account.prop-challenge.payout.plan.withdrawal': 'Suggested withdrawal',
  'account.prop-challenge.payout.plan.full': 'Full amount',
  'account.prop-challenge.payout.plan.percent': 'Percent of available',
  'account.prop-challenge.payout.plan.amount': 'Fixed amount',
  'account.prop-challenge.payout.plan.percent-invalid':
    'Enter a percentage between 1 and 100.',
  'account.prop-challenge.payout.plan.amount-invalid':
    'Enter an amount greater than zero.',
  'account.prop-challenge.payout.plan.percent-value': 'Percent',
  'account.prop-challenge.payout.plan.amount-value': 'Amount ({currency})',
  'account.prop-challenge.payout.plan.save': 'Save plan',
  'account.prop-challenge.payout.plan.saved': 'Payout plan saved.',
  'account.prop-challenge.payout.plan.summary-notify': 'notify ≥ {amount}',
  'account.prop-challenge.payout.plan.summary-percent': 'suggest {percent}%',
  'account.prop-challenge.payout.plan.summary-amount': 'suggest {amount}',
  'account.prop-challenge.payout.plan.summary-full': 'full amount',
  'account.prop-challenge.actions.error':
    'Could not update the prop challenge.',
  'account.prop-challenge.confirm.advance':
    'Confirm this phase result and continue the challenge?',
  'account.prop-challenge.confirm.advance-with-promotion':
    'This will advance the challenge and change the account type to {accountType}.',
  'account.prop-challenge.confirm.fail':
    'Mark {account} as failed? The challenge “{challenge}” ends at {phase}.',
  'account.prop-challenge.confirm.archive-failed':
    'Archive {account}? The challenge “{challenge}” failed. The account moves to Archived.',
  'account.prop-challenge.confirm.archive-passed':
    'Archive {account}? The challenge “{challenge}” passed. The account moves to Archived.',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → challenge passed',
  'account.prop-challenge.confirm.reopen':
    'Reopen {account}? The challenge “{challenge}” returns to {phase}.',
  'account.prop-challenge.transition.time': 'Transition time',
  'account.prop-challenge.transition.now': 'Now',
  'account.prop-challenge.transition.when-target-reached':
    'When target was reached',
  'account.prop-challenge.transition.too-early':
    'Transition time cannot be before this phase started.',
  'account.prop-challenge.costs.title': 'One-time costs',
  'account.prop-challenge.costs.description':
    'Track purchase, reset, and activation fees separately.',
  'account.prop-challenge.costs.kind': 'Type',
  'account.prop-challenge.costs.kind.purchase': 'Purchase',
  'account.prop-challenge.costs.kind.reset': 'Reset',
  'account.prop-challenge.costs.kind.activation': 'Activation',
  'account.prop-challenge.costs.kind.other': 'Other',
  'account.prop-challenge.costs.date': 'Date',
  'account.prop-challenge.costs.amount': 'Amount',
  'account.prop-challenge.costs.note': 'Note (optional)',
  'account.prop-challenge.costs.add': 'Add cost',
  'account.header.copies': 'Copies',
  'account.header.copied-by-more': '+{count} more',
  'account.header.created': 'Created:',
  'account.summary.current-balance': 'Current Balance',
  'account.summary.net-cash-flow': 'Net Cash Flow',
  'account.summary.payouts': 'Payouts',
  'account.performance.title': 'Performance',
  'account-page.guide.whats-new.cockpit.intro.title':
    "What's new on the account page",
  'account-page.guide.whats-new.cockpit.intro.description':
    'The balance chart now leads the account analysis. One connected metrics panel follows it, with prop-challenge rules directly below.',
  'account-page.guide.whats-new.cockpit.cockpit.title':
    'Challenge rules follow account performance',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    'For prop accounts, choose a phase from the rule header below the metrics panel to inspect every requirement and its progress. Lifecycle actions stay in the menu beside it.',
  'account-page.guide.whats-new.cockpit.payout.title':
    'Know when a funded payout is safe',
  'account-page.guide.whats-new.cockpit.payout.description':
    'Funded accounts with verified rules now show payout requirements, the amount available, and a preview of the balance and drawdown consequences before you request money.',
  'account-page.guide.whats-new.cockpit.summary.title':
    'One connected metrics panel',
  'account-page.guide.whats-new.cockpit.summary.description':
    'Account state and detailed performance now share one surface below the chart: balance, net P&L and cash flow come first, and the remaining metrics continue in the same grid.',
  'account-page.guide.whats-new.cockpit.risk.title':
    'One authoritative risk source',
  'account-page.guide.whats-new.cockpit.risk.description':
    'While a challenge is active, passed, or failed, its phase rules are the only risk shown, so no second drawdown figure can contradict them. Generic account risk returns for regular or archived accounts.',
  'account-page.guide.main.challenge.title': 'Your challenge at a glance',
  'account-page.guide.main.challenge.description':
    'Below the connected metrics panel, choose a challenge phase from the rule header and inspect every requirement with its progress and state. Lifecycle actions sit beside the selector.',
  'account-page.guide.main.payout.title': 'Plan funded payouts',
  'account-page.guide.main.payout.description':
    'When the funded phase has verified payout rules, this panel tracks eligibility and previews the account impact of a requested amount.',
  'account-page.guide.main.summary.title': 'Account state at a glance',
  'account-page.guide.main.summary.description':
    'The connected metrics panel starts with balance, net P&L, growth, trades, win rate, and net cash flow — or payouts for a prop account.',
  'account.edit.field.target-type': 'Target Type',
  'account.edit.field.target-type-desc': 'Absolute or percentage',
  'account.edit.field.target-percent': 'Target (%)',
  'account.edit.field.target-dollar': 'Target ($)',
  'account.edit.field.target-percent-desc': 'Percentage gain target',
  'account.edit.field.target-dollar-desc': 'Dollar amount target',
  'account.edit.field.target-date': 'Target Date (Optional)',
  'account.edit.field.target-date-desc': 'Date to achieve the profit target',
  'account.edit.button.show-snapshots':
    'Show Snapshot Manager ({count} recorded)',
  'account.edit.button.hide-snapshots':
    'Hide Snapshot Manager ({count} recorded)',
  'account.edit.delete-warning':
    'This is a permanent action that cannot be undone!',

  
  'account.drawdown.none': 'None',
  'account.drawdown.fixed': 'Fixed',
  'account.drawdown.eod-trailing': 'EOD Trailing',
  'account.drawdown.manual': 'Manual',

  
  'account.profit-target.enable': 'Enable profit target',
  'account.profit-target.type.absolute': 'Absolute amount',
  'account.profit-target.type.percentage': 'Percentage',

  
  'account.create.button.creating': 'Creating...',
  'account.create.button.create': 'Create account',
  'account.edit.button.saving': 'Saving...',
  'account.edit.button.save': 'Save Changes',
  'account.edit.button.delete': 'Delete Account',
  'account.edit.button.delete-name': 'Delete "{name}"',

  
  'account.edit.modal.update-notes.title': 'Update Linked Notes?',
  'account.edit.modal.update-notes.message':
    'Renaming will update all notes that reference "{oldName}" to "{newName}". This is required to keep data consistent.',
  'account.edit.modal.update-notes.yes': 'OK (Update Notes)',
  'account.edit.modal.update-notes.no': 'Keep Old Name',
  'account.edit.modal.update-notes.cancel': 'Cancel Action',

  'account.edit.modal.change-date.title': 'Change Creation Date',
  'account.edit.modal.change-date.message':
    'You are about to change the creation date for account "{account}" from {oldDate} to {newDate}.',
  'account.edit.modal.change-date.warning':
    'This will update the initial deposit transaction date and may affect account age calculations, monthly billing cycles, and other date-based metrics.',

  'account.edit.modal.change-date.confirm': 'Update Creation Date',

  'account.edit.modal.change-balance.title': 'Change Initial Balance',
  'account.edit.modal.change-balance.message':
    'You are about to change the initial balance from {oldBalance} to {newBalance}.',

  'account.edit.modal.change-balance.info':
    'This will affect all balance calculations, P&L percentages, drawdown calculations, and transaction history.',
  'account.edit.modal.change-balance.info2':
    'The current balance will be recalculated based on the new initial balance plus all trade P&L.',
  'account.edit.modal.change-balance.info3':
    'This change may significantly impact account metrics and historical data accuracy.',
  'account.edit.modal.change-balance.confirm': 'Update Initial Balance',

  'account.edit.modal.delete.title': 'Delete Account',
  'account.edit.modal.delete.question':
    'Are you sure you want to permanently delete the account "{name}"?',

  'account.edit.modal.delete.will': 'This action will:',
  'account.edit.modal.delete.item1': 'Remove all account metadata and settings',
  'account.edit.modal.delete.item2':
    'Remove account references from all linked trades',
  'account.edit.modal.delete.item3':
    'Remove auto-generated account tags from notes',
  'account.edit.modal.delete.delete-associated-trades':
    'Also delete all trades linked to this account from my vault',

  
  'common.note-label': 'Note:',

  'common.backups-label': 'Backups:',
  'account.edit.error.name-required': 'Account name is required',
  'account.edit.error.name-exists': 'Account "{name}" already exists',
  'account.edit.error.creation-date-required': 'Creation date is required',
  'account.edit.error.balance-required': 'Initial balance cannot be negative',
  'account.edit.error.invalid-live-balance': 'Live balance is invalid',
  'account.edit.error.drawdown-required':
    'Drawdown amount must be greater than 0',
  'account.edit.error.future-date': 'Creation date cannot be in the future',
  'account.edit.error.update-failed': 'Error updating account: {error}',
  'account.edit.error.service-unavailable': 'Account service is not available',
  'account.edit.error.delete-failed': 'Error deleting account: {error}',
  'account.edit.success.updated': 'Account "{name}" updated successfully',
  'account.edit.success.updated-with-references':
    'Account updated from "{oldName}" to "{newName}" and all note references updated',
  'account.edit.success.deleted': 'Account "{name}" deleted successfully',

  
  
  
  'button.next': 'Next',
  'button.discard': 'Discard',
  'guide.scroll-to-target.title': 'Scroll to continue the guide',
  'guide.scroll-to-target.description':
    'The next step is offscreen. Scroll to keep going, or let Journalit take you there.',
  'guide.scroll-to-target.description-up':
    'The next step is higher on the page. Scroll up to keep going, or let Journalit take you there.',
  'guide.scroll-to-target.description-down':
    'The next step is lower on the page. Scroll down to keep going, or let Journalit take you there.',
  'guide.scroll-to-target.button': 'Show me',

  
  
  
  'templateEditor.loading': 'Loading layout...',
  'templateEditor.mode.preview': 'Preview',
  'templateEditor.mode.editor': 'Editor',
  'templateEditor.built-in-badge': '(Built-in)',
  'templateEditor.built-in-notice':
    'Built-in layouts cannot be edited. Duplicate this layout or create a new one to customise.',
  'templateEditor.unsaved-changes': 'Unsaved changes',
  'templateEditor.field.template-name': 'Layout Name',
  'templateEditor.field.widgets': 'Widgets ({count})',
  'templateEditor.button.add-widget': '+ Add Widget',
  'templateEditor.button.widget-library-docs': 'Widget library docs',
  'templateEditor.widget.locked': 'Locked',
  'templateEditor.widget.select-placeholder': 'Select a widget...',
  'templateEditor.widget.header-text-placeholder': 'Header text...',
  'templateEditor.widget.markdown-zone-text-label': 'Preset text',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'Text to insert into new review notes...',
  'templateEditor.widget.page-size': 'Page size:',
  'templateEditor.widget.show-rating-column': 'Show rating column',
  'templateEditor.widget.demon-tracker.tracking-method': 'Track mistakes by:',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    'Trade occurrences',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    'Every trade tagged with the mistake counts.',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days':
    'Trading days',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    'Trade and daily review mistakes are merged and count once per trading day.',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    'Daily review entries',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    'Only mistakes recorded in daily reviews count.',
  'templateEditor.widget.demon-tracker.stop-after': 'Stop trading after:',

  
  
  
  'notice.error.template-save-failed': 'Failed to save layout',

  
  
  
  'builder.sidebar.title': 'Layout Builder',
  'builder.sidebar.section.trade': 'Trade',
  'builder.sidebar.section.drc': 'DRC',
  'builder.sidebar.section.weekly': 'Weekly',
  'builder.sidebar.section.monthly': 'Monthly',
  'builder.sidebar.section.quarterly': 'Quarterly',
  'builder.sidebar.section.yearly': 'Yearly',
  'builder.sidebar.section.library': 'Library',
  'builder.sidebar.new-item': 'New {title}',
  'builder.sidebar.coming-soon': 'Coming soon',
  'builder.sidebar.built-in': 'Built-in',
  'builder.sidebar.default-template': 'Default layout',
  'builder.sidebar.set-as-default': 'Set as default',
  'builder.sidebar.duplicate': 'Duplicate',
  'builder.sidebar.delete': 'Delete',
  'builder.sidebar.no-templates': 'No layouts yet',
  'builder.sidebar.share-template': 'Share Layout',
  'builder.sidebar.new-template-name': 'New {type} Layout',
  'builder.sidebar.copy-suffix': '(Copy)',

  
  'notice.default-trade-template-updated': 'Default trade layout updated',
  'notice.trade-template-duplicated': 'Trade layout duplicated',
  'notice.trade-template-deleted': 'Trade layout deleted',
  'notice.error.create-template': 'Failed to create layout',
  'notice.error.duplicate-template': 'Failed to duplicate layout',
  'notice.error.delete-template': 'Failed to delete layout',

  
  
  
  'account.weight-legend.aria-label': 'Account type distribution legend',
  'account.weight-legend.item-aria-label': '{name}: {percent}',

  
  
  
  'account.transaction.deposit': 'Deposit',
  'account.transaction.withdrawal': 'Withdrawal',
  'account.transaction.click-to-edit':
    'Click to edit or delete this transaction',
  'account.transaction.edit-row-label':
    'Edit or delete this transaction: {date}, {amount}',
  'account.deposits-withdrawals.title': 'Deposits & Withdrawals',
  'account.deposits-withdrawals.empty':
    'No manual deposits or withdrawals recorded.',
  'account.deposits-withdrawals.empty-sub':
    'Click the + button in the header to add your first transaction.',
  'account.deposits-withdrawals.summary':
    '{deposits} deposited · {withdrawn} withdrawn · last {date}',
  'account.payouts.title': 'Payouts',
  'account.payouts.summary': '{count} payouts · {total} · last {date}',
  'account.payouts.summary-masked':
    'Payout history is hidden while values are masked',
  'account.payouts.summary-one': '1 payout · {total} · last {date}',
  'account.payouts.empty': 'No payouts yet',
  'account.payouts.empty-sub':
    'Record a payout with the + button in the header.',
  'account.ledger.column.date': 'Date',
  'account.ledger.column.type': 'Type',
  'account.ledger.column.payout': 'Payout',
  'account.ledger.column.description': 'Description',
  'account.ledger.column.amount': 'Amount',
  'account.ledger.column.balance-after': 'Balance after',

  
  
  
  'settings.reset.modal.title': 'Reset Settings to Defaults?',
  'settings.reset.modal.explanation':
    'This will reset ALL plugin settings to their default values. This includes:',
  'settings.reset.modal.item-custom-options':
    'All custom options (tickers, setups, mistakes)',
  'settings.reset.modal.item-account-settings': 'Account settings and metadata',
  'settings.reset.modal.item-dashboard-layouts': 'Dashboard layouts',
  'settings.reset.modal.item-symbol-mappings': 'Symbol mappings',
  'settings.reset.modal.item-csv-templates': 'CSV templates',
  'settings.reset.modal.item-other': 'All other customizations',
  'settings.reset.modal.backup-note': 'A backup will be created before reset.',
  'settings.reset.modal.warning':
    'This action cannot be undone (except by restoring from backup).',
  'settings.reset.backup-failed.title': 'Backup Failed',
  'settings.reset.backup-failed.message':
    'Unable to create a backup of your current settings.',
  'settings.reset.backup-failed.warning':
    'If you proceed with the reset, you will not be able to restore your current settings.',
  'notice.settings-reset-with-backup':
    'Settings reset to defaults. A backup was created. Restart Obsidian to apply all changes.',
  'notice.settings-reset-no-backup':
    'Settings reset to defaults. No backup was created. Restart Obsidian to apply all changes.',

  
  
  
  'home.quick-links.hide': 'Hide quick link',
  'home.quick-links.add-trade': 'Add Trade',
  'home.quick-links.trade-log': 'Trade Log',
  'home.quick-links.trading-dashboard': 'Dashboard',
  'home.quick-links.account-dashboard': 'Accounts',
  'home.quick-links.todays-drc': "Today's DRC",
  'home.quick-links.weekly-review': 'This Week Review',
  'home.quick-links.monthly-review': 'This Month Review',
  'home.quick-links.quarterly-review': 'This Quarter Review',
  'home.quick-links.yearly-review': 'This Year Review',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'Layout Builder',
  'home.quick-links.navigation-sidebar': 'Navigation Sidebar',
  'home.quick-links.session-mode': 'Session Mode',
  'home.quick-links.economic-calendar': 'Economic Calendar',
  'home.quick-links.move-above': 'Move quick links above widgets',
  'home.quick-links.move-below': 'Move quick links below widgets',

  
  
  
  'home.widget-selector.title': 'Add to Home',
  'home.widget-selector.section.widgets': 'Widgets',
  'home.widget-selector.section.quick-links': 'Quick Links',
  'home.widget-selector.restore': 'restore',
  'home.widget-selector.add-shortcut': 'Add account/setup shortcut',
  'home.widget-selector.hint.navigate': '↑↓ navigate',
  'home.widget-selector.hint.select': '↵ select',
  'home.widget-selector.hint.close': 'esc close',

  
  
  
  
  'home.period.month': 'Month',
  'home.period.quarter': 'Quarter',
  'home.period.year': 'Year',
  'home.period.lifetime': 'All Time',

  

  'home.aria.filter-trade-types': 'Filter Trade Types',
  'home.aria.open-settings': 'Open Journalit settings',
  'home.aria.save-layout': 'Save Layout',
  'home.aria.customize': 'Customise',

  
  'home.button.add-widget': 'Add Widget',

  
  'home.greeting.welcome': 'Welcome to Journalit!',
  'home.greeting.hey': 'Hey',

  
  'home.greeting.nightowl': 'Hey nightowl',
  'home.greeting.still-up': 'still up?',
  'home.greeting.late-night': 'late night session?',
  'home.greeting.midnight-oil': 'burning the midnight oil?',

  
  'home.greeting.good-morning': 'Good morning',
  'home.greeting.rise-and-shine': 'Rise and shine',
  'home.greeting.morning-trader': 'Morning trader',
  'home.greeting.ready-conquer': 'ready to conquer the day?',
  'home.greeting.fresh-start': 'Fresh start',

  
  'home.greeting.good-afternoon': 'Good afternoon',
  'home.greeting.day-going-well': "Hope your day's going well",
  'home.greeting.afternoon-checkin': 'Afternoon check-in',
  'home.greeting.midday-momentum': 'Midday momentum',
  'home.greeting.hows-it-going': "how's it going?",

  
  'home.greeting.good-evening': 'Good evening',
  'home.greeting.winding-down': 'winding down?',
  'home.greeting.evening-review': 'Evening review',
  'home.greeting.how-did-today-go': 'how did today go?',
  'home.greeting.time-to-reflect': 'Time to reflect',

  
  'home.greeting.welcome-back': 'Welcome back',
  'home.greeting.name-placeholder': 'Your name',
  'home.greeting.edit-name-aria': '{name}. Edit display name',
  'home.greeting.hey-there': 'Hey there',
  'home.greeting.good-to-see-you': 'Good to see you',

  
  'home.subtitle.first-time': "Let's get you started with your trading journey",

  
  'home.subtitle.see-how-doing': "Let's see how you're doing",
  'home.subtitle.elevate-trading': 'Time to elevate your trading',
  'home.subtitle.journey-continues': 'Your trading journey continues',
  'home.subtitle.check-progress': "Let's check your progress",

  
  'home.subtitle.ready-elevate': 'Ready to elevate your trading?',
  'home.subtitle.agenda-today': "What's on the agenda today?",
  'home.subtitle.trading-going': "How's your trading going?",

  
  
  
  'home.grid.error.title': 'Grid Layout Error',
  'home.grid.error.message': 'Error: {error}',
  'home.grid.error.retry': 'Retry',
  'home.grid.widget.remove-aria': 'Remove widget',
  'home.grid.widget.unknown-type': 'Unknown widget type: {widgetId}',

  
  
  
  'home.widget.unreviewed.all-reviewed': 'All trades reviewed',
  'home.widget.unreviewed.title-review': 'Open Trade Log to review',
  'home.widget.unreviewed.need-review.one': '{count} trade needs review',
  'home.widget.unreviewed.need-review.few': '{count} trades need review',
  'home.widget.unreviewed.need-review.many': '{count} trades need review',
  'home.widget.unreviewed.need-review.other': '{count} trades need review',
  'home.widget.unreviewed.today': '{count} today',
  'home.widget.unreviewed.this-week': '{count} this week',

  
  'home.widget.embedded-note.title': 'Embedded Note',
  'home.widget.embedded-note.select-note': 'Select a Note',
  'home.widget.embedded-note.search-placeholder': 'Search notes...',
  'home.widget.embedded-note.no-notes': 'No notes found',

  'home.widget.embedded-note.open-note': 'Click to open note',
  'home.widget.embedded-note.change-note': 'Change note',
  'home.widget.embedded-note.error.not-found': 'File not found: {path}',
  'home.widget.embedded-note.error.load-failed': 'Failed to load note content',
  'home.widget.embedded-note.error.deleted': 'Source file was deleted',

  
  'home.widget.goals-progress.type.pnl': 'P&L Target',
  'home.widget.goals-progress.type.pnl-desc': 'Profit/loss goal for a period',
  'home.widget.goals-progress.type.trades-logged': 'Trade Count',
  'home.widget.goals-progress.type.trades-logged-desc': 'Lifetime trade count',
  'home.widget.goals-progress.type.win-rate': 'Win Rate',
  'home.widget.goals-progress.type.win-rate-desc': 'Winning percentage target',
  'home.widget.goals-progress.period.daily': 'Daily',
  'home.widget.goals-progress.period.weekly': 'Weekly',
  'home.widget.goals-progress.period.monthly': 'Monthly',
  'home.widget.goals-progress.period-label.today': 'today',
  'home.widget.goals-progress.period-label.this-week': 'this week',
  'home.widget.goals-progress.period-label.this-month': 'this month',
  'home.widget.goals-progress.period-label.total': 'total',
  'home.widget.goals-progress.trades-count': '{count} trades',
  'home.widget.goals-progress.set-goal': 'Set Goal',
  'home.widget.goals-progress.target': 'Target',
  'home.widget.goals-progress.tracks-lifetime': 'Tracks lifetime total',
  'home.widget.goals-progress.use-r-multiples': 'Use R-multiples',
  'home.widget.goals-progress.account-aware': 'Account-aware targets',
  'home.widget.goals-progress.no-target-selected':
    'No target for selected account',
  'home.widget.goals-progress.configured-for': 'Configured for {accounts}',
  'home.widget.goals-progress.account-scope': 'Account scope',
  'home.widget.goals-progress.add-account': 'Add account',
  'home.widget.goals-progress.click-to-set': 'Click to set a goal',
  'home.widget.goals-progress.header.pnl': 'P&L Goal',
  'home.widget.goals-progress.header.trades': 'Trades Goal',
  'home.widget.goals-progress.header.win-rate': 'Win Rate Goal',
  'home.widget.goals-progress.of-target': 'of {target} {period}',
  'home.widget.goals-progress.complete-100': '100% complete',
  'home.widget.goals-progress.complete-percent': '{percent}% complete',
  'home.widget.goals-progress.goal-reached': 'Goal reached',
  'home.widget.goals-progress.aria.save-goal': 'Save goal',
  'home.widget.goals-progress.aria.set-goal': 'Set a goal',
  'home.widget.goals-progress.aria.change-goal': 'Click to change goal',

  
  'home.widget.best-hours.title': 'Best Hours',
  'home.widget.best-hours.no-data': 'No trade data',
  'home.widget.best-hours.period-aria':
    '{label}: {pnl} average P&L per trade, {count} trades',
  'home.widget.best-hours.trades-count': '{count} trades',
  'home.widget.best-hours.win-rate': '{rate}% win',
  'home.widget.best-hours.win-rate-na': 'Win rate unavailable',
  'home.widget.best-hours.days-count': '{count} days',
  'home.widget.best-hours.avg-per-trade': 'avg/trade',

  'home.widget.best-hours.hidden': 'Hidden',
  'home.widget.best-hours.hidden-detail': 'Privacy mode',
  'home.widget.best-hours.no-positive-window': 'No positive window',
  'home.widget.best-hours.insufficient-history': 'Need more data',
  'home.widget.best-hours.sample-requirement': '{count}/2 sampled windows',
  'home.widget.best-hours.developing': 'developing',
  'home.widget.best-hours.no-positive-detail': 'Sampled windows are negative',

  
  'home.widget.aum.title': 'AUM',
  'home.widget.aum.period.month': 'This Month',
  'home.widget.aum.period.quarter': 'This Quarter',
  'home.widget.aum.period.year': 'This Year',
  'home.widget.aum.period.all': 'All Time',
  'home.widget.aum.unable-to-load': 'Unable to load',
  'home.widget.aum.no-accounts': 'No accounts',
  'home.widget.aum.account-count': '{count} account',
  'home.widget.aum.account-count-plural': '{count} accounts',

  
  'home.widget.streak.title': 'Streak',
  'home.widget.streak.period.month': 'this month',
  'home.widget.streak.period.quarter': 'this quarter',
  'home.widget.streak.period.year': 'this year',
  'home.widget.streak.period.ever': 'ever',
  'home.widget.streak.win': 'win',
  'home.widget.streak.wins': 'wins',
  'home.widget.streak.loss': 'loss',
  'home.widget.streak.losses': 'losses',
  'home.widget.streak.in-a-row': 'in a row',
  'home.widget.streak.no-active': 'no active streak',
  'home.widget.streak.start-trading': 'start trading to build a streak',
  'home.widget.streak.best-streak': 'your best streak {period}',
  'home.widget.streak.above-average': 'above your average {period}',
  'home.widget.streak.stay-focused': 'stay focused, keep it going',
  'home.widget.streak.keep-going': 'keep it going',
  'home.widget.streak.good-start': 'good start',
  'home.widget.streak.pause': 'pause before your next trade',
  'home.widget.streak.review': 'review before next trade',
  'home.widget.streak.losses-process': 'losses are part of the process',
  'home.widget.streak.best': 'best',
  'home.widget.streak.avg': 'avg',

  
  'home.widget.drawdown.title': 'Drawdown Limit',
  'home.widget.drawdown.breached': 'Breached',
  'home.widget.drawdown.remaining': 'remaining',
  'home.widget.drawdown.unable-to-load': 'Unable to load',
  'home.widget.drawdown.no-accounts': 'No accounts with limits',

  'home.widget.profit-target.title': 'Profit Target',
  'home.widget.profit-target.achieved': 'Achieved',
  'home.widget.profit-target.remaining': 'remaining',
  'home.widget.profit-target.unable-to-load': 'Unable to load',
  'home.widget.profit-target.no-accounts': 'No accounts with targets',
  'home.widget.eval-roi.title': 'Eval ROI',
  'home.widget.eval-roi.unable-to-load': 'Unable to load',
  'home.widget.eval-roi.no-challenges': 'No prop challenges',
  'home.widget.eval-roi.challenge-count': '{count} eval',
  'home.widget.eval-roi.challenge-count-plural': '{count} evals',
  'home.widget.eval-roi.net': 'Net',
  'home.widget.eval-roi.spent': 'Spent',
  'home.widget.eval-roi.payouts': 'Payouts',
  'home.widget.eval-roi.break-even': 'Break-even',
  'home.widget.challenge-alerts.title': 'Challenge Alerts',
  'home.widget.challenge-alerts.unable-to-load':
    'Could not check challenge alerts',
  'home.widget.challenge-alerts.empty': 'No challenge alerts',
  'home.widget.challenge-alerts.count': '{count} alert',
  'home.widget.challenge-alerts.count-plural': '{count} alerts',
  'home.widget.challenge-alerts.more': '+{count} more',
  'home.widget.challenge-alerts.kind.failed': 'Failed',
  'home.widget.challenge-alerts.kind.target': 'Target reached',
  'home.widget.challenge-alerts.kind.passed': 'Passed',
  'home.widget.challenge-alerts.kind.payout': 'Payout ready',
  'home.widget.challenge-alerts.kind.lost': 'Payout no longer available',
  'home.widget.challenge-alerts.kind.unknown-account': 'New account {label}',
  'home.widget.eval-roi.roi-aria': 'Return on evaluation spend',
  
  'home.widget.recent.title': 'Recent',
  'home.widget.recent.unknown': 'Unknown',
  'home.widget.recent.just-now': 'Just now',
  'home.widget.recent.minutes-ago': '{minutes}m ago',
  'home.widget.recent.hours-ago': '{hours}h ago',
  'home.widget.recent.days-ago': '{days}d ago',
  'home.widget.recent.no-items': 'No recent items yet',
  'home.widget.recent.hint': 'Open files or views to see them here',

  
  'home.widget.top-breakdown.title': 'Top {dimension}',
  'home.widget.top-breakdown.configure-title': 'Customise Top {dimension}',
  'home.widget.top-breakdown.aria.customize':
    'Click to customise Top {dimension}',
  'home.widget.setups.title': 'Top Setups',

  'home.widget.setups.trades-count': '{count} trades',
  'home.widget.setups.win-rate': '{rate}% win rate',

  
  'home.widget.weekly.title': 'This Week',
  'home.widget.weekly.no-trades': 'no trades yet this week',
  'home.widget.weekly.breakeven': 'breakeven so far this week',
  'home.widget.weekly.losing-days': '{count} losing days in a row',
  'home.widget.weekly.winning-days': '{count} winning days straight',
  'home.widget.weekly.above-average': 'above your weekly average',
  'home.widget.weekly.below-average': 'below your weekly average',
  'home.widget.weekly.better-than-last': 'better than last week',
  'home.widget.weekly.slower-than-last': 'slower than last week',
  'home.widget.weekly.on-track': 'on track this week',
  'home.widget.weekly.room-to-recover': 'room to recover',
  'home.widget.weekly.solid-start': 'solid start to the week',
  'home.widget.weekly.early-in-week': 'early in the week',
  'home.widget.weekly.no-trade-data': 'No trade data',
  'home.widget.weekly.trade': 'trade',
  'home.widget.weekly.trades': 'trades',
  'home.widget.weekly.no-trades-tooltip': 'no trades',

  
  'home.widget.heatmap.last-3-months': 'Last 3 Months',
  'home.widget.heatmap.last-6-months': 'Last 6 Months',
  'home.widget.heatmap.year-activity': '{year} Activity',
  'home.widget.heatmap.select-year': 'Select Year',
  'home.widget.heatmap.close-selector': 'Close year selector',

  
  'calendar.weekday.mon': 'Mon',
  'calendar.weekday.tue': 'Tue',
  'calendar.weekday.wed': 'Wed',
  'calendar.weekday.thu': 'Thu',
  'calendar.weekday.fri': 'Fri',
  'calendar.weekday.sat': 'Sat',
  'calendar.weekday.sun': 'Sun',
  'calendar.pnl': 'P&L',
  'calendar.week': 'WEEK',
  'calendar.trade': '{count} trade',
  'calendar.trades': '{count} trades',
  'calendar.reviewed': 'Reviewed',
  'calendar.month.january': 'January',
  'calendar.month.february': 'February',
  'calendar.month.march': 'March',
  'calendar.month.april': 'April',
  'calendar.month.june': 'June',
  'calendar.month.july': 'July',
  'calendar.month.august': 'August',
  'calendar.month.september': 'September',
  'calendar.month.october': 'October',
  'calendar.month.november': 'November',
  'calendar.month.december': 'December',

  

  
  
  
  'shared.collapsible.active-filters': '{count} active filters',

  
  
  
  'filter.modal.title': 'Advanced Filters',
  'filter.modal.active-filters': 'Active filters ({count}):',
  'filter.modal.no-active-filters': 'No active filters',
  'filter.modal.clear-all': 'Clear all',
  'filter.modal.section.trading-data': 'Trading Data',
  'filter.modal.section.classification': 'Classification',
  'filter.modal.section.trade-criteria': 'Trade Criteria',
  'filter.modal.no-setup': 'No Setup',
  'filter.modal.no-tags': 'No Tags',
  'filter.modal.no-mistakes': 'No Mistakes',
  'filter.modal.type.regular': 'Regular',
  'filter.modal.type.missed': 'Missed',
  'filter.modal.type.backtest': 'Backtest',
  'filter.summary.regular-trades': 'Regular Trades',
  'filter.modal.status.win': 'Win',
  'filter.modal.status.loss': 'Loss',
  'filter.modal.status.breakeven': 'Breakeven',
  'filter.modal.status.open': 'Open',
  'filter.modal.status.closed': 'Closed',

  'filter.modal.review-status.reviewed': 'Reviewed',
  'filter.modal.review-status.unreviewed': 'Unreviewed',
  'filter.modal.direction.long-call': 'Long/Call',
  'filter.modal.direction.short-put': 'Short/Put',
  'filter.modal.section.custom-fields': 'Custom Fields',
  'filter.modal.custom-field.n-selected': '{count} selected',
  'filter.modal.custom-field.none-available': 'No values available',

  
  
  
  'widget.checklist.title': 'Pre-Trade Checklist',
  'widget.checklist.weekly-title': 'Weekly Pre-Checklist',
  'widget.checklist.tooltip.day-only':
    'Items added here only apply to this day.',
  'widget.checklist.tooltip.weekly':
    'Items added here only apply to this week.',
  'widget.checklist.tooltip.settings-link':
    'For recurring items on all new DRCs, go to Settings > Reviews.',
  'widget.checklist.tooltip.weekly-settings-link':
    'For recurring items on all new weekly reviews, go to Settings > Reviews.',
  'widget.checklist.completed': 'completed',
  'widget.checklist.edit-item': 'Edit item',
  'widget.checklist.delete-item': 'Delete item',
  'widget.checklist.empty.preview': 'No checklist items configured',
  'widget.checklist.empty.add-one': 'No checklist items. Add one below.',
  'widget.checklist.placeholder': 'Add a new checklist item...',
  'widget.checklist.invalid-context':
    "Checklist widget requires a DRC or Weekly Review note (frontmatter type: 'drc' or 'weekly-review')",

  
  'widget.session-mistakes.title': 'Session Mistakes',
  'widget.session-mistakes.subtitle':
    'Log mistakes once for the session instead of repeating them on every trade.',

  'widget.session-mistakes.placeholder': 'Select or create mistakes',
  'widget.session-mistakes.empty': 'No session mistakes logged',

  'widget.session-mistakes.invalid-context':
    "Session Mistakes widget requires a DRC note (frontmatter type: 'drc')",

  
  'widget.directional-pnl.title.long': 'Long Trades P&L',
  'widget.directional-pnl.title.short': 'Short Trades P&L',
  'widget.directional-pnl.empty.not-enough':
    'Not enough trades for directional analysis',
  'widget.directional-pnl.empty.no-closed': 'No closed trades for this period',
  'widget.directional-pnl.empty.no-long': 'No long trades this period',
  'widget.directional-pnl.empty.no-short': 'No short trades this period',
  'widget.directional-drawdown.title.long': 'Long Drawdown',
  'widget.directional-drawdown.title.short': 'Short Drawdown',
  'widget.directional-drawdown.empty.not-enough':
    'Not enough closed trades for directional analysis',
  'widget.directional-drawdown.empty.no-closed':
    'No closed directional trades for this period',
  'widget.directional-drawdown.empty.no-long':
    'No long closed trades for this period',
  'widget.directional-drawdown.empty.no-short':
    'No short closed trades for this period',

  
  'widget.missed-trades.title': 'Missed Trades',
  'widget.missed-trades.add-button': 'Add',
  'widget.missed-trades.add-aria': 'Add missed trade',

  'widget.missed-trades.additional-setups': 'Additional Setups:',
  'widget.missed-trades.no-trades-today': 'None today',
  'widget.missed-trades.no-trades-week': 'No missed trades this week',
  'widget.missed-trades.invalid-context':
    'Missed Trades widget is only available in DRC and Weekly review notes.',
  'widget.missed-trades.error-no-date':
    'Cannot determine date for new missed trade',
  'widget.missed-trades.error-open-form': 'Failed to open missed trade form',
  'widget.backtest-trades.empty': 'No backtest trades for this period',

  
  
  
  'widget.trade-table.column.images': 'Images',
  'widget.trade-table.column.date': 'Date',
  'widget.trade-table.column.entry': 'Entry',
  'widget.trade-table.column.ticker': 'Ticker',
  'widget.trade-table.column.account': 'Account',
  'widget.trade-table.column.pnl': 'P&L',
  'widget.trade-table.column.direction': 'Direction',
  'widget.trade-table.column.setups': 'Setups',
  'widget.trade-table.column.mistakes': 'Mistakes',
  'widget.trade-table.empty': 'No trades for this period',
  'widget.trade-table.status.open': 'OPEN',
  'widget.trade-table.na': 'N/A',
  'widget.trade-table.unknown': 'Unknown',

  'widget.trade-table.image-alt': 'Trade {id} preview',
  'widget.trade-table.fullscreen-title': 'Trade {id} Image',
  'widget.trade-table.fullscreen-alt': 'Trade {id} Image {index}',
  'widget.trade-table.duration.days-hours': '{days}d {hours}h',
  'widget.trade-table.duration.hours-mins': '{hours}h {mins}m',
  'widget.trade-table.duration.mins': '{mins}m',
  'widget.trade-table.pagination.showing':
    'Showing {start}-{end} of {total} trades',
  'widget.trade-table.pagination.prev': '← Prev',
  'widget.trade-table.pagination.next': 'Next →',
  'widget.trade-table.pagination.page': 'Page {current} of {total}',

  
  'widget.pagination.showing': 'Showing {start}-{end} of {total} {items}',
  'widget.pagination.prev': 'Prev',
  'widget.pagination.next': 'Next',
  'widget.pagination.page': 'Page {current} of {total}',

  
  
  
  'widget.empty.no-data': 'No data available',
  'widget.empty.no-trades': 'No trades for this period',
  'widget.empty.no-closed-trades': 'No closed trades for this period',
  'widget.empty.no-daily-data': 'No daily data for this period',
  'widget.empty.no-weekly-data': 'No weekly data for this period',
  'widget.empty.no-monthly-data': 'No monthly data for this period',
  'widget.empty.no-quarterly-data': 'No quarterly data for this period',
  'widget.empty.no-tag-data': 'No tag data available for this period',
  'widget.empty.no-setup-data': 'No setup data available for this period',
  'widget.empty.no-mental-game-data':
    'No mental game data available for {period}',
  'widget.empty.no-technical-game-data':
    'No technical game data available for {period}',

  
  
  
  'widget.invalid-context.title': 'Invalid Context',
  'widget.invalid-context.default':
    'This {widgetType} widget requires a review or trade note',
  'widget.invalid-context.monthly-quarterly-yearly':
    'This widget is only available in Monthly, Quarterly, and Yearly reviews',
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    'This widget is only available in Weekly, Monthly, Quarterly, and Yearly reviews',
  'widget.invalid-context.quarterly-yearly':
    'This widget is only available in Quarterly and Yearly reviews',
  'widget.invalid-context.yearly-only':
    'This widget is only available in Yearly reviews',
  'widget.invalid-context.monthly-only':
    'This widget is only available in Monthly reviews',
  'widget.invalid-context.weekly-monthly':
    'This widget is only available in Weekly and Monthly reviews',
  'widget.invalid-context.review-note':
    'This widget requires a DRC, Weekly Review, Monthly Review, Quarterly Review, or Yearly Review note',

  
  
  
  'widget.key-levels.title': 'Key Levels',
  'widget.key-levels.support': 'Support',
  'widget.key-levels.resistance': 'Resistance',
  'widget.key-levels.no-levels': 'No levels defined',
  'widget.key-levels.price-placeholder': 'Price...',
  'widget.key-levels.select-importance': 'Select importance',
  'widget.key-levels.remove-level': 'Remove level',
  'widget.key-levels.invalid-context':
    'Key Levels widget requires a DRC, weekly review, or monthly review note',
  'widget.key-levels.source.weekly': 'Weekly',
  'widget.key-levels.source.monthly': 'Monthly',
  'widget.key-levels.open-source-review': 'Open {label} review',
  'widget.key-levels.importance.none': 'None',
  'widget.key-levels.importance.high': 'High',
  'widget.key-levels.importance.medium': 'Medium',
  'widget.key-levels.importance.low': 'Low',

  
  
  
  'manual-drawdown.notice.deleted': 'Snapshot deleted',
  'manual-drawdown.notice.updated': 'Snapshot updated',
  'manual-drawdown.notice.added': 'Snapshot added',
  'manual-drawdown.validation.date-required': 'Date is required',
  'manual-drawdown.validation.invalid-date': 'Please enter a valid date',
  'manual-drawdown.validation.future-date': 'Date cannot be in the future',
  'manual-drawdown.validation.limit-required': 'Drawdown limit is required',
  'manual-drawdown.validation.limit-positive':
    'Drawdown limit must be a positive number',
  'manual-drawdown.validation.duplicate-date':
    'A snapshot already exists for this date. Please choose a different date or edit the existing one.',
  'manual-drawdown.section.recorded': 'Recorded Snapshots',
  'manual-drawdown.table.date': 'Date',
  'manual-drawdown.table.limit': 'Drawdown Limit',
  'manual-drawdown.table.note': 'Note',
  'manual-drawdown.table.actions': 'Actions',
  'manual-drawdown.button.editing': 'Editing',
  'manual-drawdown.button.edit': 'Edit',
  'manual-drawdown.button.delete': 'Delete',
  'manual-drawdown.header.edit': 'Edit Snapshot',
  'manual-drawdown.header.add': 'Add New Snapshot',
  'manual-drawdown.field.date': 'Drawdown Date *',
  'manual-drawdown.field.date-desc': 'When the broker issued this limit',
  'manual-drawdown.field.limit': 'Minimum Balance ($) *',
  'manual-drawdown.field.limit-desc': 'Lowest balance allowed',
  'manual-drawdown.field.note': 'Note (Optional)',
  'manual-drawdown.field.note-desc': 'Additional context for this snapshot',
  'manual-drawdown.placeholder.note': 'e.g., End of month statement',
  'manual-drawdown.button.update': 'Update Snapshot',
  'manual-drawdown.button.add': 'Add Snapshot',
  'manual-drawdown.button.cancel-edit': 'Cancel Edit',
  'manual-drawdown.modal.delete-title': 'Delete Snapshot?',
  'manual-drawdown.modal.delete-confirm':
    'Delete drawdown snapshot from {date}?',
  'manual-drawdown.modal.delete-limit': 'Drawdown limit: {limit}',
  'manual-drawdown.modal.delete-warning': 'This action cannot be undone.',

  
  
  
  'dashboard.selector.title': 'Add to Dashboard',
  'dashboard.selector.metrics': 'Metrics',
  'dashboard.selector.charts': 'Charts',
  'dashboard.selector.empty': 'All metrics and charts have been added',
  'dashboard.selector.hint.navigate': '↑↓ navigate',
  'dashboard.selector.hint.select': '↵ select',
  'dashboard.selector.hint.close': 'esc close',

  'dashboard.component-selector.category.performance': 'Performance',

  'dashboard.component-selector.category.journal': 'Journal',

  
  'widget.pnlChart.name': 'Cumulative P&L',

  'widget.longPnLChart.name': 'Long P&L',
  'widget.longPnLChart.description':
    'Cumulative P&L curve for long closed trades only',
  'widget.shortPnLChart.name': 'Short P&L',
  'widget.shortPnLChart.description':
    'Cumulative P&L curve for short closed trades only',
  'widget.performanceCalendar.name': 'Performance Calendar',

  'widget.dailyPerformance.name': 'Daily Performance',

  'widget.tradesChart.name': 'Trades Chart',
  'widget.mfeScatter.name': 'MFE vs Realized PnL',
  'widget.mfeScatter.description':
    'Maximum favorable excursion versus net realized PnL for closed trades',
  'widget.mfeScatter.y': 'Realized PnL ({unit})',
  'widget.mfeScatter.winners': 'Winners',
  'widget.mfeScatter.losers': 'Losers',
  'widget.mfeScatter.breakeven': 'Breakeven',
  'widget.mfeScatter.empty': 'No closed trades with usable MFE in this unit.',

  'widget.weekdayPerformance.name': 'Weekday Performance',

  'widget.hourlyPerformance.name': 'Hourly Performance',

  'widget.tickerPerformance.name': 'Ticker Performance',
  'widget.tickerPerformance.description':
    'Ranked bar chart comparing performance by ticker',
  'widget.tradesChart.limit': '{count} Trades',
  'widget.drawdownChart.name': 'Drawdown Chart',

  'widget.directionalDrawdownChart.name': 'Directional Realized Drawdown',

  'widget.longDrawdownChart.name': 'Long Drawdown',

  'widget.shortDrawdownChart.name': 'Short Drawdown',

  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',
  'widget.recentTrades.name': 'Recent Trades',
  'widget.recentTrades.description':
    'Shows the 10 most recent trades with details',
  'widget.recentTrades.date': 'Date',
  'widget.recentTrades.ticker': 'Ticker',
  'widget.recentTrades.direction': 'Direction',
  'widget.recentTrades.pnl': 'P&L',
  'widget.recentTrades.no-trades': 'No trades found',
  'widget.recentTrades.empty-submessage':
    'Try selecting a different date range',
  'widget.recentTrades.unknown': 'Unknown',
  'widget.rollingWinRate.name': 'Rolling Win/Loss Ratio',

  'widget.rollingStats.name': 'Rolling Avg Win/Loss',

  
  
  

  
  
  
  'filter.chip.remove-aria': 'Remove {label} filter',
  'shared.filter.disabled-preview': 'Filters disabled in preview',
  'shared.filter.open': 'Open filters',
  'shared.filter.active-count': '{count} active filters',

  
  
  
  'ui.toggle-switch.aria-label': 'Toggle switch',
  'ui.folder-browser.placeholder': 'Select a folder...',
  'ui.folder-browser.root': 'Root',
  'ui.folder-browser.clear-aria': 'Clear to use default location',
  'ui.folder-browser.expand-folder': 'Expand folder',
  'ui.folder-browser.collapse-folder': 'Collapse folder',

  
  
  

  
  
  
  'combobox.placeholder.default': 'Select or type...',
  'combobox.aria.remove-item': 'Remove {item}',
  'combobox.add-option': 'Add "{value}"',

  
  
  

  
  'error.render-component': 'Error rendering {component}: {error}',

  
  'error.session-expired':
    'Your session has expired. Please sign in again in plugin settings.',
  'error.ftp-not-found':
    'FTP account not found. The system will automatically create one for you.',
  'error.no-trading-data':
    'No trading data found. Please ensure your MetaTrader account is properly connected and has trade history.',
  'error.unable-connect-service':
    'Unable to connect to trading data service. Please check your internet connection.',
  'error.invalid-verification-code':
    'Invalid verification code. Please check the code and try again.',
  'error.invalid-registration-data':
    'Invalid registration data. Please check your settings and try again.',
  'error.invalid-request':
    'Invalid request. Please check your input and try again.',
  'error.access-denied':
    'Access denied. Please check your account permissions or contact support.',
  'error.too-many-requests':
    'Too many requests. Please wait a moment before trying again.',
  'error.service-unavailable':
    'Trading data service is temporarily unavailable. Please try again in a few minutes.',
  'error.server-error':
    'Server error occurred. Please try again later or contact support if the problem persists.',
  'error.network-error':
    'Cannot connect to trading data service. Please check your internet connection and try again.',
  'error.unknown': 'Unknown error occurred',
  'error.unexpected':
    'An unexpected error occurred. Please try again or contact support if the problem persists.',

  
  'error.settings.invalid-pattern':
    'Invalid validation pattern. Please check your regular expression and try again.',
  'error.settings.field-name-conflict':
    'This field name conflicts with an existing field. Please choose a different name.',
  'error.settings.invalid-field-name':
    'Invalid field name. Field names can only contain letters, numbers, and underscores.',
  'error.settings.save-failed':
    'Unable to save your changes. Please check your settings and try again.',
  'error.settings.load-failed':
    'Unable to load custom field settings. Your custom fields may not display correctly.',
  'error.settings.import-failed':
    'Unable to import field settings. Please check the file format and try again.',
  'error.settings.create-failed':
    'Unable to create the custom field. Please check your input and try again.',
  'error.settings.remove-failed':
    'Unable to remove the custom field. Please try again.',
  'error.settings.generic':
    'An error occurred while managing custom fields. Please check your settings and try again.',

  
  'error.options.duplicate':
    'This option already exists. Please choose a different name.',
  'error.options.invalid-ticker':
    'Invalid ticker symbol. Use only letters, numbers, and periods (e.g., AAPL, SPX).',
  'error.options.add-ticker-failed':
    'Unable to add ticker symbol. Please check the format and try again.',
  'error.options.add-failed':
    'Unable to add option. It may already exist or be invalid.',
  'error.options.update-failed':
    'Unable to update option. It may already exist or be invalid.',
  'error.options.remove-failed': 'Unable to remove option. Please try again.',
  'error.options.no-options-reset':
    'No options to reset. The category is already empty.',
  'error.options.reset-failed': 'Unable to reset options. Please try again.',
  'error.options.save-failed':
    'Unable to save option changes. Please check your settings and try again.',
  'error.options.generic':
    'An error occurred while managing options. Please try again.',

  
  'error.clipboard.permission-denied':
    'Clipboard access denied. Please allow clipboard permissions in your browser for paste functionality.',
  'error.clipboard.not-supported':
    'Clipboard paste is not supported in your browser. Try using Ctrl+V or Cmd+V instead.',
  'error.clipboard.image-too-large':
    'Image is too large to paste. Please use images smaller than 10MB.',
  'error.clipboard.no-content':
    'Nothing found in clipboard to paste. Try copying an image first.',
  'error.clipboard.no-images':
    'No images found in clipboard. Make sure you copied an image, not text or other content.',
  'error.clipboard.no-target':
    'No image upload area found. Click on an image upload area first, then paste your image.',
  'error.clipboard.network-error':
    'Network error occurred while processing paste. Please check your connection and try again.',
  'error.clipboard.paste-failed':
    'Unable to complete paste operation. Please try copying the image again and pasting.',
  'error.clipboard.generic':
    'Clipboard operation failed. Please try copying your content again and pasting.',

  
  
  

  'datetime.aria.open-picker': 'Open date picker',

  
  
  
  'modal.template-switch.title': 'Switch Layout?',
  'modal.template-switch.switching-from': "You're switching from",
  'modal.template-switch.switching-to': 'to',
  'modal.template-switch.has-content-title': 'This note has content',
  'modal.template-switch.has-content-desc':
    "Content will be reorganized to fit the new layout. Any content that doesn't fit will be preserved at the bottom of the note for you to review.",
  'modal.template-switch.cannot-undo':
    'This cannot be undone (but you can switch back).',
  'modal.template-switch.button.switch': 'Switch Layout',

  
  
  

  
  
  

  
  
  
  'release-notes.title': 'Release Notes',
  'release-notes.loading-plugin': 'Loading plugin...',

  'release-notes.no-content': 'No release notes found',
  'release-notes.current-version': 'Current: v{version}',
  'release-notes.version': 'Version {version}',
  'release-notes.link.docs': 'Docs',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',

  
  
  
  'skeleton.tradelog.loading': 'Loading trade data',
  'skeleton.dashboard-widget.loading': 'Loading widget data',
  'skeleton.account-page.loading': 'Loading account page',

  'grid.aria.remove-widget': 'Remove widget',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description': 'Fills widget CSV export',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Open the Fills widget in TT and switch to Detail, Continuous, or Price with Detail view',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Important:',

  'trade.metadata.broker-comment': 'Broker Comment',

  
  
  
  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'Performance Calendar',
  'navigation.section.overview': 'Overview',
  'navigation.section.reviews': 'Reviews',
  'navigation.section.tools': 'Tools',
  'navigation.edit-mode.toggle': 'Customise navigation',
  'navigation.edit-mode.hide-item': 'Hide navigation item',
  'navigation.edit-mode.restore-section': 'Hidden Items',
  'navigation.edit-mode.restore': 'Restore',
  'navigation.items.nav-settings': 'Settings',
  'navigation.shortcuts.add': 'Add shortcut',
  'navigation.shortcuts.remove': 'Remove shortcut',
  'navigation.shortcuts.close': 'Close shortcut picker',
  'navigation.shortcuts.search': 'Search accounts and setups',
  'navigation.shortcuts.accounts': 'Accounts',
  'navigation.shortcuts.setups': 'Setups',
  'navigation.shortcuts.empty': 'No accounts or setups available',
  'navigation.shortcuts.unavailable': 'Unavailable',
  'navigation.shortcuts.added': 'Added',
  'navigation.shortcuts.parent-required':
    'Remove its shortcuts before hiding this navigation item.',
  'navigation.items.nav-home': 'Home',
  'navigation.items.nav-dashboard': 'Dashboard',
  'navigation.items.nav-trade-log': 'Trade Log',
  'navigation.items.nav-account-dashboard': 'Accounts',
  'navigation.items.nav-drc': "Today's DRC",
  'navigation.items.nav-weekly': "This Week's Review",
  'navigation.items.nav-monthly': "This Month's Review",
  'navigation.items.nav-quarterly': "This Quarter's Review",
  'navigation.items.nav-yearly': "This Year's Review",
  'navigation.items.nav-add-trade': 'Add Trade',
  'navigation.items.nav-layout-builder': 'Layout Builder',
  'navigation.items.nav-quick-import': 'Quick Import',
  'navigation.items.nav-sync-trades': 'Sync Trades',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-session-mode': 'Session Mode',
  'navigation.items.nav-economic-calendar': 'Economic Calendar',
  'navigation.items.nav-position-size': 'Position Size Calculator',
  'settings.general.navigation-sidebar': 'Navigation Sidebar',
  'notice.error.open-navigation-sidebar':
    'Failed to open the navigation sidebar. Please try again.',
  'navigation.setting.open': 'Open navigation sidebar',
  'navigation.setting.open.desc':
    "Reveal it now and expand Obsidian's sidebar if it is collapsed.",
  'navigation.setting.open.button': 'Open Sidebar',
  'calendar.setting.open': 'Open calendar',
  'calendar.setting.open.button': 'Open Calendar',
  'notice.error.open-calendar-sidebar':
    'Failed to open the calendar. Please try again.',
  'navigation.setting.tab-behavior': 'Navigation tab behavior',
  'navigation.setting.tab-behavior.desc':
    'How to open views and reviews from Journalit sidebars',
  'navigation.setting.tab-behavior.new-tab': 'Open in new tab',
  'navigation.setting.tab-behavior.replace': 'Replace active tab',
  'navigation.search.placeholder': 'Search trades & reviews...',
  'navigation.search.clear': 'Clear search',
  'navigation.search.section.trades': 'Trades',
  'navigation.search.section.reviews': 'Reviews',
  'navigation.search.empty': 'No results found',
  'navigation.search.trade-open': 'Open',

  'command.open-navigation-sidebar': 'Open navigation sidebar',
  'command.open-calendar-sidebar': 'Open calendar sidebar',
  'command.open-economic-calendar': 'Open economic calendar',
  'widget.previous-trading-day-context.name': 'Previous Trading Day Context',
  'widget.previous-trading-day-context.description':
    'Read-only context pulled from headings in the previous DRC',
  'widget.previous-trading-day-context.reference-label': 'Previous DRC',
  'widget.previous-trading-day-context.open-source': 'Open',
  'widget.previous-trading-day-context.image-alt-prefix': 'Previous DRC image',
  'widget.previous-trading-day-context.no-sections-configured':
    'Choose at least one section in the layout settings.',
  'widget.previous-trading-day-context.preview-note':
    'Yesterday price swept liquidity, rejected from the weekly level, and closed back inside the planned range.',
  'widget.previous-trading-day-context.preview-bullet-two':
    'Main deviation: entered before confirmation on the first pullback.',
  'widget.previous-trading-day-context.preview-source':
    'Preview: previous DRC from the prior trading day',
  'widget.previous-trading-day-context.preview-bullet-one':
    'Daily bias matched the plan after the opening drive.',
  'widget.weekly-drc-context.name': 'Daily Reviews by Weekday',
  'widget.weekly-drc-context.description':
    'Show selected DRC sections for each day in the weekly review',

  'widget.weekly-drc-context.image-alt-prefix': 'Weekly DRC image',
  'widget.weekly-drc-context.no-activity': 'No activity for this day.',
  'widget.weekly-drc-context.no-sections-configured':
    'Choose at least one DRC section in the layout settings.',
  'widget.weekly-drc-context.current-week-not-found':
    'Current weekly review not found.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'Current weekly review date not found.',
  'widget.weekly-drc-context.load-error': 'Failed to load weekly DRC review.',
  'widget.weekly-drc-context.invalid-context':
    'This widget is only available in Weekly Review notes',
  'templateEditor.widget.weekly-drc-day-label': 'Day',

  'templateEditor.widget.weekly-drc-start-collapsed': 'Start collapsed',
  'templateEditor.widget.weekly-drc-day-all': 'All days',

  'templateEditor.widget.previous-context-sections-label':
    'Sections to include',
  'templateEditor.widget.previous-context-heading-label':
    'Previous DRC section heading',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Choose a heading',
  'templateEditor.widget.review-context-fields.selection': 'Fields to display',
  'templateEditor.widget.review-context-fields.selection.all': 'All fields',
  'templateEditor.widget.review-context-fields.selection.group': 'Field group',
  'templateEditor.widget.review-context-fields.selection.fields':
    'Specific fields',
  'templateEditor.widget.review-context-fields.group': 'Group',
  'templateEditor.widget.review-context-fields.group-placeholder':
    'Select group',
  'templateEditor.widget.review-context-fields.fields': 'Fields',
  'templateEditor.widget.review-context-fields.fields-placeholder':
    'Select fields',
  'templateEditor.widget.review-context-fields.fields-selected':
    '{count} fields selected',
  'templateEditor.widget.review-context-fields.no-fields':
    'Create review fields in Settings first.',

  'templateEditor.widget.review-context-fields.context': 'Context',
  'templateEditor.widget.review-context-fields.context.both': 'Both',
  'templateEditor.widget.review-context-fields.inherited': 'Inherited',
  'templateEditor.widget.review-context-fields.current': 'Current',
  'templateEditor.widget.review-context-fields.empty-values': 'Empty values',
  'templateEditor.widget.review-context-fields.hide-empty': 'Hide empty values',
  'templateEditor.widget.trade-review.primary-metrics': 'Primary metrics',
  'templateEditor.widget.trade-review.classification': 'Classification',
  'templateEditor.widget.trade-review.more-context': 'More context',
  'templateEditor.widget.trade-review.display': 'Display',
  'templateEditor.widget.trade-review.show-images': 'Show images',
  'templateEditor.widget.trade-review.fields-none': 'No fields',
  'templateEditor.widget.trade-review.fields-all': 'All fields',
  'templateEditor.widget.trade-review.fields-count': '{count} fields',
  'templateEditor.widget.trade-review.no-fields': 'No fields available',
  'templateEditor.widget.trade-review.questions': 'Review questions',
  'templateEditor.widget.trade-review.questions-help':
    'Choose the prompts shown for each trade outcome. Question IDs remain stable so saved answers stay connected when you edit or reorder prompts.',
  'templateEditor.widget.trade-review.outcome.win': 'Wins',
  'templateEditor.widget.trade-review.outcome.loss': 'Losses',
  'templateEditor.widget.trade-review.outcome.breakeven': 'Breakeven',
  'templateEditor.widget.trade-review.outcome.open': 'Open',
  'templateEditor.widget.trade-review.questions-empty':
    'No questions for this outcome.',
  'templateEditor.widget.trade-review.question-label': 'Question',
  'templateEditor.widget.trade-review.question-placeholder':
    'Type a review question',
  'templateEditor.widget.trade-review.answer-placeholder-label':
    'Answer placeholder',
  'templateEditor.widget.trade-review.answer-placeholder':
    'Optional prompt shown in the answer field',
  'templateEditor.widget.trade-review.add-question': '+ Add question',
  'templateEditor.widget.trade-review.answer-type-label': 'Answer type',
  'templateEditor.widget.trade-review.answer-type-text': 'Text',
  'templateEditor.widget.trade-review.answer-type-choice': 'Choice',
  'templateEditor.widget.trade-review.option-placeholder': 'Option label',
  'templateEditor.widget.trade-review.add-option': '+ Add option',
  'templateEditor.widget.trade-review.condition-label': 'Show when',
  'templateEditor.widget.trade-review.condition-always': 'Always shown',
  'templateEditor.widget.trade-review.condition-option-label':
    'When Q{questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section': '+ Add section',

  'templateEditor.widget.previous-context-fallback-label':
    'Previous DRC fallback',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Nearest earlier DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Expected previous trading day only',
  'calendar.aria.open-daily-review': 'Open daily review for {date}',
  'calendar.aria.open-weekly-review': 'Open weekly review for {date}',
  'calendar.aria.open-monthly-review': 'Open monthly review for {date}',
  'calendar.aria.open-quarterly-review': 'Open quarterly review for {date}',

  'csv.mapper.aria.map-column': 'Map column {header}',
  'command.quick-import-trades': 'Quick import trades',
  'command.sync-trades-now': 'Sync Trades',
  'trade-import.error.file-empty':
    'This file is empty. Export the file again and try again.',
  'trade-import.error.file-too-large':
    'Selected file exceeds the Trade Import size limit',
  'trade-import.error.file-type-unsupported':
    'Selected file type is not supported by Trade Import',
  'trade-import.error.broker-file-type-unsupported':
    'Selected broker does not support this file type',
  
  'quick-import.title': 'Quick Import',
  'quick-import.subtitle':
    'Use your favorite Trade Import setup to preview and import a file faster.',
  'quick-import.gate.sign-in':
    'Sign in or create a free Journalit account to preview files in Trade Import. Pro is only required when you import the trades.',
  'quick-import.gate.sign-in-cta': 'Sign in to preview free',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
  'quick-import.gate.preview-free': 'Preview your file free',
  'quick-import.message.needs-setup':
    'Choose a favorite broker or template in Trade Import before using Quick Import.',
  'quick-import.message.capabilities-failed':
    'Quick Import setup could not be loaded.',
  'quick-import.message.mapping-required':
    'This file needs column mapping. Open the full Trade Import flow to review mappings.',
  'quick-import.message.preview-failed':
    'This file needs review in the full Trade Import flow.',
  'quick-import.message.no-importable':
    'No importable trades were found. Review this file in Trade Import for details.',

  'quick-import.privacy-note':
    'Files are uploaded to Journalit servers for processing and are not stored by default.',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',

  'quick-import.status.checking-subscription':
    'Checking subscription status...',
  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
  'quick-import.processing.sent-to-server':
    'Uploaded to Journalit for private processing',
  'quick-import.file.selected': 'Selected file',
  'quick-import.file.processed': 'Processed and ready to write to your vault',
  'quick-import.summary.title': 'Ready to import',

  'quick-import.summary.to-import': 'To import',
  'quick-import.summary.duplicates': 'Duplicates',
  'quick-import.summary.failed': 'Needs review',
  'quick-import.summary.failed-rows': 'Rows not imported',
  'quick-import.summary.incomplete-rows': 'Incomplete rows skipped',
  'quick-import.complete.title': 'Import complete',
  'quick-import.complete.message':
    '{written} written, {duplicates} duplicates, {failed} need review.',
  'quick-import.action.open-full': 'Open full Trade Import',
  'quick-import.action.review-in-trade-import': 'Review in Trade Import',
  'quick-import.action.setup-in-trade-import': 'Set up in Trade Import',
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import': 'Import trades',
  'quick-import.action.import-count.one': 'Import {count} trade',
  'quick-import.action.import-count.few': 'Import {count} trades',
  'quick-import.action.import-count.many': 'Import {count} trades',
  'quick-import.action.import-count.other': 'Import {count} trades',
  'quick-import.preview.more': '+ {count} more processed trades',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.open-failed': 'Unable to open Trade Import',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.notice.free-preview-rate-limited':
    'Free preview limit reached. Start PRO or try again in about {minutes} minutes.',
  'trade-import.notice.free-preview-storage-limit-reached':
    'Free preview storage can hold up to {limit} trades. You have {storedItems} stored, and this file would add {requestedItems}. Wait for an earlier preview to expire or start PRO.',
  'trade-import.preview-error.guidance':
    'Check that every required field is mapped, the selected date format matches your file, and numeric columns contain valid trade values.',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': 'Trade',
  'trade-import.gate.brand-right': 'Import',
  'trade-import.gate.sign-in.title': 'Preview your trading history free',
  'trade-import.gate.sign-in':
    'Sign in or create a free Journalit account to analyse your file. Pro is only required when you import the trades.',
  'trade-import.gate.sign-in.reassurance':
    'Your file is processed privately and is not stored by default.',
  'trade-import.gate.sign-in.no-trial':
    'No Pro trial is required to analyse and preview.',
  'trade-import.gate.sign-in.cta': 'Sign in to preview free',

  'trade-import.step.select': 'Upload',
  'trade-import.step.privacy': 'Privacy note',
  'trade-import.step.analyse': 'Review',
  'trade-import.step.preview': 'Import',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': 'Export source / platform',
  'trade-import.label.asset-type': 'Asset type',
  'trade-import.asset.stock': 'Stock',
  'trade-import.asset.options': 'Options',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.label.manual-mode': 'Manual mode',
  'trade-import.manual-mode.price-based': 'Price based',
  'trade-import.manual-mode.direct-pnl': 'Direct P&L',
  'trade-import.label.ai-mapping': 'Request AI mapping suggestions',
  'trade-import.privacy.copy':
    'Trade Import uploads the selected broker export to Journalit servers for processing. Broker exports may contain account identifiers, trade history, symbols, timestamps, prices, quantities, fees, balances, and P&L. For preview generation, Journalit also sends your selected account name, mapping/template choices, custom field definitions and saved options, and limited local open-trade context for IBKR open-position matching. Raw files are processed for this import and are not stored by default.',

  'trade-import.action.analyse': 'Analyse file',
  'trade-import.action.choose-file': 'Click to upload or drag and drop',
  'trade-import.guide.prompt': 'Not sure what to export?',
  'trade-import.guide.link': 'View export guide',
  'trade-import.action.drop-file': 'Drop file to upload',
  'trade-import.analyse.detected':
    'Detected {fileType}. Headers and sample rows are returned by the backend.',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Sheet',
  'trade-import.label.header-row': 'Header row',
  'trade-import.placeholder.auto': 'Auto',
  'trade-import.label.date-format': 'Date format',

  'trade-import.label.save-template': 'Save mapping template',
  'trade-import.placeholder.template-name': 'Template name',
  'trade-import.action.save-template': 'Save template',
  'trade-import.action.preview': 'Generate preview',

  'trade-import.preview.found.one': 'We found {count} trade',
  'trade-import.preview.found.few': 'We found {count} trades',
  'trade-import.preview.found.many': 'We found {count} trades',
  'trade-import.preview.found.other': 'We found {count} trades',
  'trade-import.preview.date-range': '{start}–{end}',
  'trade-import.preview.metric.symbols': 'Symbols',
  'trade-import.preview.metric.ready': 'Ready to import',
  'trade-import.preview.metric.duplicates': 'Possible duplicates',
  'trade-import.preview.metric.attention': 'Need attention',
  'trade-import.preview.completed.message': 'Trades ready to import: {count}.',
  'trade-import.preview.partial.message':
    'Trades ready: {count}. Rows not imported: {failed}. Incomplete rows skipped: {incomplete}.',
  'trade-import.preview.partial.guidance':
    'Only the valid trades shown below will be imported.',

  'trade-import.preview.failed.message':
    'No trades could be prepared from this file.',
  'trade-import.preview.failed.guidance':
    'Review the column mappings, date format, selected sheet and header row, and any invalid values below.',
  'trade-import.preview.tradovate-performance.title': 'Wrong Tradovate report',
  'trade-import.preview.tradovate-performance.message':
    'This looks like a Tradovate Performance export. Journalit imports the Orders report so it can reconstruct your executions accurately. In Tradovate, go to Reports > Orders and download the CSV.',
  'trade-import.preview.tradovate-performance.guide':
    'View Tradovate export guide',
  'trade-import.preview.metatrader-statement.title':
    'Unsupported MetaTrader statement',
  'trade-import.preview.metatrader-statement.message':
    'Journalit imports the original MetaTrader account-history report. Set MetaTrader to English, open Account History / History, choose Save as Report, then upload the original .html or .htm file without editing or converting it.',
  'trade-import.preview.metatrader-statement.guide':
    'View MetaTrader export guide',
  'trade-import.preview.tradingview-export.title': 'Wrong TradingView export',
  'trade-import.preview.tradingview-export.message':
    'Journalit expects the TradingView Paper Trading Order History / History CSV. Do not use Account History, chart data, strategy exports, or other TradingView CSV files.',
  'trade-import.preview.tradingview-export.guide':
    'View TradingView export guide',
  'trade-import.source-recovery.deepcharts.title':
    'This file looks like a DeepCharts export',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    'The file came from DeepCharts even if the account executes through Rithmic. Use DeepCharts so signed Quantity determines long or short correctly.',
  'trade-import.source-recovery.deepcharts.manual-message':
    'Use the DeepCharts importer. DeepCharts stores direction in signed Quantity, so Quantity should not be mapped as a Manual Direction field.',
  'trade-import.source-recovery.deepcharts.switch': 'Switch to DeepCharts',
  'trade-import.source-recovery.deepcharts.guide':
    'View DeepCharts export guide',
  'trade-import.source-recovery.motivewave.title':
    'This file looks like a MotiveWave execution export',
  'trade-import.source-recovery.motivewave.message':
    'Use MotiveWave so Journalit can pair the execution rows into completed trades correctly.',
  'trade-import.source-recovery.motivewave.switch': 'Switch to MotiveWave',
  'trade-import.source-recovery.motivewave.guide':
    'View MotiveWave export guide',
  'quick-import.message.source-mismatch':
    'Journalit identified a different export source. Review it in Trade Import to switch sources without uploading the file again.',
  'trade-import.preview.no-eligible':
    'The file parsed successfully, but no new or updated trades are eligible to import. Review duplicate and classification details below.',
  'trade-import.pro-gate.title.one': '{count} trade is ready to import',
  'trade-import.pro-gate.title.few': '{count} trades are ready to import',
  'trade-import.pro-gate.title.many': '{count} trades are ready to import',
  'trade-import.pro-gate.title.other': '{count} trades are ready to import',
  'trade-import.pro-gate.subtitle':
    'Activate PRO to write them to your vault as trade notes.',
  'trade-import.pro-gate.cta': 'Activate PRO',
  'trade-import.preview.diagnostics': 'Review details ({count})',
  'trade-import.preview.affected-rows': 'Affected rows: {count}',

  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Entry time',
  'trade-import.table.date': 'Date',
  'trade-import.table.quantity': 'Quantity',
  'trade-import.table.position': 'Position',
  'trade-import.table.result': 'Result',
  'trade-import.table.message': 'Message',
  'trade-import.action.confirm': 'Confirm import',
  'trade-import.action.activate-pro.one':
    'Activate PRO to import {count} trade',
  'trade-import.action.activate-pro.few':
    'Activate PRO to import {count} trades',
  'trade-import.action.activate-pro.many':
    'Activate PRO to import {count} trades',
  'trade-import.action.activate-pro.other':
    'Activate PRO to import {count} trades',
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',

  'home.quick-links.quick-import': 'Quick Import',
  'home.quick-links.sync-trades': 'Sync Trades',

  
  'home.quick-links.setups': 'Setups',
  'command.open-setups': 'Open Setups',
  'setups.view.loading': 'Loading setups…',
  'setups.view.error.title': 'Could not load setups',
  'setups.view.error.load-failed': 'Failed to load setup data.',
  'setups.view.action.retry': 'Retry',

  'setups.view.action.create': 'Create setup',
  'setups.view.action.new': 'New setup',
  'setups.create.title': 'Create Setup',
  'setups.create.field.name': 'Setup Name',
  'setups.create.placeholder.name': 'Opening Drive',
  'setups.create.field.status': 'Status',
  'setups.create.field.direction': 'Direction',
  'setups.create.field.color': 'Color',
  'setups.create.field.color-description':
    'Choose a color to identify this setup.',
  'setups.create.field.tags': 'Tags',
  'setups.create.placeholder.tags': 'Momentum, Breakout, Morning',
  'setups.create.profile.heading': 'Preferred fields',
  'setups.create.profile.optional-label': '(Optional)',
  'setups.create.field.sessions': 'Sessions',
  'setups.create.field.preferred-sessions-tooltip':
    'Manage these sessions in Settings → Journal → Session Mode.',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': 'Timeframes',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'Tickers',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
  'setups.create.direction.any': 'Not specified',
  'setups.create.direction.long': 'Long',
  'setups.create.direction.short': 'Short',
  'setups.create.direction.both': 'Both',
  'setups.create.field.linked-notes': 'Linked Notes',
  'setups.create.field.linked-notes-desc':
    'Attach existing notes that document the playbook for this setup.',
  'setups.create.linked-notes.empty': 'No notes linked yet.',
  'setups.create.linked-notes.add': '+ Link note',
  'setups.create.linked-notes.remove': 'Remove linked note',
  'setups.create.linked-notes.picker-title': 'Choose a playbook note',
  'setups.create.linked-notes.search': 'Search notes...',
  'setups.create.linked-notes.no-notes': 'No markdown notes found.',
  'setups.create.button.creating': 'Creating...',
  'setups.create.button.create': 'Create Setup',
  'setups.create.success': 'Setup "{name}" created successfully',
  'setups.create.error.name-required': 'Setup name is required',
  'setups.create.error.tag-save-failed':
    'The tag could not be saved to your global tag list.',
  'setups.create.error.failed': 'Failed to create setup',
  'setups.edit.title': 'Edit Setup',
  'setups.edit.button.saving': 'Saving...',
  'setups.edit.button.save': 'Save Setup',
  'setups.edit.button.rename-and-update': 'Rename and update trades',
  'setups.edit.rename-warning.title': 'Rename setup and update trades',
  'setups.edit.rename-warning.message':
    'Renaming {oldName} to {newName} will update trade notes that use the old setup name.',
  'setups.edit.delete.button': 'Delete setup',
  'setups.edit.delete.title': 'Delete setup',
  'setups.edit.delete.confirm': 'Confirm delete',
  'setups.edit.delete.warning':
    'Deleting "{name}" permanently removes the setup and clears it from linked trades. This cannot be undone.',
  'setups.edit.delete.success': 'Deleted setup "{name}"',
  'setups.edit.delete.error': 'Failed to delete setup',
  'setups.edit.success': 'Setup "{name}" updated successfully',
  'setups.edit.error.failed': 'Failed to update setup',
  'setups.view.action.compare-selected': 'Compare selected setups',
  'setups.view.tabs.aria': 'Setup view tabs',
  'setups.view.tab.overview': 'Overview',
  'setups.view.tab.compare': 'Compare',
  'setups.view.card.select-for-compare': 'Select setup for comparison',

  'setups.view.compare.title': 'Compare setups',

  'setups.view.compare.empty': 'Select two setups to compare.',
  'setups.view.compare.empty-submessage':
    'Choose two setup cards from the overview to build a side-by-side report.',
  'setups.view.compare.metrics-title': 'Comparison metrics',
  'setups.view.compare.metric': 'Metric',
  'setups.view.compare.edge-column': 'Edge',
  'setups.view.compare.edge-label': 'Winner',

  'setups.view.compare.no-clear-edge': 'No clear edge',
  'setups.view.compare.expectancy-edge': 'Expectancy edge',
  'setups.view.compare.confidence': 'Confidence',
  'setups.view.compare.sample': 'Sample',
  'setups.view.compare.confidence.high': 'High',
  'setups.view.compare.confidence.moderate': 'Moderate',
  'setups.view.compare.confidence.low': 'Low',
  'setups.view.compare.edge-strength.strong': 'Strong edge',
  'setups.view.compare.edge-strength.clear': 'Clear edge',
  'setups.view.compare.edge-strength.slight': 'Slight edge',
  'setups.view.compare.edge-reasons-privacy':
    'Edge details are hidden while Privacy Mode is on.',
  'setups.view.compare.reason.higher.net-pnl': 'Higher Net PnL',
  'setups.view.compare.reason.lower.net-pnl': 'Lower Net PnL',
  'setups.view.compare.reason.similar.net-pnl': 'Similar Net PnL',
  'setups.view.compare.reason.higher.total-r': 'Higher Total R',
  'setups.view.compare.reason.lower.total-r': 'Lower Total R',
  'setups.view.compare.reason.similar.total-r': 'Similar Total R',
  'setups.view.compare.reason.higher.win-rate': 'Higher Win Rate',
  'setups.view.compare.reason.lower.win-rate': 'Lower Win Rate',
  'setups.view.compare.reason.similar.win-rate': 'Similar Win Rate',
  'setups.view.compare.reason.higher.expectancy': 'Higher Expectancy',
  'setups.view.compare.reason.lower.expectancy': 'Lower Expectancy',
  'setups.view.compare.reason.similar.expectancy': 'Similar Expectancy',
  'setups.view.compare.reason.higher.profit-factor': 'Higher Profit Factor',
  'setups.view.compare.reason.lower.profit-factor': 'Lower Profit Factor',
  'setups.view.compare.reason.similar.profit-factor': 'Similar Profit Factor',

  'setups.view.compare.cumulative-title': 'Cumulative performance',
  'setups.view.compare.cumulative-privacy':
    'Cumulative performance is hidden while Privacy Mode is on.',
  'setups.view.compare.cumulative-empty':
    'No cumulative trade data for the selected setups.',

  'setups.view.trade.unknown-instrument': 'Unknown instrument',

  'setups.guide.create-new-setup.title': 'Create new setups',
  'setups.guide.create-new-setup.description':
    'Use New setup when you want to add another playbook. The modal walks you through its details, tags, linked notes, and rules.',
  'setups.guide.detail-intro.title': 'This is the setup page',
  'setups.guide.detail-intro.description':
    'This setup page brings one tagged playbook into focus with its performance chart, context panel, reference material, actions, and execution rules.',
  'setups.guide.detail-actions.title': 'Setup actions',
  'setups.guide.detail-actions.description':
    'Use these buttons to open related trades or edit the setup, including its details, linked notes, screenshots, and playbook rules.',
  'setups.guide.empty.create-setup.title': 'Start with New setup',
  'setups.guide.empty.create-setup.description':
    'Create one setup first. After it exists, this guide will continue with the normal setup walkthrough.',

  'setups.guide.intro.title': 'Welcome to Setups',
  'setups.guide.intro.description':
    'This view brings your setup playbooks, linked trades, notes, screenshots, and rules into one place.',
  'setups.guide.view-tabs.title': 'Switch setup views',
  'setups.guide.view-tabs.description':
    'Use these tabs to move between the overview, setup pairs, and comparison flow when enough setups are available.',
  'setups.guide.overview-chart.title': 'Performance ranking',
  'setups.guide.overview-chart.description':
    'The overview chart ranks setups by the selected metric. Use the controls in the top right to switch the metric or focus the chart on specific setups.',
  'setups.guide.tag-filter.title': 'Filter setups',
  'setups.guide.tag-filter.description':
    'Filter the cards, chart, pairs, and comparison choices by setup tags or direction. Selections within each group use OR logic, while tags and direction combine together.',
  'setups.guide.setup-cards.title': 'Setup cards',
  'setups.guide.setup-cards.description':
    'Cards summarize each setup with key metrics, status, tags, last traded date, and a small performance trend.',
  'setups.guide.open-detail.title': 'Open a setup page',
  'setups.guide.open-detail.description':
    "When you're ready, open a setup card to see its page. A short guide will meet you there.",
  'setups.guide.detail-performance.title': 'Detail performance',
  'setups.guide.detail-performance.description':
    'The Performance tab shows this setup’s chart and key metrics over time, including P&L, win rate, expectancy, and drawdown.',
  'setups.guide.detail-context.title': 'Setup context',
  'setups.guide.detail-context.description':
    'This panel keeps setup health, attention items, linked notes, and screenshots close at hand.',
  'setups.guide.detail-playbook.title': 'Playbook notes',
  'setups.guide.detail-playbook.description':
    'The playbook area previews the linked note for this setup. It can be markdown, images, Excalidraw, or any reference material you want.',
  'setups.guide.detail-rules.title': 'Execution rules',
  'setups.guide.detail-rules.description':
    'Rules capture the structured checklist for best conditions, entries, risk, and mistakes to avoid.',
  'setups.guide.finish.title': 'Setups guide complete',
  'setups.guide.finish.description':
    'You have seen the main Setups surfaces: Overview, Pairs, Compare, and the individual setup page.',

  'setups.guide.pairs-mode.title': 'Open setup pairs',
  'setups.guide.pairs-mode.description':
    'Open Pairs to see which setup combinations have enough shared trades to compare.',
  'setups.guide.pairs-chart.title': 'Pair ranking',
  'setups.guide.pairs-chart.description':
    'Pairs mode highlights combinations that may perform better or worse together. Click a bar to open deeper pair insights for that combination.',

  'setups.guide.compare-mode.title': 'Start compare mode',
  'setups.guide.compare-mode.description':
    'Compare mode lets you select two setup cards for a side-by-side review.',
  'setups.guide.compare-select.title': 'Select two setups',
  'setups.guide.compare-select.description':
    'Select two setup cards to open the comparison page.',
  'setups.guide.compare-summary.title': 'This is the comparison page',
  'setups.guide.compare-summary.description':
    'This page compares two setups side by side. The top summary row shows the winner, expectancy edge, confidence, and why one setup may have an edge.',
  'setups.guide.compare-body.title': 'Comparison summary row',
  'setups.guide.compare-body.description':
    'The top row summarizes the comparison: winner, expectancy edge, confidence, and the reasons behind the edge.',
  'setups.guide.compare-details.title': 'Comparison details',
  'setups.guide.compare-details.description':
    'Use the metrics table and cumulative chart to understand how the two setups differ.',
  'setups.guide.detail-execution-gap.title': 'Execution gap analysis',
  'setups.guide.detail-execution-gap.description':
    'When missed-trade or backtest data exists, this tab compares captured execution against missed or benchmark opportunity.',
  'setups.guide.back-to-overview.title': 'Back to setup cards',
  'setups.guide.back-to-overview.description':
    'Return to the setup cards when you are finished comparing.',

  'setups.view.title': 'Setups',
  'setups.view.open-as-markdown': 'Open as Markdown',
  'setups.view.open-as-setup': 'Open as Journalit Setup',

  'setups.view.summary.aria': 'Setup overview summary',

  'setups.view.summary.needs-review': 'Needs review',
  'setups.view.summary.best-performer': 'Best performer',

  'setups.view.ranking.metric-aria': 'Performance metric',

  'setups.view.overview.mode.pairs': 'Pairs',
  'setups.view.pairs.summary-aria': 'Setup pairs summary',
  'setups.view.pairs.best': 'Best pair',
  'setups.view.pairs.worst': 'Worst pair',
  'setups.view.pairs.worst-short': 'Worst',
  'setups.view.pairs.empty': 'No setup pairs with 5+ trades yet.',
  'setups.view.pairs.empty-submessage':
    'Pairs appear after two setups share enough linked trades.',
  'setups.view.pairs.privacy':
    'Pair performance is hidden while Privacy Mode is on.',

  'setups.view.pairs.metric-aria': 'Pair metric',
  'setups.view.pairs.metric.edge': 'Pair edge',
  'setups.view.pairs.metric.edge-short': 'edge',
  'setups.view.pairs.metric.expectancy': 'Pair expectancy',

  'setups.view.pairs.together': 'Together',
  'setups.view.pairs.table.setup-pair': 'Setup pair',

  'setups.view.pairs.evidence': 'Evidence',
  'setups.view.pairs.edge-comparison': 'Edge comparison',
  'setups.view.pairs.edge-caption': 'Combined edge: {edge}',
  'setups.view.overview.setup-filter.all': 'Setups: All',
  'setups.view.overview.setup-filter.selected': 'Setups: {count} selected',
  'setups.view.overview.setup-filter.aria': 'Choose setups to show',
  'setups.view.overview.setup-filter.select-all': 'Select all',
  'setups.view.overview.setup-filter.clear': 'Clear',
  'setups.view.overview.tag-filter.aria': 'Filter setups',
  'setups.view.overview.tag-filter.reset': 'Reset',
  'setups.view.overview.tag-filter.untagged': 'Untagged',
  'setups.view.overview.tag-filter.empty': 'No setups match these filters',
  'setups.view.overview.tag-filter.empty-submessage':
    'Adjust or clear the filters to show more setups.',

  'setups.view.overview.pnl-chart.dropdown-label': 'P&L curve',

  'setups.view.overview.pnl-chart.combined': 'All setups',
  'setups.view.overview.pnl-chart.selected-combined': 'Selected setups',

  'setups.view.overview.pnl-chart.hidden':
    'Setup P&L over time is hidden while privacy mode is enabled.',
  'setups.view.overview.pnl-chart.trade': 'Trade',
  'setups.view.overview.pnl-chart.start': 'Start',
  'setups.view.ranking.privacy':
    'Performance values are hidden while Privacy Mode is on.',
  'setups.view.ranking.empty': 'No setup performance data yet.',
  'setups.view.ranking.empty-submessage':
    'Log trades with setups to start ranking performance.',

  'setups.view.metric.trade-count': 'Trade count',
  'setups.view.metric.trades': 'trades',
  'setups.view.metric.net-pnl': 'Total P&L',
  'setups.view.metric.total-pnl': 'Total PnL',
  'setups.view.metric.win-rate': 'Win rate',
  'setups.view.metric.profit-factor': 'Profit factor',
  'setups.view.metric.last-traded': 'Last traded',
  'setups.view.metric.expected-value': 'Expected value',

  'setups.view.status.active': 'Active',
  'setups.view.status.testing': 'Testing',
  'setups.view.status.archived': 'Archived',

  'setups.view.empty.no-setups':
    'No setups yet. Create your first setup to start tracking playbooks.',
  'setups.view.empty.no-setups-submessage':
    'Setups collect your playbook notes, rules, trades, and performance in one place.',

  'setups.view.detail.back': 'Back',

  'setups.view.detail.action.edit': 'Edit setup',
  'setups.view.detail.action.view-trades': 'View in Trade Log',

  'setups.view.detail.playbook': 'Playbook',

  'setups.view.detail.no-playbook-note':
    'Link a playbook note to preview it here.',
  'setups.view.detail.link-playbook-note': 'Link note',
  'setups.view.detail.change-playbook-note': 'Change note',

  'setups.view.detail.playbook-note-modal.empty': 'No matching notes found.',
  'setups.view.detail.empty-playbook-note':
    'The linked playbook note is empty.',
  'setups.view.detail.rules': 'Rules',

  'setups.view.detail.rules.edit': 'Edit rules',

  'setups.view.detail.rules.add': 'Add rule',

  'setups.view.detail.rules.empty-title': 'Build the setup playbook',
  'setups.view.detail.rules.use-template': 'Use template',
  'setups.view.detail.rules.applying-template': 'Applying template...',
  'setups.view.detail.rules.add-custom': 'Custom rule',
  'setups.view.detail.rules.template-error':
    'Failed to apply playbook template.',
  'setups.view.detail.rules.template.best-conditions': 'Best Conditions',
  'setups.view.detail.rules.template.entry-criteria': 'Entry Criteria',
  'setups.view.detail.rules.template.invalidation': 'Invalidation',
  'setups.view.detail.rules.template.risk-management': 'Risk / Management',
  'setups.view.detail.rules.template.avoid-when': 'Avoid When',
  'setups.view.detail.rules.template.common-mistakes': 'Common Mistakes',
  'setups.view.detail.rules.template.rule.best-conditions':
    'Market context supports this setup',
  'setups.view.detail.rules.template.rule.entry-criteria':
    'Entry trigger is clearly defined',
  'setups.view.detail.rules.template.rule.invalidation':
    'Invalidation is clear before entry',
  'setups.view.detail.rules.template.rule.risk-management':
    'Risk is acceptable and target is defined',
  'setups.view.detail.rules.template.rule.avoid-when':
    'Avoid conditions are not present',
  'setups.view.detail.rules.template.rule.common-mistakes':
    'Known execution mistakes are avoided',
  'setups.view.detail.rules.field.label': 'Rule',
  'setups.view.detail.rules.field.description': 'Details',
  'setups.view.detail.rules.field.group': 'Group',
  'setups.view.detail.rules.move-up': 'Move rule up',
  'setups.view.detail.rules.move-down': 'Move rule down',
  'setups.view.detail.rules.delete': 'Delete rule',
  'setups.view.detail.rules.save-error': 'Failed to save setup rules.',
  'setups.view.detail.rules.validation-label':
    'Add a rule name or delete the blank rule before saving.',
  'setups.view.detail.rules.groups': 'Groups',
  'setups.view.detail.rules.add-group': 'Add group',
  'setups.view.detail.rules.new-group': 'New group',
  'setups.view.detail.rules.validation-group':
    'Add a group name or remove the blank group before saving.',
  'setups.view.detail.rules.summary': '{count} rules · {groups} groups',

  'setups.view.detail.rule.category.context': 'Context',
  'setups.view.detail.rule.category.entry': 'Entry',
  'setups.view.detail.rule.category.exit': 'Exit',
  'setups.view.detail.rule.category.risk': 'Risk',
  'setups.view.detail.rule.category.management': 'Management',
  'setups.view.detail.rule.category.invalidation': 'Invalidation',
  'setups.view.detail.rule.category.psychology': 'Psychology',
  'setups.view.detail.rule.required': 'Required',

  'setups.view.detail.no-linked-notes': 'No linked notes yet.',

  'setups.view.detail.performance.cumulative-pnl': 'Cumulative PnL',
  'setups.view.detail.performance.cumulative-r': 'Cumulative R',
  'setups.view.detail.performance.drawdown': 'Drawdown',
  'setups.view.detail.performance.empty': 'No linked trades yet.',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',

  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Edit linked notes',

  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': 'Live R',
  'setups.view.detail.execution-gap.missed-edge': 'Missed Edge',
  'setups.view.detail.execution-gap.live-plus-missed': 'Live + Missed',
  'setups.view.detail.execution-gap.backtest': 'Backtest',

  'setups.view.detail.execution-gap.capture-rate': 'Capture Rate',
  'setups.view.detail.execution-gap.capture-rate-tooltip':
    'Live P&L ÷ (Live P&L + missed-trade P&L). Shows how much available edge you captured.',
  'setups.view.detail.execution-gap.average-r-delta': 'Avg R Delta',
  'setups.view.detail.execution-gap.live-execution': 'Live Execution',
  'setups.view.detail.execution-gap.backtest-benchmark': 'Backtest Benchmark',
  'setups.view.detail.execution-gap.hidden':
    'Execution gap is hidden in privacy mode.',
  'setups.view.detail.execution-gap.empty':
    'Log missed trades or backtest trades for this setup to analyze execution gaps.',

  'setups.view.detail.brief.health': 'Setup health',
  'setups.view.detail.brief.profile': 'Profile',
  'setups.view.detail.brief.linked-notes': 'Linked notes ({count})',
  'setups.view.detail.brief.linked-notes-modal.title': 'Linked notes',
  'setups.view.detail.brief.linked-notes-modal.subtitle':
    'Notes linked to {name}.',
  'setups.view.detail.brief.screenshots': 'Screenshots ({count})',
  'setups.view.detail.brief.view-all': 'View all',
  'setups.view.detail.brief.no-screenshots': 'No screenshots linked yet.',
  'setups.view.detail.brief.screenshot-alt': 'Setup screenshot {index}',
  'setups.view.detail.brief.screenshot-open': 'Open screenshot {index}',
  'setups.view.detail.brief.status.complete': 'Complete',
  'setups.view.detail.brief.status.missing': 'Missing',
  'setups.view.detail.brief.health.playbook': 'Playbook',
  'setups.view.detail.brief.health.rules': 'Rules',
  'setups.view.detail.brief.health.notes': 'Notes',
  'setups.view.detail.brief.health.screenshots': 'Screenshots',
  'setups.view.detail.brief.health.trades': 'Trades',
  'setups.view.detail.brief.count.rules': '{count} rules',
  'setups.view.detail.brief.count.notes': '{count} notes',
  'setups.view.detail.brief.count.images': '{count} images',
  'setups.view.detail.brief.count.trades': '{count} trades',
  'setups.view.detail.brief.more': '+{count} more',

  'setups.view.detail.brief.profile.direction': 'Direction',
  'setups.view.detail.brief.profile.sessions': 'Sessions',
  'setups.view.detail.brief.profile.timeframes': 'Timeframes',
  'setups.view.detail.brief.profile.tickers': 'Tickers',
  'setups.view.detail.brief.direction.long': 'Long',
  'setups.view.detail.brief.direction.short': 'Short',
  'setups.view.detail.brief.direction.both': 'Both',
  'setups.view.detail.attention.title': 'Needs attention',
  'setups.view.detail.attention.count': '{count} items',
  'setups.view.detail.attention.empty': 'No setup issues found.',
  'setups.view.detail.attention.show-more': '+{count} more',
  'setups.view.detail.attention.show-less': 'Show less',
  'setups.view.detail.attention.no-playbook-title': 'Link a playbook note',
  'setups.view.detail.attention.no-playbook-detail':
    'Link one source note for context and examples.',
  'setups.view.detail.attention.no-rules-title': 'Build the execution playbook',
  'setups.view.detail.attention.no-rules-detail':
    'Add criteria for entries, invalidation, risk, and mistakes.',

  'setups.view.detail.attention.no-trades-title': 'No live trades yet',
  'setups.view.detail.attention.no-trades-detail':
    'No linked live trade history yet.',
  'setups.view.detail.attention.no-screenshots-title':
    'Save example screenshots',
  'setups.view.detail.attention.no-screenshots-detail':
    'Attach screenshots to trades for review examples.',
  'setups.view.detail.attention.stale-title': 'Review recent relevance',
  'setups.view.detail.attention.stale-detail':
    'This setup has not been traded in {count} days.',
  'setups.view.detail.attention.profit-factor-title':
    'Performance needs review',
  'setups.view.detail.attention.profit-factor-detail':
    'Profit factor is below 1.0 across linked trades.',
  'setups.view.detail.attention.expectancy-title': 'Expectancy is negative',
  'setups.view.detail.attention.expectancy-detail':
    'Average linked-trade outcome is below breakeven.',
  'setups.view.completeness.incomplete-playbook': 'Incomplete playbook',
  'setups.view.completeness.no-rules': 'No rules',
  'setups.view.completeness.no-linked-notes': 'No linked notes',
  'setups.view.date.never': 'Never',
  'setups.view.metric.expectancy-r': 'Expectancy (R)',

  'setups.view.card.open-named': 'Open {name}',
  'setups.view.card.sparkline-aria': 'Setup sparkline',
  'setups.view.card.status.active': 'Stable',
  'setups.view.card.status.monitor': 'Monitor',
  'setups.view.card.status.review': 'Review',
  'setups.view.tags': 'Tags',
  'setups.view.date.today': 'Today',
  'setups.view.date.yesterday': 'Yesterday',
  'setups.view.date.days-ago': '{count} days ago',
  'settings.general.copy-trading-pnl-toggled': 'Copy trading PnL is {status}',

  'trade-import.restore.complete':
    'Restored {written} imported trades; {failed} failed.',
  'trade-import.restore.broker-label': 'Backend restore',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Trade Sync',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'Sync trades from MetaTrader reports uploaded through your FTP connection.',
  'trade-sync.source.trade-import.description':
    'Restore broker-file imports across vaults and recover missing local trade notes.',
  'trade-sync.source.tradovate.description':
    'Synchronize Tradovate trades in the cloud and project them into this vault.',
  'trade-sync.tradovate.status-failed': 'Unable to load Tradovate status.',
  'trade-sync.tradovate.last-sync': 'Last sync',
  'trade-sync.tradovate.last-projection': 'Last projection',
  'trade-sync.tradovate.pending-projections': '{count} pending projection(s)',
  'trade-sync.tradovate.pending-acks': '{count} pending local ACK(s)',
  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Synchronize Rithmic trades in the cloud and project them into this vault.',
  'trade-sync.rithmic.plugin-sync-description':
    'Connect Rithmic on Journalit.co, then sync here to write your latest Rithmic activity into this vault.',
  'trade-sync.rithmic.status-failed': 'Unable to load Rithmic status.',
  'trade-sync.rithmic.status.connecting': 'Connecting',
  'trade-sync.rithmic.status.paused': 'Paused',
  'trade-sync.rithmic.status.waiting-for-accounts': 'Waiting for accounts',
  'trade-sync.rithmic.status.reauthorization-required':
    'Reauthorization required on Journalit.co',
  'trade-sync.rithmic.status.error': 'Connection error',
  'trade-sync.rithmic.no-connections':
    'Connect a Rithmic account on Journalit.co to synchronize it here.',
  'trade-sync.rithmic.connect': 'Connect',
  'trade-sync.rithmic.manage': 'Manage on Journalit.co',
  'trade-sync.rithmic.system': 'Rithmic system',
  'trade-sync.rithmic.accounts': 'Accounts',
  'trade-sync.rithmic.last-sync': 'Last sync',
  'trade-sync.rithmic.never': 'Never',
  'trade-sync.rithmic.job.running': 'Synchronization in progress…',
  'trade-sync.rithmic.job.last': 'Last job: {status}',
  'trade-sync.job.status.queued': 'Queued',
  'trade-sync.job.status.running': 'Running',
  'trade-sync.job.status.succeeded': 'Succeeded',
  'trade-sync.job.status.partial': 'Partial',
  'trade-sync.job.status.failed': 'Failed',
  'trade-sync.job.status.cancelled': 'Cancelled',
  'trade-sync.job.status.unknown': 'Unknown',
  'trade-sync.rithmic.sync-to-vault': 'Sync',
  'trade-sync.rithmic.syncing': 'Syncing…',
  'trade-sync.rithmic.mapping-required':
    'Choose a local vault account for every synchronized Rithmic account.',
  'trade-sync.rithmic.sync-complete-connection':
    '{connection} synchronization completed.',
  'trade-sync.rithmic.sync-partial-connection':
    '{connection} synchronization completed with issues.',
  'trade-sync.rithmic.sync-all': 'Sync all',
  'trade-sync.rithmic.sync-all-complete':
    'Synchronized {succeeded} of {total} Rithmic connections.',
  'trade-sync.rithmic.sync-all-partial':
    'Synchronized {succeeded} of {total} Rithmic connections. Review the connections with issues.',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic allows only one active session. Close R|Trader, NinjaTrader or any other platform using this Rithmic login.',
  'trade-sync.rithmic.error.auto-retry': 'Journalit retries automatically.',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic rejected the stored credentials. Update them on Journalit.co and try again.',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic requires the market data agreements to be signed in R|Trader. Sign them, then try again.',
  'trade-sync.rithmic.error.disabled':
    'Rithmic synchronization is disabled for this connection. Manage it on Journalit.co.',
  'trade-sync.rithmic.error.sync-failed':
    'Rithmic synchronization failed. Review the connection on Journalit.co and try again.',
  'trade-sync.broker.mapping-unsaved-hint':
    'Mapping is saved when you synchronize.',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'Unsaved account changes. Synchronize that connection to save them.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    'Choose a Journalit account for every account you synchronize first.',
  'trade-sync.broker.sync-all-blocked.running-job':
    'A synchronization is already running.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'No connection is ready to synchronize.',
  'trade-sync.rithmic.connect-another': 'Connect another Rithmic account',
  'trade-sync.rithmic.error.sync-failed-detail':
    'Rithmic synchronization failed: {message}',
  'trade-sync.tradovate.never': 'Never',

  'trade-sync.import.card.connection': 'Connection',
  'trade-sync.import.card.backup': 'Import backup',
  'trade-sync.import.card.restorable': 'Restorable trades',
  'trade-sync.import.card.import': 'Trade Import',

  'trade-sync.import.card.open-importer-desc': 'Import new broker files there',
  'trade-sync.import.card.inventory-summary':
    '{accounts} account(s) · {trades} trade(s)',
  'trade-sync.import.action.check': 'Check',

  'trade-sync.import.action.open-import': 'Open Trade Import',

  'trade-sync.import.action.create-local-account': 'Create account',
  'trade-sync.import.action.create-local-account-title':
    'Create a Journalit account using the backend account name.',
  'trade-sync.import.action.save-mapping': 'Save',
  'trade-sync.import.action.save-mapping-title':
    'Save this backend account to local account mapping.',

  'trade-sync.import.action.restore-account': 'Restore',
  'trade-sync.import.action.restore-account-title':
    'Restore missing local trade notes for this backend account.',
  'trade-sync.import.action.restoring': 'Restoring…',

  'trade-sync.import.pending-acks': '{count} pending ACK(s)',

  'trade-sync.import.empty-accounts':
    'No backed-up Trade Import accounts found yet.',
  'trade-sync.import.account.restorable-count': '{count} restorable',
  'trade-sync.import.account.synced-count': '{count} synced',
  'trade-sync.import.account.missing-count': '{count} missing',
  'trade-sync.import.account.issue-count': '{count} issue(s)',
  'notice.error.canonical-trade-type-change':
    'Broker-synced trades cannot be changed to a different trade type.',
  'trade-sync.import.account.conflict-repair':
    'Duplicate canonicalTradeId notes were found. Keep one note, then delete canonicalTradeId from the duplicate note or remove that duplicate note. Renaming the file does not repair the conflict.',
  'trade-sync.import.account.local-account': 'Journalit account',
  'trade-sync.import.account.mapping-hint':
    'Restored trades will be written to this Journalit account.',
  'trade-sync.import.notice.restored': 'Restored {count} imported trade(s).',

  'trade-sync.import.notice.sync-cloud-failed':
    'Unable to start cloud synchronization.',
  'trade-sync.import.notice.load-failed':
    'Could not load Trade Import sync status.',
  'trade-sync.import.notice.mapping-failed':
    'Could not save Trade Import account mapping.',
  'trade-sync.import.notice.create-account-failed':
    'Could not create local account.',
  'trade-sync.import.notice.restore-failed':
    'Could not restore Trade Import account.',
  'trade-sync.rate-limit.action.mapping': 'Account mapping',
  'trade-sync.import.notice.rate-limited':
    '{action}: Too many requests. Try again in {seconds}s.',
  'command.open-session-mode': 'Open session mode',
  'view.session-mode': 'Session mode',

  'session-mode.loading': 'Loading Session Mode',

  'session-mode.section.timeline': 'Timeline',
  'session-mode.title.preparation': 'Session preparation',
  'session-mode.title.live': 'Live session',
  'session-mode.title.break': 'Session break',
  'session-mode.title.ended': 'Session ended',

  'session-mode.prep.resources': 'Resources',

  'session-mode.action.open-drc-for-date': 'Open DRC for {date}',
  'session-mode.ended.helper': 'Log your trades or review the day.',
  'session-mode.ended.action.import-trades': 'Import trades',
  'session-mode.ended.action.add-trade-manually': 'Add trade manually',
  'session-mode.ended.action.open-drc': 'Open DRC',

  'session-mode.unplanned.name': 'Unplanned session',
  'session-mode.unplanned.start': 'Start unplanned session',
  'session-mode.unplanned.stop': 'Stop session',
  'session-mode.unplanned.badge': 'Unplanned',
  'session-mode.unplanned.status.live': 'Started {time} · {elapsed} elapsed',
  'session-mode.unplanned.ended.summary':
    'Unplanned session · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'Start an unplanned session',
  'session-mode.unplanned.modal.description':
    'You are outside your planned session windows. This session will be marked as unplanned in your daily review. Write down why you are trading now.',
  'session-mode.unplanned.modal.reason-label': 'Reason',
  'session-mode.unplanned.modal.reason-placeholder':
    'e.g. FOMC at 14:00, missed the morning session',
  'session-mode.unplanned.modal.reason-required':
    'Enter a reason before starting.',
  'session-mode.unplanned.notice.started': 'Unplanned session started.',
  'session-mode.unplanned.notice.stopped': 'Unplanned session stopped.',
  'session-mode.unplanned.notice.blocked-live': 'A session is already live.',
  'session-mode.unplanned.notice.none-running':
    'No unplanned session is running.',
  'session-mode.unplanned.notice.failed':
    'Could not update the unplanned session. Check the console for details.',
  'session-mode.ended.stat.trades': 'Trades',
  'session-mode.ended.stat.notes': 'Notes',
  'session-mode.ended.stat.gate-checks': 'Gate checks',
  'session-mode.waiting.next-session': 'Next session',
  'session-mode.waiting.starts-at': '{session} starts at {time}',
  'session-mode.waiting.preparation-opens-in':
    'Preparation opens in {remaining}',
  'session-mode.waiting.open-drc': 'Open DRC',

  'session-mode.break.reset-before': 'Reset before {session}',
  'session-mode.break.reset': 'Reset before the next session',
  'session-mode.break.next-session-meta':
    'Next session starts at {time} · {remaining} remaining',
  'session-mode.break.description':
    'Step away, hydrate, and clear your mind before the next session.',
  'session-mode.break.open-drc': 'Open DRC',
  'session-mode.countdown.starts-in': 'Starts in',
  'session-mode.countdown.starts-at': '{session} starts at {time}',
  'session-mode.countdown.hours': 'hrs',
  'session-mode.countdown.minutes': 'min',
  'session-mode.countdown.seconds': 'sec',
  'session-mode.phase.preparation': 'Preparation',
  'session-mode.phase.live': 'Live',
  'session-mode.phase.waiting': 'Waiting',
  'session-mode.phase.break': 'Break',
  'session-mode.phase.ended': 'Ended',
  'session-mode.phase.unconfigured': 'Session schedule not configured',
  'session-mode.status.preparation':
    '{session} starts at {time}. You have {remaining} to prepare.',
  'session-mode.status.preparation-generic':
    'Prepare for the next live trading session.',
  'session-mode.status.waiting':
    '{session} starts at {time}. Preparation starts in {remaining}.',
  'session-mode.status.waiting-generic':
    'Your next session is scheduled, but preparation has not started yet.',
  'session-mode.status.live': '{remaining} remaining in this session.',
  'session-mode.status.live-generic': 'Your trading session is live.',
  'session-mode.status.break':
    '{session} starts at {time}. You are on break for {remaining}.',
  'session-mode.status.break-generic': 'You are between trading sessions.',
  'session-mode.status.ended':
    'Your configured trading sessions are finished for now.',
  'session-mode.status.unconfigured':
    'Configure session windows to unlock preparation, live, break, and ended phases. The timeline remains available for today’s DRC.',

  'session-mode.unconfigured.title': 'Set up Session Mode',
  'session-mode.unconfigured.description':
    'Add your session times to get started.',
  'session-mode.unconfigured.step.window.title': 'Add a session window',

  'session-mode.unconfigured.step.prep.title': 'Review preparation timing',

  'session-mode.unconfigured.step.gate.title': 'Use the Starter Trade Gate',

  'session-mode.unconfigured.step.log.title': 'Log notes during live sessions',

  'session-mode.unconfigured.action': 'Configure Session Mode',
  'session-mode.guide.why.title': 'Trade your plan, not your mood',
  'session-mode.guide.why.description':
    "Session Mode prepares you before each session, holds you to your rules with a Trade Gate while it's live, and keeps a timestamped log so you can replay the day. It takes two minutes to set up.",
  'session-mode.guide.configure.title': 'Set it up now',
  'session-mode.guide.configure.description':
    'Add your session times and build your first Trade Gate. A short walkthrough will guide you in Settings.',
  'session-mode.guide.preparation.countdown.title': 'Your session is coming up',
  'session-mode.guide.preparation.countdown.description':
    'This is the preparation phase. The countdown shows when you go live, and this page switches to live mode on its own.',
  'session-mode.guide.preparation.goals.title': "Set today's goals",
  'session-mode.guide.preparation.goals.description':
    'Write down what a good session looks like before the market opens, so you have something to hold yourself to.',
  'session-mode.guide.preparation.checklist.title': 'Run your checklist',
  'session-mode.guide.preparation.checklist.description':
    "Tick off your pre-session routine here. Everything you check is saved to today's review note.",
  'session-mode.guide.preparation.next.title': 'When you go live',
  'session-mode.guide.preparation.next.description':
    "Your Trade Gate and session log appear here. We'll show you around them the first time.",
  'session-mode.guide.live.trade-gate.title':
    'Run the Trade Gate before every trade',
  'session-mode.guide.live.trade-gate.description':
    'Press Start and answer the questions built from your criteria. The gate ends in green light, wait, or no trade, so you only take the trades your system allows.',
  'session-mode.guide.live.session-log.title': 'Log what you see and feel',
  'session-mode.guide.live.session-log.description':
    'Jot down setups, emotions and decisions as they happen. Every note is timestamped, so later you can replay exactly what was going on.',
  'session-mode.guide.live.settings.title': 'Tune it any time',
  'session-mode.guide.live.settings.description':
    'Edit opens Session Mode settings: session times, phase layout, Trade Gate workflows and log tags.',
  'session-mode.guide.ended.review.title': 'Now review the session',
  'session-mode.guide.ended.review.description':
    "Open today's DRC to review. Add the Session log widget to your DRC layout and every timestamped note shows up there.",
  'settings.session-mode.guide.setting-name': 'Walkthrough',
  'settings.session-mode.guide.setting-desc':
    'A short tour of these settings, from session times to your first Trade Gate.',
  'settings.session-mode.guide.replay': 'Show guide',
  'settings.session-mode.guide.intro.title': "Let's set up Session Mode",
  'settings.session-mode.guide.intro.description':
    'Four things to set: when your sessions run, what each phase shows, your Trade Gate, and your session log tags.',
  'settings.session-mode.guide.lead-time.title': 'Preparation lead time',
  'settings.session-mode.guide.lead-time.description':
    'How many minutes before a session the preparation phase opens.',
  'settings.session-mode.guide.windows.title': 'Add your session windows',
  'settings.session-mode.guide.windows.description':
    "One window per session you trade, with a name, start and end. Session Mode uses these to know when to prepare and when you're live.",
  'settings.session-mode.guide.layout.title': 'Choose what each phase shows',
  'settings.session-mode.guide.layout.description':
    'Turn modules on or off per phase: resources, goals and checklist for preparation; the Trade Gate and session timeline while live.',
  'settings.session-mode.guide.trade-gate.title': 'Build your Trade Gate',
  'settings.session-mode.guide.trade-gate.description':
    'Add builds a starter workflow from common questions the first time, or an empty one after that; Library holds ready-made questions. Each question routes to the next one or to an outcome: green light, wait, or no trade.',
  'settings.session-mode.guide.editor.title': 'Questions and outcomes',
  'settings.session-mode.guide.editor.description':
    "Expand a workflow to add questions and set where each answer leads. The play button runs it exactly as you'll see it during a session.",
  'settings.session-mode.guide.tags.title': 'Tags for your session log',
  'settings.session-mode.guide.tags.description':
    'Tag notes as you log them, for example by emotion or setup, so you can filter them in your review.',
  'settings.session-mode.guide.finish.title': "You're set",
  'settings.session-mode.guide.finish.description':
    'Open Session Mode from the ribbon or Home. Add the Session log widget to your DRC layout to see your notes in every review.',

  'session-mode.layout.empty.title': 'Nothing enabled for this phase',
  'session-mode.layout.empty.description':
    'Turn modules back on to build this Session Mode phase.',
  'session-mode.duration.minutes': '{minutes}m',
  'session-mode.duration.hours': '{hours}h',
  'session-mode.duration.hours-minutes': '{hours}h {minutes}m',
  'settings.session-mode.title': 'Session Mode',
  'settings.session-mode.description':
    'Configure session windows, preparation, phase layout, Trade Gate workflows, and session log tags.',
  'settings.session-mode.preparation-lead-time':
    'Preparation lead time (minutes)',
  'settings.session-mode.preparation-lead-time-desc':
    'How early preparation mode starts before a session.',
  'settings.session-mode.windows': 'Session windows',

  'settings.session-mode.add-window-short': 'Add',
  'settings.session-mode.no-windows':
    'No session windows configured yet. The live timeline still works, but phase-aware preparation starts after adding a window.',
  'settings.session-mode.layout.title': 'Phase layout',

  'settings.session-mode.layout.phase-desc.preparation':
    'Choose what appears during pre-session preparation before trading starts.',
  'settings.session-mode.layout.phase-desc.live':
    'Choose what appears while a configured trading session is live.',

  'settings.session-mode.layout.phase-desc.ended':
    'Choose what appears after all configured trading sessions have ended.',
  'settings.session-mode.layout.reset-phase': 'Reset',

  'settings.session-mode.layout.module.preparation-resources': 'Resources',
  'settings.session-mode.layout.module.preparation-resources-desc':
    'Shows linked preparation notes and playbooks.',
  'settings.session-mode.layout.module.preparation-goals': 'Goals',
  'settings.session-mode.layout.module.preparation-goals-desc':
    'Shows the DRC goals widget for pre-session focus.',
  'settings.session-mode.layout.module.preparation-checklist': 'Checklist',
  'settings.session-mode.layout.module.preparation-checklist-desc':
    'Shows the DRC checklist widget for pre-session preparation.',
  'settings.session-mode.layout.module.trade-gate': 'Trade Gate',
  'settings.session-mode.layout.module.trade-gate-desc':
    'Runs your configured IF/THEN gate during the live session.',
  'settings.session-mode.layout.module.timeline': 'Session timeline',
  'settings.session-mode.layout.module.timeline-desc':
    'Shows current-session notes and trade timeline entries.',

  'settings.session-mode.layout.module.ended-actions': 'End-of-session actions',
  'settings.session-mode.layout.module.ended-actions-desc':
    'Shows import, manual trade, and DRC actions after sessions end.',
  'settings.session-mode.layout.module.ended-stats': 'Session stats',
  'settings.session-mode.layout.module.ended-stats-desc':
    'Shows trade, note, and gate-check totals for the day.',
  'settings.session-mode.linked-resources': 'Linked resources',
  'settings.session-mode.linked-resources-desc':
    'Show quick note links during preparation.',
  'settings.session-mode.linked-resources-count': '{count} linked',
  'settings.session-mode.linked-resources-hide': 'Hide linked',
  'settings.session-mode.session-log': 'Session log',
  'settings.session-mode.session-log-desc':
    'Choose which automatic events appear alongside your session notes.',
  'settings.session-mode.show-trade-executions': 'Trade entries and exits',
  'settings.session-mode.show-trade-executions-desc':
    'Show trade entries and exits in Session Mode and Daily Review logs.',
  'settings.session-mode.session-log-tags': 'Session log tags',
  'settings.session-mode.session-log-tags-desc':
    'Customize the tags available in the Session Mode composer and DRC session log.',
  'settings.session-mode.tag-label-placeholder': 'Tag name',
  'settings.session-mode.tag-short-label-placeholder': 'Label',
  'settings.session-mode.tag-label-example': 'Trade',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Tag color',
  'settings.session-mode.tag-requires-resolution': 'Needs classification',
  'settings.session-mode.tag-lesson': 'Lesson tag',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Entries with this tag are treated as uncategorized notes. Use it when the right tag is not clear during the session; classify the entry later.',
  'settings.session-mode.tag-lesson-tooltip':
    'Marks this tag as a learning entry. Lesson-tagged notes stay in the session log and can be surfaced by lesson filters and review summaries.',
  'settings.session-mode.add-session-log-tag': 'Add session log tag',
  'settings.session-mode.reset-session-log-tags': 'Reset',
  'settings.session-mode.tag-color.blue': 'Blue',
  'settings.session-mode.tag-color.indigo': 'Indigo',
  'settings.session-mode.tag-color.purple': 'Purple',
  'settings.session-mode.tag-color.green': 'Green',
  'settings.session-mode.tag-color.pink': 'Pink',
  'settings.session-mode.tag-color.amber': 'Amber',
  'settings.session-mode.tag-color.red': 'Red',
  'settings.session-mode.tag-color.orange': 'Orange',

  'settings.session-mode.search-resource-placeholder':
    'Search vault files to link…',

  'settings.session-mode.window-name': 'Session name',
  'settings.session-mode.window-name-placeholder': 'e.g. NY AM',

  'settings.session-mode.start-time': 'Start time',
  'settings.session-mode.end-time': 'End time',
  'widget.session-log.name': 'Session log',
  'widget.session-log.description':
    'Capture timestamped execution notes and trade events.',
  'session-log.title': 'Session mode log',
  'session-log.description':
    'Capture what happened during the current trading session.',
  'session-log.notice.invalid-timestamp':
    'Enter a valid session-log timestamp.',
  'session-log.action.auto-time': 'Auto time',
  'session-log.action.set-time': 'Set time',

  'session-log.composer.tag-label': 'Session log tag',
  'session-log.placeholder.entry-short': 'Add session note...',
  'session-log.action.add-entry': 'Add timestamped entry',
  'session-log.action.add-note': 'Add',
  'session-log.action.hide-composer': 'Hide composer',
  'session-log.filter.all': 'All',
  'session-log.filter.label': 'Filter session log',
  'session-log.filter.clear': 'Clear filter',
  'session-log.timeline.most-recent': 'Most recent',
  'session-log.timeline.start': 'Start of session',
  'session-log.empty': 'No session log entries yet.',
  'session-log.empty-filtered': 'No entries match this filter.',
  'session-log.loading': 'Loading session log…',
  'session-log.session-group.outside': 'Outside sessions',
  'session-log.session-group.unplanned': 'Unplanned @ {time}',
  'session-log.lessons.title': 'Lessons learned',

  'session-log.lessons.badge': 'LSN',

  'session-log.trade.entered': 'Entered',
  'session-log.trade.exited': 'Exited',
  'session-log.trade.size': 'size',

  'session-log.status.unclassified': 'unclassified',
  'session-log.action.save': 'Save',
  'session-log.action.cancel': 'Cancel',

  'session-log.action.classify': 'Classify',
  'session-log.action.edit': 'Edit',
  'session-log.action.delete': 'Delete',
  'session-log.action.open-trade': 'Open trade',
  'session-log.preview':
    'Session log preview: timestamped notes and trade events will appear here during the session mode.',
  'session-log.alert.tag-concentration':
    '{tag} is {percentage}% of session notes ({count}/{total}). Mindset was a major theme this session.',

  'trade-gate.workflow': 'Workflow',

  'trade-gate.action.start-short': 'Start',
  'trade-gate.action.start-another': 'Start another',
  'trade-gate.outcome.green-light': 'Green light',
  'trade-gate.outcome.green-light-description': 'Conditions met.',
  'trade-gate.outcome.no-trade': 'No trade',
  'trade-gate.outcome.no-trade-description': 'Conditions are not met.',
  'trade-gate.outcome.wait': 'Wait',
  'trade-gate.outcome.wait-description':
    'Setup is not ready. Wait for the next opportunity.',
  'settings.session-mode.trade-gate.title': 'Trade Gate workflows',
  'settings.session-mode.trade-gate.desc':
    'Create IF/THEN decision flows for live entry checks.',
  'settings.session-mode.trade-gate.delete-workflow.title':
    'Delete Trade Gate workflow?',
  'settings.session-mode.trade-gate.delete-workflow.message':
    'Delete “{name}”? This removes every question and branch in this workflow. This action cannot be undone.',
  'settings.session-mode.trade-gate.delete-workflow.confirm': 'Delete workflow',
  'settings.session-mode.trade-gate.name': 'Workflow name',
  'settings.session-mode.trade-gate.untitled': 'Untitled workflow',
  'settings.session-mode.trade-gate.start-node': 'Start question',
  'settings.session-mode.trade-gate.simulation.show': 'Simulate',
  'settings.session-mode.trade-gate.simulation.unavailable':
    'Connect the start question to at least one complete outcome before starting the simulation.',
  'settings.session-mode.trade-gate.add-question': 'Add question',
  'settings.session-mode.trade-gate.question': 'Question',
  'settings.session-mode.trade-gate.new-question-title': 'New question',
  'settings.session-mode.trade-gate.edit-question': 'Edit question',
  'settings.session-mode.trade-gate.question-title': 'Question title',
  'settings.session-mode.trade-gate.prompt': 'Prompt',
  'settings.session-mode.trade-gate.options': 'Options',
  'settings.session-mode.trade-gate.option': 'Option',
  'settings.session-mode.trade-gate.no-options':
    'Add answer options for this question.',
  'settings.session-mode.trade-gate.option-label': 'Option label',
  'settings.session-mode.trade-gate.option-target': 'Leads to',
  'settings.session-mode.trade-gate.not-wired': 'Not wired yet',
  'settings.session-mode.trade-gate.not-wired-hint': 'Click to connect',
  'settings.session-mode.trade-gate.target-group-questions': 'Questions',
  'settings.session-mode.trade-gate.target-current': 'Current: {title}',
  'settings.session-mode.trade-gate.target-group-outcomes': 'Outcomes',
  'settings.session-mode.trade-gate.new-question-target': '+ New question',
  'settings.session-mode.trade-gate.outcome-note':
    'Outcome note (this branch only)',
  'settings.session-mode.trade-gate.remove-from-workflow':
    'Remove from this workflow',
  'settings.session-mode.trade-gate.used-in-workflows':
    'Used in {count} workflow(s)',
  'settings.session-mode.trade-gate.not-used': 'Not used yet',
  'settings.session-mode.trade-gate.question-count': '{count} question(s)',
  'settings.session-mode.trade-gate.library-title': 'Question library',
  'settings.session-mode.trade-gate.library-search': 'Search questions...',
  'settings.session-mode.trade-gate.library-empty':
    'No questions found. Create one to get started.',
  'settings.session-mode.trade-gate.delete-question.title': 'Delete question?',
  'settings.session-mode.trade-gate.delete-question.message':
    'Delete “{name}” from the question library? This action cannot be undone.',
  'settings.session-mode.trade-gate.delete-question.message-used':
    'Delete “{name}” from the question library? It is used in: {workflows}. Its branches in those workflows will be removed. This action cannot be undone.',
  'settings.session-mode.trade-gate.delete-question.confirm': 'Delete question',
  'settings.session-mode.trade-gate.unplaced-title':
    'In this workflow, not connected yet',
  'settings.session-mode.trade-gate.flow-map': 'Flow map',
  'settings.session-mode.trade-gate.flow-fit': 'Fit',
  'settings.session-mode.trade-gate.flow-click-hint':
    'Click a card, path label, or outcome to edit it.',
  'settings.session-mode.trade-gate.flow-truncated':
    'This flow is too large to display fully. Some repeated branches are hidden.',
  'settings.session-mode.trade-gate.no-start':
    'Choose a start question to see the flow.',
  'settings.session-mode.trade-gate.no-questions':
    'Add the first question to begin this workflow.',
  'filter.modal.image.annotation-status': 'Annotation status',
  'filter.modal.image.status.tagged': 'Tagged',
  'filter.modal.image.status.untagged': 'Untagged',
  'filter.modal.image.status.has-notes': 'Has notes',
  'filter.modal.image.status.no-notes': 'No notes',
  'filter.modal.image.tags': 'Media tags',
  'setups.view.detail.action.gallery': 'Open gallery',
  'tradelog.mode.label': 'Trade Log mode',
  'tradelog.mode.trades': 'Trades',
  'tradelog.mode.image-gallery': 'Gallery',

  'imageGallery.empty.error.title': 'Gallery unavailable',
  'imageGallery.empty.no-images.title': 'No media yet',
  'imageGallery.empty.no-images.description':
    'Images, GIFs, videos, and YouTube links attached to trades or review notes will appear here automatically.',
  'imageGallery.empty.no-results.title': 'No media matches these filters',
  'imageGallery.empty.no-results.description':
    'Try clearing the active filters or widening the date range to bring more gallery items back into view.',
  'imageGallery.empty.no-source.title': 'No media in this source',
  'imageGallery.empty.no-source.description':
    'This source does not have gallery items yet. Switch back to all media or choose a different source.',
  'imageGallery.empty.action.clear-filters': 'Clear filters',
  'imageGallery.empty.action.show-all': 'Show all media',
  'imageGallery.error.load-failed': 'Could not load gallery.',

  'imageGallery.open-source': 'Open source',
  'imageGallery.image-alt': '{source} media from {date}',
  'imageGallery.privacy-blurred': 'Blurred for privacy',

  'imageGallery.sort.label': 'Sort:',
  'imageGallery.sort.newest': 'Newest',
  'imageGallery.sort.oldest': 'Oldest',
  'imageGallery.sort.best': 'Best P&L',
  'imageGallery.sort.worst': 'Worst P&L',
  'imageGallery.size-aria': 'Gallery media size',
  'imageGallery.size.small': 'Small',
  'imageGallery.size.medium': 'Medium',
  'imageGallery.size.large': 'Large',
  'imageGallery.view-mode-aria': 'Gallery card grouping',
  'imageGallery.view-mode.grouped': 'Grouped',
  'imageGallery.view-mode.individual': 'Individual',
  'imageGallery.group.additional-media': '{count} additional media items',
  'imageGallery.group.annotation-summary':
    '{annotated} of {total} media items annotated',
  'imageGallery.group.navigation':
    'Media {mediaCurrent} of {mediaTotal} · Entry {groupCurrent} of {groupTotal}',
  'imageGallery.source.label': 'Source:',
  'imageGallery.source.all': 'All media',
  'imageGallery.source.trade': 'Trades',
  'imageGallery.source.folder': 'Folders',
  'imageGallery.source.reviews': 'Reviews',
  'imageGallery.source.drc': 'Daily reviews',
  'imageGallery.source.weekly': 'Weekly reviews',
  'imageGallery.source.monthly': 'Monthly reviews',
  'imageGallery.source.quarterly': 'Quarterly reviews',
  'imageGallery.source.yearly': 'Yearly reviews',

  'imageGallery.annotation.reviewed': 'Reviewed',
  'imageGallery.annotation.unreviewed': 'Unreviewed',
  'imageGallery.date.unknown': 'Unknown date',
  'imageGallery.annotation.tag': 'Tag',

  'imageGallery.annotation.editor-title': 'Annotate media',
  'imageGallery.annotation.editor-title-with-file': 'Annotate {fileName}',
  'imageGallery.annotation.tags': 'Tags',
  'imageGallery.annotation.tags-placeholder': 'Breakout, A+ Setup, Mistake',
  'imageGallery.annotation.notes': 'Notes',
  'imageGallery.annotation.notes-placeholder':
    'What should future you learn from this chart?',
  'imageGallery.annotation.error.save-failed':
    'Could not save media annotation.',
  'imageGallery.annotation.error.load-failed':
    'Could not load media annotation.',
  'imageGallery.annotation.saving': 'Saving...',
  'settings.gallery-folders.section': 'Media Gallery',
  'settings.gallery-folders.description':
    'Show media from these folders in the Trade Log gallery.',
  'settings.gallery-folders.placeholder': 'Choose a folder...',
  'settings.gallery-folders.add': 'Add',
  'settings.gallery-folders.remove-aria': 'Remove gallery folder {path}',
  'settings.gallery-folders.not-a-folder':
    'Select a folder rather than a media file.',
  'settings.gallery-folders.save-failed':
    'Failed to save gallery folders. Please try again.',
  'tradelog.guide.switch-to-gallery.title': 'Switch from trades to the Gallery',
  'tradelog.guide.switch-to-gallery.description':
    'Use this mode selector to move between the regular Trade Log and the Gallery. Click Gallery to continue the tour with your images, GIFs, videos, and YouTube links.',

  'tradelog.guide.gallery-grouping.title': 'Group media by journal entry',
  'tradelog.guide.gallery-grouping.description':
    'Grouped keeps every trade, review, or configured folder together. Individual displays each media item as its own card.',
  'tradelog.guide.gallery-source-sort.title':
    'Choose the media source and order',
  'tradelog.guide.gallery-source-sort.description':
    'Use Source to focus on all media, trade attachments, review-note media, or configured vault folders. Use Sort to review items from newest to oldest or by trade performance.',
  'tradelog.guide.gallery-size.title': 'Adjust the gallery preview size',
  'tradelog.guide.gallery-size.description':
    'Use these size buttons to switch between compact scanning and larger media previews.',
  'tradelog.guide.gallery-filters.title':
    'Filter the gallery with the same entry point',
  'tradelog.guide.gallery-filters.description':
    'The filter button still opens Advanced Filters. In Gallery mode it also includes media-specific filters such as annotation status and media tags.',
  'tradelog.guide.gallery-filter-modal.title':
    'Media filters live with your trade filters',
  'tradelog.guide.gallery-filter-modal.description':
    'Use this modal to combine trade filters with media filters. For example, filter to one setup, then show only media with notes or a specific media tag.',
  'tradelog.guide.gallery-grid.title': 'Open media for closer review',
  'tradelog.guide.gallery-grid.description':
    'Each card keeps the media unobstructed while showing compact trade and review context. Click any card, or press Next to open the first visible item fullscreen.',
  'tradelog.guide.gallery-fullscreen-actions.title':
    'Annotate media from fullscreen',
  'tradelog.guide.gallery-fullscreen-actions.description':
    'Use Tag to add media-level tags and notes while the item is large enough to inspect. Open source opens the trade, review, or folder media file.',
  'tradelog.guide.gallery-open-annotation.title': 'Open the annotation panel',
  'tradelog.guide.gallery-open-annotation.description':
    'Click Tag to annotate this specific media item. Media tags and notes describe the attachment, not the whole trade.',
  'tradelog.guide.gallery-annotation-panel.title': 'Add media tags and notes',
  'tradelog.guide.gallery-annotation-panel.description':
    'Use media tags for chart-specific ideas like liquidity sweep or failed breakout, and notes for the market-structure context you want to remember.',
  'tradelog.guide.gallery-finish.title': 'You now know both Trade Log modes',
  'tradelog.guide.gallery-finish.description':
    'Use Trades when you need the table and batch tools. Use Gallery when you want to review images, GIFs, videos, YouTube links, and annotations across your journal.',
  'tradelog.guide.image-gallery-empty.intro.title': 'No media yet',
  'tradelog.guide.image-gallery-empty.intro.description':
    'Add media to trades or review notes, or configure Media Gallery folders in Trading settings. Once media exists, Journalit will show the full gallery guide for fullscreen review, tags, and notes.',

  'filter.modal.section.image-gallery': 'Gallery',
  'filter.modal.session-tags.placeholder': 'Session Tags',
  'filter.modal.session-tags.all': 'All Session Tags',
  'filter.modal.session-tags.n-selected': '{count} Session Tags',
  'filter.modal.session-tags.select-all': 'Select All',
  'filter.modal.session-tags.none-found': 'No session tags found',

  'home.mode.overview': 'Overview',
  'home.mode.dashboard': 'Dashboard',
  'home.mode.aria': 'Switch Home mode',
  'home.filters.period': 'Period',
  'home.filters.trade-type': 'Trade type',
  'home.filters.accounts': 'Accounts',
  'home.filters.back': 'Back',
  'filter.reset': 'Reset filters',
  'home.guide.modes.title': 'One more thing: the Dashboard',
  'home.guide.modes.description':
    'Overview and Dashboard share this page. Switch to Dashboard now to continue with a short tour of your performance stats.',
  'home.guide.whats-new.mode.title': 'One Home, two modes',
  'home.guide.whats-new.mode.description':
    'Overview and Dashboard now share one page. Switch modes here without losing either layout or scroll position.',
  'home.guide.whats-new.filters.title': 'Home filters are in one place',
  'home.guide.whats-new.filters.description':
    'Open the filter button to choose Period, Trade type, or Accounts from a compact layered menu.',
  'home.guide.whats-new.done.title': 'Your workspace stays in context',
  'home.guide.whats-new.done.description':
    'Use Overview for your personal widgets and Dashboard for deeper analysis. Each mode keeps its own filters and layout.',
  'account.prop-challenge.stage': 'Stage type',
  'account.prop-challenge.stage.evaluation': 'Evaluation',
  'account.prop-challenge.stage.sim-funded': 'Sim funded',
  'account.prop-challenge.stage.live-funded': 'Live funded',
  'account.prop-challenge.payout-rules.title': 'Payout rules',
  'account.prop-challenge.payout-rules.add': 'Add payout rules',
  'account.prop-challenge.payout-rules.remove': 'Remove payout rules',
  'account.prop-challenge.payout-rules.cycle': 'Eligibility cycle',
  'account.prop-challenge.payout-rules.request-window': 'Request timing',
  'account.prop-challenge.payout-rules.request-window.anytime': 'Any day',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'Specific weekdays',
  'account.prop-challenge.payout-rules.request-window.time-zone': 'Time zone',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'Allowed request days',
  'account.prop-challenge.payout-rules.cycle.none': 'No waiting cycle',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'Trading days',
  'account.prop-challenge.payout-rules.cycle.qualifying-days':
    'Qualifying days',
  'account.prop-challenge.payout-rules.cycle.calendar-days': 'Calendar days',
  'account.prop-challenge.payout-rules.days': 'Required days',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'Minimum daily profit',
  'account.prop-challenge.payout-rules.anchor': 'Cycle starts from',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'Stage start',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'First trade',
  'account.prop-challenge.payout-rules.minimum-balance':
    'Minimum account balance',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Minimum cycle profit',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'Minimum cycle profit by payout number',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'Require positive cycle profit after first payout',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Maximum best-day share (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'Maximum best-day share by payout number (%)',
  'account.prop-challenge.payout-rules.availability': 'Available profit',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Above starting balance',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Above balance floor',
  'account.prop-challenge.payout-rules.balance-floor': 'Balance floor',
  'account.prop-challenge.payout-rules.request-percent':
    'Withdrawable share (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'New profit required from each request (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'Caps the request so the configured percentage is backed by profit earned during the current payout cycle. For example, 50% allows a request up to twice current-cycle profit.',
  'account.prop-challenge.payout-rules.minimum-request': 'Minimum request',
  'account.prop-challenge.payout-rules.maximum': 'Maximum request',
  'account.prop-challenge.payout-rules.maximum.none': 'No maximum',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Fixed maximum',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'First payout maximum only',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Maximum by payout number',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'Percentage of cycle profit',
  'account.prop-challenge.payout-rules.maximum-amount': 'Maximum amount',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'First payout maximum',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'Maximum cycle profit (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'Keep using the final amount for later payouts',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'Keep using the final value for later payouts',
  'account.prop-challenge.payout-rules.schedule': 'Amounts by payout number',
  'account.prop-challenge.payout-rules.profit-split': 'Trader profit share (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'Change limits after lifetime qualifying days',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    'Counts qualifying days across the whole funded phase, even when payout cycles reset.',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'Lifetime qualifying days required',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'Availability after unlock',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'Balance floor after unlock',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'Available profit after unlock (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'Maximum request after unlock',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'Maximum amount after unlock',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'Maximum schedule after unlock',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'Maximum cycle-profit percentage after unlock',
  'account.prop-challenge.payout-rules.profit-split-model':
    'Profit split model',
  'account.prop-challenge.payout-rules.profit-split.fixed': 'Fixed percentage',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    'Changes after cumulative payouts',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'Changes by account profit',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'Initial trader share (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'Cumulative payout threshold',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'Trader share after threshold (%)',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'Lifetime account profit equals current balance minus starting balance plus prior withdrawals. The below or at/above percentage applies to the entire request.',
  'account.prop-challenge.payout-rules.profit-split.below':
    'Trader share below threshold (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'Account profit threshold',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'Trader share at or above threshold (%)',
  'account.prop-challenge.payout-rules.maximum-payouts': 'Maximum payouts',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'After final payout',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'Continue account',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'Conclude account',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'Advance to next stage',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'Eligible for live review',
  'account.prop-challenge.payout-rules.aftermath': 'After an approved payout',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'Deduct payout; keep drawdown floor',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'Deduct payout; lock drawdown floor',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'Reset account and drawdown',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'Drawdown floor after payout',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'First payout ignores minimum cycle profit',
  'account.prop-challenge.payout-rules.reset-cycle':
    'Reset eligibility cycle after payout',
  'account.prop-challenge.payout-rules.group.eligibility': 'Eligibility',
  'account.prop-challenge.payout-rules.group.availability': 'Available payout',
  'account.prop-challenge.payout-rules.group.terms': 'Payout terms',
  'account.prop-challenge.payout-rules.group.aftermath': 'After payout',
  'account.prop-challenge.payout.requirement.elapsed-hours': 'Elapsed time',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Minimum elapsed hours',

  
  'account.merge.challenge.move-earlier': 'Move {account} earlier',
  'account.merge.challenge.move-later': 'Move {account} later',
  'account.merge.warning.use-profile-balance': 'Use profile balance',
  'account.merge.warning.edit-phases': 'Edit phases',
  'account.merge.title': 'Challenge setup',
  'account.merge.loading': 'Loading...',
  'account.merge.step.accounts': 'Accounts',
  'account.merge.step.phases': 'Phases',
  'account.merge.step.review': 'Review',
  'account.merge.accounts.title': 'Accounts to merge',
  'account.merge.accounts.show-archived': 'Show archived',
  'account.merge.accounts.empty': 'No eligible accounts',
  'account.merge.target.title': 'Target account',
  'account.merge.target.keep': 'Keep',
  'account.merge.target.new': 'New name',
  'account.merge.phase.name': 'Phase',
  'account.merge.phase.status': 'Status',
  'account.merge.phase.started': 'Started',
  'account.merge.phase.completed': 'Completed',
  'account.merge.phase.no-rules': 'None',
  'account.merge.review.notes': 'trades moved',
  'account.merge.review.identities': 'broker accounts',
  'account.merge.warning.trade-outside-window':
    'Trades outside their phase window',
  'account.merge.warning.identity-shared':
    'Identity claimed by several accounts',
  'account.merge.warning.copy-trading-dropped': 'Copy trading periods dropped',
  'account.merge.error.too-few-sources': 'Select at least two accounts.',
  'account.merge.error.duplicate-source': 'An account is listed twice.',
  'account.merge.error.target-exists': 'That name belongs to another account.',
  'account.merge.error.currency-mismatch': 'Accounts use different currencies.',
  'account.merge.error.timeline-not-monotonic':
    'Phase start times must increase.',
  'account.merge.error.invalid-override': 'Check this phase’s dates.',
  'account.merge.error.source-missing': 'An account has no saved settings.',
  'account.merge.error.unknown': 'Merge failed.',
  'account.merge.action.merge': 'Merge',
  'account.merge.action.undo': 'Undo',
  'account.merge.action.delete': 'Delete legacy accounts',
  'account.merge.notice.converted': 'Converted to a challenge',
  'account.merge.notice.title': 'Merged from {accounts}',
  'account.merge.notice.error': 'Action failed.',
  'account.merge.undo.title': 'Undo merge',
  'account.merge.undo.message':
    'Restores the legacy accounts and their trades.',
  'account.merge.delete.title': 'Delete legacy accounts',
  'account.merge.delete.message':
    'Deletes the archived legacy accounts. This cannot be undone.',
  'command.open-legacy-challenge-onboarding': 'Set up prop challenges',
  'account.merge.step.challenge': 'Challenge',
  'account.merge.action.convert': 'Convert',
  'account.merge.profile.applied': 'Applied: {firm} · {challenge}',
  'account.merge.profile.remove': 'Remove',
  'account.merge.phase.apply-profile': 'Apply a firm profile',
  'account.merge.profile.replace-rules.title': 'Replace hand-typed rules?',
  'account.merge.profile.replace-rules.body':
    "{firm}'s profile defines every phase's rules. The rules you typed on this page will be replaced.",
  'account.merge.profile.replace-rules.confirm': 'Replace rules',
  'guide.legacy-setup.list.title':
    'Every account without a challenge is listed here',
  'guide.legacy-setup.list.description':
    'Decide per account. Leaving one as is keeps it exactly as it was; you can always set it up later from dashboard settings.',
  'guide.legacy-setup.assign.title': 'Group phases of one challenge together',
  'guide.legacy-setup.assign.description':
    'Accounts that were phases of the same challenge go in one group (we suggest groups from matching names). An account on its own becomes a single-phase challenge.',
  'guide.legacy-setup.continue.title': 'One short setup per challenge',
  'guide.legacy-setup.continue.description':
    'Continue opens the challenge setup for each group in turn. Nothing changes until you confirm each one.',
  'guide.merge-wizard.target.title': 'One account keeps the history',
  'guide.merge-wizard.target.description':
    'The target account survives with every phase attached. The others are archived, not deleted, and their trades move to the target.',
  'guide.merge-wizard.identity.title': 'Name the firm and challenge',
  'guide.merge-wizard.identity.description':
    'Applying a firm profile fills in the real rules and the funded phase. Without one, review and edit each phase’s rules on the next page.',
  'guide.merge-wizard.phases.title': 'Check each phase',
  'guide.merge-wizard.phases.description':
    'Set the stage type, mark phases you completed as Passed and the one you are in as Active, and confirm the dates.',
  'guide.merge-wizard.review.title': 'Nothing happens until you confirm',
  'guide.merge-wizard.review.description':
    'Check the trades moved and accounts archived, and read any warnings. Merge applies everything; you can undo it from the account page.',
  'account.merge.challenge.accounts': 'Accounts',
  'account.merge.challenge.order-hint': 'Oldest phase first',
  'account.merge.challenge.single-hint':
    'This account becomes a challenge on its own',
  'account.merge.phase.identities-count': '{count} identities',
  'account.merge.phase.pending': 'Pending',
  'account.merge.review.phases': 'phases',
  'account.merge.review.archived': 'archived',
  'account.merge.review.open': 'open',
  'account.merge.sequence': 'Challenge {index} of {total}',
  'account.merge.warning.balance-differs':
    'Starting balance differs from the firm profile',
  'account.merge.error.profile-phase-mismatch':
    'More accounts than phases in the firm profile',
  'account.merge.error.profile-currency-mismatch':
    'Profile currency differs from these accounts.',
  'account.merge.error.source-changed':
    'An account changed. Review the merge again.',
  'account.merge.error.multiple-active-phases':
    'Only the last account can still be active.',
  'account.merge.error.phases-after-failed-source':
    'A failed account ends the challenge, so it must be the last one selected.',
  'account.merge.error.copy-trading-overlap':
    'Copy-trading periods overlap. Close one first.',
  'onboarding.legacy-challenge.legend':
    'Group accounts that were phases of one challenge. An account on its own becomes a challenge by itself.',
  'onboarding.legacy-challenge.assign.leave': 'Leave as is',
  'onboarding.legacy-challenge.assign.own': 'Own challenge',
  'onboarding.legacy-challenge.assign.group': 'Challenge {letter}',
  'onboarding.legacy-challenge.assign.new-group': 'New challenge…',
  'onboarding.legacy-challenge.action.continue': 'Continue',
  'onboarding.legacy-challenge.action.continue-count': 'Set up {count}',
  'guide.action-step.dismiss': 'Not now',
  'guide.legacy-challenge.title': 'Your existing accounts',
  'guide.legacy-challenge.description':
    'Combine accounts that were phases of one challenge, or turn an account into a challenge on its own.',
  'guide.legacy-challenge.action': 'Set up my accounts',
  'onboarding.legacy-challenge.title': 'Prop challenges',
  'onboarding.legacy-challenge.action.skip': 'Skip',
  'onboarding.legacy-challenge.accounts.show-archived': 'Show archived',
  'onboarding.legacy-challenge.accounts.empty': 'No accounts to set up',
  'onboarding.legacy-challenge.loading': 'Loading...',
  'onboarding.legacy-challenge.suggested': 'Suggested',
  'onboarding.legacy-challenge.row.aria': 'Action for {account}',
  'onboarding.legacy-challenge.status.combined': 'Combined',
  'onboarding.legacy-challenge.status.converted': 'Converted',
  'onboarding.legacy-challenge.entry.name': 'Prop challenges',
  'onboarding.legacy-challenge.entry.desc':
    'Combine or convert existing accounts into challenges.',
  'onboarding.legacy-challenge.entry.action': 'Set up',

  'view.home': 'Home',
  'common.lose': 'Lose',

  'dashboard.conversion.requires-conversion':
    'Multi-currency P&L charts require exchange-rate conversion.',

  'auth.error.invalid-email': 'Please enter a valid email address',
  'auth.error.invalid-code': 'Invalid verification code',
  'form.layout.guide-trigger-label': 'Customize form',
  'dashboard.filter.setup.none-found': 'No setups found',
  'nav.weekly': 'Weekly Review',
  'weekly.overview.drawdown-chart.empty': 'No drawdown data to display',
  'trade-sync.gate.signin.cta': 'Sign in',
  'backend.progress.ftp.desc': 'Create credentials',
  'csv.errors.group.close-only': 'Close-only executions were skipped',
  'csv.report.file': 'File: {file}',
  'csv.broker-guide.sierrachart.warning.message':
    'The Export option saves unadjusted prices. Save Log As preserves prices as displayed.',
  'csv.broker-guide.rithmic.step-1':
    'Open Order History in R | Trader Pro and filter to Completed/Filled orders for your account/date',
  'csv.broker-guide.rithmic.step-2':
    'Use Add/Remove Columns and make sure Side, Symbol, Qty Filled, Avg Fill Price, and Fill/Update Time are visible',
  'trade.details.execution': 'Execution',
  'drc.preparation.checklist.title': 'Pre-Trade Checklist',
  'onboarding.welcome.insight.timing.title': 'Timing Patterns',
  'onboarding.wizard.error.account-service': 'AccountPageService not available',
  'account.edit.field.drawdown-type-desc':
    'None | Fixed | EOD Trailing | Manual',
  'monthly.game.header.a-games': 'A Games',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
  'setups.view.action.refresh': 'Refresh',
  'setups.view.detail.no-playbook': 'No playbook written yet.',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'trade-sync.import.action.sync-cloud': 'Sync cloud trades',
  'session-mode.unconfigured.step.gate.description':
    'Starter IF/THEN checklist is ready.',
  'session-log.placeholder.entry': 'What are you seeing, thinking, or feeling?',

  'home.widget.streak.kind.trade-outcome': 'Trade outcomes',
  'home.widget.streak.kind.trade-review': 'Trade reviews',
  'home.widget.streak.kind.drc-review': 'DRC reviews',
  'home.widget.streak.kind.weekly-review': 'Weekly reviews',
  'home.widget.streak.kind.monthly-review': 'Monthly reviews',
  'home.widget.streak.configure': 'Choose streak type',
  'home.widget.streak.configure-aria': 'Configure {kind} streak',
  'home.widget.streak.no-review-streak': 'no active review streak',
  'home.widget.streak.start-reviewing': 'start reviewing to build a streak',
  'home.widget.streak.keep-reviewing': 'keep reviewing to continue',
  'home.widget.streak.reviewed-trades-in-a-row.one': 'trade reviewed in a row',
  'home.widget.streak.reviewed-trades-in-a-row.few': 'trades reviewed in a row',
  'home.widget.streak.reviewed-trades-in-a-row.many':
    'trades reviewed in a row',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'trades reviewed in a row',
  'home.widget.streak.reviewed-days-in-a-row.one': 'day reviewed in a row',
  'home.widget.streak.reviewed-days-in-a-row.few': 'days reviewed in a row',
  'home.widget.streak.reviewed-days-in-a-row.many': 'days reviewed in a row',
  'home.widget.streak.reviewed-days-in-a-row.other': 'days reviewed in a row',
  'home.widget.streak.reviewed-weeks-in-a-row.one': 'week reviewed in a row',
  'home.widget.streak.reviewed-weeks-in-a-row.few': 'weeks reviewed in a row',
  'home.widget.streak.reviewed-weeks-in-a-row.many': 'weeks reviewed in a row',
  'home.widget.streak.reviewed-weeks-in-a-row.other': 'weeks reviewed in a row',
  'home.widget.streak.reviewed-months-in-a-row.one': 'month reviewed in a row',
  'home.widget.streak.reviewed-months-in-a-row.few': 'months reviewed in a row',
  'home.widget.streak.reviewed-months-in-a-row.many':
    'months reviewed in a row',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'months reviewed in a row',
  'home.widget.streak.missed-trades.one':
    'missed {count} trade since your last review',
  'home.widget.streak.missed-trades.few':
    'missed {count} trades since your last review',
  'home.widget.streak.missed-trades.many':
    'missed {count} trades since your last review',
  'home.widget.streak.missed-trades.other':
    'missed {count} trades since your last review',
  'home.widget.streak.missed-days.one':
    'missed {count} day since your last review',
  'home.widget.streak.missed-days.few':
    'missed {count} days since your last review',
  'home.widget.streak.missed-days.many':
    'missed {count} days since your last review',
  'home.widget.streak.missed-days.other':
    'missed {count} days since your last review',
  'home.widget.streak.missed-weeks.one':
    'missed {count} week since your last review',
  'home.widget.streak.missed-weeks.few':
    'missed {count} weeks since your last review',
  'home.widget.streak.missed-weeks.many':
    'missed {count} weeks since your last review',
  'home.widget.streak.missed-weeks.other':
    'missed {count} weeks since your last review',
  'home.widget.streak.missed-months.one':
    'missed {count} month since your last review',
  'home.widget.streak.missed-months.few':
    'missed {count} months since your last review',
  'home.widget.streak.missed-months.many':
    'missed {count} months since your last review',
  'home.widget.streak.missed-months.other':
    'missed {count} months since your last review',
  'trade-handoff.action.view-trades-count.one': 'View {count} trade',
  'trade-handoff.action.view-trades-count.few': 'View {count} trades',
  'trade-handoff.action.view-trades-count.many': 'View {count} trades',
  'trade-handoff.action.view-trades-count.other': 'View {count} trades',
  'trade-handoff.action.review-now': 'Review now',
  'trade-handoff.action.open-period': 'Open {period} review',
  'trade-handoff.review.creation-disabled':
    'That review does not exist and automatic review creation is disabled.',
  'trade-handoff.review.open-failed': 'Could not open that review.',
  'trade-handoff.trades.open-failed': 'Could not open the Trade Log.',
  'trade-handoff.scope.label':
    'Showing {trades} from the latest operation for {accounts}',
  'trade-handoff.scope.exit': 'Exit operation view',
  'trade-handoff.trade-count.one': '{count} trade',
  'trade-handoff.trade-count.few': '{count} trades',
  'trade-handoff.trade-count.many': '{count} trades',
  'trade-handoff.trade-count.other': '{count} trades',
  'trade-handoff.title.sync': 'Synchronization complete',
  'trade-handoff.summary.import-complete': '{trades} imported',
  'trade-handoff.summary.import-partial': '{trades} imported with issues',
  'trade-handoff.summary.sync-complete': '{trades} synchronized',
  'trade-handoff.summary.sync-partial': '{trades} synchronized with issues',
  'trade-handoff.periods.choose': 'Choose another review period',
  'trade-handoff.periods.recommended': 'Recommended',
  'trade-handoff.action.dismiss': 'Dismiss recent trade result',
  'sample.action.try': 'Try a sample journal',
  'sample.action.reset': 'Reset sample',
  'sample.popout.title': 'Sample journal',
  'sample.popout.action.exit': 'Exit sample',
  'sample.popout.description': 'Changes here are for practice only.',
  'sample.popout.closed': 'Practice journal saved and closed.',
  'sample.popout.recovery': 'Practice journal needs recovery.',
  'sample.notice.sync-blocked':
    'You are editing fictional sample data. Backend sync is paused.',
  'sample.notice.folder-locked':
    'The journal folder cannot be changed while the sample journal is active.',
  'sample.empty.description':
    'Explore a populated fictional journal without changing your journal files or settings.',
  'sample.progress.creating':
    'Creating sample journal: {completed} of {total} items',
  'sample.progress.removing':
    'Removing sample journal: {completed} of {total} items',
  'sample.progress.verifying':
    'Checking sample journal: {completed} of {total} items',
  'sample.exit.title': 'Exit sample journal?',
  'sample.exit.remove-warning':
    'Removing deletes edits inside manifest-owned sample files. Files without provable sample ownership are preserved.',
  'sample.exit.remove': 'Exit and remove',
  'sample.reset.title': 'Reset sample journal?',
  'sample.reset.message':
    'This restores every sample file and sample-only setting to the original fictional pack.',
  'sample.reset.warning':
    'Your edits inside the sample journal will be deleted.',
  'sample.collision.title': 'Sample folder already exists',
  'sample.collision.message':
    'Journalit will not overwrite the existing folder. Create the sample journal at “{path}” instead?',
  'sample.collision.confirm': 'Use available folder',
  'sample.notice.ready': 'Sample journal is ready.',
  'sample.notice.reset': 'Sample journal restored.',
  'sample.notice.reset-preserved':
    'Sample journal restored. {count} files without provable ownership were preserved.',
  'sample.notice.removed': 'Sample journal removed.',
  'sample.notice.removed-preserved':
    'Sample journal removed. {count} files without provable ownership were preserved.',
  'sample.notice.error': 'Sample journal operation failed: {error}',
  'command.open-sample-journal': 'Open sample journal',
  'command.exit-sample-journal': 'Exit sample journal',
  'command.reset-sample-journal': 'Reset sample journal',
  'sample.notice.busy':
    'Another sample journal operation is already in progress.',
};

export type TranslationKey = keyof typeof en;
export type Lang = typeof en;
export default en;
