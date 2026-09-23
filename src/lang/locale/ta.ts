

import type { Lang } from './en';

const ta: Lang = {
  'widget.mfeScatter.name': 'MFE மற்றும் ஈட்டிய லாபம்/நஷ்டம்',
  'widget.mfeScatter.description':
    'மூடப்பட்ட வர்த்தகங்களின் அதிகபட்ச சாதகமான நகர்வு மற்றும் நிகர ஈட்டிய லாபம்/நஷ்டம்',
  'widget.mfeScatter.y': 'ஈட்டிய லாபம்/நஷ்டம் ({unit})',
  'widget.mfeScatter.winners': 'லாபமானவை',
  'widget.mfeScatter.losers': 'நஷ்டமானவை',
  'widget.mfeScatter.breakeven': 'சமநிலை',
  'widget.mfeScatter.empty':
    'இந்த அலகில் பயன்படுத்தக்கூடிய MFE கொண்ட மூடப்பட்ட வர்த்தகங்கள் இல்லை.',

  'trade.broker-synced-at': 'தரகர் ஒத்திசைவு {date}',
  'trade-sync.tradovate.status.setup-required': 'கணக்கை அமைக்க வேண்டும்',
  'trade-sync.tradovate.status.connecting': 'இணைக்கிறது',
  'trade-sync.tradovate.status.paused': 'இடைநிறுத்தப்பட்டது',
  'trade-sync.tradovate.status.reauthorization-required': 'மறுஅங்கீகாரம் தேவை',
  'trade-sync.tradovate.status.deleting': 'கிளவுட் தரவை நீக்குகிறது',
  'trade-sync.tradovate.status.error': 'இணைப்பு பிழை',

  'trade-sync.tradovate.sync-complete-connection':
    '{connection} ஒத்திசைவு முடிந்தது.',
  'trade-sync.tradovate.sync-partial-connection':
    'சிக்கல்களுடன் {connection} ஒத்திசைவு முடிந்தது.',
  'trade-sync.tradovate.sync-all': 'அனைத்தையும் ஒத்திசைக்கவும்',
  'trade-sync.tradovate.sync-all-complete':
    '{total} Tradovate இணைப்புகளின் {succeeded} ஒத்திசைக்கப்பட்டது.',
  'trade-sync.tradovate.sync-all-partial':
    '{total} Tradovate இணைப்புகளின் {succeeded} ஒத்திசைக்கப்பட்டது. சிக்கல்களுடன் தொடர்புகளை மதிப்பாய்வு செய்யவும்.',
  'trade-sync.tradovate.connect-another': 'மற்றொரு Tradovate கணக்கை இணைக்கவும்',
  'trade-sync.tradovate.no-connections':
    'Journalit.co இல் உள்ள Tradovate கணக்கை இங்கே உள்ளமைக்கவும் ஒத்திசைக்கவும் இணைக்கவும்.',
  'trade-sync.tradovate.claimed-by-connection':
    '{connection} மூலம் ஒத்திசைவு இயக்கப்பட்டது. இந்தக் கணக்கை மாற்றுவதற்கு முன் அதை முடக்கவும்.',
  'trade-sync.tradovate.claim-conflict':
    'மற்றொரு Tradovate இணைப்பு இந்தக் கணக்கைக் கோரியது. மீண்டும் முயற்சிக்கும் முன் புதுப்பிக்கப்பட்ட இணைப்பு அட்டைகளை மதிப்பாய்வு செய்யவும்.',
  'trade-sync.tradovate.reconciliation-issues':
    '{count} reconciliation சிக்கல்(கள்)',
  'trade-sync.tradovate.website-connection-description':
    'Journalit.co இல் Tradovateஐப் பாதுகாப்பாக இணைக்கவும் அல்லது மீண்டும் அங்கீகரிக்கவும், பின்னர் கணக்குகளைத் தேர்வுசெய்து உங்கள் vaultஐ ஒத்திசைக்க இங்கே திரும்பவும்.',
  'trade-sync.tradovate.paused-website-description':
    'இந்த Tradovate இணைப்பு இடைநிறுத்தப்பட்டுள்ளது. அதைச் சரிபார்க்க அல்லது மீண்டும் தொடங்க Journalit.co-வில் நிர்வகிக்கவும்.',
  'trade-sync.tradovate.plugin-sync-description':
    'ஒரு ஒத்திசைவு உங்கள் சமீபத்திய Tradovate செயல்பாட்டைப் பெறுகிறது மற்றும் இதன் விளைவாக வரும் டிரேட்களை இந்த vault இல் எழுதுகிறது.',
  'trade-sync.tradovate.connect': 'இணைக்கவும்',
  'trade-sync.tradovate.manage-connection': 'இணைப்பை நிர்வகிக்கவும்',
  'trade-sync.tradovate.setup-guide': 'Setup வழிகாட்டி',
  'trade-sync.tradovate.setup-and-sync': 'Setup மற்றும் ஒத்திசைவை முடிக்கவும்',
  'trade-sync.tradovate.sync-to-vault': 'ஒத்திசை',
  'trade-sync.tradovate.discovery-description':
    'உங்கள் Tradovate இணைப்பு மூலம் கிடைக்கும் டெமோ மற்றும் லைவ் கணக்குகளை Journalit கண்டறிய வேண்டும்.',
  'trade-sync.tradovate.discover-accounts': 'Tradovate கணக்குகளைக் கண்டறியவும்',
  'trade-sync.tradovate.discovering': 'கணக்குகளைக் கண்டறிகிறது…',
  'trade-sync.tradovate.discovery-failed':
    'Tradovate கணக்கு கண்டுபிடிப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும் அல்லது Journalit.co இல் இணைப்பை நிர்வகிக்கவும்.',
  'trade-sync.tradovate.sync-account': 'ஒத்திசைவில் சேர்க்கவும்',
  'trade-sync.tradovate.history-label': 'ஆரம்ப வரலாறு',
  'trade-sync.tradovate.history-all': 'கிடைக்கக்கூடிய அனைத்து வரலாறு',
  'trade-sync.tradovate.history-recent': 'சமீபத்திய 90 நாட்கள்',
  'trade-sync.tradovate.history-custom': 'ஒரு குறிப்பிட்ட தேதியிலிருந்து',
  'trade-sync.tradovate.history-new': 'புதிய டிரேட்கள் மட்டுமே',
  'trade-sync.tradovate.start-date': 'தொடக்க தேதி',

  'trade-sync.tradovate.mapping-required':
    'இயக்கப்பட்ட ஒவ்வொரு Tradovate கணக்கிற்கும் உள்ளூர் vault கணக்கைத் தேர்வு செய்யவும்.',
  'trade-sync.tradovate.custom-date-required':
    'ஒவ்வொரு தனிப்பயன் வரலாறு தேர்வுக்கும் ஒரு தொடக்கத் தேதியைத் தேர்வு செய்யவும்.',
  'trade-sync.tradovate.recovery-title':
    'காணாமல் போன டிரேட் குறிப்புகளை மீட்டெடுக்கவும்',
  'trade-sync.tradovate.recovery-count':
    '{count} டிரேட் குறிப்பு(களை) மீட்டமைக்க',
  'trade-sync.tradovate.recovery-select-account':
    'டிரேட் குறிப்புகளை மீட்டமைக்கும் முன் உள்ளூர் கணக்கைத் தேர்ந்தெடுக்கவும்.',
  'trade-sync.tradovate.recovery-confirm':
    '{count} டிரேட் குறிப்பை(களை) {account}க்கு மீட்டமைக்கவா?',

  'trade-sync.ctrader.status.setup-required': 'கணக்கை அமைக்க வேண்டும்',
  'trade-sync.ctrader.status.connecting': 'இணைக்கிறது',
  'trade-sync.ctrader.status.paused': 'இடைநிறுத்தப்பட்டது',
  'trade-sync.ctrader.status.reauthorization-required': 'மறுஅங்கீகாரம் தேவை',
  'trade-sync.ctrader.status.deleting': 'கிளவுட் தரவை நீக்குகிறது',
  'trade-sync.ctrader.status.error': 'இணைப்பு பிழை',
  'trade-sync.ctrader.sync-complete-connection':
    '{connection} ஒத்திசைவு முடிந்தது.',
  'trade-sync.ctrader.sync-partial-connection':
    'சிக்கல்களுடன் {connection} ஒத்திசைவு முடிந்தது.',
  'trade-sync.ctrader.sync-all': 'அனைத்தையும் ஒத்திசைக்கவும்',
  'trade-sync.ctrader.sync-all-complete':
    '{total} cTrader இணைப்புகளின் {succeeded} ஒத்திசைக்கப்பட்டது.',
  'trade-sync.ctrader.sync-all-partial':
    '{total} cTrader இணைப்புகளின் {succeeded} ஒத்திசைக்கப்பட்டது. சிக்கல்களுடன் தொடர்புகளை மதிப்பாய்வு செய்யவும்.',
  'trade-sync.ctrader.connect-another': 'மற்றொரு cTrader கணக்கை இணைக்கவும்',
  'trade-sync.ctrader.no-connections':
    'Journalit.co இல் உள்ள cTrader கணக்கை இங்கே உள்ளமைக்கவும் ஒத்திசைக்கவும் இணைக்கவும்.',
  'trade-sync.ctrader.claimed-by-connection':
    '{connection} மூலம் ஒத்திசைவு இயக்கப்பட்டது. இந்தக் கணக்கை மாற்றுவதற்கு முன் அதை முடக்கவும்.',
  'trade-sync.ctrader.claim-conflict':
    'மற்றொரு cTrader இணைப்பு இந்தக் கணக்கைக் கோரியது. மீண்டும் முயற்சிக்கும் முன் புதுப்பிக்கப்பட்ட இணைப்பு அட்டைகளை மதிப்பாய்வு செய்யவும்.',
  'trade-sync.ctrader.reconciliation-issues':
    '{count} reconciliation சிக்கல்(கள்)',
  'trade-sync.ctrader.website-connection-description':
    'Journalit.co இல் cTraderஐப் பாதுகாப்பாக இணைக்கவும் அல்லது மீண்டும் அங்கீகரிக்கவும், பின்னர் கணக்குகளைத் தேர்வுசெய்து உங்கள் vaultஐ ஒத்திசைக்க இங்கே திரும்பவும்.',
  'trade-sync.ctrader.plugin-sync-description':
    'ஒரு ஒத்திசைவு உங்கள் சமீபத்திய cTrader செயல்பாட்டைப் பெறுகிறது மற்றும் இதன் விளைவாக வரும் டிரேட்களை இந்த vault இல் எழுதுகிறது.',
  'trade-sync.ctrader.connect': 'இணைக்கவும்',
  'trade-sync.ctrader.manage-connection': 'இணைப்பை நிர்வகிக்கவும்',
  'trade-sync.ctrader.setup-guide': 'Setup வழிகாட்டி',
  'trade-sync.ctrader.setup-and-sync': 'Setup மற்றும் ஒத்திசைவை முடிக்கவும்',
  'trade-sync.ctrader.sync-to-vault': 'ஒத்திசை',
  'trade-sync.ctrader.discovery-description':
    'உங்கள் cTrader இணைப்பு மூலம் கிடைக்கும் டெமோ மற்றும் லைவ் கணக்குகளை Journalit கண்டறிய வேண்டும்.',
  'trade-sync.ctrader.discover-accounts': 'cTrader கணக்குகளைக் கண்டறியவும்',
  'trade-sync.ctrader.discovering': 'கணக்குகளைக் கண்டறிகிறது…',
  'trade-sync.ctrader.discovery-failed':
    'cTrader கணக்கு கண்டுபிடிப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும் அல்லது Journalit.co இல் இணைப்பை நிர்வகிக்கவும்.',
  'trade-sync.ctrader.sync-account': 'ஒத்திசைவில் சேர்க்கவும்',
  'trade-sync.ctrader.history-label': 'ஆரம்ப வரலாறு',
  'trade-sync.ctrader.history-all': 'கிடைக்கக்கூடிய அனைத்து வரலாறு',
  'trade-sync.ctrader.history-recent': 'சமீபத்திய 90 நாட்கள்',
  'trade-sync.ctrader.history-custom': 'ஒரு குறிப்பிட்ட தேதியிலிருந்து',
  'trade-sync.ctrader.history-new': 'புதிய டிரேட்கள் மட்டுமே',
  'trade-sync.ctrader.start-date': 'தொடக்க தேதி',
  'trade-sync.ctrader.mapping-required':
    'இயக்கப்பட்ட ஒவ்வொரு cTrader கணக்கிற்கும் உள்ளூர் vault கணக்கைத் தேர்வு செய்யவும்.',
  'trade-sync.ctrader.custom-date-required':
    'ஒவ்வொரு தனிப்பயன் வரலாறு தேர்வுக்கும் ஒரு தொடக்கத் தேதியைத் தேர்வு செய்யவும்.',
  'trade-sync.ctrader.recovery-title':
    'காணாமல் போன டிரேட் குறிப்புகளை மீட்டெடுக்கவும்',
  'trade-sync.ctrader.recovery-count':
    '{count} டிரேட் குறிப்பு(களை) மீட்டமைக்க',
  'trade-sync.ctrader.recovery-select-account':
    'டிரேட் குறிப்புகளை மீட்டமைக்கும் முன் உள்ளூர் கணக்கைத் தேர்ந்தெடுக்கவும்.',
  'trade-sync.ctrader.recovery-confirm':
    '{count} டிரேட் குறிப்பை(களை) {account}க்கு மீட்டமைக்கவா?',
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
    'மேகக்கணியில் cTrader டிரேட்களை ஒத்திசைத்து, இந்த vault இல் அவற்றைத் திட்டமிடுங்கள்.',
  'trade-sync.ctrader.status-failed': 'cTrader நிலையை ஏற்ற முடியவில்லை.',
  'trade-sync.ctrader.last-sync': 'கடைசி ஒத்திசைவு',
  'trade-sync.ctrader.pending-acks':
    '{count} உள்ளூர் ACK(கள்) நிலுவையில் உள்ளது',
  'trade-sync.ctrader.never': 'ஒருபோதும் இல்லை',

  'command.add-trade': 'புதிய டிரேடைச் சேர்',
  'command.import-trades-csv': 'Trade Import-ஐத் திற',
  'command.create-drc': 'DRC-ஐத் திற (தினசரி அறிக்கை அட்டை)',
  'command.create-weekly-review': 'வார மதிப்பாய்வைத் திற',
  'command.create-monthly-review': 'மாத மதிப்பாய்வைத் திற',
  'command.create-quarterly-review': 'காலாண்டு மதிப்பாய்வைத் திற',
  'command.create-yearly-review': 'ஆண்டு மதிப்பாய்வைத் திற',
  'command.open-dashboard': 'டாஷ்போர்டைத் திற',
  'command.open-account-dashboard': 'கணக்குகளைத் திற',
  'command.open-trade-log': 'டிரேட் பதிவைத் திற',
  'command.open-home': 'முகப்பைத் திற',
  'command.open-settings': 'அமைப்புகளைத் திற',
  'command.open-position-size-calculator': 'போசிஷன் சைஸ் கால்குலேட்டரைத் திற',
  'command.replay-onboarding': 'ஆன்போர்டிங்கை மீண்டும் இயக்கு',
  'command.replay-current-view-guide':
    'தற்போதைய பார்வைக்கு வழிகாட்டியை மீண்டும் இயக்கு',
  'command.open-release-notes': 'வெளியீட்டு குறிப்புகளைப் பார்',
  'command.open-layout-builder': 'தளவமைப்பு உருவாக்கியைத் திற',
  'notice.guide.replay-unavailable':
    'வழிகாட்டி அமைப்பு இன்னும் தயாராகவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'notice.guide.no-active-view':
    'முதலில் ஆதரிக்கப்படும் Journalit காட்சியைத் திறந்து, இந்த கட்டளையை இயக்கவும்.',
  'notice.guide.no-guide-for-view':
    'இந்தக் காட்சிக்கு இதுவரை எந்த வழிகாட்டியும் பதிவு செய்யப்படவில்லை ({viewType}).',
  'notice.guide.replay-failed':
    'வழிகாட்டியைத் தொடங்குவதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.',
  'notice.guide.replay-started':
    'இந்தக் காட்சிக்கு வழிகாட்டி மீண்டும் தொடங்கப்பட்டது.',
  'template.switch-title': 'தளவமைப்பை மாற்றவும்',
  'template.switch-review-title': '{type} தளவமைப்பை மாற்றவும்',

  'template.review-type.drc': 'DRC',
  'template.review-type.weekly': 'வாராந்திர',
  'template.review-type.monthly': 'மாதாந்திர',
  'template.review-type.quarterly': 'காலாண்டு',
  'template.review-type.yearly': 'வருடாந்திர',
  'template.review-type.review': 'மதிப்பாய்வு',
  'template.builder.select-template':
    'திருத்துவதற்கு தளவமைப்பைத் தேர்ந்தெடுக்கவும்',
  'template.builder.loading': 'தளவமைப்பு உருவாக்கியை ஏற்றுகிறது...',
  'template.builder.create-from-sidebar':
    'அல்லது பக்கப்பட்டியில் இருந்து புதிய ஒன்றை உருவாக்கவும்',
  'template.builder.snippet-coming-soon': 'துணுக்கு எடிட்டர் விரைவில்',
  'template.preview.empty': 'இந்த தளவமைப்பில் விட்ஜெட்டுகள் இல்லை',
  'template.preview.summary': '{type} தளவமைப்பு - {count} விட்ஜெட்டுகள்',
  'template.preview.mode': 'முன்னோட்ட முறை',
  'template.preview.markdown-zone-placeholder':
    'Markdown மண்டலம் - பயனர்கள் இங்கே எழுதுகிறார்கள்',
  'template.preview.markdown-zone-placeholder-with-id':
    'Markdown மண்டலம் ({id}) - பயனர்கள் இங்கே எழுதுகிறார்கள்',
  'template.preview.widget.game-performance-desc':
    'மன/தொழில்நுட்ப தர விநியோகங்கள்',
  'template.preview.widget.unknown-desc': 'அறியப்படாத விட்ஜெட் வகை',
  'template.section.forecast': 'முன்னறிவிப்பு',
  'template.section.performance': 'செயல்திறன்',
  'template.section.review': 'மதிப்பாய்வு',
  'template.question.drc.q1': 'இன்று நான் என்ன நன்றாக செய்தேன்?',
  'template.question.drc.q2': 'நான் எதை மேம்படுத்த முடியும்?',
  'template.question.drc.q3': 'அடுத்த அமர்வில் நான் எதில் கவனம் செலுத்துவேன்?',
  'template.question.weekly.q1': 'இந்த வாரம் எது நன்றாக வேலை செய்தது?',
  'template.question.weekly.q2': 'இந்த வாரம் என்ன வேலை செய்யவில்லை?',
  'template.question.weekly.q3': 'எந்த Setups மிகவும் இலாபகரமானவை?',
  'template.question.weekly.q4': 'என்ன தவறுகளால் எனக்கு அதிக பணம் செலவாகிறது?',
  'template.question.weekly.q5': 'அடுத்த வாரம் நான் என்ன மேம்படுத்த முடியும்?',
  'template.question.monthly.q1': 'இந்த மாதத்தின் முக்கிய பாடங்கள் என்ன?',
  'template.question.monthly.q2': 'எந்த உத்திகள் சிறப்பாக செயல்பட்டன?',
  'template.question.monthly.q3':
    'எனது டிரேட்டில் நான் என்ன மாதிரிகளை கவனிக்கிறேன்?',
  'template.question.monthly.q4': 'அடுத்த மாதத்திற்கான எனது இலக்குகள் என்ன?',
  'template.question.monthly.q5':
    'எனது இடர் மேலாண்மையை எவ்வாறு மேம்படுத்துவது?',
  'template-picker.empty': 'தளவமைப்புகள் எதுவும் இல்லை.',
  'template-picker.close': 'மூடு',
  'template-picker.built-in': '(உள்ளமைக்கப்பட்ட)',
  'template-picker.badge.default': 'இயல்பு',
  'template-picker.badge.current': 'தற்போதைய',
  'template-picker.cancel': 'ரத்து',
  'auth.title.already-logged-in': 'ஏற்கனவே உள்நுழைந்துள்ளீர்கள்',
  'auth.desc.already-logged-in': 'நீங்கள் ஏற்கனவே உள்நுழைந்துள்ளீர்கள்{email}.',
  'auth.title.sign-in': 'Journalit இல் உள்நுழையவும்',

  'auth.label.email': 'மின்னஞ்சல் முகவரி',

  'auth.button.send-code': 'சரிபார்ப்புக் குறியீட்டை அனுப்பவும்',

  'auth.label.code': 'சரிபார்ப்பு குறியீடு',

  'auth.button.verify': 'சரிபார்த்து உள்நுழையவும்',

  'auth.button.resend': 'குறியீட்டை மீண்டும் அனுப்பு',

  'auth.error.needs-premium': 'ப்ரோ அம்சம்',

  'auth.error.network-error': 'இணைப்பு பிழை',

  'form.modal.unsaved-changes.title': 'சேமிக்கப்படாத மாற்றங்கள்',
  'form.modal.unsaved-changes.body1':
    'டிரேட் படிவத்தில் நீங்கள் சேமிக்கப்படாத மாற்றங்கள் உள்ளன.',
  'form.modal.unsaved-changes.body2': 'சேமிக்காமல் மூட விரும்புகிறீர்களா?',
  'form.modal.unsaved-changes.continue': 'எடிட்டிங் தொடரவும்',
  'form.modal.unsaved-changes.discard': 'மாற்றங்களை நிராகரிக்கவும்',
  'template-builder.modal.unsaved-changes.title': 'சேமிக்கப்படாத மாற்றங்கள்',
  'template-builder.modal.unsaved-changes.body1':
    'இந்த அமைப்பில் நீங்கள் சேமிக்கப்படாத மாற்றங்கள் உள்ளன.',
  'template-builder.modal.unsaved-changes.body2':
    'சேமிக்காமல் நிச்சயமாக மாற விரும்புகிறீர்களா?',
  'template-builder.modal.unsaved-changes.continue': 'எடிட்டிங் தொடரவும்',
  'template-builder.modal.unsaved-changes.discard': 'மாற்றங்களை நிராகரிக்கவும்',
  'template-builder.modal.delete.title': 'தளவமைப்பை நீக்கு',
  'template-builder.modal.delete.body':
    '"{name}" ஐ நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'template-builder.modal.delete.warning':
    'இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.',
  'template-builder.modal.delete.cancel': 'ரத்து',
  'template-builder.modal.delete.confirm': 'நீக்கு',
  'tradelog.settings.modal.unsaved-changes.body1':
    'நெடுவரிசை அமைப்புகளில் நீங்கள் சேமிக்கப்படாத மாற்றங்கள் உள்ளன.',
  'tradelog.settings.modal.unsaved-changes.body2':
    'சேமிக்காமல் மூட விரும்புகிறீர்களா?',
  'notice.error.missed-trade-service-init':
    'தவறவிட்ட டிரேட் சேவை தொடங்கப்படவில்லை. சிறிது நேரம் காத்திருந்து மீண்டும் முயற்சிக்கவும்.',
  'notice.error.backtest-trade-service-init':
    'Backtest டிரேட் சேவை தொடங்கப்படவில்லை. சிறிது நேரம் காத்திருந்து மீண்டும் முயற்சிக்கவும்.',
  'notice.trade-updated': '{type} புதுப்பிக்கப்பட்டது: {path}',
  'notice.trade-created': '{type} உருவாக்கப்பட்டது: {path}',
  'notice.new-trade-created':
    '📈 புதிய டிரேட் உருவாக்கப்பட்டது: {instrument} {direction}',
  'notice.error.trade-update-failed':
    '{type}: {error}ஐப் புதுப்பிக்க முடியவில்லை',
  'notice.error.trade-create-failed': '{type}: {error} ஐ உருவாக்க முடியவில்லை',
  'form.section.trade-details': 'டிரேட் விவரங்கள்',
  'form.section.trading-costs': 'டிரேடிங் செலவுகள்',
  'form.section.risk-management': 'ரிஸ்க் மேலாண்மை',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': 'பகுப்பாய்வு & தீசிஸ்',
  'form.section.custom-fields': 'தனிப்பயன் புலங்கள்',

  'form.section.custom-fields-empty-title': 'மேம்பட்ட புலங்கள் இன்னும் இல்லை.',
  'form.section.custom-fields-empty-desc':
    'உள்ளமைந்த புலங்களில் இல்லாத எதையும் பதிவு செய்யுங்கள், எடுத்துக்காட்டாக அமர்வு, கால அளவு அல்லது செட்அப் தரம். தனிப்பயன் புலங்கள் ஒவ்வொரு வர்த்தகத்துடனும் சேமிக்கப்பட்டு, வரிசைப்படுத்தக்கூடிய டிரேட் லாக் நெடுவரிசைகளாக மாறும்.',
  'form.section.attachments': 'இணைப்புகள்',
  'form.tab.basic': 'அடிப்படை',
  'form.tab.details': 'விவரங்கள்',
  'form.tab.advanced': 'மேம்பட்டவை',
  'form.import-shortcut.open': 'டிரேட்களை இறக்கு',
  'form.layout.customize': 'படிவத்தைத் தனிப்பயனாக்கு',
  'form.layout.modal-title': 'டிரேட் படிவத்தை தனிப்பயனாக்குங்கள்',
  'form.layout.settings-title': 'டிரேட் படிவ தளவமைப்பு',

  'form.layout.input-mode': 'உள்ளீட்டு முறை',
  'form.layout.input-mode-prices': 'விலைகள்',
  'form.layout.input-mode-pnl-risk': 'P&L + ஆபத்து',
  'form.layout.input-mode-prices-desc':
    'நுழைவு/வெளியேறும் விலைகள். Journalit கணக்கிடுகிறது P&L.',
  'form.layout.input-mode-pnl-risk-desc':
    'நேரடி P&L + ஆபத்து. Journalit R ஐக் காட்டுகிறது.',
  'form.layout.asset-type-mode': 'சொத்து வகை',
  'form.layout.asset-type-mode-show': 'கேள்',
  'form.layout.asset-type-mode-fixed': 'Fixed',
  'form.layout.default-asset-type': 'இயல்புநிலை சொத்து வகை',
  'form.layout.active-fields': 'காணக்கூடிய தொகுதிகள்',
  'form.layout.available-fields': 'மறைக்கப்பட்ட தொகுதிகள்',
  'form.layout.active-fields-desc': 'மறுவரிசைப்படுத்த இழுக்கவும்.',
  'form.layout.available-fields-desc':
    'மறைக்கப்பட்ட தொகுதிகளை மீண்டும் சேர்க்கவும்.',
  'form.layout.empty-active': 'விருப்பத் தொகுதிகள் எதுவும் தெரியவில்லை.',
  'form.layout.all-active': 'அனைத்து விருப்பத் தொகுதிகளும் தெரியும்.',
  'form.layout.add-field-aria': 'டிரேட் படிவத்தில் {field} ஐ சேர்க்கவும்',
  'form.layout.remove-field-aria': 'டிரேட் படிவத்தில் {field} ஐ மறை',
  'form.layout.saved': 'டிரேட் படிவ தளவமைப்பு சேமிக்கப்பட்டது',
  'form.layout.item.trading-costs.commission': 'கமிஷன்',
  'form.layout.item.import-shortcut': 'இறக்குமதி பொத்தான்',
  'form.layout.item.import-shortcut-desc':
    'Trade Import திறக்கும் அடிக்குறிப்பு பொத்தானைக் காட்டு.',
  'form.layout.item.core-details': 'முக்கிய டிரேட் விவரங்கள்',
  'form.layout.item.core-details-desc':
    'கணக்கு, இன்ஸ்ட்ருமென்ட், திசை மற்றும் நுழைவு/வெளியேறு உள்ளீடுகள் முதலில் இருக்கும்.',
  'form.layout.item.asset-specific': 'சொத்து-குறிப்பிட்ட புலங்கள்',
  'form.layout.item.pnl-preview': 'P&L முன்னோட்டம்',

  'form.layout.item.trade-currency': 'டிரேட் நாணயம் / FX விகிதம்',
  'form.layout.item.trade-currency-desc':
    'விருப்பமான கைமுறை FX விகிதத்துடன் மற்றொரு நாணயத்தில் டிரேடை உள்ளிடவும்.',
  'form.layout.item.exchange-desc':
    'பங்கு மற்றும் கிரிப்டோ வர்த்தகங்களுக்கான பரிவர்த்தனை புலம்.',
  'form.layout.item.direct-pnl-toggle-desc':
    'ஒரு வர்த்தகத்தை வெளியேறும் விலைக்குப் பதிலாக மொத்த P&L உள்ளிடுவதற்கு மாற்றவும்.',
  'form.layout.manual-fx-rate': 'FX விகிதம் மேலெழுதப்பட்டது',
  'form.layout.result-r': 'முடிவு ஆர்',
  'form.layout.entry-time': 'டிரேட் நேரம்',
  'form.field.account': 'கணக்கு',
  'form.field.asset-type': 'அசெட் வகை',
  'form.field.asset-type.stock': 'பங்கு',
  'form.field.asset-type.options': 'Options',
  'form.field.asset-type.futures': 'Futures',
  'form.field.asset-type.forex': 'Forex',
  'form.field.asset-type.crypto': 'Crypto',
  'form.field.asset-type.cfd': 'CFD',
  'form.field.direction': 'திசை',
  'form.field.direction.long': 'Long',
  'form.field.direction.short': 'Short',
  'form.field.commission': 'கமிஷன்',
  'form.field.commission-type': 'வகை',
  'form.field.rebate': 'ரீபேட்',
  'form.field.swap': 'Swap',

  'form.field.other-fees': 'பிற கட்டணங்கள்',
  'form.field.stop-loss': 'Stop Loss',
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'இலக்கு விலை',
  'form.field.close-percent': 'மூடு %',
  'form.field.close-size': 'மூடும் அளவு',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': 'டேக் ப்ராபிட் மூடும் அளவு வடிவம்',
  'form.layout.take-profit-unit-percent': 'மூடு %',
  'form.layout.take-profit-unit-size': 'அளவு',
  'trade.validation.take-profit-size-number':
    'டேக் ப்ராபிட் அளவு சரியான எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.take-profit-size-positive':
    'டேக் ப்ராபிட் அளவு 0-ஐ விட அதிகமாக இருக்க வேண்டும்.',
  'trade.validation.take-profit-total-size-range':
    'டேக் ப்ராபிட் அளவுகள் போசிஷன் அளவை மீறக்கூடாது.',
  'form.field.risk-amount': 'ரிஸ்க் தொகை',
  'form.field.profit-loss': 'லாபம்/நஷ்டம்',
  'form.field.total-pnl': 'டிரேட் P&L',
  'form.field.realized-pnl': 'Realized P&L',
  'form.field.floating-pnl': 'Floating P&L',
  'form.field.total-costs': 'மொத்த செலவுகள்:',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'தவறு',
  'form.field.custom-tags': 'தனிப்பயன் குறிச்சொற்கள்',
  'form.field.trade-thesis': 'டிரேட் தீசிஸ்',
  'form.field.time': 'நேரம்',
  'form.field.price': 'விலை',

  'form.field.entries': 'என்ட்ரிகள்',
  'form.field.exits': 'வெளியேற்றங்கள்',
  'form.field.dividends': 'ஈவுத்தொகை',
  'form.field.dividend-amount': 'ஈவுத்தொகை தொகை',
  'form.field.optional': '(விருப்பம்)',
  'form.field.closed': 'மூடப்பட்டது',
  'form.field.incl-costs': '(செலவுகள் உட்பட)',
  'form.field.commission-type.fixed': 'Fixed',
  'form.field.commission-type.percentage': 'சதவீதம் (%)',
  'form.calculated': 'கணக்கிடப்பட்டது',
  'form.account-empty-state.title': 'உங்கள் முதல் கணக்கை அமைக்கவும்',
  'form.account-empty-state.description':
    'கணக்குகள் உங்கள் இருப்பைக் கண்காணித்து, Journalit வருவாய், ரிஸ்க் மற்றும் டிராடௌனைக் கணக்கிட உதவுகின்றன. உருவாக்க ஒரு பெயர் மட்டுமே போதும்.',
  'form.account-empty-state.create-account': 'கணக்கை உருவாக்கவும்',
  'form.account-empty-state.submit-disabled':
    'இந்த டிரேடை சேமிக்க முதலில் ஒரு கணக்கை உருவாக்கவும்.',
  'form.empty.take-profits': 'இன்னும் Take Profit இலக்குகள் இல்லை',
  'form.action.add-take-profit': 'Take Profit-ஐச் சேர்',
  'form.action.remove-take-profit': 'Take Profit-ஐ அகற்று',
  'form.field.position-size': 'போசிஷன் அளவு',
  'form.field.position-size.shares': 'பங்குகள்',
  'form.field.position-size.contracts': 'Contracts',
  'form.field.position-size.lots': 'Lots',
  'form.field.position-size.amount': 'தொகை',
  'form.field.position-size.cfd-units': 'CFD அலகுகள்',
  'form.field.instrument': 'இன்ஸ்ட்ருமென்ட்',
  'form.field.instrument.ticker': 'டிக்கர்',
  'form.field.instrument.option-symbol': 'Option சின்னம்',
  'form.field.instrument.future-symbol': 'Futures சின்னம்',
  'form.field.instrument.forex-pair': 'Forex ஜோடி',
  'form.field.instrument.crypto-symbol': 'Crypto சின்னம்',
  'form.field.instrument.cfd-symbol': 'CFD சின்னம்',
  'form.field.exchange': 'Exchange',
  'form.field.expiration-date': 'காலாவதி தேதி',
  'form.field.strike-price': 'Strike Price',
  'form.field.contract-size': 'Contract அளவு',
  'form.field.option-type': 'Option வகை',
  'form.field.option-type.call': 'Call',
  'form.field.option-type.put': 'Put',
  'form.field.dollars-per-point': 'ஒரு புள்ளிக்கு டாலர்கள்',
  'form.field.tick-size': 'டிக் அளவு',
  'form.field.tick-value': 'டிக் மதிப்பு',
  'form.field.lot-size': 'Lot அளவு',
  'form.field.custom-lot-size': 'தனிப்பயன் Lot அளவு',
  'form.field.pip-value': 'பிப் மதிப்பு',
  'form.field.leverage-ratio': 'Leverage விகிதம்',
  'form.field.trade-currency': 'டிரேட் நாணயம்',
  'form.field.fx-rate': '{base}க்கு FX விகிதம்',
  'form.field.fx-rate-override': 'FX விகித மேலெழுத்து ({quote} → {base})',
  'form.forex.using-manual-rate': 'கைமுறை FX வீதத்தைப் பயன்படுத்துதல்',
  'form.field.lot-size.standard': 'Standard (100,000)',
  'form.field.lot-size.mini': 'மினி (10,000)',
  'form.field.lot-size.micro': 'மைக்ரோ (1,000)',
  'form.field.lot-size.custom': 'தனிப்பயன்',
  'form.field.image-url-placeholder':
    'மீடியா URL அல்லது கோப்பு பாதையை ஒட்டு...',
  'form.field.image-duplicate-error':
    'இந்தப் படம் ஏற்கனவே சேர்க்கப்பட்டுள்ளது.',
  'form.field.trade-image-alt': 'டிரேட் படம்',

  'form.field.value-dollar': 'மதிப்பு ($)',
  'form.field.dollar-amount-placeholder': 'டாலர் தொகை',
  'form.field.direct-pnl-placeholder': 'லாபம் அல்லது நஷ்டத் தொகையை உள்ளிடு',

  'form.field.mae-placeholder-currency': '{currency} இல் அதிகபட்ச Drawdown',
  'form.field.mfe-placeholder-currency': '{currency} இல் அதிகபட்ச லாபம்',
  'form.placeholder.select-accounts': 'கணக்குகளைத் தேர்ந்தெடுக்கவும்',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': 'Commission Rebate/credit',
  'form.placeholder.swap': 'ஒரே இரவில் நிதி',
  'form.placeholder.other-fees': 'தளம்/ஒழுங்குமுறை கட்டணம்',
  'form.placeholder.dividend-amount': 'பணத் தொகை, நேர்மறை அல்லது எதிர்மறை',
  'form.placeholder.stop-loss': 'விருப்ப Stop Loss விலை',
  'form.placeholder.target-price': 'இலக்கு விலை',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': 'நாணயத்தில் திட்டமிடப்பட்ட ஆபத்து',
  'form.placeholder.fx-rate': '1 {currency} = ? {base} (காலி: தினசரி கட்டணம்)',
  'form.placeholder.custom-tag':
    'தனிப்பயன் குறிச்சொல்லைத் தட்டச்சு செய்து Enter அழுத்தவும்',
  'form.placeholder.thesis': 'இந்த டிரேட்டுக்கான உங்கள் தீசிஸை உள்ளிடவும்...',

  'form.placeholder.exchange-stock': 'எ.கா., NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'எ.கா., பைனன்ஸ், காயின்பேஸ்',
  'form.placeholder.futures-point-value': 'எ.கா: ES1க்கு 50',
  'form.placeholder.leverage': 'எ.கா., 1:100க்கு 100',
  'form.entry-exit.add-entry': '+ நுழைவைச் சேர்',
  'form.entry-exit.add-exit': '+ வெளியேற்றத்தைச் சேர்',
  'form.entry-exit.remove-entry': 'நுழைவை அகற்று',
  'form.entry-exit.remove-exit': 'வெளியேற்றத்தை அகற்று',
  'form.dividends.add-dividend': '+ ஈவுத்தொகையைச் சேர்க்கவும்',
  'form.dividends.remove-dividend': 'ஈவுத்தொகையை அகற்று',
  'form.dividends.total-dividends': 'மொத்த ஈவுத்தொகை:',
  'form.entry-exit.total-entry-size': 'மொத்த நுழைவு அளவு:',
  'form.entry-exit.remaining-position': 'மீதமுள்ள Position:',
  'form.entry-exit.open': '(திறந்த)',
  'form.entry-exit.closed': '(மூடப்பட்டது)',
  'form.entry-exit.direct-pnl':
    'விலைகளுக்கு பதிலாக நேரடியாக அடிப்படை டிரேட் PNL ஐ உள்ளிடவும்',
  'form.entry-exit.direct-pnl-desc':
    'ஈவுத்தொகைக்கு முன் டிரேட் லாபம்/இழப்பை உள்ளிடவும். கமிஷன் மற்றும் கட்டணங்கள் இன்னும் தனித்தனியாகப் பயன்படுத்தப்படும்.',
  'form.entry-exit.calc-pnl':
    'நுழைவு/வெளியேற்ற விலைகள் மற்றும் Position அளவுகளில் இருந்து PNL-ஐக் கணக்கிடுங்கள்.',
  'form.ideal-exit.title': 'சிறந்த வெளியேறும்',

  'form.ideal-exit.price': 'சிறந்த விலை',
  'form.ideal-exit.size': 'அளவு',
  'form.ideal-exit.remove': 'சிறந்த வெளியேற்றத்தை அகற்று',

  'form.ideal-exit.copy-actual': 'உண்மையான வெளியேற்றங்களை நகலெடுக்கவும்',
  'form.ideal-exit.tooltip':
    'நீங்கள் செயல்படுத்தியிருக்க விரும்பும் பின்நோக்கி வெளியேறும் திட்டத்தை பதிவு செய்யவும். பிடிப்பு மதிப்பாய்விற்கான அளவிடப்பட்ட வெளியேற்றங்களை ஆதரிக்கிறது.',
  'form.ideal-exit.empty': 'இன்னும் சிறந்த வெளியேற்றம் இல்லை',
  'form.unrealized.title': 'திறந்த Position ஸ்னாப்ஷாட்',
  'form.unrealized.tooltip':
    'Unrealized P&L-ஐக் கண்காணிக்க உங்கள் திறந்த Position-இன் தற்போதைய சந்தை விலையைப் பதிவு செய்யவும். டிரேட் மூடப்பட்டவுடன் ஸ்னாப்ஷாட் தானாகவே அழிக்கப்படும்.',
  'form.unrealized.price': 'ஸ்னாப்ஷாட் விலை',
  'form.unrealized.time': 'ஸ்னாப்ஷாட் நேரம்',
  'form.unrealized.preview': 'Unrealized P&L',
  'form.unrealized.captured': 'பதிவு: {time}',
  'form.layout.item.unrealized-snapshot-desc':
    'திறந்த Position-களுக்கு Unrealized P&L-ஐக் கண்காணிக்கவும்.',
  'trade.validation.unrealized-snapshot-price-non-negative':
    'ஸ்னாப்ஷாட் விலை பூஜ்ஜியமாகவோ அல்லது அதிகமாகவோ இருக்க வேண்டும்',
  'trade.validation.unrealized-snapshot-open-position-required':
    'ஸ்னாப்ஷாட் நேரம் திறந்த நிலையில் இருக்க வேண்டும்.',
  'form.trade-type.title': 'டிரேட் வகை',
  'form.trade-type.subtitle': 'உருவாக்கும் டிரேட் வகையைத் தேர்வு செய்',
  'form.trade-type.regular': 'வழக்கமான டிரேட்',
  'form.trade-type.regular-desc':
    'முழு என்ட்ரி மற்றும் எக்சிட் தரவுடன் சாதாரண டிரேட்',
  'form.trade-type.missed': 'தவறவிட்ட டிரேட்',
  'form.trade-type.missed-desc':
    'நீங்கள் தவறவிட்ட டிரேட் வாய்ப்பு - PnL மற்றும் கணக்கு புலங்கள் விருப்பமானது',
  'form.trade-type.backtest': 'Backtest டிரேட்',
  'form.trade-type.backtest-desc': 'பகுப்பாய்வுக்கான Backtest',
  'form.trade-type.missed-reason': 'இந்த டிரேடை ஏன் தவறவிட்டீர்கள்?',
  'form.trade-type.missed-reason-placeholder':
    'இந்த டிரேட் வாய்ப்பை ஏன் தவறவிட்டீர்கள் என்று விவரிக்கவும்...',
  'button.save': 'சேமி',
  'button.cancel': 'ரத்து',
  'button.close': 'மூடு',
  'button.open': 'திற',
  'button.done': 'முடிந்தது',
  'button.edit': 'திருத்து',
  'button.delete': 'நீக்கு',
  'button.update': 'புதுப்பி',
  'button.add': 'சேர்',
  'button.create': 'உருவாக்கு',
  'button.reset': 'மீட்டமை',
  'button.reset-to-defaults': 'இயல்புநிலைக்கு மீட்டமை',

  'button.confirm': 'உறுதிப்படுத்து',

  'button.back': 'பின்செல்',
  'button.add-trade': 'டிரேடைச் சேர்',
  'button.update-trade': 'டிரேடைப் புதுப்பி',
  'button.save-changes': 'மாற்றங்களைச் சேமி',
  'button.create-trade': 'டிரேடை உருவாக்கு',
  'button.delete-all': 'அனைத்தையும் நீக்கு',
  'button.clear-all': 'அனைத்தையும் அழி',

  'button.cancel-reset': 'மீட்டமைப்பை ரத்துசெய்',
  'button.proceed-anyway': 'எப்படியும் தொடர்',
  'button.mark-reviewed': 'Reviewed எனக் குறி',
  'button.maybe-later': 'பிறகு பார்க்கலாம்',
  'button.upgrade-now': 'இப்போது மேம்படுத்து',

  'button.apply': 'பயன்படுத்து',

  'button.learn-more': 'மேலும் அறிக',
  'button.upload-image': 'ஊடகத்தைப் பதிவேற்று',
  'button.discord': 'Discord',
  'form.error.image-upload-unavailable': 'படப் பதிவேற்றம் கிடைக்கவில்லை',
  'trade.header.unknown-instrument': 'தெரியாத இன்ஸ்ட்ருமென்ட்',
  'validation.edit': 'EDIT',
  'validation.fix-errors': 'பின்வரும் பிழைகளை சரிசெய்யவும்:',
  'validation.setup-resolution-failed':
    'தேர்ந்தெடுக்கப்பட்ட Setups-ஐ தயாரிக்க முடியவில்லை. அவற்றைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'validation.basic-tab-errors.one': 'அடிப்படை தாவலில் {count} பிழை உள்ளது',
  'validation.basic-tab-errors.few': 'அடிப்படை தாவலில் {count} பிழைகள் உள்ளன',
  'validation.basic-tab-errors.many': 'அடிப்படை தாவலில் {count} பிழைகள் உள்ளன',
  'validation.basic-tab-errors.other': 'அடிப்படை தாவலில் {count} பிழைகள் உள்ளன',
  'validation.details-tab-errors.one': 'விவரங்கள் தாவலில் {count} பிழை உள்ளது',
  'validation.details-tab-errors.few':
    'விவரங்கள் தாவலில் {count} பிழைகள் உள்ளன',
  'validation.details-tab-errors.many':
    'விவரங்கள் தாவலில் {count} பிழைகள் உள்ளன',
  'validation.details-tab-errors.other':
    'விவரங்கள் தாவலில் {count} பிழைகள் உள்ளன',
  'validation.advanced-tab-errors.one': 'மேம்பட்ட தாவலில் {count} பிழை உள்ளது',
  'validation.advanced-tab-errors.few':
    'மேம்பட்ட தாவலில் {count} பிழைகள் உள்ளன',
  'validation.advanced-tab-errors.many':
    'மேம்பட்ட தாவலில் {count} பிழைகள் உள்ளன',
  'validation.advanced-tab-errors.other':
    'மேம்பட்ட தாவலில் {count} பிழைகள் உள்ளன',
  'validation.complete-required':
    'தேவையான அனைத்து புலங்களையும் பூர்த்தி செய்யவும்',

  'validation.missed-trade-requires-exit':
    'தவறவிட்ட டிரேட்களில் பூஜ்ஜியம் அல்லாத விலைகளுடன் வெளியேறும் தரவு இருக்க வேண்டும். அவை ஏற்கனவே கடந்துவிட்ட வாய்ப்புகளைக் குறிக்கின்றன, எனவே வெளியேறும் விலை என்னவாக இருக்கும் என்பதை நீங்கள் குறிப்பிட வேண்டும்.',
  'trade.validation.entry-required': 'குறைந்தபட்சம் ஒரு நுழைவு தேவை.',
  'trade.validation.entry-time-required': 'நுழைவு நேரம் தேவை.',
  'trade.validation.entry-price-required': 'நுழைவு விலை தேவை.',
  'trade.validation.entry-size-positive':
    'நுழைவு அளவு பூஜ்ஜியத்தை விட அதிகமாக இருக்க வேண்டும்.',
  'trade.validation.exit-required-closed':
    'மூடப்பட்ட டிரேட்களுக்கு குறைந்தபட்சம் ஒரு வெளியேற்றம் தேவை.',
  'trade.validation.exit-time-required': 'வெளியேறும் நேரம் தேவை.',
  'trade.validation.exit-price-required': 'வெளியேறும் விலை தேவை.',
  'trade.validation.exit-size-positive':
    'வெளியேறும் அளவு பூஜ்ஜியத்தை விட அதிகமாக இருக்க வேண்டும்.',
  'trade.validation.exit-size-exceeds-entry':
    'மொத்த வெளியேறும் அளவு மொத்த நுழைவு அளவை விட அதிகமாக இருக்கக்கூடாது.',
  'trade.validation.exit-before-entry':
    'முதல் நுழைவுக்கு முன் வெளியேற முடியாது.',
  'trade.validation.dividend-time-required': 'ஈவுத்தொகை நேரம் தேவை.',
  'trade.validation.dividend-amount-nonzero':
    'ஈவுத்தொகை பூஜ்ஜியமற்ற எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.direct-pnl-required': 'லாபம்/இழப்பு மதிப்பை உள்ளிடவும்.',
  'trade.validation.entry-time-select': 'நுழைவு நேரத்தைத் தேர்ந்தெடுக்கவும்.',
  'trade.validation.direction-required': 'ஒரு திசையைத் தேர்ந்தெடுக்கவும்.',
  'trade.validation.asset-type-required':
    'ஒரு சொத்து வகையைத் தேர்ந்தெடுக்கவும்.',
  'trade.validation.ticker-required': 'டிக்கரைத் தேர்ந்தெடுக்கவும்.',
  'trade.validation.ticker-invalid':
    'சரியான டிக்கர் சின்னத்தை உள்ளிடவும் (எழுத்துகள், எண்கள் & காலங்கள் மட்டும்).',
  'trade.validation.account-required':
    'குறைந்தது ஒரு கணக்கையாவது தேர்ந்தெடுக்கவும்.',
  'trade.validation.exit-time-select':
    'வெளியேறும் நேரத்தைத் தேர்ந்தெடுக்கவும்.',
  'trade.validation.entry-price-invalid': 'சரியான நுழைவு விலையை உள்ளிடவும்.',
  'trade.validation.exit-price-invalid': 'சரியான வெளியேறும் விலையை உள்ளிடவும்.',
  'trade.validation.position-size-invalid': 'சரியான Position அளவை உள்ளிடவும்.',
  'trade.validation.exit-time-after-entry':
    'வெளியேறும் நேரம் நுழைவு நேரத்திற்குப் பிறகு இருக்க வேண்டும்.',
  'trade.validation.expiration-date-required':
    'காலாவதி தேதியைத் தேர்ந்தெடுக்கவும்.',
  'trade.validation.strike-price-required': 'Strike Price-ஐ உள்ளிடவும்.',
  'trade.validation.option-type-required':
    'தயவுசெய்து விருப்ப வகையைத் தேர்ந்தெடுக்கவும் (Call அல்லது Put).',
  'trade.validation.contract-size-positive':
    'ஒப்பந்த அளவு பூஜ்ஜியத்தை விட அதிகமாக இருக்க வேண்டும்.',
  'trade.validation.dollars-per-point-min':
    'ஒரு புள்ளிக்கு டாலர்களை உள்ளிடவும் (நிமிடம் 0.01).',
  'trade.validation.lot-size-nonnegative':
    'லாட்டின் அளவு பூஜ்ஜியத்தை விட அதிகமாக இருக்க வேண்டும்.',
  'trade.validation.leverage-positive':
    'Leverage விகிதம் பூஜ்ஜியத்தை விட அதிகமாக இருக்க வேண்டும்.',
  'trade.validation.commission-type-invalid':
    'கமிஷன் வகை "fixed" அல்லது "percentage" ஆக இருக்க வேண்டும்.',
  'trade.validation.commission-number': 'கமிஷன் ஒரு எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.commission-percentage-range':
    'சதவீத கமிஷன் 0 முதல் 100 வரை இருக்க வேண்டும்.',
  'trade.validation.rebate-options-only':
    'Rebate options டிரேட்களுக்கு மட்டுமே அனுமதிக்கப்படுகிறது.',
  'trade.validation.rebate-number': 'Rebate ஒரு எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.rebate-positive':
    'Rebate நேர்மறை மதிப்பாக இருக்க வேண்டும்.',
  'trade.validation.swap-invalid': 'தவறான பரிமாற்றத் தொகை.',
  'trade.validation.fees-number': 'கட்டணம் ஒரு எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.risk-number': 'இடர் தொகை ஒரு எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.risk-valid-number':
    'அபாயத் தொகை சரியான எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.risk-positive':
    'அபாயத் தொகை பூஜ்ஜியத்தை விட அதிகமாக இருக்க வேண்டும்.',
  'trade.validation.fx-rate-number':
    'FX விகிதம் சரியான எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.fx-rate-positive':
    'FX விகிதம் பூஜ்ஜியத்தை விட அதிகமாக இருக்க வேண்டும்.',
  'trade.validation.stop-loss-number': 'Stop Loss ஒரு எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.stop-loss-valid-number':
    'Stop Loss சரியான எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.take-profit-price-required': 'Take Profit விலை தேவை.',
  'trade.validation.take-profit-price-number':
    'Take Profit விலை ஒரு எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.take-profit-price-valid-number':
    'Take Profit விலை சரியான எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.take-profit-close-percent-number':
    'Take Profit close percent ஒரு எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.take-profit-close-percent-valid-number':
    'Take Profit close percent சரியான எண்ணாக இருக்க வேண்டும்.',
  'trade.validation.take-profit-close-percent-range':
    'Take Profit close percent 1 மற்றும் 100 க்கு இடையில் இருக்க வேண்டும்.',
  'trade.validation.take-profit-total-close-percent-range':
    'Take Profit close percent மொத்தம் 100-ஐத் தாண்டக்கூடாது.',
  'validation.custom-field.key-empty': 'புல விசை காலியாக இருக்கக்கூடாது',
  'validation.custom-field.key-conflict':
    'இந்த புலத்தின் பெயர் உள்ளமைக்கப்பட்ட டிரேட் புலங்களுடன் முரண்படுகிறது',
  'validation.custom-field.key-format':
    'புல விசை ஒரு எழுத்தில் தொடங்க வேண்டும் மற்றும் எழுத்துக்கள், எண்கள் மற்றும் அடிக்கோடுகளை மட்டுமே கொண்டிருக்க வேண்டும்',
  'validation.custom-field.required': '{label} தேவை',
  'validation.custom-field.text': '{label} உரையாக இருக்க வேண்டும்',
  'validation.custom-field.min-length':
    '{label} குறைந்தது {minLength} எழுத்துகள் இருக்க வேண்டும்',
  'validation.custom-field.max-length':
    '{label} என்பது {maxLength} எழுத்துகளுக்கு மிகாமல் இருக்க வேண்டும்',
  'validation.custom-field.pattern-invalid': '{label} வடிவம் தவறானது',
  'validation.custom-field.pattern-invalid-pattern':
    '{label} தவறான சரிபார்ப்பு வடிவத்தைக் கொண்டுள்ளது',
  'validation.custom-field.number': '{label} ஒரு எண்ணாக இருக்க வேண்டும்',
  'validation.custom-field.min':
    '{label} குறைந்தபட்சம் {min} ஆக இருக்க வேண்டும்',
  'validation.custom-field.max': '{label} {max} ஐ விட அதிகமாக இருக்கக்கூடாது',
  'validation.custom-field.selection': '{label} சரியான தேர்வாக இருக்க வேண்டும்',
  'validation.custom-field.option': '{label} சரியான விருப்பமாக இருக்க வேண்டும்',
  'validation.custom-field.array':
    '{label} என்பது தேர்வுகளின் வரிசையாக இருக்க வேண்டும்',
  'validation.custom-field.invalid-option':
    '{label} தவறான விருப்பத்தைக் கொண்டுள்ளது: {item}',
  'validation.custom-field.date': '{label} சரியான தேதியாக இருக்க வேண்டும்',
  'validation.custom-field.time': '{label} சரியான நேரமாக இருக்க வேண்டும்',
  'validation.custom-field.time-format':
    '{label} சரியான நேர வடிவமாக இருக்க வேண்டும் (HH:MM, HH:MM:SS, அல்லது 12-மணிநேரம் AM/PM)',
  'validation.custom-field.time-values':
    '{label} தவறான நேர மதிப்புகளைக் கொண்டுள்ளது',

  'notice.login-success': 'உள்நுழைந்துள்ளீர்கள்!',

  'notice.logout-success': 'வெற்றிகரமாக வெளியேறியது',
  'notice.ftp-created': 'FTP Credentials வெற்றிகரமாக உருவாக்கப்பட்டன',
  'notice.ftp-reset':
    'FTP கடவுச்சொல் மீட்டமைக்கப்பட்டது! புதிய கடவுச்சொல்லை சேமிக்கவும்.',
  'notice.ftp-password-rotated':
    'இந்தச் சாதனத்திற்காக புதிய FTP Credentials உருவாக்கப்பட்டன. பிற சாதனங்களில் உள்ளமைக்கப்பட்ட FTP ஒத்திசைவு (எ.கா. உங்கள் MetaTrader EA) புதிய கடவுச்சொல்லுடன் புதுப்பிக்கப்பட வேண்டும்.',
  'notice.ftp-reused':
    'இந்தச் சாதனத்திலிருந்து ஏற்கனவே உள்ள FTP Credentials ஏற்றப்பட்டன. அவை இனி வேலை செய்யவில்லை என்றால், கடவுச்சொல்லை மீட்டமைக்கவும்.',
  'notice.template-saved': 'தளவமைப்பு சேமிக்கப்பட்டது',
  'notice.template-created': 'தளவமைப்பு உருவாக்கப்பட்டது',
  'notice.template-duplicated': 'தளவமைப்பு நகலெடுக்கப்பட்டது',
  'notice.template-applied': 'பயன்படுத்தப்பட்ட தளவமைப்பு: {name}',
  'notice.template-deleted': 'தளவமைப்பு நீக்கப்பட்டது',
  'notice.default-template-updated': 'இயல்பு தளவமைப்பு புதுப்பிக்கப்பட்டது',
  'notice.tradelog-saved': 'TradeLog அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன',
  'notice.settings-exported':
    'அமைப்புகள் {filename} க்கு ஏற்றுமதி செய்யப்பட்டன',
  'notice.settings-imported':
    'v{version} இலிருந்து அமைப்புகள் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டன. எல்லா மாற்றங்களையும் செயல்படுத்த Obsidian ஐ மீண்டும் தொடங்கவும்.',
  'notice.template-switched': 'இதற்கு மாறியது: {name}',
  'notice.hotkey-set': 'ஹாட்கீ தொகுப்பு: {hotkey}',
  'notice.auto-sync-toggled': 'தானாக ஒத்திசைவு {status}',
  'notice.auto-sync-enabled': 'செயல்படுத்தப்பட்டது',
  'notice.auto-sync-disabled': 'முடக்கப்பட்டது',
  'notice.reset-items': 'உருப்படிகளை இயல்புநிலைக்கு மீட்டமைக்கவும்',

  'notice.custom-fields-imported':
    '{count} தனிப்பயன் புலங்கள் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டன',

  'notice.csv-template-deleted': 'வார்ப்புரு "{name}" நீக்கப்பட்டது',
  'notice.csv-template-delete-failed':
    'வார்ப்புருவை நீக்க முடியவில்லை: {error}',
  'notice.csv-template-imported':
    'வார்ப்புரு "{name}" வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது',
  'notice.csv-symbol-mappings-created.one':
    '{count} சின்ன மேப்பிங் உருவாக்கப்பட்டது',
  'notice.csv-symbol-mappings-created.few':
    '{count} சின்ன மேப்பிங்ஸ் உருவாக்கப்பட்டது',
  'notice.csv-symbol-mappings-created.many':
    '{count} சின்ன மேப்பிங்ஸ் உருவாக்கப்பட்டது',
  'notice.csv-symbol-mappings-created.other':
    '{count} சின்ன மேப்பிங்ஸ் உருவாக்கப்பட்டது',
  'notice.csv-symbol-mapping-skipped': 'சின்ன மேப்பிங் தவிர்க்கப்பட்டது',
  'notice.csv-missing-fields':
    'இறக்குவதற்கு முன் தேவையான அனைத்து புலங்களையும் மேப் செய்யவும்',
  'notice.setups-added': '{count} டிரேட்களுக்கு Setups சேர்க்கப்பட்டன',
  'notice.tags-added': '{count} டிரேட்டில் குறிச்சொற்கள் சேர்க்கப்பட்டன',
  'notice.mistakes-added': '{count} டிரேட்டில் தவறுகள் சேர்க்கப்பட்டன',
  'notice.trades-duplicated.one': 'நகல் {count} டிரேட்',
  'notice.trades-duplicated.few': 'நகல் {count} டிரேட்கள்',
  'notice.trades-duplicated.many': 'நகல் {count} டிரேட்கள்',
  'notice.trades-duplicated.other': 'நகல் {count} டிரேட்கள்',
  'notice.trades-deleted.one': '{count} டிரேட் நீக்கப்பட்டது',
  'notice.trades-deleted.few': '{count} டிரேட்கள் நீக்கப்பட்டன',
  'notice.trades-deleted.many': '{count} டிரேட்கள் நீக்கப்பட்டன',
  'notice.trades-deleted.other': '{count} டிரேட்கள் நீக்கப்பட்டன',
  'notice.mark-reviewed.one':
    'மதிப்பாய்வு செய்யப்பட்டதாக {count} டிரேட் குறிக்கப்பட்டது',
  'notice.mark-reviewed.few':
    'மதிப்பாய்வு செய்யப்பட்டதாக {count} டிரேட் குறிக்கப்பட்டது',
  'notice.mark-reviewed.many':
    'மதிப்பாய்வு செய்யப்பட்டதாக {count} டிரேட் குறிக்கப்பட்டது',
  'notice.mark-reviewed.other':
    'மதிப்பாய்வு செய்யப்பட்டதாக {count} டிரேட் குறிக்கப்பட்டது',

  'notice.error.open-journalit':
    'Journalitஐத் திறக்க முடியவில்லை. Obsidian ஐ மீண்டும் ஏற்ற முயற்சிக்கவும்.',
  'notice.error.open-drc': 'DRC: {error}ஐ திறக்க முடியவில்லை',
  'notice.error.open-trade-log': 'டிரேட் பதிவைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-csv-import': 'Trade Import: {error}ஐ திறக்க முடியவில்லை',
  'notice.error.open-account-dashboard':
    'கணக்குகளைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-trade-form-edit':
    'திருத்த பயன்முறையில் டிரேட் படிவத்தைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-weekly-review':
    'வாராந்திர மதிப்பாய்வைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-monthly-review':
    'மாதாந்திர மதிப்பாய்வைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-quarterly-review':
    'காலாண்டு மதிப்பாய்வைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-yearly-review':
    'வருடாந்திர மதிப்பாய்வைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-onboarding':
    'ஆன்போர்டிங் ஓட்டத்தைத் திறக்க முடியவில்லை. விவரங்களுக்கு கன்சோலைச் சரிபார்க்கவும்.',

  'notice.error.open-release-notes':
    'வெளியீட்டுக் குறிப்புகளைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-update-notification':
    'புதுப்பிப்பு அறிவிப்பைத் திறக்க முடியவில்லை: {error}',
  'notice.error.open-layout-builder':
    'தளவமைப்பு உருவாக்கியைத் திறக்க முடியவில்லை: {error}',
  'notice.error.switch-template': 'தளவமைப்பை மாற்ற முடியவில்லை: {error}',
  'notice.error.switch-template-generic': 'தளவமைப்பை மாற்ற முடியவில்லை',

  'notice.error.no-active-file':
    'செயலில் கோப்பு இல்லை. முதலில் ஒரு குறிப்பைத் திறக்கவும்.',
  'notice.error.no-template-support':
    'இந்த குறிப்பு வகை தளவமைப்புகளை ஆதரிக்காது.',
  'notice.error.no-templates':
    'இந்தக் குறிப்பு வகைக்கான தளவமைப்புகள் எதுவும் இல்லை.',
  'notice.error.asset-type-required':
    'இன்ஸ்ட்ருமென்ட்டைச் சேர்க்கும்போது சொத்து வகை தேவை',
  'notice.error.column-required':
    'குறைந்தது ஒரு நெடுவரிசையாவது தெரியும்படி இருக்க வேண்டும்',
  'notice.error.save-settings': 'அமைப்புகளைச் சேமிப்பதில் பிழை: {error}',
  'notice.error.sign-in-vault': 'உங்கள் vault ஐ பதிவு செய்ய உள்நுழையவும்.',
  'notice.error.sign-in-sync': 'தானியங்கு ஒத்திசைவைப் பயன்படுத்த உள்நுழையவும்.',
  'notice.error.restore-auth':
    'அங்கீகாரத்தை மீட்டெடுக்க முடியவில்லை. அமைப்புகள் → அங்கீகாரத்திலிருந்து மீண்டும் உள்நுழையவும்.',
  'notice.error.export-settings':
    'அமைப்புகளை ஏற்றுமதி செய்ய முடியவில்லை. விவரங்களுக்கு கன்சோலைச் சரிபார்க்கவும்.',
  'notice.error.import-settings':
    'அமைப்புகளை இறக்குமதி செய்ய முடியவில்லை: {error}',
  'notice.error.reset-settings':
    'அமைப்புகளை மீட்டமைக்க முடியவில்லை. விவரங்களுக்கு கன்சோலைச் சரிபார்க்கவும்.',

  'notice.error.cannot-change-folder-during-sync':
    'ஒத்திசைவு செயலில் இருக்கும்போது கோப்புறை பாதையை மாற்ற முடியாது. ஒத்திசைவு முடிவடையும் வரை காத்திருக்கவும்.',
  'notice.error.file-not-found': 'கோப்பு கிடைக்கவில்லை: {path}',

  'notice.error.mark-reviewed':
    'மதிப்பாய்வு செய்யப்பட்ட டிரேட்களைக் குறிப்பதில் பிழை: {error}',
  'notice.error.add-setups': 'Setups-ஐ சேர்ப்பதில் பிழை: {error}',
  'notice.error.add-tags': 'குறிச்சொற்களைச் சேர்ப்பதில் பிழை: {error}',
  'notice.error.add-mistakes': 'தவறுகளைச் சேர்ப்பதில் பிழை: {error}',
  'notice.error.delete-trades': 'டிரேடை நீக்குவதில் பிழை: {error}',
  'notice.error.duplicate-trades': 'டிரேடை நகலெடுப்பதில் பிழை: {error}',
  'notice.error.csv-validation':
    'CSV/XLSX/XLS சரிபார்ப்பு தோல்வியடைந்தது: {errors}',
  'notice.error.import-failed': 'இறக்குமதி தோல்வி: {error}',
  'notice.error.file-too-large': 'கோப்பு மிகவும் பெரியது. அதிகபட்ச அளவு 10MB',
  'notice.error.select-csv':
    'தயவுசெய்து CSV/XLSX/XLS/HTML கோப்பைத் தேர்ந்தெடுக்கவும்',
  'notice.error.cannot-delete-builtin':
    'உள்ளமைக்கப்பட்ட தளவமைப்புகளை நீக்க முடியாது',
  'notice.error.duplicate-to-customize':
    'தனிப்பயனாக்க இந்த தளவமைப்பை நகலெடுக்கவும்',
  'notice.error.sign-out': 'வெளியேற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'notice.error.open-upgrade-modal':
    'பிரீமியம் அம்சம் கோரப்பட்டது, ஆனால் மேம்படுத்தல் உரையாடல் ஏற்றப்படவில்லை.',

  'notice.plugin-updated': 'Journalit v{version}க்கு புதுப்பிக்கப்பட்டது!',
  'notice.info.settings-recovered':
    'காப்புப்பிரதியிலிருந்து அமைப்புகள் மீட்டெடுக்கப்பட்டன. சில சமீபத்திய மாற்றங்கள் இழக்கப்படலாம்.',
  'notice.info.cannot-remove-locked': 'பூட்டிய விட்ஜெட்களை அகற்ற முடியாது',
  'notice.sync-mapping.updating':
    'புதிய கோப்புறை பாதைக்கான டிரேட் ஒத்திசைவு மேப்பிங்கைப் புதுப்பிக்கிறது...',
  'notice.sync-mapping.updated':
    'டிரேட் ஒத்திசைவு மேப்பிங் வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
  'notice.error.sync-mapping-update-failed':
    'டிரேட் ஒத்திசைவு மேப்பிங்கைப் புதுப்பிக்க முடியவில்லை. செருகுநிரலை மீண்டும் தொடங்கவும்.',
  'tradelog.title': 'டிரேட் பதிவு',
  'tradelog.root.all-trades': 'அனைத்து டிரேட்',
  'tradelog.view.selector.label': 'காண்க',

  'trade-form.guide.customization-modal.title':
    'உங்கள் பணிப்பாய்வுக்கு படிவத்தை மாற்றவும்',
  'trade-form.guide.customization-modal.description':
    'இங்கே நீங்கள் விருப்பத் தொகுதிகளைக் காட்டலாம், மறைக்கலாம் மற்றும் மறுவரிசைப்படுத்தலாம். நீங்கள் உண்மையில் பயன்படுத்தும் புலங்களில் படிவத்தை கவனம் செலுத்துங்கள்.',
  'trade-form.guide.finish.title': 'இது தனிப்பயனாக்குதல் அம்சமாகும்',
  'trade-form.guide.finish.description':
    'டிரேட் படிவம் வேறு ஜர்னலிங் பணிப்பாய்வுகளுடன் பொருந்த வேண்டும் என்றால் எப்போது வேண்டுமானாலும் இந்தப் பட்டனை மீண்டும் பார்வையிடலாம்.',
  'tradelog.guide.empty.intro.title': 'டிரேட் பதிவுக்கு வரவேற்கிறோம்',
  'tradelog.guide.empty.intro.description':
    'டிரேட்களை உலாவுதல், வரிசைப்படுத்துதல் மற்றும் மதிப்பாய்வு செய்வதற்கு இந்தப் பக்கம் உங்களின் முக்கிய இடமாகும். நீங்கள் டிரேட்களைச் சேர்த்தவுடன், முழு டிரேட் பதிவுப் பயணத்தையும் பெறுவீர்கள்.',
  'tradelog.guide.empty.state.title': 'டிரேட் தரவு எதுவும் கிடைக்கவில்லை',
  'tradelog.guide.empty.state.description':
    'உங்கள் செயல்திறனை இப்போது ஆராய முந்தைய டிரேட்களை இறக்குமதி செய்யவும் அல்லது புதிய டிரேடை கைமுறையாக பதிவு செய்யவும்.',
  'tradelog.guide.intro.title': 'இது உங்கள் டிரேட் பதிவு',
  'tradelog.guide.intro.description':
    'டிரேட்களை ஒவ்வொன்றாக மதிப்பாய்வு செய்யவும், வரிசைப்படுத்தவும், வடிகட்டவும், ஒரே நேரத்தில் பல டிரேட்களில் மாற்றங்களைச் செய்யவும் இந்தப் பக்கத்தைப் பயன்படுத்தவும்.',
  'tradelog.guide.view-selector.title':
    'உங்கள் வரலாற்றை எவ்வாறு மதிப்பாய்வு செய்ய விரும்புகிறீர்கள் என்பதைத் தேர்வுசெய்யவும்',
  'tradelog.guide.view-selector.description':
    'முழு டிரேட் அட்டவணை மற்றும் மாதங்கள், வாரங்கள் அல்லது நாட்கள் போன்ற குழுவான நேரக் காட்சிகளுக்கு இடையில் மாற இந்த மெனுவைப் பயன்படுத்தவும். டிரேட்கள் இயல்புநிலையாகும், ஆனால் நீங்கள் காலத்தின் அடிப்படையில் மதிப்பாய்வு செய்ய விரும்பும் போது குழுவான பார்வைகள் பயனுள்ளதாக இருக்கும்.',
  'tradelog.guide.filters.title':
    'டிரேட் பதிவைக் குறைக்க வடிப்பான்களைப் பயன்படுத்தவும்',
  'tradelog.guide.filters.description':
    'குறிப்பிட்ட கணக்குகள், Setups, குறிச்சொற்கள், டிரேட் வகைகள், நிலைகள் அல்லது தேதிகளை மட்டும் நீங்கள் மதிப்பாய்வு செய்ய விரும்பினால் வடிப்பான்களைத் திறக்கவும்.',
  'tradelog.guide.filter-modal.title': 'இவை உங்கள் விரிவான வடிப்பான்கள்',
  'tradelog.guide.filter-modal.description':
    'எந்த டிரேட்கள் காட்டப்பட வேண்டும் என்பதில் கூடுதல் கட்டுப்பாட்டை நீங்கள் விரும்பினால், இந்த modal-ஐப் பயன்படுத்தவும். வடிகட்டிகளை மதிப்பாய்வு செய்து அல்லது மாற்றிய பின் அதை மூடு.',
  'tradelog.guide.sorting.title':
    'அட்டவணையை வரிசைப்படுத்த நெடுவரிசை தலைப்புகளைக் கிளிக் செய்யவும்',
  'tradelog.guide.sorting.description':
    'டிரேட் காட்சியில், அட்டவணையை மறுவரிசைப்படுத்த, வரிசைப்படுத்தக்கூடிய நெடுவரிசைத் தலைப்பைக் கிளிக் செய்யவும். எடுத்துக்காட்டாக, உங்கள் மிகப்பெரிய வெற்றி மற்றும் மிகப்பெரிய இழப்பின் அடிப்படையில் வரிசைப்படுத்த Net P&L ஐக் கிளிக் செய்யவும்.',
  'tradelog.guide.gallery-mode.title': 'படக் காட்சியகமும் உள்ளது',
  'tradelog.guide.gallery-mode.description':
    'உங்கள் வர்த்தக ஸ்கிரீன்ஷாட்களை காட்சியகமாகப் பார்க்க இங்கே முறையை மாற்றுங்கள். முதல் முறை திறக்கும்போது ஒரு சிறிய வழிகாட்டி காட்டும்.',
  'tradelog.guide.multi-select.title': 'பல தேர்வை இயக்கவும்',
  'tradelog.guide.multi-select.description':
    'ஒரே நேரத்தில் பல டிரேட்களைத் தேர்ந்தெடுக்க இந்த பொத்தானைக் கிளிக் செய்யவும். பல-தேர்வு இயக்கத்தில் இருக்கும்போது, ​​வரிசை கிளிக்குகள் டிரேடைத் திறப்பதற்குப் பதிலாக அவற்றைத் தேர்ந்தெடுக்கும்.',
  'tradelog.guide.batch-actions.title': 'இவை உங்கள் தொகுதி நடவடிக்கைகள்',
  'tradelog.guide.batch-actions.description':
    'காணக்கூடிய அனைத்து டிரேட்களையும் தேர்ந்தெடுக்க, உங்கள் தேர்வை அழிக்க, டிரேட்களை மதிப்பாய்வு செய்ததாகக் குறிக்க, Setups-ஐ சேர்க்கவும், தவறுகளைச் சேர்க்கவும், டிரேட்களை நகல் செய்யவும் அல்லது ஒரே நேரத்தில் பல டிரேட்களை நீக்கவும் இந்தப் பட்டியைப் பயன்படுத்தவும். டிரேட்களின் வரம்பைத் தேர்ந்தெடுக்க நீங்கள் ஷிப்ட்-கிளிக் செய்யலாம்.',
  'tradelog.guide.column-settings.title': 'நெடுவரிசை அமைப்புகளைத் திறக்கவும்',
  'tradelog.guide.column-settings.description':
    'எந்த நெடுவரிசைகள் காட்டப்பட வேண்டும் மற்றும் அட்டவணை எவ்வளவு அடர்த்தியாக அல்லது விரிவாக இருக்க வேண்டும் என்பதைத் தேர்வுசெய்ய இந்தப் பொத்தானைக் கிளிக் செய்யவும்.',
  'tradelog.guide.active-columns.title':
    'நீங்கள் ஏற்கனவே பயன்படுத்தும் நெடுவரிசைகளை மறுவரிசைப்படுத்தவும் அல்லது அகற்றவும்',
  'tradelog.guide.active-columns.description':
    'செயலில் உள்ள நெடுவரிசைகளில், அதை நகர்த்த ஒரு நெடுவரிசையை இழுக்கவும் அல்லது உங்களுக்குத் தேவையில்லாத ஒன்றை அகற்றவும். இது அட்டவணையின் வரிசையை இடமிருந்து வலமாக மாற்றுகிறது.',
  'tradelog.guide.available-columns.title':
    'உங்களுக்கு கூடுதல் விவரங்கள் தேவைப்படும்போது மறைக்கப்பட்ட நெடுவரிசைகளைச் சேர்க்கவும்',
  'tradelog.guide.available-columns.description':
    'புலங்களை மீண்டும் அட்டவணையில் சேர்க்க, கிடைக்கும் நெடுவரிசைகளைத் திறக்கவும். அங்குதான் நீங்கள் முன்பு நீக்கியதை மீண்டும் கொண்டு வருகிறீர்கள்.',
  'tradelog.guide.open-trades.title':
    'நீங்கள் அதன் குறிப்பைத் திறக்க விரும்பும் போது டிரேடைக் கிளிக் செய்யவும்',
  'tradelog.guide.open-trades.description':
    'சாதாரண பயன்முறையில், டிரேடைக் கிளிக் செய்வதன் மூலம் அது திறக்கப்படும். பல-தேர்வு பயன்முறையில், கிளிக் செய்வதன் மூலம் அதைத் தேர்ந்தெடுக்கும். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள் என்பதைப் பொறுத்து அந்த இரண்டு நடத்தைகளுக்கு இடையில் மாறவும்.',
  'dashboard.guide.empty.intro.title': 'உங்கள் டாஷ்போர்டுக்கு வரவேற்கிறோம்',
  'dashboard.guide.empty.intro.description':
    'Journalit டிரேட் வரலாற்றை பகுப்பாய்வு செய்ய உங்கள் டாஷ்போர்டு பயனுள்ளதாக இருக்கும்.',
  'dashboard.guide.empty.state.title':
    'உங்கள் டிரேட் வரலாற்றை உங்களுடன் கொண்டு வாருங்கள்',
  'dashboard.guide.empty.state.description':
    'அர்த்தமுள்ள செயல்திறன் தரவுடன் தொடங்குவதற்கு முந்தைய டிரேட்களை இறக்குமதி செய்யவும் அல்லது உங்கள் முதல் டிரேடை நீங்கள் பதிவு செய்தால் கைமுறையாக டிரேடைச் சேர்க்கவும்.',
  'dashboard.guide.main.intro.title': 'இது உங்கள் டாஷ்போர்டு',
  'dashboard.guide.main.intro.description':
    'உங்கள் செயல்திறனைக் கண்காணிக்கவும், புள்ளிவிவரங்களை மதிப்பாய்வு செய்யவும், உங்களின் மிகவும் பயனுள்ள விளக்கப்படங்களை ஒரே இடத்தில் வைத்திருக்கவும் இந்தப் பக்கத்தைப் பயன்படுத்தவும்.',
  'dashboard.guide.main.filters.title':
    'வடிப்பான்கள் முழு டாஷ்போர்டையும் மாற்றும்',
  'dashboard.guide.main.filters.description':
    'இந்தப் பக்கத்தில் உள்ள ஒவ்வொரு புள்ளிவிவரமும் விளக்கப்படமும் வெவ்வேறு தேதி வரம்பு, கணக்கு, Setup, குறிச்சொல் அல்லது டிரேட் வகையைப் புதுப்பிக்க வேண்டுமெனில் வடிப்பான்களைப் பயன்படுத்தவும்.',
  'dashboard.guide.main.edit-layout.title':
    'இந்தப் பக்கத்தைத் தனிப்பயனாக்க, திருத்தப் பயன்முறையை இயக்கவும்',
  'dashboard.guide.main.edit-layout.description':
    'டேஷ்போர்டு விட்ஜெட்களை நகர்த்துவதற்கும், அளவை மாற்றுவதற்கும், அகற்றுவதற்கும், சேர்ப்பதற்கும், தளவமைப்பைத் திருத்து என்பதைக் கிளிக் செய்யவும்.',
  'dashboard.guide.main.open-widget-selector.title':
    'சேர் விட்ஜெட்டைத் திறக்கவும்',
  'dashboard.guide.main.open-widget-selector.description':
    'கூடுதல் விளக்கப்படங்களைச் சேர்க்க விட்ஜெட்டைச் சேர் என்பதைக் கிளிக் செய்யவும் மற்றும் நீங்கள் முன்பு நீக்கிய விட்ஜெட்களை மீண்டும் கொண்டு வரவும்.',
  'dashboard.guide.main.widget-picker.title':
    'நீங்கள் காட்ட விரும்புவதைத் தேர்ந்தெடுக்கவும்',
  'dashboard.guide.main.widget-picker.description':
    'உங்கள் டாஷ்போர்டில் தற்போது இல்லாத விளக்கப்படங்களையும் அளவீடுகளையும் இந்தத் தேர்வி காட்டுகிறது. அதைச் சேர்க்க ஒன்றைக் கிளிக் செய்யவும்.',
  'dashboard.guide.main.metrics.title':
    'இந்த சிறந்த அட்டைகள் உங்களின் விரைவான சுருக்கம்',
  'dashboard.guide.main.metrics.description':
    'மேல் வரிசையில் லாபம், Win Rate மற்றும் மொத்த டிரேட் போன்ற விரைவான பதில்களை உங்களுக்கு வழங்குகிறது. திருத்தும் பயன்முறையில், எந்த அட்டைகள் தோன்றும் என்பதை மாற்றலாம் மற்றும் அவற்றை மறுவரிசைப்படுத்தலாம்.',
  'dashboard.guide.main.bottom.title':
    'இங்குதான் நகரும் மற்றும் மறுஅளவாக்கம் நிகழ்கிறது',
  'dashboard.guide.main.bottom.description':
    'திருத்து தளவமைப்பு இயக்கத்தில் இருக்கும்போது, ​​அதை நகர்த்த ஒரு விட்ஜெட்டை இழுக்கவும். விட்ஜெட்டின் அளவை மாற்ற, அதன் கீழ் வலது மூலையை இழுக்கவும். பல பயனர்கள் தவறவிட்ட படி இது.',
  'dashboard.guide.main.save-layout.title':
    'நீங்கள் முடித்ததும் உங்கள் தளவமைப்பைச் சேமிக்கவும்',
  'dashboard.guide.main.save-layout.description':
    'தனிப்பயனாக்குவதை முடித்ததும், உங்கள் மாற்றங்களை வைத்திருக்க தளவமைப்பைச் சேமி என்பதைக் கிளிக் செய்யவும். நீங்கள் எப்போது வேண்டுமானாலும் திரும்பி வந்து இந்தப் பக்கத்தை மீண்டும் திருத்தலாம்.',
  'home.guide.intro.title': 'முகப்புக்கு வரவேற்கிறோம்',
  'home.guide.intro.description':
    'இது உங்கள் முக்கிய பக்கம். இது உங்கள் டிரேட் புள்ளிவிவரங்கள், விரைவான செயல்கள் மற்றும் மீதமுள்ள Journalitக்கான குறுக்குவழிகளைக் காட்டுகிறது.',
  'home.guide.filters.title':
    'இந்த பொத்தான்கள் உங்கள் விட்ஜெட்டுகள் காட்டுவதை மாற்றும்',
  'home.guide.filters.description':
    'நேரம், டிரேட் வகை அல்லது கணக்கை மாற்ற இவற்றைப் பயன்படுத்தவும், இதன் மூலம் நீங்கள் பார்க்க விரும்பும் தரவை உங்கள் முகப்பு விட்ஜெட்டுகள் காண்பிக்கும்.',
  'home.guide.settings.title': 'Journalit அமைப்புகள் எப்போதும் அருகிலேயே உள்ளன',
  'home.guide.settings.description':
    'Journalit அமைப்புகளை நேரடியாகத் திறக்க இந்தப் பொத்தானைப் பயன்படுத்தவும்.',
  'home.guide.customize.title':
    'முகப்பைத் தனிப்பயனாக்க எடிட் பயன்முறையை இயக்கவும்',
  'home.guide.customize.description':
    'தனிப்பயனாக்கத் தொடங்க, இந்த பொத்தானைக் கிளிக் செய்யவும். விட்ஜெட்களை நகர்த்துதல், மறுஅளவாக்கம் செய்தல், நீக்குதல் மற்றும் சேர்த்தல் ஆகியவற்றைத் திருத்தும் பயன்முறை திறக்கிறது.',
  'home.guide.quick-links-position.title':
    'விட்ஜெட்டுகளுக்கு மேலே அல்லது கீழே விரைவு இணைப்புகளை நகர்த்தவும்',
  'home.guide.quick-links-position.description':
    'விரைவு இணைப்புகள் வரிசை பிரதான விட்ஜெட் பகுதிக்கு மேலே உள்ளதா அல்லது அதற்குக் கீழே உள்ளதா என்பதைத் தேர்வுசெய்ய இந்தப் பொத்தானைப் பயன்படுத்தவும்.',
  'home.guide.quick-links.title':
    'இந்த விரைவு இணைப்புகள் உங்கள் வேகமான குறுக்குவழிகள்',
  'home.guide.quick-links.description':
    'விரைவு இணைப்புகள் பொதுவான செயல்கள் மற்றும் பக்கங்களுக்கு ஒரே கிளிக்கில் குறுக்குவழிகளை வழங்குகின்றன. திருத்த பயன்முறையில், நீங்கள் இங்கே காட்ட விரும்பாத இணைப்புகளையும் மறைக்கலாம்.',
  'home.guide.move-and-resize.title':
    'உங்கள் விட்ஜெட்களை நகர்த்தி அளவை மாற்றவும்',
  'home.guide.widget-picker.title': 'இங்கே விட்ஜெட்களைச் சேர்க்கவும்',
  'home.guide.widget-picker.description':
    'விட்ஜெட்களைச் சேர்க்கவும், விரைவு இணைப்புகளை மீட்டெடுக்கவும் அல்லது கணக்கு மற்றும் அமைப்பு குறுக்குவழிகளைச் சேர்க்கவும்.',
  'home.guide.move-and-resize.description':
    'திருத்த பயன்முறையில் நீங்கள் மறுசீரமைக்கக்கூடிய முக்கிய பகுதி இதுவாகும். விட்ஜெட்களை நகர்த்த இழுக்கவும் அல்லது மறுஅளவிட அதன் கீழ் வலது மூலையில் இருந்து விட்ஜெட்டை இழுக்கவும்.',
  'home.guide.add-widget.title': 'முகப்பில் உருப்படிகளைச் சேர்க்கவும்',
  'home.guide.add-widget.description':
    'விட்ஜெட்கள், விரைவு இணைப்புகள் அல்லது கணக்கு மற்றும் அமைப்பு குறுக்குவழிகளைச் சேர்க்க விட்ஜெட்டைச் சேர் என்பதைத் திறக்கவும்.',
  'home.guide.save-layout.title':
    'நீங்கள் முடித்ததும் உங்கள் தளவமைப்பைச் சேமிக்கவும்',
  'home.guide.save-layout.description':
    'தளவமைப்பில் நீங்கள் மகிழ்ச்சியாக இருக்கும்போது, ​​உங்கள் மாற்றங்களைச் சேமித்து, திருத்த பயன்முறையிலிருந்து வெளியேற, இந்தப் பொத்தானைக் கிளிக் செய்யவும்.',
  'home.guide.widget-interactions.title': 'அதுதான் முகப்பின் முக்கிய யோசனை',
  'home.guide.widget-interactions.description':
    'முகப்பு உங்கள் தனிப்பயனாக்கக்கூடிய டாஷ்போர்டு. தளவமைப்பை மாற்ற எடிட் பயன்முறையைப் பயன்படுத்தவும், மேலும் கருவிகள், அமைப்புகள் அல்லது ஆழமான பக்கங்களைத் திறக்க விட்ஜெட்களைக் கிளிக் செய்யவும்.',
  'layoutBuilder.guide.intro.title': 'இது உங்கள் தளவமைப்பு உருவாக்கி',
  'layoutBuilder.guide.intro.description':
    'உங்கள் மதிப்பாய்வு தளவமைப்புகள் எவ்வாறு கட்டமைக்கப்பட்டுள்ளன என்பதை இந்தப் பக்கம் கட்டுப்படுத்துகிறது. தொடங்குவதற்கான எளிதான வழி, உள்ளமைக்கப்பட்ட தளவமைப்பை நகலெடுத்து, பின்னர் உங்கள் நகலைத் தனிப்பயனாக்குவது.',
  'layoutBuilder.guide.sidebar-overview.title':
    'இந்தப் பக்கப்பட்டியில் நீங்கள் எதைத் திருத்துகிறீர்கள் என்பதைத் தேர்வுசெய்யலாம்',
  'layoutBuilder.guide.sidebar-overview.description':
    'பக்கப்பட்டியில் உள்ள ஒவ்வொரு பகுதியும் வெவ்வேறு தளவமைப்பு வகையாகும். டிரேட் தளவமைப்புகள் உங்கள் மதிப்பாய்வு தளவமைப்புகளிலிருந்து தனித்தனியாக இருக்கும், மேலும் நூலகப் பிரிவு தளவமைப்புகளைப் பகிர்வதற்காக உள்ளது. நீங்கள் சொந்தமாக நகலை உருவாக்கிய பிறகு, புதிய மதிப்பாய்வுக் குறிப்புகளுக்கு அதை இயல்புநிலையாக மாற்ற நட்சத்திரமிடலாம்.',
  'layoutBuilder.guide.pick-built-in.title':
    'உள்ளமைக்கப்பட்ட DRC தளவமைப்புடன் தொடங்கவும்',
  'layoutBuilder.guide.pick-built-in.description':
    'உங்கள் முதல் தளவமைப்பிற்கு, உள்ளமைக்கப்பட்ட DRC தளவமைப்புகளில் ஒன்றைத் தொடங்கவும். உங்கள் சொந்த நகலை உருவாக்கும் முன் இது உங்களுக்கு பாதுகாப்பான தொடக்க புள்ளியை வழங்குகிறது.',
  'layoutBuilder.guide.duplicate.title':
    'உள்ளமைக்கப்பட்ட தளவமைப்பை நகலெடுக்கவும்',
  'layoutBuilder.guide.duplicate.description':
    'உள்ளமைக்கப்பட்ட தளவமைப்புகள் ஆரம்ப புள்ளிகள். முதலில் ஒன்றை நகலெடுக்கவும், எனவே நீங்கள் பாதுகாப்பாக உங்கள் சொந்த பதிப்பை உருவாக்கலாம்.',
  'layoutBuilder.guide.preview-template.title':
    'தளவமைப்பு எப்படி இருக்கும் என்பதை இந்த முன்னோட்டம் காட்டுகிறது',
  'layoutBuilder.guide.preview-template.description':
    'முன்னோட்டத்தை உருட்டவும், ஓட்டத்தின் உணர்வைப் பெறவும். நீங்கள் திருத்தத் தொடங்கும் முன், தளவமைப்பு தெளிவாகப் படிக்கிறதா என்பதைச் சரிபார்க்க இது பயனுள்ளதாக இருக்கும்.',
  'layoutBuilder.guide.switch-to-editor.title': 'எடிட்டருக்கு மாறவும்',
  'layoutBuilder.guide.switch-to-editor.description':
    'தளவமைப்பு எப்படி இருக்கும் என்பதை முன்னோட்டம் காட்டுகிறது. எடிட்டர் என்பது நீங்கள் உண்மையில் அதை மாற்றும் இடமாகும்.',
  'layoutBuilder.guide.editor-overview.title':
    'இங்குதான் நீங்கள் தளவமைப்பைத் திருத்துகிறீர்கள்',
  'layoutBuilder.guide.editor-overview.description':
    'இங்கே தளவமைப்பை மறுபெயரிடவும், விட்ஜெட் பட்டியலை மதிப்பாய்வு செய்யவும், விட்ஜெட்களை மறுசீரமைக்க இடது கைப்பிடியை இழுக்கவும், அதை மாற்ற விட்ஜெட்டைக் கிளிக் செய்யவும் மற்றும் உங்களுக்குத் தேவையில்லாத எதையும் அகற்றவும்.',
  'layoutBuilder.guide.add-widget.title':
    'உங்கள் நகலில் விட்ஜெட்டைச் சேர்க்கவும்',
  'layoutBuilder.guide.add-widget.description':
    'உங்கள் தளவமைப்பில் புதிய தொகுதிகளை வைக்க, விட்ஜெட்டைச் சேர் என்பதைப் பயன்படுத்தவும். நீங்கள் எவ்வாறு மதிப்பாய்வு செய்கிறீர்கள் என்பதைப் பொருத்தும் பணிப்பாய்வுகளை இப்படித்தான் வடிவமைக்கிறீர்கள்.',
  'layoutBuilder.guide.open-widget-picker.title':
    'விட்ஜெட் பிக்கரைத் திறக்கவும்',
  'layoutBuilder.guide.open-widget-picker.description':
    'இந்த மதிப்பாய்வு வகைக்கு நீங்கள் சேர்க்கக்கூடிய விட்ஜெட்களை இந்தத் தேர்வி காட்டுகிறது.',
  'layoutBuilder.guide.choose-widget.title': 'விட்ஜெட்டைத் தேர்ந்தெடுக்கவும்',
  'layoutBuilder.guide.choose-widget.description':
    'பெயர், விளக்கம் அல்லது வகையின்படி விட்ஜெட்டைக் கண்டுபிடிக்க தேடல் பெட்டியில் தட்டச்சு செய்து, அதைத் தேர்ந்தெடுக்கவும். நீங்கள் அடுத்ததை அழுத்தவும், Journalit உங்களுக்கான முதல் முடிவைத் தேர்ந்தெடுக்கும்.',
  'layoutBuilder.guide.widget-library-docs.title':
    'நீங்கள் சிக்கிக்கொண்டால் விட்ஜெட் நூலகத்தைப் பயன்படுத்தவும்',
  'layoutBuilder.guide.widget-library-docs.description':
    'இது ஒவ்வொரு மதிப்பாய்வு வகைக்கும் விட்ஜெட் நூலகம், எடுத்துக்காட்டுகள் மற்றும் கிடைக்கும் அட்டவணையுடன் டாக்ஸ் பக்கத்தைத் திறக்கும்.',
  'layoutBuilder.guide.save-template.title': 'உங்கள் தளவமைப்பைச் சேமிக்கவும்',
  'layoutBuilder.guide.save-template.description':
    'உங்கள் நகல் சரியாகத் தெரிந்ததும், அதைச் சேமிக்கவும். உங்கள் மதிப்பாய்வு செயல்முறை மேம்படும் போது நீங்கள் அதைச் செம்மைப்படுத்தலாம்.',
  'layoutBuilder.guide.set-default-template.title':
    'இந்த நகலை உங்கள் இயல்புநிலை தளவமைப்பாக அமைக்கவும்',
  'layoutBuilder.guide.set-default-template.description':
    'புதிய மதிப்பாய்வுக் குறிப்புகள் இந்தத் தளவமைப்பைத் தானாகப் பயன்படுத்த வேண்டுமெனில், உங்கள் புதிய தளவமைப்பில் உள்ள நட்சத்திரத்தைக் கிளிக் செய்யவும்.',
  'tradelog.empty': 'டிரேட் இல்லை',
  'tradelog.empty.submessage':
    'டிரேட் குறிப்புகள் உங்கள் டிரேட் பதிவில் தோன்றுவதைக் காண அவற்றை உருவாக்கத் தொடங்குங்கள்.',
  'tradelog.processing': 'டிரேட் தரவைச் செயலாக்குகிறது...',
  'tradelog.node.file-not-found': 'டிரேட் கோப்பு கிடைக்கவில்லை: {path}',
  'tradelog.node.expand': 'விரிவாக்கு',
  'tradelog.node.collapse': 'சுருக்கு',
  'tradelog.node.navigate-to-review': '{type} மதிப்பாய்விற்கு செல்லவும்',
  'tradelog.node.performance.year': '{indicator} செயல்படும் ஆண்டு',
  'tradelog.node.performance.quarter':
    '{indicator} {year} இன் காலாண்டு செயல்திறன்',
  'tradelog.node.performance.month':
    '{indicator} செயல்படும் மாதம் {quarter} {year}',
  'tradelog.node.performance.week':
    '{month} {year} இன் {indicator} செயல்திறன் வாரம்',
  'tradelog.node.performance.day': '{indicator} செயல்படும் நாள் {week} {year}',
  'tradelog.node.performance.period': '{indicator} செயல்படும் காலம்',
  'tradelog.filter.all': 'அனைத்து நிலைகளும்',
  'tradelog.filter.all.desc': 'அனைத்து டிரேட் நிலைகளும்',
  'tradelog.filter.all-review-statuses': 'அனைத்து மதிப்பாய்வுகளும்',
  'tradelog.filter.all-directions': 'அனைத்து திசைகளும்',
  'tradelog.filter.winners': 'வெற்றி டிரேட்கள்',
  'tradelog.filter.winners.desc': 'வெற்றி டிரேட்கள்',
  'tradelog.filter.losers': 'தோல்வி டிரேட்கள்',
  'tradelog.filter.losers.desc': 'தோல்வி டிரேட்கள்',
  'tradelog.filter.breakeven': 'Breakeven',
  'tradelog.filter.breakeven.desc': 'Breakeven டிரேட்கள்',
  'tradelog.filter.open': 'திறந்தவை',
  'tradelog.filter.open.desc': 'தற்போது திறந்த டிரேட்கள்',
  'tradelog.filter.closed': 'மூடப்பட்டது',
  'tradelog.filter.closed.desc':
    'அனைத்து மூடிய டிரேட்களும் (Win/Loss/Breakeven)',
  'tradelog.type.all': 'அனைத்து வகைகளும்',
  'tradelog.type.all.desc': 'அனைத்து வகையான டிரேட்',
  'tradelog.type.regular': 'வழக்கமான',
  'tradelog.type.regular.desc': 'நிலையான டிரேட்',
  'tradelog.type.missed': 'தவறவிட்டது',
  'tradelog.type.missed.desc': 'தவறவிட்ட வாய்ப்புகள்',
  'tradelog.type.backtest': 'Backtest',
  'tradelog.type.backtest.desc': 'உருவகப்படுத்தப்பட்ட டிரேட்கள்',
  'tradelog.status.win': 'WIN',
  'tradelog.status.loss': 'LOSS',
  'tradelog.status.open': 'OPEN',
  'tradelog.status.partially-closed': 'PARTIALLY CLOSED',
  'tradelog.status.cancelled': 'CANCELLED',
  'tradelog.status.breakeven': 'BREAKEVEN',
  'tradelog.status.missed': 'MISSED',
  'tradelog.status.backtest': 'BACKTEST',
  'tradelog.status.expired': 'EXPIRED',
  'tradelog.no-columns': 'நெடுவரிசைகள் எதுவும் கட்டமைக்கப்படவில்லை',
  'tradelog.duration.ongoing': '(தொடர்ந்து)',
  'tradelog.tooltip.mistakes': 'தவறுகள்:',
  'tradelog.tooltip.setups': 'Setups:',
  'tradelog.tooltip.tags': 'குறிச்சொற்கள்:',
  'tradelog.tooltip.thesis': 'தீசிஸ்:',
  'tradelog.tooltip.mtComment': 'எம்டி கருத்து:',
  'tradelog.tooltip.accounts': 'கணக்குகள்:',
  'tradelog.copy-trade.tooltip':
    '{account} இலிருந்து {multiplier}x இல் நகலெடுக்கப்பட்டது',
  'tradelog.tooltip.partial-exits': 'பகுதி வெளியேறுதல்:',
  'tradelog.copy-trade.base-tooltip-title': 'கணக்கு முடிவுகள் நகலெடுக்கப்பட்டன',
  'tradelog.copy-trade.adjustment-action': 'நகலெடுக்கப்பட்டது PnL சரிசெய்',
  'tradelog.copy-trade.adjustment-title': 'நகலெடுக்கப்பட்டது PnL சரிசெய்',
  'tradelog.copy-trade.adjustment-description-primary':
    'இந்த நகலெடுக்கப்பட்ட டிரேட்டுக்கான கைமுறை PnL சரிசெய்தலை உள்ளிடவும்.',
  'tradelog.copy-trade.adjustment-description-secondary':
    'மோசமான நிரப்புதல்/செலவுகளுக்கு எதிர்மறை எண்ணைப் பயன்படுத்தவும்.',
  'tradelog.copy-trade.adjustment-preview': 'நிகர முன்னோட்டம் P&L:',

  'tradelog.copy-trade.adjustment-invalid': 'சரியான PnL சரிசெய்தலை உள்ளிடவும்.',
  'tradelog.copy-trade.adjustment-saved':
    'நகலெடுக்கப்பட்ட டிரேட் PnL சரிசெய்தல் சேமிக்கப்பட்டது.',
  'tradelog.tooltip.still-open': 'இன்னும் திறந்திருக்கிறது',

  'tradelog.alt.trade-image': '{instrument} படம்',
  'tradelog.alt.trade-image-n': '{instrument} படம் {n}',
  'tradelog.batch.delete-confirm.title': 'நீக்குதலை உறுதிப்படுத்தவும்',
  'tradelog.batch.delete-confirm.message.one':
    '{count} தேர்ந்தெடுக்கப்பட்ட டிரேடை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'tradelog.batch.delete-confirm.message.few':
    '{count} தேர்ந்தெடுக்கப்பட்ட டிரேட்களை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'tradelog.batch.delete-confirm.message.many':
    '{count} தேர்ந்தெடுக்கப்பட்ட டிரேட்களை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'tradelog.batch.delete-confirm.message.other':
    '{count} தேர்ந்தெடுக்கப்பட்ட டிரேட்களை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'tradelog.batch.delete-confirm.warning':
    'இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.',
  'tradelog.batch.setups.title': 'டிரேட்டில் Setups ஐச் சேர்க்கவும்',
  'tradelog.batch.setups.placeholder':
    'Setups-ஐ தேர்ந்தெடுக்கவும் அல்லது உருவாக்கவும்...',
  'tradelog.batch.tags.title': 'டிரேட்டில் குறிச்சொற்களைச் சேர்க்கவும்',
  'tradelog.batch.tags.placeholder':
    'குறிச்சொற்களைத் தேர்ந்தெடுக்கவும் அல்லது உருவாக்கவும்...',
  'tradelog.batch.mistakes.title': 'டிரேட்டில் தவறுகளைச் சேர்க்கவும்',
  'tradelog.batch.mistakes.placeholder':
    'தவறுகளைத் தேர்ந்தெடுக்கவும் அல்லது உருவாக்கவும்...',
  'tradelog.batch.none-selected': 'எதுவும் தேர்ந்தெடுக்கப்படவில்லை',
  'tradelog.batch.selected-count': '{count} தேர்ந்தெடுக்கப்பட்டது',
  'tradelog.batch.select-all.title':
    'காணக்கூடிய அனைத்து டிரேட்களையும் தேர்ந்தெடுக்கவும்',
  'tradelog.batch.select-all.label': 'அனைத்தையும் தேர்ந்தெடு',

  'tradelog.batch.already-reviewed':
    'தேர்ந்தெடுக்கப்பட்ட அனைத்து {total} டிரேட்களும் ஏற்கனவே மதிப்பாய்வு செய்யப்பட்டுள்ளன',
  'tradelog.batch.already-reviewed-single':
    'தேர்ந்தெடுக்கப்பட்ட டிரேட் ஏற்கனவே மதிப்பாய்வு செய்யப்பட்டுள்ளது',
  'tradelog.batch.already-reviewed-plain': 'ஏற்கனவே மதிப்பாய்வு செய்யப்பட்டது',
  'tradelog.batch.no-updates-needed':
    'டிரேட்களுக்கு புதுப்பிப்புகள் தேவையில்லை - எல்லா {total} க்கும் ஏற்கனவே இந்த {type} இருந்தது',
  'tradelog.batch.already-had-all':
    '{count} ஏற்கனவே அனைத்து {type} ஐயும் கொண்டுள்ளது',
  'tradelog.batch.errors-count.one': '{count} பிழை ஏற்பட்டது',
  'tradelog.batch.errors-count.few': '{count} பிழைகள் ஏற்பட்டன',
  'tradelog.batch.errors-count.many': '{count} பிழைகள் ஏற்பட்டன',
  'tradelog.batch.errors-count.other': '{count} பிழைகள் ஏற்பட்டன',
  'tradelog.batch.enable-multi-select': 'பல தேர்வை இயக்கு',
  'tradelog.batch.disable-multi-select': 'பல தேர்வை முடக்கு',
  'tradelog.batch.column-settings': 'நெடுவரிசை அமைப்புகள்',
  'tradelog.batch.marking-reviewed': 'குறிக்கின்றது...',
  'tradelog.batch.add-setups.aria': 'Setups-ஐ சேர்க்கவும்',

  'tradelog.batch.add-setups.label': 'Setups ஐச் சேர்க்கவும்',
  'tradelog.batch.add-tags.aria': 'குறிச்சொற்களைச் சேர்க்கவும்',

  'tradelog.batch.add-tags.label': 'குறிச்சொற்களைச் சேர்க்கவும்',
  'tradelog.batch.add-mistakes.aria': 'தவறுகளைச் சேர்க்கவும்',

  'tradelog.batch.add-mistakes.label': 'தவறுகளைச் சேர்க்கவும்',
  'tradelog.batch.adding': 'சேர்க்கிறது...',
  'tradelog.batch.add-count': 'சேர் ({count})',
  'tradelog.batch.duplicate.aria': 'நகல் டிரேட்',
  'tradelog.batch.duplicate.label': 'நகல்',
  'tradelog.batch.duplicating': 'நகலெடுக்கிறது...',
  'tradelog.batch.duplicate-skipped.one':
    '{count} தேர்ந்தெடுக்கப்பட்ட குறிப்பை நகலெடுக்க முடியாது',
  'tradelog.batch.duplicate-skipped.few':
    '{count} தேர்ந்தெடுக்கப்பட்ட குறிப்புகளை நகலெடுக்க முடியாது',
  'tradelog.batch.duplicate-skipped.many':
    '{count} தேர்ந்தெடுக்கப்பட்ட குறிப்புகளை நகலெடுக்க முடியாது',
  'tradelog.batch.duplicate-skipped.other':
    '{count} தேர்ந்தெடுக்கப்பட்ட குறிப்புகளை நகலெடுக்க முடியாது',
  'tradelog.batch.delete.aria': 'டிரேட்களை நீக்கு',

  'tradelog.batch.deleting': 'நீக்குகிறது...',
  'tradelog.batch.clear.aria': 'தெளிவான தேர்வு',

  'tradelog.batch.clear.label': 'அழி',
  'tradelog.settings.active-columns': 'செயலில் உள்ள நெடுவரிசைகள்',
  'tradelog.settings.available-columns': 'கிடைக்கும் நெடுவரிசைகள்',
  'tradelog.settings.active-desc':
    'நெடுவரிசைகளை மறுவரிசைப்படுத்த இழுக்கவும். அகற்ற X ஐ கிளிக் செய்யவும்.',
  'tradelog.settings.available-desc':
    'உங்கள் அட்டவணையில் அதைச் சேர்க்க ஒரு நெடுவரிசையைக் கிளிக் செய்யவும்.',
  'tradelog.settings.no-active':
    'செயலில் உள்ள நெடுவரிசைகள் இல்லை. கிடைக்கும் தாவலில் இருந்து நெடுவரிசைகளைச் சேர்க்கவும்.',
  'tradelog.settings.all-active': 'அனைத்து நெடுவரிசைகளும் செயலில் உள்ளன.',
  'tradelog.settings.expanded-view': 'விரிவாக்கப்பட்ட பார்வை',
  'tradelog.settings.expanded-view-desc':
    'குறிச்சொற்கள், Setups மற்றும் தவறுகளை பிள் பேட்ஜ்களாகக் காட்டு',
  'tradelog.settings.expanded-view-aria':
    'விரிவாக்கப்பட்ட பார்வை பயன்முறையை நிலைமாற்று',
  'tradelog.settings.saving': 'சேமிக்கிறது...',
  'tradelog.settings.reset': 'இயல்புநிலைக்கு மீட்டமைக்கவும்',
  'tradelog.category.basic': 'அடிப்படை தகவல்',
  'tradelog.category.timing': 'டைமிங்',
  'tradelog.category.prices': 'விலைகள்',
  'tradelog.category.risk': 'இடர் மேலாண்மை',
  'tradelog.category.position': 'Position & P/L',
  'tradelog.category.review': 'மதிப்பாய்வு',
  'tradelog.column.image': 'படம்',
  'tradelog.column.account': 'கணக்கு',
  'tradelog.column.ticker': 'டிக்கர்',
  'tradelog.column.exchange': 'Exchange',
  'tradelog.column.status': 'நிலை',
  'tradelog.column.direction': 'திசை',
  'tradelog.column.date': 'திறந்த தேதி',
  'tradelog.column.entryTime': 'நுழைவு நேரம்',
  'tradelog.column.exitDate': 'மூடும் தேதி',
  'tradelog.column.exitTime': 'எக்சிட் நேரம்',
  'tradelog.column.duration': 'கால அளவு',
  'tradelog.column.expirationDate': 'காலாவதியாகும்',
  'tradelog.column.daysToExpiry': 'DTE',
  'tradelog.column.entryPrice': 'நுழைவு',
  'tradelog.column.exitPrice': 'வெளியேற்றம்',
  'tradelog.column.priceMove': 'விலை நகர்வு',
  'tradelog.column.stopLoss': 'Stop Loss',
  'tradelog.column.slDistanceDollar': 'SL தூரம் $',
  'tradelog.column.slDistancePercent': 'SL தூரம் %',
  'tradelog.column.riskAmount': 'ரிஸ்க் $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.maePrice': 'MAE விலை',
  'tradelog.column.mfePrice': 'MFE விலை',
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': 'அளவு #',
  'tradelog.column.positionValue': 'அளவு $',
  'tradelog.column.fees': 'கட்டணம்',
  'tradelog.column.dividends': 'ஈவுத்தொகை',
  'tradelog.column.pnl': 'Net P&L',
  'tradelog.column.returnPercent': 'ரிட்டர்ன் %',
  'tradelog.column.setups': 'Setups',
  'tradelog.column.mistakes': 'தவறுகள்',
  'tradelog.column.tags': 'குறிச்சொற்கள்',
  'tradelog.column.reviewed': 'மதிப்பாய்வு செய்யப்பட்டது',
  'tradelog.column.thesis': 'தீசிஸ்',
  'tradelog.column.mtComment': 'MT கருத்து',
  'dashboard.title': 'டாஷ்போர்டு',
  'dashboard.empty.message': 'டிரேட் தரவு எதுவும் கிடைக்கவில்லை',
  'dashboard.empty.submessage':
    'உங்கள் செயல்திறனை இப்போது ஆராய முந்தைய டிரேட்களை இறக்குமதி செய்யவும் அல்லது புதிய டிரேடை கைமுறையாக பதிவு செய்யவும்.',
  'dashboard.empty.import-action': 'ஏற்கனவே உள்ள டிரேட்களை இறக்குமதி செய்யவும்',
  'dashboard.empty.manual-action': 'கைமுறையாக டிரேடைச் சேர்க்கவும்',
  'dashboard.empty.filter-hint':
    'உங்கள் வடிகட்டி அமைப்புகளைச் சரிசெய்ய முயற்சிக்கவும்',
  'dashboard.error.load-failed': 'தரவை ஏற்ற முடியவில்லை',
  'dashboard.no-data': 'டிரேட் தரவு எதுவும் கிடைக்கவில்லை',
  'dashboard.button.add-widget': 'விட்ஜெட்டைச் சேர்',
  'dashboard.button.save-layout': 'தளவமைப்பைச் சேமி',
  'dashboard.button.edit-layout': 'தளவமைப்பைத் திருத்து',
  'dashboard.metrics.netPnL': 'நிகர P&L',
  'dashboard.metrics.incl-unrealized': 'உட்பட {value} unrealized',
  'dashboard.metrics.winRate': 'Win Rate',
  'dashboard.metrics.profitFactor': 'Profit Factor',
  'dashboard.metrics.sharpeRatio': 'Sharpe Ratio',
  'dashboard.metrics.expectancy': 'Expectancy',
  'dashboard.metrics.numTrades': 'மொத்த டிரேட்கள்',

  'dashboard.metrics.numWinTrades': 'வெற்றி டிரேட்கள்',
  'dashboard.metrics.numLossTrades': 'தோல்வி டிரேட்கள்',
  'dashboard.metrics.avgWin': 'சராசரி வெற்றி',
  'dashboard.metrics.avgLoss': 'சராசரி இழப்பு',
  'dashboard.metrics.totalCommission': 'மொத்த கமிஷன்',
  'dashboard.metrics.totalFees': 'மொத்த கட்டணம்',
  'dashboard.metrics.maxDrawdown': 'அதிகபட்ச Drawdown',
  'dashboard.metrics.bestDay': 'சிறந்த நாள்',
  'dashboard.metrics.largestWin': 'மிகப்பெரிய வெற்றி',
  'dashboard.metrics.largestLoss': 'மிகப்பெரிய இழப்பு',
  'dashboard.metrics.longestWinStreak': 'சிறந்த ஸ்ட்ரீக்',
  'dashboard.metrics.longestLossStreak': 'மோசமான ஸ்ட்ரீக்',
  'dashboard.metrics.avgHoldTime': 'சராசரி Hold Time',
  'dashboard.metrics.avgWinHoldTime': 'சராசரி வெற்றி Hold Time',
  'dashboard.metrics.avgLossHoldTime': 'சராசரி இழப்பு Hold Time',
  'dashboard.metrics.avgWinnerHeat': 'சராசரி Winner Heat',
  'dashboard.metrics.winnerMaeP90': 'வெற்றியாளர் MAE P90',
  'dashboard.metrics.winnerMaeMedian': 'வெற்றியாளர் MAE Median',
  'dashboard.metrics.avgLossHeat': 'சராசரி Loss Heat',
  'dashboard.metrics.winnerAvgMfe': 'வெற்றியாளர் சராசரி MFE',
  'dashboard.metrics.loserAvgMfe': 'இழப்பாளர் சராசரி MFE',
  'dashboard.metrics.winnerMfeP90': 'வெற்றியாளர் MFE P90',
  'dashboard.metrics.loserMfeP90': 'இழப்பாளர் MFE P90',
  'dashboard.metrics.avgRR': 'சராசரி RR (Payoff)',
  'dashboard.metrics.avgRRRiskBased': 'சராசரி RR (R-அடிப்படையில்)',
  'dashboard.avgRR.tooltip.formula': 'சூத்திரம்: சராசரி வெற்றி / சராசரி இழப்பு',
  'dashboard.avgRR.tooltip.no-conversion':
    'இந்த Payoff விகிதம் FX மாற்றம் இல்லாமல் கலப்பு நாணயங்களை அடிப்படையாகக் கொண்டது மற்றும் தவறாக வழிநடத்தும்.',
  'dashboard.sharpeRatio.tooltip.title': 'Sharpe Ratio',
  'dashboard.sharpeRatio.tooltip.formula':
    'சூத்திரம்: சராசரி மூடிய-டிரேட் நிகர P&L / மூடிய-டிரேட் நிகர P&L-இன் மாதிரி நிலையான விலகல். இடர் இல்லாத விகிதம் 0, மதிப்பு வருடாந்திரப்படுத்தப்படவில்லை.',
  'dashboard.sharpeRatio.tooltip.coverage':
    '{total} மூடப்பட்ட டிரேட்களின் {valid} இலிருந்து கணக்கிடப்பட்டது',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'பகுதி கவரேஜ்: {valid} of {total} மூடப்பட்ட டிரேட்கள் வரையறுக்கப்பட்ட நிகர P&L.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'பூஜ்ஜியம் அல்லாத P&L மாறுபாட்டுடன் குறைந்தது இரண்டு மூடிய டிரேட்கள் தேவை.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'இந்த Sharpe Ratio ஆனது FX மாற்றம் இல்லாமல் கலப்பு நாணயங்களை அடிப்படையாகக் கொண்டது மற்றும் தவறாக வழிநடத்தும்.',
  'dashboard.avgRRRiskBased.tooltip.title': 'சராசரி RR (R-அடிப்படையில்)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'சூத்திரம்: சராசரி வென்ற R / சராசரி இழந்த R',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    '{total} இன் {valid} இலிருந்து கணக்கிடப்பட்ட இடர் தரவுகளுடன் மூடப்பட்ட டிரேட்',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'Risk-valid வெற்றிகள்: {wins}, இழப்புகள்: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'பகுதி இடர் கவரேஜ்: {valid} of {total} மூடப்பட்ட டிரேட்கள் சரியான இடர் தரவைக் கொண்டுள்ளன.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'R- அடிப்படையிலான RRக்கு போதுமான தரவு இல்லை. ஸ்டாப்-லாஸ்/ரிஸ்க் டேட்டாவைச் சேர்த்து, சரியான வெற்றி மற்றும் தோல்வி டிரேட்கள் இருப்பதை உறுதிசெய்யவும்.',
  'dashboard.conversion.title': '{currency} ஆக மாற்றப்பட்டது',
  'dashboard.conversion.converted-total': 'மாற்றப்பட்ட மொத்தம்',
  'dashboard.conversion.base': 'அடிப்படை: {currency}',

  'dashboard.conversion.using-ecb': 'ECB கட்டணங்களைப் பயன்படுத்துதல் ({date})',
  'dashboard.conversion.using-broker-pnl':
    '{count} {tradeLabel}க்கு தரகர் வழங்கிய அடிப்படை நாணயம் P&Lஐப் பயன்படுத்துதல்',
  'dashboard.conversion.using-manual-rate':
    '{count} {tradeLabel}-க்கு கைமுறை FX வீதத்தைப் பயன்படுத்துதல்',
  'dashboard.conversion.partial-warning':
    '⚠ {currencies} இல் உள்ள செலவுகள்/ஆபத்தை மாற்ற முடியவில்லை மற்றும் அவை விலக்கப்பட்டுள்ளன',
  'dashboard.conversion.trade-singular': 'டிரேட்',
  'dashboard.conversion.trade-plural': 'டிரேட் செய்கிறது',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} of {total} டிரேட் ({excluded} விலக்கப்பட்டது: {currencies})',
  'dashboard.conversion.original-pnl': 'அசல் P&L',
  'dashboard.conversion.converted-pnl': 'மாற்றப்பட்டது P&L',
  'dashboard.conversion.details-label': 'நாணய மாற்ற விவரங்கள்',

  'dashboard.top-section.add-metric': 'மெட்ரிக் சேர்க்கவும்',
  'dashboard.top-section.remove-metric': 'மெட்ரிக்கை அகற்று',
  'dashboard.top-section.failed-load': 'அளவீடுகளை ஏற்ற முடியவில்லை',
  'dashboard.filter.date.today': 'இன்று',
  'dashboard.filter.date.yesterday': 'நேற்று',
  'dashboard.filter.date.this-week': 'இந்த வாரம்',
  'dashboard.filter.date.this-month': 'இந்த மாதம்',
  'dashboard.filter.date.this-quarter': 'இந்த காலாண்டு',
  'dashboard.filter.date.this-year': 'இந்த ஆண்டு',
  'dashboard.filter.date.all-time': 'எல்லா நேரமும்',
  'dashboard.filter.date.custom': 'தனிப்பயன்',
  'dashboard.filter.date.from': 'இருந்து',
  'dashboard.filter.date.to': 'செய்ய',
  'dashboard.filter.accounts.all': 'அனைத்து கணக்குகளும்',
  'dashboard.filter.accounts.n-selected': '{count} கணக்குகள்',
  'dashboard.filter.accounts.select-all': 'அனைத்தையும் தேர்ந்தெடு',

  'dashboard.filter.accounts.none-found': 'கணக்குகள் எதுவும் இல்லை',
  'dashboard.filter.tags.all': 'அனைத்து குறிச்சொற்கள்',
  'dashboard.filter.tags.none': 'குறிச்சொற்கள் இல்லை',
  'dashboard.filter.tags.n-selected': '{count} குறிச்சொற்கள்',
  'dashboard.filter.tags.select-all': 'அனைத்தையும் தேர்ந்தெடு',
  'dashboard.filter.tags.none-found': 'குறிச்சொற்கள் எதுவும் இல்லை',
  'dashboard.filter.mistakes.all': 'அனைத்து தவறுகளும்',
  'dashboard.filter.mistakes.none': 'தவறுகள் இல்லை',
  'dashboard.filter.mistakes.n-selected': '{count} தவறுகள்',
  'dashboard.filter.mistakes.select-all': 'அனைத்தையும் தேர்ந்தெடு',
  'dashboard.filter.mistakes.none-found': 'பிழைகள் எதுவும் கண்டறியப்படவில்லை',
  'dashboard.filter.tickers.all': 'அனைத்து டிக்கர்களும்',
  'dashboard.filter.tickers.n-selected': '{count} டிக்கர்ஸ்',
  'dashboard.filter.tickers.select-all': 'அனைத்தையும் தேர்ந்தெடு',
  'dashboard.filter.tickers.none-found': 'டிக்கர் எதுவும் இல்லை',
  'dashboard.filter.setup.all': 'அனைத்து Setups',
  'dashboard.filter.setup.none': 'இல்லை Setup',
  'dashboard.filter.setup.n-selected': '{count} Setups',
  'dashboard.filter.setup.select-all': 'அனைத்தையும் தேர்ந்தெடு',

  'dashboard.widgets.daily-performance.title': 'தினசரி செயல்திறன்',
  'dashboard.widgets.daily-performance.period-aria': 'காலம்',
  'dashboard.widgets.daily-performance.period-days': '{count} நாட்கள்',
  'dashboard.widgets.weekday-performance.title': 'வார நாள் நிகழ்ச்சி',
  'dashboard.widgets.weekday-performance.metric-aria': 'மெட்ரிக்',
  'dashboard.widgets.weekday-performance.metric.net': 'நிகர',
  'dashboard.widgets.weekday-performance.metric.win-rate': 'Win Rate',
  'dashboard.widgets.weekday-performance.metric.trades': 'டிரேட்கள்',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    'Win Rate: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.weekday-performance.tooltip.trades': 'டிரேட்: {count}',
  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'டிரேட் இல்லை',
  'dashboard.widgets.hourly-performance.title': 'மணிநேர செயல்திறன்',
  'dashboard.widgets.hourly-performance.tooltip.trades': 'டிரேட்: {count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label': 'Win Rate',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    'Win Rate: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.hourly-performance.bucket-aria': 'வாளி அளவு',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes}m',
  'dashboard.widgets.hourly-performance.metric-aria': 'மெட்ரிக்',
  'dashboard.widgets.hourly-performance.metric.total': 'மொத்தம்',
  'dashboard.widgets.hourly-performance.metric.average': 'சராசரி',

  'dashboard.widgets.hourly-performance.metric.total-r': 'மொத்த ஆர்',

  'dashboard.widgets.setup-performance.title': 'Setup செயல்திறன்',
  'dashboard.widgets.setup-performance.description':
    'அமைப்பின் மூலம் செயல்திறனை ஒப்பிடும் தரவரிசைப்பட்ட பட்டை விளக்கப்படம்',
  'dashboard.widgets.setup-performance.empty': 'Setup செயல்திறன் தரவு இல்லை',
  'dashboard.widgets.setup-performance.masked-label': 'Setup',
  'dashboard.widgets.tag-performance.title': 'டேக் செயல்திறன்',
  'dashboard.widgets.tag-performance.description':
    'டேக் மூலம் செயல்திறனை ஒப்பிடும் தரவரிசை பட்டை விளக்கப்படம்',
  'dashboard.widgets.tag-performance.empty': 'டேக் செயல்திறன் தரவு இல்லை',
  'dashboard.widgets.tag-performance.masked-label': 'குறிச்சொல்',
  'dashboard.widgets.ticker-performance.title': 'டிக்கர் செயல்திறன்',
  'dashboard.widgets.ticker-performance.metric-aria': 'மெட்ரிக்',
  'dashboard.widgets.ticker-performance.view-aria': 'காண்க',
  'dashboard.widgets.ticker-performance.view.best-and-worst': 'சிறந்த & மோசமான',
  'dashboard.widgets.ticker-performance.view.best': 'சிறந்த 10',
  'dashboard.widgets.ticker-performance.view.worst': 'மோசமான 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'மொத்தம் P&L',
  'dashboard.widgets.ticker-performance.metric.total-r': 'மொத்த ஆர்',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'Win Rate',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'டிக்கர்: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': 'டிரேட்: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Win Rate: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.ticker-performance.empty': 'டிக்கர் செயல்திறன் தரவு இல்லை',
  'dashboard.widgets.ticker-performance.empty-submessage':
    'தற்போதைய வடிப்பான்களுடன் டிக்கர் பொருத்தப்பட்ட எந்த மூடிய டிரேடும் இல்லை.',
  'dashboard.widgets.ticker-performance.masked-ticker': 'டிக்கர்',
  'dashboard.widgets.ticker-performance.omitted-count':
    '{count} தவிர்க்கப்பட்டது',
  'dashboard.widgets.rollingStats.title': 'ரோலிங் சராசரி வெற்றி/தோல்வி',
  'dashboard.widgets.rollingStats.period': 'காலம்',
  'dashboard.widgets.rollingStats.trades': '{count} டிரேட்',
  'dashboard.widgets.rollingStats.avgWin': 'சராசரி வெற்றி',
  'dashboard.widgets.rollingStats.avgLoss': 'சராசரி இழப்பு',
  'dashboard.widgets.rollingStats.tooltip.trade': 'டிரேட் {label}',
  'dashboard.rolling_win_loss.title': 'ரோலிங் வெற்றி/தோல்வி விகிதம்',
  'dashboard.rolling_win_loss.period_aria': 'காலம்',
  'dashboard.rolling_win_loss.trades_count': '{count} டிரேட்',
  'dashboard.rolling_win_loss.trade_label': 'டிரேட் {label}',
  'dashboard.rolling_win_loss.ratio_label': 'விகிதம்: {ratio}',
  'dashboard.rolling_win_loss.ratio_undefined':
    'விகிதம்: சாளரத்தில் இழப்புகள் இல்லை',
  'dashboard.rolling_win_loss.avg_win_label': 'சராசரி வெற்றி: {value}',
  'dashboard.rolling_win_loss.no_losses_band': 'இழப்புகள் இல்லை',
  'dashboard.rolling_win_loss.window_not_filled':
    'குறைந்தபட்சம் {count} மூடப்பட்ட டிரேட்கள் தேவை',
  'dashboard.rolling_win_loss.avg_loss_label': 'சராசரி இழப்பு: {value}',
  'home.widget.recent-items.name': 'சமீபத்தியவை',
  'home.widget.recent-items.description':
    'சமீபத்தில் திறந்த கோப்புகள் மற்றும் பார்வைகள்',
  'home.widget.year-heatmap.name': 'டிரேடிங் ஹீட்மேப்',
  'home.widget.year-heatmap.description':
    'இந்த ஆண்டின் டிரேடிங் செயல்பாட்டைக் காட்டும் நாட்காட்டி',
  'home.widget.getting-started.name': 'தொடங்குவோம்',
  'home.widget.getting-started.description':
    'டிரேட் வரலாற்றைச் சேர்க்கவும் Journalit-ஐ அமைக்கவும் உதவும் சரிபார்ப்புப் பட்டியல்',
  'home.widget.getting-started.progress': '{completed}/{total} முடிந்தது',
  'home.widget.getting-started.progress.loading':
    'முன்னேற்றத்தை சரிபார்க்கிறது...',
  'home.widget.getting-started.item.account.title':
    'உங்கள் வர்த்தகக் கணக்கை அமைக்கவும்',
  'home.widget.getting-started.item.account.description':
    'வர்த்தகங்கள் உங்கள் இருப்பைக் கண்காணிக்கும் கணக்கில் பதிவாகின்றன. அது இல்லாமல் வருவாயையும் டிராடௌனையும் கணக்கிட முடியாது.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'கணக்கை அமைக்கவும்',
  'home.widget.getting-started.item.create.title': 'டிரேட் வரலாற்றைச் சேர்',
  'home.widget.getting-started.item.create.description':
    'இருக்கும் டிரேட்களை இறக்குமதி செய், Trade Sync-ஐ இணை, அல்லது முதல் டிரேடை கைமுறையாகச் சேர்.',
  'home.widget.getting-started.item.create.time': '30கள்',
  'home.widget.getting-started.item.create.cta': 'திற Trade Import',
  'home.widget.getting-started.item.tradelog.title': 'டிரேட் பதிவைத் திற',
  'home.widget.getting-started.item.tradelog.description':
    'எல்லா டிரேட்களையும் ஒரே இடத்தில் பகுப்பாய்வு செய்யும் டிரேட் தரவுத்தளம்.',
  'home.widget.getting-started.item.tradelog.time': '10வி',
  'home.widget.getting-started.item.tradelog.cta': 'டிரேட் பதிவைத் திறக்கவும்',
  'home.widget.getting-started.item.layouts.title':
    'தளவமைப்பு உருவாக்கியைத் திற',
  'home.widget.getting-started.item.layouts.description':
    'மதிப்பாய்வு தளவமைப்புகளை உங்கள் பாணிக்கு ஏற்ப வடிவமை.',
  'home.widget.getting-started.item.layouts.time': '1 நிமிடம்',
  'home.widget.getting-started.item.layouts.cta':
    'தளவமைப்பு உருவாக்கியைத் திறக்கவும்',
  'home.widget.getting-started.item.sidebar.title':
    'வழிசெலுத்தல் பக்கப்பட்டியைத் திற',
  'home.widget.getting-started.item.sidebar.description':
    'Journalit பக்கங்கள், மதிப்பாய்வுகள், கருவிகள் மற்றும் தேடலை எளிதில் அடையுங்கள்.',
  'home.widget.getting-started.item.sidebar.time': '10வி',
  'home.widget.getting-started.item.sidebar.cta': 'பக்கப்பட்டியைத் திறக்கவும்',
  'home.widget.getting-started.item.pro.title': 'PRO-ஐ இயக்கு',
  'home.widget.getting-started.item.pro.description':
    'Trade Import, Trade Sync மற்றும் பொருளாதார நாட்காட்டியை இயக்கவும்.',
  'home.widget.getting-started.item.pro.time': '1 நிமிடம்',
  'home.widget.getting-started.item.pro.cta': 'செயல்படுத்து',
  'home.widget.weekly-summary.name': 'வாராந்திர சுருக்கம்',
  'home.widget.weekly-summary.description':
    'தினசரி P&L ஸ்பார்க்லைனுடன் இந்த வார மெட்ரிக்குகள்',
  'home.widget.key-events.name': 'முக்கிய நிகழ்வுகள்',
  'home.widget.key-events.description':
    'இந்த வார மதிப்பாய்விலிருந்து முக்கிய செய்திகள் மற்றும் சந்தை நிகழ்வுகள்',
  'home.widget.key-events.empty-title': 'முக்கிய நிகழ்வுகள் எதுவும் இல்லை',
  'home.widget.key-events.open-aria':
    'இந்த வார வாராந்திர மதிப்பாய்வைத் திறக்கவும்',
  'home.widget.position-size.name': 'போசிஷன் சைஸ் கால்குலேட்டர்',
  'home.widget.position-size.description':
    'கணக்கு ரிஸ்க் சதவீதத்தின் அடிப்படையில் போசிஷன் அளவைக் கணக்கிடு',
  'home.widget.embedded-note.name': 'உட்பொதிக்கப்பட்ட குறிப்பு',
  'home.widget.embedded-note.description':
    'உங்கள் vault-இலிருந்து எந்த Markdown குறிப்பையும் காட்டு',
  'home.widget.current-streak.name': 'தற்போதைய ஸ்ட்ரீக்',
  'home.widget.current-streak.description':
    'வெற்றி மற்றும் தோல்வி ஸ்ட்ரீக்கைக் கண்காணி',
  'home.widget.best-hours.name': 'சிறந்த மணிநேரம்',
  'home.widget.best-hours.description':
    'நாளின் எந்த நேரத்தில் நீங்கள் சிறப்பாக டிரேட் செய்கிறீர்கள் என்று பார்',
  'home.widget.setup-leaderboard.name': 'டாப் பிரிவு',
  'home.widget.setup-leaderboard.description':
    'சிறந்த Setups, குறிச்சொற்கள், அசெட் வகைகள் அல்லது டிக்கர்களை ஒப்பிடு',
  'home.widget.unreviewed-trades.name': 'மதிப்பாய்வு செய்யப்படாத டிரேட்கள்',
  'home.widget.unreviewed-trades.description':
    'உங்கள் மதிப்பாய்வு தேவைப்படும் டிரேட்கள்',
  'home.widget.goals-progress.name': 'இலக்கு முன்னேற்றம்',
  'home.widget.goals-progress.description':
    'டிரேடிங் இலக்கை நோக்கிய முன்னேற்றத்தைக் கண்காணி',
  'home.widget.trading-score.name': 'டிரேடிங் மதிப்பெண்',
  'home.widget.trading-score.description':
    'ரேடார் விளக்கப்படத்துடன் முழு செயல்திறன் மதிப்பெண்',
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description':
    '7-நாள் ட்ரெண்டுடன் நிர்வாகத்தின் கீழ் உள்ள மொத்த சொத்துகள் (AUM)',
  'home.widget.drawdown-monitor.name': 'Drawdown மானிட்டர்',
  'home.widget.drawdown-monitor.description':
    'வரம்பு அமைக்கப்பட்ட கணக்குகளின் Drawdown நிலையைக் கண்காணி',
  'home.widget.profit-target-widget.name': 'Profit Target',
  'home.widget.profit-target-widget.description':
    'கணக்குகள் முழுவதும் Profit Target முன்னேற்றத்தைக் கண்காணி',
  'account.header.title': 'கணக்கு: {name}',
  'account.header.add-event.aria': 'வைப்பு / திரும்பப் பெறுதல் சேர்க்கவும்',
  'account.header.edit-account.aria': 'கணக்கைத் திருத்தவும்',
  'account.header.view-trades.aria': 'டிரேட் பதிவில் டிரேட்களைக் காண்க',
  'account.header.type': 'வகை:',
  'account.header.initial-balance': 'ஆரம்ப இருப்பு:',
  'account.header.current-balance': 'தற்போதைய இருப்பு:',
  'account.header.account-id': 'கணக்கு ஐடி:',
  'account.header.warning.trades-before-creation.one':
    'கணக்கு உருவாக்கும் தேதிக்கு முன் {count} டிரேட் கண்டறியப்பட்டது',
  'account.header.warning.trades-before-creation.few':
    'கணக்கு உருவாக்கும் தேதிக்கு முன் {count} டிரேட் கண்டறியப்பட்டது',
  'account.header.warning.trades-before-creation.many':
    'கணக்கு உருவாக்கும் தேதிக்கு முன் {count} டிரேட் கண்டறியப்பட்டது',
  'account.header.warning.trades-before-creation.other':
    'கணக்கு உருவாக்கும் தேதிக்கு முன் {count} டிரேட் கண்டறியப்பட்டது',
  'account.header.warning.earliest-trade':
    'ஆரம்ப டிரேட்: {date}. இது தவறான இருப்பு கணக்கீடுகளை ஏற்படுத்தலாம்.',
  'account.header.warning.fix-date.aria':
    'கணக்கு உருவாக்கப்பட்ட தேதியை சரிசெய்யவும்',
  'account.header.warning.fixing': 'சரிசெய்கிறது...',
  'account.header.warning.fix-date': 'தேதியை சரிசெய்யவும்',
  'account.header.notice.date-updated':
    'கணக்கு உருவாக்கப்பட்ட தேதி {date} க்கு புதுப்பிக்கப்பட்டது',
  'account.header.notice.update-failed-log':
    'கணக்கு உருவாக்கப்பட்ட தேதியைப் புதுப்பிக்க முடியவில்லை:',
  'account.header.notice.update-failed':
    'தேதியைப் புதுப்பிக்க முடியவில்லை: {error}',
  'ribbon.open-journalit': 'திற Journalit',

  'view.dashboard': 'டாஷ்போர்டு',
  'view.trade-log': 'டிரேட் பதிவு',
  'view.account-dashboard': 'கணக்குகள்',
  'view.account-page.title': 'கணக்கு: {name}',
  'view.account-page.title-default': 'கணக்கு பக்கம்',
  'view.account-page.no-account-selected':
    'கணக்கு எதுவும் தேர்ந்தெடுக்கப்படவில்லை',
  'view.account-page.no-account-instructions':
    'கணக்குகளிலிருந்து இந்தப் பக்கத்திற்குச் செல்.',
  'view.account-page.service-loading': 'கணக்கு பக்க சேவையை ஏற்றுகிறது...',
  'view.account-page.balance-chart-title': 'கணக்கு இருப்பு விளக்கப்படம்',
  'view.account-page.balance-chart-loading':
    'இருப்பு விளக்கப்படத்தை ஏற்றுகிறது...',
  'view.layout-builder': 'தளவமைப்பு உருவாக்கி',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': 'பொருளாதார நாட்காட்டி',
  'view.economic-calendar.this-week': 'இந்த வாரம்',
  'view.economic-calendar.import-count.one': '{count} நிகழ்வை இறக்குமதி செய்',
  'view.economic-calendar.import-count.few':
    '{count} நிகழ்வுகளை இறக்குமதி செய்',
  'view.economic-calendar.import-count.many':
    '{count} நிகழ்வுகளை இறக்குமதி செய்',
  'view.economic-calendar.import-count.other':
    '{count} நிகழ்வுகளை இறக்குமதி செய்',
  'view.economic-calendar.imported': 'இறக்குமதி செய்யப்பட்டது',
  'view.economic-calendar.update-available': 'புதுப்பிப்பு கிடைக்கிறது',
  'view.economic-calendar.filter.currency': 'நாணயம்',
  'view.economic-calendar.filter.impact': 'தாக்கம்',
  'view.economic-calendar.impact.high': 'அதிகம்',
  'view.economic-calendar.impact.medium': 'நடுத்தரம்',
  'view.economic-calendar.impact.low': 'குறைவு',
  'view.economic-calendar.impact.none': 'எதுவுமில்லை',
  'view.economic-calendar.pro-required':
    'பொருளாதார நாட்காட்டிக்கு Journalit Pro தேவை',
  'view.economic-calendar.error.offline':
    'ஆஃப்லைனில் இருக்கும்போது பொருளாதார நாட்காட்டியை ஏற்ற முடியாது.',
  'view.economic-calendar.error.generic':
    'பொருளாதார நாட்காட்டியை ஏற்ற முடியவில்லை.',
  'view.economic-calendar.empty':
    'இந்த வாரத்திற்கான பொருளாதார நிகழ்வுகள் எதுவும் இல்லை.',
  'view.economic-calendar.sync.aria': 'பொருளாதார நாட்காட்டி அமைப்புகளைத் திற',
  'view.economic-calendar.all-day': 'நாள் முழுவதும்',
  'view.economic-calendar.holiday-aria': 'விடுமுறை',
  'view.economic-calendar.refresh': 'நிகழ்வுகளைப் புதுப்பி',
  'view.economic-calendar.retry': 'மீண்டும் முயற்சி செய்',
  'view.economic-calendar.select-all': 'அனைத்தையும் தேர்ந்தெடு',
  'view.economic-calendar.select-aria': '{event} ஐத் தேர்ந்தெடு',
  'view.economic-calendar.impact-aria': 'தாக்கம்: {impact}',
  'view.economic-calendar.forecast': 'முன்னறிவிப்பு',
  'view.economic-calendar.previous': 'முந்தையது',
  'view.economic-calendar.actual': 'உண்மையானது',
  'view.economic-calendar.import-success':
    '{imported} இறக்குமதி செய்யப்பட்டது, {updated} புதுப்பிக்கப்பட்டது',
  'view.economic-calendar.import-failed':
    'நிகழ்வுகளை இறக்குமதி செய்ய முடியவில்லை.',
  'view.economic-calendar.restore-missing-events':
    'விடுபட்ட நிகழ்வுகளை மீட்டமை ({count})',
  'economicCalendar.guide.main.intro.description':
    'முழு வாரத்தையும் இங்கே பார்க்கலாம். Journalit உங்கள் வாராந்திர மதிப்பாய்வைத் தானாகப் புதுப்பித்தும் வைத்திருக்க முடியும், எனவே கைமுறை இறக்குமதி விருப்பத்திற்குரியது.',
  'economicCalendar.guide.main.filters.title':
    'இந்த வடிப்பான்கள் இந்த நாட்காட்டியை மட்டுமே மாற்றும்',
  'economicCalendar.guide.main.filters.description':
    'நாணயம் மற்றும் தாக்க வடிப்பான்கள் இங்கே நீங்கள் பார்க்கும் மற்றும் தேர்ந்தெடுக்கும் நிகழ்வுகளைச் சுருக்கும். அவை உங்கள் தானியங்கி இறக்குமதி விதிகளை மாற்றாது.',
  'economicCalendar.guide.main.settings.title':
    'அமைப்புகளில் தானியங்கி இறக்குமதியை உள்ளமைக்கவும்',
  'economicCalendar.guide.main.settings.description':
    'நாணயங்கள், தாக்க நிலைகள் மற்றும் விடுமுறைகளைத் தேர்ந்தெடுக்க இந்தப் பொத்தானைப் பயன்படுத்தி, தானியங்கி இறக்குமதியை இயக்கவும். Journalit தற்போதைய வாரத்தை உங்கள் வாராந்திர மதிப்பாய்வுடன் ஒத்திசைத்து, நீங்கள் வேண்டுமென்றே நீக்கிய நிகழ்வுகளை மீண்டும் சேர்க்காமல் இறக்குமதி செய்யப்பட்ட அளவீடுகளைப் புதுப்பிக்கும்.',
  'economicCalendar.guide.main.manual-import.title':
    'கைமுறை இறக்குமதி விருப்பத்திற்குரியது',
  'economicCalendar.guide.main.manual-import.description':
    'தெரியும் வரிசைகளைத் தேர்ந்தெடுத்து, ஒருமுறை இறக்குமதி செய்ய நிகழ்வுகளை இறக்குமதி செய் என்பதைப் பயன்படுத்தவும். தானியங்கி இறக்குமதி இயக்கப்பட்டிருந்தால் இதை ஒவ்வொரு வாரமும் செய்ய வேண்டியதில்லை.',
  'economicCalendar.guide.main.restore.title':
    'விடுபட்ட உள்ளமைக்கப்பட்ட நிகழ்வுகளை மீட்டமை',
  'economicCalendar.guide.main.restore.description':
    'உங்கள் சேமிக்கப்பட்ட தானியங்கி இறக்குமதி வரம்பிலுள்ள நிகழ்வுகள் விடுபட்டிருக்கும்போது இந்தப் பொத்தான் செயல்படும். வாரம் மீண்டும் முழுமையடைந்ததும் இது தெரிந்தபடியே இருந்து முடக்கப்படும்.',
  'economicCalendar.guide.main.summary.title':
    'ஒருமுறை அமைத்து, பின்னர் மதிப்பாய்வு செய்யுங்கள்',
  'economicCalendar.guide.main.summary.description':
    'தானியங்கி இறக்குமதி உள்ளமைக்கப்பட்டதும் உங்கள் வாராந்திர மதிப்பாய்வு நிரம்பியிருக்கும். உலாவ, ஒருமுறை இறக்குமதி செய்ய அல்லது விடுபட்ட நிகழ்வுகளை மீட்டமைக்க இங்கே திரும்புங்கள்.',
  'view.economic-calendar.pro-benefit':
    'உங்கள் வாராந்திர குறிப்பில் அதிக தாக்கமுள்ள நிகழ்வுகள்.',
  'view.economic-calendar.pro-benefit-trial':
    '14 நாள் இலவச சோதனையுடன் தொடங்குங்கள்.',
  'settings.economic-calendar.title': 'பொருளாதார நாட்காட்டி',
  'settings.economic-calendar.description':
    'இந்த வார பொருளாதார நிகழ்வுகளை உங்கள் வாராந்திர குறிப்பின் முக்கிய நிகழ்வுகளில் தானாக இறக்குமதி செய்கிறது.',
  'settings.economic-calendar.auto-import':
    'வாராந்திர நிகழ்வுகளைத் தானாக இறக்குமதி செய்',
  'settings.economic-calendar.auto-import-desc':
    'தற்போதைய வாராந்திர குறிப்பை நாட்காட்டியுடன் ஒத்திசைக்கிறது.',
  'settings.economic-calendar.currencies': 'நாணயங்கள்',
  'settings.economic-calendar.currencies-desc':
    'அனைத்து நாணயங்களையும் சேர்க்க காலியாக விடவும்.',
  'settings.economic-calendar.impacts': 'தாக்க நிலைகள்',
  'settings.economic-calendar.impacts-desc':
    'இறக்குமதி செய்ய வேண்டிய தாக்க நிலைகளைத் தேர்ந்தெடுக்கவும்.',
  'settings.economic-calendar.impacts-empty':
    'பொருளாதார வெளியீடுகள் எதுவும் தேர்ந்தெடுக்கப்படவில்லை. இயக்கப்பட்டிருந்தால் விடுமுறைகள் இன்னும் இறக்குமதி செய்யப்படும்.',
  'settings.economic-calendar.include-holidays': 'விடுமுறைகளைச் சேர்',
  'settings.economic-calendar.include-holidays-desc':
    'தேர்ந்தெடுத்த நாணயங்களுக்கான பொது மற்றும் வங்கி விடுமுறைகளை இறக்குமதி செய்.',
  'settings.economic-calendar.open-view': 'பொருளாதார நாட்காட்டியைத் திற',
  'settings.economic-calendar.open-view-desc':
    'இந்த வார நிகழ்வுகளைப் பார்த்து தேர்ந்தெடுத்தவற்றை இறக்குமதி செய்.',
  'settings.economic-calendar.pro-required':
    'தானியங்கி நாட்காட்டி இறக்குமதிக்கு Journalit Pro தேவை.',
  'widget.key-events.currency-label': 'நாணயம்',
  'widget.key-events.time-label': 'நேரம்',
  'widget.key-events.field-unset': 'அமைக்கப்படவில்லை',
  'widget.key-events.open-calendar-aria': 'பொருளாதார நாட்காட்டியைத் திற',
  'widget.key-events.restore-auto-import':
    'தானாக இறக்குமதி செய்யப்பட்ட நிகழ்வுகளை மீட்டமை',
  'widget.key-events.restore-missing-events':
    'விடுபட்ட நிகழ்வுகளை மீட்டமை ({count})',
  'home.quick-links.economic-calendar': 'பொருளாதார நாட்காட்டி',
  'navigation.items.nav-economic-calendar': 'பொருளாதார நாட்காட்டி',
  'command.open-economic-calendar': 'பொருளாதார நாட்காட்டியைத் திற',

  'status-bar.update-available-branded': 'Journalit-ஐ புதுப்பிக்கவும்',
  'status-bar.release-notes-branded':
    'Journalit · வெளியீட்டு குறிப்புகளைக் காண்க',
  'status-bar.update-aria-label':
    'Journalit {version} - பார்க்க கிளிக் செய்யவும்',
  'update.available.ready': 'புதிய பதிப்பு தயாராக உள்ளது',
  'template.transformation.orphaned-content.header':
    'முந்தைய தளவமைப்பிலிருந்து உள்ளடக்கம்',
  'template.transformation.orphaned-content.desc1':
    'பின்வரும் உள்ளடக்கம் புதிய தளவமைப்பிற்கு பொருந்தவில்லை.',
  'template.transformation.orphaned-content.desc2':
    'மேலே மதிப்பாய்வு செய்து ஒருங்கிணைக்கவும் அல்லது தேவை இல்லை என்றால் நீக்கவும்.',
  'template.editor.loading': 'தளவமைப்பை ஏற்றுகிறது...',
  'template.editor.built-in': 'உள்ளமைக்கப்பட்ட',
  'template.editor.unsaved-changes': 'சேமிக்கப்படாத மாற்றங்கள்',

  'template.editor.built-in-notice':
    'உள்ளமைக்கப்பட்ட தளவமைப்புகளைத் திருத்த முடியாது. இந்த தளவமைப்பை நகலெடுக்கவும் அல்லது தனிப்பயனாக்க புதிய ஒன்றை உருவாக்கவும்.',

  'template.editor.show-review-desc':
    'டிரேட் குறிப்புகளில் மதிப்பாய்வு பகுதியை எப்போது காண்பிக்க வேண்டும்',

  'template.editor.section-visibility': 'பிரிவு தெரிவுநிலை',
  'template.editor.trade-note-layout': 'டிரேட் குறிப்பு தளவமைப்பு',

  'template.editor.other-asset-types': 'மற்றவை',

  'template.editor.asset-type-add': 'சொத்து வகை',

  'template.editor.remove-asset-layout': 'சொத்து தளவமைப்பை அகற்று',

  'template.editor.nav-bar': 'வழிசெலுத்தல் பார்',
  'template.editor.nav-bar-desc':
    'டிரேட் காலவரிசை மற்றும் மதிப்பாய்வு இணைப்புகளைக் காட்டு',
  'template.editor.images': 'படங்கள்',
  'template.editor.images-desc': 'டிரேட் விளக்கப்படப் படங்களைக் காட்டு',
  'template.editor.metrics': 'அளவீடுகள்',
  'template.editor.metrics-desc':
    'நுழைவு, வெளியேறு, கால அளவு மற்றும் திட்ட மெட்ரிக் கார்டுகளைக் காட்டு',
  'template.editor.thesis': 'தீசிஸ்',
  'template.editor.thesis-desc': 'டிரேட் தீசிஸ் தொகுதியைக் காட்டு',
  'template.editor.missed-reason': 'தவறவிட்ட டிரேட் காரணம்',
  'template.editor.missed-reason-desc':
    'தவறவிட்ட டிரேட் ஏன் எடுக்கப்படவில்லை என்பதைக் காட்டு',
  'template.editor.metadata': 'மெட்டாடேட்டா',
  'template.editor.metadata-desc': 'கணக்குகள், Setups மற்றும் தவறுகளைக் காட்டு',
  'template.editor.metric-cards': 'மெட்ரிக் கார்டுகள்',
  'template.editor.metadata-rows': 'மெட்டாடேட்டா வரிசைகள்',
  'template.editor.accounts': 'கணக்குகள்',
  'template.editor.setups': 'Setups',
  'template.editor.mistakes': 'தவறுகள்',
  'template.editor.tags': 'குறிச்சொற்கள்',
  'template.editor.custom-fields': 'தனிப்பயன் புலங்கள்',
  'template.editor.custom-fields-desc':
    '{count} தனிப்பயன் புலங்கள் உள்ளமைக்கப்பட்டன',

  'template.editor.metric.position-size': 'Position Size',
  'template.editor.metric.execution-breakdown': 'செயல்படுத்தல் பிரிவு',
  'template.editor.metric.pnl': 'P&L',
  'template.editor.metric.r-multiple': 'R-multiple',
  'template.editor.metric.costs': 'செலவுகள்',

  'template.editor.review-button':
    'மதிப்பாய்வு செய்யப்பட்ட பொத்தானைக் குறிக்கவும்',
  'template.editor.review-button-desc':
    'டிரேடை மதிப்பாய்வு செய்ததாகக் குறிக்க பொத்தானைக் காட்டு',

  'csv.mapper.title': 'நெடுவரிசைகளை டிரேட் புலங்களுக்கு மேப் செய்',
  'csv.mapper.subtitle':
    'உங்கள் நெடுவரிசைகளை அவை பிரதிநிதித்துவப்படுத்தும் டிரேட் புலங்களுடன் பொருத்தவும்.',
  'csv.mapper.do-not-import': 'இறக்குமதி செய்ய வேண்டாம்',
  'csv.mapper.required-badge': 'தேவை',
  'csv.mapper.required-label': 'REQUIRED',
  'csv.mapper.example': 'எடுத்துக்காட்டு:',
  'csv.mapper.mode.title': 'இறக்குமதி முறை',
  'csv.mapper.mode.help':
    'கைமுறை வரிசைகள் எவ்வாறு விளக்கப்பட வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும். Direct PnL பயன்முறை, மேப் செய்யப்பட்ட PnL மதிப்புகளைப் பயன்படுத்தி வரிசைகளை மூடிய டிரேட்களாக இறக்குகிறது.',

  'csv.mapper.asset-type.help':
    'இந்தக் கோப்பில் உள்ள இன்ஸ்ட்ருமென்ட்டின் வகையைத் தேர்ந்தெடுக்கவும். இது தேவையான புலங்கள் மற்றும் பாகுபடுத்தும் தர்க்கத்தை தீர்மானிக்கிறது.',

  'csv.mapper.tip.title': 'உதவிக்குறிப்பு: கூடுதல் புலங்களை மேப் செய்',
  'csv.mapper.tip.desc':
    'commission மற்றும் profit_loss போன்ற விருப்பப் புலங்களை மேப் செய்வது இறக்கு தரத்தை மேம்படுத்தும். tags, images, Setups மற்றும் mistakes போன்ற பட்டியல் புலங்களுக்குப் பல நெடுவரிசைகளையும் மேப் செய்யலாம்.',
  'csv.mapper.missing-fields': '{assetType}க்கு தேவையான புலங்கள் இல்லை:',
  'csv.mapper.summary.title': 'சுருக்கம்:',
  'csv.mapper.summary.of': 'இன்',
  'csv.mapper.summary.columns-mapped': 'நெடுவரிசைகள் மேப் செய்யப்பட்டன',
  'csv.mapper.summary.all-mapped':
    'தேவையான அனைத்து புலங்களும் மேப் செய்யப்பட்டுள்ளன',
  'csv.mapper.available-fields.title': 'கிடைக்கும் டிரேட் புலங்கள்',
  'csv.mapper.available-fields.desc':
    'சொத்து-குறிப்பிட்ட புலங்களுக்கான விளக்கங்களுடன் வகையின்படி ஒழுங்கமைக்கப்பட்டது',

  'csv.template-import.label.share-code': 'பகிர்வுக் குறியீடு',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': 'இறக்குமதி வார்ப்புரு',

  'csv.template-import.error.import-failed':
    'வார்ப்புருவை இறக்குமதி செய்ய முடியவில்லை',

  'csv.export-template.label.share-code': 'பகிர்வுக் குறியீடு',

  'csv.export-template.button.copied': 'நகலெடுக்கப்பட்டது!',
  'csv.export-template.button.copy': 'கிளிப்போர்டுக்கு நகலெடுக்கவும்',
  'csv.mapper.field.symbol': 'சின்னம்',
  'csv.mapper.field.direction': 'திசை (Long/Short)',
  'csv.mapper.field.entry-time': 'நுழைவு நேரம்',
  'csv.mapper.field.exit-time': 'வெளியேறும் நேரம்',
  'csv.mapper.field.entry-price': 'நுழைவு விலை',
  'csv.mapper.field.exit-price': 'வெளியேறும் விலை',
  'csv.mapper.field.quantity': 'அளவு',
  'csv.mapper.field.notes': 'குறிப்புகள்',
  'csv.mapper.field.order-id': 'ஆர்டர் ஐடி',
  'csv.mapper.field.account-id': 'கணக்கு ஐடி',
  'csv.mapper.help.options-required': 'விருப்ப டிரேட்களுக்குத் தேவை',
  'csv.mapper.help.option-type-required':
    'Options-க்குத் தேவை (Call அல்லது Put)',
  'csv.mapper.help.contract-size':
    'விருப்பங்களுக்கான பெருக்கி (பொதுவாக 100) அல்லது எதிர்காலங்கள்',
  'csv.mapper.help.order-id': 'பகுதி நிரப்புகளை ஒருங்கிணைக்கப் பயன்படுகிறது',
  'csv.mapper.help.asset-types': 'stock, options, futures, forex, crypto',
  'csv.mapper.help.status': 'டிரேட் நிலை: திறந்த அல்லது மூடப்பட்டது',
  'csv.mapper.category.required': 'தேவையான புலங்கள்',
  'csv.mapper.category.optional-core': 'விருப்ப மைய புலங்கள்',
  'csv.mapper.category.identifiers': 'அடையாளங்காட்டிகள்',
  'csv.mapper.category.other': 'மற்றவை',
  'csv.mapper.category.options': 'விருப்பங்கள் புலங்கள்',
  'csv.mapper.category.futures': 'எதிர்கால புலங்கள்',

  'csv.broker.label': 'தரகர் / இறக்குமதி வடிவம்',

  'csv.broker.remove-favorite-aria': 'பிடித்தவற்றிலிருந்து அகற்று',
  'csv.broker.set-favorite-aria': 'பிடித்ததாக அமைக்கவும்',
  'csv.broker.ibkr': 'ஊடாடும் தரகர்கள் (IBKR)',
  'csv.broker.tradovate': 'Tradovate',
  'csv.broker.tradezero': 'TradeZero',
  'csv.broker.tradingview': 'TradingView காகித டிரேட்',
  'csv.broker.bybit': 'Bybit (USDT பெர்பெச்சுவல்ஸ்)',
  'csv.broker.blofin': 'ப்ளோஃபின்',
  'csv.broker.hyperliquid': 'Hyperliquid (பெர்பெச்சுவல்ஸ்)',
  'csv.broker.sierrachart': 'Sierra Chart (Futures)',
  'csv.broker.motivewave': 'MotiveWave',
  'csv.broker.fxreplay': 'FX Replay (பகுப்பாய்வு)',
  'csv.broker.atas': 'ATAS (புள்ளிவிவரங்கள் நிகழ்நேரம்)',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker.jdr': 'MetaTrader 4/5',

  'csv.account-selector.favorite.remove': 'பிடித்தவற்றிலிருந்து அகற்று',
  'csv.account-selector.favorite.set': 'பிடித்ததாக அமைக்கவும்',

  'csv.results.successfully-imported-suffix': 'டிரேட் செய்கிறது',

  'csv.results.failed-to-import-prefix': 'இறக்குமதி செய்ய முடியவில்லை',
  'csv.results.failed-to-import-suffix':
    'வரிசைகள் (கீழே உள்ள விவரங்களைக் காண்க)',
  'csv.results.pending-local-writes':
    '{count} டிரேட் குறிப்பு எழுதுதல்(கள்) இன்னும் நிலுவையில் உள்ளன. Journalit முடிக்கப்பட்ட எழுத்துகளை சீர்செய்து, முடிக்கப்படாத கணிப்புகளை மீட்டெடுப்பதற்குக் கிடைக்கும்.',
  'csv.results.pending-title': 'இறக்குமதி இன்னும் ஒத்திசைக்கிறது',

  'csv.image-review.count': '{count} படம்(கள்)',

  'image.uploader.paste-title':
    'கிளிப்போர்டிலிருந்து மீடியாவை ஒட்டவும் (Ctrl+V)',
  'image.uploader.pasting': 'ஒட்டுகிறது...',
  'image.uploader.paste': 'ஒட்டு',
  'image.uploader.url-placeholder':
    'மீடியா URL அல்லது கோப்பு பாதையை ஒட்டவும்...',
  'image.uploader.url-input-aria': 'மீடியா URL உள்ளீடு',
  'image.uploader.file-upload-aria': 'கோப்பிலிருந்து பதிவேற்றவும்',
  'image.uploader.paste-clipboard-aria': 'கிளிப்போர்டில் இருந்து ஒட்டவும்',
  'image.uploader.error-invalid-url':
    'தவறான மீடியா URL அல்லது கோப்பு பாதை. ஆதரிக்கப்படும் படம்/வீடியோ URL, vault மீடியா பாதை அல்லது Excalidraw இணைப்பை உள்ளிடவும்.',
  'image.viewer.alt-default': 'படம்',
  'image.viewer.description-default': 'மீடியா முன்னோட்டம்',

  'image.viewer.title-fullscreen': 'முழுத்திரையைப் பார்க்க கிளிக் செய்யவும்',

  'image.viewer.delete-button': 'மீடியாவை நீக்கு',
  'image.viewer.nav-prev': 'முந்தைய படம்',
  'image.viewer.nav-next': 'அடுத்த படம்',
  'image.viewer.zoom-in-hint': 'பெரிதாக்க பிஞ்ச் அல்லது கிளிக் செய்யவும்',
  'image.viewer.zoom-out-hint':
    '{scale}x (சிறிதாக்க பிஞ்ச் அல்லது கிளிக் செய்யவும்)',

  'image.viewer.close-aria': 'முழுத்திரையை மூடு',
  'image.viewer.copy-image': 'படத்தை நகலெடுக்கவும்',

  'image.viewer.copied': 'நகலெடுக்கப்பட்டது',
  'image.viewer.copy-failed': 'கிளிப்போர்டுக்கு படத்தை நகலெடுப்பதில் தோல்வி',
  'image.viewer.copy-unsupported':
    'இந்த சூழலில் பட கிளிப்போர்டு நகல் ஆதரிக்கப்படவில்லை',
  'media.viewer.video-controls': 'வீடியோ கட்டுப்பாடுகள்',
  'media.viewer.play-video': 'வீடியோவை இயக்கு',
  'media.viewer.pause-video': 'வீடியோவை இடைநிறுத்து',
  'media.viewer.mute-video': 'வீடியோவை முடக்கு',
  'media.viewer.unmute-video': 'வீடியோவை இயக்கு',
  'media.viewer.volume': 'தொகுதி',
  'media.viewer.back-5': 'மீண்டும் 5 வினாடிகள்',
  'media.viewer.forward-5': 'முன்னோக்கி 5 வினாடிகள்',
  'media.viewer.timeline': 'வீடியோ காலவரிசை',

  'image.carousel.no-images': 'காட்சிப்படுத்த படங்கள் இல்லை',
  'image.carousel.prev': 'முந்தைய படம்',
  'image.carousel.next': 'அடுத்த படம்',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'சிறுபடம் {index}',
  'paste.notice.image-pasted': '📋 படம் வெற்றிகரமாக ஒட்டப்பட்டது',
  'paste.notice.images-pasted': '📋 {count} படங்கள் வெற்றிகரமாக ஒட்டப்பட்டன',
  'paste.error.clipboard-not-supported': 'கிளிப்போர்டு API ஆதரிக்கப்படவில்லை',
  'paste.error.clipboard-empty': 'ஒட்டுவதற்கு கிளிப்போர்டில் எதுவும் இல்லை',
  'paste.error.file-size-exceeds': 'கோப்பின் அளவு {size}MB வரம்பை மீறுகிறது',
  'paste.error.no-images-found':
    'கிளிப்போர்டில் படங்கள் எதுவும் இல்லை. முதலில் படத்தை நகலெடுக்க முயற்சிக்கவும்.',
  'paste.error.permission-denied': 'அனுமதி மறுக்கப்பட்டது',

  'datepicker.button.clear': 'அழி',
  'datepicker.button.today': 'இன்று',
  'datepicker.button.now': 'இப்போது',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',
  'common.loading': 'ஏற்றுகிறது...',
  'common.error': 'பிழை',

  'common.warning': 'எச்சரிக்கை',
  'common.info': 'தகவல்',
  'common.yes': 'ஆம்',
  'common.no': 'இல்லை',
  'common.ok': 'சரி',

  'common.select-option': 'ஒரு விருப்பத்தைத் தேர்ந்தெடு',

  'common.none': 'ஏதுமில்லை',
  'common.other': 'மற்றவை',
  'common.breakdown': 'பிரிவு',
  'common.na': 'N/A',
  'common.unknown': 'தெரியாதது',
  'common.unknown-error': 'தெரியாத பிழை',
  'common.all': 'அனைத்தும்',
  'common.select-all': 'அனைத்தையும் தேர்ந்தெடு',
  'common.n-types': '{count} வகைகள்',
  'common.select-item': '{item}-ஐத் தேர்ந்தெடு',
  'common.header': 'தலைப்பு',

  'common.date': 'தேதி',

  'common.days': 'நாட்கள்',
  'common.week': 'வாரம்',
  'common.weeks': 'வாரங்கள்',
  'common.month': 'மாதம்',
  'common.months': 'மாதங்கள்',
  'common.year': 'ஆண்டு',
  'common.years': 'ஆண்டுகள்',
  'common.quarter': 'காலாண்டு',
  'common.quarters': 'காலாண்டுகள்',

  'common.min': 'குறைந்தபட்சம்',
  'common.max': 'அதிகபட்சம்',
  'common.best': 'சிறந்தது',
  'common.worst': 'மோசமானது',
  'common.profit': 'லாபம்',

  'common.trade': 'டிரேட்',
  'common.trades': 'டிரேட்கள்',

  'common.statuses': 'நிலைகள்',
  'common.enabled': 'இயக்கத்தில்',
  'common.disabled': 'முடக்கத்தில்',
  'common.color.gray': 'சாம்பல்',
  'common.color.red': 'சிவப்பு',
  'common.color.orange': 'ஆரஞ்சு',
  'common.color.yellow': 'மஞ்சள்',
  'common.color.label': 'நிறம்',
  'common.color.default': 'இயல்புநிலை',
  'common.day.monday': 'திங்கள்',
  'common.day.tuesday': 'செவ்வாய்',
  'common.day.wednesday': 'புதன்',
  'common.day.thursday': 'வியாழன்',
  'common.day.friday': 'வெள்ளி',
  'common.day.saturday': 'சனி',
  'common.day.sunday': 'ஞாயிறு',
  'common.day.all-week': 'முழு வாரமும்',
  'common.month.january': 'ஜனவரி',
  'common.month.february': 'பிப்ரவரி',
  'common.month.march': 'மார்ச்',
  'common.month.april': 'ஏப்ரல்',
  'common.month.may': 'மே',
  'common.month.june': 'ஜூன்',
  'common.month.july': 'ஜூலை',
  'common.month.august': 'ஆகஸ்ட்',
  'common.month.september': 'செப்டம்பர்',
  'common.month.october': 'அக்டோபர்',
  'common.month.november': 'நவம்பர்',
  'common.month.december': 'டிசம்பர்',
  'common.score.poor': 'மோசம்',
  'common.score.below-average': 'சராசரிக்குக் கீழ்',
  'common.score.average': 'சராசரி',
  'common.score.strong': 'வலுவானது',
  'common.score.excellent': 'சிறப்பு',
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'உச்சநிலை உணரப்பட்டது P&L',
  'chart.tooltip.episode-start': 'எபிசோட் ஆரம்பம்',
  'chart.tooltip.underwater-days': 'நீருக்கடியில் நேரம்',
  'chart.tooltip.underwater-trades': 'நீருக்கடியில் டிரேட்',

  'chart.tooltip.drawdown-amount': 'தொகை',
  'chart.tooltip.drawdown-percent': '{basis} இன் Drawdown %',
  'chart.tooltip.percent-basis': 'சதவீதம் அடிப்படை',
  'chart.tooltip.trade-pnl': 'டிரேட் P&L',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} மேலும்',
  'chart.loading': 'விளக்கப்படத்தை ஏற்றுகிறது...',
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'நுழைவு',
  'chart.legend.exit': 'வெளியேற்றம்',
  'chart.legend.trade': 'டிரேட்',
  'calendar.day.mon': 'திங்',
  'calendar.day.tue': 'செவ்',
  'calendar.day.wed': 'புத',
  'calendar.day.thu': 'வியா',
  'calendar.day.fri': 'வெள்',
  'calendar.day.sat': 'சனி',
  'calendar.day.sun': 'ஞாயி',
  'calendar.month.jan': 'ஜன',
  'calendar.month.feb': 'பிப்',
  'calendar.month.mar': 'மார்',
  'calendar.month.apr': 'ஏப்',
  'calendar.month.may': 'மே',
  'calendar.month.jun': 'ஜூன்',
  'calendar.month.jul': 'ஜூலை',
  'calendar.month.aug': 'ஆக',
  'calendar.month.sep': 'செப்',
  'calendar.month.oct': 'அக்',
  'calendar.month.nov': 'நவ',
  'calendar.month.dec': 'டிச',
  'calendar.legend.less': 'குறைவு',
  'calendar.legend.more': 'மேலும்',

  'settings.ftp.title': 'FTP Credentials',
  'settings.ftp.title-metatrader': 'MetaTrader-க்கான FTP Credentials',
  'settings.ftp.loading': 'FTP Credentials-ஐ ஏற்றுகிறது...',
  'settings.ftp.info-message':
    'MetaTrader இன் FTP வெளியீட்டு அமைப்புகளை உள்ளமைக்க இந்த Credentials-ஐப் பயன்படுத்தவும்:',
  'settings.ftp.label.server': 'FTP சேவையகம்:',
  'settings.ftp.label.login': 'FTP உள்நுழைவு:',
  'settings.ftp.label.password': 'FTP கடவுச்சொல்:',
  'settings.ftp.aria.copy-server': 'FTP சேவையகத்தை நகலெடுக்கவும்',
  'settings.ftp.aria.copy-login': 'FTP உள்நுழைவை நகலெடுக்கவும்',
  'settings.ftp.aria.copy-password': 'கடவுச்சொல்லை நகலெடுக்கவும்',
  'settings.ftp.aria.password-unavailable': 'நகலெடுக்க கடவுச்சொல் இல்லை',
  'settings.ftp.aria.password-hidden': 'கடவுச்சொல் மறைக்கப்பட்டுள்ளது',
  'settings.ftp.aria.hide-password': 'கடவுச்சொல்லை மறை',
  'settings.ftp.aria.show-password': 'கடவுச்சொல்லைக் காட்டு',
  'settings.ftp.notice.password-masked':
    'கடவுச்சொல் சேமிக்கப்பட்டுள்ளது, ஆனால் பார்க்க/நகல் செய்ய கிடைக்கவில்லை. புதிய ஒன்றைப் பெற கடவுச்சொல்லை மீட்டமைக்கவும்.',
  'settings.ftp.notice.password-save':
    'இந்த கடவுச்சொல்லை பாதுகாப்பாக சேமிக்கவும். பின்னர் அதை மீட்டெடுக்க முடியாது.',
  'settings.ftp.button.reset': 'FTP கடவுச்சொல்லை மீட்டமைக்கவும்',
  'settings.ftp.button.resetting': 'கடவுச்சொல்லை மீட்டமைக்கிறது...',
  'settings.ftp.reset-hint':
    'புதிய FTP கடவுச்சொல்லை உருவாக்க, இந்தப் பொத்தானைக் கிளிக் செய்யவும்.',
  'settings.ftp.instructions.title': 'MetaTrader 4 Setup வழிமுறைகள்:',
  'settings.ftp.instructions.step1': 'திற MetaTrader 4 (MT4)',
  'settings.ftp.instructions.step2':
    'மேலே உள்ள "Tools" மெனுவைக் கிளிக் செய்யவும்',
  'settings.ftp.instructions.step3':
    '"விருப்பங்கள்" என்பதைத் தேர்ந்தெடுக்கவும்',
  'settings.ftp.instructions.step4':
    '"FTP" தாவலுக்குச் சென்று மேலே காட்டப்பட்டுள்ள FTP சேவையகம், உள்நுழைவு மற்றும் கடவுச்சொல்லை உள்ளிடவும்',
  'settings.ftp.instructions.step5': '"செயலற்ற பயன்முறையை" இயக்கு',
  'settings.ftp.instructions.step6':
    'FTP வழியாக அறிக்கைகளை தானாக வெளியிடுவதை இயக்கி, புதுப்பிப்பு இடைவெளியை 60 நிமிடங்களாக அமைக்கவும்',
  'settings.ftp.no-credentials':
    'FTP Credentials எதுவும் இல்லை. அவற்றை உருவாக்க, மேலே உள்ள பிரிவில் உள்ள "FTP Credentials-ஐ உருவாக்கு" என்பதைக் கிளிக் செய்யவும்.',
  'settings.ftp.error.reset-failed': 'கடவுச்சொல்லை மீட்டமைக்க முடியவில்லை',

  'settings.auth.status-offline': 'ஆஃப்லைன்',
  'settings.auth.status-online': 'ஆன்லைன்',

  'settings.auth.signed-in': 'உள்நுழைந்துள்ளீர்கள்',
  'settings.auth.sign-in-up': 'உள்நுழையவும் / பதிவு செய்யவும்',
  'settings.auth.sign-out': 'வெளியேறு',

  'settings.auth.subscription-features': 'சந்தா அம்சங்கள்',

  'settings.auth.offline-mode': 'ஆஃப்லைன் பயன்முறை',

  'settings.auth.guest': 'விருந்தினர்',

  'settings.auth.your-plan': 'உங்கள் திட்டம்',

  'settings.auth.manage-subscription': 'சந்தாவை நிர்வகிக்கவும்',
  'settings.tab.general': 'பொது',
  'settings.tab.reviews': 'மதிப்பாய்வு',

  'settings.tab.customization': 'தனிப்பயனாக்கம்',
  'settings.tab.journal-setup': 'ஜர்னல் Setup',
  'settings.tab.backend': 'டிரேட் ஒத்திசைவு',
  'settings.tab.trading': 'டிரேட்கள்',
  'settings.tab.sync': 'ஒத்திசை',
  'settings.tab.accounts': 'கணக்கு',
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'வாராந்திர மதிப்பாய்வு',
  'settings.reviews.monthly': 'மாதாந்திர மதிப்பாய்வு',
  'settings.reviews.quarterly': 'காலாண்டு மதிப்பாய்வு',
  'settings.reviews.yearly': 'ஆண்டு மதிப்பாய்வு',
  'settings.reviews.default-templates': 'இயல்புநிலை தளவமைப்புகள்',

  'settings.reviews.trade-template': 'டிரேட் தளவமைப்பு',
  'settings.reviews.trade-template-desc':
    'புதிய டிரேட் குறிப்புகளுக்கு பயன்படுத்தப்படும் தளவமைப்பு',
  'settings.reviews.drc-template': 'DRC தளவமைப்பு',
  'settings.reviews.drc-template-desc':
    'புதிய தினசரி அறிக்கை அட்டைகளுக்குப் பயன்படுத்தப்படும் தளவமைப்பு',
  'settings.reviews.weekly-template': 'வாராந்திர தளவமைப்பு',
  'settings.reviews.weekly-template-desc':
    'புதிய வாராந்திர மதிப்பாய்வுகளுக்குப் பயன்படுத்தப்படும் தளவமைப்பு',
  'settings.reviews.monthly-template': 'மாதாந்திர தளவமைப்பு',
  'settings.reviews.monthly-template-desc':
    'புதிய மாதாந்திர மதிப்பாய்வுகளுக்குப் பயன்படுத்தப்படும் தளவமைப்பு',
  'settings.reviews.quarterly-template': 'காலாண்டு தளவமைப்பு',
  'settings.reviews.quarterly-template-desc':
    'புதிய காலாண்டு மதிப்பாய்வுகளுக்குப் பயன்படுத்தப்படும் தளவமைப்பு',
  'settings.reviews.yearly-template': 'ஆண்டு தளவமைப்பு',
  'settings.reviews.yearly-template-desc':
    'புதிய ஆண்டு மதிப்பாய்வுகளுக்குப் பயன்படுத்தப்படும் தளவமைப்பு',
  'settings.reviews.template-builder': 'தளவமைப்பு கட்டுபவர்',
  'settings.reviews.template-builder-desc':
    'பார்வைக்கு உங்கள் தளவமைப்புகளை உருவாக்கவும், திருத்தவும் மற்றும் நிர்வகிக்கவும். பில்டர் வியூ பிரிவுகளை இழுத்து விடவும், விருப்பங்களை உள்ளமைக்கவும் மற்றும் நிகழ்நேரத்தில் உங்கள் தளவமைப்புகளை முன்னோட்டமிடவும் அனுமதிக்கிறது.',
  'settings.reviews.open-builder': 'தளவமைப்பு உருவாக்கியைத் திறக்கவும்',
  'settings.general.review-links-new-tab':
    'மதிப்பாய்வு விட்ஜெட் இணைப்புகளை புதிய தாவல்களில் திறக்கவும்',
  'settings.general.review-links-new-tab-desc':
    'முடக்கப்பட்டால், இணைப்புகள் தற்போதைய தாவலை மாற்றும்.',
  'settings.general.review-links-new-tab-aria':
    'மதிப்பாய்வு விட்ஜெட் குறிப்பு இணைப்புகளை புதிய தாவல்களில் திறக்கவும்',
  'settings.general.tab-behavior': 'தாவல் நடத்தை',
  'settings.reviews.recurring-goals': 'தொடர்ச்சியான இலக்குகள்',
  'settings.reviews.recurring-goals-desc':
    'ஒவ்வொரு புதிய மதிப்பாய்விலும் தானாகவே தோன்றும் இலக்குகளை வரையறுக்கவும். மதிப்பாய்வு உருவாக்கப்படும்போது இவை நகலெடுக்கப்படும், மேலும் ஒவ்வொரு மதிப்பாய்வையும் திருத்தலாம்.',
  'settings.reviews.daily-goals': 'தினசரி இலக்குகள்',
  'settings.reviews.daily-goal-placeholder':
    'தொடர்ச்சியான தினசரி இலக்கைச் சேர்க்கவும்...',
  'settings.reviews.weekly-goals': 'வாராந்திர இலக்குகள்',
  'settings.reviews.weekly-goal-placeholder':
    'தொடர்ச்சியான வாராந்திர இலக்கைச் சேர்க்கவும்...',
  'settings.reviews.pre-trade-checklist':
    'DRC டிரேட்டுக்கு முந்தைய சரிபார்ப்பு பட்டியல்',
  'settings.reviews.pre-trade-checklist-desc':
    'ஒவ்வொரு புதிய தினசரி அறிக்கை அட்டையிலும் தானாகவே தோன்றும் சரிபார்ப்புப் பட்டியல் உருப்படிகளை வரையறுக்கவும். இவை உருவாக்கப்படும் போது ஒவ்வொரு DRC க்கும் நகலெடுக்கப்படும், மேலும் ஒரு நாளைக்கு திருத்தலாம்.',
  'settings.reviews.checklist-placeholder':
    'சரிபார்ப்புப் பட்டியல் உருப்படியைச் சேர்க்கவும்...',
  'settings.reviews.weekly-checklist':
    'வாராந்திர தயாரிப்பு சரிபார்ப்பு பட்டியல்',
  'settings.reviews.weekly-checklist-desc':
    'ஒவ்வொரு புதிய வாராந்திர மதிப்பாய்விலும் தானாகவே தோன்றும் சரிபார்ப்புப் பட்டியல் உருப்படிகளை வரையறுக்கவும். இவை உருவாக்கப்படும் போது ஒவ்வொரு வாராந்திர மதிப்பாய்விற்கும் நகலெடுக்கப்படும், மேலும் வாரத்திற்கு ஒருமுறை திருத்தலாம்.',
  'settings.reviews.weekly-checklist-placeholder':
    'வாராந்திர சரிபார்ப்புப் பட்டியல் உருப்படியைச் சேர்க்கவும்...',
  'settings.reviews.auto-create': 'மதிப்பாய்வுகளை தானாக உருவாக்கு',
  'settings.reviews.global-auto-create':
    'அனைத்து மதிப்பாய்வுகளையும் தானாக உருவாக்கு',
  'settings.reviews.global-auto-create-desc':
    'தொடர்புடைய காலகட்டத்தின் முதல் டிரேட் பதிவுசெய்யப்படும்போது தானாகவே மதிப்பாய்வுகளை உருவாக்கவும். தினசரி, வாராந்திர, மாதாந்திர, காலாண்டு மற்றும் வருடாந்திர மதிப்பாய்வுகளுக்கு இந்த அமைப்பு பொருந்தும்.',
  'settings.reviews.global-auto-create-aria':
    'அனைத்து மதிப்பாய்வுகளையும் தானாக உருவாக்கு',
  'settings.reviews.auto-create-drc-nav':
    'வழிசெலுத்தலில் DRC தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-drc-nav-desc':
    'தினசரி அறிக்கை அட்டை இல்லாத நாளுக்குச் செல்லும்போது தானாகவே புதிய தினசரி அறிக்கை அட்டையை உருவாக்கவும்',
  'settings.reviews.auto-create-drc-nav-aria':
    'வழிசெலுத்தலில் DRC தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-weekly-nav':
    'வழிசெலுத்தலில் வாராந்திர மதிப்பாய்வை தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-weekly-nav-desc':
    'ஒரு வாரத்தில் இல்லாத வாரத்திற்குச் செல்லும் போது தானாகவே புதிய வாராந்திர மதிப்பாய்வை உருவாக்கவும்',
  'settings.reviews.auto-create-weekly-nav-aria':
    'வழிசெலுத்தலில் வாராந்திர மதிப்பாய்வை தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-monthly-nav':
    'வழிசெலுத்தலில் மாதாந்திர மதிப்பாய்வை தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-monthly-nav-desc':
    'மாதாந்திர மதிப்பாய்வை இல்லாத ஒரு மாதத்திற்குச் செல்லும் போது தானாகவே புதிய மாதாந்திர மதிப்பாய்வை உருவாக்கவும்',
  'settings.reviews.auto-create-monthly-nav-aria':
    'வழிசெலுத்தலில் மாதாந்திர மதிப்பாய்வை தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-quarterly-nav':
    'வழிசெலுத்தலில் காலாண்டு மதிப்பாய்வை தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-quarterly-nav-desc':
    'ஒரு காலாண்டு மதிப்பாய்வைக் கொண்டிருக்காத காலாண்டிற்குச் செல்லும்போது தானாகவே புதிய காலாண்டு மதிப்பாய்வை உருவாக்கவும்',
  'settings.reviews.auto-create-quarterly-nav-aria':
    'வழிசெலுத்தலில் காலாண்டு மதிப்பாய்வை தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-yearly-nav':
    'வழிசெலுத்தலில் வருடாந்திர மதிப்பாய்வை தானாக உருவாக்கவும்',
  'settings.reviews.auto-create-yearly-nav-desc':
    'இல்லாத ஒரு வருடத்திற்குச் செல்லும் போது தானாகவே புதிய வருடாந்திர மதிப்பாய்வை உருவாக்கவும்',
  'settings.reviews.auto-create-yearly-nav-aria':
    'வழிசெலுத்தலில் வருடாந்திர மதிப்பாய்வை தானாக உருவாக்கவும்',

  'settings.reviews.notice.builder-not-found':
    'தளவமைப்பு உருவாக்கி கட்டளை கிடைக்கவில்லை',
  'settings.reviews.notice.global-auto-create':
    'அனைத்து மதிப்பாய்வுகளுக்கும் தானாக உருவாக்கு {status}',
  'settings.reviews.notice.auto-create-nav':
    'வழிசெலுத்தலில் தானாக உருவாக்கு {type} {status}',
  'settings.reviews.daily.checklist-title':
    'முன் டிரேட் சரிபார்ப்பு பட்டியல் உருப்படிகள்',

  'settings.reviews.daily.questions-title': 'மதிப்பாய்வுக் கேள்விகள்',

  'library.type.drc': 'DRC',
  'library.type.weekly': 'வாராந்திர',
  'library.type.monthly': 'மாதாந்திர',
  'library.type.quarterly': 'காலாண்டு',
  'library.type.yearly': 'வருடாந்திர',
  'library.type.trade': 'டிரேட்',
  'library.error.invalid-share-code': 'தவறான பகிர்வு குறியீடு',
  'library.notice.import-success':
    '"{name}" தளவமைப்பு வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது!',
  'library.error.import-failed': 'தளவமைப்பை இறக்குமதி செய்ய முடியவில்லை',
  'library.notice.select-template':
    'ஏற்றுமதி செய்ய தளவமைப்பைத் தேர்ந்தெடுக்கவும்',
  'library.notice.template-not-found': 'தளவமைப்பு கிடைக்கவில்லை',
  'library.notice.code-generated': 'பகிர்வு குறியீடு உருவாக்கப்பட்டது!',
  'library.error.export-failed': 'தளவமைப்பை ஏற்றுமதி செய்ய முடியவில்லை',
  'library.error.export-too-large':
    'இந்த தளவமைப்பு பகிர்வு குறியீடாக ஏற்றுமதி செய்ய முடியாத அளவுக்கு பெரியது.',
  'library.notice.copied': 'பகிர் குறியீடு கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது!',
  'library.error.copy-failed': 'கிளிப்போர்டுக்கு நகலெடுக்க முடியவில்லை',
  'library.title.import': 'இறக்குமதி தளவமைப்பு',
  'library.desc.import':
    'மற்றொரு பயனரிடமிருந்து தளவமைப்பை இறக்குமதி செய்ய JRT பகிர்வுக் குறியீட்டை ஒட்டவும்.',
  'library.label.share-code': 'பகிர் குறியீடு',
  'library.placeholder.import-code':
    'JRT-... பகிர்வுக் குறியீட்டை இங்கே ஒட்டவும்',
  'library.button.validating': 'சரிபார்க்கிறது...',
  'library.button.validate': 'சரிபார்க்கவும்',
  'library.button.import': 'இறக்குமதி தளவமைப்பு',
  'library.preview.valid': 'சரியான தளவமைப்பு',
  'library.preview.invalid': 'தவறான பகிர்வு குறியீடு',
  'library.title.export': 'ஏற்றுமதி தளவமைப்பு',
  'library.desc.export':
    'மற்றவர்கள் இறக்குமதி செய்யக்கூடிய பகிர்வுக் குறியீட்டை உருவாக்க தளவமைப்பைத் தேர்ந்தெடுக்கவும்.',
  'library.empty.title': 'ஏற்றுமதி செய்ய தனிப்பயன் தளவமைப்புகள் இல்லை.',
  'library.empty.hint':
    'முதலில் மதிப்பாய்வு அல்லது டிரேட் தளவமைப்புகள் தாவலில் தனிப்பயன் தளவமைப்பை உருவாக்கவும், பின்னர் பகிர இங்கு திரும்பவும்.',
  'library.label.select-template': 'தளவமைப்பைத் தேர்ந்தெடுக்கவும்',
  'library.option.select-template': '-- தளவமைப்பைத் தேர்ந்தெடுக்கவும் --',
  'library.button.generate-code': 'பகிர்வுக் குறியீட்டை உருவாக்கவும்',
  'library.button.copy-code': 'கிளிப்போர்டுக்கு நகலெடுக்கவும்',

  'settings.reviews.daily.timeframes-title': 'முன்னறிவிப்பு காலக்கெடு',

  'settings.reviews.daily.timeframes-placeholder':
    'புதிய காலக்கெடு (எ.கா., 15M, 5M)',
  'settings.weekly.review-questions': 'கேள்விகளை மதிப்பாய்வு செய்யவும்',

  'settings.weekly.forecast-timeframes': 'முன்னறிவிப்பு காலக்கெடு',

  'settings.shared.timeframes.title': 'முன்னறிவிப்பு காலக்கெடு',

  'settings.shared.timeframes.placeholder': 'புதிய காலக்கெடு (எ.கா., 15M, 5M)',

  'shared.empty-state.message': 'தரவு எதுவும் கிடைக்கவில்லை',

  'weekly.tab.review': 'மதிப்பாய்வு',
  'weekly.review.drcs.title': 'இந்த வாரத்திற்கான தினசரி மதிப்பாய்வுகள்',

  'account.settings.modal.title': 'கணக்கு டாஷ்போர்டு அமைப்புகள்',
  'account.settings.notice.name-empty':
    'கணக்கு வகையின் பெயர் காலியாக இருக்கக்கூடாது',
  'account.settings.notice.type-exists': 'கணக்கு வகை "{name}" ஏற்கனவே உள்ளது',
  'account.settings.notice.reserved-name':
    '"{name}" என்பது முன்பதிவு செய்யப்பட்ட கணக்கு வகைப் பெயர்',
  'account.settings.notice.type-added':
    'கணக்கு வகை "{name}" வெற்றிகரமாக சேர்க்கப்பட்டது',
  'account.settings.notice.add-error':
    'கணக்கு வகையைச் சேர்ப்பதில் பிழை: {error}',
  'account.settings.notice.cannot-delete-archived':
    '"காப்பகப்படுத்தப்பட்ட" கணக்கு வகையை நீக்க முடியாது - இது கணக்குகளை காப்பகப்படுத்துவதற்கு ஒதுக்கப்பட்டுள்ளது',
  'account.settings.notice.analyze-error':
    'கணக்கு வகை பயன்பாட்டை பகுப்பாய்வு செய்வதில் பிழை',
  'account.settings.notice.cannot-delete-has-accounts':
    '"{name}" ஐ நீக்க முடியாது - அதில் {count} தொடர்புடைய கணக்குகள் உள்ளன. இடம்பெயர்தல் அம்சம் விரைவில்.',
  'account.settings.notice.saved':
    'கணக்கு டாஷ்போர்டு அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன',
  'account.settings.notice.save-error':
    'அமைப்புகளைச் சேமிப்பதில் பிழை: {error}',
  'account.settings.notice.migration-target-required':
    'மறுஒதுக்கீட்டிற்கான இலக்கு கணக்கு வகையைத் தேர்ந்தெடுக்கவும்',
  'account.settings.notice.migration-failed': 'இடம்பெயர்வு தோல்வி: {error}',
  'account.settings.notice.type-deleted':
    'கணக்கு வகை "{name}" வெற்றிகரமாக நீக்கப்பட்டது',
  'account.settings.notice.type-deleted-with-cleanup':
    'கணக்கு வகை "{name}" வெற்றிகரமாக நீக்கப்பட்டது (சுத்தம் செய்யப்பட்டது: {actions})',
  'account.settings.notice.migration-error': 'இடம்பெயர்வின் போது பிழை: {error}',
  'account.settings.notice.delete-error':
    'கணக்கு வகையை நீக்குவதில் பிழை: {error}',
  'account.settings.notice.operation-failed': '{operation} தோல்வி: {error}',
  'account.settings.notice.migration-no-targets':
    'கணக்குகளை மாற்ற முடியாது - வேறு கணக்கு வகைகள் இல்லை. முதலில் புதிய கணக்கு வகையை உருவாக்கவும்.',
  'account.settings.notice.type-deleted-migrated':
    'கணக்கு வகை "{name}" வெற்றிகரமாக நீக்கப்பட்டது. {count} கணக்குகள் {action}',
  'account.settings.operation.type-deletion': 'கணக்கு வகை நீக்கம்',
  'account.settings.migration.error.target-required':
    'மறுஒதுக்கீட்டிற்கு இலக்கு வகை தேவை',
  'account.settings.migration.error.invalid-option':
    'தவறான இடம்பெயர்வு விருப்பம்',
  'account.settings.unnamed-account': 'பெயரிடப்படாத கணக்கு',
  'account.settings.migration.title': 'நீக்குவதற்கு முன் கணக்குகளை நகர்த்தவும்',
  'account.settings.migration.warning':
    '{count} தொடர்புடைய கணக்குகளைக் கொண்ட "{name}"ஐ நீக்க உள்ளீர்கள்.',
  'account.settings.migration.instruction':
    'கணக்கு வகையை நீக்குவதற்கு முன் இந்தக் கணக்குகள் கையாளப்பட வேண்டும்:',
  'account.settings.migration.more-accounts': '... மற்றும் {count} மேலும்',
  'account.settings.migration.choose-option':
    'இந்தக் கணக்குகளை எவ்வாறு கையாள்வது என்பதைத் தேர்வுசெய்யவும்:',
  'account.settings.migration.option.reassign.title':
    'வேறு வகைக்கு மீண்டும் ஒதுக்கவும்',
  'account.settings.migration.option.reassign.desc':
    'அனைத்து கணக்குகளையும் மற்றொரு கணக்கு வகைக்கு நகர்த்தவும்',
  'account.settings.migration.target-type.label': 'இலக்கு கணக்கு வகை:',
  'account.settings.migration.option.archive.title':
    'கணக்குகளை காப்பகப்படுத்தவும்',
  'account.settings.migration.option.archive.desc':
    'அனைத்து கணக்குகளையும் "காப்பகப்படுத்தப்பட்ட" நிலைக்கு நகர்த்தவும்',
  'account.settings.migration.option.delete.title': 'நீக்குவதற்கான குறி',
  'account.settings.migration.option.delete.desc':
    'அனைத்து கணக்குகளையும் நீக்கியதாகக் குறிக்கவும்',
  'account.settings.migration.button.migrate': 'இடம்பெயர்தல் & நீக்குதல் வகை',
  'account.settings.migration.button.migrating': 'இடம்பெயர்கிறது...',
  'account.settings.migration.action.reassigned':
    '"{target}"க்கு மீண்டும் ஒதுக்கப்பட்டது',
  'account.settings.migration.action.archived':
    'காப்பக நிலைக்கு நகர்த்தப்பட்டது',
  'account.settings.migration.action.deleted': 'நீக்குவதற்கு குறிக்கப்பட்டது',
  'account.settings.delete.title': 'கணக்கு வகையை நீக்கு',
  'account.settings.delete.confirm-question':
    '"{name}" கணக்கு வகையை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'account.settings.delete.impact-analysis': 'தாக்க பகுப்பாய்வு:',
  'account.settings.delete.affected-accounts':
    '⚠️ {count} கணக்கு(கள்) பாதிக்கப்பட்டது:',
  'account.settings.delete.migration-notice':
    'குறிப்பு: நீக்குதலைத் தொடரும் முன் இந்தக் கணக்குகள் வேறொரு கணக்கு வகைக்கு மறுஒதுக்கீடு செய்யப்பட வேண்டும்.',
  'account.settings.delete.no-affected':
    '✅ இந்தக் கணக்கு வகையை எந்தக் கணக்குகளும் பயன்படுத்தவில்லை',
  'account.settings.delete.cleanup-title': 'சுத்தம் செய்யப்படும் அமைப்புகள்:',
  'account.settings.delete.cleanup.excluded':
    '✓ விலக்கப்பட்ட கணக்கு வகைகளிலிருந்து அகற்றப்பட்டது',
  'account.settings.delete.cleanup.order':
    '✓ காட்சி வரிசையில் இருந்து அகற்றப்பட்டது',
  'account.settings.delete.cleanup.withdrawals':
    '✓ திரும்பப் பெறும் அமைப்புகளிலிருந்து அகற்றப்பட்டது',
  'account.settings.delete.cleanup.none': 'அமைப்புகளை சுத்தம் செய்ய தேவையில்லை',
  'account.settings.delete.button.setup-migration': 'இடம்பெயர்வை அமைக்கவும்',
  'account.settings.delete.button.delete': 'கணக்கு வகையை நீக்கு',
  'account.settings.delete.button.deleting': 'நீக்குகிறது...',
  'account.settings.section.available-types.title': 'கிடைக்கும் கணக்கு வகைகள்',
  'account.settings.section.available-types.desc':
    'உங்கள் கணினியில் தற்போதைய கணக்கு வகைகள்.',
  'account.settings.section.available-types.placeholder':
    'கணக்கு வகை பெயரை உள்ளிடவும்...',
  'account.settings.section.available-types.add-aria':
    'புதிய கணக்கு வகையைச் சேர்க்கவும்',
  'account.settings.section.available-types.delete-aria': '{name} ஐ நீக்கு',
  'account.settings.section.available-types.empty':
    'தனிப்பயன் கணக்கு வகைகள் வரையறுக்கப்படவில்லை.',
  'account.settings.section.inclusion.title': 'டாஷ்போர்டு கணக்கு வகைகள்',
  'account.settings.section.inclusion.desc':
    'டாஷ்போர்டு புள்ளிவிவரங்களில் எந்தெந்த கணக்கு வகைகள் தோன்றும், திரும்பப் பெறுதல்களின் எண்ணிக்கை மற்றும் அவற்றின் காட்சி வரிசை ஆகியவற்றைத் தேர்வுசெய்யவும்.',
  'account.settings.section.inclusion.include-dashboard':
    'டாஷ்போர்டு புள்ளிவிவரங்களில்',
  'account.settings.section.inclusion.include-withdrawals': 'வித்ட்ராக்கள்',
  'account.settings.section.inclusion.empty':
    'உள்ளமைக்க கணக்கு வகைகள் எதுவும் இல்லை.',
  'account.settings.section.order.title': 'காட்சி வரிசை',

  'account.settings.section.order.move-up': 'மேலே செல்லவும்',
  'account.settings.section.order.move-down': 'கீழே நகர்த்தவும்',
  'account.settings.button.save': 'அமைப்புகளைச் சேமிக்கவும்',
  'account.settings.button.saving': 'சேமிக்கிறது...',

  'weekly.review.performance.title': 'செயல்திறன் சுய மதிப்பீடு',
  'weekly.review.performance.mental': 'மன செயல்திறன்',

  'weekly.review.performance.technical': 'தொழில்நுட்ப செயல்படுத்தல்',

  'weekly.review.questions.title': 'வாராந்திர மதிப்பாய்வுக் கேள்விகள்',

  'weekly.review.goals.title': 'அடுத்த வாரத்திற்கான இலக்குகள்',

  'weekly.preparation.goals.title': 'வாராந்திர இலக்குகள்',

  'weekly.preparation.events.title': 'முக்கிய நிகழ்வுகள்',

  'weekly.preparation.events.add-button': 'நிகழ்வைச் சேர்க்கவும்',

  'weekly.preparation.forecast.title': 'வாராந்திர முன்னறிவிப்பு',
  'weekly.overview.pnl-chart.title': 'வாராந்திர ஒட்டுமொத்த P&L',

  'weekly.overview.drawdown-chart.title': 'வாராந்திர Drawdown',

  'weekly.overview.performance.title': 'வாராந்திர செயல்திறன்',

  'weekly.overview.setup-performance.title': 'Setup செயல்திறன்',

  'weekly.overview.trades-chart.title': 'வாராந்திர டிரேட்',

  'weekly.overview.best-trade.title': 'வாரத்தின் சிறந்த டிரேட்',

  'weekly.overview.worst-trade.title': 'வாரத்தின் மோசமான டிரேட்',

  'weekly.overview.daily-performance.title': 'தினசரி செயல்திறன்',

  'weekly.overview.button.create-trade': 'டிரேடை உருவாக்குங்கள்',
  'weekly.overview.button.view-trade-details': 'டிரேட் விவரங்களைக் காண்க',

  'monthly.tab.review': 'மதிப்பாய்வு',

  'backend.title': 'Trade Sync',
  'backend.description':
    'ஆதரிக்கப்படும் தரகர்களுக்கான Trade Syncஐ அமைத்து, உங்கள் vaultஐ தானாகப் புதுப்பித்த நிலையில் வைத்திருங்கள்.',

  'trade-sync.gate.pro.description':
    'Trade Sync என்பது ஒரு ப்ரோ அம்சமாகும். தொடர மேம்படுத்தவும்.',

  'trade-sync.gate.feature-unavailable.title': 'அம்சம் கிடைக்கவில்லை',
  'trade-sync.gate.feature-unavailable.description':
    'உங்கள் Pro கணக்கில் இந்த ஒத்திசைவு அம்சம் இயக்கப்படவில்லை. உங்கள் நிலையைப் புதுப்பிக்கவும் அல்லது இது தொடர்ந்தால் ஆதரவைத் தொடர்பு கொள்ளவும்.',
  'trade-sync.trial.title': 'உங்கள் டிரேட் ஜர்னலை தானியங்குபடுத்துங்கள்',
  'trade-sync.trial.description':
    'Journalit Pro மூலம் வாரத்தில் 7 மணிநேரம் வரை சேமிக்கவும்.',
  'trade-sync.trial.benefit.sync': 'தானியங்கி டிரேட் ஒத்திசைவு',
  'trade-sync.trial.benefit.import': 'எங்கிருந்தும் இறக்குமதி டிரேட்',
  'trade-sync.trial.cta': 'உங்கள் 14 நாள் இலவச சோதனையைத் தொடங்கவும்',
  'trade-sync.trial.existing-subscriber': 'ஏற்கனவே குழுசேர்ந்துள்ளதா? உள்நுழைக',
  'trade-sync.trial.eligibility':
    'புதிய சந்தாதாரர்களுக்கு மட்டுமே இலவச சோதனை கிடைக்கும்.',

  'premium.gate.cta.continue-pro': 'PRO க்கு தொடரவும்',

  'premium.gate.cta.refresh': 'நிலையைப் புதுப்பிக்கவும்',

  'premium.gate.offline':
    'நீங்கள் ஆஃப்லைனில் இருப்பது போல் தெரிகிறது. செயல்படுத்த இணையம் தேவை.',
  'premium.gate.not-pro-yet':
    'நீங்கள் உள்நுழைந்துள்ளீர்கள், ஆனால் உங்கள் கணக்கு இன்னும் PRO ஆகவில்லை. மேம்படுத்தி பின்னர் புதுப்பிக்கவும்.',

  'backend.status.connected': 'இணைக்கப்பட்டது',
  'backend.status.disconnected': 'துண்டிக்கப்பட்டது',
  'backend.status.checking': 'சரிபார்க்கிறது...',
  'backend.register.title': 'பதிவு வால்ட்',
  'backend.register.description':
    'இந்த vaultஐ ஒத்திசைக்க பின்தள சேவையகத்துடன் பதிவு செய்யவும்',
  'backend.register.button': 'பதிவு வால்ட்',
  'backend.register.registering': 'பதிவு செய்கிறது...',
  'backend.ftp.title': 'FTP Credentials',
  'backend.ftp.description':
    'MetaTrader அறிக்கைகளைப் பதிவேற்ற FTP Credentials-ஐ உருவாக்கவும். தனிப்பட்ட பயனர்பெயர் தானாகவே உருவாக்கப்படும்.',
  'backend.ftp.create-button': 'FTP Credentials-ஐ உருவாக்கவும்',
  'backend.ftp.creating': 'உருவாக்குகிறது...',

  'backend.sync.auto-sync': 'தானியங்கு ஒத்திசைவை இயக்கு',
  'backend.sync.auto-sync-desc':
    'பின்தளத்தில் சேவையகத்திலிருந்து டிரேடை தானாக ஒத்திசைக்கவும்',
  'backend.sync.auto-sync-info':
    'ஒவ்வொரு மணி நேரமும் புதிய டிரேட்களுக்கான தானியங்கி ஒத்திசைவு சோதனைகள்',
  'backend.sync.auto-sync-aria': 'தானாக ஒத்திசைவை இயக்கு',

  'backend.sync.syncing': 'ஒத்திசைக்கிறது...',

  'backend.sync.last-result': 'கடைசி ஒத்திசைவு முடிவு',
  'backend.sync.synced-trades':
    'ஒத்திசைக்கப்பட்ட {trades} டிரேட்கள் ({files} புதிய கோப்புகள்)',
  'backend.sync.no-new-trades': 'ஒத்திசைக்க புதிய டிரேட்கள் எதுவும் இல்லை',
  'backend.sync.status': 'ஒத்திசைவு நிலை',
  'backend.sync.last-sync': 'கடைசி ஒத்திசைவு',
  'backend.sync.total-syncs': 'மொத்த ஒத்திசைவுகள்',
  'backend.sync.never': 'ஒருபோதும் இல்லை',
  'backend.sync.invalid-date': 'தவறான தேதி',
  'backend.notice.vault-registered':
    '✅ வால்ட் டிரேட் சேவையகத்தில் பதிவு செய்யப்பட்டுள்ளது',
  'backend.notice.sync-cancelled': '⏹️ ஒத்திசைவு ரத்துசெய்யப்பட்டது',
  'backend.notice.sync-in-progress': '⚠️ ஒத்திசைவு ஏற்கனவே செயலில் உள்ளது',
  'backend.notice.account-info-failed': '❌ கணக்குத் தகவலைப் பெறுவதில் தோல்வி',
  'backend.notice.sync-batch-progress':
    '⏳ ஒத்திசைவு தொகுதி: {count} டிரேட் ({progress}% முடிந்தது, {remaining} மீதமுள்ளது)',
  'backend.notice.all-trades-synced':
    '✅ அனைத்து {count} டிரேட்களும் ஏற்கனவே ஒத்திசைக்கப்பட்டுள்ளன',
  'backend.notice.account-created': '📊 உருவாக்கப்பட்ட கணக்கு: {name}',
  'backend.notice.batch-complete':
    '⏳ தொகுதி முடிந்தது: {processed}/{total} டிரேட் ({progress}%). தொடர்கிறது...',
  'backend.notice.sync-complete':
    '✅ ஒத்திசைவு முடிந்தது: {total} டிரேட் செயலாக்கப்பட்டது ({newFiles} புதியது, {updated} புதுப்பிக்கப்பட்டது) {accounts} கணக்கு(கள்) முழுவதும்',
  'backend.notice.sync-complete-no-trades':
    '✅ ஒத்திசைவு முடிந்தது - புதிய டிரேட்கள் எதுவும் இல்லை',
  'backend.notice.sync-failed': '❌ ஒத்திசைவு தோல்வி: {error}',

  'backend.accounts.linked': 'இணைக்கப்பட்ட MT கணக்குகள்',
  'backend.accounts.linked-desc':
    'ஒத்திசைக்கப்பட்ட அறிக்கைகளிலிருந்து MetaTrader கணக்குகள் கண்டறியப்பட்டன',
  'backend.accounts.server-disconnected':
    'சர்வர் துண்டிக்கப்பட்டது. இணைப்பு நிலையை சரிபார்க்கவும்.',
  'backend.accounts.loading': 'கணக்குகளை ஏற்றுகிறது...',
  'backend.accounts.no-accounts': 'கணக்குகள் எதுவும் இல்லை.',
  'backend.accounts.sync-to-detect':
    'கணக்குகளைக் கண்டறிய சில டிரேட்களை ஒத்திசைக்கவும்.',
  'backend.accounts.connect-to-see':
    'கணக்குகளைப் பார்க்க, சேவையகத்துடன் இணைக்கவும் மற்றும் டிரேட்களை ஒத்திசைக்கவும்.',
  'backend.accounts.account-id': 'கணக்கு ஐடி',
  'backend.accounts.broker': 'Broker',
  'backend.accounts.first-seen': 'முதலில் பார்த்தது',
  'backend.accounts.last-seen': 'கடைசியாக பார்த்தது',
  'backend.accounts.refresh': 'கணக்குகளைப் புதுப்பிக்கவும்',
  'backend.accounts.unlink-title': 'MetaTrader கணக்கின் இணைப்பை நீக்கவும்',
  'backend.accounts.unlink': 'இணைப்பை நீக்கவும்',
  'backend.accounts.unlink-confirm':
    'MetaTrader கணக்கை {accountId} இணைப்பை நீக்கவா? இது Trade Sync இலிருந்து மறைக்கப்படும் மற்றும் நீங்கள் அதை மீண்டும் இணைக்கும் வரை எதிர்கால இறக்குமதிகள் தவிர்க்கப்படும்.',
  'backend.accounts.unlink-success': 'MetaTrader கணக்கு துண்டிக்கப்பட்டது',
  'backend.accounts.relink': 'மீண்டும் இணைக்கவும்',
  'backend.accounts.relink-success':
    'MetaTrader கணக்கு மீண்டும் இணைக்கப்பட்டது',
  'backend.accounts.ignored.title': 'இணைக்கப்படாத கணக்குகள்',
  'backend.accounts.ignored.count': '{count} மறைக்கப்பட்டுள்ளது',
  'backend.accounts.ignored.empty': 'இணைக்கப்படாத கணக்குகள் இல்லை.',
  'backend.accounts.ignored-at': 'இணைக்கப்படவில்லை',

  'backend.cards.connection.title': 'இணைப்பு',
  'backend.cards.connection.refresh': 'புதுப்பி',
  'backend.cards.sync.title': 'ஒத்திசைவு நிலை',
  'backend.cards.sync.last-sync': 'கடைசி ஒத்திசைவு',
  'backend.cards.sync.total': 'மொத்த ஒத்திசைவுகள்',
  'backend.cards.sync.button': 'இப்போது ஒத்திசைக்கவும்',
  'backend.cards.sync.cancel': 'ஒத்திசைவை ரத்துசெய்',
  'backend.cards.accounts.title': 'கணக்குகள்',
  'backend.cards.accounts.linked': 'இணைக்கப்பட்ட கணக்குகள்',
  'backend.cards.accounts.manage': 'நிர்வகிக்கவும்',
  'backend.section.setup.title': 'Setup & கட்டமைப்பு',
  'backend.section.sync.title': 'ஒத்திசைவு அமைப்புகள்',
  'backend.section.accounts.title': 'கணக்கு மேலாண்மை',
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI CSV மேப்பிங்',
  'settings.auth.feature.trade-sync': 'டிரேட் ஒத்திசைவு',
  'settings.auth.feature.economic-calendar': 'பொருளாதார நாட்காட்டி',
  'settings.auth.feature.basic-tracking': 'அடிப்படை டிரேட் கண்காணிப்பு',

  'settings.auth.feature.manual-entry': 'கைமுறை டிரேட் நுழைவு',
  'settings.auth.feature.analytics-reviews':
    'பகுப்பாய்வு மற்றும் மதிப்பாய்வுகள்',
  'settings.auth.feature.priority-support': 'முன்னுரிமை ஆதரவு',
  'backend.sync.just-now': 'இப்போதுதான்',
  'backend.sync.minutes-ago': '{count} நிமிடத்திற்கு முன்பு',
  'backend.sync.hours-ago': '{count} மணிநேரத்திற்கு முன்பு',
  'backend.sync.days-ago': '{count} நாட்களுக்கு முன்பு',

  'csv.format': 'இறக்குமதி வடிவம்:',

  'csv.button.export-template': 'ஏற்றுமதி வார்ப்புரு',
  'csv.button.delete-template': 'வார்ப்புருவை நீக்கு',

  'csv.button.import-another': 'மற்றொரு கோப்பை இறக்குமதி செய்யவும்',
  'csv.results.complete': 'இறக்குமதி முடிந்தது',
  'csv.results.history-ready': 'உங்கள் டிரேட் வரலாறு தயாராக உள்ளது',
  'csv.results.completed-with-issues': 'இறக்குமதி சிக்கல்களுடன் முடிந்தது',
  'csv.results.failed': 'இறக்குமதி தோல்வி',
  'csv.results.success.one':
    'கணக்கிற்கு {count} டிரேட் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது: {account}',
  'csv.results.success.few':
    'கணக்கிற்கு {count} டிரேட் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது: {account}',
  'csv.results.success.many':
    'கணக்கிற்கு {count} டிரேட் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது: {account}',
  'csv.results.success.other':
    'கணக்கிற்கு {count} டிரேட் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது: {account}',
  'csv.results.updated.one': 'தற்போதுள்ள டிரேட் {count} புதுப்பிக்கப்பட்டது',
  'csv.results.updated.few': '{count} ஏற்கனவே உள்ள டிரேட் புதுப்பிக்கப்பட்டது',
  'csv.results.updated.many': '{count} ஏற்கனவே உள்ள டிரேட் புதுப்பிக்கப்பட்டது',
  'csv.results.updated.other':
    '{count} ஏற்கனவே உள்ள டிரேட் புதுப்பிக்கப்பட்டது',
  'csv.results.skipped.one':
    'தவிர்க்கப்பட்டது {count} நகல் டிரேட் (ஏற்கனவே vault இல்)',
  'csv.results.skipped.few':
    'தவிர்க்கப்பட்டது {count} நகல் டிரேட் (ஏற்கனவே vault இல்)',
  'csv.results.skipped.many':
    'தவிர்க்கப்பட்டது {count} நகல் டிரேட் (ஏற்கனவே vault இல்)',
  'csv.results.skipped.other':
    'தவிர்க்கப்பட்டது {count} நகல் டிரேட் (ஏற்கனவே vault இல்)',

  'csv.results.broker': 'தரகர்: {broker}',

  'csv.results.more-trades.one': 'மேலும் {count} டிரேட்...',
  'csv.results.more-trades.few': 'மேலும் {count} டிரேட்கள்...',
  'csv.results.more-trades.many': 'மேலும் {count} டிரேட்கள்...',
  'csv.results.more-trades.other': 'மேலும் {count} டிரேட்கள்...',
  'csv.results.errors-header': 'பிழைகளைக் காண கிளிக் செய்யவும் ({count})',
  'csv.results.discord-note':
    'விருப்பத்தேர்வு: உங்களுக்கு உதவி தேவைப்பட்டால், அறிக்கையை நகலெடு என்பதைக் கிளிக் செய்து Discord இல் ஒட்டவும்.',

  'csv.errors.copy-report': 'அறிக்கையை நகலெடுக்கவும்',

  'csv.errors.copied': 'நகலெடுக்கப்பட்டது',
  'csv.errors.rows': 'வரிசைகள்: {rows}',
  'csv.errors.suggestion': 'பரிந்துரை:',

  'csv.errors.raw-errors-limit':
    '{total} பிழைகளில் முதல் {shown}ஐக் காட்டுகிறது',

  'csv.report.plugin-version': 'செருகுநிரல் பதிப்பு: {version}',

  'csv.report.broker': 'தரகர்: {broker}',

  'csv.report.top-issues': 'முக்கிய சிக்கல்கள்:',

  'csv.broker-guide.tradovate.step-2':
    '"ஆர்டர்கள்" தாவலைக் கிளிக் செய்யவும் (செயல்திறன் தாவல் அல்ல)',

  'csv.broker-guide.tradovate.warning.emphasis': 'முக்கியமானது:',
  'csv.broker-guide.tradovate.warning.message':
    'ஆர்டர்கள் தாவலை மட்டும் பயன்படுத்தவும். செயல்திறன் தாவல் இணக்கமாக இல்லை.',

  'csv.broker-guide.ibkr.warning.emphasis': 'ஆர்டர்களைப் பயன்படுத்த வேண்டும்',

  'csv.broker-guide.tradingview.step-3':
    'கீழ்தோன்றலில் இருந்து "ஆர்டர் வரலாறு" என்பதைத் தேர்ந்தெடுக்கவும்',

  'csv.broker-guide.tradingview.warning.message':
    'பிற ஏற்றுமதி வகைகள் (நிலைகள் அல்லது ஆர்டர்கள் போன்றவை) இறக்குமதிக்கு வேலை செய்யாது.',

  'csv.broker-guide.hyperliquid.warning.emphasis': '10,000 நுழைவு வரம்பு.',

  'csv.broker-guide.sierrachart.step-1':
    'டிரேட் நடவடிக்கைப் பதிவைத் திற (டிரேட் → டிரேட் நடவடிக்கைப் பதிவு, அல்லது Ctrl+Shift+A)',

  'csv.broker-guide.atas.warning.emphasis': 'முக்கியமானது:',
  'csv.broker-guide.atas.warning.message':
    'ஏற்றுமதி செய்யப்பட்ட கோப்பைத் திருத்த வேண்டாம். Journalit "Journal" தாளில் இருந்து டிரேட்களைப் பாதுகாக்கிறது மற்றும் கிடைக்கும்போது, "Executions" தாளில் பொருந்தும் fills மூலம் commission-ஐ நிரப்புகிறது.',

  'csv.broker-guide.rithmic.warning.emphasis': 'முக்கியமானது:',

  'csv.broker-guide.jdr.warning.emphasis': 'முக்கியமானது:',

  'csv.date-format.auto-detect':
    'தானாகக் கண்டறிதல் (ஐஎஸ்ஓ/தரநிலை வடிவங்களுக்குப் பரிந்துரைக்கப்படுகிறது)',
  'csv.date-format.us-date':
    'அமெரிக்க தேதி: 12/25/2024 (ஸ்க்வாப், ஃபிடிலிட்டி, இ*டிரேட்)',
  'csv.date-format.us-datetime':
    'அமெரிக்க தேதிநேரம்: 12/25/2024 14:30:00 (Webull)',
  'csv.date-format.us-short': 'US Short: 1/5/2024 (TradeZero)',
  'csv.date-format.us-short-datetime': 'US Short தேதிநேரம்: 1/5/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'ISO தேதிநேரம்: 2024-12-25 14:30:00 (Bybit, Tradovate)',
  'csv.date-format.iso-date': 'ISO தேதி: 2024-12-25 (ஊடாடும் தரகர்கள்)',
  'csv.date-format.eu-date': 'EU தேதி: 25/12/2024 (நாள்/மாதம்/ஆண்டு)',
  'csv.date-format.eu-datetime': 'EU தேதிநேரம்: 25/12/2024 14:30:00',
  'csv.date-format.eu-dash': 'EU டாஷ்: 25-12-2024',
  'csv.date-format.eu-dash-datetime': 'EU டேஷ் தேதிநேரம்: 25-12-2024 14:30:00',
  'upgrade.title': 'Pro ஆக மேம்படுத்தவும்',
  'upgrade.feature-message':
    '{featureName} என்பது ஒரு ப்ரோ அம்சமாகும். மேம்பட்ட ஆட்டோமேஷன் மற்றும் அம்சங்களைத் திறக்க மேம்படுத்தவும்.',
  'upgrade.benefits-title': 'புரோ அம்சங்கள் அடங்கும்:',
  'upgrade.benefit.csv': 'AI-உதவி நெடுவரிசை மேப்பிங்குடன் CSV இறக்குமதி',
  'upgrade.benefit.economic-calendar':
    'தானியங்கி வாராந்திர நிகழ்வு இறக்குமதிகளுடன் பொருளாதார நாட்காட்டி',
  'upgrade.benefit.trade-sync': 'ஆதரிக்கப்படும் தரகர்களுக்கான Trade Sync',
  'upgrade.benefit.multi-account': 'பல கணக்கு ஆதரவு',
  'upgrade.prop-profiles.message-firms':
    'உங்கள் சேலஞ்சை முன்கூட்டியே நிரப்ப {count} ப்ராப் நிறுவனங்களின் விதிகளை Journalit தயாராக வைத்திருக்கிறது.',
  'upgrade.prop-profiles.message-firm':
    'ஒவ்வொரு {firm} சேலஞ்சுக்கான விதிகளும் Journalit-இல் முன்கூட்டியே நிரப்பத் தயார்.',
  'upgrade.prop-profiles.message':
    'Journalit ப்ராப் நிறுவன விதிகளை உங்கள் சவாலில் நிரப்பத் தயாராக வைத்திருக்கிறது.',
  'upgrade.prop-profiles.benefits-title': 'Pro உங்களுக்காக நிரப்புவது:',
  'upgrade.benefit.prop.rules':
    'உங்கள் நிறுவனத்தின் விதிகளிலிருந்து நேரடியாக டிராடவுன் மற்றும் தினசரி இழப்பு வரம்புகள்',
  'upgrade.benefit.prop.payout': 'பேஅவுட் வரம்புகளும் தகுதி நிபந்தனைகளும்',
  'upgrade.benefit.prop.phases':
    'நீங்கள் தேர்ந்தெடுத்த சேலஞ்சின் கட்ட இலக்குகளும் முன்னேற்றமும்',
  'upgrade.benefit.prop.updates':
    'நிறுவனம் விதிகளை மாற்றும்போது புதுப்பிப்புகள்',
  'upgrade.trial-notice':
    'உங்களின் அனைத்து வரலாற்று டிரேட்களையும் இறக்குமதி செய்ய 2 வார இலவச சோதனையைப் பெறுங்கள் மற்றும் அனைத்து ப்ரோ அம்சங்களையும் ஆபத்து இல்லாமல் முயற்சிக்கவும்.',

  'monthly.overview.drawdown': 'மாதாந்திர Drawdown',
  'monthly.overview.no-drawdown-data': 'காட்டுவதற்கு Drawdown தரவு இல்லை',

  'settings.account-linking.title': 'கணக்கு இணைப்பை மாற்றவும்',
  'settings.account-linking.description':
    'அனைத்து டிரேட்களையும் ஒரு MT கணக்கிலிருந்து வேறு Obsidian கணக்கிற்கு நகர்த்தவும்',
  'settings.account-linking.source.title': 'மூல MT கணக்கு',
  'settings.account-linking.source.description':
    'MT கணக்கை நீங்கள் நகர்த்த விரும்பும் டிரேடைத் தேர்ந்தெடுக்கவும்',
  'settings.account-linking.source.placeholder':
    'மூலக் கணக்கைத் தேர்ந்தெடுக்கவும்...',
  'settings.account-linking.target.title': 'இலக்கு Obsidian கணக்கு',
  'settings.account-linking.target.description':
    'டிரேட்களை இணைக்க Obsidian கணக்கைத் தேர்ந்தெடுக்கவும்',
  'settings.account-linking.target.placeholder':
    'இலக்கு கணக்கைத் தேர்ந்தெடுக்கவும்...',
  'settings.account-linking.button.processing': 'செயலாக்குகிறது...',
  'settings.account-linking.button.relink': 'கணக்கை மீண்டும் இணைக்கவும்',
  'settings.account-linking.warning':
    'இது இலக்கு கணக்குடன் இணைக்கப்பட்ட மூலக் கணக்கிலிருந்து அனைத்து ஒத்திசைக்கப்பட்ட டிரேட்களையும் புதுப்பிக்கும். இந்தச் செயல்பாட்டைச் செயல்தவிர்க்க முடியாது.',
  'settings.account-linking.success.relinked':
    '{count} டிரேட் {source} இலிருந்து {target} வரை வெற்றிகரமாக மீண்டும் இணைக்கப்பட்டது',
  'settings.account-linking.error.select-both':
    'மூல மற்றும் இலக்கு கணக்குகள் இரண்டையும் தேர்ந்தெடுக்கவும்',
  'settings.account-linking.error.source-not-found':
    'ஆதார கணக்கு கிடைக்கவில்லை',
  'settings.account-linking.error.target-not-found':
    'இலக்கு கணக்கு கிடைக்கவில்லை',
  'settings.account-linking.error.already-linked':
    'இந்த MT கணக்கு ஏற்கனவே தேர்ந்தெடுக்கப்பட்ட Obsidian கணக்குடன் இணைக்கப்பட்டுள்ளது',
  'settings.account-linking.error.service-manager':
    'சேவை மேலாளர் கிடைக்கவில்லை',
  'settings.account-linking.error.backend-service': 'பின்தள சேவை கிடைக்கவில்லை',
  'settings.account-linking.error.relink-failed':
    'கணக்கை மீண்டும் இணைப்பதில் தோல்வி: {error}',
  'account.type.demo': 'டெமோ',
  'account.type.evaluation': 'மதிப்பீடு',
  'account.type.funded': 'Funded',
  'account.type.archived': 'காப்பகப்படுத்தப்பட்டது',
  'account-page.error.title': 'கணக்கை ஏற்றுவதில் பிழை',
  'account-page.error.not-found':
    '"{accountName}"க்கான கணக்குத் தரவைக் கண்டறிய முடியவில்லை',
  'account-page.error.not-found-sub':
    'கணக்கு உள்ளதா எனச் சரிபார்க்கவும் அல்லது பக்கத்தைப் புதுப்பிக்க முயற்சிக்கவும்.',
  'account-page.guide.empty.intro.title': 'இந்த பக்கம் ஒரு கணக்கு விரிவானது',
  'account-page.guide.empty.intro.description':
    'ஒரு கணக்கை நிர்வகிக்க கணக்குப் பக்கத்தைப் பயன்படுத்தவும், கணக்கு நிகழ்வுகளைப் பதிவுசெய்யவும், நீங்கள் டிரேட்களை மதிப்பாய்வு செய்ய விரும்பும் போது அதன் வடிகட்டிய டிரேட் பதிவைத் திறக்கவும்.',
  'account-page.guide.empty.edit-account.title':
    'கணக்கைத் திருத்து முழு கணக்கு அமைப்புகளையும் திறக்கிறது',
  'account-page.guide.empty.edit-account.description':
    'கணக்கின் பெயர், வகை, நாணயம், Drawdown விதிகள், Profit Target, மாதாந்திர செலவு மற்றும் பலவற்றை மாற்ற இந்தப் பொத்தானைப் பயன்படுத்தவும்.',
  'account-page.guide.empty.add-event.title':
    'நிகழ்வு பதிவுகள் வைப்பு மற்றும் திரும்பப் பெறுதல்களைச் சேர்க்கவும்',
  'account-page.guide.empty.add-event.description':
    'சாதாரண டிரேட்டுக்கு வெளியே பணம் உள்ளே அல்லது வெளியே செல்லும் போதெல்லாம் இந்த பொத்தானைப் பயன்படுத்தவும்.',
  'account-page.guide.empty.transactions.title':
    'டெபாசிட்கள் மற்றும் திரும்பப் பெறுதல்கள் இங்கே கண்காணிக்கப்படும்',
  'account-page.guide.empty.transactions.description':
    'இந்த பிரிவு கைமுறையாக வைப்பு மற்றும் திரும்பப் பெறுதல் பற்றிய வரலாற்றை வைத்திருக்கிறது. அது காலியாக இருக்கும்போது, ​​முதல் நிகழ்வை உருவாக்க, நிகழ்வைச் சேர் என்பதைப் பயன்படுத்தவும்.',
  'account-page.guide.empty.trade-log.title':
    'டிரேட் பதிவில் இந்தக் கணக்கைத் திறக்கவும்',
  'account-page.guide.empty.trade-log.description':
    'இந்த தலைப்பு பொத்தான் ஏற்கனவே தேர்ந்தெடுக்கப்பட்ட இந்தக் கணக்குடன் டிரேட் பதிவைத் திறக்கும், எனவே டிரேட் மதிப்பாய்வு பிரத்யேக டிரேட் பதிவுக் காட்சியில் இருக்கும்.',
  'account-page.guide.main.intro.title': 'இந்தப் பக்கம் உங்கள் கணக்கு பிரிவு',
  'account-page.guide.main.intro.description':
    'ஒரு கணக்கைத் தெளிவாகப் புரிந்துகொள்ள கணக்குப் பக்கத்தைப் பயன்படுத்தவும்: இருப்பு வரலாறு, செயல்திறன், ஆபத்து வரம்புகள் மற்றும் பண நகர்வுகள்.',
  'account-page.guide.main.balance-chart.title':
    'இருப்பு விளக்கப்படம் சமநிலையை விட அதிகமாக காட்டுகிறது',
  'account-page.guide.main.balance-chart.description':
    'இந்த விளக்கப்படம் காலப்போக்கில் கணக்கைக் காட்டுகிறது, வைப்புகள் மற்றும் திரும்பப் பெறுதல்கள் உட்பட, கணக்கிற்கு நீங்கள் அமைத்த Drawdown மற்றும் Profit Target நிலைகள்.',
  'account-page.guide.main.metrics.title':
    'இந்த அளவீடுகள் இந்தக் கணக்கை மட்டுமே சுருக்கமாகக் கூறுகின்றன',
  'account-page.guide.main.metrics.description':
    'இந்தக் கணக்கிற்காக இந்த எண்கள் கணக்கிடப்படுகின்றன, எனவே அதன் செயல்திறனை நீங்களே தீர்மானிக்கலாம்.',
  'account-page.guide.main.risk.title':
    'இடர் முன்னேற்றம் இங்கே தனித்தனியாக கண்காணிக்கப்படுகிறது',
  'account-page.guide.main.risk.description':
    'கணக்கு அதன் Drawdown வரம்பு அல்லது Profit Target-க்கு எவ்வளவு நெருக்கமாக உள்ளது என்பதை இந்தப் பிரிவு காட்டுகிறது. கணக்கைத் திருத்து என்பதில் அந்த விதிகளை அமைத்துள்ளீர்கள், அதை அடுத்து காண்பிப்போம்.',
  'account-page.guide.main.transactions.title':
    'வைப்பு மற்றும் திரும்பப் பெறுதல்கள் அவற்றின் சொந்த பிரிவில் இருக்கும்',
  'account-page.guide.main.transactions.description':
    'இங்குள்ள ஒவ்வொரு பதிவையும் பின்னர் மதிப்பாய்வு செய்யலாம், எனவே நீங்கள் டிரேட் செயல்திறனிலிருந்து பண நகர்வுகளைப் பிரிக்கலாம்.',
  'account-page.guide.main.trade-log.title':
    'டிரேட் பதிவில் இந்தக் கணக்கின் டிரேட்களைப் பார்க்கவும்',
  'account-page.guide.main.trade-log.description':
    'கவனம் செலுத்திய டிரேட் மதிப்பாய்விற்காக ஏற்கனவே தேர்ந்தெடுக்கப்பட்ட இந்தக் கணக்கின் மூலம் டிரேட் பதிவைத் திறக்கவும்.',
  'account-page.guide.main.add-event.title':
    'நிகழ்வு பதிவுகள் வைப்பு மற்றும் திரும்பப் பெறுதல்களைச் சேர்க்கவும்',
  'account-page.guide.main.add-event.description':
    'வழக்கமான டிரேட் முடிவுகளுக்கு வெளியே பணம் சேர்க்கப்படும் அல்லது அகற்றப்படும் போதெல்லாம் இதைப் பயன்படுத்தவும், எனவே கணக்கு வரலாறு துல்லியமாக இருக்கும்.',
  'account-page.guide.main.edit-account.title':
    'கணக்கைத் திருத்து கணக்கு அமைப்புகளை மாற்றுகிறது',
  'account-page.guide.main.edit-account.description':
    'இங்குதான் கணக்கு விவரங்கள், இடர் விதிகள், Drawdown மற்றும் Profit Target ஆகியவை காலப்போக்கில் மாறினால் புதுப்பிக்கப்படும்.',
  'account-dashboard.title': 'கணக்குகள்',
  'account-dashboard.copy-badge.base': 'BASE',
  'account-dashboard.copy-badge.copy': 'COPIER',
  'account-dashboard.copy-badge.copied-by': 'நகலெடுக்கப்பட்டது',
  'account-dashboard.copy-badge.copies-tooltip-masked':
    '{account} ஐ நகலெடுக்கிறது',
  'account-dashboard.copy-badge.copies-tooltip':
    '{multiplier}x இல் {account} நகல்கள்',
  'account-dashboard.error.init':
    'பல முயற்சிகளுக்குப் பிறகு AccountPageService துவக்கப்படவில்லை',
  'account-dashboard.error.loading': 'கணக்குகளை ஏற்றுவதில் பிழை: {error}',
  'account-dashboard.error.retry':
    'AccountPageService தயாராக இல்லை, {delay}ms இல் மீண்டும் முயற்சிக்கிறது (முயற்சி {attempt}/{max})',
  'account-dashboard.empty.title': 'கணக்குகள் எதுவும் கிடைக்கவில்லை',
  'account-dashboard.empty.message':
    'உங்கள் டிரேட் செயல்திறனைக் கண்காணிக்க ஒரு கணக்கை உருவாக்கவும்',
  'account-dashboard.section.empty': '{type} கணக்குகள் இல்லை',
  'account-dashboard.section.empty-sub':
    'அதை இங்கே பார்க்க ஒரு கணக்கை உருவாக்கவும்',
  'account-dashboard.button.create-first': 'உங்கள் முதல் கணக்கை உருவாக்கவும்',
  'account-dashboard.action.create': 'புதிய கணக்கை உருவாக்கவும்',
  'account-dashboard.action.settings': 'கணக்கு அமைப்புகள்',
  'account-dashboard.weight-bar.aria': 'கணக்கு வகை AUM விநியோகம்',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: மொத்த AUM இல் {percent}%',
  'account-dashboard.guide.empty.intro.title':
    'இந்தப் பக்கம் உங்கள் கணக்குகள் அனைத்தையும் ஒரே இடத்தில் வைத்திருக்கும்',
  'account-dashboard.guide.empty.intro.description':
    'உங்கள் கணக்குகள் அனைத்தையும் ஒன்றாகப் பார்க்க கணக்குகளைப் பயன்படுத்தவும். கணக்குகள் இருந்தால், இந்தப் பக்கம் அவற்றை ஒப்பிடுவதற்கான விரைவான வழியாகும்.',
  'account-dashboard.guide.empty.state.title':
    'கணக்குகள் எதுவும் இல்லாததால் இன்னும் இங்கு எதுவும் இல்லை',
  'account-dashboard.guide.empty.state.description':
    'உங்கள் முதல் கணக்கை உருவாக்கும் வரை டாஷ்போர்டு காலியாக இருக்கும். அதன் பிறகு, ஒவ்வொரு கணக்குப் பக்கத்திலும் கணக்கு மொத்தங்கள், பிரிவுகள் மற்றும் குறுக்குவழிகளைக் காண்பிக்கும்.',
  'account-dashboard.guide.empty.create.title':
    'உங்கள் முதல் கணக்கை இங்கே உருவாக்கவும்',
  'account-dashboard.guide.empty.create.description':
    'Journalit கண்காணிக்க விரும்பும் முதல் கணக்கை உருவாக்க இந்தப் பொத்தானைக் கிளிக் செய்யவும்.',
  'account-dashboard.guide.empty.after-create.title':
    'நீங்கள் சேமித்த பிறகு, Journalit கணக்குப் பக்கத்தைத் திறக்கும்',
  'account-dashboard.guide.empty.after-create.description':
    'அடிப்படை கணக்கு விவரங்களை பூர்த்தி செய்து சேமிக்கவும். குறிப்பிட்ட கணக்கிற்கான கணக்குப் பக்கத்தில் அடுத்த வழிகாட்டி எடுக்கப்படும்.',
  'account-dashboard.guide.main.intro.title': 'இவை உங்கள் கணக்குகள்',
  'account-dashboard.guide.main.intro.description':
    'கணக்குகளை ஒப்பிட்டுப் பார்க்கவும், எல்லா கணக்குகளிலும் மொத்தத்தைப் பார்க்கவும், மேலும் விவரங்கள் தேவைப்படும்போது ஒரே கணக்கில் குதிக்கவும் இந்தப் பக்கத்தைப் பயன்படுத்தவும்.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM என்பது நிர்வாகத்தின் கீழ் உள்ள சொத்துகள்',
  'account-dashboard.guide.main.aum-chart.description':
    'இந்த விளக்கப்படம் உங்கள் கணக்குகள் முழுவதும் வைப்புத்தொகை, திரும்பப் பெறுதல், Profit Target-கள் மற்றும் Drawdown அளவுகள் உட்பட, காலப்போக்கில் உங்கள் ஒருங்கிணைந்த கணக்கு மதிப்பைக் கண்காணிக்கும்.',
  'account-dashboard.guide.main.metrics.title':
    'இந்த அளவீடுகள் அனைத்து புலப்படும் கணக்குகளையும் சுருக்கமாகக் கூறுகின்றன',
  'account-dashboard.guide.main.metrics.description':
    'குறிப்பிட்ட கணக்கு வகைகள் அல்லது குறிப்பிட்ட கணக்குகளை ஆழமாகப் பார்ப்பதற்கு முன், விரைவான கணக்கு-நிலை ஸ்னாப்ஷாட்டிற்கு இந்தப் புள்ளிவிவரங்களைப் பயன்படுத்தவும்.',
  'account-dashboard.guide.main.mode-switch.title':
    'மேலோட்டம் மற்றும் சவால்கள் ஒரே கணக்குகளின் இரண்டு பார்வைகள்',
  'account-dashboard.guide.main.mode-switch.description':
    'மேலோட்டத்தில் AUM வரைபடமும் போர்ட்ஃபோலியோ மொத்தங்களும் இருக்கும். ப்ராப் சவால் பொருளாதாரத்திற்கு சவால்களுக்கு மாறவும்: தேர்ச்சி விகிதம், செலவுகள், பணம் பெறுதல்கள் மற்றும் ஒவ்வொரு சவால் கணக்கிலும் கட்ட இடையூறுகள்.',
  'account-dashboard.guide.main.create-account.title':
    'நீங்கள் எந்த நேரத்திலும் இங்கிருந்து மற்றொரு கணக்கை உருவாக்கலாம்',
  'account-dashboard.guide.main.create-account.description':
    'டாஷ்போர்டில் புதிய கணக்கைச் சேர்க்க விரும்பும் போதெல்லாம் இந்தப் பொத்தானைப் பயன்படுத்தவும்.',
  'account-dashboard.guide.main.settings-types.title':
    'அமைப்புகள் கிடைக்கக்கூடிய கணக்கு வகைகளை நிர்வகிக்கலாம்',
  'account-dashboard.guide.main.settings-types.description':
    'அமைப்புகளுக்குள், தனிப்பயன் கணக்கு வகைகளைச் சேர்க்கலாம் மற்றும் உங்கள் பணிப்பாய்வு மாறினால் பழையவற்றை அகற்றலாம்.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'அமைப்புகள் மொத்தமாக எண்ணுவதை மாற்றலாம்',
  'account-dashboard.guide.main.settings-inclusion.description':
    'கணக்கு வகைகளை நீக்காமலேயே டாஷ்போர்டில் இருந்து கணக்கு வகைகளை மறைக்க முடியும், மேலும் அவை திரும்பப் பெறுவது இன்னும் கணக்கிடப்படுகிறதா என்பதை நீங்கள் தனித்தனியாக தீர்மானிக்கலாம்.',
  'account-dashboard.guide.main.settings-order.title':
    'இந்த பிரிவு கணக்கு குழுக்களின் வரிசையை கட்டுப்படுத்துகிறது',
  'account-dashboard.guide.main.settings-order.description':
    'டாஷ்போர்டில் முதலில் தோன்றும் கணக்கு வகைகளைத் தீர்மானிக்க இந்தக் கட்டுப்பாடுகளைப் பயன்படுத்தவும்.',

  'account-dashboard.guide.main.open-account.title':
    'ஆழமாகச் செல்ல ஏதேனும் கணக்கு அட்டையைத் திறக்கவும்',
  'account-dashboard.guide.main.open-account.description':
    'ஒத்த கணக்குகளை ஒப்பிட கணக்குகள் வகைவாரியாக தொகுக்கப்பட்டுள்ளன. முழு விவரத்திற்கு எந்த அட்டையையும் திறக்கவும்; அங்கு கணக்குப் பக்க வழிகாட்டி தொடரும்.',
  'account-dashboard.metrics.total-accounts': 'மொத்த கணக்குகள்',
  'account-dashboard.metrics.total-aum': 'மொத்தம் AUM',
  'account-dashboard.metrics.total-growth': 'மொத்த வளர்ச்சி',
  'account-dashboard.metrics.growth-percent': 'வளர்ச்சி %',
  'account-dashboard.metrics.total-withdrawals': 'மொத்த திரும்பப் பெறுதல்',
  'account-dashboard.metrics.no-withdrawals': 'திரும்பப் பெறுதல் இல்லை',
  'account-dashboard.metrics.total-trades': 'மொத்த டிரேட்கள்',
  'account-dashboard.type-header.excluded': 'விலக்கப்பட்டது',
  'account-dashboard.type-header.from-stats': 'புள்ளிவிவரங்களிலிருந்து',
  'account-dashboard.type-header.of-total-aum': 'மொத்தம் AUM',
  'account-dashboard.type-header.aum': 'AUM',
  'account-dashboard.type-header.withdrawals': 'வித்ட்ராக்கள்',
  'account-dashboard.type-header.account': 'கணக்கு',
  'account-dashboard.type-header.accounts': 'கணக்குகள்',
  'account-dashboard.type-header.trade': 'டிரேட்',
  'account-dashboard.type-header.trades': 'டிரேட்கள்',
  'account-dashboard.type-header.growth': 'வளர்ச்சி ({percent})',
  'account-card.metric.trades': 'டிரேட்கள்',
  'account-card.metric.withdrawals': 'வித்ட்ராக்கள்',
  'account-card.metric.age': 'வயது',
  'account-card.progress.profit-target': 'Profit Target',
  'account-card.progress.drawdown-used': 'Drawdown வரம்பு பயன்படுத்தப்பட்டது',
  'account-card.progress.not-set': 'அமைக்கப்படவில்லை',
  'account-card.footer.monthly': 'மாதாந்திர:',
  'account-card.footer.total-costs': 'மொத்த செலவுகள்:',
  'account.chart.event.added': 'கணக்கு சேர்க்கப்பட்டது',
  'account.chart.event.archived': 'கணக்கு காப்பகப்படுத்தப்பட்டது',
  'account.balance-chart.drawdown-floor-off-scale':
    'டிராடவுன் வரம்பு {value} ({distance} கீழே)',
  'account.balance-chart.profit-target-off-scale':
    'லாப இலக்கு {value} ({distance} மேலே)',
  'account.balance-chart.empty': 'டிரேட் இல்லை',
  'account.balance-chart.empty-sub':
    'இந்தக் கணக்கிற்கு டிரேட் நடவடிக்கை எதுவும் இல்லை',
  'account.aum-chart.empty': 'கணக்கு தரவு இல்லை',
  'account.aum-chart.empty-sub':
    'AUM வரலாற்றைப் பார்க்க கணக்குகளைச் சேர்க்கவும்',
  'chart.shared.empty': 'டிரேட் இல்லை',
  'chart.shared.empty-sub': 'வேறு நேரத்தைத் தேர்ந்தெடுக்க முயற்சிக்கவும்',
  'account.link-modal.title': 'புதிய டிரேட் கணக்கு கண்டறியப்பட்டது',
  'account.link-modal.account-id': 'கணக்கு ஐடி:',
  'account.link-modal.broker': 'தரகர்:',
  'account.link-modal.first-seen': 'முதலில் பார்த்தது:',
  'account.link-modal.question':
    'இந்தக் கணக்கை எப்படிக் கையாள விரும்புகிறீர்கள்?',
  'account.link-modal.option.new':
    'தனிப்பயன் பெயரில் புதிய கணக்கை உருவாக்கவும்',
  'account.link-modal.placeholder.custom-name': 'எ.கா., FTMO சவால்',
  'account.link-modal.account-type': 'கணக்கு வகை:',
  'account.link-modal.option.existing': 'ஏற்கனவே உள்ள கணக்கிற்கான இணைப்பு',
  'account.link-modal.no-accounts-available': '(கணக்குகள் இல்லை)',
  'account.link-modal.select-account': 'கணக்கைத் தேர்ந்தெடுக்கவும்...',

  'account.link-modal.option.default':
    'இயல்புப் பெயரைப் பயன்படுத்தவும்: கணக்கு-{id}',
  'account.link-modal.default-name': 'கணக்கு-{id}',
  'account.link-modal.button.linking': 'இணைக்கிறது...',
  'account.link-modal.notice.select-existing':
    'ஏற்கனவே உள்ள கணக்கைத் தேர்ந்தெடுக்கவும்',
  'account.link-modal.notice.failed': 'கணக்கை இணைப்பதில் தோல்வி: {error}',
  'trade.review.title': 'டிரேட் மதிப்பாய்வு',

  'trade.details.entry': 'நுழைவு',
  'trade.details.exit': 'வெளியேற்றம்',

  'trade.details.duration': 'கால அளவு',

  'trade.details.thesis': 'தீசிஸ்',

  'trade.details.entries-summary': '{count} உள்ளீடுகள்',
  'trade.details.exits-summary': '{count} வெளியேற்றங்கள்',
  'trade.details.take-profit-count': '{count} இலக்குகள்',

  'trade.metadata.account': 'கணக்கு:',

  'trade.metadata.setups': 'Setups',
  'trade.metadata.mistakes': 'தவறுகள்',
  'trade.image.no-images': 'இந்த டிரேட்டுக்கு படங்கள் இல்லை',
  'trade.image.click-edit': 'படத்தைச் சேர்க்கவும்',
  'trade.image.alt-prefix': 'டிரேட் படம்',

  'trade.review.reviewed': 'மதிப்பாய்வு செய்யப்பட்டது',
  'trade.review.reviewed-on': '{date} இல் மதிப்பாய்வு செய்யப்பட்டது',

  'timeline.status.loss': 'நட்டம்',

  'timeline.aria.session-navigation': 'ஒரே நாள் டிரேட் வழிசெலுத்தல்',
  'timeline.aria.previous-trade': 'முந்தைய டிரேட்: {trade}',
  'timeline.aria.next-trade': 'அடுத்த டிரேட்: {trade}',
  'timeline.aria.no-previous-trade': 'இந்த டிரேட் நாளில் முந்தைய டிரேட் இல்லை',
  'timeline.aria.no-next-trade': 'இந்த டிரேட் நாளில் அடுத்த டிரேட் இல்லை',

  'drc.tab.review': 'மதிப்பாய்வு',

  'drc.missed-trades.label.reason': 'காரணம்:',

  'missed-trade.reason-title': 'நான் ஏன் இந்த டிரேடை தவறவிட்டேன்',

  'settings.general.title': 'பொது அமைப்புகள்',
  'settings.general.docs': 'ஆவணங்கள்',
  'settings.general.discord': 'Discord',
  'settings.general.github': 'கிட்ஹப்',
  'settings.general.currency': 'நாணயம்',
  'settings.general.currency-desc':
    'செருகுநிரல் முழுவதும் அனைத்து பண மதிப்புகளுக்கும் காட்ட நாணயத்தைத் தேர்வு செய்யவும்',
  'settings.general.currency-aria':
    'பண மதிப்புகளைக் காட்டுவதற்கு நாணயத்தைத் தேர்ந்தெடுக்கவும்',
  'settings.general.currency-changed':
    'நாணயம் {currency}க்கு மாற்றப்பட்டது. அனைத்து கூறுகளும் உடனடியாக புதுப்பிக்கப்படும்!',
  'settings.general.currency-save-failed':
    'நாணய அமைப்பைச் சேமிப்பதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.',
  'settings.general.path-change.title':
    'ஜர்னல் கோப்புறையின் இடம் மாற்றப்பட்டது',
  'settings.general.path-change.new-trades-title':
    'உங்கள் புதிய கோப்புறை இருப்பிடத்தில் புதிய டிரேட்கள் உருவாக்கப்படும்',
  'settings.general.path-change.new-trades-desc':
    'அனைத்து எதிர்கால டிரேட் ஜர்னல்களும் பயன்படுத்தும்:',
  'settings.general.path-change.manual-title': 'கைமுறை நடவடிக்கை தேவை:',
  'settings.general.path-change.manual-desc':
    'உங்கள் தற்போதைய கோப்புறையில் ஏற்கனவே டிரேட்கள் உள்ளன. அவற்றை நகர்த்துவதற்கு:',
  'settings.general.path-change.step.open-explorer':
    'உங்கள் vault இன் கோப்பு எக்ஸ்ப்ளோரரைத் திறக்கவும்',
  'settings.general.path-change.step.find-folder-prefix': 'உங்கள் கண்டுபிடி',
  'settings.general.path-change.step.find-folder-suffix': 'கோப்புறை',
  'settings.general.path-change.step.drag-drop':
    'வசதியாக இருக்கும்போது உங்கள் புதிய இடத்திற்கு இழுத்து விடுங்கள்',
  'settings.general.path-change.manual-note':
    'இது உங்கள் கோப்புகள் எப்போது மற்றும் எப்படி நகர்த்தப்படும் என்பதன் மீதான முழு கட்டுப்பாட்டை உங்களுக்கு வழங்குகிறது.',
  'settings.general.path-change.sync-title': 'ஒத்திசைவு மேப்பிங் புதுப்பிப்பு:',
  'settings.general.path-change.sync-desc':
    'புதிய கோப்புறை பாதையைப் பிரதிபலிக்கும் வகையில் plugin உங்கள் டிரேட் ஒத்திசைவு மேப்பிங்கைத் தானாகவே புதுப்பிக்கும். உங்கள் ஒத்திசைக்கப்பட்ட டிரேட்கள் அவற்றின் backend பதிவுகளுடன் இணைக்கப்பட்டிருப்பதை இது உறுதி செய்கிறது.',
  'settings.general.path-change.button.cancel': 'ரத்து',
  'settings.general.path-change.button.confirm': 'எனக்கு புரிகிறது',
  'settings.general.display-name': 'காட்சி பெயர்',
  'settings.general.display-name-desc':
    'Journalit காட்சி வரவேற்புச் செய்தியில் காட்ட விருப்பப் பெயர் (எ.கா., "குட் மார்னிங், அலெக்ஸ்")',
  'settings.general.display-name-placeholder': 'புதிய காட்சி பெயரைச் சேர்...',
  'settings.general.display-name-aria': 'வரவேற்பு செய்திக்கான காட்சி பெயர்',
  'settings.general.display-name-confirm-aria':
    'காட்சி பெயர் மாற்றத்தை உறுதிப்படுத்தவும்',
  'settings.general.display-name-cancel-aria':
    'காட்சி பெயர் மாற்றத்தை ரத்துசெய்',
  'settings.general.display-name-saved':
    'காட்சி பெயர் "{name}" ஆக சேமிக்கப்பட்டது',
  'settings.general.display-name-cleared': 'காட்சி பெயர் அழிக்கப்பட்டது',
  'settings.general.display-name-save-failed':
    'காட்சிப் பெயரைச் சேமிப்பதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.',
  'settings.general.privacy-mode': 'தனியுரிமை பயன்முறை',
  'settings.general.privacy-mode-desc':
    'சேமித்த தரவை மாற்றாமல் UI இல் உணர்திறன் டிரேட், கணக்கு, விலை மற்றும் செயல்திறன் மதிப்புகளை மறைக்கவும்.',
  'settings.general.privacy-mode-aria': 'தனியுரிமை பயன்முறையை நிலைமாற்று',
  'settings.general.home-view-settings': 'முகப்புக் காட்சி அமைப்புகள்',
  'settings.general.home-auto-open': 'முகப்புக் காட்சி தானாகத் திற',
  'settings.general.home-auto-open-desc':
    'முகப்புக் காட்சியைத் தானாக எப்போது திறக்க வேண்டும் என்பதைத் தேர்வுசெய்யவும்',
  'settings.general.home-auto-open-always':
    'எப்போதும் திற + கவனம் (இயல்புநிலை)',
  'settings.general.home-auto-open-ifnone':
    'செயலில் கோப்பு இல்லை என்றால் மட்டுமே',
  'settings.general.home-auto-open-never':
    'ஒருபோதும் வேண்டாம் (கைமுறை மட்டும்)',
  'settings.general.home-auto-open-aria':
    'முகப்பு தொடக்க நடத்தையைத் தேர்ந்தெடுக்கவும்',
  'settings.general.home-startup-changed':
    'Journalit தொடக்க நடத்தை இதற்கு மாற்றப்பட்டது: {behavior}',
  'settings.general.filter-recent':
    'சமீபத்திய உருப்படிகளை Journalit கோப்புகளுக்கு வடிகட்டவும்',
  'settings.general.filter-recent-desc':
    'சமீபத்திய உருப்படிகள் விட்ஜெட்டில் (.journalit கோப்புறையில் உள்ள கோப்புகள்) Journalit தொடர்பான கோப்புகளை மட்டும் காட்டு. சமீபத்திய உருப்படிகள் பட்டியலில் இருந்து மற்ற அனைத்து vault கோப்புகளையும் மறைக்கும்.',
  'settings.general.filter-recent-aria':
    'சமீபத்திய உருப்படிகளை Journalit கோப்புகளில் வடிகட்டவும்',
  'settings.general.filter-recent-toggled':
    'சமீபத்திய உருப்படிகளை Journalit கோப்புகளுக்கு வடிகட்டவும் {status}',
  'settings.general.home-widget-opacity': 'விட்ஜெட் ஒளிபுகாமை',
  'settings.general.home-widget-opacity-desc':
    'படத்துடன் கூடிய விட்ஜெட் பின்னணி: 0% முழுமையாக ஒளிபுகும், 100% ஒளிபுகாது. தற்போதைய தீமுக்குப் பொருந்தும்; வெளிர் மற்றும் அடர் தீம்களின் மதிப்புகள் தனித்தனியாகச் சேமிக்கப்படும்.',
  'settings.general.home-widget-opacity-save-failed':
    'விட்ஜெட் ஒளிபுகாமையைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'settings.general.home-background': 'முகப்பு பின்னணி படம்',
  'settings.general.home-background-desc':
    'உங்கள் முகப்பு விட்ஜெட்டுகளுக்குப் பின்னால் காட்டப்பட்டுள்ளது.',
  'settings.general.home-background-dashboard':
    'டாஷ்போர்டில் பின்னணியைக் காட்டு',
  'settings.general.home-background-dashboard-desc':
    'டாஷ்போர்டு பயன்முறையில் அதே பின்னணி படத்தைப் பயன்படுத்தவும்.',
  'settings.general.home-background-dashboard-aria':
    'டாஷ்போர்டில் முகப்புப் பின்னணியைக் காட்டு',

  'settings.general.home-background-choose': 'படத்தை தேர்வு செய்யவும்',
  'settings.general.home-background-clear': 'அழி',

  'settings.general.home-background-invalid-file':
    'ஆதரிக்கப்படும் படக் கோப்பைத் தேர்ந்தெடுக்கவும்.',
  'settings.general.home-background-saved':
    'முகப்பு பின்னணி படம் சேமிக்கப்பட்டது.',
  'settings.general.home-background-cleared':
    'முகப்பு பின்னணி படம் அழிக்கப்பட்டது.',
  'settings.general.home-background-save-failed':
    'முகப்புப் பின்புலப் படத்தைச் சேமிப்பதில் தோல்வி.',
  'settings.general.folder-section': 'கோப்புறை இருப்பிடம் & பட பாதைகள்',
  'settings.general.journal-folder': 'ஜர்னல் கோப்புறை இருப்பிடம்',
  'settings.general.journal-folder-desc':
    'உங்கள் vault இல் டிரேட் ஜர்னல்கள் எங்கு சேமிக்கப்படுகின்றன என்பதைத் தேர்வு செய்யவும்.',
  'settings.general.journal-folder-desc-2':
    'இயல்புநிலை ரூட் கோப்புறை இருப்பிடத்தைப் பயன்படுத்த காலியாக விடவும்.',
  'settings.general.journal-folder-placeholder':
    'தனிப்பயன் கோப்புறையைத் தேர்ந்தெடு...',
  'settings.general.journal-folder-default':
    'இயல்புநிலை: ரூட் கோப்புறை (!Journalit)',
  'settings.general.update-image-paths': 'பட பாதைகளைப் புதுப்பிக்கவும்',
  'settings.general.update-image-paths-desc':
    'தற்போதைய கோப்புறை இருப்பிடத்துடன் பொருந்துமாறு அனைத்து டிரேட்களிலும் பட பாதைகளை மேம்படுத்துகிறது. உங்கள் !Journalit கோப்புறையை கைமுறையாக நகர்த்திய பிறகு இதைப் பயன்படுத்தவும்.',
  'settings.general.update-image-paths-updating': 'புதுப்பிக்கிறது...',
  'settings.general.update-image-paths-match':
    'அனைத்து பட பாதைகளும் ஏற்கனவே தற்போதைய கோப்புறை இருப்பிடத்துடன் பொருந்துகின்றன',
  'settings.general.folder-updated':
    'ஜர்னல் கோப்புறை பாதை புதுப்பிக்கப்பட்டது. புதிய டிரேட்கள் இதில் உருவாக்கப்படும்: {path}',
  'settings.general.folder-update-failed':
    'பாதையைப் புதுப்பிக்க முடியவில்லை: {error}',
  'settings.general.update-image-paths-success':
    '{count} டிரேட்டில் படப் பாதைகள் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன',
  'settings.general.update-image-paths-no-update':
    'பட பாதைகள் புதுப்பிக்க தேவையில்லை',
  'settings.general.update-image-paths-errors':
    '{failed} பிழைகளுடன் {updated} டிரேட் புதுப்பிக்கப்பட்டது. விவரங்களுக்கு கன்சோலைச் சரிபார்க்கவும்.',
  'settings.general.update-image-paths-failed':
    'பட பாதைகளை புதுப்பிக்க முடியவில்லை. விவரங்களுக்கு கன்சோலைச் சரிபார்க்கவும்.',
  'settings.general.trade-settings': 'டிரேட் அமைப்புகள்',
  'settings.general.auto-open-trades': 'உருவாக்கப்பட்ட டிரேட்களைத் தானாகத் திற',
  'settings.general.auto-open-trades-desc':
    'டிரேட் குறிப்புகள் உருவாக்கப்பட்ட பிறகு, புதிய தாவலில் தானாகத் திறக்கவும்',
  'settings.general.auto-open-trades-aria':
    'தானாகத் திற உருவாக்கப்பட்ட டிரேட்கள்',
  'settings.general.auto-open-toggled':
    'உருவாக்கப்பட்ட டிரேட்களைத் தானாகத் திற {status}',
  'settings.general.date-format': 'தேதி வடிவம்',
  'settings.general.date-format-desc':
    'செருகுநிரல் முழுவதும் தேதிகளைக் காண்பிப்பதற்கான வடிவம்',
  'settings.general.date-format-aria':
    'டிரேட் குறிப்புகளுக்கான தேதி வடிவமைப்பைத் தேர்ந்தெடுக்கவும்',
  'settings.general.date-format-ddmmyy': 'DD/MM/YY (31/12/23)',
  'settings.general.date-format-mmddyy': 'MM/DD/YY (12/31/23)',
  'settings.general.date-format-yymmdd': 'YY/MM/DD (23/12/31)',
  'settings.general.date-format-changed':
    'டிரேட் குறிப்பு தேதி வடிவம் {format} க்கு மாற்றப்பட்டது',
  'settings.general.use-24-hour-time':
    '24 மணிநேர நேர வடிவமைப்பைப் பயன்படுத்தவும்',
  'settings.general.use-24-hour-time-desc':
    'காட்சி நேரங்கள் 12-மணிநேரம்/பிஎம் வடிவமைப்பிற்குப் பதிலாக (14:30) 24-மணிநேர வடிவமைப்பில் (பிற்பகல் 2:30)',
  'settings.general.use-24-hour-time-aria':
    '24 மணிநேர நேர வடிவமைப்பைப் பயன்படுத்தவும்',
  'settings.general.show-seconds': 'டிரேட் நேரங்களில் வினாடிகளைக் காட்டு',
  'settings.general.show-seconds-desc':
    'டிரேட் நுழைவு மற்றும் வெளியேறும் நேரங்களை உள்ளிடும்போது வினாடிகளைக் காண்பி.',
  'settings.general.show-seconds-aria': 'டிரேட் நேரங்களில் வினாடிகளைக் காட்டு',
  'settings.general.skip-weekends': 'வார இறுதி நாட்களை தவிர்த்து விடுங்கள்',
  'settings.general.skip-weekends-desc':
    'இயக்கப்பட்டால், Journalit வார இறுதி நாட்களை செருகுநிரல் முழுவதும் டிரேட் அல்லாத நாட்களாகக் கருதுகிறது. சனி மற்றும் ஞாயிற்றுக்கிழமைகளில் நீங்கள் டிரேட் செய்தால் அல்லது செயல்பாட்டை மதிப்பாய்வு செய்தால் இதை முடக்கவும்.',
  'settings.general.skip-weekends-aria':
    'Journalit முழுவதும் வார இறுதி நாட்களை விலக்கு',
  'settings.general.skip-weekends-toggled': 'வார இறுதி விலக்கு {status}',
  'settings.general.week-start': 'வார தொடக்க நாள்',
  'settings.general.week-start-desc':
    'உங்கள் டிரேட் வாரம் எந்த நாளில் தொடங்குகிறது என்பதைத் தேர்வுசெய்யவும். வாராந்திர மதிப்பாய்வுகள் மற்றும் அறிக்கைகளை பாதிக்கிறது.',
  'settings.general.week-start-aria': 'வார தொடக்க நாளைத் தேர்ந்தெடுக்கவும்',
  'settings.general.week-start-changed':
    'வார தொடக்க நாள் {day} ஆக மாற்றப்பட்டது',
  'settings.general.analytics-date-basis': 'பகுப்பாய்வு தேதி அடிப்படை',
  'settings.general.analytics-date-basis-desc':
    'ஊஞ்சல் வியாபாரிகளுக்கு சிறந்தது. பகுப்பாய்வுக்கான நுழைவு தேதி அல்லது இறுதி வெளியேறும் தேதியைப் பயன்படுத்துகிறது. வெளியேறும் தேதி பயன்முறையானது மூடப்பட்ட டிரேட்களை மட்டுமே கணக்கிடுகிறது மற்றும் நேரடி PnL டிரேட்களுக்கு வெளியேறும் தேதி தேவைப்படுகிறது.',
  'settings.general.analytics-date-basis-aria':
    'பகுப்பாய்வு தேதி அடிப்படையில் தேர்ந்தெடுக்கவும்',
  'settings.general.analytics-date-basis-entry': 'நுழைவு தேதி',
  'settings.general.analytics-date-basis-exit': 'வெளியேறும் தேதி',
  'settings.general.analytics-date-basis-changed':
    'பகுப்பாய்வு தேதி அடிப்படையில் {basis} க்கு மாற்றப்பட்டது',
  'settings.general.dollar-value-input':
    'Position அளவை டாலர் மதிப்பாக உள்ளிடவும்',
  'settings.general.dollar-value-input-desc':
    'இயக்கப்பட்டால், அளவு (shares/Lots/contracts) என்பதற்குப் பதிலாக, ஒரு டாலர் தொகையாக (எ.கா., $10,000) position அளவை உள்ளிடவும். விலையில் இருந்து அளவு தானாகவே கணக்கிடப்படும். பங்குகளுக்கு சிறப்பாகச் செயல்படும்; Futures/Forex கணக்கில் இல்லாத contract பெருக்கிகளைக் கொண்டுள்ளன.',
  'settings.general.dollar-value-input-aria':
    'நிலை அளவை டாலர் மதிப்பாக உள்ளிடவும்',
  'settings.general.dollar-value-input-toggled':
    'Position அளவு உள்ளீடு: {mode}',
  'settings.general.dollar-value': 'டாலர் மதிப்பு',
  'settings.general.quantity': 'அளவு',
  'settings.general.mae-mfe-input-mode': 'MAE/MFE உள்ளீட்டு முறை',
  'settings.general.mae-mfe-input-mode-desc':
    'டிரேட் படிவத்தில் MAE/MFE (Maximum Adverse/Favorable Excursion) மதிப்புகளை எவ்வாறு உள்ளிடுவது என்பதைத் தேர்வுசெய்யவும்.',
  'settings.general.mae-mfe-input-mode-desc-price':
    'விலை நிலைகள்: டிரேட்டின் போது அடைந்த குறைந்த/அதிக விலையை உள்ளிடவும்.',
  'settings.general.mae-mfe-input-mode-desc-dollar':
    'டாலர் மதிப்புகள்: அதிகபட்ச Drawdown/லாபத்தை நேரடியாக டாலரில் உள்ளிடவும்.',
  'settings.general.mae-mfe-input-mode-aria':
    'MAE/MFE உள்ளீட்டு பயன்முறையைத் தேர்ந்தெடுக்கவும்',
  'settings.general.mae-mfe-input-mode-price': 'விலை நிலைகள்',
  'settings.general.mae-mfe-input-mode-dollar': 'டாலர் மதிப்புகள்',
  'settings.general.mae-mfe-display-unit': 'MAE/MFE காட்சி அலகு',
  'settings.general.mae-mfe-display-unit-desc':
    'பகுப்பாய்வு மற்றும் டிரேட் பதிவு முழுவதும் MAE/MFE-ஐ நாணயத்தில் அல்லது Futures ticks-இல் காட்டவும்.',
  'settings.general.mae-mfe-display-unit-aria':
    'MAE/MFE டிஸ்ப்ளே யூனிட்டைத் தேர்ந்தெடுக்கவும்',
  'settings.general.mae-mfe-display-dollar': 'நாணயம்',
  'settings.general.mae-mfe-display-ticks': 'tickகள்',
  'common.ticks': 'ticks',
  'dashboard.mae-mfe-ticks.partial-coverage':
    '{total} டிரேட்களில் {eligible} மட்டுமே Futures tick தரவு உள்ளது. இந்த அளவீடு தகுதியற்ற டிரேட்களை விலக்குகிறது.',
  'settings.general.cutoff-time': 'டிரேட் நாள் வெட்டு நேரம்',
  'settings.general.cutoff-time-desc':
    'ஒரு டிரேட் நாளின் முடிவை வரையறுக்கும் நேரம். இந்த நேரத்திற்குப் பிந்தைய டிரேட்கள் அடுத்த நாளுடன் தொகுக்கப்படும். (24-மணிநேர வடிவம், எ.கா., 23:30க்கு 11:30 PM)',
  'settings.general.cutoff-time-aria': 'டிரேட் நாள் வெட்டு நேரம்',
  'settings.general.cutoff-time-changed':
    'டிரேட் நாள் வெட்டு நேரம் {time} ஆக மாற்றப்பட்டது',
  'settings.general.break-even-threshold-mode': 'Breakeven த்ரெஷோல்ட் வகை',
  'settings.general.break-even-threshold-mode-desc':
    'நிலையான P&L வரம்பினால் Breakeven தீர்மானிக்கப்படுகிறதா அல்லது ஒவ்வொரு டிரேட் கணக்கின் தற்போதைய இருப்பின் சதவீதத்தால் தீர்மானிக்கப்படுகிறதா என்பதைத் தேர்வுசெய்யவும்.',
  'settings.general.break-even-mode-fixed': 'நிலையான தொகை வரம்பு',
  'settings.general.break-even-mode-percent':
    'நடப்புக் கணக்கு இருப்பின் சதவீதம்',
  'settings.general.break-even-percent': 'Breakeven சதவீதம்',
  'settings.general.break-even-percent-desc':
    'பூஜ்ஜியத்தைச் சுற்றி சமச்சீர் வரம்பு (நடப்புக் கணக்கு இருப்பில் ±X%). தீர்க்கக்கூடிய கணக்கு இருப்பு இல்லாத டிரேட்கள் வெற்றி/தோல்வி புள்ளிவிவரங்களில் இருந்து விலக்கப்படும்.',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'நடப்புக் கணக்கு இருப்பின் Breakeven சதவீதம்',
  'settings.general.break-even-range': 'பிரேக் ஈவன் ரேஞ்ச்',
  'settings.general.break-even-range-desc':
    'P&L வரம்பை வரையறுக்கவும். எடுத்துக்காட்டாக, குறைந்தபட்சம்: -20 மற்றும் அதிகபட்சம்: 20 ஐ அமைப்பது -$20 மற்றும் +$20க்கு இடைப்பட்ட டிரேடை இடைவேளை சமமாக கருதும். துல்லியமான $0.00 ஐ மட்டும் பிரேக் ஈவனாகக் கருத இரண்டையும் 0 ஆக அமைக்கவும். குறைந்தபட்சம் அதிகபட்சத்தை விட குறைவாகவோ அல்லது சமமாகவோ இருக்க வேண்டும்.',
  'settings.general.break-even-min-placeholder': 'குறைந்தபட்சம்',
  'settings.general.break-even-max-placeholder': 'அதிகபட்சம்',
  'settings.general.break-even-min-aria': 'பிரேக் ஈவன் வரம்பு குறைந்தபட்சம்',
  'settings.general.break-even-max-aria': 'பிரேக் ஈவன் வரம்பு அதிகபட்சம்',
  'settings.general.break-even-to': 'செய்ய',
  'settings.general.break-even-warning':
    'எச்சரிக்கை: குறைந்தபட்ச மதிப்பு அதிகபட்ச மதிப்பை விட அதிகமாக உள்ளது. இது டிரேட்கள் Breakeven என வகைப்படுத்தப்படுவதைத் தடுக்கும்.',
  'settings.general.break-even-updated':
    'பிரேக் ஈவன் வரம்பு புதுப்பிக்கப்பட்டது - அடுத்த ஏற்றத்தில் பார்வைகள் புதுப்பிக்கப்படும்',
  'settings.general.default-risk': 'இயல்புநிலை ஆபத்து அளவு',
  'settings.general.default-risk-desc':
    'ஆர்-மல்டிபிள் கணக்கீடுகளுக்குப் பயன்படுத்தப்படும் இயல்புநிலை ஆபத்துத் தொகை (கணக்கு நாணயத்தில்). ஒரு டிரேட்டுக்கு கைமுறையாக நுழைவதற்கு காலியாக விடவும்.',
  'settings.general.default-risk-aria': 'இயல்புநிலை ஆபத்து அளவு',
  'settings.general.display-r-multiples': 'காட்சி ஆர்-மல்டிபிள்ஸ்',
  'settings.general.display-r-multiples-desc':
    'செருகுநிரல் முழுவதும் நாணயத் தொகைகளுக்குப் பதிலாக R-multiple மதிப்புகளைக் (ரிஸ்க்-டு-ரிவார்ட் விகிதங்கள்) காட்டு',
  'settings.general.display-r-multiples-aria':
    'டிரேட் காட்சிகளில் R-பன்மைகளைக் காட்டவும்',
  'settings.general.display-r-multiples-toggled':
    'R-மல்டிபிள்ஸ் காட்சி {status}',
  'settings.general.include-copy-accounts-analytics':
    'அனைத்து கணக்கு பகுப்பாய்வுகளிலும் நகல் கணக்குகளைச் சேர்க்கவும்',
  'settings.general.include-copy-accounts-analytics-desc':
    'இயக்கப்பட்டால், அனைத்து கணக்கு டிரேட் பகுப்பாய்வுகளும் பெறப்பட்ட நகல்-கணக்கு முடிவுகளைச் சேர்த்து அவற்றை கணக்கு-நிலை டிரேட்களாக எண்ணும்.',
  'settings.general.include-copy-accounts-analytics-aria':
    'அனைத்து கணக்கு பகுப்பாய்வுகளிலும் நகல் கணக்குகளைச் சேர்க்கவும்',
  'settings.general.include-copy-accounts-toggled':
    'அனைத்து கணக்கு பகுப்பாய்வுகளிலும் கணக்குகளை நகலெடுக்கவும் {status}',
  'settings.general.include-unrealized-pnl':
    'பகுப்பாய்வுகளில் Unrealized P&L-ஐச் சேர்',
  'settings.general.include-unrealized-pnl-desc':
    'இயக்கப்பட்டால், நிகர P&L மொத்தத்தில், Unrealized P&L விலை ஸ்னாப்ஷாட்டுடன் திறந்த Position-களில் இருந்து, realized முடிவுகளிலிருந்து தனித்தனியாகக் காட்டப்படும். Win Rate மற்றும் ஸ்ட்ரீக்குகள் போன்ற டிரேட் விளைவு புள்ளிவிவரங்கள் realized மட்டுமே.',
  'settings.general.include-unrealized-pnl-aria':
    'பகுப்பாய்வுகளில் Unrealized P&L-ஐச் சேர்',
  'settings.general.include-unrealized-pnl-toggled':
    'பகுப்பாய்வுகளில் Unrealized P&L {status}',
  'settings.general.notification-settings': 'அறிவிப்பு அமைப்புகள்',
  'settings.general.sync-notifications': 'அறிவிப்புகளை ஒத்திசைக்கவும்',
  'settings.general.sync-notifications-desc':
    'ஒத்திசைவு செயல்பாடுகள் முடிந்ததும் அறிவிப்புகளைக் காட்டு',
  'settings.general.sync-notifications-aria': 'ஒத்திசைவு அறிவிப்புகளை இயக்கு',
  'settings.general.sync-notifications-toggled':
    'ஒத்திசைவு அறிவிப்புகள் {status}',
  'settings.general.new-trade-notifications': 'புதிய டிரேட் அறிவிப்புகள்',
  'settings.general.new-trade-notifications-desc':
    'புதிய டிரேட் கோப்புகள் கண்டறியப்படும்போது அறிவிப்புகளைக் காட்டு',
  'settings.general.new-trade-notifications-aria':
    'புதிய டிரேட் அறிவிப்புகளை இயக்கவும்',
  'settings.general.new-trade-notifications-toggled':
    'புதிய டிரேட் அறிவிப்புகள் {status}',
  'settings.general.update-notifications': 'புதுப்பிப்பு அறிவிப்புகளைக் காட்டு',
  'settings.general.update-notifications-desc':
    'புதிய செருகுநிரல் புதுப்பிப்பு கிடைக்கும்போது அறிவிப்பைக் காண்பி',
  'settings.general.update-notifications-aria':
    'புதுப்பிப்பு அறிவிப்புகளைக் காட்டு',
  'settings.general.update-notifications-toggled':
    'அறிவிப்புகளைப் புதுப்பிக்கவும் {status}',
  'settings.general.data-management': 'தரவு மேலாண்மை & தனியுரிமை',
  'settings.general.backup-restore-section':
    'காப்புப்பிரதி, மீட்டெடு & மீட்டமை',
  'settings.general.export-settings': 'ஏற்றுமதி அமைப்புகள்',
  'settings.general.export-settings-desc':
    'காப்புப்பிரதிக்கான அனைத்து செருகுநிரல் அமைப்புகளையும் JSON கோப்பாகப் பதிவிறக்கவும் அல்லது மற்றொரு vault க்கு மாற்றவும்',
  'settings.general.export-settings-exporting': 'ஏற்றுமதி செய்கிறது...',
  'settings.general.import-settings': 'இறக்குமதி அமைப்புகள்',
  'settings.general.import-settings-desc':
    'முன்பு ஏற்றுமதி செய்யப்பட்ட JSON கோப்பிலிருந்து அமைப்புகளை மீட்டமைக்கவும். அமைப்புகள் தற்போதைய மதிப்புகளுடன் இணைக்கப்படும்.',
  'settings.general.import-settings-importing': 'இறக்குமதி செய்கிறது...',
  'settings.general.reset-to-defaults': 'இயல்புநிலைக்கு மீட்டமைக்கவும்',
  'settings.general.reset-to-defaults-desc':
    'அனைத்து செருகுநிரல் அமைப்புகளையும் அவற்றின் இயல்புநிலை மதிப்புகளுக்கு மீட்டமைக்கவும். காப்புப்பிரதி தானாகவே உருவாக்கப்படும்.',
  'settings.general.reset-to-defaults-warning':
    'எச்சரிக்கை: இது அனைத்து தனிப்பயன் விருப்பங்கள், கணக்கு அமைப்புகள் மற்றும் தளவமைப்புகளை அகற்றும்.',
  'settings.general.reset-to-defaults-resetting': 'மீட்டமைக்கிறது...',
  'settings.general.enabled': 'செயல்படுத்தப்பட்டது',
  'settings.general.disabled': 'முடக்கப்பட்டது',
  'settings.customization.title': 'தனிப்பயனாக்கம்',
  'settings.customization.description':
    'Journalit செருகுநிரலின் விருப்பங்கள், தோற்றம் மற்றும் நடத்தை ஆகியவற்றைத் தனிப்பயனாக்குங்கள்.',
  'settings.customization.trade-form-layout.description':
    'டிரேட் படிவத்தில் எந்த புலங்கள் மற்றும் பிரிவுகள் தோன்றும் என்பதைத் தேர்ந்தெடுக்கவும்.',
  'settings.customization.trade-form-layout.button':
    'தளவமைப்பைத் தனிப்பயனாக்கு',
  'settings.customization.tickers-symbols': 'டிக்கர்கள்/சின்னங்கள்',
  'settings.customization.symbol-mappings': 'சின்ன மேப்பிங்ஸ்',

  'settings.customization.setups': 'Setups',
  'settings.customization.mistakes': 'தவறுகள்',
  'settings.customization.tags': 'குறிச்சொற்கள்',
  'settings.customization.events': 'நிகழ்வுகள்',

  'settings.customization.options.confirm.update-notes':
    'சரி (புதுப்பிப்பு குறிப்புகள்)',
  'settings.customization.options.confirm.save-name':
    'பெயரை மட்டும் சேமிக்கவும்',
  'settings.customization.options.confirm.cancel': 'செயலை ரத்துசெய்',
  'settings.customization.options.type.tickers': 'டிக்கர்ஸ்',
  'settings.customization.options.type.accounts': 'கணக்குகள்',
  'settings.customization.options.type.account-types': 'கணக்கு வகைகள்',
  'settings.customization.options.type.setups': 'Setups',
  'settings.customization.options.type.mistakes': 'தவறுகள்',
  'settings.customization.options.type.tags': 'குறிச்சொற்கள்',
  'settings.customization.options.type.events': 'நிகழ்வுகள்',
  'settings.customization.options.asset-type.cfd': 'CFD',
  'settings.customization.options.notice.empty-name':
    'விருப்பத்தின் பெயர் காலியாக இருக்கக்கூடாது',
  'settings.customization.options.notice.invalid-ticker':
    'தவறான டிக்கர் வடிவம். எழுத்துக்கள், எண்கள் மற்றும் காலங்கள் மட்டுமே அனுமதிக்கப்படும்.',
  'settings.customization.options.notice.added':
    '{type}க்கு "{newValue}" விருப்பம் சேர்க்கப்பட்டது',
  'settings.customization.options.notice.duplicate':
    'நகல் விருப்பம்: {newValue} ஏற்கனவே உள்ளது',
  'settings.customization.options.notice.asset-type-required':
    'இன்ஸ்ட்ருமென்ட்களுக்கு சொத்து வகை தேவை',
  'settings.customization.options.notice.updated-with-notes':
    '"{oldValue}" இலிருந்து "{newValue}" க்கு மேம்படுத்தப்பட்ட விருப்பம் மற்றும் புதுப்பிக்கப்பட்ட {count} குறிப்புகள்',
  'settings.customization.options.notice.updated':
    '"{oldValue}" இலிருந்து "{newValue}" க்கு விருப்பம் புதுப்பிக்கப்பட்டது',
  'settings.customization.options.confirm.rename-message':
    'அதற்குப் பதிலாக "{newValue}" ஐப் பயன்படுத்த, "{oldValue}" ஐப் பயன்படுத்தும் எல்லா குறிப்புகளையும் புதுப்பிக்க விரும்புகிறீர்களா?\n\nஇது எல்லா குறிப்புகளையும் தேடி, அது எங்கு கிடைத்தாலும் விருப்ப மதிப்பைப் புதுப்பிக்கும்.',
  'settings.customization.options.notice.cannot-delete-archived':
    '"காப்பகப்படுத்தப்பட்ட" கணக்கு வகையை நீக்க முடியாது - இது கணக்குகளை காப்பகப்படுத்துவதற்கு ஒதுக்கப்பட்டுள்ளது',
  'settings.customization.options.confirm.remove-message':
    '"{option}" ஐ நிச்சயமாக அகற்ற விரும்புகிறீர்களா? இதை செயல்தவிர்க்க முடியாது.',
  'settings.customization.options.confirm.remove-tag-message':
    '"{option}" என்ற உலகளாவிய குறிச்சொல்லை நீக்கவா? இது ஒவ்வொரு Journalit டிரேட் மற்றும் Setup குறிப்பிலிருந்தும் அதை நீக்குகிறது.',
  'settings.customization.options.notice.removed':
    'அகற்றப்பட்ட விருப்பம் "{option}"',
  'settings.customization.options.notice.remove-failed':
    'விருப்பத்தை அகற்ற முடியவில்லை',
  'settings.customization.options.confirm.reset-message':
    'எல்லா {type} ஐயும் இயல்புநிலை விருப்பங்களுக்கு மீட்டமைக்க விரும்புகிறீர்களா? இதை செயல்தவிர்க்க முடியாது.',
  'settings.customization.options.confirm.reset-tag-message':
    'உலகளாவிய குறிச்சொல் பட்டியல் மற்றும் வண்ணங்களை அவற்றின் இயல்புநிலைகளுக்கு மீட்டமைக்கவா? டிரேட் மற்றும் Setup குறிப்புகளுக்கு ஏற்கனவே ஒதுக்கப்பட்ட குறிச்சொற்கள் அந்த குறிப்புகளில் இருக்கும்.',
  'settings.customization.options.notice.reset-success':
    'இயல்புநிலை விருப்பங்களுக்கு {type} ஐ மீட்டமைக்கவும்',
  'settings.customization.options.notice.no-options-to-reset':
    'இயல்புநிலை {type} விருப்பங்கள் ஏற்கனவே பயன்பாட்டில் உள்ளன',
  'settings.customization.options.notice.mapping-symbols-required':
    'இரண்டு சின்னங்களும் தேவை',
  'settings.customization.options.notice.mapping-added':
    'மேப்பிங் சேர்க்கப்பட்டது: {imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    'மேப்பிங்கைச் சேர்ப்பதில் தோல்வி',
  'settings.customization.options.notice.mapping-deleted':
    'மேப்பிங் நீக்கப்பட்டது: {symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    'மேப்பிங்கை நீக்க முடியவில்லை',
  'settings.customization.options.empty-state':
    'தனிப்பயன் {type} எதுவும் இதுவரை சேர்க்கப்படவில்லை.',
  'settings.customization.options.label.save-changes':
    'மாற்றங்களைச் சேமிக்கவும்',
  'settings.customization.options.label.cancel-editing':
    'திருத்துவதை ரத்துசெய்',
  'settings.customization.options.label.edit-option': 'திருத்து {option}',
  'settings.customization.options.label.remove-option': 'அகற்று {option}',
  'settings.customization.options.placeholder.select-asset':
    'சொத்து வகையைத் தேர்ந்தெடுக்கவும்...',
  'settings.customization.options.field.pip-size': 'பிப் அளவு',
  'settings.customization.options.field.priority': 'முன்னுரிமை:',
  'settings.customization.options.field.default-event-notes':
    'இயல்புநிலை நிகழ்வு குறிப்புகள்:',
  'settings.customization.options.placeholder.default-event-notes':
    'இந்த நிகழ்வு தேர்ந்தெடுக்கப்படும் போது தானாக நிரப்ப வேண்டிய குறிப்புகள்',
  'settings.customization.options.aria.confirm-add':
    'சேர்ப்பதை உறுதிப்படுத்தவும் {type}',
  'settings.customization.options.label.locked': 'பூட்டப்பட்டது',
  'settings.customization.options.label.archived-reserved':
    'காப்பகப்படுத்தப்பட்டது (ஒதுக்கப்பட்டது)',
  'settings.customization.options.aria.reset-all':
    'தனிப்பயன் {type} அனைத்தையும் அகற்று',
  'settings.customization.options.button.reset-all':
    'அனைத்தையும் மீட்டமை {type}',
  'settings.customization.options.placeholder.new-name': 'புதிய {type} பெயர்',
  'settings.customization.options.placeholder.dollar-per-point': '$/புள்ளி',
  'settings.customization.options.placeholder.tick-size': 'டிக் அளவு',
  'settings.customization.options.placeholder.tick-value': 'டிக் மதிப்பு',
  'settings.customization.options.placeholder.lot-size': 'Lot அளவு',
  'settings.customization.options.placeholder.pip-value': 'பிப் மதிப்பு',
  'settings.customization.options.placeholder.pip-size': 'பிப் அளவு',
  'settings.customization.options.field.optional': '(விரும்பினால்)',
  'settings.customization.options.mapping.description':
    'தானியங்கு spec தேடலுக்கு contract-specific சின்னங்களை (எ.கா., NQZ5) அடிப்படை சின்னங்களுக்கு (எ.கா., NQ) மேப் செய்யும்',
  'settings.customization.options.mapping.auto-detected':
    'தானாக கண்டறியப்பட்டது',
  'settings.customization.options.mapping.manual': 'Manual',
  'settings.customization.options.mapping.created-at':
    'உருவாக்கப்பட்டது {date}',
  'settings.customization.options.mapping.no-mappings':
    'இதுவரை குறியீடு மேப்பிங் இல்லை. ஒப்பந்த சின்னங்கள் கண்டறியப்படும்போது CSV இறக்குமதியின் போது மேப்பிங் தானாகவே உருவாக்கப்படும்.',
  'settings.customization.options.mapping.placeholder-imported':
    'இறக்குமதி செய்யப்பட்ட சின்னம் (எ.கா., NQZ5)',
  'settings.customization.options.mapping.placeholder-base':
    'அடிப்படை சின்னம் (எ.கா., NQ)',
  'settings.customization.options.mapping.button-add':
    'மேப்பிங்கைச் சேர்க்கவும்',
  'settings.customization.options.placeholder.add-new': 'புதிய {type} சேர்',
  'settings.customization.options.aria.delete-mapping': 'மேப்பிங்கை நீக்கு',
  'settings.customization.options.instrument.specs-futures':
    '${dollar}/pt, {tick} டிக், ${value} டிக் வால்',
  'settings.customization.options.instrument.specs-forex':
    '{lot} lot, ${pip} pip Val, {size} pip அளவு',
  'settings.customization.options.instrument.built-in': '(உள்ளமைக்கப்பட்ட)',
  'settings.customization.options.instrument.mapped-to':
    '{base}-க்கு மேப் செய்யப்பட்டது ({base}-இன் விவரக்குறிப்புகளைப் பயன்படுத்துகிறது)',
  'settings.customization.options.instrument.no-specs':
    '(விவரங்கள் அமைக்கப்படவில்லை)',
  'settings.customization.options.commission.costs': 'செலவுகள்',
  'settings.customization.options.commission.add-rule':
    '+ செலவு விதியைச் சேர்க்கவும்',
  'settings.customization.options.commission.applies-to': 'க்கு பொருந்தும்',
  'settings.customization.options.commission.method': 'முறை',
  'settings.customization.options.commission.entry': 'நுழைவு',
  'settings.customization.options.commission.exit': 'வெளியேற்றம்',
  'settings.customization.options.commission.round-trip': 'சுற்று பயணம்',
  'settings.customization.options.commission.actions': 'செயல்கள்',
  'settings.customization.options.commission.all-accounts':
    'அனைத்து கணக்குகளும்',
  'settings.customization.options.commission.per-side': 'ஒவ்வொரு பக்கமும்',
  'settings.customization.options.commission.remove-rule':
    'செலவு விதியை அகற்று',

  'button.remove': 'அகற்று',

  'button.move-up': 'மேலே நகர்த்து',
  'button.move-down': 'கீழே நகர்த்து',

  'settings.customization.trade-fields': 'தனிப்பயன் டிரேட் புலங்கள்',
  'settings.customization.custom-fields.description':
    'ஒவ்வொரு வர்த்தகத்திலும் உங்கள் சொந்த புலங்களைச் சேர்க்கவும், எடுத்துக்காட்டாக அமர்வு, கால அளவு அல்லது செட்அப் தரம். இவை படிவத்தின் மேம்பட்ட தாவலில் தோன்றி, குறிப்பின் frontmatter இல் சேமிக்கப்பட்டு, டிரேட் லாக்கில் வரிசைப்படுத்தக்கூடிய மற்றும் வடிகட்டக்கூடிய நெடுவரிசைகளாக மாறும்.',
  'settings.customization.custom-fields.title': 'தனிப்பயன் புலங்கள் ({count})',
  'settings.customization.custom-fields.manage-desc':
    'உங்கள் தனிப்பயன் டிரேட் படிவ புலங்களை நிர்வகிக்கவும்',
  'settings.customization.custom-fields.type-dropdown': 'கீழிறக்கம்',
  'settings.customization.custom-fields.type-multiselect': 'பல தேர்வு',
  'settings.customization.custom-fields.type-suffix': 'புலம்',
  'settings.customization.custom-fields.option-count.one': '{count} விருப்பம்',
  'settings.customization.custom-fields.option-count.few':
    '{count} விருப்பங்கள்',
  'settings.customization.custom-fields.option-count.many':
    '{count} விருப்பங்கள்',
  'settings.customization.custom-fields.option-count.other':
    '{count} விருப்பங்கள்',
  'settings.customization.custom-fields.no-fields':
    'தனிப்பயன் புலங்கள் எதுவும் இன்னும் வரையறுக்கப்படவில்லை',
  'settings.customization.custom-fields.no-fields-desc':
    'பிறகு நீங்கள் உண்மையிலேயே மதிப்பாய்வு செய்யப்போகும் ஒரு புலத்துடன் தொடங்குங்கள், எடுத்துக்காட்டாக நீங்கள் வர்த்தகம் செய்த அமர்வு அல்லது செட்அப் உங்கள் திட்டத்துடன் எவ்வளவு பொருந்தியது.',
  'settings.customization.custom-fields.add-new': 'புதிய புலத்தைச் சேர்க்கவும்',

  'settings.customization.custom-fields.edit-field-with-name':
    'திருத்து “{fieldLabel}”',
  'settings.customization.custom-fields.configure-desc':
    'உங்கள் தனிப்பயன் புல அமைப்புகளை கீழே உள்ளமைக்கவும்',
  'settings.customization.custom-fields.actions': 'செயல்கள்',
  'settings.customization.custom-fields.actions-desc':
    'உங்கள் தனிப்பயன் புலங்களை நிர்வகிக்கவும்',
  'settings.customization.custom-fields.add-button':
    'தனிப்பயன் புலத்தைச் சேர்க்கவும்',
  'settings.customization.custom-fields.delete-all-button':
    'அனைத்து புலங்களையும் நீக்கு',
  'settings.customization.custom-fields.editor.title': 'புல கட்டமைப்பு',
  'settings.customization.custom-fields.editor.label': 'புல லேபிள்',
  'settings.customization.custom-fields.editor.label-desc':
    'இந்த புலத்திற்கான காட்சி பெயர்',
  'settings.customization.custom-fields.editor.label-placeholder':
    'புல லேபிளை உள்ளிடவும்',
  'settings.customization.custom-fields.editor.key': 'முன் பொருள் விசை',
  'settings.customization.custom-fields.editor.key-desc':
    'இந்த விசை உங்கள் டிரேட் கோப்புகளில் தோன்றும்:',
  'settings.customization.custom-fields.editor.key-placeholder': 'புலம்_பெயர்',
  'settings.customization.custom-fields.editor.key-reserved':
    '⚠️ ஒதுக்கப்பட்ட புலத்தின் பெயர்',
  'settings.customization.custom-fields.editor.type': 'புல வகை',
  'settings.customization.custom-fields.editor.type-desc':
    'உள்ளீட்டு புலத்தின் வகை',
  'settings.customization.custom-fields.editor.placeholder': 'ஒதுக்கிட உரை',
  'settings.customization.custom-fields.editor.placeholder-desc':
    'காலியான புலத்தில் காட்டப்படும் விருப்ப ஒதுக்கிட உரை',
  'settings.customization.custom-fields.editor.placeholder-input':
    'ஒதுக்கிட உரையை உள்ளிடவும்',
  'settings.customization.custom-fields.editor.trade-log': 'டிரேட் பதிவு',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'டிரேட் பதிவு நெடுவரிசையாகச் சேர்க்கும்போது இந்தப் புலம் எவ்வாறு தோன்றும் என்பதைக் கட்டுப்படுத்தவும்',
  'settings.customization.custom-fields.editor.column-label':
    'டிரேட் பதிவு நெடுவரிசை லேபிள்',
  'settings.customization.custom-fields.editor.column-label-desc':
    'டிரேட் பதிவு தலைப்பில் மட்டுமே பயன்படுத்தப்படும் விருப்பமான குறுகிய லேபிள்',
  'settings.customization.custom-fields.editor.column-label-placeholder':
    'இயல்பாக புல லேபிளைப் பயன்படுத்தவும்',
  'settings.customization.custom-fields.editor.display-as-currency':
    'நாணயமாக காட்சி',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'டிரேட் பதிவில் மட்டும் இந்த எண் புலத்தை நாணய மதிப்பாக வடிவமைக்கவும்',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'கீழ்தோன்றும் வரிசை முறை',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'இயல்பாகவே முடக்கப்பட்டது. இந்த கீழ்தோன்றும் அர்த்தமுள்ள வரிசையைக் கொண்டிருக்கும் போது மட்டுமே வரிசைப்படுத்தலை இயக்கவும்.',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'முடக்கப்பட்டது',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'அகரவரிசைப்படி',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'எண்ணியல்',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'கட்டமைக்கப்பட்ட விருப்ப வரிசை',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'சுருக்கப்பட்ட காட்சி',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'டிரேட் பதிவு விரிவாக்கப்பட்ட பயன்முறை முடக்கத்தில் இருக்கும் போது, ​​மல்டிசெலக்ட் மதிப்புகள் எவ்வாறு வழங்கப்படுகின்றன என்பதைத் தேர்வுசெய்யவும்',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'கவுண்ட் பேட்ஜ்',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'மதிப்பு பட்டியல்',
  'settings.customization.custom-fields.editor.validation': 'சரிபார்த்தல்',
  'settings.customization.custom-fields.editor.validation-desc':
    'புல சரிபார்ப்பு விதிகள்',
  'settings.customization.custom-fields.editor.validation.required':
    'தேவையான புலம்',
  'settings.customization.custom-fields.editor.validation.required-desc':
    'இந்த புலத்தை கட்டாயமாக்குங்கள்',
  'settings.customization.custom-fields.editor.validation.min-length':
    'குறைந்தபட்ச நீளம்',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    'எழுத்துகளின் குறைந்தபட்ச எண்ணிக்கை',
  'settings.customization.custom-fields.editor.validation.no-min':
    'குறைந்தபட்சம் இல்லை',
  'settings.customization.custom-fields.editor.validation.max-length':
    'அதிகபட்ச நீளம்',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    'எழுத்துகளின் அதிகபட்ச எண்ணிக்கை',
  'settings.customization.custom-fields.editor.validation.no-max':
    'அதிகபட்சம் இல்லை',
  'settings.customization.custom-fields.editor.validation.min-value':
    'குறைந்தபட்ச மதிப்பு',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    'அனுமதிக்கப்பட்ட குறைந்தபட்ச எண்',
  'settings.customization.custom-fields.editor.validation.max-value':
    'அதிகபட்ச மதிப்பு',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    'அனுமதிக்கப்பட்ட அதிகபட்ச எண்',
  'settings.customization.custom-fields.editor.options': 'விருப்பங்கள்',
  'settings.customization.custom-fields.editor.options-desc':
    'இந்தப் புலத்திற்கான தேர்வுகள்',
  'settings.customization.custom-fields.editor.add-option':
    'புதிய விருப்பத்தைச் சேர்க்கவும்',
  'settings.customization.custom-fields.editor.add-option-desc':
    'புதிய தேர்வை உள்ளிடவும்',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    'புதிய விருப்பத்தை உள்ளிடவும்',
  'settings.customization.custom-fields.editor.allow-create':
    'புதிய விருப்பங்களை உருவாக்க அனுமதிக்கவும்',
  'settings.customization.custom-fields.editor.allow-create-desc':
    'டிரேட் படிவங்களில் இந்தப் புலத்தைப் பயன்படுத்தும்போது பயனர்கள் புதிய விருப்பங்களை உருவாக்கலாம்',
  'settings.customization.custom-fields.editor.save': 'களத்தைச் சேமி',
  'settings.customization.custom-fields.editor.delete': 'புலத்தை நீக்கு',
  'settings.customization.custom-fields.type.text': 'உரை',
  'settings.customization.custom-fields.type.number': 'எண்',
  'settings.customization.custom-fields.type.date': 'தேதி',
  'settings.customization.custom-fields.type.datetime': 'தேதி & நேரம்',
  'settings.customization.custom-fields.type.time': 'நேரம்',
  'settings.customization.custom-fields.error.cannot-save':
    'புலத்தைச் சேமிக்க முடியவில்லை: {error}',
  'settings.customization.custom-fields.error.duplicate-key':
    'இந்த frontmatter விசையுடன் ஒரு புலம் ஏற்கனவே உள்ளது',
  'settings.customization.custom-fields.error.save-failed':
    'புலத்தைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'settings.customization.custom-fields.notice.import-summary':
    'மொத்தம் {totalCount} இல் {validCount} செல்லுபடியாகும் புலங்கள் இறக்குமதி செய்யப்பட்டன',
  'settings.customization.custom-fields.delete.confirm-message':
    '"{fieldLabel}" என்ற தனிப்பயன் புலத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'settings.customization.custom-fields.delete.cannot-undo':
    'இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.',
  'settings.customization.custom-fields.reset.confirm-message':
    'அனைத்து தனிப்பயன் புலங்களையும் நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'settings.customization.custom-fields.saved-options.title':
    'சேமிக்கப்பட்ட தனிப்பயன் விருப்பங்கள்',
  'settings.customization.custom-fields.saved-options.description':
    'தனிப்பயன் புலங்களுக்காக பயனர்கள் உருவாக்கிய விருப்பங்களை நிர்வகிக்கவும்',
  'settings.customization.custom-fields.saved-options.delete-error':
    'விருப்பத்தை நீக்குவதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.',
  'settings.customization.custom-fields.saved-options.clear-error':
    'விருப்பங்களை அழிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'settings.customization.custom-fields.option.delete-confirm':
    '"{optionName}" என்ற விருப்பத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'settings.customization.custom-fields.option.clear-confirm':
    '"{fieldLabel}" க்காக சேமிக்கப்பட்ட அனைத்து விருப்பங்களையும் நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'settings.customization.review-fields': 'தனிப்பயன் மதிப்பாய்வு புலங்கள்',
  'settings.customization.review-fields.description':
    'மதிப்பாய்வு குறிப்புகளுக்கு தனிப்பயன் புலங்களை உருவாக்கவும். இந்த புலங்கள் மதிப்பாய்வு கஸ்டம்ஃபீல்டுகளின் கீழ் சேமிக்கப்பட்டு, பின்னர் மாதாந்திர, வாராந்திர மற்றும் தினசரி மதிப்பாய்வுகள் முழுவதும் பெறப்படும்.',
  'settings.customization.review-fields.title':
    'மதிப்பாய்வு புலங்கள் ({count})',
  'settings.customization.review-fields.manage-desc':
    'மதிப்பாய்வு குறிப்புகளுக்கு தனிப்பயன் புலங்களை நிர்வகிக்கவும்',
  'settings.customization.review-fields.no-fields':
    'தனிப்பயன் மதிப்பாய்வு புலங்கள் எதுவும் இதுவரை வரையறுக்கப்படவில்லை',
  'settings.customization.review-fields.no-fields-desc':
    'மதிப்பாய்வு புலங்கள் மதிப்பாய்வு-குறிப்பு விட்ஜெட்களால் பயன்படுத்தப்படும், மேலும் அவை டிரேட் படிவத்திலோ டிரேட் பதிவிலோ தோன்றாது.',
  'settings.customization.review-fields.add-button':
    'மதிப்பாய்வு புலத்தைச் சேர்க்கவும்',
  'settings.customization.review-fields.delete-all-button':
    'அனைத்து மதிப்பாய்வு புலங்களையும் நீக்கு',
  'settings.customization.review-fields.add-new':
    'புதிய மதிப்பாய்வு புலத்தைச் சேர்க்கவும்',
  'settings.customization.review-fields.edit-field-with-name':
    'திருத்து “{fieldLabel}”',
  'settings.customization.review-fields.configure-desc':
    'உங்கள் மதிப்பாய்வு புல அமைப்புகளை கீழே உள்ளமைக்கவும்',
  'settings.customization.review-fields.actions-desc':
    'உங்கள் தனிப்பயன் மதிப்பாய்வு புலங்களை நிர்வகிக்கவும்',
  'settings.customization.review-fields.default-label':
    'புதிய மதிப்பாய்வுப் புலம்',
  'settings.customization.review-fields.unknown-field':
    'அறியப்படாத மதிப்பாய்வு புலம்',
  'settings.customization.review-fields.field-summary':
    'வகை: {type} • மதிப்பாய்வுகள்: {reviews}',
  'settings.customization.review-fields.error.save-failed':
    'மதிப்பாய்வு புலத்தைச் சேமிப்பதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.',
  'settings.customization.review-fields.delete.confirm-message':
    'தனிப்பயன் மதிப்பாய்வு புலம் "{fieldLabel}" ஐ நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'settings.customization.review-fields.reset.confirm-message':
    'அனைத்து தனிப்பயன் மதிப்பாய்வு புலங்களையும் நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'settings.customization.review-fields.editor.title':
    'புல கட்டமைப்பை மதிப்பாய்வு செய்யவும்',
  'settings.customization.review-fields.editor.label-desc':
    'இந்த மதிப்பாய்வு புலத்திற்கான காட்சி பெயர்',
  'settings.customization.review-fields.editor.label-placeholder':
    'மதிப்பாய்வு புல லேபிளை உள்ளிடவும்',
  'settings.customization.review-fields.editor.key':
    'மதிப்பாய்வு புலத் திறவுகோல்',
  'settings.customization.review-fields.editor.key-desc':
    'இந்த விசை மதிப்பாய்வு குறிப்பில் frontmatter இல் சேமிக்கப்படும்',
  'settings.customization.review-fields.editor.type-desc':
    'மதிப்பாய்வு புல உள்ளீடு வகை',
  'settings.customization.review-fields.editor.description': 'விளக்கம்',
  'settings.customization.review-fields.editor.description-desc':
    'இந்த மதிப்பாய்வு புலத்திற்கான விருப்ப உதவி உரை',
  'settings.customization.review-fields.editor.description-placeholder':
    'இந்த புலத்தை எவ்வாறு பயன்படுத்த வேண்டும் என்பதை விளக்குங்கள்',
  'settings.customization.review-fields.editor.placeholder-desc':
    'உள்ளூர் மதிப்பாய்வு மதிப்பை உள்ளிடும்போது காட்டப்படும் விருப்ப ஒதுக்கிட உரை',
  'settings.customization.review-fields.editor.placeholder-input':
    'மதிப்பாய்வு புல ஒதுக்கிடத்தை உள்ளிடவும்',

  'settings.customization.review-fields.editor.group': 'களக் குழு',
  'settings.customization.review-fields.editor.group-desc':
    'இந்த புலம் சார்ந்த மதிப்பாய்வு புலக் குழுவைத் தேர்ந்தெடுக்கவும்.',
  'settings.customization.review-fields.groups.add-button':
    'குழுவைச் சேர்க்கவும்',
  'settings.customization.review-fields.groups.default-name': 'புதிய குழு',
  'settings.customization.review-fields.groups.untitled': 'பெயரிடப்படாத குழு',
  'settings.customization.review-fields.groups.ungrouped': 'குழுவாக்கப்படாதது',
  'settings.customization.review-fields.groups.field-count': '{count} புலங்கள்',
  'settings.customization.review-fields.groups.empty':
    'இந்தக் குழுவில் இதுவரை எந்தப் புலங்களும் இல்லை.',
  'settings.customization.review-fields.groups.rename-prompt': 'குழுவின் பெயர்',
  'settings.customization.review-fields.groups.delete-message':
    '"{groupName}" மதிப்பாய்வு புலக் குழுவை நீக்கவா?',
  'settings.customization.review-fields.groups.delete-note':
    'இந்தக் குழுவில் உள்ள புலங்கள் குழுவிலகப்படும். அவர்களின் சேமித்த மதிப்பாய்வு மதிப்புகள் நீக்கப்படாது.',
  'settings.customization.review-fields.groups.error.duplicate':
    'இந்தப் பெயரைக் கொண்ட ஒரு மதிப்பாய்வு புலக் குழு ஏற்கனவே உள்ளது.',
  'settings.customization.review-fields.groups.error.save-failed':
    'மதிப்பாய்வு புலக் குழுவைச் சேமிக்க முடியவில்லை.',
  'settings.customization.review-fields.editor.compact': 'சிறிய காட்சி',
  'settings.customization.review-fields.editor.compact-desc':
    'மதிப்பாய்வு விட்ஜெட்களில் இந்தப் புலம் தோன்றும்போது சிறிய ரெண்டரிங்கை விரும்பவும்',
  'settings.customization.review-fields.editor.appears-on': 'அன்று தோன்றும்',
  'settings.customization.review-fields.editor.appears-on-desc':
    'இந்தப் புலத்தைக் காட்டக்கூடிய குறிப்பு வகைகளை மதிப்பாய்வு செய்யவும்',
  'settings.customization.review-fields.editor.editable-on':
    'திருத்தக்கூடியது ஆன்',
  'settings.customization.review-fields.editor.editable-on-desc':
    'பயனர்கள் உள்ளூர் மதிப்பை உள்ளிடக்கூடிய குறிப்பு வகைகளை மதிப்பாய்வு செய்யவும்',
  'settings.customization.review-fields.editor.inherit-to': 'பரம்பரையாக வந்தது',
  'settings.customization.review-fields.editor.inherit-to-desc':
    'இந்த புலத்தில் இருந்து பெறப்பட்ட மதிப்புகளைக் காட்டக்கூடிய குறைந்த மதிப்பாய்வு குறிப்பு வகைகள்',
  'settings.customization.review-fields.editor.inheritance': 'பரம்பரையை இயக்கு',
  'settings.customization.review-fields.editor.inheritance-desc':
    'இந்த புலத்தை அதிக நேர மதிப்பாய்வு குறிப்புகளில் இருந்து படிக்க அனுமதிக்கவும்',
  'settings.customization.review-fields.editor.inheritance-mode':
    'பரம்பரை முறை',
  'settings.customization.review-fields.editor.inheritance-mode-desc':
    'child மதிப்பாய்வுகள் inherited மதிப்புகள், உள்ளூர் மதிப்புகள் அல்லது இரண்டையும் காட்டுகின்றனவா என்பதைக் கட்டுப்படுத்துகிறது',
  'settings.customization.review-fields.editor.sources': 'பரம்பரை ஆதாரங்கள்',
  'settings.customization.review-fields.editor.sources-desc':
    'அதிக காலக்கெடு மதிப்பாய்வு வகைகள் இந்த புலத்தில் இருந்து பெறலாம்',

  'settings.customization.review-fields.editor.options-desc':
    'இந்த மதிப்பாய்வுப் புலத்திற்கான தேர்வுகள் உள்ளன',
  'settings.customization.review-fields.editor.allow-create-desc':
    'மதிப்பாய்வுக் குறிப்புகளில் இந்தப் புலத்தைப் பயன்படுத்தும் போது பயனர்கள் புதிய விருப்பங்களை உருவாக்கலாம்',
  'settings.customization.review-fields.editor.save':
    'மதிப்பாய்வு புலத்தை சேமிக்கவும்',
  'settings.customization.review-fields.editor.delete':
    'மதிப்பாய்வு புலத்தை நீக்கு',
  'settings.customization.review-fields.inheritance-mode.inherit-only':
    'பரம்பரை மட்டுமே',
  'settings.customization.review-fields.inheritance-mode.local-only':
    'உள்ளூர் மட்டும்',
  'settings.customization.review-fields.inheritance-mode.inherit-and-local':
    'பரம்பரை மற்றும் உள்ளூர்',
  'onboarding.welcome.title': 'Journalitக்கு வரவேற்கிறோம்',
  'onboarding.welcome.subtitle':
    'உங்கள் சாதனத்திலேயே இருக்கும் வர்த்தக ஜர்னல்.',
  'onboarding.welcome.cta': 'என் ஜர்னலை அமைக்கவும்',
  'onboarding.welcome.chart.week': 'வாரம் {count}',
  'onboarding.view.title': 'Journalit ஆன்போர்டிங்',

  'onboarding.common.continue': 'தொடர்',
  'onboarding.common.close': 'மூடு',

  'onboarding.features.badge.pro': 'PRO',

  'onboarding.features.graphic.syncing': 'டிரேட்களை ஒத்திசைக்கிறது...',
  'onboarding.features.graphic.complete': 'ஒத்திசைவு முடிந்தது',
  'onboarding.features.graphic.direction.long': 'LONG',
  'onboarding.features.graphic.direction.short': 'SHORT',
  'onboarding.features.graphic.status.win': 'WIN',
  'onboarding.features.graphic.status.loss': 'LOSS',
  'onboarding.activation.title': 'Journalit இல் உள்நுழைக',

  'onboarding.activation.status.initializing':
    'உங்கள் அங்கீகாரக் குறியீட்டை உருவாக்குகிறது...',

  'onboarding.activation.status.error': 'உள்நுழைவு தோல்வியடைந்தது',
  'onboarding.activation.error.init':
    'உள்நுழைவைத் தொடங்க முடியவில்லை. உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'onboarding.activation.error.denied':
    'உள்நுழைவு மறுக்கப்பட்டது. அமைப்புகளில் நீங்கள் பின்னர் உள்நுழையலாம்.',
  'onboarding.activation.error.expired':
    'அங்கீகாரக் குறியீடு காலாவதியானது. உள்நுழைவு செயல்முறையை மீண்டும் தொடங்கவும்.',
  'onboarding.activation.error.generic':
    'ஏதோ தவறாகிவிட்டது. மீண்டும் முயற்சிக்கவும்.',
  'onboarding.activation.error.save':
    'உள்நுழைவு வெற்றியடைந்தது ஆனால் சேமிக்க முடியவில்லை. செருகுநிரலை மறுதொடக்கம் செய்து மீண்டும் முயற்சிக்கவும்.',
  'onboarding.activation.error.connection':
    'இணைப்பு துண்டிக்கப்பட்டது. உங்கள் இணையத்தைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'onboarding.activation.notice.invalid-url':
    'தவறான செயல்படுத்தல் URL. ஆதரவைத் தொடர்பு கொள்ளவும்.',

  'onboarding.activation.notice.popup-blocked-manual':
    'இந்த URLஐ உங்கள் உலாவியில் திறக்கவும்: {url}',
  'onboarding.activation.notice.copy-code-failed':
    'குறியீட்டை நகலெடுக்க முடியவில்லை. கைமுறையாக நகலெடுக்கவும்.',
  'onboarding.activation.label.code': 'உங்கள் அங்கீகார குறியீடு',
  'onboarding.activation.button.copy': 'குறியீட்டை நகலெடுக்கவும்',
  'onboarding.activation.button.copy-link': 'இணைப்பை நகலெடுக்கவும்',
  'onboarding.activation.button.copied': 'நகலெடுக்கப்பட்டது!',
  'onboarding.activation.step.open-browser':
    'உங்கள் உலாவியைத் திறக்க கீழே கிளிக் செய்யவும்',
  'onboarding.activation.step.enter-code':
    'உங்கள் அங்கீகாரக் குறியீட்டை உள்ளிடவும்',
  'onboarding.activation.step.complete-signin': 'உள்நுழைவை முடிக்கவும்',
  'onboarding.activation.step.return-here': 'தானாக முடிக்க இங்கு திரும்பவும்',
  'onboarding.activation.button.open-browser': 'உள்நுழைய உலாவியைத் திறக்கவும்',
  'onboarding.activation.waiting.title': 'உள்நுழைவுக்காக காத்திருக்கிறது...',
  'onboarding.activation.waiting.hint':
    'இது பொதுவாக ஒரு நிமிடத்திற்கும் குறைவாகவே ஆகும்',
  'onboarding.activation.success.title': 'உள்நுழைவு முடிந்தது!',

  'onboarding.notice.complete-failed':
    'ஆன்போர்டிங் நிறைவைச் சேமிக்க முடியவில்லை. பிறகு முயற்சிக்கவும்.',
  'onboarding.notice.completed':
    'உங்கள் ஜர்னல் தயாராக உள்ளது. ஆன்போர்டிங் நிறைவடைந்தது.',
  'onboarding.familiarity.kicker': 'ஒரு சிறிய கேள்வி',
  'onboarding.familiarity.title':
    'இதற்கு முன் Obsidian பயன்படுத்தியிருக்கிறீர்களா?',
  'onboarding.familiarity.subtitle':
    'Journalit Obsidian-க்குள் இயங்குகிறது. இது உங்களுக்குப் புதிதென்றால், தேவையானதை மட்டும் காட்டுவோம்.',
  'onboarding.familiarity.option.yes.label': 'ஆம், எனக்குத் தெரியும்',
  'onboarding.familiarity.option.yes.description': 'அறிமுகத்தைத் தவிர்க்கவும்.',
  'onboarding.familiarity.option.no.label': 'இல்லை, Obsidian எனக்குப் புதிது',
  'onboarding.familiarity.option.no.description':
    'ஒரே ஒரு சிறிய திரை, சுற்றுலா இல்லை.',
  'onboarding.orientation.kicker': 'Obsidian-க்குப் புதியவர்',
  'onboarding.orientation.title': 'தெரிந்துகொள்ள வேண்டிய நான்கு விஷயங்கள்',
  'onboarding.orientation.subtitle': 'Journalit பயன்படுத்த இது மட்டுமே போதும்.',
  'onboarding.orientation.inside.title':
    'Journalit Obsidian-க்குள் இயங்குகிறது',
  'onboarding.orientation.inside.body':
    'முதலில் Obsidian கற்க வேண்டியதில்லை. இந்தத் திரை ஒரு Journalit காட்சி.',
  'onboarding.orientation.sidebar.title':
    'பக்கப்பட்டி தான் உங்கள் வழிசெலுத்தல்',
  'onboarding.orientation.sidebar.body':
    'முகப்பு, டாஷ்போர்டு, வர்த்தகப் பதிவு, மதிப்பாய்வுகள் அனைத்தும் அங்கே உள்ளன.',
  'onboarding.orientation.sidebar.action': 'பக்கப்பட்டியைக் காட்டு',
  'onboarding.orientation.sidebar.action-mobile': 'பக்கப்பட்டியைத் திற',
  'onboarding.orientation.sidebar.hint':
    'அது இடதுபுறம் உள்ளது. இந்தத் திரை திறந்தே இருக்கும்.',
  'onboarding.orientation.sidebar.hint-mobile':
    'இது இந்தத் திரையின் மேல் திறக்கும். திரும்ப, ஸ்வைப் செய்யவும் அல்லது வெளியே தட்டவும்.',
  'onboarding.orientation.tabs.title': 'காட்சிகள் தாவல்களாகத் திறக்கும்',
  'onboarding.orientation.tabs.body':
    'இதைப் போலவே. மேலே அவற்றுக்கிடையே மாறவும்.',
  'onboarding.orientation.privacy.title':
    'உங்கள் ஜர்னல் உங்கள் சாதனத்திலேயே இருக்கும்',
  'onboarding.orientation.privacy.body':
    'குறிப்புகள், ஸ்கிரீன்ஷாட்கள், மதிப்பாய்வுகள் உங்கள் சொந்தக் கோப்புகள். இறக்குமதி அல்லது ஒத்திசைக்கும் வர்த்தகங்கள் மட்டுமே Journalit சேவையகங்கள் வழியாகச் செல்லும்.',
  'onboarding.orientation.continue': 'புரிந்தது',
  'onboarding.data-source.kicker': 'உங்கள் வர்த்தகங்கள்',
  'onboarding.data-source.title': 'உங்கள் வர்த்தகங்கள் இப்போது எங்கே உள்ளன?',
  'onboarding.data-source.subtitle':
    'உங்கள் வரலாறு உங்கள் அனுகூலத்தின் ஒரு பகுதி. அதைக் கொண்டு வாருங்கள்; புதிய வர்த்தகங்கள் சேர மாதங்கள் காத்திருக்காமல் முதல் நாளிலிருந்தே புள்ளிவிவரங்கள் அர்த்தமுள்ளதாக இருக்கும்.',
  'onboarding.data-source.option.broker.label': 'என் புரோக்கர் அல்லது தளத்தில்',
  'onboarding.data-source.option.broker.description':
    'அதை இணைக்கவும், அல்லது அதன் ஏற்றுமதியை இறக்குமதி செய்யவும்.',
  'onboarding.data-source.option.file.label': 'விரிதாள் அல்லது கோப்பில்',
  'onboarding.data-source.option.file.description':
    'CSV, Excel அல்லது HTML ஏற்றுமதிகள்.',
  'onboarding.data-source.option.fresh.label':
    'இன்னும் எங்கும் இல்லை, புதிதாகத் தொடங்குகிறேன்',
  'onboarding.data-source.option.fresh.description':
    'வர்த்தகம் செய்யும்போதே சேர்க்கவும்.',
  'onboarding.data-source.option.sample.label':
    'இன்னும் எங்கும் இல்லை, ஒரு மாதிரியைப் பார்க்கிறேன்',
  'onboarding.data-source.option.sample.description':
    'உங்கள் வர்த்தகங்களைச் சேர்க்கும் முன் தயாராக உள்ள ஒரு பதிவேட்டைப் பாருங்கள்.',
  'onboarding.broker.kicker': 'உங்கள் புரோக்கர்',
  'onboarding.broker.title': 'எந்தப் புரோக்கர் அல்லது தளம்?',
  'onboarding.awaiting.sign-in.action': 'தொடர உள்நுழையவும்',
  'onboarding.awaiting.sign-in.body':
    'முதலில் உள்நுழையவும் அல்லது இலவச Journalit கணக்கை உருவாக்கவும். பின்னர் உங்கள் வர்த்தகங்கள் உங்கள் ஜர்னலில் சேரும்.',
  'onboarding.broker.badge.sync': 'தானியங்கு ஒத்திசைவு',
  'onboarding.broker.search': 'புரோக்கர்கள் மற்றும் தளங்களைத் தேடுங்கள்',
  'onboarding.broker.subtitle':
    'உங்கள் வர்த்தகங்களைக் கொண்டுவர சிறந்த வழியைத் தேர்வு செய்வோம்.',
  'onboarding.broker.option.unlisted.label': 'பட்டியலில் இல்லை',
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title':
    'இன்னும் பட்டியலில் இல்லையா? எந்த ப்ரோக்கர் என்று சொல்லுங்கள்',
  'onboarding.broker.request.body':
    'புதிய ப்ரோக்கர்கள் கோரிக்கையின் பேரில் சேர்க்கப்படுகின்றன. எது என்று சொல்லுங்கள் (ஏற்றுமதி மாதிரி உதவும்); அதுவரை கோப்பு ஏற்றுமதியை கையால் வரைபடமாக்கலாம்.',
  'onboarding.broker.request.discord': 'Discord இல் கோருங்கள்',
  'onboarding.broker.request.continue': 'கைமுறை இறக்குமதியுடன் தொடரவும்',
  'onboarding.broker.loading':
    'ஆதரிக்கப்படும் புரோக்கர்கள் சரிபார்க்கப்படுகின்றன...',
  'onboarding.broker.offline':
    'முழுப் பட்டியலை ஏற்ற முடியவில்லை. ஆதரிக்கப்படும் புரோக்கரை இணைக்கலாம் அல்லது கோப்பை இறக்குமதி செய்யலாம்.',
  'onboarding.personalise.kicker': 'உங்கள் ஜர்னலை அமைக்கவும்',
  'onboarding.personalise.title': 'சில விரைவான தேர்வுகள்',
  'onboarding.personalise.subtitle':
    'உங்கள் பதில்களின் அடிப்படையில் Journalit ஐ தனிப்பயனாக்குகிறோம்.',
  'onboarding.personalise.style.question':
    'நீங்கள் எப்படி வர்த்தகம் செய்கிறீர்கள்?',
  'onboarding.personalise.style.scalping': 'ஒரு நாளில் பல வர்த்தகங்கள்',
  'onboarding.personalise.style.intraday':
    'ஒரு நாளில் சில வர்த்தகங்கள், இரவு வைத்திருப்பதில்லை',
  'onboarding.personalise.style.swing': 'நாட்கள் அல்லது வாரங்கள் வைத்திருப்பது',
  'onboarding.personalise.style.position':
    'வாரங்கள் அல்லது மாதங்கள் வைத்திருப்பது',
  'onboarding.personalise.account.question': 'எந்த வகைக் கணக்கு?',
  'onboarding.personalise.account.personal': 'தனிப்பட்டது',
  'onboarding.personalise.account.practice': 'டெமோ அல்லது பயிற்சி',
  'onboarding.personalise.account.prop':
    'ப்ராப்-நிறுவனச் சவால் அல்லது நிதியளிக்கப்பட்டது',
  'onboarding.personalise.asset.question':
    'நீங்கள் முக்கியமாக எதை வர்த்தகம் செய்கிறீர்கள்?',
  'onboarding.personalise.asset.stock': 'பங்குகள்',
  'onboarding.personalise.asset.futures': 'ஃபியூச்சர்ஸ்',
  'onboarding.personalise.asset.forex': 'ஃபாரெக்ஸ்',
  'onboarding.personalise.asset.crypto': 'கிரிப்டோ',
  'onboarding.personalise.asset.options': 'ஆப்ஷன்ஸ்',
  'onboarding.personalise.asset.mixed': 'கலவை',
  'onboarding.first-trade.kicker': 'கிட்டத்தட்ட முடிந்தது',
  'onboarding.first-trade.title': 'உங்கள் முதல் வர்த்தகத்தைச் சேர்க்கவும்',
  'onboarding.first-trade.subtitle':
    'உங்கள் ஜர்னல் தயார். ஒரு வர்த்தகத்தைப் பதிவு செய்யுங்கள்; Journalit அதிலிருந்து வேலை செய்யத் தொடங்கும்.',
  'onboarding.first-trade.cta': 'என் முதல் வர்த்தகத்தைச் சேர்',
  'onboarding.first-trade.sample': 'மாதிரித் தரவுடன் ஆராயுங்கள்',
  'onboarding.preparing-sample.title': 'உங்கள் மாதிரி பதிவேடு தயாராகிறது',
  'onboarding.preparing-sample.body':
    'சில நொடிகளே ஆகும். குறிப்புகள் எழுதப்படும்போது Obsidian சற்று மெதுவாகத் தோன்றலாம்.',
  'onboarding.preparing-sample.starting': 'தொடங்குகிறது…',
  'onboarding.preparing-sample.hint':
    'மூலையில் உள்ள பேட்ஜிலிருந்து எப்போது வேண்டுமானாலும் மாதிரி பதிவேட்டை நீக்கலாம்.',
  'onboarding.preparing-sample.failed.title':
    'மாதிரி பதிவேட்டை உருவாக்க முடியவில்லை',
  'onboarding.preparing-sample.failed.body':
    'மீண்டும் முயற்சிக்கலாம் அல்லது வேறு வழியில் தொடங்கலாம்.',
  'onboarding.preparing-sample.retry': 'மீண்டும் முயற்சி',
  'onboarding.sample-exploring.kicker': 'மாதிரி பதிவேடு',
  'onboarding.sample-exploring.title':
    'நீங்கள் மாதிரி பதிவேட்டை ஆராய்கிறீர்கள்',
  'onboarding.sample-exploring.body':
    'நிதானமாகப் பாருங்கள். மாதிரியிலிருந்து வெளியேறியதும் இங்கிருந்து தொடர்வோம்: உங்கள் பதிவேட்டைத் தனிப்பயனாக்கி முதல் வர்த்தகத்தைச் சேர்ப்போம்.',
  'onboarding.sample-exploring.exit': 'மாதிரியிலிருந்து வெளியேறி தொடரவும்',
  'onboarding.sample-exploring.failed.title':
    'மாதிரி பதிவேட்டை மீட்டெடுக்க முடியவில்லை',
  'onboarding.sample-exploring.failed.body':
    'மீதமுள்ளதை நீக்க மாதிரியிலிருந்து வெளியேறி, பின்னர் உங்கள் பதிவேட்டை அமைப்பதைத் தொடருங்கள்.',
  'onboarding.awaiting.kicker':
    'உங்கள் முதல் வர்த்தகங்களுக்காகக் காத்திருக்கிறோம்',
  'onboarding.awaiting.first-sync.title': 'புரோக்கர் இணைப்பை முடிக்கவும்',
  'onboarding.awaiting.first-sync.body':
    'அமைப்புகள் > Trade Sync இல் இணைப்பை முடிக்கவும். உங்கள் முதல் வர்த்தகங்கள் ஒத்திசைந்ததும், இந்த அமைவு தானாக மூடப்படும்.',
  'onboarding.awaiting.first-sync.action': 'Trade Sync ஐத் திற',
  'onboarding.awaiting.first-import.title': 'உங்கள் கோப்பை இறக்குமதி செய்யவும்',
  'onboarding.awaiting.first-import.body':
    'Trade Import தாவலில் இறக்குமதியை முடிக்கவும். உங்கள் முதல் வர்த்தகங்கள் வந்ததும், இந்த அமைவு தானாக மூடப்படும்.',
  'onboarding.awaiting.first-import.action': 'Trade Import ஐத் திற',
  'onboarding.awaiting.first-trade.title':
    'உங்கள் முதல் வர்த்தகத்தைச் சேமிக்கவும்',
  'onboarding.awaiting.first-trade.body':
    'உங்கள் முதல் வர்த்தகம் சேமிக்கப்பட்டதும், இந்த அமைவு தானாக மூடப்படும்.',
  'onboarding.awaiting.first-trade.action': 'வர்த்தகம் சேர்',
  'onboarding.awaiting.change-route': 'வேறு வழியைத் தேர்வு செய்',
  'onboarding.notice.personalise-failed':
    'உங்கள் அமைவுத் தேர்வுகளைப் பயன்படுத்த முடியவில்லை. பின்னர் அமைப்புகளில் மாற்றலாம்.',
  'onboarding.notice.trade-sync-open-failed':
    'Trade Syncஐத் திறக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'onboarding.notice.skip-failed':
    'ஆன்போர்டிங் ஸ்கிப்பைச் சேமிக்க முடியவில்லை. பிறகு முயற்சிக்கவும்.',

  'widget.goals.title.daily': 'தினசரி இலக்குகள்',
  'widget.goals.title.weekly': 'வாராந்திர இலக்குகள்',
  'widget.goals.title.monthly': 'மாதாந்திர இலக்குகள்',
  'widget.goals.title.quarterly': 'காலாண்டு இலக்குகள்',
  'widget.goals.title.yearly': 'ஆண்டு இலக்குகள்',
  'widget.goals.title.default': 'இலக்குகள்',
  'widget.goals.tooltip.daily':
    'இங்கு சேர்க்கப்படும் பொருட்கள் இன்று வரை மட்டுமே பொருந்தும். அனைத்து புதிய DRCs இல் தொடர்ச்சியான உருப்படிகளுக்கு, அமைப்புகள் > மதிப்பாய்வுகள் என்பதற்குச் செல்லவும்.',
  'widget.goals.tooltip.weekly':
    'இங்கே சேர்க்கப்படும் பொருட்கள் இந்த வாரத்திற்கு மட்டுமே பொருந்தும். அனைத்து புதிய வாராந்திர மதிப்பாய்வுகளிலும் தொடர்ச்சியான உருப்படிகளுக்கு, அமைப்புகள் > மதிப்பாய்வுகள் என்பதற்குச் செல்லவும்.',
  'widget.goals.tooltip.monthly':
    'இங்கு சேர்க்கப்படும் பொருட்கள் இந்த மாதத்திற்கு மட்டுமே பொருந்தும். அனைத்து புதிய மாதாந்திர மதிப்பாய்வுகளிலும் தொடர்ச்சியான உருப்படிகளுக்கு, அமைப்புகள் > மதிப்பாய்வுகள் என்பதற்குச் செல்லவும்.',
  'widget.goals.tooltip.quarterly':
    'இங்கே சேர்க்கப்படும் பொருட்கள் இந்த காலாண்டிற்கு மட்டுமே பொருந்தும். அனைத்து புதிய காலாண்டு மதிப்பாய்வுகளிலும் தொடர்ச்சியான உருப்படிகளுக்கு, அமைப்புகள் > மதிப்பாய்வுகள் என்பதற்குச் செல்லவும்.',
  'widget.goals.tooltip.yearly':
    'இங்கு சேர்க்கப்படும் பொருட்கள் இந்த ஆண்டுக்கு மட்டுமே பொருந்தும். அனைத்து புதிய ஆண்டு மதிப்பாய்வுகளிலும் தொடர்ச்சியான உருப்படிகளுக்கு, அமைப்புகள் > மதிப்பாய்வுகள் என்பதற்குச் செல்லவும்.',
  'widget.goals.completed': '{completed}/{total} முடிந்தது',
  'widget.goals.placeholder': 'புதிய இலக்கைச் சேர்...',
  'widget.goals.empty.preview': 'இலக்குகள் எதுவும் கட்டமைக்கப்படவில்லை',
  'widget.goals.empty.default':
    'இலக்குகள் எதுவும் அமைக்கப்படவில்லை. கீழே ஒன்றைச் சேர்க்கவும்.',
  'widget.goals.invalid-context':
    'இலக்கு விட்ஜெட்டுக்கு மதிப்பாய்வு குறிப்பு தேவை (DRC, வாராந்திர, மாதாந்திர, காலாண்டு அல்லது ஆண்டு)',
  'widget.goals.aria.edit': 'இலக்கைத் திருத்தவும்',
  'widget.goals.aria.delete': 'இலக்கை நீக்கு',
  'widget.header.name': 'தலைப்பு',

  'widget.header.invalid-context':
    "செல்லாத frontmatter: 'type' தேவை (drc/weekly-review/monthly-review/quarterly-review/trade) மற்றும் தேதிப் புலம் (மதிப்பாய்வுகளுக்கு 'date', டிரேட்களுக்கு 'entryTime')",
  'widget.header.aria.mark-reviewed':
    'மதிப்பாய்வு செய்யப்பட்டதாகக் குறிக்க கிளிக் செய்யவும்',
  'widget.header.aria.mark-not-reviewed':
    'மதிப்பாய்வு செய்யப்படவில்லை எனக் குறிக்க கிளிக் செய்யவும்',
  'widget.header.unknown-instrument': 'தெரியாதது',
  'widget.header.week': 'வாரம் {number}',
  'widget.header.quarter': 'Q{number}',
  'widget.header.drc': 'DRC',
  'widget.header.nav.prev': '← முந்தைய',
  'widget.header.nav.next': 'அடுத்து →',
  'widget.header.day.0': 'ஞாயிறு',
  'widget.header.day.1': 'திங்கட்கிழமை',
  'widget.header.day.2': 'செவ்வாய்',
  'widget.header.day.3': 'புதன்',
  'widget.header.day.4': 'வியாழன்',
  'widget.header.day.5': 'வெள்ளிக்கிழமை',
  'widget.header.day.6': 'சனிக்கிழமை',
  'widget.header.month.0': 'ஜனவரி',
  'widget.header.month.1': 'பிப்ரவரி',
  'widget.header.month.2': 'மார்ச்',
  'widget.header.month.3': 'ஏப்ரல்',
  'widget.header.month.4': 'மே',
  'widget.header.month.5': 'ஜூன்',
  'widget.header.month.6': 'ஜூலை',
  'widget.header.month.7': 'ஆகஸ்ட்',
  'widget.header.month.8': 'செப்டம்பர்',
  'widget.header.month.9': 'அக்டோபர்',
  'widget.header.month.10': 'நவம்பர்',
  'widget.header.month.11': 'டிசம்பர்',
  'widget.header.month-short.0': 'ஜன',
  'widget.header.month-short.1': 'பிப்',
  'widget.header.month-short.2': 'மார்',
  'widget.header.month-short.3': 'ஏப்',
  'widget.header.month-short.4': 'மே',
  'widget.header.month-short.5': 'ஜூன்',
  'widget.header.month-short.6': 'ஜூலை',
  'widget.header.month-short.7': 'ஆக',
  'widget.header.month-short.8': 'செப்',
  'widget.header.month-short.9': 'அக்',
  'widget.header.month-short.10': 'நவ',
  'widget.header.month-short.11': 'டிச',
  'widget.picker.placeholder': 'விட்ஜெட்டைத் தேர்ந்தெடுக்கவும்...',
  'widget.picker.search-placeholder': 'விட்ஜெட்களைத் தேடு...',
  'widget.picker.search-label': 'தேடல் விட்ஜெட்கள்',
  'widget.picker.clear-search': 'விட்ஜெட் தேடலை அழிக்கவும்',
  'widget.picker.results-label': 'கிடைக்கும் விட்ஜெட்டுகள்',
  'widget.picker.no-results':
    'உங்கள் தேடலுக்கு எந்த விட்ஜெட்களும் பொருந்தவில்லை',
  'widget.category.charts': 'விளக்கப்படங்கள்',
  'widget.category.statistics': 'புள்ளிவிவரங்கள்',
  'widget.category.content': 'உள்ளடக்கம்',
  'widget.category.tables': 'அட்டவணைகள்',
  'widget.category.layout': 'தளவமைப்பு',
  'widget.goals.name': 'இலக்குகள்',
  'widget.goals.description': 'நிறைவு செக்பாக்ஸ்களுடன் தினசரி இலக்குகள்',
  'widget.review.name': 'மதிப்பாய்வு',
  'widget.review.description': 'மன மற்றும் தொழில்நுட்ப செயல்திறன் தரங்கள்',
  'widget.review-context-fields.name': 'மதிப்பாய்வு சூழல் புலங்கள்',
  'widget.review-context-fields.description':
    'மதிப்பாய்வு குறிப்புகளுக்குத் திருத்தக்கூடிய தனிப்பயன் சூழல் புலங்கள்',
  'widget.review-context-fields.group.default': 'சூழலை மதிப்பாய்வு செய்யவும்',

  'widget.review-context-fields.empty-title':
    'இந்த மதிப்பாய்வு வகைக்கு மதிப்பாய்வு சூழல் புலங்கள் எதுவும் உள்ளமைக்கப்படவில்லை.',
  'widget.review-context-fields.empty-desc':
    'சார்பு, கவனம், நோக்கம் மற்றும் பிற திட்டமிடல் சூழலைப் பிடிக்க அமைப்புகளில் தனிப்பயன் புலங்களை மதிப்பாய்வு செய்யவும்.',
  'widget.review-context-fields.configure':
    'மதிப்பாய்வு புலங்களை உள்ளமைக்கவும்',
  'widget.review-context-fields.service-unavailable':
    'மதிப்பாய்வு தனிப்பயன் புலங்கள் இன்னும் கிடைக்கவில்லை.',
  'widget.review-context-fields.unsupported-type':
    'ஆதரிக்கப்படாத மதிப்பாய்வு புல வகை.',
  'widget.review-context-fields.source-missing':
    'இந்த பெற்றோர் மதிப்பாய்வு இன்னும் இல்லை.',
  'widget.review-context-fields.source-invalid':
    'இந்த பெற்றோர் மதிப்பாய்வு உள்ளது ஆனால் இது சரியான மதிப்பாய்வு குறிப்பு அல்ல.',
  'widget.review-context-fields.source-empty':
    'இந்த பெற்றோர் மதிப்பாய்வில் இன்னும் மரபுரிமை மதிப்புகள் நிரப்பப்படவில்லை.',

  'widget.review.title': 'செயல்திறன் மதிப்பாய்வு',
  'widget.review.mental-game': 'Mental Game',
  'widget.review.technical-game': 'Technical Game',
  'widget.review.star-hint':
    'முழு நட்சத்திரத்திற்கு கிளிக் செய்யவும், அரை நட்சத்திரத்திற்கு வலது கிளிக் செய்யவும்',
  'widget.review.invalid-context':
    "மதிப்பாய்வு விட்ஜெட்டுக்கு DRC அல்லது வாராந்திர மதிப்பாய்வு குறிப்பு தேவை (frontmatter type: 'drc' அல்லது 'weekly-review')",
  'widget.checklist.name': 'சரிபார்ப்பு பட்டியல்',
  'widget.checklist.description':
    'அமர்வுக்கு முந்தைய தயாரிப்பு சரிபார்ப்பு பட்டியல்',
  'widget.session-mistakes.name': 'அமர்வு தவறுகள்',
  'widget.session-mistakes.description':
    'அன்றைய அமர்வின் இறுதியில் நடத்தை தவறுகளைக் கண்காணிக்கவும்',
  'widget.key-levels.name': 'முக்கிய நிலைகள்',
  'widget.key-levels.description': 'பார்க்க வேண்டிய முக்கியமான விலை நிலைகள்',
  'widget.key-events.name': 'முக்கிய நிகழ்வுகள்',
  'widget.key-events.description': 'காலத்தின் முக்கிய நிகழ்வுகள்',
  'widget.key-events.title': 'முக்கிய நிகழ்வுகள்',
  'widget.key-events.tooltip':
    'முக்கிய நிகழ்வுகள் உங்கள் வாராந்திர மதிப்பாய்வில் சேமிக்கப்பட்டு DRC இல் சேர்க்கலாம் அல்லது திருத்தலாம்.',
  'widget.key-events.placeholder':
    'நிகழ்வைத் தேர்ந்தெடுக்கவும் அல்லது உருவாக்கவும்',
  'widget.key-events.color-label': 'நிறம்:',
  'widget.key-events.color-aria': '{color} நிறத்தைத் தேர்ந்தெடுக்கவும்',
  'widget.key-events.day-label': 'நாள்:',
  'widget.key-events.notes-placeholder':
    'இந்த நிகழ்வைப் பற்றிய குறிப்புகள் (விரும்பினால்)',
  'widget.key-events.notes-label': 'குறிப்புகள்',
  'widget.key-events.default-notes-tooltip':
    'இயல்புநிலை குறிப்புகள் அமைப்புகள் → தனிப்பயனாக்கம் → நிகழ்வுகளில் நிர்வகிக்கப்படும். இங்கே ஒரு நிகழ்வைத் தேர்ந்தெடுப்பது அதன் சேமித்த இயல்புநிலை குறிப்புகளைத் தானாக நிரப்பும்.',
  'widget.key-events.add-button': 'நிகழ்வைச் சேர்க்கவும்',
  'widget.key-events.empty-state': 'இன்று முக்கிய நிகழ்வுகள் இல்லை',
  'widget.key-events.empty-state-sub':
    'உங்கள் வாராந்திர மதிப்பாய்வில் நிகழ்வுகளைச் சேர்க்கவும்',
  'widget.missed-trades.name': 'தவறவிட்ட டிரேட்கள்',
  'widget.missed-trades.description':
    'நீங்கள் அடையாளம் கண்டுள்ள ஆனால் எடுக்காத டிரேட்கள்',
  'widget.images.name': 'விளக்கப்படங்கள் & மீடியா',
  'widget.images.description': 'பதிவேற்ற ஆதரவுடன் மீடியா கொணர்வி',
  'widget.images.invalid-context':
    "மீடியா விட்ஜெட்டுக்கு மதிப்பாய்வுக் குறிப்பு தேவை (type: 'drc', 'weekly-review', 'monthly-review', 'quarterly-review', அல்லது 'yearly-review')",
  'widget.images.alt-prefix': 'மீடியாவை மதிப்பாய்வு செய்யவும்',
  'widget.images.stacked-alt': 'மீடியாவை மதிப்பாய்வு செய்யவும் {index}',
  'widget.images.open-fullscreen': 'மீடியா {index} முழுத்திரையில் திறக்கவும்',
  'widget.images.delete': 'மீடியாவை நீக்கு',
  'widget.images.empty': 'ஊடகம் இல்லை',
  'widget.images.placeholder': 'மீடியா URL அல்லது கோப்பு பாதையை ஒட்டவும்...',
  'widget.images.placeholder-add-more': 'மேலும் மீடியாவைச் சேர்...',
  'widget.mark-reviewed.name': 'Reviewed எனக் குறி',
  'widget.mark-reviewed.description':
    'நேர முத்திரையுடன் மதிப்பாய்வு முடிந்தது எனக் குறிக்க பேனர்',
  'widget.mark-reviewed.status.reviewed': 'REVIEWED',
  'widget.mark-reviewed.status.pending': 'மதிப்பாய்வு நிலுவையில் உள்ளது',
  'widget.mark-reviewed.button.undo': 'செயல்தவிர்',
  'widget.mark-reviewed.button.mark':
    'மதிப்பாய்வு செய்யப்பட்டதாகக் குறிக்கவும்',
  'widget.pnl-chart.name': 'Equity Curve',
  'widget.pnl-chart.description': 'காலப்போக்கில் ஒட்டுமொத்த லாபம்/நஷ்டம்',
  'widget.drawdown-chart.name': 'Drawdown',
  'widget.drawdown-chart.description':
    'முன்னதாக உணரப்பட்ட P&L உயர்வில் இருந்து மூடப்பட்ட டிரேட் Drawdown தொகை',
  'widget.directional-pnl.name': 'திசை P&L',
  'widget.directional-pnl.description': 'Long vs Short செயல்திறன் ஒப்பீடு',
  'widget.directional-drawdown.name': 'திசை Realized Drawdown',
  'widget.directional-drawdown.description':
    'Long மற்றும் Short மூடிய-டிரேட் Drawdown தொகை வளைவுகளைத் தனித்தனியாகக் காட்டுகிறது',
  'widget.long-drawdown.name': 'Long Drawdown',
  'widget.long-drawdown.description':
    'Long டிரேட்களுக்கு மட்டுமே மூடிய-டிரேட் Drawdown தொகை வளைவு',
  'widget.short-drawdown.name': 'Short Drawdown',
  'widget.short-drawdown.description':
    'Short டிரேட்களுக்கு மட்டுமே மூடிய-டிரேட் Drawdown தொகை வளைவு',
  'widget.trades-chart.name': 'டிரேட் P&L',
  'widget.trades-chart.description':
    'ஒவ்வொரு தனிப்பட்ட டிரேட்டுக்கும் P&L பட்டி',
  'widget.trades-chart-daily.name': 'தினசரி P&L',
  'widget.trades-chart-daily.description': 'P&L நாளின்படி திரட்டப்பட்டது',
  'widget.trades-chart-weekly.name': 'வாராந்திர P&L',
  'widget.trades-chart-weekly.description':
    'P&L வாரத்தின்படி ஒருங்கிணைக்கப்பட்டது',
  'widget.trades-chart-monthly.name': 'மாதாந்திர P&L',
  'widget.trades-chart-monthly.description':
    'P&L மாத அடிப்படையில் திரட்டப்பட்டது',
  'widget.trades-chart-quarterly.name': 'காலாண்டு P&L',
  'widget.trades-chart-quarterly.description': 'P&L காலாண்டால் திரட்டப்பட்டது',
  'widget.stats.name': 'ஸ்டாட்ஸ் கட்டம்',
  'widget.stats.description': 'கட்டம் வடிவத்தில் முக்கிய செயல்திறன் அளவீடுகள்',
  'widget.stats.no-trades': 'இந்தக் காலத்திற்கு மூடப்பட்ட டிரேட் இல்லை',
  'widget.stats.vs-prev': 'vs முந்தைய',
  'dashboard.metrics.past-30d': 'கடந்த 30டி',

  'widget.stats.net-pnl': 'Net P&L',
  'widget.stats.win-rate': 'Win Rate',
  'widget.stats.profit-factor': 'Profit Factor',
  'widget.stats.expectancy': 'Expectancy',
  'widget.stats.total-trades': 'மொத்த டிரேட்கள்',
  'widget.stats.avg-win': 'சராசரி வெற்றி',
  'widget.stats.avg-loss': 'சராசரி இழப்பு',
  'widget.stats.pl-ratio': 'P/L விகிதம்',
  'widget.account-breakdown.name': 'கணக்கு பிரிவு',
  'widget.account-breakdown.description':
    'இந்த மதிப்பாய்வு காலத்தில் கணக்குகள் முழுவதும் செயல்திறனை ஒப்பிடுக',
  'widget.account-breakdown.empty': 'இந்தக் காலத்திற்கு மூடப்பட்ட டிரேட் இல்லை',
  'widget.account-breakdown.column.account': 'கணக்கு',
  'widget.account-breakdown.column.trades': 'டிரேட்கள்',
  'widget.account-breakdown.column.pnl': 'Net P&L',
  'widget.account-breakdown.column.win-rate': 'Win Rate',
  'widget.account-breakdown.column.profit-factor': 'Profit Factor',
  'widget.tag-performance.name': 'டேக் செயல்திறன்',
  'widget.tag-performance.description':
    'டிரேட் குறிச்சொல் மூலம் செயல்திறன் பிரிவு',
  'widget.setup-performance.name': 'Setup செயல்திறன்',
  'widget.setup-performance.description': 'Setup மூலம் செயல்திறன் பிரிவு',
  'widget.best-worst-trades.name': 'சிறந்த/மோசமான டிரேட்கள்',
  'widget.best-worst-trades.description': 'சிறந்த வெற்றி மற்றும் தோல்வி டிரேட்',
  'widget.best-worst.best-trade': 'சிறந்த டிரேட்',
  'widget.best-worst.worst-trade': 'மோசமான டிரேட்',
  'widget.best-worst.no-win-trades': 'வெற்றிகரமான டிரேட் இல்லை',
  'widget.best-worst.no-loss-trades': 'இழப்பு டிரேட் இல்லை',
  'widget.best-worst.best-month': 'சிறந்த மாதம்',
  'widget.best-worst.worst-month': 'மோசமான மாதம்',
  'widget.best-worst.no-profitable-months': 'லாபகரமான மாதங்கள் இல்லை',
  'widget.best-worst.no-losing-months': 'இழக்கும் மாதங்கள் இல்லை',
  'widget.best-worst.n-trades': '{count} டிரேட்கள்',
  'widget.best-worst.win-rate': '{rate}% Win Rate',
  'widget.best-worst-days.name': 'சிறந்த/மோசமான நாட்கள்',
  'widget.best-worst-days.description': 'அதிக மற்றும் குறைந்த P&L நாட்கள்',
  'widget.best-worst-days.best-day': 'சிறந்த நாள்',
  'widget.best-worst-days.worst-day': 'மோசமான நாள்',
  'widget.best-worst-days.no-profitable-days': 'லாபகரமான நாட்கள் இல்லை',
  'widget.best-worst-days.no-losing-days': 'இழக்கும் நாட்கள் இல்லை',
  'widget.best-worst-days.trade-count.one': '{count} டிரேட்',
  'widget.best-worst-days.trade-count.few': '{count} டிரேட்கள்',
  'widget.best-worst-days.trade-count.many': '{count} டிரேட்கள்',
  'widget.best-worst-days.trade-count.other': '{count} டிரேட்கள்',
  'widget.best-worst-days.win-rate': '{rate}% Win Rate',
  'widget.best-worst-days.invalid-context':
    'இந்த விட்ஜெட் வாராந்திர மற்றும் மாதாந்திர மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.position-size.title': 'Position Size',
  'widget.position-size.save-defaults': 'இயல்புநிலையாக சேமிக்கவும்',
  'widget.position-size.reset-defaults': 'இயல்புநிலைக்கு மீட்டமைக்கவும்',
  'widget.position-size.stock-crypto': 'பங்கு/கிரிப்டோ',
  'widget.position-size.futures': 'Futures',
  'widget.position-size.forex': 'Forex',
  'widget.position-size.account-balance': 'கணக்கு இருப்பு',
  'widget.position-size.risk-percent': 'ஆபத்து%',
  'widget.position-size.entry-price': 'நுழைவு விலை',
  'widget.position-size.profit-target-optional': 'Profit Target (optional)',
  'widget.position-size.currency-pair': 'நாணய ஜோடி',
  'widget.position-size.stop-loss-pips': 'Stop Loss (pips)',
  'widget.position-size.target-pips-optional':
    'இலக்கு (பிப்ஸ், விருப்பத்தேர்வு)',
  'widget.position-size.placeholder.example': 'எ.கா., {value}',
  'widget.position-size.enter-values': 'மதிப்புகளை உள்ளிடவும்',
  'widget.position-size.risk': 'ஆபத்து',
  'widget.position-size.reward': 'வெகுமதி',
  'widget.position-size.stop': 'நிறுத்து',
  'widget.position-size.pts': 'புள்ளிகள்',
  'widget.position-size.mini': 'மினி',
  'widget.position-size.pip-value-info':
    'Pip மதிப்பு: ${value} (standard lot) | pip அளவு: {size}',
  'widget.position-size.futures-info': '${dollar}/pt | டிக்: {size} = ${value}',
  'widget.position-size.investment-dollar': 'முதலீடு ($)',
  'widget.position-size.investment': 'முதலீடு',
  'widget.position-size.at-price': '@ ${price}',
  'widget.best-worst-weeks.name': 'சிறந்த/மோசமான வாரங்கள்',
  'widget.best-worst-weeks.description':
    'அதிகபட்சம் மற்றும் குறைந்த P&L வாரங்கள்',
  'widget.best-worst-weeks.best-week': 'சிறந்த வாரம்',
  'widget.best-worst-weeks.worst-week': 'மோசமான வாரம்',
  'widget.best-worst-weeks.no-profitable': 'லாபகரமான வாரங்கள் இல்லை',
  'widget.best-worst-weeks.no-losing': 'இழக்கும் வாரங்கள் இல்லை',
  'widget.best-worst-weeks.week-name': 'வாரம் {number} ({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} டிரேட்கள்',
  'widget.best-worst-weeks.win-rate': '{percent}% Win Rate',
  'widget.best-worst-weeks.invalid-context':
    'இந்த விட்ஜெட் வாராந்திர, மாதாந்திர, காலாண்டு மற்றும் வருடாந்திர மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.best-worst-months.name': 'சிறந்த/மோசமான மாதங்கள்',
  'widget.best-worst-months.description': 'அதிக மற்றும் குறைந்த P&L மாதங்கள்',
  'widget.best-worst-months.invalid-context':
    'இந்த விட்ஜெட் காலாண்டு மற்றும் வருடாந்திர மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.best-worst-quarters.name': 'சிறந்த/மோசமான காலாண்டுகள்',
  'widget.best-worst-quarters.description':
    'அதிக மற்றும் குறைந்த P&L காலாண்டுகள்',
  'widget.best-worst-quarters.best-quarter': 'சிறந்த காலாண்டு',
  'widget.best-worst-quarters.worst-quarter': 'மோசமான காலாண்டு',
  'widget.best-worst-quarters.no-profitable': 'லாபகரமான காலாண்டுகள் இல்லை',
  'widget.best-worst-quarters.no-losing': 'இழக்கும் காலாண்டுகள் இல்லை',
  'widget.best-worst-quarters.trade-count': '{count} டிரேட்கள்',
  'widget.best-worst-quarters.win-rate': '{percent}% Win Rate',
  'widget.best-worst-quarters.invalid-context':
    'இந்த விட்ஜெட் ஆண்டு மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.technical-game.name': 'Technical Game',
  'widget.technical-game.description':
    'DRCs இலிருந்து வாராந்திர தொழில்நுட்ப தர விநியோகம்',
  'widget.mental-game.name': 'Mental Game',
  'widget.mental-game.description': 'DRCs இலிருந்து வாராந்திர மன தர விநியோகம்',
  'widget.demon-tracker.name': 'Demon Tracker',
  'widget.demon-tracker.description':
    'தொடர்ச்சியான டிரேட் தவறுகளைக் கண்காணிக்கவும்',
  'widget.trading-score.title': 'டிரேட் மதிப்பெண்',
  'widget.trading-score.no-data': 'டிரேட் தரவு இல்லை',
  'widget.trading-score.breakdown-title': 'மதிப்பெண் பிரிவு',
  'widget.trading-score.close-breakdown': 'மூடு பிரிவு',
  'widget.trading-score.of-weeks': 'இன் {count}',
  'widget.trading-score.start-trading':
    'உங்கள் ஸ்கோரைத் திறக்க டிரேடைத் தொடங்கவும்',
  'widget.trading-score.one-week-down': '1 வாரம் கீழே, தொடரவும்!',
  'widget.trading-score.weeks-to-unlock.one': 'திறக்க இன்னும் வாரம் {count}',
  'widget.trading-score.weeks-to-unlock.few': 'திறக்க இன்னும் {count} வாரங்கள்',
  'widget.trading-score.weeks-to-unlock.many':
    'திறக்க இன்னும் {count} வாரங்கள்',
  'widget.trading-score.weeks-to-unlock.other':
    'திறக்க இன்னும் {count} வாரங்கள்',
  'widget.trading-score.trades-to-unlock.one': 'திறக்க {count} மேலும் டிரேட்',
  'widget.trading-score.trades-to-unlock.few':
    'திறக்க {count} மேலும் டிரேட்கள்',
  'widget.trading-score.trades-to-unlock.many':
    'திறக்க {count} மேலும் டிரேட்கள்',
  'widget.trading-score.trades-to-unlock.other':
    'திறக்க {count} மேலும் டிரேட்கள்',
  'widget.trading-score.collect-more-data':
    'உங்கள் ஸ்கோரைத் திறக்க இன்னும் கொஞ்சம் தரவைச் சேகரிக்கவும்',
  'widget.trading-score.trades-logged.one': '{count} டிரேட் பதிவுசெய்யப்பட்டது',
  'widget.trading-score.trades-logged.few':
    '{count} டிரேட்கள் பதிவு செய்யப்பட்டுள்ளன',
  'widget.trading-score.trades-logged.many':
    '{count} டிரேட்கள் பதிவு செய்யப்பட்டுள்ளன',
  'widget.trading-score.trades-logged.other':
    '{count} டிரேட்கள் பதிவு செய்யப்பட்டுள்ளன',
  'widget.trading-score.trades-count': '{count} டிரேட்கள்',
  'widget.trading-score.weight': 'எடை: {weight}%',
  'widget.trading-score.weeks-suffix': '· {weeks}w',
  'widget.trading-score.axis-aria': '{axis}: {score} புள்ளிகள், {weight}% எடை',
  'widget.trading-score.phase.insufficient': 'போதுமான தரவு இல்லை',
  'widget.trading-score.phase.developing': 'வளரும்',
  'widget.trading-score.phase.established': 'நிறுவப்பட்டது',
  'widget.trading-score.axis.profitability': 'Profitability',
  'widget.trading-score.axis.riskManagement': 'இடர் மேலாண்மை',
  'widget.trading-score.axis.execution': 'Execution',
  'widget.trading-score.axis.consistency': 'நிலைத்தன்மை',
  'widget.trading-score.axis.returnConsistency': 'Return Consistency',
  'widget.trading-score.axis.experience': 'அனுபவம்',
  'widget.trading-score.axis.profitability.desc':
    'ஒரு டிரேட்டுக்கான Profit Factor மற்றும் Expectancy-ஐ அளவிடுகிறது',
  'widget.trading-score.axis.riskManagement.desc':
    'அதிகபட்ச Drawdown கட்டுப்பாடு மற்றும் மீட்பு திறனை அளவிடுகிறது',
  'widget.trading-score.axis.execution.desc':
    'Win Rate மற்றும் சராசரி வெற்றி/இழப்பு விகிதத்தை அளவிடுகிறது',
  'widget.trading-score.axis.consistency.desc':
    'Return Consistency மற்றும் ஸ்ட்ரீக் கட்டுப்பாட்டை அளவிடுகிறது',
  'widget.trading-score.axis.returnConsistency.desc':
    'Take Profit மற்றும் Stop Loss சீரான தன்மையை அளவிடுகிறது',
  'widget.trading-score.axis.experience.desc':
    'செயலில் உள்ள டிரேட் வாரங்கள் மற்றும் நிலைத்தன்மையை அளவிடுகிறது',
  'widget.trades.name': 'டிரேட்கள்',
  'widget.trades.description': 'முக்கிய விவரங்களுடன் டிரேட்களின் பட்டியல்',
  'widget.trade-review.name': 'டிரேட் மதிப்பாய்வு',
  'widget.trade-review.description':
    'படங்கள், முக்கிய உண்மைகள் மற்றும் உள்ளமைக்கக்கூடிய கேள்விகளுடன் ஒவ்வொரு டிரேடையும் மதிப்பாய்வு செய்யவும்',
  'widget.trade-review.question.win-what-worked': 'என்ன வேலை செய்தது?',
  'widget.trade-review.placeholder.win-what-worked':
    'இந்த டிரேட்டில் நீங்கள் எதைச் சிறப்பாகச் செய்தீர்கள்?',
  'widget.trade-review.question.win-repeatable':
    'இது மீண்டும் மீண்டும் செய்யக்கூடியதா?',
  'widget.trade-review.placeholder.win-repeatable':
    'இந்த டிரேடை மீண்டும் மீண்டும் செய்யக் காரணம் என்ன?',
  'widget.trade-review.question.key-lesson': 'முக்கிய பாடம்',
  'widget.trade-review.placeholder.key-lesson':
    'இந்த டிரேட்டில் நீங்கள் என்ன நினைவில் கொள்ள வேண்டும்?',
  'widget.trade-review.question.loss-what-went-wrong': 'என்ன தவறு நடந்தது?',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    'இந்த இழப்புக்கு என்ன காரணம்?',
  'widget.trade-review.question.loss-valid-or-mistake':
    'இது சரியான இழப்பா அல்லது Execution தவறா?',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    'இது செல்லுபடியாகும் செயல்முறையா அல்லது தவிர்க்கக்கூடியதா என்பதை விவரிக்கவும்.',
  'widget.trade-review.question.loss-avoid-next-time':
    'அடுத்த முறை நான் எதைத் தவிர்ப்பேன்?',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    'என்ன குறிப்பிட்ட நடத்தை மாற வேண்டும்?',
  'widget.trade-review.question.be-managed-correctly':
    'இது சரியாக நிர்வகிக்கப்பட்டதா?',
  'widget.trade-review.placeholder.be-managed-correctly':
    'நிர்வாகம் உங்கள் திட்டத்துடன் பொருந்தியதா?',
  'widget.trade-review.status.reviewed': 'மதிப்பாய்வு செய்யப்பட்டது',
  'widget.trade-review.status.pending': 'மதிப்பாய்வு நிலுவையில் உள்ளது',
  'widget.trade-review.image-alt-prefix': 'டிரேட் மதிப்பாய்வு படம்',
  'widget.trade-review.no-image': 'டிரேட் படம் இல்லை',
  'widget.trade-review.placeholder.default': 'உங்கள் எண்ணங்களை எழுதுங்கள்...',

  'widget.trade-review.open-trade-note': 'டிரேட் குறிப்பைத் திறக்கவும்',

  'widget.trade-review.field.entry': 'நுழைவு',
  'widget.trade-review.field.exit': 'வெளியேற்றம்',
  'widget.trade-review.field.duration': 'கால அளவு',
  'widget.trade-review.field.risk': 'ஆபத்து',
  'widget.trade-review.field.account': 'கணக்கு',
  'widget.trade-review.field.setup': 'Setup',
  'widget.trade-review.field.mistakes': 'தவறுகள்',
  'widget.trade-review.field.tags': 'குறிச்சொற்கள்',
  'widget.trade-review.more-context': 'மேலும் சூழல்',
  'widget.trade-review.field.position-size': 'அளவு',
  'widget.trade-review.field.stop-loss': 'Stop Loss',
  'widget.trade-review.field.take-profit': 'Take Profit',
  'widget.trade-review.field.fees': 'கட்டணம்',
  'widget.trade-review.field.commission': 'கமிஷன்',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': 'தீசிஸ்',
  'widget.trade-review.field.notes': 'குறிப்புகள்',
  'widget.trade-review.field.custom-fields': 'தனிப்பயன் புலங்கள்',
  'widget.trade-review.loading': 'டிரேட் மதிப்பாய்வுகளை ஏற்றுகிறது...',
  'widget.trade-review.no-trades': 'மதிப்பாய்வு செய்ய டிரேட் இல்லை.',
  'widget.trade-review.time.open': 'திறந்தவை',
  'widget.trade-review.fallback-title': 'டிரேட் {index}',
  'widget.backtest-trades.name': 'Backtest டிரேட்கள்',
  'widget.backtest-trades.description':
    'இந்த மதிப்பாய்வு காலத்திற்கான Backtest டிரேட்களின் பட்டியல்',
  'widget.breakdown-daily.name': 'தினசரி சுருக்கம்',
  'widget.breakdown-daily.description':
    'செயல்திறன் அட்டவணை நாள் வாரியாக தொகுக்கப்பட்டுள்ளது',
  'widget.breakdown-weekly.name': 'வாராந்திர சுருக்கம்',
  'widget.breakdown-weekly.description':
    'செயல்திறன் அட்டவணை வாரம் வாரியாக தொகுக்கப்பட்டுள்ளது',
  'widget.breakdown-monthly.name': 'மாதாந்திர சுருக்கம்',
  'widget.breakdown-monthly.description':
    'செயல்திறன் அட்டவணை மாத வாரியாக தொகுக்கப்பட்டுள்ளது',
  'widget.breakdown-quarterly.name': 'காலாண்டு சுருக்கம்',
  'widget.breakdown-quarterly.description':
    'செயல்திறன் அட்டவணை காலாண்டால் தொகுக்கப்பட்டுள்ளது',
  'widget.breakdown.empty.days-week': 'இந்த வாரம் டிரேட் நாட்கள் இல்லை',
  'widget.breakdown.empty.weeks-month': 'இந்த மாதம் டிரேட் வாரங்கள் இல்லை',
  'widget.breakdown.empty.months-quarter':
    'இந்த காலாண்டில் டிரேட் மாதங்கள் இல்லை',
  'widget.breakdown.empty.quarters-year': 'இந்த ஆண்டு டிரேட் காலாண்டுகள் இல்லை',
  'widget.table.header.date': 'தேதி',
  'widget.table.header.week': 'வாரம்',
  'widget.table.header.month': 'மாதம்',
  'widget.table.header.quarter': 'காலாண்டு',

  'widget.table.header.trades': 'டிரேட்கள்',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'வெற்றி%',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.tag': 'குறிச்சொல்',
  'widget.table.header.setup': 'Setup',
  'widget.table.header.a-games': 'ஒரு விளையாட்டு',
  'widget.table.header.b-games': 'பி கேம்கள்',
  'widget.table.header.c-games': 'சி கேம்ஸ்',
  'widget.table.header.rating': 'மதிப்பீடு',
  'widget.table.header.avg-rating': 'சராசரி மதிப்பீடு',
  'widget.demon-tracker.column.demon': 'DEMON',
  'widget.demon-tracker.column.occurrences': 'நிகழ்வுகள்',
  'widget.demon-tracker.column.stop-trading': 'டிரேடை நிறுத்து',
  'widget.demon-tracker.period.this-week': 'இந்த வாரம்',
  'widget.demon-tracker.period.this-month': 'இந்த மாதம்',
  'widget.demon-tracker.period.this-quarter': 'இந்த காலாண்டில்',
  'widget.demon-tracker.period.this-year': 'இந்த ஆண்டு',
  'widget.demon-tracker.empty.title':
    'எந்த தவறும் கண்காணிக்கப்படவில்லை {period}',
  'widget.demon-tracker.empty.description':
    'பேட்டர்ன்களை அடையாளம் காண உதவும் வகையில் உங்கள் டிரேட்டில் உள்நுழைந்துள்ள தவறுகள் இங்கே தோன்றும்',
  'widget.demon-tracker.summary.unique': 'தனித்துவமான தவறுகள்:',
  'widget.demon-tracker.summary.total': 'மொத்த நிகழ்வுகள்:',
  'widget.demon-tracker.summary.critical': 'முக்கியமான ({threshold}+):',
  'widget.markdown-zone.name': 'Markdown பகுதி',
  'widget.markdown-zone.description': 'இலவச-படிவ மார்க் டவுன் உள்ளடக்கப் பகுதி',
  'widget.markdown-header.name': 'பிரிவு தலைப்பு',
  'widget.markdown-header.description':
    'தனிப்பயன் உரையுடன் Markdown தலைப்பு (H1-H6).',
  'metric.netPnL.name': 'Net P&L',
  'metric.netPnL.description':
    'அனைத்து டிரேட்களிலும் மொத்த லாபம் மற்றும் இழப்பு',
  'metric.winRate.name': 'Win Rate',
  'metric.winRate.description': 'வென்ற டிரேட்டின் சதவீதம்',
  'metric.profitFactor.name': 'Profit Factor',
  'metric.profitFactor.description': 'மொத்த லாபம் மற்றும் மொத்த இழப்பு விகிதம்',
  'metric.sharpeRatio.name': 'Sharpe Ratio',
  'metric.sharpeRatio.description':
    'டிரேட்-நிலை Sharpe Ratio: சராசரி மூடிய-டிரேட் நிகர P&L, மாதிரி P&L ஏற்ற இறக்கத்தால் வகுக்கப்படும்',
  'metric.expectancy.name': 'Expectancy',
  'metric.expectancy.description':
    'ஒரு டிரேட்டுக்கு வென்ற அல்லது இழந்த சராசரி தொகை',
  'metric.maxDrawdown.name': 'அதிகபட்ச Drawdown',
  'metric.maxDrawdown.description':
    'முன்னதாக உணரப்பட்ட P&L உயர்விலிருந்து மிகப்பெரிய மூடிய டிரேட் Drawdown தொகை',
  'metric.bestDay.name': 'சிறந்த நாள்',
  'metric.bestDay.description': 'அதிகபட்ச ஒற்றை நாள் P&L',
  'metric.largestWin.name': 'மிகப்பெரிய வெற்றி',
  'metric.largestWin.description': 'மிகப்பெரிய வெற்றிகரமான டிரேட்',
  'metric.largestLoss.name': 'மிகப்பெரிய இழப்பு',
  'metric.largestLoss.description': 'மிகப்பெரிய இழப்பு டிரேட்',
  'metric.longestWinStreak.name': 'சிறந்த ஸ்ட்ரீக்',
  'metric.longestWinStreak.description':
    'வெளியேறும் தேதியின்படி Longதொடர் வெற்றி தொடர்',
  'metric.longestLossStreak.name': 'மோசமான ஸ்ட்ரீக்',
  'metric.longestLossStreak.description':
    'வெளியேறும் தேதியின்படி Long தொடர் தோல்வி',
  'metric.numTrades.name': 'மொத்த டிரேட்கள்',
  'metric.numTrades.description': 'மூடப்பட்ட டிரேட்களின் மொத்த எண்ணிக்கை',
  'metric.numWinTrades.name': 'வெற்றி டிரேட்',
  'metric.numWinTrades.description': 'வென்ற டிரேட்களின் எண்ணிக்கை',
  'metric.numLossTrades.name': 'டிரேடை இழக்கிறது',
  'metric.numLossTrades.description': 'இழந்த டிரேட்களின் எண்ணிக்கை',
  'metric.avgWin.name': 'சராசரி வெற்றி',
  'metric.avgWin.description': 'வென்ற டிரேட்டின் சராசரி லாபம்',
  'metric.avgLoss.name': 'சராசரி இழப்பு',
  'metric.avgLoss.description': 'இழப்பு டிரேட்களின் சராசரி இழப்பு',
  'metric.avgRR.name': 'சராசரி RR (Payoff)',
  'metric.avgRR.description':
    'நாணய அடிப்படையிலான Payoff விகிதம்: சராசரி வெற்றி / சராசரி இழப்பு',
  'metric.avgRRRiskBased.name': 'சராசரி RR (R-அடிப்படையில்)',
  'metric.avgRRRiskBased.description':
    'R-மல்டிபிள்களைப் பயன்படுத்தும் இடர் அடிப்படையிலான விகிதம்: சராசரி வென்ற R / சராசரி இழக்கும் R (நிறுத்தம்/அபாய தரவு தேவை)',
  'metric.avgHoldTime.name': 'சராசரி வைத்திருக்கும் நேரம்',
  'metric.avgHoldTime.description':
    'அனைத்து மூடப்பட்ட டிரேட்களிலும் சராசரி நேரம்',
  'metric.avgWinHoldTime.name': 'சராசரி வெற்றி ஹோல்ட் டைம்',
  'metric.avgWinHoldTime.description':
    'வெற்றி பெற்ற மூடிய டிரேட்களில் சராசரி நேரம்',
  'metric.avgLossHoldTime.name': 'சராசரி இழப்பு ஹோல்ட் நேரம்',
  'metric.avgLossHoldTime.description': 'இழந்த மூடிய டிரேட்களில் சராசரி நேரம்',
  'metric.avgWinnerHeat.name': 'சராசரி Winner Heat',
  'metric.avgWinnerHeat.description':
    'கட்டமைக்கப்பட்ட MAE/MFE டிஸ்ப்ளே யூனிட்டைப் பயன்படுத்தி, வெற்றி பெற்ற மூடிய டிரேட்களின் சராசரி MAE',
  'metric.winnerMaeP90.name': 'வெற்றியாளர் MAE P90',
  'metric.winnerMaeP90.description':
    'கட்டமைக்கப்பட்ட MAE/MFE டிஸ்ப்ளே யூனிட்டைப் பயன்படுத்தி, வெற்றி பெற்ற மூடிய டிரேட்களின் 90வது சதவீதம் MAE த்ரெஷோல்ட்',
  'metric.winnerMaeMedian.name': 'வெற்றியாளர் MAE Median',
  'metric.winnerMaeMedian.description':
    'கட்டமைக்கப்பட்ட MAE/MFE டிஸ்ப்ளே யூனிட்டைப் பயன்படுத்தி, வெற்றி பெற்ற மூடிய டிரேட்களின் Median MAE',
  'metric.avgLossHeat.name': 'சராசரி Loss Heat',
  'metric.avgLossHeat.description':
    'கட்டமைக்கப்பட்ட MAE/MFE டிஸ்ப்ளே யூனிட்டைப் பயன்படுத்தி, இழந்த மூடிய டிரேட்களின் சராசரி MAE',
  'metric.winnerAvgMfe.name': 'வெற்றியாளர் சராசரி MFE',
  'metric.winnerAvgMfe.description':
    'கட்டமைக்கப்பட்ட MAE/MFE டிஸ்ப்ளே யூனிட்டைப் பயன்படுத்தி, வெற்றி பெற்ற மூடிய டிரேட்களின் சராசரி MFE',
  'metric.loserAvgMfe.name': 'இழப்பாளர் சராசரி MFE',
  'metric.loserAvgMfe.description':
    'கட்டமைக்கப்பட்ட MAE/MFE டிஸ்ப்ளே யூனிட்டைப் பயன்படுத்தி, இழந்த மூடிய டிரேட்களின் சராசரி MFE',
  'metric.winnerMfeP90.name': 'வெற்றியாளர் MFE P90',
  'metric.winnerMfeP90.description':
    'கட்டமைக்கப்பட்ட MAE/MFE டிஸ்ப்ளே யூனிட்டைப் பயன்படுத்தி, வெற்றி பெற்ற மூடிய டிரேட்களின் 90வது சதவீதம் MFE த்ரெஷோல்ட்',
  'metric.loserMfeP90.name': 'இழப்பாளர் MFE P90',
  'metric.loserMfeP90.description':
    'கட்டமைக்கப்பட்ட MAE/MFE டிஸ்ப்ளே யூனிட்டைப் பயன்படுத்தி, இழந்த மூடிய டிரேட்களின் 90வது சதவீதம் MFE த்ரெஷோல்ட்',
  'metric.timeInDrawdown.name': 'Drawdown-இல் நேரம்',
  'metric.timeInDrawdown.description':
    'முந்தைய realized P&L உயர்வுக்குக் கீழே கழிந்த நேரத்தின் சதவீதம்',
  'metric.avgRecoveryTime.name': 'சராசரி மீட்பு நேரம்',
  'metric.avgRecoveryTime.description':
    'மூடிய டிரேட் realized Drawdown-கள் புதிய உச்சத்திற்கு மீள எடுக்கும் சராசரி நேரம்',
  'metric.longestDrawdown.name': 'Longest Drawdown',
  'metric.longestDrawdown.description':
    'Realized Drawdown episode-இல் கழிந்த அதிகபட்ச நேரம்',
  'metric.drawdownEpisodes.name': 'Drawdown எபிசோடுகள்',
  'metric.drawdownEpisodes.description':
    'தற்போதைய வடிகட்டப்பட்ட டிரேட் தொகுப்பில் realized Drawdown காலங்களின் எண்ணிக்கை',
  'metric.category.performance': 'செயல்திறன்',
  'metric.category.volume': 'தொகுதி',

  'onboarding.wizard.skip-aria': 'இந்த படிநிலையைத் தவிர்க்கவும்',
  'onboarding.wizard.skip-onboarding': 'ஆன்போர்டிங்கைத் தவிர்க்கவும்',

  'guide.skip-guide': 'தவிர் வழிகாட்டி',

  'account.linked-trades.setups': 'Setups',

  'account.create.title': 'கணக்கை உருவாக்கவும்',
  'account.create.field.name': 'கணக்கு பெயர்',
  'account.create.field.name-desc':
    'உங்கள் டிரேட் கணக்கிற்கான தனித்துவமான பெயர்',
  'account.create.placeholder.name': 'எனது டிரேட் கணக்கு',
  'account.create.field.type': 'கணக்கு வகை',
  'account.create.field.type-desc': 'டிரேட் கணக்கு வகை',
  'account.create.field.initial-balance': 'ஆரம்ப இருப்பு',
  'account.create.field.initial-balance-desc':
    'கணக்கு இருப்பைத் தொடங்குதல் (விரும்பினால், இயல்புநிலை 0 க்கு)',
  'account.create.field.live-balance': 'நேரடி இருப்பு',
  'account.create.field.live-balance-desc': 'தற்போதைய தரகர் கணக்கு இருப்பு',
  'account.create.field.creation-date': 'உருவாக்கிய தேதி',
  'account.create.field.creation-date-desc': 'கணக்கு உருவாக்கப்பட்ட போது',
  'account.create.field.currency': 'நாணயம்',
  'account.create.field.currency-desc': 'காட்சிக்கான கணக்கின் சொந்த நாணயம்',
  'account.create.field.drawdown-type': 'Drawdown வகை',

  'account.create.field.drawdown-amount': 'Drawdown தொகை',
  'account.create.field.drawdown-amount-desc': 'அதிகபட்ச Drawdown வரம்பு',
  'account.create.field.profit-target-desc':
    'கணக்கிற்கான Profit Target-ஐ அமைக்கவும்',
  'account.create.field.monthly-cost': 'மாதாந்திர செலவு',
  'account.create.field.monthly-cost-desc': 'சந்தா கட்டணம், இயங்குதள செலவுகள்',
  'account.create.field.target-type': 'இலக்கு வகை',
  'account.create.field.target-type-desc': 'முழுமையான அல்லது சதவீதம்',
  'account.create.field.target-percent': 'இலக்கு (%)',
  'account.create.field.target-dollar': 'இலக்கு ($)',
  'account.create.field.target-percent-desc': 'சதவீத Profit Target',
  'account.create.field.target-dollar-desc': 'டாலர் தொகை இலக்கு',
  'account.create.field.target-date': 'இலக்கு தேதி (விரும்பினால்)',
  'account.create.field.target-date-desc': 'Profit Target-ஐ அடைய தேதி',
  'account.create.type.demo': 'டெமோ',
  'account.create.type.evaluation': 'மதிப்பீடு',
  'account.create.type.funded': 'Funded',
  'account.create.success': '"{name}" கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது',
  'account.create.error.name-required': 'கணக்கின் பெயர் தேவை',
  'account.create.error.name-exists':
    '"{name}" என்ற பெயரில் ஒரு கணக்கு ஏற்கனவே உள்ளது',
  'account.create.error.rule-incomplete':
    'இயக்கப்பட்ட ஒவ்வொரு விதிக்கும் பூஜ்ஜியத்திற்கு மேல் மதிப்பு தேவை',
  'account.create.error.balance-negative':
    'ஆரம்ப இருப்பு எதிர்மறையாக இருக்க முடியாது',
  'account.create.error.invalid-live-balance': 'லைவ் பேலன்ஸ் தவறானது',
  'account.create.error.drawdown-required':
    'Drawdown வகை இயக்கப்பட்டிருக்கும் போது Drawdown தொகை தேவைப்படுகிறது',
  'account.create.error.profit-target-required':
    'Profit Target இயக்கப்படும் போது Profit Target தொகை தேவை',
  'account.create.error.invalid-date': 'தவறான உருவாக்கத் தேதி',
  'account.create.error.future-date':
    'உருவாக்கும் தேதி எதிர்காலத்தில் இருக்க முடியாது',
  'account.create.error.cost-negative':
    'மாதாந்திர செலவு எதிர்மறையாக இருக்க முடியாது',
  'account.create.error.service-unavailable':
    'கணக்கு சேவை கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'account.create.error.fix-target-date':
    'கணக்கை உருவாக்கும் முன் Profit Target தேதிப் பிழையைச் சரிசெய்யவும்',
  'account.create.error.invalid-target-date': 'தவறான Profit Target தேதி',
  'account.create.error.failed': 'கணக்கை உருவாக்க முடியவில்லை: {error}',
  'account.add-event.title': 'வைப்பு / திரும்பப் பெறுதல் சேர்க்கவும்',
  'account.add-event.field.type': 'பரிவர்த்தனை வகை',
  'account.add-event.field.type-desc': 'வைப்பு அல்லது திரும்பப் பெறுதல்',
  'account.add-event.field.amount': 'தொகை',
  'account.add-event.field.amount-desc': '{currency} இல் தொகை',
  'account.add-event.field.date': 'தேதி',
  'account.add-event.field.date-desc': 'பரிவர்த்தனை தேதி',
  'account.add-event.field.description': 'விளக்கம் (விரும்பினால்)',
  'account.add-event.field.description-desc': 'கூடுதல் குறிப்புகள்',
  'account.add-event.type.deposit': 'டெபாசிட்',
  'account.add-event.type.withdrawal': 'வித்ட்ரா',
  'account.add-event.placeholder.deposit': 'கைமுறை வைப்பு',
  'account.add-event.placeholder.withdrawal': 'கைமுறையாக திரும்பப் பெறுதல்',
  'account.add-event.button.add': 'பரிவர்த்தனையைச் சேர்க்கவும்',
  'account.add-event.button.adding': 'சேர்க்கிறது...',
  'account.add-event.success':
    '{amount} இன் {type} வெற்றிகரமாக சேர்க்கப்பட்டது',
  'account.add-event.error.amount-required':
    'தொகை 0 ஐ விட அதிகமாக இருக்க வேண்டும்',
  'account.add-event.error.date-required': 'தேதி தேவை',
  'account.add-event.error.invalid-date': 'தவறான தேதி வடிவம்',
  'account.add-event.error.future-date':
    'பரிவர்த்தனை தேதி எதிர்காலத்தில் இருக்க முடியாது',
  'account.add-event.error.failed': 'பரிவர்த்தனையைச் சேர்ப்பதில் பிழை: {error}',
  'account.add-event.confirm.title': 'பரிவர்த்தனையை உறுதிப்படுத்தவும்',
  'account.add-event.confirm.message':
    '{date} இல் "{account}" கணக்கில் {amount} இன் {type} ஐச் சேர்க்கவா?',
  'account.add-event.confirm.description': 'விளக்கம்: {description}',
  'account.risk-metrics.loading': 'அபாய அளவீடுகளை ஏற்றுகிறது...',
  'account.risk-metrics.title': 'இடர் மேலாண்மை',
  'account.risk-metrics.drawdown-used': 'Drawdown வரம்பு பயன்படுத்தப்பட்டது',
  'account.risk-metrics.profit-target': 'Profit Target',
  'account.risk-metrics.status.breached': 'BREACHED',
  'account.risk-metrics.status.achieved': 'ACHIEVED',
  'account.risk-metrics.status.in-progress': 'செயல்பாட்டில் உள்ளது',
  'account.risk-metrics.not-set': 'அமைக்கப்படவில்லை',
  'account.risk-metrics.no-drawdown': 'Drawdown வரம்பு அமைக்கப்படவில்லை',
  'account.risk-metrics.no-profit-target': 'Profit Target அமைக்கப்படவில்லை',
  'account.risk-metrics.label.used': 'பயன்படுத்தப்பட்டது:',
  'account.risk-metrics.label.limit': 'வரம்பு:',
  'account.risk-metrics.label.remaining': 'மீதமுள்ளவை:',
  'account.risk-metrics.label.progress': 'முன்னேற்றம்:',
  'account.risk-metrics.label.target': 'இலக்கு:',
  'account.risk-metrics.label.target-date': 'இலக்கு தேதி:',
  'account.edit-event.title': 'திருத்து {type}',
  'account.edit-event.field.type': 'பரிவர்த்தனை வகை',
  'account.edit-event.field.type-desc': 'திருத்தும் போது மாற்ற முடியாது',
  'account.edit-event.field.amount': 'தொகை',
  'account.edit-event.field.amount-desc': '{currency} இல் தொகை',
  'account.edit-event.field.date': 'தேதி',
  'account.edit-event.field.date-desc': 'பரிவர்த்தனை தேதி',
  'account.edit-event.field.description': 'விளக்கம் (விரும்பினால்)',
  'account.edit-event.field.description-desc': 'கூடுதல் குறிப்புகள்',
  'account.edit-event.button.save': 'மாற்றங்களைச் சேமிக்கவும்',
  'account.edit-event.button.saving': 'சேமிக்கிறது...',
  'account.edit-event.button.delete': '{type} ஐ நீக்கு',
  'account.edit-event.button.deleting': 'நீக்குகிறது...',
  'account.edit-event.success.update': '{type} வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
  'account.edit-event.success.delete': '{type} வெற்றிகரமாக நீக்கப்பட்டது',
  'account.edit-event.error.update':
    'பரிவர்த்தனையைப் புதுப்பிப்பதில் பிழை: {error}',
  'account.edit-event.error.delete': 'பரிவர்த்தனையை நீக்குவதில் பிழை: {error}',
  'account.edit-event.delete-confirm.title': '{type} ஐ நீக்கு',
  'account.edit-event.delete-confirm.message':
    '{amount} இன் {type} ஐ {date} இலிருந்து நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
  'account.edit-event.delete-confirm.warning':
    'இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.',
  'account.edit.title': 'கணக்கைத் திருத்தவும்',
  'account.edit.field.name': 'கணக்கு பெயர்',
  'account.edit.field.name-desc': 'இந்தக் கணக்கிற்கான தனித்துவமான பெயர்',
  'account.edit.placeholder.name': 'எ.கா., எனது டிரேட் கணக்கு',
  'account.edit.field.type': 'கணக்கு வகை',
  'account.edit.field.type-desc': 'டிரேட் கணக்கு வகை',
  'account.edit.type.demo': 'டெமோ',
  'account.edit.type.evaluation': 'மதிப்பீடு',
  'account.edit.type.funded': 'Funded',
  'account.edit.field.initial-balance': 'ஆரம்ப இருப்பு',
  'account.edit.field.initial-balance-desc': 'கணக்கு இருப்பைத் தொடங்குதல்',
  'account.edit.field.live-balance': 'நேரடி இருப்பு',
  'account.edit.field.live-balance-desc': 'தற்போதைய தரகர் கணக்கு இருப்பு',
  'account.edit.field.creation-date': 'உருவாக்கிய தேதி',
  'account.edit.field.creation-date-desc': 'கணக்கு உருவாக்கப்பட்ட போது',
  'account.edit.field.currency': 'நாணயம்',
  'account.edit.field.currency-desc': 'காட்சிக்கான கணக்கின் சொந்த நாணயம்',
  'account.edit.field.drawdown-type': 'Drawdown வகை',

  'account.edit.field.drawdown-amount': 'Drawdown தொகை',
  'account.edit.field.drawdown-amount-desc':
    'தொடக்க இருப்பிலிருந்து அதிகபட்ச இழப்பு அனுமதிக்கப்படுகிறது',
  'account.edit.field.manual-snapshots': 'கைமுறை Drawdown ஸ்னாப்ஷாட்கள்',
  'account.edit.field.manual-snapshots-desc':
    'EOD டிரெய்லிங் Drawdown கணக்கீட்டிற்கான தினசரி இருப்பு ஸ்னாப்ஷாட்களை நிர்வகிக்கவும்',
  'account.edit.field.profit-target-desc':
    'கணக்கிற்கான Profit Target-ஐ அமைக்கவும்',
  'account.edit.field.monthly-cost': 'மாதாந்திர செலவு',
  'account.edit.field.monthly-cost-desc': 'சந்தா கட்டணம், இயங்குதள செலவுகள்',
  'account.copy-trading.title': 'Copy Trading',
  'account.copy-trading.description':
    'வரலாற்று நகல் காலங்களைப் பயன்படுத்தி மற்றொரு கணக்கிலிருந்து இந்தக் கணக்கின் செயல்திறனைப் பெறவும்.',
  'account.copy-trading.enable': 'இந்தக் கணக்கு மற்றொரு கணக்கை நகலெடுக்கிறது',
  'account.copy-trading.existing-trades-warning':
    'இந்தக் கணக்கில் ஏற்கனவே நேரடி டிரேட் உள்ளது. அவை அப்படியே இருக்கும், மேலும் நகலெடுக்கப்பட்ட டிரேட்கள் தேர்ந்தெடுக்கப்பட்ட தொடக்கத் தேதியிலிருந்து சேர்க்கப்படும்.',
  'account.copy-trading.base-account': 'அடிப்படை கணக்கு',
  'account.copy-trading.base-account-desc':
    'ஒரே நாணயம் அல்லாத நகல் கணக்குகளை மட்டுமே தேர்ந்தெடுக்க முடியும்.',
  'account.copy-trading.base-account-placeholder':
    'அடிப்படை கணக்கைத் தேர்ந்தெடுக்கவும்',
  'account.copy-trading.multiplier': 'பெருக்கி',
  'account.copy-trading.multiplier-desc':
    'அனுமதிக்கப்பட்ட வரம்பு: 0.1x முதல் 100x வரை',
  'account.copy-trading.all-history':
    'அனைத்து வரலாற்று டிரேட்களையும் நகலெடுக்கவும்',
  'account.copy-trading.start-date': 'தேதியிலிருந்து நகல்',
  'account.copy-trading.history': 'வரலாற்றை நகலெடுக்கவும்',
  'account.copy-trading.error.base-required':
    'நகல் டிரேட்டுக்கான அடிப்படைக் கணக்கைத் தேர்ந்தெடுக்கவும்.',
  'account.copy-trading.error.multiplier-range':
    'நகல் டிரேட் பெருக்கி 0.1x மற்றும் 100x இடையே இருக்க வேண்டும்.',
  'account.copy-trading.error.start-date-required':
    'நகல் டிரேட் தொடங்கும் தேதியைத் தேர்ந்தெடுக்கவும்.',
  'account.copy-trading.error.base-account-is-copied':
    'இந்தக் கணக்கு ஏற்கனவே அடிப்படைக் கணக்காகப் பயன்படுத்தப்பட்டு, மற்றொரு கணக்கை நகலெடுக்க முடியாது.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'இந்தக் கணக்கு தற்போது மற்றொரு நகல் கணக்கிற்கான அடிப்படையாகும்.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'அடிப்படை கணக்குகள் நகல் கணக்குகளாகவும் இருக்க முடியாது.',
  'account.edit.field.target-type': 'இலக்கு வகை',
  'account.edit.field.target-type-desc': 'முழுமையான அல்லது சதவீதம்',
  'account.edit.field.target-percent': 'இலக்கு (%)',
  'account.edit.field.target-dollar': 'இலக்கு ($)',
  'account.edit.field.target-percent-desc': 'சதவீத Profit Target',
  'account.edit.field.target-dollar-desc': 'டாலர் தொகை இலக்கு',
  'account.edit.field.target-date': 'இலக்கு தேதி (விரும்பினால்)',
  'account.edit.field.target-date-desc': 'Profit Target-ஐ அடைய தேதி',
  'account.edit.button.show-snapshots':
    'ஸ்னாப்ஷாட் மேலாளரைக் காட்டு ({count} பதிவுசெய்யப்பட்டது)',
  'account.edit.button.hide-snapshots':
    'ஸ்னாப்ஷாட் மேலாளரை மறை ({count} பதிவு செய்யப்பட்டது)',
  'account.edit.delete-warning': 'இது செயல்தவிர்க்க முடியாத நிரந்தர செயல்!',
  'account.drawdown.none': 'இல்லை',
  'account.drawdown.fixed': 'Fixed',
  'account.drawdown.eod-trailing': 'EOD டிரெயிலிங்',
  'account.drawdown.manual': 'Manual',
  'account.profit-target.enable': 'Profit Target-ஐ இயக்கு',
  'account.profit-target.type.absolute': 'முழுமையான தொகை',
  'account.profit-target.type.percentage': 'சதவீதம்',
  'account.create.button.creating': 'உருவாக்குகிறது...',
  'account.create.button.create': 'கணக்கை உருவாக்கவும்',
  'account.edit.button.saving': 'சேமிக்கிறது...',
  'account.edit.button.save': 'மாற்றங்களைச் சேமிக்கவும்',
  'account.edit.button.delete': 'கணக்கை நீக்கு',
  'account.edit.button.delete-name': '"{name}" ஐ நீக்கு',
  'account.edit.modal.update-notes.title':
    'இணைக்கப்பட்ட குறிப்புகளைப் புதுப்பிக்கவா?',
  'account.edit.modal.update-notes.message':
    'மறுபெயரிடுவது "{oldName}" ஐ "{newName}" என்று குறிப்பிடும் அனைத்து குறிப்புகளையும் புதுப்பிக்கும். தரவை சீராக வைத்திருக்க இது அவசியம்.',
  'account.edit.modal.update-notes.yes': 'சரி (புதுப்பிப்பு குறிப்புகள்)',
  'account.edit.modal.update-notes.no': 'பழைய பெயரை வைத்திருங்கள்',
  'account.edit.modal.update-notes.cancel': 'செயலை ரத்துசெய்',
  'account.edit.modal.change-date.title': 'உருவாக்கும் தேதியை மாற்றவும்',
  'account.edit.modal.change-date.message':
    '"{account}" கணக்கிற்கான உருவாக்க தேதியை {oldDate} இலிருந்து {newDate}க்கு மாற்ற உள்ளீர்கள்.',
  'account.edit.modal.change-date.warning':
    'இது ஆரம்ப டெபாசிட் பரிவர்த்தனை தேதியைப் புதுப்பிக்கும் மற்றும் கணக்கு வயது கணக்கீடுகள், மாதாந்திர பில்லிங் சுழற்சிகள் மற்றும் பிற தேதி அடிப்படையிலான அளவீடுகளை பாதிக்கலாம்.',

  'account.edit.modal.change-date.confirm':
    'உருவாக்கும் தேதியைப் புதுப்பிக்கவும்',
  'account.edit.modal.change-balance.title': 'ஆரம்ப இருப்பை மாற்றவும்',
  'account.edit.modal.change-balance.message':
    'ஆரம்ப இருப்பை {oldBalance} இலிருந்து {newBalance}க்கு மாற்ற உள்ளீர்கள்.',

  'account.edit.modal.change-balance.info':
    'இது அனைத்து இருப்பு கணக்கீடுகள், P&L சதவீதங்கள், டிராக்டவுன் கணக்கீடுகள் மற்றும் பரிவர்த்தனை வரலாறு ஆகியவற்றை பாதிக்கும்.',
  'account.edit.modal.change-balance.info2':
    'புதிய ஆரம்ப இருப்பு மற்றும் அனைத்து டிரேட் P&L ஆகியவற்றின் அடிப்படையில் தற்போதைய இருப்பு மீண்டும் கணக்கிடப்படும்.',
  'account.edit.modal.change-balance.info3':
    'இந்த மாற்றம் கணக்கு அளவீடுகள் மற்றும் வரலாற்று தரவு துல்லியத்தை கணிசமாக பாதிக்கலாம்.',
  'account.edit.modal.change-balance.confirm': 'ஆரம்ப இருப்பை புதுப்பிக்கவும்',
  'account.edit.modal.delete.title': 'கணக்கை நீக்கு',
  'account.edit.modal.delete.question':
    '"{name}" கணக்கை நிரந்தரமாக நீக்க விரும்புகிறீர்களா?',

  'account.edit.modal.delete.will': 'இந்த நடவடிக்கை:',
  'account.edit.modal.delete.item1':
    'அனைத்து கணக்கு மெட்டாடேட்டா மற்றும் அமைப்புகளையும் அகற்றவும்',
  'account.edit.modal.delete.item2':
    'இணைக்கப்பட்ட அனைத்து டிரேட்களிலிருந்தும் கணக்கு குறிப்புகளை அகற்றவும்',
  'account.edit.modal.delete.item3':
    'குறிப்புகளில் இருந்து தானாக உருவாக்கப்பட்ட கணக்கு குறிச்சொற்களை அகற்றவும்',
  'account.edit.modal.delete.delete-associated-trades':
    'எனது vault இலிருந்து இந்தக் கணக்குடன் இணைக்கப்பட்ட அனைத்து டிரேட்களையும் நீக்கவும்',
  'common.note-label': 'குறிப்பு:',

  'common.backups-label': 'காப்புப்பிரதிகள்:',
  'account.edit.error.name-required': 'கணக்கின் பெயர் தேவை',
  'account.edit.error.name-exists': '"{name}" கணக்கு ஏற்கனவே உள்ளது',
  'account.edit.error.creation-date-required': 'உருவாக்கிய தேதி தேவை',
  'account.edit.error.balance-required':
    'ஆரம்ப இருப்பு எதிர்மறையாக இருக்க முடியாது',
  'account.edit.error.invalid-live-balance': 'லைவ் பேலன்ஸ் தவறானது',
  'account.edit.error.drawdown-required':
    'Drawdown தொகை 0 ஐ விட அதிகமாக இருக்க வேண்டும்',
  'account.edit.error.future-date':
    'உருவாக்கும் தேதி எதிர்காலத்தில் இருக்க முடியாது',
  'account.edit.error.update-failed': 'கணக்கைப் புதுப்பிப்பதில் பிழை: {error}',
  'account.edit.error.service-unavailable': 'கணக்கு சேவை கிடைக்கவில்லை',
  'account.edit.error.delete-failed': 'கணக்கை நீக்குவதில் பிழை: {error}',
  'account.edit.success.updated':
    '"{name}" கணக்கு வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
  'account.edit.success.updated-with-references':
    'கணக்கு "{oldName}" இலிருந்து "{newName}" க்கு புதுப்பிக்கப்பட்டது மற்றும் அனைத்து குறிப்பு குறிப்புகளும் புதுப்பிக்கப்பட்டன',
  'account.edit.success.deleted': '"{name}" கணக்கு வெற்றிகரமாக நீக்கப்பட்டது',
  'button.next': 'அடுத்து',
  'button.discard': 'நிராகரி',
  'guide.scroll-to-target.title': 'வழிகாட்டியைத் தொடர உருட்டவும்',
  'guide.scroll-to-target.description':
    'அடுத்த கட்டம் ஆஃப்ஸ்கிரீன். தொடர ஸ்க்ரோல் செய்யவும் அல்லது Journalit உங்களை அங்கு அழைத்துச் செல்ல அனுமதிக்கவும்.',
  'guide.scroll-to-target.description-up':
    'அடுத்த படி பக்கத்தில் அதிகமாக உள்ளது. தொடர மேலே உருட்டவும் அல்லது Journalit உங்களை அங்கு அழைத்துச் செல்லட்டும்.',
  'guide.scroll-to-target.description-down':
    'அடுத்த படி பக்கத்தில் குறைவாக உள்ளது. தொடர்ந்து செல்ல கீழே உருட்டவும் அல்லது Journalit உங்களை அங்கு அழைத்துச் செல்ல அனுமதிக்கவும்.',
  'guide.scroll-to-target.button': 'எனக்குக் காட்டு',
  'templateEditor.loading': 'தளவமைப்பை ஏற்றுகிறது...',
  'templateEditor.mode.preview': 'முன்னோட்டம்',
  'templateEditor.mode.editor': 'ஆசிரியர்',
  'templateEditor.built-in-badge': '(உள்ளமைக்கப்பட்ட)',
  'templateEditor.built-in-notice':
    'உள்ளமைக்கப்பட்ட தளவமைப்புகளைத் திருத்த முடியாது. இந்த தளவமைப்பை நகலெடுக்கவும் அல்லது தனிப்பயனாக்க புதிய ஒன்றை உருவாக்கவும்.',
  'templateEditor.unsaved-changes': 'சேமிக்கப்படாத மாற்றங்கள்',
  'templateEditor.field.template-name': 'தளவமைப்பு பெயர்',
  'templateEditor.field.widgets': 'விட்ஜெட்டுகள் ({count})',
  'templateEditor.button.add-widget': '+ விட்ஜெட்டைச் சேர்க்கவும்',
  'templateEditor.button.widget-library-docs': 'விட்ஜெட் லைப்ரரி டாக்ஸ்',
  'templateEditor.widget.locked': 'பூட்டப்பட்டது',
  'templateEditor.widget.select-placeholder':
    'விட்ஜெட்டைத் தேர்ந்தெடுக்கவும்...',
  'templateEditor.widget.header-text-placeholder': 'தலைப்பு உரை...',
  'templateEditor.widget.markdown-zone-text-label': 'முன்னமைக்கப்பட்ட உரை',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'புதிய மதிப்பாய்வுக் குறிப்புகளில் செருகுவதற்கான உரை...',
  'templateEditor.widget.page-size': 'பக்க அளவு:',
  'templateEditor.widget.show-rating-column':
    'மதிப்பீட்டு நெடுவரிசையைக் காட்டு',
  'templateEditor.widget.demon-tracker.tracking-method':
    'இதன் மூலம் தவறுகளைக் கண்காணிக்கவும்:',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    'டிரேட் நிகழ்வுகள்',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    'பிழையுடன் குறிக்கப்பட்ட ஒவ்வொரு டிரேடும் கணக்கிடப்படுகிறது.',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days':
    'டிரேட் நாட்கள்',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    'டிரேட் மற்றும் தினசரி மதிப்பாய்வு தவறுகள் ஒன்றிணைக்கப்பட்டு டிரேட் நாளுக்கு ஒரு முறை கணக்கிடப்படும்.',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    'தினசரி மதிப்பாய்வு உள்ளீடுகள்',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    'தினசரி மதிப்பாய்வுகளில் பதிவுசெய்யப்பட்ட தவறுகள் மட்டுமே கணக்கிடப்படுகின்றன.',
  'templateEditor.widget.demon-tracker.stop-after':
    'பிறகு டிரேடை நிறுத்துங்கள்:',
  'notice.error.template-save-failed': 'தளவமைப்பைச் சேமிக்க முடியவில்லை',
  'builder.sidebar.title': 'தளவமைப்பு உருவாக்கி',
  'builder.sidebar.section.trade': 'டிரேட்',
  'builder.sidebar.section.drc': 'DRC',
  'builder.sidebar.section.weekly': 'வாராந்திர',
  'builder.sidebar.section.monthly': 'மாதாந்திர',
  'builder.sidebar.section.quarterly': 'காலாண்டு',
  'builder.sidebar.section.yearly': 'வருடாந்திர',
  'builder.sidebar.section.library': 'நூலகம்',
  'builder.sidebar.new-item': 'புதிய {title}',
  'builder.sidebar.coming-soon': 'விரைவில் வரும்',
  'builder.sidebar.built-in': 'உள்ளமைக்கப்பட்ட',
  'builder.sidebar.default-template': 'இயல்புநிலை தளவமைப்பு',
  'builder.sidebar.set-as-default': 'இயல்புநிலையாக அமைக்கவும்',
  'builder.sidebar.duplicate': 'நகல்',
  'builder.sidebar.delete': 'நீக்கு',
  'builder.sidebar.no-templates': 'இன்னும் தளவமைப்புகள் இல்லை',
  'builder.sidebar.share-template': 'பகிர்வு தளவமைப்பு',
  'builder.sidebar.new-template-name': 'புதிய {type} தளவமைப்பு',
  'builder.sidebar.copy-suffix': '(நகல்)',
  'notice.default-trade-template-updated':
    'இயல்புநிலை டிரேட் தளவமைப்பு புதுப்பிக்கப்பட்டது',
  'notice.trade-template-duplicated': 'டிரேட் தளவமைப்பு நகலெடுக்கப்பட்டது',
  'notice.trade-template-deleted': 'டிரேட் தளவமைப்பு நீக்கப்பட்டது',
  'notice.error.create-template': 'தளவமைப்பை உருவாக்க முடியவில்லை',
  'notice.error.duplicate-template': 'தளவமைப்பை நகலெடுக்க முடியவில்லை',
  'notice.error.delete-template': 'தளவமைப்பை நீக்க முடியவில்லை',
  'account.weight-legend.aria-label': 'கணக்கு வகை விநியோக புராணம்',
  'account.weight-legend.item-aria-label': '{name}: {percent}',
  'account.transaction.deposit': 'டெபாசிட்',
  'account.transaction.withdrawal': 'வித்ட்ரா',
  'account.transaction.click-to-edit':
    'இந்தப் பரிவர்த்தனையைத் திருத்த அல்லது நீக்க கிளிக் செய்யவும்',
  'account.deposits-withdrawals.title':
    'வைப்பு மற்றும் திரும்பப் பெறுதல் ({count})',
  'account.deposits-withdrawals.empty':
    'கைமுறையாக வைப்பு அல்லது திரும்பப் பெறுதல் எதுவும் பதிவு செய்யப்படவில்லை.',
  'account.deposits-withdrawals.empty-sub':
    'உங்கள் முதல் பரிவர்த்தனையைச் சேர்க்க, தலைப்பில் உள்ள + பொத்தானைக் கிளிக் செய்யவும்.',
  'settings.reset.modal.title': 'அமைப்புகளை இயல்புநிலைக்கு மீட்டமைக்கவா?',
  'settings.reset.modal.explanation':
    'இது அனைத்து செருகுநிரல் அமைப்புகளையும் அவற்றின் இயல்புநிலை மதிப்புகளுக்கு மீட்டமைக்கும். இதில் அடங்கும்:',
  'settings.reset.modal.item-custom-options':
    'அனைத்து தனிப்பயன் விருப்பங்களும் (டிக்கர்கள், Setups, தவறுகள்)',
  'settings.reset.modal.item-account-settings':
    'கணக்கு அமைப்புகள் மற்றும் மெட்டாடேட்டா',
  'settings.reset.modal.item-dashboard-layouts': 'டாஷ்போர்டு தளவமைப்புகள்',
  'settings.reset.modal.item-symbol-mappings': 'சின்ன மேப்பிங்',
  'settings.reset.modal.item-csv-templates': 'CSV வார்ப்புருக்கள்',
  'settings.reset.modal.item-other': 'மற்ற அனைத்து தனிப்பயனாக்கங்கள்',
  'settings.reset.modal.backup-note':
    'மீட்டமைப்பதற்கு முன் காப்புப்பிரதி உருவாக்கப்படும்.',
  'settings.reset.modal.warning':
    'இந்தச் செயலைச் செயல்தவிர்க்க முடியாது (காப்புப் பிரதியிலிருந்து மீட்டெடுப்பதைத் தவிர).',
  'settings.reset.backup-failed.title': 'காப்புப்பிரதி தோல்வியடைந்தது',
  'settings.reset.backup-failed.message':
    'உங்கள் தற்போதைய அமைப்புகளின் காப்புப்பிரதியை உருவாக்க முடியவில்லை.',
  'settings.reset.backup-failed.warning':
    'மீட்டமைப்பைத் தொடர்ந்தால், உங்கள் தற்போதைய அமைப்புகளை மீட்டெடுக்க முடியாது.',
  'notice.settings-reset-with-backup':
    'அமைப்புகள் இயல்புநிலைக்கு மீட்டமைக்கப்படுகின்றன. காப்புப்பிரதி உருவாக்கப்பட்டது. எல்லா மாற்றங்களையும் செயல்படுத்த Obsidian ஐ மீண்டும் தொடங்கவும்.',
  'notice.settings-reset-no-backup':
    'அமைப்புகள் இயல்புநிலைக்கு மீட்டமைக்கப்படுகின்றன. காப்புப்பிரதி உருவாக்கப்படவில்லை. எல்லா மாற்றங்களையும் செயல்படுத்த Obsidian ஐ மீண்டும் தொடங்கவும்.',
  'home.quick-links.hide': 'விரைவான இணைப்பை மறை',
  'home.quick-links.add-trade': 'டிரேடைச் சேர்க்கவும்',
  'home.quick-links.trade-log': 'டிரேட் பதிவு',
  'home.quick-links.trading-dashboard': 'டாஷ்போர்டு',
  'home.quick-links.account-dashboard': 'கணக்குகள்',
  'home.quick-links.todays-drc': 'இன்றைய DRC',
  'home.quick-links.weekly-review': 'இந்த வார மதிப்பாய்வு',
  'home.quick-links.monthly-review': 'இந்த மாத மதிப்பாய்வு',
  'home.quick-links.quarterly-review': 'இந்த காலாண்டு மதிப்பாய்வு',
  'home.quick-links.yearly-review': 'இந்த ஆண்டு மதிப்பாய்வு',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'தளவமைப்பு உருவாக்கி',
  'home.quick-links.navigation-sidebar': 'வழிசெலுத்தல் பக்கப்பட்டி',
  'home.quick-links.session-mode': 'அமர்வு முறை',
  'home.quick-links.move-above':
    'விட்ஜெட்டுகளுக்கு மேலே விரைவான இணைப்புகளை நகர்த்தவும்',
  'home.quick-links.move-below':
    'விட்ஜெட்டுகளுக்கு கீழே உள்ள விரைவான இணைப்புகளை நகர்த்தவும்',
  'home.widget-selector.title': 'முகப்பில் சேர்',
  'home.widget-selector.section.widgets': 'விட்ஜெட்கள்',
  'home.widget-selector.section.quick-links': 'விரைவு இணைப்புகள்',
  'home.widget-selector.restore': 'மீட்டமை',
  'home.widget-selector.add-shortcut': 'கணக்கு/அமைப்பு குறுக்குவழி சேர்',
  'home.widget-selector.hint.navigate': '↑↓ வழிசெலுத்தவும்',
  'home.widget-selector.hint.select': '↵ தேர்ந்தெடுக்கவும்',
  'home.widget-selector.hint.close': 'esc மூடு',
  'home.period.month': 'மாதம்',
  'home.period.quarter': 'காலாண்டு',
  'home.period.year': 'ஆண்டு',
  'home.period.lifetime': 'எல்லா நேரமும்',

  'home.aria.filter-trade-types': 'வடிகட்டி டிரேட் வகைகள்',
  'home.aria.open-settings': 'Journalit அமைப்புகளைத் திற',
  'home.aria.save-layout': 'தளவமைப்பைச் சேமிக்கவும்',
  'home.aria.customize': 'தனிப்பயனாக்கு',
  'home.button.add-widget': 'விட்ஜெட்டைச் சேர்க்கவும்',

  'home.greeting.welcome': 'Journalitக்கு வரவேற்கிறோம்!',
  'home.greeting.hey': 'ஏய்',
  'home.greeting.nightowl': 'ஏய் நைட்டோவ்ல்',
  'home.greeting.still-up': 'இன்னும் மேலே?',
  'home.greeting.late-night': 'தாமதமான இரவு அமர்வு?',
  'home.greeting.midnight-oil': 'நள்ளிரவில் எண்ணெய் எரிகிறதா?',
  'home.greeting.good-morning': 'காலை வணக்கம்',
  'home.greeting.rise-and-shine': 'எழுந்து பிரகாசிக்கவும்',
  'home.greeting.morning-trader': 'காலை வியாபாரி',
  'home.greeting.ready-conquer': 'நாளை வெல்ல தயாரா?',
  'home.greeting.fresh-start': 'புதிய தொடக்கம்',
  'home.greeting.good-afternoon': 'நல்ல மதியம்',
  'home.greeting.day-going-well':
    'உங்கள் நாள் நன்றாக இருக்கும் என்று நம்புகிறேன்',
  'home.greeting.afternoon-checkin': 'மதியம் செக்-இன்',
  'home.greeting.midday-momentum': 'மதிய வேகம்',
  'home.greeting.hows-it-going': 'எப்படி போகிறது?',
  'home.greeting.good-evening': 'மாலை வணக்கம்',
  'home.greeting.winding-down': 'முறுக்கு?',
  'home.greeting.evening-review': 'மாலை மதிப்பாய்வு',
  'home.greeting.how-did-today-go': 'இன்று எப்படி சென்றது?',
  'home.greeting.time-to-reflect': 'பிரதிபலிக்க வேண்டிய நேரம்',
  'home.greeting.welcome-back': 'மீண்டும் வரவேற்கிறோம்',
  'home.greeting.name-placeholder': 'உங்கள் பெயர்',
  'home.greeting.edit-name-aria': '{name}. காட்சிப் பெயரைத் திருத்து',
  'home.greeting.hey-there': 'வணக்கம்',
  'home.greeting.good-to-see-you': 'உங்களைப் பார்த்ததில் மகிழ்ச்சி',
  'home.subtitle.first-time': 'உங்கள் டிரேட் பயணத்தைத் தொடங்குவோம்',
  'home.subtitle.see-how-doing':
    'நீங்கள் எப்படி இருக்கிறீர்கள் என்று பார்ப்போம்',
  'home.subtitle.elevate-trading': 'உங்கள் டிரேடை உயர்த்துவதற்கான நேரம்',
  'home.subtitle.journey-continues': 'உங்கள் டிரேட் பயணம் தொடர்கிறது',
  'home.subtitle.check-progress': 'உங்கள் முன்னேற்றத்தைச் சரிபார்ப்போம்',
  'home.subtitle.ready-elevate': 'உங்கள் டிரேடை உயர்த்த தயாரா?',
  'home.subtitle.agenda-today': 'இன்றைய நிகழ்ச்சி நிரலில் என்ன இருக்கிறது?',
  'home.subtitle.trading-going': 'உங்கள் டிரேட் எப்படி நடக்கிறது?',
  'home.grid.error.title': 'கட்ட தளவமைப்பு பிழை',
  'home.grid.error.message': 'பிழை: {error}',
  'home.grid.error.retry': 'மீண்டும் முயல்க',
  'home.grid.widget.remove-aria': 'விட்ஜெட்டை அகற்று',
  'home.grid.widget.unknown-type': 'அறியப்படாத விட்ஜெட் வகை: {widgetId}',
  'home.widget.unreviewed.all-reviewed':
    'அனைத்து டிரேட்களும் மதிப்பாய்வு செய்யப்பட்டன',
  'home.widget.unreviewed.title-review':
    'மதிப்பாய்வு செய்ய டிரேட் பதிவைத் திறக்கவும்',
  'home.widget.unreviewed.need-review.one':
    '{count} டிரேட்டுக்கு மதிப்பாய்வு தேவை',
  'home.widget.unreviewed.need-review.few':
    '{count} டிரேட்களுக்கு மதிப்பாய்வு தேவை',
  'home.widget.unreviewed.need-review.many':
    '{count} டிரேட்களுக்கு மதிப்பாய்வு தேவை',
  'home.widget.unreviewed.need-review.other':
    '{count} டிரேட்களுக்கு மதிப்பாய்வு தேவை',
  'home.widget.unreviewed.today': 'இன்று {count}',
  'home.widget.unreviewed.this-week': 'இந்த வாரம் {count}',
  'home.widget.embedded-note.title': 'உட்பொதிக்கப்பட்ட குறிப்பு',
  'home.widget.embedded-note.select-note': 'ஒரு குறிப்பைத் தேர்ந்தெடுக்கவும்',
  'home.widget.embedded-note.search-placeholder': 'குறிப்புகளைத் தேடு...',
  'home.widget.embedded-note.no-notes': 'குறிப்புகள் எதுவும் கிடைக்கவில்லை',

  'home.widget.embedded-note.open-note': 'குறிப்பைத் திறக்க கிளிக் செய்யவும்',
  'home.widget.embedded-note.change-note': 'குறிப்பை மாற்றவும்',
  'home.widget.embedded-note.error.not-found': 'கோப்பு கிடைக்கவில்லை: {path}',
  'home.widget.embedded-note.error.load-failed':
    'குறிப்பு உள்ளடக்கத்தை ஏற்றுவதில் தோல்வி',
  'home.widget.embedded-note.error.deleted': 'மூலக் கோப்பு நீக்கப்பட்டது',
  'home.widget.goals-progress.type.pnl': 'P&L இலக்கு',
  'home.widget.goals-progress.type.pnl-desc':
    'ஒரு காலத்திற்கு லாபம்/இழப்பு இலக்கு',
  'home.widget.goals-progress.type.trades-logged': 'டிரேட் எண்ணிக்கை',
  'home.widget.goals-progress.type.trades-logged-desc':
    'வாழ்நாள் டிரேட் எண்ணிக்கை',
  'home.widget.goals-progress.type.win-rate': 'Win Rate',
  'home.widget.goals-progress.type.win-rate-desc': 'வெற்றி சதவீதம் இலக்கு',
  'home.widget.goals-progress.period.daily': 'தினசரி',
  'home.widget.goals-progress.period.weekly': 'வாராந்திர',
  'home.widget.goals-progress.period.monthly': 'மாதாந்திர',
  'home.widget.goals-progress.period-label.today': 'இன்று',
  'home.widget.goals-progress.period-label.this-week': 'இந்த வாரம்',
  'home.widget.goals-progress.period-label.this-month': 'இந்த மாதம்',
  'home.widget.goals-progress.period-label.total': 'மொத்தம்',
  'home.widget.goals-progress.trades-count': '{count} டிரேட்கள்',
  'home.widget.goals-progress.set-goal': 'இலக்கை அமைக்கவும்',
  'home.widget.goals-progress.target': 'இலக்கு',
  'home.widget.goals-progress.tracks-lifetime':
    'மொத்த வாழ்நாளைக் கண்காணிக்கிறது',
  'home.widget.goals-progress.use-r-multiples':
    'R-பன்மடங்குகளைப் பயன்படுத்தவும்',
  'home.widget.goals-progress.account-aware': 'கணக்கு விழிப்புணர்வு இலக்குகள்',
  'home.widget.goals-progress.no-target-selected':
    'தேர்ந்தெடுக்கப்பட்ட கணக்கிற்கு இலக்கு இல்லை',
  'home.widget.goals-progress.configured-for':
    '{accounts} க்காக கட்டமைக்கப்பட்டது',
  'home.widget.goals-progress.account-scope': 'கணக்கு நோக்கம்',
  'home.widget.goals-progress.add-account': 'கணக்கைச் சேர்க்கவும்',
  'home.widget.goals-progress.click-to-set': 'இலக்கை அமைக்க கிளிக் செய்யவும்',
  'home.widget.goals-progress.header.pnl': 'P&L இலக்கு',
  'home.widget.goals-progress.header.trades': 'டிரேட் இலக்கு',
  'home.widget.goals-progress.header.win-rate': 'Win Rate இலக்கு',
  'home.widget.goals-progress.of-target': 'இன் {target} {period}',
  'home.widget.goals-progress.complete-100': '100% முடிந்தது',
  'home.widget.goals-progress.complete-percent': '{percent}% முடிந்தது',
  'home.widget.goals-progress.goal-reached': 'இலக்கை எட்டியது',
  'home.widget.goals-progress.aria.save-goal': 'இலக்கைச் சேமிக்கவும்',
  'home.widget.goals-progress.aria.set-goal': 'ஒரு இலக்கை அமைக்கவும்',
  'home.widget.goals-progress.aria.change-goal':
    'இலக்கை மாற்ற கிளிக் செய்யவும்',
  'home.widget.best-hours.title': 'சிறந்த மணிநேரம்',
  'home.widget.best-hours.no-data': 'டிரேட் தரவு இல்லை',
  'home.widget.best-hours.period-aria':
    '{label}: {pnl} சராசரி P&L ஒரு டிரேட், {count} டிரேட்',
  'home.widget.best-hours.trades-count': '{count} டிரேட்கள்',
  'home.widget.best-hours.win-rate': '{rate}% வெற்றி',
  'home.widget.best-hours.win-rate-na': 'Win Rate கிடைக்கவில்லை',
  'home.widget.best-hours.days-count': '{count} நாட்கள்',
  'home.widget.best-hours.avg-per-trade': 'சராசரி/டிரேட்',

  'home.widget.best-hours.hidden': 'மறைக்கப்பட்டது',
  'home.widget.best-hours.hidden-detail': 'தனியுரிமை முறை',
  'home.widget.best-hours.no-positive-window': 'நேர்மறை சாளரம் இல்லை',
  'home.widget.best-hours.insufficient-history': 'மேலும் தரவு வேண்டும்',
  'home.widget.best-hours.sample-requirement': '{count}/2 மாதிரி சாளரங்கள்',
  'home.widget.best-hours.developing': 'வளரும்',
  'home.widget.best-hours.no-positive-detail': 'மாதிரி சாளரங்கள் எதிர்மறையானவை',

  'home.widget.aum.title': 'AUM',
  'home.widget.aum.period.month': 'இந்த மாதம்',
  'home.widget.aum.period.quarter': 'இந்த காலாண்டு',
  'home.widget.aum.period.year': 'இந்த ஆண்டு',
  'home.widget.aum.period.all': 'எல்லா நேரமும்',
  'home.widget.aum.unable-to-load': 'ஏற்ற முடியவில்லை',
  'home.widget.aum.no-accounts': 'கணக்குகள் இல்லை',
  'home.widget.aum.account-count': '{count} கணக்கு',
  'home.widget.aum.account-count-plural': '{count} கணக்குகள்',
  'home.widget.streak.title': 'ஸ்ட்ரீக்',
  'home.widget.streak.period.month': 'இந்த மாதம்',
  'home.widget.streak.period.quarter': 'இந்த காலாண்டில்',
  'home.widget.streak.period.year': 'இந்த ஆண்டு',
  'home.widget.streak.period.ever': 'எப்போதும்',
  'home.widget.streak.win': 'வெற்றி',
  'home.widget.streak.wins': 'வெற்றி பெறுகிறது',
  'home.widget.streak.loss': 'இழப்பு',
  'home.widget.streak.losses': 'இழப்புகள்',
  'home.widget.streak.in-a-row': 'ஒரு வரிசையில்',
  'home.widget.streak.no-active': 'செயலில் ஸ்ட்ரீக் இல்லை',
  'home.widget.streak.start-trading':
    'ஒரு ஸ்ட்ரீக்கை உருவாக்க டிரேடைத் தொடங்குங்கள்',
  'home.widget.streak.best-streak': 'உங்கள் சிறந்த தொடர் {period}',
  'home.widget.streak.above-average': 'உங்கள் சராசரிக்கு மேல் {period}',
  'home.widget.streak.stay-focused': 'கவனத்துடன் இருங்கள், தொடருங்கள்',
  'home.widget.streak.keep-going': 'தொடருங்கள்',
  'home.widget.streak.good-start': 'நல்ல தொடக்கம்',
  'home.widget.streak.pause': 'உங்கள் அடுத்த டிரேட்டுக்கு முன் இடைநிறுத்தவும்',
  'home.widget.streak.review': 'அடுத்த டிரேட்டுக்கு முன் மதிப்பாய்வு செய்யவும்',
  'home.widget.streak.losses-process':
    'இழப்புகள் செயல்முறையின் ஒரு பகுதியாகும்',
  'home.widget.streak.best': 'சிறந்த',
  'home.widget.streak.avg': 'சராசரி',
  'home.widget.drawdown.title': 'Drawdown வரம்பு',
  'home.widget.drawdown.breached': 'மீறப்பட்டது',
  'home.widget.drawdown.remaining': 'மீதமுள்ள',
  'home.widget.drawdown.unable-to-load': 'ஏற்ற முடியவில்லை',
  'home.widget.drawdown.no-accounts': 'வரம்புகளுடன் கணக்குகள் இல்லை',
  'home.widget.profit-target.title': 'Profit Target',
  'home.widget.profit-target.achieved': 'சாதித்தது',
  'home.widget.profit-target.remaining': 'மீதமுள்ள',
  'home.widget.profit-target.unable-to-load': 'ஏற்ற முடியவில்லை',
  'home.widget.profit-target.no-accounts': 'இலக்குகளுடன் கணக்குகள் இல்லை',
  'home.widget.recent.title': 'சமீபத்திய',
  'home.widget.recent.unknown': 'தெரியாதது',
  'home.widget.recent.just-now': 'இப்போதுதான்',
  'home.widget.recent.minutes-ago': '{minutes}m முன்பு',
  'home.widget.recent.hours-ago': '{hours}h முன்பு',
  'home.widget.recent.days-ago': '{days}d முன்பு',
  'home.widget.recent.no-items': 'இதுவரை சமீபத்திய உருப்படிகள் எதுவும் இல்லை',
  'home.widget.recent.hint':
    'கோப்புகள் அல்லது காட்சிகளை இங்கே பார்க்க அவற்றைத் திறக்கவும்',
  'home.widget.top-breakdown.title': 'டாப் {dimension}',
  'home.widget.top-breakdown.configure-title': 'மேல் {dimension} தனிப்பயனாக்கு',
  'home.widget.top-breakdown.aria.customize':
    'Top {dimension} ஐ தனிப்பயனாக்க கிளிக் செய்யவும்',
  'home.widget.setups.title': 'டாப் Setups',

  'home.widget.setups.trades-count': '{count} டிரேட்கள்',
  'home.widget.setups.win-rate': '{rate}% Win Rate',
  'home.widget.weekly.title': 'இந்த வாரம்',
  'home.widget.weekly.no-trades': 'இந்த வாரம் இன்னும் டிரேட் இல்லை',
  'home.widget.weekly.breakeven': 'இந்த வாரம் இதுவரை Breakeven',
  'home.widget.weekly.losing-days': '{count} தொடர்ச்சியாக நாட்களை இழக்கிறது',
  'home.widget.weekly.winning-days': '{count} வெற்றி நாட்கள் நேராக',
  'home.widget.weekly.above-average': 'உங்கள் வாராந்திர சராசரிக்கு மேல்',
  'home.widget.weekly.below-average': 'உங்கள் வாராந்திர சராசரிக்குக் கீழே',
  'home.widget.weekly.better-than-last': 'கடந்த வாரத்தை விட சிறந்தது',
  'home.widget.weekly.slower-than-last': 'கடந்த வாரத்தை விட மெதுவாக',
  'home.widget.weekly.on-track': 'இந்த வாரம் பாதையில்',
  'home.widget.weekly.room-to-recover': 'மீட்க அறை',
  'home.widget.weekly.solid-start': 'வாரத்தின் உறுதியான ஆரம்பம்',
  'home.widget.weekly.early-in-week': 'வாரத்தின் ஆரம்பத்தில்',
  'home.widget.weekly.no-trade-data': 'டிரேட் தரவு இல்லை',
  'home.widget.weekly.trade': 'டிரேட்',
  'home.widget.weekly.trades': 'டிரேட் செய்கிறது',
  'home.widget.weekly.no-trades-tooltip': 'டிரேட் இல்லை',
  'home.widget.heatmap.last-3-months': 'கடந்த 3 மாதங்கள்',
  'home.widget.heatmap.last-6-months': 'கடந்த 6 மாதங்கள்',
  'home.widget.heatmap.year-activity': '{year} செயல்பாடு',
  'home.widget.heatmap.select-year': 'ஆண்டைத் தேர்ந்தெடுக்கவும்',
  'home.widget.heatmap.close-selector': 'ஆண்டு தேர்வாளரை மூடு',
  'calendar.weekday.mon': 'திங்கள்',
  'calendar.weekday.tue': 'செவ்வாய்',
  'calendar.weekday.wed': 'புதன்',
  'calendar.weekday.thu': 'வியாழன்',
  'calendar.weekday.fri': 'வெள்ளி',
  'calendar.weekday.sat': 'சனி',
  'calendar.weekday.sun': 'சூரியன்',
  'calendar.pnl': 'P&L',
  'calendar.week': 'WEEK',
  'calendar.trade': '{count} டிரேட்',
  'calendar.trades': '{count} டிரேட்கள்',
  'calendar.reviewed': 'மதிப்பாய்வு செய்யப்பட்டது',
  'calendar.month.january': 'ஜனவரி',
  'calendar.month.february': 'பிப்ரவரி',
  'calendar.month.march': 'மார்ச்',
  'calendar.month.april': 'ஏப்ரல்',
  'calendar.month.june': 'ஜூன்',
  'calendar.month.july': 'ஜூலை',
  'calendar.month.august': 'ஆகஸ்ட்',
  'calendar.month.september': 'செப்டம்பர்',
  'calendar.month.october': 'அக்டோபர்',
  'calendar.month.november': 'நவம்பர்',
  'calendar.month.december': 'டிசம்பர்',

  'shared.collapsible.active-filters': '{count} செயலில் உள்ள வடிப்பான்கள்',
  'filter.modal.title': 'மேம்பட்ட வடிப்பான்கள்',
  'filter.modal.active-filters': 'செயலில் உள்ள வடிப்பான்கள் ({count}):',
  'filter.modal.no-active-filters': 'செயலில் வடிப்பான்கள் இல்லை',
  'filter.modal.clear-all': 'அனைத்தையும் அழிக்கவும்',
  'filter.modal.section.trading-data': 'டிரேட் தரவு',
  'filter.modal.section.classification': 'வகைப்பாடு',
  'filter.modal.section.trade-criteria': 'டிரேட் அளவுகோல்கள்',
  'filter.modal.no-setup': 'இல்லை Setup',
  'filter.modal.no-tags': 'குறிச்சொற்கள் இல்லை',
  'filter.modal.no-mistakes': 'தவறுகள் இல்லை',
  'filter.modal.type.regular': 'வழக்கமான',
  'filter.modal.type.missed': 'தவறவிட்டது',
  'filter.modal.type.backtest': 'Backtest',
  'filter.summary.regular-trades': 'வழக்கமான டிரேட்',
  'filter.modal.status.win': 'வெற்றி',
  'filter.modal.status.loss': 'நட்டம்',
  'filter.modal.status.breakeven': 'Breakeven',
  'filter.modal.status.open': 'திறந்தவை',
  'filter.modal.status.closed': 'மூடப்பட்டது',

  'filter.modal.review-status.reviewed': 'மதிப்பாய்வு செய்யப்பட்டது',
  'filter.modal.review-status.unreviewed': 'மதிப்பாய்வு செய்யப்படவில்லை',
  'filter.modal.direction.long-call': 'Long/அழை',
  'filter.modal.direction.short-put': 'Short/Put',
  'filter.modal.section.custom-fields': 'தனிப்பயன் புலங்கள்',
  'filter.modal.custom-field.n-selected': '{count} தேர்ந்தெடுக்கப்பட்டது',
  'filter.modal.custom-field.none-available': 'மதிப்புகள் இல்லை',
  'widget.checklist.title': 'டிரேட்டுக்கு முந்தைய சரிபார்ப்பு பட்டியல்',
  'widget.checklist.weekly-title': 'வாராந்திர முன் சரிபார்ப்பு பட்டியல்',
  'widget.checklist.tooltip.day-only':
    'இங்கு சேர்க்கப்படும் பொருட்கள் இன்று வரை மட்டுமே பொருந்தும்.',
  'widget.checklist.tooltip.weekly':
    'இங்கே சேர்க்கப்படும் பொருட்கள் இந்த வாரத்திற்கு மட்டுமே பொருந்தும்.',
  'widget.checklist.tooltip.settings-link':
    'அனைத்து புதிய DRCs இல் தொடர்ச்சியான உருப்படிகளுக்கு, அமைப்புகள் > மதிப்பாய்வுகள் என்பதற்குச் செல்லவும்.',
  'widget.checklist.tooltip.weekly-settings-link':
    'அனைத்து புதிய வாராந்திர மதிப்பாய்வுகளிலும் தொடர்ச்சியான உருப்படிகளுக்கு, அமைப்புகள் > மதிப்பாய்வுகள் என்பதற்குச் செல்லவும்.',
  'widget.checklist.completed': 'நிறைவு',
  'widget.checklist.edit-item': 'உருப்படியைத் திருத்தவும்',
  'widget.checklist.delete-item': 'உருப்படியை நீக்கு',
  'widget.checklist.empty.preview':
    'சரிபார்ப்புப் பட்டியல் உருப்படிகள் எதுவும் கட்டமைக்கப்படவில்லை',
  'widget.checklist.empty.add-one':
    'சரிபார்ப்பு பட்டியல் உருப்படிகள் இல்லை. கீழே ஒன்றைச் சேர்க்கவும்.',
  'widget.checklist.placeholder':
    'புதிய சரிபார்ப்புப் பட்டியல் உருப்படியைச் சேர்க்கவும்...',
  'widget.checklist.invalid-context':
    "சரிபார்ப்புப் பட்டியல் விட்ஜெட்டுக்கு DRC அல்லது வாராந்திர மதிப்பாய்வுக் குறிப்பு தேவை (frontmatter type: 'drc' அல்லது 'weekly-review')",
  'widget.session-mistakes.title': 'அமர்வு தவறுகள்',
  'widget.session-mistakes.subtitle':
    'ஒவ்வொரு டிரேட்டிலும் தவறுகளை மீண்டும் செய்வதற்குப் பதிலாக அமர்வுக்கு ஒரு முறை பதிவு செய்யவும்.',

  'widget.session-mistakes.placeholder':
    'தவறுகளைத் தேர்ந்தெடுக்கவும் அல்லது உருவாக்கவும்',
  'widget.session-mistakes.empty': 'அமர்வு தவறுகள் பதிவு செய்யப்படவில்லை',

  'widget.session-mistakes.invalid-context':
    "அமர்வு தவறுகள் விட்ஜெட்டுக்கு DRC குறிப்பு தேவை (frontmatter type: 'drc')",
  'widget.directional-pnl.title.long': 'Long டிரேட்கள் P&L',
  'widget.directional-pnl.title.short': 'Short டிரேட்கள் P&L',
  'widget.directional-pnl.empty.not-enough':
    'திசை பகுப்பாய்விற்கு போதுமான டிரேட் இல்லை',
  'widget.directional-pnl.empty.no-closed':
    'இந்தக் காலத்திற்கு மூடப்பட்ட டிரேட் இல்லை',
  'widget.directional-pnl.empty.no-long':
    'இந்த காலகட்டத்தில் Long டிரேட் இல்லை',
  'widget.directional-pnl.empty.no-short':
    'இந்த காலகட்டத்தில் Short டிரேட் இல்லை',
  'widget.directional-drawdown.title.long': 'Long Drawdown',
  'widget.directional-drawdown.title.short': 'Short Drawdown',
  'widget.directional-drawdown.empty.not-enough':
    'திசை பகுப்பாய்விற்கு போதுமான மூடிய டிரேட்கள் இல்லை',
  'widget.directional-drawdown.empty.no-closed':
    'இந்தக் காலக்கட்டத்தில் மூடப்பட்ட திசை டிரேட்கள் இல்லை',
  'widget.directional-drawdown.empty.no-long':
    'இந்தக் காலத்திற்கு Long மூடிய டிரேட்கள் இல்லை',
  'widget.directional-drawdown.empty.no-short':
    'இந்தக் காலத்திற்கு Short மூடிய டிரேட்கள் இல்லை',
  'widget.missed-trades.title': 'தவறவிட்ட டிரேட்கள்',
  'widget.missed-trades.add-button': 'சேர்',
  'widget.missed-trades.add-aria': 'தவறவிட்ட டிரேடைச் சேர்க்கவும்',

  'widget.missed-trades.additional-setups': 'கூடுதல் Setups:',
  'widget.missed-trades.no-trades-today': 'இன்று இல்லை',
  'widget.missed-trades.no-trades-week': 'இந்த வாரம் தவறவிட்ட டிரேட் இல்லை',
  'widget.missed-trades.invalid-context':
    'தவறவிட்ட டிரேட் விட்ஜெட் DRC மற்றும் வாராந்திர மதிப்பாய்வு குறிப்புகளில் மட்டுமே கிடைக்கும்.',
  'widget.missed-trades.error-no-date':
    'புதிய தவறவிட்ட டிரேட்டுக்கான தேதியை தீர்மானிக்க முடியாது',
  'widget.missed-trades.error-open-form':
    'தவறவிட்ட டிரேட் படிவத்தைத் திறக்க முடியவில்லை',
  'widget.backtest-trades.empty': 'இந்த காலகட்டத்திற்கு Backtest டிரேட் இல்லை',
  'widget.trade-table.column.images': 'படங்கள்',
  'widget.trade-table.column.date': 'தேதி',
  'widget.trade-table.column.entry': 'நுழைவு',
  'widget.trade-table.column.ticker': 'டிக்கர்',
  'widget.trade-table.column.account': 'கணக்கு',
  'widget.trade-table.column.pnl': 'P&L',
  'widget.trade-table.column.direction': 'திசை',
  'widget.trade-table.column.setups': 'Setups',
  'widget.trade-table.column.mistakes': 'தவறுகள்',
  'widget.trade-table.empty': 'இந்தக் காலத்திற்கு டிரேட் இல்லை',
  'widget.trade-table.status.open': 'OPEN',
  'widget.trade-table.na': 'N/A',
  'widget.trade-table.unknown': 'தெரியாதது',

  'widget.trade-table.image-alt': 'டிரேட் {id} முன்னோட்டம்',
  'widget.trade-table.fullscreen-title': 'டிரேட் {id} படம்',
  'widget.trade-table.fullscreen-alt': 'டிரேட் {id} படம் {index}',
  'widget.trade-table.duration.days-hours': '{days}d {hours}h',
  'widget.trade-table.duration.hours-mins': '{hours}h {mins}m',
  'widget.trade-table.duration.mins': '{mins}m',
  'widget.trade-table.pagination.showing':
    '{total} டிரேட்களில் {start}-{end}ஐக் காட்டுகிறது',
  'widget.trade-table.pagination.prev': '← முந்தைய',
  'widget.trade-table.pagination.next': 'அடுத்து →',
  'widget.trade-table.pagination.page': 'பக்கம் {current} of {total}',
  'widget.pagination.showing':
    '{total} {items} இன் {start}-{end} ஐக் காட்டுகிறது',
  'widget.pagination.prev': 'முந்தைய',
  'widget.pagination.next': 'அடுத்து',
  'widget.pagination.page': 'பக்கம் {current} of {total}',

  'widget.empty.no-data': 'தரவு எதுவும் கிடைக்கவில்லை',
  'widget.empty.no-trades': 'இந்தக் காலத்திற்கு டிரேட் இல்லை',
  'widget.empty.no-closed-trades': 'இந்தக் காலத்திற்கு மூடப்பட்ட டிரேட் இல்லை',
  'widget.empty.no-daily-data': 'இந்தக் காலத்திற்கு தினசரி தரவு இல்லை',
  'widget.empty.no-weekly-data': 'இந்தக் காலத்திற்கு வாராந்திர தரவு இல்லை',
  'widget.empty.no-monthly-data': 'இந்தக் காலத்திற்கு மாதாந்திர தரவு இல்லை',
  'widget.empty.no-quarterly-data': 'இந்த காலத்திற்கு காலாண்டு தரவு இல்லை',
  'widget.empty.no-tag-data': 'இந்தக் காலத்திற்கான டேக் டேட்டா எதுவும் இல்லை',
  'widget.empty.no-setup-data': 'இந்தக் காலகட்டத்திற்கான Setupத் தரவு இல்லை',
  'widget.empty.no-mental-game-data':
    '{period}க்கு மனநல விளையாட்டு தரவு எதுவும் இல்லை',
  'widget.empty.no-technical-game-data':
    '{period}க்கான தொழில்நுட்ப கேம் தரவு இல்லை',
  'widget.invalid-context.title': 'தவறான சூழல்',
  'widget.invalid-context.default':
    'இந்த {widgetType} விட்ஜெட்டுக்கு மதிப்பாய்வு அல்லது டிரேட் குறிப்பு தேவை',
  'widget.invalid-context.monthly-quarterly-yearly':
    'இந்த விட்ஜெட் மாதாந்திர, காலாண்டு மற்றும் வருடாந்திர மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    'இந்த விட்ஜெட் வாராந்திர, மாதாந்திர, காலாண்டு மற்றும் வருடாந்திர மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.invalid-context.quarterly-yearly':
    'இந்த விட்ஜெட் காலாண்டு மற்றும் வருடாந்திர மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.invalid-context.yearly-only':
    'இந்த விட்ஜெட் ஆண்டு மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.invalid-context.monthly-only':
    'இந்த விட்ஜெட் மாதாந்திர மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.invalid-context.weekly-monthly':
    'இந்த விட்ஜெட் வாராந்திர மற்றும் மாதாந்திர மதிப்பாய்வுகளில் மட்டுமே கிடைக்கும்',
  'widget.invalid-context.review-note':
    'இந்த விட்ஜெட்டுக்கு DRC, வாராந்திர மதிப்பாய்வு, மாதாந்திர மதிப்பாய்வு, காலாண்டு மதிப்பாய்வு அல்லது வருடாந்திர மதிப்பாய்வு குறிப்பு தேவை',
  'widget.key-levels.title': 'முக்கிய நிலைகள்',
  'widget.key-levels.support': 'ஆதரவு',
  'widget.key-levels.resistance': 'எதிர்ப்பு',
  'widget.key-levels.no-levels': 'எந்த நிலைகளும் வரையறுக்கப்படவில்லை',
  'widget.key-levels.price-placeholder': 'விலை...',
  'widget.key-levels.select-importance': 'முக்கியத்துவத்தைத் தேர்ந்தெடுக்கவும்',
  'widget.key-levels.remove-level': 'நிலை அகற்று',
  'widget.key-levels.invalid-context':
    'முக்கிய நிலைகள் விட்ஜெட்டுக்கு DRC, வாராந்திர மதிப்பாய்வு அல்லது மாதாந்திர மதிப்பாய்வு குறிப்பு தேவை',
  'widget.key-levels.source.weekly': 'வாராந்திர',
  'widget.key-levels.source.monthly': 'மாதாந்திர',
  'widget.key-levels.open-source-review': '{label} மதிப்பாய்வைத் திறக்கவும்',
  'widget.key-levels.importance.none': 'இல்லை',
  'widget.key-levels.importance.high': 'உயர்',
  'widget.key-levels.importance.medium': 'நடுத்தர',
  'widget.key-levels.importance.low': 'குறைந்த',
  'manual-drawdown.notice.deleted': 'ஸ்னாப்ஷாட் நீக்கப்பட்டது',
  'manual-drawdown.notice.updated': 'ஸ்னாப்ஷாட் புதுப்பிக்கப்பட்டது',
  'manual-drawdown.notice.added': 'ஸ்னாப்ஷாட் சேர்க்கப்பட்டது',
  'manual-drawdown.validation.date-required': 'தேதி தேவை',
  'manual-drawdown.validation.invalid-date': 'சரியான தேதியை உள்ளிடவும்',
  'manual-drawdown.validation.future-date':
    'தேதி எதிர்காலத்தில் இருக்க முடியாது',
  'manual-drawdown.validation.limit-required': 'Drawdown வரம்பு தேவை',
  'manual-drawdown.validation.limit-positive':
    'Drawdown வரம்பு நேர்மறை எண்ணாக இருக்க வேண்டும்',
  'manual-drawdown.validation.duplicate-date':
    'இந்தத் தேதிக்கான ஸ்னாப்ஷாட் ஏற்கனவே உள்ளது. வேறு தேதியைத் தேர்வு செய்யவும் அல்லது ஏற்கனவே உள்ளதைத் திருத்தவும்.',
  'manual-drawdown.section.recorded': 'பதிவுசெய்யப்பட்ட ஸ்னாப்ஷாட்கள்',
  'manual-drawdown.table.date': 'தேதி',
  'manual-drawdown.table.limit': 'Drawdown வரம்பு',
  'manual-drawdown.table.note': 'குறிப்பு',
  'manual-drawdown.table.actions': 'செயல்கள்',
  'manual-drawdown.button.editing': 'எடிட்டிங்',
  'manual-drawdown.button.edit': 'திருத்து',
  'manual-drawdown.button.delete': 'நீக்கு',
  'manual-drawdown.header.edit': 'ஸ்னாப்ஷாட்டைத் திருத்து',
  'manual-drawdown.header.add': 'புதிய ஸ்னாப்ஷாட்டைச் சேர்க்கவும்',
  'manual-drawdown.field.date': 'Drawdown தேதி *',
  'manual-drawdown.field.date-desc': 'தரகர் இந்த வரம்பை வழங்கியபோது',
  'manual-drawdown.field.limit': 'குறைந்தபட்ச இருப்பு ($) *',
  'manual-drawdown.field.limit-desc': 'குறைந்தபட்ச இருப்பு அனுமதிக்கப்படுகிறது',
  'manual-drawdown.field.note': 'குறிப்பு (விரும்பினால்)',
  'manual-drawdown.field.note-desc': 'இந்த ஸ்னாப்ஷாட்டுக்கான கூடுதல் சூழல்',
  'manual-drawdown.placeholder.note': 'எ.கா., மாத இறுதி அறிக்கை',
  'manual-drawdown.button.update': 'ஸ்னாப்ஷாட்டைப் புதுப்பிக்கவும்',
  'manual-drawdown.button.add': 'ஸ்னாப்ஷாட்டைச் சேர்க்கவும்',
  'manual-drawdown.button.cancel-edit': 'திருத்தத்தை ரத்துசெய்',
  'manual-drawdown.modal.delete-title': 'ஸ்னாப்ஷாட்டை நீக்கவா?',
  'manual-drawdown.modal.delete-confirm':
    '{date} இலிருந்து Drawdown ஸ்னாப்ஷாட்டை நீக்கவா?',
  'manual-drawdown.modal.delete-limit': 'Drawdown வரம்பு: {limit}',
  'manual-drawdown.modal.delete-warning':
    'இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.',
  'dashboard.selector.title': 'டாஷ்போர்டில் சேர்க்கவும்',
  'dashboard.selector.metrics': 'அளவீடுகள்',
  'dashboard.selector.charts': 'விளக்கப்படங்கள்',
  'dashboard.selector.empty':
    'அனைத்து அளவீடுகளும் விளக்கப்படங்களும் சேர்க்கப்பட்டுள்ளன',
  'dashboard.selector.hint.navigate': '↑↓ வழிசெலுத்தவும்',
  'dashboard.selector.hint.select': '↵ தேர்ந்தெடுக்கவும்',
  'dashboard.selector.hint.close': 'esc மூடு',

  'dashboard.component-selector.category.performance': 'செயல்திறன்',

  'dashboard.component-selector.category.journal': 'ஜர்னல்',
  'widget.pnlChart.name': 'ஒட்டுமொத்த P&L',

  'widget.longPnLChart.name': 'Long P&L',
  'widget.longPnLChart.description':
    'Long மூடிய டிரேட்களுக்கு மட்டுமே ஒட்டுமொத்த P&L வளைவு',
  'widget.shortPnLChart.name': 'Short P&L',
  'widget.shortPnLChart.description':
    'Short மூடிய டிரேட்களுக்கு மட்டுமே ஒட்டுமொத்த P&L வளைவு',
  'widget.performanceCalendar.name': 'செயல்திறன் காலண்டர்',

  'widget.dailyPerformance.name': 'தினசரி செயல்திறன்',

  'widget.tradesChart.name': 'டிரேட்கள் விளக்கப்படம்',

  'widget.weekdayPerformance.name': 'வார நாள் செயல்திறன்',

  'widget.hourlyPerformance.name': 'மணிநேர செயல்திறன்',

  'widget.tickerPerformance.name': 'டிக்கர் செயல்திறன்',
  'widget.tickerPerformance.description':
    'டிக்கர் மூலம் செயல்திறனை ஒப்பிடும் தரவரிசைப்பட்ட பார் விளக்கப்படம்',
  'widget.tradesChart.limit': '{count} டிரேட்',
  'widget.drawdownChart.name': 'Drawdown விளக்கப்படம்',

  'widget.directionalDrawdownChart.name': 'திசை Realized Drawdown',

  'widget.longDrawdownChart.name': 'Long Drawdown',

  'widget.shortDrawdownChart.name': 'Short Drawdown',

  'widget.drawdownStats.no-conversion':
    'FX மாற்றம் இல்லாமல் கலப்பு நாணயங்களுக்கு Drawdown புள்ளிவிவரங்கள் கிடைக்காது.',
  'widget.recentTrades.name': 'சமீபத்திய டிரேட்கள்',
  'widget.recentTrades.description':
    'விவரங்களுடன் 10 சமீபத்திய டிரேட்களைக் காட்டுகிறது',
  'widget.recentTrades.date': 'தேதி',
  'widget.recentTrades.ticker': 'டிக்கர்',
  'widget.recentTrades.direction': 'திசை',
  'widget.recentTrades.pnl': 'P&L',
  'widget.recentTrades.no-trades': 'டிரேட் இல்லை',
  'widget.recentTrades.empty-submessage':
    'வேறு தேதி வரம்பைத் தேர்ந்தெடுக்க முயற்சிக்கவும்',
  'widget.recentTrades.unknown': 'தெரியாதது',
  'widget.rollingWinRate.name': 'ரோலிங் வெற்றி/தோல்வி விகிதம்',

  'widget.rollingStats.name': 'ரோலிங் சராசரி வெற்றி/தோல்வி',

  'filter.chip.remove-aria': '{label} வடிப்பானை அகற்று',
  'shared.filter.disabled-preview':
    'முன்னோட்டத்தில் வடிப்பான்கள் முடக்கப்பட்டுள்ளன',
  'shared.filter.open': 'வடிப்பான்களைத் திறக்கவும்',
  'shared.filter.active-count': '{count} செயலில் உள்ள வடிப்பான்கள்',
  'ui.toggle-switch.aria-label': 'மாற்று சுவிட்ச்',
  'ui.folder-browser.placeholder': 'ஒரு கோப்புறையைத் தேர்ந்தெடுக்கவும்...',
  'ui.folder-browser.root': 'வேர்',
  'ui.folder-browser.clear-aria': 'இயல்புநிலை இருப்பிடத்தைப் பயன்படுத்த அழி',
  'ui.folder-browser.expand-folder': 'கோப்புறையை விரிவாக்கு',
  'ui.folder-browser.collapse-folder': 'கோப்புறையைச் சுருக்கு',

  'combobox.placeholder.default':
    'தேர்ந்தெடுக்கவும் அல்லது தட்டச்சு செய்யவும்...',
  'combobox.aria.remove-item': 'அகற்று {item}',
  'combobox.add-option': '"{value}" சேர்',
  'error.render-component': 'வழங்குவதில் பிழை {component}: {error}',
  'error.session-expired':
    'உங்கள் அமர்வு காலாவதியானது. செருகுநிரல் அமைப்புகளில் மீண்டும் உள்நுழையவும்.',
  'error.ftp-not-found':
    'FTP கணக்கு கிடைக்கவில்லை. கணினி தானாகவே உங்களுக்காக ஒன்றை உருவாக்கும்.',
  'error.no-trading-data':
    'டிரேட் தரவு எதுவும் கிடைக்கவில்லை. உங்கள் MetaTrader கணக்கு சரியாக இணைக்கப்பட்டுள்ளதையும் டிரேட் வரலாறு உள்ளதையும் உறுதிப்படுத்தவும்.',
  'error.unable-connect-service':
    'டிரேட் தரவு சேவையுடன் இணைக்க முடியவில்லை. உங்கள் இணைய இணைப்பைச் சரிபார்க்கவும்.',
  'error.invalid-verification-code':
    'தவறான சரிபார்ப்புக் குறியீடு. குறியீட்டைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.invalid-registration-data':
    'தவறான பதிவு தரவு. உங்கள் அமைப்புகளைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.invalid-request':
    'தவறான கோரிக்கை. உங்கள் உள்ளீட்டைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.access-denied':
    'அணுகல் மறுக்கப்பட்டது. உங்கள் கணக்கு அனுமதிகளைச் சரிபார்க்கவும் அல்லது ஆதரவைத் தொடர்பு கொள்ளவும்.',
  'error.too-many-requests':
    'பல கோரிக்கைகள். மீண்டும் முயற்சிக்கும் முன் சிறிது நேரம் காத்திருக்கவும்.',
  'error.service-unavailable':
    'டிரேட் தரவு சேவை தற்காலிகமாக கிடைக்கவில்லை. சில நிமிடங்களில் மீண்டும் முயற்சிக்கவும்.',
  'error.server-error':
    'சர்வர் பிழை ஏற்பட்டது. பின்னர் மீண்டும் முயற்சிக்கவும் அல்லது சிக்கல் தொடர்ந்தால் ஆதரவைத் தொடர்பு கொள்ளவும்.',
  'error.network-error':
    'டிரேட் தரவு சேவையுடன் இணைக்க முடியவில்லை. உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.unknown': 'அறியப்படாத பிழை ஏற்பட்டது',
  'error.unexpected':
    'எதிர்பாராத பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும் அல்லது சிக்கல் தொடர்ந்தால் ஆதரவைத் தொடர்பு கொள்ளவும்.',
  'error.settings.invalid-pattern':
    'தவறான சரிபார்ப்பு முறை. உங்கள் வழக்கமான வெளிப்பாட்டை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.settings.field-name-conflict':
    'இந்த புலத்தின் பெயர் ஏற்கனவே உள்ள புலத்துடன் முரண்படுகிறது. தயவுசெய்து வேறு பெயரைத் தேர்ந்தெடுக்கவும்.',
  'error.settings.invalid-field-name':
    'தவறான புலத்தின் பெயர். புலத்தின் பெயர்களில் எழுத்துக்கள், எண்கள் மற்றும் அடிக்கோடுகள் மட்டுமே இருக்க முடியும்.',
  'error.settings.save-failed':
    'உங்கள் மாற்றங்களைச் சேமிக்க முடியவில்லை. உங்கள் அமைப்புகளைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.settings.load-failed':
    'தனிப்பயன் புல அமைப்புகளை ஏற்ற முடியவில்லை. உங்கள் தனிப்பயன் புலங்கள் சரியாகக் காட்டப்படாமல் போகலாம்.',
  'error.settings.import-failed':
    'புல அமைப்புகளை இறக்குமதி செய்ய முடியவில்லை. கோப்பு வடிவத்தை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.settings.create-failed':
    'தனிப்பயன் புலத்தை உருவாக்க முடியவில்லை. உங்கள் உள்ளீட்டைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.settings.remove-failed':
    'தனிப்பயன் புலத்தை அகற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'error.settings.generic':
    'தனிப்பயன் புலங்களை நிர்வகிக்கும் போது பிழை ஏற்பட்டது. உங்கள் அமைப்புகளைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.options.duplicate':
    'இந்த விருப்பம் ஏற்கனவே உள்ளது. தயவுசெய்து வேறு பெயரைத் தேர்ந்தெடுக்கவும்.',
  'error.options.invalid-ticker':
    'தவறான டிக்கர் சின்னம். எழுத்துக்கள், எண்கள் மற்றும் காலங்களை மட்டும் பயன்படுத்தவும் (எ.கா., AAPL, SPX).',
  'error.options.add-ticker-failed':
    'டிக்கர் சின்னத்தைச் சேர்க்க முடியவில்லை. வடிவமைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.options.add-failed':
    'விருப்பத்தைச் சேர்க்க முடியவில்லை. இது ஏற்கனவே இருக்கலாம் அல்லது செல்லாததாக இருக்கலாம்.',
  'error.options.update-failed':
    'விருப்பத்தை புதுப்பிக்க முடியவில்லை. இது ஏற்கனவே இருக்கலாம் அல்லது செல்லாததாக இருக்கலாம்.',
  'error.options.remove-failed':
    'விருப்பத்தை அகற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'error.options.no-options-reset':
    'மீட்டமைக்க விருப்பங்கள் இல்லை. வகை ஏற்கனவே காலியாக உள்ளது.',
  'error.options.reset-failed':
    'விருப்பங்களை மீட்டமைக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'error.options.save-failed':
    'விருப்ப மாற்றங்களைச் சேமிக்க முடியவில்லை. உங்கள் அமைப்புகளைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.options.generic':
    'விருப்பங்களை நிர்வகிக்கும் போது பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
  'error.clipboard.permission-denied':
    'கிளிப்போர்டு அணுகல் மறுக்கப்பட்டது. ஒட்டுதல் செயல்பாட்டிற்கு உங்கள் உலாவியில் கிளிப்போர்டு அனுமதிகளை அனுமதிக்கவும்.',
  'error.clipboard.not-supported':
    'உங்கள் உலாவியில் கிளிப்போர்டு பேஸ்ட் ஆதரிக்கப்படவில்லை. அதற்குப் பதிலாக Ctrl+V அல்லது Cmd+Vஐப் பயன்படுத்தவும்.',
  'error.clipboard.image-too-large':
    'ஒட்ட முடியாத அளவுக்கு படம் பெரிதாக உள்ளது. 10MBக்கு குறைவான படங்களைப் பயன்படுத்தவும்.',
  'error.clipboard.no-content':
    'ஒட்டுவதற்கு கிளிப்போர்டில் எதுவும் இல்லை. முதலில் படத்தை நகலெடுக்க முயற்சிக்கவும்.',
  'error.clipboard.no-images':
    'கிளிப்போர்டில் படங்கள் எதுவும் இல்லை. நீங்கள் ஒரு படத்தை நகலெடுத்துள்ளீர்கள் என்பதை உறுதிப்படுத்தவும், உரை அல்லது பிற உள்ளடக்கத்தை அல்ல.',
  'error.clipboard.no-target':
    'படப் பதிவேற்றப் பகுதி எதுவுமில்லை. முதலில் படத்தைப் பதிவேற்றும் பகுதியில் கிளிக் செய்து, பின்னர் உங்கள் படத்தை ஒட்டவும்.',
  'error.clipboard.network-error':
    'பேஸ்ட்டைச் செயலாக்கும்போது நெட்வொர்க் பிழை ஏற்பட்டது. உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'error.clipboard.paste-failed':
    'ஒட்டுதல் செயல்பாட்டை முடிக்க முடியவில்லை. படத்தை மீண்டும் நகலெடுத்து ஒட்ட முயற்சிக்கவும்.',
  'error.clipboard.generic':
    'கிளிப்போர்டு செயல்பாடு தோல்வியடைந்தது. உங்கள் உள்ளடக்கத்தை மீண்டும் நகலெடுத்து ஒட்ட முயற்சிக்கவும்.',

  'datetime.aria.open-picker': 'தேதி தேர்வியைத் திறக்கவும்',

  'modal.template-switch.title': 'தளவமைப்பை மாற்றவா?',
  'modal.template-switch.switching-from': 'நீங்கள் மாறுகிறீர்கள்',
  'modal.template-switch.switching-to': 'செய்ய',
  'modal.template-switch.has-content-title':
    'இந்தக் குறிப்பில் உள்ளடக்கம் உள்ளது',
  'modal.template-switch.has-content-desc':
    'புதிய தளவமைப்பிற்கு ஏற்றவாறு உள்ளடக்கம் மறுசீரமைக்கப்படும். பொருந்தாத எந்த உள்ளடக்கமும் நீங்கள் மதிப்பாய்வு செய்வதற்காக குறிப்பின் கீழே பாதுகாக்கப்படும்.',
  'modal.template-switch.cannot-undo':
    'இதை செயல்தவிர்க்க முடியாது (ஆனால் நீங்கள் மீண்டும் மாறலாம்).',
  'modal.template-switch.button.switch': 'தளவமைப்பை மாற்றவும்',

  'release-notes.title': 'வெளியீட்டு குறிப்புகள்',
  'release-notes.loading-plugin': 'செருகுநிரலை ஏற்றுகிறது...',

  'release-notes.no-content': 'வெளியீட்டு குறிப்புகள் எதுவும் கிடைக்கவில்லை',
  'release-notes.current-version': 'நடப்பு: v{version}',
  'release-notes.version': 'பதிப்பு {version}',
  'release-notes.link.docs': 'ஆவணங்கள்',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'கிட்ஹப்',
  'skeleton.tradelog.loading': 'டிரேட் தரவை ஏற்றுகிறது',
  'skeleton.dashboard-widget.loading': 'விட்ஜெட் தரவை ஏற்றுகிறது',
  'skeleton.account-page.loading': 'கணக்குப் பக்கத்தை ஏற்றுகிறது',

  'grid.aria.remove-widget': 'விட்ஜெட்டை அகற்று',
  'csv.broker.tradingtechnologies': 'டிரேட் தொழில்நுட்பங்கள் (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'விட்ஜெட்டை நிரப்புகிறது CSV ஏற்றுமதி',
  'csv.broker-guide.tradingtechnologies.step-1':
    'TT இல் நிரப்புதல் விட்ஜெட்டைத் திறந்து, விவரம், தொடர்ச்சியான அல்லது விலைக்கு மாறவும்.',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'முக்கியமானது:',

  'trade.metadata.broker-comment': 'தரகர் கருத்து',

  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'செயல்திறன் காலண்டர்',
  'navigation.section.overview': 'மேலோட்டம்',
  'navigation.section.reviews': 'மதிப்பாய்வுகள்',
  'navigation.section.tools': 'கருவிகள்',
  'navigation.edit-mode.toggle': 'வழிசெலுத்தலைத் தனிப்பயனாக்கு',
  'navigation.edit-mode.hide-item': 'வழிசெலுத்தல் ஐட்டத்தை மறை',
  'navigation.edit-mode.restore-section': 'மறைக்கப்பட்டவை',
  'navigation.edit-mode.restore': 'மீட்டமை',
  'navigation.items.nav-settings': 'அமைப்புகள்',
  'navigation.shortcuts.add': 'குறுக்குவழியைச் சேர்',
  'navigation.shortcuts.remove': 'குறுக்குவழியை அகற்று',
  'navigation.shortcuts.close': 'குறுக்குவழித் தேர்வை மூடு',
  'navigation.shortcuts.search': 'கணக்குகள் மற்றும் அமைப்புகளைத் தேடு',
  'navigation.shortcuts.accounts': 'கணக்குகள்',
  'navigation.shortcuts.setups': 'அமைப்புகள்',
  'navigation.shortcuts.empty': 'கணக்குகள் அல்லது அமைப்புகள் எதுவும் இல்லை',
  'navigation.shortcuts.unavailable': 'கிடைக்கவில்லை',
  'navigation.shortcuts.added': 'சேர்க்கப்பட்டது',
  'navigation.shortcuts.parent-required':
    'இந்த வழிசெலுத்தல் உருப்படியை மறைக்கும் முன் அதன் குறுக்குவழிகளை அகற்றவும்.',
  'navigation.items.nav-home': 'முகப்பு',
  'navigation.items.nav-dashboard': 'டாஷ்போர்டு',
  'navigation.items.nav-trade-log': 'டிரேட் பதிவு',
  'navigation.items.nav-account-dashboard': 'கணக்குகள்',
  'navigation.items.nav-drc': 'இன்றைய DRC',
  'navigation.items.nav-weekly': 'இந்த வார மதிப்பாய்வு',
  'navigation.items.nav-monthly': 'இந்த மாத மதிப்பாய்வு',
  'navigation.items.nav-quarterly': 'இந்த காலாண்டு மதிப்பாய்வு',
  'navigation.items.nav-yearly': 'இந்த ஆண்டு மதிப்பாய்வு',
  'navigation.items.nav-add-trade': 'டிரேடைச் சேர்',
  'navigation.items.nav-layout-builder': 'தளவமைப்பு உருவாக்கி',
  'navigation.items.nav-quick-import': 'விரைவான இறக்குமதி',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-session-mode': 'அமர்வு முறை',
  'navigation.items.nav-position-size': 'போசிஷன் சைஸ் கால்குலேட்டர்',
  'settings.general.navigation-sidebar': 'வழிசெலுத்தல் பக்கப்பட்டி',
  'notice.error.open-navigation-sidebar':
    'வழிசெலுத்தல் பக்கப்பட்டியைத் திறக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'navigation.setting.open': 'வழிசெலுத்தல் பக்கப்பட்டியைத் திற',
  'navigation.setting.open.desc':
    'Obsidian இன் பக்கப்பட்டி சரிந்தால் அதை இப்போது வெளிப்படுத்தவும்.',
  'navigation.setting.open.button': 'பக்கப்பட்டியைத் திற',
  'calendar.setting.open': 'காலெண்டரைத் திற',
  'calendar.setting.open.button': 'காலெண்டரைத் திற',
  'notice.error.open-calendar-sidebar':
    'காலெண்டரைத் திறக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  'navigation.setting.tab-behavior': 'வழிசெலுத்தல் தாவல் நடத்தை',
  'navigation.setting.tab-behavior.desc':
    'Journalit பக்கப்பட்டிகளிலிருந்து காட்சிகள் மற்றும் மதிப்பாய்வுகளை எவ்வாறு திறப்பது',
  'navigation.setting.tab-behavior.new-tab': 'புதிய தாவலில் திற',
  'navigation.setting.tab-behavior.replace': 'செயலில் உள்ள தாவலை மாற்று',
  'navigation.search.placeholder': 'டிரேட்கள் & மதிப்பாய்வுகளைத் தேடு...',
  'navigation.search.clear': 'தேடலை அழி',
  'navigation.search.section.trades': 'டிரேட்கள்',
  'navigation.search.section.reviews': 'மதிப்பாய்வுகள்',
  'navigation.search.empty': 'முடிவுகள் எதுவும் கிடைக்கவில்லை',
  'navigation.search.trade-open': 'திறந்தவை',

  'command.open-navigation-sidebar': 'வழிசெலுத்தல் பக்கப்பட்டியைத் திற',
  'command.open-calendar-sidebar': 'காலெண்டர் பக்கப்பட்டியைத் திற',
  'widget.previous-trading-day-context.name': 'முந்தைய டிரேட் நாள் சூழல்',
  'widget.previous-trading-day-context.description':
    'முந்தைய DRC இல் உள்ள தலைப்புகளில் இருந்து படிக்க-மட்டும் சூழல் இழுக்கப்பட்டது',
  'widget.previous-trading-day-context.reference-label': 'முந்தைய DRC',
  'widget.previous-trading-day-context.open-source': 'திற',
  'widget.previous-trading-day-context.image-alt-prefix': 'முந்தைய DRC படம்',
  'widget.previous-trading-day-context.no-sections-configured':
    'தளவமைப்பு அமைப்புகளில் குறைந்தது ஒரு பகுதியையாவது தேர்வு செய்யவும்.',
  'widget.previous-trading-day-context.preview-note':
    'நேற்றைய விலை பணப்புழக்கத்தை அதிகரித்தது, வாராந்திர அளவில் இருந்து நிராகரிக்கப்பட்டது மற்றும் திட்டமிட்ட வரம்பிற்குள் மீண்டும் மூடப்பட்டது.',
  'widget.previous-trading-day-context.preview-bullet-two':
    'முக்கிய விலகல்: முதல் இழுத்தலில் உறுதிப்படுத்தப்படுவதற்கு முன் உள்ளிடப்பட்டது.',
  'widget.previous-trading-day-context.preview-source':
    'முன்னோட்டம்: முந்தைய டிரேட் நாளிலிருந்து முந்தைய DRC',
  'widget.previous-trading-day-context.preview-bullet-one':
    'தொடக்க இயக்கத்திற்குப் பிறகு தினசரி சார்பு திட்டத்துடன் பொருந்தியது.',
  'widget.weekly-drc-context.name': 'வார நாள் தினசரி மதிப்பாய்வுகள்',
  'widget.weekly-drc-context.description':
    'வாராந்திர மதிப்பாய்வில் ஒவ்வொரு நாளுக்கும் தேர்ந்தெடுக்கப்பட்ட DRC பிரிவுகளைக் காட்டு',

  'widget.weekly-drc-context.image-alt-prefix': 'வாராந்திர DRC படம்',
  'widget.weekly-drc-context.no-activity':
    'இந்த நாளுக்கு எந்த நடவடிக்கையும் இல்லை.',
  'widget.weekly-drc-context.no-sections-configured':
    'தளவமைப்பு அமைப்புகளில் குறைந்தது ஒரு DRC பிரிவையாவது தேர்வு செய்யவும்.',
  'widget.weekly-drc-context.current-week-not-found':
    'தற்போதைய வாராந்திர மதிப்பாய்வு கிடைக்கவில்லை.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'தற்போதைய வாராந்திர மதிப்பாய்வு தேதி கிடைக்கவில்லை.',
  'widget.weekly-drc-context.load-error':
    'வாராந்திர DRC மதிப்பாய்வை ஏற்றுவதில் தோல்வி.',
  'widget.weekly-drc-context.invalid-context':
    'இந்த விட்ஜெட் வாராந்திர மதிப்பாய்வு குறிப்புகளில் மட்டுமே கிடைக்கும்',
  'templateEditor.widget.weekly-drc-day-label': 'நாள்',

  'templateEditor.widget.weekly-drc-start-collapsed': 'தொடக்கம் சரிந்தது',
  'templateEditor.widget.weekly-drc-day-all': 'எல்லா நாட்களும்',

  'templateEditor.widget.previous-context-sections-label':
    'சேர்க்க வேண்டிய பிரிவுகள்',
  'templateEditor.widget.previous-context-heading-label':
    'முந்தைய DRC பிரிவு தலைப்பு',
  'templateEditor.widget.previous-context-heading-placeholder':
    'ஒரு தலைப்பைத் தேர்ந்தெடுக்கவும்',
  'templateEditor.widget.review-context-fields.selection':
    'காட்ட வேண்டிய புலங்கள்',
  'templateEditor.widget.review-context-fields.selection.all':
    'அனைத்து புலங்கள்',
  'templateEditor.widget.review-context-fields.selection.group': 'களக் குழு',
  'templateEditor.widget.review-context-fields.selection.fields':
    'குறிப்பிட்ட புலங்கள்',
  'templateEditor.widget.review-context-fields.group': 'குழு',
  'templateEditor.widget.review-context-fields.group-placeholder':
    'குழுவைத் தேர்ந்தெடுக்கவும்',
  'templateEditor.widget.review-context-fields.fields': 'வயல்வெளிகள்',
  'templateEditor.widget.review-context-fields.fields-placeholder':
    'புலங்களைத் தேர்ந்தெடுக்கவும்',
  'templateEditor.widget.review-context-fields.fields-selected':
    '{count} புலங்கள் தேர்ந்தெடுக்கப்பட்டன',
  'templateEditor.widget.review-context-fields.no-fields':
    'முதலில் அமைப்புகளில் மதிப்பாய்வு புலங்களை உருவாக்கவும்.',

  'templateEditor.widget.review-context-fields.context': 'சூழல்',
  'templateEditor.widget.review-context-fields.context.both': 'இரண்டும்',
  'templateEditor.widget.review-context-fields.inherited': 'பரம்பரை',
  'templateEditor.widget.review-context-fields.current': 'தற்போதைய',
  'templateEditor.widget.review-context-fields.empty-values':
    'வெற்று மதிப்புகள்',
  'templateEditor.widget.review-context-fields.hide-empty':
    'வெற்று மதிப்புகளை மறை',
  'templateEditor.widget.trade-review.primary-metrics': 'முதன்மை அளவீடுகள்',
  'templateEditor.widget.trade-review.classification': 'வகைப்பாடு',
  'templateEditor.widget.trade-review.more-context': 'மேலும் சூழல்',
  'templateEditor.widget.trade-review.display': 'காட்சி',
  'templateEditor.widget.trade-review.show-images': 'படங்களைக் காட்டு',
  'templateEditor.widget.trade-review.fields-none': 'புலங்கள் இல்லை',
  'templateEditor.widget.trade-review.fields-all': 'அனைத்து புலங்கள்',
  'templateEditor.widget.trade-review.fields-count': '{count} புலங்கள்',
  'templateEditor.widget.trade-review.no-fields': 'புலங்கள் இல்லை',
  'templateEditor.widget.trade-review.questions':
    'கேள்விகளை மதிப்பாய்வு செய்யவும்',
  'templateEditor.widget.trade-review.questions-help':
    'ஒவ்வொரு டிரேட் விளைவுக்கும் காட்டப்படும் அறிவுறுத்தல்களைத் தேர்வு செய்யவும். கேள்வி ஐடிகள் நிலையானதாக இருக்கும், எனவே நீங்கள் திருத்தும் போது அல்லது மறுவரிசைப்படுத்தும் போது சேமிக்கப்பட்ட பதில்கள் இணைக்கப்பட்டிருக்கும்.',
  'templateEditor.widget.trade-review.outcome.win': 'வெற்றி பெறுகிறது',
  'templateEditor.widget.trade-review.outcome.loss': 'இழப்புகள்',
  'templateEditor.widget.trade-review.outcome.breakeven': 'Breakeven',
  'templateEditor.widget.trade-review.outcome.open': 'திறந்தவை',
  'templateEditor.widget.trade-review.questions-empty':
    'இந்த முடிவுக்கு கேள்விகள் இல்லை.',
  'templateEditor.widget.trade-review.question-label': 'கேள்வி',
  'templateEditor.widget.trade-review.question-placeholder':
    'மதிப்பாய்வு கேள்வியை உள்ளிடவும்',
  'templateEditor.widget.trade-review.answer-placeholder-label':
    'பதில் ஒதுக்கிட',
  'templateEditor.widget.trade-review.answer-placeholder':
    'பதில் புலத்தில் விருப்பத் தூண்டல் காட்டப்பட்டுள்ளது',
  'templateEditor.widget.trade-review.add-question': '+ கேள்வியைச் சேர்க்கவும்',
  'templateEditor.widget.trade-review.answer-type-label': 'பதில் வகை',
  'templateEditor.widget.trade-review.answer-type-text': 'உரை',
  'templateEditor.widget.trade-review.answer-type-choice': 'தேர்வு',
  'templateEditor.widget.trade-review.option-placeholder': 'விருப்பம் லேபிள்',
  'templateEditor.widget.trade-review.add-option': '+ விருப்பத்தைச் சேர்',
  'templateEditor.widget.trade-review.condition-label': 'எப்போது காட்டு',
  'templateEditor.widget.trade-review.condition-always':
    'எப்போதும் காட்டப்படும்',
  'templateEditor.widget.trade-review.condition-option-label':
    'எப்போது Q{questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section':
    '+ பகுதியைச் சேர்க்கவும்',

  'templateEditor.widget.previous-context-fallback-label':
    'முந்தைய DRC ஃபால்பேக்',
  'templateEditor.widget.previous-context-fallback-nearest':
    'அருகிலுள்ள முந்தைய DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'எதிர்பார்க்கப்படும் முந்தைய டிரேட் நாள் மட்டுமே',
  'calendar.aria.open-daily-review':
    '{date}க்கான தினசரி மதிப்பாய்வைத் திறக்கவும்',
  'calendar.aria.open-weekly-review':
    '{date}க்கான வாராந்திர மதிப்பாய்வைத் திறக்கவும்',
  'calendar.aria.open-monthly-review':
    '{date}க்கான மாதாந்திர மதிப்பாய்வைத் திறக்கவும்',
  'calendar.aria.open-quarterly-review':
    '{date}க்கான காலாண்டு மதிப்பாய்வைத் திறக்கவும்',

  'csv.mapper.aria.map-column': 'நெடுவரிசை {header}-ஐ மேப் செய்',
  'command.quick-import-trades': 'டிரேட்களை விரைவாக இறக்குமதி செய்',
  'trade-import.error.file-empty':
    'இந்தக் கோப்பு காலியாக உள்ளது. கோப்பை மீண்டும் ஏற்றுமதி செய்து முயற்சிக்கவும்.',
  'trade-import.error.file-too-large':
    'தேர்ந்தெடுக்கப்பட்ட கோப்பு Trade Import அளவு வரம்பை மீறுகிறது',
  'trade-import.error.file-type-unsupported':
    'தேர்ந்தெடுக்கப்பட்ட கோப்பு வகையை Trade Import ஆதரிக்கவில்லை',
  'trade-import.error.broker-file-type-unsupported':
    'தேர்ந்தெடுக்கப்பட்ட தரகர் இந்தக் கோப்பு வகையை ஆதரிக்கவில்லை',
  'quick-import.title': 'விரைவான இறக்குமதி',
  'quick-import.subtitle':
    'ஒரு கோப்பை விரைவாக முன்னோட்டமிடவும் இறக்குமதி செய்யவும் உங்களுக்குப் பிடித்த Trade Import Setup-ஐப் பயன்படுத்தவும்.',
  'quick-import.gate.sign-in':
    'Trade Import இல் கோப்புகளை முன்னோட்டமிட உள்நுழையவும் அல்லது இலவச Journalit கணக்கை உருவாக்கவும். நீங்கள் டிரேட்களை இறக்குமதி செய்யும் போது மட்டுமே புரோ தேவைப்படுகிறது.',
  'quick-import.gate.sign-in-cta': 'இலவச மாதிரிக்காட்சிக்கு உள்நுழையவும்',
  'quick-import.gate.pro':
    'விரைவு இறக்குமதி Trade Import Pro உடன் சேர்க்கப்பட்டுள்ளது.',
  'quick-import.gate.preview-free': 'உங்கள் கோப்பை இலவசமாக முன்னோட்டமிடுங்கள்',
  'quick-import.message.needs-setup':
    'விரைவான இறக்குமதியைப் பயன்படுத்துவதற்கு முன் Trade Import இல் பிடித்த தரகர் அல்லது வார்ப்புருவைத் தேர்வு செய்யவும்.',
  'quick-import.message.capabilities-failed':
    'விரைவான இறக்குமதி Setup-ஐ ஏற்ற முடியவில்லை.',
  'quick-import.message.mapping-required':
    'இந்தக் கோப்பில் நெடுவரிசை மேப்பிங் தேவை. மேப்பிங்கை மதிப்பாய்வு செய்ய முழு Trade Import ஃப்ளோவைத் திறக்கவும்.',
  'quick-import.message.preview-failed':
    'இந்தக் கோப்பு முழு Trade Import ஓட்டத்தில் மதிப்பாய்வு செய்யப்பட வேண்டும்.',
  'quick-import.message.no-importable':
    'இறக்குமதி செய்யக்கூடிய டிரேட்கள் எதுவும் காணப்படவில்லை. விவரங்களுக்கு இந்தக் கோப்பை Trade Import இல் மதிப்பாய்வு செய்யவும்.',

  'quick-import.privacy-note':
    'கோப்புகள் செயலாக்கத்திற்காக Journalit சேவையகங்களில் பதிவேற்றப்படும் மற்றும் இயல்பாக சேமிக்கப்படாது.',
  'quick-import.dropzone.title': 'ஒரு தரகர் ஏற்றுமதியை இங்கே விடுங்கள்',
  'quick-import.dropzone.subtitle':
    'அல்லது கோப்பைத் தேர்ந்தெடுக்க கிளிக் செய்யவும்',

  'quick-import.status.checking-subscription':
    'சந்தா நிலையைச் சரிபார்க்கிறது...',
  'quick-import.status.analysing':
    'பகுப்பாய்வு செய்து முன்னோட்டம் தயார் செய்கிறது...',
  'quick-import.status.importing': 'இறக்குமதி செய்கிறது...',
  'quick-import.processing.sent-to-server':
    'தனிப்பட்ட செயலாக்கத்திற்காக Journalit க்கு பதிவேற்றப்பட்டது',
  'quick-import.file.selected': 'தேர்ந்தெடுக்கப்பட்ட கோப்பு',
  'quick-import.file.processed':
    'செயலாக்கப்பட்டது மற்றும் உங்கள் vault க்கு எழுத தயாராக உள்ளது',
  'quick-import.summary.title': 'இறக்குமதி செய்ய தயார்',

  'quick-import.summary.to-import': 'இறக்குமதி செய்ய',
  'quick-import.summary.duplicates': 'பிரதிகள்',
  'quick-import.summary.failed': 'மதிப்பாய்வு தேவை',
  'quick-import.summary.failed-rows': 'வரிசைகள் இறக்குமதி செய்யப்படவில்லை',
  'quick-import.summary.incomplete-rows':
    'முழுமையடையாத வரிசைகள் தவிர்க்கப்பட்டன',
  'quick-import.complete.title': 'இறக்குமதி முடிந்தது',
  'quick-import.complete.message':
    '{written} எழுதப்பட்டது, {duplicates} பிரதிகள், {failed} மதிப்பாய்வு தேவை.',
  'quick-import.action.open-full': 'முழுமையாகத் திற Trade Import',
  'quick-import.action.review-in-trade-import':
    'Trade Import இல் மதிப்பாய்வு செய்யவும்',
  'quick-import.action.setup-in-trade-import': 'Trade Import இல் அமைக்கவும்',
  'quick-import.action.replace-file': 'கோப்பை மாற்றவும்',
  'quick-import.action.import': 'இறக்குமதி டிரேட்',
  'quick-import.action.import-count.one': '{count} டிரேடை இறக்குமதி செய்யவும்',
  'quick-import.action.import-count.few':
    '{count} டிரேட்களை இறக்குமதி செய்யவும்',
  'quick-import.action.import-count.many':
    '{count} டிரேட்களை இறக்குமதி செய்யவும்',
  'quick-import.action.import-count.other':
    '{count} டிரேட்களை இறக்குமதி செய்யவும்',
  'quick-import.preview.more': '+ {count} மேலும் செயலாக்கப்பட்ட டிரேட்கள்',
  'trade-import.notice.capabilities-failed':
    'Trade Import திறன்களை ஏற்ற முடியவில்லை',
  'trade-import.notice.open-failed': 'Trade Import-ஐத் திறக்க முடியவில்லை',
  'trade-import.notice.template-exists':
    'இந்தப் பெயருடன் Trade Import வார்ப்புரு ஏற்கனவே உள்ளது',
  'trade-import.notice.template-saved':
    'Trade Import வார்ப்புரு சேமிக்கப்பட்டது',
  'trade-import.notice.analyse-failed':
    'Trade Import பகுப்பாய்வு தோல்வியடைந்தது',
  'trade-import.notice.preview-failed':
    'Trade Import முன்னோட்டம் தோல்வியடைந்தது',
  'trade-import.notice.free-preview-rate-limited':
    'இலவச முன்னோட்ட வரம்பை அடைந்துவிட்டது. PRO ஐத் தொடங்கவும் அல்லது சுமார் {minutes} நிமிடங்களில் மீண்டும் முயற்சிக்கவும்.',
  'trade-import.notice.free-preview-storage-limit-reached':
    'இலவச முன்னோட்ட சேமிப்பிடம் {limit} டிரேட் வரை வைத்திருக்கும். உங்களிடம் {storedItems} சேமிக்கப்பட்டுள்ளது, மேலும் இந்த கோப்பு {requestedItems}ஐ சேர்க்கும். முந்தைய மாதிரிக்காட்சி காலாவதியாகும் வரை காத்திருங்கள் அல்லது PRO ஐத் தொடங்கவும்.',
  'trade-import.preview-error.guidance':
    'தேவையான ஒவ்வொரு புலமும் மேப் செய்யப்பட்டுள்ளதா, தேர்ந்தெடுக்கப்பட்ட தேதி வடிவம் உங்கள் கோப்புடன் பொருந்துகிறதா மற்றும் எண் நெடுவரிசைகளில் சரியான டிரேட் மதிப்புகள் உள்ளதா எனச் சரிபார்க்கவும்.',
  'trade-import.notice.complete':
    'Trade Import முடிந்தது: {written} எழுதப்பட்டது அல்லது புதுப்பிக்கப்பட்டது, {duplicateCount} நகல், {failedCount} தோல்வி',
  'trade-import.gate.brand-left': 'டிரேட்',
  'trade-import.gate.brand-right': 'இறக்கு',
  'trade-import.gate.sign-in.title':
    'உங்கள் டிரேட் வரலாற்றை இலவசமாக முன்னோட்டமிடவும்',
  'trade-import.gate.sign-in':
    'உங்கள் கோப்பை பகுப்பாய்வு செய்ய உள்நுழையவும் அல்லது இலவச Journalit கணக்கை உருவாக்கவும். நீங்கள் டிரேட்களை இறக்குமதி செய்யும் போது மட்டுமே புரோ தேவைப்படுகிறது.',
  'trade-import.gate.sign-in.reassurance':
    'உங்கள் கோப்பு தனிப்பட்ட முறையில் செயலாக்கப்பட்டது மற்றும் இயல்புநிலையாக சேமிக்கப்படவில்லை.',
  'trade-import.gate.sign-in.no-trial':
    'பகுப்பாய்வு செய்வதற்கும் முன்னோட்டமிடுவதற்கும் எந்த ப்ரோ சோதனையும் தேவையில்லை.',
  'trade-import.gate.sign-in.cta': 'இலவச மாதிரிக்காட்சிக்கு உள்நுழையவும்',

  'trade-import.step.select': 'பதிவேற்று',
  'trade-import.step.privacy': 'தனியுரிமை குறிப்பு',
  'trade-import.step.analyse': 'மதிப்பாய்வு',
  'trade-import.step.preview': 'இறக்கு',
  'trade-import.label.template': 'உள்ளூர் மேப்பிங் வார்ப்புரு',
  'trade-import.label.template-actions': 'வார்ப்புரு செயல்கள்',
  'trade-import.template.none': 'வார்ப்புரு இல்லை',
  'trade-import.label.account': 'கணக்கு',
  'trade-import.label.broker': 'ஏற்றுமதி மூலம் / தளம்',
  'trade-import.label.asset-type': 'சொத்து வகை',
  'trade-import.asset.stock': 'பங்கு',
  'trade-import.asset.options': 'விருப்பங்கள்',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.label.manual-mode': 'கைமுறை முறை',
  'trade-import.manual-mode.price-based': 'விலை அடிப்படையிலானது',
  'trade-import.manual-mode.direct-pnl': 'நேரடி P&L',
  'trade-import.label.ai-mapping': 'AI மேப்பிங் பரிந்துரைகளைக் கோரவும்',
  'trade-import.privacy.copy':
    'Trade Import தேர்ந்தெடுக்கப்பட்ட தரகர் ஏற்றுமதியை செயலாக்கத்திற்காக Journalit சேவையகங்களுக்கு பதிவேற்றுகிறது. தரகர் ஏற்றுமதிகளில் கணக்கு அடையாளங்காட்டிகள், டிரேட் வரலாறு, சின்னங்கள், நேர முத்திரைகள், விலைகள், அளவுகள், கட்டணம், இருப்புக்கள் மற்றும் P&L ஆகியவை இருக்கலாம். முன்னோட்ட உருவாக்கத்திற்காக, Journalit நீங்கள் தேர்ந்தெடுத்த கணக்குப் பெயர், மேப்பிங்/வார்ப்புரு தேர்வுகள், தனிப்பயன் புல வரையறைகள் மற்றும் சேமிக்கப்பட்ட விருப்பங்கள் மற்றும் IBKR திறந்த நிலைப் பொருத்தத்திற்கான வரையறுக்கப்பட்ட உள்ளூர் திறந்த டிரேட் சூழலையும் அனுப்புகிறது. இந்த இறக்குமதிக்காக மூலக் கோப்புகள் செயலாக்கப்படுகின்றன, அவை இயல்பாகச் சேமிக்கப்படாது.',

  'trade-import.action.analyse': 'கோப்பை பகுப்பாய்வு செய்யுங்கள்',
  'trade-import.action.choose-file':
    'பதிவேற்ற அல்லது இழுத்து விட கிளிக் செய்யவும்',
  'trade-import.guide.prompt': 'எதை ஏற்றுமதி செய்வது என்று தெரியவில்லையா?',
  'trade-import.guide.link': 'தரகர் வழிகாட்டியைப் பார்க்கவும்',
  'trade-import.action.drop-file': 'பதிவேற்ற கோப்பை கைவிடவும்',
  'trade-import.analyse.detected':
    '{fileType} கண்டறியப்பட்டது. பின்தளத்தில் தலைப்புகள் மற்றும் மாதிரி வரிசைகள் திரும்பும்.',
  'trade-import.diagnostic.info': 'தகவல்',
  'trade-import.label.sheet': 'தாள்',
  'trade-import.label.header-row': 'தலைப்பு வரிசை',
  'trade-import.placeholder.auto': 'ஆட்டோ',
  'trade-import.label.date-format': 'தேதி வடிவம்',

  'trade-import.label.save-template': 'மேப்பிங் வார்ப்புருவைச் சேமிக்கவும்',
  'trade-import.placeholder.template-name': 'வார்ப்புரு பெயர்',
  'trade-import.action.save-template': 'வார்ப்புருவைச் சேமிக்கவும்',
  'trade-import.action.preview': 'முன்னோட்டத்தை உருவாக்கவும்',

  'trade-import.preview.found.one': '{count} டிரேடைக் கண்டறிந்தோம்',
  'trade-import.preview.found.few': '{count} டிரேட்களைக் கண்டறிந்தோம்',
  'trade-import.preview.found.many': '{count} டிரேட்களைக் கண்டறிந்தோம்',
  'trade-import.preview.found.other': '{count} டிரேட்களைக் கண்டறிந்தோம்',
  'trade-import.preview.date-range': '{start}–{end}',
  'trade-import.preview.metric.symbols': 'சின்னங்கள்',
  'trade-import.preview.metric.ready': 'இறக்குமதி செய்ய தயார்',
  'trade-import.preview.metric.duplicates': 'சாத்தியமான பிரதிகள்',
  'trade-import.preview.metric.attention': 'கவனம் தேவை',
  'trade-import.preview.completed.message':
    'டிரேட் இறக்குமதி செய்யத் தயாராக உள்ளது: {count}.',
  'trade-import.preview.partial.message':
    'டிரேட் தயாராக உள்ளது: {count}. வரிசைகள் இறக்குமதி செய்யப்படவில்லை: {failed}. முழுமையற்ற வரிசைகள் தவிர்க்கப்பட்டன: {incomplete}.',
  'trade-import.preview.partial.guidance':
    'கீழே காட்டப்பட்டுள்ள செல்லுபடியாகும் டிரேட்கள் மட்டுமே இறக்குமதி செய்யப்படும்.',
  'trade-import.preview.failed.message':
    'இந்தக் கோப்பிலிருந்து எந்த டிரேடையும் தயாரிக்க முடியாது.',
  'trade-import.preview.failed.guidance':
    'நெடுவரிசை மேப்பிங், தேதி வடிவம், தேர்ந்தெடுக்கப்பட்ட தாள் மற்றும் தலைப்பு வரிசை மற்றும் கீழே உள்ள தவறான மதிப்புகள் ஆகியவற்றை மதிப்பாய்வு செய்யவும்.',
  'trade-import.preview.tradovate-performance.title': 'தவறான Tradovate அறிக்கை',
  'trade-import.preview.tradovate-performance.message':
    'இது Tradovate Performance ஏற்றுமதியாகத் தெரிகிறது. உங்கள் செயல்படுத்தல்களைத் துல்லியமாக மீளமைக்க Journalit Orders அறிக்கையை இறக்குமதி செய்கிறது. Tradovate-இல் Reports > Orders சென்று CSV-ஐப் பதிவிறக்கவும்.',
  'trade-import.preview.tradovate-performance.guide':
    'Tradovate ஏற்றுமதி வழிகாட்டியைப் பார்க்கவும்',
  'trade-import.preview.metatrader-statement.title':
    'ஆதரிக்கப்படாத MetaTrader அறிக்கை',
  'trade-import.preview.metatrader-statement.message':
    'Journalit அசல் MetaTrader கணக்கு வரலாறு அறிக்கையை இறக்குமதி செய்கிறது. MetaTrader-ஐ ஆங்கிலத்திற்கு மாற்றி, Account History / History-ஐத் திறந்து, Save as Report என்பதைத் தேர்ந்தெடுத்து, திருத்தவோ மாற்றவோ செய்யாமல் அசல் .html அல்லது .htm கோப்பைப் பதிவேற்றவும்.',
  'trade-import.preview.metatrader-statement.guide':
    'MetaTrader ஏற்றுமதி வழிகாட்டியைப் பார்க்கவும்',
  'trade-import.preview.tradingview-export.title': 'தவறான TradingView ஏற்றுமதி',
  'trade-import.preview.tradingview-export.message':
    'Journalit-க்கு TradingView Paper Trading-இன் Order History / History CSV தேவை. Account History, விளக்கப்படத் தரவு, உத்தி ஏற்றுமதிகள் அல்லது பிற TradingView CSV கோப்புகளைப் பயன்படுத்த வேண்டாம்.',
  'trade-import.preview.tradingview-export.guide':
    'TradingView ஏற்றுமதி வழிகாட்டியைப் பார்க்கவும்',
  'trade-import.source-recovery.deepcharts.title':
    'இந்தக் கோப்பு DeepCharts ஏற்றுமதி போல உள்ளது',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    'கணக்கு Rithmic மூலம் செயல்பட்டாலும், கோப்பு DeepCharts இலிருந்து வந்தது. குறியீடு கொண்ட Quantity சரியாக லாங் அல்லது ஷார்ட்டை தீர்மானிக்க DeepCharts ஐ பயன்படுத்தவும்.',
  'trade-import.source-recovery.deepcharts.manual-message':
    'DeepCharts இறக்குமதியை பயன்படுத்தவும். DeepCharts திசையை குறியீடு கொண்ட Quantity இல் சேமிக்கிறது; எனவே Quantity ஐ கைமுறை Direction புலமாக இணைக்க வேண்டாம்.',
  'trade-import.source-recovery.deepcharts.switch': 'DeepCharts க்கு மாற்று',
  'trade-import.source-recovery.deepcharts.guide':
    'DeepCharts ஏற்றுமதி வழிகாட்டியை காண்க',
  'trade-import.source-recovery.motivewave.title':
    'இந்தக் கோப்பு MotiveWave செயலாக்க ஏற்றுமதி போல உள்ளது',
  'trade-import.source-recovery.motivewave.message':
    'செயலாக்க வரிகளை முடிந்த டிரேட்களாக Journalit சரியாக இணைக்க MotiveWave ஐ பயன்படுத்தவும்.',
  'trade-import.source-recovery.motivewave.switch': 'MotiveWave க்கு மாற்று',
  'trade-import.source-recovery.motivewave.guide':
    'MotiveWave ஏற்றுமதி வழிகாட்டியை காண்க',
  'quick-import.message.source-mismatch':
    'Journalit வேறு ஏற்றுமதி மூலத்தை கண்டறிந்துள்ளது. கோப்பை மீண்டும் பதிவேற்றாமல் மூலத்தை மாற்ற Trade Import இல் பரிசீலிக்கவும்.',
  'trade-import.preview.no-eligible':
    'கோப்பு வெற்றிகரமாக பாகுபடுத்தப்பட்டது, ஆனால் புதிய அல்லது புதுப்பிக்கப்பட்ட டிரேட்கள் எதுவும் இறக்குமதி செய்ய தகுதியற்றவை. கீழே உள்ள நகல் மற்றும் வகைப்பாடு விவரங்களை மதிப்பாய்வு செய்யவும்.',
  'trade-import.pro-gate.title.one': '{count} வர்த்தகம் இறக்குமதிக்குத் தயார்',
  'trade-import.pro-gate.title.few':
    '{count} வர்த்தகங்கள் இறக்குமதிக்குத் தயார்',
  'trade-import.pro-gate.title.many':
    '{count} வர்த்தகங்கள் இறக்குமதிக்குத் தயார்',
  'trade-import.pro-gate.title.other':
    '{count} வர்த்தகங்கள் இறக்குமதிக்குத் தயார்',
  'trade-import.pro-gate.subtitle':
    'அவற்றை வர்த்தகக் குறிப்புகளாக உங்கள் வால்ட்டில் எழுத PRO-ஐ செயல்படுத்துங்கள்.',
  'trade-import.pro-gate.cta': 'PRO-ஐ செயல்படுத்து',
  'trade-import.preview.diagnostics': 'மதிப்பாய்வு விவரங்கள் ({count})',
  'trade-import.preview.affected-rows': 'பாதிக்கப்பட்ட வரிசைகள்: {count}',
  'trade-import.table.status': 'நிலை',
  'trade-import.table.symbol': 'சின்னம்',
  'trade-import.table.direction': 'திசை',
  'trade-import.table.entry-time': 'நுழைவு நேரம்',
  'trade-import.table.date': 'தேதி',
  'trade-import.table.quantity': 'அளவு',
  'trade-import.table.position': 'Position',
  'trade-import.table.result': 'முடிவு',
  'trade-import.table.message': 'செய்தி',
  'trade-import.action.confirm': 'இறக்குமதியை உறுதிப்படுத்தவும்',
  'trade-import.action.activate-pro.one':
    '{count} டிரேடை இறக்குமதி செய்ய PRO ஐ செயல்படுத்தவும்',
  'trade-import.action.activate-pro.few':
    '{count} டிரேட்களை இறக்குமதி செய்ய PRO ஐ செயல்படுத்தவும்',
  'trade-import.action.activate-pro.many':
    '{count} டிரேட்களை இறக்குமதி செய்ய PRO ஐ செயல்படுத்தவும்',
  'trade-import.action.activate-pro.other':
    '{count} டிரேட்களை இறக்குமதி செய்ய PRO ஐ செயல்படுத்தவும்',
  'trade-import.action.cancel-preview': 'முன்னோட்டத்தை ரத்துசெய்',
  'trade-import.broker.manual': 'கைமுறை மேப்பிங்',

  'home.quick-links.quick-import': 'விரைவான இறக்குமதி',
  'home.quick-links.setups': 'Setups',
  'command.open-setups': 'Setupsஐத் திறக்கவும்',
  'setups.view.loading': 'Setups-ஐ ஏற்றுகிறது…',
  'setups.view.error.title': 'Setups-ஐ ஏற்ற முடியவில்லை',
  'setups.view.error.load-failed': 'Setupத் தரவை ஏற்றுவதில் தோல்வி.',
  'setups.view.action.retry': 'மீண்டும் முயல்க',

  'setups.view.action.create': 'Setup-ஐ உருவாக்கவும்',
  'setups.view.action.new': 'புதிய Setup',
  'setups.create.title': 'உருவாக்கு Setup',
  'setups.create.field.name': 'Setup பெயர்',
  'setups.create.placeholder.name': 'இயக்ககத்தைத் திறக்கிறது',
  'setups.create.field.status': 'நிலை',
  'setups.create.field.direction': 'திசை',
  'setups.create.field.color': 'நிறம்',
  'setups.create.field.color-description':
    'இந்த Setup-ஐ அடையாளம் காண வண்ணத்தைத் தேர்ந்தெடுக்கவும்.',
  'setups.create.field.tags': 'குறிச்சொற்கள்',
  'setups.create.placeholder.tags': 'Momentum, Breakout, Morning',
  'setups.create.profile.heading': 'விருப்பமான புலங்கள்',
  'setups.create.profile.optional-label': '(விரும்பினால்)',
  'setups.create.field.sessions': 'அமர்வுகள்',
  'setups.create.field.preferred-sessions-tooltip':
    'இந்த அமர்வுகளை அமைப்புகள் → ஜர்னல் → அமர்வு பயன்முறையில் நிர்வகிக்கவும்.',
  'setups.create.placeholder.preferred-sessions': 'லண்டன், நியூயார்க்',
  'setups.create.field.timeframes': 'காலவரையறைகள்',
  'setups.create.placeholder.preferred-timeframes': '5 மீ, 15 மீ, 1 மணி',
  'setups.create.field.tickers': 'டிக்கர்ஸ்',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
  'setups.create.direction.any': 'குறிப்பிடப்படவில்லை',
  'setups.create.direction.long': 'Long',
  'setups.create.direction.short': 'Short',
  'setups.create.direction.both': 'இரண்டும்',
  'setups.create.field.linked-notes': 'இணைக்கப்பட்ட குறிப்புகள்',
  'setups.create.field.linked-notes-desc':
    'இந்த Setup-க்கான பிளேபுக்கை ஆவணப்படுத்தும் ஏற்கனவே உள்ள குறிப்புகளை இணைக்கவும்.',
  'setups.create.linked-notes.empty': 'இன்னும் குறிப்புகள் இணைக்கப்படவில்லை.',
  'setups.create.linked-notes.add': '+ இணைப்பு குறிப்பு',
  'setups.create.linked-notes.remove': 'இணைக்கப்பட்ட குறிப்பை அகற்று',
  'setups.create.linked-notes.picker-title':
    'பிளேபுக் குறிப்பைத் தேர்ந்தெடுக்கவும்',
  'setups.create.linked-notes.search': 'குறிப்புகளைத் தேடு...',
  'setups.create.linked-notes.no-notes':
    'மார்க் டவுன் குறிப்புகள் எதுவும் இல்லை.',
  'setups.create.button.creating': 'உருவாக்குகிறது...',
  'setups.create.button.create': 'உருவாக்கு Setup',
  'setups.create.success': 'Setup "{name}" வெற்றிகரமாக உருவாக்கப்பட்டது',
  'setups.create.error.name-required': 'Setup பெயர் தேவை',
  'setups.create.error.tag-save-failed':
    'உங்கள் உலகளாவிய குறிச்சொல் பட்டியலில் குறிச்சொல்லைச் சேமிக்க முடியவில்லை.',
  'setups.create.error.failed': 'Setup-ஐ உருவாக்க முடியவில்லை',
  'setups.edit.title': 'திருத்து Setup',
  'setups.edit.button.saving': 'சேமிக்கிறது...',
  'setups.edit.button.save': 'சேமி Setup',
  'setups.edit.button.rename-and-update':
    'டிரேட்களை மறுபெயரிட்டு புதுப்பிக்கவும்',
  'setups.edit.rename-warning.title':
    'Setup-ஐ மறுபெயரிடவும் மற்றும் டிரேட்களைப் புதுப்பிக்கவும்',
  'setups.edit.rename-warning.message':
    '{oldName} to {newName} என மறுபெயரிடுவது பழைய Setupப் பெயரைப் பயன்படுத்தும் டிரேட் குறிப்புகளைப் புதுப்பிக்கும்.',
  'setups.edit.delete.button': 'Setup-ஐ நீக்கு',
  'setups.edit.delete.title': 'Setup-ஐ நீக்கு',
  'setups.edit.delete.confirm': 'நீக்குவதை உறுதிப்படுத்தவும்',
  'setups.edit.delete.warning':
    '"{name}"-ஐ நீக்குவது Setup-ஐ நிரந்தரமாக அகற்றி, இணைக்கப்பட்ட டிரேட்களிலிருந்து அழிக்கும். இதைச் செயல்தவிர்க்க முடியாது.',
  'setups.edit.delete.success': '"{name}" Setup நீக்கப்பட்டது',
  'setups.edit.delete.error': 'Setup-ஐ நீக்க முடியவில்லை',
  'setups.edit.success': 'Setup "{name}" வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
  'setups.edit.error.failed': 'Setup-ஐப் புதுப்பிக்க முடியவில்லை',
  'setups.view.action.compare-selected':
    'தேர்ந்தெடுக்கப்பட்ட Setups-ஐ ஒப்பிடுக',
  'setups.view.tabs.aria': 'Setup தாவல்களைப் பார்க்கவும்',
  'setups.view.tab.overview': 'மேலோட்டம்',
  'setups.view.tab.compare': 'ஒப்பிடு',
  'setups.view.card.select-for-compare':
    'ஒப்பிடுவதற்கு Setup-ஐத் தேர்ந்தெடுக்கவும்',

  'setups.view.compare.title': 'Setups-ஐ ஒப்பிடுக',

  'setups.view.compare.empty':
    'ஒப்பிடுவதற்கு இரண்டு Setups-ஐ தேர்ந்தெடுக்கவும்.',
  'setups.view.compare.empty-submessage':
    'அருகருகே அறிக்கையை உருவாக்க மேலோட்டத்தில் இருந்து இரண்டு Setup அட்டைகளைத் தேர்வு செய்யவும்.',
  'setups.view.compare.metrics-title': 'ஒப்பீட்டு அளவீடுகள்',
  'setups.view.compare.metric': 'மெட்ரிக்',
  'setups.view.compare.edge-column': 'Edge',
  'setups.view.compare.edge-label': 'வெற்றியாளர்',

  'setups.view.compare.no-clear-edge': 'தெளிவான Edge இல்லை',
  'setups.view.compare.expectancy-edge': 'Expectancy Edge',
  'setups.view.compare.confidence': 'Confidence',
  'setups.view.compare.sample': 'மாதிரி',
  'setups.view.compare.confidence.high': 'உயர்',
  'setups.view.compare.confidence.moderate': 'மிதமான',
  'setups.view.compare.confidence.low': 'குறைந்த',
  'setups.view.compare.edge-strength.strong': 'வலுவான Edge',
  'setups.view.compare.edge-strength.clear': 'தெளிவான Edge',
  'setups.view.compare.edge-strength.slight': 'லேசான Edge',
  'setups.view.compare.edge-reasons-privacy':
    'தனியுரிமை பயன்முறை இயக்கத்தில் இருக்கும்போது Edge விவரங்கள் மறைக்கப்படும்.',
  'setups.view.compare.reason.higher.net-pnl': 'உயர் நிகர PnL',
  'setups.view.compare.reason.lower.net-pnl': 'லோயர் நெட் PnL',
  'setups.view.compare.reason.similar.net-pnl': 'இதே போன்ற நெட் PnL',
  'setups.view.compare.reason.higher.total-r': 'அதிக மொத்த ஆர்',
  'setups.view.compare.reason.lower.total-r': 'குறைந்த மொத்த ஆர்',
  'setups.view.compare.reason.similar.total-r': 'இதேபோன்ற மொத்த ஆர்',
  'setups.view.compare.reason.higher.win-rate': 'அதிக Win Rate',
  'setups.view.compare.reason.lower.win-rate': 'கீழ் Win Rate',
  'setups.view.compare.reason.similar.win-rate': 'ஒத்த Win Rate',
  'setups.view.compare.reason.higher.expectancy': 'அதிக Expectancy',
  'setups.view.compare.reason.lower.expectancy': 'குறைந்த Expectancy',
  'setups.view.compare.reason.similar.expectancy': 'ஒத்த Expectancy',
  'setups.view.compare.reason.higher.profit-factor': 'அதிக Profit Factor',
  'setups.view.compare.reason.lower.profit-factor': 'கீழ் Profit Factor',
  'setups.view.compare.reason.similar.profit-factor': 'ஒத்த Profit Factor',

  'setups.view.compare.cumulative-title': 'ஒட்டுமொத்த செயல்திறன்',
  'setups.view.compare.cumulative-privacy':
    'தனியுரிமை பயன்முறை இயக்கத்தில் இருக்கும்போது ஒட்டுமொத்த செயல்திறன் மறைக்கப்படும்.',
  'setups.view.compare.cumulative-empty':
    'தேர்ந்தெடுக்கப்பட்ட Setups-க்கு ஒட்டுமொத்த டிரேட் தரவு இல்லை.',

  'setups.view.trade.unknown-instrument': 'தெரியாத இன்ஸ்ட்ருமென்ட்',

  'setups.guide.create-new-setup.title': 'புதிய Setups-ஐ உருவாக்கவும்',
  'setups.guide.create-new-setup.description':
    'மற்றொரு பிளேபுக்கைச் சேர்க்க விரும்பும் போது புதிய Setup-ஐப் பயன்படுத்தவும். புதிய Setup modal அதன் விவரங்கள், குறிச்சொற்கள், இணைக்கப்பட்ட குறிப்புகள் மற்றும் விதிகள் மூலம் உங்களை அழைத்துச் செல்கிறது.',
  'setups.guide.detail-intro.title': 'இது Setupப் பக்கம்',
  'setups.guide.detail-intro.description':
    'இந்த Setupப் பக்கம் ஒரு குறியிடப்பட்ட பிளேபுக்கை அதன் செயல்திறன் விளக்கப்படம், சூழல் பேனல், குறிப்புப் பொருள், செயல்கள் மற்றும் செயல்படுத்தல் விதிகள் ஆகியவற்றைக் கொண்டு கவனம் செலுத்துகிறது.',
  'setups.guide.detail-actions.title': 'Setup செயல்கள்',
  'setups.guide.detail-actions.description':
    'தொடர்புடைய டிரேட்களைத் திறக்க அல்லது அதன் விவரங்கள், இணைக்கப்பட்ட குறிப்புகள், ஸ்கிரீன்ஷாட்கள் மற்றும் பிளேபுக் விதிகள் உட்பட Setup-ஐத் திருத்த இந்தப் பொத்தான்களைப் பயன்படுத்தவும்.',
  'setups.guide.empty.create-setup.title': 'புதிய Setup-இல் தொடங்கவும்',
  'setups.guide.empty.create-setup.description':
    'முதலில் ஒரு Setup-ஐ உருவாக்கவும். அது இருந்த பிறகு, இந்த வழிகாட்டி வழக்கமான Setup ஒத்திகையுடன் தொடரும்.',

  'setups.guide.intro.title': 'Setupsக்கு வரவேற்கிறோம்',
  'setups.guide.intro.description':
    'இந்தக் காட்சி உங்கள் Setup பிளேபுக்குகள், இணைக்கப்பட்ட டிரேட்கள், குறிப்புகள், ஸ்கிரீன் ஷாட்கள் மற்றும் விதிகளை ஒரே இடத்தில் கொண்டுவருகிறது.',
  'setups.guide.view-tabs.title': 'Setup காட்சிகளை மாற்றவும்',
  'setups.guide.view-tabs.description':
    'போதுமான Setups கிடைக்கும்போது மேலோட்டம், Setup ஜோடிகள் மற்றும் ஒப்பீட்டு ஓட்டம் ஆகியவற்றுக்கு இடையே நகர்த்துவதற்கு இந்தத் தாவல்களைப் பயன்படுத்தவும்.',
  'setups.guide.overview-chart.title': 'செயல்திறன் தரவரிசை',
  'setups.guide.overview-chart.description':
    'தேர்ந்தெடுக்கப்பட்ட அளவீட்டின்படி மேலோட்ட விளக்கப்படம் Setups-ஐ வரிசைப்படுத்துகிறது. மெட்ரிக்கை மாற்றுவதற்கு மேல் வலதுபுறத்தில் உள்ள கட்டுப்பாடுகளைப் பயன்படுத்தவும் அல்லது குறிப்பிட்ட Setups-இல் விளக்கப்படத்தை மையப்படுத்தவும்.',
  'setups.guide.tag-filter.title': 'Setups-ஐ வடிகட்டு',
  'setups.guide.tag-filter.description':
    'Setup குறிச்சொற்கள் அல்லது திசையின் மூலம் அட்டைகள், விளக்கப்படம், ஜோடிகள் மற்றும் ஒப்பீட்டுத் தேர்வுகளை வடிகட்டவும். ஒவ்வொரு குழுவிற்கும் உள்ள தேர்வுகள் அல்லது தர்க்கத்தைப் பயன்படுத்துகின்றன, அதே சமயம் குறிச்சொற்களும் திசையும் ஒன்றாக இணைகின்றன.',
  'setups.guide.setup-cards.title': 'Setup கார்டுகள்',
  'setups.guide.setup-cards.description':
    'கார்டுகள் ஒவ்வொரு Setup-ஐயும் முக்கிய அளவீடுகள், நிலை, குறிச்சொற்கள், கடைசியாக டிரேட் செய்த தேதி மற்றும் சிறிய செயல்திறன் போக்கு ஆகியவற்றுடன் சுருக்கமாகக் கூறுகின்றன.',
  'setups.guide.open-detail.title': 'Setupப் பக்கத்தைத் திறக்கவும்',
  'setups.guide.open-detail.description':
    'தயாரானதும், ஒரு செட்அப் அட்டையைத் திறந்து அதன் பக்கத்தைப் பாருங்கள். அங்கு ஒரு சிறிய வழிகாட்டி உங்களை வரவேற்கும்.',
  'setups.guide.detail-performance.title': 'விரிவான செயல்திறன்',
  'setups.guide.detail-performance.description':
    'செயல்திறன் தாவல் இந்த Setup-இன் விளக்கப்படம் மற்றும் காலப்போக்கில் முக்கிய அளவீடுகளைக் காட்டுகிறது, இதில் P&L, Win Rate, Expectancy மற்றும் Drawdown அடங்கும்.',
  'setups.guide.detail-context.title': 'Setup சூழல்',
  'setups.guide.detail-context.description':
    'இந்த பேனல் Setup ஆரோக்கியம், கவனம் செலுத்தும் பொருட்கள், இணைக்கப்பட்ட குறிப்புகள் மற்றும் ஸ்கிரீன் ஷாட்களை அருகில் வைத்திருக்கும்.',
  'setups.guide.detail-playbook.title': 'பிளேபுக் குறிப்புகள்',
  'setups.guide.detail-playbook.description':
    'இந்த Setup-க்கான இணைக்கப்பட்ட குறிப்பை பிளேபுக் பகுதி முன்னோட்டமிடுகிறது. இது மார்க் டவுன், படங்கள், எக்ஸ்காலிட்ரா அல்லது நீங்கள் விரும்பும் ஏதேனும் குறிப்புப் பொருளாக இருக்கலாம்.',
  'setups.guide.detail-rules.title': 'செயல்படுத்தும் விதிகள்',
  'setups.guide.detail-rules.description':
    'சிறந்த நிபந்தனைகள், நுழைவுகள், ஆபத்து மற்றும் தவிர்க்க வேண்டிய தவறுகளுக்கான கட்டமைக்கப்பட்ட சரிபார்ப்புப் பட்டியலை விதிகள் பதிவு செய்கின்றன.',
  'setups.guide.finish.title': 'Setups வழிகாட்டி முடிந்தது',
  'setups.guide.finish.description':
    'முக்கிய Setups பரப்புகளை நீங்கள் பார்த்திருக்கிறீர்கள்: மேலோட்டம், இணைகள், ஒப்பிடுதல் மற்றும் தனிப்பட்ட Setupப் பக்கம்.',

  'setups.guide.pairs-mode.title': 'Setup ஜோடிகளைத் திறக்கவும்',
  'setups.guide.pairs-mode.description':
    'எந்த Setup சேர்க்கைகள் ஒப்பிடுவதற்குப் போதுமான பகிரப்பட்ட டிரேட்களைக் கொண்டுள்ளன என்பதைப் பார்க்க Pairs-ஐத் திறக்கவும்.',
  'setups.guide.pairs-chart.title': 'ஜோடி தரவரிசை',
  'setups.guide.pairs-chart.description':
    'ஜோடிகளின் பயன்முறை சிறந்த அல்லது மோசமாகச் செயல்படக்கூடிய சேர்க்கைகளை எடுத்துக்காட்டுகிறது. அந்த கலவைக்கான ஆழமான ஜோடி நுண்ணறிவுகளைத் திறக்க ஒரு பட்டியைக் கிளிக் செய்யவும்.',

  'setups.guide.compare-mode.title': 'ஒப்பீட்டு பயன்முறையைத் தொடங்கவும்',
  'setups.guide.compare-mode.description':
    'ஒப்பீட்டு பயன்முறையானது, அருகருகே மதிப்பாய்வுக்காக இரண்டு Setup அட்டைகளைத் தேர்ந்தெடுக்க உங்களை அனுமதிக்கிறது.',
  'setups.guide.compare-select.title': 'இரண்டு Setups-ஐ தேர்ந்தெடுக்கவும்',
  'setups.guide.compare-select.description':
    'ஒப்பீட்டுப் பக்கத்தைத் திறக்க இரண்டு Setup அட்டைகளைத் தேர்ந்தெடுக்கவும்.',
  'setups.guide.compare-summary.title': 'இது ஒப்பீட்டுப் பக்கம்',
  'setups.guide.compare-summary.description':
    'இந்தப் பக்கம் இரண்டு Setups-ஐ அருகருகே ஒப்பிடுகிறது. மேல் சுருக்க வரிசையில் வெற்றியாளர், Expectancy Edge, Confidence மற்றும் ஒரு Setup-இல் ஏன் Edge இருக்கலாம்.',
  'setups.guide.compare-body.title': 'ஒப்பீட்டு சுருக்க வரிசை',
  'setups.guide.compare-body.description':
    'மேல் வரிசை ஒப்பீட்டைச் சுருக்கமாகக் கூறுகிறது: வெற்றியாளர், Expectancy Edge, Confidence மற்றும் Edge-க்குப் பின்னால் உள்ள காரணங்கள்.',
  'setups.guide.compare-details.title': 'ஒப்பீடு விவரங்கள்',
  'setups.guide.compare-details.description':
    'இரண்டு Setups-உம் எவ்வாறு வேறுபடுகின்றன என்பதைப் புரிந்துகொள்ள அளவீடுகள் அட்டவணை மற்றும் ஒட்டுமொத்த விளக்கப்படத்தைப் பயன்படுத்தவும்.',
  'setups.guide.detail-execution-gap.title': 'Execution Gap பகுப்பாய்வு',
  'setups.guide.detail-execution-gap.description':
    'தவறவிட்ட டிரேட் அல்லது Backtest தரவு இருக்கும் போது, இந்தத் தாவல் பதிவு செய்யப்பட்ட செயல்பாட்டைத் தவறவிட்ட அல்லது benchmark வாய்ப்புடன் ஒப்பிடுகிறது.',
  'setups.guide.back-to-overview.title': 'Setup அட்டைகளுக்குத் திரும்பு',
  'setups.guide.back-to-overview.description':
    'ஒப்பிட்டு முடித்ததும் Setup அட்டைகளுக்குத் திரும்பவும்.',

  'setups.view.title': 'Setups',
  'setups.view.open-as-markdown': 'Markdown ஆக திற',
  'setups.view.open-as-setup': 'Journalit Setup ஆக திற',

  'setups.view.summary.aria': 'Setup மேலோட்டச் சுருக்கம்',

  'setups.view.summary.needs-review': 'மதிப்பாய்வு தேவை',
  'setups.view.summary.best-performer': 'சிறந்த நடிப்பாளர்',

  'setups.view.ranking.metric-aria': 'செயல்திறன் அளவீடு',

  'setups.view.overview.mode.pairs': 'ஜோடிகள்',
  'setups.view.pairs.summary-aria': 'Setup ஜோடிகளின் சுருக்கம்',
  'setups.view.pairs.best': 'சிறந்த ஜோடி',
  'setups.view.pairs.worst': 'மோசமான ஜோடி',
  'setups.view.pairs.worst-short': 'மோசமானது',
  'setups.view.pairs.empty': '5+ டிரேட்களுடன் இதுவரை Setup ஜோடிகள் இல்லை.',
  'setups.view.pairs.empty-submessage':
    'இரண்டு Setups போதுமான இணைக்கப்பட்ட டிரேட்களைப் பகிர்ந்த பிறகு ஜோடிகள் தோன்றும்.',
  'setups.view.pairs.privacy':
    'தனியுரிமை பயன்முறை இயக்கத்தில் இருக்கும்போது ஜோடி செயல்திறன் மறைக்கப்படும்.',

  'setups.view.pairs.metric-aria': 'ஜோடி மெட்ரிக்',
  'setups.view.pairs.metric.edge': 'Pair Edge',
  'setups.view.pairs.metric.edge-short': 'edge',
  'setups.view.pairs.metric.expectancy': 'Pair Expectancy',

  'setups.view.pairs.together': 'ஒன்றாக',
  'setups.view.pairs.table.setup-pair': 'Setup ஜோடி',

  'setups.view.pairs.evidence': 'ஆதாரம்',
  'setups.view.pairs.edge-comparison': 'Edge ஒப்பீடு',
  'setups.view.pairs.edge-caption': 'ஒருங்கிணைந்த Edge: {edge}',
  'setups.view.overview.setup-filter.all': 'Setups: அனைத்தும்',
  'setups.view.overview.setup-filter.selected':
    'Setups: {count} தேர்ந்தெடுக்கப்பட்டது',
  'setups.view.overview.setup-filter.aria':
    'காண்பிக்க Setups-ஐ தேர்ந்தெடுக்கவும்',
  'setups.view.overview.setup-filter.select-all':
    'அனைத்தையும் தேர்ந்தெடுக்கவும்',
  'setups.view.overview.setup-filter.clear': 'அழி',
  'setups.view.overview.tag-filter.aria': 'Setups-ஐ வடிகட்டு',
  'setups.view.overview.tag-filter.reset': 'மீட்டமை',
  'setups.view.overview.tag-filter.untagged': 'குறியிடப்படாதது',
  'setups.view.overview.tag-filter.empty':
    'இந்த வடிப்பான்களுடன் எந்த Setupம் பொருந்தவில்லை',
  'setups.view.overview.tag-filter.empty-submessage':
    'மேலும் Setups-ஐக் காட்ட வடிப்பான்களைச் சரிசெய்யவும் அல்லது அழிக்கவும்.',

  'setups.view.overview.pnl-chart.dropdown-label': 'P&L வளைவு',

  'setups.view.overview.pnl-chart.combined': 'அனைத்து Setups-உம்',
  'setups.view.overview.pnl-chart.selected-combined':
    'தேர்ந்தெடுக்கப்பட்ட Setups',

  'setups.view.overview.pnl-chart.hidden':
    'தனியுரிமை பயன்முறை இயக்கப்பட்டிருக்கும் போது Setup P&L காலப்போக்கில் மறைக்கப்படும்.',
  'setups.view.overview.pnl-chart.trade': 'டிரேட்',
  'setups.view.overview.pnl-chart.start': 'தொடங்கு',
  'setups.view.ranking.privacy':
    'தனியுரிமை பயன்முறை இயக்கத்தில் இருக்கும்போது செயல்திறன் மதிப்புகள் மறைக்கப்படும்.',
  'setups.view.ranking.empty': 'இதுவரை Setup செயல்திறன் தரவு இல்லை.',
  'setups.view.ranking.empty-submessage':
    'தரவரிசை செயல்திறனைத் தொடங்க Setups-உடன் டிரேடை பதிவு செய்யவும்.',

  'setups.view.metric.trade-count': 'டிரேட் எண்ணிக்கை',
  'setups.view.metric.trades': 'டிரேட் செய்கிறது',
  'setups.view.metric.net-pnl': 'மொத்தம் P&L',
  'setups.view.metric.total-pnl': 'மொத்தம் PnL',
  'setups.view.metric.win-rate': 'Win Rate',
  'setups.view.metric.profit-factor': 'Profit Factor',
  'setups.view.metric.last-traded': 'கடைசியாக டிரேட் செய்யப்பட்டது',
  'setups.view.metric.expected-value': 'எதிர்பார்த்த மதிப்பு',

  'setups.view.status.active': 'செயலில்',
  'setups.view.status.testing': 'சோதனை',
  'setups.view.status.archived': 'காப்பகப்படுத்தப்பட்டது',

  'setups.view.empty.no-setups':
    'இதுவரை எந்த Setups-உம் இல்லை. பிளேபுக்குகளைக் கண்காணிக்கத் தொடங்க உங்களின் முதல் Setup-ஐ உருவாக்கவும்.',
  'setups.view.empty.no-setups-submessage':
    'Setups உங்கள் பிளேபுக் குறிப்புகள், விதிகள், டிரேட்கள் மற்றும் செயல்திறன் ஆகியவற்றை ஒரே இடத்தில் சேகரிக்கிறது.',

  'setups.view.detail.back': 'பின்செல்',

  'setups.view.detail.action.edit': 'Setup-ஐத் திருத்து',
  'setups.view.detail.action.view-trades': 'டிரேட் பதிவில் பார்க்கவும்',

  'setups.view.detail.playbook': 'பிளேபுக்',

  'setups.view.detail.no-playbook-note':
    'பிளேபுக் குறிப்பை இங்கே முன்னோட்டமிட இணைக்கவும்.',
  'setups.view.detail.link-playbook-note': 'இணைப்பு குறிப்பு',
  'setups.view.detail.change-playbook-note': 'குறிப்பை மாற்றவும்',

  'setups.view.detail.playbook-note-modal.empty':
    'பொருத்தமான குறிப்புகள் எதுவும் இல்லை.',
  'setups.view.detail.empty-playbook-note':
    'இணைக்கப்பட்ட பிளேபுக் குறிப்பு காலியாக உள்ளது.',
  'setups.view.detail.rules': 'விதிகள்',

  'setups.view.detail.rules.edit': 'விதிகளைத் திருத்தவும்',

  'setups.view.detail.rules.add': 'விதியைச் சேர்க்கவும்',

  'setups.view.detail.rules.empty-title': 'Setup பிளேபுக்கை உருவாக்கவும்',
  'setups.view.detail.rules.use-template': 'வார்ப்புருவைப் பயன்படுத்தவும்',
  'setups.view.detail.rules.applying-template':
    'வார்ப்புருவைப் பயன்படுத்துகிறது...',
  'setups.view.detail.rules.add-custom': 'விருப்ப விதி',
  'setups.view.detail.rules.template-error':
    'பிளேபுக் வார்ப்புருவைப் பயன்படுத்துவதில் தோல்வி.',
  'setups.view.detail.rules.template.best-conditions': 'சிறந்த நிபந்தனைகள்',
  'setups.view.detail.rules.template.entry-criteria': 'நுழைவு அளவுகோல்கள்',
  'setups.view.detail.rules.template.invalidation': 'Invalidation',
  'setups.view.detail.rules.template.risk-management': 'இடர் / மேலாண்மை',
  'setups.view.detail.rules.template.avoid-when': 'எப்போது தவிர்க்கவும்',
  'setups.view.detail.rules.template.common-mistakes': 'பொதுவான தவறுகள்',
  'setups.view.detail.rules.template.rule.best-conditions':
    'சந்தை சூழல் இந்த Setup-ஐ ஆதரிக்கிறது',
  'setups.view.detail.rules.template.rule.entry-criteria':
    'நுழைவு தூண்டுதல் தெளிவாக வரையறுக்கப்பட்டுள்ளது',
  'setups.view.detail.rules.template.rule.invalidation':
    'நுழைவதற்கு முன் Invalidation தெளிவாக உள்ளது',
  'setups.view.detail.rules.template.rule.risk-management':
    'ஆபத்து ஏற்றுக்கொள்ளத்தக்கது மற்றும் இலக்கு வரையறுக்கப்படுகிறது',
  'setups.view.detail.rules.template.rule.avoid-when':
    'தவிர்க்க வேண்டிய நிபந்தனைகள் இல்லை',
  'setups.view.detail.rules.template.rule.common-mistakes':
    'தெரிந்த Execution தவறுகள் தவிர்க்கப்படும்',
  'setups.view.detail.rules.field.label': 'விதி',
  'setups.view.detail.rules.field.description': 'விவரங்கள்',
  'setups.view.detail.rules.field.group': 'குழு',
  'setups.view.detail.rules.move-up': 'விதியை மேலே நகர்த்தவும்',
  'setups.view.detail.rules.move-down': 'விதியை கீழே நகர்த்தவும்',
  'setups.view.detail.rules.delete': 'விதியை நீக்கு',
  'setups.view.detail.rules.save-error': 'Setup விதிகளைச் சேமிப்பதில் தோல்வி.',
  'setups.view.detail.rules.validation-label':
    'சேமிப்பதற்கு முன் விதியின் பெயரைச் சேர்க்கவும் அல்லது வெற்று விதியை நீக்கவும்.',
  'setups.view.detail.rules.groups': 'குழுக்கள்',
  'setups.view.detail.rules.add-group': 'குழுவைச் சேர்க்கவும்',
  'setups.view.detail.rules.new-group': 'புதிய குழு',
  'setups.view.detail.rules.validation-group':
    'சேமிப்பதற்கு முன் குழுவின் பெயரைச் சேர்க்கவும் அல்லது வெற்றுக் குழுவை அகற்றவும்.',
  'setups.view.detail.rules.summary': '{count} விதிகள் · {groups} குழுக்கள்',

  'setups.view.detail.rule.category.context': 'சூழல்',
  'setups.view.detail.rule.category.entry': 'நுழைவு',
  'setups.view.detail.rule.category.exit': 'வெளியேற்றம்',
  'setups.view.detail.rule.category.risk': 'ஆபத்து',
  'setups.view.detail.rule.category.management': 'மேலாண்மை',
  'setups.view.detail.rule.category.invalidation': 'Invalidation',
  'setups.view.detail.rule.category.psychology': 'உளவியல்',
  'setups.view.detail.rule.required': 'தேவை',

  'setups.view.detail.no-linked-notes':
    'இணைக்கப்பட்ட குறிப்புகள் எதுவும் இல்லை.',

  'setups.view.detail.performance.cumulative-pnl': 'ஒட்டுமொத்த PnL',
  'setups.view.detail.performance.cumulative-r': 'ஒட்டுமொத்த ஆர்',
  'setups.view.detail.performance.drawdown': 'Drawdown',
  'setups.view.detail.performance.empty':
    'இதுவரை இணைக்கப்பட்ட டிரேட்கள் இல்லை.',
  'setups.view.detail.performance.empty-submessage':
    'இந்த Setup-ஐப் பயன்படுத்தும் டிரேட்கள் நீங்கள் பதிவு செய்யத் தொடங்கியவுடன் இங்கே தோன்றும்.',

  'setups.view.detail.analysis.performance': 'செயல்திறன்',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup செயல்திறன் தாவல்கள்',
  'setups.view.detail.brief.linked-notes-add':
    'இணைக்கப்பட்ட குறிப்புகளைத் திருத்தவும்',

  'setups.view.detail.execution-gap.live-pnl': 'நேரலை PnL',
  'setups.view.detail.execution-gap.live-r': 'Live R',
  'setups.view.detail.execution-gap.missed-edge': 'தவறவிட்ட Edge',
  'setups.view.detail.execution-gap.live-plus-missed': 'நேரலை + தவறவிட்டது',
  'setups.view.detail.execution-gap.backtest': 'Backtest',

  'setups.view.detail.execution-gap.capture-rate': 'Capture Rate',
  'setups.view.detail.execution-gap.capture-rate-tooltip':
    'Live P&L ÷ (Live P&L + missed-trade P&L). கிடைக்கக்கூடிய Edge-இல் எவ்வளவு பதிவு செய்தீர்கள் என்பதைக் காட்டுகிறது.',
  'setups.view.detail.execution-gap.average-r-delta': 'சராசரி R டெல்டா',
  'setups.view.detail.execution-gap.live-execution': 'Live Execution',
  'setups.view.detail.execution-gap.backtest-benchmark':
    'Backtest பெஞ்ச்மார்க்',
  'setups.view.detail.execution-gap.hidden':
    'Execution Gap தனியுரிமை பயன்முறையில் மறைக்கப்பட்டுள்ளது.',
  'setups.view.detail.execution-gap.empty':
    'Execution Gap-ஐப் பகுப்பாய்வு செய்ய, இந்த Setup-க்கான தவறவிட்ட டிரேட்கள் அல்லது Backtest டிரேட்களைப் பதிவு செய்யவும்.',

  'setups.view.detail.brief.health': 'Setup ஆரோக்கியம்',
  'setups.view.detail.brief.profile': 'சுயவிவரம்',
  'setups.view.detail.brief.linked-notes': 'இணைக்கப்பட்ட குறிப்புகள் ({count})',
  'setups.view.detail.brief.linked-notes-modal.title':
    'இணைக்கப்பட்ட குறிப்புகள்',
  'setups.view.detail.brief.linked-notes-modal.subtitle':
    'குறிப்புகள் {name} உடன் இணைக்கப்பட்டுள்ளன.',
  'setups.view.detail.brief.screenshots': 'ஸ்கிரீன்ஷாட்கள் ({count})',
  'setups.view.detail.brief.view-all': 'அனைத்தையும் பார்க்கவும்',
  'setups.view.detail.brief.no-screenshots':
    'இன்னும் ஸ்கிரீன்ஷாட்கள் இணைக்கப்படவில்லை.',
  'setups.view.detail.brief.screenshot-alt': 'Setup ஸ்கிரீன்ஷாட் {index}',
  'setups.view.detail.brief.screenshot-open': 'ஸ்கிரீன்ஷாட்டைத் திற {index}',
  'setups.view.detail.brief.status.complete': 'நிறைவு',
  'setups.view.detail.brief.status.missing': 'காணவில்லை',
  'setups.view.detail.brief.health.playbook': 'பிளேபுக்',
  'setups.view.detail.brief.health.rules': 'விதிகள்',
  'setups.view.detail.brief.health.notes': 'குறிப்புகள்',
  'setups.view.detail.brief.health.screenshots': 'ஸ்கிரீன்ஷாட்கள்',
  'setups.view.detail.brief.health.trades': 'டிரேட்கள்',
  'setups.view.detail.brief.count.rules': '{count} விதிகள்',
  'setups.view.detail.brief.count.notes': '{count} குறிப்புகள்',
  'setups.view.detail.brief.count.images': '{count} படங்கள்',
  'setups.view.detail.brief.count.trades': '{count} டிரேட்கள்',
  'setups.view.detail.brief.more': '+{count} மேலும்',

  'setups.view.detail.brief.profile.direction': 'திசை',
  'setups.view.detail.brief.profile.sessions': 'அமர்வுகள்',
  'setups.view.detail.brief.profile.timeframes': 'காலவரையறைகள்',
  'setups.view.detail.brief.profile.tickers': 'டிக்கர்ஸ்',
  'setups.view.detail.brief.direction.long': 'Long',
  'setups.view.detail.brief.direction.short': 'Short',
  'setups.view.detail.brief.direction.both': 'இரண்டும்',
  'setups.view.detail.attention.title': 'கவனம் தேவை',
  'setups.view.detail.attention.count': '{count} உருப்படிகள்',
  'setups.view.detail.attention.empty': 'Setup-இல் சிக்கல்கள் எதுவும் இல்லை.',
  'setups.view.detail.attention.show-more': '+{count} மேலும்',
  'setups.view.detail.attention.show-less': 'குறைவாகக் காட்டு',
  'setups.view.detail.attention.no-playbook-title':
    'பிளேபுக் குறிப்பை இணைக்கவும்',
  'setups.view.detail.attention.no-playbook-detail':
    'சூழல் மற்றும் எடுத்துக்காட்டுகளுக்கு ஒரு மூலக் குறிப்பை இணைக்கவும்.',
  'setups.view.detail.attention.no-rules-title':
    'Execution பிளேபுக்கை உருவாக்கவும்',
  'setups.view.detail.attention.no-rules-detail':
    'நுழைவுகள், Invalidation, ஆபத்து மற்றும் தவறுகளுக்கான அளவுகோல்களைச் சேர்க்கவும்.',

  'setups.view.detail.attention.no-trades-title': 'இதுவரை நேரடி டிரேட் இல்லை',
  'setups.view.detail.attention.no-trades-detail':
    'இதுவரை இணைக்கப்பட்ட நேரடி டிரேட் வரலாறு இல்லை.',
  'setups.view.detail.attention.no-screenshots-title':
    'எடுத்துக்காட்டு ஸ்கிரீன் ஷாட்களைச் சேமிக்கவும்',
  'setups.view.detail.attention.no-screenshots-detail':
    'மதிப்பாய்வு எடுத்துக்காட்டுகளுக்கு டிரேட்டில் ஸ்கிரீன்ஷாட்களை இணைக்கவும்.',
  'setups.view.detail.attention.stale-title':
    'சமீபத்திய பொருத்தத்தை மதிப்பாய்வு செய்யவும்',
  'setups.view.detail.attention.stale-detail':
    'இந்த Setup {count} நாட்களில் டிரேட் செய்யப்படவில்லை.',
  'setups.view.detail.attention.profit-factor-title':
    'செயல்திறன் மதிப்பாய்வு தேவை',
  'setups.view.detail.attention.profit-factor-detail':
    'இணைக்கப்பட்ட டிரேட்களில் Profit Factor 1.0க்குக் கீழே உள்ளது.',
  'setups.view.detail.attention.expectancy-title': 'Expectancy எதிர்மறை',
  'setups.view.detail.attention.expectancy-detail':
    'சராசரியாக இணைக்கப்பட்ட டிரேட் விளைவு Breakeven-க்குக் கீழே உள்ளது.',
  'setups.view.completeness.incomplete-playbook': 'முழுமையற்ற பிளேபுக்',
  'setups.view.completeness.no-rules': 'விதிகள் இல்லை',
  'setups.view.completeness.no-linked-notes': 'இணைக்கப்பட்ட குறிப்புகள் இல்லை',
  'setups.view.date.never': 'ஒருபோதும் இல்லை',
  'setups.view.metric.expectancy-r': 'Expectancy (R)',

  'setups.view.card.open-named': 'திற {name}',
  'setups.view.card.sparkline-aria': 'Setup ஸ்பார்க்லைன்',
  'setups.view.card.status.active': 'நிலையானது',
  'setups.view.card.status.monitor': 'கண்காணிக்கவும்',
  'setups.view.card.status.review': 'மதிப்பாய்வு',
  'setups.view.tags': 'குறிச்சொற்கள்',
  'setups.view.date.today': 'இன்று',
  'setups.view.date.yesterday': 'நேற்று',
  'setups.view.date.days-ago': '{count} நாட்களுக்கு முன்பு',
  'settings.general.copy-trading-pnl-toggled':
    'நகல் டிரேட் PnL என்பது {status}',

  'trade-import.restore.complete':
    '{written} இறக்குமதி செய்யப்பட்ட டிரேட்கள் மீட்டெடுக்கப்பட்டன; {failed} தோல்வியடைந்தது.',
  'trade-import.restore.broker-label': 'பின்தள மீட்டமைப்பு',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Trade Sync',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'உங்கள் FTP இணைப்பு மூலம் பதிவேற்றப்பட்ட MetaTrader அறிக்கைகளிலிருந்து டிரேட்களை ஒத்திசைக்கவும்.',
  'trade-sync.source.trade-import.description':
    'vaults முழுவதும் தரகர்-கோப்பு இறக்குமதிகளை மீட்டெடுக்கவும் மற்றும் விடுபட்ட உள்ளூர் டிரேட் குறிப்புகளை மீட்டெடுக்கவும்.',
  'trade-sync.source.tradovate.description':
    'மேகக்கணியில் Tradovate டிரேட்களை ஒத்திசைத்து, இந்த vault இல் அவற்றைத் திட்டமிடுங்கள்.',
  'trade-sync.tradovate.status-failed': 'Tradovate நிலையை ஏற்ற முடியவில்லை.',
  'trade-sync.tradovate.last-sync': 'கடைசி ஒத்திசைவு',
  'trade-sync.tradovate.last-projection': 'கடைசித் திட்டம்',
  'trade-sync.tradovate.pending-projections':
    '{count} நிலுவையிலுள்ள கணிப்பு(கள்)',
  'trade-sync.tradovate.pending-acks':
    '{count} உள்ளூர் ACK(கள்) நிலுவையில் உள்ளது',
  'trade-sync.tradovate.never': 'ஒருபோதும் இல்லை',

  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'மேகக்கணியில் Rithmic டிரேட்களை ஒத்திசைத்து, இந்த vault இல் அவற்றைத் திட்டமிடுங்கள்.',
  'trade-sync.rithmic.plugin-sync-description':
    'Journalit.co இல் Rithmic ஐ இணைத்து, பின்னர் இங்கே ஒத்திசைத்து உங்கள் சமீபத்திய Rithmic செயல்பாட்டை இந்த vault இல் எழுதுங்கள்.',
  'trade-sync.rithmic.status-failed': 'Rithmic நிலையை ஏற்ற முடியவில்லை.',
  'trade-sync.rithmic.status.connecting': 'இணைக்கிறது',
  'trade-sync.rithmic.status.paused': 'இடைநிறுத்தப்பட்டது',
  'trade-sync.rithmic.status.waiting-for-accounts':
    'கணக்குகளுக்காக காத்திருக்கிறது',
  'trade-sync.rithmic.status.reauthorization-required':
    'Journalit.co இல் மீண்டும் அங்கீகாரம் தேவை',
  'trade-sync.rithmic.status.error': 'இணைப்பு பிழை',
  'trade-sync.rithmic.no-connections':
    'இங்கே ஒத்திசைக்க Journalit.co இல் ஒரு Rithmic கணக்கை இணைக்கவும்.',
  'trade-sync.rithmic.connect': 'இணைக்கவும்',
  'trade-sync.rithmic.manage': 'Journalit.co இல் நிர்வகிக்கவும்',
  'trade-sync.rithmic.system': 'Rithmic அமைப்பு',
  'trade-sync.rithmic.accounts': 'கணக்குகள்',
  'trade-sync.rithmic.last-sync': 'கடைசி ஒத்திசைவு',
  'trade-sync.rithmic.never': 'ஒருபோதும் இல்லை',
  'trade-sync.rithmic.job.running': 'ஒத்திசைவு நடைபெறுகிறது…',
  'trade-sync.rithmic.job.last': 'கடைசி பணி: {status}',
  'trade-sync.job.status.queued': 'வரிசையில்',
  'trade-sync.job.status.running': 'இயங்குகிறது',
  'trade-sync.job.status.succeeded': 'வெற்றி',
  'trade-sync.job.status.partial': 'பகுதி',
  'trade-sync.job.status.failed': 'தோல்வி',
  'trade-sync.job.status.cancelled': 'ரத்து',
  'trade-sync.job.status.unknown': 'தெரியாதது',
  'trade-sync.rithmic.sync-to-vault': 'ஒத்திசை',
  'trade-sync.rithmic.syncing': 'ஒத்திசைக்கிறது…',
  'trade-sync.rithmic.mapping-required':
    'ஒத்திசைக்கப்படும் ஒவ்வொரு Rithmic கணக்கிற்கும் ஒரு உள்ளூர் vault கணக்கைத் தேர்ந்தெடுக்கவும்.',
  'trade-sync.rithmic.sync-complete-connection':
    '{connection} ஒத்திசைவு முடிந்தது.',
  'trade-sync.rithmic.sync-partial-connection':
    '{connection} ஒத்திசைவு முடிந்தது, ஆனால் சிக்கல்கள் உள்ளன.',
  'trade-sync.rithmic.sync-all': 'அனைத்தையும் ஒத்திசைக்கவும்',
  'trade-sync.rithmic.sync-all-complete':
    '{total} Rithmic இணைப்புகளின் {succeeded} ஒத்திசைக்கப்பட்டது.',
  'trade-sync.rithmic.sync-all-partial':
    '{total} Rithmic இணைப்புகளின் {succeeded} ஒத்திசைக்கப்பட்டது. சிக்கல்களுடன் தொடர்புகளை மதிப்பாய்வு செய்யவும்.',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic ஒரே ஒரு செயலில் உள்ள அமர்வை மட்டுமே அனுமதிக்கிறது. இந்த Rithmic உள்நுழைவைப் பயன்படுத்தும் R|Trader, NinjaTrader அல்லது பிற தளங்களை மூடவும்.',
  'trade-sync.rithmic.error.auto-retry':
    'Journalit தானாக மீண்டும் முயற்சிக்கும்.',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic சேமிக்கப்பட்ட சான்றுகளை நிராகரித்தது. அவற்றை Journalit.co இல் புதுப்பித்து மீண்டும் முயற்சிக்கவும்.',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic க்கு R|Trader இல் சந்தைத் தர ஒப்பந்தங்களில் கையொப்பம் தேவை. கையொப்பமிட்ட பின் மீண்டும் முயற்சிக்கவும்.',
  'trade-sync.rithmic.error.disabled':
    'இந்த இணைப்பிற்கு Rithmic ஒத்திசைவு முடக்கப்பட்டுள்ளது. அதை Journalit.co இல் நிர்வகிக்கவும்.',
  'trade-sync.rithmic.error.sync-failed':
    'Rithmic ஒத்திசைவு தோல்வியடைந்தது. Journalit.co இல் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'trade-sync.broker.mapping-unsaved-hint':
    'ஒத்திசைக்கும்போது இணைப்பு சேமிக்கப்படும்.',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'சேமிக்கப்படாத கணக்கு மாற்றங்கள். அவற்றைச் சேமிக்க அந்த இணைப்பை ஒத்திசைக்கவும்.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    'ஒத்திசைக்கும் ஒவ்வொரு கணக்குக்கும் முதலில் ஒரு Journalit கணக்கைத் தேர்வுசெய்யவும்.',
  'trade-sync.broker.sync-all-blocked.running-job':
    'ஒரு ஒத்திசைவு ஏற்கனவே இயங்குகிறது.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'எந்த இணைப்பும் ஒத்திசைக்கத் தயாராக இல்லை.',
  'trade-sync.rithmic.connect-another': 'மற்றொரு Rithmic கணக்கை இணைக்கவும்',
  'trade-sync.rithmic.error.sync-failed-detail':
    'Rithmic ஒத்திசைவு தோல்வியடைந்தது: {message}',
  'trade-sync.import.card.connection': 'இணைப்பு',
  'trade-sync.import.card.backup': 'காப்புப்பிரதியை இறக்குமதி செய்யவும்',
  'trade-sync.import.card.restorable': 'மீட்டெடுக்கக்கூடிய டிரேட்',
  'trade-sync.import.card.import': 'Trade Import',

  'trade-sync.import.card.open-importer-desc':
    'புதிய தரகர் கோப்புகளை அங்கு இறக்குமதி செய்யவும்',
  'trade-sync.import.card.inventory-summary':
    '{accounts} கணக்கு(கள்) · {trades} டிரேட்(கள்)',
  'trade-sync.import.action.check': 'சரிபார்க்கவும்',

  'trade-sync.import.action.open-import': 'திற Trade Import',

  'trade-sync.import.action.create-local-account': 'கணக்கை உருவாக்கவும்',
  'trade-sync.import.action.create-local-account-title':
    'பின்தள கணக்கு பெயரைப் பயன்படுத்தி Journalit கணக்கை உருவாக்கவும்.',
  'trade-sync.import.action.save-mapping': 'சேமி',
  'trade-sync.import.action.save-mapping-title':
    'இந்த பின்தள கணக்கை உள்ளூர் கணக்கு மேப்பிங்கில் சேமிக்கவும்.',

  'trade-sync.import.action.restore-account': 'மீட்டமை',
  'trade-sync.import.action.restore-account-title':
    'இந்த பின்தளத்தில் கணக்கிற்கான விடுபட்ட உள்ளூர் டிரேட் குறிப்புகளை மீட்டெடுக்கவும்.',
  'trade-sync.import.action.restoring': 'மீட்டெடுக்கிறது…',

  'trade-sync.import.pending-acks': '{count} நிலுவையில் உள்ள ACK(கள்)',

  'trade-sync.import.empty-accounts':
    'காப்புப் பிரதி எடுக்கப்பட்ட Trade Import கணக்குகள் எதுவும் இதுவரை கண்டறியப்படவில்லை.',
  'trade-sync.import.account.restorable-count': '{count} மீட்டெடுக்கக்கூடியது',
  'trade-sync.import.account.synced-count': '{count} ஒத்திசைக்கப்பட்டது',
  'trade-sync.import.account.missing-count': '{count} காணவில்லை',
  'trade-sync.import.account.issue-count': '{count} வெளியீடு(கள்)',
  'notice.error.canonical-trade-type-change':
    'தரகர் ஒத்திசைக்கப்பட்ட டிரேட்களை வேறு டிரேட் வகைக்கு மாற்ற முடியாது.',
  'trade-sync.import.account.conflict-repair':
    'போலியான டிரேட் ஐடி குறிப்புகள் கண்டுபிடிக்கப்பட்டன. ஒரு குறிப்பை வைத்து, பின்னர் நகல் குறிப்பிலிருந்து canonicalTradeId ஐ நீக்கவும் அல்லது அந்த நகல் குறிப்பை அகற்றவும். கோப்பை மறுபெயரிடுவது மோதலை சரிசெய்யாது.',
  'trade-sync.import.account.local-account': 'Journalit கணக்கு',
  'trade-sync.import.account.mapping-hint':
    'மீட்டெடுக்கப்பட்ட டிரேட்கள் இந்த Journalit கணக்கில் எழுதப்படும்.',
  'trade-sync.import.notice.restored':
    '{count} இறக்குமதி செய்யப்பட்ட டிரேட்(கள்) மீட்டமைக்கப்பட்டது.',

  'trade-sync.import.notice.sync-cloud-failed':
    'கிளவுட் ஒத்திசைவைத் தொடங்க முடியவில்லை.',
  'trade-sync.import.notice.load-failed':
    'Trade Import ஒத்திசைவு நிலையை ஏற்ற முடியவில்லை.',
  'trade-sync.import.notice.mapping-failed':
    'Trade Import கணக்கு மேப்பிங்கைச் சேமிக்க முடியவில்லை.',
  'trade-sync.import.notice.create-account-failed':
    'உள்ளூர் கணக்கை உருவாக்க முடியவில்லை.',
  'trade-sync.import.notice.restore-failed':
    'Trade Import கணக்கை மீட்டெடுக்க முடியவில்லை.',
  'trade-sync.rate-limit.action.mapping': 'கணக்கு இணைப்பு',
  'trade-sync.import.notice.rate-limited':
    '{action}: பல கோரிக்கைகள். {seconds} வினாடியில் மீண்டும் முயலவும்.',
  'command.open-session-mode': 'அமர்வு பயன்முறையைத் திறக்கவும்',
  'view.session-mode': 'அமர்வு முறை',

  'session-mode.loading': 'அமர்வு பயன்முறையை ஏற்றுகிறது',

  'session-mode.section.timeline': 'காலவரிசை',
  'session-mode.title.preparation': 'அமர்வு தயாரிப்பு',
  'session-mode.title.live': 'நேரடி அமர்வு',
  'session-mode.title.break': 'அமர்வு இடைவேளை',
  'session-mode.title.ended': 'அமர்வு முடிந்தது',

  'session-mode.prep.resources': 'வளங்கள்',

  'session-mode.action.open-drc-for-date': '{date}க்கு DRCஐத் திறக்கவும்',
  'session-mode.ended.helper':
    'உங்கள் டிரேடை பதிவு செய்யவும் அல்லது நாளை மதிப்பாய்வு செய்யவும்.',
  'session-mode.ended.action.import-trades': 'இறக்குமதி டிரேட்',
  'session-mode.ended.action.add-trade-manually':
    'கைமுறையாக டிரேடைச் சேர்க்கவும்',
  'session-mode.ended.action.open-drc': 'திற DRC',
  'session-log.session-group.unplanned': 'திட்டமிடப்படாதது @ {time}',
  'session-mode.unplanned.name': 'திட்டமிடப்படாத அமர்வு',
  'session-mode.unplanned.start': 'திட்டமிடப்படாத அமர்வைத் தொடங்கு',
  'session-mode.unplanned.stop': 'அமர்வை நிறுத்து',
  'session-mode.unplanned.badge': 'திட்டமிடப்படாதது',
  'session-mode.unplanned.status.live':
    '{time} இல் தொடங்கியது · {elapsed} கடந்தது',
  'session-mode.unplanned.ended.summary':
    'திட்டமிடப்படாத அமர்வு · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'திட்டமிடப்படாத அமர்வைத் தொடங்கவும்',
  'session-mode.unplanned.modal.description':
    'நீங்கள் திட்டமிட்ட அமர்வு நேரங்களுக்கு வெளியே உள்ளீர்கள். இந்த அமர்வு உங்கள் தினசரி மதிப்பாய்வில் திட்டமிடப்படாததாகக் குறிக்கப்படும். இப்போது ஏன் வர்த்தகம் செய்கிறீர்கள் என்பதை எழுதுங்கள்.',
  'session-mode.unplanned.modal.reason-label': 'காரணம்',
  'session-mode.unplanned.modal.reason-placeholder':
    'எ.கா. 14:00 இல் FOMC, காலை அமர்வைத் தவறவிட்டேன்',
  'session-mode.unplanned.modal.reason-required':
    'தொடங்குவதற்கு முன் ஒரு காரணத்தை உள்ளிடவும்.',
  'session-mode.unplanned.notice.started': 'திட்டமிடப்படாத அமர்வு தொடங்கியது.',
  'session-mode.unplanned.notice.stopped':
    'திட்டமிடப்படாத அமர்வு நிறுத்தப்பட்டது.',
  'session-mode.unplanned.notice.blocked-live':
    'ஏற்கனவே ஒரு அமர்வு நடந்து கொண்டிருக்கிறது.',
  'session-mode.unplanned.notice.none-running':
    'திட்டமிடப்படாத அமர்வு எதுவும் நடக்கவில்லை.',
  'session-mode.unplanned.notice.failed':
    'திட்டமிடப்படாத அமர்வைப் புதுப்பிக்க முடியவில்லை. விவரங்களுக்கு கன்சோலைப் பார்க்கவும்.',
  'session-mode.ended.stat.trades': 'டிரேட்கள்',
  'session-mode.ended.stat.notes': 'குறிப்புகள்',
  'session-mode.ended.stat.gate-checks': 'கேட் சரிபார்க்கிறது',
  'session-mode.waiting.next-session': 'அடுத்த அமர்வு',
  'session-mode.waiting.starts-at': '{session} {time} இல் தொடங்குகிறது',
  'session-mode.waiting.preparation-opens-in':
    'தயாரிப்பு {remaining} இல் திறக்கப்படும்',
  'session-mode.waiting.open-drc': 'திற DRC',

  'session-mode.break.reset-before': '{session} க்கு முன் மீட்டமை',
  'session-mode.break.reset': 'அடுத்த அமர்வுக்கு முன் மீட்டமைக்கவும்',
  'session-mode.break.next-session-meta':
    'அடுத்த அமர்வு {time} · {remaining} இல் தொடங்கும் மீதமுள்ளது',
  'session-mode.break.description':
    'அடுத்த அமர்வுக்கு முன் விலகி, நீரேற்றம் செய்து, உங்கள் மனதை தெளிவுபடுத்துங்கள்.',
  'session-mode.break.open-drc': 'திற DRC',
  'session-mode.countdown.starts-in': 'இல் தொடங்குகிறது',
  'session-mode.countdown.starts-at': '{session} {time} இல் தொடங்குகிறது',
  'session-mode.countdown.hours': 'மணி',
  'session-mode.countdown.minutes': 'நிமிடம்',
  'session-mode.countdown.seconds': 'நொடி',
  'session-mode.phase.preparation': 'தயாரிப்பு',
  'session-mode.phase.live': 'லைவ்',
  'session-mode.phase.waiting': 'காத்திருக்கிறது',
  'session-mode.phase.break': 'இடைவேளை',
  'session-mode.phase.ended': 'முடிந்தது',
  'session-mode.phase.unconfigured': 'அமர்வு அட்டவணை கட்டமைக்கப்படவில்லை',
  'session-mode.status.preparation':
    '{session} {time} இல் தொடங்குகிறது. நீங்கள் தயார் செய்ய {remaining} உள்ளது.',
  'session-mode.status.preparation-generic':
    'அடுத்த நேரடி டிரேட் அமர்வுக்கு தயாராகுங்கள்.',
  'session-mode.status.waiting':
    '{session} {time} இல் தொடங்குகிறது. தயாரிப்பு {remaining} இல் தொடங்குகிறது.',
  'session-mode.status.waiting-generic':
    'உங்கள் அடுத்த அமர்வு திட்டமிடப்பட்டுள்ளது, ஆனால் தயாரிப்பு இன்னும் தொடங்கப்படவில்லை.',
  'session-mode.status.live': 'இந்த அமர்வில் {remaining} மீதமுள்ளது.',
  'session-mode.status.live-generic': 'உங்கள் டிரேட் அமர்வு நேரலையில் உள்ளது.',
  'session-mode.status.break':
    '{session} {time} இல் தொடங்குகிறது. நீங்கள் {remaining}க்கு இடைவேளையில் உள்ளீர்கள்.',
  'session-mode.status.break-generic':
    'நீங்கள் டிரேட் அமர்வுகளுக்கு இடையில் இருக்கிறீர்கள்.',
  'session-mode.status.ended':
    'உங்கள் கட்டமைக்கப்பட்ட டிரேட் அமர்வுகள் இப்போதைக்கு முடிந்தது.',
  'session-mode.status.unconfigured':
    'தயாரிப்பு, நேரலை, இடைவேளை மற்றும் முடிந்த கட்டங்களைத் திறக்க அமர்வு சாளரங்களை உள்ளமைக்கவும். இன்றைய DRCக்கான காலவரிசை இன்னும் உள்ளது.',

  'session-mode.unconfigured.title': 'அமர்வு பயன்முறையை அமைக்கவும்',
  'session-mode.unconfigured.description':
    'தொடங்குவதற்கு உங்கள் அமர்வு நேரங்களைச் சேர்க்கவும்.',
  'session-mode.unconfigured.step.window.title':
    'அமர்வு சாளரத்தைச் சேர்க்கவும்',

  'session-mode.unconfigured.step.prep.title':
    'தயாரிப்பு நேரத்தை மதிப்பாய்வு செய்யவும்',

  'session-mode.unconfigured.step.gate.title':
    'ஸ்டார்டர் டிரேட் கேட் பயன்படுத்தவும்',

  'session-mode.unconfigured.step.log.title':
    'நேரலை அமர்வுகளின் போது குறிப்புகளை பதிவு செய்யவும்',

  'session-mode.unconfigured.action': 'அமர்வு பயன்முறையை உள்ளமைக்கவும்',
  'session-mode.guide.why.title':
    'மனநிலையால் அல்ல, திட்டப்படி வர்த்தகம் செய்யுங்கள்',
  'session-mode.guide.why.description':
    'அமர்வு முறை ஒவ்வொரு அமர்வுக்கு முன்பும் உங்களைத் தயார்படுத்துகிறது, நேரடியில் Trade Gate மூலம் விதிகளில் நிலைநிறுத்துகிறது, நாளை மீண்டும் பார்க்க நேர முத்திரையுள்ள பதிவை வைத்திருக்கிறது. அமைக்க இரண்டு நிமிடங்களே.',
  'session-mode.guide.configure.title': 'இப்போதே அமைக்கவும்',
  'session-mode.guide.configure.description':
    'உங்கள் அமர்வு நேரங்களைச் சேர்த்து முதல் Trade Gate ஐ உருவாக்குங்கள். அமைப்புகளில் ஒரு சிறிய வழிகாட்டி உதவும்.',
  'session-mode.guide.preparation.countdown.title':
    'உங்கள் அமர்வு நெருங்குகிறது',
  'session-mode.guide.preparation.countdown.description':
    'இது தயாரிப்புக் கட்டம். கவுண்ட்டவுன் எப்போது நேரடிக்குச் செல்வீர்கள் என்பதைக் காட்டுகிறது; இந்தப் பக்கம் தானாக நேரடி முறைக்கு மாறும்.',
  'session-mode.guide.preparation.goals.title': 'இன்றைய இலக்குகளை அமைக்கவும்',
  'session-mode.guide.preparation.goals.description':
    'சந்தை திறக்கும் முன் நல்ல அமர்வு எப்படி இருக்கும் என எழுதுங்கள்; உங்களைப் பிடித்துக்கொள்ள ஏதாவது இருக்கும்.',
  'session-mode.guide.preparation.checklist.title':
    'சரிபார்ப்புப் பட்டியலை முடிக்கவும்',
  'session-mode.guide.preparation.checklist.description':
    'அமர்வுக்கு முந்தைய வழக்கத்தை இங்கே குறிக்கவும். குறித்த அனைத்தும் இன்றைய மதிப்பாய்வுக் குறிப்பில் சேமிக்கப்படும்.',
  'session-mode.guide.preparation.next.title': 'நேரடிக்குச் செல்லும்போது',
  'session-mode.guide.preparation.next.description':
    'உங்கள் Trade Gate மற்றும் அமர்வு பதிவு இங்கே தோன்றும். முதல் முறை நாங்கள் காட்டுவோம்.',
  'session-mode.guide.live.trade-gate.title':
    'ஒவ்வொரு வர்த்தகத்திற்கு முன்பும் Trade Gate ஐ இயக்குங்கள்',
  'session-mode.guide.live.trade-gate.description':
    'தொடங்கு அழுத்தி உங்கள் அளவுகோல்களிலிருந்து உருவான கேள்விகளுக்கு பதிலளியுங்கள். கேட் பச்சை விளக்கு, காத்திரு, அல்லது வர்த்தகம் வேண்டாம் என முடியும்; உங்கள் அமைப்பு அனுமதிக்கும் வர்த்தகங்களை மட்டுமே எடுப்பீர்கள்.',
  'session-mode.guide.live.session-log.title':
    'பார்ப்பதையும் உணர்வதையும் பதிவு செய்யுங்கள்',
  'session-mode.guide.live.session-log.description':
    'செட்அப்கள், உணர்வுகள், முடிவுகளை நடக்கும்போதே குறியுங்கள். ஒவ்வொரு குறிப்புக்கும் நேர முத்திரை உண்டு; பின்னர் என்ன நடந்தது என்பதைத் துல்லியமாக மீண்டும் பார்க்கலாம்.',
  'session-mode.guide.live.settings.title':
    'எப்போது வேண்டுமானாலும் சரிசெய்யலாம்',
  'session-mode.guide.live.settings.description':
    'திருத்து அமர்வு முறை அமைப்புகளைத் திறக்கிறது: அமர்வு நேரங்கள், கட்ட தளவமைப்பு, Trade Gate பணிப்பாய்வுகள், பதிவு குறிச்சொற்கள்.',
  'session-mode.guide.ended.review.title':
    'இப்போது அமர்வை மதிப்பாய்வு செய்யுங்கள்',
  'session-mode.guide.ended.review.description':
    'மதிப்பாய்வுக்கு இன்றைய DRC ஐத் திறங்கள். உங்கள் DRC தளவமைப்பில் அமர்வு பதிவு விட்ஜெட்டைச் சேர்த்தால், நேர முத்திரையுள்ள ஒவ்வொரு குறிப்பும் அங்கே தோன்றும்.',
  'settings.session-mode.guide.setting-name': 'வழிகாட்டி',
  'settings.session-mode.guide.setting-desc':
    'அமர்வு நேரங்களிலிருந்து உங்கள் முதல் Trade Gate வரை, இந்த அமைப்புகளின் சிறிய சுற்றுப்பயணம்.',
  'settings.session-mode.guide.replay': 'வழிகாட்டியைக் காட்டு',
  'settings.session-mode.guide.intro.title': 'அமர்வு முறையை அமைப்போம்',
  'settings.session-mode.guide.intro.description':
    'நான்கு விஷயங்கள்: அமர்வுகள் எப்போது, ஒவ்வொரு கட்டமும் என்ன காட்டும், உங்கள் Trade Gate, அமர்வு பதிவு குறிச்சொற்கள்.',
  'settings.session-mode.guide.lead-time.title': 'தயாரிப்பு முன்னோடி நேரம்',
  'settings.session-mode.guide.lead-time.description':
    'அமர்வுக்கு எத்தனை நிமிடங்களுக்கு முன் தயாரிப்புக் கட்டம் திறக்கும்.',
  'settings.session-mode.guide.windows.title':
    'உங்கள் அமர்வு சாளரங்களைச் சேர்க்கவும்',
  'settings.session-mode.guide.windows.description':
    'நீங்கள் வர்த்தகம் செய்யும் ஒவ்வொரு அமர்வுக்கும் ஒரு சாளரம்: பெயர், தொடக்கம், முடிவு. எப்போது தயாராக வேண்டும், எப்போது நேரடி என்பதை இவற்றிலிருந்து அமர்வு முறை அறிகிறது.',
  'settings.session-mode.guide.layout.title':
    'ஒவ்வொரு கட்டமும் என்ன காட்ட வேண்டும் எனத் தேர்வு செய்யுங்கள்',
  'settings.session-mode.guide.layout.description':
    'கட்டவாரியாக தொகுதிகளை இயக்கவும் அணைக்கவும்: தயாரிப்புக்கு வளங்கள், இலக்குகள், சரிபார்ப்புப் பட்டியல்; நேரடியில் Trade Gate மற்றும் அமர்வு காலவரிசை.',
  'settings.session-mode.guide.trade-gate.title':
    'உங்கள் Trade Gate ஐ உருவாக்குங்கள்',
  'settings.session-mode.guide.trade-gate.description':
    'முதல் முறை சேர் பொதுவான கேள்விகளிலிருந்து தொடக்கப் பணிப்பாய்வை உருவாக்கும்; பின்னர் வெற்றுப் பணிப்பாய்வை. நூலகத்தில் தயாரான கேள்விகள் உள்ளன. ஒவ்வொரு கேள்வியும் அடுத்த கேள்விக்கோ ஒரு முடிவுக்கோ செல்லும்: பச்சை விளக்கு, காத்திரு, அல்லது வர்த்தகம் வேண்டாம்.',
  'settings.session-mode.guide.editor.title': 'கேள்விகளும் முடிவுகளும்',
  'settings.session-mode.guide.editor.description':
    'கேள்விகளைச் சேர்க்கவும் ஒவ்வொரு பதிலும் எங்கே செல்லும் என அமைக்கவும் பணிப்பாய்வை விரிக்கவும். இயக்கு பொத்தான் அமர்வில் காண்பது போலவே இயக்கும்.',
  'settings.session-mode.guide.tags.title': 'அமர்வு பதிவுக்கான குறிச்சொற்கள்',
  'settings.session-mode.guide.tags.description':
    'பதிவு செய்யும்போதே குறிப்புகளுக்கு குறிச்சொற்கள் இடுங்கள் — உணர்வு அல்லது செட்அப் போல — மதிப்பாய்வில் வடிகட்ட.',
  'settings.session-mode.guide.finish.title': 'தயார்',
  'settings.session-mode.guide.finish.description':
    'ரிப்பனிலிருந்தோ முகப்பிலிருந்தோ அமர்வு முறையைத் திறங்கள். ஒவ்வொரு மதிப்பாய்விலும் குறிப்புகளைக் காண DRC தளவமைப்பில் அமர்வு பதிவு விட்ஜெட்டைச் சேர்க்கவும்.',

  'session-mode.layout.empty.title':
    'இந்த கட்டத்திற்கு எதுவும் இயக்கப்படவில்லை',
  'session-mode.layout.empty.description':
    'இந்த அமர்வு பயன்முறை கட்டத்தை உருவாக்க தொகுதிகளை மீண்டும் இயக்கவும்.',
  'session-mode.duration.minutes': '{minutes}m',
  'session-mode.duration.hours': '{hours}h',
  'session-mode.duration.hours-minutes': '{hours}h {minutes}m',
  'settings.session-mode.title': 'அமர்வு முறை',
  'settings.session-mode.description':
    'அமர்வு சாளரங்கள், தயாரிப்பு, கட்ட தளவமைப்பு, டிரேட் வாயில் பணிப்பாய்வு மற்றும் அமர்வு பதிவு குறிச்சொற்களை உள்ளமைக்கவும்.',
  'settings.session-mode.preparation-lead-time': 'தயாராகும் நேரம் (நிமிடங்கள்)',
  'settings.session-mode.preparation-lead-time-desc':
    'ஒரு அமர்வுக்கு முன் எப்படி ஆரம்ப தயாரிப்பு முறை தொடங்குகிறது.',
  'settings.session-mode.windows': 'அமர்வு ஜன்னல்கள்',

  'settings.session-mode.add-window-short': 'சேர்',
  'settings.session-mode.no-windows':
    'அமர்வு சாளரங்கள் எதுவும் இன்னும் கட்டமைக்கப்படவில்லை. லைவ் டைம்லைன் இன்னும் வேலை செய்கிறது, ஆனால் ஒரு சாளரத்தைச் சேர்த்த பிறகு, கட்ட-விழிப்புணர்வு தயாரிப்பு தொடங்குகிறது.',
  'settings.session-mode.layout.title': 'கட்ட அமைப்பு',

  'settings.session-mode.layout.phase-desc.preparation':
    'டிரேட் தொடங்கும் முன் அமர்வுக்கு முந்தைய தயாரிப்பின் போது என்ன தோன்றும் என்பதைத் தேர்ந்தெடுக்கவும்.',
  'settings.session-mode.layout.phase-desc.live':
    'கட்டமைக்கப்பட்ட டிரேட் அமர்வு நேரலையில் இருக்கும்போது என்ன தோன்றும் என்பதைத் தேர்ந்தெடுக்கவும்.',

  'settings.session-mode.layout.phase-desc.ended':
    'அனைத்து உள்ளமைக்கப்பட்ட டிரேட் அமர்வுகள் முடிந்த பிறகு என்ன தோன்றும் என்பதைத் தேர்ந்தெடுக்கவும்.',
  'settings.session-mode.layout.reset-phase': 'மீட்டமை',

  'settings.session-mode.layout.module.preparation-resources': 'வளங்கள்',
  'settings.session-mode.layout.module.preparation-resources-desc':
    'இணைக்கப்பட்ட தயாரிப்பு குறிப்புகள் மற்றும் விளையாட்டு புத்தகங்களைக் காட்டுகிறது.',
  'settings.session-mode.layout.module.preparation-goals': 'இலக்குகள்',
  'settings.session-mode.layout.module.preparation-goals-desc':
    'அமர்வுக்கு முந்தைய கவனத்திற்கான DRC இலக்குகள் விட்ஜெட்டைக் காட்டுகிறது.',
  'settings.session-mode.layout.module.preparation-checklist':
    'சரிபார்ப்பு பட்டியல்',
  'settings.session-mode.layout.module.preparation-checklist-desc':
    'அமர்வுக்கு முந்தைய தயாரிப்புக்கான DRC சரிபார்ப்பு பட்டியல் விட்ஜெட்டைக் காட்டுகிறது.',
  'settings.session-mode.layout.module.trade-gate': 'டிரேட் வாயில்',
  'settings.session-mode.layout.module.trade-gate-desc':
    'நேரலை அமர்வின் போது உங்கள் கட்டமைக்கப்பட்ட IF/THEN வாயிலை இயக்கும்.',
  'settings.session-mode.layout.module.timeline': 'அமர்வு காலவரிசை',
  'settings.session-mode.layout.module.timeline-desc':
    'நடப்பு அமர்வு குறிப்புகள் மற்றும் டிரேட் காலவரிசை உள்ளீடுகளைக் காட்டுகிறது.',

  'settings.session-mode.layout.module.ended-actions':
    'அமர்வின் இறுதி நடவடிக்கைகள்',
  'settings.session-mode.layout.module.ended-actions-desc':
    'அமர்வுகள் முடிந்த பிறகு இறக்குமதி, கைமுறை டிரேட் மற்றும் DRC செயல்களைக் காட்டுகிறது.',
  'settings.session-mode.layout.module.ended-stats': 'அமர்வு புள்ளிவிவரங்கள்',
  'settings.session-mode.layout.module.ended-stats-desc':
    'அன்றைய டிரேட், குறிப்பு மற்றும் கேட்-செக் மொத்தங்களைக் காட்டுகிறது.',
  'settings.session-mode.linked-resources': 'இணைக்கப்பட்ட ஆதாரங்கள்',
  'settings.session-mode.linked-resources-desc':
    'தயாரிப்பின் போது விரைவான குறிப்பு இணைப்புகளைக் காட்டு.',
  'settings.session-mode.linked-resources-count': '{count} இணைக்கப்பட்டது',
  'settings.session-mode.linked-resources-hide': 'இணைக்கப்பட்டதை மறை',
  'settings.session-mode.session-log': 'அமர்வு பதிவு',
  'settings.session-mode.session-log-desc':
    'உங்கள் அமர்வுக் குறிப்புகளுடன் எந்த தானியங்கு நிகழ்வுகள் தோன்றும் என்பதைத் தேர்வுசெய்யவும்.',
  'settings.session-mode.show-trade-executions':
    'டிரேட் உள்ளீடுகள் மற்றும் வெளியேறுதல்',
  'settings.session-mode.show-trade-executions-desc':
    'அமர்வு பயன்முறை மற்றும் தினசரி மதிப்பாய்வு பதிவுகளில் டிரேட் உள்ளீடுகள் மற்றும் வெளியேறுதல்களைக் காண்பி.',
  'settings.session-mode.session-log-tags': 'அமர்வு பதிவு குறிச்சொற்கள்',
  'settings.session-mode.session-log-tags-desc':
    'அமர்வு பயன்முறை எழுத்துப் பகுதி மற்றும் DRC அமர்வு பதிவில் கிடைக்கும் குறிச்சொற்களைத் தனிப்பயனாக்கவும்.',
  'settings.session-mode.tag-label-placeholder': 'குறிச்சொல் பெயர்',
  'settings.session-mode.tag-short-label-placeholder': 'லேபிள்',
  'settings.session-mode.tag-label-example': 'டிரேட்',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'குறிச்சொல் நிறம்',
  'settings.session-mode.tag-requires-resolution': 'வகைப்பாடு தேவை',
  'settings.session-mode.tag-lesson': 'பாடம் குறிச்சொல்',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'இந்தக் குறிச்சொல்லைக் கொண்ட உள்ளீடுகள் வகைப்படுத்தப்படாத குறிப்புகளாகக் கருதப்படுகின்றன. அமர்வின் போது சரியான குறிச்சொல் தெளிவாக இல்லாதபோது அதைப் பயன்படுத்தவும்; நுழைவை பின்னர் வகைப்படுத்தவும்.',
  'settings.session-mode.tag-lesson-tooltip':
    'இந்தக் குறிச்சொல்லை ஒரு கற்றல் நுழைவாகக் குறிக்கும். பாடம்-குறியிடப்பட்ட குறிப்புகள் அமர்வு பதிவில் இருக்கும் மற்றும் பாடம் வடிப்பான்கள் மற்றும் மதிப்பாய்வு சுருக்கங்கள் மூலம் வெளிவரலாம்.',
  'settings.session-mode.add-session-log-tag':
    'அமர்வு பதிவு குறிச்சொல்லைச் சேர்க்கவும்',
  'settings.session-mode.reset-session-log-tags': 'மீட்டமை',
  'settings.session-mode.tag-color.blue': 'நீலம்',
  'settings.session-mode.tag-color.indigo': 'இண்டிகோ',
  'settings.session-mode.tag-color.purple': 'ஊதா',
  'settings.session-mode.tag-color.green': 'பச்சை',
  'settings.session-mode.tag-color.pink': 'இளஞ்சிவப்பு',
  'settings.session-mode.tag-color.amber': 'அம்பர்',
  'settings.session-mode.tag-color.red': 'சிவப்பு',
  'settings.session-mode.tag-color.orange': 'ஆரஞ்சு',
  'settings.session-mode.search-resource-placeholder':
    'இணைக்க vault கோப்புகளைத் தேடவும்…',

  'settings.session-mode.window-name': 'அமர்வு பெயர்',
  'settings.session-mode.window-name-placeholder': 'எ.கா. NY AM',

  'settings.session-mode.start-time': 'தொடக்க நேரம்',
  'settings.session-mode.end-time': 'முடிவு நேரம்',
  'widget.session-log.name': 'அமர்வு பதிவு',
  'widget.session-log.description':
    'நேரமுத்திரையிடப்பட்ட Execution குறிப்புகள் மற்றும் டிரேட் நிகழ்வுகளைப் பதிவு செய்யவும்.',
  'session-log.title': 'அமர்வு முறை பதிவு',
  'session-log.description':
    'தற்போதைய டிரேட் அமர்வின் போது என்ன நடந்தது என்பதைப் பதிவு செய்யவும்.',
  'session-log.notice.invalid-timestamp':
    'சரியான அமர்வு பதிவு நேர முத்திரையை உள்ளிடவும்.',
  'session-log.action.auto-time': 'தானியங்கு நேரம்',
  'session-log.action.set-time': 'நேரத்தை அமைக்கவும்',

  'session-log.composer.tag-label': 'அமர்வு பதிவு குறிச்சொல்',
  'session-log.placeholder.entry-short': 'அமர்வு குறிப்பைச் சேர்...',
  'session-log.action.add-entry':
    'நேரமுத்திரையிடப்பட்ட உள்ளீட்டைச் சேர்க்கவும்',
  'session-log.action.add-note': 'சேர்',
  'session-log.action.hide-composer': 'எழுத்துப் பகுதியை மறை',
  'session-log.filter.all': 'அனைத்தும்',
  'session-log.filter.label': 'அமர்வு பதிவை வடிகட்டி',
  'session-log.filter.clear': 'வடிகட்டியை அழிக்கவும்',
  'session-log.timeline.most-recent': 'மிக சமீபத்தியது',
  'session-log.timeline.start': 'அமர்வு ஆரம்பம்',
  'session-log.empty': 'அமர்வு பதிவு உள்ளீடுகள் எதுவும் இதுவரை இல்லை.',
  'session-log.empty-filtered':
    'இந்த வடிப்பானுடன் எந்த உள்ளீடுகளும் பொருந்தவில்லை.',
  'session-log.loading': 'அமர்வு பதிவை ஏற்றுகிறது…',
  'session-log.session-group.outside': 'வெளிப்புற அமர்வுகள்',
  'session-log.lessons.title': 'கற்றுக்கொண்ட பாடங்கள்',

  'session-log.lessons.badge': 'LSN',

  'session-log.trade.entered': 'நுழைந்தது',
  'session-log.trade.exited': 'வெளியேறியது',
  'session-log.trade.size': 'அளவு',

  'session-log.status.unclassified': 'வகைப்படுத்தப்படாத',
  'session-log.action.save': 'சேமி',
  'session-log.action.cancel': 'ரத்து',

  'session-log.action.classify': 'வகைப்படுத்து',
  'session-log.action.edit': 'திருத்து',
  'session-log.action.delete': 'நீக்கு',
  'session-log.action.open-trade': 'டிரேடைத் திற',
  'session-log.preview':
    'அமர்வு பதிவு முன்னோட்டம்: நேரமுத்திரையிடப்பட்ட குறிப்புகள் மற்றும் டிரேட் நிகழ்வுகள் அமர்வு பயன்முறையில் இங்கு தோன்றும்.',
  'session-log.alert.tag-concentration':
    'அமர்வு குறிப்புகளில் {tag} {percentage}% ஆகும் ({count}/{total}). இந்த அமர்வில் மைண்ட்செட் ஒரு முக்கிய கருப்பொருளாக இருந்தது.',

  'trade-gate.workflow': 'பணிப்பாய்வு',

  'trade-gate.action.start-short': 'தொடங்கு',
  'trade-gate.action.start-another': 'இன்னொன்றைத் தொடங்கவும்',
  'trade-gate.outcome.green-light': 'பச்சை விளக்கு',
  'trade-gate.outcome.green-light-description':
    'நிபந்தனைகள் பூர்த்தி செய்யப்பட்டன.',
  'trade-gate.outcome.no-trade': 'டிரேட் இல்லை',
  'trade-gate.outcome.no-trade-description':
    'நிபந்தனைகள் பூர்த்தி செய்யப்படவில்லை.',
  'trade-gate.outcome.wait': 'காத்திருங்கள்',
  'trade-gate.outcome.wait-description':
    'Setup தயாராக இல்லை. அடுத்த வாய்ப்புக்காக காத்திருங்கள்.',
  'settings.session-mode.trade-gate.title': 'டிரேட் வாயில் பணிப்பாய்வு',
  'settings.session-mode.trade-gate.desc':
    'நேரடி நுழைவுச் சரிபார்ப்புகளுக்கு IF/THEN முடிவுப் பாய்வுகளை உருவாக்கவும்.',
  'settings.session-mode.trade-gate.delete-workflow.title':
    'டிரேட் கேட் பணிப்பாய்வுகளை நீக்கவா?',
  'settings.session-mode.trade-gate.delete-workflow.message':
    '“{name}”ஐ நீக்கவா? இது இந்த பணிப்பாய்வுகளில் உள்ள ஒவ்வொரு கேள்வியையும் கிளையையும் நீக்குகிறது. இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.',
  'settings.session-mode.trade-gate.delete-workflow.confirm':
    'பணிப்பாய்வுகளை நீக்கு',
  'settings.session-mode.trade-gate.name': 'பணிப்பாய்வு பெயர்',
  'settings.session-mode.trade-gate.untitled': 'பெயரிடப்படாத பணிப்பாய்வு',
  'settings.session-mode.trade-gate.start-node': 'கேள்வியைத் தொடங்குங்கள்',
  'settings.session-mode.trade-gate.simulation.show': 'உருவகப்படுத்து',
  'settings.session-mode.trade-gate.simulation.unavailable':
    'உருவகப்படுத்துதலைத் தொடங்கும் முன் தொடக்கக் கேள்வியை குறைந்தபட்சம் ஒரு முழுமையான முடிவுடன் இணைக்கவும்.',
  'settings.session-mode.trade-gate.add-question': 'கேள்வியைச் சேர்க்கவும்',
  'settings.session-mode.trade-gate.question': 'கேள்வி',
  'settings.session-mode.trade-gate.new-question-title': 'புதிய கேள்வி',
  'settings.session-mode.trade-gate.edit-question': 'கேள்வியைத் திருத்தவும்',
  'settings.session-mode.trade-gate.question-title': 'கேள்வி தலைப்பு',
  'settings.session-mode.trade-gate.prompt': 'கேள்வி உரை',
  'settings.session-mode.trade-gate.options': 'விருப்பங்கள்',
  'settings.session-mode.trade-gate.option': 'விருப்பம்',
  'settings.session-mode.trade-gate.no-options':
    'இந்தக் கேள்விக்கான பதில் விருப்பங்களைச் சேர்க்கவும்.',
  'settings.session-mode.trade-gate.option-label': 'விருப்பம் லேபிள்',
  'settings.session-mode.trade-gate.option-target': 'வழிவகுக்கிறது',
  'settings.session-mode.trade-gate.not-wired': 'இன்னும் கம்பி போடவில்லை',
  'settings.session-mode.trade-gate.not-wired-hint': 'இணைக்க கிளிக் செய்யவும்',
  'settings.session-mode.trade-gate.target-group-questions': 'கேள்விகள்',
  'settings.session-mode.trade-gate.target-current': 'நடப்பு: {title}',
  'settings.session-mode.trade-gate.target-group-outcomes': 'முடிவுகள்',
  'settings.session-mode.trade-gate.new-question-target': '+ புதிய கேள்வி',
  'settings.session-mode.trade-gate.outcome-note':
    'முடிவு குறிப்பு (இந்த கிளை மட்டும்)',
  'settings.session-mode.trade-gate.remove-from-workflow':
    'இந்த பணிப்பாய்வுகளிலிருந்து அகற்று',
  'settings.session-mode.trade-gate.used-in-workflows':
    '{count} பணிப்பாய்வு(கள்) இல் பயன்படுத்தப்பட்டது',
  'settings.session-mode.trade-gate.not-used': 'இன்னும் பயன்படுத்தப்படவில்லை',
  'settings.session-mode.trade-gate.question-count': '{count} கேள்வி(கள்)',
  'settings.session-mode.trade-gate.library-title': 'கேள்வி நூலகம்',
  'settings.session-mode.trade-gate.library-search': 'கேள்விகளைத் தேடு...',
  'settings.session-mode.trade-gate.library-empty':
    'கேள்விகள் எதுவும் இல்லை. தொடங்குவதற்கு ஒன்றை உருவாக்கவும்.',
  'settings.session-mode.trade-gate.delete-question.title': 'கேள்வியை நீக்கவா?',
  'settings.session-mode.trade-gate.delete-question.message':
    'கேள்வி நூலகத்தில் இருந்து “{name}” ஐ நீக்கவா? இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.',
  'settings.session-mode.trade-gate.delete-question.message-used':
    'கேள்வி நூலகத்தில் இருந்து “{name}” ஐ நீக்கவா? இது இதில் பயன்படுத்தப்படுகிறது: {workflows}. அந்த பணிப்பாய்வுகளில் அதன் கிளைகள் அகற்றப்படும். இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.',
  'settings.session-mode.trade-gate.delete-question.confirm': 'கேள்வியை நீக்கு',
  'settings.session-mode.trade-gate.unplaced-title':
    'இந்த பணிப்பாய்வு, இன்னும் இணைக்கப்படவில்லை',
  'settings.session-mode.trade-gate.flow-map': 'ஓட்ட வரைபடம்',
  'settings.session-mode.trade-gate.flow-fit': 'பொருத்தம்',
  'settings.session-mode.trade-gate.flow-click-hint':
    'அதைத் திருத்த, கார்டு, பாதை லேபிள் அல்லது முடிவைக் கிளிக் செய்யவும்.',
  'settings.session-mode.trade-gate.flow-truncated':
    'இந்த ஓட்டம் முழுமையாகக் காட்ட முடியாத அளவுக்கு அதிகமாக உள்ளது. சில மீண்டும் மீண்டும் கிளைகள் மறைக்கப்பட்டுள்ளன.',
  'settings.session-mode.trade-gate.no-start':
    'ஓட்டத்தைப் பார்க்க, தொடக்கக் கேள்வியைத் தேர்ந்தெடுக்கவும்.',
  'settings.session-mode.trade-gate.no-questions':
    'இந்த பணிப்பாய்வு தொடங்க முதல் கேள்வியைச் சேர்க்கவும்.',
  'filter.modal.image.annotation-status': 'சிறுகுறிப்பு நிலை',
  'filter.modal.image.status.tagged': 'குறியிடப்பட்டது',
  'filter.modal.image.status.untagged': 'குறியிடப்படாதது',
  'filter.modal.image.status.has-notes': 'குறிப்புகள் உள்ளன',
  'filter.modal.image.status.no-notes': 'குறிப்புகள் இல்லை',
  'filter.modal.image.tags': 'மீடியா குறிச்சொற்கள்',
  'setups.view.detail.action.gallery': 'கேலரியைத் திறக்கவும்',
  'tradelog.mode.label': 'டிரேட் பதிவு முறை',
  'tradelog.mode.trades': 'டிரேட்கள்',
  'tradelog.mode.image-gallery': 'காட்சியகம்',

  'imageGallery.empty.error.title': 'கேலரி கிடைக்கவில்லை',
  'imageGallery.empty.no-images.title': 'இன்னும் மீடியா இல்லை',
  'imageGallery.empty.no-images.description':
    'டிரேட் அல்லது மதிப்பாய்வு குறிப்புகளுடன் இணைக்கப்பட்டுள்ள படங்கள், GIFகள், வீடியோக்கள் மற்றும் YouTube இணைப்புகள் இங்கே தானாகவே தோன்றும்.',
  'imageGallery.empty.no-results.title':
    'இந்த வடிப்பான்களுடன் எந்த மீடியாவும் பொருந்தவில்லை',
  'imageGallery.empty.no-results.description':
    'மேலும் கேலரி உருப்படிகளை மீண்டும் பார்வைக்குக் கொண்டுவர, செயலில் உள்ள வடிப்பான்களை அழிக்கவும் அல்லது தேதி வரம்பை விரிவுபடுத்தவும்.',
  'imageGallery.empty.no-source.title': 'இந்த மூலத்தில் எந்த ஊடகமும் இல்லை',
  'imageGallery.empty.no-source.description':
    'இந்த ஆதாரத்தில் இன்னும் கேலரி உருப்படிகள் இல்லை. எல்லா மீடியாவிற்கும் திரும்பவும் அல்லது வேறு மூலத்தைத் தேர்வு செய்யவும்.',
  'imageGallery.empty.action.clear-filters': 'வடிகட்டிகளை அழிக்கவும்',
  'imageGallery.empty.action.show-all': 'எல்லா மீடியாவையும் காட்டு',
  'imageGallery.error.load-failed': 'கேலரியை ஏற்ற முடியவில்லை.',

  'imageGallery.open-source': 'குறிப்பைத் திற',
  'imageGallery.image-alt': '{source} ஊடகம் {date} இலிருந்து',
  'imageGallery.privacy-blurred': 'தனியுரிமைக்காக மங்கலாக்கப்பட்டது',

  'imageGallery.sort.label': 'வரிசைப்படுத்து:',
  'imageGallery.sort.newest': 'புதியது',
  'imageGallery.sort.oldest': 'பழமையானது',
  'imageGallery.sort.best': 'சிறந்த P&L',
  'imageGallery.sort.worst': 'மோசமான P&L',
  'imageGallery.size-aria': 'கேலரி மீடியா அளவு',
  'imageGallery.size.small': 'சிறியது',
  'imageGallery.size.medium': 'நடுத்தர',
  'imageGallery.size.large': 'பெரியது',
  'imageGallery.view-mode-aria': 'கேலரி கார்டு குழுவாக்கம்',
  'imageGallery.view-mode.grouped': 'குழுவாக',
  'imageGallery.view-mode.individual': 'தனித்தனி',
  'imageGallery.group.additional-media': '{count} கூடுதல் மீடியா உருப்படிகள்',
  'imageGallery.group.annotation-summary':
    '{annotated} இல் {total} மீடியா உருப்படிகள் குறிப்பிடப்பட்டுள்ளன',
  'imageGallery.group.navigation':
    'மீடியா {mediaCurrent} of {mediaTotal} · நுழைவு {groupCurrent} of {groupTotal}',
  'imageGallery.source.label': 'ஆதாரம்:',
  'imageGallery.source.all': 'அனைத்து ஊடகங்களும்',
  'imageGallery.source.trade': 'டிரேட்கள்',
  'imageGallery.source.folder': 'கோப்புறைகள்',
  'imageGallery.source.reviews': 'மதிப்பாய்வுகள்',
  'imageGallery.source.drc': 'தினசரி மதிப்பாய்வுகள்',
  'imageGallery.source.weekly': 'வாராந்திர மதிப்பாய்வுகள்',
  'imageGallery.source.monthly': 'மாதாந்திர மதிப்பாய்வுகள்',
  'imageGallery.source.quarterly': 'காலாண்டு மதிப்பாய்வுகள்',
  'imageGallery.source.yearly': 'ஆண்டு மதிப்பாய்வுகள்',

  'imageGallery.annotation.reviewed': 'மதிப்பாய்வு செய்யப்பட்டது',
  'imageGallery.annotation.unreviewed': 'மதிப்பாய்வு செய்யப்படவில்லை',
  'imageGallery.date.unknown': 'தெரியாத தேதி',
  'imageGallery.annotation.tag': 'குறிச்சொல்',

  'imageGallery.annotation.editor-title': 'ஊடகத்தை சிறுகுறிப்பு',
  'imageGallery.annotation.editor-title-with-file':
    '{fileName} மீது சிறுகுறிப்பு',
  'imageGallery.annotation.tags': 'குறிச்சொற்கள்',
  'imageGallery.annotation.tags-placeholder': 'பிரேக்அவுட், A+ Setup, தவறு',
  'imageGallery.annotation.notes': 'குறிப்புகள்',
  'imageGallery.annotation.notes-placeholder':
    'இந்த விளக்கப்படத்திலிருந்து எதிர்காலத்தில் நீங்கள் என்ன கற்றுக்கொள்ள வேண்டும்?',
  'imageGallery.annotation.error.save-failed':
    'மீடியா குறிப்பைச் சேமிக்க முடியவில்லை.',
  'imageGallery.annotation.error.load-failed':
    'மீடியா குறிப்பை ஏற்ற முடியவில்லை.',
  'imageGallery.annotation.saving': 'சேமிக்கிறது...',
  'settings.gallery-folders.section': 'மீடியா கேலரி',
  'settings.gallery-folders.description':
    'டிரேட் பதிவு கேலரியில் இந்தக் கோப்புறைகளிலிருந்து மீடியாவைக் காட்டு.',
  'settings.gallery-folders.placeholder': 'ஒரு கோப்புறையைத் தேர்வுசெய்க...',
  'settings.gallery-folders.add': 'சேர்',
  'settings.gallery-folders.remove-aria': 'கேலரி கோப்புறையை அகற்று {path}',
  'settings.gallery-folders.not-a-folder':
    'மீடியா கோப்பைக் காட்டிலும் கோப்புறையைத் தேர்ந்தெடுக்கவும்.',
  'settings.gallery-folders.save-failed':
    'கேலரி கோப்புறைகளைச் சேமிப்பதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.',
  'tradelog.guide.switch-to-gallery.title':
    'டிரேட்டில் இருந்து கேலரிக்கு மாறவும்',
  'tradelog.guide.switch-to-gallery.description':
    'வழக்கமான டிரேட் பதிவு மற்றும் கேலரிக்கு இடையே செல்ல இந்த பயன்முறை தேர்வியைப் பயன்படுத்தவும். உங்கள் படங்கள், GIFகள், வீடியோக்கள் மற்றும் YouTube இணைப்புகளுடன் உலாவைத் தொடர கேலரியைக் கிளிக் செய்யவும்.',

  'tradelog.guide.gallery-grouping.title':
    'ஜர்னல் நுழைவு மூலம் ஊடகத்தைக் குழுவாக்கு',
  'tradelog.guide.gallery-grouping.description':
    'குழுவானது ஒவ்வொரு டிரேட், மதிப்பாய்வு அல்லது உள்ளமைக்கப்பட்ட கோப்புறையை ஒன்றாக வைத்திருக்கிறது. தனித்தனி பயன்முறை ஒவ்வொரு ஊடகத்தையும் அதன் சொந்த அட்டையாகக் காட்டுகிறது.',
  'tradelog.guide.gallery-source-sort.title':
    'ஊடக ஆதாரத்தைத் தேர்ந்தெடுத்து ஆர்டர் செய்யவும்',
  'tradelog.guide.gallery-source-sort.description':
    'அனைத்து மீடியா, டிரேட் இணைப்புகள், மதிப்பாய்வு-குறிப்பு மீடியா அல்லது உள்ளமைக்கப்பட்ட vault கோப்புறைகளில் கவனம் செலுத்த மூலத்தைப் பயன்படுத்தவும். புதியது முதல் பழையது வரை அல்லது டிரேட் செயல்திறன் மூலம் பொருட்களை மதிப்பாய்வு செய்ய வரிசைப்படுத்தலைப் பயன்படுத்தவும்.',
  'tradelog.guide.gallery-size.title': 'கேலரி மாதிரிக்காட்சி அளவை சரிசெய்யவும்',
  'tradelog.guide.gallery-size.description':
    'சிறிய ஸ்கேனிங் மற்றும் பெரிய மீடியா முன்னோட்டங்களுக்கு இடையே மாற, இந்த அளவு பொத்தான்களைப் பயன்படுத்தவும்.',
  'tradelog.guide.gallery-filters.title':
    'அதே நுழைவுப் புள்ளியுடன் கேலரியை வடிகட்டவும்',
  'tradelog.guide.gallery-filters.description':
    'வடிகட்டி பொத்தான் இன்னும் மேம்பட்ட வடிப்பான்களைத் திறக்கும். கேலரி பயன்முறையில் இது சிறுகுறிப்பு நிலை மற்றும் மீடியா குறிச்சொற்கள் போன்ற மீடியா-குறிப்பிட்ட வடிப்பான்களையும் உள்ளடக்கியது.',
  'tradelog.guide.gallery-filter-modal.title':
    'மீடியா வடிப்பான்கள் உங்கள் டிரேட் வடிப்பான்களுடன் வாழ்கின்றன',
  'tradelog.guide.gallery-filter-modal.description':
    'டிரேட் வடிப்பான்களை மீடியா வடிப்பான்களுடன் இணைக்க இந்த modal-ஐப் பயன்படுத்தவும். எடுத்துக்காட்டாக, ஒரு Setup-க்கு வடிகட்டவும், பின்னர் குறிப்புகள் அல்லது குறிப்பிட்ட மீடியா டேக் கொண்ட மீடியாவை மட்டும் காட்டவும்.',
  'tradelog.guide.gallery-grid.title':
    'ஆழமான மதிப்பாய்வுக்கு மீடியாவைத் திறக்கவும்',
  'tradelog.guide.gallery-grid.description':
    'கச்சிதமான டிரேட் மற்றும் மதிப்பாய்வு சூழலைக் காண்பிக்கும் போது ஒவ்வொரு அட்டையும் மீடியாவைத் தடையின்றி வைத்திருக்கும். முதலில் தெரியும் உருப்படியை முழுத்திரையில் திறக்க ஏதேனும் கார்டைக் கிளிக் செய்யவும் அல்லது அடுத்து என்பதை அழுத்தவும்.',
  'tradelog.guide.gallery-fullscreen-actions.title':
    'முழுத்திரையிலிருந்து மீடியாவை சிறுகுறிப்பு',
  'tradelog.guide.gallery-fullscreen-actions.description':
    'உருப்படி ஆய்வு செய்ய போதுமான அளவில் இருக்கும்போது, மீடியா-நிலை குறிச்சொற்கள் மற்றும் குறிப்புகளைச் சேர்க்க Tag-ஐப் பயன்படுத்தவும். மூலத்தைத் திற என்பது டிரேட், மதிப்பாய்வு அல்லது கோப்புறை மீடியா கோப்பைத் திறக்கும்.',
  'tradelog.guide.gallery-open-annotation.title':
    'சிறுகுறிப்பு பேனலைத் திறக்கவும்',
  'tradelog.guide.gallery-open-annotation.description':
    'இந்தக் குறிப்பிட்ட மீடியா உருப்படியைக் குறிக்க குறியைக் கிளிக் செய்யவும். மீடியா குறிச்சொற்கள் மற்றும் குறிப்புகள் இணைப்பை விவரிக்கின்றன, முழு டிரேடையும் அல்ல.',
  'tradelog.guide.gallery-annotation-panel.title':
    'மீடியா குறிச்சொற்கள் மற்றும் குறிப்புகளைச் சேர்க்கவும்',
  'tradelog.guide.gallery-annotation-panel.description':
    'liquidity sweep அல்லது failed breakout போன்ற விளக்கப்படம் சார்ந்த யோசனைகளுக்கு மீடியா குறிச்சொற்களைப் பயன்படுத்தவும், மேலும் நீங்கள் நினைவில் கொள்ள விரும்பும் சந்தை-கட்டமைப்பு சூழலுக்கான குறிப்புகளையும் பயன்படுத்தவும்.',
  'tradelog.guide.gallery-finish.title':
    'இரண்டு டிரேட் பதிவு முறைகளையும் நீங்கள் இப்போது அறிவீர்கள்',
  'tradelog.guide.gallery-finish.description':
    'உங்களுக்கு அட்டவணை மற்றும் தொகுதிக் கருவிகள் தேவைப்படும்போது டிரேட்களைப் பயன்படுத்தவும். படங்கள், GIFகள், வீடியோக்கள், YouTube இணைப்புகள் மற்றும் உங்கள் ஜர்னல் முழுவதும் சிறுகுறிப்புகளை நீங்கள் மதிப்பாய்வு செய்ய விரும்பினால் கேலரியைப் பயன்படுத்தவும்.',
  'tradelog.guide.image-gallery-empty.intro.title': 'இன்னும் மீடியா இல்லை',
  'tradelog.guide.image-gallery-empty.intro.description':
    'டிரேட்டில் மீடியாவைச் சேர்க்கவும் அல்லது குறிப்புகளை மதிப்பாய்வு செய்யவும் அல்லது டிரேட் அமைப்புகளில் மீடியா கேலரி கோப்புறைகளை உள்ளமைக்கவும். மீடியா இருந்தால், Journalit முழுத்திரை மதிப்பாய்வு, குறிச்சொற்கள் மற்றும் குறிப்புகளுக்கான முழு கேலரி வழிகாட்டியைக் காண்பிக்கும்.',

  'filter.modal.section.image-gallery': 'காட்சியகம்',
  'filter.modal.session-tags.placeholder': 'அமர்வு குறிச்சொற்கள்',
  'filter.modal.session-tags.all': 'அனைத்து அமர்வு குறிச்சொற்கள்',
  'filter.modal.session-tags.n-selected': '{count} அமர்வு குறிச்சொற்கள்',
  'filter.modal.session-tags.select-all': 'அனைத்தையும் தேர்ந்தெடு',
  'filter.modal.session-tags.none-found': 'அமர்வு குறிச்சொற்கள் எதுவும் இல்லை',

  'home.mode.overview': 'மேலோட்டம்',
  'home.mode.dashboard': 'டாஷ்போர்டு',
  'home.mode.aria': 'முகப்பு பயன்முறையை மாற்றவும்',
  'home.filters.period': 'காலம்',
  'home.filters.trade-type': 'டிரேட் வகை',
  'home.filters.accounts': 'கணக்குகள்',
  'home.filters.back': 'பின்செல்',
  'filter.reset': 'வடிப்பான்களை மீட்டமைக்கவும்',
  'home.guide.modes.title': 'இன்னும் ஒரு விஷயம்: டாஷ்போர்டு',
  'home.guide.modes.description':
    'மேலோட்டம் மற்றும் டாஷ்போர்டு இந்தப் பக்கத்தைப் பகிரவும். உங்கள் செயல்திறன் புள்ளிவிவரங்களின் குறுகிய சுற்றுப்பயணத்தைத் தொடர இப்போது டாஷ்போர்டிற்கு மாறவும்.',
  'home.guide.whats-new.mode.title': 'ஒரு முகப்பு, இரண்டு பயன்முறைகள்',
  'home.guide.whats-new.mode.description':
    'மேலோட்டமும் டாஷ்போர்டும் இப்போது ஒரு பக்கத்தைப் பகிரும். தளவமைப்பு அல்லது ஸ்க்ரோல் நிலையை இழக்காமல் இங்கே முறைகளை மாற்றவும்.',
  'home.guide.whats-new.filters.title':
    'முகப்பு வடிகட்டிகள் ஒரே இடத்தில் உள்ளன',
  'home.guide.whats-new.filters.description':
    'ஒரு சிறிய அடுக்கு மெனுவிலிருந்து காலம், டிரேட் வகை அல்லது கணக்குகளைத் தேர்வுசெய்ய வடிகட்டி பொத்தானைத் திறக்கவும்.',
  'home.guide.whats-new.done.title': 'உங்கள் பணியிடம் சூழலில் இருக்கும்',
  'home.guide.whats-new.done.description':
    'ஆழ்ந்த பகுப்பாய்விற்கு உங்கள் தனிப்பட்ட விட்ஜெட்டுகள் மற்றும் டாஷ்போர்டிற்கான மேலோட்டத்தைப் பயன்படுத்தவும். ஒவ்வொரு பயன்முறையும் அதன் சொந்த வடிப்பான்கள் மற்றும் தளவமைப்பை வைத்திருக்கிறது.',

  'view.home': 'முகப்பு',
  'common.lose': 'தோல்வி',

  'dashboard.conversion.requires-conversion':
    'பல நாணய P&L விளக்கப்படங்களுக்கு மாற்று-விகித மாற்றம் தேவை.',

  'auth.error.invalid-email': 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்',
  'auth.error.invalid-code': 'தவறான சரிபார்ப்புக் குறியீடு',
  'form.layout.guide-trigger-label': 'படிவத்தைத் தனிப்பயனாக்கு',
  'dashboard.filter.setup.none-found': 'Setups எதுவும் இல்லை',
  'nav.weekly': 'வாராந்திர மதிப்பாய்வு',
  'weekly.overview.drawdown-chart.empty': 'காட்டுவதற்கு Drawdown தரவு இல்லை',
  'trade-sync.gate.signin.cta': 'உள்நுழைக',
  'backend.progress.ftp.desc': 'Credentials-ஐ உருவாக்கவும்',
  'csv.errors.group.close-only': 'Close-only executions தவிர்க்கப்பட்டன',
  'csv.report.file': 'கோப்பு: {file}',
  'csv.broker-guide.sierrachart.warning.message':
    'Export விருப்பம் சரிசெய்யப்படாத விலைகளைச் சேமிக்கிறது. "Save Log As" காட்டப்படும் விலைகளை அப்படியே வைத்திருக்கும்.',
  'csv.broker-guide.rithmic.step-1':
    'R | Trader Pro-இல் Order History-ஐத் திறந்து, உங்கள் கணக்கு/தேதிக்கான Completed/Filled ஆர்டர்களுக்கு வடிகட்டவும்',
  'csv.broker-guide.rithmic.step-2':
    'Add/Remove Columns-ஐப் பயன்படுத்தி Side, Symbol, Qty Filled, Avg Fill Price மற்றும் Fill/Update Time தெரியும் என்பதை உறுதிப்படுத்தவும்',
  'trade.details.execution': 'Execution',
  'drc.preparation.checklist.title':
    'டிரேட்டுக்கு முந்தைய சரிபார்ப்பு பட்டியல்',
  'onboarding.welcome.insight.timing.title': 'நேர வடிவங்கள்',
  'onboarding.wizard.error.account-service': 'AccountPageService கிடைக்கவில்லை',
  'account.create.field.drawdown-type-desc':
    'None | Fixed | EOD Trailing | Manual',
  'account.edit.field.drawdown-type-desc':
    'None | Fixed | EOD Trailing | Manual',
  'monthly.game.header.a-games': 'ஒரு விளையாட்டு',
  'trade-import.preview.message.no-open-match':
    'close-only மாதிரிக்காட்சிக்கு பொருந்தக்கூடிய திறந்த டிரேட் எதுவும் இல்லை',
  'setups.view.action.refresh': 'புதுப்பி',
  'setups.view.detail.no-playbook': 'இன்னும் பிளேபுக் எதுவும் எழுதப்படவில்லை.',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'trade-sync.import.action.sync-cloud': 'கிளவுட் டிரேட்களை ஒத்திசைக்கவும்',
  'session-mode.unconfigured.step.gate.description':
    'ஸ்டார்டர் IF/THEN சரிபார்ப்பு பட்டியல் தயாராக உள்ளது.',
  'session-log.placeholder.entry':
    'நீங்கள் என்ன பார்க்கிறீர்கள், நினைக்கிறீர்கள் அல்லது உணர்கிறீர்கள்?',

  'home.widget.streak.kind.trade-outcome': 'டிரேட் முடிவுகள்',
  'home.widget.streak.kind.trade-review': 'டிரேட் மதிப்பாய்வுகள்',
  'home.widget.streak.kind.drc-review': 'DRC மதிப்பாய்வுகள்',
  'home.widget.streak.kind.weekly-review': 'வாராந்திர மதிப்பாய்வுகள்',
  'home.widget.streak.kind.monthly-review': 'மாதாந்திர மதிப்பாய்வுகள்',
  'home.widget.streak.configure': 'ஸ்ட்ரீக் வகையைத் தேர்ந்தெடுக்கவும்',
  'home.widget.streak.configure-aria': '{kind} ஸ்ட்ரீக்கை உள்ளமைக்கவும்',
  'home.widget.streak.no-review-streak': 'செயலில் மதிப்பாய்வு ஸ்ட்ரீக் இல்லை',
  'home.widget.streak.start-reviewing':
    'ஒரு ஸ்ட்ரீக்கை உருவாக்க மதிப்பாய்வைத் தொடங்குங்கள்',
  'home.widget.streak.keep-reviewing':
    'தொடர மதிப்பாய்வு செய்து கொண்டே இருங்கள்',
  'home.widget.streak.reviewed-trades-in-a-row.one':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த டிரேட்',
  'home.widget.streak.reviewed-trades-in-a-row.few':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த டிரேட்கள்',
  'home.widget.streak.reviewed-trades-in-a-row.many':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த டிரேட்கள்',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த டிரேட்கள்',
  'home.widget.streak.reviewed-days-in-a-row.one':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த நாள்',
  'home.widget.streak.reviewed-days-in-a-row.few':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த நாட்கள்',
  'home.widget.streak.reviewed-days-in-a-row.many':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த நாட்கள்',
  'home.widget.streak.reviewed-days-in-a-row.other':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த நாட்கள்',
  'home.widget.streak.reviewed-weeks-in-a-row.one':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த வாரம்',
  'home.widget.streak.reviewed-weeks-in-a-row.few':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த வாரங்கள்',
  'home.widget.streak.reviewed-weeks-in-a-row.many':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த வாரங்கள்',
  'home.widget.streak.reviewed-weeks-in-a-row.other':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த வாரங்கள்',
  'home.widget.streak.reviewed-months-in-a-row.one':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த மாதம்',
  'home.widget.streak.reviewed-months-in-a-row.few':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த மாதங்கள்',
  'home.widget.streak.reviewed-months-in-a-row.many':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த மாதங்கள்',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'ஒரு வரிசையில் மதிப்பாய்வு செய்த மாதங்கள்',
  'home.widget.streak.missed-trades.one':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} டிரேட் தவறவிடப்பட்டது',
  'home.widget.streak.missed-trades.few':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} டிரேட்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-trades.many':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} டிரேட்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-trades.other':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} டிரேட்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-days.one':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} நாள் தவறவிடப்பட்டது',
  'home.widget.streak.missed-days.few':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} நாட்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-days.many':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} நாட்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-days.other':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} நாட்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-weeks.one':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} வாரம் தவறவிடப்பட்டது',
  'home.widget.streak.missed-weeks.few':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} வாரங்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-weeks.many':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} வாரங்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-weeks.other':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} வாரங்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-months.one':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} மாதம் தவறவிடப்பட்டது',
  'home.widget.streak.missed-months.few':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} மாதங்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-months.many':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} மாதங்கள் தவறவிடப்பட்டன',
  'home.widget.streak.missed-months.other':
    'உங்கள் கடைசி மதிப்பாய்வுக்குப் பிறகு {count} மாதங்கள் தவறவிடப்பட்டன',
  'trade-sync.quick.started':
    'இயக்கப்பட்ட வர்த்தக மூலங்கள் ஒத்திசைக்கப்படுகின்றன…',
  'trade-sync.quick.running': 'ஒத்திசைக்கப்படுகிறது…',
  'trade-sync.quick.offline':
    'வர்த்தக ஒத்திசைவுக்கு இணைய இணைப்பு தேவை. ஆன்லைனில் வந்ததும் மீண்டும் முயற்சிக்கவும்.',
  'trade-sync.quick.no-sources':
    'இயக்கப்பட்ட வர்த்தக ஒத்திசைவு மூலங்கள் எதுவும் கிடைக்கவில்லை. அமைப்புகளில் Trade Sync-ஐ உள்ளமைக்கவும்.',
  'trade-sync.quick.complete':
    'வர்த்தக ஒத்திசைவு முடிந்தது: {sources} மூலங்கள் ஒத்திசைக்கப்பட்டன; {imported} வர்த்தகங்கள் இறக்குமதி அல்லது புதுப்பிக்கப்பட்டன.',
  'trade-sync.quick.partial':
    'வர்த்தக ஒத்திசைவு சிக்கல்களுடன் முடிந்தது: {total} மூலங்களில் {completed} முடிந்தன; {imported} வர்த்தகங்கள் இறக்குமதி அல்லது புதுப்பிக்கப்பட்டன.',
  'trade-sync.quick.failed':
    '{sources} மூலங்களுக்கான வர்த்தக ஒத்திசைவை முடிக்க முடியவில்லை. Trade Sync அமைப்புகளைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'navigation.items.nav-sync-trades': 'வர்த்தகங்களை ஒத்திசைக்கவும்',
  'command.sync-trades-now': 'வர்த்தகங்களை ஒத்திசைக்கவும்',
  'home.quick-links.sync-trades': 'வர்த்தகங்களை ஒத்திசைக்கவும்',
  'trade-sync.quick.not-ready':
    'இப்போது இயக்கப்பட்ட வர்த்தக ஒத்திசைவு மூலங்கள் எதுவும் தயாராக இல்லை. செயலில் உள்ள ஒத்திசைவுகள் முடியும் வரை காத்திருக்கவும் அல்லது Trade Sync அமைப்புகளைச் சரிபார்க்கவும்.',
  'trade-sync.quick.mapping-required':
    '{imported} வர்த்தகங்கள் இறக்குமதி செய்யப்பட்டன அல்லது புதுப்பிக்கப்பட்டன. அமைப்புகள் → Trade Sync இல் {providers} க்கான கணக்கு இணைப்பை முடித்து மீண்டும் முயற்சிக்கவும்.',
  'trade-handoff.action.view-trades-count.one': '{count} வர்த்தகத்தைக் காண்க',
  'trade-handoff.action.view-trades-count.few': '{count} வர்த்தகங்களைக் காண்க',
  'trade-handoff.action.view-trades-count.many': '{count} வர்த்தகங்களைக் காண்க',
  'trade-handoff.action.view-trades-count.other':
    '{count} வர்த்தகங்களைக் காண்க',
  'trade-handoff.action.review-now': 'இப்போது மதிப்பாய்வு செய்',
  'trade-handoff.action.open-period': '{period} மதிப்பாய்வைத் திற',
  'trade-handoff.review.creation-disabled':
    'அந்த மதிப்பாய்வு இல்லை மற்றும் தானியங்கு மதிப்பாய்வு உருவாக்கம் முடக்கப்பட்டுள்ளது.',
  'trade-handoff.review.open-failed': 'அந்த மதிப்பாய்வைத் திறக்க முடியவில்லை.',
  'trade-handoff.trades.open-failed': 'வர்த்தகப் பதிவைத் திறக்க முடியவில்லை.',
  'trade-handoff.scope.label':
    '{accounts} க்கான சமீபத்திய செயல்பாட்டிலிருந்து {trades} காட்டப்படுகின்றன',
  'trade-handoff.scope.exit': 'செயல்பாட்டுக் காட்சியிலிருந்து வெளியேறு',
  'trade-handoff.trade-count.one': '{count} வர்த்தகம்',
  'trade-handoff.trade-count.few': '{count} வர்த்தகங்கள்',
  'trade-handoff.trade-count.many': '{count} வர்த்தகங்கள்',
  'trade-handoff.trade-count.other': '{count} வர்த்தகங்கள்',
  'trade-handoff.title.sync': 'ஒத்திசைவு முடிந்தது',
  'trade-handoff.summary.import-complete': '{trades} இறக்குமதி செய்யப்பட்டன',
  'trade-handoff.summary.import-partial':
    '{trades} சிக்கல்களுடன் இறக்குமதி செய்யப்பட்டன',
  'trade-handoff.summary.sync-complete': '{trades} ஒத்திசைக்கப்பட்டன',
  'trade-handoff.summary.sync-partial':
    '{trades} சிக்கல்களுடன் ஒத்திசைக்கப்பட்டன',
  'trade-handoff.periods.choose':
    'வேறு மதிப்பாய்வுக் காலத்தைத் தேர்ந்தெடுக்கவும்',
  'trade-handoff.periods.recommended': 'பரிந்துரை',
  'trade-handoff.action.dismiss': 'சமீபத்திய வர்த்தக முடிவை மூடு',
  'sample.action.try': 'மாதிரி பதிவேட்டை முயற்சிக்கவும்',
  'sample.action.reset': 'மாதிரியை மீட்டமைக்கவும்',
  'sample.popout.title': 'மாதிரி பதிவேடு',
  'sample.popout.action.exit': 'வெளியேறு',
  'sample.popout.description': 'இங்குள்ள மாற்றங்கள் பயிற்சிக்காக மட்டுமே.',
  'sample.popout.closed': 'பயிற்சிப் பதிவேடு சேமிக்கப்பட்டு மூடப்பட்டது.',
  'sample.popout.recovery': 'பயிற்சிப் பதிவேட்டை மீட்டெடுக்க வேண்டும்.',
  'sample.notice.sync-blocked':
    'நீங்கள் கற்பனையான மாதிரித் தரவைத் திருத்துகிறீர்கள். பின்தள ஒத்திசைவு இடைநிறுத்தப்பட்டுள்ளது.',
  'sample.notice.folder-locked':
    'மாதிரி ஜர்னல் செயலில் இருக்கும்போது ஜர்னல் கோப்புறையை மாற்ற முடியாது.',
  'sample.empty.description':
    'உங்கள் பதிவேட்டு கோப்புகள் அல்லது அமைப்புகளை மாற்றாமல் நிரப்பப்பட்ட கற்பனைப் பதிவேட்டை ஆராயுங்கள்.',
  'sample.progress.creating':
    'மாதிரி பதிவேடு உருவாக்கப்படுகிறது: {total} உருப்படிகளில் {completed}',
  'sample.progress.removing':
    'மாதிரி பதிவேடு அகற்றப்படுகிறது: {total} உருப்படிகளில் {completed}',
  'sample.progress.verifying':
    'மாதிரி பதிவேட்டைச் சரிபார்க்கிறது: {total} இல் {completed} உருப்படிகள்',
  'sample.exit.title': 'மாதிரி பதிவேட்டிலிருந்து வெளியேறவா?',
  'sample.exit.remove-warning':
    'அகற்றுவது உறுதிப்படுத்தப்பட்ட மாதிரி கோப்புகளில் உள்ள திருத்தங்களை அழிக்கும். மாதிரி உரிமையை நிரூபிக்க முடியாத கோப்புகள் பாதுகாக்கப்படும்.',
  'sample.exit.remove': 'வெளியேறி அகற்று',
  'sample.reset.title': 'மாதிரி பதிவேட்டை மீட்டமைக்கவா?',
  'sample.reset.message':
    'இது அனைத்து மாதிரி கோப்புகளையும் மாதிரிக்கான அமைப்புகளையும் அசல் கற்பனைத் தொகுப்பிற்கு மீட்டமைக்கும்.',
  'sample.reset.warning':
    'மாதிரி பதிவேட்டில் நீங்கள் செய்த திருத்தங்கள் நீக்கப்படும்.',
  'sample.collision.title': 'மாதிரி கோப்புறை ஏற்கனவே உள்ளது',
  'sample.collision.message':
    'Journalit ஏற்கனவே உள்ள கோப்புறையை மேலெழுதாது. அதற்கு பதிலாக “{path}” இல் மாதிரி பதிவேட்டை உருவாக்கவா?',
  'sample.collision.confirm': 'கிடைக்கும் கோப்புறையைப் பயன்படுத்தவும்',
  'sample.notice.ready': 'மாதிரி பதிவேடு தயாராக உள்ளது.',
  'sample.notice.reset': 'மாதிரி பதிவேடு மீட்டமைக்கப்பட்டது.',
  'sample.notice.reset-preserved':
    'மாதிரி பதிவேடு மீட்டமைக்கப்பட்டது. உரிமையை நிரூபிக்க முடியாத {count} கோப்புகள் பாதுகாக்கப்பட்டன.',
  'sample.notice.removed': 'மாதிரி பதிவேடு அகற்றப்பட்டது.',
  'sample.notice.removed-preserved':
    'மாதிரி பதிவேடு அகற்றப்பட்டது. உரிமையை நிரூபிக்க முடியாத {count} கோப்புகள் பாதுகாக்கப்பட்டன.',
  'sample.notice.error': 'மாதிரி பதிவேட்டு செயல்பாடு தோல்வியடைந்தது: {error}',
  'command.open-sample-journal': 'மாதிரி பதிவேட்டைத் திறக்கவும்',
  'command.exit-sample-journal': 'மாதிரி பதிவேட்டிலிருந்து வெளியேறவும்',
  'command.reset-sample-journal': 'மாதிரி பதிவேட்டை மீட்டமைக்கவும்',
  'sample.notice.busy':
    'மாதிரி பதிவேட்டின் மற்றொரு செயல் ஏற்கனவே நடைபெறுகிறது.',
  'account.profiles.no-matching-phase':
    'இந்தச் சுயவிவரத்தில் பொருந்தும் கட்டம் இல்லை.',
  'account.profiles.history-unchanged': 'முந்தைய வரலாறு மாறாமல் இருக்கும்.',
  'account.profiles.notice-title':
    'புதுப்பிக்கப்பட்ட சவால் சுயவிவரம் கிடைக்கிறது',
  'account.profiles.notice-description':
    'மூலச் சுயவிவரம் உங்கள் சேமித்த சுயவிவரத்திலிருந்து வேறுபடுகிறது. உங்கள் கணக்கு விதிகள் மாறவில்லை.',
  'account.profiles.review-changes': 'மாற்றங்களை மதிப்பாய்வு செய்',
  'account.profiles.check-failed':
    'விதிப் புதுப்பிப்புகளைச் சரிபார்க்க முடியவில்லை.',
  'account.profiles.retry': 'மீண்டும் முயல்க',
  'account.profiles.source-changed':
    'இந்த மதிப்பாய்வு திறந்திருக்கும்போது மூலச் சுயவிவரம் மாறியது. பயன்படுத்துவதற்கு முன் மதிப்பாய்வை மீண்டும் திறக்கவும்.',
  'account.profiles.retain': 'தற்போதைய விதிகளை வைத்திரு',
  'account.profiles.retain-help':
    'இந்தக் கணக்கின் விதிகளை வைத்திருந்து இந்த மூல மாற்றங்களை நிராகரிக்கவும். பின்னர் கொள்கை மாற்றங்கள் மீண்டும் அறிவிக்கலாம்.',
  'account.profiles.comparison-help':
    'வேறுபாடுகள் மட்டுமே காட்டப்படும். புலங்களைப் பார்க்க ஒரு விதியை விரிவாக்கவும். உள்ளூர் மேலெழுதல்கள் வேறுபாடுகளை விளக்கலாம்.',
  'account.profiles.added': 'சேர்க்கப்பட்டது',
  'account.profiles.removed': 'அகற்றப்பட்டது',
  'account.profiles.changed': 'மாற்றப்பட்டது',
  'account.profiles.not-configured': 'கட்டமைக்கப்படவில்லை',
  'account.profiles.no-rule-changes':
    'இந்தக் கட்டத்திற்கு விதி அல்லது பேஅவுட் கொள்கை வேறுபாடுகள் இல்லை.',
  'account.profiles.accept': 'புதுப்பிப்பைப் பயன்படுத்து',
  'account.profiles.cached':
    'தற்காலிகமாகச் சேமித்த சுயவிவரங்கள் பயன்படுத்தப்படுகின்றன; சமீபத்திய விதிகளைச் சரிபார்க்க முடியவில்லை.',
  'account.profiles.guide':
    'வெளியிடப்பட்ட பொருந்தும் தன்மை அல்லது நிறுவனம் உறுதிப்படுத்திய நிபந்தனைகளைக் கொண்டு மாறிய விதிகளை மதிப்பாய்வு செய்யவும். கேட்கப்படும்போது அசல் வாங்கிய தேதியை உள்ளிடவும். கணக்கைத் திருத்து என்பதில் என் நிறுவனச் சுயவிவரங்கள் கீழ் வார்ப்புருக்களைச் சேமிக்கவும்.',
  'account.profiles.account-phase': 'கணக்குக் கட்டம்',
  'account.profiles.choose': 'சேமித்த சுயவிவரத்தைத் தேர்வுசெய்',
  'account.profiles.completed':
    'முடிந்த கட்டங்கள் தங்கள் அசல் விதிகளை வைத்திருக்கும்.',
  'account.profiles.confirm': 'இந்த விதிகள் என் கணக்கிற்குப் பொருந்தும்.',
  'account.profiles.currency':
    'பயன்படுத்துவதற்கு முன் சுயவிவரத்துடன் பொருந்தும் கணக்கு நாணயத்தைத் தேர்வுசெய்யவும்.',
  'account.profiles.current': 'தற்போதைய கணக்கு விதிகள்',
  'account.profiles.custom-transition': 'தனிப்பயன் மாற்ற நிபந்தனைகள்',
  'account.profiles.cycle-start': 'பேஅவுட் சுழற்சி தொடக்கம் (உள்ளூர் நேரம்)',
  'account.profiles.delete-help':
    'இந்தச் சேமித்த சுயவிவரத்தை நீக்கவா? ஏற்கனவே பயன்படுத்தும் கணக்குகள் மாறாது.',
  'account.profiles.effective': 'அமலுக்கு வரும் தேதி (உள்ளூர் நேரம்)',
  'account.profiles.correction-title': 'பட்டியல் திருத்தம்',
  'account.profiles.correction-source': 'விதி மூலம்',
  'account.profiles.correction-period': 'பாதிக்கப்பட்ட வரலாறு',
  'account.profiles.correction-guide':
    'பாதிக்கப்பட்ட வரலாற்றை மறுகணக்கிடுவதற்கு முன் பட்டியல் திருத்தங்களுக்கு ஒப்புதல் தேவை.',
  'account.profiles.correction-history': 'திருத்த வரலாறு',
  'account.profiles.correction-stale':
    'கணக்கு வரலாறு மாறியது. திருத்தத்தைப் பயன்படுத்துவதற்கு முன் இந்த மதிப்பாய்வை மீண்டும் திறக்கவும்.',
  'account.profiles.correction-result': 'கடுமையான விதி மதிப்பீடு',
  'account.profiles.no-hard-breach': 'கண்டறியப்பட்ட கடுமையான மீறல் இல்லை',
  'account.profiles.correction-consent': 'வரலாற்றை மறுகணக்கிடு',
  'account.profiles.correction-details': 'விவரங்கள்',
  'account.profiles.correction-apply': 'திருத்தத்தைப் பயன்படுத்து',
  'account.profiles.purchase-date': 'அசல் வாங்கிய தேதி',
  'account.profiles.save-purchase': 'வாங்கிய தேதியைச் சேமி',
  'account.profiles.purchase-needed':
    'இந்த நிபந்தனைகளைச் சரிபார்க்க அசல் வாங்கிய தேதியை உள்ளிடவும்.',
  'account.profiles.purchase-excluded':
    'இந்த வாங்கல் தற்போதைய நிபந்தனைகளை வைத்திருக்கும்.',
  'account.profiles.purchase-uncertain':
    'பொருந்தும் தன்மைக்கு நிறுவனத்தின் உறுதிப்படுத்தல் தேவை. விதிகள் மாறாமல் இருக்கும்.',
  'account.profiles.initial-terms':
    'இந்த நிபந்தனைகள் வாங்கியது முதல் அல்லது இந்தக் கட்டத்திற்கு முன் பொருந்தும். ஆரம்ப அமைப்பைத் தனியாக மதிப்பாய்வு செய்யவும்; வரலாறு மாறாமல் இருக்கும்.',
  'account.profiles.announcement': 'நிறுவன அறிவிப்பு',
  'account.profiles.firm-effective': 'நிறுவனம் உறுதிப்படுத்திய அமல் தேதி',
  'account.profiles.published-date': 'வெளியிடப்பட்ட அமல் தேதி',
  'account.profiles.applicability-checking':
    'பொருந்தும் தன்மையைச் சரிபார்க்கிறது…',
  'account.profiles.error':
    'சுயவிவரத்தைச் சேமிக்க முடியவில்லை. மதிப்புகளைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'account.profiles.floor': 'மாற்றத்தின் போது ட்ராடவுன் தளம்',
  'account.profiles.history': 'விதி வரலாறு',
  'account.profiles.history-help':
    'முந்தைய விதிகள் வைக்கப்படும். பதிப்புள்ள கட்டத்தை மாற்ற சுயவிவரப் புதுப்பிப்பை மதிப்பாய்வு செய் என்பதைப் பயன்படுத்தவும்; வரலாற்றைப் பாதுகாக்க நேரடித் திருத்தம் பூட்டப்பட்டுள்ளது.',
  'account.profiles.incoming': 'வரவிருக்கும் சுயவிவர விதிகள்',
  'account.profiles.independent':
    'சேமித்த சுயவிவரங்கள் இந்த வால்ட்டுக்கு உள்ளூர். ஒன்றைப் பயன்படுத்துவது சுயாதீன கணக்கு ஸ்னாப்ஷாட்டை உருவாக்கும்; புதிய திருத்தப் பதிப்பைச் சேமிப்பது ஏற்கனவே உள்ள கணக்குகளை மாற்றாது.',
  'account.profiles.keep-help':
    'தேர்வுசெய்யப்பட்ட விதிகள் அந்த வகை வரவிருக்கும் விதிக்குப் பதிலாக உங்கள் உள்ளூர் மதிப்புகளை வைத்திருக்கும். சுயவிவர மதிப்பை ஏற்க தேர்வை நீக்கவும். புதிய விதி வகைகள் சேர்க்கப்படும்.',
  'account.profiles.keep-local': 'என்னுடையதை வைத்திரு:',
  'account.profiles.keep-payout': 'தற்போதைய பேஅவுட் கொள்கையை வைத்திரு',
  'account.profiles.library': 'என் நிறுவனச் சுயவிவரங்கள்',
  'account.profiles.locked': 'ட்ராடவுன் தளம் ஏற்கனவே பூட்டப்பட்டுள்ளது',
  'account.profiles.missing': 'இந்தச் சேமித்த சுயவிவரம் இனி இல்லை.',
  'account.profiles.peak': 'கொண்டு செல்லப்பட்ட உச்ச இருப்பு',
  'account.profiles.review': 'சுயவிவரப் புதுப்பிப்பை மதிப்பாய்வு செய்',
  'account.profiles.link-source': 'நிறுவனச் சுயவிவரத்தை இணை',
  'account.profiles.save-new': 'புதிய சுயவிவரமாகச் சேமி',
  'account.profiles.save-revision':
    'தேர்ந்தெடுத்த சுயவிவரத்தின் புதிய திருத்தப் பதிப்பைச் சேமி',
  'account.profiles.source-phase': 'மூலச் சுயவிவரக் கட்டம்',
  'account.profiles.transition-help':
    'சரிபார்க்கப்பட்ட மாற்ற இயல்புநிலைகள் வழங்கப்படவில்லை. நிறுவனம் உறுதிப்படுத்திய நிபந்தனைகளை உள்ளிடவும்: தளம், உச்சம் மற்றும் பேஅவுட் சுழற்சி தொடக்கம். இவை தனிப்பயன் எனக் குறிக்கப்படும். கட்ட லாபமும் வாழ்நாள் பேஅவுட் எண்ணிக்கையும் வைக்கப்படும்; பழைய டிரேட்கள் தங்கள் அசல் விதிகளை வைத்திருக்கும்.',
  'account.profiles.transition-source':
    'நிறுவன உறுதிப்படுத்தல் அல்லது குறிப்பு',
  'account.profiles.unknown-baseline':
    'இந்தப் பழைய கணக்கிற்கு அசல் மூல ஸ்னாப்ஷாட் இல்லை. ஒவ்வொரு வேறுபாட்டையும் தெளிவாக மதிப்பாய்வு செய்யவும்; உள்ளூர் மேலெழுதல்களைத் தானாக அடையாளம் காண முடியாது.',
  'account.profiles.update-available':
    'சுயவிவர வேறுபாடுகளுக்கு மதிப்பாய்வு தேவை. உங்கள் கணக்கு இன்னும் சேமித்த விதிகளையே பயன்படுத்துகிறது.',
  'account.profiles.up-to-date':
    'இந்தக் கட்டம் கடைசியாக மதிப்பாய்வு செய்யப்பட்ட சுயவிவர வரையறையைப் பயன்படுத்துகிறது; உள்ளூர் மேலெழுதல்கள் சுயாதீனமாக இருக்கும்.',
  'form.field.prop-challenge-phase': 'கட்டம்: {name}',
  'form.field.prop-challenge-phase.none': 'இப்போது கட்டம் இல்லை',
  'dashboard.filter.accounts.phase-now': 'இப்போது',
  'home.widget.eval-roi.name': 'மதிப்பீட்டு வருவாய்',
  'home.widget.challenge-alerts.name': 'சவால் எச்சரிக்கைகள்',
  'home.widget.challenge-alerts.description':
    'முடிவு தேவைப்படும் ப்ராப் சவால் கணக்குகள்: தோல்வி, தேர்ச்சி அல்லது பேஅவுட் தயார்',
  'home.widget.eval-roi.description':
    'ப்ராப் சவால் கணக்குகள் முழுவதும் மதிப்பீட்டு செலவு எதிர் பேஅவுட்கள்',
  'account.header.back-to-dashboard': 'டாஷ்போர்டுக்குத் திரும்பு',
  'account.header.warning.trades-before-phase.one':
    'கட்டம் 1 தொடங்குவதற்கு முன் {count} டிரேட் கண்டறியப்பட்டது',
  'account.header.warning.trades-before-phase.few':
    'கட்டம் 1 தொடங்குவதற்கு முன் {count} டிரேட்கள் கண்டறியப்பட்டன',
  'account.header.warning.trades-before-phase.many':
    'கட்டம் 1 தொடங்குவதற்கு முன் {count} டிரேட்கள் கண்டறியப்பட்டன',
  'account.header.warning.trades-before-phase.other':
    'கட்டம் 1 தொடங்குவதற்கு முன் {count} டிரேட்கள் கண்டறியப்பட்டன',
  'account.header.warning.earliest-trade-phase':
    'முந்தைய டிரேட்: {date}. கட்டம் தொடங்குவதற்கு முன் உள்ள டிரேட்கள் சவாலில் கணக்கிடப்படாது.',
  'account.header.notice.phase-start-updated':
    'கட்டம் 1 தொடக்கம் {date}க்கு நகர்த்தப்பட்டது',
  'account.header.warning.fix-phase-start.aria':
    'கட்டம் 1 தொடக்கத்தைச் சரிசெய்',
  'account.settings.section.challenge-stages.title': 'சவால் நிலைகள்',
  'account.settings.section.challenge-stages.desc':
    'சவால் இந்த நிலையை அடையும்போது பயன்படுத்தப்படும் கணக்கு வகை.',
  'account.settings.section.challenge-stages.no-change': 'மாற்றம் இல்லை',
  'account.settings.section.challenge-stages.aria': '{stage}க்கான கணக்கு வகை',
  'account-dashboard.challenges.empty.title': 'இன்னும் சவால்கள் இல்லை',
  'account-dashboard.challenges.empty.message':
    'கட்டங்கள், விதிகள் மற்றும் பேஅவுட்களுடன் ஒரு கணக்காகப் ப்ராப் நிறுவனச் சவாலைக் கண்காணிக்கவும்.',
  'account-dashboard.challenges.empty.create': 'புதிய சவால்',
  'account-dashboard.challenges.empty.setup': 'ஏற்கனவே உள்ள கணக்குகளை அமை',
  'account-dashboard.guide.main.settings-stages.title':
    'சவால் நிலைகள் கணக்கு வகையை அமைக்கலாம்',
  'account-dashboard.guide.main.settings-stages.description':
    'சவால் மதிப்பீடு, சிம் ஃபண்டட் அல்லது நேரடி ஃபண்டட்டை அடையும்போது பயன்படுத்தப்படும் கணக்கு வகையைத் தேர்வுசெய்யவும். கணக்கு வகையை அப்படியே வைத்திருக்க ஒரு நிலையை மாற்றம் இல்லை என விடவும்.',
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    'புதியது: பல-கட்ட ப்ராப் சவால்கள்',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    'ப்ராப் சவால் முன்னேற்றம் இப்போது கணக்கு டாஷ்போர்டிலேயே உள்ளது — கட்ட ரிப்பன்கள், சவால் பொருளாதாரம், நீங்கள் ஏற்கனவே பயன்படுத்தும் அதே கணக்குக் குழுக்கள்.',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    'கணக்கை உருவாக்கும்போது அல்லது திருத்தும்போது கண்காணிப்பை இயக்குங்கள்',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    'கணக்கை உருவாக்கு அல்லது கணக்கைத் திருத்து என்பதில், கணக்கு முறை தேர்வியில் ப்ராப் சவாலைத் தேர்வுசெய்யவும். முன்னேறும்போது ஒவ்வொரு கட்டமும் கணக்கை வேறு கணக்கு வகைக்கு உயர்த்தலாம்.',
  'account-dashboard.guide.whats-new.prop-challenges.overview.title':
    'ஒரே பார்வையில் சவால் செயல்திறன்',
  'account-dashboard.guide.whats-new.prop-challenges.overview.description':
    'மேல் ஸ்கோர்கார்டு செயலில் உள்ள சவால்கள், தேர்ச்சி விகிதம், செலவுகள், பேஅவுட்கள் மற்றும் நிகர முடிவுகளைச் சுருக்கமாகக் காட்டும். நுண்ணறிவு அட்டவணைகள் கட்டத் தடைகளை ஒப்பிடுகின்றன, பல நிறுவனங்களைக் கண்காணிக்கும்போது ப்ராப் நிறுவனம் வாரியான செயல்திறனையும் காட்டும்.',
  'account-dashboard.guide.whats-new.prop-challenges.ribbons.title':
    'கட்ட ரிப்பன்கள் ஒவ்வொரு சவாலையும் எளிதில் பார்க்க வைக்கின்றன',
  'account-dashboard.guide.whats-new.prop-challenges.ribbons.description':
    'ப்ராப் கணக்கு அட்டைகள் மேலே முடிந்த, தற்போதைய, நிலுவை மற்றும் தோல்வியுற்ற கட்டங்களைக் காட்டி, அதைத் தொடர்ந்து நேரடி இலக்கு, ட்ராடவுன், தினசரி நஷ்டம் மற்றும் டிரேடிங் நாள் முன்னேற்றத்தைக் காட்டும்.',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    'போர்ட்ஃபோலியோ மற்றும் சவால் பகுப்பாய்வுக்கு இடையே மாறுங்கள்',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    'மொத்த ப்ராப் சவால் பொருளாதாரம் மற்றும் கட்ட/பல-நிறுவன நுண்ணறிவுகளைக் காண சவால்களைத் தேர்வுசெய்யவும். கண்ணோட்டம் AUM விளக்கப்படம் மற்றும் போர்ட்ஃபோலியோ மொத்தங்களில் கவனம் செலுத்தும்.',
  'account-dashboard.guide.whats-new.prop-challenges.account-page.title':
    'மாற்றப்பட்ட கணக்குகள் அதே ஓட்டத்தில் இருக்கும்',
  'account-dashboard.guide.whats-new.prop-challenges.account-page.description':
    'சவால் முன்னேறும்போது அல்லது ஃபண்டட்டாக மாறும்போது, அதன் கணக்கு வகையும் கட்ட வரலாறும் இணைந்தே இருக்கும். இணக்க முடிவுகள், வாழ்க்கைச் சுழற்சி செயல்கள் மற்றும் முழு விதிப் பிரிவைக் காண அட்டையைத் திறக்கவும்.',
  'account-dashboard.prop.metrics.total': 'சவால்கள்',
  'account-dashboard.prop.metrics.pass-rate': 'தேர்ச்சி விகிதம்',
  'account-dashboard.prop.metrics.costs': 'சவால் செலவுகள்',
  'account-dashboard.prop.metrics.payouts': 'பேஅவுட்கள்',
  'account-dashboard.prop.metrics.net': 'நிகர',
  'account-dashboard.prop.tabs.overview': 'கண்ணோட்டம்',
  'account-dashboard.mode.selector': 'கணக்கு டாஷ்போர்டு முறை',
  'account-dashboard.mode.account-overview': 'கண்ணோட்டம்',
  'account-dashboard.mode.challenges': 'சவால்கள்',
  'account-dashboard.prop.metrics.active': 'செயலில் உள்ள சவால்கள்',
  'account-dashboard.prop.economics.title': 'பொருளாதாரம்',
  'account-dashboard.prop.economics.roi': 'முதலீட்டு வருவாய்',
  'account-dashboard.prop.economics.roi-no-cost': 'செலவு இல்லை',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    'முயற்சிக்கு சராசரி செலவு',
  'account-dashboard.prop.economics.cost-per-funded-account':
    'ஃபண்டட் கணக்கிற்கான செலவு',
  'account-dashboard.prop.economics.payout-conversion': 'பேஅவுட் மாற்றம்',
  'account-dashboard.prop.insights.title': 'சவால் நுண்ணறிவுகள்',
  'account-dashboard.prop.phases.title': 'கட்ட நுண்ணறிவுகள்',
  'account-dashboard.prop.phases.phase': 'கட்டம்',
  'account-dashboard.prop.phases.average-duration': 'சராசரி காலம்',
  'account-dashboard.prop.phases.show-more': 'மேலும் {count} காட்டு',
  'account-dashboard.prop.phases.show-fewer': 'குறைவாகக் காட்டு',
  'account-dashboard.prop.tooltip.open-explanation': '{metric}ஐ விளக்கு',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    'முடிந்த தரவு இன்னும் போதாது',
  'account-dashboard.prop.tooltip.pass-rate.description':
    'முடிந்த சவால்களில் தேர்ச்சியடைந்த பங்கு. செயலில் உள்ள சவால்களும் முடிவில்லாத காப்பகச் சவால்களும் விலக்கப்படும்.',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    'தேர்ச்சியடைந்த சவால்கள் ÷ முடிந்த சவால்கள் × 100',
  'account-dashboard.prop.tooltip.roi.description':
    'சவால் செலவுகளுடன் ஒப்பிட்ட நிகர பேஅவுட் வருவாய் (பேஅவுட்கள் கழித்தல் சவால் செலவுகள்). சேர்க்கப்பட்ட அனைத்துச் சவால்களும் ஒரே நாணயத்தைப் பயன்படுத்தும்போது மட்டுமே முதலீட்டு வருவாய் கணக்கிடப்படும்.',
  'account-dashboard.prop.tooltip.roi.formula':
    '(பேஅவுட்கள் − சவால் செலவுகள்) ÷ சவால் செலவுகள் × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    'இந்த சேலஞ்சுகளுக்கு எந்தச் செலவும் இல்லை, எனவே வகுக்க செலவு அடிப்படை இல்லை. நிகர வருவாய் {payouts} பேஅவுட் ஆகும்.',
  'account-dashboard.prop.tooltip.average-cost.description':
    'ஒவ்வொரு முயற்சிக்கும் சராசரி சவால் செலவு, ஒவ்வொரு நாணயத்திற்கும் தனித்தனியாகக் கணக்கிடப்படும்.',
  'account-dashboard.prop.tooltip.average-cost.formula':
    'சவால் செலவுகள் ÷ மொத்த சவால் முயற்சிகள்',
  'account-dashboard.prop.tooltip.funded-cost.description':
    'தேர்ச்சியடைந்த ஒவ்வொரு சவாலுக்கும் தேவைப்படும் சராசரி சவால் செலவு, ஒவ்வொரு நாணயத்திற்கும் தனித்தனியாகக் கணக்கிடப்படும்.',
  'account-dashboard.prop.tooltip.funded-cost.formula':
    'சவால் செலவுகள் ÷ தேர்ச்சியடைந்த சவால்கள்',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    'குறைந்தது ஒரு பேஅவுட்டை உருவாக்கிய தேர்ச்சியடைந்த சவால்களின் பங்கு.',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    'பேஅவுட் உள்ள தேர்ச்சியடைந்த சவால்கள் ÷ தேர்ச்சியடைந்த சவால்கள் × 100',
  'account-dashboard.prop.tabs.phases': 'கட்டங்கள்',
  'account-dashboard.prop.tabs.firms': 'நிறுவனங்கள்',
  'account-dashboard.prop.firms.firm': 'நிறுவனம்',
  'account-dashboard.prop.firms.attempts': 'முயற்சிகள்',
  'account-dashboard.prop.phases.most-failed': 'அதிகம் தோல்வியுற்றவை',
  'account-dashboard.prop.phases.days': '{count} நாட்கள்',
  'account-dashboard.prop.phases.empty': 'இன்னும் முடிந்த கட்டங்கள் இல்லை',
  'account.metrics.total-account-costs': 'மதிப்பிடப்பட்ட மொத்த செலவுகள்',
  'account.metrics.total-costs': 'மொத்த செலவுகள்',
  'account.metrics.one-time-costs': 'ஒருமுறை செலவுகள்',
  'account.metrics.recurring-costs-to-date': 'இன்றுவரை தொடர் செலவுகள்',
  'account.metrics.monthly-cost': 'மாதாந்திர செலவு',
  'account.challenge.toggle.label': 'ப்ராப் ஃபார்ம் சவால்',
  'account.challenge.toggle.help':
    'இந்தக் கணக்குக்கான மதிப்பீட்டுக் கட்டங்கள், நிறுவன விதிகள் மற்றும் பணம் எடுத்தல்களைக் கண்காணிக்கவும்.',
  'account.prop-challenge.title': 'ப்ராப் சவால்',
  'account.prop-challenge.identity': 'சவால் அடையாளம்',
  'account.prop-challenge.prefill.heading-link':
    'உங்கள் நிறுவனத்திலிருந்து நிரப்பவும்',
  'account.prop-challenge.prefill.phase-link': 'PRO மூலம் விதிகளை முன்நிரப்பு',
  'account.prop-challenge.prefill.phase-link-firm':
    'PRO மூலம் {firm} விதிகளை முன்நிரப்பு',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} மேலும், PRO உடன் விதிகள் நிரப்பப்படும்',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, PRO உடன் விதிகள் நிரப்பப்படும்',
  'account.prop-challenge.prefill.match':
    'எங்களிடம் {firm} உள்ளது: {count} சவால்கள், விதிகள் தயார்',
  'account.prop-challenge.rules.empty':
    'இன்னும் விதிகள் சேர்க்கப்படவில்லை. இந்தக் கட்டத்தை வரையறுக்க விதியைச் சேர் என்பதைப் பயன்படுத்தவும்.',
  'account.prop-challenge.rules': 'விதிகள்',
  'account.prop-challenge.costs.empty': 'இன்னும் செலவுகள் சேர்க்கப்படவில்லை.',
  'account.prop-challenge.description':
    'பல-கட்ட ப்ராப் நிறுவனச் சவால் வழியாக இந்தக் கணக்கைக் கண்காணிக்கவும்.',
  'account.prop-challenge.enable': 'ப்ராப் சவால் கண்காணிப்பை இயக்கு',
  'account.prop-challenge.challenge-name': 'சவால் பெயர்',
  'account.prop-challenge.challenge-name-placeholder': 'எ.கா. 25K மதிப்பீடு',
  'account.prop-challenge.firm-name': 'நிறுவனப் பெயர் (விரும்பினால்)',
  'account.prop-challenge.firm-name-placeholder': 'எ.கா. Apex Trader Funding',
  'account.prop-challenge.profile.title': 'நிறுவனச் சுயவிவரத்தைப் பயன்படுத்து',
  'account.prop-challenge.profile.firm': 'நிறுவனம்',
  'account.prop-challenge.profile.challenge': 'சவால்',
  'account.prop-challenge.profile.apply': 'பயன்படுத்து',
  'account.prop-challenge.profile.loading': 'நிறுவனச் சுயவிவரங்களை ஏற்றுகிறது…',
  'account.prop-challenge.profile.refreshing':
    'சுயவிவரப் புதுப்பிப்புகளைச் சரிபார்க்கிறது…',
  'account.prop-challenge.profile.unavailable':
    'ஆஃப்லைனில் இருக்கும்போது நிறுவனச் சுயவிவரங்கள் கிடைக்காது.',
  'account.prop-challenge.profile.confirm-title': 'சவால் அமைப்பை மாற்றவா?',
  'account.prop-challenge.profile.confirm-message':
    'இந்தச் சுயவிவரத்தைப் பயன்படுத்துவது தற்போது கட்டமைக்கப்பட்ட கட்டங்களையும் விதிகளையும் மாற்றும்.',
  'account.prop-challenge.current-phase': 'தற்போதைய கட்டம்',
  'account.prop-challenge.phase-rules': '{phase}க்கான விதிகள்',
  'account.prop-challenge.next-phase': 'அடுத்து: {phase}',
  'account.prop-challenge.view-phase': 'கட்டத்தைக் காண்',
  'account.prop-challenge.unnamed-phase': 'பெயரிடப்படாத கட்டம்',
  'account.prop-challenge.phase-name': 'கட்டப் பெயர்',
  'account.prop-challenge.phase-type': 'கட்ட வகை',
  'account.prop-challenge.phase-type.evaluation': 'மதிப்பீடு',
  'account.prop-challenge.phase-type.verification': 'சரிபார்ப்பு',
  'account.prop-challenge.phase-type.sim_funded': 'சிம் ஃபண்டட்',
  'account.prop-challenge.phase-type.live_funded': 'நேரடி ஃபண்டட்',
  'account.prop-challenge.phase-type.custom': 'தனிப்பயன்',
  'account.prop-challenge.starting-balance': 'தொடக்க இருப்பு',
  'account.prop-challenge.broker-account-id': 'தரகர் கணக்குகள்',
  'account.prop-challenge.broker-accounts.assigned':
    '{phase}க்கு ஒதுக்கப்பட்டது',
  'account.prop-challenge.broker-accounts.trades': '{count} டிரேட்கள்',
  'account.prop-challenge.broker-accounts.trade-one': '1 டிரேட்',
  'account.prop-challenge.phase-started': 'தொடங்கியது',
  'account.prop-challenge.phase-completed': 'முடிந்தது',
  'account.prop-challenge.timeline.completed-before-started':
    '{phase}க்கு முடிந்தது தொடங்கியதற்கு சமமாகவோ அதற்குப் பிறகோ இருக்க வேண்டும்.',
  'account.prop-challenge.timeline.out-of-order':
    '{phase} {next} தொடங்குவதற்கு சமமாகவோ அதற்கு முன்னோ முடிய வேண்டும்.',
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} பிந்தைய விதி மாற்றத்திற்குப் பிறகு தொடங்குகிறது. தொடக்கத்தைப் பின்னோக்கி நகர்த்தவும்.',
  'account.prop-challenge.default-phase-name': 'கட்டம் {number}',
  'account.prop-challenge.add-phase': 'கட்டத்தைச் சேர்',
  'account.prop-challenge.remove-phase': 'கட்டத்தை அகற்று',
  'account.prop-challenge.add-rule': 'விதியைச் சேர்',
  'account.prop-challenge.rule.enabled': 'விதி இயக்கப்பட்டது',
  'account.prop-challenge.rule.amount': 'தொகை',
  'account.prop-challenge.rule.target-type': 'இலக்கு வகை',
  'account.prop-challenge.rule.credit-withdrawals':
    'திரும்பப் பெறுதல்களை இலக்கில் கணக்கிடு',
  'account.prop-challenge.rule.drawdown-mode': 'ட்ராடவுன் முறை',
  'account.prop-challenge.rule.lock-at-balance': 'இருப்பில் பூட்டு',
  'account.prop-challenge.rule.daily-loss-model': 'தினசரி நஷ்டத் தொகை',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'நிலையான தொகை',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'கணக்கு லாப வாசலில் அதிகரிக்கும்',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    'உச்ச EOD லாபத்துடன் அளவிடும்',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    'கணக்கு செயல்படுத்தும் இருப்பில் மூடும் வரை நிலையான வரம்பைப் பயன்படுத்தும். அடுத்த டிரேடிங் நாள் முதல், வரம்பு மிக உயர்ந்த நாள் முடிவு கணக்கு லாபத்தின் கட்டமைக்கப்பட்ட சதவீதமாகி ஒருபோதும் குறையாது.',
  'account.prop-challenge.rule.scale-at-balance': 'செயல்படுத்தும் இருப்பு',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    'வரம்பாகப் பயன்படுத்தப்படும் உச்ச EOD லாபம் (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    'உச்ச EOD லாபத்தின் {value}',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    'முந்தைய EOD இருப்பிலிருந்து லாப நிலைகள்',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    'முந்தைய-EOD லாப நிலைகள்',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    'லாபம்:நஷ்ட-வரம்பு இணைகளைப் பயன்படுத்தவும். முந்தைய EOD கணக்கு லாபத்திலிருந்து தேர்ந்தெடுக்கப்பட்ட நிலை அடுத்த அமர்வுக்குப் பொருந்தும்.',
  'account.prop-challenge.rule.loss-tiers':
    'லாப நிலைகள் மற்றும் நஷ்ட வரம்புகள்',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'வாழ்நாள் கணக்கு லாபம் முதல் முறையாகத் தொடக்க இருப்பின் கட்டமைக்கப்பட்ட சதவீதத்தை அடையும்போது உயர்ந்த தினசரி நஷ்டத் தொகை நிரந்தரமாகச் செயல்படும்.',
  'account.prop-challenge.rule.profit-threshold-percent':
    'கணக்கு லாப வாசல் (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'வாசலுக்குப் பிறகு தினசரி நஷ்டத் தொகை',
  'account.prop-challenge.rule.breach-action': 'மீறல் நடத்தை',
  'account.prop-challenge.rule.breach-action.hard': 'கணக்கைத் தோல்வியாக்கு',
  'account.prop-challenge.rule.breach-action.soft':
    'அடுத்த அமர்வு வரை இடைநிறுத்து',
  'account.prop-challenge.rule.days': 'டிரேடிங் நாட்கள்',
  'account.prop-challenge.rule.minimum-daily-profit':
    'நாளொன்றுக்கு குறைந்தபட்ச லாபம்',
  'account.prop-challenge.rule.minimum-daily-profit-summary':
    'நாளொன்றுக்கு {value}+',
  'account.prop-challenge.rule.best-day-percent': 'அதிகபட்ச சிறந்த நாள் (%)',
  'account.prop-challenge.rule.position-limit-model': 'போசிஷன் வரம்பு மாதிரி',
  'account.prop-challenge.rule.position-limit-model.fixed': 'நிலையான வரம்பு',
  'account.prop-challenge.rule.position-limit-model.eod-profit-tiers':
    'EOD லாப நிலைகள்',
  'account.prop-challenge.rule.position-profit-basis':
    'போசிஷன் அளவீட்டு லாப அடிப்படை',
  'account.prop-challenge.rule.position-profit-basis.cumulative':
    'ஒட்டுமொத்த டிரேட் லாபம் (பேஅவுட்கள் குறைக்காது)',
  'account.prop-challenge.rule.position-profit-basis.current-account':
    'தற்போதைய கணக்கு லாபம் (பேஅவுட்கள் குறைக்கும்)',
  'account.prop-challenge.rule.position-limit-model.eod-profit':
    'EOD லாபத்துடன் அளவிடும்',
  'account.prop-challenge.rule.position-tiers': 'லாப நிலைகள்',
  'account.prop-challenge.rule.position-tiers-help':
    'ஒவ்வொரு முடிந்த EOD லாப வாசலையும் அதன் புதிய காண்ட்ராக்ட் வரம்பையும் லாபம்:காண்ட்ராக்ட்கள் என, காற்புள்ளிகளால் பிரித்து உள்ளிடவும். ஒரு நிலை அடுத்த டிரேடிங் நாளிலிருந்து பொருந்தும்.',
  'account.prop-challenge.rule.position-scaling-help':
    'ஒவ்வொரு முடிந்த லாபப் படியும் அடுத்த டிரேடிங் நாள் முதல் ஒரு காண்ட்ராக்டைச் சேர்க்கும், அதிகபட்சம் வரை.',
  'account.prop-challenge.rule.initial-contracts': 'தொடக்க காண்ட்ராக்ட்கள்',
  'account.prop-challenge.rule.profit-per-contract':
    'கூடுதல் காண்ட்ராக்ட்டிற்கான EOD லாபம்',
  'account.prop-challenge.rule.maximum-contracts':
    'அளவீட்டுக்குப் பிறகு அதிகபட்ச காண்ட்ராக்ட்கள்',
  'account.prop-challenge.rule.max-contracts': 'அதிகபட்ச காண்ட்ராக்ட்கள்',
  'account.prop-challenge.rule.profit_target': 'லாப இலக்கு',
  'account.prop-challenge.rule.drawdown': 'ட்ராடவுன்',
  'account.prop-challenge.rule.daily_loss_limit': 'தினசரி நஷ்ட வரம்பு',
  'account.prop-challenge.rule.live_review_daily_profit':
    'நேரடி மதிப்பாய்வு தினசரி லாபம்',
  'account.prop-challenge.rule.best-profitable-day': 'லாப நாள் தூண்டுதல்',
  'account.prop-challenge.rule.daily_profit_cap': 'தினசரி லாப கிரெடிட் வரம்பு',
  'account.prop-challenge.rule.per-trading-day': 'டிரேடிங் நாளொன்றுக்கு',
  'account.prop-challenge.rule.minimum_trading_days':
    'குறைந்தபட்ச டிரேடிங் நாட்கள்',
  'account.prop-challenge.rule.minimum_profitable_days':
    'குறைந்தபட்ச லாப நாட்கள்',
  'account.prop-challenge.rule.consistency-cushion-percent':
    'நிலைத்தன்மை இடைவெளி (சதவீதப் புள்ளிகள்)',
  'account.prop-challenge.rule.consistency-cushion-short': 'இடைவெளி',
  'account.prop-challenge.rule.consistency': 'நிலைத்தன்மை',
  'account.prop-challenge.rule.max_position_size': 'அதிகபட்ச போசிஷன் அளவு',
  'account.prop-challenge.drawdown.static': 'நிலையான',
  'account.prop-challenge.drawdown.eod-trailing': 'EOD டிரெயிலிங்',
  'account.prop-challenge.drawdown.intraday-trailing': 'இன்ட்ராடே டிரெயிலிங்',
  'account.prop-challenge.summary.status.active': 'செயலில்',
  'account.prop-challenge.summary.status.passed': 'தேர்ச்சி',
  'account.prop-challenge.summary.status.failed': 'தோல்வி',
  'account.prop-challenge.summary.status.pending': 'நிலுவையில்',
  'account.prop-challenge.summary.status.warning': 'வரம்புக்கு அருகில்',
  'account.prop-challenge.summary.status.payout_ready': 'பேஅவுட் தயார்',
  'account.prop-challenge.ribbon.passed': '{phase} தேர்ச்சி',
  'account.prop-challenge.ribbon.failed': '{phase} தோல்வி',
  'account.prop-challenge.ribbon.action.advance': '{phase}க்கு முன்னேறு',
  'account.prop-challenge.ribbon.action.advance-short': 'முன்னேறு',
  'account.prop-challenge.ribbon.action.mark-passed': 'தேர்ச்சியாகக் குறி',
  'account.prop-challenge.ribbon.action.archive': 'காப்பகப்படுத்து',
  'account.prop-challenge.ribbon.action.record-payout': 'பேஅவுட்டைப் பதிவுசெய்',
  'account.prop-challenge.ribbon.action.record-payout-short': 'பேஅவுட்',
  'account.prop-challenge.summary.phase-status.pending': 'நிலுவை',
  'account.prop-challenge.summary.phase-status.active': 'செயலில்',
  'account.prop-challenge.summary.phase-status.passed': 'தேர்ச்சி',
  'account.prop-challenge.summary.phase-status.failed': 'தோல்வி',
  'account.prop-challenge.summary.rule.profit_target': 'லாப இலக்கு',
  'account.prop-challenge.summary.rule.drawdown': 'ட்ராடவுன்',
  'account.prop-challenge.summary.rule.drawdown-static': 'நிலையான ட்ராடவுன்',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': 'EOD ட்ராடவுன்',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing':
    'இன்ட்ராடே ட்ராடவுன்',
  'account.prop-challenge.summary.rule.daily_loss_limit': 'தினசரி நஷ்டம்',
  'account.prop-challenge.summary.rule.live_review_daily_profit':
    'நேரடி மதிப்பாய்வு',
  'account.prop-challenge.summary.rule.daily_profit_cap': 'தினசரி லாப கிரெடிட்',
  'account.prop-challenge.summary.rule.minimum_trading_days':
    'டிரேடிங் நாட்கள்',
  'account.prop-challenge.summary.rule.minimum_profitable_days': 'லாப நாட்கள்',
  'account.prop-challenge.summary.rule.consistency': 'சிறந்த நாள் நிலைத்தன்மை',
  'account.prop-challenge.summary.rule.max_position_size': 'போசிஷன் அளவு',
  'account.prop-challenge.summary.status.archived': 'காப்பகப்படுத்தப்பட்டது',
  'account.prop-challenge.summary.status.hidden': 'மறைக்கப்பட்டது',
  'account.prop-challenge.payout.title': 'பேஅவுட் தயார்நிலை',
  'account.prop-challenge.payout.eligible': 'பேஅவுட் தயார்',
  'account.prop-challenge.payout.available': 'இப்போது கிடைக்கிறது',
  'account.prop-challenge.payout.cycle-profit': 'சுழற்சி லாபம்',
  'account.prop-challenge.payout.history': 'பேஅவுட்கள்',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'வாழ்நாள் தகுதி நாட்கள்',
  'account.prop-challenge.payout.requirement.days': 'டிரேடிங் நாட்கள்',
  'account.prop-challenge.payout.requirement.qualifying-days': 'தகுதி நாட்கள்',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'குறைந்தபட்ச கணக்கு இருப்பு',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'நேர்மறை சுழற்சி லாபம்',
  'account.prop-challenge.payout.requirement.cycle-profit': 'சுழற்சி லாபம்',
  'account.prop-challenge.payout.requirement.consistency': 'நிலைத்தன்மை',
  'account.prop-challenge.payout.requirement.minimum': 'குறைந்தபட்ச கிடைப்பது',
  'account.prop-challenge.payout.requirement.payouts': 'பேஅவுட் அனுமதி',
  'account.prop-challenge.payout.requirement.request-window': 'கோரிக்கை சாளரம்',
  'account.prop-challenge.payout.timezone-invalid':
    'அறியப்பட்ட நேர மண்டலம் அல்ல.',
  'account.prop-challenge.payout.preview-amount': 'பேஅவுட் முன்னோட்டம்',
  'account.prop-challenge.payout.you-receive': 'டிரேடர் பங்கு',
  'account.prop-challenge.payout.balance-after': 'பிந்தைய இருப்பு',
  'account.prop-challenge.payout.drawdown-floor': 'ட்ராடவுன் தளம்',
  'account.prop-challenge.payout.buffer-after': 'மீறுவதற்கு முன் உள்ள இடம்',
  'account.prop-challenge.payout.request-not-allowed':
    'இந்தத் தொகையில் தகுதி இல்லை',
  'account.prop-challenge.payout.immediate-breach':
    'இந்தப் பேஅவுட் கணக்கை அதன் ட்ராடவுன் தளத்தில் அல்லது அதற்குக் கீழே விட்டுவிடும்.',
  'account.prop-challenge.payout.account-concludes':
    'இந்தப் பேஅவுட் கட்டமைக்கப்பட்ட சிம்-ஃபண்டட் பேஅவுட் சுழற்சியை முடிக்கும்.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'இந்தப் பேஅவுட் கணக்கை அடுத்த கட்டமைக்கப்பட்ட நிலைக்கு முன்னேற்றும்.',
  'account.prop-challenge.payout.live-review-after-payout':
    'இந்தப் பேஅவுட் கணக்கை நேரடிக் கணக்கு மதிப்பாய்வுக்குத் தகுதியாக்கும்.',
  'account.prop-challenge.payout.cycle-resets':
    'அங்கீகரிக்கப்பட்ட பேஅவுட்டுக்குப் பிறகு பேஅவுட் முன்னேற்றம் மீட்டமைக்கப்படும்.',
  'account.prop-challenge.payout.cycle-continues':
    'அங்கீகரிக்கப்பட்ட பேஅவுட்டுக்குப் பிறகு பேஅவுட் முன்னேற்றம் தொடரும்.',
  'account.prop-challenge.payout.drawdown.unchanged':
    'தற்போதைய ட்ராடவுன் தளம் அப்படியே இருக்கும்.',
  'account.prop-challenge.payout.drawdown.lock_at_balance':
    'பேஅவுட்டுக்குப் பிறகு ட்ராடவுன் தளம் பூட்டப்படும்.',
  'account.prop-challenge.payout.drawdown.reset_from_starting_balance':
    'பேஅவுட்டுக்குப் பிறகு கணக்கும் ட்ராடவுன் வரம்புகளும் மீட்டமைக்கப்படும்.',
  'account.prop-challenge.ledger.value.of': '{target}-இல் {current}',
  'account.prop-challenge.ledger.section.payout': 'பேஅவுட் தேவைகள்',
  'account.prop-challenge.ledger.requirement.minimum': 'குறைந்தபட்சம் {value}',
  'account.prop-challenge.ledger.requirement.maximum': 'அதிகபட்சம் {value}',
  'account.prop-challenge.ledger.value.ratio': '{target}-இல் {current}',
  'account.prop-challenge.payout.met-of-total': '{total}-இல் {met} தேவைகள்',
  'account.prop-challenge.ledger.value.of-today':
    'இன்று {target}-இல் {current}',
  'account.prop-challenge.ledger.value.credited-profit':
    '{actual} உண்மையான லாபத்தில் {credited} கிரெடிட்',
  'account.prop-challenge.ledger.value.used': '{used} பயன்படுத்தப்பட்டது',
  'account.prop-challenge.ledger.value.consistency-goal':
    '{target}-இல் {current} நிலைத்தன்மை இலக்கு',
  'account.prop-challenge.ledger.value.best-day-share':
    'லாபத்தின் சிறந்த நாள் {value}',
  'account.prop-challenge.ledger.value.no-profit': 'இன்னும் லாபம் இல்லை',
  'account.prop-challenge.ledger.requirement.best-day':
    'சிறந்த நாள் ≤ மொத்த லாபத்தின் {value}',
  'account.prop-challenge.ledger.state.needs-profit': 'லாபம் தேவை',
  'account.prop-challenge.ledger.tooltip.open': '{rule}ஐ விளக்கு',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    'மொத்த கட்ட லாபத்தில் எவ்வளவு ஒரே மிக லாபகரமான டிரேடிங் நாளிலிருந்து வரலாம் என்பதை வரையறுக்கிறது.',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    'சிறந்த நாள் லாபம் ÷ மொத்த கட்ட லாபம் × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    'சிறந்த நாள்: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    'மொத்த லாபம்: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 என்பது {share}',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    'நிலைத்தன்மை இலக்கு: {best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    'மற்ற நாட்களில் லாபம் சேர்க்கும்போது பங்கு குறையும், புதிய பெரிய சிறந்த நாள் இலக்கை உயர்த்தும்.',
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum} — விதிக்குள்',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    'மொத்த கட்ட லாபம் நேர்மறையானதும் கணக்கீடு தொடங்கும்.',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    'நிலைத்தன்மை இலக்குக்கு 0%-க்கு மேல் அதிகபட்சம் தேவை.',
  'account.prop-challenge.ledger.help.open': '{rule} பற்றி',
  'account.prop-challenge.ledger.help.profit_target':
    'கட்டத்தைத் தேர்ச்சிபெற கணக்கை இந்தத் தொகை வளர்க்கவும். மூடப்பட்ட டிரேட்கள் மட்டுமே கணக்கிடப்படும்.',
  'account.prop-challenge.ledger.help.profit_target.example':
    'இந்தக் கணக்குக்கு {target} லாபம் தேவை: இதுவரை {current}, இன்னும் {remaining}.',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'இலக்கு அடைந்தது: {target}-இல் {current}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    'தொடக்க இருப்பிற்குக் கீழே இருப்பு எவ்வளவு விழலாம் என்பதே அதிகபட்சம். தளம் ஒருபோதும் நகராது.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'இந்தக் கணக்கின் தளம் {floor}; இருப்பு அதற்கு மேல் இருக்க வேண்டும். {limit} வரம்பில் {buffer} மீதமுள்ளது.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    'தளம் உங்கள் மிக உயர்ந்த நாள் முடிவு இருப்பைப் பின்தொடர்ந்து மேலே மட்டுமே நகரும், நிறுவனத்தின் பூட்டு நிலையில் பூட்டும் வரை.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'இப்போது தளம் {floor} (மிக உயர்ந்த மூடல் கழித்தல் {limit}) மற்றும் ஒவ்வொரு உயர்ந்த மூடலுடனும் மேலே நகரும். {buffer} மீதமுள்ளது.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    'தளம் எந்த நேரத்திலும் உங்கள் மிக உயர்ந்த இருப்பைப் பின்தொடரும், திறந்த லாபம் உட்பட. Journalit மூடப்பட்ட டிரேட்களை மட்டுமே காணும், எனவே இந்தத் தளம் ஒவ்வொரு மூடலுக்குப் பிறகு உங்கள் சிறந்த இருப்பைப் பின்தொடரும்; திறந்த டிரேட்டுக்குள் அடைந்த உச்சம் கணக்கிடப்படாது. நிறுவனத்தின் சொந்த எண்ணைச் சரிபார்க்கவும்.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    'இப்போது தளம் {floor} (சிறந்த மூடிய-டிரேட் இருப்பு கழித்தல் {limit}). {buffer} மீதமுள்ளது; நிறுவனத்தின் நேரடி எண் இன்னும் இறுக்கமாக இருக்கலாம்.',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    'ஒரு டிரேடிங் நாளில் நீங்கள் இழக்கக்கூடிய அதிகபட்சம். அடைந்தால் கட்டம் தோல்வியடையும் அல்லது நிறுவனத்தைப் பொறுத்து அடுத்த அமர்வு வரை டிரேடிங் இடைநிறுத்தப்படும்.',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    'இன்று: {limit} தினசரி வரம்பில் {used} இழப்பு, {left} மீதமுள்ளது.',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    'ஒவ்வொரு நாள் லாபத்தின் ஒரு பகுதி மட்டுமே இலக்கிற்குக் கிரெடிட் ஆகும். வரம்புக்கு மேல் உள்ள லாபம் வைக்கப்படும் ஆனால் கணக்கிடப்படாது.',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    'ஒரு நாள் லாபத்தில் {cap} மட்டுமே கிரெடிட்; இதுவரை வரம்புக்கு மேல் ஈட்டிய {excluded} கணக்கிடப்படாது.',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'இந்த லாபத்தில் அல்லது அதற்கு மேல் உள்ள ஒரு டிரேடிங் நாள் கணக்கை நேரடிக் கணக்கு மதிப்பாய்வுக்குத் தகுதியாக்கும்.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    '{trigger} அல்லது அதற்கு மேல் உள்ள ஒரு நாள் தகுதிபெறும்; இதுவரை சிறந்த நாள் {bestDay}.',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    'குறைந்தது ஒரு மூடிய டிரேட் உள்ள நாட்கள். இலக்கை எவ்வளவு வேகமாக அடைந்தாலும், இந்த எண்ணிக்கை இல்லாமல் கட்டம் தேர்ச்சியடையாது.',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{target}-இல் {current} டிரேடிங் நாட்கள் முடிந்தன, இன்னும் {remaining}.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'நிறுவனத்தின் குறைந்தபட்ச தினசரி லாபத்தில் அல்லது அதற்கு மேல் மூடும் டிரேடிங் நாட்கள். சமநிலை அல்லது சிறிய வெற்றிகள் கணக்கிடப்படாது.',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{minimum} அல்லது அதற்கு மேல் மூடிய {target}-இல் {current} நாட்கள், இன்னும் {remaining}.',
  'account.prop-challenge.ledger.help.consistency':
    'உங்கள் சிறந்த ஒற்றை நாள் மொத்த கட்ட லாபத்தின் இந்தப் பங்கைத் தாண்டக்கூடாது. நஷ்டப்படுவதால் அல்ல, மற்ற நாட்களில் அதிகம் சம்பாதிப்பதன் மூலம் சரிசெய்யவும்.',
  'account.prop-challenge.ledger.help.consistency.example':
    'சிறந்த நாள் {bestDay} மொத்த லாபம் {total}-இல் {share}; {maximum}-இல் இருக்க மொத்த லாபம் {goal} அடைய வேண்டும்.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'சிறந்த நாள் {bestDay} மொத்த லாபத்தில் {share}, {maximum} வரம்புக்குள்.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'இன்னும் லாபம் இல்லை, எனவே ஒப்பிட சிறந்த நாள் இல்லை.',
  'account.prop-challenge.ledger.help.max_position_size':
    'அனைத்து திறந்த போசிஷன்களிலும் ஒரே நேரத்தில் நீங்கள் வைத்திருக்கக்கூடிய அதிகபட்ச காண்ட்ராக்ட்கள். சில நிறுவனங்கள் லாபம் வளரும்போது வரம்பை உயர்த்தும்.',
  'account.prop-challenge.ledger.help.max_position_size.example':
    'இப்போது ஒரே நேரத்தில் {maximum} காண்ட்ராக்ட்கள் வரை; இதுவரை மிகப்பெரிய போசிஷன் {current}.',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'தற்போதைய பேஅவுட் சுழற்சியில் டிரேடிங் நாட்கள். அங்கீகரிக்கப்பட்ட பேஅவுட்டுக்குப் பிறகு எண்ணிக்கை மீண்டும் தொடங்கும்.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    'இந்தச் சுழற்சியில் {target}-இல் {current} டிரேடிங் நாட்கள், இன்னும் {remaining}.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'நிறுவனத்தின் குறைந்தபட்ச தினசரி லாபத்தில் அல்லது அதற்கு மேல் மூடும் இந்தச் சுழற்சியின் டிரேடிங் நாட்கள்.',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    'இந்தச் சுழற்சியில் {minimum} அல்லது அதற்கு மேல் உள்ள {target}-இல் {current} நாட்கள், இன்னும் {remaining}.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'கோர முன் சுழற்சி தொடங்கியதிலிருந்து ஈட்டிய லாபம் இந்தத் தொகையை அடைய வேண்டும்.',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    'தேவையான {target}-இல் இந்தச் சுழற்சியில் {current} ஈட்டப்பட்டது.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'நீங்கள் கோரும்போது இருப்பு இந்த நிலையில் அல்லது அதற்கு மேல் இருக்க வேண்டும்.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    'இருப்பு {current}; குறைந்தது {target} இருக்க வேண்டும்.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    'முதல் பேஅவுட்டுக்குப் பிறகு, அடுத்த கோரிக்கைக்கு முன் ஒவ்வொரு புதிய சுழற்சியும் லாபத்தில் இருக்க வேண்டும்.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'சுழற்சி லாபம் {current}; பூஜ்ஜியத்திற்கு மேல் இருக்க வேண்டும்.',
  'account.prop-challenge.ledger.help.payout.consistency':
    'உங்கள் சிறந்த நாள் சுழற்சி லாபத்தின் இந்தப் பங்கைத் தாண்டக்கூடாது.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    'சிறந்த நாள் {bestDay} சுழற்சி லாபம் {total}-இல் {share}; {maximum}-இல் இருக்க சுழற்சி லாபம் {goal} அடைய வேண்டும்.',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'சிறந்த நாள் {bestDay} சுழற்சி லாபத்தில் {share}, {maximum} வரம்புக்குள்.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'இன்னும் சுழற்சி லாபம் இல்லை, எனவே ஒப்பிட சிறந்த நாள் இல்லை.',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    'நிறுவனம் ஏற்கும் மிகச் சிறிய பேஅவுட். கிடைக்கும் தொகை முதலில் அதை அடைய வேண்டும்.',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '{current} கிடைக்கிறது; நிறுவனத்தின் குறைந்தபட்ச கோரிக்கை {target}.',
  'account.prop-challenge.ledger.help.payout.payout_count':
    'இந்த நிலை எத்தனை பேஅவுட்களை அனுமதிக்கிறது. அனுமதியைப் பயன்படுத்துவது நிலையை முடிக்கும்.',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    'இந்த நிலையில் {target}-இல் {current} பேஅவுட்கள் பயன்படுத்தப்பட்டன.',
  'account.prop-challenge.ledger.help.payout.request_window':
    'கோரிக்கைகள் இந்த வார நாட்களில் மட்டுமே, நிறுவனத்தின் நேர மண்டலத்தில் ஏற்கப்படும்.',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    'இன்று {today}; கோரிக்கைகள் {days} ({timeZone}) அன்று திறக்கும்.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'கோர முன் சுழற்சியின் முதல் டிரேட்டிலிருந்து நேரம் இதை அடைய வேண்டும்.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    'சுழற்சியின் முதல் டிரேட்டிலிருந்து {target}-இல் {current} மணிநேரம்.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'இந்தச் சுழற்சி மட்டுமல்ல, முழு ஃபண்டட் கட்டம் முழுவதும் தகுதி நாட்கள். அடைந்ததும் பேஅவுட்கள் திறக்கும்.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    'முழுக் கட்டம் முழுவதும் {target}-இல் {current} தகுதி நாட்கள்.',
  'account.prop-challenge.ledger.requirement.target': '{value} இலக்கு',
  'account.prop-challenge.ledger.requirement.buffer': '{value} இடம்',
  'account.prop-challenge.ledger.requirement.max': '{value} அதிகபட்சம்',
  'account.prop-challenge.ledger.requirement.daily-cap':
    'டிரேடிங் நாளொன்றுக்கு {value} கிரெடிட்',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{profit}+ இல் {days} நாட்கள்',
  'account.prop-challenge.ledger.requirement.days': '{value} நாட்கள்',
  'account.prop-challenge.ledger.requirement.at-most': '≤ {value} வரை',
  'account.prop-challenge.ledger.state.not-started': 'தொடங்கவில்லை',
  'account.prop-challenge.ledger.state.in-progress': 'செயல்பாட்டில் உள்ளது',
  'account.prop-challenge.ledger.state.reached': 'அடைந்தது',
  'account.prop-challenge.ledger.state.met': 'நிறைவு',
  'account.prop-challenge.ledger.state.eligible': 'தகுதியானது',
  'account.prop-challenge.ledger.state.safe': 'பாதுகாப்பானது',
  'account.prop-challenge.ledger.state.clear': 'தெளிவு',
  'account.prop-challenge.ledger.state.within-rule': 'விதிக்குள்',
  'account.prop-challenge.ledger.state.near-limit': 'வரம்புக்கு அருகில்',
  'account.prop-challenge.ledger.state.limit-reached': 'வரம்பு அடைந்தது',
  'account.prop-challenge.ledger.state.cap-applied':
    'வரம்பு பயன்படுத்தப்பட்டது',
  'account.prop-challenge.ledger.state.within-cap': 'வரம்புக்குள்',
  'account.prop-challenge.ledger.state.breached': 'மீறப்பட்டது',
  'account.prop-challenge.actions.progress-to': '{phase}க்கு முன்னேறு',
  'account.prop-challenge.actions.progress': 'அடுத்த கட்டத்திற்கு முன்னேறு',
  'account.prop-challenge.actions.mark-passed': 'சவாலைத் தேர்ச்சியாகக் குறி',
  'account.prop-challenge.actions.mark-failed': 'தோல்வியாகக் குறி',
  'account.prop-challenge.actions.archive': 'சவாலைக் காப்பகப்படுத்து',
  'account.prop-challenge.actions.stale':
    'இந்தச் சவால் வேறு இடத்தில் புதுப்பிக்கப்பட்டது. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  'account.prop-challenge.actions.reopen': 'மீண்டும் திற',
  'account.prop-challenge.view-trades': '{phase}க்கான டிரேட்களைக் காண்',
  'account.prop-challenge.actions.manual': 'கைமுறை செயல்கள்',
  'account.prop-challenge.notice.failed-title': '{phase} தோல்வி',
  'account.prop-challenge.notice.failed-description':
    '{date} அன்று {rule} மீறப்பட்டது',
  'account.prop-challenge.notice.failed-manual': 'தோல்வியாகக் குறிக்கப்பட்டது',
  'account.prop-challenge.notice.keep-open': 'திறந்து வைத்திரு',
  'account.prop-challenge.notice.target-title': '{phase} இலக்கு அடைந்தது',
  'account.prop-challenge.notice.target-description':
    'அனைத்துத் தேர்ச்சித் தேவைகளும் நிறைவு. {next}க்கு நகர தயாரா?',
  'account.prop-challenge.notice.breach-after-reached':
    'இலக்கு {time} அன்று அடைந்த பிறகு விதிகள் மீறப்பட்டன. அந்த டிரேட்களை இந்தக் கட்டத்திற்கு வெளியே வைத்திருக்க மாற்ற நேரத்தை அமைக்கவும்.',
  'account.prop-challenge.notice.not-yet': 'இன்னும் இல்லை',
  'account.prop-challenge.notice.passed-title': 'மதிப்பீடு தேர்ச்சி',
  'account.prop-challenge.notice.passed-description':
    'அனைத்துத் தேவைகளும் நிறைவு. சவாலைத் தேர்ச்சியாகக் குறிக்கவா?',
  'account.prop-challenge.notice.payout-title': 'பேஅவுட் கிடைக்கிறது: {amount}',
  'account.prop-challenge.notice.payout-plan':
    'உங்கள் திட்டம்: {amount} திரும்பப் பெறு',
  'account.prop-challenge.notice.record-payout': 'பேஅவுட்டைப் பதிவுசெய்',
  'account.prop-challenge.notice.skip-cycle': 'இந்தச் சுழற்சியைத் தவிர்',
  'account.prop-challenge.notice.payout-description': 'பேஅவுட்',
  'account.prop-challenge.notice.lost-title': 'பேஅவுட் இனி கிடைக்காது',
  'account.prop-challenge.notice.lost-description':
    'நிறைவேறாதவை: {requirements}',
  'account.prop-challenge.notice.dismiss': 'நிராகரி',
  'account.prop-challenge.notice.unknown-title': 'புதிய கணக்கு {label}',
  'account.prop-challenge.notice.unknown-description':
    '{date} முதல் {count} டிரேட்கள் ஒரு கட்டத்திற்கு ஒதுக்கப்படவில்லை.',
  'account.prop-challenge.notice.unknown-description-one':
    '{date} முதல் 1 டிரேட் ஒரு கட்டத்திற்கு ஒதுக்கப்படவில்லை.',
  'account.prop-challenge.notice.same-phase': 'அதே கட்டம்',
  'account.prop-challenge.notice.not-now': 'இப்போது இல்லை',
  'account.prop-challenge.notice.error': 'அறிவிப்பைப் புதுப்பிக்க முடியவில்லை.',
  'account.prop-challenge.notice.type-changed':
    'கணக்கு வகை {accountType} ஆக அமைக்கப்பட்டது',
  'account.prop-challenge.payout.plan.title': 'பேஅவுட் திட்டம்',
  'account.prop-challenge.payout.plan.notify-minimum':
    'குறைந்தது ({currency}) இருக்கும்போது அறிவி',
  'account.prop-challenge.payout.plan.withdrawal':
    'பரிந்துரைக்கப்பட்ட திரும்பப் பெறுதல்',
  'account.prop-challenge.payout.plan.full': 'முழுத் தொகை',
  'account.prop-challenge.payout.plan.percent': 'கிடைப்பதில் சதவீதம்',
  'account.prop-challenge.payout.plan.amount': 'நிலையான தொகை',
  'account.prop-challenge.payout.plan.percent-invalid':
    '1 முதல் 100 வரையிலான சதவீதத்தை உள்ளிடவும்.',
  'account.prop-challenge.payout.plan.amount-invalid':
    'பூஜ்ஜியத்தை விட அதிகமான தொகையை உள்ளிடவும்.',
  'account.prop-challenge.payout.plan.percent-value': 'சதவீதம்',
  'account.prop-challenge.payout.plan.amount-value': 'தொகை ({currency})',
  'account.prop-challenge.payout.plan.save': 'திட்டத்தைச் சேமி',
  'account.prop-challenge.payout.plan.saved':
    'பேஅவுட் திட்டம் சேமிக்கப்பட்டது.',
  'account.prop-challenge.payout.plan.summary-notify': 'அறிவிப்பு ≥ {amount}',
  'account.prop-challenge.payout.plan.summary-percent': '{percent}% பரிந்துரை',
  'account.prop-challenge.payout.plan.summary-amount': '{amount} பரிந்துரை',
  'account.prop-challenge.payout.plan.summary-full': 'முழுத் தொகை',
  'account.prop-challenge.actions.error':
    'ப்ராப் சவாலைப் புதுப்பிக்க முடியவில்லை.',
  'account.prop-challenge.confirm.advance':
    'இந்தக் கட்ட முடிவை உறுதிப்படுத்தி சவாலைத் தொடரவா?',
  'account.prop-challenge.confirm.advance-with-promotion':
    'இது சவாலை முன்னேற்றி கணக்கு வகையை {accountType} ஆக மாற்றும்.',
  'account.prop-challenge.confirm.fail':
    '{account}ஐத் தோல்வியாகக் குறிக்கவா? “{challenge}” சவால் {phase}-இல் முடியும்.',
  'account.prop-challenge.confirm.archive-failed':
    '{account}ஐக் காப்பகப்படுத்தவா? “{challenge}” சவால் தோல்வியடைந்தது. கணக்கு காப்பகத்திற்கு நகரும்.',
  'account.prop-challenge.confirm.archive-passed':
    '{account}ஐக் காப்பகப்படுத்தவா? “{challenge}” சவால் தேர்ச்சியடைந்தது. கணக்கு காப்பகத்திற்கு நகரும்.',
  'account.prop-challenge.transition.route':
    '{account} · {from} இருந்து → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → சவால் தேர்ச்சி',
  'account.prop-challenge.confirm.reopen':
    '{account}ஐ மீண்டும் திறக்கவா? “{challenge}” சவால் {phase}க்குத் திரும்பும்.',
  'account.prop-challenge.transition.time': 'மாற்ற நேரம்',
  'account.prop-challenge.transition.now': 'இப்போது',
  'account.prop-challenge.transition.when-target-reached': 'இலக்கு அடைந்தபோது',
  'account.prop-challenge.transition.too-early':
    'மாற்ற நேரம் இந்தக் கட்டம் தொடங்குவதற்கு முன் இருக்க முடியாது.',
  'account.prop-challenge.costs.title': 'ஒருமுறை செலவுகள்',
  'account.prop-challenge.costs.description':
    'வாங்கல், மீட்டமைப்பு மற்றும் செயல்படுத்தல் கட்டணங்களைத் தனித்தனியாகக் கண்காணிக்கவும்.',
  'account.prop-challenge.costs.kind': 'வகை',
  'account.prop-challenge.costs.kind.purchase': 'வாங்கல்',
  'account.prop-challenge.costs.kind.reset': 'மீட்டமைப்பு',
  'account.prop-challenge.costs.kind.activation': 'செயல்படுத்தல்',
  'account.prop-challenge.costs.kind.other': 'மற்றவை',
  'account.prop-challenge.costs.date': 'தேதி',
  'account.prop-challenge.costs.amount': 'தொகை',
  'account.prop-challenge.costs.note': 'குறிப்பு (விரும்பினால்)',
  'account.prop-challenge.costs.add': 'செலவைச் சேர்',
  'account.header.copies': 'நகலெடுக்கிறது',
  'account.header.copied-by-more': '+{count} மேலும்',
  'account.header.created': 'உருவாக்கப்பட்டது:',
  'account.summary.current-balance': 'தற்போதைய இருப்பு',
  'account.summary.net-cash-flow': 'நிகர பண ஓட்டம்',
  'account.summary.payouts': 'பேஅவுட்கள்',
  'account.performance.title': 'செயல்திறன்',
  'account-page.guide.whats-new.cockpit.intro.title':
    'கணக்குப் பக்கத்தில் புதியது',
  'account-page.guide.whats-new.cockpit.intro.description':
    'இருப்பு விளக்கப்படம் இப்போது கணக்குப் பகுப்பாய்வை வழிநடத்துகிறது. அதைத் தொடர்ந்து ஒரே இணைந்த அளவீட்டுப் பலகம் உள்ளது, ப்ராப் சவால் விதிகள் நேரடியாகக் கீழே.',
  'account-page.guide.whats-new.cockpit.cockpit.title':
    'சவால் விதிகள் கணக்கு செயல்திறனைப் பின்தொடரும்',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    'ப்ராப் கணக்குகளுக்கு, ஒவ்வொரு தேவையையும் அதன் முன்னேற்றத்தையும் பார்க்க அளவீட்டுப் பலகத்திற்குக் கீழே உள்ள விதி தலைப்பிலிருந்து ஒரு கட்டத்தைத் தேர்வுசெய்யவும். வாழ்க்கைச் சுழற்சி செயல்கள் அதன் அருகில் உள்ள மெனுவில் இருக்கும்.',
  'account-page.guide.whats-new.cockpit.payout.title':
    'ஃபண்டட் பேஅவுட் எப்போது பாதுகாப்பானது என அறியுங்கள்',
  'account-page.guide.whats-new.cockpit.payout.description':
    'சரிபார்க்கப்பட்ட விதிகளுள்ள ஃபண்டட் கணக்குகள் இப்போது பேஅவுட் தேவைகள், கிடைக்கும் தொகை, பணம் கோரும் முன் இருப்பு மற்றும் ட்ராடவுன் விளைவுகளின் முன்னோட்டத்தைக் காட்டும்.',
  'account-page.guide.whats-new.cockpit.summary.title':
    'ஒரே இணைந்த அளவீட்டுப் பலகம்',
  'account-page.guide.whats-new.cockpit.summary.description':
    'கணக்கு நிலையும் விரிவான செயல்திறனும் இப்போது விளக்கப்படத்திற்குக் கீழே ஒரே மேற்பரப்பைப் பகிர்கின்றன: இருப்பு, நிகர P&L மற்றும் பண ஓட்டம் முதலில் வரும், மீதமுள்ள அளவீடுகள் அதே கட்டத்தில் தொடரும்.',
  'account-page.guide.whats-new.cockpit.risk.title':
    'ஒரே அதிகாரப்பூர்வ இடர் மூலம்',
  'account-page.guide.whats-new.cockpit.risk.description':
    'சவால் செயலில், தேர்ச்சி அல்லது தோல்வியில் இருக்கும்போது, அதன் கட்ட விதிகளே காட்டப்படும் ஒரே இடர், எனவே இரண்டாவது ட்ராடவுன் எண் அவற்றை முரண்படாது. வழக்கமான அல்லது காப்பகக் கணக்குகளுக்கு பொதுவான கணக்கு இடர் திரும்பும்.',
  'account-page.guide.main.challenge.title': 'ஒரே பார்வையில் உங்கள் சவால்',
  'account-page.guide.main.challenge.description':
    'இணைந்த அளவீட்டுப் பலகத்திற்குக் கீழே, விதி தலைப்பிலிருந்து ஒரு சவால் கட்டத்தைத் தேர்வுசெய்து ஒவ்வொரு தேவையையும் அதன் முன்னேற்றம் மற்றும் நிலையுடன் பார்க்கவும். வாழ்க்கைச் சுழற்சி செயல்கள் தேர்வின் அருகில் இருக்கும்.',
  'account-page.guide.main.payout.title': 'ஃபண்டட் பேஅவுட்களைத் திட்டமிடுங்கள்',
  'account-page.guide.main.payout.description':
    'ஃபண்டட் கட்டத்திற்குச் சரிபார்க்கப்பட்ட பேஅவுட் விதிகள் இருக்கும்போது, இந்தப் பலகம் தகுதியைக் கண்காணித்து கோரப்பட்ட தொகையின் கணக்கு தாக்கத்தை முன்னோட்டமிடும்.',
  'account-page.guide.main.summary.title': 'ஒரே பார்வையில் கணக்கு நிலை',
  'account-page.guide.main.summary.description':
    'இணைந்த அளவீட்டுப் பலகம் இருப்பு, நிகர P&L, வளர்ச்சி, டிரேட்கள், வெற்றி விகிதம் மற்றும் நிகர பண ஓட்டத்துடன் தொடங்கும் — அல்லது ப்ராப் கணக்கிற்குப் பேஅவுட்கள்.',
  'account.transaction.edit-row-label':
    'இந்தப் பரிவர்த்தனையைத் திருத்து அல்லது நீக்கு: {date}, {amount}',
  'account.deposits-withdrawals.summary':
    '{deposits} வைப்பு · {withdrawn} திரும்பப் பெறப்பட்டது · கடைசி {date}',
  'account.payouts.title': 'பேஅவுட்கள்',
  'account.payouts.summary': '{count} பேஅவுட்கள் · {total} · கடைசி {date}',
  'account.payouts.summary-masked':
    'மதிப்புகள் மறைக்கப்பட்டுள்ளவரை பணப்பட்டுவாடா வரலாறு மறைக்கப்படும்',
  'account.payouts.summary-one': '1 பேஅவுட் · {total} · கடைசி {date}',
  'account.payouts.empty': 'இன்னும் பேஅவுட்கள் இல்லை',
  'account.payouts.empty-sub':
    'தலைப்பில் உள்ள + பொத்தானால் பேஅவுட்டைப் பதிவுசெய்யவும்.',
  'account.ledger.column.date': 'தேதி',
  'account.ledger.column.type': 'வகை',
  'account.ledger.column.payout': 'பேஅவுட்',
  'account.ledger.column.description': 'விளக்கம்',
  'account.ledger.column.amount': 'தொகை',
  'account.ledger.column.balance-after': 'பிந்தைய இருப்பு',
  'home.widget.eval-roi.title': 'மதிப்பீட்டு வருவாய்',
  'home.widget.eval-roi.unable-to-load': 'ஏற்ற முடியவில்லை',
  'home.widget.eval-roi.no-challenges': 'ப்ராப் சவால்கள் இல்லை',
  'home.widget.eval-roi.challenge-count': '{count} மதிப்பீடு',
  'home.widget.eval-roi.challenge-count-plural': '{count} மதிப்பீடுகள்',
  'home.widget.eval-roi.net': 'நிகர',
  'home.widget.eval-roi.spent': 'செலவழித்தது',
  'home.widget.eval-roi.payouts': 'பேஅவுட்கள்',
  'home.widget.eval-roi.break-even': 'சமநிலை',
  'home.widget.challenge-alerts.title': 'சவால் எச்சரிக்கைகள்',
  'home.widget.challenge-alerts.unable-to-load':
    'சவால் எச்சரிக்கைகளைச் சரிபார்க்க முடியவில்லை',
  'home.widget.challenge-alerts.empty': 'சவால் எச்சரிக்கைகள் இல்லை',
  'home.widget.challenge-alerts.count': '{count} எச்சரிக்கை',
  'home.widget.challenge-alerts.count-plural': '{count} எச்சரிக்கைகள்',
  'home.widget.challenge-alerts.more': '+{count} மேலும்',
  'home.widget.challenge-alerts.kind.failed': 'தோல்வி',
  'home.widget.challenge-alerts.kind.target': 'இலக்கு அடைந்தது',
  'home.widget.challenge-alerts.kind.passed': 'தேர்ச்சி',
  'home.widget.challenge-alerts.kind.payout': 'பேஅவுட் தயார்',
  'home.widget.challenge-alerts.kind.lost': 'பேஅவுட் இனி கிடைக்காது',
  'home.widget.challenge-alerts.kind.unknown-account': 'புதிய கணக்கு {label}',
  'home.widget.eval-roi.roi-aria': 'மதிப்பீட்டு செலவின் வருவாய்',
  'account.prop-challenge.stage': 'நிலை வகை',
  'account.prop-challenge.stage.evaluation': 'மதிப்பீடு',
  'account.prop-challenge.stage.sim-funded': 'சிம் ஃபண்டட்',
  'account.prop-challenge.stage.live-funded': 'நேரடி ஃபண்டட்',
  'account.prop-challenge.payout-rules.title': 'பேஅவுட் விதிகள்',
  'account.prop-challenge.payout-rules.add': 'பேஅவுட் விதிகளைச் சேர்',
  'account.prop-challenge.payout-rules.remove': 'பேஅவுட் விதிகளை அகற்று',
  'account.prop-challenge.payout-rules.cycle': 'தகுதி சுழற்சி',
  'account.prop-challenge.payout-rules.request-window': 'கோரிக்கை நேரம்',
  'account.prop-challenge.payout-rules.request-window.anytime': 'எந்த நாளிலும்',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'குறிப்பிட்ட வார நாட்கள்',
  'account.prop-challenge.payout-rules.request-window.time-zone': 'நேர மண்டலம்',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'அனுமதிக்கப்பட்ட கோரிக்கை நாட்கள்',
  'account.prop-challenge.payout-rules.cycle.none':
    'காத்திருப்பு சுழற்சி இல்லை',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'டிரேடிங் நாட்கள்',
  'account.prop-challenge.payout-rules.cycle.qualifying-days': 'தகுதி நாட்கள்',
  'account.prop-challenge.payout-rules.cycle.calendar-days':
    'நாட்காட்டி நாட்கள்',
  'account.prop-challenge.payout-rules.days': 'தேவையான நாட்கள்',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'குறைந்தபட்ச தினசரி லாபம்',
  'account.prop-challenge.payout-rules.anchor': 'சுழற்சி தொடங்கும் இடம்',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'நிலை தொடக்கம்',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'முதல் டிரேட்',
  'account.prop-challenge.payout-rules.minimum-balance':
    'குறைந்தபட்ச கணக்கு இருப்பு',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'குறைந்தபட்ச சுழற்சி லாபம்',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'பேஅவுட் எண் வாரியாக குறைந்தபட்ச சுழற்சி லாபம்',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'முதல் பேஅவுட்டுக்குப் பிறகு நேர்மறை சுழற்சி லாபம் தேவை',
  'account.prop-challenge.payout-rules.consistency-percent':
    'அதிகபட்ச சிறந்த நாள் பங்கு (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'பேஅவுட் எண் வாரியாக அதிகபட்ச சிறந்த நாள் பங்கு (%)',
  'account.prop-challenge.payout-rules.availability': 'கிடைக்கும் லாபம்',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'தொடக்க இருப்பிற்கு மேல்',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'இருப்புத் தளத்திற்கு மேல்',
  'account.prop-challenge.payout-rules.balance-floor': 'இருப்புத் தளம்',
  'account.prop-challenge.payout-rules.request-percent':
    'திரும்பப் பெறக்கூடிய பங்கு (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'ஒவ்வொரு கோரிக்கையிலிருந்தும் தேவைப்படும் புதிய லாபம் (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'தற்போதைய பேஅவுட் சுழற்சியில் ஈட்டிய லாபத்தால் கட்டமைக்கப்பட்ட சதவீதம் ஆதரிக்கப்படும்படி கோரிக்கையை வரையறுக்கிறது. எடுத்துக்காட்டாக, 50% தற்போதைய சுழற்சி லாபத்தின் இரு மடங்கு வரை கோரிக்கையை அனுமதிக்கும்.',
  'account.prop-challenge.payout-rules.minimum-request': 'குறைந்தபட்ச கோரிக்கை',
  'account.prop-challenge.payout-rules.maximum': 'அதிகபட்ச கோரிக்கை',
  'account.prop-challenge.payout-rules.maximum.none': 'அதிகபட்சம் இல்லை',
  'account.prop-challenge.payout-rules.maximum.fixed': 'நிலையான அதிகபட்சம்',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'முதல் பேஅவுட் அதிகபட்சம் மட்டும்',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'பேஅவுட் எண் வாரியாக அதிகபட்சம்',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'சுழற்சி லாபத்தின் சதவீதம்',
  'account.prop-challenge.payout-rules.maximum-amount': 'அதிகபட்ச தொகை',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'முதல் பேஅவுட் அதிகபட்சம்',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'அதிகபட்ச சுழற்சி லாபம் (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'பிந்தைய பேஅவுட்களுக்கும் இறுதித் தொகையையே பயன்படுத்து',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'பிந்தைய பேஅவுட்களுக்கும் இறுதி மதிப்பையே பயன்படுத்து',
  'account.prop-challenge.payout-rules.schedule': 'பேஅவுட் எண் வாரியான தொகைகள்',
  'account.prop-challenge.payout-rules.profit-split': 'டிரேடர் லாபப் பங்கு (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'வாழ்நாள் தகுதி நாட்களுக்குப் பிறகு வரம்புகளை மாற்று',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    'பேஅவுட் சுழற்சிகள் மீட்டமைக்கப்பட்டாலும் முழு ஃபண்டட் கட்டம் முழுவதும் தகுதி நாட்களை எண்ணும்.',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'தேவைப்படும் வாழ்நாள் தகுதி நாட்கள்',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'திறந்த பிறகு கிடைப்பது',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'திறந்த பிறகு இருப்புத் தளம்',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'திறந்த பிறகு கிடைக்கும் லாபம் (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'திறந்த பிறகு அதிகபட்ச கோரிக்கை',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'திறந்த பிறகு அதிகபட்ச தொகை',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'திறந்த பிறகு அதிகபட்ச அட்டவணை',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'திறந்த பிறகு அதிகபட்ச சுழற்சி-லாப சதவீதம்',
  'account.prop-challenge.payout-rules.profit-split-model':
    'லாபப் பகிர்வு மாதிரி',
  'account.prop-challenge.payout-rules.profit-split.fixed': 'நிலையான சதவீதம்',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    'ஒட்டுமொத்த பேஅவுட்களுக்குப் பிறகு மாறும்',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'கணக்கு லாபத்தால் மாறும்',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'தொடக்க டிரேடர் பங்கு (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'ஒட்டுமொத்த பேஅவுட் வாசல்',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'வாசலுக்குப் பிறகு டிரேடர் பங்கு (%)',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'வாழ்நாள் கணக்கு லாபம் என்பது தற்போதைய இருப்பு கழித்தல் தொடக்க இருப்பு கூட்டல் முந்தைய திரும்பப் பெறுதல்கள். கீழ் அல்லது சமம்/மேல் சதவீதம் முழுக் கோரிக்கைக்கும் பொருந்தும்.',
  'account.prop-challenge.payout-rules.profit-split.below':
    'வாசலுக்குக் கீழ் டிரேடர் பங்கு (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'கணக்கு லாப வாசல்',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'வாசலில் அல்லது அதற்கு மேல் டிரேடர் பங்கு (%)',
  'account.prop-challenge.payout-rules.maximum-payouts': 'அதிகபட்ச பேஅவுட்கள்',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'இறுதிப் பேஅவுட்டுக்குப் பிறகு',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'கணக்கைத் தொடர்',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'கணக்கை முடி',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'அடுத்த நிலைக்கு முன்னேறு',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'நேரடி மதிப்பாய்வுக்குத் தகுதி',
  'account.prop-challenge.payout-rules.aftermath':
    'அங்கீகரிக்கப்பட்ட பேஅவுட்டுக்குப் பிறகு',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'பேஅவுட்டைக் கழி; ட்ராடவுன் தளத்தை வைத்திரு',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'பேஅவுட்டைக் கழி; ட்ராடவுன் தளத்தைப் பூட்டு',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'கணக்கையும் ட்ராடவுனையும் மீட்டமை',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'பேஅவுட்டுக்குப் பிறகு ட்ராடவுன் தளம்',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'முதல் பேஅவுட் குறைந்தபட்ச சுழற்சி லாபத்தைப் புறக்கணிக்கும்',
  'account.prop-challenge.payout-rules.reset-cycle':
    'பேஅவுட்டுக்குப் பிறகு தகுதி சுழற்சியை மீட்டமை',
  'account.prop-challenge.payout-rules.group.eligibility': 'தகுதி',
  'account.prop-challenge.payout-rules.group.availability':
    'கிடைக்கும் பேஅவுட்',
  'account.prop-challenge.payout-rules.group.terms': 'பேஅவுட் நிபந்தனைகள்',
  'account.prop-challenge.payout-rules.group.aftermath':
    'பேஅவுட்டுக்குப் பிறகு',
  'account.prop-challenge.payout.requirement.elapsed-hours': 'கடந்த நேரம்',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'குறைந்தபட்ச கடந்த மணிநேரம்',
  'account.merge.challenge.move-earlier': '{account}ஐ முன்னதாக நகர்த்து',
  'account.merge.challenge.move-later': '{account}ஐ பின்னதாக நகர்த்து',
  'account.merge.warning.use-profile-balance': 'சுயவிவர இருப்பைப் பயன்படுத்து',
  'account.merge.warning.edit-phases': 'கட்டங்களைத் திருத்து',
  'account.merge.title': 'சவால் அமைப்பு',
  'account.merge.loading': 'ஏற்றுகிறது...',
  'account.merge.step.accounts': 'கணக்குகள்',
  'account.merge.step.phases': 'கட்டங்கள்',
  'account.merge.step.review': 'மதிப்பாய்வு',
  'account.merge.accounts.title': 'இணைக்க வேண்டிய கணக்குகள்',
  'account.merge.accounts.show-archived': 'காப்பகப்படுத்தியவற்றைக் காட்டு',
  'account.merge.accounts.empty': 'தகுதியான கணக்குகள் இல்லை',
  'account.merge.target.title': 'இலக்கு கணக்கு',
  'account.merge.target.keep': 'வைத்திரு',
  'account.merge.target.new': 'புதிய பெயர்',
  'account.merge.phase.name': 'கட்டம்',
  'account.merge.phase.status': 'நிலை',
  'account.merge.phase.started': 'தொடங்கியது',
  'account.merge.phase.completed': 'முடிந்தது',
  'account.merge.phase.no-rules': 'இல்லை',
  'account.merge.review.notes': 'டிரேட்கள் நகர்த்தப்பட்டன',
  'account.merge.review.identities': 'தரகர் கணக்குகள்',
  'account.merge.warning.trade-outside-window':
    'கட்ட சாளரத்திற்கு வெளியே உள்ள டிரேட்கள்',
  'account.merge.warning.identity-shared': 'பல கணக்குகள் உரிமை கோரும் அடையாளம்',
  'account.merge.warning.copy-trading-dropped':
    'நகல் டிரேடிங் காலங்கள் விடப்பட்டன',
  'account.merge.error.too-few-sources':
    'குறைந்தது இரண்டு கணக்குகளைத் தேர்ந்தெடுக்கவும்.',
  'account.merge.error.duplicate-source':
    'ஒரு கணக்கு இருமுறை பட்டியலிடப்பட்டுள்ளது.',
  'account.merge.error.target-exists': 'அந்தப் பெயர் வேறு கணக்கிற்கு உரியது.',
  'account.merge.error.currency-mismatch':
    'கணக்குகள் வெவ்வேறு நாணயங்களைப் பயன்படுத்துகின்றன.',
  'account.merge.error.timeline-not-monotonic':
    'கட்டத் தொடக்க நேரங்கள் அதிகரிக்க வேண்டும்.',
  'account.merge.error.invalid-override':
    'இந்தக் கட்டத்தின் தேதிகளைச் சரிபார்க்கவும்.',
  'account.merge.error.source-missing':
    'ஒரு கணக்கிற்குச் சேமித்த அமைப்புகள் இல்லை.',
  'account.merge.error.unknown': 'இணைப்பு தோல்வி.',
  'account.merge.action.merge': 'இணை',
  'account.merge.action.undo': 'செயல்தவிர்',
  'account.merge.action.delete': 'பழைய கணக்குகளை நீக்கு',
  'account.merge.notice.converted': 'சவாலாக மாற்றப்பட்டது',
  'account.merge.notice.title': '{accounts} இலிருந்து இணைக்கப்பட்டது',
  'account.merge.notice.error': 'செயல் தோல்வி.',
  'account.merge.undo.title': 'இணைப்பைச் செயல்தவிர்',
  'account.merge.undo.message':
    'பழைய கணக்குகளையும் அவற்றின் டிரேட்களையும் மீட்டெடுக்கும்.',
  'account.merge.delete.title': 'பழைய கணக்குகளை நீக்கு',
  'account.merge.delete.message':
    'காப்பகப்படுத்தப்பட்ட பழைய கணக்குகளை நீக்கும். இதைச் செயல்தவிர்க்க முடியாது.',
  'command.open-legacy-challenge-onboarding': 'ப்ராப் சவால்களை அமை',
  'account.merge.step.challenge': 'சவால்',
  'account.merge.action.convert': 'மாற்று',
  'account.merge.profile.applied': 'பயன்படுத்தப்பட்டது: {firm} · {challenge}',
  'account.merge.profile.remove': 'நீக்கு',
  'account.merge.phase.apply-profile': 'நிறுவன சுயவிவரத்தைப் பயன்படுத்து',
  'account.merge.profile.replace-rules.title':
    'கையால் உள்ளிட்ட விதிகளை மாற்றவா?',
  'account.merge.profile.replace-rules.body':
    '{firm} சுயவிவரம் ஒவ்வொரு கட்டத்தின் விதிகளையும் வரையறுக்கிறது. இந்தப் பக்கத்தில் நீங்கள் உள்ளிட்ட விதிகள் மாற்றப்படும்.',
  'account.merge.profile.replace-rules.confirm': 'விதிகளை மாற்று',
  'guide.legacy-setup.list.title':
    'சவால் இல்லாத ஒவ்வொரு கணக்கும் இங்கே பட்டியலிடப்பட்டுள்ளது',
  'guide.legacy-setup.list.description':
    'ஒவ்வொரு கணக்கிற்கும் முடிவு செய்யுங்கள். “அப்படியே விடு” அதை அப்படியே வைத்திருக்கும்; பின்னர் எப்போதும் டாஷ்போர்டு அமைப்புகளில் இருந்து அமைக்கலாம்.',
  'guide.legacy-setup.assign.title':
    'ஒரே சவாலின் கட்டங்களை ஒன்றாகக் குழுவாக்குங்கள்',
  'guide.legacy-setup.assign.description':
    'ஒரே சவாலின் கட்டங்களாக இருந்த கணக்குகள் ஒரே குழுவில் செல்லும் (பொருந்தும் பெயர்களிலிருந்து குழுக்களைப் பரிந்துரைக்கிறோம்). தனியாக உள்ள கணக்கு ஒரு-கட்ட சவாலாகிறது.',
  'guide.legacy-setup.continue.title': 'ஒவ்வொரு சவாலுக்கும் ஒரு குறுகிய அமைவு',
  'guide.legacy-setup.continue.description':
    'தொடர்க ஒவ்வொரு குழுவிற்கும் வரிசையாக சவால் அமைவைத் திறக்கிறது. ஒவ்வொன்றையும் நீங்கள் உறுதிப்படுத்தும் வரை எதுவும் மாறாது.',
  'guide.merge-wizard.target.title': 'ஒரு கணக்கு வரலாற்றை வைத்திருக்கும்',
  'guide.merge-wizard.target.description':
    'இலக்குக் கணக்கு எல்லா கட்டங்களுடனும் நீடிக்கும். மற்றவை காப்பகப்படுத்தப்படும், நீக்கப்படாது; அவற்றின் வர்த்தகங்கள் இலக்குக் கணக்கிற்கு நகரும்.',
  'guide.merge-wizard.identity.title':
    'நிறுவனத்திற்கும் சவாலுக்கும் பெயரிடுங்கள்',
  'guide.merge-wizard.identity.description':
    'நிறுவன சுயவிவரத்தைப் பயன்படுத்தினால் உண்மையான விதிகளும் நிதியளிக்கப்பட்ட கட்டமும் நிரப்பப்படும். சுயவிவரம் இல்லாமல், கணக்குப் பக்கத்தில் நீங்கள் சேர்க்கும் வரை கட்டங்களுக்கு விதிகள் இருக்காது.',
  'guide.merge-wizard.phases.title': 'ஒவ்வொரு கட்டத்தையும் சரிபாருங்கள்',
  'guide.merge-wizard.phases.description':
    'நிலை வகையை அமைத்து, முடித்த கட்டங்களை தேர்ச்சி என்றும் தற்போதையதை செயலில் என்றும் குறித்து, தேதிகளை உறுதிப்படுத்துங்கள்.',
  'guide.merge-wizard.review.title':
    'நீங்கள் உறுதிப்படுத்தும் வரை எதுவும் நடக்காது',
  'guide.merge-wizard.review.description':
    'நகர்த்தப்பட்ட வர்த்தகங்கள், காப்பகப்படுத்தப்பட்ட கணக்குகள் மற்றும் எச்சரிக்கைகளைச் சரிபாருங்கள். இணை எல்லாவற்றையும் பயன்படுத்தும்; கணக்குப் பக்கத்தில் இருந்து செயல்தவிர்க்கலாம்.',
  'account.merge.challenge.accounts': 'கணக்குகள்',
  'account.merge.challenge.order-hint': 'பழைய கட்டம் முதலில்',
  'account.merge.challenge.single-hint': 'இந்தக் கணக்கு தனியாகவே ஒரு சவாலாகும்',
  'account.merge.phase.identities-count': '{count} அடையாளங்கள்',
  'account.merge.phase.pending': 'நிலுவை',
  'account.merge.review.phases': 'கட்டங்கள்',
  'account.merge.review.archived': 'காப்பகப்படுத்தப்பட்டவை',
  'account.merge.review.open': 'திறந்தவை',
  'account.merge.sequence': 'சவால் {total}-இல் {index}',
  'account.merge.warning.balance-differs':
    'தொடக்க இருப்பு நிறுவனச் சுயவிவரத்திலிருந்து வேறுபடுகிறது',
  'account.merge.error.profile-phase-mismatch':
    'நிறுவனச் சுயவிவரத்தில் உள்ள கட்டங்களை விட அதிக கணக்குகள்',
  'account.merge.error.profile-currency-mismatch':
    'சுயவிவர நாணயம் இந்தக் கணக்குகளிலிருந்து வேறுபடுகிறது.',
  'account.merge.error.source-changed':
    'ஒரு கணக்கு மாறியுள்ளது. இணைப்பை மீண்டும் சரிபாருங்கள்.',
  'account.merge.error.multiple-active-phases':
    'இன்னும் செயலில் இருக்க கடைசிக் கணக்கு மட்டுமே முடியும்.',
  'account.merge.error.phases-after-failed-source':
    'தோல்வியடைந்த கணக்கு சவாலை முடிக்கிறது, எனவே அதைக் கடைசியாகத் தேர்ந்தெடுக்க வேண்டும்.',
  'account.merge.error.copy-trading-overlap':
    'நகல்-வர்த்தக காலங்கள் மேற்பொருந்துகின்றன. முதலில் ஒன்றை மூடுங்கள்.',
  'onboarding.legacy-challenge.legend':
    'ஒரே சவாலின் கட்டங்களாக இருந்த கணக்குகளைக் குழுவாக்குங்கள். தனியாக உள்ள ஒரு கணக்கு தானாகவே ஒரு சவாலாகும்.',
  'onboarding.legacy-challenge.assign.leave': 'அப்படியே விடு',
  'onboarding.legacy-challenge.assign.own': 'சொந்த சவால்',
  'onboarding.legacy-challenge.assign.group': 'சவால் {letter}',
  'onboarding.legacy-challenge.assign.new-group': 'புதிய சவால்…',
  'onboarding.legacy-challenge.action.continue': 'தொடர்',
  'onboarding.legacy-challenge.action.continue-count': '{count}ஐ அமை',
  'guide.action-step.dismiss': 'இப்போது இல்லை',
  'guide.legacy-challenge.title': 'உங்கள் ஏற்கனவே உள்ள கணக்குகள்',
  'guide.legacy-challenge.description':
    'ஒரே சவாலின் கட்டங்களாக இருந்த கணக்குகளை இணைக்கவும், அல்லது ஒரு கணக்கைத் தனியாகச் சவாலாக மாற்றவும்.',
  'guide.legacy-challenge.action': 'என் கணக்குகளை அமை',
  'onboarding.legacy-challenge.title': 'ப்ராப் சவால்கள்',
  'onboarding.legacy-challenge.action.skip': 'தவிர்',
  'onboarding.legacy-challenge.accounts.show-archived':
    'காப்பகப்படுத்தியவற்றைக் காட்டு',
  'onboarding.legacy-challenge.accounts.empty': 'அமைக்க கணக்குகள் இல்லை',
  'onboarding.legacy-challenge.loading': 'ஏற்றுகிறது...',
  'onboarding.legacy-challenge.suggested': 'பரிந்துரைக்கப்பட்டது',
  'onboarding.legacy-challenge.row.aria': '{account}க்கான செயல்',
  'onboarding.legacy-challenge.status.combined': 'இணைக்கப்பட்டது',
  'onboarding.legacy-challenge.status.converted': 'மாற்றப்பட்டது',
  'onboarding.legacy-challenge.entry.name': 'ப்ராப் சவால்கள்',
  'onboarding.legacy-challenge.entry.desc':
    'ஏற்கனவே உள்ள கணக்குகளைச் சவால்களாக இணைக்கவும் அல்லது மாற்றவும்.',
  'onboarding.legacy-challenge.entry.action': 'அமை',
};

export default ta;
