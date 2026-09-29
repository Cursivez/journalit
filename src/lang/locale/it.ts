

import type { Lang } from './en';

const it: Lang = {
  'templateEditor.widget.session-log.hide-empty-outside':
    'Nascondi il registro fuori sessione quando è vuoto',
  'widget.mfeScatter.name': 'MFE vs PnL realizzato',
  'widget.mfeScatter.description':
    'Massimo profitto aperto vs P&L finale per trade',
  'widget.mfeScatter.y': 'PnL realizzato ({unit})',
  'widget.mfeScatter.winners': 'Vincenti',
  'widget.mfeScatter.losers': 'Perdenti',
  'widget.mfeScatter.breakeven': 'Pareggio',
  'widget.mfeScatter.empty':
    'Nessuna operazione chiusa con MFE disponibile in questa unità.',

  'trade.broker-synced-at': 'Broker sincronizzato {date}',
  'trade-sync.tradovate.status.setup-required':
    'Configurazione del conto richiesta',
  'trade-sync.tradovate.status.connecting': 'Connessione in corso',
  'trade-sync.tradovate.status.paused': 'In pausa',
  'trade-sync.tradovate.status.reauthorization-required':
    'Nuova autorizzazione richiesta',
  'trade-sync.tradovate.status.deleting': 'Eliminazione dati cloud',
  'trade-sync.tradovate.status.error': 'Errore di connessione',

  'trade-sync.tradovate.sync-complete-connection':
    'Sincronizzazione di {connection} completata.',
  'trade-sync.tradovate.sync-partial-connection':
    'Sincronizzazione di {connection} completata con problemi.',
  'trade-sync.tradovate.sync-all': 'Sincronizza tutto',
  'trade-sync.tradovate.sync-all-complete':
    'Sincronizzate {succeeded} di {total} connessioni Tradovate.',
  'trade-sync.tradovate.sync-all-partial':
    'Sincronizzate {succeeded} di {total} connessioni Tradovate. Controlla le connessioni con problemi.',
  'trade-sync.tradovate.connect-another': 'Connetti un altro conto Tradovate',
  'trade-sync.tradovate.no-connections':
    'Connetti un conto Tradovate su Journalit.co per configurarlo e sincronizzarlo qui.',
  'trade-sync.tradovate.claimed-by-connection':
    'La sincronizzazione è attiva tramite {connection}. Disattivala lì prima di cambiare questo conto.',
  'trade-sync.tradovate.claim-conflict':
    "Un'altra connessione Tradovate ha reclamato questo conto. Controlla le schede di connessione aggiornate prima di riprovare.",
  'trade-sync.tradovate.reconciliation-issues':
    '{count} problemi di riconciliazione',
  'trade-sync.tradovate.website-connection-description':
    'Connetti o riautorizza Tradovate in modo sicuro su Journalit.co, poi torna qui per scegliere i conti e sincronizzare il vault.',
  'trade-sync.tradovate.paused-website-description':
    'Questa connessione Tradovate è in pausa. Gestiscila su Journalit.co per controllarla o riprenderla.',
  'trade-sync.tradovate.plugin-sync-description':
    "Una sincronizzazione recupera l'attività Tradovate più recente e scrive le operazioni risultanti in questo vault.",
  'trade-sync.tradovate.connect': 'Connetti',
  'trade-sync.tradovate.manage-connection': 'Gestisci connessione',
  'trade-sync.tradovate.setup-guide': 'Guida alla configurazione',
  'trade-sync.tradovate.setup-and-sync':
    'Completa la configurazione e sincronizza',
  'trade-sync.tradovate.sync-to-vault': 'Sincronizza',
  'trade-sync.tradovate.discovery-description':
    'Journalit deve scoprire i conti Demo e Reali disponibili tramite la tua connessione Tradovate.',
  'trade-sync.tradovate.discover-accounts': 'Scopri i conti Tradovate',
  'trade-sync.tradovate.discovering': 'Ricerca conti…',
  'trade-sync.tradovate.discovery-failed':
    'Ricerca dei conti Tradovate non riuscita. Riprova o gestisci la connessione su Journalit.co.',
  'trade-sync.tradovate.sync-account': 'Includi nella sincronizzazione',
  'trade-sync.tradovate.history-label': 'Storico iniziale',
  'trade-sync.tradovate.history-all': 'Tutto lo storico disponibile',
  'trade-sync.tradovate.history-recent': 'Ultimi 90 giorni',
  'trade-sync.tradovate.history-custom': 'Da una data specifica',
  'trade-sync.tradovate.history-new': 'Solo operazioni nuove',
  'trade-sync.tradovate.start-date': 'Data di inizio',

  'trade-sync.tradovate.mapping-required':
    'Scegli un conto locale del vault per ogni conto Tradovate attivato.',
  'trade-sync.tradovate.custom-date-required':
    'Scegli una data di inizio per ogni selezione di storico personalizzata.',
  'trade-sync.tradovate.recovery-title':
    'Ripristina le note delle operazioni mancanti',
  'trade-sync.tradovate.recovery-count':
    '{count} note di operazioni da ripristinare',
  'trade-sync.tradovate.recovery-select-account':
    'Seleziona un conto locale prima di ripristinare le note delle operazioni.',
  'trade-sync.tradovate.recovery-confirm':
    'Ripristinare {count} note di operazioni in {account}?',

  'trade-sync.ctrader.status.setup-required':
    'Configurazione del conto richiesta',
  'trade-sync.ctrader.status.connecting': 'Connessione in corso',
  'trade-sync.ctrader.status.paused': 'In pausa',
  'trade-sync.ctrader.status.reauthorization-required':
    'Nuova autorizzazione richiesta',
  'trade-sync.ctrader.status.deleting': 'Eliminazione dati cloud',
  'trade-sync.ctrader.status.error': 'Errore di connessione',
  'trade-sync.ctrader.sync-complete-connection':
    'Sincronizzazione di {connection} completata.',
  'trade-sync.ctrader.sync-partial-connection':
    'Sincronizzazione di {connection} completata con problemi.',
  'trade-sync.ctrader.sync-all': 'Sincronizza tutto',
  'trade-sync.ctrader.sync-all-complete':
    'Sincronizzate {succeeded} di {total} connessioni cTrader.',
  'trade-sync.ctrader.sync-all-partial':
    'Sincronizzate {succeeded} di {total} connessioni cTrader. Controlla le connessioni con problemi.',
  'trade-sync.ctrader.connect-another': 'Connetti un altro conto cTrader',
  'trade-sync.ctrader.no-connections':
    'Connetti un conto cTrader su Journalit.co per configurarlo e sincronizzarlo qui.',
  'trade-sync.ctrader.claimed-by-connection':
    'La sincronizzazione è attiva tramite {connection}. Disattivala lì prima di cambiare questo conto.',
  'trade-sync.ctrader.claim-conflict':
    "Un'altra connessione cTrader ha reclamato questo conto. Controlla le schede di connessione aggiornate prima di riprovare.",
  'trade-sync.ctrader.reconciliation-issues':
    '{count} problemi di riconciliazione',
  'trade-sync.ctrader.website-connection-description':
    'Connetti o riautorizza cTrader in modo sicuro su Journalit.co, poi torna qui per scegliere i conti e sincronizzare il vault.',
  'trade-sync.ctrader.plugin-sync-description':
    "Una sincronizzazione recupera l'attività cTrader più recente e scrive le operazioni risultanti in questo vault.",
  'trade-sync.ctrader.connect': 'Connetti',
  'trade-sync.ctrader.manage-connection': 'Gestisci connessione',
  'trade-sync.ctrader.setup-guide': 'Guida alla configurazione',
  'trade-sync.ctrader.setup-and-sync':
    'Completa la configurazione e sincronizza',
  'trade-sync.ctrader.sync-to-vault': 'Sincronizza',
  'trade-sync.ctrader.discovery-description':
    'Journalit deve scoprire i conti Demo e Reali disponibili tramite la tua connessione cTrader.',
  'trade-sync.ctrader.discover-accounts': 'Scopri i conti cTrader',
  'trade-sync.ctrader.discovering': 'Ricerca conti…',
  'trade-sync.ctrader.discovery-failed':
    'Ricerca dei conti cTrader non riuscita. Riprova o gestisci la connessione su Journalit.co.',
  'trade-sync.ctrader.sync-account': 'Includi nella sincronizzazione',
  'trade-sync.ctrader.history-label': 'Storico iniziale',
  'trade-sync.ctrader.history-all': 'Tutto lo storico disponibile',
  'trade-sync.ctrader.history-recent': 'Ultimi 90 giorni',
  'trade-sync.ctrader.history-custom': 'Da una data specifica',
  'trade-sync.ctrader.history-new': 'Solo operazioni nuove',
  'trade-sync.ctrader.start-date': 'Data di inizio',
  'trade-sync.ctrader.mapping-required':
    'Scegli un conto locale del vault per ogni conto cTrader attivato.',
  'trade-sync.ctrader.custom-date-required':
    'Scegli una data di inizio per ogni selezione di storico personalizzata.',
  'trade-sync.ctrader.recovery-title':
    'Ripristina le note delle operazioni mancanti',
  'trade-sync.ctrader.recovery-count':
    '{count} note di operazioni da ripristinare',
  'trade-sync.ctrader.recovery-select-account':
    'Seleziona un conto locale prima di ripristinare le note delle operazioni.',
  'trade-sync.ctrader.recovery-confirm':
    'Ripristinare {count} note di operazioni in {account}?',
  'trade-sync.oauth.remap.title': 'Change account',
  'trade-sync.oauth.remap.message':
    'Use {newAccount} for existing notes too? Otherwise, only future broker updates will use it.',
  'trade-sync.oauth.remap.update-notes': 'Update notes',
  'trade-sync.oauth.remap.future-only': 'Future updates only',
  'trade-sync.oauth.remap.unavailable':
    'Account remapping is unavailable. Update the Journalit server and try again.',
  'trade-sync.oauth.remap.restore-in-progress':
    'Wait for Restore to finish, then try again.',
  'trade-sync.oauth.remap.operation-conflict':
    'That remap request conflicted with an earlier attempt. Try again.',
  'trade-sync.oauth.remap.account-busy':
    'This account is busy synchronizing. Retry shortly.',
  'trade-sync.oauth.remap.account-unavailable':
    'This account is no longer available. Refresh and try again.',
  'trade-sync.oauth.remap.preserved-conflicts':
    '{count} existing conflict(s) were left unchanged.',
  'trade-sync.oauth.remap.notes-pending':
    '{count} existing note update(s) are still pending. Synchronize again to retry.',
  'trade-sync.source.ctrader': 'cTrader',
  'trade-sync.source.ctrader.description':
    'Sincronizza le operazioni cTrader nel cloud e proiettale in questo vault.',
  'trade-sync.ctrader.status-failed': 'Impossibile caricare lo stato cTrader.',
  'trade-sync.ctrader.last-sync': 'Ultima sincronizzazione',
  'trade-sync.ctrader.pending-acks': '{count} ACK locali in sospeso',
  'trade-sync.ctrader.never': 'Mai',

  'command.add-trade': 'Aggiungi nuova operazione',
  'command.import-trades-csv': 'Apri Trade Import',
  'command.create-drc': 'Apri DRC',
  'command.create-weekly-review': 'Apri revisione settimanale',
  'command.create-monthly-review': 'Apri revisione mensile',
  'command.create-quarterly-review': 'Apri revisione trimestrale',
  'command.create-yearly-review': 'Apri revisione annuale',
  'command.open-dashboard': 'Apri dashboard',
  'command.open-account-dashboard': 'Apri conti',
  'command.open-trade-log': 'Apri registro operazioni',
  'command.open-home': 'Apri Home',
  'command.open-settings': 'Apri impostazioni',
  'command.open-position-size-calculator':
    'Apri calcolatore della dimensione della posizione',
  'command.replay-onboarding': 'Ripeti il flusso di avvio',
  'command.replay-current-view-guide': 'Ripeti la guida della vista attuale',
  'command.open-release-notes': 'Visualizza note di versione',
  'command.open-layout-builder': 'Apri costruttore di layout',
  'notice.guide.replay-unavailable':
    'Il sistema delle guide non è ancora pronto. Riprova.',
  'notice.guide.no-active-view':
    'Apri prima una vista Journalit supportata, poi esegui questo comando.',
  'notice.guide.no-guide-for-view':
    'Nessuna guida è ancora registrata per questa vista ({viewType}).',
  'notice.guide.unavailable-in-current-state':
    'La guida di questa vista non è disponibile nel suo stato attuale.',
  'notice.guide.replay-failed': 'Impossibile avviare la guida. Riprova.',
  'notice.guide.replay-started': 'Guida riavviata per questa vista.',
  'template.switch-title': 'Cambia layout',
  'template.switch-review-title': 'Cambia layout {type}',

  'template.review-type.drc': 'DRC',
  'template.review-type.weekly': 'settimanale',
  'template.review-type.monthly': 'mensile',
  'template.review-type.quarterly': 'trimestrale',
  'template.review-type.yearly': 'annuale',
  'template.review-type.review': 'revisione',
  'template.builder.select-template': 'Seleziona un layout da modificare',
  'template.builder.loading': 'Caricamento costruttore di layout...',
  'template.builder.create-from-sidebar':
    'Oppure creane uno nuovo dalla barra laterale',
  'template.builder.snippet-coming-soon': 'Editor di snippet in arrivo',
  'template.preview.empty': 'Nessun widget in questo layout',
  'template.preview.summary': 'Layout {type} - {count} widget',
  'template.preview.mode': 'Modalità anteprima',
  'template.preview.markdown-zone-placeholder': 'Zona Markdown — scrivi qui',
  'template.preview.markdown-zone-placeholder-with-id':
    'Zona Markdown ({id}) — scrivi qui',
  'template.preview.widget.game-performance-desc':
    'Distribuzioni dei voti mentali/tecnici',
  'template.preview.widget.unknown-desc': 'Tipo di widget sconosciuto',
  'template.section.forecast': 'Previsione',
  'template.section.performance': 'Prestazioni',
  'template.section.review': 'Revisione',
  'template.question.drc.q1': 'Cosa ho fatto bene oggi?',
  'template.question.drc.q2': 'Cosa potrei migliorare?',
  'template.question.drc.q3': 'Su cosa mi concentrerò nella prossima sessione?',
  'template.question.weekly.q1': 'Cosa ha funzionato bene questa settimana?',
  'template.question.weekly.q2': 'Cosa non ha funzionato questa settimana?',
  'template.question.weekly.q3': 'Quali setup sono stati più redditizi?',
  'template.question.weekly.q4': 'Quali errori mi sono costati di più?',
  'template.question.weekly.q5':
    'Cosa potrei migliorare per la prossima settimana?',
  'template.question.monthly.q1':
    'Quali sono state le lezioni chiave di questo mese?',
  'template.question.monthly.q2': 'Quali strategie hanno reso meglio?',
  'template.question.monthly.q3': 'Quali pattern noto nel mio trading?',
  'template.question.monthly.q4':
    'Quali sono i miei obiettivi per il prossimo mese?',
  'template.question.monthly.q5':
    'Come posso migliorare la gestione del rischio?',
  'template-picker.empty': 'Nessun layout disponibile.',
  'template-picker.close': 'Chiudi',
  'template-picker.built-in': '(integrato)',
  'template-picker.badge.default': 'Predefinito',
  'template-picker.badge.current': 'Attuale',
  'template-picker.cancel': 'Annulla',
  'auth.title.already-logged-in': "Hai già effettuato l'accesso",
  'auth.desc.already-logged-in': "Hai già effettuato l'accesso{email}.",
  'auth.title.sign-in': 'Accedi a Journalit',

  'auth.label.email': 'Indirizzo email',

  'auth.button.send-code': 'Invia codice di verifica',

  'auth.label.code': 'Codice di verifica',

  'auth.button.verify': 'Verifica e accedi',

  'auth.button.resend': 'Reinvia codice',

  'auth.error.needs-premium': 'Funzionalità Pro',

  'auth.error.network-error': 'Errore di connessione',

  'form.modal.unsaved-changes.title': 'Modifiche non salvate',
  'form.modal.unsaved-changes.body1':
    'Hai modifiche non salvate nel modulo operazione.',
  'form.modal.unsaved-changes.body2':
    'Sei sicuro di voler chiudere senza salvare?',
  'form.modal.unsaved-changes.continue': 'Continua a modificare',
  'form.modal.unsaved-changes.discard': 'Scarta le modifiche',
  'template-builder.modal.unsaved-changes.title': 'Modifiche non salvate',
  'template-builder.modal.unsaved-changes.body1':
    'Hai modifiche non salvate in questo layout.',
  'template-builder.modal.unsaved-changes.body2':
    'Sei sicuro di voler cambiare senza salvare?',
  'template-builder.modal.unsaved-changes.continue': 'Continua a modificare',
  'template-builder.modal.unsaved-changes.discard': 'Scarta le modifiche',
  'template-builder.modal.delete.title': 'Elimina layout',
  'template-builder.modal.delete.body':
    'Sei sicuro di voler eliminare "{name}"?',
  'template-builder.modal.delete.warning':
    'Questa azione non può essere annullata.',
  'template-builder.modal.delete.cancel': 'Annulla',
  'template-builder.modal.delete.confirm': 'Elimina',
  'tradelog.settings.modal.unsaved-changes.body1':
    'Hai modifiche non salvate nelle impostazioni delle colonne.',
  'tradelog.settings.modal.unsaved-changes.body2':
    'Sei sicuro di voler chiudere senza salvare?',
  'notice.error.missed-trade-service-init':
    'Il servizio delle operazioni perse non è inizializzato. Attendi un momento e riprova.',
  'notice.error.backtest-trade-service-init':
    'Il servizio delle operazioni Backtest non è inizializzato. Attendi un momento e riprova.',
  'notice.trade-updated': '{type} aggiornato: {path}',
  'notice.trade-created': '{type} creato: {path}',
  'notice.new-trade-created':
    '📈 Nuova operazione creata: {instrument} {direction}',
  'notice.error.trade-update-failed': 'Impossibile aggiornare {type}: {error}',
  'notice.error.trade-create-failed': 'Impossibile creare {type}: {error}',
  'form.section.trade-details': "Dettagli dell'operazione",
  'form.section.trading-costs': 'Costi di trading',
  'form.section.risk-management': 'Gestione del rischio',
  'form.section.take-profits': 'Take profit',
  'form.section.analysis-thesis': 'Analisi e tesi',
  'form.section.custom-fields': 'Campi personalizzati',

  'form.section.custom-fields-empty-title': 'Nessun campo avanzato per ora.',
  'form.section.custom-fields-empty-desc':
    'Registra tutto ciò che i campi integrati non coprono, come sessione, timeframe o qualità del setup. I campi personalizzati vengono salvati con ogni operazione e possono diventare colonne ordinabili nel registro operazioni.',
  'form.section.attachments': 'Allegati',
  'form.tab.basic': 'Base',
  'form.tab.details': 'Dettagli',
  'form.tab.advanced': 'Avanzate',
  'form.import-shortcut.open': 'Importa operazioni',
  'form.manual-import-nudge.title.one':
    'Suggerimento: hai inserito {count} operazione a mano',
  'form.manual-import-nudge.title.few':
    'Suggerimento: hai inserito {count} operazioni a mano',
  'form.manual-import-nudge.title.many':
    'Suggerimento: hai inserito {count} operazioni a mano',
  'form.manual-import-nudge.title.other':
    'Suggerimento: hai inserito {count} operazioni a mano',
  'form.manual-import-nudge.body':
    'L’importazione operazioni può portare in blocco lo storico del tuo broker o di un foglio di calcolo, invece di un’operazione alla volta.',
  'form.manual-import-nudge.cta': 'Anteprima delle mie operazioni',
  'form.manual-import-nudge.dismiss': 'Non ora',
  'form.layout.customize': 'Personalizza modulo',
  'form.layout.modal-title': 'Personalizza il modulo operazione',
  'form.layout.settings-title': 'Layout del modulo operazione',

  'form.layout.input-mode': 'Modalità di inserimento',
  'form.layout.input-mode-prices': 'Prezzi',
  'form.layout.input-mode-pnl-risk': 'P&L + Rischio',
  'form.layout.input-mode-prices-desc':
    'Prezzi di ingresso/uscita. Journalit calcola il P&L.',
  'form.layout.input-mode-pnl-risk-desc':
    'P&L + rischio diretti. Journalit mostra R.',
  'form.layout.asset-type-mode': 'Tipo di asset',
  'form.layout.asset-type-mode-show': 'Chiedi ogni volta',
  'form.layout.asset-type-mode-fixed': 'Fisso',
  'form.layout.default-asset-type': 'Tipo di asset predefinito',
  'form.layout.active-fields': 'Blocchi visibili',
  'form.layout.available-fields': 'Blocchi nascosti',
  'form.layout.active-fields-desc': 'Trascina per riordinare.',
  'form.layout.available-fields-desc': 'Aggiungi di nuovo i blocchi nascosti.',
  'form.layout.empty-active': 'Nessun blocco opzionale è visibile.',
  'form.layout.all-active': 'Tutti i blocchi opzionali sono visibili.',
  'form.layout.add-field-aria': 'Aggiungi {field} al modulo operazione',
  'form.layout.remove-field-aria': 'Nascondi {field} nel modulo operazione',
  'form.layout.saved': 'Layout del modulo operazione salvato',
  'form.layout.item.trading-costs.commission': 'Commissione',
  'form.layout.item.import-shortcut': 'Pulsante Importa',
  'form.layout.item.import-shortcut-desc':
    'Mostra un pulsante nel piè di pagina che apre Trade Import.',
  'form.layout.item.core-details': "Dettagli principali dell'operazione",
  'form.layout.item.core-details-desc':
    'Conto, strumento, direzione e campi di ingresso/uscita restano in cima.',
  'form.layout.item.asset-specific': "Campi specifici dell'asset",
  'form.layout.item.pnl-preview': 'Anteprima P&L',

  'form.layout.item.trade-currency': "Valuta dell'operazione / Tasso FX",
  'form.layout.item.trade-currency-desc':
    "Inserisci un'operazione in un'altra valuta con un tasso FX manuale opzionale.",
  'form.layout.item.exchange-desc':
    'Campo borsa per le operazioni su azioni e cripto.',
  'form.layout.item.direct-pnl-toggle-desc':
    'Passa a inserire il P&L totale di una singola operazione invece dei prezzi di uscita.',
  'form.layout.manual-fx-rate': 'Tasso FX personalizzato',
  'form.layout.result-r': 'Risultato in R',
  'form.layout.entry-time': "Orario dell'operazione",
  'form.field.account': 'Conto',
  'form.field.asset-type': 'Tipo di asset',
  'form.field.asset-type.stock': 'Azioni',
  'form.field.asset-type.options': 'Opzioni',
  'form.field.asset-type.futures': 'Futures',
  'form.field.asset-type.forex': 'Forex',
  'form.field.asset-type.crypto': 'Crypto',
  'form.field.asset-type.cfd': 'CFD',
  'form.field.direction': 'Direzione',
  'form.field.direction.long': 'Long',
  'form.field.direction.short': 'Short',
  'form.field.commission': 'Commissione',
  'form.field.commission-type': 'Tipo',
  'form.field.rebate': 'Ristorno',
  'form.field.swap': 'Swap',

  'form.field.other-fees': 'Altre spese',
  'form.field.stop-loss': 'Stop loss',
  'form.field.take-profit': 'Take profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Prezzo obiettivo',
  'form.field.close-percent': '% di chiusura',
  'form.field.close-size': 'Dimensione di chiusura',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': 'Quantità di chiusura del take profit come',
  'form.layout.take-profit-unit-percent': '% di chiusura',
  'form.layout.take-profit-unit-size': 'Dimensione',
  'trade.validation.take-profit-size-number':
    'La dimensione del take profit deve essere un numero valido.',
  'trade.validation.take-profit-size-positive':
    'La dimensione del take profit deve essere maggiore di 0.',
  'trade.validation.take-profit-total-size-range':
    'Le dimensioni dei take profit non possono superare la dimensione della posizione.',
  'form.field.risk-amount': 'Importo a rischio',
  'form.field.profit-loss': 'Profitto/Perdita',
  'form.field.total-pnl': "P&L dell'operazione",
  'form.field.realized-pnl': 'P&L realizzato',
  'form.field.floating-pnl': 'P&L non realizzato',
  'form.field.total-costs': 'Costi totali:',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Errore',
  'form.field.custom-tags': 'Tag personalizzati',
  'form.field.trade-thesis': "Tesi dell'operazione",
  'form.field.time': 'Orario',
  'form.field.price': 'Prezzo',

  'form.field.entries': 'Ingressi',
  'form.field.exits': 'Uscite',
  'form.field.dividends': 'Dividendi',
  'form.field.dividend-amount': 'Importo dividendo',
  'form.field.optional': '(opzionale)',
  'form.field.closed': 'chiusa',
  'form.field.incl-costs': '(inclusi i costi)',
  'form.field.commission-type.fixed': 'Fisso',
  'form.field.commission-type.percentage': 'Percentuale (%)',
  'form.calculated': 'Calcolato',
  'form.account-empty-state.title': 'Configura il tuo primo conto',
  'form.account-empty-state.description':
    'I conti tracciano il saldo così Journalit può calcolare rendimenti, rischio e drawdown. Per crearne uno basta un nome.',
  'form.account-empty-state.create-account': 'Crea conto',
  'form.account-empty-state.submit-disabled':
    'Crea prima un conto per salvare questa operazione.',
  'form.empty.take-profits': 'Nessun obiettivo take profit',
  'form.action.add-take-profit': 'Aggiungi take profit',
  'form.action.remove-take-profit': 'Rimuovi take profit',
  'form.field.position-size': 'Dimensione della posizione',
  'form.field.position-size.shares': 'Azioni',
  'form.field.position-size.contracts': 'Contratti',
  'form.field.position-size.lots': 'Lotti',
  'form.field.position-size.amount': 'Importo',
  'form.field.position-size.cfd-units': 'Unità CFD',
  'form.field.instrument': 'Strumento',
  'form.field.instrument.ticker': 'Simbolo',
  'form.field.instrument.option-symbol': 'Simbolo opzione',
  'form.field.instrument.future-symbol': 'Simbolo future',
  'form.field.instrument.forex-pair': 'Coppia Forex',
  'form.field.instrument.crypto-symbol': 'Simbolo crypto',
  'form.field.instrument.cfd-symbol': 'Simbolo CFD',
  'form.field.exchange': 'Borsa',
  'form.field.expiration-date': 'Data di scadenza',
  'form.field.strike-price': 'Prezzo strike',
  'form.field.contract-size': 'Dimensione del contratto',
  'form.field.option-type': 'Tipo di opzione',
  'form.field.option-type.call': 'Call',
  'form.field.option-type.put': 'Put',
  'form.field.dollars-per-point': 'Dollari per punto',
  'form.field.tick-size': 'Dimensione tick',
  'form.field.tick-value': 'Valore tick',
  'form.field.lot-size': 'Dimensione lotto',
  'form.field.custom-lot-size': 'Dimensione lotto personalizzata',
  'form.field.pip-value': 'Valore pip',
  'form.field.leverage-ratio': 'Rapporto di leva',
  'form.field.trade-currency': "Valuta dell'operazione",
  'form.field.fx-rate': 'Tasso FX verso {base}',
  'form.field.fx-rate-override': 'Tasso FX personalizzato ({quote} → {base})',
  'form.forex.using-manual-rate': 'Uso del tasso FX manuale',
  'form.field.lot-size.standard': 'Standard (100,000)',
  'form.field.lot-size.mini': 'Mini (10,000)',
  'form.field.lot-size.micro': 'Micro (1,000)',
  'form.field.lot-size.custom': 'Personalizzato',
  'form.field.image-url-placeholder':
    "Incolla l'URL del media o il percorso del file...",
  'form.field.image-duplicate-error': 'Questa immagine è già stata aggiunta.',
  'form.field.trade-image-alt': "Immagine dell'operazione",

  'form.field.value-dollar': 'Valore ($)',
  'form.field.dollar-amount-placeholder': 'Importo in dollari',
  'form.field.direct-pnl-placeholder':
    "Inserisci l'importo del profitto o della perdita",

  'form.field.mae-placeholder-currency': 'Drawdown massimo in {currency}',
  'form.field.mfe-placeholder-currency': 'Profitto massimo in {currency}',
  'form.placeholder.select-accounts': 'Seleziona conti',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': 'Ristorno/credito sulle commissioni',
  'form.placeholder.swap': 'Finanziamento overnight',
  'form.placeholder.other-fees': 'Spese di piattaforma/regolamentari',
  'form.placeholder.dividend-amount':
    'Importo in contanti, positivo o negativo',
  'form.placeholder.stop-loss': 'Prezzo stop loss opzionale',
  'form.placeholder.target-price': 'Prezzo obiettivo',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': 'Rischio pianificato in valuta',
  'form.placeholder.fx-rate':
    '1 {currency} = ? {base} (vuoto: tasso giornaliero)',
  'form.placeholder.custom-tag': 'Digita un tag personalizzato e premi Invio',
  'form.placeholder.thesis': 'Inserisci la tesi per questa operazione...',

  'form.placeholder.exchange-stock': 'es. NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'es. Binance, Coinbase',
  'form.placeholder.futures-point-value': 'es.: 50 per ES1',
  'form.placeholder.leverage': 'es. 100 per 1:100',
  'form.entry-exit.add-entry': '+ Aggiungi ingresso',
  'form.entry-exit.add-exit': '+ Aggiungi uscita',
  'form.entry-exit.remove-entry': 'Rimuovi ingresso',
  'form.entry-exit.remove-exit': 'Rimuovi uscita',
  'form.dividends.add-dividend': '+ Aggiungi dividendo',
  'form.dividends.remove-dividend': 'Rimuovi dividendo',
  'form.dividends.total-dividends': 'Dividendi totali:',
  'form.entry-exit.total-entry-size': "Dimensione totale d'ingresso:",
  'form.entry-exit.remaining-position': 'Posizione rimanente:',
  'form.entry-exit.open': '(Aperta)',
  'form.entry-exit.closed': '(Chiusa)',
  'form.entry-exit.direct-pnl':
    "Inserisci il PNL base dell'operazione direttamente invece dei prezzi",
  'form.entry-exit.direct-pnl-desc':
    "Inserisci il profitto/perdita dell'operazione prima dei dividendi. Commissione e spese verranno comunque applicate a parte.",
  'form.entry-exit.calc-pnl':
    'Calcola il PNL dai prezzi di ingresso/uscita e dalle dimensioni della posizione.',
  'form.ideal-exit.title': 'Uscite ideali',

  'form.ideal-exit.price': 'Prezzo ideale',
  'form.ideal-exit.size': 'Dimensione',
  'form.ideal-exit.remove': 'Rimuovi uscita ideale',

  'form.ideal-exit.copy-actual': 'Copia uscite effettive',
  'form.ideal-exit.tooltip':
    'Registra il piano di uscita a posteriori che avresti voluto eseguire. Supporta uscite scalate per rivedere quanto movimento hai catturato.',
  'form.ideal-exit.empty': 'Nessuna uscita ideale',
  'form.unrealized.title': 'Istantanea della posizione aperta',
  'form.unrealized.tooltip':
    "Registra il prezzo di mercato attuale della posizione aperta per tracciare il P&L non realizzato. L'istantanea viene cancellata automaticamente quando l'operazione viene chiusa.",
  'form.unrealized.price': "Prezzo dell'istantanea",
  'form.unrealized.time': "Orario dell'istantanea",
  'form.unrealized.preview': 'P&L non realizzato',
  'form.unrealized.captured': 'Registrato {time}',
  'form.layout.item.unrealized-snapshot-desc':
    'Tieni traccia del P&L non realizzato per le posizioni aperte.',
  'trade.validation.unrealized-snapshot-price-non-negative':
    "Il prezzo dell'istantanea deve essere zero o maggiore",
  'trade.validation.unrealized-snapshot-open-position-required':
    "L'orario dell'istantanea deve cadere durante una posizione aperta.",
  'form.trade-type.title': 'Tipo di operazione',
  'form.trade-type.subtitle': 'Scegli il tipo di operazione che stai creando',
  'form.trade-type.regular': 'Operazione normale',
  'form.trade-type.regular-desc':
    'Operazione normale con dati completi di ingresso e uscita',
  'form.trade-type.missed': 'Operazione persa',
  'form.trade-type.missed-desc':
    'Opportunità di operazione che hai perso: i campi P&L e Conto sono opzionali',
  'form.trade-type.backtest': 'Operazione di backtest',
  'form.trade-type.backtest-desc': 'Scenario di backtest a scopo di analisi',
  'form.trade-type.missed-reason': 'Perché hai perso questa operazione?',
  'form.trade-type.missed-reason-placeholder':
    'Descrivi perché hai perso questa opportunità di operazione...',
  'button.save': 'Salva',
  'button.cancel': 'Annulla',
  'button.close': 'Chiudi',
  'button.open': 'Apri',
  'button.done': 'Fatto',
  'button.edit': 'Modifica',
  'button.delete': 'Elimina',
  'button.update': 'Aggiorna',
  'button.add': 'Aggiungi',
  'button.create': 'Crea',
  'button.reset': 'Reimposta',
  'button.reset-to-defaults': 'Reimposta predefiniti',

  'button.confirm': 'Conferma',

  'button.back': 'Indietro',
  'button.add-trade': 'Aggiungi operazione',
  'button.update-trade': 'Aggiorna operazione',
  'button.save-changes': 'Salva modifiche',
  'button.create-trade': 'Crea operazione',
  'button.delete-all': 'Elimina tutto',
  'button.clear-all': 'Azzera tutto',

  'button.cancel-reset': 'Annulla reimpostazione',
  'button.proceed-anyway': 'Procedi comunque',
  'button.mark-reviewed': 'Segna come revisionata',
  'button.maybe-later': 'Più tardi',
  'button.upgrade-now': 'Passa a Pro ora',

  'button.apply': 'Applica',

  'button.learn-more': 'Scopri di più',
  'button.upload-image': 'Carica media',
  'button.discord': 'Discord',
  'form.error.image-upload-unavailable': 'Caricamento immagini non disponibile',
  'trade.header.unknown-instrument': 'Strumento sconosciuto',
  'validation.edit': 'MODIFICA',
  'validation.fix-errors': 'Correggi i seguenti errori:',
  'validation.setup-resolution-failed':
    'Impossibile preparare i Setup selezionati. Controllali e riprova.',
  'validation.basic-tab-errors.one': 'La scheda Base ha {count} errore',
  'validation.basic-tab-errors.few': 'La scheda Base ha {count} errori',
  'validation.basic-tab-errors.many': 'La scheda Base ha {count} errori',
  'validation.basic-tab-errors.other': 'La scheda Base ha {count} errori',
  'validation.details-tab-errors.one': 'La scheda Dettagli ha {count} errore',
  'validation.details-tab-errors.few': 'La scheda Dettagli ha {count} errori',
  'validation.details-tab-errors.many': 'La scheda Dettagli ha {count} errori',
  'validation.details-tab-errors.other': 'La scheda Dettagli ha {count} errori',
  'validation.advanced-tab-errors.one': 'La scheda Avanzate ha {count} errore',
  'validation.advanced-tab-errors.few': 'La scheda Avanzate ha {count} errori',
  'validation.advanced-tab-errors.many': 'La scheda Avanzate ha {count} errori',
  'validation.advanced-tab-errors.other':
    'La scheda Avanzate ha {count} errori',
  'validation.complete-required': 'Completa tutti i campi obbligatori',

  'validation.missed-trade-requires-exit':
    'Le operazioni perse devono avere dati di uscita con prezzi diversi da zero. Rappresentano opportunità già passate, quindi devi indicare quale sarebbe stato il prezzo di uscita.',
  'trade.validation.entry-required': 'È richiesto almeno un ingresso.',
  'trade.validation.entry-time-required':
    "L'orario di ingresso è obbligatorio.",
  'trade.validation.entry-price-required':
    'Il prezzo di ingresso è obbligatorio.',
  'trade.validation.entry-size-positive':
    "La dimensione d'ingresso deve essere maggiore di zero.",
  'trade.validation.exit-required-closed':
    "È richiesta almeno un'uscita per le operazioni chiuse.",
  'trade.validation.exit-time-required': "L'orario di uscita è obbligatorio.",
  'trade.validation.exit-price-required': 'Il prezzo di uscita è obbligatorio.',
  'trade.validation.exit-size-positive':
    "La dimensione d'uscita deve essere maggiore di zero.",
  'trade.validation.exit-size-exceeds-entry':
    "La dimensione totale d'uscita non può superare quella d'ingresso.",
  'trade.validation.exit-before-entry':
    'Le uscite non possono avvenire prima del primo ingresso.',
  'trade.validation.dividend-time-required':
    "L'orario del dividendo è obbligatorio.",
  'trade.validation.dividend-amount-nonzero':
    "L'importo del dividendo deve essere un numero diverso da zero.",
  'trade.validation.direct-pnl-required':
    'Inserisci un valore di profitto/perdita.',
  'trade.validation.entry-time-select': 'Seleziona un orario di ingresso.',
  'trade.validation.direction-required': 'Seleziona una direzione.',
  'trade.validation.asset-type-required': 'Seleziona un tipo di asset.',
  'trade.validation.ticker-required': 'Seleziona un simbolo.',
  'trade.validation.ticker-invalid':
    'Inserisci un simbolo valido (solo lettere, numeri e punti).',
  'trade.validation.account-required': 'Seleziona almeno un conto.',
  'trade.validation.exit-time-select': 'Seleziona un orario di uscita.',
  'trade.validation.entry-price-invalid':
    'Inserisci un prezzo di ingresso valido.',
  'trade.validation.exit-price-invalid':
    'Inserisci un prezzo di uscita valido.',
  'trade.validation.position-size-invalid':
    'Inserisci una dimensione della posizione valida.',
  'trade.validation.exit-time-after-entry':
    "L'orario di uscita deve essere successivo a quello di ingresso.",
  'trade.validation.expiration-date-required':
    'Seleziona una data di scadenza.',
  'trade.validation.strike-price-required': 'Inserisci un prezzo strike.',
  'trade.validation.option-type-required':
    'Seleziona un tipo di opzione (call o put).',
  'trade.validation.contract-size-positive':
    'La dimensione del contratto deve essere maggiore di zero.',
  'trade.validation.dollars-per-point-min':
    'Inserisci i dollari per punto (min 0.01).',
  'trade.validation.lot-size-nonnegative':
    'La dimensione del lotto deve essere maggiore di zero.',
  'trade.validation.leverage-positive':
    'Il rapporto di leva deve essere maggiore di zero.',
  'trade.validation.commission-type-invalid':
    'Il tipo di commissione deve essere "fixed" o "percentage".',
  'trade.validation.commission-number': 'La commissione deve essere un numero.',
  'trade.validation.commission-percentage-range':
    'La commissione percentuale deve essere tra 0 e 100.',
  'trade.validation.rebate-options-only':
    'Il rimborso è consentito solo per le operazioni in opzioni.',
  'trade.validation.rebate-number': 'Il rimborso deve essere un numero.',
  'trade.validation.rebate-positive':
    'Il rimborso deve essere un valore positivo.',
  'trade.validation.swap-invalid': 'Importo Swap non valido.',
  'trade.validation.fees-number': 'Le commissioni devono essere un numero.',
  'trade.validation.risk-number': "L'importo a rischio deve essere un numero.",
  'trade.validation.risk-valid-number':
    "L'importo a rischio deve essere un numero valido.",
  'trade.validation.risk-positive':
    "L'importo a rischio deve essere maggiore di zero.",
  'trade.validation.fx-rate-number':
    'Il tasso FX deve essere un numero valido.',
  'trade.validation.fx-rate-positive':
    'Il tasso FX deve essere maggiore di zero.',
  'trade.validation.stop-loss-number': 'Lo Stop loss deve essere un numero.',
  'trade.validation.stop-loss-valid-number':
    'Lo Stop loss deve essere un numero valido.',
  'trade.validation.take-profit-price-required':
    'Il prezzo del take profit è obbligatorio.',
  'trade.validation.take-profit-price-number':
    'Il prezzo del take profit deve essere un numero.',
  'trade.validation.take-profit-price-valid-number':
    'Il prezzo del take profit deve essere un numero valido.',
  'trade.validation.take-profit-close-percent-number':
    'La percentuale di chiusura del take profit deve essere un numero.',
  'trade.validation.take-profit-close-percent-valid-number':
    'La percentuale di chiusura del take profit deve essere un numero valido.',
  'trade.validation.take-profit-close-percent-range':
    'La percentuale di chiusura del take profit deve essere tra 1 e 100.',
  'trade.validation.take-profit-total-close-percent-range':
    'Le percentuali di chiusura dei take profit non possono superare 100.',
  'validation.custom-field.key-empty':
    'La chiave del campo non può essere vuota',
  'validation.custom-field.key-conflict':
    "Questo nome di campo è in conflitto con i campi integrati dell'operazione",
  'validation.custom-field.key-format':
    'La chiave del campo deve iniziare con una lettera e contenere solo lettere, numeri e underscore',
  'validation.custom-field.required': '{label} è obbligatorio',
  'validation.custom-field.text': '{label} deve essere testo',
  'validation.custom-field.min-length':
    '{label} deve contenere almeno {minLength} caratteri',
  'validation.custom-field.max-length':
    '{label} non deve superare {maxLength} caratteri',
  'validation.custom-field.pattern-invalid':
    'Il formato di {label} non è valido',
  'validation.custom-field.pattern-invalid-pattern':
    '{label} ha un pattern di convalida non valido',
  'validation.custom-field.number': '{label} deve essere un numero',
  'validation.custom-field.min': '{label} deve essere almeno {min}',
  'validation.custom-field.max': '{label} non deve essere superiore a {max}',
  'validation.custom-field.selection':
    '{label} deve essere una selezione valida',
  'validation.custom-field.option': "{label} deve essere un'opzione valida",
  'validation.custom-field.array': '{label} deve essere un elenco di selezioni',
  'validation.custom-field.invalid-option':
    "{label} contiene un'opzione non valida: {item}",
  'validation.custom-field.date': '{label} deve essere una data valida',
  'validation.custom-field.time': '{label} deve essere un orario valido',
  'validation.custom-field.time-format':
    '{label} deve essere un formato orario valido (HH:MM, HH:MM:SS o 12 ore con AM/PM)',
  'validation.custom-field.time-values':
    '{label} contiene valori orari non validi',

  'notice.login-success': 'Accesso effettuato!',
  'notice.pro-access-ready': "L'accesso PRO è pronto.",

  'notice.logout-success': 'Disconnessione effettuata',
  'notice.ftp-created': 'Credenziali FTP create con successo',
  'notice.ftp-reset':
    'Password FTP reimpostata con successo! Salva la nuova password.',
  'notice.ftp-password-rotated':
    'Sono state generate nuove credenziali FTP per questo dispositivo. La sincronizzazione FTP configurata su altri dispositivi (es. il tuo EA MetaTrader) deve essere aggiornata con la nuova password.',
  'notice.ftp-reused':
    'Credenziali FTP esistenti caricate da questo dispositivo. Se non funzionano più, usa Reimposta password.',
  'notice.template-saved': 'Layout salvato',
  'notice.template-created': 'Layout creato',
  'notice.template-duplicated': 'Layout duplicato',
  'notice.template-applied': 'Layout applicato: {name}',
  'notice.template-deleted': 'Layout eliminato',
  'notice.default-template-updated': 'Layout predefinito aggiornato',
  'notice.tradelog-saved':
    'Impostazioni del registro operazioni salvate con successo',
  'notice.settings-exported': 'Impostazioni esportate in {filename}',
  'notice.settings-imported':
    'Impostazioni importate con successo dalla v{version}. Riavvia Obsidian per applicare tutte le modifiche.',
  'notice.template-switched': 'Passato a: {name}',
  'notice.hotkey-set': 'Scorciatoia impostata: {hotkey}',
  'notice.auto-sync-toggled': 'Sincronizzazione automatica {status}',
  'notice.auto-sync-enabled': 'attivata',
  'notice.auto-sync-disabled': 'disattivata',
  'notice.reset-items': 'Voci ripristinate ai valori predefiniti',

  'notice.custom-fields-imported':
    'Importati con successo {count} campi personalizzati',

  'notice.csv-template-deleted': 'Modello "{name}" eliminato',
  'notice.csv-template-delete-failed':
    'Impossibile eliminare il modello: {error}',
  'notice.csv-template-imported': 'Modello "{name}" importato con successo',
  'notice.csv-symbol-mappings-created.one': 'Creata {count} mappatura simboli',
  'notice.csv-symbol-mappings-created.few': 'Create {count} mappature simboli',
  'notice.csv-symbol-mappings-created.many': 'Create {count} mappature simboli',
  'notice.csv-symbol-mappings-created.other':
    'Create {count} mappature simboli',
  'notice.csv-symbol-mapping-skipped': 'Mappatura simboli saltata',
  'notice.csv-missing-fields':
    'Mappa tutti i campi obbligatori prima di importare',
  'notice.setups-added': 'Setup aggiunti a {count} operazioni',
  'notice.tags-added': 'Tag aggiunti a {count} operazioni',
  'notice.mistakes-added': 'Errori aggiunti a {count} operazioni',
  'notice.trades-duplicated.one': 'Duplicata {count} operazione',
  'notice.trades-duplicated.few': 'Duplicate {count} operazioni',
  'notice.trades-duplicated.many': 'Duplicate {count} operazioni',
  'notice.trades-duplicated.other': 'Duplicate {count} operazioni',
  'notice.trades-deleted.one': 'Eliminata {count} operazione',
  'notice.trades-deleted.few': 'Eliminate {count} operazioni',
  'notice.trades-deleted.many': 'Eliminate {count} operazioni',
  'notice.trades-deleted.other': 'Eliminate {count} operazioni',
  'notice.mark-reviewed.one': 'Segnata {count} operazione come revisionata',
  'notice.mark-reviewed.few': 'Segnate {count} operazioni come revisionate',
  'notice.mark-reviewed.many': 'Segnate {count} operazioni come revisionate',
  'notice.mark-reviewed.other': 'Segnate {count} operazioni come revisionate',

  'notice.error.open-journalit':
    'Impossibile aprire Journalit. Prova a ricaricare Obsidian.',
  'notice.error.open-drc': 'Impossibile aprire il DRC: {error}',
  'notice.error.open-trade-log':
    'Impossibile aprire il registro operazioni: {error}',
  'notice.error.open-csv-import': 'Impossibile aprire Trade Import: {error}',
  'notice.error.open-account-dashboard': 'Impossibile aprire Conti: {error}',
  'notice.error.open-trade-form-edit':
    'Impossibile aprire il modulo operazione in modalità modifica: {error}',
  'notice.error.open-weekly-review':
    'Impossibile aprire la revisione settimanale: {error}',
  'notice.error.open-monthly-review':
    'Impossibile aprire la revisione mensile: {error}',
  'notice.error.open-quarterly-review':
    'Impossibile aprire la revisione trimestrale: {error}',
  'notice.error.open-yearly-review':
    'Impossibile aprire la revisione annuale: {error}',
  'notice.error.open-onboarding':
    'Impossibile aprire il flusso di avvio. Controlla la console per i dettagli.',

  'notice.error.open-release-notes':
    'Impossibile aprire le note di versione: {error}',
  'notice.error.open-update-notification':
    'Impossibile aprire la notifica di aggiornamento: {error}',
  'notice.error.open-layout-builder':
    'Impossibile aprire il costruttore di layout: {error}',
  'notice.error.switch-template': 'Impossibile cambiare layout: {error}',
  'notice.error.switch-template-generic': 'Impossibile cambiare layout',

  'notice.error.no-active-file': 'Nessun file attivo. Apri prima una nota.',
  'notice.error.no-template-support':
    'Questo tipo di nota non supporta i layout.',
  'notice.error.no-templates':
    'Nessun layout disponibile per questo tipo di nota.',
  'notice.error.asset-type-required':
    'Il tipo di asset è obbligatorio quando aggiungi uno strumento',
  'notice.error.column-required': 'Almeno una colonna deve restare visibile',
  'notice.error.save-settings':
    'Errore nel salvataggio delle impostazioni: {error}',
  'notice.error.sign-in-vault': 'Accedi per registrare il tuo vault.',
  'notice.error.sign-in-sync':
    'Accedi per usare la sincronizzazione automatica.',
  'notice.error.restore-auth':
    "Impossibile ripristinare l'autenticazione. Accedi di nuovo da Impostazioni → Autenticazione.",
  'notice.error.export-settings':
    'Impossibile esportare le impostazioni. Controlla la console per i dettagli.',
  'notice.error.import-settings':
    'Impossibile importare le impostazioni: {error}',
  'notice.error.reset-settings':
    'Impossibile reimpostare le impostazioni. Controlla la console per i dettagli.',

  'notice.error.cannot-change-folder-during-sync':
    'Impossibile cambiare il percorso della cartella mentre la sincronizzazione è in corso. Attendi che la sincronizzazione termini.',
  'notice.error.file-not-found': 'File non trovato: {path}',

  'notice.error.mark-reviewed':
    'Errore nel segnare le operazioni come revisionate: {error}',
  'notice.error.add-setups': "Errore durante l'aggiunta dei Setup: {error}",
  'notice.error.add-tags': "Errore durante l'aggiunta dei tag: {error}",
  'notice.error.add-mistakes':
    "Errore durante l'aggiunta degli errori: {error}",
  'notice.error.delete-trades':
    "Errore durante l'eliminazione delle operazioni: {error}",
  'notice.error.duplicate-trades':
    'Errore durante la duplicazione delle operazioni: {error}',
  'notice.error.csv-validation':
    'Validazione CSV/XLSX/XLS non riuscita: {errors}',
  'notice.error.import-failed': 'Importazione non riuscita: {error}',
  'notice.error.file-too-large':
    'Il file è troppo grande. La dimensione massima è 10MB',
  'notice.error.select-csv': 'Seleziona un file CSV/XLSX/XLS/HTML',
  'notice.error.cannot-delete-builtin':
    'Impossibile eliminare i layout predefiniti',
  'notice.error.duplicate-to-customize':
    'Duplica questo layout per personalizzarlo',
  'notice.error.sign-out': 'Disconnessione non riuscita. Riprova.',
  'notice.error.open-upgrade-modal':
    'È stata richiesta una funzione premium ma la finestra di upgrade non si è caricata.',

  'notice.plugin-updated': 'Journalit aggiornato alla v{version}!',
  'notice.info.settings-recovered':
    'Le impostazioni sono state recuperate dal backup. Alcune modifiche recenti potrebbero essere andate perse.',
  'notice.info.cannot-remove-locked': 'Impossibile rimuovere i widget bloccati',
  'notice.sync-mapping.updating':
    'Aggiornamento delle mappature Trade Sync per il nuovo percorso della cartella...',
  'notice.sync-mapping.updated': 'Mappature Trade Sync aggiornate con successo',
  'notice.error.sync-mapping-update-failed':
    'Impossibile aggiornare le mappature Trade Sync. Riavvia il plugin.',
  'tradelog.title': 'Registro operazioni',
  'tradelog.root.all-trades': 'Tutte le operazioni',
  'tradelog.view.selector.label': 'Vista',

  'trade-form.guide.customization-modal.title':
    'Adatta il modulo al tuo flusso di lavoro',
  'trade-form.guide.customization-modal.description':
    'Qui puoi mostrare, nascondere e riordinare i blocchi opzionali. Tieni il modulo concentrato sui campi che usi davvero.',
  'trade-form.guide.finish.title': 'Questa è la funzione di personalizzazione',
  'trade-form.guide.finish.description':
    'Puoi tornare su questo pulsante ogni volta che il modulo operazione deve adattarsi a un flusso di journaling diverso.',
  'tradelog.guide.empty.intro.title': 'Benvenuto nel Registro operazioni',
  'tradelog.guide.empty.intro.description':
    'Questa pagina diventa il tuo spazio principale per sfogliare, ordinare e revisionare le operazioni. Quando aggiungi operazioni, avrai anche il tour completo del Registro operazioni.',
  'tradelog.guide.empty.state.title': 'Nessun dato di trading disponibile',
  'tradelog.guide.empty.state.description':
    'Importa operazioni precedenti per esplorare subito il tuo rendimento, oppure registra una nuova operazione a mano.',
  'tradelog.guide.intro.title': 'Questo è il tuo Registro operazioni',
  'tradelog.guide.intro.description':
    'Usa questa pagina per revisionare le operazioni una per una, ordinarle, filtrarle e modificare tante operazioni insieme.',
  'tradelog.guide.view-selector.title':
    'Scegli come revisionare il tuo storico',
  'tradelog.guide.view-selector.description':
    'Usa questo menu per passare dalla tabella completa alle viste raggruppate per mesi, settimane o giorni. Operazioni è il valore predefinito, ma le viste raggruppate sono utili per revisionare per periodo.',
  'tradelog.guide.filters.title':
    'Usa i filtri per restringere il Registro operazioni',
  'tradelog.guide.filters.description':
    'Apri i filtri quando vuoi revisionare solo certi conti, setup, tag, tipi di operazione, stati o date. Puoi anche escludere qualsiasi valore per togliere quelle operazioni.',
  'tradelog.guide.sorting.title':
    'Fai clic sulle intestazioni per ordinare la tabella',
  'tradelog.guide.sorting.description':
    "Nella vista Operazioni, fai clic su un'intestazione ordinabile per riordinare la tabella. Ad esempio, fai clic su P&L netto per ordinare dalla vincita più grande alla perdita più grande.",
  'tradelog.guide.gallery-mode.title': "C'è anche una galleria immagini",
  'tradelog.guide.gallery-mode.description':
    'Cambia modalità qui per sfogliare gli screenshot delle operazioni come galleria. Una breve guida te la mostrerà la prima volta che la apri.',
  'tradelog.guide.multi-select.title': 'Attiva la selezione multipla',
  'tradelog.guide.multi-select.description':
    "Fai clic su questo pulsante per selezionare più operazioni insieme. Con la selezione multipla attiva, il clic sulla riga seleziona l'operazione invece di aprirla.",
  'tradelog.guide.batch-actions.title': 'Queste sono le azioni in blocco',
  'tradelog.guide.batch-actions.description':
    'Usa questa barra per selezionare tutte le operazioni visibili, deselezionare, segnare come revisionate, aggiungere setup, aggiungere errori, duplicare o eliminare più operazioni insieme. Puoi anche fare Maiusc+clic per selezionare un intervallo.',
  'tradelog.guide.column-settings.title': 'Apri le impostazioni colonne',
  'tradelog.guide.column-settings.description':
    'Fai clic su questo pulsante per scegliere quali colonne mostrare e quanto densa o dettagliata deve essere la tabella.',
  'tradelog.guide.active-columns.title':
    'Riordina o rimuovi le colonne che usi già',
  'tradelog.guide.active-columns.description':
    "In Colonne attive, trascina una colonna per spostarla o rimuovine una che non ti serve. Questo cambia l'ordine della tabella da sinistra a destra.",
  'tradelog.guide.available-columns.title':
    'Rimetti le colonne nascoste quando ti serve più dettaglio',
  'tradelog.guide.available-columns.description':
    'Apri Colonne disponibili per rimettere i campi in tabella. È lì che recuperi quello che hai rimosso prima.',
  'tradelog.guide.open-trades.title':
    "Fai clic su un'operazione per aprire la sua nota",
  'tradelog.guide.open-trades.description':
    "In modalità normale, il clic apre l'operazione. In selezione multipla, il clic la seleziona. Passa da un comportamento all'altro in base a quello che vuoi fare.",
  'dashboard.guide.empty.intro.title': 'Benvenuto nella tua Dashboard',
  'dashboard.guide.empty.intro.description':
    'La Dashboard diventa utile non appena Journalit ha uno storico di trading da analizzare.',
  'dashboard.guide.empty.state.title': 'Importa il tuo storico di trading',
  'dashboard.guide.empty.state.description':
    "Importa operazioni precedenti per partire con dati di rendimento significativi, oppure aggiungi un'operazione a mano se stai registrando le prime.",
  'dashboard.guide.main.intro.title': 'Questa è la tua Dashboard',
  'dashboard.guide.main.intro.description':
    'Usa questa pagina per seguire il rendimento, revisionare le statistiche e tenere i grafici più utili in un unico posto.',
  'dashboard.guide.main.filters.title': 'I filtri cambiano tutta la Dashboard',
  'dashboard.guide.main.filters.description':
    'Usa i filtri quando vuoi che ogni statistica e grafico di questa pagina si aggiorni per un altro intervallo di date, conto, setup, tag o tipo di operazione. Puoi anche escludere qualsiasi valore per togliere quelle operazioni.',
  'dashboard.guide.main.edit-layout.title':
    'Attiva la modalità modifica per personalizzare questa pagina',
  'dashboard.guide.main.edit-layout.description':
    "Fai clic su Modifica layout per sbloccare lo spostamento, il ridimensionamento, la rimozione e l'aggiunta di widget della Dashboard.",
  'dashboard.guide.main.open-widget-selector.title': 'Apri Aggiungi widget',
  'dashboard.guide.main.open-widget-selector.description':
    'Fai clic su Aggiungi widget per aggiungere altri grafici e recuperare i widget che hai rimosso.',
  'dashboard.guide.main.widget-picker.title': 'Scegli cosa mostrare',
  'dashboard.guide.main.widget-picker.description':
    "Questo pannello mostra l'anteprima di ogni grafico e metrica. Fai clic su uno per aggiungerlo; ciò che è già nella Dashboard compare sotto In uso.",
  'dashboard.guide.main.metrics.title':
    'Queste schede in alto sono il riepilogo rapido',
  'dashboard.guide.main.metrics.description':
    'La riga in alto ti dà risposte rapide come profitto, tasso di vincita e operazioni totali. In modalità modifica puoi cambiare quali schede appaiono e riordinarle.',
  'dashboard.guide.main.bottom.title':
    'Qui si spostano e si ridimensionano i widget',
  'dashboard.guide.main.bottom.description':
    "Con Modifica layout attivo, trascina un widget per spostarlo. Per ridimensionarlo, trascina l'angolo in basso a destra. È il passaggio che molti si perdono.",
  'dashboard.guide.main.save-layout.title': 'Salva il layout quando hai finito',
  'dashboard.guide.main.save-layout.description':
    'Quando hai finito di personalizzare, fai clic su Salva layout per tenere le modifiche. Puoi tornare a modificare questa pagina quando vuoi.',
  'home.guide.intro.title': 'Benvenuto in Home',
  'home.guide.intro.description':
    'Questa è la tua pagina principale. Mostra le statistiche di trading, le azioni rapide e i collegamenti al resto di Journalit.',
  'home.guide.filters.title': 'Questi pulsanti cambiano cosa mostrano i widget',
  'home.guide.filters.description':
    'Usali per cambiare periodo, tipo di operazione o conto, così i widget della Home mostrano i dati che vuoi vedere.',
  'home.guide.settings.title':
    'Le impostazioni di Journalit sono sempre a portata di mano',
  'home.guide.settings.description':
    'Usa questo pulsante per aprire direttamente le impostazioni di Journalit.',
  'home.guide.customize.title':
    'Attiva la modalità modifica per personalizzare Home',
  'home.guide.customize.description':
    'Fai clic su questo pulsante per iniziare a personalizzare. La modalità modifica sblocca spostamento, ridimensionamento, rimozione e aggiunta di widget.',
  'home.guide.quick-links-position.title':
    'Sposta i Collegamenti rapidi sopra o sotto i widget',
  'home.guide.quick-links-position.description':
    "Usa questo pulsante per scegliere se la riga dei Collegamenti rapidi sta sopra o sotto l'area principale dei widget.",
  'home.guide.quick-links.title':
    'Questi Collegamenti rapidi sono le tue scorciatoie',
  'home.guide.quick-links.description':
    'I Collegamenti rapidi ti danno scorciatoie con un clic alle azioni e alle pagine più usate. In modalità modifica puoi anche nascondere i link che non vuoi qui.',
  'home.guide.move-and-resize.title': 'Sposta e ridimensiona i widget',
  'home.guide.widget-picker.title': 'Aggiungi widget qui',
  'home.guide.widget-picker.description':
    'Visualizza in anteprima e aggiungi widget, ripristina Collegamenti rapidi o aggiungi collegamenti a conti e setup. Tutto ciò che è già in Home compare in «In uso», dove puoi rimuoverlo.',
  'home.guide.move-and-resize.description':
    "Questa è l'area principale che puoi riorganizzare in modalità modifica. Trascina i widget per spostarli, oppure trascina l'angolo in basso a destra per ridimensionarli.",
  'home.guide.add-widget.title': 'Aggiungi elementi a Home',
  'home.guide.add-widget.description':
    'Apri Aggiungi widget per aggiungere widget, Collegamenti rapidi o collegamenti a conti e setup.',
  'home.guide.save-layout.title': 'Salva il layout quando hai finito',
  'home.guide.save-layout.description':
    'Quando il layout ti convince, fai clic su questo pulsante per salvare le modifiche e uscire dalla modalità modifica.',
  'home.guide.widget-interactions.title': "Questa è l'idea principale di Home",
  'home.guide.widget-interactions.description':
    'Home è la tua dashboard personalizzabile. Usa la modalità modifica per cambiare il layout e fai clic sui widget per aprire strumenti, impostazioni o pagine più approfondite.',
  'layoutBuilder.guide.intro.title': 'Questo è il tuo costruttore di layout',
  'layoutBuilder.guide.intro.description':
    'Questa pagina controlla come sono strutturati i tuoi layout di revisione. Il modo più semplice per iniziare è duplicare un layout integrato e poi personalizzare la tua copia.',
  'layoutBuilder.guide.sidebar-overview.title':
    'Da questa barra laterale scegli cosa stai modificando',
  'layoutBuilder.guide.sidebar-overview.description':
    'Ogni sezione della barra laterale è un tipo di layout diverso. I layout delle operazioni sono separati dai layout di revisione e la sezione Libreria serve per condividere i layout. Dopo aver creato la tua copia, puoi metterla tra i preferiti per usarla come predefinita per le nuove note di revisione.',
  'layoutBuilder.guide.pick-built-in.title':
    'Inizia da un layout DRC integrato',
  'layoutBuilder.guide.pick-built-in.description':
    'Per il tuo primo layout, inizia da uno dei layout DRC integrati. Ti dà un punto di partenza sicuro prima di creare la tua copia.',
  'layoutBuilder.guide.duplicate.title': 'Duplica il layout integrato',
  'layoutBuilder.guide.duplicate.description':
    'I layout integrati sono punti di partenza. Duplicane uno prima così puoi creare in sicurezza la tua versione.',
  'layoutBuilder.guide.preview-template.title':
    'Questa anteprima mostra come apparirà il layout',
  'layoutBuilder.guide.preview-template.description':
    "Scorri l'anteprima e fatti un'idea del flusso. È utile per verificare se il layout si legge chiaramente prima di iniziare a modificarlo.",
  'layoutBuilder.guide.switch-to-editor.title': "Passa all'editor",
  'layoutBuilder.guide.switch-to-editor.description':
    "L'anteprima ti mostra come apparirà il layout. L'editor è dove lo modifichi davvero.",
  'layoutBuilder.guide.editor-overview.title': 'Qui modifichi il layout',
  'layoutBuilder.guide.editor-overview.description':
    "Rinomina il layout qui, rivedi l'elenco dei widget, trascina la maniglia a sinistra per riordinarli, fai clic su un widget per modificarlo e rimuovi ciò che non ti serve.",
  'layoutBuilder.guide.add-widget.title': 'Aggiungi un widget alla tua copia',
  'layoutBuilder.guide.add-widget.description':
    'Usa Aggiungi widget per inserire nuovi blocchi nel layout. Così adatti il flusso a come fai le revisioni.',
  'layoutBuilder.guide.open-widget-picker.title': 'Apri il selettore widget',
  'layoutBuilder.guide.open-widget-picker.description':
    'Questo selettore mostra i widget che puoi aggiungere per questo tipo di revisione.',
  'layoutBuilder.guide.choose-widget.title': 'Scegli un widget',
  'layoutBuilder.guide.choose-widget.description':
    'Digita nella casella di ricerca per trovare un widget per nome, descrizione o categoria, poi sceglilo. Puoi anche premere Avanti e Journalit sceglierà il primo risultato per te.',
  'layoutBuilder.guide.widget-library-docs.title':
    'Usa la libreria widget se ti blocchi',
  'layoutBuilder.guide.widget-library-docs.description':
    'Apre la pagina della documentazione con la libreria widget, gli esempi e la tabella di disponibilità per ogni tipo di revisione.',
  'layoutBuilder.guide.save-template.title': 'Salva il tuo layout',
  'layoutBuilder.guide.save-template.description':
    'Quando la tua copia ti soddisfa, salvala. Potrai continuare a perfezionarla più avanti man mano che il tuo processo di revisione migliora.',
  'layoutBuilder.guide.set-default-template.title':
    'Imposta questa copia come layout predefinito',
  'layoutBuilder.guide.set-default-template.description':
    'Fai clic sulla stella del nuovo layout se vuoi che le nuove note di revisione lo usino automaticamente.',
  'tradelog.empty': 'Nessuna operazione trovata',
  'tradelog.empty.submessage':
    'Inizia a creare note di operazione per vederle nel registro operazioni.',
  'tradelog.processing': 'Elaborazione dati operazioni...',
  'tradelog.node.file-not-found': "File dell'operazione non trovato: {path}",
  'tradelog.node.expand': 'Espandi',
  'tradelog.node.collapse': 'Comprimi',
  'tradelog.node.navigate-to-review': 'Vai alla revisione {type}',
  'tradelog.node.performance.year': '{indicator} anno',
  'tradelog.node.performance.quarter': '{indicator} trimestre del {year}',
  'tradelog.node.performance.month': '{indicator} mese di {quarter} {year}',
  'tradelog.node.performance.week': '{indicator} settimana di {month} {year}',
  'tradelog.node.performance.day': '{indicator} giorno di {week} {year}',
  'tradelog.node.performance.period': '{indicator} periodo',
  'tradelog.filter.all': 'Tutti gli stati',
  'tradelog.filter.winners': 'Vincenti',
  'tradelog.filter.losers': 'Perdenti',
  'tradelog.filter.breakeven': 'Pareggio',
  'tradelog.filter.breakeven.desc': 'Operazioni in pareggio',
  'tradelog.filter.open': 'Aperte',
  'tradelog.filter.open.desc': 'Posizioni attualmente aperte',
  'tradelog.filter.closed': 'Chiuse',
  'tradelog.type.regular': 'Regolari',
  'tradelog.type.regular.desc': 'Operazioni normali',
  'tradelog.type.missed': 'Perse',
  'tradelog.type.backtest': 'Backtest',
  'tradelog.status.win': 'VINCENTE',
  'tradelog.status.loss': 'PERDENTE',
  'tradelog.status.open': 'APERTA',
  'tradelog.status.partially-closed': 'PARZIALMENTE CHIUSA',
  'tradelog.status.cancelled': 'ANNULLATA',
  'tradelog.status.breakeven': 'PAREGGIO',
  'tradelog.status.missed': 'PERSA',
  'tradelog.status.backtest': 'BACKTEST',
  'tradelog.status.expired': 'SCADUTA',
  'tradelog.no-columns': 'Nessuna colonna configurata',
  'tradelog.duration.ongoing': '(in corso)',
  'tradelog.tooltip.mistakes': 'Errori:',
  'tradelog.tooltip.setups': 'Setup:',
  'tradelog.tooltip.tags': 'Tag:',
  'tradelog.tooltip.thesis': 'Tesi:',
  'tradelog.tooltip.mtComment': 'Commento MT:',
  'tradelog.tooltip.accounts': 'Conti:',
  'tradelog.copy-trade.tooltip': 'Copiato da {account} a {multiplier}x',
  'tradelog.tooltip.partial-exits': 'Uscite parziali:',
  'tradelog.copy-trade.base-tooltip-title': 'Risultati del conto copiato',
  'tradelog.copy-trade.adjustment-action': 'Regola P&L copiato',
  'tradelog.copy-trade.adjustment-title': 'Regola P&L copiato',
  'tradelog.copy-trade.adjustment-description-primary':
    "Inserisci l'aggiustamento P&L manuale per questa operazione copiata.",
  'tradelog.copy-trade.adjustment-description-secondary':
    'Usa un numero negativo per esecuzioni o costi peggiori.',
  'tradelog.copy-trade.adjustment-preview': 'Anteprima P&L netto:',

  'tradelog.copy-trade.adjustment-invalid':
    'Inserisci un aggiustamento P&L valido.',
  'tradelog.copy-trade.adjustment-saved':
    "Aggiustamento P&L dell'operazione copiata salvato.",
  'tradelog.tooltip.still-open': 'ancora aperta',

  'tradelog.alt.trade-image': 'Immagine {instrument}',
  'tradelog.alt.trade-image-n': 'Immagine {instrument} {n}',
  'tradelog.batch.delete-confirm.title': 'Conferma eliminazione',
  'tradelog.batch.delete-confirm.message.one':
    'Sei sicuro di voler eliminare {count} operazione selezionata?',
  'tradelog.batch.delete-confirm.message.few':
    'Sei sicuro di voler eliminare {count} operazioni selezionate?',
  'tradelog.batch.delete-confirm.message.many':
    'Sei sicuro di voler eliminare {count} operazioni selezionate?',
  'tradelog.batch.delete-confirm.message.other':
    'Sei sicuro di voler eliminare {count} operazioni selezionate?',
  'tradelog.batch.delete-confirm.warning':
    'Questa azione non può essere annullata.',
  'tradelog.batch.setups.title': 'Aggiungi setup alle operazioni',
  'tradelog.batch.setups.placeholder': 'Seleziona o crea setup...',
  'tradelog.batch.tags.title': 'Aggiungi tag alle operazioni',
  'tradelog.batch.tags.placeholder': 'Seleziona o crea tag...',
  'tradelog.batch.mistakes.title': 'Aggiungi errori alle operazioni',
  'tradelog.batch.mistakes.placeholder': 'Seleziona o crea errori...',
  'tradelog.batch.none-selected': 'NESSUNA SELEZIONATA',
  'tradelog.batch.selected-count': '{count} SELEZIONATE',
  'tradelog.batch.select-all.title': 'Seleziona tutte le operazioni visibili',
  'tradelog.batch.select-all.label': 'Seleziona tutto',

  'tradelog.batch.already-reviewed':
    'Tutte le {total} operazioni selezionate sono già revisionate',
  'tradelog.batch.already-reviewed-single':
    "L'operazione selezionata è già revisionata",
  'tradelog.batch.already-reviewed-plain': 'già revisionata',
  'tradelog.batch.no-updates-needed':
    'Nessun aggiornamento necessario: tutte le {total} avevano già questi {type}',
  'tradelog.batch.already-had-all': '{count} avevano già tutti i {type}',
  'tradelog.batch.errors-count.one': 'Si è verificato {count} errore',
  'tradelog.batch.errors-count.few': 'Si sono verificati {count} errori',
  'tradelog.batch.errors-count.many': 'Si sono verificati {count} errori',
  'tradelog.batch.errors-count.other': 'Si sono verificati {count} errori',
  'tradelog.batch.enable-multi-select': 'Attiva selezione multipla',
  'tradelog.batch.disable-multi-select': 'Disattiva selezione multipla',
  'tradelog.batch.column-settings': 'Impostazioni colonne',
  'tradelog.batch.marking-reviewed': 'Contrassegno in corso...',
  'tradelog.batch.add-setups.aria': 'Aggiungi setup',

  'tradelog.batch.add-setups.label': 'Aggiungi setup',
  'tradelog.batch.add-tags.aria': 'Aggiungi tag',

  'tradelog.batch.add-tags.label': 'Aggiungi tag',
  'tradelog.batch.add-mistakes.aria': 'Aggiungi errori',

  'tradelog.batch.add-mistakes.label': 'Aggiungi errori',
  'tradelog.batch.adding': 'Aggiunta...',
  'tradelog.batch.add-count': 'Aggiungi ({count})',
  'tradelog.batch.duplicate.aria': 'Duplica operazioni',
  'tradelog.batch.duplicate.label': 'Duplica',
  'tradelog.batch.duplicating': 'Duplicazione...',
  'tradelog.batch.duplicate-skipped.one':
    '{count} nota selezionata non può essere duplicata',
  'tradelog.batch.duplicate-skipped.few':
    '{count} note selezionate non possono essere duplicate',
  'tradelog.batch.duplicate-skipped.many':
    '{count} note selezionate non possono essere duplicate',
  'tradelog.batch.duplicate-skipped.other':
    '{count} note selezionate non possono essere duplicate',
  'tradelog.batch.delete.aria': 'Elimina operazioni',

  'tradelog.batch.deleting': 'Eliminazione...',
  'tradelog.batch.clear.aria': 'Deseleziona',

  'tradelog.batch.clear.label': 'Deseleziona',
  'tradelog.settings.active-columns': 'Colonne attive',
  'tradelog.settings.available-columns': 'Colonne disponibili',
  'tradelog.settings.active-desc':
    'Trascina per riordinare le colonne. Fai clic sulla X per rimuovere.',
  'tradelog.settings.available-desc':
    'Fai clic su una colonna per aggiungerla alla tabella.',
  'tradelog.settings.no-active':
    'Nessuna colonna attiva. Aggiungi colonne dalla scheda Disponibili.',
  'tradelog.settings.all-active': 'Tutte le colonne sono attive.',
  'tradelog.settings.expanded-view': 'Vista espansa',
  'tradelog.settings.expanded-view-desc':
    'Mostra tag, setup ed errori come badge a pillola',
  'tradelog.settings.expanded-view-aria': 'Attiva o disattiva la vista espansa',
  'tradelog.settings.saving': 'Salvataggio...',
  'tradelog.settings.reset': 'Ripristina predefiniti',
  'tradelog.category.basic': 'Informazioni di base',
  'tradelog.category.timing': 'Tempistica',
  'tradelog.category.prices': 'Prezzi',
  'tradelog.category.risk': 'Gestione del rischio',
  'tradelog.category.position': 'Posizione e P&L',
  'tradelog.category.review': 'Revisione',
  'tradelog.column.image': 'Immagine',
  'tradelog.column.account': 'Conto',
  'tradelog.column.ticker': 'Simbolo',
  'tradelog.column.exchange': 'Mercato',
  'tradelog.column.status': 'Stato',
  'tradelog.column.direction': 'Direzione',
  'tradelog.column.date': 'Data di apertura',
  'tradelog.column.entryTime': 'Ora di ingresso',
  'tradelog.column.exitDate': 'Data di chiusura',
  'tradelog.column.exitTime': 'Ora di uscita',
  'tradelog.column.duration': 'Durata',
  'tradelog.column.expirationDate': 'Scadenza',
  'tradelog.column.daysToExpiry': 'DTE',
  'tradelog.column.entryPrice': 'Ingresso',
  'tradelog.column.exitPrice': 'Uscita',
  'tradelog.column.priceMove': 'Movimento di prezzo',
  'tradelog.column.stopLoss': 'Stop Loss',
  'tradelog.column.slDistanceDollar': 'Dist. SL $',
  'tradelog.column.slDistancePercent': 'Dist. SL %',
  'tradelog.column.riskAmount': 'Rischio $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.maePrice': 'Prezzo MAE',
  'tradelog.column.mfePrice': 'Prezzo MFE',
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': 'Q.tà',
  'tradelog.column.positionValue': 'Valore $',
  'tradelog.column.fees': 'Spese',
  'tradelog.column.dividends': 'Dividendi',
  'tradelog.column.pnl': 'P&L netto',
  'tradelog.column.returnPercent': 'Rendimento %',
  'tradelog.column.setups': 'Setup',
  'tradelog.column.mistakes': 'Errori',
  'tradelog.column.tags': 'Tag',
  'tradelog.column.reviewed': 'Revisionata',
  'tradelog.column.thesis': 'Tesi',
  'tradelog.column.mtComment': 'Commento MT',
  'dashboard.title': 'Dashboard',
  'dashboard.empty.message': 'Nessun dato di trading disponibile',
  'dashboard.empty.submessage':
    'Importa operazioni precedenti per esplorare subito il tuo rendimento, oppure registra una nuova operazione a mano.',
  'dashboard.empty.import-action': 'Importa operazioni esistenti',
  'dashboard.empty.manual-action': "Aggiungi un'operazione a mano",
  'dashboard.empty.filter-hint': 'Prova a modificare i filtri',
  'dashboard.error.load-failed': 'Impossibile caricare i dati',
  'dashboard.no-data': 'Nessun dato di trading disponibile',
  'dashboard.button.add-widget': 'Aggiungi widget',
  'dashboard.button.save-layout': 'Salva layout',
  'dashboard.button.edit-layout': 'Modifica layout',
  'dashboard.metrics.netPnL': 'P&L netto',
  'dashboard.metrics.incl-unrealized': 'incl. {value} non realizzato',
  'dashboard.metrics.winRate': 'Tasso di vincita',
  'dashboard.metrics.profitFactor': 'Fattore di profitto',
  'dashboard.metrics.sharpeRatio': 'Indice Sharpe',
  'dashboard.metrics.expectancy': 'Aspettativa',
  'dashboard.metrics.numTrades': 'Operazioni totali',

  'dashboard.metrics.numWinTrades': 'Operazioni vincenti',
  'dashboard.metrics.numLossTrades': 'Operazioni perdenti',
  'dashboard.metrics.avgWin': 'Vincita media',
  'dashboard.metrics.avgLoss': 'Perdita media',
  'dashboard.metrics.totalCommission': 'Commissione totale',
  'dashboard.metrics.totalFees': 'Spese totali',
  'dashboard.metrics.maxDrawdown': 'Max Drawdown',
  'dashboard.metrics.bestDay': 'Giorno migliore',
  'dashboard.metrics.largestWin': 'Vincita maggiore',
  'dashboard.metrics.largestLoss': 'Perdita maggiore',
  'dashboard.metrics.longestWinStreak': 'Serie migliore',
  'dashboard.metrics.longestLossStreak': 'Serie peggiore',
  'dashboard.metrics.avgHoldTime': 'Tempo medio in posizione',
  'dashboard.metrics.avgWinHoldTime': 'Tempo medio vincite',
  'dashboard.metrics.avgLossHoldTime': 'Tempo medio perdite',
  'dashboard.metrics.avgWinnerHeat': 'MAE medio vincenti',
  'dashboard.metrics.winnerMaeP90': 'MAE P90 vincenti',
  'dashboard.metrics.winnerMaeMedian': 'MAE mediano vincenti',
  'dashboard.metrics.avgLossHeat': 'MAE medio perdite',
  'dashboard.metrics.winnerAvgMfe': 'MFE medio vincenti',
  'dashboard.metrics.loserAvgMfe': 'MFE medio perdenti',
  'dashboard.metrics.winnerMfeP90': 'MFE P90 vincenti',
  'dashboard.metrics.loserMfeP90': 'MFE P90 perdenti',
  'dashboard.metrics.avgRR': 'RR medio (rapporto vincita/perdita)',
  'dashboard.metrics.avgRRRiskBased': 'RR medio (basato su R)',
  'dashboard.avgRR.tooltip.formula': 'Formula: vincita media / perdita media',
  'dashboard.avgRR.tooltip.no-conversion':
    'Questo rapporto vincita/perdita si basa su valute miste senza conversione FX e può essere fuorviante.',
  'dashboard.sharpeRatio.tooltip.title': 'Indice Sharpe',
  'dashboard.sharpeRatio.tooltip.formula':
    'Formula: P&L netto medio delle operazioni chiuse / deviazione standard campionaria del P&L netto delle operazioni chiuse. Il tasso privo di rischio è 0 e il valore non è annualizzato.',
  'dashboard.sharpeRatio.tooltip.coverage':
    'Calcolato su {valid} di {total} operazioni chiuse',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'Copertura parziale: {valid} di {total} operazioni chiuse hanno un P&L netto finito.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'Servono almeno due operazioni chiuse con variabilità di P&L diversa da zero.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'Questo indice Sharpe si basa su valute miste senza conversione FX e può essere fuorviante.',
  'dashboard.avgRRRiskBased.tooltip.title': 'RR medio (basato su R)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'Formula: R medio vincente / R medio perdente',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    'Calcolato su {valid} di {total} operazioni chiuse con dati di rischio',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'Vincite con rischio valido: {wins}, perdite: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'Copertura rischio parziale: {valid} di {total} operazioni chiuse hanno dati di rischio validi.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'Dati insufficienti per il RR basato su R. Aggiungi dati di stop loss/rischio e assicurati che ci siano operazioni vincenti e perdenti valide.',
  'dashboard.conversion.title': 'Convertito in {currency}',
  'dashboard.conversion.converted-total': 'Totale convertito',
  'dashboard.conversion.base': 'Base: {currency}',

  'dashboard.conversion.using-ecb': 'Tassi BCE ({date})',
  'dashboard.conversion.using-broker-pnl':
    'P&L in valuta base del broker per {count} {tradeLabel}',
  'dashboard.conversion.using-manual-rate':
    'Tasso FX manuale per {count} {tradeLabel}',
  'dashboard.conversion.partial-warning':
    '⚠ Costi/rischio in {currencies} non convertibili ed esclusi',
  'dashboard.conversion.trade-singular': 'operazione',
  'dashboard.conversion.trade-plural': 'operazioni',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} di {total} operazioni ({excluded} escluse: {currencies})',
  'dashboard.conversion.original-pnl': 'P&L originale',
  'dashboard.conversion.converted-pnl': 'P&L convertito',
  'dashboard.conversion.details-label': 'Dettagli conversione valuta',

  'dashboard.top-section.remove-metric': 'Rimuovi metrica',
  'dashboard.top-section.failed-load': 'Impossibile caricare le metriche',
  'dashboard.filter.date.today': 'Oggi',
  'dashboard.filter.date.yesterday': 'Ieri',
  'dashboard.filter.date.this-week': 'Questa settimana',
  'dashboard.filter.date.this-month': 'Questo mese',
  'dashboard.filter.date.this-quarter': 'Questo trimestre',
  'dashboard.filter.date.this-year': "Quest'anno",
  'dashboard.filter.date.all-time': 'Tutto lo storico',
  'dashboard.filter.date.custom': 'Personalizzato',
  'dashboard.filter.date.from': 'Da',
  'dashboard.filter.date.to': 'A',
  'dashboard.filter.accounts.all': 'Tutti i conti',
  'dashboard.filter.accounts.n-selected': '{count} conti',
  'dashboard.filter.accounts.select-all': 'Seleziona tutto',

  'dashboard.filter.accounts.none-found': 'Nessun conto trovato',
  'dashboard.filter.tickers.none-found': 'Nessun simbolo trovato',

  'dashboard.widgets.daily-performance.title': 'Prestazioni giornaliere',
  'dashboard.widgets.daily-performance.period-aria': 'Periodo',
  'dashboard.widgets.daily-performance.period-days': '{count} giorni',
  'dashboard.widgets.weekday-performance.title':
    'Prestazioni per giorno della settimana',
  'dashboard.widgets.weekday-performance.metric-aria': 'Metrica',
  'dashboard.widgets.weekday-performance.metric.net': 'Netto',
  'dashboard.widgets.weekday-performance.metric.win-rate': 'Tasso di vincita',
  'dashboard.widgets.weekday-performance.metric.trades': 'Operazioni',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    'Tasso di vincita: {rate} ({wins}V / {losses}P)',
  'dashboard.widgets.weekday-performance.tooltip.trades': 'Operazioni: {count}',
  'dashboard.widgets.weekday-performance.tooltip.no-trades':
    'Nessuna operazione',
  'dashboard.widgets.hourly-performance.title': 'Prestazioni orarie',
  'dashboard.widgets.hourly-performance.tooltip.trades': 'Operazioni: {count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label':
    'Tasso di vincita',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    'Tasso di vincita: {rate} ({wins}V / {losses}P)',
  'dashboard.widgets.hourly-performance.bucket-aria': 'Dimensione intervallo',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes}m',
  'dashboard.widgets.hourly-performance.metric-aria': 'Metrica',
  'dashboard.widgets.hourly-performance.metric.total': 'Totale',
  'dashboard.widgets.hourly-performance.metric.average': 'Media',

  'dashboard.widgets.hourly-performance.metric.total-r': 'R totale',

  'dashboard.widgets.setup-performance.title': 'Prestazioni setup',
  'dashboard.widgets.setup-performance.description':
    'Classifica della performance per setup',
  'dashboard.widgets.setup-performance.empty':
    'Nessun dato di rendimento per setup',
  'dashboard.widgets.setup-performance.masked-label': 'Setup',
  'dashboard.widgets.tag-performance.title': 'Prestazioni tag',
  'dashboard.widgets.tag-performance.description':
    'Classifica della performance per tag',
  'dashboard.widgets.tag-performance.empty':
    'Nessun dato di rendimento per tag',
  'dashboard.widgets.tag-performance.masked-label': 'Tag',
  'dashboard.widgets.ticker-performance.title': 'Prestazioni simboli',
  'dashboard.widgets.ticker-performance.metric-aria': 'Metrica',
  'dashboard.widgets.ticker-performance.view-aria': 'Vista',
  'dashboard.widgets.ticker-performance.view.best-and-worst':
    'Migliori e peggiori',
  'dashboard.widgets.ticker-performance.view.best': 'Migliori 10',
  'dashboard.widgets.ticker-performance.view.worst': 'Peggiori 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'P&L totale',
  'dashboard.widgets.ticker-performance.metric.total-r': 'R totale',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'Tasso di vincita',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'Simbolo: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': 'Operazioni: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Tasso di vincita: {rate} ({wins}V / {losses}P)',
  'dashboard.widgets.ticker-performance.empty':
    'Nessun dato di rendimento per simbolo',
  'dashboard.widgets.ticker-performance.empty-submessage':
    'Nessuna operazione chiusa con un simbolo corrisponde ai filtri attuali.',
  'dashboard.widgets.ticker-performance.masked-ticker': 'Simbolo',
  'dashboard.widgets.ticker-performance.omitted-count': '{count} omessi',
  'dashboard.widgets.rollingStats.title': 'Media mobile vincita/perdita',
  'dashboard.widgets.rollingStats.period': 'Periodo',
  'dashboard.widgets.rollingStats.trades': '{count} operazioni',
  'dashboard.widgets.rollingStats.avgWin': 'Vincita media',
  'dashboard.widgets.rollingStats.avgLoss': 'Perdita media',
  'dashboard.widgets.rollingStats.tooltip.trade': 'Operazione {label}',
  'dashboard.rolling_win_loss.title': 'Rapporto mobile vincita/perdita',
  'dashboard.rolling_win_loss.period_aria': 'Periodo',
  'dashboard.rolling_win_loss.trades_count': '{count} operazioni',
  'dashboard.rolling_win_loss.trade_label': 'Operazione {label}',
  'dashboard.rolling_win_loss.ratio_label': 'Rapporto: {ratio}',
  'dashboard.rolling_win_loss.ratio_undefined':
    'Rapporto: nessuna perdita nella finestra',
  'dashboard.rolling_win_loss.avg_win_label': 'Vincita media: {value}',
  'dashboard.rolling_win_loss.no_losses_band': 'Nessuna perdita',
  'dashboard.rolling_win_loss.window_not_filled':
    'Servono almeno {count} operazioni chiuse',
  'dashboard.rolling_win_loss.avg_loss_label': 'Perdita media: {value}',
  'home.widget.recent-items.name': 'Elementi recenti',
  'home.widget.recent-items.description':
    'Mostra file e viste aperti di recente',
  'home.widget.year-heatmap.name': 'Heatmap di trading',
  'home.widget.year-heatmap.description':
    "Calendario della tua attività di trading nell'anno",
  'home.widget.getting-started.name': 'Per iniziare',
  'home.widget.getting-started.description':
    'Lista di controllo per configurare Journalit',
  'home.widget.getting-started.progress': '{completed}/{total} completati',
  'home.widget.getting-started.progress.loading': 'Verifica dei progressi...',
  'home.widget.getting-started.item.account.title':
    'Configura il tuo conto di trading',
  'home.widget.getting-started.item.account.description':
    'Le operazioni vengono registrate su un conto che tiene traccia del saldo. Senza di esso non si possono calcolare rendimenti e drawdown.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'Configura conto',
  'home.widget.getting-started.item.create.title':
    'Importa il tuo storico di trading',
  'home.widget.getting-started.item.create.description':
    'Importa operazioni esistenti, collega Trade Sync o aggiungi la prima operazione a mano.',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Apri Trade Import',
  'home.widget.getting-started.item.tradelog.title': 'Apri Registro operazioni',
  'home.widget.getting-started.item.tradelog.description':
    'Il tuo database per analizzare tutte le operazioni in un unico posto.',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta': 'Apri Registro operazioni',
  'home.widget.getting-started.item.layouts.title':
    'Apri costruttore di layout',
  'home.widget.getting-started.item.layouts.description':
    'Progetta i layout di revisione come preferisci.',
  'home.widget.getting-started.item.layouts.time': '1 min',
  'home.widget.getting-started.item.layouts.cta': 'Apri costruttore di layout',
  'home.widget.getting-started.item.sidebar.title': 'Apri la barra laterale',
  'home.widget.getting-started.item.sidebar.description':
    'Tieni a portata di mano le pagine, le revisioni, gli strumenti e la ricerca di Journalit.',
  'home.widget.getting-started.item.sidebar.time': '10s',
  'home.widget.getting-started.item.sidebar.cta': 'Apri barra laterale',
  'home.widget.getting-started.item.pro.title': 'Attiva Pro',
  'home.widget.getting-started.item.pro.description':
    'Attiva Trade Import, Trade Sync e il Calendario economico.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Attiva',
  'home.widget.weekly-summary.name': 'Riepilogo settimanale',
  'home.widget.weekly-summary.description':
    'Metriche della settimana con P&L giornaliero',
  'home.widget.key-events.name': 'Eventi chiave',
  'home.widget.key-events.description':
    'Notizie ed eventi dalla revisione settimanale',
  'home.widget.key-events.empty-title': 'Nessun evento chiave',
  'home.widget.key-events.open-aria':
    'Apri la Revisione settimanale di questa settimana',
  'home.widget.position-size.name': 'Calcolatore dimensione posizione',
  'home.widget.position-size.description':
    'Dimensiona le posizioni dal rischio del conto',
  'home.widget.embedded-note.name': 'Nota incorporata',
  'home.widget.embedded-note.description':
    'Mostra una qualsiasi nota markdown dal vault',
  'home.widget.current-streak.name': 'Serie attuale',
  'home.widget.current-streak.description':
    'Monitora le tue serie di vincite e perdite',
  'home.widget.best-hours.name': 'Ore migliori',
  'home.widget.best-hours.description':
    "Scopri quando operi meglio in base all'ora del giorno",
  'home.widget.setup-leaderboard.name': 'Ripartizione migliori',
  'home.widget.setup-leaderboard.description':
    'I tuoi migliori setup, tag, asset o simboli',
  'home.widget.unreviewed-trades.name': 'Operazioni da revisionare',
  'home.widget.unreviewed-trades.description':
    'Operazioni che richiedono la tua revisione',
  'home.widget.goals-progress.name': 'Avanzamento obiettivo',
  'home.widget.goals-progress.description':
    'Monitora i progressi verso il tuo obiettivo di trading',
  'home.widget.trading-score.name': 'Punteggio di trading',
  'home.widget.trading-score.description':
    'Un punteggio della tua performance complessiva',
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description': 'Saldi totali dei conti con trend a 7 giorni',
  'home.widget.drawdown-monitor.name': 'Monitoraggio drawdown',
  'home.widget.drawdown-monitor.description':
    'Utilizzo del limite di drawdown per conto',
  'home.widget.profit-target-widget.name': 'Target di profitto',
  'home.widget.profit-target-widget.description':
    'Monitora i progressi verso il target di profitto sui conti',
  'account.header.title': 'Conto: {name}',
  'account.header.add-event.aria': 'Aggiungi deposito/prelievo',
  'account.header.edit-account.aria': 'Modifica conto',
  'account.header.view-trades.aria':
    'Vedi le operazioni nel Registro operazioni',
  'account.header.type': 'Tipo:',
  'account.header.initial-balance': 'Saldo iniziale:',
  'account.header.current-balance': 'Saldo attuale:',
  'account.header.account-id': 'ID conto:',
  'account.header.warning.trades-before-creation.one':
    '{count} operazione trovata prima della data di creazione del conto',
  'account.header.warning.trades-before-creation.few':
    '{count} operazioni trovate prima della data di creazione del conto',
  'account.header.warning.trades-before-creation.many':
    '{count} operazioni trovate prima della data di creazione del conto',
  'account.header.warning.trades-before-creation.other':
    '{count} operazioni trovate prima della data di creazione del conto',
  'account.header.warning.earliest-trade':
    'Prima operazione: {date}. Questo può causare calcoli del saldo errati.',
  'account.header.warning.fix-date.aria':
    'Correggi la data di creazione del conto',
  'account.header.warning.fixing': 'Correzione...',
  'account.header.warning.fix-date': 'Correggi data',
  'account.header.notice.date-updated':
    'Data di creazione del conto aggiornata al {date}',
  'account.header.notice.update-failed-log':
    'Impossibile aggiornare la data di creazione del conto:',
  'account.header.notice.update-failed':
    'Impossibile aggiornare la data: {error}',
  'ribbon.open-journalit': 'Apri Journalit',

  'view.dashboard': 'Dashboard',
  'view.trade-log': 'Registro operazioni',
  'view.account-dashboard': 'Conti',
  'view.account-page.title': 'Conto: {name}',
  'view.account-page.title-default': 'Pagina del conto',
  'view.account-page.no-account-selected': 'Nessun conto selezionato',
  'view.account-page.no-account-instructions': 'Apri questa pagina da Conti.',
  'view.account-page.service-loading':
    'Caricamento del servizio della pagina del conto...',
  'view.account-page.balance-chart-title': 'Grafico del saldo del conto',
  'view.account-page.balance-chart-loading':
    'Caricamento del grafico del saldo...',
  'view.layout-builder': 'Costruttore di layout',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': 'Calendario economico',
  'view.economic-calendar.this-week': 'Questa settimana',
  'view.economic-calendar.import-count.one': 'Importa {count} evento',
  'view.economic-calendar.import-count.few': 'Importa {count} eventi',
  'view.economic-calendar.import-count.many': 'Importa {count} eventi',
  'view.economic-calendar.import-count.other': 'Importa {count} eventi',
  'view.economic-calendar.imported': 'Importato',
  'view.economic-calendar.update-available': 'Aggiornamento disponibile',
  'view.economic-calendar.filter.currency': 'Valuta',
  'view.economic-calendar.filter.impact': 'Impatto',
  'view.economic-calendar.impact.high': 'Alto',
  'view.economic-calendar.impact.medium': 'Medio',
  'view.economic-calendar.impact.low': 'Basso',
  'view.economic-calendar.impact.none': 'Nessuno',
  'view.economic-calendar.pro-required':
    'Il calendario economico richiede Journalit Pro',
  'view.economic-calendar.error.offline':
    'Impossibile caricare il calendario economico mentre sei offline.',
  'view.economic-calendar.error.generic':
    'Impossibile caricare il calendario economico.',
  'view.economic-calendar.empty':
    'Nessun evento economico per questa settimana.',
  'view.economic-calendar.sync.aria':
    'Apri le impostazioni del calendario economico',
  'view.economic-calendar.all-day': 'Tutto il giorno',
  'view.economic-calendar.holiday-aria': 'Festività',
  'view.economic-calendar.refresh': 'Aggiorna eventi',
  'view.economic-calendar.retry': 'Riprova',
  'view.economic-calendar.select-all': 'Seleziona tutto',
  'view.economic-calendar.select-aria': 'Seleziona {event}',
  'view.economic-calendar.impact-aria': 'Impatto: {impact}',
  'view.economic-calendar.forecast': 'Previsione',
  'view.economic-calendar.previous': 'Precedente',
  'view.economic-calendar.actual': 'Effettivo',
  'view.economic-calendar.import-success':
    '{imported} importati, {updated} aggiornati',
  'view.economic-calendar.import-failed': 'Impossibile importare gli eventi.',
  'view.economic-calendar.restore-missing-events':
    'Ripristina eventi mancanti ({count})',
  'economicCalendar.guide.main.intro.description':
    "Qui puoi consultare l'intera settimana. Journalit può anche mantenere aggiornata automaticamente la revisione settimanale, quindi l'importazione manuale è facoltativa.",
  'economicCalendar.guide.main.filters.title':
    'Questi filtri modificano solo questo calendario',
  'economicCalendar.guide.main.filters.description':
    'I filtri per valuta e impatto limitano ciò che vedi e selezioni qui. Non modificano le regole di importazione automatica.',
  'economicCalendar.guide.main.settings.title':
    "Configura l'importazione automatica nelle Impostazioni",
  'economicCalendar.guide.main.settings.description':
    'Usa questo pulsante per scegliere valute, livelli di impatto e festività, quindi attiva l’importazione automatica. Journalit sincronizza la settimana corrente con la revisione settimanale e aggiorna i valori importati senza riaggiungere gli eventi rimossi intenzionalmente.',
  'economicCalendar.guide.main.manual-import.title':
    'Le importazioni manuali sono facoltative',
  'economicCalendar.guide.main.manual-import.description':
    "Seleziona le righe visibili e usa Importa eventi per un'importazione singola. Non è necessario farlo ogni settimana quando l'importazione automatica è attiva.",
  'economicCalendar.guide.main.restore.title':
    'Ripristina gli eventi configurati mancanti',
  'economicCalendar.guide.main.restore.description':
    "Questo pulsante diventa disponibile quando mancano eventi dall'ambito di importazione automatica salvato. Resta visibile ma disattivato quando la settimana è di nuovo completa.",
  'economicCalendar.guide.main.summary.title':
    'Configura una volta, poi rivedi',
  'economicCalendar.guide.main.summary.description':
    'Dopo aver configurato l’importazione automatica, la revisione settimanale rimane aggiornata. Torna qui per consultare il calendario, effettuare importazioni singole o ripristinare eventi mancanti.',
  'view.economic-calendar.pro-benefit':
    'Eventi ad alto impatto nella tua nota settimanale.',
  'view.economic-calendar.pro-benefit-trial':
    'Inizia con una prova gratuita di 14 giorni.',
  'view.economic-calendar.sign-in': 'Hai già Pro? Accedi',
  'settings.economic-calendar.title': 'Calendario economico',
  'settings.economic-calendar.description':
    'Importa automaticamente gli eventi economici della settimana negli eventi chiave della nota settimanale.',
  'settings.economic-calendar.auto-import':
    'Importa automaticamente gli eventi settimanali',
  'settings.economic-calendar.auto-import-desc':
    'Mantiene la nota settimanale corrente sincronizzata con il calendario.',
  'settings.economic-calendar.currencies': 'Valute',
  'settings.economic-calendar.currencies-desc':
    'Lascia vuoto per includere tutte le valute.',
  'settings.economic-calendar.impacts': 'Livelli di impatto',
  'settings.economic-calendar.impacts-desc':
    'Scegli i livelli di impatto da importare.',
  'settings.economic-calendar.impacts-empty':
    'Nessun dato economico selezionato. Le festività possono comunque essere importate se abilitate.',
  'settings.economic-calendar.include-holidays': 'Includi festività',
  'settings.economic-calendar.include-holidays-desc':
    'Importa le festività pubbliche e bancarie delle valute selezionate.',
  'settings.economic-calendar.open-view': 'Apri calendario economico',
  'settings.economic-calendar.open-view-desc':
    'Consulta gli eventi della settimana e importa quelli selezionati.',
  'settings.economic-calendar.pro-required':
    "L'importazione automatica del calendario richiede Journalit Pro.",
  'widget.key-events.currency-label': 'Valuta',
  'widget.key-events.time-label': 'Ora',
  'widget.key-events.field-unset': 'Non impostato',
  'widget.key-events.open-calendar-aria': 'Apri calendario economico',
  'widget.key-events.restore-auto-import':
    'Ripristina gli eventi importati automaticamente',
  'widget.key-events.restore-missing-events':
    'Ripristina eventi mancanti ({count})',
  'home.quick-links.economic-calendar': 'Calendario economico',
  'navigation.items.nav-economic-calendar': 'Calendario economico',
  'command.open-economic-calendar': 'Apri calendario economico',

  'status-bar.update-available-branded': 'Aggiorna Journalit',
  'status-bar.release-notes-branded': 'Journalit · Visualizza note di rilascio',
  'status-bar.update-aria-label':
    'Journalit {version} - Fai clic per visualizzare',
  'update.available.ready': 'È pronta una nuova versione',
  'template.transformation.orphaned-content.header':
    'Contenuto del layout precedente',
  'template.transformation.orphaned-content.desc1':
    'Il contenuto seguente non è rientrato nel nuovo layout.',
  'template.transformation.orphaned-content.desc2':
    'Rivedilo e integralo sopra, oppure eliminalo se non ti serve più.',
  'template.editor.loading': 'Caricamento layout...',
  'template.editor.built-in': 'Integrato',
  'template.editor.unsaved-changes': 'Modifiche non salvate',

  'template.editor.built-in-notice':
    'I layout integrati non si possono modificare. Duplica questo layout o creane uno nuovo per personalizzarlo.',

  'template.editor.show-review-desc':
    'Quando mostrare la sezione revisione sulle note delle operazioni',

  'template.editor.section-visibility': 'Visibilità delle sezioni',
  'template.editor.trade-note-layout': 'Layout nota operazione',

  'template.editor.other-asset-types': 'Altri',

  'template.editor.asset-type-add': 'Tipo di asset',

  'template.editor.remove-asset-layout': "Rimuovi layout dell'asset",

  'template.editor.nav-bar': 'Barra di navigazione',
  'template.editor.nav-bar-desc':
    'Mostra la timeline delle operazioni e i link di revisione',
  'template.editor.images': 'Immagini',
  'template.editor.images-desc':
    'Mostra le immagini dei grafici delle operazioni',
  'template.editor.metrics': 'Metriche',
  'template.editor.metrics-desc':
    'Mostra le schede metriche di ingresso, uscita, durata e piano',
  'template.editor.thesis': 'Tesi',
  'template.editor.thesis-desc': "Mostra il blocco della tesi dell'operazione",
  'template.editor.missed-reason': "Motivo dell'operazione persa",
  'template.editor.missed-reason-desc':
    "Mostra perché l'operazione persa non è stata presa",
  'template.editor.metadata': 'Metadati',
  'template.editor.metadata-desc': 'Mostra conti, setup ed errori',
  'template.editor.metric-cards': 'Schede metriche',
  'template.editor.metadata-rows': 'Righe metadati',
  'template.editor.accounts': 'Conti',
  'template.editor.setups': 'Setup',
  'template.editor.mistakes': 'Errori',
  'template.editor.tags': 'Tag',
  'template.editor.custom-fields': 'Campi personalizzati',
  'template.editor.custom-fields-desc':
    '{count} campi personalizzati configurati',

  'template.editor.metric.position-size': 'Dimensione della posizione',
  'template.editor.metric.execution-breakdown': "Dettaglio dell'esecuzione",
  'template.editor.metric.pnl': 'P&L',
  'template.editor.metric.r-multiple': 'R-multiple',
  'template.editor.metric.costs': 'Costi',

  'template.editor.review-button': 'Pulsante Segna come revisionata',
  'template.editor.review-button-desc':
    "Mostra il pulsante per segnare l'operazione come revisionata",

  'csv.mapper.title': "Mappa le colonne sui campi dell'operazione",
  'csv.mapper.subtitle':
    "Associa le colonne ai campi dell'operazione che rappresentano.",
  'csv.mapper.do-not-import': 'Non importare',
  'csv.mapper.required-badge': 'Obbligatorio',
  'csv.mapper.required-label': 'OBBLIGATORIO',
  'csv.mapper.example': 'Esempio:',
  'csv.mapper.mode.title': 'Cosa rappresenta ogni riga?',
  'csv.mapper.mode.help':
    'I fogli di diario di solito hanno un trade chiuso per riga con una colonna P/L. Gli storici ordini dei broker elencano ogni acquisto e vendita su una riga separata.',

  'csv.mapper.asset-type.help':
    'Seleziona il tipo di strumento in questo file. Determina i campi obbligatori e la logica di analisi.',

  'csv.mapper.tip.title': 'Suggerimento: mappa altri campi',
  'csv.mapper.tip.desc':
    "Mappare campi facoltativi come commissioni e P/L migliora la qualità dell'importazione. Puoi anche mappare più colonne su campi elenco come tag, immagini, setup ed errori.",
  'csv.mapper.missing-fields': 'Campi obbligatori mancanti per {assetType}:',
  'csv.mapper.summary.title': 'Riepilogo:',
  'csv.mapper.summary.of': 'di',
  'csv.mapper.summary.columns-mapped': 'colonne mappate',
  'csv.mapper.summary.all-mapped': 'Tutti i campi obbligatori sono mappati',
  'csv.mapper.available-fields.title': 'Campi operazione disponibili',
  'csv.mapper.available-fields.desc':
    'Organizzati per categoria, con descrizioni per i campi specifici dello strumento',

  'csv.template-import.label.share-code': 'Codice di condivisione',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': 'Importa modello',

  'csv.template-import.error.import-failed': 'Impossibile importare il modello',

  'csv.export-template.label.share-code': 'Codice di condivisione',

  'csv.export-template.button.copied': 'Copiato!',
  'csv.export-template.button.copy': 'Copia negli appunti',
  'csv.mapper.field.symbol': 'Simbolo',
  'csv.mapper.field.direction': 'Direzione (Long/Short)',
  'csv.mapper.field.entry-time': 'Ora di ingresso',
  'csv.mapper.field.exit-time': 'Ora di uscita',
  'csv.mapper.field.entry-price': 'Prezzo di ingresso',
  'csv.mapper.field.exit-price': 'Prezzo di uscita',
  'csv.mapper.field.quantity': 'Quantità',
  'csv.mapper.field.notes': 'Note',
  'csv.mapper.field.order-id': 'ID ordine',
  'csv.mapper.field.account-id': 'ID conto',
  'csv.mapper.help.options-required':
    'Obbligatorio per le operazioni su opzioni',
  'csv.mapper.help.option-type-required':
    'Obbligatorio per le opzioni (call o put)',
  'csv.mapper.help.contract-size':
    'Moltiplicatore per opzioni (di solito 100) o futures',
  'csv.mapper.help.order-id': 'Usato per aggregare i fill parziali',
  'csv.mapper.help.asset-types': 'azioni, opzioni, futures, forex, crypto',
  'csv.mapper.help.status': "Stato dell'operazione: OPEN o CLOSED",
  'csv.mapper.category.required': 'Campi obbligatori',
  'csv.mapper.category.optional-core': 'Campi principali facoltativi',
  'csv.mapper.category.identifiers': 'Identificatori',
  'csv.mapper.category.other': 'Altro',
  'csv.mapper.category.options': 'Campi opzioni',
  'csv.mapper.category.futures': 'Campi futures',

  'csv.broker.label': 'Broker / Formato di importazione',

  'csv.broker.remove-favorite-aria': 'Rimuovi dai preferiti',
  'csv.broker.set-favorite-aria': 'Imposta come preferito',
  'csv.broker.ibkr': 'Interactive Brokers (IBKR)',
  'csv.broker.tradovate': 'Tradovate',
  'csv.broker.tradezero': 'TradeZero',
  'csv.broker.tradingview': 'TradingView Paper Trading',
  'csv.broker.bybit': 'Bybit (USDT Perpetuals)',
  'csv.broker.blofin': 'Blofin',
  'csv.broker.hyperliquid': 'Hyperliquid (Perpetuals)',
  'csv.broker.sierrachart': 'SierraChart (Futures)',
  'csv.broker.motivewave': 'MotiveWave',
  'csv.broker.fxreplay': 'FX Replay (Analytics)',
  'csv.broker.atas': 'ATAS (Statistics Realtime)',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker.jdr': 'MetaTrader 4 / 5',

  'csv.account-selector.favorite.remove': 'Rimuovi dai preferiti',
  'csv.account-selector.favorite.set': 'Imposta come preferito',

  'csv.results.successfully-imported-suffix': ' operazioni',

  'csv.results.failed-to-import-prefix': 'Impossibile importare ',
  'csv.results.failed-to-import-suffix': ' righe (vedi i dettagli sotto)',
  'csv.results.pending-local-writes':
    '{count} scritture di note operazione sono ancora in sospeso. Journalit riconcilierà le scritture completate e lascerà le proiezioni incomplete disponibili per il ripristino.',
  'csv.results.pending-title': 'Importazione ancora in sincronizzazione',

  'csv.image-review.count': '{count} immagini',

  'image.uploader.paste-title': 'Incolla media dagli appunti (Ctrl+V)',
  'image.uploader.pasting': 'Incollamento...',
  'image.uploader.paste': 'Incolla',
  'image.uploader.url-placeholder': 'Incolla URL del media o percorso file...',
  'image.uploader.url-input-aria': 'Campo URL del media',
  'image.uploader.file-upload-aria': 'Carica da file',
  'image.uploader.paste-clipboard-aria': 'Incolla dagli appunti',
  'image.uploader.error-invalid-url':
    'URL del media o percorso file non valido. Inserisci un URL di immagine/video supportato, un percorso media del vault o un link Excalidraw.',
  'image.viewer.alt-default': 'Immagine',
  'image.viewer.description-default': 'Anteprima media',

  'image.viewer.title-fullscreen': 'Fai clic per visualizzare a schermo intero',

  'image.viewer.delete-button': 'Elimina media',
  'image.viewer.nav-prev': 'Immagine precedente',
  'image.viewer.nav-next': 'Immagine successiva',
  'image.viewer.zoom-in-hint': 'Pizzica o fai clic per ingrandire',
  'image.viewer.zoom-out-hint':
    '{scale}x (pizzica o fai clic per rimpicciolire)',

  'image.viewer.close-aria': 'Chiudi schermo intero',
  'image.viewer.copy-image': 'Copia immagine',

  'image.viewer.copied': 'Copiato',
  'image.viewer.copy-failed': "Copia dell'immagine negli appunti non riuscita",
  'image.viewer.copy-unsupported':
    "La copia dell'immagine negli appunti non è supportata in questo ambiente",
  'media.viewer.video-controls': 'Controlli video',
  'media.viewer.play-video': 'Riproduci video',
  'media.viewer.pause-video': 'Metti in pausa il video',
  'media.viewer.mute-video': 'Disattiva audio',
  'media.viewer.unmute-video': 'Riattiva audio',
  'media.viewer.volume': 'Volume',
  'media.viewer.back-5': 'Indietro di 5 secondi',
  'media.viewer.forward-5': 'Avanti di 5 secondi',
  'media.viewer.timeline': 'Barra temporale del video',

  'image.carousel.no-images': 'Nessuna immagine da mostrare',
  'image.carousel.prev': 'Immagine precedente',
  'image.carousel.next': 'Immagine successiva',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'Miniatura {index}',
  'paste.notice.image-pasted': '📋 Immagine incollata con successo',
  'paste.notice.images-pasted': '📋 {count} immagini incollate con successo',
  'paste.error.clipboard-not-supported': 'API degli appunti non supportata',
  'paste.error.clipboard-empty': 'Niente da incollare negli appunti',
  'paste.error.file-size-exceeds':
    'La dimensione del file {size}MB supera il limite',
  'paste.error.no-images-found':
    "Nessuna immagine trovata negli appunti. Prova prima a copiare un'immagine.",
  'paste.error.permission-denied': 'Permesso negato',

  'datepicker.button.clear': 'Azzera',
  'datepicker.button.today': 'Oggi',
  'datepicker.button.now': 'Adesso',
  'datepicker.placeholder.day': 'GG',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'AA',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',
  'common.loading': 'Caricamento...',
  'common.error': 'Errore',

  'common.warning': 'Avviso',
  'common.info': 'Info',
  'common.yes': 'Sì',
  'common.no': 'No',
  'common.ok': 'OK',

  'common.select-option': "Seleziona un'opzione",

  'common.none': 'Nessuno',
  'common.other': 'Altro',
  'common.breakdown': 'Dettaglio',
  'common.na': 'N/A',
  'common.unknown': 'Sconosciuto',
  'common.unknown-error': 'Errore sconosciuto',
  'common.all': 'Tutti',
  'common.select-all': 'Seleziona tutto',
  'common.n-types': '{count} tipi',
  'common.select-item': 'Seleziona {item}',
  'common.header': 'Intestazione',

  'common.date': 'Data',

  'common.days': 'Giorni',
  'common.week': 'Settimana',
  'common.weeks': 'Settimane',
  'common.month': 'Mese',
  'common.months': 'Mesi',
  'common.year': 'Anno',
  'common.years': 'Anni',
  'common.quarter': 'Trimestre',
  'common.quarters': 'Trimestri',

  'common.min': 'Min',
  'common.max': 'Max',
  'common.best': 'Migliore',
  'common.worst': 'Peggiore',
  'common.profit': 'Profitto',

  'common.trade': 'Operazione',
  'common.trades': 'Operazioni',

  'common.statuses': 'Stati',
  'common.enabled': 'attivato',
  'common.disabled': 'disattivato',
  'common.color.gray': 'Grigio',
  'common.color.red': 'Rosso',
  'common.color.orange': 'Arancione',
  'common.color.yellow': 'Giallo',
  'common.color.label': 'Colore',
  'common.color.default': 'Predefinito',
  'common.day.monday': 'Lunedì',
  'common.day.tuesday': 'Martedì',
  'common.day.wednesday': 'Mercoledì',
  'common.day.thursday': 'Giovedì',
  'common.day.friday': 'Venerdì',
  'common.day.saturday': 'Sabato',
  'common.day.sunday': 'Domenica',
  'common.day.all-week': 'Tutta la settimana',
  'common.month.january': 'Gennaio',
  'common.month.february': 'Febbraio',
  'common.month.march': 'Marzo',
  'common.month.april': 'Aprile',
  'common.month.may': 'Maggio',
  'common.month.june': 'Giugno',
  'common.month.july': 'Luglio',
  'common.month.august': 'Agosto',
  'common.month.september': 'Settembre',
  'common.month.october': 'Ottobre',
  'common.month.november': 'Novembre',
  'common.month.december': 'Dicembre',
  'common.score.poor': 'Scarso',
  'common.score.below-average': 'Sotto la media',
  'common.score.average': 'Nella media',
  'common.score.strong': 'Solido',
  'common.score.excellent': 'Eccellente',
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'Picco di P&L realizzato',
  'chart.tooltip.episode-start': 'Inizio episodio',
  'chart.tooltip.underwater-days': "Tempo sott'acqua",
  'chart.tooltip.underwater-trades': "Operazioni sott'acqua",

  'chart.tooltip.drawdown-amount': 'Importo',
  'chart.tooltip.drawdown-percent': 'Drawdown % di {basis}',
  'chart.tooltip.percent-basis': 'Base percentuale',
  'chart.tooltip.trade-pnl': "P&L dell'operazione",

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} in più',
  'chart.loading': 'Caricamento grafico...',
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'Ingresso',
  'chart.legend.exit': 'Uscita',
  'chart.legend.trade': 'Operazione',
  'calendar.day.mon': 'Lun',
  'calendar.day.tue': 'Mart',
  'calendar.day.wed': 'Mer',
  'calendar.day.thu': 'Gio',
  'calendar.day.fri': 'Ven',
  'calendar.day.sat': 'Sab',
  'calendar.day.sun': 'Dom',
  'calendar.month.jan': 'Gen',
  'calendar.month.feb': 'Feb',
  'calendar.month.mar': 'Mar',
  'calendar.month.apr': 'Apr',
  'calendar.month.may': 'Mag',
  'calendar.month.jun': 'Giu',
  'calendar.month.jul': 'Lug',
  'calendar.month.aug': 'Ago',
  'calendar.month.sep': 'Set',
  'calendar.month.oct': 'Ott',
  'calendar.month.nov': 'Nov',
  'calendar.month.dec': 'Dic',
  'calendar.legend.less': 'Meno',
  'calendar.legend.more': 'Più',

  'settings.ftp.title': 'Credenziali FTP',
  'settings.ftp.title-metatrader': 'Credenziali FTP per MetaTrader',
  'settings.ftp.loading': 'Caricamento delle credenziali FTP...',
  'settings.ftp.info-message':
    'Usa queste credenziali per configurare la pubblicazione FTP di MetaTrader:',
  'settings.ftp.label.server': 'Server FTP:',
  'settings.ftp.label.login': 'Nome utente FTP:',
  'settings.ftp.label.password': 'Password FTP:',
  'settings.ftp.aria.copy-server': 'Copia il server FTP',
  'settings.ftp.aria.copy-login': 'Copia il nome utente FTP',
  'settings.ftp.aria.copy-password': 'Copia la password',
  'settings.ftp.aria.password-unavailable':
    'Password non disponibile per la copia',
  'settings.ftp.aria.password-hidden': 'Password nascosta',
  'settings.ftp.aria.hide-password': 'Nascondi la password',
  'settings.ftp.aria.show-password': 'Mostra la password',
  'settings.ftp.notice.password-masked':
    'La password è salvata ma non è disponibile per la visualizzazione o la copia. Reimposta la password per ottenerne una nuova.',
  'settings.ftp.notice.password-save':
    'Salva questa password in un posto sicuro. Non potrà essere recuperata in seguito.',
  'settings.ftp.button.reset': 'Reimposta la password FTP',
  'settings.ftp.button.resetting': 'Reimpostazione della password...',
  'settings.ftp.reset-hint':
    'Fai clic su questo pulsante per generare una nuova password FTP.',
  'settings.ftp.instructions.title':
    'Istruzioni di configurazione di MetaTrader 4:',
  'settings.ftp.instructions.step1': 'Apri MetaTrader 4 (MT4)',
  'settings.ftp.instructions.step2': 'Fai clic sul menu "Strumenti" in alto',
  'settings.ftp.instructions.step3': 'Seleziona "Opzioni"',
  'settings.ftp.instructions.step4':
    'Vai alla scheda "FTP" e inserisci il server, il nome utente e la password FTP mostrati sopra',
  'settings.ftp.instructions.step5': 'Attiva "Modalità passiva"',
  'settings.ftp.instructions.step6':
    "Attiva la pubblicazione automatica dei report via FTP e imposta l'intervallo di aggiornamento a 60 minuti",
  'settings.ftp.no-credentials':
    'Nessuna credenziale FTP trovata. Fai clic su "Crea credenziali FTP" nella sezione sopra per generarle.',
  'settings.ftp.error.reset-failed': 'Impossibile reimpostare la password',

  'settings.auth.status-offline': 'Non in linea',
  'settings.auth.status-online': 'In linea',

  'settings.auth.signed-in': 'Accesso effettuato',
  'settings.auth.sign-in-up': 'Accedi / Registrati',
  'settings.auth.sign-out': 'Esci',

  'settings.auth.subscription-features': "Funzioni dell'abbonamento",

  'settings.auth.offline-mode': 'Modalità offline',

  'settings.auth.guest': 'Ospite',

  'settings.auth.your-plan': 'Il tuo piano',

  'settings.auth.manage-subscription': "Gestisci l'abbonamento",
  'settings.tab.general': 'Generale',
  'settings.tab.reviews': 'Revisione',

  'settings.tab.customization': 'Personalizzazione',
  'settings.tab.journal-setup': 'Configurazione del diario',
  'settings.tab.backend': 'Trade Sync',
  'settings.tab.trading': 'Operazioni',
  'settings.tab.sync': 'Sincronizzazione',
  'settings.tab.accounts': 'Conti',
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Revisione settimanale',
  'settings.reviews.monthly': 'Revisione mensile',
  'settings.reviews.quarterly': 'Revisione trimestrale',
  'settings.reviews.yearly': 'Revisione annuale',
  'settings.reviews.default-templates': 'Layout predefiniti',

  'settings.reviews.trade-template': 'Layout operazioni',
  'settings.reviews.trade-template-desc':
    'Layout usato per le nuove note operazione',
  'settings.reviews.drc-template': 'Layout DRC',
  'settings.reviews.drc-template-desc': 'Layout usato per i nuovi DRC',
  'settings.reviews.weekly-template': 'Layout settimanale',
  'settings.reviews.weekly-template-desc':
    'Layout usato per le nuove revisioni settimanali',
  'settings.reviews.monthly-template': 'Layout mensile',
  'settings.reviews.monthly-template-desc':
    'Layout usato per le nuove revisioni mensili',
  'settings.reviews.quarterly-template': 'Layout trimestrale',
  'settings.reviews.quarterly-template-desc':
    'Layout usato per le nuove revisioni trimestrali',
  'settings.reviews.yearly-template': 'Layout annuale',
  'settings.reviews.yearly-template-desc':
    'Layout usato per le nuove revisioni annuali',
  'settings.reviews.template-builder': 'Editor di layout',
  'settings.reviews.template-builder-desc':
    "Crea, modifica e gestisci i tuoi layout in modo visivo. La vista Editor ti permette di trascinare e rilasciare le sezioni, configurare le opzioni e vedere l'anteprima dei layout in tempo reale.",
  'settings.reviews.open-builder': "Apri l'editor di layout",
  'settings.general.review-links-new-tab':
    'Apri i link dei widget di revisione in nuove schede',
  'settings.general.review-links-new-tab-desc':
    'Se disattivata, i link sostituiscono la scheda corrente.',
  'settings.general.review-links-new-tab-aria':
    'Apri i link alle note dei widget di revisione in nuove schede',
  'settings.general.tab-behavior': 'Comportamento delle schede',
  'settings.reviews.recurring-goals': 'Obiettivi ricorrenti',
  'settings.reviews.recurring-goals-desc':
    'Definisci gli obiettivi che compaiono automaticamente in ogni nuova revisione. Vengono copiati alla creazione della revisione e puoi modificarli per ciascuna revisione.',
  'settings.reviews.daily-goals': 'Obiettivi giornalieri',
  'settings.reviews.daily-goal-placeholder':
    'Aggiungi un obiettivo giornaliero ricorrente...',
  'settings.reviews.weekly-goals': 'Obiettivi settimanali',
  'settings.reviews.weekly-goal-placeholder':
    'Aggiungi un obiettivo settimanale ricorrente...',
  'settings.reviews.pre-trade-checklist':
    'Lista di controllo pre-operazione del DRC',
  'settings.reviews.pre-trade-checklist-desc':
    'Definisci le voci della lista di controllo che compaiono automaticamente in ogni nuovo DRC. Vengono copiate in ogni DRC alla creazione e puoi modificarle per ciascun giorno.',
  'settings.reviews.checklist-placeholder':
    'Aggiungi una voce alla lista di controllo...',
  'settings.reviews.weekly-checklist':
    'Lista di controllo di preparazione settimanale',
  'settings.reviews.weekly-checklist-desc':
    'Definisci le voci della lista di controllo che compaiono automaticamente in ogni nuova revisione settimanale. Vengono copiate in ogni revisione settimanale alla creazione e puoi modificarle per ciascuna settimana.',
  'settings.reviews.weekly-checklist-placeholder':
    'Aggiungi una voce alla lista di controllo settimanale...',
  'settings.reviews.auto-create': 'Crea automaticamente le revisioni',
  'settings.reviews.global-auto-create':
    'Creazione automatica globale delle revisioni',
  'settings.reviews.global-auto-create-desc':
    'Crea automaticamente le revisioni quando viene registrata la prima operazione del periodo corrispondente. Questa impostazione vale per le revisioni giornaliere, settimanali, mensili, trimestrali e annuali.',
  'settings.reviews.global-auto-create-aria':
    'Creazione automatica globale delle revisioni',
  'settings.reviews.auto-create-drc-nav':
    'Crea automaticamente il DRC alla navigazione',
  'settings.reviews.auto-create-drc-nav-desc':
    'Crea automaticamente un nuovo DRC quando navighi a un giorno che non ne ha uno',
  'settings.reviews.auto-create-drc-nav-aria':
    'Crea automaticamente il DRC alla navigazione',
  'settings.reviews.auto-create-weekly-nav':
    'Crea automaticamente la revisione settimanale alla navigazione',
  'settings.reviews.auto-create-weekly-nav-desc':
    'Crea automaticamente una nuova revisione settimanale quando navighi a una settimana che non ne ha una',
  'settings.reviews.auto-create-weekly-nav-aria':
    'Crea automaticamente la revisione settimanale alla navigazione',
  'settings.reviews.auto-create-monthly-nav':
    'Crea automaticamente la revisione mensile alla navigazione',
  'settings.reviews.auto-create-monthly-nav-desc':
    'Crea automaticamente una nuova revisione mensile quando navighi a un mese che non ne ha una',
  'settings.reviews.auto-create-monthly-nav-aria':
    'Crea automaticamente la revisione mensile alla navigazione',
  'settings.reviews.auto-create-quarterly-nav':
    'Crea automaticamente la revisione trimestrale alla navigazione',
  'settings.reviews.auto-create-quarterly-nav-desc':
    'Crea automaticamente una nuova revisione trimestrale quando navighi a un trimestre che non ne ha una',
  'settings.reviews.auto-create-quarterly-nav-aria':
    'Crea automaticamente la revisione trimestrale alla navigazione',
  'settings.reviews.auto-create-yearly-nav':
    'Crea automaticamente la revisione annuale alla navigazione',
  'settings.reviews.auto-create-yearly-nav-desc':
    'Crea automaticamente una nuova revisione annuale quando navighi a un anno che non ne ha una',
  'settings.reviews.auto-create-yearly-nav-aria':
    'Crea automaticamente la revisione annuale alla navigazione',

  'settings.reviews.notice.builder-not-found':
    'Comando Editor di layout non trovato',
  'settings.reviews.notice.global-auto-create':
    'Creazione automatica per tutte le revisioni {status}',
  'settings.reviews.notice.auto-create-nav':
    'Creazione automatica di {type} alla navigazione {status}',
  'settings.reviews.daily.checklist-title':
    'Voci della lista di controllo pre-operazione',

  'settings.reviews.daily.questions-title': 'Domande di revisione',

  'library.type.drc': 'DRC',
  'library.type.weekly': 'Settimanale',
  'library.type.monthly': 'Mensile',
  'library.type.quarterly': 'Trimestrale',
  'library.type.yearly': 'Annuale',
  'library.type.trade': 'Operazione',
  'library.error.invalid-share-code': 'Codice di condivisione non valido',
  'library.notice.import-success': 'Layout "{name}" importato con successo!',
  'library.error.import-failed': 'Importazione del layout non riuscita',
  'library.notice.select-template': 'Seleziona un layout da esportare',
  'library.notice.template-not-found': 'Layout non trovato',
  'library.notice.code-generated': 'Codice di condivisione generato!',
  'library.error.export-failed': 'Esportazione del layout non riuscita',
  'library.error.export-too-large':
    'Questo layout è troppo grande per essere esportato come codice di condivisione.',
  'library.notice.copied': 'Codice di condivisione copiato negli appunti!',
  'library.error.copy-failed': 'Copia negli appunti non riuscita',
  'library.title.import': 'Importa layout',
  'library.desc.import':
    'Incolla un codice di condivisione JRT per importare un layout da un altro utente.',
  'library.label.share-code': 'Codice di condivisione',
  'library.placeholder.import-code':
    'Incolla qui il codice di condivisione JRT-...',
  'library.button.validating': 'Convalida in corso...',
  'library.button.validate': 'Convalida',
  'library.button.import': 'Importa layout',
  'library.preview.valid': 'Layout valido',
  'library.preview.invalid': 'Codice di condivisione non valido',
  'library.title.export': 'Esporta layout',
  'library.desc.export':
    'Seleziona un layout per generare un codice di condivisione che altri possono importare.',
  'library.empty.title': 'Nessun layout personalizzato da esportare.',
  'library.empty.hint':
    'Crea prima un layout personalizzato nelle schede dei layout di revisione o delle operazioni, poi torna qui per condividerlo.',
  'library.label.select-template': 'Seleziona layout',
  'library.option.select-template': '-- Seleziona un layout --',
  'library.button.generate-code': 'Genera codice di condivisione',
  'library.button.copy-code': 'Copia negli appunti',

  'settings.reviews.daily.timeframes-title': 'Timeframe delle previsioni',

  'settings.reviews.daily.timeframes-placeholder':
    'Nuovo timeframe (es. 15M, 5M)',
  'settings.weekly.review-questions': 'Domande di revisione',

  'settings.weekly.forecast-timeframes': 'Timeframe delle previsioni',

  'settings.shared.timeframes.title': 'Timeframe delle previsioni',

  'settings.shared.timeframes.placeholder': 'Nuovo timeframe (es. 15M, 5M)',

  'shared.empty-state.message': 'Nessun dato disponibile',

  'weekly.tab.review': 'Revisione',
  'weekly.review.drcs.title': 'Revisioni giornaliere di questa settimana',

  'account.settings.modal.title': 'Impostazioni dashboard conti',
  'account.settings.notice.name-empty':
    'Il nome del tipo di conto non può essere vuoto',
  'account.settings.notice.type-exists': 'Il tipo di conto "{name}" esiste già',
  'account.settings.notice.reserved-name':
    '"{name}" è un nome di tipo di conto riservato',
  'account.settings.notice.type-added':
    'Tipo di conto "{name}" aggiunto con successo',
  'account.settings.notice.add-error':
    "Errore durante l'aggiunta del tipo di conto: {error}",
  'account.settings.notice.cannot-delete-archived':
    'Impossibile eliminare il tipo di conto "Archiviato" — è riservato per archiviare i conti',
  'account.settings.notice.analyze-error':
    "Errore durante l'analisi dell'uso dei tipi di conto",
  'account.settings.notice.cannot-delete-has-accounts':
    'Impossibile eliminare "{name}" — ha {count} conti associati. La funzione di migrazione arriverà presto.',
  'account.settings.notice.saved':
    'Impostazioni dashboard conti salvate con successo',
  'account.settings.notice.save-error':
    'Errore durante il salvataggio delle impostazioni: {error}',
  'account.settings.notice.migration-target-required':
    'Seleziona un tipo di conto di destinazione per la riassegnazione',
  'account.settings.notice.migration-failed':
    'Migrazione non riuscita: {error}',
  'account.settings.notice.type-deleted':
    'Tipo di conto "{name}" eliminato con successo',
  'account.settings.notice.type-deleted-with-cleanup':
    'Tipo di conto "{name}" eliminato con successo (pulizia: {actions})',
  'account.settings.notice.migration-error':
    'Errore durante la migrazione: {error}',
  'account.settings.notice.delete-error':
    "Errore durante l'eliminazione del tipo di conto: {error}",
  'account.settings.notice.operation-failed':
    '{operation} non riuscita: {error}',
  'account.settings.notice.migration-no-targets':
    'Impossibile migrare i conti — nessun altro tipo di conto disponibile. Crea prima un nuovo tipo di conto.',
  'account.settings.notice.type-deleted-migrated':
    'Tipo di conto "{name}" eliminato con successo. {count} conti {action}',
  'account.settings.operation.type-deletion': 'Eliminazione tipo di conto',
  'account.settings.migration.error.target-required':
    'Tipo di destinazione richiesto per la riassegnazione',
  'account.settings.migration.error.invalid-option':
    'Opzione di migrazione non valida',
  'account.settings.unnamed-account': 'Conto senza nome',
  'account.settings.migration.title': "Migra i conti prima dell'eliminazione",
  'account.settings.migration.warning':
    'Stai per eliminare "{name}" che ha {count} conti associati.',
  'account.settings.migration.instruction':
    'Questi conti devono essere gestiti prima di poter eliminare il tipo di conto:',
  'account.settings.migration.more-accounts': '... e altri {count}',
  'account.settings.migration.choose-option':
    'Scegli come gestire questi conti:',
  'account.settings.migration.option.reassign.title':
    'Riassegna a un altro tipo',
  'account.settings.migration.option.reassign.desc':
    'Sposta tutti i conti su un altro tipo di conto',
  'account.settings.migration.target-type.label':
    'Tipo di conto di destinazione:',
  'account.settings.migration.option.archive.title': 'Archivia conti',
  'account.settings.migration.option.archive.desc':
    'Sposta tutti i conti nello stato "archiviato"',
  'account.settings.migration.option.delete.title':
    "Contrassegna per l'eliminazione",
  'account.settings.migration.option.delete.desc':
    'Contrassegna tutti i conti come eliminati',
  'account.settings.migration.button.migrate': 'Migra ed elimina tipo',
  'account.settings.migration.button.migrating': 'Migrazione...',
  'account.settings.migration.action.reassigned': 'riassegnati a "{target}"',
  'account.settings.migration.action.archived':
    'spostati nello stato archiviato',
  'account.settings.migration.action.deleted':
    "contrassegnati per l'eliminazione",
  'account.settings.delete.title': 'Elimina tipo di conto',
  'account.settings.delete.confirm-question':
    'Sei sicuro di voler eliminare il tipo di conto "{name}"?',
  'account.settings.delete.impact-analysis': "Analisi dell'impatto:",
  'account.settings.delete.affected-accounts': '⚠️ {count} conti interessati:',
  'account.settings.delete.migration-notice':
    "Nota: questi conti dovranno essere riassegnati a un altro tipo di conto prima di procedere con l'eliminazione.",
  'account.settings.delete.no-affected':
    '✅ Nessun conto usa questo tipo di conto',
  'account.settings.delete.cleanup-title': 'Impostazioni che verranno pulite:',
  'account.settings.delete.cleanup.excluded':
    '✓ Rimosso dai tipi di conto esclusi',
  'account.settings.delete.cleanup.order':
    "✓ Rimosso dall'ordine di visualizzazione",
  'account.settings.delete.cleanup.withdrawals':
    '✓ Rimosso dalle impostazioni prelievi',
  'account.settings.delete.cleanup.none':
    'Nessuna pulizia delle impostazioni necessaria',
  'account.settings.delete.button.setup-migration': 'Configura migrazione',
  'account.settings.delete.button.delete': 'Elimina tipo di conto',
  'account.settings.delete.button.deleting': 'Eliminazione...',
  'account.settings.section.available-types.title': 'Tipi di conto disponibili',
  'account.settings.section.available-types.desc':
    'Tipi di conto attualmente nel sistema.',
  'account.settings.section.available-types.placeholder':
    'Inserisci il nome del tipo di conto...',
  'account.settings.section.available-types.add-aria':
    'Aggiungi nuovo tipo di conto',
  'account.settings.section.available-types.delete-aria': 'Elimina {name}',
  'account.settings.section.available-types.empty':
    'Nessun tipo di conto personalizzato definito.',
  'account.settings.section.inclusion.title': 'Tipi di conto della dashboard',
  'account.settings.section.inclusion.desc':
    'Scegli quali tipi di conto appaiono nelle statistiche della dashboard, se i prelievi contano e il loro ordine di visualizzazione.',
  'account.settings.section.inclusion.include-dashboard':
    'Nelle statistiche della dashboard',
  'account.settings.section.inclusion.include-withdrawals': 'Prelievi',
  'account.settings.section.inclusion.empty':
    'Nessun tipo di conto disponibile da configurare.',
  'account.settings.section.order.title': 'Ordine di visualizzazione',

  'account.settings.section.order.move-up': 'Sposta su',
  'account.settings.section.order.move-down': 'Sposta giù',
  'account.settings.button.save': 'Salva impostazioni',
  'account.settings.button.saving': 'Salvataggio...',

  'weekly.review.performance.title': 'Autovalutazione delle prestazioni',
  'weekly.review.performance.mental': 'Gioco mentale',

  'weekly.review.performance.technical': 'Esecuzione tecnica',

  'weekly.review.questions.title': 'Domande della revisione settimanale',

  'weekly.review.goals.title': 'Obiettivi per la prossima settimana',

  'weekly.preparation.goals.title': 'Obiettivi settimanali',

  'weekly.preparation.events.title': 'Eventi chiave',

  'weekly.preparation.events.add-button': 'Aggiungi evento',

  'weekly.preparation.forecast.title': 'Previsione settimanale',
  'weekly.overview.pnl-chart.title': 'P&L cumulativo settimanale',

  'weekly.overview.drawdown-chart.title': 'Drawdown settimanale',

  'weekly.overview.performance.title': 'Prestazioni settimanali',

  'weekly.overview.setup-performance.title': 'Prestazioni dei setup',

  'weekly.overview.trades-chart.title': 'Operazioni settimanali',

  'weekly.overview.best-trade.title': 'Migliore operazione della settimana',

  'weekly.overview.worst-trade.title': 'Peggiore operazione della settimana',

  'weekly.overview.daily-performance.title': 'Prestazioni giornaliere',

  'weekly.overview.button.create-trade': 'Crea operazione',
  'weekly.overview.button.view-trade-details': 'Vedi dettagli operazione',

  'monthly.tab.review': 'Revisione',

  'backend.title': 'Trade Sync',
  'backend.description':
    'Configura Trade Sync per i broker supportati per mantenere aggiornato automaticamente il tuo vault.',

  'trade-sync.gate.pro.description':
    'Trade Sync è una funzione Pro. Passa a Pro per continuare.',

  'trade-sync.gate.feature-unavailable.title': 'Funzione non disponibile',
  'trade-sync.gate.feature-unavailable.description':
    'Questa funzione di sincronizzazione non è attiva per il tuo account Pro. Aggiorna lo stato o contatta il supporto se il problema persiste.',
  'trade-sync.trial.title': 'Automatizza il tuo diario di trading',
  'trade-sync.trial.description':
    'Risparmia fino a 7 ore a settimana con Journalit Pro.',
  'trade-sync.trial.benefit.sync':
    'Sincronizzazione automatica delle operazioni',
  'trade-sync.trial.benefit.import': 'Importa operazioni da qualsiasi fonte',
  'trade-sync.trial.cta': 'Inizia la prova gratuita di 14 giorni',
  'trade-sync.trial.existing-subscriber': 'Sei già abbonato? Accedi',
  'trade-sync.trial.eligibility':
    'La prova gratuita è disponibile solo per i nuovi abbonati.',

  'premium.gate.cta.continue-pro': 'Continua con Pro',

  'premium.gate.cta.refresh': 'Aggiorna stato',

  'premium.gate.offline':
    "Sembra che tu sia offline. L'attivazione richiede Internet.",
  'premium.gate.not-pro-yet':
    "Hai effettuato l'accesso, ma il tuo account non è ancora Pro. Passa a Pro e poi aggiorna.",

  'backend.status.connected': 'Connesso',
  'backend.status.disconnected': 'Disconnesso',
  'backend.status.checking': 'Controllo...',
  'backend.register.title': 'Registra vault',
  'backend.register.description':
    'Registra questo vault sul server per la sincronizzazione',
  'backend.register.button': 'Registra vault',
  'backend.register.registering': 'Registrazione...',
  'backend.ftp.title': 'Credenziali FTP',
  'backend.ftp.description':
    'Crea credenziali FTP per caricare i report MetaTrader. Un nome utente univoco verrà generato automaticamente.',
  'backend.ftp.create-button': 'Crea credenziali FTP',
  'backend.ftp.creating': 'Creazione...',

  'backend.sync.auto-sync': 'Attiva sincronizzazione automatica',
  'backend.sync.auto-sync-desc':
    'Sincronizza automaticamente le operazioni dal server',
  'backend.sync.auto-sync-info':
    'La sincronizzazione automatica controlla nuove operazioni ogni ora',
  'backend.sync.auto-sync-aria': 'Attiva sincronizzazione automatica',

  'backend.sync.syncing': 'Sincronizzazione...',

  'backend.sync.last-result': "Risultato dell'ultima sincronizzazione",
  'backend.sync.synced-trades':
    'Sincronizzate {trades} operazioni ({files} nuovi file)',
  'backend.sync.no-new-trades': 'Nessuna nuova operazione da sincronizzare',
  'backend.sync.status': 'Stato della sincronizzazione',
  'backend.sync.last-sync': 'Ultima sincronizzazione',
  'backend.sync.total-syncs': 'Sincronizzazioni totali',
  'backend.sync.never': 'Mai',
  'backend.sync.invalid-date': 'Data non valida',
  'backend.notice.vault-registered':
    '✅ Vault registrato sul server di trading',
  'backend.notice.sync-cancelled': '⏹️ Sincronizzazione annullata',
  'backend.notice.sync-in-progress': '⚠️ Sincronizzazione già in corso',
  'backend.notice.account-info-failed':
    '❌ Impossibile ottenere le informazioni del conto',
  'backend.notice.sync-batch-progress':
    '⏳ Sincronizzazione batch: {count} operazioni ({progress}% completato, {remaining} rimanenti)',
  'backend.notice.all-trades-synced':
    '✅ Tutte le {count} operazioni sono già sincronizzate',
  'backend.notice.account-created': '📊 Conto creato: {name}',
  'backend.notice.batch-complete':
    '⏳ Batch completato: {processed}/{total} operazioni ({progress}%). In corso...',
  'backend.notice.sync-complete':
    '✅ Sincronizzazione completata: {total} operazioni elaborate ({newFiles} nuove, {updated} aggiornate) su {accounts} conti',
  'backend.notice.sync-complete-no-trades':
    '✅ Sincronizzazione completata - nessuna nuova operazione trovata',
  'backend.notice.sync-failed': '❌ Sincronizzazione non riuscita: {error}',

  'backend.accounts.linked': 'Conti MT collegati',
  'backend.accounts.linked-desc':
    'Conti MetaTrader rilevati dai report sincronizzati',
  'backend.accounts.server-disconnected':
    'Il server è disconnesso. Controlla lo stato della connessione.',
  'backend.accounts.loading': 'Caricamento dei conti...',
  'backend.accounts.no-accounts': 'Nessun conto trovato.',
  'backend.accounts.sync-to-detect':
    'Sincronizza alcune operazioni per rilevare i conti.',
  'backend.accounts.connect-to-see':
    'Connettiti al server e sincronizza le operazioni per vedere i conti.',
  'backend.accounts.account-id': 'ID conto',
  'backend.accounts.broker': 'Broker',
  'backend.accounts.first-seen': 'Visto per la prima volta',
  'backend.accounts.last-seen': "Visto l'ultima volta",
  'backend.accounts.refresh': 'Aggiorna conti',
  'backend.accounts.unlink-title': 'Scollega conto MetaTrader',
  'backend.accounts.unlink': 'Scollega',
  'backend.accounts.unlink-confirm':
    'Scollegare il conto MetaTrader {accountId}? Verrà nascosto da Trade Sync e le importazioni future verranno saltate finché non lo ricolleghi.',
  'backend.accounts.unlink-success': 'Conto MetaTrader scollegato',
  'backend.accounts.relink': 'Ricollega',
  'backend.accounts.relink-success': 'Conto MetaTrader ricollegato',
  'backend.accounts.ignored.title': 'Conti scollegati',
  'backend.accounts.ignored.count': '{count} nascosti',
  'backend.accounts.ignored.empty': 'Nessun conto scollegato.',
  'backend.accounts.ignored-at': 'Scollegato',

  'backend.cards.connection.title': 'Connessione',
  'backend.cards.connection.refresh': 'Aggiorna',
  'backend.cards.sync.title': 'Stato della sincronizzazione',
  'backend.cards.sync.last-sync': 'Ultima sincronizzazione',
  'backend.cards.sync.total': 'Sincronizzazioni totali',
  'backend.cards.sync.button': 'Sincronizza ora',
  'backend.cards.sync.cancel': 'Annulla sincronizzazione',
  'backend.cards.accounts.title': 'Conti',
  'backend.cards.accounts.linked': 'Conti collegati',
  'backend.cards.accounts.manage': 'Gestisci',
  'backend.section.setup.title': 'Configurazione',
  'backend.section.sync.title': 'Impostazioni di sincronizzazione',
  'backend.section.accounts.title': 'Gestione conti',
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'Mappatura CSV con IA',
  'settings.auth.feature.trade-sync': 'Sincronizzazione operazioni',
  'settings.auth.feature.economic-calendar': 'Calendario economico',
  'settings.auth.feature.basic-tracking': 'Tracciamento base delle operazioni',

  'settings.auth.feature.manual-entry': 'Inserimento manuale delle operazioni',
  'settings.auth.feature.analytics-reviews': 'Analisi e revisioni',
  'settings.auth.feature.priority-support': 'Supporto prioritario',
  'backend.sync.just-now': 'Proprio ora',
  'backend.sync.minutes-ago': '{count} min fa',
  'backend.sync.hours-ago': '{count} h fa',
  'backend.sync.days-ago': '{count} giorni fa',

  'csv.format': 'Formato di importazione: ',

  'csv.button.export-template': 'Esporta modello',
  'csv.button.delete-template': 'Elimina modello',

  'csv.button.import-another': 'Importa un altro file',
  'csv.results.complete': 'Importazione completata',
  'csv.results.history-ready': 'La tua cronologia di trading è pronta',
  'csv.results.completed-with-issues': 'Importazione completata con problemi',
  'csv.results.failed': 'Importazione non riuscita',
  'csv.results.success.one':
    'Importata con successo {count} operazione nel conto: {account}',
  'csv.results.success.few':
    'Importate con successo {count} operazioni nel conto: {account}',
  'csv.results.success.many':
    'Importate con successo {count} operazioni nel conto: {account}',
  'csv.results.success.other':
    'Importate con successo {count} operazioni nel conto: {account}',
  'csv.results.updated.one': 'Aggiornata {count} operazione esistente',
  'csv.results.updated.few': 'Aggiornate {count} operazioni esistenti',
  'csv.results.updated.many': 'Aggiornate {count} operazioni esistenti',
  'csv.results.updated.other': 'Aggiornate {count} operazioni esistenti',
  'csv.results.skipped.one':
    'Saltata {count} operazione duplicata (già nel vault)',
  'csv.results.skipped.few':
    'Saltate {count} operazioni duplicate (già nel vault)',
  'csv.results.skipped.many':
    'Saltate {count} operazioni duplicate (già nel vault)',
  'csv.results.skipped.other':
    'Saltate {count} operazioni duplicate (già nel vault)',

  'csv.results.broker': 'Broker: {broker}',

  'csv.results.more-trades.one': "e un'altra {count} operazione...",
  'csv.results.more-trades.few': 'e altre {count} operazioni...',
  'csv.results.more-trades.many': 'e altre {count} operazioni...',
  'csv.results.more-trades.other': 'e altre {count} operazioni...',
  'csv.results.errors-header': 'FAI CLIC PER VEDERE GLI ERRORI ({count})',
  'csv.results.discord-note':
    'Facoltativo: se ti serve aiuto, fai clic su Copia report e incollalo su Discord.',

  'csv.errors.copy-report': 'Copia report',

  'csv.errors.copied': 'Copiato',
  'csv.errors.rows': 'Righe: {rows}',
  'csv.errors.suggestion': 'Suggerimento: ',

  'csv.errors.raw-errors-limit': 'Primi {shown} errori su {total}',

  'csv.report.plugin-version': 'Versione plugin: {version}',

  'csv.report.broker': 'Broker: {broker}',

  'csv.report.top-issues': 'Problemi principali:',

  'csv.broker-guide.tradovate.step-2':
    'Fai clic sulla scheda "Orders" (NON sulla scheda Performance)',

  'csv.broker-guide.tradovate.warning.emphasis': 'Importante:',
  'csv.broker-guide.tradovate.warning.message':
    'Usa solo la scheda Orders. La scheda Performance non è compatibile.',

  'csv.broker-guide.ibkr.warning.emphasis': 'Devi usare Orders',

  'csv.broker-guide.tradingview.step-3':
    'Seleziona "Order History" dal menu a tendina',

  'csv.broker-guide.tradingview.warning.message':
    "Altri tipi di esportazione (come Positions o Orders) non funzionano per l'importazione.",

  'csv.broker-guide.hyperliquid.warning.emphasis': 'Limite di 10.000 voci.',

  'csv.broker-guide.sierrachart.step-1':
    'Apri Trade Activity Log (Trade → Trade Activity Log, oppure Ctrl+Shift+A)',

  'csv.broker-guide.atas.warning.emphasis': 'Importante:',
  'csv.broker-guide.atas.warning.message':
    'Non modificare il file esportato. Journalit conserva le operazioni dal foglio “Journal” e, quando disponibile, arricchisce le commissioni usando i fill corrispondenti dal foglio “Executions”.',

  'csv.broker-guide.rithmic.warning.emphasis': 'Importante:',

  'csv.broker-guide.jdr.warning.emphasis': 'Importante:',

  'csv.date-format.auto-detect':
    'Rilevamento automatico (consigliato per formati ISO/standard)',
  'csv.date-format.us-date': 'Data USA: 12/25/2024 (Schwab, Fidelity, E*TRADE)',
  'csv.date-format.us-datetime': 'Data e ora USA: 12/25/2024 14:30:00 (Webull)',
  'csv.date-format.us-short': 'Data USA breve: 1/5/2024 (TradeZero)',
  'csv.date-format.us-short-datetime':
    'Data e ora USA breve: 1/5/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'Data e ora ISO: 2024-12-25 14:30:00 (Bybit, Tradovate)',
  'csv.date-format.iso-date': 'Data ISO: 2024-12-25 (Interactive Brokers)',
  'csv.date-format.eu-date': 'Data UE: 25/12/2024 (giorno/mese/anno)',
  'csv.date-format.eu-datetime': 'Data e ora UE: 25/12/2024 14:30:00',
  'csv.date-format.eu-dash': 'Data UE con trattino: 25-12-2024',
  'csv.date-format.eu-dash-datetime':
    'Data e ora UE con trattino: 25-12-2024 14:30:00',
  'upgrade.title': 'Passa a Pro',
  'upgrade.feature-message':
    '{featureName} è una funzionalità Pro. Passa a Pro per sbloccare automazione e funzionalità avanzate.',
  'upgrade.benefits-title': 'Le funzionalità Pro includono:',
  'upgrade.benefit.csv':
    'Importazione CSV con mappatura colonne assistita da IA',
  'upgrade.benefit.economic-calendar':
    'Calendario economico con importazione automatica degli eventi settimanali',
  'upgrade.benefit.trade-sync': 'Trade Sync per i broker supportati',
  'upgrade.benefit.multi-account': 'Supporto multi-conto',
  'upgrade.prop-profiles.message-firms':
    'Journalit tiene pronte le regole di {count} prop firm per precompilare la tua challenge.',
  'upgrade.prop-profiles.message-firm':
    'Journalit ha pronte le regole di ogni challenge {firm} per la precompilazione.',
  'upgrade.prop-profiles.message':
    'Journalit tiene pronte le regole delle prop firm da inserire nella tua challenge.',
  'upgrade.prop-profiles.message-updates':
    'Collega la tua challenge alle regole pubblicate della sua firm e Journalit ti avvisa quando la firm le cambia.',
  'upgrade.prop-profiles.message-updates-firm':
    'Collega la tua challenge alle regole pubblicate di {firm} e Journalit ti avvisa quando {firm} le cambia.',
  'upgrade.prop-profiles.benefits-title': 'Cosa compila Pro per te:',
  'upgrade.benefit.prop.rules':
    'Limiti di drawdown e perdita giornaliera, presi dalle regole della tua firm',
  'upgrade.benefit.prop.payout': 'Soglie di payout e condizioni di idoneità',
  'upgrade.benefit.prop.phases':
    'Obiettivi di fase e progressione della challenge scelta',
  'upgrade.benefit.prop.updates':
    'Aggiornamenti delle regole quando la firm le cambia',
  'upgrade.trial-notice':
    'Ottieni 2 settimane di prova gratuita per importare tutte le tue operazioni storiche e provare tutte le funzionalità Pro senza rischi.',

  'monthly.overview.drawdown': 'Drawdown mensile',
  'monthly.overview.no-drawdown-data': 'Nessun dato di drawdown da mostrare',

  'settings.account-linking.title': 'Cambia il collegamento del conto',
  'settings.account-linking.description':
    'Sposta tutte le operazioni da un conto MT a un altro conto Obsidian',
  'settings.account-linking.source.title': 'Conto MT di origine',
  'settings.account-linking.source.description':
    'Seleziona il conto MT di cui vuoi spostare le operazioni',
  'settings.account-linking.source.placeholder':
    'Seleziona il conto di origine...',
  'settings.account-linking.target.title': 'Conto Obsidian di destinazione',
  'settings.account-linking.target.description':
    'Seleziona il conto Obsidian a cui collegare le operazioni',
  'settings.account-linking.target.placeholder':
    'Seleziona il conto di destinazione...',
  'settings.account-linking.button.processing': 'Elaborazione...',
  'settings.account-linking.button.relink': 'Ricollega il conto',
  'settings.account-linking.warning':
    'Questo aggiornerà tutte le operazioni sincronizzate dal conto di origine per collegarle al conto di destinazione. Questa operazione non può essere annullata.',
  'settings.account-linking.success.relinked':
    'Ricollegate con successo {count} operazioni da {source} a {target}',
  'settings.account-linking.error.select-both':
    'Seleziona sia il conto di origine sia quello di destinazione',
  'settings.account-linking.error.source-not-found':
    'Conto di origine non trovato',
  'settings.account-linking.error.target-not-found':
    'Conto di destinazione non trovato',
  'settings.account-linking.error.already-linked':
    'Questo conto MT è già collegato al conto Obsidian selezionato',
  'settings.account-linking.error.service-manager':
    'Gestore dei servizi non disponibile',
  'settings.account-linking.error.backend-service':
    'Servizio di sincronizzazione non disponibile',
  'settings.account-linking.error.relink-failed':
    'Impossibile ricollegare il conto: {error}',
  'account.type.demo': 'Demo',
  'account.type.evaluation': 'Valutazione',
  'account.type.funded': 'Finanziato',
  'account.type.archived': 'Archiviato',
  'account-page.error.title': 'Errore durante il caricamento del conto',
  'account-page.error.not-found':
    'Impossibile trovare i dati del conto per "{accountName}"',
  'account-page.error.not-found-sub':
    'Verifica se il conto esiste o prova ad aggiornare la pagina.',
  'account-page.guide.empty.intro.title':
    'Questa pagina mostra un conto nel dettaglio',
  'account-page.guide.empty.intro.description':
    'Usa la pagina del conto per gestire un conto, registrare gli eventi e aprire il Registro operazioni filtrato quando vuoi revisionare le operazioni.',
  'account-page.guide.empty.edit-account.title':
    'Modifica conto apre tutte le impostazioni del conto',
  'account-page.guide.empty.edit-account.description':
    'Usa questo pulsante per cambiare nome, tipo, valuta, regole di Drawdown, obiettivo di profitto, costo mensile e altro.',
  'account-page.guide.empty.add-event.title':
    'Aggiungi evento registra depositi e prelievi',
  'account-page.guide.empty.add-event.description':
    'Usa questo pulsante ogni volta che il denaro entra o esce dal conto al di fuori delle operazioni normali.',
  'account-page.guide.empty.transactions.title':
    'Qui tieni traccia di depositi e prelievi',
  'account-page.guide.empty.transactions.description':
    'Questa sezione conserva la cronologia di depositi e prelievi manuali. Se è vuota, usa Aggiungi evento per creare il primo.',
  'account-page.guide.empty.trade-log.title':
    'Apri questo conto nel Registro operazioni',
  'account-page.guide.empty.trade-log.description':
    "Questo pulsante nell'intestazione apre il Registro operazioni con questo conto già selezionato, così la revisione resta nella vista dedicata.",
  'account-page.guide.main.intro.title':
    'Questa pagina è il riepilogo del tuo conto',
  'account-page.guide.main.intro.description':
    'Usa la pagina del conto per capire chiaramente un conto: cronologia del saldo, prestazioni, limiti di rischio e movimenti di cassa.',
  'account-page.guide.main.balance-chart.title':
    'Il grafico del saldo mostra più del solo saldo',
  'account-page.guide.main.balance-chart.description':
    'Questo grafico mostra il conto nel tempo, inclusi depositi e prelievi, più i livelli di Drawdown e di obiettivo di profitto che hai impostato.',
  'account-page.guide.main.metrics.title': 'Prestazioni solo di questo conto',
  'account-page.guide.main.metrics.description':
    'Saldo, P&L, win rate e tutti i costi solo di questo conto. I conti prop mostrano i payout al posto del flusso di cassa netto.',
  'account-page.guide.main.risk.title':
    'Qui il progresso del rischio è tracciato a parte',
  'account-page.guide.main.risk.description':
    'Quanto del limite di drawdown hai usato e quanto sei vicino al tuo obiettivo di profitto.',
  'account-page.guide.main.transactions.title':
    'Depositi e prelievi restano in una sezione dedicata',
  'account-page.guide.main.transactions.description':
    'Depositi e prelievi con il saldo dopo ciascuno, separati dai risultati di trading. I conti prop elencano qui i payout.',
  'account-page.guide.main.actions.title': 'Trade, liquidità e impostazioni',
  'account-page.guide.main.actions.description':
    'Apri i trade di questo conto nel Trade Log, registra un deposito o un prelievo con + oppure modifica il conto e le sue regole.',
  'account-dashboard.title': 'Conti',
  'account-dashboard.copy-badge.base': 'BASE',
  'account-dashboard.copy-badge.copy': 'COPIER',
  'account-dashboard.copy-badge.copied-by': 'Copiato da',
  'account-dashboard.copy-badge.copies-tooltip-masked': 'Copia {account}',
  'account-dashboard.copy-badge.copies-tooltip':
    'Copia {account} a {multiplier}x',
  'account-dashboard.error.init':
    'Servizio dei conti non inizializzato dopo diversi tentativi',
  'account-dashboard.error.loading':
    'Errore durante il caricamento dei conti: {error}',
  'account-dashboard.error.retry':
    'Servizio dei conti non pronto, nuovo tentativo tra {delay}ms (tentativo {attempt}/{max})',
  'account-dashboard.empty.title': 'Nessun conto trovato',
  'account-dashboard.empty.message':
    'Crea un conto per iniziare a tracciare le tue prestazioni di trading',
  'account-dashboard.section.empty': 'Nessun conto {type}',
  'account-dashboard.section.empty-sub': 'Crea un conto per vederlo qui',
  'account-dashboard.button.create-first': 'Crea il tuo primo conto',
  'account-dashboard.action.create': 'Crea nuovo conto',
  'account-dashboard.action.settings': 'Impostazioni conti',
  'account-dashboard.weight-bar.aria': 'Distribuzione AUM per tipo di conto',
  'account-dashboard.weight-bar.segment-aria':
    "{name}: {percent}% dell'AUM totale",
  'account-dashboard.guide.empty.intro.title':
    'Questa pagina raccoglie tutti i tuoi conti in un unico posto',
  'account-dashboard.guide.empty.intro.description':
    'Usa Conti per vedere tutti i tuoi conti insieme. Quando esistono dei conti, questa pagina è il modo più veloce per confrontarli.',
  'account-dashboard.guide.empty.state.title':
    "Qui non c'è ancora niente perché non esistono conti",
  'account-dashboard.guide.empty.state.description':
    'La dashboard resta vuota finché non crei il primo conto. Poi mostrerà i totali, le sezioni e le scorciatoie verso ogni pagina del conto.',
  'account-dashboard.guide.empty.create.title': 'Crea qui il tuo primo conto',
  'account-dashboard.guide.empty.create.description':
    'Fai clic su questo pulsante per creare il primo conto che vuoi tracciare con Journalit.',
  'account-dashboard.guide.empty.after-create.title':
    'Dopo il salvataggio, Journalit apre la pagina del conto',
  'account-dashboard.guide.empty.after-create.description':
    'Compila i dettagli di base del conto e salva. La guida successiva riprende sulla pagina del conto per quel conto specifico.',
  'account-dashboard.guide.main.intro.title': 'Questi sono i tuoi conti',
  'account-dashboard.guide.main.intro.description':
    'Usa questa pagina per confrontare i conti, vedere i totali su tutti i conti e aprire un singolo conto quando ti serve più dettaglio.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM significa patrimonio gestito',
  'account-dashboard.guide.main.aum-chart.description':
    'Questo grafico traccia il valore combinato dei tuoi conti nel tempo, inclusi depositi, prelievi, obiettivi di profitto e livelli di Drawdown.',
  'account-dashboard.guide.main.metrics.title':
    'Queste metriche riassumono tutti i conti visibili',
  'account-dashboard.guide.main.metrics.description':
    'Usa queste statistiche per uno sguardo rapido a livello di conti prima di approfondire tipi o conti specifici.',
  'account-dashboard.guide.main.mode-switch.title':
    'Panoramica e Sfide sono due viste degli stessi conti',
  'account-dashboard.guide.main.mode-switch.description':
    'La panoramica mantiene il grafico AUM e i totali del portafoglio. Passa a Sfide per l’economia delle tue sfide prop: tasso di superamento, costi, pagamenti e colli di bottiglia per fase su tutti i conti sfida.',
  'account-dashboard.guide.main.create-account.title':
    'Da qui puoi creare un altro conto in qualsiasi momento',
  'account-dashboard.guide.main.create-account.description':
    'Usa questo pulsante quando vuoi aggiungere un nuovo conto alla dashboard.',
  'account-dashboard.guide.main.settings-types.title':
    'Le impostazioni gestiscono i tipi di conto disponibili',
  'account-dashboard.guide.main.settings-types.description':
    'Nelle impostazioni puoi aggiungere tipi di conto personalizzati e rimuovere quelli vecchi se il tuo flusso di lavoro cambia.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Le impostazioni possono cambiare cosa conta nei totali',
  'account-dashboard.guide.main.settings-inclusion.description':
    'Puoi nascondere i tipi di conto dai totali della dashboard senza eliminarli, e decidere separatamente se i loro prelievi devono comunque contare.',
  'account-dashboard.guide.main.settings-order.title':
    "Questa sezione controlla l'ordine dei gruppi di conti",
  'account-dashboard.guide.main.settings-order.description':
    'Usa questi controlli per decidere quali tipi di conto appaiono per primi sulla dashboard.',

  'account-dashboard.guide.main.open-account.title':
    'Apri qualsiasi scheda conto per approfondire',
  'account-dashboard.guide.main.open-account.description':
    'I conti sono raggruppati per tipo così puoi confrontare quelli simili. Apri una scheda per il dettaglio completo; lì subentra la guida della pagina conto.',
  'account-dashboard.metrics.total-accounts': 'Conti totali',
  'account-dashboard.metrics.total-aum': 'AUM totale',
  'account-dashboard.metrics.total-growth': 'Crescita totale',
  'account-dashboard.metrics.growth-percent': 'Crescita %',
  'account-dashboard.metrics.total-withdrawals': 'Prelievi totali',
  'account-dashboard.metrics.no-withdrawals': 'Nessun prelievo',
  'account-dashboard.metrics.total-trades': 'Operazioni totali',
  'account-dashboard.type-header.excluded': 'Escluso',
  'account-dashboard.type-header.from-stats': 'Dalle statistiche',
  'account-dashboard.type-header.of-total-aum': "dell'AUM totale",
  'account-dashboard.type-header.aum': 'AUM',
  'account-dashboard.type-header.withdrawals': 'Prelievi',
  'account-dashboard.type-header.account': 'Conto',
  'account-dashboard.type-header.accounts': 'Conti',
  'account-dashboard.type-header.trade': 'Operazione',
  'account-dashboard.type-header.trades': 'Operazioni',
  'account-dashboard.type-header.growth': 'Crescita ({percent})',
  'account-card.metric.trades': 'Operazioni',
  'account-card.metric.withdrawals': 'Prelievi',
  'account-card.metric.age': 'Età',
  'account-card.progress.profit-target': 'Obiettivo di profitto',
  'account-card.progress.drawdown-used': 'Limite di Drawdown utilizzato',
  'account-card.progress.not-set': 'Non impostato',
  'account-card.footer.monthly': 'Mensile:',
  'account-card.footer.total-costs': 'Costi totali:',
  'account.chart.event.added': 'Conto aggiunto',
  'account.chart.event.archived': 'Conto archiviato',
  'account.balance-chart.drawdown-floor-off-scale':
    'Soglia di drawdown {value} ({distance} sotto)',
  'account.balance-chart.profit-target-off-scale':
    'Obiettivo di profitto {value} ({distance} sopra)',
  'account.balance-chart.empty': 'Nessuna operazione trovata',
  'account.balance-chart.empty-sub':
    'Nessuna attività di trading disponibile per questo conto',
  'account.aum-chart.empty': 'Nessun dato conto',
  'account.aum-chart.empty-sub': 'Aggiungi conti per vedere la cronologia AUM',
  'chart.shared.empty': 'Nessuna operazione disponibile',
  'chart.shared.empty-sub': 'Prova a selezionare un periodo diverso',
  'account.link-modal.title': 'Nuovo conto di trading rilevato',
  'account.link-modal.account-id': 'ID conto:',
  'account.link-modal.broker': 'Broker:',
  'account.link-modal.first-seen': 'Visto per la prima volta:',
  'account.link-modal.question': 'Come vuoi gestire questo conto?',
  'account.link-modal.option.new':
    'Crea un nuovo conto con un nome personalizzato',
  'account.link-modal.placeholder.custom-name': 'es. FTMO Challenge',
  'account.link-modal.account-type': 'Tipo di conto:',
  'account.link-modal.option.existing': 'Collega a un conto esistente',
  'account.link-modal.no-accounts-available': '(nessun conto disponibile)',
  'account.link-modal.select-account': 'Seleziona un conto...',

  'account.link-modal.option.default': 'Usa il nome predefinito: Conto-{id}',
  'account.link-modal.default-name': 'Conto-{id}',
  'account.link-modal.button.linking': 'Collegamento...',
  'account.link-modal.notice.select-existing': 'Seleziona un conto esistente',
  'account.link-modal.notice.failed': 'Impossibile collegare il conto: {error}',
  'trade.review.title': 'Revisione operazione',

  'trade.details.entry': 'Ingresso',
  'trade.details.exit': 'Uscita',

  'trade.details.duration': 'Durata',

  'trade.details.thesis': 'Tesi',

  'trade.details.entries-summary': '{count} ingressi',
  'trade.details.exits-summary': '{count} uscite',
  'trade.details.take-profit-count': '{count} obiettivi',

  'trade.metadata.account': 'Conto:',

  'trade.metadata.setups': 'Setup',
  'trade.metadata.mistakes': 'Errori',
  'trade.image.no-images': 'Nessuna immagine per questa operazione',
  'trade.image.click-edit': 'Aggiungi immagine',
  'trade.image.alt-prefix': "Immagine dell'operazione",
  'command.share-note-as-image': 'Condividi la nota corrente come immagine',
  'trade.share.copy-screenshot': 'Copia screenshot del trade',
  'trade.share.copied': 'Screenshot del trade copiato negli appunti',
  'trade.share.failed': 'Impossibile copiare lo screenshot del trade',
  'trade.share.not-ready':
    'La nota del trade è ancora in caricamento. Riprova tra un momento.',
  'share.review.action': 'Condividi scheda revisione',
  'share.review.modal-title': 'Condividi revisione',
  'share.review.section.top': 'Inizio della nota',
  'share.review.select-all': 'Seleziona tutto',
  'share.review.clear': 'Cancella',
  'share.review.legend.widget': 'Widget',
  'share.review.legend.heading': 'Intestazione e testo',
  'share.review.legend.media': 'Media',
  'share.review.legend.text': 'Testo',
  'share.review.copy': 'Copia immagine',
  'settings.general.hide-dollar-amounts-in-shares':
    'Nascondi gli importi in dollari nelle immagini condivise',
  'settings.general.hide-dollar-amounts-in-shares-desc':
    'Con i multipli R attivi, gli screenshot dei trade e le schede di revisione omettono rischio, commissioni, costi e MAE/MFE in dollari.',
  'share.review.hide-dollar-amounts': 'Nascondi importi in dollari',
  'share.review.hide-dollar-amounts-hint':
    'Omette rischio, commissioni e altri valori in dollari.',
  'share.review.hide-dollar-amounts-needs-r':
    'Attiva i multipli R nelle impostazioni per condividere senza importi in dollari.',
  'share.review.copied': 'Scheda copiata negli appunti',
  'share.review.failed': 'Impossibile copiare la scheda',

  'trade.review.reviewed': 'Revisionata',
  'trade.review.reviewed-on': 'Revisionata il {date}',

  'timeline.status.loss': 'Perdita',

  'timeline.aria.session-navigation':
    'Navigazione delle operazioni dello stesso giorno',
  'timeline.aria.previous-trade': 'Operazione precedente: {trade}',
  'timeline.aria.next-trade': 'Operazione successiva: {trade}',
  'timeline.aria.no-previous-trade':
    'Nessuna operazione precedente in questo giorno di trading',
  'timeline.aria.no-next-trade':
    'Nessuna operazione successiva in questo giorno di trading',

  'drc.tab.review': 'Revisione',

  'drc.missed-trades.label.reason': 'Motivo:',

  'missed-trade.reason-title': 'Perché ho perso questa operazione',

  'settings.general.title': 'Impostazioni generali',
  'settings.general.docs': 'Documentazione',
  'settings.general.discord': 'Discord',
  'settings.general.github': 'GitHub',
  'settings.general.currency': 'Valuta',
  'settings.general.currency-desc':
    'Scegli la valuta da mostrare per tutti i valori monetari nel plugin',
  'settings.general.currency-aria': 'Seleziona la valuta per i valori monetari',
  'settings.general.currency-changed':
    'Valuta cambiata in {currency}. Tutti i componenti si aggiorneranno subito!',
  'settings.general.currency-save-failed':
    "Impossibile salvare l'impostazione della valuta. Riprova.",
  'settings.general.path-change.title':
    'Posizione della cartella del diario cambiata',
  'settings.general.path-change.new-trades-title':
    'Le nuove operazioni verranno create nella nuova posizione della cartella',
  'settings.general.path-change.new-trades-desc':
    'Tutti i diari di trading futuri useranno:',
  'settings.general.path-change.manual-title': 'Azione manuale richiesta:',
  'settings.general.path-change.manual-desc':
    'Hai già delle operazioni nella cartella attuale. Per spostarle:',
  'settings.general.path-change.step.open-explorer':
    "Apri l'esplora file del vault",
  'settings.general.path-change.step.find-folder-prefix': 'Trova la tua',
  'settings.general.path-change.step.find-folder-suffix': 'cartella',
  'settings.general.path-change.step.drag-drop':
    'Trascinala nella nuova posizione quando ti è comodo',
  'settings.general.path-change.manual-note':
    'Così hai il pieno controllo su quando e come spostare i file.',
  'settings.general.path-change.sync-title':
    'Aggiornamento delle mappature di sincronizzazione:',
  'settings.general.path-change.sync-desc':
    'Il plugin aggiornerà automaticamente le mappature di sincronizzazione delle operazioni in base al nuovo percorso della cartella. Così le operazioni sincronizzate restano collegate ai record del backend.',
  'settings.general.path-change.button.cancel': 'Annulla',
  'settings.general.path-change.button.confirm': 'Ho capito',
  'settings.general.display-name': 'Nome visualizzato',
  'settings.general.display-name-desc':
    'Nome facoltativo da mostrare nel messaggio di benvenuto della vista Journalit (es. "Buongiorno, Alex")',
  'settings.general.display-name-placeholder':
    'Aggiungi un nuovo nome visualizzato...',
  'settings.general.display-name-aria':
    'Nome visualizzato per il messaggio di benvenuto',
  'settings.general.display-name-confirm-aria':
    'Conferma la modifica del nome visualizzato',
  'settings.general.display-name-cancel-aria':
    'Annulla la modifica del nome visualizzato',
  'settings.general.display-name-saved':
    'Nome visualizzato salvato come "{name}"',
  'settings.general.display-name-cleared': 'Nome visualizzato rimosso',
  'settings.general.display-name-save-failed':
    'Impossibile salvare il nome visualizzato. Riprova.',
  'settings.general.privacy-mode': 'Modalità privacy',
  'settings.general.privacy-mode-desc':
    "Maschera i valori sensibili di trading, conto, prezzo e prestazioni nell'interfaccia, senza modificare i dati salvati.",
  'settings.general.privacy-mode-aria':
    'Attiva o disattiva la modalità privacy',
  'settings.general.appearance': 'Aspetto',
  'settings.general.accent-color': 'Colore di accento',
  'settings.general.accent-color-desc':
    "Colore per pulsanti, interruttori ed evidenziazioni di Journalit. L'accento Journalit viene usato solo finché Obsidian usa l'accento predefinito; un accento scelto nelle impostazioni Aspetto di Obsidian o un tema ha sempre la precedenza.",
  'settings.general.accent-color-journalit': 'Accento Journalit (predefinito)',
  'settings.general.accent-color-obsidian': "Segui l'accento di Obsidian",
  'settings.general.home-view-settings': 'Impostazioni della vista Home',
  'settings.general.home-auto-open': 'Apertura automatica della vista Home',
  'settings.general.home-auto-open-desc':
    'Scegli quando aprire automaticamente la vista Home',
  'settings.general.home-auto-open-always':
    'Apri sempre e metti a fuoco (predefinito)',
  'settings.general.home-auto-open-ifnone': "Solo se non c'è un file attivo",
  'settings.general.home-auto-open-never': 'Mai (solo manuale)',
  'settings.general.home-auto-open-aria':
    "Seleziona il comportamento all'avvio della Home",
  'settings.general.home-startup-changed':
    "Comportamento all'avvio di Journalit cambiato in: {behavior}",
  'settings.general.filter-recent':
    'Filtra gli elementi recenti ai file Journalit',
  'settings.general.filter-recent-desc':
    "Mostra solo i file di Journalit nel widget Elementi recenti (file nella cartella .journalit). Nasconde tutti gli altri file del vault dall'elenco degli elementi recenti.",
  'settings.general.filter-recent-aria':
    'Filtra gli elementi recenti ai file Journalit',
  'settings.general.filter-recent-toggled':
    'Filtro degli elementi recenti ai file Journalit {status}',
  'settings.general.home-widget-opacity': 'Opacità dei widget',
  'settings.general.home-widget-opacity-desc':
    'Sfondi dei widget con immagine: 0% è trasparente, 100% è opaco. Si applica al tema attuale; i valori dei temi chiaro e scuro vengono salvati separatamente.',
  'settings.general.home-widget-opacity-save-failed':
    'Impossibile salvare l’opacità dei widget. Riprova.',
  'settings.general.home-background': 'Immagine di sfondo della Home',
  'settings.general.home-background-desc':
    'Mostrata dietro i widget della Home.',
  'settings.general.home-background-dashboard':
    'Mostra lo sfondo nella Dashboard',
  'settings.general.home-background-dashboard-desc':
    'Usa la stessa immagine di sfondo nella modalità Dashboard.',
  'settings.general.home-background-dashboard-aria':
    'Mostra lo sfondo della Home nella Dashboard',

  'settings.general.home-background-choose': 'Scegli immagine',
  'settings.general.home-background-clear': 'Svuota',

  'settings.general.home-background-invalid-file':
    'Scegli un file immagine supportato.',
  'settings.general.home-background-saved':
    'Immagine di sfondo della Home salvata.',
  'settings.general.home-background-cleared':
    'Immagine di sfondo della Home rimossa.',
  'settings.general.home-background-save-failed':
    "Impossibile salvare l'immagine di sfondo della Home.",
  'settings.general.folder-section':
    'Posizione della cartella e percorsi delle immagini',
  'settings.general.journal-folder': 'Posizione della cartella del diario',
  'settings.general.journal-folder-desc':
    'Scegli dove salvare i diari di trading nel vault.',
  'settings.general.journal-folder-desc-2':
    'Lascia vuoto per usare la cartella principale predefinita.',
  'settings.general.journal-folder-placeholder':
    'Seleziona una cartella personalizzata...',
  'settings.general.journal-folder-default':
    'Predefinito: cartella principale (!Journalit)',
  'settings.general.update-image-paths': 'Aggiorna i percorsi delle immagini',
  'settings.general.update-image-paths-desc':
    'Aggiorna i percorsi delle immagini in tutte le operazioni in base alla posizione attuale della cartella. Usalo dopo aver spostato manualmente la cartella !Journalit.',
  'settings.general.update-image-paths-updating': 'Aggiornamento...',
  'settings.general.update-image-paths-match':
    'Tutti i percorsi delle immagini corrispondono già alla posizione attuale della cartella',
  'settings.general.folder-updated':
    'Percorso della cartella del diario aggiornato. Le nuove operazioni verranno create in: {path}',
  'settings.general.folder-update-failed':
    'Impossibile aggiornare il percorso: {error}',
  'settings.general.update-image-paths-success':
    'Percorsi delle immagini aggiornati in {count} operazioni',
  'settings.general.update-image-paths-no-update':
    'Nessun percorso delle immagini da aggiornare',
  'settings.general.update-image-paths-errors':
    'Aggiornate {updated} operazioni con {failed} errori. Controlla la console per i dettagli.',
  'settings.general.update-image-paths-failed':
    'Impossibile aggiornare i percorsi delle immagini. Controlla la console per i dettagli.',
  'settings.general.trade-settings': 'Impostazioni delle operazioni',
  'settings.general.auto-open-trades':
    'Apri automaticamente le operazioni create',
  'settings.general.auto-open-trades-desc':
    'Apri automaticamente le note operazione in una nuova scheda dopo la creazione',
  'settings.general.auto-open-trades-aria':
    'Apri automaticamente le operazioni create',
  'settings.general.auto-open-toggled':
    'Apertura automatica delle operazioni create {status}',
  'settings.general.date-format': 'Formato data',
  'settings.general.date-format-desc':
    'Formato per mostrare le date in tutto il plugin',
  'settings.general.date-format-aria':
    'Seleziona il formato data delle note operazione',
  'settings.general.date-format-ddmmyy': 'DD/MM/YY (31/12/23)',
  'settings.general.date-format-mmddyy': 'MM/DD/YY (12/31/23)',
  'settings.general.date-format-yymmdd': 'YY/MM/DD (23/12/31)',
  'settings.general.date-format-changed':
    'Formato data delle note operazione cambiato in {format}',
  'settings.general.use-24-hour-time': 'Usa il formato 24 ore',
  'settings.general.use-24-hour-time-desc':
    'Mostra gli orari in formato 24 ore (14:30) invece che in formato 12 ore AM/PM (2:30 PM)',
  'settings.general.use-24-hour-time-aria': 'Usa il formato 24 ore',
  'settings.general.show-seconds':
    'Mostra i secondi negli orari delle operazioni',
  'settings.general.show-seconds-desc':
    'Mostra i secondi quando inserisci gli orari di ingresso e uscita delle operazioni.',
  'settings.general.show-seconds-aria':
    'Mostra i secondi negli orari delle operazioni',
  'settings.general.skip-weekends': 'Escludi i weekend',
  'settings.general.skip-weekends-desc':
    'Se attivo, Journalit tratta i weekend come giorni non di trading in tutto il plugin. Disattivalo se operi o fai revisioni il sabato e la domenica.',
  'settings.general.skip-weekends-aria': 'Escludi i weekend in tutto Journalit',
  'settings.general.skip-weekends-toggled': 'Esclusione del weekend {status}',
  'settings.general.week-start': 'Giorno di inizio settimana',
  'settings.general.week-start-desc':
    'Scegli il giorno in cui inizia la tua settimana di trading. Influisce sulle revisioni settimanali e sui report.',
  'settings.general.week-start-aria': 'Seleziona il giorno di inizio settimana',
  'settings.general.week-start-changed':
    'Giorno di inizio settimana cambiato in {day}',
  'settings.general.analytics-date-basis': 'Base data delle analisi',
  'settings.general.analytics-date-basis-desc':
    "Ideale per gli swing trader. Usa la data di ingresso o l'ultima data di uscita per le analisi. La modalità data di uscita conta solo le operazioni chiuse e richiede una data di uscita per le operazioni con P&L diretto.",
  'settings.general.analytics-date-basis-aria':
    'Seleziona la base data delle analisi',
  'settings.general.analytics-date-basis-entry': 'Data di ingresso',
  'settings.general.analytics-date-basis-exit': 'Data di uscita',
  'settings.general.analytics-date-basis-changed':
    'Base data delle analisi cambiata in {basis}',
  'settings.general.dollar-value-input':
    'Inserisci la dimensione della posizione come valore in dollari',
  'settings.general.dollar-value-input-desc':
    'Se attivo, inserisci la dimensione della posizione come importo in dollari (es. $10,000) invece che come quantità (azioni/lotti/contratti). La quantità verrà calcolata automaticamente dal prezzo. Funziona meglio sulle azioni; futures/Forex hanno moltiplicatori di contratto che non vengono considerati.',
  'settings.general.dollar-value-input-aria':
    'Inserisci la dimensione della posizione come valore in dollari',
  'settings.general.dollar-value-input-toggled':
    'Input della dimensione della posizione: {mode}',
  'settings.general.dollar-value': 'Valore in dollari',
  'settings.general.quantity': 'Quantità',
  'settings.general.mae-mfe-input-mode': 'Modalità di input MAE/MFE',
  'settings.general.mae-mfe-input-mode-desc':
    "Scegli come inserire i valori MAE/MFE nel modulo dell'operazione.",
  'settings.general.mae-mfe-input-mode-desc-price':
    "Livelli di prezzo: inserisci il prezzo più basso/più alto raggiunto durante l'operazione.",
  'settings.general.mae-mfe-input-mode-desc-dollar':
    'Valori in dollari: inserisci direttamente il Drawdown/profitto massimo in dollari.',
  'settings.general.mae-mfe-input-mode-aria':
    'Seleziona la modalità di input MAE/MFE',
  'settings.general.mae-mfe-input-mode-price': 'Livelli di prezzo',
  'settings.general.mae-mfe-input-mode-dollar': 'Valori in dollari',
  'settings.general.mae-mfe-display-unit': 'Unità di visualizzazione MAE/MFE',
  'settings.general.mae-mfe-display-unit-desc':
    'Mostra MAE/MFE in valuta o in tick futures nelle analisi e nel Registro operazioni. La modalità tick ricalcola automaticamente le operazioni futures idonee già esistenti, senza modificare i dati salvati.',
  'settings.general.mae-mfe-display-unit-aria':
    "Seleziona l'unità di visualizzazione MAE/MFE",
  'settings.general.mae-mfe-display-dollar': 'Valuta',
  'settings.general.mae-mfe-display-ticks': 'Tick',
  'common.ticks': 'tick',
  'dashboard.mae-mfe-ticks.partial-coverage':
    'Solo {eligible} di {total} operazioni hanno dati tick futures. Questa metrica esclude le operazioni non idonee.',
  'settings.general.cutoff-time':
    'Orario di chiusura della giornata di trading',
  'settings.general.cutoff-time-desc':
    "Ora che definisce la fine della giornata di trading. Le operazioni successive a quest'ora verranno raggruppate nel giorno successivo. (formato 24 ore, es. 23:30 per le 11:30 PM)",
  'settings.general.cutoff-time-aria':
    'Orario di chiusura della giornata di trading',
  'settings.general.cutoff-time-changed':
    'Orario di chiusura della giornata di trading cambiato in {time}',
  'settings.general.break-even-threshold-mode': 'Tipo di soglia di break-even',
  'settings.general.break-even-threshold-mode-desc':
    'Scegli se il break-even è determinato da un intervallo di P&L fisso o da una percentuale del saldo attuale di ciascun conto.',
  'settings.general.break-even-mode-fixed': 'Intervallo di importo fisso',
  'settings.general.break-even-mode-percent':
    'Percentuale del saldo attuale del conto',
  'settings.general.break-even-percent': 'Percentuale di break-even',
  'settings.general.break-even-percent-desc':
    'Soglia simmetrica intorno allo zero (±X% del saldo attuale del conto). Le operazioni senza un saldo del conto risolvibile sono escluse dalle statistiche vincite/perdite.',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'Percentuale di break-even del saldo attuale del conto',
  'settings.general.break-even-range': 'Intervallo di break-even',
  'settings.general.break-even-range-desc':
    'Definisci un intervallo di P&L per considerare le operazioni in break-even. Ad esempio, con Min: -20 e Max: 20 le operazioni tra -$20 e +$20 saranno in break-even. Imposta entrambi a 0 per considerare break-even solo $0.00 esatto. Il minimo deve essere minore o uguale al massimo.',
  'settings.general.break-even-min-placeholder': 'Min',
  'settings.general.break-even-max-placeholder': 'Max',
  'settings.general.break-even-min-aria':
    "Minimo dell'intervallo di break-even",
  'settings.general.break-even-max-aria':
    "Massimo dell'intervallo di break-even",
  'settings.general.break-even-to': 'a',
  'settings.general.break-even-warning':
    'Attenzione: il valore minimo è maggiore del valore massimo. Le operazioni non potranno essere classificate come break-even.',
  'settings.general.break-even-updated':
    'Intervallo di break-even aggiornato: le viste si aggiorneranno al prossimo caricamento',
  'settings.general.default-risk': 'Importo di rischio predefinito',
  'settings.general.default-risk-desc':
    "Importo di rischio predefinito (nella valuta del conto) usato per i calcoli degli R-multiple. Lascia vuoto per richiedere l'inserimento manuale per ogni operazione.",
  'settings.general.default-risk-aria': 'Importo di rischio predefinito',
  'settings.general.display-r-multiples': 'Mostra gli R-multiple',
  'settings.general.display-r-multiples-desc':
    'Mostra i valori R-multiple (rapporti rischio/rendimento) al posto degli importi in valuta in tutto il plugin',
  'settings.general.display-r-multiples-aria':
    'Mostra gli R-multiple nelle viste delle operazioni',
  'settings.general.display-r-multiples-toggled':
    'Visualizzazione degli R-multiple {status}',
  'settings.general.include-copy-accounts-analytics':
    'Includi i conti copy nelle analisi di tutti i conti',
  'settings.general.include-copy-accounts-analytics-desc':
    'Se attivo, le analisi di tutti i conti includono i risultati derivati dei conti copy e li contano come operazioni a livello di conto.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Includi i conti copy nelle analisi di tutti i conti',
  'settings.general.include-copy-accounts-toggled':
    'Conti copy nelle analisi di tutti i conti {status}',
  'settings.general.include-unrealized-pnl':
    'Includi il P&L non realizzato nelle analisi',
  'settings.general.include-unrealized-pnl-desc':
    'Se attivo, i totali di P&L netto includono il P&L non realizzato delle posizioni aperte con uno snapshot di prezzo, mostrato separatamente dai risultati realizzati. Le statistiche di esito come il tasso di vincita e le serie restano solo sul realizzato.',
  'settings.general.include-unrealized-pnl-aria':
    'Includi il P&L non realizzato nelle analisi',
  'settings.general.include-unrealized-pnl-toggled':
    'P&L non realizzato nelle analisi {status}',
  'settings.general.notification-settings': 'Impostazioni delle notifiche',
  'settings.general.sync-notifications': 'Notifiche di sincronizzazione',
  'settings.general.sync-notifications-desc':
    'Mostra le notifiche al termine delle sincronizzazioni',
  'settings.general.sync-notifications-aria':
    'Attiva le notifiche di sincronizzazione',
  'settings.general.sync-notifications-toggled':
    'Notifiche di sincronizzazione {status}',
  'settings.general.new-trade-notifications': 'Notifiche di nuove operazioni',
  'settings.general.new-trade-notifications-desc':
    'Mostra le notifiche quando vengono rilevati nuovi file operazione',
  'settings.general.new-trade-notifications-aria':
    'Attiva le notifiche di nuove operazioni',
  'settings.general.new-trade-notifications-toggled':
    'Notifiche di nuove operazioni {status}',
  'settings.general.update-notifications':
    'Mostra le notifiche di aggiornamento',
  'settings.general.update-notifications-desc':
    'Mostra una notifica quando è disponibile un aggiornamento del plugin',
  'settings.general.update-notifications-aria':
    'Mostra le notifiche di aggiornamento',
  'settings.general.update-notifications-toggled':
    'Notifiche di aggiornamento {status}',
  'settings.general.data-management': 'Gestione dati e privacy',
  'settings.general.backup-restore-section':
    'Backup, ripristino e reimpostazione',
  'settings.general.export-settings': 'Esporta impostazioni',
  'settings.general.export-settings-desc':
    'Scarica tutte le impostazioni del plugin come file JSON per il backup o per trasferirle in un altro vault',
  'settings.general.export-settings-exporting': 'Esportazione...',
  'settings.general.import-settings': 'Importa impostazioni',
  'settings.general.import-settings-desc':
    'Ripristina le impostazioni da un file JSON esportato in precedenza. Le impostazioni verranno unite a quelle attuali.',
  'settings.general.import-settings-importing': 'Importazione...',
  'settings.general.reset-to-defaults': 'Ripristina i valori predefiniti',
  'settings.general.reset-to-defaults-desc':
    'Ripristina tutte le impostazioni del plugin ai valori predefiniti. Verrà creato automaticamente un backup.',
  'settings.general.reset-to-defaults-warning':
    'Attenzione: verranno rimosse tutte le opzioni personalizzate, le impostazioni dei conti e i layout.',
  'settings.general.reset-to-defaults-resetting': 'Ripristino...',
  'settings.general.enabled': 'attivato',
  'settings.general.disabled': 'disattivato',
  'settings.customization.title': 'Personalizzazione',
  'settings.customization.description':
    'Personalizza opzioni, aspetto e comportamento del plugin Journalit.',
  'settings.customization.trade-form-layout.description':
    "Scegli quali campi e sezioni compaiono nel modulo dell'operazione.",
  'settings.customization.trade-form-layout.button': 'Personalizza il layout',
  'settings.customization.tickers-symbols': 'Simboli',
  'settings.customization.symbol-mappings': 'Mappature dei simboli',

  'settings.customization.setups': 'Setup',
  'settings.customization.mistakes': 'Errori',
  'settings.customization.tags': 'Tag',
  'settings.customization.events': 'Eventi',

  'settings.customization.options.confirm.update-notes':
    'OK (Aggiorna le note)',
  'settings.customization.options.confirm.save-name': 'Salva solo il nome',
  'settings.customization.options.confirm.cancel': "Annulla l'azione",
  'settings.customization.options.type.tickers': 'Simboli',
  'settings.customization.options.type.accounts': 'Conti',
  'settings.customization.options.type.account-types': 'Tipi di conto',
  'settings.customization.options.type.setups': 'Setup',
  'settings.customization.options.type.mistakes': 'Errori',
  'settings.customization.options.type.tags': 'Tag',
  'settings.customization.options.type.events': 'Eventi',
  'settings.customization.options.asset-type.cfd': 'CFD',
  'settings.customization.options.notice.empty-name':
    "Il nome dell'opzione non può essere vuoto",
  'settings.customization.options.notice.invalid-ticker':
    'Formato del simbolo non valido. Sono ammessi solo lettere, numeri e punti.',
  'settings.customization.options.notice.added':
    'Aggiunta l\'opzione "{newValue}" a {type}',
  'settings.customization.options.notice.duplicate':
    'Opzione duplicata: {newValue} esiste già',
  'settings.customization.options.notice.asset-type-required':
    'Il tipo di strumento è obbligatorio per gli strumenti',
  'settings.customization.options.notice.updated-with-notes':
    'Opzione aggiornata da "{oldValue}" a "{newValue}" e aggiornate {count} note',
  'settings.customization.options.notice.updated':
    'Opzione aggiornata da "{oldValue}" a "{newValue}"',
  'settings.customization.options.confirm.rename-message':
    'Vuoi aggiornare tutte le note esistenti che usano "{oldValue}" in modo che usino "{newValue}"?\n\nVerranno cercate tutte le note e il valore dell\'opzione verrà aggiornato ovunque sia presente.',
  'settings.customization.options.notice.cannot-delete-archived':
    'Impossibile eliminare il tipo di conto "Archiviato": è riservato all\'archiviazione dei conti',
  'settings.customization.options.confirm.remove-message':
    'Sei sicuro di voler rimuovere "{option}"? L\'azione non può essere annullata.',
  'settings.customization.options.confirm.remove-tag-message':
    'Eliminare il tag globale "{option}"? Verrà rimosso da ogni nota operazione e setup di Journalit.',
  'settings.customization.options.notice.removed':
    'Rimossa l\'opzione "{option}"',
  'settings.customization.options.notice.remove-failed':
    "Rimozione dell'opzione non riuscita",
  'settings.customization.options.confirm.reset-message':
    "Sei sicuro di voler ripristinare tutti i {type} alle opzioni predefinite? L'azione non può essere annullata.",
  'settings.customization.options.confirm.reset-tag-message':
    "Ripristinare l'elenco globale dei tag e i colori ai valori predefiniti? I tag già assegnati alle note operazione e setup resteranno in quelle note.",
  'settings.customization.options.notice.reset-success':
    'Ripristinati i {type} alle opzioni predefinite',
  'settings.customization.options.notice.no-options-to-reset':
    'Le opzioni predefinite di {type} sono già in uso',
  'settings.customization.options.notice.mapping-symbols-required':
    'Entrambi i simboli sono obbligatori',
  'settings.customization.options.notice.mapping-added':
    'Mappatura aggiunta: {imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    'Impossibile aggiungere la mappatura',
  'settings.customization.options.notice.mapping-deleted':
    'Mappatura eliminata: {symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    'Impossibile eliminare la mappatura',
  'settings.customization.options.empty-state':
    'Non è stato ancora aggiunto alcun {type} personalizzato.',
  'settings.customization.options.label.save-changes': 'Salva le modifiche',
  'settings.customization.options.label.cancel-editing': 'Annulla la modifica',
  'settings.customization.options.label.edit-option': 'Modifica {option}',
  'settings.customization.options.label.remove-option': 'Rimuovi {option}',
  'settings.customization.options.placeholder.select-asset':
    'Seleziona il tipo di strumento...',
  'settings.customization.options.field.pip-size': 'Dimensione del pip',
  'settings.customization.options.field.priority': 'Priorità:',
  'settings.customization.options.field.default-event-notes':
    "Note predefinite dell'evento:",
  'settings.customization.options.placeholder.default-event-notes':
    'Note da compilare automaticamente quando viene selezionato questo evento',
  'settings.customization.options.aria.confirm-add':
    "Conferma l'aggiunta di {type}",
  'settings.customization.options.label.locked': 'Bloccato',
  'settings.customization.options.label.archived-reserved':
    'Archiviato (riservato)',
  'settings.customization.options.aria.reset-all':
    'Rimuovi tutti i {type} personalizzati',
  'settings.customization.options.button.reset-all':
    'Ripristina tutti i {type}',
  'settings.customization.options.placeholder.new-name':
    'Nome del nuovo {type}',
  'settings.customization.options.placeholder.dollar-per-point': '$/punto',
  'settings.customization.options.placeholder.tick-size': 'Dimensione del tick',
  'settings.customization.options.placeholder.tick-value': 'Valore del tick',
  'settings.customization.options.placeholder.lot-size': 'Dimensione del lotto',
  'settings.customization.options.placeholder.pip-value': 'Valore del pip',
  'settings.customization.options.placeholder.pip-size': 'Dimensione del pip',
  'settings.customization.options.field.optional': '(opzionale)',
  'settings.customization.options.mapping.description':
    'Mappa i simboli specifici del contratto (es. NQZ5) sui simboli base (es. NQ) per il recupero automatico delle specifiche',
  'settings.customization.options.mapping.auto-detected':
    'Rilevato automaticamente',
  'settings.customization.options.mapping.manual': 'Manuale',
  'settings.customization.options.mapping.created-at': 'Creato il {date}',
  'settings.customization.options.mapping.no-mappings':
    'Nessuna mappatura dei simboli. Le mappature vengono create automaticamente durante le importazioni CSV quando vengono rilevati i simboli dei contratti.',
  'settings.customization.options.mapping.placeholder-imported':
    'Simbolo importato (es. NQZ5)',
  'settings.customization.options.mapping.placeholder-base':
    'Simbolo base (es. NQ)',
  'settings.customization.options.mapping.button-add': 'Aggiungi mappatura',
  'settings.customization.options.placeholder.add-new': 'Aggiungi nuovo {type}',
  'settings.customization.options.aria.delete-mapping': 'Elimina mappatura',
  'settings.customization.options.instrument.specs-futures':
    '${dollar}/pt, {tick} tick, ${value} val. tick',
  'settings.customization.options.instrument.specs-forex':
    '{lot} lot, ${pip} val. pip, {size} pip size',
  'settings.customization.options.instrument.built-in': '(integrato)',
  'settings.customization.options.instrument.mapped-to':
    'Mappato su {base} (usa le specifiche di {base})',
  'settings.customization.options.instrument.no-specs':
    '(Nessuna specifica impostata)',
  'settings.customization.options.commission.costs': 'Costi',
  'settings.customization.options.commission.add-rule':
    '+ Aggiungi regola di costo',
  'settings.customization.options.commission.applies-to': 'Si applica a',
  'settings.customization.options.commission.method': 'Metodo',
  'settings.customization.options.commission.entry': 'Ingresso',
  'settings.customization.options.commission.exit': 'Uscita',
  'settings.customization.options.commission.round-trip': 'Andata e ritorno',
  'settings.customization.options.commission.actions': 'Azioni',
  'settings.customization.options.commission.all-accounts': 'Tutti i conti',
  'settings.customization.options.commission.per-side': 'Per lato',
  'settings.customization.options.commission.remove-rule':
    'Rimuovi regola di costo',

  'button.remove': 'Rimuovi',

  'button.move-up': 'Sposta su',
  'button.move-down': 'Sposta giù',

  'settings.customization.trade-fields': "Campi personalizzati dell'operazione",
  'settings.customization.custom-fields.description':
    'Aggiungi campi tuoi a ogni operazione, come sessione, timeframe o qualità del setup. Compaiono nella scheda Avanzate del modulo, vengono salvati nel frontmatter della nota e possono diventare colonne ordinabili e filtrabili nel registro operazioni.',
  'settings.customization.custom-fields.title':
    'Campi personalizzati ({count})',
  'settings.customization.custom-fields.manage-desc':
    'Gestisci i campi personalizzati del modulo operazione',
  'settings.customization.custom-fields.type-dropdown': 'Menu a tendina',
  'settings.customization.custom-fields.type-multiselect': 'Selezione multipla',
  'settings.customization.custom-fields.type-suffix': 'campo',
  'settings.customization.custom-fields.option-count.one': '{count} opzione',
  'settings.customization.custom-fields.option-count.few': '{count} opzioni',
  'settings.customization.custom-fields.option-count.many': '{count} opzioni',
  'settings.customization.custom-fields.option-count.other': '{count} opzioni',
  'settings.customization.custom-fields.no-fields':
    'Nessun campo personalizzato definito',
  'settings.customization.custom-fields.no-fields-desc':
    'Inizia con un campo che rivedrai davvero in seguito, come la sessione in cui hai operato o quanto il setup corrispondeva al tuo piano.',
  'settings.customization.custom-fields.add-new': 'Aggiungi nuovo campo',

  'settings.customization.custom-fields.edit-field-with-name':
    'Modifica “{fieldLabel}”',
  'settings.customization.custom-fields.configure-desc':
    'Configura le impostazioni del campo personalizzato qui sotto',
  'settings.customization.custom-fields.actions': 'Azioni',
  'settings.customization.custom-fields.actions-desc':
    'Gestisci i tuoi campi personalizzati',
  'settings.customization.custom-fields.add-button':
    'Aggiungi campo personalizzato',
  'settings.customization.custom-fields.delete-all-button':
    'Elimina tutti i campi',
  'settings.customization.custom-fields.editor.title':
    'Configurazione del campo',
  'settings.customization.custom-fields.editor.label': 'Etichetta del campo',
  'settings.customization.custom-fields.editor.label-desc':
    'Nome visualizzato di questo campo',
  'settings.customization.custom-fields.editor.label-placeholder':
    "Inserisci l'etichetta del campo",
  'settings.customization.custom-fields.editor.key': 'Chiave frontmatter',
  'settings.customization.custom-fields.editor.key-desc':
    'Questa chiave apparirà nei file delle operazioni: ',
  'settings.customization.custom-fields.editor.key-placeholder': 'field_name',
  'settings.customization.custom-fields.editor.key-reserved':
    '⚠️ Nome campo riservato',
  'settings.customization.custom-fields.editor.type': 'Tipo di campo',
  'settings.customization.custom-fields.editor.type-desc':
    'Tipo di campo di input',
  'settings.customization.custom-fields.editor.placeholder': 'Testo segnaposto',
  'settings.customization.custom-fields.editor.placeholder-desc':
    'Testo segnaposto facoltativo mostrato nel campo vuoto',
  'settings.customization.custom-fields.editor.placeholder-input':
    'Inserisci il testo segnaposto',
  'settings.customization.custom-fields.editor.trade-log':
    'Registro operazioni',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'Controlla come compare questo campo quando viene aggiunto come colonna del Registro operazioni',
  'settings.customization.custom-fields.editor.column-label':
    'Etichetta della colonna del Registro operazioni',
  'settings.customization.custom-fields.editor.column-label-desc':
    "Etichetta più corta facoltativa usata solo nell'intestazione del Registro operazioni",
  'settings.customization.custom-fields.editor.column-label-placeholder':
    "Usa l'etichetta del campo per impostazione predefinita",
  'settings.customization.custom-fields.editor.display-as-currency':
    'Mostra come valuta',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Formatta questo campo numerico come valuta solo nel Registro operazioni',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'Modalità di ordinamento del menu a tendina',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    "Disattivato per impostazione predefinita. Attiva l'ordinamento solo se questo menu a tendina ha un ordine significativo.",
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'Disattivato',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'Alfabetico',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'Numerico',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'Ordine delle opzioni configurato',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'Visualizzazione compressa',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'Scegli come mostrare i valori della selezione multipla quando la modalità espansa del Registro operazioni è disattivata',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'Badge con conteggio',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'Elenco di valori',
  'settings.customization.custom-fields.editor.validation': 'Convalida',
  'settings.customization.custom-fields.editor.validation-desc':
    'Regole di convalida del campo',
  'settings.customization.custom-fields.editor.validation.required':
    'Campo obbligatorio',
  'settings.customization.custom-fields.editor.validation.required-desc':
    'Rendi questo campo obbligatorio',
  'settings.customization.custom-fields.editor.validation.min-length':
    'Lunghezza minima',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    'Numero minimo di caratteri',
  'settings.customization.custom-fields.editor.validation.no-min':
    'Nessun minimo',
  'settings.customization.custom-fields.editor.validation.max-length':
    'Lunghezza massima',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    'Numero massimo di caratteri',
  'settings.customization.custom-fields.editor.validation.no-max':
    'Nessun massimo',
  'settings.customization.custom-fields.editor.validation.min-value':
    'Valore minimo',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    'Numero minimo consentito',
  'settings.customization.custom-fields.editor.validation.max-value':
    'Valore massimo',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    'Numero massimo consentito',
  'settings.customization.custom-fields.editor.options': 'Opzioni',
  'settings.customization.custom-fields.editor.options-desc':
    'Scelte disponibili per questo campo',
  'settings.customization.custom-fields.editor.add-option':
    'Aggiungi nuova opzione',
  'settings.customization.custom-fields.editor.add-option-desc':
    'Inserisci una nuova scelta',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    'Inserisci una nuova opzione',
  'settings.customization.custom-fields.editor.allow-create':
    'Consenti la creazione di nuove opzioni',
  'settings.customization.custom-fields.editor.allow-create-desc':
    'Gli utenti possono creare nuove opzioni quando usano questo campo nei moduli operazione',
  'settings.customization.custom-fields.editor.save': 'Salva campo',
  'settings.customization.custom-fields.editor.delete': 'Elimina campo',
  'settings.customization.custom-fields.type.text': 'Testo',
  'settings.customization.custom-fields.type.number': 'Numero',
  'settings.customization.custom-fields.type.date': 'Data',
  'settings.customization.custom-fields.type.datetime': 'Data e ora',
  'settings.customization.custom-fields.type.time': 'Ora',
  'settings.customization.custom-fields.error.cannot-save':
    'Impossibile salvare il campo: {error}',
  'settings.customization.custom-fields.error.duplicate-key':
    'Esiste già un campo con questa chiave frontmatter',
  'settings.customization.custom-fields.error.save-failed':
    'Impossibile salvare il campo. Riprova.',
  'settings.customization.custom-fields.notice.import-summary':
    'Importati {validCount} campi validi su {totalCount} totali',
  'settings.customization.custom-fields.delete.confirm-message':
    'Sei sicuro di voler eliminare il campo personalizzato "{fieldLabel}"?',
  'settings.customization.custom-fields.delete.cannot-undo':
    'Questa azione non può essere annullata.',
  'settings.customization.custom-fields.reset.confirm-message':
    'Sei sicuro di voler eliminare TUTTI i campi personalizzati?',
  'settings.customization.custom-fields.saved-options.title':
    'Opzioni personalizzate salvate',
  'settings.customization.custom-fields.saved-options.description':
    'Gestisci le opzioni che gli utenti hanno creato per i campi personalizzati',
  'settings.customization.custom-fields.saved-options.delete-error':
    "Impossibile eliminare l'opzione. Riprova.",
  'settings.customization.custom-fields.saved-options.clear-error':
    'Impossibile svuotare le opzioni. Riprova.',
  'settings.customization.custom-fields.option.delete-confirm':
    'Sei sicuro di voler eliminare l\'opzione "{optionName}"?',
  'settings.customization.custom-fields.option.clear-confirm':
    'Sei sicuro di voler eliminare TUTTE le opzioni salvate di "{fieldLabel}"?',
  'settings.customization.review-fields': 'Campi di revisione personalizzati',
  'settings.customization.review-fields.description':
    'Crea campi personalizzati per le note di revisione. Questi campi sono salvati in reviewCustomFields e in seguito possono essere ereditati tra le revisioni mensili, settimanali e giornaliere.',
  'settings.customization.review-fields.title': 'Campi di revisione ({count})',
  'settings.customization.review-fields.manage-desc':
    'Gestisci i campi personalizzati delle note di revisione',
  'settings.customization.review-fields.no-fields':
    'Nessun campo di revisione personalizzato definito',
  'settings.customization.review-fields.no-fields-desc':
    "I campi di revisione saranno usati dai widget delle note di revisione e non compariranno nel modulo dell'operazione né nel Registro operazioni.",
  'settings.customization.review-fields.add-button':
    'Aggiungi campo di revisione',
  'settings.customization.review-fields.delete-all-button':
    'Elimina tutti i campi di revisione',
  'settings.customization.review-fields.add-new':
    'Aggiungi nuovo campo di revisione',
  'settings.customization.review-fields.edit-field-with-name':
    'Modifica “{fieldLabel}”',
  'settings.customization.review-fields.configure-desc':
    'Configura le impostazioni del campo di revisione qui sotto',
  'settings.customization.review-fields.actions-desc':
    'Gestisci i tuoi campi di revisione personalizzati',
  'settings.customization.review-fields.default-label':
    'Nuovo campo di revisione',
  'settings.customization.review-fields.unknown-field':
    'Campo di revisione sconosciuto',
  'settings.customization.review-fields.field-summary':
    'Tipo: {type} • Revisioni: {reviews}',
  'settings.customization.review-fields.error.save-failed':
    'Impossibile salvare il campo di revisione. Riprova.',
  'settings.customization.review-fields.delete.confirm-message':
    'Sei sicuro di voler eliminare il campo di revisione personalizzato "{fieldLabel}"?',
  'settings.customization.review-fields.reset.confirm-message':
    'Sei sicuro di voler eliminare TUTTI i campi di revisione personalizzati?',
  'settings.customization.review-fields.editor.title':
    'Configurazione del campo di revisione',
  'settings.customization.review-fields.editor.label-desc':
    'Nome visualizzato di questo campo di revisione',
  'settings.customization.review-fields.editor.label-placeholder':
    "Inserisci l'etichetta del campo di revisione",
  'settings.customization.review-fields.editor.key':
    'Chiave del campo di revisione',
  'settings.customization.review-fields.editor.key-desc':
    'Questa chiave verrà salvata nel frontmatter della nota di revisione in',
  'settings.customization.review-fields.editor.type-desc':
    'Tipo di input del campo di revisione',
  'settings.customization.review-fields.editor.description': 'Descrizione',
  'settings.customization.review-fields.editor.description-desc':
    'Testo di aiuto facoltativo per questo campo di revisione',
  'settings.customization.review-fields.editor.description-placeholder':
    'Spiega come usare questo campo',
  'settings.customization.review-fields.editor.placeholder-desc':
    'Testo segnaposto facoltativo mostrato quando inserisci un valore locale di revisione',
  'settings.customization.review-fields.editor.placeholder-input':
    'Inserisci il segnaposto del campo di revisione',

  'settings.customization.review-fields.editor.group': 'Gruppo del campo',
  'settings.customization.review-fields.editor.group-desc':
    'Scegli il gruppo di campi di revisione a cui appartiene questo campo.',
  'settings.customization.review-fields.groups.add-button': 'Aggiungi gruppo',
  'settings.customization.review-fields.groups.default-name': 'Nuovo gruppo',
  'settings.customization.review-fields.groups.untitled': 'Gruppo senza titolo',
  'settings.customization.review-fields.groups.ungrouped': 'Senza gruppo',
  'settings.customization.review-fields.groups.field-count': '{count} campi',
  'settings.customization.review-fields.groups.empty':
    'Nessun campo in questo gruppo.',
  'settings.customization.review-fields.groups.rename-prompt':
    'Nome del gruppo',
  'settings.customization.review-fields.groups.delete-message':
    'Eliminare il gruppo di campi di revisione "{groupName}"?',
  'settings.customization.review-fields.groups.delete-note':
    'I campi di questo gruppo resteranno senza gruppo. I valori di revisione salvati non vengono eliminati.',
  'settings.customization.review-fields.groups.error.duplicate':
    'Esiste già un gruppo di campi di revisione con questo nome.',
  'settings.customization.review-fields.groups.error.save-failed':
    'Impossibile salvare il gruppo di campi di revisione.',
  'settings.customization.review-fields.editor.compact':
    'Visualizzazione compatta',
  'settings.customization.review-fields.editor.compact-desc':
    'Preferisci la visualizzazione compatta quando questo campo compare nei widget di revisione',
  'settings.customization.review-fields.editor.appears-on': 'Visibile in',
  'settings.customization.review-fields.editor.appears-on-desc':
    'Tipi di nota di revisione che possono mostrare questo campo',
  'settings.customization.review-fields.editor.editable-on': 'Modificabile in',
  'settings.customization.review-fields.editor.editable-on-desc':
    'Tipi di nota di revisione in cui puoi inserire un valore locale',
  'settings.customization.review-fields.editor.inherit-to': 'Ereditato in',
  'settings.customization.review-fields.editor.inherit-to-desc':
    'Tipi di nota di revisione di timeframe inferiore che possono mostrare i valori ereditati da questo campo',
  'settings.customization.review-fields.editor.inheritance':
    "Abilita l'ereditarietà",
  'settings.customization.review-fields.editor.inheritance-desc':
    'Consenti a questo campo di essere letto dalle note di revisione di timeframe superiore',
  'settings.customization.review-fields.editor.inheritance-mode':
    'Modalità di ereditarietà',
  'settings.customization.review-fields.editor.inheritance-mode-desc':
    'Controlla se le revisioni figlie mostrano i valori ereditati, i valori locali o entrambi',
  'settings.customization.review-fields.editor.sources':
    'Fonti di ereditarietà',
  'settings.customization.review-fields.editor.sources-desc':
    'Tipi di revisione di timeframe superiore da cui questo campo può ereditare',

  'settings.customization.review-fields.editor.options-desc':
    'Scelte disponibili per questo campo di revisione',
  'settings.customization.review-fields.editor.allow-create-desc':
    'Gli utenti possono creare nuove opzioni quando usano questo campo nelle note di revisione',
  'settings.customization.review-fields.editor.save':
    'Salva campo di revisione',
  'settings.customization.review-fields.editor.delete':
    'Elimina campo di revisione',
  'settings.customization.review-fields.inheritance-mode.inherit-only':
    'Solo ereditato',
  'settings.customization.review-fields.inheritance-mode.local-only':
    'Solo locale',
  'settings.customization.review-fields.inheritance-mode.inherit-and-local':
    'Ereditato e locale',
  'onboarding.welcome.title': 'Benvenuto in Journalit',
  'onboarding.welcome.subtitle':
    'Un diario di trading che vive sul tuo dispositivo.',
  'onboarding.welcome.cta': 'Configura il mio diario',
  'onboarding.welcome.chart.week': 'Settimana {count}',
  'onboarding.view.title': 'Configurazione guidata Journalit',

  'onboarding.common.continue': 'Continua',
  'onboarding.common.close': 'Chiudi',

  'onboarding.features.badge.pro': 'PRO',

  'onboarding.features.graphic.syncing': 'Sincronizzazione operazioni...',
  'onboarding.features.graphic.complete': 'Sincronizzazione completata',
  'onboarding.features.graphic.direction.long': 'LONG',
  'onboarding.features.graphic.direction.short': 'SHORT',
  'onboarding.features.graphic.status.win': 'WIN',
  'onboarding.features.graphic.status.loss': 'LOSS',
  'onboarding.activation.title': 'Accedi a Journalit',

  'onboarding.activation.status.initializing':
    'Generazione del codice di autenticazione...',

  'onboarding.activation.status.error': 'Accesso non riuscito',
  'onboarding.activation.error.init':
    "Impossibile avviare l'accesso. Controlla la connessione a Internet e riprova.",
  'onboarding.activation.error.denied':
    "L'accesso è stato negato. Potrai accedere più tardi dalle impostazioni.",
  'onboarding.activation.error.expired':
    'Codice di autenticazione scaduto. Riavvia il processo di accesso.',
  'onboarding.activation.error.generic': 'Qualcosa è andato storto. Riprova.',
  'onboarding.activation.error.save':
    'Accesso riuscito ma salvataggio non riuscito. Riavvia il plugin e riprova.',
  'onboarding.activation.error.connection':
    'Connessione persa. Controlla Internet e riprova.',
  'onboarding.activation.notice.invalid-url':
    'URL di attivazione non valido. Contatta il supporto.',

  'onboarding.activation.notice.popup-blocked-manual':
    'Apri questo URL nel browser: {url}',
  'onboarding.activation.notice.copy-code-failed':
    'Impossibile copiare il codice. Copialo a mano.',
  'onboarding.activation.label.code': 'Il tuo codice di autenticazione',
  'onboarding.activation.button.copy': 'Copia codice',
  'onboarding.activation.button.copy-link': 'Copia link',
  'onboarding.activation.button.copied': 'Copiato!',
  'onboarding.activation.step.open-browser':
    'Fai clic qui sotto per aprire il browser',
  'onboarding.activation.step.enter-code':
    'Inserisci il codice di autenticazione',
  'onboarding.activation.step.complete-signin': "Completa l'accesso",
  'onboarding.activation.step.return-here':
    'Torna qui per il completamento automatico',
  'onboarding.activation.button.open-browser': 'Apri il browser per accedere',
  'onboarding.activation.waiting.title': "In attesa dell'accesso...",
  'onboarding.activation.waiting.hint': 'Di solito ci vuole meno di un minuto',
  'onboarding.activation.success.title': 'Accesso completato!',

  'onboarding.notice.complete-failed':
    'Impossibile salvare il completamento della configurazione guidata. Riprova più tardi.',
  'onboarding.notice.completed':
    'Il tuo diario è pronto. Configurazione guidata completata.',
  'onboarding.familiarity.kicker': 'Domanda veloce',
  'onboarding.familiarity.title': 'Hai già usato Obsidian?',
  'onboarding.familiarity.subtitle':
    "Journalit funziona dentro Obsidian. Se è nuovo per te, ti mostreremo solo l'essenziale.",
  'onboarding.familiarity.option.yes.label': 'Sì, me la cavo',
  'onboarding.familiarity.option.yes.description': "Salta l'orientamento.",
  'onboarding.familiarity.option.no.label': 'No, Obsidian è nuovo per me',
  'onboarding.familiarity.option.no.description':
    'Una sola schermata, nessun tour.',
  'onboarding.orientation.kicker': 'Nuovo su Obsidian',
  'onboarding.orientation.title': 'Quattro cose da sapere',
  'onboarding.orientation.subtitle':
    'È tutto ciò che serve per usare Journalit.',
  'onboarding.orientation.inside.title': 'Journalit funziona dentro Obsidian',
  'onboarding.orientation.inside.body':
    'Non serve imparare Obsidian prima. Questa schermata è una vista di Journalit.',
  'onboarding.orientation.sidebar.title':
    'La barra laterale è la tua navigazione',
  'onboarding.orientation.sidebar.body':
    'Home, Dashboard, Registro operazioni e le tue revisioni sono lì.',
  'onboarding.orientation.sidebar.action': 'Mostrami la barra laterale',
  'onboarding.orientation.sidebar.action-mobile': 'Apri la barra laterale',
  'onboarding.orientation.sidebar.hint':
    'Eccola, a sinistra. Questa schermata resta aperta.',
  'onboarding.orientation.sidebar.hint-mobile':
    'Si apre sopra questa schermata. Scorri o tocca fuori per tornare.',
  'onboarding.orientation.tabs.title': 'Le viste si aprono come schede',
  'onboarding.orientation.tabs.body':
    "Come questa. Passa dall'una all'altra in alto.",
  'onboarding.orientation.privacy.title':
    'Il tuo diario resta sul tuo dispositivo',
  'onboarding.orientation.privacy.body':
    'Note, screenshot e revisioni sono i tuoi file. Solo le operazioni importate o sincronizzate passano dai server di Journalit.',
  'onboarding.orientation.continue': 'Capito',
  'onboarding.data-source.kicker': 'Le tue operazioni',
  'onboarding.data-source.title': 'Dove sono le tue operazioni adesso?',
  'onboarding.data-source.subtitle':
    'Il tuo storico è parte del tuo vantaggio. Portalo con te e le statistiche avranno senso dal primo giorno, invece di aspettare mesi di nuove operazioni.',
  'onboarding.data-source.option.broker.label': 'Sul mio broker o piattaforma',
  'onboarding.data-source.option.broker.description':
    'Collegalo o importa ciò che esporta.',
  'onboarding.data-source.option.file.label': 'Nel mio foglio di calcolo',
  'onboarding.data-source.option.file.description':
    'Un diario che tieni in Excel, Google Sheets o CSV.',
  'onboarding.data-source.option.fresh.label':
    'Da nessuna parte, parto da zero',
  'onboarding.data-source.option.fresh.description':
    'Aggiungi le operazioni mentre le fai.',
  'onboarding.data-source.option.sample.label':
    'Da nessuna parte ancora, fammi esplorare un esempio',
  'onboarding.data-source.option.sample.description':
    "Dai un'occhiata a un diario già pronto prima di aggiungere le tue operazioni.",
  'onboarding.broker.kicker': 'Il tuo broker',
  'onboarding.broker.title': 'Quale broker o piattaforma?',
  'onboarding.awaiting.sign-in.action': 'Accedi per continuare',
  'onboarding.awaiting.sign-in.body':
    'Accedi o crea prima un account Journalit gratuito. Le tue operazioni arriveranno poi nel diario.',
  'onboarding.broker.badge.sync': 'Sincronizzazione',
  'onboarding.broker.search': 'Cerca broker e piattaforme',
  'onboarding.broker.subtitle':
    'Sceglieremo il modo migliore per importare le tue operazioni.',
  'onboarding.broker.option.unlisted.label': 'Non è in elenco',
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title':
    'Non è ancora in elenco? Dicci quale broker',
  'onboarding.broker.request.body':
    'I nuovi broker vengono aggiunti su richiesta. Dicci quale (un esempio di esportazione aiuta); nel frattempo un file esportato si può mappare a mano.',
  'onboarding.broker.request.discord': 'Richiedilo su Discord',
  'onboarding.broker.request.continue': 'Continua con l’importazione manuale',
  'onboarding.broker.loading': 'Verifica dei broker supportati...',
  'onboarding.broker.offline':
    "Impossibile caricare l'elenco completo. Puoi comunque collegare un broker supportato o importare un file.",
  'onboarding.personalise.kicker': 'Configura il tuo diario',
  'onboarding.personalise.title': 'Alcune scelte veloci',
  'onboarding.personalise.subtitle':
    'Personalizziamo Journalit in base alle tue risposte.',
  'onboarding.personalise.style.question': 'Come fai trading?',
  'onboarding.personalise.style.scalping': 'Molte operazioni al giorno',
  'onboarding.personalise.style.intraday':
    'Poche operazioni al giorno, niente overnight',
  'onboarding.personalise.style.swing': 'Tenute per giorni o settimane',
  'onboarding.personalise.style.position': 'Tenute per settimane o mesi',
  'onboarding.personalise.account.question': 'Che tipo di conto?',
  'onboarding.personalise.account.personal': 'Personale',
  'onboarding.personalise.account.practice': 'Demo o pratica',
  'onboarding.personalise.account.prop': 'Challenge prop firm o finanziato',
  'onboarding.personalise.asset.question': 'Cosa tradi principalmente?',
  'onboarding.personalise.asset.stock': 'Azioni',
  'onboarding.personalise.asset.futures': 'Futures',
  'onboarding.personalise.asset.forex': 'Forex',
  'onboarding.personalise.asset.crypto': 'Cripto',
  'onboarding.personalise.asset.options': 'Opzioni',
  'onboarding.personalise.asset.mixed': 'Un mix',
  'onboarding.first-trade.kicker': 'Quasi fatto',
  'onboarding.first-trade.title': 'Aggiungi la tua prima operazione',
  'onboarding.first-trade.subtitle':
    "Il tuo diario è pronto. Registra un'operazione e Journalit inizia a lavorarci.",
  'onboarding.first-trade.cta': 'Aggiungi la mia prima operazione',
  'onboarding.first-trade.sample': 'Esplora con dati di esempio',
  'onboarding.preparing-sample.title':
    'Stiamo preparando il tuo diario di esempio',
  'onboarding.preparing-sample.body':
    "Ci vogliono solo pochi secondi. Obsidian potrebbe sembrare un po' lento mentre le note vengono scritte.",
  'onboarding.preparing-sample.starting': 'Avvio…',
  'onboarding.preparing-sample.hint':
    "Puoi rimuovere il diario di esempio in qualsiasi momento dal suo badge nell'angolo.",
  'onboarding.preparing-sample.failed.title':
    'Impossibile creare il diario di esempio',
  'onboarding.preparing-sample.failed.body':
    'Puoi riprovare o scegliere un altro modo per iniziare.',
  'onboarding.preparing-sample.retry': 'Riprova',
  'onboarding.sample-exploring.kicker': 'Diario di esempio',
  'onboarding.sample-exploring.title': 'Stai esplorando il diario di esempio',
  'onboarding.sample-exploring.body':
    "Fai con calma. Quando esci dall'esempio riprendiamo da qui: personalizzare il tuo diario e aggiungere la tua prima operazione.",
  'onboarding.sample-exploring.exit': "Esci dall'esempio e continua",
  'onboarding.sample-exploring.failed.title':
    'Impossibile ripristinare il diario di esempio',
  'onboarding.sample-exploring.failed.body':
    "Esci dall'esempio per rimuovere ciò che resta, poi continua a configurare il tuo diario.",
  'onboarding.awaiting.kicker': 'In attesa delle tue prime operazioni',
  'onboarding.awaiting.first-sync.title': 'Completa il collegamento del broker',
  'onboarding.awaiting.first-sync.body':
    'Completa il collegamento in Impostazioni > Trade Sync. Quando le prime operazioni saranno sincronizzate, questa configurazione si chiuderà da sola.',
  'onboarding.awaiting.first-sync.action': 'Apri Trade Sync',
  'onboarding.awaiting.first-import.title': 'Importa il tuo file',
  'onboarding.awaiting.first-import.body':
    "Completa l'importazione nella scheda Trade Import. Quando le prime operazioni saranno dentro, questa configurazione si chiuderà da sola.",
  'onboarding.awaiting.first-import.action': 'Apri Trade Import',
  'onboarding.awaiting.first-trade.title': 'Salva la tua prima operazione',
  'onboarding.awaiting.first-trade.body':
    'Quando la tua prima operazione sarà salvata, questa configurazione si chiuderà da sola.',
  'onboarding.awaiting.first-trade.action': "Aggiungi un'operazione",
  'onboarding.awaiting.change-route': 'Scegli un altro modo',
  'onboarding.notice.personalise-failed':
    'Impossibile applicare le tue scelte di configurazione. Puoi modificarle più tardi nelle Impostazioni.',
  'onboarding.notice.trade-sync-open-failed':
    'Impossibile aprire Trade Sync. Riprova.',
  'onboarding.notice.skip-failed':
    'Impossibile salvare il salto della configurazione guidata. Riprova più tardi.',

  'widget.goals.title.daily': 'Obiettivi giornalieri',
  'widget.goals.title.weekly': 'Obiettivi settimanali',
  'widget.goals.title.monthly': 'Obiettivi mensili',
  'widget.goals.title.quarterly': 'Obiettivi trimestrali',
  'widget.goals.title.yearly': 'Obiettivi annuali',
  'widget.goals.title.default': 'Obiettivi',
  'widget.goals.tooltip.daily':
    'Gli elementi aggiunti qui valgono solo per questo giorno. Per gli elementi ricorrenti su tutti i nuovi DRC, vai su Impostazioni > Revisioni.',
  'widget.goals.tooltip.weekly':
    'Gli elementi aggiunti qui valgono solo per questa settimana. Per gli elementi ricorrenti su tutte le nuove revisioni settimanali, vai su Impostazioni > Revisioni.',
  'widget.goals.tooltip.monthly':
    'Gli elementi aggiunti qui valgono solo per questo mese. Per gli elementi ricorrenti su tutte le nuove revisioni mensili, vai su Impostazioni > Revisioni.',
  'widget.goals.tooltip.quarterly':
    'Gli elementi aggiunti qui valgono solo per questo trimestre. Per gli elementi ricorrenti su tutte le nuove revisioni trimestrali, vai su Impostazioni > Revisioni.',
  'widget.goals.tooltip.yearly':
    "Gli elementi aggiunti qui valgono solo per quest'anno. Per gli elementi ricorrenti su tutte le nuove revisioni annuali, vai su Impostazioni > Revisioni.",
  'widget.goals.completed': '{completed}/{total} completati',
  'widget.goals.placeholder': 'Aggiungi un nuovo obiettivo...',
  'widget.goals.empty.preview': 'Nessun obiettivo configurato',
  'widget.goals.empty.default':
    'Nessun obiettivo impostato. Aggiungine uno qui sotto.',
  'widget.goals.invalid-context':
    'Il Widget Obiettivi richiede una nota di revisione (DRC, settimanale, mensile, trimestrale o annuale)',
  'widget.goals.aria.edit': 'Modifica obiettivo',
  'widget.goals.aria.delete': 'Elimina obiettivo',
  'widget.header.name': 'Intestazione',

  'widget.header.invalid-context':
    "Frontmatter non valido: richiede 'type' (drc/weekly-review/monthly-review/quarterly-review/trade) e un campo data ('date' per le revisioni, 'entryTime' per le operazioni)",
  'widget.header.aria.mark-reviewed': 'Fai clic per segnare come revisionata',
  'widget.header.aria.mark-not-reviewed':
    'Fai clic per segnare come non revisionata',
  'widget.header.unknown-instrument': 'Sconosciuto',
  'widget.header.week': 'Settimana {number}',
  'widget.header.quarter': 'Q{number}',
  'widget.header.drc': 'DRC',
  'widget.header.nav.prev': '← Prec',
  'widget.header.nav.next': 'Succ →',
  'widget.header.day.0': 'Domenica',
  'widget.header.day.1': 'Lunedì',
  'widget.header.day.2': 'Martedì',
  'widget.header.day.3': 'Mercoledì',
  'widget.header.day.4': 'Giovedì',
  'widget.header.day.5': 'Venerdì',
  'widget.header.day.6': 'Sabato',
  'widget.header.month.0': 'Gennaio',
  'widget.header.month.1': 'Febbraio',
  'widget.header.month.2': 'Marzo',
  'widget.header.month.3': 'Aprile',
  'widget.header.month.4': 'Maggio',
  'widget.header.month.5': 'Giugno',
  'widget.header.month.6': 'Luglio',
  'widget.header.month.7': 'Agosto',
  'widget.header.month.8': 'Settembre',
  'widget.header.month.9': 'Ottobre',
  'widget.header.month.10': 'Novembre',
  'widget.header.month.11': 'Dicembre',
  'widget.header.month-short.0': 'Gen',
  'widget.header.month-short.1': 'Feb',
  'widget.header.month-short.2': 'Mar',
  'widget.header.month-short.3': 'Apr',
  'widget.header.month-short.4': 'Mag',
  'widget.header.month-short.5': 'Giu',
  'widget.header.month-short.6': 'Lug',
  'widget.header.month-short.7': 'Ago',
  'widget.header.month-short.8': 'Set',
  'widget.header.month-short.9': 'Ott',
  'widget.header.month-short.10': 'Nov',
  'widget.header.month-short.11': 'Dic',
  'widget.picker.placeholder': 'Seleziona un widget...',
  'widget.picker.search-placeholder': 'Cerca widget...',
  'widget.picker.search-label': 'Cerca widget',
  'widget.picker.clear-search': 'Azzera la ricerca widget',
  'widget.picker.results-label': 'Widget disponibili',
  'widget.picker.no-results': 'Nessun widget corrisponde alla tua ricerca',
  'widget.category.charts': 'Grafici',
  'widget.category.statistics': 'Statistiche',
  'widget.category.content': 'Contenuti',
  'widget.category.tables': 'Tabelle',
  'widget.category.layout': 'Layout',
  'widget.goals.name': 'Obiettivi',
  'widget.goals.description':
    'Obiettivi giornalieri con caselle di completamento',
  'widget.review.name': 'Revisione',
  'widget.review.description': 'Voti di prestazione mentale e tecnica',
  'widget.review-context-fields.name': 'Campi di contesto della revisione',
  'widget.review-context-fields.description':
    'Campi di contesto personalizzati modificabili per le note di revisione',
  'widget.review-context-fields.group.default': 'Contesto della revisione',

  'widget.review-context-fields.empty-title':
    'Nessun campo di contesto della revisione configurato per questo tipo di revisione.',
  'widget.review-context-fields.empty-desc':
    'Crea campi personalizzati di revisione nelle impostazioni per registrare bias, focus, intento e altro contesto di pianificazione.',
  'widget.review-context-fields.configure': 'Configura i campi di revisione',
  'widget.review-context-fields.service-unavailable':
    'I campi personalizzati di revisione non sono ancora disponibili.',
  'widget.review-context-fields.unsupported-type':
    'Tipo di campo di revisione non supportato.',
  'widget.review-context-fields.source-missing':
    'Questa revisione padre non esiste ancora.',
  'widget.review-context-fields.source-invalid':
    'Questa revisione padre esiste ma non è una nota di revisione valida.',
  'widget.review-context-fields.source-empty':
    'In questa revisione padre non è ancora compilato nessun valore ereditato.',

  'widget.review.title': 'Revisione delle prestazioni',
  'widget.review.mental-game': 'Gioco mentale',
  'widget.review.technical-game': 'Gioco tecnico',
  'widget.review.star-hint':
    'Fai clic per la stella intera, fai clic destro per la mezza stella',
  'widget.review.invalid-context':
    "Il Widget Revisione richiede una nota DRC o Revisione settimanale (tipo frontmatter: 'drc' o 'weekly-review')",
  'widget.checklist.name': 'Lista di controllo',
  'widget.checklist.description':
    'Lista di controllo di preparazione pre-sessione',
  'widget.session-mistakes.name': 'Errori di sessione',
  'widget.session-mistakes.description':
    'Registra gli errori comportamentali di fine sessione del giorno',
  'widget.key-levels.name': 'Livelli chiave',
  'widget.key-levels.description': 'Livelli di prezzo importanti da osservare',
  'widget.key-events.name': 'Eventi chiave',
  'widget.key-events.description': 'Eventi importanti durante il periodo',
  'widget.key-events.title': 'Eventi chiave',
  'widget.key-events.tooltip':
    'Gli eventi chiave vengono salvati nella Revisione settimanale e puoi aggiungerli o modificarli qui nel DRC.',
  'widget.key-events.placeholder': 'Seleziona o crea un evento',
  'widget.key-events.color-label': 'Colore:',
  'widget.key-events.color-aria': 'Seleziona il colore {color}',
  'widget.key-events.day-label': 'Giorno:',
  'widget.key-events.notes-placeholder': 'Note su questo evento (opzionale)',
  'widget.key-events.notes-label': 'Note',
  'widget.key-events.default-notes-tooltip':
    'Le note predefinite si gestiscono in Impostazioni → Personalizzazione → Eventi. Selezionando un evento qui verranno compilate automaticamente le note predefinite salvate.',
  'widget.key-events.add-button': 'Aggiungi evento',
  'widget.key-events.empty-state': 'Nessun evento chiave per oggi',
  'widget.key-events.empty-state-sub':
    'Aggiungi eventi nella Revisione settimanale',
  'widget.missed-trades.name': 'Operazioni perse',
  'widget.missed-trades.description':
    'Operazioni che hai identificato ma non hai preso',
  'widget.images.name': 'Grafici e media',
  'widget.images.description': 'Carosello media con supporto al caricamento',
  'widget.images.invalid-context':
    "Il Widget Media richiede una nota di revisione (tipo: 'drc', 'weekly-review', 'monthly-review', 'quarterly-review' o 'yearly-review')",
  'widget.images.alt-prefix': 'Media della revisione',
  'widget.images.stacked-alt': 'Media della revisione {index}',
  'widget.images.open-fullscreen': 'Apri il media {index} a schermo intero',
  'widget.images.delete': 'Elimina media',
  'widget.images.empty': 'Nessun media',
  'widget.images.placeholder': 'Incolla URL o percorso del file media...',
  'widget.images.placeholder-add-more': 'Aggiungi altri media...',
  'widget.mark-reviewed.name': 'Segna come revisionata',
  'widget.mark-reviewed.description':
    'Banner per segnare la revisione come completata con data e ora',
  'widget.mark-reviewed.status.reviewed': 'REVISIONATA',
  'widget.mark-reviewed.status.pending': 'REVISIONE IN SOSPESO',
  'widget.mark-reviewed.button.undo': 'Annulla',
  'widget.mark-reviewed.button.mark': 'Segna come revisionata',
  'widget.pnl-chart.name': 'Curva equity',
  'widget.pnl-chart.description': 'Profitto/perdita cumulativi nel tempo',
  'widget.drawdown-chart.name': 'Drawdown',
  'widget.drawdown-chart.description':
    'Importo di Drawdown su operazioni chiuse rispetto al precedente massimo di P&L realizzato',
  'widget.directional-pnl.name': 'P&L direzionale',
  'widget.directional-pnl.description': 'Confronto prestazioni Long e Short',
  'widget.directional-drawdown.name': 'Drawdown realizzato direzionale',
  'widget.directional-drawdown.description':
    'Curve separate di importo di Drawdown su operazioni chiuse Long e Short',
  'widget.long-drawdown.name': 'Long Drawdown',
  'widget.long-drawdown.description':
    'Curva di importo di Drawdown su operazioni chiuse solo per operazioni Long',
  'widget.short-drawdown.name': 'Short Drawdown',
  'widget.short-drawdown.description':
    'Curva di importo di Drawdown su operazioni chiuse solo per operazioni Short',
  'widget.trades-chart.name': 'P&L per operazione',
  'widget.trades-chart.description': 'Barra di P&L per ogni singola operazione',
  'widget.trades-chart-daily.name': 'P&L giornaliero',
  'widget.trades-chart-daily.description': 'P&L aggregato per giorno',
  'widget.trades-chart-weekly.name': 'P&L settimanale',
  'widget.trades-chart-weekly.description': 'P&L aggregato per settimana',
  'widget.trades-chart-monthly.name': 'P&L mensile',
  'widget.trades-chart-monthly.description': 'P&L aggregato per mese',
  'widget.trades-chart-quarterly.name': 'P&L trimestrale',
  'widget.trades-chart-quarterly.description': 'P&L aggregato per trimestre',
  'widget.stats.name': 'Griglia statistiche',
  'widget.stats.description':
    'Metriche di prestazioni chiave in formato griglia',
  'widget.stats.no-trades': 'Nessuna operazione chiusa in questo periodo',
  'widget.stats.vs-prev': 'vs prec',
  'common.r-missing.title': 'Nessun R per questo trade',
  'common.r-missing.trade':
    'Questo trade non ha un importo di rischio, quindi il suo risultato non può essere mostrato in R.',
  'common.r-missing.fix':
    'Aggiungi un importo di rischio o imposta un importo di rischio predefinito nelle Impostazioni.',
  'common.r-coverage.partial':
    'Basato su {valid} di {total} trade. I trade senza importo di rischio non vengono conteggiati in R.',
  'common.r-coverage.none':
    "Nessun trade qui ha un importo di rischio, quindi non c'è alcun R da mostrare.",
  'dashboard.r-coverage.no-comparison':
    'Nessuna variazione mostrata: il periodo di confronto non ha un valore in R per questa statistica.',
  'dashboard.metrics.past-30d': 'ultimi 30g',

  'widget.stats.net-pnl': 'P&L netto',
  'widget.stats.win-rate': 'Tasso di vincita',
  'widget.stats.profit-factor': 'Fattore di profitto',
  'widget.stats.expectancy': 'Aspettativa',
  'widget.stats.total-trades': 'Operazioni totali',
  'widget.stats.avg-win': 'Vincita media',
  'widget.stats.avg-loss': 'Perdita media',
  'widget.stats.pl-ratio': 'Rapporto P/L',
  'widget.account-breakdown.name': 'Ripartizione per conto',
  'widget.account-breakdown.description':
    'Confronta le prestazioni tra i conti in questo periodo di revisione',
  'widget.account-breakdown.empty':
    'Nessuna operazione chiusa in questo periodo',
  'widget.account-breakdown.column.account': 'Conto',
  'widget.account-breakdown.column.trades': 'Operazioni',
  'widget.account-breakdown.column.pnl': 'P&L netto',
  'widget.account-breakdown.column.win-rate': 'Tasso di vincita',
  'widget.account-breakdown.column.profit-factor': 'Fattore di profitto',
  'widget.tag-performance.name': 'Prestazioni per tag',
  'widget.tag-performance.description':
    "Ripartizione delle prestazioni per tag dell'operazione",
  'widget.setup-performance.name': 'Prestazioni per Setup',
  'widget.setup-performance.description':
    'Ripartizione delle prestazioni per Setup di trading',
  'widget.best-worst-trades.name': 'Migliori/peggiori operazioni',
  'widget.best-worst-trades.description':
    'Le operazioni più vincenti e più perdenti',
  'widget.best-worst.best-trade': 'Migliore operazione',
  'widget.best-worst.worst-trade': 'Peggiore operazione',
  'widget.best-worst.no-win-trades': 'Nessuna operazione vincente',
  'widget.best-worst.no-loss-trades': 'Nessuna operazione perdente',
  'widget.best-worst.best-month': 'Miglior mese',
  'widget.best-worst.worst-month': 'Peggior mese',
  'widget.best-worst.no-profitable-months': 'Nessun mese profittevole',
  'widget.best-worst.no-losing-months': 'Nessun mese in perdita',
  'widget.best-worst.n-trades': '{count} operazioni',
  'widget.best-worst.win-rate': '{rate}% tasso di vincita',
  'widget.best-worst-days.name': 'Migliori/peggiori giorni',
  'widget.best-worst-days.description':
    'Giorni con il P&L più alto e più basso',
  'widget.best-worst-days.best-day': 'Miglior giorno',
  'widget.best-worst-days.worst-day': 'Peggior giorno',
  'widget.best-worst-days.no-profitable-days': 'Nessun giorno profittevole',
  'widget.best-worst-days.no-losing-days': 'Nessun giorno in perdita',
  'widget.best-worst-days.trade-count.one': '{count} operazione',
  'widget.best-worst-days.trade-count.few': '{count} operazioni',
  'widget.best-worst-days.trade-count.many': '{count} operazioni',
  'widget.best-worst-days.trade-count.other': '{count} operazioni',
  'widget.best-worst-days.win-rate': '{rate}% tasso di vincita',
  'widget.best-worst-days.invalid-context':
    'Questo Widget è disponibile solo nelle revisioni settimanali e mensili',
  'widget.position-size.title': 'Dimensione della posizione',
  'widget.position-size.save-defaults': 'Salva come predefinito',
  'widget.position-size.reset-defaults': 'Ripristina i predefiniti',
  'widget.position-size.stock-crypto': 'Azioni/Crypto',
  'widget.position-size.futures': 'Futures',
  'widget.position-size.forex': 'Forex',
  'widget.position-size.account-balance': 'Saldo del conto',
  'widget.position-size.risk-percent': 'Rischio %',
  'widget.position-size.entry-price': 'Prezzo di ingresso',
  'widget.position-size.profit-target-optional':
    'Target di profitto (opzionale)',
  'widget.position-size.currency-pair': 'Coppia di valute',
  'widget.position-size.stop-loss-pips': 'Stop loss (pips)',
  'widget.position-size.target-pips-optional': 'Target (pips, opzionale)',
  'widget.position-size.placeholder.example': 'es. {value}',
  'widget.position-size.enter-values': 'inserisci i valori',
  'widget.position-size.risk': 'Rischio',
  'widget.position-size.reward': 'Rendimento',
  'widget.position-size.stop': 'stop',
  'widget.position-size.pts': 'pts',
  'widget.position-size.mini': 'mini',
  'widget.position-size.pip-value-info':
    'Valore pip: ${value} (lotto Standard) | Dimensione pip: {size}',
  'widget.position-size.futures-info': '${dollar}/pt | Tick: {size} = ${value}',
  'widget.position-size.investment-dollar': 'Investimento ($)',
  'widget.position-size.investment': 'Investimento',
  'widget.position-size.at-price': '@ ${price}',
  'widget.best-worst-weeks.name': 'Migliori/peggiori settimane',
  'widget.best-worst-weeks.description':
    'Settimane con il P&L più alto e più basso',
  'widget.best-worst-weeks.best-week': 'Migliore settimana',
  'widget.best-worst-weeks.worst-week': 'Peggiore settimana',
  'widget.best-worst-weeks.no-profitable': 'Nessuna settimana profittevole',
  'widget.best-worst-weeks.no-losing': 'Nessuna settimana in perdita',
  'widget.best-worst-weeks.week-name': 'Settimana {number} ({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} operazioni',
  'widget.best-worst-weeks.win-rate': '{percent}% tasso di vincita',
  'widget.best-worst-weeks.invalid-context':
    'Questo Widget è disponibile solo nelle revisioni settimanali, mensili, trimestrali e annuali',
  'widget.best-worst-months.name': 'Migliori/peggiori mesi',
  'widget.best-worst-months.description':
    'Mesi con il P&L più alto e più basso',
  'widget.best-worst-months.invalid-context':
    'Questo Widget è disponibile solo nelle revisioni trimestrali e annuali',
  'widget.best-worst-quarters.name': 'Migliori/peggiori trimestri',
  'widget.best-worst-quarters.description':
    'Trimestri con il P&L più alto e più basso',
  'widget.best-worst-quarters.best-quarter': 'Miglior trimestre',
  'widget.best-worst-quarters.worst-quarter': 'Peggior trimestre',
  'widget.best-worst-quarters.no-profitable': 'Nessun trimestre profittevole',
  'widget.best-worst-quarters.no-losing': 'Nessun trimestre in perdita',
  'widget.best-worst-quarters.trade-count': '{count} operazioni',
  'widget.best-worst-quarters.win-rate': '{percent}% tasso di vincita',
  'widget.best-worst-quarters.invalid-context':
    'Questo Widget è disponibile solo nelle revisioni annuali',
  'widget.technical-game.name': 'Gioco tecnico',
  'widget.technical-game.description':
    'Distribuzione settimanale dei voti tecnici dai DRC',
  'widget.mental-game.name': 'Gioco mentale',
  'widget.mental-game.description':
    'Distribuzione settimanale dei voti mentali dai DRC',
  'widget.demon-tracker.name': 'Errori ricorrenti',
  'widget.demon-tracker.description':
    'Monitora gli errori di trading ricorrenti',
  'widget.trading-score.title': 'Punteggio di trading',
  'widget.trading-score.no-data': 'Nessun dato sulle operazioni',
  'widget.trading-score.breakdown-title': 'Dettaglio del punteggio',
  'widget.trading-score.close-breakdown': 'Chiudi il dettaglio',
  'widget.trading-score.of-weeks': 'di {count}',
  'widget.trading-score.start-trading':
    'Inizia a operare per sbloccare il tuo punteggio',
  'widget.trading-score.one-week-down': '1 settimana fatta, continua così!',
  'widget.trading-score.weeks-to-unlock.one':
    'Ancora {count} settimana per sbloccare',
  'widget.trading-score.weeks-to-unlock.few':
    'Ancora {count} settimane per sbloccare',
  'widget.trading-score.weeks-to-unlock.many':
    'Ancora {count} settimane per sbloccare',
  'widget.trading-score.weeks-to-unlock.other':
    'Ancora {count} settimane per sbloccare',
  'widget.trading-score.trades-to-unlock.one':
    'Ancora {count} operazione per sbloccare',
  'widget.trading-score.trades-to-unlock.few':
    'Ancora {count} operazioni per sbloccare',
  'widget.trading-score.trades-to-unlock.many':
    'Ancora {count} operazioni per sbloccare',
  'widget.trading-score.trades-to-unlock.other':
    'Ancora {count} operazioni per sbloccare',
  'widget.trading-score.collect-more-data':
    'Raccogli ancora qualche dato per sbloccare il tuo punteggio',
  'widget.trading-score.trades-logged.one': '{count} operazione registrata',
  'widget.trading-score.trades-logged.few': '{count} operazioni registrate',
  'widget.trading-score.trades-logged.many': '{count} operazioni registrate',
  'widget.trading-score.trades-logged.other': '{count} operazioni registrate',
  'widget.trading-score.trades-count': '{count} operazioni',
  'widget.trading-score.weight': 'Peso: {weight}%',
  'widget.trading-score.weeks-suffix': '· {weeks}sett',
  'widget.trading-score.axis-aria': '{axis}: {score} punti, peso {weight}%',
  'widget.trading-score.phase.insufficient': 'Dati insufficienti',
  'widget.trading-score.phase.developing': 'In sviluppo',
  'widget.trading-score.phase.established': 'Consolidato',
  'widget.trading-score.axis.profitability': 'Redditività',
  'widget.trading-score.axis.riskManagement': 'Gestione del rischio',
  'widget.trading-score.axis.execution': 'Esecuzione',
  'widget.trading-score.axis.consistency': 'Costanza',
  'widget.trading-score.axis.returnConsistency': 'Costanza dei rendimenti',
  'widget.trading-score.axis.experience': 'Esperienza',
  'widget.trading-score.axis.profitability.desc':
    "Misura il fattore di profitto e l'aspettativa per operazione",
  'widget.trading-score.axis.riskManagement.desc':
    'Misura il controllo del max Drawdown e la capacità di recupero',
  'widget.trading-score.axis.execution.desc':
    'Misura il tasso di vincita e il rapporto medio vincita/perdita',
  'widget.trading-score.axis.consistency.desc':
    'Misura la stabilità dei rendimenti e il controllo delle serie',
  'widget.trading-score.axis.returnConsistency.desc':
    "Misura l'uniformità di take profit e stop loss",
  'widget.trading-score.axis.experience.desc':
    'Misura le settimane di trading attive e la costanza',
  'widget.trades.name': 'Operazioni',
  'widget.trades.description': 'Elenco delle operazioni con i dettagli chiave',
  'widget.trade-review.name': 'Revisione operazione',
  'widget.trade-review.description':
    'Revisiona ogni operazione con immagini, dati chiave e domande configurabili',
  'widget.trade-review.question.win-what-worked': 'Cosa ha funzionato?',
  'widget.trade-review.placeholder.win-what-worked':
    'Cosa hai eseguito bene in questa operazione?',
  'widget.trade-review.question.win-repeatable': 'Era ripetibile?',
  'widget.trade-review.placeholder.win-repeatable':
    'Cosa ha reso ripetibile questa operazione?',
  'widget.trade-review.question.key-lesson': 'Lezione chiave',
  'widget.trade-review.placeholder.key-lesson':
    'Cosa dovresti ricordare di questa operazione?',
  'widget.trade-review.question.loss-what-went-wrong': 'Cosa è andato storto?',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    'Cosa ha causato questa perdita?',
  'widget.trade-review.question.loss-valid-or-mistake':
    'Era una perdita valida o un errore di esecuzione?',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    'Descrivi se era valida per il processo o evitabile.',
  'widget.trade-review.question.loss-avoid-next-time':
    'Cosa eviterò la prossima volta?',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    'Quale comportamento specifico dovrebbe cambiare?',
  'widget.trade-review.question.be-managed-correctly':
    'È stata gestita correttamente?',
  'widget.trade-review.placeholder.be-managed-correctly':
    'La gestione corrispondeva al tuo piano?',
  'widget.trade-review.status.reviewed': 'Revisionata',
  'widget.trade-review.status.pending': 'Revisione in sospeso',
  'widget.trade-review.image-alt-prefix': 'Immagine della revisione operazione',
  'widget.trade-review.no-image': "Nessuna immagine dell'operazione",
  'widget.trade-review.placeholder.default': 'Scrivi i tuoi pensieri...',

  'widget.trade-review.open-trade-note': "Apri la nota dell'operazione",

  'widget.trade-review.field.entry': 'Ingresso',
  'widget.trade-review.field.exit': 'Uscita',
  'widget.trade-review.field.duration': 'Durata',
  'widget.trade-review.field.risk': 'Rischio',
  'widget.trade-review.field.account': 'Conto',
  'widget.trade-review.field.setup': 'Setup',
  'widget.trade-review.field.mistakes': 'Errori',
  'widget.trade-review.field.tags': 'Tag',
  'widget.trade-review.more-context': 'Altro contesto',
  'widget.trade-review.field.position-size': 'Quantità',
  'widget.trade-review.field.stop-loss': 'Stop loss',
  'widget.trade-review.field.take-profit': 'Take profit',
  'widget.trade-review.field.fees': 'Spese',
  'widget.trade-review.field.commission': 'Commissione',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': 'Tesi',
  'widget.trade-review.field.notes': 'Note',
  'widget.trade-review.field.custom-fields': 'Campi personalizzati',
  'widget.trade-review.loading':
    'Caricamento delle revisioni delle operazioni...',
  'widget.trade-review.no-trades': 'Nessuna operazione da revisionare.',
  'widget.trade-review.time.open': 'Aperta',
  'widget.trade-review.fallback-title': 'Operazione {index}',
  'widget.backtest-trades.name': 'Operazioni Backtest',
  'widget.backtest-trades.description':
    'Elenco delle operazioni di Backtest per questo periodo di revisione',
  'widget.breakdown-daily.name': 'Riepilogo giornaliero',
  'widget.breakdown-daily.description':
    'Tabella delle prestazioni raggruppata per giorno',
  'widget.breakdown-weekly.name': 'Riepilogo settimanale',
  'widget.breakdown-weekly.description':
    'Tabella delle prestazioni raggruppata per settimana',
  'widget.breakdown-monthly.name': 'Riepilogo mensile',
  'widget.breakdown-monthly.description':
    'Tabella delle prestazioni raggruppata per mese',
  'widget.breakdown-quarterly.name': 'Riepilogo trimestrale',
  'widget.breakdown-quarterly.description':
    'Tabella delle prestazioni raggruppata per trimestre',
  'widget.breakdown.empty.days-week':
    'Nessun giorno di trading questa settimana',
  'widget.breakdown.empty.weeks-month':
    'Nessuna settimana di trading questo mese',
  'widget.breakdown.empty.months-quarter':
    'Nessun mese di trading questo trimestre',
  'widget.breakdown.empty.quarters-year':
    "Nessun trimestre di trading quest'anno",
  'widget.table.header.date': 'Data',
  'widget.table.header.week': 'Settimana',
  'widget.table.header.month': 'Mese',
  'widget.table.header.quarter': 'Trimestre',

  'widget.table.header.trades': 'Operazioni',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Vinc%',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.tag': 'Tag',
  'widget.table.header.setup': 'Setup',
  'widget.table.header.a-games': 'A-game',
  'widget.table.header.b-games': 'B-game',
  'widget.table.header.c-games': 'C-game',
  'widget.table.header.rating': 'Valutazione',
  'widget.table.header.avg-rating': 'Valutazione media',
  'widget.demon-tracker.column.demon': 'ERRORE',
  'widget.demon-tracker.column.occurrences': 'OCCORRENZE',
  'widget.demon-tracker.column.stop-trading': 'FERMA IL TRADING',
  'widget.demon-tracker.period.this-week': 'questa settimana',
  'widget.demon-tracker.period.this-month': 'questo mese',
  'widget.demon-tracker.period.this-quarter': 'questo trimestre',
  'widget.demon-tracker.period.this-year': "quest'anno",
  'widget.demon-tracker.empty.title': 'Nessun errore registrato {period}',
  'widget.demon-tracker.empty.description':
    'Gli errori registrati nelle tue operazioni appariranno qui per aiutarti a identificare gli schemi',
  'widget.demon-tracker.summary.unique': 'Errori unici:',
  'widget.demon-tracker.summary.total': 'Occorrenze totali:',
  'widget.demon-tracker.summary.critical': 'Critici ({threshold}+):',
  'widget.markdown-zone.name': 'Zona Markdown',
  'widget.markdown-zone.description': 'Area di contenuto markdown libero',
  'widget.markdown-header.name': 'Intestazione di sezione',
  'widget.markdown-header.description':
    'Intestazione markdown (H1-H6) con testo personalizzato',
  'metric.netPnL.name': 'P&L netto',
  'metric.netPnL.description':
    'Profitto e perdita totali su tutte le operazioni',
  'metric.winRate.name': 'Tasso di vincita',
  'metric.winRate.description': 'Percentuale di operazioni vincenti',
  'metric.profitFactor.name': 'Fattore di profitto',
  'metric.profitFactor.description':
    'Rapporto tra profitto lordo e perdita lorda',
  'metric.sharpeRatio.name': 'Indice Sharpe',
  'metric.sharpeRatio.description':
    'Indice Sharpe: P&L medio per trade e volatilità',
  'metric.expectancy.name': 'Aspettativa',
  'metric.expectancy.description': 'Importo medio vinto o perso per operazione',
  'metric.maxDrawdown.name': 'Max Drawdown',
  'metric.maxDrawdown.description':
    'Maggior calo da un massimo di P&L precedente',
  'metric.bestDay.name': 'Miglior giorno',
  'metric.bestDay.description': 'P&L più alto in un singolo giorno',
  'metric.largestWin.name': 'Vincita più grande',
  'metric.largestWin.description': 'Operazione vincente più grande',
  'metric.largestLoss.name': 'Perdita più grande',
  'metric.largestLoss.description': 'Operazione perdente più grande',
  'metric.longestWinStreak.name': 'Serie migliore',
  'metric.longestWinStreak.description':
    'Serie vincente consecutiva più lunga per data di uscita',
  'metric.longestLossStreak.name': 'Serie peggiore',
  'metric.longestLossStreak.description':
    'Serie perdente consecutiva più lunga per data di uscita',
  'metric.numTrades.name': 'Operazioni totali',
  'metric.numTrades.description': 'Numero totale di operazioni chiuse',
  'metric.numWinTrades.name': 'Operazioni vincenti',
  'metric.numWinTrades.description': 'Numero di operazioni vincenti',
  'metric.numLossTrades.name': 'Operazioni perdenti',
  'metric.numLossTrades.description': 'Numero di operazioni perdenti',
  'metric.avgWin.name': 'Vincita media',
  'metric.avgWin.description': 'Profitto medio delle operazioni vincenti',
  'metric.avgLoss.name': 'Perdita media',
  'metric.avgLoss.description': 'Perdita media delle operazioni perdenti',
  'metric.avgRR.name': 'RR medio (rapporto vincita/perdita)',
  'metric.avgRR.description': 'Guadagno medio diviso perdita media',
  'metric.avgRRRiskBased.name': 'RR medio (basato su R)',
  'metric.avgRRRiskBased.description':
    'R vincente medio vs R perdente (serve lo stop)',
  'metric.avgHoldTime.name': 'Tempo medio in posizione',
  'metric.avgHoldTime.description': 'Tempo medio in tutte le operazioni chiuse',
  'metric.avgWinHoldTime.name': 'Tempo medio in posizione (vincite)',
  'metric.avgWinHoldTime.description':
    'Tempo medio nelle operazioni chiuse vincenti',
  'metric.avgLossHoldTime.name': 'Tempo medio in posizione (perdite)',
  'metric.avgLossHoldTime.description':
    'Tempo medio nelle operazioni chiuse perdenti',
  'metric.avgWinnerHeat.name': 'MAE medio vincenti',
  'metric.avgWinnerHeat.description': 'MAE medio dei trade vincenti',
  'metric.winnerMaeP90.name': 'MAE P90 vincenti',
  'metric.winnerMaeP90.description':
    '90° percentile del MAE dei trade vincenti',
  'metric.winnerMaeMedian.name': 'MAE mediano vincenti',
  'metric.winnerMaeMedian.description': 'MAE mediano dei trade vincenti',
  'metric.avgLossHeat.name': 'MAE medio perdenti',
  'metric.avgLossHeat.description': 'MAE medio dei trade perdenti',
  'metric.winnerAvgMfe.name': 'MFE medio vincenti',
  'metric.winnerAvgMfe.description': 'MFE medio dei trade vincenti',
  'metric.loserAvgMfe.name': 'MFE medio perdenti',
  'metric.loserAvgMfe.description': 'MFE medio dei trade perdenti',
  'metric.winnerMfeP90.name': 'MFE P90 vincenti',
  'metric.winnerMfeP90.description':
    '90° percentile del MFE dei trade vincenti',
  'metric.loserMfeP90.name': 'MFE P90 perdenti',
  'metric.loserMfeP90.description': '90° percentile del MFE dei trade perdenti',
  'metric.timeInDrawdown.name': 'Tempo in Drawdown',
  'metric.timeInDrawdown.description': 'Quota di tempo sotto il massimo di P&L',
  'metric.avgRecoveryTime.name': 'Tempo di recupero medio',
  'metric.avgRecoveryTime.description':
    'Tempo medio per recuperare un drawdown',
  'metric.longestDrawdown.name': 'Drawdown più lungo',
  'metric.longestDrawdown.description':
    'Tempo più lungo in un singolo drawdown',
  'metric.drawdownEpisodes.name': 'Episodi di Drawdown',
  'metric.drawdownEpisodes.description':
    'Numero di periodi di drawdown distinti',
  'metric.category.performance': 'Prestazioni',
  'metric.category.volume': 'Volume',

  'onboarding.wizard.skip-aria': 'Salta questo passaggio',
  'onboarding.wizard.skip-onboarding': 'Salta la configurazione guidata',

  'guide.skip-guide': 'Salta guida',
  'guide.step-count': '{count} passaggi',
  'guide.step-position': 'Passo {current} di {total}',

  'account.linked-trades.setups': 'Setup',

  'account.create.title': 'Crea conto',
  'account.create.field.name': 'Nome del conto',
  'account.create.field.name-desc':
    'Un nome univoco per il tuo conto di trading',
  'account.create.placeholder.name': 'Il mio conto di trading',
  'account.create.field.type': 'Tipo di conto',
  'account.create.field.type-desc': 'Il tipo di conto di trading',
  'account.create.field.initial-balance': 'Saldo iniziale',
  'account.create.field.initial-balance-desc':
    'Saldo iniziale del conto (facoltativo, predefinito 0)',
  'account.create.field.live-balance': 'Saldo attuale',
  'account.create.field.live-balance-desc':
    'Saldo attuale del conto presso il broker',
  'account.create.field.creation-date': 'Data di creazione',
  'account.create.field.creation-date-desc': 'Quando è stato creato il conto',
  'account.create.field.currency': 'Valuta',
  'account.create.field.currency-desc':
    'Valuta nativa del conto per la visualizzazione',
  'account.create.field.drawdown-type': 'Tipo di Drawdown',

  'account.create.field.drawdown-amount': 'Importo Drawdown',
  'account.create.field.drawdown-amount-desc': 'Limite massimo di Drawdown',
  'account.create.field.profit-target-desc':
    'Imposta un obiettivo di profitto per il conto',
  'account.create.field.monthly-cost': 'Costo mensile',
  'account.create.field.monthly-cost-desc':
    'Abbonamenti, costi della piattaforma',
  'account.create.field.target-type': 'Tipo di obiettivo',
  'account.create.field.target-type-desc': 'Assoluto o percentuale',
  'account.create.field.target-percent': 'Obiettivo (%)',
  'account.create.field.target-dollar': 'Obiettivo ($)',
  'account.create.field.target-percent-desc':
    'Obiettivo di guadagno in percentuale',
  'account.create.field.target-dollar-desc': 'Obiettivo in importo',
  'account.create.field.target-date': 'Data obiettivo (facoltativa)',
  'account.create.field.target-date-desc':
    "Data per raggiungere l'obiettivo di profitto",
  'account.create.type.demo': 'Demo',
  'account.create.type.evaluation': 'Valutazione',
  'account.create.type.funded': 'Finanziato',
  'account.create.success': 'Conto "{name}" creato con successo',
  'account.create.error.name-required': 'Il nome del conto è obbligatorio',
  'account.create.error.name-exists':
    'Esiste già un conto con il nome "{name}"',
  'account.create.error.rule-incomplete':
    'Ogni regola attiva richiede un valore maggiore di zero',
  'account.create.error.balance-negative':
    'Il saldo iniziale non può essere negativo',
  'account.create.error.invalid-live-balance': 'Il saldo attuale non è valido',
  'account.create.error.drawdown-required':
    "L'importo Drawdown è obbligatorio quando il tipo di Drawdown è attivo",
  'account.create.error.profit-target-required':
    "L'importo dell'obiettivo di profitto è obbligatorio quando l'obiettivo è attivo",
  'account.create.error.invalid-date': 'Data di creazione non valida',
  'account.create.error.future-date':
    'La data di creazione non può essere nel futuro',
  'account.create.error.cost-negative':
    'Il costo mensile non può essere negativo',
  'account.create.error.service-unavailable':
    'Il servizio conti non è disponibile. Riprova.',
  'account.create.error.fix-target-date':
    "Correggi l'errore sulla data dell'obiettivo di profitto prima di creare il conto",
  'account.create.error.invalid-target-date':
    "Data dell'obiettivo di profitto non valida",
  'account.create.error.failed': 'Impossibile creare il conto: {error}',
  'account.add-event.title': 'Aggiungi deposito/prelievo',
  'account.add-event.field.type': 'Tipo di transazione',
  'account.add-event.field.type-desc': 'Deposito o prelievo',
  'account.add-event.field.amount': 'Importo',
  'account.add-event.field.amount-desc': 'Importo in {currency}',
  'account.add-event.field.date': 'Data',
  'account.add-event.field.date-desc': 'Data della transazione',
  'account.add-event.field.description': 'Descrizione (facoltativa)',
  'account.add-event.field.description-desc': 'Note aggiuntive',
  'account.add-event.type.deposit': 'Deposito',
  'account.add-event.type.withdrawal': 'Prelievo',
  'account.add-event.placeholder.deposit': 'Deposito manuale',
  'account.add-event.placeholder.withdrawal': 'Prelievo manuale',
  'account.add-event.button.add': 'Aggiungi transazione',
  'account.add-event.button.adding': 'Aggiunta...',
  'account.add-event.success': '{type} di {amount} aggiunto con successo',
  'account.add-event.error.amount-required':
    "L'importo deve essere maggiore di 0",
  'account.add-event.error.date-required': 'La data è obbligatoria',
  'account.add-event.error.invalid-date': 'Formato data non valido',
  'account.add-event.error.future-date':
    'La data della transazione non può essere nel futuro',
  'account.add-event.error.failed':
    "Errore durante l'aggiunta della transazione: {error}",
  'account.add-event.confirm.title': 'Conferma transazione',
  'account.add-event.confirm.message':
    'Aggiungere {type} di {amount} al conto "{account}" il {date}?',
  'account.add-event.confirm.description': 'Descrizione: {description}',
  'account.risk-metrics.loading': 'Caricamento metriche di rischio...',
  'account.risk-metrics.title': 'Gestione del rischio',
  'account.risk-metrics.drawdown-used': 'Limite di Drawdown utilizzato',
  'account.risk-metrics.profit-target': 'Obiettivo di profitto',
  'account.risk-metrics.status.breached': 'SUPERATO',
  'account.risk-metrics.status.achieved': 'RAGGIUNTO',
  'account.risk-metrics.status.in-progress': 'IN CORSO',
  'account.risk-metrics.not-set': 'Non impostato',
  'account.risk-metrics.no-drawdown': 'Nessun limite di Drawdown impostato',
  'account.risk-metrics.no-profit-target':
    'Nessun obiettivo di profitto impostato',
  'account.risk-metrics.label.used': 'Utilizzato:',
  'account.risk-metrics.label.limit': 'Limite:',
  'account.risk-metrics.label.remaining': 'Rimanente:',
  'account.risk-metrics.label.progress': 'Avanzamento:',
  'account.risk-metrics.label.target': 'Obiettivo:',
  'account.risk-metrics.label.target-date': 'Data obiettivo:',
  'account.edit-event.title': 'Modifica {type}',
  'account.edit-event.field.type': 'Tipo di transazione',
  'account.edit-event.field.type-desc':
    'Non può essere modificato in fase di modifica',
  'account.edit-event.field.amount': 'Importo',
  'account.edit-event.field.amount-desc': 'Importo in {currency}',
  'account.edit-event.field.date': 'Data',
  'account.edit-event.field.date-desc': 'Data della transazione',
  'account.edit-event.field.description': 'Descrizione (facoltativa)',
  'account.edit-event.field.description-desc': 'Note aggiuntive',
  'account.edit-event.button.save': 'Salva modifiche',
  'account.edit-event.button.saving': 'Salvataggio...',
  'account.edit-event.button.delete': 'Elimina {type}',
  'account.edit-event.button.deleting': 'Eliminazione...',
  'account.edit-event.success.update': '{type} aggiornato con successo',
  'account.edit-event.success.delete': '{type} eliminato con successo',
  'account.edit-event.error.update':
    "Errore durante l'aggiornamento della transazione: {error}",
  'account.edit-event.error.delete':
    "Errore durante l'eliminazione della transazione: {error}",
  'account.edit-event.delete-confirm.title': 'Elimina {type}',
  'account.edit-event.delete-confirm.message':
    'Sei sicuro di voler eliminare questo {type} di {amount} del {date}?',
  'account.edit-event.delete-confirm.warning':
    'Questa azione non può essere annullata.',
  'account.edit.title': 'Modifica conto',
  'account.edit.convert.discard-title': 'Scartare le modifiche non salvate?',
  'account.edit.convert.discard-message':
    'La configurazione della challenge si apre in una finestra a parte e chiude questo modulo. Le modifiche fatte qui non verranno salvate.',
  'account.edit.convert.discard-confirm': 'Scarta e continua',
  'account.edit.field.name': 'Nome del conto',
  'account.edit.field.name-desc': 'Il nome univoco di questo conto',
  'account.edit.placeholder.name': 'es. Il mio conto di trading',
  'account.edit.field.type': 'Tipo di conto',
  'account.edit.field.type-desc': 'Tipo di conto di trading',
  'account.edit.type.demo': 'Demo',
  'account.edit.type.evaluation': 'Valutazione',
  'account.edit.type.funded': 'Finanziato',
  'account.edit.field.initial-balance': 'Saldo iniziale',
  'account.edit.field.initial-balance-desc': 'Saldo iniziale del conto',
  'account.edit.field.live-balance': 'Saldo attuale',
  'account.edit.field.live-balance-desc':
    'Saldo attuale del conto presso il broker',
  'account.edit.field.creation-date': 'Data di creazione',
  'account.edit.field.creation-date-desc': 'Quando è stato creato il conto',
  'account.edit.field.currency': 'Valuta',
  'account.edit.field.currency-desc':
    'Valuta nativa del conto per la visualizzazione',
  'account.edit.field.drawdown-type': 'Tipo di Drawdown',

  'account.edit.field.drawdown-amount': 'Importo Drawdown',
  'account.edit.field.drawdown-amount-desc':
    'Perdita massima consentita dal saldo iniziale',
  'account.edit.field.manual-snapshots': 'Snapshot Drawdown manuale',
  'account.edit.field.manual-snapshots-desc':
    'Gestisci gli snapshot del saldo giornaliero per il calcolo del Drawdown EOD Trailing',
  'account.edit.field.profit-target-desc':
    'Imposta un obiettivo di profitto per il conto',
  'account.edit.field.monthly-cost': 'Costo mensile',
  'account.edit.field.monthly-cost-desc':
    'Abbonamenti, costi della piattaforma',
  'account.copy-trading.title': 'Copy Trading',
  'account.copy-trading.description':
    'Deriva le prestazioni di questo conto da un altro conto usando i periodi storici di copy trading.',
  'account.copy-trading.enable': 'Questo conto copia un altro conto',
  'account.copy-trading.existing-trades-warning':
    'Questo conto ha già operazioni dirette. Resteranno, e le operazioni copiate verranno aggiunte dalla data di inizio selezionata.',
  'account.copy-trading.base-account': 'Conto base',
  'account.copy-trading.base-account-desc':
    'Puoi selezionare solo conti non-copia con la stessa valuta.',
  'account.copy-trading.base-account-placeholder': 'Seleziona conto base',
  'account.copy-trading.multiplier': 'Moltiplicatore',
  'account.copy-trading.multiplier-desc':
    'Intervallo consentito: da 0.1x a 100x',
  'account.copy-trading.all-history': 'Copia tutte le operazioni storiche',
  'account.copy-trading.start-date': 'Copia dalla data',
  'account.copy-trading.history': 'Cronologia copy trading',
  'account.copy-trading.error.base-required':
    'Seleziona un conto base per il Copy trading.',
  'account.copy-trading.error.multiplier-range':
    'Il moltiplicatore del Copy trading deve essere tra 0.1x e 100x.',
  'account.copy-trading.error.start-date-required':
    'Seleziona una data di inizio del Copy trading.',
  'account.copy-trading.error.base-account-is-copied':
    'Questo conto è già usato come conto base e non può copiare un altro conto.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'Questo conto è attualmente la base di un altro conto copia.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'I conti base non possono essere anche conti copia.',
  'account.edit.field.target-type': 'Tipo di obiettivo',
  'account.edit.field.target-type-desc': 'Assoluto o percentuale',
  'account.edit.field.target-percent': 'Obiettivo (%)',
  'account.edit.field.target-dollar': 'Obiettivo ($)',
  'account.edit.field.target-percent-desc':
    'Obiettivo di guadagno in percentuale',
  'account.edit.field.target-dollar-desc': 'Obiettivo in importo',
  'account.edit.field.target-date': 'Data obiettivo (facoltativa)',
  'account.edit.field.target-date-desc':
    "Data per raggiungere l'obiettivo di profitto",
  'account.edit.button.show-snapshots':
    'Mostra il gestore delle istantanee ({count} registrate)',
  'account.edit.button.hide-snapshots':
    'Nascondi il gestore delle istantanee ({count} registrate)',
  'account.edit.delete-warning':
    "Questa è un'azione permanente che non può essere annullata!",
  'account.drawdown.none': 'Nessuno',
  'account.drawdown.fixed': 'Fisso',
  'account.drawdown.eod-trailing': 'EOD Trailing',
  'account.drawdown.manual': 'Manuale',
  'account.profit-target.enable': 'Attiva obiettivo di profitto',
  'account.profit-target.type.absolute': 'Importo assoluto',
  'account.profit-target.type.percentage': 'Percentuale',
  'account.create.button.creating': 'Creazione...',
  'account.create.button.create': 'Crea conto',
  'account.edit.button.saving': 'Salvataggio...',
  'account.edit.button.save': 'Salva modifiche',
  'account.edit.button.delete': 'Elimina conto',
  'account.edit.button.delete-name': 'Elimina "{name}"',
  'account.edit.modal.update-notes.title': 'Aggiornare le note collegate?',
  'account.edit.modal.update-notes.message':
    'La rinomina aggiornerà tutte le note che fanno riferimento a "{oldName}" in "{newName}". È necessario per mantenere i dati coerenti.',
  'account.edit.modal.update-notes.yes': 'OK (aggiorna note)',
  'account.edit.modal.update-notes.no': 'Mantieni il nome precedente',
  'account.edit.modal.update-notes.cancel': 'Annulla azione',
  'account.edit.modal.change-date.title': 'Cambia data di creazione',
  'account.edit.modal.change-date.message':
    'Stai per cambiare la data di creazione del conto "{account}" da {oldDate} a {newDate}.',
  'account.edit.modal.change-date.warning':
    "Questo aggiornerà la data della transazione di deposito iniziale e può influire sul calcolo dell'età del conto, sui cicli di fatturazione mensile e su altre metriche basate sulle date.",

  'account.edit.modal.change-date.confirm': 'Aggiorna data di creazione',
  'account.edit.modal.change-balance.title': 'Cambia saldo iniziale',
  'account.edit.modal.change-balance.message':
    'Stai per cambiare il saldo iniziale da {oldBalance} a {newBalance}.',

  'account.edit.modal.change-balance.info':
    'Questo influirà su tutti i calcoli del saldo, le percentuali di P&L, i calcoli di Drawdown e la cronologia delle transazioni.',
  'account.edit.modal.change-balance.info2':
    'Il saldo attuale verrà ricalcolato in base al nuovo saldo iniziale più tutto il P&L delle operazioni.',
  'account.edit.modal.change-balance.info3':
    "Questa modifica può influire in modo significativo sulle metriche del conto e sull'accuratezza dei dati storici.",
  'account.edit.modal.change-balance.confirm': 'Aggiorna saldo iniziale',
  'account.edit.modal.delete.title': 'Elimina conto',
  'account.edit.modal.delete.question':
    'Sei sicuro di voler eliminare definitivamente il conto "{name}"?',

  'account.edit.modal.delete.will': 'Questa azione:',
  'account.edit.modal.delete.item1':
    'Rimuoverà tutti i metadati e le impostazioni del conto',
  'account.edit.modal.delete.item2':
    'Rimuoverà i riferimenti al conto da tutte le operazioni collegate',
  'account.edit.modal.delete.item3':
    'Rimuoverà i tag conto generati automaticamente dalle note',
  'account.edit.modal.delete.delete-associated-trades':
    'Elimina anche dal vault tutte le operazioni collegate a questo conto',
  'common.note-label': 'Nota:',

  'common.backups-label': 'Backup:',
  'account.edit.error.name-required': 'Il nome del conto è obbligatorio',
  'account.edit.error.name-exists': 'Il conto "{name}" esiste già',
  'account.edit.error.creation-date-required':
    'La data di creazione è obbligatoria',
  'account.edit.error.balance-required':
    'Il saldo iniziale non può essere negativo',
  'account.edit.error.invalid-live-balance': 'Il saldo attuale non è valido',
  'account.edit.error.drawdown-required':
    "L'importo Drawdown deve essere maggiore di 0",
  'account.edit.error.future-date':
    'La data di creazione non può essere nel futuro',
  'account.edit.error.update-failed':
    "Errore durante l'aggiornamento del conto: {error}",
  'account.edit.error.service-unavailable':
    'Il servizio conti non è disponibile',
  'account.edit.error.delete-failed':
    "Errore durante l'eliminazione del conto: {error}",
  'account.edit.success.updated': 'Conto "{name}" aggiornato con successo',
  'account.edit.success.updated-with-references':
    'Conto aggiornato da "{oldName}" a "{newName}" e tutti i riferimenti nelle note aggiornati',
  'account.edit.success.deleted': 'Conto "{name}" eliminato con successo',
  'button.next': 'Avanti',
  'button.discard': 'Scarta',
  'guide.scroll-to-target.title': 'Scorri per continuare la guida',
  'guide.scroll-to-target.description':
    'Il passo successivo è fuori schermo. Scorri per continuare, oppure lascia che Journalit ti ci porti.',
  'guide.scroll-to-target.description-up':
    'Il passo successivo è più in alto nella pagina. Scorri in su per continuare, oppure lascia che Journalit ti ci porti.',
  'guide.scroll-to-target.description-down':
    'Il passo successivo è più in basso nella pagina. Scorri in giù per continuare, oppure lascia che Journalit ti ci porti.',
  'guide.scroll-to-target.button': 'Mostrami',
  'templateEditor.loading': 'Caricamento layout...',
  'templateEditor.mode.preview': 'Anteprima',
  'templateEditor.mode.editor': 'Editor',
  'templateEditor.built-in-badge': '(Integrato)',
  'templateEditor.built-in-notice':
    'I layout integrati non si possono modificare. Duplica questo layout o creane uno nuovo per personalizzarlo.',
  'templateEditor.unsaved-changes': 'Modifiche non salvate',
  'templateEditor.field.template-name': 'Nome del layout',
  'templateEditor.field.widgets': 'Widget ({count})',
  'templateEditor.button.add-widget': '+ Aggiungi widget',
  'templateEditor.button.widget-library-docs': 'Documentazione libreria widget',
  'templateEditor.widget.locked': 'Bloccato',
  'templateEditor.widget.select-placeholder': 'Seleziona un widget...',
  'templateEditor.widget.header-text-placeholder': "Testo dell'intestazione...",
  'templateEditor.widget.markdown-zone-text-label': 'Testo preimpostato',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'Testo da inserire nelle nuove note di revisione...',
  'templateEditor.widget.page-size': 'Dimensione pagina:',
  'templateEditor.widget.show-rating-column': 'Mostra colonna valutazione',
  'templateEditor.widget.demon-tracker.tracking-method':
    'Traccia gli errori per:',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    'Occorrenze nelle operazioni',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    "Conta ogni operazione etichettata con l'errore.",
  'templateEditor.widget.demon-tracker.tracking-method.trading-days':
    'Giorni di trading',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    'Gli errori delle operazioni e delle revisioni giornaliere vengono uniti e contano una volta per giorno di trading.',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    'Voci della revisione giornaliera',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    'Contano solo gli errori registrati nelle revisioni giornaliere.',
  'templateEditor.widget.demon-tracker.stop-after':
    'Interrompi il trading dopo:',
  'notice.error.template-save-failed': 'Impossibile salvare il layout',
  'builder.sidebar.title': 'Costruttore di layout',
  'builder.sidebar.section.trade': 'Operazione',
  'builder.sidebar.section.drc': 'DRC',
  'builder.sidebar.section.weekly': 'Settimanale',
  'builder.sidebar.section.monthly': 'Mensile',
  'builder.sidebar.section.quarterly': 'Trimestrale',
  'builder.sidebar.section.yearly': 'Annuale',
  'builder.sidebar.section.library': 'Libreria',
  'builder.sidebar.new-item': 'Nuovo {title}',
  'builder.sidebar.coming-soon': 'Prossimamente',
  'builder.sidebar.built-in': 'Integrato',
  'builder.sidebar.default-template': 'Layout predefinito',
  'builder.sidebar.set-as-default': 'Imposta come predefinito',
  'builder.sidebar.duplicate': 'Duplica',
  'builder.sidebar.delete': 'Elimina',
  'builder.sidebar.no-templates': 'Nessun layout ancora',
  'builder.sidebar.share-template': 'Condividi layout',
  'builder.sidebar.new-template-name': 'Nuovo layout {type}',
  'builder.sidebar.copy-suffix': '(Copia)',
  'notice.default-trade-template-updated':
    'Layout operazione predefinito aggiornato',
  'notice.trade-template-duplicated': 'Layout operazione duplicato',
  'notice.trade-template-deleted': 'Layout operazione eliminato',
  'notice.error.create-template': 'Impossibile creare il layout',
  'notice.error.duplicate-template': 'Impossibile duplicare il layout',
  'notice.error.delete-template': 'Impossibile eliminare il layout',
  'account.weight-legend.aria-label': 'Legenda distribuzione tipi di conto',
  'account.weight-legend.item-aria-label': '{name}: {percent}',
  'account.transaction.deposit': 'Deposito',
  'account.transaction.withdrawal': 'Prelievo',
  'account.transaction.click-to-edit':
    'Fai clic per modificare o eliminare questa transazione',
  'account.deposits-withdrawals.title': 'Depositi e prelievi ({count})',
  'account.deposits-withdrawals.empty':
    'Nessun deposito o prelievo manuale registrato.',
  'account.deposits-withdrawals.empty-sub':
    "Fai clic sul pulsante + nell'intestazione per aggiungere la prima transazione.",
  'settings.reset.modal.title': 'Ripristinare le impostazioni predefinite?',
  'settings.reset.modal.explanation':
    'Questo ripristinerà TUTTE le impostazioni del plugin ai valori predefiniti. Include:',
  'settings.reset.modal.item-custom-options':
    'Tutte le opzioni personalizzate (simboli, setup, errori)',
  'settings.reset.modal.item-account-settings':
    'Impostazioni e metadati dei conti',
  'settings.reset.modal.item-dashboard-layouts': 'Layout della Dashboard',
  'settings.reset.modal.item-symbol-mappings': 'Mappature dei simboli',
  'settings.reset.modal.item-csv-templates': 'Modelli CSV',
  'settings.reset.modal.item-other': 'Tutte le altre personalizzazioni',
  'settings.reset.modal.backup-note':
    'Verrà creato un backup prima del ripristino.',
  'settings.reset.modal.warning':
    'Questa azione non può essere annullata (se non ripristinando dal backup).',
  'settings.reset.backup-failed.title': 'Backup non riuscito',
  'settings.reset.backup-failed.message':
    'Impossibile creare un backup delle impostazioni attuali.',
  'settings.reset.backup-failed.warning':
    'Se procedi con il ripristino, non potrai recuperare le impostazioni attuali.',
  'notice.settings-reset-with-backup':
    'Impostazioni ripristinate ai valori predefiniti. È stato creato un backup. Riavvia Obsidian per applicare tutte le modifiche.',
  'notice.settings-reset-no-backup':
    'Impostazioni ripristinate ai valori predefiniti. Non è stato creato un backup. Riavvia Obsidian per applicare tutte le modifiche.',
  'home.quick-links.hide': 'Nascondi collegamento rapido',
  'home.quick-links.add-trade': 'Aggiungi operazione',
  'home.quick-links.trade-log': 'Registro operazioni',
  'home.quick-links.trading-dashboard': 'Dashboard',
  'home.quick-links.account-dashboard': 'Conti',
  'home.quick-links.todays-drc': 'DRC di oggi',
  'home.quick-links.weekly-review': 'Revisione di questa settimana',
  'home.quick-links.monthly-review': 'Revisione di questo mese',
  'home.quick-links.quarterly-review': 'Revisione di questo trimestre',
  'home.quick-links.yearly-review': "Revisione di quest'anno",
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'Costruttore di layout',
  'home.quick-links.navigation-sidebar': 'Barra laterale',
  'home.quick-links.session-mode': 'Modalità sessione',
  'home.quick-links.move-above': 'Sposta i collegamenti rapidi sopra i widget',
  'home.quick-links.move-below': 'Sposta i collegamenti rapidi sotto i widget',
  'home.widget-selector.title': 'Aggiungi a Home',
  'home.widget-selector.subtitle':
    "Sfoglia i widget tramite l'anteprima e fai clic su uno per aggiungerlo alla Home.",
  'home.widget-selector.sample-note.title': 'Piano di trading',
  'home.widget-selector.sample-note.intro':
    'Opera solo setup A+ sui livelli chiave. Max 3 operazioni al giorno.',
  'home.widget-selector.sample-note.checklist':
    'Lista di controllo pre-apertura',
  'home.widget-selector.sample-note.task.calendar':
    'Controllare il calendario economico',
  'home.widget-selector.sample-note.task.levels':
    'Segnare i livelli chiave sul grafico',
  'home.widget-selector.sample-note.task.max-loss':
    'Impostare la perdita giornaliera massima',
  'home.widget-selector.sample-note.task.journal':
    'Registrare la prima operazione',
  'home.widget-selector.tab.performance': 'Rendimento',
  'home.widget-selector.tab.accounts': 'Conti',
  'home.widget-selector.tab.workflow': 'Flusso di lavoro',
  'home.widget-selector.section.quick-links': 'Collegamenti rapidi',
  'home.widget-selector.restore': 'ripristina',
  'home.widget-selector.add-shortcut': 'Aggiungi collegamento conto/setup',
  'home.period.month': 'Mese',
  'home.period.quarter': 'Trimestre',
  'home.period.year': 'Anno',
  'home.period.lifetime': 'Tutto lo storico',

  'home.aria.filter-trade-types': 'Filtra tipi di operazione',
  'home.aria.open-settings': 'Apri le impostazioni di Journalit',
  'home.aria.save-layout': 'Salva layout',
  'home.aria.customize': 'Personalizza',
  'home.button.add-widget': 'Aggiungi widget',

  'home.greeting.welcome': 'Benvenuto su Journalit!',
  'home.greeting.hey': 'Ehi',
  'home.greeting.nightowl': 'Ehi, nottambulo',
  'home.greeting.still-up': 'ancora sveglio?',
  'home.greeting.late-night': 'sessione notturna?',
  'home.greeting.midnight-oil': "ancora al lavoro a quest'ora?",
  'home.greeting.good-morning': 'Buongiorno',
  'home.greeting.rise-and-shine': 'Sveglia, è ora',
  'home.greeting.morning-trader': 'Buongiorno trader',
  'home.greeting.ready-conquer': 'pronto a conquistare la giornata?',
  'home.greeting.fresh-start': 'Nuovo inizio',
  'home.greeting.good-afternoon': 'Buon pomeriggio',
  'home.greeting.day-going-well': 'Spero che la giornata stia andando bene',
  'home.greeting.afternoon-checkin': 'Punto della situazione pomeridiano',
  'home.greeting.midday-momentum': 'Momentum di metà giornata',
  'home.greeting.hows-it-going': 'come va?',
  'home.greeting.good-evening': 'Buonasera',
  'home.greeting.winding-down': 'stai chiudendo?',
  'home.greeting.evening-review': 'Revisione serale',
  'home.greeting.how-did-today-go': "com'è andata oggi?",
  'home.greeting.time-to-reflect': 'Tempo di riflettere',
  'home.greeting.welcome-back': 'Bentornato',
  'home.greeting.name-placeholder': 'Il tuo nome',
  'home.greeting.edit-name-aria': '{name}. Modifica nome visualizzato',
  'home.greeting.hey-there': 'Ehi',
  'home.greeting.good-to-see-you': 'Che bello vederti',
  'home.subtitle.first-time': 'Iniziamo il tuo percorso di trading',
  'home.subtitle.see-how-doing': 'Vediamo come sta andando',
  'home.subtitle.elevate-trading':
    'È il momento di alzare il livello del tuo trading',
  'home.subtitle.journey-continues': 'Il tuo percorso di trading continua',
  'home.subtitle.check-progress': 'Controlliamo i tuoi progressi',
  'home.subtitle.ready-elevate': 'Pronto ad alzare il livello del tuo trading?',
  'home.subtitle.agenda-today': "Cosa c'è in agenda oggi?",
  'home.subtitle.trading-going': 'Come va il tuo trading?',
  'home.grid.error.title': 'Errore layout griglia',
  'home.grid.error.message': 'Errore: {error}',
  'home.grid.error.retry': 'Riprova',
  'home.grid.widget.remove-aria': 'Rimuovi widget',
  'home.grid.widget.unknown-type': 'Tipo di widget sconosciuto: {widgetId}',
  'home.widget.unreviewed.all-reviewed': 'Tutte le operazioni revisionate',
  'home.widget.unreviewed.title-review':
    'Apri il Registro operazioni per revisionare',
  'home.widget.unreviewed.need-review.one': '{count} operazione da revisionare',
  'home.widget.unreviewed.need-review.few': '{count} operazioni da revisionare',
  'home.widget.unreviewed.need-review.many':
    '{count} operazioni da revisionare',
  'home.widget.unreviewed.need-review.other':
    '{count} operazioni da revisionare',
  'home.widget.unreviewed.today': '{count} oggi',
  'home.widget.unreviewed.this-week': '{count} questa settimana',
  'home.widget.embedded-note.title': 'Nota incorporata',
  'home.widget.embedded-note.select-note': 'Seleziona una nota',
  'home.widget.embedded-note.search-placeholder': 'Cerca note...',
  'home.widget.embedded-note.no-notes': 'Nessuna nota trovata',

  'home.widget.embedded-note.open-note': 'Fai clic per aprire la nota',
  'home.widget.embedded-note.change-note': 'Cambia nota',
  'home.widget.embedded-note.error.not-found': 'File non trovato: {path}',
  'home.widget.embedded-note.error.load-failed':
    'Impossibile caricare il contenuto della nota',
  'home.widget.embedded-note.error.deleted':
    'Il file di origine è stato eliminato',
  'home.widget.goals-progress.type.pnl': 'Target P&L',
  'home.widget.goals-progress.type.pnl-desc':
    'Obiettivo di profitto/perdita per un periodo',
  'home.widget.goals-progress.type.trades-logged': 'Numero di operazioni',
  'home.widget.goals-progress.type.trades-logged-desc':
    'Numero di operazioni complessivo',
  'home.widget.goals-progress.type.win-rate': 'Tasso di vincita',
  'home.widget.goals-progress.type.win-rate-desc':
    'Target di percentuale di vincita',
  'home.widget.goals-progress.period.daily': 'Giornaliero',
  'home.widget.goals-progress.period.weekly': 'Settimanale',
  'home.widget.goals-progress.period.monthly': 'Mensile',
  'home.widget.goals-progress.period-label.today': 'oggi',
  'home.widget.goals-progress.period-label.this-week': 'questa settimana',
  'home.widget.goals-progress.period-label.this-month': 'questo mese',
  'home.widget.goals-progress.period-label.total': 'totale',
  'home.widget.goals-progress.trades-count': '{count} operazioni',
  'home.widget.goals-progress.set-goal': 'Imposta obiettivo',
  'home.widget.goals-progress.target': 'Target',
  'home.widget.goals-progress.tracks-lifetime':
    'Monitora il totale complessivo',
  'home.widget.goals-progress.use-r-multiples': 'Usa R-multiple',
  'home.widget.goals-progress.account-aware': 'Target per conto',
  'home.widget.goals-progress.no-target-selected':
    'Nessun target per il conto selezionato',
  'home.widget.goals-progress.configured-for': 'Configurato per {accounts}',
  'home.widget.goals-progress.account-scope': 'Ambito conti',
  'home.widget.goals-progress.add-account': 'Aggiungi conto',
  'home.widget.goals-progress.click-to-set':
    'Fai clic per impostare un obiettivo',
  'home.widget.goals-progress.header.pnl': 'Obiettivo P&L',
  'home.widget.goals-progress.header.trades': 'Obiettivo operazioni',
  'home.widget.goals-progress.header.win-rate': 'Obiettivo tasso di vincita',
  'home.widget.goals-progress.of-target': 'su {target} {period}',
  'home.widget.goals-progress.complete-100': '100% completato',
  'home.widget.goals-progress.complete-percent': '{percent}% completato',
  'home.widget.goals-progress.goal-reached': 'Obiettivo raggiunto',
  'home.widget.goals-progress.aria.save-goal': 'Salva obiettivo',
  'home.widget.goals-progress.aria.set-goal': 'Imposta un obiettivo',
  'home.widget.goals-progress.aria.change-goal':
    'Fai clic per cambiare obiettivo',
  'home.widget.best-hours.title': 'Ore migliori',
  'home.widget.best-hours.no-data': 'Nessun dato sulle operazioni',
  'home.widget.best-hours.period-aria':
    '{label}: {pnl} P&L medio per operazione, {count} operazioni',
  'home.widget.best-hours.trades-count': '{count} operazioni',
  'home.widget.best-hours.win-rate': '{rate}% di vincite',
  'home.widget.best-hours.win-rate-na': 'Tasso di vincita non disponibile',
  'home.widget.best-hours.days-count': '{count} giorni',
  'home.widget.best-hours.avg-per-trade': 'media/operazione',

  'home.widget.best-hours.hidden': 'Nascosto',
  'home.widget.best-hours.hidden-detail': 'Modalità privacy',
  'home.widget.best-hours.no-positive-window': 'Nessuna finestra positiva',
  'home.widget.best-hours.insufficient-history': 'Servono più dati',
  'home.widget.best-hours.sample-requirement': '{count}/2 finestre campionate',
  'home.widget.best-hours.developing': 'in sviluppo',
  'home.widget.best-hours.no-positive-detail':
    'Le finestre campionate sono negative',

  'home.widget.aum.title': 'AUM',
  'home.widget.aum.period.month': 'Questo mese',
  'home.widget.aum.period.quarter': 'Questo trimestre',
  'home.widget.aum.period.year': "Quest'anno",
  'home.widget.aum.period.all': 'Tutto lo storico',
  'home.widget.aum.unable-to-load': 'Impossibile caricare',
  'home.widget.aum.no-accounts': 'Nessun conto',
  'home.widget.aum.account-count': '{count} conto',
  'home.widget.aum.account-count-plural': '{count} conti',
  'home.widget.streak.title': 'Serie',
  'home.widget.streak.kind.trade-outcome': 'Esiti delle operazioni',
  'home.widget.streak.kind.trade-review': 'Revisioni delle operazioni',
  'home.widget.streak.kind.drc-review': 'Revisioni DRC',
  'home.widget.streak.kind.weekly-review': 'Revisioni settimanali',
  'home.widget.streak.kind.monthly-review': 'Revisioni mensili',
  'home.widget.streak.configure': 'Scegli il tipo di serie',
  'home.widget.streak.configure-aria': 'Configura la serie {kind}',
  'home.widget.streak.period.month': 'questo mese',
  'home.widget.streak.period.quarter': 'questo trimestre',
  'home.widget.streak.period.year': "quest'anno",
  'home.widget.streak.period.ever': 'di sempre',
  'home.widget.streak.win': 'vincita',
  'home.widget.streak.wins': 'vincite',
  'home.widget.streak.loss': 'perdita',
  'home.widget.streak.losses': 'perdite',
  'home.widget.streak.in-a-row': 'di fila',
  'home.widget.streak.no-active': 'nessuna serie attiva',
  'home.widget.streak.start-trading':
    'inizia a fare trading per costruire una serie',
  'home.widget.streak.no-review-streak': 'nessuna serie di revisioni attiva',
  'home.widget.streak.start-reviewing':
    'inizia a revisionare per creare una serie',
  'home.widget.streak.keep-reviewing': 'continua a revisionare per proseguire',
  'home.widget.streak.reviewed-trades-in-a-row.one':
    'operazione revisionata di fila',
  'home.widget.streak.reviewed-trades-in-a-row.few':
    'operazioni revisionate di fila',
  'home.widget.streak.reviewed-trades-in-a-row.many':
    'operazioni revisionate di fila',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'operazioni revisionate di fila',
  'home.widget.streak.reviewed-days-in-a-row.one': 'giorno revisionato di fila',
  'home.widget.streak.reviewed-days-in-a-row.few': 'giorni revisionati di fila',
  'home.widget.streak.reviewed-days-in-a-row.many':
    'giorni revisionati di fila',
  'home.widget.streak.reviewed-days-in-a-row.other':
    'giorni revisionati di fila',
  'home.widget.streak.reviewed-weeks-in-a-row.one':
    'settimana revisionata di fila',
  'home.widget.streak.reviewed-weeks-in-a-row.few':
    'settimane revisionate di fila',
  'home.widget.streak.reviewed-weeks-in-a-row.many':
    'settimane revisionate di fila',
  'home.widget.streak.reviewed-weeks-in-a-row.other':
    'settimane revisionate di fila',
  'home.widget.streak.reviewed-months-in-a-row.one': 'mese revisionato di fila',
  'home.widget.streak.reviewed-months-in-a-row.few': 'mesi revisionati di fila',
  'home.widget.streak.reviewed-months-in-a-row.many':
    'mesi revisionati di fila',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'mesi revisionati di fila',
  'home.widget.streak.missed-trades.one':
    'revisione saltata per {count} operazione dalla tua ultima revisione',
  'home.widget.streak.missed-trades.few':
    'revisione saltata per {count} operazioni dalla tua ultima revisione',
  'home.widget.streak.missed-trades.many':
    'revisione saltata per {count} operazioni dalla tua ultima revisione',
  'home.widget.streak.missed-trades.other':
    'revisione saltata per {count} operazioni dalla tua ultima revisione',
  'home.widget.streak.missed-days.one':
    'revisione saltata per {count} giorno dalla tua ultima revisione',
  'home.widget.streak.missed-days.few':
    'revisione saltata per {count} giorni dalla tua ultima revisione',
  'home.widget.streak.missed-days.many':
    'revisione saltata per {count} giorni dalla tua ultima revisione',
  'home.widget.streak.missed-days.other':
    'revisione saltata per {count} giorni dalla tua ultima revisione',
  'home.widget.streak.missed-weeks.one':
    'revisione saltata per {count} settimana dalla tua ultima revisione',
  'home.widget.streak.missed-weeks.few':
    'revisione saltata per {count} settimane dalla tua ultima revisione',
  'home.widget.streak.missed-weeks.many':
    'revisione saltata per {count} settimane dalla tua ultima revisione',
  'home.widget.streak.missed-weeks.other':
    'revisione saltata per {count} settimane dalla tua ultima revisione',
  'home.widget.streak.missed-months.one':
    'revisione saltata per {count} mese dalla tua ultima revisione',
  'home.widget.streak.missed-months.few':
    'revisione saltata per {count} mesi dalla tua ultima revisione',
  'home.widget.streak.missed-months.many':
    'revisione saltata per {count} mesi dalla tua ultima revisione',
  'home.widget.streak.missed-months.other':
    'revisione saltata per {count} mesi dalla tua ultima revisione',
  'home.widget.streak.best-streak': 'la tua migliore serie {period}',
  'home.widget.streak.above-average': 'sopra la tua media {period}',
  'home.widget.streak.stay-focused': 'resta concentrato, continua così',
  'home.widget.streak.keep-going': 'continua così',
  'home.widget.streak.good-start': 'buon inizio',
  'home.widget.streak.pause': 'fai una pausa prima della prossima operazione',
  'home.widget.streak.review': 'revisiona prima della prossima operazione',
  'home.widget.streak.losses-process': 'le perdite fanno parte del processo',
  'home.widget.streak.best': 'migliore',
  'home.widget.streak.avg': 'media',
  'home.widget.drawdown.title': 'Limite di drawdown',
  'home.widget.drawdown.breached': 'Superato',
  'home.widget.drawdown.remaining': 'rimanente',
  'home.widget.drawdown.unable-to-load': 'Impossibile caricare',
  'home.widget.drawdown.no-accounts': 'Nessun conto con limiti',
  'home.widget.profit-target.title': 'Target di profitto',
  'home.widget.profit-target.achieved': 'Raggiunto',
  'home.widget.profit-target.remaining': 'rimanente',
  'home.widget.profit-target.unable-to-load': 'Impossibile caricare',
  'home.widget.profit-target.no-accounts': 'Nessun conto con target',
  'home.widget.account-progress.configure-aria': 'Scegli i conti per {widget}',
  'home.widget.account-progress.config-title': 'Conti mostrati',
  'home.widget.account-progress.mode.automatic': 'Automatico',
  'home.widget.account-progress.mode.selected': 'Scegli conti',
  'home.widget.account-progress.automatic-drawdown': 'Drawdown più alto prima.',
  'home.widget.account-progress.automatic-profit-target':
    'Più vicini all’obiettivo prima.',
  'home.widget.account-progress.max-label': 'Mostra fino a',
  'home.widget.account-progress.max-all': 'Tutti',
  'home.widget.account-progress.select-hint': 'Scegline quanti vuoi.',
  'home.widget.account-progress.no-eligible':
    'Ancora nessun conto da scegliere.',
  'home.widget.account-progress.none-selected':
    'Nessun conto scelto. Fai clic per scegliere.',
  'home.widget.account-progress.search': 'Cerca conti',
  'home.widget.account-progress.select-all': 'Tutti',
  'home.widget.account-progress.select-none': 'Nessuno',
  'home.widget.account-progress.select-all-aria':
    'Scegli tutti i conti mostrati',
  'home.widget.account-progress.select-none-aria':
    'Deseleziona i conti mostrati',
  'home.widget.account-progress.no-match': 'Nessun conto corrisponde.',
  'home.widget.account-progress.none-available':
    'Nessuno dei conti scelti può essere mostrato. Fai clic per sceglierne altri.',
  'home.widget.recent.title': 'Recenti',
  'home.widget.recent.unknown': 'Sconosciuto',
  'home.widget.recent.just-now': 'Proprio ora',
  'home.widget.recent.minutes-ago': '{minutes}m fa',
  'home.widget.recent.hours-ago': '{hours}h fa',
  'home.widget.recent.days-ago': '{days}g fa',
  'home.widget.recent.no-items': 'Nessun elemento recente',
  'home.widget.recent.hint': 'Apri file o viste per vederli qui',
  'home.widget.top-breakdown.title': 'Migliori {dimension}',
  'home.widget.top-breakdown.configure-title':
    'Personalizza i migliori {dimension}',
  'home.widget.top-breakdown.aria.customize':
    'Fai clic per personalizzare i migliori {dimension}',
  'home.widget.setups.title': 'Migliori setup',

  'home.widget.setups.trades-count': '{count} operazioni',
  'home.widget.setups.win-rate': '{rate}% tasso di vincita',
  'home.widget.weekly.title': 'Questa settimana',
  'home.widget.weekly.no-trades': 'nessuna operazione questa settimana',
  'home.widget.weekly.breakeven': 'in pareggio finora questa settimana',
  'home.widget.weekly.losing-days': '{count} giorni in perdita di fila',
  'home.widget.weekly.winning-days': '{count} giorni vincenti di fila',
  'home.widget.weekly.above-average': 'sopra la tua media settimanale',
  'home.widget.weekly.below-average': 'sotto la tua media settimanale',
  'home.widget.weekly.better-than-last': 'meglio della scorsa settimana',
  'home.widget.weekly.slower-than-last': 'più lento della scorsa settimana',
  'home.widget.weekly.on-track': 'in linea questa settimana',
  'home.widget.weekly.room-to-recover': 'spazio per recuperare',
  'home.widget.weekly.solid-start': 'buon inizio di settimana',
  'home.widget.weekly.early-in-week': 'inizio settimana',
  'home.widget.weekly.no-trade-data': 'Nessun dato sulle operazioni',
  'home.widget.weekly.trade': 'operazione',
  'home.widget.weekly.trades': 'operazioni',
  'home.widget.weekly.no-trades-tooltip': 'nessuna operazione',
  'home.widget.heatmap.last-3-months': 'Ultimi 3 mesi',
  'home.widget.heatmap.last-6-months': 'Ultimi 6 mesi',
  'home.widget.heatmap.year-activity': 'Attività {year}',
  'home.widget.heatmap.select-year': 'Seleziona anno',
  'home.widget.heatmap.close-selector': 'Chiudi selettore anno',
  'calendar.weekday.mon': 'Lun',
  'calendar.weekday.tue': 'Mar',
  'calendar.weekday.wed': 'Mer',
  'calendar.weekday.thu': 'Gio',
  'calendar.weekday.fri': 'Ven',
  'calendar.weekday.sat': 'Sab',
  'calendar.weekday.sun': 'Dom',
  'calendar.pnl': 'P&L',
  'calendar.week': 'SETTIMANA',
  'calendar.trade': '{count} operazione',
  'calendar.trades': '{count} operazioni',
  'calendar.reviewed': 'Revisionata',
  'calendar.month.january': 'Gennaio',
  'calendar.month.february': 'Febbraio',
  'calendar.month.march': 'Marzo',
  'calendar.month.april': 'Aprile',
  'calendar.month.june': 'Giugno',
  'calendar.month.july': 'Luglio',
  'calendar.month.august': 'Agosto',
  'calendar.month.september': 'Settembre',
  'calendar.month.october': 'Ottobre',
  'calendar.month.november': 'Novembre',
  'calendar.month.december': 'Dicembre',

  'shared.collapsible.active-filters': '{count} filtri attivi',
  'filter.modal.no-setup': 'Nessun Setup',
  'filter.modal.no-tags': 'Nessun tag',
  'filter.modal.no-mistakes': 'Nessun errore',
  'filter.modal.type.regular': 'Regolare',
  'filter.modal.type.backtest': 'Backtest',
  'filter.summary.regular-trades': 'Operazioni regolari',
  'filter.modal.status.breakeven': 'Pareggio',

  'filter.modal.review-status.reviewed': 'Revisionata',
  'filter.modal.review-status.unreviewed': 'Non revisionata',
  'filter.modal.direction.long-call': 'Long/Call',
  'filter.modal.direction.short-put': 'Short/Put',
  'filter.modal.section.custom-fields': 'Campi personalizzati',
  'filter.modal.custom-field.none-available': 'Nessun valore disponibile',
  'widget.checklist.title': 'Lista di controllo pre-operazione',
  'widget.checklist.weekly-title':
    'Lista di controllo settimanale pre-sessione',
  'widget.checklist.tooltip.day-only':
    'Gli elementi aggiunti qui valgono solo per questo giorno.',
  'widget.checklist.tooltip.weekly':
    'Gli elementi aggiunti qui valgono solo per questa settimana.',
  'widget.checklist.tooltip.settings-link':
    'Per gli elementi ricorrenti su tutti i nuovi DRC, vai su Impostazioni > Revisioni.',
  'widget.checklist.tooltip.weekly-settings-link':
    'Per gli elementi ricorrenti su tutte le nuove revisioni settimanali, vai su Impostazioni > Revisioni.',
  'widget.checklist.completed': 'completati',
  'widget.checklist.edit-item': 'Modifica elemento',
  'widget.checklist.delete-item': 'Elimina elemento',
  'widget.checklist.empty.preview':
    'Nessun elemento della lista di controllo configurato',
  'widget.checklist.empty.add-one':
    'Nessun elemento nella lista di controllo. Aggiungine uno qui sotto.',
  'widget.checklist.placeholder':
    'Aggiungi un nuovo elemento alla lista di controllo...',
  'widget.checklist.invalid-context':
    "Il widget Lista di controllo richiede una nota DRC o Revisione settimanale (tipo frontmatter: 'drc' o 'weekly-review')",
  'widget.session-mistakes.title': 'Errori di sessione',
  'widget.session-mistakes.subtitle':
    'Registra gli errori una volta per la sessione invece di ripeterli su ogni operazione.',

  'widget.session-mistakes.placeholder': 'Seleziona o crea errori',
  'widget.session-mistakes.empty': 'Nessun errore di sessione registrato',

  'widget.session-mistakes.invalid-context':
    "Il Widget Errori di sessione richiede una nota DRC (tipo frontmatter: 'drc')",
  'widget.directional-pnl.title.long': 'P&L operazioni Long',
  'widget.directional-pnl.title.short': 'P&L operazioni Short',
  'widget.directional-pnl.empty.not-enough':
    "Operazioni insufficienti per l'analisi direzionale",
  'widget.directional-pnl.empty.no-closed':
    'Nessuna operazione chiusa in questo periodo',
  'widget.directional-pnl.empty.no-long':
    'Nessuna operazione Long in questo periodo',
  'widget.directional-pnl.empty.no-short':
    'Nessuna operazione Short in questo periodo',
  'widget.directional-drawdown.title.long': 'Long Drawdown',
  'widget.directional-drawdown.title.short': 'Short Drawdown',
  'widget.directional-drawdown.empty.not-enough':
    "Operazioni chiuse insufficienti per l'analisi direzionale",
  'widget.directional-drawdown.empty.no-closed':
    'Nessuna operazione direzionale chiusa in questo periodo',
  'widget.directional-drawdown.empty.no-long':
    'Nessuna operazione Long chiusa in questo periodo',
  'widget.directional-drawdown.empty.no-short':
    'Nessuna operazione Short chiusa in questo periodo',
  'widget.missed-trades.title': 'Operazioni perse',
  'widget.missed-trades.add-button': 'Aggiungi',
  'widget.missed-trades.add-aria': 'Aggiungi operazione persa',

  'widget.missed-trades.additional-setups': 'Setup aggiuntivi:',
  'widget.missed-trades.no-trades-today': 'Nessuna oggi',
  'widget.missed-trades.no-trades-week':
    'Nessuna operazione persa questa settimana',
  'widget.missed-trades.invalid-context':
    'Il Widget Operazioni perse è disponibile solo nelle note DRC e Revisione settimanale.',
  'widget.missed-trades.error-no-date':
    'Impossibile determinare la data per la nuova operazione persa',
  'widget.missed-trades.error-open-form':
    'Apertura del modulo operazione persa non riuscita',
  'widget.backtest-trades.empty':
    'Nessuna operazione di Backtest in questo periodo',
  'widget.trade-table.column.images': 'Immagini',
  'widget.trade-table.column.date': 'Data',
  'widget.trade-table.column.entry': 'Ingresso',
  'widget.trade-table.column.ticker': 'Simbolo',
  'widget.trade-table.column.account': 'Conto',
  'widget.trade-table.column.pnl': 'P&L',
  'widget.trade-table.column.direction': 'Direzione',
  'widget.trade-table.column.setups': 'Setup',
  'widget.trade-table.column.mistakes': 'Errori',
  'widget.trade-table.empty': 'Nessuna operazione in questo periodo',
  'widget.trade-table.status.open': 'APERTA',
  'widget.trade-table.na': 'N/A',
  'widget.trade-table.unknown': 'Sconosciuto',

  'widget.trade-table.image-alt': 'Anteprima operazione {id}',
  'widget.trade-table.fullscreen-title': 'Immagine operazione {id}',
  'widget.trade-table.fullscreen-alt': 'Immagine operazione {id} {index}',
  'widget.trade-table.duration.days-hours': '{days}g {hours}h',
  'widget.trade-table.duration.hours-mins': '{hours}h {mins}m',
  'widget.trade-table.duration.mins': '{mins}m',
  'widget.trade-table.pagination.showing':
    'Visualizzazione {start}-{end} di {total} operazioni',
  'widget.trade-table.pagination.prev': '← Prec',
  'widget.trade-table.pagination.next': 'Succ →',
  'widget.trade-table.pagination.page': 'Pagina {current} di {total}',
  'widget.pagination.showing':
    'Visualizzazione {start}-{end} di {total} {items}',
  'widget.pagination.prev': 'Prec',
  'widget.pagination.next': 'Succ',
  'widget.pagination.page': 'Pagina {current} di {total}',

  'widget.empty.no-data': 'Nessun dato disponibile',
  'widget.empty.no-trades': 'Nessuna operazione in questo periodo',
  'widget.empty.no-closed-trades':
    'Nessuna operazione chiusa in questo periodo',
  'widget.empty.no-daily-data': 'Nessun dato giornaliero in questo periodo',
  'widget.empty.no-weekly-data': 'Nessun dato settimanale in questo periodo',
  'widget.empty.no-monthly-data': 'Nessun dato mensile in questo periodo',
  'widget.empty.no-quarterly-data': 'Nessun dato trimestrale in questo periodo',
  'widget.empty.no-tag-data':
    'Nessun dato per tag disponibile in questo periodo',
  'widget.empty.no-setup-data':
    'Nessun dato per Setup disponibile in questo periodo',
  'widget.empty.no-mental-game-data':
    'Nessun dato di gioco mentale disponibile per {period}',
  'widget.empty.no-technical-game-data':
    'Nessun dato di gioco tecnico disponibile per {period}',
  'widget.invalid-context.title': 'Contesto non valido',
  'widget.invalid-context.default':
    'Questo Widget {widgetType} richiede una nota di revisione o di operazione',
  'widget.invalid-context.monthly-quarterly-yearly':
    'Questo Widget è disponibile solo nelle revisioni mensili, trimestrali e annuali',
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    'Questo Widget è disponibile solo nelle revisioni settimanali, mensili, trimestrali e annuali',
  'widget.invalid-context.quarterly-yearly':
    'Questo Widget è disponibile solo nelle revisioni trimestrali e annuali',
  'widget.invalid-context.yearly-only':
    'Questo Widget è disponibile solo nelle revisioni annuali',
  'widget.invalid-context.monthly-only':
    'Questo Widget è disponibile solo nelle revisioni mensili',
  'widget.invalid-context.weekly-monthly':
    'Questo Widget è disponibile solo nelle revisioni settimanali e mensili',
  'widget.invalid-context.review-note':
    'Questo Widget richiede una nota DRC, Revisione settimanale, Revisione mensile, Revisione trimestrale o Revisione annuale',
  'widget.key-levels.title': 'Livelli chiave',
  'widget.key-levels.support': 'Supporto',
  'widget.key-levels.resistance': 'Resistenza',
  'widget.key-levels.no-levels': 'Nessun livello definito',
  'widget.key-levels.price-placeholder': 'Prezzo...',
  'widget.key-levels.select-importance': 'Seleziona importanza',
  'widget.key-levels.remove-level': 'Rimuovi livello',
  'widget.key-levels.invalid-context':
    'Il Widget Livelli chiave richiede una nota DRC, revisione settimanale o revisione mensile',
  'widget.key-levels.source.weekly': 'Settimanale',
  'widget.key-levels.source.monthly': 'Mensile',
  'widget.key-levels.open-source-review': 'Apri la revisione {label}',
  'widget.key-levels.importance.none': 'Nessuna',
  'widget.key-levels.importance.high': 'Alta',
  'widget.key-levels.importance.medium': 'Media',
  'widget.key-levels.importance.low': 'Bassa',
  'manual-drawdown.notice.deleted': 'Snapshot eliminato',
  'manual-drawdown.notice.updated': 'Snapshot aggiornato',
  'manual-drawdown.notice.added': 'Snapshot aggiunto',
  'manual-drawdown.validation.date-required': 'La data è obbligatoria',
  'manual-drawdown.validation.invalid-date': 'Inserisci una data valida',
  'manual-drawdown.validation.future-date': 'La data non può essere nel futuro',
  'manual-drawdown.validation.limit-required':
    'Il limite di Drawdown è obbligatorio',
  'manual-drawdown.validation.limit-positive':
    'Il limite di Drawdown deve essere un numero positivo',
  'manual-drawdown.validation.duplicate-date':
    'Esiste già uno snapshot per questa data. Scegli una data diversa o modifica quello esistente.',
  'manual-drawdown.section.recorded': 'Snapshot registrati',
  'manual-drawdown.table.date': 'Data',
  'manual-drawdown.table.limit': 'Limite di Drawdown',
  'manual-drawdown.table.note': 'Nota',
  'manual-drawdown.table.actions': 'Azioni',
  'manual-drawdown.button.editing': 'Modifica in corso',
  'manual-drawdown.button.edit': 'Modifica',
  'manual-drawdown.button.delete': 'Elimina',
  'manual-drawdown.header.edit': 'Modifica snapshot',
  'manual-drawdown.header.add': 'Aggiungi nuovo snapshot',
  'manual-drawdown.field.date': 'Data Drawdown *',
  'manual-drawdown.field.date-desc': 'Quando il broker ha emesso questo limite',
  'manual-drawdown.field.limit': 'Saldo minimo ($) *',
  'manual-drawdown.field.limit-desc': 'Saldo minimo consentito',
  'manual-drawdown.field.note': 'Nota (facoltativa)',
  'manual-drawdown.field.note-desc': 'Contesto aggiuntivo per questo snapshot',
  'manual-drawdown.placeholder.note': 'es. Estratto conto di fine mese',
  'manual-drawdown.button.update': 'Aggiorna snapshot',
  'manual-drawdown.button.add': 'Aggiungi snapshot',
  'manual-drawdown.button.cancel-edit': 'Annulla modifica',
  'manual-drawdown.modal.delete-title': 'Eliminare lo snapshot?',
  'manual-drawdown.modal.delete-confirm':
    'Eliminare lo snapshot di Drawdown del {date}?',
  'manual-drawdown.modal.delete-limit': 'Limite di Drawdown: {limit}',
  'manual-drawdown.modal.delete-warning':
    'Questa azione non può essere annullata.',
  'dashboard.selector.title': 'Aggiungi alla Dashboard',
  'dashboard.selector.subtitle':
    "Sfoglia grafici e metriche tramite l'anteprima e fai clic su uno per aggiungerlo alla Dashboard.",
  'dashboard.selector.tab.performance': 'Rendimento',
  'dashboard.selector.tab.breakdowns': 'Suddivisioni',
  'dashboard.selector.tab.risk': 'Rischio e analisi',
  'widget-drawer.tab.all': 'Tutti',
  'widget-drawer.search.placeholder': 'Cerca widget',
  'widget-drawer.section.available': 'Disponibili',
  'widget-drawer.section.in-use': 'In uso',
  'widget-drawer.empty-search': 'Nessun widget corrisponde alla ricerca',
  'widget-drawer.added-count': '{count} aggiunti',
  'widget-drawer.add-aria': 'Aggiungi {name}',
  'widget-drawer.remove': 'Rimuovi',
  'widget-drawer.remove-aria': 'Rimuovi {name}',
  'widget-drawer.close': 'Chiudi',
  'dashboard.selector.metrics': 'Metriche',

  'widget.pnlChart.name': 'P&L cumulativo',
  'widget.pnlChart.description': 'P&L cumulativo nel tempo',

  'widget.longPnLChart.name': 'Long P&L',
  'widget.longPnLChart.description':
    'P&L cumulativo delle operazioni Long chiuse',
  'widget.shortPnLChart.name': 'Short P&L',
  'widget.shortPnLChart.description':
    'P&L cumulativo delle operazioni Short chiuse',
  'widget.performanceCalendar.name': 'Calendario prestazioni',
  'widget.performanceCalendar.description':
    'Calendario del tuo P&L giornaliero',

  'widget.dailyPerformance.name': 'Prestazioni giornaliere',
  'widget.dailyPerformance.description': 'P&L di ogni giorno di trading',

  'widget.tradesChart.name': 'Grafico operazioni',
  'widget.tradesChart.description': 'P&L di ogni singolo trade',

  'widget.weekdayPerformance.name': 'Prestazioni per giorno della settimana',
  'widget.weekdayPerformance.description': 'P&L per giorno della settimana',

  'widget.hourlyPerformance.name': 'Prestazioni orarie',
  'widget.hourlyPerformance.description': 'P&L per ora del giorno',

  'widget.tickerPerformance.name': 'Prestazioni per simbolo',
  'widget.tickerPerformance.description':
    'Classifica della performance per ticker',
  'widget.tradesChart.limit': '{count} operazioni',
  'widget.drawdownChart.name': 'Grafico Drawdown',
  'widget.drawdownChart.description':
    "Calo dall'ultimo massimo di P&L realizzato",

  'widget.directionalDrawdownChart.name': 'Drawdown realizzato direzionale',

  'widget.longDrawdownChart.name': 'Long Drawdown',
  'widget.longDrawdownChart.description': 'Drawdown dei soli trade long',

  'widget.shortDrawdownChart.name': 'Short Drawdown',
  'widget.shortDrawdownChart.description': 'Drawdown dei soli trade short',

  'widget.drawdownStats.no-conversion':
    'Le statistiche di Drawdown non sono disponibili per valute miste senza conversione FX.',
  'widget.recentTrades.name': 'Operazioni recenti',
  'widget.recentTrades.description':
    'Mostra le 10 operazioni più recenti con i dettagli',
  'widget.recentTrades.date': 'Data',
  'widget.recentTrades.ticker': 'Simbolo',
  'widget.recentTrades.direction': 'Direzione',
  'widget.recentTrades.pnl': 'P&L',
  'widget.recentTrades.no-trades': 'Nessuna operazione trovata',
  'widget.recentTrades.empty-submessage':
    'Prova a selezionare un intervallo di date diverso',
  'widget.recentTrades.unknown': 'Sconosciuto',
  'widget.rollingWinRate.name': 'Rapporto vincita/perdita mobile',
  'widget.rollingWinRate.description':
    'Rapporto guadagno/perdita medio recente',

  'widget.rollingStats.name': 'Vincita/perdita media mobile',
  'widget.rollingStats.description':
    'Guadagno e perdita medi dei trade recenti',

  'shared.filter.disabled-preview': 'Filtri disattivati in anteprima',
  'shared.filter.open': 'Apri filtri',
  'shared.filter.active-count': '{count} filtri attivi',
  'ui.toggle-switch.aria-label': 'Interruttore',
  'ui.folder-browser.placeholder': 'Seleziona una cartella...',
  'ui.folder-browser.root': 'Radice',
  'ui.folder-browser.clear-aria': 'Azzera per usare la posizione predefinita',
  'ui.folder-browser.expand-folder': 'Espandi cartella',
  'ui.folder-browser.collapse-folder': 'Riduci cartella',

  'combobox.placeholder.default': 'Seleziona o digita...',
  'combobox.aria.remove-item': 'Rimuovi {item}',
  'combobox.add-option': 'Aggiungi "{value}"',
  'error.render-component':
    'Errore nella visualizzazione di {component}: {error}',
  'error.session-expired':
    'La tua sessione è scaduta. Accedi di nuovo nelle impostazioni del plugin.',
  'error.ftp-not-found':
    'Credenziali FTP non trovate. Il sistema ne creerà di nuove automaticamente.',
  'error.no-trading-data':
    'Nessun dato di trading trovato. Assicurati che il tuo conto MetaTrader sia collegato correttamente e abbia uno storico operazioni.',
  'error.unable-connect-service':
    'Impossibile connettersi al servizio dati di trading. Controlla la tua connessione Internet.',
  'error.invalid-verification-code':
    'Codice di verifica non valido. Controlla il codice e riprova.',
  'error.invalid-registration-data':
    'Dati di registrazione non validi. Controlla le impostazioni e riprova.',
  'error.invalid-request':
    'Richiesta non valida. Controlla i dati inseriti e riprova.',
  'error.access-denied':
    'Accesso negato. Controlla i permessi del tuo account o contatta il supporto.',
  'error.too-many-requests':
    'Troppe richieste. Attendi un momento prima di riprovare.',
  'error.service-unavailable':
    'Il servizio dati di trading è temporaneamente non disponibile. Riprova tra qualche minuto.',
  'error.server-error':
    'Si è verificato un errore del server. Riprova più tardi o contatta il supporto se il problema persiste.',
  'error.network-error':
    'Impossibile connettersi al servizio dati di trading. Controlla la tua connessione Internet e riprova.',
  'error.unknown': 'Si è verificato un errore sconosciuto',
  'error.unexpected':
    'Si è verificato un errore imprevisto. Riprova o contatta il supporto se il problema persiste.',
  'error.settings.invalid-pattern':
    "Pattern di convalida non valido. Controlla l'espressione regolare e riprova.",
  'error.settings.field-name-conflict':
    'Questo nome di campo è in conflitto con un campo esistente. Scegli un nome diverso.',
  'error.settings.invalid-field-name':
    'Nome di campo non valido. I nomi dei campi possono contenere solo lettere, numeri e underscore.',
  'error.settings.save-failed':
    'Impossibile salvare le modifiche. Controlla le impostazioni e riprova.',
  'error.settings.load-failed':
    'Impossibile caricare le impostazioni dei campi personalizzati. I campi personalizzati potrebbero non essere visualizzati correttamente.',
  'error.settings.import-failed':
    'Impossibile importare le impostazioni dei campi. Controlla il formato del file e riprova.',
  'error.settings.create-failed':
    'Impossibile creare il campo personalizzato. Controlla i dati inseriti e riprova.',
  'error.settings.remove-failed':
    'Impossibile rimuovere il campo personalizzato. Riprova.',
  'error.settings.generic':
    'Si è verificato un errore durante la gestione dei campi personalizzati. Controlla le impostazioni e riprova.',
  'error.options.duplicate':
    'Questa opzione esiste già. Scegli un nome diverso.',
  'error.options.invalid-ticker':
    'Simbolo non valido. Usa solo lettere, numeri e punti (es. AAPL, SPX).',
  'error.options.add-ticker-failed':
    'Impossibile aggiungere il simbolo. Controlla il formato e riprova.',
  'error.options.add-failed':
    "Impossibile aggiungere l'opzione. Potrebbe già esistere o non essere valida.",
  'error.options.update-failed':
    "Impossibile aggiornare l'opzione. Potrebbe già esistere o non essere valida.",
  'error.options.remove-failed': "Impossibile rimuovere l'opzione. Riprova.",
  'error.options.no-options-reset':
    'Nessuna opzione da reimpostare. La categoria è già vuota.',
  'error.options.reset-failed': 'Impossibile reimpostare le opzioni. Riprova.',
  'error.options.save-failed':
    'Impossibile salvare le modifiche alle opzioni. Controlla le impostazioni e riprova.',
  'error.options.generic':
    'Si è verificato un errore durante la gestione delle opzioni. Riprova.',
  'error.clipboard.permission-denied':
    'Accesso agli appunti negato. Consenti i permessi degli appunti nel browser per poter incollare.',
  'error.clipboard.not-supported':
    "L'incolla dagli appunti non è supportato nel tuo browser. Prova a usare Ctrl+V o Cmd+V.",
  'error.clipboard.image-too-large':
    "L'immagine è troppo grande per essere incollata. Usa immagini più piccole di 10MB.",
  'error.clipboard.no-content':
    "Niente da incollare negli appunti. Prova prima a copiare un'immagine.",
  'error.clipboard.no-images':
    "Nessuna immagine trovata negli appunti. Assicurati di aver copiato un'immagine, non testo o altro contenuto.",
  'error.clipboard.network-error':
    "Si è verificato un errore di rete durante l'incolla. Controlla la connessione e riprova.",
  'error.clipboard.paste-failed':
    "Impossibile completare l'incolla. Prova a copiare di nuovo l'immagine e a incollarla.",
  'error.clipboard.generic':
    'Operazione degli appunti non riuscita. Prova a copiare di nuovo il contenuto e a incollarlo.',

  'datetime.aria.open-picker': 'Apri selettore data',

  'modal.template-switch.title': 'Cambiare layout?',
  'modal.template-switch.switching-from': 'Stai passando da',
  'modal.template-switch.switching-to': 'a',
  'modal.template-switch.has-content-title': 'Questa nota ha del contenuto',
  'modal.template-switch.has-content-desc':
    'Il contenuto verrà riorganizzato per adattarsi al nuovo layout. Il contenuto che non ci sta verrà conservato in fondo alla nota per la tua revisione.',
  'modal.template-switch.cannot-undo':
    'Questa azione non può essere annullata (ma puoi tornare indietro).',
  'modal.template-switch.button.switch': 'Cambia layout',

  'release-notes.title': 'Note di versione',
  'release-notes.loading-plugin': 'Caricamento del plugin...',

  'release-notes.no-content': 'Nessuna nota di versione trovata',
  'release-notes.current-version': 'Corrente: v{version}',
  'release-notes.version': 'Versione {version}',
  'release-notes.link.docs': 'Documentazione',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',
  'skeleton.tradelog.loading': 'Caricamento dei dati delle operazioni',
  'skeleton.dashboard-widget.loading': 'Caricamento dei dati del Widget',
  'skeleton.account-page.loading': 'Caricamento della pagina del conto',

  'grid.aria.remove-widget': 'Rimuovi Widget',
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'Esportazione CSV del widget Fills',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Apri il widget Fills in TT e passa alla vista Detail, Continuous o Price with Detail',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Importante:',

  'trade.metadata.broker-comment': 'Commento del broker',

  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'Calendario prestazioni',
  'navigation.section.overview': 'Panoramica',
  'navigation.section.reviews': 'Revisioni',
  'navigation.section.tools': 'Strumenti',
  'navigation.edit-mode.toggle': 'Personalizza navigazione',
  'navigation.edit-mode.hide-item': 'Nascondi voce di navigazione',
  'navigation.edit-mode.restore-section': 'Voci nascoste',
  'navigation.edit-mode.restore': 'Ripristina',
  'navigation.items.nav-settings': 'Impostazioni',
  'navigation.shortcuts.add': 'Aggiungi collegamento',
  'navigation.shortcuts.remove': 'Rimuovi collegamento',
  'navigation.shortcuts.close': 'Chiudi selettore collegamenti',
  'navigation.shortcuts.search': 'Cerca conti e strategie',
  'navigation.shortcuts.accounts': 'Conti',
  'navigation.shortcuts.setups': 'Strategie',
  'navigation.shortcuts.empty': 'Nessun conto o strategia disponibile',
  'navigation.shortcuts.unavailable': 'Non disponibile',
  'navigation.shortcuts.added': 'Aggiunto',
  'navigation.shortcuts.parent-required':
    'Rimuovi prima i collegamenti prima di nascondere questo elemento di navigazione.',
  'navigation.items.nav-home': 'Home',
  'navigation.items.nav-dashboard': 'Dashboard',
  'navigation.items.nav-trade-log': 'Registro operazioni',
  'navigation.items.nav-account-dashboard': 'Conti',
  'navigation.items.nav-drc': 'DRC di oggi',
  'navigation.items.nav-weekly': 'Revisione di questa settimana',
  'navigation.items.nav-monthly': 'Revisione di questo mese',
  'navigation.items.nav-quarterly': 'Revisione di questo trimestre',
  'navigation.items.nav-yearly': "Revisione di quest'anno",
  'navigation.items.nav-add-trade': 'Aggiungi operazione',
  'navigation.items.nav-layout-builder': 'Costruttore di layout',
  'navigation.items.nav-quick-import': 'Importazione rapida',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-session-mode': 'Modalità sessione',
  'navigation.items.nav-position-size':
    'Calcolatore della dimensione della posizione',
  'settings.general.navigation-sidebar': 'Barra laterale di navigazione',
  'notice.error.open-navigation-sidebar':
    'Impossibile aprire la barra laterale di navigazione. Riprova.',
  'navigation.setting.open': 'Apri barra laterale di navigazione',
  'navigation.setting.open.desc':
    'Mostrala ora ed espandi la barra laterale di Obsidian se è compressa.',
  'navigation.setting.open.button': 'Apri barra laterale',
  'calendar.setting.open': 'Apri calendario',
  'calendar.setting.open.button': 'Apri calendario',
  'notice.error.open-calendar-sidebar':
    'Impossibile aprire il calendario. Riprova.',
  'navigation.setting.tab-behavior':
    'Comportamento delle schede di navigazione',
  'navigation.setting.tab-behavior.desc':
    'Come aprire viste e review dalle barre laterali di Journalit',
  'navigation.setting.tab-behavior.new-tab': 'Apri in una nuova scheda',
  'navigation.setting.tab-behavior.replace': 'Sostituisci la scheda attiva',
  'navigation.search.placeholder': 'Cerca operazioni e revisioni...',
  'navigation.search.clear': 'Azzera ricerca',
  'navigation.search.section.trades': 'Operazioni',
  'navigation.search.section.reviews': 'Revisioni',
  'navigation.search.empty': 'Nessun risultato trovato',
  'navigation.search.trade-open': 'Aperta',

  'command.open-navigation-sidebar': 'Apri barra laterale di navigazione',
  'command.open-calendar-sidebar': 'Apri barra laterale del calendario',
  'widget.previous-trading-day-context.name':
    'Contesto del giorno di trading precedente',
  'widget.previous-trading-day-context.description':
    'Contesto in sola lettura preso dai titoli del DRC precedente',
  'widget.previous-trading-day-context.reference-label': 'DRC precedente',
  'widget.previous-trading-day-context.open-source': 'Apri',
  'widget.previous-trading-day-context.image-alt-prefix':
    'Immagine DRC precedente',
  'widget.previous-trading-day-context.no-sections-configured':
    'Scegli almeno una sezione nelle impostazioni del layout.',
  'widget.previous-trading-day-context.preview-note':
    "Ieri il prezzo ha spazzato la liquidità, è stato respinto dal livello settimanale e ha chiuso di nuovo all'interno del range pianificato.",
  'widget.previous-trading-day-context.preview-bullet-two':
    'Deviazione principale: ingresso prima della conferma sul primo pullback.',
  'widget.previous-trading-day-context.preview-source':
    'Anteprima: DRC precedente del giorno di trading precedente',
  'widget.previous-trading-day-context.preview-bullet-one':
    'Il bias giornaliero ha corrisposto al piano dopo la spinta di apertura.',
  'widget.weekly-drc-context.name':
    'Revisioni giornaliere per giorno della settimana',
  'widget.weekly-drc-context.description':
    'Mostra le sezioni DRC selezionate per ogni giorno nella revisione settimanale',

  'widget.weekly-drc-context.image-alt-prefix': 'Immagine DRC settimanale',
  'widget.weekly-drc-context.no-activity':
    'Nessuna attività per questo giorno.',
  'widget.weekly-drc-context.no-sections-configured':
    'Scegli almeno una sezione DRC nelle impostazioni del layout.',
  'widget.weekly-drc-context.current-week-not-found':
    'Revisione settimanale corrente non trovata.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'Data della revisione settimanale corrente non trovata.',
  'widget.weekly-drc-context.load-error':
    'Caricamento della revisione DRC settimanale non riuscito.',
  'widget.weekly-drc-context.invalid-context':
    'Questo Widget è disponibile solo nelle note di Revisione settimanale',
  'templateEditor.widget.weekly-drc-day-label': 'Giorno',

  'templateEditor.widget.weekly-drc-start-collapsed': 'Inizia compresso',
  'templateEditor.widget.weekly-drc-day-all': 'Tutti i giorni',

  'templateEditor.widget.previous-context-sections-label':
    'Sezioni da includere',
  'templateEditor.widget.previous-context-heading-label':
    'Intestazione sezione DRC precedente',
  'templateEditor.widget.previous-context-heading-placeholder':
    "Scegli un'intestazione",
  'templateEditor.widget.review-context-fields.selection': 'Campi da mostrare',
  'templateEditor.widget.review-context-fields.selection.all': 'Tutti i campi',
  'templateEditor.widget.review-context-fields.selection.group':
    'Gruppo di campi',
  'templateEditor.widget.review-context-fields.selection.fields':
    'Campi specifici',
  'templateEditor.widget.review-context-fields.group': 'Gruppo',
  'templateEditor.widget.review-context-fields.group-placeholder':
    'Seleziona gruppo',
  'templateEditor.widget.review-context-fields.fields': 'Campi',
  'templateEditor.widget.review-context-fields.fields-placeholder':
    'Seleziona campi',
  'templateEditor.widget.review-context-fields.fields-selected':
    '{count} campi selezionati',
  'templateEditor.widget.review-context-fields.no-fields':
    'Crea prima i campi di revisione in Impostazioni.',

  'templateEditor.widget.review-context-fields.context': 'Contesto',
  'templateEditor.widget.review-context-fields.context.both': 'Entrambi',
  'templateEditor.widget.review-context-fields.inherited': 'Ereditato',
  'templateEditor.widget.review-context-fields.current': 'Corrente',
  'templateEditor.widget.review-context-fields.empty-values': 'Valori vuoti',
  'templateEditor.widget.review-context-fields.hide-empty':
    'Nascondi i valori vuoti',
  'templateEditor.widget.trade-review.primary-metrics': 'Metriche principali',
  'templateEditor.widget.trade-review.classification': 'Classificazione',
  'templateEditor.widget.trade-review.more-context': 'Altro contesto',
  'templateEditor.widget.trade-review.display': 'Visualizzazione',
  'templateEditor.widget.trade-review.show-images': 'Mostra immagini',
  'templateEditor.widget.trade-review.fields-none': 'Nessun campo',
  'templateEditor.widget.trade-review.fields-all': 'Tutti i campi',
  'templateEditor.widget.trade-review.fields-count': '{count} campi',
  'templateEditor.widget.trade-review.no-fields': 'Nessun campo disponibile',
  'templateEditor.widget.trade-review.questions': 'Domande di revisione',
  'templateEditor.widget.trade-review.questions-help':
    "Scegli i prompt mostrati per ogni esito dell'operazione. Gli ID delle domande restano stabili così le risposte salvate restano collegate quando modifichi o riordini i prompt.",
  'templateEditor.widget.trade-review.outcome.win': 'Vincite',
  'templateEditor.widget.trade-review.outcome.loss': 'Perdite',
  'templateEditor.widget.trade-review.outcome.breakeven': 'Pareggio',
  'templateEditor.widget.trade-review.outcome.open': 'Aperte',
  'templateEditor.widget.trade-review.questions-empty':
    'Nessuna domanda per questo esito.',
  'templateEditor.widget.trade-review.question-label': 'Domanda',
  'templateEditor.widget.trade-review.question-placeholder':
    'Scrivi una domanda di revisione',
  'templateEditor.widget.trade-review.answer-placeholder-label':
    'Segnaposto risposta',
  'templateEditor.widget.trade-review.answer-placeholder':
    'Prompt facoltativo mostrato nel campo risposta',
  'templateEditor.widget.trade-review.add-question': '+ Aggiungi domanda',
  'templateEditor.widget.trade-review.answer-type-label': 'Tipo di risposta',
  'templateEditor.widget.trade-review.answer-type-text': 'Testo',
  'templateEditor.widget.trade-review.answer-type-choice': 'Scelta',
  'templateEditor.widget.trade-review.option-placeholder': 'Etichetta opzione',
  'templateEditor.widget.trade-review.add-option': '+ Aggiungi opzione',
  'templateEditor.widget.trade-review.condition-label': 'Mostra quando',
  'templateEditor.widget.trade-review.condition-always': 'Sempre visibile',
  'templateEditor.widget.trade-review.condition-option-label':
    'Quando Q{questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section': '+ Aggiungi sezione',

  'templateEditor.widget.previous-context-fallback-label':
    'DRC precedente di riserva',
  'templateEditor.widget.previous-context-fallback-nearest':
    'DRC precedente più vicino',
  'templateEditor.widget.previous-context-fallback-expected':
    'Solo il precedente giorno di trading previsto',
  'calendar.aria.open-daily-review': 'Apri la revisione giornaliera del {date}',
  'calendar.aria.open-weekly-review':
    'Apri la revisione settimanale del {date}',
  'calendar.aria.open-monthly-review': 'Apri la revisione mensile del {date}',
  'calendar.aria.open-quarterly-review':
    'Apri la revisione trimestrale del {date}',

  'csv.mapper.aria.map-column': 'Mappa la colonna {header}',
  'command.quick-import-trades': 'Importa operazioni rapidamente',
  'trade-import.error.file-empty':
    'Questo file è vuoto. Esportalo di nuovo e riprova.',
  'trade-import.error.file-too-large':
    'Il file selezionato supera il limite di dimensione di Trade Import',
  'trade-import.error.file-type-unsupported':
    'Il tipo di file selezionato non è supportato da Trade Import',
  'trade-import.error.broker-file-type-unsupported':
    'Il Broker selezionato non supporta questo tipo di file',
  'quick-import.title': 'Importazione rapida',
  'quick-import.subtitle':
    'Usa la tua configurazione Trade Import preferita per anteprima e importazione più veloci.',
  'quick-import.gate.sign-in':
    "Accedi o crea un Account Journalit gratuito per vedere l'anteprima dei file in Trade Import. Pro è richiesto solo quando importi le operazioni.",
  'quick-import.gate.sign-in-cta': "Accedi per l'anteprima gratuita",
  'quick-import.gate.pro':
    "L'importazione rapida è inclusa in Trade Import Pro.",
  'quick-import.gate.preview-free': 'Anteprima gratuita del file',
  'quick-import.message.needs-setup':
    "Scegli un Broker o un modello preferito in Trade Import prima di usare l'importazione rapida.",
  'quick-import.message.capabilities-failed':
    "Impossibile caricare la configurazione dell'importazione rapida.",
  'quick-import.message.mapping-required':
    'Questo file richiede la mappatura delle colonne. Apri il flusso completo di Trade Import per controllare le mappature.',
  'quick-import.message.preview-failed':
    'Questo file va controllato nel flusso completo di Trade Import.',
  'quick-import.message.no-importable':
    'Nessuna operazione importabile trovata. Controlla questo file in Trade Import per i dettagli.',

  'quick-import.privacy-note':
    "I file vengono caricati sui server Journalit per l'elaborazione e di default non vengono archiviati.",
  'quick-import.dropzone.title': 'Trascina qui un export del broker',
  'quick-import.dropzone.subtitle': 'Oppure fai clic per scegliere un file',

  'quick-import.status.checking-subscription':
    "Verifica dello stato dell'abbonamento...",
  'quick-import.status.analysing': "Analisi e preparazione dell'anteprima...",
  'quick-import.status.importing': 'Importazione...',
  'quick-import.processing.sent-to-server':
    "Caricato su Journalit per un'elaborazione privata",
  'quick-import.file.selected': 'File selezionato',
  'quick-import.file.processed':
    'Elaborato e pronto per essere scritto nel vault',
  'quick-import.summary.title': "Pronto per l'importazione",

  'quick-import.summary.to-import': 'Da importare',
  'quick-import.summary.duplicates': 'Duplicati',
  'quick-import.summary.failed': 'Da revisionare',
  'quick-import.summary.failed-rows': 'Righe non importate',
  'quick-import.summary.incomplete-rows': 'Righe incomplete saltate',
  'quick-import.complete.title': 'Importazione completata',
  'quick-import.complete.message':
    '{written} scritte, {duplicates} duplicati, {failed} da revisionare.',
  'quick-import.action.open-full': 'Apri Trade Import completo',
  'quick-import.action.review-in-trade-import': 'Revisiona in Trade Import',
  'quick-import.action.setup-in-trade-import': 'Configura in Trade Import',
  'quick-import.action.replace-file': 'Sostituisci file',
  'quick-import.action.import': 'Importa operazioni',
  'quick-import.action.import-count.one': 'Importa {count} operazione',
  'quick-import.action.import-count.few': 'Importa {count} operazioni',
  'quick-import.action.import-count.many': 'Importa {count} operazioni',
  'quick-import.action.import-count.other': 'Importa {count} operazioni',
  'quick-import.preview.more': '+ altre {count} operazioni elaborate',
  'trade-import.notice.capabilities-failed':
    'Impossibile caricare le funzionalità di Trade Import',
  'trade-import.notice.open-failed': 'Impossibile aprire Trade Import',
  'trade-import.notice.template-exists':
    'Esiste già un modello Trade Import con questo nome',
  'trade-import.notice.template-saved': 'Modello Trade Import salvato',
  'trade-import.notice.analyse-failed': 'Analisi Trade Import non riuscita',
  'trade-import.notice.preview-failed': 'Anteprima Trade Import non riuscita',
  'trade-import.notice.free-preview-rate-limited':
    'Limite di anteprima gratuita raggiunto. Attiva PRO o riprova tra circa {minutes} minuti.',
  'trade-import.notice.free-preview-storage-limit-reached':
    "L'archivio dell'anteprima gratuita può contenere fino a {limit} operazioni. Ne hai {storedItems} archiviate e questo file ne aggiungerebbe {requestedItems}. Attendi la scadenza di un'anteprima precedente o attiva PRO.",
  'trade-import.preview-error.guidance':
    'Controlla che ogni campo obbligatorio sia mappato, che il formato data selezionato corrisponda al file e che le colonne numeriche contengano valori di operazione validi.',
  'trade-import.notice.complete':
    'Trade Import completato: {written} scritte o aggiornate, {duplicateCount} duplicati, {failedCount} non riuscite',
  'trade-import.gate.brand-left': 'Trade',
  'trade-import.gate.brand-right': 'Import',
  'trade-import.gate.sign-in.title':
    'Anteprima gratuita del tuo storico di trading',
  'trade-import.gate.sign-in':
    'Accedi o crea un Account Journalit gratuito per analizzare il file. Pro è richiesto solo quando importi le operazioni.',
  'trade-import.gate.sign-in.reassurance':
    'Il file viene elaborato in privato e di default non viene archiviato.',
  'trade-import.gate.sign-in.no-trial':
    "Non è richiesta una prova Pro per analizzare e vedere l'anteprima.",
  'trade-import.gate.sign-in.cta': "Accedi per l'anteprima gratuita",

  'trade-import.step.select': 'Carica',
  'trade-import.step.privacy': 'Nota sulla privacy',
  'trade-import.step.analyse': 'Revisione',
  'trade-import.step.preview': 'Importa',
  'trade-import.label.template': 'Modello di mappatura locale',
  'trade-import.label.template-actions': 'Azioni sul modello',
  'trade-import.template.none': 'Nessun modello',
  'trade-import.label.account': 'Conto',
  'trade-import.label.broker': 'Fonte di esportazione / piattaforma',
  'trade-import.label.asset-type': 'Tipo di asset',
  'trade-import.asset.stock': 'Azioni',
  'trade-import.asset.options': 'Opzioni',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.manual-mode.price-based':
    'Ordini o esecuzioni (raggruppati in trade)',
  'trade-import.manual-mode.direct-pnl': 'Un trade per riga (usa il P/L)',
  'trade-import.label.ai-mapping': 'Richiedi suggerimenti di mappatura IA',
  'trade-import.privacy.copy':
    "Trade Import carica l'esportazione del broker selezionata sui server Journalit per l'elaborazione. Le esportazioni del broker possono contenere identificativi del conto, storico operazioni, simboli, timestamp, prezzi, quantità, commissioni, saldi e P&L. Per generare l'anteprima, Journalit invia anche il nome del conto selezionato, le scelte di mappatura/modello, le definizioni dei campi personalizzati e le opzioni salvate, e un contesto locale limitato sulle operazioni aperte per l'abbinamento delle posizioni aperte IBKR. I file originali vengono elaborati per questa importazione e di default non vengono archiviati. Quando i suggerimenti di mappatura IA sono attivi, anche le intestazioni delle colonne e alcune righe di esempio vengono inviate a un modello di IA per suggerire le corrispondenze; deseleziona l'opzione per mappare le colonne da solo.",

  'trade-import.action.analyse': 'Analizza file',
  'trade-import.action.choose-file':
    'Fai clic per caricare oppure trascina e rilascia',
  'trade-import.guide.prompt': 'Non sai cosa esportare?',
  'trade-import.guide.link': 'Vedi la guida del broker',
  'trade-import.hyperliquid.export-guidance':
    'In Hyperliquid usa Trade History → Export as CSV, non Export More (un report di terze parti). Non usare Funding History né Order History.',
  'trade-import.hyperliquid.date-us': 'USA: mese/giorno/anno - ora a 24 ore',
  'trade-import.hyperliquid.date-day-first':
    'Giorno prima: giorno/mese/anno, con o senza « - » prima dell’ora',
  'trade-import.hyperliquid.date-german':
    'Tedesco: giorno.mese.anno - ora a 24 ore',
  'trade-import.hyperliquid.invalid-time-zone':
    'Impossibile rilevare il fuso orario di questo dispositivo. Controlla le impostazioni di sistema.',
  'trade-import.hyperliquid.backend-update-required':
    'Per l’anteprima Hyperliquid serve un aggiornamento del server. Riprova più tardi.',
  'trade-import.action.drop-file': 'Rilascia il file per caricarlo',
  'trade-import.analyse.detected':
    'Abbiamo letto il tuo file {fileType}. Controlla le righe qui sotto, poi abbina ogni colonna a un campo del trade.',
  'trade-import.table.screenshots': 'Screenshot',
  'trade-import.preview.screenshot-alt':
    'Screenshot di {symbol} dalla riga {row} del foglio',
  'trade-import.preview.screenshots-more': 'altri {count}',
  'trade-import.preview.include-screenshots':
    'Aggiungi gli screenshot del tuo foglio di calcolo ai rispettivi trade ({count})',
  'trade-import.completion.screenshots-added':
    'Screenshot aggiunti dal tuo foglio di calcolo: {count}',
  'trade-import.completion.screenshots-failed':
    'Screenshot del tuo foglio di calcolo non aggiunti: {count}',
  'trade-import.preview.import-anyway': 'Importa comunque',
  'trade-import.preview.import-anyway-aria':
    'Importa comunque {symbol} del {date}',
  'trade-import.preview.import-all-anyway':
    'Importa comunque tutti i {count} possibili duplicati',
  'csv.mapper.missing-fields.pnl-or-prices':
    'Oppure abbina Prezzo di entrata, Prezzo di uscita e Quantità per calcolare il P/L dai prezzi.',
  'trade-import.pnl-from-prices.title':
    'Il P/L verrà calcolato dai tuoi prezzi',
  'trade-import.pnl-from-prices.body':
    'Non c’è una colonna P/L, quindi viene calcolato da prezzo di entrata, prezzo di uscita e quantità. È corretto solo con il tipo di asset giusto, quindi scegli cosa sono questi trade.',
  'trade-import.pnl-from-prices.contract-size':
    'Forex e futures richiedono anche una colonna Dimensione del contratto per calcolare il P/L. Senza, abbina invece la tua colonna P/L.',
  'trade-import.diagnostic.choose-date-format': 'Scegli il formato data',
  'trade-import.date-question.ambiguous':
    'Le tue date sono come {example}. Che data è?',
  'trade-import.date-question.mixed':
    'Alcune date in questa colonna usano un altro ordine, come {example}. Quale ordine usa la maggior parte delle tue date?',
  'trade-import.date-question.mixed-note':
    'Le righe scritte nell’altro ordine verranno elencate così potrai correggerle nel file.',
  'quick-import.message.date-order':
    'Le tue date si possono leggere in due modi. Apri l’importazione completa per scegliere.',
  'csv.date-format.eu-dot': 'UE con punti: 25.12.2024 (giorno.mese.anno)',
  'csv.date-format.ymd-dot': 'Prima l’anno, con punti: 2024.12.25',
  'trade-import.unmapped.title': 'Non importate ({count})',
  'trade-import.unmapped.body':
    'Queste colonne non corrispondono a nessun campo di Journalit e verranno escluse. Se un campo è adatto, abbina la colonna qui sopra.',
  'trade-import.unmapped.keep': 'Mantieni come campo personalizzato',
  'trade-import.unmapped.keep-aria':
    'Mantieni {header} come campo personalizzato',
  'trade-import.custom-field.title':
    'Mantieni «{header}» come campo personalizzato',
  'trade-import.custom-field.hint':
    'Aggiunge un campo ai tuoi trade e lo compila da questa colonna. Se un campo di Journalit è già adatto, abbina invece la colonna a quel campo.',
  'trade-import.custom-field.name': 'Nome del campo',
  'trade-import.custom-field.type': 'Tipo di campo',
  'trade-import.custom-field.type.text': 'Testo',
  'trade-import.custom-field.type.number': 'Numero',
  'trade-import.custom-field.type.dropdown': 'Elenco di scelte',
  'trade-import.custom-field.create': 'Crea campo',
  'trade-import.custom-field.error.reserved':
    'Questo nome è usato da un campo del trade predefinito. Scegli un altro nome.',
  'trade-import.table.open-closed': 'Aperto/chiuso',
  'trade-import.status.open': 'Aperto',
  'trade-import.status.partially-closed': 'Chiuso in parte',
  'trade-import.status.closed': 'Chiuso',
  'trade-import.status.cancelled': 'Annullato',
  'trade-import.diagnostic.column': 'Colonna: {columns}',
  'trade-import.diagnostic.unmap-column': 'Non importare questa colonna',
  'trade-import.diagnostic.edit-mapping': 'Modifica mappatura',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Foglio',
  'trade-import.label.header-row': 'Riga di intestazione',
  'trade-import.placeholder.auto': 'Automatico',
  'trade-import.label.date-format': 'Formato data',

  'trade-import.label.save-template': 'Salva modello di mappatura',
  'trade-import.placeholder.template-name': 'Nome del modello',
  'trade-import.action.save-template': 'Salva modello',
  'trade-import.action.preview': 'Genera anteprima',

  'trade-import.preview.found.one': 'Abbiamo trovato {count} operazione',
  'trade-import.preview.found.few': 'Abbiamo trovato {count} operazioni',
  'trade-import.preview.found.many': 'Abbiamo trovato {count} operazioni',
  'trade-import.preview.found.other': 'Abbiamo trovato {count} operazioni',
  'trade-import.preview.date-range': '{start}–{end}',
  'trade-import.preview.metric.symbols': 'Simboli',
  'trade-import.preview.metric.ready': "Pronte per l'importazione",
  'trade-import.preview.metric.duplicates': 'Possibili duplicati',
  'trade-import.preview.metric.attention': 'Da controllare',
  'trade-import.preview.completed.message':
    "Operazioni pronte per l'importazione: {count}.",
  'trade-import.preview.partial.message':
    'Operazioni pronte: {count}. Righe non importate: {failed}. Righe incomplete saltate: {incomplete}.',
  'trade-import.preview.partial.guidance':
    'Verranno importate solo le operazioni valide mostrate sotto.',
  'trade-import.preview.failed.message':
    'Nessuna operazione è stata preparata da questo file.',
  'trade-import.preview.failed.guidance':
    'Controlla le mappature delle colonne, il formato data, il foglio e la riga di intestazione selezionati e gli eventuali valori non validi sotto.',
  'trade-import.preview.tradovate-performance.title': 'Report Tradovate errato',
  'trade-import.preview.tradovate-performance.message':
    "Sembra un'esportazione Performance di Tradovate. Journalit importa il report Orders per ricostruire accuratamente le tue esecuzioni. In Tradovate, vai su Reports > Orders e scarica il CSV.",
  'trade-import.preview.tradovate-performance.guide':
    "Visualizza la guida all'esportazione Tradovate",
  'trade-import.preview.metatrader-statement.title':
    'Estratto MetaTrader non supportato',
  'trade-import.preview.metatrader-statement.message':
    'Journalit importa il report originale della cronologia del conto MetaTrader. Imposta MetaTrader in inglese, apri Account History / History, scegli Save as Report, quindi carica il file .html o .htm originale senza modificarlo o convertirlo.',
  'trade-import.preview.metatrader-statement.guide':
    'Visualizza la guida di esportazione MetaTrader',
  'trade-import.preview.tradingview-export.title':
    'Esportazione TradingView errata',
  'trade-import.preview.tradingview-export.message':
    'Journalit richiede il CSV Order History / History di TradingView Paper Trading. Non usare Account History, dati dei grafici, esportazioni di strategie o altri file CSV di TradingView.',
  'trade-import.preview.tradingview-export.guide':
    'Visualizza la guida di esportazione TradingView',
  'trade-import.source-recovery.title':
    'Questo file sembra un’esportazione {source}',
  'trade-import.source-recovery.message':
    'Journalit può importare questo file direttamente con {source} invece di {selected}.',
  'trade-import.source-recovery.continue': 'Continua con {selected}',
  'trade-import.source-recovery.switch': 'Passa a {source}',
  'trade-import.source-recovery.guide':
    'Vedi la guida di esportazione {source}',
  'trade-import.source-recovery.metatrader.message':
    'Journalit può importare direttamente questo estratto conto MetaTrader, senza mappatura delle colonne.',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    'Il file proviene da DeepCharts anche se il conto esegue tramite Rithmic. Usa DeepCharts affinché i trade long e short vengano letti correttamente dalla Trade List.',
  'trade-import.source-recovery.deepcharts.manual-message':
    'Usa l’importatore DeepCharts. Legge long e short dalla Quantity con segno o dalla colonna Direction della Trade List, quindi non serve alcuna mappatura manuale.',
  'trade-import.source-recovery.motivewave.title':
    'Questo file sembra un’esportazione di esecuzioni MotiveWave',
  'trade-import.source-recovery.motivewave.message':
    'Usa MotiveWave affinché Journalit possa abbinare correttamente le righe di esecuzione in trade completati.',
  'quick-import.message.source-mismatch':
    'Journalit ha identificato un’altra fonte di esportazione. Controllala in Trade Import per cambiare fonte senza caricare di nuovo il file.',
  'trade-import.preview.no-eligible':
    "Il file è stato analizzato con successo, ma nessuna operazione nuova o aggiornata è idonea all'importazione. Controlla sotto i dettagli su duplicati e classificazione.",
  'trade-import.pro-gate.title.one': '{count} operazione pronta da importare',
  'trade-import.pro-gate.title.few': '{count} operazioni pronte da importare',
  'trade-import.pro-gate.title.many': '{count} operazioni pronte da importare',
  'trade-import.pro-gate.title.other': '{count} operazioni pronte da importare',
  'trade-import.pro-gate.subtitle':
    'Attiva PRO per scriverle nel tuo vault come note operazione.',
  'trade-import.pro-gate.cta': 'Attiva PRO',
  'trade-import.preview.diagnostics': 'Dettagli della revisione ({count})',
  'trade-import.preview.affected-rows': 'Righe interessate: {count}',
  'trade-import.table.status': 'Stato',
  'trade-import.table.symbol': 'Simbolo',
  'trade-import.table.direction': 'Direzione',
  'trade-import.table.entry-time': 'Orario di ingresso',
  'trade-import.table.date': 'Data',
  'trade-import.table.quantity': 'Quantità',
  'trade-import.table.position': 'Posizione',
  'trade-import.table.result': 'Risultato',
  'trade-import.table.message': 'Messaggio',
  'trade-import.status.new': 'Nuova',
  'trade-import.status.already-imported': 'Già importata',
  'trade-import.status.other-account': 'In un altro conto',
  'trade-import.status.other-account.detail': 'Già importata in {account}',
  'trade-import.status.updates-existing': 'Aggiorna un’operazione esistente',
  'trade-import.status.possible-duplicate': 'Possibile duplicato',
  'trade-import.status.needs-review': 'Da controllare',
  'trade-import.status.duplicate-in-file': 'Duplicata nel file',
  'trade-import.status.invalid': 'Operazione non valida',
  'trade-import.status.no-open-trade': 'Nessuna operazione aperta da chiudere',
  'trade-import.status.multiple-open-trades':
    'Più operazioni aperte corrispondono',
  'trade-import.status.quantity-mismatch': 'Quantità non corrispondente',
  'trade-import.server-deletion.deleted':
    'Operazioni eliminate dal server Journalit: {count}',
  'trade-import.server-deletion.kept':
    'Operazioni mantenute perché anche un’altra importazione le contiene: {count}',
  'trade-import.server-deletion.blocked-broker-connected':
    'Questo conto è sincronizzato da una connessione al broker. Disconnetti il broker per eliminarne i dati.',
  'trade-import.server-deletion.blocked-broker-history':
    'Questo conto contiene la cronologia di sincronizzazione del broker e non può essere eliminato qui. Elimina invece le singole importazioni.',
  'trade-import.server-deletion.failed':
    'Impossibile eliminare dal server Journalit. Riprova.',
  'trade-import.server-deletion.notice':
    'Note delle operazioni spostate nel cestino dopo un’eliminazione sul server: {count}',
  'trade-import.server-deletion.account.title':
    'Eliminare il conto sul server?',
  'trade-import.server-deletion.account.message':
    'Questa azione elimina definitivamente «{account}» e le sue operazioni importate ({count} sul server) dal server Journalit e sposta le relative note nel cestino in ogni vault sincronizzato. Potrai importare di nuovo i file in seguito.',
  'trade-import.server-deletion.account.confirm': 'Elimina dal server',
  'trade-import.server-deletion.account.button': 'Elimina dal server',
  'trade-import.history.title': 'Cronologia importazioni',
  'trade-import.completion.wrong-account': 'Importato nel conto sbagliato?',
  'trade-import.completion.undo-import': 'Annulla questa importazione',
  'trade-import.action.manage-imports': 'Gestisci importazioni precedenti',
  'trade-sync.import.more-actions': 'Altre azioni',
  'trade-import.history.loading': 'Caricamento della cronologia importazioni…',
  'trade-import.history.load-failed':
    'Impossibile caricare la cronologia importazioni.',
  'trade-import.history.empty': 'Nessuna importazione.',
  'trade-import.history.trades-on-server': '{count} sul server',
  'trade-import.history.delete.title': 'Eliminare questa importazione?',
  'trade-import.history.delete.message':
    'Questa azione elimina definitivamente dal server Journalit le operazioni che questa importazione ha aggiunto a «{account}» ({count} sul server) e sposta le relative note nel cestino in ogni vault sincronizzato. Le operazioni contenute anche in un’altra importazione vengono mantenute. Potrai importare di nuovo il file in seguito.',
  'trade-import.history.delete.confirm': 'Elimina importazione',
  'trade-import.history.load-more': 'Carica altro',
  'account.edit.modal.delete.delete-server-trades':
    'Elimina anche le sue operazioni importate dal server Journalit ({count} sul server). Le relative note finiranno nel cestino in ogni vault sincronizzato, anche se le mantieni qui.',
  'trade-import.preview.other-account.message':
    'Già in {account} ({count}), quindi verranno saltate.',
  'trade-import.preview.other-account.import-instead':
    'Importa invece in {account}',
  'trade-import.preview.other-account.undo-earlier':
    'Annulla l’importazione precedente',
  'trade-import.action.confirm': 'Conferma importazione',
  'trade-import.action.activate-pro.one':
    'Attiva PRO per importare {count} operazione',
  'trade-import.action.activate-pro.few':
    'Attiva PRO per importare {count} operazioni',
  'trade-import.action.activate-pro.many':
    'Attiva PRO per importare {count} operazioni',
  'trade-import.action.activate-pro.other':
    'Attiva PRO per importare {count} operazioni',
  'trade-import.action.cancel-preview': 'Annulla anteprima',
  'trade-import.broker.manual': 'Mappatura manuale',
  'trade-import.source.title': 'Da dove provengono questi trade?',
  'trade-import.source.subtitle':
    'Scegli la piattaforma da cui hai esportato. Journalit legge direttamente il suo formato di file, senza mappatura delle colonne.',
  'trade-import.source.search': 'Cerca broker e piattaforme',
  'trade-import.source.sync-available':
    'Supporta anche il Trade Sync automatico',
  'trade-import.source.manual.tile': 'Foglio di calcolo personale / altro file',
  'trade-import.source.manual.title':
    'Foglio di calcolo personale o altro file',
  'trade-import.source.manual.hint':
    'Abbinerai le colonne del tuo file ai campi di Journalit.',
  'trade-import.source.native.hint':
    'Il formato del file viene letto automaticamente, nessuna mappatura necessaria.',
  'trade-import.source.guide': 'Come esportare',
  'trade-import.source.change': 'Cambia',
  'trade-import.sync-suggestion.full.title':
    '{broker} può sincronizzarsi automaticamente',
  'trade-import.sync-suggestion.full.body':
    'Trade Sync importa i nuovi trade da solo, senza esportazioni. Puoi comunque importare un file qui sotto.',
  'trade-import.sync-suggestion.partial.title':
    'Usi {provider}? Sincronizzalo invece',
  'trade-import.sync-suggestion.partial.body':
    'Trade Sync importa automaticamente i trade di {provider}. Gli altri estratti conto si importano comunque qui sotto.',
  'trade-import.sync-suggestion.action': 'Configura Trade Sync',
  'trade-import.sync-suggestion.sync-only.title':
    '{broker} si collega tramite Trade Sync',
  'trade-import.sync-suggestion.sync-only.body':
    'Nessuna esportazione: Trade Sync importa automaticamente i tuoi trade {broker}. Hai comunque un file {broker}? Scegli Non in elenco / file personalizzato.',
  'trade-import.sync-suggestion.action.open': 'Apri Trade Sync',

  'home.quick-links.quick-import': 'Importazione rapida',
  'home.quick-links.setups': 'Setup',
  'command.open-setups': 'Apri Setup',
  'setups.view.loading': 'Caricamento setup…',
  'setups.view.error.title': 'Impossibile caricare i setup',
  'setups.view.error.load-failed': 'Impossibile caricare i dati dei setup.',
  'setups.view.action.retry': 'Riprova',

  'setups.view.action.create': 'Crea setup',
  'setups.view.action.new': 'Nuovo setup',
  'setups.create.title': 'Crea setup',
  'setups.create.field.name': 'Nome del setup',
  'setups.create.placeholder.name': 'Opening Drive',
  'setups.create.field.status': 'Stato',
  'setups.create.field.direction': 'Direzione',
  'setups.create.field.color': 'Colore',
  'setups.create.field.color-description':
    'Scegli un colore per identificare questo setup.',
  'setups.create.field.tags': 'Tag',
  'setups.create.placeholder.tags': 'Momentum, Breakout, Mattina',
  'setups.create.profile.heading': 'Campi preferiti',
  'setups.create.profile.optional-label': '(Facoltativo)',
  'setups.create.field.sessions': 'Sessioni',
  'setups.create.field.preferred-sessions-tooltip':
    'Gestisci queste sessioni in Impostazioni → Diario → Modalità sessione.',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': 'Timeframe',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'Simboli',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
  'setups.create.direction.any': 'Non specificata',
  'setups.create.direction.long': 'Long',
  'setups.create.direction.short': 'Short',
  'setups.create.direction.both': 'Entrambe',
  'setups.create.field.linked-notes': 'Note collegate',
  'setups.create.field.linked-notes-desc':
    'Collega note esistenti che documentano il playbook di questo setup.',
  'setups.create.linked-notes.empty': 'Ancora nessuna nota collegata.',
  'setups.create.linked-notes.add': '+ Collega nota',
  'setups.create.linked-notes.remove': 'Rimuovi nota collegata',
  'setups.create.linked-notes.picker-title': 'Scegli una nota del playbook',
  'setups.create.linked-notes.search': 'Cerca note...',
  'setups.create.linked-notes.no-notes': 'Nessuna nota Markdown trovata.',
  'setups.create.button.creating': 'Creazione...',
  'setups.create.button.create': 'Crea setup',
  'setups.create.success': 'Setup "{name}" creato correttamente',
  'setups.create.error.name-required': 'Il nome del setup è obbligatorio',
  'setups.create.error.tag-save-failed':
    "Il tag non è stato salvato nell'elenco globale dei tag.",
  'setups.create.error.failed': 'Impossibile creare il setup',
  'setups.edit.title': 'Modifica setup',
  'setups.edit.button.saving': 'Salvataggio...',
  'setups.edit.button.save': 'Salva setup',
  'setups.edit.button.rename-and-update': 'Rinomina e aggiorna le operazioni',
  'setups.edit.rename-warning.title':
    'Rinomina il setup e aggiorna le operazioni',
  'setups.edit.rename-warning.message':
    'Rinominare {oldName} in {newName} aggiornerà le note delle operazioni che usano il vecchio nome del setup.',
  'setups.edit.delete.button': 'Elimina setup',
  'setups.edit.delete.title': 'Elimina setup',
  'setups.edit.delete.confirm': 'Conferma eliminazione',
  'setups.edit.delete.warning':
    'Eliminare "{name}" rimuove definitivamente il setup e lo toglie dalle operazioni collegate. L\'azione non può essere annullata.',
  'setups.edit.delete.success': 'Setup "{name}" eliminato',
  'setups.edit.delete.error': 'Impossibile eliminare il setup',
  'setups.edit.success': 'Setup "{name}" aggiornato correttamente',
  'setups.edit.error.failed': 'Impossibile aggiornare il setup',
  'setups.view.action.compare-selected': 'Confronta i setup selezionati',
  'setups.view.tabs.aria': 'Schede della vista Setup',
  'setups.view.tab.overview': 'Panoramica',
  'setups.view.tab.compare': 'Confronta',
  'setups.view.card.select-for-compare': 'Seleziona il setup da confrontare',

  'setups.view.compare.title': 'Confronta i setup',

  'setups.view.compare.empty': 'Seleziona due setup da confrontare.',
  'setups.view.compare.empty-submessage':
    'Scegli due schede setup dalla panoramica per creare un confronto affiancato.',
  'setups.view.compare.metrics-title': 'Metriche di confronto',
  'setups.view.compare.metric': 'Metrica',
  'setups.view.compare.edge-column': 'Vantaggio',
  'setups.view.compare.edge-label': 'Vincitore',

  'setups.view.compare.no-clear-edge': 'Nessun vantaggio chiaro',
  'setups.view.compare.expectancy-edge': 'Vantaggio di aspettativa',
  'setups.view.compare.confidence': 'Confidenza',
  'setups.view.compare.sample': 'Campione',
  'setups.view.compare.confidence.high': 'Alta',
  'setups.view.compare.confidence.moderate': 'Moderata',
  'setups.view.compare.confidence.low': 'Bassa',
  'setups.view.compare.edge-strength.strong': 'Vantaggio solido',
  'setups.view.compare.edge-strength.clear': 'Vantaggio chiaro',
  'setups.view.compare.edge-strength.slight': 'Vantaggio lieve',
  'setups.view.compare.edge-reasons-privacy':
    'I dettagli del vantaggio sono nascosti mentre la Modalità privacy è attiva.',
  'setups.view.compare.reason.higher.net-pnl': 'P&L netto più alto',
  'setups.view.compare.reason.lower.net-pnl': 'P&L netto più basso',
  'setups.view.compare.reason.similar.net-pnl': 'P&L netto simile',
  'setups.view.compare.reason.higher.total-r': 'R totale più alto',
  'setups.view.compare.reason.lower.total-r': 'R totale più basso',
  'setups.view.compare.reason.similar.total-r': 'R totale simile',
  'setups.view.compare.reason.higher.win-rate': 'Tasso di vincita più alto',
  'setups.view.compare.reason.lower.win-rate': 'Tasso di vincita più basso',
  'setups.view.compare.reason.similar.win-rate': 'Tasso di vincita simile',
  'setups.view.compare.reason.higher.expectancy': 'Aspettativa più alta',
  'setups.view.compare.reason.lower.expectancy': 'Aspettativa più bassa',
  'setups.view.compare.reason.similar.expectancy': 'Aspettativa simile',
  'setups.view.compare.reason.higher.profit-factor':
    'Fattore di profitto più alto',
  'setups.view.compare.reason.lower.profit-factor':
    'Fattore di profitto più basso',
  'setups.view.compare.reason.similar.profit-factor':
    'Fattore di profitto simile',

  'setups.view.compare.cumulative-title': 'Rendimento cumulativo',
  'setups.view.compare.cumulative-privacy':
    'Il rendimento cumulativo è nascosto mentre la Modalità privacy è attiva.',
  'setups.view.compare.cumulative-empty':
    'Nessun dato cumulativo sulle operazioni per i setup selezionati.',

  'setups.view.trade.unknown-instrument': 'Strumento sconosciuto',

  'setups.guide.create-new-setup.title': 'Crea nuovi setup',
  'setups.guide.create-new-setup.description':
    'Usa Nuovo setup quando vuoi aggiungere un altro playbook. La finestra ti guida tra dettagli, tag, note collegate e regole.',
  'setups.guide.detail-intro.title': 'Questa è la pagina del setup',
  'setups.guide.detail-intro.description':
    'Questa pagina mette a fuoco un playbook con il grafico di rendimento, il pannello di contesto, il materiale di riferimento, le azioni e le regole di esecuzione.',
  'setups.guide.detail-actions.title': 'Azioni del setup',
  'setups.guide.detail-actions.description':
    'Usa questi pulsanti per aprire le operazioni collegate o modificare il setup, inclusi dettagli, note collegate, screenshot e regole del playbook.',
  'setups.guide.empty.create-setup.title': 'Inizia da Nuovo setup',
  'setups.guide.empty.create-setup.description':
    'Crea prima un setup. Quando esiste, questa guida continua con il percorso normale.',

  'setups.guide.intro.title': 'Benvenuto in Setups',
  'setups.guide.intro.description':
    'Questa vista riunisce playbook dei setup, operazioni collegate, note, screenshot e regole in un unico posto.',
  'setups.guide.view-tabs.title': 'Cambia vista dei setup',
  'setups.guide.view-tabs.description':
    'Usa queste schede per passare tra panoramica, coppie di setup e confronto quando hai abbastanza setup.',
  'setups.guide.overview-chart.title': 'Classifica di rendimento',
  'setups.guide.overview-chart.description':
    'Il grafico della panoramica classifica i setup in base alla metrica selezionata. Usa i controlli in alto a destra per cambiare metrica o concentrarti su setup specifici.',
  'setups.guide.tag-filter.title': 'Filtra i setup',
  'setups.guide.tag-filter.description':
    'Filtra schede, grafico, coppie e scelte di confronto per tag o direzione del setup. Le selezioni nello stesso gruppo usano la logica OR, mentre tag e direzione si combinano tra loro.',
  'setups.guide.setup-cards.title': 'Schede setup',
  'setups.guide.setup-cards.description':
    "Le schede riassumono ogni setup con metriche chiave, stato, tag, data dell'ultima operazione e un piccolo andamento di rendimento.",
  'setups.guide.open-detail.title': 'Apri la pagina di un setup',
  'setups.guide.open-detail.description':
    'Quando sei pronto, apri una scheda setup per vedere la sua pagina. Lì ti aspetta una breve guida.',
  'setups.guide.detail-performance.title': 'Rendimento del dettaglio',
  'setups.guide.detail-performance.description':
    'La scheda Rendimento mostra il grafico e le metriche chiave di questo setup nel tempo, inclusi P&L, tasso di vincita, aspettativa e drawdown.',
  'setups.guide.detail-context.title': 'Contesto del setup',
  'setups.guide.detail-context.description':
    'Questo pannello tiene a portata di mano lo stato del setup, gli elementi da controllare, le note collegate e gli screenshot.',
  'setups.guide.detail-playbook.title': 'Note del playbook',
  'setups.guide.detail-playbook.description':
    "L'area playbook mostra l'anteprima della nota collegata a questo setup. Può contenere Markdown, immagini, Excalidraw o qualsiasi materiale di riferimento.",
  'setups.guide.detail-rules.title': 'Regole di esecuzione',
  'setups.guide.detail-rules.description':
    'Le regole raccolgono la lista di controllo strutturata di condizioni ottimali, ingressi, rischio ed errori da evitare.',
  'setups.guide.finish.title': 'Guida Setups completata',
  'setups.guide.finish.description':
    'Hai visto le sezioni principali di Setups: Panoramica, Coppie, Confronta e la pagina del singolo setup.',

  'setups.guide.pairs-mode.title': 'Apri le coppie di setup',
  'setups.guide.pairs-mode.description':
    'Apri Coppie per vedere quali combinazioni di setup hanno abbastanza operazioni in comune da confrontare.',
  'setups.guide.pairs-chart.title': 'Classifica delle coppie',
  'setups.guide.pairs-chart.description':
    'La modalità Coppie evidenzia le combinazioni che insieme possono rendere meglio o peggio. Fai clic su una barra per approfondire quella combinazione.',

  'setups.guide.compare-mode.title': 'Avvia la modalità confronto',
  'setups.guide.compare-mode.description':
    'La modalità confronto ti permette di selezionare due schede setup per una revisione affiancata.',
  'setups.guide.compare-select.title': 'Seleziona due setup',
  'setups.guide.compare-select.description':
    'Seleziona due schede setup per aprire la pagina di confronto.',
  'setups.guide.compare-summary.title': 'Questa è la pagina di confronto',
  'setups.guide.compare-summary.description':
    'Questa pagina confronta due setup affiancati. La riga riassuntiva in alto mostra il vincitore, il vantaggio di aspettativa, la confidenza e perché un setup può avere un vantaggio.',
  'setups.guide.compare-body.title': 'Riga riassuntiva del confronto',
  'setups.guide.compare-body.description':
    'La riga in alto riassume il confronto: vincitore, vantaggio di aspettativa, confidenza e i motivi del vantaggio.',
  'setups.guide.compare-details.title': 'Dettagli del confronto',
  'setups.guide.compare-details.description':
    'Usa la tabella delle metriche e il grafico cumulativo per capire come differiscono i due setup.',
  'setups.guide.detail-execution-gap.title': 'Analisi del gap di esecuzione',
  'setups.guide.detail-execution-gap.description':
    "Quando ci sono dati di operazioni perse o backtest, questa scheda confronta l'esecuzione catturata con l'opportunità persa o il benchmark.",
  'setups.guide.back-to-overview.title': 'Torna alle schede setup',
  'setups.guide.back-to-overview.description':
    'Torna alle schede setup quando hai finito di confrontare.',

  'setups.view.title': 'Setups',
  'setups.view.open-as-markdown': 'Apri come Markdown',
  'setups.view.open-as-setup': 'Apri come Setup Journalit',

  'setups.view.summary.aria': 'Riepilogo panoramica setup',

  'setups.view.summary.needs-review': 'Da revisionare',
  'setups.view.summary.best-performer': 'Miglior rendimento',

  'setups.view.ranking.metric-aria': 'Metrica di rendimento',

  'setups.view.overview.mode.pairs': 'Coppie',
  'setups.view.pairs.summary-aria': 'Riepilogo coppie di setup',
  'setups.view.pairs.best': 'Migliore coppia',
  'setups.view.pairs.worst': 'Peggiore coppia',
  'setups.view.pairs.worst-short': 'Peggiore',
  'setups.view.pairs.empty':
    'Ancora nessuna coppia di setup con 5+ operazioni.',
  'setups.view.pairs.empty-submessage':
    'Le coppie appaiono quando due setup condividono abbastanza operazioni collegate.',
  'setups.view.pairs.privacy':
    'Il rendimento delle coppie è nascosto mentre la Modalità privacy è attiva.',

  'setups.view.pairs.metric-aria': 'Metrica della coppia',
  'setups.view.pairs.metric.edge': 'Vantaggio della coppia',
  'setups.view.pairs.metric.edge-short': 'vantaggio',
  'setups.view.pairs.metric.expectancy': 'Aspettativa della coppia',

  'setups.view.pairs.together': 'Insieme',
  'setups.view.pairs.table.setup-pair': 'Coppia di setup',

  'setups.view.pairs.evidence': 'Evidenze',
  'setups.view.pairs.edge-comparison': 'Confronto del vantaggio',
  'setups.view.pairs.edge-caption': 'Vantaggio combinato: {edge}',
  'setups.view.overview.setup-filter.all': 'Setup: Tutti',
  'setups.view.overview.setup-filter.selected': 'Setup: {count} selezionati',
  'setups.view.overview.setup-filter.aria': 'Scegli i setup da mostrare',
  'setups.view.overview.setup-filter.select-all': 'Seleziona tutto',
  'setups.view.overview.setup-filter.clear': 'Pulisci',
  'setups.view.overview.tag-filter.aria': 'Filtra i setup',
  'setups.view.overview.tag-filter.reset': 'Reimposta',
  'setups.view.overview.tag-filter.untagged': 'Senza tag',
  'setups.view.overview.tag-filter.empty':
    'Nessun setup corrisponde a questi filtri',
  'setups.view.overview.tag-filter.empty-submessage':
    'Modifica o pulisci i filtri per mostrare più setup.',

  'setups.view.overview.pnl-chart.dropdown-label': 'Curva P&L',

  'setups.view.overview.pnl-chart.combined': 'Tutti i setup',
  'setups.view.overview.pnl-chart.selected-combined': 'Setup selezionati',

  'setups.view.overview.pnl-chart.hidden':
    'Il P&L dei setup nel tempo è nascosto mentre la Modalità privacy è attiva.',
  'setups.view.overview.pnl-chart.trade': 'Operazione',
  'setups.view.overview.pnl-chart.start': 'Inizio',
  'setups.view.ranking.privacy':
    'I valori di rendimento sono nascosti mentre la Modalità privacy è attiva.',
  'setups.view.ranking.empty': 'Ancora nessun dato di rendimento dei setup.',
  'setups.view.ranking.empty-submessage':
    'Registra operazioni con i setup per iniziare a classificare il rendimento.',

  'setups.view.metric.trade-count': 'Numero di operazioni',
  'setups.view.metric.trades': 'operazioni',
  'setups.view.metric.net-pnl': 'P&L totale',
  'setups.view.metric.total-pnl': 'P&L totale',
  'setups.view.metric.win-rate': 'Tasso di vincita',
  'setups.view.metric.profit-factor': 'Fattore di profitto',
  'setups.view.metric.last-traded': 'Ultima operazione',
  'setups.view.metric.expected-value': 'Aspettativa',

  'setups.view.status.active': 'Attivo',
  'setups.view.status.testing': 'In test',
  'setups.view.status.archived': 'Archiviato',

  'setups.view.empty.no-setups':
    'Ancora nessun setup. Crea il tuo primo setup per iniziare a tracciare i playbook.',
  'setups.view.empty.no-setups-submessage':
    'I setup raccolgono note del playbook, regole, operazioni e rendimento in un unico posto.',

  'setups.view.detail.back': 'Indietro',

  'setups.view.detail.action.edit': 'Modifica setup',
  'setups.view.detail.action.view-trades': 'Vedi nel registro operazioni',

  'setups.view.detail.playbook': 'Playbook',

  'setups.view.detail.no-playbook-note':
    "Collega una nota del playbook per vederne l'anteprima qui.",
  'setups.view.detail.link-playbook-note': 'Collega nota',
  'setups.view.detail.change-playbook-note': 'Cambia nota',

  'setups.view.detail.playbook-note-modal.empty':
    'Nessuna nota corrispondente.',
  'setups.view.detail.empty-playbook-note':
    'La nota del playbook collegata è vuota.',
  'setups.view.detail.rules': 'Regole',

  'setups.view.detail.rules.edit': 'Modifica regole',

  'setups.view.detail.rules.add': 'Aggiungi regola',

  'setups.view.detail.rules.empty-title': 'Costruisci il playbook del setup',
  'setups.view.detail.rules.use-template': 'Usa modello',
  'setups.view.detail.rules.applying-template': 'Applicazione modello...',
  'setups.view.detail.rules.add-custom': 'Regola personalizzata',
  'setups.view.detail.rules.template-error':
    'Impossibile applicare il modello del playbook.',
  'setups.view.detail.rules.template.best-conditions': 'Condizioni ottimali',
  'setups.view.detail.rules.template.entry-criteria': 'Criteri di ingresso',
  'setups.view.detail.rules.template.invalidation': 'Invalidazione',
  'setups.view.detail.rules.template.risk-management': 'Rischio / Gestione',
  'setups.view.detail.rules.template.avoid-when': 'Da evitare',
  'setups.view.detail.rules.template.common-mistakes': 'Errori comuni',
  'setups.view.detail.rules.template.rule.best-conditions':
    'Il contesto di mercato supporta questo setup',
  'setups.view.detail.rules.template.rule.entry-criteria':
    'Il trigger di ingresso è definito in modo chiaro',
  'setups.view.detail.rules.template.rule.invalidation':
    "L'invalidazione è chiara prima dell'ingresso",
  'setups.view.detail.rules.template.rule.risk-management':
    'Il rischio è accettabile e il target è definito',
  'setups.view.detail.rules.template.rule.avoid-when':
    'Le condizioni da evitare non sono presenti',
  'setups.view.detail.rules.template.rule.common-mistakes':
    'Gli errori di esecuzione noti vengono evitati',
  'setups.view.detail.rules.field.label': 'Regola',
  'setups.view.detail.rules.field.description': 'Dettagli',
  'setups.view.detail.rules.field.group': 'Gruppo',
  'setups.view.detail.rules.move-up': 'Sposta la regola in alto',
  'setups.view.detail.rules.move-down': 'Sposta la regola in basso',
  'setups.view.detail.rules.delete': 'Elimina regola',
  'setups.view.detail.rules.save-error':
    'Impossibile salvare le regole del setup.',
  'setups.view.detail.rules.validation-label':
    'Aggiungi un nome alla regola o elimina la regola vuota prima di salvare.',
  'setups.view.detail.rules.groups': 'Gruppi',
  'setups.view.detail.rules.add-group': 'Aggiungi gruppo',
  'setups.view.detail.rules.new-group': 'Nuovo gruppo',
  'setups.view.detail.rules.validation-group':
    'Aggiungi un nome al gruppo o rimuovi il gruppo vuoto prima di salvare.',
  'setups.view.detail.rules.summary': '{count} regole · {groups} gruppi',

  'setups.view.detail.rule.category.context': 'Contesto',
  'setups.view.detail.rule.category.entry': 'Ingresso',
  'setups.view.detail.rule.category.exit': 'Uscita',
  'setups.view.detail.rule.category.risk': 'Rischio',
  'setups.view.detail.rule.category.management': 'Gestione',
  'setups.view.detail.rule.category.invalidation': 'Invalidazione',
  'setups.view.detail.rule.category.psychology': 'Psicologia',
  'setups.view.detail.rule.required': 'Obbligatoria',

  'setups.view.detail.no-linked-notes': 'Ancora nessuna nota collegata.',

  'setups.view.detail.performance.cumulative-pnl': 'P&L cumulativo',
  'setups.view.detail.performance.cumulative-r': 'R cumulativo',
  'setups.view.detail.performance.drawdown': 'Drawdown',
  'setups.view.detail.performance.empty':
    'Ancora nessuna operazione collegata.',
  'setups.view.detail.performance.empty-submessage':
    'Le operazioni che usano questo setup appariranno qui quando inizierai a registrarle.',

  'setups.view.detail.analysis.performance': 'Rendimento',
  'setups.view.detail.analysis.execution-gap': 'Gap di esecuzione',
  'setups.view.detail.analysis.tabs-aria': 'Schede di rendimento del setup',
  'setups.view.detail.brief.linked-notes-add': 'Modifica note collegate',

  'setups.view.detail.execution-gap.live-pnl': 'P&L in corso',
  'setups.view.detail.execution-gap.live-r': 'R live',
  'setups.view.detail.execution-gap.missed-edge': 'Vantaggio perso',
  'setups.view.detail.execution-gap.live-plus-missed': 'Eseguite + Perse',
  'setups.view.detail.execution-gap.backtest': 'Backtest',

  'setups.view.detail.execution-gap.capture-rate': 'Tasso di cattura',
  'setups.view.detail.execution-gap.capture-rate-tooltip':
    'P&L live ÷ (P&L live + P&L delle operazioni perse). Mostra quanto vantaggio disponibile hai catturato.',
  'setups.view.detail.execution-gap.average-r-delta': 'Delta R medio',
  'setups.view.detail.execution-gap.live-execution': 'Esecuzione live',
  'setups.view.detail.execution-gap.backtest-benchmark': 'Benchmark backtest',
  'setups.view.detail.execution-gap.hidden':
    'Il gap di esecuzione è nascosto in Modalità privacy.',
  'setups.view.detail.execution-gap.empty':
    'Registra operazioni perse o operazioni di backtest per questo setup per analizzare i gap di esecuzione.',

  'setups.view.detail.brief.health': 'Stato del setup',
  'setups.view.detail.brief.profile': 'Profilo',
  'setups.view.detail.brief.linked-notes': 'Note collegate ({count})',
  'setups.view.detail.brief.linked-notes-modal.title': 'Note collegate',
  'setups.view.detail.brief.linked-notes-modal.subtitle':
    'Note collegate a {name}.',
  'setups.view.detail.brief.screenshots': 'Screenshot ({count})',
  'setups.view.detail.brief.view-all': 'Vedi tutto',
  'setups.view.detail.brief.no-screenshots':
    'Ancora nessuno screenshot collegato.',
  'setups.view.detail.brief.screenshot-alt': 'Screenshot del setup {index}',
  'setups.view.detail.brief.screenshot-open': 'Apri screenshot {index}',
  'setups.view.detail.brief.status.complete': 'Completo',
  'setups.view.detail.brief.status.missing': 'Mancante',
  'setups.view.detail.brief.health.playbook': 'Playbook',
  'setups.view.detail.brief.health.rules': 'Regole',
  'setups.view.detail.brief.health.notes': 'Note',
  'setups.view.detail.brief.health.screenshots': 'Screenshot',
  'setups.view.detail.brief.health.trades': 'Operazioni',
  'setups.view.detail.brief.count.rules': '{count} regole',
  'setups.view.detail.brief.count.notes': '{count} note',
  'setups.view.detail.brief.count.images': '{count} immagini',
  'setups.view.detail.brief.count.trades': '{count} operazioni',
  'setups.view.detail.brief.more': '+{count} in più',

  'setups.view.detail.brief.profile.direction': 'Direzione',
  'setups.view.detail.brief.profile.sessions': 'Sessioni',
  'setups.view.detail.brief.profile.timeframes': 'Timeframe',
  'setups.view.detail.brief.profile.tickers': 'Simboli',
  'setups.view.detail.brief.direction.long': 'Long',
  'setups.view.detail.brief.direction.short': 'Short',
  'setups.view.detail.brief.direction.both': 'Entrambe',
  'setups.view.detail.attention.title': 'Richiede attenzione',
  'setups.view.detail.attention.count': '{count} elementi',
  'setups.view.detail.attention.empty': 'Nessun problema nei setup.',
  'setups.view.detail.attention.show-more': '+{count} in più',
  'setups.view.detail.attention.show-less': 'Mostra meno',
  'setups.view.detail.attention.no-playbook-title':
    'Collega una nota del playbook',
  'setups.view.detail.attention.no-playbook-detail':
    'Collega una nota di origine per contesto ed esempi.',
  'setups.view.detail.attention.no-rules-title':
    'Costruisci il playbook di esecuzione',
  'setups.view.detail.attention.no-rules-detail':
    'Aggiungi criteri per ingressi, invalidazione, rischio ed errori.',

  'setups.view.detail.attention.no-trades-title':
    'Ancora nessuna operazione live',
  'setups.view.detail.attention.no-trades-detail':
    'Ancora nessuno storico di operazioni live collegate.',
  'setups.view.detail.attention.no-screenshots-title':
    'Salva screenshot di esempio',
  'setups.view.detail.attention.no-screenshots-detail':
    'Allega screenshot alle operazioni come esempi di revisione.',
  'setups.view.detail.attention.stale-title': 'Revisiona la rilevanza recente',
  'setups.view.detail.attention.stale-detail':
    'Questo setup non è stato operato da {count} giorni.',
  'setups.view.detail.attention.profit-factor-title':
    'Il rendimento richiede una revisione',
  'setups.view.detail.attention.profit-factor-detail':
    'Il fattore di profitto è sotto 1.0 sulle operazioni collegate.',
  'setups.view.detail.attention.expectancy-title': "L'aspettativa è negativa",
  'setups.view.detail.attention.expectancy-detail':
    "L'esito medio delle operazioni collegate è sotto il breakeven.",
  'setups.view.completeness.incomplete-playbook': 'Playbook incompleto',
  'setups.view.completeness.no-rules': 'Nessuna regola',
  'setups.view.completeness.no-linked-notes': 'Nessuna nota collegata',
  'setups.view.date.never': 'Mai',
  'setups.view.metric.expectancy-r': 'Aspettativa (R)',

  'setups.view.card.open-named': 'Apri {name}',
  'setups.view.card.sparkline-aria': 'Minigrafico del setup',
  'setups.view.card.status.active': 'Stabile',
  'setups.view.card.status.monitor': 'Da monitorare',
  'setups.view.card.status.review': 'Revisione',
  'setups.view.tags': 'Tag',
  'setups.view.date.today': 'Oggi',
  'setups.view.date.yesterday': 'Ieri',
  'setups.view.date.days-ago': '{count} giorni fa',
  'settings.general.copy-trading-pnl-toggled':
    'Il P&L del copy trading è {status}',

  'trade-import.restore.complete':
    'Ripristinate {written} operazioni importate; {failed} non riuscite.',
  'trade-import.restore.broker-label': 'Ripristino backend',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Trade Sync',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'Sincronizza le operazioni dai report MetaTrader caricati tramite la connessione FTP.',
  'trade-sync.source.trade-import.description':
    'Ripristina le importazioni da file Broker tra i vault e recupera le note locali mancanti.',
  'trade-sync.source.tradovate.description':
    'Sincronizza le operazioni Tradovate nel cloud e proiettale in questo vault.',
  'trade-sync.tradovate.status-failed':
    'Impossibile caricare lo stato Tradovate.',
  'trade-sync.tradovate.last-sync': 'Ultima sincronizzazione',
  'trade-sync.tradovate.last-projection': 'Ultima proiezione',
  'trade-sync.tradovate.pending-projections': '{count} proiezioni in sospeso',
  'trade-sync.tradovate.pending-acks': '{count} ACK locali in sospeso',
  'trade-sync.tradovate.never': 'Mai',

  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Sincronizza le operazioni Rithmic nel cloud e proiettale in questo vault.',
  'trade-sync.rithmic.plugin-sync-description':
    "Collega Rithmic su Journalit.co, poi sincronizza qui per scrivere l'attività Rithmic più recente in questo vault.",
  'trade-sync.rithmic.status-failed': 'Impossibile caricare lo stato Rithmic.',
  'trade-sync.rithmic.status.connecting': 'Connessione in corso',
  'trade-sync.rithmic.status.paused': 'In pausa',
  'trade-sync.rithmic.status.waiting-for-accounts': 'In attesa dei conti',
  'trade-sync.rithmic.status.reauthorization-required':
    'Riautorizzazione richiesta su Journalit.co',
  'trade-sync.rithmic.status.error': 'Errore di connessione',
  'trade-sync.rithmic.no-connections':
    'Collega un account Rithmic su Journalit.co per sincronizzarlo qui.',
  'trade-sync.rithmic.connect': 'Collega',
  'trade-sync.rithmic.manage': 'Gestisci su Journalit.co',
  'trade-sync.rithmic.system': 'Sistema Rithmic',
  'trade-sync.rithmic.accounts': 'Conti',
  'trade-sync.rithmic.last-sync': 'Ultima sincronizzazione',
  'trade-sync.rithmic.never': 'Mai',
  'trade-sync.rithmic.job.running': 'Sincronizzazione in corso…',
  'trade-sync.rithmic.job.last': 'Ultimo lavoro: {status}',
  'trade-sync.job.status.queued': 'In coda',
  'trade-sync.job.status.running': 'In esecuzione',
  'trade-sync.job.status.succeeded': 'Riuscito',
  'trade-sync.job.status.partial': 'Parziale',
  'trade-sync.job.status.failed': 'Non riuscito',
  'trade-sync.job.status.cancelled': 'Annullato',
  'trade-sync.job.status.unknown': 'Sconosciuto',
  'trade-sync.rithmic.sync-to-vault': 'Sincronizza',
  'trade-sync.rithmic.syncing': 'Sincronizzazione…',
  'trade-sync.rithmic.mapping-required':
    'Scegli un conto locale del vault per ogni account Rithmic sincronizzato.',
  'trade-sync.rithmic.sync-complete-connection':
    'Sincronizzazione di {connection} completata.',
  'trade-sync.rithmic.sync-partial-connection':
    'Sincronizzazione di {connection} completata con problemi.',
  'trade-sync.rithmic.sync-all': 'Sincronizza tutto',
  'trade-sync.rithmic.sync-all-complete':
    'Sincronizzate {succeeded} di {total} connessioni Rithmic.',
  'trade-sync.rithmic.sync-all-partial':
    'Sincronizzate {succeeded} di {total} connessioni Rithmic. Controlla le connessioni con problemi.',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic consente una sola sessione attiva. Chiudi R|Trader, NinjaTrader o qualsiasi altra piattaforma che usa questo accesso Rithmic.',
  'trade-sync.rithmic.error.auto-retry': 'Journalit riprova automaticamente.',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic ha rifiutato le credenziali salvate. Aggiornale su Journalit.co e riprova.',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic richiede la firma degli accordi sui dati di mercato in R|Trader. Firmali e riprova.',
  'trade-sync.rithmic.error.disabled':
    'La sincronizzazione Rithmic è disattivata per questa connessione. Gestiscila su Journalit.co.',
  'trade-sync.rithmic.error.sync-failed':
    'La sincronizzazione Rithmic non è riuscita. Controlla la connessione su Journalit.co e riprova.',
  'trade-sync.broker.mapping-unsaved-hint':
    "L'associazione viene salvata durante la sincronizzazione.",
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'Modifiche al conto non salvate. Sincronizza quella connessione per salvarle.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    'Scegli prima un conto Journalit per ogni conto che sincronizzi.',
  'trade-sync.broker.sync-all-blocked.running-job':
    'Una sincronizzazione è già in corso.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'Nessuna connessione è pronta per la sincronizzazione.',
  'trade-sync.rithmic.connect-another': 'Collega un altro account Rithmic',
  'trade-sync.rithmic.error.sync-failed-detail':
    'La sincronizzazione Rithmic non è riuscita: {message}',

  'trade-sync.import.card.inventory-summary':
    '{accounts} conti · {trades} operazioni',
  'trade-sync.import.action.check': 'Controlla',

  'trade-sync.import.action.open-import': 'Apri Trade Import',

  'trade-sync.import.action.create-local-account': 'Crea conto',

  'trade-sync.import.action.restore-account': 'Ripristina',
  'trade-sync.import.action.restoring': 'Ripristino…',

  'trade-sync.import.pending-acks': '{count} ACK in sospeso',

  'trade-sync.import.empty-accounts':
    'Nessun conto Trade Import in backup trovato.',
  'trade-sync.import.account.restorable-count': '{count} ripristinabili',
  'trade-sync.import.account.synced-count': '{count} sincronizzate',
  'trade-sync.import.account.missing-count': '{count} mancanti',
  'trade-sync.import.account.issue-count': '{count} problemi',
  'notice.error.canonical-trade-type-change':
    'Le operazioni sincronizzate dal broker non possono essere cambiate in un altro tipo di operazione.',
  'trade-sync.import.account.conflict-repair':
    'Trovate note duplicate con canonicalTradeId. Tieni una nota, poi elimina canonicalTradeId dalla nota duplicata o rimuovi quella nota. Rinominare il file non risolve il conflitto.',
  'trade-sync.import.account.local-account': 'Conto Journalit',
  'trade-sync.import.notice.restored':
    'Ripristinate {count} operazioni importate.',

  'trade-sync.import.notice.sync-cloud-failed':
    'Impossibile avviare la sincronizzazione cloud.',
  'trade-sync.import.notice.load-failed':
    'Impossibile caricare lo stato di sincronizzazione Trade Import.',
  'trade-sync.import.notice.mapping-failed':
    'Impossibile salvare la mappatura del conto Trade Import.',
  'trade-sync.import.notice.create-account-failed':
    'Impossibile creare il conto locale.',
  'trade-sync.import.notice.restore-failed':
    'Impossibile ripristinare il conto Trade Import.',
  'trade-sync.rate-limit.action.mapping': 'Mappatura account',
  'trade-sync.import.notice.rate-limited':
    '{action}: Troppe richieste. Riprova tra {seconds} s.',
  'command.open-session-mode': 'Apri modalità sessione',
  'view.session-mode': 'Modalità sessione',

  'session-mode.loading': 'Caricamento Modalità sessione',

  'session-mode.section.timeline': 'Cronologia',
  'session-mode.title.preparation': 'Preparazione della sessione',
  'session-mode.title.live': 'Sessione in corso',
  'session-mode.title.break': 'Pausa sessione',
  'session-mode.title.ended': 'Sessione terminata',

  'session-mode.prep.resources': 'Risorse',

  'session-mode.action.open-drc-for-date': 'Apri il DRC del {date}',
  'session-mode.ended.helper':
    'Registra le operazioni o fai la revisione della giornata.',
  'session-mode.ended.action.import-trades': 'Importa operazioni',
  'session-mode.ended.action.add-trade-manually':
    'Aggiungi operazione manualmente',
  'session-mode.ended.action.open-drc': 'Apri DRC',
  'session-log.session-group.unplanned': 'Non pianificata @ {time}',
  'session-mode.unplanned.name': 'Sessione non pianificata',
  'session-mode.unplanned.start': 'Avvia sessione non pianificata',
  'session-mode.unplanned.stop': 'Interrompi sessione',
  'session-mode.unplanned.badge': 'Non pianificata',
  'session-mode.unplanned.status.live':
    'Avviata alle {time} · {elapsed} trascorsi',
  'session-mode.unplanned.ended.summary':
    'Sessione non pianificata · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'Avvia una sessione non pianificata',
  'session-mode.unplanned.modal.description':
    'Sei fuori dalle finestre di sessione pianificate. Questa sessione verrà contrassegnata come non pianificata nella revisione giornaliera. Scrivi perché stai facendo trading adesso.',
  'session-mode.unplanned.modal.reason-label': 'Motivo',
  'session-mode.unplanned.modal.reason-placeholder':
    'es. FOMC alle 14:00, sessione mattutina persa',
  'session-mode.unplanned.modal.reason-required':
    'Inserisci un motivo prima di iniziare.',
  'session-mode.unplanned.notice.started': 'Sessione non pianificata avviata.',
  'session-mode.unplanned.notice.stopped':
    'Sessione non pianificata interrotta.',
  'session-mode.unplanned.notice.blocked-live': 'Una sessione è già in corso.',
  'session-mode.unplanned.notice.none-running':
    'Nessuna sessione non pianificata in corso.',
  'session-mode.unplanned.notice.failed':
    'Impossibile aggiornare la sessione non pianificata. Controlla la console per i dettagli.',
  'session-mode.ended.stat.trades': 'Operazioni',
  'session-mode.ended.stat.notes': 'Note',
  'session-mode.ended.stat.gate-checks': 'Controlli Trade Gate',
  'session-mode.waiting.next-session': 'Prossima sessione',
  'session-mode.waiting.starts-at': '{session} inizia alle {time}',
  'session-mode.waiting.preparation-opens-in':
    'La preparazione si apre tra {remaining}',
  'session-mode.waiting.open-drc': 'Apri DRC',

  'session-mode.break.reset-before': 'Azzeramento prima di {session}',
  'session-mode.break.reset': 'Azzeramento prima della prossima sessione',
  'session-mode.break.next-session-meta':
    'La prossima sessione inizia alle {time} · {remaining} rimanenti',
  'session-mode.break.description':
    'Fai una pausa, idratati e sgombra la mente prima della prossima sessione.',
  'session-mode.break.open-drc': 'Apri DRC',
  'session-mode.countdown.starts-in': 'Inizia tra',
  'session-mode.countdown.starts-at': '{session} inizia alle {time}',
  'session-mode.countdown.hours': 'ore',
  'session-mode.countdown.minutes': 'min',
  'session-mode.countdown.seconds': 'sec',
  'session-mode.phase.preparation': 'Preparazione',
  'session-mode.phase.live': 'In corso',
  'session-mode.phase.waiting': 'In attesa',
  'session-mode.phase.break': 'Pausa',
  'session-mode.phase.ended': 'Terminata',
  'session-mode.phase.unconfigured': 'Orario delle sessioni non configurato',
  'session-mode.status.preparation':
    '{session} inizia alle {time}. Hai {remaining} per prepararti.',
  'session-mode.status.preparation-generic':
    'Preparati per la prossima sessione di trading.',
  'session-mode.status.waiting':
    '{session} inizia alle {time}. La preparazione inizia tra {remaining}.',
  'session-mode.status.waiting-generic':
    'La prossima sessione è in programma, ma la preparazione non è ancora iniziata.',
  'session-mode.status.live': '{remaining} rimanenti in questa sessione.',
  'session-mode.status.live-generic': 'La tua sessione di trading è in corso.',
  'session-mode.status.break':
    '{session} inizia alle {time}. Sei in pausa per {remaining}.',
  'session-mode.status.break-generic':
    "Sei tra una sessione di trading e l'altra.",
  'session-mode.status.ended':
    'Le sessioni di trading configurate sono finite per ora.',
  'session-mode.status.unconfigured':
    'Configura le finestre di sessione per sbloccare le fasi di preparazione, in corso, pausa e fine. La cronologia resta disponibile per il DRC di oggi.',

  'session-mode.unconfigured.title': 'Configura la Modalità sessione',
  'session-mode.unconfigured.description':
    'Aggiungi gli orari delle sessioni per iniziare.',
  'session-mode.unconfigured.step.window.title':
    'Aggiungi una finestra di sessione',

  'session-mode.unconfigured.step.prep.title':
    'Controlla i tempi di preparazione',

  'session-mode.unconfigured.step.gate.title': 'Usa il Trade Gate iniziale',

  'session-mode.unconfigured.step.log.title':
    'Registra note durante le sessioni in corso',

  'session-mode.unconfigured.action': 'Configura Modalità sessione',
  'session-mode.guide.why.title': 'Opera il tuo piano, non il tuo umore',
  'session-mode.guide.why.description':
    'La modalità sessione ti prepara prima di ogni sessione, ti fa rispettare le regole con un Trade Gate mentre è in corso e tiene un registro con orari per rivivere la giornata. Si configura in due minuti.',
  'session-mode.guide.configure.title': 'Configurala adesso',
  'session-mode.guide.configure.description':
    'Aggiungi gli orari delle sessioni e crea il tuo primo Trade Gate. Una breve guida ti accompagnerà nelle impostazioni.',
  'session-mode.guide.preparation.countdown.title':
    'La tua sessione sta per iniziare',
  'session-mode.guide.preparation.countdown.description':
    'Questa è la fase di preparazione. Il conto alla rovescia mostra quando vai in diretta, e questa pagina passa da sola alla modalità in diretta.',
  'session-mode.guide.preparation.goals.title': 'Fissa gli obiettivi di oggi',
  'session-mode.guide.preparation.goals.description':
    "Scrivi com'è una buona sessione prima dell'apertura, così hai un riferimento a cui attenerti.",
  'session-mode.guide.preparation.checklist.title':
    'Scorri la tua lista di controllo',
  'session-mode.guide.preparation.checklist.description':
    'Spunta qui la tua routine pre-sessione. Tutto ciò che spunti viene salvato nella nota di revisione di oggi.',
  'session-mode.guide.preparation.next.title': 'Quando vai in diretta',
  'session-mode.guide.preparation.next.description':
    'Il tuo Trade Gate e il registro sessione compariranno qui. Te li mostreremo la prima volta.',
  'session-mode.guide.live.trade-gate.title':
    'Passa dal Trade Gate prima di ogni operazione',
  'session-mode.guide.live.trade-gate.description':
    'Premi Avvia e rispondi alle domande create dai tuoi criteri. Il gate finisce con via libera, aspetta o niente operazione, così prendi solo le operazioni che il tuo sistema consente.',
  'session-mode.guide.live.session-log.title': 'Registra ciò che vedi e senti',
  'session-mode.guide.live.session-log.description':
    "Annota setup, emozioni e decisioni mentre accadono. Ogni nota ha l'orario, così dopo puoi rivivere esattamente cosa stava succedendo.",
  'session-mode.guide.live.settings.title': 'Regolala quando vuoi',
  'session-mode.guide.live.settings.description':
    'Modifica apre le impostazioni della modalità sessione: orari, layout per fase, flussi Trade Gate e tag del registro.',
  'session-mode.guide.ended.review.title': 'Ora rivedi la sessione',
  'session-mode.guide.ended.review.description':
    'Apri il DRC di oggi per la revisione. Aggiungi il widget Registro sessione al layout DRC e ogni nota con orario comparirà lì.',
  'settings.session-mode.guide.setting-name': 'Guida',
  'settings.session-mode.guide.setting-desc':
    'Un breve tour di queste impostazioni, dagli orari al tuo primo Trade Gate.',
  'settings.session-mode.guide.replay': 'Mostra guida',
  'settings.session-mode.guide.intro.title':
    'Configuriamo la modalità sessione',
  'settings.session-mode.guide.intro.description':
    'Quattro cose: quando si svolgono le sessioni, cosa mostra ogni fase, il tuo Trade Gate e i tag del registro.',
  'settings.session-mode.guide.lead-time.title': 'Anticipo della preparazione',
  'settings.session-mode.guide.lead-time.description':
    'Quanti minuti prima di una sessione si apre la fase di preparazione.',
  'settings.session-mode.guide.windows.title':
    'Aggiungi le finestre di sessione',
  'settings.session-mode.guide.windows.description':
    'Una finestra per ogni sessione che operi, con nome, inizio e fine. Così la modalità sessione sa quando preparare e quando sei in diretta.',
  'settings.session-mode.guide.layout.title': 'Scegli cosa mostra ogni fase',
  'settings.session-mode.guide.layout.description':
    'Attiva o disattiva i moduli per fase: risorse, obiettivi e lista di controllo in preparazione; Trade Gate e cronologia in diretta.',
  'settings.session-mode.guide.trade-gate.title':
    'Costruisci il tuo Trade Gate',
  'settings.session-mode.guide.trade-gate.description':
    'Aggiungi crea la prima volta un flusso iniziale con domande comuni, poi uno vuoto; la libreria ha domande pronte. Ogni domanda porta alla successiva o a un esito: via libera, aspetta o niente operazione.',
  'settings.session-mode.guide.editor.title': 'Domande ed esiti',
  'settings.session-mode.guide.editor.description':
    'Espandi un flusso per aggiungere domande e decidere dove porta ogni risposta. Il pulsante di riproduzione lo esegue proprio come lo vedrai in sessione.',
  'settings.session-mode.guide.tags.title': 'Tag per il registro sessione',
  'settings.session-mode.guide.tags.description':
    'Tagga le note mentre le registri, per esempio per emozione o setup, così potrai filtrarle nella revisione.',
  'settings.session-mode.guide.finish.title': 'Tutto pronto',
  'settings.session-mode.guide.finish.description':
    'Apri la modalità sessione dalla barra o da Home. Aggiungi il widget Registro sessione al layout DRC per vedere le note in ogni revisione.',

  'session-mode.layout.empty.title': 'Niente di attivo per questa fase',
  'session-mode.layout.empty.description':
    'Riattiva i moduli per costruire questa fase della Modalità sessione.',
  'session-mode.duration.minutes': '{minutes}m',
  'session-mode.duration.hours': '{hours}h',
  'session-mode.duration.hours-minutes': '{hours}h {minutes}m',
  'settings.session-mode.title': 'Modalità sessione',
  'settings.session-mode.description':
    'Configura le finestre di sessione, la preparazione, il layout delle fasi, i flussi Trade Gate e i tag del registro di sessione.',
  'settings.session-mode.preparation-lead-time':
    'Anticipo della preparazione (minuti)',
  'settings.session-mode.preparation-lead-time-desc':
    'Quanto prima inizia la modalità preparazione rispetto a una sessione.',
  'settings.session-mode.windows': 'Finestre di sessione',

  'settings.session-mode.add-window-short': 'Aggiungi',
  'settings.session-mode.no-windows':
    'Nessuna finestra di sessione configurata. La cronologia in tempo reale funziona comunque, ma la preparazione basata sulle fasi inizia dopo aver aggiunto una finestra.',
  'settings.session-mode.layout.title': 'Layout delle fasi',

  'settings.session-mode.layout.phase-desc.preparation':
    'Scegli cosa mostrare durante la preparazione pre-sessione, prima che inizi il trading.',
  'settings.session-mode.layout.phase-desc.live':
    'Scegli cosa mostrare mentre una sessione di trading configurata è in corso.',

  'settings.session-mode.layout.phase-desc.ended':
    'Scegli cosa mostrare dopo che tutte le sessioni di trading configurate sono terminate.',
  'settings.session-mode.layout.reset-phase': 'Ripristina',

  'settings.session-mode.layout.module.preparation-resources': 'Risorse',
  'settings.session-mode.layout.module.preparation-resources-desc':
    'Mostra le note di preparazione e i playbook collegati.',
  'settings.session-mode.layout.module.preparation-goals': 'Obiettivi',
  'settings.session-mode.layout.module.preparation-goals-desc':
    'Mostra il widget obiettivi del DRC per il focus pre-sessione.',
  'settings.session-mode.layout.module.preparation-checklist':
    'Lista di controllo',
  'settings.session-mode.layout.module.preparation-checklist-desc':
    'Mostra il widget lista di controllo del DRC per la preparazione pre-sessione.',
  'settings.session-mode.layout.module.trade-gate': 'Trade Gate',
  'settings.session-mode.layout.module.trade-gate-desc':
    'Esegue il flusso SE/ALLORA configurato durante la sessione in corso.',
  'settings.session-mode.layout.module.timeline': 'Cronologia della sessione',
  'settings.session-mode.layout.module.timeline-desc':
    'Mostra le note della sessione corrente e le voci della cronologia delle operazioni.',

  'settings.session-mode.layout.module.ended-actions':
    'Azioni di fine sessione',
  'settings.session-mode.layout.module.ended-actions-desc':
    'Mostra le azioni di importazione, operazione manuale e DRC dopo la fine delle sessioni.',
  'settings.session-mode.layout.module.ended-stats':
    'Statistiche della sessione',
  'settings.session-mode.layout.module.ended-stats-desc':
    'Mostra i totali di operazioni, note e controlli Trade Gate della giornata.',
  'settings.session-mode.linked-resources': 'Risorse collegate',
  'settings.session-mode.linked-resources-desc':
    'Mostra i collegamenti rapidi alle note durante la preparazione.',
  'settings.session-mode.linked-resources-count': '{count} collegate',
  'settings.session-mode.linked-resources-hide': 'Nascondi collegate',
  'settings.session-mode.session-log': 'Registro di sessione',
  'settings.session-mode.session-log-desc':
    'Scegli quali eventi automatici compaiono insieme alle note di sessione.',
  'settings.session-mode.show-trade-executions':
    'Ingressi e uscite delle operazioni',
  'settings.session-mode.show-trade-executions-desc':
    'Mostra ingressi e uscite delle operazioni nel registro della Modalità sessione e della revisione giornaliera.',
  'settings.session-mode.session-log-tags': 'Tag del registro di sessione',
  'settings.session-mode.session-log-tags-desc':
    "Personalizza i tag disponibili nell'editor della Modalità sessione e nel registro di sessione del DRC.",
  'settings.session-mode.tag-label-placeholder': 'Nome del tag',
  'settings.session-mode.tag-short-label-placeholder': 'Etichetta',
  'settings.session-mode.tag-label-example': 'Operazione',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Colore del tag',
  'settings.session-mode.tag-requires-resolution': 'Richiede classificazione',
  'settings.session-mode.tag-lesson': 'Tag lezione',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Le voci con questo tag sono trattate come note non categorizzate. Usalo quando il tag giusto non è chiaro durante la sessione; classifica la voce in seguito.',
  'settings.session-mode.tag-lesson-tooltip':
    'Contrassegna questo tag come voce di apprendimento. Le note con tag lezione restano nel registro di sessione e possono comparire nei filtri delle lezioni e nei riassunti di revisione.',
  'settings.session-mode.add-session-log-tag':
    'Aggiungi tag del registro di sessione',
  'settings.session-mode.reset-session-log-tags': 'Ripristina',
  'settings.session-mode.tag-color.blue': 'Blu',
  'settings.session-mode.tag-color.indigo': 'Indaco',
  'settings.session-mode.tag-color.purple': 'Viola',
  'settings.session-mode.tag-color.green': 'Verde',
  'settings.session-mode.tag-color.pink': 'Rosa',
  'settings.session-mode.tag-color.amber': 'Ambra',
  'settings.session-mode.tag-color.red': 'Rosso',
  'settings.session-mode.tag-color.orange': 'Arancione',
  'settings.session-mode.search-resource-placeholder':
    'Cerca file del vault da collegare…',

  'settings.session-mode.window-name': 'Nome della sessione',
  'settings.session-mode.window-name-placeholder': 'es. NY AM',

  'settings.session-mode.start-time': 'Ora di inizio',
  'settings.session-mode.end-time': 'Ora di fine',
  'widget.session-log.name': 'Registro di sessione',
  'widget.session-log.description':
    'Registra note di esecuzione con orario ed eventi delle operazioni.',
  'session-log.title': 'Registro della modalità sessione',
  'session-log.description':
    'Registra quello che succede durante la sessione di trading corrente.',
  'session-log.notice.invalid-timestamp':
    'Inserisci un orario valido del registro di sessione.',
  'session-log.action.auto-time': 'Ora automatica',
  'session-log.action.set-time': 'Imposta ora',

  'session-log.composer.tag-label': 'Tag del registro di sessione',
  'session-log.placeholder.entry-short': 'Aggiungi nota di sessione...',
  'session-log.action.add-entry': 'Aggiungi voce con orario',
  'session-log.action.add-note': 'Aggiungi',
  'session-log.action.hide-composer': 'Nascondi editor',
  'session-log.filter.all': 'Tutti',
  'session-log.filter.label': 'Filtra registro di sessione',
  'session-log.filter.clear': 'Azzera filtro',
  'session-log.timeline.most-recent': 'Più recente',
  'session-log.timeline.start': 'Inizio sessione',
  'session-log.empty': 'Nessuna voce nel registro di sessione.',
  'session-log.empty-filtered': 'Nessuna voce corrisponde a questo filtro.',
  'session-log.loading': 'Caricamento registro di sessione…',
  'session-log.session-group.outside': 'Fuori dalle sessioni',
  'session-log.lessons.title': 'Lezioni apprese',

  'session-log.lessons.badge': 'LSN',

  'session-log.trade.entered': 'Ingresso',
  'session-log.trade.exited': 'Uscita',
  'session-log.trade.size': 'quantità',

  'session-log.status.unclassified': 'non classificato',
  'session-log.action.save': 'Salva',
  'session-log.action.cancel': 'Annulla',

  'session-log.action.classify': 'Classifica',
  'session-log.action.edit': 'Modifica',
  'session-log.action.delete': 'Elimina',
  'session-log.action.open-trade': 'Apri operazione',
  'session-log.preview':
    'Anteprima del registro di sessione: note con orario ed eventi delle operazioni appariranno qui durante la modalità sessione.',
  'session-log.alert.tag-concentration':
    '{tag} è il {percentage}% delle note di sessione ({count}/{total}). La mentalità è stata un tema centrale in questa sessione.',

  'trade-gate.workflow': 'Flusso di lavoro',

  'trade-gate.action.start-short': 'Avvia',
  'trade-gate.action.start-another': 'Avvia un altro',
  'trade-gate.outcome.green-light': 'Luce verde',
  'trade-gate.outcome.green-light-description': 'Condizioni soddisfatte.',
  'trade-gate.outcome.no-trade': 'Nessuna operazione',
  'trade-gate.outcome.no-trade-description':
    'Le condizioni non sono soddisfatte.',
  'trade-gate.outcome.wait': 'Attendi',
  'trade-gate.outcome.wait-description':
    'Il Setup non è pronto. Attendi la prossima opportunità.',
  'settings.session-mode.trade-gate.title': 'Flussi Trade Gate',
  'settings.session-mode.trade-gate.desc':
    'Crea flussi decisionali SE/ALLORA per i controlli di ingresso in tempo reale.',
  'settings.session-mode.trade-gate.delete-workflow.title':
    'Eliminare il flusso Trade Gate?',
  'settings.session-mode.trade-gate.delete-workflow.message':
    'Eliminare “{name}”? Verranno rimosse tutte le domande e i rami di questo flusso. Questa azione non può essere annullata.',
  'settings.session-mode.trade-gate.delete-workflow.confirm': 'Elimina flusso',
  'settings.session-mode.trade-gate.name': 'Nome del flusso',
  'settings.session-mode.trade-gate.untitled': 'Flusso senza titolo',
  'settings.session-mode.trade-gate.start-node': 'Domanda iniziale',
  'settings.session-mode.trade-gate.simulation.show': 'Simula',
  'settings.session-mode.trade-gate.simulation.unavailable':
    'Collega la domanda iniziale ad almeno un esito completo prima di avviare la simulazione.',
  'settings.session-mode.trade-gate.add-question': 'Aggiungi domanda',
  'settings.session-mode.trade-gate.question': 'Domanda',
  'settings.session-mode.trade-gate.new-question-title': 'Nuova domanda',
  'settings.session-mode.trade-gate.edit-question': 'Modifica domanda',
  'settings.session-mode.trade-gate.question-title': 'Titolo della domanda',
  'settings.session-mode.trade-gate.prompt': 'Testo',
  'settings.session-mode.trade-gate.options': 'Opzioni',
  'settings.session-mode.trade-gate.option': 'Opzione',
  'settings.session-mode.trade-gate.no-options':
    'Aggiungi le opzioni di risposta per questa domanda.',
  'settings.session-mode.trade-gate.option-label': "Etichetta dell'opzione",
  'settings.session-mode.trade-gate.option-target': 'Porta a',
  'settings.session-mode.trade-gate.not-wired': 'Non ancora collegata',
  'settings.session-mode.trade-gate.not-wired-hint': 'Fai clic per collegare',
  'settings.session-mode.trade-gate.target-group-questions': 'Domande',
  'settings.session-mode.trade-gate.target-current': 'Attuale: {title}',
  'settings.session-mode.trade-gate.target-group-outcomes': 'Esiti',
  'settings.session-mode.trade-gate.new-question-target': '+ Nuova domanda',
  'settings.session-mode.trade-gate.outcome-note':
    "Nota sull'esito (solo questo ramo)",
  'settings.session-mode.trade-gate.remove-from-workflow':
    'Rimuovi da questo flusso',
  'settings.session-mode.trade-gate.used-in-workflows':
    'Usata in {count} flussi',
  'settings.session-mode.trade-gate.not-used': 'Non ancora usata',
  'settings.session-mode.trade-gate.question-count': '{count} domande',
  'settings.session-mode.trade-gate.library-title': 'Libreria delle domande',
  'settings.session-mode.trade-gate.library-search': 'Cerca domande...',
  'settings.session-mode.trade-gate.library-empty':
    'Nessuna domanda trovata. Creane una per iniziare.',
  'settings.session-mode.trade-gate.delete-question.title':
    'Eliminare la domanda?',
  'settings.session-mode.trade-gate.delete-question.message':
    'Eliminare “{name}” dalla libreria delle domande? Questa azione non può essere annullata.',
  'settings.session-mode.trade-gate.delete-question.message-used':
    'Eliminare “{name}” dalla libreria delle domande? È usata in: {workflows}. I suoi rami in quei flussi verranno rimossi. Questa azione non può essere annullata.',
  'settings.session-mode.trade-gate.delete-question.confirm': 'Elimina domanda',
  'settings.session-mode.trade-gate.unplaced-title':
    'In questo flusso, non ancora collegata',
  'settings.session-mode.trade-gate.flow-map': 'Mappa del flusso',
  'settings.session-mode.trade-gate.flow-fit': 'Adatta',
  'settings.session-mode.trade-gate.flow-click-hint':
    "Fai clic su una scheda, sull'etichetta di un percorso o su un esito per modificarlo.",
  'settings.session-mode.trade-gate.flow-truncated':
    'Questo flusso è troppo grande per essere mostrato per intero. Alcuni rami ripetuti sono nascosti.',
  'settings.session-mode.trade-gate.no-start':
    'Scegli una domanda iniziale per vedere il flusso.',
  'settings.session-mode.trade-gate.no-questions':
    'Aggiungi la prima domanda per iniziare questo flusso.',
  'filter.modal.image.annotation-status': "Stato dell'annotazione",
  'filter.modal.image.status.tagged': 'Con tag',
  'filter.modal.image.status.untagged': 'Senza tag',
  'filter.modal.image.status.has-notes': 'Con note',
  'filter.modal.image.status.no-notes': 'Senza note',
  'filter.modal.image.tags': 'Tag dei media',
  'setups.view.detail.action.gallery': 'Apri galleria',
  'tradelog.mode.label': 'Modalità Registro operazioni',
  'tradelog.mode.trades': 'Operazioni',
  'tradelog.mode.image-gallery': 'Galleria',

  'imageGallery.empty.error.title': 'Galleria non disponibile',
  'imageGallery.empty.no-images.title': 'Nessun media ancora',
  'imageGallery.empty.no-images.description':
    'Immagini, GIF, video e link YouTube allegati alle operazioni o alle note di revisione appariranno qui automaticamente.',
  'imageGallery.empty.no-results.title':
    'Nessun media corrisponde a questi filtri',
  'imageGallery.empty.no-results.description':
    "Prova a pulire i filtri attivi o ad allargare l'intervallo di date per vedere più elementi della galleria.",
  'imageGallery.empty.no-source.title': 'Nessun media in questa origine',
  'imageGallery.empty.no-source.description':
    "Questa origine non ha ancora elementi in galleria. Torna a tutti i media o scegli un'altra origine.",
  'imageGallery.empty.action.clear-filters': 'Azzera filtri',
  'imageGallery.empty.action.show-all': 'Mostra tutti i media',
  'imageGallery.error.load-failed': 'Impossibile caricare la galleria.',

  'imageGallery.open-source': 'Apri origine',
  'imageGallery.image-alt': 'Media di {source} del {date}',
  'imageGallery.privacy-blurred': 'Oscurato per privacy',

  'imageGallery.sort.label': 'Ordina:',
  'imageGallery.sort.newest': 'Più recenti',
  'imageGallery.sort.oldest': 'Più vecchie',
  'imageGallery.sort.best': 'P&L migliore',
  'imageGallery.sort.worst': 'P&L peggiore',
  'imageGallery.size-aria': 'Dimensione dei media della galleria',
  'imageGallery.size.small': 'Piccolo',
  'imageGallery.size.medium': 'Medio',
  'imageGallery.size.large': 'Grande',
  'imageGallery.view-mode-aria': 'Raggruppamento delle schede della galleria',
  'imageGallery.view-mode.grouped': 'Raggruppate',
  'imageGallery.view-mode.individual': 'Singole',
  'imageGallery.group.additional-media': '{count} altri elementi media',
  'imageGallery.group.annotation-summary':
    '{annotated} di {total} elementi media annotati',
  'imageGallery.group.navigation':
    'Elemento {mediaCurrent} di {mediaTotal} · Voce {groupCurrent} di {groupTotal}',
  'imageGallery.source.label': 'Origine:',
  'imageGallery.source.all': 'Tutti i media',
  'imageGallery.source.trade': 'Operazioni',
  'imageGallery.source.folder': 'Cartelle',
  'imageGallery.source.reviews': 'Revisioni',
  'imageGallery.source.drc': 'Revisioni giornaliere',
  'imageGallery.source.weekly': 'Revisioni settimanali',
  'imageGallery.source.monthly': 'Revisioni mensili',
  'imageGallery.source.quarterly': 'Revisioni trimestrali',
  'imageGallery.source.yearly': 'Revisioni annuali',

  'imageGallery.annotation.reviewed': 'Revisionata',
  'imageGallery.annotation.unreviewed': 'Non revisionata',
  'imageGallery.date.unknown': 'Data sconosciuta',
  'imageGallery.annotation.tag': 'Tag',

  'imageGallery.annotation.editor-title': 'Annota media',
  'imageGallery.annotation.editor-title-with-file': 'Annota {fileName}',
  'imageGallery.annotation.tags': 'Tag',
  'imageGallery.annotation.tags-placeholder': 'Breakout, A+ Setup, Errore',
  'imageGallery.annotation.notes': 'Note',
  'imageGallery.annotation.notes-placeholder':
    'Cosa deve imparare il tuo io futuro da questo grafico?',
  'imageGallery.annotation.error.save-failed':
    "Impossibile salvare l'annotazione del media.",
  'imageGallery.annotation.error.load-failed':
    "Impossibile caricare l'annotazione del media.",
  'imageGallery.annotation.saving': 'Salvataggio...',
  'settings.gallery-folders.section': 'Galleria media',
  'settings.gallery-folders.description':
    'Mostra i media di queste cartelle nella galleria del Registro operazioni.',
  'settings.gallery-folders.placeholder': 'Scegli una cartella...',
  'settings.gallery-folders.add': 'Aggiungi',
  'settings.gallery-folders.remove-aria':
    'Rimuovi la cartella della galleria {path}',
  'settings.gallery-folders.not-a-folder':
    'Seleziona una cartella, non un file media.',
  'settings.gallery-folders.save-failed':
    'Impossibile salvare le cartelle della galleria. Riprova.',
  'tradelog.guide.switch-to-gallery.title':
    'Passa dalle operazioni alla Galleria',
  'tradelog.guide.switch-to-gallery.description':
    'Usa questo selettore per passare dal Registro operazioni alla Galleria. Fai clic su Galleria per continuare il tour con immagini, GIF, video e link YouTube.',

  'tradelog.guide.gallery-grouping.title':
    'Raggruppa i media per voce del diario',
  'tradelog.guide.gallery-grouping.description':
    'Raggruppati tiene insieme ogni operazione, revisione o cartella configurata. Singoli mostra ogni media come scheda propria.',
  'tradelog.guide.gallery-source-sort.title':
    "Scegli la fonte e l'ordine dei media",
  'tradelog.guide.gallery-source-sort.description':
    "Usa Fonte per concentrarti su tutti i media, gli allegati delle operazioni, i media delle note di revisione o le cartelle del vault configurate. Usa Ordina per revisionare dal più recente al più vecchio o per rendimento dell'operazione.",
  'tradelog.guide.gallery-size.title': "Regola la dimensione dell'anteprima",
  'tradelog.guide.gallery-size.description':
    'Usa questi pulsanti per passare da una scansione compatta ad anteprime più grandi.',
  'tradelog.guide.gallery-filters.title':
    'Filtra la galleria dallo stesso punto di ingresso',
  'tradelog.guide.gallery-filters.description':
    'Il menu dei filtri funziona allo stesso modo. In modalità Galleria include anche una sezione Galleria con filtri per i media, come lo stato delle annotazioni e i tag dei media.',
  'tradelog.guide.gallery-grid.title':
    'Apri i media per una revisione più attenta',
  'tradelog.guide.gallery-grid.description':
    'Ogni scheda tiene il media in evidenza e mostra un contesto compatto di operazione e revisione. Fai clic su una scheda, oppure premi Avanti per aprire il primo elemento visibile a schermo intero.',
  'tradelog.guide.gallery-fullscreen-actions.title':
    'Annota i media a schermo intero',
  'tradelog.guide.gallery-fullscreen-actions.description':
    "Usa Tag per aggiungere tag e note a livello di media mentre l'elemento è abbastanza grande da ispezionarlo. Apri origine apre il file media dell'operazione, della revisione o della cartella.",
  'tradelog.guide.gallery-open-annotation.title':
    'Apri il pannello annotazioni',
  'tradelog.guide.gallery-open-annotation.description':
    "Fai clic su Tag per annotare questo media. I tag e le note media descrivono l'allegato, non tutta l'operazione.",
  'tradelog.guide.gallery-annotation-panel.title': 'Aggiungi tag e note media',
  'tradelog.guide.gallery-annotation-panel.description':
    'Usa i tag media per idee specifiche del grafico, come sweep di liquidità o breakout fallito, e le note per il contesto di market structure che vuoi ricordare.',
  'tradelog.guide.gallery-finish.title':
    'Ora conosci entrambe le modalità del Registro operazioni',
  'tradelog.guide.gallery-finish.description':
    'Usa Operazioni quando ti servono la tabella e gli strumenti in blocco. Usa Galleria quando vuoi revisionare immagini, GIF, video, link YouTube e annotazioni in tutto il diario.',
  'filter.menu.whats-new.open.title': 'I filtri hanno un nuovo menu',
  'filter.menu.whats-new.open.description':
    'Tutti i filtri ora stanno in un unico menu a livelli, con due nuovi modi per restringere le tue operazioni. Aprilo per vederli.',
  'filter.menu.whats-new.exclude.title': 'Escludi ciò che non vuoi',
  'filter.menu.whats-new.exclude.description':
    'Ogni valore ha un pulsante ⊘. Escludere un valore toglie ogni operazione che lo contiene, qualunque altra cosa corrisponda.',
  'filter.menu.whats-new.match.title': 'Scegli come corrispondono più valori',
  'filter.menu.whats-new.match.description':
    'Se scegli più valori, decidi se un’operazione deve averne «Uno qualsiasi», «Tutti», «Solo questi» o «Esattamente questi». Tag, setup, errori e campi personalizzati hanno tutti questa opzione Corrispondenza.',
  'filter.menu.whats-new.phases.title': 'Filtra per fase della challenge',
  'filter.menu.whats-new.phases.description':
    'I conti prop con più di una fase aprono l’elenco delle loro fasi. Scegli singole fasi invece dell’intero conto.',
  'filter.menu.whats-new.done.title': 'Ecco le novità dei filtri',
  'filter.menu.whats-new.done.description':
    'Lo stesso menu funziona nel Registro operazioni, nella Dashboard, in Home, nei Setup e nelle revisioni. Le modifiche si applicano appena fai clic.',
  'tradelog.guide.image-gallery-empty.intro.title': 'Nessun media',
  'tradelog.guide.image-gallery-empty.intro.description':
    'Aggiungi media alle operazioni o alle note di revisione, oppure configura le cartelle Galleria media nelle Impostazioni di trading. Quando ci sono media, Journalit mostrerà la guida completa della galleria per revisione a schermo intero, tag e note.',

  'filter.modal.section.image-gallery': 'Galleria',
  'filter.modal.session-tags.placeholder': 'Tag di sessione',
  'filter.modal.session-tags.none-found': 'Nessun tag di sessione trovato',

  'home.mode.overview': 'Panoramica',
  'home.mode.dashboard': 'Dashboard',
  'home.mode.aria': 'Cambia modalità Home',
  'home.filters.period': 'Periodo',
  'home.filters.trade-type': 'Tipo di operazione',
  'home.filters.accounts': 'Conti',
  'home.filters.back': 'Indietro',
  'filter.reset': 'Reimposta filtri',
  'filter.menu.title': 'Filtra per',
  'filter.menu.accounts': 'Conti',
  'filter.menu.tickers': 'Ticker',
  'filter.menu.setups': 'Setup',
  'filter.menu.tags': 'Tag',
  'filter.menu.mistakes': 'Errori',
  'filter.menu.trade-type': 'Tipo di trade',
  'filter.menu.status': 'Stato',
  'filter.menu.direction': 'Direzione',
  'filter.menu.review-status': 'Stato revisione',
  'filter.menu.status.cancelled': 'Annullato',
  'filter.menu.included-count': '{count} inclusi',
  'filter.menu.excluded-count': '{count} esclusi',
  'filter.menu.search': 'Cerca',
  'filter.menu.no-matches': 'Nessun risultato',
  'filter.menu.no-options': 'Ancora niente da filtrare',
  'filter.menu.clear': 'Cancella',
  'filter.menu.match.label': 'Corrispondenza',
  'filter.menu.match.any': 'Uno qualsiasi',
  'filter.menu.match.all': 'Tutti',
  'filter.menu.match.only': 'Solo questi',
  'filter.menu.match.exact': 'Esattamente questi',
  'filter.menu.match.hint.any': 'Trade con almeno uno dei valori selezionati.',
  'filter.menu.match.hint.all':
    'Trade con tutti i valori selezionati. Sono ammessi altri valori.',
  'filter.menu.match.hint.only':
    'Trade i cui valori sono tutti tra quelli selezionati.',
  'filter.menu.match.hint.exact':
    'Trade con esattamente i valori selezionati, né più né meno.',
  'filter.menu.match.no-value-any-only': 'Solo con «Uno qualsiasi»',
  'filter.menu.exclude-value': 'Escludi {label}',
  'filter.menu.match.badge.all': 'Tutti',
  'filter.menu.match.badge.only': 'Solo',
  'filter.menu.match.badge.exact': 'Esatto',
  'home.guide.modes.title': "Un'ultima cosa: la Dashboard",
  'home.guide.modes.description':
    'Panoramica e Dashboard condividono questa pagina. Passa ora a Dashboard per continuare con un breve tour delle statistiche di prestazioni.',
  'home.guide.whats-new.mode.title': 'Una Home, due modalità',
  'home.guide.whats-new.mode.description':
    'Panoramica e Dashboard ora condividono una sola pagina. Cambia modalità qui senza perdere layout o posizione di scorrimento.',
  'home.guide.whats-new.filters.title': 'I filtri Home sono in un unico posto',
  'home.guide.whats-new.filters.description':
    'Fai clic sul pulsante filtro per scegliere Periodo, Tipo di operazione o Conti da un menu compatto a livelli.',
  'home.guide.whats-new.done.title': "Il tuo spazio di lavoro resta dov'era",
  'home.guide.whats-new.done.description':
    "Usa Panoramica per i tuoi widget personali e Dashboard per un'analisi più approfondita. Ogni modalità mantiene i propri filtri e il proprio layout.",

  'view.home': 'Home',
  'common.lose': 'Perdita',

  'dashboard.conversion.requires-conversion':
    'I grafici P&L multi-valuta richiedono la conversione dei tassi di cambio.',

  'auth.error.invalid-email': 'Inserisci un indirizzo email valido',
  'auth.error.invalid-code': 'Codice di verifica non valido',
  'form.layout.guide-trigger-label': 'Personalizza modulo',
  'dashboard.filter.setup.none-found': 'Nessun setup trovato',
  'nav.weekly': 'Revisione settimanale',
  'weekly.overview.drawdown-chart.empty': 'Nessun dato di drawdown da mostrare',
  'trade-sync.gate.signin.cta': 'Accedi',
  'backend.progress.ftp.desc': 'Crea credenziali',
  'csv.errors.group.close-only':
    'Le esecuzioni di sola chiusura sono state saltate',
  'csv.report.file': 'File: {file}',
  'csv.broker-guide.sierrachart.warning.message':
    "L'opzione Export salva i prezzi non rettificati. Save Log As conserva i prezzi come visualizzati.",
  'csv.broker-guide.rithmic.step-1':
    'Apri Order History in R | Trader Pro e filtra gli ordini Completed/Filled per il tuo conto/data',
  'csv.broker-guide.rithmic.step-2':
    'Usa Add/Remove Columns e assicurati che Side, Symbol, Qty Filled, Avg Fill Price e Fill/Update Time siano visibili',
  'trade.details.execution': 'Esecuzione',
  'drc.preparation.checklist.title': 'Lista di controllo pre-operazione',
  'onboarding.welcome.insight.timing.title': 'Schemi temporali',
  'onboarding.wizard.error.account-service':
    'Servizio dei conti non disponibile',
  'account.create.field.drawdown-type-desc':
    'Nessuno | Fisso | EOD Trailing | Manuale',
  'account.edit.field.drawdown-type-desc':
    'Nessuno | Fisso | EOD Trailing | Manuale',
  'monthly.game.header.a-games': 'A-Game',
  'trade-import.preview.message.no-open-match':
    "Nessuna operazione aperta corrispondente per l'anteprima di sola chiusura",
  'setups.view.action.refresh': 'Aggiorna',
  'setups.view.detail.no-playbook': 'Ancora nessun playbook scritto.',
  'setups.view.detail.execution-gap.title': 'Gap di esecuzione',
  'trade-sync.import.action.sync-cloud': 'Sincronizza operazioni cloud',
  'session-mode.unconfigured.step.gate.description':
    'La lista di controllo SE/ALLORA iniziale è pronta.',
  'session-log.placeholder.entry': 'Cosa stai vedendo, pensando o provando?',
  'trade-sync.quick.started':
    'Sincronizzazione delle fonti di trade abilitate…',
  'trade-sync.quick.running': 'Sincronizzazione…',
  'trade-sync.quick.offline':
    'La sincronizzazione dei trade richiede una connessione Internet. Riprova quando sei online.',
  'trade-sync.quick.no-sources':
    'Nessuna fonte di sincronizzazione abilitata trovata. Configura Trade Sync nelle impostazioni.',
  'trade-sync.quick.complete':
    'Sincronizzazione completata: {sources} fonti sincronizzate e {imported} trade importati o aggiornati.',
  'trade-sync.quick.partial':
    'Sincronizzazione terminata con problemi: {completed} fonti su {total} completate e {imported} trade importati o aggiornati.',
  'trade-sync.quick.failed':
    'Impossibile completare la sincronizzazione per {sources} fonti. Controlla le impostazioni di Trade Sync e riprova.',
  'navigation.items.nav-sync-trades': 'Sincronizza i trade',
  'command.sync-trades-now': 'Sincronizza i trade',
  'home.quick-links.sync-trades': 'Sincronizza i trade',
  'trade-sync.quick.not-ready':
    'Nessuna fonte di sincronizzazione abilitata è pronta al momento. Attendi le sincronizzazioni attive o controlla le impostazioni di Trade Sync.',
  'trade-sync.quick.mapping-required':
    'Sono stati importati o aggiornati {imported} trade. Completa la mappatura degli account per {providers} in Impostazioni → Trade Sync, quindi riprova.',
  'trade-handoff.action.view-trades-count.one': 'Visualizza {count} operazione',
  'trade-handoff.action.view-trades-count.few': 'Visualizza {count} operazioni',
  'trade-handoff.action.view-trades-count.many':
    'Visualizza {count} operazioni',
  'trade-handoff.action.view-trades-count.other':
    'Visualizza {count} operazioni',
  'trade-handoff.action.review-now': 'Rivedi ora',
  'trade-handoff.action.open-period': 'Apri la revisione {period}',
  'trade-handoff.review.creation-disabled':
    'Questa revisione non esiste e la creazione automatica delle revisioni è disattivata.',
  'trade-handoff.review.open-failed': 'Impossibile aprire questa revisione.',
  'trade-handoff.trades.open-failed':
    'Impossibile aprire il registro delle operazioni.',
  'trade-handoff.scope.label':
    'Visualizzazione di {trades} dell’ultima operazione per {accounts}',
  'trade-handoff.scope.exit': 'Esci dalla vista operazione',
  'trade-handoff.trade-count.one': '{count} operazione',
  'trade-handoff.trade-count.few': '{count} operazioni',
  'trade-handoff.trade-count.many': '{count} operazioni',
  'trade-handoff.trade-count.other': '{count} operazioni',
  'trade-handoff.title.sync': 'Sincronizzazione completata',
  'trade-handoff.summary.import-complete': '{trades} importate',
  'trade-handoff.summary.import-partial': '{trades} importate con problemi',
  'trade-handoff.summary.sync-complete': '{trades} sincronizzate',
  'trade-handoff.summary.sync-partial': '{trades} sincronizzate con problemi',
  'trade-handoff.periods.choose': 'Scegli un altro periodo di revisione',
  'trade-handoff.periods.recommended': 'Consigliato',
  'trade-handoff.action.dismiss':
    'Chiudi il risultato recente delle operazioni',
  'sample.action.try': 'Prova un diario di esempio',
  'sample.action.reset': 'Reimposta esempio',
  'sample.popout.title': 'Diario di esempio',
  'sample.popout.action.exit': 'Esci',
  'sample.popout.description':
    'Le modifiche qui servono solo per fare pratica.',
  'sample.popout.closed': 'Diario di prova salvato e chiuso.',
  'sample.popout.recovery': 'Il diario di prova deve essere ripristinato.',
  'sample.notice.sync-blocked':
    'Stai modificando dati di esempio fittizi. La sincronizzazione con il backend è sospesa.',
  'sample.notice.folder-locked':
    'La cartella del diario non può essere modificata mentre il diario di esempio è attivo.',
  'sample.empty.description':
    'Esplora un diario fittizio completo senza modificare i file o le impostazioni del tuo diario.',
  'sample.progress.creating':
    'Creazione del diario di esempio: {completed} di {total} elementi',
  'sample.progress.removing':
    'Rimozione del diario di esempio: {completed} di {total} elementi',
  'sample.progress.verifying':
    'Controllo del diario di esempio: {completed} di {total} elementi',
  'sample.exit.title': 'Uscire dal diario di esempio?',
  'sample.exit.remove-warning':
    'La rimozione elimina le modifiche nei file di esempio con proprietà verificata. I file senza proprietà di esempio dimostrabile vengono conservati.',
  'sample.exit.remove': 'Esci e rimuovi',
  'sample.reset.title': 'Reimpostare il diario di esempio?',
  'sample.reset.message':
    'Questa operazione ripristina tutti i file di esempio e le impostazioni esclusive dell’esempio dal pacchetto fittizio originale.',
  'sample.reset.warning':
    'Le modifiche apportate nel diario di esempio verranno eliminate.',
  'sample.collision.title': 'La cartella di esempio esiste già',
  'sample.collision.message':
    'Journalit non sovrascriverà la cartella esistente. Creare invece il diario di esempio in “{path}”?',
  'sample.collision.confirm': 'Usa cartella disponibile',
  'sample.notice.ready': 'Il diario di esempio è pronto.',
  'sample.notice.reset': 'Diario di esempio ripristinato.',
  'sample.notice.reset-preserved':
    'Diario di esempio ripristinato. Sono stati conservati {count} file senza proprietà verificabile.',
  'sample.notice.removed': 'Diario di esempio rimosso.',
  'sample.notice.removed-preserved':
    'Diario di esempio rimosso. Sono stati conservati {count} file senza proprietà verificabile.',
  'sample.notice.error':
    'Operazione sul diario di esempio non riuscita: {error}',
  'command.open-sample-journal': 'Apri diario di esempio',
  'command.exit-sample-journal': 'Esci dal diario di esempio',
  'command.reset-sample-journal': 'Reimposta diario di esempio',
  'sample.notice.busy':
    'È già in corso un’altra operazione del diario di esempio.',
  'account.profiles.no-matching-phase':
    'Nessuna fase corrispondente in queste regole della firm.',
  'account.profiles.history-unchanged':
    'La cronologia precedente resta invariata.',
  'account.profiles.notice-title': 'Regole della firm aggiornate disponibili',
  'account.profiles.notice-description':
    'Le regole pubblicate dalla firm differiscono da quelle salvate su questo conto. Le regole del tuo conto non sono cambiate.',
  'account.profiles.review-changes': 'Esamina le modifiche',
  'account.profiles.check-failed':
    'Impossibile verificare gli aggiornamenti delle regole.',
  'account.profiles.retry': 'Riprova',
  'account.profiles.source-changed':
    'Le regole della firm sono cambiate mentre questa revisione era aperta. Riapri la revisione prima di applicarla.',
  'account.profiles.retain': 'Mantieni le regole attuali',
  'account.profiles.retain-help':
    'Mantieni le regole di questo conto e ignora queste modifiche sorgente. I cambi di policy successivi potranno avvisarti di nuovo.',
  'account.profiles.comparison-help':
    'Vengono mostrate solo le differenze. Espandi una regola per ispezionarne i campi. Le personalizzazioni locali possono spiegare le differenze.',
  'account.profiles.added': 'Aggiunto',
  'account.profiles.removed': 'Rimosso',
  'account.profiles.changed': 'Modificato',
  'account.profiles.not-configured': 'Non configurato',
  'account.profiles.no-rule-changes':
    'Nessuna differenza di regole o di policy di payout per questa fase.',
  'account.profiles.accept': 'Applica aggiornamento',
  'account.profiles.cached':
    'Uso delle regole della firm in cache; non è stato possibile verificare le più recenti.',
  'account.profiles.account-phase': 'Fase del conto',
  'account.profiles.choose': 'Scegli regole salvate',
  'account.profiles.completed':
    'Le fasi completate conservano le regole originali.',
  'account.profiles.confirm': 'Queste regole si applicano al mio conto.',
  'account.profiles.currency':
    'Scegli una valuta del conto che corrisponda a queste regole prima di applicarle.',
  'account.profiles.current': 'Regole attuali del conto',
  'account.profiles.custom-transition':
    'Condizioni di transizione personalizzate',
  'account.profiles.cycle-start': 'Inizio ciclo payout (ora locale)',
  'account.profiles.delete-help':
    'Eliminare queste regole salvate? I conti che le usano già non cambieranno.',
  'account.profiles.effective': 'In vigore da (ora locale)',
  'account.profiles.correction-title': 'Correzione del catalogo',
  'account.profiles.correction-source': 'Origine delle regole',
  'account.profiles.correction-period': 'Cronologia interessata',
  'account.profiles.correction-history': 'Cronologia delle correzioni',
  'account.profiles.correction-stale':
    'La cronologia del conto è cambiata. Riapri questa revisione prima di applicare la correzione.',
  'account.profiles.correction-result': 'Valutazione delle regole hard',
  'account.profiles.no-hard-breach': 'Nessuna violazione hard rilevata',
  'account.profiles.correction-consent': 'Ricalcola la cronologia',
  'account.profiles.correction-details': 'Dettagli',
  'account.profiles.correction-apply': 'Applica correzione',
  'account.profiles.purchase-date': 'Data di acquisto originale',
  'account.profiles.save-purchase': 'Salva data di acquisto',
  'account.profiles.purchase-needed':
    'Inserisci la data di acquisto originale per verificare queste condizioni.',
  'account.profiles.purchase-excluded':
    'Questo acquisto mantiene le condizioni esistenti.',
  'account.profiles.purchase-uncertain':
    "L'applicabilità va confermata dalla prop firm. Le regole restano invariate.",
  'account.profiles.initial-terms':
    "Queste condizioni valgono dall'acquisto o prima di questa fase. Esamina a parte la configurazione iniziale; la cronologia resta invariata.",
  'account.profiles.announcement': 'Annuncio della prop firm',
  'account.profiles.firm-effective':
    'Data di effetto confermata dalla prop firm',
  'account.profiles.published-date': 'Data di effetto pubblicata',
  'account.profiles.applicability-checking': "Verifica dell'applicabilità…",
  'account.profiles.error':
    'Impossibile salvare le regole. Controlla i valori e riprova.',
  'account.profiles.floor': 'Floor di Drawdown alla transizione',
  'account.profiles.history': 'Cronologia delle regole',
  'account.profiles.history-help':
    'Le regole precedenti sono conservate. Usa Rivedi aggiornamento regole per cambiare una fase versionata; la modifica diretta è bloccata per proteggere lo storico.',
  'account.profiles.incoming': 'Regole in arrivo dalla firm',
  'account.profiles.independent':
    'Le regole salvate sono locali a questo vault. Applicarle crea una copia indipendente sul conto; salvare una nuova revisione non modifica mai i conti esistenti.',
  'account.profiles.keep-help':
    'Le regole selezionate mantengono i tuoi valori locali invece della regola in arrivo di quel tipo. Deseleziona per accettare il valore della firm. I nuovi tipi di regola vengono aggiunti.',
  'account.profiles.keep-local': 'Mantieni le mie:',
  'account.profiles.keep-payout': 'Mantieni la policy di payout attuale',
  'account.profiles.library': 'Le mie regole salvate',
  'account.profiles.locked': 'Il floor di Drawdown è già bloccato',
  'account.profiles.missing': 'Queste regole salvate non esistono più.',
  'account.profiles.peak': 'Saldo di picco riportato',
  'account.profiles.review': 'Rivedi aggiornamento regole',
  'account.profiles.save-new': 'Salva queste regole',
  'account.profiles.saved': 'Salvato in Le mie regole salvate.',
  'account.profiles.update-saved': 'Aggiorna regole salvate',
  'account.profiles.delete-saved': 'Elimina regole salvate',
  'account.profiles.save-revision':
    'Salva come nuova revisione delle regole selezionate',
  'account.profiles.source-phase': 'Fase delle regole della firm',
  'account.profiles.transition-help':
    'Non sono fornite condizioni di transizione verificate. Inserisci i termini confermati dalla prop firm: floor, picco e inizio ciclo payout. Sono contrassegnati come personalizzati. Il profitto di fase e il conteggio payout complessivo restano; le operazioni più vecchie conservano le regole originali.',
  'account.profiles.transition-source':
    'Conferma della prop firm o riferimento',
  'account.profiles.link-intro':
    'Collega questa challenge alle regole della sua firm e Journalit ti avviserà quando la firm le cambia. Prima rivedi in cosa differiscono dalle regole di questo conto; nulla cambia finché non applichi.',
  'account.profiles.link-title': 'Collega alle regole della firm',
  'account.profiles.choose-source': 'Scegli regole della firm',
  'account.profiles.update-available':
    'Le regole della firm sono cambiate e vanno riviste. Il tuo conto usa ancora le regole salvate.',
  'account.profiles.up-to-date':
    'Questa fase usa le ultime regole della firm riviste; le modifiche locali restano indipendenti.',
  'form.field.prop-challenge-phase': 'Fase: {name}',
  'form.field.prop-challenge-phase.none': 'Nessuna fase in questo momento',
  'dashboard.filter.accounts.phase-now': 'ora',
  'home.widget.eval-roi.name': 'ROI eval',
  'home.widget.challenge-alerts.name': 'Avvisi challenge',
  'home.widget.challenge-alerts.description':
    'Conti prop falliti, superati o con payout pronto',
  'home.widget.eval-roi.description':
    'Costi delle challenge prop vs pagamenti ricevuti',
  'account.header.back-to-dashboard': 'Torna alla dashboard',
  'account.header.warning.trades-before-phase.one':
    "{count} operazione trovata prima dell'inizio della Fase 1",
  'account.header.warning.trades-before-phase.few':
    "{count} operazioni trovate prima dell'inizio della Fase 1",
  'account.header.warning.trades-before-phase.many':
    "{count} operazioni trovate prima dell'inizio della Fase 1",
  'account.header.warning.trades-before-phase.other':
    "{count} operazioni trovate prima dell'inizio della Fase 1",
  'account.header.warning.earliest-trade-phase':
    "Prima operazione: {date}. Le operazioni prima dell'inizio della fase non contano per la challenge.",
  'account.header.notice.phase-start-updated':
    'Inizio della Fase 1 spostato al {date}',
  'account.header.warning.fix-phase-start.aria':
    "Correggi l'inizio della Fase 1",
  'account.settings.section.challenge-stages.title': 'Stage della challenge',
  'account.settings.section.challenge-stages.desc':
    'Tipo di conto applicato quando una challenge raggiunge questo stage.',
  'account.settings.section.challenge-stages.no-change': 'Nessuna modifica',
  'account.settings.section.challenge-stages.aria': 'Tipo di conto per {stage}',
  'account-dashboard.challenges.empty.title': 'Nessuna challenge ancora',
  'account-dashboard.challenges.empty.message':
    'Traccia una challenge di prop firm come un unico conto con fasi, regole e payout.',
  'account-dashboard.challenges.empty.create': 'Nuova challenge',
  'account-dashboard.challenges.empty.setup': 'Configura i conti esistenti',
  'account-dashboard.guide.main.settings-stages.title':
    'Gli stage della challenge possono impostare il tipo di conto',
  'account-dashboard.guide.main.settings-stages.description':
    "Scegli il tipo di conto applicato quando una challenge raggiunge valutazione, sim finanziato o live finanziato. Lascia uno stage su nessuna modifica per mantenere il tipo di conto così com'è.",
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    'Novità: challenge prop firm',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    'Ora un conto può seguire una challenge prop firm: le sue fasi, le regole della firm e i tuoi payout.',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    'Inizia una nuova challenge',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    'Quando crei un conto, attiva Challenge prop firm e scegli la tua firm. Le sue regole vengono compilate per te.',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    'Vedi tutte le tue challenge',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    'Passa a Challenge per vedere progressi, tasso di superamento, costi e payout di tutte le tue challenge.',
  'account-dashboard.prop.metrics.total': 'Challenge',
  'account-dashboard.prop.metrics.pass-rate': 'Tasso di superamento',
  'account-dashboard.prop.metrics.costs': 'Costi challenge',
  'account-dashboard.prop.metrics.payouts': 'Payout',
  'account-dashboard.prop.metrics.net': 'Netto',
  'account-dashboard.prop.tabs.overview': 'Panoramica',
  'account-dashboard.mode.selector': 'Modalità dashboard conti',
  'account-dashboard.mode.account-overview': 'Panoramica conti',
  'account-dashboard.mode.challenges': 'Challenge',
  'account-dashboard.prop.metrics.active': 'Challenge attive',
  'account-dashboard.prop.economics.title': 'Economia',
  'account-dashboard.prop.economics.roi': 'Rendimento ROI',
  'account-dashboard.prop.economics.roi-no-cost': 'Nessun costo',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    'Costo medio per tentativo',
  'account-dashboard.prop.economics.cost-per-funded-account':
    'Costo per conto finanziato',
  'account-dashboard.prop.economics.payout-conversion': 'Conversione in payout',
  'account-dashboard.prop.insights.title': 'Approfondimenti challenge',
  'account-dashboard.prop.phases.title': 'Approfondimenti delle fasi',
  'account-dashboard.prop.phases.phase': 'Fase',
  'account-dashboard.prop.phases.average-duration': 'Durata media',
  'account-dashboard.prop.phases.show-more': 'Mostra altri {count}',
  'account-dashboard.prop.phases.show-fewer': 'Mostra meno',
  'account-dashboard.prop.tooltip.open-explanation': 'Spiega {metric}',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    'Dati completati ancora insufficienti',
  'account-dashboard.prop.tooltip.pass-rate.description':
    'La quota di challenge completate che sono state superate. Le challenge attive e quelle archiviate senza esito sono escluse.',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    'Challenge superate ÷ challenge completate × 100',
  'account-dashboard.prop.tooltip.roi.description':
    'Rendimento netto dei payout (payout meno costi challenge) rispetto ai costi challenge. Il ROI si calcola solo quando tutte le challenge incluse usano una sola valuta.',
  'account-dashboard.prop.tooltip.roi.formula':
    '(Payout − costi challenge) ÷ costi challenge × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    "Queste challenge non sono costate nulla, quindi non c'è una base di costo da dividere. Il rendimento netto è pari ai {payouts} di pagamenti.",
  'account-dashboard.prop.tooltip.average-cost.description':
    'Il costo medio della challenge per ogni tentativo, calcolato separatamente per ciascuna valuta.',
  'account-dashboard.prop.tooltip.average-cost.formula':
    'Costi challenge ÷ tentativi totali di challenge',
  'account-dashboard.prop.tooltip.funded-cost.description':
    'Il costo medio della challenge necessario per ogni challenge superata, calcolato separatamente per ciascuna valuta.',
  'account-dashboard.prop.tooltip.funded-cost.formula':
    'Costi challenge ÷ challenge superate',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    'La quota di challenge superate che hanno prodotto almeno un payout.',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    'Challenge superate con un payout ÷ challenge superate × 100',
  'account-dashboard.prop.tabs.phases': 'Fasi',
  'account-dashboard.prop.tabs.firms': 'Prop firm',
  'account-dashboard.prop.firms.firm': 'Prop firm',
  'account-dashboard.prop.firms.attempts': 'Tentativi',
  'account-dashboard.prop.phases.most-failed': 'Più non superate',
  'account-dashboard.prop.phases.days': '{count} giorni',
  'account-dashboard.prop.phases.empty': 'Nessuna fase completata ancora',
  'account.metrics.total-account-costs': 'Costi totali stimati',
  'account.metrics.total-costs': 'Costi totali',
  'account.metrics.one-time-costs': 'Costi una tantum',
  'account.metrics.recurring-costs-to-date': 'Costi ricorrenti fino a oggi',
  'account.metrics.monthly-cost': 'Costo mensile',
  'account.challenge.toggle.label': 'Challenge prop firm',
  'account.challenge.toggle.help':
    'Monitora le fasi di valutazione, le regole della firm e i pagamenti per questo conto.',
  'account.prop-challenge.title': 'Challenge prop',
  'account.prop-challenge.identity': 'Identità della challenge',
  'account.prop-challenge.prefill.heading-link': 'Precompila dalla tua firm',
  'account.prop-challenge.prefill.updates-link':
    'Tieni aggiornate le regole della firm',
  'account.prop-challenge.prefill.updates-link-firm':
    'Tieni aggiornate le regole di {firm}',
  'account.prop-challenge.prefill.phase-link': 'Precompila le regole con PRO',
  'account.prop-challenge.prefill.phase-link-firm':
    'Precompila le regole di {firm} con PRO',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} altre, regole precompilate con PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, regole precompilate con PRO',
  'account.prop-challenge.prefill.match':
    'Abbiamo {firm}: {count} challenge con regole pronte',
  'account.prop-challenge.rules.empty':
    'Nessuna regola aggiunta ancora. Usa Aggiungi regola per definire questa fase.',
  'account.prop-challenge.rules': 'Regole',
  'account.prop-challenge.costs.empty': 'Nessun costo aggiunto ancora.',
  'account.prop-challenge.description':
    'Traccia questo conto attraverso una challenge prop firm multi-fase.',
  'account.prop-challenge.enable':
    'Attiva il tracciamento della challenge prop',
  'account.prop-challenge.challenge-name': 'Nome della challenge',
  'account.prop-challenge.challenge-name-placeholder': 'es. Valutazione 25K',
  'account.prop-challenge.firm-name': 'Nome prop firm (facoltativo)',
  'account.prop-challenge.firm-name-placeholder': 'es. Apex Trader Funding',
  'account.prop-challenge.profile.title': 'Applica le regole della firm',
  'account.prop-challenge.profile.firm': 'Prop firm',
  'account.prop-challenge.profile.challenge': 'Challenge prop',
  'account.prop-challenge.profile.choose-firm': 'Scegli una firm',
  'account.prop-challenge.profile.choose-challenge': 'Scegli una challenge',
  'account.prop-challenge.profile.custom-firm': 'Altra / firm personalizzata',
  'account.prop-challenge.profile.help':
    'Scegli la tua firm e il tuo piano per compilare le sue regole: drawdown, obiettivi, payout. Puoi modificarle dopo.',
  'account.prop-challenge.profile.current': 'Attuale: {identity}',
  'account.prop-challenge.profile.apply': 'Applica',
  'account.prop-challenge.profile.loading': 'Caricamento regole della firm…',
  'account.prop-challenge.profile.refreshing':
    'Ricerca aggiornamenti delle regole…',
  'account.prop-challenge.profile.unavailable':
    'Le regole della firm non sono disponibili offline.',
  'account.prop-challenge.profile.confirm-title':
    'Sostituire la configurazione della challenge?',
  'account.prop-challenge.profile.confirm-message':
    'Applicare queste regole della firm sostituisce le fasi e le regole attualmente configurate.',
  'account.prop-challenge.current-phase': 'Fase attuale',
  'account.prop-challenge.phase-rules': 'Regole per {phase}',
  'account.prop-challenge.next-phase': 'Prossima: {phase}',
  'account.prop-challenge.view-phase': 'Vedi fase',
  'account.prop-challenge.unnamed-phase': 'Fase senza nome',
  'account.prop-challenge.phase-name': 'Nome della fase',
  'account.prop-challenge.phase-type': 'Tipo di fase',
  'account.prop-challenge.phase-type.evaluation': 'Valutazione',
  'account.prop-challenge.phase-type.verification': 'Verifica',
  'account.prop-challenge.phase-type.sim_funded': 'Sim finanziato',
  'account.prop-challenge.phase-type.live_funded': 'Live finanziato',
  'account.prop-challenge.phase-type.custom': 'Personalizzata',
  'account.prop-challenge.starting-balance': 'Saldo iniziale',
  'account.prop-challenge.broker-account-id': 'Conti broker',
  'account.prop-challenge.broker-accounts.assigned': 'Assegnato a {phase}',
  'account.prop-challenge.broker-accounts.trades': '{count} operazioni',
  'account.prop-challenge.broker-accounts.trade-one': '1 operazione',
  'account.prop-challenge.phase-started': 'Iniziata',
  'account.prop-challenge.phase-completed': 'Completata',
  'account.prop-challenge.timeline.completed-before-started':
    "La data di completamento deve coincidere o essere successiva all'inizio per {phase}.",
  'account.prop-challenge.timeline.out-of-order':
    "{phase} deve completarsi entro o prima dell'inizio di {next}.",
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} inizia dopo una modifica di regole successiva. Anticipa l’inizio.',
  'account.prop-challenge.default-phase-name': 'Fase {number}',
  'account.prop-challenge.add-phase': 'Aggiungi fase',
  'account.prop-challenge.remove-phase': 'Rimuovi fase',
  'account.prop-challenge.add-rule': 'Aggiungi regola',
  'account.prop-challenge.rule.enabled': 'Regola attiva',
  'account.prop-challenge.rule.amount': 'Importo',
  'account.prop-challenge.rule.target-type': 'Tipo di obiettivo',
  'account.prop-challenge.rule.credit-withdrawals':
    "Conta i prelievi verso l'obiettivo",
  'account.prop-challenge.rule.drawdown-mode': 'Modalità Drawdown',
  'account.prop-challenge.rule.lock-at-balance': 'Blocca al saldo',
  'account.prop-challenge.rule.daily-loss-model': 'Importo perdita giornaliera',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'Importo fisso',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'Aumenta alla soglia di profitto del conto',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    'Scala con il profitto EOD di picco',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    'Usa il limite fisso finché il conto chiude al saldo di attivazione. Dal giorno di trading successivo, il limite diventa la percentuale configurata del massimo profitto di fine giornata del conto e non diminuisce mai.',
  'account.prop-challenge.rule.scale-at-balance': 'Saldo di attivazione',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    'Profitto EOD di picco usato come limite (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    '{value} del profitto EOD di picco',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    'Soglie di profitto dal saldo EOD precedente',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    'Soglie di profitto EOD precedente',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    'Usa coppie profitto:limite-perdita. La soglia scelta dal profitto EOD precedente del conto si applica alla sessione successiva.',
  'account.prop-challenge.rule.loss-tiers':
    'Soglie di profitto e limiti di perdita',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    "L'importo maggiore di perdita giornaliera si attiva in modo permanente quando il profitto complessivo del conto raggiunge per la prima volta la percentuale configurata del saldo iniziale.",
  'account.prop-challenge.rule.profit-threshold-percent':
    'Soglia di profitto del conto (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'Perdita giornaliera dopo la soglia',
  'account.prop-challenge.rule.breach-action':
    'Comportamento in caso di violazione',
  'account.prop-challenge.rule.breach-action.hard': 'Fai fallire il conto',
  'account.prop-challenge.rule.breach-action.soft':
    'Pausa fino alla sessione successiva',
  'account.prop-challenge.rule.days': 'Giorni di trading',
  'account.prop-challenge.rule.minimum-daily-profit':
    'Profitto minimo per giorno',
  'account.prop-challenge.rule.minimum-daily-profit-summary':
    '{value}+ al giorno',
  'account.prop-challenge.rule.best-day-percent': 'Massimo giorno migliore (%)',
  'account.prop-challenge.rule.position-limit-model':
    'Modello limite di posizione',
  'account.prop-challenge.rule.position-limit-model.fixed': 'Limite fisso',
  'account.prop-challenge.rule.position-limit-model.eod-profit-tiers':
    'Soglie di profitto EOD',
  'account.prop-challenge.rule.position-profit-basis':
    'Base profitto per lo scaling della posizione',
  'account.prop-challenge.rule.position-profit-basis.cumulative':
    'Profitto cumulativo delle operazioni (i payout non riducono)',
  'account.prop-challenge.rule.position-profit-basis.current-account':
    'Profitto attuale del conto (i payout riducono)',
  'account.prop-challenge.rule.position-limit-model.eod-profit':
    'Scala con il profitto EOD',
  'account.prop-challenge.rule.position-tiers': 'Soglie di profitto',
  'account.prop-challenge.rule.position-tiers-help':
    'Inserisci ogni soglia di profitto EOD completata e il nuovo limite di contratti come profitto:contratti, separati da virgole. Una soglia si applica dal giorno di trading successivo.',
  'account.prop-challenge.rule.position-scaling-help':
    'Ogni scatto di profitto completato aggiunge un contratto a partire dal giorno di trading successivo, fino al massimo.',
  'account.prop-challenge.rule.initial-contracts': 'Contratti iniziali',
  'account.prop-challenge.rule.profit-per-contract':
    'Profitto EOD per contratto aggiuntivo',
  'account.prop-challenge.rule.maximum-contracts':
    'Contratti massimi dopo lo scaling',
  'account.prop-challenge.rule.micros-per-contract':
    'Conta 10 micro come 1 contratto',
  'account.prop-challenge.rule.micros-per-contract-help':
    'Attiva se la tua firm conta i future micro (MES, MNQ, MGC, ...) come un decimo di un contratto standard per questo limite. Lascia disattivato se ogni micro conta come un contratto intero.',
  'account.prop-challenge.rule.max-contracts': 'Contratti massimi',
  'account.prop-challenge.rule.profit_target': 'Obiettivo di profitto',
  'account.prop-challenge.rule.drawdown': 'Limite di Drawdown',
  'account.prop-challenge.rule.daily_loss_limit':
    'Limite di perdita giornaliera',
  'account.prop-challenge.rule.live_review_daily_profit':
    'Profitto giornaliero per live review',
  'account.prop-challenge.rule.best-profitable-day':
    'Trigger del giorno in profitto',
  'account.prop-challenge.rule.daily_profit_cap':
    'Cap di accredito del profitto giornaliero',
  'account.prop-challenge.rule.per-trading-day': 'Per giorno di trading',
  'account.prop-challenge.rule.minimum_trading_days':
    'Giorni di trading minimi',
  'account.prop-challenge.rule.minimum_profitable_days':
    'Giorni in profitto minimi',
  'account.prop-challenge.rule.consistency-cushion-percent':
    'Cushion di consistency (punti percentuali)',
  'account.prop-challenge.rule.consistency-cushion-short': 'margine',
  'account.prop-challenge.rule.consistency': 'Regola di consistency',
  'account.prop-challenge.rule.max_position_size':
    'Dimensione massima della posizione',
  'account.prop-challenge.drawdown.static': 'Statico',
  'account.prop-challenge.drawdown.eod-trailing': 'Trailing EOD',
  'account.prop-challenge.drawdown.intraday-trailing': 'Trailing intraday',
  'account.prop-challenge.summary.status.active': 'Attiva',
  'account.prop-challenge.summary.status.passed': 'Superata',
  'account.prop-challenge.summary.status.failed': 'Non superata',
  'account.prop-challenge.summary.status.pending': 'In attesa',
  'account.prop-challenge.summary.status.warning': 'Vicino al limite',
  'account.prop-challenge.summary.status.payout_ready': 'Payout pronto',
  'account.prop-challenge.ribbon.passed': '{phase} superata',
  'account.prop-challenge.ribbon.failed': '{phase} non superata',
  'account.prop-challenge.ribbon.action.advance': 'Avanza a {phase}',
  'account.prop-challenge.ribbon.action.advance-short': 'Avanza',
  'account.prop-challenge.ribbon.action.mark-passed': 'Segna come superata',
  'account.prop-challenge.ribbon.action.archive': 'Archivia',
  'account.prop-challenge.ribbon.action.record-payout': 'Registra payout',
  'account.prop-challenge.ribbon.action.record-payout-short': 'Payout',
  'account.prop-challenge.summary.phase-status.pending': 'In attesa',
  'account.prop-challenge.summary.phase-status.active': 'Attiva',
  'account.prop-challenge.summary.phase-status.passed': 'Superata',
  'account.prop-challenge.summary.phase-status.failed': 'Non superata',
  'account.prop-challenge.summary.rule.profit_target': 'Obiettivo di profitto',
  'account.prop-challenge.summary.rule.drawdown': 'Limite di Drawdown',
  'account.prop-challenge.summary.rule.drawdown-static': 'Drawdown statico',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': 'Drawdown EOD',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing':
    'Drawdown intraday',
  'account.prop-challenge.summary.rule.daily_loss_limit': 'Perdita giornaliera',
  'account.prop-challenge.summary.rule.live_review_daily_profit': 'Review live',
  'account.prop-challenge.summary.rule.daily_profit_cap':
    'Accredito profitto giornaliero',
  'account.prop-challenge.summary.rule.minimum_trading_days':
    'Giorni di trading',
  'account.prop-challenge.summary.rule.minimum_profitable_days':
    'Giorni in profitto',
  'account.prop-challenge.summary.rule.consistency':
    'Consistency del giorno migliore',
  'account.prop-challenge.summary.rule.max_position_size':
    'Dimensione posizione',
  'account.prop-challenge.summary.status.archived': 'Archiviata',
  'account.prop-challenge.summary.status.hidden': 'Nascosta',
  'account.prop-challenge.payout.title': 'Prontezza payout',
  'account.prop-challenge.payout.eligible': 'Payout pronto',
  'account.prop-challenge.payout.available': 'Disponibile ora',
  'account.prop-challenge.payout.cycle-profit': 'Profitto del ciclo',
  'account.prop-challenge.payout.history': 'Payout',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'Giorni qualificanti complessivi',
  'account.prop-challenge.payout.requirement.days': 'Giorni di trading',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'Giorni qualificanti',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'Saldo minimo del conto',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'Profitto del ciclo positivo',
  'account.prop-challenge.payout.requirement.cycle-profit':
    'Profitto del ciclo',
  'account.prop-challenge.payout.requirement.consistency':
    'Regola di consistency',
  'account.prop-challenge.payout.requirement.minimum': 'Minimo disponibile',
  'account.prop-challenge.payout.requirement.payouts': 'Quota di payout',
  'account.prop-challenge.payout.requirement.request-window':
    'Finestra di richiesta',
  'account.prop-challenge.payout.timezone-invalid': 'Fuso orario sconosciuto.',
  'account.prop-challenge.payout.preview-amount': 'Anteprima payout',
  'account.prop-challenge.payout.you-receive': 'Quota trader',
  'account.prop-challenge.payout.balance-after': 'Saldo dopo',
  'account.prop-challenge.payout.drawdown-floor': 'Floor di Drawdown',
  'account.prop-challenge.payout.buffer-after':
    'Margine prima della violazione',
  'account.prop-challenge.payout.request-not-allowed':
    'Non idoneo per questo importo',
  'account.prop-challenge.payout.immediate-breach':
    'Questo payout lascerebbe il conto al floor di Drawdown o sotto.',
  'account.prop-challenge.payout.account-concludes':
    'Questo payout completa il ciclo di payout sim finanziato configurato.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'Questo payout fa avanzare il conto allo stage successivo configurato.',
  'account.prop-challenge.payout.live-review-after-payout':
    'Questo payout rende il conto idoneo alla live review.',
  'account.prop-challenge.payout.cycle-resets':
    'I progressi del payout si azzerano dopo un payout approvato.',
  'account.prop-challenge.payout.cycle-continues':
    'I progressi del payout continuano dopo un payout approvato.',
  'account.prop-challenge.payout.drawdown.unchanged':
    'Il floor di Drawdown attuale resta in vigore.',
  'account.prop-challenge.payout.drawdown.lock_at_balance':
    'Il floor di Drawdown si blocca dopo il payout.',
  'account.prop-challenge.payout.drawdown.reset_from_starting_balance':
    'Il conto e i limiti di Drawdown si azzerano dopo il payout.',
  'account.prop-challenge.ledger.value.of': '{current} di {target}',
  'account.prop-challenge.ledger.section.payout': 'Requisiti di payout',
  'account.prop-challenge.ledger.requirement.minimum': 'minimo {value}',
  'account.prop-challenge.ledger.requirement.maximum': 'massimo {value}',
  'account.prop-challenge.ledger.value.ratio': '{current} su {target}',
  'account.prop-challenge.payout.met-of-total': '{met} di {total} requisiti',
  'account.prop-challenge.ledger.value.of-today': '{current} di {target} oggi',
  'account.prop-challenge.ledger.value.credited-profit':
    '{credited} accreditati di {actual} di profitto reale',
  'account.prop-challenge.ledger.value.used': '{used} usati',
  'account.prop-challenge.ledger.value.consistency-goal':
    '{current} di {target} obiettivo di consistency',
  'account.prop-challenge.ledger.value.best-day-share':
    'Giorno migliore {value} del profitto',
  'account.prop-challenge.ledger.value.no-profit': 'Nessun profitto ancora',
  'account.prop-challenge.ledger.requirement.best-day':
    'Giorno migliore ≤ {value} del profitto totale',
  'account.prop-challenge.ledger.state.needs-profit': 'Serve profitto',
  'account.prop-challenge.ledger.tooltip.open': 'Spiega {rule}',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    'Limita quanto del profitto totale di fase può arrivare dal singolo giorno di trading più redditizio.',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    'Profitto del giorno migliore ÷ profitto totale di fase × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    'Giorno migliore: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    'Profitto totale: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 = {share} quota',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    'Obiettivo di consistency: {best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    "La quota scende se aggiungi profitto in altri giorni, e un nuovo giorno migliore più grande alza l'obiettivo.",
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum} — entro la regola',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    'Il calcolo inizia quando il profitto totale di fase è positivo.',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    'Un obiettivo di consistency richiede un massimo superiore a 0%.',
  'account.prop-challenge.ledger.help.open': 'Informazioni su {rule}',
  'account.prop-challenge.ledger.help.profit_target':
    'Fai crescere il conto di questo importo per superare la fase. Contano solo le operazioni chiuse.',
  'account.prop-challenge.ledger.help.profit_target.example':
    'Questo conto serve {target} di profitto: {current} finora, {remaining} ancora.',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'Obiettivo raggiunto: {current} di {target}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    'Il massimo di cui il saldo può scendere sotto il saldo iniziale. Il floor non si muove mai.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'Il floor di questo conto è {floor}; il saldo deve restare sopra. Restano {buffer} del limite di {limit}.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    "Il floor segue il saldo di fine giornata più alto e si muove solo verso l'alto, finché non si blocca al livello di lock della prop firm.",
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'In questo momento il floor è {floor} (chiusura più alta meno {limit}) e sale a ogni chiusura più alta. Restano {buffer}.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    "Il floor segue il saldo più alto in qualsiasi momento, profitto aperto incluso. Journalit vede solo le operazioni chiuse, quindi questo floor segue il saldo migliore dopo ogni chiusura; un picco raggiunto dentro un'operazione aperta non conta. Controlla la cifra della prop firm.",
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    'In questo momento il floor è {floor} (saldo migliore delle operazioni chiuse meno {limit}). Restano {buffer}; la cifra live della prop firm può essere più stretta.',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    'Il massimo che puoi perdere in un giorno di trading. Raggiungerlo fa fallire la fase o mette in pausa il trading fino alla sessione successiva, a seconda della prop firm.',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    'Oggi: {used} persi del limite giornaliero di {limit}, restano {left}.',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    "Solo una parte del profitto di ogni giorno viene accreditata verso l'obiettivo. Il profitto sopra il cap viene tenuto ma non contato.",
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    'Solo {cap} del profitto di un giorno viene accreditato; {excluded} guadagnati sopra il cap finora non contano.',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'Un giorno di trading a questo profitto o superiore rende il conto idoneo a una live review.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    'Un giorno a {trigger} o più qualifica; miglior giorno finora {bestDay}.',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    "Giorni con almeno un'operazione chiusa. La fase non può essere superata prima di averne così tanti, per quanto velocemente raggiungi l'obiettivo.",
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{current} di {target} giorni di trading fatti, {remaining} ancora.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'Giorni di trading che chiudono al profitto giornaliero minimo della prop firm o sopra. Il pareggio o le vincite più piccole non contano.',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{current} di {target} giorni chiusi a {minimum} o più, {remaining} ancora.',
  'account.prop-challenge.ledger.help.consistency':
    'Il tuo giorno migliore non può superare questa quota del profitto totale di fase. Correggilo guadagnando di più negli altri giorni, non perdendo.',
  'account.prop-challenge.ledger.help.consistency.example':
    'Il giorno migliore {bestDay} è {share} di {total} di profitto totale; il profitto totale deve arrivare a {goal} perché stia al {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'Il giorno migliore {bestDay} è {share} del profitto totale, entro il limite del {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    "Nessun profitto ancora, quindi non c'è un giorno migliore da confrontare.",
  'account.prop-challenge.ledger.help.max_position_size':
    'Il numero massimo di contratti consentiti in una posizione. Journalit controlla la dimensione di ogni trade. Alcune firm alzano il limite man mano che il profitto cresce.',
  'account.prop-challenge.ledger.help.max_position_size.example':
    'Fino a {maximum} contratti per trade ora; trade più grande finora {current}.',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'Giorni di trading nel ciclo payout attuale. Il conteggio riparte dopo un payout approvato.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '{current} di {target} giorni di trading in questo ciclo, {remaining} ancora.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'Giorni di trading in questo ciclo che chiudono al profitto giornaliero minimo della prop firm o sopra.',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '{current} di {target} giorni a {minimum} o più in questo ciclo, {remaining} ancora.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    "Il profitto guadagnato dall'inizio del ciclo deve raggiungere questo importo prima di poter richiedere.",
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '{current} guadagnati in questo ciclo sui {target} necessari.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'Il saldo deve essere a questo livello o sopra quando richiedi.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    'Saldo {current}; deve essere almeno {target}.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    "Dopo il primo payout, ogni nuovo ciclo deve essere in profitto prima di un'altra richiesta.",
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'Il profitto del ciclo è {current}; deve essere sopra zero.',
  'account.prop-challenge.ledger.help.payout.consistency':
    'Il tuo giorno migliore non può superare questa quota del profitto del ciclo.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    'Il giorno migliore {bestDay} è {share} di {total} di profitto del ciclo; il profitto del ciclo deve arrivare a {goal} perché stia al {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'Il giorno migliore {bestDay} è {share} del profitto del ciclo, entro il limite del {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    "Nessun profitto di ciclo ancora, quindi non c'è un giorno migliore da confrontare.",
  'account.prop-challenge.ledger.help.payout.minimum_request':
    "Il payout più piccolo che la prop firm accetta. L'importo disponibile deve raggiungerlo prima.",
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '{current} disponibili; il minimo di richiesta della prop firm è {target}.',
  'account.prop-challenge.ledger.help.payout.payout_count':
    'Quanti payout questo stage consente. Usare la quota completa lo stage.',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '{current} di {target} payout usati in questo stage.',
  'account.prop-challenge.ledger.help.payout.request_window':
    'Le richieste sono accettate solo in questi giorni feriali, nel fuso orario della prop firm.',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    'Oggi è {today}; le richieste sono aperte il {days} ({timeZone}).',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'Il tempo dal primo trade del ciclo deve raggiungere questo valore prima di poter richiedere.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '{current} di {target} ore dal primo trade del ciclo.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    "Giorni qualificanti sull'intera fase finanziata, non solo questo ciclo. I payout si sbloccano una volta raggiunti.",
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    "{current} di {target} giorni qualificanti sull'intera fase.",
  'account.prop-challenge.ledger.requirement.target': 'obiettivo {value}',
  'account.prop-challenge.ledger.requirement.buffer': 'margine {value}',
  'account.prop-challenge.ledger.requirement.max': 'max {value}',
  'account.prop-challenge.ledger.requirement.daily-cap':
    '{value} accreditati per giorno di trading',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{days} giorni a {profit}+',
  'account.prop-challenge.ledger.requirement.days': '{value} giorni',
  'account.prop-challenge.ledger.requirement.at-most': 'al più {value}',
  'account.prop-challenge.ledger.state.not-started': 'Non iniziata',
  'account.prop-challenge.ledger.state.in-progress': 'In corso',
  'account.prop-challenge.ledger.state.reached': 'Raggiunto',
  'account.prop-challenge.ledger.state.met': 'Soddisfatto',
  'account.prop-challenge.ledger.state.eligible': 'Idoneo',
  'account.prop-challenge.ledger.state.safe': 'Al sicuro',
  'account.prop-challenge.ledger.state.clear': 'Libero',
  'account.prop-challenge.ledger.state.within-rule': 'Entro la regola',
  'account.prop-challenge.ledger.state.near-limit': 'Vicino al limite',
  'account.prop-challenge.ledger.state.limit-reached': 'Limite raggiunto',
  'account.prop-challenge.ledger.state.cap-applied': 'Cap applicato',
  'account.prop-challenge.ledger.state.within-cap': 'Entro il cap',
  'account.prop-challenge.ledger.state.breached': 'Violato',
  'account.prop-challenge.actions.progress-to': 'Passa a {phase}',
  'account.prop-challenge.actions.progress': 'Passa alla fase successiva',
  'account.prop-challenge.actions.mark-passed':
    'Segna la challenge come superata',
  'account.prop-challenge.actions.mark-failed': 'Segna come non superata',
  'account.prop-challenge.actions.archive': 'Archivia challenge',
  'account.prop-challenge.actions.stale':
    'Questa challenge è stata aggiornata altrove. Controllala e riprova.',
  'account.prop-challenge.actions.reopen': 'Riapri',
  'account.prop-challenge.actions.link-rules':
    'Collega alle regole della firm…',
  'account.prop-challenge.view-trades': 'Vedi le operazioni di {phase}',
  'account.prop-challenge.actions.manual': 'Azioni manuali',
  'account.prop-challenge.notice.failed-title': '{phase} non superata',
  'account.prop-challenge.notice.failed-description':
    '{rule} violata il {date}',
  'account.prop-challenge.notice.failed-manual': 'Segnata come non superata',
  'account.prop-challenge.notice.keep-open': 'Tieni aperta',
  'account.prop-challenge.notice.target-title':
    'Obiettivo di {phase} raggiunto',
  'account.prop-challenge.notice.target-description':
    'Tutti i requisiti di superamento sono soddisfatti. Pronto a passare a {next}?',
  'account.prop-challenge.notice.breach-after-reached':
    "Le regole sono state violate dopo che l'obiettivo è stato raggiunto alle {time}. Imposta l'ora di transizione per tenere quelle operazioni fuori da questa fase.",
  'account.prop-challenge.notice.not-yet': 'Non ancora',
  'account.prop-challenge.notice.passed-title': 'Valutazione superata',
  'account.prop-challenge.notice.passed-description':
    'Tutti i requisiti sono soddisfatti. Segnare la challenge come superata?',
  'account.prop-challenge.notice.payout-title': 'Payout disponibile: {amount}',
  'account.prop-challenge.notice.payout-plan': 'Il tuo piano: preleva {amount}',
  'account.prop-challenge.notice.record-payout': 'Registra payout',
  'account.prop-challenge.notice.skip-cycle': 'Salta questo ciclo',
  'account.prop-challenge.notice.payout-description': 'Payout prop',
  'account.prop-challenge.notice.lost-title': 'Payout non più disponibile',
  'account.prop-challenge.notice.lost-description':
    'Non soddisfatti: {requirements}',
  'account.prop-challenge.notice.dismiss': 'Chiudi',
  'account.prop-challenge.notice.unknown-title': 'Nuovo conto {label}',
  'account.prop-challenge.notice.unknown-description':
    '{count} operazioni dal {date} non sono assegnate a una fase.',
  'account.prop-challenge.notice.unknown-description-one':
    '1 operazione dal {date} non è assegnata a una fase.',
  'account.prop-challenge.notice.same-phase': 'Stessa fase',
  'account.prop-challenge.notice.not-now': 'Non ora',
  'account.prop-challenge.notice.error': "Impossibile aggiornare l'avviso.",
  'account.prop-challenge.notice.type-changed':
    'Tipo di conto impostato su {accountType}',
  'account.prop-challenge.payout.plan.title': 'Piano di payout',
  'account.prop-challenge.payout.plan.notify-minimum':
    'Avvisa quando almeno ({currency})',
  'account.prop-challenge.payout.plan.withdrawal': 'Prelievo suggerito',
  'account.prop-challenge.payout.plan.full': 'Importo intero',
  'account.prop-challenge.payout.plan.percent': 'Percentuale del disponibile',
  'account.prop-challenge.payout.plan.amount': 'Importo fisso',
  'account.prop-challenge.payout.plan.percent-invalid':
    'Inserisci una percentuale tra 1 e 100.',
  'account.prop-challenge.payout.plan.amount-invalid':
    'Inserisci un importo maggiore di zero.',
  'account.prop-challenge.payout.plan.percent-value': 'Percentuale',
  'account.prop-challenge.payout.plan.amount-value': 'Importo ({currency})',
  'account.prop-challenge.payout.plan.save': 'Salva piano',
  'account.prop-challenge.payout.plan.saved': 'Piano di payout salvato.',
  'account.prop-challenge.payout.plan.summary-notify': 'avvisa ≥ {amount}',
  'account.prop-challenge.payout.plan.summary-percent': 'suggerisci {percent}%',
  'account.prop-challenge.payout.plan.summary-amount': 'suggerisci {amount}',
  'account.prop-challenge.payout.plan.summary-full': 'importo intero',
  'account.prop-challenge.actions.error':
    'Impossibile aggiornare la challenge prop.',
  'account.prop-challenge.confirm.advance':
    'Confermare il risultato di questa fase e continuare la challenge?',
  'account.prop-challenge.confirm.advance-with-promotion':
    'Questo farà avanzare la challenge e cambierà il tipo di conto in {accountType}.',
  'account.prop-challenge.confirm.fail':
    'Segnare {account} come non superato? La challenge “{challenge}” termina a {phase}.',
  'account.prop-challenge.confirm.archive-failed':
    'Archiviare {account}? La challenge “{challenge}” non è stata superata. Il conto passa ad Archiviato.',
  'account.prop-challenge.confirm.archive-passed':
    'Archiviare {account}? La challenge “{challenge}” è stata superata. Il conto passa ad Archiviato.',
  'account.prop-challenge.transition.route':
    '{account} · {from} → {to} transizione',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → challenge superata',
  'account.prop-challenge.confirm.reopen':
    'Riaprire {account}? La challenge “{challenge}” torna a {phase}.',
  'account.prop-challenge.transition.time': 'Ora di transizione',
  'account.prop-challenge.transition.now': 'Adesso',
  'account.prop-challenge.transition.when-target-reached':
    "Quando l'obiettivo è stato raggiunto",
  'account.prop-challenge.transition.too-early':
    "L'ora di transizione non può essere precedente all'inizio di questa fase.",
  'account.prop-challenge.costs.title': 'Costi una tantum',
  'account.prop-challenge.costs.description':
    'Traccia separatamente le commissioni di acquisto, reset e attivazione.',
  'account.prop-challenge.costs.kind': 'Tipo',
  'account.prop-challenge.costs.kind.purchase': 'Acquisto',
  'account.prop-challenge.costs.kind.reset': 'Reset challenge',
  'account.prop-challenge.costs.kind.activation': 'Attivazione',
  'account.prop-challenge.costs.kind.other': 'Altro',
  'account.prop-challenge.costs.date': 'Data',
  'account.prop-challenge.costs.amount': 'Importo',
  'account.prop-challenge.costs.note': 'Nota (facoltativa)',
  'account.prop-challenge.costs.add': 'Aggiungi costo',
  'account.header.copies': 'Copia',
  'account.header.copied-by-more': '+{count} in più',
  'account.header.created': 'Creato:',
  'account.summary.current-balance': 'Saldo attuale',
  'account.summary.net-cash-flow': 'Flusso di cassa netto',
  'account.summary.payouts': 'Payout',
  'account.performance.title': 'Prestazioni',
  'account-page.guide.whats-new.cockpit.intro.title':
    'Le regole della tua challenge',
  'account-page.guide.whats-new.cockpit.intro.description':
    'Su un conto prop firm, ogni regola della firm e quanto ci sei vicino si trovano sotto le metriche.',
  'account-page.guide.whats-new.cockpit.cockpit.title':
    'Controlla una fase e agisci',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    "Scegli una fase nell'intestazione delle regole per vederne le regole. Segnala come superata o fallita, o riaprila, dal menu ⋮ accanto.",
  'account-page.guide.main.challenge.title':
    "La tua challenge a colpo d'occhio",
  'account-page.guide.main.challenge.description':
    'Scegli una fase per vedere ogni regola con il suo avanzamento. Le fasi finanziate con regole di payout verificate monitorano qui anche l’idoneità al payout.',
  'account.transaction.edit-row-label':
    'Modifica o elimina questa transazione: {date}, {amount}',
  'account.deposits-withdrawals.summary':
    '{deposits} depositati · {withdrawn} prelevati · ultimo {date}',
  'account.payouts.title': 'Payout',
  'account.payouts.summary': '{count} payout · {total} · ultimo {date}',
  'account.payouts.summary-masked':
    'Lo storico dei pagamenti è nascosto finché i valori sono mascherati',
  'account.payouts.summary-one': '1 payout · {total} · ultimo {date}',
  'account.payouts.empty': 'Nessun payout ancora',
  'account.payouts.empty-sub':
    "Registra un payout con il pulsante + nell'intestazione.",
  'account.ledger.column.date': 'Data',
  'account.ledger.column.type': 'Tipo',
  'account.ledger.column.payout': 'Payout ricevuto',
  'account.ledger.column.description': 'Descrizione',
  'account.ledger.column.amount': 'Importo',
  'account.ledger.column.balance-after': 'Saldo dopo',
  'home.widget.eval-roi.title': 'ROI eval',
  'home.widget.eval-roi.unable-to-load': 'Impossibile caricare',
  'home.widget.eval-roi.no-challenges': 'Nessuna challenge prop',
  'home.widget.eval-roi.challenge-count': '{count} valutazione',
  'home.widget.eval-roi.challenge-count-plural': '{count} valutazioni',
  'home.widget.eval-roi.net': 'Netto',
  'home.widget.eval-roi.spent': 'Speso',
  'home.widget.eval-roi.payouts': 'Payout',
  'home.widget.eval-roi.break-even': 'Pareggio',
  'home.widget.challenge-alerts.title': 'Avvisi challenge',
  'home.widget.challenge-alerts.unable-to-load':
    'Impossibile controllare gli avvisi della challenge',
  'home.widget.challenge-alerts.empty': 'Nessun avviso challenge',
  'home.widget.challenge-alerts.count': '{count} avviso',
  'home.widget.challenge-alerts.count-plural': '{count} avvisi',
  'home.widget.challenge-alerts.more': '+{count} altri',
  'home.widget.challenge-alerts.kind.failed': 'Non superata',
  'home.widget.challenge-alerts.kind.target': 'Obiettivo raggiunto',
  'home.widget.challenge-alerts.kind.passed': 'Superata',
  'home.widget.challenge-alerts.kind.payout': 'Payout pronto',
  'home.widget.challenge-alerts.kind.lost': 'Payout non più disponibile',
  'home.widget.challenge-alerts.kind.unknown-account': 'Nuovo conto {label}',
  'home.widget.eval-roi.roi-aria': 'Rendimento sulla spesa di valutazione',
  'account.prop-challenge.stage': 'Tipo di stage',
  'account.prop-challenge.stage.evaluation': 'Valutazione',
  'account.prop-challenge.stage.sim-funded': 'Sim finanziato',
  'account.prop-challenge.stage.live-funded': 'Live finanziato',
  'account.prop-challenge.payout-rules.title': 'Regole di payout',
  'account.prop-challenge.payout-rules.add': 'Aggiungi regole di payout',
  'account.prop-challenge.payout-rules.remove': 'Rimuovi regole di payout',
  'account.prop-challenge.payout-rules.cycle': 'Ciclo di idoneità',
  'account.prop-challenge.payout-rules.request-window':
    'Tempistica di richiesta',
  'account.prop-challenge.payout-rules.request-window.anytime':
    'Qualsiasi giorno',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'Giorni feriali specifici',
  'account.prop-challenge.payout-rules.request-window.time-zone': 'Fuso orario',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'Giorni di richiesta consentiti',
  'account.prop-challenge.payout-rules.cycle.none': 'Nessun ciclo di attesa',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'Giorni di trading',
  'account.prop-challenge.payout-rules.cycle.qualifying-days':
    'Giorni qualificanti',
  'account.prop-challenge.payout-rules.cycle.calendar-days':
    'Giorni di calendario',
  'account.prop-challenge.payout-rules.days': 'Giorni richiesti',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'Profitto giornaliero minimo',
  'account.prop-challenge.payout-rules.anchor': 'Il ciclo parte da',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'Inizio stage',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'Primo trade',
  'account.prop-challenge.payout-rules.minimum-balance':
    'Saldo minimo del conto',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Profitto minimo del ciclo',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'Profitto minimo del ciclo per numero di payout',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'Richiedi profitto di ciclo positivo dopo il primo payout',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Quota massima del giorno migliore (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'Quota massima del giorno migliore per numero di payout (%)',
  'account.prop-challenge.payout-rules.availability': 'Profitto disponibile',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Sopra il saldo iniziale',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Sopra il floor di saldo',
  'account.prop-challenge.payout-rules.balance-floor': 'Floor di saldo',
  'account.prop-challenge.payout-rules.request-percent':
    'Quota prelevabile (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'Nuovo profitto richiesto da ogni richiesta (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'Limita la richiesta così che la percentuale configurata sia coperta dal profitto guadagnato nel ciclo payout attuale. Ad esempio, il 50% consente una richiesta fino al doppio del profitto del ciclo corrente.',
  'account.prop-challenge.payout-rules.minimum-request': 'Richiesta minima',
  'account.prop-challenge.payout-rules.maximum': 'Richiesta massima',
  'account.prop-challenge.payout-rules.maximum.none': 'Nessun massimo',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Massimo fisso',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'Massimo solo sul primo payout',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Massimo per numero di payout',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'Percentuale del profitto del ciclo',
  'account.prop-challenge.payout-rules.maximum-amount': 'Importo massimo',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'Massimo del primo payout',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'Massimo del profitto del ciclo (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    "Continua a usare l'importo finale per i payout successivi",
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'Continua a usare il valore finale per i payout successivi',
  'account.prop-challenge.payout-rules.schedule':
    'Importi per numero di payout',
  'account.prop-challenge.payout-rules.profit-split':
    'Quota profitto del trader (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'Cambia i limiti dopo i giorni qualificanti complessivi',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    "Conta i giorni qualificanti sull'intera fase finanziata, anche quando i cicli payout si azzerano.",
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'Giorni qualificanti complessivi richiesti',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'Disponibilità dopo lo sblocco',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'Floor di saldo dopo lo sblocco',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'Profitto disponibile dopo lo sblocco (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'Richiesta massima dopo lo sblocco',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'Importo massimo dopo lo sblocco',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'Programma massimo dopo lo sblocco',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'Percentuale massima del profitto di ciclo dopo lo sblocco',
  'account.prop-challenge.payout-rules.profit-split-model':
    'Modello di profit split',
  'account.prop-challenge.payout-rules.profit-split.fixed': 'Percentuale fissa',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    'Cambia dopo i payout cumulativi',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'Cambia in base al profitto del conto',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'Quota iniziale del trader (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'Soglia di payout cumulativi',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'Quota trader dopo la soglia (%)',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    "Il profitto complessivo del conto è pari al saldo attuale meno il saldo iniziale più i prelievi precedenti. La percentuale sotto o pari/sopra si applica all'intera richiesta.",
  'account.prop-challenge.payout-rules.profit-split.below':
    'Quota trader sotto la soglia (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'Soglia di profitto del conto',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'Quota trader alla soglia o sopra (%)',
  'account.prop-challenge.payout-rules.maximum-payouts': 'Payout massimi',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    "Dopo l'ultimo payout",
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'Continua il conto',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'Chiudi il conto',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'Avanza allo stage successivo',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'Idoneo alla live review',
  'account.prop-challenge.payout-rules.aftermath': 'Dopo un payout approvato',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'Sottrai il payout; mantieni il floor di Drawdown',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'Sottrai il payout; blocca il floor di Drawdown',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'Azzera conto e Drawdown',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'Floor di Drawdown dopo il payout',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'Il primo payout ignora il profitto minimo del ciclo',
  'account.prop-challenge.payout-rules.reset-cycle':
    'Azzera il ciclo di idoneità dopo il payout',
  'account.prop-challenge.payout-rules.group.eligibility': 'Idoneità',
  'account.prop-challenge.payout-rules.group.availability':
    'Payout disponibile',
  'account.prop-challenge.payout-rules.group.terms': 'Condizioni di payout',
  'account.prop-challenge.payout-rules.group.aftermath': 'Dopo il payout',
  'account.prop-challenge.payout.requirement.elapsed-hours': 'Tempo trascorso',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Ore minime trascorse',
  'account.merge.challenge.move-earlier': 'Sposta {account} prima',
  'account.merge.challenge.move-later': 'Sposta {account} dopo',
  'account.merge.warning.use-profile-balance': 'Usa il saldo della firm',
  'account.merge.warning.edit-phases': 'Modifica le fasi',
  'account.merge.title': 'Configurazione challenge',
  'account.merge.loading': 'Caricamento...',
  'account.merge.step.accounts': 'Conti',
  'account.merge.step.phases': 'Fasi',
  'account.merge.step.review': 'Revisione',
  'account.merge.accounts.title': 'Conti da unire',
  'account.merge.accounts.show-archived': 'Mostra archiviati',
  'account.merge.accounts.empty': 'Nessun conto idoneo',
  'account.merge.target.title': 'Conto di destinazione',
  'account.merge.target.keep': 'Mantieni',
  'account.merge.target.new': 'Nuovo nome',
  'account.merge.phase.name': 'Fase',
  'account.merge.phase.status': 'Stato',
  'account.merge.phase.started': 'Iniziata',
  'account.merge.phase.completed': 'Completata',
  'account.merge.phase.no-rules': 'Nessuna',
  'account.merge.review.notes': 'operazioni spostate',
  'account.merge.review.identities': 'conti broker',
  'account.merge.warning.trade-outside-window':
    'Operazioni fuori dalla finestra della fase',
  'account.merge.warning.identity-shared': 'Identità reclamata da più conti',
  'account.merge.warning.copy-trading-dropped':
    'Periodi di copy trading scartati',
  'account.merge.error.too-few-sources': 'Seleziona almeno due conti.',
  'account.merge.error.duplicate-source': 'Un conto è elencato due volte.',
  'account.merge.error.target-exists': 'Quel nome appartiene a un altro conto.',
  'account.merge.error.currency-mismatch': 'I conti usano valute diverse.',
  'account.merge.error.timeline-not-monotonic':
    'Gli orari di inizio fase devono aumentare.',
  'account.merge.error.invalid-override': 'Controlla le date di questa fase.',
  'account.merge.error.source-missing': 'Un conto non ha impostazioni salvate.',
  'account.merge.error.unknown': 'Unione non riuscita.',
  'account.merge.action.merge': 'Unisci',
  'account.merge.action.undo': 'Annulla unione',
  'account.merge.action.looks-right': 'Va bene',
  'account.merge.action.delete': 'Elimina i conti legacy',
  'account.merge.notice.converted': 'Convertito in una challenge',
  'account.merge.summary.intro':
    'Controlla che corrisponda alla tua challenge:',
  'account.merge.summary.phases': 'Fasi: {phases}',
  'account.merge.summary.current':
    'Ora in {phase} ({stage}), iniziata il {date}',
  'account.merge.summary.current-stage': 'Ora in {phase}, iniziata il {date}',
  'account.merge.summary.trades':
    '{counted} trade su {total} contano per la challenge',
  'account.merge.summary.trades-missing':
    '{counted} trade su {total} contano per la challenge. Gli altri sono fuori dalle date di tutte le fasi.',
  'account.merge.summary.rules': 'Regole di {phase}: {rules}',
  'account.merge.summary.no-rules':
    'Nessuna regola impostata per {phase}. Aggiungi le regole della tua firm in Modifica conto.',
  'account.merge.notice.title': 'Unito da {accounts}',
  'account.merge.notice.error': 'Azione non riuscita.',
  'account.merge.undo.title': 'Annulla unione',
  'account.merge.undo.message':
    'Ripristina i conti legacy e le loro operazioni.',
  'account.merge.delete.title': 'Elimina i conti legacy',
  'account.merge.delete.message':
    "Elimina i conti legacy archiviati. L'azione non può essere annullata.",
  'command.open-legacy-challenge-onboarding': 'Configura le challenge prop',
  'account.merge.step.challenge': 'Challenge prop',
  'account.merge.action.convert': 'Converti',
  'account.merge.profile.applied': 'Applicato: {firm} · {challenge}',
  'account.merge.profile.remove': 'Rimuovi',
  'account.merge.phase.apply-profile': 'Applica le regole della firm',
  'account.merge.profile.replace-rules.title':
    'Sostituire le regole inserite a mano?',
  'account.merge.profile.replace-rules.body':
    'Il profilo di {firm} definisce le regole di ogni fase. Le regole inserite in questa pagina verranno sostituite.',
  'account.merge.profile.replace-rules.confirm': 'Sostituisci regole',
  'guide.legacy-setup.list.title': 'Qui trovi ogni conto senza sfida',
  'guide.legacy-setup.list.description':
    'Decidi conto per conto. «Lascia così» lo mantiene esattamente com’è; potrai sempre configurarlo più tardi dalle impostazioni della dashboard.',
  'guide.legacy-setup.assign.title': 'Raggruppa le fasi della stessa sfida',
  'guide.legacy-setup.assign.description':
    'I conti che erano fasi della stessa sfida vanno in un gruppo (suggeriamo i gruppi dai nomi corrispondenti). Un conto da solo diventa una sfida a fase singola.',
  'guide.legacy-setup.continue.title': 'Una breve configurazione per sfida',
  'guide.legacy-setup.continue.description':
    'Continua apre la configurazione di ogni gruppo a turno. Nulla cambia finché non confermi ciascuna.',
  'guide.merge-wizard.target.title': 'Un conto conserva la cronologia',
  'guide.merge-wizard.target.description':
    'Il conto di destinazione resta con tutte le fasi. Gli altri vengono archiviati, non eliminati, e le loro operazioni passano al conto di destinazione.',
  'guide.merge-wizard.identity.title': 'Scegli le regole della tua firm',
  'guide.merge-wizard.identity.description':
    "Scegli la tua firm e il tuo piano per compilare fasi e regole. La tua firm non c'è? Scegli Altra / firm personalizzata e imposta le regole nella pagina successiva.",
  'guide.merge-wizard.identity.free-title': 'Dai un nome alla challenge',
  'guide.merge-wizard.identity.free-description':
    'Dalle un nome e, se vuoi, quello della tua firm. Le regole salvate di una challenge precedente compilano fasi e regole; altrimenti le imposti nella pagina successiva.',
  'guide.merge-wizard.phases.title': 'Controlla ogni fase',
  'guide.merge-wizard.phases.description':
    'Imposta il tipo di stadio, segna come Superate le fasi completate e come Attiva quella in corso, e conferma le date.',
  'guide.merge-wizard.review.title': 'Non succede nulla finché non confermi',
  'guide.merge-wizard.review.description':
    'Dopo la conversione, la pagina del conto elenca cosa è stato configurato così puoi controllarlo, e puoi annullarlo da lì.',
  'account.merge.challenge.accounts': 'Conti',
  'account.merge.challenge.order-hint': 'Fase più vecchia per prima',
  'account.merge.challenge.single-hint':
    'Questo conto diventa una challenge da solo',
  'account.merge.phase.broker-accounts.one': '{count} conto broker',
  'account.merge.phase.broker-accounts.few': '{count} conti broker',
  'account.merge.phase.broker-accounts.many': '{count} conti broker',
  'account.merge.phase.broker-accounts.other': '{count} conti broker',
  'account.merge.review.phase-count.one': 'fase',
  'account.merge.review.phase-count.few': 'fasi',
  'account.merge.review.phase-count.many': 'fasi',
  'account.merge.review.phase-count.other': 'fasi',
  'account.merge.phase.pending': 'In attesa',
  'account.merge.phase.starts-after': 'Inizia dopo aver superato {phase}',
  'account.merge.phase.pending-rules': 'Regole: {rules}',
  'account.merge.review.archived': 'archiviati',
  'account.merge.review.starts-after': 'Dopo {phase}',
  'account.merge.review.since': 'Dal {date}',
  'account.merge.sequence': 'Challenge {index} di {total}',
  'account.merge.warning.balance-differs':
    'Il saldo iniziale differisce dalle regole della firm',
  'account.merge.error.profile-phase-mismatch':
    'Più conti che fasi nelle regole della firm',
  'account.merge.error.profile-currency-mismatch':
    'Le regole della firm usano una valuta diversa da questi conti.',
  'account.merge.error.source-changed':
    'Un conto è cambiato. Rivedi la fusione.',
  'account.merge.error.multiple-active-phases':
    'Solo l’ultimo conto può restare ancora attivo.',
  'account.merge.error.phases-after-failed-source':
    'Un account fallito chiude la sfida, quindi deve essere selezionato per ultimo.',
  'account.merge.error.copy-trading-overlap':
    'I periodi di copy trading si sovrappongono. Chiudi prima un periodo.',
  'onboarding.legacy-challenge.legend':
    'Scegli cosa succede a ogni conto precedente. Avevi un conto separato per ogni fase, come Fase 1 e Finanziato? Mettili nella stessa challenge così diventano un unico conto con fasi.',
  'onboarding.legacy-challenge.assign.leave': 'Mantieni come conto normale',
  'onboarding.legacy-challenge.assign.own': 'Trasforma in challenge',
  'onboarding.legacy-challenge.assign.group':
    'Aggiungi alla challenge {letter}',
  'onboarding.legacy-challenge.assign.new-group':
    'Unisci in una nuova challenge…',
  'onboarding.legacy-challenge.action.continue': 'Continua',
  'onboarding.legacy-challenge.action.continue-count': 'Configura {count}',
  'guide.action-step.dismiss': 'Non ora',
  'guide.legacy-challenge.title':
    'Configura i conti precedenti a questo aggiornamento',
  'guide.legacy-challenge.description':
    'Trasforma vecchi conti di valutazione o finanziati in challenge. La configurazione ti guida tra fasi e date e alla fine mostra cosa è stato configurato così puoi controllarlo.',
  'guide.legacy-challenge.action': 'Configura i miei conti',
  'onboarding.legacy-challenge.title': 'Challenge prop',
  'onboarding.legacy-challenge.action.skip': 'Salta',
  'onboarding.legacy-challenge.accounts.show-archived': 'Mostra archiviati',
  'onboarding.legacy-challenge.accounts.empty': 'Nessun conto da configurare',
  'onboarding.legacy-challenge.loading': 'Caricamento...',
  'onboarding.legacy-challenge.suggested': 'Suggerito',
  'onboarding.legacy-challenge.row.aria': 'Azione per {account}',
  'onboarding.legacy-challenge.status.combined': 'Combinati',
  'onboarding.legacy-challenge.status.converted': 'Convertito',
  'onboarding.legacy-challenge.entry.name': 'Challenge prop',
  'onboarding.legacy-challenge.entry.desc':
    'Unisci o converti i conti esistenti in challenge.',
  'onboarding.legacy-challenge.entry.action': 'Configura',
};

export default it;
