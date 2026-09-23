

import type { Lang } from './en';

const hi: Lang = {
  'widget.mfeScatter.name': 'MFE बनाम प्राप्त लाभ/हानि',
  'widget.mfeScatter.description':
    'बंद ट्रेडों की अधिकतम अनुकूल चाल बनाम शुद्ध प्राप्त लाभ/हानि',
  'widget.mfeScatter.y': 'प्राप्त लाभ/हानि ({unit})',
  'widget.mfeScatter.winners': 'लाभ वाले',
  'widget.mfeScatter.losers': 'हानि वाले',
  'widget.mfeScatter.breakeven': 'ब्रेकईवन',
  'widget.mfeScatter.empty':
    'इस इकाई में उपयोगी MFE वाले कोई बंद ट्रेड नहीं हैं।',

  'trade.broker-synced-at': 'ब्रोकर सिंक किया गया {date}',
  'trade-sync.tradovate.status.setup-required': 'अकाउंट सेटअप आवश्यक है',
  'trade-sync.tradovate.status.connecting': 'कनेक्ट हो रहा है',
  'trade-sync.tradovate.status.paused': 'पॉज़्ड',
  'trade-sync.tradovate.status.reauthorization-required':
    'पुन:प्राधिकरण आवश्यक है',
  'trade-sync.tradovate.status.deleting': 'क्लाउड डेटा हटाया जा रहा है',
  'trade-sync.tradovate.status.error': 'कनेक्शन त्रुटि',

  'trade-sync.tradovate.sync-complete-connection':
    '{connection} सिंक पूरा हुआ।',
  'trade-sync.tradovate.sync-partial-connection':
    '{connection} सिंक समस्याओं के साथ पूरा हुआ।',
  'trade-sync.tradovate.sync-all': 'सभी सिंक करें',
  'trade-sync.tradovate.sync-all-complete':
    '{total} Tradovate कनेक्शनों में से {succeeded} सिंक हुए।',
  'trade-sync.tradovate.sync-all-partial':
    '{total} Tradovate कनेक्शनों में से {succeeded} सिंक हुए। समस्या वाले कनेक्शन रिव्यू करें।',
  'trade-sync.tradovate.connect-another': 'दूसरा Tradovate अकाउंट कनेक्ट करें',
  'trade-sync.tradovate.no-connections':
    'कॉन्फ़िगर करने के लिए Tradovate अकाउंट को Journalit.co पर कनेक्ट करें और इसे यहाँ सिंक करें।',
  'trade-sync.tradovate.claimed-by-connection':
    '{connection} के माध्यम से सिंक सक्षम है। इस अकाउंट को स्विच करने से पहले इसे वहाँ अक्षम करें।',
  'trade-sync.tradovate.claim-conflict':
    'एक अन्य Tradovate कनेक्शन ने इस अकाउंट का दावा किया। फिर से कोशिश करने से पहले ताज़ा कनेक्शन कार्ड रिव्यू करें।',
  'trade-sync.tradovate.reconciliation-issues': '{count} समाधान मुद्दे',
  'trade-sync.tradovate.website-connection-description':
    'Tradovate को Journalit.co पर सुरक्षित रूप से कनेक्ट या पुनः अधिकृत करें, फिर अकाउंट्स चुनने और अपना वॉल्ट सिंक करने के लिए यहाँ वापस आएँ।',
  'trade-sync.tradovate.paused-website-description':
    'यह Tradovate कनेक्शन पॉज़ है। इसकी समीक्षा करने या इसे फिर से शुरू करने के लिए Journalit.co पर इसे प्रबंधित करें।',
  'trade-sync.tradovate.plugin-sync-description':
    'एक सिंक आपकी नवीनतम Tradovate गतिविधि प्राप्त करता है और परिणामी ट्रेड्स को इस वॉल्ट में लिखता है।',
  'trade-sync.tradovate.connect': 'कनेक्ट',
  'trade-sync.tradovate.manage-connection': 'कनेक्शन प्रबंधित करें',
  'trade-sync.tradovate.setup-guide': 'सेटअप गाइड',
  'trade-sync.tradovate.setup-and-sync': 'सेटअप और सिंक समाप्त करें',
  'trade-sync.tradovate.sync-to-vault': 'सिंक',
  'trade-sync.tradovate.discovery-description':
    'Journalit को आपके Tradovate कनेक्शन के माध्यम से उपलब्ध डेमो और लाइव अकाउंट की खोज करने की आवश्यकता है।',
  'trade-sync.tradovate.discover-accounts': 'Tradovate अकाउंट्स खोजें',
  'trade-sync.tradovate.discovering': 'अकाउंट्स की खोज…',
  'trade-sync.tradovate.discovery-failed':
    'Tradovate अकाउंट की खोज विफल रही। पुनः प्रयास करें या Journalit.co पर कनेक्शन प्रबंधित करें।',
  'trade-sync.tradovate.sync-account': 'सिंक में शामिल करें',
  'trade-sync.tradovate.history-label': 'प्रारंभिक इतिहास',
  'trade-sync.tradovate.history-all': 'सभी उपलब्ध इतिहास',
  'trade-sync.tradovate.history-recent': 'हाल के 90 दिन',
  'trade-sync.tradovate.history-custom': 'एक विशिष्ट तिथि से',
  'trade-sync.tradovate.history-new': 'केवल नए ट्रेड्स',
  'trade-sync.tradovate.start-date': 'आरंभ करने की तिथि',

  'trade-sync.tradovate.mapping-required':
    'प्रत्येक सक्षम Tradovate अकाउंट के लिए एक स्थानीय वॉल्ट अकाउंट चुनें।',
  'trade-sync.tradovate.custom-date-required':
    'प्रत्येक कस्टम इतिहास चयन के लिए एक प्रारंभ तिथि चुनें।',
  'trade-sync.tradovate.recovery-title': 'गुम ट्रेड नोट्स को पुनर्स्थापित करें',
  'trade-sync.tradovate.recovery-count':
    'पुनर्स्थापित करने के लिए {count} ट्रेड नोट',
  'trade-sync.tradovate.recovery-select-account':
    'ट्रेड नोट्स को पुनर्स्थापित करने से पहले एक स्थानीय अकाउंट चुनें।',
  'trade-sync.tradovate.recovery-confirm':
    '{count} ट्रेड नोट को {account} में पुनर्स्थापित करें?',

  'trade-sync.ctrader.status.setup-required': 'अकाउंट सेटअप आवश्यक है',
  'trade-sync.ctrader.status.connecting': 'कनेक्ट हो रहा है',
  'trade-sync.ctrader.status.paused': 'पॉज़्ड',
  'trade-sync.ctrader.status.reauthorization-required':
    'पुन:प्राधिकरण आवश्यक है',
  'trade-sync.ctrader.status.deleting': 'क्लाउड डेटा हटाया जा रहा है',
  'trade-sync.ctrader.status.error': 'कनेक्शन त्रुटि',
  'trade-sync.ctrader.sync-complete-connection': '{connection} सिंक पूरा हुआ।',
  'trade-sync.ctrader.sync-partial-connection':
    '{connection} सिंक समस्याओं के साथ पूरा हुआ।',
  'trade-sync.ctrader.sync-all': 'सभी सिंक करें',
  'trade-sync.ctrader.sync-all-complete':
    '{total} cTrader कनेक्शनों में से {succeeded} सिंक हुए।',
  'trade-sync.ctrader.sync-all-partial':
    '{total} cTrader कनेक्शनों में से {succeeded} सिंक हुए। समस्या वाले कनेक्शन रिव्यू करें।',
  'trade-sync.ctrader.connect-another': 'दूसरा cTrader अकाउंट कनेक्ट करें',
  'trade-sync.ctrader.no-connections':
    'कॉन्फ़िगर करने के लिए cTrader अकाउंट को Journalit.co पर कनेक्ट करें और इसे यहाँ सिंक करें।',
  'trade-sync.ctrader.claimed-by-connection':
    '{connection} के माध्यम से सिंक सक्षम है। इस अकाउंट को स्विच करने से पहले इसे वहाँ अक्षम करें।',
  'trade-sync.ctrader.claim-conflict':
    'एक अन्य cTrader कनेक्शन ने इस अकाउंट का दावा किया। फिर से कोशिश करने से पहले ताज़ा कनेक्शन कार्ड रिव्यू करें।',
  'trade-sync.ctrader.reconciliation-issues': '{count} समाधान मुद्दे',
  'trade-sync.ctrader.website-connection-description':
    'cTrader को Journalit.co पर सुरक्षित रूप से कनेक्ट या पुनः अधिकृत करें, फिर अकाउंट्स चुनने और अपना वॉल्ट सिंक करने के लिए यहाँ वापस आएँ।',
  'trade-sync.ctrader.plugin-sync-description':
    'एक सिंक आपकी नवीनतम cTrader गतिविधि प्राप्त करता है और परिणामी ट्रेड्स को इस वॉल्ट में लिखता है।',
  'trade-sync.ctrader.connect': 'कनेक्ट',
  'trade-sync.ctrader.manage-connection': 'कनेक्शन प्रबंधित करें',
  'trade-sync.ctrader.setup-guide': 'सेटअप गाइड',
  'trade-sync.ctrader.setup-and-sync': 'सेटअप और सिंक समाप्त करें',
  'trade-sync.ctrader.sync-to-vault': 'सिंक',
  'trade-sync.ctrader.discovery-description':
    'Journalit को आपके cTrader कनेक्शन के माध्यम से उपलब्ध डेमो और लाइव अकाउंट की खोज करने की आवश्यकता है।',
  'trade-sync.ctrader.discover-accounts': 'cTrader अकाउंट्स खोजें',
  'trade-sync.ctrader.discovering': 'अकाउंट्स की खोज…',
  'trade-sync.ctrader.discovery-failed':
    'cTrader अकाउंट की खोज विफल रही। पुनः प्रयास करें या Journalit.co पर कनेक्शन प्रबंधित करें।',
  'trade-sync.ctrader.sync-account': 'सिंक में शामिल करें',
  'trade-sync.ctrader.history-label': 'प्रारंभिक इतिहास',
  'trade-sync.ctrader.history-all': 'सभी उपलब्ध इतिहास',
  'trade-sync.ctrader.history-recent': 'हाल के 90 दिन',
  'trade-sync.ctrader.history-custom': 'एक विशिष्ट तिथि से',
  'trade-sync.ctrader.history-new': 'केवल नए ट्रेड्स',
  'trade-sync.ctrader.start-date': 'आरंभ करने की तिथि',
  'trade-sync.ctrader.mapping-required':
    'प्रत्येक सक्षम cTrader अकाउंट के लिए एक स्थानीय वॉल्ट अकाउंट चुनें।',
  'trade-sync.ctrader.custom-date-required':
    'प्रत्येक कस्टम इतिहास चयन के लिए एक प्रारंभ तिथि चुनें।',
  'trade-sync.ctrader.recovery-title': 'गुम ट्रेड नोट्स को पुनर्स्थापित करें',
  'trade-sync.ctrader.recovery-count':
    'पुनर्स्थापित करने के लिए {count} ट्रेड नोट',
  'trade-sync.ctrader.recovery-select-account':
    'ट्रेड नोट्स को पुनर्स्थापित करने से पहले एक स्थानीय अकाउंट चुनें।',
  'trade-sync.ctrader.recovery-confirm':
    '{count} ट्रेड नोट को {account} में पुनर्स्थापित करें?',
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
    'क्लाउड में cTrader ट्रेड्स सिंक करें और उन्हें इस वॉल्ट में प्रोजेक्ट करें।',
  'trade-sync.ctrader.status-failed': 'cTrader स्थिति लोड करने में असमर्थ.',
  'trade-sync.ctrader.last-sync': 'अंतिम सिंक',
  'trade-sync.ctrader.pending-acks': '{count} लंबित स्थानीय एसीके',
  'trade-sync.ctrader.never': 'कभी नहीं',

  'command.add-trade': 'नया ट्रेड जोड़ें',
  'command.import-trades-csv': 'Trade Import खोलें',
  'command.create-drc': 'DRC खोलें (दैनिक रिपोर्ट कार्ड)',
  'command.create-weekly-review': 'साप्ताहिक रिव्यू खोलें',
  'command.create-monthly-review': 'मासिक रिव्यू खोलें',
  'command.create-quarterly-review': 'त्रैमासिक रिव्यू खोलें',
  'command.create-yearly-review': 'वार्षिक रिव्यू खोलें',
  'command.open-dashboard': 'डैशबोर्ड खोलें',
  'command.open-account-dashboard': 'अकाउंट्स खोलें',
  'command.open-trade-log': 'ट्रेड लॉग खोलें',
  'command.open-home': 'होम व्यू खोलें',
  'command.open-settings': 'सेटिंग्स खोलें',
  'command.open-position-size-calculator': 'पोजीशन साइज़ कैलकुलेटर खोलें',
  'command.replay-onboarding': 'ऑनबोर्डिंग प्रवाह पुनः चलाएँ',
  'command.replay-current-view-guide': 'वर्तमान दृश्य के लिए रीप्ले गाइड',
  'command.open-release-notes': 'रिलीज़ नोट्स देखें',
  'command.open-layout-builder': 'लेआउट बिल्डर खोलें',
  'notice.guide.replay-unavailable':
    'गाइड सिस्टम अभी तैयार नहीं है. कृपया पुन: प्रयास करें।',
  'notice.guide.no-active-view':
    'पहले समर्थित Journalit दृश्य खोलें, फिर यह आदेश चलाएँ।',
  'notice.guide.no-guide-for-view':
    'इस दृश्य के लिए अभी तक कोई गाइड पंजीकृत नहीं है ({viewType})।',
  'notice.guide.replay-failed':
    'गाइड प्रारंभ करने में विफल. कृपया पुन: प्रयास करें।',
  'notice.guide.replay-started':
    'इस दृश्य के लिए मार्गदर्शिका पुनः प्रारंभ की गई.',
  'template.switch-title': 'लेआउट स्विच करें',
  'template.switch-review-title': '{type} लेआउट स्विच करें',

  'template.review-type.drc': 'DRC',
  'template.review-type.weekly': 'साप्ताहिक',
  'template.review-type.monthly': 'मासिक',
  'template.review-type.quarterly': 'त्रैमासिक',
  'template.review-type.yearly': 'वार्षिक',
  'template.review-type.review': 'रिव्यू',
  'template.builder.select-template': 'संपादित करने के लिए एक लेआउट चुनें',
  'template.builder.loading': 'लेआउट बिल्डर लोड हो रहा है...',
  'template.builder.create-from-sidebar': 'या साइडबार से एक नया बनाएं',
  'template.builder.snippet-coming-soon': 'स्निपेट संपादक जल्द ही आ रहा है',
  'template.preview.empty': 'इस लेआउट में कोई विजेट्स नहीं है',
  'template.preview.summary': '{type} लेआउट - {count} विजेट्स',
  'template.preview.mode': 'प्रिव्यू मोड',
  'template.preview.markdown-zone-placeholder':
    'Markdown ज़ोन - उपयोगकर्ता यहां लिखते हैं',
  'template.preview.markdown-zone-placeholder-with-id':
    'Markdown ज़ोन ({id}) - उपयोगकर्ता यहां लिखते हैं',
  'template.preview.widget.game-performance-desc': 'मानसिक/तकनीकी ग्रेड वितरण',
  'template.preview.widget.unknown-desc': 'अज्ञात विजेट प्रकार',
  'template.section.forecast': 'पूर्वानुमान',
  'template.section.performance': 'प्रदर्शन',
  'template.section.review': 'रिव्यू',
  'template.question.drc.q1': 'मैंने आज क्या अच्छा किया?',
  'template.question.drc.q2': 'मैं क्या सुधार कर सकता हूँ?',
  'template.question.drc.q3': 'अगले सत्र में मैं किस पर ध्यान केंद्रित करूंगा?',
  'template.question.weekly.q1': 'इस सप्ताह क्या अच्छा रहा?',
  'template.question.weekly.q2': 'इस सप्ताह क्या काम नहीं आया?',
  'template.question.weekly.q3': 'कौन से सेटअप सबसे अधिक लाभदायक थे?',
  'template.question.weekly.q4':
    'किन गलतियों की वजह से मुझे सबसे ज्यादा पैसे खर्च करने पड़े?',
  'template.question.weekly.q5':
    'मैं अगले सप्ताह के लिए क्या सुधार कर सकता हूँ?',
  'template.question.monthly.q1': 'इस महीने के प्रमुख सबक क्या थे?',
  'template.question.monthly.q2':
    'कौन सी रणनीतियों ने सर्वोत्तम प्रदर्शन किया?',
  'template.question.monthly.q3':
    'मैं अपनी ट्रेडिंग में कौन से पैटर्न देखता हूँ?',
  'template.question.monthly.q4': 'अगले महीने के लिए मेरे लक्ष्य क्या हैं?',
  'template.question.monthly.q5':
    'मैं अपने जोखिम प्रबंधन को कैसे सुधार सकता हूँ?',
  'template-picker.empty': 'कोई लेआउट उपलब्ध नहीं है.',
  'template-picker.close': 'बंद करें',
  'template-picker.built-in': '(अंतर्निहित)',
  'template-picker.badge.default': 'डिफ़ॉल्ट',
  'template-picker.badge.current': 'मौजूदा',
  'template-picker.cancel': 'रद्द करें',
  'auth.title.already-logged-in': 'पहले से लॉग्ड इन',
  'auth.desc.already-logged-in': 'आप पहले से ही लॉग इन हैं{email}.',
  'auth.title.sign-in': 'Journalit में साइन इन करें',

  'auth.label.email': 'ईमेल पता',

  'auth.button.send-code': 'सत्यापन कोड भेजें',

  'auth.label.code': 'सत्यापन कोड',

  'auth.button.verify': 'सत्यापित करें और साइन इन करें',

  'auth.button.resend': 'कोड पुनः भेजें',

  'auth.error.needs-premium': 'प्रो सुविधा',

  'auth.error.network-error': 'कनेक्शन त्रुटि',

  'form.modal.unsaved-changes.title': 'असहेजे परिवर्तन',
  'form.modal.unsaved-changes.body1':
    'आपके पास ट्रेड फॉर्म में परिवर्तन सहेजे नहीं गए हैं।',
  'form.modal.unsaved-changes.body2':
    'क्या आप वाकई बिना सहेजे बंद करना चाहते हैं?',
  'form.modal.unsaved-changes.continue': 'एडिट जारी रखें',
  'form.modal.unsaved-changes.discard': 'परिवर्तन त्यागें',
  'template-builder.modal.unsaved-changes.title': 'असहेजे परिवर्तन',
  'template-builder.modal.unsaved-changes.body1':
    'इस लेआउट में आपके परिवर्तन सहेजे नहीं गए हैं.',
  'template-builder.modal.unsaved-changes.body2':
    'क्या आप वाकई बिना सहेजे स्विच करना चाहते हैं?',
  'template-builder.modal.unsaved-changes.continue': 'एडिट जारी रखें',
  'template-builder.modal.unsaved-changes.discard': 'परिवर्तन त्यागें',
  'template-builder.modal.delete.title': 'लेआउट हटाएँ',
  'template-builder.modal.delete.body':
    'क्या आप वाकई "{name}" को हटाना चाहते हैं?',
  'template-builder.modal.delete.warning':
    'इस एक्शन को वापस नहीं किया जा सकता।',
  'template-builder.modal.delete.cancel': 'रद्द करें',
  'template-builder.modal.delete.confirm': 'हटाएँ',
  'tradelog.settings.modal.unsaved-changes.body1':
    'आपके पास सेटिंग्स कॉलम में सहेजे नहीं गए परिवर्तन हैं।',
  'tradelog.settings.modal.unsaved-changes.body2':
    'क्या आप वाकई बिना सहेजे बंद करना चाहते हैं?',
  'notice.error.missed-trade-service-init':
    'छूटी हुई ट्रेड सेवा प्रारंभ नहीं की गई है। कृपया एक क्षण प्रतीक्षा करें और पुनः प्रयास करें।',
  'notice.error.backtest-trade-service-init':
    'बैकटेस्ट ट्रेड सेवा प्रारंभ नहीं की गई है। कृपया एक क्षण प्रतीक्षा करें और पुनः प्रयास करें।',
  'notice.trade-updated': '{type} अद्यतन: {path}',
  'notice.trade-created': '{type} बनाया गया: {path}',
  'notice.new-trade-created':
    '📈 नया ट्रेड बनाया गया: {instrument} {direction}',
  'notice.error.trade-update-failed': '{type} को अपडेट करने में विफल: {error}',
  'notice.error.trade-create-failed': '{type} बनाने में विफल: {error}',
  'form.section.trade-details': 'ट्रेड डिटेल्स',
  'form.section.trading-costs': 'ट्रेडिंग कॉस्ट',
  'form.section.risk-management': 'रिस्क मैनेजमेंट',
  'form.section.take-profits': 'टारगेट्स',
  'form.section.analysis-thesis': 'एनालिसिस और थीसिस',
  'form.section.custom-fields': 'कस्टम फ़ील्ड्स',

  'form.section.custom-fields-empty-title':
    'अभी तक कोई एडवांस्ड फ़ील्ड नहीं है.',
  'form.section.custom-fields-empty-desc':
    'वह सब कुछ ट्रैक करें जो अंतर्निहित फ़ील्ड में नहीं है, जैसे सेशन, टाइमफ़्रेम या सेटअप ग्रेड। कस्टम फ़ील्ड हर ट्रेड के साथ सेव होते हैं और ट्रेड लॉग में क्रमबद्ध किए जा सकने वाले कॉलम बन सकते हैं।',
  'form.section.attachments': 'अटैचमेंट्स',
  'form.tab.basic': 'बेसिक',
  'form.tab.details': 'डिटेल्स',
  'form.tab.advanced': 'एडवांस्ड',
  'form.import-shortcut.open': 'ट्रेड्स इंपोर्ट करें',
  'form.layout.customize': 'फ़ॉर्म कस्टमाइज़ करें',
  'form.layout.modal-title': 'ट्रेड फ़ॉर्म कस्टमाइज़ करें',
  'form.layout.settings-title': 'ट्रेड फ़ॉर्म लेआउट',

  'form.layout.input-mode': 'इनपुट मोड',
  'form.layout.input-mode-prices': 'कीमतें',
  'form.layout.input-mode-pnl-risk': 'P&L + रिस्क',
  'form.layout.input-mode-prices-desc':
    'एंट्री/एग्जिट कीमतें। Journalit P&L की गणना करता है।',
  'form.layout.input-mode-pnl-risk-desc':
    'प्रत्यक्ष P&L + जोखिम। Journalit आर दिखाता है।',
  'form.layout.asset-type-mode': 'एसेट टाइप',
  'form.layout.asset-type-mode-show': 'पूछें',
  'form.layout.asset-type-mode-fixed': 'फिक्स्ड',
  'form.layout.default-asset-type': 'डिफ़ॉल्ट एसेट टाइप',
  'form.layout.active-fields': 'दिखाए गए ब्लॉक',
  'form.layout.available-fields': 'छिपे ब्लॉक',
  'form.layout.active-fields-desc': 'क्रम बदलने के लिए खींचें।',
  'form.layout.available-fields-desc': 'छिपे ब्लॉक वापस जोड़ें।',
  'form.layout.empty-active': 'कोई वैकल्पिक ब्लॉक दिखाई नहीं दे रहे हैं.',
  'form.layout.all-active': 'सभी वैकल्पिक ब्लॉक दृश्यमान हैं.',
  'form.layout.add-field-aria': '{field} को ट्रेड फॉर्म में जोड़ें',
  'form.layout.remove-field-aria': '{field} को ट्रेड फॉर्म में छुपाएं',
  'form.layout.saved': 'ट्रेड फॉर्म लेआउट सहेजा गया',
  'form.layout.item.trading-costs.commission': 'ब्रोकरेज',
  'form.layout.item.import-shortcut': 'इंपोर्ट बटन',
  'form.layout.item.import-shortcut-desc':
    'एक फ़ुटर बटन दिखाएँ जो Trade Import खोलता है।',
  'form.layout.item.core-details': 'मुख्य ट्रेड डिटेल्स',
  'form.layout.item.core-details-desc':
    'अकाउंट, इंस्ट्रूमेंट, दिशा और एंट्री/एग्जिट इनपुट पहले रहते हैं।',
  'form.layout.item.asset-specific': 'एसेट-विशिष्ट फ़ील्ड्स',
  'form.layout.item.pnl-preview': 'P&L प्रीव्यू',

  'form.layout.item.trade-currency': 'ट्रेड मुद्रा / एफएक्स दर',
  'form.layout.item.trade-currency-desc':
    'वैकल्पिक मैन्युअल FX दर के साथ किसी अन्य मुद्रा में ट्रेड दर्ज करें।',
  'form.layout.item.exchange-desc':
    'स्टॉक और क्रिप्टो ट्रेड के लिए एक्सचेंज फ़ील्ड।',
  'form.layout.item.direct-pnl-toggle-desc':
    'किसी एक ट्रेड को एग्ज़िट प्राइस के बजाय कुल P&L दर्ज करने पर स्विच करें।',
  'form.layout.manual-fx-rate': 'FX रेट ओवरराइड',
  'form.layout.result-r': 'R में रिजल्ट',
  'form.layout.entry-time': 'ट्रेड समय',
  'form.field.account': 'अकाउंट',
  'form.field.asset-type': 'एसेट टाइप',
  'form.field.asset-type.stock': 'स्टॉक',
  'form.field.asset-type.options': 'ऑप्शंस',
  'form.field.asset-type.futures': 'फ्यूचर्स',
  'form.field.asset-type.forex': 'Forex',
  'form.field.asset-type.crypto': 'क्रिप्टो',
  'form.field.asset-type.cfd': 'CFD',
  'form.field.direction': 'दिशा',
  'form.field.direction.long': 'लॉन्ग',
  'form.field.direction.short': 'शॉर्ट',
  'form.field.commission': 'ब्रोकरेज',
  'form.field.commission-type': 'टाइप',
  'form.field.rebate': 'रिबेट',
  'form.field.swap': 'Swap',

  'form.field.other-fees': 'अन्य शुल्क',
  'form.field.stop-loss': 'स्टॉप लॉस',
  'form.field.take-profit': 'टारगेट',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'टारगेट कीमत',
  'form.field.close-percent': 'क्लोज %',
  'form.field.close-size': 'क्लोज़ साइज़',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': 'टेक प्रॉफिट क्लोज़ मात्रा इस रूप में',
  'form.layout.take-profit-unit-percent': 'क्लोज %',
  'form.layout.take-profit-unit-size': 'साइज़',
  'trade.validation.take-profit-size-number':
    'टेक प्रॉफिट साइज़ एक मान्य संख्या होनी चाहिए।',
  'trade.validation.take-profit-size-positive':
    'टेक प्रॉफिट साइज़ 0 से अधिक होनी चाहिए।',
  'trade.validation.take-profit-total-size-range':
    'टेक प्रॉफिट साइज़ का योग पोजीशन साइज़ से अधिक नहीं हो सकता।',
  'form.field.risk-amount': 'जोखिम राशि',
  'form.field.profit-loss': 'प्रॉफिट/लॉस',
  'form.field.total-pnl': 'ट्रेड P&L',
  'form.field.realized-pnl': 'रियलाइज़्ड P&L',
  'form.field.floating-pnl': 'फ्लोटिंग P&L',
  'form.field.total-costs': 'कुल लागत:',
  'form.field.setup': 'सेटअप',
  'form.field.mistake': 'गलती',
  'form.field.custom-tags': 'कस्टम टैग',
  'form.field.trade-thesis': 'ट्रेड थीसिस',
  'form.field.time': 'समय',
  'form.field.price': 'कीमत',

  'form.field.entries': 'एंट्रीज़',
  'form.field.exits': 'एग्जिट्स',
  'form.field.dividends': 'लाभांश',
  'form.field.dividend-amount': 'लाभांश राशि',
  'form.field.optional': '(वैकल्पिक)',
  'form.field.closed': 'क्लोज्ड',
  'form.field.incl-costs': '(लागत सहित)',
  'form.field.commission-type.fixed': 'फिक्स्ड',
  'form.field.commission-type.percentage': 'प्रतिशत (%)',
  'form.calculated': 'परिकलित',
  'form.account-empty-state.title': 'अपना पहला खाता सेट करें',
  'form.account-empty-state.description':
    'खाते आपका बैलेंस ट्रैक करते हैं ताकि Journalit रिटर्न, जोखिम और ड्रॉडाउन निकाल सके। बनाने के लिए सिर्फ़ एक नाम चाहिए।',
  'form.account-empty-state.create-account': 'अकाउंट बनाएं',
  'form.account-empty-state.submit-disabled':
    'इस ट्रेड को सहेजने के लिए पहले एक अकाउंट बनाएं।',
  'form.empty.take-profits': 'अभी तक कोई टारगेट नहीं है',
  'form.action.add-take-profit': 'टारगेट जोड़ें',
  'form.action.remove-take-profit': 'टारगेट निकालें',
  'form.field.position-size': 'पोजीशन साइज़',
  'form.field.position-size.shares': 'शेयर्स',
  'form.field.position-size.contracts': 'कॉन्ट्रैक्ट्स',
  'form.field.position-size.lots': 'Lots',
  'form.field.position-size.amount': 'मात्रा',
  'form.field.position-size.cfd-units': 'सीएफडी इकाइयाँ',
  'form.field.instrument': 'इंस्ट्रूमेंट',
  'form.field.instrument.ticker': 'सिंबल',
  'form.field.instrument.option-symbol': 'ऑप्शन सिंबल',
  'form.field.instrument.future-symbol': 'फ्यूचर सिंबल',
  'form.field.instrument.forex-pair': 'Forex पेयर',
  'form.field.instrument.crypto-symbol': 'क्रिप्टो सिंबल',
  'form.field.instrument.cfd-symbol': 'CFD सिंबल',
  'form.field.exchange': 'एक्सचेंज',
  'form.field.expiration-date': 'समाप्ति तिथि',
  'form.field.strike-price': 'स्ट्राइक कीमत',
  'form.field.contract-size': 'कॉन्ट्रैक्ट साइज़',
  'form.field.option-type': 'ऑप्शन टाइप',
  'form.field.option-type.call': 'Call',
  'form.field.option-type.put': 'Put',
  'form.field.dollars-per-point': 'डॉलर प्रति प्वाइंट',
  'form.field.tick-size': 'टिक साइज़',
  'form.field.tick-value': 'टिक वैल्यू',
  'form.field.lot-size': 'लॉट साइज़',
  'form.field.custom-lot-size': 'कस्टम लॉट साइज़',
  'form.field.pip-value': 'पिप मूल्य',
  'form.field.leverage-ratio': 'लेवरेज अनुपात',
  'form.field.trade-currency': 'ट्रेड मुद्रा',
  'form.field.fx-rate': '{base} में FX दर',
  'form.field.fx-rate-override': 'FX रेट ओवरराइड ({quote} → {base})',
  'form.forex.using-manual-rate': 'मैनुअल एफएक्स दर का उपयोग करना',
  'form.field.lot-size.standard': 'मानक (100,000)',
  'form.field.lot-size.mini': 'मिनी (10,000)',
  'form.field.lot-size.micro': 'माइक्रो (1,000)',
  'form.field.lot-size.custom': 'कस्टम',
  'form.field.image-url-placeholder': 'मीडिया URL या फ़ाइल पथ चिपकाएँ...',
  'form.field.image-duplicate-error': 'यह छवि पहले ही जोड़ी जा चुकी है.',
  'form.field.trade-image-alt': 'ट्रेड छवि',

  'form.field.value-dollar': 'मूल्य ($)',
  'form.field.dollar-amount-placeholder': 'डॉलर राशि',
  'form.field.direct-pnl-placeholder': 'लाभ या हानि राशि दर्ज करें',

  'form.field.mae-placeholder-currency': '{currency} में अधिकतम MAE',
  'form.field.mfe-placeholder-currency': '{currency} में अधिकतम MFE',
  'form.placeholder.select-accounts': 'अकाउंट्स चुनें',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': 'ब्रोकरेज छूट/क्रेडिट',
  'form.placeholder.swap': 'रातोरात वित्तपोषण',
  'form.placeholder.other-fees': 'प्लेटफ़ॉर्म/नियामक शुल्क',
  'form.placeholder.dividend-amount': 'नकद राशि, सकारात्मक या नकारात्मक',
  'form.placeholder.stop-loss': 'वैकल्पिक स्टॉप लॉस कीमत',
  'form.placeholder.target-price': 'टारगेट कीमत',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': 'मुद्रा में नियोजित जोखिम',
  'form.placeholder.fx-rate': '1 {currency} = ? {base} (खाली: दैनिक दर)',
  'form.placeholder.custom-tag': 'एक कस्टम टैग टाइप करें और एंटर दबाएँ',
  'form.placeholder.thesis': 'इस ट्रेड के लिए अपनी थीसिस दर्ज करें...',

  'form.placeholder.exchange-stock': 'उदाहरण के लिए, NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'जैसे, बिनेंस, कॉइनबेस',
  'form.placeholder.futures-point-value': 'उदाहरण: ईएस1 के लिए 50',
  'form.placeholder.leverage': 'उदाहरण के लिए, 1:100 के लिए 100',
  'form.entry-exit.add-entry': '+ एंट्री जोड़ें',
  'form.entry-exit.add-exit': '+ एग्जिट जोड़ें',
  'form.entry-exit.remove-entry': 'एंट्री हटाएँ',
  'form.entry-exit.remove-exit': 'एग्जिट हटाएँ',
  'form.dividends.add-dividend': '+ लाभांश जोड़ें',
  'form.dividends.remove-dividend': 'लाभांश हटाएँ',
  'form.dividends.total-dividends': 'कुल लाभांश:',
  'form.entry-exit.total-entry-size': 'कुल एंट्री साइज़:',
  'form.entry-exit.remaining-position': 'शेष पोजीशन:',
  'form.entry-exit.open': '(ओपन)',
  'form.entry-exit.closed': '(क्लोज्ड)',
  'form.entry-exit.direct-pnl': 'कीमतों के बजाय सीधे आधार ट्रेड P&L दर्ज करें',
  'form.entry-exit.direct-pnl-desc':
    'लाभांश से पहले ट्रेड लाभ/हानि दर्ज करें। ब्रोकरेज और शुल्क अभी भी अलग से लागू होंगे।',
  'form.entry-exit.calc-pnl':
    'एंट्री/एग्जिट कीमतों और पोजीशन साइज़ से P&L की गणना करें।',
  'form.ideal-exit.title': 'आइडियल एग्जिट्स',

  'form.ideal-exit.price': 'आइडियल कीमत',
  'form.ideal-exit.size': 'साइज़',
  'form.ideal-exit.remove': 'आइडियल एग्जिट निकालें',

  'form.ideal-exit.copy-actual': 'वास्तविक एग्जिट्स की प्रतिलिपि बनाएँ',
  'form.ideal-exit.tooltip':
    'वह हाइंडसाइट एग्जिट योजना रिकॉर्ड करें जिसे आप लागू करना चाहते थे। कैप्चर रिव्यू के लिए स्केल किए गए एग्जिट्स समर्थित हैं।',
  'form.ideal-exit.empty': 'अभी तक कोई आइडियल एग्जिट्स नहीं',
  'form.unrealized.title': 'ओपन पोजीशन स्नैपशॉट',
  'form.unrealized.tooltip':
    'अनरियलाइज़्ड P&L ट्रैक करने के लिए अपने खुले पोजीशन का वर्तमान बाजार मूल्य रिकॉर्ड करें। ट्रेड बंद होने पर स्नैपशॉट अपने आप साफ़ हो जाता है।',
  'form.unrealized.price': 'स्नैपशॉट कीमत',
  'form.unrealized.time': 'स्नैपशॉट समय',
  'form.unrealized.preview': 'अनरियलाइज़्ड P&L',
  'form.unrealized.captured': '{time} पर कैप्चर किया',
  'form.layout.item.unrealized-snapshot-desc':
    'खुले पोजीशन के लिए अनरियलाइज़्ड P&L ट्रैक करें।',
  'trade.validation.unrealized-snapshot-price-non-negative':
    'स्नैपशॉट मूल्य शून्य या अधिक होना चाहिए',
  'trade.validation.unrealized-snapshot-open-position-required':
    'स्नैपशॉट का समय खुले पोजीशन के दौरान होना चाहिए।',
  'form.trade-type.title': 'ट्रेड टाइप',
  'form.trade-type.subtitle': 'आप जिस प्रकार का ट्रेड बना रहे हैं उसे चुनें',
  'form.trade-type.regular': 'रेगुलर ट्रेड',
  'form.trade-type.regular-desc':
    'पूर्ण एंट्री और एग्जिट डेटा के साथ सामान्य ट्रेड',
  'form.trade-type.missed': 'मिस्ड ट्रेड',
  'form.trade-type.missed-desc':
    'ट्रेड अवसर जो आपने गँवा दिया - P&L और अकाउंट फ़ील्ड वैकल्पिक',
  'form.trade-type.backtest': 'बैकटेस्ट ट्रेड',
  'form.trade-type.backtest-desc':
    'विश्लेषण प्रयोजनों के लिए बैकटेस्टिंग परिदृश्य',
  'form.trade-type.missed-reason': 'आपने यह ट्रेड क्यों मिस किया?',
  'form.trade-type.missed-reason-placeholder':
    'बताएं कि आपने यह ट्रेड अवसर क्यों गंवा दिया...',
  'button.save': 'सहेजें',
  'button.cancel': 'रद्द करें',
  'button.close': 'बंद करें',
  'button.open': 'खोलें',
  'button.done': 'हो गया',
  'button.edit': 'एडिट',
  'button.delete': 'हटाएँ',
  'button.update': 'अपडेट',
  'button.add': 'जोड़ें',
  'button.create': 'बनाएँ',
  'button.reset': 'रीसेट',
  'button.reset-to-defaults': 'डिफ़ॉल्ट पर रीसेट',

  'button.confirm': 'पुष्टि करें',

  'button.back': 'वापस',
  'button.add-trade': 'ट्रेड जोड़ें',
  'button.update-trade': 'ट्रेड अपडेट करें',
  'button.save-changes': 'परिवर्तन सहेजें',
  'button.create-trade': 'ट्रेड बनाएँ',
  'button.delete-all': 'सभी हटाएँ',
  'button.clear-all': 'सभी साफ़ करें',

  'button.cancel-reset': 'रीसेट रद्द करें',
  'button.proceed-anyway': 'फिर भी जारी रखें',
  'button.mark-reviewed': 'रिव्यूड मार्क करें',
  'button.maybe-later': 'बाद में',
  'button.upgrade-now': 'अभी अपग्रेड करें',

  'button.apply': 'लागू करें',

  'button.learn-more': 'और जानें',
  'button.upload-image': 'मीडिया अपलोड करें',
  'button.discord': 'Discord',
  'form.error.image-upload-unavailable': 'छवि अपलोड उपलब्ध नहीं है',
  'trade.header.unknown-instrument': 'अज्ञात इंस्ट्रूमेंट',
  'validation.edit': 'संपादित करें',
  'validation.fix-errors': 'निम्नलिखित त्रुटियों को ठीक करें:',
  'validation.setup-resolution-failed':
    'चयनित सेटअप्स तैयार नहीं किया जा सका. उनकी जाँच करें और पुनः प्रयास करें.',
  'validation.basic-tab-errors.one': 'बेसिक टैब में {count} त्रुटि है',
  'validation.basic-tab-errors.few': 'बेसिक टैब में {count} त्रुटियाँ हैं',
  'validation.basic-tab-errors.many': 'बेसिक टैब में {count} त्रुटियाँ हैं',
  'validation.basic-tab-errors.other': 'बेसिक टैब में {count} त्रुटियाँ हैं',
  'validation.details-tab-errors.one': 'विवरण टैब में {count} त्रुटि है',
  'validation.details-tab-errors.few': 'विवरण टैब में {count} त्रुटियाँ हैं',
  'validation.details-tab-errors.many': 'विवरण टैब में {count} त्रुटियाँ हैं',
  'validation.details-tab-errors.other': 'विवरण टैब में {count} त्रुटियाँ हैं',
  'validation.advanced-tab-errors.one': 'उन्नत टैब में {count} त्रुटि है',
  'validation.advanced-tab-errors.few': 'उन्नत टैब में {count} त्रुटियाँ हैं',
  'validation.advanced-tab-errors.many': 'उन्नत टैब में {count} त्रुटियाँ हैं',
  'validation.advanced-tab-errors.other': 'उन्नत टैब में {count} त्रुटियाँ हैं',
  'validation.complete-required': 'कृपया सभी आवश्यक क्षेत्रों को भरें',

  'validation.missed-trade-requires-exit':
    'छूटे हुए ट्रेड्स में गैर-शून्य कीमतों वाला एग्जिट डेटा होना चाहिए। वे उन अवसरों का प्रतिनिधित्व करते हैं जो पहले ही बीत चुके हैं, इसलिए आपको यह निर्दिष्ट करना होगा कि एग्जिट की कीमत क्या होगी।',
  'trade.validation.entry-required': 'कम से कम एक एंट्री आवश्यक है.',
  'trade.validation.entry-time-required': 'एंट्री समय आवश्यक है.',
  'trade.validation.entry-price-required': 'एंट्री मूल्य आवश्यक है.',
  'trade.validation.entry-size-positive':
    'एंट्री का आकार शून्य से बड़ा होना चाहिए.',
  'trade.validation.exit-required-closed':
    'बंद ट्रेड्स के लिए कम से कम एक एग्जिट आवश्यक है।',
  'trade.validation.exit-time-required': 'एग्जिट समय आवश्यक है.',
  'trade.validation.exit-price-required': 'एग्जिट मूल्य आवश्यक है.',
  'trade.validation.exit-size-positive':
    'एग्जिट का आकार शून्य से बड़ा होना चाहिए.',
  'trade.validation.exit-size-exceeds-entry':
    'कुल एग्जिट आकार कुल एंट्री आकार से अधिक नहीं हो सकता।',
  'trade.validation.exit-before-entry':
    'एग्जिट्स पहले एंट्री से पहले नहीं हो सकता।',
  'trade.validation.dividend-time-required': 'लाभांश समय आवश्यक है.',
  'trade.validation.dividend-amount-nonzero':
    'लाभांश राशि एक गैर-शून्य संख्या होनी चाहिए.',
  'trade.validation.direct-pnl-required': 'कृपया लाभ/हानि मूल्य दर्ज करें.',
  'trade.validation.entry-time-select': 'कृपया एंट्री समय चुनें।',
  'trade.validation.direction-required': 'कृपया एक दिशा चुनें.',
  'trade.validation.asset-type-required': 'कृपया एक एसेट टाइप चुनें.',
  'trade.validation.ticker-required': 'कृपया एक सिंबल चुनें।',
  'trade.validation.ticker-invalid':
    'एक वैध सिंबल प्रतीक (केवल अक्षर, संख्या और अवधि) दर्ज करें।',
  'trade.validation.account-required': 'कृपया कम से कम एक अकाउंट चुनें.',
  'trade.validation.exit-time-select': 'कृपया एग्जिट समय चुनें।',
  'trade.validation.entry-price-invalid': 'कृपया वैध एंट्री मूल्य दर्ज करें।',
  'trade.validation.exit-price-invalid': 'कृपया वैध एग्जिट मूल्य दर्ज करें।',
  'trade.validation.position-size-invalid':
    'कृपया एक वैध पोजीशन साइज़ दर्ज करें।',
  'trade.validation.exit-time-after-entry':
    'एग्जिट समय एंट्री समय के बाद होना चाहिए।',
  'trade.validation.expiration-date-required': 'कृपया एक समाप्ति तिथि चुनें.',
  'trade.validation.strike-price-required': 'कृपया स्ट्राइक मूल्य दर्ज करें.',
  'trade.validation.option-type-required':
    'कृपया एक विकल्प प्रकार चुनें (कॉल करें या रखें)।',
  'trade.validation.contract-size-positive':
    'अनुबंध का आकार शून्य से बड़ा होना चाहिए.',
  'trade.validation.dollars-per-point-min':
    'कृपया प्रति पॉइंट डॉलर दर्ज करें (न्यूनतम 0.01)।',
  'trade.validation.lot-size-nonnegative':
    'लॉट का आकार शून्य से बड़ा होना चाहिए.',
  'trade.validation.leverage-positive':
    'उत्तोलन अनुपात शून्य से अधिक होना चाहिए.',
  'trade.validation.commission-type-invalid':
    'ब्रोकरेज प्रकार या तो "निश्चित" या "प्रतिशत" होना चाहिए।',
  'trade.validation.commission-number': 'ब्रोकरेज एक संख्या होनी चाहिए.',
  'trade.validation.commission-percentage-range':
    'प्रतिशत ब्रोकरेज 0 और 100 के बीच होना चाहिए।',
  'trade.validation.rebate-options-only':
    'छूट केवल विकल्प ट्रेड्स के लिए अनुमत है।',
  'trade.validation.rebate-number': 'छूट एक संख्या होनी चाहिए.',
  'trade.validation.rebate-positive': 'छूट एक सकारात्मक मूल्य होना चाहिए.',
  'trade.validation.swap-invalid': 'अमान्य स्वैप राशि.',
  'trade.validation.fees-number': 'फीस एक संख्या होनी चाहिए.',
  'trade.validation.risk-number': 'जोखिम राशि एक संख्या होनी चाहिए.',
  'trade.validation.risk-valid-number': 'जोखिम राशि एक वैध संख्या होनी चाहिए.',
  'trade.validation.risk-positive': 'जोखिम राशि शून्य से अधिक होनी चाहिए.',
  'trade.validation.fx-rate-number': 'एफएक्स दर एक वैध संख्या होनी चाहिए।',
  'trade.validation.fx-rate-positive': 'एफएक्स दर शून्य से अधिक होनी चाहिए।',
  'trade.validation.stop-loss-number': 'स्टॉप लॉस एक संख्या होनी चाहिए.',
  'trade.validation.stop-loss-valid-number':
    'स्टॉप लॉस एक वैध संख्या होनी चाहिए।',
  'trade.validation.take-profit-price-required': 'लाभ मूल्य लेना आवश्यक है.',
  'trade.validation.take-profit-price-number':
    'लाभ लाभ मूल्य एक संख्या होनी चाहिए।',
  'trade.validation.take-profit-price-valid-number':
    'टेक प्रॉफिट मूल्य एक वैध संख्या होनी चाहिए।',
  'trade.validation.take-profit-close-percent-number':
    'टेक प्रॉफिट क्लोज़ प्रतिशत एक संख्या होनी चाहिए।',
  'trade.validation.take-profit-close-percent-valid-number':
    'टेक प्रॉफिट क्लोज़ प्रतिशत एक वैध संख्या होनी चाहिए।',
  'trade.validation.take-profit-close-percent-range':
    'टेक प्रॉफिट क्लोज प्रतिशत 1 से 100 के बीच होना चाहिए।',
  'trade.validation.take-profit-total-close-percent-range':
    'टेक प्रॉफिट क्लोज प्रतिशत 100 से अधिक नहीं हो सकता।',
  'validation.custom-field.key-empty': 'फ़ील्ड कुंजी खाली नहीं हो सकती',
  'validation.custom-field.key-conflict':
    'यह फ़ील्ड नाम अंतर्निहित ट्रेड फ़ील्ड के साथ विरोध करता है',
  'validation.custom-field.key-format':
    'फ़ील्ड कुंजी एक अक्षर से शुरू होनी चाहिए और इसमें केवल अक्षर, संख्याएँ और अंडरस्कोर शामिल होने चाहिए',
  'validation.custom-field.required': '{label} आवश्यक है',
  'validation.custom-field.text': '{label} टेक्स्ट होना चाहिए',
  'validation.custom-field.min-length':
    '{label} कम से कम {minLength} वर्ण का होना चाहिए',
  'validation.custom-field.max-length':
    '{label} {maxLength} वर्णों से अधिक नहीं होना चाहिए',
  'validation.custom-field.pattern-invalid': '{label} प्रारूप अमान्य है',
  'validation.custom-field.pattern-invalid-pattern':
    '{label} में अमान्य सत्यापन पैटर्न है',
  'validation.custom-field.number': '{label} एक संख्या होनी चाहिए',
  'validation.custom-field.min': '{label} कम से कम {min} होना चाहिए',
  'validation.custom-field.max': '{label} {max} से अधिक नहीं होना चाहिए',
  'validation.custom-field.selection': '{label} एक वैध चयन होना चाहिए',
  'validation.custom-field.option': '{label} एक वैध विकल्प होना चाहिए',
  'validation.custom-field.array': '{label} चयनों की एक श्रृंखला होनी चाहिए',
  'validation.custom-field.invalid-option':
    '{label} में अमान्य विकल्प शामिल है: {item}',
  'validation.custom-field.date': '{label} एक वैध तिथि होनी चाहिए',
  'validation.custom-field.time': '{label} एक वैध समय होना चाहिए',
  'validation.custom-field.time-format':
    '{label} एक वैध समय प्रारूप होना चाहिए (HH:MM, HH:MM:SS, या AM/PM के साथ 12 घंटे)',
  'validation.custom-field.time-values': '{label} में अमान्य समय मान हैं',

  'notice.login-success': 'सफलतापूर्वक लॉग इन किया गया!',
  'notice.pro-access-ready': 'PRO एक्सेस तैयार है।',

  'notice.logout-success': 'सफलतापूर्वक साइन आउट हो गया',
  'notice.ftp-created': 'एफ़टीपी क्रेडेंशियल सफलतापूर्वक बनाए गए',
  'notice.ftp-reset':
    'एफ़टीपी पासवर्ड सफलतापूर्वक रीसेट हो गया! नया पासवर्ड सेव करें.',
  'notice.ftp-password-rotated':
    'इस डिवाइस के लिए नए एफ़टीपी क्रेडेंशियल तैयार किए गए। अन्य डिवाइस (उदाहरण के लिए आपका MetaTrader EA) पर कॉन्फ़िगर किया गया FTP सिंक नए पासवर्ड के साथ अपडेट किया जाना चाहिए।',
  'notice.ftp-reused':
    'मौजूदा एफ़टीपी क्रेडेंशियल इस डिवाइस से लोड किए गए हैं। यदि वे अब काम नहीं करते हैं, तो पासवर्ड रीसेट करें का उपयोग करें।',
  'notice.template-saved': 'लेआउट सहेजा गया',
  'notice.template-created': 'लेआउट बनाया गया',
  'notice.template-duplicated': 'लेआउट डुप्लिकेट किया गया',
  'notice.template-applied': 'एप्लाइड लेआउट: {name}',
  'notice.template-deleted': 'लेआउट हटा दिया गया',
  'notice.default-template-updated': 'डिफ़ॉल्ट लेआउट अपडेट किया गया',
  'notice.tradelog-saved': 'ट्रेडलॉग सेटिंग्स सफलतापूर्वक सहेजा गया',
  'notice.settings-exported': 'सेटिंग्स एक्सपोर्ट किया गया से {filename}',
  'notice.settings-imported':
    'सेटिंग्स इंपोर्ट को v{version} से सफलतापूर्वक संपादित किया गया। सभी परिवर्तन लागू करने के लिए Obsidian को पुनरारंभ करें।',
  'notice.template-switched': 'पर स्विच किया गया: {name}',
  'notice.hotkey-set': 'हॉटकी सेट: {hotkey}',
  'notice.auto-sync-toggled': 'ऑटो-सिंक {status}',
  'notice.auto-sync-enabled': 'सक्षम',
  'notice.auto-sync-disabled': 'अक्षम',
  'notice.reset-items': 'आइटम को डिफ़ॉल्ट पर रीसेट करें',

  'notice.custom-fields-imported':
    'सफलतापूर्वक इंपोर्ट किया गया {count} कस्टम फ़ील्ड',

  'notice.csv-template-deleted': 'टेम्पलेट "{name}" हटा दिया गया',
  'notice.csv-template-delete-failed': 'टेम्पलेट को हटाने में विफल: {error}',
  'notice.csv-template-imported':
    'टेम्पलेट "{name}" इंपोर्ट सफलतापूर्वक संपन्न हुआ',
  'notice.csv-symbol-mappings-created.one':
    '{count} प्रतीक मानचित्रण बनाया गया',
  'notice.csv-symbol-mappings-created.few': '{count} प्रतीक मैपिंग बनाई गई',
  'notice.csv-symbol-mappings-created.many': '{count} प्रतीक मैपिंग बनाई गई',
  'notice.csv-symbol-mappings-created.other': '{count} प्रतीक मैपिंग बनाई गई',
  'notice.csv-symbol-mapping-skipped': 'प्रतीक मानचित्रण छोड़ दिया गया',
  'notice.csv-missing-fields':
    'कृपया इंपोर्ट करते हुए से पहले सभी आवश्यक फ़ील्ड मैप करें',
  'notice.setups-added': 'सेटअप्स को {count} ट्रेड्स में जोड़ा गया',
  'notice.tags-added': '{count} ट्रेड्स में टैग जोड़े गए',
  'notice.mistakes-added': '{count} ट्रेड्स में गलतियाँ जोड़ी गईं',
  'notice.trades-duplicated.one': 'डुप्लीकेट {count} ट्रेड',
  'notice.trades-duplicated.few': 'डुप्लीकेट {count} ट्रेड्स',
  'notice.trades-duplicated.many': 'डुप्लीकेट {count} ट्रेड्स',
  'notice.trades-duplicated.other': 'डुप्लीकेट {count} ट्रेड्स',
  'notice.trades-deleted.one': '{count} ट्रेड हटा दिया गया',
  'notice.trades-deleted.few': '{count} ट्रेड्स हटा दिया गया',
  'notice.trades-deleted.many': '{count} ट्रेड्स हटा दिया गया',
  'notice.trades-deleted.other': '{count} ट्रेड्स हटा दिया गया',
  'notice.mark-reviewed.one':
    '{count} ट्रेड को रिव्यूड के रूप में चिह्नित किया गया',
  'notice.mark-reviewed.few':
    '{count} ट्रेड्स को रिव्यूड के रूप में चिह्नित किया गया',
  'notice.mark-reviewed.many':
    '{count} ट्रेड्स को रिव्यूड के रूप में चिह्नित किया गया',
  'notice.mark-reviewed.other':
    '{count} ट्रेड्स को रिव्यूड के रूप में चिह्नित किया गया',

  'notice.error.open-journalit':
    'Journalit खोलने में विफल. कृपया Obsidian को पुनः लोड करने का प्रयास करें।',
  'notice.error.open-drc': 'DRC खोलने में विफल: {error}',
  'notice.error.open-trade-log': 'ट्रेड लॉग खोलने में विफल: {error}',
  'notice.error.open-csv-import': 'Trade Import खोलने में विफल: {error}',
  'notice.error.open-account-dashboard': 'अकाउंट्स खोलने में विफल: {error}',
  'notice.error.open-trade-form-edit':
    'संपादन मोड में ट्रेड फॉर्म खोलने में विफल: {error}',
  'notice.error.open-weekly-review': 'वीकली रिव्यू खोलने में विफल: {error}',
  'notice.error.open-monthly-review': 'मंथली रिव्यू खोलने में विफल: {error}',
  'notice.error.open-quarterly-review':
    'क्वार्टरली रिव्यू खोलने में विफल: {error}',
  'notice.error.open-yearly-review': 'इयरली रिव्यू खोलने में विफल: {error}',
  'notice.error.open-onboarding':
    'ऑनबोर्डिंग प्रवाह खोलने में विफल. विवरण के लिए कंसोल जांचें.',

  'notice.error.open-release-notes': 'रिलीज़ नोट खोलने में विफल: {error}',
  'notice.error.open-update-notification':
    'अद्यतन अधिसूचना खोलने में विफल: {error}',
  'notice.error.open-layout-builder': 'लेआउट बिल्डर खोलने में विफल: {error}',
  'notice.error.switch-template': 'लेआउट स्विच करने में विफल: {error}',
  'notice.error.switch-template-generic': 'लेआउट स्विच करने में विफल',

  'notice.error.no-active-file':
    'कोई सक्रिय फ़ाइल नहीं. सबसे पहले एक नोट खोलें.',
  'notice.error.no-template-support':
    'यह नोट प्रकार लेआउट का समर्थन नहीं करता.',
  'notice.error.no-templates': 'इस नोट प्रकार के लिए कोई लेआउट उपलब्ध नहीं है.',
  'notice.error.asset-type-required':
    'इंस्ट्रूमेंट जोड़ते समय एसेट टाइप आवश्यक है',
  'notice.error.column-required': 'कम से कम एक कॉलम दृश्यमान रहना चाहिए',
  'notice.error.save-settings': 'सेटिंग्स को सहेजने में त्रुटि: {error}',
  'notice.error.sign-in-vault':
    'कृपया अपना वॉल्ट पंजीकृत करने के लिए साइन इन करें।',
  'notice.error.sign-in-sync':
    'कृपया स्वचालित सिंक का उपयोग करने के लिए साइन इन करें।',
  'notice.error.restore-auth':
    'प्रमाणीकरण पुनर्स्थापित करने में विफल. कृपया सेटिंग्स → Auth से दोबारा साइन इन करें।',
  'notice.error.export-settings':
    'सेटिंग्स एक्सपोर्ट करने में विफल। विवरण के लिए कंसोल जाँचें.',
  'notice.error.import-settings': 'सेटिंग्स इंपोर्ट करने में विफल: {error}',
  'notice.error.reset-settings':
    'सेटिंग्स को रीसेट करने में विफल। विवरण के लिए कंसोल जांचें.',

  'notice.error.cannot-change-folder-during-sync':
    'सिंक प्रगति पर होने पर फ़ोल्डर पथ नहीं बदला जा सकता। कृपया सिंक के पूरा होने तक प्रतीक्षा करें।',
  'notice.error.file-not-found': 'फ़ाइल नहीं मिली: {path}',

  'notice.error.mark-reviewed':
    'ट्रेड्स को रिव्यूड के रूप में चिह्नित करने में त्रुटि: {error}',
  'notice.error.add-setups': 'सेटअप्स जोड़ने में त्रुटि: {error}',
  'notice.error.add-tags': 'टैग जोड़ने में त्रुटि: {error}',
  'notice.error.add-mistakes': 'ग़लतियाँ जोड़ने में त्रुटि: {error}',
  'notice.error.delete-trades': 'ट्रेड्स को हटाने में त्रुटि: {error}',
  'notice.error.duplicate-trades':
    'ट्रेड्स की प्रतिलिपि बनाने में त्रुटि: {error}',
  'notice.error.csv-validation': 'CSV/XLSX/XLS सत्यापन विफल: {errors}',
  'notice.error.import-failed': 'इंपोर्ट विफल: {error}',
  'notice.error.file-too-large': 'फ़ाइल बहुत बड़ी है। अधिकतम आकार 10 एमबी है',
  'notice.error.select-csv': 'कृपया एक CSV/XLSX/XLS/HTML फ़ाइल चुनें',
  'notice.error.cannot-delete-builtin':
    'अंतर्निहित लेआउट को हटाया नहीं जा सकता',
  'notice.error.duplicate-to-customize':
    'इस लेआउट को अनुकूलित करने के लिए इसकी प्रतिलिपि बनाएँ',
  'notice.error.sign-out': 'साइन आउट करने में विफल. कृपया पुन: प्रयास करें।',
  'notice.error.open-upgrade-modal':
    'एक प्रीमियम सुविधा का अनुरोध किया गया था लेकिन अपग्रेड संवाद लोड होने में विफल रहा।',

  'notice.plugin-updated': 'Journalit को v{version} में अपडेट किया गया!',
  'notice.info.settings-recovered':
    'सेटिंग्स को बैकअप से पुनर्प्राप्त किया गया। हाल के कुछ बदलाव खो सकते हैं.',
  'notice.info.cannot-remove-locked':
    'लॉक किए गए विजेट्स को हटाया नहीं जा सकता',
  'notice.sync-mapping.updating':
    'नए फ़ोल्डर पथ के लिए ट्रेड सिंक मैपिंग अपडेट कर रहा है...',
  'notice.sync-mapping.updated': 'ट्रेड सिंक मैपिंग सफलतापूर्वक अपडेट की गई',
  'notice.error.sync-mapping-update-failed':
    'ट्रेड सिंक मैपिंग अपडेट करने में विफल। कृपया प्लगइन पुनः आरंभ करें.',
  'tradelog.title': 'ट्रेड लॉग',
  'tradelog.root.all-trades': 'सभी ट्रेड्स',
  'tradelog.view.selector.label': 'देखें',

  'trade-form.guide.customization-modal.title':
    'फॉर्म को अपने वर्कफ़्लो के अनुरूप बनाएं',
  'trade-form.guide.customization-modal.description':
    'यहां आप वैकल्पिक ब्लॉक दिखा सकते हैं, छुपा सकते हैं और पुन: व्यवस्थित कर सकते हैं। फ़ॉर्म को उन फ़ील्ड पर केंद्रित रखें जिनका आप वास्तव में उपयोग करते हैं।',
  'trade-form.guide.finish.title': 'यही कस्टमाइज़ेशन फीचर है',
  'trade-form.guide.finish.description':
    'जब भी ट्रेड फॉर्म को एक अलग जर्नलिंग वर्कफ़्लो से मेल खाने की आवश्यकता हो तो आप इस बटन पर दोबारा जा सकते हैं।',
  'tradelog.guide.empty.intro.title': 'ट्रेड लॉग में आपका स्वागत है',
  'tradelog.guide.empty.intro.description':
    'यह पेज ट्रेड्स ब्राउज़ करने, सॉर्ट करने और रिव्यू करने की आपकी मुख्य जगह बन जाता है। ट्रेड्स जोड़ने के बाद आपको पूरा ट्रेड लॉग टूर भी मिलेगा।',
  'tradelog.guide.empty.state.title': 'कोई ट्रेडिंग डेटा उपलब्ध नहीं है',
  'tradelog.guide.empty.state.description':
    'अपना प्रदर्शन देखने के लिए पिछले ट्रेड्स इंपोर्ट करें, या मैन्युअल रूप से एक नया ट्रेड रिकॉर्ड करें।',
  'tradelog.guide.intro.title': 'यह आपका ट्रेड लॉग है',
  'tradelog.guide.intro.description':
    'इस पेज पर ट्रेड्स एक-एक करके रिव्यू करें, उन्हें सॉर्ट करें, फ़िल्टर करें, और एक साथ कई ट्रेड्स में बदलाव करें।',
  'tradelog.guide.view-selector.title':
    'चुनें कि आप अपना इतिहास कैसे रिव्यू करना चाहते हैं',
  'tradelog.guide.view-selector.description':
    'पूरी ट्रेड टेबल और महीने, सप्ताह या दिन जैसे ग्रुप किए हुए टाइम व्यू के बीच स्विच करने के लिए इस मेनू का उपयोग करें। ट्रेड्स डिफ़ॉल्ट है, लेकिन जब आप अवधि के हिसाब से रिव्यू करना चाहें तो ग्रुप व्यू काम आते हैं।',
  'tradelog.guide.filters.title':
    'ट्रेड लॉग को संकीर्ण करने के लिए फ़िल्टर्स का उपयोग करें',
  'tradelog.guide.filters.description':
    'जब आप केवल कुछ अकाउंट्स, सेटअप्स, टैग, ट्रेड प्रकार, स्टेटस या तारीखें रिव्यू करना चाहें तो फ़िल्टर्स खोलें।',
  'tradelog.guide.filter-modal.title': 'ये आपके विस्तृत फ़िल्टर्स हैं',
  'tradelog.guide.filter-modal.description':
    'जब आप ठीक-ठीक नियंत्रित करना चाहें कि कौन से ट्रेड्स दिखें, तब इस मोडल का उपयोग करें। रिव्यू या फ़िल्टर बदलना खत्म होने पर इसे बंद कर दें।',
  'tradelog.guide.sorting.title':
    'तालिका को क्रमबद्ध करने के लिए कॉलम हेडर पर क्लिक करें',
  'tradelog.guide.sorting.description':
    'ट्रेड्स दृश्य में, तालिका को पुन: व्यवस्थित करने के लिए क्रमबद्ध कॉलम हेडर पर क्लिक करें। उदाहरण के लिए, अपनी सबसे बड़ी जीत और सबसे बड़ी हार के आधार पर क्रमबद्ध करने के लिए Net P&L पर क्लिक करें।',
  'tradelog.guide.gallery-mode.title': 'एक इमेज गैलरी भी है',
  'tradelog.guide.gallery-mode.description':
    'अपने ट्रेड स्क्रीनशॉट को गैलरी के रूप में देखने के लिए यहाँ मोड बदलें। पहली बार खोलने पर एक छोटा गाइड आपको सब दिखाएगा।',
  'tradelog.guide.multi-select.title': 'बहु-चयन चालू करें',
  'tradelog.guide.multi-select.description':
    'एक साथ कई ट्रेड्स का चयन करने के लिए इस बटन पर क्लिक करें। जब बहु-चयन चालू होता है, तो पंक्ति क्लिक उन्हें खोलने के बजाय ट्रेड्स का चयन करती है।',
  'tradelog.guide.batch-actions.title': 'ये आपकी बैच क्रियाएं हैं',
  'tradelog.guide.batch-actions.description':
    'सभी दृश्यमान ट्रेड्स का चयन करने के लिए इस बार का उपयोग करें, अपना चयन साफ़ करें, ट्रेड्स को रिव्यूड के रूप में चिह्नित करें, सेटअप्स जोड़ें, गलतियाँ जोड़ें, ट्रेड्स की नकल करें, या एक साथ कई ट्रेड्स को हटा दें। आप ट्रेड्स की रेंज चुनने के लिए शिफ्ट-क्लिक भी कर सकते हैं।',
  'tradelog.guide.column-settings.title': 'कॉलम सेटिंग्स खोलें',
  'tradelog.guide.column-settings.description':
    'यह चुनने के लिए इस बटन पर क्लिक करें कि कौन से कॉलम दिखाए जाएं और तालिका कितनी सघन या विस्तृत होनी चाहिए।',
  'tradelog.guide.active-columns.title':
    'आपके द्वारा पहले से उपयोग किए गए कॉलम को पुनः व्यवस्थित करें या हटा दें',
  'tradelog.guide.active-columns.description':
    'सक्रिय कॉलम में, किसी कॉलम को स्थानांतरित करने के लिए उसे खींचें, या जिस कॉलम की आपको आवश्यकता नहीं है उसे हटा दें। इससे तालिका का क्रम बाएँ से दाएँ बदल जाता है।',
  'tradelog.guide.available-columns.title':
    'जब आपको अधिक विवरण की आवश्यकता हो तो छिपे हुए कॉलम वापस जोड़ें',
  'tradelog.guide.available-columns.description':
    'फ़ील्ड को तालिका में वापस जोड़ने के लिए उपलब्ध कॉलम खोलें। यहीं पर आप पहले हटाई गई कोई भी चीज़ वापस लाते हैं।',
  'tradelog.guide.open-trades.title':
    'जब आप ट्रेड का नोट खोलना चाहें तो उस पर क्लिक करें',
  'tradelog.guide.open-trades.description':
    'सामान्य मोड में, ट्रेड पर क्लिक करने से यह खुल जाता है। बहु-चयन मोड में, क्लिक करने से इसका चयन हो जाता है। आप क्या करना चाहते हैं इसके आधार पर उन दो व्यवहारों के बीच स्विच करें।',
  'dashboard.guide.empty.intro.title': 'आपके डैशबोर्ड में आपका स्वागत है',
  'dashboard.guide.empty.intro.description':
    'जैसे ही Journalit के पास विश्लेषण करने के लिए ट्रेडिंग इतिहास होता है, आपका डैशबोर्ड उपयोगी हो जाता है।',
  'dashboard.guide.empty.state.title': 'अपना ट्रेडिंग इतिहास अपने साथ लाएँ',
  'dashboard.guide.empty.state.description':
    'सार्थक प्रदर्शन डेटा के साथ शुरू करने के लिए पिछले ट्रेड्स इंपोर्ट करें, या अगर आप अपने पहले ट्रेड्स रिकॉर्ड कर रहे हैं तो मैन्युअल रूप से ट्रेड जोड़ें।',
  'dashboard.guide.main.intro.title': 'यह आपका डैशबोर्ड है',
  'dashboard.guide.main.intro.description':
    'इस पेज पर अपना प्रदर्शन ट्रैक करें, अपने आँकड़े रिव्यू करें, और अपने सबसे काम के चार्ट एक जगह रखें।',
  'dashboard.guide.main.filters.title':
    'फ़िल्टर्स संपूर्ण डैशबोर्ड को बदल देता है',
  'dashboard.guide.main.filters.description':
    'जब आप चाहते हैं कि इस पृष्ठ पर प्रत्येक स्टेट और चार्ट एक अलग दिनांक सीमा, अकाउंट, सेटअप, टैग, या ट्रेड प्रकार के लिए अपडेट हो तो फ़िल्टर का उपयोग करें।',
  'dashboard.guide.main.edit-layout.title':
    'इस पृष्ठ को अनुकूलित करने के लिए संपादन मोड चालू करें',
  'dashboard.guide.main.edit-layout.description':
    'डैशबोर्ड विजेट को स्थानांतरित करने, आकार बदलने, हटाने और जोड़ने को अनलॉक करने के लिए लेआउट संपादित करें पर क्लिक करें।',
  'dashboard.guide.main.open-widget-selector.title': 'विजेट जोड़ें खोलें',
  'dashboard.guide.main.open-widget-selector.description':
    'और चार्ट जोड़ने और पहले हटाए गए विजेट वापस लाने के लिए विजेट जोड़ें पर क्लिक करें।',
  'dashboard.guide.main.widget-picker.title':
    'आप जो दिखाना चाहते हैं उसे चुनें',
  'dashboard.guide.main.widget-picker.description':
    'यह पिकर वे चार्ट और मेट्रिक्स दिखाता है जो वर्तमान में आपके डैशबोर्ड पर नहीं हैं। जोड़ने के लिए किसी एक को क्लिक करें।',
  'dashboard.guide.main.metrics.title': 'ये शीर्ष कार्ड आपका त्वरित सारांश हैं',
  'dashboard.guide.main.metrics.description':
    'शीर्ष पंक्ति आपको लाभ, विन रेट और कुल ट्रेड्स जैसे त्वरित उत्तर देती है। संपादन मोड में, आप बदल सकते हैं कि कौन से कार्ड दिखाई दें और उन्हें पुन: व्यवस्थित करें।',
  'dashboard.guide.main.bottom.title':
    'यहीं पर स्थानांतरण और आकार बदलना होता है',
  'dashboard.guide.main.bottom.description':
    'जब संपादन लेआउट चालू हो, तो इसे स्थानांतरित करने के लिए विजेट खींचें। विजेट का आकार बदलने के लिए, इसके निचले-दाएँ कोने को खींचें। यह वह कदम है जिसे कई उपयोगकर्ता भूल जाते हैं।',
  'dashboard.guide.main.save-layout.title':
    'जब आपका काम पूरा हो जाए तो अपना लेआउट सहेजें',
  'dashboard.guide.main.save-layout.description':
    'जब आप कस्टमाइज़ करना समाप्त कर लें, तो अपने परिवर्तनों को बनाए रखने के लिए लेआउट सहेजें पर क्लिक करें। आप कभी भी वापस आकर इस पृष्ठ को दोबारा संपादित कर सकते हैं।',
  'home.guide.intro.title': 'होम में आपका स्वागत है',
  'home.guide.intro.description':
    'यह आपका मुख्य पृष्ठ है. यह आपके ट्रेडिंग आँकड़े, त्वरित कार्रवाई और शेष Journalit के शॉर्टकट दिखाता है।',
  'home.guide.filters.title':
    'ये बटन बदलते हैं कि आपके विजेट्स क्या दिखाते हैं',
  'home.guide.filters.description':
    'समय अवधि, ट्रेड प्रकार, या अकाउंट स्विच करने के लिए इनका उपयोग करें ताकि आपका होम विजेट वह डेटा दिखा सके जिसे आप देखना चाहते हैं।',
  'home.guide.settings.title': 'Journalit की सेटिंग्स हमेशा पास में हैं',
  'home.guide.settings.description':
    'Journalit की सेटिंग्स सीधे खोलने के लिए इस बटन का उपयोग करें।',
  'home.guide.customize.title':
    'होम को अनुकूलित करने के लिए संपादन मोड चालू करें',
  'home.guide.customize.description':
    'कस्टमाइज़ करना शुरू करने के लिए इस बटन पर क्लिक करें। संपादन मोड विजेट्स को स्थानांतरित करने, आकार बदलने, हटाने और जोड़ने को अनलॉक करता है।',
  'home.guide.quick-links-position.title':
    'त्वरित लिंक को विजेट्स के ऊपर या नीचे ले जाएँ',
  'home.guide.quick-links-position.description':
    'यह चुनने के लिए इस बटन का उपयोग करें कि त्वरित लिंक पंक्ति मुख्य विजेट क्षेत्र के ऊपर है या उसके नीचे।',
  'home.guide.quick-links.title': 'ये त्वरित लिंक आपके तेज़ शॉर्टकट हैं',
  'home.guide.quick-links.description':
    'त्वरित लिंक आपको सामान्य क्रियाओं और पृष्ठों के लिए एक-क्लिक शॉर्टकट प्रदान करते हैं। संपादन मोड में, आप उन लिंक को भी छिपा सकते हैं जिन्हें आप यहां दिखाना नहीं चाहते हैं।',
  'home.guide.move-and-resize.title':
    'अपने विजेट्स को स्थानांतरित करें और उनका आकार बदलें',
  'home.guide.widget-picker.title': 'यहां विजेट्स जोड़ें',
  'home.guide.widget-picker.description':
    'विजेट जोड़ें, त्वरित लिंक वापस लाएँ या खाते और सेटअप के शॉर्टकट जोड़ें।',
  'home.guide.move-and-resize.description':
    'यह मुख्य क्षेत्र है जिसे आप संपादन मोड में पुनर्व्यवस्थित कर सकते हैं। विजेट को स्थानांतरित करने के लिए खींचें, या विजेट का आकार बदलने के लिए उसके निचले-दाएं कोने से खींचें।',
  'home.guide.add-widget.title': 'होम में आइटम जोड़ें',
  'home.guide.add-widget.description':
    'विजेट, त्वरित लिंक या खाते और सेटअप के शॉर्टकट जोड़ने के लिए विजेट जोड़ें खोलें।',
  'home.guide.save-layout.title':
    'जब आपका काम पूरा हो जाए तो अपना लेआउट सहेजें',
  'home.guide.save-layout.description':
    'जब आप लेआउट से खुश हों, तो अपने परिवर्तनों को सहेजने और संपादन मोड छोड़ने के लिए इस बटन पर क्लिक करें।',
  'home.guide.widget-interactions.title': 'यही होम का मुख्य आइडिया है',
  'home.guide.widget-interactions.description':
    'होम आपका अनुकूलन योग्य डैशबोर्ड है। लेआउट बदलने के लिए संपादन मोड का उपयोग करें, और टूल, सेटिंग्स, या गहरे पेज खोलने के लिए विजेट्स पर क्लिक करें।',
  'layoutBuilder.guide.intro.title': 'यह आपका लेआउट बिल्डर है',
  'layoutBuilder.guide.intro.description':
    'यह पृष्ठ नियंत्रित करता है कि आपके रिव्यू लेआउट कैसे संरचित हैं। शुरू करने का सबसे आसान तरीका एक अंतर्निहित लेआउट की नकल करना है, फिर अपनी कॉपी को कस्टमाइज़ करना है।',
  'layoutBuilder.guide.sidebar-overview.title':
    'यह साइडबार वह जगह है जहां आप चुनते हैं कि आप क्या संपादित कर रहे हैं',
  'layoutBuilder.guide.sidebar-overview.description':
    'साइडबार में प्रत्येक अनुभाग एक अलग लेआउट प्रकार है। ट्रेड लेआउट आपके रिव्यू लेआउट से अलग हैं, और लाइब्रेरी अनुभाग लेआउट साझा करने के लिए है। अपनी स्वयं की प्रतिलिपि बनाने के बाद, आप इसे नए रिव्यू नोटों के लिए डिफ़ॉल्ट बनाने के लिए तारांकित कर सकते हैं।',
  'layoutBuilder.guide.pick-built-in.title':
    'अंतर्निहित DRC लेआउट से प्रारंभ करें',
  'layoutBuilder.guide.pick-built-in.description':
    'अपने पहले लेआउट के लिए, अंतर्निहित DRC लेआउट में से एक से शुरुआत करें। अपनी स्वयं की प्रतिलिपि बनाने से पहले यह आपको एक सुरक्षित प्रारंभिक बिंदु देता है।',
  'layoutBuilder.guide.duplicate.title': 'अंतर्निहित लेआउट को डुप्लिकेट करें',
  'layoutBuilder.guide.duplicate.description':
    'अंतर्निर्मित लेआउट शुरुआती बिंदु हैं। पहले एक डुप्लिकेट बनाएं ताकि आप सुरक्षित रूप से अपना स्वयं का संस्करण बना सकें।',
  'layoutBuilder.guide.preview-template.title':
    'यह प्रिव्यू दिखाता है कि लेआउट कैसा दिखेगा',
  'layoutBuilder.guide.preview-template.description':
    'प्रिव्यू पर स्क्रॉल करें और प्रवाह का अनुभव प्राप्त करें। यह यह जांचने के लिए उपयोगी है कि लेआउट को संपादित करना शुरू करने से पहले वह स्पष्ट रूप से पढ़ रहा है या नहीं।',
  'layoutBuilder.guide.switch-to-editor.title': 'संपादक पर स्विच करें',
  'layoutBuilder.guide.switch-to-editor.description':
    'प्रिव्यू आपको दिखाता है कि लेआउट कैसा दिखेगा। संपादक वह जगह है जहां आप वास्तव में इसे बदलते हैं।',
  'layoutBuilder.guide.editor-overview.title':
    'यह वह जगह है जहां आप लेआउट संपादित करते हैं',
  'layoutBuilder.guide.editor-overview.description':
    'यहां लेआउट का नाम बदलें, रिव्यू विजेट सूची, विजेट्स को पुनर्व्यवस्थित करने के लिए बाएं हैंडल को खींचें, इसे बदलने के लिए विजेट पर क्लिक करें, और जो कुछ भी आपको आवश्यकता नहीं है उसे हटा दें।',
  'layoutBuilder.guide.add-widget.title': 'अपनी कॉपी में एक विजेट जोड़ें',
  'layoutBuilder.guide.add-widget.description':
    'अपने लेआउट में नए ब्लॉक डालने के लिए विजेट जोड़ें का उपयोग करें। इसी तरह आप वर्कफ़्लो को अपने रिव्यू से मिलाते हैं।',
  'layoutBuilder.guide.open-widget-picker.title': 'विजेट पिकर खोलें',
  'layoutBuilder.guide.open-widget-picker.description':
    'यह पिकर विजेट दिखाता है जिसे आप इस रिव्यू प्रकार के लिए जोड़ सकते हैं।',
  'layoutBuilder.guide.choose-widget.title': 'एक विजेट चुनें',
  'layoutBuilder.guide.choose-widget.description':
    'नाम, विवरण या श्रेणी के आधार पर विजेट खोजने के लिए खोज बॉक्स में टाइप करें, फिर उसे चुनें। आप नेक्स्ट भी दबा सकते हैं और Journalit आपके लिए पहला परिणाम चुन लेगा।',
  'layoutBuilder.guide.widget-library-docs.title':
    'यदि आप फंस जाते हैं तो विजेट लाइब्रेरी का उपयोग करें',
  'layoutBuilder.guide.widget-library-docs.description':
    'यह प्रत्येक रिव्यू प्रकार के लिए विजेट लाइब्रेरी, उदाहरण और उपलब्धता तालिका के साथ दस्तावेज़ पृष्ठ खोलता है।',
  'layoutBuilder.guide.save-template.title': 'अपना लेआउट सहेजें',
  'layoutBuilder.guide.save-template.description':
    'एक बार जब आपकी कॉपी सही दिखने लगे तो उसे सेव कर लें। आप इसे बाद में परिष्कृत करना जारी रख सकते हैं क्योंकि आपकी रिव्यू प्रक्रिया में सुधार होता है।',
  'layoutBuilder.guide.set-default-template.title':
    'इस प्रतिलिपि को अपने डिफ़ॉल्ट लेआउट के रूप में सेट करें',
  'layoutBuilder.guide.set-default-template.description':
    'यदि आप चाहते हैं कि नए रिव्यू नोट स्वचालित रूप से इस लेआउट का उपयोग करें तो अपने नए लेआउट पर स्टार पर क्लिक करें।',
  'tradelog.empty': 'कोई ट्रेड्स नहीं मिला',
  'tradelog.empty.submessage':
    'ट्रेड नोट्स बनाना शुरू करें ताकि वे आपके ट्रेड लॉग में दिखाई दें।',
  'tradelog.processing': 'ट्रेड डेटा संसाधित हो रहा है...',
  'tradelog.node.file-not-found': 'ट्रेड फ़ाइल नहीं मिली: {path}',
  'tradelog.node.expand': 'विस्तार करें',
  'tradelog.node.collapse': 'संक्षिप्त करें',
  'tradelog.node.navigate-to-review': '{type} रिव्यू पर नेविगेट करें',
  'tradelog.node.performance.year': '{indicator} प्रदर्शन वर्ष',
  'tradelog.node.performance.quarter':
    '{indicator} {year} का तिमाही प्रदर्शन कर रहा है',
  'tradelog.node.performance.month':
    '{indicator} {quarter} {year} का प्रदर्शन माह',
  'tradelog.node.performance.week':
    '{indicator} {month} {year} का प्रदर्शन सप्ताह',
  'tradelog.node.performance.day': '{indicator} {week} {year} का प्रदर्शन दिवस',
  'tradelog.node.performance.period': '{indicator} प्रदर्शन अवधि',
  'tradelog.filter.all': 'सभी स्टेटस',
  'tradelog.filter.all.desc': 'सभी ट्रेड स्थितियाँ',
  'tradelog.filter.all-review-statuses': 'सभी रिव्यूज़',
  'tradelog.filter.all-directions': 'सभी दिशाएँ',
  'tradelog.filter.winners': 'विनर्स',
  'tradelog.filter.winners.desc': 'विनिंग ट्रेड्स',
  'tradelog.filter.losers': 'लूज़र्स',
  'tradelog.filter.losers.desc': 'लूज़िंग ट्रेड्स',
  'tradelog.filter.breakeven': 'ब्रेकईवन',
  'tradelog.filter.breakeven.desc': 'ब्रेकईवन ट्रेड्स',
  'tradelog.filter.open': 'ओपन',
  'tradelog.filter.open.desc': 'अभी ओपन पोजीशन्स',
  'tradelog.filter.closed': 'क्लोज्ड',
  'tradelog.filter.closed.desc': 'सभी बंद पोजीशन्स (जीत/नुकसान/ब्रेकईवन)',
  'tradelog.type.all': 'सभी प्रकार',
  'tradelog.type.all.desc': 'सभी ट्रेड प्रकार',
  'tradelog.type.regular': 'नियमित',
  'tradelog.type.regular.desc': 'मानक ट्रेड्स',
  'tradelog.type.missed': 'मिस्ड',
  'tradelog.type.missed.desc': 'अवसर चूक गए',
  'tradelog.type.backtest': 'बैकटेस्ट',
  'tradelog.type.backtest.desc': 'सिम्युलेटेड ट्रेड्स',
  'tradelog.status.win': 'WIN',
  'tradelog.status.loss': 'LOSS',
  'tradelog.status.open': 'खुला',
  'tradelog.status.partially-closed': 'आंशिक रूप से बंद',
  'tradelog.status.cancelled': 'रद्द किया गया',
  'tradelog.status.breakeven': 'BREAKEVEN',
  'tradelog.status.missed': 'मिस्ड',
  'tradelog.status.backtest': 'BACKTEST',
  'tradelog.status.expired': 'खत्म हो चुका',
  'tradelog.no-columns': 'कोई कॉलम कॉन्फ़िगर नहीं किया गया',
  'tradelog.duration.ongoing': '(चल रहे)',
  'tradelog.tooltip.mistakes': 'गलतियाँ:',
  'tradelog.tooltip.setups': 'सेटअप्स:',
  'tradelog.tooltip.tags': 'टैग:',
  'tradelog.tooltip.thesis': 'थीसिस:',
  'tradelog.tooltip.mtComment': 'एमटी टिप्पणी:',
  'tradelog.tooltip.accounts': 'अकाउंट्स:',
  'tradelog.copy-trade.tooltip': '{account} से {multiplier}x पर कॉपी किया गया',
  'tradelog.tooltip.partial-exits': 'आंशिक एग्जिट्स:',
  'tradelog.copy-trade.base-tooltip-title': 'अकाउंट परिणाम कॉपी किए गए',
  'tradelog.copy-trade.adjustment-action': 'कॉपी किए गए P&L को समायोजित करें',
  'tradelog.copy-trade.adjustment-title': 'कॉपी किए गए P&L को समायोजित करें',
  'tradelog.copy-trade.adjustment-description-primary':
    'इस कॉपी किए गए ट्रेड के लिए मैन्युअल P&L समायोजन दर्ज करें।',
  'tradelog.copy-trade.adjustment-description-secondary':
    'ख़राब भरण/लागत के लिए ऋणात्मक संख्या का उपयोग करें।',
  'tradelog.copy-trade.adjustment-preview': 'प्रिव्यू नेट P&L:',

  'tradelog.copy-trade.adjustment-invalid': 'एक वैध P&L समायोजन दर्ज करें।',
  'tradelog.copy-trade.adjustment-saved':
    'कॉपी किया गया ट्रेड P&L समायोजन सहेजा गया।',
  'tradelog.tooltip.still-open': 'अभी भी खुला',

  'tradelog.alt.trade-image': '{instrument} छवि',
  'tradelog.alt.trade-image-n': '{instrument} छवि {n}',
  'tradelog.batch.delete-confirm.title': 'हटाने की पुष्टि करें',
  'tradelog.batch.delete-confirm.message.one':
    'क्या आप वाकई {count} चयनित ट्रेड को हटाना चाहते हैं?',
  'tradelog.batch.delete-confirm.message.few':
    'क्या आप वाकई {count} चयनित ट्रेड्स को हटाना चाहते हैं?',
  'tradelog.batch.delete-confirm.message.many':
    'क्या आप वाकई {count} चयनित ट्रेड्स को हटाना चाहते हैं?',
  'tradelog.batch.delete-confirm.message.other':
    'क्या आप वाकई {count} चयनित ट्रेड्स को हटाना चाहते हैं?',
  'tradelog.batch.delete-confirm.warning':
    'इस एक्शन को वापस नहीं किया जा सकता।',
  'tradelog.batch.setups.title': 'सेटअप्स को ट्रेड्स में जोड़ें',
  'tradelog.batch.setups.placeholder': 'सेटअप्स चुनें या बनाएं...',
  'tradelog.batch.tags.title': 'ट्रेड्स में टैग जोड़ें',
  'tradelog.batch.tags.placeholder': 'टैग चुनें या बनाएं...',
  'tradelog.batch.mistakes.title': 'ट्रेड्स में गलतियाँ जोड़ें',
  'tradelog.batch.mistakes.placeholder': 'गलतियाँ चुनें या बनाएँ...',
  'tradelog.batch.none-selected': 'कोई भी चयनित नहीं',
  'tradelog.batch.selected-count': '{count} चयनित',
  'tradelog.batch.select-all.title': 'सभी दृश्यमान ट्रेड्स का चयन करें',
  'tradelog.batch.select-all.label': 'सभी चुनें',

  'tradelog.batch.already-reviewed':
    'सभी {total} चयनित ट्रेड्स पहले से ही रिव्यूड हैं',
  'tradelog.batch.already-reviewed-single': 'चयनित ट्रेड पहले से ही रिव्यूड है',
  'tradelog.batch.already-reviewed-plain': 'पहले से ही रिव्यूड',
  'tradelog.batch.no-updates-needed':
    'किसी ट्रेड्स को अपडेट की आवश्यकता नहीं है - सभी {total} में पहले से ही ये {type} थे',
  'tradelog.batch.already-had-all': '{count} में पहले से ही सभी {type} थे',
  'tradelog.batch.errors-count.one': '{count} त्रुटि उत्पन्न हुई',
  'tradelog.batch.errors-count.few': '{count} त्रुटियाँ उत्पन्न हुईं',
  'tradelog.batch.errors-count.many': '{count} त्रुटियाँ उत्पन्न हुईं',
  'tradelog.batch.errors-count.other': '{count} त्रुटियाँ उत्पन्न हुईं',
  'tradelog.batch.enable-multi-select': 'बहु-चयन सक्षम करें',
  'tradelog.batch.disable-multi-select': 'बहु-चयन अक्षम करें',
  'tradelog.batch.column-settings': 'कॉलम सेटिंग्स',
  'tradelog.batch.marking-reviewed': 'चिन्हित कर रहा हूँ...',
  'tradelog.batch.add-setups.aria': 'सेटअप्स जोड़ें',

  'tradelog.batch.add-setups.label': 'सेटअप्स जोड़ें',
  'tradelog.batch.add-tags.aria': 'टैगों को जोड़ें',

  'tradelog.batch.add-tags.label': 'टैगों को जोड़ें',
  'tradelog.batch.add-mistakes.aria': 'गलतियाँ जोड़ें',

  'tradelog.batch.add-mistakes.label': 'गलतियाँ जोड़ें',
  'tradelog.batch.adding': 'जोड़ा जा रहा है...',
  'tradelog.batch.add-count': 'जोड़ें ({count})',
  'tradelog.batch.duplicate.aria': 'डुप्लिकेट ट्रेड्स',
  'tradelog.batch.duplicate.label': 'डुप्लिकेट',
  'tradelog.batch.duplicating': 'नकल हो रही है...',
  'tradelog.batch.duplicate-skipped.one':
    '{count} चयनित नोट की नकल नहीं की जा सकती',
  'tradelog.batch.duplicate-skipped.few':
    '{count} चयनित नोट्स की नकल नहीं की जा सकती',
  'tradelog.batch.duplicate-skipped.many':
    '{count} चयनित नोट्स की नकल नहीं की जा सकती',
  'tradelog.batch.duplicate-skipped.other':
    '{count} चयनित नोट्स की नकल नहीं की जा सकती',
  'tradelog.batch.delete.aria': 'ट्रेड्स हटाएं',

  'tradelog.batch.deleting': 'हटाया जा रहा है...',
  'tradelog.batch.clear.aria': 'चयन साफ़ करें',

  'tradelog.batch.clear.label': 'साफ़ करें',
  'tradelog.settings.active-columns': 'सक्रिय कॉलम',
  'tradelog.settings.available-columns': 'उपलब्ध कॉलम',
  'tradelog.settings.active-desc':
    'स्तंभों को पुन: व्यवस्थित करने के लिए खींचें. हटाने के लिए X पर क्लिक करें.',
  'tradelog.settings.available-desc':
    'किसी कॉलम को अपनी तालिका में जोड़ने के लिए उस पर क्लिक करें।',
  'tradelog.settings.no-active':
    'कोई सक्रिय कॉलम नहीं. उपलब्ध टैब से कॉलम जोड़ें.',
  'tradelog.settings.all-active': 'सभी कॉलम सक्रिय हैं.',
  'tradelog.settings.expanded-view': 'विस्तारित दृश्य',
  'tradelog.settings.expanded-view-desc':
    'टैग, सेटअप्स और गलतियों को पिल बैज के रूप में दिखाएं',
  'tradelog.settings.expanded-view-aria': 'विस्तारित दृश्य मोड टॉगल करें',
  'tradelog.settings.saving': 'सहेजा जा रहा है...',
  'tradelog.settings.reset': 'डिफ़ॉल्ट पर रीसेट',
  'tradelog.category.basic': 'बुनियादी जानकारी',
  'tradelog.category.timing': 'समय',
  'tradelog.category.prices': 'कीमतें',
  'tradelog.category.risk': 'रिस्क मैनेजमेंट',
  'tradelog.category.position': 'पोजीशन एवं पी/एल',
  'tradelog.category.review': 'रिव्यू',
  'tradelog.column.image': 'इमेज',
  'tradelog.column.account': 'अकाउंट',
  'tradelog.column.ticker': 'सिंबल',
  'tradelog.column.exchange': 'एक्सचेंज',
  'tradelog.column.status': 'स्टेटस',
  'tradelog.column.direction': 'दिशा',
  'tradelog.column.date': 'ओपन तारीख',
  'tradelog.column.entryTime': 'एंट्री समय',
  'tradelog.column.exitDate': 'क्लोज तारीख',
  'tradelog.column.exitTime': 'एग्जिट समय',
  'tradelog.column.duration': 'अवधि',
  'tradelog.column.expirationDate': 'समाप्ति',
  'tradelog.column.daysToExpiry': 'DTE',
  'tradelog.column.entryPrice': 'एंट्री',
  'tradelog.column.exitPrice': 'एग्जिट',
  'tradelog.column.priceMove': 'मूल्य चाल',
  'tradelog.column.stopLoss': 'स्टॉप लॉस',
  'tradelog.column.slDistanceDollar': 'SL दूरी $',
  'tradelog.column.slDistancePercent': 'SL दूरी %',
  'tradelog.column.riskAmount': 'जोखिम $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.maePrice': 'MAE कीमत',
  'tradelog.column.mfePrice': 'MFE कीमत',
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': 'साइज़ #',
  'tradelog.column.positionValue': 'साइज़ $',
  'tradelog.column.fees': 'शुल्क',
  'tradelog.column.dividends': 'लाभांश',
  'tradelog.column.pnl': 'नेट P&L',
  'tradelog.column.returnPercent': 'रिटर्न %',
  'tradelog.column.setups': 'सेटअप्स',
  'tradelog.column.mistakes': 'गलतियाँ',
  'tradelog.column.tags': 'टैग्स',
  'tradelog.column.reviewed': 'रिव्यूड',
  'tradelog.column.thesis': 'थीसिस',
  'tradelog.column.mtComment': 'MT कमेंट',
  'dashboard.title': 'डैशबोर्ड',
  'dashboard.empty.message': 'कोई ट्रेडिंग डेटा उपलब्ध नहीं है',
  'dashboard.empty.submessage':
    'अपना प्रदर्शन देखने के लिए पिछले ट्रेड्स इंपोर्ट करें, या मैन्युअल रूप से एक नया ट्रेड रिकॉर्ड करें।',
  'dashboard.empty.import-action': 'मौजूदा ट्रेड्स इंपोर्ट करें',
  'dashboard.empty.manual-action': 'मैन्युअल रूप से ट्रेड जोड़ें',
  'dashboard.empty.filter-hint':
    'अपने फ़िल्टर सेटिंग्स को समायोजित करने का प्रयास करें',
  'dashboard.error.load-failed': 'डेटा लोड करने में विफल',
  'dashboard.no-data': 'कोई ट्रेडिंग डेटा उपलब्ध नहीं है',
  'dashboard.button.add-widget': 'विजेट जोड़ें',
  'dashboard.button.save-layout': 'लेआउट सहेजें',
  'dashboard.button.edit-layout': 'लेआउट संपादित करें',
  'dashboard.metrics.netPnL': 'नेट P&L',
  'dashboard.metrics.incl-unrealized': 'सहित {value} अनरियलाइज़्ड',
  'dashboard.metrics.winRate': 'विन रेट',
  'dashboard.metrics.profitFactor': 'प्रॉफिट फैक्टर',
  'dashboard.metrics.sharpeRatio': 'शार्प रेशियो',
  'dashboard.metrics.expectancy': 'एक्सपेक्टेंसी',
  'dashboard.metrics.numTrades': 'कुल ट्रेड्स',

  'dashboard.metrics.numWinTrades': 'विनिंग ट्रेड्स',
  'dashboard.metrics.numLossTrades': 'लूज़िंग ट्रेड्स',
  'dashboard.metrics.avgWin': 'औसत विन',
  'dashboard.metrics.avgLoss': 'औसत लॉस',
  'dashboard.metrics.totalCommission': 'कुल ब्रोकरेज',
  'dashboard.metrics.totalFees': 'कुल शुल्क',
  'dashboard.metrics.maxDrawdown': 'मैक्स ड्रॉडाउन',
  'dashboard.metrics.bestDay': 'सबसे अच्छा दिन',
  'dashboard.metrics.largestWin': 'सबसे बड़ा विन',
  'dashboard.metrics.largestLoss': 'सबसे बड़ा लॉस',
  'dashboard.metrics.longestWinStreak': 'बेस्ट स्ट्रीक',
  'dashboard.metrics.longestLossStreak': 'वर्स्ट स्ट्रीक',
  'dashboard.metrics.avgHoldTime': 'औसत होल्ड टाइम',
  'dashboard.metrics.avgWinHoldTime': 'औसत विन होल्ड टाइम',
  'dashboard.metrics.avgLossHoldTime': 'औसत लॉस होल्ड टाइम',
  'dashboard.metrics.avgWinnerHeat': 'औसत विनर हीट',
  'dashboard.metrics.winnerMaeP90': 'विनर MAE P90',
  'dashboard.metrics.winnerMaeMedian': 'विनर MAE मीडियन',
  'dashboard.metrics.avgLossHeat': 'औसत लॉस हीट',
  'dashboard.metrics.winnerAvgMfe': 'विनर औसत MFE',
  'dashboard.metrics.loserAvgMfe': 'लूज़र औसत MFE',
  'dashboard.metrics.winnerMfeP90': 'विनर MFE P90',
  'dashboard.metrics.loserMfeP90': 'लूज़र MFE P90',
  'dashboard.metrics.avgRR': 'औसत RR (पेऑफ)',
  'dashboard.metrics.avgRRRiskBased': 'औसत RR (R-आधारित)',
  'dashboard.avgRR.tooltip.formula': 'फॉर्मूला: औसत जीत/औसत हार',
  'dashboard.avgRR.tooltip.no-conversion':
    'यह भुगतान अनुपात एफएक्स रूपांतरण के बिना मिश्रित मुद्राओं पर आधारित है और भ्रामक हो सकता है।',
  'dashboard.sharpeRatio.tooltip.title': 'शार्प रेशियो',
  'dashboard.sharpeRatio.tooltip.formula':
    'सूत्र: औसत बंद-ट्रेड शुद्ध P&L / बंद-ट्रेड शुद्ध P&L का नमूना मानक विचलन। जोखिम-मुक्त दर 0 है और मूल्य वार्षिक नहीं है।',
  'dashboard.sharpeRatio.tooltip.coverage':
    '{total} बंद ट्रेड्स के {valid} से गणना की गई',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'आंशिक कवरेज: {total} के {valid} बंद ट्रेड्स का परिमित शुद्ध P&L है।',
  'dashboard.sharpeRatio.tooltip.no-data':
    'गैर-शून्य P&L परिवर्तनशीलता के साथ कम से कम दो बंद ट्रेड्स की आवश्यकता है।',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'यह शार्प रेशियो एफएक्स रूपांतरण के बिना मिश्रित मुद्राओं पर आधारित है और भ्रामक हो सकता है।',
  'dashboard.avgRRRiskBased.tooltip.title': 'औसत RR (R-आधारित)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'फॉर्मूला: औसत जीत आर / औसत हार आर',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    '{total} के {valid} से गणना करके जोखिम डेटा के साथ ट्रेड्स को बंद कर दिया गया',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'जोखिम-मान्य जीत: {wins}, हानि: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'आंशिक जोखिम कवरेज: {total} के {valid} बंद ट्रेड्स में वैध जोखिम डेटा है।',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'आर-आधारित आरआर के लिए अपर्याप्त डेटा। स्टॉप लॉस/जोखिम डेटा जोड़ें और सुनिश्चित करें कि वैध जीत और हार ट्रेड्स हैं।',
  'dashboard.conversion.title': '{currency} में कनवर्ट किया गया',
  'dashboard.conversion.converted-total': 'परिवर्तित कुल',
  'dashboard.conversion.base': 'आधार: {currency}',

  'dashboard.conversion.using-ecb': 'ईसीबी दरों का उपयोग करना ({date})',
  'dashboard.conversion.using-broker-pnl':
    '{count} {tradeLabel} के लिए ब्रोकर-प्रदत्त आधार-मुद्रा P&L का उपयोग करना',
  'dashboard.conversion.using-manual-rate':
    '{count} {tradeLabel} के लिए मैन्युअल FX दर का उपयोग करना',
  'dashboard.conversion.partial-warning':
    '⚠ {currencies} में लागत/जोखिम को परिवर्तित नहीं किया जा सका और उन्हें बाहर रखा गया है',
  'dashboard.conversion.trade-singular': 'ट्रेड',
  'dashboard.conversion.trade-plural': 'ट्रेड्स',
  'dashboard.conversion.excluded-warning':
    '⚠ {total} ट्रेड्स का {converted} ({excluded} को छोड़कर: {currencies})',
  'dashboard.conversion.original-pnl': 'मूल P&L',
  'dashboard.conversion.converted-pnl': 'परिवर्तित P&L',
  'dashboard.conversion.details-label': 'मुद्रा रूपांतरण विवरण',

  'dashboard.top-section.add-metric': 'मेट्रिक जोड़ें',
  'dashboard.top-section.remove-metric': 'मीट्रिक हटाएँ',
  'dashboard.top-section.failed-load': 'मेट्रिक्स लोड करने में विफल',
  'dashboard.filter.date.today': 'आज',
  'dashboard.filter.date.yesterday': 'कल',
  'dashboard.filter.date.this-week': 'इस सप्ताह',
  'dashboard.filter.date.this-month': 'इस महीने',
  'dashboard.filter.date.this-quarter': 'यह तिमाही',
  'dashboard.filter.date.this-year': 'इस साल',
  'dashboard.filter.date.all-time': 'पूरे समय',
  'dashboard.filter.date.custom': 'रिवाज़',
  'dashboard.filter.date.from': 'से',
  'dashboard.filter.date.to': 'को',
  'dashboard.filter.accounts.all': 'सभी अकाउंट्स',
  'dashboard.filter.accounts.n-selected': '{count} अकाउंट्स',
  'dashboard.filter.accounts.select-all': 'सभी चुनें',

  'dashboard.filter.accounts.none-found': 'कोई अकाउंट्स नहीं मिला',
  'dashboard.filter.tags.all': 'सभी टैग',
  'dashboard.filter.tags.none': 'कोई टैग नहीं',
  'dashboard.filter.tags.n-selected': '{count} टैग',
  'dashboard.filter.tags.select-all': 'सभी चुनें',
  'dashboard.filter.tags.none-found': 'कोई टैग नहीं मिला',
  'dashboard.filter.mistakes.all': 'सभी गलतियाँ',
  'dashboard.filter.mistakes.none': 'कोई गलती नहीं',
  'dashboard.filter.mistakes.n-selected': '{count} गलतियाँ',
  'dashboard.filter.mistakes.select-all': 'सभी चुनें',
  'dashboard.filter.mistakes.none-found': 'कोई ग़लती नहीं मिली',
  'dashboard.filter.tickers.all': 'सभी सिंबल्स',
  'dashboard.filter.tickers.n-selected': '{count} सिंबल्स',
  'dashboard.filter.tickers.select-all': 'सभी चुनें',
  'dashboard.filter.tickers.none-found': 'कोई सिंबल्स नहीं मिला',
  'dashboard.filter.setup.all': 'सभी सेटअप्स',
  'dashboard.filter.setup.none': 'कोई सेटअप नहीं',
  'dashboard.filter.setup.n-selected': '{count} सेटअप्स',
  'dashboard.filter.setup.select-all': 'सभी चुनें',

  'dashboard.widgets.daily-performance.title': 'दैनिक प्रदर्शन',
  'dashboard.widgets.daily-performance.period-aria': 'अवधि',
  'dashboard.widgets.daily-performance.period-days': '{count} दिन',
  'dashboard.widgets.weekday-performance.title': 'कार्यदिवस प्रदर्शन',
  'dashboard.widgets.weekday-performance.metric-aria': 'मीट्रिक',
  'dashboard.widgets.weekday-performance.metric.net': 'नेट',
  'dashboard.widgets.weekday-performance.metric.win-rate': 'विन रेट',
  'dashboard.widgets.weekday-performance.metric.trades': 'ट्रेड्स',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    'विन रेट: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.weekday-performance.tooltip.trades': 'ट्रेड्स: {count}',
  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'कोई ट्रेड्स नहीं',
  'dashboard.widgets.hourly-performance.title': 'प्रति घंटा प्रदर्शन',
  'dashboard.widgets.hourly-performance.tooltip.trades': 'ट्रेड्स: {count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label': 'विन रेट',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    'विन रेट: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.hourly-performance.bucket-aria': 'बाल्टी का आकार',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes}m',
  'dashboard.widgets.hourly-performance.metric-aria': 'मीट्रिक',
  'dashboard.widgets.hourly-performance.metric.total': 'कुल',
  'dashboard.widgets.hourly-performance.metric.average': 'औसत',

  'dashboard.widgets.hourly-performance.metric.total-r': 'कुल आर',

  'dashboard.widgets.setup-performance.title': 'सेटअप प्रदर्शन',
  'dashboard.widgets.setup-performance.description':
    'सेटअप द्वारा प्रदर्शन की तुलना करते हुए रैंक किया गया बार चार्ट',
  'dashboard.widgets.setup-performance.empty': 'कोई सेटअप प्रदर्शन डेटा नहीं',
  'dashboard.widgets.setup-performance.masked-label': 'सेटअप',
  'dashboard.widgets.tag-performance.title': 'टैग प्रदर्शन',
  'dashboard.widgets.tag-performance.description':
    'टैग द्वारा प्रदर्शन की तुलना करते हुए रैंक किया गया बार चार्ट',
  'dashboard.widgets.tag-performance.empty': 'कोई टैग प्रदर्शन डेटा नहीं',
  'dashboard.widgets.tag-performance.masked-label': 'टैग',
  'dashboard.widgets.ticker-performance.title': 'सिंबल प्रदर्शन',
  'dashboard.widgets.ticker-performance.metric-aria': 'मीट्रिक',
  'dashboard.widgets.ticker-performance.view-aria': 'देखें',
  'dashboard.widgets.ticker-performance.view.best-and-worst':
    'सबसे अच्छा और सबसे खराब',
  'dashboard.widgets.ticker-performance.view.best': 'सर्वोत्तम 10',
  'dashboard.widgets.ticker-performance.view.worst': 'सबसे खराब 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'कुल P&L',
  'dashboard.widgets.ticker-performance.metric.total-r': 'कुल आर',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'विन रेट',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'सिंबल: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': 'ट्रेड्स: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'विन रेट: {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.ticker-performance.empty': 'कोई सिंबल प्रदर्शन डेटा नहीं',
  'dashboard.widgets.ticker-performance.empty-submessage':
    'सिंबल के साथ कोई भी बंद ट्रेड्स वर्तमान फ़िल्टर से मेल नहीं खाता।',
  'dashboard.widgets.ticker-performance.masked-ticker': 'सिंबल',
  'dashboard.widgets.ticker-performance.omitted-count': '{count} छोड़ा गया',
  'dashboard.widgets.rollingStats.title': 'रोलिंग औसत जीत/हार',
  'dashboard.widgets.rollingStats.period': 'अवधि',
  'dashboard.widgets.rollingStats.trades': '{count} ट्रेड्स',
  'dashboard.widgets.rollingStats.avgWin': 'औसत विन',
  'dashboard.widgets.rollingStats.avgLoss': 'औसत लॉस',
  'dashboard.widgets.rollingStats.tooltip.trade': 'ट्रेड {label}',
  'dashboard.rolling_win_loss.title': 'रोलिंग जीत/हार अनुपात',
  'dashboard.rolling_win_loss.period_aria': 'अवधि',
  'dashboard.rolling_win_loss.trades_count': '{count} ट्रेड्स',
  'dashboard.rolling_win_loss.trade_label': 'ट्रेड {label}',
  'dashboard.rolling_win_loss.ratio_label': 'अनुपात: {ratio}',
  'dashboard.rolling_win_loss.ratio_undefined':
    'अनुपात: विंडो में कोई हानि नहीं',
  'dashboard.rolling_win_loss.avg_win_label': 'औसत जीत: {value}',
  'dashboard.rolling_win_loss.no_losses_band': 'कोई हानि नहीं',
  'dashboard.rolling_win_loss.window_not_filled':
    'कम से कम {count} बंद ट्रेड्स की आवश्यकता है',
  'dashboard.rolling_win_loss.avg_loss_label': 'औसत हानि: {value}',
  'home.widget.recent-items.name': 'हाल के आइटम',
  'home.widget.recent-items.description':
    'हाल ही में खोली गई फ़ाइलें और दृश्य दिखाता है',
  'home.widget.year-heatmap.name': 'ट्रेडिंग हीटमैप',
  'home.widget.year-heatmap.description':
    'वर्ष के लिए आपकी ट्रेडिंग गतिविधि दर्शाने वाला कैलेंडर',
  'home.widget.getting-started.name': 'शुरू करें',
  'home.widget.getting-started.description':
    'ट्रेडिंग इतिहास जोड़ने और Journalit को कॉन्फ़िगर करने में आपकी सहायता के लिए चेकलिस्ट',
  'home.widget.getting-started.progress': '{completed}/{total} पूरा हुआ',
  'home.widget.getting-started.progress.loading':
    'प्रगति की जाँच की जा रही है...',
  'home.widget.getting-started.item.account.title':
    'अपना ट्रेडिंग खाता सेट करें',
  'home.widget.getting-started.item.account.description':
    'ट्रेड उस खाते में दर्ज होते हैं जो आपका बैलेंस ट्रैक करता है। इसके बिना रिटर्न और ड्रॉडाउन की गणना नहीं हो सकती।',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'खाता सेट करें',
  'home.widget.getting-started.item.create.title': 'अपना ट्रेडिंग इतिहास लाएँ',
  'home.widget.getting-started.item.create.description':
    'मौजूदा ट्रेड्स इंपोर्ट करें, Trade Sync कनेक्ट करें, या अपना पहला ट्रेड मैन्युअल रूप से जोड़ें।',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Trade Import खोलें',
  'home.widget.getting-started.item.tradelog.title': 'ट्रेड लॉग खोलें',
  'home.widget.getting-started.item.tradelog.description':
    'आपके सभी ट्रेड्स का एक ही स्थान पर विश्लेषण करने के लिए आपका ट्रेड डेटाबेस।',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta': 'ट्रेड लॉग खोलें',
  'home.widget.getting-started.item.layouts.title': 'लेआउट बिल्डर खोलें',
  'home.widget.getting-started.item.layouts.description':
    'अपने रिव्यू लेआउट को अपने तरीके से डिज़ाइन करें।',
  'home.widget.getting-started.item.layouts.time': '1 मिनट',
  'home.widget.getting-started.item.layouts.cta': 'लेआउट बिल्डर खोलें',
  'home.widget.getting-started.item.sidebar.title': 'नेविगेशन साइडबार खोलें',
  'home.widget.getting-started.item.sidebar.description':
    'Journalit के पेज, रिव्यूज़, टूल और खोज को पहुंच के भीतर रखें।',
  'home.widget.getting-started.item.sidebar.time': '10s',
  'home.widget.getting-started.item.sidebar.cta': 'साइडबार खोलें',
  'home.widget.getting-started.item.pro.title': 'प्रो सक्रिय करें',
  'home.widget.getting-started.item.pro.description':
    'Trade Import, Trade Sync और आर्थिक कैलेंडर सक्षम करें।',
  'home.widget.getting-started.item.pro.time': '1 मिनट',
  'home.widget.getting-started.item.pro.cta': 'सक्रिय करें',
  'home.widget.weekly-summary.name': 'साप्ताहिक सारांश',
  'home.widget.weekly-summary.description':
    'दैनिक P&L स्पार्कलाइन चार्ट के साथ वर्तमान सप्ताह मेट्रिक्स',
  'home.widget.key-events.name': 'प्रमुख घटनाएँ',
  'home.widget.key-events.description':
    'वर्तमान वीकली रिव्यू से महत्वपूर्ण समाचार और बाज़ार घटनाएँ',
  'home.widget.key-events.empty-title': 'अभी तक कोई महत्वपूर्ण घटनाएँ नहीं',
  'home.widget.key-events.open-aria': 'इस सप्ताह का वीकली रिव्यू खोलें',
  'home.widget.position-size.name': 'पोजीशन साइज़ कैलकुलेटर',
  'home.widget.position-size.description':
    'अकाउंट जोखिम प्रतिशत के आधार पर पोजीशन साइज़ की गणना करें',
  'home.widget.embedded-note.name': 'एंबेडेड नोट',
  'home.widget.embedded-note.description':
    'अपनी तिजोरी से कोई भी मार्कडाउन नोट प्रदर्शित करें',
  'home.widget.current-streak.name': 'वर्तमान लकीर',
  'home.widget.current-streak.description':
    'अपनी जीत और हार की लय पर नज़र रखें',
  'home.widget.best-hours.name': 'सर्वोत्तम घंटे',
  'home.widget.best-hours.description':
    'देखें कि आप दिन के समय के अनुसार कब ट्रेड सर्वश्रेष्ठ करते हैं',
  'home.widget.setup-leaderboard.name': 'शीर्ष टूटना',
  'home.widget.setup-leaderboard.description':
    'अपने शीर्ष सेटअप्स, टैग, संपत्ति प्रकार, या सिंबल्स की तुलना करें',
  'home.widget.unreviewed-trades.name': 'असमीक्षित ट्रेड्स',
  'home.widget.unreviewed-trades.description':
    'ट्रेड्स जिसे आपके रिव्यू की आवश्यकता है',
  'home.widget.goals-progress.name': 'लक्ष्य प्रगति',
  'home.widget.goals-progress.description':
    'अपने ट्रेडिंग लक्ष्य की ओर प्रगति को ट्रैक करें',
  'home.widget.trading-score.name': 'ट्रेडिंग स्कोर',
  'home.widget.trading-score.description':
    'रडार चार्ट विज़ुअलाइज़ेशन के साथ व्यापक प्रदर्शन स्कोर',
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description':
    '7-दिवसीय ट्रेंड स्पार्कलाइन के साथ प्रबंधनाधीन कुल संपत्ति',
  'home.widget.drawdown-monitor.name': 'ड्रॉडाउन मॉनिटर',
  'home.widget.drawdown-monitor.description':
    'कॉन्फ़िगर की गई सीमाओं के साथ अकाउंट्स में ड्रॉडाउन स्थिति को ट्रैक करें',
  'home.widget.profit-target-widget.name': 'लाभ लक्ष्य',
  'home.widget.profit-target-widget.description':
    'अकाउंट्स में लाभ लक्ष्य प्रगति को ट्रैक करें',
  'account.header.title': 'अकाउंट: {name}',
  'account.header.add-event.aria': 'जमा/निकासी जोड़ें',
  'account.header.edit-account.aria': 'अकाउंट संपादित करें',
  'account.header.view-trades.aria': 'ट्रेड्स को ट्रेड लॉग में देखें',
  'account.header.type': 'प्रकार:',
  'account.header.initial-balance': 'प्रारंभिक शेष:',
  'account.header.current-balance': 'वर्तमान शेष:',
  'account.header.account-id': 'अकाउंट आईडी:',
  'account.header.warning.trades-before-creation.one':
    '{count} ट्रेड अकाउंट निर्माण तिथि से पहले मिला',
  'account.header.warning.trades-before-creation.few':
    '{count} ट्रेड्स अकाउंट निर्माण तिथि से पहले मिला',
  'account.header.warning.trades-before-creation.many':
    '{count} ट्रेड्स अकाउंट निर्माण तिथि से पहले मिला',
  'account.header.warning.trades-before-creation.other':
    '{count} ट्रेड्स अकाउंट निर्माण तिथि से पहले मिला',
  'account.header.warning.earliest-trade':
    'सबसे पुराना ट्रेड: {date}। इससे शेष राशि की गलत गणना हो सकती है.',
  'account.header.warning.fix-date.aria': 'अकाउंट निर्मित तिथि ठीक करें',
  'account.header.warning.fixing': 'ठीक कर रहा हूँ...',
  'account.header.warning.fix-date': 'तारीख तय करें',
  'account.header.notice.date-updated':
    'अकाउंट निर्माण तिथि को {date} में अद्यतन किया गया',
  'account.header.notice.update-failed-log':
    'अकाउंट निर्मित तिथि को अपडेट करने में विफल:',
  'account.header.notice.update-failed': 'दिनांक अपडेट करने में विफल: {error}',
  'ribbon.open-journalit': 'Journalit खोलें',

  'view.dashboard': 'डैशबोर्ड',
  'view.trade-log': 'ट्रेड लॉग',
  'view.account-dashboard': 'अकाउंट्स',
  'view.account-page.title': 'अकाउंट: {name}',
  'view.account-page.title-default': 'अकाउंट पेज',
  'view.account-page.no-account-selected': 'कोई अकाउंट चयनित नहीं',
  'view.account-page.no-account-instructions':
    'कृपया अकाउंट्स से इस पृष्ठ पर जाएँ।',
  'view.account-page.service-loading': 'अकाउंट पेज सेवा लोड हो रही है...',
  'view.account-page.balance-chart-title': 'अकाउंट बैलेंस चार्ट',
  'view.account-page.balance-chart-loading': 'बैलेंस चार्ट लोड हो रहा है...',
  'view.layout-builder': 'लेआउट बिल्डर',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': 'आर्थिक कैलेंडर',
  'view.economic-calendar.this-week': 'इस सप्ताह',
  'view.economic-calendar.import-count.one': '{count} इवेंट आयात करें',
  'view.economic-calendar.import-count.few': '{count} इवेंट आयात करें',
  'view.economic-calendar.import-count.many': '{count} इवेंट आयात करें',
  'view.economic-calendar.import-count.other': '{count} इवेंट आयात करें',
  'view.economic-calendar.imported': 'आयातित',
  'view.economic-calendar.update-available': 'अपडेट उपलब्ध',
  'view.economic-calendar.filter.currency': 'मुद्रा',
  'view.economic-calendar.filter.impact': 'प्रभाव',
  'view.economic-calendar.impact.high': 'उच्च',
  'view.economic-calendar.impact.medium': 'मध्यम',
  'view.economic-calendar.impact.low': 'कम',
  'view.economic-calendar.impact.none': 'कोई नहीं',
  'view.economic-calendar.pro-required':
    'आर्थिक कैलेंडर के लिए Journalit Pro आवश्यक है',
  'view.economic-calendar.error.offline':
    'ऑफ़लाइन रहते हुए आर्थिक कैलेंडर लोड नहीं किया जा सकता।',
  'view.economic-calendar.error.generic':
    'आर्थिक कैलेंडर लोड नहीं किया जा सका।',
  'view.economic-calendar.empty': 'इस सप्ताह कोई आर्थिक इवेंट नहीं है।',
  'view.economic-calendar.sync.aria': 'आर्थिक कैलेंडर सेटिंग खोलें',
  'view.economic-calendar.all-day': 'पूरा दिन',
  'view.economic-calendar.holiday-aria': 'अवकाश',
  'view.economic-calendar.refresh': 'इवेंट रिफ्रेश करें',
  'view.economic-calendar.retry': 'फिर प्रयास करें',
  'view.economic-calendar.select-all': 'सभी चुनें',
  'view.economic-calendar.select-aria': '{event} चुनें',
  'view.economic-calendar.impact-aria': 'प्रभाव: {impact}',
  'view.economic-calendar.forecast': 'पूर्वानुमान',
  'view.economic-calendar.previous': 'पिछला',
  'view.economic-calendar.actual': 'वास्तविक',
  'view.economic-calendar.import-success':
    '{imported} आयातित, {updated} अपडेट किए गए',
  'view.economic-calendar.import-failed': 'इवेंट आयात नहीं किए जा सके।',
  'view.economic-calendar.restore-missing-events':
    'गायब इवेंट पुनर्स्थापित करें ({count})',
  'economicCalendar.guide.main.intro.description':
    'यहाँ पूरे सप्ताह को देखें। Journalit आपकी साप्ताहिक समीक्षा को अपने आप अपडेट भी रख सकता है, इसलिए मैनुअल आयात वैकल्पिक है।',
  'economicCalendar.guide.main.filters.title':
    'ये फ़िल्टर केवल इस कैलेंडर को बदलते हैं',
  'economicCalendar.guide.main.filters.description':
    'मुद्रा और प्रभाव फ़िल्टर यहाँ दिखाई देने और चुने जाने वाले इवेंट को सीमित करते हैं। वे आपके स्वचालित आयात नियमों को नहीं बदलते।',
  'economicCalendar.guide.main.settings.title':
    'सेटिंग में स्वचालित आयात कॉन्फ़िगर करें',
  'economicCalendar.guide.main.settings.description':
    'मुद्राएँ, प्रभाव स्तर और अवकाश चुनने के लिए इस बटन का उपयोग करें, फिर स्वचालित आयात चालू करें। Journalit वर्तमान सप्ताह को आपकी साप्ताहिक समीक्षा में सिंक करता है और आपके द्वारा जानबूझकर हटाए गए इवेंट को दोबारा जोड़े बिना आयातित आँकड़े रिफ्रेश करता है।',
  'economicCalendar.guide.main.manual-import.title': 'मैनुअल आयात वैकल्पिक है',
  'economicCalendar.guide.main.manual-import.description':
    'दिखाई देने वाली पंक्तियाँ चुनें और एक बार के आयात के लिए इवेंट आयात करें का उपयोग करें। स्वचालित आयात चालू होने पर आपको हर सप्ताह ऐसा करने की आवश्यकता नहीं है।',
  'economicCalendar.guide.main.restore.title':
    'गायब कॉन्फ़िगर किए गए इवेंट पुनर्स्थापित करें',
  'economicCalendar.guide.main.restore.description':
    'आपके सहेजे गए स्वचालित आयात दायरे के इवेंट गायब होने पर यह बटन उपलब्ध होता है। सप्ताह फिर से पूरा होने पर यह दिखाई देता रहता है, लेकिन अक्षम रहता है।',
  'economicCalendar.guide.main.summary.title':
    'एक बार सेट करें, फिर समीक्षा करें',
  'economicCalendar.guide.main.summary.description':
    'स्वचालित आयात कॉन्फ़िगर होने के बाद आपकी साप्ताहिक समीक्षा भरी रहती है। ब्राउज़ करने, एक बार का आयात करने या गायब इवेंट पुनर्स्थापित करने के लिए यहाँ लौटें।',
  'view.economic-calendar.pro-benefit':
    'आपके साप्ताहिक नोट में उच्च-प्रभाव वाले इवेंट।',
  'view.economic-calendar.pro-benefit-trial':
    '14-दिन के निःशुल्क परीक्षण से शुरू करें।',
  'settings.economic-calendar.title': 'आर्थिक कैलेंडर',
  'settings.economic-calendar.description':
    'इस सप्ताह के आर्थिक इवेंट को आपके साप्ताहिक नोट के मुख्य इवेंट में अपने आप आयात करता है।',
  'settings.economic-calendar.auto-import': 'साप्ताहिक इवेंट अपने आप आयात करें',
  'settings.economic-calendar.auto-import-desc':
    'मौजूदा साप्ताहिक नोट को कैलेंडर फ़ीड के साथ सिंक रखता है।',
  'settings.economic-calendar.currencies': 'मुद्राएँ',
  'settings.economic-calendar.currencies-desc':
    'खाली छोड़ने पर सभी मुद्राएँ शामिल होंगी।',
  'settings.economic-calendar.impacts': 'प्रभाव स्तर',
  'settings.economic-calendar.impacts-desc':
    'आयात करने के लिए प्रभाव स्तर चुनें।',
  'settings.economic-calendar.impacts-empty':
    'कोई आर्थिक रिलीज़ चयनित नहीं है। सक्षम होने पर छुट्टियाँ फिर भी आयात की जा सकती हैं।',
  'settings.economic-calendar.include-holidays': 'अवकाश शामिल करें',
  'settings.economic-calendar.include-holidays-desc':
    'चुनी गई मुद्राओं के सार्वजनिक और बैंक अवकाश आयात करें।',
  'settings.economic-calendar.open-view': 'आर्थिक कैलेंडर खोलें',
  'settings.economic-calendar.open-view-desc':
    'इस सप्ताह के इवेंट देखें और चुनिंदा इवेंट आयात करें।',
  'settings.economic-calendar.pro-required':
    'स्वचालित कैलेंडर आयात के लिए Journalit Pro आवश्यक है।',
  'widget.key-events.currency-label': 'मुद्रा',
  'widget.key-events.time-label': 'समय',
  'widget.key-events.field-unset': 'सेट नहीं',
  'widget.key-events.open-calendar-aria': 'आर्थिक कैलेंडर खोलें',
  'widget.key-events.restore-auto-import':
    'स्वचालित रूप से आयात किए गए इवेंट पुनर्स्थापित करें',
  'widget.key-events.restore-missing-events':
    'गायब इवेंट पुनर्स्थापित करें ({count})',
  'home.quick-links.economic-calendar': 'आर्थिक कैलेंडर',
  'navigation.items.nav-economic-calendar': 'आर्थिक कैलेंडर',
  'command.open-economic-calendar': 'आर्थिक कैलेंडर खोलें',

  'status-bar.update-available-branded': 'Journalit अपडेट करें',
  'status-bar.release-notes-branded': 'Journalit · रिलीज़ नोट्स देखें',
  'status-bar.update-aria-label':
    'Journalit {version} - देखने के लिए क्लिक करें',
  'update.available.ready': 'नया संस्करण तैयार है',
  'template.transformation.orphaned-content.header': 'पिछले लेआउट से सामग्री',
  'template.transformation.orphaned-content.desc1':
    'निम्नलिखित सामग्री नए लेआउट में फिट नहीं बैठती.',
  'template.transformation.orphaned-content.desc2':
    'इसे रिव्यू करें और ऊपर जोड़ें, या अगर अब ज़रूरत नहीं है तो हटा दें।',
  'template.editor.loading': 'लेआउट लोड हो रहा है...',
  'template.editor.built-in': 'में निर्मित',
  'template.editor.unsaved-changes': 'सहेजे न गए परिवर्तन',

  'template.editor.built-in-notice':
    'अंतर्निहित लेआउट संपादित नहीं किए जा सकते. इस लेआउट को डुप्लिकेट करें या अनुकूलित करने के लिए एक नया बनाएं।',

  'template.editor.show-review-desc':
    'ट्रेड नोट्स पर रिव्यू अनुभाग कब प्रदर्शित करें',

  'template.editor.section-visibility': 'अनुभाग दृश्यता',
  'template.editor.trade-note-layout': 'ट्रेड नोट लेआउट',

  'template.editor.other-asset-types': 'अन्य',

  'template.editor.asset-type-add': 'एसेट टाइप',

  'template.editor.remove-asset-layout': 'एसेट लेआउट हटाएँ',

  'template.editor.nav-bar': 'नेविगेशन पट्टी',
  'template.editor.nav-bar-desc': 'ट्रेड टाइमलाइन और रिव्यू लिंक दिखाएँ',
  'template.editor.images': 'इमेज',
  'template.editor.images-desc': 'ट्रेड चार्ट छवियाँ दिखाएँ',
  'template.editor.metrics': 'मेट्रिक्स',
  'template.editor.metrics-desc':
    'एंट्री, एग्जिट, अवधि दिखाएं और मीट्रिक कार्ड की योजना बनाएं',
  'template.editor.thesis': 'थीसिस',
  'template.editor.thesis-desc': 'ट्रेड थीसिस ब्लॉक दिखाएँ',
  'template.editor.missed-reason': 'मिस्ड ट्रेड कारण',
  'template.editor.missed-reason-desc':
    'दिखाएँ कि मिस्ड ट्रेड क्यों नहीं लिया गया',
  'template.editor.metadata': 'मेटाडाटा',
  'template.editor.metadata-desc': 'अकाउंट्स, सेटअप्स और गलतियाँ दिखाएँ',
  'template.editor.metric-cards': 'मीट्रिक कार्ड',
  'template.editor.metadata-rows': 'मेटाडेटा पंक्तियाँ',
  'template.editor.accounts': 'अकाउंट्स',
  'template.editor.setups': 'सेटअप्स',
  'template.editor.mistakes': 'गलतियाँ',
  'template.editor.tags': 'टैग्स',
  'template.editor.custom-fields': 'कस्टम फ़ील्ड्स',
  'template.editor.custom-fields-desc':
    '{count} कस्टम फ़ील्ड कॉन्फ़िगर किया गया',

  'template.editor.metric.position-size': 'पोजीशन आकार',
  'template.editor.metric.execution-breakdown': 'निष्पादन टूटना',
  'template.editor.metric.pnl': 'P&L',
  'template.editor.metric.r-multiple': 'आर एकाधिक',
  'template.editor.metric.costs': 'लागत',

  'template.editor.review-button': 'मार्क रिव्यूड बटन',
  'template.editor.review-button-desc':
    'ट्रेड को रिव्यूड के रूप में चिह्नित करने के लिए बटन दिखाएँ',

  'csv.mapper.title': 'कॉलम को ट्रेड फ़ील्ड में मैप करें',
  'csv.mapper.subtitle':
    'अपने कॉलमों का उनके द्वारा दर्शाए गए ट्रेड फ़ील्ड से मिलान करें।',
  'csv.mapper.do-not-import': 'इंपोर्ट न करें',
  'csv.mapper.required-badge': 'आवश्यक',
  'csv.mapper.required-label': 'आवश्यक',
  'csv.mapper.example': 'उदाहरण:',
  'csv.mapper.mode.title': 'इंपोर्ट मोड',
  'csv.mapper.mode.help':
    'चुनें कि मैन्युअल पंक्तियों की व्याख्या कैसे की जानी चाहिए। डायरेक्ट P&L मोड मैप किए गए P&L मानों का उपयोग करके पंक्तियों को बंद ट्रेड्स के रूप में इंपोर्ट करता है।',

  'csv.mapper.asset-type.help':
    'इस फ़ाइल में उपकरण का प्रकार चुनें. यह आवश्यक फ़ील्ड और पार्सिंग तर्क निर्धारित करता है।',

  'csv.mapper.tip.title': 'टिप: अतिरिक्त फ़ील्ड मैप करें',
  'csv.mapper.tip.desc':
    'ब्रोकरेज और प्रॉफिट_लॉस जैसे वैकल्पिक फ़ील्ड को मैप करने से इंपोर्ट गुणवत्ता में सुधार होता है। आप टैग, चित्र, सेटअप्स और गलतियों जैसे फ़ील्ड को सूचीबद्ध करने के लिए कई कॉलम भी मैप कर सकते हैं।',
  'csv.mapper.missing-fields': '{assetType} के लिए आवश्यक फ़ील्ड गुम:',
  'csv.mapper.summary.title': 'सारांश:',
  'csv.mapper.summary.of': 'का',
  'csv.mapper.summary.columns-mapped': 'कॉलम मैप किए गए',
  'csv.mapper.summary.all-mapped': 'सभी आवश्यक फ़ील्ड मैप किए गए',
  'csv.mapper.available-fields.title': 'उपलब्ध ट्रेड फ़ील्ड',
  'csv.mapper.available-fields.desc':
    'एसेट-विशिष्ट फ़ील्ड्स के विवरण के साथ कैटेगरी के अनुसार व्यवस्थित',

  'csv.template-import.label.share-code': 'कोड साझा करें',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': 'इंपोर्ट टेम्पलेट',

  'csv.template-import.error.import-failed': 'टेम्पलेट इंपोर्ट करने में विफल',

  'csv.export-template.label.share-code': 'कोड साझा करें',

  'csv.export-template.button.copied': 'नकल की गई!',
  'csv.export-template.button.copy': 'क्लिपबोर्ड पर कॉपी करें',
  'csv.mapper.field.symbol': 'सिंबल',
  'csv.mapper.field.direction': 'दिशा (लॉन्ग/शॉर्ट)',
  'csv.mapper.field.entry-time': 'एंट्री समय',
  'csv.mapper.field.exit-time': 'एग्जिट समय',
  'csv.mapper.field.entry-price': 'एंट्री कीमत',
  'csv.mapper.field.exit-price': 'एग्जिट कीमत',
  'csv.mapper.field.quantity': 'क्वांटिटी',
  'csv.mapper.field.notes': 'नोट्स',
  'csv.mapper.field.order-id': 'ऑर्डर ID',
  'csv.mapper.field.account-id': 'अकाउंट आईडी',
  'csv.mapper.help.options-required': 'विकल्प ट्रेड्स के लिए आवश्यक',
  'csv.mapper.help.option-type-required': 'विकल्पों के लिए आवश्यक (कॉल या पुट)',
  'csv.mapper.help.contract-size': 'विकल्प (आमतौर पर 100) या वायदा के लिए गुणक',
  'csv.mapper.help.order-id': 'आंशिक भरण एकत्र करने के लिए उपयोग किया जाता है',
  'csv.mapper.help.asset-types':
    'स्टॉक, विकल्प, वायदा, विदेशी मुद्रा, क्रिप्टो',
  'csv.mapper.help.status': 'ट्रेड स्थिति: खुला या बंद',
  'csv.mapper.category.required': 'आवश्यक फील्ड्स',
  'csv.mapper.category.optional-core': 'वैकल्पिक कोर फ़ील्ड',
  'csv.mapper.category.identifiers': 'पहचानकर्ता',
  'csv.mapper.category.other': 'अन्य',
  'csv.mapper.category.options': 'विकल्प फ़ील्ड',
  'csv.mapper.category.futures': 'वायदा क्षेत्र',

  'csv.broker.label': 'ब्रोकर / इंपोर्ट प्रारूप',

  'csv.broker.remove-favorite-aria': 'पसंदीदा से हटाएँ',
  'csv.broker.set-favorite-aria': 'पसंदीदा के रूप में सेट करें',
  'csv.broker.ibkr': 'इंटरएक्टिव ब्रोकर्स (IBKR)',
  'csv.broker.tradovate': 'Tradovate',
  'csv.broker.tradezero': 'ट्रेडज़ीरो',
  'csv.broker.tradingview': 'TradingView पेपर ट्रेडिंग',
  'csv.broker.bybit': 'बायबिट (यूएसडीटी सतत)',
  'csv.broker.blofin': 'ब्लोफिन',
  'csv.broker.hyperliquid': 'हाइपरलिक्विड (सदा)',
  'csv.broker.sierrachart': 'सिएराचार्ट (वायदा)',
  'csv.broker.motivewave': 'MotiveWave',
  'csv.broker.fxreplay': 'एफएक्स रीप्ले (एनालिटिक्स)',
  'csv.broker.atas': 'एटीएएस (सांख्यिकी रीयलटाइम)',
  'csv.broker.rithmic': 'लयबद्ध',
  'csv.broker.jdr': 'MetaTrader 4 / 5',

  'csv.account-selector.favorite.remove': 'पसंदीदा से हटाएँ',
  'csv.account-selector.favorite.set': 'पसंदीदा के रूप में सेट करें',

  'csv.results.successfully-imported-suffix': 'ट्रेड्स',

  'csv.results.failed-to-import-prefix': 'इंपोर्ट में विफल',
  'csv.results.failed-to-import-suffix': 'पंक्तियाँ (नीचे विवरण देखें)',
  'csv.results.pending-local-writes':
    '{count} ट्रेड नोट लिखना अभी भी लंबित है। Journalit पूर्ण लेखन का समाधान करेगा और अधूरे अनुमानों को पुनर्सेटअप के लिए उपलब्ध छोड़ देगा।',
  'csv.results.pending-title': 'इंपोर्ट अभी भी सिंक हो रहा है',

  'csv.image-review.count': '{count} छवियाँ',

  'image.uploader.paste-title': 'क्लिपबोर्ड से मीडिया चिपकाएँ (Ctrl+V)',
  'image.uploader.pasting': 'चिपकाया जा रहा है...',
  'image.uploader.paste': 'पेस्ट करें',
  'image.uploader.url-placeholder': 'मीडिया URL या फ़ाइल पथ चिपकाएँ...',
  'image.uploader.url-input-aria': 'मीडिया यूआरएल इनपुट',
  'image.uploader.file-upload-aria': 'फ़ाइल से अपलोड करें',
  'image.uploader.paste-clipboard-aria': 'क्लिपबोर्ड से चिपकाएँ',
  'image.uploader.error-invalid-url':
    'अमान्य मीडिया यूआरएल या फ़ाइल पथ. कृपया एक समर्थित छवि/वीडियो यूआरएल, वॉल्ट मीडिया पथ, या एक्सकैलिड्रॉ लिंक दर्ज करें।',
  'image.viewer.alt-default': 'इमेज',
  'image.viewer.description-default': 'मीडिया प्रिव्यू',

  'image.viewer.title-fullscreen': 'पूर्णस्क्रीन देखने के लिए क्लिक करें',

  'image.viewer.delete-button': 'मीडिया हटाएँ',
  'image.viewer.nav-prev': 'पिछली छवि',
  'image.viewer.nav-next': 'अगली छवि',
  'image.viewer.zoom-in-hint': 'ज़ूम इन करने के लिए पिंच करें या क्लिक करें',
  'image.viewer.zoom-out-hint':
    '{scale}x (ज़ूम आउट करने के लिए चुटकी या क्लिक करें)',

  'image.viewer.close-aria': 'फ़ुलस्क्रीन बंद करें',
  'image.viewer.copy-image': 'नकल छवि',

  'image.viewer.copied': 'कॉपी किया गया',
  'image.viewer.copy-failed': 'छवि को क्लिपबोर्ड पर कॉपी करने में विफल',
  'image.viewer.copy-unsupported':
    'इस परिवेश में छवि क्लिपबोर्ड प्रतिलिपि समर्थित नहीं है',
  'media.viewer.video-controls': 'वीडियो नियंत्रण',
  'media.viewer.play-video': 'वीडियो चलाएं',
  'media.viewer.pause-video': 'वीडियो रोकें',
  'media.viewer.mute-video': 'वीडियो म्यूट करें',
  'media.viewer.unmute-video': 'वीडियो अनम्यूट करें',
  'media.viewer.volume': 'वॉल्यूम',
  'media.viewer.back-5': '5 सेकंड पीछे',
  'media.viewer.forward-5': '5 सेकंड आगे बढ़ाएँ',
  'media.viewer.timeline': 'वीडियो टाइमलाइन',

  'image.carousel.no-images': 'प्रदर्शित करने के लिए कोई छवियाँ नहीं',
  'image.carousel.prev': 'पिछली छवि',
  'image.carousel.next': 'अगली छवि',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'थंबनेल {index}',
  'paste.notice.image-pasted': '📋 छवि सफलतापूर्वक चिपकाई गई',
  'paste.notice.images-pasted': '📋 {count} छवियाँ सफलतापूर्वक चिपकाई गईं',
  'paste.error.clipboard-not-supported': 'क्लिपबोर्ड एपीआई समर्थित नहीं है',
  'paste.error.clipboard-empty': 'चिपकाने के लिए क्लिपबोर्ड में कुछ नहीं मिला',
  'paste.error.file-size-exceeds': 'फ़ाइल का आकार {size}MB सीमा से अधिक है',
  'paste.error.no-images-found':
    'क्लिपबोर्ड में कोई चित्र नहीं मिला. पहले एक छवि कॉपी करने का प्रयास करें.',
  'paste.error.permission-denied': 'अनुमति नहीं मिली',

  'datepicker.button.clear': 'साफ़ करें',
  'datepicker.button.today': 'आज',
  'datepicker.button.now': 'अब',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',
  'common.loading': 'लोड हो रहा है...',
  'common.error': 'त्रुटि',

  'common.warning': 'चेतावनी',
  'common.info': 'Info',
  'common.yes': 'हाँ',
  'common.no': 'नहीं',
  'common.ok': 'OK',

  'common.select-option': 'एक विकल्प चुनें',

  'common.none': 'कोई नहीं',
  'common.other': 'अन्य',
  'common.breakdown': 'ब्रेकडाउन',
  'common.na': 'N/A',
  'common.unknown': 'अज्ञात',
  'common.unknown-error': 'अज्ञात त्रुटि',
  'common.all': 'सभी',
  'common.select-all': 'सभी चुनें',
  'common.n-types': '{count} प्रकार',
  'common.select-item': '{item} चुनें',
  'common.header': 'हेडर',

  'common.date': 'तारीख',

  'common.days': 'दिन',
  'common.week': 'सप्ताह',
  'common.weeks': 'सप्ताह',
  'common.month': 'महीना',
  'common.months': 'महीने',
  'common.year': 'साल',
  'common.years': 'साल',
  'common.quarter': 'क्वार्टर',
  'common.quarters': 'क्वार्टर',

  'common.min': 'Min',
  'common.max': 'Max',
  'common.best': 'सर्वश्रेष्ठ',
  'common.worst': 'सबसे खराब',
  'common.profit': 'प्रॉफिट',

  'common.trade': 'ट्रेड',
  'common.trades': 'ट्रेड्स',

  'common.statuses': 'स्टेटस',
  'common.enabled': 'सक्षम',
  'common.disabled': 'अक्षम',
  'common.color.gray': 'ग्रे',
  'common.color.red': 'लाल',
  'common.color.orange': 'नारंगी',
  'common.color.yellow': 'पीला',
  'common.color.label': 'रंग',
  'common.color.default': 'डिफ़ॉल्ट',
  'common.day.monday': 'सोमवार',
  'common.day.tuesday': 'मंगलवार',
  'common.day.wednesday': 'बुधवार',
  'common.day.thursday': 'गुरुवार',
  'common.day.friday': 'शुक्रवार',
  'common.day.saturday': 'शनिवार',
  'common.day.sunday': 'रविवार',
  'common.day.all-week': 'पूरा सप्ताह',
  'common.month.january': 'जनवरी',
  'common.month.february': 'फरवरी',
  'common.month.march': 'मार्च',
  'common.month.april': 'अप्रैल',
  'common.month.may': 'मई',
  'common.month.june': 'जून',
  'common.month.july': 'जुलाई',
  'common.month.august': 'अगस्त',
  'common.month.september': 'सितंबर',
  'common.month.october': 'अक्टूबर',
  'common.month.november': 'नवंबर',
  'common.month.december': 'दिसंबर',
  'common.score.poor': 'कमज़ोर',
  'common.score.below-average': 'औसत से कम',
  'common.score.average': 'औसत',
  'common.score.strong': 'मज़बूत',
  'common.score.excellent': 'उत्कृष्ट',
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'पीक रियलाइज़्ड P&L',
  'chart.tooltip.episode-start': 'ड्रॉडाउन एपिसोड की शुरुआत',
  'chart.tooltip.underwater-days': 'ड्रॉडाउन में समय',
  'chart.tooltip.underwater-trades': 'ड्रॉडाउन में ट्रेड्स',

  'chart.tooltip.drawdown-amount': 'ड्रॉडाउन राशि',
  'chart.tooltip.drawdown-percent': 'ड्रॉडाउन {basis} का %',
  'chart.tooltip.percent-basis': 'प्रतिशत आधार',
  'chart.tooltip.trade-pnl': 'ट्रेड P&L',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} अधिक',
  'chart.loading': 'चार्ट लोड हो रहा है...',
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'एंट्री',
  'chart.legend.exit': 'एग्जिट',
  'chart.legend.trade': 'ट्रेड',
  'calendar.day.mon': 'सोम',
  'calendar.day.tue': 'मंगल',
  'calendar.day.wed': 'बुध',
  'calendar.day.thu': 'गुरु',
  'calendar.day.fri': 'शुक्र',
  'calendar.day.sat': 'शनि',
  'calendar.day.sun': 'रवि',
  'calendar.month.jan': 'जन',
  'calendar.month.feb': 'फर',
  'calendar.month.mar': 'मार्च',
  'calendar.month.apr': 'अप्रैल',
  'calendar.month.may': 'मई',
  'calendar.month.jun': 'जून',
  'calendar.month.jul': 'जुल',
  'calendar.month.aug': 'अग',
  'calendar.month.sep': 'सित',
  'calendar.month.oct': 'अक्टू',
  'calendar.month.nov': 'नव',
  'calendar.month.dec': 'दिस',
  'calendar.legend.less': 'कम',
  'calendar.legend.more': 'अधिक',

  'settings.ftp.title': 'एफ़टीपी क्रेडेंशियल',
  'settings.ftp.title-metatrader': 'MetaTrader के लिए एफ़टीपी क्रेडेंशियल',
  'settings.ftp.loading': 'एफ़टीपी क्रेडेंशियल लोड हो रहा है...',
  'settings.ftp.info-message':
    'MetaTrader के FTP प्रकाशन सेटिंग्स को कॉन्फ़िगर करने के लिए इन क्रेडेंशियल्स का उपयोग करें:',
  'settings.ftp.label.server': 'एफ़टीपी सर्वर:',
  'settings.ftp.label.login': 'एफ़टीपी लॉगिन:',
  'settings.ftp.label.password': 'एफ़टीपी पासवर्ड:',
  'settings.ftp.aria.copy-server': 'एफ़टीपी सर्वर की प्रतिलिपि बनाएँ',
  'settings.ftp.aria.copy-login': 'एफ़टीपी लॉगिन कॉपी करें',
  'settings.ftp.aria.copy-password': 'पासवर्ड कॉपी करें',
  'settings.ftp.aria.password-unavailable':
    'कॉपी करने के लिए पासवर्ड उपलब्ध नहीं है',
  'settings.ftp.aria.password-hidden': 'पासवर्ड छिपा हुआ',
  'settings.ftp.aria.hide-password': 'पासवर्ड छिपाएं',
  'settings.ftp.aria.show-password': 'पासवर्ड दिखाए',
  'settings.ftp.notice.password-masked':
    'पासवर्ड संग्रहीत है लेकिन देखने/कॉपी करने के लिए उपलब्ध नहीं है। नया पासवर्ड पाने के लिए पासवर्ड रीसेट करें।',
  'settings.ftp.notice.password-save':
    'इस पासवर्ड को सुरक्षित रूप से सेव करें. इसे बाद में पुनः प्राप्त नहीं किया जा सकता.',
  'settings.ftp.button.reset': 'एफ़टीपी पासवर्ड रीसेट करें',
  'settings.ftp.button.resetting': 'पासवर्ड रीसेट किया जा रहा है...',
  'settings.ftp.reset-hint':
    'नया FTP पासवर्ड जनरेट करने के लिए इस बटन पर क्लिक करें।',
  'settings.ftp.instructions.title': 'MetaTrader 4 सेटअप निर्देश:',
  'settings.ftp.instructions.step1': 'MetaTrader 4 (MT4) खोलें',
  'settings.ftp.instructions.step2': 'शीर्ष पर "टूल्स" मेनू पर क्लिक करें',
  'settings.ftp.instructions.step3': '"विकल्प" चुनें',
  'settings.ftp.instructions.step4':
    '"एफ़टीपी" टैब पर जाएँ और ऊपर दिखाए गए एफ़टीपी सर्वर, लॉगिन और पासवर्ड दर्ज करें',
  'settings.ftp.instructions.step5': '"निष्क्रिय मोड" सक्षम करें',
  'settings.ftp.instructions.step6':
    'एफ़टीपी के माध्यम से रिपोर्ट का स्वचालित प्रकाशन सक्षम करें और ताज़ा अंतराल को 60 मिनट पर सेट करें',
  'settings.ftp.no-credentials':
    'कोई एफ़टीपी क्रेडेंशियल नहीं मिला. उन्हें उत्पन्न करने के लिए उपरोक्त अनुभाग में "एफ़टीपी क्रेडेंशियल बनाएं" पर क्लिक करें।',
  'settings.ftp.error.reset-failed': 'पासवर्ड रीसेट करने में विफल',

  'settings.auth.status-offline': 'ऑफलाइन',
  'settings.auth.status-online': 'ऑनलाइन',

  'settings.auth.signed-in': 'साइन इन किया गया',
  'settings.auth.sign-in-up': 'प्रवेश या साइन अप',
  'settings.auth.sign-out': 'साइन आउट',

  'settings.auth.subscription-features': 'सदस्यता सुविधाएँ',

  'settings.auth.offline-mode': 'ऑफ़लाइन मोड',

  'settings.auth.guest': 'अतिथि',

  'settings.auth.your-plan': 'तुम्हारी योजना',

  'settings.auth.manage-subscription': 'सदस्यता प्रबंधित करें',
  'settings.tab.general': 'सामान्य',
  'settings.tab.reviews': 'रिव्यू',

  'settings.tab.customization': '.Customization',
  'settings.tab.journal-setup': 'जर्नल सेटअप',
  'settings.tab.backend': 'ट्रेड सिंक',
  'settings.tab.trading': 'ट्रेड्स',
  'settings.tab.sync': 'सिंक',
  'settings.tab.accounts': 'अकाउंट',
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'साप्ताहिक रिव्यू',
  'settings.reviews.monthly': 'मासिक रिव्यू',
  'settings.reviews.quarterly': 'त्रैमासिक रिव्यू',
  'settings.reviews.yearly': 'वार्षिक रिव्यू',
  'settings.reviews.default-templates': 'डिफ़ॉल्ट लेआउट',

  'settings.reviews.trade-template': 'ट्रेड लेआउट',
  'settings.reviews.trade-template-desc':
    'नए ट्रेड नोट्स के लिए लेआउट का उपयोग किया गया',
  'settings.reviews.drc-template': 'DRC लेआउट',
  'settings.reviews.drc-template-desc':
    'नए दैनिक रिपोर्ट कार्ड के लिए लेआउट का उपयोग किया जाता है',
  'settings.reviews.weekly-template': 'साप्ताहिक लेआउट',
  'settings.reviews.weekly-template-desc':
    'नए साप्ताहिक रिव्यूज़ के लिए लेआउट का उपयोग किया गया',
  'settings.reviews.monthly-template': 'मासिक लेआउट',
  'settings.reviews.monthly-template-desc':
    'नए मासिक रिव्यूज़ के लिए लेआउट का उपयोग किया गया',
  'settings.reviews.quarterly-template': 'त्रैमासिक लेआउट',
  'settings.reviews.quarterly-template-desc':
    'नए त्रैमासिक रिव्यूज़ के लिए लेआउट का उपयोग किया गया',
  'settings.reviews.yearly-template': 'वार्षिक लेआउट',
  'settings.reviews.yearly-template-desc':
    'नए वार्षिक रिव्यूज़ के लिए लेआउट का उपयोग किया गया',
  'settings.reviews.template-builder': 'लेआउट निर्माता',
  'settings.reviews.template-builder-desc':
    'अपने लेआउट विज़ुअली बनाएं, संपादित करें और प्रबंधित करें। बिल्डर व्यू आपको वास्तविक समय में अनुभागों को खींचने और छोड़ने, विकल्पों को कॉन्फ़िगर करने और आपके लेआउट को प्रिव्यू करने की अनुमति देता है।',
  'settings.reviews.open-builder': 'लेआउट बिल्डर खोलें',
  'settings.general.review-links-new-tab':
    'समीक्षा विजेट लिंक नए टैब में खोलें',
  'settings.general.review-links-new-tab-desc':
    'बंद होने पर, लिंक वर्तमान टैब को बदल देते हैं।',
  'settings.general.review-links-new-tab-aria':
    'समीक्षा विजेट नोट लिंक नए टैब में खोलें',
  'settings.general.tab-behavior': 'टैब व्यवहार',
  'settings.reviews.recurring-goals': 'आवर्ती लक्ष्य',
  'settings.reviews.recurring-goals-desc':
    'उन लक्ष्यों को परिभाषित करें जो प्रत्येक नए रिव्यू पर स्वचालित रूप से दिखाई देते हैं। रिव्यू बनने पर इन्हें कॉपी किया जाता है, और प्रति-रिव्यू संपादित किया जा सकता है।',
  'settings.reviews.daily-goals': 'दैनिक लक्ष्य',
  'settings.reviews.daily-goal-placeholder': 'एक आवर्ती दैनिक लक्ष्य जोड़ें...',
  'settings.reviews.weekly-goals': 'साप्ताहिक लक्ष्य',
  'settings.reviews.weekly-goal-placeholder':
    'एक आवर्ती साप्ताहिक लक्ष्य जोड़ें...',
  'settings.reviews.pre-trade-checklist': 'DRC प्री-ट्रेड चेकलिस्ट',
  'settings.reviews.pre-trade-checklist-desc':
    'चेकलिस्ट आइटम को परिभाषित करें जो स्वचालित रूप से प्रत्येक नए दैनिक रिपोर्ट कार्ड पर दिखाई देते हैं। इन्हें बनाए जाने पर प्रत्येक DRC में कॉपी किया जाता है, और प्रति दिन संपादित किया जा सकता है।',
  'settings.reviews.checklist-placeholder': 'एक चेकलिस्ट आइटम जोड़ें...',
  'settings.reviews.weekly-checklist': 'साप्ताहिक तैयारी चेकलिस्ट',
  'settings.reviews.weekly-checklist-desc':
    'चेकलिस्ट आइटम को परिभाषित करें जो स्वचालित रूप से प्रत्येक नए वीकली रिव्यू पर दिखाई देते हैं। इन्हें बनाए जाने पर प्रत्येक साप्ताहिक रिव्यू में कॉपी किया जाता है, और प्रति सप्ताह संपादित किया जा सकता है।',
  'settings.reviews.weekly-checklist-placeholder':
    'एक साप्ताहिक चेकलिस्ट आइटम जोड़ें...',
  'settings.reviews.auto-create': 'स्वचालित रूप से रिव्यू बनाएं',
  'settings.reviews.global-auto-create': 'ग्लोबल ऑटो-क्रिएट रिव्यूज़',
  'settings.reviews.global-auto-create-desc':
    'जब संबंधित अवधि का पहला ट्रेड रिकॉर्ड किया जाता है तो स्वचालित रूप से रिव्यू बनाएं। यह सेटिंग दैनिक, साप्ताहिक, मासिक, त्रैमासिक और वार्षिक रिव्यू पर लागू होती है।',
  'settings.reviews.global-auto-create-aria': 'ग्लोबल ऑटो-क्रिएट रिव्यूज़',
  'settings.reviews.auto-create-drc-nav':
    'नेविगेशन पर स्वचालित रूप से DRC बनाएं',
  'settings.reviews.auto-create-drc-nav-desc':
    'किसी ऐसे दिन पर नेविगेट करते समय स्वचालित रूप से एक नया दैनिक रिपोर्ट कार्ड बनाएं जिसमें कोई नहीं है',
  'settings.reviews.auto-create-drc-nav-aria':
    'नेविगेशन पर स्वचालित रूप से DRC बनाएं',
  'settings.reviews.auto-create-weekly-nav':
    'नेविगेशन पर साप्ताहिक रिव्यू स्वतः बनाएँ',
  'settings.reviews.auto-create-weekly-nav-desc':
    'किसी ऐसे सप्ताह में नेविगेट करते समय स्वचालित रूप से एक नया वीकली रिव्यू बनाएं जिसमें कोई नहीं है',
  'settings.reviews.auto-create-weekly-nav-aria':
    'नेविगेशन पर साप्ताहिक रिव्यू स्वतः बनाएँ',
  'settings.reviews.auto-create-monthly-nav':
    'नेविगेशन पर स्वचालित रूप से मासिक रिव्यू बनाएं',
  'settings.reviews.auto-create-monthly-nav-desc':
    'किसी ऐसे महीने में नेविगेट करते समय स्वचालित रूप से एक नया मंथली रिव्यू बनाएं जिसमें कोई नहीं है',
  'settings.reviews.auto-create-monthly-nav-aria':
    'नेविगेशन पर स्वचालित रूप से मासिक रिव्यू बनाएं',
  'settings.reviews.auto-create-quarterly-nav':
    'नेविगेशन पर स्वचालित रूप से त्रैमासिक रिव्यू बनाएं',
  'settings.reviews.auto-create-quarterly-nav-desc':
    'किसी ऐसे क्वार्टर में नेविगेट करते समय स्वचालित रूप से एक नया क्वार्टरली रिव्यू बनाएं जहां कोई नहीं है',
  'settings.reviews.auto-create-quarterly-nav-aria':
    'नेविगेशन पर स्वचालित रूप से त्रैमासिक रिव्यू बनाएं',
  'settings.reviews.auto-create-yearly-nav':
    'नेविगेशन पर वार्षिक रिव्यू स्वतः बनाएँ',
  'settings.reviews.auto-create-yearly-nav-desc':
    'किसी ऐसे वर्ष में नेविगेट करते समय स्वचालित रूप से एक नया इयरली रिव्यू बनाएं जिसमें कोई वर्ष नहीं है',
  'settings.reviews.auto-create-yearly-nav-aria':
    'नेविगेशन पर वार्षिक रिव्यू स्वतः बनाएँ',

  'settings.reviews.notice.builder-not-found': 'लेआउट बिल्डर कमांड नहीं मिला',
  'settings.reviews.notice.global-auto-create':
    'सभी रिव्यूज़ {status} के लिए स्वतः बनाएँ',
  'settings.reviews.notice.auto-create-nav':
    'नेविगेशन {status} पर स्वचालित रूप से {type} बनाएं',
  'settings.reviews.daily.checklist-title': 'प्री-ट्रेड चेकलिस्ट आइटम',

  'settings.reviews.daily.questions-title': 'रिव्यू प्रश्न',

  'library.type.drc': 'DRC',
  'library.type.weekly': 'साप्ताहिक',
  'library.type.monthly': 'मासिक',
  'library.type.quarterly': 'त्रैमासिक',
  'library.type.yearly': 'सालाना',
  'library.type.trade': 'ट्रेड',
  'library.error.invalid-share-code': 'अमान्य शेयर कोड',
  'library.notice.import-success':
    'लेआउट "{name}" इंपोर्ट किया गया सफलतापूर्वक!',
  'library.error.import-failed': 'लेआउट इंपोर्ट करने में विफल',
  'library.notice.select-template': 'कृपया एक्सपोर्ट के लिए एक लेआउट चुनें',
  'library.notice.template-not-found': 'लेआउट नहीं मिला',
  'library.notice.code-generated': 'शेयर कोड जनरेट हुआ!',
  'library.error.export-failed': 'लेआउट एक्सपोर्ट करने में विफल',
  'library.error.export-too-large':
    'यह लेआउट शेयर कोड के रूप में एक्सपोर्ट करने के लिए बहुत बड़ा है।',
  'library.notice.copied': 'शेयर कोड क्लिपबोर्ड पर कॉपी किया गया!',
  'library.error.copy-failed': 'क्लिपबोर्ड पर कॉपी करने में विफल',
  'library.title.import': 'लेआउट इंपोर्ट करें',
  'library.desc.import':
    'किसी अन्य उपयोगकर्ता के लेआउट को इंपोर्ट पर JRT शेयर कोड चिपकाएँ।',
  'library.label.share-code': 'कोड साझा करें',
  'library.placeholder.import-code': 'यहां JRT-...शेयर कोड चिपकाएं',
  'library.button.validating': 'सत्यापन किया जा रहा है...',
  'library.button.validate': 'मान्य',
  'library.button.import': 'लेआउट इंपोर्ट करें',
  'library.preview.valid': 'वैध लेआउट',
  'library.preview.invalid': 'अमान्य शेयर कोड',
  'library.title.export': 'लेआउट एक्सपोर्ट करें',
  'library.desc.export':
    'एक शेयर कोड जनरेट करने के लिए एक लेआउट का चयन करें जिसे अन्य लोग इंपोर्ट कर सकते हैं।',
  'library.empty.title': 'एक्सपोर्ट के लिए कोई कस्टम लेआउट नहीं।',
  'library.empty.hint':
    'पहले रिव्यू या ट्रेड लेआउट टैब में एक कस्टम लेआउट बनाएं, फिर इसे साझा करने के लिए यहां वापस आएं।',
  'library.label.select-template': 'लेआउट चुनें',
  'library.option.select-template': '-- एक लेआउट चुनें --',
  'library.button.generate-code': 'शेयर कोड जनरेट करें',
  'library.button.copy-code': 'क्लिपबोर्ड पर कॉपी करें',

  'settings.reviews.daily.timeframes-title': 'पूर्वानुमान समय-सीमा',

  'settings.reviews.daily.timeframes-placeholder':
    'नई समयसीमा (जैसे, 15एम, 5एम)',
  'settings.weekly.review-questions': 'रिव्यू प्रश्न',

  'settings.weekly.forecast-timeframes': 'पूर्वानुमान समय-सीमा',

  'settings.shared.timeframes.title': 'पूर्वानुमान समय-सीमा',

  'settings.shared.timeframes.placeholder': 'नई समयसीमा (जैसे, 15एम, 5एम)',

  'shared.empty-state.message': 'कोई डेटा मौजूद नहीं',

  'weekly.tab.review': 'रिव्यू',
  'weekly.review.drcs.title': 'इस सप्ताह के लिए दैनिक रिव्यूज़',

  'account.settings.modal.title': 'अकाउंट डैशबोर्ड सेटिंग्स',
  'account.settings.notice.name-empty':
    'अकाउंट प्रकार का नाम रिक्त नहीं हो सकता',
  'account.settings.notice.type-exists':
    'अकाउंट प्रकार "{name}" पहले से मौजूद है',
  'account.settings.notice.reserved-name':
    '"{name}" एक आरक्षित अकाउंट प्रकार का नाम है',
  'account.settings.notice.type-added':
    'अकाउंट प्रकार "{name}" सफलतापूर्वक जोड़ा गया',
  'account.settings.notice.add-error':
    'अकाउंट प्रकार जोड़ने में त्रुटि: {error}',
  'account.settings.notice.cannot-delete-archived':
    '"संग्रहीत" अकाउंट प्रकार को हटाया नहीं जा सकता - यह अकाउंट्स को संग्रहीत करने के लिए आरक्षित है',
  'account.settings.notice.analyze-error':
    'अकाउंट प्रकार के उपयोग का विश्लेषण करने में त्रुटि',
  'account.settings.notice.cannot-delete-has-accounts':
    '"{name}" को हटाया नहीं जा सकता - इसमें {count} संबद्ध अकाउंट्स है। माइग्रेशन सुविधा जल्द ही आ रही है.',
  'account.settings.notice.saved':
    'अकाउंट डैशबोर्ड सेटिंग्स सफलतापूर्वक सहेजा गया',
  'account.settings.notice.save-error':
    'सेटिंग्स को सहेजने में त्रुटि: {error}',
  'account.settings.notice.migration-target-required':
    'कृपया पुन:असाइनमेंट के लिए लक्ष्य अकाउंट प्रकार का चयन करें',
  'account.settings.notice.migration-failed': 'माइग्रेशन विफल: {error}',
  'account.settings.notice.type-deleted':
    'अकाउंट प्रकार "{name}" सफलतापूर्वक हटा दिया गया',
  'account.settings.notice.type-deleted-with-cleanup':
    'अकाउंट प्रकार "{name}" सफलतापूर्वक हटाया गया (साफ किया गया: {actions})',
  'account.settings.notice.migration-error':
    'माइग्रेशन के दौरान त्रुटि: {error}',
  'account.settings.notice.delete-error':
    'अकाउंट प्रकार को हटाने में त्रुटि: {error}',
  'account.settings.notice.operation-failed': '{operation} विफल: {error}',
  'account.settings.notice.migration-no-targets':
    'अकाउंट्स को माइग्रेट नहीं किया जा सकता - कोई अन्य अकाउंट प्रकार उपलब्ध नहीं है। पहले एक नया अकाउंट प्रकार बनाएं।',
  'account.settings.notice.type-deleted-migrated':
    'अकाउंट प्रकार "{name}" सफलतापूर्वक हटाया गया। {count} अकाउंट्स {action}',
  'account.settings.operation.type-deletion': 'अकाउंट प्रकार विलोपन',
  'account.settings.migration.error.target-required':
    'पुन:असाइनमेंट के लिए लक्ष्य प्रकार आवश्यक है',
  'account.settings.migration.error.invalid-option': 'अमान्य माइग्रेशन विकल्प',
  'account.settings.unnamed-account': 'अनाम अकाउंट',
  'account.settings.migration.title': 'हटाने से पहले अकाउंट्स माइग्रेट करें',
  'account.settings.migration.warning':
    'आप "{name}" को हटाने वाले हैं जिसमें {count} संबद्ध अकाउंट्स है।',
  'account.settings.migration.instruction':
    'अकाउंट प्रकार को हटाए जाने से पहले इन अकाउंट को संभाला जाना चाहिए:',
  'account.settings.migration.more-accounts': '... और {count} और अधिक',
  'account.settings.migration.choose-option':
    'चुनें कि इन अकाउंट को कैसे संभालना है:',
  'account.settings.migration.option.reassign.title':
    'भिन्न प्रकार के लिए पुन: असाइन करें',
  'account.settings.migration.option.reassign.desc':
    'सभी अकाउंट को किसी अन्य अकाउंट प्रकार में ले जाएँ',
  'account.settings.migration.target-type.label': 'लक्ष्य अकाउंट प्रकार:',
  'account.settings.migration.option.archive.title': 'पुरालेख अकाउंट्स',
  'account.settings.migration.option.archive.desc':
    'सभी अकाउंट्स को "संग्रहीत" स्थिति में ले जाएँ',
  'account.settings.migration.option.delete.title': 'हटाने के लिए चिह्नित करें',
  'account.settings.migration.option.delete.desc':
    'सभी अकाउंट को हटाए गए के रूप में चिह्नित करें',
  'account.settings.migration.button.migrate': 'माइग्रेट करें और प्रकार हटाएं',
  'account.settings.migration.button.migrating': 'पलायन...',
  'account.settings.migration.action.reassigned':
    '"{target}" को पुनः सौंपा गया',
  'account.settings.migration.action.archived':
    'संग्रहीत स्थिति में ले जाया गया',
  'account.settings.migration.action.deleted': 'हटाने के लिए चिह्नित किया गया',
  'account.settings.delete.title': 'अकाउंट प्रकार हटाएँ',
  'account.settings.delete.confirm-question':
    'क्या आप वाकई अकाउंट प्रकार "{name}" को हटाना चाहते हैं?',
  'account.settings.delete.impact-analysis': 'प्रभाव विश्लेषण:',
  'account.settings.delete.affected-accounts': '⚠️ {count} अकाउंट प्रभावित:',
  'account.settings.delete.migration-notice':
    'ध्यान दें: हटाने से पहले इन अकाउंट को एक अलग अकाउंट प्रकार में पुन: असाइन करने की आवश्यकता होगी।',
  'account.settings.delete.no-affected':
    '✅ कोई भी अकाउंट इस अकाउंट प्रकार का उपयोग नहीं कर रहा है',
  'account.settings.delete.cleanup-title': 'सेटिंग्स जिसे साफ़ किया जाएगा:',
  'account.settings.delete.cleanup.excluded':
    '✓ बहिष्कृत अकाउंट प्रकारों से हटाया गया',
  'account.settings.delete.cleanup.order': '✓ प्रदर्शन क्रम से हटा दिया गया',
  'account.settings.delete.cleanup.withdrawals':
    '✓ निकासी से हटाया गया सेटिंग्स',
  'account.settings.delete.cleanup.none':
    'कोई सेटिंग्स सफ़ाई की आवश्यकता नहीं है',
  'account.settings.delete.button.setup-migration': 'माइग्रेशन सेट करें',
  'account.settings.delete.button.delete': 'अकाउंट प्रकार हटाएँ',
  'account.settings.delete.button.deleting': 'हटाया जा रहा है...',
  'account.settings.section.available-types.title': 'उपलब्ध अकाउंट प्रकार',
  'account.settings.section.available-types.desc':
    'आपके सिस्टम में वर्तमान अकाउंट प्रकार।',
  'account.settings.section.available-types.placeholder':
    'अकाउंट प्रकार का नाम दर्ज करें...',
  'account.settings.section.available-types.add-aria':
    'नया अकाउंट प्रकार जोड़ें',
  'account.settings.section.available-types.delete-aria': '{name} हटाएं',
  'account.settings.section.available-types.empty':
    'कोई कस्टम अकाउंट प्रकार परिभाषित नहीं है।',
  'account.settings.section.inclusion.title': 'डैशबोर्ड अकाउंट प्रकार',
  'account.settings.section.inclusion.desc':
    'चुनें कि डैशबोर्ड आंकड़ों में कौन से अकाउंट प्रकार दिखाई देते हैं, क्या निकासी की गिनती होती है, और उनका प्रदर्शन क्रम क्या है।',
  'account.settings.section.inclusion.include-dashboard':
    'डैशबोर्ड आँकड़ों में',
  'account.settings.section.inclusion.include-withdrawals': 'निकासी',
  'account.settings.section.inclusion.empty':
    'कॉन्फ़िगर करने के लिए कोई अकाउंट प्रकार उपलब्ध नहीं है।',
  'account.settings.section.order.title': 'आदेश को प्रदर्शित करें',

  'account.settings.section.order.move-up': 'ऊपर ले जाएँ',
  'account.settings.section.order.move-down': 'नीचे ले जाएँ',
  'account.settings.button.save': 'सेटिंग्स सहेजें',
  'account.settings.button.saving': 'सहेजा जा रहा है...',

  'weekly.review.performance.title': 'प्रदर्शन स्व-मूल्यांकन',
  'weekly.review.performance.mental': 'मानसिक प्रदर्शन',

  'weekly.review.performance.technical': 'तकनीकी निष्पादन',

  'weekly.review.questions.title': 'साप्ताहिक रिव्यू प्रश्न',

  'weekly.review.goals.title': 'अगले सप्ताह के लिए लक्ष्य',

  'weekly.preparation.goals.title': 'साप्ताहिक लक्ष्य',

  'weekly.preparation.events.title': 'प्रमुख घटनाएँ',

  'weekly.preparation.events.add-button': 'कार्यक्रम जोड़ें',

  'weekly.preparation.forecast.title': 'साप्ताहिक पूर्वानुमान',
  'weekly.overview.pnl-chart.title': 'साप्ताहिक संचयी P&L',

  'weekly.overview.drawdown-chart.title': 'साप्ताहिक ड्रॉडाउन',

  'weekly.overview.performance.title': 'साप्ताहिक प्रदर्शन',

  'weekly.overview.setup-performance.title': 'सेटअप प्रदर्शन',

  'weekly.overview.trades-chart.title': 'साप्ताहिक ट्रेड्स',

  'weekly.overview.best-trade.title': 'सप्ताह का सर्वश्रेष्ठ ट्रेड',

  'weekly.overview.worst-trade.title': 'सप्ताह का सबसे खराब ट्रेड',

  'weekly.overview.daily-performance.title': 'दैनिक प्रदर्शन',

  'weekly.overview.button.create-trade': 'ट्रेड बनाएं',
  'weekly.overview.button.view-trade-details': 'ट्रेड विवरण देखें',

  'monthly.tab.review': 'रिव्यू',

  'backend.title': 'Trade Sync',
  'backend.description':
    'अपने वॉल्ट को अपने आप अपडेट रखने के लिए समर्थित ब्रोकरों के लिए Trade Sync सेट करें।',

  'trade-sync.gate.pro.description':
    'Trade Sync एक प्रो फीचर है। जारी रखने के लिए अपग्रेड करें.',

  'trade-sync.gate.feature-unavailable.title': 'सुविधा अनुपलब्ध',
  'trade-sync.gate.feature-unavailable.description':
    'यह सिंक सुविधा आपके Pro अकाउंट के लिए सक्षम नहीं है। यदि यह बनी रहती है तो अपनी स्थिति ताज़ा करें या सहायता से संपर्क करें।',
  'trade-sync.trial.title': 'अपने ट्रेडिंग जर्नल को स्वचालित करें',
  'trade-sync.trial.description':
    'Journalit प्रो के साथ सप्ताह में 7 घंटे तक बचाएं।',
  'trade-sync.trial.benefit.sync': 'स्वचालित ट्रेड सिंक',
  'trade-sync.trial.benefit.import': 'कहीं से भी ट्रेड्स इंपोर्ट करें',
  'trade-sync.trial.cta': 'अपना 14-दिवसीय निःशुल्क परीक्षण प्रारंभ करें',
  'trade-sync.trial.existing-subscriber': 'पहले से सब्सक्राइब है? साइन इन करें',
  'trade-sync.trial.eligibility':
    'निःशुल्क परीक्षण केवल नए ग्राहकों के लिए उपलब्ध है।',

  'premium.gate.cta.continue-pro': 'PRO जारी रखें',

  'premium.gate.cta.refresh': 'ताज़ा स्थिति',

  'premium.gate.offline':
    'आप ऑफ़लाइन प्रतीत होते हैं. सक्रियण के लिए इंटरनेट की आवश्यकता है.',
  'premium.gate.not-pro-yet':
    'आप साइन इन हैं, लेकिन आपका अकाउंट अभी तक PRO नहीं है। अपग्रेड करें और फिर रीफ्रेश करें.',

  'backend.status.connected': 'जुड़े हुए',
  'backend.status.disconnected': 'डिस्कनेक्ट किया गया',
  'backend.status.checking': 'जाँच हो रही है...',
  'backend.register.title': 'वॉल्ट रजिस्टर करें',
  'backend.register.description':
    'इस वॉल्ट को सिंक के लिए बैकएंड सर्वर के साथ पंजीकृत करें',
  'backend.register.button': 'वॉल्ट रजिस्टर करें',
  'backend.register.registering': 'पंजीकरण हो रहा है...',
  'backend.ftp.title': 'एफ़टीपी क्रेडेंशियल',
  'backend.ftp.description':
    'MetaTrader रिपोर्ट अपलोड करने के लिए FTP क्रेडेंशियल बनाएं। एक अद्वितीय उपयोगकर्ता नाम स्वचालित रूप से उत्पन्न हो जाएगा.',
  'backend.ftp.create-button': 'एफ़टीपी क्रेडेंशियल बनाएं',
  'backend.ftp.creating': 'बनाया जा रहा है...',

  'backend.sync.auto-sync': 'ऑटो-सिंक सक्षम करें',
  'backend.sync.auto-sync-desc': 'बैकएंड सर्वर से स्वचालित रूप से सिंक ट्रेड्स',
  'backend.sync.auto-sync-info': 'ऑटो-सिंक हर घंटे नए ट्रेड्स की जांच करता है',
  'backend.sync.auto-sync-aria': 'ऑटो-सिंक सक्षम करें',

  'backend.sync.syncing': 'सिंक हो रहा है...',

  'backend.sync.last-result': 'अंतिम सिंक परिणाम',
  'backend.sync.synced-trades':
    '{trades} ट्रेड्स सिंक हुए ({files} नई फ़ाइलें)',
  'backend.sync.no-new-trades': 'सिंक में कोई नए ट्रेड्स नहीं',
  'backend.sync.status': 'सिंक स्थिति',
  'backend.sync.last-sync': 'अंतिम सिंक',
  'backend.sync.total-syncs': 'कुल सिंक',
  'backend.sync.never': 'कभी नहीं',
  'backend.sync.invalid-date': 'अमान्य दिनांक',
  'backend.notice.vault-registered': '✅ ट्रेडिंग सर्वर के साथ पंजीकृत वॉल्ट',
  'backend.notice.sync-cancelled': '⏹️ सिंक रद्द कर दिया गया',
  'backend.notice.sync-in-progress': '⚠️ सिंक पहले से ही प्रगति पर है',
  'backend.notice.account-info-failed':
    '❌ अकाउंट जानकारी प्राप्त करने में विफल',
  'backend.notice.sync-batch-progress':
    '⏳ सिंकिंग बैच: {count} ट्रेड्स ({progress}% पूर्ण, {remaining} शेष)',
  'backend.notice.all-trades-synced':
    '✅ सभी {count} ट्रेड्स पहले से ही सिंक किया गया हैं',
  'backend.notice.account-created': '📊 निर्मित अकाउंट: {name}',
  'backend.notice.batch-complete':
    '⏳ बैच पूर्ण: {processed}/{total} ट्रेड्स ({progress}%)। जारी...',
  'backend.notice.sync-complete':
    '✅ सिंक पूर्ण: {total} ट्रेड्स संसाधित ({newFiles} नया, {updated} अद्यतन) {accounts} अकाउंट(s) में',
  'backend.notice.sync-complete-no-trades':
    '✅ सिंक पूर्ण - कोई नया ट्रेड्स नहीं मिला',
  'backend.notice.sync-failed': '❌ सिंक विफल: {error}',

  'backend.accounts.linked': 'लिंक किए गए MT अकाउंट्स',
  'backend.accounts.linked-desc':
    'सिंक की गई रिपोर्ट से मिले MetaTrader अकाउंट्स',
  'backend.accounts.server-disconnected':
    'सर्वर डिसकनेक्ट हो गया है. कृपया कनेक्शन स्थिति जांचें.',
  'backend.accounts.loading': 'अकाउंट्स लोड हो रहा है...',
  'backend.accounts.no-accounts': 'कोई अकाउंट्स नहीं मिला.',
  'backend.accounts.sync-to-detect':
    'अकाउंट्स खोजने के लिए कुछ ट्रेड्स सिंक करें।',
  'backend.accounts.connect-to-see':
    'अकाउंट देखने के लिए सर्वर और सिंक ट्रेड्स से कनेक्ट करें।',
  'backend.accounts.account-id': 'अकाउंट आईडी',
  'backend.accounts.broker': 'ब्रोकर',
  'backend.accounts.first-seen': 'पहली बार देखा',
  'backend.accounts.last-seen': 'अंतिम बार देखा गया',
  'backend.accounts.refresh': 'अकाउंट्स ताज़ा करें',
  'backend.accounts.unlink-title': 'MetaTrader अकाउंट को अनलिंक करें',
  'backend.accounts.unlink': 'अनलिंक',
  'backend.accounts.unlink-confirm':
    'MetaTrader अकाउंट {accountId} को अनलिंक करें? इसे Trade Sync से छिपा दिया जाएगा और भविष्य के इंपोर्ट को तब तक छोड़ दिया जाएगा जब तक आप इसे दोबारा लिंक नहीं करते।',
  'backend.accounts.unlink-success': 'MetaTrader अकाउंट अनलिंक किया गया',
  'backend.accounts.relink': 'रीलिंक',
  'backend.accounts.relink-success': 'MetaTrader अकाउंट पुनः लिंक किया गया',
  'backend.accounts.ignored.title': 'अनलिंक किया गया अकाउंट्स',
  'backend.accounts.ignored.count': '{count} छिपा हुआ',
  'backend.accounts.ignored.empty': 'कोई अनलिंक किया गया अकाउंट्स नहीं.',
  'backend.accounts.ignored-at': 'अनलिंक',

  'backend.cards.connection.title': 'कनेक्शन',
  'backend.cards.connection.refresh': 'ताज़ा करें',
  'backend.cards.sync.title': 'सिंक स्थिति',
  'backend.cards.sync.last-sync': 'अंतिम सिंक',
  'backend.cards.sync.total': 'कुल सिंक',
  'backend.cards.sync.button': 'अभी सिंक करें',
  'backend.cards.sync.cancel': 'सिंक रद्द करें',
  'backend.cards.accounts.title': 'अकाउंट्स',
  'backend.cards.accounts.linked': 'लिंक किए गए अकाउंट्स',
  'backend.cards.accounts.manage': 'प्रबंधित करें',
  'backend.section.setup.title': 'सेटअप और कॉन्फ़िगरेशन',
  'backend.section.sync.title': 'सिंक सेटिंग्स',
  'backend.section.accounts.title': 'अकाउंट प्रबंधन',
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'एआई CSV मैपिंग',
  'settings.auth.feature.trade-sync': 'ट्रेड सिंक',
  'settings.auth.feature.economic-calendar': 'आर्थिक कैलेंडर',
  'settings.auth.feature.basic-tracking': 'बुनियादी ट्रेड ट्रैकिंग',

  'settings.auth.feature.manual-entry': 'मैनुअल ट्रेड एंट्री',
  'settings.auth.feature.analytics-reviews': 'एनालिटिक्स और रिव्यूज़',
  'settings.auth.feature.priority-support': 'प्राथमिकता समर्थन',
  'backend.sync.just-now': 'बस अब',
  'backend.sync.minutes-ago': '{count} मिनट पहले',
  'backend.sync.hours-ago': '{count} घंटा पहले',
  'backend.sync.days-ago': '{count} दिन पहले',

  'csv.format': 'इंपोर्ट प्रारूप:',

  'csv.button.export-template': 'एक्सपोर्ट टेम्पलेट',
  'csv.button.delete-template': 'टेम्पलेट हटाएं',

  'csv.button.import-another': 'एक अन्य फ़ाइल इंपोर्ट करें',
  'csv.results.complete': 'इंपोर्ट पूर्ण',
  'csv.results.history-ready': 'आपका ट्रेडिंग इतिहास तैयार है',
  'csv.results.completed-with-issues': 'आयात समस्याओं के साथ पूरा हुआ',
  'csv.results.failed': 'इंपोर्ट विफल',
  'csv.results.success.one':
    'सफलतापूर्वक इंपोर्ट किया गया {count} ट्रेड से अकाउंट: {account}',
  'csv.results.success.few':
    'सफलतापूर्वक इंपोर्ट किया गया {count} ट्रेड्स से अकाउंट: {account}',
  'csv.results.success.many':
    'सफलतापूर्वक इंपोर्ट किया गया {count} ट्रेड्स से अकाउंट: {account}',
  'csv.results.success.other':
    'सफलतापूर्वक इंपोर्ट किया गया {count} ट्रेड्स से अकाउंट: {account}',
  'csv.results.updated.one': 'अद्यतन {count} मौजूदा ट्रेड',
  'csv.results.updated.few': 'अद्यतन {count} मौजूदा ट्रेड्स',
  'csv.results.updated.many': 'अद्यतन {count} मौजूदा ट्रेड्स',
  'csv.results.updated.other': 'अद्यतन {count} मौजूदा ट्रेड्स',
  'csv.results.skipped.one':
    '{count} डुप्लिकेट ट्रेड को छोड़ दिया गया (पहले से ही वॉल्ट में)',
  'csv.results.skipped.few':
    '{count} डुप्लिकेट ट्रेड्स को छोड़ दिया गया (पहले से ही वॉल्ट में)',
  'csv.results.skipped.many':
    '{count} डुप्लिकेट ट्रेड्स को छोड़ दिया गया (पहले से ही वॉल्ट में)',
  'csv.results.skipped.other':
    '{count} डुप्लिकेट ट्रेड्स को छोड़ दिया गया (पहले से ही वॉल्ट में)',

  'csv.results.broker': 'ब्रोकर: {broker}',

  'csv.results.more-trades.one': 'और {count} अधिक ट्रेड...',
  'csv.results.more-trades.few': 'और {count} अधिक ट्रेड्स...',
  'csv.results.more-trades.many': 'और {count} अधिक ट्रेड्स...',
  'csv.results.more-trades.other': 'और {count} अधिक ट्रेड्स...',
  'csv.results.errors-header': 'त्रुटियाँ देखने के लिए क्लिक करें ({count})',
  'csv.results.discord-note':
    'वैकल्पिक: यदि आपको सहायता की आवश्यकता है, तो रिपोर्ट कॉपी करें पर क्लिक करें और इसे Discord में पेस्ट करें।',

  'csv.errors.copy-report': 'रिपोर्ट कॉपी करें',

  'csv.errors.copied': 'कॉपी किया गया',
  'csv.errors.rows': 'पंक्तियाँ: {rows}',
  'csv.errors.suggestion': 'सुझाव:',

  'csv.errors.raw-errors-limit':
    '{total} त्रुटियों में से पहला {shown} दिखाया जा रहा है',

  'csv.report.plugin-version': 'प्लगइन संस्करण: {version}',

  'csv.report.broker': 'ब्रोकर: {broker}',

  'csv.report.top-issues': 'शीर्ष मुद्दे:',

  'csv.broker-guide.tradovate.step-2':
    '"ऑर्डर" टैब पर क्लिक करें (प्रदर्शन टैब नहीं)',

  'csv.broker-guide.tradovate.warning.emphasis': 'महत्वपूर्ण:',
  'csv.broker-guide.tradovate.warning.message':
    'केवल ऑर्डर टैब का उपयोग करें. प्रदर्शन टैब संगत नहीं है.',

  'csv.broker-guide.ibkr.warning.emphasis': 'ऑर्डर का उपयोग अवश्य करें',

  'csv.broker-guide.tradingview.step-3': 'ड्रॉपडाउन से "ऑर्डर हिस्ट्री" चुनें',

  'csv.broker-guide.tradingview.warning.message':
    'अन्य एक्सपोर्ट प्रकार (जैसे पोजीशन या ऑर्डर) इंपोर्ट के लिए काम नहीं करेंगे।',

  'csv.broker-guide.hyperliquid.warning.emphasis': '10,000 एंट्री सीमा।',

  'csv.broker-guide.sierrachart.step-1':
    'ट्रेड गतिविधि लॉग खोलें (ट्रेड → ट्रेड गतिविधि लॉग, या Ctrl+Shift+A)',

  'csv.broker-guide.atas.warning.emphasis': 'महत्वपूर्ण:',
  'csv.broker-guide.atas.warning.message':
    'एक्सपोर्ट किया गया फ़ाइल को संपादित न करें. Journalit "जर्नल" शीट से ट्रेड्स को संरक्षित करता है और, जब उपलब्ध हो, "एक्ज़ीक्यूशन" शीट से मिलान भरने का उपयोग करके ब्रोकरेज को समृद्ध करता है।',

  'csv.broker-guide.rithmic.warning.emphasis': 'महत्वपूर्ण:',

  'csv.broker-guide.jdr.warning.emphasis': 'महत्वपूर्ण:',

  'csv.date-format.auto-detect':
    'स्वतः-पहचान (आईएसओ/मानक प्रारूपों के लिए अनुशंसित)',
  'csv.date-format.us-date':
    'यूएस दिनांक: 12/25/2024 (श्वाब, फिडेलिटी, ई*ट्रेड)',
  'csv.date-format.us-datetime': 'यूएस दिनांक समय: 12/25/2024 14:30:00 (वेबुल)',
  'csv.date-format.us-short': 'यूएस शॉर्ट: 1/5/2024 (ट्रेडज़ीरो)',
  'csv.date-format.us-short-datetime':
    'यूएस शॉर्ट दिनांक समय: 1/5/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'आईएसओ दिनांक समय: 2024-12-25 14:30:00 (बायबिट, टीएमटीओके0एक्स)',
  'csv.date-format.iso-date': 'आईएसओ दिनांक: 2024-12-25 (इंटरैक्टिव ब्रोकर्स)',
  'csv.date-format.eu-date': 'ईयू दिनांक: 25/12/2024 (दिन/माह/वर्ष)',
  'csv.date-format.eu-datetime': 'ईयू दिनांक समय: 25/12/2024 14:30:00',
  'csv.date-format.eu-dash': 'ईयू डैश: 25-12-2024',
  'csv.date-format.eu-dash-datetime': 'ईयू डैश दिनांक समय: 25-12-2024 14:30:00',
  'upgrade.title': 'प्रो में अपग्रेड',
  'upgrade.feature-message':
    '{featureName} एक प्रो फीचर है। उन्नत स्वचालन और सुविधाओं को अनलॉक करने के लिए अपग्रेड करें।',
  'upgrade.benefits-title': 'प्रो सुविधाओं में शामिल हैं:',
  'upgrade.benefit.csv': 'एआई-असिस्टेड कॉलम मैपिंग के साथ CSV इंपोर्ट',
  'upgrade.benefit.economic-calendar':
    'स्वचालित साप्ताहिक इवेंट इंपोर्ट वाला आर्थिक कैलेंडर',
  'upgrade.benefit.trade-sync': 'समर्थित ब्रोकरों के लिए Trade Sync',
  'upgrade.benefit.multi-account': 'मल्टी-अकाउंट समर्थन',
  'upgrade.prop-profiles.message-firms':
    'Journalit आपकी चैलेंज को प्रीफिल करने के लिए {count} प्रॉप फर्मों के नियम तैयार रखता है।',
  'upgrade.prop-profiles.message-firm':
    'Journalit के पास हर {firm} चैलेंज के नियम प्रीफिल के लिए तैयार हैं।',
  'upgrade.prop-profiles.message':
    'Journalit प्रॉप फर्म के नियम आपकी चैलेंज में भरने के लिए तैयार रखता है।',
  'upgrade.prop-profiles.benefits-title': 'Pro आपके लिए क्या भरता है:',
  'upgrade.benefit.prop.rules':
    'आपकी फर्म के नियमों से सीधे ड्रॉडाउन और दैनिक हानि सीमाएं',
  'upgrade.benefit.prop.payout': 'पेआउट सीमाएं और पात्रता शर्तें',
  'upgrade.benefit.prop.phases': 'आपके चुने चैलेंज के फेज लक्ष्य और प्रगति',
  'upgrade.benefit.prop.updates': 'फर्म द्वारा नियम बदलने पर अपडेट',
  'upgrade.trial-notice':
    'अपने सभी ऐतिहासिक ट्रेड्स इंपोर्ट का 2 सप्ताह का निःशुल्क परीक्षण प्राप्त करें और सभी प्रो सुविधाओं को जोखिम-मुक्त आज़माएँ।',

  'monthly.overview.drawdown': 'मासिक ड्रॉडाउन',
  'monthly.overview.no-drawdown-data':
    'प्रदर्शित करने के लिए कोई ड्रॉडाउन डेटा नहीं',

  'settings.account-linking.title': 'अकाउंट लिंकिंग बदलें',
  'settings.account-linking.description':
    'सभी ट्रेड्स को एक MT अकाउंट से भिन्न Obsidian अकाउंट में ले जाएँ',
  'settings.account-linking.source.title': 'स्रोत एमटी अकाउंट',
  'settings.account-linking.source.description':
    'MT अकाउंट चुनें जिसका ट्रेड्स आप स्थानांतरित करना चाहते हैं',
  'settings.account-linking.source.placeholder': 'स्रोत अकाउंट चुनें...',
  'settings.account-linking.target.title': 'लक्ष्य Obsidian अकाउंट',
  'settings.account-linking.target.description':
    'ट्रेड्स को लिंक करने के लिए Obsidian अकाउंट का चयन करें',
  'settings.account-linking.target.placeholder': 'लक्ष्य अकाउंट चुनें...',
  'settings.account-linking.button.processing': 'प्रसंस्करण...',
  'settings.account-linking.button.relink': 'अकाउंट को पुनः लिंक करें',
  'settings.account-linking.warning':
    'यह लक्ष्य अकाउंट से लिंक होने के लिए स्रोत अकाउंट से सभी सिंक किया गया ट्रेड्स को अपडेट करेगा। यह कार्रवाई पूर्ववत नहीं की जा सकती.',
  'settings.account-linking.success.relinked':
    '{count} ट्रेड्स को {source} से {target} में सफलतापूर्वक पुनः लिंक किया गया',
  'settings.account-linking.error.select-both':
    'कृपया स्रोत और लक्ष्य अकाउंट दोनों का चयन करें',
  'settings.account-linking.error.source-not-found': 'स्रोत अकाउंट नहीं मिला',
  'settings.account-linking.error.target-not-found': 'लक्ष्य अकाउंट नहीं मिला',
  'settings.account-linking.error.already-linked':
    'यह MT अकाउंट पहले से ही चयनित Obsidian अकाउंट से लिंक है',
  'settings.account-linking.error.service-manager':
    'सेवा प्रबंधक उपलब्ध नहीं है',
  'settings.account-linking.error.backend-service':
    'बैकएंड सेवा उपलब्ध नहीं है',
  'settings.account-linking.error.relink-failed':
    'अकाउंट: {error} को पुनः लिंक करने में विफल',
  'account.type.demo': 'डेमो',
  'account.type.evaluation': 'इवैल्यूएशन',
  'account.type.funded': 'फंडेड',
  'account.type.archived': 'संग्रहीत',
  'account-page.error.title': 'अकाउंट लोड करने में त्रुटि',
  'account-page.error.not-found':
    '"{accountName}" के लिए अकाउंट डेटा नहीं मिल सका',
  'account-page.error.not-found-sub':
    'कृपया जांचें कि क्या अकाउंट मौजूद है या पृष्ठ को ताज़ा करने का प्रयास करें।',
  'account-page.guide.empty.intro.title': 'यह पेज विस्तार से एक अकाउंट है',
  'account-page.guide.empty.intro.description':
    'एक अकाउंट को प्रबंधित करने, अकाउंट ईवेंट रिकॉर्ड करने और जब आप रिव्यू ट्रेड्स चाहते हैं तो इसके फ़िल्टर किए गए ट्रेड लॉग को खोलने के लिए अकाउंट पेज का उपयोग करें।',
  'account-page.guide.empty.edit-account.title':
    'अकाउंट संपादित करें पूर्ण अकाउंट सेटिंग्स खोलता है',
  'account-page.guide.empty.edit-account.description':
    'अकाउंट नाम, प्रकार, मुद्रा, ड्रॉडाउन नियम, लाभ लक्ष्य, मासिक लागत और बहुत कुछ बदलने के लिए इस बटन का उपयोग करें।',
  'account-page.guide.empty.add-event.title':
    'इवेंट जोड़ें जमा और निकासी रिकॉर्ड करता है',
  'account-page.guide.empty.add-event.description':
    'जब भी पैसा सामान्य ट्रेड्स के बाहर अकाउंट के अंदर या बाहर जाता है तो इस बटन का उपयोग करें।',
  'account-page.guide.empty.transactions.title':
    'यहां जमा और निकासी पर नज़र रखी जाती है',
  'account-page.guide.empty.transactions.description':
    'यह अनुभाग मैन्युअल जमा और निकासी का इतिहास रखता है। जब यह खाली हो, तो पहला इवेंट बनाने के लिए ऐड इवेंट का उपयोग करें।',
  'account-page.guide.empty.trade-log.title':
    'इस अकाउंट को ट्रेड लॉग में खोलें',
  'account-page.guide.empty.trade-log.description':
    'यह हेडर बटन पहले से चयनित इस अकाउंट के साथ ट्रेड लॉग को खोलता है, इसलिए ट्रेड रिव्यू समर्पित ट्रेड लॉग दृश्य में रहता है।',
  'account-page.guide.main.intro.title': 'यह पेज आपका अकाउंट ब्रेकडाउन है',
  'account-page.guide.main.intro.description':
    'एक अकाउंट को स्पष्ट रूप से समझने के लिए अकाउंट पेज का उपयोग करें: संतुलन इतिहास, प्रदर्शन, जोखिम सीमा और नकदी चाल।',
  'account-page.guide.main.balance-chart.title':
    'बैलेंस चार्ट सिर्फ बैलेंस से कहीं अधिक दिखाता है',
  'account-page.guide.main.balance-chart.description':
    'यह चार्ट समय के साथ अकाउंट दिखाता है, जिसमें जमा और निकासी, साथ ही ड्रॉडाउन और अकाउंट के लिए आपके द्वारा निर्धारित लाभ-लक्ष्य स्तर शामिल हैं।',
  'account-page.guide.main.metrics.title':
    'ये मेट्रिक्स केवल इस अकाउंट को सारांशित करते हैं',
  'account-page.guide.main.metrics.description':
    'इन संख्याओं की गणना इस अकाउंट के लिए की जाती है, इसलिए आप इसके प्रदर्शन का आकलन स्वयं कर सकते हैं।',
  'account-page.guide.main.risk.title':
    'यहां जोखिम प्रगति को अलग से ट्रैक किया जाता है',
  'account-page.guide.main.risk.description':
    'यह अनुभाग दिखाता है कि अकाउंट अपनी ड्रॉडाउन सीमा या लाभ लक्ष्य के कितने करीब है। आप उन नियमों को अकाउंट संपादित करें में सेट करते हैं, जिसे हम आगे दिखाएंगे।',
  'account-page.guide.main.transactions.title':
    'जमा और निकासी अपने-अपने अनुभाग में रहते हैं',
  'account-page.guide.main.transactions.description':
    'यहां प्रत्येक एंट्री को बाद में रिव्यू किया जा सकता है, ताकि आप नकदी की आवाजाही को ट्रेडिंग प्रदर्शन से अलग कर सकें।',
  'account-page.guide.main.trade-log.title':
    'इस अकाउंट के ट्रेड्स को ट्रेड लॉग में देखें',
  'account-page.guide.main.trade-log.description':
    'ध्यान केंद्रित ट्रेड रिव्यू के लिए पहले से ही चयनित इस अकाउंट के साथ ट्रेड लॉग खोलें।',
  'account-page.guide.main.add-event.title':
    'इवेंट जोड़ें जमा और निकासी रिकॉर्ड करता है',
  'account-page.guide.main.add-event.description':
    'जब भी सामान्य ट्रेड परिणामों के बाहर पैसा जोड़ा या हटाया जाए तो इसका उपयोग करें, ताकि अकाउंट इतिहास सटीक रहे।',
  'account-page.guide.main.edit-account.title':
    'अकाउंट संपादित करें अकाउंट सेटिंग्स बदलता है',
  'account-page.guide.main.edit-account.description':
    'यह वह जगह है जहां आप अकाउंट विवरण, जोखिम नियम, ड्रॉडाउन और लाभ लक्ष्य को अपडेट करते हैं यदि वे समय के साथ बदलते हैं।',
  'account-dashboard.title': 'अकाउंट्स',
  'account-dashboard.copy-badge.base': 'आधार',
  'account-dashboard.copy-badge.copy': 'कापियर',
  'account-dashboard.copy-badge.copied-by': 'द्वारा कॉपी किया गया',
  'account-dashboard.copy-badge.copies-tooltip-masked':
    '{account} की कॉपी करता है',
  'account-dashboard.copy-badge.copies-tooltip':
    '{account} को {multiplier}x पर कॉपी करता है',
  'account-dashboard.error.init':
    'कई प्रयासों के बाद भी AccountPageService प्रारंभ नहीं हुई',
  'account-dashboard.error.loading': 'अकाउंट्स लोड करने में त्रुटि: {error}',
  'account-dashboard.error.retry':
    'अकाउंटपेजसेवा तैयार नहीं है, {delay}ms में पुनः प्रयास किया जा रहा है ({attempt}/{max} का प्रयास करें)',
  'account-dashboard.empty.title': 'कोई अकाउंट्स नहीं मिला',
  'account-dashboard.empty.message':
    'अपने ट्रेडिंग प्रदर्शन पर नज़र रखने के लिए एक अकाउंट बनाएं',
  'account-dashboard.section.empty': 'कोई {type} अकाउंट्स नहीं',
  'account-dashboard.section.empty-sub':
    'इसे यहां देखने के लिए एक अकाउंट बनाएं',
  'account-dashboard.button.create-first': 'अपना पहला अकाउंट बनाएं',
  'account-dashboard.action.create': 'नया अकाउंट बनाएं',
  'account-dashboard.action.settings': 'अकाउंट्स सेटिंग्स',
  'account-dashboard.weight-bar.aria': 'अकाउंट प्रकार AUM वितरण',
  'account-dashboard.weight-bar.segment-aria': '{name}: कुल AUM का {percent}%',
  'account-dashboard.guide.empty.intro.title':
    'यह पृष्ठ आपके सभी अकाउंट्स को एक स्थान पर रखता है',
  'account-dashboard.guide.empty.intro.description':
    'अपने सभी अकाउंट्स को एक साथ देखने के लिए अकाउंट्स का उपयोग करें। एक बार अकाउंट्स मौजूद हो जाने पर, यह पृष्ठ उनकी तुलना करने का सबसे तेज़ तरीका बन जाता है।',
  'account-dashboard.guide.empty.state.title':
    'यहां अभी तक कुछ भी नहीं है क्योंकि कोई अकाउंट मौजूद नहीं है',
  'account-dashboard.guide.empty.state.description':
    'डैशबोर्ड तब तक खाली रहता है जब तक आप अपना पहला अकाउंट नहीं बना लेते। उसके बाद, यह प्रत्येक अकाउंट पृष्ठ में अकाउंट योग, अनुभाग और शॉर्टकट दिखाएगा।',
  'account-dashboard.guide.empty.create.title': 'यहां अपना पहला अकाउंट बनाएं',
  'account-dashboard.guide.empty.create.description':
    'पहला अकाउंट बनाने के लिए इस बटन पर क्लिक करें जिसे आप Journalit ट्रैक करना चाहते हैं।',
  'account-dashboard.guide.empty.after-create.title':
    'आपके द्वारा सहेजने के बाद, Journalit अकाउंट पेज खोलता है',
  'account-dashboard.guide.empty.after-create.description':
    'मूल अकाउंट विवरण भरें और सहेजें। अगला गाइड उस विशिष्ट अकाउंट के लिए अकाउंट पेज पर आएगा।',
  'account-dashboard.guide.main.intro.title': 'ये आपके अकाउंट हैं',
  'account-dashboard.guide.main.intro.description':
    'अकाउंट्स की तुलना करने के लिए इस पृष्ठ का उपयोग करें, सभी अकाउंट्स का कुल योग देखें, और जब आपको अधिक विवरण की आवश्यकता हो तो एक अकाउंट पर जाएं।',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM का अर्थ है प्रबंधनाधीन संपत्ति',
  'account-dashboard.guide.main.aum-chart.description':
    'यह चार्ट समय के साथ आपके संयुक्त अकाउंट मूल्य को ट्रैक करता है, जिसमें आपके अकाउंट में जमा, निकासी, लाभ लक्ष्य और ड्रॉडाउन स्तर शामिल हैं।',
  'account-dashboard.guide.main.metrics.title':
    'ये मेट्रिक्स सभी दृश्यमान अकाउंट्स का सारांश प्रस्तुत करते हैं',
  'account-dashboard.guide.main.metrics.description':
    'विशिष्ट अकाउंट प्रकारों या विशिष्ट अकाउंट में ड्रिलिंग करने से पहले त्वरित अकाउंट-स्तरीय स्नैपशॉट के लिए इन आँकड़ों का उपयोग करें।',
  'account-dashboard.guide.main.mode-switch.title':
    'ओवरव्यू और चैलेंज एक ही खातों के दो दृश्य हैं',
  'account-dashboard.guide.main.mode-switch.description':
    'ओवरव्यू में AUM चार्ट और पोर्टफोलियो के कुल आँकड़े रहते हैं। प्रॉप-चैलेंज की अर्थव्यवस्था के लिए चैलेंज पर जाएँ: पास दर, लागत, भुगतान और हर चैलेंज खाते में चरण की अड़चनें।',
  'account-dashboard.guide.main.create-account.title':
    'आप किसी भी समय यहां से एक और अकाउंट बना सकते हैं',
  'account-dashboard.guide.main.create-account.description':
    'जब भी आप डैशबोर्ड में एक नया अकाउंट जोड़ना चाहें तो इस बटन का उपयोग करें।',
  'account-dashboard.guide.main.settings-types.title':
    'सेटिंग्स उपलब्ध अकाउंट प्रकारों को प्रबंधित कर सकता है',
  'account-dashboard.guide.main.settings-types.description':
    'सेटिंग्स के अंदर, आप कस्टम अकाउंट प्रकार जोड़ सकते हैं और यदि आपका वर्कफ़्लो बदलता है तो पुराने को हटा सकते हैं।',
  'account-dashboard.guide.main.settings-inclusion.title':
    'सेटिंग्स कुल में जो गिना जाता है उसे बदल सकता है',
  'account-dashboard.guide.main.settings-inclusion.description':
    'आप अकाउंट प्रकारों को डैशबोर्ड के कुल योग से बिना हटाए छिपा सकते हैं, और आप अलग से तय कर सकते हैं कि क्या उनकी निकासी अभी भी गिनी जाएगी।',
  'account-dashboard.guide.main.settings-order.title':
    'यह अनुभाग अकाउंट समूहों के क्रम को नियंत्रित करता है',
  'account-dashboard.guide.main.settings-order.description':
    'यह तय करने के लिए इन नियंत्रणों का उपयोग करें कि कौन सा अकाउंट प्रकार डैशबोर्ड पर सबसे पहले दिखाई देता है।',

  'account-dashboard.guide.main.open-account.title':
    'अधिक गहराई तक जाने के लिए कोई भी अकाउंट कार्ड खोलें',
  'account-dashboard.guide.main.open-account.description':
    'खाते प्रकार के अनुसार समूहित हैं ताकि आप समान खातों की तुलना कर सकें। पूरा विवरण देखने के लिए कोई भी कार्ड खोलें; वहाँ खाता पृष्ठ गाइड आगे बढ़ेगा।',
  'account-dashboard.metrics.total-accounts': 'कुल अकाउंट्स',
  'account-dashboard.metrics.total-aum': 'कुल AUM',
  'account-dashboard.metrics.total-growth': 'कुल विकास',
  'account-dashboard.metrics.growth-percent': 'विकास %',
  'account-dashboard.metrics.total-withdrawals': 'कुल निकासी',
  'account-dashboard.metrics.no-withdrawals': 'कोई निकासी नहीं',
  'account-dashboard.metrics.total-trades': 'कुल ट्रेड्स',
  'account-dashboard.type-header.excluded': 'छोड़ा गया',
  'account-dashboard.type-header.from-stats': 'आँकड़ों से',
  'account-dashboard.type-header.of-total-aum': 'कुल AUM का',
  'account-dashboard.type-header.aum': 'AUM',
  'account-dashboard.type-header.withdrawals': 'निकासी',
  'account-dashboard.type-header.account': 'अकाउंट',
  'account-dashboard.type-header.accounts': 'अकाउंट्स',
  'account-dashboard.type-header.trade': 'ट्रेड',
  'account-dashboard.type-header.trades': 'ट्रेड्स',
  'account-dashboard.type-header.growth': 'विकास ({percent})',
  'account-card.metric.trades': 'ट्रेड्स',
  'account-card.metric.withdrawals': 'निकासी',
  'account-card.metric.age': 'आयु',
  'account-card.progress.profit-target': 'लाभ लक्ष्य',
  'account-card.progress.drawdown-used': 'ड्रॉडाउन सीमा का उपयोग किया गया',
  'account-card.progress.not-set': 'सेट नहीं',
  'account-card.footer.monthly': 'मासिक:',
  'account-card.footer.total-costs': 'कुल लागत:',
  'account.chart.event.added': 'अकाउंट जोड़ा गया',
  'account.chart.event.archived': 'अकाउंट संग्रहीत',
  'account.balance-chart.drawdown-floor-off-scale':
    'ड्रॉडाउन सीमा {value} ({distance} नीचे)',
  'account.balance-chart.profit-target-off-scale':
    'लाभ लक्ष्य {value} ({distance} ऊपर)',
  'account.balance-chart.empty': 'कोई ट्रेड्स नहीं मिला',
  'account.balance-chart.empty-sub':
    'इस अकाउंट के लिए कोई ट्रेडिंग गतिविधि उपलब्ध नहीं है',
  'account.aum-chart.empty': 'कोई अकाउंट डेटा नहीं',
  'account.aum-chart.empty-sub': 'AUM इतिहास देखने के लिए अकाउंट्स जोड़ें',
  'chart.shared.empty': 'कोई ट्रेड्स उपलब्ध नहीं है',
  'chart.shared.empty-sub': 'एक भिन्न समयावधि चुनने का प्रयास करें',
  'account.link-modal.title': 'नई ट्रेडिंग अकाउंट का पता चला',
  'account.link-modal.account-id': 'अकाउंट आईडी:',
  'account.link-modal.broker': 'ब्रोकर:',
  'account.link-modal.first-seen': 'पहली बार देखा गया:',
  'account.link-modal.question': 'आप इस अकाउंट को कैसे संभालना चाहेंगे?',
  'account.link-modal.option.new': 'कस्टम नाम के साथ नया अकाउंट बनाएं',
  'account.link-modal.placeholder.custom-name': 'उदाहरण के लिए, एफटीएमओ चैलेंज',
  'account.link-modal.account-type': 'अकाउंट प्रकार:',
  'account.link-modal.option.existing': 'मौजूदा अकाउंट से लिंक करें',
  'account.link-modal.no-accounts-available': '(कोई अकाउंट्स उपलब्ध नहीं)',
  'account.link-modal.select-account': 'एक अकाउंट चुनें...',

  'account.link-modal.option.default':
    'डिफ़ॉल्ट नाम का उपयोग करें: अकाउंट-{id}',
  'account.link-modal.default-name': 'अकाउंट-{id}',
  'account.link-modal.button.linking': 'लिंक किया जा रहा है...',
  'account.link-modal.notice.select-existing': 'कृपया मौजूदा अकाउंट चुनें',
  'account.link-modal.notice.failed': 'अकाउंट: {error} को लिंक करने में विफल',
  'trade.review.title': 'ट्रेड रिव्यू',

  'trade.details.entry': 'एंट्री',
  'trade.details.exit': 'एग्जिट',

  'trade.details.duration': 'अवधि',

  'trade.details.thesis': 'थीसिस',

  'trade.details.entries-summary': '{count} प्रविष्टियाँ',
  'trade.details.exits-summary': '{count} एग्जिट्स',
  'trade.details.take-profit-count': '{count} लक्ष्य',

  'trade.metadata.account': 'अकाउंट:',

  'trade.metadata.setups': 'सेटअप्स',
  'trade.metadata.mistakes': 'गलतियाँ',
  'trade.image.no-images': 'इस ट्रेड के लिए कोई चित्र नहीं',
  'trade.image.click-edit': 'छवि जोड़ें',
  'trade.image.alt-prefix': 'ट्रेड छवि',

  'trade.review.reviewed': 'रिव्यू हो चुका',
  'trade.review.reviewed-on': '{date} पर रिव्यूड',

  'timeline.status.loss': 'लॉस',

  'timeline.aria.session-navigation': 'उसी दिन ट्रेड नेविगेशन',
  'timeline.aria.previous-trade': 'पिछला ट्रेड: {trade}',
  'timeline.aria.next-trade': 'अगला ट्रेड: {trade}',
  'timeline.aria.no-previous-trade':
    'इस कारोबारी दिन में कोई पिछला ट्रेड नहीं है',
  'timeline.aria.no-next-trade': 'इस कारोबारी दिन में कोई अगला ट्रेड नहीं',

  'drc.tab.review': 'रिव्यू',

  'drc.missed-trades.label.reason': 'कारण:',

  'missed-trade.reason-title': 'मैं इस ट्रेड से क्यों चूक गया',

  'settings.general.title': 'सामान्य सेटिंग्स',
  'settings.general.docs': 'डॉक्स',
  'settings.general.discord': 'Discord',
  'settings.general.github': 'GitHub',
  'settings.general.currency': 'मुद्रा',
  'settings.general.currency-desc':
    'पूरे प्लगइन में सभी मौद्रिक मूल्यों को प्रदर्शित करने के लिए मुद्रा चुनें',
  'settings.general.currency-aria':
    'मौद्रिक मूल्य प्रदर्शित करने के लिए मुद्रा का चयन करें',
  'settings.general.currency-changed':
    'मुद्रा बदलकर {currency} कर दी गई. सभी घटक तुरंत अपडेट हो जाएंगे!',
  'settings.general.currency-save-failed':
    'मुद्रा सेटिंग सहेजने में विफल. कृपया पुन: प्रयास करें।',
  'settings.general.path-change.title': 'जर्नल फ़ोल्डर का स्थान बदल गया',
  'settings.general.path-change.new-trades-title':
    'आपके नए फ़ोल्डर स्थान में नया ट्रेड्स बनाया जाएगा',
  'settings.general.path-change.new-trades-desc':
    'भविष्य की सभी ट्रेडिंग जर्नल इसका उपयोग करेंगी:',
  'settings.general.path-change.manual-title': 'मैन्युअल कार्रवाई आवश्यक:',
  'settings.general.path-change.manual-desc':
    'आपके वर्तमान फ़ोल्डर में ट्रेड्स मौजूद है। उन्हें स्थानांतरित करने के लिए:',
  'settings.general.path-change.step.open-explorer':
    'अपने वॉल्ट का फ़ाइल एक्सप्लोरर खोलें',
  'settings.general.path-change.step.find-folder-prefix': 'अपना ढूंदो',
  'settings.general.path-change.step.find-folder-suffix': 'फ़ोल्डर',
  'settings.general.path-change.step.drag-drop':
    'सुविधाजनक होने पर इसे अपने नए स्थान पर खींचें और छोड़ें',
  'settings.general.path-change.manual-note':
    'इससे आपको इस पर पूरा नियंत्रण मिलता है कि आपकी फ़ाइलें कब और कैसे स्थानांतरित की जाती हैं।',
  'settings.general.path-change.sync-title': 'सिंक मैपिंग अपडेट:',
  'settings.general.path-change.sync-desc':
    'नए फ़ोल्डर पथ को प्रतिबिंबित करने के लिए प्लगइन स्वचालित रूप से आपके ट्रेड सिंक मैपिंग को अपडेट कर देगा। यह सुनिश्चित करता है कि आपका सिंक किया गया ट्रेड्स उनके बैकएंड रिकॉर्ड से जुड़ा रहे।',
  'settings.general.path-change.button.cancel': 'रद्द करें',
  'settings.general.path-change.button.confirm': 'मैं समझता हूँ',
  'settings.general.display-name': 'प्रदर्शित होने वाला नाम',
  'settings.general.display-name-desc':
    'Journalit दृश्य स्वागत संदेश में प्रदर्शित करने के लिए वैकल्पिक नाम (उदाहरण के लिए, "गुड मॉर्निंग, एलेक्स")',
  'settings.general.display-name-placeholder': 'नया प्रदर्शन नाम जोड़ें...',
  'settings.general.display-name-aria': 'स्वागत संदेश के लिए प्रदर्शन नाम',
  'settings.general.display-name-confirm-aria':
    'प्रदर्शन नाम परिवर्तन की पुष्टि करें',
  'settings.general.display-name-cancel-aria':
    'प्रदर्शन नाम परिवर्तन रद्द करें',
  'settings.general.display-name-saved':
    'प्रदर्शन नाम "{name}" के रूप में सहेजा गया',
  'settings.general.display-name-cleared': 'प्रदर्शन नाम साफ़ किया गया',
  'settings.general.display-name-save-failed':
    'प्रदर्शन नाम सहेजने में विफल. कृपया पुन: प्रयास करें।',
  'settings.general.privacy-mode': 'गोपनीयता मोड',
  'settings.general.privacy-mode-desc':
    'सहेजे गए डेटा को बदले बिना यूआई में संवेदनशील ट्रेडिंग, टीएमटीओके0एक्स, कीमत और प्रदर्शन मूल्यों को छिपाएं।',
  'settings.general.privacy-mode-aria': 'गोपनीयता मोड टॉगल करें',
  'settings.general.home-view-settings': 'होम व्यू सेटिंग्स',
  'settings.general.home-auto-open': 'होम व्यू स्वतः-खुला',
  'settings.general.home-auto-open-desc':
    'चुनें कि होम व्यू को स्वचालित रूप से कब खोलना है',
  'settings.general.home-auto-open-always': 'हमेशा खुला + फोकस (डिफ़ॉल्ट)',
  'settings.general.home-auto-open-ifnone': 'केवल यदि कोई सक्रिय फ़ाइल नहीं है',
  'settings.general.home-auto-open-never': 'कभी नहीं (केवल मैनुअल)',
  'settings.general.home-auto-open-aria': 'होम स्टार्टअप व्यवहार का चयन करें',
  'settings.general.home-startup-changed':
    'Journalit स्टार्टअप व्यवहार बदल गया: {behavior}',
  'settings.general.filter-recent': 'फ़िल्टर Journalit फ़ाइलों में हाल के आइटम',
  'settings.general.filter-recent-desc':
    'हाल के आइटम विजेट (.journalit फ़ोल्डर के भीतर फ़ाइलें) में केवल Journalit-संबंधित फ़ाइलें दिखाएं। हाल की आइटम सूची से अन्य सभी वॉल्ट फ़ाइलें छुपाता है।',
  'settings.general.filter-recent-aria':
    'फ़िल्टर Journalit फ़ाइलों में हाल के आइटम',
  'settings.general.filter-recent-toggled':
    'फ़िल्टर Journalit फ़ाइलों के नवीनतम आइटम {status}',
  'settings.general.home-widget-opacity': 'विजेट की अपारदर्शिता',
  'settings.general.home-widget-opacity-desc':
    'छवि वाले विजेट की पृष्ठभूमि: 0% पारदर्शी है, 100% अपारदर्शी है। यह वर्तमान थीम पर लागू होता है; हल्की और गहरी थीम के मान अलग-अलग सहेजे जाते हैं।',
  'settings.general.home-widget-opacity-save-failed':
    'विजेट की अपारदर्शिता सहेजी नहीं जा सकी। कृपया फिर से प्रयास करें।',
  'settings.general.home-background': 'होम पृष्ठभूमि छवि',
  'settings.general.home-background-desc':
    'आपके होम विजेट्स के पीछे दिखाया गया है।',
  'settings.general.home-background-dashboard': 'डैशबोर्ड में पृष्ठभूमि दिखाएँ',
  'settings.general.home-background-dashboard-desc':
    'डैशबोर्ड मोड में उसी पृष्ठभूमि छवि का उपयोग करें।',
  'settings.general.home-background-dashboard-aria':
    'डैशबोर्ड में होम बैकग्राउंड दिखाएं',

  'settings.general.home-background-choose': 'छवि चुनें',
  'settings.general.home-background-clear': 'साफ़ करें',

  'settings.general.home-background-invalid-file':
    'एक समर्थित छवि फ़ाइल चुनें.',
  'settings.general.home-background-saved': 'होम पृष्ठभूमि छवि सहेजी गई.',
  'settings.general.home-background-cleared': 'होम पृष्ठभूमि छवि साफ़ की गई.',
  'settings.general.home-background-save-failed':
    'होम पृष्ठभूमि छवि सहेजने में विफल.',
  'settings.general.folder-section': 'फ़ोल्डर स्थान और छवि पथ',
  'settings.general.journal-folder': 'जर्नल फ़ोल्डर स्थान',
  'settings.general.journal-folder-desc':
    'चुनें कि आपके ट्रेडिंग जर्नल आपकी तिजोरी में कहाँ संग्रहीत हैं।',
  'settings.general.journal-folder-desc-2':
    'डिफ़ॉल्ट रूट फ़ोल्डर स्थान का उपयोग करने के लिए खाली छोड़ दें।',
  'settings.general.journal-folder-placeholder': 'कस्टम फ़ोल्डर चुनें...',
  'settings.general.journal-folder-default':
    'डिफ़ॉल्ट: रूट फ़ोल्डर (!Journalit)',
  'settings.general.update-image-paths': 'छवि पथ अद्यतन करें',
  'settings.general.update-image-paths-desc':
    'वर्तमान फ़ोल्डर स्थान से मिलान करने के लिए सभी ट्रेड्स में छवि पथ अपडेट करता है। अपने !Journalit फ़ोल्डर को मैन्युअल रूप से स्थानांतरित करने के बाद इसका उपयोग करें।',
  'settings.general.update-image-paths-updating': 'अद्यतन किया जा रहा है...',
  'settings.general.update-image-paths-match':
    'सभी छवि पथ पहले से ही वर्तमान फ़ोल्डर स्थान से मेल खाते हैं',
  'settings.general.folder-updated':
    'जर्नल फ़ोल्डर पथ अद्यतन किया गया. नया ट्रेड्स इसमें बनाया जाएगा: {path}',
  'settings.general.folder-update-failed': 'पथ अद्यतन करने में विफल: {error}',
  'settings.general.update-image-paths-success':
    '{count} ट्रेड्स में छवि पथ सफलतापूर्वक अद्यतन किया गया',
  'settings.general.update-image-paths-no-update':
    'किसी छवि पथ को अद्यतन करने की आवश्यकता नहीं है',
  'settings.general.update-image-paths-errors':
    '{failed} त्रुटियों के साथ अद्यतन {updated} ट्रेड्स। विवरण के लिए कंसोल जांचें.',
  'settings.general.update-image-paths-failed':
    'छवि पथ अद्यतन करने में विफल. विवरण के लिए कंसोल जांचें.',
  'settings.general.trade-settings': 'ट्रेड सेटिंग्स',
  'settings.general.auto-open-trades': 'ऑटो-ओपन निर्मित ट्रेड्स',
  'settings.general.auto-open-trades-desc':
    'ट्रेड नोट्स बनने के बाद उन्हें एक नए टैब में स्वचालित रूप से खोलें',
  'settings.general.auto-open-trades-aria': 'ऑटो-ओपन निर्मित ट्रेड्स',
  'settings.general.auto-open-toggled': 'ऑटो-ओपन निर्मित ट्रेड्स {status}',
  'settings.general.date-format': 'तारिख का प्रारूप',
  'settings.general.date-format-desc':
    'संपूर्ण प्लगइन में दिनांक प्रदर्शित करने का प्रारूप',
  'settings.general.date-format-aria':
    'ट्रेड नोट्स के लिए दिनांक प्रारूप चुनें',
  'settings.general.date-format-ddmmyy': 'DD/MM/YY (31/12/23)',
  'settings.general.date-format-mmddyy': 'एमएम/डीडी/वाईवाई (12/31/23)',
  'settings.general.date-format-yymmdd': 'वर्ष/माह/दिन (23/12/31)',
  'settings.general.date-format-changed':
    'ट्रेड नोट दिनांक प्रारूप {format} में बदल गया',
  'settings.general.use-24-hour-time': '24 घंटे के समय प्रारूप का उपयोग करें',
  'settings.general.use-24-hour-time-desc':
    'समय को 12-घंटे पूर्वाह्न/अपराह्न प्रारूप (2:30 अपराह्न) के बजाय 24-घंटे प्रारूप (14:30) में प्रदर्शित करें',
  'settings.general.use-24-hour-time-aria':
    '24-घंटे के समय प्रारूप का उपयोग करें',
  'settings.general.show-seconds': 'ट्रेड टाइम्स में सेकंड दिखाएं',
  'settings.general.show-seconds-desc':
    'ट्रेड एंट्री और एग्जिट बार दर्ज करते समय सेकंड प्रदर्शित करें।',
  'settings.general.show-seconds-aria': 'सेकंड को ट्रेड बार में दिखाएँ',
  'settings.general.skip-weekends': 'सप्ताहांत छोड़ें',
  'settings.general.skip-weekends-desc':
    'सक्षम होने पर, Journalit पूरे प्लगइन में सप्ताहांत को गैर-ट्रेडिंग दिनों के रूप में मानता है। यदि आप शनिवार और रविवार को ट्रेड या रिव्यू गतिविधि करते हैं तो इसे अक्षम करें।',
  'settings.general.skip-weekends-aria':
    'Journalit में सप्ताहांत बहिष्कृत करें',
  'settings.general.skip-weekends-toggled': 'सप्ताहांत बहिष्करण {status}',
  'settings.general.week-start': 'सप्ताह आरंभ दिवस',
  'settings.general.week-start-desc':
    'चुनें कि आपका ट्रेडिंग सप्ताह किस दिन शुरू होगा। साप्ताहिक रिव्यूज़ और रिपोर्ट को प्रभावित करता है।',
  'settings.general.week-start-aria': 'सप्ताह आरंभ दिन चुनें',
  'settings.general.week-start-changed':
    'सप्ताह प्रारंभ का दिन बदलकर {day} कर दिया गया',
  'settings.general.analytics-date-basis': 'विश्लेषिकी दिनांक आधार',
  'settings.general.analytics-date-basis-desc':
    'स्विंग व्यापारियों के लिए सर्वोत्तम. विश्लेषण के लिए एंट्री दिनांक या अंतिम एग्जिट दिनांक का उपयोग करता है। एग्जिट दिनांक मोड केवल बंद ट्रेड्स की गणना करता है और सीधे P&L ट्रेड्स के लिए एग्जिट दिनांक की आवश्यकता होती है।',
  'settings.general.analytics-date-basis-aria':
    'एनालिटिक्स दिनांक के आधार पर चयन करें',
  'settings.general.analytics-date-basis-entry': 'एंट्री दिनांक',
  'settings.general.analytics-date-basis-exit': 'एग्जिट दिनांक',
  'settings.general.analytics-date-basis-changed':
    'एनालिटिक्स दिनांक आधार {basis} में बदल गया',
  'settings.general.dollar-value-input':
    'डॉलर मूल्य के रूप में पोजीशन साइज़ दर्ज करें',
  'settings.general.dollar-value-input-desc':
    'सक्षम होने पर, मात्रा (शेयर/लॉट/अनुबंध) के बजाय डॉलर राशि (उदाहरण के लिए, $10,000) के रूप में पोजीशन साइज़ दर्ज करें। मात्रा की गणना कीमत से स्वचालित रूप से की जाएगी। स्टॉक के लिए सर्वोत्तम कार्य करता है; वायदा/विदेशी मुद्रा में अनुबंध गुणक होते हैं जिनका हिसाब नहीं दिया जाता है।',
  'settings.general.dollar-value-input-aria':
    'डॉलर मूल्य के रूप में पोजीशन साइज़ दर्ज करें',
  'settings.general.dollar-value-input-toggled': 'पोजीशन आकार इनपुट: {mode}',
  'settings.general.dollar-value': 'डॉलर का मूल्य',
  'settings.general.quantity': 'क्वांटिटी',
  'settings.general.mae-mfe-input-mode': 'MAE/MFE इनपुट मोड',
  'settings.general.mae-mfe-input-mode-desc':
    'ट्रेड फॉर्म में अधिकतम प्रतिकूल/अनुकूल भ्रमण मान दर्ज करने का तरीका चुनें।',
  'settings.general.mae-mfe-input-mode-desc-price':
    'मूल्य स्तर: ट्रेड के दौरान प्राप्त न्यूनतम/उच्चतम मूल्य दर्ज करें।',
  'settings.general.mae-mfe-input-mode-desc-dollar':
    'डॉलर मूल्य: मैक्स ड्रॉडाउन/लाभ सीधे डॉलर में दर्ज करें।',
  'settings.general.mae-mfe-input-mode-aria': 'MAE/MFE इनपुट मोड चुनें',
  'settings.general.mae-mfe-input-mode-price': 'मूल्य स्तर',
  'settings.general.mae-mfe-input-mode-dollar': 'डॉलर का मूल्य',
  'settings.general.mae-mfe-display-unit': 'MAE/MFE डिस्प्ले यूनिट',
  'settings.general.mae-mfe-display-unit-desc':
    'एनालिटिक्स और ट्रेड लॉग पर मुद्रा या वायदा टिकों में MAE/MFE प्रदर्शित करें। टिक मोड स्वचालित रूप से सहेजे गए ट्रेड डेटा को बदले बिना पात्र मौजूदा वायदा ट्रेड्स की पुनर्गणना करता है।',
  'settings.general.mae-mfe-display-unit-aria': 'MAE/MFE डिस्प्ले यूनिट चुनें',
  'settings.general.mae-mfe-display-dollar': 'मुद्रा',
  'settings.general.mae-mfe-display-ticks': 'टिक',
  'common.ticks': 'ticks',
  'dashboard.mae-mfe-ticks.partial-coverage':
    '{total} ट्रेड्स में से केवल {eligible} में फ्यूचर्स टिक डेटा है। यह मीट्रिक अयोग्य ट्रेड्स को बाहर करता है।',
  'settings.general.cutoff-time': 'ट्रेडिंग दिवस का कटऑफ समय',
  'settings.general.cutoff-time-desc':
    'वह समय जो किसी ट्रेडिंग दिन के अंत को परिभाषित करता है। इस समय के बाद ट्रेड्स को अगले दिन के साथ समूहीकृत किया जाएगा। (24 घंटे का प्रारूप, उदाहरण के लिए, 23:30 रात 11:30 बजे तक)',
  'settings.general.cutoff-time-aria': 'ट्रेडिंग दिवस का कटऑफ समय',
  'settings.general.cutoff-time-changed':
    'ट्रेडिंग दिवस का कटऑफ समय {time} में बदल गया',
  'settings.general.break-even-threshold-mode': 'ब्रेक-ईवन थ्रेशोल्ड प्रकार',
  'settings.general.break-even-threshold-mode-desc':
    'चुनें कि क्या ब्रेक-ईवन एक निश्चित P&L रेंज द्वारा निर्धारित किया जाता है या प्रत्येक ट्रेड अकाउंट के वर्तमान शेष के प्रतिशत से।',
  'settings.general.break-even-mode-fixed': 'निश्चित राशि सीमा',
  'settings.general.break-even-mode-percent':
    'वर्तमान अकाउंट बैलेंस का प्रतिशत',
  'settings.general.break-even-percent': 'सम-विच्छेद प्रतिशत',
  'settings.general.break-even-percent-desc':
    'शून्य के आसपास सममित सीमा (वर्तमान अकाउंट बैलेंस का ±X%)। समाधानयोग्य अकाउंट बैलेंस के बिना ट्रेड्स को जीत/नुकसान के आँकड़ों से बाहर रखा गया है।',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'वर्तमान अकाउंट बैलेंस का ब्रेक-ईवन प्रतिशत',
  'settings.general.break-even-range': 'ब्रेक ईवन रेंज',
  'settings.general.break-even-range-desc':
    'ट्रेड्स को ब्रेक ईवन मानने के लिए P&L रेंज को परिभाषित करें। उदाहरण के लिए, न्यूनतम: -20 और अधिकतम: 20 सेट करने पर -$20 और +$20 के बीच ट्रेड्स को ब्रेक ईवन माना जाएगा। सटीक $0.00 को ही ब्रेक ईवन मानने के लिए दोनों को 0 पर सेट करें। न्यूनतम अधिकतम से कम या उसके बराबर होना चाहिए.',
  'settings.general.break-even-min-placeholder': 'Min',
  'settings.general.break-even-max-placeholder': 'Max',
  'settings.general.break-even-min-aria': 'ब्रेक ईवन रेंज न्यूनतम',
  'settings.general.break-even-max-aria': 'अधिकतम सीमा तोड़ें',
  'settings.general.break-even-to': 'को',
  'settings.general.break-even-warning':
    'चेतावनी: न्यूनतम मूल्य अधिकतम मूल्य से अधिक है. यह ट्रेड्स को ब्रेकईवन के रूप में वर्गीकृत होने से रोकेगा।',
  'settings.general.break-even-updated':
    'सम-विषम श्रेणी अपडेट की गई - अगले लोड पर दृश्य ताज़ा हो जाएंगे',
  'settings.general.default-risk': 'डिफ़ॉल्ट जोखिम राशि',
  'settings.general.default-risk-desc':
    'आर-मल्टीपल गणनाओं के लिए उपयोग की जाने वाली डिफ़ॉल्ट जोखिम राशि (अकाउंट मुद्रा में)। मैन्युअल एंट्री प्रति ट्रेड की आवश्यकता के लिए खाली छोड़ दें।',
  'settings.general.default-risk-aria': 'डिफ़ॉल्ट जोखिम राशि',
  'settings.general.display-r-multiples': 'आर-गुणकों को प्रदर्शित करें',
  'settings.general.display-r-multiples-desc':
    'पूरे प्लगइन में मुद्रा राशियों के बजाय आर-एकाधिक मान (जोखिम-से-इनाम अनुपात) दिखाएं',
  'settings.general.display-r-multiples-aria':
    'ट्रेड दृश्यों में R-गुणकों को प्रदर्शित करें',
  'settings.general.display-r-multiples-toggled':
    'आर-गुणक {status} प्रदर्शित करते हैं',
  'settings.general.include-copy-accounts-analytics':
    'सभी-अकाउंट एनालिटिक्स में कॉपी अकाउंट्स शामिल करें',
  'settings.general.include-copy-accounts-analytics-desc':
    'सक्षम होने पर, सभी-अकाउंट ट्रेडिंग एनालिटिक्स में व्युत्पन्न कॉपी-अकाउंट परिणाम शामिल होते हैं और उन्हें अकाउंट-स्तर ट्रेड्स के रूप में गिना जाता है।',
  'settings.general.include-copy-accounts-analytics-aria':
    'सभी-अकाउंट एनालिटिक्स में कॉपी अकाउंट्स शामिल करें',
  'settings.general.include-copy-accounts-toggled':
    'सभी-अकाउंट एनालिटिक्स में कॉपी अकाउंट्स {status}',
  'settings.general.include-unrealized-pnl':
    'एनालिटिक्स में अनरियलाइज़्ड P&L शामिल करें',
  'settings.general.include-unrealized-pnl-desc':
    'सक्षम होने पर, नेट P&L कुल में प्राइस स्नैपशॉट वाले खुले पोजीशन का अनरियलाइज़्ड P&L शामिल होता है, जो रियलाइज़्ड नतीजों से अलग दिखता है। विन रेट और स्ट्रीक्स जैसे ट्रेड रिजल्ट आँकड़े केवल रियलाइज़्ड रहते हैं।',
  'settings.general.include-unrealized-pnl-aria':
    'एनालिटिक्स में अनरियलाइज़्ड P&L शामिल करें',
  'settings.general.include-unrealized-pnl-toggled':
    'एनालिटिक्स में अनरियलाइज़्ड P&L {status}',
  'settings.general.notification-settings': 'अधिसूचना सेटिंग्स',
  'settings.general.sync-notifications': 'सिंक सूचनाएं',
  'settings.general.sync-notifications-desc':
    'सिंक संचालन पूरा होने पर सूचनाएं दिखाएं',
  'settings.general.sync-notifications-aria': 'सिंक सूचनाएं सक्षम करें',
  'settings.general.sync-notifications-toggled': 'सिंक सूचनाएं {status}',
  'settings.general.new-trade-notifications': 'नई ट्रेड सूचनाएं',
  'settings.general.new-trade-notifications-desc':
    'नई ट्रेड फ़ाइलों का पता चलने पर सूचनाएं दिखाएं',
  'settings.general.new-trade-notifications-aria':
    'नई ट्रेड सूचनाएं सक्षम करें',
  'settings.general.new-trade-notifications-toggled':
    'नई ट्रेड सूचनाएं {status}',
  'settings.general.update-notifications': 'अद्यतन सूचनाएं दिखाएँ',
  'settings.general.update-notifications-desc':
    'नया प्लगइन अपडेट उपलब्ध होने पर एक अधिसूचना प्रदर्शित करें',
  'settings.general.update-notifications-aria': 'अद्यतन सूचनाएं दिखाएँ',
  'settings.general.update-notifications-toggled':
    'सूचनाएं अपडेट करें {status}',
  'settings.general.data-management': 'डेटा प्रबंधन और गोपनीयता',
  'settings.general.backup-restore-section': 'बैकअप, पुनर्सेटअप और रीसेट',
  'settings.general.export-settings': 'एक्सपोर्ट सेटिंग्स',
  'settings.general.export-settings-desc':
    'बैकअप या किसी अन्य वॉल्ट में स्थानांतरण के लिए सभी प्लगइन सेटिंग्स को JSON फ़ाइल के रूप में डाउनलोड करें',
  'settings.general.export-settings-exporting': 'एक्सपोर्ट किया जा रहा है...',
  'settings.general.import-settings': 'इंपोर्ट सेटिंग्स',
  'settings.general.import-settings-desc':
    'पिछली एक्सपोर्ट किया गया JSON फ़ाइल से सेटिंग्स को पुनर्स्थापित करें। सेटिंग्स को वर्तमान मूल्यों के साथ विलय कर दिया जाएगा।',
  'settings.general.import-settings-importing': 'इंपोर्ट करते हुए...',
  'settings.general.reset-to-defaults': 'डिफ़ॉल्ट पर रीसेट',
  'settings.general.reset-to-defaults-desc':
    'सभी प्लगइन सेटिंग्स को उनके डिफ़ॉल्ट मानों पर रीसेट करें। एक बैकअप स्वचालित रूप से बनाया जाएगा.',
  'settings.general.reset-to-defaults-warning':
    'चेतावनी: यह सभी कस्टम विकल्प, अकाउंट सेटिंग्स और लेआउट हटा देगा।',
  'settings.general.reset-to-defaults-resetting': 'रीसेट किया जा रहा है...',
  'settings.general.enabled': 'सक्षम',
  'settings.general.disabled': 'अक्षम',
  'settings.customization.title': '.Customization',
  'settings.customization.description':
    'Journalit प्लगइन के विकल्प, स्वरूप और व्यवहार को अनुकूलित करें।',
  'settings.customization.trade-form-layout.description':
    'चुनें कि कौन से फ़ील्ड और अनुभाग ट्रेड फॉर्म में दिखाई देंगे।',
  'settings.customization.trade-form-layout.button': 'लेआउट अनुकूलित करें',
  'settings.customization.tickers-symbols': 'सिंबल्स/प्रतीक',
  'settings.customization.symbol-mappings': 'प्रतीक मानचित्रण',

  'settings.customization.setups': 'सेटअप्स',
  'settings.customization.mistakes': 'गलतियाँ',
  'settings.customization.tags': 'टैग्स',
  'settings.customization.events': 'घटनाएँ',

  'settings.customization.options.confirm.update-notes':
    'ठीक है (नोट अपडेट करें)',
  'settings.customization.options.confirm.save-name': 'केवल नाम सहेजें',
  'settings.customization.options.confirm.cancel': 'कार्रवाई रद्द करें',
  'settings.customization.options.type.tickers': 'सिंबल्स',
  'settings.customization.options.type.accounts': 'अकाउंट्स',
  'settings.customization.options.type.account-types': 'अकाउंट प्रकार',
  'settings.customization.options.type.setups': 'सेटअप्स',
  'settings.customization.options.type.mistakes': 'गलतियाँ',
  'settings.customization.options.type.tags': 'टैग्स',
  'settings.customization.options.type.events': 'घटनाएँ',
  'settings.customization.options.asset-type.cfd': 'CFD',
  'settings.customization.options.notice.empty-name':
    'विकल्प का नाम खाली नहीं हो सकता',
  'settings.customization.options.notice.invalid-ticker':
    'अमान्य सिंबल प्रारूप. केवल अक्षरों, संख्याओं और अवधियों की अनुमति है।',
  'settings.customization.options.notice.added':
    '{type} में "{newValue}" विकल्प जोड़ा गया',
  'settings.customization.options.notice.duplicate':
    'डुप्लिकेट विकल्प: {newValue} पहले से मौजूद है',
  'settings.customization.options.notice.asset-type-required':
    'इंस्ट्रूमेंट्स के लिए एसेट टाइप आवश्यक है',
  'settings.customization.options.notice.updated-with-notes':
    'विकल्प को "{oldValue}" से "{newValue}" में अपडेट किया गया और {count} नोट्स को अपडेट किया गया',
  'settings.customization.options.notice.updated':
    'विकल्प को "{oldValue}" से "{newValue}" में अपडेट किया गया',
  'settings.customization.options.confirm.rename-message':
    'क्या आप उन सभी मौजूदा नोटों को अपडेट करना चाहते हैं जो "{oldValue}" का उपयोग करके इसके बजाय "{newValue}" का उपयोग करते हैं? यह सभी नोट्स को खोजेगा और जहां भी विकल्प मान मिलेगा उसे अपडेट कर देगा।',
  'settings.customization.options.notice.cannot-delete-archived':
    '"संग्रहीत" अकाउंट प्रकार को हटाया नहीं जा सकता - यह अकाउंट्स को संग्रहीत करने के लिए आरक्षित है',
  'settings.customization.options.confirm.remove-message':
    'क्या आप वाकई "{option}" को हटाना चाहते हैं? इसे असंपादित नहीं किया जा सकता है।',
  'settings.customization.options.confirm.remove-tag-message':
    'वैश्विक टैग "{option}" हटाएं? यह इसे प्रत्येक Journalit ट्रेड और सेटअप नोट से हटा देता है।',
  'settings.customization.options.notice.removed':
    'हटाया गया विकल्प "{option}"',
  'settings.customization.options.notice.remove-failed':
    'विकल्प हटाना विफल रहा',
  'settings.customization.options.confirm.reset-message':
    'क्या आप वाकई सभी {type} को डिफ़ॉल्ट विकल्पों पर रीसेट करना चाहते हैं? इसे असंपादित नहीं किया जा सकता है।',
  'settings.customization.options.confirm.reset-tag-message':
    'वैश्विक टैग सूची और रंगों को उनके डिफ़ॉल्ट पर रीसेट करें? ट्रेड और सेटअप नोटों को पहले से ही निर्दिष्ट टैग उन नोटों में रहेंगे।',
  'settings.customization.options.notice.reset-success':
    '{type} को डिफ़ॉल्ट विकल्पों पर रीसेट करें',
  'settings.customization.options.notice.no-options-to-reset':
    'डिफ़ॉल्ट {type} विकल्प पहले से ही उपयोग में हैं',
  'settings.customization.options.notice.mapping-symbols-required':
    'दोनों प्रतीक आवश्यक हैं',
  'settings.customization.options.notice.mapping-added':
    'मैपिंग जोड़ी गई: {imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    'मैपिंग जोड़ने में विफल',
  'settings.customization.options.notice.mapping-deleted':
    'मैपिंग हटाई गई: {symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    'मैपिंग हटाने में विफल',
  'settings.customization.options.empty-state':
    'अभी तक कोई कस्टम {type} नहीं जोड़ा गया है।',
  'settings.customization.options.label.save-changes': 'परिवर्तनों को सहेजें',
  'settings.customization.options.label.cancel-editing': 'संपादन रद्द करें',
  'settings.customization.options.label.edit-option': '{option} संपादित करें',
  'settings.customization.options.label.remove-option': '{option} हटाएं',
  'settings.customization.options.placeholder.select-asset':
    'संपत्ति का प्रकार चुनें...',
  'settings.customization.options.field.pip-size': 'पिप का आकार',
  'settings.customization.options.field.priority': 'प्राथमिकता:',
  'settings.customization.options.field.default-event-notes':
    'डिफ़ॉल्ट ईवेंट नोट्स:',
  'settings.customization.options.placeholder.default-event-notes':
    'इस ईवेंट का चयन होने पर नोट्स स्वत: भर जाएंगे',
  'settings.customization.options.aria.confirm-add':
    '{type} जोड़ने की पुष्टि करें',
  'settings.customization.options.label.locked': 'बंद',
  'settings.customization.options.label.archived-reserved':
    'संग्रहीत (आरक्षित)',
  'settings.customization.options.aria.reset-all': 'सभी कस्टम {type} हटाएं',
  'settings.customization.options.button.reset-all': 'सभी {type} रीसेट करें',
  'settings.customization.options.placeholder.new-name': 'नया {type} नाम',
  'settings.customization.options.placeholder.dollar-per-point': '$/बिंदु',
  'settings.customization.options.placeholder.tick-size': 'टिक आकार',
  'settings.customization.options.placeholder.tick-value': 'मान पर टिक करें',
  'settings.customization.options.placeholder.lot-size': 'बड़ा आकार',
  'settings.customization.options.placeholder.pip-value': 'पिप मूल्य',
  'settings.customization.options.placeholder.pip-size': 'पिप का आकार',
  'settings.customization.options.field.optional': '(वैकल्पिक)',
  'settings.customization.options.mapping.description':
    'स्वचालित विशिष्ट लुकअप के लिए अनुबंध-विशिष्ट प्रतीकों (उदाहरण के लिए, NQZ5) को आधार प्रतीकों (उदाहरण के लिए, NQ) में मैप करें',
  'settings.customization.options.mapping.auto-detected': 'स्वत: पता लगाए',
  'settings.customization.options.mapping.manual': 'नियमावली',
  'settings.customization.options.mapping.created-at': '{date} बनाया गया',
  'settings.customization.options.mapping.no-mappings':
    'अभी तक कोई प्रतीक मानचित्रण नहीं. जब अनुबंध प्रतीकों का पता लगाया जाता है तो CSV इंपोर्ट के दौरान मैपिंग स्वचालित रूप से बनाई जाती है।',
  'settings.customization.options.mapping.placeholder-imported':
    'इंपोर्ट किया गया प्रतीक (जैसे, NQZ5)',
  'settings.customization.options.mapping.placeholder-base':
    'आधार चिह्न (जैसे, NQ)',
  'settings.customization.options.mapping.button-add': 'मैपिंग जोड़ें',
  'settings.customization.options.placeholder.add-new': 'नया {type} जोड़ें',
  'settings.customization.options.aria.delete-mapping': 'मैपिंग हटाएँ',
  'settings.customization.options.instrument.specs-futures':
    '${dollar}/pt, {tick} टिक, ${value} टिक वैल',
  'settings.customization.options.instrument.specs-forex':
    '{lot} लॉट, ${pip} पिप वैल, {size} पिप आकार',
  'settings.customization.options.instrument.built-in': '(अंतर्निहित)',
  'settings.customization.options.instrument.mapped-to':
    '{base} पर मैप किया गया ({base} की विशिष्टताओं का उपयोग करता है)',
  'settings.customization.options.instrument.no-specs':
    '(कोई विशिष्टता सेट नहीं)',
  'settings.customization.options.commission.costs': 'लागत',
  'settings.customization.options.commission.add-rule': '+ लागत नियम जोड़ें',
  'settings.customization.options.commission.applies-to': 'पर लागू होता है',
  'settings.customization.options.commission.method': 'तरीका',
  'settings.customization.options.commission.entry': 'एंट्री',
  'settings.customization.options.commission.exit': 'एग्जिट',
  'settings.customization.options.commission.round-trip': 'राउंड ट्रिप',
  'settings.customization.options.commission.actions': 'कार्रवाई',
  'settings.customization.options.commission.all-accounts': 'सभी अकाउंट्स',
  'settings.customization.options.commission.per-side': 'प्रति पक्ष',
  'settings.customization.options.commission.remove-rule': 'लागत नियम हटाएँ',

  'button.remove': 'हटाएँ',

  'button.move-up': 'ऊपर ले जाएँ',
  'button.move-down': 'नीचे ले जाएँ',

  'settings.customization.trade-fields': 'कस्टम ट्रेड फ़ील्ड',
  'settings.customization.custom-fields.description':
    'हर ट्रेड में अपने फ़ील्ड जोड़ें, जैसे सेशन, टाइमफ़्रेम या सेटअप ग्रेड। ये ट्रेड फ़ॉर्म के उन्नत टैब में दिखते हैं, ट्रेड नोट के फ्रंटमैटर में सेव होते हैं, और ट्रेड लॉग में क्रमबद्ध व फ़िल्टर किए जा सकने वाले कॉलम बन सकते हैं।',
  'settings.customization.custom-fields.title': 'कस्टम फ़ील्ड ({count})',
  'settings.customization.custom-fields.manage-desc':
    'अपने कस्टम ट्रेड फॉर्म फ़ील्ड प्रबंधित करें',
  'settings.customization.custom-fields.type-dropdown': 'ड्रॉप डाउन',
  'settings.customization.custom-fields.type-multiselect': 'बहु-चयन',
  'settings.customization.custom-fields.type-suffix': 'मैदान',
  'settings.customization.custom-fields.option-count.one': '{count} विकल्प',
  'settings.customization.custom-fields.option-count.few': '{count} विकल्प',
  'settings.customization.custom-fields.option-count.many': '{count} विकल्प',
  'settings.customization.custom-fields.option-count.other': '{count} विकल्प',
  'settings.customization.custom-fields.no-fields':
    'अभी तक कोई कस्टम फ़ील्ड परिभाषित नहीं है',
  'settings.customization.custom-fields.no-fields-desc':
    'ऐसे एक फ़ील्ड से शुरू करें जिसकी आप बाद में सच में समीक्षा करेंगे, जैसे आपने किस सेशन में ट्रेड किया या सेटअप आपकी योजना से कितना मेल खाता था।',
  'settings.customization.custom-fields.add-new': 'नया फ़ील्ड जोड़ें',

  'settings.customization.custom-fields.edit-field-with-name':
    '“{fieldLabel}” संपादित करें',
  'settings.customization.custom-fields.configure-desc':
    'नीचे अपना कस्टम फ़ील्ड सेटिंग्स कॉन्फ़िगर करें',
  'settings.customization.custom-fields.actions': 'कार्रवाई',
  'settings.customization.custom-fields.actions-desc':
    'अपने कस्टम फ़ील्ड प्रबंधित करें',
  'settings.customization.custom-fields.add-button': 'कस्टम फ़ील्ड जोड़ें',
  'settings.customization.custom-fields.delete-all-button': 'सभी फ़ील्ड हटाएँ',
  'settings.customization.custom-fields.editor.title': 'फ़ील्ड कॉन्फ़िगरेशन',
  'settings.customization.custom-fields.editor.label': 'फील्ड लेबल',
  'settings.customization.custom-fields.editor.label-desc':
    'इस फ़ील्ड के लिए प्रदर्शन नाम',
  'settings.customization.custom-fields.editor.label-placeholder':
    'फ़ील्ड लेबल दर्ज करें',
  'settings.customization.custom-fields.editor.key': 'फ्रंटमैटर कुंजी',
  'settings.customization.custom-fields.editor.key-desc':
    'यह कुंजी आपकी ट्रेड फ़ाइलों में दिखाई देगी:',
  'settings.customization.custom-fields.editor.key-placeholder': 'फ़ील्ड_नाम',
  'settings.customization.custom-fields.editor.key-reserved':
    '⚠️ आरक्षित फ़ील्ड का नाम',
  'settings.customization.custom-fields.editor.type': 'क्षेत्र प्रकार',
  'settings.customization.custom-fields.editor.type-desc':
    'इनपुट फ़ील्ड का प्रकार',
  'settings.customization.custom-fields.editor.placeholder':
    'प्लेसहोल्डर टेक्स्ट',
  'settings.customization.custom-fields.editor.placeholder-desc':
    'खाली फ़ील्ड में वैकल्पिक प्लेसहोल्डर टेक्स्ट दिखाया गया है',
  'settings.customization.custom-fields.editor.placeholder-input':
    'प्लेसहोल्डर टेक्स्ट दर्ज करें',
  'settings.customization.custom-fields.editor.trade-log': 'ट्रेड लॉग',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'नियंत्रित करें कि ट्रेड लॉग कॉलम के रूप में जोड़े जाने पर यह फ़ील्ड कैसा दिखाई देगा',
  'settings.customization.custom-fields.editor.column-label':
    'ट्रेड लॉग कॉलम लेबल',
  'settings.customization.custom-fields.editor.column-label-desc':
    'वैकल्पिक छोटा लेबल केवल ट्रेड लॉग हेडर में उपयोग किया जाता है',
  'settings.customization.custom-fields.editor.column-label-placeholder':
    'डिफ़ॉल्ट रूप से फ़ील्ड लेबल का उपयोग करें',
  'settings.customization.custom-fields.editor.display-as-currency':
    'मुद्रा के रूप में प्रदर्शित करें',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'इस संख्या फ़ील्ड को केवल ट्रेड लॉग में मुद्रा मान के रूप में प्रारूपित करें',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'ड्रॉपडाउन सॉर्ट मोड',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'डिफ़ॉल्ट रूप से अक्षम. सॉर्टिंग तभी सक्षम करें जब इस ड्रॉपडाउन का कोई सार्थक क्रम हो।',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled': 'अक्षम',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'वर्णमाला',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'संख्यात्मक',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'विन्यस्त विकल्प क्रम',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'संक्षिप्त प्रदर्शन',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'चुनें कि ट्रेड लॉग विस्तारित मोड बंद होने पर बहुचयनित मान कैसे प्रस्तुत होते हैं',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'बैज गिनती',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'मूल्य सूची',
  'settings.customization.custom-fields.editor.validation': 'मान्यकरण',
  'settings.customization.custom-fields.editor.validation-desc':
    'फ़ील्ड सत्यापन नियम',
  'settings.customization.custom-fields.editor.validation.required':
    'आवश्यक क्षेत्र',
  'settings.customization.custom-fields.editor.validation.required-desc':
    'इस फ़ील्ड को अनिवार्य बनाएं',
  'settings.customization.custom-fields.editor.validation.min-length':
    'न्यूनतम लंबाई',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    'वर्णों की न्यूनतम संख्या',
  'settings.customization.custom-fields.editor.validation.no-min':
    'कोई न्यूनतम नहीं',
  'settings.customization.custom-fields.editor.validation.max-length':
    'ज्यादा से ज्यादा लंबाई',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    'वर्णों की अधिकतम संख्या',
  'settings.customization.custom-fields.editor.validation.no-max':
    'कोई अधिकतम नहीं',
  'settings.customization.custom-fields.editor.validation.min-value':
    'न्यूनतम मूल्य',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    'न्यूनतम अनुमत संख्या',
  'settings.customization.custom-fields.editor.validation.max-value':
    'अधिकतम मूल्य',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    'अधिकतम अनुमत संख्या',
  'settings.customization.custom-fields.editor.options': 'ऑप्शंस',
  'settings.customization.custom-fields.editor.options-desc':
    'इस क्षेत्र के लिए उपलब्ध विकल्प',
  'settings.customization.custom-fields.editor.add-option': 'नया विकल्प जोड़ें',
  'settings.customization.custom-fields.editor.add-option-desc':
    'एक नया विकल्प दर्ज करें',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    'नया विकल्प दर्ज करें',
  'settings.customization.custom-fields.editor.allow-create':
    'नए विकल्प बनाने की अनुमति दें',
  'settings.customization.custom-fields.editor.allow-create-desc':
    'ट्रेड फॉर्म में इस फ़ील्ड का उपयोग करते समय उपयोगकर्ता नए विकल्प बना सकते हैं',
  'settings.customization.custom-fields.editor.save': 'फ़ील्ड सहेजें',
  'settings.customization.custom-fields.editor.delete': 'फ़ील्ड हटाएँ',
  'settings.customization.custom-fields.type.text': 'मूलपाठ',
  'settings.customization.custom-fields.type.number': 'संख्या',
  'settings.customization.custom-fields.type.date': 'तारीख',
  'settings.customization.custom-fields.type.datetime': 'दिनांक समय',
  'settings.customization.custom-fields.type.time': 'समय',
  'settings.customization.custom-fields.error.cannot-save':
    'फ़ील्ड सहेजा नहीं जा सकता: {error}',
  'settings.customization.custom-fields.error.duplicate-key':
    'इस frontmatter कुंजी वाला एक फ़ील्ड पहले से मौजूद है',
  'settings.customization.custom-fields.error.save-failed':
    'फ़ील्ड सहेजने में विफल. कृपया पुन: प्रयास करें।',
  'settings.customization.custom-fields.notice.import-summary':
    'कुल {totalCount} में से इंपोर्ट किया गया {validCount} वैध फ़ील्ड',
  'settings.customization.custom-fields.delete.confirm-message':
    'क्या आप वाकई कस्टम फ़ील्ड "{fieldLabel}" को हटाना चाहते हैं?',
  'settings.customization.custom-fields.delete.cannot-undo':
    'इस एक्शन को वापस नहीं किया जा सकता।',
  'settings.customization.custom-fields.reset.confirm-message':
    'क्या आप वाकई सभी कस्टम फ़ील्ड हटाना चाहते हैं?',
  'settings.customization.custom-fields.saved-options.title':
    'सहेजे गए कस्टम विकल्प',
  'settings.customization.custom-fields.saved-options.description':
    'उपयोगकर्ताओं द्वारा कस्टम फ़ील्ड के लिए बनाए गए विकल्पों को प्रबंधित करें',
  'settings.customization.custom-fields.saved-options.delete-error':
    'विकल्प हटाने में विफल. कृपया पुन: प्रयास करें।',
  'settings.customization.custom-fields.saved-options.clear-error':
    'विकल्प साफ़ करने में विफल. कृपया पुन: प्रयास करें।',
  'settings.customization.custom-fields.option.delete-confirm':
    'क्या आप वाकई "{optionName}" विकल्प को हटाना चाहते हैं?',
  'settings.customization.custom-fields.option.clear-confirm':
    'क्या आप वाकई "{fieldLabel}" के लिए सभी सहेजे गए विकल्प हटाना चाहते हैं?',
  'settings.customization.review-fields': 'कस्टम रिव्यू फ़ील्ड',
  'settings.customization.review-fields.description':
    'रिव्यू नोट्स के लिए कस्टम फ़ील्ड बनाएं। इन फ़ील्ड्स को reviewCustomFields के अंतर्गत संग्रहीत किया जाता है और बाद में इन्हें मासिक, साप्ताहिक और दैनिक रिव्यूज़ में इनहेरिट किया जा सकता है।',
  'settings.customization.review-fields.title': 'रिव्यू फ़ील्ड्स ({count})',
  'settings.customization.review-fields.manage-desc':
    'रिव्यू नोट्स के लिए कस्टम फ़ील्ड प्रबंधित करें',
  'settings.customization.review-fields.no-fields':
    'अभी तक कोई कस्टम रिव्यू फ़ील्ड परिभाषित नहीं है',
  'settings.customization.review-fields.no-fields-desc':
    'रिव्यू फ़ील्ड का उपयोग रिव्यू-नोट विजेट द्वारा किया जाएगा और ट्रेड फॉर्म या ट्रेड लॉग में दिखाई नहीं देगा।',
  'settings.customization.review-fields.add-button': 'रिव्यू फ़ील्ड जोड़ें',
  'settings.customization.review-fields.delete-all-button':
    'सभी रिव्यू फ़ील्ड हटाएँ',
  'settings.customization.review-fields.add-new': 'नया रिव्यू फ़ील्ड जोड़ें',
  'settings.customization.review-fields.edit-field-with-name':
    '“{fieldLabel}” संपादित करें',
  'settings.customization.review-fields.configure-desc':
    'नीचे अपना रिव्यू फ़ील्ड सेटिंग्स कॉन्फ़िगर करें',
  'settings.customization.review-fields.actions-desc':
    'अपने कस्टम रिव्यू फ़ील्ड प्रबंधित करें',
  'settings.customization.review-fields.default-label': 'नया रिव्यू फ़ील्ड',
  'settings.customization.review-fields.unknown-field': 'अज्ञात रिव्यू फ़ील्ड',
  'settings.customization.review-fields.field-summary':
    'प्रकार: {type} • रिव्यूज़: {reviews}',
  'settings.customization.review-fields.error.save-failed':
    'रिव्यू फ़ील्ड सहेजने में विफल. कृपया पुन: प्रयास करें।',
  'settings.customization.review-fields.delete.confirm-message':
    'क्या आप वाकई कस्टम रिव्यू फ़ील्ड "{fieldLabel}" को हटाना चाहते हैं?',
  'settings.customization.review-fields.reset.confirm-message':
    'क्या आप वाकई सभी कस्टम रिव्यू फ़ील्ड हटाना चाहते हैं?',
  'settings.customization.review-fields.editor.title':
    'रिव्यू फ़ील्ड कॉन्फ़िगरेशन',
  'settings.customization.review-fields.editor.label-desc':
    'इस रिव्यू फ़ील्ड के लिए प्रदर्शन नाम',
  'settings.customization.review-fields.editor.label-placeholder':
    'रिव्यू फ़ील्ड लेबल दर्ज करें',
  'settings.customization.review-fields.editor.key': 'रिव्यू फ़ील्ड कुंजी',
  'settings.customization.review-fields.editor.key-desc':
    'यह कुंजी रिव्यू नोट frontmatter के अंदर संग्रहीत की जाएगी',
  'settings.customization.review-fields.editor.type-desc':
    'रिव्यू फ़ील्ड इनपुट का प्रकार',
  'settings.customization.review-fields.editor.description': 'विवरण',
  'settings.customization.review-fields.editor.description-desc':
    'इस रिव्यू फ़ील्ड के लिए वैकल्पिक सहायता पाठ',
  'settings.customization.review-fields.editor.description-placeholder':
    'बताएं कि इस क्षेत्र का उपयोग कैसे किया जाना चाहिए',
  'settings.customization.review-fields.editor.placeholder-desc':
    'स्थानीय रिव्यू मान दर्ज करते समय वैकल्पिक प्लेसहोल्डर टेक्स्ट दिखाया जाता है',
  'settings.customization.review-fields.editor.placeholder-input':
    'रिव्यू फ़ील्ड प्लेसहोल्डर दर्ज करें',

  'settings.customization.review-fields.editor.group': 'फ़ील्ड समूह',
  'settings.customization.review-fields.editor.group-desc':
    'वह रिव्यू फ़ील्ड समूह चुनें जिससे यह फ़ील्ड संबंधित है।',
  'settings.customization.review-fields.groups.add-button': 'समूह जोड़ें',
  'settings.customization.review-fields.groups.default-name': 'नया समूह',
  'settings.customization.review-fields.groups.untitled': 'शीर्षकहीन समूह',
  'settings.customization.review-fields.groups.ungrouped': 'असमूहीकृत',
  'settings.customization.review-fields.groups.field-count': '{count} फ़ील्ड',
  'settings.customization.review-fields.groups.empty':
    'इस समूह में अभी तक कोई फ़ील्ड नहीं है.',
  'settings.customization.review-fields.groups.rename-prompt': 'समूह नाम',
  'settings.customization.review-fields.groups.delete-message':
    'रिव्यू फ़ील्ड समूह "{groupName}" हटाएँ?',
  'settings.customization.review-fields.groups.delete-note':
    'इस समूह के फ़ील्ड असमूहीकृत हो जाएंगे. उनके सहेजे गए रिव्यू मान हटाए नहीं गए हैं।',
  'settings.customization.review-fields.groups.error.duplicate':
    'इस नाम वाला एक रिव्यू फ़ील्ड समूह पहले से मौजूद है।',
  'settings.customization.review-fields.groups.error.save-failed':
    'रिव्यू फ़ील्ड समूह सहेजने में विफल.',
  'settings.customization.review-fields.editor.compact': 'कॉम्पैक्ट डिस्प्ले',
  'settings.customization.review-fields.editor.compact-desc':
    'जब यह फ़ील्ड रिव्यू विजेट्स में दिखाई दे तो कॉम्पैक्ट रेंडरिंग को प्राथमिकता दें',
  'settings.customization.review-fields.editor.appears-on': 'इस पर दिखता है',
  'settings.customization.review-fields.editor.appears-on-desc':
    'रिव्यू नोट प्रकार जो इस फ़ील्ड को दिखा सकते हैं',
  'settings.customization.review-fields.editor.editable-on':
    'इस पर संपादन योग्य',
  'settings.customization.review-fields.editor.editable-on-desc':
    'रिव्यू नोट प्रकार जहां उपयोगकर्ता स्थानीय मान दर्ज कर सकते हैं',
  'settings.customization.review-fields.editor.inherit-to': 'इसमें इनहेरिट',
  'settings.customization.review-fields.editor.inherit-to-desc':
    'निचले रिव्यू नोट प्रकार जो इस फ़ील्ड से विरासत में मिले मान प्रदर्शित कर सकते हैं',
  'settings.customization.review-fields.editor.inheritance':
    'इनहेरिटेंस सक्षम करें',
  'settings.customization.review-fields.editor.inheritance-desc':
    'इस फ़ील्ड को उच्च-समय सीमा रिव्यू नोट्स से पढ़ने की अनुमति दें',
  'settings.customization.review-fields.editor.inheritance-mode':
    'इनहेरिटेंस मोड',
  'settings.customization.review-fields.editor.inheritance-mode-desc':
    'नियंत्रित करता है कि चाइल्ड रिव्यूज़ इनहेरिट किए गए मान, स्थानीय मान या दोनों दिखाते हैं या नहीं',
  'settings.customization.review-fields.editor.sources': 'इनहेरिटेंस स्रोत',
  'settings.customization.review-fields.editor.sources-desc':
    'उच्च-समय-सीमा रिव्यू प्रकार इस फ़ील्ड को विरासत में मिल सकते हैं',

  'settings.customization.review-fields.editor.options-desc':
    'इस रिव्यू फ़ील्ड के लिए उपलब्ध विकल्प',
  'settings.customization.review-fields.editor.allow-create-desc':
    'रिव्यू नोट्स में इस फ़ील्ड का उपयोग करते समय उपयोगकर्ता नए विकल्प बना सकते हैं',
  'settings.customization.review-fields.editor.save': 'रिव्यू फ़ील्ड सहेजें',
  'settings.customization.review-fields.editor.delete': 'रिव्यू फ़ील्ड हटाएँ',
  'settings.customization.review-fields.inheritance-mode.inherit-only':
    'केवल विरासत में मिला है',
  'settings.customization.review-fields.inheritance-mode.local-only':
    'केवल स्थानीय',
  'settings.customization.review-fields.inheritance-mode.inherit-and-local':
    'विरासत में मिला हुआ और स्थानीय',
  'onboarding.welcome.title': 'Journalit में आपका स्वागत है',
  'onboarding.welcome.subtitle': 'एक ट्रेडिंग जर्नल जो आपके डिवाइस पर रहता है।',
  'onboarding.welcome.cta': 'मेरा जर्नल सेट करें',
  'onboarding.welcome.chart.week': 'सप्ताह {count}',
  'onboarding.view.title': 'Journalit ऑनबोर्डिंग',

  'onboarding.common.continue': 'जारी रखना',
  'onboarding.common.close': 'बंद करें',

  'onboarding.features.badge.pro': 'प्रो',

  'onboarding.features.graphic.syncing': 'ट्रेड्स सिंक हो रहा है...',
  'onboarding.features.graphic.complete': 'सिंक पूर्ण',
  'onboarding.features.graphic.direction.long': 'LONG',
  'onboarding.features.graphic.direction.short': 'SHORT',
  'onboarding.features.graphic.status.win': 'WIN',
  'onboarding.features.graphic.status.loss': 'LOSS',
  'onboarding.activation.title': 'Journalit में साइन इन करें',

  'onboarding.activation.status.initializing':
    'आपका प्रमाणीकरण कोड जनरेट किया जा रहा है...',

  'onboarding.activation.status.error': 'भाग लेना विफल हुआ',
  'onboarding.activation.error.init':
    'साइन-इन प्रारंभ करने में असमर्थ. अपने इंटरनेट कनेक्शन की जाँच करें और पुन: प्रयास करें।',
  'onboarding.activation.error.denied':
    'साइन-इन अस्वीकृत कर दिया गया. आप बाद में सेटिंग्स से साइन इन कर सकते हैं।',
  'onboarding.activation.error.expired':
    'प्रमाणीकरण कोड समाप्त हो गया. कृपया साइन-इन प्रक्रिया पुनः प्रारंभ करें.',
  'onboarding.activation.error.generic':
    'कुछ गलत हो गया। कृपया पुन: प्रयास करें।',
  'onboarding.activation.error.save':
    'साइन-इन सफल हुआ लेकिन सहेजने में विफल रहा। कृपया प्लगइन पुनः आरंभ करें और पुनः प्रयास करें।',
  'onboarding.activation.error.connection':
    'कनेक्शन टूट गया। कृपया अपना इंटरनेट जांचें और पुनः प्रयास करें।',
  'onboarding.activation.notice.invalid-url':
    'अमान्य सक्रियण यूआरएल. कृपया समर्थन से संपर्क करें.',

  'onboarding.activation.notice.popup-blocked-manual':
    'कृपया इस URL को अपने ब्राउज़र में खोलें: {url}',
  'onboarding.activation.notice.copy-code-failed':
    'कोड कॉपी करने में विफल. कृपया मैन्युअल रूप से कॉपी करें.',
  'onboarding.activation.label.code': 'आपका प्रमाणीकरण कोड',
  'onboarding.activation.button.copy': 'कोड कॉपी करें',
  'onboarding.activation.button.copy-link': 'लिंक की प्रतिलिपि करें',
  'onboarding.activation.button.copied': 'नकल की गई!',
  'onboarding.activation.step.open-browser':
    'अपना ब्राउज़र खोलने के लिए नीचे क्लिक करें',
  'onboarding.activation.step.enter-code': 'अपना प्रमाणीकरण कोड दर्ज करें',
  'onboarding.activation.step.complete-signin': 'पूर्ण साइन-इन',
  'onboarding.activation.step.return-here':
    'स्वचालित पूर्णता के लिए यहां वापस लौटें',
  'onboarding.activation.button.open-browser':
    'साइन इन करने के लिए ब्राउज़र खोलें',
  'onboarding.activation.waiting.title': 'साइन-इन की प्रतीक्षा में...',
  'onboarding.activation.waiting.hint':
    'इसमें आमतौर पर एक मिनट से भी कम समय लगता है',
  'onboarding.activation.success.title': 'साइन इन पूर्ण!',

  'onboarding.notice.complete-failed':
    'ऑनबोर्डिंग पूर्णता सहेजने में विफल. कृपया बाद में पुन: प्रयास करें।',
  'onboarding.notice.completed': 'आपका जर्नल तैयार है। ऑनबोर्डिंग पूर्ण हुई।',
  'onboarding.familiarity.kicker': 'एक छोटा सवाल',
  'onboarding.familiarity.title': 'क्या आपने पहले Obsidian इस्तेमाल किया है?',
  'onboarding.familiarity.subtitle':
    'Journalit Obsidian के अंदर चलता है। अगर यह आपके लिए नया है, तो हम सिर्फ़ ज़रूरी चीज़ें दिखाएँगे।',
  'onboarding.familiarity.option.yes.label': 'हाँ, मुझे पता है',
  'onboarding.familiarity.option.yes.description': 'परिचय छोड़ें।',
  'onboarding.familiarity.option.no.label': 'नहीं, Obsidian मेरे लिए नया है',
  'onboarding.familiarity.option.no.description':
    'एक छोटी स्क्रीन, कोई टूर नहीं।',
  'onboarding.orientation.kicker': 'Obsidian में नए',
  'onboarding.orientation.title': 'जानने योग्य चार बातें',
  'onboarding.orientation.subtitle':
    'Journalit इस्तेमाल करने के लिए बस इतना ही चाहिए।',
  'onboarding.orientation.inside.title': 'Journalit Obsidian के अंदर चलता है',
  'onboarding.orientation.inside.body':
    'पहले Obsidian सीखने की ज़रूरत नहीं। यह स्क्रीन एक Journalit व्यू है।',
  'onboarding.orientation.sidebar.title': 'साइडबार से आप नेविगेट करते हैं',
  'onboarding.orientation.sidebar.body':
    'होम, डैशबोर्ड, ट्रेड लॉग और आपके रिव्यू वहीं हैं।',
  'onboarding.orientation.sidebar.action': 'मुझे साइडबार दिखाएँ',
  'onboarding.orientation.sidebar.action-mobile': 'साइडबार खोलें',
  'onboarding.orientation.sidebar.hint':
    'वह बाईं ओर है। यह स्क्रीन खुली रहती है।',
  'onboarding.orientation.sidebar.hint-mobile':
    'यह इस स्क्रीन के ऊपर खुलता है। वापस आने के लिए स्वाइप करें या बाहर टैप करें।',
  'onboarding.orientation.tabs.title': 'व्यू टैब के रूप में खुलते हैं',
  'onboarding.orientation.tabs.body': 'इसी की तरह। ऊपर से उनके बीच स्विच करें।',
  'onboarding.orientation.privacy.title': 'आपका जर्नल आपके डिवाइस पर रहता है',
  'onboarding.orientation.privacy.body':
    'नोट्स, स्क्रीनशॉट और रिव्यू आपकी अपनी फ़ाइलें हैं। सिर्फ़ इम्पोर्ट या सिंक किए गए ट्रेड Journalit के सर्वर से गुज़रते हैं।',
  'onboarding.orientation.continue': 'समझ गया',
  'onboarding.data-source.kicker': 'आपके ट्रेड',
  'onboarding.data-source.title': 'आपके ट्रेड अभी कहाँ हैं?',
  'onboarding.data-source.subtitle':
    'आपका इतिहास आपकी बढ़त का हिस्सा है। इसे साथ लाएँ और पहले दिन से आँकड़े सार्थक हों, नए ट्रेड जमा होने के महीनों इंतज़ार के बजाय।',
  'onboarding.data-source.option.broker.label': 'मेरे ब्रोकर या प्लेटफ़ॉर्म पर',
  'onboarding.data-source.option.broker.description':
    'उसे कनेक्ट करें, या उसका एक्सपोर्ट इम्पोर्ट करें।',
  'onboarding.data-source.option.file.label': 'स्प्रेडशीट या फ़ाइल में',
  'onboarding.data-source.option.file.description':
    'CSV, Excel या HTML एक्सपोर्ट।',
  'onboarding.data-source.option.fresh.label':
    'अभी कहीं नहीं, मैं नई शुरुआत कर रहा हूँ',
  'onboarding.data-source.option.fresh.description':
    'ट्रेड करते समय उन्हें जोड़ें।',
  'onboarding.data-source.option.sample.label':
    'अभी कहीं नहीं, मुझे एक नमूना देखने दें',
  'onboarding.data-source.option.sample.description':
    'अपने ट्रेड जोड़ने से पहले एक तैयार जर्नल देखें।',
  'onboarding.broker.kicker': 'आपका ब्रोकर',
  'onboarding.broker.title': 'कौन सा ब्रोकर या प्लेटफ़ॉर्म?',
  'onboarding.awaiting.sign-in.action': 'जारी रखने के लिए साइन इन करें',
  'onboarding.awaiting.sign-in.body':
    'पहले साइन इन करें या मुफ़्त Journalit खाता बनाएँ। फिर आपके ट्रेड आपके जर्नल में आ जाएँगे।',
  'onboarding.broker.badge.sync': 'ऑटो-सिंक',
  'onboarding.broker.search': 'ब्रोकर और प्लेटफ़ॉर्म खोजें',
  'onboarding.broker.subtitle':
    'हम आपके ट्रेड लाने का सबसे अच्छा तरीका चुनेंगे।',
  'onboarding.broker.option.unlisted.label': 'सूची में नहीं है',
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title': 'अभी सूची में नहीं? बताएँ कौन सा ब्रोकर',
  'onboarding.broker.request.body':
    'नए ब्रोकर अनुरोध पर जोड़े जाते हैं। बताएँ कौन सा (निर्यात नमूना मदद करता है); तब तक फ़ाइल निर्यात को हाथ से मैप किया जा सकता है।',
  'onboarding.broker.request.discord': 'Discord पर अनुरोध करें',
  'onboarding.broker.request.continue': 'मैन्युअल आयात के साथ जारी रखें',
  'onboarding.broker.loading': 'समर्थित ब्रोकर जाँचे जा रहे हैं...',
  'onboarding.broker.offline':
    'पूरी सूची लोड नहीं हो सकी। आप फिर भी समर्थित ब्रोकर कनेक्ट कर सकते हैं या फ़ाइल इम्पोर्ट कर सकते हैं।',
  'onboarding.personalise.kicker': 'अपना जर्नल सेट करें',
  'onboarding.personalise.title': 'कुछ त्वरित विकल्प',
  'onboarding.personalise.subtitle':
    'हम आपके जवाबों के आधार पर Journalit को निजीकृत करते हैं।',
  'onboarding.personalise.style.question': 'आप कैसे ट्रेड करते हैं?',
  'onboarding.personalise.style.scalping': 'दिन में कई ट्रेड',
  'onboarding.personalise.style.intraday': 'दिन में कुछ ट्रेड, रात भर कुछ नहीं',
  'onboarding.personalise.style.swing': 'दिनों या हफ़्तों तक होल्ड',
  'onboarding.personalise.style.position': 'हफ़्तों या महीनों तक होल्ड',
  'onboarding.personalise.account.question': 'किस तरह का खाता?',
  'onboarding.personalise.account.personal': 'व्यक्तिगत',
  'onboarding.personalise.account.practice': 'डेमो या अभ्यास',
  'onboarding.personalise.account.prop': 'प्रॉप-फर्म चैलेंज या फंडेड',
  'onboarding.personalise.asset.question':
    'आप मुख्य रूप से क्या ट्रेड करते हैं?',
  'onboarding.personalise.asset.stock': 'स्टॉक',
  'onboarding.personalise.asset.futures': 'फ़्यूचर्स',
  'onboarding.personalise.asset.forex': 'फ़ॉरेक्स',
  'onboarding.personalise.asset.crypto': 'क्रिप्टो',
  'onboarding.personalise.asset.options': 'ऑप्शंस',
  'onboarding.personalise.asset.mixed': 'मिश्रित',
  'onboarding.first-trade.kicker': 'लगभग हो गया',
  'onboarding.first-trade.title': 'अपना पहला ट्रेड जोड़ें',
  'onboarding.first-trade.subtitle':
    'आपका जर्नल तैयार है। एक ट्रेड दर्ज करें और Journalit उसी से काम शुरू कर देगा।',
  'onboarding.first-trade.cta': 'मेरा पहला ट्रेड जोड़ें',
  'onboarding.first-trade.sample': 'नमूना डेटा के साथ देखें',
  'onboarding.preparing-sample.title': 'आपका नमूना जर्नल तैयार हो रहा है',
  'onboarding.preparing-sample.body':
    'इसमें बस कुछ सेकंड लगते हैं। नोट्स लिखे जाने के दौरान Obsidian थोड़ा धीमा लग सकता है।',
  'onboarding.preparing-sample.starting': 'शुरू हो रहा है…',
  'onboarding.preparing-sample.hint':
    'आप कोने में मौजूद बैज से कभी भी नमूना जर्नल हटा सकते हैं।',
  'onboarding.preparing-sample.failed.title': 'नमूना जर्नल नहीं बन सका',
  'onboarding.preparing-sample.failed.body':
    'फिर से कोशिश करें या शुरू करने का दूसरा तरीका चुनें।',
  'onboarding.preparing-sample.retry': 'फिर से कोशिश करें',
  'onboarding.sample-exploring.kicker': 'नमूना जर्नल',
  'onboarding.sample-exploring.title': 'आप नमूना जर्नल देख रहे हैं',
  'onboarding.sample-exploring.body':
    'आराम से देखें। नमूने से बाहर निकलने पर हम यहीं से आगे बढ़ेंगे: अपना जर्नल व्यक्तिगत बनाएँ और पहला ट्रेड जोड़ें।',
  'onboarding.sample-exploring.exit': 'नमूने से बाहर निकलें और जारी रखें',
  'onboarding.sample-exploring.failed.title':
    'नमूना जर्नल को पुनर्स्थापित नहीं किया जा सका',
  'onboarding.sample-exploring.failed.body':
    'बचे हुए हिस्से को हटाने के लिए नमूने से बाहर निकलें, फिर अपना जर्नल सेट करना जारी रखें।',
  'onboarding.awaiting.kicker': 'आपके पहले ट्रेड की प्रतीक्षा',
  'onboarding.awaiting.first-sync.title': 'ब्रोकर कनेक्शन पूरा करें',
  'onboarding.awaiting.first-sync.body':
    'सेटिंग्स > Trade Sync में कनेक्शन पूरा करें। आपके पहले ट्रेड सिंक होते ही यह सेटअप अपने आप बंद हो जाएगा।',
  'onboarding.awaiting.first-sync.action': 'Trade Sync खोलें',
  'onboarding.awaiting.first-import.title': 'अपनी फ़ाइल इम्पोर्ट करें',
  'onboarding.awaiting.first-import.body':
    'Trade Import टैब में इम्पोर्ट पूरा करें। आपके पहले ट्रेड आते ही यह सेटअप अपने आप बंद हो जाएगा।',
  'onboarding.awaiting.first-import.action': 'Trade Import खोलें',
  'onboarding.awaiting.first-trade.title': 'अपना पहला ट्रेड सहेजें',
  'onboarding.awaiting.first-trade.body':
    'आपका पहला ट्रेड सहेजते ही यह सेटअप अपने आप बंद हो जाएगा।',
  'onboarding.awaiting.first-trade.action': 'ट्रेड जोड़ें',
  'onboarding.awaiting.change-route': 'दूसरा तरीका चुनें',
  'onboarding.notice.personalise-failed':
    'आपके सेटअप विकल्प लागू नहीं हो सके। आप उन्हें बाद में सेटिंग्स में बदल सकते हैं।',
  'onboarding.notice.trade-sync-open-failed':
    'Trade Sync खोलने में असमर्थ. कृपया पुन: प्रयास करें।',
  'onboarding.notice.skip-failed':
    'ऑनबोर्डिंग स्किप सहेजने में विफल. कृपया बाद में पुन: प्रयास करें।',

  'widget.goals.title.daily': 'दैनिक लक्ष्य',
  'widget.goals.title.weekly': 'साप्ताहिक लक्ष्य',
  'widget.goals.title.monthly': 'मासिक लक्ष्य',
  'widget.goals.title.quarterly': 'त्रैमासिक लक्ष्य',
  'widget.goals.title.yearly': 'वार्षिक लक्ष्य',
  'widget.goals.title.default': 'गोल्स',
  'widget.goals.tooltip.daily':
    'यहां जोड़े गए आइटम केवल आज तक लागू होते हैं। सभी नए डीआरसी पर आवर्ती आइटम के लिए, सेटिंग्स > रिव्यूज़ पर जाएं।',
  'widget.goals.tooltip.weekly':
    'यहां जोड़े गए आइटम केवल इस सप्ताह पर लागू होते हैं। सभी नए साप्ताहिक रिव्यूज़ पर आवर्ती आइटम के लिए, सेटिंग्स > रिव्यूज़ पर जाएं।',
  'widget.goals.tooltip.monthly':
    'यहां जोड़े गए आइटम केवल इसी महीने पर लागू होते हैं। सभी नए मासिक रिव्यूज़ पर आवर्ती आइटम के लिए, सेटिंग्स > रिव्यूज़ पर जाएं।',
  'widget.goals.tooltip.quarterly':
    'यहां जोड़े गए आइटम केवल इस तिमाही पर लागू होते हैं। सभी नए त्रैमासिक रिव्यूज़ पर आवर्ती आइटम के लिए, सेटिंग्स > रिव्यूज़ पर जाएं।',
  'widget.goals.tooltip.yearly':
    'यहां जोड़े गए आइटम केवल इस वर्ष पर लागू होते हैं। सभी नए वार्षिक रिव्यूज़ पर आवर्ती आइटम के लिए, सेटिंग्स > रिव्यूज़ पर जाएं।',
  'widget.goals.completed': '{completed}/{total} पूरा हुआ',
  'widget.goals.placeholder': 'एक नया लक्ष्य जोड़ें...',
  'widget.goals.empty.preview': 'कोई लक्ष्य कॉन्फ़िगर नहीं किया गया',
  'widget.goals.empty.default': 'कोई लक्ष्य निर्धारित नहीं. नीचे एक जोड़ें.',
  'widget.goals.invalid-context':
    'लक्ष्य विजेट के लिए रिव्यू नोट की आवश्यकता होती है (DRC, साप्ताहिक, मासिक, त्रैमासिक या वार्षिक)',
  'widget.goals.aria.edit': 'लक्ष्य संपादित करें',
  'widget.goals.aria.delete': 'लक्ष्य हटाएँ',
  'widget.header.name': 'हेडर',

  'widget.header.invalid-context':
    "अमान्य frontmatter: 'प्रकार' (drc/साप्ताहिक-रिव्यू/मासिक-रिव्यू/त्रैमासिक-रिव्यू/ट्रेड) और दिनांक फ़ील्ड (रिव्यूज़ के लिए 'तिथि', ट्रेड्स के लिए 'एंट्रीटाइम') की आवश्यकता है",
  'widget.header.aria.mark-reviewed':
    'रिव्यूड के रूप में चिह्नित करने के लिए क्लिक करें',
  'widget.header.aria.mark-not-reviewed':
    'रिव्यूड नहीं के रूप में चिह्नित करने के लिए क्लिक करें',
  'widget.header.unknown-instrument': 'अज्ञात',
  'widget.header.week': 'सप्ताह {number}',
  'widget.header.quarter': 'Q{number}',
  'widget.header.drc': 'DRC',
  'widget.header.nav.prev': '← पिछला',
  'widget.header.nav.next': 'अगला →',
  'widget.header.day.0': 'रविवार',
  'widget.header.day.1': 'सोमवार',
  'widget.header.day.2': 'मंगलवार',
  'widget.header.day.3': 'बुधवार',
  'widget.header.day.4': 'गुरुवार',
  'widget.header.day.5': 'शुक्रवार',
  'widget.header.day.6': 'शनिवार',
  'widget.header.month.0': 'जनवरी',
  'widget.header.month.1': 'फरवरी',
  'widget.header.month.2': 'मार्च',
  'widget.header.month.3': 'अप्रैल',
  'widget.header.month.4': 'मई',
  'widget.header.month.5': 'जून',
  'widget.header.month.6': 'जुलाई',
  'widget.header.month.7': 'अगस्त',
  'widget.header.month.8': 'सितंबर',
  'widget.header.month.9': 'अक्टूबर',
  'widget.header.month.10': 'नवंबर',
  'widget.header.month.11': 'दिसंबर',
  'widget.header.month-short.0': 'जन',
  'widget.header.month-short.1': 'फर',
  'widget.header.month-short.2': 'मार्च',
  'widget.header.month-short.3': 'अप्रैल',
  'widget.header.month-short.4': 'मई',
  'widget.header.month-short.5': 'जून',
  'widget.header.month-short.6': 'जुल',
  'widget.header.month-short.7': 'अग',
  'widget.header.month-short.8': 'सित',
  'widget.header.month-short.9': 'अक्टू',
  'widget.header.month-short.10': 'नव',
  'widget.header.month-short.11': 'दिस',
  'widget.picker.placeholder': 'एक विजेट चुनें...',
  'widget.picker.search-placeholder': 'विजेट्स खोजें...',
  'widget.picker.search-label': 'विजेट्स खोजें',
  'widget.picker.clear-search': 'विजेट खोज साफ़ करें',
  'widget.picker.results-label': 'उपलब्ध विजेट्स',
  'widget.picker.no-results': 'कोई विजेट आपकी खोज से मेल नहीं खाता',
  'widget.category.charts': 'चार्ट',
  'widget.category.statistics': 'आंकड़े',
  'widget.category.content': 'सामग्री',
  'widget.category.tables': 'टेबल',
  'widget.category.layout': 'लेआउट',
  'widget.goals.name': 'गोल्स',
  'widget.goals.description': 'पूर्णता चेकबॉक्स के साथ दैनिक लक्ष्य',
  'widget.review.name': 'रिव्यू',
  'widget.review.description': 'मानसिक और तकनीकी प्रदर्शन ग्रेड',
  'widget.review-context-fields.name': 'रिव्यू संदर्भ फ़ील्ड',
  'widget.review-context-fields.description':
    'रिव्यू नोट्स के लिए संपादन योग्य कस्टम संदर्भ फ़ील्ड',
  'widget.review-context-fields.group.default': 'रिव्यू प्रसंग',

  'widget.review-context-fields.empty-title':
    'इस रिव्यू प्रकार के लिए कोई रिव्यू संदर्भ फ़ील्ड कॉन्फ़िगर नहीं किया गया है।',
  'widget.review-context-fields.empty-desc':
    'पूर्वाग्रह, फोकस, इरादे और अन्य नियोजन संदर्भ को पकड़ने के लिए सेटिंग्स में रिव्यू कस्टम फ़ील्ड बनाएं।',
  'widget.review-context-fields.configure': 'रिव्यू फ़ील्ड कॉन्फ़िगर करें',
  'widget.review-context-fields.service-unavailable':
    'रिव्यू कस्टम फ़ील्ड अभी तक उपलब्ध नहीं हैं।',
  'widget.review-context-fields.unsupported-type':
    'असमर्थित रिव्यू फ़ील्ड प्रकार.',
  'widget.review-context-fields.source-missing':
    'यह मूल रिव्यू अभी तक मौजूद नहीं है।',
  'widget.review-context-fields.source-invalid':
    'यह मूल रिव्यू मौजूद है लेकिन वैध रिव्यू नोट नहीं है।',
  'widget.review-context-fields.source-empty':
    'इस मूल रिव्यू में अभी तक कोई विरासत में मिला मान नहीं भरा गया है।',

  'widget.review.title': 'प्रदर्शन रिव्यू',
  'widget.review.mental-game': 'मेंटल गेम',
  'widget.review.technical-game': 'टेक्निकल गेम',
  'widget.review.star-hint':
    'पूर्ण स्टार के लिए क्लिक करें, आधे स्टार के लिए राइट-क्लिक करें',
  'widget.review.invalid-context':
    "रिव्यू विजेट को DRC या वीकली रिव्यू नोट की आवश्यकता है (frontmatter प्रकार: 'drc' या 'साप्ताहिक-रिव्यू')",
  'widget.checklist.name': 'जांच सूची',
  'widget.checklist.description': 'सत्र पूर्व तैयारी चेकलिस्ट',
  'widget.session-mistakes.name': 'सत्र की गलतियाँ',
  'widget.session-mistakes.description':
    'सत्र के अंत में दिन भर की व्यवहार संबंधी गलतियों पर नज़र रखें',
  'widget.key-levels.name': 'प्रमुख स्तर',
  'widget.key-levels.description': 'देखने लायक महत्वपूर्ण मूल्य स्तर',
  'widget.key-events.name': 'प्रमुख घटनाएँ',
  'widget.key-events.description': 'इस काल की महत्वपूर्ण घटनाएँ',
  'widget.key-events.title': 'प्रमुख घटनाएँ',
  'widget.key-events.tooltip':
    'मुख्य ईवेंट आपके वीकली रिव्यू में सहेजे जाते हैं और इन्हें यहां DRC में जोड़ा या संपादित किया जा सकता है।',
  'widget.key-events.placeholder': 'ईवेंट चुनें या बनाएं',
  'widget.key-events.color-label': 'रंग:',
  'widget.key-events.color-aria': '{color} रंग चुनें',
  'widget.key-events.day-label': 'दिन:',
  'widget.key-events.notes-placeholder': 'इस घटना के बारे में नोट्स (वैकल्पिक)',
  'widget.key-events.notes-label': 'नोट्स',
  'widget.key-events.default-notes-tooltip':
    'डिफ़ॉल्ट नोट्स सेटिंग्स → अनुकूलन → इवेंट में प्रबंधित किए जाते हैं। यहां किसी ईवेंट का चयन करने से उसके सहेजे गए डिफ़ॉल्ट नोट्स स्वतः भर जाएंगे।',
  'widget.key-events.add-button': 'कार्यक्रम जोड़ें',
  'widget.key-events.empty-state': 'आज के लिए कोई महत्वपूर्ण कार्यक्रम नहीं',
  'widget.key-events.empty-state-sub': 'अपने वीकली रिव्यू में ईवेंट जोड़ें',
  'widget.missed-trades.name': 'मिस्ड ट्रेड्स',
  'widget.missed-trades.description': 'ट्रेड्स जो आपने पहचाने लेकिन नहीं लिए',
  'widget.images.name': 'चार्ट और मीडिया',
  'widget.images.description': 'अपलोड समर्थन के साथ मीडिया हिंडोला',
  'widget.images.invalid-context':
    "मीडिया विजेट को रिव्यू नोट की आवश्यकता है (प्रकार: 'drc', 'साप्ताहिक-रिव्यू', 'मासिक-रिव्यू', 'त्रैमासिक-रिव्यू', या 'वार्षिक-रिव्यू')",
  'widget.images.alt-prefix': 'रिव्यू मीडिया',
  'widget.images.stacked-alt': 'रिव्यू मीडिया {index}',
  'widget.images.open-fullscreen': 'मीडिया {index} फ़ुलस्क्रीन खोलें',
  'widget.images.delete': 'मीडिया हटाएँ',
  'widget.images.empty': 'कोई मीडिया नहीं',
  'widget.images.placeholder': 'मीडिया URL या फ़ाइल पथ चिपकाएँ...',
  'widget.images.placeholder-add-more': 'अधिक मीडिया जोड़ें...',
  'widget.mark-reviewed.name': 'रिव्यूड के रूप में चिह्नित करें',
  'widget.mark-reviewed.description':
    'रिव्यू को टाइमस्टैम्प के साथ पूर्ण के रूप में चिह्नित करने के लिए बैनर',
  'widget.mark-reviewed.status.reviewed': 'की समीक्षा',
  'widget.mark-reviewed.status.pending': 'लंबित समीक्षा',
  'widget.mark-reviewed.button.undo': 'पूर्ववत',
  'widget.mark-reviewed.button.mark': 'रिव्यूड के रूप में चिह्नित करें',
  'widget.pnl-chart.name': 'इक्विटी कर्व',
  'widget.pnl-chart.description': 'समय के साथ संचयी लाभ/हानि',
  'widget.drawdown-chart.name': 'ड्रॉडाउन',
  'widget.drawdown-chart.description':
    'पिछले रियलाइज़्ड P&L हाई से बंद-ट्रेड ड्रॉडाउन राशि',
  'widget.directional-pnl.name': 'दिशात्मक P&L',
  'widget.directional-pnl.description': 'लॉन्ग बनाम शॉर्ट प्रदर्शन तुलना',
  'widget.directional-drawdown.name': 'दिशात्मक रियलाइज़्ड ड्रॉडाउन',
  'widget.directional-drawdown.description':
    'लॉन्ग और शॉर्ट बंद-ट्रेड ड्रॉडाउन राशि कर्व अलग करें',
  'widget.long-drawdown.name': 'लॉन्ग ड्रॉडाउन',
  'widget.long-drawdown.description':
    'बंद-ट्रेड ड्रॉडाउन राशि कर्व केवल लॉन्ग ट्रेड्स के लिए',
  'widget.short-drawdown.name': 'शॉर्ट ड्रॉडाउन',
  'widget.short-drawdown.description':
    'बंद-ट्रेड ड्रॉडाउन राशि कर्व केवल शॉर्ट ट्रेड्स के लिए',
  'widget.trades-chart.name': 'ट्रेड P&L',
  'widget.trades-chart.description': 'प्रत्येक व्यक्तिगत ट्रेड के लिए P&L बार',
  'widget.trades-chart-daily.name': 'दैनिक P&L',
  'widget.trades-chart-daily.description': 'P&L दिन के हिसाब से एकत्रित',
  'widget.trades-chart-weekly.name': 'साप्ताहिक P&L',
  'widget.trades-chart-weekly.description': 'P&L सप्ताह के अनुसार एकत्रित',
  'widget.trades-chart-monthly.name': 'मासिक P&L',
  'widget.trades-chart-monthly.description': 'P&L महीने के हिसाब से एकत्रित',
  'widget.trades-chart-quarterly.name': 'त्रैमासिक P&L',
  'widget.trades-chart-quarterly.description': 'P&L तिमाही द्वारा एकत्रित',
  'widget.stats.name': 'आँकड़े ग्रिड',
  'widget.stats.description': 'ग्रिड प्रारूप में मुख्य प्रदर्शन मेट्रिक्स',
  'widget.stats.no-trades': 'इस अवधि के लिए कोई बंद ट्रेड्स नहीं',
  'widget.stats.vs-prev': 'बनाम पिछला',
  'dashboard.metrics.past-30d': 'पिछले 30 दिन',

  'widget.stats.net-pnl': 'नेट P&L',
  'widget.stats.win-rate': 'विन रेट',
  'widget.stats.profit-factor': 'प्रॉफिट फैक्टर',
  'widget.stats.expectancy': 'एक्सपेक्टेंसी',
  'widget.stats.total-trades': 'कुल ट्रेड्स',
  'widget.stats.avg-win': 'औसत विन',
  'widget.stats.avg-loss': 'औसत लॉस',
  'widget.stats.pl-ratio': 'पी/एल अनुपात',
  'widget.account-breakdown.name': 'अकाउंट ब्रेकडाउन',
  'widget.account-breakdown.description':
    'इस रिव्यू अवधि में अकाउंट्स के प्रदर्शन की तुलना करें',
  'widget.account-breakdown.empty': 'इस अवधि के लिए कोई बंद ट्रेड्स नहीं',
  'widget.account-breakdown.column.account': 'अकाउंट',
  'widget.account-breakdown.column.trades': 'ट्रेड्स',
  'widget.account-breakdown.column.pnl': 'नेट P&L',
  'widget.account-breakdown.column.win-rate': 'विन रेट',
  'widget.account-breakdown.column.profit-factor': 'प्रॉफिट फैक्टर',
  'widget.tag-performance.name': 'टैग प्रदर्शन',
  'widget.tag-performance.description': 'ट्रेड टैग द्वारा प्रदर्शन विश्लेषण',
  'widget.setup-performance.name': 'सेटअप प्रदर्शन',
  'widget.setup-performance.description':
    'सेटअप ट्रेडिंग द्वारा प्रदर्शन विश्लेषण',
  'widget.best-worst-trades.name': 'सबसे अच्छा/सबसे खराब ट्रेड्स',
  'widget.best-worst-trades.description': 'शीर्ष जीत और हार ट्रेड्स',
  'widget.best-worst.best-trade': 'सर्वश्रेष्ठ ट्रेड',
  'widget.best-worst.worst-trade': 'सबसे खराब ट्रेड',
  'widget.best-worst.no-win-trades': 'कोई विजेता ट्रेड्स नहीं',
  'widget.best-worst.no-loss-trades': 'कोई हार नहीं ट्रेड्स',
  'widget.best-worst.best-month': 'सर्वोत्तम महीना',
  'widget.best-worst.worst-month': 'सबसे ख़राब महीना',
  'widget.best-worst.no-profitable-months': 'कोई लाभदायक महीना नहीं',
  'widget.best-worst.no-losing-months': 'कोई घाटे वाला महीना नहीं',
  'widget.best-worst.n-trades': '{count} ट्रेड्स',
  'widget.best-worst.win-rate': '{rate}% विन रेट',
  'widget.best-worst-days.name': 'सबसे अच्छे/सबसे बुरे दिन',
  'widget.best-worst-days.description': 'उच्चतम और निम्नतम P&L दिन',
  'widget.best-worst-days.best-day': 'सबसे अच्छा दिन',
  'widget.best-worst-days.worst-day': 'सबसे ख़राब दिन',
  'widget.best-worst-days.no-profitable-days': 'कोई लाभदायक दिन नहीं',
  'widget.best-worst-days.no-losing-days': 'कोई घाटे वाला दिन नहीं',
  'widget.best-worst-days.trade-count.one': '{count} ट्रेड',
  'widget.best-worst-days.trade-count.few': '{count} ट्रेड्स',
  'widget.best-worst-days.trade-count.many': '{count} ट्रेड्स',
  'widget.best-worst-days.trade-count.other': '{count} ट्रेड्स',
  'widget.best-worst-days.win-rate': '{rate}% विन रेट',
  'widget.best-worst-days.invalid-context':
    'यह विजेट केवल साप्ताहिक और मासिक रिव्यूज़ में उपलब्ध है',
  'widget.position-size.title': 'पोजीशन साइज़',
  'widget.position-size.save-defaults': 'डिफ़ॉल्ट के रूप में सहेजें',
  'widget.position-size.reset-defaults': 'डिफ़ॉल्ट पर पुनः सेट करें',
  'widget.position-size.stock-crypto': 'स्टॉक/क्रिप्टो',
  'widget.position-size.futures': 'फ्यूचर्स',
  'widget.position-size.forex': 'Forex',
  'widget.position-size.account-balance': 'अकाउंट बैलेंस',
  'widget.position-size.risk-percent': 'जोखिम %',
  'widget.position-size.entry-price': 'एंट्री कीमत',
  'widget.position-size.profit-target-optional': 'लाभ लक्ष्य (वैकल्पिक)',
  'widget.position-size.currency-pair': 'मुद्रा जोड़ी',
  'widget.position-size.stop-loss-pips': 'स्टॉप लॉस (पिप्स)',
  'widget.position-size.target-pips-optional': 'लक्ष्य (पिप्स, वैकल्पिक)',
  'widget.position-size.placeholder.example': 'उदाहरण के लिए, {value}',
  'widget.position-size.enter-values': 'मान दर्ज',
  'widget.position-size.risk': 'जोखिम',
  'widget.position-size.reward': 'इनाम',
  'widget.position-size.stop': 'रुकना',
  'widget.position-size.pts': 'अंक',
  'widget.position-size.mini': 'मिनी',
  'widget.position-size.pip-value-info':
    'पिप मूल्य: ${value} (मानक लॉट) | पिप का आकार: {size}',
  'widget.position-size.futures-info':
    '${dollar}/pt | टिक करें: {size} = ${value}',
  'widget.position-size.investment-dollar': 'निवेश ($)',
  'widget.position-size.investment': 'निवेश',
  'widget.position-size.at-price': '@ ${price}',
  'widget.best-worst-weeks.name': 'सबसे अच्छे/सबसे बुरे सप्ताह',
  'widget.best-worst-weeks.description': 'उच्चतम और निम्नतम P&L सप्ताह',
  'widget.best-worst-weeks.best-week': 'सर्वोत्तम सप्ताह',
  'widget.best-worst-weeks.worst-week': 'सबसे ख़राब सप्ताह',
  'widget.best-worst-weeks.no-profitable': 'कोई लाभदायक सप्ताह नहीं',
  'widget.best-worst-weeks.no-losing': 'कोई सप्ताह नहीं खोना',
  'widget.best-worst-weeks.week-name': 'सप्ताह {number} ({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} ट्रेड्स',
  'widget.best-worst-weeks.win-rate': '{percent}% विन रेट',
  'widget.best-worst-weeks.invalid-context':
    'यह विजेट केवल साप्ताहिक, मासिक, त्रैमासिक और वार्षिक रिव्यूज़ में उपलब्ध है',
  'widget.best-worst-months.name': 'सबसे अच्छे/सबसे बुरे महीने',
  'widget.best-worst-months.description': 'उच्चतम और निम्नतम P&L महीने',
  'widget.best-worst-months.invalid-context':
    'यह विजेट केवल त्रैमासिक और वार्षिक रिव्यूज़ में उपलब्ध है',
  'widget.best-worst-quarters.name': 'सबसे अच्छी/सबसे ख़राब तिमाहियाँ',
  'widget.best-worst-quarters.description': 'उच्चतम और निम्नतम P&L क्वार्टर',
  'widget.best-worst-quarters.best-quarter': 'सर्वोत्तम तिमाही',
  'widget.best-worst-quarters.worst-quarter': 'सबसे ख़राब तिमाही',
  'widget.best-worst-quarters.no-profitable': 'कोई लाभदायक तिमाही नहीं',
  'widget.best-worst-quarters.no-losing': 'कोई हारा हुआ क्वार्टर नहीं',
  'widget.best-worst-quarters.trade-count': '{count} ट्रेड्स',
  'widget.best-worst-quarters.win-rate': '{percent}% विन रेट',
  'widget.best-worst-quarters.invalid-context':
    'यह विजेट केवल वार्षिक रिव्यूज़ में उपलब्ध है',
  'widget.technical-game.name': 'टेक्निकल गेम',
  'widget.technical-game.description': 'DRCs से साप्ताहिक तकनीकी ग्रेड वितरण',
  'widget.mental-game.name': 'मेंटल गेम',
  'widget.mental-game.description': 'DRCs से साप्ताहिक मानसिक ग्रेड वितरण',
  'widget.demon-tracker.name': 'दानव ट्रैकर',
  'widget.demon-tracker.description':
    'बार-बार होने वाली ट्रेडिंग गलतियों पर नज़र रखें',
  'widget.trading-score.title': 'ट्रेडिंग स्कोर',
  'widget.trading-score.no-data': 'कोई ट्रेड डेटा नहीं',
  'widget.trading-score.breakdown-title': 'स्कोर ब्रेकडाउन',
  'widget.trading-score.close-breakdown': 'ब्रेकडाउन बंद करें',
  'widget.trading-score.of-weeks': '{count} का',
  'widget.trading-score.start-trading':
    'अपना स्कोर अनलॉक करने के लिए ट्रेडिंग शुरू करें',
  'widget.trading-score.one-week-down': '1 सप्ताह कम, चलते रहें!',
  'widget.trading-score.weeks-to-unlock.one':
    '{count} अनलॉक होने में एक सप्ताह और',
  'widget.trading-score.weeks-to-unlock.few':
    'अनलॉक करने के लिए {count} और सप्ताह',
  'widget.trading-score.weeks-to-unlock.many':
    'अनलॉक करने के लिए {count} और सप्ताह',
  'widget.trading-score.weeks-to-unlock.other':
    'अनलॉक करने के लिए {count} और सप्ताह',
  'widget.trading-score.trades-to-unlock.one':
    'अनलॉक करने के लिए {count} और अधिक ट्रेड',
  'widget.trading-score.trades-to-unlock.few':
    'अनलॉक करने के लिए {count} और अधिक ट्रेड्स',
  'widget.trading-score.trades-to-unlock.many':
    'अनलॉक करने के लिए {count} और अधिक ट्रेड्स',
  'widget.trading-score.trades-to-unlock.other':
    'अनलॉक करने के लिए {count} और अधिक ट्रेड्स',
  'widget.trading-score.collect-more-data':
    'अपना स्कोर अनलॉक करने के लिए थोड़ा और डेटा एकत्र करें',
  'widget.trading-score.trades-logged.one': '{count} ट्रेड लॉग किया गया',
  'widget.trading-score.trades-logged.few': '{count} ट्रेड्स लॉग किया गया',
  'widget.trading-score.trades-logged.many': '{count} ट्रेड्स लॉग किया गया',
  'widget.trading-score.trades-logged.other': '{count} ट्रेड्स लॉग किया गया',
  'widget.trading-score.trades-count': '{count} ट्रेड्स',
  'widget.trading-score.weight': 'वज़न: {weight}%',
  'widget.trading-score.weeks-suffix': '· {weeks}w',
  'widget.trading-score.axis-aria': '{axis}: {score} अंक, {weight}% भार',
  'widget.trading-score.phase.insufficient': 'अपर्याप्त डेटा',
  'widget.trading-score.phase.developing': 'विकासशील',
  'widget.trading-score.phase.established': 'स्थापित',
  'widget.trading-score.axis.profitability': 'लाभप्रदता',
  'widget.trading-score.axis.riskManagement': 'रिस्क मैनेजमेंट',
  'widget.trading-score.axis.execution': 'कार्यान्वयन',
  'widget.trading-score.axis.consistency': 'स्थिरता',
  'widget.trading-score.axis.returnConsistency': 'वापसी संगति',
  'widget.trading-score.axis.experience': 'अनुभव',
  'widget.trading-score.axis.profitability.desc':
    'माप प्रॉफिट फैक्टर और एक्सपेक्टेंसी प्रति ट्रेड',
  'widget.trading-score.axis.riskManagement.desc':
    'मैक्स ड्रॉडाउन नियंत्रण और पुनर्प्राप्ति क्षमता को मापता है',
  'widget.trading-score.axis.execution.desc':
    'विन रेट और औसत जीत/हार अनुपात को मापता है',
  'widget.trading-score.axis.consistency.desc':
    'उपाय स्थिरता और स्ट्रीक नियंत्रण लौटाते हैं',
  'widget.trading-score.axis.returnConsistency.desc':
    'टेक-प्रॉफिट और स्टॉप-लॉस की एकरूपता को मापता है',
  'widget.trading-score.axis.experience.desc':
    'सक्रिय ट्रेडिंग सप्ताहों और निरंतरता को मापता है',
  'widget.trades.name': 'ट्रेड्स',
  'widget.trades.description': 'मुख्य विवरण के साथ ट्रेड्स की सूची',
  'widget.trade-review.name': 'ट्रेड रिव्यू',
  'widget.trade-review.description':
    'प्रत्येक ट्रेड को छवियों, मुख्य तथ्यों और कॉन्फ़िगर किए जा सकने वाले प्रश्नों के साथ रिव्यू करें',
  'widget.trade-review.question.win-what-worked': 'क्या काम किया?',
  'widget.trade-review.placeholder.win-what-worked':
    'आपने इस ट्रेड में क्या अच्छा किया?',
  'widget.trade-review.question.win-repeatable': 'क्या यह दोहराने योग्य था?',
  'widget.trade-review.placeholder.win-repeatable':
    'किस कारण से यह ट्रेड दोहराने योग्य बना?',
  'widget.trade-review.question.key-lesson': 'मुख्य सबक',
  'widget.trade-review.placeholder.key-lesson':
    'आपको इस ट्रेड से क्या याद रखना चाहिए?',
  'widget.trade-review.question.loss-what-went-wrong': 'क्या गलत हो गया?',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    'इस हानि का कारण क्या है?',
  'widget.trade-review.question.loss-valid-or-mistake':
    'क्या यह वैध हानि थी या निष्पादन संबंधी गलती?',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    'वर्णन करें कि क्या यह प्रक्रिया-मान्य था या टालने योग्य था।',
  'widget.trade-review.question.loss-avoid-next-time':
    'अगली बार मैं क्या टालूँगा?',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    'कौन सा विशिष्ट व्यवहार बदलना चाहिए?',
  'widget.trade-review.question.be-managed-correctly':
    'क्या इसका प्रबंधन सही ढंग से किया गया?',
  'widget.trade-review.placeholder.be-managed-correctly':
    'क्या प्रबंधन आपकी योजना से मेल खाता था?',
  'widget.trade-review.status.reviewed': 'रिव्यू हो चुका',
  'widget.trade-review.status.pending': 'लंबित रिव्यू',
  'widget.trade-review.image-alt-prefix': 'ट्रेड रिव्यू छवि',
  'widget.trade-review.no-image': 'कोई ट्रेड छवि नहीं',
  'widget.trade-review.placeholder.default': 'अपने विचार लिखें...',

  'widget.trade-review.open-trade-note': 'ट्रेड नोट खोलें',

  'widget.trade-review.field.entry': 'एंट्री',
  'widget.trade-review.field.exit': 'एग्जिट',
  'widget.trade-review.field.duration': 'अवधि',
  'widget.trade-review.field.risk': 'जोखिम',
  'widget.trade-review.field.account': 'अकाउंट',
  'widget.trade-review.field.setup': 'सेटअप',
  'widget.trade-review.field.mistakes': 'गलतियाँ',
  'widget.trade-review.field.tags': 'टैग्स',
  'widget.trade-review.more-context': 'अधिक प्रसंग',
  'widget.trade-review.field.position-size': 'साइज़',
  'widget.trade-review.field.stop-loss': 'झड़ने बंद',
  'widget.trade-review.field.take-profit': 'लाभ लेने के',
  'widget.trade-review.field.fees': 'शुल्क',
  'widget.trade-review.field.commission': 'ब्रोकरेज',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': 'थीसिस',
  'widget.trade-review.field.notes': 'नोट्स',
  'widget.trade-review.field.custom-fields': 'कस्टम फ़ील्ड्स',
  'widget.trade-review.loading': 'ट्रेड रिव्यूज़ लोड हो रहा है...',
  'widget.trade-review.no-trades': 'कोई ट्रेड्स से रिव्यू नहीं।',
  'widget.trade-review.time.open': 'खोलें',
  'widget.trade-review.fallback-title': 'ट्रेड {index}',
  'widget.backtest-trades.name': 'बैकटेस्ट ट्रेड्स',
  'widget.backtest-trades.description':
    'इस रिव्यू अवधि के लिए बैकटेस्ट ट्रेड्स की सूची',
  'widget.breakdown-daily.name': 'दैनिक सारांश',
  'widget.breakdown-daily.description':
    'प्रदर्शन तालिका दिन के अनुसार समूहीकृत',
  'widget.breakdown-weekly.name': 'साप्ताहिक सारांश',
  'widget.breakdown-weekly.description':
    'प्रदर्शन तालिका सप्ताह के अनुसार समूहीकृत',
  'widget.breakdown-monthly.name': 'मासिक सारांश',
  'widget.breakdown-monthly.description':
    'प्रदर्शन तालिका को महीने के अनुसार समूहीकृत किया गया',
  'widget.breakdown-quarterly.name': 'त्रैमासिक सारांश',
  'widget.breakdown-quarterly.description':
    'प्रदर्शन तालिका को तिमाही के अनुसार समूहीकृत किया गया',
  'widget.breakdown.empty.days-week': 'इस सप्ताह कोई ट्रेडिंग दिन नहीं',
  'widget.breakdown.empty.weeks-month': 'इस महीने कोई ट्रेडिंग सप्ताह नहीं',
  'widget.breakdown.empty.months-quarter':
    'इस तिमाही में कोई ट्रेडिंग महीना नहीं',
  'widget.breakdown.empty.quarters-year': 'इस वर्ष कोई ट्रेडिंग क्वार्टर नहीं',
  'widget.table.header.date': 'तारीख',
  'widget.table.header.week': 'सप्ताह',
  'widget.table.header.month': 'महीना',
  'widget.table.header.quarter': 'क्वार्टर',

  'widget.table.header.trades': 'ट्रेड्स',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'जीतना%',
  'widget.table.header.profit-factor': 'पीएफ',
  'widget.table.header.tag': 'टैग',
  'widget.table.header.setup': 'सेटअप',
  'widget.table.header.a-games': 'A गेम्स',
  'widget.table.header.b-games': 'B गेम्स',
  'widget.table.header.c-games': 'C गेम्स',
  'widget.table.header.rating': 'रेटिंग',
  'widget.table.header.avg-rating': 'औसत रेटिंग',
  'widget.demon-tracker.column.demon': 'राक्षस',
  'widget.demon-tracker.column.occurrences': 'घटनाओं',
  'widget.demon-tracker.column.stop-trading': 'ट्रेडिंग बंद करें',
  'widget.demon-tracker.period.this-week': 'इस सप्ताह',
  'widget.demon-tracker.period.this-month': 'इस महीने',
  'widget.demon-tracker.period.this-quarter': 'इस तिमाही',
  'widget.demon-tracker.period.this-year': 'इस साल',
  'widget.demon-tracker.empty.title': '{period} में कोई गलती ट्रैक नहीं की गई',
  'widget.demon-tracker.empty.description':
    'आपके ट्रेड्स में लॉग की गई गलतियाँ पैटर्न की पहचान करने में सहायता के लिए यहां दिखाई देंगी',
  'widget.demon-tracker.summary.unique': 'अनोखी गलतियाँ:',
  'widget.demon-tracker.summary.total': 'कुल घटनाएँ:',
  'widget.demon-tracker.summary.critical': 'गंभीर ({threshold}+):',
  'widget.markdown-zone.name': 'Markdown जोन',
  'widget.markdown-zone.description': 'फ्री-फॉर्म मार्कडाउन सामग्री क्षेत्र',
  'widget.markdown-header.name': 'अनुभाग शीर्षलेख',
  'widget.markdown-header.description':
    'कस्टम टेक्स्ट के साथ Markdown शीर्षक (H1-H6)।',
  'metric.netPnL.name': 'नेट P&L',
  'metric.netPnL.description': 'सभी ट्रेड्स पर कुल लाभ और हानि',
  'metric.winRate.name': 'विन रेट',
  'metric.winRate.description': 'ट्रेड्स जीतने का प्रतिशत',
  'metric.profitFactor.name': 'प्रॉफिट फैक्टर',
  'metric.profitFactor.description': 'सकल लाभ और सकल हानि का अनुपात',
  'metric.sharpeRatio.name': 'शार्प रेशियो',
  'metric.sharpeRatio.description':
    'ट्रेड-स्तर शार्प रेशियो: औसत बंद-ट्रेड शुद्ध P&L नमूना P&L अस्थिरता से विभाजित',
  'metric.expectancy.name': 'एक्सपेक्टेंसी',
  'metric.expectancy.description': 'प्रति ट्रेड जीती या हारी औसत राशि',
  'metric.maxDrawdown.name': 'मैक्स ड्रॉडाउन',
  'metric.maxDrawdown.description':
    'पिछले रियलाइज़्ड P&L हाई से सबसे बड़ी बंद-ट्रेड ड्रॉडाउन राशि',
  'metric.bestDay.name': 'सबसे अच्छा दिन',
  'metric.bestDay.description': 'उच्चतम एकल दिवस P&L',
  'metric.largestWin.name': 'सबसे बड़ा विन',
  'metric.largestWin.description': 'सबसे बड़ी जीत ट्रेड',
  'metric.largestLoss.name': 'सबसे बड़ा लॉस',
  'metric.largestLoss.description': 'सबसे बड़ी हार ट्रेड',
  'metric.longestWinStreak.name': 'बेस्ट स्ट्रीक',
  'metric.longestWinStreak.description':
    'एग्जिट तारीख तक लॉन्ग सबसे लगातार जीत का सिलसिला',
  'metric.longestLossStreak.name': 'वर्स्ट स्ट्रीक',
  'metric.longestLossStreak.description':
    'एग्जिट तारीख तक लॉन्ग की लगातार हार का सिलसिला',
  'metric.numTrades.name': 'कुल ट्रेड्स',
  'metric.numTrades.description': 'बंद ट्रेड्स की कुल संख्या',
  'metric.numWinTrades.name': 'विनिंग ट्रेड्स',
  'metric.numWinTrades.description': 'जीतने वाले ट्रेड्स की संख्या',
  'metric.numLossTrades.name': 'लूज़िंग ट्रेड्स',
  'metric.numLossTrades.description': 'ट्रेड्स खोने की संख्या',
  'metric.avgWin.name': 'औसत विन',
  'metric.avgWin.description': 'ट्रेड्स जीतने का औसत लाभ',
  'metric.avgLoss.name': 'औसत लॉस',
  'metric.avgLoss.description': 'ट्रेड्स खोने का औसत नुकसान',
  'metric.avgRR.name': 'औसत RR (पेऑफ)',
  'metric.avgRR.description': 'मुद्रा-आधारित अदायगी अनुपात: औसत जीत/औसत हानि',
  'metric.avgRRRiskBased.name': 'औसत RR (R-आधारित)',
  'metric.avgRRRiskBased.description':
    'आर-गुणकों का उपयोग करके जोखिम-आधारित अनुपात: औसत जीतने वाला आर / औसत खोने वाला आर (स्टॉप/जोखिम डेटा की आवश्यकता है)',
  'metric.avgHoldTime.name': 'औसत होल्ड टाइम',
  'metric.avgHoldTime.description': 'सभी बंद ट्रेड्स में औसत समय',
  'metric.avgWinHoldTime.name': 'औसत विन होल्ड टाइम',
  'metric.avgWinHoldTime.description': 'ट्रेड्स को जीतने में औसत समय',
  'metric.avgLossHoldTime.name': 'औसत लॉस होल्ड टाइम',
  'metric.avgLossHoldTime.description': 'बंद ट्रेड्स खोने में औसत समय',
  'metric.avgWinnerHeat.name': 'औसत विनर हीट',
  'metric.avgWinnerHeat.description':
    'कॉन्फ़िगर MAE/MFE डिस्प्ले यूनिट का उपयोग करके, बंद ट्रेड्स जीतने के लिए औसत MAE',
  'metric.winnerMaeP90.name': 'विनर MAE P90',
  'metric.winnerMaeP90.description':
    'कॉन्फ़िगर किए गए MAE/MFE डिस्प्ले यूनिट का उपयोग करके, बंद ट्रेड्स जीतने के लिए 90वीं प्रतिशतक MAE सीमा',
  'metric.winnerMaeMedian.name': 'विनर MAE मीडियन',
  'metric.winnerMaeMedian.description':
    'कॉन्फ़िगर किए गए MAE/MFE डिस्प्ले यूनिट का उपयोग करके, बंद ट्रेड्स को जीतने के लिए माध्य MAE',
  'metric.avgLossHeat.name': 'औसत लॉस हीट',
  'metric.avgLossHeat.description':
    'कॉन्फ़िगर किए गए MAE/MFE डिस्प्ले यूनिट का उपयोग करके बंद ट्रेड्स को खोने का औसत MAE',
  'metric.winnerAvgMfe.name': 'विनर औसत MFE',
  'metric.winnerAvgMfe.description':
    'कॉन्फ़िगर MAE/MFE डिस्प्ले यूनिट का उपयोग करके, बंद ट्रेड्स जीतने के लिए औसत MFE',
  'metric.loserAvgMfe.name': 'लूज़र औसत MFE',
  'metric.loserAvgMfe.description':
    'कॉन्फ़िगर किए गए MAE/MFE डिस्प्ले यूनिट का उपयोग करके बंद ट्रेड्स को खोने का औसत MFE',
  'metric.winnerMfeP90.name': 'विनर MFE P90',
  'metric.winnerMfeP90.description':
    'कॉन्फ़िगर MAE/MFE डिस्प्ले यूनिट का उपयोग करके, बंद ट्रेड्स जीतने के लिए 90वीं प्रतिशतक MFE सीमा',
  'metric.loserMfeP90.name': 'लूज़र MFE P90',
  'metric.loserMfeP90.description':
    'कॉन्फ़िगर किए गए MAE/MFE डिस्प्ले यूनिट का उपयोग करके, बंद ट्रेड्स को खोने के लिए 90वीं प्रतिशतक MFE सीमा',
  'metric.timeInDrawdown.name': 'ड्रॉडाउन में समय',
  'metric.timeInDrawdown.description':
    'पिछले रियलाइज़्ड P&L हाई से नीचे बिताए गए समय का प्रतिशत',
  'metric.avgRecoveryTime.name': 'औसत पुनर्प्राप्ति समय',
  'metric.avgRecoveryTime.description':
    'रियलाइज़्ड ड्रॉडाउन के नए हाई तक रिकवर होने का औसत समय',
  'metric.longestDrawdown.name': 'सबसे लंबा ड्रॉडाउन',
  'metric.longestDrawdown.description':
    'रियलाइज़्ड ड्रॉडाउन एपिसोड में बिताया गया सबसे लंबा समय',
  'metric.drawdownEpisodes.name': 'ड्रॉडाउन एपिसोड',
  'metric.drawdownEpisodes.description':
    'मौजूदा फ़िल्टर किए गए ट्रेड सेट में रियलाइज़्ड ड्रॉडाउन अवधियों की संख्या',
  'metric.category.performance': 'प्रदर्शन',
  'metric.category.volume': 'वॉल्यूम',

  'onboarding.wizard.skip-aria': 'इस स्टेप को छोड़ दें',
  'onboarding.wizard.skip-onboarding': 'ऑनबोर्डिंग छोड़ें',

  'guide.skip-guide': 'गाइड छोड़ें',

  'account.linked-trades.setups': 'सेटअप्स',

  'account.create.title': 'अकाउंट बनाएं',
  'account.create.field.name': 'अकाउंट नाम',
  'account.create.field.name-desc': 'आपकी ट्रेडिंग के लिए एक अनोखा नाम अकाउंट',
  'account.create.placeholder.name': 'मेरी ट्रेडिंग अकाउंट',
  'account.create.field.type': 'अकाउंट प्रकार',
  'account.create.field.type-desc': 'ट्रेडिंग का प्रकार अकाउंट',
  'account.create.field.initial-balance': 'प्रारंभिक शेष',
  'account.create.field.initial-balance-desc':
    'अकाउंट बैलेंस प्रारंभ करना (वैकल्पिक, डिफ़ॉल्ट 0)',
  'account.create.field.live-balance': 'लाइव बैलेंस',
  'account.create.field.live-balance-desc': 'वर्तमान ब्रोकर अकाउंट बैलेंस',
  'account.create.field.creation-date': 'निर्माण तिथि',
  'account.create.field.creation-date-desc': 'जब अकाउंट बनाया गया था',
  'account.create.field.currency': 'मुद्रा',
  'account.create.field.currency-desc': 'प्रदर्शन के लिए अकाउंट की मूल मुद्रा',
  'account.create.field.drawdown-type': 'ड्रॉडाउन प्रकार',

  'account.create.field.drawdown-amount': 'ड्रॉडाउन राशि',
  'account.create.field.drawdown-amount-desc': 'अधिकतम ड्रॉडाउन सीमा',
  'account.create.field.profit-target-desc':
    'अकाउंट के लिए लाभ लक्ष्य निर्धारित करें',
  'account.create.field.monthly-cost': 'मासिक लागत',
  'account.create.field.monthly-cost-desc': 'सदस्यता शुल्क, प्लेटफ़ॉर्म लागत',
  'account.create.field.target-type': 'लक्ष्य प्रकार',
  'account.create.field.target-type-desc': 'निरपेक्ष या प्रतिशत',
  'account.create.field.target-percent': 'लक्ष्य (%)',
  'account.create.field.target-dollar': 'लक्ष्य ($)',
  'account.create.field.target-percent-desc': 'प्रतिशत लाभ लक्ष्य',
  'account.create.field.target-dollar-desc': 'डॉलर राशि लक्ष्य',
  'account.create.field.target-date': 'लक्ष्य दिनांक (वैकल्पिक)',
  'account.create.field.target-date-desc': 'लाभ लक्ष्य प्राप्त करने की तिथि',
  'account.create.type.demo': 'डेमो',
  'account.create.type.evaluation': 'इवैल्यूएशन',
  'account.create.type.funded': 'फंडेड',
  'account.create.success': 'अकाउंट "{name}" सफलतापूर्वक बनाया गया',
  'account.create.error.name-required': 'अकाउंट नाम आवश्यक है',
  'account.create.error.name-exists':
    '"{name}" नाम का एक अकाउंट पहले से मौजूद है',
  'account.create.error.rule-incomplete':
    'हर सक्रिय नियम को शून्य से बड़ा मान चाहिए',
  'account.create.error.balance-negative':
    'प्रारंभिक संतुलन ऋणात्मक नहीं हो सकता',
  'account.create.error.invalid-live-balance': 'लाइव बैलेंस अमान्य है',
  'account.create.error.drawdown-required':
    'ड्रॉडाउन प्रकार सक्षम होने पर ड्रॉडाउन राशि की आवश्यकता होती है',
  'account.create.error.profit-target-required':
    'लाभ लक्ष्य सक्षम होने पर लाभ लक्ष्य राशि की आवश्यकता होती है',
  'account.create.error.invalid-date': 'अमान्य निर्माण दिनांक',
  'account.create.error.future-date': 'निर्माण तिथि भविष्य में नहीं हो सकती',
  'account.create.error.cost-negative': 'मासिक लागत ऋणात्मक नहीं हो सकती',
  'account.create.error.service-unavailable':
    'अकाउंट सेवा उपलब्ध नहीं है. कृपया पुन: प्रयास करें।',
  'account.create.error.fix-target-date':
    'कृपया अकाउंट बनाने से पहले लाभ लक्ष्य दिनांक त्रुटि को ठीक करें',
  'account.create.error.invalid-target-date': 'अमान्य लाभ लक्ष्य दिनांक',
  'account.create.error.failed': 'अकाउंट बनाने में विफल: {error}',
  'account.add-event.title': 'जमा/निकासी जोड़ें',
  'account.add-event.field.type': 'लेनदेन प्रकार',
  'account.add-event.field.type-desc': 'जमा या निकासी',
  'account.add-event.field.amount': 'मात्रा',
  'account.add-event.field.amount-desc': '{currency} में राशि',
  'account.add-event.field.date': 'तारीख',
  'account.add-event.field.date-desc': 'कार्यवाही की तिथि',
  'account.add-event.field.description': 'विवरण (वैकल्पिक)',
  'account.add-event.field.description-desc': 'अतिरिक्त टिप्पणी',
  'account.add-event.type.deposit': 'जमा',
  'account.add-event.type.withdrawal': 'निकासी',
  'account.add-event.placeholder.deposit': 'मैन्युअल जमा',
  'account.add-event.placeholder.withdrawal': 'मैन्युअल निकासी',
  'account.add-event.button.add': 'लेन-देन जोड़ें',
  'account.add-event.button.adding': 'जोड़ा जा रहा है...',
  'account.add-event.success': '{amount} का {type} सफलतापूर्वक जोड़ा गया',
  'account.add-event.error.amount-required': 'राशि 0 से अधिक होनी चाहिए',
  'account.add-event.error.date-required': 'दिनांक आवश्यक है',
  'account.add-event.error.invalid-date': 'अमान्य दिनांक प्रारूप',
  'account.add-event.error.future-date':
    'लेन-देन की तारीख भविष्य में नहीं हो सकती',
  'account.add-event.error.failed': 'लेन-देन जोड़ने में त्रुटि: {error}',
  'account.add-event.confirm.title': 'लेन-देन की पुष्टि करें',
  'account.add-event.confirm.message':
    '{amount} में से {type} को {date} पर अकाउंट "{account}" में जोड़ें?',
  'account.add-event.confirm.description': 'विवरण: {description}',
  'account.risk-metrics.loading': 'जोखिम मेट्रिक्स लोड हो रहा है...',
  'account.risk-metrics.title': 'रिस्क मैनेजमेंट',
  'account.risk-metrics.drawdown-used': 'ड्रॉडाउन सीमा का उपयोग किया गया',
  'account.risk-metrics.profit-target': 'लाभ लक्ष्य',
  'account.risk-metrics.status.breached': 'का उल्लंघन',
  'account.risk-metrics.status.achieved': 'हासिल किया',
  'account.risk-metrics.status.in-progress': 'प्रगति पर है',
  'account.risk-metrics.not-set': 'सेट नहीं',
  'account.risk-metrics.no-drawdown': 'कोई ड्रॉडाउन सीमा निर्धारित नहीं है',
  'account.risk-metrics.no-profit-target': 'कोई लाभ लक्ष्य निर्धारित नहीं',
  'account.risk-metrics.label.used': 'इस्तेमाल किया गया:',
  'account.risk-metrics.label.limit': 'सीमा:',
  'account.risk-metrics.label.remaining': 'शेष:',
  'account.risk-metrics.label.progress': 'प्रगति:',
  'account.risk-metrics.label.target': 'लक्ष्य:',
  'account.risk-metrics.label.target-date': 'नियोजित तारीख:',
  'account.edit-event.title': '{type} संपादित करें',
  'account.edit-event.field.type': 'लेनदेन प्रकार',
  'account.edit-event.field.type-desc': 'संपादन करते समय बदला नहीं जा सकता',
  'account.edit-event.field.amount': 'मात्रा',
  'account.edit-event.field.amount-desc': '{currency} में राशि',
  'account.edit-event.field.date': 'तारीख',
  'account.edit-event.field.date-desc': 'कार्यवाही की तिथि',
  'account.edit-event.field.description': 'विवरण (वैकल्पिक)',
  'account.edit-event.field.description-desc': 'अतिरिक्त टिप्पणी',
  'account.edit-event.button.save': 'परिवर्तन सहेजें',
  'account.edit-event.button.saving': 'सहेजा जा रहा है...',
  'account.edit-event.button.delete': '{type} हटाएं',
  'account.edit-event.button.deleting': 'हटाया जा रहा है...',
  'account.edit-event.success.update': '{type} सफलतापूर्वक अपडेट किया गया',
  'account.edit-event.success.delete': '{type} सफलतापूर्वक हटा दिया गया',
  'account.edit-event.error.update': 'लेन-देन अद्यतन करने में त्रुटि: {error}',
  'account.edit-event.error.delete': 'लेन-देन हटाने में त्रुटि: {error}',
  'account.edit-event.delete-confirm.title': '{type} हटाएं',
  'account.edit-event.delete-confirm.message':
    'क्या आप वाकई {amount} के इस {type} को {date} से हटाना चाहते हैं?',
  'account.edit-event.delete-confirm.warning':
    'इस एक्शन को वापस नहीं किया जा सकता।',
  'account.edit.title': 'अकाउंट संपादित करें',
  'account.edit.field.name': 'अकाउंट नाम',
  'account.edit.field.name-desc': 'इस अकाउंट का अनोखा नाम',
  'account.edit.placeholder.name': 'उदाहरण के लिए, मेरी ट्रेडिंग अकाउंट',
  'account.edit.field.type': 'अकाउंट प्रकार',
  'account.edit.field.type-desc': 'ट्रेडिंग का प्रकार अकाउंट',
  'account.edit.type.demo': 'डेमो',
  'account.edit.type.evaluation': 'इवैल्यूएशन',
  'account.edit.type.funded': 'फंडेड',
  'account.edit.field.initial-balance': 'प्रारंभिक शेष',
  'account.edit.field.initial-balance-desc': 'अकाउंट बैलेंस प्रारंभ हो रहा है',
  'account.edit.field.live-balance': 'लाइव बैलेंस',
  'account.edit.field.live-balance-desc': 'वर्तमान ब्रोकर अकाउंट बैलेंस',
  'account.edit.field.creation-date': 'निर्माण तिथि',
  'account.edit.field.creation-date-desc': 'जब अकाउंट बनाया गया था',
  'account.edit.field.currency': 'मुद्रा',
  'account.edit.field.currency-desc': 'प्रदर्शन के लिए अकाउंट की मूल मुद्रा',
  'account.edit.field.drawdown-type': 'ड्रॉडाउन प्रकार',

  'account.edit.field.drawdown-amount': 'ड्रॉडाउन राशि',
  'account.edit.field.drawdown-amount-desc':
    'आरंभिक शेष से अधिकतम हानि की अनुमति',
  'account.edit.field.manual-snapshots': 'मैनुअल ड्रॉडाउन स्नैपशॉट',
  'account.edit.field.manual-snapshots-desc':
    'EOD ट्रेलिंग ड्रॉडाउन गणना के लिए दैनिक बैलेंस स्नैपशॉट प्रबंधित करें',
  'account.edit.field.profit-target-desc':
    'अकाउंट के लिए लाभ लक्ष्य निर्धारित करें',
  'account.edit.field.monthly-cost': 'मासिक लागत',
  'account.edit.field.monthly-cost-desc': 'सदस्यता शुल्क, प्लेटफ़ॉर्म लागत',
  'account.copy-trading.title': 'कॉपी ट्रेडिंग',
  'account.copy-trading.description':
    'ऐतिहासिक प्रतिलिपि अवधियों का उपयोग करके इस अकाउंट के प्रदर्शन को किसी अन्य अकाउंट से प्राप्त करें।',
  'account.copy-trading.enable': 'यह अकाउंट दूसरे अकाउंट की प्रतिलिपि बनाता है',
  'account.copy-trading.existing-trades-warning':
    'इस अकाउंट में पहले से ही प्रत्यक्ष ट्रेड्स है। वे बने रहेंगे, और चयनित प्रारंभ दिनांक से कॉपी किया गया ट्रेड्स जोड़ा जाएगा।',
  'account.copy-trading.base-account': 'बेस अकाउंट',
  'account.copy-trading.base-account-desc':
    'केवल समान-मुद्रा गैर-प्रतिलिपि अकाउंट्स का चयन किया जा सकता है।',
  'account.copy-trading.base-account-placeholder': 'आधार अकाउंट चुनें',
  'account.copy-trading.multiplier': 'गुणक',
  'account.copy-trading.multiplier-desc': 'अनुमत सीमा: 0.1x से 100x',
  'account.copy-trading.all-history': 'सभी ऐतिहासिक ट्रेड्स की प्रतिलिपि बनाएँ',
  'account.copy-trading.start-date': 'दिनांक से कॉपी करें',
  'account.copy-trading.history': 'इतिहास कॉपी करें',
  'account.copy-trading.error.base-required':
    'कॉपी ट्रेडिंग के लिए आधार अकाउंट चुनें।',
  'account.copy-trading.error.multiplier-range':
    'कॉपी ट्रेडिंग गुणक 0.1x और 100x के बीच होना चाहिए।',
  'account.copy-trading.error.start-date-required':
    'कॉपी ट्रेडिंग आरंभ तिथि चुनें।',
  'account.copy-trading.error.base-account-is-copied':
    'यह अकाउंट पहले से ही आधार अकाउंट के रूप में उपयोग किया जाता है और किसी अन्य अकाउंट की प्रतिलिपि नहीं बना सकता है।',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'यह अकाउंट वर्तमान में एक अन्य प्रति अकाउंट का आधार है।',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'आधार अकाउंट्स की प्रतिलिपि अकाउंट्स भी नहीं बनाई जा सकती।',
  'account.edit.field.target-type': 'लक्ष्य प्रकार',
  'account.edit.field.target-type-desc': 'निरपेक्ष या प्रतिशत',
  'account.edit.field.target-percent': 'लक्ष्य (%)',
  'account.edit.field.target-dollar': 'लक्ष्य ($)',
  'account.edit.field.target-percent-desc': 'प्रतिशत लाभ लक्ष्य',
  'account.edit.field.target-dollar-desc': 'डॉलर राशि लक्ष्य',
  'account.edit.field.target-date': 'लक्ष्य दिनांक (वैकल्पिक)',
  'account.edit.field.target-date-desc': 'लाभ लक्ष्य प्राप्त करने की तिथि',
  'account.edit.button.show-snapshots':
    'स्नैपशॉट प्रबंधक दिखाएँ ({count} रिकॉर्ड किया गया)',
  'account.edit.button.hide-snapshots':
    'स्नैपशॉट मैनेजर छुपाएं ({count} रिकॉर्ड किया गया)',
  'account.edit.delete-warning':
    'यह एक स्थायी कार्रवाई है जिसे पूर्ववत नहीं किया जा सकता!',
  'account.drawdown.none': 'कोई नहीं',
  'account.drawdown.fixed': 'फिक्स्ड',
  'account.drawdown.eod-trailing': 'ईओडी ट्रेलिंग',
  'account.drawdown.manual': 'नियमावली',
  'account.profit-target.enable': 'लाभ लक्ष्य सक्षम करें',
  'account.profit-target.type.absolute': 'पूर्ण राशि',
  'account.profit-target.type.percentage': 'को PERCENTAGE',
  'account.create.button.creating': 'बनाया जा रहा है...',
  'account.create.button.create': 'अकाउंट बनाएं',
  'account.edit.button.saving': 'सहेजा जा रहा है...',
  'account.edit.button.save': 'परिवर्तन सहेजें',
  'account.edit.button.delete': 'अकाउंट हटाएं',
  'account.edit.button.delete-name': '"{name}" हटाएं',
  'account.edit.modal.update-notes.title': 'लिंक किए गए नोट्स अपडेट करें?',
  'account.edit.modal.update-notes.message':
    'नाम बदलने से "{oldName}" को संदर्भित करने वाले सभी नोट्स को "{newName}" में अपडेट कर दिया जाएगा। डेटा को सुसंगत रखने के लिए यह आवश्यक है।',
  'account.edit.modal.update-notes.yes': 'ठीक है (नोट अपडेट करें)',
  'account.edit.modal.update-notes.no': 'पुराना नाम रखें',
  'account.edit.modal.update-notes.cancel': 'कार्रवाई रद्द करें',
  'account.edit.modal.change-date.title': 'निर्माण दिनांक बदलें',
  'account.edit.modal.change-date.message':
    'आप अकाउंट "{account}" की निर्माण तिथि को {oldDate} से {newDate} में बदलने वाले हैं।',
  'account.edit.modal.change-date.warning':
    'यह प्रारंभिक जमा लेनदेन तिथि को अपडेट कर देगा और अकाउंट आयु गणना, मासिक बिलिंग चक्र और अन्य तिथि-आधारित मैट्रिक्स को प्रभावित कर सकता है।',

  'account.edit.modal.change-date.confirm': 'निर्माण दिनांक अद्यतन करें',
  'account.edit.modal.change-balance.title': 'आरंभिक शेष बदलें',
  'account.edit.modal.change-balance.message':
    'आप प्रारंभिक शेष राशि को {oldBalance} से {newBalance} में बदलने वाले हैं।',

  'account.edit.modal.change-balance.info':
    'यह सभी शेष गणनाओं, P&L प्रतिशत, ड्रॉडाउन गणनाओं और लेनदेन इतिहास को प्रभावित करेगा।',
  'account.edit.modal.change-balance.info2':
    'वर्तमान शेष राशि की गणना नए प्रारंभिक शेष और सभी ट्रेड P&L के आधार पर की जाएगी।',
  'account.edit.modal.change-balance.info3':
    'यह परिवर्तन अकाउंट मेट्रिक्स और ऐतिहासिक डेटा सटीकता पर महत्वपूर्ण प्रभाव डाल सकता है।',
  'account.edit.modal.change-balance.confirm': 'प्रारंभिक शेष अद्यतन करें',
  'account.edit.modal.delete.title': 'अकाउंट हटाएं',
  'account.edit.modal.delete.question':
    'क्या आप वाकई अकाउंट "{name}" को स्थायी रूप से हटाना चाहते हैं?',

  'account.edit.modal.delete.will': 'यह क्रिया होगी:',
  'account.edit.modal.delete.item1': 'सभी अकाउंट मेटाडेटा और सेटिंग्स हटाएं',
  'account.edit.modal.delete.item2':
    'सभी लिंक किए गए ट्रेड्स से अकाउंट संदर्भ हटाएं',
  'account.edit.modal.delete.item3':
    'नोट्स से स्वतः-जनरेट किए गए अकाउंट टैग हटाएँ',
  'account.edit.modal.delete.delete-associated-trades':
    'साथ ही इस अकाउंट से जुड़े सभी ट्रेड्स को मेरी तिजोरी से हटा दें',
  'common.note-label': 'नोट:',

  'common.backups-label': 'बैकअप:',
  'account.edit.error.name-required': 'अकाउंट नाम आवश्यक है',
  'account.edit.error.name-exists': 'अकाउंट "{name}" पहले से मौजूद है',
  'account.edit.error.creation-date-required': 'निर्माण दिनांक आवश्यक है',
  'account.edit.error.balance-required':
    'प्रारंभिक संतुलन ऋणात्मक नहीं हो सकता',
  'account.edit.error.invalid-live-balance': 'लाइव बैलेंस अमान्य है',
  'account.edit.error.drawdown-required': 'ड्रॉडाउन राशि 0 से अधिक होनी चाहिए',
  'account.edit.error.future-date': 'निर्माण तिथि भविष्य में नहीं हो सकती',
  'account.edit.error.update-failed':
    'अकाउंट को अपडेट करने में त्रुटि: {error}',
  'account.edit.error.service-unavailable': 'अकाउंट सेवा उपलब्ध नहीं है',
  'account.edit.error.delete-failed': 'अकाउंट को हटाने में त्रुटि: {error}',
  'account.edit.success.updated': 'अकाउंट "{name}" सफलतापूर्वक अपडेट किया गया',
  'account.edit.success.updated-with-references':
    'अकाउंट को "{oldName}" से "{newName}" में अपडेट किया गया और सभी नोट संदर्भ अपडेट किए गए',
  'account.edit.success.deleted': 'अकाउंट "{name}" सफलतापूर्वक हटा दिया गया',
  'button.next': 'अगला',
  'button.discard': 'त्यागें',
  'guide.scroll-to-target.title': 'गाइड जारी रखने के लिए स्क्रॉल करें',
  'guide.scroll-to-target.description':
    'अगला कदम ऑफस्क्रीन है। आगे बढ़ने के लिए स्क्रॉल करें, या Journalit को आपको वहां ले जाने दें।',
  'guide.scroll-to-target.description-up':
    'अगला चरण पृष्ठ पर ऊपर है. आगे बढ़ने के लिए ऊपर स्क्रॉल करें, या Journalit को आपको वहां ले जाने दें।',
  'guide.scroll-to-target.description-down':
    'अगला चरण पृष्ठ पर नीचे है. आगे बढ़ने के लिए नीचे स्क्रॉल करें, या Journalit को आपको वहां ले जाने दें।',
  'guide.scroll-to-target.button': 'मुझे दिखाओ',
  'templateEditor.loading': 'लेआउट लोड हो रहा है...',
  'templateEditor.mode.preview': 'प्रिव्यू',
  'templateEditor.mode.editor': 'संपादक',
  'templateEditor.built-in-badge': '(अंतर्निहित)',
  'templateEditor.built-in-notice':
    'अंतर्निहित लेआउट संपादित नहीं किए जा सकते. इस लेआउट को डुप्लिकेट करें या अनुकूलित करने के लिए एक नया बनाएं।',
  'templateEditor.unsaved-changes': 'सहेजे न गए परिवर्तन',
  'templateEditor.field.template-name': 'लेआउट का नाम',
  'templateEditor.field.widgets': 'विजेट्स ({count})',
  'templateEditor.button.add-widget': '+ विजेट जोड़ें',
  'templateEditor.button.widget-library-docs': 'विजेट लाइब्रेरी डॉक्स',
  'templateEditor.widget.locked': 'बंद',
  'templateEditor.widget.select-placeholder': 'एक विजेट चुनें...',
  'templateEditor.widget.header-text-placeholder': 'हेडर टेक्स्ट...',
  'templateEditor.widget.markdown-zone-text-label': 'पूर्व निर्धारित पाठ',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'नए रिव्यू नोट्स में सम्मिलित करने के लिए टेक्स्ट...',
  'templateEditor.widget.page-size': 'पेज का आकार:',
  'templateEditor.widget.show-rating-column': 'रेटिंग कॉलम दिखाएँ',
  'templateEditor.widget.demon-tracker.tracking-method':
    'गलतियों को इसके द्वारा ट्रैक करें:',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    'ट्रेड घटनाएँ',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    'गलती के साथ टैग किया गया प्रत्येक ट्रेड मायने रखता है।',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days':
    'ट्रेडिंग दिन',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    'ट्रेड और दैनिक रिव्यू गलतियों को मर्ज कर दिया जाता है और प्रति ट्रेडिंग दिन में एक बार गिना जाता है।',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    'दैनिक रिव्यू प्रविष्टियाँ',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    'दैनिक रिव्यूज़ गिनती में केवल गलतियाँ दर्ज की गईं।',
  'templateEditor.widget.demon-tracker.stop-after':
    'इसके बाद ट्रेडिंग बंद करें:',
  'notice.error.template-save-failed': 'लेआउट सहेजने में विफल',
  'builder.sidebar.title': 'लेआउट बिल्डर',
  'builder.sidebar.section.trade': 'ट्रेड',
  'builder.sidebar.section.drc': 'DRC',
  'builder.sidebar.section.weekly': 'साप्ताहिक',
  'builder.sidebar.section.monthly': 'मासिक',
  'builder.sidebar.section.quarterly': 'त्रैमासिक',
  'builder.sidebar.section.yearly': 'सालाना',
  'builder.sidebar.section.library': 'पुस्तकालय',
  'builder.sidebar.new-item': 'नया {title}',
  'builder.sidebar.coming-soon': 'जल्द आ रहा है',
  'builder.sidebar.built-in': 'में निर्मित',
  'builder.sidebar.default-template': 'डिफ़ॉल्ट लेआउट',
  'builder.sidebar.set-as-default': 'डिफाल्ट के रूप में सेट',
  'builder.sidebar.duplicate': 'डुप्लिकेट',
  'builder.sidebar.delete': 'हटाएँ',
  'builder.sidebar.no-templates': 'अभी तक कोई लेआउट नहीं',
  'builder.sidebar.share-template': 'लेआउट साझा करें',
  'builder.sidebar.new-template-name': 'नया {type} लेआउट',
  'builder.sidebar.copy-suffix': '(प्रतिलिपि)',
  'notice.default-trade-template-updated':
    'डिफ़ॉल्ट ट्रेड लेआउट अपडेट किया गया',
  'notice.trade-template-duplicated': 'ट्रेड लेआउट डुप्लिकेट किया गया',
  'notice.trade-template-deleted': 'ट्रेड लेआउट हटा दिया गया',
  'notice.error.create-template': 'लेआउट बनाने में विफल',
  'notice.error.duplicate-template': 'लेआउट का डुप्लिकेट बनाने में विफल',
  'notice.error.delete-template': 'लेआउट हटाने में विफल',
  'account.weight-legend.aria-label': 'अकाउंट प्रकार वितरण किंवदंती',
  'account.weight-legend.item-aria-label': '{name}: {percent}',
  'account.transaction.deposit': 'जमा',
  'account.transaction.withdrawal': 'निकासी',
  'account.transaction.click-to-edit':
    'इस लेनदेन को संपादित करने या हटाने के लिए क्लिक करें',
  'account.deposits-withdrawals.title': 'जमा एवं निकासी ({count})',
  'account.deposits-withdrawals.empty':
    'कोई मैन्युअल जमा या निकासी दर्ज नहीं की गई।',
  'account.deposits-withdrawals.empty-sub':
    'अपना पहला लेनदेन जोड़ने के लिए हेडर में + बटन पर क्लिक करें।',
  'settings.reset.modal.title': 'सेटिंग्स को डिफ़ॉल्ट पर रीसेट करें?',
  'settings.reset.modal.explanation':
    'यह सभी प्लगइन सेटिंग्स को उनके डिफ़ॉल्ट मानों पर रीसेट कर देगा। यह भी शामिल है:',
  'settings.reset.modal.item-custom-options':
    'सभी कस्टम विकल्प (सिंबल्स, सेटअप्स, गलतियाँ)',
  'settings.reset.modal.item-account-settings': 'अकाउंट सेटिंग्स और मेटाडेटा',
  'settings.reset.modal.item-dashboard-layouts': 'डैशबोर्ड लेआउट',
  'settings.reset.modal.item-symbol-mappings': 'प्रतीक मानचित्रण',
  'settings.reset.modal.item-csv-templates': 'CSV टेम्पलेट्स',
  'settings.reset.modal.item-other': 'अन्य सभी अनुकूलन',
  'settings.reset.modal.backup-note': 'रीसेट से पहले एक बैकअप बनाया जाएगा.',
  'settings.reset.modal.warning':
    'इस क्रिया को पूर्ववत नहीं किया जा सकता (बैकअप से पुनर्स्थापित करने के अलावा)।',
  'settings.reset.backup-failed.title': 'बैकअप विफल',
  'settings.reset.backup-failed.message':
    'आपके वर्तमान सेटिंग्स का बैकअप बनाने में असमर्थ.',
  'settings.reset.backup-failed.warning':
    'यदि आप रीसेट के साथ आगे बढ़ते हैं, तो आप अपने वर्तमान सेटिंग्स को पुनर्स्थापित नहीं कर पाएंगे।',
  'notice.settings-reset-with-backup':
    'सेटिंग्स डिफ़ॉल्ट पर रीसेट हो गया। एक बैकअप बनाया गया. सभी परिवर्तन लागू करने के लिए Obsidian को पुनरारंभ करें।',
  'notice.settings-reset-no-backup':
    'सेटिंग्स डिफ़ॉल्ट पर रीसेट हो गया। कोई बैकअप नहीं बनाया गया. सभी परिवर्तन लागू करने के लिए Obsidian को पुनरारंभ करें।',
  'home.quick-links.hide': 'त्वरित लिंक छिपाएँ',
  'home.quick-links.add-trade': 'ट्रेड जोड़ें',
  'home.quick-links.trade-log': 'ट्रेड लॉग',
  'home.quick-links.trading-dashboard': 'ट्रेडिंग डैशबोर्ड',
  'home.quick-links.account-dashboard': 'अकाउंट्स',
  'home.quick-links.todays-drc': 'आज का DRC',
  'home.quick-links.weekly-review': 'इस सप्ताह रिव्यू',
  'home.quick-links.monthly-review': 'इस माह रिव्यू',
  'home.quick-links.quarterly-review': 'यह तिमाही रिव्यू',
  'home.quick-links.yearly-review': 'इस वर्ष रिव्यू',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'लेआउट बिल्डर',
  'home.quick-links.navigation-sidebar': 'नेविगेशन साइडबार',
  'home.quick-links.session-mode': 'सेशन मोड',
  'home.quick-links.move-above': 'विजेट्स के ऊपर त्वरित लिंक ले जाएँ',
  'home.quick-links.move-below': 'विजेट्स के नीचे त्वरित लिंक ले जाएँ',
  'home.widget-selector.title': 'होम में जोड़ें',
  'home.widget-selector.section.widgets': 'विजेट्स',
  'home.widget-selector.section.quick-links': 'त्वरित लिंक',
  'home.widget-selector.restore': 'पुनर्स्थापित करें',
  'home.widget-selector.add-shortcut': 'खाता/सेटअप शॉर्टकट जोड़ें',
  'home.widget-selector.hint.navigate': '↑↓नेविगेट करें',
  'home.widget-selector.hint.select': '↵ चयन करें',
  'home.widget-selector.hint.close': 'Esc बंद करें',
  'home.period.month': 'महीना',
  'home.period.quarter': 'क्वार्टर',
  'home.period.year': 'साल',
  'home.period.lifetime': 'ऑल टाइम',

  'home.aria.filter-trade-types': 'फ़िल्टर ट्रेड प्रकार',
  'home.aria.open-settings': 'Journalit सेटिंग्स खोलें',
  'home.aria.save-layout': 'लेआउट सहेजें',
  'home.aria.customize': 'अनुकूलित करें',
  'home.button.add-widget': 'विजेट जोड़ें',

  'home.greeting.welcome': 'Journalit में आपका स्वागत है!',
  'home.greeting.hey': 'नमस्ते',
  'home.greeting.nightowl': 'अरे नाइट आउल',
  'home.greeting.still-up': 'अभी भी जागे हो?',
  'home.greeting.late-night': 'देर रात का सत्र?',
  'home.greeting.midnight-oil': 'देर रात तक जागे हो?',
  'home.greeting.good-morning': 'शुभ प्रभात',
  'home.greeting.rise-and-shine': 'उठो, सुबह हो गई',
  'home.greeting.morning-trader': 'सुबह के ट्रेडर',
  'home.greeting.ready-conquer': 'दिन जीतने के लिए तैयार हैं?',
  'home.greeting.fresh-start': 'नयी शुरुआत',
  'home.greeting.good-afternoon': 'शुभ दोपहर',
  'home.greeting.day-going-well': 'आशा है आपका दिन अच्छा गुजरेगा',
  'home.greeting.afternoon-checkin': 'दोपहर का चेक-इन',
  'home.greeting.midday-momentum': 'मध्याह्न गति',
  'home.greeting.hows-it-going': 'कैसा चल रहा है?',
  'home.greeting.good-evening': 'शुभ संध्या',
  'home.greeting.winding-down': 'दिन समेट रहे हो?',
  'home.greeting.evening-review': 'शाम का रिव्यू',
  'home.greeting.how-did-today-go': 'आज का दिन कैसा बीता?',
  'home.greeting.time-to-reflect': 'रिव्यू का समय',
  'home.greeting.welcome-back': 'वापस स्वागत है',
  'home.greeting.name-placeholder': 'आपका नाम',
  'home.greeting.edit-name-aria': '{name}। प्रदर्शन नाम संपादित करें',
  'home.greeting.hey-there': 'नमस्ते',
  'home.greeting.good-to-see-you': 'आपको देखकर अच्छा लगा',
  'home.subtitle.first-time': 'आइए आपकी ट्रेडिंग यात्रा शुरू करें',
  'home.subtitle.see-how-doing': 'आइये देखें आप कैसा कर रहे हैं',
  'home.subtitle.elevate-trading': 'अपनी ट्रेडिंग को ऊपर उठाने का समय',
  'home.subtitle.journey-continues': 'आपकी ट्रेडिंग यात्रा जारी है',
  'home.subtitle.check-progress': 'आइए आपकी प्रगति की जाँच करें',
  'home.subtitle.ready-elevate':
    'क्या आप अपनी ट्रेडिंग बढ़ाने के लिए तैयार हैं?',
  'home.subtitle.agenda-today': 'आज एजेंडे में क्या है?',
  'home.subtitle.trading-going': 'आपकी ट्रेडिंग कैसी चल रही है?',
  'home.grid.error.title': 'ग्रिड लेआउट त्रुटि',
  'home.grid.error.message': 'त्रुटि: {error}',
  'home.grid.error.retry': 'पुन: प्रयास करें',
  'home.grid.widget.remove-aria': 'विजेट निकालें',
  'home.grid.widget.unknown-type': 'अज्ञात विजेट प्रकार: {widgetId}',
  'home.widget.unreviewed.all-reviewed': 'सभी ट्रेड्स रिव्यूड',
  'home.widget.unreviewed.title-review': 'रिव्यू के लिए ट्रेड लॉग खोलें',
  'home.widget.unreviewed.need-review.one':
    '{count} ट्रेड को रिव्यू की आवश्यकता है',
  'home.widget.unreviewed.need-review.few':
    '{count} ट्रेड्स को रिव्यू की आवश्यकता है',
  'home.widget.unreviewed.need-review.many':
    '{count} ट्रेड्स को रिव्यू की आवश्यकता है',
  'home.widget.unreviewed.need-review.other':
    '{count} ट्रेड्स को रिव्यू की आवश्यकता है',
  'home.widget.unreviewed.today': '{count} आज',
  'home.widget.unreviewed.this-week': 'इस सप्ताह {count}',
  'home.widget.embedded-note.title': 'एंबेडेड नोट',
  'home.widget.embedded-note.select-note': 'एक नोट चुनें',
  'home.widget.embedded-note.search-placeholder': 'नोट्स खोजें...',
  'home.widget.embedded-note.no-notes': 'कोई नोट नहीं मिला',

  'home.widget.embedded-note.open-note': 'नोट खोलने के लिए क्लिक करें',
  'home.widget.embedded-note.change-note': 'नोट बदलें',
  'home.widget.embedded-note.error.not-found': 'फ़ाइल नहीं मिली: {path}',
  'home.widget.embedded-note.error.load-failed':
    'नोट सामग्री लोड करने में विफल',
  'home.widget.embedded-note.error.deleted': 'स्रोत फ़ाइल हटा दी गई',
  'home.widget.goals-progress.type.pnl': 'P&L लक्ष्य',
  'home.widget.goals-progress.type.pnl-desc': 'एक अवधि के लिए लाभ/हानि लक्ष्य',
  'home.widget.goals-progress.type.trades-logged': 'ट्रेड गणना',
  'home.widget.goals-progress.type.trades-logged-desc': 'लाइफटाइम ट्रेड गिनती',
  'home.widget.goals-progress.type.win-rate': 'विन रेट',
  'home.widget.goals-progress.type.win-rate-desc': 'जीत का प्रतिशत लक्ष्य',
  'home.widget.goals-progress.period.daily': 'दैनिक',
  'home.widget.goals-progress.period.weekly': 'साप्ताहिक',
  'home.widget.goals-progress.period.monthly': 'मासिक',
  'home.widget.goals-progress.period-label.today': 'आज',
  'home.widget.goals-progress.period-label.this-week': 'इस सप्ताह',
  'home.widget.goals-progress.period-label.this-month': 'इस महीने',
  'home.widget.goals-progress.period-label.total': 'कुल',
  'home.widget.goals-progress.trades-count': '{count} ट्रेड्स',
  'home.widget.goals-progress.set-goal': 'लक्ष्य निर्धारित करें',
  'home.widget.goals-progress.target': 'टारगेट',
  'home.widget.goals-progress.tracks-lifetime':
    'जीवनकाल का कुल योग ट्रैक करता है',
  'home.widget.goals-progress.use-r-multiples': 'आर-गुणकों का प्रयोग करें',
  'home.widget.goals-progress.account-aware': 'अकाउंट-जागरूक लक्ष्य',
  'home.widget.goals-progress.no-target-selected':
    'चयनित अकाउंट के लिए कोई लक्ष्य नहीं',
  'home.widget.goals-progress.configured-for':
    '{accounts} के लिए कॉन्फ़िगर किया गया',
  'home.widget.goals-progress.account-scope': 'अकाउंट दायरा',
  'home.widget.goals-progress.add-account': 'अकाउंट जोड़ें',
  'home.widget.goals-progress.click-to-set':
    'लक्ष्य निर्धारित करने के लिए क्लिक करें',
  'home.widget.goals-progress.header.pnl': 'P&L लक्ष्य',
  'home.widget.goals-progress.header.trades': 'ट्रेड्स लक्ष्य',
  'home.widget.goals-progress.header.win-rate': 'विन रेट लक्ष्य',
  'home.widget.goals-progress.of-target': '{target} {period} का',
  'home.widget.goals-progress.complete-100': '100% पूर्ण',
  'home.widget.goals-progress.complete-percent': '{percent}% पूर्ण',
  'home.widget.goals-progress.goal-reached': 'लक्ष्य प्राप्त हुआ',
  'home.widget.goals-progress.aria.save-goal': 'लक्ष्य सहेजें',
  'home.widget.goals-progress.aria.set-goal': 'लक्ष्य निर्धारित करो',
  'home.widget.goals-progress.aria.change-goal':
    'लक्ष्य बदलने के लिए क्लिक करें',
  'home.widget.best-hours.title': 'सर्वोत्तम घंटे',
  'home.widget.best-hours.no-data': 'कोई ट्रेड डेटा नहीं',
  'home.widget.best-hours.period-aria':
    '{label}: {pnl} औसत P&L प्रति ट्रेड, {count} ट्रेड्स',
  'home.widget.best-hours.trades-count': '{count} ट्रेड्स',
  'home.widget.best-hours.win-rate': '{rate}% जीत',
  'home.widget.best-hours.win-rate-na': 'विन रेट अनुपलब्ध',
  'home.widget.best-hours.days-count': '{count} दिन',
  'home.widget.best-hours.avg-per-trade': 'औसत/ट्रेड',

  'home.widget.best-hours.hidden': 'छिपा हुआ',
  'home.widget.best-hours.hidden-detail': 'गोपनीयता मोड',
  'home.widget.best-hours.no-positive-window': 'कोई सकारात्मक खिड़की नहीं',
  'home.widget.best-hours.insufficient-history': 'अधिक डेटा चाहिए',
  'home.widget.best-hours.sample-requirement': '{count}/2 नमूना विंडो',
  'home.widget.best-hours.developing': 'विकासशील',
  'home.widget.best-hours.no-positive-detail': 'नमूनाकृत विंडो नकारात्मक हैं',

  'home.widget.aum.title': 'AUM',
  'home.widget.aum.period.month': 'इस महीने',
  'home.widget.aum.period.quarter': 'यह तिमाही',
  'home.widget.aum.period.year': 'इस साल',
  'home.widget.aum.period.all': 'पूरे समय',
  'home.widget.aum.unable-to-load': 'भरने में असमर्थ',
  'home.widget.aum.no-accounts': 'कोई अकाउंट्स नहीं',
  'home.widget.aum.account-count': '{count} अकाउंट',
  'home.widget.aum.account-count-plural': '{count} अकाउंट्स',
  'home.widget.streak.title': 'धारी',
  'home.widget.streak.period.month': 'इस महीने',
  'home.widget.streak.period.quarter': 'इस तिमाही',
  'home.widget.streak.period.year': 'इस साल',
  'home.widget.streak.period.ever': 'कभी',
  'home.widget.streak.win': 'जीतना',
  'home.widget.streak.wins': 'जीत',
  'home.widget.streak.loss': 'नुकसान',
  'home.widget.streak.losses': 'हानि',
  'home.widget.streak.in-a-row': 'एक पंक्ति में',
  'home.widget.streak.no-active': 'कोई सक्रिय लकीर नहीं',
  'home.widget.streak.start-trading':
    'एक स्ट्रीक बनाने के लिए ट्रेडिंग शुरू करें',
  'home.widget.streak.best-streak': 'आपकी सबसे अच्छी स्ट्रीक {period}',
  'home.widget.streak.above-average': 'आपके औसत {period} से ऊपर',
  'home.widget.streak.stay-focused': 'केंद्रित रहें, इसे जारी रखें',
  'home.widget.streak.keep-going': 'जा रहा',
  'home.widget.streak.good-start': 'अच्छी शुरुआत',
  'home.widget.streak.pause': 'अपने अगले ट्रेड से पहले रुकें',
  'home.widget.streak.review': 'अगले ट्रेड से पहले रिव्यू',
  'home.widget.streak.losses-process': 'हानियाँ प्रक्रिया का हिस्सा हैं',
  'home.widget.streak.best': 'श्रेष्ठ',
  'home.widget.streak.avg': 'औसत',
  'home.widget.drawdown.title': 'ड्रॉडाउन सीमा',
  'home.widget.drawdown.breached': 'का उल्लंघन',
  'home.widget.drawdown.remaining': 'शेष',
  'home.widget.drawdown.unable-to-load': 'भरने में असमर्थ',
  'home.widget.drawdown.no-accounts': 'सीमा के साथ कोई अकाउंट्स नहीं',
  'home.widget.profit-target.title': 'लाभ लक्ष्य',
  'home.widget.profit-target.achieved': 'हासिल किया',
  'home.widget.profit-target.remaining': 'शेष',
  'home.widget.profit-target.unable-to-load': 'भरने में असमर्थ',
  'home.widget.profit-target.no-accounts': 'लक्ष्य के साथ कोई अकाउंट्स नहीं',
  'home.widget.recent.title': 'हाल ही का',
  'home.widget.recent.unknown': 'अज्ञात',
  'home.widget.recent.just-now': 'बस अब',
  'home.widget.recent.minutes-ago': '{minutes}m पहले',
  'home.widget.recent.hours-ago': '{hours}h पहले',
  'home.widget.recent.days-ago': '{days}d पहले',
  'home.widget.recent.no-items': 'अभी तक कोई हालिया आइटम नहीं',
  'home.widget.recent.hint': 'फ़ाइलें या दृश्य यहां देखने के लिए खोलें',
  'home.widget.top-breakdown.title': 'शीर्ष {dimension}',
  'home.widget.top-breakdown.configure-title':
    'शीर्ष {dimension} को अनुकूलित करें',
  'home.widget.top-breakdown.aria.customize':
    'शीर्ष {dimension} को अनुकूलित करने के लिए क्लिक करें',
  'home.widget.setups.title': 'शीर्ष सेटअप्स',

  'home.widget.setups.trades-count': '{count} ट्रेड्स',
  'home.widget.setups.win-rate': '{rate}% विन रेट',
  'home.widget.weekly.title': 'इस सप्ताह',
  'home.widget.weekly.no-trades': 'इस सप्ताह अभी तक कोई ट्रेड्स नहीं है',
  'home.widget.weekly.breakeven': 'इस सप्ताह अब तक ब्रेक ईवेन',
  'home.widget.weekly.losing-days': '{count} लगातार दिन खो रहा है',
  'home.widget.weekly.winning-days': '{count} लगातार जीत के दिन',
  'home.widget.weekly.above-average': 'आपके साप्ताहिक औसत से ऊपर',
  'home.widget.weekly.below-average': 'आपके साप्ताहिक औसत से नीचे',
  'home.widget.weekly.better-than-last': 'पिछले सप्ताह से बेहतर',
  'home.widget.weekly.slower-than-last': 'पिछले सप्ताह की तुलना में धीमी',
  'home.widget.weekly.on-track': 'इस सप्ताह ट्रैक पर',
  'home.widget.weekly.room-to-recover': 'ठीक होने के लिए जगह',
  'home.widget.weekly.solid-start': 'सप्ताह की ठोस शुरुआत',
  'home.widget.weekly.early-in-week': 'सप्ताह के आरंभ में',
  'home.widget.weekly.no-trade-data': 'कोई ट्रेड डेटा नहीं',
  'home.widget.weekly.trade': 'ट्रेड',
  'home.widget.weekly.trades': 'ट्रेड्स',
  'home.widget.weekly.no-trades-tooltip': 'कोई ट्रेड्स नहीं',
  'home.widget.heatmap.last-3-months': 'पिछले 3 महीने',
  'home.widget.heatmap.last-6-months': 'पिछले 6 महीने',
  'home.widget.heatmap.year-activity': '{year} गतिविधि',
  'home.widget.heatmap.select-year': 'वर्ष चुनें',
  'home.widget.heatmap.close-selector': 'वर्ष चयनकर्ता बंद करें',
  'calendar.weekday.mon': 'सोम',
  'calendar.weekday.tue': 'मंगल',
  'calendar.weekday.wed': 'बुध',
  'calendar.weekday.thu': 'गुरु',
  'calendar.weekday.fri': 'शुक्र',
  'calendar.weekday.sat': 'शनि',
  'calendar.weekday.sun': 'रवि',
  'calendar.pnl': 'P&L',
  'calendar.week': 'सप्ताह',
  'calendar.trade': '{count} ट्रेड',
  'calendar.trades': '{count} ट्रेड्स',
  'calendar.reviewed': 'रिव्यू हो चुका',
  'calendar.month.january': 'जनवरी',
  'calendar.month.february': 'फरवरी',
  'calendar.month.march': 'मार्च',
  'calendar.month.april': 'अप्रैल',
  'calendar.month.june': 'जून',
  'calendar.month.july': 'जुलाई',
  'calendar.month.august': 'अगस्त',
  'calendar.month.september': 'सितंबर',
  'calendar.month.october': 'अक्टूबर',
  'calendar.month.november': 'नवंबर',
  'calendar.month.december': 'दिसंबर',

  'shared.collapsible.active-filters': '{count} सक्रिय फ़िल्टर्स',
  'filter.modal.title': 'उन्नत फ़िल्टर्स',
  'filter.modal.active-filters': 'सक्रिय फ़िल्टर्स ({count}):',
  'filter.modal.no-active-filters': 'कोई सक्रिय फ़िल्टर्स नहीं',
  'filter.modal.clear-all': 'सभी साफ करें',
  'filter.modal.section.trading-data': 'ट्रेडिंग डेटा',
  'filter.modal.section.classification': 'वर्गीकरण',
  'filter.modal.section.trade-criteria': 'ट्रेड मानदंड',
  'filter.modal.no-setup': 'कोई सेटअप नहीं',
  'filter.modal.no-tags': 'कोई टैग नहीं',
  'filter.modal.no-mistakes': 'कोई गलती नहीं',
  'filter.modal.type.regular': 'नियमित',
  'filter.modal.type.missed': 'मिस्ड',
  'filter.modal.type.backtest': 'बैकटेस्ट',
  'filter.summary.regular-trades': 'नियमित ट्रेड्स',
  'filter.modal.status.win': 'विन',
  'filter.modal.status.loss': 'लॉस',
  'filter.modal.status.breakeven': 'ब्रेकईवन',
  'filter.modal.status.open': 'ओपन',
  'filter.modal.status.closed': 'क्लोज्ड',

  'filter.modal.review-status.reviewed': 'रिव्यू हो चुका',
  'filter.modal.review-status.unreviewed': 'अनरिव्यूड',
  'filter.modal.direction.long-call': 'लॉन्ग/Call',
  'filter.modal.direction.short-put': 'शॉर्ट/पुट',
  'filter.modal.section.custom-fields': 'कस्टम फ़ील्ड्स',
  'filter.modal.custom-field.n-selected': '{count} चयनित',
  'filter.modal.custom-field.none-available': 'कोई मान उपलब्ध नहीं है',
  'widget.checklist.title': 'प्री-ट्रेड चेकलिस्ट',
  'widget.checklist.weekly-title': 'साप्ताहिक प्री-चेकलिस्ट',
  'widget.checklist.tooltip.day-only':
    'यहां जोड़े गए आइटम केवल आज तक लागू होते हैं।',
  'widget.checklist.tooltip.weekly':
    'यहां जोड़े गए आइटम केवल इस सप्ताह पर लागू होते हैं।',
  'widget.checklist.tooltip.settings-link':
    'सभी नए डीआरसी पर आवर्ती आइटम के लिए, सेटिंग्स > रिव्यूज़ पर जाएं।',
  'widget.checklist.tooltip.weekly-settings-link':
    'सभी नए साप्ताहिक रिव्यूज़ पर आवर्ती आइटम के लिए, सेटिंग्स > रिव्यूज़ पर जाएं।',
  'widget.checklist.completed': 'पूरा',
  'widget.checklist.edit-item': 'आइटम संपादित करें',
  'widget.checklist.delete-item': 'आइटम हटाएँ',
  'widget.checklist.empty.preview': 'कोई चेकलिस्ट आइटम कॉन्फ़िगर नहीं किया गया',
  'widget.checklist.empty.add-one': 'कोई चेकलिस्ट आइटम नहीं. नीचे एक जोड़ें.',
  'widget.checklist.placeholder': 'एक नया चेकलिस्ट आइटम जोड़ें...',
  'widget.checklist.invalid-context':
    "चेकलिस्ट विजेट को DRC या वीकली रिव्यू नोट की आवश्यकता है (frontmatter प्रकार: 'drc' या 'साप्ताहिक-रिव्यू')",
  'widget.session-mistakes.title': 'सत्र की गलतियाँ',
  'widget.session-mistakes.subtitle':
    'प्रत्येक ट्रेड पर गलतियों को दोहराने के बजाय सत्र के लिए एक बार लॉग इन करें।',

  'widget.session-mistakes.placeholder': 'गलतियाँ चुनें या बनाएँ',
  'widget.session-mistakes.empty': 'कोई सत्र त्रुटियाँ लॉग नहीं की गईं',

  'widget.session-mistakes.invalid-context':
    "सत्र की गलतियाँ विजेट को DRC नोट की आवश्यकता है (frontmatter प्रकार: 'drc')",
  'widget.directional-pnl.title.long': 'लॉन्ग ट्रेड्स P&L',
  'widget.directional-pnl.title.short': 'शॉर्ट ट्रेड्स P&L',
  'widget.directional-pnl.empty.not-enough':
    'दिशात्मक विश्लेषण के लिए पर्याप्त ट्रेड्स नहीं',
  'widget.directional-pnl.empty.no-closed':
    'इस अवधि के लिए कोई बंद ट्रेड्स नहीं',
  'widget.directional-pnl.empty.no-long':
    'इस अवधि में कोई लॉन्ग ट्रेड्स नहीं है',
  'widget.directional-pnl.empty.no-short': 'इस अवधि में कोई शॉर्ट ट्रेड्स नहीं',
  'widget.directional-drawdown.title.long': 'लॉन्ग ड्रॉडाउन',
  'widget.directional-drawdown.title.short': 'शॉर्ट ड्रॉडाउन',
  'widget.directional-drawdown.empty.not-enough':
    'दिशात्मक विश्लेषण के लिए पर्याप्त बंद ट्रेड्स नहीं',
  'widget.directional-drawdown.empty.no-closed':
    'इस अवधि के लिए कोई बंद दिशात्मक ट्रेड्स नहीं',
  'widget.directional-drawdown.empty.no-long':
    'इस अवधि के लिए कोई लॉन्ग बंद ट्रेड्स नहीं',
  'widget.directional-drawdown.empty.no-short':
    'इस अवधि के लिए कोई शॉर्ट बंद ट्रेड्स नहीं',
  'widget.missed-trades.title': 'मिस्ड ट्रेड्स',
  'widget.missed-trades.add-button': 'जोड़ें',
  'widget.missed-trades.add-aria': 'मिस्ड ट्रेड जोड़ें',

  'widget.missed-trades.additional-setups': 'अतिरिक्त सेटअप्स:',
  'widget.missed-trades.no-trades-today': 'आज कोई नहीं',
  'widget.missed-trades.no-trades-week': 'इस सप्ताह कोई भी ट्रेड्स नहीं छूटा',
  'widget.missed-trades.invalid-context':
    'छूटा हुआ ट्रेड्स विजेट केवल DRC और साप्ताहिक रिव्यू नोट्स में उपलब्ध है।',
  'widget.missed-trades.error-no-date':
    'नए मिस्ड ट्रेड के लिए तारीख निर्धारित नहीं की जा सकती',
  'widget.missed-trades.error-open-form': 'मिस्ड ट्रेड फॉर्म खोलने में विफल',
  'widget.backtest-trades.empty': 'इस अवधि के लिए कोई बैकटेस्ट ट्रेड्स नहीं',
  'widget.trade-table.column.images': 'इमेज',
  'widget.trade-table.column.date': 'तारीख',
  'widget.trade-table.column.entry': 'एंट्री',
  'widget.trade-table.column.ticker': 'सिंबल',
  'widget.trade-table.column.account': 'अकाउंट',
  'widget.trade-table.column.pnl': 'P&L',
  'widget.trade-table.column.direction': 'दिशा',
  'widget.trade-table.column.setups': 'सेटअप्स',
  'widget.trade-table.column.mistakes': 'गलतियाँ',
  'widget.trade-table.empty': 'इस अवधि के लिए कोई ट्रेड्स नहीं',
  'widget.trade-table.status.open': 'खुला',
  'widget.trade-table.na': 'N/A',
  'widget.trade-table.unknown': 'अज्ञात',

  'widget.trade-table.image-alt': 'ट्रेड {id} प्रिव्यू',
  'widget.trade-table.fullscreen-title': 'ट्रेड {id} छवि',
  'widget.trade-table.fullscreen-alt': 'ट्रेड {id} छवि {index}',
  'widget.trade-table.duration.days-hours': '{days}d {hours}h',
  'widget.trade-table.duration.hours-mins': '{hours}h {mins}m',
  'widget.trade-table.duration.mins': '{mins}m',
  'widget.trade-table.pagination.showing':
    '{total} ट्रेड्स का {start}-{end} दिखाया जा रहा है',
  'widget.trade-table.pagination.prev': '← पिछला',
  'widget.trade-table.pagination.next': 'अगला →',
  'widget.trade-table.pagination.page': '{total} का पृष्ठ {current}',
  'widget.pagination.showing': '{total} {items} का {start}-{end} दिखा रहा है',
  'widget.pagination.prev': 'पिछला',
  'widget.pagination.next': 'अगला',
  'widget.pagination.page': '{total} का पृष्ठ {current}',

  'widget.empty.no-data': 'कोई डेटा मौजूद नहीं',
  'widget.empty.no-trades': 'इस अवधि के लिए कोई ट्रेड्स नहीं',
  'widget.empty.no-closed-trades': 'इस अवधि के लिए कोई बंद ट्रेड्स नहीं',
  'widget.empty.no-daily-data': 'इस अवधि के लिए कोई दैनिक डेटा नहीं',
  'widget.empty.no-weekly-data': 'इस अवधि के लिए कोई साप्ताहिक डेटा नहीं',
  'widget.empty.no-monthly-data': 'इस अवधि के लिए कोई मासिक डेटा नहीं',
  'widget.empty.no-quarterly-data': 'इस अवधि के लिए कोई त्रैमासिक डेटा नहीं',
  'widget.empty.no-tag-data': 'इस अवधि के लिए कोई टैग डेटा उपलब्ध नहीं है',
  'widget.empty.no-setup-data': 'इस अवधि के लिए कोई सेटअप डेटा उपलब्ध नहीं है',
  'widget.empty.no-mental-game-data':
    '{period} के लिए कोई मानसिक गेम डेटा उपलब्ध नहीं है',
  'widget.empty.no-technical-game-data':
    '{period} के लिए कोई तकनीकी गेम डेटा उपलब्ध नहीं है',
  'widget.invalid-context.title': 'अमान्य प्रसंग',
  'widget.invalid-context.default':
    'इस {widgetType} विजेट के लिए रिव्यू या ट्रेड नोट की आवश्यकता है',
  'widget.invalid-context.monthly-quarterly-yearly':
    'यह विजेट केवल मासिक, त्रैमासिक और वार्षिक रिव्यूज़ में उपलब्ध है',
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    'यह विजेट केवल साप्ताहिक, मासिक, त्रैमासिक और वार्षिक रिव्यूज़ में उपलब्ध है',
  'widget.invalid-context.quarterly-yearly':
    'यह विजेट केवल त्रैमासिक और वार्षिक रिव्यूज़ में उपलब्ध है',
  'widget.invalid-context.yearly-only':
    'यह विजेट केवल वार्षिक रिव्यूज़ में उपलब्ध है',
  'widget.invalid-context.monthly-only':
    'यह विजेट केवल मासिक रिव्यूज़ में उपलब्ध है',
  'widget.invalid-context.weekly-monthly':
    'यह विजेट केवल साप्ताहिक और मासिक रिव्यूज़ में उपलब्ध है',
  'widget.invalid-context.review-note':
    'इस विजेट के लिए DRC, वीकली रिव्यू, मंथली रिव्यू, क्वार्टरली रिव्यू, या इयरली रिव्यू नोट की आवश्यकता है',
  'widget.key-levels.title': 'प्रमुख स्तर',
  'widget.key-levels.support': 'सहायता',
  'widget.key-levels.resistance': 'प्रतिरोध',
  'widget.key-levels.no-levels': 'कोई स्तर परिभाषित नहीं',
  'widget.key-levels.price-placeholder': 'कीमत...',
  'widget.key-levels.select-importance': 'महत्व चुनें',
  'widget.key-levels.remove-level': 'स्तर हटाएँ',
  'widget.key-levels.invalid-context':
    'मुख्य स्तर विजेट के लिए DRC, साप्ताहिक रिव्यू, या मासिक रिव्यू नोट की आवश्यकता होती है',
  'widget.key-levels.source.weekly': 'साप्ताहिक',
  'widget.key-levels.source.monthly': 'मासिक',
  'widget.key-levels.open-source-review': '{label} रिव्यू खोलें',
  'widget.key-levels.importance.none': 'कोई नहीं',
  'widget.key-levels.importance.high': 'उच्च',
  'widget.key-levels.importance.medium': 'मध्यम',
  'widget.key-levels.importance.low': 'कम',
  'manual-drawdown.notice.deleted': 'स्नैपशॉट हटा दिया गया',
  'manual-drawdown.notice.updated': 'स्नैपशॉट अपडेट किया गया',
  'manual-drawdown.notice.added': 'स्नैपशॉट जोड़ा गया',
  'manual-drawdown.validation.date-required': 'दिनांक आवश्यक है',
  'manual-drawdown.validation.invalid-date': 'कृपया कोई मान्य दिनांक दर्ज करें',
  'manual-drawdown.validation.future-date': 'दिनांक भविष्य में नहीं हो सकता',
  'manual-drawdown.validation.limit-required': 'ड्रॉडाउन सीमा आवश्यक है',
  'manual-drawdown.validation.limit-positive':
    'ड्रॉडाउन सीमा एक धनात्मक संख्या होनी चाहिए',
  'manual-drawdown.validation.duplicate-date':
    'इस तिथि के लिए एक स्नैपशॉट पहले से मौजूद है. कृपया कोई भिन्न दिनांक चुनें या मौजूदा दिनांक संपादित करें।',
  'manual-drawdown.section.recorded': 'रिकॉर्ड किए गए स्नैपशॉट',
  'manual-drawdown.table.date': 'तारीख',
  'manual-drawdown.table.limit': 'ड्रॉडाउन सीमा',
  'manual-drawdown.table.note': 'टिप्पणी',
  'manual-drawdown.table.actions': 'कार्रवाई',
  'manual-drawdown.button.editing': 'संपादन',
  'manual-drawdown.button.edit': 'एडिट',
  'manual-drawdown.button.delete': 'हटाएँ',
  'manual-drawdown.header.edit': 'स्नैपशॉट संपादित करें',
  'manual-drawdown.header.add': 'नया स्नैपशॉट जोड़ें',
  'manual-drawdown.field.date': 'ड्रॉडाउन दिनांक *',
  'manual-drawdown.field.date-desc': 'जब ब्रोकर ने यह सीमा जारी की',
  'manual-drawdown.field.limit': 'न्यूनतम शेष राशि ($)*',
  'manual-drawdown.field.limit-desc': 'न्यूनतम शेष राशि की अनुमति',
  'manual-drawdown.field.note': 'नोट (वैकल्पिक)',
  'manual-drawdown.field.note-desc': 'इस स्नैपशॉट के लिए अतिरिक्त संदर्भ',
  'manual-drawdown.placeholder.note': 'उदाहरण के लिए, महीने के अंत का विवरण',
  'manual-drawdown.button.update': 'स्नैपशॉट अपडेट करें',
  'manual-drawdown.button.add': 'स्नैपशॉट जोड़ें',
  'manual-drawdown.button.cancel-edit': 'संपादन रद्द करें',
  'manual-drawdown.modal.delete-title': 'स्नैपशॉट हटाएं?',
  'manual-drawdown.modal.delete-confirm': '{date} से ड्रॉडाउन स्नैपशॉट हटाएं?',
  'manual-drawdown.modal.delete-limit': 'ड्रॉडाउन सीमा: {limit}',
  'manual-drawdown.modal.delete-warning': 'इस एक्शन को वापस नहीं किया जा सकता।',
  'dashboard.selector.title': 'डैशबोर्ड में जोड़ें',
  'dashboard.selector.metrics': 'मेट्रिक्स',
  'dashboard.selector.charts': 'चार्ट',
  'dashboard.selector.empty': 'सभी मेट्रिक्स और चार्ट जोड़ दिए गए हैं',
  'dashboard.selector.hint.navigate': '↑↓नेविगेट करें',
  'dashboard.selector.hint.select': '↵ चयन करें',
  'dashboard.selector.hint.close': 'Esc बंद करें',

  'dashboard.component-selector.category.performance': 'प्रदर्शन',

  'dashboard.component-selector.category.journal': 'जर्नल',
  'widget.pnlChart.name': 'संचयी P&L',

  'widget.longPnLChart.name': 'लॉन्ग P&L',
  'widget.longPnLChart.description':
    'केवल लॉन्ग बंद ट्रेड्स के लिए संचयी P&L कर्व',
  'widget.shortPnLChart.name': 'शॉर्ट P&L',
  'widget.shortPnLChart.description':
    'केवल शॉर्ट बंद ट्रेड्स के लिए संचयी P&L कर्व',
  'widget.performanceCalendar.name': 'परफॉर्मेंस कैलेंडर',

  'widget.dailyPerformance.name': 'दैनिक प्रदर्शन',

  'widget.tradesChart.name': 'ट्रेड्स चार्ट',

  'widget.weekdayPerformance.name': 'कार्यदिवस प्रदर्शन',

  'widget.hourlyPerformance.name': 'प्रति घंटा प्रदर्शन',

  'widget.tickerPerformance.name': 'सिंबल प्रदर्शन',
  'widget.tickerPerformance.description':
    'सिंबल द्वारा प्रदर्शन की तुलना करते हुए रैंक किया गया बार चार्ट',
  'widget.tradesChart.limit': '{count} ट्रेड्स',
  'widget.drawdownChart.name': 'ड्रॉडाउन चार्ट',

  'widget.directionalDrawdownChart.name': 'दिशात्मक रियलाइज़्ड ड्रॉडाउन',

  'widget.longDrawdownChart.name': 'लॉन्ग ड्रॉडाउन',

  'widget.shortDrawdownChart.name': 'शॉर्ट ड्रॉडाउन',

  'widget.drawdownStats.no-conversion':
    'ड्रॉडाउन आँकड़े एफएक्स रूपांतरण के बिना मिश्रित मुद्राओं के लिए उपलब्ध नहीं हैं।',
  'widget.recentTrades.name': 'हाल के ट्रेड्स',
  'widget.recentTrades.description': 'आपके सबसे नए ट्रेड्स की सूची',
  'widget.recentTrades.date': 'तारीख',
  'widget.recentTrades.ticker': 'सिंबल',
  'widget.recentTrades.direction': 'दिशा',
  'widget.recentTrades.pnl': 'P&L',
  'widget.recentTrades.no-trades': 'कोई ट्रेड नहीं',
  'widget.recentTrades.empty-submessage':
    'ट्रेड्स जोड़ने के बाद वे यहां दिखाई देंगे',
  'widget.recentTrades.unknown': 'अज्ञात',
  'widget.rollingWinRate.name': 'रोलिंग जीत/हार अनुपात',

  'widget.rollingStats.name': 'रोलिंग औसत जीत/हार',

  'filter.chip.remove-aria': '{label} फ़िल्टर निकालें',
  'shared.filter.disabled-preview': 'फ़िल्टर्स प्रिव्यू में अक्षम है',
  'shared.filter.open': 'फ़िल्टर्स खोलें',
  'shared.filter.active-count': '{count} सक्रिय फ़िल्टर्स',
  'ui.toggle-switch.aria-label': 'गिल्ली टहनी',
  'ui.folder-browser.placeholder': 'एक फ़ोल्डर चुनें...',
  'ui.folder-browser.root': 'जड़',
  'ui.folder-browser.clear-aria':
    'डिफ़ॉल्ट स्थान का उपयोग करने के लिए साफ़ करें',
  'ui.folder-browser.expand-folder': 'फ़ोल्डर का विस्तार करें',
  'ui.folder-browser.collapse-folder': 'फ़ोल्डर संक्षिप्त करें',

  'combobox.placeholder.default': 'चुनें या टाइप करें...',
  'combobox.aria.remove-item': '{item} हटाएं',
  'combobox.add-option': '"{value}" जोड़ें',
  'error.render-component': '{component} प्रस्तुत करने में त्रुटि: {error}',
  'error.session-expired':
    'आपका सत्र समाप्त हो गया है। कृपया प्लगइन सेटिंग्स में फिर से साइन इन करें।',
  'error.ftp-not-found':
    'एफ़टीपी अकाउंट नहीं मिला. सिस्टम स्वचालित रूप से आपके लिए एक बना देगा.',
  'error.no-trading-data':
    'कोई ट्रेडिंग डेटा नहीं मिला. कृपया सुनिश्चित करें कि आपका MetaTrader अकाउंट ठीक से कनेक्ट है और उसका ट्रेड इतिहास है।',
  'error.unable-connect-service':
    'ट्रेडिंग डेटा सेवा से कनेक्ट करने में असमर्थ. कृपया अपने इंटरनेट कनेक्शन की जाँच करें।',
  'error.invalid-verification-code':
    'अमान्य सत्यापन कोड। कृपया कोड जाँचें और फिर कोशिश करें।',
  'error.invalid-registration-data':
    'अमान्य पंजीकरण डेटा. कृपया अपना सेटिंग्स जांचें और पुनः प्रयास करें।',
  'error.invalid-request':
    'अमान्य अनुरोध। कृपया अपना इनपुट जांचें और पुनः प्रयास करें।',
  'error.access-denied':
    'पहुंच अस्वीकृत। कृपया अपनी अकाउंट अनुमतियाँ जाँचें या सहायता से संपर्क करें।',
  'error.too-many-requests':
    'बहुत सारे अनुरोध. कृपया पुनः प्रयास करने से पहले एक क्षण प्रतीक्षा करें।',
  'error.service-unavailable':
    'ट्रेडिंग डेटा सेवा अस्थायी रूप से अनुपलब्ध है। कुछ ही मिनटों में पुनः प्रयास करें।',
  'error.server-error':
    'सर्वर त्रुटि उत्पन्न हुई. कृपया बाद में पुनः प्रयास करें या यदि समस्या बनी रहती है तो सहायता से संपर्क करें।',
  'error.network-error':
    'ट्रेडिंग डेटा सेवा से कनेक्ट नहीं हो सकता. अपने इंटरनेट कनेक्शन की जाँच करें और पुन: प्रयास करें।',
  'error.unknown': 'अज्ञात त्रुटि उत्पन्न हुई',
  'error.unexpected':
    'एक अप्रत्याशित त्रुटि हुई। यदि समस्या बनी रहती है तो कृपया पुनः प्रयास करें या सहायता से संपर्क करें।',
  'error.settings.invalid-pattern':
    'अमान्य सत्यापन पैटर्न. कृपया अपनी नियमित अभिव्यक्ति जांचें और पुनः प्रयास करें।',
  'error.settings.field-name-conflict':
    'यह फ़ील्ड नाम मौजूदा फ़ील्ड के साथ विरोध करता है. कृपया कोई भिन्न नाम चुनें.',
  'error.settings.invalid-field-name':
    'अमान्य फ़ील्ड नाम. फ़ील्ड नामों में केवल अक्षर, संख्याएँ और अंडरस्कोर हो सकते हैं।',
  'error.settings.save-failed':
    'आपके परिवर्तन सहेजने में असमर्थ. कृपया अपना सेटिंग्स जांचें और पुनः प्रयास करें।',
  'error.settings.load-failed':
    'कस्टम फ़ील्ड सेटिंग्स लोड करने में असमर्थ। हो सकता है कि आपके कस्टम फ़ील्ड ठीक से प्रदर्शित न हों.',
  'error.settings.import-failed':
    'फ़ील्ड सेटिंग्स इंपोर्ट नहीं हो सकीं। फ़ाइल फ़ॉर्मैट जाँचें और फिर कोशिश करें।',
  'error.settings.create-failed':
    'कस्टम फ़ील्ड बनाने में असमर्थ. कृपया अपना इनपुट जांचें और पुनः प्रयास करें।',
  'error.settings.remove-failed':
    'कस्टम फ़ील्ड को हटाने में असमर्थ. कृपया पुन: प्रयास करें।',
  'error.settings.generic':
    'कस्टम फ़ील्ड प्रबंधित करते समय एक त्रुटि उत्पन्न हुई. कृपया अपना सेटिंग्स जांचें और पुनः प्रयास करें।',
  'error.options.duplicate':
    'यह विकल्प पहले से मौजूद है. कृपया कोई भिन्न नाम चुनें.',
  'error.options.invalid-ticker':
    'अमान्य सिंबल प्रतीक. केवल अक्षरों, संख्याओं और अवधियों (जैसे, AAPL, SPX) का उपयोग करें।',
  'error.options.add-ticker-failed':
    'सिंबल प्रतीक जोड़ने में असमर्थ. कृपया प्रारूप की जाँच करें और पुनः प्रयास करें।',
  'error.options.add-failed':
    'विकल्प जोड़ने में असमर्थ. यह पहले से मौजूद हो सकता है या अमान्य हो सकता है.',
  'error.options.update-failed':
    'विकल्प अद्यतन करने में असमर्थ. यह पहले से मौजूद हो सकता है या अमान्य हो सकता है.',
  'error.options.remove-failed':
    'विकल्प निकालने में असमर्थ. कृपया पुन: प्रयास करें।',
  'error.options.no-options-reset':
    'रीसेट करने का कोई विकल्प नहीं. श्रेणी पहले से ही खाली है.',
  'error.options.reset-failed':
    'विकल्प रीसेट करने में असमर्थ. कृपया पुन: प्रयास करें।',
  'error.options.save-failed':
    'विकल्प परिवर्तन सहेजने में असमर्थ. कृपया अपना सेटिंग्स जांचें और पुनः प्रयास करें।',
  'error.options.generic':
    'विकल्प प्रबंधित करते समय एक त्रुटि उत्पन्न हुई. कृपया पुन: प्रयास करें।',
  'error.clipboard.permission-denied':
    'क्लिपबोर्ड पहुंच अस्वीकृत. कृपया पेस्ट कार्यक्षमता के लिए अपने ब्राउज़र में क्लिपबोर्ड अनुमतियाँ दें।',
  'error.clipboard.not-supported':
    'आपके ब्राउज़र में क्लिपबोर्ड पेस्ट समर्थित नहीं है. इसके बजाय Ctrl+V या Cmd+V का उपयोग करने का प्रयास करें।',
  'error.clipboard.image-too-large':
    'चिपकाने के लिए छवि बहुत बड़ी है. कृपया 10 एमबी से छोटी छवियों का उपयोग करें।',
  'error.clipboard.no-content':
    'चिपकाने के लिए क्लिपबोर्ड में कुछ नहीं मिला. पहले एक छवि कॉपी करने का प्रयास करें.',
  'error.clipboard.no-images':
    'क्लिपबोर्ड में कोई चित्र नहीं मिला. सुनिश्चित करें कि आपने एक छवि कॉपी की है, टेक्स्ट या अन्य सामग्री नहीं।',
  'error.clipboard.no-target':
    'कोई छवि अपलोड क्षेत्र नहीं मिला. पहले छवि अपलोड क्षेत्र पर क्लिक करें, फिर अपनी छवि चिपकाएँ।',
  'error.clipboard.network-error':
    'पेस्ट संसाधित करते समय नेटवर्क त्रुटि उत्पन्न हुई. अपने कनेक्शन की जांच करें और पुन: प्रयास करें।',
  'error.clipboard.paste-failed':
    'पेस्ट कार्रवाई पूर्ण करने में असमर्थ. कृपया छवि को दोबारा कॉपी करके चिपकाने का प्रयास करें।',
  'error.clipboard.generic':
    'क्लिपबोर्ड कार्रवाई विफल रही. कृपया अपनी सामग्री को दोबारा कॉपी करके चिपकाने का प्रयास करें।',

  'datetime.aria.open-picker': 'खुली तिथि चयनकर्ता',

  'modal.template-switch.title': 'लेआउट स्विच करें?',
  'modal.template-switch.switching-from': 'आप से स्विच कर रहे हैं',
  'modal.template-switch.switching-to': 'को',
  'modal.template-switch.has-content-title': 'इस नोट में सामग्री है',
  'modal.template-switch.has-content-desc':
    'नए लेआउट में फिट होने के लिए सामग्री को पुनर्गठित किया जाएगा। कोई भी सामग्री जो फिट नहीं होगी उसे आपके लिए रिव्यू पर नोट के निचले भाग में संरक्षित किया जाएगा।',
  'modal.template-switch.cannot-undo':
    'इसे पूर्ववत नहीं किया जा सकता (लेकिन आप वापस स्विच कर सकते हैं)।',
  'modal.template-switch.button.switch': 'लेआउट स्विच करें',

  'release-notes.title': 'रिलीज नोट्स',
  'release-notes.loading-plugin': 'प्लगइन लोड हो रहा है...',

  'release-notes.no-content': 'कोई रिलीज़ नोट नहीं मिला',
  'release-notes.current-version': 'वर्तमान: v{version}',
  'release-notes.version': 'संस्करण {version}',
  'release-notes.link.docs': 'डॉक्स',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',
  'skeleton.tradelog.loading': 'ट्रेड डेटा लोड हो रहा है',
  'skeleton.dashboard-widget.loading': 'विजेट डेटा लोड हो रहा है',
  'skeleton.account-page.loading': 'अकाउंट पेज लोड हो रहा है',

  'grid.aria.remove-widget': 'विजेट निकालें',
  'csv.broker.tradingtechnologies': 'ट्रेडिंग टेक्नोलॉजीज (टीटी)',
  'csv.broker-guide.tradingtechnologies.description':
    'विजेट CSV एक्सपोर्ट भरता है',
  'csv.broker-guide.tradingtechnologies.step-1':
    'टीटी में भरें विजेट खोलें और विवरण दृश्य के साथ विवरण, निरंतर, या मूल्य पर स्विच करें',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'महत्वपूर्ण:',

  'trade.metadata.broker-comment': 'ब्रोकर टिप्पणी',

  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'परफॉर्मेंस कैलेंडर',
  'navigation.section.overview': 'ओवरव्यू',
  'navigation.section.reviews': 'रिव्यू',
  'navigation.section.tools': 'टूल्स',
  'navigation.edit-mode.toggle': 'नेविगेशन कस्टमाइज़ करें',
  'navigation.edit-mode.hide-item': 'नेविगेशन आइटम छिपाएँ',
  'navigation.edit-mode.restore-section': 'छिपे आइटम',
  'navigation.edit-mode.restore': 'रिस्टोर',
  'navigation.items.nav-settings': 'सेटिंग्स',
  'navigation.shortcuts.add': 'शॉर्टकट जोड़ें',
  'navigation.shortcuts.remove': 'शॉर्टकट हटाएँ',
  'navigation.shortcuts.close': 'शॉर्टकट चयनकर्ता बंद करें',
  'navigation.shortcuts.search': 'खाते और सेटअप खोजें',
  'navigation.shortcuts.accounts': 'खाते',
  'navigation.shortcuts.setups': 'सेटअप',
  'navigation.shortcuts.empty': 'कोई खाता या सेटअप उपलब्ध नहीं है',
  'navigation.shortcuts.unavailable': 'उपलब्ध नहीं',
  'navigation.shortcuts.added': 'जोड़ा गया',
  'navigation.shortcuts.parent-required':
    'इस नेविगेशन आइटम को छिपाने से पहले इसके शॉर्टकट हटाएँ।',
  'navigation.items.nav-home': 'होम',
  'navigation.items.nav-dashboard': 'डैशबोर्ड',
  'navigation.items.nav-trade-log': 'ट्रेड लॉग',
  'navigation.items.nav-account-dashboard': 'अकाउंट्स',
  'navigation.items.nav-drc': 'आज का DRC',
  'navigation.items.nav-weekly': 'इस सप्ताह का रिव्यू',
  'navigation.items.nav-monthly': 'इस महीने का रिव्यू',
  'navigation.items.nav-quarterly': 'इस क्वार्टर का रिव्यू',
  'navigation.items.nav-yearly': 'इस साल का रिव्यू',
  'navigation.items.nav-add-trade': 'ट्रेड जोड़ें',
  'navigation.items.nav-layout-builder': 'लेआउट बिल्डर',
  'navigation.items.nav-quick-import': 'क्विक इंपोर्ट',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-session-mode': 'सेशन मोड',
  'navigation.items.nav-position-size': 'पोजीशन साइज़ कैलकुलेटर',
  'settings.general.navigation-sidebar': 'नेविगेशन साइडबार',
  'notice.error.open-navigation-sidebar':
    'नेविगेशन साइडबार खोलने में विफल. कृपया पुन: प्रयास करें।',
  'navigation.setting.open': 'नेविगेशन साइडबार खोलें',
  'navigation.setting.open.desc':
    'इसे अभी दिखाएँ और यदि Obsidian का साइडबार संक्षिप्त है तो उसे खोलें।',
  'navigation.setting.open.button': 'साइडबार खोलें',
  'calendar.setting.open': 'कैलेंडर खोलें',
  'calendar.setting.open.button': 'कैलेंडर खोलें',
  'notice.error.open-calendar-sidebar':
    'कैलेंडर खोलने में विफल. कृपया पुन: प्रयास करें।',
  'navigation.setting.tab-behavior': 'नेविगेशन टैब व्यवहार',
  'navigation.setting.tab-behavior.desc':
    'Journalit साइडबार से व्यू और समीक्षाएँ कैसे खोलें',
  'navigation.setting.tab-behavior.new-tab': 'नए टैब में खोलें',
  'navigation.setting.tab-behavior.replace': 'सक्रिय टैब बदलें',
  'navigation.search.placeholder': 'ट्रेड्स और रिव्यू खोजें...',
  'navigation.search.clear': 'खोज साफ़ करें',
  'navigation.search.section.trades': 'ट्रेड्स',
  'navigation.search.section.reviews': 'रिव्यू',
  'navigation.search.empty': 'कोई परिणाम नहीं मिला',
  'navigation.search.trade-open': 'खोलें',

  'command.open-navigation-sidebar': 'नेविगेशन साइडबार खोलें',
  'command.open-calendar-sidebar': 'कैलेंडर साइडबार खोलें',
  'widget.previous-trading-day-context.name': 'पिछला ट्रेडिंग दिवस संदर्भ',
  'widget.previous-trading-day-context.description':
    'पिछले DRC में शीर्षकों से केवल-पढ़ने के लिए संदर्भ निकाला गया',
  'widget.previous-trading-day-context.reference-label': 'पिछला DRC',
  'widget.previous-trading-day-context.open-source': 'खोलें',
  'widget.previous-trading-day-context.image-alt-prefix': 'पिछली DRC छवि',
  'widget.previous-trading-day-context.no-sections-configured':
    'लेआउट सेटिंग्स में कम से कम एक सेक्शन चुनें।',
  'widget.previous-trading-day-context.preview-note':
    'कल कीमत में तरलता बढ़ गई, साप्ताहिक स्तर से खारिज कर दिया गया, और नियोजित सीमा के अंदर वापस बंद हो गया।',
  'widget.previous-trading-day-context.preview-bullet-two':
    'मुख्य विचलन: पहले पुलबैक पर पुष्टि से पहले दर्ज किया गया।',
  'widget.previous-trading-day-context.preview-source':
    'प्रिव्यू: पिछले ट्रेडिंग दिन से पिछला DRC',
  'widget.previous-trading-day-context.preview-bullet-one':
    'शुरुआती ड्राइव के बाद दैनिक पूर्वाग्रह योजना से मेल खाता था।',
  'widget.weekly-drc-context.name': 'सप्ताह के दिन तक दैनिक रिव्यूज़',
  'widget.weekly-drc-context.description':
    'साप्ताहिक रिव्यू में प्रत्येक दिन के लिए चयनित DRC अनुभाग दिखाएं',

  'widget.weekly-drc-context.image-alt-prefix': 'साप्ताहिक DRC छवि',
  'widget.weekly-drc-context.no-activity': 'इस दिन के लिए कोई गतिविधि नहीं.',
  'widget.weekly-drc-context.no-sections-configured':
    'लेआउट सेटिंग्स में कम से कम एक DRC अनुभाग चुनें।',
  'widget.weekly-drc-context.current-week-not-found':
    'वर्तमान साप्ताहिक रिव्यू नहीं मिला.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'वर्तमान साप्ताहिक रिव्यू तिथि नहीं मिली।',
  'widget.weekly-drc-context.load-error':
    'साप्ताहिक DRC रिव्यू लोड करने में विफल।',
  'widget.weekly-drc-context.invalid-context':
    'यह विजेट केवल वीकली रिव्यू नोट्स में उपलब्ध है',
  'templateEditor.widget.weekly-drc-day-label': 'दिन',

  'templateEditor.widget.weekly-drc-start-collapsed': 'शुरू में संक्षिप्त',
  'templateEditor.widget.weekly-drc-day-all': 'सारे दिन',

  'templateEditor.widget.previous-context-sections-label':
    'शामिल करने योग्य अनुभाग',
  'templateEditor.widget.previous-context-heading-label':
    'पिछला DRC अनुभाग शीर्षक',
  'templateEditor.widget.previous-context-heading-placeholder':
    'एक शीर्षक चुनें',
  'templateEditor.widget.review-context-fields.selection':
    'प्रदर्शित करने के लिए फ़ील्ड',
  'templateEditor.widget.review-context-fields.selection.all': 'सभी क्षेत्र',
  'templateEditor.widget.review-context-fields.selection.group': 'फ़ील्ड समूह',
  'templateEditor.widget.review-context-fields.selection.fields':
    'विशिष्ट क्षेत्र',
  'templateEditor.widget.review-context-fields.group': 'समूह',
  'templateEditor.widget.review-context-fields.group-placeholder':
    'समूह का चयन करें',
  'templateEditor.widget.review-context-fields.fields': 'खेत',
  'templateEditor.widget.review-context-fields.fields-placeholder':
    'फ़ील्ड चुनें',
  'templateEditor.widget.review-context-fields.fields-selected':
    '{count} फ़ील्ड चयनित',
  'templateEditor.widget.review-context-fields.no-fields':
    'पहले सेटिंग्स में रिव्यू फ़ील्ड बनाएं।',

  'templateEditor.widget.review-context-fields.context': 'प्रसंग',
  'templateEditor.widget.review-context-fields.context.both': 'दोनों',
  'templateEditor.widget.review-context-fields.inherited': 'विरासत में मिला',
  'templateEditor.widget.review-context-fields.current': 'मौजूदा',
  'templateEditor.widget.review-context-fields.empty-values': 'खाली मान',
  'templateEditor.widget.review-context-fields.hide-empty': 'खाली मान छिपाएँ',
  'templateEditor.widget.trade-review.primary-metrics': 'प्राथमिक मेट्रिक्स',
  'templateEditor.widget.trade-review.classification': 'वर्गीकरण',
  'templateEditor.widget.trade-review.more-context': 'अधिक प्रसंग',
  'templateEditor.widget.trade-review.display': 'प्रदर्शन',
  'templateEditor.widget.trade-review.show-images': 'छवियाँ दिखाएँ',
  'templateEditor.widget.trade-review.fields-none': 'कोई फ़ील्ड नहीं',
  'templateEditor.widget.trade-review.fields-all': 'सभी क्षेत्र',
  'templateEditor.widget.trade-review.fields-count': '{count} फ़ील्ड',
  'templateEditor.widget.trade-review.no-fields': 'कोई फ़ील्ड उपलब्ध नहीं है',
  'templateEditor.widget.trade-review.questions': 'रिव्यू प्रश्न',
  'templateEditor.widget.trade-review.questions-help':
    'प्रत्येक ट्रेड परिणाम के लिए दिखाए गए संकेत चुनें। प्रश्न आईडी स्थिर रहती हैं ताकि जब आप संपादित करें या संकेत पुनः व्यवस्थित करें तो सहेजे गए उत्तर जुड़े रहें।',
  'templateEditor.widget.trade-review.outcome.win': 'जीत',
  'templateEditor.widget.trade-review.outcome.loss': 'हानि',
  'templateEditor.widget.trade-review.outcome.breakeven': 'ब्रेकईवन',
  'templateEditor.widget.trade-review.outcome.open': 'खोलें',
  'templateEditor.widget.trade-review.questions-empty':
    'इस परिणाम के लिए कोई प्रश्न नहीं.',
  'templateEditor.widget.trade-review.question-label': 'सवाल',
  'templateEditor.widget.trade-review.question-placeholder':
    'एक रिव्यू प्रश्न टाइप करें',
  'templateEditor.widget.trade-review.answer-placeholder-label':
    'उत्तर प्लेसहोल्डर',
  'templateEditor.widget.trade-review.answer-placeholder':
    'उत्तर फ़ील्ड में वैकल्पिक संकेत दिखाया गया है',
  'templateEditor.widget.trade-review.add-question': '+ प्रश्न जोड़ें',
  'templateEditor.widget.trade-review.answer-type-label': 'उत्तर प्रकार',
  'templateEditor.widget.trade-review.answer-type-text': 'मूलपाठ',
  'templateEditor.widget.trade-review.answer-type-choice': 'पसंद',
  'templateEditor.widget.trade-review.option-placeholder': 'विकल्प लेबल',
  'templateEditor.widget.trade-review.add-option': '+ विकल्प जोड़ें',
  'templateEditor.widget.trade-review.condition-label': 'कब दिखाओ',
  'templateEditor.widget.trade-review.condition-always': 'हमेशा दिखाया गया',
  'templateEditor.widget.trade-review.condition-option-label':
    'जब Q{questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section': '+ अनुभाग जोड़ें',

  'templateEditor.widget.previous-context-fallback-label': 'पिछला DRC फ़ॉलबैक',
  'templateEditor.widget.previous-context-fallback-nearest':
    'निकटतम पूर्ववर्ती DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'केवल पिछले कारोबारी दिन की उम्मीद है',
  'calendar.aria.open-daily-review': '{date} के लिए दैनिक रिव्यू खोलें',
  'calendar.aria.open-weekly-review': '{date} के लिए साप्ताहिक रिव्यू खोलें',
  'calendar.aria.open-monthly-review': '{date} के लिए मासिक रिव्यू खोलें',
  'calendar.aria.open-quarterly-review': '{date} के लिए त्रैमासिक रिव्यू खोलें',

  'csv.mapper.aria.map-column': 'मानचित्र स्तंभ {header}',
  'command.quick-import-trades': 'ट्रेड्स क्विक इंपोर्ट करें',
  'trade-import.error.file-empty':
    'यह फ़ाइल खाली है। फ़ाइल को दोबारा एक्सपोर्ट करके फिर प्रयास करें।',
  'trade-import.error.file-too-large':
    'चयनित फ़ाइल Trade Import आकार सीमा से अधिक है',
  'trade-import.error.file-type-unsupported':
    'चयनित फ़ाइल प्रकार Trade Import द्वारा समर्थित नहीं है',
  'trade-import.error.broker-file-type-unsupported':
    'चयनित ब्रोकर इस फ़ाइल प्रकार का समर्थन नहीं करता है',
  'quick-import.title': 'क्विक इंपोर्ट',
  'quick-import.subtitle':
    'अपने पसंदीदा Trade Import सेटअप का उपयोग प्रिव्यू और इंपोर्ट फ़ाइल में तेजी से करें।',
  'quick-import.gate.sign-in':
    'साइन इन करें या Trade Import में निःशुल्क Journalit अकाउंट से प्रिव्यू फ़ाइलें बनाएं। प्रो की आवश्यकता केवल तभी होती है जब आप इंपोर्ट ट्रेड्स होते हैं।',
  'quick-import.gate.sign-in-cta': 'प्रिव्यू में निःशुल्क साइन इन करें',
  'quick-import.gate.pro': 'क्विक इंपोर्ट Trade Import प्रो के साथ शामिल है।',
  'quick-import.gate.preview-free': 'प्रिव्यू आपकी फ़ाइल निःशुल्क',
  'quick-import.message.needs-setup':
    'क्विक इंपोर्ट का उपयोग करने से पहले Trade Import में कोई पसंदीदा ब्रोकर या टेम्पलेट चुनें।',
  'quick-import.message.capabilities-failed':
    'क्विक इंपोर्ट सेटअप लोड नहीं किया जा सका.',
  'quick-import.message.mapping-required':
    'इस फ़ाइल को कॉलम मैपिंग की आवश्यकता है. पूर्ण Trade Import प्रवाह को रिव्यू मैपिंग में खोलें।',
  'quick-import.message.preview-failed':
    'इस फ़ाइल को पूर्ण Trade Import प्रवाह में रिव्यू की आवश्यकता है।',
  'quick-import.message.no-importable':
    'कोई इंपोर्ट योग्य ट्रेड्स नहीं मिला। विवरण के लिए रिव्यू यह फ़ाइल Trade Import में है।',

  'quick-import.privacy-note':
    'फ़ाइलें प्रसंस्करण के लिए Journalit सर्वर पर अपलोड की जाती हैं और डिफ़ॉल्ट रूप से संग्रहीत नहीं होती हैं।',
  'quick-import.dropzone.title': 'यहां एक ब्रोकर एक्सपोर्ट डालें',
  'quick-import.dropzone.subtitle': 'या फ़ाइल चुनने के लिए क्लिक करें',

  'quick-import.status.checking-subscription':
    'सदस्यता स्थिति की जाँच की जा रही है...',
  'quick-import.status.analysing': 'प्रिव्यू का विश्लेषण और तैयारी...',
  'quick-import.status.importing': 'इंपोर्ट करते हुए...',
  'quick-import.processing.sent-to-server':
    'निजी प्रसंस्करण के लिए Journalit पर अपलोड किया गया',
  'quick-import.file.selected': 'चयनित फ़ाइल',
  'quick-import.file.processed':
    'संसाधित और आपकी तिजोरी में लिखने के लिए तैयार',
  'quick-import.summary.title': 'इंपोर्ट के लिए तैयार',

  'quick-import.summary.to-import': 'इंपोर्ट के लिए',
  'quick-import.summary.duplicates': 'डुप्लिकेट',
  'quick-import.summary.failed': 'रिव्यू की आवश्यकता है',
  'quick-import.summary.failed-rows': 'पंक्तियाँ इंपोर्ट किया गया नहीं',
  'quick-import.summary.incomplete-rows': 'अधूरी पंक्तियाँ छोड़ दी गईं',
  'quick-import.complete.title': 'इंपोर्ट पूर्ण',
  'quick-import.complete.message':
    '{written} लिखा है, {duplicates} डुप्लिकेट है, {failed} को रिव्यू की आवश्यकता है।',
  'quick-import.action.open-full': 'पूरा Trade Import खोलें',
  'quick-import.action.review-in-trade-import': 'Trade Import में रिव्यू करें',
  'quick-import.action.setup-in-trade-import': 'Trade Import में सेट करें',
  'quick-import.action.replace-file': 'फ़ाइल बदलें',
  'quick-import.action.import': 'ट्रेड्स इंपोर्ट करें',
  'quick-import.action.import-count.one': '{count} ट्रेड इंपोर्ट करें',
  'quick-import.action.import-count.few': '{count} ट्रेड्स इंपोर्ट करें',
  'quick-import.action.import-count.many': '{count} ट्रेड्स इंपोर्ट करें',
  'quick-import.action.import-count.other': '{count} ट्रेड्स इंपोर्ट करें',
  'quick-import.preview.more': '+ {count} अधिक संसाधित ट्रेड्स',
  'trade-import.notice.capabilities-failed':
    'Trade Import क्षमताओं को लोड करने में असमर्थ',
  'trade-import.notice.open-failed': 'Trade Import खोलने में असमर्थ',
  'trade-import.notice.template-exists':
    'इस नाम का एक Trade Import टेम्पलेट पहले से मौजूद है',
  'trade-import.notice.template-saved': 'Trade Import टेम्पलेट सहेजा गया',
  'trade-import.notice.analyse-failed': 'Trade Import विश्लेषण विफल रहा',
  'trade-import.notice.preview-failed': 'Trade Import प्रिव्यू विफल',
  'trade-import.notice.free-preview-rate-limited':
    'मुफ़्त प्रिव्यू की सीमा पूरी हो गई। PRO प्रारंभ करें या लगभग {minutes} मिनट में पुनः प्रयास करें।',
  'trade-import.notice.free-preview-storage-limit-reached':
    'मुफ़्त प्रिव्यू स्टोरेज {limit} ट्रेड्स तक रखा जा सकता है। आपके पास {storedItems} संग्रहीत है, और यह फ़ाइल {requestedItems} जोड़ देगी। पुराने प्रिव्यू के समाप्त होने या PRO प्रारंभ होने की प्रतीक्षा करें।',
  'trade-import.preview-error.guidance':
    'जांचें कि प्रत्येक आवश्यक फ़ील्ड मैप किया गया है, चयनित दिनांक प्रारूप आपकी फ़ाइल से मेल खाता है, और संख्यात्मक कॉलम में वैध ट्रेड मान शामिल हैं।',
  'trade-import.notice.complete':
    'Trade Import पूर्ण: {written} लिखा या अद्यतन, {duplicateCount} डुप्लिकेट, {failedCount} विफल',
  'trade-import.gate.brand-left': 'ट्रेड',
  'trade-import.gate.brand-right': 'इंपोर्ट',
  'trade-import.gate.sign-in.title': 'प्रिव्यू आपका ट्रेडिंग इतिहास निःशुल्क',
  'trade-import.gate.sign-in':
    'साइन इन करें या अपनी फ़ाइल का विश्लेषण करने के लिए एक निःशुल्क Journalit अकाउंट बनाएं। प्रो की आवश्यकता केवल तभी होती है जब आप इंपोर्ट ट्रेड्स होते हैं।',
  'trade-import.gate.sign-in.reassurance':
    'आपकी फ़ाइल निजी तौर पर संसाधित की जाती है और डिफ़ॉल्ट रूप से संग्रहीत नहीं होती है।',
  'trade-import.gate.sign-in.no-trial':
    'विश्लेषण और प्रिव्यू के लिए किसी प्रो ट्रायल की आवश्यकता नहीं है।',
  'trade-import.gate.sign-in.cta': 'प्रिव्यू में निःशुल्क साइन इन करें',

  'trade-import.step.select': 'अपलोड करें',
  'trade-import.step.privacy': 'गोपनीयता नोट',
  'trade-import.step.analyse': 'रिव्यू',
  'trade-import.step.preview': 'इंपोर्ट',
  'trade-import.label.template': 'स्थानीय मानचित्रण टेम्पलेट',
  'trade-import.label.template-actions': 'टेम्पलेट क्रियाएँ',
  'trade-import.template.none': 'कोई टेम्पलेट नहीं',
  'trade-import.label.account': 'अकाउंट',
  'trade-import.label.broker': 'एक्सपोर्ट स्रोत / प्लेटफ़ॉर्म',
  'trade-import.label.asset-type': 'एसेट टाइप',
  'trade-import.asset.stock': 'स्टॉक',
  'trade-import.asset.options': 'ऑप्शंस',
  'trade-import.asset.futures': 'फ्यूचर्स',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'क्रिप्टो',
  'trade-import.label.manual-mode': 'मैनुअल मोड',
  'trade-import.manual-mode.price-based': 'कीमत आधारित',
  'trade-import.manual-mode.direct-pnl': 'प्रत्यक्ष P&L',
  'trade-import.label.ai-mapping': 'एआई मैपिंग सुझावों का अनुरोध करें',
  'trade-import.privacy.copy':
    'Trade Import प्रसंस्करण के लिए चयनित ब्रोकर एक्सपोर्ट को Journalit सर्वर पर अपलोड करता है। ब्रोकर एक्सपोर्ट में अकाउंट पहचानकर्ता, ट्रेड इतिहास, प्रतीक, टाइमस्टैम्प, मूल्य, मात्रा, शुल्क, शेष राशि और P&L शामिल हो सकते हैं। प्रिव्यू पीढ़ी के लिए, Journalit आपके चयनित अकाउंट नाम, मैपिंग/टेम्पलेट विकल्प, कस्टम फ़ील्ड परिभाषाएँ और सहेजे गए विकल्प, और IBKR ओपन-पोजीशन मिलान के लिए सीमित स्थानीय ओपन-ट्रेड संदर्भ भी भेजता है। इस इंपोर्ट के लिए कच्ची फ़ाइलें संसाधित की जाती हैं और डिफ़ॉल्ट रूप से संग्रहीत नहीं की जाती हैं।',

  'trade-import.action.analyse': 'फ़ाइल का विश्लेषण करें',
  'trade-import.action.choose-file':
    'अपलोड करने या खींचने और छोड़ने के लिए क्लिक करें',
  'trade-import.guide.prompt': 'निश्चित नहीं कि एक्सपोर्ट को क्या करना चाहिए?',
  'trade-import.guide.link': 'ब्रोकर गाइड देखें',
  'trade-import.action.drop-file': 'अपलोड करने के लिए फ़ाइल छोड़ें',
  'trade-import.analyse.detected':
    '{fileType} का पता चला। हेडर और नमूना पंक्तियाँ बैकएंड द्वारा लौटाई जाती हैं।',
  'trade-import.diagnostic.info': 'जानकारी',
  'trade-import.label.sheet': 'चादर',
  'trade-import.label.header-row': 'शीर्ष लेख पंक्ति',
  'trade-import.placeholder.auto': 'ऑटो',
  'trade-import.label.date-format': 'तारिख का प्रारूप',

  'trade-import.label.save-template': 'मैपिंग टेम्पलेट सहेजें',
  'trade-import.placeholder.template-name': 'टेम्पलेट नाम',
  'trade-import.action.save-template': 'टेम्पलेट सहेजें',
  'trade-import.action.preview': 'प्रिव्यू जनरेट करें',

  'trade-import.preview.found.one': 'हमें {count} ट्रेड मिला',
  'trade-import.preview.found.few': 'हमें {count} ट्रेड्स मिला',
  'trade-import.preview.found.many': 'हमें {count} ट्रेड्स मिला',
  'trade-import.preview.found.other': 'हमें {count} ट्रेड्स मिला',
  'trade-import.preview.date-range': '{start}–{end}',
  'trade-import.preview.metric.symbols': 'प्रतीक',
  'trade-import.preview.metric.ready': 'इंपोर्ट के लिए तैयार',
  'trade-import.preview.metric.duplicates': 'संभावित डुप्लिकेट',
  'trade-import.preview.metric.attention': 'ध्यान देने की जरूरत',
  'trade-import.preview.completed.message':
    'ट्रेड्स इंपोर्ट के लिए तैयार: {count}।',
  'trade-import.preview.partial.message':
    'ट्रेड्स तैयार: {count}। पंक्तियाँ इंपोर्ट किया गया नहीं: {failed}। अधूरी पंक्तियाँ छोड़ दी गईं: {incomplete}.',
  'trade-import.preview.partial.guidance':
    'केवल नीचे दिखाया गया वैध ट्रेड्स इंपोर्ट किया गया होगा।',
  'trade-import.preview.failed.message':
    'इस फ़ाइल से कोई ट्रेड्स तैयार नहीं किया जा सका.',
  'trade-import.preview.failed.guidance':
    'कॉलम मैपिंग, दिनांक फ़ॉर्मैट, चयनित शीट और हेडर पंक्ति रिव्यू करें, और नीचे कोई अमान्य मान भी देखें।',
  'trade-import.preview.tradovate-performance.title': 'गलत Tradovate रिपोर्ट',
  'trade-import.preview.tradovate-performance.message':
    'यह Tradovate Performance एक्सपोर्ट जैसा दिखता है। Journalit आपके एक्जीक्यूशन को सटीक रूप से फिर से बनाने के लिए Orders रिपोर्ट इंपोर्ट करता है। Tradovate में Reports > Orders पर जाएँ और CSV डाउनलोड करें।',
  'trade-import.preview.tradovate-performance.guide':
    'Tradovate एक्सपोर्ट गाइड देखें',
  'trade-import.preview.metatrader-statement.title':
    'असमर्थित MetaTrader स्टेटमेंट',
  'trade-import.preview.metatrader-statement.message':
    'Journalit मूल MetaTrader खाता-इतिहास रिपोर्ट इंपोर्ट करता है। MetaTrader को अंग्रेज़ी में सेट करें, Account History / History खोलें, Save as Report चुनें, फिर मूल .html या .htm फ़ाइल को बिना संपादित या परिवर्तित किए अपलोड करें।',
  'trade-import.preview.metatrader-statement.guide':
    'MetaTrader एक्सपोर्ट गाइड देखें',
  'trade-import.preview.tradingview-export.title': 'गलत TradingView एक्सपोर्ट',
  'trade-import.preview.tradingview-export.message':
    'Journalit को TradingView Paper Trading की Order History / History CSV चाहिए। Account History, चार्ट डेटा, स्ट्रैटेजी एक्सपोर्ट या अन्य TradingView CSV फ़ाइलों का उपयोग न करें।',
  'trade-import.preview.tradingview-export.guide':
    'TradingView एक्सपोर्ट गाइड देखें',
  'trade-import.source-recovery.deepcharts.title':
    'यह फ़ाइल DeepCharts एक्सपोर्ट जैसी दिखती है',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    'खाता Rithmic के ज़रिए निष्पादित होता हो, फिर भी फ़ाइल DeepCharts से आई है। सही लॉन्ग या शॉर्ट दिशा के लिए साइन वाली Quantity पढ़ने हेतु DeepCharts चुनें।',
  'trade-import.source-recovery.deepcharts.manual-message':
    'DeepCharts इम्पोर्टर का उपयोग करें। DeepCharts दिशा को साइन वाली Quantity में रखता है, इसलिए Quantity को मैनुअल Direction फ़ील्ड के रूप में मैप न करें।',
  'trade-import.source-recovery.deepcharts.switch': 'DeepCharts पर स्विच करें',
  'trade-import.source-recovery.deepcharts.guide':
    'DeepCharts एक्सपोर्ट गाइड देखें',
  'trade-import.source-recovery.motivewave.title':
    'यह फ़ाइल MotiveWave निष्पादन एक्सपोर्ट जैसी दिखती है',
  'trade-import.source-recovery.motivewave.message':
    'MotiveWave का उपयोग करें ताकि Journalit निष्पादन पंक्तियों को सही तरीके से पूर्ण ट्रेड में जोड़ सके।',
  'trade-import.source-recovery.motivewave.switch': 'MotiveWave पर स्विच करें',
  'trade-import.source-recovery.motivewave.guide':
    'MotiveWave एक्सपोर्ट गाइड देखें',
  'quick-import.message.source-mismatch':
    'Journalit ने एक अलग एक्सपोर्ट स्रोत पहचाना है। फ़ाइल दोबारा अपलोड किए बिना स्रोत बदलने के लिए Trade Import में इसकी समीक्षा करें।',
  'trade-import.preview.no-eligible':
    'फ़ाइल सफलतापूर्वक पार्स हो गई, लेकिन कोई भी नया या अद्यतन ट्रेड्स इंपोर्ट के लिए पात्र नहीं है। रिव्यू डुप्लिकेट और वर्गीकरण विवरण नीचे।',
  'trade-import.pro-gate.title.one': '{count} ट्रेड आयात के लिए तैयार है',
  'trade-import.pro-gate.title.few': '{count} ट्रेड आयात के लिए तैयार हैं',
  'trade-import.pro-gate.title.many': '{count} ट्रेड आयात के लिए तैयार हैं',
  'trade-import.pro-gate.title.other': '{count} ट्रेड आयात के लिए तैयार हैं',
  'trade-import.pro-gate.subtitle':
    'उन्हें अपने वॉल्ट में ट्रेड नोट्स के रूप में लिखने के लिए PRO सक्रिय करें।',
  'trade-import.pro-gate.cta': 'PRO सक्रिय करें',
  'trade-import.preview.diagnostics': 'रिव्यू विवरण ({count})',
  'trade-import.preview.affected-rows': 'प्रभावित पंक्तियाँ: {count}',
  'trade-import.table.status': 'स्टेटस',
  'trade-import.table.symbol': 'सिंबल',
  'trade-import.table.direction': 'दिशा',
  'trade-import.table.entry-time': 'एंट्री समय',
  'trade-import.table.date': 'तारीख',
  'trade-import.table.quantity': 'क्वांटिटी',
  'trade-import.table.position': 'पोजीशन',
  'trade-import.table.result': 'परिणाम',
  'trade-import.table.message': 'संदेश',
  'trade-import.action.confirm': 'इंपोर्ट की पुष्टि करें',
  'trade-import.action.activate-pro.one':
    'PRO को इंपोर्ट {count} ट्रेड पर सक्रिय करें',
  'trade-import.action.activate-pro.few':
    'PRO को इंपोर्ट {count} ट्रेड्स पर सक्रिय करें',
  'trade-import.action.activate-pro.many':
    'PRO को इंपोर्ट {count} ट्रेड्स पर सक्रिय करें',
  'trade-import.action.activate-pro.other':
    'PRO को इंपोर्ट {count} ट्रेड्स पर सक्रिय करें',
  'trade-import.action.cancel-preview': 'प्रिव्यू रद्द करें',
  'trade-import.broker.manual': 'मैनुअल मैपिंग',

  'home.quick-links.quick-import': 'क्विक इंपोर्ट',
  'home.quick-links.setups': 'सेटअप्स',
  'command.open-setups': 'सेटअप्स खोलें',
  'setups.view.loading': 'सेटअप्स लोड हो रहा है…',
  'setups.view.error.title': 'सेटअप्स लोड नहीं हो सका',
  'setups.view.error.load-failed': 'सेटअप डेटा लोड करने में विफल.',
  'setups.view.action.retry': 'पुन: प्रयास करें',

  'setups.view.action.create': 'सेटअप बनाएं',
  'setups.view.action.new': 'नया सेटअप',
  'setups.create.title': 'सेटअप बनाएं',
  'setups.create.field.name': 'सेटअप नाम',
  'setups.create.placeholder.name': 'Opening Drive',
  'setups.create.field.status': 'स्टेटस',
  'setups.create.field.direction': 'दिशा',
  'setups.create.field.color': 'रंग',
  'setups.create.field.color-description':
    'इस सेटअप को पहचानने के लिए एक रंग चुनें।',
  'setups.create.field.tags': 'टैग्स',
  'setups.create.placeholder.tags': 'गति, ब्रेकआउट, सुबह',
  'setups.create.profile.heading': 'पसंदीदा फ़ील्ड',
  'setups.create.profile.optional-label': '(वैकल्पिक)',
  'setups.create.field.sessions': 'सत्र',
  'setups.create.field.preferred-sessions-tooltip':
    'इन सत्रों को सेटिंग्स → जर्नल → सत्र मोड में प्रबंधित करें।',
  'setups.create.placeholder.preferred-sessions': 'लंदन, न्यूयॉर्क',
  'setups.create.field.timeframes': 'समय-सीमा',
  'setups.create.placeholder.preferred-timeframes': '5 मी, 15 मी, 1 घंटा',
  'setups.create.field.tickers': 'सिंबल्स',
  'setups.create.placeholder.preferred-tickers': 'ईएस, एनक्यू, EURUSD',
  'setups.create.direction.any': 'निर्दिष्ट नहीं है',
  'setups.create.direction.long': 'लॉन्ग',
  'setups.create.direction.short': 'शॉर्ट',
  'setups.create.direction.both': 'दोनों',
  'setups.create.field.linked-notes': 'लिंक्ड नोट्स',
  'setups.create.field.linked-notes-desc':
    'मौजूदा नोट्स संलग्न करें जो इस सेटअप के लिए प्लेबुक का दस्तावेजीकरण करते हैं।',
  'setups.create.linked-notes.empty': 'अभी तक कोई नोट लिंक नहीं हुआ है.',
  'setups.create.linked-notes.add': '+ लिंक नोट',
  'setups.create.linked-notes.remove': 'लिंक किया गया नोट हटाएँ',
  'setups.create.linked-notes.picker-title': 'एक प्लेबुक नोट चुनें',
  'setups.create.linked-notes.search': 'नोट्स खोजें...',
  'setups.create.linked-notes.no-notes': 'कोई मार्कडाउन नोट नहीं मिला.',
  'setups.create.button.creating': 'बनाया जा रहा है...',
  'setups.create.button.create': 'सेटअप बनाएं',
  'setups.create.success': 'सेटअप "{name}" सफलतापूर्वक बनाया गया',
  'setups.create.error.name-required': 'सेटअप नाम आवश्यक है',
  'setups.create.error.tag-save-failed':
    'टैग को आपकी वैश्विक टैग सूची में सहेजा नहीं जा सका.',
  'setups.create.error.failed': 'सेटअप बनाने में विफल',
  'setups.edit.title': 'सेटअप संपादित करें',
  'setups.edit.button.saving': 'सहेजा जा रहा है...',
  'setups.edit.button.save': 'सेटअप सहेजें',
  'setups.edit.button.rename-and-update': 'ट्रेड्स का नाम बदलें और अद्यतन करें',
  'setups.edit.rename-warning.title':
    'सेटअप का नाम बदलें और ट्रेड्स को अपडेट करें',
  'setups.edit.rename-warning.message':
    '{oldName} का नाम बदलकर {newName} करने से ट्रेड नोट अपडेट हो जाएंगे जो पुराने सेटअप नाम का उपयोग करते हैं।',
  'setups.edit.delete.button': 'सेटअप हटाएं',
  'setups.edit.delete.title': 'सेटअप हटाएं',
  'setups.edit.delete.confirm': 'हटाने की पुष्टि करें',
  'setups.edit.delete.warning':
    '"{name}" को हटाने से सेटअप स्थायी रूप से हट जाता है और इसे लिंक किए गए ट्रेड्स से साफ़ कर दिया जाता है। इसे असंपादित नहीं किया जा सकता है।',
  'setups.edit.delete.success': 'हटाया गया सेटअप "{name}"',
  'setups.edit.delete.error': 'सेटअप को हटाने में विफल',
  'setups.edit.success': 'सेटअप "{name}" सफलतापूर्वक अपडेट किया गया',
  'setups.edit.error.failed': 'सेटअप को अपडेट करने में विफल',
  'setups.view.action.compare-selected': 'चयनित सेटअप्स की तुलना करें',
  'setups.view.tabs.aria': 'सेटअप दृश्य टैब',
  'setups.view.tab.overview': 'ओवरव्यू',
  'setups.view.tab.compare': 'तुलना करें',
  'setups.view.card.select-for-compare': 'तुलना के लिए सेटअप चुनें',

  'setups.view.compare.title': 'सेटअप्स की तुलना करें',

  'setups.view.compare.empty': 'तुलना करने के लिए दो सेटअप चुनें।',
  'setups.view.compare.empty-submessage':
    'साइड-बाय-साइड रिपोर्ट बनाने के लिए अवलोकन से दो सेटअप कार्ड चुनें।',
  'setups.view.compare.metrics-title': 'तुलना मेट्रिक्स',
  'setups.view.compare.metric': 'मीट्रिक',
  'setups.view.compare.edge-column': 'किनारा',
  'setups.view.compare.edge-label': 'विजेता',

  'setups.view.compare.no-clear-edge': 'कोई स्पष्ट किनारा नहीं',
  'setups.view.compare.expectancy-edge': 'एक्सपेक्टेंसी किनारा',
  'setups.view.compare.confidence': 'आत्मविश्वास',
  'setups.view.compare.sample': 'नमूना',
  'setups.view.compare.confidence.high': 'उच्च',
  'setups.view.compare.confidence.moderate': 'मध्यम',
  'setups.view.compare.confidence.low': 'कम',
  'setups.view.compare.edge-strength.strong': 'मजबूत धार',
  'setups.view.compare.edge-strength.clear': 'साफ़ किनारा',
  'setups.view.compare.edge-strength.slight': 'थोड़ा सा किनारा',
  'setups.view.compare.edge-reasons-privacy':
    'गोपनीयता मोड चालू होने पर किनारे का विवरण छिपा हुआ है।',
  'setups.view.compare.reason.higher.net-pnl': 'उच्चतर नेट P&L',
  'setups.view.compare.reason.lower.net-pnl': 'निचला नेट P&L',
  'setups.view.compare.reason.similar.net-pnl': 'समान नेट P&L',
  'setups.view.compare.reason.higher.total-r': 'उच्चतर कुल आर',
  'setups.view.compare.reason.lower.total-r': 'निचला कुल आर',
  'setups.view.compare.reason.similar.total-r': 'समान कुल आर',
  'setups.view.compare.reason.higher.win-rate': 'उच्चतर विन रेट',
  'setups.view.compare.reason.lower.win-rate': 'निचला विन रेट',
  'setups.view.compare.reason.similar.win-rate': 'समान विन रेट',
  'setups.view.compare.reason.higher.expectancy': 'उच्चतर एक्सपेक्टेंसी',
  'setups.view.compare.reason.lower.expectancy': 'निचला एक्सपेक्टेंसी',
  'setups.view.compare.reason.similar.expectancy': 'समान एक्सपेक्टेंसी',
  'setups.view.compare.reason.higher.profit-factor': 'उच्चतर प्रॉफिट फैक्टर',
  'setups.view.compare.reason.lower.profit-factor': 'निचला प्रॉफिट फैक्टर',
  'setups.view.compare.reason.similar.profit-factor': 'समान प्रॉफिट फैक्टर',

  'setups.view.compare.cumulative-title': 'संचयी प्रदर्शन',
  'setups.view.compare.cumulative-privacy':
    'गोपनीयता मोड चालू होने पर संचयी प्रदर्शन छिपा हुआ है।',
  'setups.view.compare.cumulative-empty':
    'चयनित सेटअप्स के लिए कोई संचयी ट्रेड डेटा नहीं।',

  'setups.view.trade.unknown-instrument': 'अज्ञात यंत्र',

  'setups.guide.create-new-setup.title': 'नए सेटअप बनाएं',
  'setups.guide.create-new-setup.description':
    'जब आप कोई अन्य प्लेबुक जोड़ना चाहें तो नई सेटअप का उपयोग करें। मोडल आपको इसके विवरण, टैग, लिंक किए गए नोट्स और नियमों के बारे में बताता है।',
  'setups.guide.detail-intro.title': 'यह सेटअप पेज है',
  'setups.guide.detail-intro.description':
    'यह सेटअप पृष्ठ अपने प्रदर्शन चार्ट, संदर्भ पैनल, संदर्भ सामग्री, कार्यों और निष्पादन नियमों के साथ एक टैग की गई प्लेबुक को फोकस में लाता है।',
  'setups.guide.detail-actions.title': 'सेटअप क्रियाएँ',
  'setups.guide.detail-actions.description':
    'संबंधित ट्रेड्स को खोलने या इसके विवरण, लिंक किए गए नोट्स, स्क्रीनशॉट और प्लेबुक नियमों सहित सेटअप को संपादित करने के लिए इन बटनों का उपयोग करें।',
  'setups.guide.empty.create-setup.title': 'नए सेटअप से शुरुआत करें',
  'setups.guide.empty.create-setup.description':
    'पहले एक सेटअप बनाएं। अस्तित्व में आने के बाद, यह मार्गदर्शिका सामान्य सेटअप वॉकथ्रू के साथ जारी रहेगी।',

  'setups.guide.intro.title': 'सेटअप्स में आपका स्वागत है',
  'setups.guide.intro.description':
    'यह दृश्य आपकी सेटअप प्लेबुक, लिंक किए गए ट्रेड्स, नोट्स, स्क्रीनशॉट और नियमों को एक ही स्थान पर लाता है।',
  'setups.guide.view-tabs.title': 'सेटअप दृश्य स्विच करें',
  'setups.guide.view-tabs.description':
    'पर्याप्त सेटअप उपलब्ध होने पर अवलोकन, सेटअप जोड़े और तुलना प्रवाह के बीच जाने के लिए इन टैब का उपयोग करें।',
  'setups.guide.overview-chart.title': 'प्रदर्शन रैंकिंग',
  'setups.guide.overview-chart.description':
    'अवलोकन चार्ट चयनित मीट्रिक द्वारा सेटअप्स को रैंक करता है। मीट्रिक को स्विच करने या चार्ट को विशिष्ट सेटअप्स पर केंद्रित करने के लिए शीर्ष दाईं ओर स्थित नियंत्रणों का उपयोग करें।',
  'setups.guide.tag-filter.title': 'फ़िल्टर सेटअप्स',
  'setups.guide.tag-filter.description':
    'फ़िल्टर कार्ड, चार्ट, जोड़े और सेटअप टैग या दिशा द्वारा तुलना विकल्प। प्रत्येक समूह के भीतर चयन OR तर्क का उपयोग करते हैं, जबकि टैग और दिशा एक साथ संयोजित होते हैं।',
  'setups.guide.setup-cards.title': 'सेटअप कार्ड',
  'setups.guide.setup-cards.description':
    'कार्ड प्रत्येक सेटअप को प्रमुख मेट्रिक्स, स्थिति, टैग, अंतिम ट्रेड तिथि और एक छोटे प्रदर्शन रुझान के साथ सारांशित करते हैं।',
  'setups.guide.open-detail.title': 'एक सेटअप पृष्ठ खोलें',
  'setups.guide.open-detail.description':
    'तैयार होने पर किसी सेटअप कार्ड को खोलकर उसका पृष्ठ देखें। वहाँ एक छोटा गाइड आपका इंतज़ार करेगा।',
  'setups.guide.detail-performance.title': 'विस्तृत प्रदर्शन',
  'setups.guide.detail-performance.description':
    'प्रदर्शन टैब समय के साथ इस सेटअप के चार्ट और प्रमुख मेट्रिक्स को दिखाता है, जिसमें P&L, विन रेट, एक्सपेक्टेंसी और ड्रॉडाउन शामिल हैं।',
  'setups.guide.detail-context.title': 'सेटअप प्रसंग',
  'setups.guide.detail-context.description':
    'यह पैनल सेटअप स्वास्थ्य, ध्यान आइटम, लिंक किए गए नोट्स और स्क्रीनशॉट को हाथ में रखता है।',
  'setups.guide.detail-playbook.title': 'प्लेबुक नोट्स',
  'setups.guide.detail-playbook.description':
    'प्लेबुक क्षेत्र इस सेटअप के लिए लिंक किए गए नोट का पूर्वावलोकन करता है। यह मार्कडाउन, इमेज, एक्सकैलिड्रा, या कोई भी संदर्भ सामग्री हो सकती है जो आप चाहते हैं।',
  'setups.guide.detail-rules.title': 'निष्पादन नियम',
  'setups.guide.detail-rules.description':
    'नियम सर्वोत्तम स्थितियों, प्रविष्टियों, जोखिम और बचने के लिए गलतियों के लिए संरचित चेकलिस्ट को कैप्चर करते हैं।',
  'setups.guide.finish.title': 'सेटअप्स गाइड पूर्ण',
  'setups.guide.finish.description':
    'आपने मुख्य सेटअप्स सतहें देखी हैं: अवलोकन, जोड़े, तुलना, और व्यक्तिगत सेटअप पृष्ठ।',

  'setups.guide.pairs-mode.title': 'सेटअप जोड़े खोलें',
  'setups.guide.pairs-mode.description':
    'यह देखने के लिए जोड़े खोलें कि कौन से सेटअप संयोजनों में तुलना करने के लिए पर्याप्त साझा ट्रेड्स है।',
  'setups.guide.pairs-chart.title': 'जोड़ी रैंकिंग',
  'setups.guide.pairs-chart.description':
    'पेयर मोड उन संयोजनों को हाइलाइट करता है जो एक साथ बेहतर या खराब प्रदर्शन कर सकते हैं। उस संयोजन के लिए गहन जोड़ी अंतर्दृष्टि खोलने के लिए एक बार पर क्लिक करें।',

  'setups.guide.compare-mode.title': 'तुलना मोड प्रारंभ करें',
  'setups.guide.compare-mode.description':
    'तुलना मोड आपको अगल-बगल रिव्यू के लिए दो सेटअप कार्ड चुनने की सुविधा देता है।',
  'setups.guide.compare-select.title': 'दो सेटअप्स चुनें',
  'setups.guide.compare-select.description':
    'तुलना पृष्ठ खोलने के लिए दो सेटअप कार्ड चुनें।',
  'setups.guide.compare-summary.title': 'यह तुलना पृष्ठ है',
  'setups.guide.compare-summary.description':
    'यह पृष्ठ दो सेटअप्स की एक साथ तुलना करता है। शीर्ष सारांश पंक्ति विजेता, एक्सपेक्टेंसी बढ़त, आत्मविश्वास और क्यों एक सेटअप को बढ़त मिल सकती है, दिखाती है।',
  'setups.guide.compare-body.title': 'तुलना सारांश पंक्ति',
  'setups.guide.compare-body.description':
    'शीर्ष पंक्ति तुलना का सारांश प्रस्तुत करती है: विजेता, एक्सपेक्टेंसी बढ़त, आत्मविश्वास और बढ़त के पीछे के कारण।',
  'setups.guide.compare-details.title': 'तुलना विवरण',
  'setups.guide.compare-details.description':
    'यह समझने के लिए कि दोनों सेटअप कैसे भिन्न हैं, मेट्रिक्स तालिका और संचयी चार्ट का उपयोग करें।',
  'setups.guide.detail-execution-gap.title': 'निष्पादन अंतराल विश्लेषण',
  'setups.guide.detail-execution-gap.description':
    'जब छूटा हुआ-ट्रेड या बैकटेस्ट डेटा मौजूद होता है, तो यह टैब छूटे हुए या बेंचमार्क अवसर के विरुद्ध कैप्चर किए गए निष्पादन की तुलना करता है।',
  'setups.guide.back-to-overview.title': 'सेटअप कार्ड पर वापस जाएँ',
  'setups.guide.back-to-overview.description':
    'जब आप तुलना करना समाप्त कर लें तो सेटअप कार्ड पर वापस लौटें।',

  'setups.view.title': 'सेटअप्स',
  'setups.view.open-as-markdown': 'Markdown के रूप में खोलें',
  'setups.view.open-as-setup': 'Journalit सेटअप के रूप में खोलें',

  'setups.view.summary.aria': 'सेटअप सिंहावलोकन सारांश',

  'setups.view.summary.needs-review': 'रिव्यू की आवश्यकता है',
  'setups.view.summary.best-performer': 'सर्वश्रेष्ठ प्रदर्शन करने वाला',

  'setups.view.ranking.metric-aria': 'प्रदर्शन मीट्रिक',

  'setups.view.overview.mode.pairs': 'जोड़े',
  'setups.view.pairs.summary-aria': 'सेटअप जोड़े सारांश',
  'setups.view.pairs.best': 'सबसे अच्छी जोड़ी',
  'setups.view.pairs.worst': 'सबसे खराब जोड़ी',
  'setups.view.pairs.worst-short': 'सबसे खराब',
  'setups.view.pairs.empty':
    'अभी तक 5+ ट्रेड्स के साथ कोई सेटअप जोड़ा नहीं गया है।',
  'setups.view.pairs.empty-submessage':
    'दो सेटअप द्वारा पर्याप्त लिंक किए गए ट्रेड्स को साझा करने के बाद जोड़े दिखाई देते हैं।',
  'setups.view.pairs.privacy':
    'गोपनीयता मोड चालू होने पर जोड़ी का प्रदर्शन छिपा हुआ है।',

  'setups.view.pairs.metric-aria': 'जोड़ी मीट्रिक',
  'setups.view.pairs.metric.edge': 'जोड़ी किनारा',
  'setups.view.pairs.metric.edge-short': 'किनारा',
  'setups.view.pairs.metric.expectancy': 'जोड़ी एक्सपेक्टेंसी',

  'setups.view.pairs.together': 'एक साथ',
  'setups.view.pairs.table.setup-pair': 'सेटअप जोड़ी',

  'setups.view.pairs.evidence': 'प्रमाण',
  'setups.view.pairs.edge-comparison': 'किनारे की तुलना',
  'setups.view.pairs.edge-caption': 'संयुक्त किनारा: {edge}',
  'setups.view.overview.setup-filter.all': 'सेटअप्स: सभी',
  'setups.view.overview.setup-filter.selected': 'सेटअप्स: {count} चयनित',
  'setups.view.overview.setup-filter.aria': 'दिखाने के लिए सेटअप्स चुनें',
  'setups.view.overview.setup-filter.select-all': 'सबका चयन करें',
  'setups.view.overview.setup-filter.clear': 'साफ़ करें',
  'setups.view.overview.tag-filter.aria': 'फ़िल्टर सेटअप्स',
  'setups.view.overview.tag-filter.reset': 'रीसेट',
  'setups.view.overview.tag-filter.untagged': 'टैग नहीं किए गए',
  'setups.view.overview.tag-filter.empty':
    'कोई भी सेटअप इन फ़िल्टर से मेल नहीं खाता',
  'setups.view.overview.tag-filter.empty-submessage':
    'अधिक सेटअप्स दिखाने के लिए फ़िल्टर्स को समायोजित या साफ़ करें।',

  'setups.view.overview.pnl-chart.dropdown-label': 'P&L वक्र',

  'setups.view.overview.pnl-chart.combined': 'सभी सेटअप्स',
  'setups.view.overview.pnl-chart.selected-combined': 'चयनित सेटअप्स',

  'setups.view.overview.pnl-chart.hidden':
    'गोपनीयता मोड सक्षम होने पर सेटअप P&L समय के साथ छिपा रहता है।',
  'setups.view.overview.pnl-chart.trade': 'ट्रेड',
  'setups.view.overview.pnl-chart.start': 'शुरू',
  'setups.view.ranking.privacy':
    'गोपनीयता मोड चालू होने पर प्रदर्शन मान छिपे हुए हैं।',
  'setups.view.ranking.empty': 'अभी तक कोई सेटअप प्रदर्शन डेटा नहीं है।',
  'setups.view.ranking.empty-submessage':
    'रैंकिंग प्रदर्शन शुरू करने के लिए सेटअप्स के साथ ट्रेड्स लॉग करें।',

  'setups.view.metric.trade-count': 'ट्रेड गिनती',
  'setups.view.metric.trades': 'ट्रेड्स',
  'setups.view.metric.net-pnl': 'कुल P&L',
  'setups.view.metric.total-pnl': 'कुल P&L',
  'setups.view.metric.win-rate': 'विन रेट',
  'setups.view.metric.profit-factor': 'प्रॉफिट फैक्टर',
  'setups.view.metric.last-traded': 'अंतिम बार कारोबार हुआ',
  'setups.view.metric.expected-value': 'अपेक्षित मूल्य',

  'setups.view.status.active': 'सक्रिय',
  'setups.view.status.testing': 'परीक्षण',
  'setups.view.status.archived': 'संग्रहीत',

  'setups.view.empty.no-setups':
    'अभी तक कोई सेटअप्स नहीं. प्लेबुक को ट्रैक करना शुरू करने के लिए अपना पहला सेटअप बनाएं।',
  'setups.view.empty.no-setups-submessage':
    'सेटअप आपके प्लेबुक नोट्स, नियम, ट्रेड्स और प्रदर्शन को एक ही स्थान पर एकत्रित करते हैं।',

  'setups.view.detail.back': 'वापस',

  'setups.view.detail.action.edit': 'सेटअप संपादित करें',
  'setups.view.detail.action.view-trades': 'ट्रेड लॉग में देखें',

  'setups.view.detail.playbook': 'प्लेबुक',

  'setups.view.detail.no-playbook-note':
    'प्लेबुक नोट को यहां प्रिव्यू से लिंक करें।',
  'setups.view.detail.link-playbook-note': 'लिंक नोट',
  'setups.view.detail.change-playbook-note': 'नोट बदलें',

  'setups.view.detail.playbook-note-modal.empty': 'कोई मेल खाता नोट नहीं मिला.',
  'setups.view.detail.empty-playbook-note':
    'लिंक किया गया प्लेबुक नोट खाली है.',
  'setups.view.detail.rules': 'नियम',

  'setups.view.detail.rules.edit': 'नियम संपादित करें',

  'setups.view.detail.rules.add': 'नियम जोड़ें',

  'setups.view.detail.rules.empty-title': 'सेटअप प्लेबुक बनाएं',
  'setups.view.detail.rules.use-template': 'टेम्पलेट का प्रयोग करें',
  'setups.view.detail.rules.applying-template':
    'टेम्पलेट लागू किया जा रहा है...',
  'setups.view.detail.rules.add-custom': 'कस्टम नियम',
  'setups.view.detail.rules.template-error':
    'प्लेबुक टेम्पलेट लागू करने में विफल।',
  'setups.view.detail.rules.template.best-conditions': 'सर्वोत्तम स्थितियाँ',
  'setups.view.detail.rules.template.entry-criteria': 'एंट्री मानदंड',
  'setups.view.detail.rules.template.invalidation': 'इनवैलिडेशन',
  'setups.view.detail.rules.template.risk-management': 'जोखिम प्रबंधन',
  'setups.view.detail.rules.template.avoid-when': 'कब से बचें',
  'setups.view.detail.rules.template.common-mistakes': 'सामान्य गलतियां',
  'setups.view.detail.rules.template.rule.best-conditions':
    'बाज़ार संदर्भ इस सेटअप का समर्थन करता है',
  'setups.view.detail.rules.template.rule.entry-criteria':
    'एंट्री ट्रिगर स्पष्ट रूप से परिभाषित है',
  'setups.view.detail.rules.template.rule.invalidation':
    'एंट्री से पहले अमान्यता स्पष्ट है',
  'setups.view.detail.rules.template.rule.risk-management':
    'जोखिम स्वीकार्य है और लक्ष्य परिभाषित है',
  'setups.view.detail.rules.template.rule.avoid-when':
    'टालने की स्थितियाँ मौजूद नहीं हैं',
  'setups.view.detail.rules.template.rule.common-mistakes':
    'ज्ञात निष्पादन गलतियों से बचा जाता है',
  'setups.view.detail.rules.field.label': 'नियम',
  'setups.view.detail.rules.field.description': 'डिटेल्स',
  'setups.view.detail.rules.field.group': 'समूह',
  'setups.view.detail.rules.move-up': 'नियम को ऊपर ले जाएँ',
  'setups.view.detail.rules.move-down': 'नियम को नीचे ले जाएँ',
  'setups.view.detail.rules.delete': 'नियम हटाएँ',
  'setups.view.detail.rules.save-error': 'सेटअप नियम सहेजने में विफल.',
  'setups.view.detail.rules.validation-label':
    'सहेजने से पहले नियम का नाम जोड़ें या रिक्त नियम हटा दें।',
  'setups.view.detail.rules.groups': 'समूह',
  'setups.view.detail.rules.add-group': 'समूह जोड़ें',
  'setups.view.detail.rules.new-group': 'नया समूह',
  'setups.view.detail.rules.validation-group':
    'सहेजने से पहले समूह का नाम जोड़ें या रिक्त समूह हटा दें।',
  'setups.view.detail.rules.summary': '{count} नियम · {groups} समूह',

  'setups.view.detail.rule.category.context': 'प्रसंग',
  'setups.view.detail.rule.category.entry': 'एंट्री',
  'setups.view.detail.rule.category.exit': 'एग्जिट',
  'setups.view.detail.rule.category.risk': 'जोखिम',
  'setups.view.detail.rule.category.management': 'प्रबंध',
  'setups.view.detail.rule.category.invalidation': 'इनवैलिडेशन',
  'setups.view.detail.rule.category.psychology': 'मनोविज्ञान',
  'setups.view.detail.rule.required': 'आवश्यक',

  'setups.view.detail.no-linked-notes': 'अभी तक कोई लिंक्ड नोट नहीं है.',

  'setups.view.detail.performance.cumulative-pnl': 'संचयी P&L',
  'setups.view.detail.performance.cumulative-r': 'संचयी आर',
  'setups.view.detail.performance.drawdown': 'ड्रॉडाउन',
  'setups.view.detail.performance.empty':
    'अभी तक कोई लिंक नहीं किया गया ट्रेड्स।',
  'setups.view.detail.performance.empty-submessage':
    'एक बार जब आप उन्हें लॉग करना शुरू करेंगे तो इस सेटअप का उपयोग करने वाला ट्रेड्स यहां दिखाई देगा।',

  'setups.view.detail.analysis.performance': 'प्रदर्शन',
  'setups.view.detail.analysis.execution-gap': 'निष्पादन अंतराल',
  'setups.view.detail.analysis.tabs-aria': 'सेटअप प्रदर्शन टैब',
  'setups.view.detail.brief.linked-notes-add': 'लिंक किए गए नोट्स संपादित करें',

  'setups.view.detail.execution-gap.live-pnl': 'लाइव P&L',
  'setups.view.detail.execution-gap.live-r': 'जिगर',
  'setups.view.detail.execution-gap.missed-edge': 'मिस्ड एज',
  'setups.view.detail.execution-gap.live-plus-missed': 'लाइव + मिस्ड',
  'setups.view.detail.execution-gap.backtest': 'बैकटेस्ट',

  'setups.view.detail.execution-gap.capture-rate': 'कैप्चर दर',
  'setups.view.detail.execution-gap.capture-rate-tooltip':
    'लाइव P&L ÷ (लाइव P&L + मिस्ड-ट्रेड P&L)। दिखाता है कि आपने कितनी उपलब्ध बढ़त हासिल की है।',
  'setups.view.detail.execution-gap.average-r-delta': 'औसत आर डेल्टा',
  'setups.view.detail.execution-gap.live-execution': 'लाइव निष्पादन',
  'setups.view.detail.execution-gap.backtest-benchmark': 'बैकटेस्ट बेंचमार्क',
  'setups.view.detail.execution-gap.hidden':
    'निष्पादन अंतर गोपनीयता मोड में छिपा हुआ है.',
  'setups.view.detail.execution-gap.empty':
    'निष्पादन अंतराल का विश्लेषण करने के लिए इस सेटअप के लिए छूटे हुए ट्रेड्स या बैकटेस्ट ट्रेड्स को लॉग करें।',

  'setups.view.detail.brief.health': 'सेटअप स्वास्थ्य',
  'setups.view.detail.brief.profile': 'प्रोफ़ाइल',
  'setups.view.detail.brief.linked-notes': 'लिंक किए गए नोट्स ({count})',
  'setups.view.detail.brief.linked-notes-modal.title': 'जुड़े हुए नोट्स',
  'setups.view.detail.brief.linked-notes-modal.subtitle':
    '{name} से जुड़े नोट्स।',
  'setups.view.detail.brief.screenshots': 'स्क्रीनशॉट ({count})',
  'setups.view.detail.brief.view-all': 'सभी को देखें',
  'setups.view.detail.brief.no-screenshots':
    'अभी तक कोई स्क्रीनशॉट लिंक नहीं हुआ है.',
  'setups.view.detail.brief.screenshot-alt': 'सेटअप स्क्रीनशॉट {index}',
  'setups.view.detail.brief.screenshot-open': 'स्क्रीनशॉट {index} खोलें',
  'setups.view.detail.brief.status.complete': 'पूरा',
  'setups.view.detail.brief.status.missing': 'गुम',
  'setups.view.detail.brief.health.playbook': 'प्लेबुक',
  'setups.view.detail.brief.health.rules': 'नियम',
  'setups.view.detail.brief.health.notes': 'नोट्स',
  'setups.view.detail.brief.health.screenshots': 'स्क्रीनशॉट',
  'setups.view.detail.brief.health.trades': 'ट्रेड्स',
  'setups.view.detail.brief.count.rules': '{count} नियम',
  'setups.view.detail.brief.count.notes': '{count} नोट्स',
  'setups.view.detail.brief.count.images': '{count} छवियाँ',
  'setups.view.detail.brief.count.trades': '{count} ट्रेड्स',
  'setups.view.detail.brief.more': '+{count} अधिक',

  'setups.view.detail.brief.profile.direction': 'दिशा',
  'setups.view.detail.brief.profile.sessions': 'सत्र',
  'setups.view.detail.brief.profile.timeframes': 'समय-सीमा',
  'setups.view.detail.brief.profile.tickers': 'सिंबल्स',
  'setups.view.detail.brief.direction.long': 'लॉन्ग',
  'setups.view.detail.brief.direction.short': 'शॉर्ट',
  'setups.view.detail.brief.direction.both': 'दोनों',
  'setups.view.detail.attention.title': 'ध्यान देने की जरूरत है',
  'setups.view.detail.attention.count': '{count} आइटम',
  'setups.view.detail.attention.empty': 'कोई सेटअप समस्या नहीं मिली.',
  'setups.view.detail.attention.show-more': '+{count} अधिक',
  'setups.view.detail.attention.show-less': 'कम दिखाओ',
  'setups.view.detail.attention.no-playbook-title': 'प्लेबुक नोट लिंक करें',
  'setups.view.detail.attention.no-playbook-detail':
    'संदर्भ और उदाहरणों के लिए एक स्रोत नोट लिंक करें।',
  'setups.view.detail.attention.no-rules-title': 'निष्पादन प्लेबुक बनाएं',
  'setups.view.detail.attention.no-rules-detail':
    'प्रविष्टियों, अमान्यकरण, जोखिम और गलतियों के लिए मानदंड जोड़ें।',

  'setups.view.detail.attention.no-trades-title':
    'अभी तक कोई लाइव ट्रेड्स नहीं है',
  'setups.view.detail.attention.no-trades-detail':
    'अभी तक कोई लाइव ट्रेड इतिहास जुड़ा नहीं है।',
  'setups.view.detail.attention.no-screenshots-title':
    'उदाहरण स्क्रीनशॉट सहेजें',
  'setups.view.detail.attention.no-screenshots-detail':
    'रिव्यू उदाहरणों के लिए ट्रेड्स में स्क्रीनशॉट संलग्न करें।',
  'setups.view.detail.attention.stale-title': 'हालिया प्रासंगिकता रिव्यू करें',
  'setups.view.detail.attention.stale-detail':
    'इस सेटअप का {count} दिनों में कारोबार नहीं किया गया है।',
  'setups.view.detail.attention.profit-factor-title':
    'प्रदर्शन के लिए रिव्यू की आवश्यकता है',
  'setups.view.detail.attention.profit-factor-detail':
    'लिंक किए गए ट्रेड्स में प्रॉफिट फैक्टर 1.0 से नीचे है।',
  'setups.view.detail.attention.expectancy-title': 'एक्सपेक्टेंसी नकारात्मक है',
  'setups.view.detail.attention.expectancy-detail':
    'औसत लिंक्ड-ट्रेड परिणाम ब्रेकईवन से नीचे है।',
  'setups.view.completeness.incomplete-playbook': 'अधूरी प्लेबुक',
  'setups.view.completeness.no-rules': 'कोई नियम नहीं',
  'setups.view.completeness.no-linked-notes': 'कोई लिंक्ड नोट नहीं',
  'setups.view.date.never': 'कभी नहीं',
  'setups.view.metric.expectancy-r': 'एक्सपेक्टेंसी (आर)',

  'setups.view.card.open-named': '{name} खोलें',
  'setups.view.card.sparkline-aria': 'सेटअप स्पार्कलाइन',
  'setups.view.card.status.active': 'स्थिर',
  'setups.view.card.status.monitor': 'मॉनिटर',
  'setups.view.card.status.review': 'रिव्यू',
  'setups.view.tags': 'टैग्स',
  'setups.view.date.today': 'आज',
  'setups.view.date.yesterday': 'कल',
  'setups.view.date.days-ago': '{count} दिन पहले',
  'settings.general.copy-trading-pnl-toggled': 'कॉपी ट्रेडिंग P&L {status} है',

  'trade-import.restore.complete':
    '{written} इंपोर्ट किए गए ट्रेड्स पुनर्स्थापित हुए; {failed} विफल रहे.',
  'trade-import.restore.broker-label': 'बैकएंड पुनर्सेटअप',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Trade Sync',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'अपने FTP कनेक्शन से अपलोड हुई MetaTrader रिपोर्ट से ट्रेड्स सिंक करें।',
  'trade-sync.source.trade-import.description':
    'ब्रोकर-फ़ाइल इंपोर्ट को वॉल्ट में पुनर्स्थापित करें और गुम हुए स्थानीय ट्रेड नोट पुनर्प्राप्त करें।',
  'trade-sync.source.tradovate.description':
    'क्लाउड में Tradovate ट्रेड्स सिंक करें और उन्हें इस वॉल्ट में प्रोजेक्ट करें।',
  'trade-sync.tradovate.status-failed': 'Tradovate स्थिति लोड करने में असमर्थ.',
  'trade-sync.tradovate.last-sync': 'अंतिम सिंक',
  'trade-sync.tradovate.last-projection': 'अंतिम प्रोजेक्शन',
  'trade-sync.tradovate.pending-projections': '{count} लंबित प्रोजेक्शन',
  'trade-sync.tradovate.pending-acks': '{count} लंबित स्थानीय एसीके',
  'trade-sync.tradovate.never': 'कभी नहीं',

  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'क्लाउड में Rithmic ट्रेड्स सिंक करें और उन्हें इस वॉल्ट में प्रोजेक्ट करें।',
  'trade-sync.rithmic.plugin-sync-description':
    'Journalit.co पर Rithmic कनेक्ट करें, फिर यहाँ सिंक करके अपनी नवीनतम Rithmic गतिविधि इस वॉल्ट में लिखें।',
  'trade-sync.rithmic.status-failed': 'Rithmic स्थिति लोड करने में असमर्थ.',
  'trade-sync.rithmic.status.connecting': 'कनेक्ट हो रहा है',
  'trade-sync.rithmic.status.paused': 'रोका गया',
  'trade-sync.rithmic.status.waiting-for-accounts': 'खातों की प्रतीक्षा',
  'trade-sync.rithmic.status.reauthorization-required':
    'Journalit.co पर पुनः अधिकृति आवश्यक है',
  'trade-sync.rithmic.status.error': 'कनेक्शन त्रुटि',
  'trade-sync.rithmic.no-connections':
    'यहाँ सिंक करने के लिए Journalit.co पर एक Rithmic खाता कनेक्ट करें।',
  'trade-sync.rithmic.connect': 'कनेक्ट करें',
  'trade-sync.rithmic.manage': 'Journalit.co पर प्रबंधित करें',
  'trade-sync.rithmic.system': 'Rithmic सिस्टम',
  'trade-sync.rithmic.accounts': 'खाते',
  'trade-sync.rithmic.last-sync': 'अंतिम सिंक',
  'trade-sync.rithmic.never': 'कभी नहीं',
  'trade-sync.rithmic.job.running': 'सिंक चल रहा है…',
  'trade-sync.rithmic.job.last': 'अंतिम कार्य: {status}',
  'trade-sync.job.status.queued': 'कतार में',
  'trade-sync.job.status.running': 'चल रहा है',
  'trade-sync.job.status.succeeded': 'सफल',
  'trade-sync.job.status.partial': 'आंशिक',
  'trade-sync.job.status.failed': 'विफल',
  'trade-sync.job.status.cancelled': 'रद्द',
  'trade-sync.job.status.unknown': 'अज्ञात',
  'trade-sync.rithmic.sync-to-vault': 'सिंक',
  'trade-sync.rithmic.syncing': 'सिंक हो रहा है…',
  'trade-sync.rithmic.mapping-required':
    'प्रत्येक सिंक किए गए Rithmic खाते के लिए एक स्थानीय वॉल्ट खाता चुनें।',
  'trade-sync.rithmic.sync-complete-connection': '{connection} सिंक पूरा हुआ.',
  'trade-sync.rithmic.sync-partial-connection':
    '{connection} सिंक पूरा हुआ, लेकिन समस्याएँ हैं.',
  'trade-sync.rithmic.sync-all': 'सभी सिंक करें',
  'trade-sync.rithmic.sync-all-complete':
    '{total} Rithmic कनेक्शनों में से {succeeded} सिंक हुए।',
  'trade-sync.rithmic.sync-all-partial':
    '{total} Rithmic कनेक्शनों में से {succeeded} सिंक हुए। समस्या वाले कनेक्शन रिव्यू करें।',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic केवल एक सक्रिय सत्र की अनुमति देता है। इस Rithmic लॉगिन का उपयोग करने वाले R|Trader, NinjaTrader या अन्य प्लेटफ़ॉर्म बंद करें।',
  'trade-sync.rithmic.error.auto-retry': 'Journalit अपने आप फिर कोशिश करता है।',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic ने सहेजे गए क्रेडेंशियल अस्वीकार कर दिए। उन्हें Journalit.co पर अपडेट करके फिर कोशिश करें।',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic को R|Trader में मार्केट डेटा समझौतों पर हस्ताक्षर चाहिए। हस्ताक्षर करें, फिर फिर कोशिश करें।',
  'trade-sync.rithmic.error.disabled':
    'इस कनेक्शन के लिए Rithmic सिंक बंद है। इसे Journalit.co पर प्रबंधित करें।',
  'trade-sync.rithmic.error.sync-failed':
    'Rithmic सिंक विफल रहा। Journalit.co पर कनेक्शन जाँचें और फिर कोशिश करें।',
  'trade-sync.broker.mapping-unsaved-hint':
    'मैपिंग सिंक्रोनाइज़ करने पर सहेजी जाती है।',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'खाते में सहेजे नहीं गए बदलाव। उन्हें सहेजने के लिए उस कनेक्शन को सिंक्रोनाइज़ करें।',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    'पहले हर सिंक किए जाने वाले खाते के लिए एक Journalit खाता चुनें।',
  'trade-sync.broker.sync-all-blocked.running-job':
    'एक सिंक्रोनाइज़ेशन पहले से चल रहा है।',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'कोई भी कनेक्शन सिंक्रोनाइज़ करने के लिए तैयार नहीं है।',
  'trade-sync.rithmic.connect-another': 'एक और Rithmic खाता कनेक्ट करें',
  'trade-sync.rithmic.error.sync-failed-detail':
    'Rithmic सिंक विफल रहा: {message}',
  'trade-sync.import.card.connection': 'कनेक्शन',
  'trade-sync.import.card.backup': 'इंपोर्ट बैकअप',
  'trade-sync.import.card.restorable': 'पुनर्स्थापित करने योग्य ट्रेड्स',
  'trade-sync.import.card.import': 'Trade Import',

  'trade-sync.import.card.open-importer-desc':
    'वहाँ नई ब्रोकर फ़ाइलें इंपोर्ट करें',
  'trade-sync.import.card.inventory-summary':
    '{accounts} अकाउंट(s) · {trades} ट्रेड(s)',
  'trade-sync.import.action.check': 'जाँचें',

  'trade-sync.import.action.open-import': 'Trade Import खोलें',

  'trade-sync.import.action.create-local-account': 'अकाउंट बनाएं',
  'trade-sync.import.action.create-local-account-title':
    'बैकएंड अकाउंट नाम का उपयोग करके एक Journalit अकाउंट बनाएं।',
  'trade-sync.import.action.save-mapping': 'सहेजें',
  'trade-sync.import.action.save-mapping-title':
    'इस बैकएंड अकाउंट को स्थानीय अकाउंट मैपिंग में सहेजें।',

  'trade-sync.import.action.restore-account': 'रिस्टोर',
  'trade-sync.import.action.restore-account-title':
    'इस बैकएंड अकाउंट के लिए गुम स्थानीय ट्रेड नोट्स को पुनर्स्थापित करें।',
  'trade-sync.import.action.restoring': 'पुनर्स्थापित किया जा रहा है...',

  'trade-sync.import.pending-acks': '{count} लंबित ACK',

  'trade-sync.import.empty-accounts':
    'अभी तक कोई बैकअप Trade Import अकाउंट्स नहीं मिला।',
  'trade-sync.import.account.restorable-count':
    '{count} पुनर्स्थापित करने योग्य',
  'trade-sync.import.account.synced-count': '{count} सिंक किया गया',
  'trade-sync.import.account.missing-count': '{count} गायब है',
  'trade-sync.import.account.issue-count': '{count} मुद्दे',
  'notice.error.canonical-trade-type-change':
    'ब्रोकर-सिंक किया गया ट्रेड्स को किसी भिन्न ट्रेड प्रकार में नहीं बदला जा सकता।',
  'trade-sync.import.account.conflict-repair':
    'डुप्लिकेट canonicalTradeId नोट पाए गए। एक नोट रखें, फिर डुप्लिकेट नोट से canonicalTradeId हटा दें या उस डुप्लिकेट नोट को हटा दें। फ़ाइल का नाम बदलने से विरोध ठीक नहीं होता.',
  'trade-sync.import.account.local-account': 'Journalit अकाउंट',
  'trade-sync.import.account.mapping-hint':
    'पुनर्स्थापित ट्रेड्स को इस Journalit अकाउंट पर लिखा जाएगा।',
  'trade-sync.import.notice.restored':
    '{count} इंपोर्ट किया गया ट्रेड(s) को पुनर्स्थापित किया गया।',

  'trade-sync.import.notice.sync-cloud-failed':
    'क्लाउड सिंक प्रारंभ करने में असमर्थ.',
  'trade-sync.import.notice.load-failed':
    'Trade Import सिंक स्थिति लोड नहीं हो सकी.',
  'trade-sync.import.notice.mapping-failed':
    'Trade Import अकाउंट मैपिंग सहेजा नहीं जा सका.',
  'trade-sync.import.notice.create-account-failed':
    'स्थानीय अकाउंट नहीं बनाया जा सका.',
  'trade-sync.import.notice.restore-failed':
    'Trade Import अकाउंट को पुनर्स्थापित नहीं किया जा सका।',
  'trade-sync.rate-limit.action.mapping': 'खाता मैपिंग',
  'trade-sync.import.notice.rate-limited':
    '{action}: बहुत अधिक अनुरोध। {seconds} सेकंड में फिर से प्रयास करें।',
  'command.open-session-mode': 'सेशन मोड खोलें',
  'view.session-mode': 'सेशन मोड',

  'session-mode.loading': 'सत्र मोड लोड हो रहा है',

  'session-mode.section.timeline': 'समय',
  'session-mode.title.preparation': 'सत्र की तैयारी',
  'session-mode.title.live': 'लाइव सत्र',
  'session-mode.title.break': 'सत्र विराम',
  'session-mode.title.ended': 'सत्र ख़त्म हुआ',

  'session-mode.prep.resources': 'संसाधन',

  'session-mode.action.open-drc-for-date': '{date} के लिए DRC खोलें',
  'session-mode.ended.helper': 'उस दिन अपना ट्रेड्स या रिव्यू लॉग करें।',
  'session-mode.ended.action.import-trades': 'ट्रेड्स इंपोर्ट करें',
  'session-mode.ended.action.add-trade-manually':
    'ट्रेड को मैन्युअल रूप से जोड़ें',
  'session-mode.ended.action.open-drc': 'DRC खोलें',
  'session-log.session-group.unplanned': 'अनियोजित @ {time}',
  'session-mode.unplanned.name': 'अनियोजित सत्र',
  'session-mode.unplanned.start': 'अनियोजित सत्र शुरू करें',
  'session-mode.unplanned.stop': 'सत्र रोकें',
  'session-mode.unplanned.badge': 'अनियोजित',
  'session-mode.unplanned.status.live': '{time} पर शुरू · {elapsed} बीत चुके',
  'session-mode.unplanned.ended.summary':
    'अनियोजित सत्र · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'अनियोजित सत्र शुरू करें',
  'session-mode.unplanned.modal.description':
    'आप अपनी नियोजित सत्र विंडो से बाहर हैं। यह सत्र आपकी दैनिक समीक्षा में अनियोजित के रूप में चिह्नित होगा। लिखें कि आप अभी ट्रेड क्यों कर रहे हैं।',
  'session-mode.unplanned.modal.reason-label': 'कारण',
  'session-mode.unplanned.modal.reason-placeholder':
    'जैसे 14:00 पर FOMC, सुबह का सत्र छूट गया',
  'session-mode.unplanned.modal.reason-required':
    'शुरू करने से पहले कारण लिखें।',
  'session-mode.unplanned.notice.started': 'अनियोजित सत्र शुरू हुआ।',
  'session-mode.unplanned.notice.stopped': 'अनियोजित सत्र रोका गया।',
  'session-mode.unplanned.notice.blocked-live': 'एक सत्र पहले से चल रहा है।',
  'session-mode.unplanned.notice.none-running':
    'कोई अनियोजित सत्र नहीं चल रहा है।',
  'session-mode.unplanned.notice.failed':
    'अनियोजित सत्र अपडेट नहीं हो सका। विवरण के लिए कंसोल देखें।',
  'session-mode.ended.stat.trades': 'ट्रेड्स',
  'session-mode.ended.stat.notes': 'नोट्स',
  'session-mode.ended.stat.gate-checks': 'गेट की जाँच',
  'session-mode.waiting.next-session': 'अगला सत्र',
  'session-mode.waiting.starts-at': '{session} {time} से शुरू होता है',
  'session-mode.waiting.preparation-opens-in':
    'तैयारी {remaining} में खुलती है',
  'session-mode.waiting.open-drc': 'DRC खोलें',

  'session-mode.break.reset-before': '{session} से पहले रीसेट करें',
  'session-mode.break.reset': 'अगले सत्र से पहले रीसेट करें',
  'session-mode.break.next-session-meta':
    'अगला सत्र {time} · {remaining} शेष पर प्रारंभ होगा',
  'session-mode.break.description':
    'अगले सत्र से पहले दूर हटें, हाइड्रेट करें और अपने दिमाग को साफ़ करें।',
  'session-mode.break.open-drc': 'DRC खोलें',
  'session-mode.countdown.starts-in': 'में शुरू होता है',
  'session-mode.countdown.starts-at': '{session} {time} से शुरू होता है',
  'session-mode.countdown.hours': 'घंटे',
  'session-mode.countdown.minutes': 'मिन',
  'session-mode.countdown.seconds': 'सेकंड',
  'session-mode.phase.preparation': 'तैयारी',
  'session-mode.phase.live': 'लाइव',
  'session-mode.phase.waiting': 'इंतज़ार में',
  'session-mode.phase.break': 'तोड़ना',
  'session-mode.phase.ended': 'समाप्त',
  'session-mode.phase.unconfigured': 'सत्र शेड्यूल कॉन्फ़िगर नहीं किया गया',
  'session-mode.status.preparation':
    '{session} {time} से शुरू होता है। आपके पास तैयारी के लिए {remaining} है।',
  'session-mode.status.preparation-generic':
    'अगले लाइव ट्रेडिंग सत्र के लिए तैयारी करें।',
  'session-mode.status.waiting':
    '{session} {time} से शुरू होता है। {remaining} में तैयारी शुरू होती है.',
  'session-mode.status.waiting-generic':
    'आपका अगला सत्र निर्धारित है, लेकिन तैयारी अभी तक शुरू नहीं हुई है।',
  'session-mode.status.live': '{remaining} इस सत्र में शेष है।',
  'session-mode.status.live-generic': 'आपका ट्रेडिंग सत्र लाइव है.',
  'session-mode.status.break':
    '{session} {time} से शुरू होता है। आप {remaining} के लिए ब्रेक पर हैं।',
  'session-mode.status.break-generic': 'आप ट्रेडिंग सत्रों के बीच हैं।',
  'session-mode.status.ended':
    'आपके कॉन्फ़िगर किए गए ट्रेडिंग सत्र अभी समाप्त हो गए हैं।',
  'session-mode.status.unconfigured':
    'तैयारी, लाइव, ब्रेक और समाप्त चरणों को अनलॉक करने के लिए सत्र विंडो कॉन्फ़िगर करें। आज के DRC के लिए टाइमलाइन उपलब्ध है।',

  'session-mode.unconfigured.title': 'सत्र मोड सेट करें',
  'session-mode.unconfigured.description':
    'आरंभ करने के लिए अपने सत्र का समय जोड़ें.',
  'session-mode.unconfigured.step.window.title': 'एक सत्र विंडो जोड़ें',

  'session-mode.unconfigured.step.prep.title': 'रिव्यू तैयारी का समय',

  'session-mode.unconfigured.step.gate.title':
    'स्टार्टर ट्रेड गेट का उपयोग करें',

  'session-mode.unconfigured.step.log.title':
    'लाइव सत्र के दौरान नोट्स लॉग करें',

  'session-mode.unconfigured.action': 'सत्र मोड कॉन्फ़िगर करें',
  'session-mode.guide.why.title': 'अपनी योजना पर ट्रेड करें, मूड पर नहीं',
  'session-mode.guide.why.description':
    'सेशन मोड हर सेशन से पहले आपको तैयार करता है, लाइव के दौरान Trade Gate से आपको नियमों पर रखता है, और टाइमस्टैम्प वाला लॉग रखता है ताकि आप दिन को दोबारा देख सकें। सेट करने में दो मिनट लगते हैं।',
  'session-mode.guide.configure.title': 'अभी सेट करें',
  'session-mode.guide.configure.description':
    'अपने सेशन के समय जोड़ें और पहला Trade Gate बनाएँ। सेटिंग्स में एक छोटा गाइड आपकी मदद करेगा।',
  'session-mode.guide.preparation.countdown.title': 'आपका सेशन आने वाला है',
  'session-mode.guide.preparation.countdown.description':
    'यह तैयारी का चरण है। उल्टी गिनती बताती है आप कब लाइव होंगे, और यह पेज अपने आप लाइव मोड में बदल जाता है।',
  'session-mode.guide.preparation.goals.title': 'आज के लक्ष्य तय करें',
  'session-mode.guide.preparation.goals.description':
    'बाज़ार खुलने से पहले लिखें कि अच्छा सेशन कैसा दिखेगा, ताकि आपके पास कुछ हो जिस पर टिके रहें।',
  'session-mode.guide.preparation.checklist.title': 'अपनी चेकलिस्ट पूरी करें',
  'session-mode.guide.preparation.checklist.description':
    'यहाँ अपनी सेशन-पूर्व दिनचर्या टिक करें। जो भी टिक करेंगे वह आज के रिव्यू नोट में सहेजा जाएगा।',
  'session-mode.guide.preparation.next.title': 'जब आप लाइव हों',
  'session-mode.guide.preparation.next.description':
    'आपका Trade Gate और सेशन लॉग यहाँ दिखेंगे। पहली बार हम आपको दिखाएँगे।',
  'session-mode.guide.live.trade-gate.title':
    'हर ट्रेड से पहले Trade Gate चलाएँ',
  'session-mode.guide.live.trade-gate.description':
    'शुरू दबाएँ और अपने मानदंडों से बने सवालों के जवाब दें। गेट ग्रीन लाइट, रुको, या ट्रेड नहीं पर खत्म होता है, ताकि आप वही ट्रेड लें जो आपका सिस्टम अनुमति देता है।',
  'session-mode.guide.live.session-log.title': 'जो देखें और महसूस करें, लिखें',
  'session-mode.guide.live.session-log.description':
    'सेटअप, भावनाएँ और फैसले जैसे-जैसे हों, नोट करें। हर नोट पर टाइमस्टैम्प है, ताकि बाद में आप ठीक-ठीक देख सकें क्या चल रहा था।',
  'session-mode.guide.live.settings.title': 'कभी भी बदलें',
  'session-mode.guide.live.settings.description':
    'संपादित करें से सेशन मोड सेटिंग्स खुलती हैं: सेशन समय, चरण लेआउट, Trade Gate वर्कफ़्लो और लॉग टैग।',
  'session-mode.guide.ended.review.title': 'अब सेशन की समीक्षा करें',
  'session-mode.guide.ended.review.description':
    'समीक्षा के लिए आज का DRC खोलें। अपने DRC लेआउट में सेशन लॉग विजेट जोड़ें और हर टाइमस्टैम्प वाला नोट वहाँ दिखेगा।',
  'settings.session-mode.guide.setting-name': 'गाइड',
  'settings.session-mode.guide.setting-desc':
    'इन सेटिंग्स का छोटा टूर, सेशन समय से लेकर आपके पहले Trade Gate तक।',
  'settings.session-mode.guide.replay': 'गाइड दिखाएँ',
  'settings.session-mode.guide.intro.title': 'चलिए सेशन मोड सेट करें',
  'settings.session-mode.guide.intro.description':
    'चार चीज़ें: आपके सेशन कब चलते हैं, हर चरण क्या दिखाता है, आपका Trade Gate, और सेशन लॉग टैग।',
  'settings.session-mode.guide.lead-time.title': 'तैयारी का पूर्व समय',
  'settings.session-mode.guide.lead-time.description':
    'सेशन से कितने मिनट पहले तैयारी चरण खुलता है।',
  'settings.session-mode.guide.windows.title': 'अपनी सेशन विंडो जोड़ें',
  'settings.session-mode.guide.windows.description':
    'हर उस सेशन के लिए एक विंडो जिसमें आप ट्रेड करते हैं, नाम, शुरुआत और अंत के साथ। इसी से सेशन मोड जानता है कब तैयारी करनी है और कब आप लाइव हैं।',
  'settings.session-mode.guide.layout.title': 'चुनें हर चरण क्या दिखाए',
  'settings.session-mode.guide.layout.description':
    'चरण के अनुसार मॉड्यूल चालू या बंद करें: तैयारी में संसाधन, लक्ष्य और चेकलिस्ट; लाइव में Trade Gate और सेशन टाइमलाइन।',
  'settings.session-mode.guide.trade-gate.title': 'अपना Trade Gate बनाएँ',
  'settings.session-mode.guide.trade-gate.description':
    'पहली बार जोड़ें सामान्य सवालों से एक शुरुआती वर्कफ़्लो बनाता है, उसके बाद खाली; लाइब्रेरी में तैयार सवाल हैं। हर सवाल अगले सवाल या किसी नतीजे तक ले जाता है: ग्रीन लाइट, रुको, या ट्रेड नहीं।',
  'settings.session-mode.guide.editor.title': 'सवाल और नतीजे',
  'settings.session-mode.guide.editor.description':
    'सवाल जोड़ने और हर जवाब कहाँ ले जाए यह तय करने के लिए वर्कफ़्लो खोलें। प्ले बटन इसे वैसे ही चलाता है जैसे सेशन में दिखेगा।',
  'settings.session-mode.guide.tags.title': 'सेशन लॉग के लिए टैग',
  'settings.session-mode.guide.tags.description':
    'लॉग करते समय नोट्स को टैग करें, जैसे भावना या सेटअप के अनुसार, ताकि समीक्षा में उन्हें फ़िल्टर कर सकें।',
  'settings.session-mode.guide.finish.title': 'सब तैयार है',
  'settings.session-mode.guide.finish.description':
    'रिबन या होम से सेशन मोड खोलें। हर समीक्षा में नोट्स देखने के लिए DRC लेआउट में सेशन लॉग विजेट जोड़ें।',

  'session-mode.layout.empty.title': 'इस चरण के लिए कुछ भी सक्षम नहीं है',
  'session-mode.layout.empty.description':
    'इस सत्र मोड चरण को बनाने के लिए मॉड्यूल को वापस चालू करें।',
  'session-mode.duration.minutes': '{minutes}m',
  'session-mode.duration.hours': '{hours}h',
  'session-mode.duration.hours-minutes': '{hours}h {minutes}m',
  'settings.session-mode.title': 'सेशन मोड',
  'settings.session-mode.description':
    'सत्र विंडो, तैयारी, चरण लेआउट, ट्रेड गेट वर्कफ़्लो और सत्र लॉग टैग कॉन्फ़िगर करें।',
  'settings.session-mode.preparation-lead-time': 'तैयारी का समय (मिनट)',
  'settings.session-mode.preparation-lead-time-desc':
    'एक सत्र से पहले प्रारंभिक तैयारी मोड कैसे शुरू होता है।',
  'settings.session-mode.windows': 'सत्र खिड़कियाँ',

  'settings.session-mode.add-window-short': 'जोड़ें',
  'settings.session-mode.no-windows':
    'अभी तक कोई सत्र विंडो कॉन्फ़िगर नहीं की गई है. लाइव टाइमलाइन अभी भी काम करती है, लेकिन चरण-जागरूक तैयारी एक विंडो जोड़ने के बाद शुरू होती है।',
  'settings.session-mode.layout.title': 'चरण लेआउट',

  'settings.session-mode.layout.phase-desc.preparation':
    'ट्रेडिंग शुरू होने से पहले सत्र पूर्व तैयारी के दौरान जो दिखाई देता है उसे चुनें।',
  'settings.session-mode.layout.phase-desc.live':
    'चुनें कि कॉन्फ़िगर किए गए ट्रेडिंग सत्र के लाइव होने पर क्या दिखाई देता है।',

  'settings.session-mode.layout.phase-desc.ended':
    'चुनें कि सभी कॉन्फ़िगर किए गए ट्रेडिंग सत्र समाप्त होने के बाद क्या दिखाई देगा।',
  'settings.session-mode.layout.reset-phase': 'रीसेट',

  'settings.session-mode.layout.module.preparation-resources': 'संसाधन',
  'settings.session-mode.layout.module.preparation-resources-desc':
    'लिंक किए गए तैयारी नोट्स और प्लेबुक दिखाता है।',
  'settings.session-mode.layout.module.preparation-goals': 'गोल्स',
  'settings.session-mode.layout.module.preparation-goals-desc':
    'सत्र-पूर्व फोकस के लिए DRC लक्ष्य विजेट दिखाता है।',
  'settings.session-mode.layout.module.preparation-checklist': 'जांच सूची',
  'settings.session-mode.layout.module.preparation-checklist-desc':
    'सत्र पूर्व तैयारी के लिए DRC चेकलिस्ट विजेट दिखाता है।',
  'settings.session-mode.layout.module.trade-gate': 'ट्रेड गेट',
  'settings.session-mode.layout.module.trade-gate-desc':
    'लाइव सत्र के दौरान आपके कॉन्फ़िगर किए गए IF/THEN गेट को चलाता है।',
  'settings.session-mode.layout.module.timeline': 'सत्र समयरेखा',
  'settings.session-mode.layout.module.timeline-desc':
    'वर्तमान सत्र के नोट्स और ट्रेड टाइमलाइन प्रविष्टियाँ दिखाता है।',

  'settings.session-mode.layout.module.ended-actions':
    'सत्र के अंत की कार्रवाइयां',
  'settings.session-mode.layout.module.ended-actions-desc':
    'सत्र समाप्त होने के बाद इंपोर्ट, मैन्युअल ट्रेड और DRC क्रियाएँ दिखाता है।',
  'settings.session-mode.layout.module.ended-stats': 'सत्र आँकड़े',
  'settings.session-mode.layout.module.ended-stats-desc':
    'दिन के लिए ट्रेड, नोट और गेट-चेक योग दिखाता है।',
  'settings.session-mode.linked-resources': 'जुड़े हुए संसाधन',
  'settings.session-mode.linked-resources-desc':
    'तैयारी के दौरान त्वरित नोट लिंक दिखाएं।',
  'settings.session-mode.linked-resources-count': '{count} लिंक किया गया',
  'settings.session-mode.linked-resources-hide': 'छिपाएँ लिंक किया हुआ',
  'settings.session-mode.session-log': 'सत्र लॉग',
  'settings.session-mode.session-log-desc':
    'चुनें कि आपके सत्र नोट्स के साथ कौन से स्वचालित ईवेंट दिखाई देंगे।',
  'settings.session-mode.show-trade-executions': 'ट्रेड एंट्रीज़ और एग्जिट्स',
  'settings.session-mode.show-trade-executions-desc':
    'सत्र मोड और डेली रिव्यू लॉग में ट्रेड प्रविष्टियाँ और एग्जिट दिखाएँ।',
  'settings.session-mode.session-log-tags': 'सत्र लॉग टैग',
  'settings.session-mode.session-log-tags-desc':
    'सत्र मोड कंपोज़र और DRC सत्र लॉग में उपलब्ध टैग को अनुकूलित करें।',
  'settings.session-mode.tag-label-placeholder': 'टैग नाम',
  'settings.session-mode.tag-short-label-placeholder': 'लेबल',
  'settings.session-mode.tag-label-example': 'ट्रेड',
  'settings.session-mode.tag-short-label-example': 'टी.आर.',
  'settings.session-mode.tag-color': 'रंग टैग करें',
  'settings.session-mode.tag-requires-resolution': 'वर्गीकरण की आवश्यकता है',
  'settings.session-mode.tag-lesson': 'पाठ टैग',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'इस टैग वाली प्रविष्टियों को अवर्गीकृत नोट्स के रूप में माना जाता है। सत्र के दौरान सही टैग स्पष्ट न होने पर इसका उपयोग करें; एंट्री को बाद में वर्गीकृत करें।',
  'settings.session-mode.tag-lesson-tooltip':
    'इस टैग को सीखने वाले एंट्री के रूप में चिह्नित करता है। पाठ-टैग किए गए नोट्स सत्र लॉग में रहते हैं और पाठ फ़िल्टर्स और रिव्यू सारांश द्वारा सामने लाए जा सकते हैं।',
  'settings.session-mode.add-session-log-tag': 'सत्र लॉग टैग जोड़ें',
  'settings.session-mode.reset-session-log-tags': 'रीसेट',
  'settings.session-mode.tag-color.blue': 'नीला',
  'settings.session-mode.tag-color.indigo': 'नील',
  'settings.session-mode.tag-color.purple': 'बैंगनी',
  'settings.session-mode.tag-color.green': 'हरा',
  'settings.session-mode.tag-color.pink': 'गुलाबी',
  'settings.session-mode.tag-color.amber': 'अंबर',
  'settings.session-mode.tag-color.red': 'लाल',
  'settings.session-mode.tag-color.orange': 'नारंगी',
  'settings.session-mode.search-resource-placeholder':
    'लिंक करने के लिए वॉल्ट फ़ाइलें खोजें...',

  'settings.session-mode.window-name': 'सत्र का नाम',
  'settings.session-mode.window-name-placeholder': 'जैसे एनवाई एएम',

  'settings.session-mode.start-time': 'समय शुरू',
  'settings.session-mode.end-time': 'अंत समय',
  'widget.session-log.name': 'सत्र लॉग',
  'widget.session-log.description':
    'टाइमस्टैम्प्ड निष्पादन नोट्स और ट्रेड ईवेंट कैप्चर करें।',
  'session-log.title': 'सत्र मोड लॉग',
  'session-log.description':
    'वर्तमान ट्रेडिंग सत्र के दौरान क्या हुआ, इसे कैप्चर करें।',
  'session-log.notice.invalid-timestamp':
    'एक वैध सत्र-लॉग टाइमस्टैम्प दर्ज करें।',
  'session-log.action.auto-time': 'ऑटो समय',
  'session-log.action.set-time': 'निर्धारित समय',

  'session-log.composer.tag-label': 'सत्र लॉग टैग',
  'session-log.placeholder.entry-short': 'सत्र नोट जोड़ें...',
  'session-log.action.add-entry': 'टाइमस्टैम्प्ड एंट्री जोड़ें',
  'session-log.action.add-note': 'जोड़ें',
  'session-log.action.hide-composer': 'संगीतकार छिपाएँ',
  'session-log.filter.all': 'सभी',
  'session-log.filter.label': 'फ़िल्टर सत्र लॉग',
  'session-log.filter.clear': 'फ़िल्टर साफ़ करें',
  'session-log.timeline.most-recent': 'सबसे हाल का',
  'session-log.timeline.start': 'सत्र का प्रारम्भ',
  'session-log.empty': 'अभी तक कोई सत्र लॉग प्रविष्टियाँ नहीं.',
  'session-log.empty-filtered': 'कोई भी प्रविष्टि इस फ़िल्टर से मेल नहीं खाती।',
  'session-log.loading': 'सत्र लॉग लोड हो रहा है...',
  'session-log.session-group.outside': 'बाहरी सत्र',
  'session-log.lessons.title': 'सीख सीखी',

  'session-log.lessons.badge': 'एलएसएन',

  'session-log.trade.entered': 'प्रविष्टि की',
  'session-log.trade.exited': 'बाहर निकल गए',
  'session-log.trade.size': 'आकार',

  'session-log.status.unclassified': 'अवर्गीकृत',
  'session-log.action.save': 'सहेजें',
  'session-log.action.cancel': 'रद्द करें',

  'session-log.action.classify': 'वर्गीकृत करें',
  'session-log.action.edit': 'एडिट',
  'session-log.action.delete': 'हटाएँ',
  'session-log.action.open-trade': 'ट्रेड खोलें',
  'session-log.preview':
    'सत्र लॉग प्रिव्यू: टाइमस्टैम्प्ड नोट्स और ट्रेड इवेंट सत्र मोड के दौरान यहां दिखाई देंगे।',
  'session-log.alert.tag-concentration':
    '{tag} सत्र नोट्स का {percentage}% है ({count}/{total})। इस सत्र में मानसिकता एक प्रमुख विषय था।',

  'trade-gate.workflow': 'कार्यप्रवाह',

  'trade-gate.action.start-short': 'शुरू',
  'trade-gate.action.start-another': 'दूसरा प्रारंभ करें',
  'trade-gate.outcome.green-light': 'हरी बत्ती',
  'trade-gate.outcome.green-light-description': 'शर्तें पूरी हुईं.',
  'trade-gate.outcome.no-trade': 'कोई ट्रेड नहीं',
  'trade-gate.outcome.no-trade-description': 'शर्तें पूरी नहीं हुईं.',
  'trade-gate.outcome.wait': 'इंतज़ार',
  'trade-gate.outcome.wait-description':
    'सेटअप तैयार नहीं है. अगले अवसर की प्रतीक्षा करें.',
  'settings.session-mode.trade-gate.title': 'ट्रेड गेट वर्कफ़्लोज़',
  'settings.session-mode.trade-gate.desc':
    'लाइव एंट्री जांच के लिए IF/THEN निर्णय प्रवाह बनाएं।',
  'settings.session-mode.trade-gate.delete-workflow.title':
    'ट्रेड गेट वर्कफ़्लो हटाएँ?',
  'settings.session-mode.trade-gate.delete-workflow.message':
    '"{name}" हटाएं? यह इस वर्कफ़्लो में प्रत्येक प्रश्न और शाखा को हटा देता है। इस एक्शन को वापस नहीं किया जा सकता।',
  'settings.session-mode.trade-gate.delete-workflow.confirm': 'वर्कफ़्लो हटाएँ',
  'settings.session-mode.trade-gate.name': 'वर्कफ़्लो नाम',
  'settings.session-mode.trade-gate.untitled': 'शीर्षक रहित वर्कफ़्लो',
  'settings.session-mode.trade-gate.start-node': 'प्रश्न प्रारंभ करें',
  'settings.session-mode.trade-gate.simulation.show': 'अनुकरण',
  'settings.session-mode.trade-gate.simulation.unavailable':
    'सिमुलेशन शुरू करने से पहले आरंभ प्रश्न को कम से कम एक पूर्ण परिणाम से जोड़ें।',
  'settings.session-mode.trade-gate.add-question': 'प्रश्न जोड़ें',
  'settings.session-mode.trade-gate.question': 'सवाल',
  'settings.session-mode.trade-gate.new-question-title': 'नया प्रश्न',
  'settings.session-mode.trade-gate.edit-question': 'प्रश्न संपादित करें',
  'settings.session-mode.trade-gate.question-title': 'प्रश्न का शीर्षक',
  'settings.session-mode.trade-gate.prompt': 'तत्पर',
  'settings.session-mode.trade-gate.options': 'ऑप्शंस',
  'settings.session-mode.trade-gate.option': 'विकल्प',
  'settings.session-mode.trade-gate.no-options':
    'इस प्रश्न के लिए उत्तर विकल्प जोड़ें.',
  'settings.session-mode.trade-gate.option-label': 'विकल्प लेबल',
  'settings.session-mode.trade-gate.option-target': 'ओर जाता है',
  'settings.session-mode.trade-gate.not-wired':
    'अभी तक वायर्ड नहीं किया गया है',
  'settings.session-mode.trade-gate.not-wired-hint':
    'कनेक्ट करने के लिए क्लिक करें',
  'settings.session-mode.trade-gate.target-group-questions': 'प्रश्न',
  'settings.session-mode.trade-gate.target-current': 'वर्तमान: {title}',
  'settings.session-mode.trade-gate.target-group-outcomes': 'परणाम',
  'settings.session-mode.trade-gate.new-question-target': '+ नया प्रश्न',
  'settings.session-mode.trade-gate.outcome-note': 'परिणाम नोट (केवल यह शाखा)',
  'settings.session-mode.trade-gate.remove-from-workflow':
    'इस वर्कफ़्लो से हटाएँ',
  'settings.session-mode.trade-gate.used-in-workflows':
    '{count} वर्कफ़्लो में प्रयुक्त',
  'settings.session-mode.trade-gate.not-used': 'अभी तक उपयोग नहीं किया गया',
  'settings.session-mode.trade-gate.question-count': '{count} प्रश्न',
  'settings.session-mode.trade-gate.library-title': 'प्रश्न पुस्तकालय',
  'settings.session-mode.trade-gate.library-search': 'प्रश्न खोजें...',
  'settings.session-mode.trade-gate.library-empty':
    'कोई प्रश्न नहीं मिला. आरंभ करने के लिए एक बनाएं.',
  'settings.session-mode.trade-gate.delete-question.title': 'प्रश्न हटाएँ?',
  'settings.session-mode.trade-gate.delete-question.message':
    'प्रश्न लाइब्रेरी से "{name}" हटाएं? इस एक्शन को वापस नहीं किया जा सकता।',
  'settings.session-mode.trade-gate.delete-question.message-used':
    'प्रश्न लाइब्रेरी से "{name}" हटाएं? इसका उपयोग इसमें किया जाता है: {workflows}। उन वर्कफ़्लोज़ में इसकी शाखाएँ हटा दी जाएंगी. इस एक्शन को वापस नहीं किया जा सकता।',
  'settings.session-mode.trade-gate.delete-question.confirm': 'प्रश्न हटाएँ',
  'settings.session-mode.trade-gate.unplaced-title':
    'इस वर्कफ़्लो में, अभी तक कनेक्ट नहीं हुआ है',
  'settings.session-mode.trade-gate.flow-map': 'प्रवाह मानचित्र',
  'settings.session-mode.trade-gate.flow-fit': 'उपयुक्त',
  'settings.session-mode.trade-gate.flow-click-hint':
    'किसी कार्ड, पथ लेबल या परिणाम को संपादित करने के लिए उस पर क्लिक करें।',
  'settings.session-mode.trade-gate.flow-truncated':
    'यह प्रवाह पूर्णतः प्रदर्शित करने के लिए बहुत बड़ा है। कुछ दोहराई गई शाखाएँ छिपी हुई हैं।',
  'settings.session-mode.trade-gate.no-start':
    'प्रवाह देखने के लिए एक आरंभ प्रश्न चुनें.',
  'settings.session-mode.trade-gate.no-questions':
    'इस वर्कफ़्लो को शुरू करने के लिए पहला प्रश्न जोड़ें।',
  'filter.modal.image.annotation-status': 'एनोटेशन स्थिति',
  'filter.modal.image.status.tagged': 'टैग',
  'filter.modal.image.status.untagged': 'टैग नहीं किए गए',
  'filter.modal.image.status.has-notes': 'नोट्स हैं',
  'filter.modal.image.status.no-notes': 'कोई नोट नहीं',
  'filter.modal.image.tags': 'मीडिया टैग',
  'setups.view.detail.action.gallery': 'गैलरी खोलें',
  'tradelog.mode.label': 'ट्रेड लॉग मोड',
  'tradelog.mode.trades': 'ट्रेड्स',
  'tradelog.mode.image-gallery': 'गैलरी',

  'imageGallery.empty.error.title': 'गैलरी अनुपलब्ध',
  'imageGallery.empty.no-images.title': 'अभी तक कोई मीडिया नहीं',
  'imageGallery.empty.no-images.description':
    'ट्रेड्स या रिव्यू नोट्स से जुड़ी छवियां, GIF, वीडियो और YouTube लिंक यहां स्वचालित रूप से दिखाई देंगे।',
  'imageGallery.empty.no-results.title':
    'कोई भी मीडिया इन फ़िल्टर्स से मेल नहीं खाता',
  'imageGallery.empty.no-results.description':
    'अधिक गैलरी आइटम को दृश्य में वापस लाने के लिए सक्रिय फ़िल्टर को साफ़ करने या दिनांक सीमा को बढ़ाने का प्रयास करें।',
  'imageGallery.empty.no-source.title': 'इस स्रोत में कोई मीडिया नहीं',
  'imageGallery.empty.no-source.description':
    'इस स्रोत में अभी तक गैलरी आइटम नहीं हैं। सभी मीडिया पर वापस जाएँ या कोई भिन्न स्रोत चुनें।',
  'imageGallery.empty.action.clear-filters': 'फ़िल्टर साफ़ करें',
  'imageGallery.empty.action.show-all': 'सभी मीडिया दिखाएँ',
  'imageGallery.error.load-failed': 'गैलरी लोड नहीं हो सकी.',

  'imageGallery.open-source': 'खुला स्त्रोत',
  'imageGallery.image-alt': '{date} से {source} मीडिया',
  'imageGallery.privacy-blurred': 'गोपनीयता के लिए धुंधला कर दिया गया',

  'imageGallery.sort.label': 'क्रम से लगाना:',
  'imageGallery.sort.newest': 'नवीनतम',
  'imageGallery.sort.oldest': 'सबसे पुराने',
  'imageGallery.sort.best': 'सर्वश्रेष्ठ P&L',
  'imageGallery.sort.worst': 'सबसे खराब P&L',
  'imageGallery.size-aria': 'गैलरी मीडिया का आकार',
  'imageGallery.size.small': 'छोटा',
  'imageGallery.size.medium': 'मध्यम',
  'imageGallery.size.large': 'बड़ा',
  'imageGallery.view-mode-aria': 'गैलरी कार्ड समूहन',
  'imageGallery.view-mode.grouped': 'समूहीकृत',
  'imageGallery.view-mode.individual': 'व्यक्ति',
  'imageGallery.group.additional-media': '{count} अतिरिक्त मीडिया आइटम',
  'imageGallery.group.annotation-summary':
    '{total} मीडिया आइटम का {annotated} एनोटेट किया गया',
  'imageGallery.group.navigation':
    '{mediaTotal} का मीडिया {mediaCurrent} · {groupTotal} का एंट्री {groupCurrent}',
  'imageGallery.source.label': 'स्रोत:',
  'imageGallery.source.all': 'सभी मीडिया',
  'imageGallery.source.trade': 'ट्रेड्स',
  'imageGallery.source.folder': 'फ़ोल्डर',
  'imageGallery.source.reviews': 'रिव्यू',
  'imageGallery.source.drc': 'दैनिक रिव्यूज़',
  'imageGallery.source.weekly': 'साप्ताहिक रिव्यूज़',
  'imageGallery.source.monthly': 'मासिक रिव्यूज़',
  'imageGallery.source.quarterly': 'त्रैमासिक रिव्यूज़',
  'imageGallery.source.yearly': 'वार्षिक रिव्यूज़',

  'imageGallery.annotation.reviewed': 'रिव्यू हो चुका',
  'imageGallery.annotation.unreviewed': 'समीक्षा नहीं की गई',
  'imageGallery.date.unknown': 'अज्ञात तिथि',
  'imageGallery.annotation.tag': 'टैग',

  'imageGallery.annotation.editor-title': 'एनोटेट मीडिया',
  'imageGallery.annotation.editor-title-with-file':
    '{fileName} पर टिप्पणी करें',
  'imageGallery.annotation.tags': 'टैग्स',
  'imageGallery.annotation.tags-placeholder': 'ब्रेकआउट, A+ सेटअप, गलती',
  'imageGallery.annotation.notes': 'नोट्स',
  'imageGallery.annotation.notes-placeholder':
    'इस चार्ट से आपको भविष्य में क्या सीखना चाहिए?',
  'imageGallery.annotation.error.save-failed':
    'मीडिया एनोटेशन सहेजा नहीं जा सका.',
  'imageGallery.annotation.error.load-failed':
    'मीडिया एनोटेशन लोड नहीं किया जा सका.',
  'imageGallery.annotation.saving': 'सहेजा जा रहा है...',
  'settings.gallery-folders.section': 'मीडिया गैलरी',
  'settings.gallery-folders.description':
    'ट्रेड लॉग गैलरी में इन फ़ोल्डरों से मीडिया दिखाएं।',
  'settings.gallery-folders.placeholder': 'एक फ़ोल्डर चुनें...',
  'settings.gallery-folders.add': 'जोड़ें',
  'settings.gallery-folders.remove-aria': 'गैलरी फ़ोल्डर {path} निकालें',
  'settings.gallery-folders.not-a-folder':
    'मीडिया फ़ाइल के बजाय एक फ़ोल्डर चुनें.',
  'settings.gallery-folders.save-failed':
    'गैलरी फ़ोल्डर सहेजने में विफल. कृपया पुन: प्रयास करें।',
  'tradelog.guide.switch-to-gallery.title': 'ट्रेड्स से गैलरी पर स्विच करें',
  'tradelog.guide.switch-to-gallery.description':
    'नियमित ट्रेड लॉग और गैलरी के बीच जाने के लिए इस मोड चयनकर्ता का उपयोग करें। अपनी छवियों, GIF, वीडियो और YouTube लिंक के साथ भ्रमण जारी रखने के लिए गैलरी पर क्लिक करें।',

  'tradelog.guide.gallery-grouping.title': 'जर्नल एंट्री द्वारा समूह मीडिया',
  'tradelog.guide.gallery-grouping.description':
    'समूहीकृत प्रत्येक ट्रेड, रिव्यू, या कॉन्फ़िगर किए गए फ़ोल्डर को एक साथ रखता है। व्यक्ति प्रत्येक मीडिया आइटम को अपने कार्ड के रूप में प्रदर्शित करता है।',
  'tradelog.guide.gallery-source-sort.title': 'मीडिया स्रोत और ऑर्डर चुनें',
  'tradelog.guide.gallery-source-sort.description':
    'सभी मीडिया, ट्रेड अनुलग्नकों, रिव्यू-नोट मीडिया, या कॉन्फ़िगर किए गए वॉल्ट फ़ोल्डरों पर ध्यान केंद्रित करने के लिए स्रोत का उपयोग करें। रिव्यू आइटम को नवीनतम से सबसे पुराने या ट्रेड प्रदर्शन के आधार पर क्रमित करें का उपयोग करें।',
  'tradelog.guide.gallery-size.title': 'गैलरी प्रिव्यू आकार समायोजित करें',
  'tradelog.guide.gallery-size.description':
    'कॉम्पैक्ट स्कैनिंग और बड़े मीडिया पूर्वावलोकन के बीच स्विच करने के लिए इन आकार के बटनों का उपयोग करें।',
  'tradelog.guide.gallery-filters.title':
    'फ़िल्टर समान एंट्री बिंदु वाली गैलरी',
  'tradelog.guide.gallery-filters.description':
    'फ़िल्टर बटन अभी भी उन्नत फ़िल्टर्स खोलता है। गैलरी मोड में इसमें मीडिया-विशिष्ट फ़िल्टर्स जैसे एनोटेशन स्थिति और मीडिया टैग भी शामिल हैं।',
  'tradelog.guide.gallery-filter-modal.title':
    'मीडिया फ़िल्टर्स आपके ट्रेड फ़िल्टर्स के साथ लाइव',
  'tradelog.guide.gallery-filter-modal.description':
    'ट्रेड फ़िल्टर्स को मीडिया फ़िल्टर्स के साथ संयोजित करने के लिए इस मोडल का उपयोग करें। उदाहरण के लिए, फ़िल्टर से एक सेटअप, फिर केवल नोट्स या विशिष्ट मीडिया टैग वाला मीडिया दिखाएं।',
  'tradelog.guide.gallery-grid.title': 'करीब रिव्यू के लिए मीडिया खोलें',
  'tradelog.guide.gallery-grid.description':
    'प्रत्येक कार्ड कॉम्पैक्ट ट्रेड और रिव्यू संदर्भ दिखाते हुए मीडिया को अबाधित रखता है। किसी भी कार्ड पर क्लिक करें, या पहले दृश्यमान आइटम को पूर्णस्क्रीन खोलने के लिए अगला दबाएँ।',
  'tradelog.guide.gallery-fullscreen-actions.title':
    'फुलस्क्रीन से मीडिया को एनोटेट करें',
  'tradelog.guide.gallery-fullscreen-actions.description':
    'जब आइटम निरीक्षण के लिए पर्याप्त बड़ा हो तो मीडिया-स्तरीय टैग और नोट्स जोड़ने के लिए टैग का उपयोग करें। खुला स्रोत ट्रेड, रिव्यू, या फ़ोल्डर मीडिया फ़ाइल खोलता है।',
  'tradelog.guide.gallery-open-annotation.title': 'एनोटेशन पैनल खोलें',
  'tradelog.guide.gallery-open-annotation.description':
    'इस विशिष्ट मीडिया आइटम को एनोटेट करने के लिए टैग पर क्लिक करें। मीडिया टैग और नोट्स अनुलग्नक का वर्णन करते हैं, संपूर्ण ट्रेड का नहीं।',
  'tradelog.guide.gallery-annotation-panel.title': 'मीडिया टैग और नोट्स जोड़ें',
  'tradelog.guide.gallery-annotation-panel.description':
    'लिक्विडिटी स्वीप या असफल ब्रेकआउट जैसे चार्ट-विशिष्ट विचारों के लिए मीडिया टैग का उपयोग करें, और बाजार-संरचना संदर्भ के लिए नोट्स का उपयोग करें जिन्हें आप याद रखना चाहते हैं।',
  'tradelog.guide.gallery-finish.title': 'अब आप दोनों ट्रेड लॉग मोड जानते हैं',
  'tradelog.guide.gallery-finish.description':
    'जब आपको टेबल और बैच टूल की आवश्यकता हो तो ट्रेड्स का उपयोग करें। जब आप अपने जर्नल में रिव्यू छवियां, GIF, वीडियो, YouTube लिंक और एनोटेशन चाहते हैं तो गैलरी का उपयोग करें।',
  'tradelog.guide.image-gallery-empty.intro.title': 'अभी तक कोई मीडिया नहीं',
  'tradelog.guide.image-gallery-empty.intro.description':
    'ट्रेड्स या रिव्यू नोट्स में मीडिया जोड़ें, या ट्रेडिंग सेटिंग्स में मीडिया गैलरी फ़ोल्डर कॉन्फ़िगर करें। एक बार मीडिया मौजूद हो जाने पर, Journalit फुलस्क्रीन रिव्यू, टैग और नोट्स के लिए पूरी गैलरी गाइड दिखाएगा।',

  'filter.modal.section.image-gallery': 'गैलरी',
  'filter.modal.session-tags.placeholder': 'सत्र टैग',
  'filter.modal.session-tags.all': 'सभी सत्र टैग',
  'filter.modal.session-tags.n-selected': '{count} सत्र टैग',
  'filter.modal.session-tags.select-all': 'सभी चुनें',
  'filter.modal.session-tags.none-found': 'कोई सत्र टैग नहीं मिला',

  'home.mode.overview': 'ओवरव्यू',
  'home.mode.dashboard': 'डैशबोर्ड',
  'home.mode.aria': 'होम मोड स्विच करें',
  'home.filters.period': 'अवधि',
  'home.filters.trade-type': 'ट्रेड प्रकार',
  'home.filters.accounts': 'अकाउंट्स',
  'home.filters.back': 'वापस',
  'filter.reset': 'फ़िल्टर्स रीसेट करें',
  'home.guide.modes.title': 'एक और बात: डैशबोर्ड',
  'home.guide.modes.description':
    'अवलोकन और डैशबोर्ड इस पृष्ठ को साझा करते हैं। अपने प्रदर्शन आँकड़ों का संक्षिप्त दौरा जारी रखने के लिए अभी डैशबोर्ड पर स्विच करें।',
  'home.guide.whats-new.mode.title': 'एक होम, दो मोड',
  'home.guide.whats-new.mode.description':
    'अवलोकन और डैशबोर्ड अब एक पृष्ठ साझा करते हैं। लेआउट खोए बिना यहां मोड स्विच करें या पोजीशन स्क्रॉल करें।',
  'home.guide.whats-new.filters.title': 'होम फ़िल्टर्स एक ही स्थान पर हैं',
  'home.guide.whats-new.filters.description':
    'कॉम्पैक्ट स्तरित मेनू से अवधि, ट्रेड प्रकार, या अकाउंट चुनने के लिए फ़िल्टर बटन खोलें।',
  'home.guide.whats-new.done.title': 'आपका कार्यक्षेत्र संदर्भ में रहता है',
  'home.guide.whats-new.done.description':
    'गहन विश्लेषण के लिए अपने व्यक्तिगत विजेट्स और डैशबोर्ड के लिए अवलोकन का उपयोग करें। प्रत्येक मोड अपना स्वयं का फ़िल्टर्स और लेआउट रखता है।',

  'view.home': 'होम',
  'common.lose': 'लूज़',

  'dashboard.conversion.requires-conversion':
    'बहु-मुद्रा P&L चार्ट को विनिमय-दर रूपांतरण की आवश्यकता होती है।',

  'auth.error.invalid-email': 'कृपया एक मान्य ईमेल पता प्रविष्ट करें',
  'auth.error.invalid-code': 'अमान्य सत्यापन कोड',
  'form.layout.guide-trigger-label': 'फ़ॉर्म कस्टमाइज़ करें',
  'dashboard.filter.setup.none-found': 'कोई सेटअप्स नहीं मिला',
  'nav.weekly': 'वीकली रिव्यू',
  'weekly.overview.drawdown-chart.empty':
    'प्रदर्शित करने के लिए कोई ड्रॉडाउन डेटा नहीं',
  'trade-sync.gate.signin.cta': 'साइन इन करें',
  'backend.progress.ftp.desc': 'क्रेडेंशियल बनाएँ',
  'csv.errors.group.close-only': 'केवल बंद निष्पादन को छोड़ दिया गया',
  'csv.report.file': 'फ़ाइल: {file}',
  'csv.broker-guide.sierrachart.warning.message':
    'एक्सपोर्ट विकल्प अनएडजस्टेड कीमतें सेव करता है। "Save Log As" दिखाई गई कीमतें रखता है।',
  'csv.broker-guide.rithmic.step-1':
    'आर में ओपन ऑर्डर हिस्ट्री | ट्रेडर प्रो और फ़िल्टर आपके अकाउंट/तिथि के लिए पूर्ण/भरे हुए ऑर्डर के लिए',
  'csv.broker-guide.rithmic.step-2':
    'कॉलम जोड़ें/निकालें का उपयोग करें और सुनिश्चित करें कि साइड, प्रतीक, भरी गई मात्रा, औसत भरण मूल्य और भरने/अपडेट का समय दिखाई दे रहा है।',
  'trade.details.execution': 'कार्यान्वयन',
  'drc.preparation.checklist.title': 'प्री-ट्रेड चेकलिस्ट',
  'onboarding.welcome.insight.timing.title': 'समय पैटर्न',
  'onboarding.wizard.error.account-service': 'अकाउंटपेजसेवा उपलब्ध नहीं है',
  'account.create.field.drawdown-type-desc':
    'कोई नहीं | निश्चित | ईओडी ट्रेलिंग | नियमावली',
  'account.edit.field.drawdown-type-desc':
    'कोई नहीं | निश्चित | ईओडी ट्रेलिंग | नियमावली',
  'monthly.game.header.a-games': 'A गेम्स',
  'trade-import.preview.message.no-open-match':
    'केवल क्लोज़ प्रिव्यू के लिए कोई मेल खाता खुला ट्रेड नहीं मिला',
  'setups.view.action.refresh': 'ताज़ा करें',
  'setups.view.detail.no-playbook': 'अभी तक कोई प्लेबुक नहीं लिखी गई है.',
  'setups.view.detail.execution-gap.title': 'निष्पादन अंतराल',
  'trade-sync.import.action.sync-cloud': 'क्लाउड ट्रेड्स सिंक करें',
  'session-mode.unconfigured.step.gate.description':
    'स्टार्टर IF/THEN चेकलिस्ट तैयार है।',
  'session-log.placeholder.entry':
    'आप क्या देख रहे हैं, सोच रहे हैं या महसूस कर रहे हैं?',

  'home.widget.streak.kind.trade-outcome': 'ट्रेड परिणाम',
  'home.widget.streak.kind.trade-review': 'ट्रेड रिव्यू',
  'home.widget.streak.kind.drc-review': 'DRC रिव्यू',
  'home.widget.streak.kind.weekly-review': 'साप्ताहिक रिव्यू',
  'home.widget.streak.kind.monthly-review': 'मासिक रिव्यू',
  'home.widget.streak.configure': 'स्ट्रीक प्रकार चुनें',
  'home.widget.streak.configure-aria': '{kind} स्ट्रीक कॉन्फ़िगर करें',
  'home.widget.streak.no-review-streak': 'कोई सक्रिय रिव्यू लकीर नहीं',
  'home.widget.streak.start-reviewing':
    'एक स्ट्रीक बनाने के लिए रिव्यू शुरू करें',
  'home.widget.streak.keep-reviewing': 'जारी रखने के लिए रिव्यू करते रहें',
  'home.widget.streak.reviewed-trades-in-a-row.one':
    'एक पंक्ति में रिव्यू किया गया ट्रेड',
  'home.widget.streak.reviewed-trades-in-a-row.few':
    'एक पंक्ति में रिव्यू किए गए ट्रेड्स',
  'home.widget.streak.reviewed-trades-in-a-row.many':
    'एक पंक्ति में रिव्यू किए गए ट्रेड्स',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'एक पंक्ति में रिव्यू किए गए ट्रेड्स',
  'home.widget.streak.reviewed-days-in-a-row.one':
    'एक पंक्ति में रिव्यू किया गया दिन',
  'home.widget.streak.reviewed-days-in-a-row.few':
    'एक पंक्ति में रिव्यू किए गए दिन',
  'home.widget.streak.reviewed-days-in-a-row.many':
    'एक पंक्ति में रिव्यू किए गए दिन',
  'home.widget.streak.reviewed-days-in-a-row.other':
    'एक पंक्ति में रिव्यू किए गए दिन',
  'home.widget.streak.reviewed-weeks-in-a-row.one':
    'एक पंक्ति में रिव्यू किया गया सप्ताह',
  'home.widget.streak.reviewed-weeks-in-a-row.few':
    'एक पंक्ति में रिव्यू किए गए सप्ताह',
  'home.widget.streak.reviewed-weeks-in-a-row.many':
    'एक पंक्ति में रिव्यू किए गए सप्ताह',
  'home.widget.streak.reviewed-weeks-in-a-row.other':
    'एक पंक्ति में रिव्यू किए गए सप्ताह',
  'home.widget.streak.reviewed-months-in-a-row.one':
    'एक पंक्ति में रिव्यू किया गया महीना',
  'home.widget.streak.reviewed-months-in-a-row.few':
    'एक पंक्ति में रिव्यू किए गए महीने',
  'home.widget.streak.reviewed-months-in-a-row.many':
    'एक पंक्ति में रिव्यू किए गए महीने',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'एक पंक्ति में रिव्यू किए गए महीने',
  'home.widget.streak.missed-trades.one':
    'आपके पिछले रिव्यू के बाद से {count} ट्रेड छूट गया',
  'home.widget.streak.missed-trades.few':
    'आपके पिछले रिव्यू के बाद से {count} ट्रेड्स छूट गए',
  'home.widget.streak.missed-trades.many':
    'आपके पिछले रिव्यू के बाद से {count} ट्रेड्स छूट गए',
  'home.widget.streak.missed-trades.other':
    'आपके पिछले रिव्यू के बाद से {count} ट्रेड्स छूट गए',
  'home.widget.streak.missed-days.one':
    'आपके पिछले रिव्यू के बाद से {count} दिन छूट गया',
  'home.widget.streak.missed-days.few':
    'आपके पिछले रिव्यू के बाद से {count} दिन छूट गए',
  'home.widget.streak.missed-days.many':
    'आपके पिछले रिव्यू के बाद से {count} दिन छूट गए',
  'home.widget.streak.missed-days.other':
    'आपके पिछले रिव्यू के बाद से {count} दिन छूट गए',
  'home.widget.streak.missed-weeks.one':
    'आपके पिछले रिव्यू के बाद से {count} सप्ताह छूट गया',
  'home.widget.streak.missed-weeks.few':
    'आपके पिछले रिव्यू के बाद से {count} सप्ताह छूट गए',
  'home.widget.streak.missed-weeks.many':
    'आपके पिछले रिव्यू के बाद से {count} सप्ताह छूट गए',
  'home.widget.streak.missed-weeks.other':
    'आपके पिछले रिव्यू के बाद से {count} सप्ताह छूट गए',
  'home.widget.streak.missed-months.one':
    'आपके पिछले रिव्यू के बाद से {count} महीना छूट गया',
  'home.widget.streak.missed-months.few':
    'आपके पिछले रिव्यू के बाद से {count} महीने छूट गए',
  'home.widget.streak.missed-months.many':
    'आपके पिछले रिव्यू के बाद से {count} महीने छूट गए',
  'home.widget.streak.missed-months.other':
    'आपके पिछले रिव्यू के बाद से {count} महीने छूट गए',
  'trade-sync.quick.started': 'सक्षम ट्रेड स्रोत सिंक हो रहे हैं…',
  'trade-sync.quick.running': 'सिंक हो रहा है…',
  'trade-sync.quick.offline':
    'ट्रेड सिंक के लिए इंटरनेट कनेक्शन आवश्यक है। ऑनलाइन होने पर फिर प्रयास करें।',
  'trade-sync.quick.no-sources':
    'कोई सक्षम ट्रेड सिंक स्रोत नहीं मिला। सेटिंग्स में Trade Sync कॉन्फ़िगर करें।',
  'trade-sync.quick.complete':
    'ट्रेड सिंक पूरा: {sources} स्रोत सिंक हुए और {imported} ट्रेड आयात या अपडेट हुए।',
  'trade-sync.quick.partial':
    'ट्रेड सिंक समस्याओं के साथ पूरा हुआ: {total} में से {completed} स्रोत पूरे हुए और {imported} ट्रेड आयात या अपडेट हुए।',
  'trade-sync.quick.failed':
    '{sources} स्रोतों के लिए ट्रेड सिंक पूरा नहीं हो सका। अपनी Trade Sync सेटिंग्स जाँचें और फिर प्रयास करें।',
  'navigation.items.nav-sync-trades': 'ट्रेड सिंक करें',
  'command.sync-trades-now': 'ट्रेड सिंक करें',
  'home.quick-links.sync-trades': 'ट्रेड सिंक करें',
  'trade-sync.quick.not-ready':
    'अभी कोई सक्षम ट्रेड सिंक स्रोत तैयार नहीं है। चल रहे सिंक के पूरा होने की प्रतीक्षा करें या Trade Sync सेटिंग्स जाँचें।',
  'trade-sync.quick.mapping-required':
    '{imported} ट्रेड आयात या अपडेट किए गए। सेटिंग्स → Trade Sync में {providers} के लिए अकाउंट मैपिंग पूरी करें, फिर दोबारा कोशिश करें।',
  'trade-handoff.action.view-trades-count.one': '{count} ट्रेड देखें',
  'trade-handoff.action.view-trades-count.few': '{count} ट्रेड देखें',
  'trade-handoff.action.view-trades-count.many': '{count} ट्रेड देखें',
  'trade-handoff.action.view-trades-count.other': '{count} ट्रेड देखें',
  'trade-handoff.action.review-now': 'अभी समीक्षा करें',
  'trade-handoff.action.open-period': '{period} समीक्षा खोलें',
  'trade-handoff.review.creation-disabled':
    'वह समीक्षा मौजूद नहीं है और स्वचालित समीक्षा निर्माण अक्षम है।',
  'trade-handoff.review.open-failed': 'वह समीक्षा नहीं खोली जा सकी।',
  'trade-handoff.trades.open-failed': 'ट्रेड लॉग नहीं खोला जा सका।',
  'trade-handoff.scope.label':
    '{accounts} के लिए नवीनतम ऑपरेशन के {trades} दिखाए जा रहे हैं',
  'trade-handoff.scope.exit': 'ऑपरेशन दृश्य से बाहर निकलें',
  'trade-handoff.trade-count.one': '{count} ट्रेड',
  'trade-handoff.trade-count.few': '{count} ट्रेड',
  'trade-handoff.trade-count.many': '{count} ट्रेड',
  'trade-handoff.trade-count.other': '{count} ट्रेड',
  'trade-handoff.title.sync': 'सिंक्रनाइज़ेशन पूर्ण',
  'trade-handoff.summary.import-complete': '{trades} आयात किए गए',
  'trade-handoff.summary.import-partial':
    '{trades} समस्याओं के साथ आयात किए गए',
  'trade-handoff.summary.sync-complete': '{trades} सिंक्रनाइज़ किए गए',
  'trade-handoff.summary.sync-partial':
    '{trades} समस्याओं के साथ सिंक्रनाइज़ किए गए',
  'trade-handoff.periods.choose': 'दूसरी समीक्षा अवधि चुनें',
  'trade-handoff.periods.recommended': 'अनुशंसित',
  'trade-handoff.action.dismiss': 'हाल का ट्रेड परिणाम हटाएँ',
  'sample.action.try': 'नमूना जर्नल आज़माएँ',
  'sample.action.reset': 'नमूना रीसेट करें',
  'sample.popout.title': 'नमूना जर्नल',
  'sample.popout.action.exit': 'बाहर निकलें',
  'sample.popout.description': 'यहाँ किए गए बदलाव केवल अभ्यास के लिए हैं।',
  'sample.popout.closed': 'अभ्यास जर्नल सहेजा और बंद किया गया।',
  'sample.popout.recovery': 'अभ्यास जर्नल को पुनर्प्राप्त करना होगा।',
  'sample.notice.sync-blocked':
    'आप काल्पनिक नमूना डेटा संपादित कर रहे हैं। बैकएंड सिंक रुका हुआ है।',
  'sample.notice.folder-locked':
    'सैंपल जर्नल सक्रिय होने पर जर्नल फ़ोल्डर बदला नहीं जा सकता।',
  'sample.empty.description':
    'अपने जर्नल की फ़ाइलें या सेटिंग बदले बिना भरे हुए काल्पनिक जर्नल को देखें।',
  'sample.progress.creating':
    'नमूना जर्नल बनाया जा रहा है: {total} में से {completed} आइटम',
  'sample.progress.removing':
    'नमूना जर्नल हटाया जा रहा है: {total} में से {completed} आइटम',
  'sample.progress.verifying':
    'नमूना जर्नल की जाँच: {total} में से {completed} आइटम',
  'sample.exit.title': 'नमूना जर्नल से बाहर निकलें?',
  'sample.exit.remove-warning':
    'हटाने पर प्रमाणित नमूना फ़ाइलों में किए गए बदलाव मिट जाएंगे। जिन फ़ाइलों का नमूना स्वामित्व प्रमाणित नहीं है, वे सुरक्षित रहेंगी।',
  'sample.exit.remove': 'बाहर निकलें और हटाएँ',
  'sample.reset.title': 'नमूना जर्नल रीसेट करें?',
  'sample.reset.message':
    'यह हर नमूना फ़ाइल और केवल नमूने वाली सेटिंग को मूल काल्पनिक पैक में पुनर्स्थापित करता है।',
  'sample.reset.warning': 'नमूना जर्नल में आपके बदलाव हटा दिए जाएँगे।',
  'sample.collision.title': 'नमूना फ़ोल्डर पहले से मौजूद है',
  'sample.collision.message':
    'Journalit मौजूदा फ़ोल्डर को अधिलेखित नहीं करेगा। इसके बजाय नमूना जर्नल “{path}” पर बनाएँ?',
  'sample.collision.confirm': 'उपलब्ध फ़ोल्डर उपयोग करें',
  'sample.notice.ready': 'नमूना जर्नल तैयार है।',
  'sample.notice.reset': 'नमूना जर्नल पुनर्स्थापित किया गया।',
  'sample.notice.reset-preserved':
    'नमूना जर्नल पुनर्स्थापित किया गया। बिना प्रमाणित स्वामित्व वाली {count} फ़ाइलें सुरक्षित रखी गईं।',
  'sample.notice.removed': 'नमूना जर्नल हटा दिया गया।',
  'sample.notice.removed-preserved':
    'नमूना जर्नल हटा दिया गया। बिना प्रमाणित स्वामित्व वाली {count} फ़ाइलें सुरक्षित रखी गईं।',
  'sample.notice.error': 'नमूना जर्नल कार्रवाई विफल: {error}',
  'command.open-sample-journal': 'नमूना जर्नल खोलें',
  'command.exit-sample-journal': 'नमूना जर्नल से बाहर निकलें',
  'command.reset-sample-journal': 'नमूना जर्नल रीसेट करें',
  'sample.notice.busy': 'नमूना जर्नल की एक अन्य कार्रवाई पहले से जारी है।',
  'account.profiles.no-matching-phase':
    'इस प्रोफ़ाइल में कोई मेल खाता फेज नहीं है।',
  'account.profiles.history-unchanged': 'पिछला इतिहास अपरिवर्तित रहता है।',
  'account.profiles.notice-title': 'अपडेटेड चैलेंज प्रोफ़ाइल उपलब्ध है',
  'account.profiles.notice-description':
    'स्रोत प्रोफ़ाइल आपकी सहेजी गई प्रोफ़ाइल से अलग है। आपके अकाउंट नियम नहीं बदले हैं।',
  'account.profiles.review-changes': 'बदलाव रिव्यू करें',
  'account.profiles.check-failed': 'नियम अपडेट जाँचे नहीं जा सके।',
  'account.profiles.retry': 'पुनः प्रयास करें',
  'account.profiles.source-changed':
    'यह रिव्यू खुला होने के दौरान स्रोत प्रोफ़ाइल बदल गई। लागू करने से पहले रिव्यू फिर खोलें।',
  'account.profiles.retain': 'वर्तमान नियम रखें',
  'account.profiles.retain-help':
    'इस अकाउंट के नियम रखें और ये स्रोत बदलाव खारिज करें। बाद के पॉलिसी बदलाव फिर सूचित कर सकते हैं।',
  'account.profiles.comparison-help':
    'केवल अंतर दिखाए गए हैं। फ़ील्ड देखने के लिए नियम का विस्तार करें। स्थानीय ओवरराइड अंतर समझा सकते हैं।',
  'account.profiles.added': 'जोड़ा गया',
  'account.profiles.removed': 'हटाया गया',
  'account.profiles.changed': 'बदला गया',
  'account.profiles.not-configured': 'कॉन्फ़िगर नहीं',
  'account.profiles.no-rule-changes':
    'इस फेज के लिए कोई नियम या पेआउट-पॉलिसी अंतर नहीं है।',
  'account.profiles.accept': 'अपडेट लागू करें',
  'account.profiles.cached':
    'कैश की गई प्रोफ़ाइलें उपयोग हो रही हैं; नवीनतम नियम जाँचे नहीं जा सके।',
  'account.profiles.guide':
    'प्रकाशित लागूता या फर्म-पुष्ट शर्तों से बदले नियमों का रिव्यू करें। अनुरोध होने पर मूल खरीद तिथि दर्ज करें। अकाउंट संपादित करें में मेरी फर्म प्रोफ़ाइल के तहत टेम्पलेट सहेजें।',
  'account.profiles.account-phase': 'अकाउंट फेज',
  'account.profiles.choose': 'सहेजी गई प्रोफ़ाइल चुनें',
  'account.profiles.completed': 'पूर्ण फेज अपने मूल नियम रखते हैं।',
  'account.profiles.confirm': 'ये नियम मेरे अकाउंट पर लागू होते हैं।',
  'account.profiles.currency':
    'लागू करने से पहले प्रोफ़ाइल से मेल खाती अकाउंट मुद्रा चुनें।',
  'account.profiles.current': 'वर्तमान अकाउंट नियम',
  'account.profiles.custom-transition': 'कस्टम ट्रांज़िशन शर्तें',
  'account.profiles.cycle-start': 'पेआउट चक्र शुरुआत (स्थानीय समय)',
  'account.profiles.delete-help':
    'यह सहेजी गई प्रोफ़ाइल हटाएँ? पहले से उपयोग कर रहे अकाउंट नहीं बदलेंगे।',
  'account.profiles.effective': 'प्रभावी से (स्थानीय समय)',
  'account.profiles.correction-title': 'कैटलॉग सुधार',
  'account.profiles.correction-source': 'नियम स्रोत',
  'account.profiles.correction-period': 'प्रभावित इतिहास',
  'account.profiles.correction-guide':
    'प्रभावित इतिहास की पुनर्गणना से पहले कैटलॉग सुधारों को स्वीकृति चाहिए।',
  'account.profiles.correction-history': 'सुधार इतिहास',
  'account.profiles.correction-stale':
    'अकाउंट इतिहास बदल गया। सुधार लागू करने से पहले यह रिव्यू फिर खोलें।',
  'account.profiles.correction-result': 'कठोर-नियम मूल्यांकन',
  'account.profiles.no-hard-breach': 'कोई कठोर उल्लंघन नहीं मिला',
  'account.profiles.correction-consent': 'इतिहास पुनर्गणना करें',
  'account.profiles.correction-details': 'विवरण',
  'account.profiles.correction-apply': 'सुधार लागू करें',
  'account.profiles.purchase-date': 'मूल खरीद तिथि',
  'account.profiles.save-purchase': 'खरीद तिथि सहेजें',
  'account.profiles.purchase-needed':
    'इन शर्तों की जाँच के लिए मूल खरीद तिथि दर्ज करें।',
  'account.profiles.purchase-excluded': 'यह खरीद अपनी मौजूदा शर्तें रखती है।',
  'account.profiles.purchase-uncertain':
    'लागूता की पुष्टि फर्म से ज़रूरी है। नियम अपरिवर्तित रहते हैं।',
  'account.profiles.initial-terms':
    'ये शर्तें खरीद से या इस फेज से पहले लागू होती हैं। प्रारंभिक सेटअप अलग से रिव्यू करें; इतिहास अपरिवर्तित रहता है।',
  'account.profiles.announcement': 'फर्म घोषणा',
  'account.profiles.firm-effective': 'फर्म-पुष्ट प्रभावी तिथि',
  'account.profiles.published-date': 'प्रकाशित प्रभावी तिथि',
  'account.profiles.applicability-checking': 'लागूता जाँची जा रही है…',
  'account.profiles.error':
    'प्रोफ़ाइल सहेजी नहीं जा सकी। मान जाँचें और फिर प्रयास करें।',
  'account.profiles.floor': 'ट्रांज़िशन पर ड्रॉडाउन फ्लोर',
  'account.profiles.history': 'नियम इतिहास',
  'account.profiles.history-help':
    'पुराने नियम सुरक्षित रहते हैं। वर्शन्ड फेज बदलने के लिए प्रोफ़ाइल अपडेट रिव्यू करें का उपयोग करें; इतिहास बचाने के लिए सीधे संपादन लॉक है।',
  'account.profiles.incoming': 'आने वाली प्रोफ़ाइल नियम',
  'account.profiles.independent':
    'सहेजी गई प्रोफ़ाइलें इस वॉल्ट तक सीमित हैं। लागू करने पर स्वतंत्र अकाउंट स्नैपशॉट बनता है; नया रिवीज़न सहेजने से मौजूदा अकाउंट नहीं बदलते।',
  'account.profiles.keep-help':
    'चेक किए नियम उस तरह के आने वाले नियम की जगह आपके स्थानीय मान रखते हैं। प्रोफ़ाइल मान स्वीकार करने के लिए अनचेक करें। नए नियम प्रकार जोड़े जाते हैं।',
  'account.profiles.keep-local': 'मेरे रखें:',
  'account.profiles.keep-payout': 'वर्तमान पेआउट पॉलिसी रखें',
  'account.profiles.library': 'मेरी फर्म प्रोफ़ाइलें',
  'account.profiles.locked': 'ड्रॉडाउन फ्लोर पहले से लॉक है',
  'account.profiles.missing': 'यह सहेजी गई प्रोफ़ाइल अब मौजूद नहीं है।',
  'account.profiles.peak': 'ले जाया गया पीक बैलेंस',
  'account.profiles.review': 'प्रोफ़ाइल अपडेट रिव्यू करें',
  'account.profiles.link-source': 'फर्म प्रोफ़ाइल लिंक करें',
  'account.profiles.save-new': 'नई प्रोफ़ाइल के रूप में सहेजें',
  'account.profiles.save-revision': 'चयनित प्रोफ़ाइल का नया रिवीज़न सहेजें',
  'account.profiles.source-phase': 'स्रोत प्रोफ़ाइल फेज',
  'account.profiles.transition-help':
    'कोई सत्यापित ट्रांज़िशन डिफ़ॉल्ट नहीं दिए गए। फर्म-पुष्ट शर्तें दर्ज करें: फ्लोर, पीक और पेआउट चक्र शुरुआत। इन्हें कस्टम चिह्नित किया जाता है। फेज लाभ और आजीवन पेआउट संख्या बनी रहती है; पुराने ट्रेड अपने मूल नियम रखते हैं।',
  'account.profiles.transition-source': 'फर्म पुष्टि या संदर्भ',
  'account.profiles.unknown-baseline':
    'इस पुराने अकाउंट का मूल स्रोत स्नैपशॉट नहीं है। हर अंतर स्पष्ट रूप से रिव्यू करें; स्थानीय ओवरराइड अपने आप पहचाने नहीं जा सकते।',
  'account.profiles.update-available':
    'प्रोफ़ाइल अंतर का रिव्यू ज़रूरी है। आपका अकाउंट अभी भी अपने सहेजे नियम उपयोग करता है।',
  'account.profiles.up-to-date':
    'यह फेज अंतिम रिव्यू की गई प्रोफ़ाइल परिभाषा उपयोग करता है; स्थानीय ओवरराइड स्वतंत्र रहते हैं।',
  'form.field.prop-challenge-phase': 'फेज: {name}',
  'form.field.prop-challenge-phase.none': 'इस समय कोई फेज नहीं',
  'dashboard.filter.accounts.phase-now': 'अभी',
  'home.widget.eval-roi.name': 'इवैल आरओआई',
  'home.widget.challenge-alerts.name': 'चैलेंज अलर्ट',
  'home.widget.challenge-alerts.description':
    'प्रॉप चैलेंज अकाउंट जिन्हें निर्णय चाहिए: फेल, पास, या पेआउट तैयार',
  'home.widget.eval-roi.description':
    'प्रॉप चैलेंज अकाउंट्स में इवैल्यूएशन खर्च बनाम पेआउट',
  'account.header.back-to-dashboard': 'डैशबोर्ड पर वापस',
  'account.header.warning.trades-before-phase.one':
    'फेज 1 शुरू होने से पहले {count} ट्रेड मिला',
  'account.header.warning.trades-before-phase.few':
    'फेज 1 शुरू होने से पहले {count} ट्रेड्स मिले',
  'account.header.warning.trades-before-phase.many':
    'फेज 1 शुरू होने से पहले {count} ट्रेड्स मिले',
  'account.header.warning.trades-before-phase.other':
    'फेज 1 शुरू होने से पहले {count} ट्रेड्स मिले',
  'account.header.warning.earliest-trade-phase':
    'सबसे पहला ट्रेड: {date}। फेज शुरू होने से पहले के ट्रेड चैलेंज में नहीं गिने जाते।',
  'account.header.notice.phase-start-updated':
    'फेज 1 की शुरुआत {date} पर स्थानांतरित',
  'account.header.warning.fix-phase-start.aria': 'फेज 1 शुरुआत ठीक करें',
  'account.settings.section.challenge-stages.title': 'चैलेंज स्टेज',
  'account.settings.section.challenge-stages.desc':
    'चैलेंज इस स्टेज पर पहुँचने पर लागू अकाउंट प्रकार।',
  'account.settings.section.challenge-stages.no-change': 'कोई बदलाव नहीं',
  'account.settings.section.challenge-stages.aria':
    '{stage} के लिए अकाउंट प्रकार',
  'account-dashboard.challenges.empty.title': 'अभी कोई चैलेंज नहीं',
  'account-dashboard.challenges.empty.message':
    'प्रॉप-फर्म चैलेंज को फेज, नियमों और पेआउट के साथ एक अकाउंट के रूप में ट्रैक करें।',
  'account-dashboard.challenges.empty.create': 'नया चैलेंज',
  'account-dashboard.challenges.empty.setup': 'मौजूदा अकाउंट सेट अप करें',
  'account-dashboard.guide.main.settings-stages.title':
    'चैलेंज स्टेज अकाउंट प्रकार सेट कर सकते हैं',
  'account-dashboard.guide.main.settings-stages.description':
    'चैलेंज इवैल्यूएशन, सिम फंडेड या लाइव फंडेड पर पहुँचने पर लागू अकाउंट प्रकार चुनें। प्रकार ज्यों का त्यों रखने के लिए स्टेज को कोई बदलाव नहीं पर छोड़ें।',
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    'नया क्या है: मल्टी-फेज प्रॉप चैलेंज',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    'प्रॉप-चैलेंज प्रगति अब सीधे अकाउंट डैशबोर्ड में है, फेज रिबन, चैलेंज इकोनॉमिक्स और आपके मौजूदा अकाउंट ग्रुप के साथ।',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    'अकाउंट बनाते या संपादित करते समय ट्रैकिंग सक्षम करें',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    'अकाउंट बनाएँ या अकाउंट संपादित करें में, अकाउंट मोड चयनकर्ता से प्रॉप चैलेंज चुनें। आगे बढ़ाने पर प्रत्येक फेज वैकल्पिक रूप से अकाउंट को दूसरे प्रकार में प्रमोट कर सकता है।',
  'account-dashboard.guide.whats-new.prop-challenges.overview.title':
    'चैलेंज परफॉर्मेंस एक नज़र में',
  'account-dashboard.guide.whats-new.prop-challenges.overview.description':
    'ऊपरी स्कोर्कार्ड सक्रिय चैलेंज, पास दर, लागत, पेआउट और नेट परिणाम सारांशित करता है। इनसाइट टेबल फेज बाधाएँ और कई फर्म ट्रैक करने पर प्रॉप फर्म के अनुसार परफॉर्मेंस तुलना करती हैं।',
  'account-dashboard.guide.whats-new.prop-challenges.ribbons.title':
    'फेज रिबन हर चैलेंज को स्कैन करना आसान बनाते हैं',
  'account-dashboard.guide.whats-new.prop-challenges.ribbons.description':
    'प्रॉप अकाउंट कार्ड ऊपर पूर्ण, वर्तमान, लंबित और फेल फेज दिखाते हैं, फिर लाइव टारगेट, ड्रॉडाउन, डेली-लॉस और ट्रेडिंग-दिन प्रगति।',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    'पोर्टफोलियो और चैलेंज विश्लेषण के बीच स्विच करें',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    'समग्र प्रॉप-चैलेंज इकोनॉमिक्स तथा फेज और मल्टी-फर्म इनसाइट देखने के लिए चैलेंज चुनें। अवलोकन AUM चार्ट और पोर्टफोलियो योग पर केंद्रित रहता है।',
  'account-dashboard.guide.whats-new.prop-challenges.account-page.title':
    'कनवर्ट किए अकाउंट उसी प्रवाह में रहते हैं',
  'account-dashboard.guide.whats-new.prop-challenges.account-page.description':
    'चैलेंज आगे बढ़ने या फंडेड में कनवर्ट होने पर उसका अकाउंट प्रकार और फेज इतिहास जुड़े रहते हैं। कंप्लायंस निर्णय, लाइफसाइकल क्रियाएँ और पूरा नियम विवरण देखने के लिए कार्ड खोलें।',
  'account-dashboard.prop.metrics.total': 'चैलेंज',
  'account-dashboard.prop.metrics.pass-rate': 'पास दर',
  'account-dashboard.prop.metrics.costs': 'चैलेंज लागत',
  'account-dashboard.prop.metrics.payouts': 'पेआउट्स',
  'account-dashboard.prop.metrics.net': 'नेट',
  'account-dashboard.prop.tabs.overview': 'अवलोकन',
  'account-dashboard.mode.selector': 'अकाउंट डैशबोर्ड मोड',
  'account-dashboard.mode.account-overview': 'अवलोकन',
  'account-dashboard.mode.challenges': 'चैलेंज',
  'account-dashboard.prop.metrics.active': 'सक्रिय चैलेंज',
  'account-dashboard.prop.economics.title': 'इकोनॉमिक्स',
  'account-dashboard.prop.economics.roi': 'आरओआई',
  'account-dashboard.prop.economics.roi-no-cost': 'कोई लागत नहीं',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    'प्रति प्रयास औसत लागत',
  'account-dashboard.prop.economics.cost-per-funded-account':
    'प्रति फंडेड अकाउंट लागत',
  'account-dashboard.prop.economics.payout-conversion': 'पेआउट रूपांतरण',
  'account-dashboard.prop.insights.title': 'चैलेंज इनसाइट',
  'account-dashboard.prop.phases.title': 'फेज इनसाइट',
  'account-dashboard.prop.phases.phase': 'फेज',
  'account-dashboard.prop.phases.average-duration': 'औसत अवधि',
  'account-dashboard.prop.phases.show-more': '{count} और दिखाएँ',
  'account-dashboard.prop.phases.show-fewer': 'कम दिखाएँ',
  'account-dashboard.prop.tooltip.open-explanation': '{metric} समझाएँ',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    'अभी पर्याप्त पूर्ण डेटा नहीं',
  'account-dashboard.prop.tooltip.pass-rate.description':
    'पूर्ण चैलेंज में से पास हुए चैलेंज का हिस्सा। सक्रिय चैलेंज और बिना परिणाम वाले संग्रहीत चैलेंज शामिल नहीं हैं।',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    'पास चैलेंज ÷ पूर्ण चैलेंज × 100',
  'account-dashboard.prop.tooltip.roi.description':
    'चैलेंज लागत के सापेक्ष नेट पेआउट रिटर्न (पेआउट माइनस चैलेंज लागत)। आरओआई तभी गणना होता है जब सभी शामिल चैलेंज एक ही मुद्रा उपयोग करें।',
  'account-dashboard.prop.tooltip.roi.formula':
    '(पेआउट − चैलेंज लागत) ÷ चैलेंज लागत × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    'इन चैलेंज की कोई लागत नहीं थी, इसलिए भाग देने के लिए कोई लागत आधार नहीं है। शुद्ध रिटर्न {payouts} के पेआउट हैं।',
  'account-dashboard.prop.tooltip.average-cost.description':
    'प्रत्येक प्रयास की औसत चैलेंज लागत, प्रत्येक मुद्रा के लिए अलग गणना।',
  'account-dashboard.prop.tooltip.average-cost.formula':
    'चैलेंज लागत ÷ कुल चैलेंज प्रयास',
  'account-dashboard.prop.tooltip.funded-cost.description':
    'प्रत्येक पास चैलेंज के लिए आवश्यक औसत चैलेंज लागत, प्रत्येक मुद्रा के लिए अलग गणना।',
  'account-dashboard.prop.tooltip.funded-cost.formula':
    'चैलेंज लागत ÷ पास चैलेंज',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    'पास चैलेंज में से कम से कम एक पेआउट वाले चैलेंज का हिस्सा।',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    'पेआउट वाले पास चैलेंज ÷ पास चैलेंज × 100',
  'account-dashboard.prop.tabs.phases': 'फेज',
  'account-dashboard.prop.tabs.firms': 'फर्म्स',
  'account-dashboard.prop.firms.firm': 'फर्म',
  'account-dashboard.prop.firms.attempts': 'प्रयास',
  'account-dashboard.prop.phases.most-failed': 'सबसे अधिक फेल',
  'account-dashboard.prop.phases.days': '{count} दिन',
  'account-dashboard.prop.phases.empty': 'अभी कोई पूर्ण फेज नहीं',
  'account.metrics.total-account-costs': 'अनुमानित कुल लागत',
  'account.metrics.total-costs': 'कुल लागत',
  'account.metrics.one-time-costs': 'एकमुश्त लागत',
  'account.metrics.recurring-costs-to-date': 'अब तक की आवर्ती लागत',
  'account.metrics.monthly-cost': 'मासिक लागत',
  'account.challenge.toggle.label': 'प्रॉप फर्म चैलेंज',
  'account.challenge.toggle.help':
    'इस अकाउंट के लिए मूल्यांकन चरण, फर्म के नियम और भुगतान ट्रैक करें।',
  'account.prop-challenge.title': 'प्रॉप चैलेंज',
  'account.prop-challenge.identity': 'चैलेंज पहचान',
  'account.prop-challenge.prefill.heading-link': 'अपनी फर्म से प्रीफ़िल करें',
  'account.prop-challenge.prefill.phase-link': 'PRO से नियम पहले से भरें',
  'account.prop-challenge.prefill.phase-link-firm':
    'PRO से {firm} के नियम पहले से भरें',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} और, PRO के साथ नियम प्रीफ़िल',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, PRO के साथ नियम प्रीफ़िल',
  'account.prop-challenge.prefill.match':
    'हमारे पास {firm} है: {count} चैलेंज, नियम तैयार',
  'account.prop-challenge.rules.empty':
    'अभी कोई नियम नहीं जोड़े गए। इस फेज को परिभाषित करने के लिए नियम जोड़ें का उपयोग करें।',
  'account.prop-challenge.rules': 'नियम',
  'account.prop-challenge.costs.empty': 'अभी कोई लागत नहीं जोड़ी गई।',
  'account.prop-challenge.description':
    'इस अकाउंट को मल्टी-फेज प्रॉप-फर्म चैलेंज के माध्यम से ट्रैक करें।',
  'account.prop-challenge.enable': 'प्रॉप-चैलेंज ट्रैकिंग सक्षम करें',
  'account.prop-challenge.challenge-name': 'चैलेंज नाम',
  'account.prop-challenge.challenge-name-placeholder': 'उदा. 25K इवैल्यूएशन',
  'account.prop-challenge.firm-name': 'फर्म नाम (वैकल्पिक)',
  'account.prop-challenge.firm-name-placeholder': 'उदा. Apex Trader Funding',
  'account.prop-challenge.profile.title': 'फर्म प्रोफ़ाइल लागू करें',
  'account.prop-challenge.profile.firm': 'फर्म',
  'account.prop-challenge.profile.challenge': 'चैलेंज',
  'account.prop-challenge.profile.apply': 'लागू करें',
  'account.prop-challenge.profile.loading': 'फर्म प्रोफ़ाइल लोड हो रही हैं…',
  'account.prop-challenge.profile.refreshing':
    'प्रोफ़ाइल अपडेट जाँचे जा रहे हैं…',
  'account.prop-challenge.profile.unavailable':
    'ऑफ़लाइन होने पर फर्म प्रोफ़ाइल उपलब्ध नहीं हैं।',
  'account.prop-challenge.profile.confirm-title': 'चैलेंज सेटअप बदलें?',
  'account.prop-challenge.profile.confirm-message':
    'यह प्रोफ़ाइल लागू करने से वर्तमान में कॉन्फ़िगर फेज और नियम बदल जाते हैं।',
  'account.prop-challenge.current-phase': 'वर्तमान फेज',
  'account.prop-challenge.phase-rules': '{phase} के नियम',
  'account.prop-challenge.next-phase': 'अगला: {phase}',
  'account.prop-challenge.view-phase': 'फेज देखें',
  'account.prop-challenge.unnamed-phase': 'अनाम फेज',
  'account.prop-challenge.phase-name': 'फेज नाम',
  'account.prop-challenge.phase-type': 'फेज प्रकार',
  'account.prop-challenge.phase-type.evaluation': 'इवैल्यूएशन',
  'account.prop-challenge.phase-type.verification': 'वेरिफिकेशन',
  'account.prop-challenge.phase-type.sim_funded': 'सिम फंडेड',
  'account.prop-challenge.phase-type.live_funded': 'लाइव फंडेड',
  'account.prop-challenge.phase-type.custom': 'कस्टम',
  'account.prop-challenge.starting-balance': 'प्रारंभिक शेष',
  'account.prop-challenge.broker-account-id': 'ब्रोकर अकाउंट्स',
  'account.prop-challenge.broker-accounts.assigned': '{phase} को असाइन किए',
  'account.prop-challenge.broker-accounts.trades': '{count} ट्रेड्स',
  'account.prop-challenge.broker-accounts.trade-one': '1 ट्रेड',
  'account.prop-challenge.phase-started': 'शुरू',
  'account.prop-challenge.phase-completed': 'पूर्ण',
  'account.prop-challenge.timeline.completed-before-started':
    '{phase} के लिए पूर्ण शुरू के साथ या उसके बाद होना चाहिए।',
  'account.prop-challenge.timeline.out-of-order':
    '{phase} का पूर्ण {next} शुरू होने के साथ या उससे पहले होना चाहिए।',
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} बाद के नियम परिवर्तन के बाद शुरू होता है। प्रारंभ पीछे करें।',
  'account.prop-challenge.default-phase-name': 'फेज {number}',
  'account.prop-challenge.add-phase': 'फेज जोड़ें',
  'account.prop-challenge.remove-phase': 'फेज हटाएँ',
  'account.prop-challenge.add-rule': 'नियम जोड़ें',
  'account.prop-challenge.rule.enabled': 'नियम सक्षम',
  'account.prop-challenge.rule.amount': 'राशि',
  'account.prop-challenge.rule.target-type': 'टारगेट प्रकार',
  'account.prop-challenge.rule.credit-withdrawals':
    'निकासी को टारगेट में गिनें',
  'account.prop-challenge.rule.drawdown-mode': 'ड्रॉडाउन मोड',
  'account.prop-challenge.rule.lock-at-balance': 'बैलेंस पर लॉक',
  'account.prop-challenge.rule.daily-loss-model': 'दैनिक हानि राशि',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'निश्चित राशि',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'अकाउंट लाभ सीमा पर बढ़ती है',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    'पीक EOD लाभ के साथ स्केल होती है',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    'अकाउंट सक्रियण बैलेंस पर बंद होने तक निश्चित सीमा उपयोग होती है। अगले ट्रेडिंग दिन से सीमा उच्चतम दिन-समाप्ति अकाउंट लाभ का कॉन्फ़िगर प्रतिशत बन जाती है और कभी नहीं घटती।',
  'account.prop-challenge.rule.scale-at-balance': 'सक्रियण बैलेंस',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    'सीमा के रूप में प्रयुक्त पीक EOD लाभ (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    'पीक EOD लाभ का {value}',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    'पिछले EOD बैलेंस से लाभ टियर',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    'पिछले-EOD लाभ टियर',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    'लाभ:हानि-सीमा जोड़े उपयोग करें। पिछले EOD अकाउंट लाभ से चुना टियर अगले सेशन पर लागू होता है।',
  'account.prop-challenge.rule.loss-tiers': 'लाभ टियर और हानि सीमाएँ',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'आजीवन अकाउंट लाभ पहली बार प्रारंभिक शेष के कॉन्फ़िगर प्रतिशत तक पहुँचने पर उच्चतर दैनिक हानि राशि स्थायी रूप से सक्रिय होती है।',
  'account.prop-challenge.rule.profit-threshold-percent': 'अकाउंट लाभ सीमा (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'सीमा के बाद दैनिक हानि राशि',
  'account.prop-challenge.rule.breach-action': 'उल्लंघन व्यवहार',
  'account.prop-challenge.rule.breach-action.hard': 'अकाउंट फेल करें',
  'account.prop-challenge.rule.breach-action.soft': 'अगले सेशन तक रोकें',
  'account.prop-challenge.rule.days': 'ट्रेडिंग दिन',
  'account.prop-challenge.rule.minimum-daily-profit': 'प्रति दिन न्यूनतम लाभ',
  'account.prop-challenge.rule.minimum-daily-profit-summary':
    'प्रति दिन {value}+',
  'account.prop-challenge.rule.best-day-percent': 'अधिकतम सर्वश्रेष्ठ दिन (%)',
  'account.prop-challenge.rule.position-limit-model': 'पोज़ीशन सीमा मॉडल',
  'account.prop-challenge.rule.position-limit-model.fixed': 'निश्चित सीमा',
  'account.prop-challenge.rule.position-limit-model.eod-profit-tiers':
    'EOD लाभ टियर',
  'account.prop-challenge.rule.position-profit-basis':
    'पोज़ीशन स्केलिंग लाभ आधार',
  'account.prop-challenge.rule.position-profit-basis.cumulative':
    'संचयी ट्रेड लाभ (पेआउट कम नहीं करते)',
  'account.prop-challenge.rule.position-profit-basis.current-account':
    'वर्तमान अकाउंट लाभ (पेआउट कम करते हैं)',
  'account.prop-challenge.rule.position-limit-model.eod-profit':
    'EOD लाभ के साथ स्केल होती है',
  'account.prop-challenge.rule.position-tiers': 'लाभ टियर',
  'account.prop-challenge.rule.position-tiers-help':
    'प्रत्येक पूर्ण EOD लाभ सीमा और उसकी नई कॉन्ट्रैक्ट सीमा profit:contracts के रूप में, अल्पविराम से अलग करके दर्ज करें। टियर अगले ट्रेडिंग दिन से लागू होता है।',
  'account.prop-challenge.rule.position-scaling-help':
    'प्रत्येक पूर्ण लाभ स्टेप अगले ट्रेडिंग दिन से एक कॉन्ट्रैक्ट जोड़ता है, अधिकतम तक।',
  'account.prop-challenge.rule.initial-contracts': 'प्रारंभिक कॉन्ट्रैक्ट',
  'account.prop-challenge.rule.profit-per-contract':
    'अतिरिक्त कॉन्ट्रैक्ट प्रति EOD लाभ',
  'account.prop-challenge.rule.maximum-contracts':
    'स्केलिंग के बाद अधिकतम कॉन्ट्रैक्ट',
  'account.prop-challenge.rule.max-contracts': 'अधिकतम कॉन्ट्रैक्ट',
  'account.prop-challenge.rule.profit_target': 'लाभ लक्ष्य',
  'account.prop-challenge.rule.drawdown': 'ड्रॉडाउन',
  'account.prop-challenge.rule.daily_loss_limit': 'दैनिक हानि सीमा',
  'account.prop-challenge.rule.live_review_daily_profit':
    'लाइव-रिव्यू दैनिक लाभ',
  'account.prop-challenge.rule.best-profitable-day': 'लाभदायक दिन ट्रिगर',
  'account.prop-challenge.rule.daily_profit_cap': 'दैनिक लाभ क्रेडिट कैप',
  'account.prop-challenge.rule.per-trading-day': 'प्रति ट्रेडिंग दिन',
  'account.prop-challenge.rule.minimum_trading_days': 'न्यूनतम ट्रेडिंग दिन',
  'account.prop-challenge.rule.minimum_profitable_days': 'न्यूनतम लाभदायक दिन',
  'account.prop-challenge.rule.consistency-cushion-percent':
    'कंसिस्टेंसी कुशन (प्रतिशत अंक)',
  'account.prop-challenge.rule.consistency-cushion-short': 'कुशन',
  'account.prop-challenge.rule.consistency': 'कंसिस्टेंसी',
  'account.prop-challenge.rule.max_position_size': 'अधिकतम पोज़ीशन साइज़',
  'account.prop-challenge.drawdown.static': 'स्टैटिक',
  'account.prop-challenge.drawdown.eod-trailing': 'EOD ट्रेलिंग',
  'account.prop-challenge.drawdown.intraday-trailing': 'इंट्राडे ट्रेलिंग',
  'account.prop-challenge.summary.status.active': 'सक्रिय',
  'account.prop-challenge.summary.status.passed': 'पास',
  'account.prop-challenge.summary.status.failed': 'फेल',
  'account.prop-challenge.summary.status.pending': 'लंबित',
  'account.prop-challenge.summary.status.warning': 'सीमा के निकट',
  'account.prop-challenge.summary.status.payout_ready': 'पेआउट तैयार',
  'account.prop-challenge.ribbon.passed': '{phase} पास',
  'account.prop-challenge.ribbon.failed': '{phase} फेल',
  'account.prop-challenge.ribbon.action.advance': '{phase} पर आगे बढ़ाएँ',
  'account.prop-challenge.ribbon.action.advance-short': 'आगे बढ़ाएँ',
  'account.prop-challenge.ribbon.action.mark-passed': 'पास चिह्नित करें',
  'account.prop-challenge.ribbon.action.archive': 'संग्रहित करें',
  'account.prop-challenge.ribbon.action.record-payout': 'पेआउट दर्ज करें',
  'account.prop-challenge.ribbon.action.record-payout-short': 'पेआउट',
  'account.prop-challenge.summary.phase-status.pending': 'लंबित',
  'account.prop-challenge.summary.phase-status.active': 'सक्रिय',
  'account.prop-challenge.summary.phase-status.passed': 'पास',
  'account.prop-challenge.summary.phase-status.failed': 'फेल',
  'account.prop-challenge.summary.rule.profit_target': 'लाभ लक्ष्य',
  'account.prop-challenge.summary.rule.drawdown': 'ड्रॉडाउन',
  'account.prop-challenge.summary.rule.drawdown-static': 'स्टैटिक ड्रॉडाउन',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': 'EOD ड्रॉडाउन',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing':
    'इंट्राडे ड्रॉडाउन',
  'account.prop-challenge.summary.rule.daily_loss_limit': 'दैनिक हानि',
  'account.prop-challenge.summary.rule.live_review_daily_profit': 'लाइव रिव्यू',
  'account.prop-challenge.summary.rule.daily_profit_cap': 'दैनिक लाभ क्रेडिट',
  'account.prop-challenge.summary.rule.minimum_trading_days': 'ट्रेडिंग दिन',
  'account.prop-challenge.summary.rule.minimum_profitable_days': 'लाभदायक दिन',
  'account.prop-challenge.summary.rule.consistency': 'बेस्ट-डे कंसिस्टेंसी',
  'account.prop-challenge.summary.rule.max_position_size': 'पोज़ीशन साइज़',
  'account.prop-challenge.summary.status.archived': 'संग्रहीत',
  'account.prop-challenge.summary.status.hidden': 'छिपा हुआ',
  'account.prop-challenge.payout.title': 'पेआउट तत्परता',
  'account.prop-challenge.payout.eligible': 'पेआउट तैयार',
  'account.prop-challenge.payout.available': 'अभी उपलब्ध',
  'account.prop-challenge.payout.cycle-profit': 'चक्र लाभ',
  'account.prop-challenge.payout.history': 'पेआउट्स',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'आजीवन क्वालिफ़ाइंग दिन',
  'account.prop-challenge.payout.requirement.days': 'ट्रेडिंग दिन',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'क्वालिफ़ाइंग दिन',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'न्यूनतम अकाउंट शेष',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'धनात्मक चक्र लाभ',
  'account.prop-challenge.payout.requirement.cycle-profit': 'चक्र लाभ',
  'account.prop-challenge.payout.requirement.consistency': 'कंसिस्टेंसी',
  'account.prop-challenge.payout.requirement.minimum': 'न्यूनतम उपलब्ध',
  'account.prop-challenge.payout.requirement.payouts': 'पेआउट अनुमति',
  'account.prop-challenge.payout.requirement.request-window': 'अनुरोध विंडो',
  'account.prop-challenge.payout.timezone-invalid':
    'यह कोई ज्ञात समय क्षेत्र नहीं है।',
  'account.prop-challenge.payout.preview-amount': 'पेआउट प्रिव्यू',
  'account.prop-challenge.payout.you-receive': 'ट्रेडर हिस्सा',
  'account.prop-challenge.payout.balance-after': 'बाद का शेष',
  'account.prop-challenge.payout.drawdown-floor': 'ड्रॉडाउन फ्लोर',
  'account.prop-challenge.payout.buffer-after': 'उल्लंघन से पहले गुंजाइश',
  'account.prop-challenge.payout.request-not-allowed': 'इस राशि पर पात्र नहीं',
  'account.prop-challenge.payout.immediate-breach':
    'यह पेआउट अकाउंट को उसके ड्रॉडाउन फ्लोर पर या उससे नीचे छोड़ देगा।',
  'account.prop-challenge.payout.account-concludes':
    'यह पेआउट कॉन्फ़िगर सिम्युलेटेड-फंडेड पेआउट चक्र पूरा करता है।',
  'account.prop-challenge.payout.next-stage-after-payout':
    'यह पेआउट अकाउंट को उसके अगले कॉन्फ़िगर स्टेज पर आगे बढ़ाता है।',
  'account.prop-challenge.payout.live-review-after-payout':
    'यह पेआउट अकाउंट को लाइव-अकाउंट रिव्यू के लिए पात्र बनाता है।',
  'account.prop-challenge.payout.cycle-resets':
    'स्वीकृत पेआउट के बाद पेआउट प्रगति रीसेट होती है।',
  'account.prop-challenge.payout.cycle-continues':
    'स्वीकृत पेआउट के बाद पेआउट प्रगति जारी रहती है।',
  'account.prop-challenge.payout.drawdown.unchanged':
    'वर्तमान ड्रॉडाउन फ्लोर बना रहता है।',
  'account.prop-challenge.payout.drawdown.lock_at_balance':
    'पेआउट के बाद ड्रॉडाउन फ्लोर लॉक हो जाता है।',
  'account.prop-challenge.payout.drawdown.reset_from_starting_balance':
    'पेआउट के बाद अकाउंट और ड्रॉडाउन सीमाएँ रीसेट होती हैं।',
  'account.prop-challenge.ledger.value.of': '{target} में से {current}',
  'account.prop-challenge.ledger.section.payout': 'पेआउट आवश्यकताएँ',
  'account.prop-challenge.ledger.requirement.minimum': 'न्यून. {value}',
  'account.prop-challenge.ledger.requirement.maximum': 'अधिक. {value}',
  'account.prop-challenge.ledger.value.ratio': '{current} / {target} अनुपात',
  'account.prop-challenge.payout.met-of-total':
    '{total} में से {met} आवश्यकताएँ',
  'account.prop-challenge.ledger.value.of-today':
    'आज {target} में से {current}',
  'account.prop-challenge.ledger.value.credited-profit':
    '{actual} वास्तविक लाभ में से {credited} क्रेडिट',
  'account.prop-challenge.ledger.value.used': '{used} उपयोग',
  'account.prop-challenge.ledger.value.consistency-goal':
    '{target} कंसिस्टेंसी लक्ष्य में से {current}',
  'account.prop-challenge.ledger.value.best-day-share':
    'लाभ का सर्वश्रेष्ठ दिन {value}',
  'account.prop-challenge.ledger.value.no-profit': 'अभी कोई लाभ नहीं',
  'account.prop-challenge.ledger.requirement.best-day':
    'सर्वश्रेष्ठ दिन कुल लाभ का ≤ {value}',
  'account.prop-challenge.ledger.state.needs-profit': 'लाभ चाहिए',
  'account.prop-challenge.ledger.tooltip.open': '{rule} समझाएँ',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    'कुल फेज लाभ का कितना हिस्सा एक सबसे लाभदायक ट्रेडिंग दिन से आ सकता है, यह सीमित करता है।',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    'बेस्ट-डे लाभ ÷ कुल फेज लाभ × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    'सर्वश्रेष्ठ दिन: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    'कुल लाभ: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 = {share} हिस्सा',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    'कंसिस्टेंसी लक्ष्य: {best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    'अन्य दिनों पर लाभ जोड़ने से हिस्सा गिरता है, और नया बड़ा सर्वश्रेष्ठ दिन लक्ष्य बढ़ाता है।',
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum} — नियम के भीतर',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    'कुल फेज लाभ धनात्मक होने पर गणना शुरू होती है।',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    'कंसिस्टेंसी लक्ष्य के लिए 0% से अधिक अधिकतम चाहिए।',
  'account.prop-challenge.ledger.help.open': '{rule} के बारे में',
  'account.prop-challenge.ledger.help.profit_target':
    'फेज पास करने के लिए अकाउंट को इस राशि तक बढ़ाएँ। केवल बंद ट्रेड गिने जाते हैं।',
  'account.prop-challenge.ledger.help.profit_target.example':
    'इस अकाउंट को {target} लाभ चाहिए: अभी तक {current}, {remaining} शेष।',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'लक्ष्य पहुँचा: {target} में से {current}।',
  'account.prop-challenge.ledger.help.drawdown.static':
    'शेष प्रारंभिक शेष से जितना गिर सकता है। फ्लोर कभी नहीं हटता।',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'इस अकाउंट का फ्लोर {floor} है; शेष उससे ऊपर रहना चाहिए। {limit} सीमा में से {buffer} बचा है।',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    'फ्लोर आपके उच्चतम दिन-समाप्ति शेष का अनुसरण करता है और केवल ऊपर जाता है, जब तक फर्म के लॉक स्तर पर लॉक न हो जाए।',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'अभी फ्लोर {floor} है (उच्चतम क्लोज़ माइनस {limit}) और प्रत्येक ऊँचे क्लोज़ के साथ ऊपर जाता है। {buffer} बचा।',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    'फ्लोर किसी भी क्षण के आपके उच्चतम शेष का अनुसरण करता है, खुला लाभ शामिल। Journalit केवल बंद ट्रेड देखता है, इसलिए यह फ्लोर प्रत्येक क्लोज़ के बाद आपके सर्वश्रेष्ठ शेष का अनुसरण करता है; खुले ट्रेड के अंदर पहुँचा पीक नहीं गिना जाता। फर्म का अपना आँकड़ा जाँचें।',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    'अभी फ्लोर {floor} है (सर्वश्रेष्ठ बंद-ट्रेड शेष माइनस {limit})। {buffer} बचा; फर्म का लाइव आँकड़ा सख्त हो सकता है।',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    'एक ट्रेडिंग दिन में अधिकतम हानि। पहुँचने पर फेज फेल होता है या फर्म के अनुसार अगले सेशन तक ट्रेडिंग रुकती है।',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    'आज: {limit} दैनिक सीमा में से {used} हानि, {left} बचा।',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    'प्रत्येक दिन के लाभ का केवल हिस्सा लक्ष्य में क्रेडिट होता है। कैप से ऊपर का लाभ रखा जाता है लेकिन नहीं गिना जाता।',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    'दिन के लाभ में से केवल {cap} क्रेडिट होता है; कैप से ऊपर अब तक कमाया {excluded} नहीं गिना जाता।',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'इस लाभ पर या उससे ऊपर का एक ट्रेडिंग दिन अकाउंट को लाइव-अकाउंट रिव्यू के लिए पात्र बनाता है।',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    '{trigger} या अधिक का एक दिन पात्र बनाता है; अब तक का सर्वश्रेष्ठ दिन {bestDay}।',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    'कम से कम एक बंद ट्रेड वाले दिन। लक्ष्य कितनी भी जल्दी पूरा हो, इतने दिनों से पहले फेज पास नहीं हो सकता।',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{target} ट्रेडिंग दिनों में से {current} पूरे, {remaining} शेष।',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'वे ट्रेडिंग दिन जो फर्म के न्यूनतम दैनिक लाभ पर या उससे ऊपर बंद होते हैं। ब्रेक-ईवन या छोटे विन नहीं गिने जाते।',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{minimum} या अधिक पर बंद {target} दिनों में से {current}, {remaining} शेष।',
  'account.prop-challenge.ledger.help.consistency':
    'आपका सर्वश्रेष्ठ एक दिन कुल फेज लाभ के इस हिस्से से अधिक नहीं हो सकता। इसे अन्य दिनों पर अधिक कमाकर ठीक करें, हानि से नहीं।',
  'account.prop-challenge.ledger.help.consistency.example':
    'सर्वश्रेष्ठ दिन {bestDay} कुल {total} लाभ का {share} है; {maximum} पर बैठने के लिए कुल लाभ {goal} तक पहुँचना चाहिए।',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'सर्वश्रेष्ठ दिन {bestDay} कुल लाभ का {share} है, {maximum} सीमा के भीतर।',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'अभी कोई लाभ नहीं, इसलिए तुलना के लिए कोई सर्वश्रेष्ठ दिन नहीं।',
  'account.prop-challenge.ledger.help.max_position_size':
    'सभी खुली पोज़ीशन मिलाकर एक साथ अधिकतम कॉन्ट्रैक्ट। कुछ फर्म लाभ बढ़ने पर सीमा बढ़ाती हैं।',
  'account.prop-challenge.ledger.help.max_position_size.example':
    'अभी एक साथ अधिकतम {maximum} कॉन्ट्रैक्ट; अब तक की सबसे बड़ी पोज़ीशन {current}।',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'वर्तमान पेआउट चक्र के ट्रेडिंग दिन। स्वीकृत पेआउट के बाद गिनती फिर शुरू होती है।',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    'इस चक्र में {target} ट्रेडिंग दिनों में से {current}, {remaining} शेष।',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'इस चक्र के वे ट्रेडिंग दिन जो फर्म के न्यूनतम दैनिक लाभ पर या उससे ऊपर बंद होते हैं।',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    'इस चक्र में {minimum} या अधिक पर {target} दिनों में से {current}, {remaining} शेष।',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'चक्र शुरू होने के बाद कमाया लाभ अनुरोध से पहले इस राशि तक पहुँचना चाहिए।',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    'आवश्यक {target} में से इस चक्र में {current} कमाया।',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'अनुरोध करते समय शेष इस स्तर पर या उससे ऊपर होना चाहिए।',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    'शेष {current}; कम से कम {target} होना चाहिए।',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    'पहले पेआउट के बाद प्रत्येक नए चक्र को अगले अनुरोध से पहले लाभ में होना चाहिए।',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'चक्र लाभ {current} है; शून्य से ऊपर होना चाहिए।',
  'account.prop-challenge.ledger.help.payout.consistency':
    'आपका सर्वश्रेष्ठ दिन चक्र लाभ के इस हिस्से से अधिक नहीं हो सकता।',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    'सर्वश्रेष्ठ दिन {bestDay} {total} चक्र लाभ का {share} है; {maximum} पर बैठने के लिए चक्र लाभ {goal} तक पहुँचना चाहिए।',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'सर्वश्रेष्ठ दिन {bestDay} चक्र लाभ का {share} है, {maximum} सीमा के भीतर।',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'अभी कोई चक्र लाभ नहीं, इसलिए तुलना के लिए कोई सर्वश्रेष्ठ दिन नहीं।',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    'फर्म द्वारा स्वीकृत सबसे छोटा पेआउट। उपलब्ध राशि पहले इस तक पहुँचे।',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '{current} उपलब्ध; फर्म का न्यूनतम अनुरोध {target} है।',
  'account.prop-challenge.ledger.help.payout.payout_count':
    'यह स्टेज कितने पेआउट अनुमति देता है। अनुमति उपयोग करने पर स्टेज पूरा होता है।',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    'इस स्टेज में {target} पेआउट में से {current} उपयोग।',
  'account.prop-challenge.ledger.help.payout.request_window':
    'अनुरोध केवल इन सप्ताह के दिनों पर, फर्म के समय क्षेत्र में स्वीकार होते हैं।',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    'आज {today} है; अनुरोध {days} पर खुलते हैं ({timeZone})।',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'चक्र के पहले ट्रेड के बाद का समय अनुरोध से पहले इस तक पहुँचना चाहिए।',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    'चक्र के पहले ट्रेड के बाद {target} घंटों में से {current}।',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'पूरे फंडेड फेज के क्वालिफ़ाइंग दिन, केवल इस चक्र के नहीं। पहुँचने पर पेआउट अनलॉक होते हैं।',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    'पूरे फेज में {target} क्वालिफ़ाइंग दिनों में से {current}।',
  'account.prop-challenge.ledger.requirement.target': '{value} लक्ष्य',
  'account.prop-challenge.ledger.requirement.buffer': '{value} बफर',
  'account.prop-challenge.ledger.requirement.max': '{value} अधिकतम',
  'account.prop-challenge.ledger.requirement.daily-cap':
    'प्रति ट्रेडिंग दिन {value} क्रेडिट',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{profit}+ पर {days} दिन',
  'account.prop-challenge.ledger.requirement.days': '{value} दिन',
  'account.prop-challenge.ledger.requirement.at-most': 'अधिकतम ≤ {value}',
  'account.prop-challenge.ledger.state.not-started': 'शुरू नहीं',
  'account.prop-challenge.ledger.state.in-progress': 'प्रगति पर',
  'account.prop-challenge.ledger.state.reached': 'पहुँचा',
  'account.prop-challenge.ledger.state.met': 'पूरा',
  'account.prop-challenge.ledger.state.eligible': 'पात्र',
  'account.prop-challenge.ledger.state.safe': 'सुरक्षित',
  'account.prop-challenge.ledger.state.clear': 'साफ़',
  'account.prop-challenge.ledger.state.within-rule': 'नियम के भीतर',
  'account.prop-challenge.ledger.state.near-limit': 'सीमा के निकट',
  'account.prop-challenge.ledger.state.limit-reached': 'सीमा पहुँची',
  'account.prop-challenge.ledger.state.cap-applied': 'कैप लागू',
  'account.prop-challenge.ledger.state.within-cap': 'कैप के भीतर',
  'account.prop-challenge.ledger.state.breached': 'उल्लंघन',
  'account.prop-challenge.actions.progress-to': '{phase} पर प्रगति करें',
  'account.prop-challenge.actions.progress': 'अगले फेज पर प्रगति करें',
  'account.prop-challenge.actions.mark-passed': 'चैलेंज पास चिह्नित करें',
  'account.prop-challenge.actions.mark-failed': 'फेल चिह्नित करें',
  'account.prop-challenge.actions.archive': 'चैलेंज संग्रहित करें',
  'account.prop-challenge.actions.stale':
    'यह चैलेंज कहीं और अपडेट हुआ। जाँचें और फिर प्रयास करें।',
  'account.prop-challenge.actions.reopen': 'फिर खोलें',
  'account.prop-challenge.view-trades': '{phase} के ट्रेड्स देखें',
  'account.prop-challenge.actions.manual': 'मैन्युअल क्रियाएँ',
  'account.prop-challenge.notice.failed-title': '{phase} फेल',
  'account.prop-challenge.notice.failed-description':
    '{date} को {rule} का उल्लंघन',
  'account.prop-challenge.notice.failed-manual': 'फेल चिह्नित',
  'account.prop-challenge.notice.keep-open': 'खुला रखें',
  'account.prop-challenge.notice.target-title': '{phase} लक्ष्य पहुँचा',
  'account.prop-challenge.notice.target-description':
    'सभी पास आवश्यकताएँ पूरी हैं। {next} पर जाएँ?',
  'account.prop-challenge.notice.breach-after-reached':
    'लक्ष्य {time} पर पहुँचने के बाद नियम टूटे। उन ट्रेड्स को इस फेज से बाहर रखने के लिए ट्रांज़िशन समय सेट करें।',
  'account.prop-challenge.notice.not-yet': 'अभी नहीं',
  'account.prop-challenge.notice.passed-title': 'इवैल्यूएशन पास',
  'account.prop-challenge.notice.passed-description':
    'सभी आवश्यकताएँ पूरी हैं। चैलेंज पास चिह्नित करें?',
  'account.prop-challenge.notice.payout-title': 'पेआउट उपलब्ध: {amount}',
  'account.prop-challenge.notice.payout-plan': 'आपका प्लान: {amount} निकालें',
  'account.prop-challenge.notice.record-payout': 'पेआउट दर्ज करें',
  'account.prop-challenge.notice.skip-cycle': 'यह चक्र छोड़ें',
  'account.prop-challenge.notice.payout-description': 'पेआउट',
  'account.prop-challenge.notice.lost-title': 'पेआउट अब उपलब्ध नहीं',
  'account.prop-challenge.notice.lost-description': 'अधूरी: {requirements}',
  'account.prop-challenge.notice.dismiss': 'खारिज करें',
  'account.prop-challenge.notice.unknown-title': 'नया अकाउंट {label}',
  'account.prop-challenge.notice.unknown-description':
    '{date} के बाद {count} ट्रेड्स किसी फेज को असाइन नहीं हैं।',
  'account.prop-challenge.notice.unknown-description-one':
    '{date} के बाद 1 ट्रेड किसी फेज को असाइन नहीं है।',
  'account.prop-challenge.notice.same-phase': 'वही फेज',
  'account.prop-challenge.notice.not-now': 'अभी नहीं',
  'account.prop-challenge.notice.error': 'नोटिस अपडेट नहीं हो सका।',
  'account.prop-challenge.notice.type-changed':
    'अकाउंट प्रकार {accountType} पर सेट',
  'account.prop-challenge.payout.plan.title': 'पेआउट प्लान',
  'account.prop-challenge.payout.plan.notify-minimum':
    'कम से कम होने पर सूचित करें ({currency})',
  'account.prop-challenge.payout.plan.withdrawal': 'सुझाई निकासी',
  'account.prop-challenge.payout.plan.full': 'पूरी राशि',
  'account.prop-challenge.payout.plan.percent': 'उपलब्ध का प्रतिशत',
  'account.prop-challenge.payout.plan.amount': 'निश्चित राशि',
  'account.prop-challenge.payout.plan.percent-invalid':
    '1 से 100 के बीच प्रतिशत दर्ज करें।',
  'account.prop-challenge.payout.plan.amount-invalid':
    'शून्य से अधिक राशि दर्ज करें।',
  'account.prop-challenge.payout.plan.percent-value': 'प्रतिशत',
  'account.prop-challenge.payout.plan.amount-value': 'राशि ({currency})',
  'account.prop-challenge.payout.plan.save': 'प्लान सहेजें',
  'account.prop-challenge.payout.plan.saved': 'पेआउट प्लान सहेजा गया।',
  'account.prop-challenge.payout.plan.summary-notify': 'सूचित करें ≥ {amount}',
  'account.prop-challenge.payout.plan.summary-percent': '{percent}% सुझाएँ',
  'account.prop-challenge.payout.plan.summary-amount': '{amount} सुझाएँ',
  'account.prop-challenge.payout.plan.summary-full': 'पूरी राशि',
  'account.prop-challenge.actions.error': 'प्रॉप चैलेंज अपडेट नहीं हो सका।',
  'account.prop-challenge.confirm.advance':
    'इस फेज परिणाम की पुष्टि करें और चैलेंज जारी रखें?',
  'account.prop-challenge.confirm.advance-with-promotion':
    'यह चैलेंज आगे बढ़ाएगा और अकाउंट प्रकार {accountType} में बदल देगा।',
  'account.prop-challenge.confirm.fail':
    '{account} को फेल चिह्नित करें? चैलेंज “{challenge}” {phase} पर समाप्त होता है।',
  'account.prop-challenge.confirm.archive-failed':
    '{account} संग्रहित करें? चैलेंज “{challenge}” फेल हुआ। अकाउंट संग्रहीत में जाता है।',
  'account.prop-challenge.confirm.archive-passed':
    '{account} संग्रहित करें? चैलेंज “{challenge}” पास हुआ। अकाउंट संग्रहीत में जाता है।',
  'account.prop-challenge.transition.route': '{account} · {from} → {to} मार्ग',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → चैलेंज पास',
  'account.prop-challenge.confirm.reopen':
    '{account} फिर खोलें? चैलेंज “{challenge}” {phase} पर लौटता है।',
  'account.prop-challenge.transition.time': 'ट्रांज़िशन समय',
  'account.prop-challenge.transition.now': 'अभी',
  'account.prop-challenge.transition.when-target-reached':
    'जब लक्ष्य पहुँचा था',
  'account.prop-challenge.transition.too-early':
    'ट्रांज़िशन समय इस फेज शुरू होने से पहले नहीं हो सकता।',
  'account.prop-challenge.costs.title': 'एकमुश्त लागत',
  'account.prop-challenge.costs.description':
    'खरीद, रीसेट और सक्रियण शुल्क अलग ट्रैक करें।',
  'account.prop-challenge.costs.kind': 'प्रकार',
  'account.prop-challenge.costs.kind.purchase': 'खरीद',
  'account.prop-challenge.costs.kind.reset': 'रीसेट',
  'account.prop-challenge.costs.kind.activation': 'सक्रियण',
  'account.prop-challenge.costs.kind.other': 'अन्य',
  'account.prop-challenge.costs.date': 'तिथि',
  'account.prop-challenge.costs.amount': 'राशि',
  'account.prop-challenge.costs.note': 'नोट (वैकल्पिक)',
  'account.prop-challenge.costs.add': 'लागत जोड़ें',
  'account.header.copies': 'कॉपी करता है',
  'account.header.copied-by-more': '+{count} और',
  'account.header.created': 'बनाया गया:',
  'account.summary.current-balance': 'वर्तमान शेष',
  'account.summary.net-cash-flow': 'नेट कैश फ्लो',
  'account.summary.payouts': 'पेआउट्स',
  'account.performance.title': 'प्रदर्शन',
  'account-page.guide.whats-new.cockpit.intro.title':
    'अकाउंट पेज पर नया क्या है',
  'account-page.guide.whats-new.cockpit.intro.description':
    'अब बैलेंस चार्ट अकाउंट विश्लेषण का नेतृत्व करता है। उसके बाद एक जुड़ा मेट्रिक्स पैनल है, और ठीक नीचे प्रॉप-चैलेंज नियम।',
  'account-page.guide.whats-new.cockpit.cockpit.title':
    'चैलेंज नियम अकाउंट परफॉर्मेंस के बाद आते हैं',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    'प्रॉप अकाउंट के लिए, प्रत्येक आवश्यकता और उसकी प्रगति देखने को मेट्रिक्स पैनल के नीचे नियम हेडर से फेज चुनें। लाइफसाइकल क्रियाएँ उसके पास मेनू में रहती हैं।',
  'account-page.guide.whats-new.cockpit.payout.title':
    'जानें कब फंडेड पेआउट सुरक्षित है',
  'account-page.guide.whats-new.cockpit.payout.description':
    'सत्यापित नियमों वाले फंडेड अकाउंट अब पेआउट आवश्यकताएँ, उपलब्ध राशि, और पैसे माँगने से पहले शेष व ड्रॉडाउन परिणामों का प्रिव्यू दिखाते हैं।',
  'account-page.guide.whats-new.cockpit.summary.title':
    'एक जुड़ा मेट्रिक्स पैनल',
  'account-page.guide.whats-new.cockpit.summary.description':
    'अकाउंट स्थिति और विस्तृत परफॉर्मेंस अब चार्ट के नीचे एक सतह साझा करते हैं: शेष, नेट P&L और कैश फ्लो पहले आते हैं, शेष मेट्रिक्स उसी ग्रिड में जारी रहते हैं।',
  'account-page.guide.whats-new.cockpit.risk.title': 'एक आधिकारिक जोखिम स्रोत',
  'account-page.guide.whats-new.cockpit.risk.description':
    'चैलेंज सक्रिय, पास या फेल होने पर उसके फेज नियम ही दिखाया गया एकमात्र जोखिम हैं, ताकि कोई दूसरा ड्रॉडाउन आँकड़ा उनका विरोध न करे। नियमित या संग्रहीत अकाउंट के लिए सामान्य अकाउंट जोखिम लौटता है।',
  'account-page.guide.main.challenge.title': 'आपका चैलेंज एक नज़र में',
  'account-page.guide.main.challenge.description':
    'जुड़े मेट्रिक्स पैनल के नीचे, नियम हेडर से चैलेंज फेज चुनें और प्रत्येक आवश्यकता को उसकी प्रगति व स्थिति के साथ देखें। लाइफसाइकल क्रियाएँ चयनकर्ता के पास हैं।',
  'account-page.guide.main.payout.title': 'फंडेड पेआउट प्लान करें',
  'account-page.guide.main.payout.description':
    'जब फंडेड फेज में सत्यापित पेआउट नियम हों, यह पैनल पात्रता ट्रैक करता है और अनुरोधित राशि का अकाउंट प्रभाव प्रिव्यू करता है।',
  'account-page.guide.main.summary.title': 'अकाउंट स्थिति एक नज़र में',
  'account-page.guide.main.summary.description':
    'जुड़ा मेट्रिक्स पैनल शेष, नेट P&L, ग्रोथ, ट्रेड्स, विन रेट और नेट कैश फ्लो से शुरू होता है — या प्रॉप अकाउंट के लिए पेआउट्स।',
  'account.transaction.edit-row-label':
    'इस लेन-देन को संपादित या हटाएँ: {date}, {amount}',
  'account.deposits-withdrawals.summary':
    '{deposits} जमा · {withdrawn} निकासी · अंतिम {date}',
  'account.payouts.title': 'पेआउट्स',
  'account.payouts.summary': '{count} पेआउट · {total} · अंतिम {date}',
  'account.payouts.summary-masked': 'मान छिपे होने तक भुगतान इतिहास छिपा है',
  'account.payouts.summary-one': '1 पेआउट · {total} · अंतिम {date}',
  'account.payouts.empty': 'अभी कोई पेआउट नहीं',
  'account.payouts.empty-sub': 'हेडर में + बटन से पेआउट दर्ज करें।',
  'account.ledger.column.date': 'तिथि',
  'account.ledger.column.type': 'प्रकार',
  'account.ledger.column.payout': 'पेआउट',
  'account.ledger.column.description': 'विवरण',
  'account.ledger.column.amount': 'राशि',
  'account.ledger.column.balance-after': 'बाद का शेष',
  'home.widget.eval-roi.title': 'इवैल आरओआई',
  'home.widget.eval-roi.unable-to-load': 'लोड करने में असमर्थ',
  'home.widget.eval-roi.no-challenges': 'कोई प्रॉप चैलेंज नहीं',
  'home.widget.eval-roi.challenge-count': '{count} इवैल',
  'home.widget.eval-roi.challenge-count-plural': '{count} इवैल',
  'home.widget.eval-roi.net': 'नेट',
  'home.widget.eval-roi.spent': 'खर्च',
  'home.widget.eval-roi.payouts': 'पेआउट्स',
  'home.widget.eval-roi.break-even': 'ब्रेक-ईवन',
  'home.widget.challenge-alerts.title': 'चैलेंज अलर्ट',
  'home.widget.challenge-alerts.unable-to-load':
    'चैलेंज अलर्ट जाँचे नहीं जा सके',
  'home.widget.challenge-alerts.empty': 'कोई चैलेंज अलर्ट नहीं',
  'home.widget.challenge-alerts.count': '{count} अलर्ट',
  'home.widget.challenge-alerts.count-plural': '{count} अलर्ट',
  'home.widget.challenge-alerts.more': '+{count} और',
  'home.widget.challenge-alerts.kind.failed': 'फेल',
  'home.widget.challenge-alerts.kind.target': 'लक्ष्य पहुँचा',
  'home.widget.challenge-alerts.kind.passed': 'पास',
  'home.widget.challenge-alerts.kind.payout': 'पेआउट तैयार',
  'home.widget.challenge-alerts.kind.lost': 'पेआउट अब उपलब्ध नहीं',
  'home.widget.challenge-alerts.kind.unknown-account': 'नया अकाउंट {label}',
  'home.widget.eval-roi.roi-aria': 'इवैल्यूएशन खर्च पर रिटर्न',
  'account.prop-challenge.stage': 'स्टेज प्रकार',
  'account.prop-challenge.stage.evaluation': 'इवैल्यूएशन',
  'account.prop-challenge.stage.sim-funded': 'सिम फंडेड',
  'account.prop-challenge.stage.live-funded': 'लाइव फंडेड',
  'account.prop-challenge.payout-rules.title': 'पेआउट नियम',
  'account.prop-challenge.payout-rules.add': 'पेआउट नियम जोड़ें',
  'account.prop-challenge.payout-rules.remove': 'पेआउट नियम हटाएँ',
  'account.prop-challenge.payout-rules.cycle': 'पात्रता चक्र',
  'account.prop-challenge.payout-rules.request-window': 'अनुरोध समय',
  'account.prop-challenge.payout-rules.request-window.anytime': 'किसी भी दिन',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'निर्दिष्ट सप्ताह के दिन',
  'account.prop-challenge.payout-rules.request-window.time-zone': 'समय क्षेत्र',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'अनुमत अनुरोध दिन',
  'account.prop-challenge.payout-rules.cycle.none': 'कोई प्रतीक्षा चक्र नहीं',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'ट्रेडिंग दिन',
  'account.prop-challenge.payout-rules.cycle.qualifying-days':
    'क्वालिफ़ाइंग दिन',
  'account.prop-challenge.payout-rules.cycle.calendar-days': 'कैलेंडर दिन',
  'account.prop-challenge.payout-rules.days': 'आवश्यक दिन',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'न्यूनतम दैनिक लाभ',
  'account.prop-challenge.payout-rules.anchor': 'चक्र शुरू होता है',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'स्टेज शुरुआत',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'पहला ट्रेड',
  'account.prop-challenge.payout-rules.minimum-balance': 'न्यूनतम अकाउंट शेष',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'न्यूनतम चक्र लाभ',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'पेआउट संख्या के अनुसार न्यूनतम चक्र लाभ',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'पहले पेआउट के बाद धनात्मक चक्र लाभ आवश्यक',
  'account.prop-challenge.payout-rules.consistency-percent':
    'अधिकतम बेस्ट-डे हिस्सा (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'पेआउट संख्या के अनुसार अधिकतम बेस्ट-डे हिस्सा (%)',
  'account.prop-challenge.payout-rules.availability': 'उपलब्ध लाभ',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'प्रारंभिक शेष से ऊपर',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'बैलेंस फ्लोर से ऊपर',
  'account.prop-challenge.payout-rules.balance-floor': 'बैलेंस फ्लोर',
  'account.prop-challenge.payout-rules.request-percent':
    'निकासी योग्य हिस्सा (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'प्रत्येक अनुरोध से आवश्यक नया लाभ (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'अनुरोध को सीमित करता है ताकि कॉन्फ़िगर प्रतिशत वर्तमान पेआउट चक्र में कमाए लाभ से समर्थित हो। उदाहरण के लिए, 50% वर्तमान-चक्र लाभ का दोगुना तक अनुरोध देता है।',
  'account.prop-challenge.payout-rules.minimum-request': 'न्यूनतम अनुरोध',
  'account.prop-challenge.payout-rules.maximum': 'अधिकतम अनुरोध',
  'account.prop-challenge.payout-rules.maximum.none': 'कोई अधिकतम नहीं',
  'account.prop-challenge.payout-rules.maximum.fixed': 'निश्चित अधिकतम',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'केवल पहले पेआउट का अधिकतम',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'पेआउट संख्या के अनुसार अधिकतम',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'चक्र लाभ का प्रतिशत',
  'account.prop-challenge.payout-rules.maximum-amount': 'अधिकतम राशि',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'पहले पेआउट का अधिकतम',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'अधिकतम चक्र लाभ (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'बाद के पेआउट के लिए अंतिम राशि उपयोग करते रहें',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'बाद के पेआउट के लिए अंतिम मान उपयोग करते रहें',
  'account.prop-challenge.payout-rules.schedule':
    'पेआउट संख्या के अनुसार राशियाँ',
  'account.prop-challenge.payout-rules.profit-split': 'ट्रेडर लाभ हिस्सा (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'आजीवन क्वालिफ़ाइंग दिनों के बाद सीमाएँ बदलें',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    'पूरे फंडेड फेज के क्वालिफ़ाइंग दिन गिनता है, भले पेआउट चक्र रीसेट हों।',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'आवश्यक आजीवन क्वालिफ़ाइंग दिन',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'अनलॉक के बाद उपलब्धता',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'अनलॉक के बाद बैलेंस फ्लोर',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'अनलॉक के बाद उपलब्ध लाभ (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'अनलॉक के बाद अधिकतम अनुरोध',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'अनलॉक के बाद अधिकतम राशि',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'अनलॉक के बाद अधिकतम शेड्यूल',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'अनलॉक के बाद अधिकतम चक्र-लाभ प्रतिशत',
  'account.prop-challenge.payout-rules.profit-split-model':
    'प्रॉफिट स्प्लिट मॉडल',
  'account.prop-challenge.payout-rules.profit-split.fixed': 'निश्चित प्रतिशत',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    'संचयी पेआउट के बाद बदलता है',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'अकाउंट लाभ के अनुसार बदलता है',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'प्रारंभिक ट्रेडर हिस्सा (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'संचयी पेआउट सीमा',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'सीमा के बाद ट्रेडर हिस्सा (%)',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'आजीवन अकाउंट लाभ वर्तमान शेष माइनस प्रारंभिक शेष प्लस पिछली निकासी के बराबर है। नीचे या पर/ऊपर प्रतिशत पूरे अनुरोध पर लागू होता है।',
  'account.prop-challenge.payout-rules.profit-split.below':
    'सीमा से नीचे ट्रेडर हिस्सा (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'अकाउंट लाभ सीमा',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'सीमा पर या ऊपर ट्रेडर हिस्सा (%)',
  'account.prop-challenge.payout-rules.maximum-payouts': 'अधिकतम पेआउट',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'अंतिम पेआउट के बाद',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'अकाउंट जारी रखें',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'अकाउंट समाप्त करें',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'अगले स्टेज पर आगे बढ़ाएँ',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'लाइव रिव्यू के लिए पात्र',
  'account.prop-challenge.payout-rules.aftermath': 'स्वीकृत पेआउट के बाद',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'पेआउट काटें; ड्रॉडाउन फ्लोर रखें',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'पेआउट काटें; ड्रॉडाउन फ्लोर लॉक करें',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'अकाउंट और ड्रॉडाउन रीसेट करें',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'पेआउट के बाद ड्रॉडाउन फ्लोर',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'पहला पेआउट न्यूनतम चक्र लाभ नज़रअंदाज़ करता है',
  'account.prop-challenge.payout-rules.reset-cycle':
    'पेआउट के बाद पात्रता चक्र रीसेट करें',
  'account.prop-challenge.payout-rules.group.eligibility': 'पात्रता',
  'account.prop-challenge.payout-rules.group.availability': 'उपलब्ध पेआउट',
  'account.prop-challenge.payout-rules.group.terms': 'पेआउट शर्तें',
  'account.prop-challenge.payout-rules.group.aftermath': 'पेआउट के बाद',
  'account.prop-challenge.payout.requirement.elapsed-hours': 'बीता समय',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'न्यूनतम बीते घंटे',
  'account.merge.challenge.move-earlier': '{account} को पहले ले जाएँ',
  'account.merge.challenge.move-later': '{account} को बाद में ले जाएँ',
  'account.merge.warning.use-profile-balance': 'प्रोफ़ाइल शेष उपयोग करें',
  'account.merge.warning.edit-phases': 'फेज संपादित करें',
  'account.merge.title': 'चैलेंज सेटअप',
  'account.merge.loading': 'लोड हो रहा है...',
  'account.merge.step.accounts': 'अकाउंट्स',
  'account.merge.step.phases': 'फेज',
  'account.merge.step.review': 'रिव्यू',
  'account.merge.accounts.title': 'मर्ज करने वाले अकाउंट',
  'account.merge.accounts.show-archived': 'संग्रहीत दिखाएँ',
  'account.merge.accounts.empty': 'कोई पात्र अकाउंट नहीं',
  'account.merge.target.title': 'लक्ष्य अकाउंट',
  'account.merge.target.keep': 'रखें',
  'account.merge.target.new': 'नया नाम',
  'account.merge.phase.name': 'फेज',
  'account.merge.phase.status': 'स्थिति',
  'account.merge.phase.started': 'शुरू',
  'account.merge.phase.completed': 'पूर्ण',
  'account.merge.phase.no-rules': 'कोई नहीं',
  'account.merge.review.notes': 'ट्रेड्स स्थानांतरित',
  'account.merge.review.identities': 'ब्रोकर अकाउंट्स',
  'account.merge.warning.trade-outside-window':
    'अपनी फेज विंडो के बाहर ट्रेड्स',
  'account.merge.warning.identity-shared': 'पहचान कई अकाउंट ने दावा की',
  'account.merge.warning.copy-trading-dropped': 'कॉपी ट्रेडिंग अवधि हटाई गई',
  'account.merge.error.too-few-sources': 'कम से कम दो अकाउंट चुनें।',
  'account.merge.error.duplicate-source': 'एक अकाउंट दो बार सूचीबद्ध है।',
  'account.merge.error.target-exists': 'वह नाम दूसरे अकाउंट का है।',
  'account.merge.error.currency-mismatch':
    'अकाउंट अलग मुद्राएँ उपयोग करते हैं।',
  'account.merge.error.timeline-not-monotonic':
    'फेज शुरू समय बढ़ते क्रम में होने चाहिए।',
  'account.merge.error.invalid-override': 'इस फेज की तिथियाँ जाँचें।',
  'account.merge.error.source-missing': 'एक अकाउंट की सहेजी सेटिंग्स नहीं हैं।',
  'account.merge.error.unknown': 'मर्ज विफल।',
  'account.merge.action.merge': 'मर्ज करें',
  'account.merge.action.undo': 'पूर्ववत करें',
  'account.merge.action.delete': 'लेगेसी अकाउंट हटाएँ',
  'account.merge.notice.converted': 'चैलेंज में कनवर्ट किया गया',
  'account.merge.notice.title': '{accounts} से मर्ज किया गया',
  'account.merge.notice.error': 'क्रिया विफल।',
  'account.merge.undo.title': 'मर्ज पूर्ववत करें',
  'account.merge.undo.message':
    'लेगेसी अकाउंट और उनके ट्रेड्स पुनर्स्थापित करता है।',
  'account.merge.delete.title': 'लेगेसी अकाउंट हटाएँ',
  'account.merge.delete.message':
    'संग्रहीत लेगेसी अकाउंट हटाता है। इसे पूर्ववत नहीं किया जा सकता।',
  'command.open-legacy-challenge-onboarding': 'प्रॉप चैलेंज सेट अप करें',
  'account.merge.step.challenge': 'चैलेंज',
  'account.merge.action.convert': 'कनवर्ट करें',
  'account.merge.profile.applied': 'लागू: {firm} · {challenge}',
  'account.merge.profile.remove': 'हटाएँ',
  'account.merge.phase.apply-profile': 'फर्म प्रोफ़ाइल लागू करें',
  'account.merge.profile.replace-rules.title': 'हाथ से लिखे नियम बदलें?',
  'account.merge.profile.replace-rules.body':
    '{firm} की प्रोफ़ाइल हर चरण के नियम तय करती है। इस पृष्ठ पर लिखे नियम बदल दिए जाएँगे।',
  'account.merge.profile.replace-rules.confirm': 'नियम बदलें',
  'guide.legacy-setup.list.title': 'बिना चैलेंज वाला हर खाता यहाँ सूचीबद्ध है',
  'guide.legacy-setup.list.description':
    'हर खाते के लिए तय करें। “जैसा है वैसा रहने दें” उसे ठीक वैसा ही रखता है; आप इसे बाद में डैशबोर्ड सेटिंग्स से कभी भी सेट कर सकते हैं।',
  'guide.legacy-setup.assign.title': 'एक चैलेंज के चरणों को साथ रखें',
  'guide.legacy-setup.assign.description':
    'जो खाते एक ही चैलेंज के चरण थे, वे एक समूह में जाते हैं (मिलते-जुलते नामों से हम समूह सुझाते हैं)। अकेला खाता एक-चरण वाला चैलेंज बन जाता है।',
  'guide.legacy-setup.continue.title': 'हर चैलेंज के लिए एक छोटा सेटअप',
  'guide.legacy-setup.continue.description':
    'जारी रखें हर समूह के लिए बारी-बारी से चैलेंज सेटअप खोलता है। जब तक आप हर एक की पुष्टि नहीं करते, कुछ नहीं बदलता।',
  'guide.merge-wizard.target.title': 'एक खाता इतिहास रखता है',
  'guide.merge-wizard.target.description':
    'लक्ष्य खाता सभी चरणों के साथ बना रहता है। बाकी संग्रहीत होते हैं, हटाए नहीं जाते, और उनके ट्रेड लक्ष्य खाते में चले जाते हैं।',
  'guide.merge-wizard.identity.title': 'फर्म और चैलेंज का नाम दें',
  'guide.merge-wizard.identity.description':
    'फर्म प्रोफ़ाइल लागू करने से असली नियम और फंडेड चरण भर जाते हैं। बिना प्रोफ़ाइल के, जब तक आप खाता पृष्ठ पर नियम नहीं जोड़ते, चरणों में कोई नियम नहीं होता।',
  'guide.merge-wizard.phases.title': 'हर चरण जाँचें',
  'guide.merge-wizard.phases.description':
    'स्टेज प्रकार सेट करें, पूरे किए चरणों को पास और वर्तमान को सक्रिय चिह्नित करें, और तिथियाँ पुष्टि करें।',
  'guide.merge-wizard.review.title': 'पुष्टि से पहले कुछ नहीं होता',
  'guide.merge-wizard.review.description':
    'स्थानांतरित ट्रेड, संग्रहीत खाते और चेतावनियाँ जाँचें। मर्ज सब कुछ लागू करता है; आप इसे खाता पृष्ठ से पूर्ववत कर सकते हैं।',
  'account.merge.challenge.accounts': 'अकाउंट्स',
  'account.merge.challenge.order-hint': 'सबसे पुराना फेज पहले',
  'account.merge.challenge.single-hint': 'यह अकाउंट स्वयं एक चैलेंज बन जाता है',
  'account.merge.phase.identities-count': '{count} पहचान',
  'account.merge.phase.pending': 'लंबित',
  'account.merge.review.phases': 'फेज',
  'account.merge.review.archived': 'संग्रहीत',
  'account.merge.review.open': 'खुले',
  'account.merge.sequence': 'चैलेंज {total} में से {index}',
  'account.merge.warning.balance-differs':
    'प्रारंभिक शेष फर्म प्रोफ़ाइल से भिन्न है',
  'account.merge.error.profile-phase-mismatch':
    'फर्म प्रोफ़ाइल के फेज से अधिक अकाउंट',
  'account.merge.error.profile-currency-mismatch':
    'प्रोफ़ाइल की मुद्रा इन अकाउंट से भिन्न है।',
  'account.merge.error.source-changed':
    'एक अकाउंट बदल गया। मर्ज की फिर से समीक्षा करें।',
  'account.merge.error.multiple-active-phases':
    'केवल अंतिम अकाउंट अभी सक्रिय रह सकता है।',
  'account.merge.error.phases-after-failed-source':
    'विफल खाता चैलेंज समाप्त कर देता है, इसलिए उसे अंत में चुना जाना चाहिए।',
  'account.merge.error.copy-trading-overlap':
    'कॉपी-ट्रेडिंग अवधियाँ ओवरलैप हो रही हैं। पहले एक को बंद करें।',
  'onboarding.legacy-challenge.legend':
    'उन अकाउंट को ग्रुप करें जो एक चैलेंज के फेज थे। अकेला अकाउंट स्वयं चैलेंज बन जाता है।',
  'onboarding.legacy-challenge.assign.leave': 'जैसा है वैसा छोड़ें',
  'onboarding.legacy-challenge.assign.own': 'अपना चैलेंज',
  'onboarding.legacy-challenge.assign.group': 'चैलेंज {letter}',
  'onboarding.legacy-challenge.assign.new-group': 'नया चैलेंज…',
  'onboarding.legacy-challenge.action.continue': 'जारी रखें',
  'onboarding.legacy-challenge.action.continue-count': '{count} सेट अप करें',
  'guide.action-step.dismiss': 'अभी नहीं',
  'guide.legacy-challenge.title': 'आपके मौजूदा अकाउंट',
  'guide.legacy-challenge.description':
    'एक चैलेंज के फेज रहे अकाउंट जोड़ें, या अकाउंट को स्वयं चैलेंज बनाएँ।',
  'guide.legacy-challenge.action': 'मेरे अकाउंट सेट अप करें',
  'onboarding.legacy-challenge.title': 'प्रॉप चैलेंज',
  'onboarding.legacy-challenge.action.skip': 'छोड़ें',
  'onboarding.legacy-challenge.accounts.show-archived': 'संग्रहीत दिखाएँ',
  'onboarding.legacy-challenge.accounts.empty':
    'सेट अप करने के लिए कोई अकाउंट नहीं',
  'onboarding.legacy-challenge.loading': 'लोड हो रहा है...',
  'onboarding.legacy-challenge.suggested': 'सुझाया गया',
  'onboarding.legacy-challenge.row.aria': '{account} के लिए क्रिया',
  'onboarding.legacy-challenge.status.combined': 'जोड़ा गया',
  'onboarding.legacy-challenge.status.converted': 'कनवर्ट किया गया',
  'onboarding.legacy-challenge.entry.name': 'प्रॉप चैलेंज',
  'onboarding.legacy-challenge.entry.desc':
    'मौजूदा अकाउंट को चैलेंज में जोड़ें या कनवर्ट करें।',
  'onboarding.legacy-challenge.entry.action': 'सेट अप करें',
};

export default hi;
