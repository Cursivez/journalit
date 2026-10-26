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
  <a href="README.ta.md">தமிழ்</a> |
  <a href="README.ar.md">العربية</a>
</p>

[Installation](#installation) · [KI-Apps (MCP)](#ai-apps-mcp) · [Unterstützte Broker](#supported-brokers) · [Datenschutz](PRIVACY.md)

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
- **[Prop-Challenges](https://journalit.co/docs/prop-challenges)**: Evaluation- und Funded-Phasen, Drawdown, Tagesverlust, Profit-Targets und Auszahlungsregeln verfolgen, mit Firmenprofilen zur Einrichtung.
- **Review-System (V2)**: tägliche bis jährliche Vorlagen mit Layout-Builder.
- **[Trade Import](https://journalit.co/csv-import)**: backendgestützte Importe für CSV, Tabellen, HTML und Broker-Abrechnungen.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: automatische Tradesynchronisierung für unterstützte Broker.
- **[KI-Apps (MCP)](https://journalit.co/docs/ai-apps)**: verbinde deine KI-App, um Trades zu analysieren, Reviews zu entwerfen und dein Journal zu aktualisieren.

<a id="screenshots"></a>

## Screenshots

### Trading-Dashboard

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setups

![Setup-Übersicht](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Setup-Paare](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Setup-Vergleich](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Konten & Prop-Challenges

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

### Layout-Builder

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Trade Log & Galerie

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Galerie](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

<a id="ai-apps-mcp"></a>

## KI-Apps (MCP)

Verbinde Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot oder eine andere kompatible KI-App über MCP (Model Context Protocol) mit deinem Journal. Lass sie Trades analysieren, einen Wochenreview entwerfen oder Journalfelder aktualisieren, ohne Notizen in einen Chat zu kopieren.

1. Melde dich in Obsidian bei Journalit an. Öffne **Einstellungen → Journalit → KI-Apps (MCP)** und aktiviere **MCP-Zugriff aktivieren**.
2. Füge `https://api.journalit.co/mcp` in deiner KI-App als Remote-MCP-Server hinzu.
3. Melde dich bei Aufforderung bei Journalit an, wähle deinen Vault, prüfe die angeforderten Berechtigungen und genehmige die Verbindung.

Lass Obsidian mit laufendem Journalit geöffnet. Löschungen, Zusammenführungen und umfangreiche Änderungen benötigen standardmäßig deine Zustimmung.

Die **[Einrichtungsanleitung für KI-Apps](https://journalit.co/docs/ai-apps)** erklärt die Schritte für die einzelnen Clients, Berechtigungen, das Rückgängigmachen von Änderungen und monatliche Nutzungslimits.

<a id="supported-brokers"></a>

## Unterstützte Broker

Trade Sync stellt eine dauerhafte Verbindung her. Trade Import liest exportierte Dateien. Die Unterstützung des einen bedeutet nicht, dass auch das andere unterstützt wird.

### Automatischer Trade Sync

- [MetaTrader 4](https://journalit.co/docs/trade-sync-metatrader)
- [Tradovate](https://journalit.co/docs/trade-sync-tradovate)
- [cTrader](https://journalit.co/docs/trade-sync-ctrader)
- [Hyperliquid](https://journalit.co/docs/trade-sync-hyperliquid): USDC-Perpetuals, nur lesender Zugriff

[Rithmic Trade Sync](https://journalit.co/docs/trade-sync-rithmic) ist eine Vorschau ausschließlich für zugelassene Tester. Abrechnungen aus MetaTrader 5 werden über Trade Import eingelesen, nicht über FTP-basierten Trade Sync.

### Dateibasierter Trade Import

Unterstützte Exportquellen und -formate:

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- TradingView: [Paper-Trading-Orderhistorie](https://journalit.co/docs/broker-guides-tradingview) und List of Trades aus dem Strategy Tester (Backtests)
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
- [DeepCharts](https://journalit.co/docs/broker-guides-deepcharts): Trade List aus dem Strategy Report
- [Breakout Terminal](https://journalit.co/docs/broker-guides-breakout-terminal): `trades.csv`
- Merrill Edge: Kontoaktivitäten als CSV
- PropReports: Executions-Bericht für Aktien

Verwende Manual Mapping für andere kompatible Dateien. Den benötigten Export findest du in der [Trade-Import-Übersicht](https://journalit.co/csv-import) und der Anleitung der jeweiligen Quelle.

Fehlt dein Broker? Komm auf [Discord](https://discord.gg/AkSw3D9h8b) und sag uns, was du als Nächstes möchtest.

<details>
<summary>Suchbegriffe</summary>

Suchbegriffe: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, Trade Import, Trade Sync, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown, prop challenge, evaluation, funded phase, payout rules, daily loss limit

KI: MCP, Model Context Protocol, Obsidian MCP, AI trading journal, AI-assisted journaling, Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot

Broker und Plattformen: MetaTrader, MetaTrader 4, MT4 sync, MetaTrader 5 imports, IBKR, Interactive Brokers, Tradovate, cTrader, Hyperliquid, Rithmic, TopStepX, TradeZero, TradingView, TradingView Strategy Tester, Bybit, BloFin, Sierra Chart, MotiveWave, FX Replay, ATAS, Trading Technologies, DeepCharts, Breakout Terminal, Merrill Edge, PropReports

</details>

<details>
<summary>Weitere Ressourcen</summary>

- [So funktioniert es (local-first)](https://journalit.co/obsidian-trading-journal)
- [Trade-Import-Übersicht](https://journalit.co/csv-import)
- [MetaTrader-Sync-Übersicht](https://journalit.co/metatrader-trading-journal)
- [Mit anderen Journalen vergleichen](https://journalit.co/compare)
- [Leitfaden zu Prop-Challenges](https://journalit.co/docs/prop-challenges)

</details>

## Wichtige Hinweise

- **Local-first-Kern**: das zentrale Journal funktioniert offline und speichert Notizen und Trades in deinem Obsidian-Vault.
- **Konto für vollen Zugriff erforderlich**: Für authentifizierte und abonnementgeschützte Funktionen ist ein Journalit-Konto erforderlich.
- **Bezahlte Funktionen**: Für Trade Sync, das Übernehmen von Trade Imports, den Wirtschaftskalender und vorausgefüllte Prop-Firm-Profile ist ein Pro-Abonnement erforderlich. Angemeldete Nutzer kostenloser Konten können Trade-Import-Dateien analysieren und in der Vorschau ansehen.
- **Netzwerknutzung**: Journalit prüft standardmäßig öffentliche GitHub-Veröffentlichungsmetadaten auf Updates, ohne Vault- oder Kontodaten zu senden. Angemeldete Funktionen können Journalit-Dienste nutzen; MT4 Sync verwendet verwaltete FTP-Infrastruktur, und Währungsumrechnungen können einen externen Wechselkursdienst nutzen. Siehe [PRIVACY.md](PRIVACY.md).
- **Optionaler KI-Zugriff**: Wenn du MCP aktivierst und eine KI-App autorisierst, werden die angeforderten Journaldaten über Journalit-Dienste mit dieser App geteilt. Für alle von ihr gelesenen Daten gelten die Datenschutzbedingungen des KI-Anbieters. Du kannst die App jederzeit trennen oder den MCP-Zugriff abschalten.
- **Trade-Import-Verarbeitung**: Analyse und Vorschau senden die ausgewählte Datei und die Importoptionen an Journalit. Serverseitig verschlüsselte Diagnoseaufzeichnungen verfallen nach 1 Tag bei kostenlosen Konten oder 14 Tagen bei Pro; gespeicherte Vorschauen nach 7 Tagen. Kompatibilitätshinweise kommen mit diesen Antworten zurück und werden lokal angezeigt, ohne einen zusätzlichen Upload von Client-Fehlerberichten. Siehe [PRIVACY.md](PRIVACY.md).
- **Weitere Netzwerkdiagnosen**: Der bestehende Tradovate-Sync-Code sendet Diagnoseereignisse zur Clientsynchronisierung wie in [PRIVACY.md](PRIVACY.md) beschrieben; dies geschieht unabhängig von Trade Import. Upgrade-Schaltflächen öffnen journalit.co nur beim Anklicken und übergeben feste Kampagnenparameter ohne Identifikatoren für die serverseitige Zuordnung.
- **Source-available, proprietäre Lizenz**: Das Plugin ist proprietäre Software mit einsehbarem Quellcode.
- **Datenschutzdetails**: siehe [PRIVACY.md](PRIVACY.md) für Informationen zur Datenverarbeitung, Aufbewahrung und Infrastruktur.

## Lizenz

Dieses Plugin ist source-available proprietäre Software. Der Quellcode wird für Obsidian-Review und Nutzerprüfung veröffentlicht, ist aber nicht als Open Source lizenziert. Zulässige Nutzung siehe LICENSE.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
