<div align="center">

<img
  src="https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/journalit-logo.png"
  alt="Journalit"
  width="420"
  style="max-width: 100%; height: auto;"
/>

Diario di trading local-first per Obsidian.

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

[Installazione](#installation) · [Broker supportati](#supported-brokers) · [Privacy](PRIVACY.md)

</div>

![Vista Home](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/home-view.png)

<a id="installation"></a>

## Installazione

Installa Journalit dai plugin della community di Obsidian:

1. Apri **Impostazioni → Plugin della community → Sfoglia**
2. Cerca `Journalit`
3. Fai clic su **Installa**, poi su **Abilita**

Pagina community: https://community.obsidian.md/plugins/journalit

## Punti di forza

- **Local-first**: il diario resta nel tuo vault Obsidian.
- **Vista Home**: widget trascinabili e heatmap di trading.
- **Dashboard di trading**: prestazioni e pattern a colpo d’occhio.
- **Dashboard conti**: pensata per target di profitto e drawdown delle prop firm.
- **Sistema di revisione (V2)**: modelli da giornaliero ad annuale con costruttore di layout.
- **[Trade Import](https://journalit.co/csv-import)**: import dal backend per CSV, fogli di calcolo, HTML e report del broker.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: sincronizzazione automatica delle operazioni per Tradovate e MT4.

## Informazioni importanti

- **Nucleo local-first**: il diario funziona offline e salva note e operazioni nel vault Obsidian.
- **Account per le funzioni online**: serve un account Journalit per autenticazione e abbonamento.
- **Funzioni a pagamento**: un abbonamento Pro è necessario per l’accesso completo alle funzioni Pro come la sincronizzazione MetaTrader e Trade Import.
- **Rete opzionale**: il plugin usa i servizi di rete Journalit solo se scegli funzioni che ne dipendono. L’accesso invia una richiesta a Journalit per verificare l’email, validare il token e controllare lo stato dell’abbonamento. Se poi usi MetaTrader sync o Trade Import, il plugin si collega anche all’API backend Journalit per coordinare la sincronizzazione, recuperare le operazioni e l’import opzionale; MetaTrader sync usa un’infrastruttura FTP gestita da Journalit. Journalit può anche richiedere tassi di cambio a un servizio terzo quando serve la conversione multivaluta. Queste funzioni sono facoltative.
- **Codice consultabile, licenza proprietaria**: il plugin è software proprietario con codice consultabile.
- **Dettagli sulla privacy**: consulta [PRIVACY.md](PRIVACY.md) per trattamento, conservazione dei dati e infrastruttura.

<a id="screenshots"></a>

## Screenshot

### Dashboard di trading

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setup

![Panoramica dei setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Coppie di setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Confronto dei setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Costruttore di layout

![Costruttore di layout](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Costruttore di layout](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Registro operazioni e galleria

![Registro operazioni](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Galleria](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

### Dashboard conti

![Dashboard conti](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

### Pagine conto

![Pagine conto](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

<a id="supported-brokers"></a>

## Broker supportati

Formati di import supportati:

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

Manca il tuo broker? Entra su [Discord](https://discord.gg/AkSw3D9h8b) e dimmi quale vuoi vedere dopo.

<details>
<summary>Parole chiave di ricerca</summary>

Parole chiave: obsidian diario di trading, plugin trading, tracker operazioni, template trading obsidian, analytics trading, MetaTrader, sync MT4, sync MT5, Trade Import, prop firm, prop firms, conto finanziato, target di profitto, trailing drawdown, max drawdown

</details>

<details>
<summary>Altre risorse</summary>

- [Come funziona (local-first)](https://journalit.co/obsidian-trading-journal)
- [Panoramica di Trade Import](https://journalit.co/csv-import)
- [Panoramica della sincronizzazione MetaTrader](https://journalit.co/metatrader-trading-journal)
- [Confronta con altri diari](https://journalit.co/compare)

</details>

## Licenza

Questo plugin è software proprietario a sorgente disponibile. Il codice è pubblicato per la revisione Obsidian e l’ispezione da parte degli utenti, ma non è in licenza open source. Consulta LICENSE per gli usi consentiti.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
