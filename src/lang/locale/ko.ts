
import type { Lang } from './en';

const ko: Partial<Lang> = {
  'trade.broker-synced-at': '브로커 동기화 {date}',
  'home.period.month': '월',
  'home.period.quarter': '분기',
  'home.period.year': '년',
  'home.period.lifetime': '전체 기간',
  
  
  

  
  'command.add-trade': '새 거래 추가',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Trade Import 열기',

  
  'command.create-drc': 'DRC 열기 (일일 리포트 카드)',
  'command.create-weekly-review': '주간 리뷰 열기',
  'command.create-monthly-review': '월간 리뷰 열기',
  'command.create-quarterly-review': '분기 리뷰 열기',
  'command.create-yearly-review': '연간 리뷰 열기',

  
  'command.open-dashboard': '대시보드 열기',
  'command.open-account-dashboard': '계정 열기',
  'command.open-trade-log': '거래 기록 열기',
  'command.open-home': '홈 화면 열기',
  'command.open-position-size-calculator': '포지션 크기 계산기 열기',

  
  'navigation.items.nav-weekly': '이번 주 리뷰',
  'navigation.items.nav-monthly': '이번 달 리뷰',
  'navigation.items.nav-quarterly': '이번 분기 리뷰',
  'navigation.items.nav-yearly': '올해 리뷰',

  
  'backend.cards.sync.cancel': '동기화 취소',

  
  'command.replay-onboarding': '온보딩 다시 보기',

  
  
  

  
  
  
  'onboarding.notice.trade-sync-open-failed':
    'Trade Sync를 열 수 없습니다. 다시 시도하세요.',

  'command.open-release-notes': '릴리스 노트 보기',

  
  'command.open-layout-builder': '레이아웃 빌더 열기',

  
  
  
  'auth.title.already-logged-in': 'Already Logged In',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign In to Journalit',
  'auth.label.email': 'Email Address',

  
  
  
  'form.section.trade-details': '거래 상세',
  'form.section.trading-costs': '거래 비용',
  'form.section.risk-management': '리스크 관리',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': '분석 및 논거',

  
  
  
  'form.tab.basic': '기본',
  'form.tab.details': '상세',
  'form.tab.advanced': '고급',

  
  
  
  'form.import-shortcut.open': '거래 가져오기 열기',
  'form.layout.customize': '양식 사용자 지정',
  'form.layout.modal-title': '거래 양식 사용자 지정',
  'form.layout.settings-title': '거래 양식 레이아웃',

  'form.layout.input-mode': '입력 모드',
  'form.layout.input-mode-prices': '가격',
  'form.layout.input-mode-pnl-risk': 'P&L + 리스크',
  'form.layout.input-mode-prices-desc':
    '진입가와 청산가를 기록하고 Journalit이 P&L을 계산하게 합니다.',
  'form.layout.input-mode-pnl-risk-desc':
    '거래 P&L과 리스크 금액을 직접 기록합니다. Journalit이 R 배수를 자동 계산합니다.',
  'form.layout.asset-type-mode': '자산 유형',
  'form.layout.asset-type-mode-show': '매번 선택',
  'form.layout.asset-type-mode-fixed': '고정',
  'form.layout.default-asset-type': '기본 자산 유형',
  'form.layout.active-fields': '표시 블록',
  'form.layout.available-fields': '숨긴 블록',
  'form.layout.active-fields-desc':
    '블록을 드래그해 순서를 바꾸세요. 사용하지 않는 것은 제거하세요.',
  'form.layout.available-fields-desc':
    '필요할 때 숨긴 블록을 거래 양식에 다시 추가하세요.',
  'form.layout.empty-active': '표시 중인 선택 블록이 없습니다.',
  'form.layout.all-active': '모든 선택 블록이 표시 중입니다.',
  'form.layout.add-field-aria': '거래 양식에 {field} 추가',
  'form.layout.remove-field-aria': '거래 양식에서 {field} 숨기기',
  'form.layout.saved': '거래 양식 레이아웃이 저장되었습니다',
  'form.layout.item.trading-costs.commission': '수수료',
  'form.layout.item.import-shortcut': '가져오기 바로가기',
  'form.layout.item.import-shortcut-desc':
    '거래 가져오기를 여는 푸터 버튼을 표시합니다.',
  'form.layout.item.core-details': '핵심 거래 정보',
  'form.layout.item.core-details-desc':
    '계좌, 종목, 방향, 진입/청산 입력은 항상 먼저 표시됩니다.',
  'form.layout.item.asset-specific': '자산별 필드',
  'form.layout.item.pnl-preview': 'P&L 미리보기',

  'form.layout.item.trade-currency': '거래 통화 / 환율',
  'form.layout.item.trade-currency-desc':
    '다른 통화로 거래를 입력하고 선택적으로 환율을 직접 지정할 수 있습니다.',
  'form.layout.item.exchange-desc':
    '주식 및 암호화폐 거래의 거래소 필드입니다.',
  'form.layout.item.direct-pnl-toggle-desc':
    '개별 거래를 청산 가격 대신 총 손익 입력 방식으로 전환합니다.',
  'form.layout.manual-fx-rate': '환율 재정의',
  'form.layout.result-r': 'R 결과',
  'form.layout.entry-time': '거래 시간',

  
  
  
  'form.field.account': '계좌',
  'form.field.asset-type': '자산 유형',
  'form.field.direction': '방향',
  'form.field.direction.long': '롱',
  'form.field.direction.short': '숏',
  'form.field.commission': '수수료',
  'form.field.commission-type': '유형',
  'form.field.rebate': '리베이트',
  'form.field.swap': '스왑',
  'form.field.other-fees': '기타 수수료',
  'form.field.stop-loss': '손절가',
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Target Price',
  'form.field.close-percent': 'Close %',
  'form.field.risk-amount': '리스크 금액',
  'form.field.profit-loss': '손익',
  'form.field.total-pnl': '총 손익',
  'form.field.realized-pnl': '실현 손익',
  'form.field.total-costs': '총 비용:',
  'form.field.setup': '셋업',
  'form.field.mistake': '실수',
  'form.field.custom-tags': '사용자 태그',
  'form.field.trade-thesis': '거래 논거',
  'form.field.time': '시간',
  'form.field.price': '가격',

  'form.field.entries': '진입',
  'form.field.exits': '청산',
  'form.field.optional': '(선택사항)',

  
  'form.field.position-size': '포지션 크기',
  'form.field.position-size.shares': '주식 수',
  'form.field.position-size.contracts': '계약 수',
  'form.field.position-size.lots': '랏',
  'form.field.position-size.amount': '수량',
  'form.field.position-size.cfd-units': 'CFD 단위',

  
  'form.field.instrument': '종목',
  'form.field.instrument.ticker': '티커',
  'form.field.instrument.option-symbol': '옵션 심볼',
  'form.field.instrument.future-symbol': '선물 심볼',
  'form.field.instrument.forex-pair': '통화쌍',
  'form.field.instrument.crypto-symbol': '암호화폐 심볼',
  'form.field.instrument.cfd-symbol': 'CFD 심볼',

  
  'form.field.exchange': '거래소',
  'form.field.expiration-date': '만기일',
  'form.field.strike-price': '행사가',
  'form.field.contract-size': '계약 크기',
  'form.field.dollars-per-point': '포인트당 달러',
  'form.field.tick-size': '틱 크기',
  'form.field.tick-value': '틱 가치',
  'form.field.lot-size': '랏 크기',
  'form.field.custom-lot-size': '사용자 정의 랏 크기',
  'form.field.pip-value': '핍 가치',
  'form.field.leverage-ratio': '레버리지 비율',
  'form.field.trade-currency': '거래 통화',
  'form.field.fx-rate': '{base} 환율',
  'form.field.fx-rate-override': '환율 재정의 ({quote} → {base})',

  
  'form.forex.using-manual-rate': '수동 환율 사용',
  'form.field.lot-size.standard': '스탠다드 (100,000)',
  'form.field.lot-size.mini': '미니 (10,000)',
  'form.field.lot-size.micro': '마이크로 (1,000)',
  'form.field.lot-size.custom': '사용자 정의',

  
  
  
  'form.placeholder.select-accounts': '계좌 선택',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': '수수료 리베이트/크레딧',
  'form.placeholder.swap': '오버나이트 금융비용',
  'form.placeholder.other-fees': '플랫폼/규제 수수료',
  'form.placeholder.stop-loss': '손절가 (선택사항)',
  'form.placeholder.target-price': 'Target price',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': '계획된 리스크 금액',
  'form.placeholder.fx-rate':
    '1 {currency} = ? {base} (비워두면 일일 환율 사용)',
  'form.placeholder.custom-tag': '사용자 태그를 입력하고 Enter를 누르세요',
  'form.placeholder.thesis': '이 거래에 대한 논거를 입력하세요...',

  'form.placeholder.exchange-stock': '예: NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': '예: Binance, Coinbase',
  'form.placeholder.futures-point-value': '예: ES1의 경우 50',
  'form.placeholder.leverage': '예: 1:100의 경우 100',

  
  
  
  'form.entry-exit.add-entry': '+ 진입 추가',
  'form.entry-exit.add-exit': '+ 청산 추가',
  'form.entry-exit.remove-entry': '진입 삭제',
  'form.entry-exit.remove-exit': '청산 삭제',
  'form.entry-exit.total-entry-size': '총 진입 수량:',
  'form.entry-exit.remaining-position': '잔여 포지션:',
  'form.entry-exit.open': '(미결제)',
  'form.entry-exit.closed': '(청산완료)',
  'form.entry-exit.direct-pnl': '가격 대신 손익 직접 입력',
  'form.entry-exit.direct-pnl-desc':
    '총 손익을 직접 입력하세요. 수수료와 비용은 여전히 차감됩니다.',
  'form.entry-exit.calc-pnl': '진입/청산 가격과 포지션 크기로 손익 계산',
  'form.ideal-exit.title': '이상적인 청산',

  'form.ideal-exit.price': '이상 가격',
  'form.ideal-exit.size': '크기',
  'form.ideal-exit.remove': '이상 청산 삭제',

  'form.ideal-exit.copy-actual': '실제 청산 복사',

  'form.ideal-exit.tooltip':
    '사후에 실행했어야 했던 이상적인 청산 계획을 기록합니다. 분할 청산 리뷰를 지원합니다.',
  'form.ideal-exit.empty': '아직 이상적인 청산이 없습니다',
  
  
  
  'form.trade-type.title': '거래 유형',
  'form.trade-type.subtitle': '생성할 거래 유형을 선택하세요',
  'form.trade-type.regular': '일반 거래',
  'form.trade-type.regular-desc': '진입 및 청산 데이터가 포함된 일반 거래',
  'form.trade-type.missed': '놓친 거래',
  'form.trade-type.missed-desc':
    '놓친 거래 기회 - 손익 및 계좌 필드는 선택사항',
  'form.trade-type.backtest': '백테스트 거래',
  'form.trade-type.backtest-desc': '분석 목적의 백테스트 시나리오',
  'form.trade-type.missed-reason': '이 거래를 왜 놓쳤나요?',
  'form.trade-type.missed-reason-placeholder':
    '이 거래 기회를 놓친 이유를 설명하세요...',

  'form.account-empty-state.title': '첫 계좌를 설정하세요',
  'form.account-empty-state.description':
    '계좌는 잔액을 기록해 Journalit이 수익률, 리스크, 드로다운을 계산할 수 있게 합니다. 만드는 데는 이름만 있으면 됩니다.',
  'form.account-empty-state.create-account': '계좌 만들기',
  'form.account-empty-state.submit-disabled':
    '이 거래를 저장하려면 먼저 계좌를 만드세요.',
  'form.empty.take-profits': 'No take profit targets yet',
  'form.action.add-take-profit': 'Add Take Profit',
  'form.action.remove-take-profit': 'Remove take profit',

  
  
  
  'button.save': '저장',
  'button.cancel': '취소',
  'button.delete': '삭제',
  'button.update': '업데이트',
  'button.add': '추가',
  'button.create': '생성',
  'button.reset': '초기화',

  'button.confirm': '확인',

  'button.add-trade': '거래 추가',
  'button.update-trade': '거래 업데이트',
  'button.save-changes': '변경사항 저장',
  'button.create-trade': '거래 생성',
  'button.delete-all': '전체 삭제',
  'button.clear-all': '전체 지우기',

  'button.cancel-reset': '초기화 취소',
  'button.proceed-anyway': '그래도 진행',
  'button.mark-reviewed': '검토 완료로 표시',

  'button.learn-more': '더 알아보기',
  'button.upload-image': '미디어 업로드',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': '수정',
  'validation.fix-errors': '다음 오류를 수정해주세요:',

  'validation.complete-required': '모든 필수 필드를 완성해주세요',

  
  
  

  'notice.login-success': '로그인 성공!',

  'notice.logout-success': '로그아웃 완료',
  'notice.hotkey-set': '단축키 설정됨: {hotkey}',
  'notice.ftp-created': 'FTP 자격 증명이 성공적으로 생성되었습니다',
  'notice.ftp-password-rotated':
    '이 기기에 대한 새 FTP 자격 증명이 생성되었습니다. 다른 기기(예: MetaTrader EA)에 구성된 FTP 동기화는 새 비밀번호로 업데이트해야 합니다.',
  'notice.ftp-reused':
    '이 기기의 기존 FTP 자격 증명을 불러왔습니다. 더 이상 작동하지 않으면 비밀번호 재설정을 사용하세요.',
  'notice.ftp-reset':
    'FTP 비밀번호가 성공적으로 재설정되었습니다! 새 비밀번호를 저장하세요.',
  'notice.template-saved': '레이아웃 저장됨',
  'notice.template-created': '레이아웃 생성됨',
  'notice.template-duplicated': '레이아웃 복제됨',
  'notice.template-deleted': '레이아웃 삭제됨',
  'notice.default-template-updated': '기본 레이아웃 업데이트됨',
  'notice.tradelog-saved': '거래 기록 설정이 성공적으로 저장되었습니다',
  'notice.settings-exported': '설정이 {filename}으로 내보내기 되었습니다',
  'notice.settings-imported':
    'v{version}에서 설정을 성공적으로 가져왔습니다. 모든 변경사항을 적용하려면 Obsidian을 재시작하세요.',

  'notice.template-switched': '전환됨: {name}',
  'notice.auto-sync-toggled': '자동 동기화 {status}',
  'notice.auto-sync-enabled': '활성화됨',
  'notice.auto-sync-disabled': '비활성화됨',
  'notice.reset-items': '항목을 기본값으로 초기화함',

  'notice.custom-fields-imported':
    '{count}개의 사용자 정의 필드를 성공적으로 가져왔습니다',

  'notice.setups-added': '{count}개 거래에 셋업 추가됨',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': '{count}개 거래에 실수 추가됨',

  
  
  
  'notice.error.open-journalit':
    'Journalit을 열지 못했습니다. Obsidian을 다시 로드해보세요.',
  'notice.error.open-drc': 'DRC 열기 실패: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': '주간 리뷰 열기 실패: {error}',
  'notice.error.open-monthly-review': '월간 리뷰 열기 실패: {error}',
  'notice.error.open-quarterly-review': '분기 리뷰 열기 실패: {error}',
  'notice.error.open-yearly-review': '연간 리뷰 열기 실패: {error}',

  'notice.error.open-release-notes': '릴리스 노트 열기 실패: {error}',
  'notice.error.open-layout-builder': '레이아웃 빌더 열기 실패: {error}',
  'notice.error.switch-template': '레이아웃 전환 실패: {error}',
  'notice.error.no-active-file':
    '활성 파일이 없습니다. 먼저 노트를 열어주세요.',
  'notice.error.no-template-support':
    '이 노트 유형은 템플릿을 지원하지 않습니다.',
  'notice.error.no-templates':
    '이 노트 유형에 사용 가능한 레이아웃이 없습니다.',
  'notice.error.asset-type-required': '종목 추가 시 자산 유형이 필요합니다',
  'notice.error.column-required': '최소 하나의 열은 표시되어야 합니다',
  'notice.error.save-settings': '설정 저장 오류: {error}',
  'notice.error.sign-in-vault': '볼트를 등록하려면 로그인하세요.',
  'notice.error.sign-in-sync': '자동 동기화를 사용하려면 로그인하세요.',
  'notice.error.export-settings':
    '설정 내보내기 실패. 자세한 내용은 콘솔을 확인하세요.',
  'notice.error.import-settings': '설정 가져오기 실패: {error}',
  'notice.error.reset-settings':
    '설정 초기화 실패. 자세한 내용은 콘솔을 확인하세요.',

  'notice.error.mark-reviewed': '거래 검토 표시 오류: {error}',
  'notice.error.add-setups': '셋업 추가 오류: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': '실수 추가 오류: {error}',
  'notice.error.delete-trades': '거래 삭제 오류: {error}',
  'notice.error.csv-validation': 'CSV/XLSX/XLS 유효성 검사 실패: {errors}',
  'notice.error.import-failed': '가져오기 실패: {error}',
  'notice.error.file-too-large': '파일이 너무 큽니다. 최대 크기는 10MB입니다',
  'notice.error.select-csv': 'CSV/XLSX/XLS 파일을 선택해주세요',
  'notice.error.cannot-delete-builtin': '기본 레이아웃은 삭제할 수 없습니다',
  'notice.error.duplicate-to-customize':
    '사용자 정의하려면 이 템플릿을 복제하세요',

  
  
  

  'notice.info.settings-recovered':
    '설정이 백업에서 복구되었습니다. 일부 최근 변경사항이 손실될 수 있습니다.',
  'notice.info.cannot-remove-locked': '잠긴 위젯은 제거할 수 없습니다',

  
  
  
  'tradelog.title': '거래 기록',
  'dashboard.guide.empty.intro.title': 'Welcome to your Dashboard',
  'dashboard.guide.empty.intro.description':
    'Your Dashboard becomes useful as soon as Journalit has trading history to analyse.',
  'dashboard.guide.empty.state.title': 'Bring your trading history with you',
  'dashboard.guide.empty.state.description':
    'Import previous trades to start with meaningful performance data, or add a trade manually if you are recording your first trades.',
  'dashboard.guide.main.intro.title': '대시보드입니다',
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
  'home.guide.intro.title': '홈에 오신 것을 환영합니다',
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

  'trade-form.guide.customization-modal.title': '양식을 내 워크플로에 맞추세요',
  'trade-form.guide.customization-modal.description':
    '여기에서 선택 블록을 표시, 숨김, 재정렬할 수 있습니다. 실제로 사용하는 필드에만 양식을 집중하세요.',
  'trade-form.guide.finish.title': '이것이 사용자 지정 기능입니다',
  'trade-form.guide.finish.description':
    '거래 양식을 다른 저널 작성 흐름에 맞춰야 할 때 언제든 이 버튼으로 다시 설정할 수 있습니다.',
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
    'In normal mode, clicking a trade opens it. In multi-select mode, clicking selects it instead. Switch between those two behaviours depending on what you want to do.',
  'tradelog.empty': '거래를 찾을 수 없습니다',
  'tradelog.filter.all': '전체',
  'tradelog.filter.winners': '수익',
  'tradelog.filter.losers': '손실',
  'tradelog.filter.breakeven': '손익 없음',
  'tradelog.filter.open': '미결제',
  'tradelog.type.all': '모든 유형',
  'tradelog.type.regular': '일반',
  'tradelog.type.missed': '놓친 거래',
  'tradelog.type.backtest': '백테스트',

  
  
  
  'dashboard.title': '대시보드',
  'dashboard.no-data': '사용 가능한 거래 데이터가 없습니다',
  'dashboard.empty.import-action': 'Import existing trades',
  'dashboard.empty.manual-action': 'Add a trade manually',
  'dashboard.widgets.setup-performance.title': '셋업 성과',
  'dashboard.widgets.setup-performance.description':
    '셋업별 성과를 비교하는 순위 막대 차트',
  'dashboard.widgets.setup-performance.empty': '셋업 성과 데이터가 없습니다',
  'dashboard.widgets.setup-performance.masked-label': '셋업',
  'dashboard.widgets.tag-performance.title': '태그 성과',
  'dashboard.widgets.tag-performance.description':
    '태그별 성과를 비교하는 순위 막대 차트',
  'dashboard.widgets.tag-performance.empty': '태그 성과 데이터가 없습니다',
  'dashboard.widgets.tag-performance.masked-label': '태그',
  'dashboard.widgets.ticker-performance.title': '티커 성과',
  'dashboard.widgets.ticker-performance.metric-aria': '지표',
  'dashboard.widgets.ticker-performance.view-aria': '보기 모드',
  'dashboard.widgets.ticker-performance.view.best-and-worst': '최고 및 최저',
  'dashboard.widgets.ticker-performance.view.best': '상위 10개',
  'dashboard.widgets.ticker-performance.view.worst': '하위 10개',
  'dashboard.widgets.ticker-performance.metric.total-pnl': '총 P&L',
  'dashboard.widgets.ticker-performance.metric.total-r': '총 R',
  'dashboard.widgets.ticker-performance.metric.win-rate': '승률',
  'dashboard.widgets.ticker-performance.tooltip.ticker': '티커: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': '거래: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    '승률: {rate} ({wins}승 / {losses}패)',

  'dashboard.widgets.ticker-performance.empty': '티커 성과 데이터가 없습니다',
  'dashboard.widgets.ticker-performance.empty-submessage':
    '현재 필터와 일치하는 티커가 있는 종료 거래가 없습니다.',
  'dashboard.widgets.ticker-performance.masked-ticker': '티커',
  'dashboard.widgets.ticker-performance.omitted-count': '생략: {count}',

  'widget.tickerPerformance.name': '티커 성과',
  'widget.tickerPerformance.description':
    '티커별 성과를 비교하는 순위 막대 차트',

  
  'dashboard.filter.accounts.all': '모든 계좌',
  'dashboard.filter.accounts.n-selected': '{count}개 계좌',
  'dashboard.filter.accounts.select-all': '모두 선택',

  'dashboard.filter.accounts.none-found': '계좌를 찾을 수 없습니다',

  
  'dashboard.filter.mistakes.all': '모든 실수',
  'dashboard.filter.mistakes.none': '실수 없음',
  'dashboard.filter.mistakes.n-selected': '{count}개 실수',
  'dashboard.filter.mistakes.select-all': '모두 선택',
  'dashboard.filter.mistakes.none-found': '실수를 찾을 수 없습니다',

  
  
  

  'view.dashboard': '대시보드',
  'view.trade-log': '거래 기록',
  'view.account-dashboard': '계정',
  'view.layout-builder': '레이아웃 빌더',
  'view.csv-import': 'Trade Import',

  
  
  
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.history-ready': 'Your trading history is ready',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  
  

  'csv.errors.copy-report': '보고서 복사',

  
  
  

  

  
  
  
  'account.edit.modal.change-date.message':
    '계정 "{account}"의 생성 날짜를 {oldDate}에서 {newDate}(으)로 변경하려고 합니다.',
  'account.edit.modal.change-date.warning':
    '이 작업은 초기 입금 거래 날짜를 업데이트하며 계좌 연수 계산, 월간 청구 주기 및 기타 날짜 기반 지표에 영향을 줄 수 있습니다.',

  'account.edit.modal.change-balance.message':
    '초기 잔고를 {oldBalance}에서 {newBalance}(으)로 변경하려고 합니다.',

  'account.edit.modal.change-balance.info':
    '이 작업은 모든 잔고 계산, 손익 비율, 드로다운 계산 및 거래 내역에 영향을 미칩니다.',
  'account.edit.modal.change-balance.info2':
    '현재 잔고는 새로운 초기 잔고와 모든 거래 손익을 기반으로 다시 계산됩니다.',
  'account.edit.modal.change-balance.info3':
    '이 변경은 계정 지표 및 과거 데이터의 정확성에 상당한 영향을 미칠 수 있습니다.',
  'account.edit.modal.delete.question':
    '계정 "{name}"을(를) 영구적으로 삭제하시겠습니까?',

  
  'account.edit.error.name-exists': '계정 "{name}"이(가) 이미 존재합니다',
  'account.edit.error.creation-date-required': '생성 날짜는 필수입니다',

  
  
  
  'common.loading': '로딩 중...',
  'common.error': '오류',

  'common.warning': '경고 및 주의사항',
  'common.info': '정보 및 안내',
  'common.yes': '예',
  'common.no': '아니오',
  'common.ok': '확인',

  'common.none': '없음',
  'common.all': '전체',
  'common.date': '날짜',

  'common.week': '주',
  'common.month': '월',
  'common.year': '년',

  'common.min': '최소',
  'common.max': '최대',
  'common.profit': '수익',

  'common.trade': '거래',
  'common.trades': '거래',
  'common.color.label': '색상',
  'common.color.default': '기본값',

  
  
  

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI Trade Import 매핑',
  'settings.auth.feature.basic-tracking': '기본 거래 추적',

  'settings.auth.feature.priority-support': '우선 지원',

  
  
  
  
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description':
    'Checklist to help you add trading history and configure Journalit',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.account.title': '거래 계좌를 설정하세요',
  'home.widget.getting-started.item.account.description':
    '거래는 잔액을 추적하는 계좌에 기록됩니다. 계좌가 없으면 수익률과 드로다운을 계산할 수 없습니다.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': '계좌 설정',
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
  'home.widget.getting-started.item.sidebar.title': '탐색 사이드바 열기',
  'home.widget.getting-started.item.sidebar.description':
    'Journalit 페이지, 리뷰, 도구 및 검색에 빠르게 접근하세요.',
  'home.widget.getting-started.item.sidebar.time': '10초',
  'home.widget.getting-started.item.sidebar.cta': '사이드바 열기',
  'home.quick-links.navigation-sidebar': '탐색 사이드바',
  'notice.error.open-navigation-sidebar':
    '탐색 사이드바를 열지 못했습니다. 다시 시도해 주세요.',
  'navigation.setting.open': '탐색 사이드바 열기',
  'navigation.setting.open.desc':
    '지금 표시하고 Obsidian 사이드바가 접혀 있으면 펼칩니다.',
  'navigation.setting.open.button': '사이드바 열기',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    'Trade Import, Trade Sync 및 경제 캘린더를 활성화하세요.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',

  

  'premium.gate.cta.continue-pro': 'PRO로 계속',

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
    'R | Trader Pro에서 주문 내역(Order History)을 열고 해당 계좌/날짜의 체결 완료(Completed/Filled) 주문으로 필터링하세요',
  'csv.broker-guide.rithmic.step-2':
    '열 추가/제거(Add/Remove Columns)에서 Side, Symbol, Qty Filled, Avg Fill Price, Fill/Update Time 열이 표시되는지 확인하세요',
  'csv.broker-guide.rithmic.warning.emphasis': '중요:',

  

  
  'dashboard.metrics.avgRR': '평균 RR (페이오프)',
  'dashboard.metrics.sharpeRatio': '샤프 비율',
  'dashboard.metrics.avgRRRiskBased': '평균 RR (R 기반)',
  'dashboard.metrics.longestWinStreak': '최고 연승',
  'dashboard.metrics.longestLossStreak': '최악의 연패',
  'dashboard.sharpeRatio.tooltip.title': '샤프 비율',
  'dashboard.sharpeRatio.tooltip.formula':
    '공식: 청산 거래 평균 순 P&L / 청산 거래 순 P&L의 표본 표준편차. 무위험 수익률은 0이며 연율화하지 않습니다.',
  'dashboard.sharpeRatio.tooltip.coverage':
    '총 {total}개의 청산 거래 중 {valid}개로 계산',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    '부분 커버리지: 총 {total}개의 청산 거래 중 {valid}개에 유한한 순 P&L이 있습니다.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'P&L 변동성이 0이 아닌 청산 거래가 최소 2개 필요합니다.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    '이 샤프 비율은 FX 변환 없는 혼합 통화를 기반으로 하므로 오해의 소지가 있을 수 있습니다.',
  'dashboard.avgRRRiskBased.tooltip.title': '평균 RR (R 기반)',
  'dashboard.avgRRRiskBased.tooltip.formula': '공식: 평균 승리 R / 평균 손실 R',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    '위험 데이터가 있는 총 {total}개의 청산 거래 중 {valid}개로 계산',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    '위험 유효 승리: {wins}, 손실: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    '부분 위험 커버리지: {total}개의 청산 거래 중 {valid}개만 유효한 위험 데이터가 있습니다.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'R 기반 RR을 계산하기에 데이터가 부족합니다. 손절/위험 금액을 입력하고 유효한 승리/손실 거래가 모두 있도록 해주세요.',
  'metric.avgRR.name': '평균 RR (페이오프)',
  'metric.avgRR.description': '평균 보상/위험 비율 (평균 수익 / 평균 손실)',
  'metric.sharpeRatio.name': '샤프 비율',
  'metric.sharpeRatio.description':
    '거래 단위 샤프 비율: 청산 거래 평균 순 P&L을 P&L 표본 변동성으로 나눈 값',
  'metric.avgRRRiskBased.name': '평균 RR (R 기반)',
  'metric.avgRRRiskBased.description':
    'R-배수 기반 비율: 평균 승리 R / 평균 손실 R (손절/위험 데이터 필요)',
  'metric.longestWinStreak.name': '최고 연승',
  'metric.longestWinStreak.description': '청산일 기준 최장 연속 승리',
  'metric.longestLossStreak.name': '최악의 연패',
  'metric.longestLossStreak.description': '청산일 기준 최장 연속 손실',
  'metric.numTrades.name': '총 거래 수',
  'metric.numTrades.description': '청산된 거래의 총 수',
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
    '통화로 표시',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    '이 숫자 필드를 거래 로그에서만 통화 값으로 형식 지정합니다',
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
  'settings.general.analytics-date-basis': '분석 날짜 기준',
  'settings.general.analytics-date-basis-desc':
    '주로 스윙 트레이더에게 적합합니다. 분석에 진입일 또는 최종 청산일을 사용합니다. 청산일 모드는 종료된 거래만 집계하며, 직접 PnL 거래에는 청산일이 필요합니다.',
  'settings.general.analytics-date-basis-aria': '분석 날짜 기준 선택',
  'settings.general.analytics-date-basis-entry': '진입일',
  'settings.general.analytics-date-basis-exit': '청산일',
  'settings.general.analytics-date-basis-changed':
    '분석 날짜 기준이 {basis}(으)로 변경되었습니다',
  'trade.metadata.broker-comment': '브로커 코멘트',
  'tradelog.column.mtComment': 'MT 코멘트',
  'tradelog.tooltip.mtComment': 'MT 코멘트:',
  
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
  'settings.general.data-management': '데이터 관리 & 개인정보 보호',

  'settings.general.privacy-mode': '개인정보 보호 모드',

  'settings.general.privacy-mode-desc':
    '저장된 데이터를 변경하지 않고 UI에서 민감한 거래, 계정, 가격, 성과 값을 마스킹합니다.',

  'settings.general.privacy-mode-aria': '개인정보 보호 모드 전환',
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
  'widget.weekly-drc-context.invalid-context':
    '이 위젯은 주간 리뷰 노트에서만 사용할 수 있습니다',
  'templateEditor.widget.weekly-drc-day-label': '요일',

  'templateEditor.widget.weekly-drc-start-collapsed': '접힌 상태로 시작',
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
  'dashboard.conversion.original-pnl': '원래 손익',
  'dashboard.conversion.converted-pnl': '환산 손익',
  'dashboard.conversion.details-label': '통화 변환 세부 정보',

  'widget.stats.vs-prev': 'vs prev',
  'dashboard.metrics.past-30d': 'past 30d',

  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'widget.tag-performance.name': '태그 성과',
  'widget.tag-performance.description': '거래 태그별 성과 분석',
  'widget.table.header.tag': '태그',
  'widget.empty.no-tag-data': '이 기간에 사용할 수 있는 태그 데이터가 없습니다',
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
    '로그인하거나 무료 Journalit 계정을 만들어 Trade Import에서 파일을 미리 보세요. Pro는 거래를 가져올 때만 필요합니다.',
  'quick-import.gate.sign-in-cta': '로그인하고 무료로 미리보기',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
  'quick-import.gate.preview-free': '파일 무료 미리보기',
  'quick-import.message.needs-setup':
    'Choose a favorite broker or template in Trade Import before using Quick Import.',
  'quick-import.message.capabilities-failed':
    'Quick Import setup could not be loaded.',
  'quick-import.message.mapping-required':
    'This file needs column mapping. Open the full Trade Import flow to review mappings.',
  'quick-import.message.preview-failed':
    'This file needs review in the full Trade Import flow.',

  'quick-import.privacy-note':
    '파일은 처리를 위해 Journalit 서버에 업로드되며 기본적으로 저장되지 않습니다.',
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
  'quick-import.action.import-count.one': '거래 {count}개 가져오기',
  'quick-import.action.import-count.few': '거래 {count}개 가져오기',
  'quick-import.action.import-count.many': '거래 {count}개 가져오기',
  'quick-import.action.import-count.other': '거래 {count}개 가져오기',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.open-failed': 'Unable to open Trade Import',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.notice.free-preview-rate-limited':
    '무료 미리보기 한도에 도달했습니다. PRO를 시작하거나 약 {minutes}분 후 다시 시도하세요.',
  'trade-import.notice.free-preview-storage-limit-reached':
    '무료 미리보기 저장 공간에는 최대 {limit}개의 거래를 보관할 수 있습니다. 현재 {storedItems}개가 저장되어 있으며 이 파일은 {requestedItems}개를 추가합니다. 이전 미리보기가 만료될 때까지 기다리거나 PRO를 시작하세요.',
  'trade-import.preview-error.guidance':
    '모든 필수 필드가 매핑되어 있고, 선택한 날짜 형식이 파일과 일치하며, 숫자 열에 유효한 거래 값이 포함되어 있는지 확인하세요.',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': '거래',
  'trade-import.gate.brand-right': '가져오기',
  'trade-import.gate.sign-in.title': '거래 기록 무료 미리보기',
  'trade-import.gate.sign-in':
    '로그인하거나 무료 Journalit 계정을 만들어 파일을 분석하세요. 거래를 가져올 때만 Pro가 필요합니다.',
  'trade-import.gate.sign-in.reassurance':
    '파일은 비공개로 처리되며 기본적으로 저장되지 않습니다.',
  'trade-import.gate.sign-in.no-trial':
    '분석과 미리보기에 Pro 체험은 필요하지 않습니다.',
  'trade-import.gate.sign-in.cta': '로그인하고 무료로 미리보기',

  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': '내보내기 소스 / 플랫폼',
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
  'trade-import.guide.prompt': '무엇을 내보내야 할지 모르겠나요?',
  'trade-import.guide.link': '브로커 가이드 보기',
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

  'trade-import.preview.found.one': '{count}개의 거래를 찾았습니다',
  'trade-import.preview.found.few': '{count}개의 거래를 찾았습니다',
  'trade-import.preview.found.many': '{count}개의 거래를 찾았습니다',
  'trade-import.preview.found.other': '{count}개의 거래를 찾았습니다',
  'trade-import.preview.date-range': '{start}~{end}',
  'trade-import.preview.metric.symbols': '종목',
  'trade-import.preview.metric.ready': '가져오기 준비 완료',
  'trade-import.preview.metric.duplicates': '중복 가능성',
  'trade-import.preview.metric.attention': '확인 필요',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Entry time',
  'trade-import.table.quantity': 'Quantity',
  'trade-import.table.message': 'Message',
  'trade-import.action.confirm': 'Confirm import',
  'trade-import.action.activate-pro.one':
    'PRO를 활성화하여 거래 {count}개 가져오기',
  'trade-import.action.activate-pro.few':
    'PRO를 활성화하여 거래 {count}개 가져오기',
  'trade-import.action.activate-pro.many':
    'PRO를 활성화하여 거래 {count}개 가져오기',
  'trade-import.action.activate-pro.other':
    'PRO를 활성화하여 거래 {count}개 가져오기',
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',

  
  'command.open-setups': '셋업 열기',
  'setups.create.title': 'Create Setup',
  'setups.create.field.name': 'Setup Name',
  'setups.create.placeholder.name': 'Opening Drive',
  'setups.create.field.status': 'Status',
  'setups.create.field.direction': 'Direction',
  'setups.create.field.color': '색상',
  'setups.create.field.color-description':
    '이 셋업을 식별할 색상을 선택하세요.',
  'setups.create.profile.heading': '선호 필드',
  'setups.create.profile.optional-label': '(선택 사항)',
  'setups.create.field.sessions': '세션',
  'setups.create.field.preferred-sessions-tooltip':
    '이 세션은 설정 → 저널 → 세션 모드에서 관리할 수 있습니다.',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': '타임프레임',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': '티커',
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
  'setups.edit.delete.button': '셋업 삭제',
  'setups.edit.delete.title': '셋업 삭제',
  'setups.edit.delete.confirm': '삭제 확인',
  'setups.edit.delete.warning':
    '"{name}"을(를) 삭제하면 셋업이 영구적으로 삭제되고 연결된 거래에서 제거됩니다. 이 작업은 취소할 수 없습니다.',
  'setups.edit.delete.success': '셋업 "{name}"이(가) 삭제되었습니다',
  'setups.edit.delete.error': '셋업을 삭제하지 못했습니다',
  'setups.edit.success': 'Setup "{name}" updated successfully',
  'setups.edit.error.failed': 'Failed to update setup',
  'setups.view.compare.empty-submessage':
    'Choose two setup cards from the overview to build a side-by-side report.',
  'setups.view.compare.reason.higher.total-r': '총 R 높음',
  'setups.view.compare.reason.lower.total-r': '총 R 낮음',
  'setups.view.compare.reason.similar.total-r': '총 R 유사',

  'setups.guide.create-new-setup.title': '새 셋업 만들기',
  'setups.guide.create-new-setup.description':
    '다른 플레이북을 추가하려면 새 셋업을 사용하세요. 모달에서 세부 정보, 연결 노트, 규칙을 설정할 수 있습니다.',
  'setups.guide.detail-intro.title': '셋업 페이지입니다',
  'setups.guide.detail-intro.description':
    '셋업 페이지는 하나의 플레이북에 집중해 성과 차트, 맥락, 참고 자료, 작업, 실행 규칙을 모아 보여줍니다.',
  'setups.guide.detail-actions.title': '셋업 작업',
  'setups.guide.detail-actions.description':
    '이 버튼으로 관련 거래를 열거나 세부 정보, 연결 노트, 스크린샷, 플레이북 규칙을 편집합니다.',
  'setups.guide.empty.create-setup.title': '새 셋업으로 시작',
  'setups.guide.empty.create-setup.description':
    '먼저 셋업을 하나 만드세요. 생성되면 이 가이드가 일반 흐름을 이어갑니다.',

  'setups.guide.intro.title': 'Setups에 오신 것을 환영합니다',
  'setups.guide.intro.description':
    '이 보기에서는 셋업 플레이북, 연결된 거래, 노트, 스크린샷, 규칙을 한곳에 모읍니다.',
  'setups.guide.view-tabs.title': '셋업 보기 전환',
  'setups.guide.view-tabs.description':
    '셋업이 충분할 때 이 탭으로 개요, 셋업 페어, 비교 흐름을 이동합니다.',
  'setups.guide.overview-chart.title': '성과 순위',
  'setups.guide.overview-chart.description':
    '개요 차트는 선택한 지표로 셋업을 정렬합니다. 오른쪽 위 컨트롤로 지표를 바꾸거나 특정 셋업에 집중할 수 있습니다.',
  'setups.guide.tag-filter.title': '셋업 필터링',
  'setups.guide.tag-filter.description':
    '셋업 태그 또는 방향으로 카드, 차트, 페어 및 비교 항목을 필터링합니다. 각 그룹 안에서는 OR, 태그와 방향 사이는 AND로 적용됩니다.',
  'setups.guide.setup-cards.title': '셋업 카드',
  'setups.guide.setup-cards.description':
    '카드는 핵심 지표, 상태, 마지막 거래일, 작은 성과 추세로 각 셋업을 요약합니다.',
  'setups.guide.open-detail.title': '셋업 페이지 열기',
  'setups.guide.open-detail.description':
    '셋업 카드를 열어 차트, 맥락, 플레이북 자료, 실행 규칙이 있는 전용 페이지를 확인합니다.',
  'setups.guide.detail-performance.title': '상세 성과',
  'setups.guide.detail-performance.description':
    'Performance 탭은 시간에 따른 차트와 P&L, 승률, 기대값, 드로다운 같은 핵심 지표를 보여줍니다.',
  'setups.guide.detail-context.title': '셋업 맥락',
  'setups.guide.detail-context.description':
    '이 패널은 셋업 건강도, 주의 항목, 연결 노트, 스크린샷을 가까이 둡니다.',
  'setups.guide.detail-playbook.title': '플레이북 노트',
  'setups.guide.detail-playbook.description':
    '플레이북 영역은 연결 노트를 미리 보여줍니다. Markdown, 이미지, Excalidraw 또는 원하는 참고 자료가 될 수 있습니다.',
  'setups.guide.detail-rules.title': '실행 규칙',
  'setups.guide.detail-rules.description':
    '규칙은 좋은 조건, 진입, 리스크, 피해야 할 실수를 구조화한 체크리스트입니다.',
  'setups.guide.finish.title': 'Setups 가이드 완료',
  'setups.guide.finish.description':
    '개요, 페어, 비교, 개별 셋업 페이지의 주요 화면을 모두 보았습니다.',

  'setups.guide.pairs-mode.title': '셋업 페어 열기',
  'setups.guide.pairs-mode.description':
    '페어를 열어 비교할 만큼 공유 거래가 있는 조합을 확인합니다.',
  'setups.guide.pairs-chart.title': '페어 순위',
  'setups.guide.pairs-chart.description':
    '페어 모드는 함께 더 좋거나 나쁠 수 있는 조합을 강조합니다. 막대를 클릭하면 해당 조합의 더 깊은 인사이트를 열 수 있습니다.',

  'setups.guide.compare-mode.title': '비교 모드 시작',
  'setups.guide.compare-mode.description':
    '비교 모드에서는 두 셋업 카드를 선택해 나란히 검토합니다.',
  'setups.guide.compare-select.title': '두 셋업 선택',
  'setups.guide.compare-select.description':
    '비교 페이지를 열려면 두 셋업 카드를 선택하세요.',
  'setups.guide.compare-summary.title': '비교 페이지입니다',
  'setups.guide.compare-summary.description':
    '이 페이지는 두 셋업을 나란히 비교합니다. 상단 요약 행은 승자, 기대값 우위, 신뢰도, 한 셋업이 우위인 이유를 보여줍니다.',
  'setups.guide.compare-body.title': '비교 요약 행',
  'setups.guide.compare-body.description':
    '상단 행은 승자, 기대값 우위, 신뢰도, 우위의 이유를 요약합니다.',
  'setups.guide.compare-details.title': '비교 상세',
  'setups.guide.compare-details.description':
    '지표 표와 누적 차트로 두 셋업의 차이를 이해합니다.',
  'setups.guide.detail-execution-gap.title': '실행 갭 분석',
  'setups.guide.detail-execution-gap.description':
    '놓친 거래나 백테스트 데이터가 있으면 이 탭에서 실제 실행과 놓친 또는 벤치마크 기회를 비교합니다.',
  'setups.guide.back-to-overview.title': '셋업 카드로 돌아가기',
  'setups.guide.back-to-overview.description':
    '비교를 마치면 셋업 카드로 돌아갑니다.',

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
  'setups.view.detail.performance.drawdown': '드로다운',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',
  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Edit linked notes',

  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': '실거래 R',
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
  'setups.view.detail.brief.no-screenshots': '아직 연결된 스크린샷이 없습니다.',
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
  'media.viewer.mute-video': '동영상 음소거',
  'media.viewer.unmute-video': '동영상 음소거 해제',
  'media.viewer.volume': '볼륨',

  'imageGallery.empty.error.title': '갤러리를 사용할 수 없습니다',
  'imageGallery.empty.no-images.title': '아직 미디어가 없습니다',
  'imageGallery.empty.no-images.description':
    '거래 또는 리뷰 노트에 첨부한 이미지, GIF, 동영상, YouTube 링크가 여기에 자동으로 표시됩니다.',
  'imageGallery.empty.no-results.title': '이 필터와 일치하는 미디어가 없습니다',
  'imageGallery.empty.no-results.description':
    '활성 필터를 지우거나 날짜 범위를 넓혀 더 많은 갤러리 항목을 표시해 보세요.',
  'imageGallery.empty.no-source.title': '이 소스에는 미디어가 없습니다',
  'imageGallery.empty.no-source.description':
    '이 소스에는 아직 갤러리 항목이 없습니다. 모든 미디어로 돌아가거나 다른 소스를 선택하세요.',
  'imageGallery.empty.action.clear-filters': '필터 지우기',
  'imageGallery.empty.action.show-all': '모든 미디어 표시',
  'imageGallery.open-source': '노트 열기',
  'imageGallery.image-alt': '{date}의 {source} 미디어',
  'imageGallery.annotation.reviewed': '검토됨',
  'imageGallery.annotation.unreviewed': '미검토',
  'imageGallery.annotation.tag': '태그',

  'imageGallery.annotation.editor-title': '미디어 주석 달기',
  'imageGallery.annotation.editor-title-with-file': '{fileName}에 주석 달기',
  'imageGallery.annotation.tags': '태그',
  'imageGallery.annotation.tags-placeholder': '브레이크아웃, A+ 셋업, 실수',
  'imageGallery.annotation.notes': '메모',
  'imageGallery.annotation.notes-placeholder':
    '미래의 나는 이 차트에서 무엇을 배워야 할까요?',
  'imageGallery.annotation.error.save-failed':
    '미디어 주석을 저장할 수 없습니다.',
  'imageGallery.annotation.error.load-failed':
    '미디어 주석을 불러올 수 없습니다.',
  'imageGallery.annotation.saving': '저장 중...',
  'command.replay-current-view-guide': '현재 보기 가이드 다시 보기',

  
  
  
  'tradelog.guide.switch-to-gallery.title': '거래에서 갤러리로 전환하기',
  'tradelog.guide.switch-to-gallery.description':
    '이 모드 선택기로 일반 Trade Log와 갤러리를 오갈 수 있습니다. 갤러리를 클릭해 이미지, GIF, 동영상, YouTube 링크 안내를 계속하세요.',

  'tradelog.guide.gallery-source-sort.title': '미디어 소스와 순서 선택하기',
  'tradelog.guide.gallery-source-sort.description':
    '소스로 전체 미디어, 거래 첨부 파일 또는 리뷰 노트 미디어를 선택하세요. 정렬로 최신, 오래된, 최고 또는 최악의 거래를 먼저 볼 수 있습니다.',
  'tradelog.guide.gallery-size.title': '갤러리 미리보기 크기 조정하기',
  'tradelog.guide.gallery-size.description':
    '이 크기 버튼으로 compact 보기와 더 큰 미디어 미리보기를 전환하세요.',
  'tradelog.guide.gallery-filters.title':
    '같은 진입점에서 갤러리를 필터링하세요',
  'tradelog.guide.gallery-filters.description':
    '필터 버튼은 계속 고급 필터를 엽니다. 갤러리 모드에서는 주석 상태와 미디어 태그 같은 미디어 전용 필터도 포함됩니다.',
  'tradelog.guide.gallery-filter-modal.title':
    '미디어 필터는 거래 필터와 함께 있습니다',
  'tradelog.guide.gallery-filter-modal.description':
    '이 모달에서 거래 필터와 미디어 필터를 함께 사용하세요. 예를 들어 특정 setup으로 필터링한 뒤 메모가 있거나 특정 미디어 태그가 있는 미디어만 볼 수 있습니다.',
  'tradelog.guide.gallery-grid.title': '미디어를 열어 자세히 검토하세요',
  'tradelog.guide.gallery-grid.description':
    '각 카드는 콘텐츠를 가리지 않으면서 거래와 리뷰 맥락을 간단히 보여줍니다. 아무 카드나 클릭하면 전체 화면으로 열립니다.',
  'tradelog.guide.gallery-fullscreen-actions.title':
    '전체 화면에서 미디어에 주석 달기',
  'tradelog.guide.gallery-fullscreen-actions.description':
    '항목을 충분히 크게 보면서 Tag로 미디어 수준의 태그와 메모를 추가하세요. 노트 열기는 원본 거래 또는 리뷰 노트로 돌아갑니다.',
  'tradelog.guide.gallery-open-annotation.title': '주석 패널 열기',
  'tradelog.guide.gallery-open-annotation.description':
    'Tag를 클릭해 이 특정 미디어에 주석을 추가하세요. 미디어 태그와 메모는 전체 거래가 아니라 첨부 파일을 설명합니다.',
  'tradelog.guide.gallery-annotation-panel.title':
    '미디어 태그와 메모 추가하기',
  'tradelog.guide.gallery-annotation-panel.description':
    '유동성 스윕이나 실패한 돌파처럼 차트별 아이디어에는 미디어 태그를, 기억할 시장 구조 맥락에는 메모를 사용하세요.',
  'tradelog.guide.gallery-finish.title':
    '이제 Trade Log의 두 모드를 알게 되었습니다',
  'tradelog.guide.gallery-finish.description':
    '표와 일괄 도구가 필요할 때는 거래 모드를 사용하세요. 저널 전체의 이미지, GIF, 동영상, YouTube 링크, 시장 구조와 차트 주석을 검토할 때는 갤러리를 사용하세요.',
  'account.prop-challenge.prefill.heading-link': 'Prefill from your firm',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} more, rules prefilled with PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, rules prefilled with PRO',
  'account.prop-challenge.prefill.match':
    'We have {firm}: {count} challenges with rules ready',
  'account.prop-challenge.rules.empty':
    '아직 추가된 규칙이 없습니다. 규칙 추가를 사용해 이 단계를 설정하세요.',
  'trade.validation.fx-rate-number': '환율은 유효한 숫자여야 합니다.',
  'trade.validation.fx-rate-positive': '환율은 0보다 커야 합니다.',
  'dashboard.conversion.using-manual-rate':
    '{count} {tradeLabel}에 수동 환율 사용',
  'dashboard.conversion.partial-warning':
    '⚠ {currencies}의 비용/리스크는 환산할 수 없어 제외되었습니다',
  'trade-sync.providers.title': '거래 동기화',

  'trade-sync.tradovate.pending-acks': '대기 중인 로컬 ACK {count}개',

  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Rithmic 거래를 클라우드에서 동기화하고 이 보관함에 반영합니다.',
  'trade-sync.rithmic.plugin-sync-description':
    'Journalit.co에서 Rithmic을 연결한 뒤 여기서 동기화하면 최신 Rithmic 활동이 이 보관함에 기록됩니다.',
  'trade-sync.rithmic.status-failed': 'Rithmic 상태를 불러올 수 없습니다.',
  'trade-sync.rithmic.status.connecting': '연결 중',
  'trade-sync.rithmic.status.paused': '일시 중지됨',
  'trade-sync.rithmic.status.waiting-for-accounts': '계좌 대기 중',
  'trade-sync.rithmic.status.reauthorization-required':
    'Journalit.co에서 재인증이 필요합니다',
  'trade-sync.rithmic.status.error': '연결 오류',
  'trade-sync.rithmic.no-connections':
    'Journalit.co에서 Rithmic 계정을 연결하면 여기서 동기화할 수 있습니다.',
  'trade-sync.rithmic.connect': '연결',
  'trade-sync.rithmic.manage': 'Journalit.co에서 관리',
  'trade-sync.rithmic.system': 'Rithmic 시스템',
  'trade-sync.rithmic.accounts': '계정',
  'trade-sync.rithmic.last-sync': '마지막 동기화',
  'trade-sync.rithmic.never': '없음',
  'trade-sync.rithmic.job.running': '동기화 진행 중…',
  'trade-sync.rithmic.job.last': '최근 작업: {status}',
  'trade-sync.job.status.queued': '대기 중',
  'trade-sync.job.status.running': '실행 중',
  'trade-sync.job.status.succeeded': '성공',
  'trade-sync.job.status.partial': '부분 완료',
  'trade-sync.job.status.failed': '실패',
  'trade-sync.job.status.cancelled': '취소됨',
  'trade-sync.job.status.unknown': '알 수 없음',
  'trade-sync.rithmic.sync-to-vault': '동기화',
  'trade-sync.rithmic.syncing': '동기화 중…',
  'trade-sync.rithmic.mapping-required':
    '동기화하는 각 Rithmic 계정에 로컬 보관함 계정을 선택하세요.',
  'trade-sync.rithmic.sync-complete-connection':
    '{connection} 동기화가 완료되었습니다.',
  'trade-sync.rithmic.sync-partial-connection':
    '{connection} 동기화가 완료되었지만 문제가 있습니다.',
  'trade-sync.rithmic.sync-all': '모두 동기화',
  'trade-sync.rithmic.sync-all-complete':
    '{total}개 중 {succeeded}개의 Rithmic 연결을 동기화했습니다.',
  'trade-sync.rithmic.sync-all-partial':
    '{total}개 중 {succeeded}개의 Rithmic 연결을 동기화했습니다. 문제가 있는 연결을 확인하세요.',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic은 활성 세션을 하나만 허용합니다. 이 Rithmic 로그인을 사용하는 R|Trader, NinjaTrader 등을 닫아 주세요.',
  'trade-sync.rithmic.error.auto-retry':
    'Journalit이 자동으로 다시 시도합니다.',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic이 저장된 자격 증명을 거부했습니다. Journalit.co에서 업데이트한 뒤 다시 시도하세요.',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic은 R|Trader에서 시장 데이터 계약 서명을 요구합니다. 서명한 뒤 다시 시도하세요.',
  'trade-sync.rithmic.error.disabled':
    '이 연결에서는 Rithmic 동기화가 비활성화되어 있습니다. Journalit.co에서 관리하세요.',
  'trade-sync.rithmic.error.sync-failed':
    'Rithmic 동기화에 실패했습니다. Journalit.co에서 연결을 확인한 뒤 다시 시도하세요.',
  'trade-sync.broker.mapping-unsaved-hint': '매핑은 동기화할 때 저장됩니다.',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    '저장되지 않은 계정 변경 사항이 있습니다. 해당 연결을 동기화하면 저장됩니다.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    '먼저 동기화할 각 계정에 Journalit 계정을 선택하세요.',
  'trade-sync.broker.sync-all-blocked.running-job':
    '이미 동기화가 실행 중입니다.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    '동기화할 수 있는 연결이 없습니다.',
  'trade-sync.rithmic.connect-another': '다른 Rithmic 계정 연결',
  'trade-sync.rithmic.error.sync-failed-detail':
    'Rithmic 동기화에 실패했습니다: {message}',
  'notice.error.canonical-trade-type-change':
    '브로커와 동기화된 트레이드는 다른 트레이드 유형으로 변경할 수 없습니다.',
  'trade-sync.import.account.conflict-repair':
    '중복된 canonicalTradeId 노트가 발견되었습니다. 하나를 남기고 중복 노트에서 canonicalTradeId를 제거하거나 해당 노트를 삭제하세요. 파일 이름 변경만으로는 충돌이 해결되지 않습니다.',
  'setups.create.field.tags': '태그',
  'setups.create.placeholder.tags': '모멘텀, 돌파, 오전',
  'setups.view.overview.tag-filter.aria': '셋업 필터링',
  'setups.view.overview.tag-filter.reset': '초기화',
  'setups.view.overview.tag-filter.untagged': '태그 없음',
  'setups.view.overview.tag-filter.empty': '이 필터와 일치하는 셋업이 없습니다',
  'setups.view.overview.tag-filter.empty-submessage':
    '더 많은 셋업을 보려면 필터를 조정하거나 지우세요.',

  'setups.view.tags': '태그',
  'setups.create.error.tag-save-failed':
    '태그를 전역 태그 목록에 저장하지 못했습니다.',
  'settings.customization.options.confirm.remove-tag-message':
    '전역 태그 “{option}”을 삭제할까요? 모든 Journalit 거래 및 셋업 노트에서 제거됩니다.',
  'settings.customization.options.confirm.reset-tag-message':
    '전역 태그 목록과 색상을 기본값으로 초기화할까요? 거래 및 셋업 노트에 이미 지정된 태그는 해당 노트에 유지됩니다.',
  'home.mode.overview': '개요',
  'home.mode.dashboard': '대시보드',
  'home.mode.aria': '홈 모드 전환',
  'home.filters.period': '기간',
  'home.filters.trade-type': '거래 유형',
  'home.filters.accounts': '계정',
  'home.filters.back': '뒤로',
  'filter.reset': '필터 초기화',
  'home.guide.modes.title': '마지막으로 하나 더: 대시보드',
  'home.guide.modes.description':
    '개요와 대시보드는 이 페이지를 공유합니다. 지금 대시보드로 전환하여 성과 통계에 대한 짧은 투어를 계속하세요.',
  'home.guide.whats-new.mode.title': '하나의 홈, 두 가지 모드',
  'home.guide.whats-new.mode.description':
    '개요와 대시보드가 이제 한 페이지를 공유합니다. 레이아웃과 스크롤 위치를 유지한 채 전환할 수 있습니다.',
  'home.guide.whats-new.filters.title': '홈 필터를 한곳에서',
  'home.guide.whats-new.filters.description':
    '필터 버튼을 열어 기간, 거래 유형 또는 계정을 간결한 계층 메뉴에서 선택하세요.',
  'home.guide.whats-new.done.title': '작업 공간의 맥락을 유지합니다',
  'home.guide.whats-new.done.description':
    '개인 위젯에는 개요를, 심층 분석에는 대시보드를 사용하세요. 각 모드는 자체 필터와 레이아웃을 유지합니다.',
  'home.widget.current-streak.description': '거래 및 리뷰 스트릭 추적',

  'home.widget.streak.kind.trade-outcome': '거래 결과',
  'home.widget.streak.kind.trade-review': '거래 리뷰',
  'home.widget.streak.kind.drc-review': 'DRC 리뷰',
  'home.widget.streak.kind.weekly-review': '주간 리뷰',
  'home.widget.streak.kind.monthly-review': '월간 리뷰',
  'home.widget.streak.configure': '스트릭 유형 선택',
  'home.widget.streak.configure-aria': '{kind} 스트릭 구성',
  'home.widget.streak.no-review-streak': '활성 리뷰 스트릭 없음',
  'home.widget.streak.start-reviewing': '리뷰를 시작해 스트릭을 만드세요',
  'home.widget.streak.keep-reviewing': '계속 리뷰해 스트릭을 유지하세요',
  'home.widget.streak.reviewed-trades-in-a-row.one': '연속 리뷰한 거래',
  'home.widget.streak.reviewed-trades-in-a-row.few': '연속 리뷰한 거래',
  'home.widget.streak.reviewed-trades-in-a-row.many': '연속 리뷰한 거래',
  'home.widget.streak.reviewed-trades-in-a-row.other': '연속 리뷰한 거래',
  'home.widget.streak.reviewed-days-in-a-row.one': '연속 리뷰한 일수',
  'home.widget.streak.reviewed-days-in-a-row.few': '연속 리뷰한 일수',
  'home.widget.streak.reviewed-days-in-a-row.many': '연속 리뷰한 일수',
  'home.widget.streak.reviewed-days-in-a-row.other': '연속 리뷰한 일수',
  'home.widget.streak.reviewed-weeks-in-a-row.one': '연속 리뷰한 주 수',
  'home.widget.streak.reviewed-weeks-in-a-row.few': '연속 리뷰한 주 수',
  'home.widget.streak.reviewed-weeks-in-a-row.many': '연속 리뷰한 주 수',
  'home.widget.streak.reviewed-weeks-in-a-row.other': '연속 리뷰한 주 수',
  'home.widget.streak.reviewed-months-in-a-row.one': '연속 리뷰한 개월 수',
  'home.widget.streak.reviewed-months-in-a-row.few': '연속 리뷰한 개월 수',
  'home.widget.streak.reviewed-months-in-a-row.many': '연속 리뷰한 개월 수',
  'home.widget.streak.reviewed-months-in-a-row.other': '연속 리뷰한 개월 수',
  'home.widget.streak.missed-trades.one':
    '마지막 리뷰 이후 거래 {count}개를 놓쳤습니다',
  'home.widget.streak.missed-trades.few':
    '마지막 리뷰 이후 거래 {count}개를 놓쳤습니다',
  'home.widget.streak.missed-trades.many':
    '마지막 리뷰 이후 거래 {count}개를 놓쳤습니다',
  'home.widget.streak.missed-trades.other':
    '마지막 리뷰 이후 거래 {count}개를 놓쳤습니다',
  'home.widget.streak.missed-days.one':
    '마지막 리뷰 이후 {count}일을 놓쳤습니다',
  'home.widget.streak.missed-days.few':
    '마지막 리뷰 이후 {count}일을 놓쳤습니다',
  'home.widget.streak.missed-days.many':
    '마지막 리뷰 이후 {count}일을 놓쳤습니다',
  'home.widget.streak.missed-days.other':
    '마지막 리뷰 이후 {count}일을 놓쳤습니다',
  'home.widget.streak.missed-weeks.one':
    '마지막 리뷰 이후 {count}주를 놓쳤습니다',
  'home.widget.streak.missed-weeks.few':
    '마지막 리뷰 이후 {count}주를 놓쳤습니다',
  'home.widget.streak.missed-weeks.many':
    '마지막 리뷰 이후 {count}주를 놓쳤습니다',
  'home.widget.streak.missed-weeks.other':
    '마지막 리뷰 이후 {count}주를 놓쳤습니다',
  'home.widget.streak.missed-months.one':
    '마지막 리뷰 이후 {count}개월을 놓쳤습니다',
  'home.widget.streak.missed-months.few':
    '마지막 리뷰 이후 {count}개월을 놓쳤습니다',
  'home.widget.streak.missed-months.many':
    '마지막 리뷰 이후 {count}개월을 놓쳤습니다',
  'home.widget.streak.missed-months.other':
    '마지막 리뷰 이후 {count}개월을 놓쳤습니다',
  'account-dashboard.title': '계정',
  'home.quick-links.trading-dashboard': '대시보드',
  'home.quick-links.account-dashboard': '계정',
  'navigation.items.nav-dashboard': '대시보드',
  'navigation.items.nav-account-dashboard': '계정',

  'settings.general.home-background-dashboard': '대시보드에도 배경 표시',
  'settings.general.home-background-dashboard-desc':
    '대시보드 모드에서도 동일한 배경 이미지를 사용합니다.',
  'settings.general.home-background-dashboard-aria':
    '홈 배경을 대시보드에 표시',
  'datepicker.placeholder.second': 'SS',
  'settings.general.show-seconds': '거래 시간에 초 표시',
  'settings.general.show-seconds-desc':
    '거래 진입 및 청산 시간을 입력할 때 초를 표시합니다.',
  'settings.general.show-seconds-aria': '거래 시간에 초 표시',
  'account.prop-challenge.summary.status.payout_ready': 'Payout ready',
  'account.prop-challenge.ribbon.passed': '{phase} 통과',
  'account.prop-challenge.ribbon.failed': '{phase} 실패',
  'account.prop-challenge.ribbon.action.advance': '{phase}(으)로 진행',
  'account.prop-challenge.ribbon.action.advance-short': '진행',
  'account.prop-challenge.ribbon.action.mark-passed': '통과로 표시',
  'account.prop-challenge.ribbon.action.archive': '보관',
  'account.prop-challenge.actions.stale':
    '이 챌린지가 다른 곳에서 업데이트되었습니다. 확인 후 다시 시도하세요.',
  'account.prop-challenge.confirm.reopen':
    '{account}을(를) 다시 열까요? 챌린지 “{challenge}”이(가) {phase}(으)로 돌아갑니다.',
  'account.prop-challenge.confirm.fail':
    '{account}을(를) 실패로 표시할까요? 챌린지 “{challenge}”이(가) {phase}에서 종료됩니다.',
  'account.prop-challenge.confirm.archive-failed':
    '{account}을(를) 보관할까요? 챌린지 “{challenge}”에 실패했습니다. 계정이 보관됨으로 이동합니다.',
  'account.prop-challenge.confirm.archive-passed':
    '{account}을(를) 보관할까요? 챌린지 “{challenge}”을(를) 통과했습니다. 계정이 보관됨으로 이동합니다.',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → 챌린지 통과',
  'account.prop-challenge.ribbon.action.record-payout': '출금 기록',
  'account.prop-challenge.ribbon.action.record-payout-short': '출금',
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
  'account.prop-challenge.payout.timezone-invalid': '알 수 없는 시간대입니다.',
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
    '이 계정이 선택된 상태로 트레이드 로그를 엽니다. 다단계 챌린지에서는 버튼이 보고 있는 단계를 따르며, 화살표에서 다른 단계 또는 전체 계정을 선택할 수 있습니다.',
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

  'account.prop-challenge.ledger.help.open': '{rule} 안내',
  'account.prop-challenge.ledger.help.profit_target':
    '이 금액만큼 계정을 불려야 단계를 통과합니다. 청산된 거래만 반영됩니다.',
  'account.prop-challenge.ledger.help.profit_target.example':
    '이 계좌는 이익 {target}이 필요합니다. 지금까지 {current}, 남은 금액 {remaining}.',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    '목표 달성: {current} / {target}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    '잔액이 시작 잔액보다 내려갈 수 있는 최대 폭입니다. 하한은 움직이지 않습니다.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    '이 계좌의 하한은 {floor}입니다. 잔액은 그 위를 유지해야 합니다. 한도 {limit} 중 {buffer}가 남았습니다.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    '하한은 최고 일말 잔액을 따르며 올라가기만 하고, 업체의 잠금 수준에서 고정됩니다.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    '지금 하한은 {floor}(최고 종가 − {limit})이며 더 높은 종가마다 올라갑니다. {buffer} 남음.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    '플로어는 미실현 이익을 포함해 언제든 최고 잔고를 따라갑니다. Journalit은 청산된 거래만 보므로 이 플로어는 각 청산 후 최고 잔고를 따라가며, 보유 중 도달한 고점은 반영되지 않습니다. 회사의 수치를 확인하세요.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    '지금 하한은 {floor}(청산 후 최고 잔액 − {limit})입니다. {buffer} 남음. 업체의 실시간 수치가 더 타이트할 수 있습니다.',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    '한 거래일에 잃을 수 있는 최대 금액입니다. 도달하면 단계 실패이거나 다음 세션까지 중단됩니다(업체마다 다름).',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    '오늘: 일일 한도 {limit} 중 {used} 손실, {left} 남음.',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    '하루 이익의 일부만 목표에 반영됩니다. 상한을 넘는 이익은 보유되지만 집계되지 않습니다.',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    '하루 이익 중 {cap}만 반영됩니다. 상한을 넘어 번 {excluded}는 지금까지 반영되지 않습니다.',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    '이 이익 이상의 거래일이 하루면 실계좌 심사 대상이 됩니다.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    '{trigger} 이상인 날이 하루면 자격. 지금까지 최고일은 {bestDay}.',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    '청산 거래가 하루 한 건 이상인 날입니다. 목표를 빨리 달성해도 이 일수 전에는 통과할 수 없습니다.',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '거래일 {current} / {target} 완료, {remaining} 남음.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    '업체의 최소 일일 이익 이상으로 마감한 거래일입니다. 본전이거나 더 작은 이익은 세지 않습니다.',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{minimum} 이상으로 마감한 날 {current} / {target}, {remaining} 남음.',
  'account.prop-challenge.ledger.help.consistency':
    '최고 하루가 단계 총이익에서 차지하는 비중의 상한입니다. 다른 날에 더 벌어 맞추고, 손실로 맞추지 마세요.',
  'account.prop-challenge.ledger.help.consistency.example':
    '최고일 {bestDay}은 총이익 {total}의 {share}입니다. {maximum}에 맞추려면 총이익이 {goal}에 도달해야 합니다.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    '최고일 {bestDay}은 총이익의 {share}이며 {maximum} 한도 이내입니다.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    '아직 이익이 없어 비교할 최고일이 없습니다.',
  'account.prop-challenge.ledger.help.max_position_size':
    '모든 미청산을 합쳐 한 번에 보유할 수 있는 최대 계약 수입니다. 일부 업체는 이익이 늘면 한도를 올립니다.',
  'account.prop-challenge.ledger.help.max_position_size.example':
    '지금은 한 번에 최대 {maximum}계약. 지금까지 가장 큰 포지션은 {current}.',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    '현재 출금 주기의 거래일입니다. 승인된 출금 후 다시 셉니다.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '이 주기의 거래일 {current} / {target}, {remaining} 남음.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    '이 주기에서 업체의 최소 일일 이익 이상으로 마감한 거래일입니다.',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '이 주기에서 {minimum} 이상인 날 {current} / {target}, {remaining} 남음.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    '주기 시작 이후 이익이 이 금액에 도달해야 신청할 수 있습니다.',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '이 주기 수익 {current}, 필요 금액 {target}.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    '신청 시 잔액이 이 수준 이상이어야 합니다.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    '잔액 {current}. 최소 {target}이어야 합니다.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    '첫 출금 이후 새 주기는 다시 신청하기 전에 이익이어야 합니다.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    '주기 이익은 {current}입니다. 0보다 커야 합니다.',
  'account.prop-challenge.ledger.help.payout.consistency':
    '최고일이 주기 이익에서 차지하는 비중의 상한입니다.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    '최고 수익일 {bestDay}은(는) 사이클 수익 {total}의 {share}입니다. {maximum}에 맞추려면 사이클 수익이 {goal}에 도달해야 합니다.',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    '최고 수익일 {bestDay}은(는) 사이클 수익의 {share}로 한도 {maximum} 이내입니다.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    '아직 사이클 수익이 없어 비교할 최고 수익일이 없습니다.',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    '업체가 받는 최소 출금액입니다. 가용 금액이 먼저 그 값에 도달해야 합니다.',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '{current} 사용 가능. 업체의 최소 신청액은 {target}.',
  'account.prop-challenge.ledger.help.payout.payout_count':
    '이 단계에서 허용하는 출금 횟수입니다. 한도를 쓰면 단계가 끝납니다.',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '이 단계의 출금 {current} / {target} 사용.',
  'account.prop-challenge.ledger.help.payout.request_window':
    '신청은 이 평일에만, 업체 시간대로 받습니다.',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    '오늘은 {today}입니다. 신청은 {days}({timeZone}).',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    '주기 첫 거래 이후 시간이 이 값에 도달해야 신청할 수 있습니다.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '주기 첫 거래 이후 {current} / {target}시간.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    '이 주기만이 아니라 펀디드 단계 전체의 적격 일수입니다. 도달하면 출금이 열립니다.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '전체 단계의 적격일 {current} / {target}.',
  
  'account.merge.challenge.move-earlier': '{account} 앞으로',
  'account.merge.challenge.move-later': '{account} 뒤로',
  'account.merge.warning.use-profile-balance': '프로필 잔액 사용',
  'account.merge.warning.edit-phases': '단계 편집',
  'account.merge.title': '챌린지 설정',
  'account.merge.loading': '불러오는 중...',
  'account.merge.step.accounts': '계정',
  'account.merge.step.phases': '단계',
  'account.merge.step.review': '검토',
  'account.merge.accounts.title': '병합할 계정',
  'account.merge.accounts.show-archived': '보관된 계정 표시',
  'account.merge.accounts.empty': '대상 계정이 없습니다',
  'account.merge.target.title': '대상 계정',
  'account.merge.target.keep': '유지',
  'account.merge.target.new': '새 이름',
  'account.merge.phase.name': '단계 이름',
  'account.merge.phase.status': '상태',
  'account.merge.phase.started': '시작',
  'account.merge.phase.completed': '종료',
  'account.merge.phase.no-rules': '없음',
  'account.merge.review.notes': '이동된 거래',
  'account.merge.review.identities': '브로커 계좌',
  'account.merge.warning.trade-outside-window': '단계 기간을 벗어난 거래',
  'account.merge.warning.identity-shared': '여러 계정이 같은 식별자를 사용',
  'account.merge.warning.copy-trading-dropped': '카피 트레이딩 기간이 삭제됨',
  'account.merge.error.too-few-sources': '계정을 두 개 이상 선택하세요.',
  'account.merge.error.duplicate-source': '같은 계정이 중복되었습니다.',
  'account.merge.error.target-exists': '그 이름은 다른 계정의 것입니다.',
  'account.merge.error.currency-mismatch': '계정의 통화가 서로 다릅니다.',
  'account.merge.error.timeline-not-monotonic':
    '단계 시작 시각은 오름차순이어야 합니다.',
  'account.merge.error.invalid-override': '이 단계의 날짜를 확인하세요.',
  'account.merge.error.source-missing': '설정이 저장되지 않은 계정이 있습니다.',
  'account.merge.error.unknown': '병합에 실패했습니다.',
  'account.merge.action.merge': '병합',
  'account.merge.action.undo': '실행 취소',
  'account.merge.action.delete': '이전 계정 삭제',
  'account.merge.notice.converted': '챌린지로 변환됨',
  'account.merge.notice.title': '{accounts} 에서 병합',
  'account.merge.notice.error': '작업에 실패했습니다.',
  'account.merge.undo.title': '병합 실행 취소',
  'account.merge.undo.message': '이전 계정과 거래를 복원합니다.',
  'account.merge.delete.title': '이전 계정 삭제',
  'account.merge.delete.message':
    '보관된 이전 계정을 삭제합니다. 되돌릴 수 없습니다.',
  'command.open-legacy-challenge-onboarding': '프롭 챌린지 설정',
  'account.merge.step.challenge': '챌린지',
  'account.merge.action.convert': '변환',
  'account.merge.challenge.accounts': '계좌',
  'account.merge.challenge.order-hint': '가장 오래된 단계부터',
  'account.merge.challenge.single-hint': '이 계좌는 단독 챌린지가 됩니다',
  'account.merge.phase.identities-count': '식별자 {count}개',
  'account.merge.phase.pending': '대기 중',
  'account.merge.review.phases': '단계',
  'account.merge.review.archived': '보관됨',
  'account.merge.review.open': '진행 중',
  'account.merge.sequence': '챌린지 {index} / {total}',
  'account.merge.warning.balance-differs':
    '시작 잔액이 프롭사 프로필과 다릅니다',
  'account.merge.error.profile-phase-mismatch':
    '프롭사 프로필의 단계 수보다 계좌가 많습니다',
  'account.merge.error.profile-currency-mismatch':
    '프로필 통화가 이 계정들과 다릅니다.',
  'account.merge.error.source-changed':
    '계정이 변경되었습니다. 병합을 다시 검토하세요.',
  'account.merge.error.multiple-active-phases':
    '활성 상태로 남을 수 있는 계정은 마지막 계정뿐입니다.',
  'account.merge.error.copy-trading-overlap':
    '카피 트레이딩 기간이 겹칩니다. 먼저 하나를 종료하세요.',
  'onboarding.legacy-challenge.legend':
    '한 챌린지의 단계였던 계좌들을 묶으세요. 단독 계좌는 그 자체로 챌린지가 됩니다.',
  'onboarding.legacy-challenge.assign.leave': '그대로 두기',
  'onboarding.legacy-challenge.assign.own': '단독 챌린지',
  'onboarding.legacy-challenge.assign.group': '챌린지 {letter}',
  'onboarding.legacy-challenge.assign.new-group': '새 챌린지…',
  'onboarding.legacy-challenge.action.continue': '계속',
  'onboarding.legacy-challenge.action.continue-count': '{count}개 설정',
  'guide.action-step.dismiss': '나중에',
  'guide.legacy-challenge.title': '기존 계좌',
  'guide.legacy-challenge.description':
    '한 챌린지의 단계였던 계좌들을 합치거나, 계좌 하나를 단독 챌린지로 만드세요.',
  'guide.legacy-challenge.action': '계좌 설정',
  'onboarding.legacy-challenge.title': '프롭 챌린지',
  'onboarding.legacy-challenge.action.skip': '건너뛰기',
  'onboarding.legacy-challenge.accounts.show-archived': '보관된 항목 표시',
  'onboarding.legacy-challenge.accounts.empty': '설정할 계정이 없습니다',
  'onboarding.legacy-challenge.loading': '불러오는 중...',
  'onboarding.legacy-challenge.suggested': '추천',
  'onboarding.legacy-challenge.row.aria': '{account} 작업',
  'onboarding.legacy-challenge.status.combined': '병합됨',
  'onboarding.legacy-challenge.status.converted': '변환됨',
  'onboarding.legacy-challenge.entry.name': '프롭 챌린지',
  'onboarding.legacy-challenge.entry.desc':
    '기존 계정을 챌린지로 병합하거나 변환합니다.',
  'onboarding.legacy-challenge.entry.action': '설정',

  'view.home': '홈',
  'common.lose': '패배',

  'dashboard.conversion.requires-conversion':
    '다중 통화 손익 차트에는 환율 변환이 필요합니다.',

  'form.layout.guide-trigger-label': '양식 사용자 지정',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'session-log.session-group.unplanned': '계획 외 @ {time}',
  'session-mode.unplanned.name': '계획되지 않은 세션',
  'session-mode.unplanned.start': '계획되지 않은 세션 시작',
  'session-mode.unplanned.stop': '세션 종료',
  'session-mode.unplanned.badge': '계획 외',
  'session-mode.unplanned.status.live': '{time}에 시작 · {elapsed} 경과',
  'session-mode.unplanned.ended.summary':
    '계획되지 않은 세션 · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': '계획되지 않은 세션 시작',
  'session-mode.unplanned.modal.description':
    '현재 계획된 세션 시간대가 아닙니다. 이 세션은 일일 리뷰에 계획 외 세션으로 표시됩니다. 지금 거래하는 이유를 적어 주세요.',
  'session-mode.unplanned.modal.reason-label': '이유',
  'session-mode.unplanned.modal.reason-placeholder':
    '예: 14:00 FOMC, 오전 세션을 놓침',
  'session-mode.unplanned.modal.reason-required':
    '시작하기 전에 이유를 입력하세요.',
  'session-mode.unplanned.notice.started': '계획되지 않은 세션을 시작했습니다.',
  'session-mode.unplanned.notice.stopped': '계획되지 않은 세션을 종료했습니다.',
  'session-mode.unplanned.notice.blocked-live':
    '이미 진행 중인 세션이 있습니다.',
  'session-mode.unplanned.notice.none-running':
    '진행 중인 계획 외 세션이 없습니다.',
  'session-mode.unplanned.notice.failed':
    '계획되지 않은 세션을 업데이트하지 못했습니다. 자세한 내용은 콘솔을 확인하세요.',
  'calendar.aria.open-daily-review': '{date} 일일 리뷰 열기',
  'calendar.aria.open-weekly-review': '{date} 주간 리뷰 열기',
  'calendar.aria.open-monthly-review': '{date} 월간 리뷰 열기',
  'calendar.aria.open-quarterly-review': '{date} 분기 리뷰 열기',
};

export default ko;
