

import type { Lang } from './en';

const ru: Lang = {
  
  
  

  
  'command.add-trade': 'Добавить новую сделку',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Открыть Trade Import',

  
  'command.create-drc': 'Открыть дневной анализ',
  'command.create-weekly-review': 'Открыть недельный обзор',
  'command.create-monthly-review': 'Открыть месячный обзор',
  'command.create-quarterly-review': 'Открыть квартальный обзор',
  'command.create-yearly-review': 'Открыть годовой обзор',

  
  'command.open-dashboard': 'Открыть торговую панель',
  'command.open-account-dashboard': 'Открыть панель счёта',
  'command.open-trade-log': 'Открыть журнал сделок',
  'command.open-home': 'Открыть главную',
  'command.open-position-size-calculator':
    'Открыть калькулятор размера позиции',

  
  'command.force-sync': 'Принудительная синхронизация сделок',
  'command.cancel-sync': 'Отменить синхронизацию сделок',

  
  'command.replay-onboarding': 'Повторить вводное руководство',
  'command.replay-current-view-guide':
    'Повторить гайд для текущего представления',
  'command.open-release-notes': 'Просмотреть примечания к выпуску',
  'command.repair-trade-identities': 'Исправить идентификаторы сделок',

  
  'command.open-layout-builder': 'Открыть конструктор макетов',
  'command.switch-template': 'Сменить шаблон',

  
  
  
  'form.section.trade-details': 'Детали сделки',
  'form.section.trading-costs': 'Торговые издержки',
  'form.section.risk-management': 'Управление рисками',
  'form.section.analysis-thesis': 'Анализ и тезис',

  
  
  
  'form.tab.basic': 'Основное',
  'form.tab.details': 'Детали',
  'form.tab.advanced': 'Дополнительно',

  
  
  
  'form.field.account': 'Счёт',
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
  'form.field.risk-amount': 'Сумма риска',
  'form.field.profit-loss': 'Прибыль/Убыток',
  'form.field.total-pnl': 'Общий P&L',
  'form.field.realized-pnl': 'Реализованный P&L',
  'form.field.total-costs': 'Общие издержки:',
  'form.field.setup': 'Сетап',
  'form.field.mistake': 'Ошибка',
  'form.field.custom-tags': 'Пользовательские теги',
  'form.field.trade-thesis': 'Тезис сделки',
  'form.field.time': 'Время',
  'form.field.price': 'Цена',
  'form.field.size': 'Размер',
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
  'form.placeholder.stop-loss': 'Цена стоп-лосса (необязательно)',
  'form.placeholder.risk-amount': 'Планируемый риск в валюте',
  'form.placeholder.custom-tag': 'Введите тег и нажмите Enter',
  'form.placeholder.thesis': 'Введите тезис для этой сделки...',
  'form.placeholder.pnl': 'Введите общую прибыль или убыток',
  'form.placeholder.exchange-stock': 'напр., NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'напр., Binance, Coinbase',
  'form.placeholder.futures-point-value': 'напр.: 50 для ES1',
  'form.placeholder.leverage': 'напр., 100 для 1:100',

  
  
  
  'form.entry-exit.add-entry': '+ Добавить вход',
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
  'form.entry-exit.direct-pnl': 'Ввести P&L напрямую вместо цен',
  'form.entry-exit.direct-pnl-desc':
    'Введите общую прибыль/убыток напрямую. Комиссия и сборы будут вычтены.',
  'form.entry-exit.calc-pnl':
    'Рассчитать P&L из цен входа/выхода и размеров позиции.',

  
  
  
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

  'form.account-empty-state.title':
    'Сначала создайте счёт, а затем добавляйте сделку',
  'form.account-empty-state.create-account': 'Создать счёт',
  'form.account-empty-state.submit-disabled':
    'Сначала создайте счёт, чтобы сохранить эту сделку.',

  
  
  
  'button.save': 'Сохранить',
  'button.cancel': 'Отмена',
  'button.delete': 'Удалить',
  'button.update': 'Обновить',
  'button.add': 'Добавить',
  'button.create': 'Создать',
  'button.reset': 'Сбросить',
  'button.close': 'Закрыть',
  'button.confirm': 'Подтвердить',
  'button.submit': 'Отправить',

  'button.add-trade': 'Добавить сделку',
  'button.update-trade': 'Обновить сделку',
  'button.save-changes': 'Сохранить изменения',
  'button.create-trade': 'Создать сделку',
  'button.delete-all': 'Удалить все',
  'button.clear-all': 'Очистить все',
  'button.save-name-only': 'Сохранить только имя',
  'button.cancel-action': 'Отменить действие',
  'button.cancel-reset': 'Отменить сброс',
  'button.proceed-anyway': 'Продолжить всё равно',
  'button.mark-reviewed': 'Отметить проверенным',
  'button.add-first-goal': 'Добавить первую цель',
  'button.add-first-event': 'Добавить первое событие',
  'button.create-daily-review': 'Создать ежедневный обзор',
  'button.apply-settings': 'Применить настройки',
  'button.learn-more': 'Узнать больше',
  'button.upload-image': 'Загрузить изображение',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': 'Изменить',
  'validation.fix-errors': 'Пожалуйста, исправьте следующие ошибки:',

  'validation.complete-required': 'Пожалуйста, заполните все обязательные поля',
  'validation.map-required-fields':
    'Сопоставьте все обязательные поля перед импортом',
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
    'Размер лота не может быть отрицательным.',
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
  'trade.validation.stop-loss-number': 'Стоп-лосс должен быть числом.',
  'trade.validation.stop-loss-valid-number':
    'Стоп-лосс должен быть корректным числом.',
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

  
  
  
  'notice.verification-sent': 'Код подтверждения отправлен! Проверьте почту.',
  'notice.login-success': 'Вход выполнен успешно!',
  'notice.new-verification-sent':
    'Новый код подтверждения отправлен! Проверьте почту.',
  'notice.logout-success': 'Выход выполнен успешно',
  'notice.hotkey-set': 'Hotkey set: {hotkey}',
  'notice.ftp-created': 'FTP-учётные данные созданы успешно',
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
  'notice.reset-timeframes': 'Таймфреймы сброшены к значениям по умолчанию',
  'notice.custom-fields-imported':
    'Успешно импортировано {count} пользовательских полей',
  'notice.csv-parsed': 'CSV/XLSX/XLS успешно обработан: {count} строк',
  'notice.setups-added': 'Сетапы добавлены к {count} сделкам',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': 'Ошибки добавлены к {count} сделкам',

  
  
  
  'notice.error.open-journalit':
    'Не удалось открыть Journalit. Попробуйте перезагрузить Obsidian.',
  'notice.error.open-drc': 'Не удалось открыть дневной анализ: {error}',
  'notice.error.open-dashboard': 'Failed to open dashboard: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review':
    'Не удалось открыть недельный обзор: {error}',
  'notice.error.open-monthly-review':
    'Не удалось открыть месячный обзор: {error}',
  'notice.error.open-quarterly-review':
    'Не удалось открыть квартальный обзор: {error}',
  'notice.error.open-yearly-review':
    'Не удалось открыть годовой обзор: {error}',
  'notice.error.sync-trades': 'Не удалось синхронизировать сделки: {error}',
  'notice.error.open-release-notes':
    'Не удалось открыть примечания к выпуску: {error}',
  'notice.trade-identity-repair-complete':
    'Исправление идентификаторов завершено: проверено {scanned}, дополнено {backfilled}, исправлено дубликатов {duplicates}.',
  'notice.error.repair-trade-identities':
    'Не удалось исправить идентификаторы сделок: {error}',
  'notice.guide.replay-unavailable':
    'Система гайдов пока недоступна. Попробуйте снова.',
  'notice.guide.no-active-view':
    'Сначала откройте поддерживаемое представление Journalit, затем запустите команду снова.',
  'notice.guide.no-guide-for-view':
    'Для этого представления пока не зарегистрирован гайд ({viewType}).',
  'notice.guide.replay-failed': 'Не удалось запустить гайд. Попробуйте снова.',
  'notice.guide.replay-started': 'Гайд для этого представления перезапущен.',
  'notice.error.open-layout-builder':
    'Не удалось открыть конструктор макетов: {error}',
  'notice.error.switch-template': 'Не удалось сменить layout: {error}',
  'notice.error.no-active-file':
    'Нет активного файла. Сначала откройте заметку.',
  'notice.error.no-template-support':
    'Этот тип заметки не поддерживает шаблоны.',
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
  'notice.error.invalid-drc-date': 'Неверная дата дневного анализа',
  'notice.error.invalid-drc-missed':
    'Неверная дата дневного анализа. Невозможно создать пропущенную сделку.',
  'notice.error.trade-not-found': 'Файл сделки не найден: {path}',
  'notice.error.mark-reviewed':
    'Ошибка при отметке сделок как проверенных: {error}',
  'notice.error.add-setups': 'Ошибка добавления сетапов: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'Ошибка добавления ошибок: {error}',
  'notice.error.delete-trades': 'Ошибка удаления сделок: {error}',
  'notice.error.csv-validation': 'Ошибка валидации CSV/XLSX/XLS: {errors}',
  'notice.error.import-failed': 'Импорт не удался: {error}',
  'notice.error.file-too-large':
    'Файл слишком большой. Максимальный размер 10 МБ',
  'notice.error.select-csv': 'Выберите файл CSV/XLSX/XLS/HTML',
  'notice.error.cannot-delete-builtin': 'Нельзя удалить встроенные layouts',
  'notice.error.duplicate-to-customize': 'Дублируйте этот layout для настройки',
  'notice.error.sign-out': 'Не удалось выйти из аккаунта. Попробуйте снова.',
  'notice.error.open-upgrade-modal':
    'Запрошена премиум-функция, но не удалось открыть окно обновления.',

  
  
  
  'notice.info.no-sync': 'Синхронизация не выполняется',

  'notice.info.settings-recovered':
    'Настройки восстановлены из резервной копии. Некоторые недавние изменения могут быть утеряны.',
  'notice.info.cannot-remove-locked': 'Нельзя удалить заблокированные виджеты',

  
  
  
  
  'notice.error.missed-trade-service-init':
    'Сервис пропущенных сделок не инициализирован. Подождите немного и попробуйте снова.',
  'notice.error.backtest-trade-service-init':
    'Сервис бэктест-сделок не инициализирован. Подождите немного и попробуйте снова.',

  
  'notice.trade-updated': '{type} обновлён: {path}',
  'notice.trade-created': '{type} создан: {path}',
  'notice.new-trade-created': 'Новая сделка создана: {instrument} {direction}',
  'notice.error.trade-update-failed': 'Не удалось обновить {type}: {error}',
  'notice.error.trade-create-failed': 'Не удалось создать {type}: {error}',

  
  'notice.template-applied': 'Layout применён: {name}',
  'notice.error.template-name-required': 'Введите название шаблона',
  'notice.error.template-name-exists': 'Шаблон с таким именем уже существует',
  'notice.error.switch-template-generic': 'Не удалось сменить layout',
  'notice.error.plugin-not-available': 'Плагин недоступен',
  'notice.error.open-template-picker': 'Не удалось открыть выбор layoutа',
  'notice.error.template-save-failed': 'Не удалось сохранить layout',
  'notice.default-trade-template-updated':
    'Шаблон сделки по умолчанию обновлён',
  'notice.trade-template-duplicated': 'Layout сделки дублирован',
  'notice.trade-template-deleted': 'Layout сделки удалён',
  'notice.error.create-template': 'Не удалось создать layout',
  'notice.error.duplicate-template': 'Не удалось дублировать layout',
  'notice.error.delete-template': 'Не удалось удалить layout',

  
  'notice.csv-validation-failed': 'Ошибка валидации CSV/XLSX/XLS: {errors}',
  'notice.csv-parse-failed': 'Не удалось обработать CSV/XLSX/XLS-файл: {error}',
  'notice.csv-complete-fields': 'Заполните все обязательные поля',
  'notice.csv-invalid-selection': 'Неверный выбор брокера/шаблона',
  'notice.csv-import-success': 'Успешно импортировано {count} сделок!',
  'notice.csv-import-partial':
    'Импортировано {count} сделок, пропущено {duplicates} дубликатов',
  'notice.csv-import-failed': 'Импорт не удался: {error}',
  'notice.csv-import-report-copy-failed':
    'Не удалось скопировать отчёт импорта',
  'notice.csv-template-saved':
    'Шаблон сохранён. Теперь вы можете выбрать "{name}" для будущих импортов.',
  'notice.csv-template-updated': 'Шаблон "{name}" успешно обновлён',
  'notice.csv-template-update-failed': 'Не удалось обновить шаблон: {error}',
  'notice.csv-template-save-failed': 'Не удалось сохранить шаблон: {error}',
  'notice.csv-template-deleted': 'Шаблон "{name}" удалён',
  'notice.csv-template-delete-failed': 'Не удалось удалить шаблон: {error}',
  'notice.csv-template-imported': 'Шаблон "{name}" успешно импортирован',
  'notice.csv-symbol-mapping-skipped': 'Сопоставление символа пропущено',
  'notice.csv-missing-fields':
    'Сопоставьте все обязательные поля перед импортом',

  
  'notice.error.open-account-dashboard':
    'Не удалось открыть панель счёта: {error}',
  'notice.error.open-trade-form-edit':
    'Не удалось открыть форму редактирования сделки: {error}',
  'notice.error.open-onboarding':
    'Не удалось открыть мастер настройки. Проверьте консоль.',
  'notice.error.open-update-notification':
    'Не удалось открыть уведомление об обновлении: {error}',

  'notice.error.invalid-weekly-review-date':
    'Неверная дата недельного обзора. Невозможно сохранить изображение прогноза.',
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
  'tradelog.empty': 'Сделки не найдены',
  'tradelog.filter.all': 'Все',
  'tradelog.filter.winners': 'Прибыльные',
  'tradelog.filter.losers': 'Убыточные',
  'tradelog.filter.breakeven': 'Безубыточные',
  'tradelog.filter.open': 'Открытые',
  'tradelog.type.all': 'Все типы',
  'tradelog.type.regular': 'Обычные',
  'tradelog.type.missed': 'Пропущенные',
  'tradelog.type.backtest': 'Бэктесты',

  
  'tradelog.settings.modal.unsaved-changes.body1':
    'У вас есть несохранённые изменения в настройках колонок.',
  'tradelog.settings.modal.unsaved-changes.body2':
    'Вы уверены, что хотите закрыть без сохранения?',

  
  'tradelog.root.all-trades': 'Все сделки',
  'tradelog.view.selector.label': 'Вид',
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
  'tradelog.empty.submessage':
    'Начните создавать заметки о сделках, чтобы увидеть их в журнале торговли.',
  'tradelog.processing': 'Обработка данных о сделках...',

  
  'tradelog.node.file-not-found': 'Файл сделки не найден: {path}',
  'tradelog.node.no-review-available': 'Обзор недоступен для {type}: {id}',
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

  
  'tradelog.filter.all.desc': 'Все статусы сделок',
  'tradelog.filter.winners.desc': 'Прибыльные сделки',
  'tradelog.filter.losers.desc': 'Убыточные сделки',
  'tradelog.filter.breakeven.desc': 'Сделки в безубыток',
  'tradelog.filter.open.desc': 'Открытые позиции',
  'tradelog.filter.closed': 'Закрытые',
  'tradelog.filter.closed.desc':
    'Все закрытые позиции (прибыль/убыток/безубыток)',
  'tradelog.type.all.desc': 'Все типы сделок',
  'tradelog.type.regular.desc': 'Стандартные сделки',
  'tradelog.type.missed.desc': 'Упущенные возможности',
  'tradelog.type.backtest.desc': 'Симулированные сделки',

  
  'tradelog.status.win': 'ПРИБЫЛЬ',
  'tradelog.status.loss': 'УБЫТОК',
  'tradelog.status.open': 'ОТКРЫТА',
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
  'tradelog.copy-trade.tooltip': 'Copied from {account} at {multiplier}x',
  'tradelog.tooltip.partial-exits': 'Частичные закрытия:',
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
  'tradelog.tooltip.still-open': 'ещё открыта',
  'tradelog.tooltip.performance-trade': '{indicator} результативная сделка',
  'tradelog.tooltip.performance-trade-on':
    '{indicator} результативная сделка от {date}',

  
  'tradelog.alt.trade-image': 'Изображение {instrument}',
  'tradelog.alt.trade-image-n': 'Изображение {instrument} {n}',

  
  'tradelog.batch.delete-confirm.title': 'Подтверждение удаления',
  'tradelog.batch.delete-confirm.warning': 'Это действие нельзя отменить.',
  'tradelog.batch.setups.title': 'Добавить сетапы к сделкам',
  'tradelog.batch.setups.placeholder': 'Выберите или создайте сетапы...',
  'tradelog.batch.tags.title': 'Add Tags to Trades',
  'tradelog.batch.tags.placeholder': 'Select or create tags...',
  'tradelog.batch.mistakes.title': 'Добавить ошибки к сделкам',
  'tradelog.batch.mistakes.placeholder': 'Выберите или создайте ошибки...',
  'tradelog.batch.none-selected': 'НИЧЕГО НЕ ВЫБРАНО',
  'tradelog.batch.selected-count': 'ВЫБРАНО: {count}',
  'tradelog.batch.select-all.title': 'Выбрать все видимые сделки',
  'tradelog.batch.select-all.label': 'Выбрать все',
  'tradelog.batch.mark-reviewed.title':
    'Отметить выбранные сделки как проверенные',
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
  'tradelog.batch.add-setups.title': 'Добавить сетапы к выбранным сделкам',
  'tradelog.batch.add-setups.label': 'Добавить сетапы',
  'tradelog.batch.add-tags.aria': 'Add tags',
  'tradelog.batch.add-tags.title': 'Add tags to selected trades',
  'tradelog.batch.add-tags.label': 'Add Tags',
  'tradelog.batch.add-mistakes.aria': 'Добавить ошибки',
  'tradelog.batch.add-mistakes.title': 'Добавить ошибки к выбранным сделкам',
  'tradelog.batch.add-mistakes.label': 'Добавить ошибки',
  'tradelog.batch.adding': 'Добавление...',
  'tradelog.batch.add-count': 'Добавить ({count})',
  'tradelog.batch.delete.aria': 'Удалить сделки',
  'tradelog.batch.delete.title': 'Удалить выбранные сделки',
  'tradelog.batch.deleting': 'Удаление...',
  'tradelog.batch.clear.aria': 'Снять выделение',
  'tradelog.batch.clear.title': 'Снять выделение',
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
  'tradelog.category.review': 'Анализ',

  
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
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.maePrice': 'Цена MAE',
  'tradelog.column.mfePrice': 'Цена MFE',
  'tradelog.column.mae': 'MAE $',
  'tradelog.column.mfe': 'MFE $',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': 'Размер #',
  'tradelog.column.positionValue': 'Размер $',
  'tradelog.column.fees': 'Комиссии',
  'tradelog.column.dividends': 'Дивиденды',
  'tradelog.column.pnl': 'Чистый P&L',
  'tradelog.column.returnPercent': 'Return %',
  'tradelog.column.setups': 'Сетапы',
  'tradelog.column.mistakes': 'Ошибки',
  'tradelog.column.tags': 'Теги',
  'tradelog.column.reviewed': 'Проверено',
  'tradelog.column.thesis': 'Тезис',
  'tradelog.column.mtComment': 'Комментарий MT',

  
  
  
  'dashboard.title': 'Панель управления',
  'dashboard.no-data': 'Нет доступных торговых данных',
  'dashboard.empty.message': 'Нет данных торговли',
  'dashboard.empty.submessage':
    'Начните торговать, чтобы увидеть ваши метрики производительности',
  'dashboard.empty.filter-hint': 'Попробуйте настроить параметры фильтра',
  'dashboard.error.load-failed': 'Ошибка загрузки данных',
  'dashboard.button.add-widget': 'Добавить виджет',
  'dashboard.button.save-layout': 'Сохранить макет',
  'dashboard.button.edit-layout': 'Редактировать макет',
  'dashboard.metrics.netPnL': 'Чистый P&L',
  'dashboard.metrics.winRate': 'Винрейт',
  'dashboard.metrics.profitFactor': 'Коэффициент прибыли',
  'dashboard.metrics.expectancy': 'Матожидание',
  'dashboard.metrics.numTrades': 'Всего сделок',
  'dashboard.metrics.closedTrades': 'Закрытые сделки',
  'dashboard.metrics.numWinTrades': 'Прибыльные сделки',
  'dashboard.metrics.numLossTrades': 'Убыточные сделки',
  'dashboard.metrics.avgWin': 'Средняя прибыль',
  'dashboard.metrics.avgLoss': 'Средний убыток',
  'dashboard.metrics.totalCommission': 'Общая комиссия',
  'dashboard.metrics.totalFees': 'Общие сборы',
  'dashboard.metrics.maxDrawdown': 'Max Drawdown',
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
  'dashboard.conversion.rates': 'Курсы: ECB ({date})',
  'dashboard.conversion.using-ecb': 'Используются курсы ECB ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Using broker-provided base-currency P&L for {count} {tradeLabel}',
  'dashboard.conversion.trade-singular': 'trade',
  'dashboard.conversion.trade-plural': 'trades',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} из {total} сделок ({excluded} исключено: {currencies})',
  'dashboard.top-section.add-metric': 'Добавить метрику',
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
  'dashboard.filter.accounts.all': 'Все счета',
  'dashboard.filter.accounts.n-selected': '{count} счетов',
  'dashboard.filter.accounts.select-all': 'Выбрать все',
  'dashboard.filter.accounts.select-all-option': '-- Выбрать все --',
  'dashboard.filter.accounts.none-found': 'Счета не найдены',
  'dashboard.filter.tags.all': 'Все теги',
  'dashboard.filter.tags.none': 'Без тегов',
  'dashboard.filter.tags.n-selected': '{count} тегов',
  'dashboard.filter.tags.select-all': 'Выбрать все',
  'dashboard.filter.tags.none-found': 'Теги не найдены',
  'dashboard.conversion.original-pnl': 'Исходный P&L',
  'dashboard.conversion.converted-pnl': 'Конвертированный P&L',
  'dashboard.conversion.details-label': 'Сведения о конвертации валют',
  'dashboard.conversion.requires-conversion':
    'Для графиков P&L с несколькими валютами требуется конвертация по обменному курсу.',

  
  'dashboard.filter.mistakes.all': 'Все ошибки',
  'dashboard.filter.mistakes.none': 'Без ошибок',
  'dashboard.filter.mistakes.n-selected': '{count} ошибок',
  'dashboard.filter.mistakes.select-all': 'Выбрать все',
  'dashboard.filter.mistakes.none-found': 'Ошибки не найдены',

  'dashboard.filter.tickers.all': 'Все инструменты',
  'dashboard.filter.tickers.n-selected': '{count} инструментов',
  'dashboard.filter.tickers.select-all': 'Выбрать все',
  'dashboard.filter.tickers.none-found': 'Инструменты не найдены',
  'dashboard.filter.setup.all': 'Все сетапы',
  'dashboard.filter.setup.none': 'Без сетапа',
  'dashboard.filter.setup.n-selected': '{count} сетапов',
  'dashboard.filter.setup.select-all': 'Выбрать все',
  'dashboard.filter.setup.none-found': 'Сетапы не найдены',
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
  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'Нет сделок',
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
  'dashboard.rolling_win_loss.avg_win_label': 'Средняя прибыль: {value}',
  'dashboard.rolling_win_loss.avg_loss_label': 'Средний убыток: {value}',
  'dashboard.selector.title': 'Добавить на панель',
  'dashboard.selector.metrics': 'Метрики',
  'dashboard.selector.charts': 'Графики',
  'dashboard.selector.empty': 'Все метрики и графики уже добавлены',
  'dashboard.selector.hint.navigate': '↑↓ навигация',
  'dashboard.selector.hint.select': '↵ выбрать',
  'dashboard.selector.hint.close': 'esc закрыть',
  'dashboard.component-selector.title': 'Добавить виджет',
  'dashboard.component-selector.added': 'Добавлено',
  'dashboard.component-selector.category.performance': 'Производительность',
  'dashboard.component-selector.category.analysis': 'Анализ',
  'dashboard.component-selector.category.journal': 'Журнал',

  
  
  
  'view.home': 'Главная',
  'view.dashboard': 'Панель управления',
  'view.trade-log': 'Журнал сделок',
  'view.account-dashboard': 'Панель счёта',
  'view.layout-builder': 'Конструктор макетов',
  'view.csv-import': 'Trade Import',

  
  
  
  'account.edit.modal.change-date.message':
    'Вы собираетесь изменить дату создания счёта "{account}" с {oldDate} на {newDate}.',
  'account.edit.modal.change-date.warning':
    'Это обновит дату транзакции начального депозита и может повлиять на расчет возраста счета, ежемесячные циклы выставления счетов и другие метрики, основанные на датах.',
  'account.edit.modal.change-date.info':
    'Это обновит дату транзакции начального депозита в соответствии с новой датой создания.',
  'account.edit.modal.change-balance.message':
    'Вы собираетесь изменить начальный баланс с {oldBalance} на {newBalance}.',
  'account.edit.modal.change-balance.warning':
    'Вы собираетесь изменить начальный баланс этого счета. Это действие имеет важные последствия для вашей истории.',
  'account.edit.modal.change-balance.info':
    'Это изменение повлияет на все расчеты баланса, проценты P&L, расчеты просадки и полную историю транзакций.',
  'account.edit.modal.delete.question':
    'Вы уверены, что хотите навсегда удалить счёт "{name}"?',
  'account.edit.modal.delete.warning':
    'Вы уверены, что хотите навсегда удалить этот счет? Все связанные данные будут потеряны, и это действие нельзя отменить.',

  
  
  
  'common.loading': 'Загрузка...',
  'common.error': 'Ошибка',
  'common.success': 'Успешно',
  'common.warning': 'Предупреждение',
  'common.info': 'Информация',
  'common.yes': 'Да',
  'common.no': 'Нет',
  'common.ok': 'ОК',
  'common.search': 'Поиск...',
  'common.select': 'Выбрать...',
  'common.none': 'Нет',
  'common.all': 'Все',
  'common.date': 'Дата',
  'common.time': 'Время',
  'common.today': 'Сегодня',
  'common.yesterday': 'Вчера',
  'common.tomorrow': 'Завтра',
  'common.week': 'Неделя',
  'common.month': 'Месяц',
  'common.year': 'Год',
  'common.total': 'Всего',
  'common.average': 'Среднее',
  'common.min': 'Мин',
  'common.max': 'Макс',
  'common.profit': 'Прибыль',
  'common.loss': 'Убыток',
  'common.win': 'Прибыль',
  'common.lose': 'Проигрыш',
  'common.trade': 'Сделка',
  'common.trades': 'Сделки',

  
  
  
  'settings.title': 'Настройки Journalit',
  'settings.language': 'Язык',
  'settings.language-desc': 'Выберите язык отображения плагина',

  
  'settings.tab.general': 'Общие',
  'settings.tab.reviews': 'Обзор',
  'settings.tab.customization': 'Настройка',
  'settings.tab.backend': 'Синхронизация сделок',
  'settings.tab.accounts': 'Аккаунт',

  
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
  'settings.ftp.instructions.title': 'Инструкция по настройке MetaTrader:',
  'settings.ftp.instructions.step1': 'Откройте MetaTrader 5 (MT5)',
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

  
  'settings.auth.title': 'Аккаунт',
  'settings.auth.description':
    'Управление настройками аутентификации и подключения.',
  'settings.auth.status': 'Статус',
  'settings.auth.status-desc': 'Текущий статус подключения и подписки',
  'settings.auth.status-offline': 'Офлайн',
  'settings.auth.status-online': 'Онлайн',
  'settings.auth.plan-suffix': 'Тариф',
  'settings.auth.authentication': 'Аутентификация',
  'settings.auth.sign-in-desc': 'Войдите для доступа к торговому журналу',
  'settings.auth.signed-in': 'Авторизован',
  'settings.auth.sign-in-up': 'Вход / Регистрация',
  'settings.auth.sign-out': 'Выйти',
  'settings.auth.sign-out-desc': 'Выйти из аккаунта',
  'settings.auth.subscription-features': 'Возможности подписки',
  'settings.auth.tier-free': 'Бесплатный тариф с базовыми функциями.',
  'settings.auth.tier-pro':
    'Тариф Pro с продвинутой аналитикой и неограниченным хранилищем.',
  'settings.auth.tier-enterprise':
    'Тариф Enterprise с полным доступом и приоритетной поддержкой.',
  'settings.auth.tier-unknown': 'Статус подписки неизвестен.',
  'settings.auth.error-prefix': 'Ошибка: ',
  'settings.auth.offline-mode': 'Офлайн-режим',
  'settings.auth.offline-desc':
    'Работа в офлайн-режиме. Некоторые функции могут быть ограничены. Синхронизация произойдёт автоматически при подключении.',
  'settings.auth.grace-period':
    'Льготный период заканчивается через {days} дней',

  
  'settings.auth.guest': 'Гость',
  'settings.auth.actions': 'Действия',
  'settings.auth.your-plan': 'Ваш план',
  'settings.auth.feature-basic-trades': 'Базовое отслеживание сделок',
  'settings.auth.feature-basic-analytics': 'Базовая аналитика',
  'settings.auth.feature-unlimited-trades': 'Неограниченные сделки',
  'settings.auth.feature-advanced-analytics': 'Расширенная аналитика',
  'settings.auth.feature-api-access': 'API доступ',
  'settings.auth.feature-priority-support': 'Приоритетная поддержка',
  'settings.auth.manage-subscription': 'Управление подпиской',

  
  'settings.reviews.drc': 'Дневной анализ',
  'settings.reviews.weekly': 'Недельный обзор',
  'settings.reviews.monthly': 'Месячный обзор',
  'settings.reviews.quarterly': 'Квартальный обзор',
  'settings.reviews.yearly': 'Годовой обзор',
  'settings.reviews.default-templates': 'Layouts по умолчанию',
  'settings.reviews.default-templates-desc':
    'Выберите шаблон для создания новых заметок. Также можно установить в конструкторе шаблонов.',
  'settings.reviews.trade-template': 'Layout сделки',
  'settings.reviews.trade-template-desc': 'Layout для новых заметок о сделках',
  'settings.reviews.drc-template': 'Layout дневного анализа',
  'settings.reviews.drc-template-desc': 'Layout для новых дневных анализов',
  'settings.reviews.weekly-template': 'Недельный layout',
  'settings.reviews.weekly-template-desc': 'Layout для новых недельных обзоров',
  'settings.reviews.monthly-template': 'Месячный layout',
  'settings.reviews.monthly-template-desc': 'Layout для новых месячных обзоров',
  'settings.reviews.quarterly-template': 'Квартальный layout',
  'settings.reviews.quarterly-template-desc':
    'Шаблон для новых квартальных обзоров',
  'settings.reviews.yearly-template': 'Годовой layout',
  'settings.reviews.yearly-template-desc': 'Layout для новых годовых обзоров',
  'settings.reviews.template-builder': 'Конструктор макетов',
  'settings.reviews.template-builder-desc':
    'Создавайте, редактируйте и управляйте макетами визуально. Конструктор позволяет перетаскивать секции, настраивать параметры и просматривать макеты в реальном времени.',
  'settings.reviews.open-builder': 'Открыть конструктор макетов',
  'settings.reviews.recurring-goals': 'Повторяющиеся цели',
  'settings.reviews.recurring-goals-desc':
    'Определите цели, которые автоматически появляются в каждом новом обзоре. Они копируются при создании обзора и могут редактироваться индивидуально.',
  'settings.reviews.daily-goals': 'Ежедневные цели',
  'settings.reviews.daily-goal-placeholder': 'Добавить ежедневную цель...',
  'settings.reviews.weekly-goals': 'Недельные цели',
  'settings.reviews.weekly-goal-placeholder': 'Добавить недельную цель...',
  'settings.reviews.pre-trade-checklist': 'Чек-лист DRC перед торговлей',
  'settings.reviews.pre-trade-checklist-desc':
    'Определите пункты чек-листа, которые автоматически появляются в каждом новом DRC. Они копируются при создании и могут редактироваться для каждого дня.',
  'settings.reviews.checklist-placeholder': 'Добавить пункт чек-листа...',
  'settings.reviews.weekly-checklist': 'Недельный чек-лист подготовки',
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
  'settings.reviews.scalper-defaults': 'Параметры по умолчанию для скальпинга',
  'settings.reviews.scalper-defaults-desc':
    'Настройте глобальные параметры поведения Demon Tracker. Отдельные виджеты Demon Tracker могут переопределять их в Layout Builder.',
  'settings.reviews.scalper-default-count-mode': 'Режим подсчёта по умолчанию',
  'settings.reviews.scalper-default-count-mode-desc':
    'Выберите, считать повторяющиеся ошибки по каждой сделке или один раз за торговый день.',
  'settings.reviews.scalper-default-source-mode':
    'Режим источника по умолчанию',
  'settings.reviews.scalper-default-source-mode-desc':
    'Выберите, использовать ли для Demon Tracker ошибки сделок, ошибки сессии или оба источника.',
  'settings.reviews.scalper-auto-apply-session':
    'Автоматически применять ошибки сессии к сделкам дня',
  'settings.reviews.scalper-auto-apply-session-desc':
    'Если включено, ошибки уровня сессии по умолчанию могут применяться ко всем сделкам того же торгового дня.',
  'settings.reviews.scalper-auto-apply-session-aria':
    'Автоматически применять ошибки сессии к сделкам дня',
  'settings.reviews.notice.template-updated': 'Layout по умолчанию обновлён',
  'settings.reviews.notice.builder-not-found':
    'Команда конструктора макетов не найдена',
  'settings.reviews.notice.global-auto-create':
    'Автосоздание для всех обзоров {status}',
  'settings.reviews.notice.auto-create-nav':
    'Автосоздание {type} при навигации {status}',
  'settings.reviews.daily.checklist-title': 'Пункты чек-листа перед сделкой',
  'settings.reviews.daily.checklist-desc':
    'Настройте пункты чек-листа для ежедневного отчёта. Это задачи, которые нужно выполнить перед началом торговой сессии.',
  'settings.reviews.daily.checklist-placeholder': 'Новый пункт чек-листа',
  'settings.reviews.daily.questions-title': 'Вопросы для обзора',
  'settings.reviews.daily.questions-desc':
    'Настройте вопросы для раздела обзора. Эти вопросы помогают проанализировать результаты торговли.',
  'settings.reviews.daily.questions-placeholder': 'Новый вопрос для обзора',
  'settings.reviews.daily.timeframes-title': 'Таймфреймы прогноза',
  'settings.reviews.daily.timeframes-desc':
    'Настройте таймфреймы для прогнозов в ежедневном отчёте.',
  'settings.reviews.daily.timeframes-placeholder':
    'Новый таймфрейм (напр., 15M, 5M)',

  
  'settings.weekly.review-questions': 'Вопросы для обзора',
  'settings.weekly.review-questions-desc':
    'Настройте вопросы для недельного обзора. Эти вопросы помогают проанализировать результаты торговли за неделю.',
  'settings.weekly.new-question-placeholder': 'Новый вопрос для обзора',
  'settings.weekly.forecast-timeframes': 'Таймфреймы прогноза',
  'settings.weekly.forecast-timeframes-desc':
    'Настройте таймфреймы для недельного прогноза.',
  'settings.weekly.new-timeframe-placeholder':
    'Новый таймфрейм (напр., Weekly, Daily)',
  'settings.weekly.default-question-1': 'Что работало хорошо на этой неделе?',
  'settings.weekly.default-question-2': 'Что не работало на этой неделе?',
  'settings.weekly.default-question-3':
    'Какие сетапы были наиболее прибыльными?',
  'settings.weekly.default-question-4': 'Какие ошибки стоили мне больше всего?',
  'settings.weekly.default-question-5':
    'Что я могу улучшить на следующей неделе?',
  'settings.weekly.default-timeframe-monthly': 'Месячный',
  'settings.weekly.default-timeframe-weekly': 'Недельный',
  'settings.weekly.default-timeframe-daily': 'Дневной',

  
  'settings.shared.timeframes.title': 'Таймфреймы прогноза',
  'settings.shared.timeframes.desc': 'Настройте таймфреймы для прогноза',
  'settings.shared.timeframes.placeholder': 'Новый таймфрейм (напр., 15M, 5M)',
  'settings.shared.timeframes.reset-to-defaults':
    'Сбросить к значениям по умолчанию',

  
  'settings.loss-review.title': 'Настройки анализа убытков',
  'settings.loss-review.description':
    'Настройте раздел анализа убытков, который появляется внизу убыточных сделок. Это помогает учиться на убытках и поддерживать правильную психологию торговли.',
  'settings.loss-review.enable': 'Включить анализ убытков',
  'settings.loss-review.enable-desc':
    'Показывать раздел анализа убытков для сделок с отрицательным P&L',
  'settings.loss-review.sections-title': 'Разделы анализа убытков',
  'settings.loss-review.add-section': 'Добавить раздел',
  'settings.loss-review.reset-to-defaults': 'Сбросить к значениям по умолчанию',
  'settings.loss-review.new-section-title': 'Новый раздел',
  'settings.loss-review.empty-state':
    'Разделы не настроены. Нажмите "Добавить раздел" для создания первого раздела.',
  'settings.loss-review.field.content': 'Содержимое',
  'settings.loss-review.field.checkbox-label': 'Метка флажка',
  'settings.loss-review.field.placeholder-text': 'Текст-подсказка',
  'settings.loss-review.field.checkbox-items': 'Пункты флажков',
  'settings.loss-review.field.section-title': 'Заголовок раздела',
  'settings.loss-review.field.section-type': 'Тип раздела',
  'settings.loss-review.placeholder.header-content':
    'Введите содержимое заголовка (поддерживается markdown)',
  'settings.loss-review.placeholder.checkbox-label':
    'Введите метку флажка (поддерживается markdown)',
  'settings.loss-review.placeholder.textarea-placeholder':
    'Введите текст-подсказку для текстового поля',
  'settings.loss-review.placeholder.checkbox-item':
    'Введите пункт флажка (поддерживается markdown)',
  'settings.loss-review.placeholder.section-title': 'Введите заголовок раздела',
  'settings.loss-review.untitled-section': 'Раздел без названия',
  'settings.loss-review.type.header': 'Заголовок',
  'settings.loss-review.type.checkbox': 'Одиночный флажок',
  'settings.loss-review.type.textarea': 'Текстовое поле',
  'settings.loss-review.type.checkbox-list': 'Список флажков',

  
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
  'settings.general.display-privacy-section':
    'Отображение & конфиденциальность',
  'settings.general.privacy-mode': 'Режим конфиденциальности',
  'settings.general.privacy-mode-desc':
    'Маскирует чувствительные значения сделок, счетов, цен и результатов в интерфейсе, не изменяя сохранённые данные.',
  'settings.general.privacy-mode-aria': 'Переключить режим конфиденциальности',

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
  'settings.general.skip-weekends': 'Пропускать выходные при навигации',
  'settings.general.skip-weekends-desc':
    'Пропускать выходные при навигации между торговыми днями (напр., пятница → понедельник)',
  'settings.general.skip-weekends-aria': 'Пропускать выходные при навигации',
  'settings.general.skip-weekends-toggled': 'Пропуск выходных {status}',
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
  'settings.general.cutoff-time': 'Время окончания торгового дня',
  'settings.general.cutoff-time-desc':
    'Время, определяющее конец торгового дня. Сделки после этого времени будут отнесены к следующему дню. (24-часовой формат, напр., 23:30)',
  'settings.general.cutoff-time-aria': 'Время окончания торгового дня',
  'settings.general.cutoff-time-changed':
    'Время окончания торгового дня изменено на {time}',
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
  'settings.general.break-even-range': 'Диапазон безубыточности',
  'settings.general.break-even-range-desc':
    'Определите диапазон P&L для признания сделок безубыточными. Например, Min: -20 и Max: 20 будут считать сделки между -$20 и +$20 безубыточными. Установите оба значения на 0, чтобы считать безубыточными только сделки с точным $0.00.',
  'settings.general.break-even-min-placeholder': 'Мин',
  'settings.general.break-even-max-placeholder': 'Макс',
  'settings.general.break-even-min-aria': 'Минимум диапазона безубыточности',
  'settings.general.break-even-max-aria': 'Максимум диапазона безубыточности',
  'settings.general.break-even-to': 'до',
  'settings.general.break-even-warning':
    'Внимание: Минимальное значение больше максимального. Это помешает классификации сделок как безубыточных.',
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
    'Показывать уведомление при наличии нового обновления плагина',
  'settings.general.update-notifications-aria':
    'Показывать уведомления об обновлениях',
  'settings.general.update-notifications-toggled':
    'Уведомления об обновлениях {status}',
  'settings.general.data-management': 'Управление данными & конфиденциальность',
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
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-analytics-desc':
    'When enabled, all-account trading analytics include derived copy-account results and count them as account-level trades.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-toggled':
    'Copy accounts in all-account analytics {status}',
  
  'settings.customization.title': 'Настройка',
  'settings.customization.description':
    'Настройка опций, внешнего вида и поведения плагина Journalit.',
  'settings.customization.tickers-symbols': 'Тикеры/Символы',
  'settings.customization.symbol-mappings': 'Сопоставления символов',
  'settings.customization.account-types': 'Типы счетов',
  'settings.customization.setups': 'Сетапы',
  'settings.customization.mistakes': 'Ошибки',
  'settings.customization.tags': 'Теги',
  'settings.customization.events': 'События',
  'settings.customization.custom-fields': 'Пользовательские поля сделки',
  'settings.customization.options.confirm.update-notes':
    'ОК (Обновить заметки)',
  'settings.customization.options.confirm.save-name': 'Сохранить только имя',
  'settings.customization.options.confirm.cancel': 'Отменить действие',
  'settings.customization.options.type.tickers': 'Тикеры',
  'settings.customization.options.type.accounts': 'Счета',
  'settings.customization.options.type.account-types': 'Типы счетов',
  'settings.customization.options.type.setups': 'Сетапы',
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
  'settings.customization.options.placeholder.select-asset':
    'Выберите тип актива...',
  'settings.customization.options.field.pip-size': 'Размер пипса',
  'settings.customization.options.field.priority': 'Приоритет:',
  'settings.customization.options.field.default-event-notes':
    'Заметки события по умолчанию:',
  'settings.customization.options.placeholder.default-event-notes':
    'Заметки для автоматического заполнения при выборе этого события',
  'settings.customization.options.aria.confirm-add':
    'Подтвердить добавление {type}',
  'settings.customization.options.label.locked': 'Заблокировано',
  'settings.customization.options.label.archived-reserved':
    'Архивный (зарезервировано)',
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
    'Создайте пользовательские поля, которые будут отображаться на вкладке "Дополнительно" формы сделки. Эти поля будут сохранены во frontmatter вашей сделки.',
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
    'Пользовательские поля будут отображаться на вкладке "Дополнительно" формы сделки и сохраняться во frontmatter заметок о сделках.',
  'settings.customization.custom-fields.add-new': 'Добавить новое поле',
  'settings.customization.custom-fields.edit-field': 'Редактировать поле',
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
    'Отображать как валюту',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Форматирует это числовое поле как денежное значение только в журнале сделок',
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

  
  'notice.csv-symbol-mappings-created.one':
    'Создано {count} сопоставление символа',
  'notice.csv-symbol-mappings-created.few':
    'Создано {count} сопоставления символов',
  'notice.csv-symbol-mappings-created.many':
    'Создано {count} сопоставлений символов',
  'notice.csv-symbol-mappings-created.other':
    'Создано {count} сопоставлений символов',

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
  'csv.results.updated.one': 'Обновлена {count} существующая сделка',
  'csv.results.updated.few': 'Обновлены {count} существующие сделки',
  'csv.results.updated.many': 'Обновлено {count} существующих сделок',
  'csv.results.updated.other': 'Обновлено {count} существующих сделок',

  'csv.results.skipped.one': '{count} дубликат сделки пропущен',
  'csv.results.skipped.few': '{count} дубликата сделок пропущено',
  'csv.results.skipped.many': '{count} дубликатов сделок пропущено',
  'csv.results.skipped.other': '{count} дубликатов сделок пропущено',
  'csv.results.skipped-incomplete':
    'Skipped {count} incomplete row(s) (missing required values)',
  'csv.results.custom-field-warnings':
    'Пропущено недопустимых значений пользовательских полей: {count}',
  'csv.results.custom-field-warnings-header':
    'CLICK TO SEE CUSTOM FIELD WARNINGS ({count})',

  'csv.results.more-trades.one': 'и ещё {count} сделка...',
  'csv.results.more-trades.few': 'и ещё {count} сделки...',
  'csv.results.more-trades.many': 'и ещё {count} сделок...',
  'csv.results.more-trades.other': 'и ещё {count} сделок...',

  
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

  
  'widget.header.name': 'Заголовок',
  'widget.header.description':
    'Навигационный заголовок со ссылками на контекст',
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
  'widget.header.day.0': 'Воскресенье',
  'widget.header.day.1': 'Понедельник',
  'widget.header.day.2': 'Вторник',
  'widget.header.day.3': 'Среда',
  'widget.header.day.4': 'Четверг',
  'widget.header.day.5': 'Пятница',
  'widget.header.day.6': 'Суббота',
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
  'widget.category.charts': 'Графики',
  'widget.category.statistics': 'Статистика',
  'widget.category.content': 'Содержание',
  'widget.category.tables': 'Таблицы',
  'widget.category.layout': 'Макет',

  
  'widget.review.name': 'Анализ',
  'widget.review.description':
    'Оценки психологического и технического мастерства',
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
    'В этом родительском обзоре еще не заполнены наследуемые значения.',
  'widget.review-context-fields.open-source': 'Open',
  'widget.review-context-fields.create-source': 'Create',
  'widget.review.title': 'Анализ техничности',
  'widget.review.mental-game': 'Психология',
  'widget.review.technical-game': 'Техника',
  'widget.review.star-hint':
    'Нажмите для полной звезды, правый клик для половины звезды',
  'widget.review.invalid-context':
    'Виджет анализа требует примечания DRC или еженедельного анализа (тип frontmatter: drc или weekly-review)',

  
  'widget.checklist.name': 'Чек-лист',
  'widget.checklist.description': 'Чек-лист подготовки перед сессией',
  'widget.checklist.title': 'Чек-лист перед торговлей',
  'widget.checklist.weekly-title': 'Недельный предварительный чек-лист',
  'widget.checklist.tooltip.weekly':
    'Элементы, добавленные здесь, применяются только к этой неделе.',
  'widget.checklist.tooltip.weekly-settings-link':
    'Для повторяющихся элементов во всех новых недельных обзорах перейдите в Настройки > Обзоры.',
  'widget.checklist.tooltip.day-only':
    'Элементы применяются только к этому дню.',
  'widget.checklist.tooltip.settings-link':
    'Для повторяющихся элементов перейдите в Параметры > Обзоры.',
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
  'widget.session-mistakes.field-label': 'Ошибки',
  'widget.session-mistakes.placeholder': 'Выберите или создайте ошибки',
  'widget.session-mistakes.empty': 'Ошибки сессии не добавлены',
  'widget.session-mistakes.count': 'Выбрано: {count}',
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
  'widget.key-events.notes-placeholder':
    'Заметки об этом событии (опционально)',
  'widget.key-events.notes-label': 'Заметки',
  'widget.key-events.default-notes-tooltip':
    'Заметки по умолчанию настраиваются в Настройки → Настройка → События. При выборе события здесь сохраненные заметки по умолчанию будут подставлены автоматически.',
  'widget.key-events.add-button': 'Добавить событие',
  'widget.key-events.empty-state': 'Нет ключевых событий на сегодня',
  'widget.key-events.empty-state-sub': 'Добавьте события в еженедельный анализ',

  
  'widget.missed-trades.name': 'Пропущенные сделки',
  'widget.missed-trades.description':
    'Сделки, которые вы определили, но не совершили',
  'widget.missed-trades.title': 'Упущенные сделки',
  'widget.missed-trades.add-button': 'Добавить',
  'widget.missed-trades.add-aria': 'Добавить упущенную сделку',
  'widget.missed-trades.missed-badge': 'Упущено',
  'widget.missed-trades.additional-setups': 'Дополнительные сетапы:',
  'widget.missed-trades.no-trades-today': 'Сегодня нет',
  'widget.missed-trades.no-trades-week': 'Нет упущенных сделок на неделе',
  'widget.missed-trades.invalid-context':
    'Доступно только в DRC и еженедельном обзоре.',
  'widget.missed-trades.error-no-date': 'Не удается определить дату сделки',
  'widget.missed-trades.error-open-form': 'Ошибка при открытии формы',
  'widget.backtest-trades.empty': 'Нет бэктест-сделок за этот период',

  
  'widget.images.name': 'Изображения',
  'widget.images.description': 'Карусель изображений с поддержкой загрузки',
  'widget.images.invalid-context':
    'Виджет изображений требует примечания анализа (тип: drc, weekly-review, monthly-review, quarterly-review или yearly-review)',
  'widget.images.alt-prefix': 'Изображение анализа',
  'widget.images.stacked-alt': 'Изображение анализа {index}',
  'widget.images.open-fullscreen': 'Открыть изображение {index} во весь экран',
  'widget.images.delete': 'Удалить изображение',
  'widget.images.empty': 'Нет изображений',
  'widget.images.placeholder': 'Вставьте URL изображения или путь к файлу...',
  'widget.images.placeholder-add-more': 'Добавьте больше изображений...',

  
  'widget.mark-reviewed.name': 'Отметить как проанализировано',
  'widget.mark-reviewed.description':
    'Баннер для отметки анализа как завершенного с меткой времени',
  'widget.mark-reviewed.status.reviewed': 'ПРОАНАЛИЗИРОВАНО',
  'widget.mark-reviewed.status.pending': 'ОЖИДАЕТ АНАЛИЗА',
  'widget.mark-reviewed.button.undo': 'Отменить',
  'widget.mark-reviewed.button.mark': 'Отметить как проанализировано',

  
  'widget.pnl-chart.name': 'Кривая капитала',
  'widget.pnl-chart.description': 'Совокупная прибыль/убыток во времени',
  'widget.drawdown-chart.name': 'Drawdown',
  'widget.drawdown-chart.description':
    'Closed-trade drawdown amount from the prior realized P&L high',
  'widget.directional-pnl.name': 'Directional P&L',
  'widget.directional-pnl.description': 'Long vs short performance comparison',
  'widget.directional-pnl.title.long': 'П&У длинных позиций',
  'widget.directional-pnl.title.short': 'П&У коротких позиций',
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
  'widget.account-breakdown.name': 'Account Breakdown',
  'widget.account-breakdown.description':
    'Compare performance across accounts in this review period',

  
  'widget.account-breakdown.empty': 'No closed trades for this period',
  'widget.account-breakdown.column.account': 'Account',
  'widget.account-breakdown.column.trades': 'Trades',
  'widget.account-breakdown.column.pnl': 'Net P&L',
  'widget.account-breakdown.column.win-rate': 'Win Rate',
  'widget.account-breakdown.column.profit-factor': 'Profit Factor',
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
  'widget.position-size.at-price': 'по цене ${price}',

  
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
  'widget.demon-tracker.period.this-month': 'в этом месяце',
  'widget.demon-tracker.period.this-quarter': 'в этом квартале',
  'widget.demon-tracker.period.this-year': 'в этом году',
  'widget.demon-tracker.empty.title': 'Ошибок не зафиксировано {period}',
  'widget.demon-tracker.empty.description':
    'Ошибки, отмеченные в ваших сделках, появятся здесь для выявления паттернов',
  'widget.demon-tracker.summary.unique': 'Уникальных ошибок:',
  'widget.demon-tracker.summary.total': 'Всего случаев:',
  'widget.demon-tracker.summary.critical': 'Критические (6+):',

  
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
  'widget.table.header.year': 'Год',
  'widget.table.header.trades': 'Сделки',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Win%',
  'widget.table.header.profit-factor': 'PF',
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
  'widget.trade-table.column.account': 'Account',
  'widget.trade-table.column.pnl': 'П&У',
  'widget.trade-table.column.direction': 'Направление',
  'widget.trade-table.column.setups': 'Сетапы',
  'widget.trade-table.column.mistakes': 'Ошибки',
  'widget.trade-table.empty': 'Нет сделок за период',
  'widget.trade-table.status.open': 'ОТКРЫТО',
  'widget.trade-table.na': 'Н/Д',
  'widget.trade-table.unknown': 'Неизвестно',
  'widget.trade-table.unknown-account': 'Unknown Account',
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
  'widget.pagination.weeks': 'недель',
  'widget.pagination.months': 'месяцев',

  
  'widget.empty.no-data': 'Данные недоступны',
  'widget.empty.no-trades': 'Нет сделок за период',
  'widget.empty.no-closed-trades': 'Нет закрытых сделок за этот период',
  'widget.empty.no-daily-data': 'Нет дневных данных за этот период',
  'widget.empty.no-weekly-data': 'Нет недельных данных за этот период',
  'widget.empty.no-monthly-data': 'Нет ежемесячных данных за этот период',
  'widget.empty.no-quarterly-data': 'Нет квартальных данных за этот период',
  'widget.empty.no-setup-data': 'Нет данных по сетапам за этот период',
  'widget.empty.no-mental-game-data':
    'Нет данных психологического анализа за {period}',
  'widget.empty.no-technical-game-data':
    'Нет данных технического анализа за {period}',

  
  'widget.invalid-context.title': 'Неверный контекст',
  'widget.invalid-context.default':
    'Этот виджет {widgetType} требует ревью или заметку о сделке',
  'widget.invalid-context.monthly-quarterly-yearly':
    'Этот виджет доступен только в ежемесячных, квартальных и годовых ревью',
  'widget.invalid-context.quarterly-yearly':
    'Этот виджет доступен только в квартальных и годовых ревью',
  'widget.invalid-context.yearly-only':
    'Этот виджет доступен только в годовых ревью',
  'widget.invalid-context.monthly-only':
    'Этот виджет доступен только в ежемесячных ревью',
  'widget.invalid-context.weekly-monthly':
    'Этот виджет доступен только в недельных и ежемесячных ревью',
  'widget.invalid-context.review-note':
    'Этот виджет требует заметку DRC, Weekly Review, Monthly Review, Quarterly Review или Yearly Review',

  
  'widget.pnlChart.name': 'Совокупный P&L',
  'widget.pnlChart.description': 'Линейный график совокупного P&L во времени',
  'widget.longPnLChart.name': 'P&L лонгов',
  'widget.longPnLChart.description':
    'Кривая совокупного P&L только для закрытых длинных сделок',
  'widget.shortPnLChart.name': 'P&L шортов',
  'widget.shortPnLChart.description':
    'Кривая совокупного P&L только для закрытых коротких сделок',
  'widget.performanceCalendar.name': 'Календарь производительности',
  'widget.performanceCalendar.description':
    'Представление календаря с ежедневной производительностью',
  'widget.dailyPerformance.name': 'Дневная производительность',
  'widget.dailyPerformance.description':
    'Столбчатая диаграмма P&L для каждого торгового дня',
  'widget.tradesChart.name': 'График сделок',
  'widget.tradesChart.description':
    'Столбчатая диаграмма P&L для каждой отдельной сделки',
  'widget.weekdayPerformance.name': 'Производительность по дням недели',
  'widget.weekdayPerformance.description':
    'Столбчатая диаграмма производительности для каждого дня недели',
  'widget.hourlyPerformance.name': 'Производительность по часам',
  'widget.hourlyPerformance.description':
    'Столбчатая диаграмма P&L для каждого часа дня',
  'widget.tradesChart.limit': '{count} сделок',
  'widget.drawdownChart.name': 'Drawdown Chart',
  'widget.drawdownChart.description':
    'Closed-trade drawdown amount from the prior realized P&L high',
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
  'widget.rollingWinRate.description':
    'Показывает соотношение средних прибыльных сделок к средним убыточным сделкам за скользящий период',
  'widget.rollingStats.name': 'Скользящее среднее прибыль/убыток',
  'widget.rollingStats.description':
    'Показывает среднюю прибыль и убыток за скользящий период',

  
  
  
  'account.header.title': 'Счёт: {name}',
  'account.header.add-event.aria': 'Добавить депозит/вывод средств',
  'account.header.edit-account.aria': 'Редактировать счёт',
  'account.header.view-trades.aria': 'View trades in Trade Log',
  'account.header.type': 'Тип:',
  'account.header.initial-balance': 'Начальный баланс:',
  'account.header.current-balance': 'Текущий баланс:',
  'account.header.account-id': 'ID счёта:',
  'account.header.warning.earliest-trade':
    'Первая сделка: {date}. Это может вызвать неправильные расчёты баланса.',
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
  'account.settings.section.inclusion.title':
    'Параметры включения в панель управления',
  'account.settings.section.inclusion.desc':
    'Выберите, какие типы счётов включить в расчёты панели управления. Также настройте, включаются ли выводы средств из каждого типа счёта в общие метрики выводов.',
  'account.settings.section.inclusion.include-dashboard':
    'Включить в панель управления',
  'account.settings.section.inclusion.include-withdrawals':
    'Включить выводы средств',
  'account.settings.section.inclusion.empty':
    'Нет доступных типов счётов для настройки.',
  'account.settings.section.order.title': 'Порядок отображения',
  'account.settings.section.order.desc':
    'Измените порядок отображения типов счётов на панели управления.',
  'account.settings.section.order.empty':
    'Нет доступных типов счётов для упорядочивания.',
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

  'account-page.guide.empty.intro.title': 'This page is one account in detail',
  'account-page.guide.empty.intro.description':
    'Use the Account Page to manage one account, record account events, and review the trades linked to it.',
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
  'account-page.guide.empty.trade-log.title': 'Linked trades will appear here',
  'account-page.guide.empty.trade-log.description':
    'Trades show up here when they are assigned to this account. Once you have linked trades, this page becomes your full account breakdown.',
  'account-page.guide.main.intro.title': 'This page is your account breakdown',
  'account-page.guide.main.intro.description':
    'Use the Account Page to understand one account clearly: balance history, performance, risk limits, cash movements, and linked trades.',
  'account-page.guide.main.balance-chart.title':
    'The balance chart shows the account over time',
  'account-page.guide.main.balance-chart.description':
    'Use this chart to see how the account changed over time, not just where it stands today.',
  'account-page.guide.main.metrics.title':
    'These metrics summarise this account only',
  'account-page.guide.main.metrics.description':
    'These numbers are calculated from trades linked to this account, so you can judge this account on its own.',
  'account-page.guide.main.risk.title':
    'Risk progress is tracked separately here',
  'account-page.guide.main.risk.description':
    'Use this section to see drawdown usage and profit-target progress, especially for funded or evaluation accounts with hard rules.',
  'account-page.guide.main.add-event.title':
    'Add Event records deposits and withdrawals',
  'account-page.guide.main.add-event.description':
    'Use this whenever money is added or removed outside of normal trade results, so the account history stays accurate.',
  'account-page.guide.main.edit-account.title':
    'Edit Account changes the account settings',
  'account-page.guide.main.edit-account.description':
    'This is where you update the account details and risk rules if they change over time.',
  'account-page.guide.main.transactions.title':
    'Deposits and withdrawals stay in their own section',
  'account-page.guide.main.transactions.description':
    'Each entry here can be reviewed later, so you can separate cash movements from trading performance.',
  'account-page.guide.main.trade-log.title':
    'Linked trades open the actual trade note',
  'account-page.guide.main.trade-log.description':
    'Click any linked trade to open the trade itself. This makes the account page the bridge between account-level review and individual trades.',
  
  
  
  'account-dashboard.title': 'Панель управления счётом',
  'account-dashboard.copy-badge.base': 'БАЗА',
  'account-dashboard.copy-badge.copy': 'КОПИР',
  'account-dashboard.copy-badge.copied-by': 'Копируют',
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
  'account-dashboard.action.settings': 'Параметры панели управления счётом',
  'account-dashboard.weight-bar.aria': 'Распределение AUM по типам счётов',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: {percent}% от общего AUM',
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
    'This chart tracks your combined account value over time, including deposits, withdrawals, and when accounts were added.',
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

  
  
  
  'account-card.status.breached': 'НАРУШЕНА',
  'account-card.status.in-progress': 'В ПРОЦЕССЕ',
  'account-card.status.achieved': 'ДОСТИГНУТА',
  'account-card.metric.trades': 'Сделки',
  'account-card.metric.withdrawals': 'Выводы',
  'account-card.metric.age': 'Возраст',
  'account-card.progress.profit-target': 'Цель по прибыли',
  'account-card.progress.drawdown-used': 'Drawdown Limit Used',
  'account-card.progress.not-set': 'Не установлено',
  'account-card.footer.monthly': 'Ежемесячно:',
  'account-card.footer.total-costs': 'Общие затраты:',

  
  
  
  'account.chart.event.added': 'Счёт добавлен',
  'account.chart.event.archived': 'Счёт архивирован',
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
  'account.link-modal.no-existing-found':
    'Существующие счёта не найдены. Создайте новый счёт вместо этого.',
  'account.link-modal.option.default':
    'Использовать имя по умолчанию: Счёт-{id}',
  'account.link-modal.default-name': 'Счёт-{id}',
  'account.link-modal.button.linking': 'Связывание...',
  'account.link-modal.notice.select-existing':
    'Пожалуйста, выберите существующий счёт',
  'account.link-modal.notice.failed': 'Ошибка связи счёта: {error}',

  
  
  
  'account.open-trade-log.error': 'Could not open Trade Log for this account.',
  'account.linked-trades.title': 'Связанные сделки',
  'account.linked-trades.empty-message': 'Нет сделок, связанных с этим счётом',
  'account.linked-trades.empty-submessage':
    'Сделки будут отображаться здесь после добавления на этот счёт',
  'account.linked-trades.click-to-open': 'Щёлкните, чтобы открыть сделку',
  'account.linked-trades.no-path-available': 'Путь не доступен',
  'account.linked-trades.no-path-warning':
    'Нет пути к файлу - невозможно открыть',
  'account.linked-trades.entry': 'Вход',
  'account.linked-trades.exit': 'Выход',
  'account.linked-trades.size': 'Размер',
  'account.linked-trades.setups': 'Установки',
  'account.linked-trades.mistakes': 'Ошибки',
  'account.linked-trades.tags': 'Теги',
  'account.linked-trades.reviewed': 'Проверено',
  'account.linked-trades.not-reviewed': 'Не проверено',
  'account.linked-trades.net-costs': 'Чистые затраты',
  'account.linked-trades.net-credit': 'Чистый кредит',

  
  
  
  'account.create.title': 'Создать счёт',
  'account.create.field.name': 'Имя счёта',
  'account.create.field.name-desc': 'Уникальное имя для вашего торгового счёта',
  'account.create.placeholder.name': 'Мой торговый счёт',
  'account.create.field.type': 'Тип счёта',
  'account.create.field.type-desc': 'Тип торгового счёта',
  'account.create.field.initial-balance': 'Начальный баланс',
  'account.create.field.initial-balance-desc':
    'Начальный баланс счёта (опционально, по умолчанию 0)',
  'account.create.field.live-balance': 'Текущий баланс',
  'account.create.field.live-balance-desc':
    'Текущий баланс у брокера без создания денежного движения',
  'account.create.field.creation-date': 'Дата создания',
  'account.create.field.creation-date-desc': 'Когда был создан счёт',
  'account.create.field.currency': 'Валюта',
  'account.create.field.currency-desc': 'Базовая валюта счёта для отображения',
  'account.create.field.drawdown-type': 'Тип просадки',
  'account.create.field.drawdown-type-desc':
    'Нет | Фиксированная | EOD Trailing | Ручная',
  'account.create.field.drawdown-amount': 'Размер просадки',
  'account.create.field.drawdown-amount-desc': 'Максимальный лимит просадки',
  'account.create.field.profit-target-desc':
    'Установите цель по прибыли для счёта',
  'account.create.field.monthly-cost': 'Ежемесячные расходы',
  'account.create.field.monthly-cost-desc':
    'Комиссия подписки, стоимость платформы',
  'account.create.field.target-type': 'Тип цели',
  'account.create.field.target-type-desc': 'Абсолютное или процентное значение',
  'account.create.field.target-percent': 'Цель (%)',
  'account.create.field.target-dollar': 'Цель ($)',
  'account.create.field.target-percent-desc': 'Целевой прирост в процентах',
  'account.create.field.target-dollar-desc': 'Целевая сумма в долларах',
  'account.create.field.target-date': 'Дата цели (опционально)',
  'account.create.field.target-date-desc': 'Дата достижения цели по прибыли',
  'account.create.type.demo': 'Демо',
  'account.create.type.evaluation': 'Оценка',
  'account.create.type.funded': 'Финансируемый',
  'account.create.success': 'Счёт "{name}" успешно создан',
  'account.create.error.name-required': 'Требуется имя счёта',
  'account.create.error.name-exists': 'Счёт с именем "{name}" уже существует',
  'account.create.error.balance-negative':
    'Начальный баланс не может быть отрицательным',
  'account.create.error.invalid-live-balance': 'Некорректный текущий баланс',
  'account.create.error.drawdown-required':
    'Размер просадки требуется, когда тип просадки включён',
  'account.create.error.profit-target-required':
    'Сумма цели по прибыли требуется, когда цель по прибыли включена',
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

  
  
  
  'account.risk-metrics.loading': 'Загрузка показателей риска...',
  'account.risk-metrics.title': 'Управление рисками',
  'account.risk-metrics.drawdown-used': 'Drawdown Limit Used',
  'account.risk-metrics.profit-target': 'Цель по прибыли',
  'account.risk-metrics.status.breached': 'НАРУШЕНА',
  'account.risk-metrics.status.achieved': 'ДОСТИГНУТА',
  'account.risk-metrics.status.in-progress': 'В ПРОЦЕССЕ',
  'account.risk-metrics.not-set': 'Не установлено',
  'account.risk-metrics.no-drawdown': 'Лимит просадки не установлен',
  'account.risk-metrics.no-profit-target':
    'Целевой уровень прибыли не установлен',
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
  'account.edit.field.name': 'Имя счёта',
  'account.edit.field.name-desc': 'Уникальное имя для этого счёта',
  'account.edit.placeholder.name': 'например, Мой торговый счёт',
  'account.edit.field.type': 'Тип счёта',
  'account.edit.field.type-desc': 'Тип торгового счёта',
  'account.edit.type.demo': 'Демо',
  'account.edit.type.evaluation': 'Оценка',
  'account.edit.type.funded': 'Финансируемый',
  'account.edit.field.initial-balance': 'Начальный баланс',
  'account.edit.field.initial-balance-desc': 'Начальный баланс счёта',
  'account.edit.field.live-balance': 'Текущий баланс',
  'account.edit.field.live-balance-desc':
    'Текущий баланс у брокера без создания денежного движения',
  'account.edit.field.creation-date': 'Дата создания',
  'account.edit.field.creation-date-desc': 'Когда был создан счёт',
  'account.edit.field.currency': 'Валюта',
  'account.edit.field.currency-desc': 'Базовая валюта счёта для отображения',
  'account.edit.field.drawdown-type': 'Тип просадки',
  'account.edit.field.drawdown-type-desc':
    'Нет | Фиксированная | EOD Trailing | Ручная',
  'account.edit.field.drawdown-amount': 'Размер просадки',
  'account.edit.field.drawdown-amount-desc':
    'Максимально допустимая потеря от начального баланса',
  'account.edit.field.manual-snapshots': 'Снимки просадки вручную',
  'account.edit.field.manual-snapshots-desc':
    'Управление ежедневными снимками баланса для расчёта EOD trailing просадки',
  'account.edit.field.profit-target-desc':
    'Установить целевую прибыль для счёта',
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
  'account.edit.field.monthly-cost': 'Ежемесячная стоимость',
  'account.edit.field.monthly-cost-desc':
    'Комиссии подписки, стоимость платформы',
  'account.copy-trading.error.base-account-is-copied':
    'This account is already used as a base account and cannot copy another account.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'This account is currently the base for another copy account.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'Base accounts cannot also be copy accounts.',
  'account.edit.field.target-type': 'Тип целевого уровня',
  'account.edit.field.target-type-desc': 'Абсолютный или процент',
  'account.edit.field.target-percent': 'Целевой уровень (%)',
  'account.edit.field.target-dollar': 'Целевой уровень ($)',
  'account.edit.field.target-percent-desc': 'Целевая прибыль в процентах',
  'account.edit.field.target-dollar-desc': 'Целевая сумма прибыли в долларах',
  'account.edit.field.target-date': 'Целевая дата (опционально)',
  'account.edit.field.target-date-desc': 'Дата для достижения целевой прибыли',
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
    'Also delete all trades linked to this account from my vault',
  
  
  
  'account.drawdown.none': 'Нет',
  'account.drawdown.fixed': 'Фиксированная',
  'account.drawdown.eod-trailing': 'Скользящая просадка EOD',
  'account.drawdown.manual': 'Ручная',
  'account.profit-target.enable': 'Включить целевую прибыль',
  'account.profit-target.type.absolute': 'Абсолютная сумма',
  'account.profit-target.type.percentage': 'Процент',

  
  
  
  'account.weight-legend.aria-label': 'Легенда распределения типов счёта',
  'account.weight-legend.item-aria-label': '{name}: {percent}',

  
  
  
  'account.transaction.deposit': 'Депозит',
  'account.transaction.withdrawal': 'Вывод средств',
  'account.transaction.click-to-edit':
    'Нажмите, чтобы отредактировать или удалить эту транзакцию',
  'account.transaction.description': 'Описание',
  'account.transaction.balance-after': 'Баланс после',

  
  
  
  'account.deposits-withdrawals.title': 'Депозиты и выводы средств ({count})',
  'account.deposits-withdrawals.empty':
    'Нет записанных ручных депозитов или выводов средств.',
  'account.deposits-withdrawals.empty-sub':
    'Нажмите кнопку + в заголовке, чтобы добавить первую транзакцию.',

  
  
  
  'csv.uploader.drop-here': 'Перетащите CSV/XLSX/XLS/HTML файл сюда',
  'csv.uploader.click-drag': 'Нажмите для загрузки или перетащите файл',
  'csv.uploader.hint': 'Только файлы CSV/XLSX/XLS/HTML, максимум 10 МБ',

  
  
  
  'csv.mapper.title': 'Сопоставить колонки с полями сделок',
  'csv.mapper.subtitle': 'Соответствие между колонками и полями сделок.',
  'csv.mapper.do-not-import': 'Не импортировать',
  'csv.mapper.required-badge': 'Обязательное',
  'csv.mapper.required-label': 'ОБЯЗАТЕЛЬНОЕ',
  'csv.mapper.example': 'Пример:',
  'csv.mapper.mode.title': 'Режим импорта',
  'csv.mapper.mode.help':
    'Выберите, как интерпретировать строки ручного импорта. Разбор Direct PnL будет включен на следующем этапе.',
  'csv.mapper.mode.price-based': 'По ценам (вход/выход)',
  'csv.mapper.mode.direct-pnl': 'Direct PnL',
  'csv.mapper.asset-type.help':
    'Выберите тип инструмента в файле. Это определяет обязательные поля и логику парсинга.',
  'csv.mapper.date-format.title': 'Формат даты в файле',
  'csv.mapper.date-format.help':
    'Как даты представлены в вашем файле. Важно для неоднозначных форматов, таких как 01/02/2024 (1 янв или 2 фев).',
  'csv.mapper.date-format.placeholder': 'Выберите формат даты...',
  'csv.mapper.tip.title': 'Совет: сопоставьте дополнительные поля',
  'csv.mapper.tip.desc':
    'Сопоставление дополнительных полей, таких как комиссия и прибыль_убыток, обеспечивает более полные данные сделок и повышает точность определения дубликатов.',
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
    'Мультипликатор для опционов (обычно 100) или фьючерсов',
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

  
  
  
  'csv.ai-mapper.header.title': 'Нужна помощь?',
  'csv.ai-mapper.header.description':
    'ИИ может проанализировать ваш CSV и предложить сопоставления полей (опционально)',
  'csv.ai-mapper.button.label': 'Предложить сопоставления с ИИ',
  'csv.ai-mapper.button.tooltip':
    'Использует ИИ для предложения сопоставлений колонок. Требует подключение к серверу.',
  'csv.ai-mapper.helper-text':
    'Предложения ИИ следует проверить перед импортом — всегда проверяйте сопоставления на точность.',
  'csv.ai-mapper.status.analyzing': 'Анализ структуры CSV',
  'csv.ai-mapper.status.consulting':
    'Консультация ИИ для сопоставления колонок',
  'csv.ai-mapper.status.processing': 'Обработка предложений ИИ',
  'csv.ai-mapper.status.taking-longer':
    'Работа занимает дольше обычного, но продолжается',
  'csv.ai-mapper.notice.no-suggestions':
    'ИИ не может предложить сопоставления. Сопоставьте колонки вручную.',
  'csv.ai-mapper.notice.suggested-count':
    'ИИ предложил сопоставления для {count} колонок',
  'csv.ai-mapper.notice.unavailable':
    'Сопоставление с ИИ недоступно. Сопоставьте колонки вручную или используйте сохранённый шаблон.',

  
  
  
  'csv.template-save.title': 'Сохранить шаблон импорта',
  'csv.template-save.description':
    'Сохраните эти сопоставления колонок как переиспользуемый шаблон для будущих импортов.',
  'csv.template-save.label.name': 'Название шаблона',
  'csv.template-save.placeholder.name': 'например: Мой формат брокера',
  'csv.template-save.button.save': 'Сохранить шаблон',
  'csv.template-save.button.saving': 'Сохранение...',

  'csv.template-import.title': 'Импортировать шаблон',
  'csv.template-import.description':
    'Вставьте код обмена шаблона (JTT-v1-... или JTT-v2-...) для импорта в ваше хранилище.',
  'csv.template-import.label.share-code': 'Код обмена',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',
  'csv.template-import.helper-text':
    'Шаблон будет добавлен к вашим локальным шаблонам',
  'csv.template-import.button.import': 'Импортировать шаблон',
  'csv.template-import.button.importing': 'Импортирование...',
  'csv.template-import.error.import-failed': 'Не удалось импортировать шаблон',

  'csv.template-delete.title': 'Удалить шаблон?',
  'csv.template-delete.description':
    'Вы уверены, что хотите удалить "{name}"? Это действие нельзя отменить.',
  'csv.template-delete.button.delete': 'Удалить шаблон',
  'csv.template-delete.button.deleting': 'Удаление...',

  'csv.export-template.title': 'Экспорт шаблона: {name}',
  'csv.export-template.description':
    'Поделитесь этим кодом с другими, чтобы они могли использовать конфигурацию вашего шаблона.',
  'csv.export-template.label.share-code': 'Код для публикации',
  'csv.export-template.helper-text':
    'Полный код скопирован в буфер обмена при нажатии на кнопку ниже',
  'csv.export-template.button.copied': 'Скопировано!',
  'csv.export-template.button.copy': 'Копировать в буфер обмена',

  
  
  
  'csv.broker.loading': 'Загрузка брокеров...',
  'csv.broker.loading-templates': 'Загрузка шаблонов...',
  'csv.broker.select-placeholder': 'Выберите брокера или шаблон...',
  'csv.broker.label': 'Брокер / Формат импорта',
  'csv.broker.helper-text':
    'Выберите поддерживаемого брокера или создайте собственный формат',
  'csv.broker.hidden-count': '{count} скрыто',
  'csv.broker.manage-hidden': 'Управлять скрытыми брокерами',
  'csv.broker.supported-brokers': 'Поддерживаемые брокеры',
  'csv.broker.my-templates': 'Мои шаблоны',
  'csv.broker.show-more': 'Показать ещё {count}',
  'csv.broker.show-less': 'Свернуть',
  'csv.broker.create-new': '+ Создать новый формат',
  'csv.broker.favorite-selected': 'Ваш избранный брокер выбран автоматически',
  'csv.broker.star-hint': 'Отметьте брокера, чтобы выбрать его по умолчанию',
  'csv.broker.hidden-modal-title': 'Скрытые брокеры',
  'csv.broker.no-hidden': 'Нет скрытых брокеров',
  'csv.broker.restore': 'Восстановить',
  'csv.broker.restore-all': 'Восстановить всё',
  'csv.broker.hide-aria': 'Скрыть этого брокера',
  'csv.broker.remove-favorite-aria': 'Удалить из избранного',
  'csv.broker.set-favorite-aria': 'Установить как избранное',

  
  'csv.broker.ibkr': 'Interactive Brokers (IBKR)',
  'csv.broker.tradovate': 'Tradovate',
  'csv.broker.tradezero': 'TradeZero',
  'csv.broker.tradingview': 'TradingView Paper Trading',
  'csv.broker.bybit': 'Bybit (Бессрочные контракты USDT)',
  'csv.broker.blofin': 'Blofin',
  'csv.broker.hyperliquid': 'Hyperliquid (Бессрочные контракты)',
  'csv.broker.sierrachart': 'SierraChart (Фьючерсы)',
  'csv.broker.motivewave': 'MotiveWave',
  'csv.broker.fxreplay': 'FX Replay (Analytics)',
  'csv.broker.atas': 'ATAS (Статистика в реальном времени)',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker.jdr': 'JDR Securities Limited',

  
  
  
  'csv.account-selector.loading': 'Загрузка счётов...',
  'csv.account-selector.no-accounts': 'Счета не найдены.',
  'csv.account-selector.create-account-hint':
    'Пожалуйста, создайте счёт перед импортом сделок.',
  'csv.account-selector.create-account-cta': 'Создать счёт',
  'csv.account-selector.label': 'Выбрать счёт',
  'csv.account-selector.error.load-failed': 'Не удалось загрузить счета',
  'csv.account-selector.favorite.remove': 'Удалить из избранного',
  'csv.account-selector.favorite.set': 'Установить как избранное',
  'csv.account-selector.show-less': 'Показать меньше',
  'csv.account-selector.show-more': 'Показать ещё {count}',
  'csv.account-selector.favorite.auto-selected':
    'Ваше избранное автоматически выбрано',
  'csv.account-selector.favorite.star-hint':
    'Отметьте звёздочкой счёт, чтобы выбрать его автоматически',

  
  'csv.preview-first-note':
    'Preview is free. Importing into your vault requires PRO activation.',
  'csv.preview.header-row.title': 'Выбор строки заголовка',
  'csv.preview.header-row.help':
    'Если первая строка — это заголовок раздела, выберите строку с реальными названиями колонок.',
  'csv.preview.header-row.label': 'Строка заголовка',
  'csv.preview.header-row.range': 'Выберите строку от 1 до {max}.',
  'csv.preview.header-row.preview': 'Предпросмотр выбранного заголовка:',
  'csv.gate.import.title': 'PRO required to import',
  'csv.gate.import.description':
    'Importing trades into your vault is a PRO feature. Activate PRO to continue.',
  'csv.gate.templates.tooltip': 'PRO required (activate to use templates).',
  'csv.gate.ai.tooltip': 'PRO required (activate to use AI mapping).',

  
  
  
  'csv.results.import-successful': 'Импорт успешен!',
  'csv.results.successfully-imported-prefix': 'Успешно импортировано ',
  'csv.results.successfully-imported-suffix': ' сделок',
  'csv.results.skipped-duplicates-prefix': 'Пропущено ',
  'csv.results.skipped-duplicates-suffix': ' дублирующихся сделок',
  'csv.results.failed-to-import-prefix': 'Не удалось импортировать ',
  'csv.results.failed-to-import-suffix': ' строк (см. детали ниже)',
  'csv.results.failed-rows-title': 'Ошибки при импорте:',
  'csv.results.import-failed': 'Ошибка импорта',
  'csv.results.import-error-generic': 'Ошибка при импорте',
  'csv.results.additional-errors': 'Дополнительные ошибки:',
  'csv.results.button.view-account': 'Просмотреть счёт',
  'csv.results.button.import-another': 'Импортировать другой CSV',
  'csv.results.button.try-again': 'Повторить попытку',
  'csv.results.complete': 'Импорт завершён',
  'csv.results.failed': 'Импорт не выполнен',
  'csv.results.broker': 'Брокер: {broker}',
  'csv.results.manual-import': 'Ручной импорт',
  'csv.results.preview-header':
    'Недавно импортированные сделки (показано {shown} из {total})',
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  'csv.errors.copy-shareable': 'Скопировать отчёт для отправки',
  'csv.errors.copy-report': 'Скопировать отчёт',
  'csv.errors.copy-detailed': 'Скопировать подробный отчёт',
  'csv.errors.copied': 'Скопировано',
  'csv.errors.rows': 'Строки: {rows}',
  'csv.errors.suggestion': 'Рекомендация: ',
  'csv.errors.example': 'Пример: ',
  'csv.errors.raw-errors': 'Сырые ошибки',
  'csv.errors.raw-errors-limit': 'Показаны первые {shown} из {total} ошибок',

  'csv.errors.group.missing-value':
    'Отсутствует обязательное значение — {field} (столбец "{column}")',
  'csv.errors.group.missing-column':
    'Отсутствует обязательный столбец — {field} (столбец "{column}")',
  'csv.errors.group.invalid-date':
    'Не удалось распарсить дату (столбец "{column}")',
  'csv.errors.group.invalid-number':
    'Некорректное число — {field} (столбец "{column}")',
  'csv.errors.group.invalid-direction':
    'Некорректное направление (столбец "{column}")',
  'csv.errors.group.template-missing-mappings':
    'В шаблоне отсутствуют обязательные сопоставления столбцов',
  'csv.errors.group.batch-parsing-failed': 'Ошибка пакетного разбора',
  'csv.errors.group.no-valid-rows':
    'Не удалось импортировать корректные строки',
  'csv.errors.group.no-trades-parsed': 'Не удалось распознать сделки',
  'csv.errors.group.close-only': 'Пропущены исполнения только для закрытия',
  'csv.errors.group.other': 'Другие ошибки',

  'csv.errors.suggestion.select-date-format':
    'Выберите формат даты на шаге сопоставления и повторите импорт.',
  'csv.errors.suggestion.fix-numbers':
    'Проверьте, что значения в столбце — числа (без текста) и сопоставлен правильный столбец.',
  'csv.errors.suggestion.fix-direction':
    'Убедитесь, что значения направления — Buy/Sell (или сопоставьте правильный столбец).',
  'csv.errors.suggestion.check-mapping':
    'Проверьте сопоставление столбцов и убедитесь, что обязательные поля сопоставлены.',
  'csv.errors.suggestion.check-broker':
    'Убедитесь, что выбран правильный брокер/шаблон для этого CSV.',
  'csv.errors.suggestion.check-raw-errors':
    'Откройте «Сырые ошибки», чтобы увидеть точные сообщения и номера строк.',

  
  'csv.report.title.shareable': 'Импорт CSV Journalit — отчёт для отправки',
  'csv.report.title.detailed': 'Импорт CSV Journalit — подробный отчёт',
  'csv.report.time': 'Время: {time}',
  'csv.report.plugin-version': 'Версия плагина: {version}',
  'csv.report.file': 'Файл: {file}',
  'csv.report.account': 'Счёт: {account}',
  'csv.report.broker': 'Брокер: {broker}',
  'csv.report.template': 'Шаблон: {name}',
  'csv.report.csv-rows': 'Строк CSV: {count}',
  'csv.report.asset-type': 'Тип актива: {type}',
  'csv.report.date-format': 'Формат даты: {format}',
  'csv.report.header-row': 'Строка заголовка: {row}',
  'csv.report.result': 'Результат: {result}',
  'csv.report.imported': 'Импортировано: {count}',
  'csv.report.updated': 'Обновлено: {count}',
  'csv.report.duplicates': 'Дубликаты: {count}',
  'csv.report.skipped-incomplete': 'Skipped incomplete rows: {count}',
  'csv.report.errors': 'Ошибок: {count}',
  'csv.report.custom-field-warnings':
    'Предупреждения по пользовательским полям: {count}',
  'csv.report.sanitized-note':
    'Примечание: это отчёт для отправки. Он может не содержать конфиденциальных деталей.',
  'csv.report.top-issues': 'Основные проблемы:',
  'csv.report.issue-groups': 'Группы проблем:',
  'csv.report.raw-custom-field-warnings':
    'Предупреждения по пользовательским полям:',
  'csv.report.raw-errors': 'Сырые ошибки:',
  'csv.report.more-errors': '...и ещё {count} ошибок',

  
  
  
  'csv.incomplete-options.title': 'Обнаружены неполные данные опциона',
  'csv.incomplete-options.desc-single':
    'Опционная сделка не содержит требуемых метаданных:',
  'csv.incomplete-options.desc-plural':
    '{count} опционных сделок не содержат требуемых метаданных:',
  'csv.incomplete-options.missing-strike-single': 'сделка без цены страйк',
  'csv.incomplete-options.missing-strike-plural': 'сделок без цены страйк',
  'csv.incomplete-options.missing-expiry-single': 'сделка без даты экспирации',
  'csv.incomplete-options.missing-expiry-plural': 'сделок без даты экспирации',
  'csv.incomplete-options.missing-option-type-single':
    'сделка без типа опциона (колл/пут)',
  'csv.incomplete-options.missing-option-type-plural':
    'сделок без типа опциона (колл/пут)',
  'csv.incomplete-options.impact-desc':
    'Эти сделки будут импортированы без полных данных опционов, что может повлиять на:',
  'csv.incomplete-options.impact-analytics': 'Аналитику и фильтрацию',
  'csv.incomplete-options.impact-pl': 'Расчёты P&L',
  'csv.incomplete-options.impact-accuracy': 'Точность торгового журнала',
  'csv.incomplete-options.import-anyway': 'Импортировать в любом случае',
  'csv.incomplete-options.cancel-import': 'Отмена импорта',

  
  
  
  'csv.image-review.title': 'Проверка ссылок на изображения',
  'csv.image-review.summary':
    'Найдено {imageCount} ссылок на изображения в {tradeCount} сделках.',
  'csv.image-review.rows': 'Строки: {rows}',
  'csv.image-review.count': '{count} изображений',
  'csv.image-review.import-images': 'Импортировать изображения',
  'csv.image-review.discard-all': 'Удалить все изображения',
  'csv.image-review.discard-confirmation':
    'Удалить все ссылки на изображения для этого импорта? Сделки будут импортированы без изображений.',
  'csv.image-review.confirm-discard': 'Да, удалить всё',

  
  
  
  'csv.unmapped-symbols.title': 'Обнаружены неопознанные символы',
  'csv.unmapped-symbols.desc-singular':
    'В вашем импорте найден символ без технических характеристик инструмента:',
  'csv.unmapped-symbols.desc-plural':
    'В вашем импорте найдено {count} символов без технических характеристик инструмента:',
  'csv.unmapped-symbols.map-label': 'Сопоставить базовому тикеру:',
  'csv.unmapped-symbols.placeholder': 'например, ES, NQ, GC',
  'csv.unmapped-symbols.warning':
    'Сопоставьте эти символы встроенным или пользовательским тикерам. Без технических характеристик в сделках не будут точно рассчитаны размеры тиков, стоимость пункта и P&L.',
  'csv.unmapped-symbols.validation.not-found':
    'Символ "{symbol}" не найден в характеристиках {assetType} или пользовательских тикерах',
  'csv.unmapped-symbols.notice.fix-errors':
    'Пожалуйста, исправьте ошибки проверки перед сохранением',
  'csv.unmapped-symbols.notice.save-failed':
    'Не удалось сохранить сопоставления',
  'csv.unmapped-symbols.button.saving': 'Сохранение...',
  'csv.unmapped-symbols.button.save': 'Сохранить сопоставления',
  'csv.unmapped-symbols.button.skip': 'Пропустить',

  
  
  
  'csv.title': 'Импорт сделок из CSV',
  'csv.subtitle':
    'Загрузите CSV-файл вашего брокера, чтобы импортировать сделки в журнал.',
  'csv.how-to-export': 'Как экспортировать из вашего брокера',
  'csv.processing-file': 'Обработка файла импорта...',
  'csv.importing-trades': 'Импорт сделок на счёт...',
  'csv.format': 'Формат импорта: ',
  'csv.asset-type': 'Тип инструмента',
  'csv.asset-type-desc':
    'Выберите тип инструмента в этом CSV-файле. Это определяет технические характеристики контракта и правила проверки.',

  
  'csv.button.export-template': 'Экспортировать шаблон',
  'csv.button.delete-template': 'Удалить шаблон',
  'csv.button.import-template': 'Импортировать шаблон',
  'csv.button.import-rows': 'Импортировать {count} строк',
  'csv.button.edit-format': 'Редактировать формат',
  'csv.button.continue-mapping': 'Перейти к сопоставлению колонок',
  'csv.button.update-template': 'Обновить шаблон',
  'csv.button.save-template': 'Сохранить как шаблон',
  'csv.button.back': 'Назад',
  'csv.button.import-another': 'Импортировать другой файл',
  'csv.button.view-account': 'Просмотреть на счёте',

  
  
  
  
  'csv.broker-guide.tradovate.step-1':
    'Откройте вкладку "Reports" на веб-сайте Tradovate',
  'csv.broker-guide.tradovate.step-2':
    'Нажмите на вкладку "Orders" (НЕ вкладка Performance)',
  'csv.broker-guide.tradovate.step-3': 'Нажмите кнопку "Download CSV"',
  'csv.broker-guide.tradovate.warning.emphasis': 'Важно:',
  'csv.broker-guide.tradovate.warning.message':
    'Используйте только вкладку Orders. Вкладка Performance не совместима.',
  'csv.broker-guide.tradovate.doc-label': 'Просмотреть подробное руководство',

  
  'csv.broker-guide.ibkr.description':
    'Требуется единовременная настройка Flex Query',
  'csv.broker-guide.ibkr.step-1':
    'Перейдите в раздел Performance & Statements → Reports → Flex Queries',
  'csv.broker-guide.ibkr.step-2':
    'Создайте новый запрос "Trade Confirmation" (выберите Orders, отключите Executions)',
  'csv.broker-guide.ibkr.step-3':
    'Установите формат: CSV, дата "yyyyMMdd", время "HHmmss"',
  'csv.broker-guide.ibkr.step-4': 'Выполните запрос и скачайте CSV-файл',
  'csv.broker-guide.ibkr.warning.emphasis': 'Используйте Orders',
  'csv.broker-guide.ibkr.warning.message':
    '(не Executions) с определённым форматом даты/времени',
  'csv.broker-guide.ibkr.doc-label':
    'Просмотреть подробное руководство по настройке',

  
  'csv.broker-guide.tradezero.step-1':
    'Экспортируйте CSV-файл с платформы TradeZero',
  'csv.broker-guide.tradezero.step-2':
    'Убедитесь, что файл в формате CSV (НЕ XLSX)',
  'csv.broker-guide.tradezero.step-3': 'Импортируйте файл ниже',
  'csv.broker-guide.tradezero.warning.emphasis':
    'Поддерживается только формат CSV.',
  'csv.broker-guide.tradezero.warning.message':
    'Файлы Excel (XLSX) не подходят.',
  'csv.broker-guide.tradezero.doc-label': 'Просмотреть инструкции по экспорту',

  
  'csv.broker-guide.tradingview.description': 'Только демо-торговля',
  'csv.broker-guide.tradingview.step-1':
    'Нажмите на тип брокера "Paper Trading" в TradingView',
  'csv.broker-guide.tradingview.step-2': 'Нажмите кнопку "Export data..."',
  'csv.broker-guide.tradingview.step-3':
    'Выберите "Order History" из выпадающего меню',
  'csv.broker-guide.tradingview.warning.emphasis': 'Используйте Order History.',
  'csv.broker-guide.tradingview.warning.message':
    'Другие типы экспорта (например, Positions или Orders) не подходят для импорта.',
  'csv.broker-guide.tradingview.doc-label': 'Просмотреть подробное руководство',

  
  'csv.broker-guide.bybit.description': 'История сделок USDT Perpetuals',
  'csv.broker-guide.bybit.step-1':
    'Перейдите в Bybit → Orders → USDT Perpetual → Trade History',
  'csv.broker-guide.bybit.step-2':
    'Нажмите кнопку "Export" и выберите диапазон дат',
  'csv.broker-guide.bybit.step-3':
    'Загрузите файл CSV Trade History (НЕ Closed P&L)',
  'csv.broker-guide.bybit.warning.emphasis':
    'Используйте экспорт Trade History.',
  'csv.broker-guide.bybit.warning.message':
    'Экспорт Closed P&L не содержит данные комиссий и отдельные исполнения.',
  'csv.broker-guide.bybit.doc-label': 'Просмотреть инструкции по экспорту',

  
  'csv.broker-guide.blofin.description':
    'Экспорт истории ордеров Blofin (только веб-сайт)',
  'csv.broker-guide.blofin.step-1':
    'Перейдите в Assets → Order Center → Order History',
  'csv.broker-guide.blofin.step-2':
    'Нажмите Download, выберите Futures и диапазон дат (макс. 180 дней)',
  'csv.broker-guide.blofin.step-3':
    'Нажмите Export и ждите уведомления о готовности',
  'csv.broker-guide.blofin.warning.emphasis': 'Только веб-сайт.',
  'csv.broker-guide.blofin.warning.message':
    'Мобильное приложение не поддерживает экспорт. Файлы доступны в течение 30 дней после экспорта.',
  'csv.broker-guide.blofin.doc-label': 'Просмотреть инструкции по экспорту',

  
  'csv.broker-guide.hyperliquid.description': 'История сделок Perpetuals',
  'csv.broker-guide.hyperliquid.step-1': 'Подключите кошелек в Hyperliquid',
  'csv.broker-guide.hyperliquid.step-2':
    'Нажмите на вкладку "Trade history" в нижней части страницы',
  'csv.broker-guide.hyperliquid.step-3': 'Нажмите кнопку "Export to CSV"',
  'csv.broker-guide.hyperliquid.warning.emphasis': 'Лимит 10 000 записей.',
  'csv.broker-guide.hyperliquid.warning.message':
    'Экспортируйте регулярно - сделки, выходящие за лимит 10 000 записей, не могут быть загружены.',
  'csv.broker-guide.hyperliquid.doc-label':
    'Просмотреть инструкции по экспорту',

  
  'csv.broker-guide.sierrachart.description': 'Экспорт списка сделок фьючерсов',
  'csv.broker-guide.sierrachart.step-1':
    'Откройте Trade Activity Log (Trade → Trade Activity Log или Ctrl+Shift+A)',
  'csv.broker-guide.sierrachart.step-2':
    'Нажмите на вкладку "Trades" в верхней части окна',
  'csv.broker-guide.sierrachart.step-3':
    'Установите диапазон дат через кнопку [DisplaySettings], если необходимо',
  'csv.broker-guide.sierrachart.step-4':
    'Перейдите в File → Save Log As и сохраните как .txt файл',
  'csv.broker-guide.sierrachart.warning.emphasis':
    'Используйте "Save Log As", а не "Export".',
  'csv.broker-guide.sierrachart.warning.message':
    'Опция Export сохраняет нескорректированные цены. Save Log As сохраняет цены, как они отображаются.',
  'csv.broker-guide.sierrachart.doc-label':
    'Просмотреть документацию SierraChart',

  
  'csv.broker-guide.motivewave.description':
    'Экспортируйте исполнения из панели Account в MotiveWave.',
  'csv.broker-guide.motivewave.step-1':
    'Откройте панель Account и выберите вкладку Executions',
  'csv.broker-guide.motivewave.step-2':
    'Нажмите значок Export to CSV над списком исполнений',
  'csv.broker-guide.motivewave.step-3':
    'При необходимости задайте диапазон "Export Executions Since"',
  'csv.broker-guide.motivewave.step-4':
    'Сохраните CSV-файл и импортируйте его здесь',
  'csv.broker-guide.motivewave.warning.emphasis': 'Примечание:',
  'csv.broker-guide.motivewave.warning.message':
    'Некоторые брокеры предоставляют ограниченную историю исполнений. Экспортируйте регулярно или используйте портал брокера для более старых сделок.',
  'csv.broker-guide.motivewave.doc-label':
    'Просмотреть документацию MotiveWave',

  
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
    'Экспорт статистики → вкладка Journal (сопоставленные сделки)',
  'csv.broker-guide.atas.step-1':
    'В ATAS откройте вкладку Statistics и выберите RealTime или History (при необходимости задайте период)',
  'csv.broker-guide.atas.step-2':
    'Нажмите значок шестерёнки (вверху справа) и выберите “Export statistics”',
  'csv.broker-guide.atas.step-3':
    'Загрузите экспортированный XLSX здесь и выберите ATAS в списке брокеров',
  'csv.broker-guide.atas.warning.emphasis': 'Важно:',
  'csv.broker-guide.atas.warning.message':
    'Не редактируйте экспортированный файл. Journalit сохраняет границы сделок из листа “Journal” и, при наличии данных, дополняет комиссию по совпадающим исполнениям из листа “Executions”.',
  'csv.broker-guide.atas.doc-label': 'Открыть инструкции по экспорту ATAS',

  
  'csv.broker-guide.rithmic.description':
    'Экспорт из R | Trader Pro через Order History / Completed Orders.',
  'csv.broker-guide.rithmic.step-1':
    'Откройте Order History в R | Trader Pro и отфильтруйте Completed/Filled по счёту и дате',
  'csv.broker-guide.rithmic.step-2':
    'В Add/Remove Columns включите Side, Symbol, Qty Filled, Avg Fill Price и Fill/Update Time',
  'csv.broker-guide.rithmic.step-3':
    'Нажмите значок Export/Clipboard, сохраните CSV, загрузите его сюда и выберите Rithmic',
  'csv.broker-guide.rithmic.warning.emphasis': 'Важно:',
  'csv.broker-guide.rithmic.warning.message':
    'Rithmic экспортирует только видимые столбцы (и часто только один день за раз). Отсутствующие столбцы могут сломать импорт.',
  'csv.broker-guide.rithmic.doc-label':
    'Открыть руководство по экспорту R | Trader Pro',

  
  'csv.broker-guide.jdr.description':
    'Экспорт HTML-отчёта MetaTrader (отчёт в стиле MT4).',
  'csv.broker-guide.jdr.step-1':
    'В терминале JDR MetaTrader откройте вкладку История счёта / History за нужный период',
  'csv.broker-guide.jdr.step-2':
    'Щёлкните правой кнопкой мыши по таблице истории и выберите Save as Report, чтобы сохранить HTML/HTM-отчёт',
  'csv.broker-guide.jdr.step-3':
    'Загрузите экспортированный HTML-отчёт сюда и выберите JDR Securities Limited',
  'csv.broker-guide.jdr.warning.emphasis': 'Важно:',
  'csv.broker-guide.jdr.warning.message':
    'Используйте именно HTML-отчёт. Отложенные/отменённые ордера игнорируются автоматически, а HTML-отчёты MT5 пока не поддерживаются.',
  'csv.broker-guide.jdr.doc-label': 'Открыть руководства по экспорту брокеров',

  
  
  
  'csv.date-format.auto-detect':
    'Автоопределение (рекомендуется для ISO/стандартных форматов)',
  'csv.date-format.us-date': 'US Date: 12/25/2024 (Schwab, Fidelity, E*TRADE)',
  'csv.date-format.us-datetime': 'US DateTime: 12/25/2024 14:30:00 (Webull)',
  'csv.date-format.us-short': 'US Short: 1/5/2024 (TradeZero)',
  'csv.date-format.us-short-datetime': 'US Short DateTime: 1/5/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'ISO DateTime: 2024-12-25 14:30:00 (Bybit, Tradovate)',
  'csv.date-format.iso-date': 'ISO Date: 2024-12-25 (Interactive Brokers)',
  'csv.date-format.eu-date': 'EU Date: 25/12/2024 (день/месяц/год)',
  'csv.date-format.eu-datetime': 'EU DateTime: 25/12/2024 14:30:00',
  'csv.date-format.eu-dash': 'EU Dash: 25-12-2024',
  'csv.date-format.eu-dash-datetime': 'EU Dash DateTime: 25-12-2024 14:30:00',

  
  
  
  'home.widget.recent-items.name': 'Недавние файлы',
  'home.widget.recent-items.description':
    'Показывает недавно открытые файлы и представления',
  'home.widget.year-heatmap.name': 'Тепловая карта торговли',
  'home.widget.year-heatmap.description':
    'Календарь, показывающий вашу торговую активность за год',
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
  'home.widget.weekly-summary.name': 'Еженедельная сводка',
  'home.widget.weekly-summary.description':
    'Метрики текущей недели с графиком дневного P&L',
  'home.widget.position-size.name': 'Калькулятор размера позиции',
  'home.widget.position-size.description':
    'Расчет размера позиции на основе процента риска счета',
  'home.widget.embedded-note.name': 'Встроенная заметка',
  'home.widget.embedded-note.description':
    'Отображение любой заметки в формате markdown из вашего хранилища',
  'home.widget.current-streak.name': 'Текущая серия',
  'home.widget.current-streak.description':
    'Отслеживание серий побед и поражений',
  'home.widget.best-hours.name': 'Лучшие часы',
  'home.widget.best-hours.description':
    'Узнайте, когда вы лучше всего торгуете в течение дня',
  'home.widget.setup-leaderboard.name': 'Топ-разбивка',
  'home.widget.setup-leaderboard.description':
    'Сравнивайте лучшие сетапы, теги, типы активов и тикеры',
  'home.widget.unreviewed-trades.name': 'Непроверенные сделки',
  'home.widget.unreviewed-trades.description':
    'Сделки, требующие вашего анализа',
  'home.widget.goals-progress.name': 'Прогресс целей',
  'home.widget.goals-progress.description':
    'Отслеживание прогресса достижения вашей торговой цели',
  'home.widget.trading-score.name': 'Торговый рейтинг',
  'home.widget.trading-score.description':
    'Комплексный показатель эффективности с визуализацией лепестковой диаграммы',
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description':
    'Общие активы под управлением с графиком тренда за 7 дней',
  'home.widget.drawdown-monitor.name': 'Монитор просадки',
  'home.widget.drawdown-monitor.description':
    'Отслеживание статуса просадки по счетам с настроенными лимитами',

  
  
  
  'home.quick-links.hide': 'Скрыть быструю ссылку',
  'home.quick-links.all-hidden':
    'Все быстрые ссылки скрыты. Используйте «Добавить виджет» для их восстановления.',
  'home.quick-links.add-trade': 'Добавить сделку',
  'home.quick-links.trade-log': 'Журнал сделок',
  'home.quick-links.trading-dashboard': 'Торговый кабинет',
  'home.quick-links.account-dashboard': 'Кабинет счета',
  'home.quick-links.todays-drc': 'Дневной анализ',
  'home.quick-links.weekly-review': 'Недельный анализ',
  'home.quick-links.monthly-review': 'Месячный анализ',
  'home.quick-links.quick-import': 'Quick Import',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'Построитель макета',
  'home.quick-links.move-above': 'Переместить быстрые ссылки выше виджетов',
  'home.quick-links.move-below': 'Переместить быстрые ссылки ниже виджетов',

  
  
  
  'home.widget-selector.title': 'Добавить на главную',
  'home.widget-selector.section.widgets': 'Виджеты',
  'home.widget-selector.section.quick-links': 'Скрытые быстрые ссылки',
  'home.widget-selector.restore': 'восстановить',
  'home.widget-selector.empty': 'Все виджеты добавлены',
  'home.widget-selector.hint.navigate': '↑↓ навигация',
  'home.widget-selector.hint.select': '↵ выбор',
  'home.widget-selector.hint.close': 'esc закрыть',

  
  
  
  'home.period.month': 'Этот месяц',
  'home.period.quarter': 'Этот квартал',
  'home.period.year': 'Этот год',
  'home.period.lifetime': 'Всё время',
  'home.aria.filter-period': 'Фильтр по периоду',
  'home.aria.filter-trade-types': 'Фильтр по типам сделок',
  'home.aria.add-widget': 'Добавить виджет',
  'home.aria.save-layout': 'Сохранить макет',
  'home.aria.customize': 'Настроить',
  'home.button.add-widget': 'Добавить виджет',
  'home.trade-types.all': 'Обычные + бэктест',

  
  
  
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
  'home.greeting.hey-there': 'Привет',
  'home.greeting.good-to-see-you': 'Рады тебя видеть',

  
  
  
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
  'home.widget.embedded-note.select-different': 'Выбрать другую заметку',
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
  'home.widget.best-hours.period-aria': '{label}: {pnl} P&L, {count} сделок',
  'home.widget.best-hours.trades-count': '{count} сделок',
  'home.widget.best-hours.win-rate': '{rate}% побед',

  
  
  
  'home.widget.aum.title': 'AUM',
  'home.widget.aum.period.month': 'В этом месяце',
  'home.widget.aum.period.quarter': 'В этом квартале',
  'home.widget.aum.period.year': 'В этом году',
  'home.widget.aum.period.all': 'За всё время',
  'home.widget.aum.unable-to-load': 'Не удалось загрузить',
  'home.widget.aum.no-accounts': 'Нет счетов',
  'home.widget.aum.account-count': '{count} счёт',
  'home.widget.aum.account-count-plural': '{count} счетов',

  
  
  
  'home.widget.streak.title': 'Серия',
  'home.widget.streak.period.month': 'в этом месяце',
  'home.widget.streak.period.quarter': 'в этом квартале',
  'home.widget.streak.period.year': 'в этом году',
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

  
  
  
  'home.widget.drawdown.title': 'Drawdown Limit',
  'home.widget.drawdown.breached': 'Превышен',
  'home.widget.drawdown.remaining': 'осталось',
  'home.widget.drawdown.unable-to-load': 'Не удалось загрузить',
  'home.widget.drawdown.no-accounts': 'Нет счетов с лимитами',

  
  
  
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
  'home.widget.setups.title': 'Топ сетапы',
  'home.widget.setups.no-data': 'Сетапы ещё не записаны',
  'home.widget.setups.trades-count': '{count} сделок',
  'home.widget.setups.win-rate': '{rate}% побед',

  
  
  
  'home.widget.weekly.title': 'На этой неделе',
  'home.widget.weekly.no-trades': 'на этой неделе сделок ещё нет',
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

  
  
  

  
  'weekly.tab.preparation': 'Подготовка',
  'weekly.tab.overview': 'Обзор',
  'weekly.tab.review': 'Отчёт',

  
  'weekly.review.drcs.title': 'Ежедневные отчёты за эту неделю',
  'weekly.review.drcs.empty': 'Ежедневные отчёты за эту неделю не найдены',
  'weekly.review.drcs.empty-sub':
    'Ежедневные отчёты появятся здесь после их создания',
  'weekly.review.drcs.mental': 'Психология',
  'weekly.review.drcs.technical': 'Техника',
  'weekly.review.drcs.view-button': 'Просмотр дневного анализа',
  'weekly.review.drcs.no-answer': 'Ответ не предоставлен',

  
  'weekly.review.performance.title': 'Самооценка результатов',
  'weekly.review.performance.mental': 'Психологическое состояние',
  'weekly.review.performance.mental-placeholder':
    'Заметки о вашем психологическом состоянии...',
  'weekly.review.performance.technical': 'Техническое исполнение',
  'weekly.review.performance.technical-placeholder':
    'Заметки о вашем техническом исполнении...',

  
  'weekly.review.questions.title': 'Вопросы еженедельного обзора',
  'weekly.review.questions.empty': 'Вопросы для обзора не настроены',
  'weekly.review.questions.empty-sub':
    'Добавьте вопросы для обзора во вкладке настроек еженедельного обзора',
  'weekly.review.questions.answer-placeholder': 'Ваш ответ здесь...',
  'weekly.review.questions.settings-hint':
    'Вопросы для обзора можно настроить во вкладке настроек еженедельного обзора.',

  
  'weekly.review.goals.title': 'Цели на следующую неделю',
  'weekly.review.goals.empty': 'Цели на следующую неделю не установлены',
  'weekly.review.goals.empty-sub':
    'Определите чёткие цели для фокусировки в торговле',
  'weekly.review.goals.add-placeholder': 'Добавить цель на следующую неделю',
  'weekly.review.goals.add-button': 'Добавить цель',

  
  'weekly.preparation.goals.title': 'Цели недели',
  'weekly.preparation.goals.empty': 'Нет целей с предыдущей недели',

  
  'weekly.preparation.events.title': 'Ключевые события',
  'weekly.preparation.events.colour': 'Цвет:',
  'weekly.preparation.events.day': 'День:',
  'weekly.preparation.events.day-none': 'Не указано (необязательно)',
  'weekly.preparation.events.notes-placeholder': 'Заметки об этом событии',
  'weekly.preparation.events.add-button': 'Добавить событие',
  'weekly.preparation.events.event-label': 'Событие',
  'weekly.preparation.events.event-placeholder':
    'Выберите или создайте событие',
  'weekly.preparation.events.empty': 'Ключевые события не добавлены',
  'weekly.preparation.events.sub-empty':
    'Добавьте важные рыночные события, которые могут повлиять на вашу торговлю',

  
  'weekly.preparation.forecast.title': 'Прогноз на неделю',

  
  'weekly.overview.pnl-chart.title': 'Накопительный P&L за неделю',
  'weekly.overview.pnl-chart.empty': 'Нет данных P&L для отображения',
  'weekly.overview.pnl-chart.empty-sub':
    'Ваша накопительная прибыль/убыток появится здесь после фиксации закрытых сделок',

  
  'weekly.overview.drawdown-chart.title': 'Просадка за неделю',
  'weekly.overview.drawdown-chart.empty':
    'Нет данных о просадке для отображения',
  'weekly.overview.drawdown-chart.empty-sub':
    'Ваши показатели просадки появятся здесь после фиксации закрытых сделок',

  
  'weekly.overview.performance.title': 'Результаты недели',

  
  'weekly.overview.metrics.net-pnl': 'Чистый P&L',
  'weekly.overview.metrics.win-rate': 'Винрейт',
  'weekly.overview.metrics.profit-factor': 'Профит-фактор',
  'weekly.overview.metrics.expectancy': 'Матожидание',
  'weekly.overview.metrics.total-trades': 'Всего сделок',
  'weekly.overview.metrics.avg-win': 'Средняя прибыль',
  'weekly.overview.metrics.avg-loss': 'Средний убыток',
  'weekly.overview.metrics.pl-ratio': 'Коэф. P/L',

  
  'weekly.overview.setup-performance.title': 'Результаты по сетапам',
  'weekly.overview.setup-performance.col-setup': 'Сетап',
  'weekly.overview.setup-performance.col-pnl': 'P&L',
  'weekly.overview.setup-performance.col-win-rate': 'Винрейт',
  'weekly.overview.setup-performance.col-trades': 'Сделки',
  'weekly.overview.setup-performance.empty': 'Нет данных по сетапам',
  'weekly.overview.setup-performance.empty-sub':
    'Добавьте теги сетапов к сделкам, чтобы увидеть метрики по каждому сетапу',

  
  'weekly.overview.trades-chart.title': 'Сделки недели',
  'weekly.overview.trades-chart.empty': 'Нет сделок за эту неделю',
  'weekly.overview.trades-chart.empty-sub':
    'Отслеживайте свои сделки, чтобы увидеть их визуализацию здесь',

  
  'weekly.overview.best-trade.title': 'Лучшая сделка недели',
  'weekly.overview.best-trade.empty': 'Нет прибыльных сделок на этой неделе',
  'weekly.overview.best-trade.empty-sub':
    'Ваши лучшие сделки появятся здесь после фиксации прибыльных позиций',
  'weekly.overview.worst-trade.title': 'Худшая сделка недели',
  'weekly.overview.worst-trade.empty': 'Нет убыточных сделок на этой неделе',
  'weekly.overview.worst-trade.empty-sub':
    'Ваши наименее успешные сделки появятся здесь, чтобы помочь вам учиться и совершенствоваться',

  
  'weekly.overview.daily-performance.title': 'Ежедневные результаты',
  'weekly.overview.daily-performance.col-date': 'Дата',
  'weekly.overview.daily-performance.col-trades': 'Сделки',
  'weekly.overview.daily-performance.col-win-rate': 'Винрейт',
  'weekly.overview.daily-performance.col-profit-factor': 'Профит-фактор',
  'weekly.overview.daily-performance.col-pnl': 'P&L',
  'weekly.overview.daily-performance.empty': 'Нет сделок за эту неделю',
  'weekly.overview.daily-performance.empty-sub':
    'Ваши ежедневные результаты появятся здесь после фиксации сделок',

  
  'weekly.overview.trade.unknown': 'Неизвестно',
  'weekly.overview.trade.na': 'Н/Д',
  'weekly.overview.trade.label-date': 'Дата:',
  'weekly.overview.trade.label-setup': 'Сетап:',
  'weekly.overview.trade.label-duration': 'Длительность:',
  'weekly.overview.trade.label-tags': 'Теги:',
  'weekly.overview.trade.label-mistakes': 'Ошибки:',
  'weekly.overview.trade.duration-format': '{hours}ч {minutes}м',

  
  'weekly.overview.button.create-trade': 'Создать сделку',
  'weekly.overview.button.view-trade-details': 'Просмотр деталей сделки',

  
  
  

  
  'monthly.tab.overview': 'Обзор',
  'monthly.tab.review': 'Анализ',

  
  'monthly.review.demon-tracker.title': 'Трекер ошибок',
  'monthly.review.demon-tracker.description':
    'Отслеживайте повторяющиеся ошибки, чтобы выявить закономерности и улучшить торговую дисциплину.',
  'monthly.review.demon-tracker.column.demon': 'ОШИБКА',
  'monthly.review.demon-tracker.column.stop-trading': 'СТОП ТРЕЙДИНГ',
  'monthly.review.demon-tracker.summary.unique-mistakes':
    'Всего уникальных ошибок:',
  'monthly.review.demon-tracker.summary.total-occurrences':
    'Всего повторений ошибок:',
  'monthly.review.demon-tracker.summary.critical-mistakes':
    'Критические ошибки (6+):',
  'monthly.review.demon-tracker.empty': 'В этом месяце ошибок не зафиксировано',
  'monthly.review.demon-tracker.empty-sub':
    'Ошибки, отмеченные в ваших сделках, будут отображаться здесь для выявления закономерностей',
  'monthly.review.mental-game-performance': 'Результаты ментальной игры',
  'monthly.review.technical-game-performance': 'Результаты технической игры',

  
  'monthly.overview.cumulative-pnl': 'Накопленный P&L за месяц',
  'monthly.overview.no-pnl-data': 'Нет данных P&L для отображения',
  'monthly.overview.no-pnl-data-sub':
    'Накопленная прибыль/убыток отобразится здесь после добавления закрытых сделок',

  
  'monthly.overview.drawdown': 'Просадка за месяц',
  'monthly.overview.no-drawdown-data': 'Нет данных о просадке',
  'monthly.overview.no-drawdown-data-sub':
    'Метрики просадки отобразятся здесь после добавления закрытых сделок',

  
  'monthly.overview.performance': 'Результаты за месяц',
  'monthly.overview.net-pnl': 'Чистый P&L',
  'monthly.overview.win-rate': 'Процент прибыльных',
  'monthly.overview.profit-factor': 'Профит-фактор',
  'monthly.overview.total-trades': 'Всего сделок',
  'monthly.overview.setup-performance': 'Результаты по сетапам',

  
  'monthly.overview.biggest-winner': 'Лучшая сделка {month}',
  'monthly.overview.biggest-loser': 'Худшая сделка {month}',
  'monthly.overview.label-date': 'Дата:',
  'monthly.overview.label-setup': 'Сетап:',
  'monthly.overview.view-trade-details': 'Просмотреть детали сделки',
  'monthly.overview.no-winning-trades': 'Нет прибыльных сделок в этом месяце',
  'monthly.overview.no-winning-trades-sub': 'Ваши лучшие сделки появятся здесь',
  'monthly.overview.no-losing-trades': 'Нет убыточных сделок в этом месяце',
  'monthly.overview.no-losing-trades-sub': 'Ваши худшие сделки появятся здесь',

  
  'monthly.overview.weekly-highlights': 'Основные показатели по неделям',
  'monthly.overview.best-week': 'Лучшая неделя',
  'monthly.overview.worst-week': 'Худшая неделя',
  'monthly.overview.week-number': 'Неделя {number}',
  'monthly.overview.view-week': 'Просмотреть неделю',

  
  'monthly.overview.long-performance': 'Результаты только по лонгам',
  'monthly.overview.no-long-trades': 'Нет лонг-сделок в этом месяце',
  'monthly.overview.no-long-trades-sub':
    'Результаты по лонг-сделкам появятся здесь',
  'monthly.overview.short-performance': 'Результаты только по шортам',
  'monthly.overview.no-short-trades': 'Нет шорт-сделок в этом месяце',
  'monthly.overview.no-short-trades-sub':
    'Результаты по шорт-сделкам появятся здесь',

  
  'monthly.overview.weekly-breakdown': 'Разбивка по неделям',
  'monthly.overview.table-week': 'Неделя',
  'monthly.overview.table-trades': 'Сделки',
  'monthly.overview.table-win-rate': 'Win%',
  'monthly.overview.table-profit-factor': 'Профит-фактор',
  'monthly.overview.table-pnl': 'P&L',
  'monthly.overview.week-abbrev': 'Н{number}',
  'monthly.overview.no-weekly-data': 'Нет данных по неделям',
  'monthly.overview.no-weekly-data-sub':
    'Разбивка результатов по неделям появится здесь',

  
  
  
  'monthly.game.header.week': 'Неделя',
  'monthly.game.header.a-games': 'Игры A',
  'monthly.game.header.b-games': 'Игры B',
  'monthly.game.header.c-games': 'Игры C',
  'monthly.game.header.rating': 'Рейтинг',
  'monthly.game.header.notes': 'Заметки',
  'monthly.game.week-label': 'Н{week}',
  'monthly.game.rating-na': 'Н/Д',
  'monthly.game.no-data': 'Нет данных о результатах за этот месяц',

  
  
  

  
  'drc.trades.chart.cumulative-pnl': 'Накопительный P&L',
  'drc.trades.chart.drawdown': 'Drawdown',
  'drc.trades.stats.title': 'Дневная статистика сделок',
  'drc.trades.stats.net-pnl': 'Чистый P&L',
  'drc.trades.stats.win-rate': 'Процент прибыльных',
  'drc.trades.stats.profit-factor': 'Профит-фактор',
  'drc.trades.stats.expectancy': 'Ожидаемость',
  'drc.trades.stats.total-trades': 'Всего сделок',
  'drc.trades.stats.avg-win': 'Средняя прибыль',
  'drc.trades.stats.avg-loss': 'Средний убыток',
  'drc.trades.stats.pl-ratio': 'Соотношение P/L',
  'drc.trades.log.title': 'Журнал сделок',
  'drc.trades.log.empty': 'Нет сделок за этот день',
  'drc.trades.log.empty-sub': 'Сделки появятся здесь после их добавления',
  'drc.trades.table.images': 'Изображения',
  'drc.trades.table.entry-exit-time': 'Время входа/выхода',
  'drc.trades.table.ticker': 'Тикер',
  'drc.trades.table.direction': 'Направление',
  'drc.trades.table.setup': 'Сетап',
  'drc.trades.table.pnl': 'P&L',
  'drc.trades.table.open': 'ОТКРЫТА',
  'drc.trades.table.na': 'Н/Д',
  'drc.trades.table.unknown': 'Неизвестно',
  'drc.trades.image.alt': 'Изображение сделки {id}',
  'drc.trades.image.preview-alt': 'Предпросмотр сделки {id}',

  
  'drc.component-name': 'Ежедневный отчёт',
  'drc.tab.preparation': 'Подготовка',
  'drc.tab.trades': 'Сделки',
  'drc.tab.review': 'Обзор',

  
  'drc.preparation.support-levels': 'Уровни поддержки',
  'drc.preparation.resistance-levels': 'Уровни сопротивления',
  'drc.preparation.enter-price': 'Введите ценовой уровень',
  'drc.preparation.select-importance': 'Выберите уровень важности',
  'drc.preparation.add-support': 'Добавить уровень поддержки',
  'drc.preparation.add-resistance': 'Добавить уровень сопротивления',
  'drc.preparation.remove-level': 'Удалить уровень',
  'drc.preparation.no-support': 'Уровни поддержки не заданы',
  'drc.preparation.no-resistance': 'Уровни сопротивления не заданы',
  'drc.preparation.importance.none': 'Нет',
  'drc.preparation.importance.high': 'Высокий',
  'drc.preparation.importance.medium': 'Средний',
  'drc.preparation.importance.low': 'Низкий',
  'drc.preparation.checklist.title': 'Предторговый чек-лист',
  'drc.preparation.checklist.empty': 'Нет пунктов предторгового чек-листа',
  'drc.preparation.checklist.sub-apply':
    'Применить пункты чек-листа из настроек плагина',
  'drc.preparation.checklist.sub-add':
    'Добавьте пункты чек-листа в настройках плагина',
  'drc.preparation.bias.title': 'Рыночный настрой',
  'drc.preparation.bias.bullish': 'Бычий',
  'drc.preparation.bias.bearish': 'Медвежий',
  'drc.preparation.bias.neutral': 'Нейтральный',
  'drc.preparation.bias.placeholder': 'Выберите рыночный настрой',
  'drc.preparation.goals.title': 'Дневные цели',
  'drc.preparation.goals.empty': 'Нет дневных целей с предыдущего дня',
  'drc.preparation.events.title': 'Ключевые события',
  'drc.preparation.events.all-week': 'Вся неделя',
  'drc.preparation.events.empty': 'Нет ключевых событий на сегодня',
  'drc.preparation.events.sub-empty':
    'События можно добавить в недельном обзоре',
  'drc.preparation.forecast.title': 'Дневной прогноз',
  'drc.preparation.media.title': 'Медиа ссылки',
  'drc.preparation.media.youtube': 'Ссылка на YouTube',
  'drc.preparation.media.youtube-placeholder': 'Ссылка на ваш торговый стрим',
  'drc.preparation.error.service-unavailable':
    'Сервис дневного анализа недоступен',
  'drc.preparation.error.image-upload': 'Ошибка загрузки изображения',

  
  'drc.missed-trades.title': 'Пропущенные сделки',
  'drc.missed-trades.loading': 'Загрузка пропущенных сделок...',
  'drc.missed-trades.error.service-unavailable':
    'Сервис пропущенных сделок недоступен',
  'drc.missed-trades.error.load-failed':
    'Не удалось загрузить пропущенные сделки',
  'drc.missed-trades.error-prefix': 'Ошибка: {error}',
  'drc.missed-trades.retry': 'Повторить',
  'drc.missed-trades.unknown': 'Неизвестно',
  'drc.missed-trades.no-setup': 'Сетап не указан',
  'drc.missed-trades.badge': 'ПРОПУЩЕНА',
  'drc.missed-trades.open-details-title': 'Открыть детали пропущенной сделки',
  'drc.missed-trades.view-details': 'Подробнее →',
  'drc.missed-trades.label.setup': 'Сетап:',
  'drc.missed-trades.label.reason': 'Причина:',
  'drc.missed-trades.add-button': '+ Добавить пропущенную сделку',
  'drc.missed-trades.add-title': 'Добавить новую пропущенную сделку',
  'drc.missed-trades.empty': 'Нет пропущенных сделок за сегодня',
  'drc.missed-trades.empty-sub':
    'Отслеживайте упущенные торговые возможности для улучшения исполнения',

  
  'drc.review.goal-placeholder': 'Ваша цель на следующую сессию',
  'drc.review.no-questions':
    'Рефлексивные вопросы не заданы. Добавьте вопросы для обзора в настройках.',
  'drc.review.answer-placeholder': 'Ваш ответ...',
  'drc.review.mental-game': 'Ментальная игра:',
  'drc.review.mental-game-aria': 'Оценка ментальной игры',
  'drc.review.technical-game': 'Техническая игра:',
  'drc.review.technical-game-aria': 'Оценка технической игры',
  'drc.review.end-of-day-review': 'Обзор в конце дня',
  'drc.review.performance-grades': 'Оценки эффективности',
  'drc.review.reflection-questions': 'Рефлексивные вопросы',
  'drc.review.goals-for-next-session': 'Цели на следующую сессию',
  'drc.review.add-goal': 'Добавить цель',
  'drc.review.end-of-day-screenshots': 'Скриншоты в конце дня',
  'drc.review.add-screenshots': 'Добавить скриншоты',
  'drc.review.error.invalid-date':
    'Неверный формат даты DRC. Проверьте дату в вашей DRC заметке.',

  
  
  
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
  'calendar.pnl': 'П/У',
  'calendar.week': 'НЕДЕЛЯ',
  'calendar.trade': '{count} сделка',
  'calendar.trades': '{count} сделки',
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
  'metric.profitFactor.description':
    'Отношение валовой прибыли к валовому убытку',
  'metric.expectancy.name': 'Математическое ожидание',
  'metric.expectancy.description': 'Средняя сумма прибыли или убытка на сделку',
  'metric.maxDrawdown.name': 'Max Drawdown',
  'metric.maxDrawdown.description':
    'Largest closed-trade drawdown amount from a prior realized P&L high',
  'metric.bestDay.name': 'Лучший день',
  'metric.bestDay.description': 'Наибольшая P&L за один день',
  'metric.largestWin.name': 'Самая большая прибыльная сделка',
  'metric.largestWin.description': 'Сделка с наибольшей прибылью',
  'metric.largestLoss.name': 'Самая большая убыточная сделка',
  'metric.largestLoss.description': 'Сделка с наибольшим убытком',
  'metric.longestWinStreak.name': 'Лучшая серия',
  'metric.longestWinStreak.description':
    'Самая длинная серия прибыльных сделок по дате выхода',
  'metric.longestLossStreak.name': 'Худшая серия',
  'metric.longestLossStreak.description':
    'Самая длинная серия убыточных сделок по дате выхода',
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
  'metric.avgRR.description':
    'Среднее соотношение прибыль/риск (средняя прибыль / средний убыток)',
  'metric.avgRRRiskBased.name': 'Средний RR (на основе R)',
  'metric.avgRRRiskBased.description':
    'Соотношение на основе R-множителей: средний выигрыш в R / средний проигрыш в R (требуются данные стопа/риска)',
  'metric.avgHoldTime.name': 'Среднее время удержания',
  'metric.avgHoldTime.description':
    'Среднее время удержания по всем закрытым сделкам',
  'metric.avgWinHoldTime.name': 'Среднее время удержания прибыльных',
  'metric.avgWinHoldTime.description':
    'Среднее время удержания по прибыльным закрытым сделкам',
  'metric.avgLossHoldTime.name': 'Среднее время удержания убыточных',
  'metric.avgLossHoldTime.description':
    'Среднее время удержания по убыточным закрытым сделкам',

  'metric.avgWinnerHeat.name': 'Ср. MAE прибыльных',
  'metric.avgWinnerHeat.description':
    'Средний MAE закрытых прибыльных сделок в сохранённой единице MAE/MFE',
  'metric.winnerMaeP90.name': 'MAE P90 прибыльных',
  'metric.winnerMaeP90.description':
    'Порог MAE 90-го процентиля для закрытых прибыльных сделок в сохранённой единице MAE/MFE',
  'metric.winnerMaeMedian.name': 'Медиана MAE прибыльных',
  'metric.winnerMaeMedian.description':
    'Медианный MAE закрытых прибыльных сделок в сохранённой единице MAE/MFE',
  'metric.avgLossHeat.name': 'Ср. MAE убыточных',
  'metric.avgLossHeat.description':
    'Средний MAE закрытых убыточных сделок в сохранённой единице MAE/MFE',
  'metric.winnerAvgMfe.name': 'Ср. MFE прибыльных',
  'metric.winnerAvgMfe.description':
    'Средний MFE закрытых прибыльных сделок в сохранённой единице MAE/MFE',
  'metric.loserAvgMfe.name': 'Ср. MFE убыточных',
  'metric.loserAvgMfe.description':
    'Средний MFE закрытых убыточных сделок в сохранённой единице MAE/MFE',
  'metric.winnerMfeP90.name': 'MFE P90 прибыльных',
  'metric.winnerMfeP90.description':
    'Порог MFE 90-го процентиля для закрытых прибыльных сделок в сохранённой единице MAE/MFE',
  'metric.loserMfeP90.name': 'MFE P90 убыточных',
  'metric.loserMfeP90.description':
    'Порог MFE 90-го процентиля для закрытых убыточных сделок в сохранённой единице MAE/MFE',
  'metric.timeInDrawdown.name': 'Time in Drawdown',
  'metric.timeInDrawdown.description':
    'Percentage of elapsed time spent below the prior realized P&L high',
  'metric.avgRecoveryTime.name': 'Avg Recovery Time',
  'metric.avgRecoveryTime.description':
    'Average time it takes closed-trade realized drawdowns to recover to a new high',
  'metric.longestDrawdown.name': 'Longest Realized Drawdown',
  'metric.longestDrawdown.description':
    'Longest elapsed time spent in a realized drawdown episode',
  'metric.drawdownEpisodes.name': 'Drawdown Episodes',
  'metric.drawdownEpisodes.description':
    'Number of realized drawdown periods in the current filtered trade set',
  'metric.category.performance': 'Производительность',
  'metric.category.volume': 'Объём',
  'metric.category.average': 'Среднее значение',

  
  
  

  
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
  'error.clipboard.no-target':
    'Область загрузки изображения не найдена. Сначала нажмите на область загрузки изображения, затем вставьте.',
  'error.clipboard.network-error':
    'Произошла сетевая ошибка при обработке вставки. Проверьте подключение и попробуйте снова.',
  'error.clipboard.paste-failed':
    'Не удалось выполнить операцию вставки. Попробуйте скопировать изображение заново и вставить.',
  'error.clipboard.generic':
    'Операция с буфером обмена не удалась. Попробуйте скопировать содержимое заново и вставить.',

  
  
  

  

  
  
  
  'template.switch-title': 'Сменить layout',
  'template.switch-trade-title': 'Сменить layout сделки',
  'template.switch-review-title': 'Сменить layout {type}',
  'template.no-template': 'Нет шаблона',
  'template.label': 'Шаблон',
  'template.assign-to-note': 'Назначить шаблон этой заметке',
  'template.switch-action': 'Сменить layout',
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

  'template.preview.empty': 'В этом шаблоне нет виджетов',
  'template.preview.summary': 'Шаблон {type} — {count} виджетов',
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
  'template.editor.loading': 'Загрузка шаблона...',
  'template.editor.built-in': 'Встроенный',
  'template.editor.unsaved-changes': 'Несохранённые изменения',
  'template.editor.review-title': 'Анализ сделки',
  'template.editor.show-review': 'Показать раздел анализа',
  'template.editor.show-review.always': 'Всегда',
  'template.editor.show-review.losses-only': 'Только убытки',
  'template.editor.show-review.never': 'Никогда',
  'template.editor.show-missed': 'Показывать для пропущенных сделок',
  'template.editor.show-backtest': 'Показывать для бэктест-сделок',
  'template.editor.sections': 'Разделы анализа',
  'template.editor.add-section': '+ Добавить раздел',
  'template.editor.no-sections': 'Разделы анализа не настроены.',
  'template.editor.add-section-hint':
    ' Нажмите "+ Добавить раздел" для создания.',
  'template.editor.win-sections': 'Разделы для прибыльных',
  'template.editor.loss-sections': 'Разделы для убыточных',
  'template.editor.win-sections-desc':
    'Показываются для прибыльных и безубыточных сделок',
  'template.editor.loss-sections-desc': 'Показываются для убыточных сделок',
  'template.editor.section-visibility': 'Видимость раздела',
  'template.editor.nav-bar': 'Панель навигации',
  'template.editor.nav-bar-desc':
    'Показывать временную шкалу сделок и ссылки на анализы',
  'template.editor.images': 'Изображения',
  'template.editor.images-desc': 'Показывать графики сделок',
  'template.editor.metadata': 'Метаданные',
  'template.editor.metadata-desc': 'Показывать счета, сетапы и ошибки',
  'template.editor.details': 'Детали сделки',
  'template.editor.details-desc':
    'Показывать данные входа, выхода и прибыли/убытка',
  'template.editor.review-button': 'Кнопка отметить проверенным',
  'template.editor.review-button-desc':
    'Показывать кнопку отметить сделку как проверённую',
  'template.editor.section-type': 'Тип раздела',
  'template.editor.type.textarea': 'Текстовое поле',
  'template.editor.type.checkbox': 'Одна галочка',
  'template.editor.type.checkboxList': 'Список галочек',
  'template.editor.type.header': 'Заголовок',
  'template.editor.title-label': 'Заголовок (поддерживает **markdown**)',
  'template.editor.title-placeholder': 'Название раздела',
  'template.editor.content-label': 'Содержание (поддерживает markdown)',
  'template.editor.content-placeholder': 'Содержание заголовка',
  'template.editor.checkbox-label': 'Текст галочки (поддерживает markdown)',
  'template.editor.checkbox-placeholder': 'Текст галочки',
  'template.editor.placeholder-label': 'Текст заполнителя',
  'template.editor.placeholder-hint': 'Текст, показываемый при пустом поле',
  'template.editor.items-label': 'Элементы списка',
  'template.editor.item-n': 'Элемент {n}',
  'template.editor.add-item': '+ Добавить элемент',
  'template.editor.preview-fallback': 'Раздел {type}',

  
  
  
  'common.select-option': 'Выберите опцию',
  'common.view': 'Просмотр',
  'common.other': 'Другое',
  'common.breakdown': 'Разбор',
  'common.na': 'Н/Д',
  'common.unknown': 'Неизвестно',
  'common.unknown-error': 'Неизвестная ошибка',
  'common.select-all': 'Выбрать всё',
  'common.n-types': '{count} типов',
  'common.select-item': 'Выберите {item}',
  'common.header': 'Заголовок',
  'common.row-n': 'Строка {n}: ',
  'common.day': 'День',
  'common.days': 'Дни',
  'common.weeks': 'Недели',
  'common.months': 'Месяцы',
  'common.years': 'Годы',
  'common.quarter': 'Квартал',
  'common.quarters': 'Кварталы',
  'common.best': 'Лучший',
  'common.worst': 'Худший',
  'common.goals': 'Цели',
  'common.statuses': 'Статусы',
  'common.enabled': 'включено',
  'common.disabled': 'отключено',
  'common.color.gray': 'Серый',
  'common.color.red': 'Красный',
  'common.color.orange': 'Оранжевый',
  'common.color.yellow': 'Жёлтый',
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
  'common.warning-label': 'Предупреждение:',
  'common.tip-label': 'Совет:',
  'common.backups-label': 'Резервные копии:',

  
  
  
  'form.modal.unsaved-changes.title': 'Несохранённые изменения',
  'form.modal.unsaved-changes.body1':
    'У вас есть несохранённые изменения в форме сделки.',
  'form.modal.unsaved-changes.body2':
    'Вы уверены, что хотите закрыть без сохранения?',
  'form.modal.unsaved-changes.continue': 'Продолжить редактирование',
  'form.modal.unsaved-changes.discard': 'Отменить изменения',
  'form.section.custom-fields': 'Пользовательские поля',
  'form.section.custom-fields-desc':
    'Пользовательские поля, определённые в настройках плагина. Эти поля будут сохранены в фронтматер вашей сделки.',
  'form.section.custom-fields-empty':
    'Пользовательские поля не определены. Создайте их в настройках плагина в разделе "Настройка".',
  'form.section.custom-fields-empty-title': 'Расширенных полей пока нет.',
  'form.section.custom-fields-empty-desc':
    'Создайте пользовательские поля сделки в Настройки → Настройка → Пользовательские поля сделки.',
  'form.section.attachments': 'Вложения',
  'form.field.asset-type.stock': 'Акции',
  'form.field.asset-type.options': 'Опционы',
  'form.field.asset-type.futures': 'Фьючерсы',
  'form.field.asset-type.forex': 'Форекс',
  'form.field.asset-type.crypto': 'Крипто',
  'form.field.asset-type.cfd': 'CFD',
  'form.field.commission-type.fixed': 'Фиксированная',
  'form.field.commission-type.percentage': 'Процент (%)',
  'form.field.swap-tooltip.forex':
    'Дифференциал процентных ставок между валютами при удержании позиций на ночь',
  'form.field.swap-tooltip.cfd':
    'Затраты на ночное финансирование для кредитных CFD позиций',
  'form.field.swap-tooltip.default':
    'Затраты на ночное финансирование, начисляемые/кредитуемые за удержание позиций',
  'form.field.closed': 'закрыта',
  'form.field.incl-costs': '(включая затраты)',
  'form.calculated': 'Рассчитано',
  'form.field.option-type': 'Тип опциона',
  'form.field.option-type.call': 'Call',
  'form.field.option-type.put': 'Put',
  'form.field.image-url-placeholder':
    'Вставьте URL изображения или путь к файлу...',
  'form.field.image-duplicate-error': 'Это изображение уже добавлено.',
  'form.field.trade-image-alt': 'Изображение сделки',
  'form.field.value-dollar': 'Стоимость ($)',
  'form.field.dollar-amount-placeholder': 'Сумма в долларах',
  'form.field.direct-pnl-placeholder': 'Введите общую прибыль или убыток',
  'form.field.mae-dollar-placeholder': 'Максимальная просадка в долларах',
  'form.field.mfe-dollar-placeholder': 'Максимальная прибыль в долларах',
  'form.field.mae-placeholder-currency': 'Max drawdown in {currency}',
  'form.field.mfe-placeholder-currency': 'Max profit in {currency}',
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
  'library.notice.copied': 'Код доступа скопирован в буфер обмена!',
  'library.error.copy-failed': 'Не удалось скопировать в буфер обмена',
  'library.title.import': 'Импорт layoutа',
  'library.desc.import':
    'Импортируйте шаблон, которым поделился другой пользователь, используя его код доступа.',
  'library.label.share-code': 'Код доступа',
  'library.placeholder.import-code': 'Вставьте код JRT-v1-... сюда',
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
    'Сначала создайте пользовательский шаблон, чтобы поделиться им с другими.',
  'library.label.select-template': 'Выберите layout',
  'library.option.select-template': '-- Выберите layout --',
  'library.button.generate-code': 'Сгенерировать код доступа',
  'library.button.copy-code': 'Копировать в буфер обмена',

  
  
  
  'backend.title': 'Синхронизация сделок',
  'backend.description':
    'Настройте синхронизацию MetaTrader (MT4/MT5) и автоматически поддерживайте хранилище в актуальном состоянии.',

  
  'trade-sync.gate.signin.title': 'Требуется вход',
  'trade-sync.gate.signin.description':
    'Чтобы включить синхронизацию сделок, сначала войдите в аккаунт Journalit.',
  'trade-sync.gate.signin.cta': 'Войти',

  'trade-sync.gate.pro.title': 'Требуется Pro',
  'trade-sync.gate.pro.description':
    'Trade Sync is a Pro feature. Upgrade to continue.',
  'trade-sync.gate.pro.cta': 'Upgrade now',

  
  'premium.gate.cta.activate': 'Activate PRO',
  'premium.gate.cta.upgrade-now': 'Upgrade now',
  'premium.gate.cta.signin-continue': 'Войти и продолжить',
  'premium.gate.cta.continue-pro': 'Перейти к PRO',
  'premium.gate.cta.keep-editing': 'Продолжить редактирование',
  'premium.gate.cta.refresh': 'Refresh status',
  'premium.gate.import.state.signin.title': 'До импорта остался один шаг',
  'premium.gate.import.state.signin.description':
    'Ваш файл и сопоставления готовы. Войдите, чтобы продолжить.',
  'premium.gate.import.state.pro.title': 'Всё готово к импорту',
  'premium.gate.import.state.pro.description':
    'Ваш файл и сопоставления готовы. Импорт входит в PRO.',
  'premium.gate.import.reassurance':
    'Предпросмотр и сопоставления столбцов останутся без изменений.',
  'premium.gate.trial-hint':
    'Первые подписки PRO включают бесплатный пробный период 14 дней.',
  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  'backend.connection.title': 'Настройки подключения',
  'backend.connection.status': 'Статус подключения',
  'backend.connection.status-desc':
    'Показывает, подключено ли ваше хранилище к торговому серверу.',
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
  'backend.ftp.credentials-title': 'Учётные данные FTP для MetaTrader',
  'backend.sync.title': 'Настройки синхронизации',
  'backend.sync.auto-sync': 'Включить автосинхронизацию',
  'backend.sync.auto-sync-desc':
    'Автоматически синхронизировать сделки при запуске Obsidian и периодически.',
  'backend.sync.auto-sync-info':
    'Автосинхронизация проверяет новые сделки каждый час',
  'backend.sync.auto-sync-aria': 'Включить автосинхронизацию',
  'backend.sync.manual': 'Ручная синхронизация',
  'backend.sync.manual-desc': 'Принудительная немедленная синхронизация сделок',
  'backend.sync.manual-info':
    'Запустите синхронизацию вручную, если автосинхронизация отключена или вам нужен немедленный результат.',
  'backend.sync.syncing': 'Синхронизация...',
  'backend.sync.force-button': 'Синхронизировать сейчас',
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
    '✅ Синхронизация завершена: обработано {total} сделок ({newFiles} новых, {updated} обновлено) в {accounts} счётах',
  'backend.notice.sync-complete-no-trades':
    'Синхронизация завершена: нет новых сделок',
  'backend.notice.sync-failed': 'Ошибка синхронизации: {error}',
  'backend.accounts.title': 'Торговые счета',
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
  'backend.progress.title': 'Прогресс Настройки',
  'backend.progress.connection.label': 'Подключение',
  'backend.progress.connection.desc': 'Привязать vault к серверу',
  'backend.progress.ftp.label': 'FTP',
  'backend.progress.ftp.desc': 'Создать учётные данные',
  'backend.progress.sync.label': 'Синхронизация',
  'backend.progress.sync.desc': 'Включить авто-синхронизацию',
  'backend.progress.accounts.label': 'Счета',
  'backend.progress.accounts.desc': 'Привязать счета MT',

  
  'backend.cards.connection.title': 'Подключение',
  'backend.cards.connection.refresh': 'Обновить',
  'backend.cards.sync.title': 'Статус Синхронизации',
  'backend.cards.sync.last-sync': 'Последняя синхронизация',
  'backend.cards.sync.total': 'Всего синхронизаций',
  'backend.cards.sync.button': 'Синхронизировать',
  'backend.cards.accounts.title': 'Счета',
  'backend.cards.accounts.linked': 'Привязанные счета',
  'backend.cards.accounts.manage': 'Управление',

  
  'backend.section.setup.title': 'Настройка и Конфигурация',
  'backend.section.sync.title': 'Настройки Синхронизации',
  'backend.section.accounts.title': 'Управление Счетами',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI-маппинг Trade Import',
  'settings.auth.feature.metatrader-sync': 'MetaTrader Синхронизация',
  'settings.auth.feature.basic-tracking': 'Базовое отслеживание',
  'settings.auth.feature.manual-csv': 'Ручной CSV импорт',
  'settings.auth.feature.manual-entry': 'Ручной ввод сделок',
  'settings.auth.feature.analytics-reviews': 'Аналитика и обзоры',
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
  'manual-drawdown.field.date': 'Дата просадки *',
  'manual-drawdown.field.date-desc': 'Когда брокер установил этот лимит',
  'manual-drawdown.field.limit': 'Минимальный баланс ($) *',
  'manual-drawdown.field.limit-desc': 'Минимально допустимый баланс',
  'manual-drawdown.field.note': 'Заметка (необязательно)',
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

  
  
  
  'trade.review.title': 'Обзор сделки',
  'trade.details.direction': 'Направление',
  'trade.details.position-size': 'Размер позиции',
  'trade.details.trading-costs': 'Торговые расходы',
  'trade.details.entry-price': 'Цена входа',
  'trade.details.exit-price': 'Цена выхода',
  'trade.details.entry': 'Вход',
  'trade.details.exit': 'Выход',
  'trade.details.size': 'Объём',
  'trade.details.duration': 'Длительность',
  'trade.details.instrument': 'Инструмент',
  'trade.details.exit-time': 'Время выхода',
  'trade.details.entry-time': 'Время входа',
  'trade.details.title': 'Детали сделки',
  'trade.details.thesis': 'Торговая идея',
  'trade.details.no-thesis': 'Торговая идея не указана для этой сделки',
  'trade.details.add-thesis':
    "Нажмите 'Редактировать' для добавления торговой идеи",
  'trade.metadata.account': 'Счёт:',
  'trade.metadata.custom-tags': 'Пользовательские теги:',
  'trade.metadata.setups': 'Сетапы',
  'trade.metadata.mistakes': 'Ошибки',
  'trade.image.no-images': 'Изображений для этой сделки нет',
  'trade.image.click-edit': 'Нажмите редактировать для добавления изображений',
  'trade.image.alt-prefix': 'Изображение сделки',
  'trade.header.unknown-instrument': 'Неизвестный инструмент',
  'trade.review.mark-as-reviewed': 'Отметить как проверено',
  'trade.review.reviewed': 'Проверено',
  'trade.review.reviewed-on': 'Проверено {date}',
  'trade.loading-navigation': 'Загрузка навигации...',

  
  
  
  'image.loading': 'Загрузка...',
  'image.load-failed': 'Не удалось загрузить изображение',
  'image.uploader.paste-title':
    'Вставить изображение из буфера обмена (Ctrl+V)',
  'image.uploader.pasting': 'Вставляется...',
  'image.uploader.paste': 'Вставить',
  'image.uploader.url-placeholder':
    'Вставьте URL изображения или путь к файлу...',
  'image.uploader.url-input-aria': 'Поле ввода URL изображения',
  'image.uploader.file-upload-aria': 'Загрузить файл',
  'image.uploader.paste-clipboard-aria': 'Вставить из буфера обмена',
  'image.uploader.error-invalid-url':
    'Недопустимый URL изображения или путь к файлу. Введите поддерживаемый URL изображения, путь к изображению в vault или ссылку Excalidraw.',
  'image.viewer.alt-default': 'Изображение',
  'image.viewer.description-default': 'Предпросмотр изображения',
  'image.viewer.error-load': 'Не удалось загрузить изображение',
  'image.viewer.title-fullscreen': 'Нажмите для просмотра на весь экран',
  'image.viewer.zoom-indicator': 'Нажмите или удерживайте для увеличения',
  'image.viewer.delete-button': 'Удалить изображение',
  'image.viewer.nav-prev': 'Предыдущее изображение',
  'image.viewer.nav-next': 'Следующее изображение',
  'image.viewer.zoom-in-hint': 'Сведите пальцы или нажмите для увеличения',
  'image.viewer.zoom-out-hint':
    '{scale}x (сведите пальцы или нажмите для уменьшения)',
  'image.viewer.no-images': 'Нет изображений для отображения',
  'image.viewer.thumbnail-alt': 'Миниатюра {n}',
  'image.viewer.close-aria': 'Закрыть полноэкранный режим',
  'image.carousel.no-images': 'Нет изображений для отображения',
  'image.carousel.prev': 'Предыдущее изображение',
  'image.carousel.next': 'Следующее изображение',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'Миниатюра {index}',

  
  
  
  'filter.modal.title': 'Расширенные фильтры',
  'filter.modal.active-filters': 'Активные фильтры ({count}):',
  'filter.modal.no-active-filters': 'Нет активных фильтров',
  'filter.modal.clear-all': 'Очистить все',
  'filter.modal.section.trading-data': 'Данные торговли',
  'filter.modal.section.classification': 'Классификация',
  'filter.modal.section.trade-criteria': 'Критерии сделки',
  'filter.modal.no-setup': 'Без стратегии',
  'filter.modal.no-tags': 'Без тегов',
  'filter.modal.no-mistakes': 'Без ошибок',
  'filter.modal.type.regular': 'Обычная',
  'filter.summary.regular-trades': 'Обычные сделки',
  'filter.modal.type.missed': 'Пропущенная',
  'filter.modal.type.backtest': 'Бэктест',
  'filter.modal.status.win': 'Прибыль',
  'filter.modal.status.loss': 'Убыток',
  'filter.modal.status.breakeven': 'Безубыток',
  'filter.modal.status.open': 'Открыта',
  'filter.modal.status.closed': 'Закрыта',
  'filter.modal.section.custom-fields': 'Custom Fields',
  'filter.modal.custom-field.n-selected': '{count} selected',
  'filter.modal.custom-field.none-available': 'No values available',
  'filter.chip.remove-aria': 'Удалить фильтр {label}',

  
  
  
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

  
  
  
  'auth.title.already-logged-in': 'Вы уже авторизованы',
  'auth.desc.already-logged-in': 'Вы уже авторизованы{email}.',
  'auth.title.sign-in': 'Войдите в Journalit',
  'auth.desc.email':
    'Введите свой адрес электронной почты, чтобы получить код подтверждения и доступ к закрытой бета-версии.',
  'auth.label.email': 'Адрес электронной почты',
  'auth.placeholder.email': 'your.email@example.com',
  'auth.button.send-code': 'Отправить код подтверждения',
  'auth.button.sending': 'Отправка...',
  'auth.desc.code':
    'Мы отправили 6-значный код подтверждения на {email}. Введите его ниже, чтобы завершить вход.',
  'auth.label.code': 'Код подтверждения',
  'auth.placeholder.code': '123456',
  'auth.button.verify': 'Проверить и войти',
  'auth.button.verifying': 'Проверка...',
  'auth.button.resend': 'Отправить код повторно',
  'auth.footer.trouble':
    'Возникли проблемы? Код подтверждения действителен в течение 15 минут.',
  'auth.footer.resend-wait':
    ' Вы можете запросить новый код через {seconds} секунд.',
  'auth.footer.resend-now':
    ' Теперь вы можете отправить код повторно, используя кнопку выше.',
  'auth.footer.enter-email':
    ' Введите свой адрес электронной почты, чтобы получить код подтверждения.',
  'auth.error.invalid-email':
    'Пожалуйста, введите действительный адрес электронной почты',
  'auth.error.enter-code': 'Пожалуйста, введите код подтверждения',
  'auth.error.code-digits': 'Код подтверждения должен состоять из 6 цифр',
  'auth.error.too-many-requests':
    'Вы запросили слишком много кодов. Пожалуйста, подождите 30 минут и попробуйте снова.',
  'auth.error.send-failed': 'Не удалось отправить код подтверждения',
  'auth.error.verify-failed': 'Не удалось проверить код',
  'auth.error.resend-failed': 'Не удалось отправить код повторно',
  'auth.error.invalid-code': 'Недействительный код подтверждения',
  'auth.status.disconnected': 'Вы вышли',
  'auth.error.token-expired':
    'Ваш сеанс истёк. Пожалуйста, войдите снова, чтобы продолжить использование функций Pro.',
  'auth.error.failed':
    'Не удалось аутентифицировать. Пожалуйста, попробуйте снова.',
  'auth.error.failed-reason': 'Не удалось аутентифицировать: {reason}',
  'auth.error.token-invalid': 'Токен больше не действителен',
  'auth.error.server-validation-failed': 'Ошибка валидации сервера',
  'auth.error.invalid-user-data':
    'Получены недействительные данные пользователя',
  'auth.error.needs-auth':
    'Войдите, чтобы получить доступ к функциям Pro. Базовые функции по-прежнему доступны.',
  'auth.error.needs-premium': 'Функция Pro',
  'auth.error.needs-premium-desc':
    'Это функция Pro. Посетите наш веб-сайт, чтобы подписаться и получить доступ.',
  'auth.error.network-error': 'Ошибка подключения',
  'auth.error.network-error-verify':
    'Не удалось проверить доступ Pro. Проверьте подключение или продолжайте с базовыми функциями.',
  'auth.error.network-error-basic':
    'Работает в автономном режиме. Базовые функции по-прежнему доступны.',
  'auth.error.offline-expired':
    'Период отсутствия сети истёк. Пожалуйста, подключитесь заново, чтобы продолжить использование функций Pro.',
  'auth.expiry-warning-tomorrow':
    'Ваш сеанс истекает завтра. Пожалуйста, войдите снова в ближайшее время, чтобы продолжить использование функций Pro.',
  'auth.expiry-warning-days':
    'Ваш сеанс истекает через {days} дней. Пожалуйста, войдите снова, чтобы продолжить использование функций Pro.',
  'auth.offline.active':
    'Работает в автономном режиме. Некоторые функции Pro могут быть ограничены.',
  'auth.offline.grace-remaining':
    'Период отсутствия сети: {days} дней осталось',

  
  
  
  'nav.prev-day': 'Предыдущий день',
  'nav.prev-week': 'Предыдущая неделя',
  'nav.prev-month': 'Предыдущий месяц',
  'nav.prev-quarter': 'Предыдущий квартал',
  'nav.prev-year': 'Предыдущий год',
  'nav.drc': 'Дневной анализ',
  'nav.weekly': 'Еженедельный обзор',
  'nav.monthly': 'Ежемесячный обзор',
  'nav.next-day': 'Следующий день',
  'nav.next-week': 'Следующая неделя',
  'nav.next-month': 'Следующий месяц',
  'nav.weekly-review': 'Еженедельный обзор',
  'nav.monthly-review': 'Ежемесячный обзор',
  'nav.quarterly-review': 'Квартальный обзор',
  'nav.yearly-review': 'Годовой обзор',
  'nav.edit-trade': 'Редактировать сделку',

  
  
  
  'button.done': 'Готово',
  'button.edit': 'Редактировать',
  'button.reset-to-defaults': 'Сбросить на значения по умолчанию',
  'button.back': 'Назад',
  'button.maybe-later': 'Может быть позже',
  'button.upgrade-now': 'Обновить сейчас',
  'button.apply': 'Применить',
  'button.remove': 'Удалить',
  'button.add-item': 'Добавить элемент',
  'button.move-up': 'Переместить вверх',
  'button.move-down': 'Переместить вниз',
  'button.remove-section': 'Удалить раздел',
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
    'Встроенные шаблоны не могут быть отредактированы. Продублируйте этот шаблон или создайте новый для настройки.',
  'templateEditor.unsaved-changes': 'Несохраненные изменения',
  'templateEditor.field.template-name': 'Имя layoutа',
  'templateEditor.field.widgets': 'Виджеты ({count})',
  'templateEditor.button.add-widget': '+ Добавить виджет',
  'templateEditor.button.widget-library-docs': 'Widget library docs',
  'templateEditor.widget.locked': 'Заблокировано',
  'templateEditor.widget.select-placeholder': 'Выберите виджет...',
  'templateEditor.widget.header-text-placeholder': 'Текст заголовка...',
  'templateEditor.widget.markdown-zone-text-label': 'Предустановленный текст',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'Текст для вставки в новые заметки обзора...',
  'templateEditor.widget.page-size': 'Размер страницы:',
  'templateEditor.widget.show-rating-column': 'Показать столбец оценки',
  'templateEditor.widget.demon-tracker.count-mode': 'Режим подсчета:',
  'templateEditor.widget.demon-tracker.count-mode.per-trade': 'По сделке',
  'templateEditor.widget.demon-tracker.count-mode.per-trading-day':
    'По торговому дню',
  'templateEditor.widget.demon-tracker.source-mode': 'Источник данных:',
  'templateEditor.widget.demon-tracker.source-mode.trades': 'Только сделки',
  'templateEditor.widget.demon-tracker.source-mode.session':
    'Только ошибки сессии',
  'templateEditor.widget.demon-tracker.source-mode.combined':
    'Комбинированный (сделки + сессия)',

  
  
  
  'datetime.placeholder.time': '1022p или 10:22 AM',
  'datetime.aria.open-picker': 'Открыть выбор даты',
  'datetime.error.date-required': 'Дата обязательна',
  'datetime.error.invalid-format': 'Неверный формат',
  'datetime.error.date-6-digits': 'Дата должна быть 6 цифр (формат ДДММГГ)',
  'datetime.error.invalid-month': 'Неверный месяц',
  'datetime.error.invalid-day': 'Неверный день',
  'datetime.error.invalid-date': 'Неверная дата',
  'datetime.error.invalid-time-format': 'Неверный формат времени',
  'datetime.error.time-3-4-digits': 'Время должно быть 3 или 4 цифры',
  'datetime.error.hours-1-12': 'Часы должны быть 1-12 с AM/PM',
  'datetime.error.hours-0-23': 'Часы должны быть 0-23 в 24-часовом формате',
  'datetime.error.minutes-0-59': 'Минуты должны быть 0-59',

  
  
  
  'timeline.trade-type.regular': 'Сделка',
  'timeline.trade-type.missed': 'Пропущенная сделка',
  'timeline.trade-type.backtest': 'Сделка бэктеста',
  'timeline.status.open': 'Открыта',
  'timeline.status.profit': 'Прибыль',
  'timeline.status.loss': 'Убыток',
  'timeline.status.breakeven': 'Безубыточность',
  'timeline.aria.trade-status': '{ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.title.current-trade':
    'Текущая {tradeType}: {ticker} {tradeType} {tradeNumber}',
  'timeline.title.view-trade':
    'Просмотр {ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.title.trade-still-open': 'Сделка ещё открыта',

  
  
  
  'template-builder.modal.unsaved-changes.title': 'Несохранённые изменения',
  'template-builder.modal.unsaved-changes.body1':
    'У вас есть несохранённые изменения в этом шаблоне.',
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
  'upgrade.benefit.templates':
    'Неограниченные пользовательские шаблоны и обмен шаблонами',
  'upgrade.benefit.mt5': 'Автоматическая синхронизация MetaTrader 5',
  'upgrade.benefit.multi-account': 'Поддержка нескольких аккаунтов',
  'upgrade.benefit.analytics': 'Продвинутая аналитика и метрики',
  'upgrade.benefit.layouts': 'Пользовательские макеты панели инструментов',
  'upgrade.trial-notice':
    'Получите 2-недельный бесплатный пробный период для импорта всех ваших исторических сделок и попробуйте все функции Pro без риска.',

  
  
  
  'datepicker.aria.time': 'Время',
  'datepicker.button.clear': 'Очистить',
  'datepicker.button.today': 'Сегодня',
  'datepicker.button.now': 'Сейчас',
  'datepicker.placeholder.day': 'ДД',
  'datepicker.placeholder.month': 'ММ',
  'datepicker.placeholder.year': 'ГГ',
  'datepicker.placeholder.hour': 'ЧЧ',
  'datepicker.placeholder.minute': 'ММ',

  
  
  
  'shared.goal-tracker.title': 'Цели',
  'shared.goal-tracker.empty': 'Цели не найдены',
  'shared.goal-tracker.remove-goal': 'Удалить цель',
  'shared.goal-tracker.add-goal-placeholder': 'Добавить новую цель',
  'shared.empty-state.message': 'Данные недоступны',
  'shared.collapsible.active-filters': '{count} активных фильтров',
  'shared.filter.disabled-preview': 'Фильтры отключены в просмотре',
  'shared.filter.open': 'Открыть фильтры',
  'shared.filter.active-count': '{count} активных фильтров',

  
  
  
  'release-notes.title': 'Примечания к релизу',
  'release-notes.loading-plugin': 'Загрузка плагина...',
  'release-notes.loading': 'Загрузка примечаний к релизу...',
  'release-notes.no-content': 'Примечания к релизу не найдены',
  'release-notes.current-version': 'Текущая версия: v{version}',
  'release-notes.version': 'Версия {version}',
  'release-notes.link.docs': 'Документация',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',

  
  
  
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'Peak realized P&L',
  'chart.tooltip.episode-start': 'Episode Start',
  'chart.tooltip.underwater-days': 'Time Underwater',
  'chart.tooltip.underwater-trades': 'Trades Underwater',
  'chart.tooltip.distance-to-recovery': 'Distance to Recovery',
  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',
  'chart.tooltip.trade-pnl': 'P&L сделки',
  'chart.tooltip.account': 'Account',
  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'chart.loading': 'Загрузка графика...',
  'chart.legend.entry': 'Вход',
  'chart.legend.exit': 'Выход',
  'chart.legend.trade': 'Сделка',
  'chart.shared.empty': 'Нет доступных сделок',
  'chart.shared.empty-sub': 'Попробуйте выбрать другой период времени',

  
  
  
  'view.account-page.title': 'Счёт: {name}',
  'view.account-page.title-default': 'Страница счёта',
  'view.account-page.no-account-selected': 'Счёт не выбран',
  'view.account-page.no-account-instructions':
    'Пожалуйста, откройте эту страницу из панели счётов.',
  'view.account-page.service-loading': 'Загрузка сервиса страницы счёта...',
  'view.account-page.balance-chart-title': 'График баланса счёта',
  'view.account-page.balance-chart-loading': 'Загрузка графика баланса...',

  
  
  
  'template.transformation.orphaned-content.header':
    'Содержимое из предыдущего шаблона',
  'template.transformation.orphaned-content.desc1':
    'Следующее содержимое не соответствует новому макету шаблона.',
  'template.transformation.orphaned-content.desc2':
    'Проверьте и интегрируйте его выше или удалите, если оно больше не требуется.',
  'template.editor.built-in-notice':
    'Встроенные шаблоны нельзя редактировать. Дублируйте этот шаблон или создайте новый для настройки.',
  'template.editor.show-review-desc':
    'Когда отображать раздел обзора в примечаниях к сделкам',
  'template.editor.show-missed-desc':
    'Также отображать раздел обзора в примечаниях пропущенных сделок',
  'template.editor.show-backtest-desc':
    'Также отображать раздел обзора в примечаниях сделок бэктестирования',

  
  
  
  'paste.notice.image-pasted': '📋 Изображение успешно вставлено',
  'paste.notice.images-pasted': '📋 {count} изображений успешно вставлены',
  'paste.error.clipboard-not-supported': 'API буфера обмена не поддерживается',
  'paste.error.clipboard-empty':
    'Ничего не найдено в буфере обмена для вставки',
  'paste.error.file-size-exceeds': 'Размер файла {size}МБ превышает лимит',
  'paste.error.no-images-found':
    'В буфере обмена не найдены изображения. Попробуйте сначала скопировать изображение.',
  'paste.error.permission-denied': 'Доступ запрещен',

  
  
  
  'modal.template-switch.title': 'Переключить шаблон?',
  'modal.template-switch.switching-from': 'Вы переключаетесь с',
  'modal.template-switch.switching-to': 'на',
  'modal.template-switch.has-content-title': 'Эта заметка содержит текст',
  'modal.template-switch.has-content-desc':
    'Содержимое будет перестроено в соответствии с новым макетом. Любое содержимое, которое не',
  'modal.template-switch.cannot-undo':
    'Это действие нельзя отменить (но вы можете переключиться обратно).',
  'modal.template-switch.button.switch': 'Переключить шаблон',

  
  
  
  'review.loading': 'Загрузка {name}...',
  'review.failed-to-load':
    'Ошибка загрузки {name}. Пожалуйста, обновите страницу.',
  'review.date-unknown': 'Неизвестно',
  'review.error.failed-to-navigate': 'Ошибка навигации по пути',
  'review.error.update-failed': 'Ошибка обновления {name}',
  'review.error.update-file-failed': 'Ошибка обновления {name} в файле',

  
  
  
  'forecast.chart-title': 'График {title}',
  'forecast.upload-label': 'Загрузить график {title}',
  'forecast.upload-label-plural': 'Загрузить графики {title}',
  'forecast.alt-text': 'Прогноз {title}',
  'forecast.description': 'Прогноз {title}',
  'forecast.notes-placeholder': 'Добавьте свои заметки {title} здесь...',

  
  
  
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

  
  
  
  'status-bar.update-available': 'Доступно обновление',
  'status-bar.update-aria-label': 'Journalit {version} - Нажмите для просмотра',

  
  
  
  'missed-trade.reason-title': 'Почему я пропустил эту сделку',
  'missed-trade.loading-navigation': 'Загрузка навигации...',

  
  
  
  'grid.aria.retry': 'Повторить загрузку макета сетки',
  'grid.aria.remove-widget': 'Удалить виджет',

  
  
  
  'ribbon.open-journalit': 'Открыть Journalit',

  
  
  
  'icon-select.default-title': 'Выбрать опцию',

  
  
  
  'onboarding.welcome.title': 'Добро пожаловать в Journalit',
  'onboarding.welcome.subtitle':
    'Владейте своими торговыми данными. Настраивайте собственный рабочий процесс.',
  'onboarding.welcome.cta': 'Начать',
  'onboarding.welcome.chart.week': 'Неделя {count}',
  'onboarding.view.title': 'Онбординг Journalit',
  'onboarding.wizard.skip-aria': 'Пропустить этот шаг',
  'onboarding.wizard.skip-onboarding': 'Пропустить онбординг',

  'onboarding.common.continue': 'Продолжить',
  'onboarding.common.close': 'Закрыть',
  'onboarding.features.title':
    'Выберите то, что подходит вашему рабочему процессу.',
  'onboarding.features.feature.mt5-sync.label': 'Синхронизация MT5',
  'onboarding.features.feature.mt5-sync.description':
    'Автоматически импортируйте сделки из MetaTrader 5',
  'onboarding.features.feature.csv-import.label': 'Trade Import',
  'onboarding.features.feature.csv-import.description':
    'Импортируйте сделки из любого брокера через CSV',
  'onboarding.features.feature.manual-entry.label': 'Ручной ввод',
  'onboarding.features.feature.manual-entry.description':
    'Записывайте сделки вручную с полным контролем',
  'onboarding.features.feature.analytics.label': 'Аналитика и инсайты',
  'onboarding.features.feature.analytics.description':
    'Показатели эффективности, графики и статистика сделок',
  'onboarding.features.feature.account-tracking.label': 'Отслеживание счетов',
  'onboarding.features.feature.account-tracking.description':
    'Отслеживайте несколько проп-фирм и личных счетов',
  'onboarding.features.feature.trade-journal.label': 'Конструктор макетов',
  'onboarding.features.feature.trade-journal.description':
    'Создавайте персональные макеты обзора с виджетами, графиками и заметками',
  'onboarding.features.feature.ai-trading-assistant.label':
    'ИИ-ассистент трейдера',
  'onboarding.features.feature.ai-trading-assistant.description':
    'Распознавание паттернов, инсайты и персональные рекомендации',
  'onboarding.features.badge.coming-soon': 'Скоро',
  'onboarding.features.badge.pro': 'PRO',
  'onboarding.features.trial.pro':
    'PRO функции включают 14-дневный бесплатный пробный период',

  
  
  
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

  'onboarding.features.graphic.syncing': 'Синхронизация сделок...',
  'onboarding.features.graphic.complete': 'Синхронизация завершена',
  'onboarding.features.graphic.direction.long': 'ЛОНГ',
  'onboarding.features.graphic.direction.short': 'ШОРТ',
  'onboarding.features.graphic.status.win': 'ПРИБЫЛЬ',
  'onboarding.features.graphic.status.loss': 'УБЫТОК',

  'onboarding.activation.title': 'Войдите в Journalit',
  'onboarding.activation.subtitle':
    'Завершите аутентификацию в браузере, чтобы получить доступ к аккаунту',
  'onboarding.activation.status.initializing':
    'Генерируем ваш код аутентификации...',
  'onboarding.activation.status.waiting': 'Ожидание входа...',
  'onboarding.activation.status.expired': 'Код истёк',
  'onboarding.activation.status.denied': 'Вход отклонён',
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
  'onboarding.activation.notice.popup-blocked-copied':
    'Всплывающее окно заблокировано. Ссылка активации скопирована в буфер обмена — вставьте её в браузер.',
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
  'onboarding.activation.success.subtitle':
    'Вы подключены к аккаунту Journalit',
  'onboarding.activation.features.title': 'Доступные функции:',
  'onboarding.activation.features.sync':
    'Синхронизация сделок между устройствами',
  'onboarding.activation.features.analytics': 'Продвинутая аналитика и отчёты',
  'onboarding.activation.features.mt5': 'Синхронизация MT5',
  'onboarding.activation.features.csv': 'Умный CSV-импорт',
  'onboarding.activation.auto-advance':
    'Автоматический переход через 10 секунд...',
  'onboarding.activation.skip': 'Активировать позже',
  'onboarding.notice.complete-failed':
    'Не удалось сохранить завершение онбординга. Пожалуйста, попробуйте позже.',
  'onboarding.notice.skip-failed':
    'Не удалось сохранить пропуск онбординга. Пожалуйста, попробуйте позже.',

  'onboarding.progress.aria-label': 'Шаг {current} из {total}',
  'onboarding.progress.step': 'Шаг {step}',
  'onboarding.progress.status.completed': ' (завершён)',
  'onboarding.progress.status.current': ' (текущий)',
  'onboarding.progress.announcement':
    'Шаг {current} из {total} выполнен{label}',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'Экспорт CSV из виджета Fills',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Откройте виджет Fills в TT и переключитесь в режим Detail, Continuous или Price with Detail',
  'csv.broker-guide.tradingtechnologies.step-2':
    'Щёлкните правой кнопкой внутри виджета Fills, выберите «Request download» и укажите диапазон времени',
  'csv.broker-guide.tradingtechnologies.step-3':
    'Когда TT покажет уведомление о готовности загрузки, скачайте CSV и импортируйте его здесь',
  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Важно:',
  'csv.broker-guide.tradingtechnologies.warning.message':
    'Не редактируйте экспортированный файл и порядок столбцов перед импортом.',
  'csv.broker-guide.tradingtechnologies.doc-label':
    'Открыть инструкции по экспорту Trading Technologies',
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
  'navigation.items.nav-home': 'Главная',
  'navigation.items.nav-dashboard': 'Торговая панель',
  'navigation.items.nav-trade-log': 'Журнал сделок',
  'navigation.items.nav-account-dashboard': 'Панель счетов',
  'navigation.items.nav-drc': 'DRC за сегодня',
  'navigation.items.nav-weekly': 'Обзор за эту неделю',
  'navigation.items.nav-monthly': 'Обзор за этот месяц',
  'navigation.items.nav-quarterly': 'Обзор за этот квартал',
  'navigation.items.nav-yearly': 'Обзор за этот год',
  'navigation.items.nav-add-trade': 'Добавить сделку',
  'navigation.items.nav-layout-builder': 'Конструктор макетов',
  'navigation.items.nav-quick-import': 'Быстрый импорт',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-position-size': 'Калькулятор размера позиции',
  'settings.general.navigation-sidebar': 'Боковая панель навигации',
  'navigation.setting.tab-behavior': 'Поведение вкладок навигации',
  'navigation.setting.tab-behavior.desc':
    'Как открывать представления при нажатии в боковой панели навигации',
  'navigation.setting.tab-behavior.new-tab': 'Открыть в новой вкладке',
  'navigation.setting.tab-behavior.replace': 'Заменить активную вкладку',
  'navigation.search.placeholder': 'Поиск сделок и обзоров...',
  'navigation.search.clear': 'Очистить поиск',
  'navigation.search.section.trades': 'Сделки',
  'navigation.search.section.reviews': 'Обзоры',
  'navigation.search.empty': 'Результаты не найдены',
  'navigation.search.trade-open': 'Открыта',
  'navigation.search.review.drc': 'Ежедневный обзор',
  'navigation.search.review.weekly': 'Еженедельный обзор',
  'navigation.search.review.monthly': 'Ежемесячный обзор',
  'navigation.search.review.quarterly': 'Квартальный обзор',
  'navigation.search.review.yearly': 'Годовой обзор',
  'command.open-navigation-sidebar': 'Открыть боковую панель навигации',
  'command.open-calendar-sidebar': 'Открыть боковую панель календаря',

  'widget.directional-drawdown.name': 'Directional Realized Drawdown',
  'widget.directional-drawdown.description':
    'Separate long and short closed-trade drawdown amount curves',

  'widget.long-drawdown.name': 'Long Realized Drawdown',
  'widget.long-drawdown.description':
    'Closed-trade drawdown amount curve for long trades only',
  'widget.short-drawdown.name': 'Short Realized Drawdown',
  'widget.short-drawdown.description':
    'Closed-trade drawdown amount curve for short trades only',
  'widget.directional-drawdown.title.long': 'Long Realized Drawdown',
  'widget.directional-drawdown.title.short': 'Short Realized Drawdown',
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

  'widget.longDrawdownChart.name': 'Long Realized Drawdown',
  'widget.longDrawdownChart.description':
    'Displays the closed-trade drawdown amount curve for long trades only',
  'widget.shortDrawdownChart.name': 'Short Realized Drawdown',
  'widget.shortDrawdownChart.description':
    'Displays the closed-trade drawdown amount curve for short trades only',
  'widget.drawdownStats.name': 'Realized Drawdown Stats',
  'widget.drawdownStats.description': 'Realized drawdown and recovery stats',
  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',

  'guide.skip-guide': 'Skip Guide',
  
  'onboarding.welcome.discover-heading': 'Что вы узнаете:',
  'onboarding.welcome.tagline': 'Настроим всё менее чем за 60 секунд',
  'onboarding.activation.button.copy-link': 'Скопировать ссылку',
  'onboarding.welcome.insight.win-rate.title': 'Анализ винрейта',
  'onboarding.welcome.insight.win-rate.content':
    '«Ваши breakout-сетапы имеют винрейт 82 % против 67 % у pullback-сетапов»',
  'onboarding.welcome.insight.timing.title': 'Паттерны тайминга',
  'onboarding.welcome.insight.timing.content':
    '«Сделки, удерживаемые 2–4 часа, показывают соотношение риск/прибыль в 3 раза лучше, чем скальпы»',
  'onboarding.welcome.insight.psychology.title': 'Отслеживание психологии',
  'onboarding.welcome.insight.psychology.content':
    '«Вы фиксируете прибыль на 15 % слишком рано, когда плюс превышает 500 $»',
  'onboarding.welcome.trust.data-ownership':
    'Ваши данные, ваше устройство — полный контроль и владение',
  'onboarding.welcome.trust.any-broker':
    'Работает с любым брокером — синхронизация MetaTrader + ручной ввод',
  'onboarding.welcome.trust.customizable':
    'Полностью настраивается — отслеживайте то, что важно именно вам',
  'onboarding.wizard.cancelled-announcement':
    'Онбординг отменён. Вы можете запустить его позже из палитры команд, найдя «Journalit: Replay Onboarding».',
  'onboarding.wizard.error.next-step': 'Не удалось перейти к следующему шагу',
  'onboarding.wizard.error.prev-step':
    'Не удалось вернуться к предыдущему шагу',
  'onboarding.wizard.error.trade-service': 'TradeService недоступен',
  'onboarding.wizard.error.account-service': 'AccountPageService недоступен',
  'onboarding.wizard.error.create-sample-trade':
    'Не удалось создать пример сделки',
  'onboarding.wizard.error.auth-failed': 'Не удалось завершить аутентификацию',
  'onboarding.wizard.error.backend-service':
    'Сервис backend-интеграции недоступен',
  'onboarding.wizard.error.sign-in-required':
    'Войдите в аккаунт, чтобы создать FTP-учётные данные',
  'onboarding.wizard.error.ftp-generation':
    'Не удалось создать FTP-учётные данные',
  'onboarding.wizard.notice.sample-trade-created':
    'Пример сделки успешно создан. Вы найдёте его в своём vault.',
  'onboarding.wizard.notice.auth-success':
    'Аутентификация успешно завершена. Теперь вам доступны функции Pro.',
  'onboarding.wizard.notice.ftp-generated':
    'FTP-учётные данные успешно созданы.',
  'onboarding.wizard.notice.password-masked':
    'Пароль скрыт и не может быть скопирован. Создайте FTP-учётные данные заново.',
  'onboarding.wizard.notice.copied': '{label} скопировано в буфер обмена.',
  'onboarding.wizard.notice.copy-failed': 'Не удалось скопировать {label}',
  'onboarding.wizard.unknown-step.title': 'Неизвестный шаг',
  'onboarding.wizard.unknown-step.description':
    'В процессе онбординга обнаружен неожиданный шаг.',
  'onboarding.wizard.footer-default':
    'Завершите настройку, чтобы начать работу с Journalit',
  'onboarding.wizard.skip-step': 'Пропустить шаг',
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
    'Этот виджет доступен только в еженедельных обзорах',
  'templateEditor.widget.weekly-drc-day-label': 'День',
  'templateEditor.widget.weekly-drc-display-label': 'Вид',
  'templateEditor.widget.weekly-drc-start-collapsed': 'Начинать свернутым',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': 'Карточка',
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
  'widget.stats.vs-prev': 'vs prev',
  'dashboard.metrics.past-30d': 'past 30d',
  'widget.stats.no-change': 'No change',
  'widget.stats.no-previous-data': 'No previous data',

  'settings.customization.trade-fields': 'Custom Trade Fields',
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

  'calendar.aria.open-daily-review': 'Открыть дневной обзор за {date}',
  'calendar.aria.open-weekly-review': 'Открыть недельный обзор за {date}',
  'trade.header.aria.status': 'Статус сделки: {status}',
  'csv.mapper.aria.map-column': 'Сопоставить столбец {header}',
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
    'Файлы загружаются на серверы Journalit для обработки и по умолчанию не сохраняются.',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',
  'quick-import.status.loading': 'Loading quick setup...',
  'quick-import.status.checking-subscription': 'Проверка статуса подписки...',
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
  'trade-import.guide.prompt': 'Не уверены, что экспортировать?',
  'trade-import.guide.link': 'Открыть руководство брокера',
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
  'trade-import.table.position': 'Position',
  'trade-import.table.result': 'Result',
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

export default ru;
