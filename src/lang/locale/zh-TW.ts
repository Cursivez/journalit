
import type { Lang } from './en';

const zhTW: Partial<Lang> = {
  'trade.broker-synced-at': '券商同步於 {date}',
  'home.period.month': '月份',
  'home.period.quarter': '季度',
  'home.period.year': '年度',
  'home.period.lifetime': '全部時間',
  
  
  

  
  'command.add-trade': '新增交易',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': '開啟 Trade Import',

  
  'command.create-drc': '開啟 DRC（每日報告卡）',
  'command.create-weekly-review': '開啟週回顧',
  'command.create-monthly-review': '開啟月回顧',
  'command.create-quarterly-review': '開啟季回顧',
  'command.create-yearly-review': '開啟年回顧',

  
  'command.open-dashboard': '開啟儀表板',
  'command.open-account-dashboard': '開啟帳戶',
  'command.open-trade-log': '開啟交易紀錄',
  'command.open-home': '開啟首頁',
  'command.open-position-size-calculator': '開啟倉位大小計算器',

  
  'navigation.items.nav-weekly': '本週回顧',
  'navigation.items.nav-monthly': '本月回顧',
  'navigation.items.nav-quarterly': '本季回顧',
  'navigation.items.nav-yearly': '本年度回顧',

  
  'backend.cards.sync.cancel': '取消同步',

  
  'command.replay-onboarding': '重新播放新手引導',

  
  
  

  
  
  
  'onboarding.notice.trade-sync-open-failed':
    '無法開啟 Trade Sync。請再試一次。',

  'command.open-release-notes': '檢視版本說明',

  
  'command.open-layout-builder': '開啟版面配置建構器',

  
  
  
  'auth.title.already-logged-in': 'Already Logged In',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign In to Journalit',
  'auth.label.email': 'Email Address',

  
  
  
  'form.section.trade-details': '交易詳情',
  'form.section.trading-costs': '交易成本',
  'form.section.risk-management': '風險管理',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': '分析與論點',

  
  
  
  'form.tab.basic': '基本',
  'form.tab.details': '詳情',
  'form.tab.advanced': '進階',

  
  
  
  'form.import-shortcut.open': '開啟交易匯入',
  'form.layout.customize': '自訂表單',
  'form.layout.modal-title': '自訂交易表單',
  'form.layout.settings-title': '交易表單版面',

  'form.layout.input-mode': '輸入模式',
  'form.layout.input-mode-prices': '價格',
  'form.layout.input-mode-pnl-risk': 'P&L + 風險',
  'form.layout.input-mode-prices-desc':
    '記錄進場與出場價格，讓 Journalit 計算 P&L。',
  'form.layout.input-mode-pnl-risk-desc':
    '直接記錄交易 P&L 和風險金額。Journalit 會自動計算 R 倍數。',
  'form.layout.asset-type-mode': '資產類型',
  'form.layout.asset-type-mode-show': '每次選擇',
  'form.layout.asset-type-mode-fixed': '固定',
  'form.layout.default-asset-type': '預設資產類型',
  'form.layout.active-fields': '顯示區塊',
  'form.layout.available-fields': '隱藏區塊',
  'form.layout.active-fields-desc': '拖曳區塊來重新排序。移除你不使用的項目。',
  'form.layout.available-fields-desc': '需要時可將隱藏區塊加回交易表單。',
  'form.layout.empty-active': '沒有顯示任何選用區塊。',
  'form.layout.all-active': '所有選用區塊都已顯示。',
  'form.layout.add-field-aria': '將 {field} 加入交易表單',
  'form.layout.remove-field-aria': '在交易表單中隱藏 {field}',
  'form.layout.saved': '交易表單版面已儲存',
  'form.layout.item.trading-costs.commission': '佣金',
  'form.layout.item.import-shortcut': '匯入快捷入口',
  'form.layout.item.import-shortcut-desc': '顯示一個開啟交易匯入的底部按鈕。',
  'form.layout.item.core-details': '核心交易詳情',
  'form.layout.item.core-details-desc':
    '帳戶、標的、方向和進出場輸入會固定在最前。',
  'form.layout.item.asset-specific': '資產專屬欄位',
  'form.layout.item.pnl-preview': 'P&L 預覽',

  'form.layout.item.trade-currency': '交易貨幣 / 匯率',
  'form.layout.item.trade-currency-desc':
    '以其他貨幣輸入交易，並可選擇手動指定匯率。',
  'form.layout.item.exchange-desc': '股票與加密貨幣交易的交易所欄位。',
  'form.layout.item.direct-pnl-toggle-desc':
    '將單筆交易切換為直接輸入總損益，而非填寫出場價格。',
  'form.layout.manual-fx-rate': '覆寫匯率',
  'form.layout.result-r': 'R 結果',
  'form.layout.entry-time': '交易時間',

  
  
  
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
  'form.field.trade-currency': '交易貨幣',
  'form.field.fx-rate': '兌{base}匯率',
  'form.field.fx-rate-override': '覆寫匯率（{quote} → {base}）',

  
  'form.forex.using-manual-rate': '使用手動匯率',
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
  'form.placeholder.fx-rate': '1 {currency} = ? {base}（留空：使用每日匯率）',
  'form.placeholder.custom-tag': '輸入自訂標籤後按 Enter',
  'form.placeholder.thesis': '輸入此筆交易的論點...',

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
  'form.ideal-exit.title': '理想出場',

  'form.ideal-exit.price': '理想價格',
  'form.ideal-exit.size': '數量',
  'form.ideal-exit.remove': '移除理想出場',

  'form.ideal-exit.copy-actual': '複製實際出場',

  'form.ideal-exit.tooltip':
    '記錄事後認為更理想的出場計畫。支援分批出場用於回顧捕捉效率。',
  'form.ideal-exit.empty': '尚無理想出場',
  
  
  
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

  'form.account-empty-state.title': '設定你的第一個帳戶',
  'form.account-empty-state.description':
    '帳戶用於記錄餘額，讓 Journalit 能夠計算報酬、風險與回撤。建立帳戶只需要一個名稱。',
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

  'button.confirm': '確認',

  'button.add-trade': '新增交易',
  'button.update-trade': '更新交易',
  'button.save-changes': '儲存變更',
  'button.create-trade': '建立交易',
  'button.delete-all': '全部刪除',
  'button.clear-all': '全部清除',

  'button.cancel-reset': '取消重設',
  'button.proceed-anyway': '仍要繼續',
  'button.mark-reviewed': '標記為已檢閱',

  'button.learn-more': '了解更多',
  'button.upload-image': '上傳媒體',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': '編輯',
  'validation.fix-errors': '請修正以下錯誤：',

  'validation.complete-required': '請完成所有必填欄位',

  
  
  

  'notice.login-success': '登入成功！',

  'notice.logout-success': '已成功登出',
  'notice.hotkey-set': '快捷鍵已設定：{hotkey}',
  'notice.ftp-created': 'FTP 憑證建立成功',
  'notice.ftp-password-rotated':
    '已為此裝置產生新的 FTP 憑證。在其他裝置上設定的 FTP 同步（例如您的 MetaTrader EA）必須更新為新密碼。',
  'notice.ftp-reused':
    '已載入此裝置上現有的 FTP 憑證。如果它們不再有效，請使用重設密碼。',
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

  'notice.custom-fields-imported': '已成功匯入 {count} 個自訂欄位',

  'notice.setups-added': '已為 {count} 筆交易新增交易策略',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': '已為 {count} 筆交易新增錯誤標記',

  
  
  
  'notice.error.open-journalit':
    '無法開啟 Journalit。請嘗試重新載入 Obsidian。',
  'notice.error.open-drc': '無法開啟 DRC：{error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': '無法開啟週回顧：{error}',
  'notice.error.open-monthly-review': '無法開啟月回顧：{error}',
  'notice.error.open-quarterly-review': '無法開啟季回顧：{error}',
  'notice.error.open-yearly-review': '無法開啟年回顧：{error}',

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

  
  
  

  'notice.info.settings-recovered': '設定已從備份復原。部分近期變更可能遺失。',
  'notice.info.cannot-remove-locked': '無法移除鎖定的小工具',

  
  
  
  'tradelog.title': '交易紀錄',
  'dashboard.guide.empty.intro.title': 'Welcome to your Dashboard',
  'dashboard.guide.empty.intro.description':
    'Your Dashboard becomes useful as soon as Journalit has trading history to analyse.',
  'dashboard.guide.empty.state.title': 'Bring your trading history with you',
  'dashboard.guide.empty.state.description':
    'Import previous trades to start with meaningful performance data, or add a trade manually if you are recording your first trades.',
  'dashboard.guide.main.intro.title': '這是您的儀表板',
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
  'home.guide.intro.title': '歡迎回家',
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
    'Type in the search box to find a widget by name, description, or category, then choose it. You can also press Next and Journalit will choose the first result for you.',
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

  'trade-form.guide.customization-modal.title': '讓表單符合你的工作流程',
  'trade-form.guide.customization-modal.description':
    '你可以在這裡顯示、隱藏和重新排序選用區塊。讓表單專注於你真正使用的欄位。',
  'trade-form.guide.finish.title': '這就是自訂功能',
  'trade-form.guide.finish.description':
    '當交易表單需要符合不同的日誌流程時，你可以隨時回到這個按鈕進行調整。',
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
  'tradelog.guide.multi-select.title': 'Turn on multi-select',
  'tradelog.guide.multi-select.description':
    'Click this button to select several trades at once. When multi-select is on, row clicks select trades instead of opening them.',
  'tradelog.guide.batch-actions.title': 'These are your batch actions',
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
  'dashboard.empty.import-action': 'Import existing trades',
  'dashboard.empty.manual-action': 'Add a trade manually',
  'dashboard.widgets.setup-performance.title': '策略績效',
  'dashboard.widgets.setup-performance.description':
    '按交易策略比較績效的排名長條圖',
  'dashboard.widgets.setup-performance.empty': '沒有策略績效資料',
  'dashboard.widgets.setup-performance.masked-label': '策略',
  'dashboard.widgets.tag-performance.title': '標籤績效',
  'dashboard.widgets.tag-performance.description':
    '按交易標籤比較績效的排名長條圖',
  'dashboard.widgets.tag-performance.empty': '沒有標籤績效資料',
  'dashboard.widgets.tag-performance.masked-label': '標籤',
  'dashboard.widgets.ticker-performance.title': '標的績效',
  'dashboard.widgets.ticker-performance.metric-aria': '指標',
  'dashboard.widgets.ticker-performance.view-aria': '檢視模式',
  'dashboard.widgets.ticker-performance.view.best-and-worst': '最佳與最差',
  'dashboard.widgets.ticker-performance.view.best': '最佳 10',
  'dashboard.widgets.ticker-performance.view.worst': '最差 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': '總盈虧',
  'dashboard.widgets.ticker-performance.metric.total-r': '總R',
  'dashboard.widgets.ticker-performance.metric.win-rate': '勝率',
  'dashboard.widgets.ticker-performance.tooltip.ticker': '標的：{ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': '交易：{count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    '勝率：{rate}（{wins}勝 / {losses}負）',

  'dashboard.widgets.ticker-performance.empty': '沒有標的績效資料',
  'dashboard.widgets.ticker-performance.empty-submessage':
    '沒有符合目前篩選條件且含標的的已平倉交易。',
  'dashboard.widgets.ticker-performance.masked-ticker': '標的',
  'dashboard.widgets.ticker-performance.omitted-count': '已省略：{count}',

  'widget.tickerPerformance.name': '標的績效',
  'widget.tickerPerformance.description': '按標的比較績效的排名長條圖',
  'dashboard.filter.accounts.all': '所有帳戶',
  'dashboard.filter.accounts.n-selected': '{count} 個帳戶',
  'dashboard.filter.accounts.select-all': '全選',

  'dashboard.filter.accounts.none-found': '未找到帳戶',

  
  'dashboard.filter.mistakes.all': '所有錯誤',
  'dashboard.filter.mistakes.none': '無錯誤',
  'dashboard.filter.mistakes.n-selected': '{count} 個錯誤',
  'dashboard.filter.mistakes.select-all': '全選',
  'dashboard.filter.mistakes.none-found': '未找到錯誤',

  
  
  

  'view.dashboard': '儀表板',
  'view.trade-log': '交易紀錄',
  'view.account-dashboard': '帳戶',
  'view.layout-builder': '版面配置建構器',
  'view.csv-import': 'Trade Import',

  
  
  
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.history-ready': 'Your trading history is ready',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  
  

  'csv.errors.copy-report': '複製報告',

  
  
  

  

  
  
  
  'account.edit.modal.change-date.message':
    '您即將將帳戶「{account}」的建立日期從 {oldDate} 變更為 {newDate}。',
  'account.edit.modal.change-date.warning':
    '這將更新初始存款交易日期，並可能影響帳戶年齡計算、每月結算週期和其他基於日期的指標。',

  'account.edit.modal.change-balance.message':
    '您即將將初始餘額從 {oldBalance} 變更為 {newBalance}。',

  'account.edit.modal.change-balance.info':
    '這將影響所有餘額計算、損益百分比、回撤計算以及完整的交易歷史紀錄。',
  'account.edit.modal.delete.question': '您確定要永久刪除帳戶「{name}」嗎？',

  
  'account.edit.error.name-exists': '帳戶「{name}」已存在',
  'account.edit.error.creation-date-required': '建立日期為必填項',

  
  
  
  'common.loading': '載入中...',
  'common.error': '錯誤',

  'common.warning': '警告',
  'common.info': '資訊',
  'common.yes': '是',
  'common.no': '否',
  'common.ok': '確定',

  'common.none': '無',
  'common.all': '全部',
  'common.date': '日期',

  'common.week': '週',
  'common.month': '月',
  'common.year': '年',

  'common.min': '最小',
  'common.max': '最大',
  'common.profit': '獲利',

  'common.trade': '交易',
  'common.trades': '交易',
  'common.color.label': '色彩',
  'common.color.default': '預設',

  
  
  

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI Trade Import 對應',
  'settings.auth.feature.basic-tracking': '基礎交易追踨',

  'settings.auth.feature.priority-support': '優先支援',

  
  
  
  
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description':
    'Checklist to help you add trading history and configure Journalit',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.account.title': '設定你的交易帳戶',
  'home.widget.getting-started.item.account.description':
    '交易會記錄到用於追蹤餘額的帳戶中。沒有帳戶就無法計算報酬與回撤。',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': '設定帳戶',
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
    'Design your review templates your way.',
  'home.widget.getting-started.item.layouts.time': '1 min',
  'home.widget.getting-started.item.layouts.cta': 'Open Layout Builder',
  'home.widget.getting-started.item.sidebar.title': '開啟導覽側欄',
  'home.widget.getting-started.item.sidebar.description':
    '快速存取 Journalit 頁面、回顧、工具與搜尋。',
  'home.widget.getting-started.item.sidebar.time': '10 秒',
  'home.widget.getting-started.item.sidebar.cta': '開啟側欄',
  'home.quick-links.navigation-sidebar': '導覽側欄',
  'notice.error.open-navigation-sidebar': '無法開啟導覽側欄，請再試一次。',
  'navigation.setting.open': '開啟導覽側欄',
  'navigation.setting.open.desc':
    '立即顯示；如果 Obsidian 側欄已收合，則將其展開。',
  'navigation.setting.open.button': '開啟側欄',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    '啟用 Trade Import、Trade Sync 和經濟日曆。',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',

  

  'premium.gate.cta.continue-pro': '繼續開通 PRO',

  'premium.gate.cta.refresh': 'Refresh status',

  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description': 'Fills widget CSV export',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Open the Fills widget in TT and switch to Detail, Continuous, or Price with Detail view',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Important:',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker-guide.rithmic.step-1':
    '在 R | Trader Pro 開啟委託歷史(Order History),並篩選出您帳戶/日期的已完成(Completed/Filled)委託',
  'csv.broker-guide.rithmic.step-2':
    '使用 Add/Remove Columns 確認 Side、Symbol、Qty Filled、Avg Fill Price 與 Fill/Update Time 欄位皆已顯示',
  'csv.broker-guide.rithmic.warning.emphasis': '重要:',

  

  
  'dashboard.metrics.avgRR': '平均風險回報比（盈虧）',
  'dashboard.metrics.sharpeRatio': '夏普比率',
  'dashboard.metrics.avgRRRiskBased': '平均風險回報比（R 基礎）',
  'dashboard.metrics.longestWinStreak': '最佳連勝',
  'dashboard.metrics.longestLossStreak': '最差連敗',
  'dashboard.sharpeRatio.tooltip.title': '夏普比率',
  'dashboard.sharpeRatio.tooltip.formula':
    '公式：已平倉交易平均淨盈虧 / 已平倉交易淨盈虧的樣本標準差。無風險利率為 0，且該值未年化。',
  'dashboard.sharpeRatio.tooltip.coverage':
    '由 {total} 筆已平倉交易中 {valid} 筆計算',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    '部分覆蓋：{total} 筆已平倉交易中有 {valid} 筆具有限淨盈虧。',
  'dashboard.sharpeRatio.tooltip.no-data':
    '需要至少兩筆已平倉交易，且盈虧波動不可為零。',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    '此夏普比率基於未進行外匯轉換的混合貨幣，可能具有誤導性。',
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
  'metric.sharpeRatio.name': '夏普比率',
  'metric.sharpeRatio.description':
    '按交易計算的夏普比率：已平倉交易平均淨盈虧除以盈虧樣本波動率',
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

  'widget.longDrawdownChart.name': 'Long Drawdown',

  'widget.shortDrawdownChart.name': 'Short Drawdown',

  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',

  'guide.skip-guide': 'Skip Guide',
  'settings.general.data-management': '資料管理 & 隱私',

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

  'templateEditor.widget.weekly-drc-start-collapsed': '預設收合',
  'templateEditor.widget.weekly-drc-day-all': 'All days',

  'templateEditor.widget.previous-context-sections-label':
    'Sections to include',
  'templateEditor.widget.previous-context-heading-label':
    'Previous DRC section heading',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Choose a heading',
  'templateEditor.widget.previous-context-add-section': '+ Add section',

  'templateEditor.widget.previous-context-fallback-label':
    'Previous DRC fallback',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Nearest earlier DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Expected previous trading day only',
  'dashboard.conversion.original-pnl': '原始損益',
  'dashboard.conversion.converted-pnl': '轉換後損益',
  'dashboard.conversion.details-label': '貨幣轉換詳情',

  'widget.stats.vs-prev': 'vs prev',
  'dashboard.metrics.past-30d': 'past 30d',

  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'widget.tag-performance.name': '標籤績效',
  'widget.tag-performance.description': '按交易標籤細分績效',
  'widget.table.header.tag': '標籤',
  'widget.empty.no-tag-data': '此期間沒有可用的標籤資料',
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
    '登入或建立免費的 Journalit 帳戶，即可在 Trade Import 中預覽檔案。只有匯入交易時才需要 Pro。',
  'quick-import.gate.sign-in-cta': '登入並免費預覽',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
  'quick-import.gate.preview-free': '免費預覽檔案',
  'quick-import.message.needs-setup':
    'Choose a favorite broker or template in Trade Import before using Quick Import.',
  'quick-import.message.capabilities-failed':
    'Quick Import setup could not be loaded.',
  'quick-import.message.mapping-required':
    'This file needs column mapping. Open the full Trade Import flow to review mappings.',
  'quick-import.message.preview-failed':
    'This file needs review in the full Trade Import flow.',

  'quick-import.privacy-note':
    '檔案會上傳到 Journalit 伺服器進行處理，預設不會儲存。',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',

  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
  'quick-import.summary.title': 'Ready to import',

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
  'quick-import.action.import-count.one': '匯入 {count} 筆交易',
  'quick-import.action.import-count.few': '匯入 {count} 筆交易',
  'quick-import.action.import-count.many': '匯入 {count} 筆交易',
  'quick-import.action.import-count.other': '匯入 {count} 筆交易',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.open-failed': 'Unable to open Trade Import',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.notice.free-preview-rate-limited':
    '已達免費預覽限制。請啟用 PRO，或約 {minutes} 分鐘後再試。',
  'trade-import.notice.free-preview-storage-limit-reached':
    '免費預覽最多可儲存 {limit} 筆交易。你已儲存 {storedItems} 筆，此檔案將新增 {requestedItems} 筆。請等待較早的預覽到期或啟用 PRO。',
  'trade-import.preview-error.guidance':
    '請檢查所有必填欄位是否已對應，所選日期格式是否符合檔案，且數字欄位是否包含有效的交易數值。',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': '交易',
  'trade-import.gate.brand-right': '匯入',
  'trade-import.gate.sign-in.title': '免費預覽你的交易歷史',
  'trade-import.gate.sign-in':
    '登入或建立免費的 Journalit 帳戶即可分析檔案。只有匯入交易時才需要 Pro。',
  'trade-import.gate.sign-in.reassurance':
    '你的檔案會以私密方式處理，預設不會儲存。',
  'trade-import.gate.sign-in.no-trial': '分析與預覽不需要啟用 Pro 試用。',
  'trade-import.gate.sign-in.cta': '登入並免費預覽',

  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': '匯出來源 / 平台',
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

  'trade-import.label.save-template': 'Save mapping template',
  'trade-import.placeholder.template-name': 'Template name',
  'trade-import.action.save-template': 'Save template',
  'trade-import.action.preview': 'Generate preview',

  'trade-import.preview.found.one': '找到 {count} 筆交易',
  'trade-import.preview.found.few': '找到 {count} 筆交易',
  'trade-import.preview.found.many': '找到 {count} 筆交易',
  'trade-import.preview.found.other': '找到 {count} 筆交易',
  'trade-import.preview.date-range': '{start} 至 {end}',
  'trade-import.preview.metric.symbols': '商品',
  'trade-import.preview.metric.ready': '可匯入',
  'trade-import.preview.metric.duplicates': '可能重複',
  'trade-import.preview.metric.attention': '需要處理',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Entry time',
  'trade-import.table.quantity': 'Quantity',
  'trade-import.table.message': 'Message',
  'trade-import.action.confirm': 'Confirm import',
  'trade-import.action.activate-pro.one': '啟用 PRO 以匯入 {count} 筆交易',
  'trade-import.action.activate-pro.few': '啟用 PRO 以匯入 {count} 筆交易',
  'trade-import.action.activate-pro.many': '啟用 PRO 以匯入 {count} 筆交易',
  'trade-import.action.activate-pro.other': '啟用 PRO 以匯入 {count} 筆交易',
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',

  
  'command.open-setups': '開啟設定形態',
  'setups.create.title': 'Create Setup',
  'setups.create.field.name': 'Setup Name',
  'setups.create.placeholder.name': 'Opening Drive',
  'setups.create.field.status': 'Status',
  'setups.create.field.direction': 'Direction',
  'setups.create.field.color': '色彩',
  'setups.create.field.color-description': '選擇顏色以識別此設定形態。',
  'setups.create.profile.heading': '偏好欄位',
  'setups.create.profile.optional-label': '（選填）',
  'setups.create.field.sessions': '交易時段',
  'setups.create.field.preferred-sessions-tooltip':
    '在設定 → 日誌 → 會話模式中管理這些交易時段。',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': '時間週期',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': '交易代號',
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
  'setups.create.error.failed': 'Failed to create setup',
  'setups.edit.title': 'Edit Setup',
  'setups.edit.button.saving': 'Saving...',
  'setups.edit.button.save': 'Save Setup',
  'setups.edit.button.rename-and-update': 'Rename and update trades',
  'setups.edit.rename-warning.title': 'Rename setup and update trades',
  'setups.edit.rename-warning.message':
    'Renaming {oldName} to {newName} will update trade notes that use the old setup name.',
  'setups.edit.delete.button': '刪除設定',
  'setups.edit.delete.title': '刪除設定',
  'setups.edit.delete.confirm': '確認刪除',
  'setups.edit.delete.warning':
    '刪除「{name}」會永久移除該設定，並從相關交易中清除。此操作無法復原。',
  'setups.edit.delete.success': '已刪除設定「{name}」',
  'setups.edit.delete.error': '設定刪除失敗',
  'setups.edit.success': 'Setup "{name}" updated successfully',
  'setups.edit.error.failed': 'Failed to update setup',
  'setups.view.compare.empty-submessage':
    'Choose two setup cards from the overview to build a side-by-side report.',
  'setups.view.compare.reason.higher.total-r': '較高的總 R',
  'setups.view.compare.reason.lower.total-r': '較低的總 R',
  'setups.view.compare.reason.similar.total-r': '相近的總 R',

  'setups.guide.create-new-setup.title': '建立新設定',
  'setups.guide.create-new-setup.description':
    '想新增另一個劇本時使用「新建設定」。彈窗會引導你填寫詳情、關聯筆記和規則。',
  'setups.guide.detail-intro.title': '這是設定頁面',
  'setups.guide.detail-intro.description':
    '設定頁面聚焦一個劇本，集中展示表現圖、上下文、參考資料、操作和執行規則。',
  'setups.guide.detail-actions.title': '設定操作',
  'setups.guide.detail-actions.description':
    '使用這些按鈕開啟相關交易，或編輯設定詳情、關聯筆記、截圖和劇本規則。',
  'setups.guide.empty.create-setup.title': '从“新建设置”开始',
  'setups.guide.empty.create-setup.description':
    '先创建一个设置。创建后，本指南会继续正常的设置流程。',

  'setups.guide.intro.title': '歡迎使用 Setups',
  'setups.guide.intro.description':
    '此檢視把設定劇本、關聯交易、筆記、截圖和規則集中在一個地方。',
  'setups.guide.view-tabs.title': '切换设置视图',
  'setups.guide.view-tabs.description':
    '当有足够设置时，用这些标签在概览、设置组合和比较流程之间切换。',
  'setups.guide.overview-chart.title': '表现排名',
  'setups.guide.overview-chart.description':
    '概覽圖按所選指標排列設定。使用右上角控制項可切換指標，或讓圖表聚焦到特定設定。',
  'setups.guide.tag-filter.title': '篩選策略',
  'setups.guide.tag-filter.description':
    '依策略標籤或方向篩選卡片、圖表、配對和比較選項。同一組內使用「或」邏輯，標籤與方向之間使用「且」邏輯。',
  'setups.guide.setup-cards.title': '设置卡片',
  'setups.guide.setup-cards.description':
    '卡片用关键指标、状态、最近交易日期和小型表现趋势总结每个设置。',
  'setups.guide.open-detail.title': '開啟設定頁面',
  'setups.guide.open-detail.description':
    '開啟一張設定卡片，查看包含圖表、上下文、劇本資料和執行規則的專屬頁面。',
  'setups.guide.detail-performance.title': '详情表现',
  'setups.guide.detail-performance.description':
    'Performance 標籤顯示該設定隨時間的圖表和關鍵指標，包括 P&L、勝率、期望值和回撤。',
  'setups.guide.detail-context.title': '设置上下文',
  'setups.guide.detail-context.description':
    '此面板集中显示设置健康度、需关注项、关联笔记和截图。',
  'setups.guide.detail-playbook.title': '剧本笔记',
  'setups.guide.detail-playbook.description':
    '劇本區域預覽此設定的關聯筆記。它可以是 Markdown、圖片、Excalidraw 或任何參考資料。',
  'setups.guide.detail-rules.title': '执行规则',
  'setups.guide.detail-rules.description':
    '规则保存最佳条件、入场、风险和需避免错误的结构化清单。',
  'setups.guide.finish.title': 'Setups 指南已完成',
  'setups.guide.finish.description':
    '你已查看主要頁面：概覽、組合、比較和單個設定詳情頁。',

  'setups.guide.pairs-mode.title': '打开设置组合',
  'setups.guide.pairs-mode.description':
    '打开组合，查看哪些设置组合有足够的共同交易可供比较。',
  'setups.guide.pairs-chart.title': '组合排名',
  'setups.guide.pairs-chart.description':
    '組合模式會突出可能一起表現更好或更差的設定組合。點擊柱條可開啟該組合的更深入洞察。',

  'setups.guide.compare-mode.title': '开始比较模式',
  'setups.guide.compare-mode.description':
    '比较模式可选择两张设置卡片进行并排复盘。',
  'setups.guide.compare-select.title': '选择两个设置',
  'setups.guide.compare-select.description': '选择两张设置卡片以打开比较页面。',
  'setups.guide.compare-summary.title': '這是比較頁面',
  'setups.guide.compare-summary.description':
    '此頁面並排比較兩個設定。頂部摘要列顯示勝出者、期望值優勢、信心，以及某個設定可能更有優勢的原因。',
  'setups.guide.compare-body.title': '比較摘要列',
  'setups.guide.compare-body.description':
    '頂部列總結比較結果：勝出者、期望值優勢、信心，以及優勢背後的原因。',
  'setups.guide.compare-details.title': '比較詳情',
  'setups.guide.compare-details.description':
    '使用指標表和累計圖了解兩個設定的差異。',
  'setups.guide.detail-execution-gap.title': '執行差距分析',
  'setups.guide.detail-execution-gap.description':
    '當有錯過交易或回測資料時，此標籤會將已捕捉的執行與錯過或基準機會進行比較。',
  'setups.guide.back-to-overview.title': '返回设置卡片',
  'setups.guide.back-to-overview.description': '比较完成后返回设置卡片。',

  'setups.view.open-as-markdown': 'Open as Markdown',
  'setups.view.open-as-setup': 'Open as Journalit Setup',

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

  'setups.view.overview.pnl-chart.dropdown-label': 'Cumulative P&L',

  'setups.view.overview.pnl-chart.combined': 'All setups',
  'setups.view.overview.pnl-chart.selected-combined': 'Selected setups',

  'setups.view.overview.pnl-chart.hidden':
    'Setup P&L over time is hidden while privacy mode is enabled.',
  'setups.view.overview.pnl-chart.trade': 'Trade',
  'setups.view.overview.pnl-chart.start': 'Start',
  'setups.view.ranking.empty-submessage':
    'Log trades with setups to start ranking performance.',
  'setups.view.empty.no-setups-submessage':
    'Setups collect your playbook notes, rules, trades, and performance in one place.',
  'setups.view.detail.performance.drawdown': '回撤',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',
  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Edit linked notes',

  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': '實盤 R',
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
  'setups.view.detail.brief.linked-notes': '{count}',
  'setups.view.detail.brief.linked-notes-modal.subtitle': '{name}',
  'setups.view.detail.brief.screenshots': '{count}',
  'setups.view.detail.brief.no-screenshots': '尚未連結截圖。',
  'setups.view.detail.brief.screenshot-alt': '{index}',
  'setups.view.detail.brief.screenshot-open': '{index}',
  'setups.view.detail.brief.count.rules': '{count}',
  'setups.view.detail.brief.count.notes': '{count}',
  'setups.view.detail.brief.count.images': '{count}',
  'setups.view.detail.brief.count.trades': '{count}',
  'setups.view.detail.brief.more': '{count}',
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
  'setups.view.card.open-named': '{name}',
  'setups.view.card.status.active': 'Stable',
  'setups.view.card.status.monitor': 'Monitor',
  'setups.view.card.status.review': 'Review',
  'setups.view.date.days-ago': '{count}',

  'trade-import.restore.complete':
    'Restored {written} imported trades; {failed} failed.',
  'trade-import.restore.broker-label': 'Backend restore',
  'setups.view.loading': 'Loading setups…',
  'settings.general.copy-trading-pnl-toggled': 'Copy trading PnL is {status}',
  'setups.view.trade.unknown-instrument': 'Unknown instrument',
  'settings.session-mode.linked-resources-count': '{count} linked',
  'settings.session-mode.linked-resources-hide': 'Hide linked',
  'settings.session-mode.session-log-tags': 'Session log tags',
  'settings.session-mode.session-log-tags-desc':
    'Customize the tags available in the Session Mode composer and DRC session log.',
  'settings.session-mode.tag-label-placeholder': 'Tag name',
  'settings.session-mode.tag-short-label-placeholder': 'Short label',
  'settings.session-mode.tag-label-example': 'Trade',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Tag color',
  'settings.session-mode.tag-requires-resolution': 'Requires resolution',
  'settings.session-mode.tag-lesson': 'Lesson tag',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Entries with this tag are marked as follow-up items until you resolve them in the session log. Use it for notes that need review or action after the session.',
  'settings.session-mode.tag-lesson-tooltip':
    'Marks this tag as a learning entry. Lesson-tagged notes can be surfaced as lessons and are highlighted as learning moments in session log workflows.',
  'settings.session-mode.add-session-log-tag': 'Add session log tag',
  'settings.session-mode.reset-session-log-tags': 'Reset session log tags',
  'settings.session-mode.tag-color.blue': 'Blue',
  'settings.session-mode.tag-color.indigo': 'Indigo',
  'settings.session-mode.tag-color.purple': 'Purple',
  'settings.session-mode.tag-color.green': 'Green',
  'settings.session-mode.tag-color.pink': 'Pink',
  'settings.session-mode.tag-color.amber': 'Amber',
  'settings.session-mode.tag-color.red': 'Red',
  'settings.session-mode.tag-color.orange': 'Orange',
  'session-log.action.add-note': 'Add',
  'session-log.action.hide-composer': 'Hide composer',
  'session-log.filter.label': 'Filter session log',
  'session-log.filter.clear': 'Clear filter',
  'session-log.empty-filtered': 'No entries match this filter.',
  'media.viewer.mute-video': '將影片靜音',
  'media.viewer.unmute-video': '取消影片靜音',
  'media.viewer.volume': '音量',

  'imageGallery.empty.error.title': '圖庫無法使用',
  'imageGallery.empty.no-images.title': '尚無媒體',
  'imageGallery.empty.no-images.description':
    '附加到交易或複盤筆記的圖片、GIF、影片和 YouTube 連結會自動顯示在這裡。',
  'imageGallery.empty.no-results.title': '沒有媒體符合這些篩選條件',
  'imageGallery.empty.no-results.description':
    '請清除目前的篩選或擴大日期範圍，以顯示更多圖庫項目。',
  'imageGallery.empty.no-source.title': '此來源沒有媒體',
  'imageGallery.empty.no-source.description':
    '此來源目前還沒有圖庫項目。切換回所有媒體或選擇其他來源。',
  'imageGallery.empty.action.clear-filters': '清除篩選',
  'imageGallery.empty.action.show-all': '顯示所有媒體',
  'imageGallery.open-source': '開啟筆記',
  'imageGallery.image-alt': '{date} 的 {source} 媒體',
  'imageGallery.annotation.reviewed': '已檢視',
  'imageGallery.annotation.unreviewed': '未檢視',
  'imageGallery.annotation.tag': '標籤',

  'imageGallery.annotation.editor-title': '標註媒體',
  'imageGallery.annotation.editor-title-with-file': '標註 {fileName}',
  'imageGallery.annotation.tags': '標籤',
  'imageGallery.annotation.tags-placeholder': '突破、A+ 設定、錯誤',
  'imageGallery.annotation.notes': '備註',
  'imageGallery.annotation.notes-placeholder': '未來的你應該從這張圖學到什麼？',
  'imageGallery.annotation.error.save-failed': '無法儲存媒體註解。',
  'imageGallery.annotation.error.load-failed': '無法載入媒體註解。',
  'imageGallery.annotation.saving': '儲存中...',
  'command.replay-current-view-guide': '重播目前視圖指南',
  'tradelog.guide.switch-to-gallery.title': '從交易切換到圖庫',
  'tradelog.guide.switch-to-gallery.description':
    '使用這個模式選擇器在一般交易日誌和圖庫之間切換。點擊圖庫，繼續透過圖片、GIF、影片和 YouTube 連結了解導覽。',

  'tradelog.guide.gallery-source-sort.title': '選擇媒體來源和順序',
  'tradelog.guide.gallery-source-sort.description':
    '使用來源聚焦所有媒體、交易附件或複盤筆記媒體。使用排序優先查看最新、最舊、最好或最差的交易。',
  'tradelog.guide.gallery-size.title': '調整圖庫預覽大小',
  'tradelog.guide.gallery-size.description':
    '使用這些尺寸按鈕在緊湊瀏覽和較大的圖表預覽之間切換，同時不裁切重要圖表細節。',
  'tradelog.guide.gallery-filters.title': '用同一個入口篩選圖庫',
  'tradelog.guide.gallery-filters.description':
    '篩選按鈕仍會開啟進階篩選。在圖庫模式下，它也包含媒體專用篩選，例如註解狀態和媒體標籤。',
  'tradelog.guide.gallery-filter-modal.title': '媒體篩選與交易篩選放在一起',
  'tradelog.guide.gallery-filter-modal.description':
    '使用此視窗組合交易篩選和媒體篩選。例如，先篩選某個 setup，再只顯示有筆記或特定媒體標籤的媒體。',
  'tradelog.guide.gallery-grid.title': '開啟媒體進行細看',
  'tradelog.guide.gallery-grid.description':
    '每張卡片都會盡量保持內容不被遮擋，同時顯示精簡的交易和複盤脈絡。點擊任意卡片即可全螢幕開啟。',
  'tradelog.guide.gallery-fullscreen-actions.title': '在全螢幕中註解媒體',
  'tradelog.guide.gallery-fullscreen-actions.description':
    '項目放大後，使用標籤為媒體加入媒體層級標籤和筆記。開啟筆記會帶你回到來源交易或複盤筆記。',
  'tradelog.guide.gallery-open-annotation.title': '開啟註解面板',
  'tradelog.guide.gallery-open-annotation.description':
    '點擊標籤來註解這個特定媒體。媒體標籤和筆記描述的是附件，而不是整筆交易。',
  'tradelog.guide.gallery-annotation-panel.title': '新增媒體標籤和筆記',
  'tradelog.guide.gallery-annotation-panel.description':
    '使用媒體標籤記錄圖表特定想法，例如流動性掃蕩或假突破，並用筆記保存你想記住的市場結構脈絡。',
  'tradelog.guide.gallery-finish.title': '你已了解交易日誌的兩種模式',
  'tradelog.guide.gallery-finish.description':
    '需要表格和批次工具時使用交易模式。想跨整個日誌複盤圖片、GIF、影片、YouTube 連結、市場結構和圖表註解時使用圖庫。',
  'account.prop-challenge.prefill.heading-link': 'Prefill from your firm',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} more, rules prefilled with PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, rules prefilled with PRO',
  'account.prop-challenge.prefill.match':
    'We have {firm}: {count} challenges with rules ready',
  'account.prop-challenge.rules.empty':
    '尚未新增規則。使用「新增規則」來設定此階段。',
  'trade.validation.fx-rate-number': '匯率必須是有效數字。',
  'trade.validation.fx-rate-positive': '匯率必須大於零。',
  'dashboard.conversion.using-manual-rate':
    '對 {count} 筆{tradeLabel}使用手動匯率',
  'dashboard.conversion.partial-warning':
    '⚠ {currencies}的成本/風險無法換算，已被排除',
  'trade-sync.providers.title': '交易同步',

  'trade-sync.tradovate.pending-acks': '{count} 個本機 ACK 待處理',

  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    '在雲端同步 Rithmic 交易，並投射到此保管庫。',
  'trade-sync.rithmic.plugin-sync-description':
    '先在 Journalit.co 連接 Rithmic，然後在此同步，將最新的 Rithmic 活動寫入此保管庫。',
  'trade-sync.rithmic.status-failed': '無法載入 Rithmic 狀態。',
  'trade-sync.rithmic.status.connecting': '連線中',
  'trade-sync.rithmic.status.paused': '已暫停',
  'trade-sync.rithmic.status.waiting-for-accounts': '正在等待帳戶',
  'trade-sync.rithmic.status.reauthorization-required':
    '需要在 Journalit.co 重新授權',
  'trade-sync.rithmic.status.error': '連線錯誤',
  'trade-sync.rithmic.no-connections':
    '請在 Journalit.co 連接 Rithmic 帳戶，然後在此同步。',
  'trade-sync.rithmic.connect': '連接',
  'trade-sync.rithmic.manage': '在 Journalit.co 管理',
  'trade-sync.rithmic.system': 'Rithmic 系統',
  'trade-sync.rithmic.accounts': '帳戶',
  'trade-sync.rithmic.last-sync': '上次同步',
  'trade-sync.rithmic.never': '從未',
  'trade-sync.rithmic.job.running': '正在同步…',
  'trade-sync.rithmic.job.last': '最近工作：{status}',
  'trade-sync.job.status.queued': '排隊中',
  'trade-sync.job.status.running': '執行中',
  'trade-sync.job.status.succeeded': '成功',
  'trade-sync.job.status.partial': '部分完成',
  'trade-sync.job.status.failed': '失敗',
  'trade-sync.job.status.cancelled': '已取消',
  'trade-sync.job.status.unknown': '未知',
  'trade-sync.rithmic.sync-to-vault': '同步',
  'trade-sync.rithmic.syncing': '同步中…',
  'trade-sync.rithmic.mapping-required':
    '請為每個同步的 Rithmic 帳戶選擇一個本機保管庫帳戶。',
  'trade-sync.rithmic.sync-complete-connection': '{connection} 同步完成。',
  'trade-sync.rithmic.sync-partial-connection':
    '{connection} 同步完成，但有問題。',
  'trade-sync.rithmic.sync-all': '全部同步',
  'trade-sync.rithmic.sync-all-complete':
    '已同步 {succeeded}/{total} 個 Rithmic 連線。',
  'trade-sync.rithmic.sync-all-partial':
    '已同步 {succeeded}/{total} 個 Rithmic 連線。請檢查有問題的連線。',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic 僅允許一個作用中的工作階段。請關閉使用此 Rithmic 登入的 R|Trader、NinjaTrader 或其他平台。',
  'trade-sync.rithmic.error.auto-retry': 'Journalit 會自動重試。',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic 拒絕了已儲存的憑證。請在 Journalit.co 更新後再試一次。',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic 要求先在 R|Trader 簽署行情資料協議。簽署後請再試一次。',
  'trade-sync.rithmic.error.disabled':
    '此連線的 Rithmic 同步已停用。請在 Journalit.co 管理。',
  'trade-sync.rithmic.error.sync-failed':
    'Rithmic 同步失敗。請在 Journalit.co 檢查連線後再試一次。',
  'trade-sync.broker.mapping-unsaved-hint': '對應會在同步時儲存。',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    '帳戶變更尚未儲存。同步該連接即可儲存。',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    '請先為每個要同步的帳戶選擇一個 Journalit 帳戶。',
  'trade-sync.broker.sync-all-blocked.running-job': '已有同步正在進行。',
  'trade-sync.broker.sync-all-blocked.not-ready': '沒有連接可以同步。',
  'trade-sync.rithmic.connect-another': '連接另一個 Rithmic 帳戶',
  'trade-sync.rithmic.error.sync-failed-detail': 'Rithmic 同步失敗：{message}',
  'notice.error.canonical-trade-type-change':
    '經紀商同步的交易不能變更為其他交易類型。',
  'trade-sync.import.account.conflict-repair':
    '發現重複的 canonicalTradeId 筆記。請保留一份，並從重複筆記移除 canonicalTradeId 或刪除該筆記。重新命名檔案無法修復衝突。',
  'setups.create.field.tags': '標籤',
  'setups.create.placeholder.tags': '動能、突破、早盤',
  'setups.view.overview.tag-filter.aria': '篩選策略',
  'setups.view.overview.tag-filter.reset': '重設',
  'setups.view.overview.tag-filter.untagged': '無標籤',
  'setups.view.overview.tag-filter.empty': '沒有符合這些篩選條件的策略',
  'setups.view.overview.tag-filter.empty-submessage':
    '調整或清除篩選條件以顯示更多策略。',

  'setups.view.tags': '標籤',
  'setups.create.error.tag-save-failed': '無法將標籤儲存到全域標籤清單。',
  'settings.customization.options.confirm.remove-tag-message':
    '刪除全域標籤「{option}」？這會從所有 Journalit 交易與策略筆記中移除該標籤。',
  'settings.customization.options.confirm.reset-tag-message':
    '將全域標籤清單與顏色重設為預設值？已指派給交易與策略筆記的標籤會保留在這些筆記中。',
  'home.mode.overview': '總覽',
  'home.mode.dashboard': '儀表板',
  'home.mode.aria': '切換首頁模式',
  'home.filters.period': '期間',
  'home.filters.trade-type': '交易類型',
  'home.filters.accounts': '帳戶',
  'home.filters.back': '返回',
  'filter.reset': '重設篩選器',
  'home.guide.modes.title': '最後一件事：儀表板',
  'home.guide.modes.description':
    '總覽與儀表板共用此頁面。現在切換到儀表板，繼續進行績效統計的簡短導覽。',
  'home.guide.whats-new.mode.title': '一個首頁，兩種模式',
  'home.guide.whats-new.mode.description':
    '總覽與儀表板現在位於同一頁面。切換時會保留各自的版面與捲動位置。',
  'home.guide.whats-new.filters.title': '首頁篩選集中在一處',
  'home.guide.whats-new.filters.description':
    '開啟篩選按鈕，即可在精簡的分層選單中選擇期間、交易類型或帳戶。',
  'home.guide.whats-new.done.title': '保留工作區脈絡',
  'home.guide.whats-new.done.description':
    '使用總覽查看個人小工具，使用儀表板進行深入分析。每種模式都會保留自己的篩選與版面。',
  'home.widget.current-streak.description': '追蹤交易與複盤連勝',

  'home.widget.streak.kind.trade-outcome': '交易結果',
  'home.widget.streak.kind.trade-review': '交易複盤',
  'home.widget.streak.kind.drc-review': 'DRC 複盤',
  'home.widget.streak.kind.weekly-review': '週複盤',
  'home.widget.streak.kind.monthly-review': '月複盤',
  'home.widget.streak.configure': '選擇連勝類型',
  'home.widget.streak.configure-aria': '設定 {kind} 連勝',
  'home.widget.streak.no-review-streak': '目前沒有活躍的複盤連勝',
  'home.widget.streak.start-reviewing': '開始複盤以建立連勝',
  'home.widget.streak.keep-reviewing': '繼續複盤以維持連勝',
  'home.widget.streak.reviewed-trades-in-a-row.one': '連續複盤交易',
  'home.widget.streak.reviewed-trades-in-a-row.few': '連續複盤交易',
  'home.widget.streak.reviewed-trades-in-a-row.many': '連續複盤交易',
  'home.widget.streak.reviewed-trades-in-a-row.other': '連續複盤交易',
  'home.widget.streak.reviewed-days-in-a-row.one': '連續複盤天數',
  'home.widget.streak.reviewed-days-in-a-row.few': '連續複盤天數',
  'home.widget.streak.reviewed-days-in-a-row.many': '連續複盤天數',
  'home.widget.streak.reviewed-days-in-a-row.other': '連續複盤天數',
  'home.widget.streak.reviewed-weeks-in-a-row.one': '連續複盤週數',
  'home.widget.streak.reviewed-weeks-in-a-row.few': '連續複盤週數',
  'home.widget.streak.reviewed-weeks-in-a-row.many': '連續複盤週數',
  'home.widget.streak.reviewed-weeks-in-a-row.other': '連續複盤週數',
  'home.widget.streak.reviewed-months-in-a-row.one': '連續複盤月數',
  'home.widget.streak.reviewed-months-in-a-row.few': '連續複盤月數',
  'home.widget.streak.reviewed-months-in-a-row.many': '連續複盤月數',
  'home.widget.streak.reviewed-months-in-a-row.other': '連續複盤月數',
  'home.widget.streak.missed-trades.one': '自上次複盤以來漏了 {count} 筆交易',
  'home.widget.streak.missed-trades.few': '自上次複盤以來漏了 {count} 筆交易',
  'home.widget.streak.missed-trades.many': '自上次複盤以來漏了 {count} 筆交易',
  'home.widget.streak.missed-trades.other': '自上次複盤以來漏了 {count} 筆交易',
  'home.widget.streak.missed-days.one': '自上次複盤以來漏了 {count} 天',
  'home.widget.streak.missed-days.few': '自上次複盤以來漏了 {count} 天',
  'home.widget.streak.missed-days.many': '自上次複盤以來漏了 {count} 天',
  'home.widget.streak.missed-days.other': '自上次複盤以來漏了 {count} 天',
  'home.widget.streak.missed-weeks.one': '自上次複盤以來漏了 {count} 週',
  'home.widget.streak.missed-weeks.few': '自上次複盤以來漏了 {count} 週',
  'home.widget.streak.missed-weeks.many': '自上次複盤以來漏了 {count} 週',
  'home.widget.streak.missed-weeks.other': '自上次複盤以來漏了 {count} 週',
  'home.widget.streak.missed-months.one': '自上次複盤以來漏了 {count} 個月',
  'home.widget.streak.missed-months.few': '自上次複盤以來漏了 {count} 個月',
  'home.widget.streak.missed-months.many': '自上次複盤以來漏了 {count} 個月',
  'home.widget.streak.missed-months.other': '自上次複盤以來漏了 {count} 個月',
  'account-dashboard.title': '帳戶',
  'home.quick-links.trading-dashboard': '儀表板',
  'home.quick-links.account-dashboard': '帳戶',
  'navigation.items.nav-dashboard': '儀表板',
  'navigation.items.nav-account-dashboard': '帳戶',

  'settings.general.home-background-dashboard': '在 Dashboard 中也顯示背景',
  'settings.general.home-background-dashboard-desc':
    '在 Dashboard 模式中使用相同的背景圖片。',
  'settings.general.home-background-dashboard-aria':
    '在 Dashboard 中顯示首頁背景',
  'datepicker.placeholder.second': 'SS',
  'settings.general.show-seconds': '在交易時間中顯示秒',
  'settings.general.show-seconds-desc': '輸入交易進場和出場時間時顯示秒。',
  'settings.general.show-seconds-aria': '在交易時間中顯示秒',
  'account.prop-challenge.summary.status.payout_ready': 'Payout ready',
  'account.prop-challenge.ribbon.passed': '{phase}已通過',
  'account.prop-challenge.ribbon.failed': '{phase}未通過',
  'account.prop-challenge.ribbon.action.advance': '進入{phase}',
  'account.prop-challenge.ribbon.action.advance-short': '進入',
  'account.prop-challenge.ribbon.action.mark-passed': '標記為通過',
  'account.prop-challenge.ribbon.action.archive': '封存',
  'account.prop-challenge.actions.stale':
    '此挑戰已在其他地方更新。請檢查後再試一次。',
  'account.prop-challenge.confirm.reopen':
    '重新開啟 {account}？挑戰「{challenge}」將回到{phase}。',
  'account.prop-challenge.confirm.fail':
    '將 {account} 標記為失敗？挑戰「{challenge}」將在{phase}結束。',
  'account.prop-challenge.confirm.archive-failed':
    '封存 {account}？挑戰「{challenge}」已失敗。帳戶將移至已封存。',
  'account.prop-challenge.confirm.archive-passed':
    '封存 {account}？挑戰「{challenge}」已通過。帳戶將移至已封存。',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → 挑戰通過',
  'account.prop-challenge.ribbon.action.record-payout': '記錄出金',
  'account.prop-challenge.ribbon.action.record-payout-short': '出金',
  'account.prop-challenge.payout.title': 'Payout readiness',
  'account.prop-challenge.payout.eligible': 'Payout ready',
  'account.prop-challenge.payout.available': 'Available now',
  'account.prop-challenge.payout.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.history': 'Payouts',
  'account.prop-challenge.payout.requirement.days': 'Trading days',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'Qualifying days',
  'account.prop-challenge.payout.requirement.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.requirement.consistency': 'Consistency',
  'account.prop-challenge.payout.requirement.minimum': 'Minimum available',
  'account.prop-challenge.payout.requirement.payouts': 'Payout allowance',
  'account.prop-challenge.payout.requirement.request-window': 'Request window',
  'account.prop-challenge.payout.timezone-invalid': '不是已知時區。',
  'account.prop-challenge.payout.preview-amount': 'Preview payout amount',
  'account.prop-challenge.payout.you-receive': 'Estimated trader share',
  'account.prop-challenge.payout.balance-after': 'Balance after payout',
  'account.prop-challenge.payout.drawdown-floor': 'Drawdown floor after',
  'account.prop-challenge.payout.buffer-after': 'Room before breach',
  'account.prop-challenge.payout.request-not-allowed':
    'This amount is not currently eligible under the configured payout rules.',
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
  'account-page.guide.whats-new.cockpit.payout.title':
    'Know when a funded payout is safe',
  'account-page.guide.whats-new.cockpit.payout.description':
    'Funded accounts with verified rules now show payout requirements, the amount available, and a preview of the balance and drawdown consequences before you request money.',
  'account-page.guide.main.payout.title': 'Plan funded payouts',
  'account-page.guide.main.payout.description':
    'When the funded phase has verified payout rules, this panel tracks eligibility and previews the account impact of a requested amount.',
  'account-page.guide.main.trade-log.description':
    '開啟交易日誌並已選取此帳戶。在多階段挑戰中，按鈕會跟隨你正在檢視的階段；箭頭可選擇其他階段或整個帳戶。',
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
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Minimum cycle profit',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Maximum best-day share (%)',
  'account.prop-challenge.payout-rules.availability': 'Available profit',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Above starting balance',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Above balance floor',
  'account.prop-challenge.payout-rules.balance-floor': 'Balance floor',
  'account.prop-challenge.payout-rules.request-percent':
    'Withdrawable share (%)',
  'account.prop-challenge.payout-rules.minimum-request': 'Minimum request',
  'account.prop-challenge.payout-rules.maximum': 'Maximum request',
  'account.prop-challenge.payout-rules.maximum.none': 'No maximum',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Fixed maximum',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Maximum by payout number',
  'account.prop-challenge.payout-rules.maximum-amount': 'Maximum amount',
  'account.prop-challenge.payout-rules.schedule': 'Amounts by payout number',
  'account.prop-challenge.payout-rules.profit-split': 'Trader profit share (%)',
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

  'account.prop-challenge.ledger.help.open': '關於{rule}',
  'account.prop-challenge.ledger.help.profit_target':
    '把帳戶增加這個金額以通過該階段。只計算已平倉交易。',
  'account.prop-challenge.ledger.help.profit_target.example':
    '此帳戶需要 {target} 利潤：目前 {current}，還差 {remaining}。',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    '已達目標：{current} / {target}。',
  'account.prop-challenge.ledger.help.drawdown.static':
    '餘額相對起始餘額最多可下跌的幅度。下限不會移動。',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    '此帳戶下限為 {floor}；餘額必須保持在其上方。限額 {limit} 還剩 {buffer}。',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    '下限跟隨你最高的日終餘額，只會上升，直到鎖定在公司的鎖定水平。',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    '目前下限為 {floor}（最高收盤減去 {limit}），並隨更高收盤上移。還剩 {buffer}。',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    '底線隨時跟隨你的最高餘額，包括未實現盈利。Journalit 只看到已平倉交易，因此此底線跟隨每次平倉後的最佳餘額；持倉期間達到的峰值不會計入。請以公司的數據為準。',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    '目前下限為 {floor}（平倉後最佳餘額減去 {limit}）。還剩 {buffer}；公司即時數字可能更緊。',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    '單個交易日最多可虧損的金額。觸及後會判定階段失敗，或暫停至下一交易時段，視公司而定。',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    '今日：日虧損限額 {limit} 已用 {used}，還剩 {left}。',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    '每日利潤只有一部分計入目標。超過上限的利潤會保留，但不計入。',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    '一天利潤只計入 {cap}；超過上限已賺的 {excluded} 不計入。',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    '任意一個交易日達到或超過該利潤，帳戶即有資格接受實盤審核。',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    '有一天達到 {trigger} 或以上即合格；目前最佳日 {bestDay}。',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    '至少有一筆已平倉交易的天數。無論多快達到目標，未滿該天數都不能通過階段。',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '已完成 {current} / {target} 個交易日，還差 {remaining}。',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    '收盤利潤達到或超過公司最低日利潤的交易日。打平或更小的盈利不計。',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '已有 {current} / {target} 天收盤達到 {minimum} 或以上，還差 {remaining}。',
  'account.prop-challenge.ledger.help.consistency':
    '單日最佳利潤不得超過階段總利潤的該比例。應靠其他日子多賺來修復，而不是靠虧損。',
  'account.prop-challenge.ledger.help.consistency.example':
    '最佳日 {bestDay} 占總利潤 {total} 的 {share}；總利潤需達到 {goal} 才能落在 {maximum}。',
  'account.prop-challenge.ledger.help.consistency.example-done':
    '最佳日 {bestDay} 占總利潤的 {share}，在 {maximum} 限額內。',
  'account.prop-challenge.ledger.help.consistency.example-none':
    '尚無利潤，因此沒有可比較的最佳日。',
  'account.prop-challenge.ledger.help.max_position_size':
    '所有未平倉持倉合計最多可持有的合約數。有些公司隨利潤增加會提高限額。',
  'account.prop-challenge.ledger.help.max_position_size.example':
    '目前最多同時 {maximum} 口；迄今最大倉位 {current}。',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    '當前出金週期內的交易日。批准出金後重新計數。',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '本週期交易日 {current} / {target}，還差 {remaining}。',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    '本週期內收盤利潤達到或超過公司最低日利潤的交易日。',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '本週期達到 {minimum} 或以上的天數 {current} / {target}，還差 {remaining}。',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    '自週期開始以來的利潤必須達到該金額才能申請。',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '本週期已賺 {current}，需要 {target}。',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    '申請時餘額必須達到或高於該水平。',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    '餘額 {current}；必須至少 {target}。',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    '首次出金之後，每個新週期必須先獲利才能再次申請。',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    '週期利潤為 {current}；必須大於零。',
  'account.prop-challenge.ledger.help.payout.consistency':
    '最佳日不得超過週期利潤的該比例。',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    '最佳單日 {bestDay} 佔週期利潤 {total} 的 {share}；週期利潤需達到 {goal}，該比例才會落在 {maximum}。',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    '最佳單日 {bestDay} 佔週期利潤的 {share}，在 {maximum} 限制以內。',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    '週期尚無利潤，因此沒有可比較的最佳單日。',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    '公司接受的最小出金。可用金額必須先達到該值。',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '可用 {current}；公司最低申請額為 {target}。',
  'account.prop-challenge.ledger.help.payout.payout_count':
    '本階段允許的出金次數。用完額度即完成該階段。',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '本階段已用 {current} / {target} 次出金。',
  'account.prop-challenge.ledger.help.payout.request_window':
    '只在這些工作日、按公司時區接受申請。',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    '今天是 {today}；申請開放日為 {days}（{timeZone}）。',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    '自本週期第一筆交易起的時間必須達到該值才能申請。',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '自週期首筆交易起已過 {current} / {target} 小時。',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    '整個有資階段的合格天數，不只是本週期。達到後解鎖出金。',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '整個階段合格日 {current} / {target}。',
  
  'account.merge.challenge.move-earlier': '將 {account} 前移',
  'account.merge.challenge.move-later': '將 {account} 後移',
  'account.merge.warning.use-profile-balance': '使用檔案餘額',
  'account.merge.warning.edit-phases': '編輯階段',
  'account.merge.title': '挑戰設定',
  'account.merge.loading': '載入中...',
  'account.merge.step.accounts': '帳戶',
  'account.merge.step.phases': '階段',
  'account.merge.step.review': '檢查',
  'account.merge.accounts.title': '要合併的帳戶',
  'account.merge.accounts.show-archived': '顯示已封存',
  'account.merge.accounts.empty': '沒有符合條件的帳戶',
  'account.merge.target.title': '目標帳戶',
  'account.merge.target.keep': '保留',
  'account.merge.target.new': '新名稱',
  'account.merge.phase.name': '階段名稱',
  'account.merge.phase.status': '狀態',
  'account.merge.phase.started': '開始',
  'account.merge.phase.completed': '結束',
  'account.merge.phase.no-rules': '無',
  'account.merge.review.notes': '已遷移交易',
  'account.merge.review.identities': '經紀商帳戶',
  'account.merge.warning.trade-outside-window': '交易不在其階段區間內',
  'account.merge.warning.identity-shared': '識別碼被多個帳戶占用',
  'account.merge.warning.copy-trading-dropped': '已捨棄跟單週期',
  'account.merge.error.too-few-sources': '請至少選擇兩個帳戶。',
  'account.merge.error.duplicate-source': '某個帳戶重複出現。',
  'account.merge.error.target-exists': '該名稱屬於另一個帳戶。',
  'account.merge.error.currency-mismatch': '帳戶使用了不同的貨幣。',
  'account.merge.error.timeline-not-monotonic': '各階段開始時間必須遞增。',
  'account.merge.error.invalid-override': '請檢查該階段的日期。',
  'account.merge.error.source-missing': '某個帳戶沒有已儲存的設定。',
  'account.merge.error.unknown': '合併失敗。',
  'account.merge.action.merge': '合併',
  'account.merge.action.undo': '復原',
  'account.merge.action.delete': '刪除舊帳戶',
  'account.merge.notice.converted': '已轉換為挑戰',
  'account.merge.notice.title': '合併自 {accounts}',
  'account.merge.notice.error': '操作失敗。',
  'account.merge.undo.title': '復原合併',
  'account.merge.undo.message': '還原舊帳戶及其交易。',
  'account.merge.delete.title': '刪除舊帳戶',
  'account.merge.delete.message': '刪除已封存的舊帳戶，此操作無法復原。',
  'command.open-legacy-challenge-onboarding': '設定 Prop 挑戰',
  'account.merge.step.challenge': '挑戰',
  'account.merge.action.convert': '轉換',
  'account.merge.challenge.accounts': '帳戶',
  'account.merge.challenge.order-hint': '最早的階段在前',
  'account.merge.challenge.single-hint': '此帳戶將單獨成為一個挑戰',
  'account.merge.phase.identities-count': '{count} 個識別碼',
  'account.merge.phase.pending': '待定',
  'account.merge.review.phases': '個階段',
  'account.merge.review.archived': '已封存',
  'account.merge.review.open': '進行中',
  'account.merge.sequence': '挑戰 {index} / {total}',
  'account.merge.warning.balance-differs': '起始餘額與公司檔案不一致',
  'account.merge.error.profile-phase-mismatch':
    '帳戶數量多於公司檔案中的階段數',
  'account.merge.error.profile-currency-mismatch': '檔案貨幣與這些帳戶不一致。',
  'account.merge.error.source-changed': '有帳戶已變更。請重新檢查合併。',
  'account.merge.error.multiple-active-phases':
    '只能是最後一個帳戶仍處於進行中。',
  'account.merge.error.copy-trading-overlap':
    '跟單週期重疊。請先結束其中一個。',
  'onboarding.legacy-challenge.legend':
    '將曾是同一挑戰各階段的帳戶歸為一組。單獨的帳戶會成為一個獨立挑戰。',
  'onboarding.legacy-challenge.assign.leave': '保持不變',
  'onboarding.legacy-challenge.assign.own': '獨立挑戰',
  'onboarding.legacy-challenge.assign.group': '挑戰 {letter}',
  'onboarding.legacy-challenge.assign.new-group': '新增挑戰…',
  'onboarding.legacy-challenge.action.continue': '繼續',
  'onboarding.legacy-challenge.action.continue-count': '設定 {count} 個',
  'guide.action-step.dismiss': '暫不',
  'guide.legacy-challenge.title': '你的現有帳戶',
  'guide.legacy-challenge.description':
    '合併曾是同一挑戰各階段的帳戶，或將某個帳戶設為獨立挑戰。',
  'guide.legacy-challenge.action': '設定我的帳戶',
  'account-dashboard.challenges.empty.title': '尚無挑戰',
  'account-dashboard.challenges.empty.message':
    '將自營交易公司的挑戰視為一個包含階段、規則與出金的帳戶來追蹤。',
  'account-dashboard.challenges.empty.create': '新增挑戰',
  'account-dashboard.challenges.empty.setup': '設定現有帳戶',
  'onboarding.legacy-challenge.title': 'Prop 挑戰',
  'onboarding.legacy-challenge.action.skip': '略過',
  'onboarding.legacy-challenge.accounts.show-archived': '顯示已封存',
  'onboarding.legacy-challenge.accounts.empty': '沒有需要設定的帳戶',
  'onboarding.legacy-challenge.loading': '載入中...',
  'onboarding.legacy-challenge.suggested': '建議',
  'onboarding.legacy-challenge.row.aria': '{account} 的操作',
  'onboarding.legacy-challenge.status.combined': '已合併',
  'onboarding.legacy-challenge.status.converted': '已轉換',
  'onboarding.legacy-challenge.entry.name': 'Prop 挑戰',
  'onboarding.legacy-challenge.entry.desc': '將現有帳戶合併或轉換為挑戰。',
  'onboarding.legacy-challenge.entry.action': '設定',

  'view.home': '首頁',
  'common.lose': '虧',

  'dashboard.conversion.requires-conversion': '多貨幣損益圖表需要匯率轉換。',

  'form.layout.guide-trigger-label': '自訂表單',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'session-log.session-group.unplanned': '計畫外 @ {time}',
  'session-mode.unplanned.name': '計畫外交易時段',
  'session-mode.unplanned.start': '開始計畫外交易時段',
  'session-mode.unplanned.stop': '結束時段',
  'session-mode.unplanned.badge': '計畫外',
  'session-mode.unplanned.status.live': '{time} 開始 · 已進行 {elapsed}',
  'session-mode.unplanned.ended.summary':
    '計畫外交易時段 · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': '開始計畫外交易時段',
  'session-mode.unplanned.modal.description':
    '目前不在你計畫的交易時段內。此時段將在每日檢討中標記為計畫外。請寫下你現在交易的原因。',
  'session-mode.unplanned.modal.reason-label': '原因',
  'session-mode.unplanned.modal.reason-placeholder':
    '例如：14:00 FOMC、錯過了上午時段',
  'session-mode.unplanned.modal.reason-required': '開始前請填寫原因。',
  'session-mode.unplanned.notice.started': '計畫外交易時段已開始。',
  'session-mode.unplanned.notice.stopped': '計畫外交易時段已結束。',
  'session-mode.unplanned.notice.blocked-live': '已有一個交易時段正在進行。',
  'session-mode.unplanned.notice.none-running':
    '目前沒有進行中的計畫外交易時段。',
  'session-mode.unplanned.notice.failed':
    '無法更新計畫外交易時段。請查看主控台了解詳情。',
  'calendar.aria.open-daily-review': '開啟 {date} 的每日回顧',
  'calendar.aria.open-weekly-review': '開啟 {date} 的每週回顧',
  'calendar.aria.open-monthly-review': '開啟 {date} 的月度回顧',
  'calendar.aria.open-quarterly-review': '開啟 {date} 的季度回顧',
};

export default zhTW;
