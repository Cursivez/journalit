
import type { Lang } from './en';

const ko: Partial<Lang> = {
  
  
  

  
  'command.add-trade': '새 거래 추가',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Trade Import 열기',

  
  'command.create-drc': 'DRC 열기 (일일 리포트 카드)',
  'command.create-weekly-review': '주간 리뷰 열기',
  'command.create-monthly-review': '월간 리뷰 열기',
  'command.create-quarterly-review': '분기 리뷰 열기',
  'command.create-yearly-review': '연간 리뷰 열기',

  
  'command.open-dashboard': '트레이딩 대시보드 열기',
  'command.open-account-dashboard': '계좌 대시보드 열기',
  'command.open-trade-log': '거래 기록 열기',
  'command.open-home': '홈 화면 열기',
  'command.open-position-size-calculator': '포지션 크기 계산기 열기',

  
  'navigation.items.nav-weekly': '이번 주 리뷰',
  'navigation.items.nav-monthly': '이번 달 리뷰',
  'navigation.items.nav-quarterly': '이번 분기 리뷰',
  'navigation.items.nav-yearly': '올해 리뷰',

  
  'backend.cards.sync.cancel': '동기화 취소',

  
  'command.replay-onboarding': '온보딩 다시 보기',

  
  
  
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
  'command.open-release-notes': '릴리스 노트 보기',

  
  'command.open-layout-builder': '레이아웃 빌더 열기',
  'command.switch-template': '템플릿 전환',

  
  
  
  'auth.title.already-logged-in': 'Already Logged In',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign In to Journalit',
  'auth.label.email': 'Email Address',
  'auth.placeholder.email': 'your.email@example.com',

  
  
  
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
  'form.layout.settings-desc':
    '거래를 기록하는 방식과 거래 양식에 표시할 선택 블록을 고르세요.',
  'form.layout.core-fields-note':
    '거래 유형, 계정, 자산 유형, 종목, 방향, 선택한 입력 모드에 필요한 가격 또는 P&L 입력은 계속 표시됩니다.',
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
  'form.layout.item.realized-pnl-preview': '부분 청산 P&L 요약',
  'form.layout.item.realized-pnl-preview-desc':
    '부분 청산 후 열린 거래에서만 표시되며 위치는 고정됩니다.',
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
  'form.field.size': '수량',
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
  'form.placeholder.custom-tag': '사용자 태그를 입력하고 Enter를 누르세요',
  'form.placeholder.thesis': '이 거래에 대한 논거를 입력하세요...',
  'form.placeholder.pnl': '총 손익 입력',
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
  'form.ideal-exit.subtitle': '실행 리뷰를 위한 사후 분할 청산.',
  'form.ideal-exit.coverage': '이상적 크기',
  'form.ideal-exit.price': '이상 가격',
  'form.ideal-exit.size': '크기',
  'form.ideal-exit.remove': '이상 청산 삭제',
  'form.ideal-exit.add': '+ 이상 청산 추가',
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

  'form.account-empty-state.title': '거래를 추가하기 전에 계좌를 만드세요',
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
  'button.close': '닫기',
  'button.confirm': '확인',
  'button.submit': '제출',

  'button.add-trade': '거래 추가',
  'button.update-trade': '거래 업데이트',
  'button.save-changes': '변경사항 저장',
  'button.create-trade': '거래 생성',
  'button.delete-all': '전체 삭제',
  'button.clear-all': '전체 지우기',
  'button.save-name-only': '이름만 저장',
  'button.cancel-action': '작업 취소',
  'button.cancel-reset': '초기화 취소',
  'button.proceed-anyway': '그래도 진행',
  'button.mark-reviewed': '검토 완료로 표시',
  'button.add-first-goal': '첫 번째 목표 추가',
  'button.add-first-event': '첫 번째 이벤트 추가',
  'button.create-daily-review': '일일 리뷰 생성',
  'button.apply-settings': '설정 적용',
  'button.learn-more': '더 알아보기',
  'button.upload-image': '미디어 업로드',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': '수정',
  'validation.fix-errors': '다음 오류를 수정해주세요:',

  'validation.complete-required': '모든 필수 필드를 완성해주세요',
  'validation.map-required-fields':
    '가져오기 전에 모든 필수 필드를 매핑해주세요',

  
  
  
  'notice.verification-sent':
    '인증 코드가 전송되었습니다! 이메일을 확인하세요.',
  'notice.login-success': '로그인 성공!',
  'notice.new-verification-sent':
    '새 인증 코드가 전송되었습니다! 이메일을 확인하세요.',
  'notice.logout-success': '로그아웃 완료',
  'notice.hotkey-set': 'Hotkey set: {hotkey}',
  'notice.ftp-created': 'FTP 자격 증명이 성공적으로 생성되었습니다',
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
  'notice.reset-timeframes': '타임프레임을 기본값으로 초기화함',
  'notice.custom-fields-imported':
    '{count}개의 사용자 정의 필드를 성공적으로 가져왔습니다',
  'notice.csv-parsed': 'CSV/XLSX/XLS 파싱 성공: {count}개 행',
  'notice.setups-added': '{count}개 거래에 셋업 추가됨',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': '{count}개 거래에 실수 추가됨',

  
  
  
  'notice.error.open-journalit':
    'Journalit을 열지 못했습니다. Obsidian을 다시 로드해보세요.',
  'notice.error.open-drc': 'DRC 열기 실패: {error}',
  'notice.error.open-dashboard': 'Failed to open dashboard: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': '주간 리뷰 열기 실패: {error}',
  'notice.error.open-monthly-review': '월간 리뷰 열기 실패: {error}',
  'notice.error.open-quarterly-review': '분기 리뷰 열기 실패: {error}',
  'notice.error.open-yearly-review': '연간 리뷰 열기 실패: {error}',
  'notice.error.sync-trades': '거래 동기화 실패: {error}',
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

  'notice.error.invalid-drc-date': '잘못된 DRC 날짜',
  'notice.error.invalid-drc-missed':
    '잘못된 DRC 날짜. 놓친 거래를 생성할 수 없습니다.',
  'notice.error.trade-not-found': '거래 파일을 찾을 수 없음: {path}',
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

  
  
  
  'notice.info.no-sync': '진행 중인 동기화가 없습니다',

  'notice.info.settings-recovered':
    '설정이 백업에서 복구되었습니다. 일부 최근 변경사항이 손실될 수 있습니다.',
  'notice.info.cannot-remove-locked': '잠긴 위젯은 제거할 수 없습니다',

  
  
  
  'tradelog.title': '거래 기록',
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

  'form.layout.guide-trigger-label': '양식 사용자 지정',
  'trade-form.guide.customization-modal.title': '양식을 내 워크플로에 맞추세요',
  'trade-form.guide.customization-modal.description':
    '여기에서 선택 블록을 표시, 숨김, 재정렬할 수 있습니다. 실제로 사용하는 필드에만 양식을 집중하세요.',
  'trade-form.guide.finish.title': '이것이 사용자 지정 기능입니다',
  'trade-form.guide.finish.description':
    '거래 양식을 다른 저널 작성 흐름에 맞춰야 할 때 언제든 이 버튼으로 다시 설정할 수 있습니다.',
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

  
  'dashboard.filter.accounts.all': '모든 계좌',
  'dashboard.filter.accounts.n-selected': '{count}개 계좌',
  'dashboard.filter.accounts.select-all': '모두 선택',
  'dashboard.filter.accounts.select-all-option': '-- 모두 선택 --',
  'dashboard.filter.accounts.none-found': '계좌를 찾을 수 없습니다',

  
  'dashboard.filter.mistakes.all': '모든 실수',
  'dashboard.filter.mistakes.none': '실수 없음',
  'dashboard.filter.mistakes.n-selected': '{count}개 실수',
  'dashboard.filter.mistakes.select-all': '모두 선택',
  'dashboard.filter.mistakes.none-found': '실수를 찾을 수 없습니다',

  
  
  
  'view.home': '홈',
  'view.dashboard': '대시보드',
  'view.trade-log': '거래 기록',
  'view.account-dashboard': '계좌 대시보드',
  'view.layout-builder': '레이아웃 빌더',
  'view.csv-import': 'Trade Import',

  
  
  
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  
  
  'csv.errors.copy-shareable': '공유 가능한 보고서 복사',
  'csv.errors.copy-report': '보고서 복사',
  'csv.errors.copy-detailed': '상세 보고서 복사',

  
  
  
  'csv.account-selector.loading': '계좌 불러오는 중...',
  'csv.account-selector.no-accounts': '계좌를 찾을 수 없습니다.',
  'csv.account-selector.create-account-hint':
    '거래를 가져오기 전에 계좌를 생성해주세요.',
  'csv.account-selector.create-account-cta': '계좌 생성',
  'csv.account-selector.label': '계좌 선택',

  
  'csv.preview-first-note':
    'Preview is free. Importing into your vault requires PRO activation.',
  'csv.gate.import.title': 'PRO required to import',
  'csv.gate.import.description':
    'Importing trades into your vault is a PRO feature. Activate PRO to continue.',
  'csv.gate.templates.tooltip': 'PRO required (activate to use templates).',
  'csv.gate.ai.tooltip': 'PRO required (activate to use AI mapping).',

  
  
  
  'account.edit.modal.change-date.message':
    '계정 "{account}"의 생성 날짜를 {oldDate}에서 {newDate}(으)로 변경하려고 합니다.',
  'account.edit.modal.change-date.warning':
    '이 작업은 초기 입금 거래 날짜를 업데이트하며 계좌 연수 계산, 월간 청구 주기 및 기타 날짜 기반 지표에 영향을 줄 수 있습니다.',
  'account.edit.modal.change-date.info':
    '이 작업은 초기 입금 거래 날짜를 새 생성 날짜와 일치하도록 업데이트합니다.',
  'account.edit.modal.change-balance.message':
    '초기 잔고를 {oldBalance}에서 {newBalance}(으)로 변경하려고 합니다.',
  'account.edit.modal.change-balance.warning':
    '이 계정의 초기 잔고를 변경하려고 합니다.',
  'account.edit.modal.change-balance.info':
    '이 작업은 모든 잔고 계산, 손익 비율, 드로다운 계산 및 거래 내역에 영향을 미칩니다.',
  'account.edit.modal.change-balance.info2':
    '현재 잔고는 새로운 초기 잔고와 모든 거래 손익을 기반으로 다시 계산됩니다.',
  'account.edit.modal.change-balance.info3':
    '이 변경은 계정 지표 및 과거 데이터의 정확성에 상당한 영향을 미칠 수 있습니다.',
  'account.edit.modal.delete.question':
    '계정 "{name}"을(를) 영구적으로 삭제하시겠습니까?',
  'account.edit.modal.delete.warning':
    '이 계정을 영구적으로 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.',

  
  'account.edit.error.name-exists': '계정 "{name}"이(가) 이미 존재합니다',
  'account.edit.error.creation-date-required': '생성 날짜는 필수입니다',

  
  
  
  'common.loading': '로딩 중...',
  'common.error': '오류',
  'common.success': '성공',
  'common.warning': '경고 및 주의사항',
  'common.info': '정보 및 안내',
  'common.yes': '예',
  'common.no': '아니오',
  'common.ok': '확인',
  'common.search': '검색...',
  'common.select': '선택...',
  'common.none': '없음',
  'common.all': '전체',
  'common.date': '날짜',
  'common.time': '시간',
  'common.today': '오늘',
  'common.yesterday': '어제',
  'common.tomorrow': '내일',
  'common.week': '주',
  'common.month': '월',
  'common.year': '년',
  'common.total': '합계',
  'common.average': '평균',
  'common.min': '최소',
  'common.max': '최대',
  'common.profit': '수익',
  'common.loss': '손실',
  'common.win': '승리',
  'common.lose': '패배',
  'common.trade': '거래',
  'common.trades': '거래',
  'common.color.label': '색상',
  'common.color.default': '기본값',

  
  
  
  'settings.title': 'Journalit 설정',
  'settings.language': '언어',
  'settings.language-desc': '플러그인 표시 언어 선택',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI Trade Import 매핑',
  'settings.auth.feature.metatrader-sync': 'MetaTrader 동기화',
  'settings.auth.feature.basic-tracking': '기본 거래 추적',
  'settings.auth.feature.manual-csv': '수동 Trade Import',
  'settings.auth.feature.priority-support': '우선 지원',

  
  
  
  
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
  'premium.gate.cta.signin-continue': '로그인하고 계속',
  'premium.gate.cta.continue-pro': 'PRO로 계속',
  'premium.gate.cta.keep-editing': '계속 편집',
  'premium.gate.cta.refresh': 'Refresh status',
  'premium.gate.import.state.signin.title': '가져오기까지 한 단계만 남았어요',
  'premium.gate.import.state.signin.description':
    '파일과 매핑이 준비되었습니다. 계속하려면 로그인하세요.',
  'premium.gate.import.state.pro.title': '가져올 준비가 되었습니다',
  'premium.gate.import.state.pro.description':
    '파일과 매핑이 준비되었습니다. 가져오기는 PRO 기능입니다.',
  'premium.gate.import.reassurance': '미리보기와 열 매핑은 그대로 유지됩니다.',
  'premium.gate.trial-hint': '첫 PRO 구독에는 14일 무료 체험이 포함됩니다.',
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
  'settings.general.data-management': '데이터 관리 & 개인정보 보호',

  'settings.general.display-privacy-section': '표시 & 개인정보 보호',

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
    '이 위젯은 주간 리뷰 노트에서만 사용할 수 있습니다',
  'templateEditor.widget.weekly-drc-day-label': '요일',
  'templateEditor.widget.weekly-drc-display-label': '표시',
  'templateEditor.widget.weekly-drc-start-collapsed': '접힌 상태로 시작',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': '카드',
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
  'dashboard.conversion.original-pnl': '원래 손익',
  'dashboard.conversion.converted-pnl': '환산 손익',
  'dashboard.conversion.details-label': '통화 변환 세부 정보',
  'dashboard.conversion.requires-conversion':
    '다중 통화 손익 차트에는 환율 변환이 필요합니다.',
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
    '파일은 처리를 위해 Journalit 서버에 업로드되며 기본적으로 저장되지 않습니다.',
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
    '모든 필수 필드가 매핑되어 있고, 선택한 날짜 형식이 파일과 일치하며, 숫자 열에 유효한 거래 값이 포함되어 있는지 확인하세요.',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': '거래',
  'trade-import.gate.brand-right': '가져오기',
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
  'setups.view.advanced.rule-break-count': '{count}',
  'setups.guide.empty.intro.title': '첫 셋업 만들기',
  'setups.guide.empty.intro.description':
    '셋업은 플레이북 노트, 규칙, 스크린샷, 연결된 거래를 묶어 하나의 거래 아이디어를 맥락 속에서 검토하게 합니다.',
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
  'setups.guide.empty.finish.title': '셋업 생성 완료',
  'setups.guide.empty.finish.description':
    '세부 정보를 입력하고 저장하세요. 셋업이 준비되면 가이드가 다시 이어집니다.',
  'setups.guide.intro.title': 'Setups에 오신 것을 환영합니다',
  'setups.guide.intro.description':
    '이 보기에서는 셋업 플레이북, 연결된 거래, 노트, 스크린샷, 규칙을 한곳에 모읍니다.',
  'setups.guide.view-tabs.title': '셋업 보기 전환',
  'setups.guide.view-tabs.description':
    '셋업이 충분할 때 이 탭으로 개요, 셋업 페어, 비교 흐름을 이동합니다.',
  'setups.guide.overview-chart.title': '성과 순위',
  'setups.guide.overview-chart.description':
    '개요 차트는 선택한 지표로 셋업을 정렬합니다. 오른쪽 위 컨트롤로 지표를 바꾸거나 특정 셋업에 집중할 수 있습니다.',
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
  'setups.guide.compare.intro.title': '셋업 성과 비교',
  'setups.guide.compare.intro.description':
    '이제 충분한 셋업이 있어 페어를 검토하고 두 플레이북을 나란히 비교할 수 있습니다.',
  'setups.guide.pairs-mode.title': '셋업 페어 열기',
  'setups.guide.pairs-mode.description':
    '페어를 열어 비교할 만큼 공유 거래가 있는 조합을 확인합니다.',
  'setups.guide.pairs-chart.title': '페어 순위',
  'setups.guide.pairs-chart.description':
    '페어 모드는 함께 더 좋거나 나쁠 수 있는 조합을 강조합니다. 막대를 클릭하면 해당 조합의 더 깊은 인사이트를 열 수 있습니다.',
  'setups.guide.return-overview.title': '개요로 돌아가기',
  'setups.guide.return-overview.description':
    '비교할 셋업을 고르기 전에 개요로 돌아갑니다.',
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
  'setups.guide.compare.finish.title': '셋업 비교 가이드 완료',
  'setups.guide.compare.finish.description':
    '여러 셋업을 함께 검토하는 페어와 비교 화면을 보았습니다.',
  'setups.view.open-as-markdown': 'Open as Markdown',
  'setups.view.open-as-setup': 'Open as Journalit Setup',
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
  'setups.view.overview.pnl-chart.title': 'Setup P&L Over Time',
  'setups.view.overview.pnl-chart.dropdown-label': 'Cumulative P&L',
  'setups.view.overview.pnl-chart.subtitle':
    'Cumulative P&L from setup-linked trades, split by setup and combined.',
  'setups.view.overview.pnl-chart.combined': 'All setups',
  'setups.view.overview.pnl-chart.selected-combined': 'Selected setups',
  'setups.view.overview.pnl-chart.unassigned': 'Unassigned account',
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
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'setups.view.detail.execution-gap.subtitle':
    'Captured edge vs missed opportunity',
  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': '실거래 R',
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
  'setups.view.card.open-named': '{name}',
  'setups.view.card.status.active': 'Stable',
  'setups.view.card.status.monitor': 'Monitor',
  'setups.view.card.status.review': 'Review',
  'setups.view.date.days-ago': '{count}',

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
  'imageGallery.subtitle-count': '미디어 {count}개',
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
  'imageGallery.annotation.editor-eyebrow': '시장 구조 저널',
  'imageGallery.annotation.editor-title': '미디어 주석 달기',
  'imageGallery.annotation.tags': '태그',
  'imageGallery.annotation.tags-placeholder': '브레이크아웃, A+ 셋업, 실수',
  'imageGallery.annotation.notes': '메모',
  'imageGallery.annotation.notes-placeholder':
    '미래의 나는 이 차트에서 무엇을 배워야 할까요?',
  'imageGallery.annotation.error.save-failed':
    '미디어 주석을 저장할 수 없습니다.',
  'imageGallery.annotation.saving': '저장 중...',
  'command.replay-current-view-guide': '현재 보기 가이드 다시 보기',

  
  
  
  'tradelog.guide.switch-to-gallery.title': '거래에서 갤러리로 전환하기',
  'tradelog.guide.switch-to-gallery.description':
    '이 모드 선택기로 일반 Trade Log와 갤러리를 오갈 수 있습니다. 갤러리를 클릭해 이미지, GIF, 동영상, YouTube 링크 안내를 계속하세요.',
  'tradelog.guide.gallery-controls.title': '검토할 미디어를 선택하세요',
  'tradelog.guide.gallery-controls.description':
    '소스에서 거래 또는 리뷰 노트를 선택하고, 정렬로 미디어 순서를 바꾸며, 크기 버튼으로 compact 보기와 더 큰 미디어 미리보기를 전환합니다.',
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
};

export default ko;
