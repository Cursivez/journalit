
import type { Lang } from './en';

const ja: Partial<Lang> = {
  'trade-import.recovery.bybit-header.columns':
    '不足している必須列: {columns}。',
  'trade-import.recovery.bybit-header.title':
    'Bybit のヘッダーまたはエクスポートを確認',
  'trade-import.recovery.bybit-header.message':
    '選択したヘッダーは Bybit の約定履歴に一致しません。ヘッダー行を確認するか、注文価格だけでなく約定価格と数量を含む取引履歴をエクスポートしてください。別の形式を対応付けるには、明示的に {manualSource} を選択してください。',
  'update.installed.title': '新機能',
  'settings.general.available-update-notifications': '更新リマインダーを表示',
  'settings.general.available-update-notifications-desc':
    '毎日新しいバージョンを確認し、更新を通知します。オフにすると更新後の変更点のみ表示します。',
  'account.edit.field.unscoped-live-balance-desc':
    '以前の残高修正がどのフェーズに属するか特定できませんでした。修正は保持されています。現在のブローカー残高を入力して、進行中のフェーズの残高を合わせてください。',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'このフェーズの累積実現取引利益が開始残高に対する設定割合に初めて達すると、変更後の通貨額上限が恒久的に有効になります。',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    '利益:損失上限の組をカンマで区切って入力します。前取引日終値の選択した利益基準で翌日の上限を決めるため、上限は上下します。',
  'account.edit.error.inactive-phase':
    'ライブ残高はアクティブなフェーズでのみ変更できます。',
  'account.edit.error.phase-changed':
    '編集中に口座情報が変更されました。保存する前に口座エディターを開き直してください。',
  'account.profiles.profitable-days-conflict':
    'これらの条件を適用する前に、現在の出金ポリシーを維持するか、利益獲得日の条件を編集してください。',
  'command.share-note-as-image': '現在のノートを画像として共有',
  'trade.share.copy-screenshot': 'トレードのスクリーンショットをコピー',
  'trade.share.copied':
    'トレードのスクリーンショットをクリップボードにコピーしました',
  'trade.share.failed': 'トレードのスクリーンショットをコピーできませんでした',
  'trade.share.not-ready':
    'トレードノートを読み込み中です。しばらくしてから再試行してください。',
  'share.review.action': 'レビューカードを共有',
  'share.review.modal-title': 'レビューを共有',
  'share.review.section.top': 'ノートの冒頭',
  'share.review.select-all': 'すべて選択',
  'share.review.clear': 'クリア',
  'share.review.legend.widget': 'ウィジェット',
  'share.review.legend.heading': '見出しと本文',
  'share.review.legend.media': 'メディア',
  'share.review.legend.text': 'テキスト',
  'share.review.copy': '画像をコピー',
  'settings.general.hide-dollar-amounts-in-shares':
    '共有画像でドル金額を非表示',
  'settings.general.hide-dollar-amounts-in-shares-desc':
    'Rマルチプルがオンのとき、トレードのスクリーンショットとレビューカードからリスク、手数料、コミッション、MAE/MFEのドル金額を除外します。',
  'share.review.hide-dollar-amounts': 'ドル金額を非表示',
  'share.review.hide-dollar-amounts-hint':
    'リスク、手数料などのドル金額を除外します。',
  'share.review.hide-dollar-amounts-needs-r':
    'ドル金額なしで共有するには、設定でRマルチプルをオンにしてください。',
  'share.review.copied': '共有カードをクリップボードにコピーしました',
  'share.review.failed': '共有カードをコピーできませんでした',
  'home.period.month': '月',
  'home.period.week': '週',
  'home.period.custom': 'カスタム期間',
  'home.period.invalid-range': '終了日は開始日以降にしてください。',
  'date-input.error.day': '日は1から{max}の範囲で入力してください。',
  'date-input.error.invalid': 'Please enter a valid date',
  'date-input.error.month': '月は1から12の範囲で入力してください。',
  'date-input.error.year':
    'YY（2000–2099）または YYYY（1000–9999）を入力してください。',
  'home.widget.aum.current-trend': '現在 · 30日間の推移',
  'home.widget.aum.description': '現在の口座残高と30日間の推移',
  'home.period.quarter': '四半期',
  'home.period.year': '年',
  'home.period.lifetime': '全期間',
  
  
  

  
  'command.add-trade': '新規トレードを追加',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Trade Importを開く',

  
  'command.create-drc': 'DRC（デイリーレポートカード）を開く',
  'command.create-weekly-review': '週次レビューを開く',
  'command.create-monthly-review': '月次レビューを開く',
  'command.create-quarterly-review': '四半期レビューを開く',
  'command.create-yearly-review': '年次レビューを開く',

  
  'command.open-dashboard': 'ダッシュボードを開く',
  'command.open-account-dashboard': '口座を開く',
  'command.open-trade-log': 'トレードログを開く',
  'command.open-home': 'ホームビューを開く',
  'command.open-position-size-calculator': 'ポジションサイズ計算機を開く',

  
  'navigation.items.nav-weekly': '今週のレビュー',
  'navigation.items.nav-monthly': '今月のレビュー',
  'navigation.items.nav-quarterly': '今四半期のレビュー',
  'navigation.items.nav-yearly': '今年のレビュー',

  
  'backend.cards.sync.cancel': '同期をキャンセル',

  
  'command.replay-onboarding': 'オンボーディングを再実行',

  
  
  

  
  
  
  'onboarding.notice.trade-sync-open-failed':
    'Trade Sync を開けませんでした。もう一度お試しください。',

  'command.open-release-notes': 'リリースノートを表示',

  
  'command.open-layout-builder': 'レイアウトビルダーを開く',

  
  
  
  'auth.title.already-logged-in': 'Already Logged In',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign In to Journalit',
  'auth.label.email': 'Email Address',

  
  
  
  'form.section.trade-details': 'トレード詳細',
  'form.section.trading-costs': '取引コスト',
  'form.section.risk-management': 'リスク管理',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': '分析＆トレード根拠',

  
  
  
  'form.tab.basic': '基本',
  'form.tab.details': '詳細',
  'form.tab.advanced': '詳細設定',

  
  
  
  'form.import-shortcut.open': 'トレードインポートを開く',
  'form.layout.customize': 'フォームをカスタマイズ',
  'form.layout.modal-title': 'トレードフォームをカスタマイズ',
  'form.layout.settings-title': 'トレードフォームのレイアウト',

  'form.layout.input-mode': '入力モード',
  'form.layout.input-mode-prices': '価格',
  'form.layout.input-mode-pnl-risk': 'P&L + リスク',
  'form.layout.input-mode-prices-desc':
    'エントリー価格とイグジット価格を記録し、Journalit に P&L を計算させます。',
  'form.layout.input-mode-pnl-risk-desc':
    'トレードの P&L とリスク額を直接記録します。Journalit が R 倍率を自動計算します。',
  'form.layout.asset-type-mode': '資産タイプ',
  'form.layout.asset-type-mode-show': '毎回選択',
  'form.layout.asset-type-mode-fixed': '固定',
  'form.layout.default-asset-type': '既定の資産タイプ',
  'form.layout.active-fields': '表示ブロック',
  'form.layout.available-fields': '非表示ブロック',
  'form.layout.active-fields-desc':
    'ブロックをドラッグして並べ替えます。使わないものは外してください。',
  'form.layout.available-fields-desc':
    '必要になったら非表示ブロックをフォームに戻せます。',
  'form.layout.empty-active': '表示中の任意ブロックはありません。',
  'form.layout.all-active': 'すべての任意ブロックが表示されています。',
  'form.layout.add-field-aria': '{field} をトレードフォームに追加',
  'form.layout.remove-field-aria': 'トレードフォームで {field} を非表示',
  'form.layout.saved': 'トレードフォームのレイアウトを保存しました',
  'form.layout.item.trading-costs.commission': '手数料',
  'form.layout.item.import-shortcut': 'インポートショートカット',
  'form.layout.item.import-shortcut-desc':
    'トレードインポートを開くフッターボタンを表示します。',
  'form.layout.item.core-details': '基本取引詳細',
  'form.layout.item.core-details-desc':
    '口座、銘柄、方向、エントリー/エグジット入力は先頭に固定されます。',
  'form.layout.item.asset-specific': '資産別フィールド',
  'form.layout.item.pnl-preview': 'P&L プレビュー',

  'form.layout.item.trade-currency': 'トレード通貨 / 為替レート',
  'form.layout.item.trade-currency-desc':
    '別の通貨でトレードを入力し、任意で為替レートを手動指定できます。',
  'form.layout.item.exchange-desc': '株式・暗号資産取引の取引所フィールド。',
  'form.layout.item.direct-pnl-toggle-desc':
    '個別のトレードを、決済価格ではなく損益合計の入力に切り替えます。',
  'form.layout.manual-fx-rate': 'FXレート上書き',
  'form.layout.result-r': 'R での結果',
  'form.layout.entry-time': 'トレード時刻',

  
  
  
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
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Target Price',
  'form.field.close-percent': 'Close %',
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
  'form.field.trade-currency': 'トレード通貨',
  'form.field.fx-rate': '{base}への為替レート',
  'form.field.fx-rate-override': 'FXレート上書き（{quote} → {base}）',

  
  'form.forex.using-manual-rate': '手動FXレートを使用',
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
  'form.placeholder.target-price': 'Target price',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': '計画リスク金額',
  'form.placeholder.fx-rate': '1 {currency} = ? {base}（空欄: 日次レート）',
  'form.placeholder.custom-tag': 'カスタムタグを入力してEnterを押す',
  'form.placeholder.thesis': 'このトレードの根拠を入力...',

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
  'form.ideal-exit.title': '理想のエグジット',

  'form.ideal-exit.price': '理想価格',
  'form.ideal-exit.size': 'サイズ',
  'form.ideal-exit.remove': '理想エグジットを削除',

  'form.ideal-exit.copy-actual': '実際のエグジットをコピー',

  'form.ideal-exit.tooltip':
    '後から見て実行したかった理想の出口計画を記録します。分割決済にも対応します。',
  'form.ideal-exit.empty': '理想のエグジットはまだありません',
  
  
  
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

  'form.account-empty-state.title': '最初のアカウントを設定',
  'form.account-empty-state.description':
    'アカウントは残高を記録し、Journalit がリターン、リスク、ドローダウンを計算できるようにします。作成に必要なのは名前だけです。',
  'form.account-empty-state.create-account': '口座を作成',
  'form.account-empty-state.submit-disabled':
    'このトレードを保存するには先に口座を作成してください。',
  'form.empty.take-profits': 'No take profit targets yet',
  'form.action.add-take-profit': 'Add Take Profit',
  'form.action.remove-take-profit': 'Remove take profit',

  
  
  
  'button.save': '保存',
  'button.cancel': 'キャンセル',
  'button.delete': '削除',
  'button.update': '更新',
  'button.add': '追加',
  'button.create': '作成',
  'button.reset': 'リセット',

  'button.confirm': '確認',

  'button.add-trade': 'トレードを追加',
  'button.update-trade': 'トレードを更新',
  'button.save-changes': '変更を保存',
  'button.create-trade': 'トレードを作成',
  'button.delete-all': 'すべて削除',
  'button.clear-all': 'すべてクリア',

  'button.cancel-reset': 'リセットをキャンセル',
  'button.proceed-anyway': '続行する',
  'button.mark-reviewed': 'レビュー済みにする',

  'button.learn-more': '詳細を見る',
  'button.upload-image': 'メディアをアップロード',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': '編集',
  'validation.fix-errors': '以下のエラーを修正してください:',

  'validation.complete-required': 'すべての必須フィールドを入力してください',

  
  
  

  'notice.login-success': 'ログインに成功しました！',
  'notice.pro-access-ready': 'PROアクセスの準備ができました。',

  'notice.logout-success': 'サインアウトしました',
  'notice.hotkey-set': 'ショートカットを設定しました: {hotkey}',
  'notice.ftp-created': 'FTP認証情報が正常に作成されました',
  'notice.ftp-password-rotated':
    'このデバイス用に新しいFTP認証情報が生成されました。他のデバイス（例：MetaTrader EA）で設定されているFTP同期は、新しいパスワードに更新する必要があります。',
  'notice.ftp-reused':
    'このデバイスの既存のFTP認証情報を読み込みました。機能しない場合は、パスワードのリセットを使用してください。',
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

  'notice.custom-fields-imported':
    '{count}件のカスタムフィールドをインポートしました',

  'notice.setups-added': '{count}件のトレードにセットアップを追加しました',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': '{count}件のトレードにミスを追加しました',

  
  
  
  'notice.error.open-journalit':
    'Journalitを開けませんでした。Obsidianを再読み込みしてください。',
  'notice.error.open-drc': 'DRCを開けませんでした: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': '週次レビューを開けませんでした: {error}',
  'notice.error.open-monthly-review': '月次レビューを開けませんでした: {error}',
  'notice.error.open-quarterly-review':
    '四半期レビューを開けませんでした: {error}',
  'notice.error.open-yearly-review': '年次レビューを開けませんでした: {error}',

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

  
  
  

  'notice.info.settings-recovered':
    'バックアップから設定を復元しました。最近の変更が失われている可能性があります。',
  'notice.info.cannot-remove-locked':
    'ロックされたウィジェットは削除できません',

  
  
  
  'tradelog.title': 'トレードログ',
  'dashboard.guide.empty.intro.title': 'Welcome to your Dashboard',
  'dashboard.guide.empty.intro.description':
    'Your Dashboard becomes useful as soon as Journalit has trading history to analyse.',
  'dashboard.guide.empty.state.title': 'Bring your trading history with you',
  'dashboard.guide.empty.state.description':
    'Import previous trades to start with meaningful performance data, or add a trade manually if you are recording your first trades.',
  'dashboard.guide.main.intro.title': 'ダッシュボードです',
  'dashboard.guide.main.intro.description':
    'Use this page to track your performance, review your stats, and keep your most useful charts in one place.',
  'dashboard.guide.main.filters.title': 'Filters change the whole Dashboard',
  'dashboard.guide.main.filters.description':
    'このページのすべての統計とチャートを、別の期間、口座、セットアップ、タグ、トレードタイプで更新したいときはフィルターを使います。任意の値を除外して、そのトレードを外すこともできます。',
  'dashboard.guide.main.edit-layout.title':
    'Turn on edit mode to customise this page',
  'dashboard.guide.main.edit-layout.description':
    'Click Edit Layout to unlock moving, resizing, removing, and adding Dashboard widgets.',
  'dashboard.guide.main.open-widget-selector.title': 'Open Add Widget',
  'dashboard.guide.main.open-widget-selector.description':
    'Click Add Widget to add more charts and bring back widgets you removed earlier.',
  'dashboard.guide.main.widget-picker.title': 'Pick what you want to show',
  'dashboard.guide.main.widget-picker.description':
    'このパネルではすべてのチャートと指標をプレビューできます。クリックすると追加され、すでにダッシュボードにあるものは「使用中」に表示されます。',
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
  'home.guide.intro.title': 'おかえりなさい',
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
    'ウィジェットをプレビューして追加したり、クイックリンクを元に戻したり、口座やセットアップのショートカットを追加できます。ホームにすでにあるものは「使用中」に表示され、そこから削除できます。',
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
  'layoutBuilder.guide.create-own-layout.title': '自分のレイアウトを作成',
  'layoutBuilder.guide.create-own-layout.description':
    '組み込みレイアウトは読み取り専用です。組み込みのDRCレイアウトのコピーアイコンをクリックして複製するか、+ を押して新しいレイアウトを作成します。「次へ」を押すと標準のDRCを複製します。',
  'layoutBuilder.guide.editor-overview.title':
    'This is where you edit the template',
  'layoutBuilder.guide.editor-overview.description':
    'Rename the template here, review the widget list, drag the left handle to rearrange widgets, click a widget to change it, and remove anything you do not need.',
  'layoutBuilder.guide.add-widget.title': 'ウィジェットを追加',
  'layoutBuilder.guide.add-widget.description':
    '「ウィジェットを追加」でレイアウトの末尾にブロックを追加するか、2つのウィジェットの間にカーソルを合わせて + をクリックすると、好きな位置に挿入できます。',
  'layoutBuilder.guide.choose-widget.title': 'Choose a widget',
  'layoutBuilder.guide.choose-widget.description':
    'Type in the search box to find a widget by name, description, or category, then choose it. You can also press Next and Journalit will choose the first result for you.',
  'layoutBuilder.guide.save-template.title': 'Save your layout',
  'layoutBuilder.guide.save-template.description':
    'Once your copy looks right, save it. You can keep refining it later as your review process improves.',
  'layoutBuilder.guide.set-default-template.title':
    'デフォルトのレイアウトに設定',
  'layoutBuilder.guide.set-default-template.description':
    'Click the star on your new template if you want new review notes to use this layout automatically.',
  'layoutBuilder.guide.whats-new.insert-slot.title':
    '好きな位置にウィジェットを追加',
  'layoutBuilder.guide.whats-new.insert-slot.description':
    '2つのウィジェットの間にカーソルを合わせて + を押すと、一番下ではなくその位置にウィジェットを追加できます。',
  'layoutBuilder.guide.whats-new.add-widget-button.title':
    '最後に追加することもできます',
  'layoutBuilder.guide.whats-new.add-widget-button.description':
    'ウィジェットを追加は引き続きレイアウトの最後に追加し、新しいウィジェットまでスクロールして検索を開きます。',

  'trade-form.guide.customization-modal.title':
    'フォームをワークフローに合わせる',
  'trade-form.guide.customization-modal.description':
    'ここで任意ブロックの表示、非表示、並べ替えができます。実際に使う項目だけにフォームを絞りましょう。',
  'trade-form.guide.finish.title': 'これがカスタマイズ機能です',
  'trade-form.guide.finish.description':
    'トレードフォームを別の記録フローに合わせたいときは、いつでもこのボタンから変更できます。',
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
    '特定の口座、セットアップ、タグ、トレードタイプ、ステータス、日付だけを確認したいときはフィルターを開きます。任意の値を除外して、そのトレードを外すこともできます。',
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
    'In normal mode, clicking a trade opens it. In multi-select mode, clicking selects it instead. Switch between those two behaviours depending on what you want to do.',
  'tradelog.empty': 'トレードが見つかりません',
  'tradelog.filter.all': 'すべて',
  'tradelog.filter.winners': '勝ちトレード',
  'tradelog.filter.losers': '負けトレード',
  'tradelog.filter.breakeven': '損益なし',
  'tradelog.filter.open': 'オープン',
  'tradelog.type.regular': '通常',
  'tradelog.type.missed': '見逃し',
  'tradelog.type.backtest': 'バックテスト',

  
  
  
  'dashboard.title': 'ダッシュボード',
  'dashboard.no-data': 'トレードデータがありません',
  'dashboard.empty.import-action': 'Import existing trades',
  'dashboard.empty.manual-action': 'Add a trade manually',
  'dashboard.widgets.setup-performance.title': 'セットアップ別パフォーマンス',
  'dashboard.widgets.setup-performance.description':
    'セットアップ別の成績ランキング',
  'dashboard.widgets.setup-performance.empty':
    'セットアップ別のパフォーマンスデータがありません',
  'dashboard.widgets.setup-performance.masked-label': 'セットアップ',
  'dashboard.widgets.tag-performance.title': 'タグ別パフォーマンス',
  'dashboard.widgets.tag-performance.description': 'タグ別の成績ランキング',
  'dashboard.widgets.tag-performance.empty':
    'タグ別のパフォーマンスデータがありません',
  'dashboard.widgets.tag-performance.masked-label': 'タグ',
  'dashboard.widgets.ticker-performance.title': 'ティッカー別パフォーマンス',
  'dashboard.widgets.ticker-performance.metric-aria': '指標',
  'dashboard.widgets.ticker-performance.view-aria': '表示モード',
  'dashboard.widgets.ticker-performance.view.best-and-worst': '上位と下位',
  'dashboard.widgets.ticker-performance.view.best': '上位10件',
  'dashboard.widgets.ticker-performance.view.worst': '下位10件',
  'dashboard.widgets.ticker-performance.metric.total-pnl': '合計損益',
  'dashboard.widgets.ticker-performance.metric.total-r': '合計R',
  'dashboard.widgets.ticker-performance.metric.win-rate': '勝率',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'ティッカー: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': '取引: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    '勝率: {rate} ({wins}勝 / {losses}敗)',

  'dashboard.widgets.ticker-performance.empty':
    'ティッカー別のパフォーマンスデータがありません',
  'dashboard.widgets.ticker-performance.empty-submessage':
    '現在のフィルターに一致するティッカー付きの決済済み取引がありません。',
  'dashboard.widgets.ticker-performance.masked-ticker': 'ティッカー',
  'dashboard.widgets.ticker-performance.omitted-count': '省略：{count}',

  'widget.tickerPerformance.name': 'ティッカー別パフォーマンス',
  'widget.tickerPerformance.description': 'ティッカー別の成績ランキング',

  
  'dashboard.filter.accounts.all': 'すべての口座',
  'dashboard.filter.accounts.n-selected': '{count} 件の口座',
  'dashboard.filter.accounts.select-all': 'すべて選択',

  'dashboard.filter.accounts.none-found': '口座が見つかりません',

  

  
  
  

  'view.dashboard': 'ダッシュボード',
  'view.trade-log': 'トレードログ',
  'view.account-dashboard': '口座',
  'view.layout-builder': 'レイアウトビルダー',
  'view.csv-import': 'Trade Import',

  
  
  
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.history-ready': 'Your trading history is ready',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  
  

  'csv.errors.copy-report': 'レポートをコピー',

  
  
  

  

  
  
  
  'account.edit.modal.change-date.message':
    'アカウント「{account}」の作成日を {oldDate} から {newDate} に変更しようとしています。',
  'account.edit.modal.change-balance.message':
    '初期残高を {oldBalance} から {newBalance} に変更しようとしています。',
  'account.edit.modal.delete.question':
    'アカウント「{name}」を完全に削除してもよろしいですか？',

  
  'account.edit.error.name-exists': 'アカウント「{name}」は既に存在します',
  'account.edit.error.creation-date-required': '作成日は必須です',

  
  
  
  'common.loading': '読み込み中...',
  'common.error': 'エラー',

  'common.warning': '警告・注意事項',
  'common.info': '情報・お知らせ',
  'common.yes': 'はい',
  'common.no': 'いいえ',
  'common.ok': 'OK',

  'common.none': 'なし',
  'common.all': 'すべて',
  'common.date': '日付',

  'common.week': '週',
  'common.month': '月',
  'common.year': '年',

  'common.min': '最小',
  'common.max': '最大',
  'common.profit': '利益',

  'common.trade': 'トレード',
  'common.trades': 'トレード',
  'common.color.label': '色',
  'common.color.default': 'デフォルト',

  
  
  

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI Trade Importマッピング',
  'settings.auth.feature.basic-tracking': '基本取引追跡',

  'settings.auth.feature.priority-support': '優先サポート',

  
  
  
  
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description':
    'Journalit とトレードの設定チェックリスト',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.account.title': '取引アカウントを設定',
  'home.widget.getting-started.item.account.description':
    'トレードは残高を記録するアカウントに紐づきます。アカウントがないとリターンやドローダウンを計算できません。',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'アカウントを設定',
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
  'home.widget.getting-started.item.sidebar.title':
    'ナビゲーションサイドバーを開く',
  'home.widget.getting-started.item.sidebar.description':
    'Journalitのページ、レビュー、ツール、検索にすばやくアクセスできます。',
  'home.widget.getting-started.item.sidebar.time': '10秒',
  'home.widget.getting-started.item.sidebar.cta': 'サイドバーを開く',
  'home.quick-links.navigation-sidebar': 'ナビゲーションサイドバー',
  'notice.error.open-navigation-sidebar':
    'ナビゲーションサイドバーを開けませんでした。もう一度お試しください。',
  'navigation.setting.open': 'ナビゲーションサイドバーを開く',
  'navigation.setting.open.desc':
    '今すぐ表示し、Obsidianのサイドバーが折りたたまれている場合は展開します。',
  'navigation.setting.open.button': 'サイドバーを開く',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    'Trade Import、Trade Sync、経済カレンダーを有効にします。',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',

  

  'premium.gate.cta.continue-pro': 'PROに進む',

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
    'R | Trader Pro で注文履歴を開き、対象の口座/日付の約定済み(Completed/Filled)注文に絞り込みます',
  'csv.broker-guide.rithmic.step-2':
    '列の追加/削除(Add/Remove Columns)で Side、Symbol、Qty Filled、Avg Fill Price、Fill/Update Time が表示されていることを確認します',
  'csv.broker-guide.rithmic.warning.emphasis': '重要:',

  

  
  'dashboard.metrics.avgRR': '平均RR（ペイオフ）',
  'dashboard.metrics.sharpeRatio': 'シャープレシオ',
  'dashboard.metrics.avgRRRiskBased': '平均RR（Rベース）',
  'dashboard.metrics.longestWinStreak': 'ベスト連勝',
  'dashboard.metrics.longestLossStreak': 'ワースト連敗',
  'dashboard.sharpeRatio.tooltip.title': 'シャープレシオ',
  'dashboard.sharpeRatio.tooltip.formula':
    '計算式: クローズドトレードの平均純損益 / クローズドトレード純損益の標本標準偏差。無リスク金利は 0 で、年率換算はしていません。',
  'dashboard.sharpeRatio.tooltip.coverage':
    '{total} 件のクローズドトレード中 {valid} 件から計算',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    '部分カバレッジ: {total} 件中 {valid} 件のクローズドトレードに有限の純損益があります。',
  'dashboard.sharpeRatio.tooltip.no-data':
    'P&Lの変動がゼロではないクローズドトレードが少なくとも2件必要です。',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'このシャープレシオはFX換算なしの混在通貨に基づいているため、誤解を招く可能性があります。',
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
  'metric.avgRR.description': '平均利益を平均損失で割った値',
  'metric.sharpeRatio.name': 'シャープレシオ',
  'metric.sharpeRatio.description': 'ボラティリティに対する平均トレード P&L',
  'metric.avgRRRiskBased.name': '平均RR（Rベース）',
  'metric.avgRRRiskBased.description': '平均勝ち R と負け R（ストップ必須）',
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

  'widget.longDrawdownChart.name': 'Long Drawdown',

  'widget.shortDrawdownChart.name': 'Short Drawdown',

  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',

  'guide.skip-guide': 'ガイドをスキップ',
  'guide.step-count': '{count} ステップ',
  'guide.step-position': 'ステップ {current}/{total}',
  'settings.general.data-management': 'データ管理 & プライバシー',

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

  'templateEditor.widget.weekly-drc-start-collapsed': '折りたたんで開始',
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
  'dashboard.conversion.original-pnl': '元の損益',
  'dashboard.conversion.converted-pnl': '換算後の損益',
  'dashboard.conversion.details-label': '通貨換算の詳細',

  'widget.stats.vs-prev': 'vs prev',
  'common.r-missing.title': 'このトレードにはRがありません',
  'common.r-missing.trade':
    'このトレードにはリスク額がないため、結果をRで表示できません。',
  'common.r-missing.fix':
    'リスク額を追加するか、設定でデフォルトのリスク額を設定してください。',
  'common.r-coverage.partial':
    '{total}件中{valid}件のトレードに基づいています。リスク額のないトレードはRに含まれません。',
  'common.r-coverage.none':
    'ここにはリスク額のあるトレードがないため、表示できるRがありません。',
  'dashboard.r-coverage.no-comparison':
    '変化は表示されません: 比較期間にはこの指標のR値がありません。',
  'dashboard.metrics.past-30d': 'past 30d',

  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'widget.tag-performance.name': 'タグ別パフォーマンス',
  'widget.tag-performance.description': '取引タグ別のパフォーマンス内訳',
  'widget.table.header.tag': 'タグ',
  'widget.empty.no-tag-data': 'この期間のタグデータはありません',
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
    'サインインするか無料の Journalit アカウントを作成すると、Trade Import でファイルをプレビューできます。Pro が必要なのは取引をインポートするときだけです。',
  'quick-import.gate.sign-in-cta': 'サインインして無料でプレビュー',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
  'quick-import.gate.preview-free': 'ファイルを無料でプレビュー',
  'quick-import.message.needs-setup':
    'Choose a favorite broker or template in Trade Import before using Quick Import.',
  'quick-import.message.capabilities-failed':
    'Quick Import setup could not be loaded.',
  'quick-import.message.mapping-required':
    'This file needs column mapping. Open the full Trade Import flow to review mappings.',
  'quick-import.message.preview-failed':
    'This file needs review in the full Trade Import flow.',

  'quick-import.privacy-note':
    '選択したファイルとインポート設定は Journalit に送信されます。暗号化された診断記録は無料で1日、Proで14日、プレビューは7日で期限切れになります。任意のAIマッピングでは、見出しとサンプル行をAIモデルに送信します。Trade Import は個別のクライアントテレメトリやバックグラウンドの障害レポートを送信しません。',
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
  'quick-import.action.import-count.one': '{count} 件の取引をインポート',
  'quick-import.action.import-count.few': '{count} 件の取引をインポート',
  'quick-import.action.import-count.many': '{count} 件の取引をインポート',
  'quick-import.action.import-count.other': '{count} 件の取引をインポート',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.open-failed': 'Unable to open Trade Import',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.notice.free-preview-rate-limited':
    '無料プレビューの上限に達しました。PRO を開始するか、約 {minutes} 分後にもう一度お試しください。',
  'trade-import.notice.free-preview-storage-limit-reached':
    '無料プレビューには最大 {limit} 件の取引を保存できます。現在 {storedItems} 件が保存されており、このファイルから {requestedItems} 件が追加されます。以前のプレビューの期限切れを待つか、PRO を開始してください。',
  'trade-import.preview-error.guidance':
    'すべての必須項目がマッピングされ、選択した日付形式がファイルと一致し、数値列に有効な取引値が含まれていることを確認してください。',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': 'トレード',
  'trade-import.gate.brand-right': 'インポート',
  'trade-import.gate.sign-in.title': '取引履歴を無料でプレビュー',
  'trade-import.gate.sign-in':
    'サインインするか無料の Journalit アカウントを作成してファイルを分析できます。Pro が必要なのは取引をインポートするときだけです。',
  'trade-import.gate.sign-in.reassurance':
    '選択したファイルとインポート設定は Journalit に送信されます。暗号化された診断記録は無料で1日、Proで14日、プレビューは7日で期限切れになります。任意のAIマッピングでは、見出しとサンプル行をAIモデルに送信します。Trade Import は個別のクライアントテレメトリやバックグラウンドの障害レポートを送信しません。',
  'trade-import.gate.sign-in.no-trial':
    '分析とプレビューに Pro のトライアルは必要ありません。',
  'trade-import.gate.sign-in.cta': 'サインインして無料でプレビュー',

  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': 'エクスポート元 / プラットフォーム',
  'trade-import.label.asset-type': 'Asset type',
  'trade-import.asset.stock': 'Stock',
  'trade-import.asset.options': 'Options',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.manual-mode.price-based': '注文・約定（トレードにまとめる）',
  'trade-import.manual-mode.direct-pnl': '1行 = 1トレード（損益を使用）',
  'trade-import.label.ai-mapping': 'Request AI mapping suggestions',
  'trade-import.recovery.rithmic-order-history.title': '未対応の Rithmic 形式',
  'trade-import.recovery.rithmic-order-history.message':
    'Rithmic の注文履歴をエクスポートしたファイルをアップロードするか、このファイルを作成したプラットフォームを選択してください。',
  'trade-import.recovery.rithmic-order-history.choose-file':
    '別のファイルを選択',
  'trade-import.source.change-action': 'ソースを変更',
  'trade-import.privacy.copy':
    '選択したファイルとインポート設定は Journalit に送信されます。暗号化された診断記録は無料で1日、Proで14日、プレビューは7日で期限切れになります。任意のAIマッピングでは、見出しとサンプル行をAIモデルに送信します。Trade Import は個別のクライアントテレメトリやバックグラウンドの障害レポートを送信しません。エクスポートには口座識別子、取引履歴、メモ、価格、数量、手数料、残高、損益が含まれる場合があります。リクエストにはカスタムフィールドの定義と保存済み設定も含まれ、プレビューには対象口座名が含まれます。AI処理を避けるにはAIマッピングを無効にしてください。',

  'trade-import.action.analyse': 'Analyse file',
  'trade-import.action.choose-file': 'Choose file',
  'trade-import.action.drop-file': 'Drop file to upload',
  'trade-import.analyse.detected':
    '{fileType} ファイルを読み込みました。下の行を確認し、各列をトレード項目に対応付けてください。',
  'trade-import.table.screenshots': 'スクリーンショット',
  'trade-import.preview.screenshot-alt':
    'スプレッドシート {row} 行目の {symbol} のスクリーンショット',
  'trade-import.preview.screenshots-more': '他 {count} 件',
  'trade-import.preview.include-screenshots':
    'スプレッドシートのスクリーンショットを各トレードに追加（{count}）',
  'trade-import.completion.screenshots-added':
    'スプレッドシートから追加したスクリーンショット: {count}',
  'trade-import.completion.screenshots-failed':
    '追加できなかったスプレッドシートのスクリーンショット: {count}',
  'trade-import.preview.import-anyway': 'それでもインポート',
  'trade-import.preview.import-anyway-aria':
    '{date} の {symbol} をそれでもインポート',
  'trade-import.preview.import-all-anyway':
    '重複の可能性がある{count}件をすべてそれでもインポート',
  'csv.mapper.missing-fields.pnl-or-prices':
    'または、エントリー価格・決済価格・数量を対応付けると、価格から損益を計算します。',
  'trade-import.pnl-from-prices.title': '損益は価格から計算されます',
  'trade-import.pnl-from-prices.body':
    '損益の列がないため、エントリー価格・決済価格・数量から損益を計算します。正しい資産クラスでないと計算が合わないため、これらのトレードの種類を選んでください。',
  'trade-import.pnl-from-prices.contract-size':
    'FX と先物で損益を計算するには、契約サイズの列も必要です。ない場合は、損益の列を対応付けてください。',
  'trade-import.diagnostic.choose-date-format': '日付形式を選択',
  'trade-import.date-question.ambiguous':
    '日付は {example} のような形式です。これはどの日付ですか？',
  'trade-import.date-question.mixed':
    'この列の一部の日付は {example} のように順序が異なります。大半の日付はどの順序ですか？',
  'trade-import.date-question.mixed-note':
    '別の順序で書かれた行は一覧表示されるので、ファイル側で修正できます。',
  'quick-import.message.date-order':
    '日付が2通りに読めます。完全なインポートを開いて選択してください。',
  'csv.date-format.eu-dot': 'EU（ドット区切り）: 25.12.2024（日.月.年）',
  'csv.date-format.ymd-dot': '年が先（ドット区切り）: 2024.12.25',
  'onboarding.data-source.option.file.description':
    'Excel、Google スプレッドシート、CSV で付けている記録。',
  'onboarding.data-source.option.file.label': '自分のスプレッドシート',
  'trade-import.unmapped.title': 'インポートされない列 ({count})',
  'trade-import.unmapped.body':
    'これらの列は Journalit の項目に対応付けられておらず、取り込まれません。合う項目があれば、上で対応付けてください。',
  'trade-import.unmapped.keep': 'カスタム項目として残す',
  'trade-import.unmapped.keep-aria': '{header} をカスタム項目として残す',
  'trade-import.custom-field.title': '「{header}」をカスタム項目として残す',
  'trade-import.custom-field.hint':
    'トレードに項目を追加し、この列の値を入れます。Journalit の既存の項目が合う場合は、そちらに対応付けてください。',
  'trade-import.custom-field.name': '項目名',
  'trade-import.custom-field.type': '項目の種類',
  'trade-import.custom-field.type.text': 'テキスト',
  'trade-import.custom-field.type.number': '数値',
  'trade-import.custom-field.type.dropdown': '選択リスト',
  'trade-import.custom-field.create': '項目を作成',
  'trade-import.custom-field.error.reserved':
    'この名前は標準のトレード項目で使われています。別の名前を選んでください。',
  'trade-import.table.open-closed': '保有/決済',
  'trade-import.status.open': '保有中',
  'trade-import.status.partially-closed': '一部決済',
  'trade-import.status.closed': '決済済み',
  'trade-import.status.cancelled': 'キャンセル',
  'trade-import.diagnostic.column': '列: {columns}',
  'trade-import.diagnostic.unmap-column': 'この列はインポートしない',
  'trade-import.diagnostic.edit-mapping': 'マッピングを変更',
  'trade-import.source.manual.tile': '自作スプレッドシート / その他のファイル',
  'trade-import.source.manual.title':
    '自作スプレッドシートまたはその他のファイル',
  'csv.mapper.mode.title': '各行の内容は？',
  'csv.mapper.mode.help':
    'トレード記録のスプレッドシートは通常、1行に決済済みのトレード1件と損益列があります。ブローカーの注文履歴は、買いと売りをそれぞれ別の行に記載します。',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Sheet',
  'trade-import.label.header-row': 'Header row',
  'trade-import.placeholder.auto': 'Auto',
  'trade-import.label.date-format': 'Date format',

  'trade-import.label.save-template': 'Save mapping template',
  'trade-import.placeholder.template-name': 'Template name',
  'trade-import.action.save-template': 'Save template',
  'trade-import.action.preview': 'Generate preview',

  'trade-import.preview.found.one': '{count} 件の取引が見つかりました',
  'trade-import.preview.found.few': '{count} 件の取引が見つかりました',
  'trade-import.preview.found.many': '{count} 件の取引が見つかりました',
  'trade-import.preview.found.other': '{count} 件の取引が見つかりました',
  'trade-import.preview.date-range': '{start}～{end}',
  'trade-import.preview.metric.symbols': 'シンボル',
  'trade-import.preview.metric.ready': 'インポート可能',
  'trade-import.preview.metric.duplicates': '重複の可能性',
  'trade-import.preview.metric.attention': '確認が必要',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Entry time',
  'trade-import.table.quantity': 'Quantity',
  'trade-import.table.message': 'Message',
  'trade-import.status.new': '新規',
  'trade-import.status.already-imported': 'インポート済み',
  'trade-import.status.other-account': '別の口座にあり',
  'trade-import.status.other-account.detail': '{account} にインポート済み',
  'trade-import.status.updates-existing': '既存の取引を更新',
  'trade-import.status.possible-duplicate': '重複の可能性',
  'trade-import.status.needs-review': '確認が必要',
  'trade-import.status.duplicate-in-file': 'ファイル内で重複',
  'trade-import.status.invalid': '無効な取引',
  'trade-import.status.no-open-trade': '決済対象の保有取引なし',
  'trade-import.status.multiple-open-trades': '複数の保有取引が一致',
  'trade-import.status.quantity-mismatch': '数量の不一致',
  'trade-import.server-deletion.deleted':
    'Journalit サーバーから削除された取引: {count}',
  'trade-import.server-deletion.kept':
    '別のインポートにも含まれるため保持された取引: {count}',
  'trade-import.server-deletion.blocked-broker-connected':
    'この口座はブローカー接続で同期されています。データを削除するにはブローカーの接続を解除してください。',
  'trade-import.server-deletion.blocked-broker-history':
    'この口座にはブローカー同期の履歴があるため、ここでは削除できません。代わりに個別のインポートを削除してください。',
  'trade-import.server-deletion.failed':
    'Journalit サーバーから削除できませんでした。もう一度お試しください。',
  'trade-import.server-deletion.notice':
    'サーバーでの削除後にゴミ箱へ移動した取引ノート: {count}',
  'trade-import.server-deletion.account.title':
    'サーバーの口座を削除しますか？',
  'trade-import.server-deletion.account.message':
    '「{account}」とそのインポート済み取引（サーバー上に {count} 件）を Journalit サーバーから完全に削除し、同期しているすべての Vault でそのノートをゴミ箱へ移動します。その後、ファイルを再インポートできます。',
  'trade-import.server-deletion.account.confirm': 'サーバーから削除',
  'trade-import.server-deletion.account.button': 'サーバーから削除',
  'trade-import.history.title': 'インポート履歴',
  'trade-import.completion.wrong-account':
    '間違った口座にインポートしましたか？',
  'trade-import.completion.undo-import': 'このインポートを取り消す',
  'trade-import.action.manage-imports': '過去のインポートを管理',
  'trade-sync.import.more-actions': 'その他の操作',
  'trade-import.history.loading': 'インポート履歴を読み込み中…',
  'trade-import.history.load-failed': 'インポート履歴を読み込めませんでした。',
  'trade-import.history.empty': 'インポートはまだありません。',
  'trade-import.history.trades-on-server': 'サーバー上に {count} 件',
  'trade-import.history.delete.title': 'このインポートを削除しますか？',
  'trade-import.history.delete.message':
    'このインポートが「{account}」に追加した取引（サーバー上に {count} 件）を Journalit サーバーから完全に削除し、同期しているすべての Vault でそのノートをゴミ箱へ移動します。別のインポートにも含まれる取引は保持されます。その後、ファイルを再インポートできます。',
  'trade-import.history.delete.confirm': 'インポートを削除',
  'trade-import.history.load-more': 'さらに読み込む',
  'account.edit.modal.delete.delete-server-trades':
    'インポート済み取引も Journalit サーバーから削除する（サーバー上に {count} 件）。ここでノートを残しても、同期しているすべての Vault でゴミ箱へ移動されます。',
  'trade-import.preview.other-account.message':
    'すでに {account} にあるため（{count}件）、スキップされます。',
  'trade-import.preview.other-account.import-instead':
    '代わりに {account} にインポート',
  'trade-import.preview.other-account.undo-earlier':
    '以前のインポートを取り消す',
  'trade-import.action.confirm': 'Confirm import',
  'trade-import.action.activate-pro.one':
    'PRO を有効にして {count} 件の取引をインポート',
  'trade-import.action.activate-pro.few':
    'PRO を有効にして {count} 件の取引をインポート',
  'trade-import.action.activate-pro.many':
    'PRO を有効にして {count} 件の取引をインポート',
  'trade-import.action.activate-pro.other':
    'PRO を有効にして {count} 件の取引をインポート',
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',

  
  'command.open-setups': 'セットアップを開く',
  'setups.create.title': 'Create Setup',
  'setups.create.field.name': 'Setup Name',
  'setups.create.placeholder.name': 'Opening Drive',
  'setups.create.field.status': 'Status',
  'setups.create.field.direction': 'Direction',
  'setups.create.field.color': '色',
  'setups.create.field.color-description':
    'このセットアップを識別する色を選択してください。',
  'setups.create.profile.heading': '優先する項目',
  'setups.create.profile.optional-label': '（任意）',
  'setups.create.field.sessions': 'セッション',
  'setups.create.field.preferred-sessions-tooltip':
    'これらのセッションは、設定 → ジャーナル → セッションモードで管理できます。',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': '時間足',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'ティッカー',
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
  'setups.edit.delete.button': 'セットアップを削除',
  'setups.edit.delete.title': 'セットアップを削除',
  'setups.edit.delete.confirm': '削除を確認',
  'setups.edit.delete.warning':
    '「{name}」を削除すると、セットアップが完全に削除され、関連するトレードからも解除されます。この操作は元に戻せません。',
  'setups.edit.delete.success': 'セットアップ「{name}」を削除しました',
  'setups.edit.delete.error': 'セットアップを削除できませんでした',
  'setups.edit.success': 'Setup "{name}" updated successfully',
  'setups.edit.error.failed': 'Failed to update setup',
  'setups.view.compare.empty-submessage':
    'Choose two setup cards from the overview to build a side-by-side report.',
  'setups.view.compare.reason.higher.total-r': '合計Rが高い',
  'setups.view.compare.reason.lower.total-r': '合計Rが低い',
  'setups.view.compare.reason.similar.total-r': '合計Rが同程度',

  'setups.guide.create-new-setup.title': '新しいセットアップを作成',
  'setups.guide.create-new-setup.description':
    '別のプレイブックを追加するときは新規セットアップを使います。モーダルで詳細、リンクノート、ルールを設定できます。',
  'setups.guide.detail-intro.title': 'これはセットアップページです',
  'setups.guide.detail-intro.description':
    'セットアップページは1つのプレイブックに焦点を当て、成績チャート、コンテキスト、参考資料、操作、実行ルールをまとめます。',
  'setups.guide.detail-actions.title': 'セットアップ操作',
  'setups.guide.detail-actions.description':
    'これらのボタンで関連トレードを開くか、詳細、リンクノート、画像、プレイブックルールを編集します。',
  'setups.guide.empty.create-setup.title': '新規セットアップから開始',
  'setups.guide.empty.create-setup.description':
    'まずセットアップを1つ作成します。作成後、このガイドは通常の案内を続けます。',

  'setups.guide.intro.title': 'Setups へようこそ',
  'setups.guide.intro.description':
    'このビューでは、セットアップのプレイブック、関連トレード、ノート、スクリーンショット、ルールを1か所にまとめます。',
  'setups.guide.view-tabs.title': 'セットアップ表示を切り替え',
  'setups.guide.view-tabs.description':
    '十分なセットアップがある場合、このタブで概要、ペア、比較フローを切り替えます。',
  'setups.guide.overview-chart.title': '成績ランキング',
  'setups.guide.overview-chart.description':
    '概要チャートは選択した指標でセットアップを並べます。右上のコントロールで指標を切り替えたり、特定のセットアップに絞り込めます。',
  'setups.guide.tag-filter.title': 'セットアップを絞り込む',
  'setups.guide.tag-filter.description':
    'セットアップのタグまたは方向でカード、チャート、ペア、比較候補を絞り込みます。各グループ内は OR、タグと方向の間は AND で適用されます。',
  'setups.guide.setup-cards.title': 'セットアップカード',
  'setups.guide.setup-cards.description':
    'カードは主要指標、状態、最終取引日、小さな成績トレンドで各セットアップを要約します。',
  'setups.guide.open-detail.title': 'セットアップページを開く',
  'setups.guide.open-detail.description':
    'セットアップカードを開き、チャート、コンテキスト、プレイブック資料、実行ルールを含む専用ページを確認します。',
  'setups.guide.detail-performance.title': '詳細成績',
  'setups.guide.detail-performance.description':
    'Performance タブでは、P&L、勝率、期待値、ドローダウンなどのチャートと主要指標を時系列で確認できます。',
  'setups.guide.detail-context.title': 'セットアップコンテキスト',
  'setups.guide.detail-context.description':
    'このパネルは健康度、注意項目、リンクノート、スクリーンショットを手元にまとめます。',
  'setups.guide.detail-playbook.title': 'プレイブックノート',
  'setups.guide.detail-playbook.description':
    'プレイブック領域はリンクノートをプレビューします。Markdown、画像、Excalidraw、任意の参考資料を使えます。',
  'setups.guide.detail-rules.title': '実行ルール',
  'setups.guide.detail-rules.description':
    'ルールは好条件、エントリー、リスク、避けるミスの構造化チェックリストです。',
  'setups.guide.finish.title': 'Setups ガイド完了',
  'setups.guide.finish.description':
    '概要、ペア、比較、個別セットアップページの主要画面を確認しました。',

  'setups.guide.pairs-mode.title': 'セットアップペアを開く',
  'setups.guide.pairs-mode.description':
    'ペアを開き、比較に十分な共有トレードがある組み合わせを確認します。',
  'setups.guide.pairs-chart.title': 'ペアランキング',
  'setups.guide.pairs-chart.description':
    'ペアモードは一緒に良くまたは悪く機能する可能性がある組み合わせを強調します。バーをクリックすると、その組み合わせの詳しい洞察を開けます。',

  'setups.guide.compare-mode.title': '比較モードを開始',
  'setups.guide.compare-mode.description':
    '比較モードでは2つのセットアップカードを選んで横並びで確認できます。',
  'setups.guide.compare-select.title': '2つのセットアップを選択',
  'setups.guide.compare-select.description':
    '2つのカードを選択して比較ページを開きます。',
  'setups.guide.compare-summary.title': 'これは比較ページです',
  'setups.guide.compare-summary.description':
    'このページは2つのセットアップを並べて比較します。上部のサマリー行には勝者、期待値エッジ、信頼度、優位性の理由が表示されます。',
  'setups.guide.compare-body.title': '比較サマリー行',
  'setups.guide.compare-body.description':
    '上部の行は、勝者、期待値エッジ、信頼度、優位性の理由をまとめます。',
  'setups.guide.compare-details.title': '比較詳細',
  'setups.guide.compare-details.description':
    '指標表と累積チャートで2つのセットアップの違いを理解します。',
  'setups.guide.detail-execution-gap.title': '実行ギャップ分析',
  'setups.guide.detail-execution-gap.description':
    'ミストレードやバックテストがある場合、このタブで実行済みの成果と逃した機会または基準を比較します。',
  'setups.guide.back-to-overview.title': 'カードに戻る',
  'setups.guide.back-to-overview.description':
    '比較が終わったらセットアップカードに戻ります。',

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
  'setups.view.detail.performance.drawdown': 'ドローダウン',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',
  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Edit linked notes',

  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': 'ライブR',
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
  'setups.view.detail.brief.no-screenshots':
    'リンクされたスクリーンショットはまだありません。',
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
  'media.viewer.mute-video': '動画をミュート',
  'media.viewer.unmute-video': '動画のミュートを解除',
  'media.viewer.volume': '音量',

  'imageGallery.empty.error.title': 'ギャラリーを利用できません',
  'imageGallery.empty.no-images.title': 'まだメディアがありません',
  'imageGallery.empty.no-images.description':
    'トレードやレビューノートに添付した画像、GIF、動画、YouTubeリンクがここに自動的に表示されます。',
  'imageGallery.empty.no-results.title':
    'このフィルターに一致するメディアはありません',
  'imageGallery.empty.no-results.description':
    'アクティブなフィルターを解除するか日付範囲を広げて、ギャラリーの項目を増やしてください。',
  'imageGallery.empty.no-source.title': 'このソースにはメディアがありません',
  'imageGallery.empty.no-source.description':
    'このソースにはギャラリーの項目がまだありません。すべてのメディアに戻るか、別のソースを選んでください。',
  'imageGallery.empty.action.clear-filters': 'フィルターをクリア',
  'imageGallery.empty.action.show-all': 'すべてのメディアを表示',
  'imageGallery.open-source': 'ノートを開く',
  'imageGallery.image-alt': '{date} の {source} メディア',
  'imageGallery.annotation.reviewed': 'レビュー済み',
  'imageGallery.annotation.unreviewed': '未レビュー',
  'imageGallery.annotation.tag': 'タグ',

  'imageGallery.annotation.editor-title': 'メディアに注釈を付ける',
  'imageGallery.annotation.editor-title-with-file': '{fileName} に注釈を付ける',
  'imageGallery.annotation.tags': 'タグ',
  'imageGallery.annotation.tags-placeholder':
    'ブレイクアウト、A+ セットアップ、ミス',
  'imageGallery.annotation.notes': 'メモ',
  'imageGallery.annotation.notes-placeholder':
    '未来の自分はこのチャートから何を学ぶべきですか？',
  'imageGallery.annotation.error.save-failed':
    'メディアの注釈を保存できませんでした。',
  'imageGallery.annotation.error.load-failed':
    'メディアの注釈を読み込めませんでした。',
  'imageGallery.annotation.saving': '保存中...',
  'command.replay-current-view-guide': '現在のビューのガイドを再生',

  
  
  
  'tradelog.guide.gallery-source-sort.title': 'メディアのソースと順序を選ぶ',
  'tradelog.guide.gallery-source-sort.description':
    'ソースで全メディア、トレードの添付、レビューノートのメディアに絞れます。並び替えで新しい、古い、成績の良い、悪いトレードから確認できます。',
  'tradelog.guide.gallery-size.title': 'ギャラリーのプレビューサイズを調整する',
  'tradelog.guide.gallery-size.description':
    'これらのサイズボタンで、重要なチャート詳細を切り落とさずに、コンパクトな確認と大きめのチャートプレビューを切り替えます。',
  'tradelog.guide.gallery-filters.title': '同じ入口からギャラリーを絞り込む',
  'tradelog.guide.gallery-filters.description':
    'フィルターメニューはここでも同じように使えます。ギャラリーモードでは、注釈ステータスやメディアタグなどのメディアフィルターを含む「ギャラリー」セクションも表示されます。',
  'tradelog.guide.gallery-grid.title': 'メディアを開いて詳しく確認する',
  'tradelog.guide.gallery-grid.description':
    '各カードはチャートを邪魔せず、トレードとレビューのコンテキストをコンパクトに表示します。任意のカードをクリックすると全画面で開きます。',
  'tradelog.guide.gallery-fullscreen-actions.title':
    '全画面からメディアに注釈を付ける',
  'tradelog.guide.gallery-fullscreen-actions.description':
    '項目を十分大きく表示した状態で、タグを使ってメディア単位のタグとメモを追加します。ノートを開くと元のトレードまたはレビューノートに戻ります。',
  'tradelog.guide.gallery-open-annotation.title': '注釈パネルを開く',
  'tradelog.guide.gallery-open-annotation.description':
    'タグをクリックして、この特定のメディアに注釈を付けます。メディアタグとメモは添付ファイルを説明するもので、トレード全体ではありません。',
  'tradelog.guide.gallery-annotation-panel.title':
    'メディアタグとメモを追加する',
  'tradelog.guide.gallery-annotation-panel.description':
    '流動性スイープや失敗したブレイクアウトなど、チャート固有の考えにはメディアタグを使い、覚えておきたい市場構造の文脈にはメモを使います。',
  'tradelog.guide.gallery-finish.title':
    'トレードログの2つのモードを確認しました',
  'tradelog.guide.gallery-finish.description':
    '表と一括操作が必要なときはトレードを使います。ジャーナル全体の画像、GIF、動画、YouTubeリンク、市場構造、チャート注釈を確認したいときはギャラリーを使います。',
  'account.prop-challenge.prefill.heading-link': 'Prefill from your firm',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} more, rules prefilled with PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, rules prefilled with PRO',
  'account.prop-challenge.prefill.match':
    'We have {firm}: {count} challenges with rules ready',
  'account.prop-challenge.rules.empty':
    'ルールはまだ追加されていません。「ルールを追加」からこのフェーズを設定してください。',
  'trade.validation.fx-rate-number':
    '為替レートは有効な数値である必要があります。',
  'trade.validation.fx-rate-positive':
    '為替レートは0より大きい必要があります。',
  'dashboard.conversion.using-manual-rate':
    '{count} {tradeLabel}に手動為替レートを使用',
  'dashboard.conversion.partial-warning':
    '⚠ {currencies}のコスト/リスクは換算できず除外されています',
  'trade-sync.providers.title': 'トレード同期',

  'trade-sync.tradovate.pending-acks': '{count} 件のローカル ACK が保留中',

  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Rithmic のトレードをクラウドで同期し、この保管庫に反映します。',
  'trade-sync.rithmic.plugin-sync-description':
    'Journalit.co で Rithmic を接続し、ここで同期すると最新の Rithmic の活動がこの保管庫に書き込まれます。',
  'trade-sync.rithmic.status-failed': 'Rithmic の状態を読み込めません。',
  'trade-sync.rithmic.status.connecting': '接続中',
  'trade-sync.rithmic.status.paused': '一時停止中',
  'trade-sync.rithmic.status.waiting-for-accounts': '口座を待っています',
  'trade-sync.rithmic.status.reauthorization-required':
    'Journalit.co での再認証が必要です',
  'trade-sync.rithmic.status.error': '接続エラー',
  'trade-sync.rithmic.no-connections':
    'Journalit.co で Rithmic アカウントを接続すると、ここで同期できます。',
  'trade-sync.rithmic.connect': '接続',
  'trade-sync.rithmic.manage': 'Journalit.co で管理',
  'trade-sync.rithmic.system': 'Rithmic システム',
  'trade-sync.rithmic.accounts': 'アカウント',
  'trade-sync.rithmic.last-sync': '最終同期',
  'trade-sync.rithmic.never': 'なし',
  'trade-sync.rithmic.job.running': '同期を実行中…',
  'trade-sync.rithmic.job.last': '直近のジョブ: {status}',
  'trade-sync.job.status.queued': 'キュー待ち',
  'trade-sync.job.status.running': '実行中',
  'trade-sync.job.status.succeeded': '成功',
  'trade-sync.job.status.partial': '部分的',
  'trade-sync.job.status.failed': '失敗',
  'trade-sync.job.status.cancelled': 'キャンセル',
  'trade-sync.job.status.unknown': '不明',
  'trade-sync.rithmic.sync-to-vault': '同期',
  'trade-sync.rithmic.syncing': '同期中…',
  'trade-sync.rithmic.mapping-required':
    '同期する Rithmic アカウントごとにローカルの保管庫アカウントを選択してください。',
  'trade-sync.rithmic.sync-complete-connection':
    '{connection} の同期が完了しました。',
  'trade-sync.rithmic.sync-partial-connection':
    '{connection} の同期は完了しましたが、問題があります。',
  'trade-sync.rithmic.sync-all': 'すべて同期',
  'trade-sync.rithmic.sync-all-complete':
    '{total} 件中 {succeeded} 件の Rithmic 接続を同期しました。',
  'trade-sync.rithmic.sync-all-partial':
    '{total} 件中 {succeeded} 件の Rithmic 接続を同期しました。問題のある接続を確認してください。',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic はアクティブなセッションを 1 つしか許可しません。この Rithmic ログインを使用している R|Trader や NinjaTrader などを閉じてください。',
  'trade-sync.rithmic.error.auto-retry': 'Journalit が自動的に再試行します。',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic が保存された認証情報を拒否しました。Journalit.co で更新して再試行してください。',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic では R|Trader でマーケットデータ契約への署名が必要です。署名後に再試行してください。',
  'trade-sync.rithmic.error.disabled':
    'この接続では Rithmic の同期が無効です。Journalit.co で管理してください。',
  'trade-sync.rithmic.error.sync-failed':
    'Rithmic の同期に失敗しました。Journalit.co で接続を確認して再試行してください。',
  'trade-sync.broker.mapping-unsaved-hint':
    'マッピングは同期時に保存されます。',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    '未保存のアカウント変更があります。その接続を同期すると保存されます。',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    '同期する各アカウントに Journalit アカウントを先に選択してください。',
  'trade-sync.broker.sync-all-blocked.running-job': '同期はすでに実行中です。',
  'trade-sync.broker.sync-all-blocked.not-ready':
    '同期できる接続がありません。',
  'trade-sync.rithmic.connect-another': '別の Rithmic アカウントを接続',
  'trade-sync.rithmic.error.sync-failed-detail':
    'Rithmic の同期に失敗しました: {message}',
  'notice.error.canonical-trade-type-change':
    'ブローカー同期済みのトレードは別のトレード種別に変更できません。',
  'trade-sync.import.account.conflict-repair':
    'canonicalTradeId が重複するノートが見つかりました。1つを残し、重複ノートから canonicalTradeId を削除するか、そのノートを削除してください。ファイル名の変更では競合は解消されません。',
  'setups.create.field.tags': 'タグ',
  'setups.create.placeholder.tags': 'モメンタム、ブレイクアウト、朝',
  'setups.view.overview.tag-filter.aria': 'セットアップを絞り込む',
  'setups.view.overview.tag-filter.reset': 'リセット',
  'setups.view.overview.tag-filter.untagged': 'タグなし',
  'setups.view.overview.tag-filter.empty':
    'これらのフィルターに一致するセットアップはありません',
  'setups.view.overview.tag-filter.empty-submessage':
    'フィルターを調整または解除して、さらにセットアップを表示します。',

  'setups.view.tags': 'タグ',
  'setups.create.error.tag-save-failed':
    'タグをグローバルタグ一覧に保存できませんでした。',
  'settings.customization.options.confirm.remove-tag-message':
    'グローバルタグ「{option}」を削除しますか？すべてのJournalitトレードおよびセットアップノートから削除されます。',
  'settings.customization.options.confirm.reset-tag-message':
    'グローバルタグ一覧と色を既定値に戻しますか？トレードおよびセットアップノートに割り当て済みのタグはノート内に残ります。',
  'home.mode.overview': '概要',
  'home.mode.dashboard': 'ダッシュボード',
  'home.mode.aria': 'ホームモードを切り替え',
  'home.filters.period': '期間',
  'home.filters.trade-type': 'トレードタイプ',
  'home.filters.accounts': '口座',
  'home.filters.back': '戻る',
  'filter.reset': 'フィルターをリセット',
  'filter.menu.title': 'フィルター条件',
  'filter.menu.accounts': '口座',
  'filter.menu.tickers': 'ティッカー',
  'filter.menu.setups': 'セットアップ',
  'filter.menu.tags': 'タグ',
  'filter.menu.mistakes': 'ミス',
  'filter.menu.trade-type': 'トレード種別',
  'filter.menu.status': 'ステータス',
  'filter.menu.direction': '方向',
  'filter.menu.review-status': 'レビュー状況',
  'filter.menu.status.cancelled': 'キャンセル済み',
  'filter.menu.included-count': '{count} 件を含む',
  'filter.menu.excluded-count': '{count} 件を除外',
  'filter.menu.search': '検索',
  'filter.menu.no-matches': '一致なし',
  'filter.menu.no-options': 'まだフィルターできる項目がありません',
  'filter.menu.clear': 'クリア',
  'filter.menu.match.label': '一致条件',
  'filter.menu.match.any': 'いずれか',
  'filter.menu.match.all': 'すべて',
  'filter.menu.match.only': 'これらのみ',
  'filter.menu.match.exact': '完全一致',
  'filter.menu.match.hint.any': '選択した値を1つ以上含むトレード。',
  'filter.menu.match.hint.all':
    '選択した値をすべて含むトレード。他の値があっても構いません。',
  'filter.menu.match.hint.only': 'すべての値が選択した値に含まれるトレード。',
  'filter.menu.match.hint.exact': '選択した値とちょうど一致するトレード。',
  'filter.menu.match.no-value-any-only': '「いずれか」でのみ使用可能',
  'filter.menu.exclude-value': '{label} を除外',
  'filter.menu.match.badge.all': 'すべて',
  'filter.menu.match.badge.only': 'のみ',
  'filter.menu.match.badge.exact': '完全',
  'home.guide.modes.title': '最後にもう1つ：ダッシュボード',
  'home.guide.modes.description':
    '概要とダッシュボードはこのページを共有しています。今すぐダッシュボードに切り替えて、パフォーマンス統計の短いツアーを続けましょう。',
  'home.guide.whats-new.mode.title': '1つのホーム、2つのモード',
  'home.guide.whats-new.mode.description':
    '概要とダッシュボードが同じページになりました。レイアウトやスクロール位置を保ったまま切り替えられます。',
  'home.guide.whats-new.filters.title': 'ホームフィルターを1か所に集約',
  'home.guide.whats-new.filters.description':
    'フィルターボタンから、期間、トレードタイプ、口座をコンパクトな階層メニューで選択できます。',
  'home.guide.whats-new.done.title': '作業コンテキストを維持',
  'home.guide.whats-new.done.description':
    '個人ウィジェットには概要、詳しい分析にはダッシュボードを使います。各モードは独自のフィルターとレイアウトを保持します。',
  'home.widget.current-streak.description': '取引とレビューのストリークを追跡',

  'home.widget.streak.kind.trade-outcome': 'トレード結果',
  'home.widget.streak.kind.trade-review': 'トレードレビュー',
  'home.widget.streak.kind.drc-review': 'DRCレビュー',
  'home.widget.streak.kind.weekly-review': '週間レビュー',
  'home.widget.streak.kind.monthly-review': '月間レビュー',
  'home.widget.streak.configure': 'ストリークの種類を選択',
  'home.widget.streak.configure-aria': '{kind}ストリークを設定',
  'home.widget.streak.no-review-streak': 'アクティブなレビューストリークなし',
  'home.widget.streak.start-reviewing': 'レビューしてストリークを始めましょう',
  'home.widget.streak.keep-reviewing': 'レビューを続けて維持しましょう',
  'home.widget.streak.reviewed-trades-in-a-row.one': '連続レビューした取引',
  'home.widget.streak.reviewed-trades-in-a-row.few': '連続レビューした取引',
  'home.widget.streak.reviewed-trades-in-a-row.many': '連続レビューした取引',
  'home.widget.streak.reviewed-trades-in-a-row.other': '連続レビューした取引',
  'home.widget.streak.reviewed-days-in-a-row.one': '連続レビューした日数',
  'home.widget.streak.reviewed-days-in-a-row.few': '連続レビューした日数',
  'home.widget.streak.reviewed-days-in-a-row.many': '連続レビューした日数',
  'home.widget.streak.reviewed-days-in-a-row.other': '連続レビューした日数',
  'home.widget.streak.reviewed-weeks-in-a-row.one': '連続レビューした週数',
  'home.widget.streak.reviewed-weeks-in-a-row.few': '連続レビューした週数',
  'home.widget.streak.reviewed-weeks-in-a-row.many': '連続レビューした週数',
  'home.widget.streak.reviewed-weeks-in-a-row.other': '連続レビューした週数',
  'home.widget.streak.reviewed-months-in-a-row.one': '連続レビューした月数',
  'home.widget.streak.reviewed-months-in-a-row.few': '連続レビューした月数',
  'home.widget.streak.reviewed-months-in-a-row.many': '連続レビューした月数',
  'home.widget.streak.reviewed-months-in-a-row.other': '連続レビューした月数',
  'home.widget.streak.missed-trades.one':
    '前回のレビューから{count}件の取引を逃しています',
  'home.widget.streak.missed-trades.few':
    '前回のレビューから{count}件の取引を逃しています',
  'home.widget.streak.missed-trades.many':
    '前回のレビューから{count}件の取引を逃しています',
  'home.widget.streak.missed-trades.other':
    '前回のレビューから{count}件の取引を逃しています',
  'home.widget.streak.missed-days.one':
    '前回のレビューから{count}日を逃しています',
  'home.widget.streak.missed-days.few':
    '前回のレビューから{count}日を逃しています',
  'home.widget.streak.missed-days.many':
    '前回のレビューから{count}日を逃しています',
  'home.widget.streak.missed-days.other':
    '前回のレビューから{count}日を逃しています',
  'home.widget.streak.missed-weeks.one':
    '前回のレビューから{count}週を逃しています',
  'home.widget.streak.missed-weeks.few':
    '前回のレビューから{count}週を逃しています',
  'home.widget.streak.missed-weeks.many':
    '前回のレビューから{count}週を逃しています',
  'home.widget.streak.missed-weeks.other':
    '前回のレビューから{count}週を逃しています',
  'home.widget.streak.missed-months.one':
    '前回のレビューから{count}か月を逃しています',
  'home.widget.streak.missed-months.few':
    '前回のレビューから{count}か月を逃しています',
  'home.widget.streak.missed-months.many':
    '前回のレビューから{count}か月を逃しています',
  'home.widget.streak.missed-months.other':
    '前回のレビューから{count}か月を逃しています',
  'account-dashboard.title': '口座',
  'home.quick-links.trading-dashboard': 'ダッシュボード',
  'home.quick-links.account-dashboard': '口座',
  'navigation.items.nav-dashboard': 'ダッシュボード',
  'navigation.items.nav-account-dashboard': '口座',

  'settings.general.home-background-dashboard': 'ダッシュボードにも背景を表示',
  'settings.general.home-background-dashboard-desc':
    'ダッシュボードモードでも同じ背景画像を使用します。',
  'settings.general.home-background-dashboard-aria':
    'ホームの背景をダッシュボードに表示',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.second': 'SS',
  'settings.general.show-seconds': '取引時刻に秒を表示',
  'settings.general.show-seconds-desc':
    '取引のエントリー時刻と決済時刻の入力時に秒を表示します。',
  'settings.general.show-seconds-aria': '取引時刻に秒を表示',
  'account.prop-challenge.summary.status.payout_ready': 'Payout ready',
  'account.prop-challenge.ribbon.passed': '{phase} 合格',
  'account.prop-challenge.ribbon.failed': '{phase} 不合格',
  'account.prop-challenge.ribbon.action.advance': '{phase}へ進む',
  'account.prop-challenge.ribbon.action.advance-short': '進む',
  'account.prop-challenge.ribbon.action.mark-passed': '合格にする',
  'account.prop-challenge.ribbon.action.archive': 'アーカイブ',
  'account.prop-challenge.actions.stale':
    'このチャレンジは別の場所で更新されました。確認してからもう一度お試しください。',
  'account.prop-challenge.confirm.reopen':
    '{account}を再開しますか？チャレンジ「{challenge}」は{phase}に戻ります。',
  'account.prop-challenge.confirm.fail':
    '{account}を失敗にしますか？チャレンジ「{challenge}」は{phase}で終了します。',
  'account.prop-challenge.confirm.archive-failed':
    '{account}をアーカイブしますか？チャレンジ「{challenge}」は失敗しました。口座はアーカイブに移動します。',
  'account.prop-challenge.confirm.archive-passed':
    '{account}をアーカイブしますか？チャレンジ「{challenge}」は合格しました。口座はアーカイブに移動します。',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → チャレンジ合格',
  'account.prop-challenge.ribbon.action.record-payout': '出金を記録',
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
  'account.prop-challenge.payout.timezone-invalid':
    '既知のタイムゾーンではありません。',
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

  'account.prop-challenge.ledger.help.open': '{rule}について',
  'account.prop-challenge.rule.help.target-amount':
    '固定目標は口座通貨、割合目標はこのフェーズの開始残高を基準にします。進捗は日次利益計上上限を適用した残高増加で計算し、含み損益は除外します。',
  'account.prop-challenge.rule.help.credit-withdrawals':
    '記録済みの出金総額を固定目標の進捗に加算します。残高や出金資格は変更しません。',
  'account.prop-challenge.rule.help.drawdown-amount':
    '開始残高（固定）または実現残高の最高値（追従）からの通貨額での距離です。下限に触れると違反です。',
  'account.prop-challenge.rule.help.drawdown-mode':
    '固定は下限を維持します。EOD追従は取引日終値の最高値、日中追従は記録された実現残高の取引を追います。含み損益込みの資産は追いません。',
  'account.prop-challenge.rule.help.lock-balance':
    '追従ドローダウン下限の上限であり、開始条件の残高ではありません。この残高で下限の上昇が止まります。空欄は上限なしです。',
  'account.prop-challenge.rule.help.daily-loss-amount':
    '取引日内の累積実現取引純損失の最大許容通貨額です。日中最高値からの下落ではありません。上限に触れると違反です。',
  'account.prop-challenge.rule.help.breach-action':
    '口座失敗では過去の違反が有効なままです。次のセッションまでの停止は現在の取引日のみ対象で、過去の違反は履歴に残ります。',
  'account.prop-challenge.rule.help.daily-loss-model':
    '固定上限、利益閾値到達後の恒久変更、最高EOD利益による調整、前日EOD利益階層から選びます。条件付き項目で選択したモデルを設定します。',
  'account.prop-challenge.rule.help.profit-basis':
    '累積取引利益は資金移動を除外します。現在の口座利益は資金移動を含み、出金で減少します。どちらも過去の取引日終値を使います。',
  'account.prop-challenge.rule.help.position-model':
    '取引ごとの固定上限、利益ステップごとに1枚追加、または明示的な利益階層を選びます。調整には過去の取引日終値を使います。',
  'account.prop-challenge.rule.help.max-contracts':
    '任意のマイクロ換算後の取引ごとの最大数量です。複数取引の合計エクスポージャーではありません。上限超過は違反です。',
  'account.prop-challenge.rule.help.initial-contracts':
    '日末の確定利益で上限が増える前の、取引ごとの初期契約枚数上限です。',
  'account.prop-challenge.rule.help.maximum-contracts':
    '利益による契約枚数増加の任意の上限です。空欄は追加上限なしです。',
  'account.prop-challenge.rule.help.daily-profit':
    '達成日に必要な実現取引純損益の通貨額です。利益、損失、費用を合計します。含み益や資金移動は対象外です。',
  'account.prop-challenge.rule.help.consistency-cushion':
    '最良日の最大比率にパーセントポイントで加算します。30%＋5ポイントなら35%まで許可します。空欄は余裕なしです。',
  'account.prop-challenge.rule.help.daily-profit-cap':
    'フェーズ目標に計上する各取引日の利益の通貨額上限です。超過分は残高に残り、損失は全額計上します。',
  'account.prop-challenge.rule.help.live-review':
    '審査資格のために1取引日で必要な実現純利益です。フェーズの自動移行やライブ口座の付与は行いません。',
  'account.prop-challenge.ledger.help.profit_target':
    '設定したフェーズ残高増加に達すると合格します。利益計上上限と任意の出金加算が進捗に影響し、含み益は計上しません。',
  'account.prop-challenge.ledger.help.profit_target.example':
    'この口座は利益 {target} が必要です。これまでに {current}、残り {remaining}。',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    '目標達成: {current} / {target}。',
  'account.prop-challenge.ledger.help.drawdown.static':
    '開始残高よりどれだけ下がってよいかの上限です。下限は動きません。',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'この口座の下限は {floor} です。残高はそれを上回る必要があります。上限 {limit} のうち {buffer} が残っています。',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    '下限は最高の終日残高に追随し、上がるだけで、会社のロック水準で固定されます。',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    '現在の下限は {floor}（最高終値 − {limit}）で、より高い終値のたびに上がります。残り {buffer}。',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    'フロアは含み益を含む常時の最高残高に追随します。Journalitは決済済みトレードしか見ないため、このフロアは各決済後の最高残高に追随し、保有中に達したピークは数えません。プロップファームの数値を確認してください。',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    '現在の下限は {floor}（決済後の最良残高 − {limit}）です。残り {buffer}。会社のライブ数値の方が厳しい場合があります。',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    '1取引日に失ってよい上限です。到達するとフェーズ失敗、または次セッションまで停止します（会社による）。',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    '今日: 日次上限 {limit} のうち {used} 損失、残り {left}。',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    '各日の利益の一部だけが目標に算入されます。上限超は手元に残りますが数えません。',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    '1日の利益のうち {cap} だけが算入されます。上限を超えて得た {excluded} はこれまで算入されません。',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'この利益以上の取引日が1日あれば、ライブ口座審査の対象になります。',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    '{trigger} 以上の日が1日あれば資格あり。これまでの最良日は {bestDay}。',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    'このフェーズで必要な異なる取引開始日の数です。未決済の取引も含みます。暦日の午前0時でなく、設定した取引日区切りを使います。',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '取引日 {current} / {target} 完了、残り {remaining}。',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'このフェーズの最低日次実現純利益に達した必要日数です。記録した出金でこのフェーズ全体のルールはリセットしません。',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{minimum} 以上で終えた日 {current} / {target}、残り {remaining}。',
  'account.prop-challenge.ledger.help.consistency':
    '最良の1日がフェーズ利益全体に占める割合の上限です。他の日で稼いで直し、損では直しません。',
  'account.prop-challenge.ledger.help.consistency.example':
    '最良日 {bestDay} は総利益 {total} の {share}。{maximum} に収めるには総利益が {goal} 必要です。',
  'account.prop-challenge.ledger.help.consistency.example-done':
    '最良日 {bestDay} は総利益の {share} で、上限 {maximum} 以内です。',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'まだ利益がないため、比較する最良日はありません。',
  'account.prop-challenge.ledger.help.max_position_size':
    '1つのポジションで許可される最大契約数。Journalitは各トレードのサイズを確認します。利益が増えると上限を引き上げるファームもあります。',
  'account.prop-challenge.ledger.help.max_position_size.example':
    '現在は1トレードあたり最大{maximum}契約。これまでの最大トレードは{current}。',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    '現在の出金サイクルの取引日です。承認後にカウントがリセットされます。',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    'このサイクルの取引日 {current} / {target}、残り {remaining}。',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'このサイクルで会社の最低日次利益以上で終えた取引日です。',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    'このサイクルで {minimum} 以上の日 {current} / {target}、残り {remaining}。',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'サイクル開始後の利益がこの金額に達してから申請できます。',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    'このサイクルの獲得 {current}、必要額は {target}。',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    '申請時の残高がこの水準以上である必要があります。',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    '残高 {current}。少なくとも {target} 必要です。',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    '初回出金の後、次の申請前に新しいサイクルは利益である必要があります。',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'サイクル利益は {current}。0 を超える必要があります。',
  'account.prop-challenge.ledger.help.payout.consistency':
    '最良日がサイクル利益に占める割合の上限です。',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    '最良日{bestDay}はサイクル利益{total}の{share}です。{maximum}に収めるにはサイクル利益が{goal}に達する必要があります。',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    '最良日{bestDay}はサイクル利益の{share}で、上限{maximum}以内です。',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'サイクル利益がまだないため、比較する最良日はありません。',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    '会社が受け付ける最小出金額です。利用可能額が先にそれに達する必要があります。',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '利用可能 {current}。会社の最低申請額は {target}。',
  'account.prop-challenge.ledger.help.payout.payout_count':
    'このステージで許可される出金回数です。枠を使い切るとステージ完了です。',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    'このステージの出金 {current} / {target} を使用済み。',
  'account.prop-challenge.ledger.help.payout.request_window':
    '申請はこれらの曜日のみ、会社のタイムゾーンで受け付けます。',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    '今日は {today}。申請は {days}（{timeZone}）。',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'サイクル最初のトレードからの経過時間がこれに達してから申請できます。',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    'サイクル最初のトレードから {current} / {target} 時間。',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'このサイクルだけでなく、資金化フェーズ全体の適格日数です。達すると出金が解除されます。',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    'フェーズ全体の適格日 {current} / {target}。',
  
  'account.merge.challenge.move-earlier': '{account} を前へ',
  'account.merge.challenge.move-later': '{account} を後ろへ',
  'account.merge.warning.use-profile-balance': 'ファームの残高を使用',
  'account.merge.warning.edit-phases': 'フェーズを編集',
  'account.merge.title': 'チャレンジの設定',
  'account.merge.loading': '読み込み中...',
  'account.merge.step.accounts': 'アカウント',
  'account.merge.step.phases': 'フェーズ',
  'account.merge.step.review': '確認',
  'account.merge.accounts.title': '統合するアカウント',
  'account.merge.accounts.show-archived': 'アーカイブ済みを表示',
  'account.merge.accounts.empty': '対象のアカウントがありません',
  'account.merge.target.title': '統合先アカウント',
  'account.merge.target.keep': 'そのまま使う',
  'account.merge.target.new': '新しい名前',
  'account.merge.phase.name': 'フェーズ名',
  'account.merge.phase.status': 'ステータス',
  'account.merge.phase.started': '開始',
  'account.merge.phase.completed': '終了',
  'account.merge.phase.no-rules': 'なし',
  'account.merge.review.notes': '移動したトレード',
  'account.merge.review.identities': 'ブローカー口座',
  'account.merge.warning.trade-outside-window': 'フェーズ期間外のトレード',
  'account.merge.warning.identity-shared': '複数のアカウントが同じ識別子を使用',
  'account.merge.warning.copy-trading-dropped':
    'コピートレード期間を破棄しました',
  'account.merge.error.too-few-sources': 'アカウントを2つ以上選んでください。',
  'account.merge.error.duplicate-source': '同じアカウントが重複しています。',
  'account.merge.error.target-exists': 'その名前は別のアカウントのものです。',
  'account.merge.error.currency-mismatch': 'アカウントの通貨が一致しません。',
  'account.merge.error.timeline-not-monotonic':
    'フェーズの開始時刻は昇順である必要があります。',
  'account.merge.error.invalid-override':
    'このフェーズの日付を確認してください。',
  'account.merge.error.source-missing':
    '設定が保存されていないアカウントがあります。',
  'account.merge.error.unknown': '統合に失敗しました。',
  'account.merge.action.merge': '統合',
  'account.merge.action.undo': '元に戻す',
  'account.merge.action.looks-right': '問題なし',
  'account.merge.action.delete': '旧アカウントを削除',
  'account.merge.notice.converted': 'チャレンジに変換済み',
  'account.merge.summary.intro': 'チャレンジと一致しているか確認してください:',
  'account.merge.summary.phases': 'フェーズ: {phases}',
  'account.merge.summary.current': '現在 {phase}（{stage}）、{date} に開始',
  'account.merge.summary.current-stage': '現在 {phase}、{date} に開始',
  'account.merge.summary.trades':
    '{total} 件中 {counted} 件のトレードがチャレンジに含まれます',
  'account.merge.summary.trades-missing':
    '{total} 件中 {counted} 件のトレードがチャレンジに含まれます。残りはどのフェーズの期間にも入っていません。',
  'account.merge.summary.rules': '{phase} のルール: {rules}',
  'account.merge.summary.no-rules':
    '{phase} にはまだルールがありません。口座を編集でファームのルールを追加してください。',
  'account.merge.notice.title': '{accounts} から統合',
  'account.merge.notice.error': '操作に失敗しました。',
  'account.merge.undo.title': '統合を元に戻す',
  'account.merge.undo.message': '旧アカウントとそのトレードを復元します。',
  'account.merge.delete.title': '旧アカウントを削除',
  'account.merge.delete.message':
    'アーカイブ済みの旧アカウントを削除します。元に戻せません。',
  'command.open-legacy-challenge-onboarding': 'プロップチャレンジを設定',
  'account.merge.step.challenge': 'チャレンジ',
  'account.merge.action.convert': '変換',
  'account.merge.phase.apply-profile': 'ファームのルールを適用',
  'account.merge.challenge.accounts': '口座',
  'account.merge.challenge.order-hint': '最も古いフェーズを先頭に',
  'account.merge.challenge.single-hint': 'この口座は単独のチャレンジになります',
  'account.merge.phase.broker-accounts.one': '{count} 件のブローカー口座',
  'account.merge.phase.broker-accounts.few': '{count} 件のブローカー口座',
  'account.merge.phase.broker-accounts.many': '{count} 件のブローカー口座',
  'account.merge.phase.broker-accounts.other': '{count} 件のブローカー口座',
  'account.merge.review.phase-count.one': 'フェーズ',
  'account.merge.review.phase-count.few': 'フェーズ',
  'account.merge.review.phase-count.many': 'フェーズ',
  'account.merge.review.phase-count.other': 'フェーズ',
  'account.merge.phase.pending': '保留',
  'account.merge.phase.starts-after': '{phase} に合格すると開始',
  'account.merge.phase.pending-rules': 'ルール: {rules}',
  'account.merge.review.archived': 'アーカイブ',
  'account.merge.review.starts-after': '{phase} の後',
  'account.merge.review.since': '{date} から',
  'account.merge.sequence': 'チャレンジ {index} / {total}',
  'account.merge.warning.balance-differs':
    '開始残高がファームのルールと異なります',
  'account.merge.error.profile-phase-mismatch':
    'ファームのルールのフェーズより口座が多いです',
  'account.merge.error.profile-currency-mismatch':
    'ファームのルールはこれらの口座と異なる通貨を使用しています。',
  'account.merge.error.source-changed':
    'アカウントが変更されました。統合を再確認してください。',
  'account.merge.error.multiple-active-phases':
    'アクティブなままにできるのは最後の口座だけです。',
  'account.merge.error.copy-trading-overlap':
    'コピートレード期間が重複しています。先に1つ終了してください。',
  'onboarding.legacy-challenge.legend':
    '以前の各口座をどうするか選んでください。フェーズ1とファンデッドのように、フェーズごとに別の口座がありましたか？同じチャレンジに入れると、フェーズを持つ1つの口座になります。',
  'onboarding.legacy-challenge.assign.leave': '通常の口座のままにする',
  'onboarding.legacy-challenge.assign.own': 'チャレンジにする',
  'onboarding.legacy-challenge.assign.group': 'チャレンジ{letter}に追加',
  'onboarding.legacy-challenge.assign.new-group': '新しいチャレンジにまとめる…',
  'onboarding.legacy-challenge.action.continue': '続行',
  'onboarding.legacy-challenge.action.continue-count': '{count} 件を設定',
  'guide.action-step.dismiss': '今はしない',
  'guide.legacy-challenge.title': 'このアップデート以前の口座を設定',
  'guide.legacy-challenge.description':
    '以前の評価口座やファンデッド口座をチャレンジに変換します。設定ではフェーズと日付を順に案内し、最後に設定内容を表示するので確認できます。',
  'guide.legacy-challenge.action': '口座を設定',
  'onboarding.legacy-challenge.title': 'プロップチャレンジ',
  'onboarding.legacy-challenge.action.skip': 'スキップ',
  'onboarding.legacy-challenge.accounts.show-archived': 'アーカイブ済みを表示',
  'onboarding.legacy-challenge.accounts.empty': '設定する口座はありません',
  'onboarding.legacy-challenge.loading': '読み込み中...',
  'onboarding.legacy-challenge.suggested': '推奨',
  'onboarding.legacy-challenge.row.aria': '{account} の操作',
  'onboarding.legacy-challenge.status.combined': '統合済み',
  'onboarding.legacy-challenge.status.converted': '変換済み',
  'onboarding.legacy-challenge.entry.name': 'プロップチャレンジ',
  'onboarding.legacy-challenge.entry.desc':
    '既存の口座を統合または変換してチャレンジにします。',
  'onboarding.legacy-challenge.entry.action': '設定',

  'view.home': 'ホーム',
  'common.lose': '負け',

  'dashboard.conversion.requires-conversion':
    '複数通貨の損益チャートには為替レート換算が必要です。',

  'form.layout.guide-trigger-label': 'フォームをカスタマイズ',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'session-log.session-group.unplanned': '予定外 @ {time}',
  'session-mode.unplanned.name': '予定外セッション',
  'session-mode.unplanned.start': '予定外セッションを開始',
  'session-mode.unplanned.stop': 'セッションを終了',
  'session-mode.unplanned.badge': '予定外',
  'session-mode.unplanned.status.live': '{time} に開始 · 経過 {elapsed}',
  'session-mode.unplanned.ended.summary':
    '予定外セッション · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': '予定外セッションを開始する',
  'session-mode.unplanned.modal.description':
    '現在は予定したセッション時間外です。このセッションはデイリーレビューで予定外として記録されます。今トレードする理由を書いてください。',
  'session-mode.unplanned.modal.reason-label': '理由',
  'session-mode.unplanned.modal.reason-placeholder':
    '例: 14:00 の FOMC、午前セッションを逃した',
  'session-mode.unplanned.modal.reason-required':
    '開始前に理由を入力してください。',
  'session-mode.unplanned.notice.started': '予定外セッションを開始しました。',
  'session-mode.unplanned.notice.stopped': '予定外セッションを終了しました。',
  'session-mode.unplanned.notice.blocked-live':
    'すでにセッションが進行中です。',
  'session-mode.unplanned.notice.none-running':
    '進行中の予定外セッションはありません。',
  'session-mode.unplanned.notice.failed':
    '予定外セッションを更新できませんでした。詳細はコンソールを確認してください。',
  'calendar.aria.open-daily-review': '{date} の日次レビューを開く',
  'calendar.aria.open-weekly-review': '{date} の週次レビューを開く',
  'calendar.aria.open-monthly-review': '{date} の月次レビューを開く',
  'calendar.aria.open-quarterly-review': '{date} の四半期レビューを開く',
  'filter.menu.whats-new.open.title': 'フィルターが新しいメニューに',
  'filter.menu.whats-new.open.description':
    'すべてのフィルターが1つの階層メニューにまとまり、トレードを絞り込む新しい方法が2つ加わりました。開いて確認しましょう。',
  'filter.menu.whats-new.exclude.title': '不要なものを除外',
  'filter.menu.whats-new.exclude.description':
    '各値には ⊘ ボタンがあります。値を除外すると、その値を持つトレードは、ほかの条件に一致していても除かれます。',
  'filter.menu.whats-new.match.title': '複数の値の一致条件を選ぶ',
  'filter.menu.whats-new.match.description':
    '複数の値を選んだとき、トレードに「いずれか」「すべて」「これらのみ」「完全一致」のどれを求めるか選べます。タグ、セットアップ、ミス、カスタムフィールドにも同じ一致条件があります。',
  'filter.menu.whats-new.phases.title': 'チャレンジのフェーズで絞り込む',
  'filter.menu.whats-new.phases.description':
    '複数のフェーズがあるプロップ口座は、フェーズの一覧を開けます。口座全体ではなく、個別のフェーズを選べます。',
  'filter.menu.whats-new.done.title': 'フィルターの新機能は以上です',
  'filter.menu.whats-new.done.description':
    '同じメニューがトレードログ、ダッシュボード、ホーム、セットアップ、レビューで使えます。クリックするとすぐに反映されます。',
  'account.profiles.correction-history': 'ルールの訂正',
  'account.profiles.correction-before': '訂正前',
  'account.profiles.correction-after': '訂正後',
  'account.prop-challenge.field.help-label': '説明：{field}',
  'account.prop-challenge.payout-rules.help.cycle':
    '待機期間をエントリー日、最低純利益を満たす日、または経過した暦日で測ります。周期なしはこの日数条件だけを無効にします。',
  'account.prop-challenge.payout-rules.help.days':
    '選択した周期で必要な日数：エントリー日、実現純利益の達成日、または完全な24時間の期間です。',
  'account.prop-challenge.payout-rules.help.daily-profit':
    '費用控除後の1日あたり最低実現純利益。取引は設定した取引日の区切りで集計します。しきい値はゼロより大きい必要があります。',
  'account.prop-challenge.payout-rules.help.qualifying-days':
    '待機周期に利益達成日数を追加します。現在の出金周期で両方の条件を満たす必要があります。',
  'account.prop-challenge.payout-rules.help.profitable-days':
    '現在の出金周期で、実現純利益が日次最低額に達した異なる日の日数。',
  'account.prop-challenge.payout-rules.help.anchor':
    '暦日の待機期間は周期開始または最初のエントリーから数えます。リセット有効時は記録された出金で次の周期が始まります。',
  'account.prop-challenge.payout-rules.help.elapsed-hours':
    '現在の周期の最初のエントリーからの時間数。取引がなければ計時は始まりません。空欄で無効になります。',
  'account.prop-challenge.payout-rules.help.request-window':
    '毎日、または指定タイムゾーンの選択曜日だけ申請できます。他の条件も適用されます。',
  'account.prop-challenge.payout-rules.help.time-zone':
    '申請可能な曜日を判断するタイムゾーン。例：America/New_York。取引日の区切りは変わりません。',
  'account.prop-challenge.payout-rules.help.request-days':
    '選択タイムゾーンで申請を許可する曜日。少なくとも1日選んでください。',
  'account.prop-challenge.payout-rules.help.minimum-balance':
    '出金前に必要な残高。出金可能利益の計算に使う下限残高とは別です。空欄で無効。',
  'account.prop-challenge.payout-rules.help.cycle-profit':
    '現在の周期で必要な実現純取引利益。入金と残高調整は含みません。空欄で無効。',
  'account.prop-challenge.payout-rules.help.profit-schedule':
    '1回目、2回目以降の最低利益をカンマで区切ります。単一の周期最低利益に代わります。',
  'account.prop-challenge.payout-rules.help.repeat-final':
    '一覧を超える出金回数でも最後の値を繰り返し使用します。',
  'account.prop-challenge.payout-rules.help.positive-cycle':
    '最初の記録済み出金後、周期の実現純取引利益がゼロを超える必要があります。',
  'account.prop-challenge.payout-rules.help.consistency':
    '最高の日次利益を周期の実現純利益で割った割合。損失日は合計利益を減らし、割合を上げる場合があります。空欄で無効。',
  'account.prop-challenge.payout-rules.help.consistency-schedule':
    '出金回数ごとの最高日利益の割合上限をカンマで区切ります。単一の一貫性上限に代わります。',
  'account.prop-challenge.payout-rules.help.availability':
    'フェーズ開始残高または選択した下限を超える出金可能利益を計算します。割合と他の上限も適用されます。',
  'account.prop-challenge.payout-rules.help.balance-floor':
    '出金可能利益から除く残高。引き出せる割合は超過分だけに適用され、ドローダウン規則は変更しません。',
  'account.prop-challenge.payout-rules.help.request-percent':
    '選択下限を超える残高の申請可能な割合。申請額や新規利益の制限でさらに減る場合があります。',
  'account.prop-challenge.payout-rules.help.minimum-request':
    '許可される最低申請額。計算された出金可能額もこの最低額に達する必要があります。',
  'account.prop-challenge.payout-rules.help.maximum':
    '固定額、初回のみ、出金回数別、または周期利益の割合を上限にします。上限なしはこの制限だけを除きます。',
  'account.prop-challenge.payout-rules.help.maximum-amount':
    '利益分配前の最大申請総額。出金可能利益や他の上限で減る場合があります。',
  'account.prop-challenge.payout-rules.help.first-maximum':
    'このフェーズの初回出金だけに適用される申請総額上限。その後は解除されますが、他の制限は残ります。',
  'account.prop-challenge.payout-rules.help.maximum-schedule':
    '出金回数ごとの申請総額上限をカンマで区切ります。最後の値を繰り返さない場合、未記載の後続出金は上限ゼロです。',
  'account.prop-challenge.payout-rules.help.maximum-percent':
    '申請総額を周期の実現純取引利益のこの割合に制限します。残高に対する出金可能割合とは別です。',
  'account.prop-challenge.payout-rules.help.lifetime-days':
    '資金提供フェーズ全体の達成日数で新しい出金可能額と上限を有効にします。周期リセットではこの合計は消えません。',
  'account.prop-challenge.payout-rules.help.split-model':
    '固定分配率、累積出金総額または口座総利益による率の切り替え。分配率は受取額を決め、申請上限を決めるものではありません。',
  'account.prop-challenge.payout-rules.help.trader-share':
    'この率でトレーダーに支払う申請総額の割合。残りは会社の取り分です。',
  'account.prop-challenge.payout-rules.help.cumulative-threshold':
    'このフェーズの記録済み出金総額が達すると以後の率を使います。閾値をまたぐ申請は前後の部分にそれぞれの率を適用します。',
  'account.prop-challenge.payout-rules.help.maximum-payouts':
    'このフェーズで許可する記録済み出金回数。到達後は追加出金をブロックします。空欄で回数制限なし。',
  'account.prop-challenge.payout-rules.help.maximum-outcome':
    '最後の出金後：継続、口座終了、次フェーズ、またはライブ審査対象。審査資格は自動承認ではありません。',
  'account.prop-challenge.payout-rules.help.aftermath':
    '記録済み出金後の残高とドローダウン：申請額を差し引く、差し引いて下限を固定、または開始残高とドローダウンにリセット。',
  'account.prop-challenge.payout-rules.help.drawdown-floor':
    '対応する処理を選択した際、出金後に固定するドローダウン下限。残った残高はこの下限を上回る必要があります。',
  'account.prop-challenge.payout-rules.help.first-exempt':
    'このフェーズの初回出金では周期最低利益をゼロとして扱います。現在の周期の実現純利益はマイナスであってはなりません。他の条件も適用されます。',
  'account.prop-challenge.payout-rules.help.reset-cycle':
    '記録済み出金後、日数、日次利益、周期利益、一貫性をリセット。フェーズ全体の達成日数は保持し、プレビューではリセットしません。',
};

export default ja;
