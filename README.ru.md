<div align="center">

<img
  src="https://github.com/user-attachments/assets/ab7232d4-1352-4658-a284-86029c0246f1"
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
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[Установка](#installation) · [Поддерживаемые брокеры](#supported-brokers) · [Конфиденциальность](PRIVACY.md)

</div>

![Home View](https://github.com/user-attachments/assets/1d82c43a-9235-4659-85c2-eedf46bd34ac)

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
- **[Синхронизация MetaTrader 4/5](https://journalit.co/metatrader-trading-journal)**: автоматический импорт сделок через FTP.

## Важные сведения

- **Local-first ядро**: основной журнал работает офлайн и хранит ваши заметки и сделки в хранилище Obsidian.
- **Для полного доступа требуется аккаунт**: аккаунт Journalit нужен для функций с аутентификацией и доступом по подписке.
- **Платные функции**: для полного доступа к Pro-функциям, таким как MetaTrader sync и Trade Import, требуется подписка Pro.
- **Опциональное использование сети**: плагин использует сетевые сервисы Journalit только когда вы выбираете функции, которым они нужны. Вход в аккаунт обращается к сервисам Journalit для проверки email, валидации токена и статуса подписки. Если затем вы используете MetaTrader sync или Trade Import, плагин также подключается к backend API Journalit для координации синхронизации, получения сделок и опционального Trade Import; MetaTrader sync использует FTP-инфраструктуру под управлением Journalit. Journalit также может запрашивать курсы валют у стороннего сервиса, когда нужна мультивалютная конвертация. Эти функции включаются по выбору.
- **Source-available, проприетарная лицензия**: плагин является проприетарным ПО с доступным для просмотра исходным кодом.
- **Подробности о конфиденциальности**: см. [PRIVACY.md](PRIVACY.md).

<a id="screenshots"></a>

## Скриншоты

### Торговая панель

![Trading Dashboard](https://github.com/user-attachments/assets/d5c7b636-b8f7-489a-a199-d1bba6958717)

### Конструктор макетов

![Layout Builder](https://github.com/user-attachments/assets/48bcc59a-2b17-4478-98b3-dce8677cca47)

![Layout Builder](https://github.com/user-attachments/assets/03f20e4b-37e7-43d9-94bf-fb444e43afbf)

### Журнал сделок

![Trade Log](https://github.com/user-attachments/assets/84593d6b-9783-4df6-ad06-6201f101ffcd)

### Trade Import

![Trade Import](https://github.com/user-attachments/assets/68121823-8b24-4024-b676-a4199c81f207)

### Панель аккаунта

![Account Dashboard](https://github.com/user-attachments/assets/dbd1cd69-3f8b-4af8-883c-460dbfb8944b)

### Страницы аккаунтов

![Account Pages](https://github.com/user-attachments/assets/8eeb0f2d-a8d8-412e-bf23-cb21e3a0401b)

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
- [JDR Securities Limited](https://journalit.co/docs/broker-guides-jdr)

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
