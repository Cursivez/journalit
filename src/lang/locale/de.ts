

import type { Lang } from './en';

const de: Lang = {
  'command.add-trade': 'Neuen Trade hinzufügen',
  'command.quick-import-trades': 'Trades schnell importieren',
  'command.import-trades-csv': 'Trade Import öffnen',
  'command.create-drc': 'Öffnen Sie DRC (Tagesbericht)',
  'command.create-weekly-review': 'Offener wöchentlicher Rückblick',
  'command.create-monthly-review': 'Monatsreview öffnen',
  'command.create-quarterly-review': 'Quartalsreview öffnen',
  'command.create-yearly-review': 'Offener Jahresrückblick',
  'command.open-dashboard': 'Trading-Dashboard öffnen',
  'command.open-account-dashboard': 'Konto-Dashboard öffnen',
  'command.open-trade-log': 'Trade-Log öffnen',
  'command.open-home': 'Home-Ansicht öffnen',
  'command.open-position-size-calculator': 'Positionsgrößenrechner öffnen',
  'command.replay-onboarding': 'Wiederholen Sie den Onboarding-Ablauf',
  'command.replay-current-view-guide':
    'Wiedergabeanleitung für die aktuelle Ansicht',
  'command.open-release-notes': 'Versionshinweise anzeigen',
  'command.open-layout-builder': 'Öffnen Sie den Layout-Builder',
  'command.switch-template': 'Vorlage wechseln',
  'notice.guide.replay-unavailable':
    'Das Guide-System ist noch nicht fertig. Bitte versuchen Sie es erneut.',
  'notice.guide.no-active-view':
    'Öffnen Sie zuerst eine unterstützte Journalit-Ansicht und führen Sie dann diesen Befehl aus.',
  'notice.guide.no-guide-for-view':
    'Für diese Ansicht ist noch kein Guide registriert ({viewType}).',
  'notice.guide.replay-failed':
    'Der Guide konnte nicht gestartet werden. Bitte versuchen Sie es erneut.',
  'notice.guide.replay-started':
    'Der Guide wurde für diese Ansicht neu gestartet.',
  'template.switch-title': 'Layout wechseln',
  'template.switch-trade-title': 'Trade-Layout wechseln',
  'template.switch-review-title': '{type}-Layout wechseln',
  'template.no-template': 'Keine Vorlage',
  'template.label': 'Vorlage',
  'template.assign-to-note': 'Weisen Sie dieser Notiz eine Vorlage zu',
  'template.switch-action': 'Layout wechseln',
  'template.review-type.drc': 'DRC',
  'template.review-type.weekly': 'wöchentlich',
  'template.review-type.monthly': 'monatlich',
  'template.review-type.quarterly': 'vierteljährlich',
  'template.review-type.yearly': 'jährlich',
  'template.review-type.review': 'Review',
  'template.builder.select-template':
    'Wählen Sie eine Vorlage zum Bearbeiten aus',
  'template.builder.loading': 'Layout-Builder wird geladen...',
  'template.builder.create-from-sidebar':
    'Oder erstellen Sie in der Seitenleiste ein neues',
  'template.builder.snippet-coming-soon': 'Snippet-Editor kommt bald',
  'template.preview.empty': 'In dieser Vorlage sind keine Widgets enthalten',
  'template.preview.summary': '{type}-Vorlage – {count}-Widgets',
  'template.preview.mode': 'Vorschaumodus',
  'template.preview.markdown-zone-placeholder':
    'Markdown-Zone – Benutzer schreiben hier',
  'template.preview.markdown-zone-placeholder-with-id':
    'Markdown-Zone ({id}) – Benutzer schreiben hier',
  'template.preview.widget.game-performance-desc':
    'Mentale/technische Notenverteilung',
  'template.preview.widget.unknown-desc': 'Unbekannter Widget-Typ',
  'template.section.forecast': 'Vorhersage',
  'template.section.performance': 'Leistung',
  'template.section.review': 'Review',
  'template.question.drc.q1': 'Was habe ich heute gut gemacht?',
  'template.question.drc.q2': 'Was könnte ich verbessern?',
  'template.question.drc.q3':
    'Worauf werde ich mich in der nächsten Sitzung konzentrieren?',
  'template.question.weekly.q1': 'Was hat diese Woche gut funktioniert?',
  'template.question.weekly.q2': 'Was hat diese Woche nicht funktioniert?',
  'template.question.weekly.q3': 'Welche Setups waren am profitabelsten?',
  'template.question.weekly.q4': 'Welche Fehler kosten mich am meisten Geld?',
  'template.question.weekly.q5': 'Was könnte ich nächste Woche verbessern?',
  'template.question.monthly.q1':
    'Was waren die wichtigsten Lehren aus diesem Monat?',
  'template.question.monthly.q2':
    'Welche Strategien haben am besten abgeschnitten?',
  'template.question.monthly.q3':
    'Welche Muster bemerke ich in meinem Trading?',
  'template.question.monthly.q4':
    'Was sind meine Ziele für den nächsten Monat?',
  'template.question.monthly.q5':
    'Wie kann ich mein Risikomanagement verbessern?',
  'template-picker.empty': 'Keine Layouts verfügbar.',
  'template-picker.close': 'Schließen',
  'template-picker.built-in': '(eingebaut)',
  'template-picker.badge.default': 'Standard',
  'template-picker.badge.current': 'Aktuell',
  'template-picker.cancel': 'Abbrechen',
  'auth.title.already-logged-in': 'Bereits eingeloggt',
  'auth.desc.already-logged-in': 'Sie sind bereits angemeldet{email}.',
  'auth.title.sign-in': 'Melden Sie sich bei Journalit an',
  'auth.desc.email':
    'Geben Sie Ihre E-Mail-Adresse ein, um einen Bestätigungscode für den Zugang zur privaten Beta zu erhalten.',
  'auth.label.email': 'E-Mail-Adresse',
  'auth.placeholder.email': 'your.email@example.com',
  'auth.button.send-code': 'Bestätigungscode senden',
  'auth.button.sending': 'Senden...',
  'auth.desc.code':
    'Wir haben einen 6-stelligen Bestätigungscode an {email} gesendet. Bitte geben Sie es unten ein, um Ihre Anmeldung abzuschließen.',
  'auth.label.code': 'Bestätigungscode',
  'auth.placeholder.code': '123456',
  'auth.button.verify': 'Bestätigen und anmelden',
  'auth.button.verifying': 'Überprüfung...',
  'auth.button.resend': 'Code erneut senden',
  'auth.footer.trouble':
    'Haben Sie Probleme? Der Bestätigungscode läuft in 15 Minuten ab.',
  'auth.footer.resend-wait':
    'Sie können innerhalb von {seconds} Sekunden einen neuen Code anfordern.',
  'auth.footer.resend-now':
    'Sie können den Code nun über die Schaltfläche oben erneut senden.',
  'auth.footer.enter-email':
    'Geben Sie Ihre E-Mail-Adresse ein, um einen Bestätigungscode zu erhalten.',
  'auth.error.invalid-email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  'auth.error.enter-code': 'Bitte geben Sie den Bestätigungscode ein',
  'auth.error.code-digits': 'Der Bestätigungscode sollte 6 Ziffern lang sein',
  'auth.error.too-many-requests':
    'Sie haben zu viele Codes angefordert. Bitte warten Sie 30 Minuten und versuchen Sie es erneut.',
  'auth.error.send-failed': 'Der Bestätigungscode konnte nicht gesendet werden',
  'auth.error.verify-failed': 'Code konnte nicht verifiziert werden',
  'auth.error.resend-failed':
    'Der Bestätigungscode konnte nicht erneut gesendet werden',
  'auth.error.invalid-code': 'Ungültiger Bestätigungscode',
  'auth.status.disconnected': 'Abgemeldet',
  'auth.error.token-expired':
    'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an, um die Pro-Funktionen weiterhin nutzen zu können.',
  'auth.error.failed':
    'Authentifizierung nicht möglich. Bitte versuchen Sie es erneut.',
  'auth.error.failed-reason': 'Authentifizierung nicht möglich: {reason}',
  'auth.error.token-invalid': 'Token ist nicht mehr gültig',
  'auth.error.server-validation-failed':
    'Die Servervalidierung ist fehlgeschlagen',
  'auth.error.invalid-user-data': 'Ungültige Benutzerdaten empfangen',
  'auth.error.needs-auth':
    'Melden Sie sich an, um auf die Pro-Funktionen zuzugreifen. Grundlegende Funktionen sind weiterhin verfügbar.',
  'auth.error.needs-premium': 'Pro-Funktion',
  'auth.error.needs-premium-desc':
    'Dies ist eine Pro-Funktion. Besuchen Sie unsere Website, um sich anzumelden und freizuschalten.',
  'auth.error.network-error': 'Verbindungsfehler',
  'auth.error.network-error-verify':
    'Der Pro-Zugriff konnte nicht verifiziert werden. Überprüfen Sie Ihre Verbindung oder fahren Sie mit den Grundfunktionen fort.',
  'auth.error.network-error-basic':
    'Offline arbeiten. Grundlegende Funktionen sind weiterhin verfügbar.',
  'auth.error.offline-expired':
    'Die Offline-Kulanzfrist ist abgelaufen. Bitte stellen Sie die Verbindung wieder her, um die Pro-Funktionen weiterhin nutzen zu können.',
  'auth.expiry-warning-tomorrow':
    'Ihre Sitzung läuft morgen ab. Bitte melden Sie sich bald wieder an, um die Pro-Funktionen weiterhin nutzen zu können.',
  'auth.expiry-warning-days':
    'Ihre Sitzung läuft in {days} Tagen ab. Bitte melden Sie sich erneut an, um die Pro-Funktionen weiterhin nutzen zu können.',
  'auth.offline.active':
    'Arbeiten im Offline-Modus. Einige Pro-Funktionen sind möglicherweise eingeschränkt.',
  'auth.offline.grace-remaining':
    'Offline-Kulanzzeitraum: {days} verbleibende Tage',
  'form.modal.unsaved-changes.title': 'Nicht gespeicherte Änderungen',
  'form.modal.unsaved-changes.body1':
    'Sie haben nicht gespeicherte Änderungen im Trade-Formular.',
  'form.modal.unsaved-changes.body2':
    'Möchten Sie wirklich schließen, ohne zu speichern?',
  'form.modal.unsaved-changes.continue': 'Bearbeiten Sie weiter',
  'form.modal.unsaved-changes.discard': 'Änderungen verwerfen',
  'template-builder.modal.unsaved-changes.title':
    'Nicht gespeicherte Änderungen',
  'template-builder.modal.unsaved-changes.body1':
    'Sie haben nicht gespeicherte Änderungen in dieser Vorlage.',
  'template-builder.modal.unsaved-changes.body2':
    'Sind Sie sicher, dass Sie ohne Speichern wechseln möchten?',
  'template-builder.modal.unsaved-changes.continue': 'Bearbeiten Sie weiter',
  'template-builder.modal.unsaved-changes.discard': 'Änderungen verwerfen',
  'template-builder.modal.delete.title': 'Layout löschen',
  'template-builder.modal.delete.body':
    'Sind Sie sicher, dass Sie „{name}“ löschen möchten?',
  'template-builder.modal.delete.warning':
    'Diese Aktion kann nicht rückgängig gemacht werden.',
  'template-builder.modal.delete.cancel': 'Abbrechen',
  'template-builder.modal.delete.confirm': 'Löschen',
  'tradelog.settings.modal.unsaved-changes.body1':
    'Sie haben nicht gespeicherte Änderungen in den Spalteneinstellungen.',
  'tradelog.settings.modal.unsaved-changes.body2':
    'Möchten Sie wirklich schließen, ohne zu speichern?',
  'notice.error.missed-trade-service-init':
    'Der verpasste Trade-Service wurde nicht initialisiert. Bitte warten Sie einen Moment und versuchen Sie es erneut.',
  'notice.error.backtest-trade-service-init':
    'Backtest-Trade-Service ist nicht initialisiert. Bitte warten Sie einen Moment und versuchen Sie es erneut.',
  'notice.trade-updated': '{type} aktualisiert: {path}',
  'notice.trade-created': '{type} erstellt: {path}',
  'notice.new-trade-created':
    '📈 Neuer Trade erstellt: {instrument} {direction}',
  'notice.error.trade-update-failed':
    'Fehler beim Aktualisieren von {type}: {error}',
  'notice.error.trade-create-failed':
    'Fehler beim Erstellen von {type}: {error}',
  'form.section.trade-details': 'Trade-Details',
  'form.section.trading-costs': 'Handelskosten',
  'form.section.risk-management': 'Risikomanagement',
  'form.section.take-profits': 'Gewinnziele',
  'form.section.analysis-thesis': 'Analyse & These',
  'form.section.custom-fields': 'Benutzerdefinierte Felder',
  'form.section.custom-fields-desc':
    'Benutzerdefinierte Felder, die in Ihren Plugin-Einstellungen definiert sind. Diese Felder werden im Frontmatter Ihres Trades gespeichert.',
  'form.section.custom-fields-empty':
    'Keine benutzerdefinierten Felder konfiguriert. Gehen Sie zu Einstellungen → Anpassung → Benutzerdefinierte Trade-Felder, um benutzerdefinierte Felder hinzuzufügen.',
  'form.section.custom-fields-empty-title': 'Noch keine erweiterten Felder.',
  'form.section.custom-fields-empty-desc':
    'Erstellen Sie benutzerdefinierte Trade-Felder unter Einstellungen → Anpassung → Benutzerdefinierte Trade-Felder.',
  'form.section.attachments': 'Anhänge',
  'form.tab.basic': 'Basis',
  'form.tab.details': 'Einzelheiten',
  'form.tab.advanced': 'Fortschrittlich',

  
  
  
  'form.import-shortcut.open': 'Trade-Import öffnen',
  'form.layout.customize': 'Formular anpassen',
  'form.layout.modal-title': 'Trade-Formular anpassen',
  'form.layout.settings-title': 'Trade-Formularlayout',
  'form.layout.settings-desc':
    'Wähle, wie du Trades journalst und welche optionalen Blöcke im Trade-Formular erscheinen.',
  'form.layout.core-fields-note':
    'Trade-Typ, Konto, Asset-Typ, Instrument, Richtung und die erforderlichen Preis- oder P&L-Eingaben bleiben je nach ausgewähltem Eingabemodus sichtbar.',
  'form.layout.input-mode': 'Eingabemodus',
  'form.layout.input-mode-prices': 'Preise',
  'form.layout.input-mode-pnl-risk': 'P&L + Risiko',
  'form.layout.input-mode-prices-desc':
    'Journale Einstiegs- und Ausstiegspreise und lasse Journalit den P&L berechnen.',
  'form.layout.input-mode-pnl-risk-desc':
    'Journale Trade-P&L und Risikobetrag direkt. Journalit berechnet das R-Multiple automatisch.',
  'form.layout.asset-type-mode': 'Asset-Typ',
  'form.layout.asset-type-mode-show': 'Abfragen',
  'form.layout.asset-type-mode-fixed': 'Fest',
  'form.layout.default-asset-type': 'Standard-Asset-Typ',
  'form.layout.active-fields': 'Sichtbare Blöcke',
  'form.layout.available-fields': 'Ausgeblendete Blöcke',
  'form.layout.active-fields-desc':
    'Ziehe Blöcke, um sie neu zu sortieren. Entferne alles, was du nicht nutzt.',
  'form.layout.available-fields-desc':
    'Füge ausgeblendete Blöcke wieder zum Trade-Formular hinzu, wenn du sie brauchst.',
  'form.layout.empty-active': 'Keine optionalen Blöcke sind sichtbar.',
  'form.layout.all-active': 'Alle optionalen Blöcke sind sichtbar.',
  'form.layout.add-field-aria': '{field} zum Trade-Formular hinzufügen',
  'form.layout.remove-field-aria': '{field} im Trade-Formular ausblenden',
  'form.layout.saved': 'Trade-Formularlayout gespeichert',
  'form.layout.item.trading-costs.commission': 'Kommission',
  'form.layout.item.import-shortcut': 'Import-Verknüpfung',
  'form.layout.item.import-shortcut-desc':
    'Zeigt eine Footer-Schaltfläche, die den Trade-Import öffnet.',
  'form.layout.item.core-details': 'Kernhandelsdetails',
  'form.layout.item.core-details-desc':
    'Konto, Instrument, Richtung sowie Ein- und Ausstiege bleiben zuerst.',
  'form.layout.item.asset-specific': 'Asset-spezifische Felder',
  'form.layout.item.pnl-preview': 'P&L-Vorschau',
  'form.layout.item.realized-pnl-preview':
    'P&L-Zusammenfassung für Teilausstieg',
  'form.layout.item.realized-pnl-preview-desc':
    'Wird nur bei offenen Trades nach Teilausstiegen angezeigt; die Position ist fest.',
  'form.layout.result-r': 'Ergebnis in R',
  'form.layout.entry-time': 'Trade-Zeit',
  'form.field.account': 'Konto',
  'form.field.asset-type': 'Asset-Typ',
  'form.field.asset-type.stock': 'Aktie',
  'form.field.asset-type.options': 'Optionen',
  'form.field.asset-type.futures': 'Futures',
  'form.field.asset-type.forex': 'Forex',
  'form.field.asset-type.crypto': 'Krypto',
  'form.field.asset-type.cfd': 'CFD',
  'form.field.direction': 'Richtung',
  'form.field.direction.long': 'Kaufen',
  'form.field.direction.short': 'Verkaufen',
  'form.field.commission': 'Kommission',
  'form.field.commission-type': 'Typ',
  'form.field.rebate': 'Rabatt',
  'form.field.swap': 'Swap',
  'form.field.swap-tooltip.forex':
    'Zinsdifferenz zwischen Währungen beim Halten von Positionen über Nacht',
  'form.field.swap-tooltip.cfd':
    'Übernachtfinanzierungskosten für gehebelte CFD-Positionen',
  'form.field.swap-tooltip.default':
    'Übernachtfinanzierungskosten, die für das Halten von Positionen berechnet/gutgeschrieben werden',
  'form.field.other-fees': 'Sonstige Gebühren',
  'form.field.stop-loss': 'Stop-Loss',
  'form.field.take-profit': 'Gewinnziel',
  'form.field.take-profit-short': 'Ziel',
  'form.field.target-price': 'Zielpreis',
  'form.field.close-percent': 'Schließen %',
  'form.field.risk-amount': 'Risikobetrag',
  'form.field.profit-loss': 'Gewinn/Verlust',
  'form.field.total-pnl': 'Trade-G/V',
  'form.field.realized-pnl': 'Realisiert P&L',
  'form.field.total-costs': 'Gesamtkosten:',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Fehler',
  'form.field.custom-tags': 'Benutzerdefinierte Tags',
  'form.field.trade-thesis': 'Trade-These',
  'form.field.time': 'Zeit',
  'form.field.price': 'Preis',
  'form.field.size': 'Größe',
  'form.field.entries': 'Einträge',
  'form.field.exits': 'Ausstiege',
  'form.field.dividends': 'Dividenden',
  'form.field.dividend-amount': 'Dividendenbetrag',
  'form.field.optional': '(optional)',
  'form.field.closed': 'geschlossen',
  'form.field.incl-costs': '(inkl. Kosten)',
  'form.field.commission-type.fixed': 'Behoben',
  'form.field.commission-type.percentage': 'Prozentsatz (%)',
  'form.calculated': 'Berechnet',
  'form.account-empty-state.title':
    'Erstellen Sie ein Konto, bevor Sie einen Trade hinzufügen',
  'form.account-empty-state.create-account': 'Konto erstellen',
  'form.account-empty-state.submit-disabled':
    'Erstellen Sie zunächst ein Konto, um diesen Trade zu speichern.',
  'form.empty.take-profits': 'Noch keine Gewinnziele',
  'form.action.add-take-profit': 'Take-Profit hinzufügen',
  'form.action.remove-take-profit': 'Take-Profit entfernen',
  'form.field.position-size': 'Positionsgröße',
  'form.field.position-size.shares': 'Aktien',
  'form.field.position-size.contracts': 'Kontrakte',
  'form.field.position-size.lots': 'Lots',
  'form.field.position-size.amount': 'Menge',
  'form.field.position-size.cfd-units': 'CFD-Einheiten',
  'form.field.instrument': 'Instrument',
  'form.field.instrument.ticker': 'Tickersymbol',
  'form.field.instrument.option-symbol': 'Optionssymbol',
  'form.field.instrument.future-symbol': 'Future-Symbol',
  'form.field.instrument.forex-pair': 'Forex-Paar',
  'form.field.instrument.crypto-symbol': 'Krypto-Symbol',
  'form.field.instrument.cfd-symbol': 'CFD-Symbol',
  'form.field.exchange': 'Börse',
  'form.field.expiration-date': 'Verfallsdatum',
  'form.field.strike-price': 'Ausübungspreis',
  'form.field.contract-size': 'Kontraktgröße',
  'form.field.option-type': 'Optionstyp',
  'form.field.option-type.call': 'Call',
  'form.field.option-type.put': 'Put',
  'form.field.dollars-per-point': 'Dollar pro Punkt',
  'form.field.tick-size': 'Tick-Größe',
  'form.field.tick-value': 'Tick-Wert',
  'form.field.lot-size': 'Lot-Größe',
  'form.field.custom-lot-size': 'Benutzerdefinierte Lot-Größe',
  'form.field.pip-value': 'Pip-Wert',
  'form.field.leverage-ratio': 'Hebelverhältnis',
  'form.field.lot-size.standard': 'Standard (100.000)',
  'form.field.lot-size.mini': 'Mini (10.000)',
  'form.field.lot-size.micro': 'Mikro (1.000)',
  'form.field.lot-size.custom': 'Benutzerdefiniert',
  'form.field.image-url-placeholder': 'Bild-URL oder Dateipfad einfügen...',
  'form.field.image-duplicate-error': 'Dieses Bild wurde bereits hinzugefügt.',
  'form.field.trade-image-alt': 'Trade-Bild',
  'image.loading': 'Laden...',
  'image.load-failed': 'Bild konnte nicht geladen werden',
  'form.field.value-dollar': 'Wert ($)',
  'form.field.dollar-amount-placeholder': 'Dollarbetrag',
  'form.field.direct-pnl-placeholder': 'Gewinn- oder Verlustbetrag eingeben',
  'form.field.mae-dollar-placeholder': 'Maximaler Drawdown in Dollar',
  'form.field.mfe-dollar-placeholder': 'Maximaler Gewinn in Dollar',
  'form.field.mae-placeholder-currency': 'Maximaler Drawdown in {currency}',
  'form.field.mfe-placeholder-currency': 'Maximaler Gewinn in {currency}',
  'form.placeholder.select-accounts': 'Wählen Sie Konten aus',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': 'Provisionsrückerstattung/Gutschrift',
  'form.placeholder.swap': 'Finanzierung über Nacht',
  'form.placeholder.other-fees': 'Plattform-/Regulierungsgebühren',
  'form.placeholder.dividend-amount': 'Bargeldbetrag, positiv oder negativ',
  'form.placeholder.stop-loss': 'Optionaler Stop-Loss-Preis',
  'form.placeholder.target-price': 'Zielpreis',
  'form.placeholder.close-percent': '50 Prozent',
  'form.placeholder.risk-amount': 'Geplantes Risiko in Währung',
  'form.placeholder.custom-tag':
    'Geben Sie ein benutzerdefiniertes Tag ein und drücken Sie die Eingabetaste',
  'form.placeholder.thesis': 'Geben Sie Ihre These für diesen Trade ein...',
  'form.placeholder.pnl': 'Geben Sie den Gesamtgewinn oder -verlust ein',
  'form.placeholder.exchange-stock': 'z. B. NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'z. B. Binance, Coinbase',
  'form.placeholder.futures-point-value': 'Beispiel: 50 für ES1',
  'form.placeholder.leverage': 'z. B. 100 für 1:100',
  'form.entry-exit.add-entry': '+ Einstieg hinzufügen',
  'form.entry-exit.add-exit': '+ Ausstieg hinzufügen',
  'form.entry-exit.remove-entry': 'Einstieg entfernen',
  'form.entry-exit.remove-exit': 'Ausstieg entfernen',
  'form.dividends.add-dividend': '+ Dividende hinzufügen',
  'form.dividends.remove-dividend': 'Dividende entfernen',
  'form.dividends.total-dividends': 'Gesamtdividenden:',
  'form.entry-exit.total-entry-size': 'gesamte Einstiegsgröße:',
  'form.entry-exit.remaining-position': 'Verbleibende Position:',
  'form.entry-exit.open': '(Offen)',
  'form.entry-exit.closed': '(Geschlossen)',
  'form.entry-exit.direct-pnl':
    'Geben Sie anstelle der Preise direkt den Basis-Trade-PnL ein',
  'form.entry-exit.direct-pnl-desc':
    'Geben Sie Trade-Gewinn/-verlust vor Dividenden ein. Provisionen und Gebühren werden weiterhin separat erhoben.',
  'form.entry-exit.calc-pnl':
    'Berechnen Sie die PnL aus Ein-/Ausstiegspreisen und Positionsgrößen.',
  'form.trade-type.title': 'Trade-Typ',
  'form.trade-type.subtitle':
    'Wählen Sie den Trade-Typ aus, den Sie erstellen möchten',
  'form.trade-type.regular': 'Regulärer Trade',
  'form.trade-type.regular-desc':
    'Normaler Trade mit vollständigen Ein- und Ausstiegsdaten',
  'form.trade-type.missed': 'Trade verpasst',
  'form.trade-type.missed-desc':
    'Trade-Gelegenheit, die Sie verpasst haben – die Felder PnL und Konto sind optional',
  'form.trade-type.backtest': 'Backtest-Trade',
  'form.trade-type.backtest-desc': 'Backtesting-Szenario zu Analysezwecken',
  'form.trade-type.missed-reason': 'Warum haben Sie diesen Trade verpasst?',
  'form.trade-type.missed-reason-placeholder':
    'Beschreiben Sie, warum Sie diese Trade-Gelegenheit verpasst haben ...',
  'button.save': 'Speichern',
  'button.cancel': 'Abbrechen',
  'button.done': 'Erledigt',
  'button.edit': 'Bearbeiten',
  'button.delete': 'Löschen',
  'button.update': 'Aktualisieren',
  'button.add': 'Hinzufügen',
  'button.create': 'Erstellen',
  'button.reset': 'Zurücksetzen',
  'button.reset-to-defaults': 'Auf Standardeinstellungen zurücksetzen',
  'button.close': 'Schließen',
  'button.confirm': 'Bestätigen',
  'button.submit': 'Einreichen',
  'button.back': 'Zurück',
  'button.add-trade': 'Trade hinzufügen',
  'button.update-trade': 'Trade aktualisieren',
  'button.save-changes': 'Änderungen speichern',
  'button.create-trade': 'Trade erstellen',
  'button.delete-all': 'Alle löschen',
  'button.clear-all': 'Alles löschen',
  'button.save-name-only': 'Nur Namen speichern',
  'button.cancel-action': 'Aktion abbrechen',
  'button.cancel-reset': 'Zurücksetzen abbrechen',
  'button.proceed-anyway': 'Fahren Sie trotzdem fort',
  'button.mark-reviewed': 'Als geprüft markieren',
  'button.maybe-later': 'Vielleicht später',
  'button.upgrade-now': 'Jetzt upgraden',
  'button.add-first-goal': 'Fügen Sie Ihr erstes Ziel hinzu',
  'button.add-first-event': 'Fügen Sie Ihr erstes Event hinzu',
  'button.create-daily-review': 'Täglichen Review erstellen',
  'button.apply': 'Anwenden',
  'button.apply-settings': 'Einstellungen anwenden',
  'button.learn-more': 'Erfahren Sie mehr',
  'button.upload-image': 'Medien hochladen',
  'button.discord': 'Discord',
  'form.error.image-upload-unavailable': 'Bild-Upload nicht verfügbar',
  'trade.header.unknown-instrument': 'Unbekanntes Instrument',
  'validation.edit': 'BEARBEITEN',
  'validation.fix-errors': 'Bitte beheben Sie die folgenden Fehler:',
  'validation.basic-tab-errors.one':
    'Auf der Registerkarte „Grundlegend“ ist der Fehler {count} aufgetreten',
  'validation.basic-tab-errors.few':
    'Die Registerkarte „Grundlegend“ weist {count}-Fehler auf',
  'validation.basic-tab-errors.many':
    'Die Registerkarte „Grundlegend“ weist {count}-Fehler auf',
  'validation.basic-tab-errors.other':
    'Die Registerkarte „Grundlegend“ weist {count}-Fehler auf',
  'validation.details-tab-errors.one':
    'Auf der Registerkarte „Details“ ist der Fehler {count} aufgetreten',
  'validation.details-tab-errors.few':
    'Die Registerkarte „Details“ weist {count}-Fehler auf',
  'validation.details-tab-errors.many':
    'Die Registerkarte „Details“ weist {count}-Fehler auf',
  'validation.details-tab-errors.other':
    'Die Registerkarte „Details“ weist {count}-Fehler auf',
  'validation.advanced-tab-errors.one':
    'Auf der Registerkarte „Erweitert“ ist der Fehler {count} aufgetreten',
  'validation.advanced-tab-errors.few':
    'Auf der Registerkarte „Erweitert“ sind {count}-Fehler aufgetreten',
  'validation.advanced-tab-errors.many':
    'Auf der Registerkarte „Erweitert“ sind {count}-Fehler aufgetreten',
  'validation.advanced-tab-errors.other':
    'Auf der Registerkarte „Erweitert“ sind {count}-Fehler aufgetreten',
  'validation.complete-required': 'Bitte füllen Sie alle Pflichtfelder aus',
  'validation.map-required-fields':
    'Bitte ordnen Sie vor dem Import alle erforderlichen Felder zu',
  'validation.missed-trade-requires-exit':
    'Für verpasste Trades müssen Exit-Daten mit Preisen ungleich Null vorliegen. Sie stellen Gelegenheiten dar, die bereits verstrichen sind, daher müssen Sie angeben, wie hoch der Ausstiegspreis gewesen wäre.',
  'trade.validation.entry-required':
    'Es ist mindestens ein Einstieg erforderlich.',
  'trade.validation.entry-time-required': 'Die Einstiegszeit ist erforderlich.',
  'trade.validation.entry-price-required': 'Einstiegspreis erforderlich.',
  'trade.validation.entry-size-positive':
    'Die Einstiegsgröße muss größer als Null sein.',
  'trade.validation.exit-required-closed':
    'Für geschlossene Trades ist mindestens ein Ausstieg erforderlich.',
  'trade.validation.exit-time-required': 'Ausstiegszeit ist erforderlich.',
  'trade.validation.exit-price-required': 'Ausstiegspreis ist erforderlich.',
  'trade.validation.exit-size-positive':
    'Die Ausstiegsgröße muss größer als Null sein.',
  'trade.validation.exit-size-exceeds-entry':
    'Die gesamte Ausstiegsgröße darf die gesamte Einstiegsgröße nicht überschreiten.',
  'trade.validation.exit-before-entry':
    'Ausstiege können nicht vor dem ersten Einstieg erfolgen.',
  'trade.validation.dividend-time-required': 'Dividendenzeit ist erforderlich.',
  'trade.validation.dividend-amount-nonzero':
    'Der Dividendenbetrag muss eine Zahl ungleich Null sein.',
  'trade.validation.direct-pnl-required':
    'Bitte geben Sie einen Gewinn-/Verlustwert ein.',
  'trade.validation.entry-time-select':
    'Bitte wählen Sie eine Einstiegszeit aus.',
  'trade.validation.direction-required': 'Bitte wählen Sie eine Richtung aus.',
  'trade.validation.asset-type-required':
    'Bitte wählen Sie einen Asset-Typ aus.',
  'trade.validation.ticker-required': 'Bitte wählen Sie einen Ticker aus.',
  'trade.validation.ticker-invalid':
    'Geben Sie ein gültiges Tickersymbol ein (nur Buchstaben, Zahlen und Punkte).',
  'trade.validation.account-required':
    'Bitte wählen Sie mindestens ein Konto aus.',
  'trade.validation.exit-time-select':
    'Bitte wählen Sie eine Ausstiegszeit aus.',
  'trade.validation.entry-price-invalid':
    'Bitte geben Sie einen gültigen Einstiegspreis ein.',
  'trade.validation.exit-price-invalid':
    'Bitte geben Sie einen gültigen Ausstiegspreis ein.',
  'trade.validation.position-size-invalid':
    'Bitte geben Sie eine gültige Positionsgröße ein.',
  'trade.validation.exit-time-after-entry':
    'Die Ausstiegszeit muss nach der Einstiegszeit liegen.',
  'trade.validation.expiration-date-required':
    'Bitte wählen Sie ein Ablaufdatum aus.',
  'trade.validation.strike-price-required':
    'Bitte geben Sie einen Ausübungspreis ein.',
  'trade.validation.option-type-required':
    'Bitte wählen Sie einen Optionstyp (Call oder Put) aus.',
  'trade.validation.contract-size-positive':
    'Die Kontraktgröße muss größer als Null sein.',
  'trade.validation.dollars-per-point-min':
    'Bitte geben Sie Dollar pro Punkt ein (mindestens 0,01).',
  'trade.validation.lot-size-nonnegative':
    'Die Lot-Größe darf nicht negativ sein.',
  'trade.validation.leverage-positive':
    'Die Hebelverhältnis muss größer als Null sein.',
  'trade.validation.commission-type-invalid':
    'Der Provisionstyp muss entweder „fest“ oder „prozentual“ sein.',
  'trade.validation.commission-number': 'Die Provision muss eine Zahl sein.',
  'trade.validation.commission-percentage-range':
    'Die prozentuale Provision muss zwischen 0 und 100 liegen.',
  'trade.validation.rebate-options-only':
    'Rabatte sind nur für Options-Trades zulässig.',
  'trade.validation.rebate-number': 'Der Rabatt muss eine Zahl sein.',
  'trade.validation.rebate-positive':
    'Der Rabatt muss ein positiver Wert sein.',
  'trade.validation.swap-invalid': 'Ungültiger Swap-Betrag.',
  'trade.validation.fees-number': 'Gebühren müssen eine Zahl sein.',
  'trade.validation.risk-number': 'Der Risikobetrag muss eine Zahl sein.',
  'trade.validation.risk-valid-number':
    'Der Risikobetrag muss eine gültige Zahl sein.',
  'trade.validation.risk-positive':
    'Der Risikobetrag muss größer als Null sein.',
  'trade.validation.stop-loss-number': 'Stop-Loss muss eine Zahl sein.',
  'trade.validation.stop-loss-valid-number':
    'Stop-Loss muss eine gültige Zahl sein.',
  'trade.validation.take-profit-price-required':
    'Gewinnzielpreis ist erforderlich.',
  'trade.validation.take-profit-price-number':
    'Take profit price must be a number.',
  'trade.validation.take-profit-price-valid-number':
    'Take profit price must be a valid number.',
  'trade.validation.take-profit-close-percent-number':
    'Take profit close percent must be a number.',
  'trade.validation.take-profit-close-percent-valid-number':
    'Take profit close percent must be a valid number.',
  'trade.validation.take-profit-close-percent-range':
    'Take profit close percent must be between 1 and 100.',
  'trade.validation.take-profit-total-close-percent-range':
    'Gewinnziel-Schließungsprozente dürfen 100 nicht überschreiten.',
  'validation.custom-field.key-empty': 'Der Feldschlüssel darf nicht leer sein',
  'validation.custom-field.key-conflict':
    'Dieser Feldname steht im Konflikt mit integrierten Trade-Feldern',
  'validation.custom-field.key-format':
    'Der Feldschlüssel muss mit einem Buchstaben beginnen und darf nur Buchstaben, Zahlen und Unterstriche enthalten',
  'validation.custom-field.required': '{label} ist erforderlich',
  'validation.custom-field.text': '{label} muss Text sein',
  'validation.custom-field.min-length':
    '{label} muss mindestens {minLength} Zeichen umfassen',
  'validation.custom-field.max-length':
    '{label} darf nicht mehr als {maxLength} Zeichen umfassen',
  'validation.custom-field.pattern-invalid': 'Das {label}-Format ist ungültig',
  'validation.custom-field.pattern-invalid-pattern':
    '{label} hat ein ungültiges Validierungsmuster',
  'validation.custom-field.number': '{label} muss eine Zahl sein',
  'validation.custom-field.min': '{label} muss mindestens {min} sein',
  'validation.custom-field.max': '{label} darf nicht größer als {max} sein',
  'validation.custom-field.selection': '{label} muss eine gültige Auswahl sein',
  'validation.custom-field.option': '{label} muss eine gültige Option sein',
  'validation.custom-field.array': '{label} muss ein Array von Auswahlen sein',
  'validation.custom-field.invalid-option':
    '{label} enthält ungültige Option: {item}',
  'validation.custom-field.date': '{label} muss ein gültiges Datum sein',
  'validation.custom-field.time': '{label} muss eine gültige Zeit sein',
  'validation.custom-field.time-format':
    '{label} muss ein gültiges Zeitformat sein (HH:MM, HH:MM:SS oder 12-Stunden-Format mit AM/PM).',
  'validation.custom-field.time-values': '{label} enthält ungültige Zeitwerte',
  'notice.verification-sent':
    'Bestätigungscode gesendet! Überprüfen Sie Ihre E-Mails.',
  'notice.login-success': 'Erfolgreich eingeloggt!',
  'notice.new-verification-sent':
    'Neuer Bestätigungscode gesendet! Überprüfen Sie Ihre E-Mails.',
  'notice.logout-success': 'Erfolgreich abgemeldet',
  'notice.ftp-created': 'FTP-Anmeldeinformationen erfolgreich erstellt',
  'notice.ftp-reset':
    'FTP Passwort erfolgreich zurückgesetzt! Speichern Sie das neue Passwort.',
  'notice.template-saved': 'Layout gespeichert',
  'notice.template-created': 'Layout erstellt',
  'notice.template-duplicated': 'Layout dupliziert',
  'notice.template-applied': 'Angewandte Layout: {name}',
  'notice.template-deleted': 'Layout gelöscht',
  'notice.default-template-updated': 'Standardlayout aktualisiert',
  'notice.tradelog-saved': 'Trade-Log-Einstellungen erfolgreich gespeichert',
  'notice.settings-exported': 'Einstellungen nach {filename} exportiert',
  'notice.settings-imported':
    'Einstellungen erfolgreich aus v{version} importiert. Starten Sie Obsidian neu, um alle Änderungen zu übernehmen.',
  'notice.template-switched': 'Geändert zu: {name}',
  'notice.hotkey-set': 'Hotkey-Set: {hotkey}',
  'notice.auto-sync-toggled': 'Automatische Synchronisierung {status}',
  'notice.auto-sync-enabled': 'ermöglicht',
  'notice.auto-sync-disabled': 'deaktiviert',
  'notice.reset-items': 'Elemente auf Standardwerte zurücksetzen',
  'notice.reset-timeframes': 'Zeitrahmen auf Standardwerte zurücksetzen',
  'notice.custom-fields-imported':
    'Benutzerdefinierte {count}-Felder wurden erfolgreich importiert',
  'notice.csv-parsed': 'CSV/XLSX/XLS erfolgreich analysiert: {count}-Zeilen',
  'notice.csv-validation-failed':
    'CSV/XLSX/XLS-Validierung fehlgeschlagen: {errors}',
  'notice.csv-parse-failed':
    'Fehler beim Parsen der CSV/XLSX/XLS-Datei: {error}',
  'notice.csv-complete-fields': 'Bitte füllen Sie alle Pflichtfelder aus',
  'notice.csv-invalid-selection': 'Ungültige Broker-/Vorlagenauswahl',
  'notice.csv-import-success': '{count} Trades erfolgreich importiert!',
  'notice.csv-import-partial':
    '{count} Trades importiert, übersprungene {duplicates}-Duplikate',
  'notice.csv-import-failed': 'Import fehlgeschlagen: {error}',
  'notice.csv-import-report-copy-failed':
    'Importbericht konnte nicht kopiert werden',
  'notice.csv-template-saved':
    'Vorlage gespeichert. Sie können nun „{name}“ für zukünftige Importe auswählen.',
  'notice.csv-template-updated': 'Vorlage „{name}“ erfolgreich aktualisiert',
  'notice.csv-template-update-failed':
    'Vorlage konnte nicht aktualisiert werden: {error}',
  'notice.csv-template-save-failed':
    'Vorlage konnte nicht gespeichert werden: {error}',
  'notice.csv-template-deleted': 'Vorlage „{name}“ gelöscht',
  'notice.csv-template-delete-failed':
    'Vorlage konnte nicht gelöscht werden: {error}',
  'notice.csv-template-imported': 'Vorlage „{name}“ erfolgreich importiert',
  'notice.csv-symbol-mappings-created.one': '{count}-Symbolzuordnung erstellt',
  'notice.csv-symbol-mappings-created.few':
    'Erstellte {count}-Symbolzuordnungen',
  'notice.csv-symbol-mappings-created.many':
    'Erstellte {count}-Symbolzuordnungen',
  'notice.csv-symbol-mappings-created.other':
    'Erstellte {count}-Symbolzuordnungen',
  'notice.csv-symbol-mapping-skipped': 'Symbolzuordnung übersprungen',
  'notice.csv-missing-fields':
    'Bitte ordnen Sie vor dem Import alle erforderlichen Felder zu',
  'notice.setups-added': 'Setups zu {count} Trades hinzugefügt',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': 'Fehler zu {count} Trades hinzugefügt',
  'notice.trades-deleted.one': '{count} Trade gelöscht',
  'notice.trades-deleted.few': '{count} Trades gelöscht',
  'notice.trades-deleted.many': '{count} Trades gelöscht',
  'notice.trades-deleted.other': '{count} Trades gelöscht',
  'notice.mark-reviewed.one': '{count} Trade als geprüft markiert',
  'notice.mark-reviewed.few': '{count} Trades als geprüft markiert',
  'notice.mark-reviewed.many': '{count} Trades als geprüft markiert',
  'notice.mark-reviewed.other': '{count} Trades als geprüft markiert',
  'notice.error.template-name-required':
    'Bitte geben Sie einen Vorlagennamen ein',
  'notice.error.template-name-exists': 'Der Vorlagenname ist bereits vorhanden',
  'notice.error.open-journalit':
    'Journalit konnte nicht geöffnet werden. Bitte versuchen Sie, Obsidian neu zu laden.',
  'notice.error.open-drc': 'Fehler beim Öffnen der DRC: {error}',
  'notice.error.open-dashboard':
    'Das Dashboard konnte nicht geöffnet werden: {error}',
  'notice.error.open-trade-log': 'Fehler beim Öffnen des Trade-Logs: {error}',
  'notice.error.open-csv-import':
    'Fehler beim Öffnen des Trade Imports: {error}',
  'notice.error.open-account-dashboard':
    'Das Konto-Dashboard konnte nicht geöffnet werden: {error}',
  'notice.error.open-trade-form-edit':
    'Das Trade-Formular konnte im Bearbeitungsmodus nicht geöffnet werden: {error}',
  'notice.error.open-weekly-review':
    'Der Wochenrückblick konnte nicht geöffnet werden: {error}',
  'notice.error.open-monthly-review':
    'Monatsrückblick konnte nicht geöffnet werden: {error}',
  'notice.error.open-quarterly-review':
    'Vierteljährlicher Bericht konnte nicht geöffnet werden: {error}',
  'notice.error.open-yearly-review':
    'Jahresrückblick konnte nicht geöffnet werden: {error}',
  'notice.error.open-onboarding':
    'Der Onboarding-Flow konnte nicht geöffnet werden. Weitere Informationen finden Sie in der Konsole.',
  'notice.error.sync-trades': 'Fehler beim Synchronisieren von Trades: {error}',
  'notice.error.open-release-notes':
    'Versionshinweise konnten nicht geöffnet werden: {error}',
  'notice.error.open-update-notification':
    'Update-Benachrichtigung konnte nicht geöffnet werden: {error}',
  'notice.error.open-layout-builder':
    'Layout-Builder konnte nicht geöffnet werden: {error}',
  'notice.error.switch-template': 'Fehler beim Wechseln der Layout: {error}',
  'notice.error.switch-template-generic': 'Fehler beim Wechseln der Layout',
  'notice.error.plugin-not-available': 'Plugin nicht verfügbar',
  'notice.error.open-template-picker':
    'Die Vorlagenauswahl konnte nicht geöffnet werden',
  'notice.error.no-active-file':
    'Keine aktive Datei. Öffnen Sie zunächst eine Notiz.',
  'notice.error.no-template-support':
    'Dieser Notiztyp unterstützt keine Vorlagen.',
  'notice.error.no-templates':
    'Für diesen Notiztyp sind keine Vorlagen verfügbar.',
  'notice.error.asset-type-required':
    'Beim Hinzufügen eines Instruments ist der Asset-Typ erforderlich',
  'notice.error.column-required':
    'Mindestens eine Spalte muss sichtbar bleiben',
  'notice.error.save-settings':
    'Fehler beim Speichern der Einstellungen: {error}',
  'notice.error.sign-in-vault':
    'Bitte melden Sie sich an, um Ihren Vault zu registrieren.',
  'notice.error.sign-in-sync':
    'Bitte melden Sie sich an, um die automatische Synchronisierung zu nutzen.',
  'notice.error.restore-auth':
    'Die Authentifizierung konnte nicht wiederhergestellt werden. Bitte melden Sie sich über Einstellungen → Auth. erneut an.',
  'notice.error.export-settings':
    'Die Einstellungen konnten nicht exportiert werden. Weitere Informationen finden Sie in der Konsole.',
  'notice.error.import-settings':
    'Einstellungen konnten nicht importiert werden: {error}',
  'notice.error.reset-settings':
    'Einstellungen konnten nicht zurückgesetzt werden. Weitere Informationen finden Sie in der Konsole.',
  'notice.error.invalid-drc-date': 'Ungültiges DRC-Datum',
  'notice.error.invalid-drc-missed':
    'Ungültiges DRC-Datum. Es kann kein verpasster Trade erstellt werden.',
  'notice.error.invalid-weekly-review-date':
    'Ungültiges wöchentliches Review-Datum. Prognosebild kann nicht gespeichert werden.',
  'notice.error.cannot-change-folder-during-sync':
    'Der Ordnerpfad kann während der Synchronisierung nicht geändert werden. Bitte warten Sie, bis die Synchronisierung abgeschlossen ist.',
  'notice.error.file-not-found': 'Datei nicht gefunden: {path}',
  'notice.error.trade-not-found': 'Trade-Datei nicht gefunden: {path}',
  'notice.error.mark-reviewed':
    'Fehler beim Markieren von Trades als geprüft: {error}',
  'notice.error.add-setups': 'Fehler beim Hinzufügen von Setups: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'Fehler beim Hinzufügen von Fehlern: {error}',
  'notice.error.delete-trades': 'Fehler beim Löschen von Trades: {error}',
  'notice.error.csv-validation':
    'CSV/XLSX/XLS-Validierung fehlgeschlagen: {errors}',
  'notice.error.import-failed': 'Import fehlgeschlagen: {error}',
  'notice.error.file-too-large':
    'Die Datei ist zu groß. Die maximale Größe beträgt 10 MB',
  'notice.error.select-csv':
    'Bitte wählen Sie eine CSV-/XLSX-/XLS-/HTML-Datei aus',
  'notice.error.cannot-delete-builtin':
    'Integrierte Vorlagen können nicht gelöscht werden',
  'notice.error.duplicate-to-customize':
    'Duplizieren Sie diese Vorlage, um sie anzupassen',
  'notice.error.sign-out':
    'Abmelden fehlgeschlagen. Bitte versuchen Sie es erneut.',
  'notice.error.open-upgrade-modal':
    'Eine Premium-Funktion wurde angefordert, aber der Upgrade-Dialog konnte nicht geladen werden.',
  'notice.info.no-sync': 'Keine Synchronisierung läuft',
  'notice.plugin-updated': 'Journalit aktualisiert auf v{version}!',
  'notice.info.settings-recovered':
    'Die Einstellungen wurden aus der Sicherung wiederhergestellt. Einige kürzlich vorgenommene Änderungen gehen möglicherweise verloren.',
  'notice.info.cannot-remove-locked':
    'Gesperrte Widgets können nicht entfernt werden',
  'notice.sync-mapping.updating':
    'Trade-Synchronisierungszuordnungen für neuen Ordnerpfad werden aktualisiert ...',
  'notice.sync-mapping.updated':
    'Trade-Synchronisierungszuordnungen wurden erfolgreich aktualisiert',
  'notice.error.sync-mapping-update-failed':
    'Die Trade-Synchronisierungszuordnungen konnten nicht aktualisiert werden. Bitte starten Sie das Plugin neu.',
  'tradelog.title': 'Trade-Log',
  'tradelog.root.all-trades': 'Alle Trades',
  'tradelog.view.selector.label': 'Ansicht',

  'form.layout.guide-trigger-label': 'Formular anpassen',
  'trade-form.guide.customization-modal.title':
    'Passe das Formular an deinen Workflow an',
  'trade-form.guide.customization-modal.description':
    'Hier kannst du optionale Blöcke anzeigen, ausblenden und neu anordnen. Halte das Formular auf die Felder fokussiert, die du wirklich nutzt.',
  'trade-form.guide.finish.title': 'Das ist die Anpassungsfunktion',
  'trade-form.guide.finish.description':
    'Du kannst diese Schaltfläche jederzeit wieder öffnen, wenn das Trade-Formular zu einem anderen Journaling-Workflow passen soll.',
  'tradelog.guide.empty.intro.title': 'Willkommen beim Trade-Log',
  'tradelog.guide.empty.intro.description':
    'Diese Seite wird zu Ihrem Hauptort zum Durchsuchen, Sortieren und Überprüfen von Trades. Sobald Sie Trades hinzufügen, erhalten Sie auch die vollständige Trade-Log-Tour.',
  'tradelog.guide.empty.state.title':
    'Beginnen Sie mit dem Hinzufügen Ihres ersten Trades',
  'tradelog.guide.empty.state.description':
    'Sie haben hier noch keine Trades. Klicken Sie auf die Schaltfläche „Trade erstellen“, um Ihren ersten Trade zu tätigen, und kehren Sie dann zurück, um die vollständigen Tabellen- und Batch-Tools kennenzulernen.',
  'tradelog.guide.intro.title': 'Dies ist Ihr Trade-Log',
  'tradelog.guide.intro.description':
    'Verwenden Sie diese Seite, um Trades einzeln zu überprüfen, zu sortieren, zu filtern und Änderungen an vielen Trades gleichzeitig vorzunehmen.',
  'tradelog.guide.view-selector.title':
    'Wählen Sie aus, wie Sie Ihren Verlauf überprüfen möchten',
  'tradelog.guide.view-selector.description':
    'Verwenden Sie dieses Menü, um zwischen der vollständigen Trade-Tabelle und gruppierten Zeitansichten wie Monaten, Wochen oder Tagen zu wechseln. Trades ist die Standardeinstellung, gruppierte Ansichten sind jedoch nützlich, wenn Sie einen Review nach Zeitraum durchführen möchten.',
  'tradelog.guide.filters.title':
    'Verwenden Sie Filter, um das Trade-Log einzugrenzen',
  'tradelog.guide.filters.description':
    'Öffnen Sie Filter, wenn Sie nur bestimmte Konten, Einstellungen, Tags, Trade-Typen, Status oder Daten überprüfen möchten.',
  'tradelog.guide.filter-modal.title': 'Dies sind Ihre detaillierten Filter',
  'tradelog.guide.filter-modal.description':
    'Verwenden Sie dieses Modal, wenn Sie mehr Kontrolle darüber haben möchten, welche Trades genau angezeigt werden. Schließen Sie es, wenn Sie mit der Prüfung oder Änderung der Filter fertig sind.',
  'tradelog.guide.sorting.title':
    'Klicken Sie auf die Spaltenüberschriften, um die Tabelle zu sortieren',
  'tradelog.guide.sorting.description':
    'Klicken Sie in der Trades-Ansicht auf eine sortierbare Spaltenüberschrift, um die Tabelle neu anzuordnen. Klicken Sie beispielsweise auf Netto P&L, um nach Ihrem größten Gewinn und Ihrem größten Verlust zu sortieren.',
  'tradelog.guide.multi-select.title': 'Aktivieren Sie die Mehrfachauswahl',
  'tradelog.guide.multi-select.description':
    'Klicken Sie auf diese Schaltfläche, um mehrere Trades gleichzeitig auszuwählen. Wenn die Mehrfachauswahl aktiviert ist, wählen Zeilenklicks Trades aus, anstatt sie zu öffnen.',
  'tradelog.guide.batch-actions.title': 'Dies sind Ihre Batch-Aktionen',
  'tradelog.guide.batch-actions.description':
    'Verwenden Sie diese Leiste, um alle sichtbaren Trades auszuwählen, Ihre Auswahl zu löschen, Trades als geprüft zu markieren, Setups hinzuzufügen, Fehler hinzuzufügen oder mehrere Trades gleichzeitig zu löschen. Sie können auch bei gedrückter Umschalttaste klicken, um eine Reihe von Trades auszuwählen.',
  'tradelog.guide.column-settings.title': 'Spalteneinstellungen öffnen',
  'tradelog.guide.column-settings.description':
    'Klicken Sie auf diese Schaltfläche, um auszuwählen, welche Spalten angezeigt werden und wie dicht oder detailliert die Tabelle wirken soll.',
  'tradelog.guide.active-columns.title':
    'Ordnen Sie die bereits verwendeten Spalten neu an oder entfernen Sie sie',
  'tradelog.guide.active-columns.description':
    'Ziehen Sie in „Aktive Spalten“ eine Spalte, um sie zu verschieben, oder entfernen Sie eine Spalte, die Sie nicht benötigen. Dadurch ändert sich die Reihenfolge der Tabelle von links nach rechts.',
  'tradelog.guide.available-columns.title':
    'Fügen Sie ausgeblendete Spalten wieder hinzu, wenn Sie weitere Details benötigen',
  'tradelog.guide.available-columns.description':
    'Öffnen Sie „Verfügbare Spalten“, um Felder wieder zur Tabelle hinzuzufügen. Dort bringen Sie alles zurück, was Sie zuvor entfernt haben.',
  'tradelog.guide.open-trades.title':
    'Klicken Sie auf einen Trade, wenn Sie dessen Notiz öffnen möchten',
  'tradelog.guide.open-trades.description':
    'Im normalen Modus wird durch Klicken auf einen Trade dieser geöffnet. Im Mehrfachauswahlmodus wird es stattdessen durch Klicken ausgewählt. Wechseln Sie zwischen diesen beiden Verhaltensweisen, je nachdem, was Sie tun möchten.',
  'dashboard.guide.empty.intro.title': 'Willkommen in Ihrem Dashboard',
  'dashboard.guide.empty.intro.description':
    'Auf dieser Seite erhalten Sie einen schnellen Überblick über Ihre Trading-Performance. Sobald Sie Trades abgeschlossen haben, wird es zu Ihrer täglichen Kommandozentrale.',
  'dashboard.guide.empty.state.title':
    'Beginnen Sie mit dem Hinzufügen Ihres ersten Trades',
  'dashboard.guide.empty.state.description':
    'Sie haben noch keine Trades. Fügen Sie einen Trade manuell hinzu oder importieren Sie Daten und kehren Sie dann zurück, um die vollständige Dashboard-Tour freizuschalten.',
  'dashboard.guide.main.intro.title': 'Dies ist Ihr Trading-Dashboard',
  'dashboard.guide.main.intro.description':
    'Verwenden Sie diese Seite, um Ihre Leistung zu verfolgen, Ihre Statistiken zu überprüfen und Ihre nützlichsten Diagramme an einem Ort aufzubewahren.',
  'dashboard.guide.main.filters.title':
    'Filter verändern das gesamte Dashboard',
  'dashboard.guide.main.filters.description':
    'Verwenden Sie Filter, wenn Sie möchten, dass alle Statistiken und Diagramme auf dieser Seite für einen anderen Datumsbereich, ein anderes Konto, ein anderes Setup, ein anderes Tag oder einen anderen Trade-Typ aktualisiert werden.',
  'dashboard.guide.main.edit-layout.title':
    'Aktivieren Sie den Bearbeitungsmodus, um diese Seite anzupassen',
  'dashboard.guide.main.edit-layout.description':
    'Klicken Sie auf „Layout bearbeiten“, um das Verschieben, Ändern der Größe, Entfernen und Hinzufügen von Dashboard-Widgets freizuschalten.',
  'dashboard.guide.main.open-widget-selector.title':
    'Öffnen Sie „Widget hinzufügen“.',
  'dashboard.guide.main.open-widget-selector.description':
    'Klicken Sie auf „Widget hinzufügen“, um weitere Diagramme hinzuzufügen und zuvor entfernte Widgets wiederherzustellen.',
  'dashboard.guide.main.widget-picker.title':
    'Wählen Sie aus, was Sie zeigen möchten',
  'dashboard.guide.main.widget-picker.description':
    'Dieser Picker zeigt die Metriken und Widgets an, die sich derzeit nicht in Ihrem Dashboard befinden. Klicken Sie auf eines, um es hinzuzufügen.',
  'dashboard.guide.main.metrics.title':
    'Diese Top-Karten sind Ihre schnelle Zusammenfassung',
  'dashboard.guide.main.metrics.description':
    'In der oberen Zeile erhalten Sie schnelle Antworten wie Gewinn, Win Rate und Gesamtzahl der Trades. Im Bearbeitungsmodus können Sie ändern, welche Karten angezeigt werden, und sie neu anordnen.',
  'dashboard.guide.main.bottom.title':
    'Hier erfolgt das Verschieben und Ändern der Größe',
  'dashboard.guide.main.bottom.description':
    'Während „Layout bearbeiten“ aktiviert ist, können Sie ein Widget ziehen, um es zu verschieben. Um die Größe eines Widgets zu ändern, ziehen Sie dessen untere rechte Ecke. Dies ist der Schritt, den viele Benutzer übersehen.',
  'dashboard.guide.main.save-layout.title':
    'Speichern Sie Ihr Layout, wenn Sie fertig sind',
  'dashboard.guide.main.save-layout.description':
    'Wenn Sie mit der Anpassung fertig sind, klicken Sie auf „Layout speichern“, um Ihre Änderungen beizubehalten. Sie können jederzeit zurückkommen und diese Seite erneut bearbeiten.',
  'home.guide.intro.title': 'Willkommen zu Hause',
  'home.guide.intro.description':
    'Dies ist Ihre Hauptseite. Es zeigt Ihre Trading-Statistiken, Schnellaktionen und Verknüpfungen zum Rest von Journalit an.',
  'home.guide.filters.title':
    'Diese Schaltflächen ändern, was Ihre Widgets anzeigen',
  'home.guide.filters.description':
    'Verwenden Sie diese, um den Zeitraum, den Trade-Typ oder das Konto zu ändern, sodass Ihre Home-Widgets die Daten anzeigen, die Sie anzeigen möchten.',
  'home.guide.customize.title':
    'Aktivieren Sie den Bearbeitungsmodus, um die Startseite anzupassen',
  'home.guide.customize.description':
    'Klicken Sie auf diese Schaltfläche, um mit der Anpassung zu beginnen. Der Bearbeitungsmodus ermöglicht das Verschieben, Ändern der Größe, Entfernen und Hinzufügen von Widgets.',
  'home.guide.quick-links-position.title':
    'Verschieben Sie Quick Links über oder unter die Widgets',
  'home.guide.quick-links-position.description':
    'Mit dieser Schaltfläche können Sie auswählen, ob sich die Zeile „Quick Links“ über oder unter dem Haupt-Widget-Bereich befindet.',
  'home.guide.quick-links.title':
    'Diese Quick Links sind Ihre schnellen Verknüpfungen',
  'home.guide.quick-links.description':
    'Mit Quick Links können Sie mit einem Klick auf häufige Aktionen und Seiten zugreifen. Im Bearbeitungsmodus können Sie auch Links ausblenden, die hier nicht angezeigt werden sollen.',
  'home.guide.move-and-resize.title':
    'Verschieben Sie Ihre Widgets und ändern Sie ihre Größe',
  'home.guide.widget-picker.title': 'Fügen Sie hier Widgets hinzu',
  'home.guide.widget-picker.description':
    'Mit dieser Auswahl können Sie weitere Widgets hinzufügen und Schnelllinks wiederherstellen, die Sie zuvor ausgeblendet haben.',
  'home.guide.move-and-resize.description':
    'Dies ist der Hauptbereich, den Sie im Bearbeitungsmodus neu anordnen können. Ziehen Sie Widgets, um sie zu verschieben, oder ziehen Sie ein Widget aus der unteren rechten Ecke, um seine Größe zu ändern.',
  'home.guide.add-widget.title':
    'Fügen Sie Widgets hinzu oder holen Sie ausgeblendete Schnelllinks zurück',
  'home.guide.add-widget.description':
    'Klicken Sie auf Widget hinzufügen, um die Auswahl zu öffnen, in der Sie weitere Widgets hinzufügen und zuvor ausgeblendete Schnelllinks wiederherstellen können.',
  'home.guide.save-layout.title':
    'Speichern Sie Ihr Layout, wenn Sie fertig sind',
  'home.guide.save-layout.description':
    'Wenn Sie mit dem Layout zufrieden sind, klicken Sie auf diese Schaltfläche, um Ihre Änderungen zu speichern und den Bearbeitungsmodus zu verlassen.',
  'home.guide.widget-interactions.title': 'Das ist die Grundidee von Home',
  'home.guide.widget-interactions.description':
    'Home ist Ihr anpassbares Dashboard. Verwenden Sie den Bearbeitungsmodus, um das Layout zu ändern, und klicken Sie auf Widgets, um Tools, Einstellungen oder tiefer liegende Seiten zu öffnen.',
  'layoutBuilder.guide.intro.title': 'Dies ist Ihr Layout-Builder',
  'layoutBuilder.guide.intro.description':
    'Diese Seite steuert, wie Ihre Review-Vorlagen strukturiert sind. Der einfachste Einstieg besteht darin, eine integrierte Vorlage zu duplizieren und dann Ihre Kopie anzupassen.',
  'layoutBuilder.guide.sidebar-overview.title':
    'In dieser Seitenleiste wählen Sie aus, was Sie bearbeiten möchten',
  'layoutBuilder.guide.sidebar-overview.description':
    'Jeder Abschnitt in der Seitenleiste ist ein anderer Vorlagentyp. Trade-Vorlagen sind von Ihren Review-Vorlagen getrennt und der Abschnitt „Bibliothek“ dient zum Teilen von Vorlagen. Nachdem Sie Ihre eigene Kopie erstellt haben, können Sie sie markieren, um sie als Standard für neue Review-Notizen festzulegen.',
  'layoutBuilder.guide.pick-built-in.title':
    'Beginnen Sie mit einer integrierten DRC-Vorlage',
  'layoutBuilder.guide.pick-built-in.description':
    'Beginnen Sie für Ihr erstes Layout mit einer der integrierten DRC-Vorlagen. Sie bietet Ihnen einen sicheren Ausgangspunkt, bevor Sie Ihre eigene Kopie erstellen.',
  'layoutBuilder.guide.duplicate.title':
    'Duplizieren Sie die integrierte Vorlage',
  'layoutBuilder.guide.duplicate.description':
    'Integrierte Vorlagen sind Ausgangspunkte. Duplizieren Sie zunächst eine Vorlage, damit Sie sicher Ihre eigene Version erstellen können.',
  'layoutBuilder.guide.preview-template.title':
    'Diese Vorschau zeigt, wie die Vorlage aussehen wird',
  'layoutBuilder.guide.preview-template.description':
    'Scrollen Sie durch die Vorschau und bekommen Sie ein Gefühl für den Ablauf. Dies ist nützlich, um zu prüfen, ob die Vorlage klar lesbar ist, bevor Sie mit der Bearbeitung beginnen.',
  'layoutBuilder.guide.switch-to-editor.title': 'Wechseln Sie zum Editor',
  'layoutBuilder.guide.switch-to-editor.description':
    'Die Vorschau zeigt Ihnen, wie die Vorlage aussehen wird. Im Editor ändern Sie es tatsächlich.',
  'layoutBuilder.guide.editor-overview.title':
    'Hier bearbeiten Sie die Vorlage',
  'layoutBuilder.guide.editor-overview.description':
    'Benennen Sie die Vorlage hier um, überprüfen Sie die Widget-Liste, ziehen Sie den linken Ziehpunkt, um die Widgets neu anzuordnen, klicken Sie auf ein Widget, um es zu ändern, und entfernen Sie alles, was Sie nicht benötigen.',
  'layoutBuilder.guide.add-widget.title':
    'Fügen Sie Ihrer Kopie ein Widget hinzu',
  'layoutBuilder.guide.add-widget.description':
    'Verwenden Sie „Widget hinzufügen“, um neue Blöcke in Ihre Vorlage einzufügen. So gestalten Sie den Arbeitsablauf so, dass er zu Ihrem Review passt.',
  'layoutBuilder.guide.open-widget-picker.title':
    'Öffnen Sie die Widget-Auswahl',
  'layoutBuilder.guide.open-widget-picker.description':
    'Dieser Picker zeigt die Widgets an, die Sie für diesen Review-Typ hinzufügen können.',
  'layoutBuilder.guide.choose-widget.title': 'Wählen Sie ein Widget',
  'layoutBuilder.guide.choose-widget.description':
    'In dieser Liste werden alle Widgets angezeigt, die Sie für diesen Review-Typ hinzufügen können. Wählen Sie ein beliebiges Widget aus oder klicken Sie auf „Weiter“ und Journalit wählt das erste für Sie aus.',
  'layoutBuilder.guide.widget-library-docs.title':
    'Verwenden Sie die Widget-Bibliothek, wenn Sie nicht weiterkommen',
  'layoutBuilder.guide.widget-library-docs.description':
    'Dadurch wird die Dokumentenseite mit der Widget-Bibliothek, Beispielen und der Verfügbarkeitstabelle für jeden Review-Typ geöffnet.',
  'layoutBuilder.guide.save-template.title': 'Speichern Sie Ihre Layout',
  'layoutBuilder.guide.save-template.description':
    'Sobald Ihre Kopie richtig aussieht, speichern Sie sie. Sie können es später weiter verfeinern, wenn sich Ihr Review-Prozess verbessert.',
  'layoutBuilder.guide.set-default-template.title':
    'Legen Sie diese Kopie als Ihre Standardvorlage fest',
  'layoutBuilder.guide.set-default-template.description':
    'Klicken Sie auf den Stern Ihrer neuen Vorlage, wenn Sie möchten, dass neue Review-Notizen dieses Layout automatisch verwenden.',
  'tradelog.empty': 'Keine Trades gefunden',
  'tradelog.empty.submessage':
    'Beginnen Sie mit der Erstellung von Trade-Notizen, damit diese in Ihrem Trade-Log angezeigt werden.',
  'tradelog.processing': 'Trading-Daten werden verarbeitet...',
  'tradelog.node.file-not-found': 'Trade-Datei nicht gefunden: {path}',
  'tradelog.node.no-review-available': 'Für {type}: {id} liegt kein Review vor',
  'tradelog.node.expand': 'Expandieren',
  'tradelog.node.collapse': 'Zusammenbruch',
  'tradelog.node.navigate-to-review': 'Navigieren Sie zum {type}-Review',
  'tradelog.node.performance.year': '{indicator} performendes Jahr',
  'tradelog.node.performance.quarter':
    '{indicator} führt ein Viertel von {year} durch',
  'tradelog.node.performance.month':
    '{indicator} Leistungsmonat {quarter} {year}',
  'tradelog.node.performance.week':
    '{indicator} performende Woche von {month} {year}',
  'tradelog.node.performance.day':
    '{indicator} performender Tag von {week} {year}',
  'tradelog.node.performance.period': '{indicator} performender Zeitraum',
  'tradelog.filter.all': 'Alle Status',
  'tradelog.filter.all.desc': 'Alle Trade-Status',
  'tradelog.filter.all-review-statuses': 'Alle Reviews',
  'tradelog.filter.all-directions': 'Alle Richtungen',
  'tradelog.filter.winners': 'Gewinn-Trades',
  'tradelog.filter.winners.desc': 'Gewinn-Trades',
  'tradelog.filter.losers': 'Verlust-Trades',
  'tradelog.filter.losers.desc': 'Verlust-Trades',
  'tradelog.filter.breakeven': 'Break-even',
  'tradelog.filter.breakeven.desc': 'Breakeven-Trades',
  'tradelog.filter.open': 'Offen',
  'tradelog.filter.open.desc': 'Derzeit offene Positionen',
  'tradelog.filter.closed': 'Geschlossen',
  'tradelog.filter.closed.desc':
    'Alle geschlossenen Positionen (Gewinn/Verlust/Breakeven)',
  'tradelog.type.all': 'Alle Typen',
  'tradelog.type.all.desc': 'Alle Trade-Typen',
  'tradelog.type.regular': 'Regulär',
  'tradelog.type.regular.desc': 'Standard-Trades',
  'tradelog.type.missed': 'Verpasst',
  'tradelog.type.missed.desc': 'Verpasste Chancen',
  'tradelog.type.backtest': 'Backtest',
  'tradelog.type.backtest.desc': 'Simulierte Trades',
  'tradelog.status.win': 'GEWINN',
  'tradelog.status.loss': 'VERLUST',
  'tradelog.status.open': 'OFFEN',
  'tradelog.status.breakeven': 'DIE GEWINNZONE ERREICHEN',
  'tradelog.status.missed': 'VERPASST',
  'tradelog.status.backtest': 'BACKTEST',
  'tradelog.status.expired': 'ABGELAUFEN',
  'tradelog.no-columns': 'Keine Spalten konfiguriert',
  'tradelog.duration.ongoing': '(laufend)',
  'tradelog.tooltip.mistakes': 'Fehler:',
  'tradelog.tooltip.setups': 'Setups:',
  'tradelog.tooltip.tags': 'Schlagworte:',
  'tradelog.tooltip.thesis': 'These:',
  'tradelog.tooltip.mtComment': 'MT-Kommentar:',
  'tradelog.tooltip.accounts': 'Konten:',
  'tradelog.copy-trade.tooltip': 'Kopiert von {account} mit {multiplier}x',
  'tradelog.tooltip.partial-exits': 'Teilausstiege:',
  'tradelog.copy-trade.base-tooltip-title': 'Ergebnisse kopierter Konten',
  'tradelog.copy-trade.adjustment-action': 'Kopiertes GuV anpassen',
  'tradelog.copy-trade.adjustment-title': 'Kopiertes GuV anpassen',
  'tradelog.copy-trade.adjustment-description-primary':
    'Gib die manuelle GuV-Anpassung für diesen kopierten Trade ein.',
  'tradelog.copy-trade.adjustment-description-secondary':
    'Verwende eine negative Zahl für schlechtere Ausführungen/Kosten.',
  'tradelog.copy-trade.adjustment-preview': 'Vorschau Netto-GuV:',
  'tradelog.copy-trade.adjustment-prompt':
    'Gib die manuelle GuV-Anpassung für diesen kopierten Trade ein. Verwende eine negative Zahl für schlechtere Ausführungen/Kosten.',
  'tradelog.copy-trade.adjustment-invalid':
    'Gib eine gültige GuV-Anpassung ein.',
  'tradelog.copy-trade.adjustment-saved':
    'GuV-Anpassung für kopierten Trade gespeichert.',
  'tradelog.tooltip.still-open': 'noch offen',
  'tradelog.tooltip.performance-trade': '{indicator} performender Trade',
  'tradelog.tooltip.performance-trade-on':
    '{indicator} performender Trade am {date}',
  'tradelog.alt.trade-image': '{instrument}-Bild',
  'tradelog.alt.trade-image-n': '{instrument} Bild {n}',
  'tradelog.batch.delete-confirm.title': 'Bestätigen Sie den Löschvorgang',
  'tradelog.batch.delete-confirm.message.one':
    'Sind Sie sicher, dass Sie den ausgewählten {count}-Trade löschen möchten?',
  'tradelog.batch.delete-confirm.message.few':
    'Sind Sie sicher, dass Sie die ausgewählten {count} Trades löschen möchten?',
  'tradelog.batch.delete-confirm.message.many':
    'Sind Sie sicher, dass Sie die ausgewählten {count} Trades löschen möchten?',
  'tradelog.batch.delete-confirm.message.other':
    'Sind Sie sicher, dass Sie die ausgewählten {count} Trades löschen möchten?',
  'tradelog.batch.delete-confirm.warning':
    'Diese Aktion kann nicht rückgängig gemacht werden.',
  'tradelog.batch.setups.title': 'Fügen Sie Setups zu Trades hinzu',
  'tradelog.batch.setups.placeholder': 'Setups auswählen oder erstellen...',
  'tradelog.batch.tags.title': 'Tags zu Trades hinzufügen',
  'tradelog.batch.tags.placeholder': 'Tags auswählen oder erstellen...',
  'tradelog.batch.mistakes.title': 'Fehler zu Trades hinzufügen',
  'tradelog.batch.mistakes.placeholder': 'Fehler auswählen oder erstellen...',
  'tradelog.batch.none-selected': 'KEINE AUSGEWÄHLT',
  'tradelog.batch.selected-count': '{count} AUSGEWÄHLT',
  'tradelog.batch.select-all.title': 'Wählen Sie alle sichtbaren Trades aus',
  'tradelog.batch.select-all.label': 'Wählen Sie „Alle“ aus',
  'tradelog.batch.mark-reviewed.title':
    'Markieren Sie ausgewählte Trades als geprüft',
  'tradelog.batch.already-reviewed':
    'Alle von {total} ausgewählten Trades sind bereits geprüft',
  'tradelog.batch.already-reviewed-single':
    'Der ausgewählte Trade wurde bereits geprüft',
  'tradelog.batch.already-reviewed-plain': 'bereits geprüft',
  'tradelog.batch.no-updates-needed':
    'Keine Updates erforderlich – alle {total} hatten bereits diese {type}',
  'tradelog.batch.already-had-all': '{count} hatte bereits alle {type}',
  'tradelog.batch.errors-count.one': '{count}-Fehler ist aufgetreten',
  'tradelog.batch.errors-count.few': '{count}-Fehler sind aufgetreten',
  'tradelog.batch.errors-count.many': '{count}-Fehler sind aufgetreten',
  'tradelog.batch.errors-count.other': '{count}-Fehler sind aufgetreten',
  'tradelog.batch.enable-multi-select': 'Aktivieren Sie die Mehrfachauswahl',
  'tradelog.batch.disable-multi-select': 'Deaktivieren Sie die Mehrfachauswahl',
  'tradelog.batch.column-settings': 'Spalteneinstellungen',
  'tradelog.batch.marking-reviewed': 'Markierung...',
  'tradelog.batch.add-setups.aria': 'Setups hinzufügen',
  'tradelog.batch.add-setups.title':
    'Fügen Sie Setups zu ausgewählten Trades hinzu',
  'tradelog.batch.add-setups.label': 'Setups hinzufügen',
  'tradelog.batch.add-tags.aria': 'Tags hinzufügen',
  'tradelog.batch.add-tags.title': 'Tags zu ausgewählten Trades hinzufügen',
  'tradelog.batch.add-tags.label': 'Tags hinzufügen',
  'tradelog.batch.add-mistakes.aria': 'Fehler hinzufügen',
  'tradelog.batch.add-mistakes.title':
    'Fügen Sie Fehler zu ausgewählten Trades hinzu',
  'tradelog.batch.add-mistakes.label': 'Fehler hinzufügen',
  'tradelog.batch.adding': 'Hinzufügen...',
  'tradelog.batch.add-count': 'Hinzufügen ({count})',
  'tradelog.batch.delete.aria': 'Trades löschen',
  'tradelog.batch.delete.title': 'Ausgewählte Trades löschen',
  'tradelog.batch.deleting': 'Löschen...',
  'tradelog.batch.clear.aria': 'Klare Auswahl',
  'tradelog.batch.clear.title': 'Klare Auswahl',
  'tradelog.batch.clear.label': 'Klar',
  'tradelog.settings.active-columns': 'Aktive Spalten',
  'tradelog.settings.available-columns': 'Verfügbare Spalten',
  'tradelog.settings.active-desc':
    'Ziehen Sie, um die Spalten neu anzuordnen. Klicken Sie zum Entfernen auf X.',
  'tradelog.settings.available-desc':
    'Klicken Sie auf eine Spalte, um sie Ihrer Tabelle hinzuzufügen.',
  'tradelog.settings.no-active':
    'Keine aktiven Spalten. Fügen Sie Spalten über die Registerkarte „Verfügbar“ hinzu.',
  'tradelog.settings.all-active': 'Alle Spalten sind aktiv.',
  'tradelog.settings.expanded-view': 'Erweiterte Ansicht',
  'tradelog.settings.expanded-view-desc':
    'Zeigen Sie Tags, Setups und Fehler als Pillenabzeichen an',
  'tradelog.settings.expanded-view-aria':
    'Erweiterten Ansichtsmodus umschalten',
  'tradelog.settings.saving': 'Sparen...',
  'tradelog.settings.reset': 'Auf Standardeinstellungen zurücksetzen',
  'tradelog.category.basic': 'Grundlegende Informationen',
  'tradelog.category.timing': 'Timing',
  'tradelog.category.prices': 'Preise',
  'tradelog.category.risk': 'Risikomanagement',
  'tradelog.category.position': 'Position und Gewinn/Verlust',
  'tradelog.category.review': 'Review',
  'tradelog.column.image': 'Bild',
  'tradelog.column.account': 'Konto',
  'tradelog.column.ticker': 'Tickersymbol',
  'tradelog.column.exchange': 'Börse',
  'tradelog.column.status': 'Status',
  'tradelog.column.direction': 'Richtung',
  'tradelog.column.date': 'Offenes Datum',
  'tradelog.column.entryTime': 'Einstiegszeit',
  'tradelog.column.exitDate': 'Schlusstermin',
  'tradelog.column.exitTime': 'Ausstiegszeit',
  'tradelog.column.duration': 'Dauer',
  'tradelog.column.expirationDate': 'Ablauf',
  'tradelog.column.daysToExpiry': 'DTE',
  'tradelog.column.entryPrice': 'Einstieg',
  'tradelog.column.exitPrice': 'Ausstieg',
  'tradelog.column.priceMove': 'Preisbewegung',
  'tradelog.column.stopLoss': 'Stop-Loss',
  'tradelog.column.slDistanceDollar': 'SL Dist $',
  'tradelog.column.slDistancePercent': 'SL Dist %',
  'tradelog.column.riskAmount': 'Risiko $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.maePrice': 'MAE-Preis',
  'tradelog.column.mfePrice': 'MFE-Preis',
  'tradelog.column.mae': 'MAE $',
  'tradelog.column.mfe': 'MFE $',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': 'Größe #',
  'tradelog.column.positionValue': 'Größe $',
  'tradelog.column.fees': 'Gebühren',
  'tradelog.column.dividends': 'Dividenden',
  'tradelog.column.pnl': 'Netto P&L',
  'tradelog.column.returnPercent': 'Zurückkehren %',
  'tradelog.column.setups': 'Setups',
  'tradelog.column.mistakes': 'Fehler',
  'tradelog.column.tags': 'Schlagworte',
  'tradelog.column.reviewed': 'Bewertet',
  'tradelog.column.thesis': 'These',
  'tradelog.column.mtComment': 'MT-Kommentar',
  'dashboard.title': 'Übersicht',
  'dashboard.empty.message': 'Keine Trading-Daten verfügbar',
  'dashboard.empty.submessage':
    'Fügen Sie einige Trades hinzu, um Ihr Dashboard zum Leben zu erwecken',
  'dashboard.empty.filter-hint':
    'Versuchen Sie, Ihre Filtereinstellungen anzupassen',
  'dashboard.error.load-failed': 'Daten konnten nicht geladen werden',
  'dashboard.no-data': 'Keine Trading-Daten verfügbar',
  'dashboard.button.add-widget': 'Widget hinzufügen',
  'dashboard.button.save-layout': 'Layout speichern',
  'dashboard.button.edit-layout': 'Layout bearbeiten',
  'dashboard.metrics.netPnL': 'Netto P&L',
  'dashboard.metrics.winRate': 'Trefferquote',
  'dashboard.metrics.profitFactor': 'Gewinnfaktor',
  'dashboard.metrics.sharpeRatio': 'Sharpe-Kennzahl',
  'dashboard.metrics.expectancy': 'Erwartungswert',
  'dashboard.metrics.numTrades': 'Trades insgesamt',
  'dashboard.metrics.closedTrades': 'Geschlossene Trades',
  'dashboard.metrics.numWinTrades': 'Gewinn-Trades',
  'dashboard.metrics.numLossTrades': 'Verlust-Trades',
  'dashboard.metrics.avgWin': 'Durchschnittlicher Gewinn',
  'dashboard.metrics.avgLoss': 'Durchschnittlicher Verlust',
  'dashboard.metrics.totalCommission': 'Gesamtprovision',
  'dashboard.metrics.totalFees': 'Gesamtgebühren',
  'dashboard.metrics.maxDrawdown': 'Max. Rückgang',
  'dashboard.metrics.bestDay': 'Bester Tag',
  'dashboard.metrics.largestWin': 'Größter Gewinn',
  'dashboard.metrics.largestLoss': 'Größter Verlust',
  'dashboard.metrics.longestWinStreak': 'Beste Serie',
  'dashboard.metrics.longestLossStreak': 'Schlimmste Serie',
  'dashboard.metrics.avgHoldTime': 'Durchschnittliche Haltezeit',
  'dashboard.metrics.avgWinHoldTime': 'Durchschnittliche Gewinnhaltezeit',
  'dashboard.metrics.avgLossHoldTime': 'Durchschnittliche Verlusthaltezeit',
  'dashboard.metrics.avgWinnerHeat': 'Durchschn. Gewinner-Heat',
  'dashboard.metrics.winnerMaeP90': 'Gewinner MAE P90',
  'dashboard.metrics.winnerMaeMedian': 'Gewinner MAE Median',
  'dashboard.metrics.avgLossHeat': 'Durchschn. Verlust-Heat',
  'dashboard.metrics.winnerAvgMfe': 'Gewinner durchschn. MFE',
  'dashboard.metrics.loserAvgMfe': 'Verlierer durchschn. MFE',
  'dashboard.metrics.winnerMfeP90': 'Gewinner MFE P90',
  'dashboard.metrics.loserMfeP90': 'Verlierer MFE P90',
  'dashboard.metrics.avgRR': 'Durchschn. RR (Payoff)',
  'dashboard.metrics.avgRRRiskBased': 'Durchschn. RR (R-basiert)',
  'dashboard.avgRR.tooltip.formula':
    'Formel: durchschnittlicher Gewinn / durchschnittlicher Verlust',
  'dashboard.avgRR.tooltip.no-conversion':
    'Diese Payoff-Ratio basiert auf gemischten Währungen ohne Währungsumrechnung und kann irreführend sein.',
  'dashboard.sharpeRatio.tooltip.title': 'Sharpe-Kennzahl',
  'dashboard.sharpeRatio.tooltip.formula':
    'Formel: durchschnittliche Netto-P&L geschlossener Trades / Stichproben-Standardabweichung der Netto-P&L geschlossener Trades. Der risikofreie Zinssatz ist 0 und der Wert ist nicht annualisiert.',
  'dashboard.sharpeRatio.tooltip.coverage':
    'Berechnet aus {valid} von {total} geschlossenen Trades',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'Teilweise Abdeckung: {valid} von {total} geschlossenen Trades haben eine finite Netto-P&L.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'Erfordert mindestens zwei geschlossene Trades mit P&L-Variabilität ungleich null.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'Diese Sharpe-Kennzahl basiert auf gemischten Währungen ohne Währungsumrechnung und kann irreführend sein.',
  'dashboard.avgRRRiskBased.tooltip.title': 'Durchschn. RR (R-basiert)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'Formel: durchschnittlicher Gewinn R / durchschnittlicher Verlust R',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    'Berechnet aus {valid} der geschlossenen Trades {total} mit Risikodaten',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'Risikogültige Gewinne: {wins}, Verluste: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'Teilweise Risikoabdeckung: {valid} der geschlossenen Trades {total} verfügen über gültige Risikodaten.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'Unzureichende Daten für R-basierte RR. Fügen Sie Stop-Loss-/Risikodaten hinzu und stellen Sie sicher, dass es gültige Gewinn- und Verlust-Trades gibt.',
  'dashboard.conversion.title': 'Konvertiert in {currency}',
  'dashboard.conversion.converted-total': 'Umgerechnete Summe',
  'dashboard.conversion.base': 'Basis: {currency}',
  'dashboard.conversion.rates': 'Zinssätze: EZB ({date})',
  'dashboard.conversion.using-ecb': 'Verwendung von EZB-Kursen ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Verwendet brokerbereitgestellte Basiswährungs-P&L für {count} {tradeLabel}',
  'dashboard.conversion.trade-singular': 'Handel',
  'dashboard.conversion.trade-plural': 'Handel',
  'dashboard.conversion.excluded-warning':
    '• {converted} von {total}-Trades ({excluded} ausgeschlossen: {currencies})',
  'dashboard.top-section.add-metric': 'Metrik hinzufügen',
  'dashboard.top-section.remove-metric': 'Metrik entfernen',
  'dashboard.top-section.failed-load':
    'Die Messwerte konnten nicht geladen werden',
  'dashboard.filter.date.today': 'Heute',
  'dashboard.filter.date.yesterday': 'Gestern',
  'dashboard.filter.date.this-week': 'Diese Woche',
  'dashboard.filter.date.this-month': 'Diesen Monat',
  'dashboard.filter.date.this-quarter': 'Dieses Quartal',
  'dashboard.filter.date.this-year': 'Dieses Jahr',
  'dashboard.filter.date.all-time': 'Alle Zeit',
  'dashboard.filter.date.custom': 'Benutzerdefiniert',
  'dashboard.filter.date.from': 'Aus',
  'dashboard.filter.date.to': 'Zu',
  'dashboard.filter.accounts.all': 'Alle Konten',
  'dashboard.filter.accounts.n-selected': '{count}-Konten',
  'dashboard.filter.accounts.select-all': 'Wählen Sie „Alle“ aus',
  'dashboard.filter.accounts.select-all-option': '-- Alles auswählen --',
  'dashboard.filter.accounts.none-found': 'Keine Konten gefunden',
  'dashboard.filter.tags.all': 'Alle Tags',
  'dashboard.filter.tags.none': 'Keine Tags',
  'dashboard.filter.tags.n-selected': '{count}-Tags',
  'dashboard.filter.tags.select-all': 'Wählen Sie „Alle“ aus',
  'dashboard.filter.tags.none-found': 'Keine Tags gefunden',
  'dashboard.filter.mistakes.all': 'Alle Fehler',
  'dashboard.filter.mistakes.none': 'Keine Fehler',
  'dashboard.filter.mistakes.n-selected': '{count} Fehler',
  'dashboard.filter.mistakes.select-all': 'Wählen Sie „Alle“ aus',
  'dashboard.filter.mistakes.none-found': 'Keine Fehler gefunden',
  'dashboard.filter.tickers.all': 'Alle Ticker',
  'dashboard.filter.tickers.n-selected': '{count}-Ticker',
  'dashboard.filter.tickers.select-all': 'Wählen Sie „Alle“ aus',
  'dashboard.filter.tickers.none-found': 'Keine Ticker gefunden',
  'dashboard.filter.setup.all': 'Alle Setups',
  'dashboard.filter.setup.none': 'Kein Setup',
  'dashboard.filter.setup.n-selected': '{count}-Setups',
  'dashboard.filter.setup.select-all': 'Wählen Sie „Alle“ aus',
  'dashboard.filter.setup.none-found': 'Keine Setups gefunden',
  'dashboard.widgets.daily-performance.title': 'Tägliche Performance',
  'dashboard.widgets.daily-performance.period-aria': 'Zeitraum',
  'dashboard.widgets.daily-performance.period-days': '{count} Tage',
  'dashboard.widgets.weekday-performance.title': 'Wochentag-Performance',
  'dashboard.widgets.weekday-performance.metric-aria': 'Metrik',
  'dashboard.widgets.weekday-performance.metric.net': 'Netto',
  'dashboard.widgets.weekday-performance.metric.win-rate': 'Trefferquote',
  'dashboard.widgets.weekday-performance.metric.trades': 'Trades',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    'Trefferquote: {rate} ({wins}G / {losses}V)',
  'dashboard.widgets.weekday-performance.tooltip.trades': 'Trades: {count}',
  'dashboard.widgets.hourly-performance.title': 'Stündliche Performance',
  'dashboard.widgets.hourly-performance.tooltip.trades':
    'Transaktionen: {count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label': 'Gewinnrate',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    'Gewinnrate: {rate} ({wins}G / {losses}V)',
  'dashboard.widgets.hourly-performance.bucket-aria': 'Intervallgröße',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes} Min.',
  'dashboard.widgets.hourly-performance.metric-aria': 'Metrik',
  'dashboard.widgets.hourly-performance.metric.total': 'Gesamt',
  'dashboard.widgets.hourly-performance.metric.average': 'Durchschnitt',
  'dashboard.widgets.hourly-performance.metric.total-pnl': 'Gesamt-P&L',
  'dashboard.widgets.hourly-performance.metric.avg-pnl': 'Ø P&L',
  'dashboard.widgets.hourly-performance.metric.total-r': 'Gesamt-R',
  'dashboard.widgets.hourly-performance.metric.avg-r': 'Ø R',
  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'Keine Trades',
  'dashboard.widgets.rollingStats.title':
    'Rollierender durchschnittlicher Gewinn/Verlust',
  'dashboard.widgets.rollingStats.period': 'Zeitraum',
  'dashboard.widgets.rollingStats.trades': '{count} Trades',
  'dashboard.widgets.rollingStats.avgWin': 'Durchschnittlicher Gewinn',
  'dashboard.widgets.rollingStats.avgLoss': 'Durchschnittlicher Verlust',
  'dashboard.widgets.rollingStats.tooltip.trade': 'Trade {label}',
  'dashboard.rolling_win_loss.title': 'Rollierendes Gewinn-/Verlustverhältnis',
  'dashboard.rolling_win_loss.period_aria': 'Zeitraum',
  'dashboard.rolling_win_loss.trades_count': '{count} Trades',
  'dashboard.rolling_win_loss.trade_label': 'Trade {label}',
  'dashboard.rolling_win_loss.ratio_label': 'Verhältnis: {ratio}',
  'dashboard.rolling_win_loss.avg_win_label':
    'Durchschnittlicher Gewinn: {value}',
  'dashboard.rolling_win_loss.avg_loss_label':
    'Durchschnittlicher Verlust: {value}',
  'home.widget.recent-items.name': 'Letzte Elemente',
  'home.widget.recent-items.description':
    'Zeigt kürzlich geöffnete Dateien und Ansichten an',
  'home.widget.year-heatmap.name': 'Trading-Heatmap',
  'home.widget.year-heatmap.description':
    'Kalender mit Ihren Trading-Aktivitäten für das Jahr',
  'home.widget.getting-started.name': 'Erste Schritte',
  'home.widget.getting-started.description':
    'Checkliste, die Ihnen hilft, Ihre ersten Trades hinzuzufügen und PRO zu aktivieren',
  'home.widget.getting-started.progress': '{completed}/{total} abgeschlossen',
  'home.widget.getting-started.progress.loading': 'Fortschritt wird geprüft...',
  'home.widget.getting-started.item.create.title':
    'Erstellen Sie Ihren ersten Trade',
  'home.widget.getting-started.item.create.description':
    'Schalten Sie Ihr Dashboard und Ihren Journaling-Flow frei.',
  'home.widget.getting-started.item.create.time': '30er Jahre',
  'home.widget.getting-started.item.create.cta': 'Trade erstellen',
  'home.widget.getting-started.item.tradelog.title': 'Trade-Log öffnen',
  'home.widget.getting-started.item.tradelog.description':
    'Ihre Trading-Datenbank zur Analyse aller Ihrer Trades an einem Ort.',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta': 'Trade-Log öffnen',
  'home.widget.getting-started.item.layouts.title':
    'Öffnen Sie den Layout-Builder',
  'home.widget.getting-started.item.layouts.description':
    'Gestalten Sie Ihre Review-Vorlagen nach Ihren Wünschen.',
  'home.widget.getting-started.item.layouts.time': '1 Minute',
  'home.widget.getting-started.item.layouts.cta':
    'Öffnen Sie den Layout-Builder',
  'home.widget.getting-started.item.pro.title': 'Aktivieren Sie PRO',
  'home.widget.getting-started.item.pro.description':
    'Aktivieren Sie den Trade Import, die MetaTrader-Synchronisierung und die KI-Zuordnung.',
  'home.widget.getting-started.item.pro.time': '1 Minute',
  'home.widget.getting-started.item.pro.cta': 'Aktivieren',
  'home.widget.weekly-summary.name': 'Wöchentliche Zusammenfassung',
  'home.widget.weekly-summary.description':
    'Kennzahlen der aktuellen Woche mit täglichem P&L-Sparkline-Diagramm',
  'home.widget.position-size.name': 'Positionsgrößenrechner',
  'home.widget.position-size.description':
    'Berechnen Sie die Positionsgröße basierend auf dem Kontorisikoprozentsatz',
  'home.widget.embedded-note.name': 'Eingebettete Notiz',
  'home.widget.embedded-note.description':
    'Zeigen Sie alle Markdown-Notizen aus Ihrem Vault an',
  'home.widget.current-streak.name': 'Aktueller Streak',
  'home.widget.current-streak.description':
    'Verfolgen Sie Ihre Sieges- und Niederlagensträhne',
  'home.widget.best-hours.name': 'Beste Stunden',
  'home.widget.best-hours.description':
    'Sehen Sie anhand der Tageszeit, wann Sie am besten handeln',
  'home.widget.setup-leaderboard.name': 'Top-Aufschlüsselung',
  'home.widget.setup-leaderboard.description':
    'Vergleichen Sie Ihre Top-Setups, Tags, Asset-Typen oder Ticker',
  'home.widget.unreviewed-trades.name': 'Nicht geprüfte Trades',
  'home.widget.unreviewed-trades.description':
    'Trades, die einen Review benötigen',
  'home.widget.goals-progress.name': 'Zielfortschritt',
  'home.widget.goals-progress.description':
    'Verfolgen Sie den Fortschritt in Richtung Ihres Trading-Ziels',
  'home.widget.trading-score.name': 'Trading-Score',
  'home.widget.trading-score.description':
    'Umfassende Leistungsbewertung mit Radardiagramm-Visualisierung',
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description':
    'Gesamtes verwaltetes Vermögen mit 7-Tage-Trend-Sparkline',
  'home.widget.drawdown-monitor.name': 'Drawdown-Monitor',
  'home.widget.drawdown-monitor.description':
    'Verfolgen Sie den Drawdown-Status über Konten hinweg mit konfigurierten Limits',
  'account.header.title': 'Konto: {name}',
  'account.header.add-event.aria': 'Einzahlung/Auszahlung hinzufügen',
  'account.header.edit-account.aria': 'Konto bearbeiten',
  'account.header.view-trades.aria': 'Trades im Trade Log anzeigen',
  'account.header.type': 'Typ:',
  'account.header.initial-balance': 'Anfangssaldo:',
  'account.header.current-balance': 'Aktueller Kontostand:',
  'account.header.account-id': 'Konto-ID:',
  'account.header.warning.trades-before-creation.one':
    '{count} Trade vor Kontoerstellungsdatum gefunden',
  'account.header.warning.trades-before-creation.few':
    '{count} Trades wurden vor dem Kontoerstellungsdatum gefunden',
  'account.header.warning.trades-before-creation.many':
    '{count} Trades wurden vor dem Kontoerstellungsdatum gefunden',
  'account.header.warning.trades-before-creation.other':
    '{count} Trades wurden vor dem Kontoerstellungsdatum gefunden',
  'account.header.warning.earliest-trade':
    'Frühester Trade: {date}. Dies kann zu falschen Saldoberechnungen führen.',
  'account.header.warning.fix-date.aria':
    'Korrigieren Sie das Erstellungsdatum des Kontos',
  'account.header.warning.fixing': 'Festsetzung...',
  'account.header.warning.fix-date': 'Datum festlegen',
  'account.header.notice.date-updated':
    'Das Erstellungsdatum des Kontos wurde auf {date} aktualisiert',
  'account.header.notice.update-failed-log':
    'Das Erstellungsdatum des Kontos konnte nicht aktualisiert werden:',
  'account.header.notice.update-failed':
    'Datum konnte nicht aktualisiert werden: {error}',
  'ribbon.open-journalit': 'Öffnen Sie Journalit',
  'view.home': 'Heim',
  'view.dashboard': 'Dashboard',
  'view.trade-log': 'Trade-Log',
  'view.account-dashboard': 'Konto-Dashboard',
  'view.account-page.title': 'Konto: {name}',
  'view.account-page.title-default': 'Kontoseite',
  'view.account-page.no-account-selected': 'Kein Konto ausgewählt',
  'view.account-page.no-account-instructions':
    'Bitte navigieren Sie über das Konto-Dashboard zu dieser Seite.',
  'view.account-page.service-loading': 'Kontoseitendienst wird geladen...',
  'view.account-page.balance-chart-title': 'Kontostandsdiagramm',
  'view.account-page.balance-chart-loading': 'Saldotabelle wird geladen...',
  'view.layout-builder': 'Layout-Builder',
  'view.csv-import': 'Trade Import',
  'nav.prev-day': 'Vorheriger Tag',
  'nav.prev-week': 'Vorherige Woche',
  'nav.prev-month': 'Vorheriger Monat',
  'nav.prev-quarter': 'Vorheriges Quartal',
  'nav.prev-year': 'Vorjahr',
  'nav.drc': 'DRC',
  'nav.weekly': 'Wöchentlicher Rückblick',
  'nav.monthly': 'Monatlicher Rückblick',
  'nav.next-day': 'Nächster Tag',
  'nav.next-week': 'Nächste Woche',
  'nav.next-month': 'Nächsten Monat',
  'nav.weekly-review': 'Wöchentlicher Rückblick',
  'nav.monthly-review': 'Monatlicher Rückblick',
  'nav.quarterly-review': 'Vierteljährlicher Rückblick',
  'nav.yearly-review': 'Jahresrückblick',
  'nav.edit-trade': 'Bearbeiten Sie Trade',
  'review.loading': 'Laden {name}...',
  'review.failed-to-load':
    '{name} konnte nicht geladen werden. Versuchen Sie bitte, die Seite zu aktualisieren.',
  'review.date-unknown': 'Unbekannt',
  'review.error.failed-to-navigate':
    'Die Navigation zum Pfad ist fehlgeschlagen',
  'review.error.update-failed': 'Fehler beim Aktualisieren von {name}',
  'review.error.update-file-failed':
    '{name} in der Datei konnte nicht aktualisiert werden',
  'status-bar.update-available': 'Update verfügbar',
  'status-bar.update-aria-label': 'Journalit {version} – Zum Anzeigen klicken',
  'template.transformation.orphaned-content.header':
    'Inhalt aus vorheriger Vorlage',
  'template.transformation.orphaned-content.desc1':
    'Der folgende Inhalt passte nicht zum neuen Vorlagenlayout.',
  'template.transformation.orphaned-content.desc2':
    'Überprüfen und integrieren Sie es oben oder löschen Sie es, wenn es nicht mehr benötigt wird.',
  'template.editor.loading': 'Vorlage wird geladen...',
  'template.editor.built-in': 'Eingebaut',
  'template.editor.unsaved-changes': 'Nicht gespeicherte Änderungen',
  'template.editor.review-title': 'Trade-Review',
  'template.editor.built-in-notice':
    'Integrierte Vorlagen können nicht bearbeitet werden. Duplizieren Sie diese Vorlage oder erstellen Sie eine neue, um sie anzupassen.',
  'template.editor.show-review': 'Review-Bereich anzeigen',
  'template.editor.show-review-desc':
    'Wann der Review-Abschnitt auf Trade-Notizen angezeigt werden soll',
  'template.editor.show-review.always': 'Immer',
  'template.editor.show-review.losses-only': 'Nur Verluste',
  'template.editor.show-review.never': 'Niemals',
  'template.editor.show-missed': 'Für verpasste Trades anzeigen',
  'template.editor.show-missed-desc':
    'Zeigen Sie auch den Review-Abschnitt verpasster Trade-Notizen an',
  'template.editor.show-backtest': 'Für Backtest Trades anzeigen',
  'template.editor.show-backtest-desc':
    'Zeigen Sie auch den Review-Abschnitt der Backtest-Trade-Notizen an',
  'template.editor.sections': 'Review-Abschnitte',
  'template.editor.add-section': '+ Abschnitt hinzufügen',
  'template.editor.no-sections': 'Keine Review-Abschnitte konfiguriert.',
  'template.editor.add-section-hint':
    'Klicken Sie auf „+ Abschnitt hinzufügen“, um einen zu erstellen.',
  'template.editor.win-sections': 'Gewinnabschnitte',
  'template.editor.loss-sections': 'Verlustabschnitte',
  'template.editor.win-sections-desc':
    'Wird bei Gewinn- und Breakeven-Trades angezeigt',
  'template.editor.loss-sections-desc': 'Wird bei verlorenen Trades angezeigt',
  'template.editor.section-visibility': 'Abschnittssichtbarkeit',
  'template.editor.trade-note-layout': 'Trade-Notiz-Layout',
  'template.editor.layout-scope': 'Layout-Bereich',
  'template.editor.layout-scope-desc':
    'Standardlayout wählen oder eine Asset-Typ-Seite bearbeiten',
  'template.editor.all-asset-types': 'Alle Asset-Typen',
  'template.editor.other-asset-types': 'Andere',
  'template.editor.default-layout': 'Standard',
  'template.editor.asset-type-add': 'Asset-Typ',
  'template.editor.choose-asset-type': 'Asset-Typ wählen',
  'template.editor.remove-asset-layout': 'Asset-Layout entfernen',
  'template.editor.reset-asset-layout': 'Asset-Layout zurücksetzen',
  'template.editor.reset-asset-layout-desc':
    'Dieses asset-spezifische Layout entfernen und Alle Asset-Typen verwenden',
  'template.editor.metrics': 'Kennzahlen',
  'template.editor.metrics-desc':
    'Einstieg, Ausstieg, Dauer und Plan-Kennzahlen anzeigen',
  'template.editor.thesis': 'These',
  'template.editor.thesis-desc': 'Den Block mit der Trade-These anzeigen',
  'template.editor.missed-reason': 'Grund für verpassten Trade',
  'template.editor.missed-reason-desc':
    'Anzeigen, warum der verpasste Trade nicht genommen wurde',
  'template.editor.metric-cards': 'Kennzahlenkarten',
  'template.editor.metadata-rows': 'Metadatenzeilen',
  'template.editor.accounts': 'Konten',
  'template.editor.setups': 'Setups',
  'template.editor.mistakes': 'Fehler',
  'template.editor.tags': 'Tags',
  'template.editor.custom-fields': 'Benutzerdefinierte Felder',
  'template.editor.custom-fields-desc':
    '{count} konfigurierte benutzerdefinierte Felder',
  'template.editor.asset-type-overrides': 'Asset-Typ-Überschreibungen',
  'template.editor.asset-type': 'Asset-Typ',
  'template.editor.asset-type-desc':
    'Abschnittsreihenfolge und Sichtbarkeit für eine Asset-Klasse überschreiben',
  'template.editor.enable-asset-override':
    '{assetType}-Überschreibung aktivieren',
  'template.editor.asset-order': '{assetType}-Reihenfolge',
  'template.editor.reviewed-footer': 'Geprüft-Fußzeile',
  'template.editor.metric.position-size': 'Positionsgröße',
  'template.editor.metric.execution-breakdown': 'Ausführungsübersicht',
  'template.editor.metric.pnl': 'GuV',
  'template.editor.metric.r-multiple': 'R-Multiple',
  'template.editor.metric.costs': 'Kosten',
  'template.editor.nav-bar': 'Navigationsleiste',
  'template.editor.nav-bar-desc': 'Trade-Zeitleiste und Review-Links anzeigen',
  'template.editor.images': 'Bilder',
  'template.editor.images-desc': 'Bilder von Trade-Charts anzeigen',
  'template.editor.metadata': 'Metadaten',
  'template.editor.metadata-desc': 'Konten, Setups und Fehler anzeigen',
  'template.editor.details': 'Trade-Details',
  'template.editor.details-desc':
    'Einstiegs-, Ausstiegs- und P&L-Details anzeigen',
  'template.editor.review-button': 'Schaltfläche „Bewertet markieren“.',
  'template.editor.review-button-desc':
    'Schaltfläche anzeigen, um den Trade als geprüft zu markieren',
  'template.editor.section-type': 'Abschnittstyp',
  'template.editor.type.textarea': 'Textbereich',
  'template.editor.type.checkbox': 'Einzelnes Kontrollkästchen',
  'template.editor.type.checkboxList': 'Checkbox-Liste',
  'template.editor.type.header': 'Kopfzeile',
  'template.editor.title-label': 'Titel (unterstützt **Markdown**)',
  'template.editor.title-placeholder': 'Abschnittstitel',
  'template.editor.content-label': 'Inhalt (unterstützt Markdown)',
  'template.editor.content-placeholder': 'Header-Inhalt',
  'template.editor.checkbox-label':
    'Kontrollkästchenbezeichnung (unterstützt Markdown)',
  'template.editor.checkbox-placeholder': 'Beschriftung des Kontrollkästchens',
  'template.editor.placeholder-label': 'Platzhaltertext',
  'template.editor.placeholder-hint':
    'Platzhaltertext wird angezeigt, wenn er leer ist',
  'template.editor.items-label': 'Checklistenelemente',
  'template.editor.item-n': 'Element {n}',
  'template.editor.add-item': '+ Element hinzufügen',
  'template.editor.preview-fallback': 'Abschnitt {type}',
  'csv.uploader.drop-here': 'Legen Sie die Datei CSV/XLSX/XLS/HTML hier ab',
  'csv.uploader.click-drag':
    'Klicken Sie zum Hochladen oder ziehen Sie es per Drag & Drop',
  'csv.uploader.hint': 'Nur CSV/XLSX/XLS/HTML-Dateien, max. 10 MB',
  'csv.preview-first-note':
    'Die Vorschau ist kostenlos. Für den Import in Ihren Vault ist die Aktivierung von PRO erforderlich.',
  'csv.preview.header-row.title': 'Auswahl der Kopfzeile',
  'csv.preview.header-row.help':
    'Wenn Ihre erste Zeile eine Titel-/Gruppenzeile ist, wählen Sie die Zeile aus, die echte Spaltennamen enthält.',
  'csv.preview.header-row.label': 'Kopfzeile',
  'csv.preview.header-row.range': 'Wählen Sie eine Zeile zwischen 1 und {max}.',
  'csv.preview.header-row.preview': 'Vorschau der ausgewählten Kopfzeile:',
  'csv.gate.import.title': 'Für den Import ist PRO erforderlich',
  'csv.gate.import.description':
    'Das Importieren von Trades in Ihren Vault ist eine PRO-Funktion. Aktivieren Sie PRO, um fortzufahren.',
  'csv.gate.templates.tooltip':
    'PRO erforderlich (aktivieren, um Vorlagen zu verwenden).',
  'csv.gate.ai.tooltip':
    'PRO erforderlich (aktivieren Sie, um die KI-Zuordnung zu verwenden).',
  'csv.mapper.title': 'Ordnen Sie Spalten Trade-Feldern zu',
  'csv.mapper.subtitle':
    'Ordnen Sie Ihre Spalten den Trade-Feldern zu, die sie darstellen.',
  'csv.mapper.do-not-import': 'Nicht importieren',
  'csv.mapper.required-badge': 'Erforderlich',
  'csv.mapper.required-label': 'ERFORDERLICH',
  'csv.mapper.example': 'Beispiel:',
  'csv.mapper.mode.title': 'Importmodus',
  'csv.mapper.mode.help':
    'Wählen Sie aus, wie manuelle Zeilen interpretiert werden sollen. Der direkte PnL-Modus importiert Zeilen als geschlossene Trades unter Verwendung zugeordneter PnL-Werte.',
  'csv.mapper.mode.price-based': 'Preisbasiert (Ein-/Ausstieg)',
  'csv.mapper.mode.direct-pnl': 'Direkt PnL',
  'csv.mapper.asset-type.help':
    'Wählen Sie den Instrumententyp in dieser Datei aus. Dadurch werden die erforderlichen Felder und die Parsing-Logik bestimmt.',
  'csv.mapper.date-format.title': 'Datumsformat in der Datei',
  'csv.mapper.date-format.help':
    'Wie Datumsangaben in Ihrer Datei angezeigt werden. Wichtig für mehrdeutige Formate wie 01.02.2024 (2. Januar vs. 1. Februar).',
  'csv.mapper.date-format.placeholder': 'Datumsformat auswählen...',
  'csv.mapper.tip.title': 'Tipp: Ordnen Sie zusätzliche Felder zu',
  'csv.mapper.tip.desc':
    'Die Zuordnung optionaler Felder wie Provision und Profit_Loss verbessert die Importqualität. Sie können auch mehrere Spalten zuordnen, um Felder wie Tags, Bilder, Setups und Fehler aufzulisten.',
  'csv.mapper.missing-fields': 'Fehlende erforderliche Felder für {assetType}:',
  'csv.mapper.summary.title': 'Zusammenfassung:',
  'csv.mapper.summary.of': 'von',
  'csv.mapper.summary.columns-mapped': 'Spalten zugeordnet',
  'csv.mapper.summary.all-mapped': 'Alle erforderlichen Felder zugeordnet',
  'csv.mapper.available-fields.title': 'Verfügbare Trade-Felder',
  'csv.mapper.available-fields.desc':
    'Nach Kategorien geordnet mit Beschreibungen für anlagenspezifische Felder',
  'csv.ai-mapper.header.title': 'Benutzerdefinierten Sie Hilfe?',
  'csv.ai-mapper.header.description':
    'AI kann Ihre CSV analysieren und Feldzuordnungen vorschlagen (optional)',
  'csv.ai-mapper.button.label': 'Schlagen Sie Zuordnungen mit AI vor',
  'csv.ai-mapper.button.tooltip':
    'Verwendet AI, um Spaltenzuordnungen vorzuschlagen. Erfordert eine Backend-Verbindung.',
  'csv.ai-mapper.helper-text':
    'KI-Vorschläge sollten vor dem Import überprüft werden – überprüfen Sie immer die Zuordnungen auf Richtigkeit.',
  'csv.ai-mapper.status.analyzing': 'Analyse der CSV-Struktur',
  'csv.ai-mapper.status.consulting': 'Beratung von AI für Spaltenzuordnungen',
  'csv.ai-mapper.status.processing': 'Bearbeitung von KI-Vorschlägen',
  'csv.ai-mapper.status.taking-longer':
    'Dauert länger als gewöhnlich, funktioniert immer noch',
  'csv.ai-mapper.notice.no-suggestions':
    'AI konnte keine Zuordnungen vorschlagen. Bitte kartieren Sie manuell.',
  'csv.ai-mapper.notice.suggested-count':
    'AI schlug Zuordnungen für {count}-Spalten vor',
  'csv.ai-mapper.notice.unavailable':
    'KI-Zuordnung nicht verfügbar. Bitte ordnen Sie die Spalten manuell zu oder verwenden Sie eine gespeicherte Vorlage.',
  'csv.template-save.title': 'Importvorlage speichern',
  'csv.template-save.description':
    'Speichern Sie diese Spaltenzuordnungen als wiederverwendbare Vorlage für zukünftige Importe.',
  'csv.template-save.label.name': 'Vorlagenname',
  'csv.template-save.placeholder.name': 'z. B. „My Broker“-Format',
  'csv.template-save.button.save': 'Vorlage speichern',
  'csv.template-save.button.saving': 'Sparen...',
  'csv.template-import.title': 'Vorlage importieren',
  'csv.template-import.description':
    'Fügen Sie einen Vorlagenfreigabecode (JTT-v1-... oder JTT-v2-...) ein, um ihn in Ihren Vault zu importieren.',
  'csv.template-import.label.share-code': 'Code teilen',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',
  'csv.template-import.helper-text':
    'Die Vorlage wird Ihren lokalen Vorlagen hinzugefügt',
  'csv.template-import.button.import': 'Vorlage importieren',
  'csv.template-import.button.importing': 'Importieren...',
  'csv.template-import.error.import-failed':
    'Vorlage konnte nicht importiert werden',
  'csv.template-delete.title': 'Vorlage löschen?',
  'csv.template-delete.description':
    'Sind Sie sicher, dass Sie „{name}“ löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
  'csv.template-delete.button.delete': 'Vorlage löschen',
  'csv.template-delete.button.deleting': 'Löschen...',
  'csv.export-template.title': 'Exportvorlage: {name}',
  'csv.export-template.description':
    'Teilen Sie diesen Code mit anderen, damit diese Ihre Vorlagenkonfiguration verwenden können.',
  'csv.export-template.label.share-code': 'Code teilen',
  'csv.export-template.helper-text':
    'Der vollständige Code wird in die Zwischenablage kopiert, wenn Sie auf die Schaltfläche unten klicken',
  'csv.export-template.button.copied': 'Kopiert!',
  'csv.export-template.button.copy': 'In die Zwischenablage kopieren',
  'csv.mapper.field.symbol': 'Symbol',
  'csv.mapper.field.direction': 'Richtung (Long/Short)',
  'csv.mapper.field.entry-time': 'Einstiegszeit',
  'csv.mapper.field.exit-time': 'Ausstiegszeit',
  'csv.mapper.field.entry-price': 'Einstiegspreis',
  'csv.mapper.field.exit-price': 'Ausstiegspreis',
  'csv.mapper.field.quantity': 'Menge',
  'csv.mapper.field.notes': 'Notizen',
  'csv.mapper.field.order-id': 'Bestell-ID',
  'csv.mapper.field.account-id': 'Konto-ID',
  'csv.mapper.help.options-required': 'Erforderlich für Options-Trades',
  'csv.mapper.help.option-type-required':
    'Erforderlich für Optionen (Call oder Put)',
  'csv.mapper.help.contract-size':
    'Multiplikator für Optionen (normalerweise 100) oder Futures',
  'csv.mapper.help.order-id': 'Wird zum Aggregieren von Teil-Fills verwendet',
  'csv.mapper.help.asset-types': 'Aktien, Optionen, Futures, Forex, Krypto',
  'csv.mapper.help.status': 'Trade-Status: OFFEN oder GESCHLOSSEN',
  'csv.mapper.category.required': 'Erforderliche Felder',
  'csv.mapper.category.optional-core': 'Optionale Kernfelder',
  'csv.mapper.category.identifiers': 'Identifikatoren',
  'csv.mapper.category.other': 'Andere',
  'csv.mapper.category.options': 'Optionsfelder',
  'csv.mapper.category.futures': 'Futures-Felder',
  'csv.broker.loading': 'Laden von Brokern...',
  'csv.broker.loading-templates': 'Vorlagen werden geladen...',
  'csv.broker.select-placeholder': 'Broker oder Vorlage auswählen...',
  'csv.broker.label': 'Broker-/Importformat',
  'csv.broker.helper-text':
    'Wählen Sie einen unterstützten Broker oder erstellen Sie ein benutzerdefiniertes Format',
  'csv.broker.hidden-count': '{count} ausgeblendet',
  'csv.broker.manage-hidden': 'Verwalten Sie versteckte Broker',
  'csv.broker.supported-brokers': 'Unterstützte Broker',
  'csv.broker.my-templates': 'Meine Vorlagen',
  'csv.broker.show-more': '{count} weitere anzeigen',
  'csv.broker.show-less': 'Weniger anzeigen',
  'csv.broker.create-new': '+ Neues Format erstellen',
  'csv.broker.favorite-selected': 'Ihr Favorit wird automatisch ausgewählt',
  'csv.broker.star-hint':
    'Markieren Sie einen Broker, um ihn automatisch auszuwählen',
  'csv.broker.hidden-modal-title': 'Versteckte Broker',
  'csv.broker.no-hidden': 'Keine versteckten Broker',
  'csv.broker.restore': 'Wiederherstellen',
  'csv.broker.restore-all': 'Alles wiederherstellen',
  'csv.broker.hide-aria': 'Verstecken Sie diesen Broker',
  'csv.broker.remove-favorite-aria': 'Aus Favoriten entfernen',
  'csv.broker.set-favorite-aria': 'Als Favorit festlegen',
  'csv.broker.ibkr': 'Interaktive Broker (IBKR)',
  'csv.broker.tradovate': 'Tradovate',
  'csv.broker.tradezero': 'TradeZero',
  'csv.broker.tradingview': 'TradingView Papierhandel',
  'csv.broker.bybit': 'Bybit (USDT Perpetuals)',
  'csv.broker.blofin': 'Blofin',
  'csv.broker.hyperliquid': 'Hyperliquid (Perpetuals)',
  'csv.broker.sierrachart': 'SierraChart (Futures)',
  'csv.broker.motivewave': 'MotiveWave',
  'csv.broker.fxreplay': 'FX-Wiedergabe (Analyse)',
  'csv.broker.atas': 'ATAS (Statistics Realtime)',
  'csv.broker.rithmic': 'Rithmisch',
  'csv.broker.jdr': 'JDR Securities Limited',
  'csv.account-selector.loading': 'Konten werden geladen...',
  'csv.account-selector.no-accounts': 'Noch keine Konten.',
  'csv.account-selector.create-account-hint':
    'Erstellen Sie eines, um mit dem Import von Trades aus CSV zu beginnen.',
  'csv.account-selector.create-account-cta': 'Konto erstellen',
  'csv.account-selector.label': 'Wählen Sie Konto aus',
  'csv.account-selector.error.load-failed':
    'Konten konnten nicht geladen werden',
  'csv.account-selector.favorite.remove': 'Aus Favoriten entfernen',
  'csv.account-selector.favorite.set': 'Als Favorit festlegen',
  'csv.account-selector.show-less': 'Weniger anzeigen',
  'csv.account-selector.show-more': '{count} weitere anzeigen',
  'csv.account-selector.favorite.auto-selected':
    'Ihr Favorit wird automatisch ausgewählt',
  'csv.account-selector.favorite.star-hint':
    'Markieren Sie ein Konto, um es automatisch auszuwählen',
  'csv.results.import-successful': 'Import erfolgreich!',
  'csv.results.successfully-imported-prefix': 'Erfolgreich importiert',
  'csv.results.successfully-imported-suffix': 'Trades',
  'csv.results.skipped-duplicates-prefix': 'Übersprungen',
  'csv.results.skipped-duplicates-suffix': 'Doppelte Trades',
  'csv.results.failed-to-import-prefix': 'Import fehlgeschlagen',
  'csv.results.failed-to-import-suffix': 'Zeilen (Details siehe unten)',
  'csv.results.failed-rows-title': 'Fehlgeschlagene Zeilen:',
  'csv.results.import-failed': 'Import fehlgeschlagen',
  'csv.results.import-error-generic': 'Beim Import ist ein Fehler aufgetreten',
  'csv.results.additional-errors': 'Zusätzliche Fehler:',
  'csv.results.button.view-account': 'Konto anzeigen',
  'csv.results.button.import-another': 'Weitere Trade Importieren',
  'csv.results.button.try-again': 'Versuchen Sie es erneut',
  'csv.incomplete-options.title': 'Unvollständige Optionsdaten erkannt',
  'csv.incomplete-options.desc-single':
    'Bei einem Optionshandel fehlen erforderliche Metadaten:',
  'csv.incomplete-options.desc-plural':
    'Bei {count}-Options-Tradesn fehlen die erforderlichen Metadaten:',
  'csv.incomplete-options.missing-strike-single': 'Trade ohne Ausübungspreis',
  'csv.incomplete-options.missing-strike-plural': 'Trades ohne Ausübungspreis',
  'csv.incomplete-options.missing-expiry-single':
    'Beim Trading fehlt das Ablaufdatum',
  'csv.incomplete-options.missing-expiry-plural':
    'Bei Trades fehlt das Ablaufdatum',
  'csv.incomplete-options.missing-option-type-single':
    'Trade mit fehlendem Optionstyp (Call/Put)',
  'csv.incomplete-options.missing-option-type-plural':
    'Trades mit fehlendem Optionstyp (Call/Put)',
  'csv.incomplete-options.impact-desc':
    'Diese Trades werden ohne vollständige Optionsdaten importiert, was sich auf Folgendes auswirken kann:',
  'csv.incomplete-options.impact-analytics': 'Analyse und Filterung',
  'csv.incomplete-options.impact-pl': 'P&L-Berechnungen',
  'csv.incomplete-options.impact-accuracy': 'Trade Journalgenauigkeit',
  'csv.incomplete-options.import-anyway': 'Trotzdem importieren',
  'csv.incomplete-options.cancel-import': 'Import abbrechen',
  'csv.image-review.title': 'Überprüfen Sie Bildreferenzen',
  'csv.image-review.summary':
    '{imageCount} Bildreferenzen in {tradeCount} Trade(s) gefunden.',
  'csv.image-review.rows': 'Zeilen: {rows}',
  'csv.image-review.count': '{count} Bild(er)',
  'csv.image-review.import-images': 'Bilder importieren',
  'csv.image-review.discard-all': 'Alle Bilder verwerfen',
  'csv.image-review.discard-confirmation':
    'Alle Bildverweise für diesen Import verwerfen? Trades werden weiterhin ohne Bilder importiert.',
  'csv.image-review.confirm-discard': 'Ja, Alles verwerfen',
  'image.uploader.paste-title':
    'Medien aus der Zwischenablage einfügen (Strg+V)',
  'image.uploader.pasting': 'Einfügen...',
  'image.uploader.paste': 'Einfügen',
  'image.uploader.url-placeholder': 'Medien-URL oder Dateipfad einfügen...',
  'image.uploader.url-input-aria': 'Medien-URL-Eingabe',
  'image.uploader.file-upload-aria': 'Aus Datei hochladen',
  'image.uploader.paste-clipboard-aria': 'Aus der Zwischenablage einfügen',
  'image.uploader.error-invalid-url':
    'Ungültige Bild-URL oder ungültiger Dateipfad. Gib eine unterstützte Bild-URL, einen Vault-Bildpfad oder einen Excalidraw-Link ein.',
  'image.viewer.alt-default': 'Bild',
  'image.viewer.description-default': 'Medienvorschau',
  'image.viewer.error-load':
    'Bild kann nicht geladen werden. Die Datei fehlt möglicherweise oder ist nicht zugänglich.',
  'image.viewer.title-fullscreen':
    'Klicken Sie hier, um den Vollbildmodus anzuzeigen',
  'image.viewer.zoom-indicator': 'Zum Vergrößern klicken oder gedrückt halten',
  'image.viewer.delete-button': 'Bild löschen',
  'image.viewer.nav-prev': 'Vorheriges Bild',
  'image.viewer.nav-next': 'Nächstes Bild',
  'image.viewer.zoom-in-hint': 'Zum Vergrößern kneifen oder klicken',
  'image.viewer.zoom-out-hint':
    '{scale}x (Zum Verkleinern zusammenziehen oder anklicken)',
  'image.viewer.no-images': 'Keine Bilder zum Anzeigen vorhanden',
  'image.viewer.thumbnail-alt': 'Miniaturansicht {n}',
  'image.viewer.close-aria': 'Vollbild schließen',
  'image.viewer.copy-image': 'Bild kopieren',
  'image.viewer.copy-success': 'Bild in die Zwischenablage kopiert',
  'image.viewer.copied': 'Kopiert',
  'image.viewer.copy-failed':
    'Bild konnte nicht in die Zwischenablage kopiert werden',
  'image.viewer.copy-unsupported':
    'Das Kopieren von Bildern in die Zwischenablage wird in dieser Umgebung nicht unterstützt',
  'media.viewer.video-controls': 'Videosteuerung',
  'media.viewer.play-video': 'Video abspielen',
  'media.viewer.pause-video': 'Video pausieren',
  'media.viewer.mute-video': 'Video stummschalten',
  'media.viewer.unmute-video': 'Stummschaltung des Videos aufheben',
  'media.viewer.volume': 'Lautstärke',
  'media.viewer.back-5': '5 Sekunden zurück',
  'media.viewer.forward-5': '5 Sekunden vor',
  'media.viewer.timeline': 'Video-Zeitleiste',
  'media.viewer.open-youtube': 'Auf YouTube öffnen',

  'image.carousel.no-images': 'Keine Bilder zum Anzeigen vorhanden',
  'image.carousel.prev': 'Vorheriges Bild',
  'image.carousel.next': 'Nächstes Bild',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'Miniaturansicht {index}',
  'paste.notice.image-pasted': '📋 Bild erfolgreich eingefügt',
  'paste.notice.images-pasted': '📋 {count} Bilder erfolgreich eingefügt',
  'paste.error.clipboard-not-supported':
    'Zwischenablage API wird nicht unterstützt',
  'paste.error.clipboard-empty':
    'In der Zwischenablage wurde nichts zum Einfügen gefunden',
  'paste.error.file-size-exceeds':
    'Die Dateigröße {size}MB überschreitet den Grenzwert',
  'paste.error.no-images-found':
    'Keine Bilder in der Zwischenablage gefunden. Versuchen Sie zunächst, ein Bild zu kopieren.',
  'paste.error.permission-denied': 'Zugriff verweigert',
  'datepicker.aria.time': 'Zeit',
  'datepicker.button.clear': 'Klar',
  'datepicker.button.today': 'Heute',
  'datepicker.button.now': 'Jetzt',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'JJ',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'common.loading': 'Laden...',
  'common.error': 'Fehler',
  'common.success': 'Erfolg',
  'common.warning': 'Warnung',
  'common.info': 'Info',
  'common.yes': 'Ja',
  'common.no': 'NEIN',
  'common.ok': 'OK',
  'common.search': 'Suchen...',
  'common.select': 'Wählen...',
  'common.select-option': 'Wählen Sie eine Option',
  'common.view': 'Sicht',
  'common.none': 'Keiner',
  'common.other': 'Andere',
  'common.breakdown': 'Abbauen',
  'common.na': 'N / A',
  'common.unknown': 'Unbekannt',
  'common.unknown-error': 'Unbekannter Fehler',
  'common.all': 'Alle',
  'common.select-all': 'Wählen Sie „Alle“ aus',
  'common.n-types': '{count}-Typen',
  'common.select-item': 'Wählen Sie {item}',
  'common.header': 'Kopfzeile',
  'common.row-n': 'Zeile {n}:',
  'common.date': 'Datum',
  'common.time': 'Zeit',
  'common.today': 'Heute',
  'common.yesterday': 'Gestern',
  'common.tomorrow': 'Morgen',
  'common.day': 'Tag',
  'common.days': 'Tage',
  'common.week': 'Woche',
  'common.weeks': 'Wochen',
  'common.month': 'Monat',
  'common.months': 'Monate',
  'common.year': 'Jahr',
  'common.years': 'Jahre',
  'common.quarter': 'Quartal',
  'common.quarters': 'Viertel',
  'common.total': 'Gesamt',
  'common.average': 'Durchschnitt',
  'common.min': 'Min',
  'common.max': 'Max',
  'common.best': 'Am besten',
  'common.worst': 'Am schlimmsten',
  'common.profit': 'Profitieren',
  'common.loss': 'Verlust',
  'common.win': 'Gewinn',
  'common.lose': 'Verlieren',
  'common.trade': 'Trade',
  'common.trades': 'Trades',
  'common.goals': 'Ziele',
  'common.statuses': 'Status',
  'common.enabled': 'ermöglicht',
  'common.disabled': 'deaktiviert',
  'common.color.gray': 'Grau',
  'common.color.red': 'Rot',
  'common.color.orange': 'Orange',
  'common.color.yellow': 'Gelb',
  'common.color.label': 'Farbe',
  'common.color.default': 'Standard',
  'common.day.monday': 'Montag',
  'common.day.tuesday': 'Dienstag',
  'common.day.wednesday': 'Mittwoch',
  'common.day.thursday': 'Donnerstag',
  'common.day.friday': 'Freitag',
  'common.day.saturday': 'Samstag',
  'common.day.sunday': 'Sonntag',
  'common.day.all-week': 'Die ganze Woche',
  'common.month.january': 'Januar',
  'common.month.february': 'Februar',
  'common.month.march': 'März',
  'common.month.april': 'April',
  'common.month.may': 'Mai',
  'common.month.june': 'Juni',
  'common.month.july': 'Juli',
  'common.month.august': 'August',
  'common.month.september': 'September',
  'common.month.october': 'Oktober',
  'common.month.november': 'November',
  'common.month.december': 'Dezember',
  'common.score.poor': 'Schwach',
  'common.score.below-average': 'Unterdurchschnittlich',
  'common.score.average': 'Durchschnitt',
  'common.score.strong': 'Stark',
  'common.score.excellent': 'Exzellent',
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'Höchststand realisierter GuV',
  'chart.tooltip.episode-start': 'Episodenstart',
  'chart.tooltip.underwater-days': 'Zeit im Drawdown',
  'chart.tooltip.underwater-trades': 'Trades im Drawdown',
  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % von {basis}',
  'chart.tooltip.percent-basis': 'Prozentbasis',
  'chart.tooltip.distance-to-recovery': 'Abstand zur Erholung',
  'chart.tooltip.trade-pnl': 'Trade P&L',
  'chart.tooltip.account': 'Konto',
  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'chart.loading': 'Diagramm wird geladen...',
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'Einstieg',
  'chart.legend.exit': 'Ausstieg',
  'chart.legend.trade': 'Trade',
  'calendar.day.mon': 'Mo',
  'calendar.day.tue': 'Di',
  'calendar.day.wed': 'Mi',
  'calendar.day.thu': 'Do',
  'calendar.day.fri': 'Fr',
  'calendar.day.sat': 'Sa',
  'calendar.day.sun': 'So',
  'calendar.month.jan': 'Jan',
  'calendar.month.feb': 'Febr',
  'calendar.month.mar': 'Mär',
  'calendar.month.apr': 'Apr',
  'calendar.month.may': 'Mai',
  'calendar.month.jun': 'Jun',
  'calendar.month.jul': 'Juli',
  'calendar.month.aug': 'Aug',
  'calendar.month.sep': 'Sept',
  'calendar.month.oct': 'Okt',
  'calendar.month.nov': 'Nov',
  'calendar.month.dec': 'Dez',
  'calendar.legend.less': 'Weniger',
  'calendar.legend.more': 'Mehr',
  'settings.title': 'Journalit-Einstellungen',
  'settings.language': 'Sprache',
  'settings.language-desc': 'Wählen Sie die Anzeigesprache für das Plugin aus',
  'settings.ftp.title': 'FTP-Anmeldeinformationen',
  'settings.ftp.title-metatrader': 'FTP-Anmeldeinformationen für MetaTrader',
  'settings.ftp.loading': 'FTP-Anmeldeinformationen werden geladen...',
  'settings.ftp.info-message':
    'Verwenden Sie diese Anmeldeinformationen, um die FTP-Veröffentlichungseinstellungen von MetaTrader zu konfigurieren:',
  'settings.ftp.label.server': 'FTP-Server:',
  'settings.ftp.label.login': 'FTP-Login:',
  'settings.ftp.label.password': 'FTP Passwort:',
  'settings.ftp.aria.copy-server': 'Kopieren Sie den FTP-Server',
  'settings.ftp.aria.copy-login': 'Kopieren Sie die FTP-Anmeldung',
  'settings.ftp.aria.copy-password': 'Passwort kopieren',
  'settings.ftp.aria.password-unavailable':
    'Passwort zum Kopieren nicht verfügbar',
  'settings.ftp.aria.password-hidden': 'Passwort ausgeblendet',
  'settings.ftp.aria.hide-password': 'Passwort verbergen',
  'settings.ftp.aria.show-password': 'Passwort anzeigen',
  'settings.ftp.notice.password-masked':
    'Das Passwort wird gespeichert, steht aber nicht zum Anzeigen oder Kopieren zur Verfügung. Setzen Sie das Passwort zurück, um ein neues zu erhalten.',
  'settings.ftp.notice.password-save':
    'Bewahren Sie dieses Passwort sicher auf. Es kann später nicht mehr wiederhergestellt werden.',
  'settings.ftp.button.reset': 'FTP-Passwort zurücksetzen',
  'settings.ftp.button.resetting': 'Passwort zurücksetzen...',
  'settings.ftp.reset-hint':
    'Klicken Sie auf diese Schaltfläche, um ein neues FTP-Passwort zu generieren.',
  'settings.ftp.instructions.title': 'MetaTrader-Einrichtungsanweisungen:',
  'settings.ftp.instructions.step1': 'Öffnen Sie MetaTrader 5 (MT5)',
  'settings.ftp.instructions.step2': 'Klicken Sie oben auf das Menü „Extras“.',
  'settings.ftp.instructions.step3': 'Wählen Sie „Optionen“',
  'settings.ftp.instructions.step4':
    'Navigieren Sie zur Registerkarte „FTP“ und geben Sie den oben gezeigten FTP-Server, die Anmeldung und das Passwort ein',
  'settings.ftp.instructions.step5': 'Aktivieren Sie den „Passivmodus“',
  'settings.ftp.instructions.step6':
    'Aktivieren Sie die automatische Veröffentlichung von Berichten über FTP und legen Sie das Aktualisierungsintervall auf 60 Minuten fest',
  'settings.ftp.no-credentials':
    'Keine FTP-Anmeldeinformationen gefunden. Klicken Sie im Abschnitt oben auf „FTP-Anmeldeinformationen erstellen“, um diese zu generieren.',
  'settings.ftp.error.reset-failed':
    'Passwort konnte nicht zurückgesetzt werden',
  'settings.auth.title': 'Konto',
  'settings.auth.description':
    'Verwalten Sie Authentifizierungs- und Verbindungseinstellungen.',
  'settings.auth.status': 'Status',
  'settings.auth.status-desc': 'Aktueller Verbindungs- und Abonnementstatus',
  'settings.auth.status-offline': 'Offline',
  'settings.auth.status-online': 'Online',
  'settings.auth.plan-suffix': 'Planen',
  'settings.auth.authentication': 'Authentifizierung',
  'settings.auth.sign-in-desc':
    'Melden Sie sich an, um auf Ihr Trading-Journal zuzugreifen',
  'settings.auth.signed-in': 'Angemeldet',
  'settings.auth.sign-in-up': 'Anmelden / Registrieren',
  'settings.auth.sign-out': 'Abmelden',
  'settings.auth.sign-out-desc': 'Melden Sie sich von Ihrem Konto ab',
  'settings.auth.subscription-features': 'Abonnementfunktionen',
  'settings.auth.tier-free': 'Kostenloser Plan mit Grundfunktionen.',
  'settings.auth.tier-pro':
    'Pro-Plan mit erweiterten Analysen und unbegrenztem Speicherplatz.',
  'settings.auth.tier-enterprise':
    'Unternehmensplan mit vollem Funktionszugriff und vorrangigem Support.',
  'settings.auth.tier-unknown': 'Abonnementstatus unbekannt.',
  'settings.auth.error-prefix': 'Fehler:',
  'settings.auth.offline-mode': 'Offline-Modus',
  'settings.auth.offline-desc':
    'Betrieb im Offline-Modus. Einige Funktionen können eingeschränkt sein. Wird automatisch synchronisiert, wenn online.',
  'settings.auth.grace-period': 'Die Kulanzfrist endet in {days} Tagen',
  'settings.auth.guest': 'Gast',
  'settings.auth.actions': 'Aktionen',
  'settings.auth.your-plan': 'Dein Plan',
  'settings.auth.feature-basic-trades': 'Grundlegende Trade-Tracking',
  'settings.auth.feature-basic-analytics': 'Grundlegende Analysen',
  'settings.auth.feature-unlimited-trades': 'Unbegrenzte Trades',
  'settings.auth.feature-advanced-analytics': 'Erweiterte Analysen',
  'settings.auth.feature-api-access': 'API-Zugriff',
  'settings.auth.feature-priority-support': 'Vorrangiger Support',
  'settings.auth.manage-subscription': 'Abonnement verwalten',
  'settings.tab.general': 'Allgemein',
  'settings.tab.reviews': 'Reviews',
  'settings.tab.session-mode': 'Sitzungsmodus',
  'settings.tab.customization': 'Anpassung',
  'settings.tab.journal-setup': 'Journal-Einrichtung',
  'settings.tab.backend': 'Trade-Synchronisierung',
  'settings.tab.trading': 'Trades',
  'settings.tab.sync': 'Synchronisierung',
  'settings.tab.accounts': 'Konto',
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Wöchentlicher Rückblick',
  'settings.reviews.monthly': 'Monatlicher Rückblick',
  'settings.reviews.quarterly': 'Quartalsreview',
  'settings.reviews.yearly': 'Jahresrückblick',
  'settings.reviews.default-templates': 'Standardlayouts',
  'settings.reviews.default-templates-desc':
    'Wählen Sie aus, welche Vorlage beim Erstellen neuer Notizen verwendet werden soll. Sie können im Vorlagen-Builder auch Standardeinstellungen festlegen.',
  'settings.reviews.trade-template': 'Trade-Layout',
  'settings.reviews.trade-template-desc': 'Layout für neue Trade-Notizen',
  'settings.reviews.drc-template': 'DRC-Layout',
  'settings.reviews.drc-template-desc': 'Layout für neue Tageszeugnisse',
  'settings.reviews.weekly-template': 'Wöchentliche Layout',
  'settings.reviews.weekly-template-desc':
    'Vorlage für neue wöchentliche Reviews',
  'settings.reviews.monthly-template': 'Monatliche Layout',
  'settings.reviews.monthly-template-desc':
    'Vorlage für neue monatliche Reviews',
  'settings.reviews.quarterly-template': 'Vierteljährliche Layout',
  'settings.reviews.quarterly-template-desc':
    'Vorlage für neue Quartalsreviews',
  'settings.reviews.yearly-template': 'Jährliche Layout',
  'settings.reviews.yearly-template-desc': 'Layout für neue Jahresreviews',
  'settings.reviews.template-builder': 'Layout-Builder',
  'settings.reviews.template-builder-desc':
    'Erstellen, bearbeiten und verwalten Sie Ihre Layouts visuell. In der Builder-Ansicht können Sie Abschnitte per Drag-and-Drop verschieben, Optionen konfigurieren und eine Vorschau Ihrer Layouts in Echtzeit anzeigen.',
  'settings.reviews.open-builder': 'Öffnen Sie den Layout-Builder',
  'settings.reviews.recurring-goals': 'Wiederkehrende Ziele',
  'settings.reviews.recurring-goals-desc':
    'Definieren Sie Ziele, die automatisch bei jedem neuen Review erscheinen. Diese werden beim Erstellen des Reviews kopiert und können pro Review bearbeitet werden.',
  'settings.reviews.daily-goals': 'Tägliche Ziele',
  'settings.reviews.daily-goal-placeholder':
    'Fügen Sie ein wiederkehrendes Tagesziel hinzu...',
  'settings.reviews.weekly-goals': 'Wöchentliche Ziele',
  'settings.reviews.weekly-goal-placeholder':
    'Fügen Sie ein wiederkehrendes wöchentliches Ziel hinzu...',
  'settings.reviews.pre-trade-checklist': 'DRC-Checkliste vor dem Trade',
  'settings.reviews.pre-trade-checklist-desc':
    'Definieren Sie Checklistenelemente, die automatisch auf jeder neuen DRC erscheinen. Diese werden bei der Erstellung auf jedes DRC kopiert und können täglich bearbeitet werden.',
  'settings.reviews.checklist-placeholder':
    'Fügen Sie einen Checklistenpunkt hinzu...',
  'settings.reviews.auto-create': 'Reviews automatisch erstellen',
  'settings.reviews.global-auto-create':
    'Globale, automatisch erstellte Reviews',
  'settings.reviews.global-auto-create-desc':
    'Reviews automatisch erstellen, wenn der erste Trade des entsprechenden Zeitraums erfasst wird. Diese Einstellung gilt für tägliche, wöchentliche, monatliche, vierteljährliche und jährliche Reviews.',
  'settings.reviews.global-auto-create-aria':
    'Globale, automatisch erstellte Reviews',
  'settings.reviews.auto-create-drc-nav':
    'DRC in der Navigation automatisch erstellen',
  'settings.reviews.auto-create-drc-nav-desc':
    'Erstellen Sie automatisch einen neuen Tagesbericht, wenn Sie zu einem Tag navigieren, an dem noch keiner vorhanden ist',
  'settings.reviews.auto-create-drc-nav-aria':
    'DRC in der Navigation automatisch erstellen',
  'settings.reviews.auto-create-weekly-nav':
    'Erstellen Sie automatisch einen wöchentlichen Review in der Navigation',
  'settings.reviews.auto-create-weekly-nav-desc':
    'Erstellen Sie automatisch einen neuen Wochenrückblick, wenn Sie zu einer Woche navigieren, in der es noch keinen gibt',
  'settings.reviews.auto-create-weekly-nav-aria':
    'Erstellen Sie automatisch einen wöchentlichen Review in der Navigation',
  'settings.reviews.auto-create-monthly-nav':
    'Erstellen Sie automatisch einen monatlichen Review in der Navigation',
  'settings.reviews.auto-create-monthly-nav-desc':
    'Erstellen Sie automatisch einen neuen Monatsrückblick, wenn Sie zu einem Monat navigieren, in dem es noch keinen gibt',
  'settings.reviews.auto-create-monthly-nav-aria':
    'Erstellen Sie automatisch einen monatlichen Review in der Navigation',
  'settings.reviews.auto-create-quarterly-nav':
    'Erstellen Sie automatisch einen Quartalsreview in der Navigation',
  'settings.reviews.auto-create-quarterly-nav-desc':
    'Erstellen Sie automatisch einen neuen Quartalsrückblick, wenn Sie zu einem Quartal navigieren, in dem noch kein Quartalsrückblick vorhanden ist',
  'settings.reviews.auto-create-quarterly-nav-aria':
    'Erstellen Sie automatisch einen Quartalsreview in der Navigation',
  'settings.reviews.auto-create-yearly-nav':
    'Erstellen Sie automatisch einen jährlichen Überblick über die Navigation',
  'settings.reviews.auto-create-yearly-nav-desc':
    'Erstellen Sie automatisch einen neuen Jahresrückblick, wenn Sie zu einem Jahr navigieren, in dem es noch keinen gibt',
  'settings.reviews.auto-create-yearly-nav-aria':
    'Erstellen Sie automatisch einen jährlichen Überblick über die Navigation',
  'settings.reviews.scalper-defaults': 'Scalper-Standardeinstellungen',
  'settings.reviews.scalper-defaults-desc':
    'Konfigurieren Sie globale Standardeinstellungen für das Verhalten von Demon Tracker. Einzelne Demon Tracker-Widgets können diese Werte im Layout-Builder weiterhin überschreiben.',
  'settings.reviews.scalper-default-count-mode': 'Standard-Zählmodus',
  'settings.reviews.scalper-default-count-mode-desc':
    'Wählen Sie, ob wiederkehrende Fehler pro Trade oder einmal pro Trading-Tag gezählt werden.',
  'settings.reviews.scalper-default-source-mode': 'Standardquellenmodus',
  'settings.reviews.scalper-default-source-mode-desc':
    'Wählen Sie, ob Demon Tracker Trading-Fehler, Sitzungsfehler oder beides verwendet.',
  'settings.reviews.scalper-auto-apply-session':
    'Wenden Sie Sitzungsfehler automatisch auf Tages-Trades an',
  'settings.reviews.scalper-auto-apply-session-desc':
    'Wenn diese Option aktiviert ist, können Fehler auf Sitzungsebene standardmäßig für alle Trades am selben Trading-Tag gelten.',
  'settings.reviews.scalper-auto-apply-session-aria':
    'Wenden Sie Sitzungsfehler automatisch auf Tages-Trades an',
  'settings.reviews.notice.template-updated': 'Standardlayout aktualisiert',
  'settings.reviews.notice.builder-not-found':
    'Der Befehl „Layout-Builder“ wurde nicht gefunden',
  'settings.reviews.notice.global-auto-create':
    'Für alle Reviews automatisch erstellen {status}',
  'settings.reviews.notice.auto-create-nav':
    '{type} automatisch in der Navigation {status} erstellen',
  'settings.reviews.daily.checklist-title': 'Punkte der Pre-Trade-Checkliste',
  'settings.reviews.daily.checklist-desc':
    'Passen Sie die Checklistenelemente an, die in Ihrer DRC angezeigt werden. Dies sind Aufgaben, die Sie erledigen sollten, bevor Sie mit Ihrer Trading-Session beginnen.',
  'settings.reviews.daily.checklist-placeholder': 'Neuer Checklistenpunkt',
  'settings.reviews.daily.questions-title': 'Überprüfen Sie Fragen',
  'settings.reviews.daily.questions-desc':
    'Passen Sie die Reflexionsfragen an, die im Review-Bereich angezeigt werden. Diese Fragen helfen Ihnen, über Ihre Trading-Performance nachzudenken.',
  'library.type.drc': 'DRC',
  'library.type.weekly': 'Wöchentlich',
  'library.type.monthly': 'Monatlich',
  'library.type.quarterly': 'Vierteljährlich',
  'library.type.yearly': 'Jährlich',
  'library.type.trade': 'Trade',
  'library.error.invalid-share-code': 'Ungültiger Freigabecode',
  'library.notice.import-success': 'Layout „{name}“ erfolgreich importiert!',
  'library.error.import-failed': 'Layout konnte nicht importiert werden',
  'library.notice.select-template':
    'Bitte wählen Sie eine Vorlage zum Exportieren aus',
  'library.notice.template-not-found': 'Layout nicht gefunden',
  'library.notice.code-generated': 'Freigabecode generiert!',
  'library.error.export-failed': 'Layout konnte nicht exportiert werden',
  'library.notice.copied': 'Freigabecode in Zwischenablage kopiert!',
  'library.error.copy-failed': 'Kopieren in die Zwischenablage fehlgeschlagen',
  'library.title.import': 'Layout importieren',
  'library.desc.import':
    'Fügen Sie einen JRT-v1-Freigabecode ein, um eine Vorlage von einem anderen Benutzer zu importieren.',
  'library.label.share-code': 'Code teilen',
  'library.placeholder.import-code':
    'Fügen Sie hier den Freigabecode JRT-v1-... ein',
  'library.button.validating': 'Validierung...',
  'library.button.validate': 'Bestätigen',
  'library.button.import': 'Layout importieren',
  'library.preview.valid': 'Gültige Layout',
  'library.preview.invalid': 'Ungültiger Freigabecode',
  'library.title.export': 'Layout exportieren',
  'library.desc.export':
    'Wählen Sie eine Vorlage aus, um einen Freigabecode zu generieren, den andere importieren können.',
  'library.empty.title': 'Keine benutzerdefinierten Layouts zum Exportieren.',
  'library.empty.hint':
    'Erstellen Sie zunächst eine benutzerdefinierte Vorlage auf den Registerkarten „Review-“ oder „Trade-Vorlagen“ und kehren Sie dann hierher zurück, um sie zu teilen.',
  'library.label.select-template': 'Layout auswählen',
  'library.option.select-template': '-- Wählen Sie eine Layout aus --',
  'library.button.generate-code': 'Freigabecode generieren',
  'library.button.copy-code': 'In die Zwischenablage kopieren',
  'settings.reviews.daily.questions-placeholder': 'Neue Review-Frage',
  'settings.reviews.daily.timeframes-title': 'Zeitrahmen prognostizieren',
  'settings.reviews.daily.timeframes-desc':
    'Passen Sie die Zeitrahmen an, die in Ihren Prognosen für die DRC angezeigt werden.',
  'settings.reviews.daily.timeframes-placeholder':
    'Neuer Zeitrahmen (z. B. 15 Min, 5 Min)',
  'settings.weekly.review-questions': 'Überprüfen Sie Fragen',
  'settings.weekly.review-questions-desc':
    'Passen Sie die Fragen an, die in Ihrer wöchentlichen Review angezeigt werden. Diese Fragen helfen Ihnen, über Ihre Trading-Performance im Laufe der Woche nachzudenken.',
  'settings.weekly.new-question-placeholder': 'Neue Review-Frage',
  'settings.weekly.forecast-timeframes': 'Zeitrahmen prognostizieren',
  'settings.weekly.forecast-timeframes-desc':
    'Passen Sie die Zeitrahmen an, die in Ihrer wöchentlichen Prognose angezeigt werden.',
  'settings.weekly.new-timeframe-placeholder':
    'Neuer Zeitrahmen (z. B. Wöchentlich, Täglich)',
  'settings.weekly.default-question-1': 'Was hat diese Woche gut funktioniert?',
  'settings.weekly.default-question-2':
    'Was hat diese Woche nicht funktioniert?',
  'settings.weekly.default-question-3':
    'Welche Setups waren am profitabelsten?',
  'settings.weekly.default-question-4':
    'Welche Fehler kosten mich am meisten Geld?',
  'settings.weekly.default-question-5':
    'Was könnte ich nächste Woche verbessern?',
  'settings.weekly.default-timeframe-monthly': 'Monatlich',
  'settings.weekly.default-timeframe-weekly': 'Wöchentlich',
  'settings.weekly.default-timeframe-daily': 'Täglich',
  'settings.shared.timeframes.title': 'Zeitrahmen prognostizieren',
  'settings.shared.timeframes.desc':
    'Passen Sie die Zeitrahmen an, die in Ihrer Prognose angezeigt werden',
  'settings.shared.timeframes.placeholder':
    'Neuer Zeitrahmen (z. B. 15 Min, 5 Min)',
  'settings.shared.timeframes.reset-to-defaults':
    'Auf Standardeinstellungen zurücksetzen',
  'shared.goal-tracker.title': 'Ziele',
  'shared.goal-tracker.empty': 'Keine Ziele gefunden',
  'shared.goal-tracker.remove-goal': 'Ziel entfernen',
  'shared.goal-tracker.add-goal-placeholder': 'Fügen Sie ein neues Ziel hinzu',
  'shared.empty-state.message': 'Keine Daten verfügbar',
  'weekly.tab.preparation': 'Vorbereitung',
  'weekly.tab.overview': 'Überblick',
  'weekly.tab.review': 'Review',
  'weekly.review.drcs.title': 'Tägliche Reviews für diese Woche',
  'weekly.review.drcs.empty':
    'Für diese Woche wurden keine Tagesbewertungen gefunden',
  'account.settings.modal.title': 'Einstellungen des Konto-Dashboards',
  'account.settings.notice.name-empty':
    'Der Name des Kontotyps darf nicht leer sein',
  'account.settings.notice.type-exists':
    'Der Kontotyp „{name}“ existiert bereits',
  'account.settings.notice.reserved-name':
    '„{name}“ ist ein reservierter Kontotypname',
  'account.settings.notice.type-added':
    'Kontotyp „{name}“ erfolgreich hinzugefügt',
  'account.settings.notice.add-error':
    'Fehler beim Hinzufügen des Kontotyps: {error}',
  'account.settings.notice.cannot-delete-archived':
    'Der Kontotyp „Archiviert“ kann nicht gelöscht werden – er ist für die Archivierung von Konten reserviert',
  'account.settings.notice.analyze-error':
    'Fehler bei der Analyse der Kontotypnutzung',
  'account.settings.notice.cannot-delete-has-accounts':
    '„{name}“ kann nicht gelöscht werden – es sind {count}-Konten zugeordnet. Die Migrationsfunktion ist bald verfügbar.',
  'account.settings.notice.saved':
    'Die Einstellungen des Konto-Dashboards wurden erfolgreich gespeichert',
  'account.settings.notice.save-error':
    'Fehler beim Speichern der Einstellungen: {error}',
  'account.settings.notice.migration-target-required':
    'Bitte wählen Sie einen Zielkontotyp für die Neuzuweisung aus',
  'account.settings.notice.migration-failed':
    'Migration fehlgeschlagen: {error}',
  'account.settings.notice.type-deleted':
    'Kontotyp „{name}“ erfolgreich gelöscht',
  'account.settings.notice.type-deleted-with-cleanup':
    'Kontotyp „{name}“ erfolgreich gelöscht (bereinigt: {actions})',
  'account.settings.notice.migration-error':
    'Fehler während der Migration: {error}',
  'account.settings.notice.delete-error':
    'Fehler beim Löschen des Kontotyps: {error}',
  'account.settings.notice.operation-failed':
    '{operation} fehlgeschlagen: {error}',
  'account.settings.notice.migration-no-targets':
    'Konten können nicht migriert werden – keine anderen Kontotypen verfügbar. Erstellen Sie zunächst einen neuen Kontotyp.',
  'account.settings.notice.type-deleted-migrated':
    'Kontotyp „{name}“ erfolgreich gelöscht. {count}-Konten {action}',
  'account.settings.operation.type-deletion': 'Löschung des Kontotyps',
  'account.settings.migration.error.target-required':
    'Für die Neuzuweisung erforderlicher Zieltyp',
  'account.settings.migration.error.invalid-option':
    'Ungültige Migrationsoption',
  'account.settings.unnamed-account': 'Unbenanntes Konto',
  'account.settings.migration.title': 'Migrieren Sie Konten vor dem Löschen',
  'account.settings.migration.warning':
    'Sie sind dabei, „{name}“ zu löschen, dem die Konten {count} zugeordnet sind.',
  'account.settings.migration.instruction':
    'Diese Konten müssen bearbeitet werden, bevor der Kontotyp gelöscht werden kann:',
  'account.settings.migration.more-accounts': '... und {count} mehr',
  'account.settings.migration.choose-option':
    'Wählen Sie aus, wie mit diesen Konten umgegangen werden soll:',
  'account.settings.migration.option.reassign.title':
    'Einem anderen Typ zuweisen',
  'account.settings.migration.option.reassign.desc':
    'Verschieben Sie alle Konten in einen anderen Kontotyp',
  'account.settings.migration.target-type.label': 'Zielkontotyp:',
  'account.settings.migration.option.archive.title': 'Archivkonten',
  'account.settings.migration.option.archive.desc':
    'Verschieben Sie alle Konten in den Status „Archiviert“.',
  'account.settings.migration.option.delete.title': 'Zum Löschen markieren',
  'account.settings.migration.option.delete.desc':
    'Markieren Sie alle Konten als gelöscht',
  'account.settings.migration.button.migrate': 'Typ migrieren und löschen',
  'account.settings.migration.button.migrating': 'Migration...',
  'account.settings.migration.action.reassigned':
    'neu zugewiesen zu „{target}“',
  'account.settings.migration.action.archived':
    'in den Archivstatus verschoben',
  'account.settings.migration.action.deleted': 'zum Löschen markiert',
  'account.settings.delete.title': 'Kontotyp löschen',
  'account.settings.delete.confirm-question':
    'Sind Sie sicher, dass Sie den Kontotyp „{name}“ löschen möchten?',
  'account.settings.delete.impact-analysis': 'Wirkungsanalyse:',
  'account.settings.delete.affected-accounts':
    '• {count} Konto/Konten betroffen:',
  'account.settings.delete.migration-notice':
    'Hinweis: Diese Konten müssen einem anderen Kontotyp neu zugewiesen werden, bevor der Löschvorgang fortgesetzt werden kann.',
  'account.settings.delete.no-affected':
    '• Keine Konten verwenden diesen Kontotyp',
  'account.settings.delete.cleanup-title':
    'Einstellungen, die bereinigt werden:',
  'account.settings.delete.cleanup.excluded':
    '• Aus ausgeschlossenen Kontotypen entfernt',
  'account.settings.delete.cleanup.order':
    '• Aus der Anzeigereihenfolge entfernt',
  'account.settings.delete.cleanup.withdrawals':
    '• Aus den Auszahlungseinstellungen entfernt',
  'account.settings.delete.cleanup.none':
    'Keine Bereinigung der Einstellungen erforderlich',
  'account.settings.delete.button.setup-migration': 'Migration einrichten',
  'account.settings.delete.button.delete': 'Kontotyp löschen',
  'account.settings.delete.button.deleting': 'Löschen...',
  'account.settings.section.available-types.title': 'Verfügbare Kontotypen',
  'account.settings.section.available-types.desc':
    'Girokontotypen in Ihrem System.',
  'account.settings.section.available-types.placeholder':
    'Geben Sie den Namen des Kontotyps ein...',
  'account.settings.section.available-types.add-aria':
    'Neuen Kontotyp hinzufügen',
  'account.settings.section.available-types.delete-aria': 'Löschen Sie {name}',
  'account.settings.section.available-types.empty':
    'Keine benutzerdefinierten Kontotypen definiert.',
  'account.settings.section.inclusion.title':
    'Einstellungen zur Dashboard-Einbindung',
  'account.settings.section.inclusion.desc':
    'Wählen Sie aus, welche Kontotypen in Dashboard-Berechnungen einbezogen werden sollen. Konfigurieren Sie außerdem, ob Abhebungen von jedem Kontotyp in die Gesamtabhebungsmetriken einbezogen werden.',
  'account.settings.section.inclusion.include-dashboard':
    'In Dashboard-Statistiken',
  'account.settings.section.inclusion.include-withdrawals': 'Abhebungen',
  'account.settings.section.inclusion.empty':
    'Es sind keine Kontotypen zum Konfigurieren verfügbar.',
  'account.settings.section.order.title': 'Reihenfolge anzeigen',
  'account.settings.section.order.desc':
    'Ordnen Sie die Darstellung der Kontotypen im Dashboard neu an.',
  'account.settings.section.order.empty':
    'Es sind keine Kontotypen zum Bestellen verfügbar.',
  'account.settings.section.order.move-up': 'Bewegen Sie sich nach oben',
  'account.settings.section.order.move-down': 'Bewegen Sie sich nach unten',
  'account.settings.button.save': 'Einstellungen speichern',
  'account.settings.button.saving': 'Sparen...',
  'weekly.review.drcs.empty-sub':
    'Tägliche Reviews werden hier angezeigt, sobald Sie sie erstellt haben',
  'weekly.review.drcs.mental': 'Geistig',
  'weekly.review.drcs.technical': 'Technisch',
  'weekly.review.drcs.view-button': 'Siehe DRC',
  'weekly.review.drcs.no-answer': 'Keine Antwort gegeben',
  'weekly.review.performance.title': 'Selbsteinschätzung der Leistung',
  'weekly.review.performance.mental': 'Mentale Performance',
  'weekly.review.performance.mental-placeholder':
    'Hinweise zu Ihrer geistigen Leistungsfähigkeit...',
  'weekly.review.performance.technical': 'Technische Ausführung',
  'weekly.review.performance.technical-placeholder':
    'Hinweise zu Ihrer technischen Ausführung...',
  'weekly.review.questions.title': 'Wöchentliche Review-Fragen',
  'weekly.review.questions.empty': 'Keine Review-Fragen konfiguriert',
  'weekly.review.questions.empty-sub':
    'Fügen Sie Review-Fragen auf der Registerkarte „Einstellungen für wöchentliche Reviews“ hinzu',
  'weekly.review.questions.answer-placeholder': 'Ihre Antwort hier...',
  'weekly.review.questions.settings-hint':
    'Review-Fragen können auf der Registerkarte „Einstellungen für wöchentliche Reviews“ konfiguriert werden.',
  'weekly.review.goals.title': 'Ziele für nächste Woche',
  'weekly.review.goals.empty': 'Keine Ziele für nächste Woche festgelegt',
  'weekly.review.goals.empty-sub':
    'Definieren Sie klare Ziele, um Ihr Trading zu fokussieren',
  'weekly.review.goals.add-placeholder':
    'Fügen Sie ein Ziel für nächste Woche hinzu',
  'weekly.review.goals.add-button': 'Ziel hinzufügen',
  'weekly.preparation.goals.title': 'Wöchentliche Ziele',
  'weekly.preparation.goals.empty': 'Keine Tore aus der Vorwoche',
  'weekly.preparation.events.title': 'Wichtige Ereignisse',
  'weekly.preparation.events.colour': 'Farbe:',
  'weekly.preparation.events.day': 'Tag:',
  'weekly.preparation.events.day-none': 'Keine (optional)',
  'weekly.preparation.events.notes-placeholder':
    'Hinweise zu dieser Veranstaltung',
  'weekly.preparation.events.add-button': 'Ereignis hinzufügen',
  'weekly.preparation.events.event-label': 'Ereignis',
  'weekly.preparation.events.event-placeholder':
    'Ereignis auswählen oder erstellen',
  'weekly.preparation.events.empty': 'Keine wichtigen Ereignisse hinzugefügt',
  'weekly.preparation.events.sub-empty':
    'Fügen Sie wichtige Marktereignisse hinzu, die sich auf Ihr Trading auswirken könnten',
  'weekly.preparation.forecast.title': 'Wöchentliche Prognose',
  'weekly.overview.pnl-chart.title': 'Wöchentlich kumulativ P&L',
  'weekly.overview.pnl-chart.empty': 'Keine P&L-Daten zum Anzeigen',
  'weekly.overview.pnl-chart.empty-sub':
    'Ihr kumulierter Gewinn/Verlust wird hier angezeigt, sobald Sie abgeschlossene Trades protokolliert haben',
  'weekly.overview.drawdown-chart.title': 'Wöchentlicher Drawdown',
  'weekly.overview.drawdown-chart.empty':
    'Es können keine Drawdown-Daten angezeigt werden',
  'weekly.overview.drawdown-chart.empty-sub':
    'Ihre Drawdown-Kennzahlen werden hier angezeigt, sobald Sie geschlossene Trades protokolliert haben',
  'weekly.overview.performance.title': 'Wöchentliche Performance',
  'weekly.overview.metrics.net-pnl': 'Netto P&L',
  'weekly.overview.metrics.win-rate': 'Trefferquote',
  'weekly.overview.metrics.profit-factor': 'Gewinnfaktor',
  'weekly.overview.metrics.expectancy': 'Erwartungswert',
  'weekly.overview.metrics.total-trades': 'Trades insgesamt',
  'weekly.overview.metrics.avg-win': 'Durchschn. Gewinn',
  'weekly.overview.metrics.avg-loss': 'Durchschn. Verlust',
  'weekly.overview.metrics.pl-ratio': 'P/L-Verhältnis',
  'weekly.overview.setup-performance.title': 'Setup-Performance',
  'weekly.overview.setup-performance.col-setup': 'Setup',
  'weekly.overview.setup-performance.col-pnl': 'P&L',
  'weekly.overview.setup-performance.col-win-rate': 'Gewinn %',
  'weekly.overview.setup-performance.col-trades': 'Trades',
  'weekly.overview.setup-performance.empty': 'Keine Setup-Daten verfügbar',
  'weekly.overview.setup-performance.empty-sub':
    'Fügen Sie Setup-Tags zu Ihren Trades hinzu, um Leistungsmetriken nach Setup anzuzeigen',
  'weekly.overview.trades-chart.title': 'Wöchentliche Trades',
  'weekly.overview.trades-chart.empty': 'Keine Trades für diese Woche',
  'weekly.overview.trades-chart.empty-sub':
    'Verfolgen Sie Ihre einzelnen Trades, um sie hier visualisiert zu sehen',
  'weekly.overview.best-trade.title': 'Bester Trade der Woche',
  'weekly.overview.best-trade.empty':
    'Diese Woche gab es keine erfolgreichen Trades',
  'weekly.overview.best-trade.empty-sub':
    'Ihre besten Trades werden hier angezeigt, sobald Sie einige profitable Trades protokolliert haben',
  'weekly.overview.worst-trade.title': 'Schlechtester Trade der Woche',
  'weekly.overview.worst-trade.empty': 'Keine verlorenen Trades diese Woche',
  'weekly.overview.worst-trade.empty-sub':
    'Hier werden Ihre am wenigsten erfolgreichen Trades angezeigt, damit Sie lernen und sich verbessern können',
  'weekly.overview.daily-performance.title': 'Tägliche Performance',
  'weekly.overview.daily-performance.col-date': 'Datum',
  'weekly.overview.daily-performance.col-trades': 'Trades',
  'weekly.overview.daily-performance.col-win-rate': 'Gewinn %',
  'weekly.overview.daily-performance.col-profit-factor': 'Gewinnfaktor',
  'weekly.overview.daily-performance.col-pnl': 'P&L',
  'weekly.overview.daily-performance.empty': 'Keine Trades für diese Woche',
  'weekly.overview.daily-performance.empty-sub':
    'Ihre tägliche Trading-Performance wird hier angezeigt, sobald Sie Trades protokolliert haben',
  'weekly.overview.trade.unknown': 'Unbekannt',
  'weekly.overview.trade.na': 'N / A',
  'weekly.overview.trade.label-date': 'Datum:',
  'weekly.overview.trade.label-setup': 'Setup:',
  'weekly.overview.trade.label-duration': 'Dauer:',
  'weekly.overview.trade.label-tags': 'Schlagworte:',
  'weekly.overview.trade.label-mistakes': 'Fehler:',
  'weekly.overview.trade.duration-format': '{hours}h {minutes}m',
  'weekly.overview.button.create-trade': 'Trade erstellen',
  'weekly.overview.button.view-trade-details': 'Trade-Details anzeigen',
  'monthly.tab.overview': 'Überblick',
  'monthly.tab.review': 'Review',
  'monthly.review.demon-tracker.title': 'Dämonenverfolger',
  'monthly.review.demon-tracker.description':
    'Verfolgen Sie Ihre wiederkehrenden Fehler, um Muster zu erkennen und Ihre Trading-Disziplin zu verbessern.',
  'monthly.review.demon-tracker.column.demon': 'DÄMON',
  'monthly.review.demon-tracker.column.stop-trading':
    'Hören Sie mit dem Trading auf',
  'monthly.review.demon-tracker.summary.unique-mistakes':
    'Insgesamt einzigartige Fehler:',
  'monthly.review.demon-tracker.summary.total-occurrences':
    'Gesamtfehlerhäufigkeit:',
  'monthly.review.demon-tracker.summary.critical-mistakes':
    'Kritische Fehler (6+):',
  'monthly.review.demon-tracker.empty':
    'Diesen Monat wurden keine Fehler erfasst',
  'monthly.review.demon-tracker.empty-sub':
    'Hier werden bei Ihren Trades protokollierte Fehler angezeigt, um Muster zu erkennen',
  'monthly.review.mental-game-performance': 'Mentale Performance',
  'monthly.review.technical-game-performance': 'Technische Performance',
  'settings.loss-review.title': 'Einstellungen zur Loss-Review',
  'settings.loss-review.description':
    'Konfigurieren Sie die Loss-Review, die unten bei Verlust-Trades angezeigt wird. Dies hilft Ihnen, aus Verlusten zu lernen und die richtige Handelspsychologie aufrechtzuerhalten.',
  'settings.loss-review.enable': 'Aktivieren Sie die Verlustprüfung',
  'settings.loss-review.enable-desc':
    'Zeigen Sie den Abschnitt „Loss-Review“ für Trades mit negativem P&L an',
  'settings.loss-review.sections-title': 'Abschnitte zur Loss-Review',
  'settings.loss-review.add-section': 'Abschnitt hinzufügen',
  'settings.loss-review.reset-to-defaults':
    'Auf Standardeinstellungen zurücksetzen',
  'settings.loss-review.new-section-title': 'Neuer Abschnitt',
  'settings.loss-review.empty-state':
    'Keine Abschnitte konfiguriert. Klicken Sie auf „Abschnitt hinzufügen“, um Ihren ersten Abschnitt zu erstellen.',
  'backend.title': 'Trade Synchronisierung',
  'backend.description':
    'Richten Sie die Synchronisierung von MetaTrader (MT4/MT5) ein und halten Sie Ihren Vault automatisch auf dem neuesten Stand.',
  'trade-sync.gate.signin.title': 'Anmeldung erforderlich',
  'trade-sync.gate.signin.description':
    'Um die Trade-Synchronisierung zu aktivieren, melden Sie sich zunächst bei Ihrem Journalit-Konto an.',
  'trade-sync.gate.signin.cta': 'anmelden',
  'trade-sync.gate.pro.title': 'Pro erforderlich',
  'trade-sync.gate.pro.description':
    'Trade Sync ist eine Pro-Funktion. Aktualisieren Sie, um fortzufahren.',
  'trade-sync.gate.pro.cta': 'Jetzt upgraden',
  'trade-sync.gate.feature-unavailable.title': 'Funktion nicht verfügbar',
  'trade-sync.gate.feature-unavailable.description':
    'Diese Synchronisierungsfunktion ist für Ihr Pro-Konto nicht aktiviert. Aktualisieren Sie Ihren Status oder wenden Sie sich an den Support, wenn das Problem weiterhin besteht.',
  'trade-sync.trial.title': 'Automatisieren Sie Ihr Trading-Journal',
  'trade-sync.trial.description':
    'Sparen Sie mit Journalit Pro bis zu 7 Stunden pro Woche.',
  'trade-sync.trial.benefit.sync': 'Automatische Trade-Synchronisierung',
  'trade-sync.trial.benefit.import': 'Importieren Sie Trades von überall',
  'trade-sync.trial.cta': 'Starten Sie Ihre kostenlose 14-tägige Testphase',
  'trade-sync.trial.existing-subscriber':
    'Bereits abonniert? Melden Sie sich an',
  'trade-sync.trial.eligibility':
    'Kostenlose Testphase nur für neue Abonnenten verfügbar.',
  'premium.gate.cta.activate': 'Aktivieren Sie PRO',
  'premium.gate.cta.upgrade-now': 'Jetzt upgraden',
  'premium.gate.cta.signin-continue': 'Anmelden und fortfahren',
  'premium.gate.cta.continue-pro': 'Weiter zu PRO',
  'premium.gate.cta.keep-editing': 'Bearbeiten Sie weiter',
  'premium.gate.cta.refresh': 'Status aktualisieren',
  'premium.gate.import.state.signin.title':
    'Sie sind nur noch einen Schritt vom Import entfernt',
  'premium.gate.import.state.signin.description':
    'Ihre Datei und Zuordnungen sind fertig. Melden Sie sich an, um fortzufahren.',
  'premium.gate.import.state.pro.title': 'Sie sind bereit zum Importieren',
  'premium.gate.import.state.pro.description':
    'Ihre Datei und Zuordnungen sind fertig. Der Import ist Teil von PRO.',
  'premium.gate.import.reassurance':
    'Importiere unbegrenzt viele Trades in deinen Vault.',
  'premium.gate.trial-hint':
    'Erstmalige PRO-Abonnements beinhalten eine 14-tägige kostenlose Testversion.',
  'premium.gate.offline':
    'Sie scheinen offline zu sein. Für die Aktivierung ist Internet erforderlich.',
  'premium.gate.not-pro-yet':
    'Sie sind angemeldet, aber Ihr Konto ist noch nicht PRO. Upgraden Sie und aktualisieren Sie anschließend den Status.',
  'backend.connection.title': 'Verbindungseinstellungen',
  'backend.connection.status': 'Verbindungsstatus',
  'backend.connection.status-desc':
    'Aktueller Verbindungsstatus zum Trading-Server',
  'backend.status.connected': 'Verbunden',
  'backend.status.disconnected': 'Getrennt',
  'backend.status.checking': 'Überprüfung...',
  'backend.register.title': 'Vault registrieren',
  'backend.register.description':
    'Registrieren Sie diesen Vault beim Backend-Server zur Synchronisierung',
  'backend.register.button': 'Vault registrieren',
  'backend.register.registering': 'Registrieren...',
  'backend.ftp.title': 'FTP-Anmeldeinformationen',
  'backend.ftp.description':
    'Erstellen Sie FTP-Anmeldeinformationen, um MetaTrader-Berichte hochzuladen. Es wird automatisch ein eindeutiger Benutzername generiert.',
  'backend.ftp.create-button': 'Erstellen Sie FTP-Anmeldeinformationen',
  'backend.ftp.creating': 'Erstellen...',
  'backend.ftp.credentials-title': 'MetaTrader FTP Anmeldeinformationen',
  'backend.sync.title': 'Synchronisierungseinstellungen',
  'backend.sync.auto-sync': 'Aktivieren Sie die automatische Synchronisierung',
  'backend.sync.auto-sync-desc':
    'Synchronisieren Sie Trades automatisch vom Backend-Server',
  'backend.sync.auto-sync-info':
    'Die automatische Synchronisierung prüft jede Stunde, ob neue Trades vorliegen',
  'backend.sync.auto-sync-aria':
    'Aktivieren Sie die automatische Synchronisierung',
  'backend.sync.manual': 'Manuelle Synchronisierung',
  'backend.sync.manual-desc':
    'Erzwingen Sie eine sofortige Synchronisierung von Trades',
  'backend.sync.manual-info':
    'Durchschnittliche Wartezeit: 2-3 Minuten (maximal: 5 Minuten)',
  'backend.sync.syncing': 'Synchronisierung...',
  'backend.sync.force-button': 'Synchronisierung jetzt erzwingen',
  'backend.sync.last-result': 'Letztes Synchronisierungsergebnis',
  'backend.sync.synced-trades':
    'Synchronisierte {trades}-Trades ({files} neue Dateien)',
  'backend.sync.no-new-trades': 'Keine neuen Trades zum Synchronisieren',
  'backend.sync.status': 'Synchronisierungsstatus',
  'backend.sync.last-sync': 'Letzte Synchronisierung',
  'backend.sync.total-syncs': 'Gesamtsynchronisierungen',
  'backend.sync.never': 'Niemals',
  'backend.sync.invalid-date': 'Ungültiges Datum',
  'backend.notice.vault-registered': '✓ Vault beim Trading-Server registriert',
  'backend.notice.sync-cancelled': '⏹️ Synchronisierung abgebrochen',
  'backend.notice.sync-in-progress': '⚠️ Synchronisierung läuft bereits',
  'backend.notice.account-info-failed':
    '✗ Kontoinformationen konnten nicht abgerufen werden',
  'backend.notice.sync-batch-progress':
    '⟳ Synchronisierungsstapel: {count} Trades ({progress} % abgeschlossen, {remaining} verbleibend)',
  'backend.notice.all-trades-synced':
    '✓ Alle {count} Trades sind bereits synchronisiert',
  'backend.notice.account-created': '✓ Erstelltes Konto: {name}',
  'backend.notice.batch-complete':
    '⟳ Batch abgeschlossen: {processed}/{total}-Trades ({progress} %). Fortsetzung...',
  'backend.notice.sync-complete':
    '✗ Synchronisierung abgeschlossen: {total}-Trades verarbeitet ({newFiles} neu, {updated} aktualisiert) über alle {accounts}-Konten hinweg',
  'backend.notice.sync-complete-no-trades':
    '✗ Synchronisierung abgeschlossen – keine neuen Trades gefunden',
  'backend.notice.sync-failed': '✗ Synchronisierung fehlgeschlagen: {error}',
  'backend.accounts.title': 'Handelskonten',
  'backend.accounts.linked': 'Verknüpfte MT-Konten',
  'backend.accounts.linked-desc':
    'MetaTrader-Konten, die aus synchronisierten Berichten erkannt wurden',
  'backend.accounts.server-disconnected':
    'Server ist nicht verbunden. Bitte überprüfen Sie den Verbindungsstatus.',
  'backend.accounts.loading': 'Konten werden geladen...',
  'backend.accounts.no-accounts': 'Keine Konten gefunden.',
  'backend.accounts.sync-to-detect':
    'Synchronisieren Sie einige Trades, um Konten zu erkennen.',
  'backend.accounts.connect-to-see':
    'Stellen Sie eine Verbindung zum Server her und synchronisieren Sie Trades, um Konten anzuzeigen.',
  'backend.accounts.account-id': 'Konto-ID',
  'backend.accounts.broker': 'Broker',
  'backend.accounts.first-seen': 'Zum ersten Mal gesehen',
  'backend.accounts.last-seen': 'Zuletzt gesehen',
  'backend.accounts.refresh': 'Konten aktualisieren',
  'backend.accounts.unlink-title': 'MetaTrader-Konto trennen',
  'backend.accounts.unlink': 'Trennen',
  'backend.accounts.unlink-confirm':
    'MetaTrader-Konto {accountId} trennen? Es wird in Trade Sync ausgeblendet und zukünftige Importe werden übersprungen, bis du es erneut verknüpfst.',
  'backend.accounts.unlink-success': 'MetaTrader-Konto getrennt',
  'backend.accounts.relink': 'Erneut verknüpfen',
  'backend.accounts.relink-success': 'MetaTrader-Konto erneut verknüpft',
  'backend.accounts.ignored.title': 'Getrennte Konten',
  'backend.accounts.ignored.count': '{count} ausgeblendet',
  'backend.accounts.ignored.empty': 'Keine getrennten Konten.',
  'backend.accounts.ignored-at': 'Getrennt',
  'backend.progress.title': 'Einrichtungsfortschritt',
  'backend.progress.connection.label': 'Verbinden',
  'backend.progress.connection.desc': 'Vault mit Server verbinden',
  'backend.progress.ftp.label': 'FTP',
  'backend.progress.ftp.desc': 'Anmeldeinformationen erstellen',
  'backend.progress.sync.label': 'Synchronisieren',
  'backend.progress.sync.desc':
    'Aktivieren Sie die automatische Synchronisierung',
  'backend.progress.accounts.label': 'Konten',
  'backend.progress.accounts.desc': 'MT-Konten verknüpfen',
  'backend.cards.connection.title': 'Verbindung',
  'backend.cards.connection.refresh': 'Aktualisieren',
  'backend.cards.sync.title': 'Synchronisierungsstatus',
  'backend.cards.sync.last-sync': 'Letzte Synchronisierung',
  'backend.cards.sync.total': 'Gesamtsynchronisierungen',
  'backend.cards.sync.button': 'Jetzt synchronisieren',
  'backend.cards.sync.cancel': 'Synchronisierung abbrechen',
  'backend.cards.accounts.title': 'Konten',
  'backend.cards.accounts.linked': 'Verknüpfte Konten',
  'backend.cards.accounts.manage': 'Verwalten',
  'backend.section.setup.title': 'Einrichtung und Konfiguration',
  'backend.section.sync.title': 'Synchronisierungseinstellungen',
  'backend.section.accounts.title': 'Kontoverwaltung',
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'KI-Trade-Import-Zuordnung',
  'settings.auth.feature.metatrader-sync': 'MetaTrader Trade Synchronisierung',
  'settings.auth.feature.basic-tracking': 'Grundlegende Trade-Tracking',
  'settings.auth.feature.manual-csv': 'Manueller Trade Import',
  'settings.auth.feature.manual-entry': 'Manuelle Trade-Eingabe',
  'settings.auth.feature.analytics-reviews': 'Analysen und Reviews',
  'settings.auth.feature.priority-support': 'Vorrangiger Support',
  'backend.sync.just-now': 'Soeben',
  'backend.sync.minutes-ago': '{count} vor Minuten',
  'backend.sync.hours-ago': '{count} vor einer Stunde',
  'backend.sync.days-ago': '{count} vor Tagen',
  'csv.title': 'Importieren Sie Trades aus CSV',
  'csv.subtitle':
    'Laden Sie die CSV-Datei Ihres Brokers hoch, um Trades in Ihr Journal zu importieren.',
  'csv.how-to-export': 'So exportieren Sie von Ihrem Broker',
  'csv.processing-file': 'Importdatei wird verarbeitet...',
  'csv.importing-trades': 'Trades werden in das Konto importiert...',
  'csv.format': 'Importformat:',
  'csv.asset-type': 'Asset-Typ',
  'csv.asset-type-desc':
    'Wählen Sie hier den Instrumententyp CSV aus. Dadurch werden Vertragsspezifikationen und Validierungsregeln festgelegt.',
  'csv.button.export-template': 'Vorlage exportieren',
  'csv.button.delete-template': 'Vorlage löschen',
  'csv.button.import-template': 'Vorlage importieren',
  'csv.button.import-rows': 'Importieren Sie {count}-Zeilen',
  'csv.button.edit-format': 'Format bearbeiten',
  'csv.button.continue-mapping': 'Weiter zur Spaltenzuordnung',
  'csv.button.update-template': 'Vorlage aktualisieren',
  'csv.button.save-template': 'Als Vorlage speichern',
  'csv.button.back': 'Zurück',
  'csv.button.import-another': 'Importieren Sie eine andere Datei',
  'csv.button.view-account': 'Im Konto anzeigen',
  'csv.results.complete': 'Import abgeschlossen',
  'csv.results.failed': 'Import fehlgeschlagen',
  'csv.results.success.one':
    'Der {count} Trade wurde erfolgreich in das Konto {account} importiert',
  'csv.results.success.few':
    '{count} Trades erfolgreich importiert in das Konto: {account}',
  'csv.results.success.many':
    '{count} Trades erfolgreich importiert in das Konto: {account}',
  'csv.results.success.other':
    '{count} Trades erfolgreich importiert in das Konto: {account}',
  'csv.results.updated.one': 'Aktualisierter {count} bestehender Trade',
  'csv.results.updated.few': 'Bestehende {count} Trades aktualisiert',
  'csv.results.updated.many': 'Bestehende {count} Trades aktualisiert',
  'csv.results.updated.other': 'Bestehende {count} Trades aktualisiert',
  'csv.results.skipped.one':
    '{count} doppelter Trade übersprungen (bereits im Vault)',
  'csv.results.skipped.few':
    '{count} doppelte Trades übersprungen (bereits im Vault)',
  'csv.results.skipped.many':
    '{count} doppelte Trades übersprungen (bereits im Vault)',
  'csv.results.skipped.other':
    '{count} doppelte Trades übersprungen (bereits im Vault)',
  'csv.results.skipped-incomplete':
    'Übersprungene {count} unvollständige Zeile(n) (fehlende erforderliche Werte)',
  'csv.results.custom-field-warnings':
    '{count} ungültige benutzerdefinierte Feldwerte übersprungen',
  'csv.results.custom-field-warnings-header':
    'KLICKEN, UM WARNUNGEN ZU BENUTZERDEFINIERTEN FELDERN ANZUZEIGEN ({count})',
  'csv.results.broker': 'Broker: {broker}',
  'csv.results.manual-import': 'Manueller Import',
  'csv.results.preview-header':
    'Kürzlich importiertes Trades (zeigt {shown} von {total})',
  'csv.results.more-trades.one': 'und {count} weiterer Trade...',
  'csv.results.more-trades.few': 'und {count} weitere Trades...',
  'csv.results.more-trades.many': 'und {count} weitere Trades...',
  'csv.results.more-trades.other': 'und {count} weitere Trades...',
  'csv.results.errors-header': 'KLICKEN, UM FEHLER ANZUZEIGEN ({count})',
  'csv.results.discord-note':
    'Optional: Wenn Sie Hilfe benötigen, klicken Sie auf Bericht kopieren und fügen Sie ihn in Discord ein.',
  'csv.errors.copy-shareable': 'Gemeinsam nutzbaren Bericht kopieren',
  'csv.errors.copy-report': 'Bericht kopieren',
  'csv.errors.copy-detailed': 'Detaillierten Bericht kopieren',
  'csv.errors.copied': 'Kopiert',
  'csv.errors.rows': 'Zeilen: {rows}',
  'csv.errors.suggestion': 'Anregung:',
  'csv.errors.example': 'Beispiel:',
  'csv.errors.raw-errors': 'Rohe Fehler',
  'csv.errors.raw-errors-limit': 'Zeigt den ersten {shown} von {total}-Fehlern',
  'csv.errors.group.missing-value':
    'Fehlender erforderlicher Wert – {field} (Spalte „{column}“)',
  'csv.errors.group.missing-column':
    'Fehlende erforderliche Spalte – {field} (Spalte „{column}“)',
  'csv.errors.group.invalid-date':
    'Datum konnte nicht analysiert werden (Spalte „{column}“)',
  'csv.errors.group.invalid-number':
    'Ungültige Zahl – {field} (Spalte „{column}“)',
  'csv.errors.group.invalid-direction':
    'Ungültige Richtung (Spalte „{column}“)',
  'csv.errors.group.template-missing-mappings':
    'In der Vorlage fehlen erforderliche Spaltenzuordnungen',
  'csv.errors.group.batch-parsing-failed':
    'Die Stapelanalyse ist fehlgeschlagen',
  'csv.errors.group.no-valid-rows':
    'Es wurden keine gültigen Zeilen importiert',
  'csv.errors.group.no-trades-parsed':
    'Es konnten keine Trades analysiert werden',
  'csv.errors.group.close-only':
    'Nur Close-only-Ausführungen wurden übersprungen',
  'csv.errors.group.other': 'Andere Fehler',
  'csv.errors.suggestion.select-date-format':
    'Wählen Sie im Zuordnungsschritt ein Datumsformat aus und importieren Sie es erneut.',
  'csv.errors.suggestion.fix-numbers':
    'Überprüfen Sie, ob die Spaltenwerte numerisch sind (kein Text) und ob die richtige Spalte zugeordnet ist.',
  'csv.errors.suggestion.fix-direction':
    'Prüfen Sie, dass die Werte in der Richtungsspalte „Kauf/Verkauf“ lauten (oder ordnen Sie die richtige Spalte zu).',
  'csv.errors.suggestion.check-mapping':
    'Überprüfen Sie Ihre Spaltenzuordnungen und stellen Sie sicher, dass die erforderlichen Felder zugeordnet sind.',
  'csv.errors.suggestion.check-broker':
    'Prüfen Sie, dass Sie den richtigen Broker/die richtige Vorlage für diese CSV ausgewählt haben.',
  'csv.errors.suggestion.check-raw-errors':
    'Öffnen Sie Rohfehler für die genauen Meldungen und Zeilennummern.',
  'csv.report.title.shareable':
    'Journalit Trade Import – gemeinsam nutzbarer Bericht',
  'csv.report.title.detailed': 'Journalit Trade Import – Detaillierter Bericht',
  'csv.report.time': 'Zeit: {time}',
  'csv.report.plugin-version': 'Plugin-Version: {version}',
  'csv.report.file': 'Datei: {file}',
  'csv.report.account': 'Konto: {account}',
  'csv.report.broker': 'Broker: {broker}',
  'csv.report.template': 'Vorlage: {name}',
  'csv.report.csv-rows': 'CSV Zeilen: {count}',
  'csv.report.asset-type': 'Asset-Typ: {type}',
  'csv.report.date-format': 'Datumsformat: {format}',
  'csv.report.header-row': 'Kopfzeile: {row}',
  'csv.report.result': 'Ergebnis: {result}',
  'csv.report.imported': 'Importiert: {count}',
  'csv.report.updated': 'Aktualisiert: {count}',
  'csv.report.duplicates': 'Duplikate: {count}',
  'csv.report.skipped-incomplete':
    'Unvollständige Zeilen übersprungen: {count}',
  'csv.report.errors': 'Fehler: {count}',
  'csv.report.custom-field-warnings':
    'Benutzerdefinierte Feldwarnungen: {count}',
  'csv.report.sanitized-note':
    'Hinweis: Dies ist ein gemeinsam nutzbarer Bericht. Es können sensible Details weggelassen werden.',
  'csv.report.top-issues': 'Top-Themen:',
  'csv.report.issue-groups': 'Themengruppen:',
  'csv.report.raw-custom-field-warnings': 'Benutzerdefinierte Feldwarnungen:',
  'csv.report.raw-errors': 'Rohfehler:',
  'csv.report.more-errors': '...und {count} weitere Fehler',
  'csv.unmapped-symbols.title': 'Nicht zugeordnete Symbole erkannt',
  'csv.unmapped-symbols.desc-singular':
    'In Ihrem Import wurde ein Symbol ohne Gerätespezifikationen gefunden:',
  'csv.unmapped-symbols.desc-plural':
    'In Ihrem Import wurden {count}-Symbole ohne Gerätespezifikationen gefunden:',
  'csv.unmapped-symbols.map-label': 'Dem Basissymbol/Ticker zuordnen:',
  'csv.unmapped-symbols.placeholder': 'z. B. ES, NQ, GC',
  'csv.unmapped-symbols.warning':
    'Ordnen Sie diese Symbole integrierten Spezifikationen oder Ihren benutzerdefinierten Tickern zu. Ohne Spezifikationen verfügen Trades nicht über genaue Tick-Größen, Dollar pro Punkt oder P&L-Berechnungen.',
  'csv.unmapped-symbols.validation.not-found':
    'Das Symbol „{symbol}“ wurde in den {assetType}-Spezifikationen oder benutzerdefinierten Tickern nicht gefunden',
  'csv.unmapped-symbols.notice.fix-errors':
    'Bitte beheben Sie Validierungsfehler vor dem Speichern',
  'csv.unmapped-symbols.notice.save-failed':
    'Zuordnungen konnten nicht gespeichert werden',
  'csv.unmapped-symbols.button.saving': 'Sparen...',
  'csv.unmapped-symbols.button.save': 'Zuordnungen speichern',
  'csv.unmapped-symbols.button.skip': 'Überspringen',
  'csv.broker-guide.tradovate.step-1':
    'Navigieren Sie auf der Tradovate-Website zur Registerkarte „Berichte“.',
  'csv.broker-guide.tradovate.step-2':
    'Klicken Sie auf die Registerkarte „Orders“ (NICHT auf die Registerkarte „Leistung“).',
  'csv.broker-guide.tradovate.step-3':
    'Klicken Sie auf die Schaltfläche „CSV herunterladen“.',
  'csv.broker-guide.tradovate.warning.emphasis': 'Wichtig:',
  'csv.broker-guide.tradovate.warning.message':
    'Verwenden Sie nur die Registerkarte „Orders“. Die Registerkarte „Leistung“ ist nicht kompatibel.',
  'csv.broker-guide.tradovate.doc-label': 'Detaillierte Anleitung ansehen',
  'csv.broker-guide.ibkr.description':
    'Einmalige Einrichtung der Flex-Abfrage erforderlich',
  'csv.broker-guide.ibkr.step-1':
    'Navigieren Sie zu Leistung und Auszüge → Berichte → Flex-Abfragen',
  'csv.broker-guide.ibkr.step-2':
    'Erstellen Sie eine neue Abfrage „Trade-Bestätigung“ (Orders auswählen, Ausführungen abwählen)',
  'csv.broker-guide.ibkr.step-3':
    'Format einstellen: CSV, Datum „yyyyMMdd“, Uhrzeit „HHmmss“',
  'csv.broker-guide.ibkr.step-4':
    'Führen Sie die Abfrage aus und laden Sie die CSV-Datei herunter',
  'csv.broker-guide.ibkr.warning.emphasis': 'Muss Befehle verwenden',
  'csv.broker-guide.ibkr.warning.message':
    '(nicht Ausführungen) mit spezifischem Datums-/Uhrzeitformat',
  'csv.broker-guide.ibkr.doc-label':
    'Sehen Sie sich die detaillierte Einrichtungsanleitung an',
  'csv.broker-guide.tradezero.step-1':
    'Exportieren Sie die CSV-Datei von der TradeZero-Plattform',
  'csv.broker-guide.tradezero.step-2':
    'Überprüfen Sie, ob die Datei das CSV-Format hat (NICHT XLSX).',
  'csv.broker-guide.tradezero.step-3': 'Importieren Sie die Datei unten',
  'csv.broker-guide.tradezero.warning.emphasis':
    'Nur das CSV-Format wird unterstützt.',
  'csv.broker-guide.tradezero.warning.message':
    'Excel-Dateien (XLSX) funktionieren nicht.',
  'csv.broker-guide.tradezero.doc-label': 'Exportanweisungen anzeigen',
  'csv.broker-guide.tradingview.description': 'Nur Papierhandelskonto',
  'csv.broker-guide.tradingview.step-1':
    'Klicken Sie in TradingView auf den Brokertyp „Paper Trading“.',
  'csv.broker-guide.tradingview.step-2':
    'Klicken Sie auf die Schaltfläche „Daten exportieren…“.',
  'csv.broker-guide.tradingview.step-3':
    'Wählen Sie im Dropdown-Menü „Bestellverlauf“ aus',
  'csv.broker-guide.tradingview.warning.emphasis':
    'Muss den Bestellverlauf verwenden.',
  'csv.broker-guide.tradingview.warning.message':
    'Andere Exporttypen (z. B. Positionen oder Orders) funktionieren nicht für den Import.',
  'csv.broker-guide.tradingview.doc-label': 'Detaillierte Anleitung ansehen',
  'csv.broker-guide.bybit.description': 'USDT Perpetuals Trade Geschichte',
  'csv.broker-guide.bybit.step-1':
    'Gehen Sie zu Bybit → Orders → USDT Perpetual → Trade-Verlauf',
  'csv.broker-guide.bybit.step-2':
    'Klicken Sie auf die Schaltfläche „Exportieren“ und wählen Sie den Datumsbereich aus',
  'csv.broker-guide.bybit.step-3':
    'Laden Sie die Trade-Verlaufsdatei CSV herunter (NICHT geschlossene P&L)',
  'csv.broker-guide.bybit.warning.emphasis':
    'Verwenden Sie den Trade-Verlaufsexport.',
  'csv.broker-guide.bybit.warning.message':
    'Beim geschlossenen P&L-Export fehlen Provisionsdaten und einzelne Fills.',
  'csv.broker-guide.bybit.doc-label': 'Exportanweisungen anzeigen',
  'csv.broker-guide.blofin.description':
    'Export der Blofin-Order-Historie (nur Website)',
  'csv.broker-guide.blofin.step-1':
    'Gehen Sie zu Assets → Bestellcenter → Order-Historie',
  'csv.broker-guide.blofin.step-2':
    'Klicken Sie auf „Herunterladen“, wählen Sie „Futures“ und wählen Sie den Datumsbereich (maximal 180 Tage).',
  'csv.broker-guide.blofin.step-3':
    'Klicken Sie auf „Exportieren“ und warten Sie auf die Benachrichtigung, wenn Sie fertig sind',
  'csv.broker-guide.blofin.warning.emphasis': 'Nur Website.',
  'csv.broker-guide.blofin.warning.message':
    'Die mobile App unterstützt keine Exporte. Dateien sind nach dem Export 30 Tage lang verfügbar.',
  'csv.broker-guide.blofin.doc-label': 'Exportanweisungen anzeigen',
  'csv.broker-guide.hyperliquid.description': 'Perpetuals Trade Geschichte',
  'csv.broker-guide.hyperliquid.step-1': 'Wallet auf Hyperliquid verbinden',
  'csv.broker-guide.hyperliquid.step-2':
    'Klicken Sie unten auf der Seite auf die Registerkarte „Trade-Verlauf“.',
  'csv.broker-guide.hyperliquid.step-3':
    'Klicken Sie auf die Schaltfläche „Nach CSV exportieren“.',
  'csv.broker-guide.hyperliquid.warning.emphasis':
    'Limit von 10.000 Einträgen.',
  'csv.broker-guide.hyperliquid.warning.message':
    'Regelmäßig exportieren – ältere Trades mit mehr als 10.000 Einträgen können nicht abgerufen werden.',
  'csv.broker-guide.hyperliquid.doc-label': 'Exportanweisungen anzeigen',
  'csv.broker-guide.sierrachart.description': 'Futures Trades Listenexport',
  'csv.broker-guide.sierrachart.step-1':
    'Öffnen Sie das Trade-Aktivitätsprotokoll (Trade → Trade-Aktivitätsprotokoll oder Strg+Umschalt+A).',
  'csv.broker-guide.sierrachart.step-2':
    'Klicken Sie oben im Fenster auf die Registerkarte „Trades“.',
  'csv.broker-guide.sierrachart.step-3':
    'Stellen Sie bei Bedarf den Datumsbereich über die Schaltfläche [Anzeigeeinstellungen] ein',
  'csv.broker-guide.sierrachart.step-4':
    'Gehen Sie zu Datei → Protokoll speichern unter und speichern Sie es als TXT-Datei',
  'csv.broker-guide.sierrachart.warning.emphasis':
    'Verwenden Sie „Protokoll speichern unter“ und nicht „Exportieren“.',
  'csv.broker-guide.sierrachart.warning.message':
    'Die Export-Option speichert nicht angepasste Preise. Mit „Protokoll speichern unter“ bleiben die angezeigten Preise erhalten.',
  'csv.broker-guide.sierrachart.doc-label':
    'Sehen Sie sich die SierraChart-Dokumentation an',
  'csv.broker-guide.motivewave.description':
    'Exportieren Sie Ausführungen aus dem Kontobereich in MotiveWave.',
  'csv.broker-guide.motivewave.step-1':
    'Öffnen Sie den Bereich „Konto“ und wählen Sie die Registerkarte „Ausführungen“.',
  'csv.broker-guide.motivewave.step-2':
    'Klicken Sie über der Ausführungsliste auf das Symbol „Nach CSV exportieren“.',
  'csv.broker-guide.motivewave.step-3':
    'Legen Sie bei Bedarf den Datumsbereich „Ausführungen exportieren seit“ fest',
  'csv.broker-guide.motivewave.step-4':
    'Speichern Sie die CSV-Datei und importieren Sie sie hier',
  'csv.broker-guide.motivewave.warning.emphasis': 'Notiz:',
  'csv.broker-guide.motivewave.warning.message':
    'Einige Broker bieten nur eine begrenzte Ausführungshistorie an. Exportieren Sie regelmäßig oder nutzen Sie Ihr Brokerportal für ältere Trades.',
  'csv.broker-guide.motivewave.doc-label':
    'Sehen Sie sich die MotiveWave-Dokumentation an',
  'csv.broker-guide.fxreplay.step-1':
    'Öffnen Sie FX Replay – Analytics und wählen Sie die Sitzung oder den Datumsbereich aus',
  'csv.broker-guide.fxreplay.step-2':
    'Klicken Sie auf „Exportieren“ und wählen Sie CSV',
  'csv.broker-guide.fxreplay.step-3':
    'Laden Sie die Analyse CSV herunter und laden Sie sie hier hoch',
  'csv.broker-guide.fxreplay.warning.emphasis': 'Pro-Funktion:',
  'csv.broker-guide.fxreplay.warning.message':
    'CSV-Exporte sind auf der Analytics-Seite verfügbar und erfordern einen kostenpflichtigen Plan.',
  'csv.broker-guide.fxreplay.doc-label':
    'Öffnen Sie die FX Replay-Exportanleitung',
  'csv.broker-guide.atas.description':
    'Statistiken exportieren – Registerkarte „Journal“ (gepaarte Trades)',
  'csv.broker-guide.atas.step-1':
    'Öffnen Sie in ATAS die Registerkarte „Statistik“ und wählen Sie „Echtzeit“ oder „Verlauf“ (legen Sie bei Bedarf den Datumsbereich fest).',
  'csv.broker-guide.atas.step-2':
    'Klicken Sie auf das Zahnradsymbol (oben rechts) und wählen Sie „Statistiken exportieren“.',
  'csv.broker-guide.atas.step-3':
    'Laden Sie die exportierte XLSX-Datei hier hoch und wählen Sie ATAS in der Broker-Liste aus',
  'csv.broker-guide.atas.warning.emphasis': 'Wichtig:',
  'csv.broker-guide.atas.warning.message':
    'Bearbeiten Sie die exportierte Datei nicht. Journalit behält Trades aus dem Blatt „Journal“ bei und bereichert, sofern verfügbar, die Provision durch passende Fills aus dem Blatt „Ausführungen“.',
  'csv.broker-guide.atas.doc-label':
    'Sehen Sie sich die ATAS-Exportanweisungen an',
  'csv.broker-guide.rithmic.description':
    'R | Trader Pro-Export aus der Order-Historie / Abgeschlossenen Orders.',
  'csv.broker-guide.rithmic.step-1':
    'Order-Historie in R öffnen | Trader Pro und filtern Sie nach abgeschlossenen/erfüllten Aufträgen für Ihr Konto/Datum',
  'csv.broker-guide.rithmic.step-2':
    'Verwenden Sie „Spalten hinzufügen/entfernen“ und stellen Sie sicher, dass „Seite“, „Symbol“, „Fill-Menge“, „Durchschn. Fill-Preis“ und „Fill-/Aktualisierungszeit“ sichtbar sind',
  'csv.broker-guide.rithmic.step-3':
    'Klicken Sie auf das Symbol „Export/Zwischenablage“, um CSV zu speichern, laden Sie es dann hier hoch und wählen Sie Rithmic aus',
  'csv.broker-guide.rithmic.warning.emphasis': 'Wichtig:',
  'csv.broker-guide.rithmic.warning.message':
    'Rithmic exportiert nur sichtbare Spalten (und oft jeweils einen Tag). Fehlende Spalten können den Import unterbrechen.',
  'csv.broker-guide.rithmic.doc-label':
    'Ansicht R | Trader Pro Export-Komplettlösung',
  'csv.broker-guide.jdr.description':
    'MetaTrader HTML-Anweisungsexport (Bericht im MT4-Stil).',
  'csv.broker-guide.jdr.step-1':
    'Öffnen Sie in Ihrem JDR MetaTrader-Terminal die Registerkarte „Kontoverlauf/Verlauf“ für den Datumsbereich, den Sie importieren möchten',
  'csv.broker-guide.jdr.step-2':
    'Klicken Sie mit der rechten Maustaste in die Verlaufstabelle und wählen Sie Als Bericht speichern (HTML/HTM-Anweisung)',
  'csv.broker-guide.jdr.step-3':
    'Laden Sie die exportierte HTML-Erklärung hier hoch und wählen Sie JDR Securities Limited aus',
  'csv.broker-guide.jdr.warning.emphasis': 'Wichtig:',
  'csv.broker-guide.jdr.warning.message':
    'Verwenden Sie den Anweisungsexport HTML. Ausstehende/stornierte Orders werden automatisch ignoriert und MT5 HTML-Berichte werden noch nicht unterstützt.',
  'csv.broker-guide.jdr.doc-label':
    'Sehen Sie sich die Exportleitfäden für Broker an',
  'csv.date-format.auto-detect':
    'Automatische Erkennung (empfohlen für ISO-/Standardformate)',
  'csv.date-format.us-date': 'US-Datum: 25.12.2024 (Schwab, Fidelity, E*TRADE)',
  'csv.date-format.us-datetime':
    'US DatumUhrzeit: 25.12.2024 14:30:00 (Webull)',
  'csv.date-format.us-short': 'US Short: 05.01.2024 (TradeZero)',
  'csv.date-format.us-short-datetime':
    'US Short DatumUhrzeit: 05.01.2024 14:30:00',
  'csv.date-format.iso-datetime':
    'ISO DateTime: 25.12.2024 14:30:00 (Bybit, Tradovate)',
  'csv.date-format.iso-date': 'ISO-Datum: 25.12.2024 (Interaktive Broker)',
  'csv.date-format.eu-date': 'EU-Datum: 25.12.2024 (Tag/Monat/Jahr)',
  'csv.date-format.eu-datetime': 'EU-Datum/Uhrzeit: 25.12.2024 14:30:00',
  'csv.date-format.eu-dash': 'EU Dash: 25.12.2024',
  'csv.date-format.eu-dash-datetime': 'EU Dash DateTime: 25.12.2024 14:30:00',
  'upgrade.title': 'Upgrade auf Pro',
  'upgrade.feature-message':
    '{featureName} ist eine Pro-Funktion. Führen Sie ein Upgrade durch, um erweiterte Automatisierung und Funktionen freizuschalten.',
  'upgrade.benefits-title': 'Zu den Pro-Funktionen gehören:',
  'upgrade.benefit.csv': 'Trade Import mit KI-unterstützter Spaltenzuordnung',
  'upgrade.benefit.templates':
    'Unbegrenzte benutzerdefinierte Vorlagen und Vorlagenfreigabe',
  'upgrade.benefit.mt5': 'MetaTrader 5 automatische Synchronisierung',
  'upgrade.benefit.multi-account': 'Unterstützung mehrerer Konten',
  'upgrade.benefit.analytics': 'Erweiterte Analysen und Metriken',
  'upgrade.benefit.layouts': 'Benutzerdefinierte Dashboard-Layouts',
  'upgrade.trial-notice':
    'Holen Sie sich eine zweiwöchige kostenlose Testversion, um alle Ihre historischen Trades zu importieren und alle Pro-Funktionen risikofrei auszuprobieren.',
  'monthly.overview.cumulative-pnl': 'Monatlich kumulativ P&L',
  'monthly.overview.no-pnl-data': 'Keine P&L-Daten zum Anzeigen',
  'monthly.overview.no-pnl-data-sub':
    'Ihr kumulierter Gewinn/Verlust wird hier angezeigt, sobald Sie abgeschlossene Trades protokolliert haben',
  'monthly.overview.drawdown': 'Monatlicher Drawdown',
  'monthly.overview.no-drawdown-data':
    'Es können keine Drawdown-Daten angezeigt werden',
  'monthly.overview.no-drawdown-data-sub':
    'Ihre Drawdown-Kennzahlen werden hier angezeigt, sobald Sie geschlossene Trades protokolliert haben',
  'monthly.overview.performance': 'Monatliche Performance',
  'monthly.overview.net-pnl': 'Netto P&L',
  'monthly.overview.win-rate': 'Trefferquote',
  'monthly.overview.profit-factor': 'Gewinnfaktor',
  'monthly.overview.total-trades': 'Trades insgesamt',
  'monthly.overview.setup-performance': 'Setup-Performance',
  'monthly.overview.biggest-winner': 'Größter Gewinner von {month}',
  'monthly.overview.biggest-loser': 'Größter Verlierer von {month}',
  'monthly.overview.label-date': 'Datum:',
  'monthly.overview.label-setup': 'Setup:',
  'monthly.overview.view-trade-details': 'Trade-Details anzeigen',
  'monthly.overview.no-winning-trades':
    'Diesen Monat gab es keine erfolgreichen Trades',
  'monthly.overview.no-winning-trades-sub':
    'Ihre besten Trades werden hier angezeigt',
  'monthly.overview.no-losing-trades':
    'Keine verlorenen Trades in diesem Monat',
  'monthly.overview.no-losing-trades-sub':
    'Ihre schlechtesten Trades werden hier angezeigt',
  'monthly.overview.weekly-highlights': 'Wöchentliche Leistungshighlights',
  'monthly.overview.best-week': 'Woche mit der besten Leistung',
  'monthly.overview.worst-week': 'Woche mit der schlechtesten Leistung',
  'monthly.overview.week-number': 'Woche {number}',
  'monthly.overview.view-week': 'Woche anzeigen',
  'monthly.overview.long-performance': 'Long Nur Leistung',
  'monthly.overview.no-long-trades': 'Diesen Monat gibt es keine Long-Trades',
  'monthly.overview.no-long-trades-sub':
    'Ihre langfristige Trading-Performance wird hier angezeigt',
  'monthly.overview.short-performance': 'Short Nur Leistung',
  'monthly.overview.no-short-trades': 'Keine Leerverkäufe in diesem Monat',
  'monthly.overview.no-short-trades-sub':
    'Hier wird Ihre Short-Trade-Performance angezeigt',
  'monthly.overview.weekly-breakdown': 'Wöchentliche Aufschlüsselung',
  'monthly.overview.table-week': 'Woche',
  'monthly.overview.table-trades': 'Trades',
  'monthly.overview.table-win-rate': 'Gewinn %',
  'monthly.overview.table-profit-factor': 'Gewinnfaktor',
  'monthly.overview.table-pnl': 'P&L',
  'monthly.overview.week-abbrev': 'W{number}',
  'monthly.overview.no-weekly-data': 'Keine wöchentlichen Daten verfügbar',
  'monthly.overview.no-weekly-data-sub':
    'Hier wird Ihre wöchentliche Leistungsaufschlüsselung angezeigt',
  'settings.account-linking.title': 'Kontoverknüpfung ändern',
  'settings.account-linking.description':
    'Verschieben Sie alle Trades von einem MT-Konto auf ein anderes Obsidian-Konto',
  'settings.account-linking.source.title': 'Quell-MT-Konto',
  'settings.account-linking.source.description':
    'Wählen Sie das MT-Konto aus, dessen Trades Sie verschieben möchten',
  'settings.account-linking.source.placeholder': 'Quellkonto auswählen...',
  'settings.account-linking.target.title': 'Ziel-Obsidian-Konto',
  'settings.account-linking.target.description':
    'Wählen Sie das Obsidian-Konto aus, mit dem die Trades verknüpft werden sollen',
  'settings.account-linking.target.placeholder': 'Zielkonto auswählen...',
  'settings.account-linking.button.processing': 'Verarbeitung...',
  'settings.account-linking.button.relink': 'Konto erneut verknüpfen',
  'settings.account-linking.warning':
    'Dadurch werden alle synchronisierten Trades vom Quellkonto aktualisiert, um sie mit dem Zielkonto zu verknüpfen. Dieser Vorgang kann nicht rückgängig gemacht werden.',
  'settings.account-linking.success.relinked':
    'Erfolgreiche Neuverknüpfung der {count} Trades von {source} zu {target}',
  'settings.account-linking.error.select-both':
    'Bitte wählen Sie sowohl Quell- als auch Zielkonten aus',
  'settings.account-linking.error.source-not-found':
    'Quellkonto nicht gefunden',
  'settings.account-linking.error.target-not-found': 'Zielkonto nicht gefunden',
  'settings.account-linking.error.already-linked':
    'Dieses MT-Konto ist bereits mit dem ausgewählten Obsidian-Konto verknüpft',
  'settings.account-linking.error.service-manager':
    'Service-Manager nicht verfügbar',
  'settings.account-linking.error.backend-service':
    'Backend-Dienst nicht verfügbar',
  'settings.account-linking.error.relink-failed':
    'Konto konnte nicht erneut verknüpft werden: {error}',
  'account.type.demo': 'Demokonto',
  'account.type.evaluation': 'Auswertung',
  'account.type.funded': 'Gefördert',
  'account.type.archived': 'Archiviert',
  'account-page.error.title': 'Fehler beim Laden des Kontos',
  'account-page.error.not-found':
    'Kontodaten für „{accountName}“ konnten nicht gefunden werden.',
  'account-page.error.not-found-sub':
    'Bitte überprüfen Sie, ob das Konto vorhanden ist, oder versuchen Sie, die Seite zu aktualisieren.',
  'account-page.guide.empty.intro.title': 'Diese Seite ist ein Konto im Detail',
  'account-page.guide.empty.intro.description':
    'Verwenden Sie die Kontoseite, um ein Konto zu verwalten, Kontoereignisse aufzuzeichnen und die damit verbundenen Trades zu überprüfen.',
  'account-page.guide.empty.edit-account.title':
    '„Konto bearbeiten“ öffnet die vollständigen Kontoeinstellungen',
  'account-page.guide.empty.edit-account.description':
    'Verwenden Sie diese Schaltfläche, um den Kontonamen, den Typ, die Währung, die Drawdown-Regeln, das Gewinnziel, die monatlichen Kosten und mehr zu ändern.',
  'account-page.guide.empty.add-event.title':
    'Fügen Sie Ein- und Auszahlungen für Ereignisaufzeichnungen hinzu',
  'account-page.guide.empty.add-event.description':
    'Verwenden Sie diese Schaltfläche immer dann, wenn außerhalb normaler Trades Geld auf das Konto ein- oder abgebucht wird.',
  'account-page.guide.empty.transactions.title':
    'Ein- und Auszahlungen werden hier verfolgt',
  'account-page.guide.empty.transactions.description':
    'In diesem Abschnitt wird der Verlauf manueller Ein- und Auszahlungen gespeichert. Wenn es leer ist, verwenden Sie „Ereignis hinzufügen“, um das erste zu erstellen.',
  'account-page.guide.empty.trade-log.title':
    'Verknüpfte Trades werden hier angezeigt',
  'account-page.guide.empty.trade-log.description':
    'Trades werden hier angezeigt, wenn sie diesem Konto zugewiesen sind. Sobald Sie Trades verknüpft haben, wird diese Seite zu Ihrer vollständigen Kontoaufschlüsselung.',
  'account-page.guide.main.intro.title':
    'Diese Seite ist die Aufschlüsselung Ihres Kontos',
  'account-page.guide.main.intro.description':
    'Verwenden Sie die Kontoseite, um ein Konto klar zu verstehen: Kontostandverlauf, Leistung, Risikogrenzen, Cashflows und verknüpfte Trades.',
  'account-page.guide.main.balance-chart.title':
    'Das Bilanzdiagramm zeigt mehr als nur das Gleichgewicht',
  'account-page.guide.main.balance-chart.description':
    'Dieses Diagramm zeigt das Konto im Zeitverlauf, einschließlich Ein- und Auszahlungen sowie der von Ihnen für das Konto festgelegten Auszahlungs- und Gewinnzielniveaus.',
  'account-page.guide.main.metrics.title':
    'Diese Messwerte fassen nur dieses Konto zusammen',
  'account-page.guide.main.metrics.description':
    'Diese Zahlen werden aus den mit diesem Konto verknüpften Trades berechnet, sodass Sie dieses Konto selbst beurteilen können.',
  'account-page.guide.main.risk.title':
    'Der Risikofortschritt wird hier gesondert verfolgt',
  'account-page.guide.main.risk.description':
    'In diesem Abschnitt wird angezeigt, wie nah das Konto an seinem Drawdown-Limit oder Gewinnziel ist. Sie legen diese Regeln unter „Konto bearbeiten“ fest, die wir als Nächstes zeigen.',
  'account-page.guide.main.transactions.title':
    'Ein- und Auszahlungen bleiben in einem eigenen Bereich',
  'account-page.guide.main.transactions.description':
    'Jeder Eintrag hier kann später geprüft werden, sodass Sie Cashflows von der Trading-Performance trennen können.',
  'account-page.guide.main.trade-log.title':
    'Verknüpfte Trades öffnen die eigentliche Trade-Notiz',
  'account-page.guide.main.trade-log.description':
    'Klicken Sie auf einen verknüpften Trade, um den Trade selbst zu öffnen. Dadurch wird die Kontoseite zur Brücke zwischen der Review auf Kontoebene und einzelnen Trades.',
  'account-page.guide.main.add-event.title':
    'Fügen Sie Ein- und Auszahlungen für Ereignisaufzeichnungen hinzu',
  'account-page.guide.main.add-event.description':
    'Verwenden Sie diese Option immer dann, wenn außerhalb der normalen normalen Trading-Aktivität Geld hinzugefügt oder entfernt wird, damit der Kontoverlauf korrekt bleibt.',
  'account-page.guide.main.edit-account.title':
    '„Konto bearbeiten“ ändert die Kontoeinstellungen',
  'account-page.guide.main.edit-account.description':
    'Hier aktualisieren Sie die Kontodetails, Risikoregeln, den Drawdown und das Gewinnziel, falls sich diese im Laufe der Zeit ändern.',
  'account-dashboard.title': 'Konto-Dashboard',
  'account-dashboard.copy-badge.base': 'BASIS',
  'account-dashboard.copy-badge.copy': 'KOPIERER',
  'account-dashboard.copy-badge.copied-by': 'Kopiert von',
  'account-dashboard.copy-badge.copies-tooltip':
    'Kopiert {account} mit {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService wurde nach mehreren Versuchen nicht initialisiert',
  'account-dashboard.error.loading': 'Fehler beim Laden der Konten: {error}',
  'account-dashboard.error.retry':
    'AccountPageService nicht bereit, erneuter Versuch in {delay}ms (Versuch {attempt}/{max})',
  'account-dashboard.empty.title': 'Keine Konten gefunden',
  'account-dashboard.empty.message':
    'Erstellen Sie ein Konto, um Ihre Trading-Performance zu verfolgen',
  'account-dashboard.section.empty': 'Keine {type}-Konten',
  'account-dashboard.section.empty-sub':
    'Erstellen Sie ein Konto, um es hier anzuzeigen',
  'account-dashboard.button.create-first': 'Erstellen Sie Ihr erstes Konto',
  'account-dashboard.action.create': 'Neues Konto erstellen',
  'account-dashboard.action.settings': 'Einstellungen des Konto-Dashboards',
  'account-dashboard.weight-bar.aria': 'Kontotyp AUM-Verteilung',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: {percent} % des gesamten AUM',
  'account-dashboard.guide.empty.intro.title':
    'Auf dieser Seite sind alle Ihre Konten an einem Ort gespeichert',
  'account-dashboard.guide.empty.intro.description':
    'Verwenden Sie das Konto-Dashboard, um alle Ihre Konten zusammen anzuzeigen. Sobald Konten vorhanden sind, ist diese Seite die schnellste Möglichkeit, sie zu vergleichen.',
  'account-dashboard.guide.empty.state.title':
    'Hier gibt es noch nichts, da keine Konten vorhanden sind',
  'account-dashboard.guide.empty.state.description':
    'Das Dashboard bleibt leer, bis Sie Ihr erstes Konto erstellen. Danach werden auf jeder Kontoseite Kontosummen, Abschnitte und Verknüpfungen angezeigt.',
  'account-dashboard.guide.empty.create.title':
    'Erstellen Sie hier Ihr erstes Konto',
  'account-dashboard.guide.empty.create.description':
    'Klicken Sie auf diese Schaltfläche, um das erste Konto zu erstellen, das Journalit verfolgen soll.',
  'account-dashboard.guide.empty.after-create.title':
    'Nach dem Speichern öffnet Journalit die Kontoseite',
  'account-dashboard.guide.empty.after-create.description':
    'Geben Sie die grundlegenden Kontodaten ein und speichern Sie. Die nächste Anleitung finden Sie auf der Kontoseite für das jeweilige Konto.',
  'account-dashboard.guide.main.intro.title': 'Dies ist Ihr Konto-Dashboard',
  'account-dashboard.guide.main.intro.description':
    'Verwenden Sie diese Seite, um Konten zu vergleichen, die Gesamtsummen aller Konten anzuzeigen und zu einem einzelnen Konto zu springen, wenn Sie weitere Details benötigen.',
  'account-dashboard.guide.main.trade-filter.title':
    'Dieser Filter verändert das gesamte Dashboard',
  'account-dashboard.guide.main.trade-filter.description':
    'Verwenden Sie diesen Filter, um das Dashboard zwischen regulären Trades, Backtests oder beidem umzuschalten.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM bedeutet verwaltetes Vermögen',
  'account-dashboard.guide.main.aum-chart.description':
    'Dieses Diagramm verfolgt den Gesamtwert Ihres Kontos im Zeitverlauf, einschließlich Einzahlungen, Auszahlungen, Gewinnzielen und Drawdown-Limits auf Ihren Konten.',
  'account-dashboard.guide.main.metrics.title':
    'Diese Metriken fassen alle sichtbaren Konten zusammen',
  'account-dashboard.guide.main.metrics.description':
    'Verwenden Sie diese Statistiken für eine schnelle Momentaufnahme auf Kontoebene, bevor Sie näher auf bestimmte Kontotypen oder bestimmte Konten eingehen.',
  'account-dashboard.guide.main.sections.title':
    'Konten werden nach Kontotyp gruppiert',
  'account-dashboard.guide.main.sections.description':
    'Diese Abschnitte helfen Ihnen, ähnliche Konten miteinander zu vergleichen. Jede Karte ist anklickbar und öffnet die vollständige Seite für dieses Konto.',
  'account-dashboard.guide.main.create-account.title':
    'Sie können von hier aus jederzeit ein weiteres Konto erstellen',
  'account-dashboard.guide.main.create-account.description':
    'Verwenden Sie diese Schaltfläche, wenn Sie dem Dashboard ein neues Konto hinzufügen möchten.',
  'account-dashboard.guide.main.settings.title':
    'Die Einstellungen steuern, wie dieses Dashboard organisiert ist',
  'account-dashboard.guide.main.settings.description':
    'Öffnen Sie die Dashboard-Einstellungen, um Kontotypen, die Gesamtzahl und die Reihenfolge der Abschnitte zu verwalten.',
  'account-dashboard.guide.main.settings-types.title':
    'Die Einstellungen können verfügbare Kontotypen verwalten',
  'account-dashboard.guide.main.settings-types.description':
    'In den Einstellungen können Sie benutzerdefinierte Kontotypen hinzufügen und alte entfernen, wenn sich Ihr Workflow ändert.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Durch Einstellungen kann geändert werden, was in den Gesamtsummen zählt',
  'account-dashboard.guide.main.settings-inclusion.description':
    'Sie können Kontotypen aus den Dashboard-Summen ausblenden, ohne sie zu löschen, und Sie können separat entscheiden, ob ihre Abhebungen weiterhin berücksichtigt werden.',
  'account-dashboard.guide.main.settings-order.title':
    'Dieser Abschnitt steuert die Reihenfolge der Kontogruppen',
  'account-dashboard.guide.main.settings-order.description':
    'Mithilfe dieser Steuerelemente können Sie entscheiden, welche Kontotypen zuerst im Dashboard angezeigt werden.',
  'account-dashboard.guide.main.close-settings.title':
    'Schließen Sie die Einstellungen, um zum Dashboard zurückzukehren',
  'account-dashboard.guide.main.close-settings.description':
    'Schließen Sie dieses Modal, wenn Sie mit der Prüfung der Dashboard-Einstellungen fertig sind.',
  'account-dashboard.guide.main.open-account.title':
    'Öffnen Sie eine beliebige Kontokarte, um tiefer einzusteigen',
  'account-dashboard.guide.main.open-account.description':
    'Wenn Sie die vollständige Aufschlüsselung für ein Konto wünschen, öffnen Sie dessen Karte. Dort wird der Guide zur Kontoseite übernommen.',
  'account-dashboard.metrics.total-accounts': 'Gesamtkonten',
  'account-dashboard.metrics.total-aum': 'Gesamt-AUM',
  'account-dashboard.metrics.total-growth': 'Gesamtwachstum',
  'account-dashboard.metrics.growth-percent': 'Wachstum %',
  'account-dashboard.metrics.total-withdrawals': 'Gesamtabhebungen',
  'account-dashboard.metrics.no-withdrawals': 'Keine Abhebungen',
  'account-dashboard.metrics.total-trades': 'Trades insgesamt',
  'account-dashboard.type-header.excluded': 'Ausgeschlossen',
  'account-dashboard.type-header.from-stats': 'Aus Statistiken',
  'account-dashboard.type-header.of-total-aum': 'des gesamten AUM',
  'account-dashboard.type-header.aum': 'AUM',
  'account-dashboard.type-header.withdrawals': 'Auszahlungen',
  'account-dashboard.type-header.account': 'Konto',
  'account-dashboard.type-header.accounts': 'Konten',
  'account-dashboard.type-header.trade': 'Trade',
  'account-dashboard.type-header.trades': 'Trades',
  'account-dashboard.type-header.growth': 'Wachstum ({percent})',
  'account-card.status.breached': 'VERLETZT',
  'account-card.status.in-progress': 'IM GANGE',
  'account-card.status.achieved': 'ERREICHT',
  'account-card.metric.trades': 'Trades',
  'account-card.metric.withdrawals': 'Auszahlungen',
  'account-card.metric.age': 'Alter',
  'account-card.progress.profit-target': 'Gewinnziel',
  'account-card.progress.drawdown-used': 'Genutztes Drawdown-Limit',
  'account-card.progress.not-set': 'Nicht festgelegt',
  'account-card.footer.monthly': 'Monatlich:',
  'account-card.footer.total-costs': 'Gesamtkosten:',
  'account.chart.event.added': 'Konto hinzugefügt',
  'account.chart.event.archived': 'Konto archiviert',
  'account.balance-chart.empty': 'Keine Trades gefunden',
  'account.balance-chart.empty-sub':
    'Für dieses Konto sind keine Trading-Aktivitäten verfügbar',
  'account.aum-chart.empty': 'Keine Kontodaten',
  'account.aum-chart.empty-sub':
    'Fügen Sie Konten hinzu, um den AUM-Verlauf anzuzeigen',
  'chart.shared.empty': 'Keine Trades verfügbar',
  'chart.shared.empty-sub': 'Versuchen Sie, einen anderen Zeitraum auszuwählen',
  'account.link-modal.title': 'Neues Handelskonto erkannt',
  'account.link-modal.account-id': 'Konto-ID:',
  'account.link-modal.broker': 'Broker:',
  'account.link-modal.first-seen': 'Zuerst gesehen:',
  'account.link-modal.question': 'Wie möchten Sie mit diesem Konto umgehen?',
  'account.link-modal.option.new':
    'Erstellen Sie ein neues Konto mit einem benutzerdefinierten Namen',
  'account.link-modal.placeholder.custom-name': 'z. B. FTMO Challenge',
  'account.link-modal.account-type': 'Kontotyp:',
  'account.link-modal.option.existing': 'Link zum bestehenden Konto',
  'account.link-modal.no-accounts-available': '(keine Konten verfügbar)',
  'account.link-modal.select-account': 'Wählen Sie ein Konto aus...',
  'account.link-modal.no-existing-found':
    'Keine vorhandenen Konten gefunden. Erstellen Sie stattdessen ein neues Konto.',
  'account.link-modal.option.default':
    'Verwenden Sie den Standardnamen: Account-{id}',
  'account.link-modal.default-name': 'Konto-{id}',
  'account.link-modal.button.linking': 'Verlinkung...',
  'account.link-modal.notice.select-existing':
    'Bitte wählen Sie ein bestehendes Konto aus',
  'account.link-modal.notice.failed':
    'Konto konnte nicht verknüpft werden: {error}',
  'trade.review.title': 'Trade-Review',
  'trade.details.direction': 'Richtung',
  'trade.details.position-size': 'Positionsgröße',
  'trade.details.trading-costs': 'Handelskosten',
  'trade.details.entry-price': 'Einstiegspreis',
  'trade.details.exit-price': 'Ausstiegspreis',
  'trade.details.entry': 'Einstieg',
  'trade.details.exit': 'Ausstieg',
  'trade.details.size': 'Größe',
  'trade.details.duration': 'Dauer',
  'trade.details.instrument': 'Instrument',
  'trade.details.exit-time': 'Ausstiegszeit',
  'trade.details.entry-time': 'Einstiegszeit',
  'trade.details.title': 'Trade-Details',
  'trade.details.thesis': 'These',
  'trade.details.no-thesis': 'Für diesen Trade wurde keine These angegeben',
  'trade.details.add-thesis':
    'Klicken Sie auf „Bearbeiten“, um eine These hinzuzufügen',
  'trade.details.plan': 'Plan',
  'trade.details.risk': 'risk',
  'trade.details.execution': 'Execution',
  'trade.details.show-execution': 'Show breakdown',
  'trade.details.hide-execution': 'Hide breakdown',
  'trade.details.entries-summary': '{count} entries',
  'trade.details.exits-summary': '{count} exits',
  'trade.details.take-profit-count': '{count} targets',
  'trade.details.close-percent': '{percent}% close',
  'trade.metadata.account': 'Konto:',
  'trade.metadata.custom-tags': 'Benutzerdefinierte Tags:',
  'trade.metadata.setups': 'Setups',
  'trade.metadata.mistakes': 'Fehler',
  'trade.image.no-images': 'Keine Bilder für diesen Trade',
  'trade.image.click-edit':
    'Klicken Sie auf Bearbeiten, um Bilder hinzuzufügen',
  'trade.image.alt-prefix': 'Trade-Bild',
  'trade.review.mark-as-reviewed': 'Als geprüft markieren',
  'trade.review.reviewed': 'Bewertet',
  'trade.review.reviewed-on': 'Bewertet am {date}',
  'timeline.trade-type.regular': 'Trade',
  'timeline.trade-type.missed': 'Trade verpasst',
  'timeline.trade-type.backtest': 'Backtest-Trade',
  'timeline.status.open': 'Offen',
  'timeline.status.profit': 'Profitieren',
  'timeline.status.loss': 'Verlust',
  'timeline.status.breakeven': 'Break-even',
  'timeline.aria.trade-status': '{ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.aria.session-navigation': 'Same-day trade navigation',
  'timeline.aria.previous-trade': 'Previous trade: {trade}',
  'timeline.aria.next-trade': 'Next trade: {trade}',
  'timeline.aria.no-previous-trade': 'No previous trade in this trading day',
  'timeline.aria.no-next-trade': 'No next trade in this trading day',
  'timeline.title.current-trade':
    'Aktueller {tradeType}: {ticker} {tradeType} {tradeNumber}',
  'timeline.title.view-trade':
    'Anzeigen {ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.title.trade-still-open': 'Trade ist noch offen',
  'drc.trades.chart.cumulative-pnl': 'Kumulativ P&L',
  'drc.trades.chart.drawdown': 'Rückgang',
  'drc.trades.stats.title': 'Tägliche Trade-Statistiken',
  'drc.trades.stats.net-pnl': 'Netto P&L',
  'drc.trades.stats.win-rate': 'Trefferquote',
  'drc.trades.stats.profit-factor': 'Gewinnfaktor',
  'drc.trades.stats.expectancy': 'Erwartungswert',
  'drc.trades.stats.total-trades': 'Trades insgesamt',
  'drc.trades.stats.avg-win': 'Durchschnittlicher Gewinn',
  'drc.trades.stats.avg-loss': 'Durchschnittlicher Verlust',
  'drc.trades.stats.pl-ratio': 'P/L-Verhältnis',
  'drc.trades.log.title': 'Trade-Log',
  'drc.trades.log.empty': 'Für diesen Tag gibt es keine Trades',
  'drc.trades.log.empty-sub':
    'Trades wird hier angezeigt, sobald sie hinzugefügt wurden',
  'drc.trades.table.images': 'Bilder',
  'drc.trades.table.entry-exit-time': 'Ein-/Ausstiegszeit',
  'drc.trades.table.ticker': 'Ticker',
  'drc.trades.table.direction': 'Richtung',
  'drc.trades.table.setup': 'Setup',
  'drc.trades.table.pnl': 'P&L',
  'drc.trades.table.open': 'OFFEN',
  'drc.trades.table.na': 'N / A',
  'drc.trades.table.unknown': 'Unbekannt',
  'drc.trades.image.alt': 'Trade {id} Bild',
  'drc.trades.image.preview-alt': 'Vorschau Trade {id}',
  'drc.component-name': 'Tagesbericht',
  'drc.tab.preparation': 'Vorbereitung',
  'drc.tab.trades': 'Trades',
  'drc.tab.review': 'Review',
  'drc.preparation.support-levels': 'Unterstützungsstufen',
  'drc.preparation.resistance-levels': 'Widerstandsstufen',
  'drc.preparation.enter-price': 'Preisniveau eingeben',
  'drc.preparation.select-importance': 'Wählen Sie die Wichtigkeitsstufe aus',
  'drc.preparation.add-support': 'Unterstützungsstufe hinzufügen',
  'drc.preparation.add-resistance': 'Widerstandsstufe hinzufügen',
  'drc.preparation.remove-level': 'Ebene entfernen',
  'drc.preparation.no-support': 'Keine Unterstützungsstufen definiert',
  'drc.preparation.no-resistance': 'Keine Widerstandsstufen definiert',
  'drc.preparation.importance.none': 'Keiner',
  'drc.preparation.importance.high': 'Hoch',
  'drc.preparation.importance.medium': 'Medium',
  'drc.preparation.importance.low': 'Niedrig',
  'drc.preparation.checklist.title': 'Pre-Trade-Checkliste',
  'drc.preparation.checklist.empty': 'Keine Checklistenpunkte vor dem Trade',
  'drc.preparation.checklist.sub-apply':
    'Wenden Sie Checklistenelemente aus den Plugin-Einstellungen an',
  'drc.preparation.checklist.sub-add':
    'Fügen Sie Checklistenelemente in den Plugin-Einstellungen hinzu',
  'drc.preparation.bias.title': 'Marktverzerrung',
  'drc.preparation.bias.bullish': 'Bullisch',
  'drc.preparation.bias.bearish': 'Bärisch',
  'drc.preparation.bias.neutral': 'Neutral',
  'drc.preparation.bias.placeholder': 'Wählen Sie eine Marktausrichtung aus',
  'drc.preparation.goals.title': 'Tägliche Ziele',
  'drc.preparation.goals.empty': 'Keine Tagesziele vom Vortag',
  'drc.preparation.events.title': 'Wichtige Ereignisse',
  'drc.preparation.events.all-week': 'Die ganze Woche',
  'drc.preparation.events.empty': 'Keine wichtigen Ereignisse für heute',
  'drc.preparation.events.sub-empty':
    'Ereignisse können im Wochenrückblick hinzugefügt werden',
  'drc.preparation.forecast.title': 'Tägliche Vorhersage',
  'drc.preparation.media.title': 'Medienlinks',
  'drc.preparation.media.youtube': 'YouTube-Link',
  'drc.preparation.media.youtube-placeholder': 'Link zu Ihrem Tradingsstrom',
  'drc.preparation.error.service-unavailable': 'DRC-Service nicht verfügbar',
  'drc.preparation.error.image-upload': 'Fehler beim Hochladen des Bildes',
  'drc.missed-trades.title': 'Trades verpasst',
  'drc.missed-trades.loading': 'Verpasste Trades werden geladen...',
  'drc.missed-trades.error.service-unavailable':
    'Verpasster Trade-Service nicht verfügbar',
  'drc.missed-trades.error.load-failed':
    'Verpasste Trades konnten nicht geladen werden',
  'drc.missed-trades.error-prefix': 'Fehler: {error}',
  'drc.missed-trades.retry': 'Wiederholen',
  'drc.missed-trades.unknown': 'Unbekannt',
  'drc.missed-trades.no-setup': 'Kein Setup angegeben',
  'drc.missed-trades.badge': 'VERPASST',
  'drc.missed-trades.open-details-title': 'Details zum verpassten Trade öffnen',
  'drc.missed-trades.view-details': 'Details anzeigen →',
  'drc.missed-trades.label.setup': 'Setup:',
  'drc.missed-trades.label.reason': 'Grund:',
  'drc.missed-trades.add-button': '+ Verpassten Trade hinzufügen',
  'drc.missed-trades.add-title': 'Fügen Sie einen neuen verpassten Trade hinzu',
  'drc.missed-trades.empty': 'Keine verpassten Trades für heute',
  'drc.missed-trades.empty-sub':
    'Verfolgen Sie verpasste Trade-Gelegenheiten, um Ihre Ausführung zu verbessern',
  'missed-trade.reason-title': 'Warum ich diesen Trade verpasst habe',
  'missed-trade.reason-kicker': 'Verpasste Gelegenheit',
  'missed-trade.loading-navigation': 'Navigation wird geladen...',
  'drc.review.goal-placeholder': 'Ihr Ziel für die nächste Sitzung',
  'drc.review.no-questions':
    'Keine Reflexionsfragen definiert. Fügen Sie in den Einstellungen Review-Fragen hinzu.',
  'drc.review.answer-placeholder': 'Ihre Antwort...',
  'drc.review.mental-game': 'Mentales Spiel:',
  'drc.review.mental-game-aria': 'Mentaler Spielgrad',
  'drc.review.technical-game': 'Technisches Spiel:',
  'drc.review.technical-game-aria': 'Technische Spielqualität',
  'drc.review.end-of-day-review': 'Rückblick zum Tagesende',
  'drc.review.performance-grades': 'Leistungsstufen',
  'drc.review.reflection-questions': 'Reflexionsfragen',
  'drc.review.goals-for-next-session': 'Ziele für die nächste Sitzung',
  'drc.review.add-goal': 'Ziel hinzufügen',
  'drc.review.end-of-day-screenshots': 'Screenshots zum Tagesende',
  'drc.review.add-screenshots': 'Fügen Sie Screenshots hinzu',
  'drc.review.error.invalid-date':
    'Ungültiges DRC-Datumsformat. Bitte überprüfen Sie das Datum in Ihrer DRC-Notiz.',
  'settings.general.title': 'Allgemeine Einstellungen',
  'settings.general.docs': 'Dokumente',
  'settings.general.discord': 'Discord',
  'settings.general.github': 'GitHub',
  'settings.general.currency': 'Währung',
  'settings.general.currency-desc':
    'Wählen Sie die Währung aus, die für alle Geldwerte im gesamten Plugin angezeigt werden soll',
  'settings.general.currency-aria':
    'Wählen Sie die Währung zur Anzeige von Geldwerten aus',
  'settings.general.currency-changed':
    'Die Währung wurde in {currency} geändert. Alle Komponenten werden sofort aktualisiert!',
  'settings.general.currency-save-failed':
    'Die Währungseinstellung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  'settings.general.path-change.title':
    'Speicherort des Journalordners geändert',
  'settings.general.path-change.new-trades-title':
    'Neue Trades werden in Ihrem neuen Ordnerspeicherort erstellt',
  'settings.general.path-change.new-trades-desc':
    'Alle zukünftigen Trading-Journale werden Folgendes verwenden:',
  'settings.general.path-change.manual-title': 'Manuelle Aktion erforderlich:',
  'settings.general.path-change.manual-desc':
    'In Ihrem aktuellen Ordner befinden sich bestehende Trades. Um sie zu verschieben:',
  'settings.general.path-change.step.open-explorer':
    'Öffnen Sie den Datei-Explorer Ihres Vaults',
  'settings.general.path-change.step.find-folder-prefix': 'Finden Sie Ihr',
  'settings.general.path-change.step.find-folder-suffix': 'Ordner',
  'settings.general.path-change.step.drag-drop':
    'Ziehen Sie es bei Bedarf per Drag-and-Drop an Ihren neuen Speicherort',
  'settings.general.path-change.manual-note':
    'Dadurch haben Sie die volle Kontrolle darüber, wann und wie Ihre Dateien verschoben werden.',
  'settings.general.path-change.sync-title':
    'Aktualisierung der Synchronisierungszuordnung:',
  'settings.general.path-change.sync-desc':
    'Das Plugin aktualisiert Ihre Trade-Synchronisierungszuordnungen automatisch, um den neuen Ordnerpfad widerzuspiegeln. Dadurch wird sichergestellt, dass Ihre synchronisierten Trades mit ihren Backend-Datensätzen verbunden bleiben.',
  'settings.general.path-change.button.cancel': 'Abbrechen',
  'settings.general.path-change.button.confirm': 'Ich verstehe',
  'settings.general.display-name': 'Anzeigename',
  'settings.general.display-name-desc':
    'Optionaler Name, der in der Willkommensnachricht der Journalit-Ansicht angezeigt wird (z. B. „Guten Morgen, Alex“).',
  'settings.general.display-name-placeholder':
    'Neuen Anzeigenamen hinzufügen...',
  'settings.general.display-name-aria': 'Anzeigename für Willkommensnachricht',
  'settings.general.display-name-confirm-aria':
    'Bestätigen Sie die Änderung des Anzeigenamens',
  'settings.general.display-name-cancel-aria':
    'Änderung des Anzeigenamens abbrechen',
  'settings.general.display-name-saved': 'Anzeigename gespeichert als „{name}“',
  'settings.general.display-name-cleared': 'Anzeigename gelöscht',
  'settings.general.display-name-save-failed':
    'Anzeigename konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  'settings.general.display-privacy-section': 'Anzeige & Datenschutz',
  'settings.general.privacy-mode': 'Datenschutzmodus',
  'settings.general.privacy-mode-desc':
    'Maskiert sensible Trading-, Konto-, Preis- und Performance-Werte in der UI, ohne gespeicherte Daten zu ändern.',
  'settings.general.privacy-mode-aria': 'Datenschutzmodus umschalten',
  'dashboard.conversion.original-pnl': 'Ursprünglicher G/V',
  'dashboard.conversion.converted-pnl': 'Konvertierter G/V',
  'dashboard.conversion.details-label': 'Details zur Währungsumrechnung',
  'dashboard.conversion.requires-conversion':
    'P&L-Diagramme mit mehreren Währungen erfordern eine Wechselkursumrechnung.',
  'home.widget.profit-target-widget.name': 'Gewinnziel',
  'home.widget.profit-target-widget.description':
    'Verfolge Gewinnziel-Fortschritt über Konten',
  'form.ideal-exit.title': 'Ideale Exits',
  'form.ideal-exit.subtitle':
    'Rückblickende Teilverkäufe zur Ausführungsanalyse.',
  'form.ideal-exit.coverage': 'Ideale Größe',
  'form.ideal-exit.price': 'Idealer Preis',
  'form.ideal-exit.size': 'Größe',
  'form.ideal-exit.remove': 'Idealen Exit entfernen',
  'form.ideal-exit.add': '+ Idealen Exit hinzufügen',
  'form.ideal-exit.copy-actual': 'Tatsächliche Exits kopieren',

  'form.ideal-exit.tooltip':
    'Erfasse rückblickend den Exit-Plan, den du gern ausgeführt hättest. Unterstützt skalierte Exits für die Auswertung.',
  'form.ideal-exit.empty': 'Noch keine idealen Exits',
  'settings.general.home-view-settings': 'Home-Ansichtseinstellungen',
  'settings.general.home-auto-open': 'Automatisches Öffnen der Startansicht',
  'settings.general.home-auto-open-desc':
    'Wählen Sie aus, wann die Home-Ansicht automatisch geöffnet werden soll',
  'settings.general.home-auto-open-always':
    'Immer öffnen + fokussieren (Standard)',
  'settings.general.home-auto-open-ifnone':
    'Nur wenn keine aktive Datei vorhanden ist',
  'settings.general.home-auto-open-never': 'Niemals (nur manuell)',
  'settings.general.home-auto-open-aria':
    'Wählen Sie das Startverhalten des Hauses aus',
  'settings.general.home-startup-changed':
    'Das Startverhalten von Journalit wurde geändert in: {behavior}',
  'settings.general.filter-recent':
    'Filtern Sie „Letzte Elemente“ in Journalit-Dateien',
  'settings.general.filter-recent-desc':
    'Zeigen Sie im Widget „Letzte Elemente“ nur Journalit-bezogene Dateien an (Dateien im Ordner „.journalit“). Blendet alle anderen Vaultdateien aus der Liste der zuletzt verwendeten Elemente aus.',
  'settings.general.filter-recent-aria':
    'Filtern Sie aktuelle Elemente in Journalit-Dateien',
  'settings.general.filter-recent-toggled':
    'Aktuelle Elemente nach Journalit-Dateien {status} filtern',
  'settings.general.folder-section': 'Ordnerspeicherort und Bildpfade',
  'settings.general.journal-folder': 'Speicherort des Journalordners',
  'settings.general.journal-folder-desc':
    'Wählen Sie, wo Ihre Trading-Journale in Ihrem Vault gespeichert werden.',
  'settings.general.journal-folder-desc-2':
    'Lassen Sie das Feld leer, um den Standardspeicherort des Stammordners zu verwenden.',
  'settings.general.journal-folder-placeholder':
    'Benutzerdefinierten Ordner auswählen...',
  'settings.general.journal-folder-default':
    'Standard: Stammordner (!Journalit)',
  'settings.general.update-image-paths': 'Bildpfade aktualisieren',
  'settings.general.update-image-paths-desc':
    'Aktualisiert Bildpfade in allen Gewerken, sodass sie mit dem aktuellen Ordnerspeicherort übereinstimmen. Verwenden Sie dies, nachdem Sie Ihren !Journalit-Ordner manuell verschoben haben.',
  'settings.general.update-image-paths-updating': 'Aktualisierung...',
  'settings.general.update-image-paths-match':
    'Alle Bildpfade stimmen bereits mit dem aktuellen Ordnerspeicherort überein',
  'settings.general.folder-updated':
    'Journalordnerpfad aktualisiert. Neue Trades werden erstellt in: {path}',
  'settings.general.folder-update-failed':
    'Pfad konnte nicht aktualisiert werden: {error}',
  'settings.general.update-image-paths-success':
    'Bildpfade in {count} Trades erfolgreich aktualisiert',
  'settings.general.update-image-paths-no-update':
    'Es mussten keine Bildpfade aktualisiert werden',
  'settings.general.update-image-paths-errors':
    'Aktualisierte {updated}-Trades mit {failed}-Fehlern. Weitere Informationen finden Sie in der Konsole.',
  'settings.general.update-image-paths-failed':
    'Bildpfade konnten nicht aktualisiert werden. Weitere Informationen finden Sie in der Konsole.',
  'settings.general.trade-settings': 'Trade-Einstellungen',
  'settings.general.auto-open-trades': 'Automatisches Öffnen Erstellt Trades',
  'settings.general.auto-open-trades-desc':
    'Trade-Notizen werden automatisch in einem neuen Tab geöffnet, nachdem sie erstellt wurden',
  'settings.general.auto-open-trades-aria':
    'Erstellte Trades werden automatisch geöffnet',
  'settings.general.auto-open-toggled':
    'Erstellte Trades automatisch öffnen {status}',
  'settings.general.date-format': 'Datumsformat',
  'settings.general.date-format-desc':
    'Format zur Anzeige von Datumsangaben im gesamten Plugin',
  'settings.general.date-format-aria':
    'Wählen Sie das Datumsformat für Trade-Notizen aus',
  'settings.general.date-format-ddmmyy': 'TT/MM/JJ (31.12.23)',
  'settings.general.date-format-mmddyy': 'MM/TT/JJ (31.12.23)',
  'settings.general.date-format-yymmdd': 'JJ/MM/TT (23.12.31)',
  'settings.general.date-format-changed':
    'Das Datumsformat der Trade-Notiz wurde in {format} geändert',
  'settings.general.use-24-hour-time':
    'Verwenden Sie das 24-Stunden-Zeitformat',
  'settings.general.use-24-hour-time-desc':
    'Anzeige der Zeiten im 24-Stunden-Format (14:30) statt im 12-Stunden-AM/PM-Format (14:30 Uhr)',
  'settings.general.use-24-hour-time-aria':
    'Verwenden Sie das 24-Stunden-Zeitformat',
  'settings.general.skip-weekends': 'Wochenenden ausschließen',
  'settings.general.skip-weekends-desc':
    'Wenn aktiviert, behandelt Journalit Wochenenden im gesamten Plugin als handelsfreie Tage. Deaktiviere dies, wenn du samstags und sonntags tradest oder Aktivitäten überprüfst.',
  'settings.general.skip-weekends-aria':
    'Wochenenden in Journalit ausschließen',
  'settings.general.skip-weekends-toggled': 'Wochenend-Ausschluss {status}',
  'settings.general.week-start': 'Wochenstarttag',
  'settings.general.week-start-desc':
    'Wählen Sie den Tag, an dem Ihre Trading-Woche beginnt. Wirkt sich auf wöchentliche Reviews und Berichte aus.',
  'settings.general.week-start-aria': 'Wählen Sie den Starttag der Woche aus',
  'settings.general.week-start-changed':
    'Der Wochenstarttag wurde in {day} geändert',
  'settings.general.analytics-date-basis': 'Analytics-Datumsbasis',
  'settings.general.analytics-date-basis-desc':
    'Am besten für Swingtrader. Verwendet das Einstiegsdatum oder das finale Ausstiegsdatum für Analysen. Der Exit-Datumsmodus zählt nur geschlossene Trades und erfordert ein Exit-Datum für direkte PnL-Trades.',
  'settings.general.analytics-date-basis-aria':
    'Wählen Sie die Basis für das Analysedatum aus',
  'settings.general.analytics-date-basis-entry': 'Einstiegsdatum',
  'settings.general.analytics-date-basis-exit': 'Ausstiegsdatum',
  'settings.general.analytics-date-basis-changed':
    'Die Analytics-Datumsbasis wurde in {basis} geändert',
  'settings.general.dollar-value-input':
    'Geben Sie die Positionsgröße als Dollarwert ein',
  'settings.general.dollar-value-input-desc':
    'Wenn diese Option aktiviert ist, geben Sie die Positionsgröße als Dollarbetrag (z. B. 10.000 $) anstelle der Menge (Aktien/Lots/Kontrakte) ein. Die Menge wird automatisch aus dem Preis berechnet. Funktioniert am besten für Aktien; Futures/Forex haben Kontraktmultiplikatoren, die nicht berücksichtigt werden.',
  'settings.general.dollar-value-input-aria':
    'Geben Sie die Positionsgröße als Dollarwert ein',
  'settings.general.dollar-value-input-toggled':
    'Eingabe der Positionsgröße: {mode}',
  'settings.general.dollar-value': 'Dollarwert',
  'settings.general.quantity': 'Menge',
  'settings.general.mae-mfe-input-mode': 'MAE/MFE-Eingabemodus',
  'settings.general.mae-mfe-input-mode-desc':
    'Wählen Sie aus, wie die maximalen nachteiligen/günstigen Abweichungswerte in das Trade-Formular eingegeben werden sollen.',
  'settings.general.mae-mfe-input-mode-desc-price':
    'Preisstufen: Geben Sie den niedrigsten/höchsten Preis ein, der während des Trades erreicht wurde.',
  'settings.general.mae-mfe-input-mode-desc-dollar':
    'Dollarwerte: Geben Sie den maximalen Drawdown/Gewinn direkt in Dollar ein.',
  'settings.general.mae-mfe-input-mode-aria':
    'Wählen Sie den MAE/MFE-Eingabemodus',
  'settings.general.mae-mfe-input-mode-price': 'Preisniveaus',
  'settings.general.mae-mfe-input-mode-dollar': 'Dollarwerte',
  'settings.general.cutoff-time': 'Trading-Tag-Cutoff-Zeit',
  'settings.general.cutoff-time-desc':
    'Zeit, die das Ende eines Trading-Tages definiert. Trades nach dieser Zeit werden mit dem nächsten Tag gruppiert. (24-Stunden-Format, z. B. 23:30 für 23:30 Uhr)',
  'settings.general.cutoff-time-aria': 'Trading-Tags-Cutoff-Zeit',
  'settings.general.cutoff-time-changed':
    'Die Handelsschlusszeit wurde auf {time} geändert',
  'settings.general.break-even-threshold-mode':
    'Typ des Break-Even-Schwellenwerts',
  'settings.general.break-even-threshold-mode-desc':
    'Wählen Sie, ob die Break-even-Schwelle durch einen festen P&L-Bereich oder durch einen Prozentsatz des aktuellen Kontostands jedes Trade-Kontos bestimmt wird.',
  'settings.general.break-even-mode-fixed': 'Fester Betragsbereich',
  'settings.general.break-even-mode-percent':
    'Prozentsatz des aktuellen Kontostands',
  'settings.general.break-even-percent': 'Break-Even-Prozentsatz',
  'settings.general.break-even-percent-desc':
    'Symmetrischer Schwellenwert um Null (±X % des aktuellen Kontostands). Trades ohne auflösbaren Kontostand sind von der Gewinn-/Verluststatistiken ausgeschlossen.',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'Break-Even-Prozentsatz des aktuellen Kontostands',
  'settings.general.break-even-range': 'Break-Even-Bereich',
  'settings.general.break-even-range-desc':
    'Definieren Sie einen P&L-Bereich, um Trades als Break-Even zu betrachten. Wenn Sie beispielsweise „Min: -20“ und „Max: 20“ festlegen, werden Trades zwischen -20 und +20 $ als Break-Even behandelt. Setzen Sie beide auf 0, um nur genau 0,00 $ als Break-Even zu betrachten. Das Minimum muss kleiner oder gleich dem Maximum sein.',
  'settings.general.break-even-min-placeholder': 'Min',
  'settings.general.break-even-max-placeholder': 'Max',
  'settings.general.break-even-min-aria': 'Mindestens Break-Even-Bereich',
  'settings.general.break-even-max-aria': 'Maximaler Break-Even-Bereich',
  'settings.general.break-even-to': 'Zu',
  'settings.general.break-even-warning':
    'Warnung: Der Minimalwert ist größer als der Maximalwert. Dadurch wird verhindert, dass Trades als ausgeglichen eingestuft werden.',
  'settings.general.break-even-updated':
    'Break-Even-Bereich aktualisiert – Ansichten werden beim nächsten Laden aktualisiert',
  'settings.general.default-risk': 'Standard-Risikobetrag',
  'settings.general.default-risk-desc':
    'Für R-multiple-Berechnungen verwendeter Standard-Risikobetrag (in Kontowährung). Lassen Sie das Feld leer, um eine manuelle Eingabe pro Trade zu erfordern.',
  'settings.general.default-risk-aria': 'Standard-Risikobetrag',
  'settings.general.display-r-multiples': 'Anzeige R-Multiples',
  'settings.general.display-r-multiples-desc':
    'Zeigen Sie im gesamten Plugin R-multiple-Werte (Risiko-Ertrags-Verhältnisse) anstelle von Währungsbeträgen an',
  'settings.general.display-r-multiples-aria':
    'Zeigen Sie R-multiples in Trade-Ansichten an',
  'settings.general.display-r-multiples-toggled':
    'R-multiples Anzeige {status}',
  'settings.general.notification-settings': 'Benachrichtigungseinstellungen',
  'settings.general.sync-notifications': 'Benachrichtigungen synchronisieren',
  'settings.general.sync-notifications-desc':
    'Benachrichtigungen anzeigen, wenn Synchronisierungsvorgänge abgeschlossen sind',
  'settings.general.sync-notifications-aria':
    'Synchronisierungsbenachrichtigungen aktivieren',
  'settings.general.sync-notifications-toggled':
    'Benachrichtigungen synchronisieren {status}',
  'settings.general.new-trade-notifications': 'Neue Trade-Benachrichtigungen',
  'settings.general.new-trade-notifications-desc':
    'Benachrichtigungen anzeigen, wenn neue Trade-Dateien erkannt werden',
  'settings.general.new-trade-notifications-aria':
    'Aktivieren Sie neue Trade-Benachrichtigungen',
  'settings.general.new-trade-notifications-toggled':
    'Neue Trade-Benachrichtigungen {status}',
  'settings.general.update-notifications': 'Update-Benachrichtigungen anzeigen',
  'settings.general.update-notifications-desc':
    'Zeigen Sie eine Benachrichtigung an, wenn ein neues Plugin-Update verfügbar ist',
  'settings.general.update-notifications-aria':
    'Update-Benachrichtigungen anzeigen',
  'settings.general.update-notifications-toggled':
    'Update-Benachrichtigungen {status}',
  'settings.general.data-management': 'Datenmanagement & Datenschutz',
  'settings.general.backup-restore-section':
    'Sicherung, Wiederherstellung & Zurücksetzen',
  'settings.general.export-settings': 'Exporteinstellungen',
  'settings.general.export-settings-desc':
    'Laden Sie alle Plugin-Einstellungen als JSON-Datei herunter, um sie zu sichern oder in einen anderen Vault zu übertragen',
  'settings.general.export-settings-exporting': 'Exportieren...',
  'settings.general.import-settings': 'Einstellungen importieren',
  'settings.general.import-settings-desc':
    'Stellen Sie die Einstellungen aus einer zuvor exportierten JSON-Datei wieder her. Die Einstellungen werden mit den aktuellen Werten zusammengeführt.',
  'settings.general.import-settings-importing': 'Importieren...',
  'settings.general.reset-to-defaults':
    'Auf Standardeinstellungen zurücksetzen',
  'settings.general.reset-to-defaults-desc':
    'Setzen Sie alle Plugin-Einstellungen auf ihre Standardwerte zurück. Es wird automatisch ein Backup erstellt.',
  'settings.general.reset-to-defaults-warning':
    'Warnung: Dadurch werden alle benutzerdefinierten Optionen, Kontoeinstellungen und Layouts entfernt.',
  'settings.general.reset-to-defaults-resetting': 'Zurücksetzen...',
  'settings.general.enabled': 'ermöglicht',
  'settings.general.disabled': 'deaktiviert',
  'settings.customization.title': 'Anpassung',
  'settings.customization.description':
    'Passen Sie Optionen, Erscheinungsbild und Verhalten des Journalit-Plugins an.',
  'settings.customization.trade-form-layout.description':
    'Wähle aus, welche Felder und Abschnitte im Trade-Formular angezeigt werden.',
  'settings.customization.trade-form-layout.button': 'Layout anpassen',
  'settings.customization.tickers-symbols': 'Ticker/Symbole',
  'settings.customization.symbol-mappings': 'Symbolzuordnungen',
  'settings.customization.account-types': 'Kontotypen',
  'settings.customization.setups': 'Setups',
  'settings.customization.mistakes': 'Fehler',
  'settings.customization.tags': 'Schlagworte',
  'settings.customization.events': 'Veranstaltungen',
  'settings.customization.custom-fields': 'Benutzerdefinierte Trade-Felder',
  'settings.customization.options.confirm.update-notes':
    'OK (Notizen aktualisieren)',
  'settings.customization.options.confirm.save-name': 'Nur Namen speichern',
  'settings.customization.options.confirm.cancel': 'Aktion abbrechen',
  'settings.customization.options.type.tickers': 'Ticker',
  'settings.customization.options.type.accounts': 'Konten',
  'settings.customization.options.type.account-types': 'Kontotypen',
  'settings.customization.options.type.setups': 'Setups',
  'settings.customization.options.type.mistakes': 'Fehler',
  'settings.customization.options.type.tags': 'Schlagworte',
  'settings.customization.options.type.events': 'Veranstaltungen',
  'settings.customization.options.asset-type.cfd': 'CFD',
  'settings.customization.options.notice.empty-name':
    'Der Optionsname darf nicht leer sein',
  'settings.customization.options.notice.invalid-ticker':
    'Ungültiges Tickerformat. Es sind nur Buchstaben, Zahlen und Punkte zulässig.',
  'settings.customization.options.notice.added':
    'Option „{newValue}“ zu {type} hinzugefügt',
  'settings.customization.options.notice.duplicate':
    'Doppelte Option: {newValue} existiert bereits',
  'settings.customization.options.notice.asset-type-required':
    'Für Instrumente ist ein Vermögenswerttyp erforderlich',
  'settings.customization.options.notice.updated-with-notes':
    'Aktualisierte Option von „{oldValue}“ auf „{newValue}“ und aktualisierte {count}-Hinweise',
  'settings.customization.options.notice.updated':
    'Aktualisierte Option von „{oldValue}“ auf „{newValue}“',
  'settings.customization.options.confirm.rename-message':
    'Möchten Sie alle vorhandenen Notizen, die „{oldValue}“ verwenden, aktualisieren, um stattdessen „{newValue}“ zu verwenden?\n\nDadurch werden alle Notizen durchsucht und der Optionswert aktualisiert, wo immer er gefunden wird.',
  'settings.customization.options.notice.cannot-delete-archived':
    'Der Kontotyp „Archiviert“ kann nicht gelöscht werden – er ist für die Archivierung von Konten reserviert',
  'settings.customization.options.confirm.remove-message':
    'Sind Sie sicher, dass Sie „{option}“ entfernen möchten? Dies kann nicht rückgängig gemacht werden.',
  'settings.customization.options.notice.removed': 'Option „{option}“ entfernt',
  'settings.customization.options.notice.remove-failed':
    'Das Entfernen der Option ist fehlgeschlagen',
  'settings.customization.options.confirm.reset-message':
    'Sind Sie sicher, dass Sie alle {type} auf die Standardoptionen zurücksetzen möchten? Dies kann nicht rückgängig gemacht werden.',
  'settings.customization.options.notice.reset-success':
    'Setzen Sie {type} auf die Standardoptionen zurück',
  'settings.customization.options.notice.no-options-to-reset':
    'Die Standardoptionen {type} werden bereits verwendet',
  'settings.customization.options.notice.mapping-symbols-required':
    'Beide Symbole sind erforderlich',
  'settings.customization.options.notice.mapping-added':
    'Zuordnung hinzugefügt: {imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    'Zuordnung konnte nicht hinzugefügt werden',
  'settings.customization.options.notice.mapping-deleted':
    'Zuordnung gelöscht: {symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    'Die Zuordnung konnte nicht gelöscht werden',
  'settings.customization.options.empty-state':
    'Es wurden noch keine benutzerdefinierten {type} hinzugefügt.',
  'settings.customization.options.label.save-changes': 'Änderungen speichern',
  'settings.customization.options.label.cancel-editing':
    'Bearbeitung abbrechen',
  'settings.customization.options.label.edit-option': 'Bearbeiten Sie {option}',
  'settings.customization.options.label.remove-option':
    'Entfernen Sie {option}',
  'settings.customization.options.placeholder.select-asset':
    'Wählen Sie den Asset-Typ aus...',
  'settings.customization.options.field.pip-size': 'Kerngröße',
  'settings.customization.options.field.priority': 'Priorität:',
  'settings.customization.options.field.default-event-notes':
    'Standard-Ereignisnotizen:',
  'settings.customization.options.placeholder.default-event-notes':
    'Notizen, die automatisch eingefügt werden, wenn dieses Ereignis ausgewählt wird',
  'settings.customization.options.aria.confirm-add':
    'Bestätigen Sie das Hinzufügen von {type}',
  'settings.customization.options.label.locked': 'Gesperrt',
  'settings.customization.options.label.archived-reserved':
    'Archiviert (reserviert)',
  'settings.customization.options.aria.reset-all':
    'Entfernen Sie alle benutzerdefinierten {type}',
  'settings.customization.options.button.reset-all':
    'Alles zurücksetzen {type}',
  'settings.customization.options.placeholder.new-name': 'Neuer {type}-Name',
  'settings.customization.options.placeholder.dollar-per-point': '$/Punkt',
  'settings.customization.options.placeholder.tick-size': 'Zeckengröße',
  'settings.customization.options.placeholder.tick-value': 'Tick-Wert',
  'settings.customization.options.placeholder.lot-size': 'Lot-Größe',
  'settings.customization.options.placeholder.pip-value': 'Pip-Wert',
  'settings.customization.options.placeholder.pip-size': 'Kerngröße',
  'settings.customization.options.field.optional': '(optional)',
  'settings.customization.options.mapping.description':
    'Ordnet vertragsspezifische Symbole (z. B. NQZ5) Basissymbolen (z. B. NQ) für die automatische Spezifikationssuche zu',
  'settings.customization.options.mapping.auto-detected': 'Automatisch erkannt',
  'settings.customization.options.mapping.manual': 'Handbuch',
  'settings.customization.options.mapping.created-at': 'Erstellt {date}',
  'settings.customization.options.mapping.no-mappings':
    'Noch keine Symbolzuordnungen. Zuordnungen werden bei Trade Importen automatisch erstellt, wenn Vertragssymbole erkannt werden.',
  'settings.customization.options.mapping.placeholder-imported':
    'Importiertes Symbol (z. B. NQZ5)',
  'settings.customization.options.mapping.placeholder-base':
    'Basissymbol (z. B. NQ)',
  'settings.customization.options.mapping.button-add': 'Zuordnung hinzufügen',
  'settings.customization.options.placeholder.add-new':
    'Neues {type} hinzufügen',
  'settings.customization.options.aria.delete-mapping': 'Zuordnung löschen',
  'settings.customization.options.instrument.specs-futures':
    '${dollar}/pt, {tick} Tick, ${value} Tickwert',
  'settings.customization.options.instrument.specs-forex':
    '{lot} Lot, ${pip} Pip-Wert, {size} Pip-Größe',
  'settings.customization.options.instrument.built-in': '(eingebaut)',
  'settings.customization.options.instrument.mapped-to':
    'Zugeordnet zu {base} (verwendet die Spezifikationen von {base})',
  'settings.customization.options.instrument.no-specs':
    '(Keine Spezifikationen festgelegt)',
  'settings.loss-review.field.content': 'Inhalt',
  'settings.loss-review.field.checkbox-label': 'Kontrollkästchen-Beschriftung',
  'settings.loss-review.field.placeholder-text': 'Platzhaltertext',
  'settings.loss-review.field.checkbox-items': 'Checklistenelemente',
  'settings.loss-review.field.section-title': 'Abschnittstitel',
  'settings.loss-review.field.section-type': 'Abschnittstyp',
  'settings.loss-review.placeholder.header-content':
    'Kopfinhalt eingeben (unterstützt Markdown)',
  'settings.loss-review.placeholder.checkbox-label':
    'Beschriftung des Kontrollkästchens eingeben (unterstützt Markdown)',
  'settings.loss-review.placeholder.textarea-placeholder':
    'Geben Sie Platzhaltertext für den Textbereich ein',
  'settings.loss-review.placeholder.checkbox-item':
    'Kontrollkästchenelement eingeben (unterstützt Markdown)',
  'settings.loss-review.placeholder.section-title':
    'Geben Sie den Abschnittstitel ein',
  'settings.loss-review.untitled-section': 'Abschnitt ohne Titel',
  'settings.loss-review.type.header': 'Kopfzeile',
  'settings.loss-review.type.checkbox': 'Einzelnes Kontrollkästchen',
  'settings.loss-review.type.textarea': 'Textbereich',
  'settings.loss-review.type.checkbox-list': 'Checkbox-Liste',
  'button.remove': 'Entfernen',
  'button.add-item': 'Element hinzufügen',
  'button.move-up': 'Bewegen Sie sich nach oben',
  'button.move-down': 'Bewegen Sie sich nach unten',
  'button.remove-section': 'Abschnitt entfernen',
  'settings.customization.custom-fields.description':
    'Erstellen Sie benutzerdefinierte Felder, die auf der Registerkarte „Erweitert“ des Trade-Formulars angezeigt werden. Diese Felder werden im Frontmatter Ihres Trades gespeichert.',
  'settings.customization.custom-fields.title':
    'Benutzerdefinierte Felder ({count})',
  'settings.customization.custom-fields.manage-desc':
    'Verwalten Sie Ihre benutzerdefinierten Trade-Formularfelder',
  'settings.customization.custom-fields.type-dropdown': 'Runterfallen',
  'settings.customization.custom-fields.type-multiselect': 'Mehrfachauswahl',
  'settings.customization.custom-fields.type-suffix': 'Feld',
  'settings.customization.custom-fields.option-count.one': '{count}-Option',
  'settings.customization.custom-fields.option-count.few': '{count}-Optionen',
  'settings.customization.custom-fields.option-count.many': '{count}-Optionen',
  'settings.customization.custom-fields.option-count.other': '{count}-Optionen',
  'settings.customization.custom-fields.no-fields':
    'Noch keine benutzerdefinierten Felder definiert',
  'settings.customization.custom-fields.no-fields-desc':
    'Benutzerdefinierte Felder werden auf der Registerkarte „Erweitert“ des Trade-Formulars angezeigt und in der Startseite Ihrer Trade-Notizen gespeichert.',
  'settings.customization.custom-fields.add-new': 'Neues Feld hinzufügen',
  'settings.customization.custom-fields.edit-field': 'Feld bearbeiten',
  'settings.customization.custom-fields.edit-field-with-name':
    '„{fieldLabel}“ bearbeiten',
  'settings.customization.custom-fields.configure-desc':
    'Konfigurieren Sie unten Ihre benutzerdefinierten Feldeinstellungen',
  'settings.customization.custom-fields.actions': 'Aktionen',
  'settings.customization.custom-fields.actions-desc':
    'Verwalten Sie Ihre benutzerdefinierten Felder',
  'settings.customization.custom-fields.add-button':
    'Benutzerdefiniertes Feld hinzufügen',
  'settings.customization.custom-fields.delete-all-button':
    'Alle Felder löschen',
  'settings.customization.custom-fields.editor.title': 'Feldkonfiguration',
  'settings.customization.custom-fields.editor.label': 'Feldbezeichnung',
  'settings.customization.custom-fields.editor.label-desc':
    'Anzeigename für dieses Feld',
  'settings.customization.custom-fields.editor.label-placeholder':
    'Geben Sie die Feldbezeichnung ein',
  'settings.customization.custom-fields.editor.key': 'Frontmatter-Schlüssel',
  'settings.customization.custom-fields.editor.key-desc':
    'Dieser Schlüssel erscheint in Ihr Tradingsdateien:',
  'settings.customization.custom-fields.editor.key-placeholder': 'Feldname',
  'settings.customization.custom-fields.editor.key-reserved':
    '⚠️ Reservierter Feldname',
  'settings.customization.custom-fields.editor.type': 'Feldtyp',
  'settings.customization.custom-fields.editor.type-desc':
    'Art des Eingabefeldes',
  'settings.customization.custom-fields.editor.placeholder': 'Platzhaltertext',
  'settings.customization.custom-fields.editor.placeholder-desc':
    'Optionaler Platzhaltertext, der im leeren Feld angezeigt wird',
  'settings.customization.custom-fields.editor.placeholder-input':
    'Geben Sie einen Platzhaltertext ein',
  'settings.customization.custom-fields.editor.trade-log': 'Trade-Log',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'Steuern Sie, wie dieses Feld angezeigt wird, wenn es als Trade-Log-Spalte hinzugefügt wird',
  'settings.customization.custom-fields.editor.column-label':
    'Trade-Log-Spaltenbezeichnung',
  'settings.customization.custom-fields.editor.column-label-desc':
    'Optionale kürzere Bezeichnung, die nur im Trade-Log-Header verwendet wird',
  'settings.customization.custom-fields.editor.column-label-placeholder':
    'Verwenden Sie standardmäßig die Feldbezeichnung',
  'settings.customization.custom-fields.editor.display-as-currency':
    'Als Währung anzeigen',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Formatiert dieses Zahlenfeld nur im Trade Log als Währungswert',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'Dropdown-Sortiermodus',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'Standardmäßig deaktiviert. Aktivieren Sie die Sortierung nur, wenn dieses Dropdown-Menü eine sinnvolle Reihenfolge hat.',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'Deaktiviert',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'Alphabetisch',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'Numerisch',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'Konfigurierte Optionsreihenfolge',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'Reduzierte Anzeige',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'Wählen Sie aus, wie Multiselect-Werte gerendert werden sollen, wenn der Trade-Log-Erweiterungsmodus deaktiviert ist',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'Zählabzeichen',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'Werteliste',
  'settings.customization.custom-fields.editor.validation': 'Validierung',
  'settings.customization.custom-fields.editor.validation-desc':
    'Feldvalidierungsregeln',
  'settings.customization.custom-fields.editor.validation.required':
    'Erforderliches Feld',
  'settings.customization.custom-fields.editor.validation.required-desc':
    'Machen Sie dieses Feld zu einem Pflichtfeld',
  'settings.customization.custom-fields.editor.validation.min-length':
    'Mindestlänge',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    'Mindestanzahl an Zeichen',
  'settings.customization.custom-fields.editor.validation.no-min':
    'Kein Minimum',
  'settings.customization.custom-fields.editor.validation.max-length':
    'Maximale Länge',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    'Maximale Anzahl von Zeichen',
  'settings.customization.custom-fields.editor.validation.no-max':
    'Kein Maximum',
  'settings.customization.custom-fields.editor.validation.min-value':
    'Mindestwert',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    'Mindestens zulässige Anzahl',
  'settings.customization.custom-fields.editor.validation.max-value':
    'Maximaler Wert',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    'Maximal zulässige Anzahl',
  'settings.customization.custom-fields.editor.options': 'Optionen',
  'settings.customization.custom-fields.editor.options-desc':
    'Verfügbare Optionen für dieses Feld',
  'settings.customization.custom-fields.editor.add-option':
    'Neue Option hinzufügen',
  'settings.customization.custom-fields.editor.add-option-desc':
    'Geben Sie eine neue Auswahl ein',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    'Geben Sie eine neue Option ein',
  'settings.customization.custom-fields.editor.allow-create':
    'Erlauben Sie das Erstellen neuer Optionen',
  'settings.customization.custom-fields.editor.allow-create-desc':
    'Benutzer können neue Optionen erstellen, wenn sie dieses Feld in Trade-Formularen verwenden',
  'settings.customization.custom-fields.editor.save': 'Feld speichern',
  'settings.customization.custom-fields.editor.delete': 'Feld löschen',
  'settings.customization.custom-fields.type.text': 'Text',
  'settings.customization.custom-fields.type.number': 'Nummer',
  'settings.customization.custom-fields.type.date': 'Datum',
  'settings.customization.custom-fields.type.datetime': 'Datum und Uhrzeit',
  'settings.customization.custom-fields.type.time': 'Zeit',
  'settings.customization.custom-fields.error.cannot-save':
    'Feld kann nicht gespeichert werden: {error}',
  'settings.customization.custom-fields.error.duplicate-key':
    'Ein Feld mit diesem Frontmatter-Schlüssel existiert bereits',
  'settings.customization.custom-fields.error.save-failed':
    'Feld konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  'settings.customization.custom-fields.notice.import-summary':
    'Importierte gültige {validCount}-Felder aus der {totalCount}-Gesamtzahl',
  'settings.customization.custom-fields.delete.confirm-message':
    'Sind Sie sicher, dass Sie das benutzerdefinierte Feld „{fieldLabel}“ löschen möchten?',
  'settings.customization.custom-fields.delete.cannot-undo':
    'Diese Aktion kann nicht rückgängig gemacht werden.',
  'settings.customization.custom-fields.reset.confirm-message':
    'Sind Sie sicher, dass Sie ALLE benutzerdefinierten Felder löschen möchten?',
  'settings.customization.custom-fields.saved-options.title':
    'Gespeicherte benutzerdefinierte Optionen',
  'settings.customization.custom-fields.saved-options.description':
    'Verwalten Sie Optionen, die Benutzer für benutzerdefinierte Felder erstellt haben',
  'settings.customization.custom-fields.saved-options.delete-error':
    'Option konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.',
  'settings.customization.custom-fields.saved-options.clear-error':
    'Optionen konnten nicht gelöscht werden. Bitte versuchen Sie es erneut.',
  'settings.customization.custom-fields.option.delete-confirm':
    'Sind Sie sicher, dass Sie die Option „{optionName}“ löschen möchten?',
  'settings.customization.custom-fields.option.clear-confirm':
    'Sind Sie sicher, dass Sie ALLE gespeicherten Optionen für „{fieldLabel}“ löschen möchten?',
  'onboarding.welcome.title': 'Willkommen bei Journalit',
  'onboarding.welcome.subtitle':
    'Besitzen Sie Ihre Trading-Daten. Gestalten Sie Ihren eigenen Workflow.',
  'onboarding.welcome.cta': 'Legen Sie los',
  'onboarding.welcome.chart.week': 'Woche {count}',
  'onboarding.view.title': 'Journalit Onboarding',
  'onboarding.welcome.discover-heading': 'Was Sie entdecken werden:',
  'onboarding.welcome.tagline':
    'Wir sorgen für die Einrichtung in weniger als 60 Sekunden',
  'onboarding.welcome.insight.win-rate.title': 'Win Ratenanalyse',
  'onboarding.welcome.insight.win-rate.content':
    '„Ihre Breakout-Setups haben eine Win Rate von 82 % gegenüber 67 % bei Pullbacks.“',
  'onboarding.welcome.insight.timing.title': 'Timing-Muster',
  'onboarding.welcome.insight.timing.content':
    '„Trades, das 2–4 Stunden gehalten wird, zeigt ein dreimal besseres Risiko-Ertrags-Verhältnis als Skalps.“',
  'onboarding.welcome.insight.psychology.title': 'Psychologie-Tracking',
  'onboarding.welcome.insight.psychology.content':
    '„Sie nehmen Gewinne 15 % zu früh mit, wenn der Anstieg mehr als 500 $ beträgt.“',
  'onboarding.welcome.trust.data-ownership':
    'Ihre Daten, Ihr Gerät – Vollständige Eigentümerschaft und Kontrolle',
  'onboarding.welcome.trust.any-broker':
    'Funktioniert mit jedem Broker – MetaTrader-Synchronisierung + manuelle Eingabe',
  'onboarding.welcome.trust.customizable':
    'Vollständig anpassbar – Verfolgen Sie, was Ihnen wichtig ist',
  'onboarding.common.continue': 'Weitermachen',
  'onboarding.common.close': 'Schließen',
  'onboarding.features.title': 'Wählen Sie aus, was zu Ihrem Workflow passt.',
  'onboarding.features.feature.mt5-sync.label': 'MT5 Synchronisierung',
  'onboarding.features.feature.mt5-sync.description':
    'Trades automatisch aus MetaTrader 5 importieren',
  'onboarding.features.feature.csv-import.label': 'Trade Import',
  'onboarding.features.feature.csv-import.description':
    'Importieren Sie Trades von jedem Broker über Broker-Exporte',
  'onboarding.features.feature.manual-entry.label': 'Manuelle Eingabe',
  'onboarding.features.feature.manual-entry.description':
    'Protokollieren Sie Trades manuell mit voller Kontrolle',
  'onboarding.features.feature.analytics.label': 'Analysen und Einblicke',
  'onboarding.features.feature.analytics.description':
    'Leistungskennzahlen, Diagramme und Trading-Statistiken',
  'onboarding.features.feature.account-tracking.label': 'Kontoverfolgung',
  'onboarding.features.feature.account-tracking.description':
    'Verfolgen Sie mehrere Prop-Firmen- und Privatkonten',
  'onboarding.features.feature.trade-journal.label': 'Layout-Builder',
  'onboarding.features.feature.trade-journal.description':
    'Erstellen Sie benutzerdefinierte Review-Layouts mit Widgets, Diagrammen und Notizen',
  'onboarding.features.feature.ai-trading-assistant.label':
    'KI-Trading-Assistent',
  'onboarding.features.feature.ai-trading-assistant.description':
    'Mustererkennung, Einblicke und personalisierte Anleitung',
  'onboarding.features.badge.coming-soon': 'Demnächst verfügbar',
  'onboarding.features.badge.pro': 'PRO',
  'onboarding.features.trial.pro':
    'Zu den PRO-Funktionen gehört eine 14-tägige kostenlose Testversion',
  'onboarding.explore.title': 'Erkunden',
  'onboarding.explore.subtitle':
    'Journalit verwandelt Ihren Vault in ein vollständiges Trading-Journal mit Dashboards, Trade-Log, Kontoverfolgung und anpassbaren Layouts.',
  'onboarding.explore.subtitle2':
    'Entwickelt, um sich an Ihren Arbeitsablauf anzupassen und Sie nicht zu unserem zu zwingen.',
  'onboarding.explore.tagline': 'Dein Tagebuch, deine Regeln.',
  'onboarding.explore.section.out-of-box.title': 'Kernansichten und Tools',
  'onboarding.explore.core.dashboard.label': 'Trading-Dashboard',
  'onboarding.explore.core.dashboard.description':
    'Ihre Leistung auf einen Blick – P&L, Win Rate, Drawdowns und mehr.',
  'onboarding.explore.core.tradelog.label': 'Trade-Log',
  'onboarding.explore.core.tradelog.description':
    'Durchsuchen Sie Trades nach Jahr/Monat/Woche/Tag und führen Sie sofort einen Drilldown durch.',
  'onboarding.explore.core.accounts.label': 'Kontoverfolgung',
  'onboarding.explore.core.accounts.description':
    'Verfolgen Sie mehrere Konten und zeigen Sie kontospezifische Leistungsseiten an.',
  'onboarding.explore.core.layouts.label': 'Layout-Builder',
  'onboarding.explore.core.layouts.description':
    'Passen Sie Dashboards an und überprüfen Sie Layouts mit Widgets und Vorlagen.',
  'onboarding.explore.imports.title': 'Importe und Synchronisierung (PRO)',
  'onboarding.explore.imports.subtitle':
    'Vorschau und Einrichtung jederzeit möglich. Für den Import/die Synchronisierung ist Pro erforderlich.',
  'onboarding.explore.imports.csv.label': 'Trade Import',
  'onboarding.explore.imports.csv.description':
    'Upload CSV, spreadsheet, HTML, and broker statement exports for backend-powered analysis and preview.',
  'onboarding.explore.imports.mt.label':
    'MetaTrader-Synchronisierung (MT4/MT5)',
  'onboarding.explore.imports.mt.description':
    'Automatische Trade-Synchronisierung von MetaTrader. Erfordert Pro.',
  'onboarding.explore.cta.open': 'Offen',
  'onboarding.explore.cta.manual': 'Öffnen Sie Dokumente',
  'onboarding.path.kicker': 'Wählen Sie Pfad',
  'onboarding.path.tip.trial':
    'Tipp: PRO-Abonnements beinhalten eine 14-tägige kostenlose Testversion.',
  'onboarding.path.title': 'Wählen Sie Ihren ersten Weg',
  'onboarding.path.subtitle':
    'Wählen Sie den schnellsten Weg zu Ihrem ersten Trade in Journalit.',
  'onboarding.path.option.manual.label': 'Manuelle Eingabe (kostenlos)',
  'onboarding.path.option.manual.description':
    'Erstellen Sie mit dem Formular „Trade hinzufügen“ in Sekundenschnelle einen Trade.',
  'onboarding.path.option.csv.label': 'Trade Import',
  'onboarding.path.option.csv.description':
    'Use Pro backend-powered analysis for broker export files.',
  'onboarding.path.option.mt.label': 'MetaTrader-Synchronisierung (MT4/MT5)',
  'onboarding.path.option.mt.description':
    'Verbinden Sie MT4/MT5 für die automatische Trade-Synchronisierung.',
  'onboarding.final.manual.title': 'Sie sind bereit für Journalit',
  'onboarding.final.manual.hotkey.title': 'Vorgeschlagener Hotkey',
  'onboarding.final.manual.hotkey.value': 'Mod + Alt + A',
  'onboarding.final.manual.cta.change-hotkey': 'Hotkey festlegen',
  'onboarding.final.manual.hit-hotkey':
    'Empfohlen: {hotkey}. Klicken Sie auf Hotkey festlegen, um ihn zu konfigurieren.',
  'onboarding.final.csv.title': 'Sie sind bereit, Ihre Trades einzubringen',
  'onboarding.final.csv.subtitle':
    'Next, open Trade Import. Uploading and processing broker exports requires PRO activation.',
  'onboarding.final.csv.cta.open': 'Open Trade Import',
  'onboarding.final.mt.title': 'Sie können nun MetaTrader anschließen',
  'onboarding.final.mt.subtitle':
    'Als nächstes richten Sie die MT4/MT5-Synchronisierung ein. Erfordert die Aktivierung von PRO.',
  'onboarding.final.mt.cta.open': 'Öffnen Sie das MetaTrader-Setup',
  'onboarding.final.mt.hero.source.title': 'MetaTrader',
  'onboarding.final.mt.hero.source.subtitle': 'Trade-Berichte',
  'onboarding.final.mt.hero.dest.title': 'Gewölbe',
  'onboarding.final.mt.hero.dest.subtitle': 'Trade-Notizen',
  'onboarding.final.finish': 'Beenden',
  'onboarding.features.graphic.syncing': 'Trades werden synchronisiert...',
  'onboarding.features.graphic.complete': 'Synchronisierung abgeschlossen',
  'onboarding.features.graphic.direction.long': 'LANG',
  'onboarding.features.graphic.direction.short': 'KURZ',
  'onboarding.features.graphic.status.win': 'GEWINN',
  'onboarding.features.graphic.status.loss': 'VERLUST',
  'onboarding.activation.title': 'Melden Sie sich bei Journalit an',
  'onboarding.activation.subtitle':
    'Führen Sie die Authentifizierung in Ihrem Browser durch, um auf Ihr Konto zuzugreifen',
  'onboarding.activation.status.initializing':
    'Generieren Ihres Authentifizierungscodes...',
  'onboarding.activation.status.waiting': 'Warten auf die Anmeldung...',
  'onboarding.activation.status.expired': 'Code abgelaufen',
  'onboarding.activation.status.denied': 'Anmeldung verweigert',
  'onboarding.activation.status.error': 'Anmeldung fehlgeschlagen',
  'onboarding.activation.error.init':
    'Die Anmeldung kann nicht gestartet werden. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
  'onboarding.activation.error.denied':
    'Die Anmeldung wurde verweigert. Sie können sich später über die Einstellungen anmelden.',
  'onboarding.activation.error.expired':
    'Der Authentifizierungscode ist abgelaufen. Bitte starten Sie den Anmeldevorgang neu.',
  'onboarding.activation.error.generic':
    'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
  'onboarding.activation.error.save':
    'Die Anmeldung war erfolgreich, das Speichern konnte jedoch nicht durchgeführt werden. Bitte starten Sie das Plugin neu und versuchen Sie es erneut.',
  'onboarding.activation.error.connection':
    'Verbindung verloren. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
  'onboarding.activation.notice.invalid-url':
    'Ungültige Aktivierung URL. Bitte wenden Sie sich an den Support.',
  'onboarding.activation.notice.popup-blocked-copied':
    'Browser-Popup blockiert. Aktivierung URL in die Zwischenablage kopiert – bitte in Ihren Browser einfügen.',
  'onboarding.activation.notice.popup-blocked-manual':
    'Bitte öffnen Sie dieses URL in Ihrem Browser: {url}',
  'onboarding.activation.notice.copy-code-failed':
    'Code konnte nicht kopiert werden. Bitte manuell kopieren.',
  'onboarding.activation.label.code': 'Ihr Authentifizierungscode',
  'onboarding.activation.button.copy': 'Code kopieren',
  'onboarding.activation.button.copy-link': 'Link kopieren',
  'onboarding.activation.button.copied': 'Kopiert!',
  'onboarding.activation.step.open-browser':
    'Klicken Sie unten, um Ihren Browser zu öffnen',
  'onboarding.activation.step.enter-code':
    'Geben Sie Ihren Authentifizierungscode ein',
  'onboarding.activation.step.complete-signin': 'Vollständige Anmeldung',
  'onboarding.activation.step.return-here':
    'Zur automatischen Vervollständigung hierher zurückkehren',
  'onboarding.activation.button.open-browser':
    'Öffnen Sie den Browser, um sich anzumelden',
  'onboarding.activation.waiting.title': 'Warten auf die Anmeldung...',
  'onboarding.activation.waiting.hint':
    'Dies dauert normalerweise weniger als eine Minute',
  'onboarding.activation.success.title': 'Anmelden abgeschlossen!',
  'onboarding.activation.success.subtitle':
    'Sie sind jetzt mit Ihrem Journalit-Konto verbunden',
  'onboarding.activation.features.title': 'Verfügbare Funktionen:',
  'onboarding.activation.features.sync':
    'Synchronisieren Sie Trades geräteübergreifend',
  'onboarding.activation.features.analytics':
    'Erweiterte Analysen und Berichte',
  'onboarding.activation.features.mt5': 'MT5 Trade Synchronisierung',
  'onboarding.activation.features.csv': 'Intelligenter Trade Import',
  'onboarding.activation.auto-advance':
    'Automatische Fortsetzung in 10 Sekunden...',
  'onboarding.activation.skip': 'Später aktivieren',
  'onboarding.notice.complete-failed':
    'Der Onboarding-Abschluss konnte nicht gespeichert werden. Bitte versuchen Sie es später noch einmal.',
  'onboarding.notice.skip-failed':
    'Der Onboarding-Übersprung konnte nicht gespeichert werden. Bitte versuchen Sie es später noch einmal.',
  'onboarding.progress.aria-label': 'Schritt {current} von {total}',
  'onboarding.progress.step': 'Schritt {step}',
  'onboarding.progress.status.completed': '(vollendet)',
  'onboarding.progress.status.current': '(aktuell)',
  'onboarding.progress.announcement':
    'Schritt {current} von {total} abgeschlossen{label}',
  'widget.goals.title.daily': 'Tägliche Ziele',
  'widget.goals.title.weekly': 'Wöchentliche Ziele',
  'widget.goals.title.monthly': 'Monatliche Ziele',
  'widget.goals.title.quarterly': 'Vierteljährliche Ziele',
  'widget.goals.title.yearly': 'Jahresziele',
  'widget.goals.title.default': 'Ziele',
  'widget.goals.tooltip.daily':
    'Die hier hinzugefügten Elemente gelten nur für diesen Tag. Für wiederkehrende Elemente zu allen neuen DRCs gehen Sie zu Einstellungen > Reviews.',
  'widget.goals.tooltip.weekly':
    'Die hier hinzugefügten Elemente gelten nur für diese Woche. Für wiederkehrende Elemente in allen neuen wöchentlichen Reviews gehen Sie zu Einstellungen > Reviews.',
  'widget.goals.tooltip.monthly':
    'Die hier hinzugefügten Elemente gelten nur für diesen Monat. Für wiederkehrende Elemente in allen neuen monatlichen Reviews gehen Sie zu Einstellungen > Reviews.',
  'widget.goals.tooltip.quarterly':
    'Die hier hinzugefügten Elemente gelten nur für dieses Quartal. Für wiederkehrende Elemente aller neuen Quartalsreviews gehen Sie zu Einstellungen > Reviews.',
  'widget.goals.tooltip.yearly':
    'Die hier hinzugefügten Elemente gelten nur für dieses Jahr. Für wiederkehrende Elemente aller neuen Jahresreviews gehen Sie zu Einstellungen > Reviews.',
  'widget.goals.completed': '{completed}/{total} abgeschlossen',
  'widget.goals.placeholder': 'Neues Ziel hinzufügen...',
  'widget.goals.empty.preview': 'Keine Ziele konfiguriert',
  'widget.goals.empty.default':
    'Keine Ziele gesetzt. Fügen Sie unten eines hinzu.',
  'widget.goals.invalid-context':
    'Für das Ziel-Widget ist eine Review-Notiz erforderlich (DRC, wöchentlich, monatlich, vierteljährlich oder jährlich).',
  'widget.goals.aria.edit': 'Ziel bearbeiten',
  'widget.goals.aria.delete': 'Ziel löschen',
  'widget.header.name': 'Kopfzeile',
  'widget.header.description': 'Navigationsheader mit Kontextlinks',
  'widget.header.invalid-context':
    'Ungültige Titelangabe: erfordert „Typ“ (drc/weekly-review/monthly-review/quarterly-review/trade) und ein Datumsfeld („date“ für Reviews, „entryTime“ für Trades)',
  'widget.header.aria.mark-reviewed':
    'Klicken Sie, um es als geprüft zu markieren',
  'widget.header.aria.mark-not-reviewed':
    'Klicken Sie, um es als nicht geprüft zu markieren',
  'widget.header.unknown-instrument': 'Unbekannt',
  'widget.header.week': 'Woche {number}',
  'widget.header.quarter': 'Q{number}',
  'widget.header.drc': 'DRC',
  'widget.header.nav.prev': '← Zurück',
  'widget.header.nav.next': 'Weiter →',
  'widget.header.day.0': 'Sonntag',
  'widget.header.day.1': 'Montag',
  'widget.header.day.2': 'Dienstag',
  'widget.header.day.3': 'Mittwoch',
  'widget.header.day.4': 'Donnerstag',
  'widget.header.day.5': 'Freitag',
  'widget.header.day.6': 'Samstag',
  'widget.header.month.0': 'Januar',
  'widget.header.month.1': 'Februar',
  'widget.header.month.2': 'März',
  'widget.header.month.3': 'April',
  'widget.header.month.4': 'Mai',
  'widget.header.month.5': 'Juni',
  'widget.header.month.6': 'Juli',
  'widget.header.month.7': 'August',
  'widget.header.month.8': 'September',
  'widget.header.month.9': 'Oktober',
  'widget.header.month.10': 'November',
  'widget.header.month.11': 'Dezember',
  'widget.header.month-short.0': 'Jan',
  'widget.header.month-short.1': 'Febr',
  'widget.header.month-short.2': 'Mär',
  'widget.header.month-short.3': 'Apr',
  'widget.header.month-short.4': 'Mai',
  'widget.header.month-short.5': 'Jun',
  'widget.header.month-short.6': 'Juli',
  'widget.header.month-short.7': 'Aug',
  'widget.header.month-short.8': 'Sept',
  'widget.header.month-short.9': 'Okt',
  'widget.header.month-short.10': 'Nov',
  'widget.header.month-short.11': 'Dez',
  'widget.picker.placeholder': 'Wählen Sie ein Widget aus...',
  'widget.category.charts': 'Diagramme',
  'widget.category.statistics': 'Statistiken',
  'widget.category.content': 'Inhalt',
  'widget.category.tables': 'Tische',
  'widget.category.layout': 'Layout',
  'widget.goals.name': 'Ziele',
  'widget.goals.description': 'Tagesziele mit Abschluss-Kontrollkästchen',
  'widget.review.name': 'Review',
  'widget.review.description': 'Mentale und technische Leistungsnoten',
  'widget.review-context-fields.name': 'Review-Kontextfelder',
  'widget.review-context-fields.description':
    'Bearbeitbare benutzerdefinierte Kontextfelder für Review-Notizen',
  'widget.review-context-fields.group.default': 'Review-Kontext',
  'widget.review-context-fields.inherited-title': 'Geerbter Kontext',
  'widget.review-context-fields.local-title': 'Lokaler Kontext',
  'widget.review-context-fields.empty-title':
    'Für diesen Review-Typ sind keine Review-Kontextfelder konfiguriert.',
  'widget.review-context-fields.empty-desc':
    'Erstelle benutzerdefinierte Review-Felder in den Einstellungen, um Bias, Fokus, Absicht und weiteren Planungskontext zu erfassen.',
  'widget.review-context-fields.configure': 'Review-Felder konfigurieren',
  'widget.review-context-fields.service-unavailable':
    'Benutzerdefinierte Review-Felder sind noch nicht verfügbar.',
  'widget.review-context-fields.unsupported-type':
    'Nicht unterstützter Review-Feldtyp.',
  'widget.review-context-fields.source-missing':
    'Diese übergeordnete Review existiert noch nicht.',
  'widget.review-context-fields.source-invalid':
    'Diese übergeordnete Review existiert, ist aber keine gültige Review-Notiz.',
  'widget.review-context-fields.source-empty':
    'In dieser übergeordneten Review sind noch keine geerbten Werte ausgefüllt.',
  'widget.review-context-fields.open-source': 'Öffnen',
  'widget.review-context-fields.create-source': 'Erstellen',
  'widget.review.title': 'Leistungsbeurteilung',
  'widget.review.mental-game': 'Mentales Spiel',
  'widget.review.technical-game': 'Technisches Spiel',
  'widget.review.star-hint':
    'Für einen Vollstern klicken Sie, für einen Halbstern klicken Sie mit der rechten Maustaste',
  'widget.review.invalid-context':
    'Das Review-Widget erfordert eine DRC- oder wöchentliche Review-Notiz (Frontmatter-Typ: „drc“ oder „weekly-review“).',
  'widget.checklist.name': 'Checkliste',
  'widget.checklist.description': 'Checkliste zur Vorbereitung vor der Sitzung',
  'widget.session-mistakes.name': 'Sitzungsfehler',
  'widget.session-mistakes.description': 'Fehler am Sitzungsende erfassen',
  'widget.key-levels.name': 'Schlüsselebenen',
  'widget.key-levels.description':
    'Wichtige Preisniveaus, die Sie im Auge behalten sollten',
  'widget.key-events.name': 'Wichtige Ereignisse',
  'widget.key-events.description': 'Wichtige Ereignisse während des Zeitraums',
  'widget.key-events.title': 'Wichtige Ereignisse',
  'widget.key-events.tooltip':
    'Wichtige Ereignisse werden in deiner Wochenübersicht gespeichert und können hier im DRC hinzugefügt oder bearbeitet werden.',
  'widget.key-events.placeholder': 'Ereignis auswählen oder erstellen',
  'widget.key-events.color-label': 'Farbe:',
  'widget.key-events.color-aria': 'Wählen Sie die Farbe {color}',
  'widget.key-events.day-label': 'Tag:',
  'widget.key-events.notes-placeholder':
    'Notizen zu dieser Veranstaltung (optional)',
  'widget.key-events.notes-label': 'Notizen',
  'widget.key-events.default-notes-tooltip':
    'Standardnotizen werden unter Einstellungen → Anpassung → Ereignisse verwaltet. Wenn Sie hier ein Ereignis auswählen, werden die gespeicherten Standardnotizen automatisch eingefügt.',
  'widget.key-events.add-button': 'Ereignis hinzufügen',
  'widget.key-events.empty-state': 'Keine wichtigen Ereignisse für heute',
  'widget.key-events.empty-state-sub':
    'Fügen Sie Ereignisse zu Ihrem wöchentlichen Rückblick hinzu',
  'widget.missed-trades.name': 'Trades verpasst',
  'widget.missed-trades.description':
    'Trades, das Sie identifiziert, aber nicht übernommen haben',
  'widget.images.name': 'Charts & Medien',
  'widget.images.description': 'Medienkarussell mit Upload-Unterstützung',
  'widget.images.invalid-context':
    'Für das Bilder-Widget ist eine Review-Notiz erforderlich (Typ: „drc“, „wöchentliche Reviews“, „monatlicher Review“, „Quartalsreview“ oder „jährlicher Review“).',
  'widget.images.alt-prefix': 'Review-Medium',
  'widget.images.stacked-alt': 'Review-Medium {index}',
  'widget.images.open-fullscreen':
    'Öffnen Sie das Bild {index} im Vollbildmodus',
  'widget.images.delete': 'Medium löschen',
  'widget.images.empty': 'Keine Medien',
  'widget.images.placeholder': 'Bild-URL oder Dateipfad einfügen...',
  'widget.images.placeholder-add-more': 'Weitere Medien hinzufügen...',
  'widget.mark-reviewed.name': 'Als geprüft markieren',
  'widget.mark-reviewed.description': 'Review mit Zeitstempel abschließen',
  'widget.mark-reviewed.status.reviewed': 'ÜBERPRÜFT',
  'widget.mark-reviewed.status.pending': 'AUSSTEHENDE ÜBERPRÜFUNG',
  'widget.mark-reviewed.button.undo': 'Rückgängig machen',
  'widget.mark-reviewed.button.mark': 'Als geprüft markieren',
  'widget.pnl-chart.name': 'Equity-Kurve',
  'widget.pnl-chart.description': 'Kumulierter Gewinn/Verlust im Zeitverlauf',
  'widget.drawdown-chart.name': 'Rückgang',
  'widget.drawdown-chart.description':
    'Drawdown-Betrag aus geschlossenen Trades seit dem vorherigen realisierten GuV-Hoch',
  'widget.directional-pnl.name': 'Richtungsbezogener GuV',
  'widget.directional-pnl.description':
    'Performancevergleich von Long- und Short-Trades',
  'widget.directional-drawdown.name':
    'Richtungsbezogener realisierter Drawdown',
  'widget.directional-drawdown.description':
    'Separate Long- und Short-Drawdown-Betragskurven aus geschlossenen Trades',
  'widget.long-drawdown.name': 'Realisierter Long-Drawdown',
  'widget.long-drawdown.description':
    'Drawdown-Betragskurve aus geschlossenen Long-Trades',
  'widget.short-drawdown.name': 'Realisierter Short-Drawdown',
  'widget.short-drawdown.description':
    'Drawdown-Betragskurve aus geschlossenen Short-Trades',
  'widget.trades-chart.name': 'Trade P&L',
  'widget.trades-chart.description': 'P&L-Balken für jeden einzelnen Trade',
  'widget.trades-chart-daily.name': 'Täglich P&L',
  'widget.trades-chart-daily.description': 'P&L aggregiert nach Tag',
  'widget.trades-chart-weekly.name': 'Wöchentlich P&L',
  'widget.trades-chart-weekly.description': 'P&L aggregiert nach Woche',
  'widget.trades-chart-monthly.name': 'Monatlich P&L',
  'widget.trades-chart-monthly.description': 'P&L aggregiert nach Monat',
  'widget.trades-chart-quarterly.name': 'Vierteljährlich P&L',
  'widget.trades-chart-quarterly.description': 'P&L nach Quartal aggregiert',
  'widget.stats.name': 'Statistikraster',
  'widget.stats.description': 'Wichtige Leistungskennzahlen im Rasterformat',
  'widget.stats.no-trades':
    'Für diesen Zeitraum gibt es keine geschlossenen Trades',
  'widget.stats.vs-prev': 'ggü. vorher',
  'dashboard.metrics.past-30d': 'letzte 30 T.',
  'widget.stats.no-change': 'Keine Änderung',
  'widget.stats.no-previous-data': 'Keine vorherigen Daten',
  'widget.stats.net-pnl': 'Netto P&L',
  'widget.stats.win-rate': 'Trefferquote',
  'widget.stats.profit-factor': 'Gewinnfaktor',
  'widget.stats.expectancy': 'Erwartungswert',
  'widget.stats.total-trades': 'Trades insgesamt',
  'widget.stats.avg-win': 'Durchschnittlicher Gewinn',
  'widget.stats.avg-loss': 'Durchschnittlicher Verlust',
  'widget.stats.pl-ratio': 'P/L-Verhältnis',
  'widget.account-breakdown.name': 'Kontenaufschlüsselung',
  'widget.account-breakdown.description':
    'Vergleiche die Performance der Konten in diesem Review-Zeitraum',
  'widget.account-breakdown.empty':
    'Keine geschlossenen Trades in diesem Zeitraum',
  'widget.account-breakdown.column.account': 'Konto',
  'widget.account-breakdown.column.trades': 'Handel',
  'widget.account-breakdown.column.pnl': 'Netto-P&L',
  'widget.account-breakdown.column.win-rate': 'Trefferquote',
  'widget.account-breakdown.column.profit-factor': 'Profitfaktor',
  'widget.setup-performance.name': 'Setup-Performance',
  'widget.setup-performance.description':
    'Aufschlüsselung der Leistung nach Setup',
  'widget.best-worst-trades.name': 'Beste/schlechteste Trades',
  'widget.best-worst-trades.description': 'Top-Trades mit Gewinn und Verlust',
  'widget.best-worst.best-trade': 'Bester Trade',
  'widget.best-worst.worst-trade': 'Schlechtester Trade',
  'widget.best-worst.no-win-trades': 'Keine erfolgreichen Trades',
  'widget.best-worst.no-loss-trades': 'Keine verlorenen Trades',
  'widget.best-worst.best-month': 'Bester Monat',
  'widget.best-worst.worst-month': 'Schlimmster Monat',
  'widget.best-worst.no-profitable-months': 'Keine profitablen Monate',
  'widget.best-worst.no-losing-months': 'Keine Verlustmonate',
  'widget.best-worst.n-trades': '{count} Trades',
  'widget.best-worst.win-rate': '{rate}% Trefferquote',
  'widget.best-worst-days.name': 'Beste/schlechteste Tage',
  'widget.best-worst-days.description': 'Höchste und niedrigste P&L-Tage',
  'widget.best-worst-days.best-day': 'Bester Tag',
  'widget.best-worst-days.worst-day': 'Schlimmster Tag',
  'widget.best-worst-days.no-profitable-days': 'Keine profitablen Tage',
  'widget.best-worst-days.no-losing-days': 'Keine Verlusttage',
  'widget.best-worst-days.trade-count.one': '{count} Trade',
  'widget.best-worst-days.trade-count.few': '{count} Trades',
  'widget.best-worst-days.trade-count.many': '{count} Trades',
  'widget.best-worst-days.trade-count.other': '{count} Trades',
  'widget.best-worst-days.win-rate': '{rate}% Trefferquote',
  'widget.best-worst-days.invalid-context':
    'Dieses Widget ist nur in wöchentlichen und monatlichen Reviews verfügbar',
  'widget.position-size.title': 'Positionsgröße',
  'widget.position-size.save-defaults': 'Als Standard speichern',
  'widget.position-size.reset-defaults':
    'Auf Standardeinstellungen zurücksetzen',
  'widget.position-size.stock-crypto': 'Aktie/Krypto',
  'widget.position-size.futures': 'Futures',
  'widget.position-size.forex': 'Forex',
  'widget.position-size.account-balance': 'Kontostand',
  'widget.position-size.risk-percent': 'Risiko %',
  'widget.position-size.entry-price': 'Einstiegspreis',
  'widget.position-size.profit-target-optional': 'Gewinnziel (optional)',
  'widget.position-size.currency-pair': 'Währungspaar',
  'widget.position-size.stop-loss-pips': 'Stop-Loss (Pips)',
  'widget.position-size.target-pips-optional': 'Ziel (Pips, optional)',
  'widget.position-size.placeholder.example': 'z. B. {value}',
  'widget.position-size.enter-values': 'Werte eingeben',
  'widget.position-size.risk': 'Risiko',
  'widget.position-size.reward': 'Reward',
  'widget.position-size.stop': 'stoppen',
  'widget.position-size.pts': 'Punkte',
  'widget.position-size.mini': 'Mini',
  'widget.position-size.pip-value-info':
    'Pip-Wert: ${value} (Standard-Lot) | Kerngröße: {size}',
  'widget.position-size.futures-info': '${dollar}/pt | Tick: {size} = ${value}',
  'widget.position-size.investment-dollar': 'Investition ($)',
  'widget.position-size.investment': 'Investition',
  'widget.position-size.at-price': '@ ${price}',
  'widget.best-worst-weeks.name': 'Beste/schlechteste Wochen',
  'widget.best-worst-weeks.description': 'Höchste und niedrigste P&L-Wochen',
  'widget.best-worst-weeks.best-week': 'Beste Woche',
  'widget.best-worst-weeks.worst-week': 'Schlimmste Woche',
  'widget.best-worst-weeks.no-profitable': 'Keine profitablen Wochen',
  'widget.best-worst-weeks.no-losing': 'Keine Verlustwochen',
  'widget.best-worst-weeks.week-name': 'Woche {number} ({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} Trades',
  'widget.best-worst-weeks.win-rate': '{percent}% Trefferquote',
  'widget.best-worst-weeks.invalid-context':
    'Dieses Widget ist nur in wöchentlichen und monatlichen, vierteljährlichen und jährlichen Reviews verfügbar',
  'widget.best-worst-months.name': 'Beste/schlechteste Monate',
  'widget.best-worst-months.description': 'Höchster und niedrigster P&L-Monat',
  'widget.best-worst-months.invalid-context':
    'Dieses Widget ist nur in vierteljährlichen und jährlichen Reviews verfügbar',
  'widget.best-worst-quarters.name': 'Beste/schlechteste Viertel',
  'widget.best-worst-quarters.description':
    'Höchstes und niedrigstes P&L-Viertel',
  'widget.best-worst-quarters.best-quarter': 'Bestes Viertel',
  'widget.best-worst-quarters.worst-quarter': 'Schlimmstes Viertel',
  'widget.best-worst-quarters.no-profitable': 'Keine profitablen Quartale',
  'widget.best-worst-quarters.no-losing': 'Keine Quartalsverluste',
  'widget.best-worst-quarters.trade-count': '{count} Trades',
  'widget.best-worst-quarters.win-rate': '{percent}% Trefferquote',
  'widget.best-worst-quarters.invalid-context':
    'Dieses Widget ist nur in Jahresrückblicken verfügbar',
  'widget.technical-game.name': 'Technisches Spiel',
  'widget.technical-game.description':
    'Wöchentliche Verteilung technischer Qualität aus DRCs',
  'widget.mental-game.name': 'Mentales Spiel',
  'widget.mental-game.description':
    'Wöchentliche Verteilung der geistigen Noten aus DRCs',
  'widget.demon-tracker.name': 'Dämonenverfolger',
  'widget.demon-tracker.description':
    'Verfolgen Sie wiederkehrende Trading-Fehler',
  'widget.trading-score.title': 'Trading-Score',
  'widget.trading-score.no-data': 'Keine Trading-Daten',
  'widget.trading-score.breakdown-title': 'Score-Aufschlüsselung',
  'widget.trading-score.close-breakdown': 'Aufschlüsselung schließen',
  'widget.trading-score.of-weeks': 'von {count}',
  'widget.trading-score.start-trading':
    'Beginnen Sie mit dem Trading, um Ihren Punktestand freizuschalten',
  'widget.trading-score.one-week-down': '1 Woche geschafft, weiter so!',
  'widget.trading-score.weeks-to-unlock.one':
    '{count} mehr Woche zum Freischalten',
  'widget.trading-score.weeks-to-unlock.few':
    '{count} weitere Wochen zum Freischalten',
  'widget.trading-score.weeks-to-unlock.many':
    '{count} weitere Wochen zum Freischalten',
  'widget.trading-score.weeks-to-unlock.other':
    '{count} weitere Wochen zum Freischalten',
  'widget.trading-score.trades-to-unlock.one':
    'Noch {count} Trade bis zur Freischaltung',
  'widget.trading-score.trades-to-unlock.few':
    '{count} weitere Trades zum Freischalten',
  'widget.trading-score.trades-to-unlock.many':
    '{count} weitere Trades zum Freischalten',
  'widget.trading-score.trades-to-unlock.other':
    '{count} weitere Trades zum Freischalten',
  'widget.trading-score.collect-more-data':
    'Sammeln Sie etwas mehr Daten, um Ihren Punktestand freizuschalten',
  'widget.trading-score.trades-logged.one': '{count} Trade protokolliert',
  'widget.trading-score.trades-logged.few': '{count} Trades protokolliert',
  'widget.trading-score.trades-logged.many': '{count} Trades protokolliert',
  'widget.trading-score.trades-logged.other': '{count} Trades protokolliert',
  'widget.trading-score.trades-count': '{count} Trades',
  'widget.trading-score.weight': 'Gewicht: {weight}%',
  'widget.trading-score.weeks-suffix': '· {weeks}w',
  'widget.trading-score.axis-aria': '{axis}: {score} Punkte, {weight}% Gewicht',
  'widget.trading-score.phase.insufficient': 'Unzureichende Daten',
  'widget.trading-score.phase.developing': 'Entwicklung',
  'widget.trading-score.phase.established': 'Gegründet',
  'widget.trading-score.axis.profitability': 'Rentabilität',
  'widget.trading-score.axis.riskManagement': 'Risikomanagement',
  'widget.trading-score.axis.execution': 'Ausführung',
  'widget.trading-score.axis.consistency': 'Konsistenz',
  'widget.trading-score.axis.returnConsistency': 'Konsistenz der Rückgabe',
  'widget.trading-score.axis.experience': 'Erfahrung',
  'widget.trading-score.axis.profitability.desc':
    'Misst den Gewinnfaktor und die Expectancy pro Trade',
  'widget.trading-score.axis.riskManagement.desc':
    'Misst die maximale Drawdown-Kontrolle und Wiederherstellungsfähigkeit',
  'widget.trading-score.axis.execution.desc':
    'Misst die Gewinnquote und das durchschnittliche Gewinn-/Verlustverhältnis',
  'widget.trading-score.axis.consistency.desc':
    'Misst Return-Stabilität und Streak-Kontrolle',
  'widget.trading-score.axis.returnConsistency.desc':
    'Misst die Einheitlichkeit von Take-Profits und Stop-Losses',
  'widget.trading-score.axis.experience.desc':
    'Misst aktive Trading-Wochen und Konsistenz',
  'widget.trades.name': 'Trades',
  'widget.trades.description': 'Liste der Gewerke mit den wichtigsten Details',
  'widget.trade-review.name': 'Trade-Prüfung',
  'widget.trade-review.description':
    'Prüfe jeden Trade mit Bildern, Kennzahlen und konfigurierbaren Fragen',
  'widget.trade-review.status.reviewed': 'Geprüft',
  'widget.trade-review.status.pending': 'Ausstehend',
  'widget.trade-review.no-image': 'Kein Trade-Bild',
  'widget.trade-review.open-trade-note': 'Trade-Notiz öffnen',
  'widget.trade-review.mark-reviewed': 'Als geprüft markieren',
  'widget.trade-review.loading': 'Trade-Reviews werden geladen...',
  'widget.trade-review.no-trades': 'Keine Trades zum Prüfen.',
  'widget.trade-review.time.open': 'Offen',
  'widget.trade-review.fallback-title': 'Transaktion {index}',
  'widget.trade-review.question.win-what-worked': 'Was hat funktioniert?',
  'widget.trade-review.placeholder.win-what-worked':
    'Was hast du in diesem Trade gut umgesetzt?',
  'widget.trade-review.question.win-repeatable': 'War das wiederholbar?',
  'widget.trade-review.placeholder.win-repeatable':
    'Was machte diesen Trade wiederholbar?',
  'widget.trade-review.question.key-lesson': 'Wichtigste Lektion',
  'widget.trade-review.placeholder.key-lesson':
    'Was solltest du aus diesem Trade mitnehmen?',
  'widget.trade-review.question.loss-what-went-wrong': 'Was lief schief?',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    'Was verursachte diesen Verlust?',
  'widget.trade-review.question.loss-valid-or-mistake':
    'War das ein gültiger Verlust oder ein Ausführungsfehler?',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    'Beschreibe, ob der Prozess gültig oder vermeidbar war.',
  'widget.trade-review.question.loss-avoid-next-time':
    'Was vermeide ich beim nächsten Mal?',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    'Welches konkrete Verhalten sollte sich ändern?',
  'widget.trade-review.question.be-managed-correctly':
    'Wurde der Trade korrekt gemanagt?',
  'widget.trade-review.placeholder.be-managed-correctly':
    'Entsprach das Management deinem Plan?',
  'widget.trade-review.image-alt-prefix': 'Bild zur Trade-Prüfung',
  'widget.trade-review.placeholder.default': 'Schreibe deine Gedanken...',
  'widget.trade-review.questions-hidden':
    'Review-Fragen sind für diesen Trade ausgeblendet.',
  'widget.trade-review.field.entry': 'Einstieg',
  'widget.trade-review.field.exit': 'Ausstieg',
  'widget.trade-review.field.duration': 'Dauer',
  'widget.trade-review.field.risk': 'Risiko',
  'widget.trade-review.field.account': 'Konto',
  'widget.trade-review.field.setup': 'Strategie',
  'widget.trade-review.field.mistakes': 'Fehler',
  'widget.trade-review.field.tags': 'Markierungen',
  'widget.trade-review.more-context': 'Mehr Kontext',
  'widget.trade-review.field.position-size': 'Positionsgröße',
  'widget.trade-review.field.stop-loss': 'Stoppkurs',
  'widget.trade-review.field.take-profit': 'Gewinnziel',
  'widget.trade-review.field.fees': 'Gebühren',
  'widget.trade-review.field.commission': 'Provision',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': 'These',
  'widget.trade-review.field.notes': 'Notizen',
  'widget.trade-review.field.custom-fields': 'Benutzerdefinierte Felder',
  'widget.backtest-trades.name': 'Backtest Trades',
  'widget.backtest-trades.description':
    'Liste der Backtest-Trades für diesen Berichtszeitraum',
  'widget.breakdown-daily.name': 'Tägliche Zusammenfassung',
  'widget.breakdown-daily.description': 'Leistungstabelle, gruppiert nach Tag',
  'widget.breakdown-weekly.name': 'Wöchentliche Zusammenfassung',
  'widget.breakdown-weekly.description':
    'Leistungstabelle, gruppiert nach Woche',
  'widget.breakdown-monthly.name': 'Monatliche Zusammenfassung',
  'widget.breakdown-monthly.description':
    'Leistungstabelle, gruppiert nach Monat',
  'widget.breakdown-quarterly.name': 'Vierteljährliche Zusammenfassung',
  'widget.breakdown-quarterly.description':
    'Leistungstabelle, gruppiert nach Quartal',
  'widget.breakdown.empty.days-week': 'Diese Woche gibt es keine Trading-Tage',
  'widget.breakdown.empty.weeks-month':
    'Diesen Monat gibt es keine Trading-Wochen',
  'widget.breakdown.empty.months-quarter':
    'Keine Trading-Monate in diesem Quartal',
  'widget.breakdown.empty.quarters-year': 'Keine Trading-Quartale dieses Jahr',
  'widget.table.header.date': 'Datum',
  'widget.table.header.week': 'Woche',
  'widget.table.header.month': 'Monat',
  'widget.table.header.quarter': 'Quartal',
  'widget.table.header.year': 'Jahr',
  'widget.table.header.trades': 'Trades',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Gewinn %',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.setup': 'Setup',
  'widget.table.header.a-games': 'Ein Spiel',
  'widget.table.header.b-games': 'B-Spiele',
  'widget.table.header.c-games': 'C-Spiele',
  'widget.table.header.rating': 'Bewertung',
  'widget.table.header.avg-rating': 'Durchschnittliches Rating',
  'widget.demon-tracker.column.demon': 'DÄMON',
  'widget.demon-tracker.column.occurrences': 'Vorkommnisse',
  'widget.demon-tracker.column.stop-trading': 'Hören Sie mit dem Trading auf',
  'widget.demon-tracker.period.this-month': 'diesen Monat',
  'widget.demon-tracker.period.this-quarter': 'dieses Quartal',
  'widget.demon-tracker.period.this-year': 'dieses Jahr',
  'widget.demon-tracker.empty.title': 'Keine Fehler erfasst {period}',
  'widget.demon-tracker.empty.description':
    'Hier werden bei Ihren Trades protokollierte Fehler angezeigt, um Muster zu erkennen',
  'widget.demon-tracker.summary.unique': 'Einzigartige Fehler:',
  'widget.demon-tracker.summary.total': 'Gesamtzahl der Vorkommen:',
  'widget.demon-tracker.summary.critical': 'Kritisch (6+):',
  'widget.markdown-zone.name': 'Markdown-Zone',
  'widget.markdown-zone.description': 'Freiform-Markdown-Inhaltsbereich',
  'widget.markdown-header.name': 'Abschnittsüberschrift',
  'widget.markdown-header.description':
    'Markdown-Überschrift (H1–H6) mit benutzerdefiniertem Text',
  'metric.netPnL.name': 'Netto P&L',
  'metric.netPnL.description': 'Gesamtgewinn und -verlust aller Trades',
  'metric.winRate.name': 'Trefferquote',
  'metric.winRate.description': 'Prozentsatz der erfolgreichen Trades',
  'metric.profitFactor.name': 'Gewinnfaktor',
  'metric.profitFactor.description':
    'Verhältnis von Bruttogewinn zu Bruttoverlust',
  'metric.sharpeRatio.name': 'Sharpe-Kennzahl',
  'metric.sharpeRatio.description':
    'Trade-basierte Sharpe-Kennzahl: durchschnittliche Netto-P&L geschlossener Trades geteilt durch die Stichproben-P&L-Volatilität',
  'metric.expectancy.name': 'Erwartungswert',
  'metric.expectancy.description':
    'Durchschnittlicher gewonnener oder verlorener Betrag pro Trade',
  'metric.maxDrawdown.name': 'Max. Rückgang',
  'metric.maxDrawdown.description':
    'Größter Drawdown-Betrag aus geschlossenen Trades seit einem vorherigen realisierten GuV-Hoch',
  'metric.bestDay.name': 'Bester Tag',
  'metric.bestDay.description': 'Höchster Einzeltag P&L',
  'metric.largestWin.name': 'Größter Gewinn',
  'metric.largestWin.description': 'Größter Gewinnhandel',
  'metric.largestLoss.name': 'Größter Verlust',
  'metric.largestLoss.description': 'Größter Verlusthandel',
  'metric.longestWinStreak.name': 'Beste Serie',
  'metric.longestWinStreak.description':
    'Längste Siegesserie in Folge nach Ausstiegsdatum',
  'metric.longestLossStreak.name': 'Schlimmste Serie',
  'metric.longestLossStreak.description':
    'Längste Niederlagenserie in Folge nach Ausstiegsdatum',
  'metric.numTrades.name': 'Trades insgesamt',
  'metric.numTrades.description': 'Gesamtzahl der geschlossenen Trades',
  'metric.numWinTrades.name': 'Gewinn-Trades',
  'metric.numWinTrades.description': 'Anzahl der erfolgreichen Trades',
  'metric.numLossTrades.name': 'Verlust-Trades',
  'metric.numLossTrades.description': 'Anzahl der verlorenen Trades',
  'metric.avgWin.name': 'Durchschnittlicher Gewinn',
  'metric.avgWin.description': 'Durchschnittlicher Gewinn gewinnender Trades',
  'metric.avgLoss.name': 'Durchschnittlicher Verlust',
  'metric.avgLoss.description': 'Durchschnittlicher Verlust verlorener Trades',
  'metric.avgRR.name': 'Durchschn. RR (Payoff)',
  'metric.avgRR.description':
    'Währungsbasierte Payoff-Ratio: durchschnittlicher Gewinn / durchschnittlicher Verlust',
  'metric.avgRRRiskBased.name': 'Durchschn. RR (R-basiert)',
  'metric.avgRRRiskBased.description':
    'Risikobasiertes Verhältnis unter Verwendung von R-multiples: durchschnittliches Gewinn-R / durchschnittliches Verlust-R (erfordert Stop-/Risikodaten)',
  'metric.avgHoldTime.name': 'Durchschnittliche Haltezeit',
  'metric.avgHoldTime.description':
    'Durchschnittliche Zeit in allen geschlossenen Trades',
  'metric.avgWinHoldTime.name': 'Durchschnittliche Gewinnhaltezeit',
  'metric.avgWinHoldTime.description':
    'Durchschnittliche Zeit, bis Gewinn-Trades geschlossen werden',
  'metric.avgLossHoldTime.name': 'Durchschnittliche Verlusthaltezeit',
  'metric.avgLossHoldTime.description':
    'Durchschnittliche Zeit, in der geschlossene Trades verloren gehen',
  'metric.avgWinnerHeat.name': 'Durchschn. Gewinner-Heat',
  'metric.avgWinnerHeat.description':
    'Durchschnittliche MAE geschlossener Gewinnertrades in der gespeicherten MAE/MFE-Einheit',
  'metric.winnerMaeP90.name': 'Gewinner MAE P90',
  'metric.winnerMaeP90.description':
    '90. Perzentil der MAE-Schwelle für geschlossene Gewinnertrades in der gespeicherten MAE/MFE-Einheit',
  'metric.winnerMaeMedian.name': 'Gewinner MAE Median',
  'metric.winnerMaeMedian.description':
    'Median-MAE geschlossener Gewinnertrades in der gespeicherten MAE/MFE-Einheit',
  'metric.avgLossHeat.name': 'Durchschn. Verlust-Heat',
  'metric.avgLossHeat.description':
    'Durchschnittliche MAE geschlossener Verlusttrades in der gespeicherten MAE/MFE-Einheit',
  'metric.winnerAvgMfe.name': 'Gewinner durchschn. MFE',
  'metric.winnerAvgMfe.description':
    'Durchschnittliche MFE geschlossener Gewinnertrades in der gespeicherten MAE/MFE-Einheit',
  'metric.loserAvgMfe.name': 'Verlierer durchschn. MFE',
  'metric.loserAvgMfe.description':
    'Durchschnittliche MFE geschlossener Verlusttrades in der gespeicherten MAE/MFE-Einheit',
  'metric.winnerMfeP90.name': 'Gewinner MFE P90',
  'metric.winnerMfeP90.description':
    '90. Perzentil der MFE-Schwelle für geschlossene Gewinnertrades in der gespeicherten MAE/MFE-Einheit',
  'metric.loserMfeP90.name': 'Verlierer MFE P90',
  'metric.loserMfeP90.description':
    '90. Perzentil der MFE-Schwelle für geschlossene Verlusttrades in der gespeicherten MAE/MFE-Einheit',
  'metric.timeInDrawdown.name': 'Zeit im Drawdown',
  'metric.timeInDrawdown.description':
    'Anteil der verstrichenen Zeit unter dem vorherigen realisierten GuV-Hoch',
  'metric.avgRecoveryTime.name': 'Durchschnittliche Wiederherstellungszeit',
  'metric.avgRecoveryTime.description':
    'Durchschnittliche Zeit, bis realisierte Drawdowns aus geschlossenen Trades ein neues Hoch erreichen',
  'metric.longestDrawdown.name': 'Längster realisierter Drawdown',
  'metric.longestDrawdown.description':
    'Die längste verstrichene Zeit, die in einer realisierten Drawdown-Episode verbracht wurde',
  'metric.drawdownEpisodes.name': 'Drawdown-Episoden',
  'metric.drawdownEpisodes.description':
    'Anzahl der realisierten Drawdown-Perioden im aktuell gefilterten Trade-Set',
  'metric.category.performance': 'Leistung',
  'metric.category.volume': 'Volumen',
  'metric.category.average': 'Durchschnitt',
  'onboarding.wizard.cancelled-announcement':
    'Onboarding abgebrochen. Sie können das Onboarding später über die Befehlspalette erneut abspielen, indem Sie nach „Journalit: Onboarding erneut abspielen“ suchen.',
  'onboarding.wizard.error.next-step':
    'Der nächste Schritt konnte nicht ausgeführt werden',
  'onboarding.wizard.error.prev-step':
    'Der Übergang zum vorherigen Schritt ist fehlgeschlagen',
  'onboarding.wizard.error.trade-service': 'TradeService nicht verfügbar',
  'onboarding.wizard.error.account-service':
    'AccountPageService nicht verfügbar',
  'onboarding.wizard.error.create-sample-trade':
    'Musterhandel konnte nicht erstellt werden',
  'onboarding.wizard.error.auth-failed':
    'Die Authentifizierung konnte nicht abgeschlossen werden',
  'onboarding.wizard.error.backend-service':
    'Backend-Integrationsservice nicht verfügbar',
  'onboarding.wizard.error.sign-in-required':
    'Bitte melden Sie sich an, um FTP-Anmeldeinformationen zu generieren',
  'onboarding.wizard.error.ftp-generation':
    'FTP-Anmeldeinformationen konnten nicht generiert werden',
  'onboarding.wizard.notice.sample-trade-created':
    'Beispiel-Trade erfolgreich erstellt! Sie finden es in Ihrem Vault.',
  'onboarding.wizard.notice.auth-success':
    'Erfolgreich authentifiziert! Sie können jetzt auf die Pro-Funktionen zugreifen.',
  'onboarding.wizard.notice.ftp-generated':
    'FTP-Zugangsdaten erfolgreich generiert!',
  'onboarding.wizard.notice.password-masked':
    'Das Passwort ist maskiert und kann nicht kopiert werden. Bitte generieren Sie die FTP-Anmeldeinformationen neu.',
  'onboarding.wizard.notice.copied': '{label} in die Zwischenablage kopiert!',
  'onboarding.wizard.notice.copy-failed': '{label} konnte nicht kopiert werden',
  'onboarding.wizard.unknown-step.title': 'Unbekannter Schritt',
  'onboarding.wizard.unknown-step.description':
    'Im Onboarding-Prozess ist ein unerwarteter Schritt aufgetreten.',
  'onboarding.wizard.footer-default':
    'Schließen Sie die Einrichtung ab, um mit Journalit zu beginnen',
  'onboarding.wizard.skip-aria': 'Überspringen Sie diesen Schritt',
  'onboarding.wizard.skip-onboarding': 'Onboarding überspringen',
  'onboarding.wizard.skip-step': 'Schritt überspringen',
  'settings.reviews.weekly-checklist': 'Wöchentliche Vorbereitungs-Checkliste',
  'settings.reviews.weekly-checklist-desc':
    'Lege Checklistenpunkte fest, die automatisch in jedem neuen Wochenrückblick erscheinen. Sie werden beim Erstellen kopiert und können pro Woche bearbeitet werden.',
  'settings.reviews.weekly-checklist-placeholder':
    'Wöchentlichen Checklistenpunkt hinzufügen...',
  'widget.checklist.weekly-title': 'Wöchentliche Vorab-Checkliste',
  'widget.checklist.tooltip.weekly':
    'Hier hinzugefügte Punkte gelten nur für diese Woche.',
  'widget.checklist.tooltip.weekly-settings-link':
    'Für wiederkehrende Punkte in allen neuen Wochenrückblicken gehe zu Einstellungen > Reviews.',
  'guide.skip-guide': 'Anleitung überspringen',
  'account.open-trade-log.error':
    'Trade Log für dieses Konto konnte nicht geöffnet werden.',
  'account.linked-trades.title': 'Verlinkt Trades',
  'account.linked-trades.empty-message':
    'Mit diesem Konto sind keine Trades verknüpft',
  'account.linked-trades.empty-submessage':
    'Trades wird hier angezeigt, sobald sie diesem Konto hinzugefügt wurden',
  'account.linked-trades.click-to-open':
    'Klicken Sie hier, um den Trade zu öffnen',
  'account.linked-trades.no-path-available': 'Kein Pfad verfügbar',
  'account.linked-trades.no-path-warning':
    'Kein Dateipfad – kann nicht geöffnet werden',
  'account.linked-trades.entry': 'Einstieg',
  'account.linked-trades.exit': 'Ausstieg',
  'account.linked-trades.size': 'Größe',
  'account.linked-trades.setups': 'Setups',
  'account.linked-trades.mistakes': 'Fehler',
  'account.linked-trades.tags': 'Schlagworte',
  'account.linked-trades.reviewed': 'Bewertet',
  'account.linked-trades.not-reviewed': 'Nicht bewertet',
  'account.linked-trades.net-costs': 'Nettokosten',
  'account.linked-trades.net-credit': 'Nettokredit',
  'account.create.title': 'Konto erstellen',
  'account.create.field.name': 'Kontoname',
  'account.create.field.name-desc': 'Ein eindeutiger Name für Ihr Handelskonto',
  'account.create.placeholder.name': 'Mein Handelskonto',
  'account.create.field.type': 'Kontotyp',
  'account.create.field.type-desc': 'Die Art des Trade-Kontos',
  'account.create.field.initial-balance': 'Anfangssaldo',
  'account.create.field.initial-balance-desc':
    'Startkontostand (optional, Standardwert 0)',
  'account.create.field.live-balance': 'Live-Balance',
  'account.create.field.live-balance-desc': 'Aktueller Kontostand des Brokers',
  'account.create.field.creation-date': 'Erstellungsdatum',
  'account.create.field.creation-date-desc': 'Wann das Konto erstellt wurde',
  'account.create.field.currency': 'Währung',
  'account.create.field.currency-desc':
    'Die angezeigte Landeswährung des Kontos',
  'account.create.field.drawdown-type': 'Drawdown-Typ',
  'account.create.field.drawdown-type-desc':
    'Keine | Behoben | EOD-Trailing | Handbuch',
  'account.create.field.drawdown-amount': 'Drawdown-Betrag',
  'account.create.field.drawdown-amount-desc': 'Maximales Drawdown-Limit',
  'account.create.field.profit-target-desc':
    'Legen Sie ein Gewinnziel für das Konto fest',
  'account.create.field.monthly-cost': 'Monatliche Kosten',
  'account.create.field.monthly-cost-desc':
    'Abonnementgebühren, Plattformkosten',
  'account.create.field.target-type': 'Zieltyp',
  'account.create.field.target-type-desc': 'Absolut oder prozentual',
  'account.create.field.target-percent': 'Ziel (%)',
  'account.create.field.target-dollar': 'Ziel ($)',
  'account.create.field.target-percent-desc': 'Prozentuales Gewinnziel',
  'account.create.field.target-dollar-desc': 'Dollar-Betragsziel',
  'account.create.field.target-date': 'Zieldatum (optional)',
  'account.create.field.target-date-desc':
    'Datum zur Erreichung des Gewinnziels',
  'account.create.type.demo': 'Demokonto',
  'account.create.type.evaluation': 'Auswertung',
  'account.create.type.funded': 'Gefördert',
  'account.create.success': 'Konto „{name}“ erfolgreich erstellt',
  'account.create.error.name-required': 'Kontoname ist erforderlich',
  'account.create.error.name-exists':
    'Es existiert bereits ein Konto mit dem Namen „{name}“.',
  'account.create.error.balance-negative':
    'Der Anfangssaldo darf nicht negativ sein',
  'account.create.error.invalid-live-balance': 'Das Live-Guthaben ist ungültig',
  'account.create.error.drawdown-required':
    'Der Drawdown-Betrag ist erforderlich, wenn der Drawdown-Typ aktiviert ist',
  'account.create.error.profit-target-required':
    'Der Gewinnzielbetrag ist erforderlich, wenn das Gewinnziel aktiviert ist',
  'account.create.error.invalid-date': 'Ungültiges Erstellungsdatum',
  'account.create.error.future-date':
    'Das Erstellungsdatum darf nicht in der Zukunft liegen',
  'account.create.error.cost-negative':
    'Die monatlichen Kosten dürfen nicht negativ sein',
  'account.create.error.service-unavailable':
    'Der Account-Service ist nicht verfügbar. Bitte versuchen Sie es erneut.',
  'account.create.error.fix-target-date':
    'Bitte beheben Sie den Fehler beim Gewinnzieldatum, bevor Sie das Konto erstellen',
  'account.create.error.invalid-target-date': 'Ungültiges Gewinnzieldatum',
  'account.create.error.failed': 'Konto konnte nicht erstellt werden: {error}',
  'account.add-event.title': 'Einzahlung/Auszahlung hinzufügen',
  'account.add-event.field.type': 'Transaktionstyp',
  'account.add-event.field.type-desc': 'Einzahlung oder Auszahlung',
  'account.add-event.field.amount': 'Menge',
  'account.add-event.field.amount-desc': 'Betrag in {currency}',
  'account.add-event.field.date': 'Datum',
  'account.add-event.field.date-desc': 'Transaktionsdatum',
  'account.add-event.field.description': 'Beschreibung (optional)',
  'account.add-event.field.description-desc': 'Zusätzliche Hinweise',
  'account.add-event.type.deposit': 'Kaution',
  'account.add-event.type.withdrawal': 'Rückzug',
  'account.add-event.placeholder.deposit': 'Manuelle Einzahlung',
  'account.add-event.placeholder.withdrawal': 'Manuelle Auszahlung',
  'account.add-event.button.add': 'Transaktion hinzufügen',
  'account.add-event.button.adding': 'Hinzufügen...',
  'account.add-event.success': '{type} von {amount} erfolgreich hinzugefügt',
  'account.add-event.error.amount-required':
    'Der Betrag muss größer als 0 sein',
  'account.add-event.error.date-required': 'Datum ist erforderlich',
  'account.add-event.error.invalid-date': 'Ungültiges Datumsformat',
  'account.add-event.error.future-date':
    'Das Transaktionsdatum darf nicht in der Zukunft liegen',
  'account.add-event.error.failed':
    'Fehler beim Hinzufügen der Transaktion: {error}',
  'account.add-event.confirm.title': 'Bestätigen Sie die Transaktion',
  'account.add-event.confirm.message':
    '{type} von {amount} zum Konto „{account}“ auf {date} hinzufügen?',
  'account.add-event.confirm.description': 'Beschreibung: {description}',
  'account.risk-metrics.loading': 'Risikometriken werden geladen...',
  'account.risk-metrics.title': 'Risikomanagement',
  'account.risk-metrics.drawdown-used': 'Genutztes Drawdown-Limit',
  'account.risk-metrics.profit-target': 'Gewinnziel',
  'account.risk-metrics.status.breached': 'VERLETZT',
  'account.risk-metrics.status.achieved': 'ERREICHT',
  'account.risk-metrics.status.in-progress': 'IM GANGE',
  'account.risk-metrics.not-set': 'Nicht festgelegt',
  'account.risk-metrics.no-drawdown': 'Kein Drawdown-Limit festgelegt',
  'account.risk-metrics.no-profit-target': 'Kein Gewinnziel festgelegt',
  'account.risk-metrics.label.used': 'Genutzt:',
  'account.risk-metrics.label.limit': 'Limit:',
  'account.risk-metrics.label.remaining': 'Übrig:',
  'account.risk-metrics.label.progress': 'Fortschritt:',
  'account.risk-metrics.label.target': 'Ziel:',
  'account.risk-metrics.label.target-date': 'Zieldatum:',
  'account.edit-event.title': 'Bearbeiten Sie {type}',
  'account.edit-event.field.type': 'Transaktionstyp',
  'account.edit-event.field.type-desc':
    'Kann beim Bearbeiten nicht geändert werden',
  'account.edit-event.field.amount': 'Menge',
  'account.edit-event.field.amount-desc': 'Betrag in {currency}',
  'account.edit-event.field.date': 'Datum',
  'account.edit-event.field.date-desc': 'Transaktionsdatum',
  'account.edit-event.field.description': 'Beschreibung (optional)',
  'account.edit-event.field.description-desc': 'Zusätzliche Hinweise',
  'account.edit-event.button.save': 'Änderungen speichern',
  'account.edit-event.button.saving': 'Sparen...',
  'account.edit-event.button.delete': 'Löschen Sie {type}',
  'account.edit-event.button.deleting': 'Löschen...',
  'account.edit-event.success.update': '{type} wurde erfolgreich aktualisiert',
  'account.edit-event.success.delete': '{type} erfolgreich gelöscht',
  'account.edit-event.error.update':
    'Fehler beim Aktualisieren der Transaktion: {error}',
  'account.edit-event.error.delete':
    'Fehler beim Löschen der Transaktion: {error}',
  'account.edit-event.delete-confirm.title': 'Löschen Sie {type}',
  'account.edit-event.delete-confirm.message':
    'Sind Sie sicher, dass Sie dieses {type} von {amount} aus {date} löschen möchten?',
  'account.edit-event.delete-confirm.warning':
    'Diese Aktion kann nicht rückgängig gemacht werden.',
  'account.edit.title': 'Konto bearbeiten',
  'account.edit.field.name': 'Kontoname',
  'account.edit.field.name-desc': 'Der eindeutige Name für dieses Konto',
  'account.edit.placeholder.name': 'z. B. Mein Handelskonto',
  'account.edit.field.type': 'Kontotyp',
  'account.edit.field.type-desc': 'Art des Trade-Kontos',
  'account.edit.type.demo': 'Demokonto',
  'account.edit.type.evaluation': 'Auswertung',
  'account.edit.type.funded': 'Gefördert',
  'account.edit.field.initial-balance': 'Anfangssaldo',
  'account.edit.field.initial-balance-desc': 'Startkontostand',
  'account.edit.field.live-balance': 'Live-Balance',
  'account.edit.field.live-balance-desc': 'Aktueller Kontostand des Brokers',
  'account.edit.field.creation-date': 'Erstellungsdatum',
  'account.edit.field.creation-date-desc': 'Als das Konto erstellt wurde',
  'account.edit.field.currency': 'Währung',
  'account.edit.field.currency-desc': 'Die angezeigte Landeswährung des Kontos',
  'account.edit.field.drawdown-type': 'Drawdown-Typ',
  'account.edit.field.drawdown-type-desc':
    'Keine | Behoben | EOD-Trailing | Handbuch',
  'account.edit.field.drawdown-amount': 'Drawdown-Betrag',
  'account.edit.field.drawdown-amount-desc':
    'Maximal zulässiger Verlust ab Startguthaben',
  'account.edit.field.manual-snapshots': 'Manuelle Drawdown-Snapshots',
  'account.edit.field.manual-snapshots-desc':
    'Verwalten Sie tägliche Saldo-Snapshots für die EOD-Trailing-Drawdown-Berechnung',
  'account.edit.field.profit-target-desc':
    'Legen Sie ein Gewinnziel für das Konto fest',
  'account.copy-trading.title': 'Kopier-Trading',
  'account.copy-trading.description':
    'Leite die Performance dieses Kontos über historische Kopierzeiträume von einem anderen Konto ab.',
  'account.copy-trading.enable': 'Dieses Konto kopiert ein anderes Konto',
  'account.copy-trading.existing-trades-warning':
    'Dieses Konto hat bereits direkte Trades. Sie bleiben erhalten, und kopierte Trades werden ab dem gewählten Startdatum ergänzt.',
  'account.copy-trading.base-account': 'Basiskonto',
  'account.copy-trading.base-account-desc':
    'Es können nur Nicht-Kopierkonten mit derselben Währung ausgewählt werden.',
  'account.copy-trading.base-account-placeholder': 'Basiskonto auswählen',
  'account.copy-trading.multiplier': 'Multiplikator',
  'account.copy-trading.multiplier-desc': 'Erlaubter Bereich: 0,1x bis 100x',
  'account.copy-trading.all-history': 'Alle historischen Trades kopieren',
  'account.copy-trading.start-date': 'Kopieren ab Datum',
  'account.copy-trading.history': 'Kopierverlauf',
  'account.copy-trading.error.base-required':
    'Wähle ein Basiskonto für Kopier-Trading aus.',
  'account.copy-trading.error.multiplier-range':
    'Der Kopier-Trading-Multiplikator muss zwischen 0,1x und 100x liegen.',
  'account.copy-trading.error.start-date-required':
    'Wähle ein Startdatum für Kopier-Trading aus.',
  'account.edit.field.monthly-cost': 'Monatliche Kosten',
  'account.edit.field.monthly-cost-desc': 'Abonnementgebühren, Plattformkosten',
  'account.copy-trading.error.base-account-is-copied':
    'Dieses Konto wird bereits als Basiskonto verwendet und kann kein anderes Konto kopieren.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'Dieses Konto ist derzeit die Basis für ein anderes Kopierkonto.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'Basiskonten können nicht gleichzeitig Kopierkonten sein.',
  'account.edit.field.target-type': 'Zieltyp',
  'account.edit.field.target-type-desc': 'Absolut oder prozentual',
  'account.edit.field.target-percent': 'Ziel (%)',
  'account.edit.field.target-dollar': 'Ziel ($)',
  'account.edit.field.target-percent-desc': 'Prozentuales Gewinnziel',
  'account.edit.field.target-dollar-desc': 'Dollar-Betragsziel',
  'account.edit.field.target-date': 'Zieldatum (optional)',
  'account.edit.field.target-date-desc': 'Datum zur Erreichung des Gewinnziels',
  'account.edit.button.show-snapshots':
    'Snapshot Manager anzeigen ({count} aufgezeichnet)',
  'account.edit.button.hide-snapshots':
    'Snapshot Manager ausblenden ({count} aufgezeichnet)',
  'account.edit.delete-warning':
    'Dies ist eine dauerhafte Aktion, die nicht rückgängig gemacht werden kann!',
  'account.drawdown.none': 'Keiner',
  'account.drawdown.fixed': 'Behoben',
  'account.drawdown.eod-trailing': 'EOD-Trailing',
  'account.drawdown.manual': 'Handbuch',
  'account.profit-target.enable': 'Gewinnziel aktivieren',
  'account.profit-target.type.absolute': 'Absoluter Betrag',
  'account.profit-target.type.percentage': 'Prozentsatz',
  'account.create.button.creating': 'Erstellen...',
  'account.create.button.create': 'Konto erstellen',
  'account.edit.button.saving': 'Sparen...',
  'account.edit.button.save': 'Änderungen speichern',
  'account.edit.button.delete': 'Konto löschen',
  'account.edit.button.delete-name': '„{name}“ löschen',
  'account.edit.modal.update-notes.title': 'Verknüpfte Notizen aktualisieren?',
  'account.edit.modal.update-notes.message':
    'Durch das Umbenennen werden alle Notizen, die auf „{oldName}“ verweisen, auf „{newName}“ aktualisiert. Dies ist erforderlich, um die Datenkonsistenz zu gewährleisten.',
  'account.edit.modal.update-notes.yes': 'OK (Notizen aktualisieren)',
  'account.edit.modal.update-notes.no': 'Alten Namen behalten',
  'account.edit.modal.update-notes.cancel': 'Aktion abbrechen',
  'account.edit.modal.change-date.title': 'Erstellungsdatum ändern',
  'account.edit.modal.change-date.message':
    'Sie sind dabei, das Erstellungsdatum für das Konto „{account}“ von {oldDate} in {newDate} zu ändern.',
  'account.edit.modal.change-date.warning':
    'Dadurch wird das Datum der Ersteinzahlungstransaktion aktualisiert und kann sich auf die Berechnung des Kontoalters, die monatlichen Abrechnungszyklen und andere datumsbasierte Kennzahlen auswirken.',
  'account.edit.modal.change-date.info':
    'Dadurch wird das Datum der ersten Einzahlungstransaktion aktualisiert, damit es mit dem neuen Erstellungsdatum übereinstimmt.',
  'account.edit.modal.change-date.confirm': 'Erstellungsdatum aktualisieren',
  'account.edit.modal.change-balance.title': 'Anfangssaldo ändern',
  'account.edit.modal.change-balance.message':
    'Sie sind dabei, den Anfangssaldo von {oldBalance} in {newBalance} zu ändern.',
  'account.edit.modal.change-balance.warning':
    'Sie sind dabei, den Anfangssaldo dieses Kontos zu ändern.',
  'account.edit.modal.change-balance.info':
    'Dies wirkt sich auf alle Saldoberechnungen, P&L-Prozentsätze, Drawdown-Berechnungen und den Transaktionsverlauf aus.',
  'account.edit.modal.change-balance.info2':
    'Der aktuelle Saldo wird auf der Grundlage des neuen Anfangssaldos plus aller Trade-P&L neu berechnet.',
  'account.edit.modal.change-balance.info3':
    'Diese Änderung kann erhebliche Auswirkungen auf die Kontometriken und die Genauigkeit historischer Daten haben.',
  'account.edit.modal.change-balance.confirm': 'Anfangssaldo aktualisieren',
  'account.edit.modal.delete.title': 'Konto löschen',
  'account.edit.modal.delete.question':
    'Sind Sie sicher, dass Sie das Konto „{name}“ dauerhaft löschen möchten?',
  'account.edit.modal.delete.warning':
    'Sind Sie sicher, dass Sie dieses Konto dauerhaft löschen möchten?',
  'account.edit.modal.delete.will': 'Diese Aktion wird:',
  'account.edit.modal.delete.item1':
    'Entfernen Sie alle Kontometadaten und -einstellungen',
  'account.edit.modal.delete.item2':
    'Entfernen Sie Kontoreferenzen aus allen verknüpften Trades',
  'account.edit.modal.delete.item3':
    'Entfernen Sie automatisch generierte Konto-Tags aus Notizen',
  'common.note-label': 'Notiz:',
  'common.warning-label': 'Warnung:',
  'common.tip-label': 'Tipp:',
  'common.backups-label': 'Backups:',
  'account.edit.error.name-required': 'Kontoname ist erforderlich',
  'account.edit.error.name-exists': 'Das Konto „{name}“ existiert bereits',
  'account.edit.error.creation-date-required':
    'Das Erstellungsdatum ist erforderlich',
  'account.edit.error.balance-required':
    'Der Anfangssaldo darf nicht negativ sein',
  'account.edit.error.invalid-live-balance': 'Das Live-Guthaben ist ungültig',
  'account.edit.error.drawdown-required':
    'Der Auszahlungsbetrag muss größer als 0 sein',
  'account.edit.error.future-date':
    'Das Erstellungsdatum darf nicht in der Zukunft liegen',
  'account.edit.error.update-failed':
    'Fehler beim Aktualisieren des Kontos: {error}',
  'account.edit.error.service-unavailable':
    'Der Account-Service ist nicht verfügbar',
  'account.edit.error.delete-failed': 'Fehler beim Löschen des Kontos: {error}',
  'account.edit.success.updated':
    'Konto „{name}“ wurde erfolgreich aktualisiert',
  'account.edit.success.updated-with-references':
    'Konto von „{oldName}“ auf „{newName}“ aktualisiert und alle Notizreferenzen aktualisiert',
  'account.edit.success.deleted': 'Konto „{name}“ erfolgreich gelöscht',
  'button.next': 'Nächste',
  'button.discard': 'Verwerfen',
  'guide.scroll-to-target.title':
    'Scrollen Sie, um mit der Anleitung fortzufahren',
  'guide.scroll-to-target.description':
    'Der nächste Schritt erfolgt außerhalb des Bildschirms. Scrollen Sie, um weiterzumachen, oder lassen Sie sich von Journalit dorthin bringen.',
  'guide.scroll-to-target.description-up':
    'Der nächste Schritt befindet sich weiter oben auf der Seite. Scrollen Sie nach oben, um weiterzumachen, oder lassen Sie sich von Journalit dorthin bringen.',
  'guide.scroll-to-target.description-down':
    'Der nächste Schritt befindet sich weiter unten auf der Seite. Scrollen Sie nach unten, um weiterzumachen, oder lassen Sie sich von Journalit dorthin bringen.',
  'guide.scroll-to-target.button': 'Zeig mir',
  'templateEditor.loading': 'Layout wird geladen...',
  'templateEditor.mode.preview': 'Vorschau',
  'templateEditor.mode.editor': 'Editor',
  'templateEditor.built-in-badge': '(Eingebaut)',
  'templateEditor.built-in-notice':
    'Integrierte Vorlagen können nicht bearbeitet werden. Duplizieren Sie diese Vorlage oder erstellen Sie eine neue, um sie anzupassen.',
  'templateEditor.unsaved-changes': 'Nicht gespeicherte Änderungen',
  'templateEditor.field.template-name': 'Layoutsname',
  'templateEditor.field.widgets': 'Widgets ({count})',
  'templateEditor.button.add-widget': '+ Widget hinzufügen',
  'templateEditor.button.widget-library-docs':
    'Dokumente zur Widget-Bibliothek',
  'templateEditor.widget.locked': 'Gesperrt',
  'templateEditor.widget.select-placeholder': 'Wählen Sie ein Widget aus...',
  'templateEditor.widget.header-text-placeholder': 'Kopfzeilentext...',
  'templateEditor.widget.markdown-zone-text-label': 'Voreingestellter Text',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'Text zum Einfügen in neue Reviewsnotizen...',
  'templateEditor.widget.page-size': 'Seitengröße:',
  'templateEditor.widget.show-rating-column': 'Rating-Spalte anzeigen',
  'templateEditor.widget.demon-tracker.count-mode': 'Zählmodus:',
  'templateEditor.widget.demon-tracker.count-mode.per-trade': 'Pro Trade',
  'templateEditor.widget.demon-tracker.count-mode.per-trading-day':
    'Pro Trading-Tag',
  'templateEditor.widget.demon-tracker.source-mode': 'Quellmodus:',
  'templateEditor.widget.demon-tracker.source-mode.trades': 'Nur Trades',
  'templateEditor.widget.demon-tracker.source-mode.session':
    'Nur Sitzungsfehler',
  'templateEditor.widget.demon-tracker.source-mode.combined':
    'Kombiniert (Trades + Sitzung)',
  'notice.error.template-save-failed':
    'Vorlage konnte nicht gespeichert werden',
  'builder.sidebar.title': 'Layout-Builder',
  'builder.sidebar.section.trade': 'Trade',
  'builder.sidebar.section.drc': 'DRC',
  'builder.sidebar.section.weekly': 'Wöchentlich',
  'builder.sidebar.section.monthly': 'Monatlich',
  'builder.sidebar.section.quarterly': 'Vierteljährlich',
  'builder.sidebar.section.yearly': 'Jährlich',
  'builder.sidebar.section.library': 'Bibliothek',
  'builder.sidebar.new-item': 'Neues {title}',
  'builder.sidebar.coming-soon': 'Kommt bald',
  'builder.sidebar.built-in': 'Eingebaut',
  'builder.sidebar.default-template': 'Standardlayout',
  'builder.sidebar.set-as-default': 'Als Standard festlegen',
  'builder.sidebar.duplicate': 'Duplikat',
  'builder.sidebar.delete': 'Löschen',
  'builder.sidebar.no-templates': 'Noch keine Layouts',
  'builder.sidebar.share-template': 'Layout teilen',
  'builder.sidebar.new-template-name': 'Neue {type}-Layout',
  'builder.sidebar.copy-suffix': '(Kopie)',
  'notice.default-trade-template-updated':
    'Standard-Trade-Vorlage aktualisiert',
  'notice.trade-template-duplicated': 'Trade-Layout dupliziert',
  'notice.trade-template-deleted': 'Trade-Layout gelöscht',
  'notice.error.create-template': 'Layout konnte nicht erstellt werden',
  'notice.error.duplicate-template':
    'Die Vorlage konnte nicht dupliziert werden',
  'notice.error.delete-template': 'Layout konnte nicht gelöscht werden',
  'account.weight-legend.aria-label': 'Legende zur Kontotypverteilung',
  'account.weight-legend.item-aria-label': '{name}: {percent}',
  'account.transaction.deposit': 'Kaution',
  'account.transaction.withdrawal': 'Rückzug',
  'account.transaction.click-to-edit':
    'Klicken Sie hier, um diese Transaktion zu bearbeiten oder zu löschen',
  'account.transaction.description': 'Beschreibung',
  'account.transaction.balance-after': 'Ausgleich danach',
  'account.deposits-withdrawals.title': 'Ein- und Auszahlungen ({count})',
  'account.deposits-withdrawals.empty':
    'Es wurden keine manuellen Ein- oder Auszahlungen erfasst.',
  'account.deposits-withdrawals.empty-sub':
    'Klicken Sie in der Kopfzeile auf die Schaltfläche „+“, um Ihre erste Transaktion hinzuzufügen.',
  'settings.reset.modal.title': 'Einstellungen auf Standard zurücksetzen?',
  'settings.reset.modal.explanation':
    'Dadurch werden ALLE Plugin-Einstellungen auf ihre Standardwerte zurückgesetzt. Dazu gehört:',
  'settings.reset.modal.item-custom-options':
    'Alle benutzerdefinierten Optionen (Ticker, Setups, Fehler)',
  'settings.reset.modal.item-account-settings':
    'Kontoeinstellungen und Metadaten',
  'settings.reset.modal.item-dashboard-layouts': 'Dashboard-Layouts',
  'settings.reset.modal.item-symbol-mappings': 'Symbolzuordnungen',
  'settings.reset.modal.item-csv-templates': 'Trade-Import-Vorlagen',
  'settings.reset.modal.item-other': 'Alle anderen Anpassungen',
  'settings.reset.modal.backup-note':
    'Vor dem Zurücksetzen wird ein Backup erstellt.',
  'settings.reset.modal.warning':
    'Diese Aktion kann nicht rückgängig gemacht werden (außer durch Wiederherstellung aus der Sicherung).',
  'settings.reset.backup-failed.title': 'Sicherung fehlgeschlagen',
  'settings.reset.backup-failed.message':
    'Es kann kein Backup Ihrer aktuellen Einstellungen erstellt werden.',
  'settings.reset.backup-failed.warning':
    'Wenn Sie mit dem Zurücksetzen fortfahren, können Sie Ihre aktuellen Einstellungen nicht wiederherstellen.',
  'notice.settings-reset-with-backup':
    'Einstellungen auf Standardwerte zurückgesetzt. Es wurde ein Backup erstellt. Starten Sie Obsidian neu, um alle Änderungen zu übernehmen.',
  'notice.settings-reset-no-backup':
    'Einstellungen auf Standardwerte zurückgesetzt. Es wurde kein Backup erstellt. Starten Sie Obsidian neu, um alle Änderungen zu übernehmen.',
  'home.quick-links.hide': 'Schnelllink ausblenden',
  'home.quick-links.all-hidden':
    'Alle Quicklinks sind ausgeblendet. Verwenden Sie „Widget hinzufügen“, um sie wiederherzustellen.',
  'home.quick-links.add-trade': 'Trade hinzufügen',
  'home.quick-links.trade-log': 'Trade-Log',
  'home.quick-links.trading-dashboard': 'Trading-Dashboard',
  'home.quick-links.account-dashboard': 'Konto-Dashboard',
  'home.quick-links.todays-drc': 'Der heutige DRC',
  'home.quick-links.weekly-review': 'Rückblick dieser Woche',
  'home.quick-links.monthly-review': 'Rückblick auf diesen Monat',
  'home.quick-links.quarterly-review': 'Quartalsrückblick',
  'home.quick-links.yearly-review': 'Jahresrückblick',
  'home.quick-links.quick-import': 'Schnellimport',
  'home.quick-links.csv-import': 'Handelsimport',
  'home.quick-links.layout-builder': 'Layout-Builder',
  'home.quick-links.session-mode': 'Sitzungsmodus',
  'home.quick-links.move-above': 'Verschieben Sie Quicklinks über Widgets',
  'home.quick-links.move-below': 'Verschieben Sie Quicklinks unter Widgets',
  'home.widget-selector.title': 'Zur Startseite hinzufügen',
  'home.widget-selector.section.widgets': 'Widgets',
  'home.widget-selector.section.quick-links': 'Versteckte Quicklinks',
  'home.widget-selector.restore': 'wiederherstellen',
  'home.widget-selector.empty': 'Alle Widgets wurden hinzugefügt',
  'home.widget-selector.hint.navigate': '↑↓ navigieren',
  'home.widget-selector.hint.select': 'Enter auswählen',
  'home.widget-selector.hint.close': 'esc schließen',
  'home.period.month': 'Diesen Monat',
  'home.period.quarter': 'Dieses Quartal',
  'home.period.year': 'Dieses Jahr',
  'home.period.lifetime': 'Lebensdauer',
  'home.aria.filter-period': 'Filterzeitraum',
  'home.aria.filter-trade-types': 'Filtern Sie Trade-Typen',
  'home.aria.add-widget': 'Widget hinzufügen',
  'home.aria.save-layout': 'Layout speichern',
  'home.aria.customize': 'Anpassen',
  'home.button.add-widget': 'Widget hinzufügen',
  'home.trade-types.all': 'Normal + Backtest',
  'home.greeting.welcome': 'Willkommen bei Journalit!',
  'home.greeting.hey': 'Hey',
  'home.greeting.nightowl': 'Hey Nachteule',
  'home.greeting.still-up': 'noch oben?',
  'home.greeting.late-night': 'Late-Night-Session?',
  'home.greeting.midnight-oil': 'noch spät am Arbeiten?',
  'home.greeting.good-morning': 'Guten Morgen',
  'home.greeting.rise-and-shine': 'Raus aus den Federn',
  'home.greeting.morning-trader': 'Morgenhändler',
  'home.greeting.ready-conquer': 'Bereit, den Tag zu erobern?',
  'home.greeting.fresh-start': 'Neuanfang',
  'home.greeting.good-afternoon': 'Guten Tag',
  'home.greeting.day-going-well': 'Ich hoffe, Ihr Tag verläuft gut',
  'home.greeting.afternoon-checkin': 'Check-in am Nachmittag',
  'home.greeting.midday-momentum': 'Mittagsdynamik',
  'home.greeting.hows-it-going': "wie geht's?",
  'home.greeting.good-evening': 'Guten Abend',
  'home.greeting.winding-down': 'abschalten?',
  'home.greeting.evening-review': 'Abendrückblick',
  'home.greeting.how-did-today-go': 'Wie ist es heute gelaufen?',
  'home.greeting.time-to-reflect': 'Zeit zum Nachdenken',
  'home.greeting.welcome-back': 'Willkommen zurück',
  'home.greeting.hey-there': 'Hallo',
  'home.greeting.good-to-see-you': 'Schön dich zu sehen',
  'home.subtitle.first-time': 'Lassen Sie uns Ihre Trading-Reise beginnen',
  'home.subtitle.see-how-doing': 'Mal sehen, wie es dir geht',
  'home.subtitle.elevate-trading': 'Es ist Zeit, Ihr Trading zu verbessern',
  'home.subtitle.journey-continues': 'Ihre Trading-Reise geht weiter',
  'home.subtitle.check-progress': 'Lassen Sie uns Ihren Fortschritt überprüfen',
  'home.subtitle.ready-elevate': 'Sind Sie bereit, Ihr Trading zu verbessern?',
  'home.subtitle.agenda-today': 'Was steht heute auf dem Programm?',
  'home.subtitle.trading-going': 'Wie läuft Ihr Trading?',
  'home.grid.error.title': 'Fehler beim Rasterlayout',
  'home.grid.error.message': 'Fehler: {error}',
  'home.grid.error.retry': 'Wiederholen',
  'home.grid.widget.remove-aria': 'Widget entfernen',
  'home.grid.widget.unknown-type': 'Unbekannter Widget-Typ: {widgetId}',
  'home.widget.unreviewed.all-reviewed': 'Alle Trades geprüft',
  'home.widget.unreviewed.title-review': 'Trade-Log zum Review öffnen',
  'home.widget.unreviewed.need-review.one': '{count} Trade muss geprüft werden',
  'home.widget.unreviewed.need-review.few':
    '{count} Trades müssen geprüft werden',
  'home.widget.unreviewed.need-review.many':
    '{count} Trades müssen geprüft werden',
  'home.widget.unreviewed.need-review.other':
    '{count} Trades müssen geprüft werden',
  'home.widget.unreviewed.today': '{count} heute',
  'home.widget.unreviewed.this-week': '{count} diese Woche',
  'home.widget.embedded-note.title': 'Eingebettete Notiz',
  'home.widget.embedded-note.select-note': 'Wählen Sie eine Notiz aus',
  'home.widget.embedded-note.search-placeholder': 'Notizen durchsuchen...',
  'home.widget.embedded-note.no-notes': 'Keine Notizen gefunden',
  'home.widget.embedded-note.select-different': 'Wählen Sie „Andere Notiz“.',
  'home.widget.embedded-note.open-note': 'Klicken Sie, um die Notiz zu öffnen',
  'home.widget.embedded-note.change-note': 'Notiz ändern',
  'home.widget.embedded-note.error.not-found': 'Datei nicht gefunden: {path}',
  'home.widget.embedded-note.error.load-failed':
    'Der Inhalt der Notiz konnte nicht geladen werden',
  'home.widget.embedded-note.error.deleted': 'Quelldatei wurde gelöscht',
  'home.widget.goals-progress.type.pnl': 'P&L-Ziel',
  'home.widget.goals-progress.type.pnl-desc':
    'Gewinn-/Verlustziel für einen Zeitraum',
  'home.widget.goals-progress.type.trades-logged': 'Trade-Anzahl',
  'home.widget.goals-progress.type.trades-logged-desc':
    'Anzahl der lebenslangen Trades',
  'home.widget.goals-progress.type.win-rate': 'Trefferquote',
  'home.widget.goals-progress.type.win-rate-desc': 'Gewinnprozentsatzziel',
  'home.widget.goals-progress.period.daily': 'Täglich',
  'home.widget.goals-progress.period.weekly': 'Wöchentlich',
  'home.widget.goals-progress.period.monthly': 'Monatlich',
  'home.widget.goals-progress.period-label.today': 'Heute',
  'home.widget.goals-progress.period-label.this-week': 'diese Woche',
  'home.widget.goals-progress.period-label.this-month': 'diesen Monat',
  'home.widget.goals-progress.period-label.total': 'gesamt',
  'home.widget.goals-progress.trades-count': '{count} Trades',
  'home.widget.goals-progress.set-goal': 'Ziel setzen',
  'home.widget.goals-progress.target': 'Ziel',
  'home.widget.goals-progress.tracks-lifetime':
    'Verfolgt die Gesamtlebensdauer',
  'home.widget.goals-progress.use-r-multiples': 'Verwenden Sie R-multiples',
  'home.widget.goals-progress.account-aware': 'Kontobezogene Ziele',
  'home.widget.goals-progress.no-target-selected':
    'Kein Ziel für ausgewähltes Konto',
  'home.widget.goals-progress.configured-for': 'Konfiguriert für {accounts}',
  'home.widget.goals-progress.account-scope': 'Kontoumfang',
  'home.widget.goals-progress.add-account': 'Konto hinzufügen',
  'home.widget.goals-progress.click-to-set':
    'Klicken Sie, um ein Ziel festzulegen',
  'home.widget.goals-progress.header.pnl': 'P&L-Ziel',
  'home.widget.goals-progress.header.trades': 'Trades Ziel',
  'home.widget.goals-progress.header.win-rate': 'Win Ratenziel',
  'home.widget.goals-progress.of-target': 'von {target} {period}',
  'home.widget.goals-progress.complete-100': '100 % abgeschlossen',
  'home.widget.goals-progress.complete-percent': '{percent}% abgeschlossen',
  'home.widget.goals-progress.goal-reached': 'Ziel erreicht',
  'home.widget.goals-progress.aria.save-goal': 'Ziel speichern',
  'home.widget.goals-progress.aria.set-goal': 'Setze dir ein Ziel',
  'home.widget.goals-progress.aria.change-goal':
    'Klicken Sie, um das Ziel zu ändern',
  'home.widget.best-hours.title': 'Beste Stunden',
  'home.widget.best-hours.no-data': 'Keine Trading-Daten',
  'home.widget.best-hours.period-aria':
    '{label}: {pnl} durchschnittlicher P&L pro Trade, {count} Trades',
  'home.widget.best-hours.trades-count': '{count} Trades',
  'home.widget.best-hours.win-rate': '{rate}% Gewinn',
  'home.widget.best-hours.win-rate-na': 'Gewinnrate nicht verfügbar',
  'home.widget.best-hours.days-count': '{count} Tage',
  'home.widget.best-hours.avg-per-trade': 'Ø/Trade',
  'home.widget.best-hours.strongest-entry-window': 'Stärkstes Einstiegsfenster',
  'home.widget.best-hours.avg-summary': '{trades} Trades · {days} Tage',
  'home.widget.best-hours.hidden': 'Ausgeblendet',
  'home.widget.best-hours.hidden-detail': 'Privatsphäre-Modus',
  'home.widget.best-hours.no-positive-window': 'Kein positives Fenster',
  'home.widget.best-hours.insufficient-history': 'Mehr Daten nötig',
  'home.widget.best-hours.sample-requirement': '{count}/2 beprobte Fenster',
  'home.widget.best-hours.developing': 'entwickelt sich',
  'home.widget.best-hours.no-positive-detail': 'Beprobte Fenster sind negativ',
  'home.widget.best-hours.period-hidden-aria':
    'Tageszeit-Performance ausgeblendet',
  'home.widget.aum.title': 'AUM',
  'home.widget.aum.period.month': 'Diesen Monat',
  'home.widget.aum.period.quarter': 'Dieses Quartal',
  'home.widget.aum.period.year': 'Dieses Jahr',
  'home.widget.aum.period.all': 'Alle Zeit',
  'home.widget.aum.unable-to-load': 'Konnte nicht geladen werden',
  'home.widget.aum.no-accounts': 'Keine Konten',
  'home.widget.aum.account-count': '{count}-Konto',
  'home.widget.aum.account-count-plural': '{count}-Konten',
  'home.widget.streak.title': 'Strähne',
  'home.widget.streak.period.month': 'diesen Monat',
  'home.widget.streak.period.quarter': 'dieses Quartal',
  'home.widget.streak.period.year': 'dieses Jahr',
  'home.widget.streak.period.ever': 'immer',
  'home.widget.streak.win': 'Gewinn',
  'home.widget.streak.wins': 'gewinnt',
  'home.widget.streak.loss': 'Verlust',
  'home.widget.streak.losses': 'Verluste',
  'home.widget.streak.in-a-row': 'hintereinander',
  'home.widget.streak.no-active': 'kein aktiver Streak',
  'home.widget.streak.start-trading':
    'Beginnen Sie mit dem Trading, um einen Streak aufzubauen',
  'home.widget.streak.best-streak': 'Deine beste Serie {period}',
  'home.widget.streak.above-average': 'über Ihrem Durchschnitt {period}',
  'home.widget.streak.stay-focused':
    'Bleiben Sie konzentriert, machen Sie weiter so',
  'home.widget.streak.keep-going': 'Mach weiter so',
  'home.widget.streak.good-start': 'guter Anfang',
  'home.widget.streak.pause': 'Machen Sie vor Ihrem nächsten Trade eine Pause',
  'home.widget.streak.review': 'Review vor dem nächsten Trade',
  'home.widget.streak.losses-process': 'Verluste sind Teil des Prozesses',
  'home.widget.streak.best': 'am besten',
  'home.widget.streak.avg': 'Durchschn',
  'home.widget.drawdown.title': 'Drawdown-Limit',
  'home.widget.drawdown.breached': 'Durchbrochen',
  'home.widget.drawdown.remaining': 'übrig',
  'home.widget.drawdown.unable-to-load': 'Konnte nicht geladen werden',
  'home.widget.drawdown.no-accounts': 'Keine Konten mit Limits',

  'home.widget.profit-target.title': 'Gewinnziel',
  'home.widget.profit-target.achieved': 'Erreicht',
  'home.widget.profit-target.remaining': 'übrig',
  'home.widget.profit-target.unable-to-load': 'Konnte nicht geladen werden',
  'home.widget.profit-target.no-accounts': 'Keine Konten mit Zielen',
  'home.widget.recent.title': 'Jüngste',
  'home.widget.recent.unknown': 'Unbekannt',
  'home.widget.recent.just-now': 'Soeben',
  'home.widget.recent.minutes-ago': 'Vor {minutes}m',
  'home.widget.recent.hours-ago': 'Vor {hours}h',
  'home.widget.recent.days-ago': 'Vor {days}d',
  'home.widget.recent.no-items': 'Noch keine letzten Elemente',
  'home.widget.recent.hint':
    'Öffnen Sie Dateien oder Ansichten, um sie hier anzuzeigen',
  'home.widget.top-breakdown.title': 'Top {dimension}',
  'home.widget.top-breakdown.configure-title': 'Top anpassen {dimension}',
  'home.widget.top-breakdown.aria.customize':
    'Klicken Sie hier, um Top {dimension} anzupassen',
  'home.widget.setups.title': 'Top-Setups',
  'home.widget.setups.no-data': 'Es wurden noch keine Setups aufgezeichnet',
  'home.widget.setups.trades-count': '{count} Trades',
  'home.widget.setups.win-rate': '{rate}% Trefferquote',
  'home.widget.weekly.title': 'Diese Woche',
  'home.widget.weekly.no-trades': 'Diese Woche noch keine Trades',
  'home.widget.weekly.losing-days': '{count} verliert Tage in Folge',
  'home.widget.weekly.winning-days': '{count} gewinnende Tage in Folge',
  'home.widget.weekly.above-average': 'über Ihrem Wochendurchschnitt liegen',
  'home.widget.weekly.below-average': 'unter Ihrem Wochendurchschnitt liegen',
  'home.widget.weekly.better-than-last': 'besser als letzte Woche',
  'home.widget.weekly.slower-than-last': 'langsamer als letzte Woche',
  'home.widget.weekly.on-track': 'diese Woche auf dem richtigen Weg',
  'home.widget.weekly.room-to-recover': 'Raum zum Erholen',
  'home.widget.weekly.solid-start': 'solider Start in die Woche',
  'home.widget.weekly.early-in-week': 'Anfang der Woche',
  'home.widget.weekly.no-trade-data': 'Keine Trading-Daten',
  'home.widget.weekly.trade': 'Trade',
  'home.widget.weekly.trades': 'Trades',
  'home.widget.weekly.no-trades-tooltip': 'keine Trades',
  'home.widget.heatmap.last-3-months': 'Letzte 3 Monate',
  'home.widget.heatmap.last-6-months': 'Letzte 6 Monate',
  'home.widget.heatmap.year-activity': '{year} Aktivität',
  'home.widget.heatmap.select-year': 'Wählen Sie Jahr aus',
  'home.widget.heatmap.close-selector': 'Jahresauswahl schließen',
  'calendar.weekday.mon': 'Mo',
  'calendar.weekday.tue': 'Di',
  'calendar.weekday.wed': 'Mi',
  'calendar.weekday.thu': 'Do',
  'calendar.weekday.fri': 'Fr',
  'calendar.weekday.sat': 'Sa',
  'calendar.weekday.sun': 'So',
  'calendar.pnl': 'P&L',
  'calendar.week': 'WOCHE',
  'calendar.trade': '{count} Trade',
  'calendar.trades': '{count} Trades',
  'calendar.month.january': 'Januar',
  'calendar.month.february': 'Februar',
  'calendar.month.march': 'März',
  'calendar.month.april': 'April',
  'calendar.month.june': 'Juni',
  'calendar.month.july': 'Juli',
  'calendar.month.august': 'August',
  'calendar.month.september': 'September',
  'calendar.month.october': 'Oktober',
  'calendar.month.november': 'November',
  'calendar.month.december': 'Dezember',
  'trade.loading-navigation': 'Navigation wird geladen...',
  'shared.collapsible.active-filters': '{count} aktive Filter',
  'filter.modal.title': 'Erweiterte Filter',
  'filter.modal.active-filters': 'Aktive Filter ({count}):',
  'filter.modal.no-active-filters': 'Keine aktiven Filter',
  'filter.modal.clear-all': 'Alles löschen',
  'filter.modal.section.trading-data': 'Trading-Daten',
  'filter.modal.section.classification': 'Einstufung',
  'filter.modal.section.trade-criteria': 'Trade-Kriterien',
  'filter.modal.no-setup': 'Kein Setup',
  'filter.modal.no-tags': 'Keine Tags',
  'filter.modal.no-mistakes': 'Keine Fehler',
  'filter.modal.type.regular': 'Regulär',
  'filter.modal.type.missed': 'Verpasst',
  'filter.modal.type.backtest': 'Backtest',
  'filter.summary.regular-trades': 'Regulärer Trades',
  'filter.modal.status.win': 'Gewinn',
  'filter.modal.status.loss': 'Verlust',
  'filter.modal.status.breakeven': 'Break-even',
  'filter.modal.status.open': 'Offen',
  'filter.modal.status.closed': 'Geschlossen',
  'filter.modal.review-status': 'Überprüfungsstatus',
  'filter.modal.review-status.reviewed': 'Überprüft',
  'filter.modal.review-status.unreviewed': 'Nicht überprüft',
  'filter.modal.direction.long-call': 'Long/Kaufoption',
  'filter.modal.direction.short-put': 'Short/Verkaufsoption',
  'filter.modal.section.custom-fields': 'Benutzerdefinierte Felder',
  'filter.modal.custom-field.n-selected': '{count} ausgewählt',
  'filter.modal.custom-field.none-available': 'Keine Werte verfügbar',
  'widget.checklist.title': 'Pre-Trade-Checkliste',
  'widget.checklist.tooltip.day-only':
    'Die hier hinzugefügten Elemente gelten nur für diesen Tag.',
  'widget.checklist.tooltip.settings-link':
    'Für wiederkehrende Elemente zu allen neuen DRCs gehen Sie zu Einstellungen > Reviews.',
  'widget.checklist.completed': 'vollendet',
  'widget.checklist.edit-item': 'Element bearbeiten',
  'widget.checklist.delete-item': 'Element löschen',
  'widget.checklist.empty.preview': 'Keine Checklistenelemente konfiguriert',
  'widget.checklist.empty.add-one':
    'Keine Checklistenpunkte. Fügen Sie unten eines hinzu.',
  'widget.checklist.placeholder': 'Einen neuen Checklistenpunkt hinzufügen...',
  'widget.checklist.invalid-context':
    'Das Checklisten-Widget erfordert eine DRC-Notiz (Frontmatter-Typ: „drc“).',
  'widget.session-mistakes.title': 'Sitzungsfehler',
  'widget.session-mistakes.subtitle':
    'Protokollieren Sie Fehler einmal pro Sitzung, anstatt sie bei jedem Trade zu wiederholen.',
  'widget.session-mistakes.field-label': 'Fehler',
  'widget.session-mistakes.placeholder': 'Fehler auswählen oder erstellen',
  'widget.session-mistakes.empty':
    'Es wurden keine Sitzungsfehler protokolliert',
  'widget.session-mistakes.count': '{count} ausgewählt',
  'widget.session-mistakes.invalid-context':
    'Das Widget „Sitzungsfehler“ erfordert eine DRC-Notiz (Frontmatter-Typ: „drc“).',
  'widget.directional-pnl.title.long': 'Long Trades P&L',
  'widget.directional-pnl.title.short': 'Short Trades P&L',
  'widget.directional-pnl.empty.not-enough':
    'Nicht genügend Trades für eine Richtungsanalyse',
  'widget.directional-pnl.empty.no-closed':
    'Für diesen Zeitraum gibt es keine geschlossenen Trades',
  'widget.directional-pnl.empty.no-long':
    'In diesem Zeitraum gibt es keine langen Trades',
  'widget.directional-pnl.empty.no-short':
    'In diesem Zeitraum gibt es keine Short-Trades',
  'widget.directional-drawdown.title.long': 'Realisierter Long-Drawdown',
  'widget.directional-drawdown.title.short': 'Realisierter Short-Drawdown',
  'widget.directional-drawdown.empty.not-enough':
    'Nicht genügend geschlossene Trades für eine Richtungsanalyse',
  'widget.directional-drawdown.empty.no-closed':
    'Für diesen Zeitraum gibt es keine geschlossenen directional Trades',
  'widget.directional-drawdown.empty.no-long':
    'Für diesen Zeitraum gibt es keine länger geschlossenen Trades',
  'widget.directional-drawdown.empty.no-short':
    'Für diesen Zeitraum gibt es keine geschlossenen Short-Trades',
  'widget.missed-trades.title': 'Trades verpasst',
  'widget.missed-trades.add-button': 'Hinzufügen',
  'widget.missed-trades.add-aria': 'Verpassten Trade hinzufügen',
  'widget.missed-trades.missed-badge': 'Verpasst',
  'widget.missed-trades.additional-setups': 'Zusätzliche Setups:',
  'widget.missed-trades.no-trades-today': 'Heute keine',
  'widget.missed-trades.no-trades-week': 'Keine verpassten Trades diese Woche',
  'widget.missed-trades.invalid-context':
    'Das Widget „Verpasste Trades“ ist nur in DRC und den wöchentlichen Review-Notizen verfügbar.',
  'widget.missed-trades.error-no-date':
    'Das Datum für den neuen verpassten Trade kann nicht ermittelt werden',
  'widget.missed-trades.error-open-form':
    'Das Formular für den verpassten Trade konnte nicht geöffnet werden',
  'widget.backtest-trades.empty':
    'Für diesen Zeitraum gibt es keine Backtest-Trades',
  'widget.trade-table.column.images': 'Bilder',
  'widget.trade-table.column.date': 'Datum',
  'widget.trade-table.column.entry': 'Einstieg',
  'widget.trade-table.column.ticker': 'Tickersymbol',
  'widget.trade-table.column.account': 'Konto',
  'widget.trade-table.column.pnl': 'P&L',
  'widget.trade-table.column.direction': 'Richtung',
  'widget.trade-table.column.setups': 'Setups',
  'widget.trade-table.column.mistakes': 'Fehler',
  'widget.trade-table.empty': 'Keine Trades für diesen Zeitraum',
  'widget.trade-table.status.open': 'OFFEN',
  'widget.trade-table.na': 'N / A',
  'widget.trade-table.unknown': 'Unbekannt',
  'widget.trade-table.unknown-account': 'Unbekanntes Konto',
  'widget.trade-table.image-alt': 'Vorschau Trade {id}',
  'widget.trade-table.fullscreen-title': 'Trade {id} Bild',
  'widget.trade-table.fullscreen-alt': 'Trade {id} Bild {index}',
  'widget.trade-table.duration.days-hours': '{days}d {hours}h',
  'widget.trade-table.duration.hours-mins': '{hours}h {mins}m',
  'widget.trade-table.duration.mins': '{mins}m',
  'widget.trade-table.pagination.showing':
    'Zeigt {start}-{end} von {total}-Trades',
  'widget.trade-table.pagination.prev': '← Zurück',
  'widget.trade-table.pagination.next': 'Weiter →',
  'widget.trade-table.pagination.page': 'Seite {current} von {total}',
  'widget.pagination.showing': 'Zeigt {start}-{end} von {total} {items}',
  'widget.pagination.prev': 'Vorher',
  'widget.pagination.next': 'Nächste',
  'widget.pagination.page': 'Seite {current} von {total}',
  'widget.pagination.weeks': 'Wochen',
  'widget.pagination.months': 'Monate',
  'widget.empty.no-data': 'Keine Daten verfügbar',
  'widget.empty.no-trades': 'Keine Trades für diesen Zeitraum',
  'widget.empty.no-closed-trades':
    'Für diesen Zeitraum gibt es keine geschlossenen Trades',
  'widget.empty.no-daily-data':
    'Für diesen Zeitraum liegen keine Tagesdaten vor',
  'widget.empty.no-weekly-data':
    'Für diesen Zeitraum liegen keine wöchentlichen Daten vor',
  'widget.empty.no-monthly-data':
    'Für diesen Zeitraum liegen keine monatlichen Daten vor',
  'widget.empty.no-quarterly-data':
    'Für diesen Zeitraum liegen keine vierteljährlichen Daten vor',
  'widget.empty.no-setup-data':
    'Für diesen Zeitraum sind keine Setup-Daten verfügbar',
  'widget.empty.no-mental-game-data':
    'Für {period} sind keine mentalen Spieldaten verfügbar',
  'widget.empty.no-technical-game-data':
    'Für {period} sind keine technischen Spieldaten verfügbar',
  'widget.invalid-context.title': 'Ungültiger Kontext',
  'widget.invalid-context.default':
    'Für dieses {widgetType}-Widget ist eine Review- oder Trade-Notiz erforderlich',
  'widget.invalid-context.monthly-quarterly-yearly':
    'Dieses Widget ist nur in monatlichen, vierteljährlichen und jährlichen Reviews verfügbar',
  'widget.invalid-context.quarterly-yearly':
    'Dieses Widget ist nur in vierteljährlichen und jährlichen Reviews verfügbar',
  'widget.invalid-context.yearly-only':
    'Dieses Widget ist nur in Jahresrückblicken verfügbar',
  'widget.invalid-context.monthly-only':
    'Dieses Widget ist nur in den monatlichen Reviews verfügbar',
  'widget.invalid-context.weekly-monthly':
    'Dieses Widget ist nur in wöchentlichen und monatlichen Reviews verfügbar',
  'widget.invalid-context.review-note':
    'Für dieses Widget ist eine DRC-, Wochenrückblick-, Monatsrückblick-, Vierteljahresrückblick- oder Jahresrückblicknotiz erforderlich',
  'widget.key-levels.title': 'Schlüsselebenen',
  'widget.key-levels.support': 'Unterstützung',
  'widget.key-levels.resistance': 'Widerstand',
  'widget.key-levels.no-levels': 'Keine Ebenen definiert',
  'widget.key-levels.price-placeholder': 'Preis...',
  'widget.key-levels.select-importance': 'Wichtigkeit auswählen',
  'widget.key-levels.remove-level': 'Ebene entfernen',
  'widget.key-levels.invalid-context':
    'Das Key Levels-Widget erfordert eine DRC-, Wochenrückblick- oder Monatsrückblick-Notiz.',
  'widget.key-levels.source.weekly': 'Wöchentlich',
  'widget.key-levels.source.monthly': 'Monatlich',
  'widget.key-levels.open-source-review': '{label}-Review öffnen',
  'widget.key-levels.importance.none': 'Keiner',
  'widget.key-levels.importance.high': 'Hoch',
  'widget.key-levels.importance.medium': 'Medium',
  'widget.key-levels.importance.low': 'Niedrig',
  'manual-drawdown.notice.deleted': 'Snapshot gelöscht',
  'manual-drawdown.notice.updated': 'Snapshot aktualisiert',
  'manual-drawdown.notice.added': 'Schnappschuss hinzugefügt',
  'manual-drawdown.validation.date-required': 'Datum ist erforderlich',
  'manual-drawdown.validation.invalid-date':
    'Bitte geben Sie ein gültiges Datum ein',
  'manual-drawdown.validation.future-date':
    'Das Datum darf nicht in der Zukunft liegen',
  'manual-drawdown.validation.limit-required':
    'Ein Drawdown-Limit ist erforderlich',
  'manual-drawdown.validation.limit-positive':
    'Das Drawdown-Limit muss eine positive Zahl sein',
  'manual-drawdown.validation.duplicate-date':
    'Für dieses Datum ist bereits ein Snapshot vorhanden. Bitte wählen Sie ein anderes Datum oder bearbeiten Sie das vorhandene.',
  'manual-drawdown.section.recorded': 'Aufgezeichnete Schnappschüsse',
  'manual-drawdown.table.date': 'Datum',
  'manual-drawdown.table.limit': 'Drawdown-Limit',
  'manual-drawdown.table.note': 'Notiz',
  'manual-drawdown.table.actions': 'Aktionen',
  'manual-drawdown.button.editing': 'Bearbeitung',
  'manual-drawdown.button.edit': 'Bearbeiten',
  'manual-drawdown.button.delete': 'Löschen',
  'manual-drawdown.header.edit': 'Schnappschuss bearbeiten',
  'manual-drawdown.header.add': 'Neuen Snapshot hinzufügen',
  'manual-drawdown.field.date': 'Auszahlungsdatum *',
  'manual-drawdown.field.date-desc': 'Als der Broker dieses Limit herausgab',
  'manual-drawdown.field.limit': 'Drawdown-Limit ($) *',
  'manual-drawdown.field.limit-desc': 'Niedrigster zulässiger Saldo',
  'manual-drawdown.field.note': 'Hinweis (optional)',
  'manual-drawdown.field.note-desc':
    'Zusätzlicher Kontext für diesen Schnappschuss',
  'manual-drawdown.placeholder.note': 'z. B. Abrechnung zum Monatsende',
  'manual-drawdown.button.update': 'Schnappschuss aktualisieren',
  'manual-drawdown.button.add': 'Schnappschuss hinzufügen',
  'manual-drawdown.button.cancel-edit': 'Bearbeiten abbrechen',
  'manual-drawdown.modal.delete-title': 'Snapshot löschen?',
  'manual-drawdown.modal.delete-confirm':
    'Drawdown-Snapshot aus {date} löschen?',
  'manual-drawdown.modal.delete-limit': 'Drawdown-Limit: {limit}',
  'manual-drawdown.modal.delete-warning':
    'Diese Aktion kann nicht rückgängig gemacht werden.',
  'dashboard.selector.title': 'Zum Dashboard hinzufügen',
  'dashboard.selector.metrics': 'Metriken',
  'dashboard.selector.charts': 'Diagramme',
  'dashboard.selector.empty':
    'Alle Kennzahlen und Diagramme wurden hinzugefügt',
  'dashboard.selector.hint.navigate': '↑↓ navigieren',
  'dashboard.selector.hint.select': 'Enter auswählen',
  'dashboard.selector.hint.close': 'esc schließen',
  'dashboard.component-selector.title': 'Widget hinzufügen',
  'dashboard.component-selector.added': 'Hinzugefügt',
  'dashboard.component-selector.category.performance': 'Leistung',
  'dashboard.component-selector.category.analysis': 'Analyse',
  'dashboard.component-selector.category.journal': 'Zeitschrift',
  'widget.pnlChart.name': 'Kumulativ P&L',
  'widget.pnlChart.description':
    'Liniendiagramm, das die kumulative P&L im Zeitverlauf zeigt',
  'widget.longPnLChart.name': 'Long-G/V',
  'widget.longPnLChart.description':
    'Kumulative P&L-Kurve nur für geschlossene Long-Trades',
  'widget.shortPnLChart.name': 'Short-G/V',
  'widget.shortPnLChart.description':
    'Kumulative P&L-Kurve nur für geschlossene Short-Trades',
  'widget.performanceCalendar.name': 'Leistungskalender',
  'widget.performanceCalendar.description':
    'Kalenderansicht mit Anzeige der täglichen Leistung',
  'widget.dailyPerformance.name': 'Tägliche Performance',
  'widget.dailyPerformance.description':
    'Balkendiagramm mit P&L für jeden Trading-Tag',
  'widget.tradesChart.name': 'Trades-Diagramm',
  'widget.tradesChart.description':
    'Balkendiagramm mit P&L für jeden einzelnen Trade',
  'widget.weekdayPerformance.name': 'Wochentag-Performance',
  'widget.weekdayPerformance.description':
    'Balkendiagramm, das die Leistung für jeden Wochentag zeigt',
  'widget.hourlyPerformance.name': 'Stündliche Performance',
  'widget.hourlyPerformance.description':
    'Balkendiagramm mit P&L für jede Stunde des Tages',
  'widget.tradesChart.limit': '{count} Trades',
  'widget.drawdownChart.name': 'Rückgang Chart',
  'widget.drawdownChart.description':
    'Drawdown-Betrag aus geschlossenen Trades seit dem vorherigen realisierten GuV-Hoch',
  'widget.directionalDrawdownChart.name':
    'Richtungsbezogener realisierter Drawdown',
  'widget.directionalDrawdownChart.description':
    'Zeigt separate Long- und Short-Drawdown-Betragskurven aus geschlossenen Trades',
  'widget.longDrawdownChart.name': 'Realisierter Long-Drawdown',
  'widget.longDrawdownChart.description':
    'Zeigt die Drawdown-Betragskurve aus geschlossenen Long-Trades',
  'widget.shortDrawdownChart.name': 'Realisierter Short-Drawdown',
  'widget.shortDrawdownChart.description':
    'Zeigt die Drawdown-Betragskurve aus geschlossenen Short-Trades',
  'widget.drawdownStats.name': 'Statistiken zum realisierten Drawdown',
  'widget.drawdownStats.description':
    'Statistiken zu realisiertem Drawdown und Erholung',
  'widget.drawdownStats.no-conversion':
    'Für gemischte Währungen ohne FX-Umrechnung sind keine Drawdown-Statistiken verfügbar.',
  'widget.recentTrades.name': 'Aktuelle Trades',
  'widget.recentTrades.description':
    'Zeigt die 10 letzten Trades mit Details an',
  'widget.recentTrades.date': 'Datum',
  'widget.recentTrades.ticker': 'Tickersymbol',
  'widget.recentTrades.direction': 'Richtung',
  'widget.recentTrades.pnl': 'P&L',
  'widget.recentTrades.no-trades': 'Keine Trades gefunden',
  'widget.recentTrades.empty-submessage':
    'Versuchen Sie, einen anderen Datumsbereich auszuwählen',
  'widget.recentTrades.unknown': 'Unbekannt',
  'widget.rollingWinRate.name': 'Rollierendes Gewinn-/Verlustverhältnis',
  'widget.rollingWinRate.description':
    'Zeigt das Verhältnis der durchschnittlichen Gewinne zu den durchschnittlichen Verlusten über einen rollierenden Zeitraum',
  'widget.rollingStats.name': 'Rollierender durchschnittlicher Gewinn/Verlust',
  'widget.rollingStats.description':
    'Zeigt den durchschnittlichen Gewinn und Verlust über einen fortlaufenden Zeitraum an',
  'forecast.chart-title': '{title}-Diagramm',
  'forecast.upload-label': 'Laden Sie das {title}-Diagramm hoch',
  'forecast.upload-label-plural': 'Laden Sie {title}-Charts hoch',
  'forecast.alt-text': '{title} Prognose',
  'forecast.description': '{title} Prognose',
  'forecast.notes-placeholder': 'Fügen Sie hier Ihre {title}-Notizen hinzu...',
  'filter.chip.remove-aria': 'Entfernen Sie den {label}-Filter',
  'shared.filter.disabled-preview': 'Filter in der Vorschau deaktiviert',
  'shared.filter.open': 'Filter öffnen',
  'shared.filter.active-count': '{count} aktive Filter',
  'ui.toggle-switch.aria-label': 'Kippschalter',
  'ui.folder-browser.placeholder': 'Wählen Sie einen Ordner aus...',
  'ui.folder-browser.root': 'Wurzel',
  'ui.folder-browser.clear-aria':
    'Deaktivieren Sie die Option, um den Standardspeicherort zu verwenden',
  'icon-select.default-title': 'Wählen Sie eine Option',
  'combobox.placeholder.default': 'Auswählen oder eingeben...',
  'combobox.aria.remove-item': 'Entfernen Sie {item}',
  'combobox.add-option': '„{value}“ hinzufügen',
  'error.render-component': 'Fehler beim Rendern von {component}: {error}',
  'error.session-expired':
    'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut in den Plugin-Einstellungen an.',
  'error.ftp-not-found':
    'FTP-Konto nicht gefunden. Das System erstellt automatisch eines für Sie.',
  'error.no-trading-data':
    'Keine Trading-Daten gefunden. Bitte stellen Sie sicher, dass Ihr MetaTrader-Konto ordnungsgemäß verbunden ist und über eine Trade-Historie verfügt.',
  'error.unable-connect-service':
    'Es kann keine Verbindung zum Trading-Datenservice hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung.',
  'error.invalid-verification-code':
    'Ungültiger Bestätigungscode. Bitte überprüfen Sie den Code und versuchen Sie es erneut.',
  'error.invalid-registration-data':
    'Ungültige Registrierungsdaten. Bitte überprüfen Sie Ihre Einstellungen und versuchen Sie es erneut.',
  'error.invalid-request':
    'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.',
  'error.access-denied':
    'Zugriff verweigert. Bitte überprüfen Sie Ihre Kontoberechtigungen oder wenden Sie sich an den Support.',
  'error.too-many-requests':
    'Zu viele Anfragen. Bitte warten Sie einen Moment, bevor Sie es erneut versuchen.',
  'error.service-unavailable':
    'Der Trading-Datenservice ist vorübergehend nicht verfügbar. Bitte versuchen Sie es in ein paar Minuten noch einmal.',
  'error.server-error':
    'Es ist ein Serverfehler aufgetreten. Bitte versuchen Sie es später erneut oder wenden Sie sich an den Support, wenn das Problem weiterhin besteht.',
  'error.network-error':
    'Es kann keine Verbindung zum Trading-Datenservice hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
  'error.unknown': 'Es ist ein unbekannter Fehler aufgetreten',
  'error.unexpected':
    'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut oder wenden Sie sich an den Support, wenn das Problem weiterhin besteht.',
  'error.settings.invalid-pattern':
    'Ungültiges Validierungsmuster. Bitte überprüfen Sie Ihren regulären Ausdruck und versuchen Sie es erneut.',
  'error.settings.field-name-conflict':
    'Dieser Feldname steht in Konflikt mit einem vorhandenen Feld. Bitte wählen Sie einen anderen Namen.',
  'error.settings.invalid-field-name':
    'Ungültiger Feldname. Feldnamen dürfen nur Buchstaben, Zahlen und Unterstriche enthalten.',
  'error.settings.save-failed':
    'Ihre Änderungen können nicht gespeichert werden. Bitte überprüfen Sie Ihre Einstellungen und versuchen Sie es erneut.',
  'error.settings.load-failed':
    'Benutzerdefinierte Feldeinstellungen können nicht geladen werden. Ihre benutzerdefinierten Felder werden möglicherweise nicht richtig angezeigt.',
  'error.settings.import-failed':
    'Feldeinstellungen können nicht importiert werden. Bitte überprüfen Sie das Dateiformat und versuchen Sie es erneut.',
  'error.settings.create-failed':
    'Das benutzerdefinierte Feld kann nicht erstellt werden. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.',
  'error.settings.remove-failed':
    'Das benutzerdefinierte Feld kann nicht entfernt werden. Bitte versuchen Sie es erneut.',
  'error.settings.generic':
    'Beim Verwalten benutzerdefinierter Felder ist ein Fehler aufgetreten. Bitte überprüfen Sie Ihre Einstellungen und versuchen Sie es erneut.',
  'error.options.duplicate':
    'Diese Option besteht bereits. Bitte wählen Sie einen anderen Namen.',
  'error.options.invalid-ticker':
    'Ungültiges Tickersymbol. Verwenden Sie nur Buchstaben, Zahlen und Punkte (z. B. AAPL, SPX).',
  'error.options.add-ticker-failed':
    'Das Tickersymbol konnte nicht hinzugefügt werden. Bitte überprüfen Sie das Format und versuchen Sie es erneut.',
  'error.options.add-failed':
    'Option kann nicht hinzugefügt werden. Es kann bereits vorhanden oder ungültig sein.',
  'error.options.update-failed':
    'Option kann nicht aktualisiert werden. Es kann bereits vorhanden oder ungültig sein.',
  'error.options.remove-failed':
    'Option kann nicht entfernt werden. Bitte versuchen Sie es erneut.',
  'error.options.no-options-reset':
    'Keine Optionen zum Zurücksetzen. Die Kategorie ist bereits leer.',
  'error.options.reset-failed':
    'Optionen können nicht zurückgesetzt werden. Bitte versuchen Sie es erneut.',
  'error.options.save-failed':
    'Optionsänderungen können nicht gespeichert werden. Bitte überprüfen Sie Ihre Einstellungen und versuchen Sie es erneut.',
  'error.options.generic':
    'Beim Verwalten der Optionen ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
  'error.clipboard.permission-denied':
    'Zugriff auf die Zwischenablage verweigert. Bitte erlauben Sie in Ihrem Browser die Berechtigung zur Zwischenablage für die Einfügefunktion.',
  'error.clipboard.not-supported':
    'Das Einfügen in die Zwischenablage wird in Ihrem Browser nicht unterstützt. Versuchen Sie es stattdessen mit Strg+V oder Befehl+V.',
  'error.clipboard.image-too-large':
    'Das Bild ist zu groß zum Einfügen. Bitte verwenden Sie Bilder, die kleiner als 10 MB sind.',
  'error.clipboard.no-content':
    'In der Zwischenablage wurde nichts zum Einfügen gefunden. Versuchen Sie zunächst, ein Bild zu kopieren.',
  'error.clipboard.no-images':
    'Keine Bilder in der Zwischenablage gefunden. Prüfen Sie, dass Sie ein Bild kopiert haben, keinen Text oder anderen Inhalt.',
  'error.clipboard.no-target':
    'Kein Bild-Upload-Bereich gefunden. Klicken Sie zuerst auf einen Bild-Upload-Bereich und fügen Sie dann Ihr Bild ein.',
  'error.clipboard.network-error':
    'Beim Verarbeiten des Einfügens ist ein Netzwerkfehler aufgetreten. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
  'error.clipboard.paste-failed':
    'Der Einfügevorgang konnte nicht abgeschlossen werden. Versuchen Sie bitte erneut, das Bild zu kopieren und einzufügen.',
  'error.clipboard.generic':
    'Der Zwischenablagevorgang ist fehlgeschlagen. Bitte versuchen Sie erneut, Ihren Inhalt zu kopieren und einzufügen.',
  'datetime.placeholder.time': '1022p oder 10:22 Uhr',
  'datetime.aria.open-picker': 'Datumsauswahl öffnen',
  'datetime.error.date-required': 'Datum erforderlich',
  'datetime.error.invalid-format': 'Ungültiges Format',
  'datetime.error.date-6-digits':
    'Das Datum muss 6-stellig sein (Format TTMMJJ).',
  'datetime.error.invalid-month': 'Ungültiger Monat',
  'datetime.error.invalid-day': 'Ungültiger Tag',
  'datetime.error.invalid-date': 'Ungültiges Datum',
  'datetime.error.invalid-time-format': 'Ungültiges Zeitformat',
  'datetime.error.time-3-4-digits': 'Die Zeit muss drei- oder vierstellig sein',
  'datetime.error.hours-1-12':
    'Die Stunden müssen zwischen 1 und 12 Uhr mit AM/PM liegen',
  'datetime.error.hours-0-23':
    'Die Stunden müssen im 24-Stunden-Format zwischen 0 und 23 liegen',
  'datetime.error.minutes-0-59': 'Die Minuten müssen zwischen 0 und 59 liegen',
  'modal.template-switch.title': 'Vorlage wechseln?',
  'modal.template-switch.switching-from': 'Du wechselst von',
  'modal.template-switch.switching-to': 'Zu',
  'modal.template-switch.has-content-title': 'Diese Notiz hat Inhalt',
  'modal.template-switch.has-content-desc':
    'Der Inhalt wird neu organisiert, um dem neuen Layout zu entsprechen. Alle Inhalte, die nicht passen, werden am Ende der Notiz gespeichert, damit Sie sie überprüfen können.',
  'modal.template-switch.cannot-undo':
    'Dies kann nicht rückgängig gemacht werden (Sie können jedoch zurückwechseln).',
  'modal.template-switch.button.switch': 'Vorlage wechseln',
  'monthly.game.header.week': 'Woche',
  'monthly.game.header.a-games': 'Ein Spiel',
  'monthly.game.header.b-games': 'B-Spiele',
  'monthly.game.header.c-games': 'C-Spiele',
  'monthly.game.header.rating': 'Bewertung',
  'monthly.game.header.notes': 'Notizen',
  'monthly.game.week-label': 'W{week}',
  'monthly.game.rating-na': 'N / A',
  'monthly.game.no-data':
    'Für diesen Monat sind keine Leistungsdaten verfügbar',
  'release-notes.title': 'Versionshinweise',
  'release-notes.loading-plugin': 'Plugin wird geladen...',
  'release-notes.loading': 'Versionshinweise werden geladen...',
  'release-notes.no-content': 'Keine Versionshinweise gefunden',
  'release-notes.current-version': 'Aktuell: v{version}',
  'release-notes.version': 'Version {version}',
  'release-notes.link.docs': 'Dokumente',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',
  'skeleton.tradelog.loading': 'Trading-Daten werden geladen',
  'skeleton.dashboard-widget.loading': 'Widget-Daten werden geladen',
  'skeleton.account-page.loading': 'Kontoseite wird geladen',
  'grid.aria.retry': 'Versuchen Sie erneut, das Rasterlayout zu laden',
  'grid.aria.remove-widget': 'Widget entfernen',
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'CSV-Export des Fills-Widgets',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Öffnen Sie das Fills-Widget in TT und wechseln Sie zur Ansicht „Detail“, „Kontinuierlich“ oder „Preis mit Detail“.',
  'csv.broker-guide.tradingtechnologies.step-2':
    'Klicken Sie mit der rechten Maustaste in das Fills-Widget, wählen Sie „Download anfordern“ und wählen Sie den Zeitraum aus',
  'csv.broker-guide.tradingtechnologies.step-3':
    'Wenn TT die Download-Bereitschaftsbenachrichtigung anzeigt, laden Sie CSV herunter und importieren Sie es hier',
  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Wichtig:',
  'csv.broker-guide.tradingtechnologies.warning.message':
    'Bearbeiten Sie die exportierte Datei oder Spaltenreihenfolge vor dem Importieren nicht.',
  'csv.broker-guide.tradingtechnologies.doc-label':
    'Sehen Sie sich die Exportanweisungen von Trading Technologies an',
  'trade.metadata.broker-comment': 'Broker-Kommentar',
  'trade.metadata.additional-fields': 'Zusätzliche Felder',
  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'Performance-Kalender',
  'navigation.section.overview': 'Überblick',
  'navigation.section.reviews': 'Reviews',
  'navigation.section.tools': 'Werkzeuge',
  'navigation.edit-mode.toggle': 'Passen Sie die Navigation an',
  'navigation.edit-mode.hide-item': 'Navigationselement ausblenden',
  'navigation.edit-mode.restore-section': 'Versteckte Gegenstände',
  'navigation.edit-mode.restore': 'Wiederherstellen',
  'navigation.items.nav-home': 'Heim',
  'navigation.items.nav-dashboard': 'Trading-Dashboard',
  'navigation.items.nav-trade-log': 'Trade-Log',
  'navigation.items.nav-account-dashboard': 'Konto-Dashboard',
  'navigation.items.nav-drc': 'Der heutige DRC',
  'navigation.items.nav-weekly': 'Der Rückblick dieser Woche',
  'navigation.items.nav-monthly': 'Der Rückblick dieses Monats',
  'navigation.items.nav-quarterly': 'Rückblick dieses Quartals',
  'navigation.items.nav-yearly': 'Der diesjährige Rückblick',
  'navigation.items.nav-add-trade': 'Trade hinzufügen',
  'navigation.items.nav-layout-builder': 'Layout-Builder',
  'navigation.items.nav-quick-import': 'Schnellimport',
  'navigation.items.nav-csv-import': 'Handelsimport',
  'navigation.items.nav-session-mode': 'Sitzungsmodus',
  'navigation.items.nav-position-size': 'Positionsgrößenrechner',
  'settings.general.navigation-sidebar': 'Navigationsseitenleiste',
  'navigation.setting.tab-behavior': 'Verhalten der Navigationsregisterkarte',
  'navigation.setting.tab-behavior.desc':
    'So öffnen Sie Ansichten, wenn Sie in der Navigationsseitenleiste darauf klicken',
  'navigation.setting.tab-behavior.new-tab': 'In neuem Tab öffnen',
  'navigation.setting.tab-behavior.replace': 'Aktive Registerkarte ersetzen',
  'navigation.search.placeholder': 'Suchen Sie nach Trades und Reviews...',
  'navigation.search.clear': 'Suche löschen',
  'navigation.search.section.trades': 'Trades',
  'navigation.search.section.reviews': 'Reviews',
  'navigation.search.empty': 'Keine Ergebnisse gefunden',
  'navigation.search.trade-open': 'Offen',
  'navigation.search.review.drc': 'Täglicher Rückblick',
  'navigation.search.review.weekly': 'Wöchentlicher Rückblick',
  'navigation.search.review.monthly': 'Monatlicher Rückblick',
  'navigation.search.review.quarterly': 'Vierteljährlicher Rückblick',
  'navigation.search.review.yearly': 'Jahresrückblick',
  'command.open-navigation-sidebar': 'Navigationsseitenleiste öffnen',
  'command.open-calendar-sidebar': 'Kalender-Seitenleiste öffnen',
  'widget.previous-trading-day-context.name':
    'Kontext des vorherigen Handelstags',
  'widget.previous-trading-day-context.description':
    'Kontext aus dem vorherigen DRC',
  'widget.previous-trading-day-context.reference-label':
    'Vorherige DRC-Referenz',
  'widget.previous-trading-day-context.open-source': 'Vorherigen DRC öffnen',
  'widget.previous-trading-day-context.image-alt-prefix': 'Vorheriges DRC-Bild',
  'widget.previous-trading-day-context.no-sections-configured':
    'Wähle mindestens einen Abschnitt in den Template-Einstellungen aus.',
  'widget.previous-trading-day-context.preview-note':
    'Gestern hat der Kurs Liquidität abgeholt, am Wochenlevel reagiert und wieder innerhalb der geplanten Range geschlossen.',
  'widget.previous-trading-day-context.preview-bullet-two':
    'Hauptabweichung: Einstieg vor Bestätigung beim ersten Pullback.',
  'widget.previous-trading-day-context.preview-source':
    'Vorschau: vorheriger DRC vom letzten Handelstag',
  'widget.previous-trading-day-context.preview-bullet-one':
    'Der Tagesbias passte nach dem Eröffnungsimpuls zum Plan.',
  'widget.weekly-drc-context.name': 'Tagesreviews nach Wochentag',
  'widget.weekly-drc-context.description':
    'DRC-Abschnitte pro Wochentag anzeigen',
  'widget.weekly-drc-context.header-eyebrow': 'Wochenreview',
  'widget.weekly-drc-context.header-title': 'Tagesreviews nach Wochentag',
  'widget.weekly-drc-context.image-alt-prefix': 'Wöchentliches DRC-Bild',
  'widget.weekly-drc-context.no-activity': 'Keine Aktivität für diesen Tag.',
  'widget.weekly-drc-context.no-sections-configured':
    'Wähle mindestens einen DRC-Abschnitt in den Vorlageneinstellungen aus.',
  'widget.weekly-drc-context.current-week-not-found':
    'Aktuelle Wochenreview nicht gefunden.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'Datum der aktuellen Wochenreview nicht gefunden.',
  'widget.weekly-drc-context.load-error':
    'Wöchentliche DRC-Review konnte nicht geladen werden.',
  'widget.weekly-drc-context.invalid-context':
    'Dieses Widget ist nur in Wochenreviews verfügbar',
  'templateEditor.widget.weekly-drc-day-label': 'Tag',
  'templateEditor.widget.weekly-drc-display-label': 'Anzeige',
  'templateEditor.widget.weekly-drc-start-collapsed': 'Eingeklappt starten',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': 'Karte',
  'templateEditor.widget.weekly-drc-style-accordion': 'Accordion',
  'templateEditor.widget.weekly-drc-default-expanded': 'Expanded by default',
  'templateEditor.widget.previous-context-sections-label':
    'Einzuschließende Abschnitte',
  'templateEditor.widget.previous-context-heading-label':
    'Abschnittsüberschrift aus vorherigem DRC',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Überschrift auswählen oder eingeben',
  'templateEditor.widget.review-context-fields.selection': 'Fields to display',
  'templateEditor.widget.review-context-fields.selection.all': 'All fields',
  'templateEditor.widget.review-context-fields.selection.group': 'Field group',
  'templateEditor.widget.review-context-fields.selection.fields':
    'Specific fields',
  'templateEditor.widget.review-context-fields.group': 'Group',
  'templateEditor.widget.review-context-fields.group-placeholder':
    'Select group',
  'templateEditor.widget.review-context-fields.fields': 'Fields',
  'templateEditor.widget.review-context-fields.fields-placeholder':
    'Select fields',
  'templateEditor.widget.review-context-fields.fields-selected':
    '{count} fields selected',
  'templateEditor.widget.review-context-fields.no-fields':
    'Create review fields in Settings first.',
  'templateEditor.widget.review-context-fields.show-inherited':
    'Show inherited context',
  'templateEditor.widget.review-context-fields.show-local':
    'Show current review values',
  'templateEditor.widget.review-context-fields.context': 'Context',
  'templateEditor.widget.review-context-fields.context.both': 'Both',
  'templateEditor.widget.review-context-fields.inherited': 'Inherited',
  'templateEditor.widget.review-context-fields.current': 'Current',
  'templateEditor.widget.review-context-fields.empty-values': 'Empty values',
  'templateEditor.widget.review-context-fields.hide-empty': 'Hide empty values',
  'templateEditor.widget.trade-review.primary-metrics': 'Primäre Kennzahlen',
  'templateEditor.widget.trade-review.classification': 'Klassifizierung',
  'templateEditor.widget.trade-review.more-context': 'Mehr Kontext',
  'templateEditor.widget.trade-review.display': 'Anzeige',
  'templateEditor.widget.trade-review.show-images': 'Bilder anzeigen',
  'templateEditor.widget.trade-review.fields-none': 'Keine Felder',
  'templateEditor.widget.trade-review.fields-all': 'Alle Felder',
  'templateEditor.widget.trade-review.fields-count': '{count} Felder',
  'templateEditor.widget.trade-review.no-fields': 'Keine Felder verfügbar',
  'templateEditor.widget.previous-context-add-section':
    '+ Abschnitt hinzufügen',
  'templateEditor.widget.previous-context-headings-label':
    'Headings to include',
  'templateEditor.widget.previous-context-headings-placeholder':
    'Heading names separated by comma or |',
  'templateEditor.widget.previous-context-fallback-label':
    'Previous DRC fallback',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Nearest earlier DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Expected previous trading day only',

  'settings.general.include-copy-accounts-analytics':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-analytics-desc':
    'When enabled, all-account trading analytics include derived copy-account results and count them as account-level trades.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-toggled':
    'Copy accounts in all-account analytics {status}',
  'settings.customization.options.commission.costs': 'Costs',
  'settings.customization.options.commission.add-rule': '+ Add cost rule',
  'settings.customization.options.commission.applies-to': 'Applies to',
  'settings.customization.options.commission.method': 'Method',
  'settings.customization.options.commission.entry': 'Entry',
  'settings.customization.options.commission.exit': 'Exit',
  'settings.customization.options.commission.round-trip': 'Round trip',
  'settings.customization.options.commission.actions': 'Actions',
  'settings.customization.options.commission.all-accounts': 'All accounts',
  'settings.customization.options.commission.per-side': 'Per side',
  'settings.customization.options.commission.remove-rule': 'Remove cost rule',
  'settings.customization.trade-fields': 'Custom Trade Fields',
  'settings.customization.review-fields': 'Custom Review Fields',
  'settings.customization.review-fields.description':
    'Create custom fields for review notes. These fields are stored under reviewCustomFields and can later be inherited across monthly, weekly, and daily reviews.',
  'settings.customization.review-fields.title': 'Review Fields ({count})',
  'settings.customization.review-fields.manage-desc':
    'Manage custom fields for review notes',
  'settings.customization.review-fields.no-fields':
    'No custom review fields defined yet',
  'settings.customization.review-fields.no-fields-desc':
    'Review fields will be used by review-note widgets and will not appear in the trade form or Trade Log.',
  'settings.customization.review-fields.add-button': 'Add Review Field',
  'settings.customization.review-fields.delete-all-button':
    'Delete All Review Fields',
  'settings.customization.review-fields.add-new': 'Add New Review Field',
  'settings.customization.review-fields.edit-field-with-name':
    'Edit “{fieldLabel}”',
  'settings.customization.review-fields.configure-desc':
    'Configure your review field settings below',
  'settings.customization.review-fields.actions-desc':
    'Manage your custom review fields',
  'settings.customization.review-fields.default-label': 'New Review Field',
  'settings.customization.review-fields.unknown-field': 'Unknown Review Field',
  'settings.customization.review-fields.field-summary':
    'Type: {type} • Reviews: {reviews}',
  'settings.customization.review-fields.error.save-failed':
    'Failed to save review field. Please try again.',
  'settings.customization.review-fields.delete.confirm-message':
    'Are you sure you want to delete the custom review field "{fieldLabel}"?',
  'settings.customization.review-fields.reset.confirm-message':
    'Are you sure you want to delete ALL custom review fields?',
  'settings.customization.review-fields.editor.title':
    'Review Field Configuration',
  'settings.customization.review-fields.editor.label-desc':
    'Display name for this review field',
  'settings.customization.review-fields.editor.label-placeholder':
    'Enter review field label',
  'settings.customization.review-fields.editor.key': 'Review Field Key',
  'settings.customization.review-fields.editor.key-desc':
    'This key will be stored inside review note frontmatter at',
  'settings.customization.review-fields.editor.type-desc':
    'Type of review field input',
  'settings.customization.review-fields.editor.description': 'Description',
  'settings.customization.review-fields.editor.description-desc':
    'Optional help text for this review field',
  'settings.customization.review-fields.editor.description-placeholder':
    'Explain how this field should be used',
  'settings.customization.review-fields.editor.placeholder-desc':
    'Optional placeholder text shown when entering a local review value',
  'settings.customization.review-fields.editor.placeholder-input':
    'Enter review field placeholder',
  'settings.customization.review-fields.editor.display-group': 'Display Group',
  'settings.customization.review-fields.editor.display-group-desc':
    'Optional group name used by review field widgets',
  'settings.customization.review-fields.editor.display-group-placeholder':
    'Planning, Risk, Execution...',
  'settings.customization.review-fields.editor.group': 'Field Group',
  'settings.customization.review-fields.editor.group-desc':
    'Choose the review field group this field belongs to.',
  'settings.customization.review-fields.groups.add-button': 'Add Group',
  'settings.customization.review-fields.groups.default-name': 'New Group',
  'settings.customization.review-fields.groups.untitled': 'Untitled Group',
  'settings.customization.review-fields.groups.ungrouped': 'Ungrouped',
  'settings.customization.review-fields.groups.field-count': '{count} fields',
  'settings.customization.review-fields.groups.empty':
    'No fields in this group yet.',
  'settings.customization.review-fields.groups.rename-prompt': 'Group name',
  'settings.customization.review-fields.groups.delete-message':
    'Delete the review field group "{groupName}"?',
  'settings.customization.review-fields.groups.delete-note':
    'Fields in this group will become ungrouped. Their saved review values are not deleted.',
  'settings.customization.review-fields.groups.error.duplicate':
    'A review field group with this name already exists.',
  'settings.customization.review-fields.groups.error.save-failed':
    'Failed to save review field group.',
  'settings.customization.review-fields.editor.compact': 'Compact Display',
  'settings.customization.review-fields.editor.compact-desc':
    'Prefer compact rendering when this field appears in review widgets',
  'settings.customization.review-fields.editor.appears-on': 'Appears On',
  'settings.customization.review-fields.editor.appears-on-desc':
    'Review note types that can show this field',
  'settings.customization.review-fields.editor.editable-on': 'Editable On',
  'settings.customization.review-fields.editor.editable-on-desc':
    'Review note types where users can enter a local value',
  'settings.customization.review-fields.editor.inherit-to': 'Inherited Into',
  'settings.customization.review-fields.editor.inherit-to-desc':
    'Lower review note types that can display inherited values from this field',
  'settings.customization.review-fields.editor.inheritance':
    'Enable Inheritance',
  'settings.customization.review-fields.editor.inheritance-desc':
    'Allow this field to be read from higher-timeframe review notes',
  'settings.customization.review-fields.editor.inheritance-mode':
    'Inheritance Mode',
  'settings.customization.review-fields.editor.inheritance-mode-desc':
    'Controls whether child reviews show inherited values, local values, or both',
  'settings.customization.review-fields.editor.sources': 'Inheritance Sources',
  'settings.customization.review-fields.editor.sources-desc':
    'Higher-timeframe review types this field can inherit from',
  'settings.customization.review-fields.editor.required-desc':
    'Require a local value when this field is editable on a review note',
  'settings.customization.review-fields.editor.options-desc':
    'Available choices for this review field',
  'settings.customization.review-fields.editor.allow-create-desc':
    'Users can create new options when using this field in review notes',
  'settings.customization.review-fields.editor.save': 'Save Review Field',
  'settings.customization.review-fields.editor.delete': 'Delete Review Field',
  'settings.customization.review-fields.inheritance-mode.inherit-only':
    'Inherited only',
  'settings.customization.review-fields.inheritance-mode.local-only':
    'Local only',
  'settings.customization.review-fields.inheritance-mode.inherit-and-local':
    'Inherited and local',

  'account.edit.modal.delete.delete-associated-trades':
    'Auch alle mit diesem Konto verknüpften Trades aus meinem Vault löschen',
  'calendar.aria.open-daily-review': 'Tagesrückblick für {date} öffnen',
  'calendar.aria.open-weekly-review': 'Wochenrückblick für {date} öffnen',
  'trade.header.aria.status': 'Trade-Status: {status}',
  'csv.mapper.aria.map-column': 'Spalte {header} zuordnen',
  'trade-import.error.file-too-large':
    'Die ausgewählte Datei überschreitet die Größenbeschränkung für Trade Import',
  'trade-import.error.file-type-unsupported':
    'Der ausgewählte Dateityp wird von Trade Import nicht unterstützt',
  'trade-import.error.broker-file-type-unsupported':
    'Der ausgewählte Broker unterstützt diesen Dateityp nicht',
  
  'quick-import.title': 'Schnellimport',
  'quick-import.subtitle':
    'Nutze dein bevorzugtes Trade-Import-Setup, um eine Datei schneller zu prüfen und zu importieren.',
  'quick-import.gate.sign-in':
    'Melde dich an, um den Schnellimport mit deinem gespeicherten Setup zu nutzen.',
  'quick-import.gate.pro': 'Schnellimport ist in Trade Import Pro enthalten.',
  'quick-import.message.needs-setup':
    'Wähle in Trade Import einen bevorzugten Broker oder eine Vorlage aus, bevor du den Schnellimport nutzt.',
  'quick-import.message.capabilities-failed':
    'Das Schnellimport-Setup konnte nicht geladen werden.',
  'quick-import.message.mapping-required':
    'Diese Datei benötigt eine Spaltenzuordnung. Öffne den vollständigen Trade-Import-Ablauf, um die Zuordnung zu prüfen.',
  'quick-import.message.preview-failed':
    'Diese Datei muss im vollständigen Trade-Import-Ablauf geprüft werden.',
  'quick-import.message.no-importable':
    'No importable trades were found. Review this file in Trade Import for details.',
  'quick-import.notice.consent-required':
    'Bestätige die Verarbeitung, bevor du hochlädst.',
  'quick-import.consent':
    'Ich verstehe, dass diese Datei zur Verarbeitung auf Journalit-Server hochgeladen wird.',
  'quick-import.privacy-note':
    'Dateien werden zur Verarbeitung auf Journalit-Server hochgeladen und standardmäßig nicht gespeichert.',
  'quick-import.dropzone.title': 'Broker-Export hier ablegen',
  'quick-import.dropzone.subtitle': 'Oder klicken, um eine Datei auszuwählen',
  'quick-import.status.loading': 'Schnellimport-Setup wird geladen...',
  'quick-import.status.checking-subscription':
    'Abonnementstatus wird geprüft...',
  'quick-import.status.analysing':
    'Analyse läuft und Vorschau wird vorbereitet...',
  'quick-import.status.importing': 'Import läuft...',
  'quick-import.processing.sent-to-server':
    'Uploaded to Journalit for private processing',
  'quick-import.file.selected': 'Selected file',
  'quick-import.file.processed': 'Processed and ready to write to your vault',
  'quick-import.summary.title': 'Bereit zum Import',
  'quick-import.summary.trades': 'Vorschau-Trades',
  'quick-import.summary.to-import': 'Zu importieren',
  'quick-import.summary.duplicates': 'Duplikate',
  'quick-import.summary.failed': 'Prüfung nötig',
  'quick-import.complete.title': 'Import abgeschlossen',
  'quick-import.complete.message':
    '{written} geschrieben, {duplicates} Duplikate, {failed} müssen geprüft werden.',
  'quick-import.action.open-full': 'Vollständigen Trade Import öffnen',
  'quick-import.action.review-in-trade-import': 'In Trade Import prüfen',
  'quick-import.action.setup-in-trade-import': 'In Trade Import einrichten',
  'quick-import.action.import': 'Trades importieren',
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import-count': 'Import {count} trades',
  'quick-import.preview.more': '+ {count} more processed trades',

  'trade-import.notice.capabilities-failed':
    'Trade-Import-Funktionen konnten nicht geladen werden',
  'trade-import.notice.template-exists':
    'Eine Trade-Import-Vorlage mit diesem Namen existiert bereits',
  'trade-import.notice.template-saved': 'Trade-Import-Vorlage gespeichert',
  'trade-import.notice.analyse-failed': 'Trade-Import-Analyse fehlgeschlagen',
  'trade-import.notice.preview-failed': 'Trade-Import-Vorschau fehlgeschlagen',
  'trade-import.preview-error.guidance':
    'Prüfe, ob alle Pflichtfelder zugeordnet sind, das ausgewählte Datumsformat zur Datei passt und numerische Spalten gültige Trade-Werte enthalten.',
  'trade-import.notice.complete':
    'Trade Import abgeschlossen: {written} geschrieben oder aktualisiert, {duplicateCount} Duplikate, {failedCount} fehlgeschlagen',
  'trade-import.gate.brand-left': 'Trades',
  'trade-import.gate.brand-right': 'Importieren',
  'trade-import.gate.sign-in':
    'Melde dich an, bevor du Broker-Exporte für Trade Import hochlädst.',
  'trade-import.gate.upgrade':
    'Trade Import ist eine Pro-Funktion. Für das Hochladen von Broker-Exporten ist ein Upgrade erforderlich.',
  'trade-import.action.open-settings': 'Einstellungen öffnen',
  'trade-import.action.manage-subscription': 'Abonnement verwalten',
  'trade-import.description':
    'Lade CSV-, XLSX-, XLS-, HTML- oder Broker-Statement-Exporte für backendgestützte Analyse und Vorschau hoch.',
  'trade-import.step.select': '1. Import-Einstellungen auswählen',
  'trade-import.step.privacy': 'Datenschutzhinweis',
  'trade-import.step.analyse': '3. Analysieren und zuordnen',
  'trade-import.step.preview': '4. Vorschau',
  'trade-import.label.template': 'Lokale Zuordnungsvorlage',
  'trade-import.label.template-actions': 'Vorlagenaktionen',
  'trade-import.template.none': 'Keine Vorlage',
  'trade-import.label.account': 'Konto',
  'trade-import.label.broker': 'Broker',
  'trade-import.label.asset-type': 'Asset-Typ',
  'trade-import.asset.stock': 'Aktie',
  'trade-import.asset.options': 'Optionen',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Krypto',
  'trade-import.label.manual-mode': 'Manueller Modus',
  'trade-import.manual-mode.price-based': 'Preisbasiert',
  'trade-import.manual-mode.direct-pnl': 'Direkte GuV',
  'trade-import.label.ai-mapping': 'KI-Zuordnungsvorschläge anfordern',
  'trade-import.privacy.copy':
    'Trade Import lädt den ausgewählten Broker-Export zur Verarbeitung auf Journalit-Server hoch. Broker-Exporte können Konto-IDs, Handelshistorie, Symbole, Zeitstempel, Preise, Mengen, Gebühren, Salden und GuV enthalten. Für die Vorschau sendet Journalit außerdem den ausgewählten Kontonamen, Zuordnungs-/Vorlagenauswahl, Definitionen benutzerdefinierter Felder und gespeicherte Optionen sowie begrenzten lokalen Kontext offener Trades für IBKR-Positionsabgleiche. Rohdateien werden für diesen Import verarbeitet und standardmäßig nicht gespeichert.',
  'trade-import.privacy.acknowledge':
    'Ich verstehe das und möchte diesen Export zur Verarbeitung hochladen.',
  'trade-import.action.analyse': 'Datei analysieren',
  'trade-import.action.choose-file': 'Zum Hochladen klicken oder Datei ablegen',
  'trade-import.guide.prompt': 'Nicht sicher, was du exportieren sollst?',
  'trade-import.guide.link': 'Broker-Anleitung ansehen',
  'trade-import.action.drop-file': 'Datei zum Hochladen ablegen',
  'trade-import.analyse.detected':
    '{fileType} erkannt. Header und Beispielzeilen werden vom Backend zurückgegeben.',
  'trade-import.diagnostic.info': 'Info',
  'trade-import.label.sheet': 'Blatt',
  'trade-import.label.header-row': 'Header-Zeile',
  'trade-import.placeholder.auto': 'Automatisch',
  'trade-import.label.date-format': 'Datumsformat',
  'trade-import.mapping.unmapped': 'Nicht zugeordnet',
  'trade-import.label.save-template': 'Zuordnungsvorlage speichern',
  'trade-import.placeholder.template-name': 'Vorlagenname',
  'trade-import.action.save-template': 'Vorlage speichern',
  'trade-import.action.preview': 'Vorschau erzeugen',
  'trade-import.preview.summary':
    '{previewCount} Vorschau-Trades, {failedCount} fehlgeschlagene Zeilen, {incompleteCount} unvollständige Zeilen.',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Richtung',
  'trade-import.table.entry-time': 'Einstiegszeit',
  'trade-import.table.date': 'Datum',
  'trade-import.table.position': 'Positionsgröße',
  'trade-import.table.result': 'Ergebnis',
  'trade-import.table.quantity': 'Menge',
  'trade-import.table.message': 'Meldung',
  'trade-import.action.confirm': 'Import bestätigen',
  'trade-import.action.cancel-preview': 'Vorschau abbrechen',
  'trade-import.broker.manual': 'Manuelle Zuordnung',
  'trade-import.preview.message.duplicate-in-file':
    'Duplikat in der ausgewählten Importdatei',
  'trade-import.preview.message.multiple-open-matches':
    'Mehrere passende offene Trades für Close-only-Vorschau gefunden',
  'trade-import.preview.message.quantity-mismatch':
    'Die Menge des passenden offenen Trades unterscheidet sich von der Close-only-Vorschau',
  'trade-import.preview.message.no-open-match':
    'Kein passender offener Trade für Close-only-Vorschau gefunden',

  
  'command.open-setups': 'Setups öffnen',
  'setups.create.title': 'Setup erstellen',
  'setups.create.field.name': 'Setup-Name',
  'setups.create.placeholder.name': 'Eröffnungsimpuls',
  'setups.create.field.status': 'Status',
  'setups.create.field.direction': 'Richtung',
  'setups.create.field.color': 'Farbe',
  'setups.create.field.color-description':
    'Wähle eine Farbe, um dieses Setup zu kennzeichnen.',
  'setups.create.direction.any': 'Nicht angegeben',
  'setups.create.direction.long': 'Kaufen',
  'setups.create.direction.short': 'Verkaufen',
  'setups.create.direction.both': 'Beide',
  'setups.create.field.linked-notes': 'Verknüpfte Notizen',
  'setups.create.field.linked-notes-desc':
    'Verknüpfe vorhandene Notizen, die das Playbook für dieses Setup dokumentieren.',
  'setups.create.linked-notes.empty': 'Noch keine Notizen verknüpft.',
  'setups.create.linked-notes.add': '+ Notiz verknüpfen',
  'setups.create.linked-notes.remove': 'Verknüpfte Notiz entfernen',
  'setups.create.linked-notes.picker-title': 'Playbook-Notiz auswählen',
  'setups.create.linked-notes.search': 'Notizen suchen...',
  'setups.create.linked-notes.no-notes': 'Keine Markdown-Notizen gefunden.',
  'setups.create.button.creating': 'Wird erstellt...',
  'setups.create.button.create': 'Setup erstellen',
  'setups.create.success': 'Setup "{name}" erfolgreich erstellt',
  'setups.create.error.name-required': 'Setup-Name ist erforderlich',
  'setups.create.error.failed': 'Setup konnte nicht erstellt werden',
  'setups.edit.title': 'Setup bearbeiten',
  'setups.edit.button.saving': 'Wird gespeichert...',
  'setups.edit.button.save': 'Setup speichern',
  'setups.edit.button.rename-and-update': 'Umbenennen und Trades aktualisieren',
  'setups.edit.rename-warning.title':
    'Setup umbenennen und Trades aktualisieren',
  'setups.edit.rename-warning.message':
    'Beim Umbenennen von {oldName} in {newName} werden Trade-Notizen mit dem alten Setup-Namen aktualisiert.',
  'setups.edit.delete.button': 'Setup löschen',
  'setups.edit.delete.title': 'Setup löschen',
  'setups.edit.delete.confirm': 'Löschen bestätigen',
  'setups.edit.delete.warning':
    'Das Löschen von „{name}“ entfernt das Setup dauerhaft und löscht es aus verknüpften Trades. Dies kann nicht rückgängig gemacht werden.',
  'setups.edit.delete.success': 'Setup „{name}“ gelöscht',
  'setups.edit.delete.error': 'Setup konnte nicht gelöscht werden',
  'setups.edit.success': 'Setup "{name}" erfolgreich aktualisiert',
  'setups.edit.error.failed': 'Setup konnte nicht aktualisiert werden',
  'setups.view.compare.empty-submessage':
    'Wähle zwei Setup-Karten aus dem Überblick, um einen Bericht nebeneinander zu erstellen.',
  'setups.view.compare.reason.higher.total-r': 'Höherer Gesamt-R',
  'setups.view.compare.reason.lower.total-r': 'Niedrigerer Gesamt-R',
  'setups.view.compare.reason.similar.total-r': 'Ähnlicher Gesamt-R',
  'setups.view.advanced.rule-break-count': '{count}',
  'setups.guide.empty.intro.title': 'Erstelle dein erstes Setup',
  'setups.guide.empty.intro.description':
    'Setups verbinden Playbook-Notizen, Regeln, Screenshots und verknüpfte Trades, damit du eine Trading-Idee im Kontext prüfen kannst.',
  'setups.guide.create-new-setup.title': 'Neue Setups erstellen',
  'setups.guide.create-new-setup.description':
    'Nutze Neues Setup, um ein weiteres Playbook hinzuzufügen. Das Modal führt durch Details, verknüpfte Notizen und Regeln.',
  'setups.guide.detail-intro.title': 'Das ist die Setup-Seite',
  'setups.guide.detail-intro.description':
    'Diese Setup-Seite fokussiert ein Playbook mit Performance-Chart, Kontext, Referenzmaterial, Aktionen und Ausführungsregeln.',
  'setups.guide.detail-actions.title': 'Setup-Aktionen',
  'setups.guide.detail-actions.description':
    'Mit diesen Buttons öffnest du zugehörige Trades oder bearbeitest Details, verknüpfte Notizen, Screenshots und Playbook-Regeln.',
  'setups.guide.empty.create-setup.title': 'Beginne mit Neues Setup',
  'setups.guide.empty.create-setup.description':
    'Erstelle zuerst ein Setup. Danach fährt diese Anleitung mit dem normalen Rundgang fort.',
  'setups.guide.empty.finish.title': 'Setup fertig erstellen',
  'setups.guide.empty.finish.description':
    'Fülle die Details aus und speichere. Die Setups-Anleitung wird fortgesetzt, sobald das Setup verfügbar ist.',
  'setups.guide.intro.title': 'Willkommen bei Setups',
  'setups.guide.intro.description':
    'Diese Ansicht bündelt Setup-Playbooks, verknüpfte Trades, Notizen, Screenshots und Regeln an einem Ort.',
  'setups.guide.view-tabs.title': 'Setup-Ansichten wechseln',
  'setups.guide.view-tabs.description':
    'Nutze diese Tabs für Überblick, Setup-Paare und Vergleich, wenn genügend Setups vorhanden sind.',
  'setups.guide.overview-chart.title': 'Performance-Rangliste',
  'setups.guide.overview-chart.description':
    'Das Überblicksdiagramm sortiert Setups nach der gewählten Metrik. Mit den Steuerelementen oben rechts wechselst du die Metrik oder fokussierst bestimmte Setups.',
  'setups.guide.setup-cards.title': 'Setup-Karten',
  'setups.guide.setup-cards.description':
    'Karten fassen jedes Setup mit Kennzahlen, Status, letztem Trade und kleinem Performance-Trend zusammen.',
  'setups.guide.open-detail.title': 'Setup-Seite öffnen',
  'setups.guide.open-detail.description':
    'Öffne eine Setup-Karte, um die eigene Seite mit Diagramm, Kontext, Playbook-Material und Ausführungsregeln zu prüfen.',
  'setups.guide.detail-performance.title': 'Detail-Performance',
  'setups.guide.detail-performance.description':
    'Der Performance-Tab zeigt Chart und Kennzahlen im Zeitverlauf, darunter P&L, Trefferquote, Erwartung und Drawdown.',
  'setups.guide.detail-context.title': 'Setup-Kontext',
  'setups.guide.detail-context.description':
    'Dieses Panel hält Gesundheit, Aufmerksamkeitspunkte, verknüpfte Notizen und Screenshots griffbereit.',
  'setups.guide.detail-playbook.title': 'Playbook-Notizen',
  'setups.guide.detail-playbook.description':
    'Der Playbook-Bereich zeigt die verknüpfte Notiz. Sie kann Markdown, Bilder, Excalidraw oder beliebiges Referenzmaterial enthalten.',
  'setups.guide.detail-rules.title': 'Ausführungsregeln',
  'setups.guide.detail-rules.description':
    'Regeln bilden die strukturierte Checkliste für Bedingungen, Einstiege, Risiko und zu vermeidende Fehler.',
  'setups.guide.finish.title': 'Setups-Anleitung abgeschlossen',
  'setups.guide.finish.description':
    'Du hast die wichtigsten Bereiche gesehen: Überblick, Paare, Vergleichen und die einzelne Setup-Seite.',
  'setups.guide.compare.intro.title': 'Setup-Performance vergleichen',
  'setups.guide.compare.intro.description':
    'Du hast genug Setups, um Paare zu prüfen und zwei Playbooks nebeneinander zu vergleichen.',
  'setups.guide.pairs-mode.title': 'Setup-Paare öffnen',
  'setups.guide.pairs-mode.description':
    'Öffne Paare, um zu sehen, welche Kombinationen genügend gemeinsame Trades für einen Vergleich haben.',
  'setups.guide.pairs-chart.title': 'Paar-Rangliste',
  'setups.guide.pairs-chart.description':
    'Der Paarmodus hebt Kombinationen hervor, die zusammen besser oder schlechter funktionieren können. Klicke auf einen Balken, um tiefere Paar-Einblicke zu öffnen.',
  'setups.guide.return-overview.title': 'Zurück zum Überblick',
  'setups.guide.return-overview.description':
    'Gehe zurück zum Überblick, bevor du Setups zum Vergleichen auswählst.',
  'setups.guide.compare-mode.title': 'Vergleich starten',
  'setups.guide.compare-mode.description':
    'Im Vergleichsmodus wählst du zwei Setup-Karten für eine Gegenüberstellung aus.',
  'setups.guide.compare-select.title': 'Zwei Setups auswählen',
  'setups.guide.compare-select.description':
    'Wähle zwei Setup-Karten aus, um die Vergleichsseite zu öffnen.',
  'setups.guide.compare-summary.title': 'Das ist die Vergleichsseite',
  'setups.guide.compare-summary.description':
    'Diese Seite vergleicht zwei Setups nebeneinander. Die obere Zusammenfassung zeigt Gewinner, Erwartungswert-Vorteil, Sicherheit und Gründe für den Vorteil.',
  'setups.guide.compare-body.title': 'Vergleichs-Zusammenfassung',
  'setups.guide.compare-body.description':
    'Die obere Zeile fasst den Vergleich zusammen: Gewinner, Erwartungswert-Vorteil, Sicherheit und Gründe für den Vorteil.',
  'setups.guide.compare-details.title': 'Vergleichsdetails',
  'setups.guide.compare-details.description':
    'Nutze Metriktabelle und kumulatives Diagramm, um die Unterschiede der beiden Setups zu verstehen.',
  'setups.guide.detail-execution-gap.title': 'Ausführungslücken-Analyse',
  'setups.guide.detail-execution-gap.description':
    'Bei Missed-Trades oder Backtests vergleicht dieser Tab ausgeführte Trades mit verpasster oder Benchmark-Chance.',
  'setups.guide.back-to-overview.title': 'Zurück zu Setup-Karten',
  'setups.guide.back-to-overview.description':
    'Kehre zu den Karten zurück, wenn der Vergleich abgeschlossen ist.',
  'setups.guide.compare.finish.title': 'Setup-Vergleich abgeschlossen',
  'setups.guide.compare.finish.description':
    'Du hast Paare und Vergleichen gesehen, um mehrere Setups gemeinsam zu prüfen.',
  'setups.view.open-as-markdown': 'Als Markdown öffnen',
  'setups.view.open-as-setup': 'Als Journalit-Setup öffnen',
  'setups.view.overview.mode.aria': 'Modus des Überblicksdiagramms',
  'setups.view.overview.mode.setups': 'Setups',
  'setups.view.overview.mode.pairs': 'Paare',
  'setups.view.pairs.title': 'Setup-Paare',
  'setups.view.pairs.summary-aria': 'Zusammenfassung der Setup-Paare',
  'setups.view.pairs.best': 'Bestes Paar',
  'setups.view.pairs.worst': 'Schlechtestes Paar',
  'setups.view.pairs.worst-short': 'Schlechtestes',
  'setups.view.pairs.empty': 'Noch keine Setup-Paare mit mindestens 5 Trades.',
  'setups.view.pairs.empty-submessage':
    'Paare erscheinen, sobald zwei Setups genügend gemeinsame verknüpfte Trades haben.',
  'setups.view.pairs.privacy':
    'Die Paar-Performance ist im Privatsphäre-Modus ausgeblendet.',
  'setups.view.pairs.edge-tooltip':
    'Der Vorteil vergleicht den Erwartungswert des Paars mit der stärkeren Basis des einzelnen Setups.',
  'setups.view.pairs.metric-aria': 'Paar-Kennzahl',
  'setups.view.pairs.metric.edge': 'Paar-Vorteil',
  'setups.view.pairs.metric.edge-short': 'edge',
  'setups.view.pairs.metric.expectancy': 'Erwartungswert des Paars',
  'setups.view.pairs.metric.expectancy-short': 'expectancy',
  'setups.view.pairs.together': 'Zusammen',
  'setups.view.pairs.table.setup-pair': 'Setup-Paar',
  'setups.view.pairs.equity-curve': 'Equity-Kurve',
  'setups.view.pairs.equity-caption':
    'Kumulierte Paar-Performance im Zeitverlauf. Grün = positiver Beitrag, Rot = Drawdown.',
  'setups.view.pairs.evidence': 'Belege',
  'setups.view.pairs.edge-comparison': 'Vorteilsvergleich',
  'setups.view.pairs.edge-caption': 'Kombinierter Vorteil: {edge}',
  'setups.view.overview.setup-filter.all': 'Setups: Alle',
  'setups.view.overview.setup-filter.selected': 'Setups: {count} ausgewählt',
  'setups.view.overview.setup-filter.aria': 'Anzuzeigende Setups auswählen',
  'setups.view.overview.setup-filter.select-all': 'Alle auswählen',
  'setups.view.overview.setup-filter.clear': 'Zurücksetzen',
  'setups.view.overview.pnl-chart.title': 'Setup-P&L im Zeitverlauf',
  'setups.view.overview.pnl-chart.dropdown-label': 'Kumuliertes P&L',
  'setups.view.overview.pnl-chart.subtitle':
    'Kumuliertes P&L aus mit Setups verknüpften Trades, nach Setup aufgeteilt und kombiniert.',
  'setups.view.overview.pnl-chart.combined': 'Alle Setups',
  'setups.view.overview.pnl-chart.selected-combined': 'Ausgewählte Setups',
  'setups.view.overview.pnl-chart.unassigned': 'Nicht zugeordnetes Konto',
  'setups.view.overview.pnl-chart.hidden':
    'Das Setup-P&L im Zeitverlauf ist im Privatsphäre-Modus ausgeblendet.',
  'setups.view.overview.pnl-chart.trade': 'Trade',
  'setups.view.overview.pnl-chart.start': 'Start',
  'setups.view.ranking.empty-submessage':
    'Log trades with setups to start ranking performance.',
  'setups.view.empty.no-setups-submessage':
    'Setups collect your playbook notes, rules, trades, and performance in one place.',
  'setups.view.detail.no-playbook-note':
    'Verknüpfe eine Playbook-Notiz, um sie hier in der Vorschau anzuzeigen.',
  'setups.view.detail.link-playbook-note': 'Notiz verknüpfen',
  'setups.view.detail.change-playbook-note': 'Notiz ändern',
  'setups.view.detail.playbook-note-modal.search': 'Notizen suchen...',
  'setups.view.detail.playbook-note-modal.empty':
    'Keine passenden Notizen gefunden.',
  'setups.view.detail.empty-playbook-note':
    'Die verknüpfte Playbook-Notiz ist leer.',
  'setups.view.detail.rules.edit': 'Regeln bearbeiten',
  'setups.view.detail.rules.add-first': 'Regeln hinzufügen',
  'setups.view.detail.rules.add': 'Regel hinzufügen',
  'setups.view.detail.rules.editor-subtitle':
    'Erstelle und bearbeite Regeln, die dieses Setup definieren.',
  'setups.view.detail.rules.empty-title': 'Setup-Playbook erstellen',
  'setups.view.detail.rules.use-template': 'Vorlage verwenden',
  'setups.view.detail.rules.applying-template': 'Vorlage wird angewendet...',
  'setups.view.detail.rules.add-custom': 'Eigene Regel',
  'setups.view.detail.rules.template-error':
    'Playbook-Vorlage konnte nicht angewendet werden.',
  'setups.view.detail.rules.template.best-conditions': 'Beste Bedingungen',
  'setups.view.detail.rules.template.entry-criteria': 'Einstiegskriterien',
  'setups.view.detail.rules.template.invalidation': 'Invalidierung',
  'setups.view.detail.rules.template.risk-management': 'Risiko / Management',
  'setups.view.detail.rules.template.avoid-when': 'Vermeiden, wenn',
  'setups.view.detail.rules.template.common-mistakes': 'Häufige Fehler',
  'setups.view.detail.rules.template.rule.best-conditions':
    'Der Marktkontext unterstützt dieses Setup',
  'setups.view.detail.rules.template.rule.entry-criteria':
    'Der Einstiegstrigger ist klar definiert',
  'setups.view.detail.rules.template.rule.invalidation':
    'Die Invalidierung ist vor dem Einstieg klar',
  'setups.view.detail.rules.template.rule.risk-management':
    'Das Risiko ist akzeptabel und das Ziel definiert',
  'setups.view.detail.rules.template.rule.avoid-when':
    'Ausschlussbedingungen liegen nicht vor',
  'setups.view.detail.rules.template.rule.common-mistakes':
    'Bekannte Ausführungsfehler werden vermieden',
  'setups.view.detail.rules.field.label': 'Regel',
  'setups.view.detail.rules.field.description': 'Details',
  'setups.view.detail.rules.field.group': 'Gruppe',
  'setups.view.detail.rules.move-up': 'Regel nach oben verschieben',
  'setups.view.detail.rules.move-down': 'Regel nach unten verschieben',
  'setups.view.detail.rules.delete': 'Regel löschen',
  'setups.view.detail.rules.save-error':
    'Setup-Regeln konnten nicht gespeichert werden.',
  'setups.view.detail.rules.validation-label':
    'Füge einen Regelnamen hinzu oder lösche die leere Regel vor dem Speichern.',
  'setups.view.detail.rules.groups': 'Gruppen',
  'setups.view.detail.rules.add-group': 'Gruppe hinzufügen',
  'setups.view.detail.rules.new-group': 'Neue Gruppe',
  'setups.view.detail.rules.validation-group':
    'Füge einen Gruppennamen hinzu oder entferne die leere Gruppe vor dem Speichern.',
  'setups.view.detail.rules.summary': '{count} Regeln · {groups} Gruppen',
  'setups.view.detail.rules.group-summary': '{count} · {required} erforderlich',
  'setups.view.detail.rules.more': '+{count} weitere',
  'setups.view.detail.rule.category.context': 'Kontext',
  'setups.view.detail.rule.category.entry': 'Einstieg',
  'setups.view.detail.rule.category.exit': 'Ausstieg',
  'setups.view.detail.rule.category.risk': 'Risiko',
  'setups.view.detail.rule.category.management': 'Management',
  'setups.view.detail.rule.category.invalidation': 'Invalidierung',
  'setups.view.detail.rule.category.psychology': 'Psychologie',
  'setups.view.detail.performance.drawdown': 'Drawdown',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',
  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Edit linked notes',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'setups.view.detail.execution-gap.subtitle':
    'Captured edge vs missed opportunity',
  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': 'Live-R',
  'setups.view.detail.execution-gap.missed-edge': 'Missed Edge',
  'setups.view.detail.execution-gap.live-plus-missed': 'Live + Missed',
  'setups.view.detail.execution-gap.backtest': 'Backtest',
  'setups.view.detail.execution-gap.gap': 'Gap',
  'setups.view.detail.execution-gap.opportunities': 'Opportunities',
  'setups.view.detail.execution-gap.capture-rate': 'Capture Rate',
  'setups.view.detail.execution-gap.capture-rate-tooltip':
    'Live P&L ÷ (Live P&L + missed-trade P&L). Shows how much available edge you captured.',
  'setups.view.detail.execution-gap.average-r-delta': 'Avg R Delta',
  'setups.view.detail.execution-gap.live-execution': 'Live Execution',
  'setups.view.detail.execution-gap.backtest-benchmark': 'Backtest Benchmark',
  'setups.view.detail.execution-gap.hidden':
    'Execution gap is hidden in privacy mode.',
  'setups.view.detail.execution-gap.empty':
    'Log missed trades or backtest trades for this setup to analyze execution gaps.',
  'setups.view.detail.brief.linked-notes': '{count}',
  'setups.view.detail.brief.linked-notes-modal.subtitle': '{name}',
  'setups.view.detail.brief.screenshots': '{count}',
  'setups.view.detail.brief.no-screenshots':
    'Noch keine Screenshots verknüpft.',
  'setups.view.detail.brief.screenshot-alt': '{index}',
  'setups.view.detail.brief.screenshot-open': '{index}',
  'setups.view.detail.brief.count.rules': '{count}',
  'setups.view.detail.brief.count.notes': '{count}',
  'setups.view.detail.brief.count.images': '{count}',
  'setups.view.detail.brief.count.trades': '{count}',
  'setups.view.detail.brief.more': '{count}',
  'setups.view.detail.attention.title': 'Needs attention',
  'setups.view.detail.attention.count': '{count} items',
  'setups.view.detail.attention.empty': 'No setup issues found.',
  'setups.view.detail.attention.show-more': '+{count} more',
  'setups.view.detail.attention.show-less': 'Show less',
  'setups.view.detail.attention.no-playbook-title': 'Link a playbook note',
  'setups.view.detail.attention.no-playbook-detail':
    'Link one source note for context and examples.',
  'setups.view.detail.attention.no-rules-title': 'Build the execution playbook',
  'setups.view.detail.attention.no-rules-detail':
    'Add criteria for entries, invalidation, risk, and mistakes.',
  'setups.view.detail.attention.no-invalidation-title':
    'Add invalidation criteria',
  'setups.view.detail.attention.no-invalidation-detail':
    'Define when this setup is no longer valid.',
  'setups.view.detail.attention.no-risk-title': 'Add risk or management rules',
  'setups.view.detail.attention.no-risk-detail':
    'Document how this setup should be managed after entry.',
  'setups.view.detail.attention.no-trades-title': 'No live trades yet',
  'setups.view.detail.attention.no-trades-detail':
    'No linked live trade history yet.',
  'setups.view.detail.attention.no-screenshots-title':
    'Save example screenshots',
  'setups.view.detail.attention.no-screenshots-detail':
    'Attach screenshots to trades for review examples.',
  'setups.view.detail.attention.stale-title': 'Review recent relevance',
  'setups.view.detail.attention.stale-detail':
    'This setup has not been traded in {count} days.',
  'setups.view.detail.attention.profit-factor-title':
    'Performance needs review',
  'setups.view.detail.attention.profit-factor-detail':
    'Profit factor is below 1.0 across linked trades.',
  'setups.view.detail.attention.expectancy-title': 'Expectancy is negative',
  'setups.view.detail.attention.expectancy-detail':
    'Average linked-trade outcome is below breakeven.',
  'setups.view.card.open-named': '{name}',
  'setups.view.card.status.active': 'Stable',
  'setups.view.card.status.monitor': 'Monitor',
  'setups.view.card.status.review': 'Review',
  'setups.view.date.days-ago': '{count}',

  'home.quick-links.setups': 'Trading-Setups',
  'validation.setup-resolution-failed': 'Setup konnte nicht aufgelöst werden.',
  'setups.view.action.create': 'Setup erstellen',
  'setups.view.action.new': 'Neues Setup',
  'setups.view.action.refresh': 'Aktualisieren',
  'setups.view.action.retry': 'Erneut versuchen',
  'setups.view.action.compare-selected': 'Ausgewählte vergleichen',
  'setups.view.tab.overview': 'Überblick',
  'setups.view.tab.compare': 'Vergleichen',
  'setups.view.tabs.aria': 'Setup-Ansichten',
  'setups.view.eyebrow': 'Setups',
  'setups.view.title': 'Setups',
  'setups.view.subtitle':
    'Behalte Playbooks, Ausführungsqualität und Setup-Performance im Blick.',
  'setups.view.error.title': 'Setups konnten nicht geladen werden',
  'setups.view.error.load-failed':
    'Setups konnten nicht geladen werden. Versuche es erneut.',
  'setups.view.summary.aria': 'Zusammenfassung der Setups im Überblick',
  'setups.view.summary.total': 'Setups insgesamt',
  'setups.view.summary.active': 'Aktiv',
  'setups.view.summary.most-traded': 'Am häufigsten gehandelt',
  'setups.view.summary.needs-review': 'Überprüfung erforderlich',
  'setups.view.summary.best-performer': 'Beste Performance',
  'setups.view.summary.tested': 'Getestet',
  'setups.view.summary.ready': 'Bereit',
  'setups.view.summary.missing-playbooks': 'Fehlende Playbooks',
  'setups.view.summary.no-trade-data': 'Keine Trade-Daten',
  'setups.view.summary.awaiting-trades': 'Wartet auf Trades',
  'setups.view.summary.of-total': 'von insgesamt',
  'setups.view.summary.require-attention': 'erfordern Aufmerksamkeit',
  'setups.view.summary.needs-mapping': 'Zuordnung erforderlich',
  'setups.view.summary.all-mapped': 'Alle zugeordnet',
  'setups.view.summary.previous-unavailable': 'Vorherige Daten nicht verfügbar',
  'setups.view.ranking.title': 'Setup-Performance-Rangliste',
  'setups.view.ranking.subtitle':
    'Ordne Setups nach der ausgewählten Performance-Kennzahl.',
  'setups.view.ranking.metric-aria': 'Performance-Kennzahl',
  'setups.view.ranking.privacy':
    'Performance-Werte sind im Privatsphäre-Modus ausgeblendet.',
  'setups.view.ranking.empty': 'Noch keine Setup-Performance-Daten.',
  'setups.view.attention.title': 'Benötigt Aufmerksamkeit',
  'setups.view.attention.empty': 'Keine Probleme bei Setups gefunden.',
  'setups.view.attention.incomplete-playbooks': 'Unvollständige Playbooks',
  'setups.view.attention.incomplete-playbooks-desc':
    'Einige Setups benötigen ein ausgearbeitetes Playbook.',
  'setups.view.attention.missing-rules': 'Fehlende Regeln',
  'setups.view.attention.missing-rules-desc':
    'Einige Setups haben keine Checklisten-Regeln.',
  'setups.view.attention.low-sample-size': 'Kleine Stichprobe',
  'setups.view.attention.low-sample-size-desc':
    'Für eine Bewertung der Performance werden mehr Trades benötigt.',
  'setups.view.attention.missing-linked-notes': 'Fehlende verknüpfte Notizen',
  'setups.view.attention.missing-linked-notes-desc':
    'Füge Beispiele, Screenshots oder Referenzen hinzu, um das Playbook zu stärken.',
  'setups.view.metric.trade-count': 'Anzahl Trades',
  'setups.view.metric.trades': 'Trades',
  'setups.view.metric.net-pnl': 'Gesamt-P&L',
  'setups.view.metric.total-pnl': 'Gesamt-PnL',
  'setups.view.metric.win-rate': 'Trefferquote',
  'setups.view.metric.profit-factor': 'Profit Factor',
  'setups.view.metric.last-traded': 'Zuletzt gehandelt',
  'setups.view.metric.expected-value': 'Erwartungswert',
  'setups.view.metric.expectancy-r': 'Erwartungswert (R)',
  'setups.view.metric.last-reviewed': 'Zuletzt überprüft',
  'setups.view.controls.aria': 'Setup-Filter',
  'setups.view.search.placeholder': 'Setups suchen…',
  'setups.view.search.aria': 'Setups suchen',
  'setups.view.status.aria': 'Nach Setup-Status filtern',
  'setups.view.status.all': 'Alle Status',
  'setups.view.status.active': 'Aktiv',
  'setups.view.status.testing': 'In Testphase',
  'setups.view.status.archived': 'Archiviert',
  'setups.view.cards.aria': 'Setup-Karten',
  'setups.view.card.open': 'Setup öffnen',
  'setups.view.card.select-for-compare': 'Für Vergleich auswählen',
  'setups.view.card.sparkline-aria': 'Setup-Sparkline',
  'setups.view.empty.no-setups':
    'Noch keine Setups. Erstelle dein erstes Setup, um Playbooks zu verfolgen.',
  'setups.view.badge.complete': 'Vollständig',
  'setups.view.meta.no-model-category': 'Kein Modell/keine Kategorie',
  'setups.view.date.never': 'Nie',
  'setups.view.date.today': 'Heute',
  'setups.view.date.yesterday': 'Gestern',
  'setups.view.compare.title': 'Setups vergleichen',
  'setups.view.compare.subtitle':
    'Vergleiche Performance und Verhalten ausgewählter Setups.',
  'setups.view.compare.select-title': 'Setups zum Vergleichen auswählen',
  'setups.view.compare.empty': 'Wähle zwei Setups zum Vergleichen aus.',
  'setups.view.compare.metrics-title': 'Vergleichskennzahlen',
  'setups.view.compare.metric': 'Kennzahl',
  'setups.view.compare.edge-column': 'Vorteil',
  'setups.view.compare.edge-label': 'Gewinner',
  'setups.view.compare.edge-hidden': 'Im Privatsphäre-Modus ausgeblendet',
  'setups.view.compare.no-clear-edge': 'Kein eindeutiger Vorteil',
  'setups.view.compare.expectancy-edge': 'Erwartungswert-Vorteil',
  'setups.view.compare.confidence': 'Sicherheit',
  'setups.view.compare.sample': 'Stichprobe',
  'setups.view.compare.confidence.high': 'Hoch',
  'setups.view.compare.confidence.moderate': 'Mittel',
  'setups.view.compare.confidence.low': 'Niedrig',
  'setups.view.compare.edge-strength.strong': 'Starker Vorteil',
  'setups.view.compare.edge-strength.clear': 'Deutlicher Vorteil',
  'setups.view.compare.edge-strength.slight': 'Leichter Vorteil',
  'setups.view.compare.edge-reasons-privacy':
    'Details zum Vorteil sind im Privatsphäre-Modus ausgeblendet.',
  'setups.view.compare.reason.higher.net-pnl': 'Höheres Netto-PnL',
  'setups.view.compare.reason.lower.net-pnl': 'Niedrigeres Netto-PnL',
  'setups.view.compare.reason.similar.net-pnl': 'Ähnliches Netto-PnL',
  'setups.view.compare.reason.higher.win-rate': 'Höhere Trefferquote',
  'setups.view.compare.reason.lower.win-rate': 'Niedrigere Trefferquote',
  'setups.view.compare.reason.similar.win-rate': 'Ähnliche Trefferquote',
  'setups.view.compare.reason.higher.expectancy': 'Höherer Erwartungswert',
  'setups.view.compare.reason.lower.expectancy': 'Niedrigerer Erwartungswert',
  'setups.view.compare.reason.similar.expectancy': 'Ähnlicher Erwartungswert',
  'setups.view.compare.reason.higher.profit-factor': 'Höherer Profit Factor',
  'setups.view.compare.reason.lower.profit-factor': 'Niedrigerer Profit Factor',
  'setups.view.compare.reason.similar.profit-factor': 'Ähnlicher Profit Factor',
  'setups.view.compare.pnl-bars': 'PnL-Rangliste',
  'setups.view.compare.cumulative-title': 'Kumulierte Performance',
  'setups.view.compare.cumulative-privacy':
    'Die kumulierte Performance ist im Privatsphäre-Modus ausgeblendet.',
  'setups.view.compare.cumulative-empty':
    'Keine kumulierten Trade-Daten für die ausgewählten Setups.',
  'setups.view.advanced.title': 'Erweiterte Analysen',
  'setups.view.advanced.subtitle': 'Setup-Kombinationen und Playbook-Vorteile.',
  'setups.view.advanced.broken-trades': 'Regelverletzende Trades',
  'setups.view.advanced.no-rule-data': 'Noch keine Regel-Daten.',
  'setups.view.advanced.no-rule-edge': 'Noch keine Daten zum Regel-Vorteil.',
  'setups.view.advanced.rule-edge-title': 'Regel-Vorteil',
  'setups.view.advanced.needs-attention': 'Benötigt Aufmerksamkeit',
  'setups.view.advanced.no-insights': 'Noch keine Erkenntnisse.',
  'setups.view.advanced.severity.info': 'Info',
  'setups.view.advanced.severity.warning': 'Warnung',
  'setups.view.advanced.severity.critical': 'Kritisch',
  'setups.view.advanced.combinations-title': 'Setup-Kombinationen',
  'setups.view.advanced.combinations-subtitle':
    'Finde Setup-Paare, die gut zusammen funktionieren.',
  'setups.view.advanced.top-combinations': 'Top-Kombinationen',
  'setups.view.advanced.best-pairs': 'Beste Paare',
  'setups.view.advanced.no-combinations': 'Noch keine Setup-Kombinationen.',
  'setups.view.advanced.performance-privacy':
    'Performance-Details sind im Privatsphäre-Modus ausgeblendet.',
  'setups.view.advanced.insight.no-trades':
    'Mit diesem Setup sind noch keine Trades verknüpft.',
  'setups.view.detail.back': 'Zurück',
  'setups.view.detail.no-description': 'Noch keine Beschreibung.',
  'setups.view.detail.action.edit': 'Setup bearbeiten',
  'setups.view.detail.action.view-trades': 'Im Trade-Log anzeigen',
  'setups.view.detail.action.archive': 'Setup archivieren',
  'setups.view.detail.action.compare': 'Setup vergleichen',
  'setups.view.detail.metrics-aria': 'Setup-Kennzahlen',
  'setups.view.detail.playbook': 'Playbook',
  'setups.view.detail.no-playbook': 'Noch kein Playbook erstellt.',
  'setups.view.detail.rules': 'Regeln',
  'setups.view.detail.no-rules':
    'Beginne mit geführten Playbook-Abschnitten und passe die Kriterien anschließend an dein Trading dieses Setups an.',
  'setups.view.detail.rule.required': 'Erforderlich',
  'setups.view.detail.rule.optional': 'Optional',
  'setups.view.detail.linked-notes': 'Verknüpfte Notizen',
  'setups.view.detail.no-linked-notes': 'Noch keine Notizen verknüpft.',
  'setups.view.detail.performance.aria': 'Setup-Performance',
  'setups.view.detail.performance.title': 'Performance',
  'setups.view.detail.performance.cumulative-pnl': 'Kumuliertes PnL',
  'setups.view.detail.performance.cumulative-r': 'Kumuliertes R',
  'setups.view.detail.performance.empty': 'Noch keine Trades verknüpft.',
  'setups.view.detail.performance.tooltip-title': 'Trade-Performance',
  'setups.view.detail.scaffold.performance': 'Performance',
  'setups.view.detail.scaffold.performance-title': 'Performance-Übersicht',
  'setups.view.detail.scaffold.performance-description':
    'Prüfe PnL, R-Multiples, Drawdown und das aktuelle Trade-Verhalten.',
  'setups.view.detail.scaffold.evidence': 'Belege',
  'setups.view.detail.scaffold.evidence-title': 'Belegübersicht',
  'setups.view.detail.scaffold.evidence-description':
    'Screenshots und verknüpfte Beispiele für dieses Setup.',
  'setups.view.detail.scaffold.playbook-title': 'Playbook-Notizen',
  'setups.view.detail.scaffold.playbook-description':
    'Dokumentiere Ausführungskontext, Trigger, Management und Invalidierung.',
  'setups.view.detail.scaffold.rules': 'Regeln',
  'setups.view.detail.scaffold.rules-description':
    'Checklisten-Regeln, die das Setup definieren.',
  'setups.view.detail.brief.health': 'Setup-Gesundheit',
  'setups.view.detail.brief.profile': 'Profil',
  'setups.view.detail.brief.linked-notes-modal.title': 'Verknüpfte Notizen',
  'setups.view.detail.brief.view-all': 'Alle anzeigen',
  'setups.view.detail.brief.status.complete': 'Vollständig',
  'setups.view.detail.brief.status.missing': 'Fehlt',
  'setups.view.detail.brief.health.playbook': 'Playbook',
  'setups.view.detail.brief.health.rules': 'Regeln',
  'setups.view.detail.brief.health.notes': 'Notizen',
  'setups.view.detail.brief.health.screenshots': 'Screenshots',
  'setups.view.detail.brief.health.trades': 'Trades',
  'setups.view.detail.brief.less': 'Weniger anzeigen',
  'setups.view.detail.brief.profile.direction': 'Richtung',
  'setups.view.detail.brief.profile.sessions': 'Sitzungen',
  'setups.view.detail.brief.profile.timeframes': 'Zeiteinheiten',
  'setups.view.detail.brief.profile.tickers': 'Ticker',
  'setups.view.detail.brief.direction.long': 'Long',
  'setups.view.detail.brief.direction.short': 'Short',
  'setups.view.detail.brief.direction.both': 'Beide',
  'setups.view.completeness.incomplete-playbook': 'Unvollständiges Playbook',
  'setups.view.completeness.no-rules': 'Keine Regeln',
  'setups.view.completeness.no-linked-notes': 'Keine verknüpften Notizen',

  'trade-import.restore.title':
    'Importierte Trades aus dem Backend wiederherstellen',
  'trade-import.restore.description':
    'Erstellt fehlende lokale Notizen für im Backend importierte Trades in diesem Vault. Dadurch werden keine doppelten Backend-Trades erstellt.',
  'trade-import.restore.vault': 'Aktive Vault-Identität: {vaultId}',
  'trade-import.restore.load':
    'Importierte Trades aus dem Backend wiederherstellen',
  'trade-import.restore.none':
    'Keine fehlenden importierten Trade-Projektionen für diesen Vault gefunden.',
  'trade-import.restore.loaded':
    '{count} wiederherstellbare importierte Trades gefunden.',
  'trade-import.restore.load-failed':
    'Wiederherstellbare importierte Trades konnten nicht geladen werden.',
  'trade-import.restore.select-all': 'Alle auswählen',
  'trade-import.restore.restore-selected':
    'Ausgewählte wiederherstellen ({count})',
  'trade-import.restore.complete':
    '{written} importierte Trades wiederhergestellt; {failed} fehlgeschlagen.',
  'trade-import.restore.broker-label': 'Backend-Wiederherstellung',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.metatrader.description':
    'Synchronisiere Trades aus MetaTrader-Berichten, die über deine FTP-Verbindung hochgeladen wurden.',
  'trade-sync.source.trade-import.description':
    'Stelle Broker-Dateiimporte über mehrere Vaults hinweg wieder her und rekonstruiere fehlende lokale Trade-Notizen.',
  'trade-sync.import.title': 'Trade-Import-Sync',
  'trade-sync.import.description':
    'Stelle importierte Trades über mehrere Vaults hinweg wieder her und rekonstruiere fehlende lokale Notizen.',
  'trade-sync.import.card.connection': 'Verbindung',
  'trade-sync.import.card.backup': 'Import-Backup',
  'trade-sync.import.card.restorable': 'Wiederherstellbare Trades',
  'trade-sync.import.card.import': 'Trade Import',
  'trade-sync.import.card.open-importer': 'Importer öffnen',
  'trade-sync.import.card.open-importer-desc':
    'Importiere dort neue Broker-Dateien',
  'trade-sync.import.card.inventory-summary':
    '{accounts} Konto/Konten · {trades} Trade(s)',
  'trade-sync.import.action.check': 'Prüfen',
  'trade-sync.import.action.open-import': 'Trade Import öffnen',
  'trade-sync.import.action.clear': 'Zurücksetzen',
  'trade-sync.import.action.select-all': 'Alle auswählen',
  'trade-sync.import.action.restore-selected':
    'Ausgewählte wiederherstellen ({count})',
  'trade-sync.import.action.create-local-account': 'Lokal erstellen',
  'trade-sync.import.action.create-local-account-title':
    'Erstellt in diesem Vault ein lokales Konto mit dem Namen des Backend-Kontos.',
  'trade-sync.import.action.save-mapping': 'Speichern',
  'trade-sync.import.action.save-mapping-title':
    'Speichert diese Zuordnung zwischen Backend-Konto und lokalem Konto.',
  'trade-sync.import.action.mapped': 'Zugeordnet',
  'trade-sync.import.action.restore-account': 'Wiederherstellen',
  'trade-sync.import.action.restore-account-title':
    'Stellt fehlende lokale Trade-Notizen für dieses Backend-Konto wieder her.',
  'trade-sync.import.action.restoring': 'Wird wiederhergestellt…',
  'trade-sync.import.label.account': 'Konto',
  'trade-sync.import.vault-pending': 'Vault ausstehend',
  'trade-sync.import.pending-acks': '{count} ausstehende ACK(s)',
  'trade-sync.import.recovery.title': 'Fehlende lokale Notizen',
  'trade-sync.import.empty': 'Dieser Vault ist aktuell.',
  'trade-sync.import.empty-accounts':
    'Noch keine gesicherten Trade-Import-Konten gefunden.',
  'trade-sync.import.account.restorable-count': '{count} wiederherstellbar',
  'trade-sync.import.account.synced-count': '{count} synchronisiert',
  'trade-sync.import.account.missing-count': '{count} fehlend',
  'trade-sync.import.account.issue-count': '{count} Problem(e)',
  'trade-sync.import.account.local-account': 'Lokales Konto',
  'trade-sync.import.account.mapping-hint':
    'Wiederhergestellte Trades werden in dieses lokale Konto geschrieben.',
  'trade-sync.import.notice.restored':
    '{count} importierte Trade(s) wiederhergestellt.',
  'trade-sync.import.notice.load-failed':
    'Trade-Import-Sync-Status konnte nicht geladen werden.',
  'trade-sync.import.notice.mapping-failed':
    'Trade-Import-Kontozuordnung konnte nicht gespeichert werden.',
  'trade-sync.import.notice.create-account-failed':
    'Lokales Konto konnte nicht erstellt werden.',
  'trade-sync.import.notice.restore-failed':
    'Trade-Import-Konto konnte nicht wiederhergestellt werden.',
  'setups.view.loading': 'Loading setups…',
  'settings.general.copy-trading-pnl-toggled': 'Copy-Trading-PnL ist {status}',
  'setups.view.trade.unknown-instrument': 'Unknown instrument',
  'command.open-session-mode': 'Live-Sitzung öffnen',
  'view.session-mode': 'Live-Sitzung',
  'widget.session-log.name': 'Sitzungsprotokoll',
  'widget.session-log.description':
    'Erfasse Ausführungsnotizen mit Zeitstempel und Trade-Ereignisse.',
  'session-log.title': 'Live-Sitzungsprotokoll',
  'session-log.description':
    'Erfasse, was während der aktuellen Trading-Sitzung passiert.',
  'session-log.notice.invalid-timestamp':
    'Gib einen gültigen Zeitstempel für das Sitzungsprotokoll ein.',
  'session-log.action.auto-time': 'Automatische Zeit',
  'session-log.action.set-time': 'Zeit festlegen',
  'session-log.placeholder.entry': 'Was siehst, denkst oder fühlst du?',
  'session-log.composer.tag-label': 'Sitzungsprotokoll-Tag',
  'session-log.placeholder.entry-short': 'Sitzungsnotiz hinzufügen...',
  'session-log.action.add-entry': 'Eintrag mit Zeitstempel hinzufügen',
  'session-log.action.add-note': 'Hinzufügen',
  'session-log.action.hide-composer': 'Editor ausblenden',
  'session-log.filter.all': 'Alle',
  'session-log.filter.label': 'Sitzungsprotokoll filtern',
  'session-log.filter.clear': 'Filter löschen',
  'session-log.timeline.most-recent': 'Neueste',
  'session-log.timeline.start': 'Sitzungsbeginn',
  'session-log.empty': 'Noch keine Einträge im Sitzungsprotokoll.',
  'session-log.empty-filtered': 'Keine Einträge entsprechen diesem Filter.',
  'session-log.loading': 'Sitzungsprotokoll wird geladen…',
  'session-log.lessons.title': 'Lessons learned',
  'session-log.lessons.title-singular': '1 lesson learned',
  'session-log.lessons.title-plural': '{count} lessons learned',
  'session-log.lessons.badge': 'LSN',
  'session-log.session-group.outside': 'Außerhalb der Sitzungen',
  'session-log.error.no-drc': 'Der heutige DRC konnte nicht gefunden werden.',
  'session-log.trade.entered': 'Einstieg',
  'session-log.trade.exited': 'Ausstieg',
  'session-log.trade.size': 'Größe',
  'session-log.status.unresolved': 'ungelöst',
  'session-log.status.unclassified': 'unclassified',
  'session-log.action.save': 'Speichern',
  'session-log.action.cancel': 'Abbrechen',
  'session-log.action.resolve': 'Lösen',
  'session-log.action.classify': 'Classify',
  'session-log.action.edit': 'Bearbeiten',
  'session-log.action.delete': 'Löschen',
  'session-log.action.open-trade': 'Trade öffnen',
  'session-log.preview':
    'Vorschau des Sitzungsprotokolls: Notizen mit Zeitstempel und Trade-Ereignisse erscheinen während der Live-Sitzung hier.',
  'session-log.alert.tag-concentration':
    '{tag} macht {percentage}% der Sitzungsnotizen aus ({count}/{total}). Prüfe vor dem Fortfahren auf Drift.',
  'session-mode.description':
    'Bereite dich auf den heutigen Trading-Tag vor und erfasse Ausführungskontext live.',
  'session-mode.loading': 'Sitzungsmodus wird geladen',
  'session-mode.section.preparation': 'Vorbereitung',
  'session-mode.section.timeline': 'Zeitleiste',
  'session-mode.title.ended': 'Sitzung beendet',
  'session-mode.title.unconfigured': 'Sitzungsmodus',
  'session-mode.title.break': 'Sitzungspause',
  'session-mode.title.live': 'Live-Sitzung',
  'session-mode.title.preparation': 'Sitzungsvorbereitung',
  'session-mode.prep.goals': 'Ziele',
  'session-mode.prep.checklist': 'Checkliste',
  'session-mode.prep.resources': 'Ressourcen',
  'session-mode.action.open-drc': 'Heutigen DRC öffnen',
  'session-mode.action.open-drc-for-date': 'DRC für {date} öffnen',
  'session-mode.ended.helper':
    'Protokolliere deine Trades oder überprüfe den Tag.',
  'session-mode.ended.action.import-trades': 'Trades importieren',
  'session-mode.ended.action.add-trade-manually': 'Trade manuell hinzufügen',
  'session-mode.ended.action.open-drc': 'DRC öffnen',
  'session-mode.ended.stat.trades': 'Trades',
  'session-mode.ended.stat.notes': 'Notizen',
  'session-mode.ended.stat.gate-checks': 'Gate-Checks',
  'session-mode.waiting.next-session': 'Nächste Sitzung',
  'session-mode.waiting.starts-at': '{session} beginnt um {time}',
  'session-mode.waiting.preparation-opens-in':
    'Vorbereitung öffnet in {remaining}',
  'session-mode.waiting.open-drc': 'DRC öffnen',
  'session-mode.break.eyebrow': 'Sitzungspause',
  'session-mode.break.reset-before': 'Reset vor {session}',
  'session-mode.break.reset': 'Reset vor der nächsten Sitzung',
  'session-mode.break.next-session-meta':
    'Nächste Sitzung beginnt um {time} · {remaining} verbleibend',
  'session-mode.break.description':
    'Tritt kurz zurück, trink Wasser und kläre deinen Kopf vor der nächsten Sitzung.',
  'session-mode.break.open-drc': 'DRC öffnen',
  'session-mode.countdown.starts-in': 'Beginnt in',
  'session-mode.countdown.starts-at': '{session} beginnt um {time}',
  'session-mode.countdown.hours': 'Std.',
  'session-mode.countdown.minutes': 'Min.',
  'session-mode.countdown.seconds': 'Sek.',
  'session-mode.phase.preparation': 'Vorbereitung',
  'session-mode.phase.live': 'Live',
  'session-mode.phase.waiting': 'Warten',
  'session-mode.phase.break': 'Pause',
  'session-mode.phase.ended': 'Beendet',
  'session-mode.phase.unconfigured': 'Sitzungsplan nicht konfiguriert',
  'session-mode.status.preparation':
    '{session} beginnt um {time}. Du hast {remaining} zur Vorbereitung.',
  'session-mode.status.preparation-generic':
    'Bereite dich auf die nächste Live-Trading-Sitzung vor.',
  'session-mode.status.waiting':
    '{session} beginnt um {time}. Die Vorbereitung beginnt in {remaining}.',
  'session-mode.status.waiting-generic':
    'Deine nächste Sitzung ist geplant, aber die Vorbereitung hat noch nicht begonnen.',
  'session-mode.status.live': 'Noch {remaining} in dieser Sitzung.',
  'session-mode.status.live-generic': 'Deine Trading-Sitzung läuft.',
  'session-mode.status.break':
    '{session} beginnt um {time}. Du hast {remaining} Pause.',
  'session-mode.status.break-generic': 'Du bist zwischen Trading-Sitzungen.',
  'session-mode.status.ended':
    'Deine konfigurierten Trading-Sitzungen sind vorerst beendet.',
  'session-mode.status.unconfigured':
    'Konfiguriere Sitzungsfenster, um Vorbereitung, Live, Pause und Beendet zu aktivieren. Die Zeitleiste bleibt für den heutigen DRC verfügbar.',
  'session-mode.unconfigured.eyebrow': 'Setup guide',
  'session-mode.unconfigured.title': 'Trading-Zeiten festlegen',
  'session-mode.unconfigured.description':
    'Füge die Zeiten hinzu, zu denen du tatsächlich tradest, damit der Sitzungsmodus automatisch zwischen Vorbereitung, live, Pause und beendet wechseln kann.',
  'session-mode.unconfigured.step.window.title': 'Add a session window',
  'session-mode.unconfigured.step.window.description':
    'Set when you usually trade.',
  'session-mode.unconfigured.step.prep.title': 'Review preparation timing',
  'session-mode.unconfigured.step.prep.description':
    'Default: 30 minutes before session start.',
  'session-mode.unconfigured.step.gate.title': 'Use the Starter Trade Gate',
  'session-mode.unconfigured.step.gate.description':
    'Starter IF/THEN checklist is ready.',
  'session-mode.unconfigured.step.log.title': 'Log notes during live sessions',
  'session-mode.unconfigured.step.log.description':
    'Capture notes while trading.',
  'session-mode.unconfigured.action': 'Sitzungsmodus konfigurieren',
  'session-mode.unconfigured.settings-note':
    'You can change this anytime in Customisation → Session mode.',
  'session-mode.layout.empty.title': 'Nothing enabled for this phase',
  'session-mode.layout.empty.description':
    'Turn modules back on to build this Session Mode phase.',
  'session-mode.duration.minutes': '{minutes}m',
  'session-mode.duration.hours': '{hours}h',
  'session-mode.duration.hours-minutes': '{hours}h {minutes}m',
  'settings.session-mode.title': 'Live-Sitzung',
  'settings.session-mode.description':
    'Konfiguriere Sitzungsfenster, Vorbereitung, Phasenlayout, Trade-Gate-Workflows und Sitzungsprotokoll-Tags.',
  'settings.session-mode.preparation-lead-time': 'Vorbereitungszeit (Minuten)',
  'settings.session-mode.preparation-lead-time-desc':
    'Wie früh der Vorbereitungsmodus vor einer Sitzung startet.',
  'settings.session-mode.windows': 'Sitzungsfenster',
  'settings.session-mode.windows-desc':
    'Definiere die lokalen Zeiten, zu denen du tatsächlich tradest. Sie steuern Vorbereitung, Live, Pause und Beendet.',
  'settings.session-mode.add-window': 'Sitzungsfenster hinzufügen',
  'settings.session-mode.add-window-short': 'Hinzufügen',
  'settings.session-mode.no-windows':
    'Noch keine Sitzungsfenster konfiguriert. Die Live-Zeitleiste funktioniert weiterhin, aber phasenbasierte Vorbereitung beginnt nach dem Hinzufügen eines Fensters.',
  'settings.session-mode.layout.title': 'Phase layout',
  'settings.session-mode.layout.desc':
    'Choose which modules appear in each Session Mode phase and set their order.',
  'settings.session-mode.layout.phase-desc':
    'Toggle modules on or off, then move enabled modules into the order you want.',
  'settings.session-mode.layout.phase-desc.waiting':
    'Choose what appears while Session Mode is waiting for the next configured session.',
  'settings.session-mode.layout.phase-desc.preparation':
    'Choose what appears during pre-session preparation before trading starts.',
  'settings.session-mode.layout.phase-desc.live':
    'Choose what appears while a configured trading session is live.',
  'settings.session-mode.layout.phase-desc.break':
    'Choose what appears between configured trading sessions.',
  'settings.session-mode.layout.phase-desc.ended':
    'Choose what appears after all configured trading sessions have ended.',
  'settings.session-mode.layout.reset-phase': 'Reset',
  'settings.session-mode.layout.move-up': 'Move up',
  'settings.session-mode.layout.move-down': 'Move down',
  'settings.session-mode.layout.module.waiting-status': 'Next session card',
  'settings.session-mode.layout.module.waiting-status-desc':
    'Shows the next configured session and when preparation opens.',
  'settings.session-mode.layout.module.preparation-resources': 'Resources',
  'settings.session-mode.layout.module.preparation-resources-desc':
    'Shows linked preparation notes and playbooks.',
  'settings.session-mode.layout.module.preparation-goals': 'Goals',
  'settings.session-mode.layout.module.preparation-goals-desc':
    'Shows the DRC goals widget for pre-session focus.',
  'settings.session-mode.layout.module.preparation-checklist': 'Checklist',
  'settings.session-mode.layout.module.preparation-checklist-desc':
    'Shows the DRC checklist widget for pre-session preparation.',
  'settings.session-mode.layout.module.trade-gate': 'Trade Gate',
  'settings.session-mode.layout.module.trade-gate-desc':
    'Runs your configured IF/THEN gate during the live session.',
  'settings.session-mode.layout.module.timeline': 'Session timeline',
  'settings.session-mode.layout.module.timeline-desc':
    'Shows current-session notes and trade timeline entries.',
  'settings.session-mode.layout.module.break-reset': 'Break reset card',
  'settings.session-mode.layout.module.break-reset-desc':
    'Shows the rest, hydration, and next-session reset prompt.',
  'settings.session-mode.layout.module.ended-actions': 'End-of-session actions',
  'settings.session-mode.layout.module.ended-actions-desc':
    'Shows import, manual trade, and DRC actions after sessions end.',
  'settings.session-mode.layout.module.ended-stats': 'Session stats',
  'settings.session-mode.layout.module.ended-stats-desc':
    'Shows trade, note, and gate-check totals for the day.',
  'settings.session-mode.linked-resources': 'Verknüpfte Ressourcen',
  'settings.session-mode.linked-resources-desc':
    'Zeigt schnelle Notizlinks während der Vorbereitung.',
  'settings.session-mode.linked-resources-count': '{count} linked',
  'settings.session-mode.linked-resources-hide': 'Hide linked',
  'settings.session-mode.session-log-tags': 'Sitzungsprotokoll-Tags',
  'settings.session-mode.session-log-tags-desc':
    'Passe die Tags an, die im Session-Mode-Komponisten und im DRC-Sitzungsprotokoll verfügbar sind.',
  'settings.session-mode.tag-label-placeholder': 'Tag-Name',
  'settings.session-mode.tag-short-label-placeholder': 'Kurzlabel',
  'settings.session-mode.tag-label-example': 'Trade',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Tag-Farbe',
  'settings.session-mode.tag-requires-resolution': 'Erfordert Auflösung',
  'settings.session-mode.tag-lesson': 'Lektions-Tag',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Einträge mit diesem Tag werden als Folgepunkte markiert, bis du sie im Sitzungsprotokoll auflöst. Verwende ihn für Notizen, die nach der Sitzung Prüfung oder Aktion benötigen.',
  'settings.session-mode.tag-lesson-tooltip':
    'Markiert diesen Tag als Lerneintrag. Notizen mit Lektions-Tag können als Lektionen angezeigt und in Sitzungsprotokoll-Abläufen als Lernmomente hervorgehoben werden.',
  'settings.session-mode.add-session-log-tag':
    'Sitzungsprotokoll-Tag hinzufügen',
  'settings.session-mode.reset-session-log-tags':
    'Sitzungsprotokoll-Tags zurücksetzen',
  'settings.session-mode.tag-color.blue': 'Blau',
  'settings.session-mode.tag-color.indigo': 'Indigo',
  'settings.session-mode.tag-color.purple': 'Lila',
  'settings.session-mode.tag-color.green': 'Grün',
  'settings.session-mode.tag-color.pink': 'Pink',
  'settings.session-mode.tag-color.amber': 'Bernstein',
  'settings.session-mode.tag-color.red': 'Rot',
  'settings.session-mode.tag-color.orange': 'Orange',

  'settings.session-mode.search-resource-placeholder':
    'Vault-Dateien zum Verknüpfen suchen…',
  'settings.session-mode.default-session-name': 'Trading-Sitzung',
  'settings.session-mode.window-name': 'Sitzungsname',
  'settings.session-mode.window-name-placeholder': 'z. B. NY AM',
  'settings.session-mode.window-row-desc':
    'Lokale Zeit verwenden. Overnight-Fenster werden unterstützt, wenn die Endzeit früher als die Startzeit ist.',
  'settings.session-mode.start-time': 'Startzeit',
  'settings.session-mode.end-time': 'Endzeit',
  'trade-gate.title': 'Trade Gate',
  'trade-gate.workflow': 'Workflow',
  'trade-gate.action.start': 'Trade-Check starten',
  'trade-gate.action.start-short': 'Start',
  'trade-gate.action.start-another': 'Weiteren starten',
  'trade-gate.outcome.green-light': 'Grünes Licht',
  'trade-gate.outcome.green-light-description': 'Bedingungen erfüllt.',
  'trade-gate.outcome.no-trade': 'Kein Trade',
  'trade-gate.outcome.no-trade-description':
    'Die Bedingungen sind nicht erfüllt.',
  'trade-gate.outcome.wait': 'Warten',
  'trade-gate.outcome.wait-description':
    'Das Setup ist nicht bereit. Warte auf die nächste Gelegenheit.',
  'settings.session-mode.trade-gate.title': 'Trade-Gate-Workflows',
  'settings.session-mode.trade-gate.desc':
    'Erstelle IF/THEN-Entscheidungsflüsse für Live-Einstiegschecks.',
  'settings.session-mode.trade-gate.name': 'Workflow-Name',
  'settings.session-mode.trade-gate.summary': '{count} Knoten',
  'settings.session-mode.trade-gate.untitled': 'Unbenannter Ablauf',
  'settings.session-mode.trade-gate.start-node': 'Startfrage',
  'settings.session-mode.trade-gate.add-question': 'Frage hinzufügen',
  'settings.session-mode.trade-gate.add-outcome': 'Ergebnis hinzufügen',
  'settings.session-mode.trade-gate.question': 'Frage',
  'settings.session-mode.trade-gate.outcome': 'Ergebnis',
  'settings.session-mode.trade-gate.new-question-title': 'Neue Frage',
  'settings.session-mode.trade-gate.node-title': 'Titel',
  'settings.session-mode.trade-gate.question-title': 'Fragentitel',
  'settings.session-mode.trade-gate.result-title': 'Ergebnistitel',
  'settings.session-mode.trade-gate.prompt': 'Prompt',
  'settings.session-mode.trade-gate.description': 'Beschreibung',
  'settings.session-mode.trade-gate.options': 'Optionen',
  'settings.session-mode.trade-gate.option': 'Option',
  'settings.session-mode.trade-gate.new-option': 'Neue Option',
  'settings.session-mode.trade-gate.option-label': 'Optionsbezeichnung',
  'settings.session-mode.trade-gate.option-target': 'Führt zu',
  'settings.session-mode.trade-gate.outcome-type': 'Ergebnisverhalten',
  'settings.session-mode.trade-gate.flow-map': 'Ablaufkarte',
  'settings.session-mode.trade-gate.flow-map-hint':
    'Klicke auf eine Karte oder Pfadbeschriftung, um sie zu bearbeiten.',
  'settings.session-mode.trade-gate.flow-fit': 'Einpassen',
  'settings.session-mode.trade-gate.flow-click-hint':
    'Klicke auf einen Knoten oder eine Pfadbeschriftung, um ihn zu bearbeiten.',
  'settings.session-mode.trade-gate.edit-selected':
    'Ausgewählten Schritt bearbeiten',
  'settings.session-mode.trade-gate.results': 'Ergebnisse',
  'settings.session-mode.trade-gate.no-paths':
    'Füge Optionen hinzu, um diesen Ablauf zu verbinden.',
  'settings.session-mode.trade-gate.missing-target': 'Fehlendes Ziel',
  'settings.session-mode.trade-gate.repeated-node':
    'Verweist zurück auf diesen Knoten.',
  'settings.session-mode.trade-gate.default-name': 'Einfaches Entry Gate',
  'settings.session-mode.trade-gate.default.market-regime': 'Marktregime',
  'settings.session-mode.trade-gate.default.market-regime-prompt':
    'Ist das aktuelle Marktregime für dein Setup geeignet?',
  'settings.session-mode.trade-gate.default.bias': 'Bias im höheren Zeitrahmen',
  'settings.session-mode.trade-gate.default.bias-prompt':
    'Ist der Bias im höheren Zeitrahmen mit dieser Trade-Idee ausgerichtet?',
  'settings.session-mode.trade-gate.default.risk': 'Risikoparameter',
  'settings.session-mode.trade-gate.default.risk-prompt':
    'Ist das Risiko gemäß deinem Plan definiert und akzeptabel?',
  'filter.modal.image.annotation-status': 'Anmerkungsstatus',
  'filter.modal.image.status.tagged': 'Getaggt',
  'filter.modal.image.status.untagged': 'Ohne Tags',
  'filter.modal.image.status.has-notes': 'Hat Notizen',
  'filter.modal.image.status.no-notes': 'Keine Notizen',
  'filter.modal.image.tags': 'Medien-Tags',
  'setups.view.detail.action.gallery': 'Galerie öffnen',
  'tradelog.mode.label': 'Trade-Log-Modus',
  'tradelog.mode.trades': 'Transaktionen',
  'tradelog.mode.image-gallery': 'Galerie',
  'imageGallery.title': 'Galerie',
  'imageGallery.subtitle-count': '{count} Medienelemente',
  'imageGallery.no-images': 'Noch keine Medien gefunden.',
  'imageGallery.no-filter-results': 'Keine Medien passen zu diesem Filter.',
  'imageGallery.empty.error.title': 'Galerie nicht verfügbar',
  'imageGallery.empty.no-images.title': 'Noch keine Medien',
  'imageGallery.empty.no-images.description':
    'Bilder, GIFs, Videos und YouTube-Links aus Trades oder Review-Notizen erscheinen hier automatisch.',
  'imageGallery.empty.no-results.title':
    'Keine Medien passen zu diesen Filtern',
  'imageGallery.empty.no-results.description':
    'Leere die aktiven Filter oder erweitere den Datumsbereich, um mehr Galerieelemente anzuzeigen.',
  'imageGallery.empty.no-source.title': 'Keine Medien in dieser Quelle',
  'imageGallery.empty.no-source.description':
    'Diese Quelle enthält noch keine Galerieelemente. Wechsle zurück zu allen Medien oder wähle eine andere Quelle.',
  'imageGallery.empty.action.clear-filters': 'Filter leeren',
  'imageGallery.empty.action.show-all': 'Alle Medien anzeigen',
  'imageGallery.error.load-failed': 'Galerie konnte nicht geladen werden.',
  'imageGallery.grid-aria': 'Galerie',
  'imageGallery.open-source': 'Notiz öffnen',
  'imageGallery.image-alt': '{source}-Medium vom {date}',
  'imageGallery.privacy-blurred': 'Aus Datenschutzgründen verwischt',
  'imageGallery.filter.label': 'Filter:',
  'imageGallery.filter-aria': 'Galerie filtern',
  'imageGallery.filter.all': 'Alle',
  'imageGallery.filter.winners': 'Gewinner',
  'imageGallery.filter.losers': 'Verlierer',
  'imageGallery.filter.breakeven': 'Breakeven',
  'imageGallery.filter.tagged': 'Getaggt',
  'imageGallery.filter.untagged': 'Ohne Tags',
  'imageGallery.filter.reviewed': 'Überprüft',
  'imageGallery.filter.unreviewed': 'Nicht überprüft',
  'imageGallery.sort.label': 'Sortieren:',
  'imageGallery.sort.newest': 'Neueste',
  'imageGallery.sort.oldest': 'Älteste',
  'imageGallery.sort.best': 'Bestes P&L',
  'imageGallery.sort.worst': 'Schlechtestes P&L',
  'imageGallery.size-aria': 'Mediengröße der Galerie',
  'imageGallery.size.small': 'Klein',
  'imageGallery.size.medium': 'Mittel',
  'imageGallery.size.large': 'Groß',
  'imageGallery.source.label': 'Quelle:',
  'imageGallery.source.all': 'Alle Medien',
  'imageGallery.source.trade': 'Trades',
  'imageGallery.source.reviews': 'Reviews',
  'imageGallery.source.drc': 'Tägliche Reviews',
  'imageGallery.source.weekly': 'Wöchentliche Reviews',
  'imageGallery.source.monthly': 'Monatliche Reviews',
  'imageGallery.source.quarterly': 'Quartals-Reviews',
  'imageGallery.source.yearly': 'Jährliche Reviews',
  'imageGallery.annotation.tagged': 'Getaggt',
  'imageGallery.annotation.untagged': 'Ohne Tags',
  'imageGallery.annotation.reviewed': 'Überprüft',
  'imageGallery.annotation.unreviewed': 'Nicht überprüft',
  'imageGallery.date.unknown': 'Unbekanntes Datum',
  'imageGallery.annotation.tag': 'Tag',
  'imageGallery.annotation.editor-eyebrow': 'Marktstruktur-Journal',
  'imageGallery.annotation.editor-title': 'Medium annotieren',
  'imageGallery.annotation.tags': 'Tags',
  'imageGallery.annotation.tags-placeholder': 'Breakout, A+ Setup, Fehler',
  'imageGallery.annotation.notes': 'Notizen',
  'imageGallery.annotation.notes-placeholder':
    'Was soll dein zukünftiges Ich aus diesem Chart lernen?',
  'imageGallery.annotation.error.save-failed':
    'Medienannotation konnte nicht gespeichert werden.',
  'imageGallery.annotation.saving': 'Speichern...',
  'tradelog.guide.switch-to-gallery.title': 'Von Trades zur Galerie wechseln',
  'tradelog.guide.switch-to-gallery.description':
    'Verwende diesen Modus-Umschalter, um zwischen dem normalen Trade-Log und der Galerie zu wechseln. Klicke auf Galerie, um die Tour mit deinen Bildern, GIFs, Videos und YouTube-Links fortzusetzen.',
  'tradelog.guide.gallery-controls.title':
    'Wähle aus, welche Medien du prüfen möchtest',
  'tradelog.guide.gallery-controls.description':
    'Nutze Quelle, um Trades oder Review-Notizen auszuwählen, Sortieren zum Umordnen der Medien und die Größenbuttons, um zwischen kompaktem Scan und größerer Medienvorschau zu wechseln.',
  'tradelog.guide.gallery-source-sort.title':
    'Medienquelle und Reihenfolge wählen',
  'tradelog.guide.gallery-source-sort.description':
    'Verwende Quelle, um alle Medien, Trade-Anhänge oder Medien aus Review-Notizen anzuzeigen. Verwende Sortieren, um die neuesten, ältesten, besten oder schlechtesten Trades zuerst zu prüfen.',
  'tradelog.guide.gallery-size.title': 'Vorschaugröße der Galerie anpassen',
  'tradelog.guide.gallery-size.description':
    'Nutze diese Größenbuttons, um zwischen kompakter Durchsicht und größeren Chart-Vorschauen zu wechseln, ohne wichtige Chartdetails abzuschneiden.',
  'tradelog.guide.gallery-filters.title':
    'Filtere die Galerie über denselben Einstieg',
  'tradelog.guide.gallery-filters.description':
    'Der Filterbutton öffnet weiterhin die erweiterten Filter. Im Galerie-Modus enthält er zusätzlich medienspezifische Filter wie Anmerkungsstatus und Medien-Tags.',
  'tradelog.guide.gallery-filter-modal.title':
    'Medienfilter liegen bei deinen Trade-Filtern',
  'tradelog.guide.gallery-filter-modal.description':
    'Verwende dieses Modal, um Trade-Filter mit Medienfiltern zu kombinieren. Filtere zum Beispiel auf ein Setup und zeige dann nur Medien mit Notizen oder einem bestimmten Medien-Tag.',
  'tradelog.guide.gallery-grid.title': 'Öffne Medien für eine genauere Prüfung',
  'tradelog.guide.gallery-grid.description':
    'Jede Karte hält das Medium frei sichtbar und zeigt gleichzeitig kompakten Trade- und Review-Kontext. Klicke auf eine Karte oder auf Weiter, um das erste sichtbare Element im Vollbild zu öffnen.',
  'tradelog.guide.gallery-fullscreen-actions.title':
    'Medien im Vollbild annotieren',
  'tradelog.guide.gallery-fullscreen-actions.description':
    'Verwende Tag, um medienbezogene Tags und Notizen hinzuzufügen, während das Element groß genug zum Prüfen ist. Notiz öffnen bringt dich zurück zur Quell-Trade- oder Review-Notiz.',
  'tradelog.guide.gallery-open-annotation.title': 'Annotationsbereich öffnen',
  'tradelog.guide.gallery-open-annotation.description':
    'Klicke auf Tag, um genau dieses Medium zu annotieren. Medien-Tags und Notizen beschreiben den Anhang, nicht den gesamten Trade.',
  'tradelog.guide.gallery-annotation-panel.title':
    'Medien-Tags und Notizen hinzufügen',
  'tradelog.guide.gallery-annotation-panel.description':
    'Nutze Medien-Tags für chartspezifische Ideen wie Liquidity Sweep oder fehlgeschlagener Breakout und Notizen für den Marktstruktur-Kontext, den du behalten möchtest.',
  'tradelog.guide.gallery-finish.title': 'Du kennst jetzt beide Trade-Log-Modi',
  'tradelog.guide.gallery-finish.description':
    'Nutze Trades, wenn du die Tabelle und Batch-Werkzeuge brauchst. Nutze die Galerie, wenn du Bilder, GIFs, Videos, YouTube-Links und Chart-Annotationen in deinem Journal prüfen möchtest.',
  'tradelog.guide.image-gallery-empty.intro.title': 'Noch keine Medien',
  'tradelog.guide.image-gallery-empty.intro.description':
    'Füge Bilder, GIFs, Videos oder YouTube-Links zu Trades oder Review-Notizen hinzu, dann erscheinen sie hier automatisch. Sobald Medien vorhanden sind, zeigt Journalit die vollständige Galerie-Anleitung für Vollbildprüfung, Tags und Notizen.',
  'tradelog.guide.image-gallery-empty.source-sort.description':
    'Verwende Quelle, um zwischen Trade-Medien und Medien aus Review-Notizen zu wählen, sobald beides existiert. Sortieren ordnet die Galerie neu, wenn Medien verfügbar sind.',
  'tradelog.guide.image-gallery-empty.size.description':
    'Diese Buttons steuern, wie groß zukünftige Medienkarten erscheinen, von kompaktem Scannen bis zu größeren Vorschauen.',
  'tradelog.guide.image-gallery-empty.filters.description':
    'Erweiterte Filter enthält bereits die Medienfilter, die du später nutzt, einschließlich Anmerkungsstatus und Medien-Tags.',
  'tradelog.guide.image-gallery-empty.finish.title':
    'Füge Medien hinzu und komm für die vollständige Galerie-Tour zurück',
  'tradelog.guide.image-gallery-empty.finish.description':
    'Nachdem du Medien an Trades oder Review-Notizen angehängt hast, zeigt Journalit die vollständige Galerie-Anleitung mit Vollbildprüfung, Tags und Notizen.',
  'filter.modal.section.image-gallery': 'Galerie',
  'setups.view.fixture.rule.context-aligned': 'Fixture rule context aligned',
  'setups.view.fixture.rule.orb.range-defined': 'Rule orb range defined',
  'setups.view.fixture.rule.orb.volume-expansion': 'Rule orb volume expansion',
  'setups.view.fixture.rule.orb.market-aligned': 'Rule orb market aligned',
  'setups.view.fixture.rule.orb.clean-invalidation':
    'Rule orb clean invalidation',
  'setups.view.fixture.rule.orb.target-defined': 'Rule orb target defined',
  'setups.view.detail.brief.profile.model': 'Brief profile model',
  'setups.view.detail.brief.profile.category': 'Brief profile category',
  'setups.view.completeness.no-description': 'View completeness no description',
};
export default de;
