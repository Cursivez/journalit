<div align="center">

<img
  src="https://github.com/user-attachments/assets/ab7232d4-1352-4658-a284-86029c0246f1"
  alt="Journalit"
  width="420"
  style="max-width: 100%; height: auto;"
/>

Local-first Trading-Journal für Obsidian.

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

[Installation](#installation) · [Unterstützte Broker](#supported-brokers) · [Datenschutz](PRIVACY.md)

</div>

![Home View](https://github.com/user-attachments/assets/1d82c43a-9235-4659-85c2-eedf46bd34ac)

<a id="installation"></a>

## Installation

Installiere Journalit über die Community-Plugins von Obsidian:

1. Öffne **Einstellungen → Community-Plugins → Durchsuchen**
2. Suche nach `Journalit`
3. Klicke auf **Installieren** und dann auf **Aktivieren**

Community-Seite: https://community.obsidian.md/plugins/journalit

## Highlights

- **Local-first**: das zentrale Journal bleibt in deinem Obsidian-Vault.
- **Home-View-Dashboard**: verschiebbare Widgets und Trading-Heatmap.
- **Trading-Dashboard**: Performance und Muster auf einen Blick verfolgen.
- **Konto-Dashboard**: für Profit-Targets und Drawdowns von Prop-Firms entwickelt.
- **Review-System (V2)**: tägliche bis jährliche Vorlagen mit Layout-Builder.
- **[Trade Import](https://journalit.co/csv-import)**: backendgestützte Importe für CSV, Tabellen, HTML und Broker-Abrechnungen.
- **[MetaTrader 4/5 Sync](https://journalit.co/metatrader-trading-journal)**: automatischer Trade-Import per FTP.

## Wichtige Hinweise

- **Local-first-Kern**: das zentrale Journal funktioniert offline und speichert Notizen und Trades in deinem Obsidian-Vault.
- **Konto für vollen Zugriff erforderlich**: Für authentifizierte und abonnementgeschützte Funktionen ist ein Journalit-Konto erforderlich.
- **Bezahlte Funktionen**: Für vollständigen Zugriff auf Pro-Funktionen wie MetaTrader Sync und Trade Import ist ein Pro-Abonnement erforderlich.
- **Optionale Netzwerknutzung**: Das Plugin nutzt Journalit-Netzwerkdienste nur, wenn du netzwerkgestützte Funktionen verwendest. Beim Anmelden kontaktiert es Journalit für E-Mail-Verifizierung, Token-Validierung und Abonnementstatus. Wenn du MetaTrader Sync oder Trade Import nutzt, verbindet sich das Plugin außerdem mit der Journalit-Backend-API für Sync-Koordination, Trade-Abruf und optionalen Trade Import; MetaTrader Sync verwendet von Journalit verwaltete FTP-Infrastruktur. Journalit kann außerdem Wechselkurse von einem Drittanbieter abrufen, wenn Mehrwährungsumrechnung benötigt wird. Diese Funktionen sind optional.
- **Source-available, proprietäre Lizenz**: Das Plugin ist proprietäre Software mit einsehbarem Quellcode.
- **Datenschutzdetails**: siehe [PRIVACY.md](PRIVACY.md).

<a id="screenshots"></a>

## Screenshots

### Trading-Dashboard

![Trading Dashboard](https://github.com/user-attachments/assets/d5c7b636-b8f7-489a-a199-d1bba6958717)

### Layout-Builder

![Layout Builder](https://github.com/user-attachments/assets/48bcc59a-2b17-4478-98b3-dce8677cca47)

![Layout Builder](https://github.com/user-attachments/assets/03f20e4b-37e7-43d9-94bf-fb444e43afbf)

### Trade Log

![Trade Log](https://github.com/user-attachments/assets/84593d6b-9783-4df6-ad06-6201f101ffcd)

### Trade Import

![Trade Import](https://github.com/user-attachments/assets/68121823-8b24-4024-b676-a4199c81f207)

### Konto-Dashboard

![Account Dashboard](https://github.com/user-attachments/assets/dbd1cd69-3f8b-4af8-883c-460dbfb8944b)

### Kontoseiten

![Account Pages](https://github.com/user-attachments/assets/8eeb0f2d-a8d8-412e-bf23-cb21e3a0401b)

<a id="supported-brokers"></a>

## Unterstützte Broker

Unterstützte Broker-Importformate:

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

Fehlt dein Broker? Komm auf [Discord](https://discord.gg/AkSw3D9h8b) und sag uns, was du als Nächstes möchtest.

<details>
<summary>Suchbegriffe</summary>

Keywords: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, MetaTrader, MT4 sync, MT5 sync, Trade Import, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown

</details>

<details>
<summary>Weitere Ressourcen</summary>

- [So funktioniert es (local-first)](https://journalit.co/obsidian-trading-journal)
- [Trade-Import-Übersicht](https://journalit.co/csv-import)
- [MetaTrader-Sync-Übersicht](https://journalit.co/metatrader-trading-journal)
- [Mit anderen Journalen vergleichen](https://journalit.co/compare)

</details>

## Lizenz

Dieses Plugin ist source-available proprietäre Software. Der Quellcode wird für Obsidian-Review und Nutzerprüfung veröffentlicht, ist aber nicht als Open Source lizenziert. Zulässige Nutzung siehe LICENSE.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
