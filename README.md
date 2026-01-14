<div align="center">

![Journalit Banner](https://github.com/user-attachments/assets/ab7232d4-1352-4658-a284-86029c0246f1)

**A powerful, local-first trading journal plugin for Obsidian that helps traders track, analyze, and improve their trading performance.**

[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-purple?logo=obsidian)](https://obsidian.md/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](#)

*Keywords: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, MT5 sync, CSV import*

[Features](#features) | [Screenshots](#screenshots) | [Installation](#installation) | [Support](#support)

</div>

> **Privacy First**: All your manual trades stay local in your vault. Optional MT5 sync connects to Journalit servers only for automated trade retrieval. [Read our Privacy Policy](PRIVACY.md)

---

## Features

### Core Trading Journal
- **Local-First Architecture** - All trading data stays secure in your Obsidian vault
- **Comprehensive Trade Tracking** - Record trades with detailed metadata, psychology notes, and rich context
- **R-Multiple Risk Tracking** - Measure trades in risk units with automatic calculations from stop loss
- **Multi-Entry/Exit Support** - Track complex positions with partial entries and exits
- **Psychology Tracking** - Monitor emotions, mistakes, and behavioral patterns

### Import & Sync
- **CSV Import System** - Import trades from any broker with built-in adapters for IBKR, Tradovate, TradeZero, TradingView, and ByBit
- **AI-Powered Mapping** - Optional OpenAI assistance for custom CSV formats
- **Template Sharing** - JTT codes enable community template distribution
- **MetaTrader 5 Integration** - Automatically sync trades from MT5 via FTP

### Review System (V2)
- **Template-Based Reviews** - Daily, weekly, monthly, quarterly, and yearly review templates
- **Layout Builder** - Create custom review templates with drag-and-drop sections
- **20+ Widgets** - Performance charts, trade summaries, psychology tracking, and more
- **Template Sharing** - Share and import review templates with the community

### Analytics Dashboard
- **Customizable Home View** - Drag-and-drop widgets with position and resize controls
- **Trading Heatmap** - GitHub-style contributions showing daily P&L performance
- **Advanced Filtering** - Filter by account, ticker, setup, tags, date range, and trade status
- **Performance Metrics** - Win rate, drawdown analysis, average hold times, rolling win/loss ratio
- **Position Size Calculator** - Built-in calculator with multi-asset and R:R ratio support

### Trade Log
- **Multi-Select Operations** - Shift-click to select trades, batch toolbar for bulk actions
- **Column Customization** - Choose, reorder, and resize columns to your preference
- **Advanced Filters** - Filter by status, account, setup, tags, and custom date ranges
- **Scroll Persistence** - Remembers your position when navigating away

### Account Management
- **Multiple Accounts** - Track separate trading accounts with individual P&L
- **Manual Trailing Drawdown** - Log dated drawdown limits for prop firm tracking
- **Transaction History** - Deposits, withdrawals, and AUM tracking
- **Copy Trading Support** - P&L multiplier for copy trading calculations

### Additional Features
- **Global Instrument Specifications** - Define tick sizes and contract specs once, apply everywhere
- **Backtest Trade System** - Separate tracking for paper trades with dedicated file naming
- **TradingView Image Links** - Attach chart snapshots via URL
- **Commission Tracking** - Fixed or percentage-based commission support
- **Update Notifications** - Stay informed about new releases with in-app changelogs

## Screenshots

### Home View
*Customizable dashboard with drag-and-drop widgets, trading heatmap, and quick navigation*

![Home View](https://github.com/user-attachments/assets/9ef0236f-686f-4511-a05f-925e51f1224a)

### Review System
*Template-based reviews with layout builder and 20+ widgets*

![Review System](https://github.com/user-attachments/assets/48bcc59a-2b17-4478-98b3-dce8677cca47)

![Review Layout Builder](https://github.com/user-attachments/assets/03f20e4b-37e7-43d9-94bf-fb444e43afbf)

### Trade Log
*Multi-select operations, customizable columns, and advanced filtering*

![Trade Log](https://github.com/user-attachments/assets/84593d6b-9783-4df6-ad06-6201f101ffcd)

### CSV Import
*Import from any broker with smart duplicate detection*

![CSV Import](https://github.com/user-attachments/assets/5c272fb2-19c7-4db0-94c0-0fecf67281be)

### Account Dashboard
*Financial account management with AUM tracking and transaction history*

![Account Dashboard](https://github.com/user-attachments/assets/10bea344-81da-465a-9ad6-55c1120c80ad)

### Account Pages
*Track drawdowns, profit targets, and monthly costs for each trading account*

![Account Pages](https://github.com/user-attachments/assets/e9630bc1-326e-4f1c-8e2f-40e7e022a642)

## Installation

### Method 1: BRAT (Recommended)

1. Download and open [Obsidian](https://obsidian.md/download)
2. Go to **Settings > Community Plugins > Turn on community plugins**
3. Click **Browse**, search for **"BRAT"** and install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
4. Open **BRAT settings** and click **"Add Beta Plugin"**
5. Enter this repository URL: `Cursivez/journalit` and select **"Latest version"**
6. Click **"Add Plugin"** and enable it in your plugin settings

### Method 2: Manual Installation

1. Download the latest release files: `main.js` and `manifest.json`
2. Create a folder called `journalit` in your `.obsidian/plugins/` directory
3. Place the downloaded files in the `journalit` folder
4. Restart Obsidian and enable the plugin in **Settings > Community Plugins**

## Quick Start

1. **Configure** - Open **Settings > Journalit** to set up your trading journal
2. **First Trade** - Create your first trade entry using the trade form
3. **Import Existing Trades** - Use CSV Import to bring in historical data (Ctrl+P, search "CSV")
4. **Set Up Reviews** - Configure daily review templates for structured reflection
5. **Explore Analytics** - Check the dashboard for performance metrics
6. **Optional: MT5 Sync** - Set up MetaTrader 5 sync for automated trade collection

**Recommended**: Go to Settings > Editor > Display and set "Properties in document" to **Hidden**

## Use Cases

- Day traders using Obsidian who need structured trading templates
- Swing traders wanting comprehensive trade analysis and journaling
- Prop firm traders tracking trailing drawdowns and performance targets
- Traders using MetaTrader 5 who want automated trade sync
- Anyone looking for a local-first alternative to cloud-based trading journals
- Obsidian users who want to consolidate their trading workflow

## Support

- **Documentation**: [journalit.co/docs](https://journalit.co/docs)
- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/Cursivez/journalit/issues)
- **Community**: Join our [Discord Server](https://discord.gg/AkSw3D9h8b) for support and discussions

## Privacy & Data

Journalit is built with privacy in mind:

- **Local-First** - Core features work entirely offline
- **Network Usage** - Plugin makes network requests only when you enable optional MT5 sync (connects to api.journalit.co for automated trade retrieval)
- **No Manual Trade Collection** - Trades you create manually never leave your vault
- **No Telemetry** - Plugin does not collect usage analytics by default
- **Transparent** - Full details in our [Privacy Policy](PRIVACY.md)

## License

This plugin is proprietary software. The compiled plugin files are distributed for use with Obsidian, but the source code is not available under an open source license.

---

<div align="center">

**Built with ♥ for the trading community**

*Transform your Obsidian vault into a powerful trading journal*

</div>
