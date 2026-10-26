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

[安装](#installation) · [AI 应用 (MCP)](#ai-apps-mcp) · [支持的经纪商](#supported-brokers) · [隐私](PRIVACY.md)

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
- **[AI 应用 (MCP)](https://journalit.co/docs/ai-apps)**: 连接 AI 应用，分析交易、起草复盘并更新交易日志。

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

<a id="ai-apps-mcp"></a>

## AI 应用 (MCP)

通过 MCP（Model Context Protocol）将 Claude、Claude Code、ChatGPT、Codex、Hermes、Grok Bot 或其他兼容的 AI 应用连接到交易日志。无需把笔记复制到聊天窗口，即可让它分析交易、起草每周复盘或更新日志字段。

1. 在 Obsidian 中登录 Journalit。打开 **设置 → Journalit → AI 应用 (MCP)**，勾选 **启用 MCP 访问**。
2. 在 AI 应用中，将 `https://api.journalit.co/mcp` 添加为远程 MCP 服务器。
3. 按照提示登录 Journalit，选择仓库，检查请求的权限并批准连接。

使用 AI 应用时，请保持 Obsidian 打开且 Journalit 正在运行。默认情况下，删除、合并和大范围更改需要你批准。

各客户端的具体步骤、权限、撤销操作及每月用量限制，请参阅 **[AI 应用设置指南](https://journalit.co/docs/ai-apps)**。

<a id="supported-brokers"></a>

## 支持的经纪商

Trade Sync 建立持续连接，Trade Import 读取导出的文件。支持其中一种方式不代表也支持另一种。

### 自动 Trade Sync

- [MetaTrader 4](https://journalit.co/docs/trade-sync-metatrader)
- [Tradovate](https://journalit.co/docs/trade-sync-tradovate)
- [cTrader](https://journalit.co/docs/trade-sync-ctrader)
- [Hyperliquid](https://journalit.co/docs/trade-sync-hyperliquid): 以 USDC 结算的永续合约，仅限只读访问

[Rithmic Trade Sync](https://journalit.co/docs/trade-sync-rithmic) 是仅供获准测试者使用的预览功能。MetaTrader 5 报表通过 Trade Import 导入，而非基于 FTP 的 Trade Sync。

### 基于文件的 Trade Import

支持的导出来源和格式：

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- TradingView: [Paper Trading 订单历史](https://journalit.co/docs/broker-guides-tradingview) 和 Strategy Tester 的 List of Trades（回测）
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
- [DeepCharts](https://journalit.co/docs/broker-guides-deepcharts): Strategy Report 中的 Trade List
- [Breakout Terminal](https://journalit.co/docs/broker-guides-breakout-terminal): `trades.csv`
- Merrill Edge: 账户活动 CSV
- PropReports: 股票 Executions 报告

其他兼容文件可使用 Manual Mapping。请参阅 [Trade Import 概览](https://journalit.co/csv-import) 及各来源的指南，确认所需的导出格式。

没有你的经纪商？加入 [Discord](https://discord.gg/AkSw3D9h8b)，告诉我们你希望下一个支持谁。

<details>
<summary>搜索关键词</summary>

关键词: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, Trade Import, Trade Sync, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown, prop challenge, evaluation, funded phase, payout rules, daily loss limit

AI: MCP, Model Context Protocol, Obsidian MCP, AI trading journal, AI-assisted journaling, Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot

经纪商与平台: MetaTrader, MetaTrader 4, MT4 sync, MetaTrader 5 imports, IBKR, Interactive Brokers, Tradovate, cTrader, Hyperliquid, Rithmic, TopStepX, TradeZero, TradingView, TradingView Strategy Tester, Bybit, BloFin, Sierra Chart, MotiveWave, FX Replay, ATAS, Trading Technologies, DeepCharts, Breakout Terminal, Merrill Edge, PropReports

</details>

<details>
<summary>更多资源</summary>

- [工作原理（本地优先）](https://journalit.co/obsidian-trading-journal)
- [Trade Import 概览](https://journalit.co/csv-import)
- [MetaTrader 同步概览](https://journalit.co/metatrader-trading-journal)
- [与其他日志比较](https://journalit.co/compare)
- [Prop 挑战指南](https://journalit.co/docs/prop-challenges)

</details>

## 重要说明

- **本地优先核心**：核心日志可离线工作，并将你的笔记和交易保存在 Obsidian 仓库中。
- **完整访问需要账户**：需要 Journalit 账户才能使用基于身份验证和订阅限制的功能。
- **付费功能**：Trade Sync、确认 Trade Import 导入、经济日历及预填 prop firm 配置需要 Pro 订阅。登录后的免费用户可以分析和预览 Trade Import 文件。
- **网络使用**：Journalit 默认检查 GitHub 上的公开版本元数据以获取更新，不会发送 vault 或账户数据。登录后使用的功能可能会调用 Journalit 服务；MT4 同步使用托管 FTP，货币换算可能会使用第三方汇率服务。请参阅 [PRIVACY.md](PRIVACY.md)。
- **可选 AI 访问**：启用 MCP 并授权 AI 应用后，所请求的日志数据会通过 Journalit 服务与该应用共享。AI 提供商的隐私条款适用于应用读取的所有数据。你可以随时断开应用连接或关闭 MCP 访问。
- **Trade Import 处理**：分析和预览会将所选文件及导入选项发送到 Journalit。服务器端加密的诊断记录在免费账户下 1 天后到期，Pro 账户下 14 天后到期；保存的预览在 7 天后到期。兼容性指引随响应返回并在本地显示，客户端不会另外上传失败报告。参见 [PRIVACY.md](PRIVACY.md)。
- **其他网络诊断**：现有 Tradovate Sync 代码会按 [PRIVACY.md](PRIVACY.md) 所述发送客户端同步诊断事件，与 Trade Import 分开处理。升级按钮仅在点击时打开 journalit.co，并携带不含标识符的固定活动参数，用于服务器端归因。
- **源码可查看，专有许可证**：该插件是专有软件，但源码可供审查。
- **隐私详情**：请参阅 [PRIVACY.md](PRIVACY.md)，了解数据处理、保留和基础设施的详细信息。

## 许可证

此插件是源码可查看的专有软件。源码发布用于 Obsidian 审核和用户检查，但并非以开源许可证授权。允许的使用方式请参阅 LICENSE。

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
