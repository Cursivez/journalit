<div align="center">

<img
  src="https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/journalit-logo.png"
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
  <a href="README.it.md">Italiano</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.hi.md">हिन्दी</a> |
  <a href="README.ta.md">தமிழ்</a>
</p>

[Installation](#installation) · [Unterstützte Broker](#supported-brokers) · [Datenschutz](PRIVACY.md)

</div>

![Home View](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/home-view.png)

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
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: automatische Tradesynchronisierung für unterstützte Broker.

## Wichtige Hinweise

- **Local-first-Kern**: das zentrale Journal funktioniert offline und speichert Notizen und Trades in deinem Obsidian-Vault.
- **Konto für vollen Zugriff erforderlich**: Für authentifizierte und abonnementgeschützte Funktionen ist ein Journalit-Konto erforderlich.
- **Bezahlte Funktionen**: Für vollständigen Zugriff auf Pro-Funktionen wie Trade Sync und Trade Import ist ein Pro-Abonnement erforderlich.
- **Netzwerknutzung**: Journalit prüft standardmäßig öffentliche GitHub-Veröffentlichungsmetadaten auf Updates, ohne Vault- oder Kontodaten zu senden. Angemeldete Funktionen können Journalit-Dienste nutzen; MT4 Sync verwendet verwaltete FTP-Infrastruktur, und Währungsumrechnungen können einen externen Wechselkursdienst nutzen. Siehe [PRIVACY.md](PRIVACY.md).
- **Source-available, proprietäre Lizenz**: Das Plugin ist proprietäre Software mit einsehbarem Quellcode.
- **Datenschutzdetails**: siehe [PRIVACY.md](PRIVACY.md) für Informationen zur Datenverarbeitung, Aufbewahrung und Infrastruktur.

<a id="screenshots"></a>

## Screenshots

### Trading-Dashboard

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setups

![Setup-Übersicht](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Setup-Paare](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Setup-Vergleich](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Layout-Builder

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Trade Log & Galerie

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Galerie](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

### Konto-Dashboard

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

### Kontoseiten

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

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
- [MetaTrader 4/5](https://journalit.co/docs/broker-guides-jdr)

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
