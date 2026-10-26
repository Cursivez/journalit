

import type { Lang } from './en';

const ru: Lang = {
  'tradelog.export.button': 'Экспорт',
  'tradelog.export.title': 'Экспорт сделок',
  'tradelog.export.format': 'Формат',
  'tradelog.export.scope':
    '{count} подходящих сделок · {columns} видимых столбцов',
  'tradelog.export.raw':
    'Значения не скрыты, даже в режиме конфиденциальности. P&L — сумма, не R; изображения — только пути.',
  'tradelog.export.mobile':
    'На мобильных устройствах файл сохраняется в корне хранилища.',
  'tradelog.export.saved': 'Экспорт сохранён в хранилище: {filename}',
  'tradelog.export.failed':
    'Не удалось экспортировать сделки. Попробуйте ещё раз.',
  'tradelog.export.empty':
    'Нет подходящих сделок или видимых столбцов данных для экспорта.',
  'tradelog.export.guide':
    'Используйте экспорт, чтобы сохранить все подходящие сделки в CSV, JSON или Markdown с видимыми столбцами в заданном порядке. Файлы содержат нескрытые данные, даже в режиме конфиденциальности.',
  'expectancy-gap.benchmark-help':
    'Среднее модели/теста. Общее для фильтров; пустое поле удаляет значение.',
  'expectancy-gap.formula': 'Разрыв = фактическое − ожидаемое',
  'expectancy-gap.realized-help':
    'Фактическое = средний чистый R закрытых сделок с пригодными данными риска.',
  'expectancy-gap.interpretation':
    'Отрицательное = ниже модели, положительное = выше. Причина не объясняется.',
  'trade-import.recovery.bybit-header.columns':
    'Отсутствуют обязательные столбцы: {columns}.',
  'trade-import.recovery.bybit-header.title':
    'Проверьте заголовки или экспорт Bybit',
  'trade-import.recovery.bybit-header.message':
    'Выбранные заголовки не соответствуют истории сделок Bybit. Проверьте строку заголовков или экспортируйте сделки с ценами и объёмами исполнения, а не только ценами ордеров. Для сопоставления другого формата явно выберите {manualSource}.',
  'update.installed.title': 'Что нового',
  'settings.general.available-update-notifications':
    'Показывать напоминания об обновлениях',
  'settings.general.available-update-notifications-desc':
    'Ежедневно проверять новые версии и показывать напоминание. Отключите, чтобы видеть только изменения после обновления.',
  'account.edit.field.unscoped-live-balance-desc':
    'Не удалось определить фазу для прежней корректировки баланса. Она сохранена; введите текущий баланс у брокера, чтобы сверить активную фазу.',
  'account.edit.error.inactive-phase':
    'Текущий баланс можно изменить только на активном этапе.',
  'account.edit.error.phase-changed':
    'Данные счёта изменились во время редактирования. Перед сохранением откройте редактор счёта заново.',
  'account.profiles.profitable-days-conflict':
    'Сохраните текущую политику выплат или измените требование к прибыльным дням перед применением этих условий.',
  'account.prop-challenge.position-limits-not-monitored':
    'Journalit не отслеживает лимиты позиций и правила увеличения числа контрактов. Проверяйте правила вашей фирмы и торговой платформы.',
  'account.prop-challenge.rule.profit-basis.cumulative':
    'Накопленная торговая прибыль (выплаты не уменьшают)',
  'account.prop-challenge.rule.profit-basis':
    'База прибыли для изменения лимита',
  'account.prop-challenge.rule.manual_review':
    'Проверка фирмой / неподдерживаемые условия',
  'account.prop-challenge.summary.rule.manual_review': 'Проверка фирмой',
  'account.prop-challenge.ledger.state.needs-review':
    'Требуется проверка фирмой',
  'account.prop-challenge.payout.estimated-net':
    'Оценка чистой выплаты трейдеру',
  'account.prop-challenge.payout.gross-withdrawals': 'Валовые снятия со счёта',
  'account.prop-challenge.payout.lifetime-gross':
    'Текущая прибыль этапа + все предыдущие валовые снятия на этапе (не только за платёжный цикл)',
  'account.prop-challenge.payout.unresolved-cap': 'Уточнить лимит у фирмы',
  'account.prop-challenge.payout.marginal-split': 'Разделение по части прибыли',
  'account.prop-challenge.payout-rules.profit-split.above':
    'Доля трейдера выше порога (%)',
  'account.prop-challenge.payout.not-calculated': 'Не рассчитано',
  'account.prop-challenge.payout.manual-only':
    'Расчёт выплат для этих условий недоступен. Вы по-прежнему можете записывать фактические выплаты.',
  'account.prop-challenge.payout.raise-floor':
    'Поднять нижнюю границу до начального баланса',
  'account.prop-challenge.rule.comparison': 'Сравнение',
  'templateEditor.widget.session-log.hide-empty-outside':
    'Скрывать журнал вне сессии, если он пуст',
  'account.profiles.correction-title': 'Исправление каталога',
  'account.profiles.correction-source': 'Источник правил',
  'account.profiles.correction-period': 'Затронутая история',
  'account.profiles.correction-history': 'Исправления правил',
  'account.profiles.correction-before': 'До',
  'account.profiles.correction-after': 'После',
  'account.profiles.correction-stale':
    'История счёта изменилась. Откройте проверку заново.',
  'account.profiles.correction-effect': 'Влияние на этот счёт',
  'account.profiles.not-failed': 'Без нарушений',
  'account.profiles.correction-consent': 'Пересчитать историю',
  'account.profiles.correction-consent-help':
    'Заменяет правила этой фазы для затронутой истории и заново проверяет её результат. Сделки и платежи не изменяются.',
  'account.profiles.correction-period-open': 'С {date}',
  'account.profiles.correction-details': 'Подробности',
  'account.profiles.correction-apply': 'Применить исправление',
  'account.profiles.purchase-date': 'Дата первоначальной покупки',
  'account.profiles.save-purchase': 'Сохранить дату покупки',
  'account.profiles.purchase-needed':
    'Укажите дату первоначальной покупки для проверки этих условий.',
  'account.profiles.purchase-excluded':
    'Для этой покупки сохраняются прежние условия.',
  'account.profiles.purchase-uncertain':
    'Применимость должна подтвердить компания. Правила не изменены.',
  'account.profiles.initial-terms':
    'Эти условия действуют с покупки или до начала этапа. Проверьте исходные настройки отдельно; история не изменена.',
  'account.profiles.announcement': 'Объявление компании',
  'account.profiles.firm-effective':
    'Дата вступления в силу, подтверждённая компанией',
  'account.profiles.published-date': 'Опубликованная дата вступления в силу',
  'account.profiles.applicability-checking': 'Проверка применимости…',
  'account.profiles.no-matching-phase':
    'В этих правилах фирмы нет соответствующей фазы.',
  'account.profiles.history-unchanged': 'Предыдущая история не изменится.',
  'account.profiles.notice-title': 'Доступны обновлённые правила фирмы',
  'account.profiles.notice-description':
    'Опубликованные фирмой правила отличаются от сохранённых на этом счёте. Правила вашего счёта не изменились.',
  'account.profiles.review-changes': 'Просмотреть изменения',
  'account.profiles.check-failed': 'Не удалось проверить обновления правил.',
  'account.profiles.retry': 'Повторить',
  'account.profiles.source-changed':
    'Правила фирмы изменились, пока этот обзор был открыт. Откройте обзор заново перед применением.',
  'account.profiles.retain': 'Сохранить текущие правила',
  'account.profiles.not-configured': 'Не настроено',
  'account.profiles.no-rule-changes':
    'Для этого этапа нет различий в правилах или условиях выплат.',
  'account.profiles.accept': 'Применить обновление',
  'account.profiles.cached':
    'Используются кэшированные правила фирмы; не удалось проверить последние.',
  'account.profiles.account-phase': 'Этап счёта',
  'account.profiles.choose': 'Выберите сохранённые правила',
  'account.profiles.completed': 'Завершённые этапы сохраняют исходные правила.',
  'account.profiles.confirm': 'Эти правила применимы к моему счёту.',
  'account.profiles.currency':
    'Перед применением выберите валюту счёта, соответствующую этим правилам.',
  'account.profiles.current': 'Текущие правила счёта',
  'account.profiles.custom-transition': 'Пользовательские условия перехода',
  'account.profiles.cycle-start': 'Начало цикла выплат (местное время)',
  'account.profiles.delete-help':
    'Удалить эти сохранённые правила? Счета, которые уже их используют, не изменятся.',
  'account.profiles.effective': 'Действует с (местное время)',
  'account.profiles.error':
    'Не удалось сохранить правила. Проверьте значения и попробуйте снова.',
  'account.profiles.floor': 'Порог просадки при переходе',
  'account.profiles.history': 'История правил',
  'account.profiles.history-help':
    'Прежние правила сохраняются. Используйте «Проверить обновление правил», чтобы изменить версионированную фазу; прямое редактирование заблокировано для защиты истории.',
  'account.profiles.incoming': 'Новые правила фирмы',
  'account.profiles.independent':
    'Сохранённые правила хранятся локально в этом хранилище. Применение создаёт независимую копию на счёте; сохранение новой редакции никогда не меняет существующие счета.',
  'account.profiles.keep-local': 'Оставить моё правило:',
  'account.profiles.keep-payout': 'Сохранить текущую политику выплат',
  'account.profiles.library': 'Мои сохранённые правила',
  'account.profiles.locked': 'Порог просадки уже зафиксирован',
  'account.profiles.missing': 'Этих сохранённых правил больше нет.',
  'account.profiles.peak': 'Перенесённый пиковый баланс',
  'account.profiles.review': 'Проверить обновление правил',
  'account.profiles.save-new': 'Сохранить эти правила',
  'account.profiles.saved': 'Сохранено в «Мои сохранённые правила».',
  'account.profiles.update-saved': 'Обновить сохранённые правила',
  'account.profiles.delete-saved': 'Удалить сохранённые правила',
  'account.profiles.save-revision':
    'Сохранить как новую редакцию выбранных правил',
  'account.profiles.source-phase': 'Фаза в правилах фирмы',
  'account.profiles.transition-help':
    'Проверенные условия перехода не предоставлены. Введите подтверждённые фирмой порог, пик и начало цикла. Они помечаются как пользовательские. Прибыль этапа и общее число выплат сохраняются; прежние сделки сохраняют свои правила.',
  'account.profiles.transition-source': 'Подтверждение фирмы или источник',
  'account.profiles.link-intro':
    'Свяжите челлендж с правилами фирмы, и Journalit сообщит, когда фирма их изменит. Сначала вы проверите, чем они отличаются от правил этого счёта; ничего не изменится, пока вы не примените.',
  'account.profiles.link-title': 'Связать с правилами фирмы',
  'account.profiles.choose-source': 'Выберите правила фирмы',
  'widget.mfeScatter.name': 'MFE и реализованный PnL',
  'widget.mfeScatter.description':
    'Макс. нереализованная прибыль и итоговый P&L',
  'widget.excursionScatter.y': 'Реализованный PnL ({unit})',
  'widget.excursionScatter.winners': 'Прибыльные',
  'widget.excursionScatter.losers': 'Убыточные',
  'widget.excursionScatter.breakeven': 'Безубыточные',
  'widget.mfeScatter.empty':
    'Нет закрытых сделок с доступным MFE в этой единице.',
  'widget.maeScatter.name': 'MAE и реализованный PnL',
  'widget.maeScatter.description':
    'Макс. нереализованный убыток и итоговый P&L',
  'widget.maeScatter.empty':
    'Нет закрытых сделок с доступным MAE в этой единице.',

  'trade-sync.tradovate.status.connecting': 'Подключение',
  'trade-sync.tradovate.status.setup-required': 'Требуется настройка счёта',
  'trade-sync.tradovate.status.paused': 'Приостановлено',
  'trade-sync.tradovate.status.reauthorization-required':
    'Требуется повторная авторизация',
  'trade-sync.tradovate.status.deleting': 'Удаление облачных данных',
  'trade-sync.tradovate.status.error': 'Ошибка подключения',

  'trade-sync.tradovate.sync-complete-connection':
    'Синхронизация {connection} завершена.',
  'trade-sync.tradovate.sync-partial-connection':
    'Синхронизация {connection} завершена с проблемами.',
  'trade-sync.tradovate.sync-all': 'Синхронизировать все',
  'trade-sync.tradovate.sync-all-complete':
    'Синхронизировано подключений Tradovate: {succeeded} из {total}.',
  'trade-sync.tradovate.sync-all-partial':
    'Синхронизировано подключений Tradovate: {succeeded} из {total}. Проверьте подключения с проблемами.',
  'trade-sync.tradovate.sync-all-provider-partial':
    'Синхронизировано подключений Tradovate: {succeeded} из {total} · синхронизация завершена частично',
  'trade-sync.tradovate.connect-another':
    'Подключить ещё одну учётную запись Tradovate',
  'trade-sync.tradovate.no-connections':
    'Подключите учётную запись Tradovate на Journalit.co, чтобы настроить и синхронизировать её здесь.',
  'trade-sync.tradovate.claimed-by-connection':
    'Синхронизация включена через {connection}. Отключите её там, прежде чем переключать эту учётную запись.',
  'trade-sync.tradovate.claim-conflict':
    'Другое подключение Tradovate заняло эту учётную запись. Проверьте обновлённые карточки подключений перед повторной попыткой.',
  'trade-sync.tradovate.reconciliation-issues': 'Проблем сверки: {count}',
  'trade-sync.tradovate.website-connection-description':
    'Безопасно подключите Tradovate или повторно авторизуйте его на Journalit.co, затем вернитесь сюда, чтобы выбрать счета и синхронизировать это хранилище.',
  'trade-sync.tradovate.paused-website-description':
    'Это подключение Tradovate приостановлено. Управляйте им на Journalit.co, чтобы проверить или возобновить его.',
  'trade-sync.tradovate.plugin-sync-description':
    'Одна синхронизация получает последние данные активности Tradovate и записывает соответствующие сделки в это хранилище.',
  'trade-sync.tradovate.connect': 'Подключить',
  'trade-sync.tradovate.manage-connection': 'Управление подключением',
  'trade-sync.tradovate.setup-guide': 'Руководство по настройке',
  'trade-sync.tradovate.setup-and-sync':
    'Завершить настройку и синхронизировать',
  'trade-sync.tradovate.sync-to-vault': 'Синхронизировать',
  'trade-sync.tradovate.discovery-description':
    'Journalit необходимо обнаружить доступные через подключение Tradovate Demo- и Live-счета.',
  'trade-sync.tradovate.discover-accounts': 'Обнаружить счета Tradovate',
  'trade-sync.tradovate.discovering': 'Поиск счетов…',
  'trade-sync.tradovate.discovery-failed':
    'Не удалось обнаружить счета Tradovate. Повторите попытку или управляйте подключением на Journalit.co.',
  'trade-sync.tradovate.sync-account': 'Включить в синхронизацию',
  'trade-sync.tradovate.history-label': 'Начальная история',
  'trade-sync.tradovate.history-all': 'Вся доступная история',
  'trade-sync.tradovate.history-recent': 'Последние 90 дней',
  'trade-sync.tradovate.history-custom': 'С указанной даты',
  'trade-sync.tradovate.history-new': 'Только новые сделки',
  'trade-sync.tradovate.start-date': 'Дата начала',

  'trade-sync.tradovate.mapping-required':
    'Выберите локальный счёт хранилища для каждого включённого счёта Tradovate.',
  'trade-sync.tradovate.custom-date-required':
    'Выберите дату начала для каждого варианта с настраиваемой историей.',
  'trade-sync.tradovate.recovery-title':
    'Восстановить отсутствующие заметки о сделках',
  'trade-sync.tradovate.recovery-count':
    'Заметок о сделках для восстановления: {count}',
  'trade-sync.tradovate.recovery-select-account':
    'Перед восстановлением заметок о сделках выберите локальный счёт.',
  'trade-sync.tradovate.recovery-confirm':
    'Восстановить заметки о сделках ({count}) в {account}?',

  'trade-sync.ctrader.status.setup-required': 'Требуется настройка счёта',
  'trade-sync.ctrader.status.connecting': 'Подключение',
  'trade-sync.ctrader.status.paused': 'Приостановлено',
  'trade-sync.ctrader.status.reauthorization-required':
    'Требуется повторная авторизация',
  'trade-sync.ctrader.status.deleting': 'Удаление облачных данных',
  'trade-sync.ctrader.status.error': 'Ошибка подключения',
  'trade-sync.ctrader.sync-complete-connection':
    'Синхронизация {connection} завершена.',
  'trade-sync.ctrader.sync-partial-connection':
    'Синхронизация {connection} завершена с проблемами.',
  'trade-sync.ctrader.sync-all': 'Синхронизировать все',
  'trade-sync.ctrader.sync-all-complete':
    'Синхронизировано подключений cTrader: {succeeded} из {total}.',
  'trade-sync.ctrader.sync-all-partial':
    'Синхронизировано подключений cTrader: {succeeded} из {total}. Проверьте подключения с проблемами.',
  'trade-sync.ctrader.sync-all-provider-partial':
    'Синхронизировано подключений cTrader: {succeeded} из {total} · синхронизация завершена частично',
  'trade-sync.ctrader.connect-another':
    'Подключить ещё одну учётную запись cTrader',
  'trade-sync.ctrader.no-connections':
    'Подключите учётную запись cTrader на Journalit.co, чтобы настроить и синхронизировать её здесь.',
  'trade-sync.ctrader.claimed-by-connection':
    'Синхронизация включена через {connection}. Отключите её там, прежде чем переключать эту учётную запись.',
  'trade-sync.ctrader.claim-conflict':
    'Другое подключение cTrader заняло эту учётную запись. Проверьте обновлённые карточки подключений перед повторной попыткой.',
  'trade-sync.ctrader.reconciliation-issues': 'Проблем сверки: {count}',
  'trade-sync.ctrader.website-connection-description':
    'Безопасно подключите cTrader или повторно авторизуйте его на Journalit.co, затем вернитесь сюда, чтобы выбрать счета и синхронизировать это хранилище.',
  'trade-sync.ctrader.plugin-sync-description':
    'Одна синхронизация получает последние данные активности cTrader и записывает соответствующие сделки в это хранилище.',
  'trade-sync.ctrader.connect': 'Подключить',
  'trade-sync.ctrader.manage-connection': 'Управление подключением',
  'trade-sync.ctrader.setup-guide': 'Руководство по настройке',
  'trade-sync.ctrader.setup-and-sync': 'Завершить настройку и синхронизировать',
  'trade-sync.ctrader.sync-to-vault': 'Синхронизировать',
  'trade-sync.ctrader.discovery-description':
    'Journalit необходимо обнаружить доступные через подключение cTrader Demo- и Live-счета.',
  'trade-sync.ctrader.discover-accounts': 'Обнаружить счета cTrader',
  'trade-sync.ctrader.discovering': 'Поиск счетов…',
  'trade-sync.ctrader.discovery-failed':
    'Не удалось обнаружить счета cTrader. Повторите попытку или управляйте подключением на Journalit.co.',
  'trade-sync.ctrader.sync-account': 'Включить в синхронизацию',
  'trade-sync.ctrader.history-label': 'Начальная история',
  'trade-sync.ctrader.history-all': 'Вся доступная история',
  'trade-sync.ctrader.history-recent': 'Последние 90 дней',
  'trade-sync.ctrader.history-custom': 'С указанной даты',
  'trade-sync.ctrader.history-new': 'Только новые сделки',
  'trade-sync.ctrader.start-date': 'Дата начала',
  'trade-sync.ctrader.mapping-required':
    'Выберите локальный счёт хранилища для каждого включённого счёта cTrader.',
  'trade-sync.ctrader.custom-date-required':
    'Выберите дату начала для каждого варианта с настраиваемой историей.',
  'trade-sync.ctrader.recovery-title':
    'Восстановить отсутствующие заметки о сделках',
  'trade-sync.ctrader.recovery-count':
    'Заметок о сделках для восстановления: {count}',
  'trade-sync.ctrader.recovery-select-account':
    'Перед восстановлением заметок о сделках выберите локальный счёт.',
  'trade-sync.ctrader.recovery-confirm':
    'Восстановить заметки о сделках ({count}) в {account}?',
  'trade-sync.oauth.remap.title': 'Сменить счёт',
  'trade-sync.oauth.remap.message':
    'Использовать {newAccount} и для существующих заметок? Иначе его будут использовать только будущие обновления от брокера.',
  'trade-sync.oauth.remap.update-notes': 'Обновить заметки',
  'trade-sync.oauth.remap.future-only': 'Только будущие обновления',
  'trade-sync.oauth.remap.unavailable':
    'Переназначение счёта недоступно. Обновите сервер Journalit и попробуйте снова.',
  'trade-sync.oauth.remap.restore-in-progress':
    'Дождитесь завершения восстановления и попробуйте снова.',
  'trade-sync.oauth.remap.operation-conflict':
    'Этот запрос на переназначение конфликтует с более ранней попыткой. Попробуйте снова.',
  'trade-sync.oauth.remap.account-busy':
    'Этот счёт сейчас синхронизируется. Повторите попытку чуть позже.',
  'trade-sync.oauth.remap.account-unavailable':
    'Этот счёт больше недоступен. Обновите страницу и попробуйте снова.',
  'trade-sync.oauth.remap.preserved-conflicts':
    'Существующих конфликтов оставлено без изменений: {count}.',
  'trade-sync.oauth.remap.notes-pending':
    'Обновлений существующих заметок в ожидании: {count}. Синхронизируйте снова, чтобы повторить попытку.',
  'trade-sync.source.ctrader': 'cTrader',
  'trade-sync.source.hyperliquid': 'Hyperliquid',
  'trade-sync.source.hyperliquid.description':
    'Синхронизация только для просмотра бессрочных фьючерсов Hyperliquid в USDC, настраивается на Journalit.co и записывается в это хранилище.',
  'onboarding.broker.option.hyperliquid-sync.label':
    'Hyperliquid (бессрочные фьючерсы USDC)',
  'trade-sync.hyperliquid.recovery-title':
    'Восстановить отсутствующие заметки о сделках',
  'trade-sync.hyperliquid.recovery-count':
    'Заметок о сделках для восстановления: {count}',
  'trade-sync.hyperliquid.recovery-select-account':
    'Перед восстановлением заметок о сделках выберите локальный счёт.',
  'trade-sync.hyperliquid.recovery-confirm':
    'Восстановить заметки о сделках ({count}) в {account}?',
  'trade-sync.hyperliquid.scope-description':
    'Синхронизация охватывает только бессрочные фьючерсы с расчётами в USDC, а история, которую Hyperliquid отдаёт через API, может быть неполной. Импорт CSV остаётся доступным, но пересекающиеся сделки из CSV и синхронизации не дедуплицируются автоматически.',
  'trade-sync.hyperliquid.description':
    'Только просмотр: подключите адрес кошелька и выберите счета и историю на Journalit.co. Здесь вы сопоставляете каждый счёт со счётом Journalit и синхронизируете сделки в это хранилище.',
  'trade-sync.hyperliquid.manage-on-website': 'Управлять на Journalit.co',
  'trade-sync.hyperliquid.connect-on-website': 'Подключить на Journalit.co',
  'trade-sync.hyperliquid.manage-connection': 'Управлять на сайте',
  'trade-sync.hyperliquid.pending-acks':
    'Обновлений хранилища, ожидающих подтверждения: {count}.',
  'trade-sync.hyperliquid.disabled':
    'Синхронизация Hyperliquid пока недоступна.',
  'trade-sync.hyperliquid.status-failed':
    'Не удалось загрузить статус Hyperliquid.',
  'trade-sync.hyperliquid.no-connections':
    'Подключений Hyperliquid пока нет. Подключите адрес кошелька на Journalit.co и вернитесь сюда.',
  'trade-sync.hyperliquid.never': 'Никогда',
  'trade-sync.hyperliquid.last-sync': 'Последняя синхронизация',
  'trade-sync.hyperliquid.reconciliation-issues': 'Проблем сверки: {count}',
  'trade-sync.hyperliquid.status.pending': 'Поиск счетов',
  'trade-sync.hyperliquid.status.setup-required': 'Требуется настройка',
  'trade-sync.hyperliquid.status.paused': 'Приостановлено',
  'trade-sync.hyperliquid.status.attention': 'Требует внимания',
  'trade-sync.hyperliquid.status.error': 'Ошибка подключения',
  'trade-sync.hyperliquid.status.deleting': 'Удаление облачных данных',
  'trade-sync.hyperliquid.notice.setup-required':
    'Выберите на Journalit.co, какие счета и какую историю синхронизировать.',
  'trade-sync.hyperliquid.notice.paused':
    'Синхронизация приостановлена. Существующие заметки сохранены. Возобновите её на Journalit.co.',
  'trade-sync.hyperliquid.notice.attention':
    'Это подключение требует внимания. Проверьте его на Journalit.co или свяжитесь с поддержкой.',
  'trade-sync.hyperliquid.account.selected': 'Выбран для синхронизации',
  'trade-sync.hyperliquid.account.not-selected': 'Не выбран',
  'trade-sync.hyperliquid.claimed-by-connection':
    'Синхронизируется через {connection}.',
  'trade-sync.hyperliquid.mapping-required':
    'Сначала выберите счёт Journalit для каждого выбранного счёта.',
  'trade-sync.hyperliquid.sync-to-vault': 'Синхронизировать',
  'trade-sync.hyperliquid.sync-all': 'Синхронизировать все',
  'trade-sync.hyperliquid.sync-complete':
    'Синхронизация {connection} завершена.',
  'trade-sync.hyperliquid.sync-partial':
    'Синхронизация {connection} завершена с проблемами.',
  'trade-sync.hyperliquid.sync-all-complete':
    'Синхронизировано подключений Hyperliquid: {succeeded} из {total}.',
  'trade-sync.hyperliquid.sync-all-partial':
    'Синхронизировано подключений Hyperliquid: {succeeded} из {total}. Проверьте подключения с проблемами.',
  'trade-sync.hyperliquid.sync-all-provider-partial':
    'Синхронизировано подключений Hyperliquid: {succeeded} из {total} · синхронизация завершена частично',
  'trade-sync.source.ctrader.description':
    'Синхронизирует сделки cTrader в облаке и переносит их в это хранилище.',
  'trade-sync.ctrader.status-failed': 'Не удалось загрузить статус cTrader.',
  'trade-sync.ctrader.last-sync': 'Последняя синхронизация',
  'trade-sync.ctrader.pending-acks': '{count} ожидающих локальных ACK',
  'trade-sync.ctrader.never': 'Никогда',

  
  
  

  
  'command.add-trade': 'Добавить новую сделку',
  'command.quick-import-trades': 'Быстрый импорт сделок',
  'command.import-trades-csv': 'Открыть Trade Import',

  
  'command.create-drc': 'Открыть дневной анализ',
  'command.create-weekly-review': 'Открыть недельный обзор',
  'command.create-monthly-review': 'Открыть месячный обзор',
  'command.create-quarterly-review': 'Открыть квартальный обзор',
  'command.create-yearly-review': 'Открыть годовой обзор',

  
  'command.open-dashboard': 'Открыть панель',
  'command.open-account-dashboard': 'Открыть счета',
  'command.open-trade-log': 'Открыть журнал сделок',
  'command.open-home': 'Открыть главную',
  'command.open-settings': 'Открыть настройки',
  'command.open-position-size-calculator':
    'Открыть калькулятор размера позиции',

  

  
  'command.replay-onboarding': 'Повторить вводное руководство',
  'command.replay-current-view-guide':
    'Повторить гайд для текущего представления',
  'command.open-release-notes': 'Просмотреть примечания к выпуску',

  
  'command.open-layout-builder': 'Открыть конструктор макетов',

  
  
  
  'form.section.trade-details': 'Детали сделки',
  'form.section.trading-costs': 'Торговые издержки',
  'form.section.risk-management': 'Управление рисками',
  'form.section.take-profits': 'Тейк-профиты',
  'form.section.analysis-thesis': 'Анализ и тезис',

  
  
  
  'form.tab.basic': 'Основное',
  'form.tab.details': 'Детали',
  'form.tab.advanced': 'Дополнительно',

  
  
  
  'form.import-shortcut.open': 'Открыть импорт сделок',
  'form.manual-import-nudge.title.one':
    'Совет: вы добавили вручную {count} сделку',
  'form.manual-import-nudge.title.few':
    'Совет: вы добавили вручную {count} сделки',
  'form.manual-import-nudge.title.many':
    'Совет: вы добавили вручную {count} сделок',
  'form.manual-import-nudge.title.other':
    'Совет: вы добавили вручную {count} сделки',
  'form.manual-import-nudge.body':
    'Импорт сделок может загрузить историю вашего брокера или таблицы одним пакетом, а не по одной сделке.',
  'form.manual-import-nudge.cta': 'Посмотреть мои сделки',
  'form.manual-import-nudge.dismiss': 'Не сейчас',
  'form.layout.customize': 'Настроить форму',
  'form.layout.modal-title': 'Настроить форму сделки',
  'form.layout.back-to-trade': 'Вернуться к сделке',
  'form.layout.save-layout': 'Сохранить макет',
  'form.layout.discard-changes.body':
    'Отменить несохранённые настройки? Черновик сделки будет сохранён.',
  'form.layout.settings-title': 'Макет формы сделки',

  'form.layout.input-mode': 'Режим ввода',
  'form.layout.input-mode-prices': 'Цены',
  'form.layout.input-mode-pnl-risk': 'P&L + Риск',
  'form.layout.input-mode-prices-desc':
    'Записывайте цены входа и выхода, а Journalit рассчитает P&L.',
  'form.layout.input-mode-pnl-risk-desc':
    'Записывайте P&L сделки и сумму риска напрямую. Journalit автоматически рассчитает R-множитель.',
  'form.layout.asset-type-mode': 'Тип актива',
  'form.layout.asset-type-mode-show': 'Спрашивать',
  'form.layout.asset-type-mode-fixed': 'Фиксированный',
  'form.layout.default-asset-type': 'Тип актива по умолчанию',
  'form.layout.active-fields': 'Видимые блоки',
  'form.layout.available-fields': 'Скрытые блоки',
  'form.layout.active-fields-desc':
    'Перетаскивайте блоки, чтобы изменить порядок. Уберите то, чем не пользуетесь.',
  'form.layout.available-fields-desc':
    'Добавляйте скрытые блоки обратно в форму сделки, когда они нужны.',
  'form.layout.empty-active': 'Нет видимых дополнительных блоков.',
  'form.layout.all-active': 'Все дополнительные блоки видимы.',
  'form.layout.add-field-aria': 'Добавить {field} в форму сделки',
  'form.layout.remove-field-aria': 'Скрыть {field} в форме сделки',
  'form.layout.saved': 'Макет формы сделки сохранен',
  'form.layout.item.trading-costs.commission': 'Комиссия',
  'form.layout.item.import-shortcut': 'Ярлык импорта',
  'form.layout.item.import-shortcut-desc':
    'Показывает кнопку внизу формы, открывающую импорт сделок.',
  'form.layout.item.core-details': 'Основные детали сделки',
  'form.layout.item.core-details-desc':
    'Счет, инструмент, направление и входы/выходы остаются первыми.',
  'form.layout.item.asset-specific': 'Поля для типа актива',
  'form.layout.item.pnl-preview': 'Предпросмотр P&L',

  'form.layout.item.trade-currency': 'Валюта сделки / Курс обмена',
  'form.layout.item.trade-currency-desc':
    'Вводите сделку в другой валюте с необязательным ручным курсом обмена.',
  'form.layout.item.exchange-desc':
    'Поле биржи для сделок по акциям и криптовалюте.',
  'form.layout.item.direct-pnl-toggle-desc':
    'Переключить отдельную сделку на ввод общего P&L вместо цен выхода.',
  'form.layout.manual-fx-rate': 'Переопределение курса FX',
  'form.layout.result-r': 'Результат в R',
  'form.layout.entry-time': 'Время сделки',

  
  
  
  'form.field.account': 'Счёт',
  'form.field.prop-challenge-phase': 'Фаза: {name}',
  'form.field.prop-challenge-phase.none': 'Нет фазы на это время',
  'form.field.asset-type': 'Тип актива',
  'form.field.direction': 'Направление',
  'form.field.direction.long': 'Лонг',
  'form.field.direction.short': 'Шорт',
  'form.field.commission': 'Комиссия',
  'form.field.commission-type': 'Тип',
  'form.field.rebate': 'Рибейт',
  'form.field.swap': 'Своп',
  'form.field.other-fees': 'Прочие сборы',
  'form.field.stop-loss': 'Стоп-лосс',
  'form.field.take-profit': 'Тейк-профит',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Целевая цена',
  'form.field.close-percent': 'Закрытие %',
  'form.field.close-size': 'Размер закрытия',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': 'Объём закрытия Take Profit как',
  'form.layout.take-profit-unit-percent': 'Закрытие %',
  'form.layout.take-profit-unit-size': 'Размер',
  'trade.validation.take-profit-size-number':
    'Размер тейк-профита должен быть корректным числом.',
  'trade.validation.take-profit-size-positive':
    'Размер тейк-профита должен быть больше 0.',
  'trade.validation.take-profit-total-size-range':
    'Суммарный размер тейк-профитов не может превышать размер позиции.',
  'form.field.risk-amount': 'Сумма риска',
  'form.field.profit-loss': 'Прибыль/Убыток',
  'form.field.total-pnl': 'P&L сделки',
  'form.field.realized-pnl': 'Реализованный P&L',
  'form.field.floating-pnl': 'Плавающий P&L',
  'form.field.total-costs': 'Общие издержки:',
  'form.field.setup': 'Сетап',
  'form.field.mistake': 'Ошибка',
  'form.field.tags': 'Теги',
  'form.field.trade-thesis': 'Тезис сделки',
  'form.field.time': 'Время',
  'form.field.price': 'Цена',

  'form.field.entries': 'Входы',
  'form.field.exits': 'Выходы',
  'form.field.dividends': 'Дивиденды',
  'form.field.dividend-amount': 'Сумма дивиденда',
  'form.field.optional': '(необязательно)',

  
  'form.field.position-size': 'Размер позиции',
  'form.field.position-size.shares': 'Акции',
  'form.field.position-size.contracts': 'Контракты',
  'form.field.position-size.lots': 'Лоты',
  'form.field.position-size.amount': 'Количество',
  'form.field.position-size.cfd-units': 'Единицы CFD',

  
  'form.field.instrument': 'Инструмент',
  'form.field.instrument.ticker': 'Тикер',
  'form.field.instrument.option-symbol': 'Символ опциона',
  'form.field.instrument.future-symbol': 'Символ фьючерса',
  'form.field.instrument.forex-pair': 'Валютная пара',
  'form.field.instrument.crypto-symbol': 'Символ криптовалюты',
  'form.field.instrument.cfd-symbol': 'Символ CFD',

  
  'form.field.exchange': 'Биржа',
  'form.field.expiration-date': 'Дата экспирации',
  'form.field.strike-price': 'Цена страйка',
  'form.field.contract-size': 'Размер контракта',
  'form.field.dollars-per-point': 'Долларов за пункт',
  'form.field.tick-size': 'Размер тика',
  'form.field.tick-value': 'Стоимость тика',
  'form.field.lot-size': 'Размер лота',
  'form.field.custom-lot-size': 'Пользовательский размер лота',
  'form.field.pip-value': 'Стоимость пипса',
  'form.field.leverage-ratio': 'Коэффициент плеча',
  'form.field.trade-currency': 'Валюта сделки',
  'form.field.fx-rate': 'Курс обмена к {base}',
  'form.field.fx-rate-override': 'Переопределение курса FX ({quote} → {base})',

  
  'form.forex.using-manual-rate': 'Используется ручной курс',
  'form.field.lot-size.standard': 'Стандартный (100 000)',
  'form.field.lot-size.mini': 'Мини (10 000)',
  'form.field.lot-size.micro': 'Микро (1 000)',
  'form.field.lot-size.custom': 'Пользовательский',

  
  
  
  'form.placeholder.select-accounts': 'Выберите счета',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': 'Рибейт/возврат комиссии',
  'form.placeholder.swap': 'Ночное финансирование',
  'form.placeholder.other-fees': 'Биржевые/регуляторные сборы',
  'form.placeholder.dividend-amount':
    'Денежная сумма, положительная или отрицательная',
  'form.placeholder.stop-loss': 'Цена стопа',
  'form.layout.stop-loss-unit': 'Объём стоп-лосса как',
  'form.layout.stop-loss-unit-percent': '% позиции',
  'form.layout.stop-loss-unit-size': 'Размер',
  'form.field.stop-loss-short': 'SL',
  'form.field.stop-price': 'Цена стопа',
  'form.field.stop-loss-percent': '% позиции',
  'form.field.stop-loss-size': 'Размер',
  'form.action.remove-stop-loss': 'Удалить стоп-лосс',
  'form.stop-loss.coverage': 'Стопы покрывают {percent} позиции.',
  'form.stop-loss.coverage-partial':
    'Пока у каждой единицы нет стопа, риск берётся из суммы риска.',
  'form.placeholder.stop-loss-rest': 'Остаток',
  'form.empty.stop-losses': 'Стоп-лоссов пока нет',
  'tradelog.tooltip.stop-losses': 'Стоп-лоссы',
  'form.placeholder.stop-loss-size-amount': '{size} ед.',
  'trade.validation.stop-loss-price-required': 'Цена стоп-лосса обязательна.',
  'trade.validation.stop-loss-close-percent-number':
    'Процент стоп-лосса должен быть корректным числом.',
  'trade.validation.stop-loss-close-percent-range':
    'Процент стоп-лосса должен быть от 1 до 100.',
  'trade.validation.stop-loss-size-number':
    'Размер стоп-лосса должен быть корректным числом.',
  'trade.validation.stop-loss-size-positive':
    'Размер стоп-лосса должен быть больше 0.',
  'trade.validation.stop-loss-single-blank-amount':
    'Только у одного стоп-лосса объём может быть пустым.',
  'trade.validation.stop-loss-total-over-position':
    'Стоп-лоссы покрывают больше, чем позиция.',
  'trade.details.stop-loss-count': 'Стопов: {count}',
  'form.placeholder.target-price': 'Целевая цена',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': 'Планируемый риск в валюте',
  'form.placeholder.fx-rate': '1 {currency} = ? {base} (пусто: дневной курс)',
  'form.placeholder.custom-tag': 'Введите тег и нажмите Enter',
  'form.placeholder.thesis': 'Введите тезис для этой сделки...',

  'form.placeholder.exchange-stock': 'напр., NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'напр., Binance, Coinbase',
  'form.placeholder.futures-point-value': 'напр.: 50 для ES1',
  'form.placeholder.leverage': 'напр., 100 для 1:100',

  
  
  
  'form.entry-exit.add-entry': '+ Добавить вход',
  'form.entry-exit.backtest-day':
    'Дата: {date}, день вашей последней бэктест-сделки.',
  'form.entry-exit.use-today': 'Использовать сегодня',
  'form.entry-exit.add-exit': '+ Добавить выход',
  'form.entry-exit.remove-entry': 'Удалить вход',
  'form.entry-exit.remove-exit': 'Удалить выход',
  'form.dividends.add-dividend': '+ Добавить дивиденд',
  'form.dividends.remove-dividend': 'Удалить дивиденд',
  'form.dividends.total-dividends': 'Всего дивидендов:',
  'form.entry-exit.total-entry-size': 'Общий размер входа:',
  'form.entry-exit.remaining-position': 'Остаток позиции:',
  'form.entry-exit.open': '(Открыта)',
  'form.entry-exit.closed': '(Закрыта)',
  'form.entry-exit.direct-pnl': 'Ввести базовый P&L сделки напрямую вместо цен',
  'form.entry-exit.direct-pnl-desc':
    'Введите прибыль/убыток сделки до дивидендов. Комиссии и сборы по-прежнему учитываются отдельно.',
  'form.entry-exit.calc-pnl':
    'Рассчитать P&L из цен входа/выхода и размеров позиции.',
  'form.ideal-exit.title': 'Идеальные выходы',

  'form.ideal-exit.price': 'Идеальная цена',
  'form.ideal-exit.size': 'Размер',
  'form.ideal-exit.remove': 'Удалить идеальный выход',

  'form.ideal-exit.copy-actual': 'Копировать фактические выходы',

  'form.ideal-exit.tooltip':
    'Запишите ретроспективный план выхода, который вы хотели бы исполнить. Поддерживает частичные выходы для анализа.',
  'form.ideal-exit.empty': 'Идеальных выходов пока нет',
  'form.unrealized.title': 'Снимок открытой позиции',
  'form.unrealized.tooltip':
    'Укажите текущую рыночную цену открытой позиции, чтобы отслеживать нереализованный P&L. Снимок автоматически удаляется при закрытии сделки.',
  'form.unrealized.price': 'Цена снимка',
  'form.unrealized.time': 'Время снимка',
  'form.unrealized.preview': 'Нереализованный P&L',
  'form.unrealized.captured': 'Зафиксировано {time}',
  'form.layout.item.unrealized-snapshot-desc':
    'Отслеживание нереализованного P&L открытых позиций.',
  'trade.validation.unrealized-snapshot-price-non-negative':
    'Цена снимка должна быть неотрицательным числом',
  'trade.validation.unrealized-snapshot-open-position-required':
    'Время снимка должно приходиться на открытую позицию.',
  
  
  
  'form.trade-type.title': 'Тип сделки',
  'form.trade-type.subtitle': 'Выберите тип создаваемой сделки',
  'form.trade-type.regular': 'Обычная сделка',
  'form.trade-type.regular-desc':
    'Обычная сделка с полными данными входа и выхода',
  'form.trade-type.missed': 'Пропущенная сделка',
  'form.trade-type.missed-desc':
    'Упущенная торговая возможность - P&L и счёт необязательны',
  'form.trade-type.backtest': 'Бэктест-сделка',
  'form.trade-type.backtest-desc': 'Сценарий бэктестинга для анализа',
  'form.trade-type.missed-reason': 'Почему вы пропустили эту сделку?',
  'form.trade-type.missed-reason-placeholder':
    'Опишите, почему вы пропустили эту торговую возможность...',

  'form.account-empty-state.title': 'Создайте свой первый счёт',
  'form.account-empty-state.description':
    'Счета отслеживают баланс, чтобы Journalit мог рассчитать доходность, риск и просадку. Для создания нужно только название.',
  'form.account-empty-state.create-account': 'Создать счёт',
  'form.account-empty-state.submit-disabled':
    'Сначала создайте счёт, чтобы сохранить эту сделку.',
  'form.empty.take-profits': 'Целей тейк-профита пока нет',
  'form.action.remove-take-profit': 'Удалить тейк-профит',

  
  
  
  'button.save': 'Сохранить',
  'button.cancel': 'Отмена',
  'button.close': 'Закрыть',
  'button.delete': 'Удалить',
  'button.update': 'Обновить',
  'button.open': 'Открыть',
  'button.add': 'Добавить',
  'button.create': 'Создать',
  'button.reset': 'Сбросить',

  'button.confirm': 'Подтвердить',

  'button.add-trade': 'Добавить сделку',
  'button.update-trade': 'Обновить сделку',
  'button.save-changes': 'Сохранить изменения',
  'button.delete-all': 'Удалить все',
  'button.clear-all': 'Очистить все',

  'button.cancel-reset': 'Отменить сброс',
  'button.proceed-anyway': 'Продолжить всё равно',
  'button.mark-reviewed': 'Отметить проверенным',

  'button.learn-more': 'Узнать больше',
  'button.upload-image': 'Загрузить медиа',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': 'Изменить',
  'validation.fix-errors': 'Пожалуйста, исправьте следующие ошибки:',

  'validation.complete-required': 'Пожалуйста, заполните все обязательные поля',

  'validation.missed-trade-requires-exit':
    'Пропущенные сделки должны содержать данные выхода с ненулевыми ценами. Они представляют возможности, которые уже прошли, поэтому нужно указать, какой была бы цена выхода.',
  'trade.validation.entry-required': 'Требуется хотя бы один вход.',
  'trade.validation.entry-time-required': 'Время входа обязательно.',
  'trade.validation.entry-price-required': 'Цена входа обязательна.',
  'trade.validation.entry-size-positive':
    'Размер входа должен быть больше нуля.',
  'trade.validation.exit-required-closed':
    'Для закрытых сделок требуется хотя бы один выход.',
  'trade.validation.exit-time-required': 'Время выхода обязательно.',
  'trade.validation.exit-price-required': 'Цена выхода обязательна.',
  'trade.validation.exit-size-positive':
    'Размер выхода должен быть больше нуля.',
  'trade.validation.exit-size-exceeds-entry':
    'Суммарный размер выхода не может превышать размер входа.',
  'trade.validation.exit-before-entry':
    'Выходы не могут быть раньше первого входа.',
  'trade.validation.dividend-time-required': 'Время дивиденда обязательно.',
  'trade.validation.dividend-amount-nonzero':
    'Сумма дивиденда должна быть ненулевым числом.',
  'trade.validation.direct-pnl-required': 'Введите значение прибыли/убытка.',
  'trade.validation.entry-time-select': 'Выберите время входа.',
  'trade.validation.direction-required': 'Выберите направление.',
  'trade.validation.asset-type-required': 'Выберите тип актива.',
  'trade.validation.ticker-required': 'Выберите тикер.',
  'trade.validation.ticker-invalid':
    'Введите корректный символ тикера (только буквы, цифры и точки).',
  'trade.validation.account-required': 'Выберите хотя бы один счёт.',
  'trade.validation.exit-time-select': 'Выберите время выхода.',
  'trade.validation.entry-price-invalid': 'Введите корректную цену входа.',
  'trade.validation.exit-price-invalid': 'Введите корректную цену выхода.',
  'trade.validation.position-size-invalid':
    'Введите корректный размер позиции.',
  'trade.validation.exit-time-after-entry':
    'Время выхода должно быть после времени входа.',
  'trade.validation.expiration-date-required': 'Выберите дату экспирации.',
  'trade.validation.strike-price-required': 'Введите цену страйка.',
  'trade.validation.option-type-required':
    'Выберите тип опциона (call или put).',
  'trade.validation.contract-size-positive':
    'Размер контракта должен быть больше нуля.',
  'trade.validation.dollars-per-point-min':
    'Введите значение долларов за пункт (мин. 0.01).',
  'trade.validation.lot-size-nonnegative':
    'Размер лота должен быть больше нуля.',
  'trade.validation.leverage-positive':
    'Кредитное плечо должно быть больше нуля.',
  'trade.validation.commission-type-invalid':
    'Тип комиссии должен быть "fixed" или "percentage".',
  'trade.validation.commission-number': 'Комиссия должна быть числом.',
  'trade.validation.commission-percentage-range':
    'Процентная комиссия должна быть между 0 и 100.',
  'trade.validation.rebate-options-only':
    'Ребейт разрешён только для опционных сделок.',
  'trade.validation.rebate-number': 'Ребейт должен быть числом.',
  'trade.validation.rebate-positive':
    'Ребейт должен быть положительным значением.',
  'trade.validation.swap-invalid': 'Некорректная сумма свопа.',
  'trade.validation.fees-number': 'Комиссии должны быть числом.',
  'trade.validation.risk-number': 'Риск должен быть числом.',
  'trade.validation.risk-valid-number': 'Риск должен быть корректным числом.',
  'trade.validation.risk-positive': 'Риск должен быть больше нуля.',
  'trade.validation.fx-rate-number':
    'Курс обмена должен быть корректным числом.',
  'trade.validation.fx-rate-positive': 'Курс обмена должен быть больше нуля.',
  'trade.validation.stop-loss-number': 'Стоп-лосс должен быть числом.',
  'trade.validation.stop-loss-valid-number':
    'Стоп-лосс должен быть корректным числом.',
  'trade.validation.take-profit-price-required':
    'Цена тейк-профита обязательна.',
  'trade.validation.take-profit-price-number':
    'Цена тейк-профита должна быть числом.',
  'trade.validation.take-profit-price-valid-number':
    'Цена тейк-профита должна быть корректным числом.',
  'trade.validation.take-profit-close-percent-number':
    'Процент закрытия по тейк-профиту должен быть числом.',
  'trade.validation.take-profit-close-percent-valid-number':
    'Процент закрытия по тейк-профиту должен быть корректным числом.',
  'trade.validation.take-profit-close-percent-range':
    'Процент закрытия по тейк-профиту должен быть от 1 до 100.',
  'trade.validation.take-profit-total-close-percent-range':
    'Сумма процентов закрытия по тейк-профитам не может превышать 100.',
  'validation.custom-field.key-empty': 'Ключ поля не может быть пустым',
  'validation.custom-field.key-conflict':
    'Это имя поля конфликтует со встроенными полями сделки',
  'validation.custom-field.key-format':
    'Ключ поля должен начинаться с буквы и содержать только буквы, цифры и подчёркивания',
  'validation.custom-field.required': '{label} обязательно',
  'validation.custom-field.text': '{label} должно быть текстом',
  'validation.custom-field.min-length':
    '{label} должно содержать не менее {minLength} символов',
  'validation.custom-field.max-length':
    '{label} должно содержать не более {maxLength} символов',
  'validation.custom-field.pattern-invalid': '{label} имеет неверный формат',
  'validation.custom-field.pattern-invalid-pattern':
    '{label} имеет недопустимый шаблон проверки',
  'validation.custom-field.number': '{label} должно быть числом',
  'validation.custom-field.min': '{label} должно быть не меньше {min}',
  'validation.custom-field.max': '{label} должно быть не больше {max}',
  'validation.custom-field.selection': '{label} должно быть корректным выбором',
  'validation.custom-field.option': '{label} должно быть допустимым вариантом',
  'validation.custom-field.array':
    '{label} должно быть массивом выбранных значений',
  'validation.custom-field.invalid-option':
    '{label} содержит недопустимый вариант: {item}',
  'validation.custom-field.date': '{label} должно быть корректной датой',
  'validation.custom-field.time': '{label} должно быть корректным временем',
  'validation.custom-field.time-format':
    '{label} должно иметь корректный формат времени (HH:MM, HH:MM:SS или 12-часовой с AM/PM)',
  'validation.custom-field.time-values':
    '{label} содержит некорректные значения времени',

  
  
  

  'notice.login-success': 'Вход выполнен успешно!',
  'notice.pro-access-ready': 'Доступ PRO готов.',

  'notice.logout-success': 'Выход выполнен успешно',
  'notice.ftp-created': 'FTP-учётные данные созданы успешно',
  'notice.ftp-password-rotated':
    'Для этого устройства созданы новые FTP-учётные данные. FTP-синхронизацию на других устройствах (например, в вашем MetaTrader EA) необходимо обновить с новым паролем.',
  'notice.ftp-reused':
    'Загружены существующие FTP-учётные данные с этого устройства. Если они больше не работают, используйте «Сбросить пароль».',
  'notice.ftp-reset': 'Пароль FTP сброшен! Сохраните новый пароль.',
  'notice.template-saved': 'Layout сохранён',
  'notice.template-created': 'Layout создан',
  'notice.template-duplicated': 'Layout дублирован',
  'notice.template-deleted': 'Layout удалён',
  'notice.default-template-updated': 'Layout по умолчанию обновлён',
  'notice.tradelog-saved': 'Настройки журнала сделок сохранены',
  'notice.settings-exported': 'Настройки экспортированы в {filename}',
  'notice.settings-imported':
    'Настройки успешно импортированы из v{version}. Перезапустите Obsidian для применения всех изменений.',

  'notice.template-switched': 'Переключено на: {name}',
  'notice.auto-sync-toggled': 'Авто-синхронизация {status}',
  'notice.auto-sync-enabled': 'включена',
  'notice.auto-sync-disabled': 'отключена',
  'notice.reset-items': 'Элементы сброшены к значениям по умолчанию',

  'notice.custom-fields-imported':
    'Успешно импортировано {count} пользовательских полей',

  'notice.setups-added': 'Сетапы добавлены к {count} сделкам',
  'notice.tags-added': 'Теги добавлены к сделкам: {count}',
  'notice.mistakes-added': 'Ошибки добавлены к {count} сделкам',

  
  
  
  'notice.error.open-journalit':
    'Не удалось открыть Journalit. Попробуйте перезагрузить Obsidian.',
  'notice.error.open-drc': 'Не удалось открыть дневной анализ: {error}',
  'notice.error.open-trade-log': 'Не удалось открыть журнал сделок: {error}',
  'notice.error.open-csv-import': 'Не удалось открыть Trade Import: {error}',
  'notice.error.open-weekly-review':
    'Не удалось открыть недельный обзор: {error}',
  'notice.error.open-monthly-review':
    'Не удалось открыть месячный обзор: {error}',
  'notice.error.open-quarterly-review':
    'Не удалось открыть квартальный обзор: {error}',
  'notice.error.open-yearly-review':
    'Не удалось открыть годовой обзор: {error}',

  'notice.error.open-release-notes':
    'Не удалось открыть примечания к выпуску: {error}',
  'notice.guide.replay-unavailable':
    'Система гайдов пока недоступна. Попробуйте снова.',
  'notice.guide.no-active-view':
    'Сначала откройте поддерживаемое представление Journalit, затем запустите команду снова.',
  'notice.guide.no-guide-for-view':
    'Для этого представления пока не зарегистрирован гайд ({viewType}).',
  'notice.guide.unavailable-in-current-state':
    'Гайд этого представления недоступен в его текущем состоянии.',
  'notice.guide.replay-failed': 'Не удалось запустить гайд. Попробуйте снова.',
  'notice.guide.replay-started': 'Гайд для этого представления перезапущен.',
  'notice.error.open-layout-builder':
    'Не удалось открыть конструктор макетов: {error}',
  'notice.error.switch-template': 'Не удалось сменить layout: {error}',
  'notice.error.no-template-support':
    'Этот тип заметки не поддерживает макеты.',
  'notice.error.no-templates': 'Нет доступных layoutов для этого типа заметки.',
  'notice.error.asset-type-required':
    'Тип актива обязателен при добавлении инструмента',
  'notice.error.column-required':
    'Должна остаться хотя бы одна видимая колонка',
  'notice.error.save-settings': 'Ошибка сохранения настроек: {error}',
  'notice.error.sign-in-vault': 'Войдите, чтобы зарегистрировать хранилище.',
  'notice.error.sign-in-sync':
    'Войдите для использования автоматической синхронизации.',
  'notice.error.restore-auth':
    'Не удалось восстановить аутентификацию. Войдите снова через Настройки → Аутентификация.',
  'notice.error.export-settings':
    'Не удалось экспортировать настройки. Проверьте консоль.',
  'notice.error.import-settings': 'Не удалось импортировать настройки: {error}',
  'notice.error.reset-settings':
    'Не удалось сбросить настройки. Проверьте консоль.',

  'notice.error.mark-reviewed':
    'Ошибка при отметке сделок как проверенных: {error}',
  'notice.error.add-setups': 'Ошибка добавления сетапов: {error}',
  'notice.error.add-tags': 'Ошибка при добавлении тегов: {error}',
  'notice.error.add-mistakes': 'Ошибка добавления ошибок: {error}',
  'notice.error.duplicate-trades': 'Ошибка дублирования сделок: {error}',
  'notice.error.delete-trades': 'Ошибка удаления сделок: {error}',
  'notice.error.cannot-delete-builtin': 'Нельзя удалить встроенные layouts',
  'notice.error.duplicate-to-customize': 'Дублируйте этот layout для настройки',
  'notice.error.sign-out': 'Не удалось выйти из аккаунта. Попробуйте снова.',
  'notice.error.open-upgrade-modal':
    'Запрошена премиум-функция, но не удалось открыть окно обновления.',

  
  
  

  'notice.info.settings-recovered':
    'Настройки восстановлены из резервной копии. Некоторые недавние изменения могут быть утеряны.',
  'notice.info.cannot-remove-locked': 'Нельзя удалить заблокированные виджеты',

  
  
  

  
  'notice.trade-updated': '{type} обновлён: {path}',
  'notice.trade-created': '{type} создан: {path}',
  'notice.new-trade-created': 'Новая сделка создана: {instrument} {direction}',
  'notice.error.trade-update-failed': 'Не удалось обновить {type}: {error}',
  'notice.error.trade-create-failed': 'Не удалось создать {type}: {error}',

  
  'notice.template-applied': 'Layout применён: {name}',

  'notice.error.switch-template-generic': 'Не удалось сменить layout',

  'notice.error.template-save-failed': 'Не удалось сохранить layout',
  'notice.default-trade-template-updated': 'Макет сделки по умолчанию обновлён',
  'notice.trade-template-duplicated': 'Layout сделки дублирован',
  'notice.trade-template-deleted': 'Layout сделки удалён',
  'notice.error.create-template': 'Не удалось создать layout',
  'notice.error.duplicate-template': 'Не удалось дублировать layout',
  'notice.error.delete-template': 'Не удалось удалить layout',

  

  'notice.csv-template-deleted': 'Шаблон "{name}" удалён',
  'notice.csv-template-delete-failed': 'Не удалось удалить шаблон: {error}',
  'notice.csv-template-imported': 'Шаблон "{name}" успешно импортирован',
  'notice.csv-missing-fields':
    'Сопоставьте все обязательные поля перед созданием предпросмотра.',

  
  'notice.error.open-account-dashboard': 'Не удалось открыть счета: {error}',
  'notice.error.open-trade-form-edit':
    'Не удалось открыть форму редактирования сделки: {error}',
  'notice.error.open-onboarding':
    'Не удалось открыть мастер настройки. Проверьте консоль.',

  'notice.error.cannot-change-folder-during-sync':
    'Невозможно изменить путь папки во время синхронизации. Дождитесь завершения синхронизации.',
  'notice.error.file-not-found': 'Файл не найден: {path}',

  
  'notice.sync-mapping.updating':
    'Обновление сопоставлений синхронизации сделок для нового пути...',
  'notice.sync-mapping.updated':
    'Сопоставления синхронизации сделок успешно обновлены',
  'notice.error.sync-mapping-update-failed':
    'Не удалось обновить сопоставления синхронизации. Перезапустите плагин.',

  
  'notice.plugin-updated': 'Journalit обновлён до v{version}!',
  'notice.settings-reset-with-backup':
    'Настройки сброшены к значениям по умолчанию. Создана резервная копия. Перезапустите Obsidian для применения всех изменений.',
  'notice.settings-reset-no-backup':
    'Настройки сброшены к значениям по умолчанию. Резервная копия не создана. Перезапустите Obsidian для применения всех изменений.',

  
  
  
  'tradelog.title': 'Журнал сделок',
  'dashboard.guide.empty.intro.title': 'Добро пожаловать на панель',
  'dashboard.guide.empty.intro.description':
    'Панель становится полезной, как только в Journalit появляется история торговли для анализа.',
  'dashboard.guide.empty.state.title': 'Возьмите историю торговли с собой',
  'dashboard.guide.empty.state.description':
    'Импортируйте прошлые сделки, чтобы начать с содержательных данных о результатах, или добавьте сделку вручную, если только начинаете вести журнал.',
  'dashboard.guide.main.intro.title': 'Это ваша панель',
  'dashboard.guide.main.intro.description':
    'На этой странице отслеживайте результаты, изучайте статистику и держите самые полезные графики в одном месте.',
  'dashboard.guide.main.filters.title': 'Фильтры меняют всю панель',
  'dashboard.guide.main.filters.description':
    'Используйте фильтры, чтобы вся статистика и все графики на этой странице обновились для другого диапазона дат, счёта, сетапа, тега или типа сделки. Можно также исключить любое значение, чтобы убрать эти сделки.',
  'dashboard.guide.main.edit-layout.title':
    'Включите режим редактирования, чтобы настроить эту страницу',
  'dashboard.guide.main.edit-layout.description':
    'Нажмите «Редактировать макет», чтобы перемещать, изменять размер, удалять и добавлять виджеты панели.',
  'dashboard.guide.main.open-widget-selector.title':
    'Откройте «Добавить виджет»',
  'dashboard.guide.main.open-widget-selector.description':
    'Нажмите «Добавить виджет», чтобы добавить графики и вернуть ранее удалённые виджеты.',
  'dashboard.guide.main.widget-picker.title': 'Выберите, что показывать',
  'dashboard.guide.main.widget-picker.description':
    'Эта панель показывает превью каждого графика и метрики. Нажмите на элемент, чтобы добавить его; то, что уже есть на панели, отображается в разделе Используются.',
  'dashboard.guide.main.metrics.title':
    'Эти карточки сверху — ваша быстрая сводка',
  'dashboard.guide.main.metrics.description':
    'Верхний ряд даёт быстрые ответы: прибыль, винрейт и общее число сделок. В режиме редактирования можно выбрать, какие карточки показывать, и изменить их порядок.',
  'dashboard.guide.main.bottom.title':
    'Здесь виджеты перемещаются и меняют размер',
  'dashboard.guide.main.bottom.description':
    'Когда включено «Редактировать макет», перетащите виджет, чтобы переместить его. Чтобы изменить размер, потяните за правый нижний угол. Этот шаг многие пропускают.',
  'dashboard.guide.main.save-layout.title': 'Сохраните макет, когда закончите',
  'dashboard.guide.main.save-layout.description':
    'Закончив настройку, нажмите «Сохранить макет», чтобы сохранить изменения. Вернуться и отредактировать страницу можно в любой момент.',
  'home.guide.intro.title': 'Добро пожаловать домой',
  'home.guide.intro.description':
    'Это ваша главная страница. Здесь торговая статистика, быстрые действия и переходы в остальные разделы Journalit.',
  'home.guide.filters.title': 'Эти кнопки меняют то, что показывают виджеты',
  'home.guide.filters.description':
    'Фильтруйте по периоду, типу сделок или счёту. Выберите «Неделя» или задайте даты «С/По» включительно в «Произвольном диапазоне». Виджеты, зависящие от периода, следуют выбору; живые виджеты остаются живыми.',
  'home.guide.customize.title':
    'Включите режим редактирования, чтобы настроить главную',
  'home.guide.customize.description':
    'Нажмите эту кнопку, чтобы начать настройку. В режиме редактирования можно перемещать, изменять размер, удалять и добавлять виджеты.',
  'home.guide.quick-links-position.title':
    'Переместите быстрые ссылки над виджетами или под них',
  'home.guide.quick-links-position.description':
    'С помощью этой кнопки выберите, где будет ряд быстрых ссылок: над основной областью виджетов или под ней.',
  'home.guide.quick-links.title': 'Быстрые ссылки — ваши ярлыки',
  'home.guide.quick-links.description':
    'Быстрые ссылки открывают частые действия и страницы в один клик. В режиме редактирования можно скрыть ненужные ссылки.',
  'home.guide.move-and-resize.title': 'Перемещайте виджеты и меняйте их размер',
  'home.guide.widget-picker.title': 'Добавляйте виджеты здесь',
  'home.guide.widget-picker.description':
    'Просматривайте и добавляйте виджеты, восстанавливайте быстрые ссылки или добавляйте ярлыки счетов и сетапов. Всё, что уже есть на Главной, отображается в разделе «Используются», где это можно убрать.',
  'home.guide.move-and-resize.description':
    'Это основная область, которую можно перестраивать в режиме редактирования. Перетаскивайте виджеты, чтобы переместить их, или тяните за правый нижний угол, чтобы изменить размер.',
  'home.guide.add-widget.title': 'Добавьте элементы на главную',
  'home.guide.add-widget.description':
    'Откройте Добавить виджет, чтобы добавить виджеты, быстрые ссылки или ярлыки счетов и сетапов.',
  'home.guide.save-layout.title': 'Сохраните макет, когда закончите',
  'home.guide.save-layout.description':
    'Когда макет вас устроит, нажмите эту кнопку, чтобы сохранить изменения и выйти из режима редактирования.',
  'layoutBuilder.guide.intro.title': 'Это ваш конструктор макетов',
  'layoutBuilder.guide.intro.description':
    'Эта страница определяет структуру макетов обзоров. Проще всего начать с копии встроенного макета и затем настроить её.',
  'layoutBuilder.guide.create-own-layout.title': 'Создайте свой макет',
  'layoutBuilder.guide.create-own-layout.description':
    'Встроенные макеты доступны только для чтения. Нажмите значок копирования у встроенного макета DRC, чтобы продублировать его, или нажмите +, чтобы начать новый. Нажмите «Далее», чтобы продублировать стандартный DRC.',
  'layoutBuilder.guide.editor-overview.title': 'Здесь редактируется макет',
  'layoutBuilder.guide.editor-overview.description':
    'Здесь можно переименовать макет, просмотреть список виджетов, перетащить левый маркер, чтобы изменить их порядок, нажать на виджет, чтобы изменить его, и удалить всё ненужное.',
  'layoutBuilder.guide.add-widget.title': 'Добавьте виджет',
  'layoutBuilder.guide.add-widget.description':
    'Нажмите «Добавить виджет», чтобы добавить блок в конец макета, или наведите курсор между двумя виджетами и нажмите +, чтобы вставить его точно в нужное место.',
  'layoutBuilder.guide.choose-widget.title': 'Выберите виджет',
  'layoutBuilder.guide.choose-widget.description':
    'Введите в строке поиска название, описание или категорию, затем выберите виджет. Можно также нажать «Далее», и Journalit выберет первый результат.',
  'layoutBuilder.guide.save-template.title': 'Сохраните макет',
  'layoutBuilder.guide.save-template.description':
    'Когда копия будет готова, сохраните её. Позже её можно дорабатывать по мере улучшения процесса анализа.',
  'layoutBuilder.guide.set-default-template.title':
    'Сделайте его макетом по умолчанию',
  'layoutBuilder.guide.set-default-template.description':
    'Нажмите на звёздочку у нового макета, если хотите, чтобы новые заметки обзора автоматически использовали его.',
  'layoutBuilder.guide.whats-new.insert-slot.title':
    'Добавляйте виджет куда угодно',
  'layoutBuilder.guide.whats-new.insert-slot.description':
    'Наведите курсор между двумя виджетами и нажмите +, чтобы добавить виджет именно туда, а не в конец.',
  'layoutBuilder.guide.whats-new.add-widget-button.title':
    'Или добавьте в конец',
  'layoutBuilder.guide.whats-new.add-widget-button.description':
    '«Добавить виджет» по-прежнему добавляет в конец макета, а теперь ещё прокручивает к новому виджету и открывает его поиск.',
  'tradelog.empty': 'Сделки не найдены',
  'tradelog.filter.winners': 'Прибыльные',
  'tradelog.filter.losers': 'Убыточные',
  'tradelog.filter.breakeven': 'Безубыточные',
  'tradelog.filter.open': 'Открытые',
  'tradelog.type.regular': 'Обычные',
  'tradelog.type.missed': 'Пропущенные',
  'tradelog.type.backtest': 'Бэктесты',

  
  'tradelog.settings.modal.unsaved-changes.body1':
    'У вас есть несохранённые изменения в настройках колонок.',
  'tradelog.settings.modal.unsaved-changes.body2':
    'Вы уверены, что хотите закрыть без сохранения?',

  
  'tradelog.root.all-trades': 'Все сделки',
  'tradelog.view.selector.label': 'Вид',

  'trade-form.guide.customization-page.title':
    'Настройте форму под свой процесс',
  'trade-form.guide.customization-page.description':
    'Здесь можно показывать, скрывать и менять порядок дополнительных блоков. Оставьте в форме только поля, которыми вы действительно пользуетесь.',
  'trade-form.guide.finish.title': 'Это функция настройки',
  'trade-form.guide.finish.description':
    'Вы можете вернуться к этой кнопке в любой момент, когда форме сделки нужно соответствовать другому процессу ведения журнала.',
  'tradelog.guide.empty.intro.title': 'Добро пожаловать в журнал сделок',
  'tradelog.guide.empty.intro.description':
    'Эта страница станет главным местом для просмотра, сортировки и анализа сделок. Когда вы добавите сделки, откроется полный обзор журнала сделок.',
  'tradelog.guide.empty.state.title': 'Нет данных торговли',
  'tradelog.guide.empty.state.description':
    'Импортируйте прошлые сделки, чтобы сразу изучить результаты, или добавьте новую сделку вручную.',
  'tradelog.guide.intro.title': 'Это ваш журнал сделок',
  'tradelog.guide.intro.description':
    'На этой странице можно анализировать сделки по одной, сортировать и фильтровать их, а также изменять сразу много сделок.',
  'tradelog.guide.view-selector.title': 'Выберите, как анализировать историю',
  'tradelog.guide.view-selector.description':
    'Это меню переключает полную таблицу сделок и сгруппированные представления по месяцам, неделям или дням. По умолчанию открыты «Сделки», но группировка удобна для анализа по периодам.',
  'tradelog.guide.filters.title': 'Сужайте журнал сделок с помощью фильтров',
  'tradelog.guide.filters.description':
    'Откройте фильтры, если хотите просмотреть только определённые счета, сетапы, теги, типы сделок, статусы или даты. Можно также исключить любое значение, чтобы убрать эти сделки.',
  'tradelog.guide.sorting.title':
    'Нажимайте на заголовки столбцов для сортировки',
  'tradelog.guide.sorting.description':
    'В представлении «Сделки» нажмите на заголовок сортируемого столбца, чтобы упорядочить таблицу. Например, нажмите «Чистый P&L», чтобы отсортировать по самой крупной прибыли и самому крупному убытку.',
  'tradelog.guide.gallery-mode.title': 'Есть и галерея изображений',
  'tradelog.guide.gallery-mode.description':
    'Переключите режим здесь, чтобы просматривать скриншоты сделок как галерею. При первом открытии короткий гид всё покажет.',
  'tradelog.guide.open-trades.title':
    'Нажмите на сделку, чтобы открыть её заметку',
  'tradelog.guide.open-trades.description':
    'В обычном режиме нажатие на сделку открывает её. В режиме множественного выбора нажатие выделяет её. Переключайтесь между ними в зависимости от задачи.',
  'tradelog.processing': 'Обработка данных о сделках...',

  
  'tradelog.node.file-not-found': 'Файл сделки не найден: {path}',
  'tradelog.node.expand': 'Развернуть',
  'tradelog.node.collapse': 'Свернуть',
  'tradelog.node.navigate-to-review': 'Перейти к обзору {type}',
  'tradelog.node.performance.year': '{indicator} результативный год',
  'tradelog.node.performance.quarter':
    '{indicator} результативный квартал {year}',
  'tradelog.node.performance.month':
    '{indicator} результативный месяц {quarter} {year}',
  'tradelog.node.performance.week':
    '{indicator} результативная неделя {month} {year}',
  'tradelog.node.performance.day':
    '{indicator} результативный день {week} {year}',
  'tradelog.node.performance.period': '{indicator} результативный период',

  
  'tradelog.filter.closed': 'Закрытые',

  
  'tradelog.status.win': 'ПРИБЫЛЬ',
  'tradelog.status.loss': 'УБЫТОК',
  'tradelog.status.open': 'ОТКРЫТА',
  'tradelog.status.cancelled': 'ОТМЕНЕНА',
  'tradelog.status.breakeven': 'БЕЗУБЫТОК',
  'tradelog.status.missed': 'УПУЩЕНА',
  'tradelog.status.backtest': 'БЭКТЕСТ',
  'tradelog.status.expired': 'ИСТЕКЛА',

  
  'tradelog.no-columns': 'Колонки не настроены',
  'tradelog.duration.ongoing': '(в процессе)',

  
  'tradelog.tooltip.mistakes': 'Ошибки:',
  'tradelog.tooltip.setups': 'Сетапы:',
  'tradelog.tooltip.tags': 'Теги:',
  'tradelog.tooltip.thesis': 'Тезис:',
  'tradelog.tooltip.mtComment': 'Комментарий MT:',
  'tradelog.tooltip.accounts': 'Счета:',
  'tradelog.copy-trade.tooltip':
    'Скопировано из {account} с множителем {multiplier}x',
  'tradelog.tooltip.partial-exits': 'Частичные закрытия:',
  'tradelog.copy-trade.base-tooltip-title': 'Результаты копирующего счёта',
  'tradelog.copy-trade.adjustment-action': 'Скорректировать скопированный P&L',
  'tradelog.copy-trade.adjustment-title': 'Корректировка скопированного P&L',
  'tradelog.copy-trade.adjustment-description-primary':
    'Введите ручную корректировку P&L для этой скопированной сделки.',
  'tradelog.copy-trade.adjustment-description-secondary':
    'Используйте отрицательное число для худшего исполнения или затрат.',
  'tradelog.copy-trade.adjustment-preview': 'Предпросмотр чистого P&L:',

  'tradelog.copy-trade.adjustment-invalid':
    'Введите корректную корректировку P&L.',
  'tradelog.copy-trade.adjustment-saved':
    'Корректировка P&L скопированной сделки сохранена.',
  'tradelog.tooltip.still-open': 'ещё открыта',

  
  'tradelog.alt.trade-image': 'Изображение {instrument}',
  'tradelog.alt.trade-image-n': 'Изображение {instrument} {n}',

  
  'tradelog.batch.delete-confirm.title': 'Подтверждение удаления',
  'tradelog.batch.delete-confirm.warning': 'Это действие нельзя отменить.',
  'tradelog.batch.setups.title': 'Добавить сетапы к сделкам',
  'tradelog.batch.setups.placeholder': 'Выберите или создайте сетапы...',
  'tradelog.batch.tags.title': 'Добавить теги к сделкам',
  'tradelog.batch.tags.placeholder': 'Выберите или создайте теги...',
  'tradelog.batch.mistakes.title': 'Добавить ошибки к сделкам',
  'tradelog.batch.mistakes.placeholder': 'Выберите или создайте ошибки...',
  'tradelog.batch.none-selected': 'НИЧЕГО НЕ ВЫБРАНО',
  'tradelog.batch.selected-count': 'ВЫБРАНО: {count}',
  'tradelog.batch.select-all.title': 'Выбрать все видимые сделки',
  'tradelog.batch.select-all.label': 'Выбрать все',

  'tradelog.batch.already-reviewed':
    'Все {total} выбранных сделок уже проверены',
  'tradelog.batch.already-reviewed-single': 'Выбранная сделка уже проверена',
  'tradelog.batch.already-reviewed-plain': 'уже проверено',
  'tradelog.batch.no-updates-needed':
    'Обновление не требуется — все {total} сделок уже имеют эти {type}',
  'tradelog.batch.already-had-all': '{count} уже имели все {type}',
  'tradelog.batch.enable-multi-select': 'Включить множественный выбор',
  'tradelog.batch.disable-multi-select': 'Отключить множественный выбор',
  'tradelog.batch.column-settings': 'Настройки колонок',
  'tradelog.batch.marking-reviewed': 'Отмечаем...',
  'tradelog.batch.add-setups.aria': 'Добавить сетапы',

  'tradelog.batch.add-setups.label': 'Добавить сетапы',
  'tradelog.batch.add-tags.aria': 'Добавить теги',

  'tradelog.batch.add-tags.label': 'Добавить теги',
  'tradelog.batch.add-mistakes.aria': 'Добавить ошибки',

  'tradelog.batch.add-mistakes.label': 'Добавить ошибки',
  'tradelog.batch.adding': 'Добавление...',
  'tradelog.batch.add-count': 'Добавить ({count})',
  'tradelog.batch.duplicate.aria': 'Дублировать сделки',
  'tradelog.batch.duplicate.label': 'Дублировать',
  'tradelog.batch.duplicating': 'Дублирование...',
  'tradelog.batch.duplicate-skipped.one':
    '{count} выбранную заметку нельзя дублировать',
  'tradelog.batch.duplicate-skipped.few':
    '{count} выбранные заметки нельзя дублировать',
  'tradelog.batch.duplicate-skipped.many':
    '{count} выбранных заметок нельзя дублировать',
  'tradelog.batch.duplicate-skipped.other':
    '{count} выбранных заметок нельзя дублировать',
  'tradelog.batch.delete.aria': 'Удалить сделки',

  'tradelog.batch.deleting': 'Удаление...',
  'tradelog.batch.clear.aria': 'Снять выделение',

  'tradelog.batch.clear.label': 'Сбросить',

  
  'tradelog.settings.active-columns': 'Активные столбцы',
  'tradelog.settings.available-columns': 'Доступные столбцы',
  'tradelog.settings.active-desc':
    'Перетащите для изменения порядка. Нажмите X для удаления.',
  'tradelog.settings.available-desc':
    'Нажмите на столбец, чтобы добавить его в таблицу.',
  'tradelog.settings.no-active':
    'Нет активных столбцов. Добавьте столбцы из вкладки «Доступные».',
  'tradelog.settings.all-active': 'Все столбцы активны.',
  'tradelog.settings.expanded-view': 'Расширенный вид',
  'tradelog.settings.expanded-view-desc':
    'Показывать теги, сетапы и ошибки в виде меток',
  'tradelog.settings.expanded-view-aria': 'Переключить расширенный вид',
  'tradelog.settings.saving': 'Сохранение...',
  'tradelog.settings.reset': 'Сбросить настройки',

  
  'tradelog.category.basic': 'Основная информация',
  'tradelog.category.timing': 'Время',
  'tradelog.category.prices': 'Цены',
  'tradelog.category.risk': 'Риск-менеджмент',
  'tradelog.category.position': 'Позиция и P/L',
  'tradelog.category.review': 'Разбор',

  
  'tradelog.column.image': 'Изображение',
  'tradelog.column.account': 'Счёт',
  'tradelog.column.ticker': 'Тикер',
  'tradelog.column.exchange': 'Биржа',
  'tradelog.column.status': 'Статус',
  'tradelog.column.direction': 'Направление',
  'tradelog.column.date': 'Дата открытия',
  'tradelog.column.entryTime': 'Время входа',
  'tradelog.column.exitDate': 'Дата закрытия',
  'tradelog.column.exitTime': 'Время выхода',
  'tradelog.column.duration': 'Длительность',
  'tradelog.column.expirationDate': 'Экспирация',
  'tradelog.column.daysToExpiry': 'ДДЭ',
  'tradelog.column.entryPrice': 'Вход',
  'tradelog.column.exitPrice': 'Выход',
  'tradelog.column.priceMove': 'Движение цены',
  'tradelog.column.stopLoss': 'Стоп-лосс',
  'tradelog.column.slDistanceDollar': 'Расст. до SL $',
  'tradelog.column.slDistancePercent': 'Расст. до SL %',
  'tradelog.column.riskAmount': 'Риск $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'Макс. R',
  'tradelog.column.maePrice': 'Цена MAE',
  'tradelog.column.mfePrice': 'Цена MFE',
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': 'Размер #',
  'tradelog.column.positionValue': 'Размер $',
  'tradelog.column.fees': 'Комиссии',
  'tradelog.column.dividends': 'Дивиденды',
  'tradelog.column.pnl': 'Чистый P&L',
  'tradelog.column.returnPercent': 'Доходность %',
  'tradelog.column.setups': 'Сетапы',
  'tradelog.column.mistakes': 'Ошибки',
  'tradelog.column.tags': 'Теги',
  'tradelog.column.reviewed': 'Проверено',
  'tradelog.column.tradeRating': 'Оценка',
  'tradelog.column.thesis': 'Тезис',
  'tradelog.column.mtComment': 'Комментарий MT',

  
  
  
  'dashboard.title': 'Панель',
  'dashboard.no-data': 'Нет доступных торговых данных',
  'dashboard.empty.message': 'Нет данных торговли',
  'dashboard.empty.submessage':
    'Импортируйте прошлые сделки, чтобы сразу изучить результаты, или добавьте новую сделку вручную.',
  'dashboard.empty.import-action': 'Импортировать существующие сделки',
  'dashboard.empty.manual-action': 'Добавить сделку вручную',
  'dashboard.empty.filter-hint': 'Попробуйте настроить параметры фильтра',
  'dashboard.error.load-failed': 'Ошибка загрузки данных',
  'dashboard.button.add-widget': 'Добавить виджет',
  'dashboard.button.save-layout': 'Сохранить макет',
  'dashboard.button.edit-layout': 'Редактировать макет',
  'dashboard.metrics.netPnL': 'Чистый P&L',
  'dashboard.metrics.incl-unrealized': 'вкл. {value} нереализ.',
  'dashboard.metrics.winRate': 'Винрейт',
  'dashboard.metrics.profitFactor': 'Коэффициент прибыли',
  'dashboard.metrics.sharpeRatio': 'Коэффициент Шарпа',
  'dashboard.metrics.expectancy': 'Матожидание',
  'dashboard.metrics.numTrades': 'Всего сделок',

  'dashboard.metrics.numWinTrades': 'Прибыльные сделки',
  'dashboard.metrics.numLossTrades': 'Убыточные сделки',
  'dashboard.metrics.avgWin': 'Средняя прибыль',
  'dashboard.metrics.avgLoss': 'Средний убыток',
  'dashboard.metrics.totalCommission': 'Общая комиссия',
  'dashboard.metrics.totalFees': 'Общие сборы',
  'dashboard.metrics.maxDrawdown': 'Максимальная просадка',
  'dashboard.metrics.bestDay': 'Лучший день',
  'dashboard.metrics.largestWin': 'Наибольшая прибыль',
  'dashboard.metrics.largestLoss': 'Наибольший убыток',
  'dashboard.metrics.longestWinStreak': 'Лучшая серия',
  'dashboard.metrics.longestLossStreak': 'Худшая серия',
  'dashboard.metrics.avgHoldTime': 'Среднее время удержания',
  'dashboard.metrics.avgWinHoldTime': 'Среднее время удержания прибыли',
  'dashboard.metrics.avgLossHoldTime': 'Среднее время удержания убытка',
  'dashboard.metrics.avgWinnerHeat': 'Ср. MAE прибыльных',
  'dashboard.metrics.winnerMaeP90': 'MAE P90 прибыльных',
  'dashboard.metrics.winnerMaeMedian': 'Медиана MAE прибыльных',
  'dashboard.metrics.avgLossHeat': 'Ср. MAE убыточных',
  'dashboard.metrics.winnerAvgMfe': 'Ср. MFE прибыльных',
  'dashboard.metrics.loserAvgMfe': 'Ср. MFE убыточных',
  'dashboard.metrics.winnerMfeP90': 'MFE P90 прибыльных',
  'dashboard.metrics.loserMfeP90': 'MFE P90 убыточных',
  'dashboard.metrics.avgRR': 'Средний RR (Payoff)',
  'dashboard.metrics.avgRRRiskBased': 'Средний RR (на основе R)',
  'dashboard.avgRR.tooltip.formula':
    'Формула: средняя прибыль / средний убыток',
  'dashboard.avgRR.tooltip.no-conversion':
    'Этот payoff-коэффициент рассчитан по смешанным валютам без FX-конвертации и может вводить в заблуждение.',
  'dashboard.sharpeRatio.tooltip.title': 'Коэффициент Шарпа',
  'dashboard.sharpeRatio.tooltip.formula':
    'Формула: средняя чистая P&L закрытых сделок / выборочное стандартное отклонение чистой P&L закрытых сделок. Безрисковая ставка равна 0, значение не годовое.',
  'dashboard.sharpeRatio.tooltip.coverage':
    'Рассчитано по {valid} из {total} закрытых сделок',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'Частичное покрытие: {valid} из {total} закрытых сделок имеют конечную чистую P&L.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'Требуются как минимум две закрытые сделки с ненулевой вариативностью P&L.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'Этот коэффициент Шарпа основан на смешанных валютах без FX-конвертации и может вводить в заблуждение.',
  'dashboard.avgRRRiskBased.tooltip.title': 'Средний RR (на основе R)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'Формула: средний выигрыш в R / средний убыток в R',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    'Рассчитано по {valid} из {total} закрытых сделок с данными риска',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'Сделки с валидным риском — прибыльные: {wins}, убыточные: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'Частичное покрытие риска: только {valid} из {total} закрытых сделок имеют валидные данные риска.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'Недостаточно данных для расчёта RR на основе R. Добавьте данные stop-loss/риска и убедитесь, что есть валидные прибыльные и убыточные сделки.',
  'dashboard.conversion.title': 'Конвертировано в {currency}',
  'dashboard.conversion.converted-total': 'Конвертированный итог',
  'dashboard.conversion.base': 'Базовая: {currency}',

  'dashboard.conversion.using-ecb': 'Используются курсы ECB ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Используется P&L в базовой валюте от брокера для {count} {tradeLabel}',
  'dashboard.conversion.using-manual-rate':
    'Используется ручной курс обмена для {count} {tradeLabel}',
  'dashboard.conversion.partial-warning':
    '⚠ Издержки/риск в {currencies} не удалось конвертировать, они исключены',
  'dashboard.conversion.trade-singular': 'сделки',
  'dashboard.conversion.trade-plural': 'сделок',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} из {total} сделок ({excluded} исключено: {currencies})',
  'dashboard.top-section.remove-metric': 'Удалить метрику',
  'dashboard.top-section.failed-load': 'Ошибка загрузки метрик',
  'dashboard.filter.date.today': 'Сегодня',
  'dashboard.filter.date.yesterday': 'Вчера',
  'dashboard.filter.date.this-week': 'На этой неделе',
  'dashboard.filter.date.this-month': 'В этом месяце',
  'dashboard.filter.date.this-quarter': 'В этом квартале',
  'dashboard.filter.date.this-year': 'В этом году',
  'dashboard.filter.date.all-time': 'За все время',
  'dashboard.filter.date.custom': 'Произвольный',
  'dashboard.filter.date.from': 'От',
  'dashboard.filter.date.to': 'До',

  'dashboard.filter.accounts.none-found': 'Счета не найдены',
  'dashboard.filter.accounts.phase-now': 'сейчас',
  'dashboard.conversion.original-pnl': 'Исходный P&L',
  'dashboard.conversion.converted-pnl': 'Конвертированный P&L',
  'dashboard.conversion.details-label': 'Сведения о конвертации валют',

  

  'dashboard.filter.tickers.none-found': 'Инструменты не найдены',

  'dashboard.widgets.daily-performance.title': 'Дневная производительность',
  'dashboard.widgets.daily-performance.period-aria': 'Период',
  'dashboard.widgets.daily-performance.period-days': '{count} дней',
  'dashboard.widgets.weekday-performance.title':
    'Производительность по дням недели',
  'dashboard.widgets.weekday-performance.metric-aria': 'Метрика',
  'dashboard.widgets.weekday-performance.metric.net': 'Нетто',
  'dashboard.widgets.weekday-performance.metric.win-rate': 'Винрейт',
  'dashboard.widgets.weekday-performance.metric.trades': 'Сделки',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    'Винрейт: {rate} ({wins}П / {losses}У)',
  'dashboard.widgets.weekday-performance.tooltip.trades': 'Сделки: {count}',
  'dashboard.widgets.hourly-performance.title': 'Производительность по часам',
  'dashboard.widgets.hourly-performance.tooltip.trades': 'Сделки: {count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label':
    'Процент побед',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    'Процент побед: {rate} ({wins}П / {losses}У)',
  'dashboard.widgets.hourly-performance.bucket-aria': 'Размер интервала',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes} мин',
  'dashboard.widgets.hourly-performance.metric-aria': 'Метрика',
  'dashboard.widgets.hourly-performance.metric.total': 'Итого',
  'dashboard.widgets.hourly-performance.metric.average': 'Среднее',

  'dashboard.widgets.hourly-performance.metric.total-r': 'Общий R',

  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'Нет сделок',
  'dashboard.widgets.setup-performance.title': 'Результативность сетапов',
  'dashboard.widgets.setup-performance.description':
    'Рейтинг эффективности по сетапам',
  'dashboard.widgets.setup-performance.empty':
    'Нет данных по результативности сетапов',
  'dashboard.widgets.setup-performance.masked-label': 'Сетап',
  'dashboard.widgets.tag-performance.title': 'Результативность тегов',
  'dashboard.widgets.tag-performance.description':
    'Рейтинг эффективности по тегам',
  'dashboard.widgets.tag-performance.empty':
    'Нет данных по результативности тегов',
  'dashboard.widgets.tag-performance.masked-label': 'Тег',
  'dashboard.widgets.rating-performance.title': 'Результаты по оценке',
  'dashboard.widgets.rating-performance.description':
    'Чистый P&L или доля прибыльных сделок для каждой оценки в звёздах',
  'dashboard.widgets.rating-performance.empty':
    'Пока нет оценённых сделок. Оценивайте сделки в заметке сделки, чтобы сравнить их здесь.',
  'dashboard.widgets.rating-performance.masked-label': 'Оценка',
  'dashboard.widgets.ticker-performance.title': 'Производительность по тикерам',
  'dashboard.widgets.ticker-performance.metric-aria': 'Метрика',
  'dashboard.widgets.ticker-performance.view-aria': 'Режим просмотра',
  'dashboard.widgets.ticker-performance.view.best-and-worst': 'Лучшие и худшие',
  'dashboard.widgets.ticker-performance.view.best': 'Лучшие 10',
  'dashboard.widgets.ticker-performance.view.worst': 'Худшие 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'Общий P&L',
  'dashboard.widgets.ticker-performance.metric.total-r': 'Общий R',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'Винрейт',
  'dashboard.widgets.ticker-performance.tooltip.trades': 'Сделки: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Винрейт: {rate} ({wins}П / {losses}У)',

  'dashboard.widgets.ticker-performance.empty':
    'Нет данных о производительности тикеров',
  'dashboard.widgets.ticker-performance.masked-ticker': 'Тикер',
  'dashboard.widgets.ticker-performance.omitted-count': 'Скрыто: {count}',

  'dashboard.widgets.rollingStats.title': 'Скользящее среднее прибыль/убыток',
  'dashboard.widgets.rollingStats.period': 'Период',
  'dashboard.widgets.rollingStats.trades': '{count} сделок',
  'dashboard.widgets.rollingStats.avgWin': 'Средняя прибыль',
  'dashboard.widgets.rollingStats.avgLoss': 'Средний убыток',
  'dashboard.widgets.rollingStats.tooltip.trade': 'Сделка {label}',
  'dashboard.rolling_win_loss.title': 'Скользящее соотношение прибыль/убыток',
  'dashboard.rolling_win_loss.period_aria': 'Период',
  'dashboard.rolling_win_loss.trades_count': '{count} сделок',
  'dashboard.rolling_win_loss.trade_label': 'Сделка {label}',
  'dashboard.rolling_win_loss.ratio_label': 'Соотношение: {ratio}',
  'dashboard.rolling_win_loss.ratio_undefined':
    'Соотношение: нет убытков за период',
  'dashboard.rolling_win_loss.avg_win_label': 'Средняя прибыль: {value}',
  'dashboard.rolling_win_loss.no_losses_band': 'Без убытков',
  'dashboard.rolling_win_loss.window_not_filled':
    'Требуется минимум {count} закрытых сделок',
  'dashboard.rolling_win_loss.avg_loss_label': 'Средний убыток: {value}',
  'dashboard.selector.title': 'Добавить на панель',
  'dashboard.selector.subtitle':
    'Просматривайте графики и метрики по превью и нажмите на нужный, чтобы добавить его на панель.',
  'dashboard.selector.tab.performance': 'Результаты',
  'dashboard.selector.tab.breakdowns': 'Разбивки',
  'dashboard.selector.tab.risk': 'Риск и анализ',
  'widget-drawer.tab.all': 'Все',
  'widget-drawer.search.placeholder': 'Поиск виджетов',
  'widget-drawer.section.available': 'Доступные',
  'widget-drawer.section.in-use': 'Используются',
  'widget-drawer.empty-search': 'Нет виджетов, соответствующих запросу',
  'widget-drawer.added-count': 'Добавлено: {count}',
  'widget-drawer.add-aria': 'Добавить {name}',
  'widget-drawer.remove': 'Удалить',
  'widget-drawer.remove-aria': 'Удалить {name}',
  'dashboard.selector.metrics': 'Метрики',

  
  
  

  'view.dashboard': 'Панель',
  'view.trade-log': 'Журнал сделок',
  'view.account-dashboard': 'Счета',
  'view.layout-builder': 'Конструктор макетов',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': 'Экономический календарь',
  'view.economic-calendar.this-week': 'Эта неделя',
  'view.economic-calendar.sync.aria':
    'Открыть настройки экономического календаря',
  'view.economic-calendar.import-count.one': 'Импортировать {count} событие',
  'view.economic-calendar.import-count.few': 'Импортировать {count} события',
  'view.economic-calendar.import-count.many': 'Импортировать {count} событий',
  'view.economic-calendar.import-count.other': 'Импортировать {count} событий',
  'view.economic-calendar.imported': 'Импортировано',
  'view.economic-calendar.update-available': 'Доступно обновление',
  'view.economic-calendar.filter.currency': 'Валюта',
  'view.economic-calendar.filter.impact': 'Влияние',
  'view.economic-calendar.impact.high': 'Высокое',
  'view.economic-calendar.impact.medium': 'Среднее',
  'view.economic-calendar.impact.low': 'Низкое',
  'view.economic-calendar.impact.none': 'Нет',
  'view.economic-calendar.pro-required':
    'Экономический календарь требует Journalit Pro',
  'view.economic-calendar.error.offline':
    'Не удалось загрузить экономический календарь в автономном режиме.',
  'view.economic-calendar.error.generic':
    'Не удалось загрузить экономический календарь.',
  'view.economic-calendar.empty': 'Нет экономических событий на эту неделю.',
  'view.economic-calendar.refresh': 'Обновить события',
  'view.economic-calendar.retry': 'Повторить',
  'view.economic-calendar.select-all': 'Выбрать все',
  'view.economic-calendar.select-aria': 'Выбрать {event}',
  'view.economic-calendar.impact-aria': 'Влияние: {impact}',
  'view.economic-calendar.all-day': 'Весь день',
  'view.economic-calendar.holiday-aria': 'Праздник',
  'view.economic-calendar.forecast': 'Прогноз',
  'view.economic-calendar.previous': 'Предыдущее',
  'view.economic-calendar.actual': 'Факт',
  'view.economic-calendar.import-success':
    '{imported} импортировано, {updated} обновлено',
  'view.economic-calendar.import-failed': 'Не удалось импортировать события.',
  'view.economic-calendar.restore-missing-events':
    'Восстановить недостающие события ({count})',
  'economicCalendar.guide.main.intro.description':
    'Здесь показана вся неделя. Journalit также может автоматически поддерживать ваш недельный обзор в актуальном состоянии, поэтому ручной импорт необязателен.',
  'economicCalendar.guide.main.filters.title':
    'Эти фильтры меняют только этот календарь',
  'economicCalendar.guide.main.filters.description':
    'Фильтры валюты и влияния ограничивают только события, которые вы видите и выбираете здесь. Они не меняют правила автоматического импорта.',
  'economicCalendar.guide.main.settings.title':
    'Настройте автоимпорт в настройках',
  'economicCalendar.guide.main.settings.description':
    'Используйте эту кнопку, чтобы выбрать валюты, уровни влияния и праздники, затем включите автоимпорт. Journalit синхронизирует текущую неделю с недельным обзором и обновляет импортированные показатели, не возвращая события, которые вы удалили намеренно.',
  'economicCalendar.guide.main.manual-import.title':
    'Ручной импорт необязателен',
  'economicCalendar.guide.main.manual-import.description':
    'Выберите видимые строки и нажмите «Импортировать события» для разового импорта. При включённом автоимпорте это не нужно делать каждую неделю.',
  'economicCalendar.guide.main.restore.title':
    'Восстановите недостающие настроенные события',
  'economicCalendar.guide.main.restore.description':
    'Эта кнопка становится доступной, когда отсутствуют события из сохранённой области автоимпорта. Когда неделя снова заполнена, она остаётся видимой, но неактивной.',
  'economicCalendar.guide.main.summary.title':
    'Настройте один раз и проверяйте',
  'economicCalendar.guide.main.summary.description':
    'После настройки автоимпорта недельный обзор будет заполняться автоматически. Возвращайтесь сюда для просмотра, разового импорта или восстановления недостающих событий.',
  'view.economic-calendar.pro-benefit':
    'Важные события в вашей недельной заметке.',
  'view.economic-calendar.pro-benefit-trial':
    'Начните с 14-дневного бесплатного пробного периода.',
  'view.economic-calendar.sign-in': 'Уже есть Pro? Войти',
  'settings.economic-calendar.title': 'Экономический календарь',
  'settings.economic-calendar.description':
    'Автоматически добавляет экономические события этой недели в ключевые события недельной заметки.',
  'settings.economic-calendar.auto-import': 'Автоимпорт событий недели',
  'settings.economic-calendar.auto-import-desc':
    'Поддерживает текущую недельную заметку в актуальном состоянии.',
  'settings.economic-calendar.currencies': 'Валюты',
  'settings.economic-calendar.currencies-desc':
    'Импортировать события по этим валютам. Без выбора учитываются все.',
  'settings.economic-calendar.impacts': 'Уровни значимости',
  'settings.economic-calendar.impacts-desc':
    'Импортировать события с этими уровнями значимости.',
  'settings.economic-calendar.impacts-empty':
    'Публикации не выбраны. Праздники по-прежнему можно импортировать, если они включены.',
  'settings.economic-calendar.include-holidays': 'Включать праздники',
  'settings.economic-calendar.include-holidays-desc':
    'Импортировать банковские праздники и протоколы центробанков как события на весь день.',
  'settings.economic-calendar.open-view': 'Открыть экономический календарь',
  'settings.economic-calendar.open-view-desc':
    'Просмотрите неделю и импортируйте события вручную.',
  'settings.economic-calendar.pro-required':
    'Экономический календарь доступен по подписке PRO.',

  
  
  
  'account.edit.modal.change-date.message':
    'Вы собираетесь изменить дату создания счёта "{account}" с {oldDate} на {newDate}.',
  'account.edit.modal.change-date.warning':
    'Это обновит дату транзакции начального депозита и может повлиять на расчет возраста счета, ежемесячные циклы выставления счетов и другие метрики, основанные на датах.',

  'account.edit.modal.change-balance.message':
    'Вы собираетесь изменить начальный баланс с {oldBalance} на {newBalance}.',

  'account.edit.modal.change-balance.info':
    'Это изменение повлияет на все расчеты баланса, проценты P&L, расчеты просадки и полную историю транзакций.',
  'account.edit.modal.delete.question':
    'Вы уверены, что хотите навсегда удалить счёт "{name}"?',

  
  
  
  'common.loading': 'Загрузка...',
  'common.error': 'Ошибка',
  'common.section-error': 'В этом разделе произошла ошибка.',
  'common.retry': 'Повторить',

  'common.warning': 'Предупреждение',
  'common.info': 'Информация',
  'common.yes': 'Да',
  'common.no': 'Нет',

  'common.none': 'Нет',
  'common.all': 'Все',

  'common.week': 'Неделя',
  'common.month': 'Месяц',
  'common.year': 'Год',

  'common.trade': 'Сделка',
  'common.trades': 'Сделки',

  
  
  

  
  'settings.tab.general': 'Общие',
  'settings.tab.reviews': 'Обзоры',

  'settings.tab.customization': 'Настройка',
  'settings.tab.journal-setup': 'Журнал',
  'settings.tab.trading': 'Параметры сделок по умолчанию',
  'settings.tab.sync': 'Аккаунт и синхронизация',
  'settings.page.reviews.title': 'Макеты обзоров, цели и чек-листы',
  'settings.page.reviews.desc':
    'Открывает все настройки обзоров: макеты, повторяющиеся цели и чек-листы.',
  'settings.page.customization.desc':
    'Открывает пользовательские поля, макет формы, символы, сопоставления, сетапы, ошибки, теги и события.',
  'settings.page.trade-sync.desc':
    'Открывает провайдеров синхронизации брокеров, учётные данные FTP, управление счетами, диагностику и настройки уведомлений о синхронизации.',
  'settings.page.general.desc':
    'Валюта, отображаемое имя, стартовый экран, недавние элементы и настройки навигации.',
  'settings.page.sync.desc':
    'Аккаунт Journalit, подписка, синхронизация сделок, Trade Import и экономический календарь.',
  'settings.page.trading.desc':
    'Значения по умолчанию для новых сделок, обработка дат, риск, логика безубыточности и настройки отображения аналитики.',
  'settings.page.journal.desc':
    'Шаблоны обзоров, автоматизация, пользовательские поля, макет формы, символы, сетапы, ошибки, теги и события.',
  'settings.page.advanced.desc':
    'Папка журнала, обслуживание путей к изображениям, резервная копия настроек, импорт, экспорт и сброс.',
  'settings.page.mcp-access.desc':
    'Разрешите ИИ-приложениям, подключённым через MCP, работать с этим хранилищем, выберите, что требует вашего одобрения, и просматривайте действия агентов.',

  
  'settings.ftp.title': 'Учётные данные FTP',
  'settings.ftp.title-metatrader': 'Учётные данные FTP для MetaTrader',
  'settings.ftp.loading': 'Загрузка учётных данных FTP...',
  'settings.ftp.info-message':
    'Используйте эти данные для настройки публикации FTP в MetaTrader:',
  'settings.ftp.label.server': 'FTP-сервер:',
  'settings.ftp.label.login': 'FTP-логин:',
  'settings.ftp.label.password': 'FTP-пароль:',
  'settings.ftp.aria.copy-server': 'Скопировать FTP-сервер',
  'settings.ftp.aria.copy-login': 'Скопировать FTP-логин',
  'settings.ftp.aria.copy-password': 'Скопировать пароль',
  'settings.ftp.aria.password-unavailable': 'Пароль недоступен для копирования',
  'settings.ftp.aria.password-hidden': 'Пароль скрыт',
  'settings.ftp.aria.hide-password': 'Скрыть пароль',
  'settings.ftp.aria.show-password': 'Показать пароль',
  'settings.ftp.notice.password-masked':
    'Пароль сохранён, но недоступен для просмотра/копирования. Сбросьте пароль для получения нового.',
  'settings.ftp.notice.password-save':
    'Сохраните этот пароль в надёжном месте. Его нельзя будет восстановить позже.',
  'settings.ftp.button.reset': 'Сбросить FTP-пароль',
  'settings.ftp.button.resetting': 'Сброс пароля...',
  'settings.ftp.reset-hint':
    'Нажмите эту кнопку для генерации нового FTP-пароля.',
  'settings.ftp.instructions.title': 'Инструкция по настройке MetaTrader 4:',
  'settings.ftp.instructions.step1': 'Откройте MetaTrader 4 (MT4)',
  'settings.ftp.instructions.step2': 'Нажмите на меню "Сервис" в верхней части',
  'settings.ftp.instructions.step3': 'Выберите "Настройки"',
  'settings.ftp.instructions.step4':
    'Перейдите на вкладку "FTP" и введите Сервер, Логин и Пароль FTP, указанные выше',
  'settings.ftp.instructions.step5': 'Включите "Пассивный режим"',
  'settings.ftp.instructions.step6':
    'Включите автоматическую публикацию отчётов через FTP и установите интервал обновления 60 минут',
  'settings.ftp.no-credentials':
    'Учётные данные FTP не найдены. Нажмите "Создать учётные данные FTP" в разделе выше.',
  'settings.ftp.error.reset-failed': 'Не удалось сбросить пароль',

  

  'settings.auth.status-offline': 'Офлайн',
  'settings.auth.status-online': 'Онлайн',

  'settings.auth.sign-in-up': 'Вход / Регистрация',
  'settings.auth.sign-out': 'Выйти',

  
  'settings.auth.guest': 'Гость',

  'settings.auth.your-plan': 'Ваш план',

  'settings.auth.manage-subscription': 'Управление подпиской',

  
  'settings.reviews.drc': 'Дневной анализ',
  'settings.reviews.weekly': 'Недельный обзор',
  'settings.reviews.monthly': 'Месячный обзор',
  'settings.reviews.quarterly': 'Квартальный обзор',
  'settings.reviews.yearly': 'Годовой обзор',

  'settings.reviews.template-builder': 'Конструктор макетов',
  'settings.reviews.template-builder-desc':
    'Создавайте, редактируйте и управляйте макетами визуально. Конструктор позволяет перетаскивать секции, настраивать параметры и просматривать макеты в реальном времени.',
  'settings.reviews.open-builder': 'Открыть конструктор макетов',
  'settings.general.review-links-new-tab':
    'Открывать ссылки из виджетов обзора в новых вкладках',
  'settings.general.review-links-new-tab-desc':
    'Если отключено, ссылки заменяют текущую вкладку.',
  'settings.general.review-links-new-tab-aria':
    'Открывать ссылки на заметки из виджетов обзора в новых вкладках',
  'settings.general.tab-behavior': 'Поведение вкладок',
  'settings.reviews.recurring-goals': 'Повторяющиеся цели',
  'settings.reviews.recurring-goals-desc':
    'Определите цели, которые автоматически появляются в каждом новом обзоре. Они копируются при создании обзора и могут редактироваться индивидуально.',
  'settings.reviews.daily-goals': 'Ежедневные цели',
  'settings.reviews.daily-goal-placeholder': 'Добавить ежедневную цель...',
  'settings.reviews.weekly-goals': 'Недельные цели',
  'settings.reviews.weekly-goal-placeholder': 'Добавить недельную цель...',
  'settings.reviews.checklist': 'Чек-лист DRC',
  'settings.reviews.checklist-desc':
    'Определите пункты чек-листа, которые автоматически появляются в каждом новом DRC. Они копируются при создании и могут редактироваться для каждого дня.',
  'settings.reviews.checklist-placeholder': 'Добавить пункт чек-листа...',
  'settings.reviews.weekly-checklist': 'Недельный чек-лист',
  'settings.reviews.weekly-checklist-desc':
    'Определите пункты чек-листа, которые автоматически появляются в каждом новом недельном обзоре. Они копируются при создании недельного обзора и могут редактироваться для каждой недели.',
  'settings.reviews.weekly-checklist-placeholder':
    'Добавить пункт недельного чек-листа...',
  'settings.reviews.auto-create': 'Автосоздание обзоров',
  'settings.reviews.global-auto-create': 'Глобальное автосоздание обзоров',
  'settings.reviews.global-auto-create-desc':
    'Автоматически создавать обзоры при записи первой сделки соответствующего периода. Эта настройка применяется к ежедневным, недельным, месячным, квартальным и годовым обзорам.',
  'settings.reviews.global-auto-create-aria': 'Глобальное автосоздание обзоров',
  'settings.reviews.auto-create-drc-nav':
    'Автосоздание дневного анализа при навигации',
  'settings.reviews.auto-create-drc-nav-desc':
    'Автоматически создавать новый DRC при переходе к дню без обзора',
  'settings.reviews.auto-create-drc-nav-aria':
    'Автосоздание дневного анализа при навигации',
  'settings.reviews.auto-create-weekly-nav':
    'Автосоздание недельного обзора при навигации',
  'settings.reviews.auto-create-weekly-nav-desc':
    'Автоматически создавать новый недельный обзор при переходе к неделе без обзора',
  'settings.reviews.auto-create-weekly-nav-aria':
    'Автосоздание недельного обзора при навигации',
  'settings.reviews.auto-create-monthly-nav':
    'Автосоздание месячного обзора при навигации',
  'settings.reviews.auto-create-monthly-nav-desc':
    'Автоматически создавать новый месячный обзор при переходе к месяцу без обзора',
  'settings.reviews.auto-create-monthly-nav-aria':
    'Автосоздание месячного обзора при навигации',
  'settings.reviews.auto-create-quarterly-nav':
    'Автосоздание квартального обзора при навигации',
  'settings.reviews.auto-create-quarterly-nav-desc':
    'Автоматически создавать новый квартальный обзор при переходе к кварталу без обзора',
  'settings.reviews.auto-create-quarterly-nav-aria':
    'Автосоздание квартального обзора при навигации',
  'settings.reviews.auto-create-yearly-nav':
    'Автосоздание годового обзора при навигации',
  'settings.reviews.auto-create-yearly-nav-desc':
    'Автоматически создавать новый годовой обзор при переходе к году без обзора',
  'settings.reviews.auto-create-yearly-nav-aria':
    'Автосоздание годового обзора при навигации',

  'settings.reviews.notice.builder-not-found':
    'Команда конструктора макетов не найдена',
  'settings.reviews.notice.global-auto-create':
    'Автосоздание для всех обзоров {status}',
  'settings.reviews.notice.auto-create-nav':
    'Автосоздание {type} при навигации {status}',

  

  
  'settings.account-linking.title': 'Изменить привязку счёта',
  'settings.account-linking.description':
    'Перенести все сделки с одного MT-счёта на другой счёт Obsidian',
  'settings.account-linking.source.title': 'Исходный MT-счёт',
  'settings.account-linking.source.description':
    'Выберите MT-счёт, сделки которого хотите перенести',
  'settings.account-linking.source.placeholder': 'Выберите исходный счёт...',
  'settings.account-linking.target.title': 'Целевой счёт Obsidian',
  'settings.account-linking.target.description':
    'Выберите счёт Obsidian для привязки сделок',
  'settings.account-linking.target.placeholder': 'Выберите целевой счёт...',
  'settings.account-linking.button.processing': 'Обработка...',
  'settings.account-linking.button.relink': 'Перепривязать счёт',
  'settings.account-linking.warning':
    'Это обновит все синхронизированные сделки с исходного счёта и привяжет их к целевому счёту. Эту операцию нельзя отменить.',
  'settings.account-linking.success.relinked':
    'Успешно перепривязано {count} сделок с {source} на {target}',
  'settings.account-linking.error.select-both':
    'Выберите исходный и целевой счета',
  'settings.account-linking.error.source-not-found': 'Исходный счёт не найден',
  'settings.account-linking.error.target-not-found': 'Целевой счёт не найден',
  'settings.account-linking.error.already-linked':
    'Этот MT-счёт уже привязан к выбранному счёту Obsidian',
  'settings.account-linking.error.service-manager':
    'Менеджер сервисов недоступен',
  'settings.account-linking.error.backend-service': 'Сервис бэкенда недоступен',
  'settings.account-linking.error.relink-failed':
    'Не удалось перепривязать счёт: {error}',

  
  'settings.general.title': 'Общие настройки',
  'settings.general.docs': 'Документация',
  'settings.general.discord': 'Discord',
  'settings.general.github': 'GitHub',

  'settings.general.currency': 'Валюта',
  'settings.general.currency-desc':
    'Выберите валюту для отображения всех денежных значений в плагине',
  'settings.general.currency-aria':
    'Выберите валюту для отображения денежных значений',
  'settings.general.currency-changed':
    'Валюта изменена на {currency}. Все компоненты обновятся немедленно!',
  'settings.general.currency-save-failed':
    'Не удалось сохранить настройку валюты. Попробуйте ещё раз.',
  'settings.general.path-change.title': 'Изменено расположение папки журнала',
  'settings.general.path-change.new-trades-title':
    'Новые сделки будут создаваться в новой папке',
  'settings.general.path-change.new-trades-desc':
    'Все будущие торговые журналы будут использовать:',
  'settings.general.path-change.manual-title': 'Требуется ручное действие:',
  'settings.general.path-change.manual-desc':
    'У вас есть сделки в текущей папке. Чтобы переместить их:',
  'settings.general.path-change.step.open-explorer':
    'Откройте проводник файлов вашего хранилища',
  'settings.general.path-change.step.find-folder-prefix': 'Найдите вашу',
  'settings.general.path-change.step.find-folder-suffix': 'папку',
  'settings.general.path-change.step.drag-drop':
    'Перетащите её в новое место, когда будет удобно',
  'settings.general.path-change.manual-note':
    'Это позволяет полностью контролировать время и способ переноса файлов.',
  'settings.general.path-change.sync-title': 'Обновление синхронизации:',
  'settings.general.path-change.sync-desc':
    'Плагин автоматически обновит связи синхронизации сделок, чтобы отражать новый путь папки. Это сохранит связь синхронизированных сделок с бэкендом.',
  'settings.general.path-change.button.cancel': 'Отмена',
  'settings.general.path-change.button.confirm': 'Понятно',
  'settings.general.display-name': 'Отображаемое имя',
  'settings.general.display-name-desc':
    'Необязательное имя для приветствия в Journalit (напр., "Доброе утро, Алекс")',
  'settings.general.display-name-placeholder': 'Добавить отображаемое имя...',
  'settings.general.display-name-aria': 'Отображаемое имя для приветствия',
  'settings.general.display-name-confirm-aria': 'Подтвердить изменение имени',
  'settings.general.display-name-cancel-aria': 'Отменить изменение имени',
  'settings.general.display-name-saved':
    'Отображаемое имя сохранено как "{name}"',
  'settings.general.display-name-cleared': 'Отображаемое имя удалено',
  'settings.general.display-name-save-failed':
    'Не удалось сохранить имя. Попробуйте ещё раз.',
  'settings.general.privacy-mode': 'Режим конфиденциальности',
  'settings.general.privacy-mode-desc':
    'Маскирует чувствительные значения сделок, счетов, цен и результатов в интерфейсе, не изменяя сохранённые данные.',
  'settings.general.privacy-mode-aria': 'Переключить режим конфиденциальности',

  'settings.general.appearance': 'Оформление',
  'settings.general.accent-color': 'Акцентный цвет',
  'settings.general.accent-color-desc':
    'Цвет кнопок, переключателей и выделений Journalit. Акцент Journalit используется, только пока в Obsidian выбран акцент по умолчанию; акцент, выбранный в настройках оформления Obsidian или темой, всегда имеет приоритет.',
  'settings.general.accent-color-journalit': 'Акцент Journalit (по умолчанию)',
  'settings.general.accent-color-obsidian': 'Использовать акцент Obsidian',
  'settings.general.home-view-settings': 'Настройки главной страницы',
  'settings.general.home-auto-open': 'Автооткрытие главной страницы',
  'settings.general.home-auto-open-desc':
    'Выберите, когда автоматически открывать главную страницу',
  'settings.general.home-auto-open-always':
    'Всегда открывать + фокус (по умолчанию)',
  'settings.general.home-auto-open-ifnone': 'Только если нет активного файла',
  'settings.general.home-auto-open-never': 'Никогда (только вручную)',
  'settings.general.home-auto-open-aria': 'Выберите поведение при запуске',
  'settings.general.home-startup-changed':
    'Поведение Journalit при запуске изменено на: {behavior}',
  'settings.general.filter-recent': 'Фильтровать недавние по файлам Journalit',
  'settings.general.filter-recent-desc':
    'Показывать только файлы Journalit в виджете недавних (файлы в папке .journalit). Скрывает все остальные файлы хранилища.',
  'settings.general.filter-recent-aria':
    'Фильтровать недавние по файлам Journalit',
  'settings.general.filter-recent-toggled':
    'Фильтрация недавних по файлам Journalit {status}',
  'settings.general.home-widget-opacity': 'Непрозрачность виджетов',
  'settings.general.home-widget-opacity-desc':
    'Фон виджетов с изображением: 0% — прозрачный, 100% — непрозрачный. Настройка применяется к текущей теме; значения для светлой и тёмной тем сохраняются отдельно.',
  'settings.general.home-widget-opacity-save-failed':
    'Не удалось сохранить непрозрачность виджетов. Повторите попытку.',
  'settings.general.home-background': 'Фоновое изображение Home',
  'settings.general.home-background-desc':
    'Используйте изображение из хранилища или выберите его на компьютере, чтобы скопировать в хранилище.',
  'settings.general.home-background-dashboard': 'Показывать фон и в Dashboard',
  'settings.general.home-background-dashboard-desc':
    'Использует то же фоновое изображение в режиме Dashboard.',
  'settings.general.home-background-dashboard-aria':
    'Показывать фон главной страницы в Dashboard',

  'settings.general.home-background-choose': 'Выбрать изображение',
  'settings.general.home-background-clear': 'Очистить',

  'settings.general.home-background-invalid-file':
    'Выберите поддерживаемый файл изображения.',
  'settings.general.home-background-saved':
    'Фоновое изображение Home сохранено.',
  'settings.general.home-background-cleared':
    'Фоновое изображение Home очищено.',
  'settings.general.home-background-save-failed':
    'Не удалось сохранить фоновое изображение Home.',
  'settings.general.folder-section': 'Расположение папки и пути к изображениям',
  'settings.general.journal-folder': 'Расположение папки журнала',
  'settings.general.journal-folder-desc':
    'Выберите, где хранятся ваши торговые журналы в хранилище.',
  'settings.general.journal-folder-desc-2':
    'Оставьте пустым для использования корневой папки по умолчанию.',
  'settings.general.journal-folder-placeholder': 'Выберите папку...',
  'settings.general.journal-folder-default':
    'По умолчанию: Корневая папка (!Journalit)',
  'settings.general.update-image-paths': 'Обновить пути к изображениям',
  'settings.general.update-image-paths-desc':
    'Обновляет пути к изображениям во всех сделках в соответствии с текущим расположением папки. Используйте после ручного перемещения папки !Journalit.',
  'settings.general.update-image-paths-updating': 'Обновление...',
  'settings.general.update-image-paths-match':
    'Все пути к изображениям уже соответствуют текущему расположению папки',
  'settings.general.folder-updated':
    'Путь к папке журнала обновлён. Новые сделки будут создаваться в: {path}',
  'settings.general.folder-update-failed': 'Не удалось обновить путь: {error}',
  'settings.general.update-image-paths-success':
    'Успешно обновлены пути к изображениям в {count} сделках',
  'settings.general.update-image-paths-no-update':
    'Пути к изображениям не требуют обновления',
  'settings.general.update-image-paths-errors':
    'Обновлено {updated} сделок с {failed} ошибками. Подробности в консоли.',
  'settings.general.update-image-paths-failed':
    'Не удалось обновить пути к изображениям. Подробности в консоли.',
  'settings.general.trade-settings': 'Настройки сделок',
  'settings.general.auto-open-trades': 'Автооткрытие созданных сделок',
  'settings.general.auto-open-trades-desc':
    'Автоматически открывать заметки о сделках в новой вкладке после создания',
  'settings.general.auto-open-trades-aria': 'Автооткрытие созданных сделок',
  'settings.general.auto-open-toggled':
    'Автооткрытие созданных сделок {status}',
  'settings.general.date-format': 'Формат даты',
  'settings.general.date-format-desc': 'Формат отображения дат в плагине',
  'settings.general.date-format-aria':
    'Выберите формат даты для заметок о сделках',
  'settings.general.date-format-ddmmyy': 'ДД/ММ/ГГ (31/12/23)',
  'settings.general.date-format-mmddyy': 'ММ/ДД/ГГ (12/31/23)',
  'settings.general.date-format-yymmdd': 'ГГ/ММ/ДД (23/12/31)',
  'settings.general.date-format-changed': 'Формат даты изменён на {format}',
  'settings.general.use-24-hour-time': 'Использовать 24-часовой формат',
  'settings.general.use-24-hour-time-desc':
    'Отображать время в 24-часовом формате (14:30) вместо 12-часового AM/PM (2:30 PM)',
  'settings.general.use-24-hour-time-aria':
    'Использовать 24-часовой формат времени',
  'settings.general.show-seconds': 'Показывать секунды во времени сделки',
  'settings.general.show-seconds-desc':
    'Показывать секунды при вводе времени входа и выхода.',
  'settings.general.show-seconds-aria': 'Показывать секунды во времени сделки',
  'settings.general.skip-weekends': 'Исключать выходные',
  'settings.general.skip-weekends-desc':
    'Когда включено, Journalit считает выходные неторговыми днями во всем плагине. Отключите это, если вы торгуете или анализируете активность по субботам и воскресеньям.',
  'settings.general.skip-weekends-aria': 'Исключать выходные в Journalit',
  'settings.general.skip-weekends-toggled': 'Исключение выходных {status}',
  'settings.general.week-start': 'День начала недели',
  'settings.general.week-start-desc':
    'Выберите, с какого дня начинается торговая неделя. Влияет на недельные обзоры и отчеты.',
  'settings.general.week-start-aria': 'Выберите день начала недели',
  'settings.general.week-start-changed': 'День начала недели изменён на {day}',
  'settings.general.analytics-date-basis': 'База даты для аналитики',
  'settings.general.analytics-date-basis-desc':
    'Лучше всего подходит для свинг-трейдеров. Использует для аналитики дату входа или дату окончательного выхода. Режим даты выхода учитывает только закрытые сделки и требует дату выхода для сделок с прямым PnL.',
  'settings.general.analytics-date-basis-aria':
    'Выберите базу даты для аналитики',
  'settings.general.analytics-date-basis-entry': 'Дата входа',
  'settings.general.analytics-date-basis-exit': 'Дата выхода',
  'settings.general.analytics-date-basis-changed':
    'База даты для аналитики изменена на {basis}',
  'settings.general.dollar-value-input': 'Вводить размер позиции в валюте',
  'settings.general.dollar-value-input-desc':
    'Вводить размер позиции как сумму в валюте (напр., $10 000) вместо количества (акции/лоты/контракты). Количество рассчитывается автоматически из цены. Лучше всего работает для акций; фьючерсы/форекс имеют множители контрактов, которые не учитываются.',
  'settings.general.dollar-value-input-aria':
    'Вводить размер позиции как сумму в валюте',
  'settings.general.dollar-value-input-toggled': 'Ввод размера позиции: {mode}',
  'settings.general.dollar-value': 'Сумма в валюте',
  'settings.general.quantity': 'Количество',
  'settings.general.mae-mfe-input-mode': 'Режим ввода MAE/MFE',
  'settings.general.mae-mfe-input-mode-desc':
    'Выберите способ ввода значений максимального неблагоприятного/благоприятного отклонения в форме сделки.',
  'settings.general.mae-mfe-input-mode-desc-price':
    'Ценовые уровни: Введите минимальную/максимальную цену во время сделки.',
  'settings.general.mae-mfe-input-mode-desc-dollar':
    'Денежные значения: Введите максимальную просадку/прибыль в валюте напрямую.',
  'settings.general.mae-mfe-input-mode-aria': 'Выберите режим ввода MAE/MFE',
  'settings.general.mae-mfe-input-mode-price': 'Ценовые уровни',
  'settings.general.mae-mfe-input-mode-dollar': 'Денежные значения',
  'settings.general.mae-mfe-display-unit': 'Единица отображения MAE/MFE',
  'settings.general.mae-mfe-display-unit-desc':
    'Показывать MAE/MFE в валюте или тиках фьючерсов в аналитике и представлениях сделок. Режим тиков автоматически пересчитывает подходящие существующие фьючерсные сделки без изменения сохранённых данных.',
  'settings.general.mae-mfe-display-unit-aria':
    'Выбрать единицу отображения MAE/MFE',
  'settings.general.mae-mfe-display-dollar': 'Валюта',
  'settings.general.mae-mfe-display-ticks': 'Тики',
  'common.ticks': 'тиков',
  'dashboard.mae-mfe-ticks.partial-coverage':
    'Только {eligible} из {total} сделок содержат данные о тиках фьючерсов. Неподходящие сделки исключены из этой метрики.',
  'settings.general.cutoff-time': 'Время окончания торгового дня',
  'settings.general.cutoff-time-desc':
    'Время, определяющее конец торгового дня. Сделки после этого времени будут отнесены к следующему дню. (24-часовой формат, напр., 23:30)',
  'settings.general.cutoff-time-aria': 'Время окончания торгового дня',
  'settings.general.cutoff-time-changed':
    'Время окончания торгового дня изменено на {time}',
  'settings.general.break-even-threshold-mode': 'Тип порога безубытка',
  'settings.general.break-even-threshold-mode-desc':
    'Выберите, определяется ли безубыток фиксированным диапазоном P&L или процентом от текущего баланса счёта каждой сделки.',
  'settings.general.break-even-mode-fixed': 'Диапазон фиксированной суммы',
  'settings.general.break-even-mode-percent':
    'Процент от текущего баланса счёта',
  'settings.general.break-even-percent': 'Процент безубытка',
  'settings.general.break-even-percent-desc':
    'Симметричный порог вокруг нуля (±X% от текущего баланса счёта). Сделки без известного баланса счёта исключаются из статистики прибыльных и убыточных сделок.',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'Процент безубытка от текущего баланса счёта',
  'settings.general.break-even-range': 'Диапазон безубыточности',
  'settings.general.break-even-range-desc':
    'Определите диапазон P&L для признания сделок безубыточными. Например, Min: -20 и Max: 20 будут считать сделки между -$20 и +$20 безубыточными. Установите оба значения на 0, чтобы считать безубыточными только сделки с точным $0.00.',
  'settings.general.break-even-min-placeholder': 'Мин',
  'settings.general.break-even-max-placeholder': 'Макс',
  'settings.general.break-even-min-aria': 'Минимум диапазона безубыточности',
  'settings.general.break-even-max-aria': 'Максимум диапазона безубыточности',
  'settings.general.break-even-to': 'до',
  'settings.general.break-even-updated':
    'Диапазон безубыточности обновлён - представления обновятся при следующей загрузке',
  'settings.general.default-risk': 'Риск по умолчанию',
  'settings.general.default-risk-desc':
    'Сумма риска по умолчанию (в валюте счёта) для расчёта R-кратности. Оставьте пустым для ручного ввода в каждой сделке.',
  'settings.general.default-risk-aria': 'Сумма риска по умолчанию',
  'settings.general.display-r-multiples': 'Отображать R-кратности',
  'settings.general.display-r-multiples-desc':
    'Показывать R-кратности (соотношение риска к прибыли) вместо денежных сумм в плагине',
  'settings.general.display-r-multiples-aria':
    'Отображать R-кратности в представлениях сделок',
  'settings.general.display-r-multiples-toggled':
    'Отображение R-кратностей {status}',
  'settings.general.notification-settings': 'Настройки уведомлений',
  'settings.general.sync-notifications': 'Уведомления о синхронизации',
  'settings.general.sync-notifications-desc':
    'Показывать уведомления при завершении операций синхронизации',
  'settings.general.sync-notifications-aria':
    'Включить уведомления о синхронизации',
  'settings.general.sync-notifications-toggled':
    'Уведомления о синхронизации {status}',
  'settings.general.new-trade-notifications': 'Уведомления о новых сделках',
  'settings.general.new-trade-notifications-desc':
    'Показывать уведомления при обнаружении новых файлов сделок',
  'settings.general.new-trade-notifications-aria':
    'Включить уведомления о новых сделках',
  'settings.general.new-trade-notifications-toggled':
    'Уведомления о новых сделках {status}',
  'settings.general.update-notifications': 'Уведомления об обновлениях',
  'settings.general.update-notifications-desc':
    'Показывать напоминания об обновлениях и изменения после обновления.',
  'settings.general.update-notifications-aria':
    'Показывать уведомления об обновлениях',
  'settings.general.data-management': 'Управление данными & конфиденциальность',
  'settings.general.backup-restore-section':
    'Резервное копирование, восстановление и сброс',
  'settings.general.export-settings': 'Экспорт настроек',
  'settings.general.export-settings-desc':
    'Скачать все настройки плагина в формате JSON для резервного копирования или переноса в другое хранилище',
  'settings.general.export-settings-exporting': 'Экспорт...',
  'settings.general.import-settings': 'Импорт настроек',
  'settings.general.import-settings-desc':
    'Восстановить настройки из ранее экспортированного JSON-файла. Настройки будут объединены с текущими.',
  'settings.general.import-settings-importing': 'Импорт...',
  'settings.general.reset-to-defaults': 'Сбросить к значениям по умолчанию',
  'settings.general.reset-to-defaults-desc':
    'Сбросить все настройки плагина к значениям по умолчанию. Резервная копия будет создана автоматически.',
  'settings.general.reset-to-defaults-warning':
    'Внимание: Это удалит все пользовательские опции, настройки счетов и макеты.',
  'settings.general.reset-to-defaults-resetting': 'Сброс...',
  'settings.general.enabled': 'включено',
  'settings.general.disabled': 'отключено',

  'settings.general.include-copy-accounts-analytics':
    'Включать копирующие счета в аналитику по всем счетам',
  'settings.general.include-copy-accounts-analytics-desc':
    'Если включено, аналитика по всем счетам учитывает производные результаты копирующих счетов и считает их сделками на уровне счёта.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Включать копирующие счета в аналитику по всем счетам',
  'settings.general.include-copy-accounts-toggled':
    'Копирующие счета в аналитике по всем счетам: {status}',
  'settings.general.include-unrealized-pnl':
    'Включать нереализованный P&L в аналитику',
  'settings.general.include-unrealized-pnl-desc':
    'Если включено, итоги чистого P&L включают нереализованный P&L открытых позиций со снимком цены, отображаемый отдельно от реализованных результатов. Статистика, например процент прибыльных сделок и серии, остаётся только по реализованным.',
  'settings.general.include-unrealized-pnl-aria':
    'Включать нереализованный P&L в аналитику',
  'settings.general.include-unrealized-pnl-toggled':
    'Нереализованный P&L в аналитике: {status}',
  
  'settings.customization.title': 'Настройка',
  'settings.customization.description':
    'Настройка опций, внешнего вида и поведения плагина Journalit.',
  'settings.customization.trade-form-layout.description':
    'Выберите поля и разделы, которые отображаются в форме сделки.',
  'settings.customization.trade-form-layout.button': 'Настроить макет',
  'settings.customization.tickers-symbols': 'Тикеры/Символы',
  'settings.customization.symbol-mappings': 'Сопоставления символов',

  'settings.customization.setups': 'Сетапы',
  'settings.customization.mistakes': 'Ошибки',
  'settings.customization.tags': 'Теги',
  'settings.customization.events': 'События',

  'settings.customization.options.confirm.update-notes':
    'ОК (Обновить заметки)',
  'settings.customization.options.confirm.save-name': 'Сохранить только имя',
  'settings.customization.options.confirm.cancel': 'Отменить действие',
  'settings.customization.options.type.tickers': 'Тикеры',
  'settings.customization.options.type.accounts': 'Счета',
  'settings.customization.options.type.account-types': 'Типы счетов',
  'settings.customization.options.type.mistakes': 'Ошибки',
  'settings.customization.options.type.tags': 'Теги',
  'settings.customization.options.type.events': 'События',
  'settings.customization.options.asset-type.cfd': 'CFD',
  'settings.customization.options.notice.empty-name':
    'Название опции не может быть пустым',
  'settings.customization.options.notice.invalid-ticker':
    'Неверный формат тикера. Допускаются только буквы, цифры и точки.',
  'settings.customization.options.notice.added':
    'Добавлена опция "{newValue}" в {type}',
  'settings.customization.options.notice.duplicate':
    'Дубликат опции: {newValue} уже существует',
  'settings.customization.options.notice.asset-type-required':
    'Тип актива обязателен для инструментов',
  'settings.customization.options.notice.updated-with-notes':
    'Опция обновлена с "{oldValue}" на "{newValue}" и обновлено {count} заметок',
  'settings.customization.options.notice.updated':
    'Опция обновлена с "{oldValue}" на "{newValue}"',
  'settings.customization.options.confirm.rename-message':
    'Хотите обновить все существующие заметки, использующие "{oldValue}", на "{newValue}"?\n\nЭто выполнит поиск по всем заметкам и обновит значение опции везде, где оно найдено.',
  'settings.customization.options.notice.cannot-delete-archived':
    'Невозможно удалить тип счёта "Архивный" - он зарезервирован для архивирования счетов',
  'settings.customization.options.confirm.remove-message':
    'Вы уверены, что хотите удалить "{option}"? Это действие нельзя отменить.',
  'settings.customization.options.notice.removed': 'Удалена опция "{option}"',
  'settings.customization.options.notice.remove-failed':
    'Не удалось удалить опцию',
  'settings.customization.options.confirm.reset-message':
    'Вы уверены, что хотите сбросить все {type} к вариантам по умолчанию? Это действие нельзя отменить.',
  'settings.customization.options.notice.reset-success':
    '{type} сброшены к вариантам по умолчанию',
  'settings.customization.options.notice.no-options-to-reset':
    'Варианты по умолчанию для {type} уже используются',
  'settings.customization.options.notice.mapping-symbols-required':
    'Оба символа обязательны',
  'settings.customization.options.notice.mapping-added':
    'Сопоставление добавлено: {imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    'Не удалось добавить сопоставление',
  'settings.customization.options.notice.mapping-deleted':
    'Сопоставление удалено: {symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    'Не удалось удалить сопоставление',
  'settings.customization.options.empty-state':
    'Пользовательские {type} ещё не добавлены.',
  'settings.customization.options.label.save-changes': 'Сохранить изменения',
  'settings.customization.options.label.cancel-editing':
    'Отменить редактирование',
  'settings.customization.options.label.edit-option': 'Редактировать {option}',
  'settings.customization.options.label.remove-option': 'Удалить {option}',
  'settings.customization.options.field.pip-size': 'Размер пипса',
  'settings.customization.options.field.priority': 'Приоритет:',
  'settings.customization.options.field.default-event-notes':
    'Заметки события по умолчанию:',
  'settings.customization.options.placeholder.default-event-notes':
    'Заметки для автоматического заполнения при выборе этого события',
  'settings.customization.options.aria.confirm-add':
    'Подтвердить добавление {type}',
  'settings.customization.options.label.locked': 'Заблокировано',
  'settings.customization.options.aria.reset-all':
    'Удалить все пользовательские {type}',
  'settings.customization.options.button.reset-all': 'Сбросить все {type}',
  'settings.customization.options.placeholder.new-name':
    'Новое название {type}',
  'settings.customization.options.placeholder.dollar-per-point': '$/пункт',
  'settings.customization.options.placeholder.tick-size': 'Размер тика',
  'settings.customization.options.placeholder.tick-value': 'Стоимость тика',
  'settings.customization.options.placeholder.lot-size': 'Размер лота',
  'settings.customization.options.placeholder.pip-value': 'Стоимость пипса',
  'settings.customization.options.placeholder.pip-size': 'Размер пипса',
  'settings.customization.options.field.optional': '(необязательно)',
  'settings.customization.options.mapping.description':
    'Сопоставляет контрактные символы (напр., NQZ5) с базовыми символами (напр., NQ) для автоматического поиска спецификаций',
  'settings.customization.options.mapping.auto-detected': 'Автоопределено',
  'settings.customization.options.mapping.manual': 'Вручную',
  'settings.customization.options.mapping.created-at': 'Создано {date}',
  'settings.customization.options.mapping.no-mappings':
    'Сопоставлений символов пока нет. Сопоставления создаются автоматически при импорте CSV, когда обнаруживаются контрактные символы.',
  'settings.customization.options.mapping.placeholder-imported':
    'Импортируемый символ (напр., NQZ5)',
  'settings.customization.options.mapping.placeholder-base':
    'Базовый символ (напр., NQ)',
  'settings.customization.options.mapping.button-add': 'Добавить сопоставление',
  'settings.customization.options.placeholder.add-new': 'Добавить новый {type}',
  'settings.customization.options.aria.delete-mapping': 'Удалить сопоставление',
  'settings.customization.options.instrument.specs-futures':
    '${dollar}/пт, {tick} тик, ${value} стоимость тика',
  'settings.customization.options.instrument.specs-forex':
    '{lot} лот, ${pip} стоимость пипса, {size} размер пипса',
  'settings.customization.options.instrument.built-in': '(встроенный)',
  'settings.customization.options.instrument.mapped-to':
    'Сопоставлен с {base} (использует спецификации {base})',
  'settings.customization.options.instrument.no-specs':
    '(Спецификации не заданы)',
  'settings.customization.custom-fields.description':
    'Добавьте к каждой сделке собственные поля: сессию, таймфрейм или оценку сетапа. Они появляются на вкладке «Дополнительно» формы сделки, сохраняются во frontmatter заметки и могут стать сортируемыми и фильтруемыми столбцами журнала сделок.',
  'settings.customization.custom-fields.title':
    'Пользовательские поля ({count})',
  'settings.customization.custom-fields.manage-desc':
    'Управление пользовательскими полями формы сделки',
  'settings.customization.custom-fields.type-dropdown': 'Выпадающий список',
  'settings.customization.custom-fields.type-multiselect':
    'Множественный выбор',
  'settings.customization.custom-fields.type-suffix': 'поле',
  'settings.customization.custom-fields.no-fields':
    'Пользовательские поля ещё не определены',
  'settings.customization.custom-fields.no-fields-desc':
    'Начните с одного поля, которое вы действительно будете разбирать позже: например, торговая сессия или насколько сетап соответствовал плану.',
  'settings.customization.custom-fields.add-new': 'Добавить новое поле',

  'settings.customization.custom-fields.edit-field-with-name':
    'Редактировать «{fieldLabel}»',
  'settings.customization.custom-fields.configure-desc':
    'Настройте параметры пользовательского поля ниже',
  'settings.customization.custom-fields.actions': 'Действия',
  'settings.customization.custom-fields.actions-desc':
    'Управление пользовательскими полями',
  'settings.customization.custom-fields.add-button':
    'Добавить пользовательское поле',
  'settings.customization.custom-fields.delete-all-button': 'Удалить все поля',
  'settings.customization.custom-fields.editor.title': 'Конфигурация поля',
  'settings.customization.custom-fields.editor.label': 'Метка поля',
  'settings.customization.custom-fields.editor.label-desc':
    'Отображаемое название этого поля',
  'settings.customization.custom-fields.editor.label-placeholder':
    'Введите метку поля',
  'settings.customization.custom-fields.editor.key': 'Ключ frontmatter',
  'settings.customization.custom-fields.editor.key-desc':
    'Этот ключ будет отображаться в файлах сделок: ',
  'settings.customization.custom-fields.editor.key-placeholder': 'имя_поля',
  'settings.customization.custom-fields.editor.key-reserved':
    '⚠️ Зарезервированное имя поля',
  'settings.customization.custom-fields.editor.type': 'Тип поля',
  'settings.customization.custom-fields.editor.type-desc': 'Тип поля ввода',
  'settings.customization.custom-fields.editor.placeholder': 'Текст-подсказка',
  'settings.customization.custom-fields.editor.placeholder-desc':
    'Необязательный текст-подсказка для пустого поля',
  'settings.customization.custom-fields.editor.placeholder-input':
    'Введите текст-подсказку',
  'settings.customization.custom-fields.editor.validation': 'Валидация',
  'settings.customization.custom-fields.editor.validation-desc':
    'Правила валидации поля',
  'settings.customization.custom-fields.editor.validation.required':
    'Обязательное поле',
  'settings.customization.custom-fields.editor.validation.required-desc':
    'Сделать это поле обязательным',
  'settings.customization.custom-fields.editor.validation.min-length':
    'Минимальная длина',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    'Минимальное количество символов',
  'settings.customization.custom-fields.editor.validation.no-min':
    'Нет минимума',
  'settings.customization.custom-fields.editor.validation.max-length':
    'Максимальная длина',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    'Максимальное количество символов',
  'settings.customization.custom-fields.editor.validation.no-max':
    'Нет максимума',
  'settings.customization.custom-fields.editor.validation.min-value':
    'Минимальное значение',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    'Минимально допустимое число',
  'settings.customization.custom-fields.editor.validation.max-value':
    'Максимальное значение',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    'Максимально допустимое число',
  'settings.customization.custom-fields.editor.options': 'Опции',
  'settings.customization.custom-fields.editor.options-desc':
    'Доступные варианты для этого поля',
  'settings.customization.custom-fields.editor.add-option':
    'Добавить новую опцию',
  'settings.customization.custom-fields.editor.add-option-desc':
    'Введите новый вариант',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    'Введите новую опцию',
  'settings.customization.custom-fields.editor.allow-create':
    'Разрешить создание новых опций',
  'settings.customization.custom-fields.editor.allow-create-desc':
    'Пользователи могут создавать новые опции при использовании этого поля в формах сделок',
  'settings.customization.custom-fields.editor.save': 'Сохранить поле',
  'settings.customization.custom-fields.editor.delete': 'Удалить поле',

  'settings.customization.options.commission.costs': 'Затраты',
  'settings.customization.options.commission.add-rule':
    '+ Добавить правило затрат',
  'settings.customization.options.commission.applies-to': 'Применяется к',
  'settings.customization.options.commission.method': 'Метод',
  'settings.customization.options.commission.entry': 'Вход',
  'settings.customization.options.commission.exit': 'Выход',
  'settings.customization.options.commission.round-trip': 'Полный круг',
  'settings.customization.options.commission.all-accounts': 'Все счета',
  'settings.customization.options.commission.per-side': 'За сторону',
  'settings.customization.options.commission.remove-rule':
    'Удалить правило затрат',
  'settings.customization.custom-fields.editor.trade-log': 'Журнал сделок',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'Определяет, как отображается это поле, если оно добавлено столбцом в журнал сделок',
  'settings.customization.custom-fields.editor.column-label':
    'Подпись столбца в журнале сделок',
  'settings.customization.custom-fields.editor.column-label-desc':
    'Необязательная короткая подпись, используемая только в заголовке журнала сделок',
  'settings.customization.custom-fields.editor.column-label-placeholder':
    'По умолчанию используется название поля',
  'settings.customization.custom-fields.editor.display-as-currency':
    'Отображать как валюту',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Форматирует это числовое поле как денежное значение только в журнале сделок',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'Сортировка списка',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'По умолчанию отключено. Включайте сортировку, только если у списка есть осмысленный порядок.',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'Отключено',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'По алфавиту',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'По числу',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'Заданный порядок вариантов',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'Свёрнутое отображение',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'Выберите, как отображать значения множественного выбора, когда развёрнутый режим журнала сделок выключен',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'Счётчик',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'Список значений',

  'settings.customization.custom-fields.type.text': 'Текст',
  'settings.customization.custom-fields.type.number': 'Число',
  'settings.customization.custom-fields.type.date': 'Дата',
  'settings.customization.custom-fields.type.datetime': 'Дата и время',
  'settings.customization.custom-fields.type.time': 'Время',
  'settings.customization.custom-fields.error.cannot-save':
    'Невозможно сохранить поле: {error}',
  'settings.customization.custom-fields.error.duplicate-key':
    'Поле с таким ключом frontmatter уже существует',
  'settings.customization.custom-fields.error.save-failed':
    'Не удалось сохранить поле. Попробуйте ещё раз.',
  'settings.customization.custom-fields.notice.import-summary':
    'Импортировано {validCount} корректных полей из {totalCount}',
  'settings.customization.custom-fields.delete.confirm-message':
    'Вы уверены, что хотите удалить пользовательское поле "{fieldLabel}"?',
  'settings.customization.custom-fields.delete.cannot-undo':
    'Это действие нельзя отменить.',
  'settings.customization.custom-fields.convert.action':
    'Преобразовать {fieldLabel} в оценку',
  'settings.customization.custom-fields.convert.title':
    'Преобразовать {fieldLabel} в оценку',
  'settings.customization.custom-fields.convert.editor-name':
    'Встроенная оценка',
  'settings.customization.custom-fields.convert.editor-desc':
    'В Journalit у каждой сделки есть оценка звёздами. Перенесите в неё значение {fieldLabel} каждой сделки.',
  'settings.customization.custom-fields.convert.intro':
    'Значение {fieldLabel} каждой сделки станет её оценкой в звёздах. Значения {fieldLabel} сохранятся, пока вы не удалите поле.',
  'settings.customization.custom-fields.convert.empty':
    'Ни у одной сделки нет значения {fieldLabel}.',
  'settings.customization.custom-fields.convert.scale-label':
    'Шкала {fieldLabel}',
  'settings.customization.custom-fields.convert.scale-out-of': 'Из {max}',
  'settings.customization.custom-fields.convert.scale-custom': 'Своя',
  'settings.customization.custom-fields.convert.scale-custom-max':
    'Максимальное значение',
  'settings.customization.custom-fields.convert.table':
    'Значения {fieldLabel} и их оценки',
  'settings.customization.custom-fields.convert.col-trades': 'Сделки',
  'settings.customization.custom-fields.convert.value-rating':
    'Оценка для {value}',
  'settings.customization.custom-fields.convert.skip': 'Не преобразуется',
  'settings.customization.custom-fields.convert.unreadable.one':
    'У {count} сделки значение нельзя прочитать как оценку, она не будет преобразована.',
  'settings.customization.custom-fields.convert.unreadable.other':
    'У {count} сделок значение нельзя прочитать как оценку, они не будут преобразованы.',
  'settings.customization.custom-fields.convert.conflict.one':
    'У {count} сделки уже есть другая оценка',
  'settings.customization.custom-fields.convert.conflict.other':
    'У {count} сделок уже есть другая оценка',
  'settings.customization.custom-fields.convert.conflict-keep':
    'Оставить их оценку',
  'settings.customization.custom-fields.convert.conflict-overwrite':
    'Использовать {fieldLabel}',
  'settings.customization.custom-fields.convert.summary-rate.one':
    'Оценит {count} сделку',
  'settings.customization.custom-fields.convert.summary-rate.other':
    'Оценит сделок: {count}',
  'settings.customization.custom-fields.convert.summary-done.one':
    'Уже преобразовано: {count}',
  'settings.customization.custom-fields.convert.summary-done.other':
    'Уже преобразовано: {count}',
  'settings.customization.custom-fields.convert.summary-skip.one':
    'Не преобразуется: {count}',
  'settings.customization.custom-fields.convert.summary-skip.other':
    'Не преобразуется: {count}',
  'settings.customization.custom-fields.convert.submit.one':
    'Оценить {count} сделку',
  'settings.customization.custom-fields.convert.submit.other':
    'Оценить сделки ({count})',
  'settings.customization.custom-fields.convert.continue': 'Продолжить',
  'settings.customization.custom-fields.convert.progress':
    'Оценка сделок: {done} из {total}',
  'settings.customization.custom-fields.convert.done.one':
    'Оценена {count} сделка.',
  'settings.customization.custom-fields.convert.done.other':
    'Оценено сделок: {count}.',
  'settings.customization.custom-fields.convert.changed.one':
    '{count} сделка изменилась после открытия этого окна и не была затронута. Откройте его снова, чтобы включить её.',
  'settings.customization.custom-fields.convert.changed.other':
    'Сделок изменилось после открытия этого окна и не было затронуто: {count}. Откройте его снова, чтобы включить их.',
  'settings.customization.custom-fields.convert.failed.one':
    'Не удалось обновить {count} сделку:',
  'settings.customization.custom-fields.convert.failed.other':
    'Не удалось обновить сделки ({count}):',
  'settings.customization.custom-fields.convert.remove-title':
    'Удалить {fieldLabel}?',
  'settings.customization.custom-fields.convert.remove-desc.one':
    'Удаляет {fieldLabel} из {count} сделки, оценка которой теперь содержит это значение, а затем удаляет поле.',
  'settings.customization.custom-fields.convert.remove-desc.other':
    'Удаляет {fieldLabel} из сделок ({count}), оценка которых теперь содержит это значение, а затем удаляет поле.',
  'settings.customization.custom-fields.convert.remove-keeps.one':
    '{count} сделка сохранит значение {fieldLabel}, так как оно не было преобразовано.',
  'settings.customization.custom-fields.convert.remove-keeps.other':
    'Сделки ({count}) сохранят значение {fieldLabel}, так как оно не было преобразовано.',
  'settings.customization.custom-fields.convert.remove-confirm.one':
    'Удалить {fieldLabel} из {count} сделки и удалить поле?',
  'settings.customization.custom-fields.convert.remove-confirm.other':
    'Удалить {fieldLabel} из сделок ({count}) и удалить поле?',
  'settings.customization.custom-fields.convert.remove-views':
    'Столбцы журнала сделок, фильтры и блоки макета, использующие {fieldLabel}, перестанут его показывать.',
  'settings.customization.custom-fields.convert.remove': 'Удалить {fieldLabel}',
  'settings.customization.custom-fields.convert.remove-progress':
    'Удаление {fieldLabel}: {done} из {total}',
  'settings.customization.custom-fields.convert.removed':
    '{fieldLabel} удалено. Ваши оценки сохранены.',
  'settings.customization.custom-fields.convert.remove-incomplete':
    'Некоторые сделки не были обновлены, поэтому {fieldLabel} сохранено. Откройте это окно снова, чтобы завершить удаление.',
  'settings.customization.custom-fields.convert.remove-field-failed':
    '{fieldLabel} удалено из всех сделок, но само поле удалить не удалось. Удалите его в разделе пользовательских полей сделок.',
  'settings.customization.custom-fields.convert.field-changed':
    'Поле {fieldLabel} было изменено или удалено в другом месте, поэтому остальные сделки не обновлены. Откройте это окно снова, чтобы продолжить.',
  'settings.customization.custom-fields.reset.confirm-message':
    'Вы уверены, что хотите удалить ВСЕ пользовательские поля?',
  'settings.customization.custom-fields.saved-options.title':
    'Сохранённые пользовательские опции',
  'settings.customization.custom-fields.saved-options.description':
    'Управление опциями, созданными пользователями для пользовательских полей',
  'settings.customization.custom-fields.saved-options.delete-error':
    'Не удалось удалить опцию. Попробуйте ещё раз.',
  'settings.customization.custom-fields.saved-options.clear-error':
    'Не удалось очистить опции. Попробуйте ещё раз.',
  'settings.customization.custom-fields.option.delete-confirm':
    'Вы уверены, что хотите удалить опцию "{optionName}"?',
  'settings.customization.custom-fields.option.clear-confirm':
    'Вы уверены, что хотите удалить ВСЕ сохранённые опции для "{fieldLabel}"?',

  
  'settings.reset.modal.title': 'Сбросить настройки к значениям по умолчанию?',
  'settings.reset.modal.explanation':
    'Это сбросит ВСЕ настройки плагина к значениям по умолчанию. Включая:',
  'settings.reset.modal.item-custom-options':
    'Все пользовательские опции (тикеры, сетапы, ошибки)',
  'settings.reset.modal.item-account-settings': 'Настройки счетов и метаданные',
  'settings.reset.modal.item-dashboard-layouts': 'Макеты панели управления',
  'settings.reset.modal.item-symbol-mappings': 'Сопоставления символов',
  'settings.reset.modal.item-csv-templates': 'Шаблоны Trade Import',
  'settings.reset.modal.item-other': 'Все остальные настройки',
  'settings.reset.modal.backup-note':
    'Резервная копия будет создана перед сбросом.',
  'settings.reset.modal.warning':
    'Это действие нельзя отменить (кроме восстановления из резервной копии).',
  'settings.reset.backup-failed.title': 'Ошибка резервного копирования',
  'settings.reset.backup-failed.message':
    'Не удалось создать резервную копию текущих настроек.',
  'settings.reset.backup-failed.warning':
    'Если вы продолжите сброс, вы не сможете восстановить текущие настройки.',

  
  
  
  
  
  
  

  
  'validation.basic-tab-errors.one':
    'Вкладка "Основное" содержит {count} ошибку',
  'validation.basic-tab-errors.few':
    'Вкладка "Основное" содержит {count} ошибки',
  'validation.basic-tab-errors.many':
    'Вкладка "Основное" содержит {count} ошибок',
  'validation.basic-tab-errors.other':
    'Вкладка "Основное" содержит {count} ошибок',

  'validation.details-tab-errors.one':
    'Вкладка "Детали" содержит {count} ошибку',
  'validation.details-tab-errors.few':
    'Вкладка "Детали" содержит {count} ошибки',
  'validation.details-tab-errors.many':
    'Вкладка "Детали" содержит {count} ошибок',
  'validation.details-tab-errors.other':
    'Вкладка "Детали" содержит {count} ошибок',

  'validation.advanced-tab-errors.one':
    'Вкладка "Дополнительно" содержит {count} ошибку',
  'validation.advanced-tab-errors.few':
    'Вкладка "Дополнительно" содержит {count} ошибки',
  'validation.advanced-tab-errors.many':
    'Вкладка "Дополнительно" содержит {count} ошибок',
  'validation.advanced-tab-errors.other':
    'Вкладка "Дополнительно" содержит {count} ошибок',

  

  'notice.trades-duplicated.one': 'Дублирована {count} сделка',
  'notice.trades-duplicated.few': 'Дублировано {count} сделки',
  'notice.trades-duplicated.many': 'Дублировано {count} сделок',
  'notice.trades-duplicated.other': 'Дублировано {count} сделок',
  'notice.trades-deleted.one': 'Удалена {count} сделка',
  'notice.trades-deleted.few': 'Удалено {count} сделки',
  'notice.trades-deleted.many': 'Удалено {count} сделок',
  'notice.trades-deleted.other': 'Удалено {count} сделок',

  'notice.mark-reviewed.one': '{count} сделка отмечена как проверенная',
  'notice.mark-reviewed.few': '{count} сделки отмечены как проверенные',
  'notice.mark-reviewed.many': '{count} сделок отмечено как проверенные',
  'notice.mark-reviewed.other': '{count} сделок отмечено как проверенные',

  
  'tradelog.batch.delete-confirm.message.one':
    'Вы уверены, что хотите удалить {count} сделку? Это действие нельзя отменить.',
  'tradelog.batch.delete-confirm.message.few':
    'Вы уверены, что хотите удалить {count} сделки? Это действие нельзя отменить.',
  'tradelog.batch.delete-confirm.message.many':
    'Вы уверены, что хотите удалить {count} сделок? Это действие нельзя отменить.',
  'tradelog.batch.delete-confirm.message.other':
    'Вы уверены, что хотите удалить {count} сделок? Это действие нельзя отменить.',

  'tradelog.batch.errors-count.one': 'Произошла {count} ошибка',
  'tradelog.batch.errors-count.few': 'Произошло {count} ошибки',
  'tradelog.batch.errors-count.many': 'Произошло {count} ошибок',
  'tradelog.batch.errors-count.other': 'Произошло {count} ошибок',

  
  'account.header.warning.trades-before-creation.one':
    '{count} сделка датирована раньше даты создания счёта',
  'account.header.warning.trades-before-creation.few':
    '{count} сделки датированы раньше даты создания счёта',
  'account.header.warning.trades-before-creation.many':
    '{count} сделок датировано раньше даты создания счёта',
  'account.header.warning.trades-before-creation.other':
    '{count} сделок датировано раньше даты создания счёта',

  
  'csv.results.success.one': 'Успешно импортирована {count} сделка в {account}',
  'csv.results.success.few': 'Успешно импортировано {count} сделки в {account}',
  'csv.results.success.many':
    'Успешно импортировано {count} сделок в {account}',
  'csv.results.success.other':
    'Успешно импортировано {count} сделок в {account}',

  'csv.results.skipped.one': '{count} дубликат сделки пропущен',
  'csv.results.skipped.few': '{count} дубликата сделок пропущено',
  'csv.results.skipped.many': '{count} дубликатов сделок пропущено',
  'csv.results.skipped.other': '{count} дубликатов сделок пропущено',

  
  'settings.customization.custom-fields.option-count.one': '{count} опция',
  'settings.customization.custom-fields.option-count.few': '{count} опции',
  'settings.customization.custom-fields.option-count.many': '{count} опций',
  'settings.customization.custom-fields.option-count.other': '{count} опций',

  
  'widget.best-worst-days.trade-count.one': '{count} сделка',
  'widget.best-worst-days.trade-count.few': '{count} сделки',
  'widget.best-worst-days.trade-count.many': '{count} сделок',
  'widget.best-worst-days.trade-count.other': '{count} сделок',

  'widget.trading-score.weeks-to-unlock.one':
    'Ещё {count} неделя для разблокировки',
  'widget.trading-score.weeks-to-unlock.few':
    'Ещё {count} недели для разблокировки',
  'widget.trading-score.weeks-to-unlock.many':
    'Ещё {count} недель для разблокировки',
  'widget.trading-score.weeks-to-unlock.other':
    'Ещё {count} недель для разблокировки',

  'widget.trading-score.trades-to-unlock.one':
    'Ещё {count} сделка для разблокировки',
  'widget.trading-score.trades-to-unlock.few':
    'Ещё {count} сделки для разблокировки',
  'widget.trading-score.trades-to-unlock.many':
    'Ещё {count} сделок для разблокировки',
  'widget.trading-score.trades-to-unlock.other':
    'Ещё {count} сделок для разблокировки',

  'widget.trading-score.trades-logged.one': '{count} сделка записана',
  'widget.trading-score.trades-logged.few': '{count} сделки записано',
  'widget.trading-score.trades-logged.many': '{count} сделок записано',
  'widget.trading-score.trades-logged.other': '{count} сделок записано',

  
  'home.widget.unreviewed.need-review.one': '{count} сделка требует проверки',
  'home.widget.unreviewed.need-review.few': '{count} сделки требуют проверки',
  'home.widget.unreviewed.need-review.many': '{count} сделок требуют проверки',
  'home.widget.unreviewed.need-review.other': '{count} сделок требуют проверки',

  
  
  

  
  'widget.goals.title.daily': 'Дневные цели',
  'widget.goals.title.weekly': 'Еженедельные цели',
  'widget.goals.title.monthly': 'Ежемесячные цели',
  'widget.goals.title.quarterly': 'Ежеквартальные цели',
  'widget.goals.title.yearly': 'Годовые цели',
  'widget.goals.title.default': 'Цели',
  'widget.goals.tooltip.daily':
    'Элементы, добавленные здесь, применяются только к этому дню. Для повторяющихся элементов на всех новых DRC перейдите в Настройки > Рецензии.',
  'widget.goals.tooltip.weekly':
    'Элементы, добавленные здесь, применяются только к этой неделе. Для повторяющихся элементов на всех новых еженедельных рецензиях перейдите в Настройки > Рецензии.',
  'widget.goals.tooltip.monthly':
    'Элементы, добавленные здесь, применяются только к этому месяцу. Для повторяющихся элементов на всех новых ежемесячных рецензиях перейдите в Настройки > Рецензии.',
  'widget.goals.tooltip.quarterly':
    'Элементы, добавленные здесь, применяются только к этому кварталу. Для повторяющихся элементов на всех новых ежеквартальных рецензиях перейдите в Настройки > Рецензии.',
  'widget.goals.tooltip.yearly':
    'Элементы, добавленные здесь, применяются только к этому году. Для повторяющихся элементов на всех новых годовых рецензиях перейдите в Настройки > Рецензии.',
  'widget.goals.completed': '{completed}/{total} выполнено',
  'widget.goals.placeholder': 'Добавить новую цель...',
  'widget.goals.empty.preview': 'Цели не настроены',
  'widget.goals.empty.default': 'Цели не установлены. Добавьте одну ниже.',
  'widget.goals.invalid-context':
    'Виджет целей требует примечание рецензии (DRC, Еженедельная, Ежемесячная, Ежеквартальная или Годовая)',
  'widget.goals.aria.edit': 'Изменить цель',
  'widget.goals.aria.delete': 'Удалить цель',
  'widget.goals.name': 'Цели',
  'widget.goals.description': 'Ежедневные цели с флажками выполнения',

  
  'review.header.guide.intro.title': 'Ваш обзор начинается здесь',
  'review.header.guide.intro.description':
    'В заголовке есть всё необходимое для навигации и управления этим обзором.',
  'review.header.guide.reviewed.title': 'Отметить как проверенную',
  'review.header.guide.reviewed.description':
    'Нажмите на кружок, чтобы отметить эту заметку как проверенную. Нажмите ещё раз, чтобы отменить.',
  'review.header.guide.dates.title': 'Переход между обзорами',
  'review.header.guide.dates.description':
    'Нажмите на дату, например июнь или 2026, чтобы открыть соответствующую заметку обзора.',
  'review.header.guide.controls.title': 'Фильтры, макет и навигация',
  'review.header.guide.controls.description':
    'Используйте воронку для фильтрации сделок, «Сменить layout» для изменения макета заметки и «Назад» / «Далее» для перехода между периодами обзора.',
  'widget.header.name': 'Заголовок',

  'widget.header.invalid-context':
    'Неверный frontmatter: требуется тип (drc/weekly-review/monthly-review/quarterly-review/trade) и поле даты (date для рецензий, entryTime для сделок)',
  'widget.header.aria.mark-reviewed':
    'Нажмите, чтобы отметить как просмотренное',
  'widget.header.aria.mark-not-reviewed':
    'Нажмите, чтобы отметить как не просмотренное',
  'widget.header.unknown-instrument': 'Неизвестно',
  'widget.header.week': 'Неделя {number}',
  'widget.header.quarter': 'К{number}',
  'widget.header.drc': 'Дневной анализ',
  'widget.header.nav.prev': '← Назад',
  'widget.header.nav.next': 'Далее →',
  'widget.header.month.0': 'Январь',
  'widget.header.month.1': 'Февраль',
  'widget.header.month.2': 'Март',
  'widget.header.month.3': 'Апрель',
  'widget.header.month.4': 'Май',
  'widget.header.month.5': 'Июнь',
  'widget.header.month.6': 'Июль',
  'widget.header.month.7': 'Август',
  'widget.header.month.8': 'Сентябрь',
  'widget.header.month.9': 'Октябрь',
  'widget.header.month.10': 'Ноябрь',
  'widget.header.month.11': 'Декабрь',
  'widget.header.month-short.0': 'Янв',
  'widget.header.month-short.1': 'Фев',
  'widget.header.month-short.2': 'Мар',
  'widget.header.month-short.3': 'Апр',
  'widget.header.month-short.4': 'Май',
  'widget.header.month-short.5': 'Июн',
  'widget.header.month-short.6': 'Июл',
  'widget.header.month-short.7': 'Авг',
  'widget.header.month-short.8': 'Сен',
  'widget.header.month-short.9': 'Окт',
  'widget.header.month-short.10': 'Ноя',
  'widget.header.month-short.11': 'Дек',

  
  'widget.picker.placeholder': 'Выберите виджет...',
  'widget.picker.search-placeholder': 'Поиск виджетов...',
  'widget.picker.search-label': 'Поиск виджетов',
  'widget.picker.clear-search': 'Очистить поиск виджетов',
  'widget.picker.results-label': 'Доступные виджеты',
  'widget.picker.no-results': 'Нет виджетов, соответствующих поиску',
  'widget.category.charts': 'Графики',
  'widget.category.statistics': 'Статистика',
  'widget.category.content': 'Содержание',
  'widget.category.tables': 'Таблицы',
  'widget.category.layout': 'Макет',

  
  'widget.review.name': 'Обзор',
  'widget.review.description':
    'Оценки психологического и технического мастерства',
  'widget.review-context-fields.name': 'Поля контекста обзора',
  'widget.review-context-fields.description':
    'Редактируемые пользовательские поля контекста для заметок обзора',
  'widget.review-context-fields.group.default': 'Контекст обзора',

  'widget.review-context-fields.empty-title':
    'Для этого типа анализа не настроены поля контекста.',
  'widget.review-context-fields.empty-desc':
    'Создайте в настройках пользовательские поля обзора, чтобы фиксировать уклон, фокус, намерения и другой контекст планирования.',
  'widget.review-context-fields.configure': 'Настроить поля обзора',
  'widget.review-context-fields.service-unavailable':
    'Пользовательские поля обзора пока недоступны.',
  'widget.review-context-fields.unsupported-type':
    'Неподдерживаемый тип поля обзора.',
  'widget.review-context-fields.source-missing':
    'Эта родительская запись анализа ещё не существует.',
  'widget.review-context-fields.source-invalid':
    'Эта родительская запись анализа существует, но не является корректной заметкой анализа.',
  'widget.review-context-fields.source-empty':
    'В этом родительском обзоре еще не заполнены наследуемые значения.',

  'widget.review.title': 'Обзор результатов',
  'widget.review.mental-game': 'Психология',
  'widget.review.technical-game': 'Техника',
  'widget.review.star-hint':
    'Нажмите для полной звезды, нажмите ещё раз для половины звезды',
  'widget.review.invalid-context':
    'Виджету обзора нужна заметка DRC или недельного обзора (тип frontmatter: drc или weekly-review)',

  
  'widget.checklist.name': 'Чек-лист',
  'widget.checklist.description': 'Чек-лист подготовки перед сессией',
  'widget.checklist.title': 'Чек-лист DRC',
  'widget.checklist.weekly-title': 'Недельный чек-лист',
  'widget.checklist.tooltip.weekly':
    'Элементы, добавленные здесь, применяются только к этой неделе.',
  'widget.checklist.tooltip.weekly-settings-link':
    'Для повторяющихся элементов во всех новых недельных обзорах перейдите в Настройки > Обзоры.',
  'widget.checklist.tooltip.day-only':
    'Элементы применяются только к этому дню.',
  'widget.checklist.tooltip.settings-link':
    'Для повторяющихся элементов перейдите в Настройки > Обзоры.',
  'widget.checklist.completed': 'завершено',
  'widget.checklist.edit-item': 'Редактировать',
  'widget.checklist.delete-item': 'Удалить',
  'widget.checklist.empty.preview': 'Нет элементов чек-листа',
  'widget.checklist.empty.add-one': 'Нет элементов. Добавьте один ниже.',
  'widget.checklist.placeholder': 'Добавить элемент чек-листа...',
  'widget.checklist.invalid-context':
    'Виджет требует примечание DRC или недельного обзора (тип: drc или weekly-review)',

  
  'widget.session-mistakes.name': 'Ошибки сессии',
  'widget.session-mistakes.description':
    'Фиксируйте поведенческие ошибки один раз за сессию',
  'widget.session-mistakes.title': 'Ошибки сессии',
  'widget.session-mistakes.subtitle':
    'Записывайте ошибки один раз за торговую сессию, а не в каждой сделке.',

  'widget.session-mistakes.placeholder': 'Выберите или создайте ошибки',
  'widget.session-mistakes.empty': 'Ошибки сессии не добавлены',

  'widget.day-trade-fields.name': 'Поля сделок дня',
  'widget.day-trade-fields.description': 'Поля для всех сделок дня',
  'widget.day-trade-fields.title': 'Поля сделок дня',
  'widget.day-trade-fields.mistakes': 'Ошибки',
  'widget.day-trade-fields.tags': 'Теги',
  'widget.day-trade-fields.not-set': 'Не задано',
  'widget.day-trade-fields.apply.one': 'Применить к {count} сделке',
  'widget.day-trade-fields.apply.few': 'Применить к {count} сделкам',
  'widget.day-trade-fields.apply.many': 'Применить к {count} сделкам',
  'widget.day-trade-fields.apply.other': 'Применить к {count} сделкам',
  'widget.day-trade-fields.add-field': 'Добавить поле',
  'widget.day-trade-fields.empty':
    'Задайте поле один раз, и оно применится ко всем сделкам этого дня, включая последующие.',
  'widget.day-trade-fields.invalid-context':
    "Виджет «Поля сделок дня» требует заметку DRC (frontmatter type: 'drc')",
  'widget.day-trade-fields.notice-updated.one': 'Обновлено сделок: {count}',
  'widget.day-trade-fields.notice-updated.few': 'Обновлено сделок: {count}',
  'widget.day-trade-fields.notice-updated.many': 'Обновлено сделок: {count}',
  'widget.day-trade-fields.notice-updated.other': 'Обновлено сделок: {count}',
  'widget.day-trade-fields.notice-failed.one':
    'Не удалось обновить сделок: {count}',
  'widget.day-trade-fields.notice-failed.few':
    'Не удалось обновить сделок: {count}',
  'widget.day-trade-fields.notice-failed.many':
    'Не удалось обновить сделок: {count}',
  'widget.day-trade-fields.notice-failed.other':
    'Не удалось обновить сделок: {count}',
  'widget.day-trade-fields.notice-save-failed': 'Не удалось сохранить поле дня',
  'widget.day-trade-fields.notice-conflict':
    'Поля сделок дня изменены в другом окне. Проверьте их и примените снова.',
  'widget.day-trade-fields.retry': 'Повторить',
  'widget.session-mistakes.invalid-context':
    'Виджет Ошибки сессии требует заметку DRC (тип: drc)',

  
  'widget.key-levels.name': 'Ключевые уровни',
  'widget.key-levels.description': 'Важные ценовые уровни для наблюдения',
  'widget.key-levels.title': 'Ключевые уровни',
  'widget.key-levels.support': 'Поддержка',
  'widget.key-levels.resistance': 'Сопротивление',
  'widget.key-levels.no-levels': 'Уровни не определены',
  'widget.key-levels.price-placeholder': 'Цена...',
  'widget.key-levels.select-importance': 'Выберите важность',
  'widget.key-levels.remove-level': 'Удалить уровень',
  'widget.key-levels.invalid-context':
    'Виджет Key Levels требует заметку DRC, еженедельного или ежемесячного обзора',
  'widget.key-levels.source.weekly': 'Еженедельно',
  'widget.key-levels.source.monthly': 'Ежемесячно',
  'widget.key-levels.open-source-review': 'Открыть обзор {label}',
  'widget.key-levels.importance.none': 'Нет',
  'widget.key-levels.importance.high': 'Высокая',
  'widget.key-levels.importance.medium': 'Средняя',
  'widget.key-levels.importance.low': 'Низкая',

  
  'widget.key-events.name': 'Ключевые события',
  'widget.key-events.description': 'Важные события в течение периода',
  'widget.key-events.title': 'Ключевые события',
  'widget.key-events.tooltip':
    'Ключевые события сохраняются в еженедельном обзоре и могут быть добавлены или отредактированы здесь, в DRC.',
  'widget.key-events.placeholder': 'Выберите или создайте событие',
  'widget.key-events.color-label': 'Цвет:',
  'widget.key-events.color-aria': 'Выберите цвет {color}',
  'widget.key-events.day-label': 'День:',
  'widget.key-events.currency-label': 'Валюта:',
  'widget.key-events.time-label': 'Время:',
  'widget.key-events.field-unset': 'Не задано',
  'widget.key-events.notes-placeholder':
    'Заметки об этом событии (опционально)',
  'widget.key-events.notes-label': 'Заметки',
  'widget.key-events.default-notes-tooltip':
    'Заметки по умолчанию настраиваются в Настройки → Настройка → События. При выборе события здесь сохраненные заметки по умолчанию будут подставлены автоматически.',
  'widget.key-events.add-button': 'Добавить событие',
  'widget.key-events.today': 'Сегодня',
  'widget.key-events.day-picker-label': 'День',
  'widget.key-events.show-all-days': 'Показать всю неделю',
  'widget.key-events.show-one-day': 'Показать один день',
  'widget.key-events.event-count.one': '{count} событие',
  'widget.key-events.event-count.few': '{count} события',
  'widget.key-events.event-count.many': '{count} событий',
  'widget.key-events.event-count.other': '{count} событий',
  'widget.key-events.empty-state': 'Нет ключевых событий на сегодня',
  'widget.key-events.empty-state-sub': 'Добавьте события в недельный обзор',
  'widget.key-events.open-calendar-aria': 'Открыть экономический календарь',
  'widget.key-events.restore-auto-import':
    'Восстановить автоимпортированные события',
  'widget.key-events.restore-missing-events':
    'Восстановить пропущенные события ({count})',

  
  'widget.missed-trades.name': 'Пропущенные сделки',
  'widget.missed-trades.description':
    'Сделки, которые вы определили, но не совершили',
  'widget.missed-trades.title': 'Упущенные сделки',
  'widget.missed-trades.add-button': 'Добавить',
  'widget.missed-trades.add-aria': 'Добавить упущенную сделку',

  'widget.missed-trades.additional-setups': 'Дополнительные сетапы:',
  'widget.missed-trades.no-trades-today': 'Сегодня нет',
  'widget.missed-trades.no-trades-week': 'Нет упущенных сделок на неделе',
  'widget.missed-trades.invalid-context':
    'Доступно только в DRC и еженедельном обзоре.',
  'widget.missed-trades.error-no-date': 'Не удается определить дату сделки',
  'widget.missed-trades.error-open-form': 'Ошибка при открытии формы',
  'widget.backtest-trades.empty': 'Нет бэктест-сделок за этот период',

  
  'widget.images.name': 'Графики и медиа',
  'widget.images.description': 'Карусель медиа с поддержкой загрузки',
  'widget.images.invalid-context':
    'Виджет изображений требует примечания анализа (тип: drc, weekly-review, monthly-review, quarterly-review или yearly-review)',
  'widget.images.alt-prefix': 'Медиа обзора',
  'widget.images.open-fullscreen': 'Открыть медиа {index} во весь экран',
  'widget.images.delete': 'Удалить медиа',
  'widget.images.empty': 'Нет медиа',
  'widget.images.placeholder': 'Вставьте URL или путь к медиафайлу...',
  'widget.images.placeholder-add-more': 'Добавьте больше медиа...',

  
  'widget.mark-reviewed.name': 'Отметить как проанализировано',
  'widget.mark-reviewed.description':
    'Баннер для отметки анализа как завершенного с меткой времени',
  'widget.mark-reviewed.status.reviewed': 'ПРОАНАЛИЗИРОВАНО',
  'widget.mark-reviewed.status.pending': 'ОЖИДАЕТ АНАЛИЗА',
  'widget.mark-reviewed.button.undo': 'Отменить',
  'widget.mark-reviewed.button.mark': 'Отметить как проанализировано',

  
  'widget.pnl-chart.name': 'Кривая капитала',
  'widget.pnl-chart.description': 'Совокупная прибыль/убыток во времени',
  'widget.drawdown-chart.name': 'Просадка',
  'widget.drawdown-chart.description':
    'Сумма просадки по закрытым сделкам от предыдущего максимума реализованного P&L',
  'widget.directional-pnl.name': 'P&L по направлениям',
  'widget.directional-pnl.description': 'Сравнение результатов лонг и шорт',
  'widget.directional-pnl.title.long': 'P&L лонг-сделок',
  'widget.directional-pnl.title.short': 'P&L шорт-сделок',
  'widget.directional-pnl.empty.not-enough': 'Недостаточно сделок для анализа',
  'widget.directional-pnl.empty.no-closed': 'Нет закрытых сделок за период',
  'widget.directional-pnl.empty.no-long': 'Нет длинных позиций за период',
  'widget.directional-pnl.empty.no-short': 'Нет коротких позиций за период',
  'widget.trades-chart.name': 'P&L сделок',
  'widget.trades-chart.description': 'P&L столбец для каждой отдельной сделки',
  'widget.trades-chart-daily.name': 'Ежедневный P&L',
  'widget.trades-chart-daily.description': 'P&L агрегирован по дням',
  'widget.trades-chart-weekly.name': 'Еженедельный P&L',
  'widget.trades-chart-weekly.description': 'P&L агрегирован по неделям',
  'widget.trades-chart-monthly.name': 'Ежемесячный P&L',
  'widget.trades-chart-monthly.description': 'P&L агрегирован по месяцам',
  'widget.trades-chart-quarterly.name': 'Ежеквартальный P&L',
  'widget.trades-chart-quarterly.description': 'P&L агрегирован по кварталам',

  
  'widget.stats.name': 'Сетка статистики',
  'widget.stats.description':
    'Ключевые метрики производительности в формате сетки',
  'widget.stats.no-trades': 'Нет закрытых сделок за этот период',
  'widget.stats.net-pnl': 'Чистый P&L',
  'widget.stats.win-rate': 'Процент побед',
  'widget.stats.profit-factor': 'Коэффициент прибыльности',
  'widget.stats.expectancy': 'Математическое ожидание',
  'widget.stats.total-trades': 'Всего сделок',
  'widget.stats.avg-win': 'Средняя прибыль',
  'widget.stats.avg-loss': 'Средний убыток',
  'widget.stats.pl-ratio': 'Соотношение прибыли/убытка',
  'widget.account-breakdown.name': 'Разбивка по счетам',
  'widget.account-breakdown.description':
    'Сравните результаты счетов за этот период анализа',

  
  'widget.account-breakdown.empty': 'Нет закрытых сделок за этот период',
  'widget.account-breakdown.column.account': 'Счёт',
  'widget.account-breakdown.column.trades': 'Сделки',
  'widget.account-breakdown.column.pnl': 'Чистый P&L',
  'widget.account-breakdown.column.win-rate': 'Винрейт',
  'widget.account-breakdown.column.profit-factor': 'Профит-фактор',
  'widget.tag-performance.name': 'Результативность тегов',
  'widget.tag-performance.description': 'Разбивка результатов по тегам сделок',
  'widget.setup-performance.name': 'Результативность сетапа',
  'widget.setup-performance.description':
    'Разбор результативности по торговым сетапам',

  
  'widget.best-worst-trades.name': 'Лучшие/Худшие сделки',
  'widget.best-worst-trades.description': 'Топ прибыльных и убыточных сделок',
  'widget.best-worst.best-trade': 'Лучшая сделка',
  'widget.best-worst.worst-trade': 'Худшая сделка',
  'widget.best-worst.no-win-trades': 'Нет прибыльных сделок',
  'widget.best-worst.no-loss-trades': 'Нет проигрышных сделок',
  'widget.best-worst.best-month': 'Лучший месяц',
  'widget.best-worst.worst-month': 'Худший месяц',
  'widget.best-worst.no-profitable-months': 'Нет прибыльных месяцев',
  'widget.best-worst.no-losing-months': 'Нет убыточных месяцев',
  'widget.best-worst.n-trades': '{count} сделок',
  'widget.best-worst.win-rate': '{rate}% процент побед',

  
  'widget.best-worst-days.name': 'Лучшие/Худшие дни',
  'widget.best-worst-days.description':
    'Дни с наивысшей и наинизшей прибылью/убытком',
  'widget.best-worst-days.best-day': 'Лучший день',
  'widget.best-worst-days.worst-day': 'Худший день',
  'widget.best-worst-days.no-profitable-days': 'Нет прибыльных дней',
  'widget.best-worst-days.no-losing-days': 'Нет убыточных дней',
  'widget.best-worst-days.win-rate': '{rate}% процент побед',
  'widget.best-worst-days.invalid-context':
    'Этот виджет доступен только в еженедельных и ежемесячных обзорах',

  
  'widget.best-worst-weeks.name': 'Лучшие/Худшие недели',
  'widget.best-worst-weeks.description':
    'Недели с наивысшей и наинизшей прибылью/убытком',
  'widget.best-worst-weeks.best-week': 'Лучшая неделя',
  'widget.best-worst-weeks.worst-week': 'Худшая неделя',
  'widget.best-worst-weeks.no-profitable': 'Нет прибыльных недель',
  'widget.best-worst-weeks.no-losing': 'Нет убыточных недель',
  'widget.best-worst-weeks.week-name': 'Неделя {number} ({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} сделок',
  'widget.best-worst-weeks.win-rate': '{percent}% процент побед',
  'widget.best-worst-weeks.invalid-context':
    'Этот виджет доступен только в еженедельных, ежемесячных, ежеквартальных и годовых обзорах',

  
  'widget.best-worst-months.name': 'Лучшие/Худшие месяцы',
  'widget.best-worst-months.description':
    'Месяцы с наивысшей и наинизшей прибылью/убытком',
  'widget.best-worst-months.invalid-context':
    'Этот виджет доступен только в ежеквартальных и годовых обзорах',

  
  'widget.best-worst-quarters.name': 'Лучшие/Худшие кварталы',
  'widget.best-worst-quarters.description':
    'Максимальные и минимальные кварталы по P&L',
  'widget.best-worst-quarters.best-quarter': 'Лучший квартал',
  'widget.best-worst-quarters.worst-quarter': 'Худший квартал',
  'widget.best-worst-quarters.no-profitable': 'Нет прибыльных кварталов',
  'widget.best-worst-quarters.no-losing': 'Нет убыточных кварталов',
  'widget.best-worst-quarters.trade-count': '{count} сделок',
  'widget.best-worst-quarters.win-rate': '{percent}% процент побед',
  'widget.best-worst-quarters.invalid-context':
    'Этот виджет доступен только в годовых обзорах',

  
  'widget.position-size.title': 'Размер позиции',
  'widget.position-size.save-defaults': 'Сохранить как стандартное',
  'widget.position-size.reset-defaults': 'Сбросить на стандартные',
  'widget.position-size.stock-crypto': 'Акции/Крипто',
  'widget.position-size.futures': 'Фьючерсы',
  'widget.position-size.forex': 'Форекс',
  'widget.position-size.account-balance': 'Баланс счёта',
  'widget.position-size.risk-percent': 'Риск %',
  'widget.position-size.entry-price': 'Цена входа',
  'widget.position-size.profit-target-optional': 'Цель прибыли (опционально)',
  'widget.position-size.currency-pair': 'Валютная пара',
  'widget.position-size.stop-loss-pips': 'Stop Loss (пипсы)',
  'widget.position-size.target-pips-optional': 'Цель (пипсы, опционально)',
  'widget.position-size.placeholder.example': 'например: {value}',
  'widget.position-size.enter-values': 'введите значения',
  'widget.position-size.risk': 'Риск',
  'widget.position-size.reward': 'Потенциальная прибыль',
  'widget.position-size.stop': 'стоп',
  'widget.position-size.pts': 'пт',
  'widget.position-size.mini': 'мини',
  'widget.position-size.pip-value-info':
    'Стоимость пипса: ${value} (стандартный лот) | Размер пипса: {size}',
  'widget.position-size.futures-info': '${dollar}/пт | Тик: {size} = ${value}',
  'widget.position-size.investment-dollar': 'Инвестиция ($)',
  'widget.position-size.investment': 'Инвестиция',

  
  'widget.technical-game.name': 'Техническая игра',
  'widget.technical-game.description':
    'Еженедельное распределение технических оценок из DRC',
  'widget.mental-game.name': 'Ментальная игра',
  'widget.mental-game.description':
    'Еженедельное распределение психологических оценок из DRC',

  
  'widget.demon-tracker.name': 'Трекер ошибок',
  'widget.demon-tracker.description':
    'Отслеживание повторяющихся ошибок в торговле',
  'widget.demon-tracker.column.demon': 'ДЕМОН',
  'widget.demon-tracker.column.occurrences': 'СЛУЧАЕВ',
  'widget.demon-tracker.column.stop-trading': 'СТОП ТОРГОВЛЯ',
  'widget.demon-tracker.period.this-week': 'на этой неделе',
  'widget.demon-tracker.period.this-month': 'в этом месяце',
  'widget.demon-tracker.period.this-quarter': 'в этом квартале',
  'widget.demon-tracker.period.this-year': 'в этом году',
  'widget.demon-tracker.empty.title': 'Ошибок не зафиксировано {period}',
  'widget.demon-tracker.empty.description':
    'Ошибки, отмеченные в ваших сделках, появятся здесь для выявления паттернов',
  'widget.demon-tracker.summary.unique': 'Уникальных ошибок:',
  'widget.demon-tracker.summary.total': 'Всего случаев:',
  'widget.demon-tracker.summary.critical': 'Критические ({threshold}+):',

  
  'widget.trading-score.title': 'Торговый рейтинг',
  'widget.trading-score.no-data': 'Нет данных сделок',
  'widget.trading-score.breakdown-title': 'Разбор рейтинга',
  'widget.trading-score.close-breakdown': 'Закрыть разбор',
  'widget.trading-score.of-weeks': 'из {count}',
  'widget.trading-score.start-trading':
    'Начните торговать, чтобы разблокировать свой рейтинг',
  'widget.trading-score.one-week-down': '1 неделя пройдена, продолжайте!',
  'widget.trading-score.collect-more-data':
    'Соберите немного больше данных для разблокировки рейтинга',
  'widget.trading-score.trades-count': '{count} сделок',
  'widget.trading-score.weight': 'Вес: {weight}%',
  'widget.trading-score.weeks-suffix': '· {weeks}н',
  'widget.trading-score.axis-aria': '{axis}: {score} очков, вес {weight}%',
  'widget.trading-score.phase.insufficient': 'Недостаточно данных',
  'widget.trading-score.phase.developing': 'Развивается',
  'widget.trading-score.phase.established': 'Установлено',
  'widget.trading-score.axis.profitability': 'Прибыльность',
  'widget.trading-score.axis.riskManagement': 'Управление рисками',
  'widget.trading-score.axis.execution': 'Исполнение',
  'widget.trading-score.axis.consistency': 'Консистентность',
  'widget.trading-score.axis.returnConsistency': 'Консистентность доходов',
  'widget.trading-score.axis.experience': 'Опыт',
  'widget.trading-score.axis.profitability.desc':
    'Измеряет коэффициент прибыли и ожидаемую прибыль на сделку',
  'widget.trading-score.axis.riskManagement.desc':
    'Измеряет контроль максимальной просадки и способность восстановления',
  'widget.trading-score.axis.execution.desc':
    'Измеряет процент прибыльных сделок и соотношение средней прибыли к убытку',
  'widget.trading-score.axis.consistency.desc':
    'Измеряет стабильность доходов и контроль последовательности',
  'widget.trading-score.axis.returnConsistency.desc':
    'Измеряет однородность целевых прибылей и стоп-лоссов',
  'widget.trading-score.axis.experience.desc':
    'Измеряет количество активных недель торговли и их консистентность',

  
  'widget.trades.name': 'Сделки',
  'widget.trades.description': 'Список сделок с ключевыми деталями',
  'widget.trade-review.name': 'Разбор сделок',
  'widget.trade-review.description':
    'Разбирайте каждую сделку с изображениями, ключевыми данными и настраиваемыми вопросами',
  'widget.trade-review.status.reviewed': 'Проверено',
  'widget.trade-review.status.pending': 'Ждет проверки',
  'widget.trade-review.no-image': 'Нет изображения сделки',
  'widget.trade-review.open-trade-note': 'Открыть заметку',

  'widget.trade-review.loading': 'Загрузка разборов...',
  'widget.trade-review.no-trades': 'Нет сделок для разбора.',
  'widget.trade-review.time.open': 'Открыта',
  'widget.trade-review.fallback-title': 'Сделка {index}',
  'widget.trade-review.question.win-what-worked': 'Что сработало?',
  'widget.trade-review.placeholder.win-what-worked':
    'Что вы хорошо сделали в этой сделке?',
  'widget.trade-review.question.win-repeatable': 'Это можно повторить?',
  'widget.trade-review.placeholder.win-repeatable':
    'Что сделало эту сделку повторяемой?',
  'widget.trade-review.question.key-lesson': 'Ключевой урок',
  'widget.trade-review.placeholder.key-lesson':
    'Что стоит запомнить из этой сделки?',
  'widget.trade-review.question.loss-what-went-wrong': 'Что пошло не так?',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    'Что привело к этому убытку?',
  'widget.trade-review.question.loss-valid-or-mistake':
    'Это был допустимый убыток или ошибка исполнения?',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    'Опиши, был ли процесс верным или ошибку можно было избежать.',
  'widget.trade-review.question.loss-avoid-next-time':
    'Чего я избегу в следующий раз?',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    'Какое конкретное поведение нужно изменить?',
  'widget.trade-review.question.be-managed-correctly':
    'Сделка была правильно сопровождена?',
  'widget.trade-review.placeholder.be-managed-correctly':
    'Управление соответствовало твоему плану?',
  'widget.trade-review.image-alt-prefix': 'Изображение разбора сделки',
  'widget.trade-review.placeholder.default': 'Запиши свои мысли...',

  'widget.trade-review.field.entry': 'Вход',
  'widget.trade-review.field.exit': 'Выход',
  'widget.trade-review.field.duration': 'Длительность',
  'widget.trade-review.field.risk': 'Риск',
  'widget.trade-review.field.account': 'Счет',
  'widget.trade-review.field.setup': 'Сетап',
  'widget.trade-review.field.mistakes': 'Ошибки',
  'widget.trade-review.field.tags': 'Теги',
  'widget.trade-review.more-context': 'Больше контекста',
  'widget.trade-review.field.position-size': 'Размер позиции',
  'widget.trade-review.field.stop-loss': 'Стоп-лосс',
  'widget.trade-review.field.take-profit': 'Тейк-профит',
  'widget.trade-review.field.fees': 'Сборы',
  'widget.trade-review.field.commission': 'Комиссия',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': 'Тезис',
  'widget.trade-review.field.notes': 'Заметки',
  'widget.trade-review.field.custom-fields': 'Пользовательские поля',
  'widget.backtest-trades.name': 'Бэктест-сделки',
  'widget.backtest-trades.description':
    'Список бэктест-сделок за этот период обзора',
  'widget.breakdown-daily.name': 'Ежедневный отчет',
  'widget.breakdown-daily.description': 'Таблица производительности по дням',
  'widget.breakdown-weekly.name': 'Еженедельный отчет',
  'widget.breakdown-weekly.description':
    'Таблица производительности по неделям',
  'widget.breakdown-monthly.name': 'Ежемесячный отчет',
  'widget.breakdown-monthly.description':
    'Таблица производительности по месяцам',
  'widget.breakdown-quarterly.name': 'Ежеквартальный отчет',
  'widget.breakdown-quarterly.description':
    'Таблица производительности по кварталам',
  'widget.breakdown.empty.days-week': 'На этой неделе нет торговых дней',
  'widget.breakdown.empty.weeks-month': 'В этом месяце нет торговых недель',
  'widget.breakdown.empty.months-quarter':
    'В этом квартале нет торговых месяцев',
  'widget.breakdown.empty.quarters-year': 'В этом году нет торговых кварталов',

  
  'widget.table.header.date': 'Дата',
  'widget.table.header.week': 'Неделя',
  'widget.table.header.month': 'Месяц',
  'widget.table.header.quarter': 'Квартал',

  'widget.table.header.trades': 'Сделки',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Винрейт',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.tag': 'Тег',
  'widget.table.header.setup': 'Сетап',
  'widget.table.header.a-games': 'A-игры',
  'widget.table.header.b-games': 'B-игры',
  'widget.table.header.c-games': 'C-игры',
  'widget.table.header.rating': 'Рейтинг',
  'widget.table.header.avg-rating': 'Средний рейтинг',

  
  'widget.markdown-zone.name': 'Зона Markdown',
  'widget.markdown-zone.description':
    'Область для произвольного содержимого Markdown',
  'widget.markdown-header.name': 'Заголовок раздела',
  'widget.markdown-header.description':
    'Заголовок Markdown (H1-H6) с пользовательским текстом',

  
  'widget.trade-table.column.images': 'Изображения',
  'widget.trade-table.column.date': 'Дата',
  'widget.trade-table.column.entry': 'Вход',
  'widget.trade-table.column.ticker': 'Тикер',
  'widget.trade-table.column.account': 'Счёт',
  'widget.trade-table.column.pnl': 'P&L',
  'widget.trade-table.column.direction': 'Направление',
  'widget.trade-table.column.setups': 'Сетапы',
  'widget.trade-table.column.mistakes': 'Ошибки',
  'widget.trade-table.empty': 'Нет сделок за период',
  'widget.trade-table.status.open': 'ОТКРЫТО',
  'widget.trade-table.na': 'Н/Д',
  'widget.trade-table.unknown': 'Неизвестно',

  'widget.trade-table.image-alt': 'Сделка {id} предпросмотр',
  'widget.trade-table.fullscreen-title': 'Сделка {id}',
  'widget.trade-table.fullscreen-alt': 'Сделка {id} {index}',
  'widget.trade-table.duration.days-hours': '{days}д {hours}ч',
  'widget.trade-table.duration.hours-mins': '{hours}ч {mins}м',
  'widget.trade-table.duration.mins': '{mins}м',
  'widget.trade-table.pagination.showing': 'Показано {start}-{end} из {total}',
  'widget.trade-table.pagination.prev': '← Назад',
  'widget.trade-table.pagination.next': 'Далее →',
  'widget.trade-table.pagination.page': 'Страница {current} из {total}',

  
  'widget.pagination.showing': 'Показано {start}-{end} из {total} {items}',
  'widget.pagination.prev': 'Назад',
  'widget.pagination.next': 'Далее',
  'widget.pagination.page': 'Страница {current} из {total}',

  
  'widget.empty.no-data': 'Данные недоступны',
  'widget.empty.no-trades': 'Нет сделок за период',
  'widget.empty.no-closed-trades': 'Нет закрытых сделок за этот период',
  'widget.empty.no-daily-data': 'Нет дневных данных за этот период',
  'widget.empty.no-weekly-data': 'Нет недельных данных за этот период',
  'widget.empty.no-monthly-data': 'Нет ежемесячных данных за этот период',
  'widget.empty.no-quarterly-data': 'Нет квартальных данных за этот период',
  'widget.empty.no-tag-data': 'Нет данных по тегам за этот период',
  'widget.empty.no-setup-data': 'Нет данных по сетапам за этот период',
  'widget.empty.no-mental-game-data':
    'Нет данных психологического анализа за {period}',
  'widget.empty.no-technical-game-data':
    'Нет данных технического анализа за {period}',

  
  'widget.invalid-context.title': 'Неверный контекст',
  'widget.invalid-context.default':
    'Этот виджет {widgetType} требует заметку обзора или сделки',
  'widget.invalid-context.monthly-quarterly-yearly':
    'Этот виджет доступен только в ежемесячных, квартальных и годовых обзорах',
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    'Этот виджет доступен только в еженедельных, ежемесячных, квартальных и годовых обзорах',
  'widget.invalid-context.quarterly-yearly':
    'Этот виджет доступен только в квартальных и годовых обзорах',
  'widget.invalid-context.yearly-only':
    'Этот виджет доступен только в годовых обзорах',
  'widget.invalid-context.monthly-only':
    'Этот виджет доступен только в ежемесячных обзорах',
  'widget.invalid-context.weekly-monthly':
    'Этот виджет доступен только в недельных и ежемесячных обзорах',
  'widget.invalid-context.review-note':
    'Этот виджет требует заметку DRC, Weekly Review, Monthly Review, Quarterly Review или Yearly Review',

  
  'metric.expectancyGap.name': 'Разрыв матожидания',
  'metric.expectancyGap.description': 'Фактический и ожидаемый R на сделку.',
  'expectancy-gap.expected': 'Ожидаемое (R/сделку)',
  'expectancy-gap.realized': 'Фактическое (R/сделку)',
  'expectancy-gap.sample':
    'У {included} из {total} закрытых сделок есть пригодный чистый R.',
  'expectancy-gap.method-title': 'Как это рассчитывается',
  'expectancy-gap.method':
    'Разрыв = фактическое − ожидаемое. Фактическое — средний чистый R полностью закрытых реальных сделок, включая безубыточные. Открытые, пропущенные и тестовые сделки исключены. Отсутствующие данные прибыли или риска исключаются, а не считаются нулём. Используется записанный R или риск сделки, но не текущий риск по умолчанию. Фильтры даты выхода учитывают сделку один раз при окончательном закрытии. Используйте независимую модель или исторический ориентир с сопоставимыми затратами. Отрицательный разрыв означает отставание, но не доказывает плохое исполнение. Очистите поле для удаления ориентира.',
  'expectancy-gap.invalid':
    'Введите конечное число или оставьте поле пустым для очистки.',
  'expectancy-gap.save-failed':
    'Не удалось сохранить ориентир. Повторите попытку.',
  'widget.pnlChart.name': 'Совокупный P&L',
  'widget.pnlChart.description': 'Накопленный P&L во времени',

  'widget.longPnLChart.name': 'P&L лонгов',
  'widget.longPnLChart.description': 'Совокупный P&L закрытых лонгов',
  'widget.shortPnLChart.name': 'P&L шортов',
  'widget.shortPnLChart.description': 'Совокупный P&L закрытых шортов',
  'widget.performanceCalendar.name': 'Календарь производительности',
  'widget.performanceCalendar.description': 'Календарь вашего дневного P&L',

  'widget.dailyPerformance.name': 'Дневная производительность',
  'widget.dailyPerformance.description': 'P&L за каждый торговый день',

  'widget.tradesChart.name': 'График сделок',
  'widget.tradesChart.description': 'P&L по каждой сделке',

  'widget.weekdayPerformance.name': 'Производительность по дням недели',
  'widget.weekdayPerformance.description': 'P&L по дням недели',

  'widget.hourlyPerformance.name': 'Производительность по часам',
  'widget.hourlyPerformance.description': 'P&L по часам дня',

  'widget.tickerPerformance.name': 'Производительность по тикерам',
  'widget.tickerPerformance.description': 'Рейтинг эффективности по тикерам',
  'widget.tradesChart.limit': '{count} сделок',
  'widget.drawdownChart.name': 'График просадки',
  'widget.drawdownChart.description': 'Падение от прошлого максимума P&L',

  'widget.recentTrades.name': 'Недавние сделки',
  'widget.recentTrades.description':
    'Показывает 10 последних сделок с деталями',
  'widget.recentTrades.date': 'Дата',
  'widget.recentTrades.ticker': 'Тикер',
  'widget.recentTrades.direction': 'Направление',
  'widget.recentTrades.pnl': 'P&L',
  'widget.recentTrades.no-trades': 'Сделки не найдены',
  'widget.recentTrades.empty-submessage':
    'Попробуйте выбрать другой диапазон дат',
  'widget.recentTrades.unknown': 'Неизвестно',
  'widget.rollingWinRate.name': 'Скользящее соотношение прибыльных/убыточных',
  'widget.rollingWinRate.description': 'Соотношение средней прибыли и убытка',

  'widget.rollingStats.name': 'Скользящее среднее прибыль/убыток',
  'widget.rollingStats.description':
    'Средняя прибыль и убыток последних сделок',

  
  
  
  'account.header.back-to-dashboard': 'Назад к панели',
  'account.header.add-event.aria': 'Добавить депозит/вывод средств',
  'account.header.edit-account.aria': 'Редактировать счёт',
  'account.header.view-trades.aria': 'Посмотреть сделки в журнале сделок',
  'account.header.type': 'Тип:',
  'account.header.initial-balance': 'Начальный баланс:',
  'account.header.account-id': 'ID счёта:',
  'account.header.warning.trades-before-phase.one':
    '{count} сделка датирована раньше начала Фазы 1',
  'account.header.warning.trades-before-phase.few':
    '{count} сделки датированы раньше начала Фазы 1',
  'account.header.warning.trades-before-phase.many':
    '{count} сделок датировано раньше начала Фазы 1',
  'account.header.warning.trades-before-phase.other':
    '{count} сделок датировано раньше начала Фазы 1',
  'account.header.warning.earliest-trade-phase':
    'Первая сделка: {date}. Сделки до начала фазы не учитываются в челлендже.',
  'account.header.notice.phase-start-updated':
    'Начало Фазы 1 перенесено на {date}',
  'account.header.warning.earliest-trade':
    'Первая сделка: {date}. Это может вызвать неправильные расчёты баланса.',
  'account.header.warning.fix-phase-start.aria': 'Исправить начало Фазы 1',
  'account.header.warning.fix-date.aria': 'Исправить дату создания счёта',
  'account.header.warning.fixing': 'Исправление...',
  'account.header.warning.fix-date': 'Исправить дату',
  'account.header.notice.date-updated':
    'Дата создания счёта обновлена на {date}',
  'account.header.notice.update-failed-log':
    'Не удалось обновить дату создания счёта:',
  'account.header.notice.update-failed': 'Не удалось обновить дату: {error}',

  
  
  
  'account.settings.modal.title': 'Настройки панели управления счётами',
  'account.settings.notice.name-empty':
    'Название типа счёта не может быть пустым',
  'account.settings.notice.type-exists': 'Тип счёта "{name}" уже существует',
  'account.settings.notice.reserved-name':
    '"{name}" — зарезервированное название типа счёта',
  'account.settings.notice.type-added': 'Тип счёта "{name}" успешно добавлен',
  'account.settings.notice.add-error':
    'Ошибка при добавлении типа счёта: {error}',
  'account.settings.notice.cannot-delete-archived':
    'Невозможно удалить тип счёта "Архивированный" — он зарезервирован для архивирования счётов',
  'account.settings.notice.analyze-error':
    'Ошибка при анализе использования типа счёта',
  'account.settings.notice.cannot-delete-has-accounts':
    'Невозможно удалить "{name}" — с ним связано {count} счётов. Функция миграции появится скоро.',
  'account.settings.notice.saved':
    'Настройки панели управления счётами успешно сохранены',
  'account.settings.notice.save-error':
    'Ошибка при сохранении настроек: {error}',
  'account.settings.notice.migration-target-required':
    'Пожалуйста, выберите целевой тип счёта для переназначения',
  'account.settings.notice.migration-failed': 'Миграция не удалась: {error}',
  'account.settings.notice.type-deleted': 'Тип счёта "{name}" успешно удалён',
  'account.settings.notice.type-deleted-with-cleanup':
    'Тип счёта "{name}" успешно удалён (очищено: {actions})',
  'account.settings.notice.migration-error': 'Ошибка при миграции: {error}',
  'account.settings.notice.delete-error':
    'Ошибка при удалении типа счёта: {error}',
  'account.settings.notice.operation-failed': '{operation} не удалась: {error}',
  'account.settings.notice.migration-no-targets':
    'Невозможно перенести счёта — других типов счётов нет. Сначала создайте новый тип счёта.',
  'account.settings.notice.type-deleted-migrated':
    'Тип счёта "{name}" успешно удалён. {count} счётов {action}',
  'account.settings.operation.type-deletion': 'Удаление типа счёта',
  'account.settings.migration.error.target-required':
    'Для переназначения требуется целевой тип',
  'account.settings.migration.error.invalid-option':
    'Неверный вариант миграции',
  'account.settings.unnamed-account': 'Безымянный счёт',
  'account.settings.migration.title': 'Перенести счёта перед удалением',
  'account.settings.migration.warning':
    'Вы собираетесь удалить "{name}", который имеет {count} связанных счётов.',
  'account.settings.migration.instruction':
    'Эти счёта должны быть обработаны перед удалением типа счёта:',
  'account.settings.migration.more-accounts': '... и ещё {count}',
  'account.settings.migration.choose-option':
    'Выберите способ обработки этих счётов:',
  'account.settings.migration.option.reassign.title':
    'Переназначить на другой тип',
  'account.settings.migration.option.reassign.desc':
    'Перенести все счёта на другой тип счёта',
  'account.settings.migration.target-type.label': 'Целевой тип счёта:',
  'account.settings.migration.option.archive.title': 'Архивировать счёта',
  'account.settings.migration.option.archive.desc':
    'Перенести все счёта в статус "архивированный"',
  'account.settings.migration.option.delete.title': 'Отметить для удаления',
  'account.settings.migration.option.delete.desc':
    'Отметить все счёта как удалённые',
  'account.settings.migration.button.migrate': 'Перенести и удалить тип',
  'account.settings.migration.button.migrating': 'Перенос в процессе...',
  'account.settings.migration.action.reassigned': 'переназначены на "{target}"',
  'account.settings.migration.action.archived': 'перенесены в архив',
  'account.settings.migration.action.deleted': 'отмечены для удаления',
  'account.settings.delete.title': 'Удалить тип счёта',
  'account.settings.delete.confirm-question':
    'Вы уверены, что хотите удалить тип счёта "{name}"?',
  'account.settings.delete.impact-analysis': 'Анализ воздействия:',
  'account.settings.delete.affected-accounts': '⚠️ затронуто {count} счёт(ов):',
  'account.settings.delete.migration-notice':
    'Примечание: Эти счёта должны быть переназначены на другой тип счёта перед удалением.',
  'account.settings.delete.no-affected':
    '✅ Никакие счёта не используют этот тип счёта',
  'account.settings.delete.cleanup-title': 'Параметры, которые будут очищены:',
  'account.settings.delete.cleanup.excluded':
    '✓ Удалено из исключённых типов счётов',
  'account.settings.delete.cleanup.order': '✓ Удалено из порядка отображения',
  'account.settings.delete.cleanup.withdrawals':
    '✓ Удалено из параметров вывода средств',
  'account.settings.delete.cleanup.none': 'Очистка параметров не требуется',
  'account.settings.delete.button.setup-migration': 'Настроить миграцию',
  'account.settings.delete.button.delete': 'Удалить тип счёта',
  'account.settings.delete.button.deleting': 'Удаление...',
  'account.settings.section.available-types.title': 'Доступные типы счётов',
  'account.settings.section.available-types.desc':
    'Текущие типы счётов в вашей системе.',
  'account.settings.section.available-types.placeholder':
    'Введите название типа счёта...',
  'account.settings.section.available-types.add-aria':
    'Добавить новый тип счёта',
  'account.settings.section.available-types.delete-aria': 'Удалить {name}',
  'account.settings.section.available-types.empty':
    'Нет пользовательских типов счётов.',
  'account.settings.section.challenge-stages.title': 'Этапы челленджа',
  'account.settings.section.challenge-stages.desc':
    'Тип счёта, применяемый когда челлендж достигает этого этапа.',
  'account.settings.section.challenge-stages.no-change': 'Без изменений',
  'account.settings.section.challenge-stages.aria': 'Тип счёта для {stage}',
  'account.settings.section.inclusion.title': 'Типы счетов на панели',
  'account.settings.section.inclusion.desc':
    'Выберите, какие типы счетов отображаются в статистике панели, учитываются ли выводы и в каком порядке они показываются.',
  'account.settings.section.inclusion.include-dashboard': 'В статистике панели',
  'account.settings.section.inclusion.include-withdrawals': 'Выводы средств',
  'account.settings.section.inclusion.empty':
    'Нет доступных типов счётов для настройки.',

  'account.settings.section.order.move-up': 'Переместить вверх',
  'account.settings.section.order.move-down': 'Переместить вниз',
  'account.settings.button.save': 'Сохранить параметры',
  'account.settings.button.saving': 'Сохранение...',

  
  
  
  'account.type.demo': 'Демо',
  'account.type.evaluation': 'Оценочный',
  'account.type.funded': 'Финансируемый',
  'account.type.archived': 'Архивный',

  
  
  
  'account-page.error.title': 'Ошибка загрузки счёта',
  'account-page.error.not-found':
    'Не удалось найти данные счёта для "{accountName}"',
  'account-page.error.not-found-sub':
    'Пожалуйста, проверьте, существует ли счёт, или попробуйте обновить страницу.',

  'account-page.guide.empty.intro.title':
    'На этой странице — один счёт во всех подробностях',
  'account-page.guide.empty.intro.description':
    'Страница счёта позволяет управлять одним счётом, записывать его события и открывать отфильтрованный журнал сделок, когда нужно разобрать сделки.',
  'account-page.guide.empty.edit-account.title':
    '«Изменить счёт» открывает все настройки счёта',
  'account-page.guide.empty.edit-account.description':
    'Используйте эту кнопку, чтобы изменить название счёта, тип, валюту, правила просадки, цель по прибыли, ежемесячную стоимость и многое другое.',
  'account-page.guide.empty.add-event.title':
    '«Добавить событие» записывает пополнения и выводы',
  'account-page.guide.empty.add-event.description':
    'Используйте эту кнопку каждый раз, когда деньги поступают на счёт или списываются с него вне обычных сделок.',
  'account-page.guide.empty.transactions.title':
    'Здесь отслеживается движение средств',
  'account-page.guide.empty.transactions.description':
    'В этом разделе построчно хранятся ручные пополнения и выводы; на счёте проп-челленджа они отображаются как выплаты. Если раздел пуст, создайте первую запись кнопкой «Добавить событие».',
  'account-page.guide.empty.trade-log.title':
    'Откройте этот счёт в журнале сделок',
  'account-page.guide.empty.trade-log.description':
    'Эта кнопка в заголовке открывает журнал сделок с уже выбранным счётом, чтобы разбор сделок оставался в отдельном представлении журнала.',
  'account-page.guide.main.intro.title':
    'Эта страница — подробная сводка по счёту',
  'account-page.guide.main.intro.description':
    'Страница счёта помогает чётко понять один счёт: историю баланса, результаты, лимиты риска и движение средств.',
  'account-page.guide.main.balance-chart.title':
    'График баланса показывает больше, чем баланс',
  'account-page.guide.main.balance-chart.description':
    'График показывает счёт во времени, включая пополнения и выводы, а также заданные для счёта уровни просадки и цели по прибыли.',
  'account-page.guide.main.metrics.title': 'Результаты только этого счёта',
  'account-page.guide.main.metrics.description':
    'Баланс, P&L, винрейт и все расходы только по этому счёту. Для проп-счетов вместо чистого денежного потока показаны выплаты.',
  'account-page.guide.main.risk.title':
    'Прогресс по риску отслеживается здесь отдельно',
  'account-page.guide.main.risk.description':
    'Сколько лимита просадки уже использовано и насколько вы близки к цели по прибыли.',
  'account-page.guide.main.transactions.title':
    'Движение средств вынесено в отдельный раздел',
  'account-page.guide.main.transactions.description':
    'Пополнения и выводы с балансом после каждой операции — отдельно от торговых результатов. У проп-счетов здесь перечислены выплаты.',
  'account.monthly-returns.title': 'Месячная доходность',
  'account.monthly-returns.total': 'Итого',
  'account.monthly-returns.view-trades': 'Сделки за {period}',
  'account.monthly-returns.unconverted':
    'Не учтены: счета в {currencies} (нет обменного курса).',
  'account.monthly-returns.empty': 'Месячной доходности пока нет.',
  'account.monthly-returns.empty-sub':
    'Она появится, когда на счёте будут средства и закроется сделка.',
  'account.monthly-returns.error': 'Не удалось загрузить месячную доходность.',
  'account-page.guide.main.monthly-returns.title': 'Месячная доходность',
  'account-page.guide.main.monthly-returns.description':
    'Доходность каждого месяца на капитал этого счёта. Пополнения и выводы исключены и никогда не считаются прибылью, а столбец «Итого» сцепляет месяцы. Выберите месяц или год, чтобы открыть его сделки.',
  'account-dashboard.guide.main.monthly-returns.title': 'Месячная доходность',
  'account-dashboard.guide.main.monthly-returns.description':
    'Совокупная месячная доходность учтённых выше счетов, взвешенная по капиталу каждого счёта. Счета в других валютах пересчитываются по сегодняшнему курсу. Выберите месяц или год, чтобы открыть его сделки.',
  'account-page.guide.main.actions.title': 'Сделки, деньги и настройки',
  'account-page.guide.main.actions.description':
    'Откройте сделки этого счёта в Trade Log, запишите пополнение или вывод кнопкой + или измените счёт и его правила.',
  
  
  
  'account-dashboard.title': 'Счета',
  'account-dashboard.copy-badge.base': 'БАЗА',
  'account-dashboard.copy-badge.copy': 'КОПИР',
  'account-dashboard.copy-badge.copied-by': 'Копируют',
  'account-dashboard.copy-badge.copies-tooltip-masked': 'Копирует {account}',
  'account-dashboard.copy-badge.copies-tooltip':
    'Копирует {account} с {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService не инициализирован после нескольких попыток',
  'account-dashboard.error.loading': 'Ошибка при загрузке счётов: {error}',
  'account-dashboard.error.retry':
    'AccountPageService не готов, повторная попытка через {delay}мс (попытка {attempt}/{max})',
  'account-dashboard.empty.title': 'Счёта не найдены',
  'account-dashboard.empty.message':
    'Создайте счёт, чтобы начать отслеживать результаты вашей торговли',
  'account-dashboard.section.empty': 'Счётов типа {type} нет',
  'account-dashboard.section.empty-sub':
    'Создайте счёт, чтобы увидеть его здесь',
  'account-dashboard.button.create-first': 'Создайте свой первый счёт',
  'account-dashboard.action.create': 'Создать новый счёт',
  'account-dashboard.action.settings': 'Настройки счетов',
  'account-dashboard.weight-bar.aria': 'Распределение AUM по типам счётов',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: {percent}% от общего AUM',
  'account-dashboard.guide.empty.intro.title':
    'На этой странице собраны все ваши счета',
  'account-dashboard.guide.empty.intro.description':
    'В разделе «Счета» можно увидеть все счета вместе. Когда счета добавлены, здесь их удобнее всего сравнивать.',
  'account-dashboard.guide.empty.state.title':
    'Здесь пока пусто, потому что счетов ещё нет',
  'account-dashboard.guide.empty.state.description':
    'Панель остаётся пустой, пока вы не создадите первый счёт. После этого на ней появятся итоги по счетам, разделы и ссылки на страницу каждого счёта.',
  'account-dashboard.guide.empty.create.title':
    'Создайте здесь свой первый счёт',
  'account-dashboard.guide.empty.create.description':
    'Нажмите эту кнопку, чтобы создать первый счёт, который будет отслеживать Journalit.',
  'account-dashboard.guide.empty.after-create.title':
    'После сохранения Journalit откроет страницу счёта',
  'account-dashboard.guide.empty.after-create.description':
    'Заполните основные данные счёта и сохраните. Следующее руководство продолжится на странице этого счёта.',
  'account-dashboard.guide.main.intro.title': 'Это ваши счета',
  'account-dashboard.guide.main.intro.description':
    'На этой странице можно сравнить все счета в одном месте. Проп-челленджи остаются в тех же группах счетов, а их этап и прогресс по правилам показаны прямо на карточке.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM — это активы под управлением',
  'account-dashboard.guide.main.aum-chart.description':
    'Этот график показывает совокупную стоимость ваших счетов во времени. Если есть проп-счета, рядом появляется журнал челленджей с долей прохождения, расходами, выплатами и итоговым результатом.',
  'account-dashboard.guide.main.metrics.title':
    'Эти показатели суммируют все видимые счета',
  'account-dashboard.guide.main.metrics.description':
    'Используйте эти показатели для быстрого обзора на уровне счетов, прежде чем переходить к отдельным типам счетов или конкретным счетам.',
  'account-dashboard.guide.main.mode-switch.title':
    'Обзор и Челленджи — два представления одних и тех же счетов',
  'account-dashboard.guide.main.mode-switch.description':
    'В обзоре остаются график AUM и итоги портфеля. Переключитесь на Челленджи, чтобы увидеть экономику проп-челленджей: процент прохождения, расходы, выплаты и узкие места по фазам на всех счетах челленджей.',
  'account-dashboard.guide.main.create-account.title':
    'Отсюда в любой момент можно создать ещё один счёт',
  'account-dashboard.guide.main.create-account.description':
    'Используйте эту кнопку, когда захотите добавить на панель новый счёт.',
  'account-dashboard.guide.main.settings-types.title':
    'В настройках можно управлять доступными типами счетов',
  'account-dashboard.guide.main.settings-types.description':
    'В настройках можно добавлять собственные типы счетов и удалять старые, если ваш процесс работы меняется.',
  'account-dashboard.guide.main.settings-stages.title':
    'Этапы челленджа могут задавать тип счёта',
  'account-dashboard.guide.main.settings-stages.description':
    'Выберите тип счёта, который применяется, когда челлендж достигает оценки, симулированного или реального финансирования. Оставьте этап на «Без изменений», чтобы сохранить текущий тип счёта.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'В настройках можно изменить, что учитывается в итогах',
  'account-dashboard.guide.main.settings-inclusion.description':
    'Вы можете скрыть типы счетов из итогов панели, не удаляя их, и отдельно решить, учитываются ли их выводы средств.',
  'account-dashboard.guide.main.settings-order.title':
    'Этот раздел задаёт порядок групп счетов',
  'account-dashboard.guide.main.settings-order.description':
    'С помощью этих элементов выберите, какие типы счетов показывать на панели первыми.',

  'account-dashboard.guide.main.open-account.title':
    'Откройте любую карточку счёта, чтобы узнать больше',
  'account-dashboard.guide.main.open-account.description':
    'Счета сгруппированы по типу, чтобы сравнивать похожие. Откройте любую карточку для полной сводки; там продолжит гид по странице счёта.',
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    'Новое: челленджи проп-фирм',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    'Теперь счёт может отслеживать челлендж проп-фирмы: его фазы, правила фирмы и ваши выплаты.',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    'Начните новый челлендж',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    'При создании счёта включите «Челлендж проп-фирмы» и выберите фирму. Её правила заполнятся автоматически.',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    'Все ваши челленджи',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    'Переключитесь на «Челленджи», чтобы видеть прогресс, долю прохождений, расходы и выплаты по всем челленджам.',
  'account-dashboard.metrics.total-accounts': 'Всего счётов',
  'account-dashboard.metrics.total-aum': 'Общий AUM',
  'account-dashboard.metrics.total-growth': 'Общий рост',
  'account-dashboard.metrics.growth-percent': 'Рост %',
  'account-dashboard.metrics.total-withdrawals': 'Всего выводов средств',
  'account-dashboard.metrics.no-withdrawals': 'Нет выводов',
  'account-dashboard.metrics.total-trades': 'Всего сделок',
  'account-dashboard.type-header.excluded': 'Исключено',
  'account-dashboard.type-header.from-stats': 'Из статистики',
  'account-dashboard.type-header.of-total-aum': 'от общего AUM',
  'account-dashboard.type-header.aum': 'AUM',
  'account-dashboard.type-header.withdrawals': 'Выводы средств',
  'account-dashboard.type-header.account': 'Счёт',
  'account-dashboard.type-header.accounts': 'Счёта',
  'account-dashboard.type-header.trade': 'Сделка',
  'account-dashboard.type-header.trades': 'Сделки',
  'account-dashboard.type-header.growth': 'Рост ({percent})',
  'account-card.metric.trades': 'Сделки',
  'account-card.metric.withdrawals': 'Выводы',
  'account-card.metric.age': 'Возраст',
  'account-card.progress.not-set': 'Не установлено',
  'account-card.footer.monthly': 'Ежемесячно:',
  'account-card.footer.total-costs': 'Общие затраты:',
  'account.metrics.total-account-costs': 'Оценочные общие расходы',
  'account.metrics.total-costs': 'Общие расходы',
  'account.metrics.one-time-costs': 'Разовые расходы',
  'account.metrics.recurring-costs-to-date': 'Регулярные расходы на сегодня',
  'account.metrics.monthly-cost': 'Ежемесячные расходы',

  
  
  
  'account.chart.event.added': 'Счёт добавлен',
  'account.chart.event.archived': 'Счёт архивирован',
  'account.balance-chart.drawdown-floor-off-scale':
    'Предел просадки {value} ({distance} ниже)',
  'account.balance-chart.profit-target-off-scale':
    'Цель по прибыли {value} ({distance} выше)',
  'account.balance-chart.empty': 'Сделки не найдены',
  'account.balance-chart.empty-sub': 'Нет торговой активности для этого счёта',
  'account.aum-chart.empty': 'Нет данных счёта',
  'account.aum-chart.empty-sub': 'Добавьте счёта для просмотра истории AUM',

  
  
  
  'account.link-modal.title': 'Обнаружен новый торговый счёт',
  'account.link-modal.account-id': 'ID счёта:',
  'account.link-modal.broker': 'Брокер:',
  'account.link-modal.first-seen': 'Впервые замечен:',
  'account.link-modal.question': 'Как вы хотите работать с этим счётом?',
  'account.link-modal.option.new':
    'Создать новый счёт с пользовательским названием',
  'account.link-modal.placeholder.custom-name': 'например, FTMO Challenge',
  'account.link-modal.account-type': 'Тип счёта:',
  'account.link-modal.option.existing': 'Связать с существующим счётом',
  'account.link-modal.no-accounts-available': '(нет доступных счётов)',
  'account.link-modal.select-account': 'Выберите счёт...',

  'account.link-modal.option.default':
    'Использовать имя по умолчанию: Счёт-{id}',
  'account.link-modal.default-name': 'Счёт-{id}',
  'account.link-modal.button.linking': 'Связывание...',
  'account.link-modal.notice.select-existing':
    'Пожалуйста, выберите существующий счёт',
  'account.link-modal.notice.failed': 'Ошибка связи счёта: {error}',

  
  
  

  
  
  
  'account.create.title': 'Создать счёт',
  'account.form.field.name': 'Имя счёта',
  'account.form.placeholder.name': 'Мой торговый счёт',
  'account.form.field.type': 'Тип счёта',
  'account.form.type.demo': 'Демо',
  'account.form.type.evaluation': 'Оценка',
  'account.form.type.funded': 'Финансируемый',
  'account.form.field.initial-balance': 'Начальный баланс',
  'account.form.field.initial-balance-desc':
    'Начальный баланс счёта (по умолчанию 0)',
  'account.form.field.live-balance': 'Текущий баланс',
  'account.form.field.live-balance-desc':
    'Текущий баланс у брокера без создания денежного движения',
  'account.form.field.creation-date': 'Дата создания',
  'account.form.field.creation-date-desc': 'Когда был создан счёт',
  'account.form.field.currency': 'Валюта',
  'account.form.field.currency-desc': 'Базовая валюта счёта для отображения',
  'account.form.field.drawdown-type': 'Тип просадки',
  'account.form.field.drawdown-amount': 'Размер просадки',
  'account.form.field.drawdown-amount-desc': 'Максимальный лимит просадки',
  'account.form.field.monthly-cost': 'Ежемесячные расходы',
  'account.form.field.monthly-cost-desc':
    'Комиссия подписки, стоимость платформы',
  'account.form.field.target-type': 'Тип цели',
  'account.form.field.target-type-desc': 'Абсолютное или процентное значение',
  'account.form.field.target-percent': 'Цель (%)',
  'account.form.field.target-dollar': 'Цель ($)',
  'account.form.field.target-percent-desc': 'Целевой прирост в процентах',
  'account.form.field.target-dollar-desc': 'Целевая сумма в долларах',
  'account.form.field.target-date': 'Дата цели',
  'account.form.field.target-date-desc': 'Дата достижения цели по прибыли',
  'account.form.unsaved-changes.body':
    'У вас есть несохранённые изменения в этом счёте.',

  'account.create.success': 'Счёт "{name}" успешно создан',
  'account.create.error.name-required': 'Требуется имя счёта',
  'account.create.error.name-exists': 'Счёт с именем "{name}" уже существует',
  'account.create.error.rule-incomplete':
    'Каждому включённому правилу нужно значение больше нуля',
  'account.create.error.balance-negative':
    'Начальный баланс не может быть отрицательным',
  'account.create.error.invalid-live-balance': 'Некорректный текущий баланс',
  'account.create.error.drawdown-required':
    'Размер просадки требуется, когда тип просадки включён',
  'account.create.error.profit-target-required':
    'Сумма цели по прибыли требуется, когда цель по прибыли включена',
  'account.create.error.profit-target-needs-balance':
    'Для цели по прибыли в процентах нужен начальный баланс. Укажите его или задайте цель в сумме.',
  'account.create.error.phase-profit-target-needs-balance':
    'Для цели по прибыли в процентах нужен начальный баланс этапа. Укажите его или задайте цель в сумме.',
  'account.create.error.invalid-date': 'Неверная дата создания',
  'account.create.error.future-date': 'Дата создания не может быть в будущем',
  'account.create.error.cost-negative':
    'Ежемесячные расходы не могут быть отрицательными',
  'account.create.error.service-unavailable':
    'Служба счётов недоступна. Пожалуйста, повторите попытку.',
  'account.create.error.fix-target-date':
    'Пожалуйста, исправьте ошибку даты цели по прибыли перед созданием счёта',
  'account.create.error.invalid-target-date': 'Неверная дата цели по прибыли',
  'account.create.error.failed': 'Ошибка при создании счёта: {error}',
  'account.create.button.creating': 'Создание...',
  'account.create.button.create': 'Создать счёт',

  
  
  
  'account.add-event.title': 'Добавить депозит/вывод средств',
  'account.add-event.field.type': 'Тип транзакции',
  'account.add-event.field.type-desc': 'Депозит или вывод средств',
  'account.add-event.field.amount': 'Сумма',
  'account.add-event.field.amount-desc': 'Сумма в {currency}',
  'account.add-event.field.date': 'Дата',
  'account.add-event.field.date-desc': 'Дата транзакции',
  'account.add-event.field.description': 'Описание (опционально)',
  'account.add-event.field.description-desc': 'Дополнительные примечания',
  'account.add-event.type.deposit': 'Депозит',
  'account.add-event.type.withdrawal': 'Вывод средств',
  'account.add-event.placeholder.deposit': 'Ручной депозит',
  'account.add-event.placeholder.withdrawal': 'Ручной вывод средств',
  'account.add-event.button.add': 'Добавить транзакцию',
  'account.add-event.button.adding': 'Добавление...',
  'account.add-event.success': '{type} в размере {amount} успешно добавлено',
  'account.add-event.error.amount-required': 'Сумма должна быть больше 0',
  'account.add-event.error.date-required': 'Дата обязательна',
  'account.add-event.error.invalid-date': 'Неверный формат даты',
  'account.add-event.error.future-date':
    'Дата транзакции не может быть в будущем',
  'account.add-event.error.failed': 'Ошибка при добавлении транзакции: {error}',
  'account.add-event.confirm.title': 'Подтвердить транзакцию',
  'account.add-event.confirm.message':
    'Добавить {type} в размере {amount} на счёт "{account}" на {date}?',
  'account.add-event.confirm.description': 'Описание: {description}',

  
  
  
  'account.risk-metrics.title': 'Управление рисками',
  'account.risk-metrics.drawdown-used': 'Использовано от лимита просадки',
  'account.risk-metrics.profit-target': 'Цель по прибыли',
  'account.risk-metrics.profit-target-needs-balance':
    'Цели в процентах нужен начальный баланс, от которого она считается. Укажите его в разделе «Изменить счёт» или задайте цель в сумме.',
  'account.risk-metrics.status.breached': 'НАРУШЕНА',
  'account.risk-metrics.status.achieved': 'ДОСТИГНУТА',
  'account.risk-metrics.status.in-progress': 'В ПРОЦЕССЕ',
  'account.risk-metrics.label.used': 'Использовано:',
  'account.risk-metrics.label.limit': 'Лимит:',
  'account.risk-metrics.label.remaining': 'Осталось:',
  'account.risk-metrics.label.progress': 'Прогресс:',
  'account.risk-metrics.label.target': 'Цель:',
  'account.risk-metrics.label.target-date': 'Целевая дата:',

  
  
  
  'account.edit-event.title': 'Редактировать {type}',
  'account.edit-event.field.type': 'Тип транзакции',
  'account.edit-event.field.type-desc':
    'Не может быть изменён при редактировании',
  'account.edit-event.field.amount': 'Сумма',
  'account.edit-event.field.amount-desc': 'Сумма в {currency}',
  'account.edit-event.field.date': 'Дата',
  'account.edit-event.field.date-desc': 'Дата транзакции',
  'account.edit-event.field.description': 'Описание (опционально)',
  'account.edit-event.field.description-desc': 'Дополнительные примечания',
  'account.edit-event.button.save': 'Сохранить изменения',
  'account.edit-event.button.saving': 'Сохранение...',
  'account.edit-event.button.delete': 'Удалить {type}',
  'account.edit-event.button.deleting': 'Удаление...',
  'account.edit-event.success.update': '{type} успешно обновлена',
  'account.edit-event.success.delete': '{type} успешно удалена',
  'account.edit-event.error.update':
    'Ошибка при обновлении транзакции: {error}',
  'account.edit-event.error.delete': 'Ошибка при удалении транзакции: {error}',
  'account.edit-event.delete-confirm.title': 'Удалить {type}',
  'account.edit-event.delete-confirm.message':
    'Вы уверены, что хотите удалить эту {type} суммой {amount} от {date}?',
  'account.edit-event.delete-confirm.warning':
    'Это действие не может быть отменено.',

  
  
  
  'account.edit.title': 'Редактировать счёт',
  'account.edit.convert.discard-title': 'Отменить несохранённые изменения?',
  'account.edit.convert.discard-message':
    'Настройка челленджа открывается в отдельном окне и закрывает эту форму. Изменения, сделанные здесь, не сохранятся.',
  'account.edit.convert.discard-confirm': 'Отменить и продолжить',

  'account.edit.field.manual-snapshots': 'Снимки просадки вручную',
  'account.edit.field.manual-snapshots-desc':
    'Записывайте лимиты просадки, которые брокер устанавливает со временем',
  'account.copy-trading.title': 'Копи-трейдинг',
  'account.copy-trading.description':
    'Рассчитывать результаты этого счёта на основе другого счёта по историческим периодам копирования.',
  'account.copy-trading.enable': 'Этот счёт копирует другой счёт',
  'account.copy-trading.existing-trades-warning':
    'На этом счёте уже есть собственные сделки. Они сохранятся, а скопированные сделки будут добавлены с выбранной даты начала.',
  'account.copy-trading.base-account': 'Базовый счёт',
  'account.copy-trading.base-account-desc': 'Та же валюта, не копирующий счёт',
  'account.copy-trading.base-account-placeholder': 'Выберите базовый счёт',
  'account.copy-trading.multiplier': 'Множитель',
  'account.copy-trading.multiplier-desc':
    'Допустимый диапазон: от 0.1x до 100x',
  'account.copy-trading.all-history': 'Копировать все исторические сделки',
  'account.copy-trading.start-date': 'Копировать с даты',
  'account.copy-trading.history': 'История копирования',
  'account.copy-trading.error.base-required':
    'Выберите базовый счёт для копи-трейдинга.',
  'account.copy-trading.error.multiplier-range':
    'Множитель копи-трейдинга должен быть от 0.1x до 100x.',
  'account.copy-trading.error.start-date-required':
    'Выберите дату начала копи-трейдинга.',
  'account.copy-trading.error.base-account-is-copied':
    'Этот счёт уже используется как базовый и не может копировать другой счёт.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'Этот счёт сейчас служит базовым для другого копирующего счёта.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'Базовые счета не могут одновременно быть копирующими.',
  'account.prop-challenge.summary.status.archived': 'В архиве',
  'account.prop-challenge.summary.status.hidden': 'Скрыто',
  'account.prop-challenge.actions.progress-to': 'Перейти к этапу «{phase}»',
  'account.prop-challenge.actions.progress': 'Перейти к следующему этапу',
  'account.prop-challenge.actions.mark-passed': 'Отметить челлендж пройденным',
  'account.prop-challenge.actions.mark-failed': 'Отметить проваленным',
  'account.prop-challenge.actions.archive': 'Архивировать челлендж',
  'account.prop-challenge.actions.reopen': 'Открыть снова',
  'account.prop-challenge.actions.link-rules': 'Связать с правилами фирмы…',
  'account.prop-challenge.view-trades': 'Показать сделки этапа {phase}',
  'account.prop-challenge.actions.manual': 'Ручные действия',
  'account.prop-challenge.notice.failed-title': '{phase} провалена',
  'account.prop-challenge.notice.failed-description': '{rule} нарушено {date}',
  'account.prop-challenge.notice.failed-manual': 'Отмечена как проваленная',
  'account.prop-challenge.notice.keep-open': 'Оставить открытым',
  'account.prop-challenge.notice.target-title': 'Цель {phase} достигнута',
  'account.prop-challenge.notice.target-description':
    'Все условия выполнены. Перейти к {next}?',
  'account.prop-challenge.notice.breach-after-reached':
    'Правила были нарушены после достижения цели в {time}. Задайте время перехода, чтобы эти сделки не попали в эту фазу.',
  'account.prop-challenge.notice.not-yet': 'Пока нет',
  'account.prop-challenge.notice.passed-title': 'Оценка пройдена',
  'account.prop-challenge.notice.passed-description':
    'Все условия выполнены. Отметить челлендж пройденным?',
  'account.prop-challenge.notice.payout-title': 'Доступна выплата: {amount}',
  'account.prop-challenge.notice.payout-plan': 'Ваш план: вывести {amount}',
  'account.prop-challenge.notice.record-payout': 'Записать выплату',
  'account.prop-challenge.notice.skip-cycle': 'Пропустить этот цикл',
  'account.prop-challenge.notice.payout-description': 'Выплата',
  'account.prop-challenge.notice.lost-title': 'Выплата больше недоступна',
  'account.prop-challenge.notice.lost-description':
    'Не выполнено: {requirements}',
  'account.prop-challenge.notice.dismiss': 'Скрыть',
  'account.prop-challenge.notice.unknown-title': 'Новый счёт {label}',
  'account.prop-challenge.notice.unknown-description':
    '{count} сделок с {date} не назначены фазе.',
  'account.prop-challenge.notice.unknown-description-one':
    '1 сделка с {date} не отнесена ни к одному этапу.',
  'account.prop-challenge.notice.same-phase': 'Та же фаза',
  'account.prop-challenge.notice.not-now': 'Не сейчас',
  'account.prop-challenge.notice.error': 'Не удалось обновить уведомление.',
  'account.prop-challenge.notice.type-changed':
    'Тип счёта изменён на {accountType}',
  'account.prop-challenge.payout.plan.title': 'План выплат',
  'account.prop-challenge.payout.plan.notify-minimum':
    'Уведомлять от ({currency})',
  'account.prop-challenge.payout.plan.withdrawal': 'Предлагаемый вывод',
  'account.prop-challenge.payout.plan.full': 'Вся сумма',
  'account.prop-challenge.payout.plan.percent': 'Процент от доступного',
  'account.prop-challenge.payout.plan.amount': 'Фиксированная сумма',
  'account.prop-challenge.payout.plan.percent-invalid':
    'Введите процент от 1 до 100.',
  'account.prop-challenge.payout.plan.amount-invalid':
    'Введите сумму больше нуля.',
  'account.prop-challenge.payout.plan.percent-value': 'Процент',
  'account.prop-challenge.payout.plan.amount-value': 'Сумма ({currency})',
  'account.prop-challenge.payout.plan.save': 'Сохранить план',
  'account.prop-challenge.payout.plan.saved': 'План выплат сохранён.',
  'account.prop-challenge.payout.plan.summary-notify': 'уведомлять от {amount}',
  'account.prop-challenge.payout.plan.summary-percent': 'предлагать {percent}%',
  'account.prop-challenge.payout.plan.summary-amount': 'предлагать {amount}',
  'account.prop-challenge.payout.plan.summary-full': 'вся сумма',
  'account.prop-challenge.actions.error': 'Не удалось обновить проп-челлендж.',
  'account.prop-challenge.confirm.advance':
    'Подтвердить результат этапа и продолжить челлендж?',
  'account.prop-challenge.confirm.advance-with-promotion':
    'Челлендж перейдёт на следующий этап, а тип счёта изменится на {accountType}.',
  'account.prop-challenge.confirm.fail':
    'Отметить {account} как проваленный? Челлендж «{challenge}» завершится на этапе {phase}.',
  'account.prop-challenge.confirm.archive-failed':
    'Архивировать {account}? Челлендж «{challenge}» провален. Счёт переходит в архив.',
  'account.prop-challenge.confirm.archive-passed':
    'Архивировать {account}? Челлендж «{challenge}» пройден. Счёт переходит в архив.',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → челлендж пройден',
  'account.prop-challenge.confirm.reopen':
    'Открыть {account} заново? Челлендж «{challenge}» вернётся к этапу {phase}.',
  'account.prop-challenge.transition.time': 'Время перехода',
  'account.prop-challenge.transition.now': 'Сейчас',
  'account.prop-challenge.transition.when-target-reached':
    'Когда цель была достигнута',
  'account.prop-challenge.transition.too-early':
    'Время перехода не может быть раньше начала этой фазы.',
  'account.prop-challenge.costs.section-title': 'Расходы',
  'account.prop-challenge.costs.title': 'Разовые расходы',
  'account.prop-challenge.costs.description':
    'Отдельно учитывайте покупку, сброс и активацию.',
  'account.prop-challenge.costs.kind': 'Тип',
  'account.prop-challenge.costs.kind.purchase': 'Покупка',
  'account.prop-challenge.costs.kind.reset': 'Сброс',
  'account.prop-challenge.costs.kind.activation': 'Активация',
  'account.prop-challenge.costs.kind.other': 'Другое',
  'account.prop-challenge.costs.date': 'Дата',
  'account.prop-challenge.costs.amount': 'Сумма',
  'account.prop-challenge.costs.note': 'Примечание (необязательно)',
  'account.prop-challenge.costs.add': 'Добавить расход',
  'account.header.copies': 'Копирует',
  'account.header.copied-by-more': '+ ещё {count}',
  'account.header.created': 'Создан:',
  'account.summary.current-balance': 'Текущий баланс',
  'account.summary.net-cash-flow': 'Чистый денежный поток',
  'account.performance.title': 'Результативность',
  'account-page.guide.whats-new.cockpit.intro.title':
    'Правила вашего челленджа',
  'account-page.guide.whats-new.cockpit.intro.description':
    'На счёте проп-фирмы каждое правило фирмы и то, насколько вы к нему близки, показаны под метриками.',
  'account-page.guide.whats-new.cockpit.cockpit.title':
    'Проверьте фазу и действуйте',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    'Выберите фазу в заголовке правил, чтобы увидеть её правила. Отметьте её пройденной или проваленной либо откройте заново через меню ⋮ рядом.',
  'account-page.guide.main.challenge.title': 'Ваш челлендж с первого взгляда',
  'account-page.guide.main.challenge.description':
    'Выберите фазу, чтобы увидеть каждое правило и прогресс по нему. Для funded-фаз с подтверждёнными правилами выплат здесь же отслеживается право на выплату.',
  'account.edit.button.show-snapshots':
    'Показать менеджер снимков ({count} записано)',
  'account.edit.button.hide-snapshots':
    'Скрыть менеджер снимков ({count} записано)',
  'account.edit.delete-warning':
    'Это постоянное действие, которое невозможно отменить!',
  'account.edit.button.saving': 'Сохранение...',
  'account.edit.button.save': 'Сохранить изменения',
  'account.edit.button.delete': 'Удалить счёт',
  'account.edit.button.delete-name': 'Удалить "{name}"',
  'account.edit.modal.update-notes.title': 'Обновить связанные примечания?',
  'account.edit.modal.update-notes.message':
    'Переименование обновит все заметки, которые ссылаются на «{oldName}», на «{newName}». Это необходимо для сохранения целостности данных.',
  'account.edit.modal.update-notes.yes': 'ОК (Обновить примечания)',
  'account.edit.modal.update-notes.no': 'Оставить старое имя',
  'account.edit.modal.update-notes.cancel': 'Отменить действие',
  'account.edit.modal.change-date.title': 'Изменить дату создания',
  'account.edit.modal.change-date.confirm': 'Обновить дату создания',
  'account.edit.modal.change-balance.title': 'Изменить начальный баланс',
  'account.edit.modal.change-balance.info2':
    'Текущий баланс будет пересчитан на основе нового начального баланса плюс P&L всех сделок.',
  'account.edit.modal.change-balance.info3':
    'Это изменение может значительно повлиять на метрики счёта и точность исторических данных.',
  'account.edit.modal.change-balance.confirm': 'Обновить начальный баланс',
  'account.edit.modal.delete.title': 'Удалить счёт',
  'account.edit.modal.delete.will': 'Это действие:',
  'account.edit.modal.delete.item1': 'Удалить все метаданные и параметры счёта',
  'account.edit.modal.delete.item2':
    'Удалить ссылки на счёт из всех связанных сделок',
  'account.edit.modal.delete.item3':
    'Удалить автоматически созданные теги счёта из примечаний',
  'account.edit.error.name-required': 'Требуется имя счёта',
  'account.edit.error.name-exists': 'Счёт "{name}" уже существует',
  'account.edit.error.creation-date-required': 'Дата создания обязательна',
  'account.edit.error.balance-required':
    'Начальный баланс не может быть отрицательным',
  'account.edit.error.invalid-live-balance': 'Некорректный текущий баланс',
  'account.edit.error.drawdown-required': 'Сумма просадки должна быть больше 0',
  'account.edit.error.future-date': 'Дата создания не может быть в будущем',
  'account.edit.error.update-failed': 'Ошибка обновления счёта: {error}',
  'account.edit.error.service-unavailable': 'Сервис счёта недоступен',
  'account.edit.error.delete-failed': 'Ошибка удаления счёта: {error}',
  'account.edit.success.updated': 'Счёт "{name}" успешно обновлён',
  'account.edit.success.updated-with-references':
    'Счёт обновлён с "{oldName}" на "{newName}" и все ссылки примечаний обновлены',
  'account.edit.success.deleted': 'Счёт "{name}" успешно удалён',

  'account.edit.modal.delete.delete-associated-trades':
    'Также удалить из моего хранилища все сделки, связанные с этим счётом',
  
  
  
  'account.drawdown.none': 'Нет',
  'account.drawdown.fixed': 'Статический',
  'account.drawdown.eod-trailing': 'Скользящая на конец дня',
  'account.drawdown.manual': 'Ручная',
  'account.profit-target.title': 'Целевая прибыль',
  'account.profit-target.type.absolute': 'Абсолютная сумма',
  'account.profit-target.type.percentage': 'Процент',

  
  
  
  'account.weight-legend.aria-label': 'Легенда распределения типов счёта',
  'account.weight-legend.item-aria-label': '{name}: {percent}',

  
  
  
  'account.transaction.deposit': 'Депозит',
  'account.transaction.withdrawal': 'Вывод средств',
  'account.transaction.edit-row-label':
    'Изменить или удалить эту транзакцию: {date}, {amount}',

  
  
  
  'account.deposits-withdrawals.title': 'Депозиты и выводы средств',
  'account.deposits-withdrawals.empty':
    'Нет записанных ручных депозитов или выводов средств.',
  'account.deposits-withdrawals.empty-sub':
    'Нажмите кнопку + в заголовке, чтобы добавить первую транзакцию.',
  'account.deposits-withdrawals.summary':
    'Внесено {deposits} · Выведено {withdrawn} · последняя {date}',
  'account.payouts.title': 'Выплаты',
  'account.payouts.summary': '{count} выплат · {total} · последняя {date}',
  'account.payouts.summary-masked':
    'История выплат скрыта, пока значения замаскированы',
  'account.payouts.summary-one': '1 выплата · {total} · последняя {date}',
  'account.payouts.empty': 'Выплат пока нет',
  'account.payouts.empty-sub': 'Добавьте выплату кнопкой + в заголовке.',
  'account.ledger.column.date': 'Дата',
  'account.ledger.column.type': 'Тип',
  'account.ledger.column.payout': 'Выплата',
  'account.ledger.column.description': 'Описание',
  'account.ledger.column.amount': 'Сумма',
  'account.ledger.column.balance-after': 'Баланс после',

  
  
  

  
  
  
  'csv.mapper.title': 'Сопоставить колонки с полями сделок',
  'csv.mapper.subtitle': 'Соответствие между колонками и полями сделок.',
  'csv.mapper.do-not-import': 'Не импортировать',
  'csv.mapper.required-badge': 'Обязательное',
  'csv.mapper.required-label': 'ОБЯЗАТЕЛЬНОЕ',
  'csv.mapper.example': 'Пример:',
  'csv.mapper.mode.title': 'Что содержит каждая строка?',
  'csv.mapper.mode.help':
    'В таблицах-журналах обычно одна закрытая сделка на строку и столбец P/L. В истории ордеров брокера каждая покупка и продажа идёт отдельной строкой.',

  'csv.mapper.tip.title': 'Совет: сопоставьте дополнительные поля',
  'csv.mapper.tip.desc':
    'Сопоставление необязательных полей, таких как комиссия и P&L, повышает качество импорта. Можно также сопоставить несколько столбцов со списочными полями: тегами, изображениями, сетапами и ошибками.',
  'csv.mapper.missing-fields': 'Отсутствуют обязательные поля для {assetType}:',
  'csv.mapper.summary.title': 'Сводка:',
  'csv.mapper.summary.of': 'из',
  'csv.mapper.summary.columns-mapped': 'колонок сопоставлено',
  'csv.mapper.summary.all-mapped': 'Все обязательные поля сопоставлены',
  'csv.mapper.available-fields.title': 'Доступные поля сделок',
  'csv.mapper.available-fields.desc':
    'Организовано по категориям с описаниями полей для разных типов активов',

  
  'csv.mapper.field.symbol': 'Тикер',
  'csv.mapper.field.direction': 'Направление (Лонг/Шорт)',
  'csv.mapper.field.entry-time': 'Время входа',
  'csv.mapper.field.exit-time': 'Время выхода',
  'csv.mapper.field.entry-price': 'Цена входа',
  'csv.mapper.field.exit-price': 'Цена выхода',
  'csv.mapper.field.quantity': 'Объём',
  'csv.mapper.field.notes': 'Заметки',
  'csv.mapper.field.order-id': 'ID ордера',
  'csv.mapper.field.account-id': 'ID счёта',

  
  'csv.mapper.help.options-required': 'Обязательно для сделок с опционами',
  'csv.mapper.help.option-type-required':
    'Обязательно для опционов (колл или пут)',
  'csv.mapper.help.contract-size':
    'Мультипликатор для опционов (обычно 100), фьючерсов или форекса (единиц на лот, обычно 100 000)',
  'csv.mapper.help.order-id':
    'Используется для объединения частичных исполнений',
  'csv.mapper.help.asset-types': 'акции, опционы, фьючерсы, форекс, крипто',
  'csv.mapper.help.status': 'Статус сделки: ОТКРЫТА или ЗАКРЫТА',

  
  'csv.mapper.category.required': 'Обязательные поля',
  'csv.mapper.category.optional-core': 'Опциональные основные поля',
  'csv.mapper.category.identifiers': 'Идентификаторы',
  'csv.mapper.category.other': 'Прочее',
  'csv.mapper.category.options': 'Поля для опционов',
  'csv.mapper.category.futures': 'Поля для фьючерсов',

  
  
  

  
  
  

  'csv.template-import.label.share-code': 'Код обмена',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': 'Импортировать шаблон',

  'csv.template-import.error.import-failed': 'Не удалось импортировать шаблон',

  'csv.export-template.label.share-code': 'Код для публикации',

  'csv.export-template.button.copied': 'Скопировано!',
  'csv.export-template.button.copy': 'Копировать в буфер обмена',

  
  
  

  'csv.broker.remove-favorite-aria': 'Удалить из избранного',
  'csv.broker.set-favorite-aria': 'Установить как избранное',

  
  
  

  'csv.account-selector.favorite.remove': 'Удалить из избранного',
  'csv.account-selector.favorite.set': 'Установить как избранное',

  

  
  
  

  'csv.results.failed-to-import-prefix': 'Не удалось импортировать ',
  'csv.results.failed-to-import-suffix': ' строк (см. детали ниже)',

  'csv.results.pending-local-writes':
    'Ожидается запись заметок по сделкам: {count}. Journalit согласует завершённые записи, а незавершённые проекции оставит доступными для восстановления.',
  'csv.results.pending-title': 'Импорт ещё синхронизируется',

  'csv.results.history-ready': 'История торговли готова',
  'csv.results.completed-with-issues': 'Импорт завершён с проблемами',
  'csv.results.failed': 'Импорт не выполнен',
  'csv.results.broker': 'Брокер: {broker}',

  'csv.results.errors-header': 'НАЖМИТЕ, ЧТОБЫ УВИДЕТЬ ОШИБКИ ({count})',
  'csv.results.discord-note':
    'Необязательно: если нужна помощь, нажмите «Копировать отчёт» и вставьте его в Discord.',

  

  'csv.errors.copy-report': 'Скопировать отчёт',

  'csv.errors.copied': 'Скопировано',
  'csv.errors.rows': 'Строки: {rows}',

  'csv.errors.raw-errors-limit': 'Показаны первые {shown} из {total} ошибок',

  

  'csv.report.top-issues': 'Основные проблемы:',

  
  
  

  
  
  

  
  
  

  
  
  

  
  'csv.button.export-template': 'Экспортировать шаблон',
  'csv.button.delete-template': 'Удалить шаблон',

  'csv.button.import-another': 'Импортировать другой файл',

  
  
  

  

  

  

  

  

  
  
  
  'csv.date-format.auto-detect':
    'Автоопределение (рекомендуется для ISO/стандартных форматов)',
  'csv.date-format.us-date':
    'Дата (США): 12/25/2024 (Schwab, Fidelity, E*TRADE)',
  'csv.date-format.us-datetime':
    'Дата и время (США): 12/25/2024 14:30:00 (Webull)',
  'csv.date-format.us-short': 'Краткая дата (США): 1/5/2024 (TradeZero)',
  'csv.date-format.us-short-datetime':
    'Краткие дата и время (США): 1/5/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'ISO дата и время: 2024-12-25 14:30:00 (Tradovate)',
  'csv.date-format.iso-date': 'Дата ISO: 2024-12-25 (Interactive Brokers)',
  'csv.date-format.eu-date': 'EU Date: 25/12/2024 (день/месяц/год)',
  'csv.date-format.eu-datetime': 'Дата и время (ЕС): 25/12/2024 14:30:00',
  'csv.date-format.eu-dash': 'Дата с дефисами (ЕС): 25-12-2024',
  'csv.date-format.eu-dash-datetime':
    'Дата с дефисами и время (ЕС): 25-12-2024 14:30:00',

  
  
  
  'home.widget.recent-items.name': 'Недавние файлы',
  'home.widget.recent-items.description':
    'Недавно открытые файлы и представления',
  'home.widget.year-heatmap.name': 'Тепловая карта торговли',
  'home.widget.year-heatmap.description': 'Ваша торговая активность за год',
  'home.widget.getting-started.name': 'Первые шаги',
  'home.widget.getting-started.description':
    'Чек-лист для настройки Journalit и сделок',
  'home.widget.getting-started.progress': 'Выполнено {completed}/{total}',
  'home.widget.getting-started.progress.loading': 'Проверка прогресса...',
  'home.widget.getting-started.item.account.title': 'Настройте торговый счёт',
  'home.widget.getting-started.item.account.description':
    'Сделки записываются на счёт, который отслеживает ваш баланс. Без счёта невозможно рассчитать доходность и просадку.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'Настроить счёт',
  'home.widget.getting-started.item.create.title': 'Добавьте историю торговли',
  'home.widget.getting-started.item.create.description':
    'Импортируйте существующие сделки, подключите Trade Sync или добавьте первую сделку вручную.',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Открыть Trade Import',
  'home.widget.getting-started.item.tradelog.title': 'Откройте журнал сделок',
  'home.widget.getting-started.item.tradelog.description':
    'Ваша база сделок, чтобы анализировать их все в одном месте.',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta': 'Открыть журнал сделок',
  'home.widget.getting-started.item.layouts.title':
    'Откройте конструктор макетов',
  'home.widget.getting-started.item.layouts.description':
    'Настройте макеты обзоров под себя.',
  'home.widget.getting-started.item.layouts.time': '1 мин',
  'home.widget.getting-started.item.layouts.cta': 'Открыть конструктор макетов',
  'home.widget.getting-started.item.sidebar.title':
    'Открыть боковую панель навигации',
  'home.widget.getting-started.item.sidebar.description':
    'Быстрый доступ к страницам, обзорам, инструментам и поиску Journalit.',
  'home.widget.getting-started.item.sidebar.time': '10 с',
  'home.widget.getting-started.item.sidebar.cta': 'Открыть панель',
  'home.widget.getting-started.item.pro.title': 'Активируйте PRO',
  'home.widget.getting-started.item.pro.description':
    'Включите Trade Import, Trade Sync и экономический календарь, а также получите больше вызовов ИИ-инструментов в месяц.',
  'home.widget.getting-started.item.pro.time': '1 мин',
  'home.widget.getting-started.item.pro.cta': 'Активировать',
  'home.widget.weekly-summary.name': 'Еженедельная сводка',
  'home.widget.weekly-summary.description':
    'Метрики текущей недели с графиком дневного P&L',
  'home.widget.key-events.name': 'Ключевые события',
  'home.widget.key-events.description':
    'Новости и события из недельного обзора',
  'home.widget.key-events.empty-title': 'Ключевых событий пока нет',
  'home.widget.key-events.open-aria': 'Открыть недельный обзор этой недели',
  'home.widget.position-size.name': 'Калькулятор размера позиции',
  'home.widget.position-size.description': 'Размер позиции по риску счёта в %',
  'home.widget.embedded-note.name': 'Встроенная заметка',
  'home.widget.embedded-note.description':
    'Любая markdown-заметка из хранилища',
  'home.widget.current-streak.name': 'Текущая серия',
  'home.widget.current-streak.description':
    'Отслеживайте серии сделок и разборов',
  'home.widget.best-hours.name': 'Лучшие часы',
  'home.widget.best-hours.description':
    'Время дня, когда вы торгуете лучше всего',
  'home.widget.setup-leaderboard.name': 'Топ-разбивка',
  'home.widget.setup-leaderboard.description':
    'Лучшие сетапы, теги, типы активов, тикеры',
  'home.widget.unreviewed-trades.name': 'Непроверенные сделки',
  'home.widget.unreviewed-trades.description':
    'Сделки, требующие вашего анализа',
  'home.widget.goals-progress.name': 'Прогресс целей',
  'home.widget.goals-progress.description': 'Прогресс к вашей торговой цели',
  'home.widget.trading-score.name': 'Торговый рейтинг',
  'home.widget.trading-score.description':
    'Общая оценка вашей торговой эффективности',
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description':
    'Текущие балансы счетов с динамикой за 30 дней',
  'home.widget.drawdown-monitor.name': 'Монитор просадки',
  'home.widget.drawdown-monitor.description':
    'Использование лимита просадки по счетам',
  'home.widget.profit-target-widget.name': 'Цель прибыли',
  'home.widget.profit-target-widget.description':
    'Отслеживать прогресс целей прибыли по счетам',
  'home.widget.eval-roi.name': 'ROI оценок',
  'home.widget.challenge-alerts.name': 'Оповещения челленджей',
  'home.widget.challenge-alerts.description':
    'Проп-счета: провалены, пройдены или к выплате',
  'home.widget.eval-roi.description':
    'Взносы за челленджи и полученные выплаты',

  
  
  
  'home.quick-links.hide': 'Скрыть быструю ссылку',
  'home.quick-links.add-trade': 'Добавить сделку',
  'home.quick-links.trade-log': 'Журнал сделок',
  'home.quick-links.trading-dashboard': 'Панель',
  'home.quick-links.account-dashboard': 'Счета',
  'home.quick-links.todays-drc': 'Дневной анализ',
  'home.quick-links.weekly-review': 'Обзор за неделю',
  'home.quick-links.monthly-review': 'Обзор за месяц',
  'home.quick-links.quarterly-review': 'Обзор за квартал',
  'home.quick-links.yearly-review': 'Обзор за год',
  'home.quick-links.quick-import': 'Быстрый импорт',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'Построитель макета',
  'home.quick-links.navigation-sidebar': 'Боковая панель навигации',
  'home.quick-links.session-mode': 'Режим сессии',
  'home.quick-links.economic-calendar': 'Экономический календарь',
  'home.quick-links.move-above': 'Переместить быстрые ссылки выше виджетов',
  'home.quick-links.move-below': 'Переместить быстрые ссылки ниже виджетов',

  
  
  
  'home.widget-selector.title': 'Добавить на главную',
  'home.widget-selector.subtitle':
    'Просматривайте виджеты по превью и нажмите на нужный, чтобы добавить его на главную.',
  'home.widget-selector.sample-note.title': 'Торговый план',
  'home.widget-selector.sample-note.intro':
    'Только сетапы A+ на ключевых уровнях. Не более 3 сделок в день.',
  'home.widget-selector.sample-note.checklist': 'Чек-лист',
  'home.widget-selector.sample-note.task.calendar':
    'Проверить экономический календарь',
  'home.widget-selector.sample-note.task.levels':
    'Отметить ключевые уровни на графике',
  'home.widget-selector.sample-note.task.max-loss':
    'Задать максимальный дневной убыток',
  'home.widget-selector.sample-note.task.journal':
    'Записать первую сделку в журнал',
  'home.widget-selector.tab.performance': 'Результаты',
  'home.widget-selector.tab.accounts': 'Счета',
  'home.widget-selector.tab.workflow': 'Рабочий процесс',
  'home.widget-selector.section.quick-links': 'Быстрые ссылки',
  'home.widget-selector.restore': 'восстановить',
  'home.widget-selector.add-shortcut': 'Добавить ярлык счета/сетапа',

  
  
  
  'home.period.month': 'Месяц',
  'home.period.week': 'Неделя',
  'home.period.custom': 'Произвольный период',
  'home.period.invalid-range':
    'Дата окончания должна совпадать с датой начала или быть позже.',
  'date-input.error.day': 'День должен быть от 1 до {max}.',
  'date-input.error.invalid': 'Введите корректную дату',
  'date-input.error.month': 'Месяц должен быть от 1 до 12.',
  'date-input.error.year': 'Используйте YY (2000–2099) или YYYY (1000–9999).',
  'home.period.quarter': 'Квартал',
  'home.period.year': 'Год',
  'home.period.lifetime': 'Всё время',

  'home.aria.filter-trade-types': 'Фильтр по типам сделок',
  'home.aria.open-settings': 'Открыть настройки Journalit',
  'home.aria.save-layout': 'Сохранить макет',
  'home.aria.customize': 'Настроить',
  'home.button.add-widget': 'Добавить виджет',

  
  
  
  'home.greeting.welcome': 'Добро пожаловать в Journalit!',
  'home.greeting.hey': 'Привет',
  'home.greeting.nightowl': 'Привет, совёнок',
  'home.greeting.still-up': 'ещё не спишь?',
  'home.greeting.late-night': 'ночная сессия?',
  'home.greeting.midnight-oil': 'работаешь допоздна?',
  'home.greeting.good-morning': 'Доброе утро',
  'home.greeting.rise-and-shine': 'Пора просыпаться',
  'home.greeting.morning-trader': 'Утренний трейдер',
  'home.greeting.ready-conquer': 'готов завоевать день?',
  'home.greeting.fresh-start': 'Новый старт',
  'home.greeting.good-afternoon': 'Добрый день',
  'home.greeting.day-going-well': 'Надеюсь, день проходит хорошо',
  'home.greeting.afternoon-checkin': 'Послеобеденная проверка',
  'home.greeting.midday-momentum': 'Дневной импульс',
  'home.greeting.hows-it-going': 'как дела?',
  'home.greeting.good-evening': 'Добрый вечер',
  'home.greeting.winding-down': 'завершаешь день?',
  'home.greeting.evening-review': 'Вечерний обзор',
  'home.greeting.how-did-today-go': 'как прошёл день?',
  'home.greeting.time-to-reflect': 'Время для анализа',
  'home.greeting.welcome-back': 'С возвращением',
  'home.greeting.name-placeholder': 'Ваше имя',
  'home.greeting.edit-name-aria': '{name}. Изменить отображаемое имя',
  'home.greeting.hey-there': 'Привет',
  'home.greeting.good-to-see-you': 'Рады вас видеть',

  
  
  
  'home.subtitle.first-time': 'Давайте начнём ваш путь в трейдинге',
  'home.subtitle.see-how-doing': 'Давайте посмотрим, как вы продвигаетесь',
  'home.subtitle.elevate-trading': 'Время поднять уровень своей торговли',
  'home.subtitle.journey-continues': 'Ваш путь в трейдинге продолжается',
  'home.subtitle.check-progress': 'Давайте проверим ваш прогресс',
  'home.subtitle.ready-elevate': 'Готовы улучшить свою торговлю?',
  'home.subtitle.agenda-today': 'Что в повестке дня на сегодня?',
  'home.subtitle.trading-going': 'Как дела с вашей торговлей?',

  
  
  
  'home.grid.error.title': 'Ошибка макета сетки',
  'home.grid.error.message': 'Ошибка: {error}',
  'home.grid.error.retry': 'Повторить',
  'home.grid.widget.remove-aria': 'Удалить виджет',
  'home.grid.widget.unknown-type': 'Неизвестный тип виджета: {widgetId}',

  
  
  
  'home.widget.unreviewed.all-reviewed': 'Все сделки проверены',
  'home.widget.unreviewed.title-review': 'Откройте журнал сделок для проверки',
  'home.widget.unreviewed.today': '{count} сегодня',
  'home.widget.unreviewed.this-week': '{count} на этой неделе',

  
  
  
  'home.widget.embedded-note.title': 'Встроенная заметка',
  'home.widget.embedded-note.select-note': 'Выбрать заметку',
  'home.widget.embedded-note.search-placeholder': 'Поиск заметок...',
  'home.widget.embedded-note.no-notes': 'Заметки не найдены',

  'home.widget.embedded-note.open-note': 'Нажмите, чтобы открыть заметку',
  'home.widget.embedded-note.change-note': 'Изменить заметку',
  'home.widget.embedded-note.error.not-found': 'Файл не найден: {path}',
  'home.widget.embedded-note.error.load-failed':
    'Ошибка при загрузке содержимого заметки',
  'home.widget.embedded-note.error.deleted': 'Исходный файл был удалён',

  
  
  
  'home.widget.goals-progress.type.pnl': 'Цель по P&L',
  'home.widget.goals-progress.type.pnl-desc': 'Цель прибыли/убытка за период',
  'home.widget.goals-progress.type.trades-logged': 'Количество сделок',
  'home.widget.goals-progress.type.trades-logged-desc':
    'Общее количество сделок за всё время',
  'home.widget.goals-progress.type.win-rate': 'Процент побед',
  'home.widget.goals-progress.type.win-rate-desc':
    'Целевой процент прибыльных сделок',
  'home.widget.goals-progress.period.daily': 'Ежедневно',
  'home.widget.goals-progress.period.weekly': 'Еженедельно',
  'home.widget.goals-progress.period.monthly': 'Ежемесячно',
  'home.widget.goals-progress.period-label.today': 'сегодня',
  'home.widget.goals-progress.period-label.this-week': 'на этой неделе',
  'home.widget.goals-progress.period-label.this-month': 'в этом месяце',
  'home.widget.goals-progress.period-label.total': 'всего',
  'home.widget.goals-progress.trades-count': '{count} сделок',
  'home.widget.goals-progress.set-goal': 'Установить цель',
  'home.widget.goals-progress.target': 'Цель',
  'home.widget.goals-progress.tracks-lifetime': 'Отслеживает общее количество',
  'home.widget.goals-progress.use-r-multiples':
    'Использовать R-мультипликаторы',
  'home.widget.goals-progress.account-aware': 'Цели по счетам',
  'home.widget.goals-progress.no-target-selected':
    'Нет цели для выбранного счета',
  'home.widget.goals-progress.configured-for': 'Настроено для {accounts}',
  'home.widget.goals-progress.account-scope': 'Охват счетов',
  'home.widget.goals-progress.add-account': 'Добавить счёт',
  'home.widget.goals-progress.click-to-set': 'Нажмите, чтобы установить цель',
  'home.widget.goals-progress.header.pnl': 'Цель по P&L',
  'home.widget.goals-progress.header.trades': 'Цель по сделкам',
  'home.widget.goals-progress.header.win-rate': 'Цель по проценту побед',
  'home.widget.goals-progress.of-target': 'из {target} {period}',
  'home.widget.goals-progress.complete-100': '100% достигнуто',
  'home.widget.goals-progress.complete-percent': '{percent}% достигнуто',
  'home.widget.goals-progress.goal-reached': 'Цель достигнута',
  'home.widget.goals-progress.aria.save-goal': 'Сохранить цель',
  'home.widget.goals-progress.aria.set-goal': 'Установить цель',
  'home.widget.goals-progress.aria.change-goal': 'Нажмите для изменения цели',

  
  
  
  'home.widget.best-hours.title': 'Лучшие часы',
  'home.widget.best-hours.no-data': 'Нет данных по сделкам',
  'home.widget.best-hours.trades-count': '{count} сделок',
  'home.widget.best-hours.win-rate': '{rate}% побед',
  'home.widget.best-hours.win-rate-na': 'Процент побед недоступен',
  'home.widget.best-hours.days-count': '{count} дн.',
  'home.widget.best-hours.avg-per-trade': 'средн./сделка',

  'home.widget.best-hours.hidden': 'Скрыто',
  'home.widget.best-hours.hidden-detail': 'Режим приватности',
  'home.widget.best-hours.no-positive-window': 'Нет положительного окна',
  'home.widget.best-hours.insufficient-history': 'Нужно больше данных',
  'home.widget.best-hours.sample-requirement': '{count}/2 окон с выборкой',
  'home.widget.best-hours.developing': 'формируется',
  'home.widget.best-hours.no-positive-detail': 'Окна с выборкой отрицательные',

  
  
  
  'home.widget.aum.title': 'AUM',
  'home.widget.aum.current-trend': 'Сейчас · динамика за 30 дней',
  'home.widget.aum.period.month': 'В этом месяце',
  'home.widget.aum.period.quarter': 'В этом квартале',
  'home.widget.aum.period.year': 'В этом году',
  'home.widget.aum.period.all': 'За всё время',
  'home.widget.aum.unable-to-load': 'Не удалось загрузить',
  'home.widget.aum.no-accounts': 'Нет счетов',
  'home.widget.aum.account-count': '{count} счёт',
  'home.widget.aum.account-count-plural': '{count} счетов',

  
  
  
  'home.widget.streak.title': 'Серия',
  'home.widget.streak.period.ever': 'за всё время',
  'home.widget.streak.win': 'победа',
  'home.widget.streak.wins': 'победы',
  'home.widget.streak.loss': 'убыток',
  'home.widget.streak.losses': 'убытки',
  'home.widget.streak.in-a-row': 'подряд',
  'home.widget.streak.no-active': 'нет активной серии',
  'home.widget.streak.start-trading': 'начните торговлю, чтобы начать серию',
  'home.widget.streak.best-streak': 'ваша лучшая серия {period}',
  'home.widget.streak.above-average': 'выше вашего среднего {period}',
  'home.widget.streak.stay-focused': 'оставайтесь сосредоточены, продолжайте',
  'home.widget.streak.keep-going': 'продолжайте',
  'home.widget.streak.good-start': 'хороший старт',
  'home.widget.streak.pause': 'пауза перед следующей сделкой',
  'home.widget.streak.review': 'проверьте перед следующей сделкой',
  'home.widget.streak.losses-process': 'убытки — часть процесса',
  'home.widget.streak.best': 'лучшая',
  'home.widget.streak.avg': 'средняя',

  
  
  
  'home.widget.drawdown.title': 'Лимит просадки',
  'home.widget.drawdown.breached': 'Превышен',
  'home.widget.drawdown.remaining': 'осталось',
  'home.widget.drawdown.unable-to-load': 'Не удалось загрузить',
  'home.widget.drawdown.no-accounts': 'Нет счетов с лимитами',

  'home.widget.profit-target.title': 'Цель прибыли',
  'home.widget.profit-target.achieved': 'Достигнута',
  'home.widget.profit-target.remaining': 'осталось',
  'home.widget.profit-target.unable-to-load': 'Не удалось загрузить',
  'home.widget.profit-target.no-accounts': 'Нет счетов с целями',
  'home.widget.account-progress.configure-aria': 'Выбрать счета для {widget}',
  'home.widget.account-progress.config-title': 'Показываемые счета',
  'home.widget.account-progress.mode.automatic': 'Автоматически',
  'home.widget.account-progress.mode.selected': 'Выбрать счета',
  'home.widget.account-progress.automatic-drawdown':
    'Сначала с наибольшей просадкой.',
  'home.widget.account-progress.automatic-profit-target':
    'Сначала ближайшие к цели.',
  'home.widget.account-progress.max-label': 'Показывать до',
  'home.widget.account-progress.max-all': 'Все',
  'home.widget.account-progress.select-hint': 'Выберите сколько угодно.',
  'home.widget.account-progress.no-eligible': 'Пока нет счетов для выбора.',
  'home.widget.account-progress.none-selected':
    'Счета не выбраны. Нажмите, чтобы выбрать.',
  'home.widget.account-progress.search': 'Поиск счетов',
  'home.widget.account-progress.select-all': 'Все',
  'home.widget.account-progress.select-none': 'Ни одного',
  'home.widget.account-progress.select-all-aria':
    'Выбрать все показанные счета',
  'home.widget.account-progress.select-none-aria':
    'Снять выбор с показанных счетов',
  'home.widget.account-progress.no-match': 'Нет подходящих счетов.',
  'home.widget.account-progress.none-available':
    'Ни один из выбранных счетов нельзя показать. Нажмите, чтобы выбрать другие.',
  'home.widget.eval-roi.title': 'ROI оценок',
  'home.widget.eval-roi.unable-to-load': 'Не удалось загрузить',
  'home.widget.eval-roi.no-challenges': 'Нет проп-челленджей',
  'home.widget.eval-roi.challenge-count': '{count} оценка',
  'home.widget.eval-roi.challenge-count-plural': '{count} оценок',
  'home.widget.eval-roi.net': 'Чистыми',
  'home.widget.eval-roi.spent': 'Потрачено',
  'home.widget.eval-roi.break-even': 'Безубыточность',
  'home.widget.challenge-alerts.title': 'Оповещения челленджей',
  'home.widget.challenge-alerts.unable-to-load':
    'Не удалось проверить оповещения челленджа',
  'home.widget.challenge-alerts.empty': 'Нет оповещений',
  'home.widget.challenge-alerts.count': '{count} оповещение',
  'home.widget.challenge-alerts.count-plural': '{count} оповещений',
  'home.widget.challenge-alerts.more': 'ещё {count}',
  'home.widget.challenge-alerts.kind.failed': 'Провален',
  'home.widget.challenge-alerts.kind.target': 'Цель достигнута',
  'home.widget.challenge-alerts.kind.passed': 'Пройден',
  'home.widget.challenge-alerts.kind.payout': 'Выплата готова',
  'home.widget.challenge-alerts.kind.lost': 'Выплата недоступна',
  'home.widget.challenge-alerts.kind.unknown-account': 'Новый счёт {label}',
  'home.widget.eval-roi.roi-aria': 'Доходность расходов на оценки',
  
  
  
  'home.widget.recent.title': 'Недавние',
  'home.widget.recent.unknown': 'Неизвестно',
  'home.widget.recent.just-now': 'Только что',
  'home.widget.recent.minutes-ago': '{minutes}м назад',
  'home.widget.recent.hours-ago': '{hours}ч назад',
  'home.widget.recent.days-ago': '{days}д назад',
  'home.widget.recent.no-items': 'Пока нет недавних элементов',
  'home.widget.recent.hint':
    'Открывайте файлы или представления, чтобы видеть их здесь',

  
  
  
  'home.widget.top-breakdown.title': 'Топ {dimension}',
  'home.widget.top-breakdown.configure-title': 'Настроить топ {dimension}',
  'home.widget.top-breakdown.aria.customize':
    'Нажмите, чтобы настроить топ {dimension}',

  'home.widget.setups.trades-count': '{count} сделок',
  'home.widget.setups.win-rate': '{rate}% побед',

  
  
  
  'home.widget.weekly.title': 'На этой неделе',
  'home.widget.weekly.no-trades': 'на этой неделе сделок ещё нет',
  'home.widget.weekly.breakeven': 'пока безубыточная неделя',
  'home.widget.weekly.losing-days': '{count} убыточных дней подряд',
  'home.widget.weekly.winning-days': '{count} прибыльных дней подряд',
  'home.widget.weekly.above-average': 'выше вашего еженедельного среднего',
  'home.widget.weekly.below-average': 'ниже вашего еженедельного среднего',
  'home.widget.weekly.better-than-last': 'лучше, чем на прошлой неделе',
  'home.widget.weekly.slower-than-last': 'медленнее, чем на прошлой неделе',
  'home.widget.weekly.on-track': 'вы в норме на этой неделе',
  'home.widget.weekly.room-to-recover': 'есть возможность восстановиться',
  'home.widget.weekly.solid-start': 'хорошее начало недели',
  'home.widget.weekly.early-in-week': 'начало недели',
  'home.widget.weekly.no-trade-data': 'Нет данных о сделках',
  'home.widget.weekly.trade': 'сделка',
  'home.widget.weekly.trades': 'сделки',
  'home.widget.weekly.no-trades-tooltip': 'нет сделок',

  
  
  
  'home.widget.heatmap.last-3-months': 'Последние 3 месяца',
  'home.widget.heatmap.last-6-months': 'Последние 6 месяцев',
  'home.widget.heatmap.year-activity': 'Активность {year}',
  'home.widget.heatmap.select-year': 'Выберите год',
  'home.widget.heatmap.close-selector': 'Закрыть селектор года',

  
  
  

  

  

  
  
  

  

  

  

  

  

  

  

  
  
  

  
  
  

  

  

  

  'drc.missed-trades.label.reason': 'Причина:',

  

  
  
  
  'calendar.day.mon': 'Пн',
  'calendar.day.tue': 'Вт',
  'calendar.day.wed': 'Ср',
  'calendar.day.thu': 'Чт',
  'calendar.day.fri': 'Пт',
  'calendar.day.sat': 'Сб',
  'calendar.day.sun': 'Вс',
  'calendar.month.jan': 'Янв',
  'calendar.month.feb': 'Фев',
  'calendar.month.mar': 'Мар',
  'calendar.month.apr': 'Апр',
  'calendar.month.may': 'Май',
  'calendar.month.jun': 'Июн',
  'calendar.month.jul': 'Июл',
  'calendar.month.aug': 'Авг',
  'calendar.month.sep': 'Сен',
  'calendar.month.oct': 'Окт',
  'calendar.month.nov': 'Ноя',
  'calendar.month.dec': 'Дек',
  'calendar.legend.less': 'Меньше',
  'calendar.legend.more': 'Больше',
  'calendar.weekday.mon': 'Пн',
  'calendar.weekday.tue': 'Вт',
  'calendar.weekday.wed': 'Ср',
  'calendar.weekday.thu': 'Чт',
  'calendar.weekday.fri': 'Пт',
  'calendar.weekday.sat': 'Сб',
  'calendar.weekday.sun': 'Вс',
  'calendar.pnl': 'P&L',
  'calendar.week': 'НЕДЕЛЯ',
  'calendar.trade': '{count} сделка',
  'calendar.trades': '{count} сделки',
  'calendar.missed': '{count} упущено',
  'calendar.trades-short': '{count}С',
  'calendar.missed-short': '{count}У',
  'calendar.reviewed': 'Проанализировано',
  'calendar.month.january': 'Январь',
  'calendar.month.february': 'Февраль',
  'calendar.month.march': 'Март',
  'calendar.month.april': 'Апрель',
  'calendar.month.june': 'Июнь',
  'calendar.month.july': 'Июль',
  'calendar.month.august': 'Август',
  'calendar.month.september': 'Сентябрь',
  'calendar.month.october': 'Октябрь',
  'calendar.month.november': 'Ноябрь',
  'calendar.month.december': 'Декабрь',

  
  
  
  'metric.netPnL.name': 'Чистая P&L',
  'metric.netPnL.description': 'Общая прибыль и убыток по всем сделкам',
  'metric.winRate.name': 'Винрейт',
  'metric.winRate.description': 'Процент прибыльных сделок',
  'metric.profitFactor.name': 'Профит-фактор',
  'metric.profitFactor.description': 'Валовая прибыль к валовому убытку',
  'metric.calmarRatio.name': 'Коэффициент Кальмара',
  'metric.calmarRatio.description':
    'Среднегодовая реализованная доходность к максимальной процентной просадке',
  'dashboard.calmarRatio.tooltip.formula':
    'Годовая доходность, делённая на максимальную просадку.',
  'dashboard.calmarRatio.unavailable.no-history':
    'Пока нет истории реализованных результатов.',
  'dashboard.calmarRatio.unavailable.capital':
    'Начальный капитал в валюте отображения недоступен.',
  'dashboard.calmarRatio.unavailable.incomplete-history':
    'Некоторые реализованные результаты отсутствуют.',
  'dashboard.calmarRatio.unavailable.dates':
    'Некоторые даты сделок отсутствуют.',
  'dashboard.calmarRatio.unavailable.short-history':
    'Нужен минимум один день истории.',
  'dashboard.calmarRatio.unavailable.no-drawdown':
    'Просадка ещё не зафиксирована.',
  'dashboard.calmarRatio.unavailable.non-positive-equity':
    'Капитал достиг нуля или стал отрицательным.',
  'dashboard.calmarRatio.unavailable.non-finite':
    'Результат слишком велик для расчёта.',
  'dashboard.calmarRatio.unavailable.scope':
    'Выберите весь период и только целые счета.',
  'dashboard.calmarRatio.unavailable.conversion':
    'Некоторые валютные конвертации недоступны.',
  'metric.sharpeRatio.name': 'Коэффициент Шарпа',
  'metric.sharpeRatio.description': 'Средний P&L сделки к её волатильности',
  'metric.expectancy.name': 'Математическое ожидание',
  'metric.expectancy.description': 'Средняя сумма прибыли или убытка на сделку',
  'metric.maxDrawdown.name': 'Максимальная просадка',
  'metric.maxDrawdown.description':
    'Наибольшее падение от прошлого максимума P&L',
  'metric.bestDay.name': 'Лучший день',
  'metric.bestDay.description': 'Наибольшая P&L за один день',
  'metric.largestWin.name': 'Самая большая прибыльная сделка',
  'metric.largestWin.description': 'Сделка с наибольшей прибылью',
  'metric.largestLoss.name': 'Самая большая убыточная сделка',
  'metric.largestLoss.description': 'Сделка с наибольшим убытком',
  'metric.longestWinStreak.name': 'Лучшая серия',
  'metric.longestWinStreak.description':
    'Самая длинная серия прибыльных сделок',
  'metric.longestLossStreak.name': 'Худшая серия',
  'metric.longestLossStreak.description':
    'Самая длинная серия убыточных сделок',
  'metric.numTrades.name': 'Всего сделок',
  'metric.numTrades.description': 'Общее количество закрытых сделок',
  'metric.numWinTrades.name': 'Прибыльные сделки',
  'metric.numWinTrades.description': 'Количество прибыльных сделок',
  'metric.numLossTrades.name': 'Убыточные сделки',
  'metric.numLossTrades.description': 'Количество убыточных сделок',
  'metric.avgWin.name': 'Средняя прибыль',
  'metric.avgWin.description': 'Средняя прибыль по прибыльным сделкам',
  'metric.avgLoss.name': 'Средний убыток',
  'metric.avgLoss.description': 'Средний убыток по убыточным сделкам',
  'metric.avgRR.name': 'Средний RR (Payoff)',
  'metric.avgRR.description': 'Средняя прибыль / средний убыток',
  'metric.avgRRRiskBased.name': 'Средний RR (на основе R)',
  'metric.avgRRRiskBased.description':
    'Средний R прибыли и убытка (нужен стоп)',
  'metric.avgHoldTime.name': 'Среднее время удержания',
  'metric.avgHoldTime.description': 'Среднее время удержания сделок',
  'metric.avgWinHoldTime.name': 'Среднее время удержания прибыльных',
  'metric.avgWinHoldTime.description': 'Среднее удержание прибыльных сделок',
  'metric.avgLossHoldTime.name': 'Среднее время удержания убыточных',
  'metric.avgLossHoldTime.description': 'Среднее удержание убыточных сделок',

  'metric.avgWinnerHeat.name': 'Ср. MAE прибыльных',
  'metric.avgWinnerHeat.description': 'Средний MAE прибыльных сделок',
  'metric.winnerMaeP90.name': 'MAE P90 прибыльных',
  'metric.winnerMaeP90.description': '90-й перцентиль MAE прибыльных сделок',
  'metric.winnerMaeMedian.name': 'Медиана MAE прибыльных',
  'metric.winnerMaeMedian.description': 'Медианный MAE прибыльных сделок',
  'metric.avgLossHeat.name': 'Ср. MAE убыточных',
  'metric.avgLossHeat.description': 'Средний MAE убыточных сделок',
  'metric.winnerAvgMfe.name': 'Ср. MFE прибыльных',
  'metric.winnerAvgMfe.description': 'Средний MFE прибыльных сделок',
  'metric.loserAvgMfe.name': 'Ср. MFE убыточных',
  'metric.loserAvgMfe.description': 'Средний MFE убыточных сделок',
  'metric.winnerMfeP90.name': 'MFE P90 прибыльных',
  'metric.winnerMfeP90.description': '90-й перцентиль MFE прибыльных сделок',
  'metric.loserMfeP90.name': 'MFE P90 убыточных',
  'metric.loserMfeP90.description': '90-й перцентиль MFE убыточных сделок',
  'metric.timeInDrawdown.name': 'Время в просадке',
  'metric.timeInDrawdown.description': 'Доля времени ниже максимума P&L',
  'metric.avgRecoveryTime.name': 'Среднее время восстановления',
  'metric.avgRecoveryTime.description': 'Среднее время выхода из просадки',
  'metric.longestDrawdown.name': 'Самая длинная просадка',
  'metric.longestDrawdown.description': 'Самое долгое время в одной просадке',
  'metric.drawdownEpisodes.name': 'Эпизоды просадки',
  'metric.drawdownEpisodes.description':
    'Количество отдельных периодов просадки',

  
  
  

  
  'error.render-component': 'Ошибка отрисовки {component}: {error}',

  
  'error.session-expired':
    'Ваш сеанс истёк. Пожалуйста, войдите снова в настройках плагина.',
  'error.ftp-not-found':
    'FTP-аккаунт не найден. Система автоматически создаст его для вас.',
  'error.no-trading-data':
    'Торговые данные не найдены. Убедитесь, что ваш счёт MetaTrader правильно подключён и имеет историю сделок.',
  'error.unable-connect-service':
    'Не удалось подключиться к сервису торговых данных. Проверьте подключение к интернету.',
  'error.invalid-verification-code':
    'Недопустимый код подтверждения. Проверьте код и попробуйте снова.',
  'error.invalid-registration-data':
    'Недопустимые регистрационные данные. Проверьте настройки и попробуйте снова.',
  'error.invalid-request':
    'Недопустимый запрос. Проверьте введённые данные и попробуйте снова.',
  'error.access-denied':
    'Доступ запрещён. Проверьте права доступа к вашему счёту или обратитесь в поддержку.',
  'error.too-many-requests':
    'Слишком много запросов. Подождите немного и попробуйте снова.',
  'error.service-unavailable':
    'Сервис торговых данных временно недоступен. Попробуйте снова через несколько минут.',
  'error.server-error':
    'Произошла ошибка сервера. Попробуйте позже или обратитесь в поддержку, если проблема сохраняется.',
  'error.network-error':
    'Не удаётся подключиться к сервису торговых данных. Проверьте подключение к интернету и попробуйте снова.',
  'error.unknown': 'Произошла неизвестная ошибка',
  'error.unexpected':
    'Произошла непредвиденная ошибка. Попробуйте снова или обратитесь в поддержку, если проблема сохраняется.',

  
  'error.settings.invalid-pattern':
    'Недопустимый шаблон валидации. Проверьте регулярное выражение и попробуйте снова.',
  'error.settings.field-name-conflict':
    'Это имя поля конфликтует с существующим полем. Выберите другое имя.',
  'error.settings.invalid-field-name':
    'Недопустимое имя поля. Имена полей могут содержать только буквы, цифры и символы подчёркивания.',
  'error.settings.save-failed':
    'Не удалось сохранить изменения. Проверьте настройки и попробуйте снова.',
  'error.settings.load-failed':
    'Не удалось загрузить настройки пользовательских полей. Ваши пользовательские поля могут отображаться некорректно.',
  'error.settings.import-failed':
    'Не удалось импортировать настройки полей. Проверьте формат файла и попробуйте снова.',
  'error.settings.create-failed':
    'Не удалось создать пользовательское поле. Проверьте введённые данные и попробуйте снова.',
  'error.settings.remove-failed':
    'Не удалось удалить пользовательское поле. Попробуйте снова.',
  'error.settings.generic':
    'Произошла ошибка при управлении пользовательскими полями. Проверьте настройки и попробуйте снова.',

  
  'error.options.duplicate':
    'Этот вариант уже существует. Выберите другое имя.',
  'error.options.invalid-ticker':
    'Недопустимый тикер. Используйте только буквы, цифры и точки (например, AAPL, SPX).',
  'error.options.add-ticker-failed':
    'Не удалось добавить тикер. Проверьте формат и попробуйте снова.',
  'error.options.add-failed':
    'Не удалось добавить вариант. Возможно, он уже существует или недопустим.',
  'error.options.update-failed':
    'Не удалось обновить вариант. Возможно, он уже существует или недопустим.',
  'error.options.remove-failed':
    'Не удалось удалить вариант. Попробуйте снова.',
  'error.options.no-options-reset':
    'Нет вариантов для сброса. Категория уже пуста.',
  'error.options.reset-failed':
    'Не удалось сбросить варианты. Попробуйте снова.',
  'error.options.save-failed':
    'Не удалось сохранить изменения вариантов. Проверьте настройки и попробуйте снова.',
  'error.options.generic':
    'Произошла ошибка при управлении вариантами. Попробуйте снова.',

  
  'error.clipboard.permission-denied':
    'Доступ к буферу обмена запрещён. Разрешите доступ к буферу обмена в браузере для функции вставки.',
  'error.clipboard.not-supported':
    'Вставка из буфера обмена не поддерживается в вашем браузере. Попробуйте использовать Ctrl+V или Cmd+V.',
  'error.clipboard.image-too-large':
    'Изображение слишком большое для вставки. Используйте изображения размером менее 10 МБ.',
  'error.clipboard.no-content':
    'В буфере обмена ничего не найдено для вставки. Сначала скопируйте изображение.',
  'error.clipboard.no-images':
    'Изображения в буфере обмена не найдены. Убедитесь, что вы скопировали изображение, а не текст или другое содержимое.',
  'error.clipboard.network-error':
    'Произошла сетевая ошибка при обработке вставки. Проверьте подключение и попробуйте снова.',
  'error.clipboard.paste-failed':
    'Не удалось выполнить операцию вставки. Попробуйте скопировать изображение заново и вставить.',
  'error.clipboard.generic':
    'Операция с буфером обмена не удалась. Попробуйте скопировать содержимое заново и вставить.',

  
  
  

  

  
  
  
  'template.switch-title': 'Сменить layout',
  'template.switch-review-title': 'Сменить layout {type}',

  'template.review-type.drc': 'Дневной анализ',
  'template.review-type.weekly': 'Недельный',
  'template.review-type.monthly': 'Месячный',
  'template.review-type.quarterly': 'Ежеквартальный',
  'template.review-type.yearly': 'Годовой',
  'template.review-type.review': 'Обзор',
  'template.builder.select-template': 'Выберите layout для редактирования',
  'template.builder.loading': 'Загрузка конструктора макетов...',
  'template.builder.create-from-sidebar':
    'Или создайте новый шаблон в боковой панели',
  'template.builder.snippet-coming-soon': 'Редактор фрагментов появится скоро',

  'template.preview.empty': 'В этом макете нет виджетов',
  'template.preview.summary': 'Макет {type} — виджетов: {count}',
  'template.preview.mode': 'Режим предпросмотра',
  'template.preview.markdown-zone-placeholder': 'Зона Markdown — пишите здесь',
  'template.preview.markdown-zone-placeholder-with-id':
    'Зона Markdown ({id}) — пишите здесь',
  'template.preview.widget.game-performance-desc':
    'Распределения оценок ментальной/технической игры',
  'template.preview.widget.unknown-desc': 'Неизвестный тип виджета',

  
  'template.section.forecast': 'Прогноз',
  'template.section.performance': 'Результаты',
  'template.section.review': 'Обзор',
  'template.question.drc.q1': 'Что я сделал хорошо сегодня?',
  'template.question.drc.q2': 'Что я могу улучшить?',
  'template.question.drc.q3': 'На чём я сосредоточусь в следующей сессии?',
  'template.question.weekly.q1': 'Что работало хорошо на этой неделе?',
  'template.question.weekly.q2': 'Что не работало на этой неделе?',
  'template.question.weekly.q3': 'Какие сетапы были наиболее прибыльными?',
  'template.question.weekly.q4': 'Какие ошибки стоили мне больше всего?',
  'template.question.weekly.q5': 'Что я могу улучшить на следующей неделе?',
  'template.question.monthly.q1':
    'Какие ключевые уроки я извлёк(ла) за этот месяц?',
  'template.question.monthly.q2': 'Какие стратегии показали лучшие результаты?',
  'template.question.monthly.q3':
    'Какие закономерности я замечаю в своей торговле?',
  'template.question.monthly.q4': 'Какие у меня цели на следующий месяц?',
  'template.question.monthly.q5': 'Как я могу улучшить управление рисками?',

  'template-picker.empty': 'Нет доступных layoutов.',
  'template-picker.close': 'Закрыть',
  'template-picker.built-in': '(встроенный)',
  'template-picker.badge.default': 'По умолчанию',
  'template-picker.badge.current': 'Текущий',
  'template-picker.cancel': 'Отмена',
  'template.editor.loading': 'Загрузка макета...',
  'template.editor.built-in': 'Встроенный',
  'template.editor.unsaved-changes': 'Несохранённые изменения',

  'template.editor.section-visibility': 'Видимость раздела',
  'template.editor.trade-note-layout': 'Макет заметки сделки',

  'template.editor.other-asset-types': 'Остальные',

  'template.editor.asset-type-add': 'Тип актива',

  'template.editor.remove-asset-layout': 'Удалить макет актива',

  'template.editor.metrics': 'Метрики',
  'template.editor.metrics-desc':
    'Показывать карточки входа, выхода, длительности и плана',
  'template.editor.thesis': 'Тезис',
  'template.editor.thesis-desc': 'Показывать блок тезиса сделки',
  'template.editor.metric-cards': 'Карточки метрик',
  'template.editor.missed-reason': 'Причина пропущенной сделки',
  'template.editor.missed-reason-desc':
    'Показывать, почему пропущенная сделка не была открыта',
  'template.editor.metadata-rows': 'Строки метаданных',
  'template.editor.note-sections': 'Разделы заметки',
  'template.editor.note-sections-desc':
    'Заголовки и текст, которые добавляются под сделкой в новых заметках сделок, для всех типов активов. Потом их можно править в заметке.',
  'template.editor.note-sections-zone-placeholder':
    'Текст для новых заметок о сделках...',
  'template.editor.accounts': 'Счета',
  'template.editor.setups': 'Сетапы',
  'template.editor.mistakes': 'Ошибки',
  'template.editor.tags': 'Теги',
  'template.editor.custom-fields': 'Пользовательские поля',
  'template.editor.custom-fields-desc':
    'Настроено пользовательских полей: {count}',

  'template.editor.metric.position-size': 'Размер позиции',
  'template.editor.metric.execution-breakdown': 'Разбивка исполнения',
  'template.editor.metric.pnl': 'P&L',
  'template.editor.metric.r-multiple': 'R-множитель',
  'template.editor.metric.costs': 'Издержки',
  'template.editor.nav-bar': 'Панель навигации',
  'template.editor.nav-bar-desc':
    'Показывать временную шкалу сделок и ссылки на анализы',
  'template.editor.images': 'Изображения',
  'template.editor.images-desc': 'Показывать графики сделок',
  'template.editor.image-layout': 'Макет изображений',
  'template.editor.image-layout-desc':
    'Показывать изображения по одному или все сразу',
  'template.editor.image-layout-carousel': 'Карусель',
  'template.editor.image-layout-stacked': 'Стопкой',
  'template.editor.metadata': 'Метаданные',
  'template.editor.metadata-desc': 'Показывать счета, сетапы и ошибки',

  'template.editor.review-button': 'Кнопка отметить проверенным',
  'template.editor.review-button-desc':
    'Показывать кнопку отметить сделку как проверённую',
  'template.editor.rating': 'Оценка',
  'template.editor.rating-desc': 'Показывать оценку сделки в звёздах',

  
  
  
  'common.select-option': 'Выберите опцию',

  'common.other': 'Другое',
  'common.breakdown': 'Разбор',
  'common.na': 'Н/Д',
  'common.unknown': 'Неизвестно',
  'common.unknown-error': 'Неизвестная ошибка',
  'common.select-all': 'Выбрать всё',
  'common.n-types': '{count} типов',
  'common.select-item': 'Выберите {item}',
  'common.header': 'Заголовок',

  'common.days': 'Дни',
  'common.weeks': 'Недели',
  'common.months': 'Месяцы',
  'common.years': 'Годы',
  'common.quarter': 'Квартал',
  'common.quarters': 'Кварталы',
  'common.best': 'Лучший',
  'common.worst': 'Худший',

  'common.enabled': 'включено',
  'common.disabled': 'отключено',
  'common.color.gray': 'Серый',
  'common.color.red': 'Красный',
  'common.color.orange': 'Оранжевый',
  'common.color.yellow': 'Жёлтый',
  'common.color.label': 'Цвет',
  'common.color.default': 'По умолчанию',
  'common.day.monday': 'Понедельник',
  'common.day.tuesday': 'Вторник',
  'common.day.wednesday': 'Среда',
  'common.day.thursday': 'Четверг',
  'common.day.friday': 'Пятница',
  'common.day.saturday': 'Суббота',
  'common.day.sunday': 'Воскресенье',
  'common.day.all-week': 'Вся неделя',
  'common.month.january': 'Январь',
  'common.month.february': 'Февраль',
  'common.month.march': 'Март',
  'common.month.april': 'Апрель',
  'common.month.may': 'Май',
  'common.month.june': 'Июнь',
  'common.month.july': 'Июль',
  'common.month.august': 'Август',
  'common.month.september': 'Сентябрь',
  'common.month.october': 'Октябрь',
  'common.month.november': 'Ноябрь',
  'common.month.december': 'Декабрь',
  'common.score.poor': 'Плохо',
  'common.score.below-average': 'Ниже среднего',
  'common.score.average': 'Среднее',
  'common.score.strong': 'Хорошо',
  'common.score.excellent': 'Отлично',
  'common.note-label': 'Примечание:',

  
  
  
  'form.modal.unsaved-changes.title': 'Несохранённые изменения',
  'form.modal.unsaved-changes.body1':
    'У вас есть несохранённые изменения в форме сделки.',
  'form.modal.unsaved-changes.body2':
    'Вы уверены, что хотите закрыть без сохранения?',
  'form.modal.unsaved-changes.continue': 'Продолжить редактирование',
  'form.modal.unsaved-changes.discard': 'Отменить изменения',
  'form.section.custom-fields': 'Пользовательские поля',

  'form.section.custom-fields-empty-title': 'Расширенных полей пока нет.',
  'form.section.custom-fields-empty-desc':
    'Отслеживайте всё, чего нет во встроенных полях: сессию, таймфрейм или оценку сетапа. Пользовательские поля сохраняются с каждой сделкой и могут стать сортируемыми столбцами журнала сделок.',
  'form.section.attachments': 'Вложения',
  'form.field.asset-type.stock': 'Акции',
  'form.field.asset-type.options': 'Опционы',
  'form.field.asset-type.futures': 'Фьючерсы',
  'form.field.asset-type.forex': 'Форекс',
  'form.field.asset-type.crypto': 'Крипто',
  'form.field.asset-type.cfd': 'CFD',
  'form.field.commission-type.fixed': 'Фиксированная',
  'form.field.commission-type.percentage': 'Процент (%)',

  'form.field.closed': 'закрыта',
  'form.field.incl-costs': '(включая затраты)',
  'form.calculated': 'Рассчитано',
  'form.field.option-type': 'Тип опциона',
  'form.field.option-type.call': 'Колл',
  'form.field.option-type.put': 'Пут',
  'form.field.image-url-placeholder': 'Вставьте URL или путь к медиафайлу...',
  'form.field.image-duplicate-error': 'Это изображение уже добавлено.',
  'form.field.trade-image-alt': 'Изображение сделки',
  'form.field.value-dollar': 'Стоимость ($)',
  'form.field.dollar-amount-placeholder': 'Сумма в долларах',
  'form.field.direct-pnl-placeholder': 'Введите общую прибыль или убыток',

  'form.field.mae-placeholder-currency': 'Макс. просадка в {currency}',
  'form.field.mfe-placeholder-currency': 'Макс. прибыль в {currency}',
  'form.error.image-upload-unavailable': 'Загрузка изображений недоступна',

  
  
  
  'library.type.drc': 'ДТО',
  'library.type.weekly': 'Недельный',
  'library.type.monthly': 'Месячный',
  'library.type.quarterly': 'Квартальный',
  'library.type.yearly': 'Годовой',
  'library.type.trade': 'Сделка',
  'library.error.invalid-share-code': 'Недействительный код доступа',
  'library.notice.import-success': 'Layout "{name}" успешно импортирован!',
  'library.error.import-failed': 'Не удалось импортировать layout',
  'library.notice.select-template': 'Пожалуйста, выберите layout для экспорта',
  'library.notice.template-not-found': 'Layout не найден',
  'library.notice.code-generated': 'Код доступа сгенерирован!',
  'library.error.export-failed': 'Не удалось экспортировать layout',
  'library.error.export-too-large':
    'Этот layout слишком велик для экспорта в виде кода доступа.',
  'library.notice.copied': 'Код доступа скопирован в буфер обмена!',
  'library.error.copy-failed': 'Не удалось скопировать в буфер обмена',
  'library.title.import': 'Импорт layoutа',
  'library.desc.import':
    'Вставьте код JRT, чтобы импортировать макет другого пользователя.',
  'library.label.share-code': 'Код доступа',
  'library.placeholder.import-code': 'Вставьте код JRT-... сюда',
  'library.button.validating': 'Проверка...',
  'library.button.validate': 'Проверить',
  'library.button.import': 'Импортировать layout',
  'library.preview.valid': 'Layout действителен',
  'library.preview.invalid': 'Недействительный код доступа',
  'library.title.export': 'Экспорт layoutа',
  'library.desc.export':
    'Поделитесь своим пользовательским шаблоном с другими, сгенерировав код доступа.',
  'library.empty.title': 'Нет пользовательских layoutов для экспорта.',
  'library.empty.hint':
    'Сначала создайте свой макет на вкладках макетов обзоров или сделок, затем вернитесь сюда, чтобы поделиться им.',
  'library.label.select-template': 'Выберите layout',
  'library.option.select-template': '-- Выберите layout --',
  'library.button.generate-code': 'Сгенерировать код доступа',
  'library.button.copy-code': 'Копировать в буфер обмена',

  
  
  
  'backend.title': 'Синхронизация сделок',
  'backend.description':
    'Настройте Trade Sync для поддерживаемых брокеров, чтобы автоматически поддерживать хранилище в актуальном состоянии.',

  

  'trade-sync.gate.pro.description':
    'Синхронизация сделок — функция Pro. Обновите тариф, чтобы продолжить.',

  'trade-sync.gate.feature-unavailable.title': 'Функция недоступна',
  'trade-sync.gate.feature-unavailable.description':
    'Эта функция синхронизации не включена для вашей учётной записи Pro. Обновите статус или обратитесь в службу поддержки, если проблема не исчезнет.',
  'trade-sync.trial.title': 'Автоматизируйте свой торговый журнал',
  'trade-sync.trial.description':
    'Экономьте до 7 часов в неделю с Journalit Pro.',
  'trade-sync.trial.benefit.sync': 'Автоматическая синхронизация сделок',
  'trade-sync.trial.benefit.import': 'Импортируйте сделки откуда угодно',
  'trade-sync.trial.cta': 'Начните бесплатный 14-дневный пробный период',
  'trade-sync.trial.existing-subscriber': 'Уже подписаны? Войдите',
  'trade-sync.trial.eligibility':
    'Бесплатный пробный период доступен только новым подписчикам.',

  

  'premium.gate.cta.continue-pro': 'Перейти к PRO',

  'premium.gate.cta.refresh': 'Обновить статус',

  'premium.gate.offline': 'Похоже, вы не в сети. Для активации нужен интернет.',
  'premium.gate.not-pro-yet':
    'Вы вошли, но ваш аккаунт ещё не PRO. Оформите подписку и обновите статус.',

  'backend.status.connected': 'Подключено',
  'backend.status.disconnected': 'Отключено',
  'backend.status.checking': 'Проверка...',
  'backend.register.title': 'Регистрация хранилища',
  'backend.register.description':
    'Зарегистрируйте это хранилище на торговом сервере для включения синхронизации.',
  'backend.register.button': 'Зарегистрировать хранилище',
  'backend.register.registering': 'Регистрация...',
  'backend.ftp.title': 'Учётные данные FTP',
  'backend.ftp.description':
    'Сгенерируйте учётные данные FTP для загрузки торговых отчётов из MetaTrader.',
  'backend.ftp.create-button': 'Создать учётные данные FTP',
  'backend.ftp.creating': 'Создание...',

  'backend.sync.auto-sync': 'Включить автосинхронизацию',
  'backend.sync.auto-sync-desc':
    'Автоматически синхронизировать сделки при запуске Obsidian и периодически.',
  'backend.sync.auto-sync-info':
    'Автосинхронизация проверяет новые сделки каждый час',
  'backend.sync.auto-sync-aria': 'Включить автосинхронизацию',

  'backend.sync.syncing': 'Синхронизация...',

  'backend.sync.last-result': 'Результат последней синхронизации',
  'backend.sync.synced-trades':
    'Синхронизировано {trades} сделок ({files} новых файлов)',
  'backend.sync.no-new-trades': 'Нет новых сделок для синхронизации',
  'backend.sync.status': 'Статус синхронизации',
  'backend.sync.last-sync': 'Последняя синхронизация',
  'backend.sync.total-syncs': 'Всего синхронизаций',
  'backend.sync.never': 'Никогда',
  'backend.sync.invalid-date': 'Некорректная дата',
  'backend.notice.vault-registered':
    'Хранилище зарегистрировано на торговом сервере',
  'backend.notice.sync-cancelled': 'Синхронизация отменена',
  'backend.notice.sync-in-progress': 'Синхронизация уже выполняется',
  'backend.notice.account-info-failed':
    'Не удалось получить информацию о счёте',
  'backend.notice.sync-batch-progress':
    '⏳ Синхронизация пакета: {count} сделок ({progress}% выполнено, осталось {remaining})',
  'backend.notice.all-trades-synced':
    'Все {count} сделок успешно синхронизированы!',
  'backend.notice.account-created': 'Создан счёт: {name}',
  'backend.notice.batch-complete':
    '⏳ Пакет завершён: {processed}/{total} сделок ({progress}%). Продолжаем...',
  'backend.notice.sync-complete':
    'Синхронизация завершена: обработано {total} сделок ({newFiles} новых, {updated} обновлено) в {accounts} счётах',
  'backend.notice.sync-complete-no-trades':
    'Синхронизация завершена: нет новых сделок',
  'backend.notice.sync-failed': 'Ошибка синхронизации: {error}',

  'backend.accounts.linked': 'Привязанные счета MT',
  'backend.accounts.linked-desc':
    'Счета MetaTrader, обнаруженные в синхронизированных сделках.',
  'backend.accounts.server-disconnected':
    'Подключитесь к серверу, чтобы увидеть привязанные счета.',
  'backend.accounts.loading': 'Загрузка счетов...',
  'backend.accounts.no-accounts': 'Счета не найдены.',
  'backend.accounts.sync-to-detect':
    'Синхронизируйте сделки для обнаружения счетов.',
  'backend.accounts.connect-to-see':
    'Подключитесь к торговому серверу, чтобы увидеть привязанные счета.',
  'backend.accounts.account-id': 'ID счёта',
  'backend.accounts.broker': 'Брокер',
  'backend.accounts.first-seen': 'Первое появление',
  'backend.accounts.last-seen': 'Последнее появление',
  'backend.accounts.refresh': 'Обновить счета',

  
  'backend.accounts.unlink-title': 'Отвязать счёт MetaTrader',
  'backend.accounts.unlink': 'Отвязать',
  'backend.accounts.unlink-confirm':
    'Отвязать счёт MetaTrader {accountId}? Он будет скрыт из Trade Sync, а будущие импорты будут пропускаться, пока вы не привяжете его снова.',
  'backend.accounts.unlink-success': 'Счёт MetaTrader отвязан',
  'backend.accounts.relink': 'Привязать снова',
  'backend.accounts.relink-success': 'Счёт MetaTrader снова привязан',
  'backend.accounts.ignored.title': 'Отвязанные счета',
  'backend.accounts.ignored.count': 'Скрыто: {count}',
  'backend.accounts.ignored.empty': 'Нет отвязанных счетов.',
  'backend.accounts.ignored-at': 'Отвязан',

  
  'backend.cards.connection.title': 'Подключение',
  'backend.cards.connection.refresh': 'Обновить',
  'backend.cards.sync.title': 'Статус Синхронизации',
  'backend.cards.sync.last-sync': 'Последняя синхронизация',
  'backend.cards.sync.total': 'Всего синхронизаций',
  'backend.cards.sync.button': 'Синхронизировать',
  'backend.cards.sync.cancel': 'Отменить синхронизацию',
  'backend.cards.accounts.title': 'Счета',
  'backend.cards.accounts.linked': 'Привязанные счета',
  'backend.cards.accounts.manage': 'Управление',

  
  'backend.section.setup.title': 'Настройка и Конфигурация',
  'backend.section.sync.title': 'Настройки Синхронизации',
  'backend.section.accounts.title': 'Управление Счетами',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI-маппинг Trade Import',
  'settings.auth.feature.trade-sync': 'Синхронизация сделок',
  'settings.auth.feature.economic-calendar': 'Экономический календарь',
  'settings.auth.feature.basic-tracking': 'Базовое отслеживание',

  'settings.auth.feature.manual-entry': 'Ручной ввод сделок',
  'settings.auth.feature.analytics-reviews': 'Аналитика и обзоры',
  'settings.auth.feature.ai-tool-calls-free':
    '100 вызовов ИИ-инструментов в месяц',
  'settings.auth.feature.ai-tool-calls-pro': 'Больше вызовов ИИ-инструментов',
  'settings.auth.feature.priority-support': 'Приоритетная Поддержка',

  
  'backend.sync.just-now': 'Только что',
  'backend.sync.minutes-ago': '{count} мин назад',
  'backend.sync.hours-ago': '{count} ч назад',
  'backend.sync.days-ago': '{count} дн назад',

  
  
  
  'manual-drawdown.notice.deleted': 'Снимок удалён',
  'manual-drawdown.notice.updated': 'Снимок обновлён',
  'manual-drawdown.notice.added': 'Снимок добавлен',
  'manual-drawdown.validation.date-required': 'Дата обязательна',
  'manual-drawdown.validation.invalid-date': 'Введите корректную дату',
  'manual-drawdown.validation.future-date': 'Дата не может быть в будущем',
  'manual-drawdown.validation.limit-required': 'Лимит просадки обязателен',
  'manual-drawdown.validation.limit-positive':
    'Лимит просадки должен быть положительным числом',
  'manual-drawdown.validation.duplicate-date':
    'Снимок на эту дату уже существует',
  'manual-drawdown.section.recorded': 'Записанные снимки',
  'manual-drawdown.table.date': 'Дата',
  'manual-drawdown.table.limit': 'Лимит просадки',
  'manual-drawdown.table.note': 'Заметка',
  'manual-drawdown.table.actions': 'Действия',
  'manual-drawdown.button.editing': 'Редактирование',
  'manual-drawdown.button.edit': 'Редактировать',
  'manual-drawdown.button.delete': 'Удалить',
  'manual-drawdown.header.edit': 'Редактировать снимок',
  'manual-drawdown.header.add': 'Добавить новый снимок',
  'manual-drawdown.field.date': 'Дата просадки',
  'manual-drawdown.field.date-desc': 'Когда брокер установил этот лимит',
  'manual-drawdown.field.limit': 'Минимальный баланс ($)',
  'manual-drawdown.field.limit-desc': 'Минимально допустимый баланс',
  'manual-drawdown.field.note': 'Заметка',
  'manual-drawdown.field.note-desc': 'Дополнительный контекст для этого снимка',
  'manual-drawdown.placeholder.note': 'напр., Отчёт на конец месяца',
  'manual-drawdown.button.update': 'Обновить снимок',
  'manual-drawdown.button.add': 'Добавить снимок',
  'manual-drawdown.button.cancel-edit': 'Отменить редактирование',
  'manual-drawdown.modal.delete-title': 'Удалить снимок?',
  'manual-drawdown.modal.delete-confirm':
    'Вы уверены, что хотите удалить снимок от {date}?',
  'manual-drawdown.modal.delete-limit': 'Лимит просадки: {limit}',
  'manual-drawdown.modal.delete-warning': 'Это действие нельзя отменить.',

  
  
  

  'trade.details.entry': 'Вход',
  'trade.details.exit': 'Выход',

  'trade.details.duration': 'Длительность',

  'trade.details.thesis': 'Торговая идея',

  'trade.details.entries-summary': 'Входов: {count}',
  'trade.details.exits-summary': 'Выходов: {count}',
  'trade.details.take-profit-count': 'Целей: {count}',

  'trade.metadata.account': 'Счёт:',

  'trade.metadata.setups': 'Сетапы',
  'trade.metadata.mistakes': 'Ошибки',
  'trade.image.no-images': 'Изображений для этой сделки нет',
  'trade.image.click-edit': 'Добавить изображение',
  'trade.image.alt-prefix': 'Изображение сделки',
  'command.share-note-as-image': 'Поделиться текущей заметкой как изображением',
  'trade.share.copied': 'Скриншот сделки скопирован в буфер обмена',
  'trade.share.failed': 'Не удалось скопировать скриншот сделки',
  'trade.share.not-ready':
    'Заметка сделки ещё загружается. Повторите попытку через мгновение.',
  'share.review.action': 'Поделиться карточкой обзора',
  'share.trade.modal-title': 'Поделиться сделкой',
  'share.trade.position-return': 'Доходность позиции % (до расходов)',
  'share.trade.account-return': 'Доходность счёта % (текущий баланс)',
  'share.trade.hide-dollar-hint':
    'Выберите R или %, чтобы скрыть денежные суммы. Недоступные значения отображаются прочерком.',
  'share.review.modal-title': 'Поделиться обзором',
  'share.review.section.top': 'Начало заметки',
  'share.review.select-all': 'Выбрать всё',
  'share.review.clear': 'Очистить',
  'share.review.legend.widget': 'Виджет',
  'share.review.legend.heading': 'Заголовок с текстом',
  'share.review.legend.media': 'Медиа',
  'share.review.legend.text': 'Текст',
  'share.review.copy': 'Копировать изображение',
  'settings.general.hide-dollar-amounts-in-shares':
    'Скрывать суммы в долларах на общих изображениях',
  'settings.general.hide-dollar-amounts-in-shares-desc':
    'При включённых R-мультипликаторах скриншоты сделок и карточки обзора не показывают риск, сборы, комиссии и MAE/MFE в долларах.',
  'share.review.hide-dollar-amounts': 'Скрыть суммы в долларах',
  'share.review.hide-dollar-amounts-hint':
    'Не показывает риск, сборы и другие суммы в долларах.',
  'share.review.hide-dollar-amounts-needs-r':
    'Включите R-мультипликаторы в настройках, чтобы делиться без сумм в долларах.',
  'share.review.copied': 'Карточка скопирована в буфер обмена',
  'share.review.failed': 'Не удалось скопировать карточку',
  'trade.header.unknown-instrument': 'Неизвестный инструмент',

  'trade.review.reviewed': 'Проверено',
  'trade.review.reviewed-on': 'Проверено {date}',
  'trade.rating.label': 'Оценка',
  'trade.rating.hint':
    'Нажмите на звезду, чтобы оценить, ещё раз — для половины звезды, и ещё раз, чтобы сбросить оценку',

  
  
  

  'image.uploader.paste-title': 'Вставить медиа из буфера обмена (Ctrl+V)',
  'image.uploader.pasting': 'Вставляется...',
  'image.uploader.paste': 'Вставить',
  'image.uploader.url-placeholder': 'Вставьте URL медиа или путь к файлу...',
  'image.uploader.url-input-aria': 'Поле ввода URL медиа',
  'image.uploader.file-upload-aria': 'Загрузить файл',
  'image.uploader.paste-clipboard-aria': 'Вставить из буфера обмена',
  'image.uploader.error-invalid-url':
    'Недопустимый URL или путь к медиафайлу. Укажите поддерживаемый URL изображения/видео, путь к медиа в хранилище или ссылку Excalidraw.',
  'image.viewer.alt-default': 'Изображение',
  'image.viewer.description-default': 'Предпросмотр медиа',

  'image.viewer.title-fullscreen': 'Нажмите для просмотра на весь экран',

  'image.viewer.delete-button': 'Удалить медиафайл',
  'image.viewer.nav-prev': 'Предыдущее изображение',
  'image.viewer.nav-next': 'Следующее изображение',
  'image.viewer.zoom-in-hint': 'Сведите пальцы или нажмите для увеличения',
  'image.viewer.zoom-out-hint':
    '{scale}x (сведите пальцы или нажмите для уменьшения)',

  'image.youtube.unavailable-title': 'Видео YouTube',

  'image.youtube.unavailable-description': 'Закрытое или недоступное',

  'image.youtube.open': 'Открыть на YouTube',

  'image.viewer.close-aria': 'Закрыть полноэкранный режим',
  'image.viewer.copy-image': 'Копировать изображение',

  'image.viewer.copied': 'Скопировано',
  'image.viewer.copy-failed':
    'Не удалось скопировать изображение в буфер обмена',
  'image.viewer.copy-unsupported':
    'Копирование изображений в буфер обмена не поддерживается в этой среде',
  'media.viewer.video-controls': 'Элементы управления видео',
  'media.viewer.play-video': 'Воспроизвести видео',
  'media.viewer.pause-video': 'Приостановить видео',
  'media.viewer.mute-video': 'Отключить звук видео',
  'media.viewer.unmute-video': 'Включить звук видео',
  'media.viewer.volume': 'Громкость',
  'media.viewer.back-5': 'Назад на 5 секунд',
  'media.viewer.forward-5': 'Вперёд на 5 секунд',
  'media.viewer.timeline': 'Шкала времени видео',

  'image.carousel.no-images': 'Нет изображений для отображения',
  'image.carousel.prev': 'Предыдущее изображение',
  'image.carousel.next': 'Следующее изображение',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'Миниатюра {index}',

  
  
  
  'filter.modal.no-setup': 'Без стратегии',
  'filter.modal.no-tags': 'Без тегов',
  'filter.modal.no-mistakes': 'Без ошибок',
  'filter.modal.type.regular': 'Обычная',
  'filter.summary.regular-trades': 'Обычные сделки',
  'filter.modal.type.backtest': 'Бэктест',

  'filter.modal.review-status.reviewed': 'Проанализированные',
  'filter.modal.review-status.unreviewed': 'Непроанализированные',
  'filter.modal.direction.long-call': 'Лонг/колл',
  'filter.modal.direction.short-put': 'Шорт/пут',
  'filter.modal.section.custom-fields': 'Пользовательские поля',
  'filter.modal.custom-field.none-available': 'Нет доступных значений',

  
  
  
  'builder.sidebar.title': 'Конструктор макета',
  'builder.sidebar.section.trade': 'Сделка',
  'builder.sidebar.section.drc': 'Дневной анализ',
  'builder.sidebar.section.weekly': 'Еженедельно',
  'builder.sidebar.section.monthly': 'Ежемесячно',
  'builder.sidebar.section.quarterly': 'Ежеквартально',
  'builder.sidebar.section.yearly': 'Ежегодно',
  'builder.sidebar.section.library': 'Библиотека',
  'builder.sidebar.new-item': 'Новый {title}',
  'builder.sidebar.coming-soon': 'Скоро',
  'builder.sidebar.built-in': 'Встроенный',
  'builder.sidebar.default-template': 'Layout по умолчанию',
  'builder.sidebar.set-as-default': 'Установить по умолчанию',
  'builder.sidebar.duplicate': 'Дублировать',
  'builder.sidebar.delete': 'Удалить',
  'builder.sidebar.no-templates': 'Layoutов пока нет',
  'builder.sidebar.share-template': 'Поделиться layoutом',
  'builder.sidebar.new-template-name': 'Новый layout {type}',
  'builder.sidebar.copy-suffix': '(Копия)',

  
  
  

  
  
  

  
  
  
  'button.done': 'Готово',
  'button.edit': 'Редактировать',
  'button.reset-to-defaults': 'Сбросить на значения по умолчанию',
  'button.back': 'Назад',
  'button.maybe-later': 'Может быть позже',
  'button.upgrade-now': 'Обновить сейчас',
  'button.remove': 'Удалить',

  'button.move-up': 'Переместить вверх',
  'button.move-down': 'Переместить вниз',

  'button.next': 'Далее',
  'button.discard': 'Отменить',
  'guide.scroll-to-target.title': 'Прокрутите, чтобы продолжить руководство',
  'guide.scroll-to-target.description':
    'Следующий шаг сейчас вне экрана. Прокрутите, чтобы продолжить, или позвольте Journalit переместить вас туда.',
  'guide.scroll-to-target.description-up':
    'Следующий шаг находится выше на странице. Прокрутите вверх, чтобы продолжить, или позвольте Journalit переместить вас туда.',
  'guide.scroll-to-target.description-down':
    'Следующий шаг находится ниже на странице. Прокрутите вниз, чтобы продолжить, или позвольте Journalit переместить вас туда.',
  'guide.scroll-to-target.button': 'Показать',

  
  
  
  'templateEditor.loading': 'Загрузка layoutа...',
  'templateEditor.mode.preview': 'Просмотр',
  'templateEditor.mode.editor': 'Редактор',
  'templateEditor.built-in-badge': '(Встроенный)',
  'templateEditor.built-in-notice':
    'Встроенные макеты нельзя редактировать. Создайте копию этого макета или новый макет, чтобы настроить его.',
  'templateEditor.unsaved-changes': 'Несохраненные изменения',
  'templateEditor.field.template-name': 'Имя layoutа',
  'templateEditor.field.widgets': 'Виджеты ({count})',
  'templateEditor.button.add-widget': '+ Добавить виджет',
  'templateEditor.button.insert-widget-here': 'Добавить виджет сюда',
  'templateEditor.button.widget-library-docs':
    'Документация библиотеки виджетов',
  'templateEditor.widget.locked': 'Заблокировано',
  'templateEditor.widget.select-placeholder': 'Выберите виджет...',
  'templateEditor.widget.header-text-placeholder': 'Текст заголовка...',
  'templateEditor.widget.markdown-zone-text-label': 'Предустановленный текст',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'Текст для вставки в новые заметки обзора...',
  'templateEditor.widget.page-size': 'Размер страницы:',
  'templateEditor.widget.show-rating-column': 'Показать столбец оценки',
  'templateEditor.widget.demon-tracker.tracking-method':
    'Отслеживать ошибки по:',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    'Случаям в сделках',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    'Учитывается каждая сделка с этой ошибкой.',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days':
    'Торговым дням',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    'Ошибки из сделок и ежедневных обзоров объединяются и учитываются один раз за торговый день.',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    'Записям ежедневного обзора',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    'Учитываются только ошибки из ежедневных обзоров.',
  'templateEditor.widget.demon-tracker.stop-after':
    'Остановить торговлю после:',

  
  
  

  'datetime.aria.open-picker': 'Открыть выбор даты',

  
  
  

  'timeline.aria.session-navigation': 'Навигация по сделкам за день',
  'timeline.aria.previous-trade': 'Предыдущая сделка: {trade}',
  'timeline.aria.next-trade': 'Следующая сделка: {trade}',
  'timeline.aria.no-previous-trade':
    'В этот торговый день предыдущей сделки нет',
  'timeline.aria.no-next-trade': 'В этот торговый день следующей сделки нет',

  
  
  
  'template-builder.modal.unsaved-changes.title': 'Несохранённые изменения',
  'template-builder.modal.unsaved-changes.body1':
    'В этом макете есть несохранённые изменения.',
  'template-builder.modal.unsaved-changes.body2':
    'Вы уверены, что хотите переключиться без сохранения?',
  'template-builder.modal.unsaved-changes.continue':
    'Продолжить редактирование',
  'template-builder.modal.unsaved-changes.discard': 'Отменить изменения',
  'template-builder.modal.delete.title': 'Удалить layout',
  'template-builder.modal.delete.body':
    'Вы уверены, что хотите удалить "{name}"?',
  'template-builder.modal.delete.warning': 'Это действие невозможно отменить.',
  'template-builder.modal.delete.cancel': 'Отмена',
  'template-builder.modal.delete.confirm': 'Удалить',

  
  
  
  'upgrade.title': 'Обновиться на Pro',
  'upgrade.feature-message':
    '{featureName} является функцией Pro. Обновитесь, чтобы разблокировать расширенную автоматизацию и функции.',
  'upgrade.benefits-title': 'Функции Pro включают:',
  'upgrade.benefit.csv':
    'Импорт CSV с помощью AI-ассистентного сопоставления столбцов',
  'upgrade.benefit.economic-calendar':
    'Экономический календарь с автоматическим еженедельным импортом событий',
  'upgrade.benefit.trade-sync': 'Trade Sync для поддерживаемых брокеров',
  'upgrade.benefit.multi-account': 'Поддержка нескольких аккаунтов',
  'upgrade.benefit.ai-tool-calls':
    'Больше вызовов ИИ-инструментов в месяц для подключённых ИИ-приложений',
  'upgrade.prop-profiles.message-firms':
    'Journalit держит наготове правила {count} проп-фирм, чтобы заполнить ваш челлендж.',
  'upgrade.prop-profiles.message-firm':
    'В Journalit готовы правила каждого челленджа {firm} для автозаполнения.',
  'upgrade.prop-profiles.message':
    'Journalit хранит правила проп-фирм, готовые к подстановке в ваш челлендж.',
  'upgrade.prop-profiles.message-updates':
    'Свяжите челлендж с опубликованными правилами фирмы, и Journalit сообщит, когда фирма их изменит.',
  'upgrade.prop-profiles.message-updates-firm':
    'Свяжите челлендж с опубликованными правилами {firm}, и Journalit сообщит, когда {firm} их изменит.',
  'upgrade.prop-profiles.benefits-title': 'Что Pro заполняет за вас:',
  'upgrade.benefit.prop.rules':
    'Лимиты просадки и дневного убытка прямо из правил вашей фирмы',
  'upgrade.benefit.prop.payout': 'Пороги выплат и условия получения',
  'upgrade.benefit.prop.phases': 'Цели этапов и прогресс выбранного челленджа',
  'upgrade.benefit.prop.updates': 'Обновления правил, когда фирма их меняет',
  'upgrade.trial-notice':
    'Получите 2-недельный бесплатный пробный период для импорта всех ваших исторических сделок и попробуйте все функции Pro без риска.',

  
  
  

  'datepicker.button.clear': 'Очистить',
  'datepicker.button.today': 'Сегодня',
  'datepicker.button.now': 'Сейчас',
  'datepicker.aria.hour': 'Час',
  'datepicker.aria.minute': 'Минута',
  'datepicker.aria.second': 'Секунда',
  'datepicker.aria.previous-month': 'Предыдущий месяц',
  'datepicker.aria.next-month': 'Следующий месяц',
  'datepicker.placeholder.day': 'ДД',
  'datepicker.placeholder.month': 'ММ',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.hour': 'ЧЧ',
  'datepicker.placeholder.minute': 'ММ',
  'datepicker.placeholder.second': 'SS',

  
  
  

  'shared.empty-state.message': 'Данные недоступны',
  'shared.collapsible.active-filters': '{count} активных фильтров',
  'shared.filter.disabled-preview': 'Фильтры отключены в просмотре',
  'shared.filter.open': 'Открыть фильтры',
  'shared.filter.active-count': '{count} активных фильтров',

  
  
  
  'release-notes.title': 'Примечания к релизу',
  'release-notes.loading-plugin': 'Загрузка плагина...',

  'release-notes.no-content': 'Примечания к релизу не найдены',
  'release-notes.current-version': 'Текущая версия: v{version}',
  'release-notes.version': 'Версия {version}',
  'release-notes.link.docs': 'Документация',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',

  
  
  
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'Пик реализованного P&L',
  'chart.tooltip.episode-start': 'Начало эпизода',
  'chart.tooltip.underwater-days': 'Время в просадке',
  'chart.tooltip.underwater-trades': 'Сделок в просадке',

  'chart.tooltip.drawdown-amount': 'Сумма',
  'chart.tooltip.drawdown-percent': 'Просадка в % от {basis}',
  'chart.tooltip.percent-basis': 'База для процента',
  'chart.tooltip.trade-pnl': 'P&L сделки',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': 'ещё {count}',
  'chart.loading': 'Загрузка графика...',
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'Вход',
  'chart.legend.exit': 'Выход',
  'chart.legend.trade': 'Сделка',
  'chart.shared.empty': 'Нет доступных сделок',
  'chart.shared.empty-sub': 'Попробуйте выбрать другой период времени',

  
  
  
  'view.account-page.title': 'Счёт: {name}',
  'view.account-page.title-default': 'Страница счёта',
  'view.account-page.no-account-selected': 'Счёт не выбран',
  'view.account-page.no-account-instructions':
    'Откройте эту страницу из раздела «Счета».',
  'view.account-page.service-loading': 'Загрузка сервиса страницы счёта...',
  'view.account-page.balance-chart-title': 'График баланса счёта',
  'view.account-page.balance-chart-loading': 'Загрузка графика баланса...',

  
  
  
  'template.transformation.orphaned-content.header':
    'Содержимое предыдущего макета',
  'template.transformation.orphaned-content.desc1':
    'Следующее содержимое не поместилось в новый макет.',
  'template.transformation.orphaned-content.desc2':
    'Проверьте и интегрируйте его выше или удалите, если оно больше не требуется.',
  'template.editor.built-in-notice':
    'Встроенные шаблоны нельзя редактировать. Дублируйте этот шаблон или создайте новый для настройки.',

  
  
  
  'paste.notice.image-pasted': 'Изображение успешно вставлено',
  'paste.notice.images-pasted': '{count} изображений успешно вставлены',
  'paste.error.clipboard-not-supported': 'API буфера обмена не поддерживается',
  'paste.error.clipboard-empty':
    'Ничего не найдено в буфере обмена для вставки',
  'paste.error.file-size-exceeds': 'Размер файла {size}МБ превышает лимит',
  'paste.error.no-images-found':
    'В буфере обмена не найдены изображения. Попробуйте сначала скопировать изображение.',
  'paste.error.permission-denied': 'Доступ запрещен',

  
  
  
  'modal.template-switch.title': 'Сменить макет?',
  'modal.template-switch.switching-from': 'Вы переключаетесь с',
  'modal.template-switch.switching-to': 'на',
  'modal.template-switch.has-content-title': 'Эта заметка содержит текст',
  'modal.template-switch.has-content-desc':
    'Содержимое будет перестроено в соответствии с новым макетом. Любое содержимое, которое не',
  'modal.template-switch.cannot-undo':
    'Это действие нельзя отменить (но вы можете переключиться обратно).',
  'modal.template-switch.button.switch': 'Переключить шаблон',

  
  
  

  
  
  

  
  
  
  'ui.toggle-switch.aria-label': 'Переключатель',
  'ui.folder-browser.placeholder': 'Выбрать папку...',
  'ui.folder-browser.root': 'Корневая папка',
  'ui.folder-browser.clear-aria':
    'Очистить для использования расположения по умолчанию',

  
  
  
  'combobox.placeholder.default': 'Выбрать или введите...',
  'combobox.aria.remove-item': 'Удалить {item}',
  'combobox.add-option': 'Добавить "{value}"',

  
  
  
  'skeleton.tradelog.loading': 'Загрузка данных сделок',
  'skeleton.dashboard-widget.loading': 'Загрузка данных виджета',
  'skeleton.account-page.loading': 'Загрузка страницы учетной записи',

  
  
  
  'status-bar.update-available-branded': 'Обновить Journalit',
  'status-bar.update-aria-label': 'Journalit {version} - Нажмите для просмотра',
  'update.available.ready': 'Доступна новая версия',

  
  
  
  'missed-trade.reason-title': 'Почему я пропустил эту сделку',

  
  
  

  'grid.aria.remove-widget': 'Удалить виджет',

  
  
  
  'ribbon.open-journalit': 'Открыть Journalit',

  
  
  

  
  
  
  'onboarding.welcome.title': 'Добро пожаловать в Journalit',
  'onboarding.welcome.subtitle':
    'Торговый журнал, который живёт на вашем устройстве.',
  'onboarding.welcome.cta': 'Настроить мой журнал',
  'onboarding.welcome.chart.week': 'Неделя {count}',
  'onboarding.view.title': 'Онбординг Journalit',
  'onboarding.wizard.skip-aria': 'Пропустить этот шаг',
  'onboarding.wizard.skip-onboarding': 'Пропустить онбординг',

  'onboarding.common.continue': 'Продолжить',
  'onboarding.common.close': 'Закрыть',

  'onboarding.features.badge.pro': 'PRO',

  
  
  

  
  
  

  'onboarding.features.graphic.syncing': 'Синхронизация сделок...',
  'onboarding.features.graphic.complete': 'Синхронизация завершена',
  'onboarding.features.graphic.direction.long': 'ЛОНГ',
  'onboarding.features.graphic.direction.short': 'ШОРТ',
  'onboarding.features.graphic.status.win': 'ПРИБЫЛЬ',
  'onboarding.features.graphic.status.loss': 'УБЫТОК',

  'onboarding.activation.title': 'Войдите в Journalit',

  'onboarding.activation.status.initializing':
    'Генерируем ваш код аутентификации...',

  'onboarding.activation.status.error': 'Ошибка входа',
  'onboarding.activation.error.init':
    'Не удалось начать вход. Проверьте интернет и попробуйте снова.',
  'onboarding.activation.error.denied':
    'Вход отклонён. Вы можете войти позже в настройках.',
  'onboarding.activation.error.expired':
    'Код истёк. Запустите онбординг заново и попробуйте снова.',
  'onboarding.activation.error.generic':
    'Что-то пошло не так. Попробуйте снова.',
  'onboarding.activation.error.save':
    'Вход выполнен, но сохранить не удалось. Перезапустите плагин и попробуйте снова.',
  'onboarding.activation.error.connection':
    'Соединение потеряно. Проверьте интернет и попробуйте снова.',
  'onboarding.activation.notice.invalid-url':
    'Некорректная ссылка активации. Свяжитесь с поддержкой.',

  'onboarding.activation.notice.popup-blocked-manual':
    'Откройте эту ссылку в браузере: {url}',
  'onboarding.activation.notice.copy-code-failed':
    'Не удалось скопировать код. Скопируйте его вручную.',
  'onboarding.activation.label.code': 'Ваш код аутентификации',
  'onboarding.activation.button.copy': 'Копировать код',
  'onboarding.activation.button.copied': 'Скопировано!',
  'onboarding.activation.step.open-browser':
    'Нажмите ниже, чтобы открыть браузер',
  'onboarding.activation.step.enter-code': 'Введите код аутентификации',
  'onboarding.activation.step.complete-signin': 'Завершите вход',
  'onboarding.activation.step.return-here':
    'Вернитесь сюда для автоматического завершения',
  'onboarding.activation.button.open-browser': 'Открыть браузер для входа',
  'onboarding.activation.waiting.title': 'Ожидание входа...',
  'onboarding.activation.waiting.hint': 'Обычно это занимает меньше минуты',
  'onboarding.activation.success.title': 'Вход выполнен!',

  'onboarding.notice.complete-failed':
    'Не удалось сохранить завершение онбординга. Пожалуйста, попробуйте позже.',
  'onboarding.notice.completed': 'Ваш журнал настроен. Онбординг завершён.',
  'onboarding.familiarity.kicker': 'Быстрый вопрос',
  'onboarding.familiarity.title': 'Вы уже пользовались Obsidian?',
  'onboarding.familiarity.subtitle':
    'Journalit работает внутри Obsidian. Если для вас это новое, мы покажем только необходимое.',
  'onboarding.familiarity.option.yes.label': 'Да, я ориентируюсь',
  'onboarding.familiarity.option.yes.description': 'Пропустить ознакомление.',
  'onboarding.familiarity.option.no.label': 'Нет, Obsidian для меня новый',
  'onboarding.familiarity.option.no.description':
    'Один короткий экран, без тура.',
  'onboarding.orientation.kicker': 'Новичок в Obsidian',
  'onboarding.orientation.title': 'Четыре вещи, которые нужно знать',
  'onboarding.orientation.subtitle':
    'Этого достаточно, чтобы пользоваться Journalit.',
  'onboarding.orientation.inside.title': 'Journalit работает внутри Obsidian',
  'onboarding.orientation.inside.body':
    'Сначала изучать Obsidian не нужно. Этот экран — представление Journalit.',
  'onboarding.orientation.sidebar.title': 'Боковая панель — это навигация',
  'onboarding.orientation.sidebar.body':
    'Главная, Панель, Журнал сделок и ваши обзоры находятся там.',
  'onboarding.orientation.sidebar.action': 'Показать боковую панель',
  'onboarding.orientation.sidebar.action-mobile': 'Открыть боковую панель',
  'onboarding.orientation.sidebar.hint':
    'Вот она, слева. Этот экран остаётся открытым.',
  'onboarding.orientation.sidebar.hint-mobile':
    'Она открывается поверх этого экрана. Смахните или коснитесь снаружи, чтобы вернуться.',
  'onboarding.orientation.tabs.title': 'Представления открываются как вкладки',
  'onboarding.orientation.tabs.body':
    'Как эта. Переключайтесь между ними вверху.',
  'onboarding.orientation.privacy.title':
    'Ваш журнал остаётся на вашем устройстве',
  'onboarding.orientation.privacy.body':
    'Заметки, скриншоты и обзоры — это ваши собственные файлы. Через серверы Journalit проходят только сделки, которые вы импортируете или синхронизируете.',
  'onboarding.orientation.continue': 'Понятно',
  'onboarding.data-source.kicker': 'Ваши сделки',
  'onboarding.data-source.title': 'Где сейчас ваши сделки?',
  'onboarding.data-source.subtitle':
    'Ваша история — часть вашего преимущества. Перенесите её, и статистика будет осмысленной с первого дня, а не через месяцы накопления новых сделок.',
  'onboarding.data-source.option.broker.label':
    'У моего брокера или на платформе',
  'onboarding.data-source.option.broker.description':
    'Подключите его или импортируйте экспорт.',
  'onboarding.data-source.option.file.label': 'В моей собственной таблице',
  'onboarding.data-source.option.file.description':
    'Журнал, который вы ведёте в Excel, Google Sheets или CSV.',
  'onboarding.data-source.option.fresh.label': 'Пока нигде, начинаю с нуля',
  'onboarding.data-source.option.fresh.description':
    'Добавляйте сделки по мере их совершения.',
  'onboarding.data-source.option.sample.label': 'Пока нигде, покажите пример',
  'onboarding.data-source.option.sample.description':
    'Осмотрите готовый журнал, прежде чем добавлять свои сделки.',
  'onboarding.broker.kicker': 'Ваш брокер',
  'onboarding.broker.title': 'Какой брокер или платформа?',
  'onboarding.awaiting.sign-in.action': 'Войти, чтобы продолжить',
  'onboarding.awaiting.sign-in.body':
    'Сначала войдите или создайте бесплатный аккаунт Journalit. Затем сделки попадут в ваш журнал.',
  'onboarding.broker.badge.sync': 'Автосинхронизация',
  'onboarding.broker.search': 'Поиск брокеров и платформ',
  'onboarding.broker.subtitle':
    'Мы подберём лучший способ загрузить ваши сделки.',
  'onboarding.broker.option.unlisted.label': 'Его нет в списке',
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title': 'Ещё нет в списке? Скажите, какой брокер',
  'onboarding.broker.request.body':
    'Новые брокеры добавляются по запросу. Назовите своего (пример экспорта поможет); пока что экспортированный файл можно сопоставить вручную.',
  'onboarding.broker.request.discord': 'Запросить в Discord',
  'onboarding.broker.request.continue': 'Продолжить с ручным импортом',
  'onboarding.broker.loading': 'Проверяем поддерживаемых брокеров...',
  'onboarding.broker.offline':
    'Не удалось загрузить полный список. Вы всё равно можете подключить поддерживаемого брокера или импортировать файл.',
  'onboarding.personalise.kicker': 'Настройте журнал',
  'onboarding.personalise.title': 'Несколько быстрых выборов',
  'onboarding.personalise.subtitle':
    'Мы настроим Journalit на основе ваших ответов.',
  'onboarding.personalise.style.question': 'Как вы торгуете?',
  'onboarding.personalise.style.scalping': 'Много сделок в день',
  'onboarding.personalise.style.intraday':
    'Несколько сделок в день, без переноса',
  'onboarding.personalise.style.swing': 'Удержание дни или недели',
  'onboarding.personalise.style.position': 'Удержание недели или месяцы',
  'onboarding.personalise.account.question': 'Какой тип счёта?',
  'onboarding.personalise.account.personal': 'Личный',
  'onboarding.personalise.account.practice': 'Демо или тренировка',
  'onboarding.personalise.account.prop': 'Челлендж проп-фирмы или фандед',
  'onboarding.personalise.asset.question': 'Чем вы в основном торгуете?',
  'onboarding.personalise.asset.stock': 'Акции',
  'onboarding.personalise.asset.futures': 'Фьючерсы',
  'onboarding.personalise.asset.forex': 'Форекс',
  'onboarding.personalise.asset.crypto': 'Крипто',
  'onboarding.personalise.asset.options': 'Опционы',
  'onboarding.personalise.asset.mixed': 'Разное',
  'onboarding.first-trade.kicker': 'Почти готово',
  'onboarding.first-trade.title': 'Добавьте первую сделку',
  'onboarding.first-trade.subtitle':
    'Ваш журнал готов. Запишите сделку, и Journalit начнёт с ней работать.',
  'onboarding.first-trade.cta': 'Добавить первую сделку',
  'onboarding.first-trade.sample': 'Изучить на примере данных',
  'onboarding.preparing-sample.title': 'Готовим ваш пример журнала',
  'onboarding.preparing-sample.body':
    'Это займёт всего несколько секунд. Пока записываются заметки, Obsidian может немного подтормаживать.',
  'onboarding.preparing-sample.starting': 'Запуск…',
  'onboarding.preparing-sample.hint':
    'Пример журнала можно удалить в любой момент через значок в углу.',
  'onboarding.preparing-sample.failed.title':
    'Не удалось создать пример журнала',
  'onboarding.preparing-sample.failed.body':
    'Попробуйте снова или выберите другой способ начать.',
  'onboarding.preparing-sample.retry': 'Повторить',
  'onboarding.sample-exploring.kicker': 'Пример журнала',
  'onboarding.sample-exploring.title': 'Вы изучаете пример журнала',
  'onboarding.sample-exploring.body':
    'Не спешите. Когда выйдете из примера, продолжим здесь: настроим ваш журнал и добавим первую сделку.',
  'onboarding.sample-exploring.exit': 'Выйти из примера и продолжить',
  'onboarding.sample-exploring.failed.title':
    'Не удалось восстановить пример журнала',
  'onboarding.sample-exploring.failed.body':
    'Выйдите из примера, чтобы удалить его остатки, и продолжите настройку своего журнала.',
  'onboarding.awaiting.kicker': 'Ждём ваши первые сделки',
  'onboarding.awaiting.first-sync.title': 'Завершите подключение брокера',
  'onboarding.awaiting.first-sync.body':
    'Завершите подключение в Настройки > Trade Sync. Как только первые сделки синхронизируются, эта настройка закроется сама.',
  'onboarding.awaiting.first-sync.action': 'Открыть Trade Sync',
  'onboarding.awaiting.first-import.title': 'Импортируйте файл',
  'onboarding.awaiting.first-import.body':
    'Завершите импорт на вкладке Trade Import. Как только первые сделки появятся, эта настройка закроется сама.',
  'onboarding.awaiting.first-import.action': 'Открыть Trade Import',
  'onboarding.awaiting.first-trade.title': 'Сохраните первую сделку',
  'onboarding.awaiting.first-trade.body':
    'Как только первая сделка будет сохранена, эта настройка закроется сама.',
  'onboarding.awaiting.first-trade.action': 'Добавить сделку',
  'onboarding.awaiting.change-route': 'Выбрать другой способ',
  'onboarding.notice.personalise-failed':
    'Не удалось применить ваши настройки. Вы можете изменить их позже в настройках.',
  'onboarding.notice.trade-sync-open-failed':
    'Не удалось открыть Trade Sync. Повторите попытку.',
  'onboarding.notice.skip-failed':
    'Не удалось сохранить пропуск онбординга. Пожалуйста, попробуйте позже.',

  

  'trade.metadata.broker-comment': 'Комментарий брокера',

  
  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'Календарь результатов',
  'navigation.section.overview': 'Обзор',
  'navigation.section.reviews': 'Обзоры',
  'navigation.section.tools': 'Инструменты',
  'navigation.edit-mode.toggle': 'Настроить навигацию',
  'navigation.edit-mode.hide-item': 'Скрыть элемент навигации',
  'navigation.edit-mode.restore-section': 'Скрытые элементы',
  'navigation.edit-mode.restore': 'Восстановить',
  'navigation.items.nav-settings': 'Настройки',
  'navigation.shortcuts.add': 'Добавить ярлык',
  'navigation.shortcuts.remove': 'Удалить ярлык',
  'navigation.shortcuts.close': 'Закрыть выбор ярлыка',
  'navigation.shortcuts.search': 'Поиск счетов и сетапов',
  'navigation.shortcuts.accounts': 'Счета',
  'navigation.shortcuts.setups': 'Сетапы',
  'navigation.shortcuts.empty': 'Нет доступных счетов или сетапов',
  'navigation.shortcuts.unavailable': 'Недоступно',
  'navigation.shortcuts.added': 'Добавлено',
  'navigation.shortcuts.parent-required':
    'Удалите связанные ярлыки перед скрытием этого пункта навигации.',
  'navigation.items.nav-home': 'Главная',
  'navigation.items.nav-dashboard': 'Панель',
  'navigation.items.nav-trade-log': 'Журнал сделок',
  'navigation.items.nav-account-dashboard': 'Счета',
  'navigation.items.nav-drc': 'DRC за сегодня',
  'navigation.items.nav-weekly': 'Обзор за эту неделю',
  'navigation.items.nav-monthly': 'Обзор за этот месяц',
  'navigation.items.nav-quarterly': 'Обзор за этот квартал',
  'navigation.items.nav-yearly': 'Обзор за этот год',
  'navigation.items.nav-add-trade': 'Добавить сделку',
  'navigation.items.nav-layout-builder': 'Конструктор макетов',
  'navigation.items.nav-quick-import': 'Быстрый импорт',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-session-mode': 'Режим сессии',
  'navigation.items.nav-economic-calendar': 'Экономический календарь',
  'navigation.items.nav-position-size': 'Калькулятор размера позиции',
  'settings.general.navigation-sidebar': 'Боковая панель навигации',
  'notice.error.open-navigation-sidebar':
    'Не удалось открыть боковую панель навигации. Повторите попытку.',
  'navigation.setting.open': 'Открыть боковую панель навигации',
  'navigation.setting.open.desc':
    'Показать её сейчас и развернуть боковую панель Obsidian, если она свёрнута.',
  'navigation.setting.open.button': 'Открыть панель',
  'calendar.setting.open': 'Открыть календарь',
  'calendar.setting.open.button': 'Открыть календарь',
  'notice.error.open-calendar-sidebar':
    'Не удалось открыть календарь. Повторите попытку.',
  'navigation.setting.tab-behavior': 'Поведение вкладок навигации',
  'navigation.setting.tab-behavior.desc':
    'Как открывать представления и обзоры из боковых панелей Journalit',
  'navigation.setting.tab-behavior.new-tab': 'Открыть в новой вкладке',
  'navigation.setting.tab-behavior.replace': 'Заменить активную вкладку',
  'navigation.search.placeholder': 'Поиск сделок и обзоров...',
  'navigation.search.clear': 'Очистить поиск',
  'navigation.search.section.trades': 'Сделки',
  'navigation.search.section.reviews': 'Обзоры',
  'navigation.search.empty': 'Результаты не найдены',
  'navigation.search.trade-open': 'Открыта',

  'command.open-navigation-sidebar': 'Открыть боковую панель навигации',
  'command.open-calendar-sidebar': 'Открыть боковую панель календаря',
  'command.open-economic-calendar': 'Открыть экономический календарь',

  'widget.directional-drawdown.name': 'Реализованная просадка по направлениям',
  'widget.directional-drawdown.description':
    'Отдельные кривые суммы просадки по закрытым сделкам в лонг и шорт',

  'widget.long-drawdown.name': 'Просадка лонгов',
  'widget.long-drawdown.description':
    'Кривая суммы просадки по закрытым сделкам, только лонг',
  'widget.short-drawdown.name': 'Просадка шортов',
  'widget.short-drawdown.description':
    'Кривая суммы просадки по закрытым сделкам, только шорт',
  'widget.directional-drawdown.title.long': 'Просадка лонгов',
  'widget.directional-drawdown.title.short': 'Просадка шортов',
  'widget.directional-drawdown.empty.not-enough':
    'Недостаточно закрытых сделок для анализа по направлениям',
  'widget.directional-drawdown.empty.no-closed':
    'Нет закрытых направленных сделок за этот период',
  'widget.directional-drawdown.empty.no-long':
    'Нет закрытых сделок в лонг за этот период',
  'widget.directional-drawdown.empty.no-short':
    'Нет закрытых сделок в шорт за этот период',
  'widget.directionalDrawdownChart.name':
    'Реализованная просадка по направлениям',

  'widget.longDrawdownChart.name': 'Просадка лонгов',
  'widget.longDrawdownChart.description': 'Просадка только по лонгам',

  'widget.shortDrawdownChart.name': 'Просадка шортов',
  'widget.shortDrawdownChart.description': 'Просадка только по шортам',

  'widget.drawdownStats.no-conversion':
    'Статистика просадки недоступна для разных валют без конвертации.',

  'guide.skip-guide': 'Пропустить руководство',
  'guide.step-count': 'Шагов: {count}',
  'guide.step-position': 'Шаг {current} из {total}',
  

  'onboarding.activation.button.copy-link': 'Скопировать ссылку',

  'widget.previous-trading-day-context.name':
    'Контекст предыдущего торгового дня',
  'widget.previous-trading-day-context.description':
    'Контекст только для чтения из заголовков предыдущего DRC',
  'widget.previous-trading-day-context.reference-label': 'Предыдущий DRC',
  'widget.previous-trading-day-context.open-source': 'Открыть',
  'widget.previous-trading-day-context.image-alt-prefix':
    'Изображение из предыдущего DRC',
  'widget.previous-trading-day-context.no-sections-configured':
    'Выберите хотя бы один раздел в настройках макета.',
  'widget.previous-trading-day-context.preview-note':
    'Вчера цена сняла ликвидность, отбилась от недельного уровня и закрылась обратно внутри запланированного диапазона.',
  'widget.previous-trading-day-context.preview-bullet-two':
    'Главное отклонение: вход до подтверждения на первом откате.',
  'widget.previous-trading-day-context.preview-source':
    'Предпросмотр: DRC предыдущего торгового дня',
  'widget.previous-trading-day-context.preview-bullet-one':
    'Дневной уклон совпал с планом после импульса на открытии.',
  'widget.weekly-drc-context.name': 'Дневные обзоры по дням недели',
  'widget.weekly-drc-context.description':
    'Показывает выбранные разделы DRC за каждый день в недельном анализе',

  'widget.weekly-drc-context.no-activity': 'В этот день активности не было.',
  'widget.weekly-drc-context.no-sections-configured':
    'Выберите хотя бы один раздел DRC в настройках макета.',
  'widget.weekly-drc-context.current-week-not-found':
    'Текущий недельный анализ не найден.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'Дата текущего недельного анализа не найдена.',
  'widget.weekly-drc-context.load-error':
    'Не удалось загрузить недельный анализ DRC.',
  'widget.weekly-drc-context.invalid-context':
    'Этот виджет доступен только в еженедельных обзорах',
  'templateEditor.widget.weekly-drc-day-label': 'День',

  'templateEditor.widget.weekly-drc-start-collapsed': 'Начинать свернутым',
  'templateEditor.widget.weekly-drc-day-all': 'Все дни',

  'templateEditor.widget.previous-context-sections-label': 'Включаемые разделы',
  'templateEditor.widget.previous-context-heading-label':
    'Заголовок раздела предыдущего DRC',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Выберите заголовок',
  'templateEditor.widget.review-context-fields.selection': 'Отображаемые поля',
  'templateEditor.widget.review-context-fields.selection.all': 'Все поля',
  'templateEditor.widget.review-context-fields.selection.group': 'Группа полей',
  'templateEditor.widget.review-context-fields.selection.fields':
    'Отдельные поля',
  'templateEditor.widget.review-context-fields.group': 'Группа',
  'templateEditor.widget.review-context-fields.group-placeholder':
    'Выберите группу',
  'templateEditor.widget.review-context-fields.fields': 'Поля',
  'templateEditor.widget.review-context-fields.fields-placeholder':
    'Выберите поля',
  'templateEditor.widget.review-context-fields.fields-selected':
    'Выбрано полей: {count}',
  'templateEditor.widget.review-context-fields.no-fields':
    'Сначала создайте поля обзора в настройках.',

  'templateEditor.widget.review-context-fields.context': 'Контекст',
  'templateEditor.widget.review-context-fields.context.both': 'Оба',
  'templateEditor.widget.review-context-fields.inherited': 'Унаследованный',
  'templateEditor.widget.review-context-fields.current': 'Текущий',
  'templateEditor.widget.review-context-fields.empty-values': 'Пустые значения',
  'templateEditor.widget.review-context-fields.hide-empty':
    'Скрыть пустые значения',
  'templateEditor.widget.trade-review.more-context': 'Больше контекста',
  'templateEditor.widget.trade-review.notes-sections': 'Разделы заметок',
  'templateEditor.widget.trade-review.notes-all': 'Все заметки',
  'templateEditor.widget.trade-review.notes-sections-empty':
    'Добавьте заголовки в «Разделы заметки» в макете сделки',
  'templateEditor.widget.trade-review.placement.cards': 'Карточки показателей',
  'templateEditor.widget.trade-review.placement.visible': 'Всегда видно',
  'templateEditor.widget.trade-review.future-custom-fields':
    'Пользовательские поля, добавленные позже',
  'templateEditor.widget.trade-review.display': 'Отображение',
  'templateEditor.widget.trade-review.show-images': 'Показывать изображения',
  'templateEditor.widget.trade-review.fields-none': 'Нет полей',
  'templateEditor.widget.trade-review.questions': 'Вопросы для разбора',
  'templateEditor.widget.trade-review.questions-help':
    'Выберите вопросы, которые будут показываться для каждого исхода сделки. Идентификаторы вопросов остаются неизменными, поэтому сохраненные ответы не теряются при редактировании или изменении порядка вопросов.',
  'templateEditor.widget.trade-review.outcome.win': 'Прибыльные',
  'templateEditor.widget.trade-review.outcome.loss': 'Убыточные',
  'templateEditor.widget.trade-review.outcome.breakeven': 'Безубыток',
  'templateEditor.widget.trade-review.outcome.open': 'Открытые',
  'templateEditor.widget.trade-review.questions-empty':
    'Нет вопросов для этого исхода.',
  'templateEditor.widget.trade-review.question-label': 'Вопрос',
  'templateEditor.widget.trade-review.question-placeholder':
    'Введите вопрос для разбора',
  'templateEditor.widget.trade-review.answer-placeholder-label':
    'Подсказка для ответа',
  'templateEditor.widget.trade-review.answer-placeholder':
    'Необязательная подсказка, отображаемая в поле ответа',
  'templateEditor.widget.trade-review.add-question': '+ Добавить вопрос',
  'templateEditor.widget.trade-review.answer-type-label': 'Тип ответа',
  'templateEditor.widget.trade-review.answer-type-text': 'Текст',
  'templateEditor.widget.trade-review.answer-type-choice': 'Выбор',
  'templateEditor.widget.trade-review.option-placeholder': 'Название варианта',
  'templateEditor.widget.trade-review.add-option': '+ Добавить вариант',
  'templateEditor.widget.trade-review.condition-label': 'Показывать если',
  'templateEditor.widget.trade-review.condition-always': 'Всегда показывать',
  'templateEditor.widget.trade-review.condition-option-label':
    'Когда В{questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section': '+ Добавить раздел',

  'templateEditor.widget.previous-context-fallback-label':
    'Замена предыдущего DRC',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Ближайший более ранний DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Только ожидаемый предыдущий торговый день',
  'widget.stats.vs-prev': 'к пред.',
  'common.r-missing.title': 'Нет R для этой сделки',
  'common.r-missing.trade':
    'У этой сделки нет суммы риска, поэтому её результат нельзя показать в R.',
  'common.r-missing.fix':
    'Укажите сумму риска или задайте сумму риска по умолчанию в настройках.',
  'common.r-coverage.partial':
    'На основе {valid} из {total} сделок. Сделки без суммы риска не учитываются в R.',
  'common.r-coverage.none':
    'Ни у одной сделки здесь нет суммы риска, поэтому показать R нельзя.',
  'dashboard.r-coverage.no-comparison':
    'Изменение не показано: в периоде сравнения нет значения R для этого показателя.',
  'dashboard.metrics.past-30d': 'за 30 дн.',

  'settings.customization.trade-fields': 'Пользовательские поля сделки',
  'settings.customization.review-fields': 'Пользовательские поля обзора',
  'settings.customization.review-fields.description':
    'Создавайте пользовательские поля для заметок обзора. Они хранятся в reviewCustomFields и могут наследоваться между месячными, недельными и дневными анализами.',
  'settings.customization.review-fields.title': 'Поля обзора ({count})',
  'settings.customization.review-fields.manage-desc':
    'Управление пользовательскими полями заметок обзора',
  'settings.customization.review-fields.no-fields':
    'Пользовательских полей анализа пока нет',
  'settings.customization.review-fields.no-fields-desc':
    'Поля обзора используются виджетами заметок обзора и не отображаются в форме сделки и журнале сделок.',
  'settings.customization.review-fields.add-button': 'Добавить поле обзора',
  'settings.customization.review-fields.delete-all-button':
    'Удалить все поля обзора',
  'settings.customization.review-fields.add-new': 'Добавить новое поле обзора',
  'settings.customization.review-fields.edit-field-with-name':
    'Изменить «{fieldLabel}»',
  'settings.customization.review-fields.configure-desc':
    'Настройте параметры поля обзора ниже',
  'settings.customization.review-fields.actions-desc':
    'Управление пользовательскими полями анализа',
  'settings.customization.review-fields.default-label': 'Новое поле обзора',
  'settings.customization.review-fields.unknown-field':
    'Неизвестное поле обзора',
  'settings.customization.review-fields.field-summary':
    'Тип: {type} • Обзоры: {reviews}',
  'settings.customization.review-fields.error.save-failed':
    'Не удалось сохранить поле обзора. Попробуйте ещё раз.',
  'settings.customization.review-fields.delete.confirm-message':
    'Удалить пользовательское поле обзора «{fieldLabel}»?',
  'settings.customization.review-fields.reset.confirm-message':
    'Удалить ВСЕ пользовательские поля обзора?',
  'settings.customization.review-fields.editor.title': 'Настройка поля обзора',
  'settings.customization.review-fields.editor.label-desc':
    'Отображаемое название этого поля обзора',
  'settings.customization.review-fields.editor.label-placeholder':
    'Введите название поля обзора',
  'settings.customization.review-fields.editor.key': 'Ключ поля обзора',
  'settings.customization.review-fields.editor.key-desc':
    'Этот ключ будет сохранён во frontmatter заметки анализа по пути',
  'settings.customization.review-fields.editor.type-desc':
    'Тип ввода поля обзора',
  'settings.customization.review-fields.editor.description': 'Описание',
  'settings.customization.review-fields.editor.description-desc':
    'Необязательный текст подсказки для этого поля обзора',
  'settings.customization.review-fields.editor.description-placeholder':
    'Объясните, как использовать это поле',
  'settings.customization.review-fields.editor.placeholder-desc':
    'Необязательный текст-подсказка при вводе локального значения',
  'settings.customization.review-fields.editor.placeholder-input':
    'Введите текст-подсказку поля обзора',

  'settings.customization.review-fields.editor.group': 'Группа полей',
  'settings.customization.review-fields.editor.group-desc':
    'Выберите группу, к которой относится это поле обзора.',
  'settings.customization.review-fields.groups.add-button': 'Добавить группу',
  'settings.customization.review-fields.groups.default-name': 'Новая группа',
  'settings.customization.review-fields.groups.untitled': 'Группа без названия',
  'settings.customization.review-fields.groups.ungrouped': 'Без группы',
  'settings.customization.review-fields.groups.field-count': 'Полей: {count}',
  'settings.customization.review-fields.groups.empty':
    'В этой группе пока нет полей.',
  'settings.customization.review-fields.groups.rename-prompt':
    'Название группы',
  'settings.customization.review-fields.groups.delete-message':
    'Удалить группу полей анализа «{groupName}»?',
  'settings.customization.review-fields.groups.delete-note':
    'Поля этой группы останутся без группы. Их сохранённые значения не удаляются.',
  'settings.customization.review-fields.groups.error.duplicate':
    'Группа полей анализа с таким названием уже существует.',
  'settings.customization.review-fields.groups.error.save-failed':
    'Не удалось сохранить группу полей анализа.',
  'settings.customization.review-fields.editor.compact':
    'Компактное отображение',
  'settings.customization.review-fields.editor.compact-desc':
    'Предпочитать компактный вид, когда поле показывается в виджетах анализа',
  'settings.customization.review-fields.editor.appears-on': 'Отображается в',
  'settings.customization.review-fields.editor.appears-on-desc':
    'Типы заметок обзора, где может отображаться это поле',
  'settings.customization.review-fields.editor.editable-on': 'Редактируется в',
  'settings.customization.review-fields.editor.editable-on-desc':
    'Типы заметок обзора, где можно ввести локальное значение',
  'settings.customization.review-fields.editor.inherit-to': 'Наследуется в',
  'settings.customization.review-fields.editor.inherit-to-desc':
    'Нижестоящие типы заметок обзора, которые могут показывать унаследованные значения этого поля',
  'settings.customization.review-fields.editor.inheritance':
    'Включить наследование',
  'settings.customization.review-fields.editor.inheritance-desc':
    'Разрешить чтение этого поля из заметок обзора более крупного периода',
  'settings.customization.review-fields.editor.inheritance-mode':
    'Режим наследования',
  'settings.customization.review-fields.editor.inheritance-mode-desc':
    'Определяет, показывают ли дочерние анализы унаследованные значения, локальные или оба',
  'settings.customization.review-fields.editor.sources':
    'Источники наследования',
  'settings.customization.review-fields.editor.sources-desc':
    'Типы анализа более крупного периода, от которых может наследовать это поле',

  'settings.customization.review-fields.editor.options-desc':
    'Доступные варианты для этого поля обзора',
  'settings.customization.review-fields.editor.allow-create-desc':
    'Пользователи могут создавать новые варианты при заполнении этого поля в заметках анализа',
  'settings.customization.review-fields.editor.save': 'Сохранить поле обзора',
  'settings.customization.review-fields.editor.delete': 'Удалить поле обзора',
  'settings.customization.review-fields.inheritance-mode.inherit-only':
    'Только унаследованные',
  'settings.customization.review-fields.inheritance-mode.local-only':
    'Только локальные',
  'settings.customization.review-fields.inheritance-mode.inherit-and-local':
    'Унаследованные и локальные',

  'calendar.aria.open-daily-review': 'Открыть дневной обзор за {date}',
  'calendar.aria.open-weekly-review': 'Открыть недельный обзор за {date}',
  'calendar.aria.open-monthly-review': 'Открыть месячный обзор за {date}',
  'calendar.aria.open-quarterly-review': 'Открыть квартальный обзор за {date}',

  'csv.mapper.aria.map-column': 'Сопоставить столбец {header}',
  'trade-import.error.file-empty':
    'Этот файл пуст. Экспортируйте его заново и повторите попытку.',
  'trade-import.error.file-too-large':
    'Выбранный файл превышает ограничение размера Trade Import',
  'trade-import.error.file-type-unsupported':
    'Trade Import не поддерживает выбранный тип файла',
  'trade-import.error.broker-file-type-unsupported':
    'Выбранный брокер не поддерживает этот тип файла',
  
  'quick-import.title': 'Быстрый импорт',
  'quick-import.subtitle':
    'Используйте избранную настройку Trade Import, чтобы быстрее просмотреть и импортировать файл.',
  'quick-import.gate.sign-in':
    'Войдите или создайте бесплатную учётную запись Journalit, чтобы просматривать файлы в Trade Import. Pro требуется только при импорте сделок.',
  'quick-import.gate.sign-in-cta': 'Войти и просмотреть бесплатно',
  'quick-import.gate.pro': 'Быстрый импорт входит в Trade Import Pro.',
  'quick-import.gate.preview-free': 'Бесплатно просмотреть файл',
  'quick-import.message.needs-setup':
    'Перед использованием быстрого импорта выберите избранного брокера или шаблон в Trade Import.',
  'quick-import.message.capabilities-failed':
    'Не удалось загрузить настройки быстрого импорта.',
  'quick-import.message.mapping-required':
    'Для этого файла нужно сопоставление столбцов. Откройте полный процесс Trade Import, чтобы проверить сопоставления.',
  'quick-import.message.preview-failed':
    'Этот файл нужно проверить в полном процессе Trade Import.',
  'quick-import.message.no-importable':
    'Сделок для импорта не найдено. Проверьте файл в Trade Import, чтобы узнать подробности.',

  'quick-import.privacy-note':
    'Выбранный файл и параметры импорта отправляются в Journalit. Зашифрованные диагностические данные хранятся 1 день (бесплатно) или 14 дней (Pro), предпросмотры — 7 дней. Необязательное сопоставление с ИИ отправляет заголовки и примеры строк модели ИИ. Trade Import не отправляет отдельную клиентскую телеметрию или фоновые отчёты об ошибках.',
  'quick-import.dropzone.title': 'Перетащите сюда выгрузку от брокера',
  'quick-import.dropzone.subtitle': 'Или нажмите, чтобы выбрать файл',

  'quick-import.status.checking-subscription': 'Проверка статуса подписки...',
  'quick-import.status.analysing': 'Анализ и подготовка предпросмотра...',
  'quick-import.status.importing': 'Импорт...',
  'quick-import.processing.sent-to-server':
    'Загружено в Journalit для закрытой обработки',
  'quick-import.file.selected': 'Выбранный файл',
  'quick-import.file.processed': 'Обработано и готово к записи в хранилище',
  'quick-import.summary.title': 'Готово к импорту',

  'quick-import.summary.to-import': 'К импорту',
  'quick-import.summary.duplicates': 'Дубликаты',
  'quick-import.summary.failed': 'Требуют проверки',
  'quick-import.summary.failed-rows': 'Не импортировано строк',
  'quick-import.summary.incomplete-rows': 'Пропущено неполных строк',
  'quick-import.complete.title': 'Импорт завершён',
  'quick-import.complete.message':
    'Записано: {written}, дубликатов: {duplicates}, требуют проверки: {failed}.',
  'quick-import.action.open-full': 'Открыть полный Trade Import',
  'quick-import.action.review-in-trade-import': 'Проверить в Trade Import',
  'quick-import.action.setup-in-trade-import': 'Настроить в Trade Import',
  'quick-import.action.replace-file': 'Заменить файл',
  'quick-import.action.import-count.one': 'Импортировать {count} сделку',
  'quick-import.action.import-count.few': 'Импортировать {count} сделки',
  'quick-import.action.import-count.many': 'Импортировать {count} сделок',
  'quick-import.action.import-count.other': 'Импортировать {count} сделок',
  'quick-import.preview.more': '+ ещё {count} обработанных сделок',

  'trade-import.notice.capabilities-failed':
    'Не удалось загрузить возможности Trade Import',
  'trade-import.notice.open-failed': 'Не удалось открыть Trade Import',
  'trade-import.notice.template-exists':
    'Шаблон Trade Import с таким названием уже существует',
  'trade-import.notice.template-saved': 'Шаблон Trade Import сохранён',
  'trade-import.notice.analyse-failed':
    'Не удалось выполнить анализ в Trade Import',
  'trade-import.notice.preview-failed':
    'Не удалось создать предпросмотр Trade Import',
  'trade-import.notice.free-preview-rate-limited':
    'Достигнут лимит бесплатных предпросмотров. Подключите PRO или повторите попытку примерно через {minutes} мин.',
  'trade-import.notice.free-preview-storage-limit-reached':
    'В бесплатных предпросмотрах можно хранить до {limit} сделок. Сейчас сохранено {storedItems}, а этот файл добавит ещё {requestedItems}. Дождитесь окончания срока хранения предыдущего предпросмотра или подключите PRO.',
  'trade-import.preview-error.guidance':
    'Проверьте, что все обязательные поля сопоставлены, выбранный формат даты соответствует файлу, а числовые столбцы содержат корректные значения сделки.',
  'trade-import.notice.complete':
    'Trade Import завершён: записано или обновлено {written}, дубликатов {duplicateCount}, ошибок {failedCount}',
  'trade-import.gate.brand-left': 'Сделки',
  'trade-import.gate.brand-right': 'Импорт',
  'trade-import.gate.sign-in.title': 'Бесплатно просмотрите историю торговли',
  'trade-import.gate.sign-in':
    'Войдите или создайте бесплатный аккаунт Journalit, чтобы проанализировать файл. Pro требуется только при импорте сделок.',
  'trade-import.gate.sign-in.cta': 'Войти и просмотреть бесплатно',

  'trade-import.step.select': 'Загрузка',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': 'Проверка',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Локальный шаблон сопоставления',
  'trade-import.label.template-actions': 'Действия с шаблоном',
  'trade-import.template.none': 'Без шаблона',
  'trade-import.label.account': 'Счёт',
  'trade-import.label.broker': 'Источник экспорта / платформа',
  'trade-import.label.asset-type': 'Тип актива',
  'trade-import.label.destination': 'Импортировать как',
  'trade-import.destination.live': 'Реальные сделки',
  'trade-import.destination.backtest': 'Сделки бэктеста',
  'trade-import.destination.backtest-hint':
    'Сохраняются как сделки бэктеста, отдельно от реальных сделок.',
  'trade-import.label.export-format': 'Тип экспорта',
  'trade-import.format.tradingview.paper': 'Бумажная торговля',
  'trade-import.format.tradingview.strategy': 'Тестер стратегий',
  'trade-import.format.tradingview.paper-hint':
    'Экспорт Order History из панели Paper Trading.',
  'trade-import.format.tradingview.strategy-hint':
    'Экспорт List of Trades из тестера стратегий.',
  'trade-import.label.symbol': 'Тикер',
  'trade-import.symbol.hint':
    'В этом экспорте не указан протестированный тикер. Введите его так, как он показан в TradingView, например CME_MINI:ES1!.',
  'trade-import.asset.stock': 'Акции',
  'trade-import.asset.options': 'Опционы',
  'trade-import.asset.futures': 'Фьючерсы',
  'trade-import.asset.forex': 'Форекс',
  'trade-import.asset.crypto': 'Криптовалюта',
  'trade-import.manual-mode.price-based':
    'Ордера или исполнения (объединяются в сделки)',
  'trade-import.manual-mode.direct-pnl':
    'Одна сделка на строку (использует P/L)',
  'trade-import.label.ai-mapping': 'Запросить подсказки сопоставления от ИИ',
  'trade-import.privacy.copy':
    'Выбранный файл и параметры импорта отправляются в Journalit. Зашифрованные диагностические данные хранятся 1 день (бесплатно) или 14 дней (Pro), предпросмотры — 7 дней. Необязательное сопоставление с ИИ отправляет заголовки и примеры строк модели ИИ. Trade Import не отправляет отдельную клиентскую телеметрию или фоновые отчёты об ошибках. Экспорты могут содержать идентификаторы счетов, историю сделок, заметки, цены, объёмы, комиссии, балансы и прибыль/убыток. Запросы также отправляют определения пользовательских полей и сохранённые параметры; предпросмотр включает имя целевого счёта. Отключите сопоставление с ИИ, чтобы избежать обработки ИИ.',

  'trade-import.action.analyse': 'Проанализировать файл',
  'trade-import.action.choose-file': 'Choose file',
  'trade-import.hyperliquid.export-guidance':
    'В Hyperliquid выберите Trade History → Export as CSV, а не Export More (отдельный отчёт стороннего сервиса). Не используйте Funding History или Order History.',
  'trade-import.hyperliquid.date-us': 'США: месяц/день/год — 24-часовой формат',
  'trade-import.hyperliquid.date-day-first':
    'День первым: день/месяц/год, с « - » перед временем или без него',
  'trade-import.hyperliquid.date-german':
    'Немецкий: день.месяц.год — 24-часовой формат',
  'trade-import.hyperliquid.invalid-time-zone':
    'Не удалось определить часовой пояс устройства. Проверьте системные настройки.',
  'trade-import.hyperliquid.backend-update-required':
    'Для предпросмотра Hyperliquid требуется обновление сервера. Попробуйте позже.',
  'trade-import.action.drop-file': 'Перетащите файл для загрузки',
  'trade-import.analyse.detected':
    'Файл {fileType} прочитан. Проверьте строки ниже, затем сопоставьте каждый столбец с полем сделки.',
  'trade-import.analyse.detected-native':
    'Файл {fileType} прочитан. Проверьте строки ниже, затем нажмите «Создать предпросмотр».',
  'trade-import.table.screenshots': 'Скриншоты',
  'trade-import.preview.screenshot-alt':
    'Скриншот {symbol} из строки {row} таблицы',
  'trade-import.preview.screenshots-more': 'ещё {count}',
  'trade-import.preview.include-screenshots':
    'Добавить скриншоты из таблицы к их сделкам ({count})',
  'trade-import.completion.screenshots-added':
    'Добавлено скриншотов из таблицы: {count}',
  'trade-import.completion.screenshots-failed':
    'Не удалось добавить скриншотов из таблицы: {count}',
  'trade-import.preview.import-anyway': 'Всё равно импортировать',
  'trade-import.preview.import-anyway-aria':
    'Всё равно импортировать {symbol} от {date}',
  'trade-import.preview.import-all-anyway':
    'Всё равно импортировать все возможные дубликаты ({count})',
  'csv.mapper.missing-fields.pnl-or-prices':
    'Или сопоставьте цену входа, цену выхода и количество, чтобы рассчитать P/L по ценам.',
  'trade-import.pnl-from-prices.title': 'P/L будет рассчитан по вашим ценам',
  'trade-import.pnl-from-prices.body':
    'Столбца P/L нет, поэтому P/L считается по цене входа, цене выхода и количеству. Это верно только при правильном типе актива, поэтому выберите, что это за сделки.',
  'trade-import.pnl-from-prices.contract-size':
    'Для форекса и фьючерсов также нужен столбец размера контракта. Без него сопоставьте столбец P/L.',
  'trade-import.diagnostic.choose-date-format': 'Выбрать формат даты',
  'trade-import.date-question.ambiguous':
    'Ваши даты выглядят как {example}. Какая это дата?',
  'trade-import.date-question.mixed':
    'Некоторые даты в этом столбце записаны в другом порядке, например {example}. Какой порядок у большинства ваших дат?',
  'trade-import.date-question.mixed-note':
    'Строки в другом порядке будут перечислены, чтобы вы исправили их в файле.',
  'quick-import.message.date-order':
    'Даты можно прочитать двумя способами. Откройте полный импорт, чтобы выбрать.',
  'quick-import.message.symbol-required':
    'В этом экспорте не указан тикер. Откройте полный импорт, чтобы ввести его.',
  'csv.date-format.eu-dot': 'ЕС с точками: 25.12.2024 (день.месяц.год)',
  'csv.date-format.ymd-dot': 'Сначала год, с точками: 2024.12.25',
  'trade-import.unmapped.title': 'Не импортируются ({count})',
  'trade-import.unmapped.body':
    'Эти столбцы не сопоставлены с полями Journalit и будут пропущены. Если какое-то поле подходит, сопоставьте столбец выше.',
  'trade-import.unmapped.keep': 'Сохранить как пользовательское поле',
  'trade-import.unmapped.keep-aria':
    'Сохранить {header} как пользовательское поле',
  'trade-import.custom-field.title':
    'Сохранить «{header}» как пользовательское поле',
  'trade-import.custom-field.hint':
    'Добавляет поле к вашим сделкам и заполняет его из этого столбца. Если уже подходит поле Journalit, сопоставьте столбец с ним.',
  'trade-import.custom-field.name': 'Название поля',
  'trade-import.custom-field.type': 'Тип поля',
  'trade-import.custom-field.type.text': 'Текст',
  'trade-import.custom-field.type.number': 'Число',
  'trade-import.custom-field.type.dropdown': 'Список вариантов',
  'trade-import.custom-field.create': 'Создать поле',
  'trade-import.custom-field.error.reserved':
    'Это название занято встроенным полем сделки. Выберите другое.',
  'trade-import.table.open-closed': 'Открыта/закрыта',
  'trade-import.status.open': 'Открыта',
  'trade-import.status.partially-closed': 'Частично закрыта',
  'trade-import.status.closed': 'Закрыта',
  'trade-import.status.cancelled': 'Отменена',
  'trade-import.diagnostic.column': 'Столбец: {columns}',
  'trade-import.diagnostic.unmap-column': 'Не импортировать этот столбец',
  'trade-import.diagnostic.edit-mapping': 'Изменить сопоставление',
  'trade-import.label.sheet': 'Лист',
  'trade-import.label.header-row': 'Строка заголовков',
  'trade-import.placeholder.auto': 'Авто',
  'trade-import.label.date-format': 'Формат даты',

  'trade-import.label.save-template': 'Сохранить шаблон сопоставления',
  'trade-import.placeholder.template-name': 'Название шаблона',
  'trade-import.action.save-template': 'Сохранить шаблон',
  'trade-import.action.preview': 'Создать предпросмотр',

  'trade-import.preview.found.one': 'Найдена {count} сделка',
  'trade-import.preview.found.few': 'Найдено {count} сделки',
  'trade-import.preview.found.many': 'Найдено {count} сделок',
  'trade-import.preview.found.other': 'Найдено {count} сделок',
  'trade-import.preview.date-range': 'с {start} по {end}',
  'trade-import.preview.metric.symbols': 'Символы',
  'trade-import.preview.metric.ready': 'Готовы к импорту',
  'trade-import.preview.metric.duplicates': 'Возможные дубликаты',
  'trade-import.preview.metric.attention': 'Требуют внимания',
  'trade-import.preview.partial.message':
    'Сделки, готовые к импорту: {count}. Строки, которые не удалось импортировать: {failed}. Пропущенные неполные строки: {incomplete}.',
  'trade-import.preview.partial.guidance':
    'Будут импортированы только корректные сделки, показанные ниже.',

  'trade-import.preview.failed.message':
    'Из этого файла не удалось подготовить ни одной сделки.',
  'trade-import.preview.failed.guidance':
    'Проверьте сопоставление столбцов, формат даты, выбранный лист и выбранную строку заголовка, а также указанные ниже некорректные значения.',
  'trade-import.preview.tradovate-performance.title':
    'Неверный отчёт Tradovate',
  'trade-import.preview.tradovate-performance.message':
    'Похоже, это экспорт отчёта Performance из Tradovate. Journalit импортирует отчёт Orders, чтобы точно восстановить ваши исполнения. В Tradovate откройте Reports > Orders и скачайте CSV-файл.',
  'trade-import.preview.tradovate-performance.guide':
    'Открыть руководство по экспорту Tradovate',
  'trade-import.preview.metatrader-statement.title':
    'Неподдерживаемый отчёт MetaTrader',
  'trade-import.preview.metatrader-statement.message':
    'Journalit импортирует исходный отчёт истории счёта MetaTrader. Переключите MetaTrader на английский язык, откройте Account History / History, выберите Save as Report и загрузите исходный файл .html или .htm без редактирования и преобразования.',
  'trade-import.preview.metatrader-statement.guide':
    'Открыть руководство по экспорту из MetaTrader',
  'trade-import.preview.tradingview-export.title':
    'Неверный экспорт TradingView',
  'trade-import.preview.tradingview-export.message':
    'Journalit ожидает CSV Order History / History из TradingView Paper Trading. Не используйте Account History, данные графиков, экспорты стратегий или другие CSV-файлы TradingView.',
  'trade-import.preview.tradingview-export.guide':
    'Открыть руководство по экспорту TradingView',
  'trade-import.source-recovery.title': 'Этот файл похож на экспорт {source}',
  'trade-import.source-recovery.message':
    'Journalit может импортировать этот файл напрямую через {source} вместо {selected}.',
  'trade-import.source-recovery.continue': 'Продолжить с {selected}',
  'trade-import.source-recovery.switch': 'Переключиться на {source}',
  'trade-import.source-recovery.guide':
    'Открыть руководство по экспорту {source}',
  'trade-import.source-recovery.metatrader.message':
    'Journalit может импортировать этот отчёт MetaTrader напрямую, сопоставление столбцов не требуется.',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    'Файл получен из DeepCharts, даже если счёт исполняется через Rithmic. Используйте DeepCharts, чтобы длинные и короткие сделки корректно считывались из Trade List.',
  'trade-import.source-recovery.deepcharts.manual-message':
    'Используйте импорт DeepCharts. Он определяет лонг и шорт по знаку Quantity или по столбцу Direction в Trade List, поэтому ручное сопоставление не требуется.',
  'trade-import.source-recovery.motivewave.title':
    'Этот файл похож на экспорт исполнений MotiveWave',
  'trade-import.source-recovery.motivewave.message':
    'Используйте MotiveWave, чтобы Journalit правильно объединил строки исполнений в завершённые сделки.',
  'quick-import.message.source-mismatch':
    'Journalit определил другой источник экспорта. Откройте файл в Trade Import, чтобы сменить источник без повторной загрузки.',
  'trade-import.preview.no-eligible':
    'Файл успешно обработан, но нет новых или обновлённых сделок, доступных для импорта. Проверьте ниже сведения о дубликатах и классификации.',
  'trade-import.pro-gate.title.one': '{count} сделка готова к импорту',
  'trade-import.pro-gate.title.few': '{count} сделки готовы к импорту',
  'trade-import.pro-gate.title.many': '{count} сделок готовы к импорту',
  'trade-import.pro-gate.title.other': '{count} сделок готовы к импорту',
  'trade-import.pro-gate.subtitle':
    'Активируйте PRO, чтобы записать их в хранилище как заметки о сделках.',
  'trade-import.pro-gate.cta': 'Активировать PRO',
  'trade-import.preview.diagnostics': 'Сведения для проверки ({count})',
  'trade-import.preview.affected-rows': 'Затронуто строк: {count}',
  'trade-import.table.status': 'Статус',
  'trade-import.table.symbol': 'Символ',
  'trade-import.table.direction': 'Направление',
  'trade-import.table.entry-time': 'Время входа',
  'trade-import.table.date': 'Дата',
  'trade-import.table.result': 'Результат',
  'trade-import.table.quantity': 'Количество',
  'trade-import.table.message': 'Сообщение',
  'trade-import.status.new': 'Новая',
  'trade-import.status.already-imported': 'Уже импортирована',
  'trade-import.status.other-account': 'В другом счёте',
  'trade-import.status.other-account.detail': 'Уже импортирована в {account}',
  'trade-import.status.split-across-trades.detail':
    'Её исполнения уже есть в журнале, но в разных сделках. Чтобы добавить недостающие, импортируйте те же периоды, что и раньше.',
  'trade-import.status.updates-existing': 'Обновляет существующую сделку',
  'trade-import.status.possible-duplicate': 'Возможный дубликат',
  'trade-import.status.needs-review': 'Требует проверки',
  'trade-import.status.duplicate-in-file': 'Дубликат в файле',
  'trade-import.status.invalid': 'Недопустимая сделка',
  'trade-import.status.no-open-trade': 'Нет открытой сделки для закрытия',
  'trade-import.status.multiple-open-trades':
    'Подходят несколько открытых сделок',
  'trade-import.status.quantity-mismatch': 'Несовпадение объёма',
  'trade-import.commit-failure.update-target-changed':
    'Сделка, которую обновляет эта строка, была изменена или удалена после предпросмотра. Импортируйте файл снова.',
  'trade-import.commit-failure.tradovate-overlap':
    'Пересекается со сделкой, уже синхронизированной из Tradovate, и не может быть с ней сопоставлена.',
  'trade-import.server-deletion.deleted':
    'Сделок удалено с сервера Journalit: {count}',
  'trade-import.server-deletion.kept':
    'Сделок сохранено, так как они есть и в другом импорте: {count}',
  'trade-import.server-deletion.blocked-broker-connected':
    'Этот счёт синхронизируется через подключение к брокеру. Отключите брокера, чтобы удалить его данные.',
  'trade-import.server-deletion.blocked-broker-history':
    'У этого счёта есть история синхронизации с брокером, и его нельзя удалить здесь. Удалите отдельные импорты.',
  'trade-import.server-deletion.failed':
    'Не удалось удалить с сервера Journalit. Попробуйте ещё раз.',
  'trade-import.server-deletion.notice':
    'Заметок о сделках перемещено в корзину после удаления на сервере: {count}',
  'trade-import.server-deletion.account.title': 'Удалить счёт на сервере?',
  'trade-import.server-deletion.account.message':
    '«{account}» и его импортированные сделки ({count} на сервере) будут безвозвратно удалены с сервера Journalit, а их заметки перемещены в корзину во всех синхронизированных хранилищах. Позже файлы можно импортировать снова.',
  'trade-import.server-deletion.account.confirm': 'Удалить с сервера',
  'trade-import.server-deletion.account.button': 'Удалить с сервера',
  'trade-import.history.title': 'История импорта',
  'trade-import.completion.wrong-account': 'Импортировали не в тот счёт?',
  'trade-import.completion.undo-import': 'Отменить этот импорт',
  'trade-import.action.manage-imports': 'Управление прошлыми импортами',
  'trade-sync.import.more-actions': 'Другие действия',
  'trade-import.history.loading': 'Загрузка истории импорта…',
  'trade-import.history.load-failed': 'Не удалось загрузить историю импорта.',
  'trade-import.history.empty': 'Импортов пока нет.',
  'trade-import.history.trades-on-server': '{count} на сервере',
  'trade-import.history.delete.title': 'Удалить этот импорт?',
  'trade-import.history.delete.message':
    'Сделки, добавленные этим импортом в «{account}» ({count} на сервере), будут безвозвратно удалены с сервера Journalit, а их заметки перемещены в корзину во всех синхронизированных хранилищах. Сделки, которые есть и в другом импорте, сохранятся. Позже файл можно импортировать снова.',
  'trade-import.history.delete.updates-kept':
    'Изменения ранее импортированных сделок, например их закрытие, сохранятся.',
  'trade-import.history.delete.message-updates-only':
    'Этот импорт только изменил ранее импортированные сделки, например закрыл их. Удаление уберёт его из истории импорта; эти изменения сохранятся.',
  'trade-import.history.delete.message-none-deleted':
    'Сделки не удаляются: каждая сделка этого импорта есть и в другом импорте. Удаление только убирает его из истории импортов.',
  'trade-import.history.delete.confirm': 'Удалить импорт',
  'trade-import.history.load-more': 'Загрузить ещё',
  'account.edit.modal.delete.delete-server-trades':
    'Также удалить импортированные сделки с сервера Journalit ({count} на сервере). Их заметки будут перемещены в корзину во всех синхронизированных хранилищах, даже если вы оставите их здесь.',
  'trade-import.preview.other-account.message':
    'Уже есть в {account} ({count}), поэтому будут пропущены.',
  'trade-import.preview.other-account.import-instead':
    'Импортировать в {account}',
  'trade-import.preview.other-account.undo-earlier':
    'Отменить предыдущий импорт',
  'trade-import.action.confirm': 'Подтвердить импорт',
  'trade-import.action.activate-pro.one':
    'Активировать PRO и импортировать {count} сделку',
  'trade-import.action.activate-pro.few':
    'Активировать PRO и импортировать {count} сделок',
  'trade-import.action.activate-pro.many':
    'Активировать PRO и импортировать {count} сделок',
  'trade-import.action.activate-pro.other':
    'Активировать PRO и импортировать {count} сделок',
  'trade-import.action.cancel-preview': 'Отменить предпросмотр',
  'trade-import.broker.manual': 'Ручное сопоставление',
  'trade-import.source.title': 'Откуда эти сделки?',
  'trade-import.source.subtitle':
    'Выберите платформу, из которой вы экспортировали. Journalit читает её формат файла напрямую, без сопоставления столбцов.',
  'trade-import.source.search': 'Поиск брокеров и платформ',
  'trade-import.source.sync-available':
    'Также поддерживает автоматический Trade Sync',
  'trade-import.source.manual.tile': 'Своя таблица / другой файл',
  'trade-import.source.manual.title': 'Своя таблица или другой файл',
  'trade-import.source.manual.hint':
    'Вы сопоставите столбцы файла с полями Journalit.',
  'trade-import.source.native.hint':
    'Формат файла читается автоматически, сопоставление не нужно.',
  'trade-import.source.guide': 'Как экспортировать',
  'trade-import.source.change': 'Изменить',
  'trade-import.recovery.rithmic-order-history.title':
    'Неподдерживаемый формат Rithmic',
  'trade-import.recovery.rithmic-order-history.message':
    'Загрузите экспорт истории ордеров Rithmic или выберите платформу, создавшую этот файл.',
  'trade-import.recovery.no-trade-rows.title':
    'В этом файле нет сделок для импорта',
  'trade-import.recovery.no-trade-rows.message':
    'Исправьте это в новом экспорте и выберите новый файл.',
  'trade-import.action.choose-another-file': 'Выбрать другой файл',
  'trade-import.source.change-action': 'Изменить источник',
  'trade-import.sync-suggestion.full.title':
    '{broker} может синхронизироваться автоматически',
  'trade-import.sync-suggestion.full.body':
    'Trade Sync сам загружает новые сделки, без экспорта. Вы по-прежнему можете импортировать файл ниже.',
  'trade-import.sync-suggestion.partial.title':
    'Используете {provider}? Лучше синхронизируйте',
  'trade-import.sync-suggestion.partial.body':
    'Trade Sync автоматически загружает сделки {provider}. Другие отчёты по-прежнему импортируются ниже.',
  'trade-import.sync-suggestion.action': 'Настроить Trade Sync',
  'trade-import.sync-suggestion.sync-only.title':
    '{broker} подключается через Trade Sync',
  'trade-import.sync-suggestion.sync-only.body':
    'Экспорт не нужен: Trade Sync автоматически загружает ваши сделки {broker}. Всё же есть файл {broker}? Выберите «Нет в списке / свой файл».',
  'trade-import.sync-suggestion.action.open': 'Открыть Trade Sync',

  
  'command.open-setups': 'Открыть сетапы',
  'setups.create.title': 'Создать сетап',
  'setups.create.field.name': 'Название сетапа',
  'setups.create.placeholder.name': 'Импульс открытия',
  'setups.create.field.status': 'Статус',
  'setups.create.field.direction': 'Направление',
  'setups.create.field.color': 'Цвет',
  'setups.create.field.color-description':
    'Выберите цвет для обозначения этого сетапа.',
  'setups.create.profile.heading': 'Предпочтительные поля',
  'setups.create.profile.optional-label': '(Необязательно)',
  'setups.create.field.sessions': 'Торговые сессии',
  'setups.create.field.preferred-sessions-tooltip':
    'Управляйте этими сессиями в разделе Настройки → Журнал → Режим сессии.',
  'setups.create.placeholder.preferred-sessions': 'Лондон, Нью-Йорк',
  'setups.create.field.timeframes': 'Таймфреймы',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'Тикеры',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
  'setups.create.direction.any': 'Не указано',
  'setups.create.direction.long': 'Лонг',
  'setups.create.direction.short': 'Шорт',
  'setups.create.direction.both': 'Оба',
  'setups.create.field.linked-notes': 'Связанные заметки',
  'setups.create.field.linked-notes-desc':
    'Прикрепите существующие заметки с описанием плейбука этого сетапа.',
  'setups.create.linked-notes.empty': 'Связанных заметок пока нет.',
  'setups.create.linked-notes.add': '+ Связать заметку',
  'setups.create.linked-notes.remove': 'Удалить связанную заметку',
  'setups.create.linked-notes.picker-title': 'Выберите заметку плейбука',
  'setups.create.linked-notes.search': 'Поиск заметок...',
  'setups.create.linked-notes.no-notes': 'Markdown-заметки не найдены.',
  'setups.create.button.creating': 'Создание...',
  'setups.create.button.create': 'Создать сетап',
  'setups.create.success': 'Сетап "{name}" успешно создан',
  'setups.create.error.name-required': 'Название сетапа обязательно',
  'setups.create.error.failed': 'Не удалось создать сетап',
  'setups.edit.title': 'Редактировать сетап',
  'setups.edit.button.saving': 'Сохранение...',
  'setups.edit.button.save': 'Сохранить сетап',
  'setups.edit.button.rename-and-update': 'Переименовать и обновить сделки',
  'setups.edit.rename-warning.title': 'Переименовать сетап и обновить сделки',
  'setups.edit.rename-warning.message':
    'Переименование {oldName} в {newName} обновит заметки о сделках, где используется старое название сетапа.',
  'setups.edit.delete.button': 'Удалить сетап',
  'setups.edit.delete.title': 'Удалить сетап',
  'setups.edit.delete.confirm': 'Подтвердить удаление',
  'setups.edit.delete.warning':
    'Удаление сетапа «{name}» навсегда удалит его и уберёт из связанных сделок. Это действие нельзя отменить.',
  'setups.edit.delete.success': 'Сетап «{name}» удалён',
  'setups.edit.delete.error': 'Не удалось удалить сетап',
  'setups.edit.success': 'Сетап "{name}" успешно обновлен',
  'setups.edit.error.failed': 'Не удалось обновить сетап',
  'setups.view.compare.empty-submessage':
    'Выберите две карточки сетапов в обзоре, чтобы построить сравнительный отчёт.',
  'setups.view.compare.reason.higher.total-r': 'Более высокий общий R',
  'setups.view.compare.reason.lower.total-r': 'Более низкий общий R',
  'setups.view.compare.reason.similar.total-r': 'Сопоставимый общий R',

  'setups.guide.create-new-setup.title': 'Создание новых сетапов',
  'setups.guide.create-new-setup.description':
    'Используйте Новый сетап, чтобы добавить плейбук. Модальное окно проведёт по деталям, заметкам и правилам.',
  'setups.guide.detail-intro.title': 'Это страница сетапа',
  'setups.guide.detail-intro.description':
    'Страница сетапа фокусирует один плейбук: график результата, контекст, материалы, действия и правила исполнения.',
  'setups.guide.detail-actions.title': 'Действия сетапа',
  'setups.guide.detail-actions.description':
    'Эти кнопки открывают связанные сделки или редактируют детали, заметки, скриншоты и правила плейбука.',
  'setups.guide.empty.create-setup.title': 'Начните с нового сетапа',
  'setups.guide.empty.create-setup.description':
    'Сначала создайте один сетап. После этого руководство продолжит обычный обзор.',

  'setups.guide.intro.title': 'Добро пожаловать в Setups',
  'setups.guide.intro.description':
    'Этот вид собирает плейбуки сетапов, связанные сделки, заметки, скриншоты и правила в одном месте.',
  'setups.guide.view-tabs.title': 'Переключение видов сетапов',
  'setups.guide.view-tabs.description':
    'Используйте вкладки для перехода между обзором, парами и сравнением, когда сетапов достаточно.',
  'setups.guide.setup-cards.title': 'Карточки сетапов',
  'setups.guide.setup-cards.description':
    'Карточки показывают ключевые метрики, статус, дату последней сделки и небольшой тренд результата.',
  'setups.guide.open-detail.title': 'Открыть страницу сетапа',
  'setups.guide.open-detail.description':
    'Когда будете готовы, откройте карточку сетапа, чтобы увидеть его страницу. Там вас встретит короткий гид.',
  'setups.guide.detail-performance.title': 'Детальная результативность',
  'setups.guide.detail-performance.description':
    'Вкладка Performance показывает график и ключевые метрики во времени: P&L, win rate, ожидание и drawdown.',
  'setups.guide.detail-context.title': 'Контекст сетапа',
  'setups.guide.detail-context.description':
    'Панель держит рядом здоровье сетапа, пункты внимания, связанные заметки и скриншоты.',
  'setups.guide.detail-playbook.title': 'Заметки плейбука',
  'setups.guide.detail-playbook.description':
    'Область плейбука показывает связанную заметку. Это может быть Markdown, изображения, Excalidraw или любые материалы.',
  'setups.guide.detail-rules.title': 'Правила исполнения',
  'setups.guide.detail-rules.description':
    'Правила — структурированный чеклист условий, входов, риска и ошибок, которых нужно избегать.',

  'setups.guide.compare-select.title': 'Выберите два сетапа',
  'setups.guide.compare-summary.title': 'Это страница сравнения',
  'setups.guide.compare-summary.description':
    'Эта страница сравнивает два сетапа рядом. Верхняя строка показывает победителя, преимущество ожидания, уверенность и причины преимущества.',
  'setups.guide.compare-body.title': 'Строка итогов сравнения',
  'setups.guide.compare-body.description':
    'Верхняя строка резюмирует сравнение: победитель, преимущество ожидания, уверенность и причины преимущества.',
  'setups.guide.compare-details.title': 'Детали сравнения',
  'setups.guide.compare-details.description':
    'Используйте таблицу метрик и накопительный график, чтобы понять различия между двумя сетапами.',
  'setups.guide.detail-execution-gap.title': 'Анализ разрыва исполнения',
  'setups.guide.detail-execution-gap.description':
    'Если есть пропущенные сделки или бэктесты, эта вкладка сравнивает исполнение с упущенной или эталонной возможностью.',

  'setups.view.open-as-markdown': 'Открыть как Markdown',
  'setups.view.open-as-setup': 'Открыть как сетап Journalit',

  'setups.view.overview.mode.pairs': 'Пары',
  'setups.view.pairs.summary-aria': 'Сводка по парам сетапов',
  'setups.view.pairs.best': 'Лучшая пара',
  'setups.view.pairs.worst': 'Худшая пара',
  'setups.view.pairs.worst-short': 'Худшая',
  'setups.view.pairs.empty': 'Пар сетапов с 5+ сделками пока нет.',
  'setups.view.pairs.empty-submessage':
    'Пары появятся, когда у двух сетапов будет достаточно общих связанных сделок.',
  'setups.view.pairs.privacy':
    'Результаты пар скрыты, пока включён режим конфиденциальности.',

  'setups.view.pairs.metric-aria': 'Метрика пары',
  'setups.view.pairs.metric.edge': 'Преимущество пары',
  'setups.view.pairs.metric.edge-short': 'преимущество',
  'setups.view.pairs.metric.expectancy': 'Матожидание пары',

  'setups.view.pairs.together': 'Вместе',
  'setups.view.pairs.table.setup-pair': 'Пара сетапов',

  'setups.view.pairs.evidence': 'Данные',
  'setups.view.pairs.edge-comparison': 'Сравнение преимущества',
  'setups.view.pairs.edge-caption': 'Совместное преимущество: {edge}',
  'setups.view.overview.setup-filter.all': 'Сетапы: все',
  'setups.view.overview.setup-filter.selected': 'Сетапы: выбрано {count}',
  'setups.view.overview.setup-filter.aria': 'Выберите сетапы для отображения',
  'setups.view.overview.setup-filter.select-all': 'Выбрать все',
  'setups.view.overview.setup-filter.clear': 'Очистить',

  'setups.view.overview.pnl-chart.dropdown-label': 'Cumulative P&L',

  'setups.view.overview.pnl-chart.combined': 'Все сетапы',
  'setups.view.overview.pnl-chart.selected-combined': 'Выбранные сетапы',

  'setups.view.overview.pnl-chart.hidden':
    'P&L сетапов во времени скрыт, пока включён режим конфиденциальности.',
  'setups.view.overview.pnl-chart.trade': 'Сделка',
  'setups.view.overview.pnl-chart.start': 'Начало',
  'setups.view.ranking.empty-submessage':
    'Записывайте сделки с сетапами, чтобы начать ранжирование результатов.',
  'setups.view.empty.no-setups-submessage':
    'Сетапы собирают заметки плейбука, правила, сделки и результаты в одном месте.',
  'setups.view.detail.no-playbook-note':
    'Свяжите заметку плейбука, чтобы просмотреть её здесь.',
  'setups.view.detail.link-playbook-note': 'Связать заметку',
  'setups.view.detail.change-playbook-note': 'Сменить заметку',

  'setups.view.detail.playbook-note-modal.empty':
    'Подходящих заметок не найдено.',
  'setups.view.detail.empty-playbook-note': 'Связанная заметка плейбука пуста.',
  'setups.view.detail.rules.edit': 'Редактировать правила',

  'setups.view.detail.rules.add': 'Добавить правило',

  'setups.view.detail.rules.empty-title': 'Составьте плейбук сетапа',
  'setups.view.detail.rules.use-template': 'Использовать шаблон',
  'setups.view.detail.rules.applying-template': 'Применение шаблона...',
  'setups.view.detail.rules.add-custom': 'Своё правило',
  'setups.view.detail.rules.template-error':
    'Не удалось применить шаблон плейбука.',
  'setups.view.detail.rules.template.best-conditions': 'Лучшие условия',
  'setups.view.detail.rules.template.entry-criteria': 'Критерии входа',
  'setups.view.detail.rules.template.invalidation': 'Инвалидация',
  'setups.view.detail.rules.template.risk-management': 'Риск / сопровождение',
  'setups.view.detail.rules.template.avoid-when': 'Избегать, когда',
  'setups.view.detail.rules.template.common-mistakes': 'Частые ошибки',
  'setups.view.detail.rules.template.rule.best-conditions':
    'Рыночный контекст поддерживает этот сетап',
  'setups.view.detail.rules.template.rule.entry-criteria':
    'Триггер входа чётко определён',
  'setups.view.detail.rules.template.rule.invalidation':
    'Инвалидация ясна до входа',
  'setups.view.detail.rules.template.rule.risk-management':
    'Риск приемлем, цель определена',
  'setups.view.detail.rules.template.rule.avoid-when':
    'Нет условий, при которых сетап следует избегать',
  'setups.view.detail.rules.template.rule.common-mistakes':
    'Известные ошибки исполнения исключены',
  'setups.view.detail.rules.field.label': 'Правило',
  'setups.view.detail.rules.field.description': 'Детали',
  'setups.view.detail.rules.field.group': 'Группа',
  'setups.view.detail.rules.move-up': 'Переместить правило вверх',
  'setups.view.detail.rules.move-down': 'Переместить правило вниз',
  'setups.view.detail.rules.delete': 'Удалить правило',
  'setups.view.detail.rules.save-error': 'Не удалось сохранить правила сетапа.',
  'setups.view.detail.rules.validation-label':
    'Добавьте название правила или удалите пустое правило перед сохранением.',
  'setups.view.detail.rules.groups': 'Группы',
  'setups.view.detail.rules.add-group': 'Добавить группу',
  'setups.view.detail.rules.new-group': 'Новая группа',
  'setups.view.detail.rules.validation-group':
    'Укажите название группы или удалите пустую группу перед сохранением.',
  'setups.view.detail.rules.summary': '{count} правил · {groups} групп',

  'setups.view.detail.rule.category.context': 'Контекст',
  'setups.view.detail.rule.category.entry': 'Вход',
  'setups.view.detail.rule.category.exit': 'Выход',
  'setups.view.detail.rule.category.risk': 'Риск',
  'setups.view.detail.rule.category.management': 'Управление',
  'setups.view.detail.rule.category.invalidation': 'Инвалидация',
  'setups.view.detail.rule.category.psychology': 'Психология',
  'setups.view.detail.performance.drawdown': 'Просадка',
  'setups.view.detail.performance.empty-submessage':
    'Сделки с этим сетапом появятся здесь, когда вы начнёте их записывать.',
  'setups.view.detail.analysis.performance': 'Результаты',
  'setups.view.detail.analysis.execution-gap': 'Разрыв исполнения',
  'setups.view.detail.analysis.tabs-aria': 'Вкладки результатов сетапа',
  'setups.view.detail.brief.linked-notes-add': 'Изменить связанные заметки',

  'setups.view.detail.execution-gap.live-pnl': 'Реальный P&L',
  'setups.view.detail.execution-gap.live-r': 'R в реальной торговле',
  'setups.view.detail.execution-gap.missed-edge': 'Упущенное преимущество',
  'setups.view.detail.execution-gap.live-plus-missed': 'Реальные + пропущенные',
  'setups.view.detail.execution-gap.backtest': 'Бэктест',

  'setups.view.detail.execution-gap.capture-rate': 'Доля реализации',
  'setups.view.detail.execution-gap.capture-rate-tooltip':
    'Реальный P&L ÷ (реальный P&L + P&L пропущенных сделок). Показывает, какую часть доступного преимущества вы реализовали.',
  'setups.view.detail.execution-gap.average-r-delta': 'Средняя разница R',
  'setups.view.detail.execution-gap.live-execution': 'Реальное исполнение',
  'setups.view.detail.execution-gap.backtest-benchmark': 'Ориентир бэктеста',
  'setups.view.detail.execution-gap.hidden':
    'Разрыв исполнения скрыт в режиме конфиденциальности.',
  'setups.view.detail.execution-gap.empty':
    'Добавьте пропущенные сделки или сделки бэктеста для этого сетапа, чтобы проанализировать разрывы исполнения.',
  'setups.view.detail.brief.linked-notes': '{count}',
  'setups.view.detail.brief.linked-notes-modal.subtitle': '{name}',
  'setups.view.detail.brief.screenshots': '{count}',
  'setups.view.detail.brief.no-screenshots': 'Скриншоты пока не связаны.',
  'setups.view.detail.brief.screenshot-alt': '{index}',
  'setups.view.detail.brief.screenshot-open': '{index}',
  'setups.view.detail.brief.count.rules': '{count}',
  'setups.view.detail.brief.count.notes': '{count}',
  'setups.view.detail.brief.count.images': '{count}',
  'setups.view.detail.brief.count.trades': '{count}',
  'setups.view.detail.brief.more': '{count}',
  'setups.view.detail.attention.title': 'Требует внимания',
  'setups.view.detail.attention.count': 'Пунктов: {count}',
  'setups.view.detail.attention.empty': 'Проблем с сетапом не найдено.',
  'setups.view.detail.attention.show-more': 'ещё {count}',
  'setups.view.detail.attention.show-less': 'Свернуть',
  'setups.view.detail.attention.no-playbook-title': 'Свяжите заметку плейбука',
  'setups.view.detail.attention.no-playbook-detail':
    'Свяжите одну исходную заметку для контекста и примеров.',
  'setups.view.detail.attention.no-rules-title': 'Составьте плейбук исполнения',
  'setups.view.detail.attention.no-rules-detail':
    'Добавьте критерии входа, инвалидации, риска и ошибок.',

  'setups.view.detail.attention.no-trades-title': 'Реальных сделок пока нет',
  'setups.view.detail.attention.no-trades-detail':
    'Связанной истории реальных сделок пока нет.',
  'setups.view.detail.attention.no-screenshots-title':
    'Сохраните примеры скриншотов',
  'setups.view.detail.attention.no-screenshots-detail':
    'Прикрепляйте скриншоты к сделкам, чтобы иметь примеры для анализа.',
  'setups.view.detail.attention.stale-title': 'Проверьте актуальность',
  'setups.view.detail.attention.stale-detail':
    'По этому сетапу не было сделок {count} дн.',
  'setups.view.detail.attention.profit-factor-title':
    'Результаты требуют проверки',
  'setups.view.detail.attention.profit-factor-detail':
    'Профит-фактор по связанным сделкам ниже 1,0.',
  'setups.view.detail.attention.expectancy-title': 'Отрицательное матожидание',
  'setups.view.detail.attention.expectancy-detail':
    'Средний результат связанных сделок ниже безубытка.',
  'setups.view.card.open-named': '{name}',
  'setups.view.card.status.active': 'Стабильный',
  'setups.view.card.status.monitor': 'Наблюдать',
  'setups.view.card.status.review': 'Проверить',
  'setups.view.date.days-ago': '{count}',

  'home.quick-links.setups': 'Сетапы',
  'validation.setup-resolution-failed': 'Не удалось определить сетап.',
  'setups.view.action.create': 'Создать сетап',
  'setups.view.action.new': 'Новый сетап',

  'setups.view.action.retry': 'Повторить',
  'setups.view.error.title': 'Не удалось загрузить сетапы',
  'setups.view.error.load-failed': 'Не удалось загрузить данные сетапов.',
  'setups.view.tabs.aria': 'Вкладки представления сетапов',
  'setups.view.tab.overview': 'Обзор',
  'setups.view.tab.compare': 'Сравнение',
  'setups.view.card.select-for-compare': 'Выбрать сетап для сравнения',

  'setups.view.compare.title': 'Сравнение сетапов',

  'setups.view.compare.empty': 'Выберите два сетапа для сравнения.',
  'setups.view.compare.metrics-title': 'Метрики сравнения',
  'setups.view.compare.metric': 'Метрика',
  'setups.view.compare.edge-column': 'Преимущество',
  'setups.view.compare.edge-label': 'Победитель',

  'setups.view.compare.no-clear-edge': 'Нет явного преимущества',
  'setups.view.compare.expectancy-edge': 'Преимущество по ожиданию',
  'setups.view.compare.confidence': 'Уверенность',
  'setups.view.compare.sample': 'Выборка',
  'setups.view.compare.confidence.high': 'Высокая',
  'setups.view.compare.confidence.moderate': 'Средняя',
  'setups.view.compare.confidence.low': 'Низкая',
  'setups.view.compare.edge-strength.strong': 'Сильное преимущество',
  'setups.view.compare.edge-strength.clear': 'Явное преимущество',
  'setups.view.compare.edge-strength.slight': 'Небольшое преимущество',
  'setups.view.compare.edge-reasons-privacy':
    'Причины преимущества скрыты в режиме приватности.',
  'setups.view.compare.reason.higher.net-pnl': 'Более высокий чистый P&L',
  'setups.view.compare.reason.lower.net-pnl': 'Более низкий чистый P&L',
  'setups.view.compare.reason.similar.net-pnl': 'Сопоставимый чистый P&L',
  'setups.view.compare.reason.higher.win-rate': 'Более высокий винрейт',
  'setups.view.compare.reason.lower.win-rate': 'Более низкий винрейт',
  'setups.view.compare.reason.similar.win-rate': 'Сопоставимый винрейт',
  'setups.view.compare.reason.higher.expectancy': 'Более высокое ожидание',
  'setups.view.compare.reason.lower.expectancy': 'Более низкое ожидание',
  'setups.view.compare.reason.similar.expectancy': 'Сопоставимое ожидание',
  'setups.view.compare.reason.higher.profit-factor':
    'Более высокий профит-фактор',
  'setups.view.compare.reason.lower.profit-factor':
    'Более низкий профит-фактор',
  'setups.view.compare.reason.similar.profit-factor':
    'Сопоставимый профит-фактор',

  'setups.view.compare.cumulative-title': 'Накопительный результат',
  'setups.view.compare.cumulative-privacy':
    'Накопительный результат скрыт в режиме приватности.',
  'setups.view.compare.cumulative-empty':
    'Нет накопительных данных по сделкам для выбранных сетапов.',

  'setups.view.title': 'Сетапы',

  'setups.view.summary.aria': 'Сводка по сетапам',

  'setups.view.summary.needs-review': 'Требуют проверки',
  'setups.view.summary.best-performer': 'Лучший результат',

  'setups.view.ranking.metric-aria': 'Метрика результата',
  'setups.view.ranking.privacy': 'Рейтинг скрыт в режиме приватности.',
  'setups.view.ranking.empty': 'Данных о результатах сетапов пока нет.',

  'setups.view.metric.trade-count': 'Количество сделок',
  'setups.view.metric.trades': 'сделки',
  'setups.view.metric.net-pnl': 'Общий P&L',
  'setups.view.metric.total-pnl': 'Общий PnL',
  'setups.view.metric.win-rate': 'Винрейт',
  'setups.view.metric.profit-factor': 'Профит-фактор',
  'setups.view.metric.last-traded': 'Последняя сделка',
  'setups.view.metric.expected-value': 'Ожидаемое значение',
  'setups.view.metric.expectancy-r': 'Ожидание (R)',

  'setups.view.status.active': 'Активный',
  'setups.view.status.testing': 'Тестирование',
  'setups.view.status.archived': 'В архиве',

  'setups.view.empty.no-setups':
    'Сетапов пока нет. Создайте первый сетап, чтобы отслеживать плейбуки.',

  'setups.view.date.never': 'Никогда',
  'setups.view.date.today': 'Сегодня',
  'setups.view.date.yesterday': 'Вчера',
  'setups.view.card.sparkline-aria': 'Мини-график сетапа',
  'setups.view.completeness.incomplete-playbook': 'Незавершённый плейбук',
  'setups.view.completeness.no-rules': 'Нет правил',
  'setups.view.completeness.no-linked-notes': 'Нет связанных заметок',
  'setups.view.detail.back': 'Назад',

  'setups.view.detail.action.edit': 'Редактировать сетап',
  'setups.view.detail.action.view-trades': 'Открыть в журнале сделок',

  'setups.view.detail.playbook': 'Плейбук',

  'setups.view.detail.rules': 'Правила',

  'setups.view.detail.rule.required': 'Обязательно',

  'setups.view.detail.no-linked-notes': 'Связанных заметок пока нет.',

  'setups.view.detail.performance.cumulative-pnl': 'Накопительный PnL',
  'setups.view.detail.performance.cumulative-r': 'Накопительный R',
  'setups.view.detail.performance.empty': 'Связанных сделок пока нет.',

  'setups.view.detail.brief.health': 'Состояние сетапа',
  'setups.view.detail.brief.profile': 'Профиль',
  'setups.view.detail.brief.view-all': 'Показать все',

  'setups.view.detail.brief.linked-notes-modal.title': 'Связанные заметки',
  'setups.view.detail.brief.status.complete': 'Завершено',
  'setups.view.detail.brief.status.missing': 'Отсутствует',
  'setups.view.detail.brief.health.playbook': 'Плейбук',
  'setups.view.detail.brief.health.rules': 'Правила',
  'setups.view.detail.brief.health.notes': 'Заметки',
  'setups.view.detail.brief.health.screenshots': 'Скриншоты',
  'setups.view.detail.brief.health.trades': 'Сделки',
  'setups.view.detail.brief.profile.direction': 'Направление',
  'setups.view.detail.brief.profile.sessions': 'Сессии',
  'setups.view.detail.brief.profile.timeframes': 'Таймфреймы',
  'setups.view.detail.brief.profile.tickers': 'Тикеры',
  'setups.view.detail.brief.direction.long': 'Лонг',
  'setups.view.detail.brief.direction.short': 'Шорт',
  'setups.view.detail.brief.direction.both': 'Оба',

  'trade-import.restore.complete':
    'Восстановлено импортированных сделок: {written}; с ошибкой: {failed}.',
  'trade-import.restore.broker-label': 'Восстановление с сервера',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Синхронизация сделок',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'Синхронизация сделок из отчётов MetaTrader, загружаемых через ваше FTP-подключение.',
  'trade-sync.source.trade-import.description':
    'Восстанавливайте импорт файлов брокера между хранилищами и возвращайте отсутствующие локальные заметки о сделках.',
  'trade-sync.source.tradovate.description':
    'Синхронизирует сделки Tradovate в облаке и переносит их в это хранилище.',
  'trade-sync.tradovate.status-failed':
    'Не удалось загрузить статус Tradovate.',
  'trade-sync.tradovate.last-sync': 'Последняя синхронизация',
  'trade-sync.tradovate.last-projection': 'Последняя запись в хранилище',
  'trade-sync.tradovate.pending-projections': 'Ожидает записи: {count}',
  'trade-sync.tradovate.pending-acks': '{count} ожидающих локальных ACK',
  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Синхронизируйте сделки Rithmic в облаке и переносите их в это хранилище.',
  'trade-sync.rithmic.plugin-sync-description':
    'Подключите Rithmic на Journalit.co, затем синхронизируйте здесь, чтобы записать последнюю активность Rithmic в это хранилище.',
  'trade-sync.rithmic.status-failed': 'Не удалось загрузить статус Rithmic.',
  'trade-sync.rithmic.status.connecting': 'Подключение',
  'trade-sync.rithmic.status.paused': 'Приостановлено',
  'trade-sync.rithmic.status.waiting-for-accounts': 'Ожидание счетов',
  'trade-sync.rithmic.status.reauthorization-required':
    'Требуется повторная авторизация на Journalit.co',
  'trade-sync.rithmic.status.error': 'Ошибка подключения',
  'trade-sync.rithmic.no-connections':
    'Подключите аккаунт Rithmic на Journalit.co, чтобы синхронизировать его здесь.',
  'trade-sync.rithmic.connect': 'Подключить',
  'trade-sync.rithmic.manage': 'Управлять на Journalit.co',
  'trade-sync.rithmic.system': 'Система Rithmic',
  'trade-sync.rithmic.accounts': 'Счета',
  'trade-sync.rithmic.last-sync': 'Последняя синхронизация',
  'trade-sync.rithmic.never': 'Никогда',
  'trade-sync.rithmic.job.running': 'Идёт синхронизация…',
  'trade-sync.rithmic.job.last': 'Последняя задача: {status}',
  'trade-sync.job.status.queued': 'В очереди',
  'trade-sync.job.status.running': 'Выполняется',
  'trade-sync.job.status.succeeded': 'Успешно',
  'trade-sync.job.status.partial': 'Частично',
  'trade-sync.job.status.failed': 'Ошибка',
  'trade-sync.job.status.cancelled': 'Отменено',
  'trade-sync.job.status.unknown': 'Неизвестно',
  'trade-sync.rithmic.sync-to-vault': 'Синхронизировать',
  'trade-sync.rithmic.syncing': 'Синхронизация…',
  'trade-sync.rithmic.mapping-required':
    'Выберите локальный счёт хранилища для каждого синхронизируемого счёта Rithmic.',
  'trade-sync.rithmic.sync-complete-connection':
    'Синхронизация {connection} завершена.',
  'trade-sync.rithmic.sync-partial-connection':
    'Синхронизация {connection} завершена с проблемами.',
  'trade-sync.rithmic.sync-all': 'Синхронизировать все',
  'trade-sync.rithmic.sync-all-complete':
    'Синхронизировано подключений Rithmic: {succeeded} из {total}.',
  'trade-sync.rithmic.sync-all-partial':
    'Синхронизировано подключений Rithmic: {succeeded} из {total}. Проверьте подключения с проблемами.',
  'trade-sync.rithmic.sync-all-provider-partial':
    'Синхронизировано подключений Rithmic: {succeeded} из {total} · синхронизация завершена частично',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic допускает только одну активную сессию. Закройте R|Trader, NinjaTrader или другую платформу с этим логином Rithmic.',
  'trade-sync.rithmic.error.auto-retry':
    'Journalit повторит попытку автоматически.',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic отклонил сохранённые учётные данные. Обновите их на Journalit.co и попробуйте снова.',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic требует подписать соглашения о рыночных данных в R|Trader. Подпишите их и попробуйте снова.',
  'trade-sync.rithmic.error.disabled':
    'Синхронизация Rithmic отключена для этого подключения. Управляйте им на Journalit.co.',
  'trade-sync.rithmic.error.sync-failed':
    'Синхронизация Rithmic не удалась. Проверьте подключение на Journalit.co и попробуйте снова.',
  'trade-sync.broker.mapping-unsaved-hint':
    'Сопоставление сохраняется при синхронизации.',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'Несохранённые изменения счёта. Синхронизируйте это подключение, чтобы сохранить их.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    'Сначала выберите счёт Journalit для каждого синхронизируемого счёта.',
  'trade-sync.broker.sync-all-blocked.running-job':
    'Синхронизация уже выполняется.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'Нет подключений, готовых к синхронизации.',
  'trade-sync.rithmic.connect-another': 'Подключить ещё один аккаунт Rithmic',
  'trade-sync.rithmic.error.sync-failed-detail':
    'Синхронизация Rithmic не удалась: {message}',
  'trade-sync.tradovate.never': 'Никогда',

  'trade-sync.import.card.inventory-summary':
    'Счетов: {accounts} · сделок: {trades}',
  'trade-sync.import.action.check': 'Проверить',

  'trade-sync.import.action.open-import': 'Открыть Trade Import',

  'trade-sync.import.action.create-local-account': 'Создать счёт',

  'trade-sync.import.action.restore-account': 'Восстановить',
  'trade-sync.import.action.restoring': 'Восстановление…',

  'trade-sync.import.pending-acks': 'Ожидает подтверждения: {count}',

  'trade-sync.import.empty-accounts':
    'Резервных копий счетов Trade Import пока не найдено.',
  'trade-sync.import.account.restorable-count': 'Можно восстановить: {count}',
  'trade-sync.import.account.synced-count': 'Синхронизировано: {count}',
  'trade-sync.import.account.missing-count': 'Отсутствует: {count}',
  'trade-sync.import.account.issue-count': 'Проблем: {count}',
  'trade-sync.import.account.local-account': 'Счёт Journalit',
  'trade-sync.import.notice.restored':
    'Восстановлено импортированных сделок: {count}.',

  'trade-sync.import.notice.sync-cloud-failed':
    'Не удалось запустить облачную синхронизацию.',
  'trade-sync.import.notice.load-failed':
    'Не удалось загрузить статус синхронизации Trade Import.',
  'trade-sync.import.notice.mapping-failed':
    'Не удалось сохранить сопоставление счетов Trade Import.',
  'trade-sync.import.notice.create-account-failed':
    'Не удалось создать локальный счёт.',
  'trade-sync.import.notice.restore-failed':
    'Не удалось восстановить счёт Trade Import.',
  'trade-sync.rate-limit.action.mapping': 'Сопоставление счёта',
  'trade-sync.import.notice.rate-limited':
    '{action}: слишком много запросов. Повторите через {seconds} с.',
  'setups.view.loading': 'Загрузка сетапов…',
  'setups.view.trade.unknown-instrument': 'Неизвестный инструмент',
  'command.open-session-mode': 'Открыть живую сессию',
  'view.session-mode': 'Режим сессии',
  'widget.session-log.name': 'Журнал сессии',
  'widget.session-log.description':
    'Записывайте заметки исполнения с отметками времени и события сделок.',
  'session-log.title': 'Журнал режима сессии',
  'session-log.description':
    'Фиксируйте, что происходит во время текущей торговой сессии.',
  'session-log.notice.invalid-timestamp':
    'Введите корректную отметку времени для журнала сессии.',
  'session-log.action.auto-time': 'Автовремя',
  'session-log.action.set-time': 'Задать время',

  'session-log.composer.tag-label': 'Тег журнала сессии',
  'session-log.placeholder.entry-short': 'Добавить заметку сессии...',
  'session-log.action.add-entry': 'Добавить запись с отметкой времени',
  'session-log.action.add-note': 'Добавить',
  'session-log.action.hide-composer': 'Скрыть редактор',
  'session-log.filter.all': 'Все',
  'session-log.filter.label': 'Фильтровать журнал сессии',
  'session-log.filter.clear': 'Очистить фильтр',
  'session-log.timeline.most-recent': 'Самое новое',
  'session-log.timeline.start': 'Начало сессии',
  'session-log.empty': 'В журнале сессии пока нет записей.',
  'session-log.empty-filtered': 'Нет записей, соответствующих этому фильтру.',
  'session-log.loading': 'Загрузка журнала сессии…',
  'session-log.lessons.title': 'Извлечённые уроки',

  'session-log.lessons.badge': 'LSN',
  'session-log.session-group.outside': 'Вне сессий',

  'session-log.trade.entered': 'Вход',
  'session-log.trade.exited': 'Выход',
  'session-log.trade.size': 'размер',

  'session-log.status.unclassified': 'без категории',
  'session-log.action.save': 'Сохранить',
  'session-log.action.cancel': 'Отмена',

  'session-log.action.classify': 'Классифицировать',
  'session-log.action.edit': 'Изменить',
  'session-log.action.delete': 'Удалить',
  'session-log.action.open-trade': 'Открыть сделку',
  'session-log.preview':
    'Предпросмотр журнала сессии: заметки с отметками времени и события сделок появятся здесь во время живой сессии.',
  'session-log.alert.tag-concentration':
    '{tag} составляет {percentage}% заметок сессии ({count}/{total}). Проверьте возможное отклонение перед продолжением.',

  'session-mode.loading': 'Загрузка режима сессии',

  'session-mode.section.timeline': 'Хронология',
  'session-mode.title.ended': 'Сессия завершена',

  'session-mode.title.break': 'Перерыв сессии',
  'session-mode.title.live': 'Живая сессия',
  'session-mode.title.preparation': 'Подготовка к сессии',

  'session-mode.prep.resources': 'Ресурсы',

  'session-mode.action.open-drc-for-date': 'Открыть DRC за {date}',
  'session-mode.ended.helper': 'Запишите сделки или просмотрите день.',
  'session-mode.ended.action.import-trades': 'Импортировать сделки',
  'session-mode.ended.action.add-trade-manually': 'Добавить сделку вручную',
  'session-mode.ended.action.open-drc': 'Открыть DRC',
  'session-log.session-group.unplanned': 'Незапланированная @ {time}',
  'session-mode.unplanned.name': 'Незапланированная сессия',
  'session-mode.unplanned.start': 'Начать незапланированную сессию',
  'session-mode.unplanned.stop': 'Завершить сессию',
  'session-mode.unplanned.badge': 'Незапланированная',
  'session-mode.unplanned.status.live': 'Начата в {time} · прошло {elapsed}',
  'session-mode.unplanned.ended.summary':
    'Незапланированная сессия · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'Начать незапланированную сессию',
  'session-mode.unplanned.modal.description':
    'Вы вне запланированных окон сессий. Эта сессия будет отмечена как незапланированная в дневном обзоре. Запишите, почему вы торгуете сейчас.',
  'session-mode.unplanned.modal.reason-label': 'Причина',
  'session-mode.unplanned.modal.reason-placeholder':
    'напр. FOMC в 14:00, пропустил утреннюю сессию',
  'session-mode.unplanned.modal.reason-required':
    'Укажите причину перед началом.',
  'session-mode.unplanned.notice.started': 'Незапланированная сессия начата.',
  'session-mode.unplanned.notice.stopped':
    'Незапланированная сессия завершена.',
  'session-mode.unplanned.notice.blocked-live': 'Сессия уже идёт.',
  'session-mode.unplanned.notice.none-running':
    'Нет активной незапланированной сессии.',
  'session-mode.unplanned.notice.failed':
    'Не удалось обновить незапланированную сессию. Подробности в консоли.',
  'session-mode.ended.stat.trades': 'Сделки',
  'session-mode.ended.stat.notes': 'Заметки',
  'session-mode.ended.stat.gate-checks': 'Проверки Gate',
  'session-mode.waiting.next-session': 'Следующая сессия',
  'session-mode.waiting.starts-at': '{session} начнется в {time}',
  'session-mode.waiting.preparation-opens-in':
    'Подготовка откроется через {remaining}',
  'session-mode.waiting.open-drc': 'Открыть DRC',

  'session-mode.break.reset-before': 'Перезагрузитесь перед {session}',
  'session-mode.break.reset': 'Перезагрузитесь перед следующей сессией',
  'session-mode.break.next-session-meta':
    'Следующая сессия в {time} · осталось {remaining}',
  'session-mode.break.description':
    'Отойдите, выпейте воды и очистите мысли перед следующей сессией.',
  'session-mode.break.open-drc': 'Открыть DRC',
  'session-mode.countdown.starts-in': 'Начнётся через',
  'session-mode.countdown.starts-at': '{session} начнётся в {time}',
  'session-mode.countdown.hours': 'ч',
  'session-mode.countdown.minutes': 'мин',
  'session-mode.countdown.seconds': 'сек',
  'session-mode.phase.preparation': 'Подготовка',
  'session-mode.phase.live': 'В эфире',
  'session-mode.phase.waiting': 'Ожидание',
  'session-mode.phase.break': 'Перерыв',
  'session-mode.phase.ended': 'Завершено',
  'session-mode.phase.unconfigured': 'Расписание сессии не настроено',
  'session-mode.status.preparation':
    '{session} начинается в {time}. У вас есть {remaining} на подготовку.',
  'session-mode.status.preparation-generic':
    'Подготовьтесь к следующей живой торговой сессии.',
  'session-mode.status.waiting':
    '{session} начинается в {time}. Подготовка начнется через {remaining}.',
  'session-mode.status.waiting-generic':
    'Следующая сессия запланирована, но подготовка еще не началась.',
  'session-mode.status.live': 'Осталось {remaining} в этой сессии.',
  'session-mode.status.live-generic': 'Ваша торговая сессия идет сейчас.',
  'session-mode.status.break':
    '{session} начинается в {time}. Перерыв длится еще {remaining}.',
  'session-mode.status.break-generic': 'Вы между торговыми сессиями.',
  'session-mode.status.ended': 'Настроенные торговые сессии пока завершены.',
  'session-mode.status.unconfigured':
    'Настройте окна сессий, чтобы включить фазы подготовки, live, перерыва и завершения. Хронология остается доступной для сегодняшнего DRC.',

  'session-mode.unconfigured.title': 'Настройка режима сессии',
  'session-mode.unconfigured.description':
    'Добавьте время сессий, чтобы начать.',
  'session-mode.unconfigured.step.window.title': 'Добавьте окно сессии',
  'session-mode.unconfigured.step.prep.title': 'Проверьте время подготовки',
  'session-mode.unconfigured.step.gate.title':
    'Используйте стартовый Trade Gate',
  'session-mode.unconfigured.step.log.title':
    'Записывайте заметки во время активных сессий',
  'session-mode.unconfigured.action': 'Настроить Режим сессии',
  'session-mode.guide.why.title': 'Торгуйте по плану, а не по настроению',
  'session-mode.guide.why.description':
    'Режим сессии готовит вас перед каждой сессией, держит в рамках правил с помощью Trade Gate, пока сессия идёт, и ведёт журнал с отметками времени, чтобы переиграть день. Настройка занимает две минуты.',
  'session-mode.guide.configure.title': 'Настройте сейчас',
  'session-mode.guide.configure.description':
    'Добавьте время сессий и соберите первый Trade Gate. Короткий гид проведёт вас в настройках.',
  'session-mode.guide.preparation.countdown.title':
    'Ваша сессия скоро начнётся',
  'session-mode.guide.preparation.countdown.description':
    'Это фаза подготовки. Обратный отсчёт показывает, когда вы выйдете в рынок, и страница сама переключится в режим сессии.',
  'session-mode.guide.preparation.goals.title': 'Поставьте цели на сегодня',
  'session-mode.guide.preparation.goals.description':
    'До открытия запишите, какой должна быть хорошая сессия, чтобы было, за что себя держать.',
  'session-mode.guide.preparation.checklist.title': 'Пройдите чек-лист',
  'session-mode.guide.preparation.checklist.description':
    'Отмечайте здесь свою рутину перед сессией. Всё отмеченное сохраняется в сегодняшнюю заметку обзора.',
  'session-mode.guide.preparation.next.title': 'Когда сессия начнётся',
  'session-mode.guide.preparation.next.description':
    'Здесь появятся ваш Trade Gate и журнал сессии. В первый раз мы всё покажем.',
  'session-mode.guide.live.trade-gate.title':
    'Проходите Trade Gate перед каждой сделкой',
  'session-mode.guide.live.trade-gate.description':
    'Нажмите «Старт» и ответьте на вопросы, собранные из ваших критериев. Гейт заканчивается зелёным светом, «подождать» или «не торговать», так что вы берёте только сделки, которые разрешает ваша система.',
  'session-mode.guide.live.session-log.title':
    'Записывайте, что видите и чувствуете',
  'session-mode.guide.live.session-log.description':
    'Фиксируйте сетапы, эмоции и решения по ходу. У каждой записи есть отметка времени, чтобы потом переиграть, что именно происходило.',
  'session-mode.guide.live.settings.title': 'Настраивайте в любой момент',
  'session-mode.guide.live.settings.description':
    '«Изменить» открывает настройки режима сессии: время сессий, макет фаз, сценарии Trade Gate и теги журнала.',
  'settings.session-mode.guide.setting-name': 'Обзор',
  'settings.session-mode.guide.setting-desc':
    'Короткий тур по этим настройкам — от времени сессий до первого Trade Gate.',
  'settings.session-mode.guide.replay': 'Показать гид',
  'settings.session-mode.guide.intro.title': 'Настроим режим сессии',
  'settings.session-mode.guide.intro.description':
    'Четыре вещи: когда идут сессии, что показывает каждая фаза, ваш Trade Gate и теги журнала сессии.',
  'settings.session-mode.guide.lead-time.title': 'Время на подготовку',
  'settings.session-mode.guide.lead-time.description':
    'За сколько минут до сессии открывается фаза подготовки.',
  'settings.session-mode.guide.windows.title': 'Добавьте окна сессий',
  'settings.session-mode.guide.windows.description':
    'По одному окну на каждую сессию, которую вы торгуете: название, начало и конец. По ним режим сессии понимает, когда готовиться и когда вы в рынке.',
  'settings.session-mode.guide.layout.title':
    'Выберите, что показывает каждая фаза',
  'settings.session-mode.guide.layout.description':
    'Включайте и выключайте модули по фазам: ресурсы, цели и чек-лист для подготовки; Trade Gate и таймлайн сессии — вживую.',
  'settings.session-mode.guide.trade-gate.title': 'Соберите свой Trade Gate',
  'settings.session-mode.guide.trade-gate.description':
    '«Добавить» в первый раз создаёт стартовый сценарий из типичных вопросов, а затем — пустой; в библиотеке есть готовые вопросы. Каждый вопрос ведёт к следующему или к исходу: зелёный свет, подождать или не торговать.',
  'settings.session-mode.guide.editor.title': 'Вопросы и исходы',
  'settings.session-mode.guide.editor.description':
    'Разверните сценарий, чтобы добавить вопросы и задать, куда ведёт каждый ответ. Кнопка воспроизведения запускает его так, как вы увидите в сессии.',
  'settings.session-mode.guide.tags.title': 'Теги для журнала сессии',
  'settings.session-mode.guide.tags.description':
    'Помечайте записи тегами по ходу — например, по эмоции или сетапу, — чтобы фильтровать их в обзоре.',
  'settings.session-mode.guide.finish.title': 'Готово',
  'settings.session-mode.guide.finish.description':
    'Открывайте режим сессии с панели или с главной. Добавьте виджет журнала сессии в макет DRC, чтобы видеть записи в каждом обзоре.',

  'session-mode.layout.empty.title': 'Для этой фазы ничего не включено',
  'session-mode.layout.empty.description':
    'Снова включите модули, чтобы собрать эту фазу режима сессии.',
  'session-mode.duration.minutes': '{minutes}м',
  'session-mode.duration.hours': '{hours}ч',
  'session-mode.duration.hours-minutes': '{hours}ч {minutes}м',
  'settings.session-mode.title': 'Режим сессии',
  'settings.session-mode.description':
    'Настройте окна сессий, подготовку, макет фаз, рабочие процессы Trade Gate и теги журнала сессии.',
  'settings.session-mode.preparation-lead-time': 'Время подготовки (минуты)',
  'settings.session-mode.preparation-lead-time-desc':
    'За сколько до сессии начинается режим подготовки.',
  'settings.session-mode.windows': 'Окна сессий',

  'settings.session-mode.add-window-short': 'Добавить',
  'settings.session-mode.no-windows':
    'Окна сессий пока не настроены. Живая хронология всё еще работает, но фазовая подготовка начнется после добавления окна.',
  'settings.session-mode.layout.title': 'Макет фаз',

  'settings.session-mode.layout.phase-desc.preparation':
    'Выберите, что показывать во время подготовки до начала торговли.',
  'settings.session-mode.layout.phase-desc.live':
    'Выберите, что показывать во время настроенной торговой сессии.',

  'settings.session-mode.layout.phase-desc.ended':
    'Выберите, что показывать после завершения всех настроенных торговых сессий.',
  'settings.session-mode.layout.reset-phase': 'Сбросить',

  'settings.session-mode.layout.module.preparation-resources': 'Ресурсы',
  'settings.session-mode.layout.module.preparation-resources-desc':
    'Показывает связанные заметки для подготовки и плейбуки.',
  'settings.session-mode.layout.module.preparation-goals': 'Цели',
  'settings.session-mode.layout.module.preparation-goals-desc':
    'Показывает виджет целей DRC, чтобы сфокусироваться перед сессией.',
  'settings.session-mode.layout.module.preparation-checklist': 'Чек-лист',
  'settings.session-mode.layout.module.preparation-checklist-desc':
    'Показывает виджет чек-листа DRC для подготовки к сессии.',
  'settings.session-mode.layout.module.trade-gate': 'Trade Gate',
  'settings.session-mode.layout.module.trade-gate-desc':
    'Запускает настроенный gate ЕСЛИ/ТО во время активной сессии.',
  'settings.session-mode.layout.module.timeline': 'Хронология сессии',
  'settings.session-mode.layout.module.timeline-desc':
    'Показывает заметки и сделки текущей сессии на временной шкале.',

  'settings.session-mode.layout.module.ended-actions': 'Действия после сессии',
  'settings.session-mode.layout.module.ended-actions-desc':
    'Показывает действия импорта, ручной сделки и DRC после окончания сессий.',
  'settings.session-mode.layout.module.ended-stats': 'Статистика сессии',
  'settings.session-mode.layout.module.ended-stats-desc':
    'Показывает итоги за день: сделки, заметки и проверки gate.',
  'settings.session-mode.linked-resources': 'Связанные ресурсы',
  'settings.session-mode.linked-resources-desc':
    'Показывает быстрые ссылки на заметки во время подготовки.',
  'settings.session-mode.linked-resources-count': 'Связано: {count}',
  'settings.session-mode.linked-resources-hide': 'Скрыть связанные',
  'settings.session-mode.session-log': 'Журнал сессии',
  'settings.session-mode.session-log-desc':
    'Выберите, какие автоматические события будут отображаться рядом с заметками сессии.',
  'settings.session-mode.show-trade-executions': 'Входы и выходы из сделок',
  'settings.session-mode.show-trade-executions-desc':
    'Показывать входы и выходы из сделок в журналах режима сессии и ежедневного обзора.',
  'settings.session-mode.session-log-tags': 'Теги журнала сессии',
  'settings.session-mode.session-log-tags-desc':
    'Настройте теги, доступные в компоновщике режима сессии и журнале сессии DRC.',
  'settings.session-mode.tag-label-placeholder': 'Название тега',
  'settings.session-mode.tag-short-label-placeholder': 'Метка',
  'settings.session-mode.tag-label-example': 'Сделка',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Цвет тега',
  'settings.session-mode.tag-requires-resolution': 'Требует классификации',
  'settings.session-mode.tag-lesson': 'Тег урока',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Записи с этим тегом считаются некатегоризированными. Используйте его, когда во время сессии неясно, какой тег подходит, и классифицируйте запись позже.',
  'settings.session-mode.tag-lesson-tooltip':
    'Отмечает тег как учебную запись. Заметки с тегом урока остаются в журнале сессии и могут выводиться фильтрами уроков и сводками обзоров.',
  'settings.session-mode.add-session-log-tag': 'Добавить тег журнала сессии',
  'settings.session-mode.reset-session-log-tags': 'Сбросить',
  'settings.session-mode.tag-color.blue': 'Синий',
  'settings.session-mode.tag-color.indigo': 'Индиго',
  'settings.session-mode.tag-color.purple': 'Фиолетовый',
  'settings.session-mode.tag-color.green': 'Зелёный',
  'settings.session-mode.tag-color.pink': 'Розовый',
  'settings.session-mode.tag-color.amber': 'Янтарный',
  'settings.session-mode.tag-color.red': 'Красный',
  'settings.session-mode.tag-color.orange': 'Оранжевый',

  'settings.session-mode.search-resource-placeholder':
    'Искать файлы хранилища для ссылки…',

  'settings.session-mode.window-name': 'Название сессии',
  'settings.session-mode.window-name-placeholder': 'напр. NY AM',

  'settings.session-mode.start-time': 'Время начала',
  'settings.session-mode.end-time': 'Время окончания',

  'trade-gate.workflow': 'Сценарий',

  'trade-gate.action.start-short': 'Начать',
  'trade-gate.action.start-another': 'Начать другую',
  'trade-gate.outcome.green-light': 'Зелёный свет',
  'trade-gate.outcome.green-light-description': 'Условия выполнены.',
  'trade-gate.outcome.no-trade': 'Не торговать',
  'trade-gate.outcome.no-trade-description': 'Условия не выполнены.',
  'trade-gate.outcome.wait': 'Ждать',
  'trade-gate.outcome.wait-description':
    'Сетап не готов. Ждите следующую возможность.',
  'settings.session-mode.trade-gate.title': 'Сценарии Trade Gate',
  'settings.session-mode.trade-gate.desc':
    'Создавайте IF/THEN сценарии решений для проверки входа в реальном времени.',
  'settings.session-mode.trade-gate.delete-workflow.title':
    'Удалить сценарий Trade Gate?',
  'settings.session-mode.trade-gate.delete-workflow.message':
    'Удалить «{name}»? Все вопросы и ветки этого сценария будут удалены. Это действие нельзя отменить.',
  'settings.session-mode.trade-gate.delete-workflow.confirm':
    'Удалить сценарий',
  'settings.session-mode.trade-gate.name': 'Название сценария',
  'settings.session-mode.trade-gate.edit-question': 'Изменить вопрос',
  'settings.session-mode.trade-gate.no-options':
    'Добавьте варианты ответа для этого вопроса.',
  'settings.session-mode.trade-gate.not-wired': 'Пока не подключено',
  'settings.session-mode.trade-gate.not-wired-hint':
    'Нажмите, чтобы подключить',
  'settings.session-mode.trade-gate.target-group-questions': 'Вопросы',
  'settings.session-mode.trade-gate.target-current': 'Текущий: {title}',
  'settings.session-mode.trade-gate.target-group-outcomes': 'Результаты',
  'settings.session-mode.trade-gate.new-question-target': '+ Новый вопрос',
  'settings.session-mode.trade-gate.outcome-note':
    'Примечание к результату (только для этой ветки)',
  'settings.session-mode.trade-gate.remove-from-workflow':
    'Удалить из этого сценария',
  'settings.session-mode.trade-gate.used-in-workflows':
    'Используется в сценариях: {count}',
  'settings.session-mode.trade-gate.not-used': 'Пока не используется',
  'settings.session-mode.trade-gate.question-count': 'Вопросов: {count}',
  'settings.session-mode.trade-gate.library-title': 'Библиотека вопросов',
  'settings.session-mode.trade-gate.library-search': 'Поиск вопросов…',
  'settings.session-mode.trade-gate.library-empty':
    'Вопросы не найдены. Создайте первый, чтобы начать.',
  'settings.session-mode.trade-gate.delete-question.title': 'Удалить вопрос?',
  'settings.session-mode.trade-gate.delete-question.message':
    'Удалить «{name}» из библиотеки вопросов? Это действие нельзя отменить.',
  'settings.session-mode.trade-gate.delete-question.message-used':
    'Удалить «{name}» из библиотеки вопросов? Он используется в: {workflows}. Ветви в этих сценариях будут удалены. Это действие нельзя отменить.',
  'settings.session-mode.trade-gate.delete-question.confirm': 'Удалить вопрос',
  'settings.session-mode.trade-gate.unplaced-title':
    'В этом сценарии ещё не подключены',
  'settings.session-mode.trade-gate.no-start':
    'Выберите начальный вопрос, чтобы увидеть поток.',
  'settings.session-mode.trade-gate.untitled': 'Безымянный сценарий',
  'settings.session-mode.trade-gate.start-node': 'Начальный вопрос',
  'settings.session-mode.trade-gate.simulation.show': 'Симулировать',
  'settings.session-mode.trade-gate.simulation.unavailable':
    'Соедините начальный вопрос хотя бы с одним завершённым результатом перед запуском симуляции.',
  'settings.session-mode.trade-gate.add-question': 'Добавить вопрос',
  'settings.session-mode.trade-gate.question': 'Вопрос',
  'settings.session-mode.trade-gate.new-question-title': 'Новый вопрос',
  'settings.session-mode.trade-gate.question-title': 'Название вопроса',
  'settings.session-mode.trade-gate.prompt': 'Вопрос',
  'settings.session-mode.trade-gate.options': 'Варианты',
  'settings.session-mode.trade-gate.option': 'Вариант',
  'settings.session-mode.trade-gate.option-label': 'Метка варианта',
  'settings.session-mode.trade-gate.option-target': 'Ведёт к',
  'settings.session-mode.trade-gate.flow-map': 'Карта потока',
  'settings.session-mode.trade-gate.flow-fit': 'Вписать',
  'settings.session-mode.trade-gate.flow-click-hint':
    'Нажмите на карточку, подпись пути или результат, чтобы изменить их.',
  'settings.session-mode.trade-gate.no-questions':
    'Добавьте первый вопрос, чтобы начать этот сценарий.',
  'filter.modal.image.annotation-status': 'Статус аннотаций',
  'filter.modal.image.status.tagged': 'С тегами',
  'filter.modal.image.status.untagged': 'Без тегов',
  'filter.modal.image.status.has-notes': 'Есть заметки',
  'filter.modal.image.status.no-notes': 'Нет заметок',
  'filter.modal.image.tags': 'Теги медиа',
  'setups.view.detail.action.gallery': 'Открыть галерею',
  'tradelog.mode.label': 'Режим журнала сделок',
  'tradelog.mode.trades': 'Сделки',
  'tradelog.mode.image-gallery': 'Галерея',

  'imageGallery.empty.error.title': 'Галерея недоступна',
  'imageGallery.empty.no-images.title': 'Медиа пока нет',
  'imageGallery.empty.no-images.description':
    'Изображения, GIF, видео и ссылки YouTube, прикрепленные к сделкам или заметкам обзора, будут автоматически появляться здесь.',
  'imageGallery.empty.no-results.title': 'Нет медиа по этим фильтрам',
  'imageGallery.empty.no-results.description':
    'Попробуйте очистить активные фильтры или расширить диапазон дат, чтобы вернуть больше элементов галереи.',
  'imageGallery.empty.no-source.title': 'В этом источнике нет медиа',
  'imageGallery.empty.no-source.description':
    'В этом источнике пока нет элементов галереи. Вернитесь ко всем медиа или выберите другой источник.',
  'imageGallery.empty.action.clear-filters': 'Очистить фильтры',
  'imageGallery.empty.action.show-all': 'Показать все медиа',
  'imageGallery.error.load-failed': 'Не удалось загрузить галерею.',

  'imageGallery.open-source': 'Открыть источник',
  'imageGallery.image-alt': 'Медиа {source} от {date}',
  'imageGallery.privacy-blurred': 'Размыто для конфиденциальности',

  'imageGallery.sort.label': 'Сортировка:',
  'imageGallery.sort.newest': 'Сначала новые',
  'imageGallery.sort.oldest': 'Сначала старые',
  'imageGallery.sort.best': 'Лучший P&L',
  'imageGallery.sort.worst': 'Худший P&L',
  'imageGallery.size-aria': 'Размер медиа галереи',
  'imageGallery.size.small': 'Маленький',
  'imageGallery.size.medium': 'Средний',
  'imageGallery.size.large': 'Большой',
  'imageGallery.view-mode-aria': 'Группировка карточек галереи',
  'imageGallery.view-mode.grouped': 'Сгруппированные',
  'imageGallery.view-mode.individual': 'Отдельные',
  'imageGallery.group.additional-media': '{count} дополнительных медиафайлов',
  'imageGallery.group.annotation-summary':
    '{annotated} из {total} медиафайлов с аннотациями',
  'imageGallery.group.navigation':
    'Медиа {mediaCurrent} из {mediaTotal} · Запись {groupCurrent} из {groupTotal}',
  'imageGallery.source.label': 'Источник:',
  'imageGallery.source.all': 'Все медиа',
  'imageGallery.source.trade': 'Сделки',
  'imageGallery.source.folder': 'Папки',
  'imageGallery.source.reviews': 'Обзоры',
  'imageGallery.source.drc': 'Ежедневные обзоры',
  'imageGallery.source.weekly': 'Еженедельные обзоры',
  'imageGallery.source.monthly': 'Ежемесячные обзоры',
  'imageGallery.source.quarterly': 'Квартальные обзоры',
  'imageGallery.source.yearly': 'Годовые обзоры',

  'imageGallery.annotation.reviewed': 'Проверено',
  'imageGallery.annotation.unreviewed': 'Непроверено',
  'imageGallery.date.unknown': 'Неизвестная дата',
  'imageGallery.annotation.tag': 'Тег',

  'imageGallery.annotation.editor-title': 'Аннотировать медиа',
  'imageGallery.annotation.editor-title-with-file': 'Аннотировать {fileName}',
  'imageGallery.annotation.tags': 'Теги',
  'imageGallery.annotation.tags-placeholder': 'Пробой, сетап A+, ошибка',
  'imageGallery.annotation.notes': 'Заметки',
  'imageGallery.annotation.notes-placeholder':
    'Что будущий вы должны извлечь из этого графика?',
  'imageGallery.annotation.error.save-failed':
    'Не удалось сохранить аннотацию медиа.',
  'imageGallery.annotation.error.load-failed':
    'Не удалось загрузить аннотацию медиа.',
  'imageGallery.annotation.saving': 'Сохранение...',
  'settings.gallery-folders.section': 'Медиагалерея',
  'settings.gallery-folders.description':
    'Показывать медиафайлы из этих папок в галерее журнала сделок.',
  'settings.gallery-folders.placeholder': 'Выберите папку...',
  'settings.gallery-folders.add': 'Добавить',
  'settings.gallery-folders.remove-aria': 'Удалить папку галереи {path}',
  'settings.gallery-folders.not-a-folder': 'Выберите папку, а не медиафайл.',
  'settings.gallery-folders.save-failed':
    'Не удалось сохранить папки галереи. Повторите попытку.',
  'filter.menu.whats-new.open.title': 'У фильтров новое меню',
  'filter.menu.whats-new.open.description':
    'Все фильтры теперь в одном многоуровневом меню, и в нём два новых способа сузить сделки. Откройте его, чтобы их увидеть.',
  'filter.menu.whats-new.exclude.title': 'Исключайте лишнее',
  'filter.menu.whats-new.exclude.description':
    'У каждого значения есть кнопка ⊘. Исключённое значение убирает любую сделку, в которой оно есть, чему бы ещё она ни соответствовала.',
  'filter.menu.whats-new.match.title':
    'Выберите, как совпадают несколько значений',
  'filter.menu.whats-new.match.description':
    'Если выбрано несколько значений, решите, нужно ли сделке «Любое из», «Все из», «Только эти» или «Ровно эти». У тегов, сетапов, ошибок и пользовательских полей есть этот параметр «Совпадение».',
  'filter.menu.whats-new.phases.title': 'Фильтр по фазе челленджа',
  'filter.menu.whats-new.phases.description':
    'Проп-счета с несколькими фазами открывают список своих фаз. Выбирайте отдельные фазы вместо всего счёта.',
  'filter.menu.whats-new.done.title': 'Вот что нового в фильтрах',
  'filter.menu.whats-new.done.description':
    'Это же меню работает в журнале сделок, Дашборде, на Главной, в Сетапах и в обзорах. Изменения применяются сразу по клику.',
  'tradelog.guide.image-gallery-empty.intro.title': 'Медиа пока нет',
  'tradelog.guide.image-gallery-empty.intro.description':
    'Добавьте изображения, GIF, видео или ссылки YouTube к сделкам или заметкам обзоров, и они автоматически появятся здесь. Когда появятся медиа, Journalit покажет полный гид по галерее: полноэкранный разбор, теги и заметки.',

  'tradelog.guide.gallery-grouping.title':
    'Группировать медиа по записи журнала',
  'tradelog.guide.gallery-grouping.description':
    '«Сгруппировано» держит вместе каждую сделку, обзор или настроенную папку. «По отдельности» показывает каждый медиафайл на отдельной карточке.',
  'tradelog.guide.gallery-source-sort.title':
    'Выберите источник и порядок медиа',
  'tradelog.guide.gallery-source-sort.description':
    'Используйте «Источник», чтобы показать все медиа, вложения сделок, медиа из заметок обзоров или настроенные папки хранилища. Используйте «Сортировку», чтобы просматривать элементы от новых к старым или по результату сделки.',
  'tradelog.guide.gallery-filters.title': 'Фильтруйте галерею из того же места',
  'tradelog.guide.gallery-filters.description':
    'Меню фильтров работает здесь так же. В режиме галереи в нём также есть раздел «Галерея» с фильтрами медиа, например по статусу аннотаций и тегам медиа.',
  'tradelog.guide.gallery-grid.title': 'Откройте медиа для подробного разбора',
  'tradelog.guide.gallery-grid.description':
    'Каждая карточка не перекрывает график и одновременно показывает краткий контекст сделки или обзора. Нажмите любую карточку или Далее, чтобы открыть первый видимый элемент на весь экран.',
  'tradelog.guide.gallery-finish.title':
    'Теперь вы знаете оба режима журнала сделок',
  'tradelog.guide.gallery-finish.description':
    'Используйте Сделки, когда нужна таблица и массовые действия. Используйте Галерею, когда хотите разбирать изображения, GIF, видео, ссылки YouTube и аннотации по всему журналу.',
  'filter.modal.section.image-gallery': 'Галерея',
  'filter.modal.session-tags.placeholder': 'Теги сессии',
  'filter.modal.session-tags.none-found': 'Теги сессии не найдены',
  'account.prop-challenge.title': 'Челлендж проп-фирмы',
  'account.prop-challenge.identity': 'Сведения о челлендже',
  'account.prop-challenge.prefill.heading-link': 'Заполнить из вашей фирмы',
  'account.prop-challenge.prefill.updates-link': 'Следить за правилами фирмы',
  'account.prop-challenge.prefill.updates-link-firm':
    'Следить за правилами {firm}',
  'account.prop-challenge.prefill.phase-link': 'Заполнить правила с PRO',
  'account.prop-challenge.prefill.phase-link-firm':
    'Заполнить правила {firm} с PRO',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} ещё, правила заполняются с PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, правила заполняются с PRO',
  'account.prop-challenge.prefill.match':
    'У нас есть {firm}: {count} челленджей с готовыми правилами',
  'account.prop-challenge.rules.empty':
    'Правила ещё не добавлены. Используйте «Добавить правило», чтобы настроить этот этап.',
  'account.prop-challenge.rules': 'Правила',
  'account.prop-challenge.costs.empty': 'Расходы пока не добавлены.',
  'account.prop-challenge.challenge-name': 'Название челленджа',
  'account.prop-challenge.challenge-name-placeholder': 'напр., Испытание 25K',
  'account.prop-challenge.firm-name': 'Название фирмы',
  'account.prop-challenge.firm-name-placeholder': 'напр., Apex Trader Funding',
  'account.prop-challenge.profile.title': 'Применить правила фирмы',
  'account.prop-challenge.profile.firm': 'Фирма',
  'account.prop-challenge.profile.challenge': 'Испытание',
  'account.prop-challenge.profile.choose-firm': 'Выберите фирму',
  'account.prop-challenge.profile.choose-challenge': 'Выберите челлендж',
  'account.prop-challenge.profile.custom-firm': 'Другая / своя фирма',
  'account.prop-challenge.profile.help':
    'Выберите фирму и план, чтобы заполнить их правила: просадка, цели, выплаты. Их можно изменить позже.',
  'account.prop-challenge.profile.current': 'Сейчас: {identity}',
  'account.prop-challenge.profile.apply': 'Применить',
  'account.prop-challenge.profile.loading': 'Загрузка правил фирмы…',
  'account.prop-challenge.profile.refreshing': 'Проверка обновлений правил…',
  'account.prop-challenge.profile.unavailable':
    'Правила фирмы недоступны офлайн.',

  'account.prop-challenge.profile.confirm-title':
    'Заменить настройки испытания?',
  'account.prop-challenge.profile.confirm-message':
    'Применение этих правил фирмы заменит текущие фазы и правила.',
  'account.prop-challenge.phase-rules': 'Правила этапа «{phase}»',
  'account.prop-challenge.next-phase': 'Далее: {phase}',
  'account.prop-challenge.view-phase': 'Просмотреть этап',
  'account.prop-challenge.unnamed-phase': 'Фаза без названия',
  'account.prop-challenge.phase-name': 'Название фазы',
  'account.prop-challenge.starting-balance': 'Начальный баланс',
  'account.prop-challenge.broker-account-id': 'Брокерские счета',
  'account.prop-challenge.broker-accounts.assigned': 'Назначено на {phase}',
  'account.prop-challenge.broker-accounts.trades': '{count} сделок',
  'account.prop-challenge.broker-accounts.trade-one': '1 сделка',
  'account.prop-challenge.phase-started': 'Начало',
  'account.prop-challenge.phase-completed': 'Завершение',
  'account.prop-challenge.timeline.completed-before-started':
    'Завершение должно быть не раньше начала для {phase}.',
  'account.prop-challenge.timeline.out-of-order':
    '{phase} должна завершиться не позже начала {next}.',
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} начинается после более позднего изменения правил. Сдвиньте начало назад.',
  'account.prop-challenge.default-phase-name': 'Фаза {number}',
  'account.prop-challenge.add-phase': 'Добавить фазу',
  'account.prop-challenge.remove-phase': 'Удалить фазу',
  'account.prop-challenge.add-rule': 'Добавить правило',
  'account.prop-challenge.rule.enabled': 'Правило включено',
  'account.prop-challenge.rule.amount': 'Сумма',
  'account.prop-challenge.rule.target-type': 'Тип цели',
  'account.prop-challenge.rule.credit-withdrawals':
    'Учитывать выплаты в достижении цели',
  'account.prop-challenge.rule.drawdown-mode': 'Режим просадки',
  'account.prop-challenge.rule.lock-at-balance': 'Баланс фиксации',
  'account.prop-challenge.rule.daily-loss-model': 'Сумма дневного убытка',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'Фиксированная сумма',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'Увеличивается при достижении порога прибыли счёта',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    'Масштабируется по пиковый прибыли EOD',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    'Использует фиксированный лимит до закрытия счета на балансе активации. Со следующего торгового дня лимит равен заданному проценту максимальной прибыли на конец дня и не уменьшается.',
  'account.prop-challenge.rule.scale-at-balance': 'Баланс активации',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    'Пиковая прибыль EOD как лимит (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    '{value} от пиковой прибыли EOD',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    'Уровни прибыли по предыдущему EOD-балансу',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    'Уровни по предыдущему EOD',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    'Введите пары прибыль:лимит-убытка через запятую. Выбранная база прибыли на закрытии прошлого торгового дня задаёт лимит следующего дня; он может расти или снижаться.',
  'account.prop-challenge.rule.loss-tiers': 'Уровни прибыли и лимиты убытка',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'Изменённый денежный лимит активируется навсегда, когда накопленная реализованная прибыль сделок фазы впервые достигает заданного процента её начального баланса.',
  'account.prop-challenge.rule.profit-threshold-percent':
    'Порог прибыли счёта (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'Дневной убыток после порога',
  'account.prop-challenge.rule.breach-action': 'Действие при достижении лимита',
  'account.prop-challenge.rule.breach-action.hard':
    'Закрыть счет как нарушивший',
  'account.prop-challenge.rule.breach-action.soft':
    'Приостановить до следующей сессии',
  'account.prop-challenge.rule.days': 'Торговые дни',
  'account.prop-challenge.rule.minimum-daily-profit':
    'Минимальная прибыль за день',
  'account.prop-challenge.rule.minimum-daily-profit-summary':
    '{value}+ за день',
  'account.prop-challenge.rule.best-day-percent':
    'Максимальный лучший день (%)',
  'account.prop-challenge.rule.strict-help':
    'Чистая прибыль лучшего дня должна быть строго ниже лимита. Равенство не подходит.',
  'account.prop-challenge.rule.profit-basis.current-account':
    'Текущая прибыль счета (выплаты уменьшают)',
  'account.prop-challenge.rule.profit_target': 'Цель прибыли',
  'account.prop-challenge.rule.drawdown': 'Просадка',
  'account.prop-challenge.rule.daily_loss_limit': 'Дневной лимит убытка',
  'account.prop-challenge.rule.live_review_daily_profit':
    'Дневная прибыль для live-проверки',
  'account.prop-challenge.rule.best-profitable-day': 'Порог прибыли за день',
  'account.prop-challenge.rule.daily_profit_cap':
    'Дневной лимит учитываемой прибыли',
  'account.prop-challenge.rule.per-trading-day': 'За торговый день',
  'account.prop-challenge.rule.minimum_trading_days': 'Минимум торговых дней',
  'account.prop-challenge.rule.minimum_profitable_days':
    'Минимум прибыльных дней',
  'account.prop-challenge.rule.consistency-cushion-percent':
    'Допуск консистентности (процентные пункты)',
  'account.prop-challenge.rule.consistency-cushion-short': 'допуск',
  'account.prop-challenge.rule.consistency': 'Стабильность',
  'account.prop-challenge.rule.max_position_size':
    'Максимальный размер позиции',
  'account.prop-challenge.rule.help.target-amount':
    'Абсолютная цель задана в валюте счёта, процентная — от начального баланса фазы. Прогресс учитывает рост баланса после дневного лимита зачтённой прибыли, без нереализованного P&L.',
  'account.prop-challenge.rule.target-needs-balance':
    'Для цели в процентах нужен начальный баланс больше 0.',
  'account.prop-challenge.rule.help.credit-withdrawals':
    'Добавляет записанные валовые суммы вывода обратно к прогрессу абсолютной цели. Не меняет баланс или право на вывод.',
  'account.prop-challenge.rule.help.drawdown-amount':
    'Денежное расстояние ниже начального баланса (статический режим) или максимума реализованного баланса (скользящий). Касание нижней границы — нарушение.',
  'account.prop-challenge.rule.help.drawdown-mode':
    'Статический режим фиксирует границу. EOD следует максимумам баланса на закрытии торгового дня; внутридневной — записанным операциям реализованного баланса, не нереализованному капиталу.',
  'account.prop-challenge.rule.help.lock-balance':
    'Потолок нижней границы скользящей просадки, а не баланс активации. На этом балансе граница перестаёт расти. Пусто — без потолка.',
  'account.prop-challenge.rule.help.daily-loss-amount':
    'Денежный лимит наибольшего накопленного реализованного чистого убытка сделок за торговый день, не падения от дневного пика. Касание лимита — нарушение.',
  'account.prop-challenge.rule.help.breach-action':
    'Провал счёта сохраняет прошлое нарушение активным. Пауза до следующей сессии действует только для текущего торгового дня; прошлые нарушения остаются в истории.',
  'account.prop-challenge.rule.help.daily-loss-model':
    'Выберите фиксированный лимит, постоянное изменение при пороге прибыли, масштабирование по пику EOD-прибыли или уровням прошлого EOD. Условные поля настраивают выбранную модель.',
  'account.prop-challenge.rule.help.profit-basis':
    'Накопленная прибыль сделок исключает денежные потоки. Текущая прибыль счёта их включает, поэтому выводы её уменьшают. Оба варианта используют закрытия прошлых торговых дней.',
  'account.prop-challenge.rule.help.position-model':
    'Выберите фиксированный лимит на сделку, дополнительный контракт за шаг прибыли или явные уровни. Масштабирование использует закрытия прошлых торговых дней.',
  'account.prop-challenge.rule.help.max-contracts':
    'Максимальный размер каждой сделки после необязательного пересчёта микроконтрактов, не общая экспозиция нескольких сделок. Превышение лимита — нарушение.',
  'account.prop-challenge.rule.help.initial-contracts':
    'Начальный лимит контрактов на сделку до повышения за прибыль завершённых торговых дней.',
  'account.prop-challenge.rule.help.maximum-contracts':
    'Необязательный потолок увеличения контрактов по прибыли. Пусто — без дополнительного потолка.',
  'account.prop-challenge.rule.help.daily-profit':
    'Денежный порог дневного реализованного чистого P&L сделок с учётом прибыли, убытков и расходов. Нереализованная прибыль и денежные потоки не учитываются.',
  'account.prop-challenge.rule.help.consistency-cushion':
    'Добавляется к максимальной доле лучшего дня в процентных пунктах: 30% + 5 пунктов допускает 35%. Пусто — без запаса.',
  'account.prop-challenge.rule.help.daily-profit-cap':
    'Денежный потолок дневной прибыли, зачтённой в цель фазы. Излишек остаётся в балансе; убытки учитываются полностью.',
  'account.prop-challenge.rule.help.live-review':
    'Реализованная чистая прибыль за один торговый день для допуска к проверке. Не переводит фазу автоматически и не предоставляет реальный счёт.',
  'account.prop-challenge.drawdown.static': 'Фиксированная',
  'account.prop-challenge.drawdown.eod-trailing': 'Скользящая на конец дня',
  'account.prop-challenge.drawdown.intraday-trailing':
    'Внутридневная скользящая',
  'account.prop-challenge.summary.status.active': 'Активен',
  'account.prop-challenge.summary.status.passed': 'Пройден',
  'account.prop-challenge.summary.status.failed': 'Не пройден',
  'account.prop-challenge.summary.status.pending': 'Ожидание',
  'account.prop-challenge.summary.status.warning': 'Близко к лимиту',
  'account.prop-challenge.summary.phase-status.pending': 'Ожидает',
  'account.prop-challenge.summary.phase-status.active': 'Активна',
  'account.prop-challenge.summary.phase-status.passed': 'Пройдена',
  'account.prop-challenge.summary.phase-status.failed': 'Не пройдена',
  'account.prop-challenge.summary.rule.profit_target': 'Цель прибыли',
  'account.prop-challenge.summary.rule.drawdown': 'Просадка',
  'account.prop-challenge.summary.rule.drawdown-static': 'Статическая просадка',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': 'Просадка EOD',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing':
    'Внутридневная просадка',
  'account.prop-challenge.summary.rule.daily_loss_limit': 'Дневной убыток',
  'account.prop-challenge.summary.rule.live_review_daily_profit':
    'Live-проверка',
  'account.prop-challenge.summary.rule.daily_profit_cap':
    'Учитываемая дневная прибыль',
  'account.prop-challenge.summary.rule.minimum_trading_days': 'Торговые дни',
  'account.prop-challenge.summary.rule.minimum_profitable_days':
    'Прибыльные дни',
  'account.prop-challenge.summary.rule.consistency': 'Стабильность лучшего дня',
  'account.prop-challenge.summary.rule.max_position_size': 'Размер позиции',
  'account.prop-challenge.ledger.value.of': '{current} из {target}',
  'account.prop-challenge.ledger.section.payout': 'Требования к выплате',
  'account.prop-challenge.ledger.requirement.minimum': 'мин. {value}',
  'account.prop-challenge.ledger.requirement.maximum': 'макс. {value}',
  'account.prop-challenge.ledger.value.ratio': '{current} / {target}',
  'account.prop-challenge.payout.met-of-total': '{met} из {total} требований',
  'account.prop-challenge.ledger.value.of-today':
    '{current} из {target} сегодня',
  'account.prop-challenge.ledger.value.credited-profit':
    'Учтено {credited} из {actual} фактической прибыли',
  'account.prop-challenge.ledger.value.used': 'использовано {used}',
  'account.prop-challenge.ledger.value.consistency-goal':
    '{current} из {target} цели по стабильности',
  'account.prop-challenge.ledger.value.best-day-share':
    'Лучший день {value} прибыли',
  'account.prop-challenge.ledger.value.no-profit': 'Прибыли пока нет',
  'account.prop-challenge.ledger.requirement.best-day':
    'Лучший день ≤ {value} общей прибыли',
  'account.prop-challenge.ledger.state.needs-profit': 'Нужна прибыль',
  'account.prop-challenge.ledger.tooltip.open': 'Объяснить: {rule}',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    'Ограничивает, какая часть общей прибыли фазы может приходиться на один самый прибыльный торговый день.',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    'Прибыль лучшего дня ÷ общая прибыль фазы × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    'Лучший день: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    'Общая прибыль: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 = {share}',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    'Цель по стабильности: {best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    'Доля снижается по мере прибыли в другие дни, но новый более крупный лучший день поднимает цель.',
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum} — в рамках правила',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    'Расчёт начинается, когда общая прибыль фазы становится положительной.',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    'Для цели по стабильности нужен максимум больше 0%.',
  'account.prop-challenge.ledger.help.open': 'О правиле: {rule}',
  'account.prop-challenge.ledger.help.profit_target':
    'Достигните заданного роста баланса для прохождения фазы. Лимиты зачтённой прибыли и необязательный зачёт выводов влияют на прогресс; нереализованная прибыль не считается.',
  'account.prop-challenge.ledger.help.profit_target.example':
    'Этому счёту нужно {target} прибыли: уже {current}, осталось {remaining}.',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'Цель достигнута: {current} из {target}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    'Насколько баланс может упасть ниже стартового. Пол не двигается.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'Пол этого счёта — {floor}; баланс должен оставаться выше. От лимита {limit} осталось {buffer}.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    'Пол следует за максимальным балансом на конец дня и только растёт, пока не зафиксируется на уровне блокировки фирмы.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'Сейчас пол — {floor} (максимальное закрытие минус {limit}), и он поднимается с каждым более высоким закрытием. Осталось {buffer}.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    'Порог следует за максимальным балансом в любой момент, включая открытую прибыль. Journalit видит только закрытые сделки, поэтому этот порог следует за лучшим балансом после каждого закрытия; пик внутри открытой сделки не учитывается. Сверьтесь с данными фирмы.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    'Сейчас пол — {floor} (лучший баланс после закрытых сделок минус {limit}). Осталось {buffer}; живая цифра фирмы может быть жёстче.',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    'Максимум, который можно потерять за торговый день. Достижение проваливает фазу или ставит торговлю на паузу до следующей сессии — зависит от фирмы.',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    'Сегодня: потеряно {used} из дневного лимита {limit}, осталось {left}.',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    'В цель засчитывается только часть дневной прибыли. Сверх потолка деньги остаются, но не учитываются.',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    'В зачёт идёт только {cap} дневной прибыли; {excluded} сверх потолка пока не считаются.',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'Один торговый день с такой прибылью или выше даёт право на проверку живого счёта.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    'Один день от {trigger} и выше даёт квалификацию; лучший день пока {bestDay}.',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    'Требуемое число разных дней входа в сделки этой фазы, включая ещё открытые позиции. Используется заданная граница торгового дня, не календарная полночь.',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{current} из {target} торговых дней выполнено, осталось {remaining}.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'Требуемые дни с минимальной дневной реализованной чистой прибылью этой фазы. Записанные выводы не сбрасывают это правило всей фазы.',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{current} из {target} дней закрыты на {minimum} или больше, осталось {remaining}.',
  'account.prop-challenge.ledger.help.consistency':
    'Лучший день не может превышать эту долю прибыли фазы. Исправляйте прибылью в другие дни, а не убытками.',
  'account.prop-challenge.ledger.help.consistency.example':
    'Лучший день {bestDay} — это {share} от {total} общей прибыли; общая прибыль должна достичь {goal}, чтобы доля стала {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'Лучший день {bestDay} — это {share} общей прибыли, в пределах лимита {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'Прибыли пока нет, поэтому сравнивать лучший день не с чем.',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'Торговые дни текущего цикла выплат. Счётчик сбрасывается после одобренной выплаты.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '{current} из {target} торговых дней в этом цикле, осталось {remaining}.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'Торговые дни этого цикла, закрытые на минимуме дневной прибыли фирмы или выше.',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '{current} из {target} дней по {minimum} или больше в этом цикле, осталось {remaining}.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'Прибыль с начала цикла должна достичь этой суммы до заявки.',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '{current} заработано в этом цикле из необходимых {target}.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'Баланс должен быть не ниже этого уровня в момент заявки.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    'Баланс {current}; он должен быть не меньше {target}.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    'После первой выплаты каждый новый цикл должен быть в прибыли до следующей заявки.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'Прибыль цикла — {current}; она должна быть выше нуля.',
  'account.prop-challenge.ledger.help.payout.consistency':
    'Лучший день не может превышать эту долю прибыли цикла.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    'Лучший день {bestDay} — это {share} от прибыли цикла {total}; прибыль цикла должна достичь {goal}, чтобы он составил {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'Лучший день {bestDay} — это {share} прибыли цикла, в пределах лимита {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'Прибыли за цикл пока нет, поэтому сравнивать лучший день не с чем.',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    'Минимальная выплата, которую принимает фирма. Доступная сумма должна сначала её достичь.',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    'Доступно {current}; минимальная заявка фирмы — {target}.',
  'account.prop-challenge.ledger.help.payout.payout_count':
    'Сколько выплат допускает эта ступень. Исчерпание лимита завершает ступень.',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '{current} из {target} выплат использованы на этой ступени.',
  'account.prop-challenge.ledger.help.payout.request_window':
    'Заявки принимают только в эти будни по часовому поясу фирмы.',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    'Сегодня {today}; заявки открыты в {days} ({timeZone}).',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'Время с первой сделки цикла должно достичь этого до заявки.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '{current} из {target} часов с первой сделки цикла.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'Квалифицирующие дни всей фондированной фазы, не только этого цикла. Выплаты открываются по достижении.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '{current} из {target} квалифицирующих дней за всю фазу.',
  'account.prop-challenge.ledger.requirement.target': 'цель {value}',
  'account.prop-challenge.ledger.requirement.buffer': 'буфер {value}',
  'account.prop-challenge.ledger.requirement.max': 'не более {value}',
  'account.prop-challenge.ledger.requirement.daily-cap':
    'Учитывается {value} за торговый день',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{days} дней с прибылью от {profit}',
  'account.prop-challenge.ledger.requirement.days': '{value} дн.',
  'account.prop-challenge.ledger.requirement.at-most': '≤ {value}',
  'account.prop-challenge.ledger.state.not-started': 'Не начато',
  'account.prop-challenge.ledger.state.in-progress': 'В процессе',
  'account.prop-challenge.ledger.state.reached': 'Достигнуто',
  'account.prop-challenge.ledger.state.met': 'Выполнено',
  'account.prop-challenge.ledger.state.eligible': 'Допущен',
  'account.prop-challenge.ledger.state.safe': 'Безопасно',
  'account.prop-challenge.ledger.state.clear': 'Чисто',
  'account.prop-challenge.ledger.state.within-rule': 'В пределах правила',
  'account.prop-challenge.ledger.state.near-limit': 'Близко к лимиту',
  'account.prop-challenge.ledger.state.limit-reached': 'Лимит достигнут',
  'account.prop-challenge.ledger.state.cap-applied': 'Лимит применен',
  'account.prop-challenge.ledger.state.within-cap': 'В пределах лимита',
  'account.prop-challenge.ledger.state.breached': 'Нарушено',
  'account-dashboard.prop.metrics.pass-rate': 'Процент прохождения',
  'account-dashboard.prop.metrics.costs': 'Расходы на челленджи',
  'account-dashboard.prop.metrics.net': 'Итого',
  'account-dashboard.mode.selector': 'Режим панели счетов',
  'account-dashboard.mode.account-overview': 'Обзор',
  'account-dashboard.mode.challenges': 'Челленджи',
  'account-dashboard.prop.metrics.active': 'Активные челленджи',
  'account-dashboard.prop.economics.title': 'Экономика',
  'account-dashboard.prop.economics.roi': 'ROI',
  'account-dashboard.prop.economics.roi-no-cost': 'Без затрат',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    'Средняя стоимость попытки',
  'account-dashboard.prop.economics.cost-per-funded-account':
    'Стоимость профинансированного счета',
  'account-dashboard.prop.economics.payout-conversion': 'Конверсия в выплату',
  'account-dashboard.prop.insights.title': 'Аналитика челленджей',
  'account-dashboard.prop.phases.title': 'Аналитика этапов',
  'account-dashboard.prop.phases.phase': 'Этап',
  'account-dashboard.prop.phases.average-duration': 'Средняя длительность',
  'account-dashboard.prop.phases.show-more': 'Показать ещё: {count}',
  'account-dashboard.prop.phases.show-fewer': 'Показать меньше',
  'account-dashboard.prop.tooltip.open-explanation':
    'Пояснить расчёт: {metric}',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    'Пока недостаточно завершённых данных',
  'account-dashboard.prop.tooltip.pass-rate.description':
    'Доля завершённых челленджей, которые были пройдены. Активные и архивные челленджи без результата не учитываются.',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    'Пройденные челленджи ÷ завершённые челленджи × 100',
  'account-dashboard.prop.tooltip.roi.description':
    'Чистая доходность выплат (выплаты минус расходы на челленджи) относительно расходов. Расчёт выполняется только при одной валюте.',
  'account-dashboard.prop.tooltip.roi.formula':
    '(Выплаты − расходы на челленджи) ÷ расходы на челленджи × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    'Эти челленджи ничего не стоили, поэтому делить не на что. Чистая доходность равна выплатам на сумму {payouts}.',
  'account-dashboard.prop.tooltip.average-cost.description':
    'Средняя стоимость одной попытки челленджа, рассчитанная отдельно для каждой валюты.',
  'account-dashboard.prop.tooltip.average-cost.formula':
    'Расходы на челленджи ÷ общее число попыток',
  'account-dashboard.prop.tooltip.funded-cost.description':
    'Средняя стоимость каждого пройденного челленджа, рассчитанная отдельно для каждой валюты.',
  'account-dashboard.prop.tooltip.funded-cost.formula':
    'Расходы на челленджи ÷ пройденные челленджи',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    'Доля пройденных челленджей, по которым была получена хотя бы одна выплата.',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    'Пройденные челленджи с выплатой ÷ пройденные челленджи × 100',
  'account-dashboard.prop.tabs.phases': 'Этапы',
  'account-dashboard.prop.tabs.firms': 'Фирмы',
  'account-dashboard.prop.firms.firm': 'Фирма',
  'account-dashboard.prop.firms.attempts': 'Попытки',
  'account-dashboard.prop.phases.most-failed': 'Чаще всего провален',
  'account-dashboard.prop.phases.days': '{count} дн.',
  'account-dashboard.prop.phases.empty': 'Пока нет завершённых этапов',
  'account.challenge.toggle.label': 'Челлендж проп-фирмы',
  'account.challenge.toggle.help':
    'Отслеживайте этапы оценки, правила фирмы и выплаты по этому счёту.',

  'notice.error.canonical-trade-type-change':
    'Сделки, синхронизированные с брокером, нельзя переводить в другой тип.',
  'trade-sync.import.account.conflict-repair':
    'Обнаружены заметки с дублирующимся canonicalTradeId. Оставьте одну заметку, а в дубликате удалите canonicalTradeId или удалите сам дубликат. Переименование файла не устраняет конфликт.',
  'setups.create.field.tags': 'Теги',
  'setups.create.placeholder.tags': 'Импульс, Пробой, Утро',
  'setups.view.overview.tag-filter.aria': 'Фильтровать сетапы',
  'setups.view.overview.tag-filter.reset': 'Сбросить',
  'setups.view.overview.tag-filter.untagged': 'Без тегов',
  'setups.view.overview.tag-filter.empty':
    'Нет сетапов, соответствующих этим фильтрам',
  'setups.view.overview.tag-filter.empty-submessage':
    'Измените или сбросьте фильтры, чтобы показать больше сетапов.',

  'setups.view.tags': 'Теги',
  'setups.create.error.tag-save-failed':
    'Не удалось сохранить тег в глобальном списке тегов.',
  'settings.customization.options.confirm.remove-tag-message':
    'Удалить глобальный тег «{option}»? Он будет удалён из всех заметок сделок и сетапов Journalit.',
  'settings.customization.options.confirm.reset-tag-message':
    'Сбросить глобальный список тегов и их цвета? Теги, уже назначенные заметкам сделок и сетапов, останутся в этих заметках.',
  'home.mode.overview': 'Обзор',
  'home.mode.dashboard': 'Панель',
  'home.mode.aria': 'Переключить режим главной страницы',
  'home.filters.period': 'Период',
  'home.filters.trade-type': 'Тип сделки',
  'home.filters.accounts': 'Счета',
  'home.filters.back': 'Назад',
  'filter.reset': 'Сбросить фильтры',
  'filter.menu.title': 'Фильтровать по',
  'filter.menu.accounts': 'Счета',
  'filter.menu.tickers': 'Тикеры',
  'filter.menu.setups': 'Сетапы',
  'filter.menu.tags': 'Теги',
  'filter.menu.mistakes': 'Ошибки',
  'filter.menu.trade-type': 'Тип сделки',
  'filter.menu.status': 'Статус',
  'filter.menu.direction': 'Направление',
  'filter.menu.review-status': 'Статус обзора',
  'filter.menu.rating': 'Оценка',
  'filter.menu.rating.unrated': 'Без оценки',
  'filter.menu.status.cancelled': 'Отменена',
  'filter.menu.included-count': 'Включено: {count}',
  'filter.menu.excluded-count': 'Исключено: {count}',
  'filter.menu.search': 'Поиск',
  'filter.menu.no-matches': 'Нет совпадений',
  'filter.menu.no-options': 'Пока нечего фильтровать',
  'filter.menu.clear': 'Очистить',
  'filter.menu.match.label': 'Совпадение',
  'filter.menu.match.any': 'Любое из',
  'filter.menu.match.all': 'Все из',
  'filter.menu.match.only': 'Только эти',
  'filter.menu.match.exact': 'Ровно эти',
  'filter.menu.match.hint.any': 'Сделки хотя бы с одним из выбранных значений.',
  'filter.menu.match.hint.all':
    'Сделки со всеми выбранными значениями. Другие значения допускаются.',
  'filter.menu.match.hint.only':
    'Сделки, все значения которых входят в выбранные.',
  'filter.menu.match.hint.exact':
    'Сделки ровно с выбранными значениями, не больше и не меньше.',
  'filter.menu.match.no-value-any-only': 'Только с «Любое из»',
  'filter.menu.exclude-value': 'Исключить {label}',
  'filter.menu.match.badge.all': 'Все',
  'filter.menu.match.badge.only': 'Только',
  'filter.menu.match.badge.exact': 'Ровно',
  'home.guide.modes.title': 'И ещё кое-что: Панель',
  'home.guide.modes.description':
    'Обзор и Панель используют одну страницу. Переключитесь на Панель сейчас, чтобы продолжить короткий тур по статистике ваших результатов.',
  'home.guide.whats-new.mode.title': 'Одна главная страница, два режима',
  'home.guide.whats-new.mode.description':
    'Обзор и Панель теперь находятся на одной странице. Переключайтесь, не теряя макет и позицию прокрутки.',
  'home.guide.whats-new.filters.title':
    'Фильтры главной страницы в одном месте',
  'home.guide.whats-new.filters.description':
    'Откройте кнопку фильтра, чтобы выбрать Период, Тип сделки или Счета в компактном многоуровневом меню.',
  'home.guide.whats-new.done.title': 'Рабочий контекст сохраняется',
  'home.guide.whats-new.done.description':
    'Используйте Обзор для личных виджетов, а Панель — для углублённого анализа. У каждого режима свои фильтры и макет.',
  'account.prop-challenge.summary.status.payout_ready': 'Готов к выплате',
  'account.prop-challenge.ribbon.passed': '{phase} пройден',
  'account.prop-challenge.ribbon.failed': '{phase} провален',
  'account.prop-challenge.ribbon.action.advance': 'Перейти к этапу «{phase}»',
  'account.prop-challenge.ribbon.action.advance-short': 'Перейти',
  'account.prop-challenge.ribbon.action.mark-passed': 'Отметить пройденным',
  'account.prop-challenge.ribbon.action.archive': 'Архивировать',
  'account.prop-challenge.actions.stale':
    'Этот челлендж был обновлён в другом месте. Проверьте его и попробуйте снова.',
  'account.prop-challenge.ribbon.action.record-payout': 'Записать выплату',
  'account.prop-challenge.ribbon.action.record-payout-short': 'Выплата',
  'account.prop-challenge.payout.title': 'Готовность к выплате',
  'account.prop-challenge.payout.available': 'Доступно сейчас',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'Накопленные квалификационные дни',
  'account.prop-challenge.payout.requirement.days': 'Торговые дни',
  'account.prop-challenge.payout.requirement.qualifying-days': 'Зачётные дни',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'Минимальный баланс счёта',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'Положительная прибыль цикла',
  'account.prop-challenge.payout.requirement.cycle-profit': 'Прибыль цикла',
  'account.prop-challenge.payout.requirement.consistency': 'Консистентность',
  'account.prop-challenge.payout.requirement.minimum': 'Минимум доступно',
  'account.prop-challenge.payout.requirement.payouts': 'Лимит выплат',
  'account.prop-challenge.payout.requirement.request-window': 'Окно запроса',
  'account.prop-challenge.payout.timezone-invalid': 'Неизвестная часовая зона.',
  'account.prop-challenge.payout.preview-amount': 'Предпросмотр выплаты',
  'account.prop-challenge.payout.you-receive': 'Доля трейдера',
  'account.prop-challenge.payout.balance-after': 'Баланс после',
  'account.prop-challenge.payout.drawdown-floor': 'Порог просадки',
  'account.prop-challenge.payout.buffer-after': 'Запас до нарушения',
  'account.prop-challenge.payout.request-not-allowed':
    'Сумма не соответствует условиям',
  'account.prop-challenge.payout.immediate-breach':
    'Эта выплата опустит счёт до нижней границы просадки или ниже.',
  'account.prop-challenge.payout.account-concludes':
    'Эта выплата завершает настроенный цикл выплат для симулированного финансируемого счёта.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'Эта выплата переводит счёт на следующий настроенный этап.',
  'account.prop-challenge.payout.live-review-after-payout':
    'После этой выплаты счёт получает допуск к проверке для реального счёта.',
  'account.prop-challenge.stage': 'Тип этапа',
  'account.prop-challenge.stage.evaluation': 'Оценка',
  'account.prop-challenge.stage.sim-funded': 'Симулированное финансирование',
  'account.prop-challenge.stage.live-funded': 'Реальное финансирование',
  'account.prop-challenge.payout-rules.title': 'Правила выплат',
  'account.prop-challenge.payout-rules.cycle': 'Цикл допуска',
  'account.prop-challenge.payout-rules.request-window': 'Время запроса',
  'account.prop-challenge.payout-rules.request-window.anytime': 'Любой день',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'Определённые дни недели',
  'account.prop-challenge.payout-rules.request-window.time-zone':
    'Часовой пояс',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'Дни, когда разрешён запрос',
  'account.prop-challenge.payout-rules.cycle.none': 'Без цикла ожидания',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'Торговые дни',
  'account.prop-challenge.payout-rules.cycle.qualifying-days': 'Зачётные дни',
  'account.prop-challenge.payout-rules.cycle.calendar-days': 'Календарные дни',
  'account.prop-challenge.payout-rules.days': 'Требуемые дни',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'Минимальная дневная прибыль',
  'account.prop-challenge.payout-rules.anchor': 'Цикл начинается с',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'Начала этапа',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'Первой сделки',
  'account.prop-challenge.payout-rules.minimum-balance':
    'Минимальный баланс счёта',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Минимальная прибыль за цикл',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'Минимальная прибыль цикла по номеру выплаты',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'Требовать положительную прибыль цикла после первой выплаты',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Максимальная доля лучшего дня (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'Максимальная доля лучшего дня по номеру выплаты (%)',
  'account.prop-challenge.payout-rules.availability': 'Доступная прибыль',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Выше начального баланса',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Выше нижней границы баланса',
  'account.prop-challenge.payout-rules.balance-floor': 'Нижняя граница баланса',
  'account.prop-challenge.payout-rules.request-percent': 'Доля к выводу (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'Новая прибыль, требуемая для каждого запроса (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'Ограничивает запрос так, чтобы заданный процент покрывался прибылью текущего цикла выплат. Например, 50% позволяет запросить до двукратной прибыли текущего цикла.',
  'account.prop-challenge.payout-rules.minimum-request': 'Минимальный запрос',
  'account.prop-challenge.payout-rules.maximum': 'Максимальный запрос',
  'account.prop-challenge.payout-rules.maximum.none': 'Без максимума',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Фиксированный максимум',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'Лимит только для первой выплаты',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Максимум по номеру выплаты',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'Процент прибыли цикла',
  'account.prop-challenge.payout-rules.maximum-amount': 'Максимальная сумма',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'Лимит первой выплаты',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'Максимум прибыли цикла (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'Использовать последнюю сумму для следующих выплат',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'Использовать последнее значение для последующих выплат',
  'account.prop-challenge.payout-rules.schedule': 'Суммы по номеру выплаты',
  'account.prop-challenge.payout-rules.profit-split':
    'Доля трейдера в прибыли (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'Изменить лимиты после накопленных квалификационных дней',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    'Считает квалификационные дни за весь финансируемый этап, даже при сбросе циклов выплат.',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'Требуемые накопленные квалификационные дни',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'Доступность после разблокировки',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'Минимальный баланс после разблокировки',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'Доступная прибыль после разблокировки (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'Максимальный запрос после разблокировки',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'Максимальная сумма после разблокировки',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'Максимальный график после разблокировки',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'Максимальный процент прибыли цикла после разблокировки',
  'account.prop-challenge.payout-rules.profit-split-model':
    'Модель распределения прибыли',
  'account.prop-challenge.payout-rules.profit-split.fixed':
    'Фиксированный процент',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    'Изменяется после накопленных выплат',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'Начальная доля трейдера (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'Порог накопленных выплат',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'Доля трейдера после порога (%)',
  'account.prop-challenge.payout-rules.maximum-payouts': 'Максимум выплат',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'После последней выплаты',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'Продолжить счёт',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'Завершить счёт',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'Перейти к следующему этапу',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'Допуск к проверке для реального счёта',
  'account.prop-challenge.payout-rules.aftermath': 'После одобренной выплаты',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'Вычесть выплату; сохранить нижнюю границу просадки',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'Вычесть выплату; зафиксировать нижнюю границу просадки',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'Сбросить счёт и просадку',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'Нижняя граница просадки после выплаты',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'Первая выплата не учитывает минимальную прибыль цикла',
  'account.prop-challenge.payout-rules.reset-cycle':
    'Сбрасывать цикл допуска после выплаты',
  'account.prop-challenge.payout-rules.group.eligibility': 'Допуск к выплате',
  'account.prop-challenge.payout-rules.group.availability': 'Доступная выплата',
  'account.prop-challenge.payout-rules.group.terms': 'Условия выплаты',
  'account.prop-challenge.payout-rules.group.aftermath': 'После выплаты',
  'account.prop-challenge.payout.requirement.elapsed-hours': 'Прошедшее время',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'Зависит от прибыли счёта',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'Прибыль счёта за всё время = текущий баланс − начальный баланс + прежние выводы. Процент «ниже» или «на пороге и выше» применяется ко всему запросу.',
  'account.prop-challenge.payout-rules.profit-split.marginal-help':
    'К части запроса ниже этого порога прибыли счёта применяется нижняя доля, а к части выше порога — верхняя.',
  'account.prop-challenge.payout-rules.profit-split.below':
    'Доля трейдера ниже порога (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'Порог прибыли счёта',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'Доля трейдера на пороге и выше (%)',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Минимум прошедших часов',

  
  'account.merge.challenge.move-earlier': '{account} раньше',
  'account.merge.challenge.move-later': '{account} позже',
  'account.merge.warning.use-profile-balance': 'Использовать баланс фирмы',
  'account.merge.warning.edit-phases': 'Изменить фазы',
  'account.merge.title': 'Настройка челленджа',
  'account.merge.loading': 'Загрузка...',
  'account.merge.step.accounts': 'Счета',
  'account.merge.step.phases': 'Фазы',
  'account.merge.step.review': 'Проверка',
  'account.merge.accounts.title': 'Счета для объединения',
  'account.merge.accounts.show-archived': 'Показать архивные',
  'account.merge.accounts.empty': 'Нет подходящих счетов',
  'account.merge.target.title': 'Целевой счёт',
  'account.merge.target.keep': 'Оставить',
  'account.merge.target.new': 'Новое имя',
  'account.merge.phase.name': 'Название фазы',
  'account.merge.phase.status': 'Статус',
  'account.merge.phase.started': 'Начало',
  'account.merge.phase.completed': 'Завершение',
  'account.merge.phase.no-rules': 'Нет',
  'account.merge.review.notes': 'перенесено сделок',
  'account.merge.review.identities': 'брокерских счетов',
  'account.merge.warning.trade-outside-window': 'Сделки вне окна своей фазы',
  'account.merge.warning.identity-shared':
    'Идентификатор заявлен несколькими счетами',
  'account.merge.warning.copy-trading-dropped':
    'Периоды копи-трейдинга отброшены',
  'account.merge.error.too-few-sources': 'Выберите не менее двух счетов.',
  'account.merge.error.target-needs-balance':
    'Начальный баланс этого счёта равен 0, поэтому цель в процентах нельзя измерить. Задайте цель в сумме или отмените и сначала укажите начальный баланс счёта.',
  'account.merge.error.duplicate-source': 'Счёт указан дважды.',
  'account.merge.error.target-exists': 'Это имя принадлежит другому счёту.',
  'account.merge.error.currency-mismatch': 'У счетов разные валюты.',
  'account.merge.error.timeline-not-monotonic': 'Начала фаз должны возрастать.',
  'account.merge.error.invalid-override': 'Проверьте даты этой фазы.',
  'account.merge.error.source-missing': 'У счёта нет сохранённых настроек.',
  'account.merge.error.unknown': 'Не удалось объединить.',
  'account.merge.action.merge': 'Объединить',
  'account.merge.action.undo': 'Отменить',
  'account.merge.action.looks-right': 'Всё верно',
  'account.merge.action.delete': 'Удалить старые счета',
  'account.merge.notice.converted': 'Преобразован в челлендж',
  'account.merge.summary.intro':
    'Проверьте, что это соответствует вашему челленджу:',
  'account.merge.summary.phases': 'Фазы: {phases}',
  'account.merge.summary.current': 'Сейчас {phase} ({stage}), начата {date}',
  'account.merge.summary.current-stage': 'Сейчас {phase}, начата {date}',
  'account.merge.summary.trades':
    '{counted} из {total} сделок учитываются в челлендже',
  'account.merge.summary.trades-missing':
    '{counted} из {total} сделок учитываются в челлендже. Остальные вне дат всех фаз.',
  'account.merge.summary.rules': 'Правила {phase}: {rules}',
  'account.merge.summary.no-rules':
    'Для {phase} ещё нет правил. Добавьте правила фирмы в «Редактировать счёт».',
  'account.merge.notice.title': 'Объединено из {accounts}',
  'account.merge.notice.error': 'Не удалось выполнить действие.',
  'account.merge.undo.title': 'Отменить объединение',
  'account.merge.undo.message': 'Восстанавливает старые счета и их сделки.',
  'account.merge.delete.title': 'Удалить старые счета',
  'account.merge.delete.message':
    'Удаляет архивные старые счета. Отменить будет нельзя.',
  'command.open-legacy-challenge-onboarding': 'Настроить проп-челленджи',
  'account.merge.step.challenge': 'Челлендж',
  'account.merge.action.convert': 'Преобразовать',
  'account.merge.profile.applied': 'Применено: {firm} · {challenge}',
  'account.merge.profile.remove': 'Убрать',
  'account.merge.phase.apply-profile': 'Применить правила фирмы',
  'account.merge.profile.replace-rules.title':
    'Заменить правила, введённые вручную?',
  'account.merge.profile.replace-rules.body':
    'Профиль {firm} задаёт правила каждой фазы. Правила, введённые на этой странице, будут заменены.',
  'account.merge.profile.replace-rules.confirm': 'Заменить правила',
  'guide.legacy-setup.list.title': 'Здесь перечислены все счета без челленджа',
  'guide.legacy-setup.list.description':
    'Решайте по каждому счёту. «Оставить как есть» сохраняет его без изменений; настроить его можно позже в настройках дашборда.',
  'guide.legacy-setup.assign.title': 'Объедините фазы одного челленджа',
  'guide.legacy-setup.assign.description':
    'Счета, бывшие фазами одного челленджа, попадают в одну группу (мы предлагаем группы по похожим названиям). Отдельный счёт становится челленджем с одной фазой.',
  'guide.legacy-setup.continue.title':
    'Короткая настройка для каждого челленджа',
  'guide.legacy-setup.continue.description':
    '«Продолжить» по очереди открывает настройку каждой группы. Ничего не изменится, пока вы не подтвердите каждую.',
  'guide.merge-wizard.target.title': 'Один счёт сохраняет историю',
  'guide.merge-wizard.target.description':
    'Целевой счёт остаётся со всеми фазами. Остальные архивируются, а не удаляются, и их сделки переносятся на целевой счёт.',
  'guide.merge-wizard.identity.title': 'Выберите правила вашей фирмы',
  'guide.merge-wizard.identity.description':
    'Выберите фирму и план, чтобы заполнить фазы и правила. Вашей фирмы нет? Выберите «Другая / своя фирма» и задайте правила на следующей странице.',
  'guide.merge-wizard.identity.free-title': 'Назовите челлендж',
  'guide.merge-wizard.identity.free-description':
    'Дайте ему название и, если хотите, название фирмы. Сохранённые правила прошлого челленджа заполнят фазы и правила; иначе задайте их на следующей странице.',
  'guide.merge-wizard.phases.title': 'Проверьте каждую фазу',
  'guide.merge-wizard.phases.description':
    'Задайте тип этапа, отметьте пройденные фазы как «Пройдено», текущую — как «Активна», и подтвердите даты.',
  'guide.merge-wizard.review.title': 'Ничего не произойдёт без подтверждения',
  'guide.merge-wizard.review.description':
    'После преобразования страница счёта покажет, что было настроено, чтобы вы могли проверить, и там же можно отменить.',
  'account.merge.challenge.accounts': 'Счета',
  'account.merge.challenge.order-hint': 'Сначала самая ранняя фаза',
  'account.merge.challenge.single-hint':
    'Этот счёт станет отдельным челленджем',
  'account.merge.phase.broker-accounts.one': '{count} брокерский счёт',
  'account.merge.phase.broker-accounts.few': '{count} брокерских счёта',
  'account.merge.phase.broker-accounts.many': '{count} брокерских счетов',
  'account.merge.phase.broker-accounts.other': '{count} брокерского счёта',
  'account.merge.review.phase-count.one': 'фаза',
  'account.merge.review.phase-count.few': 'фазы',
  'account.merge.review.phase-count.many': 'фаз',
  'account.merge.review.phase-count.other': 'фазы',
  'account.merge.phase.pending': 'Ожидает',
  'account.merge.phase.starts-after': 'Начнётся после прохождения {phase}',
  'account.merge.phase.pending-rules': 'Правила: {rules}',
  'account.merge.review.archived': 'в архиве',
  'account.merge.review.starts-after': 'После {phase}',
  'account.merge.review.since': 'С {date}',
  'account.merge.sequence': 'Челлендж {index} из {total}',
  'account.merge.warning.balance-differs':
    'Начальный баланс отличается от правил фирмы',
  'account.merge.error.profile-phase-mismatch':
    'Счетов больше, чем фаз в правилах фирмы',
  'account.merge.error.profile-currency-mismatch':
    'Правила фирмы используют валюту, отличную от валюты этих счетов.',
  'account.merge.error.source-changed':
    'Счёт изменился. Проверьте слияние ещё раз.',
  'account.merge.error.multiple-active-phases':
    'Активным может оставаться только последний счёт.',
  'account.merge.error.phases-after-failed-source':
    'Проваленный аккаунт завершает челлендж, поэтому он должен быть выбран последним.',
  'account.merge.error.copy-trading-overlap':
    'Периоды копитрейдинга пересекаются. Сначала закройте один.',
  'onboarding.legacy-challenge.legend':
    'Выберите, что будет с каждым прежним счётом. У вас был отдельный счёт на каждую фазу, например Фаза 1 и Фондированный? Поместите их в один челлендж, чтобы они стали одним счётом с фазами.',
  'onboarding.legacy-challenge.assign.leave': 'Оставить обычным счётом',
  'onboarding.legacy-challenge.assign.own': 'Сделать челленджем',
  'onboarding.legacy-challenge.assign.group': 'Добавить в челлендж {letter}',
  'onboarding.legacy-challenge.assign.new-group':
    'Объединить в новый челлендж…',
  'onboarding.legacy-challenge.action.continue': 'Продолжить',
  'onboarding.legacy-challenge.action.continue-count': 'Настроить: {count}',
  'guide.action-step.dismiss': 'Не сейчас',
  'guide.legacy-challenge.title':
    'Настройте счета, созданные до этого обновления',
  'guide.legacy-challenge.description':
    'Превратите старые оценочные или фондированные счета в челленджи. Настройка проведёт через фазы и даты, а в конце покажет, что было настроено, чтобы вы могли проверить.',
  'guide.legacy-challenge.action': 'Настроить счета',
  'account-dashboard.challenges.empty.title': 'Челленджей пока нет',
  'account-dashboard.challenges.empty.message':
    'Отслеживайте челлендж проп-фирмы как один счёт с фазами, правилами и выплатами.',
  'account-dashboard.challenges.empty.create': 'Новый челлендж',
  'account-dashboard.challenges.empty.setup': 'Настроить существующие счета',
  'onboarding.legacy-challenge.title': 'Проп-челленджи',
  'onboarding.legacy-challenge.action.skip': 'Пропустить',
  'onboarding.legacy-challenge.accounts.show-archived': 'Показать архивные',
  'onboarding.legacy-challenge.accounts.empty': 'Нет счетов для настройки',
  'onboarding.legacy-challenge.loading': 'Загрузка...',
  'onboarding.legacy-challenge.suggested': 'Рекомендация',
  'onboarding.legacy-challenge.row.aria': 'Действие для {account}',
  'onboarding.legacy-challenge.status.combined': 'Объединены',
  'onboarding.legacy-challenge.status.converted': 'Преобразован',
  'onboarding.legacy-challenge.entry.name': 'Проп-челленджи',
  'onboarding.legacy-challenge.entry.desc':
    'Объедините или преобразуйте существующие счета в челленджи.',
  'onboarding.legacy-challenge.entry.action': 'Настроить',

  'dashboard.conversion.requires-conversion':
    'Для графиков P&L с несколькими валютами требуется конвертация по обменному курсу.',

  'home.widget.streak.kind.trade-outcome': 'Результаты сделок',
  'home.widget.streak.kind.trade-review': 'Разборы сделок',
  'home.widget.streak.kind.drc-review': 'Разборы DRC',
  'home.widget.streak.kind.weekly-review': 'Недельные разборы',
  'home.widget.streak.kind.monthly-review': 'Месячные разборы',
  'home.widget.streak.configure': 'Выберите тип серии',
  'home.widget.streak.configure-aria': 'Настроить серию: {kind}',
  'home.widget.streak.no-review-streak': 'нет активной серии разборов',
  'home.widget.streak.start-reviewing': 'начните разборы, чтобы создать серию',
  'home.widget.streak.keep-reviewing':
    'продолжайте разборы, чтобы сохранить серию',
  'home.widget.streak.reviewed-trades-in-a-row.one': 'сделка разобрана подряд',
  'home.widget.streak.reviewed-trades-in-a-row.few': 'сделки разобраны подряд',
  'home.widget.streak.reviewed-trades-in-a-row.many': 'сделок разобрано подряд',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'сделки разобраны подряд',
  'home.widget.streak.reviewed-days-in-a-row.one': 'день разобран подряд',
  'home.widget.streak.reviewed-days-in-a-row.few': 'дня разобраны подряд',
  'home.widget.streak.reviewed-days-in-a-row.many': 'дней разобрано подряд',
  'home.widget.streak.reviewed-days-in-a-row.other': 'дни разобраны подряд',
  'home.widget.streak.reviewed-weeks-in-a-row.one': 'неделя разобрана подряд',
  'home.widget.streak.reviewed-weeks-in-a-row.few': 'недели разобраны подряд',
  'home.widget.streak.reviewed-weeks-in-a-row.many': 'недель разобрано подряд',
  'home.widget.streak.reviewed-weeks-in-a-row.other': 'недели разобраны подряд',
  'home.widget.streak.reviewed-months-in-a-row.one': 'месяц разобран подряд',
  'home.widget.streak.reviewed-months-in-a-row.few': 'месяца разобраны подряд',
  'home.widget.streak.reviewed-months-in-a-row.many':
    'месяцев разобрано подряд',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'месяцы разобраны подряд',
  'home.widget.streak.missed-trades.one':
    'пропущена {count} сделка с последнего разбора',
  'home.widget.streak.missed-trades.few':
    'пропущено {count} сделки с последнего разбора',
  'home.widget.streak.missed-trades.many':
    'пропущено {count} сделок с последнего разбора',
  'home.widget.streak.missed-trades.other':
    'пропущено {count} сделок с последнего разбора',
  'home.widget.streak.missed-days.one':
    'пропущен {count} день с последнего разбора',
  'home.widget.streak.missed-days.few':
    'пропущено {count} дня с последнего разбора',
  'home.widget.streak.missed-days.many':
    'пропущено {count} дней с последнего разбора',
  'home.widget.streak.missed-days.other':
    'пропущено {count} дней с последнего разбора',
  'home.widget.streak.missed-weeks.one':
    'пропущена {count} неделя с последнего разбора',
  'home.widget.streak.missed-weeks.few':
    'пропущено {count} недели с последнего разбора',
  'home.widget.streak.missed-weeks.many':
    'пропущено {count} недель с последнего разбора',
  'home.widget.streak.missed-weeks.other':
    'пропущено {count} недель с последнего разбора',
  'home.widget.streak.missed-months.one':
    'пропущен {count} месяц с последнего разбора',
  'home.widget.streak.missed-months.few':
    'пропущено {count} месяца с последнего разбора',
  'home.widget.streak.missed-months.many':
    'пропущено {count} месяцев с последнего разбора',
  'home.widget.streak.missed-months.other':
    'пропущено {count} месяцев с последнего разбора',
  'trade-sync.quick.started': 'Синхронизация включённых источников сделок…',
  'trade-sync.quick.running': 'Синхронизация…',
  'trade-sync.quick.offline':
    'Для синхронизации сделок требуется подключение к интернету. Повторите попытку, когда будете в сети.',
  'trade-sync.quick.no-sources':
    'Включённые источники синхронизации не найдены. Настройте Trade Sync в настройках.',
  'trade-sync.quick.complete':
    'Синхронизация завершена: синхронизировано источников — {sources}, импортировано или обновлено сделок — {imported}.',
  'trade-sync.quick.partial':
    'Синхронизация завершена с проблемами: выполнено {completed} из {total} источников, импортировано или обновлено сделок — {imported}.',
  'trade-sync.quick.failed':
    'Не удалось завершить синхронизацию для {sources} источников. Проверьте настройки Trade Sync и повторите попытку.',
  'navigation.items.nav-sync-trades': 'Синхронизировать сделки',
  'command.sync-trades-now': 'Синхронизировать сделки',
  'home.quick-links.sync-trades': 'Синхронизировать сделки',
  'trade-sync.quick.not-ready':
    'Сейчас ни один включённый источник синхронизации не готов. Дождитесь завершения активной синхронизации или проверьте настройки Trade Sync.',
  'trade-sync.quick.mapping-required':
    'Импортировано или обновлено сделок: {imported}. Завершите сопоставление счетов для {providers} в разделе «Настройки → Trade Sync» и повторите попытку.',
  'trade-handoff.action.view-trades-count.one': 'Просмотреть {count} сделку',
  'trade-handoff.action.view-trades-count.few': 'Просмотреть {count} сделки',
  'trade-handoff.action.view-trades-count.many': 'Просмотреть {count} сделок',
  'trade-handoff.action.view-trades-count.other': 'Просмотреть {count} сделки',
  'trade-handoff.action.review-now': 'Проверить сейчас',
  'trade-handoff.action.open-period': 'Открыть обзор за {period}',
  'trade-handoff.review.creation-disabled':
    'Этот обзор не существует, а автоматическое создание обзоров отключено.',
  'trade-handoff.review.open-failed': 'Не удалось открыть этот обзор.',
  'trade-handoff.trades.open-failed': 'Не удалось открыть журнал сделок.',
  'trade-handoff.scope.label':
    'Показаны {trades} из последней операции для {accounts}',
  'trade-handoff.scope.exit': 'Выйти из режима операции',
  'trade-handoff.trade-count.one': '{count} сделка',
  'trade-handoff.trade-count.few': '{count} сделки',
  'trade-handoff.trade-count.many': '{count} сделок',
  'trade-handoff.trade-count.other': '{count} сделки',
  'trade-handoff.title.sync': 'Синхронизация завершена',
  'trade-handoff.summary.import-complete': '{trades} импортировано',
  'trade-handoff.summary.update-complete': '{trades} обновлено',
  'trade-handoff.summary.update-partial': '{trades} обновлено с проблемами',
  'trade-handoff.summary.mixed-complete':
    '{imported} импортировано · {updated} обновлено',
  'trade-handoff.summary.mixed-partial':
    '{imported} импортировано · {updated} обновлено, с проблемами',
  'trade-handoff.summary.import-partial': '{trades} импортировано с проблемами',
  'trade-handoff.summary.import-provider-partial':
    '{trades} импортировано · синхронизация завершена частично',
  'trade-handoff.summary.update-provider-partial':
    '{trades} обновлено · синхронизация завершена частично',
  'trade-handoff.summary.mixed-provider-partial':
    '{imported} импортировано · {updated} обновлено · синхронизация завершена частично',
  'trade-handoff.periods.choose': 'Выбрать другой период обзора',
  'trade-handoff.periods.recommended': 'Рекомендуется',
  'trade-handoff.action.dismiss': 'Скрыть результат последней операции',
  'sample.action.try': 'Попробовать пример журнала',
  'sample.action.reset': 'Сбросить пример',
  'sample.popout.title': 'Пример журнала',
  'sample.popout.action.exit': 'Выйти',
  'sample.popout.description':
    'Изменения здесь предназначены только для практики.',
  'sample.popout.closed': 'Учебный журнал сохранён и закрыт.',
  'sample.popout.recovery': 'Учебный журнал требует восстановления.',
  'sample.notice.sync-blocked':
    'Вы редактируете вымышленные демонстрационные данные. Синхронизация с сервером приостановлена.',
  'sample.notice.folder-locked':
    'Папку журнала нельзя изменить, пока активен демонстрационный журнал.',
  'sample.empty.description':
    'Изучите заполненный вымышленный журнал, не изменяя файлы и настройки своего журнала.',
  'sample.progress.creating':
    'Создание примера журнала: {completed} из {total} элементов',
  'sample.progress.removing':
    'Удаление примера журнала: {completed} из {total}',
  'sample.progress.verifying':
    'Проверка образца журнала: {completed} из {total} элементов',
  'sample.exit.title': 'Выйти из примера журнала?',
  'sample.exit.remove-warning':
    'При удалении будут стерты изменения в файлах с подтвержденной принадлежностью к примеру. Файлы без подтвержденной принадлежности будут сохранены.',
  'sample.exit.remove': 'Выйти и удалить',
  'sample.reset.title': 'Сбросить пример журнала?',
  'sample.reset.message':
    'Все файлы примера и относящиеся только к нему настройки будут восстановлены из исходного вымышленного набора.',
  'sample.reset.warning': 'Ваши изменения в примере журнала будут удалены.',
  'sample.collision.title': 'Папка примера уже существует',
  'sample.collision.message':
    'Journalit не перезапишет существующую папку. Создать пример журнала в «{path}»?',
  'sample.collision.confirm': 'Использовать доступную папку',
  'sample.notice.ready': 'Пример журнала готов.',
  'sample.notice.reset': 'Пример журнала восстановлен.',
  'sample.notice.reset-preserved':
    'Пример журнала восстановлен. Сохранено файлов без подтверждённого владения: {count}.',
  'sample.notice.removed': 'Пример журнала удалён.',
  'sample.notice.removed-preserved':
    'Пример журнала удалён. Сохранено файлов без подтверждённого владения: {count}.',
  'sample.notice.error': 'Ошибка операции с примером журнала: {error}',
  'command.open-sample-journal': 'Открыть пример журнала',
  'command.exit-sample-journal': 'Выйти из примера журнала',
  'command.reset-sample-journal': 'Сбросить пример журнала',
  'sample.notice.busy': 'Другая операция с примером журнала уже выполняется.',
  
  
  'account.prop-challenge.field.help-label': 'Справка: {field}',
  'account.prop-challenge.payout-rules.help.cycle':
    'Ожидание измеряется днями входа, днями с минимальной чистой прибылью или прошедшими календарными днями. Без цикла отключает только это требование по дням.',
  'account.prop-challenge.payout-rules.help.days':
    'Дни выбранного цикла: дни входа, достаточной реализованной чистой прибыли или полные периоды по 24 часа.',
  'account.prop-challenge.payout-rules.help.daily-profit':
    'Минимальная реализованная чистая прибыль за день после издержек. Сделки группируются по границе торгового дня. Порог должен быть больше нуля.',
  'account.prop-challenge.payout-rules.help.qualifying-days':
    'Добавляет прибыльные дни к циклу ожидания. Оба требования должны выполняться в текущем цикле выплат.',
  'account.prop-challenge.payout-rules.help.profitable-days':
    'Число отдельных дней, достигших минимальной реализованной чистой прибыли в текущем цикле выплат.',
  'account.prop-challenge.payout-rules.help.anchor':
    'Календарное ожидание начинается с начала цикла или первого входа. При включённом сбросе зарегистрированное снятие начинает следующий цикл.',
  'account.prop-challenge.payout-rules.help.elapsed-hours':
    'Часы с первого входа в текущем цикле. Без сделки отсчёт не начинается. Пустое поле отключает требование.',
  'account.prop-challenge.payout-rules.help.request-window':
    'Разрешает запросы ежедневно или в выбранные дни по указанному часовому поясу. Остальные требования сохраняются.',
  'account.prop-challenge.payout-rules.help.time-zone':
    'Часовой пояс разрешённых дней, например America/New_York. Не меняет границу торгового дня.',
  'account.prop-challenge.payout-rules.help.request-days':
    'Разрешённые дни недели в выбранном часовом поясе. Выберите хотя бы один.',
  'account.prop-challenge.payout-rules.help.minimum-balance':
    'Баланс, необходимый до выплаты; не порог расчёта доступной прибыли. Пустое поле отключает требование.',
  'account.prop-challenge.payout-rules.help.cycle-profit':
    'Необходимая реализованная чистая торговая прибыль цикла. Депозиты и корректировки баланса не учитываются. Пустое поле отключает требование.',
  'account.prop-challenge.payout-rules.help.profit-schedule':
    'Минимумы прибыли через запятую для выплат 1, 2 и далее. Заменяют единый минимум прибыли цикла.',
  'account.prop-challenge.payout-rules.help.repeat-final':
    'Повторяет последнее значение для номеров выплат за пределами списка.',
  'account.prop-challenge.payout-rules.help.positive-cycle':
    'После первой зарегистрированной выплаты требует реализованную чистую прибыль цикла строго больше нуля.',
  'account.prop-challenge.payout-rules.help.consistency':
    'Лучшая дневная прибыль, делённая на реализованную чистую прибыль цикла. Убытки уменьшают итог и могут увеличить процент. Пустое поле отключает лимит.',
  'account.prop-challenge.payout-rules.help.consistency-schedule':
    'Процентные ограничения лучшего дня через запятую для каждого номера выплаты. Заменяют единый лимит стабильности.',
  'account.prop-challenge.payout-rules.help.availability':
    'Прибыль, доступная к запросу сверх начального баланса фазы или выбранного порога. Проценты и другие лимиты действуют дальше.',
  'account.prop-challenge.payout-rules.help.balance-floor':
    'Баланс, исключённый из доступной прибыли. Выводимая доля применяется лишь к превышению; правило просадки не меняется.',
  'account.prop-challenge.payout-rules.help.request-percent':
    'Запрашиваемый процент баланса сверх выбранного порога. Лимиты запроса и новой прибыли могут его уменьшить.',
  'account.prop-challenge.payout-rules.help.minimum-request':
    'Минимальный разрешённый запрос выплаты. Рассчитанная доступная сумма тоже должна достигать минимума.',
  'account.prop-challenge.payout-rules.help.maximum':
    'Фиксированный лимит, только первая выплата, по номеру выплаты или процент прибыли цикла. Без максимума снимает только этот лимит.',
  'account.prop-challenge.payout-rules.help.maximum-amount':
    'Максимальный запрос до распределения прибыли. Доступная прибыль и другие лимиты могут уменьшить сумму.',
  'account.prop-challenge.payout-rules.help.first-maximum':
    'Лимит до распределения только для первой выплаты этой фазы. Затем он исчезает, остальные ограничения остаются.',
  'account.prop-challenge.payout-rules.help.maximum-schedule':
    'Лимиты до распределения через запятую по номеру выплаты. Без повторения последнего значения неуказанные последующие выплаты имеют нулевой лимит.',
  'account.prop-challenge.payout-rules.help.maximum-percent':
    'Ограничивает запрос до распределения процентом реализованной чистой прибыли цикла. Отдельно от выводимой доли баланса.',
  'account.prop-challenge.payout-rules.help.lifetime-days':
    'Подходящие дни всей финансируемой фазы для новых правил доступности и лимитов. Сбросы циклов не стирают счётчик.',
  'account.prop-challenge.payout-rules.help.split-model':
    'Постоянная доля или ставки по накопленным выплатам до распределения либо общей прибыли счёта. Определяет получаемую сумму, не лимит запроса.',
  'account.prop-challenge.payout-rules.help.trader-share':
    'Процент запроса до распределения, выплачиваемый трейдеру по этой ставке. Остальное получает фирма.',
  'account.prop-challenge.payout-rules.help.cumulative-threshold':
    'Выплаты до распределения в этой фазе, с которых действует следующая ставка. Запрос через порог использует обе ставки для соответствующих частей.',
  'account.prop-challenge.payout-rules.help.maximum-payouts':
    'Разрешённое число зарегистрированных выплат в фазе. После достижения дальнейшие выплаты блокируются. Пустое поле снимает лимит.',
  'account.prop-challenge.payout-rules.help.maximum-outcome':
    'После последней выплаты: продолжить, завершить счёт, перейти в следующую фазу или получить право на live-проверку. Это не автоматическое одобрение.',
  'account.prop-challenge.payout-rules.help.aftermath':
    'Баланс и просадка после выплаты: вычесть запрос, вычесть и закрепить порог либо восстановить начальный баланс и просадку.',
  'account.prop-challenge.payout-rules.help.drawdown-floor':
    'Порог просадки, закрепляемый после выплаты при соответствующем выборе. Оставшийся баланс должен быть выше него.',
  'account.prop-challenge.payout-rules.help.first-exempt':
    'Для первой выплаты фазы минимальная прибыль цикла считается нулевой: реализованная чистая прибыль цикла не должна быть отрицательной. Остальные требования сохраняются.',
  'account.prop-challenge.payout-rules.help.reset-cycle':
    'Сбрасывает дни, дневную прибыль, прибыль цикла и стабильность после зарегистрированной выплаты. Сохраняет подходящие дни всей фазы; предварительные расчёты ничего не сбрасывают.',
  
  
  
  'actions.value.cleared': 'очищено',
  'actions.trade.set.account_id': 'Счёт: {value}',
  'actions.trade.set.setup_id': 'Сетап: {value}',
  'actions.trade.set.stop_loss': 'Стоп-лосс: {value}',
  'actions.trade.thesis.set': 'Обновить тезис',
  'actions.trade.thesis.clear': 'Удалить тезис',
  'actions.trade.reviewed.mark': 'Отметить как проверенную',
  'actions.trade.reviewed.unmark': 'Отметить как непроверенную',
  'actions.trade.notes.set': 'Заменить заметки',
  'actions.trade.stop-losses': 'Стоп-лоссы: {value}',
  'actions.trade.stop-losses.clear': 'Удалить стоп-лоссы',
  'actions.trade.take-profits': 'Тейк-профиты: {value}',
  'actions.trade.take-profits.clear': 'Удалить тейк-профиты',
  'actions.trade.set.take_profit': 'Тейк-профит: {value}',
  'actions.trade.set.risk_amount': 'Сумма риска: {value}',
  'actions.trade.add-tags': 'Добавить теги: {labels}',
  'actions.trade.remove-tags': 'Удалить теги: {labels}',
  'actions.trade.add-mistakes': 'Добавить ошибки: {labels}',
  'actions.trade.remove-mistakes': 'Удалить ошибки: {labels}',
  'actions.review.summary': 'Заменить сводку',
  'actions.review.target.day': 'Дневной обзор {date}',
  'actions.review.target.week': 'Недельный обзор {date}',
  'actions.review.target.month': 'Месячный обзор {date}',
  'actions.review.target.quarter': 'Квартальный обзор {date}',
  'actions.review.target.year': 'Годовой обзор {date}',
  'agent-requests.deny': 'Отклонить',
  'agent-requests.approve': 'Одобрить',
  'actions.options.catalog.tags': 'Теги',
  'actions.options.catalog.mistakes': 'Ошибки',
  'actions.options.catalog.account_types': 'Типы счетов',
  'actions.options.catalog.events': 'События',
  'actions.options.create': 'Создать: {labels}',
  'actions.options.set-color': 'Задать цвет: {value}',
  'actions.options.clear-color': 'Убрать цвет: {value}',
  'actions.options.update-style': 'Обновить стиль: {value}',
  'actions.options.rename.one':
    'Переименовать {source} в {target} в заметках: {count}',
  'actions.options.rename.other':
    'Переименовать {source} в {target} в заметках: {count}',
  'actions.options.rename-account-type.one':
    'Переименовать {source} в {target} для счетов: {count}',
  'actions.options.rename-account-type.other':
    'Переименовать {source} в {target} для счетов: {count}',
  'actions.options.merge.one':
    'Объединить {source} с {target} в заметках: {count}',
  'actions.options.merge.other':
    'Объединить {source} с {target} в заметках: {count}',
  'actions.options.delete.one': 'Удалить {value} из заметок: {count}',
  'actions.options.delete.other': 'Удалить {value} из заметок: {count}',
  'actions.options.delete-entry': 'Удалить {value}',
  'actions.options.move': 'Переместить {value} перед {before}',
  'actions.options.move-last': 'Переместить {value} в конец',
  'actions.configuration.target.settings': 'Настройки',
  'actions.configuration.target.dashboard_layouts': 'Макеты панели',
  'actions.configuration.target.home_layouts': 'Макеты главной',
  'actions.configuration.target.review_templates': 'Шаблоны обзоров',
  'actions.configuration.target.session_workflows': 'Сценарии сессии',
  'actions.configuration.settings': 'Изменить настройки: {count}',
  'actions.configuration.create': 'Создать {name}',
  'actions.configuration.duplicate': 'Создать копию {name}',
  'actions.configuration.replace': 'Заменить {name}',
  'actions.configuration.rename': 'Переименовать в {name}',
  'actions.configuration.delete': 'Удалить {name}',
  'actions.configuration.delete-question.one':
    'Удалить «{name}» и его размещения ({count}) {workflows}',
  'actions.configuration.delete-question.other':
    'Удалить «{name}» и его размещения ({count}) {workflows}',
  'actions.configuration.delete-question-workflows.one':
    'в сценариях ({count})',
  'actions.configuration.delete-question-workflows.other':
    'в сценариях ({count})',
  'actions.configuration.delete-question-unused':
    'Удалить «{name}» (не используется ни в одном сценарии)',
  'actions.configuration.set-active': 'Сделать {name} активным макетом',
  'actions.configuration.set-default': 'Изменить шаблон {type} по умолчанию',
  'actions.configuration.reset-default':
    'По умолчанию использовать встроенный шаблон {type}',
  'actions.setup.target': 'Сетап {name}',
  'actions.setup.update': 'Обновить: {fields}',
  'actions.setup.field.status': 'статус',
  'actions.setup.field.direction': 'направление',
  'actions.setup.field.color': 'цвет',
  'actions.setup.field.tags': 'теги',
  'actions.setup.field.preferred_sessions': 'предпочтительные сессии',
  'actions.setup.field.preferred_timeframes': 'предпочтительные таймфреймы',
  'actions.setup.field.preferred_tickers': 'предпочтительные тикеры',
  'actions.setup.field.playbook': 'плейбук',
  'actions.setup.field.rules': 'правила',
  'actions.setup.field.linked_notes': 'связанные заметки',
  'actions.trade.set.direction': 'Направление: {value}',
  'actions.trade.set.direct_pnl': 'Прямой P&L: {value}',
  'actions.trade.set.commission': 'Комиссия: {value}',
  'actions.trade.set.fees': 'Сборы: {value}',
  'actions.trade.set.swap': 'Своп: {value}',
  'actions.trade.executions': 'Заменить исполнения: {entries}, {exits}',
  'actions.trade.set.missed_reason': 'Причина пропуска: {value}',
  'actions.trade.create':
    'Создать {type}: {direction} {instrument}, {entries}, {exits}',
  'actions.trade.create.new-instrument': 'Добавить {instrument} в инструменты',
  'actions.trade.set-type': 'Изменить тип: {source} на {target}',
  'actions.trade.delete': 'Переместить заметку о сделке в корзину',
  'actions.trade.custom-fields': 'Пользовательские поля: {labels}',
  'actions.custom-field.create': 'Создать поле {label} ({type})',
  'actions.custom-field.field.label': 'название',
  'actions.custom-field.field.options': 'варианты',
  'actions.custom-field.field.validation': 'проверка',
  'actions.custom-field.field.placeholder': 'подсказка в поле',
  'actions.custom-field.field.helper_text': 'пояснение',
  'actions.custom-field.field.allow_create_options': 'новые варианты из сделок',
  'actions.custom-field.order-target': 'Пользовательские поля',
  'actions.custom-field.reorder': 'Новый порядок: {labels}',
  'actions.session-log-tag.create': 'Создать тег {short} {label}',
  'actions.session-log-tag.field.label': 'название',
  'actions.session-log-tag.field.short_label': 'короткая метка',
  'actions.session-log-tag.field.color': 'цвет',
  'actions.session-log-tag.field.requires_resolution': 'требует классификации',
  'actions.session-log-tag.field.lesson': 'тег урока',
  'actions.session-log-tag.delete-alert-rule':
    'Правило оповещений журнала сессии учитывает этот тег',
  'actions.custom-field.delete.one':
    'Удалить поле; сделок, сохраняющих значение: {count}',
  'actions.custom-field.delete.other':
    'Удалить поле; сделок, сохраняющих значение: {count}',
  'actions.session-log-tag.delete.one':
    'Убрать тег из редактора; дней в журналах сессий, где он останется: {count}',
  'actions.session-log-tag.delete.other':
    'Убрать тег из редактора; дней в журналах сессий, где он останется: {count}',
  'actions.review.answers.one': 'Ответить на вопросы: {count}',
  'actions.review.answers.other': 'Ответить на вопросы: {count}',
  'actions.review.goals.one': 'Задать цели: {count}',
  'actions.review.goals.other': 'Задать цели: {count}',
  'actions.review.checklist.one': 'Задать пункты чек-листа: {count}',
  'actions.review.checklist.other': 'Задать пункты чек-листа: {count}',
  'actions.review.key-levels':
    'Задать ключевые уровни: поддержка {support}, сопротивление {resistance}',
  'actions.review.grade.mental': 'Оценка психологии: {value}',
  'actions.review.grade.technical': 'Техническая оценка: {value}',
  'actions.review.reviewed': 'Отметить как проверенный',
  'actions.review.not-reviewed': 'Отметить как непроверенный',
  'actions.review.session-log.add.one':
    'Добавить записи в журнал сессии: {count}',
  'actions.review.session-log.add.other':
    'Добавить записи в журнал сессии: {count}',
  'actions.review.session-log.update':
    'Изменить запись журнала сессии: {fields}',
  'actions.review.session-log.field.time': 'время',
  'actions.review.session-log.field.tag_id': 'тег',
  'actions.review.session-log.field.text': 'текст',
  'actions.review.session-log.field.resolved': 'классификация',
  'actions.review.session-log.delete': 'Удалить запись журнала сессии',
  'actions.review.images.add.one': 'Добавить изображения: {count}',
  'actions.review.images.add.other': 'Добавить изображения: {count}',
  'actions.review.images.remove.one': 'Убрать изображения: {count}',
  'actions.review.images.remove.other': 'Убрать изображения: {count}',
  'actions.images.annotate.one':
    'Изменить теги или заметки изображений: {count}',
  'actions.images.annotate.other':
    'Изменить теги или заметки изображений: {count}',
  'actions.review.key-events.add.one': 'Добавить ключевые события: {count}',
  'actions.review.key-events.add.other': 'Добавить ключевые события: {count}',
  'actions.review.key-events.update': 'Обновить ключевое событие {name}',
  'actions.review.key-events.delete': 'Удалить ключевое событие {name}',
  'actions.review.day-trade-fields.set.one':
    'Задать поля дня и обновить сделки: {count}',
  'actions.review.day-trade-fields.set.other':
    'Задать поля дня и обновить сделки: {count}',
  'actions.session.unplanned.start':
    'Начать незапланированную сессию: {reason}',
  'actions.session.unplanned.stop': 'Остановить незапланированную сессию',
  'actions.account.create':
    'Создать счёт типа {type} в {currency} с начальным балансом {balance}',
  'actions.account.field.account_type': 'тип',
  'actions.account.field.currency': 'валюта',
  'actions.account.field.created_date': 'дата начала',
  'actions.account.field.initial_balance': 'начальный баланс',
  'actions.account.field.live_balance': 'фактический баланс',
  'actions.account.field.drawdown': 'просадка',
  'actions.account.field.profit_target': 'цель по прибыли',
  'actions.account.field.monthly_cost': 'ежемесячная плата',
  'actions.account.field.copy_trading': 'копирование сделок',
  'actions.account.rename': 'Переименовать в {name}',
  'actions.account.rename-trades.one':
    'Обновить сделки, которые на него ссылаются: {count}',
  'actions.account.rename-trades.other':
    'Обновить сделки, которые на него ссылаются: {count}',
  'actions.account.delete': 'Удалить счёт',
  'actions.account.transaction.deposit':
    'Записать пополнение {amount} за {date}',
  'actions.account.transaction.withdrawal': 'Записать вывод {amount} за {date}',
  'actions.account.transaction.delete-deposit':
    'Удалить пополнение {amount} за {date}',
  'actions.account.transaction.delete-withdrawal':
    'Удалить вывод {amount} за {date}',
  'actions.prop-challenge.advance': 'Засчитать {from} и начать {to}',
  'actions.prop-challenge.conclude':
    'Засчитать {phase} и завершить челлендж как пройденный',
  'actions.prop-challenge.account-type': 'Перевести счёт в тип {type}',
  'actions.prop-challenge.fail': 'Отметить {phase} и челлендж как проваленные',
  'actions.prop-challenge.reopen': 'Снова открыть {phase}',
  'actions.prop-challenge.cost.purchase':
    'Записать покупку на {amount} за {date}',
  'actions.prop-challenge.cost.reset':
    'Записать плату за сброс {amount} за {date}',
  'actions.prop-challenge.cost.activation':
    'Записать плату за активацию {amount} за {date}',
  'actions.prop-challenge.cost.other': 'Записать расход {amount} за {date}',
  'actions.prop-challenge.cost.delete': 'Удалить расход {amount} за {date}',
  'actions.prop-challenge.configure.create.one':
    'Настроить {name}, этапов: {count}',
  'actions.prop-challenge.configure.create.other':
    'Настроить {name}, этапов: {count}',
  'actions.prop-challenge.configure.update.one':
    'Обновить {name}: этапы ({count}) и их правила',
  'actions.prop-challenge.configure.update.other':
    'Обновить {name}: этапы ({count}) и их правила',
  'actions.prop-challenge.configure.remove-phase':
    'Удалить ожидающий этап {phase}',
  'agent-history.title': 'Недавние изменения агентов',
  'agent-history.empty':
    'Здесь появляются изменения, которые ИИ-агенты вносят на этом устройстве.',
  'agent-history.undo': 'Отменить',
  'agent-history.undone': 'Отменено',
  'agent-history.undone-notice': 'Изменение агента отменено.',
  'agent-history.undo-failed':
    'Часть изменения не удалось отменить: его с тех пор редактировали.',
  'agent-history.undo-in-use':
    'Часть изменения не удалось отменить: этот элемент теперь используется в вашем журнале.',
  'agent-history.partly-applied': 'Изменение применено лишь частично.',
  'agent-history.not-applied': 'Это изменение не было применено.',
  'agent-action.title.trade.create': 'Создать сделку',
  'agent-action.title.trade.update': 'Обновить сделку',
  'agent-action.title.trade.set_type': 'Изменить тип сделки',
  'agent-action.title.trade.delete': 'Удалить сделку',
  'agent-action.title.review.create': 'Создать обзор',
  'agent-action.title.review.update': 'Обновить обзор',
  'agent-action.title.review.add_session_log_entries':
    'Добавить записи в журнал сессии',
  'agent-action.title.review.update_session_log_entry':
    'Обновить запись журнала сессии',
  'agent-action.title.review.delete_session_log_entry':
    'Удалить запись журнала сессии',
  'agent-action.title.review.add_images': 'Добавить изображения в обзор',
  'agent-action.title.review.set_image_annotations':
    'Задать теги и заметки изображений обзора',
  'agent-action.title.trade.set_image_annotations':
    'Задать теги и заметки изображений сделки',
  'agent-action.title.review.add_key_events': 'Добавить ключевые события',
  'agent-action.title.review.update_key_event': 'Обновить ключевое событие',
  'agent-action.title.review.delete_key_event': 'Удалить ключевое событие',
  'agent-action.title.review.set_day_trade_fields': 'Задать поля сделок дня',
  'agent-action.title.session.start_unplanned':
    'Начать незапланированную сессию',
  'agent-action.title.session.stop_unplanned':
    'Остановить незапланированную сессию',
  'agent-action.title.review.remove_images': 'Удалить изображения из обзора',
  'agent-action.title.tag.create': 'Создать теги',
  'agent-action.title.tag.set_color': 'Задать цвет тега',
  'agent-action.title.tag.clear_color': 'Убрать цвет тега',
  'agent-action.title.tag.rename': 'Переименовать тег',
  'agent-action.title.tag.merge': 'Объединить теги',
  'agent-action.title.tag.delete': 'Удалить тег',
  'agent-action.title.mistake.create': 'Создать ошибки',
  'agent-action.title.mistake.rename': 'Переименовать ошибку',
  'agent-action.title.mistake.merge': 'Объединить ошибки',
  'agent-action.title.mistake.delete': 'Удалить ошибку',
  'agent-action.title.account_type.create': 'Создать типы счетов',
  'agent-action.title.account_type.rename': 'Переименовать тип счёта',
  'agent-action.title.account_type.move': 'Переместить тип счёта',
  'agent-action.title.account_type.delete': 'Удалить тип счёта',
  'agent-action.title.event.create': 'Создать события',
  'agent-action.title.event.update_style': 'Обновить стиль события',
  'agent-action.title.event.rename': 'Переименовать событие',
  'agent-action.title.event.merge': 'Объединить события',
  'agent-action.title.event.delete': 'Удалить событие',
  'agent-action.title.settings.set_analytics_calculation':
    'Задать расчёт аналитики',
  'agent-action.title.settings.set_date_time_display':
    'Задать отображение даты и времени',
  'agent-action.title.settings.set_display_preferences':
    'Задать настройки отображения',
  'agent-action.title.settings.set_trading_day': 'Задать торговый день',
  'agent-action.title.settings.set_risk_display': 'Задать риск и отображение',
  'agent-action.title.settings.set_break_even': 'Задать порог безубыточности',
  'agent-action.title.settings.set_trade_entry':
    'Задать настройки ввода сделок',
  'agent-action.title.settings.set_review_automation':
    'Задать автоматизацию обзоров',
  'agent-action.title.settings.set_economic_calendar':
    'Задать импорт экономического календаря',
  'agent-action.title.settings.set_session_schedule':
    'Задать расписание сессий',
  'agent-action.title.dashboard_layout.create': 'Создать макет панели',
  'agent-action.title.dashboard_layout.duplicate': 'Дублировать макет панели',
  'agent-action.title.dashboard_layout.update': 'Заменить макет панели',
  'agent-action.title.dashboard_layout.rename': 'Переименовать макет панели',
  'agent-action.title.dashboard_layout.delete': 'Удалить макет панели',
  'agent-action.title.dashboard_layout.set_active':
    'Сделать макет панели активным',
  'agent-action.title.home_layout.create': 'Создать макет главной',
  'agent-action.title.home_layout.duplicate': 'Дублировать макет главной',
  'agent-action.title.home_layout.update': 'Заменить макет главной',
  'agent-action.title.home_layout.rename': 'Переименовать макет главной',
  'agent-action.title.home_layout.delete': 'Удалить макет главной',
  'agent-action.title.home_layout.set_active': 'Сделать макет главной активным',
  'agent-action.title.review_template.create': 'Создать шаблон обзора',
  'agent-action.title.review_template.duplicate': 'Дублировать шаблон обзора',
  'agent-action.title.review_template.update': 'Заменить шаблон обзора',
  'agent-action.title.review_template.delete': 'Удалить шаблон обзора',
  'agent-action.title.review_template.set_default':
    'Задать шаблон обзора по умолчанию',
  'agent-action.title.session_workflow.create': 'Создать сценарий сессии',
  'agent-action.title.session_workflow.update': 'Заменить сценарий сессии',
  'agent-action.title.session_workflow.delete': 'Удалить сценарий сессии',
  'agent-action.title.session_workflow.delete_question':
    'Удалить вопрос сессии из библиотеки',
  'agent-action.title.setup.create': 'Создать сетап',
  'agent-action.title.setup.update': 'Обновить сетап',
  'agent-action.title.setup.rename': 'Переименовать сетап',
  'agent-action.title.setup.delete': 'Удалить сетап',
  'agent-action.title.custom_field.create': 'Создать пользовательское поле',
  'agent-action.title.custom_field.update': 'Обновить пользовательское поле',
  'agent-action.title.custom_field.delete': 'Удалить пользовательское поле',
  'agent-action.title.custom_field.reorder':
    'Изменить порядок пользовательских полей',
  'agent-action.title.session_log_tag.create': 'Создать тег журнала сессии',
  'agent-action.title.session_log_tag.update': 'Обновить тег журнала сессии',
  'agent-action.title.session_log_tag.delete': 'Удалить тег журнала сессии',
  'agent-action.title.account.create': 'Создать счёт',
  'agent-action.title.account.update': 'Обновить счёт',
  'agent-action.title.account.rename': 'Переименовать счёт',
  'agent-action.title.account.delete': 'Удалить счёт',
  'agent-action.title.account.add_transaction': 'Записать пополнение или вывод',
  'agent-action.title.account.delete_transaction':
    'Удалить пополнение или вывод',
  'agent-action.title.prop_challenge.advance':
    'Перевести челлендж на следующую фазу',
  'agent-action.title.prop_challenge.fail': 'Отметить челлендж как проваленный',
  'agent-action.title.prop_challenge.reopen': 'Возобновить челлендж',
  'agent-action.title.prop_challenge.add_cost': 'Записать расход на челлендж',
  'agent-action.title.prop_challenge.delete_cost': 'Удалить расход на челлендж',
  'agent-action.title.prop_challenge.configure': 'Настроить челлендж',
  'agent-history.undo-confirm.title': 'Отменить изменение агента?',
  'agent-history.undo-confirm.message':
    'Journalit отменит это изменение. То, что редактировали после, останется как есть.',
  'agent-approval.eyebrow': 'Запрос ИИ-агента',
  'agent-approval.position': '{index} из {total}',
  'agent-approval.previous': 'Предыдущий запрос',
  'agent-approval.next': 'Следующий запрос',
  'agent-approval.hide': 'Пока скрыть',
  'agent-approval.details': 'Подробнее',
  'agent-approval.hide-details': 'Скрыть подробности',
  'agent-approval.approved': 'Одобрено. Попросите агента продолжить.',
  'agent-approval.denied': 'Отклонено. Агент не внесёт эти изменения.',
  'agent-approval.expired': 'Срок запроса истёк. Попросите агента повторить.',
  'agent-activity.title': 'Действия ИИ-агентов',
  'agent-activity.waiting': 'Ждут вашего решения',
  'command.open-agent-activity': 'Открыть действия ИИ-агентов',
  'settings.mcp-access.title': 'ИИ-приложения (MCP)',
  'settings.mcp-access.description':
    'Разрешите ИИ-приложениям, подключённым к вашему аккаунту Journalit, например Claude или ChatGPT, читать и обновлять это хранилище через MCP.',
  'settings.mcp-access.loading': 'Загрузка доступа MCP…',
  'settings.mcp-access.unavailable':
    'Доступ MCP сейчас недоступен. Откройте настройки снова, чтобы повторить попытку.',
  'settings.mcp-access.toggle.label': 'Включить доступ MCP',
  'settings.mcp-access.toggle.description':
    'Сделать хранилище доступным для ИИ-приложений, которые вы одобрите на journalit.co.',
  'settings.mcp-access.status.label': 'Статус',
  'settings.mcp-access.status.off': 'Выключено',
  'settings.mcp-access.status.off-detail':
    'Ни одно ИИ-приложение не может использовать это хранилище. Включите доступ, чтобы приложения вроде Claude и ChatGPT могли читать и обновлять его; здесь появится инструкция по подключению.',
  'settings.mcp-access.status.connecting': 'Подключение',
  'settings.mcp-access.status.connecting-detail':
    'Регистрация хранилища в вашем аккаунте Journalit.',
  'settings.mcp-access.status.connected': 'Подключено',
  'settings.mcp-access.status.connected-detail':
    'Одобренные вами ИИ-приложения могут использовать это хранилище.',
  'settings.mcp-access.status.failed': 'Не подключено',
  'settings.mcp-access.status.lost-detail':
    'Journalit больше не распознаёт подключение этого хранилища, поэтому ваши ИИ-приложения не могут его использовать. Подключите его снова, чтобы вернуть доступ.',
  'settings.mcp-access.failed.account-unavailable':
    'Ваш аккаунт Journalit сейчас не может использовать доступ MCP.',
  'settings.mcp-access.failed.vault-limit-reached':
    'В вашем тарифе не осталось доступа MCP для ещё одного хранилища.',
  'settings.mcp-access.failed.vault-limit-move':
    'ИИ-приложения подключены к другому хранилищу, «{vault}» (последнее использование: {lastUsed}), а лимит хранилищ вашего тарифа исчерпан.',
  'settings.mcp-access.failed.vault-limit-move-never-used':
    'ИИ-приложения подключены к другому хранилищу, «{vault}» (ни разу не использовалось), а лимит хранилищ вашего тарифа исчерпан.',
  'settings.mcp-access.action.move-here': 'Перенести доступ ИИ в это хранилище',
  'settings.mcp-access.move.confirm-title':
    'Перенести доступ ИИ в это хранилище?',
  'settings.mcp-access.move.confirm-message':
    'ИИ-приложения, подключённые к «{vault}», перестанут там работать. Их нужно будет заново подключить к этому хранилищу.',
  'settings.mcp-access.move.confirm': 'Перенести доступ ИИ',
  'settings.mcp-access.failed.temporarily-unavailable':
    'Доступ MCP временно недоступен. Повторите попытку чуть позже.',
  'settings.mcp-access.failed.settings-unavailable':
    'Не удалось сохранить настройку доступа MCP в этом хранилище. Попробуйте снова.',
  'settings.mcp-access.activity.description':
    'Одобряйте ожидающие запросы и просматривайте или отменяйте недавние изменения агентов.',
  'settings.mcp-access.activity.open': 'Открыть',
  'settings.mcp-access.action.retry': 'Повторить',
  'settings.mcp-access.action.reconnect': 'Подключить снова',
  'settings.mcp-access.failed.sign-in-required':
    'Войдите в учётную запись Journalit и повторите попытку.',
  'settings.mcp-access.failed.vault-identity':
    'Не удалось определить это хранилище. Перезапустите Obsidian и повторите попытку.',
  'settings.mcp-access.failed.request-rejected':
    'Не удалось зарегистрировать хранилище. Проверьте учётную запись и повторите попытку.',
  'settings.mcp-access.failed.unexpected-response':
    'Journalit вернул неожиданный ответ. Повторите попытку чуть позже.',
  'settings.mcp-access.failed.rate-limited':
    'Слишком много попыток. Подождите немного и повторите.',
  'settings.mcp-access.failed.connection':
    'Не удалось связаться с Journalit. Проверьте подключение и повторите попытку.',
  'settings.mcp-access.full-access.label': 'Полный доступ',
  'settings.mcp-access.full-access.description':
    'ИИ-агенты вносят любые изменения без запроса. Если выключено, удаление, слияние и крупные изменения ждут вашего одобрения.',
  'settings.mcp-access.full-access.warning':
    'С полным доступом агент может удалять и изменять сделки, счета, обзоры и настройки и переписывать много заметок без вашего одобрения. Включайте только для доверенных агентов.',
  'settings.mcp-access.usage.label': 'Использование за месяц',
  'settings.mcp-access.usage.loading': 'Загрузка данных об использовании…',
  'settings.mcp-access.usage.unavailable':
    'Данные об использовании сейчас недоступны.',
  'settings.mcp-access.usage.limited':
    'В этом месяце использовано {consumed} из {limit} вызовов ИИ-инструментов. Сброс {date}.',
  'settings.mcp-access.usage.unlimited':
    'Вызовов ИИ-инструментов в этом месяце: {consumed}. Сброс {date}.',
  'settings.mcp-access.usage.reached':
    'Все {limit} вызовов ИИ-инструментов в этом месяце израсходованы. Сброс {date}.',
  'settings.mcp-access.usage.upgrade': 'Улучшить план',
  'settings.mcp-access.usage.not-counted':
    'Проверки, предпросмотры, навигация, просмотр изображений и обращения к документации не учитываются.',
  'settings.mcp-access.usage.pro-offer':
    'Перейдите на Pro, чтобы получить больше вызовов ИИ-инструментов',
  'settings.mcp-access.connect.title': 'Подключить ИИ-приложение',
  'settings.mcp-access.connect.url-label': 'URL сервера MCP',
  'settings.mcp-access.connect.copy': 'Копировать',
  'settings.mcp-access.connect.copied': 'Скопировано',
  'settings.mcp-access.connect.copy-failed': 'Не удалось скопировать',
  'settings.mcp-access.connect.copy-url': 'Скопировать URL сервера MCP',
  'settings.mcp-access.connect.copy-command': 'Скопировать команду',
  'settings.mcp-access.connect.app-label': 'ИИ-приложение',
  'settings.mcp-access.connect.claude.open':
    'В Claude (веб или десктоп) откройте Customize → Connectors.',
  'settings.mcp-access.connect.claude.add':
    'Выберите + Add → Add custom connector и вставьте URL сервера MCP.',
  'settings.mcp-access.connect.chatgpt.open':
    'В веб-версии ChatGPT откройте Plugins (chatgpt.com/plugins).',
  'settings.mcp-access.connect.chatgpt.add':
    'Выберите + → Add custom MCP server, вставьте URL сервера MCP и выберите OAuth.',
  'settings.mcp-access.connect.step.approve':
    'Войдите в Journalit и подтвердите доступ.',
  'settings.mcp-access.connect.claude-code.run':
    'Выполните эту команду в терминале:',
  'settings.mcp-access.connect.claude-code.sign-in':
    'В Claude Code выполните /mcp и войдите в Journalit.',
  'settings.mcp-access.connect.sign-in-note':
    'ИИ-приложение откроет journalit.co, чтобы вы вошли и выбрали это хранилище.',
  'settings.mcp-access.connect.manage': 'Управлять подключёнными приложениями',
  'actions.options.rename-none': 'Переименовать {source} в {target}',
  'actions.options.merge-none': 'Объединить {source} с {target}',
  'actions.custom-field.delete-unused':
    'Удалить поле; ни в одной сделке нет его значения',
  'actions.session-log-tag.delete-unused':
    'Убрать тег из редактора; ни один журнал сессии его не использует',
  'actions.trade.entries.one': 'входов: {count}',
  'actions.trade.entries.other': 'входов: {count}',
  'actions.trade.exits.one': 'выходов: {count}',
  'actions.trade.exits.other': 'выходов: {count}',
  'agent-requests.changes.one': 'Изменений: {count}',
  'agent-requests.changes.other': 'Изменений: {count}',
  'agent-requests.kind-count': '{title} ×{count}',
};

export default ru;
