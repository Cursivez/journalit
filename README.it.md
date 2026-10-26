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
  <a href="README.ta.md">தமிழ்</a> |
  <a href="README.ar.md">العربية</a>
</p>

[Installazione](#installation) · [App di IA (MCP)](#ai-apps-mcp) · [Broker supportati](#supported-brokers) · [Privacy](PRIVACY.md)

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
- **[Challenge prop](https://journalit.co/docs/prop-challenges)**: monitora fasi di valutazione e funded, drawdown, perdita giornaliera, target di profitto e regole di payout, con profili delle firm per configurarli.
- **Sistema di revisione (V2)**: modelli da giornaliero ad annuale con costruttore di layout.
- **[Trade Import](https://journalit.co/csv-import)**: import dal backend per CSV, fogli di calcolo, HTML e report del broker.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: sincronizzazione automatica delle operazioni per i broker supportati.
- **[App di IA (MCP)](https://journalit.co/docs/ai-apps)**: collega la tua app di IA per analizzare le operazioni, preparare le revisioni e aggiornare il diario.

<a id="screenshots"></a>

## Screenshot

### Dashboard di trading

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setup

![Panoramica dei setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Coppie di setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Confronto dei setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Conti e challenge prop

![Dashboard conti](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

![Pagine conto](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

### Costruttore di layout

![Costruttore di layout](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Costruttore di layout](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Registro operazioni e galleria

![Registro operazioni](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Galleria](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

<a id="ai-apps-mcp"></a>

## App di IA (MCP)

Collega Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot o un’altra app compatibile al tuo diario tramite MCP (Model Context Protocol). Chiedile di analizzare le operazioni, preparare una revisione settimanale o aggiornare i campi del diario senza copiare le note in una chat.

1. Accedi a Journalit in Obsidian. Apri **Impostazioni → Journalit → App di IA (MCP)** e attiva **Attiva accesso MCP**.
2. Aggiungi `https://api.journalit.co/mcp` come server MCP remoto nella tua app di IA.
3. Quando richiesto, accedi a Journalit, scegli il vault, controlla le autorizzazioni richieste e approva la connessione.

Tieni Obsidian aperto con Journalit in esecuzione. Per impostazione predefinita, eliminazioni, unioni e modifiche di ampia portata richiedono la tua approvazione.

Consulta la **[guida alla configurazione delle app di IA](https://journalit.co/docs/ai-apps)** per le istruzioni dei singoli client, le autorizzazioni, l’annullamento delle modifiche e i limiti di utilizzo mensili.

<a id="supported-brokers"></a>

## Broker supportati

Trade Sync crea una connessione continua. Trade Import legge file esportati. Il supporto dell’uno non implica quello dell’altro.

### Trade Sync automatico

- [MetaTrader 4](https://journalit.co/docs/trade-sync-metatrader)
- [Tradovate](https://journalit.co/docs/trade-sync-tradovate)
- [cTrader](https://journalit.co/docs/trade-sync-ctrader)
- [Hyperliquid](https://journalit.co/docs/trade-sync-hyperliquid): contratti perpetui regolati in USDC, in sola lettura

[Rithmic Trade Sync](https://journalit.co/docs/trade-sync-rithmic) è un’anteprima riservata ai tester approvati. Gli estratti MetaTrader 5 si importano con Trade Import, non con Trade Sync basato su FTP.

### Trade Import da file

Fonti e formati di esportazione supportati:

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- TradingView: [cronologia degli ordini Paper Trading](https://journalit.co/docs/broker-guides-tradingview) e List of Trades di Strategy Tester (backtest)
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
- [DeepCharts](https://journalit.co/docs/broker-guides-deepcharts): Trade List dello Strategy Report
- [Breakout Terminal](https://journalit.co/docs/broker-guides-breakout-terminal): `trades.csv`
- Merrill Edge: attività del conto in CSV
- PropReports: report Executions per le azioni

Usa Manual Mapping per gli altri file compatibili. Consulta la [panoramica di Trade Import](https://journalit.co/csv-import) e la guida di ciascuna fonte per sapere quale esportazione serve.

Manca il tuo broker? Entra su [Discord](https://discord.gg/AkSw3D9h8b) e dimmi quale vuoi vedere dopo.

<details>
<summary>Parole chiave di ricerca</summary>

Parole chiave: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, Trade Import, Trade Sync, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown, prop challenge, evaluation, funded phase, payout rules, daily loss limit

IA: MCP, Model Context Protocol, Obsidian MCP, AI trading journal, AI-assisted journaling, Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot

Broker e piattaforme: MetaTrader, MetaTrader 4, MT4 sync, MetaTrader 5 imports, IBKR, Interactive Brokers, Tradovate, cTrader, Hyperliquid, Rithmic, TopStepX, TradeZero, TradingView, TradingView Strategy Tester, Bybit, BloFin, Sierra Chart, MotiveWave, FX Replay, ATAS, Trading Technologies, DeepCharts, Breakout Terminal, Merrill Edge, PropReports

</details>

<details>
<summary>Altre risorse</summary>

- [Come funziona (local-first)](https://journalit.co/obsidian-trading-journal)
- [Panoramica di Trade Import](https://journalit.co/csv-import)
- [Panoramica della sincronizzazione MetaTrader](https://journalit.co/metatrader-trading-journal)
- [Confronta con altri diari](https://journalit.co/compare)
- [Guida alle challenge prop](https://journalit.co/docs/prop-challenges)

</details>

## Informazioni importanti

- **Nucleo local-first**: il diario funziona offline e salva note e operazioni nel vault Obsidian.
- **Account per le funzioni online**: serve un account Journalit per autenticazione e abbonamento.
- **Funzioni a pagamento**: è necessario un abbonamento Pro per Trade Sync, la conferma delle importazioni con Trade Import, il calendario economico e i profili prop firm precompilati. Gli utenti gratuiti che hanno effettuato l’accesso possono analizzare i file di Trade Import e visualizzarne l’anteprima.
- **Uso della rete**: Journalit controlla per impostazione predefinita i metadati pubblici delle versioni GitHub per gli aggiornamenti, senza inviare dati del vault o dell’account. Le funzioni usate dopo l’accesso possono utilizzare i servizi Journalit; la sincronizzazione MT4 usa un FTP gestito e la conversione di valuta può usare un servizio di cambio esterno. Consulta [PRIVACY.md](PRIVACY.md).
- **Accesso facoltativo all’IA**: quando attivi MCP e autorizzi un’app di IA, i dati richiesti del diario vengono condivisi con l’app tramite i servizi di Journalit. Le condizioni sulla privacy del fornitore di IA si applicano a tutto ciò che l’app legge. Puoi scollegare l’app o disattivare l’accesso MCP in qualsiasi momento.
- **Elaborazione di Trade Import**: l’analisi e l’anteprima inviano a Journalit il file selezionato e le opzioni di importazione. Le acquisizioni diagnostiche crittografate sul server scadono dopo 1 giorno per gli account gratuiti o 14 giorni per Pro; le anteprime salvate scadono dopo 7 giorni. Le indicazioni di compatibilità vengono restituite nelle risposte e mostrate localmente, senza un caricamento separato di segnalazioni di errore dal client. Vedi [PRIVACY.md](PRIVACY.md).
- **Altra diagnostica di rete**: il codice esistente di Tradovate Sync invia eventi diagnostici di sincronizzazione del client come indicato in [PRIVACY.md](PRIVACY.md), separatamente da Trade Import. I pulsanti di upgrade aprono journalit.co solo quando vengono premuti, con parametri di campagna fissi e senza identificatori per l’attribuzione sul server.
- **Codice consultabile, licenza proprietaria**: il plugin è software proprietario con codice consultabile.
- **Dettagli sulla privacy**: consulta [PRIVACY.md](PRIVACY.md) per trattamento, conservazione dei dati e infrastruttura.

## Licenza

Questo plugin è software proprietario a sorgente disponibile. Il codice è pubblicato per la revisione Obsidian e l’ispezione da parte degli utenti, ma non è in licenza open source. Consulta LICENSE per gli usi consentiti.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
