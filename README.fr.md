<div align="center">

<img
  src="https://github.com/user-attachments/assets/ab7232d4-1352-4658-a284-86029c0246f1"
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
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[Installation](#installation) · [Courtiers pris en charge](#supported-brokers) · [Confidentialité](PRIVACY.md)

</div>

![Home View](https://github.com/user-attachments/assets/1d82c43a-9235-4659-85c2-eedf46bd34ac)

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
- **[Synchronisation MetaTrader 4/5](https://journalit.co/metatrader-trading-journal)** : import automatique des trades via FTP.

## Informations importantes

- **Cœur local-first** : le journal principal fonctionne hors ligne et stocke vos notes et trades dans votre coffre Obsidian.
- **Compte requis pour l’accès complet** : un compte Journalit est requis pour les fonctionnalités avec authentification et abonnement.
- **Fonctionnalités payantes** : un abonnement Pro est requis pour l’accès complet aux fonctionnalités Pro comme la synchronisation MetaTrader et Trade Import.
- **Utilisation réseau optionnelle** : le plugin utilise les services réseau de Journalit uniquement lorsque vous choisissez des fonctionnalités qui en dépendent. La connexion contacte Journalit pour la vérification d’e-mail, la validation du jeton et l’état de l’abonnement. Si vous utilisez ensuite MetaTrader sync ou Trade Import, le plugin se connecte aussi à l’API backend Journalit pour la coordination de synchronisation, la récupération des trades et l’import optionnel; MetaTrader sync utilise une infrastructure FTP gérée par Journalit. Journalit peut aussi demander des taux de change à un service tiers lorsque la conversion multidevise est nécessaire. Ces fonctionnalités sont optionnelles.
- **Source disponible, licence propriétaire** : le plugin est un logiciel propriétaire dont le code source peut être consulté.
- **Détails de confidentialité** : consultez [PRIVACY.md](PRIVACY.md).

<a id="screenshots"></a>

## Captures d’écran

### Tableau de bord de trading

![Trading Dashboard](https://github.com/user-attachments/assets/d5c7b636-b8f7-489a-a199-d1bba6958717)

### Constructeur de mise en page

![Layout Builder](https://github.com/user-attachments/assets/48bcc59a-2b17-4478-98b3-dce8677cca47)

![Layout Builder](https://github.com/user-attachments/assets/03f20e4b-37e7-43d9-94bf-fb444e43afbf)

### Journal des trades

![Trade Log](https://github.com/user-attachments/assets/84593d6b-9783-4df6-ad06-6201f101ffcd)

### Trade Import

![Trade Import](https://github.com/user-attachments/assets/68121823-8b24-4024-b676-a4199c81f207)

### Tableau de bord de compte

![Account Dashboard](https://github.com/user-attachments/assets/dbd1cd69-3f8b-4af8-883c-460dbfb8944b)

### Pages de compte

![Account Pages](https://github.com/user-attachments/assets/8eeb0f2d-a8d8-412e-bf23-cb21e3a0401b)

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
- [JDR Securities Limited](https://journalit.co/docs/broker-guides-jdr)

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
