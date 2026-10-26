<div align="center">

<img
  src="https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/journalit-logo.png"
  alt="Journalit"
  width="420"
  style="max-width: 100%; height: auto;"
/>

Local-first trading journal for Obsidian.

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

[Installation](#installation) · [AI apps (MCP)](#ai-apps-mcp) · [Supported brokers](#supported-brokers) · [Privacy](PRIVACY.md)

</div>

![Home View](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/home-view.png)

## Installation

Install Journalit from Obsidian Community Plugins:

1. Open **Settings → Community Plugins → Browse**
2. Search for `Journalit`
3. Click **Install**, then **Enable**

Community page: https://community.obsidian.md/plugins/journalit

## Highlights

- **Local-first**: core journaling stays inside your Obsidian vault.
- **Home View dashboard**: draggable widgets + trading heatmap.
- **Trading dashboard**: track performance and patterns at a glance.
- **[Prop challenges](https://journalit.co/docs/prop-challenges)**: track evaluation and funded phases, drawdown, daily loss, profit targets, and payout rules, with firm profiles to set them up.
- **Review system (V2)**: daily → yearly templates with a layout builder.
- **[Trade Import](https://journalit.co/csv-import)**: backend-powered imports for CSV, spreadsheets, HTML, and broker statements.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: automatic trade sync for supported brokers.
- **[AI apps (MCP)](https://journalit.co/docs/ai-apps)**: connect your AI app to analyse trades, draft reviews and update your journal.

## Screenshots

### Trading Dashboard

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setups

![Setup Overview](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Setup Pairs](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Setup Comparison](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Accounts & Prop Challenges

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

### Layout Builder

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Trade Log & Gallery

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Gallery](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

## AI apps (MCP)

Connect Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot or another compatible AI app to your journal using MCP (Model Context Protocol). Ask it to analyse your trades, draft a weekly review or update journal fields without copying notes into a chat.

1. Sign in to Journalit in Obsidian. Open **Settings → Journalit → AI apps (MCP)** and turn on **Enable MCP access**.
2. Add `https://api.journalit.co/mcp` as a remote MCP server in your AI app.
3. Sign in to Journalit when prompted, choose your vault, review the requested permissions and approve the connection.

Keep Obsidian open with Journalit running. Deletions, merges and large changes need your approval by default.

See the **[AI apps setup guide](https://journalit.co/docs/ai-apps)** for client-specific steps, permissions, undo and monthly usage limits.

## Supported brokers

Trade Sync creates an ongoing connection. Trade Import reads exported files. Support for one does not imply support for the other.

### Automatic Trade Sync

- [MetaTrader 4](https://journalit.co/docs/trade-sync-metatrader)
- [Tradovate](https://journalit.co/docs/trade-sync-tradovate)
- [cTrader](https://journalit.co/docs/trade-sync-ctrader)
- [Hyperliquid](https://journalit.co/docs/trade-sync-hyperliquid): watch-only USDC perpetuals

[Rithmic Trade Sync](https://journalit.co/docs/trade-sync-rithmic) is a preview for approved testers only. MetaTrader 5 statements use Trade Import, not FTP-based Trade Sync.

### File-based Trade Import

Supported export sources and formats:

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- TradingView: [Paper Trading order history](https://journalit.co/docs/broker-guides-tradingview) and Strategy Tester List of Trades (backtests)
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
- [DeepCharts](https://journalit.co/docs/broker-guides-deepcharts): Strategy Report Trade List
- [Breakout Terminal](https://journalit.co/docs/broker-guides-breakout-terminal): `trades.csv`
- Merrill Edge: account activity CSV
- PropReports: Executions report for stocks

Use Manual Mapping for other compatible files. See the [Trade Import overview](https://journalit.co/csv-import) and each source's guide for the required export.

Missing your broker? Join [Discord](https://discord.gg/AkSw3D9h8b) and tell us what you want next.

<details>
<summary>Search keywords</summary>

Keywords: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, Trade Import, Trade Sync, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown, prop challenge, evaluation, funded phase, payout rules, daily loss limit

AI: MCP, Model Context Protocol, Obsidian MCP, AI trading journal, AI-assisted journaling, Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot

Brokers and platforms: MetaTrader, MetaTrader 4, MT4 sync, MetaTrader 5 imports, IBKR, Interactive Brokers, Tradovate, cTrader, Hyperliquid, Rithmic, TopStepX, TradeZero, TradingView, TradingView Strategy Tester, Bybit, BloFin, Sierra Chart, MotiveWave, FX Replay, ATAS, Trading Technologies, DeepCharts, Breakout Terminal, Merrill Edge, PropReports

</details>

<details>
<summary>More resources</summary>

- [How it works (local-first)](https://journalit.co/obsidian-trading-journal)
- [Trade Import overview](https://journalit.co/csv-import)
- [MetaTrader sync overview](https://journalit.co/metatrader-trading-journal)
- [Compare with other journals](https://journalit.co/compare)
- [Prop challenges guide](https://journalit.co/docs/prop-challenges)

</details>

## Important disclosures

- **Local-first core**: core journaling works offline and stores your notes and trades inside your Obsidian vault.
- **Account required for full access**: a Journalit account is required for authentication-backed and subscription-gated features.
- **Paid features**: a paid Pro subscription is required for Trade Sync, committing Trade Imports, the Economic Calendar, and prefilled prop-firm profiles. Signed-in free users can analyse and preview Trade Import files.
- **Network use**: Journalit checks public GitHub release metadata for updates by default without sending vault or account data. Signed-in features may use Journalit services; MT4 sync uses managed FTP, and currency conversion may use a third-party exchange-rate service. See [PRIVACY.md](PRIVACY.md).
- **Optional AI access**: when you enable MCP and authorise an AI app, requested journal data is shared through Journalit services with that app. The AI provider's privacy terms apply to anything it reads. You can disconnect the app or turn off MCP access at any time.
- **Trade Import processing**: analyse/preview sends your selected file and import options to Journalit. Server-side encrypted diagnostic captures expire after one day for free accounts or 14 days for Pro accounts; stored previews expire after seven days. Compatibility guidance is returned in those responses and displayed locally, with no separate client failure-report upload. See [PRIVACY.md](PRIVACY.md).
- **Other network diagnostics**: existing Tradovate Sync code sends client synchronization diagnostic events as disclosed in [PRIVACY.md](PRIVACY.md); this is separate from Trade Import. Upgrade buttons open journalit.co only when clicked, carrying fixed campaign parameters (no identifiers) for server-side attribution.
- **Source available, proprietary license**: the plugin is proprietary software with reviewable source.
- **Privacy details**: see [PRIVACY.md](PRIVACY.md) for data handling, retention, and infrastructure details.

## License

This plugin is source-available proprietary software. Source is published for Obsidian review and user inspection, but it is not licensed as open source. See LICENSE for permitted use.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
