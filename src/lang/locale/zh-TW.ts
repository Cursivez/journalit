
import type { Lang } from './en';

const zhTW: Partial<Lang> = {
  
  
  

  
  'command.add-trade': '新增交易',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': '開啟 Trade Import',

  
  'command.create-drc': '開啟 DRC（每日報告卡）',
  'command.create-weekly-review': '開啟週回顧',
  'command.create-monthly-review': '開啟月回顧',
  'command.create-quarterly-review': '開啟季回顧',
  'command.create-yearly-review': '開啟年回顧',

  
  'command.open-dashboard': '開啟交易儀表板',
  'command.open-account-dashboard': '開啟帳戶儀表板',
  'command.open-trade-log': '開啟交易紀錄',
  'command.open-home': '開啟首頁',
  'command.open-position-size-calculator': '開啟倉位大小計算器',

  
  'navigation.items.nav-weekly': '本週回顧',
  'navigation.items.nav-monthly': '本月回顧',
  'navigation.items.nav-quarterly': '本季回顧',
  'navigation.items.nav-yearly': '本年度回顧',

  
  'command.force-sync': '強制同步交易',
  'command.cancel-sync': '取消交易同步',

  
  'command.replay-onboarding': '重新播放新手引導',

  
  
  
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
    'Customize dashboards and review layouts with widgets and templates.',
  'onboarding.explore.imports.title': 'Imports & Sync (PRO)',
  'onboarding.explore.imports.subtitle':
    'Preview and setup anytime. Importing/sync requires Pro.',
  'onboarding.explore.imports.csv.label': 'Trade Import',
  'onboarding.explore.imports.csv.description':
    'Upload CSV, spreadsheet, HTML, and broker statement exports for backend-powered analysis and preview.',
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
    'Use Pro backend-powered analysis for broker export files.',
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
    'Next, open Trade Import. Uploading and processing broker exports requires PRO activation.',
  'onboarding.final.csv.cta.open': 'Open Trade Import',
  'onboarding.final.mt.title': "You're ready to connect MetaTrader",
  'onboarding.final.mt.subtitle':
    'Next, set up MT4/MT5 sync. Requires PRO activation.',
  'onboarding.final.mt.cta.open': 'Open MetaTrader Setup',
  'onboarding.final.mt.hero.source.title': 'MetaTrader',
  'onboarding.final.mt.hero.source.subtitle': 'Trade reports',
  'onboarding.final.mt.hero.dest.title': 'Vault',
  'onboarding.final.mt.hero.dest.subtitle': 'Journalit notes',
  'onboarding.final.finish': 'Finish',
  'command.open-release-notes': '檢視版本說明',

  
  'command.open-layout-builder': '開啟版面配置建構器',
  'command.switch-template': '切換範本',

  
  
  
  'auth.title.already-logged-in': 'Already Logged In',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign In to Journalit',
  'auth.label.email': 'Email Address',
  'auth.placeholder.email': 'your.email@example.com',

  
  
  
  'form.section.trade-details': '交易詳情',
  'form.section.trading-costs': '交易成本',
  'form.section.risk-management': '風險管理',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': '分析與論點',

  
  
  
  'form.tab.basic': '基本',
  'form.tab.details': '詳情',
  'form.tab.advanced': '進階',

  
  
  
  'form.field.account': '帳戶',
  'form.field.asset-type': '資產類型',
  'form.field.direction': '方向',
  'form.field.direction.long': '做多',
  'form.field.direction.short': '做空',
  'form.field.commission': '手續費',
  'form.field.commission-type': '類型',
  'form.field.rebate': '返傭',
  'form.field.swap': '隔夜利息',
  'form.field.other-fees': '其他費用',
  'form.field.stop-loss': '停損',
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Target Price',
  'form.field.close-percent': 'Close %',
  'form.field.risk-amount': '風險金額',
  'form.field.profit-loss': '損益',
  'form.field.total-pnl': '總損益',
  'form.field.realized-pnl': '已實現損益',
  'form.field.total-costs': '總成本：',
  'form.field.setup': '交易策略',
  'form.field.mistake': '錯誤',
  'form.field.custom-tags': '自訂標籤',
  'form.field.trade-thesis': '交易論點',
  'form.field.time': '時間',
  'form.field.price': '價格',
  'form.field.size': '數量',
  'form.field.entries': '進場',
  'form.field.exits': '出場',
  'form.field.optional': '（選填）',

  
  'form.field.position-size': '部位大小',
  'form.field.position-size.shares': '股數',
  'form.field.position-size.contracts': '合約數',
  'form.field.position-size.lots': '手數',
  'form.field.position-size.amount': '數量',
  'form.field.position-size.cfd-units': 'CFD 單位',

  
  'form.field.instrument': '標的',
  'form.field.instrument.ticker': '股票代碼',
  'form.field.instrument.option-symbol': '選擇權代碼',
  'form.field.instrument.future-symbol': '期貨代碼',
  'form.field.instrument.forex-pair': '外匯貨幣對',
  'form.field.instrument.crypto-symbol': '加密貨幣代碼',
  'form.field.instrument.cfd-symbol': 'CFD 代碼',

  
  'form.field.exchange': '交易所',
  'form.field.expiration-date': '到期日',
  'form.field.strike-price': '履約價',
  'form.field.contract-size': '合約規模',
  'form.field.dollars-per-point': '每點價值',
  'form.field.tick-size': '最小跳動單位',
  'form.field.tick-value': '跳動價值',
  'form.field.lot-size': '手數規模',
  'form.field.custom-lot-size': '自訂手數規模',
  'form.field.pip-value': '點值',
  'form.field.leverage-ratio': '槓桿比率',

  
  'form.field.lot-size.standard': '標準手（100,000）',
  'form.field.lot-size.mini': '迷你手（10,000）',
  'form.field.lot-size.micro': '微型手（1,000）',
  'form.field.lot-size.custom': '自訂',

  
  
  
  'form.placeholder.select-accounts': '選擇帳戶',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': '手續費返傭/折扣',
  'form.placeholder.swap': '隔夜融資費用',
  'form.placeholder.other-fees': '平台/監管費用',
  'form.placeholder.stop-loss': '選填停損價格',
  'form.placeholder.target-price': 'Target price',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': '計劃風險金額',
  'form.placeholder.custom-tag': '輸入自訂標籤後按 Enter',
  'form.placeholder.thesis': '輸入此筆交易的論點...',
  'form.placeholder.pnl': '輸入總損益',
  'form.placeholder.exchange-stock': '例如：NYSE、NASDAQ',
  'form.placeholder.exchange-crypto': '例如：Binance、Coinbase',
  'form.placeholder.futures-point-value': '例如：ES1 為 50',
  'form.placeholder.leverage': '例如：100 表示 1:100',

  
  
  
  'form.entry-exit.add-entry': '+ 新增進場',
  'form.entry-exit.add-exit': '+ 新增出場',
  'form.entry-exit.remove-entry': '移除進場',
  'form.entry-exit.remove-exit': '移除出場',
  'form.entry-exit.total-entry-size': '總進場數量：',
  'form.entry-exit.remaining-position': '剩餘部位：',
  'form.entry-exit.open': '（未平倉）',
  'form.entry-exit.closed': '（已平倉）',
  'form.entry-exit.direct-pnl': '直接輸入損益而非價格',
  'form.entry-exit.direct-pnl-desc':
    '直接輸入總損益。手續費和其他費用仍會扣除。',
  'form.entry-exit.calc-pnl': '從進場/出場價格和部位大小計算損益。',

  
  
  
  'form.trade-type.title': '交易類型',
  'form.trade-type.subtitle': '選擇您要建立的交易類型',
  'form.trade-type.regular': '一般交易',
  'form.trade-type.regular-desc': '具有完整進出場資料的正常交易',
  'form.trade-type.missed': '錯過的交易',
  'form.trade-type.missed-desc': '您錯過的交易機會 - 損益和帳戶欄位為選填',
  'form.trade-type.backtest': '回測交易',
  'form.trade-type.backtest-desc': '用於分析目的的回測情境',
  'form.trade-type.missed-reason': '為什麼錯過這筆交易？',
  'form.trade-type.missed-reason-placeholder':
    '描述您為什麼錯過這個交易機會...',

  'form.account-empty-state.title': '請先建立帳戶，再新增交易',
  'form.account-empty-state.create-account': '建立帳戶',
  'form.account-empty-state.submit-disabled': '請先建立帳戶，再儲存這筆交易。',

  'form.empty.take-profits': 'No take profit targets yet',
  'form.action.add-take-profit': 'Add Take Profit',
  'form.action.remove-take-profit': 'Remove take profit',
  
  
  
  'button.save': '儲存',
  'button.cancel': '取消',
  'button.delete': '刪除',
  'button.update': '更新',
  'button.add': '新增',
  'button.create': '建立',
  'button.reset': '重設',
  'button.close': '關閉',
  'button.confirm': '確認',
  'button.submit': '提交',

  'button.add-trade': '新增交易',
  'button.update-trade': '更新交易',
  'button.save-changes': '儲存變更',
  'button.create-trade': '建立交易',
  'button.delete-all': '全部刪除',
  'button.clear-all': '全部清除',
  'button.save-name-only': '僅儲存名稱',
  'button.cancel-action': '取消操作',
  'button.cancel-reset': '取消重設',
  'button.proceed-anyway': '仍要繼續',
  'button.mark-reviewed': '標記為已檢閱',
  'button.add-first-goal': '新增您的第一個目標',
  'button.add-first-event': '新增您的第一個事件',
  'button.create-daily-review': '建立每日回顧',
  'button.apply-settings': '套用設定',
  'button.learn-more': '了解更多',
  'button.upload-image': '上傳圖片',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': '編輯',
  'validation.fix-errors': '請修正以下錯誤：',

  'validation.complete-required': '請完成所有必填欄位',
  'validation.map-required-fields': '匯入前請對應所有必填欄位',

  
  
  
  'notice.verification-sent': '驗證碼已發送！請檢查您的電子郵件。',
  'notice.login-success': '登入成功！',
  'notice.new-verification-sent': '新驗證碼已發送！請檢查您的電子郵件。',
  'notice.logout-success': '已成功登出',
  'notice.hotkey-set': 'Hotkey set: {hotkey}',
  'notice.ftp-created': 'FTP 憑證建立成功',
  'notice.ftp-reset': 'FTP 密碼重設成功！請儲存新密碼。',
  'notice.template-saved': '版面已儲存',
  'notice.template-created': '版面已建立',
  'notice.template-duplicated': '版面已複製',
  'notice.template-deleted': '版面已刪除',
  'notice.default-template-updated': '預設版面已更新',
  'notice.tradelog-saved': '交易紀錄設定儲存成功',
  'notice.settings-exported': '設定已匯出至 {filename}',
  'notice.settings-imported':
    '已成功從 v{version} 匯入設定。請重新啟動 Obsidian 以套用所有變更。',

  'notice.template-switched': '已切換至：{name}',
  'notice.auto-sync-toggled': '自動同步已{status}',
  'notice.auto-sync-enabled': '啟用',
  'notice.auto-sync-disabled': '停用',
  'notice.reset-items': '已重設項目為預設值',
  'notice.reset-timeframes': '已重設時間週期為預設值',
  'notice.custom-fields-imported': '已成功匯入 {count} 個自訂欄位',
  'notice.csv-parsed': 'CSV/XLSX/XLS 解析成功：{count} 筆資料',
  'notice.setups-added': '已為 {count} 筆交易新增交易策略',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': '已為 {count} 筆交易新增錯誤標記',

  
  
  
  'notice.error.open-journalit':
    '無法開啟 Journalit。請嘗試重新載入 Obsidian。',
  'notice.error.open-drc': '無法開啟 DRC：{error}',
  'notice.error.open-dashboard': 'Failed to open dashboard: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': '無法開啟週回顧：{error}',
  'notice.error.open-monthly-review': '無法開啟月回顧：{error}',
  'notice.error.open-quarterly-review': '無法開啟季回顧：{error}',
  'notice.error.open-yearly-review': '無法開啟年回顧：{error}',
  'notice.error.sync-trades': '同步交易失敗：{error}',
  'notice.error.open-release-notes': '無法開啟版本說明：{error}',
  'notice.error.open-layout-builder': '無法開啟版面配置建構器：{error}',
  'notice.error.switch-template': '切換版面失敗：{error}',
  'notice.error.no-active-file': '沒有開啟的檔案。請先開啟一個筆記。',
  'notice.error.no-template-support': '此筆記類型不支援版面。',
  'notice.error.no-templates': '此筆記類型沒有可用的版面。',
  'notice.error.asset-type-required': '新增標的時必須選擇資產類型',
  'notice.error.column-required': '至少必須保留一個可見欄位',
  'notice.error.save-settings': '儲存設定時發生錯誤：{error}',
  'notice.error.sign-in-vault': '請登入以註冊您的保險庫。',
  'notice.error.sign-in-sync': '請登入以使用自動同步功能。',
  'notice.error.export-settings': '匯出設定失敗。請查看主控台以取得詳細資訊。',
  'notice.error.import-settings': '匯入設定失敗：{error}',
  'notice.error.reset-settings': '重設設定失敗。請查看主控台以取得詳細資訊。',

  'notice.error.invalid-drc-date': '無效的 DRC 日期',
  'notice.error.invalid-drc-missed': '無效的 DRC 日期。無法建立錯過的交易。',
  'notice.error.trade-not-found': '找不到交易檔案：{path}',
  'notice.error.mark-reviewed': '標記交易為已檢閱時發生錯誤：{error}',
  'notice.error.add-setups': '新增交易策略時發生錯誤：{error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': '新增錯誤標記時發生錯誤：{error}',
  'notice.error.delete-trades': '刪除交易時發生錯誤：{error}',
  'notice.error.csv-validation': 'CSV/XLSX/XLS 驗證失敗：{errors}',
  'notice.error.import-failed': '匯入失敗：{error}',
  'notice.error.file-too-large': '檔案太大。最大限制為 10MB',
  'notice.error.select-csv': '請選擇一個 CSV/XLSX/XLS 檔案',
  'notice.error.cannot-delete-builtin': '無法刪除內建版面',
  'notice.error.duplicate-to-customize': '請複製此版面以進行自訂',

  
  
  
  'notice.info.no-sync': '目前沒有同步作業',

  'notice.info.settings-recovered': '設定已從備份復原。部分近期變更可能遺失。',
  'notice.info.cannot-remove-locked': '無法移除鎖定的小工具',

  
  
  
  'tradelog.title': '交易紀錄',
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
    'This picker shows the metrics and widgets that are not currently on your Dashboard. Click one to add it.',
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
    'This page controls how your review templates are structured. The easiest way to start is to duplicate a built-in template, then customise your copy.',
  'layoutBuilder.guide.sidebar-overview.title':
    'This sidebar is where you choose what you are editing',
  'layoutBuilder.guide.sidebar-overview.description':
    'Each section in the sidebar is a different template type. Trade templates are separate from your review templates, and the Library section is for sharing templates. After you make your own copy, you can star it to make it the default for new review notes.',
  'layoutBuilder.guide.pick-built-in.title':
    'Start with a built-in DRC template',
  'layoutBuilder.guide.pick-built-in.description':
    'For your first layout, start with one of the built-in DRC templates. It gives you a safe starting point before you make your own copy.',
  'layoutBuilder.guide.duplicate.title': 'Duplicate the built-in layout',
  'layoutBuilder.guide.duplicate.description':
    'Built-in templates are starting points. Duplicate one first so you can safely make your own version.',
  'layoutBuilder.guide.preview-template.title':
    'This preview shows what the template will look like',
  'layoutBuilder.guide.preview-template.description':
    'Scroll through the preview and get a feel for the flow. This is useful for checking whether the template reads clearly before you start editing it.',
  'layoutBuilder.guide.switch-to-editor.title': 'Switch to Editor',
  'layoutBuilder.guide.switch-to-editor.description':
    'Preview shows you what the template will look like. Editor is where you actually change it.',
  'layoutBuilder.guide.editor-overview.title':
    'This is where you edit the template',
  'layoutBuilder.guide.editor-overview.description':
    'Rename the template here, review the widget list, drag the left handle to rearrange widgets, click a widget to change it, and remove anything you do not need.',
  'layoutBuilder.guide.add-widget.title': 'Add a widget to your copy',
  'layoutBuilder.guide.add-widget.description':
    'Use Add Widget to put new blocks into your template. This is how you shape the workflow to match how you review.',
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
    'Set this copy as your default template',
  'layoutBuilder.guide.set-default-template.description':
    'Click the star on your new template if you want new review notes to use this layout automatically.',
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
    'In normal mode, clicking a trade opens it. In multi-select mode, clicking selects it instead. Switch between those two behaviours depending on what you are trying to do.',
  'tradelog.empty': '找不到交易',
  'tradelog.filter.all': '全部',
  'tradelog.filter.winners': '獲利',
  'tradelog.filter.losers': '虧損',
  'tradelog.filter.breakeven': '打平',
  'tradelog.filter.open': '未平倉',
  'tradelog.type.all': '所有類型',
  'tradelog.type.regular': '一般',
  'tradelog.type.missed': '錯過',
  'tradelog.type.backtest': '回測',

  
  
  
  'dashboard.title': '儀表板',
  'dashboard.no-data': '沒有可用的交易資料',
  'dashboard.filter.accounts.all': '所有帳戶',
  'dashboard.filter.accounts.n-selected': '{count} 個帳戶',
  'dashboard.filter.accounts.select-all': '全選',
  'dashboard.filter.accounts.select-all-option': '-- 全選 --',
  'dashboard.filter.accounts.none-found': '未找到帳戶',

  
  'dashboard.filter.mistakes.all': '所有錯誤',
  'dashboard.filter.mistakes.none': '無錯誤',
  'dashboard.filter.mistakes.n-selected': '{count} 個錯誤',
  'dashboard.filter.mistakes.select-all': '全選',
  'dashboard.filter.mistakes.none-found': '未找到錯誤',

  
  
  
  'view.home': '首頁',
  'view.dashboard': '儀表板',
  'view.trade-log': '交易紀錄',
  'view.account-dashboard': '帳戶儀表板',
  'view.layout-builder': '版面配置建構器',
  'view.csv-import': 'Trade Import',

  
  
  
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  
  
  'csv.errors.copy-shareable': '複製可分享報告',
  'csv.errors.copy-report': '複製報告',
  'csv.errors.copy-detailed': '複製詳細報告',

  
  
  
  'csv.account-selector.loading': '正在載入帳戶...',
  'csv.account-selector.no-accounts': '找不到帳戶。',
  'csv.account-selector.create-account-hint': '請先建立帳戶再匯入交易。',
  'csv.account-selector.create-account-cta': '建立帳戶',
  'csv.account-selector.label': '選擇帳戶',

  
  'csv.preview-first-note':
    'Preview is free. Importing into your vault requires PRO activation.',
  'csv.gate.import.title': 'PRO required to import',
  'csv.gate.import.description':
    'Importing trades into your vault is a PRO feature. Activate PRO to continue.',
  'csv.gate.templates.tooltip': 'PRO required (activate to use templates).',
  'csv.gate.ai.tooltip': 'PRO required (activate to use AI mapping).',

  
  
  
  'account.edit.modal.change-date.message':
    '您即將將帳戶「{account}」的建立日期從 {oldDate} 變更為 {newDate}。',
  'account.edit.modal.change-date.warning':
    '這將更新初始存款交易日期，並可能影響帳戶年齡計算、每月結算週期和其他基於日期的指標。',
  'account.edit.modal.change-date.info':
    '這將更新初始存款交易日期，使其與新的建立日期相符。',
  'account.edit.modal.change-balance.message':
    '您即將將初始餘額從 {oldBalance} 變更為 {newBalance}。',
  'account.edit.modal.change-balance.warning':
    '您即將變更此帳戶的初始餘額。此操作將對您的歷史數據產生重要影響。',
  'account.edit.modal.change-balance.info':
    '這將影響所有餘額計算、損益百分比、回撤計算以及完整的交易歷史紀錄。',
  'account.edit.modal.delete.question': '您確定要永久刪除帳戶「{name}」嗎？',
  'account.edit.modal.delete.warning':
    '您確定要永久刪除此帳戶嗎？所有相關數據都將遺失，且此操作無法復原。',

  
  'account.edit.error.name-exists': '帳戶「{name}」已存在',
  'account.edit.error.creation-date-required': '建立日期為必填項',

  
  
  
  'common.loading': '載入中...',
  'common.error': '錯誤',
  'common.success': '成功',
  'common.warning': '警告',
  'common.info': '資訊',
  'common.yes': '是',
  'common.no': '否',
  'common.ok': '確定',
  'common.search': '搜尋...',
  'common.select': '選擇...',
  'common.none': '無',
  'common.all': '全部',
  'common.date': '日期',
  'common.time': '時間',
  'common.today': '今天',
  'common.yesterday': '昨天',
  'common.tomorrow': '明天',
  'common.week': '週',
  'common.month': '月',
  'common.year': '年',
  'common.total': '總計',
  'common.average': '平均',
  'common.min': '最小',
  'common.max': '最大',
  'common.profit': '獲利',
  'common.loss': '虧損',
  'common.win': '盈',
  'common.lose': '虧',
  'common.trade': '交易',
  'common.trades': '交易',

  
  
  
  'settings.title': 'Journalit 設定',
  'settings.language': '語言',
  'settings.language-desc': '選擇外掛程式的顯示語言',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI Trade Import 對應',
  'settings.auth.feature.metatrader-sync': 'MetaTrader 同步',
  'settings.auth.feature.basic-tracking': '基礎交易追踨',
  'settings.auth.feature.manual-csv': '手動 Trade Import',
  'settings.auth.feature.priority-support': '優先支援',

  
  
  
  
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
    'Design your review templates your way.',
  'home.widget.getting-started.item.layouts.time': '1 min',
  'home.widget.getting-started.item.layouts.cta': 'Open Layout Builder',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    'Enable Trade Import, MetaTrader sync, and AI mapping.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',

  
  'premium.gate.cta.activate': 'Activate PRO',
  'premium.gate.cta.upgrade-now': 'Upgrade now',
  'premium.gate.cta.signin-continue': '登入並繼續',
  'premium.gate.cta.continue-pro': '繼續開通 PRO',
  'premium.gate.cta.keep-editing': '繼續編輯',
  'premium.gate.cta.refresh': 'Refresh status',
  'premium.gate.import.state.signin.title': '距離匯入只差一步',
  'premium.gate.import.state.signin.description':
    '你的檔案與對應已準備就緒。請先登入以繼續。',
  'premium.gate.import.state.pro.title': '已準備好匯入',
  'premium.gate.import.state.pro.description':
    '你的檔案與對應已準備就緒。匯入屬於 PRO 功能。',
  'premium.gate.import.reassurance': '你的預覽與欄位對應會維持原樣。',
  'premium.gate.trial-hint': '首次訂閱 PRO 可享 14 天免費試用。',
  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  
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

  
  'csv.results.custom-field-warnings':
    'Skipped {count} invalid custom field value(s)',
  'csv.results.custom-field-warnings-header':
    'CLICK TO SEE CUSTOM FIELD WARNINGS ({count})',
  'csv.report.custom-field-warnings': 'Custom field warnings: {count}',
  'csv.report.raw-custom-field-warnings': 'Custom field warnings:',

  
  'dashboard.metrics.avgRR': '平均風險回報比（盈虧）',
  'dashboard.metrics.avgRRRiskBased': '平均風險回報比（R 基礎）',
  'dashboard.metrics.longestWinStreak': '最佳連勝',
  'dashboard.metrics.longestLossStreak': '最差連敗',
  'dashboard.avgRRRiskBased.tooltip.title': '平均風險回報比（R 基礎）',
  'dashboard.avgRRRiskBased.tooltip.formula': '公式：平均盈利 R / 平均虧損 R',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    '由 {total} 筆已平倉交易中 {valid} 筆具風險資料的交易計算',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    '風險有效交易中，獲利：{wins}，虧損：{losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    '風險資料覆蓋不完整：{total} 筆已平倉交易中僅 {valid} 筆具備有效風險資料。',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    '資料不足，無法計算 R 基礎 RR。請補上停損/風險資料，並確保同時有有效的獲利與虧損交易。',
  'metric.avgRR.name': '平均風險回報比（盈虧）',
  'metric.avgRR.description': '平均風險回報比（平均獲利 / 平均虧損）',
  'metric.avgRRRiskBased.name': '平均風險回報比（R 基礎）',
  'metric.avgRRRiskBased.description':
    '以 R 倍數計算的比率：平均盈利 R / 平均虧損 R（需要停損/風險資料）',
  'metric.longestWinStreak.name': '最佳連勝',
  'metric.longestWinStreak.description': '依平倉日期計算的最長連續獲利',
  'metric.longestLossStreak.name': '最差連敗',
  'metric.longestLossStreak.description': '依平倉日期計算的最長連續虧損',
  'metric.numTrades.name': '總交易數',
  'metric.numTrades.description': '已平倉交易總筆數',
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
    '顯示為貨幣',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    '僅在交易日誌中將此數字欄位格式化為貨幣值',
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
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.returnPercent': 'Return %',
  'filter.modal.section.custom-fields': 'Custom Fields',
  'filter.modal.custom-field.n-selected': '{count} selected',
  'filter.modal.custom-field.none-available': 'No values available',
  'settings.general.analytics-date-basis': '分析日期基準',
  'settings.general.analytics-date-basis-desc':
    '更適合波段交易者。分析可使用進場日期或最終出場日期。出場日期模式只統計已平倉交易，且直接 PnL 交易必須提供出場日期。',
  'settings.general.analytics-date-basis-aria': '選擇分析日期基準',
  'settings.general.analytics-date-basis-entry': '進場日期',
  'settings.general.analytics-date-basis-exit': '出場日期',
  'settings.general.analytics-date-basis-changed':
    '分析日期基準已變更為 {basis}',
  'trade.metadata.broker-comment': '經紀商備註',
  'tradelog.column.mtComment': 'MT備註',
  'tradelog.tooltip.mtComment': 'MT備註：',
  
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
  'widget.directional-drawdown.name': 'Directional Realized Drawdown',
  'widget.directional-drawdown.description':
    'Separate long and short closed-trade drawdown amount curves',

  'widget.long-drawdown.name': 'Long Drawdown',
  'widget.long-drawdown.description':
    'Closed-trade drawdown amount curve for long trades only',
  'widget.short-drawdown.name': 'Short Drawdown',
  'widget.short-drawdown.description':
    'Closed-trade drawdown amount curve for short trades only',
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

  'guide.skip-guide': 'Skip Guide',
  'settings.general.data-management': '資料管理 & 隱私',

  'settings.general.display-privacy-section': '顯示 & 隱私',

  'settings.general.privacy-mode': '隱私模式',

  'settings.general.privacy-mode-desc':
    '在介面中遮蔽敏感的交易、帳戶、價格和績效數值，不會變更已儲存的資料。',

  'settings.general.privacy-mode-aria': '切換隱私模式',
  'settings.customization.options.field.default-event-notes':
    'Default event notes:',
  'settings.customization.options.placeholder.default-event-notes':
    'Notes to auto-fill when this event is selected',
  'widget.key-events.notes-label': 'Notes',
  'widget.key-events.default-notes-tooltip':
    'Default notes are managed in Settings → Customisation → Events. Selecting an event here will auto-fill its saved default notes.',
  'widget.previous-trading-day-context.name': 'Previous Trading Day Context',
  'widget.previous-trading-day-context.description':
    'Read-only context pulled from headings in the previous DRC',
  'widget.previous-trading-day-context.reference-label': 'Previous DRC',
  'widget.previous-trading-day-context.open-source': 'Open',
  'widget.previous-trading-day-context.image-alt-prefix': 'Previous DRC image',
  'widget.previous-trading-day-context.no-sections-configured':
    'Choose at least one section in the template settings.',
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
    'Choose at least one DRC section in the template settings.',
  'widget.weekly-drc-context.current-week-not-found':
    'Current weekly review not found.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'Current weekly review date not found.',
  'widget.weekly-drc-context.load-error': 'Failed to load weekly DRC review.',
  'widget.weekly-drc-context.invalid-context': '此元件僅適用於週度複盤筆記',
  'templateEditor.widget.weekly-drc-day-label': '日期',
  'templateEditor.widget.weekly-drc-display-label': '顯示',
  'templateEditor.widget.weekly-drc-start-collapsed': '預設收合',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': '卡片',
  'templateEditor.widget.weekly-drc-style-accordion': 'Accordion',
  'templateEditor.widget.weekly-drc-default-expanded': 'Expanded by default',
  'templateEditor.widget.previous-context-sections-label':
    'Sections to include',
  'templateEditor.widget.previous-context-heading-label':
    'Previous DRC section heading',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Choose a heading',
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
  'dashboard.conversion.original-pnl': '原始損益',
  'dashboard.conversion.converted-pnl': '轉換後損益',
  'dashboard.conversion.details-label': '貨幣轉換詳情',
  'dashboard.conversion.requires-conversion': '多貨幣損益圖表需要匯率轉換。',
  'widget.stats.vs-prev': 'vs prev',
  'dashboard.metrics.past-30d': 'past 30d',
  'widget.stats.no-change': 'No change',
  'widget.stats.no-previous-data': 'No previous data',
  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',
  'chart.tooltip.account': 'Account',
  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'widget.account-breakdown.name': 'Account Breakdown',
  'widget.account-breakdown.description':
    'Compare performance across accounts in this review period',
  'widget.account-breakdown.empty': 'No closed trades for this period',
  'widget.account-breakdown.column.account': 'Account',
  'widget.account-breakdown.column.trades': 'Trades',
  'widget.account-breakdown.column.pnl': 'Net P&L',
  'widget.account-breakdown.column.win-rate': 'Win Rate',
  'widget.account-breakdown.column.profit-factor': 'Profit Factor',
  'widget.trade-table.column.account': 'Account',
  'widget.trade-table.unknown-account': 'Unknown Account',
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
  'quick-import.notice.consent-required':
    'Acknowledge processing before uploading.',
  'quick-import.consent':
    'I understand this file will be uploaded to Journalit servers for processing.',
  'quick-import.privacy-note':
    '檔案會上傳到 Journalit 伺服器進行處理，預設不會儲存。',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',
  'quick-import.status.loading': 'Loading quick setup...',
  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
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
  'quick-import.action.import': 'Import trades',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.preview-error.guidance':
    '請檢查所有必填欄位是否已對應，所選日期格式是否符合檔案，且數字欄位是否包含有效的交易數值。',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.sign-in':
    'Sign in is required before uploading broker exports for Trade Import.',
  'trade-import.gate.upgrade':
    'Trade Import is a Pro feature. Upgrade is required before uploading broker exports.',
  'trade-import.action.open-settings': 'Open settings',
  'trade-import.action.manage-subscription': 'Manage subscription',
  'trade-import.description':
    'Upload CSV, XLSX, XLS, HTML, or broker statements for backend-powered analysis and preview.',
  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
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
  'trade-import.action.choose-file': 'Choose file',
  'trade-import.guide.prompt': '不確定要匯出什麼？',
  'trade-import.guide.link': '查看券商指南',
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
  'trade-import.table.quantity': 'Quantity',
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
};

export default zhTW;
