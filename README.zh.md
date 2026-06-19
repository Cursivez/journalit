<div align="center">

<img
  src="https://github.com/user-attachments/assets/ab7232d4-1352-4658-a284-86029c0246f1"
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
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[安装](#installation) · [支持的经纪商](#supported-brokers) · [隐私](PRIVACY.md)

</div>

![Home View](https://github.com/user-attachments/assets/1d82c43a-9235-4659-85c2-eedf46bd34ac)

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
- **账户仪表盘**：为 prop firm 盈利目标和回撤控制而构建。
- **复盘系统 (V2)**：从每日到每年的模板，并带有布局构建器。
- **[Trade Import](https://journalit.co/csv-import)**：由后端驱动，支持 CSV、电子表格、HTML 和经纪商报表导入。
- **[MetaTrader 4/5 同步](https://journalit.co/metatrader-trading-journal)**：通过 FTP 自动导入交易。

## 重要说明

- **本地优先核心**：核心日志可离线工作，并将你的笔记和交易保存在 Obsidian 仓库中。
- **完整访问需要账户**：需要 Journalit 账户才能使用基于身份验证和订阅限制的功能。
- **付费功能**：完整使用 MetaTrader 同步、Trade Import 等 Pro 功能需要 Pro 订阅。
- **可选网络使用**：只有当你选择使用依赖网络的功能时，插件才会使用 Journalit 网络服务。登录会联系 Journalit 服务以进行邮箱验证、令牌验证和订阅状态检查。若随后使用 MetaTrader sync 或 Trade Import，插件还会连接 Journalit 后端 API，用于同步协调、交易获取和可选的 Trade Import；MetaTrader sync 使用 Journalit 管理的 FTP 基础设施上传报表。当需要多币种换算时，Journalit 也可能向第三方汇率服务请求汇率。这些依赖网络的功能均为可选。
- **源码可查看，专有许可证**：该插件是专有软件，但源码可供审查。
- **隐私详情**：请参阅 [PRIVACY.md](PRIVACY.md)。

<a id="screenshots"></a>

## 截图

### 交易仪表盘

![Trading Dashboard](https://github.com/user-attachments/assets/d5c7b636-b8f7-489a-a199-d1bba6958717)

### 布局构建器

![Layout Builder](https://github.com/user-attachments/assets/48bcc59a-2b17-4478-98b3-dce8677cca47)

![Layout Builder](https://github.com/user-attachments/assets/03f20e4b-37e7-43d9-94bf-fb444e43afbf)

### 交易日志

![Trade Log](https://github.com/user-attachments/assets/84593d6b-9783-4df6-ad06-6201f101ffcd)

### Trade Import

![Trade Import](https://github.com/user-attachments/assets/68121823-8b24-4024-b676-a4199c81f207)

### 账户仪表盘

![Account Dashboard](https://github.com/user-attachments/assets/dbd1cd69-3f8b-4af8-883c-460dbfb8944b)

### 账户页面

![Account Pages](https://github.com/user-attachments/assets/8eeb0f2d-a8d8-412e-bf23-cb21e3a0401b)

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
- [JDR Securities Limited](https://journalit.co/docs/broker-guides-jdr)

没有你的经纪商？加入 [Discord](https://discord.gg/AkSw3D9h8b)，告诉我们你希望下一个支持谁。

<details>
<summary>搜索关键词</summary>

Keywords: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, MetaTrader, MT4 sync, MT5 sync, Trade Import, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown

</details>

<details>
<summary>更多资源</summary>

- [工作原理（本地优先）](https://journalit.co/obsidian-trading-journal)
- [Trade Import 概览](https://journalit.co/csv-import)
- [MetaTrader 同步概览](https://journalit.co/metatrader-trading-journal)
- [与其他日志比较](https://journalit.co/compare)

</details>

## 许可证

此插件是源码可查看的专有软件。源码发布用于 Obsidian 审核和用户检查，但并非以开源许可证授权。允许的使用方式请参阅 LICENSE。

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
