

import type { Lang } from './en';

const de: Lang = {
  'trade-import.recovery.bybit-header.columns':
    'Fehlende erforderliche Spalten: {columns}.',
  'trade-import.recovery.bybit-header.title':
    'Bybit-Kopfzeile oder Export prüfen',
  'trade-import.recovery.bybit-header.message':
    'Die gewählte Kopfzeile passt nicht zum Bybit-Handelsverlauf. Prüfe die Kopfzeile oder exportiere Ausführungen mit Ausführungspreisen und Mengen, nicht nur Orderpreisen. Um ein anderes Format zuzuordnen, wähle ausdrücklich {manualSource}.',
  'update.installed.title': 'Was ist neu?',
  'settings.general.available-update-notifications':
    'Update-Erinnerungen anzeigen',
  'settings.general.available-update-notifications-desc':
    'Täglich nach neuen Versionen suchen und an Updates erinnern. Deaktivieren, um nur die Neuerungen nach einem Update zu sehen.',
  'account.edit.field.unscoped-live-balance-desc':
    'Eine frühere Kontostandskorrektur konnte keiner Phase zugeordnet werden. Sie bleibt erhalten; gib den aktuellen Broker-Kontostand ein, um die aktive Phase abzugleichen.',
  'account.edit.error.inactive-phase':
    'Der Live-Kontostand kann nur in einer aktiven Phase geändert werden.',
  'account.edit.error.phase-changed':
    'Die Kontodaten wurden während der Bearbeitung geändert. Öffne den Kontoeditor vor dem Speichern erneut.',
  'account.profiles.profitable-days-conflict':
    'Behalte deine aktuelle Auszahlungsrichtlinie bei oder ändere die Anforderung an profitable Tage, bevor du diese Bedingungen anwendest.',
  'templateEditor.widget.session-log.hide-empty-outside':
    'Protokoll außerhalb der Sitzung ausblenden, wenn es leer ist',
  'account.profiles.correction-title': 'Katalogkorrektur',
  'account.profiles.correction-source': 'Regelquelle',
  'account.profiles.correction-period': 'Betroffener Verlauf',
  'account.profiles.correction-history': 'Regelkorrekturen',
  'account.profiles.correction-before': 'Vorher',
  'account.profiles.correction-after': 'Nachher',
  'account.profiles.correction-stale':
    'Der Kontoverlauf hat sich geändert. Öffne die Prüfung erneut.',
  'account.profiles.correction-result': 'Prüfung harter Regeln',
  'account.profiles.no-hard-breach': 'Kein harter Regelverstoß erkannt',
  'account.profiles.correction-consent': 'Verlauf neu berechnen',
  'account.profiles.correction-details': 'Einzelheiten',
  'account.profiles.correction-apply': 'Korrektur anwenden',
  'account.profiles.purchase-date': 'Ursprüngliches Kaufdatum',
  'account.profiles.save-purchase': 'Kaufdatum speichern',
  'account.profiles.purchase-needed':
    'Gib das ursprüngliche Kaufdatum ein, um diese Bedingungen zu prüfen.',
  'account.profiles.purchase-excluded':
    'Für diesen Kauf bleiben die bisherigen Bedingungen bestehen.',
  'account.profiles.purchase-uncertain':
    'Die Firma muss die Anwendbarkeit bestätigen. Die Regeln bleiben unverändert.',
  'account.profiles.initial-terms':
    'Diese Bedingungen gelten ab Kauf oder vor dieser Phase. Prüfe die Ersteinrichtung separat; der Verlauf bleibt unverändert.',
  'account.profiles.announcement': 'Mitteilung der Firma',
  'account.profiles.firm-effective':
    'Von der Firma bestätigtes Gültigkeitsdatum',
  'account.profiles.published-date': 'Veröffentlichtes Gültigkeitsdatum',
  'account.profiles.applicability-checking': 'Anwendbarkeit wird geprüft…',
  'account.profiles.no-matching-phase':
    'Keine passende Phase in diesen Firmenregeln.',
  'account.profiles.history-unchanged':
    'Der bisherige Verlauf bleibt unverändert.',
  'account.profiles.notice-title': 'Aktualisierte Firmenregeln verfügbar',
  'account.profiles.notice-description':
    'Die veröffentlichten Regeln der Firma weichen von den auf diesem Konto gespeicherten ab. Deine Kontoregeln wurden nicht geändert.',
  'account.profiles.review-changes': 'Änderungen prüfen',
  'account.profiles.check-failed':
    'Regelaktualisierungen konnten nicht geprüft werden.',
  'account.profiles.retry': 'Erneut versuchen',
  'account.profiles.source-changed':
    'Die Regeln der Firma haben sich geändert, während diese Prüfung offen war. Öffne die Prüfung erneut, bevor du sie anwendest.',
  'account.profiles.retain': 'Aktuelle Regeln behalten',
  'account.profiles.retain-help':
    'Behalte die Kontoregeln und blende diese Quelländerungen aus. Spätere Regeländerungen können erneut gemeldet werden.',
  'account.profiles.comparison-help':
    'Nur Unterschiede werden angezeigt. Klappe eine Regel auf, um ihre Felder zu prüfen. Lokale Anpassungen können Unterschiede erklären.',
  'account.profiles.added': 'Hinzugefügt',
  'account.profiles.removed': 'Entfernt',
  'account.profiles.changed': 'Geändert',
  'account.profiles.not-configured': 'Nicht konfiguriert',
  'account.profiles.no-rule-changes':
    'Keine Unterschiede bei Regeln oder Auszahlungsbedingungen für diese Phase.',
  'account.profiles.accept': 'Aktualisierung übernehmen',
  'account.profiles.cached':
    'Zwischengespeicherte Firmenregeln werden verwendet; die neuesten Regeln konnten nicht geprüft werden.',
  'account.profiles.account-phase': 'Kontophase',
  'account.profiles.choose': 'Gespeicherte Regeln wählen',
  'account.profiles.completed':
    'Abgeschlossene Phasen behalten ihre ursprünglichen Regeln.',
  'account.profiles.confirm': 'Diese Regeln gelten für mein Konto.',
  'account.profiles.currency':
    'Wähle eine Kontowährung, die zu diesen Regeln passt, bevor du sie anwendest.',
  'account.profiles.current': 'Aktuelle Kontoregeln',
  'account.profiles.custom-transition': 'Eigene Übergangsbedingungen',
  'account.profiles.cycle-start': 'Beginn des Auszahlungszyklus (Ortszeit)',
  'account.profiles.delete-help':
    'Diese gespeicherten Regeln löschen? Konten, die sie bereits nutzen, ändern sich nicht.',
  'account.profiles.effective': 'Gültig ab (Ortszeit)',
  'account.profiles.error':
    'Die Regeln konnten nicht gespeichert werden. Prüfe die Werte und versuche es erneut.',
  'account.profiles.floor': 'Drawdown-Untergrenze beim Übergang',
  'account.profiles.history': 'Regelverlauf',
  'account.profiles.history-help':
    'Frühere Regeln bleiben erhalten. Nutze „Regelaktualisierung prüfen“, um eine versionierte Phase zu ändern; direktes Bearbeiten ist gesperrt, um den Verlauf zu schützen.',
  'account.profiles.incoming': 'Eingehende Firmenregeln',
  'account.profiles.independent':
    'Gespeicherte Regeln sind lokal in diesem Vault. Beim Anwenden entsteht eine unabhängige Kopie auf dem Konto; eine neue Revision ändert nie bestehende Konten.',
  'account.profiles.keep-help':
    'Markierte Regeln behalten deine lokalen Werte statt der eingehenden Regel dieser Art. Entferne die Markierung, um den Wert der Firma zu übernehmen. Neue Regelarten werden hinzugefügt.',
  'account.profiles.keep-local': 'Meine Regel behalten:',
  'account.profiles.keep-payout': 'Aktuelle Auszahlungsrichtlinie behalten',
  'account.profiles.library': 'Meine gespeicherten Regeln',
  'account.profiles.locked': 'Drawdown-Untergrenze ist bereits gesperrt',
  'account.profiles.missing':
    'Diese gespeicherten Regeln existieren nicht mehr.',
  'account.profiles.peak': 'Übernommener Höchstsaldo',
  'account.profiles.review': 'Regelaktualisierung prüfen',
  'account.profiles.save-new': 'Diese Regeln speichern',
  'account.profiles.saved': 'In „Meine gespeicherten Regeln“ gespeichert.',
  'account.profiles.update-saved': 'Gespeicherte Regeln aktualisieren',
  'account.profiles.delete-saved': 'Gespeicherte Regeln löschen',
  'account.profiles.save-revision':
    'Als neue Revision der ausgewählten Regeln speichern',
  'account.profiles.source-phase': 'Phase der Firmenregeln',
  'account.profiles.transition-help':
    'Keine verifizierten Übergangsvorgaben vorhanden. Trage bestätigte Untergrenze, Höchstsaldo und Zyklusbeginn ein. Diese gelten als benutzerdefiniert. Phasengewinn und gesamte Auszahlungsanzahl bleiben erhalten; ältere Trades behalten ihre Regeln.',
  'account.profiles.transition-source': 'Bestätigung der Firma oder Referenz',
  'account.profiles.link-intro':
    'Verknüpfe diese Prüfung mit den Regeln ihrer Firma, und Journalit sagt dir, wenn die Firma sie ändert. Zuerst prüfst du, wie sie sich von den Regeln dieses Kontos unterscheiden; nichts ändert sich, bis du übernimmst.',
  'account.profiles.link-title': 'Mit Firmenregeln verknüpfen',
  'account.profiles.choose-source': 'Firmenregeln wählen',
  'account.profiles.update-available':
    'Die Regeln der Firma haben sich geändert und müssen geprüft werden. Dein Konto nutzt weiterhin seine gespeicherten Regeln.',
  'account.profiles.up-to-date':
    'Diese Phase nutzt die zuletzt geprüften Firmenregeln; lokale Anpassungen bleiben unabhängig.',
  'widget.mfeScatter.name': 'MFE vs. realisierter Gewinn/Verlust',
  'widget.mfeScatter.description':
    'Maximaler offener Gewinn vs. finales P&L je Trade',
  'widget.mfeScatter.y': 'Realisierter G/V ({unit})',
  'widget.mfeScatter.winners': 'Gewinner',
  'widget.mfeScatter.losers': 'Verlierer',
  'widget.mfeScatter.breakeven': 'Gewinnschwelle',
  'widget.mfeScatter.empty':
    'Keine abgeschlossenen Trades mit nutzbarer MFE in dieser Einheit.',

  'trade-sync.tradovate.status.setup-required': 'Kontoeinrichtung erforderlich',
  'trade-sync.tradovate.status.connecting': 'Verbindung wird hergestellt',
  'trade-sync.tradovate.status.paused': 'Pausiert',
  'trade-sync.tradovate.status.reauthorization-required':
    'Erneute Autorisierung erforderlich',
  'trade-sync.tradovate.status.deleting': 'Cloud-Daten werden gelöscht',
  'trade-sync.tradovate.status.error': 'Verbindungsfehler',

  'trade-sync.tradovate.sync-complete-connection':
    'Synchronisierung für {connection} abgeschlossen.',
  'trade-sync.tradovate.sync-partial-connection':
    'Synchronisierung für {connection} mit Problemen abgeschlossen.',
  'trade-sync.tradovate.sync-all': 'Alle synchronisieren',
  'trade-sync.tradovate.sync-all-complete':
    '{succeeded} von {total} Tradovate-Verbindungen synchronisiert.',
  'trade-sync.tradovate.sync-all-partial':
    '{succeeded} von {total} Tradovate-Verbindungen synchronisiert. Überprüfe die Verbindungen mit Problemen.',
  'trade-sync.tradovate.connect-another': 'Weiteres Tradovate-Konto verbinden',
  'trade-sync.tradovate.no-connections':
    'Verbinde ein Tradovate-Konto auf Journalit.co, um es hier zu konfigurieren und zu synchronisieren.',
  'trade-sync.tradovate.claimed-by-connection':
    'Die Synchronisierung ist über {connection} aktiviert. Deaktiviere sie dort, bevor du dieses Konto wechselst.',
  'trade-sync.tradovate.claim-conflict':
    'Eine andere Tradovate-Verbindung hat dieses Konto beansprucht. Prüfe die aktualisierten Verbindungskarten, bevor du es erneut versuchst.',
  'trade-sync.tradovate.reconciliation-issues': '{count} Abstimmungsproblem(e)',
  'trade-sync.tradovate.website-connection-description':
    'Verbinde Tradovate sicher auf Journalit.co oder autorisiere es erneut. Kehre dann hierher zurück, um Konten auszuwählen und deinen Vault zu synchronisieren.',
  'trade-sync.tradovate.paused-website-description':
    'Diese Tradovate-Verbindung ist pausiert. Verwalte sie auf Journalit.co, um sie zu prüfen oder fortzusetzen.',
  'trade-sync.tradovate.plugin-sync-description':
    'Eine Synchronisierung ruft deine neuesten Tradovate-Aktivitäten ab und schreibt die daraus entstehenden Trades in diesen Vault.',
  'trade-sync.tradovate.connect': 'Verbinden',
  'trade-sync.tradovate.manage-connection': 'Verbindung verwalten',
  'trade-sync.tradovate.setup-guide': 'Einrichtungsanleitung',
  'trade-sync.tradovate.setup-and-sync':
    'Einrichtung abschließen und synchronisieren',
  'trade-sync.tradovate.sync-to-vault': 'Synchronisieren',
  'trade-sync.tradovate.discovery-description':
    'Journalit muss die über deine Tradovate-Verbindung verfügbaren Demo- und Live-Konten ermitteln.',
  'trade-sync.tradovate.discover-accounts': 'Tradovate-Konten ermitteln',
  'trade-sync.tradovate.discovering': 'Konten werden ermittelt…',
  'trade-sync.tradovate.discovery-failed':
    'Die Ermittlung der Tradovate-Konten ist fehlgeschlagen. Versuche es erneut oder verwalte die Verbindung auf Journalit.co.',
  'trade-sync.tradovate.sync-account': 'In Synchronisierung aufnehmen',
  'trade-sync.tradovate.history-label': 'Anfangsverlauf',
  'trade-sync.tradovate.history-all': 'Gesamter verfügbarer Verlauf',
  'trade-sync.tradovate.history-recent': 'Letzte 90 Tage',
  'trade-sync.tradovate.history-custom': 'Ab einem bestimmten Datum',
  'trade-sync.tradovate.history-new': 'Nur neue Trades',
  'trade-sync.tradovate.start-date': 'Startdatum',

  'trade-sync.tradovate.mapping-required':
    'Wähle für jedes aktivierte Tradovate-Konto ein lokales Vault-Konto.',
  'trade-sync.tradovate.custom-date-required':
    'Wähle für jede benutzerdefinierte Verlaufsauswahl ein Startdatum.',
  'trade-sync.tradovate.recovery-title':
    'Fehlende Trade-Notizen wiederherstellen',
  'trade-sync.tradovate.recovery-count':
    '{count} Trade-Notiz(en) wiederherzustellen',
  'trade-sync.tradovate.recovery-select-account':
    'Wähle vor der Wiederherstellung von Trade-Notizen ein lokales Konto aus.',
  'trade-sync.tradovate.recovery-confirm':
    '{count} Trade-Notiz(en) in {account} wiederherstellen?',

  'trade-sync.ctrader.status.setup-required': 'Kontoeinrichtung erforderlich',
  'trade-sync.ctrader.status.connecting': 'Verbindung wird hergestellt',
  'trade-sync.ctrader.status.paused': 'Pausiert',
  'trade-sync.ctrader.status.reauthorization-required':
    'Erneute Autorisierung erforderlich',
  'trade-sync.ctrader.status.deleting': 'Cloud-Daten werden gelöscht',
  'trade-sync.ctrader.status.error': 'Verbindungsfehler',
  'trade-sync.ctrader.sync-complete-connection':
    'Synchronisierung für {connection} abgeschlossen.',
  'trade-sync.ctrader.sync-partial-connection':
    'Synchronisierung für {connection} mit Problemen abgeschlossen.',
  'trade-sync.ctrader.sync-all': 'Alle synchronisieren',
  'trade-sync.ctrader.sync-all-complete':
    '{succeeded} von {total} cTrader-Verbindungen synchronisiert.',
  'trade-sync.ctrader.sync-all-partial':
    '{succeeded} von {total} cTrader-Verbindungen synchronisiert. Überprüfe die Verbindungen mit Problemen.',
  'trade-sync.ctrader.connect-another': 'Weiteres cTrader-Konto verbinden',
  'trade-sync.ctrader.no-connections':
    'Verbinde ein cTrader-Konto auf Journalit.co, um es hier zu konfigurieren und zu synchronisieren.',
  'trade-sync.ctrader.claimed-by-connection':
    'Die Synchronisierung ist über {connection} aktiviert. Deaktiviere sie dort, bevor du dieses Konto wechselst.',
  'trade-sync.ctrader.claim-conflict':
    'Eine andere cTrader-Verbindung hat dieses Konto beansprucht. Prüfe die aktualisierten Verbindungskarten, bevor du es erneut versuchst.',
  'trade-sync.ctrader.reconciliation-issues': '{count} Abstimmungsproblem(e)',
  'trade-sync.ctrader.website-connection-description':
    'Verbinde cTrader sicher auf Journalit.co oder autorisiere es erneut. Kehre dann hierher zurück, um Konten auszuwählen und deinen Vault zu synchronisieren.',
  'trade-sync.ctrader.plugin-sync-description':
    'Eine Synchronisierung ruft deine neuesten cTrader-Aktivitäten ab und schreibt die daraus entstehenden Trades in diesen Vault.',
  'trade-sync.ctrader.connect': 'Verbinden',
  'trade-sync.ctrader.manage-connection': 'Verbindung verwalten',
  'trade-sync.ctrader.setup-guide': 'Einrichtungsanleitung',
  'trade-sync.ctrader.setup-and-sync':
    'Einrichtung abschließen und synchronisieren',
  'trade-sync.ctrader.sync-to-vault': 'Synchronisieren',
  'trade-sync.ctrader.discovery-description':
    'Journalit muss die über deine cTrader-Verbindung verfügbaren Demo- und Live-Konten ermitteln.',
  'trade-sync.ctrader.discover-accounts': 'cTrader-Konten ermitteln',
  'trade-sync.ctrader.discovering': 'Konten werden ermittelt…',
  'trade-sync.ctrader.discovery-failed':
    'Die Ermittlung der cTrader-Konten ist fehlgeschlagen. Versuche es erneut oder verwalte die Verbindung auf Journalit.co.',
  'trade-sync.ctrader.sync-account': 'In Synchronisierung aufnehmen',
  'trade-sync.ctrader.history-label': 'Anfangsverlauf',
  'trade-sync.ctrader.history-all': 'Gesamter verfügbarer Verlauf',
  'trade-sync.ctrader.history-recent': 'Letzte 90 Tage',
  'trade-sync.ctrader.history-custom': 'Ab einem bestimmten Datum',
  'trade-sync.ctrader.history-new': 'Nur neue Trades',
  'trade-sync.ctrader.start-date': 'Startdatum',
  'trade-sync.ctrader.mapping-required':
    'Wähle für jedes aktivierte cTrader-Konto ein lokales Vault-Konto.',
  'trade-sync.ctrader.custom-date-required':
    'Wähle für jede benutzerdefinierte Verlaufsauswahl ein Startdatum.',
  'trade-sync.ctrader.recovery-title':
    'Fehlende Trade-Notizen wiederherstellen',
  'trade-sync.ctrader.recovery-count':
    '{count} Trade-Notiz(en) wiederherzustellen',
  'trade-sync.ctrader.recovery-select-account':
    'Wähle vor der Wiederherstellung von Trade-Notizen ein lokales Konto aus.',
  'trade-sync.ctrader.recovery-confirm':
    '{count} Trade-Notiz(en) in {account} wiederherstellen?',
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
    'Synchronize cTrader trades in the cloud and project them into this vault.',
  'trade-sync.ctrader.status-failed': 'Unable to load cTrader status.',
  'trade-sync.ctrader.last-sync': 'Letzte Synchronisierung',
  'trade-sync.ctrader.pending-acks': '{count} ausstehende lokale ACK(s)',
  'trade-sync.ctrader.never': 'Nie',

  'command.add-trade': 'Neuen Trade hinzufügen',
  'command.quick-import-trades': 'Trades schnell importieren',
  'command.import-trades-csv': 'Trade Import öffnen',
  'command.create-drc': 'Öffnen Sie DRC (Tagesbericht)',
  'command.create-weekly-review': 'Offener wöchentlicher Rückblick',
  'command.create-monthly-review': 'Monatsreview öffnen',
  'command.create-quarterly-review': 'Quartalsreview öffnen',
  'command.create-yearly-review': 'Offener Jahresrückblick',
  'command.open-dashboard': 'Auswertung öffnen',
  'command.open-account-dashboard': 'Konten öffnen',
  'command.open-trade-log': 'Trade-Log öffnen',
  'command.open-economic-calendar': 'Wirtschaftskalender öffnen',
  'command.open-home': 'Home-Ansicht öffnen',
  'command.open-settings': 'Einstellungen öffnen',
  'command.open-position-size-calculator': 'Positionsgrößenrechner öffnen',
  'command.replay-onboarding': 'Wiederholen Sie den Onboarding-Ablauf',
  'command.replay-current-view-guide':
    'Wiedergabeanleitung für die aktuelle Ansicht',
  'command.open-release-notes': 'Versionshinweise anzeigen',
  'command.open-layout-builder': 'Öffnen Sie den Layout-Builder',
  'notice.guide.replay-unavailable':
    'Das Guide-System ist noch nicht fertig. Bitte versuchen Sie es erneut.',
  'notice.guide.no-active-view':
    'Öffnen Sie zuerst eine unterstützte Journalit-Ansicht und führen Sie dann diesen Befehl aus.',
  'notice.guide.no-guide-for-view':
    'Für diese Ansicht ist noch kein Guide registriert ({viewType}).',
  'notice.guide.unavailable-in-current-state':
    'Der Guide dieser Ansicht ist im aktuellen Zustand nicht verfügbar.',
  'notice.guide.replay-failed':
    'Der Guide konnte nicht gestartet werden. Bitte versuchen Sie es erneut.',
  'notice.guide.replay-started':
    'Der Guide wurde für diese Ansicht neu gestartet.',
  'template.switch-title': 'Layout wechseln',
  'template.switch-review-title': '{type}-Layout wechseln',

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

  'auth.label.email': 'E-Mail-Adresse',

  'auth.button.send-code': 'Bestätigungscode senden',

  'auth.label.code': 'Bestätigungscode',

  'auth.button.verify': 'Bestätigen und anmelden',

  'auth.button.resend': 'Code erneut senden',

  'auth.error.needs-premium': 'Pro-Funktion',

  'auth.error.network-error': 'Verbindungsfehler',

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

  'form.section.custom-fields-empty-title': 'Noch keine erweiterten Felder.',
  'form.section.custom-fields-empty-desc':
    'Erfassen Sie alles, was die integrierten Felder auslassen, etwa Session, Zeitrahmen oder Setup-Bewertung. Eigene Felder werden mit jedem Trade gespeichert und können zu sortierbaren Spalten im Trade-Log werden.',
  'form.section.attachments': 'Anhänge',
  'form.tab.basic': 'Basis',
  'form.tab.details': 'Einzelheiten',
  'form.tab.advanced': 'Fortschrittlich',

  
  
  
  'form.import-shortcut.open': 'Trade-Import öffnen',
  'form.manual-import-nudge.title.one':
    'Tipp: Du hast {count} Trade von Hand eingetragen',
  'form.manual-import-nudge.title.few':
    'Tipp: Du hast {count} Trades von Hand eingetragen',
  'form.manual-import-nudge.title.many':
    'Tipp: Du hast {count} Trades von Hand eingetragen',
  'form.manual-import-nudge.title.other':
    'Tipp: Du hast {count} Trades von Hand eingetragen',
  'form.manual-import-nudge.body':
    'Der Trade-Import kann deine Broker- oder Tabellenhistorie gesammelt übernehmen, statt jeden Trade einzeln einzutragen.',
  'form.manual-import-nudge.cta': 'Meine Trades ansehen',
  'form.manual-import-nudge.dismiss': 'Nicht jetzt',
  'form.layout.customize': 'Formular anpassen',
  'form.layout.modal-title': 'Trade-Formular anpassen',
  'form.layout.settings-title': 'Trade-Formularlayout',

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

  'form.layout.item.trade-currency': 'Handelswährung / Wechselkurs',
  'form.layout.item.trade-currency-desc':
    'Trade in einer anderen Währung mit optionalem manuellem Wechselkurs erfassen.',
  'form.layout.item.exchange-desc': 'Börsenfeld für Aktien- und Krypto-Trades.',
  'form.layout.item.direct-pnl-toggle-desc':
    'Einen einzelnen Trade auf die Eingabe eines Gesamt-P&L statt Ausstiegskursen umstellen.',
  'form.layout.manual-fx-rate': 'FX-Kurs-Override',
  'form.layout.result-r': 'Ergebnis in R',
  'form.layout.entry-time': 'Trade-Zeit',
  'form.field.account': 'Konto',
  'form.field.prop-challenge-phase': 'Zugeordnete Phase: {name}',
  'form.field.prop-challenge-phase.none': 'Keine Phase zu diesem Zeitpunkt',
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

  'form.field.other-fees': 'Sonstige Gebühren',
  'form.field.stop-loss': 'Stop-Loss',
  'form.field.take-profit': 'Gewinnziel',
  'form.field.take-profit-short': 'Ziel',
  'form.field.target-price': 'Zielpreis',
  'form.field.close-percent': 'Schließen %',
  'form.field.close-size': 'Schließgröße',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': 'Gewinnziel-Schließmenge als',
  'form.layout.take-profit-unit-percent': 'Schließen %',
  'form.layout.take-profit-unit-size': 'Größe',
  'trade.validation.take-profit-size-number':
    'Take-Profit-Größe muss eine gültige Zahl sein.',
  'trade.validation.take-profit-size-positive':
    'Take-Profit-Größe muss größer als 0 sein.',
  'trade.validation.take-profit-total-size-range':
    'Take-Profit-Größen dürfen die Positionsgröße nicht überschreiten.',
  'form.field.risk-amount': 'Risikobetrag',
  'form.field.profit-loss': 'Gewinn/Verlust',
  'form.field.total-pnl': 'Trade-G/V',
  'form.field.realized-pnl': 'Realisiert P&L',
  'form.field.floating-pnl': 'Schwebender P&L',
  'form.field.total-costs': 'Gesamtkosten:',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Fehler',
  'form.field.custom-tags': 'Benutzerdefinierte Tags',
  'form.field.trade-thesis': 'Trade-These',
  'form.field.time': 'Zeit',
  'form.field.price': 'Preis',

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
  'form.account-empty-state.title': 'Richten Sie Ihr erstes Konto ein',
  'form.account-empty-state.description':
    'Konten verfolgen Ihren Kontostand, damit Journalit Rendite, Risiko und Drawdown berechnen kann. Für die Erstellung genügt ein Name.',
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
  'form.field.trade-currency': 'Handelswährung',
  'form.field.fx-rate': 'Wechselkurs zu {base}',
  'form.field.fx-rate-override': 'FX-Kurs-Override ({quote} → {base})',
  'form.forex.using-manual-rate': 'Manueller Wechselkurs wird verwendet',
  'form.field.lot-size.standard': 'Standard (100.000)',
  'form.field.lot-size.mini': 'Mini (10.000)',
  'form.field.lot-size.micro': 'Mikro (1.000)',
  'form.field.lot-size.custom': 'Benutzerdefiniert',
  'form.field.image-url-placeholder': 'Bild-URL oder Dateipfad einfügen...',
  'form.field.image-duplicate-error': 'Dieses Bild wurde bereits hinzugefügt.',
  'form.field.trade-image-alt': 'Trade-Bild',

  'form.field.value-dollar': 'Wert ($)',
  'form.field.dollar-amount-placeholder': 'Dollarbetrag',
  'form.field.direct-pnl-placeholder': 'Gewinn- oder Verlustbetrag eingeben',

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
  'form.placeholder.fx-rate': '1 {currency} = ? {base} (leer: Tageskurs)',
  'form.placeholder.custom-tag':
    'Geben Sie ein benutzerdefiniertes Tag ein und drücken Sie die Eingabetaste',
  'form.placeholder.thesis': 'Geben Sie Ihre These für diesen Trade ein...',

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
  'button.close': 'Schließen',
  'button.done': 'Erledigt',
  'button.edit': 'Bearbeiten',
  'button.delete': 'Löschen',
  'button.update': 'Aktualisieren',
  'button.open': 'Öffnen',
  'button.add': 'Hinzufügen',
  'button.create': 'Erstellen',
  'button.reset': 'Zurücksetzen',
  'button.reset-to-defaults': 'Auf Standardeinstellungen zurücksetzen',

  'button.confirm': 'Bestätigen',

  'button.back': 'Zurück',
  'button.add-trade': 'Trade hinzufügen',
  'button.update-trade': 'Trade aktualisieren',
  'button.save-changes': 'Änderungen speichern',
  'button.create-trade': 'Trade erstellen',
  'button.delete-all': 'Alle löschen',
  'button.clear-all': 'Alles löschen',

  'button.cancel-reset': 'Zurücksetzen abbrechen',
  'button.proceed-anyway': 'Fahren Sie trotzdem fort',
  'button.mark-reviewed': 'Als geprüft markieren',
  'button.maybe-later': 'Vielleicht später',
  'button.upgrade-now': 'Jetzt upgraden',

  'button.apply': 'Anwenden',

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
    'Die Lot-Größe muss größer als null sein.',
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
  'trade.validation.fx-rate-number':
    'Der Wechselkurs muss eine gültige Zahl sein.',
  'trade.validation.fx-rate-positive':
    'Der Wechselkurs muss größer als null sein.',
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

  'notice.login-success': 'Erfolgreich eingeloggt!',
  'notice.pro-access-ready': 'Der PRO-Zugang ist bereit.',

  'notice.logout-success': 'Erfolgreich abgemeldet',
  'notice.ftp-created': 'FTP-Anmeldeinformationen erfolgreich erstellt',
  'notice.ftp-password-rotated':
    'Für dieses Gerät wurden neue FTP-Anmeldeinformationen erstellt. FTP-Sync auf anderen Geräten (z. B. Ihr MetaTrader-EA) muss mit dem neuen Passwort aktualisiert werden.',
  'notice.ftp-reused':
    'Vorhandene FTP-Anmeldeinformationen von diesem Gerät geladen. Falls sie nicht mehr funktionieren, verwenden Sie „Passwort zurücksetzen“.',
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
  'notice.hotkey-set': 'Hotkey festgelegt: {hotkey}',
  'notice.auto-sync-toggled': 'Automatische Synchronisierung {status}',
  'notice.auto-sync-enabled': 'ermöglicht',
  'notice.auto-sync-disabled': 'deaktiviert',
  'notice.reset-items': 'Elemente auf Standardwerte zurücksetzen',

  'notice.custom-fields-imported':
    'Benutzerdefinierte {count}-Felder wurden erfolgreich importiert',

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
  'notice.trades-duplicated.one': '{count} Trade dupliziert',
  'notice.trades-duplicated.few': '{count} Trades dupliziert',
  'notice.trades-duplicated.many': '{count} Trades dupliziert',
  'notice.trades-duplicated.other': '{count} Trades dupliziert',
  'notice.trades-deleted.one': '{count} Trade gelöscht',
  'notice.trades-deleted.few': '{count} Trades gelöscht',
  'notice.trades-deleted.many': '{count} Trades gelöscht',
  'notice.trades-deleted.other': '{count} Trades gelöscht',
  'notice.mark-reviewed.one': '{count} Trade als geprüft markiert',
  'notice.mark-reviewed.few': '{count} Trades als geprüft markiert',
  'notice.mark-reviewed.many': '{count} Trades als geprüft markiert',
  'notice.mark-reviewed.other': '{count} Trades als geprüft markiert',

  'notice.error.open-journalit':
    'Journalit konnte nicht geöffnet werden. Bitte versuchen Sie, Obsidian neu zu laden.',
  'notice.error.open-drc': 'Fehler beim Öffnen der DRC: {error}',
  'notice.error.open-trade-log': 'Fehler beim Öffnen des Trade-Logs: {error}',
  'notice.error.open-csv-import':
    'Fehler beim Öffnen des Trade Imports: {error}',
  'notice.error.open-account-dashboard':
    'Konten konnten nicht geöffnet werden: {error}',
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

  'notice.error.open-release-notes':
    'Versionshinweise konnten nicht geöffnet werden: {error}',
  'notice.error.open-layout-builder':
    'Layout-Builder konnte nicht geöffnet werden: {error}',
  'notice.error.switch-template': 'Fehler beim Wechseln der Layout: {error}',
  'notice.error.switch-template-generic': 'Fehler beim Wechseln der Layout',

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

  'notice.error.cannot-change-folder-during-sync':
    'Der Ordnerpfad kann während der Synchronisierung nicht geändert werden. Bitte warten Sie, bis die Synchronisierung abgeschlossen ist.',
  'notice.error.file-not-found': 'Datei nicht gefunden: {path}',

  'notice.error.mark-reviewed':
    'Fehler beim Markieren von Trades als geprüft: {error}',
  'notice.error.add-setups': 'Fehler beim Hinzufügen von Setups: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'Fehler beim Hinzufügen von Fehlern: {error}',
  'notice.error.duplicate-trades':
    'Fehler beim Duplizieren von Trades: {error}',
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
  'tradelog.guide.empty.state.title': 'Keine Trading-Daten verfügbar',
  'tradelog.guide.empty.state.description':
    'Importiere frühere Trades, um deine Leistung sofort auszuwerten, oder erfasse einen neuen Trade manuell.',
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
    'Öffnen Sie Filter, wenn Sie nur bestimmte Konten, Setups, Tags, Trade-Typen, Status oder Daten überprüfen möchten. Sie können auch jeden Wert ausschließen, um diese Trades wegzulassen.',
  'tradelog.guide.sorting.title':
    'Klicken Sie auf die Spaltenüberschriften, um die Tabelle zu sortieren',
  'tradelog.guide.sorting.description':
    'Klicken Sie in der Trades-Ansicht auf eine sortierbare Spaltenüberschrift, um die Tabelle neu anzuordnen. Klicken Sie beispielsweise auf Netto P&L, um nach Ihrem größten Gewinn und Ihrem größten Verlust zu sortieren.',
  'tradelog.guide.gallery-mode.title': 'Es gibt auch eine Bildergalerie',
  'tradelog.guide.gallery-mode.description':
    'Wechsle hier den Modus, um deine Trade-Screenshots als Galerie zu durchstöbern. Beim ersten Öffnen zeigt dir ein kurzer Guide alles.',
  'tradelog.guide.multi-select.title': 'Aktivieren Sie die Mehrfachauswahl',
  'tradelog.guide.multi-select.description':
    'Klicken Sie auf diese Schaltfläche, um mehrere Trades gleichzeitig auszuwählen. Wenn die Mehrfachauswahl aktiviert ist, wählen Zeilenklicks Trades aus, anstatt sie zu öffnen.',
  'tradelog.guide.batch-actions.title': 'Dies sind Ihre Batch-Aktionen',
  'tradelog.guide.batch-actions.description':
    'Verwenden Sie diese Leiste, um alle sichtbaren Trades auszuwählen, Ihre Auswahl zu löschen, Trades als geprüft zu markieren, Setups hinzuzufügen, Fehler hinzuzufügen, Trades zu duplizieren oder mehrere Trades gleichzeitig zu löschen. Sie können auch bei gedrückter Umschalttaste klicken, um eine Reihe von Trades auszuwählen.',
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
    'Dein Dashboard wird nützlich, sobald Journalit einen Handelsverlauf analysieren kann.',
  'dashboard.guide.empty.state.title': 'Nimm deinen Handelsverlauf mit',
  'dashboard.guide.empty.state.description':
    'Importiere frühere Trades, um mit aussagekräftigen Leistungsdaten zu starten, oder füge einen Trade manuell hinzu, wenn du deine ersten Trades erfasst.',
  'dashboard.guide.main.intro.title': 'Dies ist Ihr Dashboard',
  'dashboard.guide.main.intro.description':
    'Verwenden Sie diese Seite, um Ihre Leistung zu verfolgen, Ihre Statistiken zu überprüfen und Ihre nützlichsten Diagramme an einem Ort aufzubewahren.',
  'dashboard.guide.main.filters.title':
    'Filter verändern das gesamte Dashboard',
  'dashboard.guide.main.filters.description':
    'Verwenden Sie Filter, wenn Sie möchten, dass alle Statistiken und Diagramme auf dieser Seite für einen anderen Datumsbereich, ein anderes Konto, ein anderes Setup, ein anderes Tag oder einen anderen Trade-Typ aktualisiert werden. Sie können auch jeden Wert ausschließen, um diese Trades wegzulassen.',
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
    'Diese Leiste zeigt eine Vorschau jedes Diagramms und jeder Metrik. Klicken Sie auf eines, um es hinzuzufügen; alles, was bereits im Dashboard ist, steht unter In Verwendung.',
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
  'home.guide.settings.title':
    'Deine Journalit-Einstellungen sind immer griffbereit',
  'home.guide.settings.description':
    'Mit dieser Schaltfläche öffnest du die Journalit-Einstellungen direkt.',
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
    'Widgets in der Vorschau ansehen und hinzufügen, Schnelllinks wiederherstellen oder Konto- und Setup-Verknüpfungen hinzufügen. Alles, was schon auf der Startseite ist, steht unter „In Verwendung“, wo Sie es entfernen können.',
  'home.guide.move-and-resize.description':
    'Dies ist der Hauptbereich, den Sie im Bearbeitungsmodus neu anordnen können. Ziehen Sie Widgets, um sie zu verschieben, oder ziehen Sie ein Widget aus der unteren rechten Ecke, um seine Größe zu ändern.',
  'home.guide.add-widget.title': 'Elemente zur Startseite hinzufügen',
  'home.guide.add-widget.description':
    'Öffnen Sie Widget hinzufügen, um Widgets, Schnelllinks oder Konto- und Setup-Verknüpfungen hinzuzufügen.',
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
  'layoutBuilder.guide.create-own-layout.title':
    'Erstellen Sie Ihre eigene Vorlage',
  'layoutBuilder.guide.create-own-layout.description':
    'Integrierte Vorlagen sind schreibgeschützt. Klicken Sie bei einer integrierten DRC-Vorlage auf das Kopiersymbol, um sie zu duplizieren, oder auf +, um eine neue zu beginnen. Klicken Sie auf Weiter, um den Standard-DRC zu duplizieren.',
  'layoutBuilder.guide.editor-overview.title':
    'Hier bearbeiten Sie die Vorlage',
  'layoutBuilder.guide.editor-overview.description':
    'Benennen Sie die Vorlage hier um, überprüfen Sie die Widget-Liste, ziehen Sie den linken Ziehpunkt, um die Widgets neu anzuordnen, klicken Sie auf ein Widget, um es zu ändern, und entfernen Sie alles, was Sie nicht benötigen.',
  'layoutBuilder.guide.add-widget.title': 'Ein Widget hinzufügen',
  'layoutBuilder.guide.add-widget.description':
    'Verwenden Sie „Widget hinzufügen“, um einen Block am Ende Ihrer Vorlage einzufügen, oder fahren Sie mit der Maus zwischen zwei Widgets und klicken Sie auf +, um ihn genau dort einzufügen.',
  'layoutBuilder.guide.choose-widget.title': 'Wählen Sie ein Widget',
  'layoutBuilder.guide.choose-widget.description':
    'Geben Sie einen Namen, eine Beschreibung oder eine Kategorie in das Suchfeld ein und wählen Sie das Widget aus. Mit „Weiter“ wählt Journalit das erste Ergebnis aus.',
  'layoutBuilder.guide.save-template.title': 'Speichern Sie Ihre Layout',
  'layoutBuilder.guide.save-template.description':
    'Sobald Ihre Kopie richtig aussieht, speichern Sie sie. Sie können es später weiter verfeinern, wenn sich Ihr Review-Prozess verbessert.',
  'layoutBuilder.guide.set-default-template.title':
    'Als Standardvorlage festlegen',
  'layoutBuilder.guide.set-default-template.description':
    'Klicken Sie auf den Stern Ihrer neuen Vorlage, wenn Sie möchten, dass neue Review-Notizen dieses Layout automatisch verwenden.',
  'layoutBuilder.guide.whats-new.insert-slot.title':
    'Widgets überall hinzufügen',
  'layoutBuilder.guide.whats-new.insert-slot.description':
    'Fahren Sie mit der Maus zwischen zwei Widgets und drücken Sie +, um genau dort ein Widget einzufügen statt ganz unten.',
  'layoutBuilder.guide.whats-new.add-widget-button.title':
    'Oder am Ende hinzufügen',
  'layoutBuilder.guide.whats-new.add-widget-button.description':
    'Widget hinzufügen fügt weiterhin am Ende des Layouts hinzu, scrollt jetzt aber zum neuen Widget und öffnet dessen Suche.',
  'tradelog.empty': 'Keine Trades gefunden',
  'tradelog.empty.submessage':
    'Beginnen Sie mit der Erstellung von Trade-Notizen, damit diese in Ihrem Trade-Log angezeigt werden.',
  'tradelog.processing': 'Trading-Daten werden verarbeitet...',
  'tradelog.node.file-not-found': 'Trade-Datei nicht gefunden: {path}',
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
  'tradelog.filter.winners': 'Gewinn-Trades',
  'tradelog.filter.losers': 'Verlust-Trades',
  'tradelog.filter.breakeven': 'Break-even',
  'tradelog.filter.breakeven.desc': 'Breakeven-Trades',
  'tradelog.filter.open': 'Offen',
  'tradelog.filter.open.desc': 'Derzeit offene Positionen',
  'tradelog.filter.closed': 'Geschlossen',
  'tradelog.type.regular': 'Regulär',
  'tradelog.type.regular.desc': 'Standard-Trades',
  'tradelog.type.missed': 'Verpasst',
  'tradelog.type.backtest': 'Backtest',
  'tradelog.status.win': 'GEWINN',
  'tradelog.status.loss': 'VERLUST',
  'tradelog.status.open': 'OFFEN',
  'tradelog.status.partially-closed': 'TEILGESCHLOSSEN',
  'tradelog.status.cancelled': 'STORNIERT',
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

  'tradelog.copy-trade.adjustment-invalid':
    'Gib eine gültige GuV-Anpassung ein.',
  'tradelog.copy-trade.adjustment-saved':
    'GuV-Anpassung für kopierten Trade gespeichert.',
  'tradelog.tooltip.still-open': 'noch offen',

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

  'tradelog.batch.add-setups.label': 'Setups hinzufügen',
  'tradelog.batch.add-tags.aria': 'Tags hinzufügen',

  'tradelog.batch.add-tags.label': 'Tags hinzufügen',
  'tradelog.batch.add-mistakes.aria': 'Fehler hinzufügen',

  'tradelog.batch.add-mistakes.label': 'Fehler hinzufügen',
  'tradelog.batch.adding': 'Hinzufügen...',
  'tradelog.batch.add-count': 'Hinzufügen ({count})',
  'tradelog.batch.duplicate.aria': 'Trades duplizieren',
  'tradelog.batch.duplicate.label': 'Duplizieren',
  'tradelog.batch.duplicating': 'Duplizieren...',
  'tradelog.batch.duplicate-skipped.one':
    '{count} ausgewählte Notiz kann nicht dupliziert werden',
  'tradelog.batch.duplicate-skipped.few':
    '{count} ausgewählte Notizen können nicht dupliziert werden',
  'tradelog.batch.duplicate-skipped.many':
    '{count} ausgewählte Notizen können nicht dupliziert werden',
  'tradelog.batch.duplicate-skipped.other':
    '{count} ausgewählte Notizen können nicht dupliziert werden',
  'tradelog.batch.delete.aria': 'Trades löschen',

  'tradelog.batch.deleting': 'Löschen...',
  'tradelog.batch.clear.aria': 'Klare Auswahl',

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
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
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
  'dashboard.title': 'Auswertung',
  'dashboard.empty.message': 'Keine Trading-Daten verfügbar',
  'dashboard.empty.submessage':
    'Importiere frühere Trades, um deine Leistung sofort auszuwerten, oder erfasse einen neuen Trade manuell.',
  'dashboard.empty.import-action': 'Bestehende Trades importieren',
  'dashboard.empty.manual-action': 'Trade manuell hinzufügen',
  'dashboard.empty.filter-hint':
    'Versuchen Sie, Ihre Filtereinstellungen anzupassen',
  'dashboard.error.load-failed': 'Daten konnten nicht geladen werden',
  'dashboard.no-data': 'Keine Trading-Daten verfügbar',
  'dashboard.button.add-widget': 'Widget hinzufügen',
  'dashboard.button.save-layout': 'Layout speichern',
  'dashboard.button.edit-layout': 'Layout bearbeiten',
  'dashboard.metrics.netPnL': 'Netto P&L',
  'dashboard.metrics.incl-unrealized': 'inkl. {value} unrealisiert',
  'dashboard.metrics.winRate': 'Trefferquote',
  'dashboard.metrics.profitFactor': 'Gewinnfaktor',
  'dashboard.metrics.sharpeRatio': 'Sharpe-Kennzahl',
  'dashboard.metrics.expectancy': 'Erwartungswert',
  'dashboard.metrics.numTrades': 'Trades insgesamt',

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

  'dashboard.conversion.using-ecb': 'Verwendung von EZB-Kursen ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Verwendet brokerbereitgestellte Basiswährungs-P&L für {count} {tradeLabel}',
  'dashboard.conversion.using-manual-rate':
    'Verwendet einen manuellen Wechselkurs für {count} {tradeLabel}',
  'dashboard.conversion.partial-warning':
    '⚠ Kosten/Risiko in {currencies} konnten nicht umgerechnet werden und sind ausgeschlossen',
  'dashboard.conversion.trade-singular': 'Handel',
  'dashboard.conversion.trade-plural': 'Handel',
  'dashboard.conversion.excluded-warning':
    '• {converted} von {total}-Trades ({excluded} ausgeschlossen: {currencies})',
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

  'dashboard.filter.accounts.none-found': 'Keine Konten gefunden',
  'dashboard.filter.accounts.phase-now': 'jetzt',
  'dashboard.filter.tickers.none-found': 'Keine Ticker gefunden',

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

  'dashboard.widgets.hourly-performance.metric.total-r': 'Gesamt-R',

  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'Keine Trades',
  'dashboard.widgets.setup-performance.title': 'Leistung nach Setups',
  'dashboard.widgets.setup-performance.description':
    'Rangliste der Performance nach Setup',
  'dashboard.widgets.setup-performance.empty': 'Keine Setup-Leistungsdaten',
  'dashboard.widgets.setup-performance.masked-label': 'Setups',
  'dashboard.widgets.tag-performance.title': 'Leistung nach Tags',
  'dashboard.widgets.tag-performance.description':
    'Rangliste der Performance nach Tag',
  'dashboard.widgets.tag-performance.empty': 'Keine Tag-Leistungsdaten',
  'dashboard.widgets.tag-performance.masked-label': 'Schlagworte',
  'dashboard.widgets.ticker-performance.title': 'Performance nach Ticker',
  'dashboard.widgets.ticker-performance.metric-aria': 'Metrik',
  'dashboard.widgets.ticker-performance.view-aria': 'Ansicht',
  'dashboard.widgets.ticker-performance.view.best-and-worst':
    'Beste und schlechteste',
  'dashboard.widgets.ticker-performance.view.best': 'Beste 10',
  'dashboard.widgets.ticker-performance.view.worst': 'Schlechteste 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'Gesamt-P&L',
  'dashboard.widgets.ticker-performance.metric.total-r': 'Gesamt-R',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'Trefferquote',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'Symbol: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades':
    'Transaktionen: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Trefferquote: {rate} ({wins}G / {losses}V)',

  'dashboard.widgets.ticker-performance.empty':
    'Keine Ticker-Performance-Daten',
  'dashboard.widgets.ticker-performance.empty-submessage':
    'Keine geschlossenen Trades mit einem Ticker entsprechen den aktuellen Filtern.',
  'dashboard.widgets.ticker-performance.masked-ticker': 'Symbol',
  'dashboard.widgets.ticker-performance.omitted-count': 'Ausgelassen: {count}',

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
  'dashboard.rolling_win_loss.ratio_undefined':
    'Verhältnis: keine Verluste im Zeitraum',
  'dashboard.rolling_win_loss.avg_win_label':
    'Durchschnittlicher Gewinn: {value}',
  'dashboard.rolling_win_loss.no_losses_band': 'Keine Verluste',
  'dashboard.rolling_win_loss.window_not_filled':
    'Benötigt mindestens {count} geschlossene Trades',
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
    'Checkliste zur Einrichtung von Journalit',
  'home.widget.getting-started.progress': '{completed}/{total} abgeschlossen',
  'home.widget.getting-started.progress.loading': 'Fortschritt wird geprüft...',
  'home.widget.getting-started.item.account.title':
    'Richten Sie Ihr Handelskonto ein',
  'home.widget.getting-started.item.account.description':
    'Trades werden einem Konto zugeordnet, das Ihren Kontostand verfolgt. Ohne Konto lassen sich Rendite und Drawdown nicht berechnen.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'Konto einrichten',
  'home.widget.getting-started.item.create.title':
    'Übernimm deinen Handelsverlauf',
  'home.widget.getting-started.item.create.description':
    'Importiere bestehende Trades, verbinde Trade Sync oder füge deinen ersten Trade manuell hinzu.',
  'home.widget.getting-started.item.create.time': '30er Jahre',
  'home.widget.getting-started.item.create.cta': 'Trade Import öffnen',
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
  'home.widget.getting-started.item.sidebar.title':
    'Navigations-Seitenleiste öffnen',
  'home.widget.getting-started.item.sidebar.description':
    'Greife schnell auf Journalit-Seiten, Reviews, Werkzeuge und die Suche zu.',
  'home.widget.getting-started.item.sidebar.time': '10 Sek.',
  'home.widget.getting-started.item.sidebar.cta': 'Seitenleiste öffnen',
  'home.widget.getting-started.item.pro.title': 'Aktivieren Sie PRO',
  'home.widget.getting-started.item.pro.description':
    'Aktivieren Sie Trade Import, Trade Sync und den Wirtschaftskalender.',
  'home.widget.getting-started.item.pro.time': '1 Minute',
  'home.widget.getting-started.item.pro.cta': 'Aktivieren',
  'home.widget.weekly-summary.name': 'Wöchentliche Zusammenfassung',
  'home.widget.weekly-summary.description':
    'Wochenkennzahlen mit täglichem P&L',
  'home.widget.key-events.name': 'Wichtige Ereignisse',
  'home.widget.key-events.description':
    'News und Marktereignisse aus dem Wochenreview',
  'home.widget.key-events.empty-title': 'Noch keine wichtigen Ereignisse',
  'home.widget.key-events.open-aria': 'Wochenrückblick dieser Woche öffnen',
  'home.widget.position-size.name': 'Positionsgrößenrechner',
  'home.widget.position-size.description':
    'Positionsgröße aus dem Kontorisiko berechnen',
  'home.widget.embedded-note.name': 'Eingebettete Notiz',
  'home.widget.embedded-note.description':
    'Zeigen Sie alle Markdown-Notizen aus Ihrem Vault an',
  'home.widget.current-streak.name': 'Aktueller Streak',
  'home.widget.current-streak.description':
    'Verfolgen Sie Trade- und Review-Serien',
  'home.widget.best-hours.name': 'Beste Stunden',
  'home.widget.best-hours.description':
    'Zu welcher Tageszeit du am besten tradest',
  'home.widget.setup-leaderboard.name': 'Top-Aufschlüsselung',
  'home.widget.setup-leaderboard.description':
    'Top-Setups, Tags, Asset-Typen oder Ticker',
  'home.widget.unreviewed-trades.name': 'Nicht geprüfte Trades',
  'home.widget.unreviewed-trades.description':
    'Trades, die einen Review benötigen',
  'home.widget.goals-progress.name': 'Zielfortschritt',
  'home.widget.goals-progress.description':
    'Fortschritt zu deinem Trading-Ziel',
  'home.widget.trading-score.name': 'Trading-Score',
  'home.widget.trading-score.description':
    'Eine Kennzahl für deine gesamte Trading-Leistung',
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description': 'Aktuelle Kontostände mit einem 30-Tage-Trend',
  'home.widget.drawdown-monitor.name': 'Drawdown-Monitor',
  'home.widget.drawdown-monitor.description':
    'Auslastung des Drawdown-Limits je Konto',
  'account.header.title': 'Konto: {name}',
  'account.header.back-to-dashboard': 'Zurück zum Dashboard',
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
  'account.header.warning.trades-before-phase.one':
    '{count} Trade vor dem Start von Phase 1 gefunden',
  'account.header.warning.trades-before-phase.few':
    '{count} Trades vor dem Start von Phase 1 gefunden',
  'account.header.warning.trades-before-phase.many':
    '{count} Trades vor dem Start von Phase 1 gefunden',
  'account.header.warning.trades-before-phase.other':
    '{count} Trades vor dem Start von Phase 1 gefunden',
  'account.header.warning.earliest-trade-phase':
    'Frühester Trade: {date}. Trades vor dem Phasenstart zählen nicht für die Challenge.',
  'account.header.notice.phase-start-updated':
    'Start von Phase 1 auf {date} verschoben',
  'account.header.warning.earliest-trade':
    'Frühester Trade: {date}. Dies kann zu falschen Saldoberechnungen führen.',
  'account.header.warning.fix-phase-start.aria':
    'Start von Phase 1 korrigieren',
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

  'view.dashboard': 'Auswertung',
  'view.trade-log': 'Trade-Log',
  'view.account-dashboard': 'Konten',
  'view.account-page.title': 'Konto: {name}',
  'view.account-page.title-default': 'Kontoseite',
  'view.account-page.no-account-selected': 'Kein Konto ausgewählt',
  'view.account-page.no-account-instructions':
    'Bitte rufen Sie diese Seite über Konten auf.',
  'view.account-page.service-loading': 'Kontoseitendienst wird geladen...',
  'view.account-page.balance-chart-title': 'Kontostandsdiagramm',
  'view.account-page.balance-chart-loading': 'Saldotabelle wird geladen...',
  'view.layout-builder': 'Layout-Builder',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': 'Wirtschaftskalender',
  'view.economic-calendar.this-week': 'Diese Woche',
  'view.economic-calendar.sync.aria':
    'Einstellungen des Wirtschaftskalenders öffnen',
  'view.economic-calendar.import-count.one': '{count} Ereignis importieren',
  'view.economic-calendar.import-count.few': '{count} Ereignisse importieren',
  'view.economic-calendar.import-count.many': '{count} Ereignisse importieren',
  'view.economic-calendar.import-count.other': '{count} Ereignisse importieren',
  'view.economic-calendar.imported': 'Importiert',
  'view.economic-calendar.update-available': 'Update verfügbar',
  'view.economic-calendar.filter.currency': 'Währung',
  'view.economic-calendar.filter.impact': 'Auswirkung',
  'view.economic-calendar.impact.high': 'Hoch',
  'view.economic-calendar.impact.medium': 'Mittel',
  'view.economic-calendar.impact.low': 'Niedrig',
  'view.economic-calendar.impact.none': 'Keine',
  'view.economic-calendar.pro-required':
    'Der Wirtschaftskalender erfordert Journalit Pro',
  'view.economic-calendar.error.offline':
    'Der Wirtschaftskalender kann offline nicht geladen werden.',
  'view.economic-calendar.error.generic':
    'Der Wirtschaftskalender konnte nicht geladen werden.',
  'view.economic-calendar.empty':
    'Keine Wirtschaftsereignisse für diese Woche.',
  'view.economic-calendar.refresh': 'Ereignisse aktualisieren',
  'view.economic-calendar.retry': 'Erneut versuchen',
  'view.economic-calendar.select-all': 'Alle auswählen',
  'view.economic-calendar.select-aria': '{event} auswählen',
  'view.economic-calendar.impact-aria': 'Auswirkung: {impact}',
  'view.economic-calendar.all-day': 'Ganztägig',
  'view.economic-calendar.holiday-aria': 'Feiertag',
  'view.economic-calendar.forecast': 'Prognose',
  'view.economic-calendar.previous': 'Vorheriger',
  'view.economic-calendar.actual': 'Aktuell',
  'view.economic-calendar.import-success':
    '{imported} importiert, {updated} aktualisiert',
  'view.economic-calendar.import-failed':
    'Die Ereignisse konnten nicht importiert werden.',
  'view.economic-calendar.restore-missing-events':
    'Fehlende Ereignisse wiederherstellen ({count})',
  'economicCalendar.guide.main.intro.description':
    'Hier siehst du die vollständige Woche. Journalit kann deinen Wochenrückblick automatisch aktuell halten, sodass der manuelle Import optional ist.',
  'economicCalendar.guide.main.filters.title':
    'Diese Filter ändern nur diesen Kalender',
  'economicCalendar.guide.main.filters.description':
    'Währungs- und Auswirkungsfilter begrenzen nur die hier angezeigten und auswählbaren Ereignisse. Sie ändern deine Regeln für den automatischen Import nicht.',
  'economicCalendar.guide.main.settings.title':
    'Automatischen Import in den Einstellungen konfigurieren',
  'economicCalendar.guide.main.settings.description':
    'Wähle hier Währungen, Auswirkungsstufen und Feiertage aus und aktiviere den automatischen Import. Journalit synchronisiert die aktuelle Woche mit deinem Wochenrückblick und aktualisiert importierte Werte, ohne bewusst entfernte Ereignisse erneut hinzuzufügen.',
  'economicCalendar.guide.main.manual-import.title':
    'Manuelle Importe sind optional',
  'economicCalendar.guide.main.manual-import.description':
    'Wähle sichtbare Zeilen aus und nutze Ereignisse importieren für einen einmaligen Import. Bei aktiviertem automatischem Import ist das nicht jede Woche nötig.',
  'economicCalendar.guide.main.restore.title':
    'Fehlende konfigurierte Ereignisse wiederherstellen',
  'economicCalendar.guide.main.restore.description':
    'Diese Schaltfläche wird verfügbar, wenn Ereignisse aus deinem gespeicherten automatischen Importbereich fehlen. Sobald die Woche wieder vollständig ist, bleibt sie sichtbar, ist aber deaktiviert.',
  'economicCalendar.guide.main.summary.title':
    'Einmal einrichten, dann überprüfen',
  'economicCalendar.guide.main.summary.description':
    'Nach der Einrichtung des automatischen Imports bleibt dein Wochenrückblick gefüllt. Kehre hierher zurück, um zu stöbern, einmalig zu importieren oder fehlende Ereignisse wiederherzustellen.',
  'view.economic-calendar.pro-benefit':
    'Wichtige Ereignisse in deiner Wochennotiz.',
  'view.economic-calendar.pro-benefit-trial':
    'Starten Sie mit einer 14-tägigen kostenlosen Testphase.',
  'view.economic-calendar.sign-in': 'Bereits Pro? Anmelden',
  'settings.economic-calendar.title': 'Wirtschaftskalender',
  'settings.economic-calendar.description':
    'Importiert die Wirtschaftstermine dieser Woche automatisch in die Kernereignisse deiner Wochennotiz.',
  'settings.economic-calendar.auto-import':
    'Wochentermine automatisch importieren',
  'settings.economic-calendar.auto-import-desc':
    'Hält die aktuelle Wochennotiz mit dem Kalender-Feed synchron.',
  'settings.economic-calendar.currencies': 'Währungen',
  'settings.economic-calendar.currencies-desc':
    'Termine für diese Währungen importieren. Ohne Auswahl werden alle einbezogen.',
  'settings.economic-calendar.impacts': 'Wirkungsstufen',
  'settings.economic-calendar.impacts-desc':
    'Termine mit diesen Wirkungsstufen importieren.',
  'settings.economic-calendar.impacts-empty':
    'Keine Veröffentlichungen ausgewählt. Feiertage können weiterhin importiert werden, wenn sie aktiviert sind.',
  'settings.economic-calendar.include-holidays': 'Feiertage einbeziehen',
  'settings.economic-calendar.include-holidays-desc':
    'Bankfeiertage und Notenbankprotokolle als ganztägige Einträge importieren.',
  'settings.economic-calendar.open-view': 'Wirtschaftskalender öffnen',
  'settings.economic-calendar.open-view-desc':
    'Diese Woche durchsehen und Termine manuell importieren.',
  'settings.economic-calendar.pro-required':
    'Der Wirtschaftskalender benötigt ein PRO-Abo.',
  'status-bar.update-available-branded': 'Journalit aktualisieren',
  'status-bar.update-aria-label': 'Journalit {version} – Zum Anzeigen klicken',
  'update.available.ready': 'Eine neue Version ist verfügbar',
  'template.transformation.orphaned-content.header':
    'Inhalt aus vorheriger Vorlage',
  'template.transformation.orphaned-content.desc1':
    'Der folgende Inhalt passte nicht zum neuen Vorlagenlayout.',
  'template.transformation.orphaned-content.desc2':
    'Überprüfen und integrieren Sie es oben oder löschen Sie es, wenn es nicht mehr benötigt wird.',
  'template.editor.loading': 'Vorlage wird geladen...',
  'template.editor.built-in': 'Eingebaut',
  'template.editor.unsaved-changes': 'Nicht gespeicherte Änderungen',

  'template.editor.built-in-notice':
    'Integrierte Vorlagen können nicht bearbeitet werden. Duplizieren Sie diese Vorlage oder erstellen Sie eine neue, um sie anzupassen.',

  'template.editor.show-review-desc':
    'Wann der Review-Abschnitt auf Trade-Notizen angezeigt werden soll',

  'template.editor.section-visibility': 'Abschnittssichtbarkeit',
  'template.editor.trade-note-layout': 'Trade-Notiz-Layout',

  'template.editor.other-asset-types': 'Andere',

  'template.editor.asset-type-add': 'Asset-Typ',

  'template.editor.remove-asset-layout': 'Asset-Layout entfernen',

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

  'template.editor.review-button': 'Schaltfläche „Bewertet markieren“.',
  'template.editor.review-button-desc':
    'Schaltfläche anzeigen, um den Trade als geprüft zu markieren',

  'csv.mapper.title': 'Ordnen Sie Spalten Trade-Feldern zu',
  'csv.mapper.subtitle':
    'Ordnen Sie Ihre Spalten den Trade-Feldern zu, die sie darstellen.',
  'csv.mapper.do-not-import': 'Nicht importieren',
  'csv.mapper.required-badge': 'Erforderlich',
  'csv.mapper.required-label': 'ERFORDERLICH',
  'csv.mapper.example': 'Beispiel:',
  'csv.mapper.mode.title': 'Was ist eine Zeile?',
  'csv.mapper.mode.help':
    'Journal-Tabellen haben meist einen abgeschlossenen Trade pro Zeile mit einer G/V-Spalte. Order-Historien von Brokern führen jeden Kauf und Verkauf als eigene Zeile.',

  'csv.mapper.asset-type.help':
    'Wählen Sie den Instrumententyp in dieser Datei aus. Dadurch werden die erforderlichen Felder und die Parsing-Logik bestimmt.',

  'csv.mapper.tip.title': 'Tipp: Ordnen Sie zusätzliche Felder zu',
  'csv.mapper.tip.desc':
    'Die Zuordnung optionaler Felder wie Provision und G/V verbessert die Importqualität. Sie können auch mehrere Spalten zuordnen, um Felder wie Tags, Bilder, Setups und Fehler aufzulisten.',
  'csv.mapper.missing-fields': 'Fehlende erforderliche Felder für {assetType}:',
  'csv.mapper.summary.title': 'Zusammenfassung:',
  'csv.mapper.summary.of': 'von',
  'csv.mapper.summary.columns-mapped': 'Spalten zugeordnet',
  'csv.mapper.summary.all-mapped': 'Alle erforderlichen Felder zugeordnet',
  'csv.mapper.available-fields.title': 'Verfügbare Trade-Felder',
  'csv.mapper.available-fields.desc':
    'Nach Kategorien geordnet mit Beschreibungen für anlagenspezifische Felder',

  'csv.template-import.label.share-code': 'Code teilen',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': 'Vorlage importieren',

  'csv.template-import.error.import-failed':
    'Vorlage konnte nicht importiert werden',

  'csv.export-template.label.share-code': 'Code teilen',

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

  'csv.broker.label': 'Broker-/Importformat',

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
  'csv.broker.jdr': 'MetaTrader 4 / 5',

  'csv.account-selector.favorite.remove': 'Aus Favoriten entfernen',
  'csv.account-selector.favorite.set': 'Als Favorit festlegen',

  'csv.results.successfully-imported-suffix': 'Trades',

  'csv.results.failed-to-import-prefix': 'Import fehlgeschlagen',
  'csv.results.failed-to-import-suffix': 'Zeilen (Details siehe unten)',

  'csv.results.pending-local-writes':
    '{count} Schreibvorgang/-vorgänge für Handelsnotizen stehen noch aus. Journalit gleicht abgeschlossene Schreibvorgänge ab und hält nicht abgeschlossene Projektionen für die Wiederherstellung verfügbar.',
  'csv.results.pending-title': 'Import wird noch synchronisiert',

  'csv.image-review.count': '{count} Bild(er)',

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

  'image.viewer.title-fullscreen':
    'Klicken Sie hier, um den Vollbildmodus anzuzeigen',

  'image.viewer.delete-button': 'Bild löschen',
  'image.viewer.nav-prev': 'Vorheriges Bild',
  'image.viewer.nav-next': 'Nächstes Bild',
  'image.viewer.zoom-in-hint': 'Zum Vergrößern kneifen oder klicken',
  'image.viewer.zoom-out-hint':
    '{scale}x (Zum Verkleinern zusammenziehen oder anklicken)',

  'image.viewer.close-aria': 'Vollbild schließen',
  'image.viewer.copy-image': 'Bild kopieren',

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

  'datepicker.button.clear': 'Klar',
  'datepicker.button.today': 'Heute',
  'datepicker.button.now': 'Jetzt',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',
  'common.loading': 'Laden...',
  'common.error': 'Fehler',

  'common.warning': 'Warnung',
  'common.info': 'Info',
  'common.yes': 'Ja',
  'common.no': 'NEIN',
  'common.ok': 'OK',

  'common.select-option': 'Wählen Sie eine Option',

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

  'common.date': 'Datum',

  'common.days': 'Tage',
  'common.week': 'Woche',
  'common.weeks': 'Wochen',
  'common.month': 'Monat',
  'common.months': 'Monate',
  'common.year': 'Jahr',
  'common.years': 'Jahre',
  'common.quarter': 'Quartal',
  'common.quarters': 'Viertel',

  'common.min': 'Min',
  'common.max': 'Max',
  'common.best': 'Am besten',
  'common.worst': 'Am schlimmsten',
  'common.profit': 'Profitieren',

  'common.trade': 'Trade',
  'common.trades': 'Trades',

  'common.statuses': 'Status',
  'common.enabled': 'aktiviert',
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

  'chart.tooltip.trade-pnl': 'Trade P&L',

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
  'settings.ftp.instructions.title': 'MetaTrader 4-Einrichtungsanweisungen:',
  'settings.ftp.instructions.step1': 'Öffnen Sie MetaTrader 4 (MT4)',
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

  'settings.auth.status-offline': 'Offline',
  'settings.auth.status-online': 'Online',

  'settings.auth.signed-in': 'Angemeldet',
  'settings.auth.sign-in-up': 'Anmelden / Registrieren',
  'settings.auth.sign-out': 'Abmelden',

  'settings.auth.subscription-features': 'Abonnementfunktionen',

  'settings.auth.offline-mode': 'Offline-Modus',

  'settings.auth.guest': 'Gast',

  'settings.auth.your-plan': 'Dein Plan',

  'settings.auth.manage-subscription': 'Abonnement verwalten',
  'settings.tab.general': 'Allgemein',
  'settings.tab.reviews': 'Reviews',

  'settings.tab.customization': 'Anpassung',
  'settings.tab.journal-setup': 'Journal',
  'settings.tab.backend': 'Trade-Synchronisierung',
  'settings.tab.trading': 'Trade-Standardwerte',
  'settings.tab.sync': 'Konto & Synchronisierung',
  'settings.tab.accounts': 'Konto',
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Wöchentlicher Rückblick',
  'settings.reviews.monthly': 'Monatlicher Rückblick',
  'settings.reviews.quarterly': 'Quartalsreview',
  'settings.reviews.yearly': 'Jahresrückblick',
  'settings.reviews.default-templates': 'Standardlayouts',

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
  'settings.general.review-links-new-tab':
    'Links aus Review-Widgets in neuen Tabs öffnen',
  'settings.general.review-links-new-tab-desc':
    'Wenn deaktiviert, ersetzen Links den aktuellen Tab.',
  'settings.general.review-links-new-tab-aria':
    'Notizlinks aus Review-Widgets in neuen Tabs öffnen',
  'settings.general.tab-behavior': 'Tab-Verhalten',
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

  'settings.reviews.notice.builder-not-found':
    'Der Befehl „Layout-Builder“ wurde nicht gefunden',
  'settings.reviews.notice.global-auto-create':
    'Für alle Reviews automatisch erstellen {status}',
  'settings.reviews.notice.auto-create-nav':
    '{type} automatisch in der Navigation {status} erstellen',
  'settings.reviews.daily.checklist-title': 'Punkte der Pre-Trade-Checkliste',

  'settings.reviews.daily.questions-title': 'Überprüfen Sie Fragen',

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
  'library.error.export-too-large':
    'Dieses Layout ist zu groß, um als Freigabecode exportiert zu werden.',
  'library.notice.copied': 'Freigabecode in Zwischenablage kopiert!',
  'library.error.copy-failed': 'Kopieren in die Zwischenablage fehlgeschlagen',
  'library.title.import': 'Layout importieren',
  'library.desc.import':
    'Fügen Sie einen JRT-Freigabecode ein, um eine Vorlage von einem anderen Benutzer zu importieren.',
  'library.label.share-code': 'Code teilen',
  'library.placeholder.import-code':
    'Fügen Sie hier den Freigabecode JRT-... ein',
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

  'settings.reviews.daily.timeframes-title': 'Zeitrahmen prognostizieren',

  'settings.reviews.daily.timeframes-placeholder':
    'Neuer Zeitrahmen (z. B. 15 Min, 5 Min)',
  'settings.weekly.review-questions': 'Überprüfen Sie Fragen',

  'settings.weekly.forecast-timeframes': 'Zeitrahmen prognostizieren',

  'settings.shared.timeframes.title': 'Zeitrahmen prognostizieren',

  'settings.shared.timeframes.placeholder':
    'Neuer Zeitrahmen (z. B. 15 Min, 5 Min)',

  'shared.empty-state.message': 'Keine Daten verfügbar',

  'weekly.tab.review': 'Review',
  'weekly.review.drcs.title': 'Tägliche Reviews für diese Woche',

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
  'account.settings.section.challenge-stages.title': 'Challenge-Phasen',
  'account.settings.section.challenge-stages.desc':
    'Kontotyp, der angewendet wird, wenn eine Challenge diese Phase erreicht.',
  'account.settings.section.challenge-stages.no-change': 'Keine Änderung',
  'account.settings.section.challenge-stages.aria': 'Kontotyp für {stage}',
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

  'account.settings.section.order.move-up': 'Bewegen Sie sich nach oben',
  'account.settings.section.order.move-down': 'Bewegen Sie sich nach unten',
  'account.settings.button.save': 'Einstellungen speichern',
  'account.settings.button.saving': 'Sparen...',

  'weekly.review.performance.title': 'Selbsteinschätzung der Leistung',
  'weekly.review.performance.mental': 'Mentale Performance',

  'weekly.review.performance.technical': 'Technische Ausführung',

  'weekly.review.questions.title': 'Wöchentliche Review-Fragen',

  'weekly.review.goals.title': 'Ziele für nächste Woche',

  'weekly.preparation.goals.title': 'Wöchentliche Ziele',

  'weekly.preparation.events.title': 'Wichtige Ereignisse',

  'weekly.preparation.events.add-button': 'Ereignis hinzufügen',

  'weekly.preparation.forecast.title': 'Wöchentliche Prognose',
  'weekly.overview.pnl-chart.title': 'Wöchentlich kumulativ P&L',

  'weekly.overview.drawdown-chart.title': 'Wöchentlicher Drawdown',

  'weekly.overview.performance.title': 'Wöchentliche Performance',

  'weekly.overview.setup-performance.title': 'Setup-Performance',

  'weekly.overview.trades-chart.title': 'Wöchentliche Trades',

  'weekly.overview.best-trade.title': 'Bester Trade der Woche',

  'weekly.overview.worst-trade.title': 'Schlechtester Trade der Woche',

  'weekly.overview.daily-performance.title': 'Tägliche Performance',

  'weekly.overview.button.create-trade': 'Trade erstellen',
  'weekly.overview.button.view-trade-details': 'Trade-Details anzeigen',

  'monthly.tab.review': 'Review',

  'backend.title': 'Trade Synchronisierung',
  'backend.description':
    'Richten Sie Trade Sync für unterstützte Broker ein, um Ihren Vault automatisch auf dem neuesten Stand zu halten.',

  'trade-sync.gate.pro.description':
    'Trade Sync ist eine Pro-Funktion. Aktualisieren Sie, um fortzufahren.',

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

  'premium.gate.cta.continue-pro': 'Weiter zu PRO',

  'premium.gate.cta.refresh': 'Status aktualisieren',

  'premium.gate.offline':
    'Sie scheinen offline zu sein. Für die Aktivierung ist Internet erforderlich.',
  'premium.gate.not-pro-yet':
    'Sie sind angemeldet, aber Ihr Konto ist noch nicht PRO. Upgraden Sie und aktualisieren Sie anschließend den Status.',

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

  'backend.sync.auto-sync': 'Aktivieren Sie die automatische Synchronisierung',
  'backend.sync.auto-sync-desc':
    'Synchronisieren Sie Trades automatisch vom Backend-Server',
  'backend.sync.auto-sync-info':
    'Die automatische Synchronisierung prüft jede Stunde, ob neue Trades vorliegen',
  'backend.sync.auto-sync-aria':
    'Aktivieren Sie die automatische Synchronisierung',

  'backend.sync.syncing': 'Synchronisierung...',

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
  'settings.auth.feature.trade-sync': 'Trade Synchronisierung',
  'settings.auth.feature.economic-calendar': 'Wirtschaftskalender',
  'settings.auth.feature.basic-tracking': 'Grundlegende Trade-Tracking',

  'settings.auth.feature.manual-entry': 'Manuelle Trade-Eingabe',
  'settings.auth.feature.analytics-reviews': 'Analysen und Reviews',
  'settings.auth.feature.priority-support': 'Vorrangiger Support',
  'backend.sync.just-now': 'Soeben',
  'backend.sync.minutes-ago': '{count} vor Minuten',
  'backend.sync.hours-ago': '{count} vor einer Stunde',
  'backend.sync.days-ago': '{count} vor Tagen',

  'csv.format': 'Importformat:',

  'csv.button.export-template': 'Vorlage exportieren',
  'csv.button.delete-template': 'Vorlage löschen',

  'csv.button.import-another': 'Importieren Sie eine andere Datei',
  'csv.results.complete': 'Import abgeschlossen',
  'csv.results.history-ready': 'Dein Handelsverlauf ist bereit',
  'csv.results.completed-with-issues': 'Import mit Problemen abgeschlossen',
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

  'csv.results.broker': 'Broker: {broker}',

  'csv.results.more-trades.one': 'und {count} weiterer Trade...',
  'csv.results.more-trades.few': 'und {count} weitere Trades...',
  'csv.results.more-trades.many': 'und {count} weitere Trades...',
  'csv.results.more-trades.other': 'und {count} weitere Trades...',
  'csv.results.errors-header': 'KLICKEN, UM FEHLER ANZUZEIGEN ({count})',
  'csv.results.discord-note':
    'Optional: Wenn Sie Hilfe benötigen, klicken Sie auf Bericht kopieren und fügen Sie ihn in Discord ein.',

  'csv.errors.copy-report': 'Bericht kopieren',

  'csv.errors.copied': 'Kopiert',
  'csv.errors.rows': 'Zeilen: {rows}',
  'csv.errors.suggestion': 'Anregung:',

  'csv.errors.raw-errors-limit': 'Zeigt den ersten {shown} von {total}-Fehlern',

  'csv.report.plugin-version': 'Plugin-Version: {version}',

  'csv.report.broker': 'Broker: {broker}',

  'csv.report.top-issues': 'Top-Themen:',

  'csv.broker-guide.tradovate.step-2':
    'Klicken Sie auf die Registerkarte „Orders“ (NICHT auf die Registerkarte „Leistung“).',

  'csv.broker-guide.tradovate.warning.emphasis': 'Wichtig:',
  'csv.broker-guide.tradovate.warning.message':
    'Verwenden Sie nur die Registerkarte „Orders“. Die Registerkarte „Leistung“ ist nicht kompatibel.',

  'csv.broker-guide.ibkr.warning.emphasis': 'Muss Befehle verwenden',

  'csv.broker-guide.tradingview.step-3':
    'Wählen Sie im Dropdown-Menü „Bestellverlauf“ aus',

  'csv.broker-guide.tradingview.warning.message':
    'Andere Exporttypen (z. B. Positionen oder Orders) funktionieren nicht für den Import.',

  'csv.broker-guide.hyperliquid.warning.emphasis':
    'Limit von 10.000 Einträgen.',

  'csv.broker-guide.sierrachart.step-1':
    'Öffnen Sie das Trade-Aktivitätsprotokoll (Trade → Trade-Aktivitätsprotokoll oder Strg+Umschalt+A).',

  'csv.broker-guide.atas.warning.emphasis': 'Wichtig:',
  'csv.broker-guide.atas.warning.message':
    'Bearbeiten Sie die exportierte Datei nicht. Journalit behält Trades aus dem Blatt „Journal“ bei und bereichert, sofern verfügbar, die Provision durch passende Fills aus dem Blatt „Ausführungen“.',

  'csv.broker-guide.rithmic.warning.emphasis': 'Wichtig:',

  'csv.broker-guide.jdr.warning.emphasis': 'Wichtig:',

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
  'upgrade.benefit.economic-calendar':
    'Wirtschaftskalender mit automatischen wöchentlichen Ereignisimporten',
  'upgrade.benefit.trade-sync': 'Trade Sync für unterstützte Broker',
  'upgrade.benefit.multi-account': 'Unterstützung mehrerer Konten',
  'upgrade.prop-profiles.message-firms':
    'Journalit hält die Regeln von {count} Prop-Firmen bereit, um deine Challenge vorauszufüllen.',
  'upgrade.prop-profiles.message-firm':
    'Journalit hat die Regeln für jede {firm}-Challenge bereit zum Vorausfüllen.',
  'upgrade.prop-profiles.message':
    'Journalit hält Prop-Firm-Regeln bereit, um sie in deine Challenge einzufügen.',
  'upgrade.prop-profiles.message-updates':
    'Verknüpfe deine Prüfung mit den veröffentlichten Regeln deiner Firma, und Journalit sagt dir, wenn die Firma sie ändert.',
  'upgrade.prop-profiles.message-updates-firm':
    'Verknüpfe deine Prüfung mit den veröffentlichten Regeln von {firm}, und Journalit sagt dir, wenn {firm} sie ändert.',
  'upgrade.prop-profiles.benefits-title': 'Was Pro für dich ausfüllt:',
  'upgrade.benefit.prop.rules':
    'Drawdown- und Tagesverlustgrenzen direkt aus den Regeln deiner Firma',
  'upgrade.benefit.prop.payout':
    'Auszahlungsschwellen und Anspruchsbedingungen',
  'upgrade.benefit.prop.phases':
    'Phasenziele und Fortschritt für die gewählte Challenge',
  'upgrade.benefit.prop.updates':
    'Regelaktualisierungen, wenn deine Firma sie ändert',
  'upgrade.trial-notice':
    'Holen Sie sich eine zweiwöchige kostenlose Testversion, um alle Ihre historischen Trades zu importieren und alle Pro-Funktionen risikofrei auszuprobieren.',

  'monthly.overview.drawdown': 'Monatlicher Drawdown',
  'monthly.overview.no-drawdown-data':
    'Es können keine Drawdown-Daten angezeigt werden',

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
    'Geldbewegungen werden hier verfolgt',
  'account-page.guide.empty.transactions.description':
    'In diesem Abschnitt wird jede manuelle Ein- und Auszahlung Zeile für Zeile festgehalten – bei einem Prop-Challenge-Konto als Auszahlungen. Wenn es leer ist, verwenden Sie „Ereignis hinzufügen“, um das erste zu erstellen.',
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
  'account-page.guide.main.metrics.title': 'Performance nur für dieses Konto',
  'account-page.guide.main.metrics.description':
    'Saldo, P&L, Trefferquote und alle Kosten nur für dieses Konto. Prop-Konten zeigen Auszahlungen statt des Netto-Cashflows.',
  'account-page.guide.main.risk.title':
    'Der Risikofortschritt wird hier gesondert verfolgt',
  'account-page.guide.main.risk.description':
    'Wie viel Ihres Drawdown-Limits verbraucht ist und wie nah Sie Ihrem Gewinnziel sind.',
  'account-page.guide.main.transactions.title':
    'Geldbewegungen bleiben in einem eigenen Bereich',
  'account-page.guide.main.transactions.description':
    'Ein- und Auszahlungen mit dem Saldo danach, getrennt von den Trading-Ergebnissen. Prop-Konten listen hier ihre Auszahlungen.',
  'account-page.guide.main.actions.title':
    'Trades, Geldbewegungen und Einstellungen',
  'account-page.guide.main.actions.description':
    'Öffnen Sie die Trades dieses Kontos im Trade Log, erfassen Sie mit + eine Ein- oder Auszahlung oder bearbeiten Sie das Konto und seine Regeln.',
  'account-dashboard.title': 'Konten',
  'account-dashboard.copy-badge.base': 'BASIS',
  'account-dashboard.copy-badge.copy': 'KOPIERER',
  'account-dashboard.copy-badge.copied-by': 'Kopiert von',
  'account-dashboard.copy-badge.copies-tooltip-masked': 'Kopiert {account}',
  'account-dashboard.copy-badge.copies-tooltip':
    'Kopiert {account} mit {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService wurde nach mehreren Versuchen nicht initialisiert',
  'account-dashboard.error.loading': 'Fehler beim Laden der Konten: {error}',
  'account-dashboard.error.retry':
    'AccountPageService nicht bereit, erneuter Versuch in {delay}ms (Versuch {attempt}/{max})',
  'account-dashboard.challenges.empty.title': 'Noch keine Challenges',
  'account-dashboard.challenges.empty.message':
    'Verfolge eine Prop-Firm-Challenge als ein Konto mit Phasen, Regeln und Auszahlungen.',
  'account-dashboard.challenges.empty.create': 'Neue Challenge',
  'account-dashboard.challenges.empty.setup': 'Bestehende Konten einrichten',
  'account-dashboard.empty.title': 'Keine Konten gefunden',
  'account-dashboard.empty.message':
    'Erstellen Sie ein Konto, um Ihre Trading-Performance zu verfolgen',
  'account-dashboard.section.empty': 'Keine {type}-Konten',
  'account-dashboard.section.empty-sub':
    'Erstellen Sie ein Konto, um es hier anzuzeigen',
  'account-dashboard.button.create-first': 'Erstellen Sie Ihr erstes Konto',
  'account-dashboard.action.create': 'Neues Konto erstellen',
  'account-dashboard.action.settings': 'Kontoeinstellungen',
  'account-dashboard.weight-bar.aria': 'Kontotyp AUM-Verteilung',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: {percent} % des gesamten AUM',
  'account-dashboard.guide.empty.intro.title':
    'Auf dieser Seite sind alle Ihre Konten an einem Ort gespeichert',
  'account-dashboard.guide.empty.intro.description':
    'Unter Konten sehen Sie alle Ihre Konten gemeinsam. Sobald Konten vorhanden sind, können Sie sie hier am schnellsten vergleichen.',
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
  'account-dashboard.guide.main.intro.title': 'Dies sind Ihre Konten',
  'account-dashboard.guide.main.intro.description':
    'Verwenden Sie diese Seite, um Konten zu vergleichen, die Gesamtsummen aller Konten anzuzeigen und zu einem einzelnen Konto zu springen, wenn Sie weitere Details benötigen.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM bedeutet verwaltetes Vermögen',
  'account-dashboard.guide.main.aum-chart.description':
    'Dieses Diagramm verfolgt den Gesamtwert Ihres Kontos im Zeitverlauf, einschließlich Einzahlungen, Auszahlungen, Gewinnzielen und Drawdown-Limits auf Ihren Konten.',
  'account-dashboard.guide.main.metrics.title':
    'Diese Metriken fassen alle sichtbaren Konten zusammen',
  'account-dashboard.guide.main.metrics.description':
    'Verwenden Sie diese Statistiken für eine schnelle Momentaufnahme auf Kontoebene, bevor Sie näher auf bestimmte Kontotypen oder bestimmte Konten eingehen.',
  'account-dashboard.guide.main.mode-switch.title':
    'Übersicht und Challenges sind zwei Ansichten derselben Konten',
  'account-dashboard.guide.main.mode-switch.description':
    'Die Übersicht behält das AUM-Diagramm und die Portfolio-Summen. Wechsle zu Challenges für die Ökonomie deiner Prop-Challenges: Bestehensquote, Kosten, Auszahlungen und Phasen-Engpässe über alle Challenge-Konten.',
  'account-dashboard.guide.main.create-account.title':
    'Sie können von hier aus jederzeit ein weiteres Konto erstellen',
  'account-dashboard.guide.main.create-account.description':
    'Verwenden Sie diese Schaltfläche, wenn Sie dem Dashboard ein neues Konto hinzufügen möchten.',
  'account-dashboard.guide.main.settings-types.title':
    'Die Einstellungen können verfügbare Kontotypen verwalten',
  'account-dashboard.guide.main.settings-types.description':
    'In den Einstellungen können Sie benutzerdefinierte Kontotypen hinzufügen und alte entfernen, wenn sich Ihr Workflow ändert.',
  'account-dashboard.guide.main.settings-stages.title':
    'Challenge-Phasen können den Kontotyp festlegen',
  'account-dashboard.guide.main.settings-stages.description':
    'Wähle den Kontotyp, der angewendet wird, wenn eine Challenge die Bewertung, Sim-Finanzierung oder Live-Finanzierung erreicht. Lass eine Phase auf „Keine Änderung“, um den Kontotyp beizubehalten.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Durch Einstellungen kann geändert werden, was in den Gesamtsummen zählt',
  'account-dashboard.guide.main.settings-inclusion.description':
    'Sie können Kontotypen aus den Dashboard-Summen ausblenden, ohne sie zu löschen, und Sie können separat entscheiden, ob ihre Abhebungen weiterhin berücksichtigt werden.',
  'account-dashboard.guide.main.settings-order.title':
    'Dieser Abschnitt steuert die Reihenfolge der Kontogruppen',
  'account-dashboard.guide.main.settings-order.description':
    'Mithilfe dieser Steuerelemente können Sie entscheiden, welche Kontotypen zuerst im Dashboard angezeigt werden.',

  'account-dashboard.guide.main.open-account.title':
    'Öffnen Sie eine beliebige Kontokarte, um tiefer einzusteigen',
  'account-dashboard.guide.main.open-account.description':
    'Konten sind nach Typ gruppiert, damit du ähnliche vergleichen kannst. Öffne eine Karte für die vollständige Aufschlüsselung; dort übernimmt der Kontoseiten-Guide.',
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    'Neu: Prop-Firmen-Prüfungen',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    'Ein Konto kann jetzt eine Prop-Firmen-Prüfung verfolgen: ihre Phasen, die Regeln der Firma und deine Auszahlungen.',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    'Neue Prüfung starten',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    'Aktiviere beim Erstellen eines Kontos „Prop-Firmen-Prüfung“ und wähle deine Firma. Ihre Regeln werden für dich ausgefüllt.',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    'Alle deine Prüfungen sehen',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    'Wechsle zu „Prüfungen“, um Fortschritt, Erfolgsquote, Kosten und Auszahlungen über alle Prüfungen zu sehen.',
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
  'account-card.metric.trades': 'Trades',
  'account-card.metric.withdrawals': 'Auszahlungen',
  'account-card.metric.age': 'Alter',
  'account-card.progress.profit-target': 'Gewinnziel',
  'account-card.progress.drawdown-used': 'Genutztes Drawdown-Limit',
  'account-card.progress.not-set': 'Nicht festgelegt',
  'account-card.footer.monthly': 'Monatlich:',
  'account-card.footer.total-costs': 'Gesamtkosten:',
  'account.metrics.total-account-costs': 'Geschätzte Gesamtkosten',
  'account.metrics.total-costs': 'Gesamtkosten',
  'account.metrics.one-time-costs': 'Einmalige Kosten',
  'account.metrics.recurring-costs-to-date': 'Laufende Kosten bis heute',
  'account.metrics.monthly-cost': 'Monatliche Kosten',
  'account.chart.event.added': 'Konto hinzugefügt',
  'account.chart.event.archived': 'Konto archiviert',
  'account.balance-chart.drawdown-floor-off-scale':
    'Drawdown-Limit {value} ({distance} darunter)',
  'account.balance-chart.profit-target-off-scale':
    'Gewinnziel {value} ({distance} darüber)',
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

  'account.link-modal.option.default':
    'Verwenden Sie den Standardnamen: Account-{id}',
  'account.link-modal.default-name': 'Konto-{id}',
  'account.link-modal.button.linking': 'Verlinkung...',
  'account.link-modal.notice.select-existing':
    'Bitte wählen Sie ein bestehendes Konto aus',
  'account.link-modal.notice.failed':
    'Konto konnte nicht verknüpft werden: {error}',
  'trade.review.title': 'Trade-Review',

  'trade.details.entry': 'Einstieg',
  'trade.details.exit': 'Ausstieg',

  'trade.details.duration': 'Dauer',

  'trade.details.thesis': 'These',

  'trade.details.entries-summary': '{count} entries',
  'trade.details.exits-summary': '{count} exits',
  'trade.details.take-profit-count': '{count} targets',

  'trade.metadata.account': 'Konto:',

  'trade.metadata.setups': 'Setups',
  'trade.metadata.mistakes': 'Fehler',
  'trade.image.no-images': 'Keine Bilder für diesen Trade',
  'trade.image.click-edit':
    'Klicken Sie auf Bearbeiten, um Bilder hinzuzufügen',
  'trade.image.alt-prefix': 'Trade-Bild',
  'command.share-note-as-image': 'Aktuelle Notiz als Bild teilen',
  'trade.share.copy-screenshot': 'Trade-Screenshot kopieren',
  'trade.share.copied': 'Trade-Screenshot in die Zwischenablage kopiert',
  'trade.share.failed': 'Trade-Screenshot konnte nicht kopiert werden',
  'trade.share.not-ready':
    'Die Trade-Notiz wird noch geladen. Versuche es gleich erneut.',
  'share.review.action': 'Review-Karte teilen',
  'share.review.modal-title': 'Review teilen',
  'share.review.section.top': 'Anfang der Notiz',
  'share.review.select-all': 'Alle auswählen',
  'share.review.clear': 'Leeren',
  'share.review.legend.widget': 'Widget',
  'share.review.legend.heading': 'Überschrift mit Text',
  'share.review.legend.media': 'Medien',
  'share.review.legend.text': 'Text',
  'share.review.copy': 'Bild kopieren',
  'settings.general.hide-dollar-amounts-in-shares':
    'Dollarbeträge in geteilten Bildern ausblenden',
  'settings.general.hide-dollar-amounts-in-shares-desc':
    'Bei aktivierten R-Multiples lassen Trade-Screenshots und Review-Karten Risiko, Gebühren, Kommissionen und MAE/MFE in Dollar weg.',
  'share.review.hide-dollar-amounts': 'Dollarbeträge ausblenden',
  'share.review.hide-dollar-amounts-hint':
    'Lässt Risiko, Gebühren und andere Dollarwerte weg.',
  'share.review.hide-dollar-amounts-needs-r':
    'Aktiviere R-Multiples in den Einstellungen, um ohne Dollarbeträge zu teilen.',
  'share.review.copied': 'Teilen-Karte in die Zwischenablage kopiert',
  'share.review.failed': 'Teilen-Karte konnte nicht kopiert werden',

  'trade.review.reviewed': 'Bewertet',
  'trade.review.reviewed-on': 'Bewertet am {date}',

  'timeline.status.loss': 'Verlust',

  'timeline.aria.session-navigation': 'Same-day trade navigation',
  'timeline.aria.previous-trade': 'Previous trade: {trade}',
  'timeline.aria.next-trade': 'Next trade: {trade}',
  'timeline.aria.no-previous-trade': 'No previous trade in this trading day',
  'timeline.aria.no-next-trade': 'No next trade in this trading day',

  'drc.tab.review': 'Review',

  'drc.missed-trades.label.reason': 'Grund:',

  'missed-trade.reason-title': 'Warum ich diesen Trade verpasst habe',

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
  'settings.general.privacy-mode': 'Datenschutzmodus',
  'settings.general.privacy-mode-desc':
    'Maskiert sensible Trading-, Konto-, Preis- und Performance-Werte in der UI, ohne gespeicherte Daten zu ändern.',
  'settings.general.privacy-mode-aria': 'Datenschutzmodus umschalten',
  'dashboard.conversion.original-pnl': 'Ursprünglicher G/V',
  'dashboard.conversion.converted-pnl': 'Konvertierter G/V',
  'dashboard.conversion.details-label': 'Details zur Währungsumrechnung',

  'home.widget.profit-target-widget.name': 'Gewinnziel',
  'home.widget.profit-target-widget.description':
    'Verfolge Gewinnziel-Fortschritt über Konten',
  'home.widget.eval-roi.name': 'Eval-Rendite',
  'home.widget.challenge-alerts.name': 'Challenge-Hinweise',
  'home.widget.challenge-alerts.description':
    'Prop-Konten: gescheitert, bestanden, auszahlbar',
  'home.widget.eval-roi.description':
    'Prop-Challenge-Gebühren vs. erhaltene Auszahlungen',
  'form.ideal-exit.title': 'Ideale Exits',

  'form.ideal-exit.price': 'Idealer Preis',
  'form.ideal-exit.size': 'Größe',
  'form.ideal-exit.remove': 'Idealen Exit entfernen',

  'form.ideal-exit.copy-actual': 'Tatsächliche Exits kopieren',

  'form.ideal-exit.tooltip':
    'Erfasse rückblickend den Exit-Plan, den du gern ausgeführt hättest. Unterstützt skalierte Exits für die Auswertung.',
  'form.ideal-exit.empty': 'Noch keine idealen Exits',
  'form.unrealized.title': 'Snapshot der offenen Position',
  'form.unrealized.tooltip':
    'Erfasse den aktuellen Marktpreis deiner offenen Position, um den unrealisierten P&L zu verfolgen. Der Snapshot wird beim Schließen des Trades automatisch entfernt.',
  'form.unrealized.price': 'Snapshot-Preis',
  'form.unrealized.time': 'Snapshot-Zeitpunkt',
  'form.unrealized.preview': 'Unrealisierter P&L',
  'form.unrealized.captured': 'Erfasst {time}',
  'form.layout.item.unrealized-snapshot-desc':
    'Unrealisierten P&L offener Positionen verfolgen.',
  'trade.validation.unrealized-snapshot-price-non-negative':
    'Der Snapshot-Preis muss null oder größer sein',
  'trade.validation.unrealized-snapshot-open-position-required':
    'Der Snapshot-Zeitpunkt muss während einer offenen Position liegen.',
  'settings.general.appearance': 'Darstellung',
  'settings.general.accent-color': 'Akzentfarbe',
  'settings.general.accent-color-desc':
    'Farbe für Journalit-Schaltflächen, -Schalter und -Hervorhebungen. Der Journalit-Akzent wird nur verwendet, solange Obsidian seinen Standardakzent nutzt; ein in den Darstellungseinstellungen von Obsidian gewählter Akzent oder ein Theme hat immer Vorrang.',
  'settings.general.accent-color-journalit': 'Journalit-Akzent (Standard)',
  'settings.general.accent-color-obsidian': 'Obsidian-Akzent verwenden',
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
  'settings.general.home-widget-opacity': 'Widget-Deckkraft',
  'settings.general.home-widget-opacity-desc':
    'Widget-Hintergründe mit Bild: 0% ist transparent, 100% ist deckend. Gilt für das aktuelle Design; helle und dunkle Werte werden getrennt gespeichert.',
  'settings.general.home-widget-opacity-save-failed':
    'Die Widget-Deckkraft konnte nicht gespeichert werden. Bitte erneut versuchen.',
  'settings.general.home-background': 'Home-Hintergrundbild',
  'settings.general.home-background-desc':
    'Verwende ein Bild aus deinem Vault oder wähle eines von deinem Computer aus, um es in den Vault zu kopieren.',
  'settings.general.home-background-dashboard':
    'Hintergrund auch im Dashboard anzeigen',
  'settings.general.home-background-dashboard-desc':
    'Verwendet dasselbe Hintergrundbild im Dashboard-Modus.',
  'settings.general.home-background-dashboard-aria':
    'Home-Hintergrund im Dashboard anzeigen',

  'settings.general.home-background-choose': 'Bild auswählen',
  'settings.general.home-background-clear': 'Löschen',

  'settings.general.home-background-invalid-file':
    'Wähle eine unterstützte Bilddatei aus.',
  'settings.general.home-background-saved': 'Home-Hintergrundbild gespeichert.',
  'settings.general.home-background-cleared': 'Home-Hintergrundbild entfernt.',
  'settings.general.home-background-save-failed':
    'Das Home-Hintergrundbild konnte nicht gespeichert werden.',
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
  'settings.general.show-seconds': 'Sekunden in Trade-Zeiten anzeigen',
  'settings.general.show-seconds-desc':
    'Sekunden bei der Eingabe von Ein- und Ausstiegszeiten anzeigen.',
  'settings.general.show-seconds-aria': 'Sekunden in Trade-Zeiten anzeigen',
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
  'settings.general.mae-mfe-display-unit': 'MAE/MFE-Anzeigeeinheit',
  'settings.general.mae-mfe-display-unit-desc':
    'MAE/MFE in Währung oder Futures-Ticks in Analysen und Handelsansichten anzeigen. Der Tick-Modus berechnet geeignete bestehende Futures-Trades automatisch neu, ohne gespeicherte Handelsdaten zu ändern.',
  'settings.general.mae-mfe-display-unit-aria':
    'MAE/MFE-Anzeigeeinheit auswählen',
  'settings.general.mae-mfe-display-dollar': 'Währung',
  'settings.general.mae-mfe-display-ticks': 'Ticks',
  'common.ticks': 'Tick-Einheiten',
  'dashboard.mae-mfe-ticks.partial-coverage':
    'Nur {eligible} von {total} Trades verfügen über Futures-Tickdaten. Nicht geeignete Trades werden aus dieser Kennzahl ausgeschlossen.',
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
    'Update-Erinnerungen und Neuerungen nach einem Update anzeigen.',
  'settings.general.update-notifications-aria':
    'Update-Benachrichtigungen anzeigen',
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

  'settings.customization.setups': 'Setups',
  'settings.customization.mistakes': 'Fehler',
  'settings.customization.tags': 'Schlagworte',
  'settings.customization.events': 'Veranstaltungen',

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

  'button.remove': 'Entfernen',

  'button.move-up': 'Bewegen Sie sich nach oben',
  'button.move-down': 'Bewegen Sie sich nach unten',

  'settings.customization.custom-fields.description':
    'Ergänzen Sie jeden Trade um eigene Felder, etwa Session, Zeitrahmen oder Setup-Bewertung. Sie erscheinen im Tab „Erweitert“ des Trade-Formulars, werden im Frontmatter der Trade-Notiz gespeichert und können zu sortier- und filterbaren Spalten im Trade-Log werden.',
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
    'Beginnen Sie mit einem Feld, das Sie später wirklich auswerten, etwa die gehandelte Session oder wie gut das Setup Ihrem Plan entsprach.',
  'settings.customization.custom-fields.add-new': 'Neues Feld hinzufügen',

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
    'Ein Trading-Journal, das auf Ihrem Gerät lebt.',
  'onboarding.welcome.cta': 'Mein Journal einrichten',
  'onboarding.welcome.chart.week': 'Woche {count}',
  'onboarding.view.title': 'Journalit Onboarding',

  'onboarding.common.continue': 'Weitermachen',
  'onboarding.common.close': 'Schließen',

  'onboarding.features.badge.pro': 'PRO',

  'onboarding.features.graphic.syncing': 'Trades werden synchronisiert...',
  'onboarding.features.graphic.complete': 'Synchronisierung abgeschlossen',
  'onboarding.features.graphic.direction.long': 'LANG',
  'onboarding.features.graphic.direction.short': 'KURZ',
  'onboarding.features.graphic.status.win': 'GEWINN',
  'onboarding.features.graphic.status.loss': 'VERLUST',
  'onboarding.activation.title': 'Melden Sie sich bei Journalit an',

  'onboarding.activation.status.initializing':
    'Generieren Ihres Authentifizierungscodes...',

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

  'onboarding.notice.complete-failed':
    'Der Onboarding-Abschluss konnte nicht gespeichert werden. Bitte versuchen Sie es später noch einmal.',
  'onboarding.notice.completed':
    'Ihr Journal ist eingerichtet. Onboarding abgeschlossen.',
  'onboarding.familiarity.kicker': 'Kurze Frage',
  'onboarding.familiarity.title': 'Haben Sie Obsidian schon einmal benutzt?',
  'onboarding.familiarity.subtitle':
    'Journalit läuft in Obsidian. Wenn das neu für Sie ist, zeigen wir nur das Nötigste.',
  'onboarding.familiarity.option.yes.label': 'Ja, ich kenne mich aus',
  'onboarding.familiarity.option.yes.description': 'Orientierung überspringen.',
  'onboarding.familiarity.option.no.label': 'Nein, Obsidian ist neu für mich',
  'onboarding.familiarity.option.no.description':
    'Ein kurzer Bildschirm, keine Tour.',
  'onboarding.orientation.kicker': 'Neu bei Obsidian',
  'onboarding.orientation.title': 'Vier Dinge, die Sie wissen sollten',
  'onboarding.orientation.subtitle':
    'Mehr brauchen Sie nicht, um Journalit zu nutzen.',
  'onboarding.orientation.inside.title': 'Journalit läuft in Obsidian',
  'onboarding.orientation.inside.body':
    'Sie müssen Obsidian nicht zuerst lernen. Dieser Bildschirm ist eine Journalit-Ansicht.',
  'onboarding.orientation.sidebar.title':
    'Über die Seitenleiste bewegen Sie sich',
  'onboarding.orientation.sidebar.body':
    'Home, Dashboard, Trade-Log und Ihre Reviews finden Sie dort.',
  'onboarding.orientation.sidebar.action': 'Seitenleiste zeigen',
  'onboarding.orientation.sidebar.action-mobile': 'Seitenleiste öffnen',
  'onboarding.orientation.sidebar.hint':
    'Das ist sie, links. Dieser Bildschirm bleibt offen.',
  'onboarding.orientation.sidebar.hint-mobile':
    'Sie öffnet sich über diesem Bildschirm. Wischen oder außerhalb tippen, um zurückzukehren.',
  'onboarding.orientation.tabs.title': 'Ansichten öffnen sich als Tabs',
  'onboarding.orientation.tabs.body':
    'So wie dieser. Wechseln Sie oben zwischen ihnen.',
  'onboarding.orientation.privacy.title': 'Ihr Journal bleibt auf Ihrem Gerät',
  'onboarding.orientation.privacy.body':
    'Notizen, Screenshots und Reviews sind Ihre eigenen Dateien. Nur importierte oder synchronisierte Trades laufen über die Journalit-Server.',
  'onboarding.orientation.continue': 'Verstanden',
  'onboarding.data-source.kicker': 'Ihre Trades',
  'onboarding.data-source.title': 'Wo sind Ihre Trades gerade?',
  'onboarding.data-source.subtitle':
    'Ihre Historie ist Teil Ihres Vorteils. Nehmen Sie sie mit, und Ihre Statistiken sind ab dem ersten Tag aussagekräftig, statt monatelang auf neue Trades zu warten.',
  'onboarding.data-source.option.broker.label':
    'Bei meinem Broker oder meiner Plattform',
  'onboarding.data-source.option.broker.description':
    'Verbinden oder den Export importieren.',
  'onboarding.data-source.option.file.label': 'In meiner eigenen Tabelle',
  'onboarding.data-source.option.file.description':
    'Ein Journal, das du in Excel, Google Sheets oder als CSV führst.',
  'onboarding.data-source.option.fresh.label':
    'Noch nirgends, ich fange neu an',
  'onboarding.data-source.option.fresh.description':
    'Trades erfassen, während Sie sie machen.',
  'onboarding.data-source.option.sample.label':
    'Noch nirgends, ich schaue mir ein Beispiel an',
  'onboarding.data-source.option.sample.description':
    'Sieh dir ein fertiges Journal an, bevor du eigene Trades hinzufügst.',
  'onboarding.broker.kicker': 'Ihr Broker',
  'onboarding.broker.title': 'Welcher Broker oder welche Plattform?',
  'onboarding.awaiting.sign-in.action': 'Anmelden, um fortzufahren',
  'onboarding.awaiting.sign-in.body':
    'Melden Sie sich zuerst an oder erstellen Sie ein kostenloses Journalit-Konto. Ihre Trades landen dann in Ihrem Journal.',
  'onboarding.broker.badge.sync': 'Auto-Sync',
  'onboarding.broker.search': 'Broker und Plattformen suchen',
  'onboarding.broker.subtitle':
    'Wir wählen den besten Weg, Ihre Trades zu übernehmen.',
  'onboarding.broker.option.unlisted.label': 'Nicht aufgeführt',
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title': 'Noch nicht dabei? Sag uns welchen Broker',
  'onboarding.broker.request.body':
    'Neue Broker werden auf Anfrage ergänzt. Nenne uns deinen (ein Export-Beispiel hilft); bis dahin lässt sich ein Dateiexport manuell zuordnen.',
  'onboarding.broker.request.discord': 'Auf Discord anfragen',
  'onboarding.broker.request.continue': 'Mit manuellem Import fortfahren',
  'onboarding.broker.loading': 'Unterstützte Broker werden geprüft...',
  'onboarding.broker.offline':
    'Die vollständige Liste konnte nicht geladen werden. Sie können trotzdem einen unterstützten Broker verbinden oder eine Datei importieren.',
  'onboarding.personalise.kicker': 'Journal einrichten',
  'onboarding.personalise.title': 'Ein paar schnelle Entscheidungen',
  'onboarding.personalise.subtitle':
    'Wir passen Journalit anhand Ihrer Antworten an.',
  'onboarding.personalise.style.question': 'Wie traden Sie?',
  'onboarding.personalise.style.scalping': 'Viele Trades pro Tag',
  'onboarding.personalise.style.intraday':
    'Wenige Trades pro Tag, nichts über Nacht',
  'onboarding.personalise.style.swing': 'Tage bis Wochen gehalten',
  'onboarding.personalise.style.position': 'Wochen bis Monate gehalten',
  'onboarding.personalise.account.question': 'Welche Art von Konto?',
  'onboarding.personalise.account.personal': 'Privat',
  'onboarding.personalise.account.practice': 'Demo oder Übung',
  'onboarding.personalise.account.prop': 'Prop-Firm-Challenge oder Funded',
  'onboarding.personalise.asset.question': 'Was traden Sie hauptsächlich?',
  'onboarding.personalise.asset.stock': 'Aktien',
  'onboarding.personalise.asset.futures': 'Futures',
  'onboarding.personalise.asset.forex': 'Forex',
  'onboarding.personalise.asset.crypto': 'Krypto',
  'onboarding.personalise.asset.options': 'Optionen',
  'onboarding.personalise.asset.mixed': 'Gemischt',
  'onboarding.first-trade.kicker': 'Fast geschafft',
  'onboarding.first-trade.title': 'Ersten Trade hinzufügen',
  'onboarding.first-trade.subtitle':
    'Ihr Journal ist bereit. Erfassen Sie einen Trade, und Journalit arbeitet damit.',
  'onboarding.first-trade.cta': 'Meinen ersten Trade hinzufügen',
  'onboarding.first-trade.sample': 'Mit Beispieldaten erkunden',
  'onboarding.preparing-sample.title': 'Dein Beispiel-Journal wird vorbereitet',
  'onboarding.preparing-sample.body':
    'Das dauert nur ein paar Sekunden. Obsidian kann sich etwas langsam anfühlen, während die Notizen geschrieben werden.',
  'onboarding.preparing-sample.starting': 'Wird gestartet…',
  'onboarding.preparing-sample.hint':
    'Du kannst das Beispiel-Journal jederzeit über sein Abzeichen in der Ecke entfernen.',
  'onboarding.preparing-sample.failed.title':
    'Das Beispiel-Journal konnte nicht erstellt werden',
  'onboarding.preparing-sample.failed.body':
    'Du kannst es erneut versuchen oder einen anderen Start wählen.',
  'onboarding.preparing-sample.retry': 'Erneut versuchen',
  'onboarding.sample-exploring.kicker': 'Beispiel-Journal',
  'onboarding.sample-exploring.title':
    'Du erkundest gerade das Beispiel-Journal',
  'onboarding.sample-exploring.body':
    'Lass dir Zeit. Wenn du das Beispiel verlässt, machen wir hier weiter: dein eigenes Journal personalisieren und deinen ersten Trade hinzufügen.',
  'onboarding.sample-exploring.exit': 'Beispiel verlassen und weitermachen',
  'onboarding.sample-exploring.failed.title':
    'Das Beispiel-Journal konnte nicht wiederhergestellt werden',
  'onboarding.sample-exploring.failed.body':
    'Verlasse das Beispiel, um die Reste zu entfernen, und richte dann dein eigenes Journal weiter ein.',
  'onboarding.awaiting.kicker': 'Warten auf Ihre ersten Trades',
  'onboarding.awaiting.first-sync.title': 'Broker-Verbindung abschließen',
  'onboarding.awaiting.first-sync.body':
    'Schließen Sie die Verbindung unter Einstellungen > Trade Sync ab. Sobald Ihre ersten Trades synchronisiert sind, schließt sich diese Einrichtung von selbst.',
  'onboarding.awaiting.first-sync.action': 'Trade Sync öffnen',
  'onboarding.awaiting.first-import.title': 'Datei importieren',
  'onboarding.awaiting.first-import.body':
    'Schließen Sie den Import im Tab Trade Import ab. Sobald Ihre ersten Trades da sind, schließt sich diese Einrichtung von selbst.',
  'onboarding.awaiting.first-import.action': 'Trade Import öffnen',
  'onboarding.awaiting.first-trade.title': 'Ersten Trade speichern',
  'onboarding.awaiting.first-trade.body':
    'Sobald Ihr erster Trade gespeichert ist, schließt sich diese Einrichtung von selbst.',
  'onboarding.awaiting.first-trade.action': 'Trade hinzufügen',
  'onboarding.awaiting.change-route': 'Anderen Weg wählen',
  'onboarding.notice.personalise-failed':
    'Ihre Einrichtungsauswahl konnte nicht angewendet werden. Sie können sie später in den Einstellungen anpassen.',
  'onboarding.notice.trade-sync-open-failed':
    'Trade Sync konnte nicht geöffnet werden. Bitte versuche es erneut.',
  'onboarding.notice.skip-failed':
    'Der Onboarding-Übersprung konnte nicht gespeichert werden. Bitte versuchen Sie es später noch einmal.',

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
  'review.header.guide.intro.title': 'Deine Review beginnt hier',
  'review.header.guide.intro.description':
    'In der Kopfzeile findest du alles, um durch diese Review zu navigieren und sie zu verwalten.',
  'review.header.guide.reviewed.title': 'Als geprüft markieren',
  'review.header.guide.reviewed.description':
    'Klicke auf den Kreis, um diese Notiz als geprüft zu markieren. Klicke erneut, um das rückgängig zu machen.',
  'review.header.guide.dates.title': 'Zwischen Reviews wechseln',
  'review.header.guide.dates.description':
    'Klicke auf eine Datumsangabe wie Juni oder 2026, um die zugehörige Review-Notiz zu öffnen.',
  'review.header.guide.controls.title': 'Filter, Layout und Navigation',
  'review.header.guide.controls.description':
    'Nutze den Trichter zum Filtern von Trades, „Layout wechseln“ für ein anderes Notizlayout und „Zurück“ / „Weiter“ zum Wechseln zwischen Review-Zeiträumen.',
  'widget.header.name': 'Kopfzeile',

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
  'widget.picker.search-placeholder': 'Widgets suchen...',
  'widget.picker.search-label': 'Widgets suchen',
  'widget.picker.clear-search': 'Widget-Suche löschen',
  'widget.picker.results-label': 'Verfügbare Widgets',
  'widget.picker.no-results': 'Keine Widgets entsprechen Ihrer Suche',
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
  'widget.key-events.currency-label': 'Währung:',
  'widget.key-events.time-label': 'Zeit:',
  'widget.key-events.field-unset': 'Nicht gesetzt',
  'widget.key-events.notes-placeholder':
    'Notizen zu dieser Veranstaltung (optional)',
  'widget.key-events.notes-label': 'Notizen',
  'widget.key-events.default-notes-tooltip':
    'Standardnotizen werden unter Einstellungen → Anpassung → Ereignisse verwaltet. Wenn Sie hier ein Ereignis auswählen, werden die gespeicherten Standardnotizen automatisch eingefügt.',
  'widget.key-events.add-button': 'Ereignis hinzufügen',
  'widget.key-events.empty-state': 'Keine wichtigen Ereignisse für heute',
  'widget.key-events.empty-state-sub':
    'Fügen Sie Ereignisse zu Ihrem wöchentlichen Rückblick hinzu',
  'widget.key-events.open-calendar-aria': 'Wirtschaftskalender öffnen',
  'widget.key-events.restore-auto-import':
    'Auto-importierte Ereignisse wiederherstellen',
  'widget.key-events.restore-missing-events':
    'Fehlende Ereignisse wiederherstellen ({count})',
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
  'common.r-missing.title': 'Kein R für diesen Trade',
  'common.r-missing.trade':
    'Dieser Trade hat keinen Risikobetrag, daher kann sein Ergebnis nicht in R angezeigt werden.',
  'common.r-missing.fix':
    'Füge einen Risikobetrag hinzu oder lege in den Einstellungen einen Standard-Risikobetrag fest.',
  'common.r-coverage.partial':
    'Basiert auf {valid} von {total} Trades. Trades ohne Risikobetrag werden in R nicht berücksichtigt.',
  'common.r-coverage.none':
    'Keine Trades hier haben einen Risikobetrag, daher gibt es kein R anzuzeigen.',
  'dashboard.r-coverage.no-comparison':
    'Keine Veränderung angezeigt: Der Vergleichszeitraum hat für diese Kennzahl keinen R-Wert.',
  'dashboard.metrics.past-30d': 'letzte 30 T.',

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
  'widget.tag-performance.name': 'Leistung nach Tags',
  'widget.tag-performance.description':
    'Leistungsaufschlüsselung nach Schlagwort',
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

  'widget.table.header.trades': 'Trades',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Gewinn %',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.tag': 'Schlagwort',
  'widget.table.header.setup': 'Setup',
  'widget.table.header.a-games': 'Ein Spiel',
  'widget.table.header.b-games': 'B-Spiele',
  'widget.table.header.c-games': 'C-Spiele',
  'widget.table.header.rating': 'Bewertung',
  'widget.table.header.avg-rating': 'Durchschnittliches Rating',
  'widget.demon-tracker.column.demon': 'DÄMON',
  'widget.demon-tracker.column.occurrences': 'Vorkommnisse',
  'widget.demon-tracker.column.stop-trading': 'Hören Sie mit dem Trading auf',
  'widget.demon-tracker.period.this-week': 'diese Woche',
  'widget.demon-tracker.period.this-month': 'diesen Monat',
  'widget.demon-tracker.period.this-quarter': 'dieses Quartal',
  'widget.demon-tracker.period.this-year': 'dieses Jahr',
  'widget.demon-tracker.empty.title': 'Keine Fehler erfasst {period}',
  'widget.demon-tracker.empty.description':
    'Hier werden bei Ihren Trades protokollierte Fehler angezeigt, um Muster zu erkennen',
  'widget.demon-tracker.summary.unique': 'Einzigartige Fehler:',
  'widget.demon-tracker.summary.total': 'Gesamtzahl der Vorkommen:',
  'widget.demon-tracker.summary.critical': 'Kritisch ({threshold}+):',
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
    'Bruttogewinn im Verhältnis zum Bruttoverlust',
  'metric.calmarRatio.name': 'Calmar-Verhältnis',
  'metric.calmarRatio.description':
    'Annualisierte realisierte Rendite im Verhältnis zum maximalen prozentualen Drawdown',
  'dashboard.calmarRatio.tooltip.formula':
    'Annualisierte Rendite geteilt durch maximalen Drawdown.',
  'dashboard.calmarRatio.unavailable.no-history':
    'Noch keine realisierte Handelshistorie.',
  'dashboard.calmarRatio.unavailable.capital':
    'Startkapital in der Anzeigewährung ist nicht verfügbar.',
  'dashboard.calmarRatio.unavailable.incomplete-history':
    'Einige realisierte Gewinne oder Verluste fehlen.',
  'dashboard.calmarRatio.unavailable.dates': 'Einige Handelsdaten fehlen.',
  'dashboard.calmarRatio.unavailable.short-history':
    'Mindestens ein Tag Historie erforderlich.',
  'dashboard.calmarRatio.unavailable.no-drawdown':
    'Noch kein Drawdown erfasst.',
  'dashboard.calmarRatio.unavailable.non-positive-equity':
    'Das Eigenkapital erreichte null oder weniger.',
  'dashboard.calmarRatio.unavailable.non-finite':
    'Das Ergebnis ist zu groß für die Berechnung.',
  'dashboard.calmarRatio.unavailable.scope':
    'Gesamten Zeitraum und nur ganze Konten auswählen.',
  'dashboard.calmarRatio.unavailable.conversion':
    'Einige Währungsumrechnungen sind nicht verfügbar.',
  'metric.sharpeRatio.name': 'Sharpe-Kennzahl',
  'metric.sharpeRatio.description':
    'Durchschnittliches Trade-P&L relativ zur Volatilität',
  'metric.expectancy.name': 'Erwartungswert',
  'metric.expectancy.description': 'Ø-Gewinn oder -Verlust pro Trade',
  'metric.maxDrawdown.name': 'Max. Rückgang',
  'metric.maxDrawdown.description':
    'Größter Rückgang von einem früheren P&L-Hoch',
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
  'metric.longestLossStreak.description': 'Längste Verlustserie in Folge',
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
  'metric.avgRR.description': 'Ø-Gewinn geteilt durch Ø-Verlust',
  'metric.avgRRRiskBased.name': 'Durchschn. RR (R-basiert)',
  'metric.avgRRRiskBased.description':
    'Gewinn-R vs. Verlust-R (benötigt Stop-Daten)',
  'metric.avgHoldTime.name': 'Durchschnittliche Haltezeit',
  'metric.avgHoldTime.description':
    'Durchschnittliche Zeit in allen geschlossenen Trades',
  'metric.avgWinHoldTime.name': 'Durchschnittliche Gewinnhaltezeit',
  'metric.avgWinHoldTime.description': 'Ø-Haltedauer von Gewinn-Trades',
  'metric.avgLossHoldTime.name': 'Durchschnittliche Verlusthaltezeit',
  'metric.avgLossHoldTime.description': 'Ø-Haltedauer von Verlust-Trades',
  'metric.avgWinnerHeat.name': 'Durchschn. Gewinner-Heat',
  'metric.avgWinnerHeat.description': 'Durchschnittlicher MAE bei Gewinntrades',
  'metric.winnerMaeP90.name': 'Gewinner MAE P90',
  'metric.winnerMaeP90.description': '90. Perzentil des MAE bei Gewinntrades',
  'metric.winnerMaeMedian.name': 'Gewinner MAE Median',
  'metric.winnerMaeMedian.description': 'Median-MAE bei Gewinntrades',
  'metric.avgLossHeat.name': 'Durchschn. Verlust-Heat',
  'metric.avgLossHeat.description': 'Durchschnittlicher MAE bei Verlusttrades',
  'metric.winnerAvgMfe.name': 'Gewinner durchschn. MFE',
  'metric.winnerAvgMfe.description': 'Durchschnittlicher MFE bei Gewinntrades',
  'metric.loserAvgMfe.name': 'Verlierer durchschn. MFE',
  'metric.loserAvgMfe.description': 'Durchschnittlicher MFE bei Verlusttrades',
  'metric.winnerMfeP90.name': 'Gewinner MFE P90',
  'metric.winnerMfeP90.description': '90. Perzentil des MFE bei Gewinntrades',
  'metric.loserMfeP90.name': 'Verlierer MFE P90',
  'metric.loserMfeP90.description': '90. Perzentil des MFE bei Verlusttrades',
  'metric.timeInDrawdown.name': 'Zeit im Drawdown',
  'metric.timeInDrawdown.description': 'Anteil der Zeit unter deinem P&L-Hoch',
  'metric.avgRecoveryTime.name': 'Durchschnittliche Wiederherstellungszeit',
  'metric.avgRecoveryTime.description': 'Ø-Erholungszeit nach einem Drawdown',
  'metric.longestDrawdown.name': 'Längster realisierter Drawdown',
  'metric.longestDrawdown.description':
    'Längste Zeit in einem einzelnen Drawdown',
  'metric.drawdownEpisodes.name': 'Drawdown-Episoden',
  'metric.drawdownEpisodes.description': 'Anzahl getrennter Drawdown-Phasen',
  'metric.category.performance': 'Leistung',
  'metric.category.volume': 'Volumen',

  'onboarding.wizard.skip-aria': 'Überspringen Sie diesen Schritt',
  'onboarding.wizard.skip-onboarding': 'Onboarding überspringen',

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
  'guide.step-count': '{count} Schritte',
  'guide.step-position': 'Schritt {current} von {total}',

  'account.linked-trades.setups': 'Setups',

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
  'account.create.error.rule-incomplete':
    'Jede aktivierte Regel braucht einen Wert über null',
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
  'account.edit.convert.discard-title': 'Ungespeicherte Änderungen verwerfen?',
  'account.edit.convert.discard-message':
    'Die Einrichtung der Prüfung öffnet sich in einem eigenen Fenster und schließt dieses Formular. Hier vorgenommene Änderungen werden nicht gespeichert.',
  'account.edit.convert.discard-confirm': 'Verwerfen und fortfahren',
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
  'account.prop-challenge.summary.status.archived': 'Archiviert',
  'account.prop-challenge.summary.status.hidden': 'Ausgeblendet',
  'account.prop-challenge.actions.progress-to': 'Weiter zu {phase}',
  'account.prop-challenge.actions.progress': 'Zur nächsten Phase',
  'account.prop-challenge.actions.mark-passed':
    'Challenge als bestanden markieren',
  'account.prop-challenge.actions.mark-failed': 'Als fehlgeschlagen markieren',
  'account.prop-challenge.actions.archive': 'Challenge archivieren',
  'account.prop-challenge.actions.stale':
    'Diese Challenge wurde an anderer Stelle aktualisiert. Prüfe sie und versuche es erneut.',
  'account.prop-challenge.actions.reopen': 'Wieder öffnen',
  'account.prop-challenge.actions.link-rules': 'Mit Firmenregeln verknüpfen…',
  'account.prop-challenge.view-trades': 'Trades für {phase} anzeigen',
  'account.prop-challenge.actions.manual': 'Manuelle Aktionen',
  'account.prop-challenge.notice.failed-title': '{phase} nicht bestanden',
  'account.prop-challenge.notice.failed-description':
    '{rule} am {date} verletzt',
  'account.prop-challenge.notice.failed-manual': 'Als nicht bestanden markiert',
  'account.prop-challenge.notice.keep-open': 'Offen lassen',
  'account.prop-challenge.notice.target-title': 'Ziel von {phase} erreicht',
  'account.prop-challenge.notice.target-description':
    'Alle Bestehensanforderungen sind erfüllt. Weiter zu {next}?',
  'account.prop-challenge.notice.breach-after-reached':
    'Regeln wurden nach Erreichen des Ziels um {time} verletzt. Setze die Übergangszeit, damit diese Trades nicht in dieser Phase bleiben.',
  'account.prop-challenge.notice.not-yet': 'Noch nicht',
  'account.prop-challenge.notice.passed-title': 'Evaluierung bestanden',
  'account.prop-challenge.notice.passed-description':
    'Alle Anforderungen sind erfüllt. Challenge als bestanden markieren?',
  'account.prop-challenge.notice.payout-title':
    'Auszahlung verfügbar: {amount}',
  'account.prop-challenge.notice.payout-plan': 'Dein Plan: {amount} auszahlen',
  'account.prop-challenge.notice.record-payout': 'Auszahlung erfassen',
  'account.prop-challenge.notice.skip-cycle': 'Diesen Zyklus überspringen',
  'account.prop-challenge.notice.payout-description': 'Auszahlung',
  'account.prop-challenge.notice.lost-title': 'Auszahlung nicht mehr verfügbar',
  'account.prop-challenge.notice.lost-description':
    'Nicht erfüllt: {requirements}',
  'account.prop-challenge.notice.dismiss': 'Schließen',
  'account.prop-challenge.notice.unknown-title': 'Neues Konto {label}',
  'account.prop-challenge.notice.unknown-description':
    '{count} Trades seit {date} sind keiner Phase zugeordnet.',
  'account.prop-challenge.notice.unknown-description-one':
    '1 Trade seit {date} ist keiner Phase zugeordnet.',
  'account.prop-challenge.notice.same-phase': 'Gleiche Phase',
  'account.prop-challenge.notice.not-now': 'Nicht jetzt',
  'account.prop-challenge.notice.error':
    'Hinweis konnte nicht aktualisiert werden.',
  'account.prop-challenge.notice.type-changed':
    'Kontotyp auf {accountType} gesetzt',
  'account.prop-challenge.payout.plan.title': 'Auszahlungsplan',
  'account.prop-challenge.payout.plan.notify-minimum':
    'Benachrichtigen ab ({currency})',
  'account.prop-challenge.payout.plan.withdrawal': 'Vorgeschlagene Auszahlung',
  'account.prop-challenge.payout.plan.full': 'Gesamter Betrag',
  'account.prop-challenge.payout.plan.percent': 'Prozent des Verfügbaren',
  'account.prop-challenge.payout.plan.amount': 'Fester Betrag',
  'account.prop-challenge.payout.plan.percent-invalid':
    'Gib einen Prozentsatz zwischen 1 und 100 ein.',
  'account.prop-challenge.payout.plan.amount-invalid':
    'Gib einen Betrag über null ein.',
  'account.prop-challenge.payout.plan.percent-value': 'Prozent',
  'account.prop-challenge.payout.plan.amount-value': 'Betrag ({currency})',
  'account.prop-challenge.payout.plan.save': 'Plan speichern',
  'account.prop-challenge.payout.plan.saved': 'Auszahlungsplan gespeichert.',
  'account.prop-challenge.payout.plan.summary-notify': 'ab {amount} melden',
  'account.prop-challenge.payout.plan.summary-percent':
    '{percent}% vorschlagen',
  'account.prop-challenge.payout.plan.summary-amount': '{amount} vorschlagen',
  'account.prop-challenge.payout.plan.summary-full': 'voller Betrag',
  'account.prop-challenge.actions.error':
    'Die Prop-Challenge konnte nicht aktualisiert werden.',
  'account.prop-challenge.confirm.advance':
    'Dieses Phasenergebnis bestätigen und fortfahren?',
  'account.prop-challenge.confirm.advance-with-promotion':
    'Dies setzt die Challenge fort und ändert den Kontotyp zu {accountType}.',
  'account.prop-challenge.confirm.fail':
    '{account} als gescheitert markieren? Die Challenge „{challenge}“ endet bei {phase}.',
  'account.prop-challenge.confirm.archive-failed':
    '{account} archivieren? Die Challenge „{challenge}“ ist gescheitert. Das Konto wird archiviert.',
  'account.prop-challenge.confirm.archive-passed':
    '{account} archivieren? Die Challenge „{challenge}“ wurde bestanden. Das Konto wird archiviert.',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → Challenge bestanden',
  'account.prop-challenge.confirm.reopen':
    '{account} wieder öffnen? Die Challenge „{challenge}“ kehrt zu {phase} zurück.',
  'account.prop-challenge.transition.time': 'Übergangszeit',
  'account.prop-challenge.transition.now': 'Jetzt',
  'account.prop-challenge.transition.when-target-reached':
    'Als das Ziel erreicht wurde',
  'account.prop-challenge.transition.too-early':
    'Die Übergangszeit darf nicht vor dem Phasenstart liegen.',
  'account.prop-challenge.costs.title': 'Einmalige Kosten',
  'account.prop-challenge.costs.description':
    'Kauf-, Reset- und Aktivierungsgebühren separat erfassen.',
  'account.prop-challenge.costs.kind': 'Typ',
  'account.prop-challenge.costs.kind.purchase': 'Kauf',
  'account.prop-challenge.costs.kind.reset': 'Zurücksetzung',
  'account.prop-challenge.costs.kind.activation': 'Aktivierung',
  'account.prop-challenge.costs.kind.other': 'Sonstige',
  'account.prop-challenge.costs.date': 'Datum',
  'account.prop-challenge.costs.amount': 'Betrag',
  'account.prop-challenge.costs.note': 'Notiz (optional)',
  'account.prop-challenge.costs.add': 'Kosten hinzufügen',
  'account.header.copies': 'Kopiert',
  'account.header.copied-by-more': '+{count} mehr',
  'account.header.created': 'Erstellt:',
  'account.summary.current-balance': 'Aktueller Kontostand',
  'account.summary.net-cash-flow': 'Netto-Kapitalfluss',
  'account.summary.payouts': 'Auszahlungen',
  'account.performance.title': 'Wertentwicklung',
  'account-page.guide.whats-new.cockpit.intro.title': 'Deine Prüfungsregeln',
  'account-page.guide.whats-new.cockpit.intro.description':
    'Bei einem Prop-Konto steht jede Firmenregel und wie nah du ihr bist unter den Kennzahlen.',
  'account-page.guide.whats-new.cockpit.cockpit.title':
    'Eine Phase prüfen und handeln',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    'Wähle im Regelkopf eine Phase, um ihre Regeln zu sehen. Markiere sie über das ⋮-Menü daneben als bestanden oder nicht bestanden oder öffne sie wieder.',
  'account-page.guide.main.challenge.title': 'Deine Challenge auf einen Blick',
  'account-page.guide.main.challenge.description':
    'Wählen Sie eine Phase, um jede Regel mit ihrem Fortschritt zu sehen. Funded-Phasen mit verifizierten Auszahlungsregeln verfolgen hier auch die Auszahlungsberechtigung.',
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

  'account.edit.modal.change-date.confirm': 'Erstellungsdatum aktualisieren',
  'account.edit.modal.change-balance.title': 'Anfangssaldo ändern',
  'account.edit.modal.change-balance.message':
    'Sie sind dabei, den Anfangssaldo von {oldBalance} in {newBalance} zu ändern.',

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

  'account.edit.modal.delete.will': 'Diese Aktion wird:',
  'account.edit.modal.delete.item1':
    'Entfernen Sie alle Kontometadaten und -einstellungen',
  'account.edit.modal.delete.item2':
    'Entfernen Sie Kontoreferenzen aus allen verknüpften Trades',
  'account.edit.modal.delete.item3':
    'Entfernen Sie automatisch generierte Konto-Tags aus Notizen',
  'common.note-label': 'Notiz:',

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
  'templateEditor.button.insert-widget-here': 'Widget hier einfügen',
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
  'templateEditor.widget.demon-tracker.tracking-method':
    'Fehler erfassen nach:',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    'Trade-Vorkommen',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    'Jeder Trade mit diesem Fehler zählt.',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days':
    'Handelstagen',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    'Fehler aus Trades und täglichen Reviews werden zusammengeführt und pro Handelstag einmal gezählt.',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    'Einträgen in täglichen Reviews',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    'Nur Fehler aus täglichen Reviews zählen.',
  'templateEditor.widget.demon-tracker.stop-after': 'Trading stoppen nach:',
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
  'account.transaction.edit-row-label':
    'Diese Transaktion bearbeiten oder löschen: {date}, {amount}',
  'account.deposits-withdrawals.title': 'Ein- und Auszahlungen',
  'account.deposits-withdrawals.empty':
    'Es wurden keine manuellen Ein- oder Auszahlungen erfasst.',
  'account.deposits-withdrawals.empty-sub':
    'Klicken Sie in der Kopfzeile auf die Schaltfläche „+“, um Ihre erste Transaktion hinzuzufügen.',
  'account.deposits-withdrawals.summary':
    '{deposits} eingezahlt · {withdrawn} ausgezahlt · zuletzt {date}',
  'account.payouts.title': 'Auszahlungen',
  'account.payouts.summary': '{count} Auszahlungen · {total} · zuletzt {date}',
  'account.payouts.summary-masked':
    'Auszahlungsverlauf ist ausgeblendet, solange Werte maskiert sind',
  'account.payouts.summary-one': '1 Auszahlung · {total} · zuletzt {date}',
  'account.payouts.empty': 'Noch keine Auszahlungen',
  'account.payouts.empty-sub':
    'Erfassen Sie eine Auszahlung über die Schaltfläche „+“ in der Kopfzeile.',
  'account.ledger.column.date': 'Datum',
  'account.ledger.column.type': 'Typ',
  'account.ledger.column.payout': 'Auszahlung',
  'account.ledger.column.description': 'Beschreibung',
  'account.ledger.column.amount': 'Betrag',
  'account.ledger.column.balance-after': 'Saldo danach',
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
  'home.quick-links.add-trade': 'Trade hinzufügen',
  'home.quick-links.trade-log': 'Trade-Log',
  'home.quick-links.trading-dashboard': 'Auswertung',
  'home.quick-links.account-dashboard': 'Konten',
  'home.quick-links.todays-drc': 'Der heutige DRC',
  'home.quick-links.weekly-review': 'Rückblick dieser Woche',
  'home.quick-links.monthly-review': 'Rückblick auf diesen Monat',
  'home.quick-links.quarterly-review': 'Quartalsrückblick',
  'home.quick-links.yearly-review': 'Jahresrückblick',
  'home.quick-links.quick-import': 'Schnellimport',
  'home.quick-links.csv-import': 'Handelsimport',
  'home.quick-links.layout-builder': 'Layout-Builder',
  'home.quick-links.navigation-sidebar': 'Navigations-Seitenleiste',
  'home.quick-links.session-mode': 'Sitzungsmodus',
  'home.quick-links.economic-calendar': 'Wirtschaftskalender',
  'home.quick-links.move-above': 'Verschieben Sie Quicklinks über Widgets',
  'home.quick-links.move-below': 'Verschieben Sie Quicklinks unter Widgets',
  'home.widget-selector.title': 'Zur Startseite hinzufügen',
  'home.widget-selector.subtitle':
    'Durchsuchen Sie Widgets anhand ihrer Vorschau und klicken Sie auf eines, um es zur Startseite hinzuzufügen.',
  'home.widget-selector.sample-note.title': 'Handelsplan',
  'home.widget-selector.sample-note.intro':
    'Nur A+-Setups an Schlüsselmarken handeln. Max. 3 Trades pro Tag.',
  'home.widget-selector.sample-note.checklist': 'Checkliste vor Marktöffnung',
  'home.widget-selector.sample-note.task.calendar':
    'Wirtschaftskalender prüfen',
  'home.widget-selector.sample-note.task.levels':
    'Schlüsselmarken im Chart markieren',
  'home.widget-selector.sample-note.task.max-loss':
    'Maximalen Tagesverlust festlegen',
  'home.widget-selector.sample-note.task.journal':
    'Ersten Trade im Journal erfassen',
  'home.widget-selector.tab.performance': 'Leistung',
  'home.widget-selector.tab.accounts': 'Konten',
  'home.widget-selector.tab.workflow': 'Arbeitsablauf',
  'home.widget-selector.section.quick-links': 'Schnelllinks',
  'home.widget-selector.restore': 'wiederherstellen',
  'home.widget-selector.add-shortcut': 'Konto-/Setup-Verknüpfung hinzufügen',
  'home.period.month': 'Monat',
  'home.period.week': 'Woche',
  'home.period.custom': 'Benutzerdefinierter Zeitraum',
  'home.period.invalid-range':
    'Das Enddatum muss am oder nach dem Startdatum liegen.',
  'date-input.error.day': 'Der Tag muss zwischen 1 und {max} liegen.',
  'date-input.error.invalid': 'Bitte geben Sie ein gültiges Datum ein',
  'date-input.error.month': 'Der Monat muss zwischen 1 und 12 liegen.',
  'date-input.error.year': 'YY (2000–2099) oder YYYY (1000–9999) verwenden.',
  'home.period.quarter': 'Quartal',
  'home.period.year': 'Jahr',
  'home.period.lifetime': 'Alle Zeit',

  'home.aria.filter-trade-types': 'Filtern Sie Trade-Typen',
  'home.aria.open-settings': 'Journalit-Einstellungen öffnen',
  'home.aria.save-layout': 'Layout speichern',
  'home.aria.customize': 'Anpassen',
  'home.button.add-widget': 'Widget hinzufügen',

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
  'home.greeting.name-placeholder': 'Dein Name',
  'home.greeting.edit-name-aria': '{name}. Anzeigenamen bearbeiten',
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

  'home.widget.best-hours.hidden': 'Ausgeblendet',
  'home.widget.best-hours.hidden-detail': 'Privatsphäre-Modus',
  'home.widget.best-hours.no-positive-window': 'Kein positives Fenster',
  'home.widget.best-hours.insufficient-history': 'Mehr Daten nötig',
  'home.widget.best-hours.sample-requirement': '{count}/2 beprobte Fenster',
  'home.widget.best-hours.developing': 'entwickelt sich',
  'home.widget.best-hours.no-positive-detail': 'Beprobte Fenster sind negativ',

  'home.widget.aum.title': 'AUM',
  'home.widget.aum.current-trend': 'Aktuell · 30-Tage-Trend',
  'home.widget.aum.period.month': 'Diesen Monat',
  'home.widget.aum.period.quarter': 'Dieses Quartal',
  'home.widget.aum.period.year': 'Dieses Jahr',
  'home.widget.aum.period.all': 'Alle Zeit',
  'home.widget.aum.unable-to-load': 'Konnte nicht geladen werden',
  'home.widget.aum.no-accounts': 'Keine Konten',
  'home.widget.aum.account-count': '{count}-Konto',
  'home.widget.aum.account-count-plural': '{count}-Konten',
  'home.widget.streak.title': 'Strähne',
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
  'home.widget.account-progress.configure-aria': 'Konten für {widget} wählen',
  'home.widget.account-progress.config-title': 'Angezeigte Konten',
  'home.widget.account-progress.mode.automatic': 'Automatisch',
  'home.widget.account-progress.mode.selected': 'Konten wählen',
  'home.widget.account-progress.automatic-drawdown':
    'Höchster Drawdown zuerst.',
  'home.widget.account-progress.automatic-profit-target':
    'Am nächsten am Ziel zuerst.',
  'home.widget.account-progress.max-label': 'Bis zu',
  'home.widget.account-progress.max-all': 'Alle',
  'home.widget.account-progress.select-hint':
    'Wähle so viele, wie du möchtest.',
  'home.widget.account-progress.no-eligible': 'Noch keine Konten zur Auswahl.',
  'home.widget.account-progress.none-selected':
    'Keine Konten gewählt. Zum Auswählen klicken.',
  'home.widget.account-progress.search': 'Konten suchen',
  'home.widget.account-progress.select-all': 'Alle',
  'home.widget.account-progress.select-none': 'Keine',
  'home.widget.account-progress.select-all-aria':
    'Alle angezeigten Konten wählen',
  'home.widget.account-progress.select-none-aria': 'Angezeigte Konten abwählen',
  'home.widget.account-progress.no-match': 'Keine passenden Konten.',
  'home.widget.account-progress.none-available':
    'Keines der gewählten Konten kann angezeigt werden. Zum Auswählen klicken.',
  'home.widget.eval-roi.title': 'Eval-Rendite',
  'home.widget.eval-roi.unable-to-load': 'Konnte nicht geladen werden',
  'home.widget.eval-roi.no-challenges': 'Keine Prop-Challenges',
  'home.widget.eval-roi.challenge-count': '{count} Bewertung',
  'home.widget.eval-roi.challenge-count-plural': '{count} Bewertungen',
  'home.widget.eval-roi.net': 'Netto',
  'home.widget.eval-roi.spent': 'Ausgegeben',
  'home.widget.eval-roi.payouts': 'Auszahlungen',
  'home.widget.eval-roi.break-even': 'Gewinnschwelle',
  'home.widget.challenge-alerts.title': 'Challenge-Hinweise',
  'home.widget.challenge-alerts.unable-to-load':
    'Challenge-Hinweise konnten nicht geprüft werden',
  'home.widget.challenge-alerts.empty': 'Keine Challenge-Hinweise',
  'home.widget.challenge-alerts.count': '{count} Hinweis',
  'home.widget.challenge-alerts.count-plural': '{count} Hinweise',
  'home.widget.challenge-alerts.more': '+{count} weitere',
  'home.widget.challenge-alerts.kind.failed': 'Nicht bestanden',
  'home.widget.challenge-alerts.kind.target': 'Ziel erreicht',
  'home.widget.challenge-alerts.kind.passed': 'Bestanden',
  'home.widget.challenge-alerts.kind.payout': 'Auszahlung bereit',
  'home.widget.challenge-alerts.kind.lost': 'Auszahlung nicht mehr verfügbar',
  'home.widget.challenge-alerts.kind.unknown-account': 'Neues Konto {label}',
  'home.widget.eval-roi.roi-aria': 'Rendite auf Evaluierungskosten',
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

  'home.widget.setups.trades-count': '{count} Trades',
  'home.widget.setups.win-rate': '{rate}% Trefferquote',
  'home.widget.weekly.title': 'Diese Woche',
  'home.widget.weekly.no-trades': 'Diese Woche noch keine Trades',
  'home.widget.weekly.breakeven': 'diese Woche bisher ausgeglichen',
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
  'calendar.reviewed': 'Überprüft',
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

  'shared.collapsible.active-filters': '{count} aktive Filter',
  'filter.modal.no-setup': 'Kein Setup',
  'filter.modal.no-tags': 'Keine Tags',
  'filter.modal.no-mistakes': 'Keine Fehler',
  'filter.modal.type.regular': 'Regulär',
  'filter.modal.type.backtest': 'Backtest',
  'filter.summary.regular-trades': 'Regulärer Trades',
  'filter.modal.status.breakeven': 'Break-even',

  'filter.modal.review-status.reviewed': 'Überprüft',
  'filter.modal.review-status.unreviewed': 'Nicht überprüft',
  'filter.modal.direction.long-call': 'Long/Kaufoption',
  'filter.modal.direction.short-put': 'Short/Verkaufsoption',
  'filter.modal.section.custom-fields': 'Benutzerdefinierte Felder',
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

  'widget.session-mistakes.placeholder': 'Fehler auswählen oder erstellen',
  'widget.session-mistakes.empty':
    'Es wurden keine Sitzungsfehler protokolliert',

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
  'widget.empty.no-tag-data':
    'Keine Schlagwortdaten für diesen Zeitraum verfügbar',
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
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    'Dieses Widget ist nur in wöchentlichen, monatlichen, vierteljährlichen und jährlichen Reviews verfügbar',
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
  'dashboard.selector.subtitle':
    'Durchsuchen Sie Diagramme und Metriken anhand ihrer Vorschau und klicken Sie auf eines, um es zum Dashboard hinzuzufügen.',
  'dashboard.selector.tab.performance': 'Leistung',
  'dashboard.selector.tab.breakdowns': 'Aufschlüsselungen',
  'dashboard.selector.tab.risk': 'Risiko & Analyse',
  'widget-drawer.tab.all': 'Alle',
  'widget-drawer.search.placeholder': 'Widgets suchen',
  'widget-drawer.section.available': 'Verfügbar',
  'widget-drawer.section.in-use': 'In Verwendung',
  'widget-drawer.empty-search': 'Keine Widgets entsprechen Ihrer Suche',
  'widget-drawer.added-count': '{count} hinzugefügt',
  'widget-drawer.add-aria': '{name} hinzufügen',
  'widget-drawer.remove': 'Entfernen',
  'widget-drawer.remove-aria': '{name} entfernen',
  'widget-drawer.close': 'Schließen',
  'dashboard.selector.metrics': 'Metriken',

  'widget.pnlChart.name': 'Kumulativ P&L',
  'widget.pnlChart.description': 'Kumuliertes P&L im Zeitverlauf',

  'widget.longPnLChart.name': 'Long-G/V',
  'widget.longPnLChart.description':
    'Kumulierte P&L-Kurve geschlossener Long-Trades',
  'widget.shortPnLChart.name': 'Short-G/V',
  'widget.shortPnLChart.description':
    'Kumulierte P&L-Kurve geschlossener Short-Trades',
  'widget.performanceCalendar.name': 'Leistungskalender',
  'widget.performanceCalendar.description': 'Kalender deines täglichen P&L',

  'widget.dailyPerformance.name': 'Tägliche Performance',
  'widget.dailyPerformance.description': 'P&L für jeden Handelstag',

  'widget.tradesChart.name': 'Trades-Diagramm',
  'widget.tradesChart.description': 'P&L für jeden einzelnen Trade',

  'widget.weekdayPerformance.name': 'Wochentag-Performance',
  'widget.weekdayPerformance.description': 'P&L nach Wochentag',

  'widget.hourlyPerformance.name': 'Stündliche Performance',
  'widget.hourlyPerformance.description': 'P&L nach Tageszeit',

  'widget.tickerPerformance.name': 'Performance nach Ticker',
  'widget.tickerPerformance.description':
    'Rangliste der Performance nach Ticker',
  'widget.tradesChart.limit': '{count} Trades',
  'widget.drawdownChart.name': 'Rückgang Chart',
  'widget.drawdownChart.description':
    'Rückgang vom letzten realisierten P&L-Hoch',

  'widget.directionalDrawdownChart.name':
    'Richtungsbezogener realisierter Drawdown',

  'widget.longDrawdownChart.name': 'Realisierter Long-Drawdown',
  'widget.longDrawdownChart.description': 'Drawdown nur für Long-Trades',

  'widget.shortDrawdownChart.name': 'Realisierter Short-Drawdown',
  'widget.shortDrawdownChart.description': 'Drawdown nur für Short-Trades',

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
    'Gewinn/Verlust-Verhältnis der letzten Trades',

  'widget.rollingStats.name': 'Rollierender durchschnittlicher Gewinn/Verlust',
  'widget.rollingStats.description': 'Ø-Gewinn und -Verlust der letzten Trades',

  'shared.filter.disabled-preview': 'Filter in der Vorschau deaktiviert',
  'shared.filter.open': 'Filter öffnen',
  'shared.filter.active-count': '{count} aktive Filter',
  'ui.toggle-switch.aria-label': 'Kippschalter',
  'ui.folder-browser.placeholder': 'Wählen Sie einen Ordner aus...',
  'ui.folder-browser.root': 'Wurzel',
  'ui.folder-browser.clear-aria':
    'Deaktivieren Sie die Option, um den Standardspeicherort zu verwenden',
  'ui.folder-browser.expand-folder': 'Ordner erweitern',
  'ui.folder-browser.collapse-folder': 'Ordner einklappen',

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
  'error.clipboard.network-error':
    'Beim Verarbeiten des Einfügens ist ein Netzwerkfehler aufgetreten. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
  'error.clipboard.paste-failed':
    'Der Einfügevorgang konnte nicht abgeschlossen werden. Versuchen Sie bitte erneut, das Bild zu kopieren und einzufügen.',
  'error.clipboard.generic':
    'Der Zwischenablagevorgang ist fehlgeschlagen. Bitte versuchen Sie erneut, Ihren Inhalt zu kopieren und einzufügen.',

  'datetime.aria.open-picker': 'Datumsauswahl öffnen',

  'modal.template-switch.title': 'Vorlage wechseln?',
  'modal.template-switch.switching-from': 'Du wechselst von',
  'modal.template-switch.switching-to': 'Zu',
  'modal.template-switch.has-content-title': 'Diese Notiz hat Inhalt',
  'modal.template-switch.has-content-desc':
    'Der Inhalt wird neu organisiert, um dem neuen Layout zu entsprechen. Alle Inhalte, die nicht passen, werden am Ende der Notiz gespeichert, damit Sie sie überprüfen können.',
  'modal.template-switch.cannot-undo':
    'Dies kann nicht rückgängig gemacht werden (Sie können jedoch zurückwechseln).',
  'modal.template-switch.button.switch': 'Vorlage wechseln',

  'release-notes.title': 'Versionshinweise',
  'release-notes.loading-plugin': 'Plugin wird geladen...',

  'release-notes.no-content': 'Keine Versionshinweise gefunden',
  'release-notes.current-version': 'Aktuell: v{version}',
  'release-notes.version': 'Version {version}',
  'release-notes.link.docs': 'Dokumente',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',
  'skeleton.tradelog.loading': 'Trading-Daten werden geladen',
  'skeleton.dashboard-widget.loading': 'Widget-Daten werden geladen',
  'skeleton.account-page.loading': 'Kontoseite wird geladen',

  'grid.aria.remove-widget': 'Widget entfernen',
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'CSV-Export des Fills-Widgets',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Öffnen Sie das Fills-Widget in TT und wechseln Sie zur Ansicht „Detail“, „Kontinuierlich“ oder „Preis mit Detail“.',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Wichtig:',

  'trade.metadata.broker-comment': 'Broker-Kommentar',

  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'Performance-Kalender',
  'navigation.section.overview': 'Überblick',
  'navigation.section.reviews': 'Reviews',
  'navigation.section.tools': 'Werkzeuge',
  'navigation.edit-mode.toggle': 'Passen Sie die Navigation an',
  'navigation.edit-mode.hide-item': 'Navigationselement ausblenden',
  'navigation.edit-mode.restore-section': 'Versteckte Gegenstände',
  'navigation.edit-mode.restore': 'Wiederherstellen',
  'navigation.items.nav-settings': 'Einstellungen',
  'navigation.shortcuts.add': 'Verknüpfung hinzufügen',
  'navigation.shortcuts.remove': 'Verknüpfung entfernen',
  'navigation.shortcuts.close': 'Auswahl schließen',
  'navigation.shortcuts.search': 'Konten und Handels-Setups durchsuchen',
  'navigation.shortcuts.accounts': 'Konten',
  'navigation.shortcuts.setups': 'Handels-Setups',
  'navigation.shortcuts.empty': 'Keine Konten oder Handels-Setups verfügbar',
  'navigation.shortcuts.unavailable': 'Nicht verfügbar',
  'navigation.shortcuts.added': 'Hinzugefügt',
  'navigation.shortcuts.parent-required':
    'Entferne zuerst die Verknüpfungen, bevor du diesen Navigationseintrag ausblendest.',
  'navigation.items.nav-home': 'Heim',
  'navigation.items.nav-dashboard': 'Auswertung',
  'navigation.items.nav-trade-log': 'Trade-Log',
  'navigation.items.nav-account-dashboard': 'Konten',
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
  'navigation.items.nav-economic-calendar': 'Wirtschaftskalender',
  'navigation.items.nav-position-size': 'Positionsgrößenrechner',
  'settings.general.navigation-sidebar': 'Navigationsseitenleiste',
  'notice.error.open-navigation-sidebar':
    'Die Navigations-Seitenleiste konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.',
  'navigation.setting.open': 'Navigations-Seitenleiste öffnen',
  'navigation.setting.open.desc':
    'Jetzt anzeigen und die Obsidian-Seitenleiste erweitern, falls sie eingeklappt ist.',
  'navigation.setting.open.button': 'Seitenleiste öffnen',
  'calendar.setting.open': 'Kalender öffnen',
  'calendar.setting.open.button': 'Kalender öffnen',
  'notice.error.open-calendar-sidebar':
    'Der Kalender konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.',
  'navigation.setting.tab-behavior': 'Verhalten der Navigationsregisterkarte',
  'navigation.setting.tab-behavior.desc':
    'So öffnen Sie Ansichten und Reviews aus den Journalit-Seitenleisten',
  'navigation.setting.tab-behavior.new-tab': 'In neuem Tab öffnen',
  'navigation.setting.tab-behavior.replace': 'Aktive Registerkarte ersetzen',
  'navigation.search.placeholder': 'Suchen Sie nach Trades und Reviews...',
  'navigation.search.clear': 'Suche löschen',
  'navigation.search.section.trades': 'Trades',
  'navigation.search.section.reviews': 'Reviews',
  'navigation.search.empty': 'Keine Ergebnisse gefunden',
  'navigation.search.trade-open': 'Offen',

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

  'templateEditor.widget.weekly-drc-start-collapsed': 'Eingeklappt starten',
  'templateEditor.widget.weekly-drc-day-all': 'All days',

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
  'templateEditor.widget.trade-review.questions': 'Review-Fragen',
  'templateEditor.widget.trade-review.questions-help':
    'Wählen Sie die für jedes Handelsergebnis angezeigten Fragen aus. Die Fragen-IDs bleiben stabil, damit gespeicherte Antworten auch beim Bearbeiten oder Umsortieren der Fragen zugeordnet bleiben.',
  'templateEditor.widget.trade-review.outcome.win': 'Gewinne',
  'templateEditor.widget.trade-review.outcome.loss': 'Verluste',
  'templateEditor.widget.trade-review.outcome.breakeven': 'Break-even',
  'templateEditor.widget.trade-review.outcome.open': 'Offen',
  'templateEditor.widget.trade-review.questions-empty':
    'Keine Fragen für dieses Ergebnis.',
  'templateEditor.widget.trade-review.question-label': 'Frage',
  'templateEditor.widget.trade-review.question-placeholder':
    'Review-Frage eingeben',
  'templateEditor.widget.trade-review.answer-placeholder-label':
    'Antwortplatzhalter',
  'templateEditor.widget.trade-review.answer-placeholder':
    'Optionaler Hinweis, der im Antwortfeld angezeigt wird',
  'templateEditor.widget.trade-review.add-question': '+ Frage hinzufügen',
  'templateEditor.widget.trade-review.answer-type-label': 'Antworttyp',
  'templateEditor.widget.trade-review.answer-type-text': 'Text',
  'templateEditor.widget.trade-review.answer-type-choice': 'Auswahl',
  'templateEditor.widget.trade-review.option-placeholder': 'Optionsbezeichnung',
  'templateEditor.widget.trade-review.add-option': '+ Option hinzufügen',
  'templateEditor.widget.trade-review.condition-label': 'Anzeigen wenn',
  'templateEditor.widget.trade-review.condition-always': 'Immer sichtbar',
  'templateEditor.widget.trade-review.condition-option-label':
    'Wenn F{questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section':
    '+ Abschnitt hinzufügen',

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
  'settings.general.include-unrealized-pnl':
    'Unrealisierten P&L in Analysen einbeziehen',
  'settings.general.include-unrealized-pnl-desc':
    'Wenn aktiviert, enthalten Netto-P&L-Summen den unrealisierten P&L offener Positionen mit Preis-Snapshot, getrennt von realisierten Ergebnissen dargestellt. Statistiken wie Trefferquote und Serien bleiben rein realisiert.',
  'settings.general.include-unrealized-pnl-aria':
    'Unrealisierten P&L in Analysen einbeziehen',
  'settings.general.include-unrealized-pnl-toggled':
    'Unrealisierter P&L in Analysen {status}',
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
  'calendar.aria.open-monthly-review': 'Monatsrückblick für {date} öffnen',
  'calendar.aria.open-quarterly-review': 'Quartalsrückblick für {date} öffnen',

  'csv.mapper.aria.map-column': 'Spalte {header} zuordnen',
  'trade-import.error.file-empty':
    'Diese Datei ist leer. Exportiere sie erneut und versuche es noch einmal.',
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
    'Melde dich an oder erstelle ein kostenloses Journalit-Konto, um Dateien im Trade Import anzusehen. Pro ist erst erforderlich, wenn du die Trades importierst.',
  'quick-import.gate.sign-in-cta': 'Anmelden und kostenlos ansehen',
  'quick-import.gate.pro': 'Schnellimport ist in Trade Import Pro enthalten.',
  'quick-import.gate.preview-free': 'Datei kostenlos in Vorschau ansehen',
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

  'quick-import.privacy-note':
    'Die ausgewählte Datei und Importoptionen werden an Journalit gesendet. Verschlüsselte Diagnoseaufzeichnungen verfallen nach 1 Tag (kostenlos) oder 14 Tagen (Pro), Vorschauen nach 7 Tagen. Die optionale KI-Zuordnung sendet Überschriften und Beispielzeilen an ein KI-Modell. Trade Import sendet keine separate Client-Telemetrie oder Fehlerberichte im Hintergrund.',
  'quick-import.dropzone.title': 'Broker-Export hier ablegen',
  'quick-import.dropzone.subtitle': 'Oder klicken, um eine Datei auszuwählen',

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

  'quick-import.summary.to-import': 'Zu importieren',
  'quick-import.summary.duplicates': 'Duplikate',
  'quick-import.summary.failed': 'Prüfung nötig',
  'quick-import.summary.failed-rows': 'Nicht importierte Zeilen',
  'quick-import.summary.incomplete-rows': 'Übersprungene unvollständige Zeilen',
  'quick-import.complete.title': 'Import abgeschlossen',
  'quick-import.complete.message':
    '{written} geschrieben, {duplicates} Duplikate, {failed} müssen geprüft werden.',
  'quick-import.action.open-full': 'Vollständigen Trade Import öffnen',
  'quick-import.action.review-in-trade-import': 'In Trade Import prüfen',
  'quick-import.action.setup-in-trade-import': 'In Trade Import einrichten',
  'quick-import.action.import': 'Trades importieren',
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import-count.one': 'Importiere {count} Trade',
  'quick-import.action.import-count.few': 'Importiere {count} Trades',
  'quick-import.action.import-count.many': 'Importiere {count} Trades',
  'quick-import.action.import-count.other': 'Importiere {count} Trades',
  'quick-import.preview.more': '+ {count} more processed trades',

  'trade-import.notice.capabilities-failed':
    'Trade-Import-Funktionen konnten nicht geladen werden',
  'trade-import.notice.open-failed':
    'Trade Import konnte nicht geöffnet werden',
  'trade-import.notice.template-exists':
    'Eine Trade-Import-Vorlage mit diesem Namen existiert bereits',
  'trade-import.notice.template-saved': 'Trade-Import-Vorlage gespeichert',
  'trade-import.notice.analyse-failed': 'Trade-Import-Analyse fehlgeschlagen',
  'trade-import.notice.preview-failed': 'Trade-Import-Vorschau fehlgeschlagen',
  'trade-import.notice.free-preview-rate-limited':
    'Kostenloses Vorschau-Limit erreicht. Aktiviere PRO oder versuche es in etwa {minutes} Minuten erneut.',
  'trade-import.notice.free-preview-storage-limit-reached':
    'Der kostenlose Vorschau-Speicher fasst bis zu {limit} Trades. Du hast {storedItems} gespeichert, und diese Datei würde {requestedItems} hinzufügen. Warte, bis eine frühere Vorschau abläuft, oder aktiviere PRO.',
  'trade-import.preview-error.guidance':
    'Prüfe, ob alle Pflichtfelder zugeordnet sind, das ausgewählte Datumsformat zur Datei passt und numerische Spalten gültige Trade-Werte enthalten.',
  'trade-import.notice.complete':
    'Trade Import abgeschlossen: {written} geschrieben oder aktualisiert, {duplicateCount} Duplikate, {failedCount} fehlgeschlagen',
  'trade-import.gate.brand-left': 'Trades',
  'trade-import.gate.brand-right': 'Importieren',
  'trade-import.gate.sign-in.title':
    'Vorschau deiner Trading-Historie – kostenlos',
  'trade-import.gate.sign-in':
    'Melde dich an oder erstelle ein kostenloses Journalit-Konto, um deine Datei zu analysieren. Pro ist erst erforderlich, wenn du die Trades importierst.',
  'trade-import.gate.sign-in.reassurance':
    'Die ausgewählte Datei und Importoptionen werden an Journalit gesendet. Verschlüsselte Diagnoseaufzeichnungen verfallen nach 1 Tag (kostenlos) oder 14 Tagen (Pro), Vorschauen nach 7 Tagen. Die optionale KI-Zuordnung sendet Überschriften und Beispielzeilen an ein KI-Modell. Trade Import sendet keine separate Client-Telemetrie oder Fehlerberichte im Hintergrund.',
  'trade-import.gate.sign-in.no-trial':
    'Für Analyse und Vorschau ist keine Pro-Testphase erforderlich.',
  'trade-import.gate.sign-in.cta': 'Anmelden und kostenlos ansehen',

  'trade-import.step.select': '1. Import-Einstellungen auswählen',
  'trade-import.step.privacy': 'Datenschutzhinweis',
  'trade-import.step.analyse': '3. Analysieren und zuordnen',
  'trade-import.step.preview': '4. Vorschau',
  'trade-import.label.template': 'Lokale Zuordnungsvorlage',
  'trade-import.label.template-actions': 'Vorlagenaktionen',
  'trade-import.template.none': 'Keine Vorlage',
  'trade-import.label.account': 'Konto',
  'trade-import.label.broker': 'Exportquelle / Plattform',
  'trade-import.label.asset-type': 'Asset-Typ',
  'trade-import.asset.stock': 'Aktie',
  'trade-import.asset.options': 'Optionen',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Krypto',
  'trade-import.manual-mode.price-based':
    'Orders oder Fills (zu Trades zusammengeführt)',
  'trade-import.manual-mode.direct-pnl': 'Ein Trade pro Zeile (nutzt G/V)',
  'trade-import.label.ai-mapping': 'KI-Zuordnungsvorschläge anfordern',
  'trade-import.privacy.copy':
    'Die ausgewählte Datei und Importoptionen werden an Journalit gesendet. Verschlüsselte Diagnoseaufzeichnungen verfallen nach 1 Tag (kostenlos) oder 14 Tagen (Pro), Vorschauen nach 7 Tagen. Die optionale KI-Zuordnung sendet Überschriften und Beispielzeilen an ein KI-Modell. Trade Import sendet keine separate Client-Telemetrie oder Fehlerberichte im Hintergrund. Exporte können Kontokennungen, Handelshistorie, Notizen, Preise, Mengen, Gebühren, Salden und Gewinn/Verlust enthalten. Anfragen senden auch benutzerdefinierte Felddefinitionen und gespeicherte Optionen; Vorschauen enthalten den Zielkontonamen. Deaktiviere die KI-Zuordnung, um die KI-Verarbeitung zu vermeiden.',

  'trade-import.action.analyse': 'Datei analysieren',
  'trade-import.action.choose-file': 'Zum Hochladen klicken oder Datei ablegen',
  'trade-import.guide.prompt': 'Nicht sicher, was du exportieren sollst?',
  'trade-import.guide.link': 'Broker-Anleitung ansehen',
  'trade-import.hyperliquid.export-guidance':
    'Wähle bei Hyperliquid Trade History → Export as CSV, nicht Export More (ein separater Bericht eines Drittanbieters). Verwende weder Funding History noch Order History.',
  'trade-import.hyperliquid.date-us': 'USA: Monat/Tag/Jahr – 24-Stunden-Zeit',
  'trade-import.hyperliquid.date-day-first':
    'Tag zuerst: Tag/Monat/Jahr, mit oder ohne „ - “ vor der Uhrzeit',
  'trade-import.hyperliquid.date-german':
    'Deutsch: Tag.Monat.Jahr – 24-Stunden-Zeit',
  'trade-import.hyperliquid.invalid-time-zone':
    'Die Zeitzone dieses Geräts konnte nicht erkannt werden. Prüfe die Systemeinstellungen.',
  'trade-import.hyperliquid.backend-update-required':
    'Für die Hyperliquid-Vorschau ist eine Serveraktualisierung erforderlich. Bitte versuche es später erneut.',
  'trade-import.action.drop-file': 'Datei zum Hochladen ablegen',
  'trade-import.analyse.detected':
    'Deine {fileType}-Datei wurde gelesen. Prüfe die Zeilen unten und ordne dann jede Spalte einem Trade-Feld zu.',
  'trade-import.table.screenshots': 'Bildschirmfotos',
  'trade-import.preview.screenshot-alt':
    'Screenshot für {symbol} aus Tabellenzeile {row}',
  'trade-import.preview.screenshots-more': '{count} weitere',
  'trade-import.preview.include-screenshots':
    'Screenshots aus deiner Tabelle zu ihren Trades hinzufügen ({count})',
  'trade-import.completion.screenshots-added':
    'Aus deiner Tabelle hinzugefügte Screenshots: {count}',
  'trade-import.completion.screenshots-failed':
    'Screenshots aus deiner Tabelle, die nicht hinzugefügt werden konnten: {count}',
  'trade-import.preview.import-anyway': 'Trotzdem importieren',
  'trade-import.preview.import-anyway-aria':
    '{symbol} vom {date} trotzdem importieren',
  'trade-import.preview.import-all-anyway':
    'Alle {count} möglichen Duplikate trotzdem importieren',
  'csv.mapper.missing-fields.pnl-or-prices':
    'Oder ordne Einstiegspreis, Ausstiegspreis und Menge zu, um die G/V aus den Preisen zu berechnen.',
  'trade-import.pnl-from-prices.title':
    'Die G/V wird aus deinen Preisen berechnet',
  'trade-import.pnl-from-prices.body':
    'Es gibt keine G/V-Spalte, daher wird die G/V aus Einstiegspreis, Ausstiegspreis und Menge berechnet. Das stimmt nur mit der richtigen Anlageklasse – wähle also, was diese Trades sind.',
  'trade-import.pnl-from-prices.contract-size':
    'Forex und Futures brauchen zusätzlich eine Spalte für die Kontraktgröße, um die G/V zu berechnen. Ohne sie ordne stattdessen deine G/V-Spalte zu.',
  'trade-import.diagnostic.choose-date-format': 'Datumsformat wählen',
  'trade-import.date-question.ambiguous':
    'Deine Daten sehen aus wie {example}. Welches Datum ist das?',
  'trade-import.date-question.mixed':
    'Einige Daten in dieser Spalte haben eine andere Reihenfolge, z. B. {example}. Welche Reihenfolge nutzen die meisten deiner Daten?',
  'trade-import.date-question.mixed-note':
    'Zeilen in der anderen Reihenfolge werden aufgelistet, damit du sie in deiner Datei korrigieren kannst.',
  'quick-import.message.date-order':
    'Deine Daten lassen sich auf zwei Arten lesen. Öffne den vollständigen Import, um das zu wählen.',
  'csv.date-format.eu-dot': 'EU-Punkt: 25.12.2024 (Tag.Monat.Jahr)',
  'csv.date-format.ymd-dot': 'Jahr zuerst mit Punkten: 2024.12.25',
  'trade-import.unmapped.title': 'Nicht importiert ({count})',
  'trade-import.unmapped.body':
    'Diese Spalten sind keinem Journalit-Feld zugeordnet und werden ausgelassen. Wenn ein Feld passt, ordne die Spalte oben zu.',
  'trade-import.unmapped.keep': 'Als benutzerdefiniertes Feld behalten',
  'trade-import.unmapped.keep-aria':
    '{header} als benutzerdefiniertes Feld behalten',
  'trade-import.custom-field.title':
    '„{header}“ als benutzerdefiniertes Feld behalten',
  'trade-import.custom-field.hint':
    'Fügt deinen Trades ein Feld hinzu und füllt es aus dieser Spalte. Wenn bereits ein Journalit-Feld passt, ordne die Spalte stattdessen diesem zu.',
  'trade-import.custom-field.name': 'Feldname',
  'trade-import.custom-field.type': 'Feldtyp',
  'trade-import.custom-field.type.text': 'Freitext',
  'trade-import.custom-field.type.number': 'Zahl',
  'trade-import.custom-field.type.dropdown': 'Auswahlliste',
  'trade-import.custom-field.create': 'Feld anlegen',
  'trade-import.custom-field.error.reserved':
    'Dieser Name wird von einem eingebauten Trade-Feld verwendet. Wähle einen anderen Namen.',
  'trade-import.table.open-closed': 'Offen/geschlossen',
  'trade-import.status.open': 'Offen',
  'trade-import.status.partially-closed': 'Teilweise geschlossen',
  'trade-import.status.closed': 'Geschlossen',
  'trade-import.status.cancelled': 'Storniert',
  'trade-import.diagnostic.column': 'Spalte: {columns}',
  'trade-import.diagnostic.unmap-column': 'Diese Spalte nicht importieren',
  'trade-import.diagnostic.edit-mapping': 'Zuordnung ändern',
  'trade-import.diagnostic.info': 'Info',
  'trade-import.label.sheet': 'Blatt',
  'trade-import.label.header-row': 'Header-Zeile',
  'trade-import.placeholder.auto': 'Automatisch',
  'trade-import.label.date-format': 'Datumsformat',

  'trade-import.label.save-template': 'Zuordnungsvorlage speichern',
  'trade-import.placeholder.template-name': 'Vorlagenname',
  'trade-import.action.save-template': 'Vorlage speichern',
  'trade-import.action.preview': 'Vorschau erzeugen',

  'trade-import.preview.found.one': 'Wir haben {count} Trade gefunden',
  'trade-import.preview.found.few': 'Wir haben {count} Trades gefunden',
  'trade-import.preview.found.many': 'Wir haben {count} Trades gefunden',
  'trade-import.preview.found.other': 'Wir haben {count} Trades gefunden',
  'trade-import.preview.date-range': '{start} bis {end}',
  'trade-import.preview.metric.symbols': 'Symbole',
  'trade-import.preview.metric.ready': 'Bereit zum Import',
  'trade-import.preview.metric.duplicates': 'Mögliche Duplikate',
  'trade-import.preview.metric.attention': 'Zu prüfen',
  'trade-import.preview.completed.message': 'Importbereite Trades: {count}.',
  'trade-import.preview.partial.message':
    'Importbereite Trades: {count}. Nicht importierbare Zeilen: {failed}. Übersprungene unvollständige Zeilen: {incomplete}.',
  'trade-import.preview.partial.guidance':
    'Nur die unten angezeigten gültigen Trades werden importiert.',

  'trade-import.preview.failed.message':
    'Aus dieser Datei konnten keine Trades vorbereitet werden.',
  'trade-import.preview.failed.guidance':
    'Prüfe die Spaltenzuordnungen, das Datumsformat, das ausgewählte Blatt und die ausgewählte Header-Zeile sowie die unten aufgeführten ungültigen Werte.',
  'trade-import.preview.tradovate-performance.title':
    'Falscher Tradovate-Bericht',
  'trade-import.preview.tradovate-performance.message':
    'Dies scheint ein Tradovate-Performance-Export zu sein. Journalit importiert den Orders-Bericht, damit deine Ausführungen genau rekonstruiert werden können. Gehe in Tradovate zu Reports > Orders und lade die CSV-Datei herunter.',
  'trade-import.preview.tradovate-performance.guide':
    'Tradovate-Exportanleitung anzeigen',
  'trade-import.preview.metatrader-statement.title':
    'Nicht unterstützter MetaTrader-Kontoauszug',
  'trade-import.preview.metatrader-statement.message':
    'Journalit importiert den originalen MetaTrader-Kontoverlaufsbericht. Stelle MetaTrader auf Englisch, öffne Account History / History, wähle Save as Report und lade anschließend die unveränderte, nicht konvertierte Originaldatei im Format .html oder .htm hoch.',
  'trade-import.preview.metatrader-statement.guide':
    'MetaTrader-Exportanleitung anzeigen',
  'trade-import.preview.tradingview-export.title':
    'Falscher TradingView-Export',
  'trade-import.preview.tradingview-export.message':
    'Journalit erwartet die CSV Order History / History aus TradingView Paper Trading. Verwende nicht Account History, Chart-Daten, Strategie-Exporte oder andere TradingView-CSV-Dateien.',
  'trade-import.preview.tradingview-export.guide':
    'TradingView-Exportanleitung anzeigen',
  'trade-import.source-recovery.title':
    'Diese Datei sieht wie ein {source}-Export aus',
  'trade-import.source-recovery.message':
    'Journalit kann diese Datei direkt mit {source} statt mit {selected} importieren.',
  'trade-import.source-recovery.continue': 'Mit {selected} fortfahren',
  'trade-import.source-recovery.switch': 'Zu {source} wechseln',
  'trade-import.source-recovery.guide': '{source}-Exportanleitung anzeigen',
  'trade-import.source-recovery.metatrader.message':
    'Journalit kann diesen MetaTrader-Kontoauszug direkt importieren, eine Spaltenzuordnung ist nicht nötig.',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    'Die Datei stammt aus DeepCharts, auch wenn das Konto über Rithmic ausgeführt wird. Verwende DeepCharts, damit Long- und Short-Trades korrekt aus der Trade List gelesen werden.',
  'trade-import.source-recovery.deepcharts.manual-message':
    'Verwende den DeepCharts-Importer. Er liest Long und Short aus der vorzeichenbehafteten Quantity oder der Direction-Spalte der Trade List, daher ist keine manuelle Zuordnung nötig.',
  'trade-import.source-recovery.motivewave.title':
    'Diese Datei sieht wie ein MotiveWave-Ausführungsexport aus',
  'trade-import.source-recovery.motivewave.message':
    'Verwende MotiveWave, damit Journalit die Ausführungszeilen korrekt zu abgeschlossenen Trades zusammenführen kann.',
  'quick-import.message.source-mismatch':
    'Journalit hat eine andere Exportquelle erkannt. Prüfe die Datei in Trade Import, um die Quelle ohne erneutes Hochladen zu wechseln.',
  'trade-import.preview.no-eligible':
    'Die Datei wurde erfolgreich eingelesen, aber es gibt keine neuen oder aktualisierten Trades, die importiert werden können. Prüfe unten die Details zu Duplikaten und zur Klassifizierung.',
  'trade-import.pro-gate.title.one': '{count} Trade ist bereit zum Import',
  'trade-import.pro-gate.title.few': '{count} Trades sind bereit zum Import',
  'trade-import.pro-gate.title.many': '{count} Trades sind bereit zum Import',
  'trade-import.pro-gate.title.other': '{count} Trades sind bereit zum Import',
  'trade-import.pro-gate.subtitle':
    'Aktiviere PRO, um sie als Trade-Notizen in deinen Vault zu schreiben.',
  'trade-import.pro-gate.cta': 'PRO aktivieren',
  'trade-import.preview.diagnostics': 'Prüfdetails ({count})',
  'trade-import.preview.affected-rows': 'Betroffene Zeilen: {count}',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Richtung',
  'trade-import.table.entry-time': 'Einstiegszeit',
  'trade-import.table.date': 'Datum',
  'trade-import.table.position': 'Positionsgröße',
  'trade-import.table.result': 'Ergebnis',
  'trade-import.table.quantity': 'Menge',
  'trade-import.table.message': 'Meldung',
  'trade-import.status.new': 'Neu',
  'trade-import.status.already-imported': 'Bereits importiert',
  'trade-import.status.other-account': 'In anderem Konto',
  'trade-import.status.other-account.detail': 'Bereits in {account} importiert',
  'trade-import.status.updates-existing': 'Aktualisiert bestehenden Trade',
  'trade-import.status.possible-duplicate': 'Mögliches Duplikat',
  'trade-import.status.needs-review': 'Zu prüfen',
  'trade-import.status.duplicate-in-file': 'Duplikat in der Datei',
  'trade-import.status.invalid': 'Ungültiger Trade',
  'trade-import.status.no-open-trade': 'Kein offener Trade zum Schließen',
  'trade-import.status.multiple-open-trades': 'Mehrere offene Trades passen',
  'trade-import.status.quantity-mismatch': 'Mengenabweichung',
  'trade-import.server-deletion.deleted':
    'Vom Journalit-Server gelöschte Trades: {count}',
  'trade-import.server-deletion.kept':
    'Behaltene Trades, weil ein anderer Import sie ebenfalls enthält: {count}',
  'trade-import.server-deletion.blocked-broker-connected':
    'Dieses Konto wird über eine Broker-Verbindung synchronisiert. Trenne den Broker, um seine Daten zu löschen.',
  'trade-import.server-deletion.blocked-broker-history':
    'Dieses Konto enthält Broker-Sync-Verlauf und kann hier nicht gelöscht werden. Lösche stattdessen einzelne Importe.',
  'trade-import.server-deletion.failed':
    'Löschen auf dem Journalit-Server fehlgeschlagen. Bitte versuche es erneut.',
  'trade-import.server-deletion.notice':
    'Nach einer Server-Löschung in den Papierkorb verschobene Trade-Notizen: {count}',
  'trade-import.server-deletion.account.title': 'Serverkonto löschen?',
  'trade-import.server-deletion.account.message':
    'Dadurch werden „{account}“ und seine importierten Trades ({count} auf dem Server) dauerhaft vom Journalit-Server gelöscht und ihre Notizen in jedem synchronisierten Vault in den Papierkorb verschoben. Du kannst die Dateien danach erneut importieren.',
  'trade-import.server-deletion.account.confirm': 'Vom Server löschen',
  'trade-import.server-deletion.account.button': 'Vom Server löschen',
  'trade-import.history.title': 'Importverlauf',
  'trade-import.completion.wrong-account': 'In das falsche Konto importiert?',
  'trade-import.completion.undo-import': 'Diesen Import rückgängig machen',
  'trade-import.action.manage-imports': 'Frühere Importe verwalten',
  'trade-import.history.loading': 'Importverlauf wird geladen…',
  'trade-import.history.load-failed':
    'Importverlauf konnte nicht geladen werden.',
  'trade-import.history.empty': 'Noch keine Importe.',
  'trade-import.history.trades-on-server': '{count} auf dem Server',
  'trade-import.history.delete.title': 'Diesen Import löschen?',
  'trade-import.history.delete.message':
    'Dadurch werden die Trades, die dieser Import zu „{account}“ hinzugefügt hat ({count} auf dem Server), dauerhaft vom Journalit-Server gelöscht und ihre Notizen in jedem synchronisierten Vault in den Papierkorb verschoben. Trades, die ein anderer Import ebenfalls enthält, bleiben erhalten. Du kannst die Datei danach erneut importieren.',
  'trade-import.history.delete.confirm': 'Import löschen',
  'trade-import.history.load-more': 'Mehr laden',
  'account.edit.modal.delete.delete-server-trades':
    'Auch die importierten Trades vom Journalit-Server löschen ({count} auf dem Server). Ihre Notizen landen in jedem synchronisierten Vault im Papierkorb, auch wenn du sie hier behältst.',
  'trade-import.preview.other-account.message':
    'Bereits in {account} ({count}), daher werden sie übersprungen.',
  'trade-import.preview.other-account.import-instead':
    'Stattdessen in {account} importieren',
  'trade-import.preview.other-account.undo-earlier':
    'Früheren Import rückgängig machen',
  'trade-import.action.confirm': 'Import bestätigen',
  'trade-import.action.activate-pro.one':
    'PRO aktivieren, um {count} Trade zu importieren',
  'trade-import.action.activate-pro.few':
    'PRO aktivieren, um {count} Trades zu importieren',
  'trade-import.action.activate-pro.many':
    'PRO aktivieren, um {count} Trades zu importieren',
  'trade-import.action.activate-pro.other':
    'PRO aktivieren, um {count} Trades zu importieren',
  'trade-import.action.cancel-preview': 'Vorschau abbrechen',
  'trade-import.broker.manual': 'Manuelle Zuordnung',
  'trade-import.source.title': 'Woher stammen diese Trades?',
  'trade-import.source.subtitle':
    'Wähle die Plattform, aus der du exportiert hast. Journalit liest ihr Dateiformat direkt, ohne Spaltenzuordnung.',
  'trade-import.source.search': 'Broker und Plattformen suchen',
  'trade-import.source.sync-available':
    'Unterstützt auch automatischen Trade Sync',
  'trade-import.source.manual.tile': 'Eigene Tabelle / andere Datei',
  'trade-import.source.manual.title': 'Eigene Tabelle oder andere Datei',
  'trade-import.source.manual.hint':
    'Du ordnest die Spalten deiner Datei den Journalit-Feldern zu.',
  'trade-import.source.native.hint':
    'Das Dateiformat wird automatisch gelesen, keine Zuordnung nötig.',
  'trade-import.source.guide': 'So exportierst du',
  'trade-import.source.change': 'Ändern',
  'trade-import.recovery.rithmic-order-history.title':
    'Nicht unterstütztes Rithmic-Format',
  'trade-import.recovery.rithmic-order-history.message':
    'Lade einen Rithmic-Orderhistorienexport hoch oder wähle die Plattform, die diese Datei erstellt hat.',
  'trade-import.recovery.rithmic-order-history.choose-file':
    'Andere Datei wählen',
  'trade-import.source.change-action': 'Quelle ändern',
  'trade-import.sync-suggestion.full.title':
    '{broker} kann automatisch synchronisieren',
  'trade-import.sync-suggestion.full.body':
    'Trade Sync holt neue Trades selbstständig, ganz ohne Exporte. Du kannst unten trotzdem eine Datei importieren.',
  'trade-import.sync-suggestion.partial.title':
    'Nutzt du {provider}? Synchronisiere stattdessen',
  'trade-import.sync-suggestion.partial.body':
    'Trade Sync holt {provider}-Trades automatisch. Andere Kontoauszüge importierst du weiterhin unten.',
  'trade-import.sync-suggestion.action': 'Trade Sync einrichten',
  'trade-import.sync-suggestion.sync-only.title':
    '{broker} wird über Trade Sync verbunden',
  'trade-import.sync-suggestion.sync-only.body':
    'Kein Export nötig: Trade Sync holt deine {broker}-Trades automatisch. Hast du trotzdem eine {broker}-Datei? Wähle Nicht aufgeführt / eigene Datei.',
  'trade-import.sync-suggestion.action.open': 'Trade Sync öffnen',

  
  'command.open-setups': 'Setups öffnen',
  'setups.create.title': 'Setup erstellen',
  'setups.create.field.name': 'Setup-Name',
  'setups.create.placeholder.name': 'Eröffnungsimpuls',
  'setups.create.field.status': 'Status',
  'setups.create.field.direction': 'Richtung',
  'setups.create.field.color': 'Farbe',
  'setups.create.field.color-description':
    'Wähle eine Farbe, um dieses Setup zu kennzeichnen.',
  'setups.create.profile.heading': 'Bevorzugte Felder',
  'setups.create.profile.optional-label': '(Optional)',
  'setups.create.field.sessions': 'Handelssitzungen',
  'setups.create.field.preferred-sessions-tooltip':
    'Verwalte diese Sitzungen unter Einstellungen → Journal → Sitzungsmodus.',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': 'Zeiteinheiten',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'Ticker',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
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

  'setups.guide.intro.title': 'Willkommen bei Setups',
  'setups.guide.intro.description':
    'Diese Ansicht bündelt Setup-Playbooks, verknüpfte Trades, Notizen, Screenshots und Regeln an einem Ort.',
  'setups.guide.view-tabs.title': 'Setup-Ansichten wechseln',
  'setups.guide.view-tabs.description':
    'Nutze diese Tabs für Überblick, Setup-Paare und Vergleich, wenn genügend Setups vorhanden sind.',
  'setups.guide.overview-chart.title': 'Performance-Rangliste',
  'setups.guide.overview-chart.description':
    'Das Überblicksdiagramm sortiert Setups nach der gewählten Metrik. Mit den Steuerelementen oben rechts wechselst du die Metrik oder fokussierst bestimmte Setups.',
  'setups.guide.tag-filter.title': 'Setups filtern',
  'setups.guide.tag-filter.description':
    'Filtere Karten, Diagramm, Paare und Vergleich nach Setup-Tags oder Richtung. Auswahlen innerhalb einer Gruppe verwenden ODER; Tags und Richtung werden gemeinsam angewendet.',
  'setups.guide.setup-cards.title': 'Setup-Karten',
  'setups.guide.setup-cards.description':
    'Karten fassen jedes Setup mit Kennzahlen, Status, letztem Trade und kleinem Performance-Trend zusammen.',
  'setups.guide.open-detail.title': 'Setup-Seite öffnen',
  'setups.guide.open-detail.description':
    'Wenn du bereit bist, öffne eine Setup-Karte, um ihre Seite zu sehen. Dort erwartet dich ein kurzer Guide.',
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

  'setups.guide.pairs-mode.title': 'Setup-Paare öffnen',
  'setups.guide.pairs-mode.description':
    'Öffne Paare, um zu sehen, welche Kombinationen genügend gemeinsame Trades für einen Vergleich haben.',
  'setups.guide.pairs-chart.title': 'Paar-Rangliste',
  'setups.guide.pairs-chart.description':
    'Der Paarmodus hebt Kombinationen hervor, die zusammen besser oder schlechter funktionieren können. Klicke auf einen Balken, um tiefere Paar-Einblicke zu öffnen.',

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

  'setups.view.open-as-markdown': 'Als Markdown öffnen',
  'setups.view.open-as-setup': 'Als Journalit-Setup öffnen',

  'setups.view.overview.mode.pairs': 'Paare',
  'setups.view.pairs.summary-aria': 'Zusammenfassung der Setup-Paare',
  'setups.view.pairs.best': 'Bestes Paar',
  'setups.view.pairs.worst': 'Schlechtestes Paar',
  'setups.view.pairs.worst-short': 'Schlechtestes',
  'setups.view.pairs.empty': 'Noch keine Setup-Paare mit mindestens 5 Trades.',
  'setups.view.pairs.empty-submessage':
    'Paare erscheinen, sobald zwei Setups genügend gemeinsame verknüpfte Trades haben.',
  'setups.view.pairs.privacy':
    'Die Paar-Performance ist im Privatsphäre-Modus ausgeblendet.',

  'setups.view.pairs.metric-aria': 'Paar-Kennzahl',
  'setups.view.pairs.metric.edge': 'Paar-Vorteil',
  'setups.view.pairs.metric.edge-short': 'edge',
  'setups.view.pairs.metric.expectancy': 'Erwartungswert des Paars',

  'setups.view.pairs.together': 'Zusammen',
  'setups.view.pairs.table.setup-pair': 'Setup-Paar',

  'setups.view.pairs.evidence': 'Belege',
  'setups.view.pairs.edge-comparison': 'Vorteilsvergleich',
  'setups.view.pairs.edge-caption': 'Kombinierter Vorteil: {edge}',
  'setups.view.overview.setup-filter.all': 'Setups: Alle',
  'setups.view.overview.setup-filter.selected': 'Setups: {count} ausgewählt',
  'setups.view.overview.setup-filter.aria': 'Anzuzeigende Setups auswählen',
  'setups.view.overview.setup-filter.select-all': 'Alle auswählen',
  'setups.view.overview.setup-filter.clear': 'Zurücksetzen',

  'setups.view.overview.pnl-chart.dropdown-label': 'Kumuliertes P&L',

  'setups.view.overview.pnl-chart.combined': 'Alle Setups',
  'setups.view.overview.pnl-chart.selected-combined': 'Ausgewählte Setups',

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

  'setups.view.detail.playbook-note-modal.empty':
    'Keine passenden Notizen gefunden.',
  'setups.view.detail.empty-playbook-note':
    'Die verknüpfte Playbook-Notiz ist leer.',
  'setups.view.detail.rules.edit': 'Regeln bearbeiten',

  'setups.view.detail.rules.add': 'Regel hinzufügen',

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

  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': 'Live-R',
  'setups.view.detail.execution-gap.missed-edge': 'Missed Edge',
  'setups.view.detail.execution-gap.live-plus-missed': 'Live + Missed',
  'setups.view.detail.execution-gap.backtest': 'Backtest',

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

  'setups.view.action.retry': 'Erneut versuchen',
  'setups.view.action.compare-selected': 'Ausgewählte vergleichen',
  'setups.view.tab.overview': 'Überblick',
  'setups.view.tab.compare': 'Vergleichen',
  'setups.view.tabs.aria': 'Setup-Ansichten',

  'setups.view.title': 'Setups',

  'setups.view.error.title': 'Setups konnten nicht geladen werden',
  'setups.view.error.load-failed':
    'Setups konnten nicht geladen werden. Versuche es erneut.',
  'setups.view.summary.aria': 'Zusammenfassung der Setups im Überblick',

  'setups.view.summary.needs-review': 'Überprüfung erforderlich',
  'setups.view.summary.best-performer': 'Beste Performance',

  'setups.view.ranking.metric-aria': 'Performance-Kennzahl',
  'setups.view.ranking.privacy':
    'Performance-Werte sind im Privatsphäre-Modus ausgeblendet.',
  'setups.view.ranking.empty': 'Noch keine Setup-Performance-Daten.',

  'setups.view.metric.trade-count': 'Anzahl Trades',
  'setups.view.metric.trades': 'Trades',
  'setups.view.metric.net-pnl': 'Gesamt-P&L',
  'setups.view.metric.total-pnl': 'Gesamt-PnL',
  'setups.view.metric.win-rate': 'Trefferquote',
  'setups.view.metric.profit-factor': 'Profit Factor',
  'setups.view.metric.last-traded': 'Zuletzt gehandelt',
  'setups.view.metric.expected-value': 'Erwartungswert',
  'setups.view.metric.expectancy-r': 'Erwartungswert (R)',

  'setups.view.status.active': 'Aktiv',
  'setups.view.status.testing': 'In Testphase',
  'setups.view.status.archived': 'Archiviert',

  'setups.view.card.select-for-compare': 'Für Vergleich auswählen',
  'setups.view.card.sparkline-aria': 'Setup-Sparkline',
  'setups.view.empty.no-setups':
    'Noch keine Setups. Erstelle dein erstes Setup, um Playbooks zu verfolgen.',

  'setups.view.date.never': 'Nie',
  'setups.view.date.today': 'Heute',
  'setups.view.date.yesterday': 'Gestern',
  'setups.view.compare.title': 'Setups vergleichen',

  'setups.view.compare.empty': 'Wähle zwei Setups zum Vergleichen aus.',
  'setups.view.compare.metrics-title': 'Vergleichskennzahlen',
  'setups.view.compare.metric': 'Kennzahl',
  'setups.view.compare.edge-column': 'Vorteil',
  'setups.view.compare.edge-label': 'Gewinner',

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

  'setups.view.compare.cumulative-title': 'Kumulierte Performance',
  'setups.view.compare.cumulative-privacy':
    'Die kumulierte Performance ist im Privatsphäre-Modus ausgeblendet.',
  'setups.view.compare.cumulative-empty':
    'Keine kumulierten Trade-Daten für die ausgewählten Setups.',

  'setups.view.detail.back': 'Zurück',

  'setups.view.detail.action.edit': 'Setup bearbeiten',
  'setups.view.detail.action.view-trades': 'Im Trade-Log anzeigen',

  'setups.view.detail.playbook': 'Playbook',

  'setups.view.detail.rules': 'Regeln',

  'setups.view.detail.rule.required': 'Erforderlich',

  'setups.view.detail.no-linked-notes': 'Noch keine Notizen verknüpft.',

  'setups.view.detail.performance.cumulative-pnl': 'Kumuliertes PnL',
  'setups.view.detail.performance.cumulative-r': 'Kumuliertes R',
  'setups.view.detail.performance.empty': 'Noch keine Trades verknüpft.',

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

  'trade-import.restore.complete':
    '{written} importierte Trades wiederhergestellt; {failed} fehlgeschlagen.',
  'trade-import.restore.broker-label': 'Backend-Wiederherstellung',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Trade Synchronisierung',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'Synchronisiere Trades aus MetaTrader-Berichten, die über deine FTP-Verbindung hochgeladen wurden.',
  'trade-sync.source.trade-import.description':
    'Stelle Broker-Dateiimporte über mehrere Vaults hinweg wieder her und rekonstruiere fehlende lokale Trade-Notizen.',
  'trade-sync.source.tradovate.description':
    'Synchronize Tradovate trades in the cloud and project them into this vault.',
  'trade-sync.tradovate.status-failed': 'Unable to load Tradovate status.',
  'trade-sync.tradovate.last-sync': 'Letzte Synchronisierung',
  'trade-sync.tradovate.last-projection': 'Letzte Projektion',
  'trade-sync.tradovate.pending-projections':
    '{count} ausstehende Projektion(en)',
  'trade-sync.tradovate.pending-acks': '{count} ausstehende lokale ACK(s)',
  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Rithmic-Trades in der Cloud synchronisieren und in diesen Vault projizieren.',
  'trade-sync.rithmic.plugin-sync-description':
    'Verbinden Sie Rithmic auf Journalit.co und synchronisieren Sie hier, um Ihre neueste Rithmic-Aktivität in diesen Vault zu schreiben.',
  'trade-sync.rithmic.status-failed':
    'Rithmic-Status konnte nicht geladen werden.',
  'trade-sync.rithmic.status.connecting': 'Verbinden',
  'trade-sync.rithmic.status.paused': 'Pausiert',
  'trade-sync.rithmic.status.waiting-for-accounts': 'Warten auf Konten',
  'trade-sync.rithmic.status.reauthorization-required':
    'Erneute Autorisierung auf Journalit.co erforderlich',
  'trade-sync.rithmic.status.error': 'Verbindungsfehler',
  'trade-sync.rithmic.no-connections':
    'Verbinden Sie ein Rithmic-Konto auf Journalit.co, um es hier zu synchronisieren.',
  'trade-sync.rithmic.connect': 'Verbinden',
  'trade-sync.rithmic.manage': 'Auf Journalit.co verwalten',
  'trade-sync.rithmic.system': 'Rithmic-System',
  'trade-sync.rithmic.accounts': 'Konten',
  'trade-sync.rithmic.last-sync': 'Letzte Synchronisierung',
  'trade-sync.rithmic.never': 'Nie',
  'trade-sync.rithmic.job.running': 'Synchronisierung läuft…',
  'trade-sync.rithmic.job.last': 'Letzter Auftrag: {status}',
  'trade-sync.job.status.queued': 'In der Warteschlange',
  'trade-sync.job.status.running': 'Läuft',
  'trade-sync.job.status.succeeded': 'Erfolgreich',
  'trade-sync.job.status.partial': 'Teilweise',
  'trade-sync.job.status.failed': 'Fehlgeschlagen',
  'trade-sync.job.status.cancelled': 'Abgebrochen',
  'trade-sync.job.status.unknown': 'Unbekannt',
  'trade-sync.rithmic.sync-to-vault': 'Synchronisieren',
  'trade-sync.rithmic.syncing': 'Wird synchronisiert…',
  'trade-sync.rithmic.mapping-required':
    'Wählen Sie für jedes synchronisierte Rithmic-Konto ein lokales Vault-Konto.',
  'trade-sync.rithmic.sync-complete-connection':
    'Synchronisierung von {connection} abgeschlossen.',
  'trade-sync.rithmic.sync-partial-connection':
    'Synchronisierung von {connection} mit Problemen abgeschlossen.',
  'trade-sync.rithmic.sync-all': 'Alle synchronisieren',
  'trade-sync.rithmic.sync-all-complete':
    '{succeeded} von {total} Rithmic-Verbindungen synchronisiert.',
  'trade-sync.rithmic.sync-all-partial':
    '{succeeded} von {total} Rithmic-Verbindungen synchronisiert. Überprüfen Sie die Verbindungen mit Problemen.',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic erlaubt nur eine aktive Sitzung. Schließen Sie R|Trader, NinjaTrader oder jede andere Plattform mit diesem Rithmic-Login.',
  'trade-sync.rithmic.error.auto-retry':
    'Journalit versucht es automatisch erneut.',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic hat die gespeicherten Zugangsdaten abgelehnt. Aktualisieren Sie sie auf Journalit.co und versuchen Sie es erneut.',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic verlangt die Unterzeichnung der Marktdatenvereinbarungen in R|Trader. Unterschreiben Sie sie und versuchen Sie es erneut.',
  'trade-sync.rithmic.error.disabled':
    'Die Rithmic-Synchronisierung ist für diese Verbindung deaktiviert. Verwalten Sie sie auf Journalit.co.',
  'trade-sync.rithmic.error.sync-failed':
    'Die Rithmic-Synchronisierung ist fehlgeschlagen. Prüfen Sie die Verbindung auf Journalit.co und versuchen Sie es erneut.',
  'trade-sync.broker.mapping-unsaved-hint':
    'Die Zuordnung wird beim Synchronisieren gespeichert.',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'Nicht gespeicherte Kontoänderungen. Synchronisieren Sie diese Verbindung, um sie zu speichern.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    'Wählen Sie zuerst für jedes synchronisierte Konto ein Journalit-Konto.',
  'trade-sync.broker.sync-all-blocked.running-job':
    'Eine Synchronisierung läuft bereits.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'Keine Verbindung ist bereit zum Synchronisieren.',
  'trade-sync.rithmic.connect-another': 'Weiteres Rithmic-Konto verbinden',
  'trade-sync.rithmic.error.sync-failed-detail':
    'Die Rithmic-Synchronisierung ist fehlgeschlagen: {message}',
  'trade-sync.tradovate.never': 'Nie',

  'trade-sync.import.card.inventory-summary':
    '{accounts} Konto/Konten · {trades} Trade(s)',
  'trade-sync.import.action.check': 'Prüfen',
  'trade-sync.import.more-actions': 'Weitere Aktionen',

  'trade-sync.import.action.open-import': 'Trade Import öffnen',

  'trade-sync.import.action.create-local-account': 'Konto erstellen',

  'trade-sync.import.action.restore-account': 'Wiederherstellen',
  'trade-sync.import.action.restoring': 'Wird wiederhergestellt…',

  'trade-sync.import.pending-acks': '{count} ausstehende ACK(s)',

  'trade-sync.import.empty-accounts':
    'Noch keine gesicherten Trade-Import-Konten gefunden.',
  'trade-sync.import.account.restorable-count': '{count} wiederherstellbar',
  'trade-sync.import.account.synced-count': '{count} synchronisiert',
  'trade-sync.import.account.missing-count': '{count} fehlend',
  'trade-sync.import.account.issue-count': '{count} Problem(e)',
  'notice.error.canonical-trade-type-change':
    'Mit dem Broker synchronisierte Trades können nicht in einen anderen Trade-Typ geändert werden.',
  'trade-sync.import.account.conflict-repair':
    'Doppelte canonicalTradeId-Notizen gefunden. Behalten Sie eine Notiz und entfernen Sie canonicalTradeId aus der doppelten Notiz oder löschen Sie diese. Das Umbenennen der Datei behebt den Konflikt nicht.',
  'trade-sync.import.account.local-account': 'Journalit-Konto',
  'trade-sync.import.notice.restored':
    '{count} importierte Trade(s) wiederhergestellt.',

  'trade-sync.import.notice.sync-cloud-failed':
    'Unable to start cloud synchronization.',
  'trade-sync.import.notice.load-failed':
    'Trade-Import-Sync-Status konnte nicht geladen werden.',
  'trade-sync.import.notice.mapping-failed':
    'Trade-Import-Kontozuordnung konnte nicht gespeichert werden.',
  'trade-sync.import.notice.create-account-failed':
    'Lokales Konto konnte nicht erstellt werden.',
  'trade-sync.import.notice.restore-failed':
    'Trade-Import-Konto konnte nicht wiederhergestellt werden.',
  'trade-sync.rate-limit.action.mapping': 'Kontozuordnung',
  'trade-sync.import.notice.rate-limited':
    '{action}: Zu viele Anfragen. Bitte in {seconds} s erneut versuchen.',
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

  'session-log.lessons.badge': 'LSN',
  'session-log.session-group.outside': 'Außerhalb der Sitzungen',

  'session-log.trade.entered': 'Einstieg',
  'session-log.trade.exited': 'Ausstieg',
  'session-log.trade.size': 'Größe',

  'session-log.status.unclassified': 'unclassified',
  'session-log.action.save': 'Speichern',
  'session-log.action.cancel': 'Abbrechen',

  'session-log.action.classify': 'Classify',
  'session-log.action.edit': 'Bearbeiten',
  'session-log.action.delete': 'Löschen',
  'session-log.action.open-trade': 'Trade öffnen',
  'session-log.preview':
    'Vorschau des Sitzungsprotokolls: Notizen mit Zeitstempel und Trade-Ereignisse erscheinen während der Live-Sitzung hier.',
  'session-log.alert.tag-concentration':
    '{tag} macht {percentage}% der Sitzungsnotizen aus ({count}/{total}). Prüfe vor dem Fortfahren auf Drift.',

  'session-mode.loading': 'Sitzungsmodus wird geladen',

  'session-mode.section.timeline': 'Zeitleiste',
  'session-mode.title.ended': 'Sitzung beendet',

  'session-mode.title.break': 'Sitzungspause',
  'session-mode.title.live': 'Live-Sitzung',
  'session-mode.title.preparation': 'Sitzungsvorbereitung',

  'session-mode.prep.resources': 'Ressourcen',

  'session-mode.action.open-drc-for-date': 'DRC für {date} öffnen',
  'session-mode.ended.helper':
    'Protokolliere deine Trades oder überprüfe den Tag.',
  'session-mode.ended.action.import-trades': 'Trades importieren',
  'session-mode.ended.action.add-trade-manually': 'Trade manuell hinzufügen',
  'session-mode.ended.action.open-drc': 'DRC öffnen',
  'session-log.session-group.unplanned': 'Ungeplant @ {time}',
  'session-mode.unplanned.name': 'Ungeplante Sitzung',
  'session-mode.unplanned.start': 'Ungeplante Sitzung starten',
  'session-mode.unplanned.stop': 'Sitzung beenden',
  'session-mode.unplanned.badge': 'Ungeplant',
  'session-mode.unplanned.status.live':
    'Gestartet {time} · {elapsed} vergangen',
  'session-mode.unplanned.ended.summary':
    'Ungeplante Sitzung · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'Ungeplante Sitzung starten',
  'session-mode.unplanned.modal.description':
    'Du befindest dich außerhalb deiner geplanten Sitzungsfenster. Diese Sitzung wird in deiner Tagesauswertung als ungeplant markiert. Schreibe auf, warum du jetzt handelst.',
  'session-mode.unplanned.modal.reason-label': 'Grund',
  'session-mode.unplanned.modal.reason-placeholder':
    'z. B. FOMC um 14:00, Vormittagssitzung verpasst',
  'session-mode.unplanned.modal.reason-required':
    'Gib vor dem Start einen Grund ein.',
  'session-mode.unplanned.notice.started': 'Ungeplante Sitzung gestartet.',
  'session-mode.unplanned.notice.stopped': 'Ungeplante Sitzung beendet.',
  'session-mode.unplanned.notice.blocked-live':
    'Es läuft bereits eine Sitzung.',
  'session-mode.unplanned.notice.none-running':
    'Es läuft keine ungeplante Sitzung.',
  'session-mode.unplanned.notice.failed':
    'Die ungeplante Sitzung konnte nicht aktualisiert werden. Details in der Konsole.',
  'session-mode.ended.stat.trades': 'Trades',
  'session-mode.ended.stat.notes': 'Notizen',
  'session-mode.ended.stat.gate-checks': 'Gate-Checks',
  'session-mode.waiting.next-session': 'Nächste Sitzung',
  'session-mode.waiting.starts-at': '{session} beginnt um {time}',
  'session-mode.waiting.preparation-opens-in':
    'Vorbereitung öffnet in {remaining}',
  'session-mode.waiting.open-drc': 'DRC öffnen',

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

  'session-mode.unconfigured.title': 'Trading-Zeiten festlegen',
  'session-mode.unconfigured.description':
    'Füge die Zeiten hinzu, zu denen du tatsächlich tradest, damit der Sitzungsmodus automatisch zwischen Vorbereitung, live, Pause und beendet wechseln kann.',
  'session-mode.unconfigured.step.window.title': 'Add a session window',

  'session-mode.unconfigured.step.prep.title': 'Review preparation timing',

  'session-mode.unconfigured.step.gate.title': 'Use the Starter Trade Gate',

  'session-mode.unconfigured.step.log.title': 'Log notes during live sessions',

  'session-mode.unconfigured.action': 'Sitzungsmodus konfigurieren',
  'session-mode.guide.why.title': 'Handle deinen Plan, nicht deine Stimmung',
  'session-mode.guide.why.description':
    'Der Session-Modus bereitet dich vor jeder Session vor, hält dich mit einem Trade Gate an deine Regeln, während sie läuft, und führt ein Protokoll mit Zeitstempeln, damit du den Tag nachspielen kannst. Die Einrichtung dauert zwei Minuten.',
  'session-mode.guide.configure.title': 'Jetzt einrichten',
  'session-mode.guide.configure.description':
    'Trage deine Session-Zeiten ein und baue dein erstes Trade Gate. Ein kurzer Rundgang begleitet dich in den Einstellungen.',
  'session-mode.guide.preparation.countdown.title': 'Deine Session steht bevor',
  'session-mode.guide.preparation.countdown.description':
    'Das ist die Vorbereitungsphase. Der Countdown zeigt, wann du live gehst, und diese Seite wechselt von selbst in den Live-Modus.',
  'session-mode.guide.preparation.goals.title': 'Ziele für heute setzen',
  'session-mode.guide.preparation.goals.description':
    'Schreib vor der Eröffnung auf, wie eine gute Session aussieht, damit du dich an etwas messen kannst.',
  'session-mode.guide.preparation.checklist.title': 'Checkliste abarbeiten',
  'session-mode.guide.preparation.checklist.description':
    'Hake hier deine Routine vor der Session ab. Alles, was du abhakst, wird in der heutigen Review-Notiz gespeichert.',
  'session-mode.guide.preparation.next.title': 'Wenn du live gehst',
  'session-mode.guide.preparation.next.description':
    'Dein Trade Gate und das Session-Log erscheinen hier. Beim ersten Mal zeigen wir dir beides.',
  'session-mode.guide.live.trade-gate.title':
    'Vor jedem Trade das Trade Gate durchlaufen',
  'session-mode.guide.live.trade-gate.description':
    'Drücke Start und beantworte die Fragen aus deinen Kriterien. Das Gate endet mit grünem Licht, warten oder kein Trade, sodass du nur Trades nimmst, die dein System erlaubt.',
  'session-mode.guide.live.session-log.title':
    'Notiere, was du siehst und fühlst',
  'session-mode.guide.live.session-log.description':
    'Halte Setups, Emotionen und Entscheidungen fest, während sie passieren. Jede Notiz hat einen Zeitstempel, sodass du später genau nachvollziehen kannst, was los war.',
  'session-mode.guide.live.settings.title': 'Jederzeit anpassen',
  'session-mode.guide.live.settings.description':
    'Bearbeiten öffnet die Session-Modus-Einstellungen: Session-Zeiten, Phasen-Layout, Trade-Gate-Workflows und Log-Tags.',
  'session-mode.guide.ended.review.title': 'Jetzt die Session reviewen',
  'session-mode.guide.ended.review.description':
    'Öffne das heutige DRC zum Review. Füge das Session-Log-Widget zu deinem DRC-Layout hinzu, und jede Notiz mit Zeitstempel erscheint dort.',
  'settings.session-mode.guide.setting-name': 'Rundgang',
  'settings.session-mode.guide.setting-desc':
    'Eine kurze Tour durch diese Einstellungen, von den Session-Zeiten bis zu deinem ersten Trade Gate.',
  'settings.session-mode.guide.replay': 'Guide anzeigen',
  'settings.session-mode.guide.intro.title':
    'Richten wir den Session-Modus ein',
  'settings.session-mode.guide.intro.description':
    'Vier Dinge: wann deine Sessions laufen, was jede Phase zeigt, dein Trade Gate und deine Session-Log-Tags.',
  'settings.session-mode.guide.lead-time.title': 'Vorlaufzeit der Vorbereitung',
  'settings.session-mode.guide.lead-time.description':
    'Wie viele Minuten vor einer Session die Vorbereitungsphase öffnet.',
  'settings.session-mode.guide.windows.title':
    'Füge deine Session-Fenster hinzu',
  'settings.session-mode.guide.windows.description':
    'Ein Fenster pro Session, die du handelst, mit Name, Start und Ende. Daran erkennt der Session-Modus, wann vorbereitet wird und wann du live bist.',
  'settings.session-mode.guide.layout.title': 'Wähle, was jede Phase zeigt',
  'settings.session-mode.guide.layout.description':
    'Schalte Module pro Phase ein oder aus: Ressourcen, Ziele und Checkliste für die Vorbereitung; Trade Gate und Session-Timeline im Live-Betrieb.',
  'settings.session-mode.guide.trade-gate.title': 'Baue dein Trade Gate',
  'settings.session-mode.guide.trade-gate.description':
    'Hinzufügen erstellt beim ersten Mal einen Starter-Workflow aus gängigen Fragen, danach einen leeren; die Bibliothek enthält fertige Fragen. Jede Frage führt zur nächsten oder zu einem Ergebnis: grünes Licht, warten oder kein Trade.',
  'settings.session-mode.guide.editor.title': 'Fragen und Ergebnisse',
  'settings.session-mode.guide.editor.description':
    'Klappe einen Workflow auf, um Fragen hinzuzufügen und festzulegen, wohin jede Antwort führt. Die Abspielen-Schaltfläche führt ihn genau so aus wie in der Session.',
  'settings.session-mode.guide.tags.title': 'Tags für dein Session-Log',
  'settings.session-mode.guide.tags.description':
    'Tagge Notizen beim Protokollieren, etwa nach Emotion oder Setup, damit du sie im Review filtern kannst.',
  'settings.session-mode.guide.finish.title': 'Fertig',
  'settings.session-mode.guide.finish.description':
    'Öffne den Session-Modus über die Leiste oder Home. Füge das Session-Log-Widget zu deinem DRC-Layout hinzu, um deine Notizen in jedem Review zu sehen.',

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

  'settings.session-mode.add-window-short': 'Hinzufügen',
  'settings.session-mode.no-windows':
    'Noch keine Sitzungsfenster konfiguriert. Die Live-Zeitleiste funktioniert weiterhin, aber phasenbasierte Vorbereitung beginnt nach dem Hinzufügen eines Fensters.',
  'settings.session-mode.layout.title': 'Phase layout',

  'settings.session-mode.layout.phase-desc.preparation':
    'Choose what appears during pre-session preparation before trading starts.',
  'settings.session-mode.layout.phase-desc.live':
    'Choose what appears while a configured trading session is live.',

  'settings.session-mode.layout.phase-desc.ended':
    'Choose what appears after all configured trading sessions have ended.',
  'settings.session-mode.layout.reset-phase': 'Reset',

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
  'settings.session-mode.session-log': 'Sitzungsprotokoll',
  'settings.session-mode.session-log-desc':
    'Wähle aus, welche automatischen Ereignisse neben deinen Sitzungsnotizen angezeigt werden.',
  'settings.session-mode.show-trade-executions':
    'Trade-Einstiege und -Ausstiege',
  'settings.session-mode.show-trade-executions-desc':
    'Trade-Einstiege und -Ausstiege in den Protokollen von Sitzungsmodus und Tagesreview anzeigen.',
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

  'settings.session-mode.window-name': 'Sitzungsname',
  'settings.session-mode.window-name-placeholder': 'z. B. NY AM',

  'settings.session-mode.start-time': 'Startzeit',
  'settings.session-mode.end-time': 'Endzeit',

  'trade-gate.workflow': 'Workflow',

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
  'settings.session-mode.trade-gate.delete-workflow.title':
    'Trade-Gate-Ablauf löschen?',
  'settings.session-mode.trade-gate.delete-workflow.message':
    '„{name}“ löschen? Dadurch werden alle Fragen und Zweige dieses Ablaufs entfernt. Diese Aktion kann nicht rückgängig gemacht werden.',
  'settings.session-mode.trade-gate.delete-workflow.confirm': 'Ablauf löschen',
  'settings.session-mode.trade-gate.name': 'Workflow-Name',
  'settings.session-mode.trade-gate.edit-question': 'Frage bearbeiten',
  'settings.session-mode.trade-gate.no-options':
    'Füge Antwortoptionen für diese Frage hinzu.',
  'settings.session-mode.trade-gate.not-wired': 'Noch nicht verbunden',
  'settings.session-mode.trade-gate.not-wired-hint': 'Zum Verbinden klicken',
  'settings.session-mode.trade-gate.target-group-questions': 'Fragen',
  'settings.session-mode.trade-gate.target-current': 'Aktuell: {title}',
  'settings.session-mode.trade-gate.target-group-outcomes': 'Ergebnisse',
  'settings.session-mode.trade-gate.new-question-target': '+ Neue Frage',
  'settings.session-mode.trade-gate.outcome-note':
    'Ergebnisnotiz (nur für diesen Zweig)',
  'settings.session-mode.trade-gate.remove-from-workflow':
    'Aus diesem Ablauf entfernen',
  'settings.session-mode.trade-gate.used-in-workflows':
    'In Abläufen verwendet: {count}',
  'settings.session-mode.trade-gate.not-used': 'Noch nicht verwendet',
  'settings.session-mode.trade-gate.question-count': 'Fragen: {count}',
  'settings.session-mode.trade-gate.library-title': 'Fragenbibliothek',
  'settings.session-mode.trade-gate.library-search': 'Fragen suchen…',
  'settings.session-mode.trade-gate.library-empty':
    'Keine Fragen gefunden. Erstelle eine, um zu beginnen.',
  'settings.session-mode.trade-gate.delete-question.title': 'Frage löschen?',
  'settings.session-mode.trade-gate.delete-question.message':
    '„{name}“ aus der Fragenbibliothek löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
  'settings.session-mode.trade-gate.delete-question.message-used':
    '„{name}“ aus der Fragenbibliothek löschen? Die Frage wird verwendet in: {workflows}. Die Zweige in diesen Abläufen werden entfernt. Diese Aktion kann nicht rückgängig gemacht werden.',
  'settings.session-mode.trade-gate.delete-question.confirm': 'Frage löschen',
  'settings.session-mode.trade-gate.unplaced-title':
    'In diesem Ablauf noch nicht verbunden',
  'settings.session-mode.trade-gate.no-start':
    'Wähle eine Startfrage, um den Ablauf zu sehen.',
  'settings.session-mode.trade-gate.untitled': 'Unbenannter Ablauf',
  'settings.session-mode.trade-gate.start-node': 'Startfrage',
  'settings.session-mode.trade-gate.simulation.show': 'Simulieren',
  'settings.session-mode.trade-gate.simulation.unavailable':
    'Verbinde die Startfrage mit mindestens einem vollständigen Ergebnis, bevor du die Simulation startest.',
  'settings.session-mode.trade-gate.add-question': 'Frage hinzufügen',
  'settings.session-mode.trade-gate.question': 'Frage',
  'settings.session-mode.trade-gate.new-question-title': 'Neue Frage',
  'settings.session-mode.trade-gate.question-title': 'Fragentitel',
  'settings.session-mode.trade-gate.prompt': 'Prompt',
  'settings.session-mode.trade-gate.options': 'Optionen',
  'settings.session-mode.trade-gate.option': 'Option',
  'settings.session-mode.trade-gate.option-label': 'Optionsbezeichnung',
  'settings.session-mode.trade-gate.option-target': 'Führt zu',
  'settings.session-mode.trade-gate.flow-map': 'Ablaufkarte',
  'settings.session-mode.trade-gate.flow-fit': 'Einpassen',
  'settings.session-mode.trade-gate.flow-click-hint':
    'Klicke auf einen Knoten oder eine Pfadbeschriftung, um ihn zu bearbeiten.',
  'settings.session-mode.trade-gate.flow-truncated':
    'Dieser Ablauf ist zu groß für die vollständige Anzeige. Einige wiederholte Zweige sind ausgeblendet.',
  'settings.session-mode.trade-gate.no-questions':
    'Füge die erste Frage hinzu, um diesen Ablauf zu beginnen.',
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

  'imageGallery.open-source': 'Notiz öffnen',
  'imageGallery.image-alt': '{source}-Medium vom {date}',
  'imageGallery.privacy-blurred': 'Aus Datenschutzgründen verwischt',

  'imageGallery.sort.label': 'Sortieren:',
  'imageGallery.sort.newest': 'Neueste',
  'imageGallery.sort.oldest': 'Älteste',
  'imageGallery.sort.best': 'Bestes P&L',
  'imageGallery.sort.worst': 'Schlechtestes P&L',
  'imageGallery.size-aria': 'Mediengröße der Galerie',
  'imageGallery.size.small': 'Klein',
  'imageGallery.size.medium': 'Mittel',
  'imageGallery.size.large': 'Groß',
  'imageGallery.view-mode-aria': 'Gruppierung der Galerie-Karten',
  'imageGallery.view-mode.grouped': 'Gruppiert',
  'imageGallery.view-mode.individual': 'Einzeln',
  'imageGallery.group.additional-media': '{count} zusätzliche Medienelemente',
  'imageGallery.group.annotation-summary':
    '{annotated} von {total} Medienelementen annotiert',
  'imageGallery.group.navigation':
    'Medien {mediaCurrent} von {mediaTotal} · Eintrag {groupCurrent} von {groupTotal}',
  'imageGallery.source.label': 'Quelle:',
  'imageGallery.source.all': 'Alle Medien',
  'imageGallery.source.trade': 'Trades',
  'imageGallery.source.folder': 'Ordner',
  'imageGallery.source.reviews': 'Reviews',
  'imageGallery.source.drc': 'Tägliche Reviews',
  'imageGallery.source.weekly': 'Wöchentliche Reviews',
  'imageGallery.source.monthly': 'Monatliche Reviews',
  'imageGallery.source.quarterly': 'Quartals-Reviews',
  'imageGallery.source.yearly': 'Jährliche Reviews',

  'imageGallery.annotation.reviewed': 'Überprüft',
  'imageGallery.annotation.unreviewed': 'Nicht überprüft',
  'imageGallery.date.unknown': 'Unbekanntes Datum',
  'imageGallery.annotation.tag': 'Tag',

  'imageGallery.annotation.editor-title': 'Medium annotieren',
  'imageGallery.annotation.editor-title-with-file': '{fileName} annotieren',
  'imageGallery.annotation.tags': 'Tags',
  'imageGallery.annotation.tags-placeholder': 'Breakout, A+ Setup, Fehler',
  'imageGallery.annotation.notes': 'Notizen',
  'imageGallery.annotation.notes-placeholder':
    'Was soll dein zukünftiges Ich aus diesem Chart lernen?',
  'imageGallery.annotation.error.save-failed':
    'Medienannotation konnte nicht gespeichert werden.',
  'imageGallery.annotation.error.load-failed':
    'Medienannotation konnte nicht geladen werden.',
  'imageGallery.annotation.saving': 'Speichern...',
  'settings.gallery-folders.section': 'Mediengalerie',
  'settings.gallery-folders.description':
    'Medien aus diesen Ordnern in der Trade-Log-Galerie anzeigen.',
  'settings.gallery-folders.placeholder': 'Ordner auswählen...',
  'settings.gallery-folders.add': 'Hinzufügen',
  'settings.gallery-folders.remove-aria': 'Galerieordner {path} entfernen',
  'settings.gallery-folders.not-a-folder':
    'Wähle einen Ordner statt einer Mediendatei aus.',
  'settings.gallery-folders.save-failed':
    'Galerieordner konnten nicht gespeichert werden. Bitte versuche es erneut.',
  'tradelog.guide.gallery-grouping.title':
    'Medien nach Journaleintrag gruppieren',
  'tradelog.guide.gallery-grouping.description':
    'Gruppiert zeigt jeden Trade oder jedes Review in einer Karte. Einzeln zeigt jedes angehängte Medienelement als eigene Karte.',
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
    'Das Filtermenü funktioniert hier genauso. Im Galeriemodus enthält es zusätzlich einen Galerie-Bereich mit Medienfiltern wie Anmerkungsstatus und Medien-Tags.',
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
  'filter.menu.whats-new.open.title': 'Filter haben ein neues Menü',
  'filter.menu.whats-new.open.description':
    'Alle Filter liegen jetzt in einem mehrstufigen Menü, mit zwei neuen Möglichkeiten, Ihre Trades einzugrenzen. Öffnen Sie es, um sie zu sehen.',
  'filter.menu.whats-new.exclude.title': 'Ausschließen, was Sie nicht wollen',
  'filter.menu.whats-new.exclude.description':
    'Jeder Wert hat eine ⊘-Schaltfläche. Wenn Sie einen Wert ausschließen, fällt jeder Trade mit diesem Wert weg, egal was er sonst erfüllt.',
  'filter.menu.whats-new.match.title': 'Festlegen, wie mehrere Werte passen',
  'filter.menu.whats-new.match.description':
    'Wenn Sie mehrere Werte wählen, legen Sie fest, ob ein Trade „Beliebige davon“, „Alle davon“, „Nur diese“ oder „Genau diese“ braucht. Tags, Setups, Fehler und benutzerdefinierte Felder haben alle diese Option „Abgleich“.',
  'filter.menu.whats-new.phases.title': 'Nach Challenge-Phase filtern',
  'filter.menu.whats-new.phases.description':
    'Prop-Konten mit mehr als einer Phase öffnen eine Liste ihrer Phasen. Wählen Sie einzelne Phasen statt des ganzen Kontos.',
  'filter.menu.whats-new.done.title': 'Das ist neu bei den Filtern',
  'filter.menu.whats-new.done.description':
    'Dasselbe Menü gibt es im Trade-Log, im Dashboard, auf der Startseite, bei Setups und in Reviews. Änderungen gelten sofort beim Klicken.',
  'tradelog.guide.image-gallery-empty.intro.title': 'Noch keine Medien',
  'tradelog.guide.image-gallery-empty.intro.description':
    'Füge Bilder, GIFs, Videos oder YouTube-Links zu Trades oder Review-Notizen hinzu, dann erscheinen sie hier automatisch. Sobald Medien vorhanden sind, zeigt Journalit die vollständige Galerie-Anleitung für Vollbildprüfung, Tags und Notizen.',

  'filter.modal.section.image-gallery': 'Galerie',
  'filter.modal.session-tags.placeholder': 'Sitzungs-Tags',
  'filter.modal.session-tags.none-found': 'Keine Sitzungs-Tags gefunden',
  'account.challenge.toggle.label': 'Prop-Firmen-Prüfung',
  'account.challenge.toggle.help':
    'Verfolge Prüfungsphasen, Firmenregeln und Auszahlungen für dieses Konto.',
  'account.prop-challenge.title': 'Prop-Firmen-Prüfung',
  'account.prop-challenge.identity': 'Challenge-Details',
  'account.prop-challenge.prefill.heading-link': 'Von deiner Firma vorbefüllen',
  'account.prop-challenge.prefill.updates-link': 'Firmenregeln aktuell halten',
  'account.prop-challenge.prefill.updates-link-firm':
    '{firm}-Regeln aktuell halten',
  'account.prop-challenge.prefill.phase-link': 'Regeln mit PRO vorausfüllen',
  'account.prop-challenge.prefill.phase-link-firm':
    'Regeln von {firm} mit PRO vorausfüllen',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} weitere, Regeln mit PRO vorbefüllt',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, Regeln mit PRO vorbefüllt',
  'account.prop-challenge.prefill.match':
    'Wir haben {firm}: {count} Challenges mit fertigen Regeln',
  'account.prop-challenge.rules.empty':
    'Noch keine Regeln hinzugefügt. Verwende Regel hinzufügen, um diese Phase zu definieren.',
  'account.prop-challenge.rules': 'Regeln',
  'account.prop-challenge.costs.empty': 'Noch keine Kosten hinzugefügt.',
  'account.prop-challenge.description':
    'Mehrphasige Prop-Firm-Challenge für dieses Konto verfolgen.',
  'account.prop-challenge.enable': 'Prop-Challenge-Tracking aktivieren',
  'account.prop-challenge.challenge-name': 'Prüfungsname',
  'account.prop-challenge.challenge-name-placeholder': 'z. B. 25K-Prüfung',
  'account.prop-challenge.firm-name': 'Firmenname (optional)',
  'account.prop-challenge.firm-name-placeholder': 'z. B. Apex Trader Funding',
  'account.prop-challenge.profile.title': 'Firmenregeln anwenden',
  'account.prop-challenge.profile.firm': 'Firma',
  'account.prop-challenge.profile.challenge': 'Prüfung',
  'account.prop-challenge.profile.choose-firm': 'Firma wählen',
  'account.prop-challenge.profile.choose-challenge': 'Prüfung wählen',
  'account.prop-challenge.profile.custom-firm': 'Andere / eigene Firma',
  'account.prop-challenge.profile.help':
    'Wähle deine Firma und deinen Plan, um ihre Regeln auszufüllen: Drawdown, Ziele, Auszahlungen. Du kannst sie danach bearbeiten.',
  'account.prop-challenge.profile.current': 'Aktuell: {identity}',
  'account.prop-challenge.profile.apply': 'Anwenden',
  'account.prop-challenge.profile.loading': 'Firmenregeln werden geladen…',
  'account.prop-challenge.profile.refreshing':
    'Suche nach Regelaktualisierungen…',
  'account.prop-challenge.profile.unavailable':
    'Firmenregeln sind offline nicht verfügbar.',

  'account.prop-challenge.profile.confirm-title':
    'Challenge-Einrichtung ersetzen?',
  'account.prop-challenge.profile.confirm-message':
    'Das Anwenden dieser Firmenregeln ersetzt die aktuell eingerichteten Phasen und Regeln.',
  'account.prop-challenge.current-phase': 'Aktuelle Phase',
  'account.prop-challenge.phase-rules': 'Regeln für {phase}',
  'account.prop-challenge.next-phase': 'Als Nächstes: {phase}',
  'account.prop-challenge.view-phase': 'Phase anzeigen',
  'account.prop-challenge.unnamed-phase': 'Unbenannte Phase',
  'account.prop-challenge.phase-name': 'Phasenname',
  'account.prop-challenge.phase-type': 'Phasentyp',
  'account.prop-challenge.phase-type.evaluation': 'Bewertung',
  'account.prop-challenge.phase-type.verification': 'Verifizierung',
  'account.prop-challenge.phase-type.sim_funded': 'Simuliert finanziert',
  'account.prop-challenge.phase-type.live_funded': 'Live finanziert',
  'account.prop-challenge.phase-type.custom': 'Benutzerdefiniert',
  'account.prop-challenge.starting-balance': 'Startguthaben',
  'account.prop-challenge.broker-account-id': 'Brokerkonten',
  'account.prop-challenge.broker-accounts.assigned': 'Zugewiesen zu {phase}',
  'account.prop-challenge.broker-accounts.trades': '{count} Abschlüsse',
  'account.prop-challenge.broker-accounts.trade-one': '1 Trade',
  'account.prop-challenge.phase-started': 'Gestartet',
  'account.prop-challenge.phase-completed': 'Abgeschlossen',
  'account.prop-challenge.timeline.completed-before-started':
    'Abschluss muss für {phase} auf oder nach dem Start liegen.',
  'account.prop-challenge.timeline.out-of-order':
    '{phase} muss enden, bevor oder wenn {next} beginnt.',
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} beginnt nach einer späteren Regeländerung. Start zurücksetzen.',
  'account.prop-challenge.default-phase-name': 'Phase Nr. {number}',
  'account.prop-challenge.add-phase': 'Phase hinzufügen',
  'account.prop-challenge.remove-phase': 'Phase entfernen',
  'account.prop-challenge.add-rule': 'Regel hinzufügen',
  'account.prop-challenge.rule.enabled': 'Regel aktiviert',
  'account.prop-challenge.rule.amount': 'Betrag',
  'account.prop-challenge.rule.target-type': 'Zieltyp',
  'account.prop-challenge.rule.credit-withdrawals':
    'Auszahlungen auf das Ziel anrechnen',
  'account.prop-challenge.rule.drawdown-mode': 'Drawdown-Modus',
  'account.prop-challenge.rule.lock-at-balance': 'Sperrsaldo',
  'account.prop-challenge.rule.daily-loss-model': 'Täglicher Verlustbetrag',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'Fester Betrag',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'Erhöht sich ab Kontogewinnschwelle',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    'Skaliert mit dem höchsten EOD-Gewinn',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    'Verwendet das feste Limit, bis das Konto mit dem Aktivierungssaldo schließt. Ab dem nächsten Handelstag entspricht das Limit dem konfigurierten Prozentsatz des höchsten Tagesendgewinns und sinkt nicht mehr.',
  'account.prop-challenge.rule.scale-at-balance': 'Aktivierungssaldo',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    'Höchster EOD-Gewinn als Limit (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    '{value} des höchsten EOD-Gewinns',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    'Gewinnstufen aus dem vorherigen EOD-Saldo',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    'Gewinnstufen nach vorherigem EOD',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    'Kommagetrennte Paare Gewinn:Verlustlimit eingeben. Die gewählte Gewinnbasis zum vorherigen Handelstagesschluss bestimmt das Limit des nächsten Tages; es kann steigen oder fallen.',
  'account.prop-challenge.rule.loss-tiers': 'Gewinnstufen und Verlustlimits',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'Das angepasste Geldlimit wird dauerhaft aktiv, sobald der kumulierte realisierte Handelsgewinn dieser Phase den konfigurierten Prozentsatz ihres Startsaldos erreicht.',
  'account.prop-challenge.rule.help.target-amount':
    'Absolute Ziele verwenden die Kontowährung; Prozentziele den Startsaldo dieser Phase. Der Fortschritt verwendet den Saldozuwachs nach einem täglichen Gewinnanrechnungslimit, ohne unrealisierten P&L.',
  'account.prop-challenge.rule.help.credit-withdrawals':
    'Addiert erfasste Bruttoauszahlungen zum Fortschritt absoluter Ziele. Ändert weder den Saldo noch die Auszahlungsberechtigung.',
  'account.prop-challenge.rule.help.drawdown-amount':
    'Geldabstand unter dem Startsaldo (statisch) oder dem Höchststand des realisierten Saldos (nachlaufend). Das Berühren der Untergrenze verletzt die Regel.',
  'account.prop-challenge.rule.help.drawdown-mode':
    'Statisch hält die Untergrenze fest. EOD-Trailing folgt den Höchstständen zum Handelstagesschluss; Intraday-Trailing folgt realisierten Saldotransaktionen, nicht unrealisiertem Eigenkapital.',
  'account.prop-challenge.rule.help.lock-balance':
    'Obergrenze für die nachlaufende Drawdown-Untergrenze, kein Aktivierungssaldo. Die Untergrenze steigt nur bis zu diesem Saldo. Leer bedeutet keine Obergrenze.',
  'account.prop-challenge.rule.help.daily-loss-amount':
    'Geldlimit des schlimmsten kumulierten realisierten Nettoverlusts aus Trades innerhalb eines Handelstages, nicht des Rückgangs vom Tageshoch. Berühren des Limits verletzt die Regel.',
  'account.prop-challenge.rule.help.breach-action':
    'Konto scheitern lassen hält einen früheren Verstoß aktiv. Pause bis zur nächsten Sitzung gilt nur für den aktuellen Handelstag; frühere Verstöße bleiben im Verlauf.',
  'account.prop-challenge.rule.help.daily-loss-model':
    'Wähle ein festes Limit, eine dauerhafte Änderung ab Gewinnschwelle, Skalierung nach höchstem EOD-Gewinn oder vorherige EOD-Gewinnstufen. Die bedingten Felder konfigurieren das Modell.',
  'account.prop-challenge.rule.help.profit-basis':
    'Kumulierter Handelsgewinn schließt Cashflows aus. Aktueller Kontogewinn enthält sie, sodass Auszahlungen ihn verringern. Beide verwenden frühere Handelstagesschlusswerte.',
  'account.prop-challenge.rule.help.position-model':
    'Wähle ein festes Limit je Trade, einen zusätzlichen Kontrakt je Gewinnschritt oder ausdrückliche Gewinnstufen. Die Skalierung verwendet frühere Handelstagesschlusswerte.',
  'account.prop-challenge.rule.help.max-contracts':
    'Maximale Größe je Trade nach optionaler Micro-Umrechnung, nicht die Gesamtexposition mehrerer Trades. Überschreiten verletzt die Regel.',
  'account.prop-challenge.rule.help.initial-contracts':
    'Anfängliches Kontraktlimit je Trade, bevor abgeschlossene Tagesgewinne größere Limits ermöglichen.',
  'account.prop-challenge.rule.help.maximum-contracts':
    'Optionale Obergrenze für gewinnabhängige Kontrakterhöhungen. Leer bedeutet keine zusätzliche Obergrenze.',
  'account.prop-challenge.rule.help.daily-profit':
    'Geldschwelle für den täglichen realisierten Netto-P&L einschließlich Gewinnen, Verlusten und Kosten. Unrealisierter Gewinn und Cashflows zählen nicht.',
  'account.prop-challenge.rule.help.consistency-cushion':
    'Wird in Prozentpunkten zum maximalen Anteil des besten Tages addiert: 30% + 5 Punkte erlaubt 35%. Leer fügt keinen Puffer hinzu.',
  'account.prop-challenge.rule.help.daily-profit-cap':
    'Geldlimit des je Handelstag auf das Phasenziel angerechneten Gewinns. Der Überschuss bleibt im Saldo; Verluste zählen vollständig.',
  'account.prop-challenge.rule.help.live-review':
    'Realisierter Nettogewinn, den ein Handelstag für die Prüfberechtigung erreichen muss. Wechselt nicht automatisch die Phase und gewährt kein Live-Konto.',
  'account.prop-challenge.rule.profit-threshold-percent':
    'Kontogewinnschwelle (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'Täglicher Verlustbetrag nach Schwelle',
  'account.prop-challenge.rule.breach-action': 'Verhalten bei Überschreitung',
  'account.prop-challenge.rule.breach-action.hard': 'Konto nicht bestanden',
  'account.prop-challenge.rule.breach-action.soft':
    'Bis zur nächsten Sitzung pausieren',
  'account.prop-challenge.rule.days': 'Handelstage',
  'account.prop-challenge.rule.minimum-daily-profit': 'Mindestgewinn pro Tag',
  'account.prop-challenge.rule.minimum-daily-profit-summary':
    '{value}+ pro Tag',
  'account.prop-challenge.rule.best-day-percent': 'Maximaler bester Tag (%)',
  'account.prop-challenge.rule.position-limit-model':
    'Modell für Positionslimit',
  'account.prop-challenge.rule.position-limit-model.fixed': 'Festes Limit',
  'account.prop-challenge.rule.position-limit-model.eod-profit-tiers':
    'EOD-Gewinnstufen',
  'account.prop-challenge.rule.position-profit-basis':
    'Gewinnbasis für Positionsskalierung',
  'account.prop-challenge.rule.position-profit-basis.cumulative':
    'Kumulierter Handelsgewinn (Auszahlungen reduzieren nicht)',
  'account.prop-challenge.rule.position-profit-basis.current-account':
    'Aktueller Kontogewinn (Auszahlungen reduzieren)',
  'account.prop-challenge.rule.position-limit-model.eod-profit':
    'Skaliert mit EOD-Gewinn',
  'account.prop-challenge.rule.position-tiers': 'Gewinnstufen',
  'account.prop-challenge.rule.position-tiers-help':
    'Gib jede erreichte EOD-Gewinnschwelle und das neue Kontraktlimit als Gewinn:Kontrakte ein, durch Kommas getrennt. Eine Stufe gilt ab dem nächsten Handelstag.',
  'account.prop-challenge.rule.position-scaling-help':
    'Jede erreichte Gewinnstufe erhöht die Anzahl der Kontrakte ab dem nächsten Handelstag um eins, bis zum Maximum.',
  'account.prop-challenge.rule.initial-contracts': 'Anfängliche Kontrakte',
  'account.prop-challenge.rule.profit-per-contract':
    'EOD-Gewinn pro zusätzlichem Kontrakt',
  'account.prop-challenge.rule.maximum-contracts':
    'Maximale Kontrakte nach Skalierung',
  'account.prop-challenge.rule.micros-per-contract':
    '10 Micros als 1 Kontrakt zählen',
  'account.prop-challenge.rule.micros-per-contract-help':
    'Aktivieren, wenn deine Firma Micro-Futures (MES, MNQ, MGC, ...) für dieses Limit als ein Zehntel eines Standardkontrakts zählt. Deaktiviert lassen, wenn jeder Micro als voller Kontrakt zählt.',
  'account.prop-challenge.rule.max-contracts': 'Maximale Kontrakte',
  'account.prop-challenge.rule.profit_target': 'Gewinnziel',
  'account.prop-challenge.rule.drawdown': 'Verlustgrenze',
  'account.prop-challenge.rule.daily_loss_limit': 'Tägliches Verlustlimit',
  'account.prop-challenge.rule.live_review_daily_profit':
    'Tagesgewinn für Live-Prüfung',
  'account.prop-challenge.rule.best-profitable-day': 'Gewinnschwelle pro Tag',
  'account.prop-challenge.rule.daily_profit_cap':
    'Tägliche Gewinnanrechnungsgrenze',
  'account.prop-challenge.rule.per-trading-day': 'Pro Handelstag',
  'account.prop-challenge.rule.minimum_trading_days': 'Mindesthandelstage',
  'account.prop-challenge.rule.minimum_profitable_days':
    'Mindestanzahl profitabler Tage',
  'account.prop-challenge.rule.consistency-cushion-percent':
    'Konsistenzpuffer (Prozentpunkte)',
  'account.prop-challenge.rule.consistency-cushion-short': 'Puffer',
  'account.prop-challenge.rule.consistency': 'Konsistenz',
  'account.prop-challenge.rule.max_position_size': 'Maximale Positionsgröße',
  'account.prop-challenge.drawdown.static': 'Statisch',
  'account.prop-challenge.drawdown.eod-trailing': 'EOD nachlaufend',
  'account.prop-challenge.drawdown.intraday-trailing': 'Intraday nachlaufend',
  'account.prop-challenge.summary.status.active': 'Aktiv',
  'account.prop-challenge.summary.status.passed': 'Bestanden',
  'account.prop-challenge.summary.status.failed': 'Nicht bestanden',
  'account.prop-challenge.summary.status.pending': 'Ausstehend',
  'account.prop-challenge.summary.status.warning': 'Nahe am Limit',
  'account.prop-challenge.summary.phase-status.pending': 'Ausstehend',
  'account.prop-challenge.summary.phase-status.active': 'Aktiv',
  'account.prop-challenge.summary.phase-status.passed': 'Bestanden',
  'account.prop-challenge.summary.phase-status.failed': 'Nicht bestanden',
  'account.prop-challenge.summary.rule.profit_target': 'Gewinnziel',
  'account.prop-challenge.summary.rule.drawdown': 'Verlustgrenze',
  'account.prop-challenge.summary.rule.drawdown-static': 'Statischer Drawdown',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': 'EOD-Drawdown',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing':
    'Intraday-Drawdown',
  'account.prop-challenge.summary.rule.daily_loss_limit': 'Tagesverlust',
  'account.prop-challenge.summary.rule.live_review_daily_profit':
    'Live-Prüfung',
  'account.prop-challenge.summary.rule.daily_profit_cap':
    'Tägliche Gewinnanrechnung',
  'account.prop-challenge.summary.rule.minimum_trading_days': 'Handelstage',
  'account.prop-challenge.summary.rule.minimum_profitable_days':
    'Profitable Tage',
  'account.prop-challenge.summary.rule.consistency': 'Best-Tag-Konsistenz',
  'account.prop-challenge.summary.rule.max_position_size': 'Positionsgröße',
  'account.prop-challenge.ledger.value.of': '{current} von {target}',
  'account.prop-challenge.ledger.section.payout': 'Auszahlungsanforderungen',
  'account.prop-challenge.ledger.requirement.minimum': 'ab {value}',
  'account.prop-challenge.ledger.requirement.maximum': 'bis {value}',
  'account.prop-challenge.ledger.value.ratio': '{current} / {target}',
  'account.prop-challenge.payout.met-of-total':
    '{met} von {total} Anforderungen',
  'account.prop-challenge.ledger.value.of-today':
    '{current} von {target} heute',
  'account.prop-challenge.ledger.value.credited-profit':
    '{credited} von {actual} tatsächlichem Gewinn angerechnet',
  'account.prop-challenge.ledger.value.used': '{used} genutzt',
  'account.prop-challenge.ledger.value.consistency-goal':
    '{current} von {target} Konsistenzziel',
  'account.prop-challenge.ledger.value.best-day-share':
    'Bester Tag {value} des Gewinns',
  'account.prop-challenge.ledger.value.no-profit': 'Noch kein Gewinn',
  'account.prop-challenge.ledger.requirement.best-day':
    'Bester Tag ≤ {value} des Gesamtgewinns',
  'account.prop-challenge.ledger.state.needs-profit': 'Gewinn nötig',
  'account.prop-challenge.ledger.tooltip.open': '{rule} erklären',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    'Begrenzt, wie viel des gesamten Phasengewinns aus dem profitabelsten Handelstag stammen darf.',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    'Gewinn des besten Tages ÷ gesamter Phasengewinn × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    'Bester Tag: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    'Gesamtgewinn: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 = {share}',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    'Konsistenzziel: {best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    'Der Anteil sinkt mit Gewinn an anderen Tagen, ein neuer größerer bester Tag hebt das Ziel jedoch an.',
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum} – regelkonform',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    'Die Berechnung beginnt, sobald der Phasengewinn positiv ist.',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    'Ein Konsistenzziel erfordert ein Maximum über 0 %.',
  'account.prop-challenge.ledger.help.open': 'Info zu {rule}',
  'account.prop-challenge.ledger.help.profit_target':
    'Erreiche den konfigurierten Saldozuwachs zum Bestehen der Phase. Gewinnanrechnungslimits und optionale Auszahlungsgutschriften beeinflussen den Fortschritt; unrealisierter Gewinn zählt nicht.',
  'account.prop-challenge.ledger.help.profit_target.example':
    'Dieses Konto braucht {target} Gewinn: bisher {current}, noch {remaining}.',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'Ziel erreicht: {current} von {target}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    'So weit darf der Kontostand unter den Startsaldo fallen. Die Untergrenze bewegt sich nie.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'Die Untergrenze dieses Kontos liegt bei {floor}; der Kontostand muss darüber bleiben. Vom Limit {limit} sind noch {buffer} übrig.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    'Die Untergrenze folgt dem höchsten Tagesschlusssaldo und steigt nur, bis sie auf dem Sperrlevel der Firma festgesetzt wird.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'Aktuell liegt die Untergrenze bei {floor} (höchster Schluss minus {limit}) und sie steigt mit jedem höheren Schluss. Noch {buffer} übrig.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    'Die Untergrenze folgt jederzeit deinem höchsten Kontostand, inklusive offenem Gewinn. Journalit sieht nur geschlossene Trades: Diese Untergrenze folgt dem besten Stand nach jedem Schluss; ein Hoch innerhalb eines offenen Trades zählt nicht. Prüfe den Wert der Firma.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    'Aktuell liegt die Untergrenze bei {floor} (bester Kontostand nach geschlossenen Trades minus {limit}). Noch {buffer} übrig; die Live-Zahl der Firma kann enger sein.',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    'So viel darf an einem Handelstag verloren werden. Das Erreichen lässt die Phase scheitern oder pausiert den Handel bis zur nächsten Sitzung, je nach Firma.',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    'Heute: {used} vom Tageslimit {limit} verloren, noch {left} übrig.',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    'Nur ein Teil des Tagesgewinns wird auf das Ziel angerechnet. Gewinn über der Obergrenze bleibt, zählt aber nicht.',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    'Nur {cap} des Tagesgewinns werden angerechnet; {excluded} über der Obergrenze zählen bisher nicht.',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'Ein Handelstag mit mindestens diesem Gewinn macht das Konto für eine Prüfung auf ein Live-Konto berechtigt.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    'Ein Tag mit {trigger} oder mehr qualifiziert; bester Tag bisher {bestDay}.',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    'Erforderliche unterschiedliche Trade-Einstiegstage dieser Phase, einschließlich noch offener Einstiege. Verwendet den konfigurierten Handelstagesschnitt, nicht Mitternacht.',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{current} von {target} Handelstagen erledigt, noch {remaining}.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'Erforderliche Tage mit mindestens dem täglichen realisierten Nettogewinn dieser Phase. Erfasste Auszahlungen setzen diese phasenweite Regel nicht zurück.',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{current} von {target} Tagen mit {minimum} oder mehr geschlossen, noch {remaining}.',
  'account.prop-challenge.ledger.help.consistency':
    'Der beste einzelne Tag darf diesen Anteil am gesamten Phasengewinn nicht überschreiten. Beheben durch mehr Gewinn an anderen Tagen, nicht durch Verluste.',
  'account.prop-challenge.ledger.help.consistency.example':
    'Bester Tag {bestDay} macht {share} von {total} Gesamtgewinn aus; der Gesamtgewinn muss {goal} erreichen, damit er bei {maximum} liegt.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'Bester Tag {bestDay} macht {share} des Gesamtgewinns aus, innerhalb des Limits von {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'Noch kein Gewinn, daher gibt es keinen besten Tag zum Vergleich.',
  'account.prop-challenge.ledger.help.max_position_size':
    'Die meisten erlaubten Kontrakte in einer Position. Journalit prüft die Größe jedes Trades. Manche Firmen erhöhen das Limit mit wachsendem Gewinn.',
  'account.prop-challenge.ledger.help.max_position_size.example':
    'Derzeit bis zu {maximum} Kontrakte pro Trade; größter Trade bisher {current}.',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'Handelstage im aktuellen Auszahlungszyklus. Der Zähler startet nach einer genehmigten Auszahlung neu.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '{current} von {target} Handelstagen in diesem Zyklus, noch {remaining}.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'Handelstage in diesem Zyklus, die auf oder über dem Mindesttagesgewinn der Firma schließen.',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '{current} von {target} Tagen mit {minimum} oder mehr in diesem Zyklus, noch {remaining}.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'Der Gewinn seit Zyklusbeginn muss diesen Betrag erreichen, bevor eine Anforderung möglich ist.',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '{current} in diesem Zyklus verdient von den benötigten {target}.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'Der Kontostand muss bei der Anforderung auf oder über diesem Niveau liegen.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    'Kontostand {current}; er muss mindestens {target} betragen.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    'Nach der ersten Auszahlung muss jeder neue Zyklus im Plus sein, bevor erneut angefordert wird.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'Zyklusgewinn ist {current}; er muss über null liegen.',
  'account.prop-challenge.ledger.help.payout.consistency':
    'Der beste Tag darf diesen Anteil am Zyklusgewinn nicht überschreiten.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    'Bester Tag {bestDay} entspricht {share} von {total} Zyklusgewinn; der Zyklusgewinn muss {goal} erreichen, damit er bei {maximum} liegt.',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'Bester Tag {bestDay} entspricht {share} des Zyklusgewinns, innerhalb der Grenze von {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'Noch kein Zyklusgewinn, also kein bester Tag zum Vergleich.',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    'Die kleinste Auszahlung, die die Firma akzeptiert. Der verfügbare Betrag muss sie zuerst erreichen.',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '{current} verfügbar; die Mindestauszahlung der Firma beträgt {target}.',
  'account.prop-challenge.ledger.help.payout.payout_count':
    'Wie viele Auszahlungen diese Stufe erlaubt. Das Ausschöpfen des Kontingents schließt die Stufe ab.',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '{current} von {target} Auszahlungen in dieser Stufe genutzt.',
  'account.prop-challenge.ledger.help.payout.request_window':
    'Anforderungen werden nur an diesen Wochentagen in der Zeitzone der Firma angenommen.',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    'Heute ist {today}; Anforderungen sind an {days} möglich ({timeZone}).',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'Die Zeit seit dem ersten Trade des Zyklus muss dies erreichen, bevor angefordert werden kann.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '{current} von {target} Stunden seit dem ersten Trade des Zyklus.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'Qualifizierende Tage über die gesamte Funded-Phase, nicht nur diesen Zyklus. Auszahlungen werden frei, sobald erreicht.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '{current} von {target} Qualifikationstagen über die gesamte Phase.',
  'account.prop-challenge.ledger.requirement.target': 'Ziel {value}',
  'account.prop-challenge.ledger.requirement.buffer': 'Puffer {value}',
  'account.prop-challenge.ledger.requirement.max': 'max. {value}',
  'account.prop-challenge.ledger.requirement.daily-cap':
    '{value} Anrechnung pro Handelstag',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{days} Tage mit mindestens {profit}',
  'account.prop-challenge.ledger.requirement.days': '{value} Tage',
  'account.prop-challenge.ledger.requirement.at-most': '≤ {value}',
  'account.prop-challenge.ledger.state.not-started': 'Nicht begonnen',
  'account.prop-challenge.ledger.state.in-progress': 'Läuft',
  'account.prop-challenge.ledger.state.reached': 'Erreicht',
  'account.prop-challenge.ledger.state.met': 'Erfüllt',
  'account.prop-challenge.ledger.state.eligible': 'Berechtigt',
  'account.prop-challenge.ledger.state.safe': 'Sicher',
  'account.prop-challenge.ledger.state.clear': 'Unbelastet',
  'account.prop-challenge.ledger.state.within-rule': 'Regelkonform',
  'account.prop-challenge.ledger.state.near-limit': 'Nahe am Limit',
  'account.prop-challenge.ledger.state.limit-reached': 'Limit erreicht',
  'account.prop-challenge.ledger.state.cap-applied': 'Grenze angewendet',
  'account.prop-challenge.ledger.state.within-cap': 'Innerhalb der Grenze',
  'account.prop-challenge.ledger.state.breached': 'Verletzt',
  'account-dashboard.prop.metrics.total': 'Prüfungen',
  'account-dashboard.prop.metrics.pass-rate': 'Bestehensquote',
  'account-dashboard.prop.metrics.costs': 'Challenge-Kosten',
  'account-dashboard.prop.metrics.payouts': 'Auszahlungen',
  'account-dashboard.prop.metrics.net': 'Netto',
  'account-dashboard.prop.tabs.overview': 'Übersicht',
  'account-dashboard.mode.selector': 'Kontodashboard-Modus',
  'account-dashboard.mode.account-overview': 'Übersicht',
  'account-dashboard.mode.challenges': 'Prop-Challenges',
  'account-dashboard.prop.metrics.active': 'Aktive Challenges',
  'account-dashboard.prop.economics.title': 'Wirtschaftlichkeit',
  'account-dashboard.prop.economics.roi': 'Kapitalrendite',
  'account-dashboard.prop.economics.roi-no-cost': 'Ohne Kosten',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    'Durchschnittskosten pro Versuch',
  'account-dashboard.prop.economics.cost-per-funded-account':
    'Kosten pro finanziertem Konto',
  'account-dashboard.prop.economics.payout-conversion': 'Auszahlungsquote',
  'account-dashboard.prop.insights.title': 'Challenge-Einblicke',
  'account-dashboard.prop.phases.title': 'Phasen-Einblicke',
  'account-dashboard.prop.phases.phase': 'Abschnitt',
  'account-dashboard.prop.phases.average-duration': 'Ø Dauer',
  'account-dashboard.prop.phases.show-more': 'Weitere {count} anzeigen',
  'account-dashboard.prop.phases.show-fewer': 'Weniger anzeigen',
  'account-dashboard.prop.tooltip.open-explanation':
    'Berechnung für {metric} erklären',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    'Noch nicht genügend abgeschlossene Daten',
  'account-dashboard.prop.tooltip.pass-rate.description':
    'Anteil der abgeschlossenen Challenges, die bestanden wurden. Aktive Challenges und archivierte Challenges ohne Ergebnis werden nicht berücksichtigt.',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    'Bestandene Challenges ÷ abgeschlossene Challenges × 100',
  'account-dashboard.prop.tooltip.roi.description':
    'Nettoertrag aus Auszahlungen (Auszahlungen minus Challenge-Kosten) im Verhältnis zu den Challenge-Kosten. Die Kapitalrendite wird nur bei einer gemeinsamen Währung berechnet.',
  'account-dashboard.prop.tooltip.roi.formula':
    '(Auszahlungen − Challenge-Kosten) ÷ Challenge-Kosten × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    'Diese Challenges haben nichts gekostet, es gibt also keine Kostenbasis zum Teilen. Die Nettorendite entspricht den Auszahlungen von {payouts}.',
  'account-dashboard.prop.tooltip.average-cost.description':
    'Durchschnittliche Challenge-Kosten pro Versuch, getrennt nach Währung berechnet.',
  'account-dashboard.prop.tooltip.average-cost.formula':
    'Challenge-Kosten ÷ gesamte Challenge-Versuche',
  'account-dashboard.prop.tooltip.funded-cost.description':
    'Durchschnittliche Challenge-Kosten pro bestandener Challenge, getrennt nach Währung berechnet.',
  'account-dashboard.prop.tooltip.funded-cost.formula':
    'Challenge-Kosten ÷ bestandene Challenges',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    'Anteil der bestandenen Challenges, die mindestens eine Auszahlung erzeugt haben.',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    'Bestandene Challenges mit Auszahlung ÷ bestandene Challenges × 100',
  'account-dashboard.prop.tabs.phases': 'Phasen',
  'account-dashboard.prop.tabs.firms': 'Firmen',
  'account-dashboard.prop.firms.firm': 'Firma',
  'account-dashboard.prop.firms.attempts': 'Versuche',
  'account-dashboard.prop.phases.most-failed': 'Häufigste Fehlphase',
  'account-dashboard.prop.phases.days': '{count} Tage',
  'account-dashboard.prop.phases.empty': 'Noch keine abgeschlossenen Phasen',

  'setups.create.field.tags': 'Tags',
  'setups.create.placeholder.tags': 'Momentum, Ausbruch, Morgen',
  'setups.view.overview.tag-filter.aria': 'Setups filtern',
  'setups.view.overview.tag-filter.reset': 'Zurücksetzen',
  'setups.view.overview.tag-filter.untagged': 'Ohne Tags',
  'setups.view.overview.tag-filter.empty':
    'Keine Setups entsprechen diesen Filtern',
  'setups.view.overview.tag-filter.empty-submessage':
    'Passe die Filter an oder lösche sie, um mehr Setups anzuzeigen.',

  'setups.view.tags': 'Tags',
  'setups.create.error.tag-save-failed':
    'Das Tag konnte nicht in der globalen Tag-Liste gespeichert werden.',
  'settings.customization.options.confirm.remove-tag-message':
    'Das globale Tag "{option}" löschen? Dadurch wird es aus allen Journalit-Trade- und Setup-Notizen entfernt.',
  'settings.customization.options.confirm.reset-tag-message':
    'Die globale Tag-Liste und Farben auf die Standardwerte zurücksetzen? Bereits Trade- und Setup-Notizen zugewiesene Tags bleiben in diesen Notizen erhalten.',
  'home.mode.overview': 'Übersicht',
  'home.mode.dashboard': 'Auswertung',
  'home.mode.aria': 'Home-Modus wechseln',
  'home.filters.period': 'Zeitraum',
  'home.filters.trade-type': 'Handelstyp',
  'home.filters.accounts': 'Konten',
  'home.filters.back': 'Zurück',
  'filter.reset': 'Filter zurücksetzen',
  'filter.menu.title': 'Filtern nach',
  'filter.menu.accounts': 'Konten',
  'filter.menu.tickers': 'Ticker',
  'filter.menu.setups': 'Setups',
  'filter.menu.tags': 'Tags',
  'filter.menu.mistakes': 'Fehler',
  'filter.menu.trade-type': 'Trade-Typ',
  'filter.menu.status': 'Status',
  'filter.menu.direction': 'Richtung',
  'filter.menu.review-status': 'Review-Status',
  'filter.menu.status.cancelled': 'Storniert',
  'filter.menu.included-count': '{count} eingeschlossen',
  'filter.menu.excluded-count': '{count} ausgeschlossen',
  'filter.menu.search': 'Suchen',
  'filter.menu.no-matches': 'Keine Treffer',
  'filter.menu.no-options': 'Noch nichts zum Filtern',
  'filter.menu.clear': 'Leeren',
  'filter.menu.match.label': 'Abgleich',
  'filter.menu.match.any': 'Beliebige davon',
  'filter.menu.match.all': 'Alle davon',
  'filter.menu.match.only': 'Nur diese',
  'filter.menu.match.exact': 'Genau diese',
  'filter.menu.match.hint.any':
    'Trades mit mindestens einem ausgewählten Wert.',
  'filter.menu.match.hint.all':
    'Trades mit jedem ausgewählten Wert. Weitere Werte sind erlaubt.',
  'filter.menu.match.hint.only':
    'Trades, deren Werte alle zu den ausgewählten gehören.',
  'filter.menu.match.hint.exact':
    'Trades mit genau den ausgewählten Werten, nicht mehr und nicht weniger.',
  'filter.menu.match.no-value-any-only': 'Nur mit „Beliebige davon“',
  'filter.menu.exclude-value': '{label} ausschließen',
  'filter.menu.match.badge.all': 'Alle',
  'filter.menu.match.badge.only': 'Nur',
  'filter.menu.match.badge.exact': 'Genau',
  'home.guide.modes.title': 'Noch etwas: das Dashboard',
  'home.guide.modes.description':
    'Übersicht und Dashboard teilen sich diese Seite. Wechsle jetzt zum Dashboard, um mit einer kurzen Tour durch deine Performance-Statistiken fortzufahren.',
  'home.guide.whats-new.mode.title': 'Eine Startseite, zwei Modi',
  'home.guide.whats-new.mode.description':
    'Übersicht und Dashboard teilen sich jetzt eine Seite. Wechsle hier den Modus, ohne Layout oder Scrollposition zu verlieren.',
  'home.guide.whats-new.filters.title': 'Home-Filter an einem Ort',
  'home.guide.whats-new.filters.description':
    'Öffne die Filter-Schaltfläche, um Zeitraum, Handelstyp oder Konten in einem kompakten Menü auszuwählen.',
  'home.guide.whats-new.done.title': 'Dein Arbeitskontext bleibt erhalten',
  'home.guide.whats-new.done.description':
    'Nutze die Übersicht für persönliche Widgets und das Dashboard für tiefere Analysen. Jeder Modus behält eigene Filter und Layouts.',
  'account.prop-challenge.summary.status.payout_ready': 'Auszahlungsbereit',
  'account.prop-challenge.ribbon.passed': '{phase} bestanden',
  'account.prop-challenge.ribbon.failed': '{phase} nicht bestanden',
  'account.prop-challenge.ribbon.action.advance': 'Weiter zu {phase}',
  'account.prop-challenge.ribbon.action.advance-short': 'Weiter',
  'account.prop-challenge.ribbon.action.mark-passed': 'Als bestanden markieren',
  'account.prop-challenge.ribbon.action.archive': 'Archivieren',
  'account.prop-challenge.ribbon.action.record-payout': 'Auszahlung erfassen',
  'account.prop-challenge.ribbon.action.record-payout-short': 'Auszahlung',
  'account.prop-challenge.payout.title': 'Auszahlungsbereitschaft',
  'account.prop-challenge.payout.eligible': 'Auszahlungsbereit',
  'account.prop-challenge.payout.available': 'Jetzt verfügbar',
  'account.prop-challenge.payout.cycle-profit': 'Zyklusgewinn',
  'account.prop-challenge.payout.history': 'Auszahlungen',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'Lebenslange qualifizierende Tage',
  'account.prop-challenge.payout.requirement.days': 'Handelstage',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'Qualifizierende Tage',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'Mindestkontostand',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'Positiver Zyklusgewinn',
  'account.prop-challenge.payout.requirement.cycle-profit': 'Zyklusgewinn',
  'account.prop-challenge.payout.requirement.consistency': 'Konsistenz',
  'account.prop-challenge.payout.requirement.minimum':
    'Verfügbarer Mindestbetrag',
  'account.prop-challenge.payout.requirement.payouts': 'Auszahlungslimit',
  'account.prop-challenge.payout.requirement.request-window': 'Antragsfenster',
  'account.prop-challenge.payout.timezone-invalid': 'Unbekannte Zeitzone.',
  'account.prop-challenge.payout.preview-amount': 'Auszahlung prüfen',
  'account.prop-challenge.payout.you-receive': 'Händleranteil',
  'account.prop-challenge.payout.balance-after': 'Kontostand danach',
  'account.prop-challenge.payout.drawdown-floor': 'Drawdown-Untergrenze',
  'account.prop-challenge.payout.buffer-after': 'Abstand zum Regelverstoß',
  'account.prop-challenge.payout.request-not-allowed':
    'Bei diesem Betrag nicht zulässig',
  'account.prop-challenge.payout.immediate-breach':
    'Diese Auszahlung würde das Konto auf oder unter seine Drawdown-Untergrenze bringen.',
  'account.prop-challenge.payout.account-concludes':
    'Diese Auszahlung schließt den konfigurierten simulierten Funded-Auszahlungszyklus ab.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'Diese Auszahlung versetzt das Konto in die nächste konfigurierte Phase.',
  'account.prop-challenge.payout.live-review-after-payout':
    'Diese Auszahlung macht das Konto für die Prüfung auf ein Live-Konto berechtigt.',
  'account.prop-challenge.payout.cycle-resets':
    'Der Auszahlungsfortschritt wird nach einer genehmigten Auszahlung zurückgesetzt.',
  'account.prop-challenge.payout.cycle-continues':
    'Der Auszahlungsfortschritt wird nach einer genehmigten Auszahlung fortgesetzt.',
  'account.prop-challenge.payout.drawdown.unchanged':
    'Die aktuelle Drawdown-Untergrenze bleibt bestehen.',
  'account.prop-challenge.payout.drawdown.lock_at_balance':
    'Die Drawdown-Untergrenze wird nach der Auszahlung fixiert.',
  'account.prop-challenge.payout.drawdown.reset_from_starting_balance':
    'Konto- und Drawdown-Limits werden nach der Auszahlung zurückgesetzt.',
  'account.prop-challenge.stage': 'Stufentyp',
  'account.prop-challenge.stage.evaluation': 'Evaluierung',
  'account.prop-challenge.stage.sim-funded': 'Simuliert finanziert',
  'account.prop-challenge.stage.live-funded': 'Live finanziert',
  'account.prop-challenge.payout-rules.title': 'Auszahlungsregeln',
  'account.prop-challenge.payout-rules.add': 'Auszahlungsregeln hinzufügen',
  'account.prop-challenge.payout-rules.remove': 'Auszahlungsregeln entfernen',
  'account.prop-challenge.payout-rules.cycle': 'Berechtigungszyklus',
  'account.prop-challenge.payout-rules.request-window':
    'Zeitpunkt des Auszahlungsantrags',
  'account.prop-challenge.payout-rules.request-window.anytime': 'Jeder Tag',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'Bestimmte Wochentage',
  'account.prop-challenge.payout-rules.request-window.time-zone': 'Zeitzone',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'Zulässige Antragstage',
  'account.prop-challenge.payout-rules.cycle.none': 'Kein Wartezyklus',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'Handelstage',
  'account.prop-challenge.payout-rules.cycle.qualifying-days':
    'Qualifizierende Tage',
  'account.prop-challenge.payout-rules.cycle.calendar-days': 'Kalendertage',
  'account.prop-challenge.payout-rules.days': 'Erforderliche Tage',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'Mindest-Tagesgewinn',
  'account.prop-challenge.payout-rules.anchor': 'Zyklus beginnt ab',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'Stufenbeginn',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'Erster Trade',
  'account.prop-challenge.payout-rules.minimum-balance': 'Mindestkontostand',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Mindest-Zyklusgewinn',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'Mindestzyklusgewinn nach Auszahlungsnummer',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'Nach der ersten Auszahlung positiven Zyklusgewinn verlangen',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Maximaler Anteil des besten Tages (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'Maximaler Anteil des besten Tages nach Auszahlungsnummer (%)',
  'account.prop-challenge.payout-rules.availability': 'Verfügbarer Gewinn',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Über dem Startguthaben',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Über der Kontostand-Untergrenze',
  'account.prop-challenge.payout-rules.balance-floor': 'Kontostand-Untergrenze',
  'account.prop-challenge.payout-rules.request-percent':
    'Auszahlbarer Anteil (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'Erforderlicher neuer Gewinn je Antrag (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'Begrenzt den Antrag so, dass der konfigurierte Prozentsatz durch den im aktuellen Auszahlungszyklus erzielten Gewinn gedeckt ist. Beispiel: 50 % erlaubt einen Antrag bis zum Doppelten des aktuellen Zyklusgewinns.',
  'account.prop-challenge.payout-rules.minimum-request': 'Mindestauszahlung',
  'account.prop-challenge.payout-rules.maximum': 'Maximale Auszahlung',
  'account.prop-challenge.payout-rules.maximum.none': 'Kein Maximum',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Festes Maximum',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'Höchstbetrag nur für die erste Auszahlung',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Maximum nach Auszahlungsnummer',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'Prozentsatz des Zyklusgewinns',
  'account.prop-challenge.payout-rules.maximum-amount': 'Maximalbetrag',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'Höchstbetrag der ersten Auszahlung',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'Maximaler Zyklusgewinn (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'Endbetrag für spätere Auszahlungen weiterverwenden',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'Letzten Wert für spätere Auszahlungen weiterverwenden',
  'account.prop-challenge.payout-rules.schedule':
    'Beträge nach Auszahlungsnummer',
  'account.prop-challenge.payout-rules.profit-split':
    'Gewinnanteil des Traders (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'Limits nach lebenslangen qualifizierenden Tagen ändern',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    'Zählt qualifizierende Tage über die gesamte Funded-Phase, auch wenn Auszahlungszyklen zurückgesetzt werden.',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'Erforderliche lebenslange qualifizierende Tage',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'Verfügbarkeit nach Freischaltung',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'Kontostand-Untergrenze nach Freischaltung',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'Verfügbarer Gewinn nach Freischaltung (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'Maximale Anfrage nach Freischaltung',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'Maximalbetrag nach Freischaltung',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'Maximalplan nach Freischaltung',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'Maximaler Zyklusgewinn-Prozentsatz nach Freischaltung',
  'account.prop-challenge.payout-rules.profit-split-model':
    'Gewinnaufteilungsmodell',
  'account.prop-challenge.payout-rules.profit-split.fixed':
    'Fester Prozentsatz',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    'Änderung nach kumulierten Auszahlungen',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'Anfänglicher Händleranteil (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'Kumulierte Auszahlungsschwelle',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'Händleranteil nach Schwelle (%)',
  'account.prop-challenge.payout-rules.maximum-payouts':
    'Maximale Auszahlungen',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'Nach der letzten Auszahlung',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'Konto fortführen',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'Konto abschließen',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'Zur nächsten Phase wechseln',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'Für Live-Prüfung berechtigt',
  'account.prop-challenge.payout-rules.aftermath':
    'Nach einer genehmigten Auszahlung',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'Auszahlung abziehen; Drawdown-Untergrenze beibehalten',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'Auszahlung abziehen; Drawdown-Untergrenze fixieren',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'Konto und Drawdown zurücksetzen',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'Drawdown-Untergrenze nach Auszahlung',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'Erste Auszahlung ignoriert den Mindest-Zyklusgewinn',
  'account.prop-challenge.payout-rules.reset-cycle':
    'Berechtigungszyklus nach Auszahlung zurücksetzen',
  'account.prop-challenge.payout-rules.group.eligibility': 'Berechtigung',
  'account.prop-challenge.payout-rules.group.availability':
    'Verfügbare Auszahlung',
  'account.prop-challenge.payout-rules.group.terms': 'Auszahlungsbedingungen',
  'account.prop-challenge.payout-rules.group.aftermath': 'Nach der Auszahlung',
  'account.prop-challenge.payout.requirement.elapsed-hours':
    'Verstrichene Zeit',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'Ändert sich nach Kontogewinn',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'Der lebenslange Kontogewinn entspricht dem aktuellen Saldo minus Startguthaben plus früheren Auszahlungen. Der Prozentsatz unterhalb bzw. ab der Schwelle gilt für den gesamten Antrag.',
  'account.prop-challenge.payout-rules.profit-split.below':
    'Händleranteil unterhalb der Schwelle (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'Kontogewinnschwelle',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'Händleranteil ab der Schwelle (%)',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Mindestanzahl verstrichener Stunden',

  
  'account.merge.challenge.move-earlier': '{account} nach vorn',
  'account.merge.challenge.move-later': '{account} nach hinten',
  'account.merge.warning.use-profile-balance': 'Kontostand der Firma verwenden',
  'account.merge.warning.edit-phases': 'Phasen bearbeiten',
  'account.merge.title': 'Challenge einrichten',
  'account.merge.loading': 'Wird geladen...',
  'account.merge.step.accounts': 'Konten',
  'account.merge.step.phases': 'Phasen',
  'account.merge.step.review': 'Prüfen',
  'account.merge.accounts.title': 'Zusammenzuführende Konten',
  'account.merge.accounts.show-archived': 'Archivierte anzeigen',
  'account.merge.accounts.empty': 'Keine geeigneten Konten',
  'account.merge.target.title': 'Zielkonto',
  'account.merge.target.keep': 'Beibehalten',
  'account.merge.target.new': 'Neuer Name',
  'account.merge.phase.name': 'Phasenname',
  'account.merge.phase.status': 'Status',
  'account.merge.phase.started': 'Beginn',
  'account.merge.phase.completed': 'Abschluss',
  'account.merge.phase.no-rules': 'Keine',
  'account.merge.review.notes': 'verschobene Trades',
  'account.merge.review.identities': 'Broker-Konten',
  'account.merge.warning.trade-outside-window':
    'Trades außerhalb ihres Phasenzeitraums',
  'account.merge.warning.identity-shared':
    'Kennung von mehreren Konten beansprucht',
  'account.merge.warning.copy-trading-dropped':
    'Copy-Trading-Zeiträume verworfen',
  'account.merge.error.too-few-sources': 'Wähle mindestens zwei Konten.',
  'account.merge.error.duplicate-source': 'Ein Konto ist doppelt aufgeführt.',
  'account.merge.error.target-exists':
    'Dieser Name gehört zu einem anderen Konto.',
  'account.merge.error.currency-mismatch':
    'Die Konten nutzen unterschiedliche Währungen.',
  'account.merge.error.timeline-not-monotonic':
    'Die Phasenstarts müssen aufsteigend sein.',
  'account.merge.error.invalid-override': 'Prüfe die Daten dieser Phase.',
  'account.merge.error.source-missing':
    'Für ein Konto sind keine Einstellungen gespeichert.',
  'account.merge.error.unknown': 'Zusammenführen fehlgeschlagen.',
  'account.merge.action.merge': 'Zusammenführen',
  'account.merge.action.undo': 'Rückgängig',
  'account.merge.action.looks-right': 'Sieht richtig aus',
  'account.merge.action.delete': 'Alte Konten löschen',
  'account.merge.notice.converted': 'In eine Challenge umgewandelt',
  'account.merge.summary.intro': 'Prüfe, ob das zu deiner Prüfung passt:',
  'account.merge.summary.phases': 'Phasen: {phases}',
  'account.merge.summary.current':
    'Aktuell in {phase} ({stage}), gestartet am {date}',
  'account.merge.summary.current-stage':
    'Aktuell in {phase}, gestartet am {date}',
  'account.merge.summary.trades':
    '{counted} von {total} Trades zählen für die Prüfung',
  'account.merge.summary.trades-missing':
    '{counted} von {total} Trades zählen für die Prüfung. Die übrigen liegen außerhalb der Daten aller Phasen.',
  'account.merge.summary.rules': 'Regeln für {phase}: {rules}',
  'account.merge.summary.no-rules':
    'Noch keine Regeln für {phase}. Füge die Regeln deiner Firma in Konto bearbeiten hinzu.',
  'account.merge.notice.title': 'Zusammengeführt aus {accounts}',
  'account.merge.notice.error': 'Aktion fehlgeschlagen.',
  'account.merge.undo.title': 'Zusammenführung rückgängig machen',
  'account.merge.undo.message':
    'Stellt die alten Konten und ihre Trades wieder her.',
  'account.merge.delete.title': 'Alte Konten löschen',
  'account.merge.delete.message':
    'Löscht die archivierten alten Konten. Das lässt sich nicht rückgängig machen.',
  'command.open-legacy-challenge-onboarding': 'Prop-Challenges einrichten',
  'account.merge.step.challenge': 'Challenge',
  'account.merge.action.convert': 'Umwandeln',
  'account.merge.profile.applied': 'Angewendet: {firm} · {challenge}',
  'account.merge.profile.remove': 'Entfernen',
  'account.merge.phase.apply-profile': 'Firmenregeln anwenden',
  'account.merge.profile.replace-rules.title':
    'Manuell eingegebene Regeln ersetzen?',
  'account.merge.profile.replace-rules.body':
    'Das Profil von {firm} legt die Regeln jeder Phase fest. Die auf dieser Seite eingegebenen Regeln werden ersetzt.',
  'account.merge.profile.replace-rules.confirm': 'Regeln ersetzen',
  'guide.legacy-setup.list.title': 'Hier steht jedes Konto ohne Challenge',
  'guide.legacy-setup.list.description':
    'Entscheide pro Konto. „Unverändert lassen“ behält es genau so, wie es ist; du kannst es später jederzeit in den Dashboard-Einstellungen einrichten.',
  'guide.legacy-setup.assign.title': 'Phasen einer Challenge zusammenfassen',
  'guide.legacy-setup.assign.description':
    'Konten, die Phasen derselben Challenge waren, kommen in eine Gruppe (Vorschläge entstehen aus passenden Namen). Ein einzelnes Konto wird zu einer Challenge mit einer Phase.',
  'guide.legacy-setup.continue.title': 'Eine kurze Einrichtung pro Challenge',
  'guide.legacy-setup.continue.description':
    '„Weiter“ öffnet die Challenge-Einrichtung nacheinander für jede Gruppe. Nichts ändert sich, bevor du jede bestätigst.',
  'guide.merge-wizard.target.title': 'Ein Konto behält den Verlauf',
  'guide.merge-wizard.target.description':
    'Das Zielkonto bleibt mit allen Phasen bestehen. Die anderen werden archiviert, nicht gelöscht, und ihre Trades wandern zum Zielkonto.',
  'guide.merge-wizard.identity.title': 'Wähle die Regeln deiner Firma',
  'guide.merge-wizard.identity.description':
    'Wähle deine Firma und deinen Plan, um Phasen und Regeln auszufüllen. Firma nicht dabei? Wähle „Andere / eigene Firma“ und lege die Regeln auf der nächsten Seite fest.',
  'guide.merge-wizard.identity.free-title': 'Benenne deine Prüfung',
  'guide.merge-wizard.identity.free-description':
    'Gib ihr einen Namen und, wenn du willst, den deiner Firma. Gespeicherte Regeln einer früheren Prüfung füllen Phasen und Regeln aus; sonst legst du sie auf der nächsten Seite fest.',
  'guide.merge-wizard.phases.title': 'Jede Phase prüfen',
  'guide.merge-wizard.phases.description':
    'Lege den Stufentyp fest, markiere abgeschlossene Phasen als „Bestanden“ und die aktuelle als „Aktiv“ und prüfe die Daten.',
  'guide.merge-wizard.review.title': 'Nichts passiert, bevor du bestätigst',
  'guide.merge-wizard.review.description':
    'Nach dem Umwandeln zeigt die Kontoseite, was eingerichtet wurde, damit du es prüfen kannst, und du kannst es dort rückgängig machen.',
  'account.merge.challenge.accounts': 'Konten',
  'account.merge.challenge.order-hint': 'Älteste Phase zuerst',
  'account.merge.challenge.single-hint':
    'Dieses Konto wird eine eigene Challenge',
  'account.merge.phase.broker-accounts.one': '{count} Broker-Konto',
  'account.merge.phase.broker-accounts.few': '{count} Broker-Konten',
  'account.merge.phase.broker-accounts.many': '{count} Broker-Konten',
  'account.merge.phase.broker-accounts.other': '{count} Broker-Konten',
  'account.merge.review.phase-count.one': 'Phase',
  'account.merge.review.phase-count.few': 'Phasen',
  'account.merge.review.phase-count.many': 'Phasen',
  'account.merge.review.phase-count.other': 'Phasen',
  'account.merge.phase.pending': 'Ausstehend',
  'account.merge.phase.starts-after': 'Beginnt nach bestandener {phase}',
  'account.merge.phase.pending-rules': 'Regeln: {rules}',
  'account.merge.review.archived': 'archiviert',
  'account.merge.review.starts-after': 'Nach {phase}',
  'account.merge.review.since': 'Seit {date}',
  'account.merge.sequence': 'Challenge {index} von {total}',
  'account.merge.warning.balance-differs':
    'Startkontostand weicht von den Regeln der Firma ab',
  'account.merge.error.profile-phase-mismatch':
    'Mehr Konten als Phasen in den Regeln der Firma',
  'account.merge.error.profile-currency-mismatch':
    'Die Regeln der Firma nutzen eine andere Währung als diese Konten.',
  'account.merge.error.source-changed':
    'Ein Konto hat sich geändert. Prüfe die Zusammenführung erneut.',
  'account.merge.error.multiple-active-phases':
    'Nur das letzte Konto darf noch aktiv sein.',
  'account.merge.error.phases-after-failed-source':
    'Ein gescheitertes Konto beendet die Challenge und muss daher zuletzt ausgewählt werden.',
  'account.merge.error.copy-trading-overlap':
    'Copy-Trading-Zeiträume überschneiden sich. Schließe zuerst einen.',
  'onboarding.legacy-challenge.legend':
    'Wähle, was mit jedem älteren Konto passiert. Hattest du für jede Phase ein eigenes Konto, etwa Phase 1 und Funded? Lege sie in dieselbe Prüfung, damit sie ein Konto mit Phasen werden.',
  'onboarding.legacy-challenge.assign.leave': 'Als normales Konto behalten',
  'onboarding.legacy-challenge.assign.own': 'Zur Prüfung machen',
  'onboarding.legacy-challenge.assign.group': 'Zu Prüfung {letter} hinzufügen',
  'onboarding.legacy-challenge.assign.new-group':
    'Zu neuer Prüfung zusammenfassen…',
  'onboarding.legacy-challenge.action.continue': 'Weiter',
  'onboarding.legacy-challenge.action.continue-count': '{count} einrichten',
  'guide.action-step.dismiss': 'Nicht jetzt',
  'guide.legacy-challenge.title': 'Konten von vor diesem Update einrichten',
  'guide.legacy-challenge.description':
    'Mache ältere Evaluierungs- oder Funded-Konten zu Prüfungen. Die Einrichtung führt dich durch Phasen und Daten und zeigt am Ende, was eingerichtet wurde, damit du es prüfen kannst.',
  'guide.legacy-challenge.action': 'Konten einrichten',
  'onboarding.legacy-challenge.title': 'Prop-Challenges',
  'onboarding.legacy-challenge.action.skip': 'Überspringen',
  'onboarding.legacy-challenge.accounts.show-archived': 'Archivierte anzeigen',
  'onboarding.legacy-challenge.accounts.empty': 'Keine Konten zum Einrichten',
  'onboarding.legacy-challenge.loading': 'Wird geladen...',
  'onboarding.legacy-challenge.suggested': 'Vorschlag',
  'onboarding.legacy-challenge.row.aria': 'Aktion für {account}',
  'onboarding.legacy-challenge.status.combined': 'Zusammengeführt',
  'onboarding.legacy-challenge.status.converted': 'Umgewandelt',
  'onboarding.legacy-challenge.entry.name': 'Prop-Challenges',
  'onboarding.legacy-challenge.entry.desc':
    'Bestehende Konten zu Challenges zusammenführen oder umwandeln.',
  'onboarding.legacy-challenge.entry.action': 'Einrichten',

  'view.home': 'Heim',
  'common.lose': 'Verlieren',

  'dashboard.conversion.requires-conversion':
    'P&L-Diagramme mit mehreren Währungen erfordern eine Wechselkursumrechnung.',

  'auth.error.invalid-email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  'auth.error.invalid-code': 'Ungültiger Bestätigungscode',
  'form.layout.guide-trigger-label': 'Formular anpassen',
  'dashboard.filter.setup.none-found': 'Keine Setups gefunden',
  'nav.weekly': 'Wöchentlicher Rückblick',
  'weekly.overview.drawdown-chart.empty':
    'Es können keine Drawdown-Daten angezeigt werden',
  'trade-sync.gate.signin.cta': 'anmelden',
  'backend.progress.ftp.desc': 'Anmeldeinformationen erstellen',
  'csv.errors.group.close-only':
    'Nur Close-only-Ausführungen wurden übersprungen',
  'csv.report.file': 'Datei: {file}',
  'csv.broker-guide.sierrachart.warning.message':
    'Die Export-Option speichert nicht angepasste Preise. Mit „Protokoll speichern unter“ bleiben die angezeigten Preise erhalten.',
  'csv.broker-guide.rithmic.step-1':
    'Order-Historie in R öffnen | Trader Pro und filtern Sie nach abgeschlossenen/erfüllten Aufträgen für Ihr Konto/Datum',
  'csv.broker-guide.rithmic.step-2':
    'Verwenden Sie „Spalten hinzufügen/entfernen“ und stellen Sie sicher, dass „Seite“, „Symbol“, „Fill-Menge“, „Durchschn. Fill-Preis“ und „Fill-/Aktualisierungszeit“ sichtbar sind',
  'trade.details.execution': 'Execution',
  'drc.preparation.checklist.title': 'Pre-Trade-Checkliste',
  'onboarding.welcome.insight.timing.title': 'Timing-Muster',
  'onboarding.wizard.error.account-service':
    'AccountPageService nicht verfügbar',
  'account.create.field.drawdown-type-desc':
    'Keine | Behoben | EOD-Trailing | Handbuch',
  'account.edit.field.drawdown-type-desc':
    'Keine | Behoben | EOD-Trailing | Handbuch',
  'monthly.game.header.a-games': 'Ein Spiel',
  'trade-import.preview.message.no-open-match':
    'Kein passender offener Trade für Close-only-Vorschau gefunden',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'setups.view.action.refresh': 'Aktualisieren',
  'setups.view.detail.no-playbook': 'Noch kein Playbook erstellt.',
  'trade-sync.import.action.sync-cloud': 'Sync cloud trades',
  'session-log.placeholder.entry': 'Was siehst, denkst oder fühlst du?',
  'session-mode.unconfigured.step.gate.description':
    'Starter IF/THEN checklist is ready.',

  'home.widget.streak.kind.trade-outcome': 'Trade-Ergebnisse',
  'home.widget.streak.kind.trade-review': 'Handelsauswertungen',
  'home.widget.streak.kind.drc-review': 'DRC-Auswertungen',
  'home.widget.streak.kind.weekly-review': 'Wochenreviews',
  'home.widget.streak.kind.monthly-review': 'Monatsreviews',
  'home.widget.streak.configure': 'Streak-Typ auswählen',
  'home.widget.streak.configure-aria': '{kind}-Streak konfigurieren',
  'home.widget.streak.no-review-streak': 'kein aktiver Review-Streak',
  'home.widget.streak.start-reviewing':
    'starte Reviews, um eine Serie aufzubauen',
  'home.widget.streak.keep-reviewing':
    'prüfe weiter, um die Serie fortzusetzen',
  'home.widget.streak.reviewed-trades-in-a-row.one':
    'Geschäft in Folge geprüft',
  'home.widget.streak.reviewed-trades-in-a-row.few':
    'Geschäfte in Folge geprüft',
  'home.widget.streak.reviewed-trades-in-a-row.many':
    'Geschäfte in Folge geprüft',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'Geschäfte in Folge geprüft',
  'home.widget.streak.reviewed-days-in-a-row.one': 'Tag in Folge geprüft',
  'home.widget.streak.reviewed-days-in-a-row.few': 'Tage in Folge geprüft',
  'home.widget.streak.reviewed-days-in-a-row.many': 'Tage in Folge geprüft',
  'home.widget.streak.reviewed-days-in-a-row.other': 'Tage in Folge geprüft',
  'home.widget.streak.reviewed-weeks-in-a-row.one': 'Woche in Folge geprüft',
  'home.widget.streak.reviewed-weeks-in-a-row.few': 'Wochen in Folge geprüft',
  'home.widget.streak.reviewed-weeks-in-a-row.many': 'Wochen in Folge geprüft',
  'home.widget.streak.reviewed-weeks-in-a-row.other': 'Wochen in Folge geprüft',
  'home.widget.streak.reviewed-months-in-a-row.one': 'Monat in Folge geprüft',
  'home.widget.streak.reviewed-months-in-a-row.few': 'Monate in Folge geprüft',
  'home.widget.streak.reviewed-months-in-a-row.many': 'Monate in Folge geprüft',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'Monate in Folge geprüft',
  'home.widget.streak.missed-trades.one':
    'seit deinem letzten Review fehlt {count} Geschäft',
  'home.widget.streak.missed-trades.few':
    'seit deinem letzten Review fehlen {count} Geschäfte',
  'home.widget.streak.missed-trades.many':
    'seit deinem letzten Review fehlen {count} Geschäfte',
  'home.widget.streak.missed-trades.other':
    'seit deinem letzten Review fehlen {count} Geschäfte',
  'home.widget.streak.missed-days.one':
    'seit deinem letzten Review fehlt {count} Tag',
  'home.widget.streak.missed-days.few':
    'seit deinem letzten Review fehlen {count} Tage',
  'home.widget.streak.missed-days.many':
    'seit deinem letzten Review fehlen {count} Tage',
  'home.widget.streak.missed-days.other':
    'seit deinem letzten Review fehlen {count} Tage',
  'home.widget.streak.missed-weeks.one':
    'seit deinem letzten Review fehlt {count} Woche',
  'home.widget.streak.missed-weeks.few':
    'seit deinem letzten Review fehlen {count} Wochen',
  'home.widget.streak.missed-weeks.many':
    'seit deinem letzten Review fehlen {count} Wochen',
  'home.widget.streak.missed-weeks.other':
    'seit deinem letzten Review fehlen {count} Wochen',
  'home.widget.streak.missed-months.one':
    'seit deinem letzten Review fehlt {count} Monat',
  'home.widget.streak.missed-months.few':
    'seit deinem letzten Review fehlen {count} Monate',
  'home.widget.streak.missed-months.many':
    'seit deinem letzten Review fehlen {count} Monate',
  'home.widget.streak.missed-months.other':
    'seit deinem letzten Review fehlen {count} Monate',
  'trade-sync.quick.started': 'Aktivierte Trade-Quellen werden synchronisiert…',
  'trade-sync.quick.running': 'Wird synchronisiert…',
  'trade-sync.quick.offline':
    'Die Trade-Synchronisierung benötigt eine Internetverbindung. Versuche es erneut, sobald du online bist.',
  'trade-sync.quick.no-sources':
    'Keine aktivierten Trade-Sync-Quellen gefunden. Richte Trade Sync in den Einstellungen ein.',
  'trade-sync.quick.complete':
    'Trade-Synchronisierung abgeschlossen: {sources} Quellen synchronisiert und {imported} Trades importiert oder aktualisiert.',
  'trade-sync.quick.partial':
    'Trade-Synchronisierung mit Problemen beendet: {completed} von {total} Quellen abgeschlossen und {imported} Trades importiert oder aktualisiert.',
  'trade-sync.quick.failed':
    'Die Trade-Synchronisierung konnte für {sources} Quellen nicht abgeschlossen werden. Prüfe deine Trade-Sync-Einstellungen und versuche es erneut.',
  'navigation.items.nav-sync-trades': 'Trades synchronisieren',
  'command.sync-trades-now': 'Trades synchronisieren',
  'home.quick-links.sync-trades': 'Trades synchronisieren',
  'trade-sync.quick.not-ready':
    'Keine aktivierten Trade-Sync-Quellen sind derzeit bereit. Warte auf laufende Synchronisierungen oder prüfe die Trade-Sync-Einstellungen.',
  'trade-sync.quick.mapping-required':
    '{imported} Trades wurden importiert oder aktualisiert. Schließe die Kontozuordnung für {providers} unter Einstellungen → Trade Sync ab und versuche es erneut.',
  'trade-handoff.action.view-trades-count.one': '{count} Trade anzeigen',
  'trade-handoff.action.view-trades-count.few': '{count} Trades anzeigen',
  'trade-handoff.action.view-trades-count.many': '{count} Trades anzeigen',
  'trade-handoff.action.view-trades-count.other': '{count} Trades anzeigen',
  'trade-handoff.action.review-now': 'Jetzt überprüfen',
  'trade-handoff.action.open-period': 'Review für {period} öffnen',
  'trade-handoff.review.creation-disabled':
    'Dieser Review existiert nicht und die automatische Review-Erstellung ist deaktiviert.',
  'trade-handoff.review.open-failed':
    'Dieser Review konnte nicht geöffnet werden.',
  'trade-handoff.trades.open-failed':
    'Das Trade Log konnte nicht geöffnet werden.',
  'trade-handoff.scope.label':
    '{trades} aus dem letzten Vorgang für {accounts} werden angezeigt',
  'trade-handoff.scope.exit': 'Vorgangsansicht verlassen',
  'trade-handoff.trade-count.one': '{count} Trade',
  'trade-handoff.trade-count.few': '{count} Trades',
  'trade-handoff.trade-count.many': '{count} Trades',
  'trade-handoff.trade-count.other': '{count} Trades',
  'trade-handoff.title.sync': 'Synchronisierung abgeschlossen',
  'trade-handoff.summary.import-complete': '{trades} importiert',
  'trade-handoff.summary.update-complete': '{trades} aktualisiert',
  'trade-handoff.summary.update-partial': '{trades} mit Problemen aktualisiert',
  'trade-handoff.summary.mixed-complete':
    '{imported} importiert · {updated} aktualisiert',
  'trade-handoff.summary.mixed-partial':
    '{imported} importiert · {updated} aktualisiert, mit Problemen',
  'trade-handoff.summary.import-partial': '{trades} mit Problemen importiert',
  'trade-handoff.periods.choose': 'Anderen Überprüfungszeitraum auswählen',
  'trade-handoff.periods.recommended': 'Empfohlen',
  'trade-handoff.action.dismiss': 'Letztes Trade-Ergebnis schließen',
  'sample.action.try': 'Beispieljournal ausprobieren',
  'sample.action.reset': 'Beispiel zurücksetzen',
  'sample.popout.title': 'Beispieljournal',
  'sample.popout.action.exit': 'Verlassen',
  'sample.popout.description': 'Änderungen hier dienen nur zum Üben.',
  'sample.popout.closed': 'Übungsjournal gespeichert und geschlossen.',
  'sample.popout.recovery': 'Übungsjournal muss wiederhergestellt werden.',
  'sample.notice.sync-blocked':
    'Du bearbeitest fiktive Beispieldaten. Die Backend-Synchronisierung ist pausiert.',
  'sample.notice.folder-locked':
    'Der Journal-Ordner kann nicht geändert werden, solange das Beispiel-Journal aktiv ist.',
  'sample.empty.description':
    'Erkunde ein ausgefülltes fiktives Journal, ohne deine Journaldateien oder Einstellungen zu ändern.',
  'sample.progress.creating':
    'Beispieljournal wird erstellt: {completed} von {total} Elementen',
  'sample.progress.removing':
    'Beispieljournal wird entfernt: {completed} von {total} Elementen',
  'sample.progress.verifying':
    'Beispieljournal wird geprüft: {completed} von {total} Einträgen',
  'sample.exit.title': 'Beispieljournal verlassen?',
  'sample.exit.remove-warning':
    'Beim Entfernen werden Änderungen in nachweislich zum Beispiel gehörenden Dateien gelöscht. Dateien ohne nachweisbare Beispielzugehörigkeit bleiben erhalten.',
  'sample.exit.remove': 'Verlassen und entfernen',
  'sample.reset.title': 'Beispieljournal zurücksetzen?',
  'sample.reset.message':
    'Dadurch werden alle Beispieldateien und beispielspezifischen Einstellungen auf das ursprüngliche fiktive Paket zurückgesetzt.',
  'sample.reset.warning':
    'Deine Änderungen im Beispieljournal werden gelöscht.',
  'sample.collision.title': 'Beispielordner ist bereits vorhanden',
  'sample.collision.message':
    'Journalit überschreibt den vorhandenen Ordner nicht. Soll das Beispieljournal stattdessen unter „{path}“ erstellt werden?',
  'sample.collision.confirm': 'Verfügbaren Ordner verwenden',
  'sample.notice.ready': 'Das Beispieljournal ist bereit.',
  'sample.notice.reset': 'Beispieljournal wiederhergestellt.',
  'sample.notice.reset-preserved':
    'Beispieljournal wiederhergestellt. {count} Dateien ohne nachweisbare Eigentümerschaft wurden beibehalten.',
  'sample.notice.removed': 'Beispieljournal entfernt.',
  'sample.notice.removed-preserved':
    'Beispieljournal entfernt. {count} Dateien ohne nachweisbare Eigentümerschaft wurden beibehalten.',
  'sample.notice.error':
    'Vorgang für das Beispieljournal fehlgeschlagen: {error}',
  'command.open-sample-journal': 'Beispieljournal öffnen',
  'command.exit-sample-journal': 'Beispieljournal verlassen',
  'command.reset-sample-journal': 'Beispieljournal zurücksetzen',
  'sample.notice.busy':
    'Ein anderer Vorgang für das Beispieljournal wird bereits ausgeführt.',
  'account.prop-challenge.field.help-label': 'Hilfe: {field}',
  'account.prop-challenge.payout-rules.help.cycle':
    'Misst die Wartezeit anhand von Einstiegstagen, Tagen mit Mindest-Nettogewinn oder verstrichenen Kalendertagen. Ohne Wartezyklus entfällt nur diese Tagesanforderung.',
  'account.prop-challenge.payout-rules.help.days':
    'Erforderliche Tage des gewählten Zyklus: Einstiegstage, Tage mit ausreichendem realisiertem Nettogewinn oder vollständige 24-Stunden-Zeiträume.',
  'account.prop-challenge.payout-rules.help.daily-profit':
    'Realisierter Mindest-Nettogewinn pro Tag nach Kosten. Trades werden nach deinem Handelstagesende zusammengefasst. Der Schwellenwert muss größer als null sein.',
  'account.prop-challenge.payout-rules.help.qualifying-days':
    'Zusätzliche Gewinntage neben dem Wartezyklus. Beide Anforderungen müssen im aktuellen Auszahlungszyklus erfüllt sein.',
  'account.prop-challenge.payout-rules.help.profitable-days':
    'Anzahl verschiedener Tage, deren realisierter Nettogewinn im aktuellen Zyklus den Tagesmindestgewinn erreicht.',
  'account.prop-challenge.payout-rules.help.anchor':
    'Kalenderwartezeit beginnt am Zyklusstart oder beim ersten Einstieg im Zyklus. Bei aktivierter Rücksetzung beginnt eine erfasste Auszahlung den nächsten Zyklus.',
  'account.prop-challenge.payout-rules.help.elapsed-hours':
    'Stunden seit dem ersten Einstieg im aktuellen Zyklus. Ohne Trade startet die Uhr nicht. Leer deaktiviert diese Anforderung.',
  'account.prop-challenge.payout-rules.help.request-window':
    'Anträge an jedem Tag oder nur an ausgewählten Wochentagen in der festgelegten Zeitzone. Andere Anforderungen gelten weiterhin.',
  'account.prop-challenge.payout-rules.help.time-zone':
    'Zeitzone für erlaubte Antragstage, etwa America/New_York. Ändert nicht dein Handelstagesende.',
  'account.prop-challenge.payout-rules.help.request-days':
    'Erlaubte Wochentage in der gewählten Zeitzone. Mindestens einen Tag auswählen.',
  'account.prop-challenge.payout-rules.help.minimum-balance':
    'Erforderlicher Kontostand vor Auszahlung; nicht die Untergrenze zur Berechnung verfügbaren Gewinns. Leer deaktiviert die Anforderung.',
  'account.prop-challenge.payout-rules.help.cycle-profit':
    'Erforderlicher realisierter Netto-Handelsgewinn im aktuellen Zyklus. Einzahlungen und Kontostandskorrekturen zählen nicht. Leer deaktiviert diese Anforderung.',
  'account.prop-challenge.payout-rules.help.profit-schedule':
    'Kommagetrennte Mindestgewinne für Auszahlung 1, 2 und folgende. Ersetzt den einzelnen Mindest-Zyklusgewinn.',
  'account.prop-challenge.payout-rules.help.repeat-final':
    'Verwendet den letzten Planwert auch für spätere, nicht aufgeführte Auszahlungsnummern.',
  'account.prop-challenge.payout-rules.help.positive-cycle':
    'Nach der ersten erfassten Auszahlung muss der realisierte Netto-Handelsgewinn des Zyklus strikt über null liegen.',
  'account.prop-challenge.payout-rules.help.consistency':
    'Größter Tagesgewinn geteilt durch realisierten Netto-Zyklusgewinn. Verlusttage senken den Gesamtgewinn und können den Prozentsatz erhöhen. Leer deaktiviert das Limit.',
  'account.prop-challenge.payout-rules.help.consistency-schedule':
    'Kommagetrennte Grenzen des besten Tages je Auszahlungsnummer. Ersetzt das einzelne Konsistenzlimit.',
  'account.prop-challenge.payout-rules.help.availability':
    'Berechnet beantragbaren Gewinn oberhalb des Phasen-Startkontostands oder einer gewählten Untergrenze. Prozentsätze und weitere Limits gelten weiterhin.',
  'account.prop-challenge.payout-rules.help.balance-floor':
    'Vom verfügbaren Gewinn ausgeschlossener Kontostand. Der auszahlbare Anteil gilt nur für den Überschuss; die Drawdown-Regel bleibt unverändert.',
  'account.prop-challenge.payout-rules.help.request-percent':
    'Beantragbarer Prozentsatz des Kontostands oberhalb der gewählten Untergrenze. Antrags- und Neugewinn-Limits können ihn weiter reduzieren.',
  'account.prop-challenge.payout-rules.help.minimum-request':
    'Kleinster erlaubter Auszahlungsantrag. Der berechnete verfügbare Betrag muss ebenfalls dieses Minimum erreichen.',
  'account.prop-challenge.payout-rules.help.maximum':
    'Feste Obergrenze, nur erste Auszahlung, Plan je Auszahlungsnummer oder Anteil am Zyklusgewinn. Ohne Maximum entfällt nur diese Obergrenze.',
  'account.prop-challenge.payout-rules.help.maximum-amount':
    'Maximaler Bruttoantrag vor Gewinnaufteilung. Verfügbarer Gewinn und weitere Limits können den Betrag reduzieren.',
  'account.prop-challenge.payout-rules.help.first-maximum':
    'Bruttolimit nur für die erste Auszahlung dieser Phase. Danach entfällt dieses Limit; andere Grenzen bleiben bestehen.',
  'account.prop-challenge.payout-rules.help.maximum-schedule':
    'Kommagetrennte Bruttolimits je Auszahlung. Ohne Wiederholung des letzten Werts gilt für spätere, nicht gelistete Auszahlungen ein Limit von null.',
  'account.prop-challenge.payout-rules.help.maximum-percent':
    'Begrenzt den Bruttoantrag auf diesen Anteil des realisierten Netto-Zyklusgewinns. Unabhängig vom auszahlbaren Anteil des Kontostands.',
  'account.prop-challenge.payout-rules.help.lifetime-days':
    'Qualifizierende Tage der gesamten finanzierten Phase zur Freischaltung neuer Verfügbarkeits- und Antragslimits. Zyklusrücksetzungen löschen diesen Zähler nicht.',
  'account.prop-challenge.payout-rules.help.split-model':
    'Fester Trader-Anteil oder Raten nach kumulierten Bruttoauszahlungen beziehungsweise Gesamt-Kontogewinn. Die Aufteilung bestimmt den Erlös, nicht das Antragslimit.',
  'account.prop-challenge.payout-rules.help.trader-share':
    'Mit dieser Rate an den Trader gezahlter Anteil des Bruttoantrags. Der Rest gehört der Firma.',
  'account.prop-challenge.payout-rules.help.cumulative-threshold':
    'Erfasste Bruttoauszahlungen dieser Phase, ab denen die spätere Rate gilt. Ein schwellenüberschreitender Antrag wird anteilig mit beiden Raten aufgeteilt.',
  'account.prop-challenge.payout-rules.help.maximum-payouts':
    'Erlaubte Anzahl erfasster Auszahlungen in dieser Phase. Danach werden weitere blockiert. Leer bedeutet keine Anzahlbegrenzung.',
  'account.prop-challenge.payout-rules.help.maximum-outcome':
    'Nach der letzten Auszahlung: fortfahren, Konto beenden, Phase wechseln oder für Live-Prüfung qualifizieren. Prüfungsberechtigung ist keine automatische Genehmigung.',
  'account.prop-challenge.payout-rules.help.aftermath':
    'Kontostand und Drawdown nach erfasster Auszahlung: Antrag abziehen, abziehen und Untergrenze fixieren oder Startkontostand und Drawdown zurücksetzen.',
  'account.prop-challenge.payout-rules.help.drawdown-floor':
    'Bei entsprechender Auswahl nach Auszahlung fixierte Drawdown-Untergrenze. Der Restkontostand muss darüber bleiben.',
  'account.prop-challenge.payout-rules.help.first-exempt':
    'Für die erste Auszahlung dieser Phase gilt null als Mindest-Zyklusgewinn: Der realisierte Netto-Zyklusgewinn darf nicht negativ sein. Alle anderen Anforderungen gelten weiterhin.',
  'account.prop-challenge.payout-rules.help.reset-cycle':
    'Setzt Tage, Tagesgewinne, Zyklusgewinn und Konsistenz nach erfasster Auszahlung zurück. Phasenweite qualifizierende Tage bleiben erhalten; Vorschauen setzen nichts zurück.',
};
export default de;
