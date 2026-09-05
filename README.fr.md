<div align="center">

<img
  src="https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/journalit-logo.png"
  alt="Journalit"
  width="420"
  style="max-width: 100%; height: auto;"
/>

Journal de trading local-first pour Obsidian.

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

[Installation](#installation) · [Courtiers pris en charge](#supported-brokers) · [Confidentialité](PRIVACY.md)

</div>

![Home View](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/home-view.png)

<a id="installation"></a>

## Installation

Installez Journalit depuis les plugins communautaires d’Obsidian :

1. Ouvrez **Paramètres → Plugins communautaires → Parcourir**
2. Recherchez `Journalit`
3. Cliquez sur **Installer**, puis sur **Activer**

Page communautaire: https://community.obsidian.md/plugins/journalit

## Points forts

- **Local-first** : le journal principal reste dans votre coffre Obsidian.
- **Tableau de bord Home View** : widgets déplaçables et heatmap de trading.
- **Tableau de bord de trading** : suivez les performances et les tendances en un coup d’œil.
- **Tableau de bord de compte** : conçu pour les objectifs de profit et drawdowns des prop firms.
- **Système de revue (V2)** : modèles quotidiens → annuels avec constructeur de mise en page.
- **[Trade Import](https://journalit.co/csv-import)** : imports alimentés par le backend pour CSV, feuilles de calcul, HTML et relevés de courtiers.
- **[Trade Sync](https://journalit.co/docs/trade-sync)** : synchronisation automatique des trades pour Tradovate et MT4.

## Informations importantes

- **Cœur local-first** : le journal principal fonctionne hors ligne et stocke vos notes et trades dans votre coffre Obsidian.
- **Compte requis pour l’accès complet** : un compte Journalit est requis pour les fonctionnalités avec authentification et abonnement.
- **Fonctionnalités payantes** : un abonnement Pro est requis pour l’accès complet aux fonctionnalités Pro comme la synchronisation MetaTrader et Trade Import.
- **Utilisation réseau optionnelle** : le plugin utilise les services réseau de Journalit uniquement lorsque vous choisissez des fonctionnalités qui en dépendent. La connexion contacte Journalit pour la vérification d’e-mail, la validation du jeton et l’état de l’abonnement. Si vous utilisez ensuite MetaTrader sync ou Trade Import, le plugin se connecte aussi à l’API backend Journalit pour la coordination de synchronisation, la récupération des trades et l’import optionnel; MetaTrader sync utilise une infrastructure FTP gérée par Journalit. Journalit peut aussi demander des taux de change à un service tiers lorsque la conversion multidevise est nécessaire. Ces fonctionnalités sont optionnelles.
- **Source disponible, licence propriétaire** : le plugin est un logiciel propriétaire dont le code source peut être consulté.
- **Détails de confidentialité** : consultez [PRIVACY.md](PRIVACY.md) pour les informations sur le traitement et la conservation des données, ainsi que sur l’infrastructure.

<a id="screenshots"></a>

## Captures d’écran

### Tableau de bord de trading

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setups

![Vue d’ensemble des setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Paires de setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Comparaison des setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Constructeur de mise en page

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Journal des trades et galerie

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Galerie](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

### Tableau de bord de compte

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

### Pages de compte

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

<a id="supported-brokers"></a>

## Courtiers pris en charge

Formats d’import de courtiers pris en charge :

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

Votre courtier manque ? Rejoignez [Discord](https://discord.gg/AkSw3D9h8b) et dites-nous lequel vous voulez ensuite.

<details>
<summary>Mots-clés de recherche</summary>

Keywords: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, MetaTrader, MT4 sync, MT5 sync, Trade Import, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown

</details>

<details>
<summary>Plus de ressources</summary>

- [Fonctionnement (local-first)](https://journalit.co/obsidian-trading-journal)
- [Présentation de Trade Import](https://journalit.co/csv-import)
- [Présentation de la synchronisation MetaTrader](https://journalit.co/metatrader-trading-journal)
- [Comparer avec d’autres journaux](https://journalit.co/compare)

</details>

## Licence

Ce plugin est un logiciel propriétaire à source disponible. Le code source est publié pour la revue Obsidian et l’inspection par les utilisateurs, mais il n’est pas sous licence open source. Consultez LICENSE pour les usages autorisés.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
