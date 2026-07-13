

const en = {
  
  
  

  
  'command.add-trade': 'Add new trade',
  'command.import-trades-csv': 'Open Trade Import',

  
  'command.create-drc': 'Open DRC (daily report card)',
  'command.create-weekly-review': 'Open weekly review',
  'command.create-monthly-review': 'Open monthly review',
  'command.create-quarterly-review': 'Open quarterly review',
  'command.create-yearly-review': 'Open yearly review',

  
  'command.open-dashboard': 'Open trading dashboard',
  'command.open-account-dashboard': 'Open account dashboard',
  'command.open-trade-log': 'Open trade log',
  'command.open-home': 'Open home view',
  'command.open-position-size-calculator': 'Open position size calculator',

  

  
  'command.replay-onboarding': 'Replay onboarding flow',
  'command.replay-current-view-guide': 'Replay guide for current view',
  'command.open-release-notes': 'View release notes',

  
  'command.open-layout-builder': 'Open layout builder',
  'command.switch-template': 'Switch layout',

  
  'notice.guide.replay-unavailable':
    'Guide system is not ready yet. Please try again.',
  'notice.guide.no-active-view':
    'Open a supported Journalit view first, then run this command.',
  'notice.guide.no-guide-for-view':
    'No guide is registered for this view yet ({viewType}).',
  'notice.guide.replay-failed': 'Failed to start the guide. Please try again.',
  'notice.guide.replay-started': 'Guide restarted for this view.',

  
  
  
  'template.switch-title': 'Switch layout',
  'template.switch-trade-title': 'Switch trade layout',
  'template.switch-review-title': 'Switch {type} layout',
  'template.no-template': 'No layout',
  'template.label': 'Layout',
  'template.assign-to-note': 'Assign a layout to this note',
  'template.switch-action': 'Switch layout',
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
  'auth.desc.email':
    'Enter your email address to receive a verification code for Journalit access.',
  'auth.label.email': 'Email address',
  'auth.placeholder.email': 'your.email@example.com',
  'auth.button.send-code': 'Send verification code',
  'auth.button.sending': 'Sending...',
  'auth.desc.code':
    "We've sent a 6-digit verification code to {email}. Please enter it below to complete your sign-in.",
  'auth.label.code': 'Verification code',
  'auth.placeholder.code': '123456',
  'auth.button.verify': 'Verify & sign in',
  'auth.button.verifying': 'Verifying...',
  'auth.button.resend': 'Resend code',
  'auth.footer.trouble':
    'Having trouble? The verification code expires in 15 minutes.',
  'auth.footer.resend-wait':
    ' You can request a new code in {seconds} seconds.',
  'auth.footer.resend-now':
    ' You can now resend the code using the button above.',
  'auth.footer.enter-email':
    ' Enter your email to receive a verification code.',
  'auth.error.invalid-email': 'Please enter a valid email address',
  'auth.error.enter-code': 'Please enter the verification code',
  'auth.error.code-digits': 'Verification code should be 6 digits',
  'auth.error.too-many-requests':
    'You have requested too many codes. Please wait 30 minutes and try again.',
  'auth.error.send-failed': 'Failed to send verification code',
  'auth.error.verify-failed': 'Failed to verify code',
  'auth.error.resend-failed': 'Failed to resend verification code',
  'auth.error.invalid-code': 'Invalid verification code',

  
  'auth.status.disconnected': 'Signed out',
  'auth.error.token-expired':
    'Your session has expired. Please sign in again to continue using Pro features.',
  'auth.error.failed': 'Unable to authenticate. Please try again.',
  'auth.error.failed-reason': 'Unable to authenticate: {reason}',
  'auth.error.token-invalid': 'Token is no longer valid',
  'auth.error.server-validation-failed': 'Server validation failed',
  'auth.error.invalid-user-data': 'Invalid user data received',
  'auth.error.needs-auth':
    'Sign in to access Pro features. Basic features are still available.',
  'auth.error.needs-premium': 'Pro feature',
  'auth.error.needs-premium-desc':
    'This is a Pro feature. Visit our website to subscribe and unlock.',
  'auth.error.network-error': 'Connection error',
  'auth.error.network-error-verify':
    'Unable to verify Pro access. Check your connection or continue with basic features.',
  'auth.error.network-error-basic':
    'Working offline. Basic features are still available.',
  'auth.error.offline-expired':
    'Offline grace period expired. Please reconnect to continue using Pro features.',
  'auth.expiry-warning-tomorrow':
    'Your session expires tomorrow. Please sign in again soon to continue using Pro features.',
  'auth.expiry-warning-days':
    'Your session expires in {days} days. Please sign in again to continue using Pro features.',
  'auth.offline.active':
    'Working in offline mode. Some Pro features may be limited.',
  'auth.offline.grace-remaining': 'Offline grace period: {days} days remaining',

  
  
  
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
  'form.section.custom-fields-desc':
    "Custom fields defined in your plugin settings. These fields will be saved to your trade's frontmatter.",
  'form.section.custom-fields-empty':
    'No custom fields configured. Go to Settings → Customization → Custom Trade Fields to add custom fields.',
  'form.section.custom-fields-empty-title': 'No advanced fields yet.',
  'form.section.custom-fields-empty-desc':
    'Create custom trade fields in Settings → Customization → Custom Trade Fields.',
  'form.section.attachments': 'Attachments',

  
  
  
  'form.tab.basic': 'Basic',
  'form.tab.details': 'Details',
  'form.tab.advanced': 'Advanced',

  
  
  
  'form.import-shortcut.open': 'Import trades',
  'form.layout.customize': 'Customise form',
  'form.layout.modal-title': 'Customise Trade Form',
  'form.layout.settings-title': 'Trade Form Layout',
  'form.layout.settings-desc':
    'Choose how you journal trades and which optional blocks appear in the trade form.',
  'form.layout.core-fields-note':
    'Trade type, account, asset type, instrument, direction, and the required price or P&L inputs stay visible based on the selected input mode.',
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
  'form.layout.item.realized-pnl-preview': 'Partial exit P&L summary',
  'form.layout.item.realized-pnl-preview-desc':
    'Only appears for open trades after partial exits; its position is fixed.',
  'form.layout.result-r': 'Result in R',
  'form.layout.entry-time': 'Trade time',

  
  
  
  'form.field.account': 'Account',
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
  'form.field.swap-tooltip.forex':
    'Interest rate differential between currencies when holding positions overnight',
  'form.field.swap-tooltip.cfd':
    'Overnight financing cost for leveraged CFD positions',
  'form.field.swap-tooltip.default':
    'Overnight financing cost charged/credited for holding positions',
  'form.field.other-fees': 'Other Fees',
  'form.field.stop-loss': 'Stop Loss',
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Target Price',
  'form.field.close-percent': 'Close %',
  'form.field.risk-amount': 'Risk Amount',
  'form.field.profit-loss': 'Profit/Loss',
  'form.field.total-pnl': 'Trade P&L',
  'form.field.realized-pnl': 'Realized P&L',
  'form.field.total-costs': 'Total Costs:',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Mistake',
  'form.field.custom-tags': 'Custom Tags',
  'form.field.trade-thesis': 'Trade Thesis',
  'form.field.time': 'Time',
  'form.field.price': 'Price',
  'form.field.size': 'Size',
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
  'form.account-empty-state.title': 'Create an account before adding a trade',
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

  
  'form.field.lot-size.standard': 'Standard (100,000)',
  'form.field.lot-size.mini': 'Mini (10,000)',
  'form.field.lot-size.micro': 'Micro (1,000)',
  'form.field.lot-size.custom': 'Custom',

  
  'form.field.image-url-placeholder': 'Paste media URL or file path...',
  'form.field.image-duplicate-error': 'This image is already added.',
  'form.field.trade-image-alt': 'Trade Image',
  'image.loading': 'Loading...',
  'image.load-failed': 'Failed to load image',
  'form.field.value-dollar': 'Value ($)',
  'form.field.dollar-amount-placeholder': 'Dollar amount',
  'form.field.direct-pnl-placeholder': 'Enter profit or loss amount',
  'form.field.mae-dollar-placeholder': 'Max drawdown in dollars',
  'form.field.mfe-dollar-placeholder': 'Max profit in dollars',
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
  'form.placeholder.risk-amount': 'Planned risk in currency',
  'form.placeholder.custom-tag': 'Type a custom tag and press Enter',
  'form.placeholder.thesis': 'Enter your thesis for this trade...',
  'form.placeholder.pnl': 'Enter total profit or loss',
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
  'form.ideal-exit.subtitle': 'Hindsight scale-outs for execution review.',
  'form.ideal-exit.coverage': 'Ideal size',
  'form.ideal-exit.price': 'Ideal Price',
  'form.ideal-exit.size': 'Size',
  'form.ideal-exit.remove': 'Remove ideal exit',
  'form.ideal-exit.add': '+ Add Ideal Exit',
  'form.ideal-exit.copy-actual': 'Copy actual exits',

  'form.ideal-exit.tooltip':
    'Record the hindsight exit plan you wish you had executed. Supports scaled exits for capture review.',
  'form.ideal-exit.empty': 'No ideal exits yet',
  
  
  
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
  'button.done': 'Done',
  'button.edit': 'Edit',
  'button.delete': 'Delete',
  'button.update': 'Update',
  'button.add': 'Add',
  'button.create': 'Create',
  'button.reset': 'Reset',
  'button.reset-to-defaults': 'Reset to Defaults',
  'button.close': 'Close',
  'button.confirm': 'Confirm',
  'button.submit': 'Submit',
  'button.back': 'Back',

  'button.add-trade': 'Add Trade',
  'button.update-trade': 'Update Trade',
  'button.save-changes': 'Save Changes',
  'button.create-trade': 'Create Trade',
  'button.delete-all': 'Delete All',
  'button.clear-all': 'Clear All',
  'button.save-name-only': 'Save Name Only',
  'button.cancel-action': 'Cancel Action',
  'button.cancel-reset': 'Cancel Reset',
  'button.proceed-anyway': 'Proceed Anyway',
  'button.mark-reviewed': 'Mark Reviewed',
  'button.maybe-later': 'Maybe later',
  'button.upgrade-now': 'Upgrade now',
  'button.add-first-goal': 'Add Your First Goal',
  'button.add-first-event': 'Add Your First Event',
  'button.create-daily-review': 'Create Daily Review',
  'button.apply': 'Apply',
  'button.apply-settings': 'Apply Settings',
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
  'validation.map-required-fields':
    'Please map all required fields before importing',
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
  'trade.validation.lot-size-nonnegative': 'Lot size cannot be negative.',
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

  
  
  
  'notice.verification-sent': 'Verification code sent! Check your email.',
  'notice.login-success': 'Successfully logged in!',
  'notice.new-verification-sent':
    'New verification code sent! Check your email.',
  'notice.logout-success': 'Successfully signed out',
  'notice.ftp-created': 'FTP credentials created successfully',
  'notice.ftp-reset': 'FTP password reset successfully! Save the new password.',
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
  'notice.reset-timeframes': 'Reset timeframes to defaults',
  'notice.custom-fields-imported':
    'Successfully imported {count} custom fields',
  'notice.csv-parsed': 'CSV/XLSX/XLS parsed successfully: {count} rows',
  'notice.csv-validation-failed': 'CSV/XLSX/XLS validation failed: {errors}',
  'notice.csv-parse-failed': 'Failed to parse CSV/XLSX/XLS file: {error}',
  'notice.csv-complete-fields': 'Please complete all required fields',
  'notice.csv-invalid-selection': 'Invalid broker/template selection',
  'notice.csv-import-success': 'Successfully imported {count} trades!',
  'notice.csv-import-partial':
    'Imported {count} trades, skipped {duplicates} duplicates',
  'notice.csv-import-failed': 'Import failed: {error}',
  'notice.csv-import-report-copy-failed': 'Failed to copy import report',
  'notice.csv-template-saved':
    'Template saved. You can now select "{name}" for future imports.',
  'notice.csv-template-updated': 'Template "{name}" updated successfully',
  'notice.csv-template-update-failed': 'Failed to update template: {error}',
  'notice.csv-template-save-failed': 'Failed to save template: {error}',
  'notice.csv-template-deleted': 'Template "{name}" deleted',
  'notice.csv-template-delete-failed': 'Failed to delete template: {error}',
  'notice.csv-template-imported': 'Template "{name}" imported successfully',
  'notice.csv-symbol-mappings-created.one': 'Created {count} symbol mapping',
  'notice.csv-symbol-mappings-created.few': 'Created {count} symbol mappings',
  'notice.csv-symbol-mappings-created.many': 'Created {count} symbol mappings',
  'notice.csv-symbol-mappings-created.other': 'Created {count} symbol mappings',
  'notice.csv-symbol-mapping-skipped': 'Skipped symbol mapping',
  'notice.csv-missing-fields':
    'Please map all required fields before importing',
  'notice.setups-added': 'Added setups to {count} trades',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': 'Added mistakes to {count} trades',
  'notice.trades-deleted.one': 'Deleted {count} trade',
  'notice.trades-deleted.few': 'Deleted {count} trades',
  'notice.trades-deleted.many': 'Deleted {count} trades',
  'notice.trades-deleted.other': 'Deleted {count} trades',
  'notice.mark-reviewed.one': 'Marked {count} trade as reviewed',
  'notice.mark-reviewed.few': 'Marked {count} trades as reviewed',
  'notice.mark-reviewed.many': 'Marked {count} trades as reviewed',
  'notice.mark-reviewed.other': 'Marked {count} trades as reviewed',

  
  
  
  'notice.error.template-name-required': 'Please enter a template name',
  'notice.error.template-name-exists': 'Template name already exists',
  'notice.error.open-journalit':
    'Failed to open Journalit. Please try reloading Obsidian.',
  'notice.error.open-drc': 'Failed to open DRC: {error}',
  'notice.error.open-dashboard': 'Failed to open dashboard: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-account-dashboard':
    'Failed to open account dashboard: {error}',
  'notice.error.open-trade-form-edit':
    'Failed to open trade form in edit mode: {error}',
  'notice.error.open-weekly-review': 'Failed to open Weekly Review: {error}',
  'notice.error.open-monthly-review': 'Failed to open Monthly Review: {error}',
  'notice.error.open-quarterly-review':
    'Failed to open Quarterly Review: {error}',
  'notice.error.open-yearly-review': 'Failed to open Yearly Review: {error}',
  'notice.error.open-onboarding':
    'Failed to open onboarding flow. Check console for details.',
  'notice.error.sync-trades': 'Failed to sync trades: {error}',
  'notice.error.open-release-notes': 'Failed to open release notes: {error}',
  'notice.error.open-update-notification':
    'Failed to open update notification: {error}',
  'notice.error.open-layout-builder': 'Failed to open Layout Builder: {error}',
  'notice.error.switch-template': 'Failed to switch layout: {error}',
  'notice.error.switch-template-generic': 'Failed to switch layout',
  'notice.error.plugin-not-available': 'Plugin not available',
  'notice.error.open-template-picker': 'Failed to open layout picker',
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

  'notice.error.invalid-drc-date': 'Invalid DRC date',
  'notice.error.invalid-drc-missed':
    'Invalid DRC date. Cannot create missed trade.',
  'notice.error.invalid-weekly-review-date':
    'Invalid weekly review date. Cannot save forecast image.',
  'notice.error.cannot-change-folder-during-sync':
    'Cannot change folder path while sync is in progress. Please wait for sync to complete.',
  'notice.error.file-not-found': 'File not found: {path}',
  'notice.error.trade-not-found': 'Trade file not found: {path}',
  'notice.error.mark-reviewed': 'Error marking trades as reviewed: {error}',
  'notice.error.add-setups': 'Error adding setups: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'Error adding mistakes: {error}',
  'notice.error.delete-trades': 'Error deleting trades: {error}',
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

  
  
  
  'notice.info.no-sync': 'No sync in progress',
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

  'form.layout.guide-trigger-label': 'Customize form',
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
  'tradelog.guide.empty.state.title': 'Start by adding your first trade',
  'tradelog.guide.empty.state.description':
    'You do not have any trades here yet. Click the Create Trade button to make your first trade, then come back to learn the full table and batch tools.',
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
  'tradelog.guide.multi-select.title': 'Turn on multi-select',
  'tradelog.guide.multi-select.description':
    'Click this button to select several trades at once. When multi-select is on, row clicks select trades instead of opening them.',
  'tradelog.guide.batch-actions.title': 'These are your batch actions',
  'tradelog.guide.batch-actions.description':
    'Use this bar to select all visible trades, clear your selection, mark trades as reviewed, add setups, add mistakes, or delete several trades at once. You can also shift-click to select a range of trades.',
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
    'This page gives you a quick view of your trading performance. Once you have trades, it becomes your daily command center.',
  'dashboard.guide.empty.state.title': 'Start by adding your first trade',
  'dashboard.guide.empty.state.description':
    'You do not have any trades yet. Add a trade manually or import data, then come back to unlock the full Dashboard tour.',
  'dashboard.guide.main.intro.title': 'This is your trading dashboard',
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
  'home.guide.intro.title': 'Welcome to Home',
  'home.guide.intro.description':
    'This is your main page. It shows your trading stats, quick actions, and shortcuts to the rest of Journalit.',
  'home.guide.filters.title': 'These buttons change what your widgets show',
  'home.guide.filters.description':
    'Use these to switch the time period, trade type, or account so your Home widgets show the data you want to look at.',
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
    'This picker lets you add more widgets and bring back quick links that you previously hid.',
  'home.guide.move-and-resize.description':
    'This is the main area you can rearrange in edit mode. Drag widgets to move them, or drag a widget from its bottom-right corner to resize it.',
  'home.guide.add-widget.title': 'Add widgets or bring back hidden quick links',
  'home.guide.add-widget.description':
    'Click Add Widget to open the picker, where you can add more widgets and restore quick links that you previously hid.',
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
    'This list shows every widget you can add for this review type. Pick any widget you want, or press Next and Journalit will choose the first one for you.',
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
  'tradelog.node.no-review-available': 'No review available for {type}: {id}',
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
  'tradelog.copy-trade.adjustment-prompt':
    'Enter the manual PnL adjustment for this copied trade. Use a negative number for worse fills/costs.',
  'tradelog.copy-trade.adjustment-invalid': 'Enter a valid PnL adjustment.',
  'tradelog.copy-trade.adjustment-saved': 'Copied trade PnL adjustment saved.',
  'tradelog.tooltip.still-open': 'still open',
  'tradelog.tooltip.performance-trade': '{indicator} performing trade',
  'tradelog.tooltip.performance-trade-on':
    '{indicator} performing trade on {date}',
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
  'tradelog.batch.mark-reviewed.title': 'Mark selected trades as reviewed',
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
  'tradelog.batch.add-setups.title': 'Add setups to selected trades',
  'tradelog.batch.add-setups.label': 'Add Setups',
  'tradelog.batch.add-tags.aria': 'Add tags',
  'tradelog.batch.add-tags.title': 'Add tags to selected trades',
  'tradelog.batch.add-tags.label': 'Add Tags',
  'tradelog.batch.add-mistakes.aria': 'Add mistakes',
  'tradelog.batch.add-mistakes.title': 'Add mistakes to selected trades',
  'tradelog.batch.add-mistakes.label': 'Add Mistakes',
  'tradelog.batch.adding': 'Adding...',
  'tradelog.batch.add-count': 'Add ({count})',
  'tradelog.batch.delete.aria': 'Delete trades',
  'tradelog.batch.delete.title': 'Delete selected trades',
  'tradelog.batch.deleting': 'Deleting...',
  'tradelog.batch.clear.aria': 'Clear selection',
  'tradelog.batch.clear.title': 'Clear selection',
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
  'tradelog.column.mae': 'MAE $',
  'tradelog.column.mfe': 'MFE $',
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
    'Add some trades to see your dashboard come to life',
  'dashboard.empty.filter-hint': 'Try adjusting your filter settings',
  'dashboard.error.load-failed': 'Failed to load data',
  'dashboard.no-data': 'No trading data available',
  'dashboard.button.add-widget': 'Add Widget',
  'dashboard.button.save-layout': 'Save Layout',
  'dashboard.button.edit-layout': 'Edit Layout',

  
  'dashboard.metrics.netPnL': 'Net P&L',
  'dashboard.metrics.winRate': 'Win Rate',
  'dashboard.metrics.profitFactor': 'Profit Factor',
  'dashboard.metrics.sharpeRatio': 'Sharpe Ratio',
  'dashboard.metrics.expectancy': 'Expectancy',
  'dashboard.metrics.numTrades': 'Total Trades',
  'dashboard.metrics.closedTrades': 'Closed Trades',
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
  'dashboard.conversion.rates': 'Rates: ECB ({date})',
  'dashboard.conversion.using-ecb': 'Using ECB rates ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Using broker-provided base-currency P&L for {count} {tradeLabel}',
  'dashboard.conversion.trade-singular': 'trade',
  'dashboard.conversion.trade-plural': 'trades',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} of {total} trades ({excluded} excluded: {currencies})',
  'dashboard.conversion.original-pnl': 'Original P&L',
  'dashboard.conversion.converted-pnl': 'Converted P&L',
  'dashboard.conversion.details-label': 'Currency conversion details',
  'dashboard.conversion.requires-conversion':
    'Multi-currency P&L charts require exchange-rate conversion.',

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
  'dashboard.filter.accounts.select-all-option': '-- Select All --',
  'dashboard.filter.accounts.none-found': 'No accounts found',

  
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
  'dashboard.filter.setup.none-found': 'No setups found',

  
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
  'dashboard.widgets.hourly-performance.metric.total-pnl': 'Total P&L',
  'dashboard.widgets.hourly-performance.metric.avg-pnl': 'Avg P&L',
  'dashboard.widgets.hourly-performance.metric.total-r': 'Total R',
  'dashboard.widgets.hourly-performance.metric.avg-r': 'Avg R',
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
  'dashboard.rolling_win_loss.avg_win_label': 'Avg Win: {value}',
  'dashboard.rolling_win_loss.avg_loss_label': 'Avg Loss: {value}',

  
  
  
  'home.widget.recent-items.name': 'Recent Items',
  'home.widget.recent-items.description':
    'Shows recently opened files and views',
  'home.widget.year-heatmap.name': 'Trading Heatmap',
  'home.widget.year-heatmap.description':
    'Calendar showing your trading activity for the year',
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description':
    'Checklist to help you add your first trades and activate PRO',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.create.title': 'Create your first trade',
  'home.widget.getting-started.item.create.description':
    'Unlock your dashboard and journaling flow.',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Create Trade',
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
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    'Enable CSV import, MetaTrader sync, and AI mapping.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',
  'home.widget.weekly-summary.name': 'Weekly Summary',
  'home.widget.weekly-summary.description':
    'Current week metrics with daily P&L sparkline chart',
  'home.widget.position-size.name': 'Position Size Calculator',
  'home.widget.position-size.description':
    'Calculate position size based on account risk percentage',
  'home.widget.embedded-note.name': 'Embedded Note',
  'home.widget.embedded-note.description':
    'Display any markdown note from your vault',
  'home.widget.current-streak.name': 'Current Streak',
  'home.widget.current-streak.description':
    'Track your winning and losing streaks',
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

  
  
  
  'account.header.title': 'Account: {name}',
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
  'account.header.warning.earliest-trade':
    'Earliest trade: {date}. This may cause incorrect balance calculations.',
  'account.header.warning.fix-date.aria': 'Fix account created date',
  'account.header.warning.fixing': 'Fixing...',
  'account.header.warning.fix-date': 'Fix Date',
  'account.header.notice.date-updated':
    'Account created date updated to {date}',
  'account.header.notice.update-failed-log':
    'Failed to update account created date:',
  'account.header.notice.update-failed': 'Failed to update date: {error}',

  
  
  
  'ribbon.open-journalit': 'Open Journalit',

  
  
  
  'view.home': 'Home',
  'view.dashboard': 'Dashboard',
  'view.trade-log': 'Trade Log',
  'view.account-dashboard': 'Account Dashboard',
  'view.account-page.title': 'Account: {name}',
  'view.account-page.title-default': 'Account Page',
  'view.account-page.no-account-selected': 'No Account Selected',
  'view.account-page.no-account-instructions':
    'Please navigate to this page from the Account Dashboard.',
  'view.account-page.service-loading': 'Loading account page service...',
  'view.account-page.balance-chart-title': 'Account Balance Chart',
  'view.account-page.balance-chart-loading': 'Loading balance chart...',
  'view.layout-builder': 'Layout Builder',
  'view.csv-import': 'Trade Import',

  
  
  
  'nav.prev-day': 'Previous Day',
  'nav.prev-week': 'Previous Week',
  'nav.prev-month': 'Previous Month',
  'nav.prev-quarter': 'Previous Quarter',
  'nav.prev-year': 'Previous Year',
  'nav.drc': 'DRC',
  'nav.weekly': 'Weekly Review',
  'nav.monthly': 'Monthly Review',
  'nav.next-day': 'Next Day',
  'nav.next-week': 'Next Week',
  'nav.next-month': 'Next Month',
  'nav.weekly-review': 'Weekly Review',
  'nav.monthly-review': 'Monthly Review',
  'nav.quarterly-review': 'Quarterly Review',
  'nav.yearly-review': 'Yearly Review',
  'nav.edit-trade': 'Edit Trade',

  
  
  
  'review.loading': 'Loading {name}...',
  'review.failed-to-load':
    'Failed to load {name}. Please try refreshing the page.',
  'review.date-unknown': 'Unknown',
  'review.error.failed-to-navigate': 'Failed to navigate to path',
  'review.error.update-failed': 'Error updating {name}',
  'review.error.update-file-failed': 'Failed to update {name} in file',

  
  
  
  'status-bar.update-available': 'Update available',
  'status-bar.update-aria-label': 'Journalit {version} - Click to view',

  
  
  
  'template.transformation.orphaned-content.header':
    'Content from Previous Layout',
  'template.transformation.orphaned-content.desc1':
    'The following content did not fit the new layout.',
  'template.transformation.orphaned-content.desc2':
    'Review and integrate it above, or delete if no longer needed.',

  
  
  
  'template.editor.loading': 'Loading layout...',
  'template.editor.built-in': 'Built-in',
  'template.editor.unsaved-changes': 'Unsaved changes',
  'template.editor.review-title': 'Trade Review',
  'template.editor.built-in-notice':
    'Built-in layouts cannot be edited. Duplicate this layout or create a new one to customise.',
  'template.editor.show-review': 'Show Review Section',
  'template.editor.show-review-desc':
    'When to display the review section on trade notes',
  'template.editor.show-review.always': 'Always',
  'template.editor.show-review.losses-only': 'Losses Only',
  'template.editor.show-review.never': 'Never',
  'template.editor.show-missed': 'Show for Missed Trades',
  'template.editor.show-missed-desc':
    'Also display review section on missed trade notes',
  'template.editor.show-backtest': 'Show for Backtest Trades',
  'template.editor.show-backtest-desc':
    'Also display review section on backtest trade notes',
  'template.editor.sections': 'Review Sections',
  'template.editor.add-section': '+ Add Section',
  'template.editor.no-sections': 'No review sections configured.',
  'template.editor.add-section-hint': ' Click "+ Add Section" to create one.',
  'template.editor.win-sections': 'Win Sections',
  'template.editor.loss-sections': 'Loss Sections',
  'template.editor.win-sections-desc': 'Shown on winning and breakeven trades',
  'template.editor.loss-sections-desc': 'Shown on losing trades',
  'template.editor.section-visibility': 'Section Visibility',
  'template.editor.trade-note-layout': 'Trade Note Layout',
  'template.editor.layout-scope': 'Layout scope',
  'template.editor.layout-scope-desc':
    'Choose the default layout or edit one asset type page',
  'template.editor.all-asset-types': 'All asset types',
  'template.editor.other-asset-types': 'Others',
  'template.editor.default-layout': 'Default',
  'template.editor.asset-type-add': 'Asset type',
  'template.editor.choose-asset-type': 'Choose asset type',
  'template.editor.remove-asset-layout': 'Remove asset layout',
  'template.editor.reset-asset-layout': 'Reset asset layout',
  'template.editor.reset-asset-layout-desc':
    'Remove this asset-specific layout and use All asset types',
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
  'template.editor.asset-type-overrides': 'Asset Type Overrides',
  'template.editor.asset-type': 'Asset type',
  'template.editor.asset-type-desc':
    'Override section order and visibility for one asset class',
  'template.editor.enable-asset-override': 'Enable {assetType} override',
  'template.editor.asset-order': '{assetType} order',
  'template.editor.reviewed-footer': 'Reviewed footer',
  'template.editor.metric.position-size': 'Position size',
  'template.editor.metric.execution-breakdown': 'Execution breakdown',
  'template.editor.metric.pnl': 'P&L',
  'template.editor.metric.r-multiple': 'R multiple',
  'template.editor.metric.costs': 'Costs',
  'template.editor.details': 'Trade Details',
  'template.editor.details-desc': 'Show entry, exit, and P&L details',
  'template.editor.review-button': 'Mark Reviewed Button',
  'template.editor.review-button-desc': 'Show button to mark trade as reviewed',
  'template.editor.section-type': 'Section Type',
  'template.editor.type.textarea': 'Text Area',
  'template.editor.type.checkbox': 'Single Checkbox',
  'template.editor.type.checkboxList': 'Checkbox List',
  'template.editor.type.header': 'Header',
  'template.editor.title-label': 'Title (supports **markdown**)',
  'template.editor.title-placeholder': 'Section title',
  'template.editor.content-label': 'Content (supports markdown)',
  'template.editor.content-placeholder': 'Header content',
  'template.editor.checkbox-label': 'Checkbox Label (supports markdown)',
  'template.editor.checkbox-placeholder': 'Checkbox label',
  'template.editor.placeholder-label': 'Placeholder Text',
  'template.editor.placeholder-hint': 'Placeholder text shown when empty',
  'template.editor.items-label': 'Checkbox Items',
  'template.editor.item-n': 'Item {n}',
  'template.editor.add-item': '+ Add Item',
  'template.editor.preview-fallback': '{type} section',

  
  
  
  'csv.uploader.drop-here': 'Drop CSV/XLSX/XLS/HTML file here',
  'csv.uploader.click-drag': 'Click to upload or drag and drop',
  'csv.uploader.hint': 'CSV/XLSX/XLS/HTML files only, max 10MB',

  'csv.preview-first-note':
    'Preview is free. Importing into your vault requires PRO activation.',
  'csv.preview.header-row.title': 'Header Row Selection',
  'csv.preview.header-row.help':
    'If your first row is a title/group row, choose the row that contains real column names.',
  'csv.preview.header-row.label': 'Header row',
  'csv.preview.header-row.range': 'Choose a row between 1 and {max}.',
  'csv.preview.header-row.preview': 'Selected header preview:',
  'csv.gate.import.title': 'PRO required to import',
  'csv.gate.import.description':
    'Importing trades into your vault is a PRO feature. Activate PRO to continue.',
  'csv.gate.templates.tooltip': 'PRO required (activate to use templates).',
  'csv.gate.ai.tooltip': 'PRO required (activate to use AI mapping).',

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
  'csv.mapper.mode.price-based': 'Price Based (Entry/Exit)',
  'csv.mapper.mode.direct-pnl': 'Direct PnL',
  'csv.mapper.asset-type.help':
    'Select the type of instrument in this file. This determines required fields and parsing logic.',
  'csv.mapper.date-format.title': 'Date Format in File',
  'csv.mapper.date-format.help':
    'How dates appear in your file. Important for ambiguous formats like 01/02/2024 (Jan 2 vs Feb 1).',
  'csv.mapper.date-format.placeholder': 'Select date format...',
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

  'csv.ai-mapper.header.title': 'Need Help?',
  'csv.ai-mapper.header.description':
    'AI can analyze your CSV and suggest field mappings (optional)',
  'csv.ai-mapper.button.label': 'Suggest Mappings with AI',
  'csv.ai-mapper.button.tooltip':
    'Uses AI to suggest column mappings. Requires backend connection.',
  'csv.ai-mapper.helper-text':
    'AI suggestions should be verified before importing — always review mappings for accuracy.',
  'csv.ai-mapper.status.analyzing': 'Analyzing CSV structure',
  'csv.ai-mapper.status.consulting': 'Consulting AI for column mappings',
  'csv.ai-mapper.status.processing': 'Processing AI suggestions',
  'csv.ai-mapper.status.taking-longer':
    'Taking longer than usual, still working',
  'csv.ai-mapper.notice.no-suggestions':
    'AI could not suggest mappings. Please map manually.',
  'csv.ai-mapper.notice.suggested-count':
    'AI suggested mappings for {count} columns',
  'csv.ai-mapper.notice.unavailable':
    'AI mapping unavailable. Please map columns manually or use a saved template.',

  'csv.template-save.title': 'Save Import Template',
  'csv.template-save.description':
    'Save these column mappings as a reusable template for future imports.',
  'csv.template-save.label.name': 'Template Name',
  'csv.template-save.placeholder.name': 'e.g., My Broker Format',
  'csv.template-save.button.save': 'Save Template',
  'csv.template-save.button.saving': 'Saving...',

  'csv.template-import.title': 'Import Template',
  'csv.template-import.description':
    'Paste a template share code (JTT-v1-... or JTT-v2-...) to import it into your vault.',
  'csv.template-import.label.share-code': 'Share Code',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',
  'csv.template-import.helper-text':
    'Template will be added to your local templates',
  'csv.template-import.button.import': 'Import Template',
  'csv.template-import.button.importing': 'Importing...',
  'csv.template-import.error.import-failed': 'Failed to import template',

  'csv.template-delete.title': 'Delete Template?',
  'csv.template-delete.description':
    'Are you sure you want to delete "{name}"? This action cannot be undone.',
  'csv.template-delete.button.delete': 'Delete Template',
  'csv.template-delete.button.deleting': 'Deleting...',

  'csv.export-template.title': 'Export Template: {name}',
  'csv.export-template.description':
    'Share this code with others to let them use your template configuration.',
  'csv.export-template.label.share-code': 'Share Code',
  'csv.export-template.helper-text':
    'Full code copied to clipboard when you click the button below',
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

  
  
  
  'csv.broker.loading': 'Loading brokers...',
  'csv.broker.loading-templates': 'Loading templates...',
  'csv.broker.select-placeholder': 'Select broker or template...',
  'csv.broker.label': 'Broker / Import Format',
  'csv.broker.helper-text':
    'Choose a supported broker or create a custom format',
  'csv.broker.hidden-count': '{count} hidden',
  'csv.broker.manage-hidden': 'Manage hidden brokers',
  'csv.broker.supported-brokers': 'Supported Brokers',
  'csv.broker.my-templates': 'My Templates',
  'csv.broker.show-more': 'Show {count} more',
  'csv.broker.show-less': 'Show less',
  'csv.broker.create-new': '+ Create New Format',
  'csv.broker.favorite-selected': 'Your favorite is auto-selected',
  'csv.broker.star-hint': 'Star a broker to auto-select it',
  'csv.broker.hidden-modal-title': 'Hidden Brokers',
  'csv.broker.no-hidden': 'No hidden brokers',
  'csv.broker.restore': 'Restore',
  'csv.broker.restore-all': 'Restore All',
  'csv.broker.hide-aria': 'Hide this broker',
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
  'csv.broker.jdr': 'JDR Securities Limited',

  'csv.account-selector.loading': 'Loading accounts...',
  'csv.account-selector.no-accounts': 'No accounts yet.',
  'csv.account-selector.create-account-hint':
    'Create one to start importing trades from CSV.',
  'csv.account-selector.create-account-cta': 'Create Account',
  'csv.account-selector.label': 'Select Account',
  'csv.account-selector.error.load-failed': 'Failed to load accounts',
  'csv.account-selector.favorite.remove': 'Remove from favorites',
  'csv.account-selector.favorite.set': 'Set as favorite',
  'csv.account-selector.show-less': 'Show less',
  'csv.account-selector.show-more': 'Show {count} more',
  'csv.account-selector.favorite.auto-selected':
    'Your favorite is auto-selected',
  'csv.account-selector.favorite.star-hint':
    'Star an account to auto-select it',

  
  
  
  'csv.results.import-successful': 'Import Successful!',
  'csv.results.successfully-imported-prefix': 'Successfully imported ',
  'csv.results.successfully-imported-suffix': ' trades',
  'csv.results.skipped-duplicates-prefix': 'Skipped ',
  'csv.results.skipped-duplicates-suffix': ' duplicate trades',
  'csv.results.failed-to-import-prefix': 'Failed to import ',
  'csv.results.failed-to-import-suffix': ' rows (see details below)',
  'csv.results.failed-rows-title': 'Failed Rows:',
  'csv.results.import-failed': 'Import Failed',
  'csv.results.import-error-generic': 'An error occurred during import',
  'csv.results.additional-errors': 'Additional Errors:',
  'csv.results.button.view-account': 'View Account',
  'csv.results.button.import-another': 'Import Another CSV',
  'csv.results.button.try-again': 'Try Again',

  
  
  
  'csv.incomplete-options.title': 'Incomplete Options Data Detected',
  'csv.incomplete-options.desc-single':
    'An options trade is missing required metadata:',
  'csv.incomplete-options.desc-plural':
    '{count} options trades are missing required metadata:',
  'csv.incomplete-options.missing-strike-single': 'trade missing strike price',
  'csv.incomplete-options.missing-strike-plural': 'trades missing strike price',
  'csv.incomplete-options.missing-expiry-single':
    'trade missing expiration date',
  'csv.incomplete-options.missing-expiry-plural':
    'trades missing expiration date',
  'csv.incomplete-options.missing-option-type-single':
    'trade missing option type (call/put)',
  'csv.incomplete-options.missing-option-type-plural':
    'trades missing option type (call/put)',
  'csv.incomplete-options.impact-desc':
    'These trades will be imported without complete options data, which may affect:',
  'csv.incomplete-options.impact-analytics': 'Analytics and filtering',
  'csv.incomplete-options.impact-pl': 'P&L calculations',
  'csv.incomplete-options.impact-accuracy': 'Trade journal accuracy',
  'csv.incomplete-options.import-anyway': 'Import Anyway',
  'csv.incomplete-options.cancel-import': 'Cancel Import',

  
  
  
  'csv.image-review.title': 'Review Image References',
  'csv.image-review.summary':
    'Found {imageCount} image references across {tradeCount} trade(s).',
  'csv.image-review.rows': 'Rows: {rows}',
  'csv.image-review.count': '{count} image(s)',
  'csv.image-review.import-images': 'Import Images',
  'csv.image-review.discard-all': 'Discard All Images',
  'csv.image-review.discard-confirmation':
    'Discard all image references for this import? Trades will still be imported without images.',
  'csv.image-review.confirm-discard': 'Yes, Discard All',

  
  
  
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
  'image.viewer.error-load':
    'Unable to load image. The file might be missing or inaccessible.',
  'image.viewer.title-fullscreen': 'Click to view fullscreen',
  'image.viewer.zoom-indicator': 'Click or hold to enlarge',
  'image.viewer.delete-button': 'Delete Media',
  'image.viewer.nav-prev': 'Previous image',
  'image.viewer.nav-next': 'Next image',
  'image.viewer.zoom-in-hint': 'Pinch or click to zoom in',
  'image.viewer.zoom-out-hint': '{scale}x (pinch or click to zoom out)',
  'image.viewer.no-images': 'No images to display',
  'image.viewer.thumbnail-alt': 'Thumbnail {n}',
  'image.viewer.close-aria': 'Close fullscreen',
  'image.viewer.copy-image': 'Copy image',
  'image.viewer.copy-success': 'Media copied to clipboard',
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
  'media.viewer.open-youtube': 'Open on YouTube',

  
  
  
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

  
  
  
  'datepicker.aria.time': 'Time',
  'datepicker.button.clear': 'Clear',
  'datepicker.button.today': 'Today',
  'datepicker.button.now': 'Now',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',

  
  
  
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.warning': 'Warning',
  'common.info': 'Info',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.ok': 'OK',
  'common.search': 'Search...',
  'common.select': 'Select...',
  'common.select-option': 'Select an option',
  'common.view': 'View',
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
  'common.row-n': 'Row {n}: ',
  'common.date': 'Date',
  'common.time': 'Time',
  'common.today': 'Today',
  'common.yesterday': 'Yesterday',
  'common.tomorrow': 'Tomorrow',
  'common.day': 'Day',
  'common.days': 'Days',
  'common.week': 'Week',
  'common.weeks': 'Weeks',
  'common.month': 'Month',
  'common.months': 'Months',
  'common.year': 'Year',
  'common.years': 'Years',
  'common.quarter': 'Quarter',
  'common.quarters': 'Quarters',
  'common.total': 'Total',
  'common.average': 'Average',
  'common.min': 'Min',
  'common.max': 'Max',
  'common.best': 'Best',
  'common.worst': 'Worst',
  'common.profit': 'Profit',
  'common.loss': 'Loss',
  'common.win': 'Win',
  'common.lose': 'Lose',
  'common.trade': 'Trade',
  'common.trades': 'Trades',
  'common.goals': 'Goals',
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
  'chart.tooltip.distance-to-recovery': 'Distance to Recovery',
  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',
  'chart.tooltip.trade-pnl': 'Trade P&L',
  'chart.tooltip.account': 'Account',
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

  
  
  
  'settings.title': 'Journalit Settings',
  'settings.language': 'Language',
  'settings.language-desc': 'Select the display language for the plugin',

  
  
  
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
  'settings.ftp.instructions.title': 'MetaTrader setup instructions:',
  'settings.ftp.instructions.step1': 'Open MetaTrader\u00A05 (MT5)',
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

  
  
  
  'settings.auth.title': 'Account',
  'settings.auth.description': 'Manage authentication and connection settings.',
  'settings.auth.status': 'Status',
  'settings.auth.status-desc': 'Current connection and subscription status',
  'settings.auth.status-offline': 'Offline',
  'settings.auth.status-online': 'Online',
  'settings.auth.plan-suffix': 'Plan',
  'settings.auth.authentication': 'Authentication',
  'settings.auth.sign-in-desc': 'Sign in to access your trading journal',
  'settings.auth.signed-in': 'Signed in',
  'settings.auth.sign-in-up': 'Sign in / Sign up',
  'settings.auth.sign-out': 'Sign out',
  'settings.auth.sign-out-desc': 'Sign out of your account',
  'settings.auth.subscription-features': 'Subscription features',
  'settings.auth.tier-free': 'Free plan with basic features.',
  'settings.auth.tier-pro':
    'Pro plan with advanced analytics and unlimited storage.',
  'settings.auth.tier-enterprise':
    'Enterprise plan with full feature access and priority support.',
  'settings.auth.tier-unknown': 'Subscription status unknown.',
  'settings.auth.error-prefix': 'Error: ',
  'settings.auth.offline-mode': 'Offline mode',
  'settings.auth.offline-desc':
    'Operating in offline mode. Some features may be limited. Will automatically sync when online.',
  'settings.auth.grace-period': 'Grace period ends in {days} days',

  
  'settings.auth.guest': 'Guest',
  'settings.auth.actions': 'Actions',
  'settings.auth.your-plan': 'Your plan',
  'settings.auth.feature-basic-trades': 'Basic trade tracking',
  'settings.auth.feature-basic-analytics': 'Basic analytics',
  'settings.auth.feature-unlimited-trades': 'Unlimited trades',
  'settings.auth.feature-advanced-analytics': 'Advanced analytics',
  'settings.auth.feature-api-access': 'API access',
  'settings.auth.feature-priority-support': 'Priority support',
  'settings.auth.manage-subscription': 'Manage subscription',

  
  
  
  'settings.tab.general': 'General',
  'settings.tab.reviews': 'Review',
  'settings.tab.session-mode': 'Session mode',
  'settings.tab.customization': 'Customisation',
  'settings.tab.journal-setup': 'Journal Setup',
  'settings.tab.backend': 'Trade sync',
  'settings.tab.trading': 'Trades',
  'settings.tab.sync': 'Sync',
  'settings.tab.accounts': 'Account',

  
  
  
  
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Weekly review',
  'settings.reviews.monthly': 'Monthly review',
  'settings.reviews.quarterly': 'Quarterly review',
  'settings.reviews.yearly': 'Yearly review',

  
  'settings.reviews.default-templates': 'Default layouts',
  'settings.reviews.default-templates-desc':
    'Select which layout to use when creating new notes. You can also set defaults in the Layout Builder.',
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

  
  'settings.reviews.scalper-defaults': 'Scalper defaults',
  'settings.reviews.scalper-defaults-desc':
    'Configure global defaults for Demon Tracker behavior. Individual Demon Tracker widgets can still override these values in the Layout Builder.',
  'settings.reviews.scalper-default-count-mode': 'Default count mode',
  'settings.reviews.scalper-default-count-mode-desc':
    'Choose whether recurring mistakes are counted per trade or once per trading day.',
  'settings.reviews.scalper-default-source-mode': 'Default source mode',
  'settings.reviews.scalper-default-source-mode-desc':
    'Choose whether Demon Tracker uses trade mistakes, session mistakes, or both.',
  'settings.reviews.scalper-auto-apply-session':
    'Auto-apply session mistakes to day trades',
  'settings.reviews.scalper-auto-apply-session-desc':
    'When enabled, session-level mistakes can default to applying across all trades in the same trading day.',
  'settings.reviews.scalper-auto-apply-session-aria':
    'Auto-apply session mistakes to day trades',

  
  'settings.reviews.notice.template-updated': 'Default layout updated',
  'settings.reviews.notice.builder-not-found':
    'Layout Builder command not found',
  'settings.reviews.notice.global-auto-create':
    'Auto-create for all reviews {status}',
  'settings.reviews.notice.auto-create-nav':
    'Auto-create {type} on navigation {status}',

  
  'settings.reviews.daily.checklist-title': 'Pre-trade checklist items',
  'settings.reviews.daily.checklist-desc':
    'Customise the checklist items that appear in your Daily Report Card. These are tasks you should complete before starting your trading session.',
  'settings.reviews.daily.checklist-placeholder': 'New checklist item',
  'settings.reviews.daily.questions-title': 'Review questions',
  'settings.reviews.daily.questions-desc':
    'Customise the reflection questions that appear in the review section. These questions help you reflect on your trading performance.',

  
  
  
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
  'library.notice.copied': 'Share code copied to clipboard!',
  'library.error.copy-failed': 'Failed to copy to clipboard',
  'library.title.import': 'Import layout',
  'library.desc.import':
    'Paste a JRT-v1 share code to import a layout from another user.',
  'library.label.share-code': 'Share code',
  'library.placeholder.import-code': 'Paste JRT-v1-... share code here',
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
  'settings.reviews.daily.questions-placeholder': 'New review question',
  'settings.reviews.daily.timeframes-title': 'Forecast timeframes',
  'settings.reviews.daily.timeframes-desc':
    'Customise the timeframes that appear in your Daily Report Card forecasts.',
  'settings.reviews.daily.timeframes-placeholder':
    'New timeframe (e.g., 15M, 5M)',

  
  'settings.weekly.review-questions': 'Review questions',
  'settings.weekly.review-questions-desc':
    'Customise the questions that appear in your weekly review. These questions help you reflect on your trading performance over the week.',
  'settings.weekly.new-question-placeholder': 'New review question',
  'settings.weekly.forecast-timeframes': 'Forecast timeframes',
  'settings.weekly.forecast-timeframes-desc':
    'Customise the timeframes that appear in your weekly forecast.',
  'settings.weekly.new-timeframe-placeholder':
    'New timeframe (e.g., Weekly, Daily)',
  'settings.weekly.default-question-1': 'What worked well this week?',
  'settings.weekly.default-question-2': "What didn't work this week?",
  'settings.weekly.default-question-3': 'Which setups were most profitable?',
  'settings.weekly.default-question-4': 'What mistakes cost me the most money?',
  'settings.weekly.default-question-5': 'What could I improve for next week?',
  'settings.weekly.default-timeframe-monthly': 'Monthly',
  'settings.weekly.default-timeframe-weekly': 'Weekly',
  'settings.weekly.default-timeframe-daily': 'Daily',

  
  
  
  'settings.shared.timeframes.title': 'Forecast timeframes',
  'settings.shared.timeframes.desc':
    'Customise the timeframes that appear in your forecast',
  'settings.shared.timeframes.placeholder': 'New timeframe (e.g., 15M, 5M)',
  'settings.shared.timeframes.reset-to-defaults': 'Reset to Defaults',

  
  
  
  'shared.goal-tracker.title': 'Goals',
  'shared.goal-tracker.empty': 'No goals found',
  'shared.goal-tracker.remove-goal': 'Remove goal',
  'shared.goal-tracker.add-goal-placeholder': 'Add a new goal',

  
  
  
  'shared.empty-state.message': 'No data available',

  
  
  
  'weekly.tab.preparation': 'Preparation',
  'weekly.tab.overview': 'Overview',
  'weekly.tab.review': 'Review',

  
  
  
  'weekly.review.drcs.title': 'Daily reviews for this week',
  'weekly.review.drcs.empty': 'No daily reviews found for this week',

  
  
  
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
  'account.settings.section.inclusion.title': 'Dashboard account types',
  'account.settings.section.inclusion.desc':
    'Choose which account types appear in dashboard stats, whether withdrawals count, and their display order.',
  'account.settings.section.inclusion.include-dashboard': 'In dashboard stats',
  'account.settings.section.inclusion.include-withdrawals': 'Withdrawals',
  'account.settings.section.inclusion.empty':
    'No account types available to configure.',
  'account.settings.section.order.title': 'Display order',
  'account.settings.section.order.desc':
    'Reorder how account types appear in the dashboard.',
  'account.settings.section.order.empty':
    'No account types available to order.',
  'account.settings.section.order.move-up': 'Move up',
  'account.settings.section.order.move-down': 'Move down',
  'account.settings.button.save': 'Save settings',
  'account.settings.button.saving': 'Saving...',
  'weekly.review.drcs.empty-sub':
    "Daily reviews will appear here once you've created them",
  'weekly.review.drcs.mental': 'Mental',
  'weekly.review.drcs.technical': 'Technical',
  'weekly.review.drcs.view-button': 'View DRC',
  'weekly.review.drcs.no-answer': 'No answer provided',
  'weekly.review.performance.title': 'Performance self-assessment',
  'weekly.review.performance.mental': 'Mental performance',
  'weekly.review.performance.mental-placeholder':
    'Notes about your mental performance...',
  'weekly.review.performance.technical': 'Technical execution',
  'weekly.review.performance.technical-placeholder':
    'Notes about your technical execution...',
  'weekly.review.questions.title': 'Weekly review questions',
  'weekly.review.questions.empty': 'No review questions configured',
  'weekly.review.questions.empty-sub':
    'Add review questions in the Weekly Review settings tab',
  'weekly.review.questions.answer-placeholder': 'Your answer here...',
  'weekly.review.questions.settings-hint':
    'Review questions can be configured in the Weekly Review settings tab.',
  'weekly.review.goals.title': 'Goals for next week',
  'weekly.review.goals.empty': 'No goals set for next week',
  'weekly.review.goals.empty-sub': 'Define clear goals to focus your trading',
  'weekly.review.goals.add-placeholder': 'Add a goal for next week',
  'weekly.review.goals.add-button': 'Add Goal',

  
  
  
  'weekly.preparation.goals.title': 'Weekly goals',
  'weekly.preparation.goals.empty': 'No goals from previous week',
  'weekly.preparation.events.title': 'Key events',
  'weekly.preparation.events.colour': 'Colour:',
  'weekly.preparation.events.day': 'Day:',
  'weekly.preparation.events.day-none': 'None (optional)',
  'weekly.preparation.events.notes-placeholder': 'Notes about this event',
  'weekly.preparation.events.add-button': 'Add event',
  'weekly.preparation.events.event-label': 'Event',
  'weekly.preparation.events.event-placeholder': 'Select or create event',
  'weekly.preparation.events.empty': 'No key events added',
  'weekly.preparation.events.sub-empty':
    'Add important market events that might impact your trading',
  'weekly.preparation.forecast.title': 'Weekly forecast',

  
  
  
  'weekly.overview.pnl-chart.title': 'Weekly cumulative P&L',
  'weekly.overview.pnl-chart.empty': 'No P&L data to display',
  'weekly.overview.pnl-chart.empty-sub':
    "Your cumulative profit/loss will show here once you've logged closed trades",
  'weekly.overview.drawdown-chart.title': 'Weekly drawdown',
  'weekly.overview.drawdown-chart.empty': 'No drawdown data to display',
  'weekly.overview.drawdown-chart.empty-sub':
    "Your drawdown metrics will appear here once you've logged closed trades",
  'weekly.overview.performance.title': 'Weekly performance',
  'weekly.overview.metrics.net-pnl': 'Net P&L',
  'weekly.overview.metrics.win-rate': 'Win Rate',
  'weekly.overview.metrics.profit-factor': 'Profit Factor',
  'weekly.overview.metrics.expectancy': 'Expectancy',
  'weekly.overview.metrics.total-trades': 'Total Trades',
  'weekly.overview.metrics.avg-win': 'Avg. Win',
  'weekly.overview.metrics.avg-loss': 'Avg. Loss',
  'weekly.overview.metrics.pl-ratio': 'P/L Ratio',
  'weekly.overview.setup-performance.title': 'Setup performance',
  'weekly.overview.setup-performance.col-setup': 'Setup',
  'weekly.overview.setup-performance.col-pnl': 'P&L',
  'weekly.overview.setup-performance.col-win-rate': 'Win %',
  'weekly.overview.setup-performance.col-trades': 'Trades',
  'weekly.overview.setup-performance.empty': 'No setup data available',
  'weekly.overview.setup-performance.empty-sub':
    'Add setup tags to your trades to see performance metrics by setup',
  'weekly.overview.trades-chart.title': 'Weekly trades',
  'weekly.overview.trades-chart.empty': 'No trades for this week',
  'weekly.overview.trades-chart.empty-sub':
    'Track your individual trades to see them visualized here',
  'weekly.overview.best-trade.title': 'Best trade of the week',
  'weekly.overview.best-trade.empty': 'No winning trades this week',
  'weekly.overview.best-trade.empty-sub':
    "Your best trades will appear here once you've logged some profitable trades",
  'weekly.overview.worst-trade.title': 'Worst trade of the week',
  'weekly.overview.worst-trade.empty': 'No losing trades this week',
  'weekly.overview.worst-trade.empty-sub':
    'Your least successful trades will appear here to help you learn and improve',
  'weekly.overview.daily-performance.title': 'Daily performance',
  'weekly.overview.daily-performance.col-date': 'Date',
  'weekly.overview.daily-performance.col-trades': 'Trades',
  'weekly.overview.daily-performance.col-win-rate': 'Win%',
  'weekly.overview.daily-performance.col-profit-factor': 'Profit Factor',
  'weekly.overview.daily-performance.col-pnl': 'P&L',
  'weekly.overview.daily-performance.empty': 'No trades for this week',
  'weekly.overview.daily-performance.empty-sub':
    "Your daily trading performance will appear here once you've logged trades",
  'weekly.overview.trade.unknown': 'Unknown',
  'weekly.overview.trade.na': 'N/A',
  'weekly.overview.trade.label-date': 'Date:',
  'weekly.overview.trade.label-setup': 'Setup:',
  'weekly.overview.trade.label-duration': 'Duration:',
  'weekly.overview.trade.label-tags': 'Tags:',
  'weekly.overview.trade.label-mistakes': 'Mistakes:',
  'weekly.overview.trade.duration-format': '{hours}h {minutes}m',
  'weekly.overview.button.create-trade': 'Create trade',
  'weekly.overview.button.view-trade-details': 'View trade details',

  
  
  
  'monthly.tab.overview': 'Overview',
  'monthly.tab.review': 'Review',

  
  
  
  'monthly.review.demon-tracker.title': 'Demon Tracker',
  'monthly.review.demon-tracker.description':
    'Track your recurring mistakes to identify patterns and improve your trading discipline.',
  'monthly.review.demon-tracker.column.demon': 'DEMON',
  'monthly.review.demon-tracker.column.stop-trading': 'STOP TRADING',
  'monthly.review.demon-tracker.summary.unique-mistakes':
    'Total Unique Mistakes:',
  'monthly.review.demon-tracker.summary.total-occurrences':
    'Total Mistake Occurrences:',
  'monthly.review.demon-tracker.summary.critical-mistakes':
    'Critical Mistakes (6+):',
  'monthly.review.demon-tracker.empty': 'No mistakes tracked this month',
  'monthly.review.demon-tracker.empty-sub':
    'Mistakes logged in your trades will appear here to help identify patterns',
  'monthly.review.mental-game-performance': 'Mental Game Performance',
  'monthly.review.technical-game-performance': 'Technical Game Performance',

  
  'settings.loss-review.title': 'Loss Review Settings',
  'settings.loss-review.description':
    'Configure the Loss Review that appears at the bottom of losing trades. This helps you learn from losses and maintain proper trading psychology.',
  'settings.loss-review.enable': 'Enable Loss Review',
  'settings.loss-review.enable-desc':
    'Show Loss Review section for trades with negative P&L',
  'settings.loss-review.sections-title': 'Loss Review Sections',
  'settings.loss-review.add-section': 'Add Section',
  'settings.loss-review.reset-to-defaults': 'Reset to Defaults',
  'settings.loss-review.new-section-title': 'New Section',
  'settings.loss-review.empty-state':
    'No sections configured. Click "Add Section" to create your first section.',

  
  
  
  'backend.title': 'Trade Sync',
  'backend.description':
    'Set up MetaTrader (MT4/MT5) sync and keep your vault up to date automatically.',

  
  'trade-sync.gate.signin.title': 'Sign in required',
  'trade-sync.gate.signin.description':
    'To enable trade sync, first sign in to your Journalit account.',
  'trade-sync.gate.signin.cta': 'Sign in',

  'trade-sync.gate.pro.title': 'Pro required',
  'trade-sync.gate.pro.description':
    'Trade Sync is a Pro feature. Upgrade to continue.',
  'trade-sync.gate.pro.cta': 'Upgrade now',
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

  
  'premium.gate.cta.activate': 'Activate PRO',
  'premium.gate.cta.upgrade-now': 'Upgrade now',
  'premium.gate.cta.signin-continue': 'Sign in & continue',
  'premium.gate.cta.continue-pro': 'Continue to PRO',
  'premium.gate.cta.keep-editing': 'Keep editing',
  'premium.gate.cta.refresh': 'Refresh status',
  'premium.gate.import.state.signin.title':
    'Save 7 hours a week importing trades',
  'premium.gate.import.state.signin.description':
    'Upload broker exports, preview parsed trades privately, and import them into your vault.',
  'premium.gate.import.state.pro.title': 'Save 7 hours a week importing trades',
  'premium.gate.import.state.pro.description':
    'Pro unlocks broker export uploads, private previews, saved templates, and one-click imports.',
  'premium.gate.import.reassurance': 'Import unlimited trades to your vault.',
  'premium.gate.trial-hint': 'Start with a 14-day free trial.',
  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  
  'backend.connection.title': 'Connection Settings',
  'backend.connection.status': 'Connection Status',
  'backend.connection.status-desc':
    'Current connection status to the trading server',
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
  'backend.ftp.credentials-title': 'MetaTrader FTP Credentials',

  
  'backend.sync.title': 'Sync Settings',
  'backend.sync.auto-sync': 'Enable Auto-Sync',
  'backend.sync.auto-sync-desc':
    'Automatically sync trades from the backend server',
  'backend.sync.auto-sync-info': 'Auto-sync checks for new trades every hour',
  'backend.sync.auto-sync-aria': 'Enable auto-sync',
  'backend.sync.manual': 'Manual Sync',
  'backend.sync.manual-desc': 'Force immediate synchronization of trades',
  'backend.sync.manual-info':
    'Average wait time: 2-3 minutes (maximum: 5 minutes)',
  'backend.sync.syncing': 'Syncing...',
  'backend.sync.force-button': 'Force Sync Now',
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

  
  'backend.accounts.title': 'Trading Accounts',
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

  
  'backend.progress.title': 'Setup Progress',
  'backend.progress.connection.label': 'Connect',
  'backend.progress.connection.desc': 'Link vault to server',
  'backend.progress.ftp.label': 'FTP',
  'backend.progress.ftp.desc': 'Create credentials',
  'backend.progress.sync.label': 'Sync',
  'backend.progress.sync.desc': 'Enable auto-sync',
  'backend.progress.accounts.label': 'Accounts',
  'backend.progress.accounts.desc': 'Link MT accounts',

  
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
  'settings.auth.feature.metatrader-sync': 'MetaTrader Trade Sync',
  'settings.auth.feature.basic-tracking': 'Basic trade tracking',
  'settings.auth.feature.manual-csv': 'Manual CSV import',
  'settings.auth.feature.manual-entry': 'Manual trade entry',
  'settings.auth.feature.analytics-reviews': 'Analytics and reviews',
  'settings.auth.feature.priority-support': 'Priority Support',

  
  'backend.sync.just-now': 'Just now',
  'backend.sync.minutes-ago': '{count} min ago',
  'backend.sync.hours-ago': '{count} hr ago',
  'backend.sync.days-ago': '{count} days ago',

  
  
  
  'csv.title': 'Import Trades from CSV',
  'csv.subtitle':
    "Upload your broker's CSV file to import trades into your journal.",
  'csv.how-to-export': 'How to Export from Your Broker',
  'csv.processing-file': 'Processing import file...',
  'csv.importing-trades': 'Importing trades to account...',
  'csv.format': 'Import Format: ',
  'csv.asset-type': 'Asset Type',
  'csv.asset-type-desc':
    'Select the type of instrument in this CSV. This determines contract specifications and validation rules.',
  'csv.button.export-template': 'Export Template',
  'csv.button.delete-template': 'Delete Template',
  'csv.button.import-template': 'Import Template',
  'csv.button.import-rows': 'Import {count} Rows',
  'csv.button.edit-format': 'Edit Format',
  'csv.button.continue-mapping': 'Continue to Column Mapping',
  'csv.button.update-template': 'Update Template',
  'csv.button.save-template': 'Save as Template',
  'csv.button.back': 'Back',
  'csv.button.import-another': 'Import Another File',
  'csv.button.view-account': 'View in Account',
  'csv.results.complete': 'Import Complete',
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
  'csv.results.skipped-incomplete':
    'Skipped {count} incomplete row(s) (missing required values)',
  'csv.results.custom-field-warnings':
    'Skipped {count} invalid custom field value(s)',
  'csv.results.custom-field-warnings-header':
    'CLICK TO SEE CUSTOM FIELD WARNINGS ({count})',
  'csv.results.broker': 'Broker: {broker}',
  'csv.results.manual-import': 'Manual Import',
  'csv.results.preview-header':
    'Recently Imported Trades (showing {shown} of {total})',
  'csv.results.more-trades.one': 'and {count} more trade...',
  'csv.results.more-trades.few': 'and {count} more trades...',
  'csv.results.more-trades.many': 'and {count} more trades...',
  'csv.results.more-trades.other': 'and {count} more trades...',
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  'csv.errors.copy-shareable': 'Copy shareable report',
  'csv.errors.copy-report': 'Copy report',
  'csv.errors.copy-detailed': 'Copy detailed report',
  'csv.errors.copied': 'Copied',
  'csv.errors.rows': 'Rows: {rows}',
  'csv.errors.suggestion': 'Suggestion: ',
  'csv.errors.example': 'Example: ',
  'csv.errors.raw-errors': 'Raw errors',
  'csv.errors.raw-errors-limit': 'Showing first {shown} of {total} errors',

  'csv.errors.group.missing-value':
    'Missing required value — {field} (column "{column}")',
  'csv.errors.group.missing-column':
    'Missing required column — {field} (column "{column}")',
  'csv.errors.group.invalid-date': 'Could not parse date (column "{column}")',
  'csv.errors.group.invalid-number':
    'Invalid number — {field} (column "{column}")',
  'csv.errors.group.invalid-direction': 'Invalid direction (column "{column}")',
  'csv.errors.group.template-missing-mappings':
    'Template is missing required column mappings',
  'csv.errors.group.batch-parsing-failed': 'Batch parsing failed',
  'csv.errors.group.no-valid-rows': 'No valid rows were imported',
  'csv.errors.group.no-trades-parsed': 'No trades could be parsed',
  'csv.errors.group.close-only': 'Close-only executions were skipped',
  'csv.errors.group.other': 'Other errors',

  'csv.errors.suggestion.select-date-format':
    'Select a Date Format in the mapping step, then re-import.',
  'csv.errors.suggestion.fix-numbers':
    'Check the column values are numeric (no text) and the correct column is mapped.',
  'csv.errors.suggestion.fix-direction':
    'Ensure the Direction column values are Buy/Sell (or map the correct column).',
  'csv.errors.suggestion.check-mapping':
    'Review your column mappings and ensure required fields are mapped.',
  'csv.errors.suggestion.check-broker':
    'Verify you selected the correct broker/template for this CSV.',
  'csv.errors.suggestion.check-raw-errors':
    'Open Raw errors for the exact messages and row numbers.',

  
  'csv.report.title.shareable': 'Journalit CSV Import — Shareable Report',
  'csv.report.title.detailed': 'Journalit CSV Import — Detailed Report',
  'csv.report.time': 'Time: {time}',
  'csv.report.plugin-version': 'Plugin version: {version}',
  'csv.report.file': 'File: {file}',
  'csv.report.account': 'Account: {account}',
  'csv.report.broker': 'Broker: {broker}',
  'csv.report.template': 'Template: {name}',
  'csv.report.csv-rows': 'CSV rows: {count}',
  'csv.report.asset-type': 'Asset type: {type}',
  'csv.report.date-format': 'Date format: {format}',
  'csv.report.header-row': 'Header row: {row}',
  'csv.report.result': 'Result: {result}',
  'csv.report.imported': 'Imported: {count}',
  'csv.report.updated': 'Updated: {count}',
  'csv.report.duplicates': 'Duplicates: {count}',
  'csv.report.skipped-incomplete': 'Skipped incomplete rows: {count}',
  'csv.report.errors': 'Errors: {count}',
  'csv.report.custom-field-warnings': 'Custom field warnings: {count}',
  'csv.report.sanitized-note':
    'Note: This is a shareable report. It may omit sensitive details.',
  'csv.report.top-issues': 'Top issues:',
  'csv.report.issue-groups': 'Issue groups:',
  'csv.report.raw-custom-field-warnings': 'Custom field warnings:',
  'csv.report.raw-errors': 'Raw errors:',
  'csv.report.more-errors': '...and {count} more error(s)',
  'csv.unmapped-symbols.title': 'Unmapped Symbols Detected',
  'csv.unmapped-symbols.desc-singular':
    'A symbol without instrument specifications was found in your import:',
  'csv.unmapped-symbols.desc-plural':
    '{count} symbols without instrument specifications were found in your import:',
  'csv.unmapped-symbols.map-label': 'Map to base symbol/ticker:',
  'csv.unmapped-symbols.placeholder': 'e.g., ES, NQ, GC',
  'csv.unmapped-symbols.warning':
    'Map these symbols to built-in specs or your custom tickers. Without specifications, trades will not have accurate tick sizes, dollar per point, or P&L calculations.',
  'csv.unmapped-symbols.validation.not-found':
    'Symbol "{symbol}" not found in {assetType} specs or custom tickers',
  'csv.unmapped-symbols.notice.fix-errors':
    'Please fix validation errors before saving',
  'csv.unmapped-symbols.notice.save-failed': 'Failed to save mappings',
  'csv.unmapped-symbols.button.saving': 'Saving...',
  'csv.unmapped-symbols.button.save': 'Save Mappings',
  'csv.unmapped-symbols.button.skip': 'Skip',

  
  
  'csv.broker-guide.tradovate.step-1':
    'Navigate to "Reports" tab on Tradovate website',
  'csv.broker-guide.tradovate.step-2':
    'Click on "Orders" tab (NOT Performance tab)',
  'csv.broker-guide.tradovate.step-3': 'Click "Download CSV" button',
  'csv.broker-guide.tradovate.warning.emphasis': 'Important:',
  'csv.broker-guide.tradovate.warning.message':
    'Use Orders tab only. The Performance tab is not compatible.',
  'csv.broker-guide.tradovate.doc-label': 'View detailed guide',

  
  'csv.broker-guide.ibkr.description': 'One-time Flex Query setup required',
  'csv.broker-guide.ibkr.step-1':
    'Navigate to Performance & Statements → Reports → Flex Queries',
  'csv.broker-guide.ibkr.step-2':
    'Create new "Trade Confirmation" query (select Orders, deselect Executions)',
  'csv.broker-guide.ibkr.step-3':
    'Set format: CSV, Date "yyyyMMdd", Time "HHmmss"',
  'csv.broker-guide.ibkr.step-4': 'Run query and download CSV file',
  'csv.broker-guide.ibkr.warning.emphasis': 'Must use Orders',
  'csv.broker-guide.ibkr.warning.message':
    '(not Executions) with specific date/time format',
  'csv.broker-guide.ibkr.doc-label': 'View detailed setup guide',

  
  'csv.broker-guide.tradezero.step-1':
    'Export CSV file from TradeZero platform',
  'csv.broker-guide.tradezero.step-2': 'Verify file is CSV format (NOT XLSX)',
  'csv.broker-guide.tradezero.step-3': 'Import the file below',
  'csv.broker-guide.tradezero.warning.emphasis': 'Only CSV format supported.',
  'csv.broker-guide.tradezero.warning.message':
    'Excel (XLSX) files will not work.',
  'csv.broker-guide.tradezero.doc-label': 'View export instructions',

  
  'csv.broker-guide.tradingview.description': 'Paper Trading account only',
  'csv.broker-guide.tradingview.step-1':
    'Click on the "Paper Trading" broker type in TradingView',
  'csv.broker-guide.tradingview.step-2': 'Click "Export data..." button',
  'csv.broker-guide.tradingview.step-3':
    'Select "Order History" from the dropdown',
  'csv.broker-guide.tradingview.warning.emphasis': 'Must use Order History.',
  'csv.broker-guide.tradingview.warning.message':
    'Other export types (such as Positions or Orders) will not work for import.',
  'csv.broker-guide.tradingview.doc-label': 'View detailed guide',

  
  'csv.broker-guide.bybit.description': 'USDT Perpetuals Trade History',
  'csv.broker-guide.bybit.step-1':
    'Go to Bybit → Orders → USDT Perpetual → Trade History',
  'csv.broker-guide.bybit.step-2':
    'Click "Export" button and select date range',
  'csv.broker-guide.bybit.step-3':
    'Download the Trade History CSV file (NOT Closed P&L)',
  'csv.broker-guide.bybit.warning.emphasis': 'Use Trade History export.',
  'csv.broker-guide.bybit.warning.message':
    'The Closed P&L export is missing commission data and individual fills.',
  'csv.broker-guide.bybit.doc-label': 'View export instructions',

  
  'csv.broker-guide.blofin.description':
    'Blofin Order History Export (Website only)',
  'csv.broker-guide.blofin.step-1':
    'Go to Assets → Order Center → Order History',
  'csv.broker-guide.blofin.step-2':
    'Click Download, select Futures, and choose date range (max 180 days)',
  'csv.broker-guide.blofin.step-3':
    'Click Export and wait for notification when ready',
  'csv.broker-guide.blofin.warning.emphasis': 'Website only.',
  'csv.broker-guide.blofin.warning.message':
    'Mobile app does not support exports. Files are available for 30 days after export.',
  'csv.broker-guide.blofin.doc-label': 'View export instructions',

  
  'csv.broker-guide.hyperliquid.description': 'Perpetuals Trade History',
  'csv.broker-guide.hyperliquid.step-1': 'Connect wallet on Hyperliquid',
  'csv.broker-guide.hyperliquid.step-2':
    'Click "Trade history" tab at the bottom of the page',
  'csv.broker-guide.hyperliquid.step-3': 'Click "Export to CSV" button',
  'csv.broker-guide.hyperliquid.warning.emphasis': '10,000 entry limit.',
  'csv.broker-guide.hyperliquid.warning.message':
    'Export regularly - older trades beyond 10,000 entries cannot be retrieved.',
  'csv.broker-guide.hyperliquid.doc-label': 'View export instructions',

  
  'csv.broker-guide.sierrachart.description': 'Futures Trades List Export',
  'csv.broker-guide.sierrachart.step-1':
    'Open Trade Activity Log (Trade → Trade Activity Log, or Ctrl+Shift+A)',
  'csv.broker-guide.sierrachart.step-2':
    'Click the "Trades" tab at the top of the window',
  'csv.broker-guide.sierrachart.step-3':
    'Set date range via [DisplaySettings] button if needed',
  'csv.broker-guide.sierrachart.step-4':
    'Go to File → Save Log As and save as .txt file',
  'csv.broker-guide.sierrachart.warning.emphasis':
    'Use "Save Log As" not "Export".',
  'csv.broker-guide.sierrachart.warning.message':
    'The Export option saves unadjusted prices. Save Log As preserves prices as displayed.',
  'csv.broker-guide.sierrachart.doc-label': 'View SierraChart documentation',

  
  'csv.broker-guide.motivewave.description':
    'Export executions from the Account panel in MotiveWave.',
  'csv.broker-guide.motivewave.step-1':
    'Open the Account panel and select the Executions tab',
  'csv.broker-guide.motivewave.step-2':
    'Click the Export to CSV icon above the executions list',
  'csv.broker-guide.motivewave.step-3':
    'Set the "Export Executions Since" date range if needed',
  'csv.broker-guide.motivewave.step-4': 'Save the CSV file and import it here',
  'csv.broker-guide.motivewave.warning.emphasis': 'Note:',
  'csv.broker-guide.motivewave.warning.message':
    'Some brokers only provide limited execution history. Export regularly or use your broker portal for older trades.',
  'csv.broker-guide.motivewave.doc-label': 'View MotiveWave documentation',

  
  'csv.broker-guide.fxreplay.step-1':
    'Open FX Replay → Analytics and select the session or date range',
  'csv.broker-guide.fxreplay.step-2': 'Click "Export" and choose CSV',
  'csv.broker-guide.fxreplay.step-3':
    'Download the analytics CSV and upload it here',
  'csv.broker-guide.fxreplay.warning.emphasis': 'Pro feature:',
  'csv.broker-guide.fxreplay.warning.message':
    'CSV exports are available from the Analytics page and require a paid plan.',
  'csv.broker-guide.fxreplay.doc-label': 'Open FX Replay export guide',

  
  'csv.broker-guide.atas.description':
    'Export Statistics → Journal tab (paired trades)',
  'csv.broker-guide.atas.step-1':
    'In ATAS, open the Statistics tab and select RealTime or History (set date range if needed)',
  'csv.broker-guide.atas.step-2':
    'Click the gear icon (top right) and choose “Export statistics”',
  'csv.broker-guide.atas.step-3':
    'Upload the exported XLSX file here and select ATAS in the broker list',
  'csv.broker-guide.atas.warning.emphasis': 'Important:',
  'csv.broker-guide.atas.warning.message':
    'Do not edit the exported file. Journalit preserves trades from the “Journal” sheet and, when available, enriches commission using matching fills from the “Executions” sheet.',
  'csv.broker-guide.atas.doc-label': 'View ATAS export instructions',

  
  'csv.broker-guide.rithmic.description':
    'R | Trader Pro export from Order History / Completed Orders.',
  'csv.broker-guide.rithmic.step-1':
    'Open Order History in R | Trader Pro and filter to Completed/Filled orders for your account/date',
  'csv.broker-guide.rithmic.step-2':
    'Use Add/Remove Columns and make sure Side, Symbol, Qty Filled, Avg Fill Price, and Fill/Update Time are visible',
  'csv.broker-guide.rithmic.step-3':
    'Click the Export/Clipboard icon to save CSV, then upload it here and select Rithmic',
  'csv.broker-guide.rithmic.warning.emphasis': 'Important:',
  'csv.broker-guide.rithmic.warning.message':
    'Rithmic exports only visible columns (and often one day at a time). Missing columns can break import.',
  'csv.broker-guide.rithmic.doc-label':
    'View R | Trader Pro export walkthrough',

  
  'csv.broker-guide.jdr.description':
    'MetaTrader HTML statement export (MT4-style report).',
  'csv.broker-guide.jdr.step-1':
    'In your JDR MetaTrader terminal, open the Account History / History tab for the date range you want to import',
  'csv.broker-guide.jdr.step-2':
    'Right-click inside the history table and choose Save as Report (HTML/HTM statement)',
  'csv.broker-guide.jdr.step-3':
    'Upload the exported HTML statement here and select JDR Securities Limited',
  'csv.broker-guide.jdr.warning.emphasis': 'Important:',
  'csv.broker-guide.jdr.warning.message':
    'Use the HTML statement export. Pending/cancelled orders are ignored automatically, and MT5 HTML reports are not supported yet.',
  'csv.broker-guide.jdr.doc-label': 'View broker export guides',

  
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
  'upgrade.benefit.templates': 'Unlimited custom layouts and layout sharing',
  'upgrade.benefit.mt5': 'MetaTrader 5 automatic sync',
  'upgrade.benefit.multi-account': 'Multi-account support',
  'upgrade.benefit.analytics': 'Advanced analytics and metrics',
  'upgrade.benefit.layouts': 'Custom dashboard layouts',
  'upgrade.trial-notice':
    'Get a 2-week free trial to import all your historical trades and try all Pro features risk-free.',

  
  
  
  'monthly.overview.cumulative-pnl': 'Monthly Cumulative P&L',
  'monthly.overview.no-pnl-data': 'No P&L data to display',
  'monthly.overview.no-pnl-data-sub':
    "Your cumulative profit/loss will show here once you've logged closed trades",
  'monthly.overview.drawdown': 'Monthly Drawdown',
  'monthly.overview.no-drawdown-data': 'No drawdown data to display',
  'monthly.overview.no-drawdown-data-sub':
    "Your drawdown metrics will appear here once you've logged closed trades",
  'monthly.overview.performance': 'Monthly Performance',
  'monthly.overview.net-pnl': 'Net P&L',
  'monthly.overview.win-rate': 'Win Rate',
  'monthly.overview.profit-factor': 'Profit Factor',
  'monthly.overview.total-trades': 'Total Trades',
  'monthly.overview.setup-performance': 'Setup Performance',
  'monthly.overview.biggest-winner': 'Biggest Winner of {month}',
  'monthly.overview.biggest-loser': 'Biggest Loser of {month}',
  'monthly.overview.label-date': 'Date:',
  'monthly.overview.label-setup': 'Setup:',
  'monthly.overview.view-trade-details': 'View Trade Details',
  'monthly.overview.no-winning-trades': 'No winning trades this month',
  'monthly.overview.no-winning-trades-sub': 'Your best trades will appear here',
  'monthly.overview.no-losing-trades': 'No losing trades this month',
  'monthly.overview.no-losing-trades-sub': 'Your worst trades will appear here',
  'monthly.overview.weekly-highlights': 'Weekly Performance Highlights',
  'monthly.overview.best-week': 'Best Performing Week',
  'monthly.overview.worst-week': 'Worst Performing Week',
  'monthly.overview.week-number': 'Week {number}',
  'monthly.overview.view-week': 'View Week',
  'monthly.overview.long-performance': 'Long Only Performance',
  'monthly.overview.no-long-trades': 'No long trades this month',
  'monthly.overview.no-long-trades-sub':
    'Your long trade performance will appear here',
  'monthly.overview.short-performance': 'Short Only Performance',
  'monthly.overview.no-short-trades': 'No short trades this month',
  'monthly.overview.no-short-trades-sub':
    'Your short trade performance will appear here',
  'monthly.overview.weekly-breakdown': 'Weekly Breakdown',
  'monthly.overview.table-week': 'Week',
  'monthly.overview.table-trades': 'Trades',
  'monthly.overview.table-win-rate': 'Win%',
  'monthly.overview.table-profit-factor': 'Profit Factor',
  'monthly.overview.table-pnl': 'P&L',
  'monthly.overview.week-abbrev': 'W{number}',
  'monthly.overview.no-weekly-data': 'No weekly data available',
  'monthly.overview.no-weekly-data-sub':
    'Your weekly performance breakdown will appear here',

  
  
  
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
    'Deposits and withdrawals are tracked here',
  'account-page.guide.empty.transactions.description':
    'This section keeps a history of manual deposits and withdrawals. When it is empty, use Add Event to create the first one.',
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
    'These numbers are calculated for this account, so you can judge its performance on its own.',
  'account-page.guide.main.risk.title':
    'Risk progress is tracked separately here',
  'account-page.guide.main.risk.description':
    'This section shows how close the account is to its drawdown limit or profit target. You set those rules in Edit Account, which we will show next.',
  'account-page.guide.main.transactions.title':
    'Deposits and withdrawals stay in their own section',
  'account-page.guide.main.transactions.description':
    'Each entry here can be reviewed later, so you can separate cash movements from trading performance.',
  'account-page.guide.main.trade-log.title':
    'View this account’s trades in the Trade Log',
  'account-page.guide.main.trade-log.description':
    'Open the Trade Log with this account already selected for focused trade review.',
  'account-page.guide.main.add-event.title':
    'Add Event records deposits and withdrawals',
  'account-page.guide.main.add-event.description':
    'Use this whenever money is added or removed outside of normal trade results, so the account history stays accurate.',
  'account-page.guide.main.edit-account.title':
    'Edit Account changes the account settings',
  'account-page.guide.main.edit-account.description':
    'This is where you update the account details, risk rules, drawdown, and profit target if they change over time.',

  
  
  
  'account-dashboard.title': 'Account Dashboard',
  'account-dashboard.copy-badge.base': 'BASE',
  'account-dashboard.copy-badge.copy': 'COPIER',
  'account-dashboard.copy-badge.copied-by': 'Copied by',
  'account-dashboard.copy-badge.copies-tooltip':
    'Copies {account} at {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService not initialized after multiple attempts',
  'account-dashboard.error.loading': 'Error loading accounts: {error}',
  'account-dashboard.error.retry':
    'AccountPageService not ready, retrying in {delay}ms (attempt {attempt}/{max})',
  'account-dashboard.empty.title': 'No Accounts Found',
  'account-dashboard.empty.message':
    'Create an account to start tracking your trading performance',
  'account-dashboard.section.empty': 'No {type} accounts',
  'account-dashboard.section.empty-sub': 'Create an account to see it here',
  'account-dashboard.button.create-first': 'Create Your First Account',
  'account-dashboard.action.create': 'Create new account',
  'account-dashboard.action.settings': 'Account dashboard settings',
  'account-dashboard.weight-bar.aria': 'Account type AUM distribution',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: {percent}% of total AUM',
  'account-dashboard.guide.empty.intro.title':
    'This page keeps all of your accounts in one place',
  'account-dashboard.guide.empty.intro.description':
    'Use the Account Dashboard to see all of your accounts together. Once accounts exist, this page becomes the fastest way to compare them.',
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
  'account-dashboard.guide.main.intro.title': 'This is your account dashboard',
  'account-dashboard.guide.main.intro.description':
    'Use this page to compare accounts, watch totals across all accounts, and jump into a single account when you need more detail.',
  'account-dashboard.guide.main.trade-filter.title':
    'This filter changes the whole dashboard',
  'account-dashboard.guide.main.trade-filter.description':
    'Use this filter to switch the dashboard between regular trades, backtests, or both.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM means assets under management',
  'account-dashboard.guide.main.aum-chart.description':
    'This chart tracks your combined account value over time, including deposits, withdrawals, profit targets, and drawdown levels across your accounts.',
  'account-dashboard.guide.main.metrics.title':
    'These metrics summarise all visible accounts',
  'account-dashboard.guide.main.metrics.description':
    'Use these stats for a quick account-level snapshot before drilling into specific account types or specific accounts.',
  'account-dashboard.guide.main.sections.title':
    'Accounts are grouped by account type',
  'account-dashboard.guide.main.sections.description':
    'These sections help you compare similar accounts together. Each card is clickable and opens the full page for that account.',
  'account-dashboard.guide.main.create-account.title':
    'You can create another account from here at any time',
  'account-dashboard.guide.main.create-account.description':
    'Use this button whenever you want to add a new account to the dashboard.',
  'account-dashboard.guide.main.settings.title':
    'Settings control how this dashboard is organised',
  'account-dashboard.guide.main.settings.description':
    'Open dashboard settings to manage account types, what counts in totals, and the order of the sections.',
  'account-dashboard.guide.main.settings-types.title':
    'Settings can manage available account types',
  'account-dashboard.guide.main.settings-types.description':
    'Inside settings, you can add custom account types and remove old ones if your workflow changes.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Settings can change what counts in totals',
  'account-dashboard.guide.main.settings-inclusion.description':
    'You can hide account types from dashboard totals without deleting them, and you can separately decide whether their withdrawals still count.',
  'account-dashboard.guide.main.settings-order.title':
    'This section controls the order of account groups',
  'account-dashboard.guide.main.settings-order.description':
    'Use these controls to decide which account types appear first on the dashboard.',
  'account-dashboard.guide.main.close-settings.title':
    'Close settings to return to the dashboard',
  'account-dashboard.guide.main.close-settings.description':
    'Close this modal when you are done reviewing the dashboard settings.',
  'account-dashboard.guide.main.open-account.title':
    'Open any account card to go deeper',
  'account-dashboard.guide.main.open-account.description':
    'When you want the full breakdown for one account, open its card. The Account Page guide will take over there.',

  
  'account-dashboard.metrics.total-accounts': 'Total Accounts',
  'account-dashboard.metrics.total-aum': 'Total AUM',
  'account-dashboard.metrics.total-growth': 'Total Growth',
  'account-dashboard.metrics.growth-percent': 'Growth %',
  'account-dashboard.metrics.total-withdrawals': 'Total Withdrawals',
  'account-dashboard.metrics.no-withdrawals': 'No withdrawals',
  'account-dashboard.metrics.total-trades': 'Total Trades',

  
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

  
  
  
  'account-card.status.breached': 'BREACHED',
  'account-card.status.in-progress': 'IN PROGRESS',
  'account-card.status.achieved': 'ACHIEVED',
  'account-card.metric.trades': 'Trades',
  'account-card.metric.withdrawals': 'Withdrawals',
  'account-card.metric.age': 'Age',
  'account-card.progress.profit-target': 'Profit Target',
  'account-card.progress.drawdown-used': 'Drawdown Limit Used',
  'account-card.progress.not-set': 'Not set',
  'account-card.footer.monthly': 'Monthly:',
  'account-card.footer.total-costs': 'Total Costs:',

  
  'account.chart.event.added': 'Account Added',
  'account.chart.event.archived': 'Account Archived',
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
  'account.link-modal.no-existing-found':
    'No existing accounts found. Create a new account instead.',
  'account.link-modal.option.default': 'Use default name: Account-{id}',
  'account.link-modal.default-name': 'Account-{id}',
  'account.link-modal.button.linking': 'Linking...',
  'account.link-modal.notice.select-existing':
    'Please select an existing account',
  'account.link-modal.notice.failed': 'Failed to link account: {error}',

  
  
  
  'trade.review.title': 'Trade Review',

  
  'trade.details.direction': 'Direction',
  'trade.details.position-size': 'Position Size',
  'trade.details.trading-costs': 'Trading Costs',
  'trade.details.entry-price': 'Entry Price',
  'trade.details.exit-price': 'Exit Price',
  'trade.details.entry': 'Entry',
  'trade.details.exit': 'Exit',
  'trade.details.size': 'Size',
  'trade.details.duration': 'Duration',
  'trade.details.instrument': 'Instrument',
  'trade.details.exit-time': 'Exit Time',
  'trade.details.entry-time': 'Entry Time',
  'trade.details.title': 'Trade Details',
  'trade.details.thesis': 'Thesis',
  'trade.details.no-thesis': 'No thesis provided for this trade',
  'trade.details.add-thesis': "Click 'Edit' to add a thesis",
  'trade.details.plan': 'Plan',
  'trade.details.risk': 'risk',
  'trade.details.execution': 'Execution',
  'trade.details.show-execution': 'Show breakdown',
  'trade.details.hide-execution': 'Hide breakdown',
  'trade.details.entries-summary': '{count} entries',
  'trade.details.exits-summary': '{count} exits',
  'trade.details.take-profit-count': '{count} targets',
  'trade.details.close-percent': '{percent}% close',

  
  'trade.metadata.account': 'Account:',
  'trade.metadata.custom-tags': 'Custom Tags:',
  'trade.metadata.setups': 'Setups',
  'trade.metadata.mistakes': 'Mistakes',

  
  'trade.image.no-images': 'No images for this trade',
  'trade.image.click-edit': 'Add image',
  'trade.image.alt-prefix': 'Trade image',

  
  'trade.review.mark-as-reviewed': 'Mark as Reviewed',
  'trade.review.reviewed': 'Reviewed',
  'trade.review.reviewed-on': 'Reviewed on {date}',

  
  
  
  'timeline.trade-type.regular': 'Trade',
  'timeline.trade-type.missed': 'Missed Trade',
  'timeline.trade-type.backtest': 'Backtest Trade',
  'timeline.status.open': 'Open',
  'timeline.status.profit': 'Profit',
  'timeline.status.loss': 'Loss',
  'timeline.status.breakeven': 'Breakeven',
  'timeline.aria.trade-status': '{ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.aria.session-navigation': 'Same-day trade navigation',
  'timeline.aria.previous-trade': 'Previous trade: {trade}',
  'timeline.aria.next-trade': 'Next trade: {trade}',
  'timeline.aria.no-previous-trade': 'No previous trade in this trading day',
  'timeline.aria.no-next-trade': 'No next trade in this trading day',
  'timeline.title.current-trade':
    'Current {tradeType}: {ticker} {tradeType} {tradeNumber}',
  'timeline.title.view-trade':
    'View {ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.title.trade-still-open': 'Trade is still open',

  
  
  
  'drc.trades.chart.cumulative-pnl': 'Cumulative P&L',
  'drc.trades.chart.drawdown': 'Drawdown',
  'drc.trades.stats.title': 'Daily Trade Statistics',
  'drc.trades.stats.net-pnl': 'Net P&L',
  'drc.trades.stats.win-rate': 'Win Rate',
  'drc.trades.stats.profit-factor': 'Profit Factor',
  'drc.trades.stats.expectancy': 'Expectancy',
  'drc.trades.stats.total-trades': 'Total Trades',
  'drc.trades.stats.avg-win': 'Avg Win',
  'drc.trades.stats.avg-loss': 'Avg Loss',
  'drc.trades.stats.pl-ratio': 'P/L Ratio',
  'drc.trades.log.title': 'Trade Log',
  'drc.trades.log.empty': 'No trades for this day',
  'drc.trades.log.empty-sub': 'Trades will appear here once they are added',
  'drc.trades.table.images': 'Images',
  'drc.trades.table.entry-exit-time': 'Entry/Exit Time',
  'drc.trades.table.ticker': 'Ticker',
  'drc.trades.table.direction': 'Direction',
  'drc.trades.table.setup': 'Setup',
  'drc.trades.table.pnl': 'P&L',
  'drc.trades.table.open': 'OPEN',
  'drc.trades.table.na': 'N/A',
  'drc.trades.table.unknown': 'Unknown',
  'drc.trades.image.alt': 'Trade {id} Image',
  'drc.trades.image.preview-alt': 'Trade {id} preview',

  
  
  
  'drc.component-name': 'Daily Report Card',
  'drc.tab.preparation': 'Preparation',
  'drc.tab.trades': 'Trades',
  'drc.tab.review': 'Review',

  
  
  
  'drc.preparation.support-levels': 'Support Levels',
  'drc.preparation.resistance-levels': 'Resistance Levels',
  'drc.preparation.enter-price': 'Enter price level',
  'drc.preparation.select-importance': 'Select importance level',
  'drc.preparation.add-support': 'Add support level',
  'drc.preparation.add-resistance': 'Add resistance level',
  'drc.preparation.remove-level': 'Remove level',
  'drc.preparation.no-support': 'No support levels defined',
  'drc.preparation.no-resistance': 'No resistance levels defined',
  'drc.preparation.importance.none': 'None',
  'drc.preparation.importance.high': 'High',
  'drc.preparation.importance.medium': 'Medium',
  'drc.preparation.importance.low': 'Low',
  'drc.preparation.checklist.title': 'Pre-Trade Checklist',
  'drc.preparation.checklist.empty': 'No pre-trade checklist items',
  'drc.preparation.checklist.sub-apply':
    'Apply checklist items from plugin settings',
  'drc.preparation.checklist.sub-add':
    'Add checklist items in the plugin settings',
  'drc.preparation.bias.title': 'Market Bias',
  'drc.preparation.bias.bullish': 'Bullish',
  'drc.preparation.bias.bearish': 'Bearish',
  'drc.preparation.bias.neutral': 'Neutral',
  'drc.preparation.bias.placeholder': 'Select market bias',
  'drc.preparation.goals.title': 'Daily Goals',
  'drc.preparation.goals.empty': 'No daily goals from previous day',
  'drc.preparation.events.title': 'Key Events',
  'drc.preparation.events.all-week': 'All Week',
  'drc.preparation.events.empty': 'No key events for today',
  'drc.preparation.events.sub-empty':
    'Events can be added in the weekly review',
  'drc.preparation.forecast.title': 'Daily Forecast',
  'drc.preparation.media.title': 'Media Links',
  'drc.preparation.media.youtube': 'YouTube Link',
  'drc.preparation.media.youtube-placeholder': 'Link to your trading stream',
  'drc.preparation.error.service-unavailable': 'DRC Service not available',
  'drc.preparation.error.image-upload': 'Error uploading image',

  
  
  
  'drc.missed-trades.title': 'Missed Trades',
  'drc.missed-trades.loading': 'Loading missed trades...',
  'drc.missed-trades.error.service-unavailable':
    'Missed Trade service not available',
  'drc.missed-trades.error.load-failed': 'Failed to load missed trades',
  'drc.missed-trades.error-prefix': 'Error: {error}',
  'drc.missed-trades.retry': 'Retry',
  'drc.missed-trades.unknown': 'Unknown',
  'drc.missed-trades.no-setup': 'No setup specified',
  'drc.missed-trades.badge': 'MISSED',
  'drc.missed-trades.open-details-title': 'Open missed trade details',
  'drc.missed-trades.view-details': 'View Details →',
  'drc.missed-trades.label.setup': 'Setup:',
  'drc.missed-trades.label.reason': 'Reason:',
  'drc.missed-trades.add-button': '+ Add Missed Trade',
  'drc.missed-trades.add-title': 'Add a new missed trade',
  'drc.missed-trades.empty': 'No missed trades for today',
  'drc.missed-trades.empty-sub':
    'Track trading opportunities you missed to improve your execution',

  
  
  
  'missed-trade.reason-title': 'Why I missed this trade',
  'missed-trade.reason-kicker': 'Missed opportunity',
  'missed-trade.loading-navigation': 'Loading navigation...',

  
  
  
  'drc.review.goal-placeholder': 'Your goal for the next session',
  'drc.review.no-questions':
    'No reflection questions defined. Add review questions in settings.',
  'drc.review.answer-placeholder': 'Your answer...',
  'drc.review.mental-game': 'Mental Game:',
  'drc.review.mental-game-aria': 'Mental Game Grade',
  'drc.review.technical-game': 'Technical Game:',
  'drc.review.technical-game-aria': 'Technical Game Grade',
  'drc.review.end-of-day-review': 'End of Day Review',
  'drc.review.performance-grades': 'Performance Grades',
  'drc.review.reflection-questions': 'Reflection Questions',
  'drc.review.goals-for-next-session': 'Goals for Next Session',
  'drc.review.add-goal': 'Add Goal',
  'drc.review.end-of-day-screenshots': 'End of Day Screenshots',
  'drc.review.add-screenshots': 'Add screenshots',
  'drc.review.error.invalid-date':
    'Invalid DRC date format. Please check the date in your DRC note.',

  
  
  
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

  
  'settings.general.display-privacy-section': 'Display & Privacy',
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
    'Display a notification when a new plugin update is available',
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
  'settings.customization.account-types': 'Account Types',
  'settings.customization.setups': 'Setups',
  'settings.customization.mistakes': 'Mistakes',
  'settings.customization.tags': 'Tags',
  'settings.customization.events': 'Events',
  'settings.customization.custom-fields': 'Custom Trade Fields',

  
  
  
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
  'settings.customization.options.notice.removed': 'Removed option "{option}"',
  'settings.customization.options.notice.remove-failed':
    'Option removal failed',
  'settings.customization.options.confirm.reset-message':
    'Are you sure you want to reset all {type} to the default options? This cannot be undone.',
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

  
  
  
  'settings.loss-review.field.content': 'Content',
  'settings.loss-review.field.checkbox-label': 'Checkbox Label',
  'settings.loss-review.field.placeholder-text': 'Placeholder Text',
  'settings.loss-review.field.checkbox-items': 'Checkbox Items',
  'settings.loss-review.field.section-title': 'Section Title',
  'settings.loss-review.field.section-type': 'Section Type',
  'settings.loss-review.placeholder.header-content':
    'Enter header content (supports markdown)',
  'settings.loss-review.placeholder.checkbox-label':
    'Enter checkbox label (supports markdown)',
  'settings.loss-review.placeholder.textarea-placeholder':
    'Enter placeholder text for the textarea',
  'settings.loss-review.placeholder.checkbox-item':
    'Enter checkbox item (supports markdown)',
  'settings.loss-review.placeholder.section-title': 'Enter section title',
  'settings.loss-review.untitled-section': 'Untitled Section',
  'settings.loss-review.type.header': 'Header',
  'settings.loss-review.type.checkbox': 'Single Checkbox',
  'settings.loss-review.type.textarea': 'Text Area',
  'settings.loss-review.type.checkbox-list': 'Checkbox List',

  
  
  
  'button.remove': 'Remove',
  'button.add-item': 'Add Item',
  'button.move-up': 'Move up',
  'button.move-down': 'Move down',
  'button.remove-section': 'Remove Section',

  
  
  
  'settings.customization.trade-fields': 'Custom Trade Fields',
  'settings.customization.custom-fields.description':
    "Create custom fields that will appear in the Advanced tab of the trade form. These fields will be saved to your trade's frontmatter.",
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
    'Custom fields will appear in the "Advanced" tab of the trade form and be saved to your trade notes\' frontmatter.',
  'settings.customization.custom-fields.add-new': 'Add New Field',
  'settings.customization.custom-fields.edit-field': 'Edit Field',
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
  'settings.customization.review-fields.editor.display-group': 'Display Group',
  'settings.customization.review-fields.editor.display-group-desc':
    'Optional group name used by review field widgets',
  'settings.customization.review-fields.editor.display-group-placeholder':
    'Planning, Risk, Execution...',
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
  'settings.customization.review-fields.editor.required-desc':
    'Require a local value when this field is editable on a review note',
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
  'onboarding.welcome.subtitle':
    'Own your trading data. Shape your own workflow.',
  'onboarding.welcome.cta': 'Get Started',
  'onboarding.welcome.chart.week': 'Week {count}',
  'onboarding.view.title': 'Journalit Onboarding',
  'onboarding.welcome.discover-heading': "What you'll discover:",
  'onboarding.welcome.tagline': "Let's get you set up in under 60 seconds",

  
  'onboarding.welcome.insight.win-rate.title': 'Win Rate Analysis',
  'onboarding.welcome.insight.win-rate.content':
    '"Your breakout setups have an 82% win rate vs 67% for pullbacks"',
  'onboarding.welcome.insight.timing.title': 'Timing Patterns',
  'onboarding.welcome.insight.timing.content':
    '"Trades held 2-4 hours show 3x better risk-reward than scalps"',
  'onboarding.welcome.insight.psychology.title': 'Psychology Tracking',
  'onboarding.welcome.insight.psychology.content':
    '"You take profits 15% too early when up more than $500"',

  
  'onboarding.welcome.trust.data-ownership':
    'Your data, your device - Complete ownership and control',
  'onboarding.welcome.trust.any-broker':
    'Works with any broker - MetaTrader sync + manual entry',
  'onboarding.welcome.trust.customizable':
    'Fully customizable - Track what matters to you',

  
  
  
  'onboarding.common.continue': 'Continue',
  'onboarding.common.close': 'Close',
  'onboarding.features.title': 'Select what matches your workflow.',
  'onboarding.features.feature.mt5-sync.label': 'MT5 Sync',
  'onboarding.features.feature.mt5-sync.description':
    'Automatically import trades from MetaTrader 5',
  'onboarding.features.feature.csv-import.label': 'Trade Import',
  'onboarding.features.feature.csv-import.description':
    'Import trades from any broker via CSV files',
  'onboarding.features.feature.manual-entry.label': 'Manual Entry',
  'onboarding.features.feature.manual-entry.description':
    'Log trades manually with full control',
  'onboarding.features.feature.analytics.label': 'Analytics & Insights',
  'onboarding.features.feature.analytics.description':
    'Performance metrics, charts, and trade statistics',
  'onboarding.features.feature.account-tracking.label': 'Account Tracking',
  'onboarding.features.feature.account-tracking.description':
    'Track multiple prop firm and personal accounts',
  'onboarding.features.feature.trade-journal.label': 'Layout Builder',
  'onboarding.features.feature.trade-journal.description':
    'Build custom review layouts with widgets, charts, and notes',
  'onboarding.features.feature.ai-trading-assistant.label':
    'AI Trading Assistant',
  'onboarding.features.feature.ai-trading-assistant.description':
    'Pattern recognition, insights, and personalized guidance',
  'onboarding.features.badge.coming-soon': 'Coming Soon',
  'onboarding.features.badge.pro': 'PRO',
  'onboarding.features.trial.pro': 'PRO features include a 14-day free trial',

  
  
  
  'onboarding.explore.title': 'Explore',
  'onboarding.explore.subtitle':
    'Journalit turns your vault into a full trading journal with dashboards, trade log, account tracking, and customisable layouts.',
  'onboarding.explore.subtitle2':
    'Designed to adapt to your workflow, not force you into ours.',
  'onboarding.explore.tagline': 'Your journal, your rules.',
  'onboarding.explore.section.out-of-box.title': 'Core views & tools',
  'onboarding.explore.core.dashboard.label': 'Trading Dashboard',
  'onboarding.explore.core.dashboard.description':
    'Your performance at a glance — P&L, win rate, drawdowns, and more.',
  'onboarding.explore.core.tradelog.label': 'Trade Log',
  'onboarding.explore.core.tradelog.description':
    'Browse trades by year/month/week/day and drill down instantly.',
  'onboarding.explore.core.accounts.label': 'Account Tracking',
  'onboarding.explore.core.accounts.description':
    'Track multiple accounts and view account-specific performance pages.',
  'onboarding.explore.core.layouts.label': 'Layout Builder',
  'onboarding.explore.core.layouts.description':
    'Customise dashboards and review layouts with widgets and layouts.',
  'onboarding.explore.imports.title': 'Imports & Sync (PRO)',
  'onboarding.explore.imports.subtitle':
    'Preview and setup anytime. Importing/sync requires Pro.',
  'onboarding.explore.imports.csv.label': 'Trade Import',
  'onboarding.explore.imports.csv.description':
    'Preview your CSV and map columns. Importing into your vault requires Pro.',
  'onboarding.explore.imports.mt.label': 'MetaTrader Sync (MT4/MT5)',
  'onboarding.explore.imports.mt.description':
    'Automatic trade syncing from MetaTrader. Requires Pro.',
  'onboarding.explore.cta.open': 'Open',
  'onboarding.explore.cta.manual': 'Open Docs',

  
  
  
  'onboarding.path.kicker': 'Choose Path',
  'onboarding.path.tip.trial':
    'Tip: PRO subscriptions include a 14-day free trial.',
  'onboarding.path.title': 'Choose your first path',
  'onboarding.path.subtitle':
    'Pick the fastest way to get your first trade in Journalit.',
  'onboarding.path.option.manual.label': 'Manual Entry (Free)',
  'onboarding.path.option.manual.description':
    'Create a trade in seconds with the Add Trade form.',
  'onboarding.path.option.csv.label': 'Trade Import',
  'onboarding.path.option.csv.description':
    'Preview your CSV now; import after activating PRO.',
  'onboarding.path.option.mt.label': 'MetaTrader Sync (MT4/MT5)',
  'onboarding.path.option.mt.description':
    'Connect MT4/MT5 for automatic trade syncing.',

  
  
  
  'onboarding.final.manual.title': "You're ready to Journalit",

  'onboarding.final.manual.hotkey.title': 'Suggested hotkey',
  'onboarding.final.manual.hotkey.value': 'Mod + Alt + A',

  'onboarding.final.manual.cta.change-hotkey': 'Set hotkey',
  'onboarding.final.manual.hit-hotkey':
    'Suggested: {hotkey}. Click Set hotkey to configure it.',
  'onboarding.final.csv.title': "You're ready to bring in your trades",
  'onboarding.final.csv.subtitle':
    'Next, preview your CSV. Importing into your vault requires PRO activation.',
  'onboarding.final.csv.cta.open': 'Open Trade Import',
  'onboarding.final.mt.title': "You're ready to connect MetaTrader",
  'onboarding.final.mt.subtitle':
    'Next, set up MT4/MT5 sync. Requires PRO activation.',
  'onboarding.final.mt.cta.open': 'Open MetaTrader Setup',
  'onboarding.final.mt.hero.source.title': 'MetaTrader',
  'onboarding.final.mt.hero.source.subtitle': 'Trade reports',
  'onboarding.final.mt.hero.dest.title': 'Vault',
  'onboarding.final.mt.hero.dest.subtitle': 'Trade notes',
  'onboarding.final.finish': 'Finish',

  
  'onboarding.features.graphic.syncing': 'Syncing trades...',
  'onboarding.features.graphic.complete': 'Sync complete',
  'onboarding.features.graphic.direction.long': 'LONG',
  'onboarding.features.graphic.direction.short': 'SHORT',
  'onboarding.features.graphic.status.win': 'WIN',
  'onboarding.features.graphic.status.loss': 'LOSS',

  
  
  
  'onboarding.activation.title': 'Sign In to Journalit',
  'onboarding.activation.subtitle':
    'Complete authentication in your browser to access your account',
  'onboarding.activation.status.initializing':
    'Generating your authentication code...',
  'onboarding.activation.status.waiting': 'Waiting for sign-in...',
  'onboarding.activation.status.expired': 'Code Expired',
  'onboarding.activation.status.denied': 'Sign-In Denied',
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
  'onboarding.activation.notice.popup-blocked-copied':
    'Browser popup blocked. Activation URL copied to clipboard - please paste in your browser.',
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
  'onboarding.activation.success.subtitle':
    "You're now connected to your Journalit account",
  'onboarding.activation.features.title': 'Available Features:',
  'onboarding.activation.features.sync': 'Sync trades across devices',
  'onboarding.activation.features.analytics': 'Advanced Analytics & Reports',
  'onboarding.activation.features.mt5': 'MT5 Trade Sync',
  'onboarding.activation.features.csv': 'Smart CSV Import',
  'onboarding.activation.auto-advance': 'Auto-continuing in 10 seconds...',
  'onboarding.activation.skip': 'Activate later',
  'onboarding.notice.complete-failed':
    'Failed to save onboarding completion. Please try again later.',
  'onboarding.notice.skip-failed':
    'Failed to save onboarding skip. Please try again later.',

  
  
  
  'onboarding.progress.aria-label': 'Step {current} of {total}',
  'onboarding.progress.step': 'Step {step}',
  'onboarding.progress.status.completed': ' (completed)',
  'onboarding.progress.status.current': ' (current)',
  'onboarding.progress.announcement':
    'Step {current} of {total} completed{label}',

  
  
  
  
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
  'widget.header.description': 'Navigation header with context links',
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
  'widget.review-context-fields.inherited-title': 'Inherited Context',
  'widget.review-context-fields.local-title': 'Local Context',
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
  'widget.review-context-fields.open-source': 'Open',
  'widget.review-context-fields.create-source': 'Create',
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
  'widget.key-events.notes-placeholder': 'Notes about this event (optional)',
  'widget.key-events.notes-label': 'Notes',
  'widget.key-events.default-notes-tooltip':
    'Default notes are managed in Settings → Customisation → Events. Selecting an event here will auto-fill its saved default notes.',
  'widget.key-events.add-button': 'Add Event',
  'widget.key-events.empty-state': 'No key events for today',
  'widget.key-events.empty-state-sub': 'Add events in your Weekly Review',
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
  'widget.stats.no-change': 'No change',
  'widget.stats.no-previous-data': 'No previous data',
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
  'widget.trade-review.questions-hidden':
    'Review questions are hidden for this trade.',
  'widget.trade-review.open-trade-note': 'Open trade note',
  'widget.trade-review.mark-reviewed': 'Mark reviewed',
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
  'widget.table.header.year': 'Year',
  'widget.table.header.trades': 'Trades',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Win%',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.setup': 'Setup',
  'widget.table.header.a-games': 'A Games',
  'widget.table.header.b-games': 'B Games',
  'widget.table.header.c-games': 'C Games',
  'widget.table.header.rating': 'Rating',
  'widget.table.header.avg-rating': 'Avg Rating',

  
  'widget.demon-tracker.column.demon': 'DEMON',
  'widget.demon-tracker.column.occurrences': 'OCCURRENCES',
  'widget.demon-tracker.column.stop-trading': 'STOP TRADING',
  'widget.demon-tracker.period.this-month': 'this month',
  'widget.demon-tracker.period.this-quarter': 'this quarter',
  'widget.demon-tracker.period.this-year': 'this year',
  'widget.demon-tracker.empty.title': 'No mistakes tracked {period}',
  'widget.demon-tracker.empty.description':
    'Mistakes logged in your trades will appear here to help identify patterns',
  'widget.demon-tracker.summary.unique': 'Unique Mistakes:',
  'widget.demon-tracker.summary.total': 'Total Occurrences:',
  'widget.demon-tracker.summary.critical': 'Critical (6+):',

  
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
    'Average MAE for winning closed trades, using the stored MAE/MFE unit',
  'metric.winnerMaeP90.name': 'Winner MAE P90',
  'metric.winnerMaeP90.description':
    '90th percentile MAE threshold for winning closed trades, using the stored MAE/MFE unit',
  'metric.winnerMaeMedian.name': 'Winner MAE Median',
  'metric.winnerMaeMedian.description':
    'Median MAE for winning closed trades, using the stored MAE/MFE unit',
  'metric.avgLossHeat.name': 'Avg Loss Heat',
  'metric.avgLossHeat.description':
    'Average MAE for losing closed trades, using the stored MAE/MFE unit',
  'metric.winnerAvgMfe.name': 'Winner Avg MFE',
  'metric.winnerAvgMfe.description':
    'Average MFE for winning closed trades, using the stored MAE/MFE unit',
  'metric.loserAvgMfe.name': 'Loser Avg MFE',
  'metric.loserAvgMfe.description':
    'Average MFE for losing closed trades, using the stored MAE/MFE unit',
  'metric.winnerMfeP90.name': 'Winner MFE P90',
  'metric.winnerMfeP90.description':
    '90th percentile MFE threshold for winning closed trades, using the stored MAE/MFE unit',
  'metric.loserMfeP90.name': 'Loser MFE P90',
  'metric.loserMfeP90.description':
    '90th percentile MFE threshold for losing closed trades, using the stored MAE/MFE unit',
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
  'metric.category.average': 'Average',

  
  
  
  'onboarding.wizard.cancelled-announcement':
    'Onboarding cancelled. You can replay onboarding later from the Command Palette by searching for "Journalit: Replay Onboarding".',
  'onboarding.wizard.error.next-step': 'Failed to go to next step',
  'onboarding.wizard.error.prev-step': 'Failed to go to previous step',
  'onboarding.wizard.error.trade-service': 'TradeService not available',
  'onboarding.wizard.error.account-service': 'AccountPageService not available',
  'onboarding.wizard.error.create-sample-trade':
    'Failed to create sample trade',
  'onboarding.wizard.error.auth-failed': 'Failed to complete authentication',
  'onboarding.wizard.error.backend-service':
    'Backend integration service not available',
  'onboarding.wizard.error.sign-in-required':
    'Please sign in to generate FTP credentials',
  'onboarding.wizard.error.ftp-generation':
    'Failed to generate FTP credentials',
  'onboarding.wizard.notice.sample-trade-created':
    'Sample trade created successfully! You can find it in your vault.',
  'onboarding.wizard.notice.auth-success':
    'Successfully authenticated! You can now access Pro features.',
  'onboarding.wizard.notice.ftp-generated':
    'FTP credentials generated successfully!',
  'onboarding.wizard.notice.password-masked':
    'Password is masked and cannot be copied. Please regenerate FTP credentials.',
  'onboarding.wizard.notice.copied': '{label} copied to clipboard!',
  'onboarding.wizard.notice.copy-failed': 'Failed to copy {label}',
  'onboarding.wizard.unknown-step.title': 'Unknown step',
  'onboarding.wizard.unknown-step.description':
    'We encountered an unexpected step in the onboarding process.',
  'onboarding.wizard.footer-default':
    'Complete the setup to get started with Journalit',
  'onboarding.wizard.skip-aria': 'Skip this step',
  'onboarding.wizard.skip-onboarding': 'Skip Onboarding',
  'onboarding.wizard.skip-step': 'Skip Step',
  'guide.skip-guide': 'Skip Guide',

  
  
  
  'account.open-trade-log.error': 'Could not open Trade Log for this account.',
  'account.linked-trades.title': 'Linked Trades',
  'account.linked-trades.empty-message': 'No trades linked to this account',
  'account.linked-trades.empty-submessage':
    'Trades will appear here once they are added to this account',
  'account.linked-trades.click-to-open': 'Click to open trade',
  'account.linked-trades.no-path-available': 'No path available',
  'account.linked-trades.no-path-warning': 'No file path - cannot open',
  'account.linked-trades.entry': 'Entry',
  'account.linked-trades.exit': 'Exit',
  'account.linked-trades.size': 'Size',
  'account.linked-trades.setups': 'Setups',
  'account.linked-trades.mistakes': 'Mistakes',
  'account.linked-trades.tags': 'Tags',
  'account.linked-trades.reviewed': 'Reviewed',
  'account.linked-trades.not-reviewed': 'Not Reviewed',
  'account.linked-trades.net-costs': 'Net Costs',
  'account.linked-trades.net-credit': 'Net Credit',

  
  
  
  'account.create.title': 'Create Account',
  'account.create.field.name': 'Account Name',
  'account.create.field.name-desc': 'A unique name for your trading account',
  'account.create.placeholder.name': 'My Trading Account',
  'account.create.field.type': 'Account Type',
  'account.create.field.type-desc': 'The type of trading account',
  'account.create.field.initial-balance': 'Initial Balance',
  'account.create.field.initial-balance-desc':
    'Starting account balance (optional, defaults to 0)',
  'account.create.field.live-balance': 'Live Balance',
  'account.create.field.live-balance-desc': 'Current broker account balance',
  'account.create.field.creation-date': 'Creation Date',
  'account.create.field.creation-date-desc': 'When account was created',
  'account.create.field.currency': 'Currency',
  'account.create.field.currency-desc': "Account's native currency for display",
  'account.create.field.drawdown-type': 'Drawdown Type',
  'account.create.field.drawdown-type-desc':
    'None | Fixed | EOD Trailing | Manual',
  'account.create.field.drawdown-amount': 'Drawdown Amount',
  'account.create.field.drawdown-amount-desc': 'Maximum drawdown limit',
  'account.create.field.profit-target-desc': 'Set a profit target for account',
  'account.create.field.monthly-cost': 'Monthly Cost',
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
  'account.edit.field.drawdown-type-desc':
    'None | Fixed | EOD Trailing | Manual',
  'account.edit.field.drawdown-amount': 'Drawdown Amount',
  'account.edit.field.drawdown-amount-desc':
    'Maximum loss allowed from starting balance',
  'account.edit.field.manual-snapshots': 'Manual Drawdown Snapshots',
  'account.edit.field.manual-snapshots-desc':
    'Manage daily balance snapshots for EOD trailing drawdown calculation',
  'account.edit.field.profit-target-desc': 'Set a profit target for account',
  'account.edit.field.monthly-cost': 'Monthly Cost',
  'account.edit.field.monthly-cost-desc': 'Subscription fees, platform costs',
  'account.copy-trading.title': 'Copy Trading',
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

  
  'account.profit-target.enable': 'Enable Profit Target',
  'account.profit-target.type.absolute': 'Absolute Amount',
  'account.profit-target.type.percentage': 'Percentage',

  
  'account.create.button.creating': 'Creating...',
  'account.create.button.create': 'Create Account',
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
  'account.edit.modal.change-date.info':
    'This will update the initial deposit transaction date to match the new creation date.',
  'account.edit.modal.change-date.confirm': 'Update Creation Date',

  'account.edit.modal.change-balance.title': 'Change Initial Balance',
  'account.edit.modal.change-balance.message':
    'You are about to change the initial balance from {oldBalance} to {newBalance}.',
  'account.edit.modal.change-balance.warning':
    'You are about to change the initial balance of this account.',
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
  'account.edit.modal.delete.warning':
    'Are you sure you want to permanently delete this account?',
  'account.edit.modal.delete.will': 'This action will:',
  'account.edit.modal.delete.item1': 'Remove all account metadata and settings',
  'account.edit.modal.delete.item2':
    'Remove account references from all linked trades',
  'account.edit.modal.delete.item3':
    'Remove auto-generated account tags from notes',
  'account.edit.modal.delete.delete-associated-trades':
    'Also delete all trades linked to this account from my vault',

  
  'common.note-label': 'Note:',
  'common.warning-label': 'Warning:',
  'common.tip-label': 'Tip:',
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
  'templateEditor.widget.demon-tracker.count-mode': 'Count mode:',
  'templateEditor.widget.demon-tracker.count-mode.per-trade': 'Per trade',
  'templateEditor.widget.demon-tracker.count-mode.per-trading-day':
    'Per trading day',
  'templateEditor.widget.demon-tracker.source-mode': 'Source mode:',
  'templateEditor.widget.demon-tracker.source-mode.trades': 'Trades only',
  'templateEditor.widget.demon-tracker.source-mode.session':
    'Session mistakes only',
  'templateEditor.widget.demon-tracker.source-mode.combined':
    'Combined (trades + session)',

  
  
  
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
  'account.transaction.description': 'Description',
  'account.transaction.balance-after': 'Balance after',
  'account.deposits-withdrawals.title': 'Deposits & Withdrawals ({count})',
  'account.deposits-withdrawals.empty':
    'No manual deposits or withdrawals recorded.',
  'account.deposits-withdrawals.empty-sub':
    'Click the + button in the header to add your first transaction.',

  
  
  
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
  'home.quick-links.all-hidden':
    'All quick links are hidden. Use "Add Widget" to restore them.',
  
  'home.quick-links.add-trade': 'Add Trade',
  'home.quick-links.trade-log': 'Trade Log',
  'home.quick-links.trading-dashboard': 'Trading Dashboard',
  'home.quick-links.account-dashboard': 'Account Dashboard',
  'home.quick-links.todays-drc': "Today's DRC",
  'home.quick-links.weekly-review': 'This Week Review',
  'home.quick-links.monthly-review': 'This Month Review',
  'home.quick-links.quarterly-review': 'This Quarter Review',
  'home.quick-links.yearly-review': 'This Year Review',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'Layout Builder',
  'home.quick-links.session-mode': 'Session Mode',
  'home.quick-links.move-above': 'Move quick links above widgets',
  'home.quick-links.move-below': 'Move quick links below widgets',

  
  
  
  'home.widget-selector.title': 'Add to Home',
  'home.widget-selector.section.widgets': 'Widgets',
  'home.widget-selector.section.quick-links': 'Hidden Quick Links',
  'home.widget-selector.restore': 'restore',
  'home.widget-selector.empty': 'All widgets have been added',
  'home.widget-selector.hint.navigate': '↑↓ navigate',
  'home.widget-selector.hint.select': '↵ select',
  'home.widget-selector.hint.close': 'esc close',

  
  
  
  
  'home.period.month': 'This Month',
  'home.period.quarter': 'This Quarter',
  'home.period.year': 'This Year',
  'home.period.lifetime': 'Lifetime',

  
  'home.aria.filter-period': 'Filter Period',
  'home.aria.filter-trade-types': 'Filter Trade Types',
  'home.aria.add-widget': 'Add Widget',
  'home.aria.save-layout': 'Save Layout',
  'home.aria.customize': 'Customise',

  
  'home.button.add-widget': 'Add Widget',
  'home.trade-types.all': 'Regular + Backtest',

  
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
  'home.widget.embedded-note.select-different': 'Select Different Note',
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
  'home.widget.best-hours.strongest-entry-window': 'Strongest entry window',
  'home.widget.best-hours.avg-summary': '{trades} trades · {days} days',
  'home.widget.best-hours.hidden': 'Hidden',
  'home.widget.best-hours.hidden-detail': 'Privacy mode',
  'home.widget.best-hours.no-positive-window': 'No positive window',
  'home.widget.best-hours.insufficient-history': 'Need more data',
  'home.widget.best-hours.sample-requirement': '{count}/2 sampled windows',
  'home.widget.best-hours.developing': 'developing',
  'home.widget.best-hours.no-positive-detail': 'Sampled windows are negative',
  'home.widget.best-hours.period-hidden-aria': 'Time-of-day performance hidden',

  
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
  'home.widget.setups.no-data': 'No setups recorded yet',
  'home.widget.setups.trades-count': '{count} trades',
  'home.widget.setups.win-rate': '{rate}% win rate',

  
  'home.widget.weekly.title': 'This Week',
  'home.widget.weekly.no-trades': 'no trades yet this week',
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

  
  'trade.loading-navigation': 'Loading navigation...',

  
  
  
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
  'filter.modal.review-status': 'Review Status',
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
  'widget.session-mistakes.field-label': 'Mistakes',
  'widget.session-mistakes.placeholder': 'Select or create mistakes',
  'widget.session-mistakes.empty': 'No session mistakes logged',
  'widget.session-mistakes.count': '{count} selected',
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
  'widget.missed-trades.missed-badge': 'Missed',
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
  'widget.trade-table.unknown-account': 'Unknown Account',
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
  'widget.pagination.weeks': 'weeks',
  'widget.pagination.months': 'months',

  
  
  
  'widget.empty.no-data': 'No data available',
  'widget.empty.no-trades': 'No trades for this period',
  'widget.empty.no-closed-trades': 'No closed trades for this period',
  'widget.empty.no-daily-data': 'No daily data for this period',
  'widget.empty.no-weekly-data': 'No weekly data for this period',
  'widget.empty.no-monthly-data': 'No monthly data for this period',
  'widget.empty.no-quarterly-data': 'No quarterly data for this period',
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
  'dashboard.component-selector.title': 'Add Widget',
  'dashboard.component-selector.added': 'Added',
  'dashboard.component-selector.category.performance': 'Performance',
  'dashboard.component-selector.category.analysis': 'Analysis',
  'dashboard.component-selector.category.journal': 'Journal',

  
  'widget.pnlChart.name': 'Cumulative P&L',
  'widget.pnlChart.description': 'Line chart showing cumulative P&L over time',
  'widget.longPnLChart.name': 'Long P&L',
  'widget.longPnLChart.description':
    'Cumulative P&L curve for long closed trades only',
  'widget.shortPnLChart.name': 'Short P&L',
  'widget.shortPnLChart.description':
    'Cumulative P&L curve for short closed trades only',
  'widget.performanceCalendar.name': 'Performance Calendar',
  'widget.performanceCalendar.description':
    'Calendar view showing daily performance',
  'widget.dailyPerformance.name': 'Daily Performance',
  'widget.dailyPerformance.description':
    'Bar chart showing P&L for each trading day',
  'widget.tradesChart.name': 'Trades Chart',
  'widget.tradesChart.description':
    'Bar chart showing P&L for each individual trade',
  'widget.weekdayPerformance.name': 'Weekday Performance',
  'widget.weekdayPerformance.description':
    'Bar chart showing performance for each day of the week',
  'widget.hourlyPerformance.name': 'Hourly Performance',
  'widget.hourlyPerformance.description':
    'Bar chart showing P&L for each hour of the day',
  'widget.tradesChart.limit': '{count} Trades',
  'widget.drawdownChart.name': 'Drawdown Chart',
  'widget.drawdownChart.description':
    'Closed-trade drawdown amount from the prior realized P&L high',
  'widget.directionalDrawdownChart.name': 'Directional Realized Drawdown',
  'widget.directionalDrawdownChart.description':
    'Displays separate long and short closed-trade drawdown amount curves',
  'widget.longDrawdownChart.name': 'Long Drawdown',
  'widget.longDrawdownChart.description':
    'Displays the closed-trade drawdown amount curve for long trades only',
  'widget.shortDrawdownChart.name': 'Short Drawdown',
  'widget.shortDrawdownChart.description':
    'Displays the closed-trade drawdown amount curve for short trades only',
  'widget.drawdownStats.name': 'Realized Drawdown Stats',
  'widget.drawdownStats.description': 'Realized drawdown and recovery stats',
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
  'widget.rollingWinRate.description':
    'Shows the ratio of average wins to average losses over a rolling period',
  'widget.rollingStats.name': 'Rolling Avg Win/Loss',
  'widget.rollingStats.description':
    'Shows average win and loss over a rolling period',

  
  
  
  'forecast.chart-title': '{title} Chart',
  'forecast.upload-label': 'Upload {title} Chart',
  'forecast.upload-label-plural': 'Upload {title} Charts',
  'forecast.alt-text': '{title} Forecast',
  'forecast.description': '{title} Forecast',
  'forecast.notes-placeholder': 'Add your {title} notes here...',

  
  
  
  'filter.chip.remove-aria': 'Remove {label} filter',
  'shared.filter.disabled-preview': 'Filters disabled in preview',
  'shared.filter.open': 'Open filters',
  'shared.filter.active-count': '{count} active filters',

  
  
  
  'ui.toggle-switch.aria-label': 'Toggle switch',
  'ui.folder-browser.placeholder': 'Select a folder...',
  'ui.folder-browser.root': 'Root',
  'ui.folder-browser.clear-aria': 'Clear to use default location',

  
  
  
  'icon-select.default-title': 'Select an option',

  
  
  
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

  
  
  
  'datetime.placeholder.time': '1022p or 10:22 AM',
  'datetime.aria.open-picker': 'Open date picker',
  'datetime.error.date-required': 'Date required',
  'datetime.error.invalid-format': 'Invalid format',
  'datetime.error.date-6-digits': 'Date must be 6 digits (DDMMYY format)',
  'datetime.error.invalid-month': 'Invalid month',
  'datetime.error.invalid-day': 'Invalid day',
  'datetime.error.invalid-date': 'Invalid date',
  'datetime.error.invalid-time-format': 'Invalid time format',
  'datetime.error.time-3-4-digits': 'Time must be 3 or 4 digits',
  'datetime.error.hours-1-12': 'Hours must be 1-12 with AM/PM',
  'datetime.error.hours-0-23': 'Hours must be 0-23 in 24-hour format',
  'datetime.error.minutes-0-59': 'Minutes must be 0-59',

  
  
  
  'modal.template-switch.title': 'Switch Layout?',
  'modal.template-switch.switching-from': "You're switching from",
  'modal.template-switch.switching-to': 'to',
  'modal.template-switch.has-content-title': 'This note has content',
  'modal.template-switch.has-content-desc':
    "Content will be reorganized to fit the new layout. Any content that doesn't fit will be preserved at the bottom of the note for you to review.",
  'modal.template-switch.cannot-undo':
    'This cannot be undone (but you can switch back).',
  'modal.template-switch.button.switch': 'Switch Layout',

  
  
  

  
  
  
  'monthly.game.header.week': 'Week',
  'monthly.game.header.a-games': 'A Games',
  'monthly.game.header.b-games': 'B Games',
  'monthly.game.header.c-games': 'C Games',
  'monthly.game.header.rating': 'Rating',
  'monthly.game.header.notes': 'Notes',
  'monthly.game.week-label': 'W{week}',
  'monthly.game.rating-na': 'N/A',
  'monthly.game.no-data': 'No performance data available for this month',

  
  
  
  'release-notes.title': 'Release Notes',
  'release-notes.loading-plugin': 'Loading plugin...',
  'release-notes.loading': 'Loading release notes...',
  'release-notes.no-content': 'No release notes found',
  'release-notes.current-version': 'Current: v{version}',
  'release-notes.version': 'Version {version}',
  'release-notes.link.docs': 'Docs',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',

  
  
  
  'skeleton.tradelog.loading': 'Loading trade data',
  'skeleton.dashboard-widget.loading': 'Loading widget data',
  'skeleton.account-page.loading': 'Loading account page',
  'grid.aria.retry': 'Retry loading grid layout',
  'grid.aria.remove-widget': 'Remove widget',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description': 'Fills widget CSV export',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Open the Fills widget in TT and switch to Detail, Continuous, or Price with Detail view',
  'csv.broker-guide.tradingtechnologies.step-2':
    'Right-click inside the Fills widget, select “Request download”, and choose the time range',
  'csv.broker-guide.tradingtechnologies.step-3':
    'When TT shows the download-ready notification, download the CSV and import it here',
  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Important:',
  'csv.broker-guide.tradingtechnologies.warning.message':
    'Do not edit the exported file or column order before importing.',
  'csv.broker-guide.tradingtechnologies.doc-label':
    'View Trading Technologies export instructions',
  'trade.metadata.broker-comment': 'Broker Comment',
  'trade.metadata.additional-fields': 'Additional fields',

  
  
  
  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'Performance Calendar',
  'navigation.section.overview': 'Overview',
  'navigation.section.reviews': 'Reviews',
  'navigation.section.tools': 'Tools',
  'navigation.edit-mode.toggle': 'Customise navigation',
  'navigation.edit-mode.hide-item': 'Hide navigation item',
  'navigation.edit-mode.restore-section': 'Hidden Items',
  'navigation.edit-mode.restore': 'Restore',
  'navigation.items.nav-home': 'Home',
  'navigation.items.nav-dashboard': 'Trading Dashboard',
  'navigation.items.nav-trade-log': 'Trade Log',
  'navigation.items.nav-account-dashboard': 'Account Dashboard',
  'navigation.items.nav-drc': "Today's DRC",
  'navigation.items.nav-weekly': "This Week's Review",
  'navigation.items.nav-monthly': "This Month's Review",
  'navigation.items.nav-quarterly': "This Quarter's Review",
  'navigation.items.nav-yearly': "This Year's Review",
  'navigation.items.nav-add-trade': 'Add Trade',
  'navigation.items.nav-layout-builder': 'Layout Builder',
  'navigation.items.nav-quick-import': 'Quick Import',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-session-mode': 'Session Mode',
  'navigation.items.nav-position-size': 'Position Size Calculator',
  'settings.general.navigation-sidebar': 'Navigation Sidebar',
  'navigation.setting.tab-behavior': 'Navigation tab behavior',
  'navigation.setting.tab-behavior.desc':
    'How to open views when clicked in the navigation sidebar',
  'navigation.setting.tab-behavior.new-tab': 'Open in new tab',
  'navigation.setting.tab-behavior.replace': 'Replace active tab',
  'navigation.search.placeholder': 'Search trades & reviews...',
  'navigation.search.clear': 'Clear search',
  'navigation.search.section.trades': 'Trades',
  'navigation.search.section.reviews': 'Reviews',
  'navigation.search.empty': 'No results found',
  'navigation.search.trade-open': 'Open',
  'navigation.search.review.drc': 'Daily Review',
  'navigation.search.review.weekly': 'Weekly Review',
  'navigation.search.review.monthly': 'Monthly Review',
  'navigation.search.review.quarterly': 'Quarterly Review',
  'navigation.search.review.yearly': 'Yearly Review',
  'command.open-navigation-sidebar': 'Open navigation sidebar',
  'command.open-calendar-sidebar': 'Open calendar sidebar',
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
  'widget.weekly-drc-context.header-eyebrow': 'Weekly review',
  'widget.weekly-drc-context.header-title': 'Daily Reviews by Weekday',
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
  'templateEditor.widget.weekly-drc-display-label': 'Display',
  'templateEditor.widget.weekly-drc-start-collapsed': 'Start collapsed',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': 'Card',
  'templateEditor.widget.weekly-drc-style-accordion': 'Accordion',
  'templateEditor.widget.weekly-drc-default-expanded': 'Expanded by default',
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
  'templateEditor.widget.review-context-fields.show-inherited':
    'Show inherited context',
  'templateEditor.widget.review-context-fields.show-local':
    'Show current review values',
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
  'templateEditor.widget.previous-context-add-section': '+ Add section',
  'templateEditor.widget.previous-context-headings-label':
    'Headings to include',
  'templateEditor.widget.previous-context-headings-placeholder':
    'Heading names separated by comma or |',
  'templateEditor.widget.previous-context-fallback-label':
    'Previous DRC fallback',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Nearest earlier DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Expected previous trading day only',
  'calendar.aria.open-daily-review': 'Open daily review for {date}',
  'calendar.aria.open-weekly-review': 'Open weekly review for {date}',
  'trade.header.aria.status': 'Trade status: {status}',
  'csv.mapper.aria.map-column': 'Map column {header}',
  'command.quick-import-trades': 'Quick import trades',
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
    'Sign in to use Quick Import with your saved setup.',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
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
  'quick-import.notice.consent-required':
    'Acknowledge processing before uploading.',
  'quick-import.consent':
    'I understand this file will be uploaded to Journalit servers for processing.',
  'quick-import.privacy-note':
    'Files are uploaded to Journalit servers for processing and are not stored by default.',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',
  'quick-import.status.loading': 'Loading quick setup...',
  'quick-import.status.checking-subscription':
    'Checking subscription status...',
  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
  'quick-import.processing.sent-to-server':
    'Uploaded to Journalit for private processing',
  'quick-import.file.selected': 'Selected file',
  'quick-import.file.processed': 'Processed and ready to write to your vault',
  'quick-import.summary.title': 'Ready to import',
  'quick-import.summary.trades': 'Preview trades',
  'quick-import.summary.to-import': 'To import',
  'quick-import.summary.duplicates': 'Duplicates',
  'quick-import.summary.failed': 'Needs review',
  'quick-import.complete.title': 'Import complete',
  'quick-import.complete.message':
    '{written} written, {duplicates} duplicates, {failed} need review.',
  'quick-import.action.open-full': 'Open full Trade Import',
  'quick-import.action.review-in-trade-import': 'Review in Trade Import',
  'quick-import.action.setup-in-trade-import': 'Set up in Trade Import',
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import': 'Import trades',
  'quick-import.action.import-count': 'Import {count} trades',
  'quick-import.preview.more': '+ {count} more processed trades',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.preview-error.guidance':
    'Check that every required field is mapped, the selected date format matches your file, and numeric columns contain valid trade values.',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': 'Trade',
  'trade-import.gate.brand-right': 'Import',
  'trade-import.gate.sign-in':
    'Stop typing every fill by hand. Sign in to preview broker exports and turn hours of manual entry into one import.',
  'trade-import.gate.upgrade':
    'Stop typing every fill by hand. Pro imports broker exports so you can spend your time reviewing trades instead of entering them.',
  'trade-import.action.open-settings': 'Open settings',
  'trade-import.action.manage-subscription': 'Manage subscription',
  'trade-import.description':
    'Upload CSV, XLSX, XLS, HTML, or broker statements for backend-powered analysis and preview.',
  'trade-import.step.select': 'Upload',
  'trade-import.step.privacy': 'Privacy note',
  'trade-import.step.analyse': 'Review',
  'trade-import.step.preview': 'Import',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': 'Broker',
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
  'trade-import.privacy.acknowledge':
    'I understand and want to upload this export for processing.',
  'trade-import.action.analyse': 'Analyse file',
  'trade-import.action.choose-file': 'Click to upload or drag and drop',
  'trade-import.guide.prompt': 'Not sure what to export?',
  'trade-import.guide.link': 'View broker guide',
  'trade-import.action.drop-file': 'Drop file to upload',
  'trade-import.analyse.detected':
    'Detected {fileType}. Headers and sample rows are returned by the backend.',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Sheet',
  'trade-import.label.header-row': 'Header row',
  'trade-import.placeholder.auto': 'Auto',
  'trade-import.label.date-format': 'Date format',
  'trade-import.mapping.unmapped': 'Unmapped',
  'trade-import.label.save-template': 'Save mapping template',
  'trade-import.placeholder.template-name': 'Template name',
  'trade-import.action.save-template': 'Save template',
  'trade-import.action.preview': 'Generate preview',
  'trade-import.preview.summary':
    '{previewCount} preview trades, {failedCount} failed rows, {incompleteCount} incomplete rows.',
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
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',
  'trade-import.preview.message.duplicate-in-file':
    'Duplicate in selected import file',
  'trade-import.preview.message.multiple-open-matches':
    'Multiple matching open trades found for close-only preview',
  'trade-import.preview.message.quantity-mismatch':
    'Matching open trade quantity differs from close-only preview',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
  'home.quick-links.quick-import': 'Quick Import',

  
  'home.quick-links.setups': 'Setups',
  'command.open-setups': 'Open Setups',
  'setups.view.loading': 'Loading setups…',
  'setups.view.error.title': 'Could not load setups',
  'setups.view.error.load-failed': 'Failed to load setup data.',
  'setups.view.action.retry': 'Retry',
  'setups.view.action.refresh': 'Refresh',
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
  'setups.view.card.open': 'Open setup',
  'setups.view.compare.title': 'Compare setups',
  'setups.view.compare.subtitle':
    'Compare performance and behavior across selected setups.',
  'setups.view.compare.select-title': 'Choose setups to compare',
  'setups.view.compare.empty': 'Select two setups to compare.',
  'setups.view.compare.empty-submessage':
    'Choose two setup cards from the overview to build a side-by-side report.',
  'setups.view.compare.metrics-title': 'Comparison metrics',
  'setups.view.compare.metric': 'Metric',
  'setups.view.compare.edge-column': 'Edge',
  'setups.view.compare.edge-label': 'Winner',
  'setups.view.compare.edge-hidden': 'Hidden in Privacy Mode',
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
  'setups.view.compare.pnl-bars': 'PnL ranking',
  'setups.view.compare.cumulative-title': 'Cumulative performance',
  'setups.view.compare.cumulative-privacy':
    'Cumulative performance is hidden while Privacy Mode is on.',
  'setups.view.compare.cumulative-empty':
    'No cumulative trade data for the selected setups.',
  'setups.view.advanced.title': 'Advanced analytics',
  'setups.view.advanced.subtitle': 'Setup combinations and playbook edge.',
  'setups.view.advanced.broken-trades': 'Broken trades',
  'setups.view.advanced.no-rule-data': 'No rule data yet.',
  'setups.view.advanced.rule-break-count': '{count} breaks',
  'setups.view.advanced.rule-edge-title': 'Rule edge',
  'setups.view.advanced.no-rule-edge': 'No rule edge data yet.',
  'setups.view.advanced.needs-attention': 'Needs attention',
  'setups.view.advanced.no-insights': 'No insights yet.',
  'setups.view.advanced.severity.info': 'Info',
  'setups.view.advanced.severity.warning': 'Warning',
  'setups.view.advanced.severity.critical': 'Critical',
  'setups.view.advanced.combinations-title': 'Setup combinations',
  'setups.view.advanced.combinations-subtitle':
    'Find setup pairs that work well together.',
  'setups.view.advanced.top-combinations': 'Top combinations',
  'setups.view.advanced.best-pairs': 'Best pairs',
  'setups.view.advanced.no-combinations': 'No setup combinations yet.',
  'setups.view.advanced.performance-privacy':
    'Performance details are hidden while Privacy Mode is on.',
  'setups.view.advanced.insight.no-trades':
    'No trades are linked to this setup yet.',
  'setups.view.trade.unknown-instrument': 'Unknown instrument',
  'setups.view.eyebrow': 'Setups',
  'setups.guide.empty.intro.title': 'Create your first setup',
  'setups.guide.empty.intro.description':
    'Setups connect your playbook notes, rules, screenshots, and linked trades so you can review one trading idea in context.',
  'setups.guide.create-new-setup.title': 'Create new setups',
  'setups.guide.create-new-setup.description':
    'Use New setup when you want to add another playbook. The modal walks you through the setup details, linked notes, and rules.',
  'setups.guide.detail-intro.title': 'This is the setup page',
  'setups.guide.detail-intro.description':
    'This setup page brings one playbook into focus with its performance chart, context panel, reference material, actions, and execution rules.',
  'setups.guide.detail-actions.title': 'Setup actions',
  'setups.guide.detail-actions.description':
    'Use these buttons to open related trades or edit the setup, including its details, linked notes, screenshots, and playbook rules.',
  'setups.guide.empty.create-setup.title': 'Start with New setup',
  'setups.guide.empty.create-setup.description':
    'Create one setup first. After it exists, this guide will continue with the normal setup walkthrough.',
  'setups.guide.empty.finish.title': 'Finish creating the setup',
  'setups.guide.empty.finish.description':
    'Fill in the setup details and save it. The Setups guide will resume once the setup is available.',
  'setups.guide.intro.title': 'Welcome to Setups',
  'setups.guide.intro.description':
    'This view brings your setup playbooks, linked trades, notes, screenshots, and rules into one place.',
  'setups.guide.view-tabs.title': 'Switch setup views',
  'setups.guide.view-tabs.description':
    'Use these tabs to move between the overview, setup pairs, and comparison flow when enough setups are available.',
  'setups.guide.overview-chart.title': 'Performance ranking',
  'setups.guide.overview-chart.description':
    'The overview chart ranks setups by the selected metric. Use the controls in the top right to switch the metric or focus the chart on specific setups.',
  'setups.guide.setup-cards.title': 'Setup cards',
  'setups.guide.setup-cards.description':
    'Cards summarize each setup with key metrics, status, last traded date, and a small performance trend.',
  'setups.guide.open-detail.title': 'Open a setup page',
  'setups.guide.open-detail.description':
    'Open a setup card to inspect the dedicated page for its chart, context, playbook material, and execution rules.',
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
  'setups.guide.compare.intro.title': 'Compare setup performance',
  'setups.guide.compare.intro.description':
    'You now have enough setups to review pairs and compare two playbooks side by side.',
  'setups.guide.pairs-mode.title': 'Open setup pairs',
  'setups.guide.pairs-mode.description':
    'Open Pairs to see which setup combinations have enough shared trades to compare.',
  'setups.guide.pairs-chart.title': 'Pair ranking',
  'setups.guide.pairs-chart.description':
    'Pairs mode highlights combinations that may perform better or worse together. Click a bar to open deeper pair insights for that combination.',
  'setups.guide.return-overview.title': 'Return to Overview',
  'setups.guide.return-overview.description':
    'Go back to Overview before choosing setups to compare.',
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
  'setups.guide.compare.finish.title': 'Setups comparison guide complete',
  'setups.guide.compare.finish.description':
    'You have seen the Pairs and Compare surfaces for reviewing multiple setups together.',
  'setups.view.title': 'Setups',
  'setups.view.open-as-markdown': 'Open as Markdown',
  'setups.view.open-as-setup': 'Open as Journalit Setup',
  'setups.view.subtitle':
    'Track playbooks, execution quality, and setup performance.',
  'setups.view.summary.aria': 'Setup overview summary',
  'setups.view.summary.total': 'Total setups',
  'setups.view.summary.active': 'Active',
  'setups.view.summary.most-traded': 'Most traded',
  'setups.view.summary.needs-review': 'Needs review',
  'setups.view.summary.best-performer': 'Best performer',
  'setups.view.summary.tested': 'Tested',
  'setups.view.summary.ready': 'Ready',
  'setups.view.summary.missing-playbooks': 'Missing playbooks',
  'setups.view.summary.no-trade-data': 'No trade data',
  'setups.view.summary.awaiting-trades': 'Awaiting trades',
  'setups.view.summary.of-total': 'of total',
  'setups.view.summary.require-attention': 'require attention',
  'setups.view.summary.needs-mapping': 'Need mapping',
  'setups.view.summary.all-mapped': 'All mapped',
  'setups.view.summary.previous-unavailable': 'Previous data unavailable',
  'setups.view.ranking.title': 'Setup performance ranking',
  'setups.view.ranking.subtitle':
    'Rank setups by the selected performance metric.',
  'setups.view.ranking.metric-aria': 'Performance metric',
  'setups.view.overview.mode.aria': 'Overview chart mode',
  'setups.view.overview.mode.setups': 'Setups',
  'setups.view.overview.mode.pairs': 'Pairs',
  'setups.view.pairs.title': 'Setup pairs',
  'setups.view.pairs.summary-aria': 'Setup pairs summary',
  'setups.view.pairs.best': 'Best pair',
  'setups.view.pairs.worst': 'Worst pair',
  'setups.view.pairs.worst-short': 'Worst',
  'setups.view.pairs.empty': 'No setup pairs with 5+ trades yet.',
  'setups.view.pairs.empty-submessage':
    'Pairs appear after two setups share enough linked trades.',
  'setups.view.pairs.privacy':
    'Pair performance is hidden while Privacy Mode is on.',
  'setups.view.pairs.edge-tooltip':
    'Edge compares the pair expectancy against the stronger solo setup baseline.',
  'setups.view.pairs.metric-aria': 'Pair metric',
  'setups.view.pairs.metric.edge': 'Pair edge',
  'setups.view.pairs.metric.edge-short': 'edge',
  'setups.view.pairs.metric.expectancy': 'Pair expectancy',
  'setups.view.pairs.metric.expectancy-short': 'expectancy',
  'setups.view.pairs.together': 'Together',
  'setups.view.pairs.table.setup-pair': 'Setup pair',
  'setups.view.pairs.equity-curve': 'Equity curve',
  'setups.view.pairs.equity-caption':
    'Cumulative pair performance over time. Green = positive contribution, red = drawdown.',
  'setups.view.pairs.evidence': 'Evidence',
  'setups.view.pairs.edge-comparison': 'Edge comparison',
  'setups.view.pairs.edge-caption': 'Combined edge: {edge}',
  'setups.view.overview.setup-filter.all': 'Setups: All',
  'setups.view.overview.setup-filter.selected': 'Setups: {count} selected',
  'setups.view.overview.setup-filter.aria': 'Choose setups to show',
  'setups.view.overview.setup-filter.select-all': 'Select all',
  'setups.view.overview.setup-filter.clear': 'Clear',
  'setups.view.overview.pnl-chart.title': 'Setup P&L Curve',
  'setups.view.overview.pnl-chart.dropdown-label': 'P&L curve',
  'setups.view.overview.pnl-chart.subtitle':
    'Cumulative P&L from setup-linked trades, split by setup and combined.',
  'setups.view.overview.pnl-chart.combined': 'All setups',
  'setups.view.overview.pnl-chart.selected-combined': 'Selected setups',
  'setups.view.overview.pnl-chart.unassigned': 'Unassigned account',
  'setups.view.overview.pnl-chart.hidden':
    'Setup P&L over time is hidden while privacy mode is enabled.',
  'setups.view.overview.pnl-chart.trade': 'Trade',
  'setups.view.overview.pnl-chart.start': 'Start',
  'setups.view.ranking.privacy':
    'Performance values are hidden while Privacy Mode is on.',
  'setups.view.ranking.empty': 'No setup performance data yet.',
  'setups.view.ranking.empty-submessage':
    'Log trades with setups to start ranking performance.',
  'setups.view.attention.title': 'Needs attention',
  'setups.view.attention.empty': 'No setup issues found.',
  'setups.view.attention.incomplete-playbooks': 'Incomplete playbooks',
  'setups.view.attention.incomplete-playbooks-desc':
    'Some setups need a written playbook.',
  'setups.view.attention.missing-rules': 'Missing rules',
  'setups.view.attention.missing-rules-desc':
    'Some setups do not have checklist rules.',
  'setups.view.attention.low-sample-size': 'Low sample size',
  'setups.view.attention.low-sample-size-desc':
    'More trades are needed before judging performance.',
  'setups.view.attention.missing-linked-notes': 'Missing linked notes',
  'setups.view.attention.missing-linked-notes-desc':
    'Add examples, screenshots, or references to strengthen the playbook.',
  'setups.view.metric.trade-count': 'Trade count',
  'setups.view.metric.trades': 'trades',
  'setups.view.metric.net-pnl': 'Total P&L',
  'setups.view.metric.total-pnl': 'Total PnL',
  'setups.view.metric.win-rate': 'Win rate',
  'setups.view.metric.profit-factor': 'Profit factor',
  'setups.view.metric.last-traded': 'Last traded',
  'setups.view.metric.expected-value': 'Expected value',
  'setups.view.controls.aria': 'Setup filters',
  'setups.view.search.placeholder': 'Search setups…',
  'setups.view.search.aria': 'Search setups',
  'setups.view.status.aria': 'Filter by setup status',
  'setups.view.status.all': 'All statuses',
  'setups.view.status.active': 'Active',
  'setups.view.status.testing': 'Testing',
  'setups.view.status.archived': 'Archived',
  'setups.view.cards.aria': 'Setup cards',
  'setups.view.empty.no-setups':
    'No setups yet. Create your first setup to start tracking playbooks.',
  'setups.view.empty.no-setups-submessage':
    'Setups collect your playbook notes, rules, trades, and performance in one place.',
  'setups.view.badge.complete': 'Complete',
  'setups.view.meta.no-model-category': 'No model/category',
  'setups.view.detail.back': 'Back',
  'setups.view.detail.no-description': 'No description yet.',
  'setups.view.detail.action.edit': 'Edit setup',
  'setups.view.detail.action.view-trades': 'View in Trade Log',
  'setups.view.detail.action.archive': 'Archive setup',
  'setups.view.detail.action.compare': 'Compare setup',
  'setups.view.detail.metrics-aria': 'Setup metrics',
  'setups.view.detail.playbook': 'Playbook',
  'setups.view.detail.no-playbook': 'No playbook written yet.',
  'setups.view.detail.no-playbook-note':
    'Link a playbook note to preview it here.',
  'setups.view.detail.link-playbook-note': 'Link note',
  'setups.view.detail.change-playbook-note': 'Change note',
  'setups.view.detail.playbook-note-modal.search': 'Search notes...',
  'setups.view.detail.playbook-note-modal.empty': 'No matching notes found.',
  'setups.view.detail.empty-playbook-note':
    'The linked playbook note is empty.',
  'setups.view.detail.rules': 'Rules',
  'setups.view.detail.no-rules':
    'Start with guided playbook sections, then customize the criteria to match how you trade this setup.',
  'setups.view.detail.rules.edit': 'Edit rules',
  'setups.view.detail.rules.add-first': 'Add playbook rules',
  'setups.view.detail.rules.add': 'Add rule',
  'setups.view.detail.rules.editor-subtitle':
    'Create and edit the rules that define this setup.',
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
  'setups.view.detail.rules.group-summary': '{count} · {required} required',
  'setups.view.detail.rules.more': '+{count} more',
  'setups.view.detail.rule.category.context': 'Context',
  'setups.view.detail.rule.category.entry': 'Entry',
  'setups.view.detail.rule.category.exit': 'Exit',
  'setups.view.detail.rule.category.risk': 'Risk',
  'setups.view.detail.rule.category.management': 'Management',
  'setups.view.detail.rule.category.invalidation': 'Invalidation',
  'setups.view.detail.rule.category.psychology': 'Psychology',
  'setups.view.detail.rule.required': 'Required',
  'setups.view.detail.rule.optional': 'Optional',
  'setups.view.detail.linked-notes': 'Linked notes',
  'setups.view.detail.no-linked-notes': 'No linked notes yet.',
  'setups.view.detail.performance.aria': 'Setup performance',
  'setups.view.detail.performance.title': 'Performance',
  'setups.view.detail.performance.cumulative-pnl': 'Cumulative PnL',
  'setups.view.detail.performance.cumulative-r': 'Cumulative R',
  'setups.view.detail.performance.drawdown': 'Drawdown',
  'setups.view.detail.performance.empty': 'No linked trades yet.',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',
  'setups.view.detail.performance.tooltip-title': 'Trade performance',
  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Edit linked notes',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'setups.view.detail.execution-gap.subtitle':
    'Captured edge vs missed opportunity',
  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': 'Live R',
  'setups.view.detail.execution-gap.missed-edge': 'Missed Edge',
  'setups.view.detail.execution-gap.live-plus-missed': 'Live + Missed',
  'setups.view.detail.execution-gap.backtest': 'Backtest',
  'setups.view.detail.execution-gap.gap': 'Gap',
  'setups.view.detail.execution-gap.opportunities': 'Opportunities',
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
  'setups.view.detail.scaffold.performance': 'Performance',
  'setups.view.detail.scaffold.performance-title': 'Performance snapshot',
  'setups.view.detail.scaffold.performance-description':
    'Review PnL, R-multiple, drawdown, and recent trade behavior.',
  'setups.view.detail.scaffold.evidence': 'Evidence',
  'setups.view.detail.scaffold.evidence-title': 'Evidence board',
  'setups.view.detail.scaffold.evidence-description':
    'Screenshots and linked examples for this setup.',
  'setups.view.detail.scaffold.playbook-title': 'Playbook notes',
  'setups.view.detail.scaffold.playbook-description':
    'Document execution context, triggers, management, and invalidation.',
  'setups.view.detail.scaffold.rules': 'Rules',
  'setups.view.detail.scaffold.rules-description':
    'Checklist-style rules that define the setup.',
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
  'setups.view.detail.brief.less': 'Show less',
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
  'setups.view.detail.attention.no-invalidation-title':
    'Add invalidation criteria',
  'setups.view.detail.attention.no-invalidation-detail':
    'Define when this setup is no longer valid.',
  'setups.view.detail.attention.no-risk-title': 'Add risk or management rules',
  'setups.view.detail.attention.no-risk-detail':
    'Document how this setup should be managed after entry.',
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
  'setups.view.metric.last-reviewed': 'Last reviewed',
  'setups.view.card.open-named': 'Open {name}',
  'setups.view.card.sparkline-aria': 'Setup sparkline',
  'setups.view.card.status.active': 'Stable',
  'setups.view.card.status.monitor': 'Monitor',
  'setups.view.card.status.review': 'Review',
  'setups.view.date.today': 'Today',
  'setups.view.date.yesterday': 'Yesterday',
  'setups.view.date.days-ago': '{count} days ago',
  'settings.general.copy-trading-pnl-toggled': 'Copy trading PnL is {status}',

  'trade-import.restore.title': 'Restore imported trades from backend',
  'trade-import.restore.description':
    'Create missing local notes for backend imported trades in this vault. This does not create duplicate backend trades.',
  'trade-import.restore.vault': 'Current vault identity: {vaultId}',
  'trade-import.restore.load': 'Restore imported trades from backend',
  'trade-import.restore.none':
    'No missing imported trade projections found for this vault.',
  'trade-import.restore.loaded': 'Found {count} restorable imported trades.',
  'trade-import.restore.load-failed':
    'Could not load restorable imported trades.',
  'trade-import.restore.select-all': 'Select all',
  'trade-import.restore.restore-selected': 'Restore selected ({count})',
  'trade-import.restore.complete':
    'Restored {written} imported trades; {failed} failed.',
  'trade-import.restore.broker-label': 'Backend restore',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.metatrader.description':
    'Sync trades from MetaTrader reports uploaded through your FTP connection.',
  'trade-sync.source.trade-import.description':
    'Restore broker-file imports across vaults and recover missing local trade notes.',
  'trade-sync.import.title': 'Trade Import Sync',
  'trade-sync.import.description':
    'Restore imported trades across vaults and recover missing local notes.',
  'trade-sync.import.card.connection': 'Connection',
  'trade-sync.import.card.backup': 'Import backup',
  'trade-sync.import.card.restorable': 'Restorable trades',
  'trade-sync.import.card.import': 'Trade Import',
  'trade-sync.import.card.open-importer': 'Open importer',
  'trade-sync.import.card.open-importer-desc': 'Import new broker files there',
  'trade-sync.import.card.inventory-summary':
    '{accounts} account(s) · {trades} trade(s)',
  'trade-sync.import.action.check': 'Check',
  'trade-sync.import.action.open-import': 'Open Trade Import',
  'trade-sync.import.action.clear': 'Clear',
  'trade-sync.import.action.select-all': 'Select all',
  'trade-sync.import.action.restore-selected': 'Restore selected ({count})',
  'trade-sync.import.action.create-local-account': 'Create local',
  'trade-sync.import.action.create-local-account-title':
    'Create a local account in this vault using the backend account name.',
  'trade-sync.import.action.save-mapping': 'Save',
  'trade-sync.import.action.save-mapping-title':
    'Save this backend account to local account mapping.',
  'trade-sync.import.action.mapped': 'Mapped',
  'trade-sync.import.action.restore-account': 'Restore',
  'trade-sync.import.action.restore-account-title':
    'Restore missing local trade notes for this backend account.',
  'trade-sync.import.action.restoring': 'Restoring…',
  'trade-sync.import.label.account': 'Account',
  'trade-sync.import.vault-pending': 'Vault pending',
  'trade-sync.import.pending-acks': '{count} pending ACK(s)',
  'trade-sync.import.recovery.title': 'Missing local notes',
  'trade-sync.import.empty': 'This vault is up to date.',
  'trade-sync.import.empty-accounts':
    'No backed-up Trade Import accounts found yet.',
  'trade-sync.import.account.restorable-count': '{count} restorable',
  'trade-sync.import.account.synced-count': '{count} synced',
  'trade-sync.import.account.missing-count': '{count} missing',
  'trade-sync.import.account.issue-count': '{count} issue(s)',
  'trade-sync.import.account.local-account': 'Local account',
  'trade-sync.import.account.mapping-hint':
    'Restored trades will be written to this local account.',
  'trade-sync.import.notice.restored': 'Restored {count} imported trade(s).',
  'trade-sync.import.notice.load-failed':
    'Could not load Trade Import sync status.',
  'trade-sync.import.notice.mapping-failed':
    'Could not save Trade Import account mapping.',
  'trade-sync.import.notice.create-account-failed':
    'Could not create local account.',
  'trade-sync.import.notice.restore-failed':
    'Could not restore Trade Import account.',
  'command.open-session-mode': 'Open session mode',
  'view.session-mode': 'Session mode',
  'session-mode.description':
    "Prepare for today's trading day and capture execution context live.",
  'session-mode.loading': 'Loading Session Mode',
  'session-mode.section.preparation': 'Preparation',
  'session-mode.section.timeline': 'Timeline',
  'session-mode.title.preparation': 'Session preparation',
  'session-mode.title.live': 'Live session',
  'session-mode.title.break': 'Session break',
  'session-mode.title.ended': 'Session ended',
  'session-mode.title.unconfigured': 'Session mode',
  'session-mode.prep.goals': 'Goals',
  'session-mode.prep.checklist': 'Checklist',
  'session-mode.prep.resources': 'Resources',
  'session-mode.action.open-drc': "Open today's DRC",
  'session-mode.action.open-drc-for-date': 'Open DRC for {date}',
  'session-mode.ended.helper': 'Log your trades or review the day.',
  'session-mode.ended.action.import-trades': 'Import trades',
  'session-mode.ended.action.add-trade-manually': 'Add trade manually',
  'session-mode.ended.action.open-drc': 'Open DRC',
  'session-mode.ended.stat.trades': 'Trades',
  'session-mode.ended.stat.notes': 'Notes',
  'session-mode.ended.stat.gate-checks': 'Gate checks',
  'session-mode.waiting.next-session': 'Next session',
  'session-mode.waiting.starts-at': '{session} starts at {time}',
  'session-mode.waiting.preparation-opens-in':
    'Preparation opens in {remaining}',
  'session-mode.waiting.open-drc': 'Open DRC',
  'session-mode.break.eyebrow': 'Session break',
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
  'session-mode.unconfigured.eyebrow': 'Setup guide',
  'session-mode.unconfigured.title': 'Set up Session Mode',
  'session-mode.unconfigured.description':
    'Add your session times to get started.',
  'session-mode.unconfigured.step.window.title': 'Add a session window',
  'session-mode.unconfigured.step.window.description':
    'Set when you usually trade.',
  'session-mode.unconfigured.step.prep.title': 'Review preparation timing',
  'session-mode.unconfigured.step.prep.description':
    'Default: 30 minutes before session start.',
  'session-mode.unconfigured.step.gate.title': 'Use the Starter Trade Gate',
  'session-mode.unconfigured.step.gate.description':
    'Starter IF/THEN checklist is ready.',
  'session-mode.unconfigured.step.log.title': 'Log notes during live sessions',
  'session-mode.unconfigured.step.log.description':
    'Capture notes while trading.',
  'session-mode.unconfigured.action': 'Configure Session Mode',
  'session-mode.unconfigured.settings-note':
    'You can change this anytime in Customisation → Session mode.',
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
  'settings.session-mode.windows-desc':
    'Define the local-time windows you actually trade. These power preparation, live, break, and ended phases.',
  'settings.session-mode.add-window': 'Add session window',
  'settings.session-mode.add-window-short': 'Add',
  'settings.session-mode.no-windows':
    'No session windows configured yet. The live timeline still works, but phase-aware preparation starts after adding a window.',
  'settings.session-mode.layout.title': 'Phase layout',
  'settings.session-mode.layout.desc':
    'Choose which modules appear in each Session Mode phase and set their order.',
  'settings.session-mode.layout.phase-desc':
    'Toggle modules on or off, then move enabled modules into the order you want.',
  'settings.session-mode.layout.phase-desc.waiting':
    'Choose what appears while Session Mode is waiting for the next configured session.',
  'settings.session-mode.layout.phase-desc.preparation':
    'Choose what appears during pre-session preparation before trading starts.',
  'settings.session-mode.layout.phase-desc.live':
    'Choose what appears while a configured trading session is live.',
  'settings.session-mode.layout.phase-desc.break':
    'Choose what appears between configured trading sessions.',
  'settings.session-mode.layout.phase-desc.ended':
    'Choose what appears after all configured trading sessions have ended.',
  'settings.session-mode.layout.reset-phase': 'Reset',
  'settings.session-mode.layout.move-up': 'Move up',
  'settings.session-mode.layout.move-down': 'Move down',
  'settings.session-mode.layout.module.waiting-status': 'Next session card',
  'settings.session-mode.layout.module.waiting-status-desc':
    'Shows the next configured session and when preparation opens.',
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
  'settings.session-mode.layout.module.break-reset': 'Break reset card',
  'settings.session-mode.layout.module.break-reset-desc':
    'Shows the rest, hydration, and next-session reset prompt.',
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
  'settings.session-mode.default-session-name': 'Trading session',
  'settings.session-mode.window-name': 'Session name',
  'settings.session-mode.window-name-placeholder': 'e.g. NY AM',
  'settings.session-mode.window-row-desc':
    'Use local time. Overnight windows are supported when the end time is earlier than the start time.',
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
  'session-log.placeholder.entry': 'What are you seeing, thinking, or feeling?',
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
  'session-log.lessons.title': 'Lessons learned',
  'session-log.lessons.title-singular': '1 lesson learned',
  'session-log.lessons.title-plural': '{count} lessons learned',
  'session-log.lessons.badge': 'LSN',
  'session-log.error.no-drc': "Could not resolve today's DRC.",
  'session-log.trade.entered': 'Entered',
  'session-log.trade.exited': 'Exited',
  'session-log.trade.size': 'size',
  'session-log.status.unresolved': 'unresolved',
  'session-log.status.unclassified': 'unclassified',
  'session-log.action.save': 'Save',
  'session-log.action.cancel': 'Cancel',
  'session-log.action.resolve': 'Resolve',
  'session-log.action.classify': 'Classify',
  'session-log.action.edit': 'Edit',
  'session-log.action.delete': 'Delete',
  'session-log.action.open-trade': 'Open trade',
  'session-log.preview':
    'Session log preview: timestamped notes and trade events will appear here during the session mode.',
  'session-log.alert.tag-concentration':
    '{tag} is {percentage}% of session notes ({count}/{total}). Mindset was a major theme this session.',
  'trade-gate.title': 'Trade Gate',
  'trade-gate.workflow': 'Workflow',
  'trade-gate.action.start': 'Start trade check',
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
  'settings.session-mode.trade-gate.name': 'Workflow name',
  'settings.session-mode.trade-gate.summary': '{count} nodes',
  'settings.session-mode.trade-gate.untitled': 'Untitled workflow',
  'settings.session-mode.trade-gate.start-node': 'Start question',
  'settings.session-mode.trade-gate.add-question': 'Add question',
  'settings.session-mode.trade-gate.add-outcome': 'Add outcome',
  'settings.session-mode.trade-gate.question': 'Question',
  'settings.session-mode.trade-gate.outcome': 'Outcome',
  'settings.session-mode.trade-gate.new-question-title': 'New question',
  'settings.session-mode.trade-gate.node-title': 'Title',
  'settings.session-mode.trade-gate.question-title': 'Question title',
  'settings.session-mode.trade-gate.result-title': 'Result title',
  'settings.session-mode.trade-gate.prompt': 'Prompt',
  'settings.session-mode.trade-gate.description': 'Description',
  'settings.session-mode.trade-gate.options': 'Options',
  'settings.session-mode.trade-gate.option': 'Option',
  'settings.session-mode.trade-gate.new-option': 'New option',
  'settings.session-mode.trade-gate.option-label': 'Option label',
  'settings.session-mode.trade-gate.option-target': 'Leads to',
  'settings.session-mode.trade-gate.outcome-type': 'Result behavior',
  'settings.session-mode.trade-gate.flow-map': 'Flow map',
  'settings.session-mode.trade-gate.flow-map-hint':
    'Click any card or path label to edit it.',
  'settings.session-mode.trade-gate.flow-fit': 'Fit',
  'settings.session-mode.trade-gate.flow-click-hint':
    'Click a node or path label to edit it.',
  'settings.session-mode.trade-gate.edit-selected': 'Edit selected step',
  'settings.session-mode.trade-gate.results': 'Results',
  'settings.session-mode.trade-gate.no-paths':
    'Add options to connect this workflow.',
  'settings.session-mode.trade-gate.missing-target': 'Missing target',
  'settings.session-mode.trade-gate.repeated-node': 'Links back to this node.',
  'settings.session-mode.trade-gate.default-name': 'Basic entry gate',
  'settings.session-mode.trade-gate.default.market-regime': 'Market regime',
  'settings.session-mode.trade-gate.default.market-regime-prompt':
    'Is the current market regime appropriate for your setup?',
  'settings.session-mode.trade-gate.default.bias': 'Higher timeframe bias',
  'settings.session-mode.trade-gate.default.bias-prompt':
    'Is higher timeframe bias aligned with this trade idea?',
  'settings.session-mode.trade-gate.default.risk': 'Risk parameters',
  'settings.session-mode.trade-gate.default.risk-prompt':
    'Is risk defined and acceptable according to your plan?',
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
  'imageGallery.title': 'Gallery',
  'imageGallery.subtitle-count': '{count} media items',
  'imageGallery.no-images': 'No media found yet.',
  'imageGallery.no-filter-results': 'No media matches this filter.',
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
  'imageGallery.grid-aria': 'Gallery',
  'imageGallery.open-source': 'Open note',
  'imageGallery.image-alt': '{source} media from {date}',
  'imageGallery.privacy-blurred': 'Blurred for privacy',
  'imageGallery.filter.label': 'Filter:',
  'imageGallery.filter-aria': 'Filter gallery',
  'imageGallery.filter.all': 'All',
  'imageGallery.filter.winners': 'Winners',
  'imageGallery.filter.losers': 'Losers',
  'imageGallery.filter.breakeven': 'Breakeven',
  'imageGallery.filter.tagged': 'Tagged',
  'imageGallery.filter.untagged': 'Untagged',
  'imageGallery.filter.reviewed': 'Reviewed',
  'imageGallery.filter.unreviewed': 'Unreviewed',
  'imageGallery.sort.label': 'Sort:',
  'imageGallery.sort.newest': 'Newest',
  'imageGallery.sort.oldest': 'Oldest',
  'imageGallery.sort.best': 'Best P&L',
  'imageGallery.sort.worst': 'Worst P&L',
  'imageGallery.size-aria': 'Gallery media size',
  'imageGallery.size.small': 'Small',
  'imageGallery.size.medium': 'Medium',
  'imageGallery.size.large': 'Large',
  'imageGallery.source.label': 'Source:',
  'imageGallery.source.all': 'All media',
  'imageGallery.source.trade': 'Trades',
  'imageGallery.source.reviews': 'Reviews',
  'imageGallery.source.drc': 'Daily reviews',
  'imageGallery.source.weekly': 'Weekly reviews',
  'imageGallery.source.monthly': 'Monthly reviews',
  'imageGallery.source.quarterly': 'Quarterly reviews',
  'imageGallery.source.yearly': 'Yearly reviews',
  'imageGallery.annotation.tagged': 'Tagged',
  'imageGallery.annotation.untagged': 'Untagged',
  'imageGallery.annotation.reviewed': 'Reviewed',
  'imageGallery.annotation.unreviewed': 'Unreviewed',
  'imageGallery.date.unknown': 'Unknown date',
  'imageGallery.annotation.tag': 'Tag',
  'imageGallery.annotation.editor-eyebrow': 'Market structure journal',
  'imageGallery.annotation.editor-title': 'Annotate media',
  'imageGallery.annotation.tags': 'Tags',
  'imageGallery.annotation.tags-placeholder': 'Breakout, A+ Setup, Mistake',
  'imageGallery.annotation.notes': 'Notes',
  'imageGallery.annotation.notes-placeholder':
    'What should future you learn from this chart?',
  'imageGallery.annotation.error.save-failed':
    'Could not save media annotation.',
  'imageGallery.annotation.saving': 'Saving...',
  'tradelog.guide.switch-to-gallery.title': 'Switch from trades to the Gallery',
  'tradelog.guide.switch-to-gallery.description':
    'Use this mode selector to move between the regular Trade Log and the Gallery. Click Gallery to continue the tour with your images, GIFs, videos, and YouTube links.',
  'tradelog.guide.gallery-controls.title':
    'Choose which media you want to review',
  'tradelog.guide.gallery-controls.description':
    'Use Source to choose trades or review notes, Sort to reorder media, and the size buttons to switch between compact scans and larger media previews.',
  'tradelog.guide.gallery-source-sort.title':
    'Choose the media source and order',
  'tradelog.guide.gallery-source-sort.description':
    'Use Source to focus on all media, trade attachments, or review-note media. Use Sort to review the newest, oldest, best, or worst trades first.',
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
    'Use Tag to add media-level tags and notes while the item is large enough to inspect. Open note takes you back to the source trade or review note.',
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
    'Add images, GIFs, videos, or YouTube links to trades or review notes and they will appear here automatically. Once media exists, Journalit will show the full gallery guide for fullscreen review, tags, and notes.',
  'tradelog.guide.image-gallery-empty.source-sort.description':
    'Use Source to choose between trade media and review-note media once both exist. Sort will reorder the gallery when media is available.',
  'tradelog.guide.image-gallery-empty.size.description':
    'These buttons control how large future media cards appear, from compact scans to larger previews.',
  'tradelog.guide.image-gallery-empty.filters.description':
    'Advanced Filters already includes the media filters you will use later, including annotation status and media tags.',
  'tradelog.guide.image-gallery-empty.finish.title':
    'Add media, then come back for the full gallery tour',
  'tradelog.guide.image-gallery-empty.finish.description':
    'After you attach media to trades or review notes, Journalit will show the full Gallery guide with fullscreen review, tagging, and notes.',
  'filter.modal.section.image-gallery': 'Gallery',
  'setups.view.fixture.rule.context-aligned': 'Context aligned',
  'setups.view.fixture.rule.orb.range-defined': 'Opening range defined',
  'setups.view.fixture.rule.orb.volume-expansion': 'Volume expansion',
  'setups.view.fixture.rule.orb.market-aligned': 'Market aligned',
  'setups.view.fixture.rule.orb.clean-invalidation': 'Clean invalidation',
  'setups.view.fixture.rule.orb.target-defined': 'Target defined',
  'setups.view.detail.brief.profile.model': 'Model',
  'setups.view.detail.brief.profile.category': 'Category',
  'setups.view.completeness.no-description': 'No description',
};

export type TranslationKey = keyof typeof en;
export type Lang = typeof en;
export default en;
