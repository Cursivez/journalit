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
  <a href="README.ta.md">தமிழ்</a> |
  <a href="README.ar.md">العربية</a>
</p>

[Installation](#installation) · [Apps d'IA (MCP)](#ai-apps-mcp) · [Courtiers pris en charge](#supported-brokers) · [Confidentialité](PRIVACY.md)

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
- **[Prop challenges](https://journalit.co/docs/prop-challenges)** : suivez les phases d’évaluation et funded, le drawdown, la perte journalière, les objectifs de profit et les règles de paiement, avec des profils de firmes pour les configurer.
- **Système de revue (V2)** : modèles quotidiens → annuels avec constructeur de mise en page.
- **[Trade Import](https://journalit.co/csv-import)** : imports alimentés par le backend pour CSV, feuilles de calcul, HTML et relevés de courtiers.
- **[Trade Sync](https://journalit.co/docs/trade-sync)** : synchronisation automatique des trades pour les courtiers pris en charge.
- **[Apps d'IA (MCP)](https://journalit.co/docs/ai-apps)**: connectez votre app d’IA pour analyser vos trades, préparer des bilans et mettre à jour votre journal.

<a id="screenshots"></a>

## Captures d’écran

### Tableau de bord de trading

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setups

![Vue d’ensemble des setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Paires de setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Comparaison des setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Comptes et prop challenges

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

### Constructeur de mise en page

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Journal des trades et galerie

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Galerie](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

<a id="ai-apps-mcp"></a>

## Apps d'IA (MCP)

Connectez Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot ou une autre app compatible à votre journal via MCP (Model Context Protocol). Demandez-lui d’analyser vos trades, de préparer un bilan hebdomadaire ou de modifier les champs du journal sans copier vos notes dans une conversation.

1. Connectez-vous à Journalit dans Obsidian. Ouvrez **Paramètres → Journalit → Apps d'IA (MCP)** et activez **Activer l'accès MCP**.
2. Ajoutez `https://api.journalit.co/mcp` comme serveur MCP distant dans votre app d’IA.
3. Connectez-vous à Journalit lorsque cela vous est demandé, choisissez votre coffre, vérifiez les autorisations demandées et approuvez la connexion.

Gardez Obsidian ouvert avec Journalit en cours d’exécution. Par défaut, les suppressions, les fusions et les modifications de grande ampleur nécessitent votre approbation.

Consultez le **[guide de configuration des apps d’IA](https://journalit.co/docs/ai-apps)** pour les étapes propres à chaque client, les autorisations, l’annulation des modifications et les limites mensuelles.

<a id="supported-brokers"></a>

## Courtiers pris en charge

Trade Sync établit une connexion continue. Trade Import lit des fichiers exportés. La prise en charge de l’un n’implique pas celle de l’autre.

### Trade Sync automatique

- [MetaTrader 4](https://journalit.co/docs/trade-sync-metatrader)
- [Tradovate](https://journalit.co/docs/trade-sync-tradovate)
- [cTrader](https://journalit.co/docs/trade-sync-ctrader)
- [Hyperliquid](https://journalit.co/docs/trade-sync-hyperliquid): contrats perpétuels réglés en USDC, en lecture seule

[Rithmic Trade Sync](https://journalit.co/docs/trade-sync-rithmic) est une préversion réservée aux testeurs approuvés. Les relevés MetaTrader 5 passent par Trade Import, et non par Trade Sync via FTP.

### Trade Import à partir de fichiers

Sources et formats d’export pris en charge :

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- TradingView: [historique des ordres Paper Trading](https://journalit.co/docs/broker-guides-tradingview) et List of Trades de Strategy Tester (backtests)
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
- [DeepCharts](https://journalit.co/docs/broker-guides-deepcharts): Trade List du Strategy Report
- [Breakout Terminal](https://journalit.co/docs/broker-guides-breakout-terminal): `trades.csv`
- Merrill Edge: activité du compte au format CSV
- PropReports: rapport Executions pour les actions

Utilisez Manual Mapping pour les autres fichiers compatibles. Consultez la [présentation de Trade Import](https://journalit.co/csv-import) et le guide de chaque source pour connaître l’export requis.

Votre courtier manque ? Rejoignez [Discord](https://discord.gg/AkSw3D9h8b) et dites-nous lequel vous voulez ensuite.

<details>
<summary>Mots-clés de recherche</summary>

Mots-clés: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, Trade Import, Trade Sync, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown, prop challenge, evaluation, funded phase, payout rules, daily loss limit

IA: MCP, Model Context Protocol, Obsidian MCP, AI trading journal, AI-assisted journaling, Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot

Courtiers et plateformes: MetaTrader, MetaTrader 4, MT4 sync, MetaTrader 5 imports, IBKR, Interactive Brokers, Tradovate, cTrader, Hyperliquid, Rithmic, TopStepX, TradeZero, TradingView, TradingView Strategy Tester, Bybit, BloFin, Sierra Chart, MotiveWave, FX Replay, ATAS, Trading Technologies, DeepCharts, Breakout Terminal, Merrill Edge, PropReports

</details>

<details>
<summary>Plus de ressources</summary>

- [Fonctionnement (local-first)](https://journalit.co/obsidian-trading-journal)
- [Présentation de Trade Import](https://journalit.co/csv-import)
- [Présentation de la synchronisation MetaTrader](https://journalit.co/metatrader-trading-journal)
- [Comparer avec d’autres journaux](https://journalit.co/compare)
- [Guide des prop challenges](https://journalit.co/docs/prop-challenges)

</details>

## Informations importantes

- **Cœur local-first** : le journal principal fonctionne hors ligne et stocke vos notes et trades dans votre coffre Obsidian.
- **Compte requis pour l’accès complet** : un compte Journalit est requis pour les fonctionnalités avec authentification et abonnement.
- **Fonctionnalités payantes** : un abonnement Pro est requis pour Trade Sync, la validation des imports Trade Import, le calendrier économique et les profils de prop firms préremplis. Les utilisateurs gratuits connectés peuvent analyser les fichiers Trade Import et en afficher un aperçu.
- **Utilisation du réseau** : Journalit vérifie par défaut les métadonnées publiques des versions GitHub pour les mises à jour, sans envoyer de données du coffre ni du compte. Les fonctionnalités utilisées après connexion peuvent faire appel aux services Journalit; la synchronisation MT4 utilise un FTP géré, et la conversion de devises peut utiliser un service de taux de change tiers. Consultez [PRIVACY.md](PRIVACY.md).
- **Accès facultatif à l’IA** : lorsque vous activez MCP et autorisez une app d’IA, les données demandées du journal lui sont transmises via les services de Journalit. Les conditions de confidentialité du fournisseur d’IA s’appliquent à toutes les données qu’elle lit. Vous pouvez déconnecter l’app ou désactiver l’accès MCP à tout moment.
- **Traitement de Trade Import** : l’analyse et l’aperçu envoient le fichier sélectionné et les options d’import à Journalit. Les captures de diagnostic chiffrées côté serveur expirent après 1 jour pour les comptes gratuits ou 14 jours pour Pro ; les aperçus enregistrés expirent après 7 jours. Les indications de compatibilité sont renvoyées dans ces réponses et affichées localement, sans envoi séparé de rapports d’erreur depuis le client. Voir [PRIVACY.md](PRIVACY.md).
- **Autres diagnostics réseau** : le code existant de Tradovate Sync transmet des événements de diagnostic de synchronisation du client comme indiqué dans [PRIVACY.md](PRIVACY.md), indépendamment de Trade Import. Les boutons de passage à une offre supérieure ouvrent journalit.co uniquement lors d’un clic, avec des paramètres de campagne fixes sans identifiants pour l’attribution côté serveur.
- **Source disponible, licence propriétaire** : le plugin est un logiciel propriétaire dont le code source peut être consulté.
- **Détails de confidentialité** : consultez [PRIVACY.md](PRIVACY.md) pour les informations sur le traitement et la conservation des données, ainsi que sur l’infrastructure.

## Licence

Ce plugin est un logiciel propriétaire à source disponible. Le code source est publié pour la revue Obsidian et l’inspection par les utilisateurs, mais il n’est pas sous licence open source. Consultez LICENSE pour les usages autorisés.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
