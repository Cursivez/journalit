<div align="center">

<img
  src="https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/journalit-logo.png"
  alt="Journalit"
  width="420"
  style="max-width: 100%; height: auto;"
/>

面向 Obsidian 的本地优先交易日志。

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

[安装](#installation) · [支持的经纪商](#supported-brokers) · [隐私](PRIVACY.md)

</div>

![Home View](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/home-view.png)

<a id="installation"></a>

## 安装

从 Obsidian 社区插件安装 Journalit：

1. 打开 **设置 → 第三方插件 → 浏览**
2. 搜索 `Journalit`
3. 点击 **安装**，然后点击 **启用**

社区页面: https://community.obsidian.md/plugins/journalit

## 亮点

- **本地优先**：核心日志保留在你的 Obsidian 仓库中。
- **Home View 仪表盘**：可拖拽小组件 + 交易热力图。
- **交易仪表盘**：一目了然地跟踪表现和交易模式。
- **[Prop 挑战](https://journalit.co/docs/prop-challenges)**：跟踪考核与资金账户阶段、回撤、每日亏损、盈利目标和出金规则，并可使用机构配置快速设置。
- **复盘系统 (V2)**：从每日到每年的模板，并带有布局构建器。
- **[Trade Import](https://journalit.co/csv-import)**：由后端驱动，支持 CSV、电子表格、HTML 和经纪商报表导入。
- **[Trade Sync](https://journalit.co/docs/trade-sync)**：自动同步受支持经纪商的交易。

## 重要说明

- **本地优先核心**：核心日志可离线工作，并将你的笔记和交易保存在 Obsidian 仓库中。
- **完整访问需要账户**：需要 Journalit 账户才能使用基于身份验证和订阅限制的功能。
- **付费功能**：完整使用 Trade Sync、Trade Import、经济日历、预填 prop firm 配置等 Pro 功能需要 Pro 订阅。
- **网络使用**：Journalit 默认检查 GitHub 上的公开版本元数据以获取更新，不会发送 vault 或账户数据。登录后使用的功能可能会调用 Journalit 服务；MT4 同步使用托管 FTP，货币换算可能会使用第三方汇率服务。请参阅 [PRIVACY.md](PRIVACY.md)。
- **源码可查看，专有许可证**：该插件是专有软件，但源码可供审查。
- **隐私详情**：请参阅 [PRIVACY.md](PRIVACY.md)，了解数据处理、保留和基础设施的详细信息。

<a id="screenshots"></a>

## 截图

### 交易仪表盘

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### 交易策略（Setups）

![策略概览](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![策略配对](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![策略对比](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### 账户与 Prop 挑战

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

### 布局构建器

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### 交易日志与图库

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![图库](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

<a id="supported-brokers"></a>

## 支持的经纪商

支持的经纪商导入格式：

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

没有你的经纪商？加入 [Discord](https://discord.gg/AkSw3D9h8b)，告诉我们你希望下一个支持谁。

<details>
<summary>搜索关键词</summary>

Keywords: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, MetaTrader, MT4 sync, MT5 sync, Trade Import, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown, prop challenge, evaluation, funded phase, payout rules, daily loss limit

</details>

<details>
<summary>更多资源</summary>

- [工作原理（本地优先）](https://journalit.co/obsidian-trading-journal)
- [Trade Import 概览](https://journalit.co/csv-import)
- [MetaTrader 同步概览](https://journalit.co/metatrader-trading-journal)
- [与其他日志比较](https://journalit.co/compare)
- [Prop 挑战指南](https://journalit.co/docs/prop-challenges)

</details>

## 许可证

此插件是源码可查看的专有软件。源码发布用于 Obsidian 审核和用户检查，但并非以开源许可证授权。允许的使用方式请参阅 LICENSE。

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
