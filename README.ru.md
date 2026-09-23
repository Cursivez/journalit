<div align="center">

<img
  src="https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/journalit-logo.png"
  alt="Journalit"
  width="420"
  style="max-width: 100%; height: auto;"
/>

Local-first торговый журнал для Obsidian.

[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-purple?style=flat-square&logo=obsidian)](https://obsidian.md/)
[![Docs](https://img.shields.io/badge/docs-journalit.co-0B7285?style=flat-square&logo=readthedocs&logoColor=white)](https://journalit.co/docs)
[![Discord](https://img.shields.io/badge/discord-join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/AkSw3D9h8b)

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.hi.md">हिन्दी</a> |
  <a href="README.ta.md">தமிழ்</a>
</p>

[Установка](#installation) · [Поддерживаемые брокеры](#supported-brokers) · [Конфиденциальность](PRIVACY.md)

</div>

![Home View](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/home-view.png)

<a id="installation"></a>

## Установка

Установите Journalit из Community Plugins в Obsidian:

1. Откройте **Settings → Community Plugins → Browse**
2. Найдите `Journalit`
3. Нажмите **Install**, затем **Enable**

Страница сообщества: https://community.obsidian.md/plugins/journalit

## Основные возможности

- **Local-first**: основной журнал остается внутри вашего хранилища Obsidian.
- **Панель Home View**: перетаскиваемые виджеты и торговая тепловая карта.
- **Торговая панель**: отслеживайте результативность и паттерны с первого взгляда.
- **Панель аккаунта**: создана для profit target и drawdown в prop firm аккаунтах.
- **Система обзоров (V2)**: шаблоны от ежедневных до годовых с конструктором макетов.
- **[Trade Import](https://journalit.co/csv-import)**: импорт через backend для CSV, таблиц, HTML и брокерских отчетов.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: автоматическая синхронизация сделок для поддерживаемых брокеров.

## Важные сведения

- **Local-first ядро**: основной журнал работает офлайн и хранит ваши заметки и сделки в хранилище Obsidian.
- **Для полного доступа требуется аккаунт**: аккаунт Journalit нужен для функций с аутентификацией и доступом по подписке.
- **Платные функции**: для полного доступа к Pro-функциям, таким как Trade Sync и Trade Import, требуется подписка Pro.
- **Использование сети**: по умолчанию Journalit проверяет общедоступные метаданные выпусков GitHub для обновлений, не отправляя данные хранилища или аккаунта. Функции после входа могут использовать сервисы Journalit; синхронизация MT4 использует управляемый FTP, а конвертация валют может обращаться к стороннему сервису курсов. См. [PRIVACY.md](PRIVACY.md).
- **Source-available, проприетарная лицензия**: плагин является проприетарным ПО с доступным для просмотра исходным кодом.
- **Подробности о конфиденциальности**: см. [PRIVACY.md](PRIVACY.md), где приведены сведения об обработке и хранении данных, а также об инфраструктуре.

<a id="screenshots"></a>

## Скриншоты

### Торговая панель

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Сетапы

![Обзор сетапов](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Пары сетапов](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Сравнение сетапов](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Конструктор макетов

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Журнал сделок и галерея

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Галерея](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

### Панель аккаунта

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

### Страницы аккаунтов

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

<a id="supported-brokers"></a>

## Поддерживаемые брокеры

Поддерживаемые форматы импорта брокеров:

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- [TradingView](https://journalit.co/docs/broker-guides-tradingview)
- [Bybit](https://journalit.co/docs/broker-guides-bybit)
- [BloFin](https://journalit.co/docs/broker-guides-blofin)
- [Hyperliquid](https://journalit.co/docs/broker-guides-hyperliquid)
- [Sierra Chart](https://journalit.co/docs/broker-guides-sierrachart)
- [MotiveWave](https://journalit.co/docs/broker-guides-motivewave)
- [FX Replay](https://journalit.co/docs/broker-guides-fxreplay)
- [ATAS](https://journalit.co/docs/broker-guides-atas)
- [Trading Technologies (TT)](https://journalit.co/docs/broker-guides-tradingtechnologies)
- [Rithmic](https://journalit.co/docs/broker-guides-rithmic)
- [MetaTrader 4/5](https://journalit.co/docs/broker-guides-jdr)

Нет вашего брокера? Присоединяйтесь к [Discord](https://discord.gg/AkSw3D9h8b) и скажите, кого добавить следующим.

<details>
<summary>Поисковые ключевые слова</summary>

Keywords: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, MetaTrader, MT4 sync, MT5 sync, Trade Import, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown

</details>

<details>
<summary>Дополнительные ресурсы</summary>

- [Как это работает (local-first)](https://journalit.co/obsidian-trading-journal)
- [Обзор Trade Import](https://journalit.co/csv-import)
- [Обзор синхронизации MetaTrader](https://journalit.co/metatrader-trading-journal)
- [Сравнить с другими журналами](https://journalit.co/compare)

</details>

## Лицензия

Этот плагин является проприетарным программным обеспечением с доступным исходным кодом. Код опубликован для проверки Obsidian и просмотра пользователями, но не распространяется под лицензией open source. Разрешенное использование см. в LICENSE.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
