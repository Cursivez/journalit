
import type { Lang } from './en';

const ja: Partial<Lang> = {
  
  
  

  
  'command.add-trade': '新規トレードを追加',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Trade Importを開く',

  
  'command.create-drc': 'DRC（デイリーレポートカード）を開く',
  'command.create-weekly-review': '週次レビューを開く',
  'command.create-monthly-review': '月次レビューを開く',
  'command.create-quarterly-review': '四半期レビューを開く',
  'command.create-yearly-review': '年次レビューを開く',

  
  'command.open-dashboard': 'トレーディングダッシュボードを開く',
  'command.open-account-dashboard': '口座ダッシュボードを開く',
  'command.open-trade-log': 'トレードログを開く',
  'command.open-home': 'ホームビューを開く',
  'command.open-position-size-calculator': 'ポジションサイズ計算機を開く',

  
  'navigation.items.nav-weekly': '今週のレビュー',
  'navigation.items.nav-monthly': '今月のレビュー',
  'navigation.items.nav-quarterly': '今四半期のレビュー',
  'navigation.items.nav-yearly': '今年のレビュー',

  
  'command.force-sync': 'トレードを強制同期',
  'command.cancel-sync': 'トレード同期をキャンセル',

  
  'command.replay-onboarding': 'オンボーディングを再実行',

  
  
  
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
  'onboarding.final.mt.hero.dest.subtitle': 'Trade notes',
  'onboarding.final.finish': 'Finish',
  'command.open-release-notes': 'リリースノートを表示',

  
  'command.open-layout-builder': 'レイアウトビルダーを開く',
  'command.switch-template': 'テンプレートを切り替え',

  
  
  
  'auth.title.already-logged-in': 'Already Logged In',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign In to Journalit',
  'auth.label.email': 'Email Address',
  'auth.placeholder.email': 'your.email@example.com',

  
  
  
  'form.section.trade-details': 'トレード詳細',
  'form.section.trading-costs': '取引コスト',
  'form.section.risk-management': 'リスク管理',
  'form.section.analysis-thesis': '分析＆トレード根拠',

  
  
  
  'form.tab.basic': '基本',
  'form.tab.details': '詳細',
  'form.tab.advanced': '詳細設定',

  
  
  
  'form.field.account': '口座',
  'form.field.asset-type': '資産タイプ',
  'form.field.direction': '方向',
  'form.field.direction.long': 'ロング',
  'form.field.direction.short': 'ショート',
  'form.field.commission': '手数料',
  'form.field.commission-type': 'タイプ',
  'form.field.rebate': 'リベート',
  'form.field.swap': 'スワップ',
  'form.field.other-fees': 'その他手数料',
  'form.field.stop-loss': 'ストップロス',
  'form.field.risk-amount': 'リスク金額',
  'form.field.profit-loss': '損益',
  'form.field.total-pnl': '合計損益',
  'form.field.realized-pnl': '実現損益',
  'form.field.total-costs': '合計コスト:',
  'form.field.setup': 'セットアップ',
  'form.field.mistake': 'ミス',
  'form.field.custom-tags': 'カスタムタグ',
  'form.field.trade-thesis': 'トレード根拠',
  'form.field.time': '時間',
  'form.field.price': '価格',
  'form.field.size': 'サイズ',
  'form.field.entries': 'エントリー',
  'form.field.exits': 'エグジット',
  'form.field.optional': '（任意）',

  
  'form.field.position-size': 'ポジションサイズ',
  'form.field.position-size.shares': '株数',
  'form.field.position-size.contracts': '枚数',
  'form.field.position-size.lots': 'ロット数',
  'form.field.position-size.amount': '数量',
  'form.field.position-size.cfd-units': 'CFD単位',

  
  'form.field.instrument': '銘柄',
  'form.field.instrument.ticker': 'ティッカー',
  'form.field.instrument.option-symbol': 'オプションシンボル',
  'form.field.instrument.future-symbol': '先物シンボル',
  'form.field.instrument.forex-pair': '通貨ペア',
  'form.field.instrument.crypto-symbol': '暗号通貨シンボル',
  'form.field.instrument.cfd-symbol': 'CFDシンボル',

  
  'form.field.exchange': '取引所',
  'form.field.expiration-date': '満期日',
  'form.field.strike-price': '権利行使価格',
  'form.field.contract-size': '契約サイズ',
  'form.field.dollars-per-point': '1ポイントあたりのドル',
  'form.field.tick-size': 'ティックサイズ',
  'form.field.tick-value': 'ティック価値',
  'form.field.lot-size': 'ロットサイズ',
  'form.field.custom-lot-size': 'カスタムロットサイズ',
  'form.field.pip-value': 'ピップ価値',
  'form.field.leverage-ratio': 'レバレッジ比率',

  
  'form.field.lot-size.standard': 'スタンダード（100,000）',
  'form.field.lot-size.mini': 'ミニ（10,000）',
  'form.field.lot-size.micro': 'マイクロ（1,000）',
  'form.field.lot-size.custom': 'カスタム',

  
  
  
  'form.placeholder.select-accounts': '口座を選択',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': '手数料リベート/クレジット',
  'form.placeholder.swap': 'オーバーナイト金利',
  'form.placeholder.other-fees': 'プラットフォーム/規制手数料',
  'form.placeholder.stop-loss': 'ストップロス価格（任意）',
  'form.placeholder.risk-amount': '計画リスク金額',
  'form.placeholder.custom-tag': 'カスタムタグを入力してEnterを押す',
  'form.placeholder.thesis': 'このトレードの根拠を入力...',
  'form.placeholder.pnl': '合計損益を入力',
  'form.placeholder.exchange-stock': '例: NYSE、NASDAQ',
  'form.placeholder.exchange-crypto': '例: Binance、Coinbase',
  'form.placeholder.futures-point-value': '例: ES1の場合は50',
  'form.placeholder.leverage': '例: 1:100の場合は100',

  
  
  
  'form.entry-exit.add-entry': '+ エントリーを追加',
  'form.entry-exit.add-exit': '+ エグジットを追加',
  'form.entry-exit.remove-entry': 'エントリーを削除',
  'form.entry-exit.remove-exit': 'エグジットを削除',
  'form.entry-exit.total-entry-size': '合計エントリーサイズ:',
  'form.entry-exit.remaining-position': '残りポジション:',
  'form.entry-exit.open': '（オープン）',
  'form.entry-exit.closed': '（クローズ）',
  'form.entry-exit.direct-pnl': '価格の代わりに損益を直接入力',
  'form.entry-exit.direct-pnl-desc':
    '合計損益を直接入力します。手数料とコストは差し引かれます。',
  'form.entry-exit.calc-pnl':
    'エントリー/エグジット価格とポジションサイズから損益を計算',

  
  
  
  'form.trade-type.title': 'トレードタイプ',
  'form.trade-type.subtitle': '作成するトレードのタイプを選択',
  'form.trade-type.regular': '通常トレード',
  'form.trade-type.regular-desc':
    'エントリーとエグジットデータを含む通常のトレード',
  'form.trade-type.missed': '見逃したトレード',
  'form.trade-type.missed-desc':
    '見逃したトレード機会 - 損益と口座フィールドは任意',
  'form.trade-type.backtest': 'バックテストトレード',
  'form.trade-type.backtest-desc': '分析目的のバックテストシナリオ',
  'form.trade-type.missed-reason': 'なぜこのトレードを見逃しましたか？',
  'form.trade-type.missed-reason-placeholder':
    'このトレード機会を見逃した理由を説明...',

  'form.account-empty-state.title':
    'トレードを追加する前に口座を作成してください',
  'form.account-empty-state.create-account': '口座を作成',
  'form.account-empty-state.submit-disabled':
    'このトレードを保存するには先に口座を作成してください。',

  
  
  
  'button.save': '保存',
  'button.cancel': 'キャンセル',
  'button.delete': '削除',
  'button.update': '更新',
  'button.add': '追加',
  'button.create': '作成',
  'button.reset': 'リセット',
  'button.close': '閉じる',
  'button.confirm': '確認',
  'button.submit': '送信',

  'button.add-trade': 'トレードを追加',
  'button.update-trade': 'トレードを更新',
  'button.save-changes': '変更を保存',
  'button.create-trade': 'トレードを作成',
  'button.delete-all': 'すべて削除',
  'button.clear-all': 'すべてクリア',
  'button.save-name-only': '名前のみ保存',
  'button.cancel-action': 'アクションをキャンセル',
  'button.cancel-reset': 'リセットをキャンセル',
  'button.proceed-anyway': '続行する',
  'button.mark-reviewed': 'レビュー済みにする',
  'button.add-first-goal': '最初の目標を追加',
  'button.add-first-event': '最初のイベントを追加',
  'button.create-daily-review': 'デイリーレビューを作成',
  'button.apply-settings': '設定を適用',
  'button.learn-more': '詳細を見る',
  'button.upload-image': '画像をアップロード',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': '編集',
  'validation.fix-errors': '以下のエラーを修正してください:',

  'validation.complete-required': 'すべての必須フィールドを入力してください',
  'validation.map-required-fields':
    'インポート前にすべての必須フィールドをマッピングしてください',

  
  
  
  'notice.verification-sent':
    '確認コードを送信しました！メールをご確認ください。',
  'notice.login-success': 'ログインに成功しました！',
  'notice.new-verification-sent':
    '新しい確認コードを送信しました！メールをご確認ください。',
  'notice.logout-success': 'サインアウトしました',
  'notice.hotkey-set': 'Hotkey set: {hotkey}',
  'notice.ftp-created': 'FTP認証情報が正常に作成されました',
  'notice.ftp-reset':
    'FTPパスワードがリセットされました！新しいパスワードを保存してください。',
  'notice.template-saved': 'レイアウトを保存しました',
  'notice.template-created': 'レイアウトを作成しました',
  'notice.template-duplicated': 'レイアウトを複製しました',
  'notice.template-deleted': 'レイアウトを削除しました',
  'notice.default-template-updated': 'デフォルトレイアウトを更新しました',
  'notice.tradelog-saved': 'トレードログ設定を保存しました',
  'notice.settings-exported': '設定を{filename}にエクスポートしました',
  'notice.settings-imported':
    'v{version}から設定をインポートしました。すべての変更を適用するにはObsidianを再起動してください。',

  'notice.template-switched': '切り替え完了: {name}',
  'notice.auto-sync-toggled': '自動同期を{status}しました',
  'notice.auto-sync-enabled': '有効',
  'notice.auto-sync-disabled': '無効',
  'notice.reset-items': 'アイテムをデフォルトにリセットしました',
  'notice.reset-timeframes': '時間足をデフォルトにリセットしました',
  'notice.custom-fields-imported':
    '{count}件のカスタムフィールドをインポートしました',
  'notice.csv-parsed': 'CSV/XLSX/XLSの解析に成功: {count}行',
  'notice.setups-added': '{count}件のトレードにセットアップを追加しました',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': '{count}件のトレードにミスを追加しました',

  
  
  
  'notice.error.open-journalit':
    'Journalitを開けませんでした。Obsidianを再読み込みしてください。',
  'notice.error.open-drc': 'DRCを開けませんでした: {error}',
  'notice.error.open-dashboard': 'Failed to open dashboard: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': '週次レビューを開けませんでした: {error}',
  'notice.error.open-monthly-review': '月次レビューを開けませんでした: {error}',
  'notice.error.open-quarterly-review':
    '四半期レビューを開けませんでした: {error}',
  'notice.error.open-yearly-review': '年次レビューを開けませんでした: {error}',
  'notice.error.sync-trades': 'トレードの同期に失敗しました: {error}',
  'notice.error.open-release-notes':
    'リリースノートを開けませんでした: {error}',
  'notice.error.open-layout-builder':
    'レイアウトビルダーを開けませんでした: {error}',
  'notice.error.switch-template':
    'テンプレートの切り替えに失敗しました: {error}',
  'notice.error.no-active-file':
    'アクティブなファイルがありません。先にノートを開いてください。',
  'notice.error.no-template-support':
    'このノートタイプはテンプレートに対応していません。',
  'notice.error.no-templates':
    'このノートタイプに利用可能なテンプレートがありません。',
  'notice.error.asset-type-required': '銘柄を追加するには資産タイプが必要です',
  'notice.error.column-required':
    '少なくとも1つのカラムを表示する必要があります',
  'notice.error.save-settings': '設定の保存エラー: {error}',
  'notice.error.sign-in-vault': 'Vaultを登録するにはサインインしてください。',
  'notice.error.sign-in-sync': '自動同期を使用するにはサインインしてください。',
  'notice.error.export-settings':
    '設定のエクスポートに失敗しました。詳細はコンソールを確認してください。',
  'notice.error.import-settings': '設定のインポートに失敗しました: {error}',
  'notice.error.reset-settings':
    '設定のリセットに失敗しました。詳細はコンソールを確認してください。',

  'notice.error.invalid-drc-date': '無効なDRC日付',
  'notice.error.invalid-drc-missed':
    '無効なDRC日付。見逃したトレードを作成できません。',
  'notice.error.trade-not-found': 'トレードファイルが見つかりません: {path}',
  'notice.error.mark-reviewed': 'レビュー済みマークエラー: {error}',
  'notice.error.add-setups': 'セットアップ追加エラー: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'ミス追加エラー: {error}',
  'notice.error.delete-trades': 'トレード削除エラー: {error}',
  'notice.error.csv-validation': 'CSV/XLSX/XLS検証に失敗: {errors}',
  'notice.error.import-failed': 'インポートに失敗しました: {error}',
  'notice.error.file-too-large': 'ファイルが大きすぎます。最大サイズは10MBです',
  'notice.error.select-csv': 'CSV/XLSX/XLSファイルを選択してください',
  'notice.error.cannot-delete-builtin': '組み込みレイアウトは削除できません',
  'notice.error.duplicate-to-customize':
    'カスタマイズするにはこのテンプレートを複製してください',

  
  
  
  'notice.info.no-sync': '同期が進行中ではありません',

  'notice.info.settings-recovered':
    'バックアップから設定を復元しました。最近の変更が失われている可能性があります。',
  'notice.info.cannot-remove-locked':
    'ロックされたウィジェットは削除できません',

  
  
  
  'tradelog.title': 'トレードログ',
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
    'In normal mode, clicking a trade opens it. In multi-select mode, clicking selects it instead. Switch between those two behaviours depending on what you want to do.',
  'tradelog.empty': 'トレードが見つかりません',
  'tradelog.filter.all': 'すべて',
  'tradelog.filter.winners': '勝ちトレード',
  'tradelog.filter.losers': '負けトレード',
  'tradelog.filter.breakeven': '損益なし',
  'tradelog.filter.open': 'オープン',
  'tradelog.type.all': 'すべてのタイプ',
  'tradelog.type.regular': '通常',
  'tradelog.type.missed': '見逃し',
  'tradelog.type.backtest': 'バックテスト',

  
  
  
  'dashboard.title': 'ダッシュボード',
  'dashboard.no-data': 'トレードデータがありません',

  
  'dashboard.filter.accounts.all': 'すべての口座',
  'dashboard.filter.accounts.n-selected': '{count} 件の口座',
  'dashboard.filter.accounts.select-all': 'すべて選択',
  'dashboard.filter.accounts.select-all-option': '-- すべて選択 --',
  'dashboard.filter.accounts.none-found': '口座が見つかりません',

  
  'dashboard.filter.mistakes.all': 'すべてのミス',
  'dashboard.filter.mistakes.none': 'ミスなし',
  'dashboard.filter.mistakes.n-selected': '{count}個のミス',
  'dashboard.filter.mistakes.select-all': 'すべて選択',
  'dashboard.filter.mistakes.none-found': 'ミスが見つかりません',

  
  
  
  'view.home': 'ホーム',
  'view.dashboard': 'ダッシュボード',
  'view.trade-log': 'トレードログ',
  'view.account-dashboard': '口座ダッシュボード',
  'view.layout-builder': 'レイアウトビルダー',
  'view.csv-import': 'Trade Import',

  
  
  
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  
  
  'csv.errors.copy-shareable': '共有可能なレポートをコピー',
  'csv.errors.copy-report': 'レポートをコピー',
  'csv.errors.copy-detailed': '詳細レポートをコピー',

  
  
  
  'csv.account-selector.loading': '口座を読み込み中...',
  'csv.account-selector.no-accounts': '口座が見つかりません。',
  'csv.account-selector.create-account-hint':
    '取引をインポートする前に口座を作成してください。',
  'csv.account-selector.create-account-cta': '口座を作成',
  'csv.account-selector.label': '口座を選択',

  
  'csv.preview-first-note':
    'Preview is free. Importing into your vault requires PRO activation.',
  'csv.gate.import.title': 'PRO required to import',
  'csv.gate.import.description':
    'Importing trades into your vault is a PRO feature. Activate PRO to continue.',
  'csv.gate.templates.tooltip': 'PRO required (activate to use templates).',
  'csv.gate.ai.tooltip': 'PRO required (activate to use AI mapping).',

  
  
  
  'account.edit.modal.change-date.message':
    'アカウント「{account}」の作成日を {oldDate} から {newDate} に変更しようとしています。',
  'account.edit.modal.change-balance.message':
    '初期残高を {oldBalance} から {newBalance} に変更しようとしています。',
  'account.edit.modal.delete.question':
    'アカウント「{name}」を完全に削除してもよろしいですか？',
  'account.edit.modal.delete.warning':
    'このアカウントを完全に削除してもよろしいですか？',

  
  'account.edit.error.name-exists': 'アカウント「{name}」は既に存在します',
  'account.edit.error.creation-date-required': '作成日は必須です',

  
  
  
  'common.loading': '読み込み中...',
  'common.error': 'エラー',
  'common.success': '成功',
  'common.warning': '警告・注意事項',
  'common.info': '情報・お知らせ',
  'common.yes': 'はい',
  'common.no': 'いいえ',
  'common.ok': 'OK',
  'common.search': '検索...',
  'common.select': '選択...',
  'common.none': 'なし',
  'common.all': 'すべて',
  'common.date': '日付',
  'common.time': '時間',
  'common.today': '今日',
  'common.yesterday': '昨日',
  'common.tomorrow': '明日',
  'common.week': '週',
  'common.month': '月',
  'common.year': '年',
  'common.total': '合計',
  'common.average': '平均',
  'common.min': '最小',
  'common.max': '最大',
  'common.profit': '利益',
  'common.loss': '損失',
  'common.win': '勝ち',
  'common.lose': '負け',
  'common.trade': 'トレード',
  'common.trades': 'トレード',

  
  
  
  'settings.title': 'Journalit設定',
  'settings.language': '言語',
  'settings.language-desc': 'プラグインの表示言語を選択',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI Trade Importマッピング',
  'settings.auth.feature.metatrader-sync': 'MetaTrader同期',
  'settings.auth.feature.basic-tracking': '基本取引追跡',
  'settings.auth.feature.manual-csv': '手動CSVインポート',
  'settings.auth.feature.priority-support': '優先サポート',

  
  
  
  
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
  'premium.gate.cta.signin-continue': 'サインインして続行',
  'premium.gate.cta.continue-pro': 'PROに進む',
  'premium.gate.cta.keep-editing': '編集を続ける',
  'premium.gate.cta.refresh': 'Refresh status',
  'premium.gate.import.state.signin.title': 'インポートまであと1ステップです',
  'premium.gate.import.state.signin.description':
    'ファイルとマッピングの準備ができました。続行するにはサインインしてください。',
  'premium.gate.import.state.pro.title': 'インポートの準備ができました',
  'premium.gate.import.state.pro.description':
    'ファイルとマッピングの準備ができました。インポートはPROに含まれます。',
  'premium.gate.import.reassurance':
    'プレビューと列マッピングはそのまま保持されます。',
  'premium.gate.trial-hint':
    '初回のPRO購読には14日間の無料トライアルが含まれます。',
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

  
  'dashboard.metrics.avgRR': '平均RR（ペイオフ）',
  'dashboard.metrics.avgRRRiskBased': '平均RR（Rベース）',
  'dashboard.metrics.longestWinStreak': 'ベスト連勝',
  'dashboard.metrics.longestLossStreak': 'ワースト連敗',
  'dashboard.avgRRRiskBased.tooltip.title': '平均RR（Rベース）',
  'dashboard.avgRRRiskBased.tooltip.formula': '計算式: 平均勝ちR / 平均負けR',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    'リスクデータのある {total} 件のクローズドトレード中、{valid} 件から計算',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'リスク有効の勝ち: {wins}、負け: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'リスクデータは部分的です: {total} 件中 {valid} 件のクローズドトレードのみ有効です。',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'RベースRRの計算に十分なデータがありません。ストップ/リスク情報を入力し、有効な勝ち・負けトレードの両方を確保してください。',
  'metric.avgRR.name': '平均RR（ペイオフ）',
  'metric.avgRR.description': '平均リワード/リスク比（平均利益 / 平均損失）',
  'metric.avgRRRiskBased.name': '平均RR（Rベース）',
  'metric.avgRRRiskBased.description':
    'R倍数に基づく比率: 平均勝ちR / 平均負けR（ストップ/リスクデータが必要）',
  'metric.longestWinStreak.name': 'ベスト連勝',
  'metric.longestWinStreak.description': '決済日ベースの最長連続勝ち',
  'metric.longestLossStreak.name': 'ワースト連敗',
  'metric.longestLossStreak.description': '決済日ベースの最長連続負け',
  'metric.numTrades.name': '総トレード数',
  'metric.numTrades.description': '決済済みトレードの総数',
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
    '通貨として表示',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'この数値フィールドをトレードログ内でのみ通貨値として書式設定します',
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
  'settings.general.analytics-date-basis': '分析の日付基準',
  'settings.general.analytics-date-basis-desc':
    '主にスイングトレーダー向けです。分析にエントリー日または最終決済日を使います。決済日モードではクローズ済みトレードのみを集計し、直接PnLトレードには決済日が必要です。',
  'settings.general.analytics-date-basis-aria': '分析の日付基準を選択',
  'settings.general.analytics-date-basis-entry': 'エントリー日',
  'settings.general.analytics-date-basis-exit': '決済日',
  'settings.general.analytics-date-basis-changed':
    '分析の日付基準を{basis}に変更しました',
  'trade.metadata.broker-comment': 'ブローカーコメント',
  'tradelog.column.mtComment': 'MTコメント',
  'tradelog.tooltip.mtComment': 'MTコメント:',
  
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
  'settings.general.data-management': 'データ管理 & プライバシー',

  'settings.general.display-privacy-section': '表示 & プライバシー',

  'settings.general.privacy-mode': 'プライバシーモード',

  'settings.general.privacy-mode-desc':
    '保存データを変更せずに、取引、口座、価格、パフォーマンスの機密値をUIでマスクします。',

  'settings.general.privacy-mode-aria': 'プライバシーモードを切り替え',
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
  'widget.weekly-drc-context.invalid-context':
    'このウィジェットは週次レビューのノートでのみ使用できます',
  'templateEditor.widget.weekly-drc-day-label': '日',
  'templateEditor.widget.weekly-drc-display-label': '表示',
  'templateEditor.widget.weekly-drc-start-collapsed': '折りたたんで開始',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': 'カード',
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
  'dashboard.conversion.original-pnl': '元の損益',
  'dashboard.conversion.converted-pnl': '換算後の損益',
  'dashboard.conversion.details-label': '通貨換算の詳細',
  'dashboard.conversion.requires-conversion':
    '複数通貨の損益チャートには為替レート換算が必要です。',
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
    'ファイルは処理のため Journalit サーバーにアップロードされ、既定では保存されません。',
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
  'trade-import.guide.prompt': '何をエクスポートすればよいですか？',
  'trade-import.guide.link': 'ブローカーガイドを見る',
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

export default ja;
