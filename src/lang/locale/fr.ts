

import type { Lang } from './en';

const fr: Lang = {
  'command.add-trade': 'Ajouter un nouveau trade',
  'command.quick-import-trades': 'Importer rapidement des trades',
  'command.import-trades-csv': 'Ouvrir Trade Import',
  'command.create-drc': 'Ouvrir le DRC (rapport quotidien)',
  'command.create-weekly-review': 'Ouvrir la revue hebdomadaire',
  'command.create-monthly-review': 'Ouvrir la revue mensuelle',
  'command.create-quarterly-review': 'Ouvrir la revue trimestrielle',
  'command.create-yearly-review': 'Ouvrir la revue annuelle',
  'command.open-dashboard': 'Ouvrir le tableau de bord de trading',
  'command.open-account-dashboard': 'Ouvrir le tableau de bord du compte',
  'command.open-trade-log': 'Ouvrir le journal des trades',
  'command.open-home': "Ouvrir la vue d'accueil",
  'command.open-position-size-calculator':
    'Ouvrir le calculateur de taille de position',
  'command.force-sync': 'Forcer la synchronisation des trades',
  'command.cancel-sync': 'Annuler la synchronisation des trades',
  'command.replay-onboarding': "Rejouer le flux d'intégration",
  'command.replay-current-view-guide': 'Rejouer le guide de la vue actuelle',
  'command.open-release-notes': 'Afficher les notes de version',
  'command.repair-trade-identities': 'Réparer les identités des trades',
  'command.open-layout-builder': 'Ouvrir le Layout Builder',
  'command.switch-template': 'Changer de modèle',
  'notice.guide.replay-unavailable':
    "Le système de guidage n'est pas encore prêt. Veuillez réessayer.",
  'notice.guide.no-active-view':
    'Ouvrez d’abord une vue Journalit prise en charge, puis exécutez cette commande.',
  'notice.guide.no-guide-for-view':
    "Aucun guide n'est encore enregistré pour cette vue ({viewType}).",
  'notice.guide.replay-failed':
    'Échec du démarrage du guide. Veuillez réessayer.',
  'notice.guide.replay-started': 'Guide redémarré pour cette vue.',
  'template.switch-title': 'Changer de layout',
  'template.switch-trade-title': 'Changer de layout de trade',
  'template.switch-review-title': 'Changer de layout {type}',
  'template.no-template': 'Aucun modèle',
  'template.label': 'Modèle',
  'template.assign-to-note': 'Attribuer un modèle à cette note',
  'template.switch-action': 'Changer de layout',
  'template.review-type.drc': 'DRC',
  'template.review-type.weekly': 'hebdomadaire',
  'template.review-type.monthly': 'mensuelle',
  'template.review-type.quarterly': 'trimestrielle',
  'template.review-type.yearly': 'annuelle',
  'template.review-type.review': 'revue',
  'template.builder.select-template': 'Sélectionnez un layout à modifier',
  'template.builder.loading': 'Chargement du Layout Builder...',
  'template.builder.create-from-sidebar':
    'Ou créez-en un nouveau depuis la barre latérale',
  'template.builder.snippet-coming-soon':
    "L'éditeur d'extraits sera bientôt disponible",
  'template.preview.empty': 'Aucun widget dans ce modèle',
  'template.preview.summary': 'Modèle {type} - {count} widgets',
  'template.preview.mode': 'Mode Aperçu',
  'template.preview.markdown-zone-placeholder':
    'Zone Markdown - les utilisateurs écrivent ici',
  'template.preview.markdown-zone-placeholder-with-id':
    'Zone Markdown ({id}) - les utilisateurs écrivent ici',
  'template.preview.widget.game-performance-desc':
    'Répartitions des notes mentales/techniques',
  'template.preview.widget.unknown-desc': 'Type de widget inconnu',
  'template.section.forecast': 'Prévision',
  'template.section.performance': 'Performance',
  'template.section.review': 'Revue',
  'template.question.drc.q1': 'Qu’ai-je bien fait aujourd’hui ?',
  'template.question.drc.q2': 'Que pourrais-je améliorer ?',
  'template.question.drc.q3':
    'Sur quoi vais-je me concentrer pour la prochaine séance ?',
  'template.question.weekly.q1':
    "Qu'est-ce qui a bien fonctionné cette semaine ?",
  'template.question.weekly.q2':
    "Qu'est-ce qui n'a pas fonctionné cette semaine ?",
  'template.question.weekly.q3': 'Quels setups ont été les plus rentables ?',
  'template.question.weekly.q4':
    'Quelles erreurs me coûtent le plus d’argent ?',
  'template.question.weekly.q5':
    'Que pourrais-je améliorer pour la semaine prochaine ?',
  'template.question.monthly.q1':
    'Quels ont été les principaux enseignements de ce mois-ci ?',
  'template.question.monthly.q2':
    'Quelles stratégies ont été les plus performantes ?',
  'template.question.monthly.q3':
    'Quelles tendances puis-je remarquer dans mon trading ?',
  'template.question.monthly.q4':
    'Quels sont mes objectifs pour le mois prochain ?',
  'template.question.monthly.q5':
    'Comment puis-je améliorer ma gestion des risques ?',
  'template-picker.empty': 'Aucun layout disponible.',
  'template-picker.close': 'Fermer',
  'template-picker.built-in': '(intégré)',
  'template-picker.badge.default': 'Par défaut',
  'template-picker.badge.current': 'Actuel',
  'template-picker.cancel': 'Annuler',
  'auth.title.already-logged-in': 'Déjà connecté',
  'auth.desc.already-logged-in': 'Vous êtes déjà connecté{email}.',
  'auth.title.sign-in': 'Connectez-vous à Journalit',
  'auth.desc.email':
    'Entrez votre adresse e-mail pour recevoir un code de vérification pour accéder à la version bêta privée.',
  'auth.label.email': 'Adresse e-mail',
  'auth.placeholder.email': 'votre.email@exemple.com',
  'auth.button.send-code': 'Envoyer le code de vérification',
  'auth.button.sending': 'Envoi...',
  'auth.desc.code':
    'Nous avons envoyé un code de vérification à 6 chiffres à {email}. Veuillez le saisir ci-dessous pour finaliser votre connexion.',
  'auth.label.code': 'Code de vérification',
  'auth.placeholder.code': '123456',
  'auth.button.verify': 'Vérifier et se connecter',
  'auth.button.verifying': 'Vérification...',
  'auth.button.resend': 'Renvoyer le code',
  'auth.footer.trouble':
    'Vous rencontrez des problèmes ? Le code de vérification expire dans 15 minutes.',
  'auth.footer.resend-wait':
    'Vous pouvez demander un nouveau code dans {seconds} secondes.',
  'auth.footer.resend-now':
    'Vous pouvez maintenant renvoyer le code en utilisant le bouton ci-dessus.',
  'auth.footer.enter-email':
    'Entrez votre e-mail pour recevoir un code de vérification.',
  'auth.error.invalid-email': 'Veuillez saisir une adresse e-mail valide',
  'auth.error.enter-code': 'Veuillez entrer le code de vérification',
  'auth.error.code-digits':
    'Le code de vérification doit être composé de 6 chiffres',
  'auth.error.too-many-requests':
    'Vous avez demandé trop de codes. Veuillez attendre 30 minutes et réessayer.',
  'auth.error.send-failed': "Échec de l'envoi du code de vérification",
  'auth.error.verify-failed': 'Échec de la vérification du code',
  'auth.error.resend-failed': 'Échec du renvoi du code de vérification',
  'auth.error.invalid-code': 'Code de vérification invalide',
  'auth.status.disconnected': 'Déconnecté',
  'auth.error.token-expired':
    'Votre session a expiré. Veuillez vous reconnecter pour continuer à utiliser les fonctionnalités Pro.',
  'auth.error.failed': "Impossible de s'authentifier. Veuillez réessayer.",
  'auth.error.failed-reason': "Impossible d'authentifier : {reason}",
  'auth.error.token-invalid': "Le jeton n'est plus valide",
  'auth.error.server-validation-failed': 'La validation du serveur a échoué',
  'auth.error.invalid-user-data': 'Données utilisateur invalides reçues',
  'auth.error.needs-auth':
    'Connectez-vous pour accéder aux fonctionnalités Pro. Les fonctionnalités de base restent disponibles.',
  'auth.error.needs-premium': 'Fonctionnalité Pro',
  'auth.error.needs-premium-desc':
    "Il s'agit d'une fonctionnalité Pro. Visitez notre site Web pour vous abonner et la débloquer.",
  'auth.error.network-error': 'Erreur de connexion',
  'auth.error.network-error-verify':
    "Impossible de vérifier l'accès Pro. Vérifiez votre connexion ou continuez avec les fonctionnalités de base.",
  'auth.error.network-error-basic':
    'Mode hors ligne. Les fonctionnalités de base restent disponibles.',
  'auth.error.offline-expired':
    'Le délai de grâce hors ligne a expiré. Veuillez vous reconnecter pour continuer à utiliser les fonctionnalités Pro.',
  'auth.expiry-warning-tomorrow':
    'Votre session expire demain. Veuillez vous reconnecter bientôt pour continuer à utiliser les fonctionnalités Pro.',
  'auth.expiry-warning-days':
    'Votre session expire dans {days} jours. Veuillez vous reconnecter pour continuer à utiliser les fonctionnalités Pro.',
  'auth.offline.active':
    'Mode hors ligne. Certaines fonctionnalités Pro peuvent être limitées.',
  'auth.offline.grace-remaining':
    'Délai de grâce hors ligne : {days} jours restants',
  'form.modal.unsaved-changes.title': 'Modifications non enregistrées',
  'form.modal.unsaved-changes.body1':
    'Vous avez des modifications non enregistrées dans le formulaire de trade.',
  'form.modal.unsaved-changes.body2':
    'Êtes-vous sûr de vouloir fermer sans enregistrer ?',
  'form.modal.unsaved-changes.continue': 'Continuer la modification',
  'form.modal.unsaved-changes.discard': 'Ignorer les modifications',
  'template-builder.modal.unsaved-changes.title':
    'Modifications non enregistrées',
  'template-builder.modal.unsaved-changes.body1':
    'Vous avez des modifications non enregistrées dans ce modèle.',
  'template-builder.modal.unsaved-changes.body2':
    'Êtes-vous sûr de vouloir changer sans enregistrer ?',
  'template-builder.modal.unsaved-changes.continue':
    'Continuer la modification',
  'template-builder.modal.unsaved-changes.discard': 'Ignorer les modifications',
  'template-builder.modal.delete.title': 'Supprimer le layout',
  'template-builder.modal.delete.body':
    'Êtes-vous sûr de vouloir supprimer « {name} » ?',
  'template-builder.modal.delete.warning':
    'Cette action ne peut pas être annulée.',
  'template-builder.modal.delete.cancel': 'Annuler',
  'template-builder.modal.delete.confirm': 'Supprimer',
  'tradelog.settings.modal.unsaved-changes.body1':
    'Vous avez des modifications non enregistrées dans les paramètres de colonne.',
  'tradelog.settings.modal.unsaved-changes.body2':
    'Êtes-vous sûr de vouloir fermer sans enregistrer ?',
  'notice.error.missed-trade-service-init':
    'Le service des trades manqués n’est pas initialisé. Veuillez patienter un moment et réessayer.',
  'notice.error.backtest-trade-service-init':
    'Le service des trades de backtest n’est pas initialisé. Veuillez patienter un moment et réessayer.',
  'notice.trade-updated': '{type} mis à jour : {path}',
  'notice.trade-created': '{type} créé : {path}',
  'notice.new-trade-created':
    '📈 Nouveau trade créé : {instrument} {direction}',
  'notice.error.trade-update-failed':
    'Échec de la mise à jour de {type} : {error}',
  'notice.error.trade-create-failed':
    'Échec de la création de {type} : {error}',
  'form.section.trade-details': 'Détails du trade',
  'form.section.trading-costs': 'Frais de trading',
  'form.section.risk-management': 'Gestion des risques',
  'form.section.take-profits': 'Objectifs de gain',
  'form.section.analysis-thesis': 'Analyse & Thèse',
  'form.section.custom-fields': 'Champs personnalisés',
  'form.section.custom-fields-desc':
    'Champs personnalisés définis dans les paramètres de votre plugin. Ces champs seront enregistrés dans le frontmatter de votre trade.',
  'form.section.custom-fields-empty':
    'Aucun champ personnalisé configuré. Accédez à Paramètres → Personnalisation → Champs de trading personnalisés pour ajouter des champs personnalisés.',
  'form.section.custom-fields-empty-title':
    'Aucun champ avancé pour le moment.',
  'form.section.custom-fields-empty-desc':
    'Créez des champs de trading personnalisés dans Paramètres → Personnalisation → Champs de trading personnalisés.',
  'form.section.attachments': 'Pièces jointes',
  'form.tab.basic': 'Général',
  'form.tab.details': 'Détails',
  'form.tab.advanced': 'Avancé',
  'form.field.account': 'Compte',
  'form.field.asset-type': "Type d'actif",
  'form.field.asset-type.stock': 'Action',
  'form.field.asset-type.options': 'Options',
  'form.field.asset-type.futures': 'Contrats à terme',
  'form.field.asset-type.forex': 'Forex',
  'form.field.asset-type.crypto': 'Cryptomonnaie',
  'form.field.asset-type.cfd': 'CFD',
  'form.field.direction': 'Sens',
  'form.field.direction.long': 'Achat',
  'form.field.direction.short': 'Vente',
  'form.field.commission': 'Commission',
  'form.field.commission-type': 'Type',
  'form.field.rebate': 'Rebate',
  'form.field.swap': 'Swap',
  'form.field.swap-tooltip.forex':
    'Différence de taux d’intérêt entre les devises lors de la détention de positions pendant la nuit',
  'form.field.swap-tooltip.cfd':
    'Coût de financement au jour le jour pour les positions CFD à effet de levier',
  'form.field.swap-tooltip.default':
    'Coût de financement au jour le jour facturé/crédité pour le maintien de positions',
  'form.field.other-fees': 'Autres frais',
  'form.field.stop-loss': 'Stop-loss',
  'form.field.take-profit': 'Objectif de gain',
  'form.field.take-profit-short': 'N°',
  'form.field.target-price': 'Prix cible',
  'form.field.close-percent': '% clôturé',
  'form.field.risk-amount': 'Montant du risque',
  'form.field.profit-loss': 'Bénéfice/Perte',
  'form.field.total-pnl': 'P&L de base du trade',
  'form.field.realized-pnl': 'P&L réalisé',
  'form.field.total-costs': 'Coûts totaux :',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Erreur',
  'form.field.custom-tags': 'Balises personnalisées',
  'form.field.trade-thesis': 'Thèse de trading',
  'form.field.time': 'Heure',
  'form.field.price': 'Prix',
  'form.field.size': 'Taille',
  'form.field.entries': 'Entrées',
  'form.field.exits': 'Sorties',
  'form.field.dividends': 'Dividendes',
  'form.field.dividend-amount': 'Montant du dividende',
  'form.field.optional': '(facultatif)',
  'form.field.closed': 'fermé',
  'form.field.incl-costs': '(y compris les frais)',
  'form.field.commission-type.fixed': 'Fixe',
  'form.field.commission-type.percentage': 'Pourcentage (%)',
  'form.calculated': 'Calculé',
  'form.account-empty-state.title': "Créez un compte avant d'ajouter un trade",
  'form.account-empty-state.create-account': 'Créer un compte',
  'form.account-empty-state.submit-disabled':
    'Créez d’abord un compte pour enregistrer ce trade.',
  'form.empty.take-profits': 'Aucun objectif de gain pour le moment',
  'form.action.add-take-profit': 'Ajouter un take profit',
  'form.action.remove-take-profit': 'Supprimer le take profit',
  'form.field.position-size': 'Taille de position',
  'form.field.position-size.shares': 'Actions',
  'form.field.position-size.contracts': 'Contrats',
  'form.field.position-size.lots': 'Lots',
  'form.field.position-size.amount': 'Montant',
  'form.field.position-size.cfd-units': 'Unités CFD',
  'form.field.instrument': 'Instrument',
  'form.field.instrument.ticker': 'Symbole',
  'form.field.instrument.option-symbol': "Symbole d'option",
  'form.field.instrument.future-symbol': 'Symbole de futures',
  'form.field.instrument.forex-pair': 'Paire Forex',
  'form.field.instrument.crypto-symbol': 'Symbole crypto',
  'form.field.instrument.cfd-symbol': 'Symbole CFD',
  'form.field.exchange': 'Bourse/Exchange',
  'form.field.expiration-date': "Date d'expiration",
  'form.field.strike-price': "Prix ​​d'exercice",
  'form.field.contract-size': 'Taille du contrat',
  'form.field.option-type': "Type d'option",
  'form.field.option-type.call': 'Option d’achat',
  'form.field.option-type.put': 'Option de vente',
  'form.field.dollars-per-point': 'Dollars par point',
  'form.field.tick-size': 'Taille du tick',
  'form.field.tick-value': 'Valeur du tick',
  'form.field.lot-size': 'Taille du lot',
  'form.field.custom-lot-size': 'Taille du lot personnalisé',
  'form.field.pip-value': 'Valeur du pip',
  'form.field.leverage-ratio': 'Ratio de levier',
  'form.field.lot-size.standard': 'Standard (100 000)',
  'form.field.lot-size.mini': 'Mini (10 000)',
  'form.field.lot-size.micro': 'Micro (1 000)',
  'form.field.lot-size.custom': 'Personnalisé',
  'form.field.image-url-placeholder':
    "Ou collez l'URL de l'image (TradingView, etc.)...",
  'form.field.image-duplicate-error': 'Cette image est déjà ajoutée.',
  'form.field.trade-image-alt': 'Image de trading',
  'image.loading': 'Chargement...',
  'image.load-failed': "Échec du chargement de l'image",
  'form.field.value-dollar': 'Valeur ($)',
  'form.field.dollar-amount-placeholder': 'Montant en dollars',
  'form.field.direct-pnl-placeholder':
    'Saisissez le profit ou la perte du trade avant dividendes',
  'form.field.mae-dollar-placeholder': 'MAE maximum en dollars',
  'form.field.mfe-dollar-placeholder': 'MFE maximum en dollars',
  'form.field.mae-placeholder-currency': 'MAE maximum en {currency}',
  'form.field.mfe-placeholder-currency': 'MFE maximum en {currency}',
  'form.placeholder.select-accounts': 'Sélectionnez les comptes',
  'form.placeholder.commission': '0,15',
  'form.placeholder.commission-alt': '5,50',
  'form.placeholder.rebate': 'Remise/crédit de commission',
  'form.placeholder.swap': 'Financement au jour le jour',
  'form.placeholder.other-fees': 'Frais de plateforme/réglementation',
  'form.placeholder.dividend-amount': 'Montant en espèces, positif ou négatif',
  'form.placeholder.stop-loss': 'Prix ​​​​stop-loss en option',
  'form.placeholder.target-price': 'Prix cible',
  'form.placeholder.close-percent': '50 pour cent',
  'form.placeholder.risk-amount': 'Risque prévu en devise',
  'form.placeholder.custom-tag':
    'Tapez une balise personnalisée et appuyez sur Entrée',
  'form.placeholder.thesis': 'Saisissez votre thèse pour ce trade...',
  'form.placeholder.pnl': 'Saisissez le profit ou la perte total(e)',
  'form.placeholder.exchange-stock': 'par exemple, NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'par exemple, Binance, Coinbase',
  'form.placeholder.futures-point-value': 'ex : 50 pour ES1',
  'form.placeholder.leverage': 'par exemple, 100 pour 1:100',
  'form.entry-exit.add-entry': '+ Ajouter une entrée',
  'form.entry-exit.add-exit': '+ Ajouter une sortie',
  'form.entry-exit.remove-entry': "Supprimer l'entrée",
  'form.entry-exit.remove-exit': 'Supprimer la sortie',
  'form.dividends.add-dividend': '+ Ajouter un dividende',
  'form.dividends.remove-dividend': 'Supprimer le dividende',
  'form.dividends.total-dividends': 'Dividendes totaux :',
  'form.entry-exit.total-entry-size': "Taille totale de l'entrée :",
  'form.entry-exit.remaining-position': 'Position restante :',
  'form.entry-exit.open': '(Ouverte)',
  'form.entry-exit.closed': '(Fermée)',
  'form.entry-exit.direct-pnl':
    'Saisir directement le P&L de base du trade au lieu des prix',
  'form.entry-exit.direct-pnl-desc':
    'Saisissez le profit/la perte du trade avant dividendes. Les commissions et frais seront toujours appliqués séparément.',
  'form.entry-exit.calc-pnl':
    'Calculer le P&L à partir des prix d’entrée/sortie et des tailles de position.',
  'form.trade-type.title': 'Type de trade',
  'form.trade-type.subtitle': 'Choisissez le type de trade que vous créez',
  'form.trade-type.regular': 'Trade classique',
  'form.trade-type.regular-desc':
    "Trade normal avec données complètes d'entrée et de sortie",
  'form.trade-type.missed': 'Trade manqué',
  'form.trade-type.missed-desc':
    'Opportunité de trading que vous avez manquée - Champs P&L et Compte facultatifs',
  'form.trade-type.backtest': 'Trade de backtest',
  'form.trade-type.backtest-desc':
    "Scénario de backtesting à des fins d'analyse",
  'form.trade-type.missed-reason': 'Pourquoi avez-vous raté ce trade ?',
  'form.trade-type.missed-reason-placeholder':
    'Décrivez pourquoi vous avez raté cette opportunité de trading...',
  'button.save': 'Enregistrer',
  'button.cancel': 'Annuler',
  'button.done': 'Fait',
  'button.edit': 'Modifier',
  'button.delete': 'Supprimer',
  'button.update': 'Mettre à jour',
  'button.add': 'Ajouter',
  'button.create': 'Créer',
  'button.reset': 'Réinitialiser',
  'button.reset-to-defaults': 'Réinitialiser aux valeurs par défaut',
  'button.close': 'Fermer',
  'button.confirm': 'Confirmer',
  'button.submit': 'Soumettre',
  'button.back': 'Retour',
  'button.add-trade': 'Ajouter un trade',
  'button.update-trade': 'Mettre à jour le trade',
  'button.save-changes': 'Enregistrer les modifications',
  'button.create-trade': 'Créer un trade',
  'button.delete-all': 'Supprimer tout',
  'button.clear-all': 'Tout effacer',
  'button.save-name-only': 'Enregistrer le nom uniquement',
  'button.cancel-action': "Annuler l'action",
  'button.cancel-reset': 'Annuler la réinitialisation',
  'button.proceed-anyway': 'Continuer quand même',
  'button.mark-reviewed': 'Marquer comme révisé',
  'button.maybe-later': 'Peut-être plus tard',
  'button.upgrade-now': 'Mettre à niveau maintenant',
  'button.add-first-goal': 'Ajouter votre premier objectif',
  'button.add-first-event': 'Ajouter votre premier événement',
  'button.create-daily-review': 'Créer une revue quotidienne',
  'button.apply': 'Appliquer',
  'button.apply-settings': 'Appliquer les paramètres',
  'button.learn-more': 'En savoir plus',
  'button.upload-image': 'Télécharger une image',
  'button.discord': 'Discord',
  'form.error.image-upload-unavailable':
    "Téléchargement d'image non disponible",
  'trade.header.unknown-instrument': 'Instrument inconnu',
  'validation.edit': 'MODIFIER',
  'validation.fix-errors': 'Veuillez corriger les erreurs suivantes :',
  'validation.basic-tab-errors.one':
    "L'onglet de base comporte une erreur {count}",
  'validation.basic-tab-errors.few':
    "L'onglet de base contient des erreurs {count}",
  'validation.basic-tab-errors.many':
    "L'onglet de base contient des erreurs {count}",
  'validation.basic-tab-errors.other':
    "L'onglet de base contient des erreurs {count}",
  'validation.details-tab-errors.one':
    "L'onglet Détails comporte une erreur {count}",
  'validation.details-tab-errors.few':
    "L'onglet Détails contient des erreurs {count}",
  'validation.details-tab-errors.many':
    "L'onglet Détails contient des erreurs {count}",
  'validation.details-tab-errors.other':
    "L'onglet Détails contient des erreurs {count}",
  'validation.advanced-tab-errors.one':
    "L'onglet Avancé comporte une erreur {count}",
  'validation.advanced-tab-errors.few':
    "L'onglet Avancé contient des erreurs {count}",
  'validation.advanced-tab-errors.many':
    "L'onglet Avancé contient des erreurs {count}",
  'validation.advanced-tab-errors.other':
    "L'onglet Avancé contient des erreurs {count}",
  'validation.complete-required':
    'Veuillez remplir tous les champs obligatoires',
  'validation.map-required-fields':
    "Veuillez mapper tous les champs obligatoires avant d'importer",
  'validation.missed-trade-requires-exit':
    'Les trades manqués doivent avoir des données de sortie avec des prix non nuls. Ils représentent des opportunités déjà passées, vous devez donc préciser quel aurait été le prix de sortie.',
  'trade.validation.entry-required': 'Au moins une entrée est requise.',
  'trade.validation.entry-time-required': 'L’heure d’entrée est obligatoire.',
  'trade.validation.entry-price-required': "Le prix d'entrée est obligatoire.",
  'trade.validation.entry-size-positive':
    'La taille de l’entrée doit être supérieure à zéro.',
  'trade.validation.exit-required-closed':
    'Au moins une sortie est requise pour les trades fermés.',
  'trade.validation.exit-time-required': 'Un temps de sortie est requis.',
  'trade.validation.exit-price-required': 'Le prix de sortie est obligatoire.',
  'trade.validation.exit-size-positive':
    'La taille de sortie doit être supérieure à zéro.',
  'trade.validation.exit-size-exceeds-entry':
    'La taille totale de sortie ne peut pas dépasser la taille totale d’entrée.',
  'trade.validation.exit-before-entry':
    'Les sorties ne peuvent pas avoir lieu avant la première entrée.',
  'trade.validation.dividend-time-required':
    'Un temps de dividende est requis.',
  'trade.validation.dividend-amount-nonzero':
    'Le montant du dividende doit être un nombre non nul.',
  'trade.validation.direct-pnl-required':
    'Veuillez saisir une valeur de profit/perte.',
  'trade.validation.entry-time-select':
    "Veuillez sélectionner une heure d'entrée.",
  'trade.validation.direction-required': 'Veuillez sélectionner un sens.',
  'trade.validation.asset-type-required':
    "Veuillez sélectionner un type d'actif.",
  'trade.validation.ticker-required': 'Veuillez sélectionner un téléscripteur.',
  'trade.validation.ticker-invalid':
    'Entrez un symbole boursier valide (lettres, chiffres et points uniquement).',
  'trade.validation.account-required':
    'Veuillez sélectionner au moins un compte.',
  'trade.validation.exit-time-select':
    'Veuillez sélectionner une heure de sortie.',
  'trade.validation.entry-price-invalid':
    "Veuillez saisir un prix d'entrée valide.",
  'trade.validation.exit-price-invalid':
    'Veuillez saisir un prix de sortie valide.',
  'trade.validation.position-size-invalid':
    'Veuillez entrer une taille de position valide.',
  'trade.validation.exit-time-after-entry':
    'L’heure de sortie doit être postérieure à l’heure d’entrée.',
  'trade.validation.expiration-date-required':
    "Veuillez sélectionner une date d'expiration.",
  'trade.validation.strike-price-required':
    "Veuillez saisir un prix d'exercice.",
  'trade.validation.option-type-required':
    "Veuillez sélectionner un type d'option (call ou put).",
  'trade.validation.contract-size-positive':
    'La taille du contrat doit être supérieure à zéro.',
  'trade.validation.dollars-per-point-min':
    'Veuillez saisir des dollars par point (min 0,01).',
  'trade.validation.lot-size-nonnegative':
    'La taille du lot ne peut pas être négative.',
  'trade.validation.leverage-positive':
    'Le ratio de levier doit être supérieur à zéro.',
  'trade.validation.commission-type-invalid':
    'Le type de commission doit être soit « fixe », soit « en pourcentage ».',
  'trade.validation.commission-number': 'La commission doit être un nombre.',
  'trade.validation.commission-percentage-range':
    'Le pourcentage de commission doit être compris entre 0 et 100.',
  'trade.validation.rebate-options-only':
    "La remise n'est autorisée que pour les trades sur options.",
  'trade.validation.rebate-number': 'La remise doit être un nombre.',
  'trade.validation.rebate-positive':
    'La remise doit être une valeur positive.',
  'trade.validation.swap-invalid': 'Montant de swap invalide.',
  'trade.validation.fees-number': 'Les frais doivent être un nombre.',
  'trade.validation.risk-number': 'Le montant du risque doit être un nombre.',
  'trade.validation.risk-valid-number':
    'Le montant du risque doit être un nombre valide.',
  'trade.validation.risk-positive':
    'Le montant du risque doit être supérieur à zéro.',
  'trade.validation.stop-loss-number': 'Le stop-loss doit être un nombre.',
  'trade.validation.stop-loss-valid-number':
    'Le stop-loss doit être un nombre valide.',
  'trade.validation.take-profit-price-required': 'Le prix cible est requis.',
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
    'Les pourcentages de clôture des objectifs ne peuvent pas dépasser 100.',
  'validation.custom-field.key-empty': 'La clé du champ ne peut pas être vide',
  'validation.custom-field.key-conflict':
    'Ce nom de champ est en conflit avec les champs de trading intégrés',
  'validation.custom-field.key-format':
    'La clé de champ doit commencer par une lettre et contenir uniquement des lettres, des chiffres et des traits de soulignement.',
  'validation.custom-field.required': '{label} est requis',
  'validation.custom-field.text': '{label} doit être un texte',
  'validation.custom-field.min-length':
    '{label} doit contenir au moins {minLength} caractères',
  'validation.custom-field.max-length':
    '{label} ne doit pas contenir plus de {maxLength} caractères',
  'validation.custom-field.pattern-invalid':
    "Le format {label} n'est pas valide",
  'validation.custom-field.pattern-invalid-pattern':
    '{label} a un modèle de validation non valide',
  'validation.custom-field.number': '{label} doit être un nombre',
  'validation.custom-field.min': '{label} doit être au moins {min}',
  'validation.custom-field.max': '{label} ne doit pas dépasser {max}',
  'validation.custom-field.selection': '{label} doit être une sélection valide',
  'validation.custom-field.option': '{label} doit être une option valide',
  'validation.custom-field.array': '{label} doit être un tableau de sélections',
  'validation.custom-field.invalid-option':
    '{label} contient une option non valide : {item}',
  'validation.custom-field.date': '{label} doit être une date valide',
  'validation.custom-field.time': '{label} doit être une heure valide',
  'validation.custom-field.time-format':
    "{label} doit être un format d'heure valide (HH:MM, HH:MM:SS ou 12 heures avec AM/PM)",
  'validation.custom-field.time-values':
    '{label} contient des valeurs de temps non valides',
  'notice.verification-sent':
    'Code de vérification envoyé ! Vérifiez votre e-mail.',
  'notice.login-success': 'Connecté avec succès !',
  'notice.new-verification-sent':
    'Nouveau code de vérification envoyé ! Vérifiez votre e-mail.',
  'notice.logout-success': 'Déconnexion réussie',
  'notice.ftp-created': "Informations d'identification FTP créées avec succès",
  'notice.ftp-reset':
    'Réinitialisation du mot de passe FTP avec succès ! Enregistrez le nouveau mot de passe.',
  'notice.template-saved': 'Layout enregistré',
  'notice.template-created': 'Layout créé',
  'notice.template-duplicated': 'Layout dupliqué',
  'notice.template-applied': 'Layout appliqué : {name}',
  'notice.template-deleted': 'Layout supprimé',
  'notice.default-template-updated': 'Layout par défaut mis à jour',
  'notice.tradelog-saved': 'Paramètres TradeLog enregistrés avec succès',
  'notice.settings-exported': 'Paramètres exportés vers {filename}',
  'notice.settings-imported':
    'Paramètres importés avec succès depuis v{version}. Redémarrez Obsidian pour appliquer toutes les modifications.',
  'notice.template-switched': 'Passé à : {name}',
  'notice.hotkey-set': 'Ensemble de raccourcis clavier : {hotkey}',
  'notice.auto-sync-toggled': 'Synchronisation automatique {status}',
  'notice.auto-sync-enabled': 'activé',
  'notice.auto-sync-disabled': 'désactivé',
  'notice.reset-items': 'Réinitialiser les éléments aux valeurs par défaut',
  'notice.reset-timeframes': 'Réinitialiser les délais aux valeurs par défaut',
  'notice.custom-fields-imported':
    'Champs personnalisés {count} importés avec succès',
  'notice.csv-parsed': 'CSV/XLSX/XLS analysés avec succès : {count} lignes',
  'notice.csv-validation-failed':
    'Échec de la validation CSV/XLSX/XLS : {errors}',
  'notice.csv-parse-failed':
    "Échec de l'analyse du fichier CSV/XLSX/XLS : {error}",
  'notice.csv-complete-fields': 'Veuillez remplir tous les champs obligatoires',
  'notice.csv-invalid-selection': 'Sélection de broker/modèle non valide',
  'notice.csv-import-success': '{count} trades importés avec succès !',
  'notice.csv-import-partial':
    '{count} trades importés, ignorées {duplicates} doublons',
  'notice.csv-import-failed': "Échec de l'importation : {error}",
  'notice.csv-import-report-copy-failed':
    "Échec de la copie du rapport d'importation",
  'notice.csv-template-saved':
    'Modèle enregistré. Vous pouvez désormais sélectionner « {name} » pour les futures importations.',
  'notice.csv-template-updated': 'Modèle "{name}" mis à jour avec succès',
  'notice.csv-template-update-failed':
    'Échec de la mise à jour du modèle : {error}',
  'notice.csv-template-save-failed':
    "Échec de l'enregistrement du modèle : {error}",
  'notice.csv-template-deleted': 'Modèle "{name}" supprimé',
  'notice.csv-template-delete-failed':
    'Échec de la suppression du modèle : {error}',
  'notice.csv-template-imported': 'Modèle "{name}" importé avec succès',
  'notice.csv-symbol-mappings-created.one':
    'Création du mappage de symboles {count}',
  'notice.csv-symbol-mappings-created.few':
    'Création de mappages de symboles {count}',
  'notice.csv-symbol-mappings-created.many':
    'Création de mappages de symboles {count}',
  'notice.csv-symbol-mappings-created.other':
    'Création de mappages de symboles {count}',
  'notice.csv-symbol-mapping-skipped': 'Mappage des symboles ignoré',
  'notice.csv-missing-fields':
    "Veuillez mapper tous les champs obligatoires avant d'importer",
  'notice.setups-added': 'Ajout de setups aux trades {count}',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': "Ajout d'erreurs aux trades {count}",
  'notice.trades-deleted.one': '{count} trade supprimé',
  'notice.trades-deleted.few': '{count} trades supprimés',
  'notice.trades-deleted.many': '{count} trades supprimés',
  'notice.trades-deleted.other': '{count} trades supprimés',
  'notice.mark-reviewed.one': 'Marqué {count} trade comme révisé',
  'notice.mark-reviewed.few': '{count} trades marqués comme revus',
  'notice.mark-reviewed.many': '{count} trades marqués comme revus',
  'notice.mark-reviewed.other': '{count} trades marqués comme revus',
  'notice.error.template-name-required': 'Veuillez saisir un nom de modèle',
  'notice.error.template-name-exists': 'Le nom du modèle existe déjà',
  'notice.error.open-journalit':
    "Échec de l'ouverture de Journalit. Veuillez essayer de recharger Obsidian.",
  'notice.error.open-drc': "Échec de l'ouverture du DRC : {error}",
  'notice.error.open-dashboard':
    "Échec de l'ouverture du tableau de bord : {error}",
  'notice.error.open-trade-log':
    "Échec de l'ouverture du journal des trades : {error}",
  'notice.error.open-csv-import':
    "Échec de l'ouverture de l'importation CSV : {error}",
  'notice.error.open-account-dashboard':
    "Échec de l'ouverture du tableau de bord du compte : {error}",
  'notice.error.open-trade-form-edit':
    "Échec de l'ouverture du formulaire de trade en mode édition : {error}",
  'notice.error.open-weekly-review':
    "Échec de l'ouverture de la revue hebdomadaire : {error}",
  'notice.error.open-monthly-review':
    "Échec de l'ouverture de la revue mensuelle : {error}",
  'notice.error.open-quarterly-review':
    "Échec de l'ouverture de la revue trimestrielle : {error}",
  'notice.error.open-yearly-review':
    "Échec de l'ouverture de la revue annuelle : {error}",
  'notice.error.open-onboarding':
    "Échec de l'ouverture du flux d'intégration. Vérifiez la console pour plus de détails.",
  'notice.error.sync-trades':
    'Échec de la synchronisation des trades : {error}',
  'notice.error.open-release-notes':
    "Échec de l'ouverture des notes de version : {error}",
  'notice.trade-identity-repair-complete':
    "Réparation de l'identité du trade terminée : scanné {scanned}, rempli {backfilled}, réparé {duplicates} doublons.",
  'notice.error.repair-trade-identities':
    'Échec de la réparation des identités des trades : {error}',
  'notice.error.open-update-notification':
    "Échec de l'ouverture de la notification de mise à jour : {error}",
  'notice.error.open-layout-builder':
    "Échec de l'ouverture de Layout Builder : {error}",
  'notice.error.switch-template': 'Échec du changement de layout : {error}',
  'notice.error.switch-template-generic': 'Échec du changement de layout',
  'notice.error.plugin-not-available': 'Plugin non disponible',
  'notice.error.open-template-picker':
    "Échec de l'ouverture du sélecteur de layouts",
  'notice.error.no-active-file':
    "Aucun fichier actif. Ouvrez d'abord une note.",
  'notice.error.no-template-support':
    'Ce type de note ne prend pas en charge les modèles.',
  'notice.error.no-templates': 'Aucun layout disponible pour ce type de note.',
  'notice.error.asset-type-required':
    "Le type d'actif est requis lors de l'ajout d'un instrument",
  'notice.error.column-required': 'Au moins une colonne doit rester visible',
  'notice.error.save-settings':
    "Erreur lors de l'enregistrement des paramètres : {error}",
  'notice.error.sign-in-vault':
    'Veuillez vous connecter pour enregistrer votre vault.',
  'notice.error.sign-in-sync':
    'Veuillez vous connecter pour utiliser la synchronisation automatique.',
  'notice.error.restore-auth':
    "Échec de la restauration de l'authentification. Veuillez vous reconnecter depuis Paramètres → Auth.",
  'notice.error.export-settings':
    "Échec de l'exportation des paramètres. Vérifiez la console pour plus de détails.",
  'notice.error.import-settings':
    "Échec de l'importation des paramètres : {error}",
  'notice.error.reset-settings':
    'Échec de la réinitialisation des paramètres. Vérifiez la console pour plus de détails.',
  'notice.error.invalid-drc-date': 'Date de DRC invalide',
  'notice.error.invalid-drc-missed':
    'Date DRC invalide. Impossible de créer un trade manqué.',
  'notice.error.invalid-weekly-review-date':
    "Date de revue hebdomadaire invalide. Impossible d'enregistrer l'image de prévision.",
  'notice.error.cannot-change-folder-during-sync':
    'Impossible de modifier le chemin du dossier pendant la synchronisation. Veuillez attendre la fin de la synchronisation.',
  'notice.error.file-not-found': 'Fichier introuvable : {path}',
  'notice.error.trade-not-found': 'Fichier de trade introuvable : {path}',
  'notice.error.mark-reviewed':
    'Erreur lors du marquage des trades comme revus : {error}',
  'notice.error.add-setups': "Erreur lors de l'ajout des setups : {error}",
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': "Erreur lors de l'ajout d'erreurs : {error}",
  'notice.error.delete-trades':
    'Erreur lors de la suppression des trades : {error}',
  'notice.error.csv-validation':
    'Échec de la validation CSV/XLSX/XLS : {errors}',
  'notice.error.import-failed': "Échec de l'importation : {error}",
  'notice.error.file-too-large':
    'Le fichier est trop volumineux. La taille maximale est de 10 Mo',
  'notice.error.select-csv':
    'Veuillez sélectionner un fichier CSV/XLSX/XLS/HTML',
  'notice.error.cannot-delete-builtin':
    'Impossible de supprimer les modèles intégrés',
  'notice.error.duplicate-to-customize':
    'Dupliquez ce modèle pour le personnaliser',
  'notice.error.sign-out': 'Échec de la déconnexion. Veuillez réessayer.',
  'notice.error.open-upgrade-modal':
    "Une fonctionnalité premium a été demandée mais la boîte de dialogue de mise à niveau n'a pas pu se charger.",
  'notice.info.no-sync': 'Aucune synchronisation en cours',
  'notice.plugin-updated': 'Journal mis à jour vers v{version} !',
  'notice.info.settings-recovered':
    'Les paramètres ont été récupérés à partir de la sauvegarde. Certaines modifications récentes peuvent être perdues.',
  'notice.info.cannot-remove-locked':
    'Impossible de supprimer les widgets verrouillés',
  'notice.sync-mapping.updating':
    'Mise à jour des mappages de synchronisation de trading pour le nouveau chemin de dossier...',
  'notice.sync-mapping.updated':
    'Les mappages de synchronisation des trades ont été mis à jour avec succès',
  'notice.error.sync-mapping-update-failed':
    'Échec de la mise à jour des mappages de synchronisation des trades. Veuillez redémarrer le plugin.',
  'tradelog.title': 'Journal des trades',
  'tradelog.root.all-trades': 'Tous les trades',
  'tradelog.view.selector.label': 'Voir',
  'tradelog.guide.empty.intro.title': 'Bienvenue dans le journal des trades',
  'tradelog.guide.empty.intro.description':
    'Cette page devient votre espace principal pour parcourir, trier et examiner les trades. Une fois que vous avez ajouté des trades, vous obtiendrez également la visite complète du journal des trades.',
  'tradelog.guide.empty.state.title':
    'Commencez par ajouter votre premier trade',
  'tradelog.guide.empty.state.description':
    "Vous n'avez pas encore de trades ici. Cliquez sur le bouton Créer un trade pour créer votre premier trade, puis revenez pour découvrir les outils complets de table et de lots.",
  'tradelog.guide.intro.title': 'Ceci est votre journal de trade',
  'tradelog.guide.intro.description':
    'Utilisez cette page pour examiner les trades un par un, les trier, les filtrer et apporter des modifications à plusieurs trades à la fois.',
  'tradelog.guide.view-selector.title':
    'Choisissez comment vous souhaitez consulter votre historique',
  'tradelog.guide.view-selector.description':
    'Utilisez ce menu pour basculer entre le tableau des trades complet et les vues temporelles groupées comme les mois, les semaines ou les jours. Les trades sont la valeur par défaut, mais les vues groupées sont utiles lorsque vous souhaitez examiner par période.',
  'tradelog.guide.filters.title':
    'Utilisez des filtres pour affiner le journal des trades',
  'tradelog.guide.filters.description':
    'Ouvrez des filtres lorsque vous souhaitez consulter uniquement certains comptes, setups, balises, types de trades, statuts ou dates.',
  'tradelog.guide.filter-modal.title': 'Ce sont vos filtres détaillés',
  'tradelog.guide.filter-modal.description':
    'Utilisez ce modal lorsque vous souhaitez plus de contrôle sur les trades exacts affichées. Fermez-le lorsque vous avez fini de vérifier ou de modifier les filtres.',
  'tradelog.guide.sorting.title':
    'Cliquez sur les en-têtes de colonnes pour trier le tableau',
  'tradelog.guide.sorting.description':
    'Dans la vue Trades, cliquez sur un en-tête de colonne triable pour réorganiser le tableau. Par exemple, cliquez sur P&L net pour trier selon votre plus gros gain et votre plus grande perte.',
  'tradelog.guide.multi-select.title': 'Activer la sélection multiple',
  'tradelog.guide.multi-select.description':
    'Cliquez sur ce bouton pour sélectionner plusieurs trades à la fois. Lorsque la sélection multiple est activée, les clics sur les lignes sélectionnent les trades au lieu de les ouvrir.',
  'tradelog.guide.batch-actions.title': 'Ce sont vos actions par lots',
  'tradelog.guide.batch-actions.description':
    'Utilisez cette barre pour sélectionner tous les trades visibles, effacer votre sélection, marquer les trades comme revus, ajouter des setups, ajouter des erreurs ou supprimer plusieurs trades à la fois. Vous pouvez également faire un Maj-clic pour sélectionner une plage de trades.',
  'tradelog.guide.column-settings.title': 'Ouvrir les paramètres de la colonne',
  'tradelog.guide.column-settings.description':
    'Cliquez sur ce bouton pour choisir les colonnes à afficher et le degré de densité ou de détail du tableau.',
  'tradelog.guide.active-columns.title':
    'Réorganiser ou supprimer les colonnes que vous utilisez déjà',
  'tradelog.guide.active-columns.description':
    "Dans Colonnes actives, faites glisser une colonne pour la déplacer ou supprimez celle dont vous n'avez pas besoin. Cela change l'ordre du tableau de gauche à droite.",
  'tradelog.guide.available-columns.title':
    'Ajoutez à nouveau des colonnes masquées lorsque vous avez besoin de plus de détails',
  'tradelog.guide.available-columns.description':
    "Ouvrez les colonnes disponibles pour ajouter des champs dans le tableau. C'est là que vous ramenez tout ce que vous avez supprimé précédemment.",
  'tradelog.guide.open-trades.title':
    'Cliquez sur un trade lorsque vous souhaitez ouvrir sa note',
  'tradelog.guide.open-trades.description':
    "En mode normal, cliquer sur un trade l'ouvre. En mode multi-sélection, un clic le sélectionne à la place. Basculez entre ces deux comportements en fonction de ce que vous voulez faire.",
  'dashboard.guide.empty.intro.title': 'Bienvenue sur votre tableau de bord',
  'dashboard.guide.empty.intro.description':
    'Cette page vous donne un aperçu rapide de vos performances de trading. Une fois que vous avez effectué des trades, cela devient votre centre de commande quotidien.',
  'dashboard.guide.empty.state.title':
    'Commencez par ajouter votre premier trade',
  'dashboard.guide.empty.state.description':
    "Vous n'avez pas encore de trades. Ajoutez un trade manuellement ou importez des données, puis revenez pour débloquer la visite complète du tableau de bord.",
  'dashboard.guide.main.intro.title':
    'Ceci est votre tableau de bord de trading',
  'dashboard.guide.main.intro.description':
    'Utilisez cette page pour suivre vos performances, consulter vos statistiques et conserver vos graphiques les plus utiles au même endroit.',
  'dashboard.guide.main.filters.title':
    'Les filtres changent tout le tableau de bord',
  'dashboard.guide.main.filters.description':
    'Utilisez des filtres lorsque vous souhaitez que chaque statistique et graphique de cette page soit mis à jour pour une plage de dates, un compte, un setup, une balise ou un type de trade différents.',
  'dashboard.guide.main.edit-layout.title':
    'Activez le mode édition pour personnaliser cette page',
  'dashboard.guide.main.edit-layout.description':
    "Cliquez sur Modifier la mise en page pour déverrouiller le déplacement, le redimensionnement, la suppression et l'ajout de widgets de tableau de bord.",
  'dashboard.guide.main.open-widget-selector.title': 'Ouvrir Ajouter un widget',
  'dashboard.guide.main.open-widget-selector.description':
    "Cliquez sur Ajouter un widget pour ajouter d'autres graphiques et restaurer les widgets que vous avez supprimés précédemment.",
  'dashboard.guide.main.widget-picker.title':
    'Choisissez ce que vous voulez montrer',
  'dashboard.guide.main.widget-picker.description':
    "Ce sélecteur affiche les métriques et les widgets qui ne figurent pas actuellement sur votre tableau de bord. Cliquez sur un pour l'ajouter.",
  'dashboard.guide.main.metrics.title':
    'Ces meilleures cartes sont votre résumé rapide',
  'dashboard.guide.main.metrics.description':
    'La rangée supérieure vous donne des réponses rapides telles que le profit, le taux de réussite et le total des trades. En mode édition, vous pouvez modifier les cartes qui apparaissent et les réorganiser.',
  'dashboard.guide.main.bottom.title':
    "C'est ici que se produisent le déplacement et le redimensionnement",
  'dashboard.guide.main.bottom.description':
    'Lorsque Modifier la mise en page est activé, faites glisser un widget pour le déplacer. Pour redimensionner un widget, faites glisser son coin inférieur droit. C’est l’étape manquée par de nombreux utilisateurs.',
  'dashboard.guide.main.save-layout.title':
    'Enregistrez votre mise en page lorsque vous avez terminé',
  'dashboard.guide.main.save-layout.description':
    'Lorsque vous avez terminé la personnalisation, cliquez sur Enregistrer la mise en page pour conserver vos modifications. Vous pouvez revenir et modifier à nouveau cette page à tout moment.',
  'home.guide.intro.title': 'Bienvenue à la maison',
  'home.guide.intro.description':
    'Ceci est votre page principale. Il affiche vos statistiques de trading, vos actions rapides et des raccourcis vers le reste de Journalit.',
  'home.guide.filters.title':
    'Ces boutons changent ce que vos widgets affichent',
  'home.guide.filters.description':
    "Utilisez-les pour changer la période, le type de trade ou le compte afin que vos widgets d'accueil affichent les données que vous souhaitez consulter.",
  'home.guide.customize.title':
    "Activez le mode édition pour personnaliser l'accueil",
  'home.guide.customize.description':
    'Cliquez sur ce bouton pour commencer la personnalisation. Le mode édition permet de déplacer, redimensionner, supprimer et ajouter des widgets.',
  'home.guide.quick-links-position.title':
    'Déplacez les liens rapides au-dessus ou en dessous des widgets',
  'home.guide.quick-links-position.description':
    'Utilisez ce bouton pour choisir si la ligne Liens rapides se trouve au-dessus ou en dessous de la zone principale du widget.',
  'home.guide.quick-links.title':
    'Ces liens rapides sont vos raccourcis rapides',
  'home.guide.quick-links.description':
    'Les liens rapides vous offrent des raccourcis en un clic vers des actions et des pages courantes. En mode édition, vous pouvez également masquer les liens que vous ne souhaitez pas afficher ici.',
  'home.guide.move-and-resize.title': 'Déplacez et redimensionnez vos widgets',
  'home.guide.widget-picker.title': 'Ajoutez des widgets ici',
  'home.guide.widget-picker.description':
    "Ce sélecteur vous permet d'ajouter plus de widgets et de ramener des liens rapides que vous aviez précédemment masqués.",
  'home.guide.move-and-resize.description':
    "Il s'agit de la zone principale que vous pouvez réorganiser en mode édition. Faites glisser les widgets pour les déplacer ou faites glisser un widget depuis son coin inférieur droit pour le redimensionner.",
  'home.guide.add-widget.title':
    'Ajoutez des widgets ou ramenez des liens rapides masqués',
  'home.guide.add-widget.description':
    'Cliquez sur Ajouter un widget pour ouvrir le sélecteur, dans lequel vous pouvez ajouter plus de widgets et restaurer les liens rapides que vous avez précédemment masqués.',
  'home.guide.save-layout.title':
    'Enregistrez votre mise en page lorsque vous avez terminé',
  'home.guide.save-layout.description':
    'Lorsque vous êtes satisfait de la mise en page, cliquez sur ce bouton pour enregistrer vos modifications et quitter le mode édition.',
  'home.guide.widget-interactions.title': "C'est l'idée principale de Home",
  'home.guide.widget-interactions.description':
    'L’accueil est votre tableau de bord personnalisable. Utilisez le mode édition pour modifier la mise en page et cliquez sur les widgets pour ouvrir des outils, des paramètres ou des pages plus profondes.',
  'layoutBuilder.guide.intro.title': 'Ceci est votre Layout Builder',
  'layoutBuilder.guide.intro.description':
    'Cette page contrôle la façon dont vos modèles de revue sont structurés. Le moyen le plus simple de commencer consiste à dupliquer un modèle intégré, puis à personnaliser votre copie.',
  'layoutBuilder.guide.sidebar-overview.title':
    "Cette barre latérale est l'endroit où vous choisissez ce que vous modifiez",
  'layoutBuilder.guide.sidebar-overview.description':
    'Chaque section de la barre latérale est un type de modèle différent. Les modèles de trade sont distincts de vos modèles de revue et la section Bibliothèque est destinée au partage de modèles. Après avoir créé votre propre copie, vous pouvez la suivre pour en faire la valeur par défaut pour les nouvelles notes de revue.',
  'layoutBuilder.guide.pick-built-in.title':
    'Commencez avec un modèle DRC intégré',
  'layoutBuilder.guide.pick-built-in.description':
    "Pour votre première mise en page, commencez par l'un des layouts DRC intégrés. Cela vous donne un point de départ sûr avant de créer votre propre copie.",
  'layoutBuilder.guide.duplicate.title': 'Dupliquer le layout intégré',
  'layoutBuilder.guide.duplicate.description':
    'Les modèles intégrés sont des points de départ. Dupliquez-en un d’abord pour pouvoir créer votre propre version en toute sécurité.',
  'layoutBuilder.guide.preview-template.title':
    'Cet aperçu montre à quoi ressemblera le modèle',
  'layoutBuilder.guide.preview-template.description':
    'Faites défiler l’aperçu et obtenez une idée du flux. Ceci est utile pour vérifier si le modèle est clair avant de commencer à le modifier.',
  'layoutBuilder.guide.switch-to-editor.title': "Passer à l'éditeur",
  'layoutBuilder.guide.switch-to-editor.description':
    "L'aperçu vous montre à quoi ressemblera le layout. L'éditeur est l'endroit où vous le modifiez réellement.",
  'layoutBuilder.guide.editor-overview.title':
    "C'est ici que vous modifiez le layout",
  'layoutBuilder.guide.editor-overview.description':
    "Renommez le layout ici, examinez la liste des widgets, faites glisser la poignée gauche pour réorganiser les widgets, cliquez sur un widget pour le modifier et supprimez tout ce dont vous n'avez pas besoin.",
  'layoutBuilder.guide.add-widget.title': 'Ajoutez un widget à votre copie',
  'layoutBuilder.guide.add-widget.description':
    "Utilisez Ajouter un widget pour insérer de nouveaux blocs dans votre layout. C'est ainsi que vous façonnez le flux de travail en fonction de la façon dont vous révisez.",
  'layoutBuilder.guide.open-widget-picker.title':
    'Ouvrez le sélecteur de widgets',
  'layoutBuilder.guide.open-widget-picker.description':
    'Ce sélecteur affiche les widgets que vous pouvez ajouter pour ce type de revue.',
  'layoutBuilder.guide.choose-widget.title': 'Choisissez un widget',
  'layoutBuilder.guide.choose-widget.description':
    'Cette liste montre tous les widgets que vous pouvez ajouter pour ce type de revue. Choisissez le widget de votre choix ou appuyez sur Suivant et Journalit choisira le premier pour vous.',
  'layoutBuilder.guide.widget-library-docs.title':
    'Utilisez la bibliothèque de widgets si vous êtes bloqué',
  'layoutBuilder.guide.widget-library-docs.description':
    'Cela ouvre la page de documentation avec la bibliothèque de widgets, des exemples et un tableau de disponibilité pour chaque type de revue.',
  'layoutBuilder.guide.save-template.title': 'Enregistrez votre layout',
  'layoutBuilder.guide.save-template.description':
    "Une fois que votre copie semble correcte, enregistrez-la. Vous pourrez continuer à l'affiner plus tard, à mesure que votre processus de revue s'améliore.",
  'layoutBuilder.guide.set-default-template.title':
    'Définir cette copie comme modèle par défaut',
  'layoutBuilder.guide.set-default-template.description':
    "Cliquez sur l'étoile sur votre nouveau layout si vous souhaitez que les nouvelles notes de revue utilisent automatiquement cette mise en page.",
  'tradelog.empty': 'Aucun trade trouvé',
  'tradelog.empty.submessage':
    'Commencez à créer des notes de trading pour les voir apparaître dans votre journal des trades.',
  'tradelog.processing': 'Traitement des données de trading...',
  'tradelog.node.file-not-found': 'Fichier de trade introuvable : {path}',
  'tradelog.node.no-review-available':
    'Aucune revue disponible pour {type} : {id}',
  'tradelog.node.expand': 'Développer',
  'tradelog.node.collapse': 'Effondrement',
  'tradelog.node.navigate-to-review': 'Accédez à la revue {type}',
  'tradelog.node.performance.year': "{indicator} année d'exécution",
  'tradelog.node.performance.quarter':
    '{indicator} a effectué le trimestre de {year}',
  'tradelog.node.performance.month':
    "{indicator} mois d'exécution de {quarter} {year}",
  'tradelog.node.performance.week':
    "{indicator} semaine d'exécution du {month} {year}",
  'tradelog.node.performance.day':
    "{indicator} jour d'exécution du {week} {year}",
  'tradelog.node.performance.period': "{indicator} période d'exécution",
  'tradelog.filter.all': 'Tous les statuts',
  'tradelog.filter.all.desc': 'Tous les statuts de trading',
  'tradelog.filter.all-review-statuses': 'Toutes revues',
  'tradelog.filter.all-directions': 'Toutes directions',
  'tradelog.filter.winners': 'Gagnantes',
  'tradelog.filter.winners.desc': 'Des trades gagnants',
  'tradelog.filter.losers': 'Perdantes',
  'tradelog.filter.losers.desc': 'Perdre des trades',
  'tradelog.filter.breakeven': 'Seuil de rentabilité',
  'tradelog.filter.breakeven.desc': "Transactions à l'équilibre",
  'tradelog.filter.open': 'Ouvrir',
  'tradelog.filter.open.desc': 'Postes actuellement ouverts',
  'tradelog.filter.closed': 'Fermée',
  'tradelog.filter.closed.desc':
    'Toutes les positions fermées (gagnant/perdant/seuil de rentabilité)',
  'tradelog.type.all': 'Tous types',
  'tradelog.type.all.desc': 'Tous types de trade',
  'tradelog.type.regular': 'Régulière',
  'tradelog.type.regular.desc': 'Trades standards',
  'tradelog.type.missed': 'Manquée',
  'tradelog.type.missed.desc': 'Opportunités manquées',
  'tradelog.type.backtest': 'Backtest',
  'tradelog.type.backtest.desc': 'Trades simulés',
  'tradelog.status.win': 'GAGNER',
  'tradelog.status.loss': 'PERTE',
  'tradelog.status.open': 'OUVRIR',
  'tradelog.status.breakeven': 'SEUIL DE RENTABILITÉ',
  'tradelog.status.missed': 'MANQUÉE',
  'tradelog.status.backtest': 'BACKTEST',
  'tradelog.status.expired': 'EXPIRÉ',
  'tradelog.no-columns': 'Aucune colonne configurée',
  'tradelog.duration.ongoing': '(en cours)',
  'tradelog.tooltip.mistakes': 'Erreurs :',
  'tradelog.tooltip.setups': 'Configurations :',
  'tradelog.tooltip.tags': 'Balises :',
  'tradelog.tooltip.thesis': 'Thèse:',
  'tradelog.tooltip.mtComment': 'Commentaire de MT :',
  'tradelog.tooltip.accounts': 'Comptes:',
  'tradelog.copy-trade.tooltip': 'Copié depuis {account} à {multiplier}x',
  'tradelog.tooltip.partial-exits': 'Sorties partielles :',
  'tradelog.copy-trade.base-tooltip-title': 'Résultats des comptes copiés',
  'tradelog.copy-trade.adjustment-action': 'Ajuster le P&L copié',
  'tradelog.copy-trade.adjustment-title': 'Ajuster le P&L copié',
  'tradelog.copy-trade.adjustment-description-primary':
    'Saisissez l’ajustement manuel du P&L pour ce trade copié.',
  'tradelog.copy-trade.adjustment-description-secondary':
    'Utilisez un nombre négatif pour de moins bonnes exécutions/coûts.',
  'tradelog.copy-trade.adjustment-preview': 'Aperçu du P&L net :',
  'tradelog.copy-trade.adjustment-prompt':
    'Saisissez l’ajustement manuel du P&L pour ce trade copié. Utilisez un nombre négatif pour de moins bonnes exécutions/coûts.',
  'tradelog.copy-trade.adjustment-invalid':
    'Saisissez un ajustement de P&L valide.',
  'tradelog.copy-trade.adjustment-saved':
    'Ajustement du P&L du trade copié enregistré.',
  'tradelog.tooltip.still-open': 'toujours ouvert',
  'tradelog.tooltip.performance-trade': '{indicator} effectue un trade',
  'tradelog.tooltip.performance-trade-on':
    '{indicator} effectue un trade le {date}',
  'tradelog.alt.trade-image': '{instrument}Image',
  'tradelog.alt.trade-image-n': 'Image {n} de {instrument}',
  'tradelog.batch.delete-confirm.title': 'Confirmer la suppression',
  'tradelog.batch.delete-confirm.message.one':
    'Êtes-vous sûr de vouloir supprimer {count} trade sélectionné ?',
  'tradelog.batch.delete-confirm.message.few':
    'Êtes-vous sûr de vouloir supprimer {count} trades sélectionnés ?',
  'tradelog.batch.delete-confirm.message.many':
    'Êtes-vous sûr de vouloir supprimer {count} trades sélectionnés ?',
  'tradelog.batch.delete-confirm.message.other':
    'Êtes-vous sûr de vouloir supprimer {count} trades sélectionnés ?',
  'tradelog.batch.delete-confirm.warning':
    'Cette action ne peut pas être annulée.',
  'tradelog.batch.setups.title': 'Ajouter des setups aux trades',
  'tradelog.batch.setups.placeholder': 'Sélectionnez ou créez des setups...',
  'tradelog.batch.tags.title': 'Ajouter des tags aux trades',
  'tradelog.batch.tags.placeholder': 'Sélectionnez ou créez des tags...',
  'tradelog.batch.mistakes.title': 'Ajouter des erreurs aux trades',
  'tradelog.batch.mistakes.placeholder': 'Sélectionnez ou créez des erreurs...',
  'tradelog.batch.none-selected': 'AUCUN SÉLECTIONNÉ',
  'tradelog.batch.selected-count': '{count} SÉLECTIONNÉ',
  'tradelog.batch.select-all.title': 'Sélectionnez tous les trades visibles',
  'tradelog.batch.select-all.label': 'Sélectionner tout',
  'tradelog.batch.mark-reviewed.title':
    'Marquer les trades sélectionnés comme revus',
  'tradelog.batch.already-reviewed':
    'Tous les {total} trades sélectionnés sont déjà examinés',
  'tradelog.batch.already-reviewed-single':
    'Le trade sélectionné est déjà examiné',
  'tradelog.batch.already-reviewed-plain': 'déjà examiné',
  'tradelog.batch.no-updates-needed':
    'Aucune mise à jour nécessaire pour les trades : tous les {total} disposaient déjà de ces {type}',
  'tradelog.batch.already-had-all': '{count} possédait déjà tous les {type}',
  'tradelog.batch.errors-count.one': "Une erreur {count} s'est produite",
  'tradelog.batch.errors-count.few': '{count} erreurs se sont produites',
  'tradelog.batch.errors-count.many': '{count} erreurs se sont produites',
  'tradelog.batch.errors-count.other': '{count} erreurs se sont produites',
  'tradelog.batch.enable-multi-select': 'Activer la sélection multiple',
  'tradelog.batch.disable-multi-select': 'Désactiver la sélection multiple',
  'tradelog.batch.column-settings': 'Paramètres de colonne',
  'tradelog.batch.marking-reviewed': 'Marquage...',
  'tradelog.batch.add-setups.aria': 'Ajouter des setups',
  'tradelog.batch.add-setups.title':
    'Ajouter des setups aux trades sélectionnés',
  'tradelog.batch.add-setups.label': 'Ajouter des setups',
  'tradelog.batch.add-tags.aria': 'Ajouter des tags',
  'tradelog.batch.add-tags.title': 'Ajouter des tags aux trades sélectionnés',
  'tradelog.batch.add-tags.label': 'Ajouter des tags',
  'tradelog.batch.add-mistakes.aria': 'Ajouter des erreurs',
  'tradelog.batch.add-mistakes.title':
    'Ajouter des erreurs aux trades sélectionnés',
  'tradelog.batch.add-mistakes.label': 'Ajouter des erreurs',
  'tradelog.batch.adding': 'Ajout...',
  'tradelog.batch.add-count': 'Ajouter ({count})',
  'tradelog.batch.delete.aria': 'Supprimer les trades',
  'tradelog.batch.delete.title': 'Supprimer les trades sélectionnés',
  'tradelog.batch.deleting': 'Suppression...',
  'tradelog.batch.clear.aria': 'Effacer la sélection',
  'tradelog.batch.clear.title': 'Effacer la sélection',
  'tradelog.batch.clear.label': 'Claire',
  'tradelog.settings.active-columns': 'Colonnes actives',
  'tradelog.settings.available-columns': 'Colonnes disponibles',
  'tradelog.settings.active-desc':
    'Faites glisser pour réorganiser les colonnes. Cliquez sur X pour supprimer.',
  'tradelog.settings.available-desc':
    "Cliquez sur une colonne pour l'ajouter à votre tableau.",
  'tradelog.settings.no-active':
    "Aucune colonne active. Ajoutez des colonnes à partir de l'onglet Disponible.",
  'tradelog.settings.all-active': 'Toutes les colonnes sont actives.',
  'tradelog.settings.expanded-view': 'Vue étendue',
  'tradelog.settings.expanded-view-desc':
    'Afficher les balises, les setups et les erreurs sous forme de badges de pilule',
  'tradelog.settings.expanded-view-aria':
    "Activer/désactiver le mode d'affichage étendu",
  'tradelog.settings.saving': 'Économie...',
  'tradelog.settings.reset': 'Réinitialiser aux valeurs par défaut',
  'tradelog.category.basic': 'Informations de base',
  'tradelog.category.timing': 'Timing',
  'tradelog.category.prices': 'Tarifs',
  'tradelog.category.risk': 'Gestion des risques',
  'tradelog.category.position': 'Position et P/L',
  'tradelog.category.review': 'Revue',
  'tradelog.column.image': 'Image',
  'tradelog.column.account': 'Compte',
  'tradelog.column.ticker': 'Symbole',
  'tradelog.column.exchange': 'Bourse/Exchange',
  'tradelog.column.status': 'Statut',
  'tradelog.column.direction': 'Sens',
  'tradelog.column.date': "Date d'ouverture",
  'tradelog.column.entryTime': "Heure d'entrée",
  'tradelog.column.exitDate': 'Date de clôture',
  'tradelog.column.exitTime': 'Heure de sortie',
  'tradelog.column.duration': 'Durée',
  'tradelog.column.expirationDate': 'Expiration',
  'tradelog.column.daysToExpiry': 'ETTD',
  'tradelog.column.entryPrice': 'Entrée',
  'tradelog.column.exitPrice': 'Sortie',
  'tradelog.column.priceMove': 'Mouvement de prix',
  'tradelog.column.stopLoss': 'Stop-loss',
  'tradelog.column.slDistanceDollar': 'Dist. SL $',
  'tradelog.column.slDistancePercent': '% de répartition SL',
  'tradelog.column.riskAmount': 'Risque $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'MaxR',
  'tradelog.column.maePrice': 'Prix ​​du MAE',
  'tradelog.column.mfePrice': 'Prix ​​du MFE',
  'tradelog.column.mae': 'MAE $',
  'tradelog.column.mfe': 'MFE $',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': '% EMF',
  'tradelog.column.positionSize': 'Taille #',
  'tradelog.column.positionValue': 'Taille $',
  'tradelog.column.fees': 'Frais',
  'tradelog.column.dividends': 'Dividendes',
  'tradelog.column.pnl': 'P&L net',
  'tradelog.column.returnPercent': 'Retour %',
  'tradelog.column.setups': 'Configurations',
  'tradelog.column.mistakes': 'Erreurs',
  'tradelog.column.tags': 'Balises',
  'tradelog.column.reviewed': 'Révisé',
  'tradelog.column.thesis': 'Thèse',
  'tradelog.column.mtComment': 'Commentaire MT',
  'dashboard.title': 'Tableau de bord',
  'dashboard.empty.message': 'Aucune donnée de trading disponible',
  'dashboard.empty.submessage':
    'Ajoutez quelques trades pour voir votre tableau de bord prendre vie',
  'dashboard.empty.filter-hint': "Essayez d'ajuster vos paramètres de filtre",
  'dashboard.error.load-failed': 'Échec du chargement des données',
  'dashboard.no-data': 'Aucune donnée de trading disponible',
  'dashboard.button.add-widget': 'Ajouter un widget',
  'dashboard.button.save-layout': 'Enregistrer la mise en page',
  'dashboard.button.edit-layout': 'Modifier la mise en page',
  'dashboard.metrics.netPnL': 'Résultat net',
  'dashboard.metrics.winRate': 'Taux de réussite',
  'dashboard.metrics.profitFactor': 'Ratio gains/pertes',
  'dashboard.metrics.expectancy': 'Espérance de gain',
  'dashboard.metrics.numTrades': 'Total des trades',
  'dashboard.metrics.closedTrades': 'Trades fermés',
  'dashboard.metrics.numWinTrades': 'Trades gagnants',
  'dashboard.metrics.numLossTrades': 'Perdre des trades',
  'dashboard.metrics.avgWin': 'Victoire moyenne',
  'dashboard.metrics.avgLoss': 'Perte moyenne',
  'dashboard.metrics.totalCommission': 'Commission totale',
  'dashboard.metrics.totalFees': 'Frais totaux',
  'dashboard.metrics.maxDrawdown': 'Retrait max.',
  'dashboard.metrics.bestDay': 'Meilleur jour',
  'dashboard.metrics.largestWin': 'La plus grande victoire',
  'dashboard.metrics.largestLoss': 'La plus grande perte',
  'dashboard.metrics.longestWinStreak': 'Meilleure séquence',
  'dashboard.metrics.longestLossStreak': 'Pire séquence',
  'dashboard.metrics.avgHoldTime': 'Temps de maintien moyen',
  'dashboard.metrics.avgWinHoldTime': 'Temps de maintien moyen des victoires',
  'dashboard.metrics.avgLossHoldTime':
    'Temps de maintien moyen en cas de perte',
  'dashboard.metrics.avgWinnerHeat': 'Chaleur moy. gagnants',
  'dashboard.metrics.winnerMaeP90': 'MAE P90 gagnants',
  'dashboard.metrics.winnerMaeMedian': 'MAE médiane gagnants',
  'dashboard.metrics.avgLossHeat': 'Chaleur moy. pertes',
  'dashboard.metrics.winnerAvgMfe': 'MFE moy. gagnants',
  'dashboard.metrics.loserAvgMfe': 'MFE moy. perdants',
  'dashboard.metrics.winnerMfeP90': 'MFE P90 gagnants',
  'dashboard.metrics.loserMfeP90': 'MFE P90 perdants',
  'dashboard.metrics.avgRR': 'RR moyen (remboursement)',
  'dashboard.metrics.avgRRRiskBased': 'RR moyen (basé sur R)',
  'dashboard.avgRR.tooltip.formula':
    'Formule : victoire moyenne / perte moyenne',
  'dashboard.avgRR.tooltip.no-conversion':
    'Ce ratio de gain est basé sur des devises mixtes sans conversion de change et peut être trompeur.',
  'dashboard.avgRRRiskBased.tooltip.title': 'RR moyen (basé sur R)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'Formule : R moyen gagnant / R moyen perdant',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    'Calculé à partir de {valid} de {total} trades clôturés avec des données de risque',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'Gains valides pour le risque : {wins}, pertes : {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'Couverture partielle des risques : {valid} des {total} trades clôturés comportent des données de risque valides.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'Données insuffisantes pour le RR basé sur R. Ajoutez des données stop-loss/risque et assurez-vous qu’il existe des trades gagnants et perdantes valides.',
  'dashboard.conversion.title': 'Converti en {currency}',
  'dashboard.conversion.converted-total': 'Total converti',
  'dashboard.conversion.base': 'Base : {currency}',
  'dashboard.conversion.rates': 'Taux : BCE ({date})',
  'dashboard.conversion.using-ecb': 'Utilisation des taux de la BCE ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Utilise le P&L en devise de base fourni par le courtier pour {count} {tradeLabel}',
  'dashboard.conversion.trade-singular': 'transaction',
  'dashboard.conversion.trade-plural': 'transactions',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} de {total} trades ({excluded} exclus : {currencies})',
  'dashboard.top-section.add-metric': 'Ajouter une métrique',
  'dashboard.top-section.remove-metric': 'Supprimer la métrique',
  'dashboard.top-section.failed-load': 'Échec du chargement des métriques',
  'dashboard.filter.date.today': "Aujourd'hui",
  'dashboard.filter.date.yesterday': 'Hier',
  'dashboard.filter.date.this-week': 'Cette semaine',
  'dashboard.filter.date.this-month': 'Ce mois-ci',
  'dashboard.filter.date.this-quarter': 'Ce trimestre',
  'dashboard.filter.date.this-year': 'Cette année',
  'dashboard.filter.date.all-time': 'Tout le temps',
  'dashboard.filter.date.custom': 'Personnalisé',
  'dashboard.filter.date.from': 'Depuis',
  'dashboard.filter.date.to': 'À',
  'dashboard.filter.accounts.all': 'Tous les comptes',
  'dashboard.filter.accounts.n-selected': '{count} Comptes',
  'dashboard.filter.accounts.select-all': 'Sélectionner tout',
  'dashboard.filter.accounts.select-all-option': '-- Sélectionner tout --',
  'dashboard.filter.accounts.none-found': 'Aucun compte trouvé',
  'dashboard.filter.tags.all': 'Toutes les balises',
  'dashboard.filter.tags.none': 'Aucune balise',
  'dashboard.filter.tags.n-selected': '{count} Balises',
  'dashboard.filter.tags.select-all': 'Sélectionner tout',
  'dashboard.filter.tags.none-found': 'Aucune balise trouvée',
  'dashboard.filter.mistakes.all': 'Toutes les erreurs',
  'dashboard.filter.mistakes.none': 'Aucune erreur',
  'dashboard.filter.mistakes.n-selected': '{count} Erreurs',
  'dashboard.filter.mistakes.select-all': 'Sélectionner tout',
  'dashboard.filter.mistakes.none-found': 'Aucune erreur trouvée',
  'dashboard.filter.tickers.all': 'Tous les tickers',
  'dashboard.filter.tickers.n-selected': '{count} symboles',
  'dashboard.filter.tickers.select-all': 'Sélectionner tout',
  'dashboard.filter.tickers.none-found': 'Aucun ticker trouvé',
  'dashboard.filter.setup.all': 'Tous les setups',
  'dashboard.filter.setup.none': 'Aucun setup',
  'dashboard.filter.setup.n-selected': '{count} configurations',
  'dashboard.filter.setup.select-all': 'Sélectionner tout',
  'dashboard.filter.setup.none-found': 'Aucun setup trouvée',
  'dashboard.widgets.daily-performance.title': 'Performances quotidiennes',
  'dashboard.widgets.daily-performance.period-aria': 'Période',
  'dashboard.widgets.daily-performance.period-days': '{count} jours',
  'dashboard.widgets.weekday-performance.title': 'Performance en semaine',
  'dashboard.widgets.weekday-performance.metric-aria': 'Métrique',
  'dashboard.widgets.weekday-performance.metric.net': 'Filet',
  'dashboard.widgets.weekday-performance.metric.win-rate': 'Taux de réussite',
  'dashboard.widgets.weekday-performance.metric.trades': 'Trades',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    'Taux de réussite : {rate} ({wins}W / {losses}L)',
  'dashboard.widgets.weekday-performance.tooltip.trades': 'Trades : {count}',
  'dashboard.widgets.hourly-performance.title': 'Performance horaire',
  'dashboard.widgets.hourly-performance.tooltip.trades': 'Opérations: {count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label':
    'Taux de réussite',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    'Taux de réussite : {rate} ({wins}G / {losses}P)',
  'dashboard.widgets.hourly-performance.bucket-aria': 'Taille du créneau',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes} min',
  'dashboard.widgets.hourly-performance.metric-aria': 'Métrique',
  'dashboard.widgets.hourly-performance.metric.total': 'Cumul',
  'dashboard.widgets.hourly-performance.metric.average': 'Moyenne',
  'dashboard.widgets.hourly-performance.metric.total-pnl': 'P&L total',
  'dashboard.widgets.hourly-performance.metric.avg-pnl': 'P&L moy.',
  'dashboard.widgets.hourly-performance.metric.total-r': 'R total',
  'dashboard.widgets.hourly-performance.metric.avg-r': 'R moy.',
  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'Aucun trade',
  'dashboard.widgets.rollingStats.title': 'Gains/Pertes moyennes glissantes',
  'dashboard.widgets.rollingStats.period': 'Période',
  'dashboard.widgets.rollingStats.trades': '{count} trades',
  'dashboard.widgets.rollingStats.avgWin': 'Victoire moyenne',
  'dashboard.widgets.rollingStats.avgLoss': 'Perte moyenne',
  'dashboard.widgets.rollingStats.tooltip.trade': 'Trade {label}',
  'dashboard.rolling_win_loss.title': 'Ratio de gains/pertes glissant',
  'dashboard.rolling_win_loss.period_aria': 'Période',
  'dashboard.rolling_win_loss.trades_count': '{count} trades',
  'dashboard.rolling_win_loss.trade_label': 'Trade {label}',
  'dashboard.rolling_win_loss.ratio_label': 'Rapport : {ratio}',
  'dashboard.rolling_win_loss.avg_win_label': 'Gain moyen : {value}',
  'dashboard.rolling_win_loss.avg_loss_label': 'Perte moyenne : {value}',
  'home.widget.recent-items.name': 'Articles récents',
  'home.widget.recent-items.description':
    'Affiche les fichiers et les vues récemment ouverts',
  'home.widget.year-heatmap.name': 'Carte thermique du trading',
  'home.widget.year-heatmap.description':
    "Calendrier montrant votre activité de trading pour l'année",
  'home.widget.getting-started.name': 'Commencer',
  'home.widget.getting-started.description':
    'Liste de contrôle pour vous aider à ajouter vos premières trades et à activer Pro',
  'home.widget.getting-started.progress': '{completed}/{total} terminé',
  'home.widget.getting-started.progress.loading': 'Vérification des progrès...',
  'home.widget.getting-started.item.create.title': 'Créez votre premier trade',
  'home.widget.getting-started.item.create.description':
    'Débloquez votre tableau de bord et votre flux de journalisation.',
  'home.widget.getting-started.item.create.time': 'années 30',
  'home.widget.getting-started.item.create.cta': 'Créer un trade',
  'home.widget.getting-started.item.tradelog.title':
    'Ouvrir le journal des trades',
  'home.widget.getting-started.item.tradelog.description':
    'Votre base de données de trading pour analyser toutes vos trades en un seul endroit.',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta':
    'Ouvrir le journal des trades',
  'home.widget.getting-started.item.layouts.title': 'Ouvrir le Layout Builder',
  'home.widget.getting-started.item.layouts.description':
    'Concevez vos modèles de revue à votre façon.',
  'home.widget.getting-started.item.layouts.time': '1 minute',
  'home.widget.getting-started.item.layouts.cta': 'Ouvrir le Layout Builder',
  'home.widget.getting-started.item.pro.title': 'Activer Pro',
  'home.widget.getting-started.item.pro.description':
    "Activez l'importation CSV, la synchronisation MetaTrader et le mappage AI.",
  'home.widget.getting-started.item.pro.time': '1 minute',
  'home.widget.getting-started.item.pro.cta': 'Activer',
  'home.widget.weekly-summary.name': 'Résumé hebdomadaire',
  'home.widget.weekly-summary.description':
    'Mesures de la semaine en cours avec graphique sparkline P&L quotidien',
  'home.widget.position-size.name': 'Calculateur de taille de position',
  'home.widget.position-size.description':
    'Calculer la taille de la position en fonction du pourcentage de risque du compte',
  'home.widget.embedded-note.name': 'Remarque intégrée',
  'home.widget.embedded-note.description':
    "Afficher n'importe quelle note de Markdown de votre vault",
  'home.widget.current-streak.name': 'Série actuelle',
  'home.widget.current-streak.description':
    'Suivez vos séquences de victoires et de défaites',
  'home.widget.best-hours.name': 'Meilleures heures',
  'home.widget.best-hours.description':
    "Découvrez quand vous tradez le mieux selon l'heure de la journée",
  'home.widget.setup-leaderboard.name': 'Classement des setups',
  'home.widget.setup-leaderboard.description':
    "Comparez vos principales setups, balises, types d'actifs ou tickers",
  'home.widget.unreviewed-trades.name': 'Trades non revus',
  'home.widget.unreviewed-trades.description':
    'Trades qui nécessitent votre revue',
  'home.widget.goals-progress.name': 'Progression des objectifs',
  'home.widget.goals-progress.description':
    'Suivez les progrès vers votre objectif de trading',
  'home.widget.trading-score.name': 'Score de trading',
  'home.widget.trading-score.description':
    'Score de performance complet avec visualisation graphique radar',
  'home.widget.aum.name': 'Actifs sous gestion',
  'home.widget.aum.description':
    'Actifs totaux sous gestion avec sparkline de tendance sur 7 jours',
  'home.widget.drawdown-monitor.name': 'Moniteur de drawdown',
  'home.widget.drawdown-monitor.description':
    "Suivre l'état des retraits sur tous les comptes avec des limites configurées",
  'account.header.title': 'Compte : {name}',
  'account.header.add-event.aria': 'Ajouter un dépôt/retrait',
  'account.header.edit-account.aria': 'Modifier le compte',
  'account.header.view-trades.aria': 'Voir les trades dans le Trade Log',
  'account.header.type': 'Type :',
  'account.header.initial-balance': 'Solde initial :',
  'account.header.current-balance': 'Solde actuel :',
  'account.header.account-id': 'Identifiant du compte :',
  'account.header.warning.trades-before-creation.one':
    '{count} trade trouvé avant la date de création du compte',
  'account.header.warning.trades-before-creation.few':
    '{count} trades trouvés avant la date de création du compte',
  'account.header.warning.trades-before-creation.many':
    '{count} trades trouvés avant la date de création du compte',
  'account.header.warning.trades-before-creation.other':
    '{count} trades trouvés avant la date de création du compte',
  'account.header.warning.earliest-trade':
    'Première trade : {date}. Cela peut entraîner des calculs de solde incorrects.',
  'account.header.warning.fix-date.aria':
    'Corriger la date de création du compte',
  'account.header.warning.fixing': 'Fixation...',
  'account.header.warning.fix-date': 'Date de correction',
  'account.header.notice.date-updated':
    'Date de création du compte mise à jour le {date}',
  'account.header.notice.update-failed-log':
    'Échec de la mise à jour de la date de création du compte :',
  'account.header.notice.update-failed':
    'Échec de la mise à jour de la date : {error}',
  'ribbon.open-journalit': 'Ouvrir le journal',
  'view.home': 'Accueil',
  'view.dashboard': 'Tableau de bord',
  'view.trade-log': 'Journal des trades',
  'view.account-dashboard': 'Tableau de bord du compte',
  'view.account-page.title': 'Compte : {name}',
  'view.account-page.title-default': 'Page de compte',
  'view.account-page.no-account-selected': 'Aucun compte sélectionné',
  'view.account-page.no-account-instructions':
    'Veuillez accéder à cette page à partir du tableau de bord du compte.',
  'view.account-page.service-loading':
    'Chargement du service de page de compte...',
  'view.account-page.balance-chart-title': 'Tableau du solde du compte',
  'view.account-page.balance-chart-loading':
    'Chargement du tableau du solde...',
  'view.layout-builder': 'Layout Builder',
  'view.csv-import': 'Trade Import',
  'nav.prev-day': 'Jour précédent',
  'nav.prev-week': 'Semaine précédente',
  'nav.prev-month': 'Mois précédent',
  'nav.prev-quarter': 'Trimestre précédent',
  'nav.prev-year': 'Année précédente',
  'nav.drc': 'DRC',
  'nav.weekly': 'Revue hebdomadaire',
  'nav.monthly': 'Revue mensuelle',
  'nav.next-day': 'Lendemain',
  'nav.next-week': 'La semaine prochaine',
  'nav.next-month': 'Mois prochain',
  'nav.weekly-review': 'Revue hebdomadaire',
  'nav.monthly-review': 'Revue mensuelle',
  'nav.quarterly-review': 'Revue trimestrielle',
  'nav.yearly-review': 'Revue annuelle',
  'nav.edit-trade': 'Modifier le trade',
  'review.loading': 'Chargement de {name}...',
  'review.failed-to-load':
    "Échec du chargement de {name}. Veuillez essayer d'actualiser la page.",
  'review.date-unknown': 'Inconnue',
  'review.error.failed-to-navigate': 'Échec de la navigation vers le chemin',
  'review.error.update-failed': 'Erreur lors de la mise à jour de {name}',
  'review.error.update-file-failed':
    'Échec de la mise à jour de {name} dans le fichier',
  'status-bar.update-available': 'Mise à jour disponible',
  'status-bar.update-aria-label': 'Journalit {version} - Cliquez pour voir',
  'template.transformation.orphaned-content.header':
    'Contenu du modèle précédent',
  'template.transformation.orphaned-content.desc1':
    'Le contenu suivant ne correspondait pas à la nouvelle présentation du modèle.',
  'template.transformation.orphaned-content.desc2':
    "Vérifiez-le et intégrez-le ci-dessus, ou supprimez-le s'il n'est plus nécessaire.",
  'template.editor.loading': 'Chargement du modèle...',
  'template.editor.built-in': 'Intégré',
  'template.editor.unsaved-changes': 'Modifications non enregistrées',
  'template.editor.review-title': 'Revue de trading',
  'template.editor.built-in-notice':
    'Les modèles intégrés ne peuvent pas être modifiés. Dupliquez ce modèle ou créez-en un nouveau à personnaliser.',
  'template.editor.show-review': 'Afficher la section de revue',
  'template.editor.show-review-desc':
    'Quand afficher la section de revue sur les notes de trading',
  'template.editor.show-review.always': 'Toujours',
  'template.editor.show-review.losses-only': 'Pertes uniquement',
  'template.editor.show-review.never': 'Jamais',
  'template.editor.show-missed': 'Afficher les trades manqués',
  'template.editor.show-missed-desc':
    'Afficher également la section de revue sur les notes de trading manquées',
  'template.editor.show-backtest': 'Afficher les trades de backtest',
  'template.editor.show-backtest-desc':
    'Afficher également la section de revue sur les notes de trading de backtest',
  'template.editor.sections': 'Sections de revue',
  'template.editor.add-section': '+ Ajouter une rubrique',
  'template.editor.no-sections': 'Aucune section de revue configurée.',
  'template.editor.add-section-hint':
    'Cliquez sur "+ Ajouter une section" pour en créer une.',
  'template.editor.win-sections': 'Gagner des sections',
  'template.editor.loss-sections': 'Sections de perte',
  'template.editor.win-sections-desc':
    "Affiché sur les trades gagnants et à l'équilibre",
  'template.editor.loss-sections-desc': 'Affiché sur les trades perdants',
  'template.editor.section-visibility': 'Visibilité des sections',
  'template.editor.nav-bar': 'Barre de navigation',
  'template.editor.nav-bar-desc':
    'Afficher la chronologie des trades et consulter les liens',
  'template.editor.images': 'Images',
  'template.editor.images-desc':
    'Afficher les images des graphiques de trading',
  'template.editor.metadata': 'Métadonnées',
  'template.editor.metadata-desc':
    'Afficher les comptes, les setups et les erreurs',
  'template.editor.details': 'Détails du trade',
  'template.editor.details-desc':
    "Afficher les détails d'entrée, de sortie et de P&L",
  'template.editor.review-button': 'Bouton Marquer comme révisé',
  'template.editor.review-button-desc':
    'Afficher le bouton pour marquer le trade comme révisé',
  'template.editor.section-type': 'Type de section',
  'template.editor.type.textarea': 'Zone de texte',
  'template.editor.type.checkbox': 'Case à cocher unique',
  'template.editor.type.checkboxList': 'Liste des cases à cocher',
  'template.editor.type.header': 'En-tête',
  'template.editor.title-label': 'Titre (prend en charge **markdown**)',
  'template.editor.title-placeholder': 'Titre de la section',
  'template.editor.content-label': 'Contenu (prend en charge la Markdown)',
  'template.editor.content-placeholder': "Contenu de l'en-tête",
  'template.editor.checkbox-label':
    'Étiquette de case à cocher (prend en charge la Markdown)',
  'template.editor.checkbox-placeholder': 'Libellé de la case à cocher',
  'template.editor.placeholder-label': "Texte d'espace réservé",
  'template.editor.placeholder-hint':
    "Texte d'espace réservé affiché lorsqu'il est vide",
  'template.editor.items-label': 'Éléments de case à cocher',
  'template.editor.item-n': 'Article {n}',
  'template.editor.add-item': '+ Ajouter un article',
  'template.editor.preview-fallback': 'Rubrique {type}',
  'csv.uploader.drop-here': 'Déposez le fichier CSV/XLSX/XLS/HTML ici',
  'csv.uploader.click-drag': 'Cliquez pour télécharger ou glisser-déposer',
  'csv.uploader.hint': 'Fichiers CSV/XLSX/XLS/HTML uniquement, maximum 10 Mo',
  'csv.preview-first-note':
    "L'aperçu est gratuit. L'importation dans votre vault nécessite l'activation Pro.",
  'csv.preview.header-row.title': "Sélection de la ligne d'en-tête",
  'csv.preview.header-row.help':
    'Si votre première ligne est une ligne de titre/groupe, choisissez la ligne qui contient les vrais noms de colonnes.',
  'csv.preview.header-row.label': "Ligne d'en-tête",
  'csv.preview.header-row.range': 'Choisissez une ligne entre 1 et {max}.',
  'csv.preview.header-row.preview': "Aperçu de l'en-tête sélectionné :",
  'csv.gate.import.title': 'Pro requis pour importer',
  'csv.gate.import.description':
    "L'importation de trades dans votre vault est une fonctionnalité Pro. Activez Pro pour continuer.",
  'csv.gate.templates.tooltip':
    'Pro requis (activer pour utiliser des modèles).',
  'csv.gate.ai.tooltip':
    'Pro requis (activer pour utiliser la cartographie AI).',
  'csv.mapper.title': 'Mapper les colonnes avec les champs de trade',
  'csv.mapper.subtitle':
    "Faites correspondre vos colonnes aux champs de trading qu'elles représentent.",
  'csv.mapper.do-not-import': 'Ne pas importer',
  'csv.mapper.required-badge': 'Requis',
  'csv.mapper.required-label': 'REQUIS',
  'csv.mapper.example': 'Exemple:',
  'csv.mapper.mode.title': "Mode d'importation",
  'csv.mapper.mode.help':
    "Choisissez comment les lignes manuelles doivent être interprétées. Le mode P&L direct importe les lignes en tant que trades fermés à l'aide des valeurs P&L mappées.",
  'csv.mapper.mode.price-based': 'Basé sur le prix (entrée/sortie)',
  'csv.mapper.mode.direct-pnl': 'P&L direct',
  'csv.mapper.asset-type.help':
    "Sélectionnez le type d'instrument dans ce fichier. Cela détermine les champs requis et la logique d’analyse.",
  'csv.mapper.date-format.title': 'Format de date dans le fichier',
  'csv.mapper.date-format.help':
    'Comment les dates apparaissent dans votre fichier. Important pour les formats ambigus comme le 02/01/2024 (2 janvier vs 1er février).',
  'csv.mapper.date-format.placeholder': 'Sélectionnez le format de date...',
  'csv.mapper.tip.title': 'Astuce : mapper des champs supplémentaires',
  'csv.mapper.tip.desc':
    "Le mappage des champs facultatifs tels que commission et profit_loss améliore la qualité de l'importation. Vous pouvez également mapper plusieurs colonnes pour répertorier des champs tels que des balises, des images, des setups et des erreurs.",
  'csv.mapper.missing-fields':
    'Champs obligatoires manquants pour {assetType} :',
  'csv.mapper.summary.title': 'Résumé:',
  'csv.mapper.summary.of': 'de',
  'csv.mapper.summary.columns-mapped': 'colonnes mappées',
  'csv.mapper.summary.all-mapped': 'Tous les champs obligatoires mappés',
  'csv.mapper.available-fields.title': 'Champs de trade disponibles',
  'csv.mapper.available-fields.desc':
    'Organisé par catégorie avec des descriptions pour les champs spécifiques aux actifs',
  'csv.ai-mapper.header.title': "Besoin d'aide ?",
  'csv.ai-mapper.header.description':
    "L'IA peut analyser Trade Import et suggérer des mappages de champs (facultatif)",
  'csv.ai-mapper.button.label': "Suggérer des mappages avec l'IA",
  'csv.ai-mapper.button.tooltip':
    "Utilise l'IA pour suggérer des mappages de colonnes. Nécessite une connexion backend.",
  'csv.ai-mapper.helper-text':
    'Les suggestions de l’IA doivent être vérifiées avant l’importation – vérifiez toujours l’exactitude des mappages.',
  'csv.ai-mapper.status.analyzing': 'Analyser la structure CSV',
  'csv.ai-mapper.status.consulting':
    "Consultation de l'IA pour les mappages de colonnes",
  'csv.ai-mapper.status.processing': "Traitement des suggestions d'IA",
  'csv.ai-mapper.status.taking-longer':
    "Prend plus de temps que d'habitude, fonctionne toujours",
  'csv.ai-mapper.notice.no-suggestions':
    "L'IA ne pouvait pas suggérer de cartographies. Veuillez mapper manuellement.",
  'csv.ai-mapper.notice.suggested-count':
    "Mappages suggérés par l'IA pour les colonnes {count}",
  'csv.ai-mapper.notice.unavailable':
    'Cartographie IA indisponible. Veuillez mapper les colonnes manuellement ou utiliser un modèle enregistré.',
  'csv.template-save.title': "Enregistrer le modèle d'importation",
  'csv.template-save.description':
    'Enregistrez ces mappages de colonnes en tant que modèle réutilisable pour les importations futures.',
  'csv.template-save.label.name': 'Nom du modèle',
  'csv.template-save.placeholder.name': 'par exemple, format Mon broker',
  'csv.template-save.button.save': 'Enregistrer le modèle',
  'csv.template-save.button.saving': 'Économie...',
  'csv.template-import.title': "Modèle d'importation",
  'csv.template-import.description':
    "Collez un code de partage de modèle (JTT-v1-... ou JTT-v2-...) pour l'importer dans votre vault.",
  'csv.template-import.label.share-code': 'Partager le code',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',
  'csv.template-import.helper-text':
    'Le modèle sera ajouté à vos modèles locaux',
  'csv.template-import.button.import': "Modèle d'importation",
  'csv.template-import.button.importing': 'Importation...',
  'csv.template-import.error.import-failed': "Échec de l'importation du modèle",
  'csv.template-delete.title': 'Supprimer le modèle ?',
  'csv.template-delete.description':
    'Êtes-vous sûr de vouloir supprimer « {name} » ? Cette action ne peut pas être annulée.',
  'csv.template-delete.button.delete': 'Supprimer le modèle',
  'csv.template-delete.button.deleting': 'Suppression...',
  'csv.export-template.title': "Modèle d'exportation : {name}",
  'csv.export-template.description':
    "Partagez ce code avec d'autres pour leur permettre d'utiliser le setup de votre modèle.",
  'csv.export-template.label.share-code': 'Partager le code',
  'csv.export-template.helper-text':
    'Code complet copié dans le presse-papiers lorsque vous cliquez sur le bouton ci-dessous',
  'csv.export-template.button.copied': 'Copié!',
  'csv.export-template.button.copy': 'Copier dans le Presse-papiers',
  'csv.mapper.field.symbol': 'Symbole',
  'csv.mapper.field.direction': 'Sens (long/short)',
  'csv.mapper.field.entry-time': "Heure d'entrée",
  'csv.mapper.field.exit-time': 'Heure de sortie',
  'csv.mapper.field.entry-price': "Prix ​​d'entrée",
  'csv.mapper.field.exit-price': 'Prix ​​de sortie',
  'csv.mapper.field.quantity': 'Quantité',
  'csv.mapper.field.notes': 'Remarques',
  'csv.mapper.field.order-id': 'Numéro de commande',
  'csv.mapper.field.account-id': 'Identifiant du compte',
  'csv.mapper.help.options-required': 'Obligatoire pour les trades sur options',
  'csv.mapper.help.option-type-required':
    'Obligatoire pour les options (call ou put)',
  'csv.mapper.help.contract-size':
    'Multiplicateur pour les options (généralement 100) ou les contrats à terme',
  'csv.mapper.help.order-id': 'Utilisé pour agréger des remplissages partiels',
  'csv.mapper.help.asset-types':
    'actions, options, contrats à terme, forex, crypto',
  'csv.mapper.help.status': 'Statut de trading : OUVERT ou FERMÉ',
  'csv.mapper.category.required': 'Champs obligatoires',
  'csv.mapper.category.optional-core': 'Champs principaux facultatifs',
  'csv.mapper.category.identifiers': 'Identifiants',
  'csv.mapper.category.other': 'Autre',
  'csv.mapper.category.options': "Champs d'options",
  'csv.mapper.category.futures': 'Champs à terme',
  'csv.broker.loading': 'Chargement des brokers...',
  'csv.broker.loading-templates': 'Chargement des modèles...',
  'csv.broker.select-placeholder': 'Sélectionnez un broker ou un modèle...',
  'csv.broker.label': "Broker / Format d'importation",
  'csv.broker.helper-text':
    'Choisissez un broker pris en charge ou créez un format personnalisé',
  'csv.broker.hidden-count': '{count} masqué',
  'csv.broker.manage-hidden': 'Gérer les brokers cachés',
  'csv.broker.supported-brokers': 'Brokers pris en charge',
  'csv.broker.my-templates': 'Mes modèles',
  'csv.broker.show-more': 'Afficher {count} plus',
  'csv.broker.show-less': 'Afficher moins',
  'csv.broker.create-new': '+ Créer un nouveau format',
  'csv.broker.favorite-selected':
    'Votre favori est sélectionné automatiquement',
  'csv.broker.star-hint':
    'Marquez un broker pour le sélectionner automatiquement',
  'csv.broker.hidden-modal-title': 'Brokers cachés',
  'csv.broker.no-hidden': 'Pas de brokers cachés',
  'csv.broker.restore': 'Restaurer',
  'csv.broker.restore-all': 'Tout restaurer',
  'csv.broker.hide-aria': 'Masquer ce broker',
  'csv.broker.remove-favorite-aria': 'Supprimer des favoris',
  'csv.broker.set-favorite-aria': 'Définir comme favori',
  'csv.broker.ibkr': 'Interactive Brokers (IBKR)',
  'csv.broker.tradovate': 'Tradovate',
  'csv.broker.tradezero': 'TradeZero',
  'csv.broker.tradingview': 'TradingView Paper Trading',
  'csv.broker.bybit': 'Bybit (USDT perpétuels)',
  'csv.broker.blofin': 'Blofin',
  'csv.broker.hyperliquid': 'Hyperliquid (perpétuels)',
  'csv.broker.sierrachart': 'SierraChart (Futures)',
  'csv.broker.motivewave': 'MotiveWave',
  'csv.broker.fxreplay': 'FX Replay (Analytics)',
  'csv.broker.atas': 'ATAS (Statistiques en temps réel)',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker.jdr': 'JDR Securities Limited',
  'csv.account-selector.loading': 'Chargement des comptes...',
  'csv.account-selector.no-accounts': "Aucun compte pour l'instant.",
  'csv.account-selector.create-account-hint':
    'Créez-en un pour commencer à importer des trades à partir de CSV.',
  'csv.account-selector.create-account-cta': 'Créer un compte',
  'csv.account-selector.label': 'Sélectionnez un compte',
  'csv.account-selector.error.load-failed': 'Échec du chargement des comptes',
  'csv.account-selector.favorite.remove': 'Supprimer des favoris',
  'csv.account-selector.favorite.set': 'Définir comme favori',
  'csv.account-selector.show-less': 'Afficher moins',
  'csv.account-selector.show-more': 'Afficher {count} plus',
  'csv.account-selector.favorite.auto-selected':
    'Votre favori est sélectionné automatiquement',
  'csv.account-selector.favorite.star-hint':
    'Créez un compte pour le sélectionner automatiquement',
  'csv.results.import-successful': 'Importation réussie !',
  'csv.results.successfully-imported-prefix': 'Importation réussie',
  'csv.results.successfully-imported-suffix': 'trades',
  'csv.results.skipped-duplicates-prefix': 'Sauté',
  'csv.results.skipped-duplicates-suffix': 'trades en double',
  'csv.results.failed-to-import-prefix': "Échec de l'importation",
  'csv.results.failed-to-import-suffix': 'lignes (voir détails ci-dessous)',
  'csv.results.failed-rows-title': 'Lignes ayant échoué :',
  'csv.results.import-failed': "Échec de l'importation",
  'csv.results.import-error-generic':
    "Une erreur s'est produite lors de l'importation",
  'csv.results.additional-errors': 'Erreurs supplémentaires :',
  'csv.results.button.view-account': 'Voir le compte',
  'csv.results.button.import-another': 'Importer un autre CSV',
  'csv.results.button.try-again': 'Essayer à nouveau',
  'csv.incomplete-options.title': "Données d'options incomplètes détectées",
  'csv.incomplete-options.desc-single':
    "Il manque les métadonnées requises dans un trade d'options :",
  'csv.incomplete-options.desc-plural':
    "Il manque les métadonnées requises pour les trades d'options {count} :",
  'csv.incomplete-options.missing-strike-single': "prix d'exercice manquant",
  'csv.incomplete-options.missing-strike-plural':
    "les trades manquent de prix d'exercice",
  'csv.incomplete-options.missing-expiry-single': "date d'expiration manquante",
  'csv.incomplete-options.missing-expiry-plural':
    "trades sans date d'expiration",
  'csv.incomplete-options.missing-option-type-single':
    "type d'option manquant pour le trade (call/put)",
  'csv.incomplete-options.missing-option-type-plural':
    "type d'option manquant pour les trades (call/put)",
  'csv.incomplete-options.impact-desc':
    'Ces trades seront importés sans données complètes sur les options, ce qui peut affecter :',
  'csv.incomplete-options.impact-analytics': 'Analyse et filtrage',
  'csv.incomplete-options.impact-pl': 'Calculs de P&L',
  'csv.incomplete-options.impact-accuracy': 'Exactitude du journal de trading',
  'csv.incomplete-options.import-anyway': 'Importer quand même',
  'csv.incomplete-options.cancel-import': "Annuler l'importation",
  'csv.image-review.title': 'Examiner les références d’images',
  'csv.image-review.summary':
    "J'ai trouvé {imageCount} références d'images dans {tradeCount} trade(s).",
  'csv.image-review.rows': 'Lignes : {rows}',
  'csv.image-review.count': '{count} image(s)',
  'csv.image-review.import-images': 'Importer des images',
  'csv.image-review.discard-all': 'Supprimer toutes les images',
  'csv.image-review.discard-confirmation':
    "Supprimer toutes les références d'images pour cette importation ? Les trades seront toujours importés sans images.",
  'csv.image-review.confirm-discard': 'Oui, tout jeter',
  'image.uploader.paste-title': "Coller l'image du presse-papiers (Ctrl+V)",
  'image.uploader.pasting': 'Coller...',
  'image.uploader.paste': 'Coller',
  'image.uploader.url-placeholder':
    "Coller l'URL de l'image ou le chemin du fichier...",
  'image.uploader.url-input-aria': "Saisie de l'URL de l'image",
  'image.uploader.file-upload-aria': "Télécharger à partir d'un fichier",
  'image.uploader.paste-clipboard-aria': 'Coller depuis le presse-papiers',
  'image.uploader.error-invalid-url':
    "URL de l'image invalide. Veuillez saisir un lien d'image direct.",
  'image.viewer.alt-default': 'Image',
  'image.viewer.description-default': "Aperçu de l'image",
  'image.viewer.error-load':
    "Impossible de charger l'image. Le fichier est peut-être manquant ou inaccessible.",
  'image.viewer.title-fullscreen': 'Cliquez pour voir en plein écran',
  'image.viewer.zoom-indicator': 'Cliquez ou maintenez pour agrandir',
  'image.viewer.delete-button': "Supprimer l'image",
  'image.viewer.nav-prev': 'Image précédente',
  'image.viewer.nav-next': 'Image suivante',
  'image.viewer.zoom-in-hint': 'Pincez ou cliquez pour zoomer',
  'image.viewer.zoom-out-hint':
    '{scale}x (pincer ou cliquer pour effectuer un zoom arrière)',
  'image.viewer.no-images': 'Aucune image à afficher',
  'image.viewer.thumbnail-alt': 'Miniature {n}',
  'image.viewer.close-aria': 'Fermer le mode plein écran',
  'image.carousel.no-images': 'Aucune image à afficher',
  'image.carousel.prev': 'Image précédente',
  'image.carousel.next': 'Image suivante',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'Miniature {index}',
  'paste.notice.image-pasted': '📋 Image collée avec succès',
  'paste.notice.images-pasted': '📋 {count} images collées avec succès',
  'paste.error.clipboard-not-supported':
    'API du Presse-papiers non prise en charge',
  'paste.error.clipboard-empty': 'Rien à coller dans le presse-papiers',
  'paste.error.file-size-exceeds':
    'La taille du fichier {size}Mo dépasse la limite',
  'paste.error.no-images-found':
    "Aucune image trouvée dans le presse-papiers. Essayez d'abord de copier une image.",
  'paste.error.permission-denied': 'Autorisation refusée',
  'datepicker.aria.time': 'Temps',
  'datepicker.button.clear': 'Claire',
  'datepicker.button.today': "Aujourd'hui",
  'datepicker.button.now': 'Maintenant',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'AA',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'common.loading': 'Chargement...',
  'common.error': 'Erreur',
  'common.success': 'Succès',
  'common.warning': 'Avertissement',
  'common.info': 'Informations',
  'common.yes': 'Oui',
  'common.no': 'Non',
  'common.ok': "D'ACCORD",
  'common.search': 'Recherche...',
  'common.select': 'Sélectionner...',
  'common.select-option': 'Sélectionnez une option',
  'common.view': 'Voir',
  'common.none': 'Aucune',
  'common.other': 'Autre',
  'common.breakdown': 'Panne',
  'common.na': 'N/A',
  'common.unknown': 'Inconnu',
  'common.unknown-error': 'Erreur inconnue',
  'common.all': 'Toute',
  'common.select-all': 'Sélectionner tout',
  'common.n-types': '{count} types',
  'common.select-item': 'Sélectionnez {item}',
  'common.header': 'En-tête',
  'common.row-n': 'Ligne {n} :',
  'common.date': 'Date',
  'common.time': 'Temps',
  'common.today': "Aujourd'hui",
  'common.yesterday': 'Hier',
  'common.tomorrow': 'Demain',
  'common.day': 'Jour',
  'common.days': 'Jours',
  'common.week': 'Semaine',
  'common.weeks': 'Semaines',
  'common.month': 'Mois',
  'common.months': 'Mois',
  'common.year': 'Année',
  'common.years': 'Années',
  'common.quarter': 'Quart',
  'common.quarters': 'Quartiers',
  'common.total': 'Totale',
  'common.average': 'Moyenne',
  'common.min': 'Min.',
  'common.max': 'Max.',
  'common.best': 'Meilleure',
  'common.worst': 'Pire',
  'common.profit': 'Profit',
  'common.loss': 'Perte',
  'common.win': 'Gagner',
  'common.lose': 'Perdre',
  'common.trade': 'Trade',
  'common.trades': 'Trades',
  'common.goals': 'Objectifs',
  'common.statuses': 'Statuts',
  'common.enabled': 'activé',
  'common.disabled': 'désactivé',
  'common.color.gray': 'Grise',
  'common.color.red': 'Rouge',
  'common.color.orange': 'Orange',
  'common.color.yellow': 'Jaune',
  'common.day.monday': 'Lundi',
  'common.day.tuesday': 'Mardi',
  'common.day.wednesday': 'Mercredi',
  'common.day.thursday': 'Jeudi',
  'common.day.friday': 'Vendredi',
  'common.day.saturday': 'Samedi',
  'common.day.sunday': 'Dimanche',
  'common.day.all-week': 'Toute la semaine',
  'common.month.january': 'Janvier',
  'common.month.february': 'Février',
  'common.month.march': 'Mars',
  'common.month.april': 'Avril',
  'common.month.may': 'Mai',
  'common.month.june': 'Juin',
  'common.month.july': 'Juillet',
  'common.month.august': 'Août',
  'common.month.september': 'Septembre',
  'common.month.october': 'Octobre',
  'common.month.november': 'Novembre',
  'common.month.december': 'Décembre',
  'common.score.poor': 'Pauvre',
  'common.score.below-average': 'En dessous de la moyenne',
  'common.score.average': 'Moyenne',
  'common.score.strong': 'Forte',
  'common.score.excellent': 'Excellent',
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'Pic du P&L réalisé',
  'chart.tooltip.episode-start': "Début de l'épisode",
  'chart.tooltip.underwater-days': "Temps sous l'eau",
  'chart.tooltip.underwater-trades': "Trades sous l'eau",
  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % de {basis}',
  'chart.tooltip.percent-basis': 'Base du pourcentage',
  'chart.tooltip.distance-to-recovery': "Distance jusqu'à la récupération",
  'chart.tooltip.trade-pnl': 'P&L du trade',
  'chart.tooltip.account': 'Compte',
  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'chart.loading': 'Chargement du graphique...',
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'Entrée',
  'chart.legend.exit': 'Sortie',
  'chart.legend.trade': 'Trade',
  'calendar.day.mon': 'Lun',
  'calendar.day.tue': 'Mar',
  'calendar.day.wed': 'Mer',
  'calendar.day.thu': 'Jeu',
  'calendar.day.fri': 'Ven',
  'calendar.day.sat': 'Sam',
  'calendar.day.sun': 'Dim',
  'calendar.month.jan': 'Jan',
  'calendar.month.feb': 'Fév',
  'calendar.month.mar': 'Mar',
  'calendar.month.apr': 'Avr',
  'calendar.month.may': 'Mai',
  'calendar.month.jun': 'juin',
  'calendar.month.jul': 'Juillet',
  'calendar.month.aug': 'Août',
  'calendar.month.sep': 'Sep',
  'calendar.month.oct': 'Octobre',
  'calendar.month.nov': 'Nov',
  'calendar.month.dec': 'Déc',
  'calendar.legend.less': 'Moins',
  'calendar.legend.more': 'Plus',
  'settings.title': 'Paramètres du journal',
  'settings.language': 'Langue',
  'settings.language-desc': "Sélectionnez la langue d'affichage du plugin",
  'settings.ftp.title': 'Identifiants FTP',
  'settings.ftp.title-metatrader': 'Identifiants FTP pour MetaTrader',
  'settings.ftp.loading': "Chargement des informations d'identification FTP...",
  'settings.ftp.info-message':
    "Utilisez ces informations d'identification pour configurer les paramètres de publication FTP de MetaTrader :",
  'settings.ftp.label.server': 'Serveur FTP :',
  'settings.ftp.label.login': 'Connexion FTP :',
  'settings.ftp.label.password': 'Mot de passe FTP :',
  'settings.ftp.aria.copy-server': 'Copier le serveur FTP',
  'settings.ftp.aria.copy-login': 'Copier la connexion FTP',
  'settings.ftp.aria.copy-password': 'Copier le mot de passe',
  'settings.ftp.aria.password-unavailable':
    'Mot de passe non disponible pour la copie',
  'settings.ftp.aria.password-hidden': 'Mot de passe masqué',
  'settings.ftp.aria.hide-password': 'Masquer le mot de passe',
  'settings.ftp.aria.show-password': 'Afficher le mot de passe',
  'settings.ftp.notice.password-masked':
    "Le mot de passe est stocké mais n'est pas disponible pour l'affichage/la copie. Réinitialisez le mot de passe pour en obtenir un nouveau.",
  'settings.ftp.notice.password-save':
    'Enregistrez ce mot de passe en toute sécurité. Il ne peut pas être récupéré ultérieurement.',
  'settings.ftp.button.reset': 'Réinitialiser le mot de passe FTP',
  'settings.ftp.button.resetting': 'Réinitialisation du mot de passe...',
  'settings.ftp.reset-hint':
    'Cliquez sur ce bouton pour générer un nouveau mot de passe FTP.',
  'settings.ftp.instructions.title': 'Instructions de setup de MetaTrader :',
  'settings.ftp.instructions.step1': 'Ouvrez MetaTrader 5 (MT5)',
  'settings.ftp.instructions.step2': 'Cliquez sur le menu "Outils" en haut',
  'settings.ftp.instructions.step3': 'Sélectionnez "Options"',
  'settings.ftp.instructions.step4':
    'Accédez à l\'onglet "FTP" et entrez le serveur FTP, l\'identifiant et le mot de passe indiqués ci-dessus.',
  'settings.ftp.instructions.step5': 'Activer le « Mode passif »',
  'settings.ftp.instructions.step6':
    "Activez la publication automatique des rapports via FTP et définissez l'intervalle d'actualisation sur 60 minutes.",
  'settings.ftp.no-credentials':
    "Aucune information d'identification FTP trouvée. Cliquez sur « Créer des informations d'identification FTP » dans la section ci-dessus pour les générer.",
  'settings.ftp.error.reset-failed':
    'Échec de la réinitialisation du mot de passe',
  'settings.auth.title': 'Compte',
  'settings.auth.description':
    "Gérer les paramètres d'authentification et de connexion.",
  'settings.auth.status': 'Statut',
  'settings.auth.status-desc': "État actuel de la connexion et de l'abonnement",
  'settings.auth.status-offline': 'Hors ligne',
  'settings.auth.status-online': 'En ligne',
  'settings.auth.plan-suffix': 'Plan',
  'settings.auth.authentication': 'Authentification',
  'settings.auth.sign-in-desc':
    'Connectez-vous pour accéder à votre journal de trading',
  'settings.auth.signed-in': 'Connecté',
  'settings.auth.sign-in-up': "Se connecter / S'inscrire",
  'settings.auth.sign-out': 'se déconnecter',
  'settings.auth.sign-out-desc': 'Déconnectez-vous de votre compte',
  'settings.auth.subscription-features': "Fonctionnalités d'abonnement",
  'settings.auth.tier-free': 'Forfait gratuit avec fonctionnalités de base.',
  'settings.auth.tier-pro':
    'Plan Pro avec analyses avancées et stockage illimité.',
  'settings.auth.tier-enterprise':
    'Forfait Entreprise avec accès complet aux fonctionnalités et assistance prioritaire.',
  'settings.auth.tier-unknown': "Statut d'abonnement inconnu.",
  'settings.auth.error-prefix': 'Erreur:',
  'settings.auth.offline-mode': 'Mode hors ligne',
  'settings.auth.offline-desc':
    'Mode hors ligne. Certaines fonctionnalités peuvent être limitées. Se synchronisera automatiquement en ligne.',
  'settings.auth.grace-period':
    'Le délai de grâce se termine dans {days} jours',
  'settings.auth.guest': 'Invitée',
  'settings.auth.actions': 'Actions',
  'settings.auth.your-plan': 'Votre plan',
  'settings.auth.feature-basic-trades': 'Suivi de trading de base',
  'settings.auth.feature-basic-analytics': 'Analyses de base',
  'settings.auth.feature-unlimited-trades': 'Transactions illimitées',
  'settings.auth.feature-advanced-analytics': 'Analyses avancées',
  'settings.auth.feature-api-access': 'Accès aux API',
  'settings.auth.feature-priority-support': 'Assistance prioritaire',
  'settings.auth.manage-subscription': "Gérer l'abonnement",
  'settings.tab.general': 'Générale',
  'settings.tab.reviews': 'Revues',
  'settings.tab.customization': 'Personnalisation',
  'settings.tab.backend': 'Synchronisation de trading',
  'settings.tab.accounts': 'Compte',
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Revue hebdomadaire',
  'settings.reviews.monthly': 'Revue mensuelle',
  'settings.reviews.quarterly': 'Revue trimestrielle',
  'settings.reviews.yearly': 'Revue annuelle',
  'settings.reviews.default-templates': 'Layouts par défaut',
  'settings.reviews.default-templates-desc':
    'Sélectionnez le modèle à utiliser lors de la création de nouvelles notes. Vous pouvez également définir des valeurs par défaut dans le générateur de modèles.',
  'settings.reviews.trade-template': 'Layout de trade',
  'settings.reviews.trade-template-desc':
    'Modèle utilisé pour les nouvelles notes de trading',
  'settings.reviews.drc-template': 'Layout DRC',
  'settings.reviews.drc-template-desc':
    'Modèle utilisé pour les nouveaux bulletins quotidiens',
  'settings.reviews.weekly-template': 'Layout hebdomadaire',
  'settings.reviews.weekly-template-desc':
    'Modèle utilisé pour les nouvelles revues hebdomadaires',
  'settings.reviews.monthly-template': 'Layout mensuel',
  'settings.reviews.monthly-template-desc':
    'Modèle utilisé pour les nouvelles revues mensuelles',
  'settings.reviews.quarterly-template': 'Layout trimestriel',
  'settings.reviews.quarterly-template-desc':
    'Modèle utilisé pour les nouvelles revues trimestrielles',
  'settings.reviews.yearly-template': 'Layout annuel',
  'settings.reviews.yearly-template-desc':
    'Modèle utilisé pour les nouveaux examens annuels',
  'settings.reviews.template-builder': 'Layout Builder',
  'settings.reviews.template-builder-desc':
    'Créez, modifiez et gérez visuellement vos mises en page. La vue Builder vous permet de glisser-déposer des sections, de configurer des options et de prévisualiser vos mises en page en temps réel.',
  'settings.reviews.open-builder': 'Ouvrir le Layout Builder',
  'settings.reviews.recurring-goals': 'Objectifs récurrents',
  'settings.reviews.recurring-goals-desc':
    'Définissez des objectifs qui apparaissent automatiquement à chaque nouvelle revue. Ceux-ci sont copiés lors de la création de la revue et peuvent être modifiés par revue.',
  'settings.reviews.daily-goals': 'Objectifs quotidiens',
  'settings.reviews.daily-goal-placeholder':
    'Ajouter un objectif quotidien récurrent...',
  'settings.reviews.weekly-goals': 'Objectifs hebdomadaires',
  'settings.reviews.weekly-goal-placeholder':
    'Ajouter un objectif hebdomadaire récurrent...',
  'settings.reviews.pre-trade-checklist': 'Checklist pré-trade du DRC',
  'settings.reviews.pre-trade-checklist-desc':
    'Définissez les éléments de la liste de contrôle qui apparaissent automatiquement sur chaque nouveau DRC. Ceux-ci sont copiés dans chaque DRC lors de leur création et peuvent être modifiés quotidiennement.',
  'settings.reviews.checklist-placeholder':
    'Ajouter un élément de liste de contrôle...',
  'settings.reviews.auto-create': 'Créer automatiquement des revues',
  'settings.reviews.global-auto-create':
    'Revue de création automatique globale',
  'settings.reviews.global-auto-create-desc':
    "Créez automatiquement des revues lorsque le premier trade de la période correspondante est enregistré. Ce paramètre s'applique aux revues quotidiennes, hebdomadaires, mensuelles, trimestrielles et annuelles.",
  'settings.reviews.global-auto-create-aria':
    'Revue de création automatique globale',
  'settings.reviews.auto-create-drc-nav':
    'Créer automatiquement un DRC lors de la navigation',
  'settings.reviews.auto-create-drc-nav-desc':
    "Créez automatiquement un nouveau DRC lorsque vous accédez à un jour qui n'en a pas.",
  'settings.reviews.auto-create-drc-nav-aria':
    'Créer automatiquement un DRC lors de la navigation',
  'settings.reviews.auto-create-weekly-nav':
    'Créer automatiquement une revue hebdomadaire sur la navigation',
  'settings.reviews.auto-create-weekly-nav-desc':
    "Créez automatiquement une nouvelle revue hebdomadaire lorsque vous accédez à une semaine qui n'en a pas",
  'settings.reviews.auto-create-weekly-nav-aria':
    'Créer automatiquement une revue hebdomadaire sur la navigation',
  'settings.reviews.auto-create-monthly-nav':
    'Créer automatiquement une revue mensuelle sur la navigation',
  'settings.reviews.auto-create-monthly-nav-desc':
    "Créez automatiquement une nouvelle revue mensuelle lorsque vous accédez à un mois qui n'en a pas",
  'settings.reviews.auto-create-monthly-nav-aria':
    'Créer automatiquement une revue mensuelle sur la navigation',
  'settings.reviews.auto-create-quarterly-nav':
    'Créer automatiquement une revue trimestrielle sur la navigation',
  'settings.reviews.auto-create-quarterly-nav-desc':
    "Créez automatiquement une nouvelle revue trimestrielle lorsque vous accédez à un trimestre qui n'en a pas",
  'settings.reviews.auto-create-quarterly-nav-aria':
    'Créer automatiquement une revue trimestrielle sur la navigation',
  'settings.reviews.auto-create-yearly-nav':
    "Création automatique d'une revue annuelle sur la navigation",
  'settings.reviews.auto-create-yearly-nav-desc':
    "Créez automatiquement une nouvelle revue annuelle lorsque vous accédez à une année qui n'en a pas",
  'settings.reviews.auto-create-yearly-nav-aria':
    "Création automatique d'une revue annuelle sur la navigation",
  'settings.reviews.scalper-defaults': 'Valeurs par défaut du scalper',
  'settings.reviews.scalper-defaults-desc':
    'Configurez les paramètres globaux par défaut pour le comportement de Demon Tracker. Les widgets Demon Tracker individuels peuvent toujours remplacer ces valeurs dans le Layout Builder.',
  'settings.reviews.scalper-default-count-mode': 'Mode de comptage par défaut',
  'settings.reviews.scalper-default-count-mode-desc':
    'Choisissez si les erreurs récurrentes sont comptées par trade ou une fois par jour de bourse.',
  'settings.reviews.scalper-default-source-mode': 'Mode source par défaut',
  'settings.reviews.scalper-default-source-mode-desc':
    'Choisissez si Demon Tracker utilise des erreurs de trading, des erreurs de session ou les deux.',
  'settings.reviews.scalper-auto-apply-session':
    'Appliquer automatiquement les erreurs de session aux trades quotidiens',
  'settings.reviews.scalper-auto-apply-session-desc':
    "Lorsqu'elles sont activées, les erreurs au niveau de la session peuvent s'appliquer par défaut à tous les trades au cours du même jour de trading.",
  'settings.reviews.scalper-auto-apply-session-aria':
    'Appliquer automatiquement les erreurs de session aux trades quotidiens',
  'settings.reviews.notice.template-updated': 'Layout par défaut mis à jour',
  'settings.reviews.notice.builder-not-found':
    'Commande Layout Builder introuvable',
  'settings.reviews.notice.global-auto-create':
    'Création automatique pour tous les revue {status}',
  'settings.reviews.notice.auto-create-nav':
    'Créer automatiquement {type} lors de la navigation {status}',
  'settings.reviews.daily.checklist-title':
    'Éléments de la liste de contrôle pré-trade',
  'settings.reviews.daily.checklist-desc':
    'Personnalisez les éléments de la liste de contrôle qui apparaissent dans votre DRC. Ce sont des tâches que vous devez effectuer avant de commencer votre session de trading.',
  'settings.reviews.daily.checklist-placeholder':
    'Nouvel élément de la liste de contrôle',
  'settings.reviews.daily.questions-title': 'Questions de revue',
  'settings.reviews.daily.questions-desc':
    'Personnalisez les questions de réflexion qui apparaissent dans la section de revue. Ces questions vous aident à réfléchir sur vos performances de trading.',
  'library.type.drc': 'DRC',
  'library.type.weekly': 'Hebdomadaire',
  'library.type.monthly': 'Mensuelle',
  'library.type.quarterly': 'Trimestrielle',
  'library.type.yearly': 'Annuelle',
  'library.type.trade': 'Trade',
  'library.error.invalid-share-code': 'Code de partage invalide',
  'library.notice.import-success': 'Layout "{name}" importé avec succès !',
  'library.error.import-failed': "Échec de l'importation du layout",
  'library.notice.select-template':
    'Veuillez sélectionner un modèle à exporter',
  'library.notice.template-not-found': 'Layout introuvable',
  'library.notice.code-generated': 'Partagez le code généré !',
  'library.error.export-failed': "Échec de l'exportation du layout",
  'library.notice.copied': 'Partager le code copié dans le presse-papier !',
  'library.error.copy-failed': 'Échec de la copie dans le presse-papiers',
  'library.title.import': "Layout d'importation",
  'library.desc.import':
    "Collez un code de partage JRT-v1 pour importer un layout d'un autre utilisateur.",
  'library.label.share-code': 'Partager le code',
  'library.placeholder.import-code': 'Collez JRT-v1-... partagez le code ici',
  'library.button.validating': 'Validation...',
  'library.button.validate': 'Valider',
  'library.button.import': "Layout d'importation",
  'library.preview.valid': 'Layout valide',
  'library.preview.invalid': 'Code de partage invalide',
  'library.title.export': "Layout d'exportation",
  'library.desc.export':
    "Sélectionnez un layout pour générer un code de partage que d'autres peuvent importer.",
  'library.empty.title': 'Aucun layout personnalisé à exporter.',
  'library.empty.hint':
    "Créez d'abord un layout personnalisé dans les onglets de revue ou de trade de layouts, puis revenez ici pour le partager.",
  'library.label.select-template': 'Sélectionnez un layout',
  'library.option.select-template': '-- Sélectionnez un layout --',
  'library.button.generate-code': 'Générer le code de partage',
  'library.button.copy-code': 'Copier dans le presse-papier',
  'settings.reviews.daily.questions-placeholder': 'Nouvelle question de revue',
  'settings.reviews.daily.timeframes-title': 'Délais de prévision',
  'settings.reviews.daily.timeframes-desc':
    'Personnalisez les délais qui apparaissent dans les prévisions de votre DRC.',
  'settings.reviews.daily.timeframes-placeholder':
    'Nouveau délai (par exemple, 15 M, 5 M)',
  'settings.weekly.review-questions': 'Questions de revue',
  'settings.weekly.review-questions-desc':
    'Personnalisez les questions qui apparaissent dans votre revue hebdomadaire. Ces questions vous aident à réfléchir à vos performances de trading au cours de la semaine.',
  'settings.weekly.new-question-placeholder': 'Nouvelle question de revue',
  'settings.weekly.forecast-timeframes': 'Délais de prévision',
  'settings.weekly.forecast-timeframes-desc':
    'Personnalisez les délais qui apparaissent dans vos prévisions hebdomadaires.',
  'settings.weekly.new-timeframe-placeholder':
    'Nouvelle période (par exemple, hebdomadaire, quotidienne)',
  'settings.weekly.default-question-1':
    "Qu'est-ce qui a bien fonctionné cette semaine ?",
  'settings.weekly.default-question-2':
    "Qu'est-ce qui n'a pas fonctionné cette semaine ?",
  'settings.weekly.default-question-3':
    'Quelles setups ont été les plus rentables ?',
  'settings.weekly.default-question-4':
    'Quelles erreurs me coûtent le plus d’argent ?',
  'settings.weekly.default-question-5':
    'Que pourrais-je améliorer pour la semaine prochaine ?',
  'settings.weekly.default-timeframe-monthly': 'Mensuelle',
  'settings.weekly.default-timeframe-weekly': 'Hebdomadaire',
  'settings.weekly.default-timeframe-daily': 'Tous les jours',
  'settings.shared.timeframes.title': 'Délais de prévision',
  'settings.shared.timeframes.desc':
    'Personnalisez les délais qui apparaissent dans vos prévisions',
  'settings.shared.timeframes.placeholder':
    'Nouveau délai (par exemple, 15 M, 5 M)',
  'settings.shared.timeframes.reset-to-defaults':
    'Réinitialiser aux valeurs par défaut',
  'shared.goal-tracker.title': 'Objectifs',
  'shared.goal-tracker.empty': 'Aucun but trouvé',
  'shared.goal-tracker.remove-goal': "Supprimer l'objectif",
  'shared.goal-tracker.add-goal-placeholder': 'Ajouter un nouvel objectif',
  'shared.empty-state.message': 'Aucune donnée disponible',
  'weekly.tab.preparation': 'Préparation',
  'weekly.tab.overview': 'Aperçu',
  'weekly.tab.review': 'Revue',
  'weekly.review.drcs.title': 'Bilans quotidiens de cette semaine',
  'weekly.review.drcs.empty':
    'Aucune revue quotidienne trouvée pour cette semaine',
  'account.settings.modal.title': 'Paramètres du tableau de bord du compte',
  'account.settings.notice.name-empty':
    'Le nom du type de compte ne peut pas être vide',
  'account.settings.notice.type-exists':
    'Le type de compte "{name}" existe déjà',
  'account.settings.notice.reserved-name':
    '"{name}" est un nom de type de compte réservé',
  'account.settings.notice.type-added':
    'Le type de compte "{name}" a été ajouté avec succès',
  'account.settings.notice.add-error':
    "Erreur lors de l'ajout du type de compte : {error}",
  'account.settings.notice.cannot-delete-archived':
    'Impossible de supprimer le type de compte "Archivé" - il est réservé à l\'archivage des comptes',
  'account.settings.notice.analyze-error':
    "Erreur lors de l'analyse de l'utilisation du type de compte",
  'account.settings.notice.cannot-delete-has-accounts':
    'Impossible de supprimer "{name}" : il est associé à {count} comptes. Fonctionnalité de migration à venir.',
  'account.settings.notice.saved':
    'Paramètres du tableau de bord du compte enregistrés avec succès',
  'account.settings.notice.save-error':
    "Erreur lors de l'enregistrement des paramètres : {error}",
  'account.settings.notice.migration-target-required':
    'Veuillez sélectionner un type de compte cible pour la réattribution',
  'account.settings.notice.migration-failed': 'Échec de la migration : {error}',
  'account.settings.notice.type-deleted':
    'Le type de compte "{name}" a été supprimé avec succès',
  'account.settings.notice.type-deleted-with-cleanup':
    'Le type de compte "{name}" a été supprimé avec succès (nettoyé : {actions})',
  'account.settings.notice.migration-error':
    'Erreur lors de la migration : {error}',
  'account.settings.notice.delete-error':
    'Erreur lors de la suppression du type de compte : {error}',
  'account.settings.notice.operation-failed': '{operation} a échoué : {error}',
  'account.settings.notice.migration-no-targets':
    "Impossible de migrer les comptes : aucun autre type de compte disponible. Créez d'abord un nouveau type de compte.",
  'account.settings.notice.type-deleted-migrated':
    'Le type de compte « {name} » a été supprimé avec succès.{count} comptes {action}',
  'account.settings.operation.type-deletion': 'Suppression du type de compte',
  'account.settings.migration.error.target-required':
    'Type de cible requis pour la réaffectation',
  'account.settings.migration.error.invalid-option':
    'Option de migration non valide',
  'account.settings.unnamed-account': 'Compte sans nom',
  'account.settings.migration.title': 'Migrer les comptes avant la suppression',
  'account.settings.migration.warning':
    'Vous êtes sur le point de supprimer « {name} » auquel sont associés {count} comptes.',
  'account.settings.migration.instruction':
    'Ces comptes doivent être traités avant que le type de compte puisse être supprimé :',
  'account.settings.migration.more-accounts': '... et {count} plus',
  'account.settings.migration.choose-option':
    'Choisissez comment gérer ces comptes :',
  'account.settings.migration.option.reassign.title':
    'Réaffecter à un type différent',
  'account.settings.migration.option.reassign.desc':
    'Déplacer tous les comptes vers un autre type de compte',
  'account.settings.migration.target-type.label': 'Type de compte cible :',
  'account.settings.migration.option.archive.title': 'Archiver les comptes',
  'account.settings.migration.option.archive.desc':
    'Déplacer tous les comptes vers le statut « archivé »',
  'account.settings.migration.option.delete.title': 'Marquer pour suppression',
  'account.settings.migration.option.delete.desc':
    'Marquer tous les comptes comme supprimés',
  'account.settings.migration.button.migrate': 'Migrer et supprimer le type',
  'account.settings.migration.button.migrating': 'Migration...',
  'account.settings.migration.action.reassigned': 'réaffecté à "{target}"',
  'account.settings.migration.action.archived': "déplacé vers l'état archivé",
  'account.settings.migration.action.deleted': 'marqué pour suppression',
  'account.settings.delete.title': 'Supprimer le type de compte',
  'account.settings.delete.confirm-question':
    'Êtes-vous sûr de vouloir supprimer le type de compte « {name} » ?',
  'account.settings.delete.impact-analysis': "Analyse d'impact :",
  'account.settings.delete.affected-accounts':
    '⚠️ {count} compte(s) concerné(s) :',
  'account.settings.delete.migration-notice':
    'Remarque : Ces comptes devront être réaffectés à un type de compte différent avant que la suppression puisse avoir lieu.',
  'account.settings.delete.no-affected':
    "✅ Aucun compte n'utilise ce type de compte",
  'account.settings.delete.cleanup-title': 'Paramètres qui seront nettoyés :',
  'account.settings.delete.cleanup.excluded':
    '✓ Supprimé des types de comptes exclus',
  'account.settings.delete.cleanup.order': "✓ Supprimé de l'ordre d'affichage",
  'account.settings.delete.cleanup.withdrawals':
    '✓ Supprimé des paramètres de retrait',
  'account.settings.delete.cleanup.none':
    "Aucun nettoyage des paramètres n'est nécessaire",
  'account.settings.delete.button.setup-migration': 'Configurer la migration',
  'account.settings.delete.button.delete': 'Supprimer le type de compte',
  'account.settings.delete.button.deleting': 'Suppression...',
  'account.settings.section.available-types.title':
    'Types de comptes disponibles',
  'account.settings.section.available-types.desc':
    'Types de comptes courants dans votre système.',
  'account.settings.section.available-types.placeholder':
    'Entrez le nom du type de compte...',
  'account.settings.section.available-types.add-aria':
    'Ajouter un nouveau type de compte',
  'account.settings.section.available-types.delete-aria': 'Supprimer {name}',
  'account.settings.section.available-types.empty':
    'Aucun type de compte personnalisé défini.',
  'account.settings.section.inclusion.title':
    "Paramètres d'inclusion du tableau de bord",
  'account.settings.section.inclusion.desc':
    'Choisissez les types de comptes à inclure dans les calculs du tableau de bord. Configurez également si les retraits de chaque type de compte sont inclus dans les mesures de retrait total.',
  'account.settings.section.inclusion.include-dashboard':
    'Dans les stats du tableau de bord',
  'account.settings.section.inclusion.include-withdrawals': 'Retraits',
  'account.settings.section.inclusion.empty':
    'Aucun type de compte disponible à configurer.',
  'account.settings.section.order.title': "Ordre d'affichage",
  'account.settings.section.order.desc':
    'Réorganisez la façon dont les types de comptes apparaissent dans le tableau de bord.',
  'account.settings.section.order.empty':
    'Aucun type de compte disponible à la commande.',
  'account.settings.section.order.move-up': 'Monter',
  'account.settings.section.order.move-down': 'Descendre',
  'account.settings.button.save': 'Enregistrer les paramètres',
  'account.settings.button.saving': 'Économie...',
  'weekly.review.drcs.empty-sub':
    'Les revue quotidiens apparaîtront ici une fois que vous les aurez créés',
  'weekly.review.drcs.mental': 'Mentale',
  'weekly.review.drcs.technical': 'Technique',
  'weekly.review.drcs.view-button': 'Voir DRC',
  'weekly.review.drcs.no-answer': 'Aucune réponse fournie',
  'weekly.review.performance.title': 'Auto-évaluation de la performance',
  'weekly.review.performance.mental': 'Performance mentale',
  'weekly.review.performance.mental-placeholder':
    'Notes sur vos performances mentales...',
  'weekly.review.performance.technical': 'Exécution technique',
  'weekly.review.performance.technical-placeholder':
    'Notes sur votre exécution technique...',
  'weekly.review.questions.title': 'Questions de revue hebdomadaire',
  'weekly.review.questions.empty': 'Aucune question de revue configurée',
  'weekly.review.questions.empty-sub':
    "Ajouter des questions de revue dans l'onglet Paramètres de la revue hebdomadaire",
  'weekly.review.questions.answer-placeholder': 'Votre réponse ici...',
  'weekly.review.questions.settings-hint':
    "Les questions de revue peuvent être configurées dans l'onglet Paramètres de la revue hebdomadaire.",
  'weekly.review.goals.title': 'Objectifs pour la semaine prochaine',
  'weekly.review.goals.empty': 'Aucun objectif fixé pour la semaine prochaine',
  'weekly.review.goals.empty-sub':
    'Définissez des objectifs clairs pour concentrer votre trading',
  'weekly.review.goals.add-placeholder':
    'Ajouter un objectif pour la semaine prochaine',
  'weekly.review.goals.add-button': 'Ajouter un objectif',
  'weekly.preparation.goals.title': 'Objectifs hebdomadaires',
  'weekly.preparation.goals.empty': 'Aucun but de la semaine précédente',
  'weekly.preparation.events.title': 'Événements clés',
  'weekly.preparation.events.colour': 'Couleur:',
  'weekly.preparation.events.day': 'Jour:',
  'weekly.preparation.events.day-none': 'Aucun (facultatif)',
  'weekly.preparation.events.notes-placeholder': 'Notes sur cet événement',
  'weekly.preparation.events.add-button': 'Ajouter un événement',
  'weekly.preparation.events.event-label': 'Événement',
  'weekly.preparation.events.event-placeholder':
    'Sélectionner ou créer un événement',
  'weekly.preparation.events.empty': 'Aucun événement clé ajouté',
  'weekly.preparation.events.sub-empty':
    'Ajoutez des événements de marché importants qui pourraient avoir un impact sur votre trading',
  'weekly.preparation.forecast.title': 'Prévisions hebdomadaires',
  'weekly.overview.pnl-chart.title': 'P&L cumulé hebdomadaire',
  'weekly.overview.pnl-chart.empty': 'Aucune donnée de P&L à afficher',
  'weekly.overview.pnl-chart.empty-sub':
    'Votre profit/perte cumulé s’affichera ici une fois des trades clôturés enregistrés',
  'weekly.overview.drawdown-chart.title': 'Drawdown hebdomadaire',
  'weekly.overview.drawdown-chart.empty':
    'Aucune donnée de drawdown à afficher',
  'weekly.overview.drawdown-chart.empty-sub':
    'Vos mesures de drawdown apparaîtront ici une fois que vous aurez enregistré les trades clôturés',
  'weekly.overview.performance.title': 'Performance hebdomadaire',
  'weekly.overview.metrics.net-pnl': 'P&L net',
  'weekly.overview.metrics.win-rate': 'Taux de réussite',
  'weekly.overview.metrics.profit-factor': 'Ratio gains/pertes',
  'weekly.overview.metrics.expectancy': 'Espérance de gain',
  'weekly.overview.metrics.total-trades': 'Total des trades',
  'weekly.overview.metrics.avg-win': 'Gain moy.',
  'weekly.overview.metrics.avg-loss': 'Perte moy.',
  'weekly.overview.metrics.pl-ratio': 'Rapport P/L',
  'weekly.overview.setup-performance.title': 'Performances de setup',
  'weekly.overview.setup-performance.col-setup': 'Setup',
  'weekly.overview.setup-performance.col-pnl': 'P&L',
  'weekly.overview.setup-performance.col-win-rate': 'Réussite %',
  'weekly.overview.setup-performance.col-trades': 'Trades',
  'weekly.overview.setup-performance.empty':
    'Aucune donnée de setup disponible',
  'weekly.overview.setup-performance.empty-sub':
    'Ajoutez des balises de setup à vos trades pour voir les mesures de performances par setup',
  'weekly.overview.trades-chart.title': 'Trades hebdomadaires',
  'weekly.overview.trades-chart.empty': 'Aucun trade pour cette semaine',
  'weekly.overview.trades-chart.empty-sub':
    'Suivez vos trades individuels pour les voir visualisées ici',
  'weekly.overview.best-trade.title': 'Meilleur trade de la semaine',
  'weekly.overview.best-trade.empty': 'Aucun trade gagnant cette semaine',
  'weekly.overview.best-trade.empty-sub':
    'Vos meilleurs trades apparaîtront ici une fois que vous aurez enregistré des trades rentables',
  'weekly.overview.worst-trade.title': 'Le pire trade de la semaine',
  'weekly.overview.worst-trade.empty': 'Pas de trades perdants cette semaine',
  'weekly.overview.worst-trade.empty-sub':
    'Vos trades les moins réussis apparaîtront ici pour vous aider à apprendre et à vous améliorer',
  'weekly.overview.daily-performance.title': 'Performances quotidiennes',
  'weekly.overview.daily-performance.col-date': 'Date',
  'weekly.overview.daily-performance.col-trades': 'Trades',
  'weekly.overview.daily-performance.col-win-rate': 'Réussite %',
  'weekly.overview.daily-performance.col-profit-factor': 'Ratio gains/pertes',
  'weekly.overview.daily-performance.col-pnl': 'P&L',
  'weekly.overview.daily-performance.empty': 'Aucun trade pour cette semaine',
  'weekly.overview.daily-performance.empty-sub':
    'Vos performances de trading quotidiennes apparaîtront ici une fois que vous aurez enregistré vos trades.',
  'weekly.overview.trade.unknown': 'Inconnu',
  'weekly.overview.trade.na': 'N/A',
  'weekly.overview.trade.label-date': 'Date:',
  'weekly.overview.trade.label-setup': 'Setup :',
  'weekly.overview.trade.label-duration': 'Durée:',
  'weekly.overview.trade.label-tags': 'Balises :',
  'weekly.overview.trade.label-mistakes': 'Erreurs :',
  'weekly.overview.trade.duration-format': '{hours}h {minutes}m',
  'weekly.overview.button.create-trade': 'Créer un trade',
  'weekly.overview.button.view-trade-details': 'Afficher les détails du trade',
  'monthly.tab.overview': 'Aperçu',
  'monthly.tab.review': 'Revue',
  'monthly.review.demon-tracker.title': 'Traqueur de démons',
  'monthly.review.demon-tracker.description':
    'Suivez vos erreurs récurrentes pour identifier des modèles et améliorer votre discipline de trading.',
  'monthly.review.demon-tracker.column.demon': 'DÉMON',
  'monthly.review.demon-tracker.column.stop-trading': 'ARRÊTER DE TRADER',
  'monthly.review.demon-tracker.summary.unique-mistakes':
    "Total d'erreurs uniques :",
  'monthly.review.demon-tracker.summary.total-occurrences':
    "Nombre total d'erreurs :",
  'monthly.review.demon-tracker.summary.critical-mistakes':
    'Erreurs critiques (6+) :',
  'monthly.review.demon-tracker.empty': 'Aucune erreur détectée ce mois-ci',
  'monthly.review.demon-tracker.empty-sub':
    'Les erreurs enregistrées dans vos trades apparaîtront ici pour vous aider à identifier les modèles',
  'monthly.review.mental-game-performance': 'Performance mentale',
  'monthly.review.technical-game-performance': 'Performance technique',
  'settings.loss-review.title': 'Paramètres de revue des pertes',
  'settings.loss-review.description':
    'Configurez la revue des pertes qui apparaît au bas des trades perdants. Cela vous aide à tirer les leçons des pertes et à maintenir une bonne psychologie de trading.',
  'settings.loss-review.enable': 'Activer la revue des pertes',
  'settings.loss-review.enable-desc':
    'Afficher la section Revue des pertes pour les trades avec un P&L négatif',
  'settings.loss-review.sections-title': 'Sections de revue des pertes',
  'settings.loss-review.add-section': 'Ajouter une section',
  'settings.loss-review.reset-to-defaults':
    'Réinitialiser aux valeurs par défaut',
  'settings.loss-review.new-section-title': 'Nouvelle rubrique',
  'settings.loss-review.empty-state':
    'Aucune section configurée. Cliquez sur "Ajouter une section" pour créer votre première section.',
  'backend.title': 'Synchronisation de trading',
  'backend.description':
    'Configurez la synchronisation MetaTrader (MT4/MT5) et maintenez votre vault à jour automatiquement.',
  'trade-sync.gate.signin.title': 'Connexion requise',
  'trade-sync.gate.signin.description':
    "Pour activer la synchronisation des trades, connectez-vous d'abord à votre compte Journalit.",
  'trade-sync.gate.signin.cta': 'Se connecter',
  'trade-sync.gate.pro.title': 'Professionnel requis',
  'trade-sync.gate.pro.description':
    'La synchronisation des trades est une fonctionnalité Pro. Mettez à niveau pour continuer.',
  'trade-sync.gate.pro.cta': 'Mettre à niveau maintenant',
  'premium.gate.cta.activate': 'Activer Pro',
  'premium.gate.cta.upgrade-now': 'Mettre à niveau maintenant',
  'premium.gate.cta.signin-continue': 'Connectez-vous et continuez',
  'premium.gate.cta.continue-pro': 'Continuer vers Pro',
  'premium.gate.cta.keep-editing': 'Continuer à éditer',
  'premium.gate.cta.refresh': "Actualiser l'état",
  'premium.gate.import.state.signin.title':
    'Vous n’êtes plus qu’à un pas de l’importation',
  'premium.gate.import.state.signin.description':
    'Votre fichier et vos mappages sont prêts. Connectez-vous pour continuer.',
  'premium.gate.import.state.pro.title': 'Vous êtes prêt à importer',
  'premium.gate.import.state.pro.description':
    "Votre fichier et vos mappages sont prêts. L'importation fait partie de Pro.",
  'premium.gate.import.reassurance':
    'Votre aperçu et les mappages de colonnes restent exactement tels qu’ils sont.',
  'premium.gate.trial-hint':
    'Les premiers abonnements Pro incluent un essai gratuit de 14 jours.',
  'premium.gate.offline':
    "Vous semblez être hors ligne. L'activation nécessite Internet.",
  'premium.gate.not-pro-yet':
    "Vous êtes connecté, mais votre compte n'est pas encore Pro. Mettez à niveau puis actualisez.",
  'backend.connection.title': 'Paramètres de connexion',
  'backend.connection.status': 'État de la connexion',
  'backend.connection.status-desc':
    'État actuel de la connexion au serveur de trading',
  'backend.status.connected': 'Connecté',
  'backend.status.disconnected': 'Déconnecté',
  'backend.status.checking': 'Vérification...',
  'backend.register.title': 'Enregistrer le vault',
  'backend.register.description':
    'Enregistrez ce vault auprès du serveur principal pour la synchronisation',
  'backend.register.button': 'Enregistrer le vault',
  'backend.register.registering': 'Enregistrement...',
  'backend.ftp.title': "Informations d'identification FTP",
  'backend.ftp.description':
    "Créez des informations d'identification FTP pour télécharger les rapports MetaTrader. Un nom d'utilisateur unique sera généré automatiquement.",
  'backend.ftp.create-button': "Créer des informations d'identification FTP",
  'backend.ftp.creating': 'Création...',
  'backend.ftp.credentials-title': 'Identifiants FTP MetaTrader',
  'backend.sync.title': 'Paramètres de synchronisation',
  'backend.sync.auto-sync': 'Activer la synchronisation automatique',
  'backend.sync.auto-sync-desc':
    'Synchronisez automatiquement les trades depuis le serveur backend',
  'backend.sync.auto-sync-info':
    'La synchronisation automatique vérifie les nouvelles trades toutes les heures',
  'backend.sync.auto-sync-aria': 'Activer la synchronisation automatique',
  'backend.sync.manual': 'Synchronisation manuelle',
  'backend.sync.manual-desc': 'Forcer la synchronisation immédiate des trades',
  'backend.sync.manual-info':
    "Temps d'attente moyen : 2-3 minutes (maximum : 5 minutes)",
  'backend.sync.syncing': 'Synchronisation...',
  'backend.sync.force-button': 'Forcer la synchronisation maintenant',
  'backend.sync.last-result': 'Résultat de la dernière synchronisation',
  'backend.sync.synced-trades':
    '{trades} trades synchronisés ({files} nouveaux fichiers)',
  'backend.sync.no-new-trades': 'Aucun nouveau trade à synchroniser',
  'backend.sync.status': 'Statut de synchronisation',
  'backend.sync.last-sync': 'Dernière synchronisation',
  'backend.sync.total-syncs': 'Synchronisations totales',
  'backend.sync.never': 'Jamais',
  'backend.sync.invalid-date': 'Date invalide',
  'backend.notice.vault-registered':
    '✅ Vault enregistré sur le serveur de trading',
  'backend.notice.sync-cancelled': '⏹️ Synchronisation annulée',
  'backend.notice.sync-in-progress': '⚠️ Synchronisation déjà en cours',
  'backend.notice.account-info-failed':
    "❌ Impossible d'obtenir les informations du compte",
  'backend.notice.sync-batch-progress':
    '⏳ Lot de synchronisation : {count} trades ({progress} % terminées, {remaining} restantes)',
  'backend.notice.all-trades-synced':
    '✅ Toutes les trades {count} sont déjà synchronisées',
  'backend.notice.account-created': '📊 Compte créé : {name}',
  'backend.notice.batch-complete':
    '⏳ Lot terminé : {processed}/{total} trades ({progress}%). On continue...',
  'backend.notice.sync-complete':
    '✅ Synchronisation terminée : {total} trades traités ({newFiles} nouvelles, {updated} mises à jour) sur {accounts} compte(s)',
  'backend.notice.sync-complete-no-trades':
    '✅ Synchronisation terminée - aucun nouveau trade trouvé',
  'backend.notice.sync-failed': '❌ Échec de la synchronisation : {error}',
  'backend.accounts.title': 'Comptes de trading',
  'backend.accounts.linked': 'Comptes MT liés',
  'backend.accounts.linked-desc':
    'Comptes MetaTrader détectés à partir des rapports synchronisés',
  'backend.accounts.server-disconnected':
    "Le serveur est déconnecté. Veuillez vérifier l'état de la connexion.",
  'backend.accounts.loading': 'Chargement des comptes...',
  'backend.accounts.no-accounts': 'Aucun compte trouvé.',
  'backend.accounts.sync-to-detect':
    'Synchronisez certaines trades pour détecter les comptes.',
  'backend.accounts.connect-to-see':
    'Connectez-vous au serveur et synchronisez les trades pour voir les comptes.',
  'backend.accounts.account-id': 'Identifiant du compte',
  'backend.accounts.broker': 'Broker',
  'backend.accounts.first-seen': 'Vu pour la première fois',
  'backend.accounts.last-seen': 'Vu pour la dernière fois',
  'backend.accounts.refresh': 'Actualiser les comptes',
  'backend.accounts.unlink-title': 'Dissocier le compte MetaTrader',
  'backend.accounts.unlink': 'Dissocier',
  'backend.accounts.unlink-confirm':
    'Dissocier le compte MetaTrader {accountId} ? Il sera masqué dans Trade Sync et les futurs imports seront ignorés jusqu’à ce que vous le reliiez.',
  'backend.accounts.unlink-success': 'Compte MetaTrader dissocié',
  'backend.accounts.relink': 'Relier',
  'backend.accounts.relink-success': 'Compte MetaTrader relié',
  'backend.accounts.ignored.title': 'Comptes dissociés',
  'backend.accounts.ignored.count': '{count} masqué(s)',
  'backend.accounts.ignored.empty': 'Aucun compte dissocié.',
  'backend.accounts.ignored-at': 'Dissocié',
  'backend.progress.title': 'Progression de le setup',
  'backend.progress.connection.label': 'Connecter',
  'backend.progress.connection.desc': 'Lier le vault au serveur',
  'backend.progress.ftp.label': 'FTP',
  'backend.progress.ftp.desc': 'Créer des identifiants',
  'backend.progress.sync.label': 'Synchroniser',
  'backend.progress.sync.desc': 'Activer la synchronisation automatique',
  'backend.progress.accounts.label': 'Comptes',
  'backend.progress.accounts.desc': 'Lier les comptes MT',
  'backend.cards.connection.title': 'Connexion',
  'backend.cards.connection.refresh': 'Rafraîchir',
  'backend.cards.sync.title': 'Statut de synchronisation',
  'backend.cards.sync.last-sync': 'Dernière synchronisation',
  'backend.cards.sync.total': 'Synchronisations totales',
  'backend.cards.sync.button': 'Synchroniser maintenant',
  'backend.cards.accounts.title': 'Comptes',
  'backend.cards.accounts.linked': 'Comptes liés',
  'backend.cards.accounts.manage': 'Gérer',
  'backend.section.setup.title': 'Setup et setup',
  'backend.section.sync.title': 'Paramètres de synchronisation',
  'backend.section.accounts.title': 'Gestion des comptes',
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'Mapping Trade Import IA',
  'settings.auth.feature.metatrader-sync':
    'Synchronisation des trades MetaTrader',
  'settings.auth.feature.basic-tracking': 'Suivi de trading de base',
  'settings.auth.feature.manual-csv': 'Importation Trade Import manuelle',
  'settings.auth.feature.manual-entry': 'Saisie manuelle des trades',
  'settings.auth.feature.analytics-reviews': 'Analyses et revue',
  'settings.auth.feature.priority-support': 'Assistance prioritaire',
  'backend.sync.just-now': "Tout à l' heure",
  'backend.sync.minutes-ago': 'il y a {count} minutes',
  'backend.sync.hours-ago': 'Il y a {count} heures',
  'backend.sync.days-ago': 'Il y a {count} jours',
  'csv.title': "Importer des trades à partir d'un CSV",
  'csv.subtitle':
    'Téléchargez le fichier CSV de votre broker pour importer les trades dans votre journal.',
  'csv.how-to-export': 'Comment exporter depuis votre broker',
  'csv.processing-file': "Traitement du fichier d'importation...",
  'csv.importing-trades': 'Importer des trades dans le compte...',
  'csv.format': "Format d'importation :",
  'csv.asset-type': "Type d'actif",
  'csv.asset-type-desc':
    "Sélectionnez le type d'instrument dans ce CSV. Celui-ci détermine les spécifications du contrat et les règles de validation.",
  'csv.button.export-template': "Modèle d'exportation",
  'csv.button.delete-template': 'Supprimer le modèle',
  'csv.button.import-template': "Modèle d'importation",
  'csv.button.import-rows': 'Importer {count} lignes',
  'csv.button.edit-format': 'Modifier le format',
  'csv.button.continue-mapping': 'Continuer vers le mappage de colonnes',
  'csv.button.update-template': 'Modèle de mise à jour',
  'csv.button.save-template': 'Enregistrer comme modèle',
  'csv.button.back': 'Dos',
  'csv.button.import-another': 'Importer un autre fichier',
  'csv.button.view-account': 'Afficher dans le compte',
  'csv.results.complete': 'Importation terminée',
  'csv.results.failed': "Échec de l'importation",
  'csv.results.success.one':
    '{count} trade importé avec succès vers le compte : {account}',
  'csv.results.success.few':
    'Importation réussie de {count} trades vers le compte : {account}',
  'csv.results.success.many':
    'Importation réussie de {count} trades vers le compte : {account}',
  'csv.results.success.other':
    'Importation réussie de {count} trades vers le compte : {account}',
  'csv.results.updated.one': 'Mise à jour de {count} trades existants',
  'csv.results.updated.few': 'Mise à jour de {count} trades existants',
  'csv.results.updated.many': 'Mise à jour de {count} trades existants',
  'csv.results.updated.other': 'Mise à jour de {count} trades existants',
  'csv.results.skipped.one':
    '{count} trade en double ignoré (déjà dans le vault)',
  'csv.results.skipped.few':
    '{count} trades en double ignorées (déjà dans le vault)',
  'csv.results.skipped.many':
    '{count} trades en double ignorées (déjà dans le vault)',
  'csv.results.skipped.other':
    '{count} trades en double ignorées (déjà dans le vault)',
  'csv.results.skipped-incomplete':
    '{count} ligne(s) incomplète(s) ignorée(s) (valeurs requises manquantes)',
  'csv.results.custom-field-warnings':
    '{count} valeur(s) de champ personnalisé non valide(s) ignorée(s)',
  'csv.results.custom-field-warnings-header':
    'CLIQUEZ POUR VOIR LES AVERTISSEMENTS DE CHAMP PERSONNALISÉS ({count})',
  'csv.results.broker': 'Broker : {broker}',
  'csv.results.manual-import': 'Importation manuelle',
  'csv.results.preview-header':
    'Trades récemment importés (affichant {shown} sur {total})',
  'csv.results.more-trades.one': 'et {count} plus de trades...',
  'csv.results.more-trades.few': 'et {count} trades supplémentaires...',
  'csv.results.more-trades.many': 'et {count} trades supplémentaires...',
  'csv.results.more-trades.other': 'et {count} trades supplémentaires...',
  'csv.results.errors-header': 'CLIQUEZ POUR VOIR LES ERREURS ({count})',
  'csv.results.discord-note':
    "Facultatif : si vous avez besoin d'aide, cliquez sur Copier le rapport et collez-le dans Discord.",
  'csv.errors.copy-shareable': 'Copier le rapport partageable',
  'csv.errors.copy-report': 'Copier le rapport',
  'csv.errors.copy-detailed': 'Copier le rapport détaillé',
  'csv.errors.copied': 'Copié',
  'csv.errors.rows': 'Lignes : {rows}',
  'csv.errors.suggestion': 'Suggestion:',
  'csv.errors.example': 'Exemple:',
  'csv.errors.raw-errors': 'Erreurs brutes',
  'csv.errors.raw-errors-limit':
    'Affichage des {shown} premières erreurs sur {total}',
  'csv.errors.group.missing-value':
    'Valeur requise manquante – {field} (colonne "{column}")',
  'csv.errors.group.missing-column':
    'Colonne obligatoire manquante – {field} (colonne "{column}")',
  'csv.errors.group.invalid-date':
    'Impossible d\'analyser la date (colonne "{column}")',
  'csv.errors.group.invalid-number':
    'Numéro invalide — {field} (colonne "{column}")',
  'csv.errors.group.invalid-direction': 'Sens invalide (colonne "{column}")',
  'csv.errors.group.template-missing-mappings':
    'Le modèle ne contient pas les mappages de colonnes requis',
  'csv.errors.group.batch-parsing-failed': "L'analyse par lots a échoué",
  'csv.errors.group.no-valid-rows': "Aucune ligne valide n'a été importée",
  'csv.errors.group.no-trades-parsed': "Aucun trade n'a pu être analysée",
  'csv.errors.group.close-only': 'Les exécutions rapprochées ont été ignorées',
  'csv.errors.group.other': 'Autres erreurs',
  'csv.errors.suggestion.select-date-format':
    'Sélectionnez un format de date à l’étape de mappage, puis réimportez.',
  'csv.errors.suggestion.fix-numbers':
    'Vérifiez que les valeurs des colonnes sont numériques (pas de texte) et que la colonne correcte est mappée.',
  'csv.errors.suggestion.fix-direction':
    'Assurez-vous que les valeurs de la colonne Sens sont Achat/Vente (ou mappez la colonne correcte).',
  'csv.errors.suggestion.check-mapping':
    'Vérifiez vos mappages de colonnes et assurez-vous que les champs obligatoires sont mappés.',
  'csv.errors.suggestion.check-broker':
    'Vérifiez que vous avez sélectionné le bon broker/modèle pour ce CSV.',
  'csv.errors.suggestion.check-raw-errors':
    'Ouvrez les erreurs brutes pour les messages exacts et les numéros de ligne.',
  'csv.report.title.shareable':
    'Importation CSV Journalit — Rapport partageable',
  'csv.report.title.detailed': 'Importation CSV Journalit — Rapport détaillé',
  'csv.report.time': 'Heure : {time}',
  'csv.report.plugin-version': 'Version du plugin : {version}',
  'csv.report.file': 'Fichier : {file}',
  'csv.report.account': 'Compte : {account}',
  'csv.report.broker': 'Broker : {broker}',
  'csv.report.template': 'Modèle : {name}',
  'csv.report.csv-rows': 'Lignes CSV : {count}',
  'csv.report.asset-type': "Type d'actif : {type}",
  'csv.report.date-format': 'Format des dates : {format}',
  'csv.report.header-row': "Ligne d'en-tête : {row}",
  'csv.report.result': 'Résultat : {result}',
  'csv.report.imported': 'Importé : {count}',
  'csv.report.updated': 'Mise à jour : {count}',
  'csv.report.duplicates': 'Doublons : {count}',
  'csv.report.skipped-incomplete': 'Lignes incomplètes ignorées : {count}',
  'csv.report.errors': 'Erreurs : {count}',
  'csv.report.custom-field-warnings':
    'Avertissements de champ personnalisé : {count}',
  'csv.report.sanitized-note':
    "Remarque : Il s'agit d'un rapport partageable. Il peut omettre des détails sensibles.",
  'csv.report.top-issues': 'Problèmes majeurs :',
  'csv.report.issue-groups': 'Groupes thématiques :',
  'csv.report.raw-custom-field-warnings':
    'Avertissements de champs personnalisés :',
  'csv.report.raw-errors': 'Erreurs brutes :',
  'csv.report.more-errors': '...et {count} autres erreurs',
  'csv.unmapped-symbols.title': 'Symboles non mappés détectés',
  'csv.unmapped-symbols.desc-singular':
    "Un symbole sans spécifications d'instrument a été trouvé dans votre importation :",
  'csv.unmapped-symbols.desc-plural':
    "Des symboles {count} sans spécifications d'instrument ont été trouvés dans votre importation :",
  'csv.unmapped-symbols.map-label': 'Mapper avec le symbole/ticker de base :',
  'csv.unmapped-symbols.placeholder': 'par exemple, ES, NQ, GC',
  'csv.unmapped-symbols.warning':
    "Mappez ces symboles aux spécifications intégrées ou à vos tickers personnalisés. Sans spécifications, les trades n'auront pas de tailles de ticks, de dollars par point ou de calculs de P&L précis.",
  'csv.unmapped-symbols.validation.not-found':
    'Symbole "{symbol}" introuvable dans les spécifications {assetType} ou les tickers personnalisés',
  'csv.unmapped-symbols.notice.fix-errors':
    "Veuillez corriger les erreurs de validation avant d'enregistrer",
  'csv.unmapped-symbols.notice.save-failed':
    "Échec de l'enregistrement des mappages",
  'csv.unmapped-symbols.button.saving': 'Économie...',
  'csv.unmapped-symbols.button.save': 'Enregistrer les mappages',
  'csv.unmapped-symbols.button.skip': 'Sauter',
  'csv.broker-guide.tradovate.step-1':
    'Accédez à l\'onglet "Rapports" sur le site Web Tradovate',
  'csv.broker-guide.tradovate.step-2':
    'Cliquez sur l\'onglet "Commandes" (PAS l\'onglet Performance)',
  'csv.broker-guide.tradovate.step-3':
    'Cliquez sur le bouton "Télécharger CSV"',
  'csv.broker-guide.tradovate.warning.emphasis': 'Important :',
  'csv.broker-guide.tradovate.warning.message':
    "Utilisez uniquement l'onglet Commandes. L'onglet Performances n'est pas compatible.",
  'csv.broker-guide.tradovate.doc-label': 'Voir le guide détaillé',
  'csv.broker-guide.ibkr.description': 'Setup unique de Flex Query requise',
  'csv.broker-guide.ibkr.step-1':
    'Accédez à Performances et déclarations → Rapports → Requêtes flexibles',
  'csv.broker-guide.ibkr.step-2':
    'Créez une nouvelle requête « Confirmation de trade » (sélectionnez Ordres, désélectionnez Exécutions)',
  'csv.broker-guide.ibkr.step-3':
    'Format défini : CSV, Date "aaaaMMjj", Heure "HHmmss"',
  'csv.broker-guide.ibkr.step-4':
    'Exécutez la requête et téléchargez le fichier CSV',
  'csv.broker-guide.ibkr.warning.emphasis': 'Doit utiliser les commandes',
  'csv.broker-guide.ibkr.warning.message':
    "(pas d'exécutions) avec un format date/heure spécifique",
  'csv.broker-guide.ibkr.doc-label': 'Afficher le guide de setup détaillé',
  'csv.broker-guide.tradezero.step-1':
    'Exporter le fichier CSV depuis la plateforme TradeZero',
  'csv.broker-guide.tradezero.step-2':
    'Vérifiez que le fichier est au format CSV (PAS XLSX)',
  'csv.broker-guide.tradezero.step-3': 'Importez le fichier ci-dessous',
  'csv.broker-guide.tradezero.warning.emphasis':
    'Seul le format CSV est pris en charge.',
  'csv.broker-guide.tradezero.warning.message':
    'Les fichiers Excel (XLSX) ne fonctionneront pas.',
  'csv.broker-guide.tradezero.doc-label':
    "Afficher les instructions d'exportation",
  'csv.broker-guide.tradingview.description':
    'Compte de trading papier uniquement',
  'csv.broker-guide.tradingview.step-1':
    'Cliquez sur le type de broker "Paper Trading" dans TradingView',
  'csv.broker-guide.tradingview.step-2':
    'Cliquez sur le bouton "Exporter les données..."',
  'csv.broker-guide.tradingview.step-3':
    'Sélectionnez « Historique des commandes » dans la liste déroulante',
  'csv.broker-guide.tradingview.warning.emphasis':
    'Doit utiliser l’historique des commandes.',
  'csv.broker-guide.tradingview.warning.message':
    "Les autres types d'exportation (tels que les positions ou les commandes) ne fonctionneront pas pour l'importation.",
  'csv.broker-guide.tradingview.doc-label': 'Voir le guide détaillé',
  'csv.broker-guide.bybit.description':
    'Historique du trade des perpétuelles USDT',
  'csv.broker-guide.bybit.step-1':
    'Accédez à Bybit → Ordres → USDT Perpetual → Historique des trades',
  'csv.broker-guide.bybit.step-2':
    'Cliquez sur le bouton "Exporter" et sélectionnez la plage de dates',
  'csv.broker-guide.bybit.step-3':
    "Téléchargez le fichier CSV de l'historique des trades (PAS le P&L fermé)",
  'csv.broker-guide.bybit.warning.emphasis':
    'Utilisez l’exportation de l’historique de trading.',
  'csv.broker-guide.bybit.warning.message':
    "L'exportation P&L clôturée ne contient pas de données de commission ni d'exécutions individuelles.",
  'csv.broker-guide.bybit.doc-label': "Afficher les instructions d'exportation",
  'csv.broker-guide.blofin.description':
    'Exportation de l’historique des commandes Blofin (site Web uniquement)',
  'csv.broker-guide.blofin.step-1':
    'Accédez à Actifs → Centre de commandes → Historique des commandes',
  'csv.broker-guide.blofin.step-2':
    'Cliquez sur Télécharger, sélectionnez Futures et choisissez une plage de dates (max 180 jours)',
  'csv.broker-guide.blofin.step-3':
    'Cliquez sur Exporter et attendez la notification lorsque vous êtes prêt',
  'csv.broker-guide.blofin.warning.emphasis': 'Site Web uniquement.',
  'csv.broker-guide.blofin.warning.message':
    "L'application mobile ne prend pas en charge les exportations. Les fichiers sont disponibles pendant 30 jours après l'exportation.",
  'csv.broker-guide.blofin.doc-label':
    "Afficher les instructions d'exportation",
  'csv.broker-guide.hyperliquid.description': 'Historique du trade perpétuel',
  'csv.broker-guide.hyperliquid.step-1': 'Connecter le wallet sur Hyperliquid',
  'csv.broker-guide.hyperliquid.step-2':
    'Cliquez sur l\'onglet "Historique des trades" en bas de la page',
  'csv.broker-guide.hyperliquid.step-3':
    'Cliquez sur le bouton "Exporter au format CSV"',
  'csv.broker-guide.hyperliquid.warning.emphasis': 'Limite de 10 000 entrées.',
  'csv.broker-guide.hyperliquid.warning.message':
    'Exportez régulièrement - les trades plus anciennes au-delà de 10 000 entrées ne peuvent pas être récupérées.',
  'csv.broker-guide.hyperliquid.doc-label':
    "Afficher les instructions d'exportation",
  'csv.broker-guide.sierrachart.description':
    'Exportation de la liste des trades à terme',
  'csv.broker-guide.sierrachart.step-1':
    'Ouvrir le journal des activités de trading (Trade → Journal des activités de trading ou Ctrl+Shift+A)',
  'csv.broker-guide.sierrachart.step-2':
    'Cliquez sur l\'onglet "Trades" en haut de la fenêtre',
  'csv.broker-guide.sierrachart.step-3':
    'Définissez la plage de dates via le bouton [DisplaySettings] si nécessaire',
  'csv.broker-guide.sierrachart.step-4':
    'Allez dans Fichier → Enregistrer le journal sous et enregistrez en tant que fichier .txt',
  'csv.broker-guide.sierrachart.warning.emphasis':
    'Utilisez « Enregistrer le journal sous » et non « Exporter ».',
  'csv.broker-guide.sierrachart.warning.message':
    "L'option Exporter enregistre les prix non ajustés. Enregistrer le journal sous conserve les prix tels qu’affichés.",
  'csv.broker-guide.sierrachart.doc-label':
    'Afficher la documentation SierraChart',
  'csv.broker-guide.motivewave.description':
    'Exportez les exécutions depuis le panneau Compte dans MotiveWave.',
  'csv.broker-guide.motivewave.step-1':
    "Ouvrez le panneau Compte et sélectionnez l'onglet Exécutions",
  'csv.broker-guide.motivewave.step-2':
    "Cliquez sur l'icône Exporter vers CSV au-dessus de la liste des exécutions",
  'csv.broker-guide.motivewave.step-3':
    'Définissez la plage de dates « Exporter les exécutions depuis » si nécessaire',
  'csv.broker-guide.motivewave.step-4':
    'Enregistrez le fichier CSV et importez-le ici',
  'csv.broker-guide.motivewave.warning.emphasis': 'Remarque :',
  'csv.broker-guide.motivewave.warning.message':
    'Certains brokers ne fournissent qu’un historique d’exécution limité. Exportez régulièrement ou utilisez votre portail de broker pour les trades plus anciennes.',
  'csv.broker-guide.motivewave.doc-label':
    'Afficher la documentation MotiveWave',
  'csv.broker-guide.fxreplay.step-1':
    'Ouvrez FX Replay → Analytics et sélectionnez la session ou la plage de dates',
  'csv.broker-guide.fxreplay.step-2':
    'Cliquez sur "Exporter" et choisissez CSV',
  'csv.broker-guide.fxreplay.step-3':
    "Téléchargez le CSV d'analyse et téléchargez-le ici",
  'csv.broker-guide.fxreplay.warning.emphasis': 'Fonctionnalité Pro :',
  'csv.broker-guide.fxreplay.warning.message':
    'Les exportations CSV sont disponibles à partir de la page Analytics et nécessitent un forfait payant.',
  'csv.broker-guide.fxreplay.doc-label':
    'Guide d’exportation d’Ouvrir FX Replay',
  'csv.broker-guide.atas.description':
    'Exporter les statistiques → Onglet Journal (trades appariés)',
  'csv.broker-guide.atas.step-1':
    "Dans ATAS, ouvrez l'onglet Statistiques et sélectionnez Temps réel ou Historique (définissez la plage de dates si nécessaire)",
  'csv.broker-guide.atas.step-2':
    "Cliquez sur l'icône d'engrenage (en haut à droite) et choisissez « Exporter les statistiques »",
  'csv.broker-guide.atas.step-3':
    'Téléchargez le fichier XLSX exporté ici et sélectionnez ATAS dans la liste des brokers',
  'csv.broker-guide.atas.warning.emphasis': 'Important :',
  'csv.broker-guide.atas.warning.message':
    "Ne modifiez pas le fichier exporté. Journalit préserve les trades de la feuille « Journal » et, lorsqu'elle est disponible, enrichit les commissions en utilisant les remplissages correspondants de la feuille « Exécutions ».",
  'csv.broker-guide.atas.doc-label':
    "Afficher les instructions d'exportation ATAS",
  'csv.broker-guide.rithmic.description':
    'R |Exportation Trader Pro à partir de l’historique des commandes / commandes terminées.',
  'csv.broker-guide.rithmic.step-1':
    'Ouvrir l’historique des commandes dans R |Trader Pro et filtrez les commandes terminées/remplies pour votre compte/date',
  'csv.broker-guide.rithmic.step-2':
    "Utilisez Ajouter/Supprimer des colonnes et assurez-vous que le côté, le symbole, la quantité remplie, le prix de remplissage moyen et l'heure de remplissage/mise à jour sont visibles.",
  'csv.broker-guide.rithmic.step-3':
    "Cliquez sur l'icône Exporter/Presse-papiers pour enregistrer le CSV, puis téléchargez-le ici et sélectionnez Rithmic",
  'csv.broker-guide.rithmic.warning.emphasis': 'Important :',
  'csv.broker-guide.rithmic.warning.message':
    "Rithmic exporte uniquement les colonnes visibles (et souvent un jour à la fois). Les colonnes manquantes peuvent interrompre l'importation.",
  'csv.broker-guide.rithmic.doc-label':
    "Afficher R |Procédure pas à pas pour l'exportation de Trader Pro",
  'csv.broker-guide.jdr.description':
    'Exportation de relevés HTML MetaTrader (rapport de style MT4).',
  'csv.broker-guide.jdr.step-1':
    "Dans votre terminal JDR MetaTrader, ouvrez l'onglet Historique du compte / Historique pour la plage de dates que vous souhaitez importer.",
  'csv.broker-guide.jdr.step-2':
    "Cliquez avec le bouton droit dans la table d'historique et choisissez Enregistrer en tant que rapport (instruction HTML/HTM)",
  'csv.broker-guide.jdr.step-3':
    'Téléchargez la déclaration HTML exportée ici et sélectionnez JDR Securities Limited',
  'csv.broker-guide.jdr.warning.emphasis': 'Important :',
  'csv.broker-guide.jdr.warning.message':
    "Utilisez l'exportation d'instructions HTML. Les commandes en attente/annulées sont automatiquement ignorées et les rapports HTML MT5 ne sont pas encore pris en charge.",
  'csv.broker-guide.jdr.doc-label': "Voir les guides d'exportation des brokers",
  'csv.date-format.auto-detect':
    'Détection automatique (recommandé pour les formats ISO/standard)',
  'csv.date-format.us-date':
    'Date aux États-Unis : 25/12/2024 (Schwab, Fidelity, E*TRADE)',
  'csv.date-format.us-datetime':
    'DateHeure aux États-Unis : 25/12/2024 14:30:00 (Webull)',
  'csv.date-format.us-short':
    'Vente à découvert aux États-Unis : 05/01/2024 (TradeZero)',
  'csv.date-format.us-short-datetime':
    'Date et heure courtes aux États-Unis : 05/01/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'DateHeure ISO : 2024-12-25 14:30:00 (Bybit, Tradovate)',
  'csv.date-format.iso-date': 'Date ISO : 2024-12-25 (Interactive Brokers)',
  'csv.date-format.eu-date': 'Date UE : 25/12/2024 (jour/mois/année)',
  'csv.date-format.eu-datetime': 'DateHeure UE : 25/12/2024 14:30:00',
  'csv.date-format.eu-dash': 'Tableau de bord UE : 25-12-2024',
  'csv.date-format.eu-dash-datetime': 'EU Dash DateHeure : 25-12-2024 14:30:00',
  'upgrade.title': 'Passer à Pro',
  'upgrade.feature-message':
    '{featureName} est une fonctionnalité Pro. Mettez à niveau pour débloquer l’automatisation et les fonctionnalités avancées.',
  'upgrade.benefits-title': 'Les fonctionnalités professionnelles incluent :',
  'upgrade.benefit.csv': 'Trade Import avec mappage de colonnes assisté par IA',
  'upgrade.benefit.templates':
    'Modèles personnalisés illimités et partage de modèles',
  'upgrade.benefit.mt5': 'Synchronisation automatique MetaTrader 5',
  'upgrade.benefit.multi-account': 'Prise en charge multi-comptes',
  'upgrade.benefit.analytics': 'Analyses et mesures avancées',
  'upgrade.benefit.layouts': 'Dispositions de tableaux de bord personnalisées',
  'upgrade.trial-notice':
    "Bénéficiez d'un essai gratuit de 2 semaines pour importer toutes vos trades historiques et essayez toutes les fonctionnalités Pro sans risque.",
  'monthly.overview.cumulative-pnl': 'P&L cumulé mensuel',
  'monthly.overview.no-pnl-data': 'Aucune donnée de P&L à afficher',
  'monthly.overview.no-pnl-data-sub':
    'Votre profit/perte cumulé s’affichera ici une fois des trades clôturés enregistrés',
  'monthly.overview.drawdown': 'Drawdown mensuel',
  'monthly.overview.no-drawdown-data': 'Aucune donnée de drawdown à afficher',
  'monthly.overview.no-drawdown-data-sub':
    'Vos mesures de drawdown apparaîtront ici une fois que vous aurez enregistré les trades clôturés',
  'monthly.overview.performance': 'Performance mensuelle',
  'monthly.overview.net-pnl': 'P&L net',
  'monthly.overview.win-rate': 'Taux de réussite',
  'monthly.overview.profit-factor': 'Ratio gains/pertes',
  'monthly.overview.total-trades': 'Total des trades',
  'monthly.overview.setup-performance': 'Performances de setup',
  'monthly.overview.biggest-winner': 'Le plus grand gagnant de {month}',
  'monthly.overview.biggest-loser': 'Le plus grand perdant de {month}',
  'monthly.overview.label-date': 'Date:',
  'monthly.overview.label-setup': 'Setup:',
  'monthly.overview.view-trade-details': 'Afficher les détails du trade',
  'monthly.overview.no-winning-trades': 'Aucun trade gagnant ce mois-ci',
  'monthly.overview.no-winning-trades-sub':
    'Vos meilleurs trades apparaîtront ici',
  'monthly.overview.no-losing-trades': 'Pas de trades perdants ce mois-ci',
  'monthly.overview.no-losing-trades-sub': 'Vos pires trades apparaîtront ici',
  'monthly.overview.weekly-highlights':
    'Faits saillants des performances hebdomadaires',
  'monthly.overview.best-week': 'Semaine la plus performante',
  'monthly.overview.worst-week': 'Semaine la moins performante',
  'monthly.overview.week-number': 'Semaine {number}',
  'monthly.overview.view-week': 'Afficher la semaine',
  'monthly.overview.long-performance': 'Performances longues uniquement',
  'monthly.overview.no-long-trades': 'Aucun trade long ce mois-ci',
  'monthly.overview.no-long-trades-sub':
    'Votre performance de trading longue apparaîtra ici',
  'monthly.overview.short-performance': 'Performances courtes uniquement',
  'monthly.overview.no-short-trades': 'Aucun trade short ce mois-ci',
  'monthly.overview.no-short-trades-sub':
    'Votre performance de trading short apparaîtra ici',
  'monthly.overview.weekly-breakdown': 'Répartition hebdomadaire',
  'monthly.overview.table-week': 'Semaine',
  'monthly.overview.table-trades': 'Trades',
  'monthly.overview.table-win-rate': 'Gagner%',
  'monthly.overview.table-profit-factor': 'Ratio gains/pertes',
  'monthly.overview.table-pnl': 'P&L',
  'monthly.overview.week-abbrev': 'W{number}',
  'monthly.overview.no-weekly-data': 'Aucune donnée hebdomadaire disponible',
  'monthly.overview.no-weekly-data-sub':
    'Votre répartition hebdomadaire des performances apparaîtra ici',
  'settings.account-linking.title': "Modifier l'association de compte",
  'settings.account-linking.description':
    "Déplacez tous les trades d'un compte MT vers un autre compte Obsidian",
  'settings.account-linking.source.title': 'Compte MT source',
  'settings.account-linking.source.description':
    'Sélectionnez le compte MT dont vous souhaitez déplacer les trades',
  'settings.account-linking.source.placeholder':
    'Sélectionnez le compte source...',
  'settings.account-linking.target.title': 'Compte Obsidienne cible',
  'settings.account-linking.target.description':
    'Sélectionnez le compte Obsidian auquel lier les trades',
  'settings.account-linking.target.placeholder':
    'Sélectionnez le compte cible...',
  'settings.account-linking.button.processing': 'Traitement...',
  'settings.account-linking.button.relink': 'Relier le compte',
  'settings.account-linking.warning':
    'Cela mettra à jour tous les trades synchronisés du compte source pour les lier au compte cible. Cette opération ne peut pas être annulée.',
  'settings.account-linking.success.relinked':
    'Réassociation réussie de {count} trades de {source} à {target}',
  'settings.account-linking.error.select-both':
    'Veuillez sélectionner les comptes source et cible',
  'settings.account-linking.error.source-not-found':
    'Compte source introuvable',
  'settings.account-linking.error.target-not-found': 'Compte cible introuvable',
  'settings.account-linking.error.already-linked':
    'Ce compte MY est déjà lié au compte Obsidian sélectionné',
  'settings.account-linking.error.service-manager':
    'Gestionnaire de service non disponible',
  'settings.account-linking.error.backend-service':
    'Service backend non disponible',
  'settings.account-linking.error.relink-failed':
    'Échec de la réassociation du compte : {error}',
  'account.type.demo': 'Démo',
  'account.type.evaluation': 'Évaluation',
  'account.type.funded': 'Financé',
  'account.type.archived': 'Archivé',
  'account-page.error.title': 'Erreur lors du chargement du compte',
  'account-page.error.not-found':
    'Impossible de trouver les données du compte "{accountName}".',
  'account-page.error.not-found-sub':
    "Veuillez vérifier si le compte existe ou essayez d'actualiser la page.",
  'account-page.guide.empty.intro.title': 'Cette page est un compte en détail',
  'account-page.guide.empty.intro.description':
    'Utilisez la page Compte pour gérer un compte, enregistrer les événements du compte et consulter les trades qui y sont liées.',
  'account-page.guide.empty.edit-account.title':
    'Modifier le compte ouvre les paramètres complets du compte',
  'account-page.guide.empty.edit-account.description':
    "Utilisez ce bouton pour modifier le nom du compte, le type, la devise, les règles de drawdown, l'objectif de profit, le coût mensuel, etc.",
  'account-page.guide.empty.add-event.title':
    'Ajouter des dépôts et des retraits d’enregistrements d’événements',
  'account-page.guide.empty.add-event.description':
    "Utilisez ce bouton chaque fois que de l'argent entre ou sort du compte en dehors des trades normaux.",
  'account-page.guide.empty.transactions.title':
    'Dépôts and withdrawals are tracked here',
  'account-page.guide.empty.transactions.description':
    'Cette section conserve l’historique des dépôts et retraits manuels. Lorsqu’elle est vide, utilisez Ajouter un événement pour créer le premier.',
  'account-page.guide.empty.trade-log.title':
    'Les trades liés apparaîtront ici',
  'account-page.guide.empty.trade-log.description':
    "Les trades apparaissent ici lorsqu'elles sont affectées à ce compte. Une fois que vous avez lié les trades, cette page devient la répartition complète de votre compte.",
  'account-page.guide.main.intro.title':
    'Cette page est la répartition de votre compte',
  'account-page.guide.main.intro.description':
    'Utilisez la page Compte pour comprendre clairement un compte : historique du solde, performances, limites de risque, mouvements de trésorerie et trades liés.',
  'account-page.guide.main.balance-chart.title':
    'Le tableau du solde montre bien plus que le simple solde',
  'account-page.guide.main.balance-chart.description':
    "Ce graphique montre le compte au fil du temps, y compris les dépôts et les retraits, ainsi que les niveaux de drawdown et d'objectif de profit que vous avez définis pour le compte.",
  'account-page.guide.main.metrics.title':
    'Ces statistiques résument uniquement ce compte',
  'account-page.guide.main.metrics.description':
    'Ces chiffres sont calculés à partir des trades liés à ce compte, vous pouvez donc juger ce compte par vous-même.',
  'account-page.guide.main.risk.title':
    'La progression des risques est suivie séparément ici',
  'account-page.guide.main.risk.description':
    'Cette section montre à quel point le compte est proche de sa limite de drawdown ou de son objectif de profit. Vous définissez ces règles dans Modifier le compte, que nous montrerons ensuite.',
  'account-page.guide.main.transactions.title':
    'Dépôts and withdrawals stay in their own section',
  'account-page.guide.main.transactions.description':
    'Chaque entrée peut être revue plus tard, afin de séparer les mouvements de trésorerie de la performance de trading.',
  'account-page.guide.main.trade-log.title':
    'Les trades liés ouvrent la note de trading réelle',
  'account-page.guide.main.trade-log.description':
    'Cliquez sur n’importe quel trade lié pour ouvrir le trade lui-même. Cela fait de la page du compte le pont entre la revue au niveau du compte et les trades individuels.',
  'account-page.guide.main.add-event.title':
    'Ajouter des dépôts et des retraits d’enregistrements d’événements',
  'account-page.guide.main.add-event.description':
    "Utilisez-le chaque fois que de l'argent est ajouté ou supprimé en dehors des résultats de trading normaux, afin que l'historique du compte reste précis.",
  'account-page.guide.main.edit-account.title':
    'Modifier le compte modifie les paramètres du compte',
  'account-page.guide.main.edit-account.description':
    "C'est ici que vous mettez à jour les détails du compte, les règles de risque, les drawdowns et l'objectif de profit s'ils changent au fil du temps.",
  'account-dashboard.title': 'Tableau de bord du compte',
  'account-dashboard.copy-badge.base': 'SOURCE',
  'account-dashboard.copy-badge.copy': 'COPIEUR',
  'account-dashboard.copy-badge.copied-by': 'Copié par',
  'account-dashboard.copy-badge.copies-tooltip':
    'Copie {account} à {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService non initialisé après plusieurs tentatives',
  'account-dashboard.error.loading':
    'Erreur lors du chargement des comptes : {error}',
  'account-dashboard.error.retry':
    "AccountPageService n'est pas prêt, nouvelle tentative dans {delay}ms (tentative {attempt}/{max})",
  'account-dashboard.empty.title': 'Aucun compte trouvé',
  'account-dashboard.empty.message':
    'Créez un compte pour commencer à suivre vos performances de trading',
  'account-dashboard.section.empty': 'Aucun compte {type}',
  'account-dashboard.section.empty-sub': 'Créez un compte pour le voir ici',
  'account-dashboard.button.create-first': 'Créez votre premier compte',
  'account-dashboard.action.create': 'Créer un nouveau compte',
  'account-dashboard.action.settings':
    'Paramètres du tableau de bord du compte',
  'account-dashboard.weight-bar.aria':
    'Répartition des actifs sous gestion par type de compte',
  'account-dashboard.weight-bar.segment-aria':
    "{name} : {percent} % de l'actif total sous gestion",
  'account-dashboard.guide.empty.intro.title':
    'Cette page conserve tous vos comptes au même endroit',
  'account-dashboard.guide.empty.intro.description':
    'Utilisez le tableau de bord du compte pour voir tous vos comptes ensemble. Une fois les comptes existants, cette page devient le moyen le plus rapide de les comparer.',
  'account-dashboard.guide.empty.state.title':
    "Il n'y a rien ici pour l'instant car aucun compte n'existe",
  'account-dashboard.guide.empty.state.description':
    "Le tableau de bord reste vide jusqu'à ce que vous créiez votre premier compte. Après cela, il affichera les totaux du compte, les sections et les raccourcis dans chaque page de compte.",
  'account-dashboard.guide.empty.create.title':
    'Créez votre premier compte ici',
  'account-dashboard.guide.empty.create.description':
    'Cliquez sur ce bouton pour créer le premier compte que vous souhaitez que Journalit suive.',
  'account-dashboard.guide.empty.after-create.title':
    'Après avoir enregistré, Journalit ouvre la page du compte',
  'account-dashboard.guide.empty.after-create.description':
    'Remplissez les détails de base du compte et enregistrez. Le guide suivant reprendra la page du compte pour ce compte spécifique.',
  'account-dashboard.guide.main.intro.title':
    'Ceci est le tableau de bord de votre compte',
  'account-dashboard.guide.main.intro.description':
    'Utilisez cette page pour comparer les comptes, surveiller les totaux de tous les comptes et accéder à un seul compte lorsque vous avez besoin de plus de détails.',
  'account-dashboard.guide.main.trade-filter.title':
    'Ce filtre change tout le tableau de bord',
  'account-dashboard.guide.main.trade-filter.description':
    'Utilisez ce filtre pour basculer le tableau de bord entre les trades régulières, les backtests ou les deux.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM désigne les actifs sous gestion',
  'account-dashboard.guide.main.aum-chart.description':
    'Ce graphique suit la valeur combinée de votre compte au fil du temps, y compris les dépôts, les retraits, les objectifs de profit et les niveaux de drawdown sur vos comptes.',
  'account-dashboard.guide.main.metrics.title':
    'Ces métriques résument tous les comptes visibles',
  'account-dashboard.guide.main.metrics.description':
    "Utilisez ces statistiques pour obtenir un instantané rapide au niveau du compte avant d'explorer des types de comptes spécifiques ou des comptes spécifiques.",
  'account-dashboard.guide.main.sections.title':
    'Les comptes sont regroupés par type de compte',
  'account-dashboard.guide.main.sections.description':
    'Ces sections vous aident à comparer des comptes similaires entre eux. Chaque carte est cliquable et ouvre la page complète de ce compte.',
  'account-dashboard.guide.main.create-account.title':
    "Vous pouvez créer un autre compte à partir d'ici à tout moment",
  'account-dashboard.guide.main.create-account.description':
    'Utilisez ce bouton chaque fois que vous souhaitez ajouter un nouveau compte au tableau de bord.',
  'account-dashboard.guide.main.settings.title':
    'Les paramètres contrôlent la façon dont ce tableau de bord est organisé',
  'account-dashboard.guide.main.settings.description':
    "Ouvrez les paramètres du tableau de bord pour gérer les types de comptes, ce qui compte dans les totaux et l'ordre des sections.",
  'account-dashboard.guide.main.settings-types.title':
    'Les paramètres peuvent gérer les types de comptes disponibles',
  'account-dashboard.guide.main.settings-types.description':
    'Dans les paramètres, vous pouvez ajouter des types de comptes personnalisés et supprimer les anciens si votre flux de travail change.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Les paramètres peuvent modifier ce qui compte dans les totaux',
  'account-dashboard.guide.main.settings-inclusion.description':
    'Vous pouvez masquer les types de comptes des totaux du tableau de bord sans les supprimer, et vous pouvez décider séparément si leurs retraits comptent toujours.',
  'account-dashboard.guide.main.settings-order.title':
    "Cette section contrôle l'ordre des groupes de comptes",
  'account-dashboard.guide.main.settings-order.description':
    'Utilisez ces contrôles pour décider quels types de comptes apparaissent en premier sur le tableau de bord.',
  'account-dashboard.guide.main.close-settings.title':
    'Fermez les paramètres pour revenir au tableau de bord',
  'account-dashboard.guide.main.close-settings.description':
    'Fermez ce modal lorsque vous avez fini de vérifier les paramètres du tableau de bord.',
  'account-dashboard.guide.main.open-account.title':
    "Ouvrez n'importe quelle carte de compte pour aller plus loin",
  'account-dashboard.guide.main.open-account.description':
    "Lorsque vous souhaitez connaître le détail complet d'un compte, ouvrez sa carte. Le guide de la page de compte prendra le relais.",
  'account-dashboard.metrics.total-accounts': 'Total des comptes',
  'account-dashboard.metrics.total-aum': 'Actifs sous gestion totaux',
  'account-dashboard.metrics.total-growth': 'Croissance totale',
  'account-dashboard.metrics.growth-percent': 'Croissance %',
  'account-dashboard.metrics.total-withdrawals': 'Retraits totaux',
  'account-dashboard.metrics.no-withdrawals': 'Aucun retrait',
  'account-dashboard.metrics.total-trades': 'Total des trades',
  'account-dashboard.type-header.excluded': 'Exclue',
  'account-dashboard.type-header.from-stats': 'À partir des statistiques',
  'account-dashboard.type-header.of-total-aum':
    'du total des actifs sous gestion',
  'account-dashboard.type-header.aum': 'Actifs sous gestion',
  'account-dashboard.type-header.withdrawals': 'Retraits',
  'account-dashboard.type-header.account': 'Compte',
  'account-dashboard.type-header.accounts': 'Comptes',
  'account-dashboard.type-header.trade': 'Trade',
  'account-dashboard.type-header.trades': 'Trades',
  'account-dashboard.type-header.growth': 'Croissance ({percent})',
  'account-card.status.breached': 'VIOLÉ',
  'account-card.status.in-progress': 'EN COURS',
  'account-card.status.achieved': 'OBTENUE',
  'account-card.metric.trades': 'Trades',
  'account-card.metric.withdrawals': 'Retraits',
  'account-card.metric.age': 'Âge',
  'account-card.progress.profit-target': 'Objectif de profit',
  'account-card.progress.drawdown-used': 'Limite de drawdown utilisée',
  'account-card.progress.not-set': 'Non défini',
  'account-card.footer.monthly': 'Mensuelle:',
  'account-card.footer.total-costs': 'Coûts totaux :',
  'account.chart.event.added': 'Compte ajouté',
  'account.chart.event.archived': 'Compte archivé',
  'account.balance-chart.empty': 'Aucun trade trouvé',
  'account.balance-chart.empty-sub':
    'Aucune activité de trading disponible pour ce compte',
  'account.aum-chart.empty': 'Aucune donnée de compte',
  'account.aum-chart.empty-sub':
    "Ajouter des comptes pour afficher l'historique des AUM",
  'chart.shared.empty': 'Aucun trade disponible',
  'chart.shared.empty-sub': 'Essayez de sélectionner une période différente',
  'account.link-modal.title': 'Nouveau compte de trading détecté',
  'account.link-modal.account-id': 'Identifiant du compte :',
  'account.link-modal.broker': 'Broker :',
  'account.link-modal.first-seen': 'Vu pour la première fois :',
  'account.link-modal.question': 'Comment souhaiteriez-vous gérer ce compte ?',
  'account.link-modal.option.new':
    'Créer un nouveau compte avec un nom personnalisé',
  'account.link-modal.placeholder.custom-name': 'par exemple, Défi FTMO',
  'account.link-modal.account-type': 'Type de compte :',
  'account.link-modal.option.existing': 'Lien vers un compte existant',
  'account.link-modal.no-accounts-available': '(aucun compte disponible)',
  'account.link-modal.select-account': 'Sélectionnez un compte...',
  'account.link-modal.no-existing-found':
    'Aucun compte existant trouvé. Créez plutôt un nouveau compte.',
  'account.link-modal.option.default':
    'Utiliser le nom par défaut : Compte-{id}',
  'account.link-modal.default-name': 'Compte-{id}',
  'account.link-modal.button.linking': 'Enchaînement...',
  'account.link-modal.notice.select-existing':
    'Veuillez sélectionner un compte existant',
  'account.link-modal.notice.failed':
    "Échec de l'association du compte : {error}",
  'trade.review.title': 'Revue de trading',
  'trade.details.direction': 'Sens',
  'trade.details.position-size': 'Taille de position',
  'trade.details.trading-costs': 'Frais de trading',
  'trade.details.entry-price': "Prix ​​d'entrée",
  'trade.details.exit-price': 'Prix ​​de sortie',
  'trade.details.entry': 'Entrée',
  'trade.details.exit': 'Sortie',
  'trade.details.size': 'Taille',
  'trade.details.duration': 'Durée',
  'trade.details.instrument': 'Instrument',
  'trade.details.exit-time': 'Heure de sortie',
  'trade.details.entry-time': "Heure d'entrée",
  'trade.details.title': 'Détails du trade',
  'trade.details.thesis': 'Thèse',
  'trade.details.no-thesis': 'Aucune thèse prévue pour ce trade',
  'trade.details.add-thesis': 'Cliquez sur « Modifier » pour ajouter une thèse',
  'trade.metadata.account': 'Compte:',
  'trade.metadata.custom-tags': 'Balises personnalisées :',
  'trade.metadata.setups': 'Configurations',
  'trade.metadata.mistakes': 'Erreurs',
  'trade.image.no-images': 'Aucune image pour ce trade',
  'trade.image.click-edit': 'Cliquez sur modifier pour ajouter des images',
  'trade.image.alt-prefix': 'Image de trading',
  'trade.review.mark-as-reviewed': 'Marquer comme révisé',
  'trade.review.reviewed': 'Révisé',
  'trade.review.reviewed-on': 'Évalué le {date}',
  'timeline.trade-type.regular': 'Trade',
  'timeline.trade-type.missed': 'Trade manqué',
  'timeline.trade-type.backtest': 'Trade de backtest',
  'timeline.status.open': 'Ouvrir',
  'timeline.status.profit': 'Profit',
  'timeline.status.loss': 'Perte',
  'timeline.status.breakeven': 'Seuil de rentabilité',
  'timeline.aria.trade-status': '{ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.title.current-trade':
    '{tradeType} actuel : {ticker} {tradeType} {tradeNumber}',
  'timeline.title.view-trade':
    'Afficher {ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.title.trade-still-open': 'Le trade est toujours ouvert',
  'drc.trades.chart.cumulative-pnl': 'P&L cumulé',
  'drc.trades.chart.drawdown': 'Retrait',
  'drc.trades.stats.title': 'Statistiques de trading quotidiennes',
  'drc.trades.stats.net-pnl': 'P&L net',
  'drc.trades.stats.win-rate': 'Taux de réussite',
  'drc.trades.stats.profit-factor': 'Ratio gains/pertes',
  'drc.trades.stats.expectancy': 'Espérance de gain',
  'drc.trades.stats.total-trades': 'Total des trades',
  'drc.trades.stats.avg-win': 'Victoire moyenne',
  'drc.trades.stats.avg-loss': 'Perte moyenne',
  'drc.trades.stats.pl-ratio': 'Rapport P/L',
  'drc.trades.log.title': 'Journal des trades',
  'drc.trades.log.empty': 'Aucun trade pour ce jour',
  'drc.trades.log.empty-sub': 'Les trades apparaîtront ici une fois ajoutées',
  'drc.trades.table.images': 'Images',
  'drc.trades.table.entry-exit-time': "Heure d'entrée/sortie",
  'drc.trades.table.ticker': 'Ticker',
  'drc.trades.table.direction': 'Sens',
  'drc.trades.table.setup': 'Setup',
  'drc.trades.table.pnl': 'P&L',
  'drc.trades.table.open': 'OUVRIR',
  'drc.trades.table.na': 'N/A',
  'drc.trades.table.unknown': 'Inconnu',
  'drc.trades.image.alt': 'Image du trade {id}',
  'drc.trades.image.preview-alt': 'Aperçu du trade {id}',
  'drc.component-name': 'DRC',
  'drc.tab.preparation': 'Préparation',
  'drc.tab.trades': 'Trades',
  'drc.tab.review': 'Revue',
  'drc.preparation.support-levels': 'Niveaux de support',
  'drc.preparation.resistance-levels': 'Niveaux de résistance',
  'drc.preparation.enter-price': 'Entrez le niveau de prix',
  'drc.preparation.select-importance': "Sélectionnez le niveau d'importance",
  'drc.preparation.add-support': 'Ajouter un niveau de support',
  'drc.preparation.add-resistance': 'Ajouter un niveau de résistance',
  'drc.preparation.remove-level': 'Supprimer le niveau',
  'drc.preparation.no-support': 'Aucun niveau de support défini',
  'drc.preparation.no-resistance': 'Aucun niveau de résistance défini',
  'drc.preparation.importance.none': 'Aucune',
  'drc.preparation.importance.high': 'Haut',
  'drc.preparation.importance.medium': 'Moyen',
  'drc.preparation.importance.low': 'Faible',
  'drc.preparation.checklist.title': 'Liste de contrôle pré-trading',
  'drc.preparation.checklist.empty':
    'Aucun élément de la liste de contrôle pré-trade',
  'drc.preparation.checklist.sub-apply':
    'Appliquer les éléments de la liste de contrôle à partir des paramètres du plugin',
  'drc.preparation.checklist.sub-add':
    'Ajouter des éléments de liste de contrôle dans les paramètres du plugin',
  'drc.preparation.bias.title': 'Biais du marché',
  'drc.preparation.bias.bullish': 'Haussière',
  'drc.preparation.bias.bearish': 'Baissier',
  'drc.preparation.bias.neutral': 'Neutre',
  'drc.preparation.bias.placeholder': 'Sélectionnez le biais du marché',
  'drc.preparation.goals.title': 'Objectifs quotidiens',
  'drc.preparation.goals.empty': 'Aucun objectif quotidien de la veille',
  'drc.preparation.events.title': 'Événements clés',
  'drc.preparation.events.all-week': 'Toute la semaine',
  'drc.preparation.events.empty': "Aucun événement clé pour aujourd'hui",
  'drc.preparation.events.sub-empty':
    'Des événements peuvent être ajoutés dans la revue hebdomadaire',
  'drc.preparation.forecast.title': 'Prévisions quotidiennes',
  'drc.preparation.media.title': 'Liens médias',
  'drc.preparation.media.youtube': 'Lien YouTube',
  'drc.preparation.media.youtube-placeholder':
    'Lien vers votre flux de trading',
  'drc.preparation.error.service-unavailable': 'Service DRC non disponible',
  'drc.preparation.error.image-upload':
    "Erreur lors du téléchargement de l'image",
  'drc.missed-trades.title': 'Transactions manquées',
  'drc.missed-trades.loading': 'Chargement des trades manqués...',
  'drc.missed-trades.error.service-unavailable':
    'Le service des trades manqués n’est pas disponible',
  'drc.missed-trades.error.load-failed':
    'Échec du chargement des trades manqués',
  'drc.missed-trades.error-prefix': 'Erreur : {error}',
  'drc.missed-trades.retry': 'Réessayer',
  'drc.missed-trades.unknown': 'Inconnu',
  'drc.missed-trades.no-setup': 'Aucun setup spécifiée',
  'drc.missed-trades.badge': 'MANQUÉE',
  'drc.missed-trades.open-details-title': 'Ouvrir les détails du trade manqué',
  'drc.missed-trades.view-details': 'Afficher les détails →',
  'drc.missed-trades.label.setup': 'Setup:',
  'drc.missed-trades.label.reason': 'Raison:',
  'drc.missed-trades.add-button': '+ Ajouter un trade manqué',
  'drc.missed-trades.add-title': 'Ajouter un nouveau trade manqué',
  'drc.missed-trades.empty': "Aucun trade manqué pour aujourd'hui",
  'drc.missed-trades.empty-sub':
    'Suivez les opportunités de trading que vous avez manquées pour améliorer votre exécution',
  'missed-trade.reason-title': 'Pourquoi ai-je raté ce trade ?',
  'missed-trade.loading-navigation': 'Chargement de la navigation...',
  'drc.review.goal-placeholder': 'Votre objectif pour la prochaine séance',
  'drc.review.no-questions':
    'Aucune question de réflexion définie. Ajoutez des questions de revue dans les paramètres.',
  'drc.review.answer-placeholder': 'Votre Réponse...',
  'drc.review.mental-game': 'Mental :',
  'drc.review.mental-game-aria': 'Niveau mental',
  'drc.review.technical-game': 'Technique :',
  'drc.review.technical-game-aria': 'Niveau technique',
  'drc.review.end-of-day-review': 'Revue de fin de journée',
  'drc.review.performance-grades': 'Notes de performance',
  'drc.review.reflection-questions': 'Questions de réflexion',
  'drc.review.goals-for-next-session': 'Objectifs pour la prochaine session',
  'drc.review.add-goal': 'Ajouter un objectif',
  'drc.review.end-of-day-screenshots': "Captures d'écran de fin de journée",
  'drc.review.add-screenshots': "Ajouter des captures d'écran",
  'drc.review.error.invalid-date':
    'Format de date DRC non valide. Veuillez vérifier la date dans votre note DRC.',
  'settings.general.title': 'Paramètres généraux',
  'settings.general.docs': 'Documents',
  'settings.general.discord': 'Discorde',
  'settings.general.github': 'GitHub',
  'settings.general.currency': 'Devise',
  'settings.general.currency-desc':
    'Choisissez la devise à afficher pour toutes les valeurs monétaires dans le plugin',
  'settings.general.currency-aria':
    'Sélectionnez la devise pour afficher les valeurs monétaires',
  'settings.general.currency-changed':
    'La devise est désormais {currency}. Tous les composants seront mis à jour immédiatement !',
  'settings.general.currency-save-failed':
    "Échec de l'enregistrement du paramètre de devise. Veuillez réessayer.",
  'settings.general.path-change.title':
    'Emplacement du dossier du journal modifié',
  'settings.general.path-change.new-trades-title':
    'De nouveaux trades seront créés dans votre nouvel emplacement de dossier',
  'settings.general.path-change.new-trades-desc':
    'Tous les futurs journaux de trading utiliseront :',
  'settings.general.path-change.manual-title': 'Action manuelle requise :',
  'settings.general.path-change.manual-desc':
    'Vous avez des trades existants dans votre dossier actuel. Pour les déplacer :',
  'settings.general.path-change.step.open-explorer':
    "Ouvrez l'explorateur de fichiers de votre vault",
  'settings.general.path-change.step.find-folder-prefix': 'Trouvez votre',
  'settings.general.path-change.step.find-folder-suffix': 'dossier',
  'settings.general.path-change.step.drag-drop':
    'Faites-le glisser et déposez-le vers votre nouvel emplacement lorsque cela vous convient',
  'settings.general.path-change.manual-note':
    'Cela vous donne un contrôle total sur quand et comment vos fichiers sont déplacés.',
  'settings.general.path-change.sync-title':
    'Mise à jour du mappage de synchronisation :',
  'settings.general.path-change.sync-desc':
    'Le plugin mettra automatiquement à jour vos mappages de synchronisation de trading pour refléter le nouveau chemin du dossier. Cela garantit que vos trades synchronisés restent connectés à leurs enregistrements backend.',
  'settings.general.path-change.button.cancel': 'Annuler',
  'settings.general.path-change.button.confirm': 'Je comprends',
  'settings.general.display-name': "Nom d'affichage",
  'settings.general.display-name-desc':
    'Nom facultatif à afficher dans le message de bienvenue de la vue Journalit (par exemple, "Bonjour, Alex")',
  'settings.general.display-name-placeholder':
    "Ajouter un nouveau nom d'affichage...",
  'settings.general.display-name-aria':
    "Nom d'affichage pour le message de bienvenue",
  'settings.general.display-name-confirm-aria':
    "Confirmer le changement de nom d'affichage",
  'settings.general.display-name-cancel-aria':
    "Annuler le changement de nom d'affichage",
  'settings.general.display-name-saved':
    'Nom à afficher enregistré sous "{name}"',
  'settings.general.display-name-cleared': "Nom d'affichage effacé",
  'settings.general.display-name-save-failed':
    "Échec de l'enregistrement du nom d'affichage. Veuillez réessayer.",
  'settings.general.display-privacy-section': 'Affichage & confidentialité',
  'settings.general.privacy-mode': 'Mode confidentialité',
  'settings.general.privacy-mode-desc':
    'Masque les valeurs sensibles de trading, de compte, de prix et de performance dans l’interface sans modifier les données enregistrées.',
  'settings.general.privacy-mode-aria':
    'Activer ou désactiver le mode confidentialité',
  'home.widget.profit-target-widget.name': 'Objectif de profit',
  'home.widget.profit-target-widget.description':
    'Suivre la progression des objectifs de profit des comptes',

  'settings.general.home-view-settings': "Paramètres d'affichage de l'accueil",
  'settings.general.home-auto-open':
    "Ouverture automatique de la vue d'accueil",
  'settings.general.home-auto-open-desc':
    'Choisir quand ouvrir automatiquement la vue Accueil',
  'settings.general.home-auto-open-always':
    'Toujours ouvert + focus (par défaut)',
  'settings.general.home-auto-open-ifnone': 'Seulement si aucun fichier actif',
  'settings.general.home-auto-open-never': 'Jamais (manuel uniquement)',
  'settings.general.home-auto-open-aria':
    'Sélectionnez le comportement de démarrage à domicile',
  'settings.general.home-startup-changed':
    'Le comportement de démarrage de Journalit a été modifié comme suit : {behavior}',
  'settings.general.filter-recent':
    'Filtrer les éléments récents dans les fichiers Journalit',
  'settings.general.filter-recent-desc':
    'Afficher uniquement les fichiers liés à Journalit dans le widget Éléments récents (fichiers dans le dossier .journalit). Masque tous les autres fichiers du vault de la liste des éléments récents.',
  'settings.general.filter-recent-aria':
    'Filtrer les éléments récents dans les fichiers Journalit',
  'settings.general.filter-recent-toggled':
    'Filtrer les éléments récents dans les fichiers Journalit {status}',
  'settings.general.folder-section':
    "Emplacement des dossiers et chemins d'images",
  'settings.general.journal-folder': 'Emplacement du dossier du journal',
  'settings.general.journal-folder-desc':
    'Choisissez où vos journaux de trading sont stockés dans votre vault.',
  'settings.general.journal-folder-desc-2':
    'Laissez vide pour utiliser l’emplacement du dossier racine par défaut.',
  'settings.general.journal-folder-placeholder':
    'Sélectionnez un dossier personnalisé...',
  'settings.general.journal-folder-default':
    'Par défaut : dossier racine (! Journalit)',
  'settings.general.update-image-paths': "Mettre à jour les chemins d'image",
  'settings.general.update-image-paths-desc':
    'Met à jour les chemins d’image dans tous les trades pour correspondre à l’emplacement actuel du dossier. Utilisez-le après avoir déplacé manuellement votre dossier ! Journalit.',
  'settings.general.update-image-paths-updating': 'Mise à jour...',
  'settings.general.update-image-paths-match':
    "Tous les chemins d'image correspondent déjà à l'emplacement actuel du dossier",
  'settings.general.folder-updated':
    'Chemin du dossier du journal mis à jour. De nouveaux trades seront créés dans : {path}',
  'settings.general.folder-update-failed':
    'Échec de la mise à jour du chemin : {error}',
  'settings.general.update-image-paths-success':
    "Les chemins d'image ont été mis à jour avec succès dans les trades {count}",
  'settings.general.update-image-paths-no-update':
    "Aucun chemin d'image n'a besoin d'être mis à jour",
  'settings.general.update-image-paths-errors':
    'Mise à jour des trades {updated} avec des erreurs {failed}. Vérifiez la console pour plus de détails.',
  'settings.general.update-image-paths-failed':
    "Échec de la mise à jour des chemins d'accès aux images. Vérifiez la console pour plus de détails.",
  'settings.general.trade-settings': 'Paramètres de trading',
  'settings.general.auto-open-trades': 'Ouverture automatique des trades créés',
  'settings.general.auto-open-trades-desc':
    'Ouvrir automatiquement les notes de trading dans un nouvel onglet après leur création',
  'settings.general.auto-open-trades-aria':
    'Ouverture automatique des trades créés',
  'settings.general.auto-open-toggled':
    'Ouverture automatique des trades créés {status}',
  'settings.general.date-format': 'Format des dates',
  'settings.general.date-format-desc':
    "Format d'affichage des dates dans tout le plugin",
  'settings.general.date-format-aria':
    'Sélectionnez le format de date pour les notes de trading',
  'settings.general.date-format-ddmmyy': 'JJ/MM/AA (31/12/23)',
  'settings.general.date-format-mmddyy': 'MM/JJ/AA (31/12/23)',
  'settings.general.date-format-yymmdd': 'AA/MM/JJ (23/12/31)',
  'settings.general.date-format-changed':
    'Le format de la date de la note de trading a été remplacé par {format}.',
  'settings.general.use-24-hour-time':
    "Utiliser le format d'heure de 24 heures",
  'settings.general.use-24-hour-time-desc':
    'Afficher les heures au format 24 heures (14h30) au lieu du format 12 heures AM/PM (14h30)',
  'settings.general.use-24-hour-time-aria':
    'Utiliser le format horaire 24 heures',
  'settings.general.skip-weekends': 'Passer les week-ends dans la navigation',
  'settings.general.skip-weekends-desc':
    'Évitez les week-ends lorsque vous naviguez entre les jours de bourse (par exemple, vendredi → lundi)',
  'settings.general.skip-weekends-aria':
    'Évitez les week-ends lors de la navigation',
  'settings.general.skip-weekends-toggled': 'Passer les week-ends {status}',
  'settings.general.week-start': 'Jour de début de semaine',
  'settings.general.week-start-desc':
    'Choisissez le jour où commence votre semaine de trading. Affecte les revues et les rapports hebdomadaires.',
  'settings.general.week-start-aria':
    'Sélectionnez le jour de début de la semaine',
  'settings.general.week-start-changed':
    'Le jour de début de la semaine a été remplacé par {day}',
  'settings.general.analytics-date-basis': "Base de date d'analyse",
  'settings.general.analytics-date-basis-desc':
    "Idéal pour les swing traders. Utilise la date d'entrée ou la date de sortie finale pour l'analyse. Le mode date de sortie ne compte que les trades fermés et nécessite une date de sortie pour les trades P&L directes.",
  'settings.general.analytics-date-basis-aria':
    "Sélectionnez la base de la date d'analyse",
  'settings.general.analytics-date-basis-entry': "Date d'entrée",
  'settings.general.analytics-date-basis-exit': 'Date de sortie',
  'settings.general.analytics-date-basis-changed':
    "La base de date d'analyse a été modifiée en {basis}",
  'settings.general.dollar-value-input':
    'Entrez la taille de la position comme valeur en dollars',
  'settings.general.dollar-value-input-desc':
    'Lorsque cette option est activée, entrez la taille de la position sous forme de montant en dollars (par exemple, 10 000 $) au lieu de quantité (actions/lots/contrats). La quantité sera calculée automatiquement à partir du prix. Fonctionne mieux pour les actions ;les contrats à terme/forex ont des multiplicateurs de contrat qui ne sont pas pris en compte.',
  'settings.general.dollar-value-input-aria':
    'Entrez la taille de la position comme valeur en dollars',
  'settings.general.dollar-value-input-toggled':
    'Saisie de la taille de position : {mode}',
  'settings.general.dollar-value': 'Valeur en dollars',
  'settings.general.quantity': 'Quantité',
  'settings.general.mae-mfe-input-mode': "Mode d'entrée MAE/MFE",
  'settings.general.mae-mfe-input-mode-desc':
    "Choisissez comment saisir les valeurs d'excursion maximales défavorables/favorables dans le formulaire de trade.",
  'settings.general.mae-mfe-input-mode-desc-price':
    'Niveaux de prix : saisissez le prix le plus bas/le plus élevé atteint pendant le trade.',
  'settings.general.mae-mfe-input-mode-desc-dollar':
    'Valeurs en dollars : saisissez directement le drawdown/bénéfice maximum en dollars.',
  'settings.general.mae-mfe-input-mode-aria':
    "Sélectionnez le mode d'entrée MAE/MFE",
  'settings.general.mae-mfe-input-mode-price': 'Niveaux de prix',
  'settings.general.mae-mfe-input-mode-dollar': 'Valeurs en dollars',
  'settings.general.cutoff-time': 'Heure limite du jour de bourse',
  'settings.general.cutoff-time-desc':
    'Heure qui définit la fin d’une journée de trading. Les trades après cette heure seront regroupés avec le jour suivant. (Format 24 heures, par exemple 23h30 pour 23h30)',
  'settings.general.cutoff-time-aria': 'Heure limite du jour de bourse',
  'settings.general.cutoff-time-changed':
    "L'heure limite du jour de bourse a été modifiée à {time}",
  'settings.general.break-even-threshold-mode': 'Type de seuil de rentabilité',
  'settings.general.break-even-threshold-mode-desc':
    'Choisissez si le seuil de rentabilité est déterminé par une fourchette fixe de P&L ou par un pourcentage du solde actuel de chaque compte de trading.',
  'settings.general.break-even-mode-fixed': 'Fourchette de montant fixe',
  'settings.general.break-even-mode-percent':
    'Pourcentage du solde du compte courant',
  'settings.general.break-even-percent': "Pourcentage d'équilibre",
  'settings.general.break-even-percent-desc':
    'Seuil symétrique autour de zéro (±X% du solde du compte courant). Les trades sans solde de compte résoluble sont exclues des statistiques de gains/pertes.',
  'settings.general.break-even-percent-placeholder': '0,05',
  'settings.general.break-even-percent-aria':
    'Pourcentage de rentabilité du solde du compte courant',
  'settings.general.break-even-range': 'Plage de rentabilité',
  'settings.general.break-even-range-desc':
    'Définissez une fourchette de P&L pour considérer les trades comme étant à l’équilibre. Par exemple, définir Min : -20 et Max : 20 traitera les trades entre -20 $ et +20 $ comme le seuil de rentabilité. Réglez les deux sur 0 pour considérer uniquement 0,00 $ exact comme seuil de rentabilité. Le minimum doit être inférieur ou égal au maximum.',
  'settings.general.break-even-min-placeholder': 'Min.',
  'settings.general.break-even-max-placeholder': 'Max.',
  'settings.general.break-even-min-aria': 'Plage de rentabilité minimale',
  'settings.general.break-even-max-aria': 'Plage de rentabilité maximale',
  'settings.general.break-even-to': 'à',
  'settings.general.break-even-warning':
    'Attention : la valeur minimale est supérieure à la valeur maximale. Cela empêchera les trades d’être classées comme étant à l’équilibre.',
  'settings.general.break-even-updated':
    'Plage de rentabilité mise à jour - les vues seront actualisées au prochain chargement',
  'settings.general.default-risk': 'Montant du risque de défaut',
  'settings.general.default-risk-desc':
    'Montant du risque par défaut (dans la devise du compte) utilisé pour les calculs R-multiples. Laissez vide pour exiger une saisie manuelle par trade.',
  'settings.general.default-risk-aria': 'Montant du risque de défaut',
  'settings.general.display-r-multiples': 'Afficher les R-Multiples',
  'settings.general.display-r-multiples-desc':
    'Afficher les valeurs R multiples (rapports risque/récompense) au lieu des montants en devises dans tout le plugin',
  'settings.general.display-r-multiples-aria':
    'Afficher les R-multiples dans les vues de trading',
  'settings.general.display-r-multiples-toggled':
    'Les R-multiples affichent {status}',
  'settings.general.notification-settings': 'Paramètres de notification',
  'settings.general.sync-notifications': 'Synchroniser les notifications',
  'settings.general.sync-notifications-desc':
    'Afficher les notifications lorsque les opérations de synchronisation sont terminées',
  'settings.general.sync-notifications-aria':
    'Activer les notifications de synchronisation',
  'settings.general.sync-notifications-toggled':
    'Synchroniser les notifications {status}',
  'settings.general.new-trade-notifications':
    'Nouvelles notifications de trading',
  'settings.general.new-trade-notifications-desc':
    'Afficher des notifications lorsque de nouveaux fichiers de trading sont détectés',
  'settings.general.new-trade-notifications-aria':
    'Activer les nouvelles notifications de trading',
  'settings.general.new-trade-notifications-toggled':
    'Nouvelles notifications de trading {status}',
  'settings.general.update-notifications':
    'Afficher les notifications de mise à jour',
  'settings.general.update-notifications-desc':
    "Afficher une notification lorsqu'une nouvelle mise à jour du plugin est disponible",
  'settings.general.update-notifications-aria':
    'Afficher les notifications de mise à jour',
  'settings.general.update-notifications-toggled':
    'Notifications de mise à jour {status}',
  'settings.general.data-management': 'Gestion des données & confidentialité',
  'settings.general.export-settings': "Paramètres d'exportation",
  'settings.general.export-settings-desc':
    'Téléchargez tous les paramètres du plugin sous forme de fichier JSON pour les sauvegarder ou les transférer vers un autre vault',
  'settings.general.export-settings-exporting': 'Exportation...',
  'settings.general.import-settings': "Paramètres d'importation",
  'settings.general.import-settings-desc':
    "Restaurez les paramètres d'un fichier JSON précédemment exporté. Les paramètres seront fusionnés avec les valeurs actuelles.",
  'settings.general.import-settings-importing': 'Importation...',
  'settings.general.reset-to-defaults': 'Réinitialiser aux valeurs par défaut',
  'settings.general.reset-to-defaults-desc':
    'Réinitialisez tous les paramètres du plugin à leurs valeurs par défaut. Une sauvegarde sera créée automatiquement.',
  'settings.general.reset-to-defaults-warning':
    'Avertissement : Cela supprimera toutes les options personnalisées, les paramètres de compte et les mises en page.',
  'settings.general.reset-to-defaults-resetting': 'Réinitialisation...',
  'settings.general.enabled': 'activé',
  'settings.general.disabled': 'désactivé',
  'settings.customization.title': 'Personnalisation',
  'settings.customization.description':
    "Personnalisez les options, l'apparence et le comportement du plugin Journalit.",
  'settings.customization.tickers-symbols': 'Tickers/Symboles',
  'settings.customization.symbol-mappings': 'Mappages de symboles',
  'settings.customization.account-types': 'Types de comptes',
  'settings.customization.setups': 'Setups',
  'settings.customization.mistakes': 'Erreurs',
  'settings.customization.tags': 'Balises',
  'settings.customization.events': 'Événements',
  'settings.customization.custom-fields': 'Champs de trade personnalisés',
  'settings.customization.options.confirm.update-notes':
    'OK (notes de mise à jour)',
  'settings.customization.options.confirm.save-name':
    'Enregistrer le nom uniquement',
  'settings.customization.options.confirm.cancel': "Annuler l'action",
  'settings.customization.options.type.tickers': 'Tickers',
  'settings.customization.options.type.accounts': 'Comptes',
  'settings.customization.options.type.account-types': 'Types de comptes',
  'settings.customization.options.type.setups': 'Setups',
  'settings.customization.options.type.mistakes': 'Erreurs',
  'settings.customization.options.type.tags': 'Balises',
  'settings.customization.options.type.events': 'Événements',
  'settings.customization.options.asset-type.cfd': 'CFD',
  'settings.customization.options.notice.empty-name':
    "Le nom de l'option ne peut pas être vide",
  'settings.customization.options.notice.invalid-ticker':
    'Format de téléscripteur invalide. Seuls les lettres, chiffres et points sont autorisés.',
  'settings.customization.options.notice.added':
    'Ajout de l\'option "{newValue}" à {type}',
  'settings.customization.options.notice.duplicate':
    'Option en double : {newValue} existe déjà',
  'settings.customization.options.notice.asset-type-required':
    "Le type d'actif est requis pour les instruments",
  'settings.customization.options.notice.updated-with-notes':
    'Option mise à jour de "{oldValue}" à "{newValue}" et notes {count} mises à jour',
  'settings.customization.options.notice.updated':
    'Option mise à jour de "{oldValue}" à "{newValue}"',
  'settings.customization.options.confirm.rename-message':
    "Voulez-vous mettre à jour toutes les notes existantes qui utilisent « {oldValue} » pour utiliser « {newValue} » à la place ?\n\nCela recherchera dans toutes les notes et mettra à jour la valeur de l'option partout où elle se trouve.",
  'settings.customization.options.notice.cannot-delete-archived':
    'Impossible de supprimer le type de compte "Archivé" - il est réservé à l\'archivage des comptes',
  'settings.customization.options.confirm.remove-message':
    'Êtes-vous sûr de vouloir supprimer « {option} » ? Cela ne peut pas être annulé.',
  'settings.customization.options.notice.removed':
    'Option supprimée "{option}"',
  'settings.customization.options.notice.remove-failed':
    "Échec de la suppression de l'option",
  'settings.customization.options.confirm.reset-message':
    'Êtes-vous sûr de vouloir réinitialiser tous les {type} aux options par défaut ? Cela ne peut pas être annulé.',
  'settings.customization.options.notice.reset-success':
    'Réinitialiser {type} aux options par défaut',
  'settings.customization.options.notice.no-options-to-reset':
    'Les options {type} par défaut sont déjà utilisées',
  'settings.customization.options.notice.mapping-symbols-required':
    'Les deux symboles sont obligatoires',
  'settings.customization.options.notice.mapping-added':
    'Mappage ajouté : {imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    "Échec de l'ajout du mappage",
  'settings.customization.options.notice.mapping-deleted':
    'Mappage supprimé : {symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    'Échec de la suppression du mappage',
  'settings.customization.options.empty-state':
    "Aucun {type} personnalisé n'a encore été ajouté.",
  'settings.customization.options.label.save-changes':
    'Enregistrer les modifications',
  'settings.customization.options.label.cancel-editing':
    'Annuler la modification',
  'settings.customization.options.label.edit-option': 'Modifier {option}',
  'settings.customization.options.label.remove-option': 'Supprimer {option}',
  'settings.customization.options.placeholder.select-asset':
    "Sélectionnez le type d'actif...",
  'settings.customization.options.field.pip-size': 'Taille du pip',
  'settings.customization.options.field.priority': 'Priorité:',
  'settings.customization.options.field.default-event-notes':
    "Notes d'événement par défaut :",
  'settings.customization.options.placeholder.default-event-notes':
    'Notes à remplir automatiquement lorsque cet événement est sélectionné',
  'settings.customization.options.aria.confirm-add':
    "Confirmez l'ajout de {type}",
  'settings.customization.options.label.locked': 'Fermée',
  'settings.customization.options.label.archived-reserved': 'Archivé (réservé)',
  'settings.customization.options.aria.reset-all':
    'Supprimer tous les {type} personnalisés',
  'settings.customization.options.button.reset-all':
    'Tout réinitialiser {type}',
  'settings.customization.options.placeholder.new-name': 'Nouveau nom {type}',
  'settings.customization.options.placeholder.dollar-per-point': '$/point',
  'settings.customization.options.placeholder.tick-size': 'Taille du tick',
  'settings.customization.options.placeholder.tick-value': 'Valeur du tick',
  'settings.customization.options.placeholder.lot-size': 'Taille du lot',
  'settings.customization.options.placeholder.pip-value': 'Valeur du pip',
  'settings.customization.options.placeholder.pip-size': 'Taille du pipi',
  'settings.customization.options.field.optional': '(facultatif)',
  'settings.customization.options.mapping.description':
    'Mappe les symboles spécifiques au contrat (par exemple, NQZ5) aux symboles de base (par exemple, NQ) pour une recherche automatique des spécifications',
  'settings.customization.options.mapping.auto-detected':
    'Détection automatique',
  'settings.customization.options.mapping.manual': 'Manuel',
  'settings.customization.options.mapping.created-at': 'Créé {date}',
  'settings.customization.options.mapping.no-mappings':
    "Aucun mappage de symboles pour l'instant. Les mappages sont créés automatiquement lors des importations CSV lorsque des symboles de contrat sont détectés.",
  'settings.customization.options.mapping.placeholder-imported':
    'Symbole importé (par exemple, NQZ5)',
  'settings.customization.options.mapping.placeholder-base':
    'Symbole de base (par exemple, NQ)',
  'settings.customization.options.mapping.button-add': 'Ajouter un mappage',
  'settings.customization.options.placeholder.add-new':
    'Ajouter un nouveau {type}',
  'settings.customization.options.aria.delete-mapping': 'Supprimer le mappage',
  'settings.customization.options.instrument.specs-futures':
    '${dollar}/pt, {tick} tick, ${value} tick val',
  'settings.customization.options.instrument.specs-forex':
    '{lot} lot, {pip} $ de valeur de pip, {size} taille de pip',
  'settings.customization.options.instrument.built-in': '(intégré)',
  'settings.customization.options.instrument.mapped-to':
    'Mappé sur {base} (utilise les spécifications de {base})',
  'settings.customization.options.instrument.no-specs':
    '(Aucune spécification définie)',
  'settings.loss-review.field.content': 'Contenu',
  'settings.loss-review.field.checkbox-label': 'Libellé de la case à cocher',
  'settings.loss-review.field.placeholder-text': "Texte d'espace réservé",
  'settings.loss-review.field.checkbox-items': 'Éléments de case à cocher',
  'settings.loss-review.field.section-title': 'Titre de la section',
  'settings.loss-review.field.section-type': 'Type de section',
  'settings.loss-review.placeholder.header-content':
    "Saisissez le contenu de l'en-tête (prend en charge la Markdown)",
  'settings.loss-review.placeholder.checkbox-label':
    'Entrez le libellé de la case à cocher (prend en charge la Markdown)',
  'settings.loss-review.placeholder.textarea-placeholder':
    "Entrez le texte d'espace réservé pour la zone de texte",
  'settings.loss-review.placeholder.checkbox-item':
    "Entrez l'élément de case à cocher (prend en charge la Markdown)",
  'settings.loss-review.placeholder.section-title':
    'Entrez le titre de la section',
  'settings.loss-review.untitled-section': 'Section sans titre',
  'settings.loss-review.type.header': 'En-tête',
  'settings.loss-review.type.checkbox': 'Case à cocher unique',
  'settings.loss-review.type.textarea': 'Zone de texte',
  'settings.loss-review.type.checkbox-list': 'Liste des cases à cocher',
  'button.remove': 'Retirer',
  'button.add-item': 'Ajouter un article',
  'button.move-up': 'Monter',
  'button.move-down': 'Descendre',
  'button.remove-section': 'Supprimer la section',
  'settings.customization.custom-fields.description':
    "Créez des champs personnalisés qui apparaîtront dans l'onglet Avancé du formulaire de trade. Ces champs seront enregistrés dans le frontmatter de votre trade.",
  'settings.customization.custom-fields.title':
    'Champs personnalisés ({count})',
  'settings.customization.custom-fields.manage-desc':
    'Gérez vos champs de formulaire de trade personnalisés',
  'settings.customization.custom-fields.type-dropdown': 'Dérouler',
  'settings.customization.custom-fields.type-multiselect': 'Sélection multiple',
  'settings.customization.custom-fields.type-suffix': 'champ',
  'settings.customization.custom-fields.option-count.one': 'Option {count}',
  'settings.customization.custom-fields.option-count.few': 'Options {count}',
  'settings.customization.custom-fields.option-count.many': 'Options {count}',
  'settings.customization.custom-fields.option-count.other': 'Options {count}',
  'settings.customization.custom-fields.no-fields':
    "Aucun champ personnalisé défini pour l'instant",
  'settings.customization.custom-fields.no-fields-desc':
    "Les champs personnalisés apparaîtront dans l'onglet « Avancé » du formulaire de trade et seront enregistrés dans la couverture de vos notes de trading.",
  'settings.customization.custom-fields.add-new': 'Ajouter un nouveau champ',
  'settings.customization.custom-fields.edit-field': 'Modifier le champ',
  'settings.customization.custom-fields.edit-field-with-name':
    'Modifier « {fieldLabel} »',
  'settings.customization.custom-fields.configure-desc':
    'Configurez vos paramètres de champ personnalisé ci-dessous',
  'settings.customization.custom-fields.actions': 'Actions',
  'settings.customization.custom-fields.actions-desc':
    'Gérez vos champs personnalisés',
  'settings.customization.custom-fields.add-button':
    'Ajouter un champ personnalisé',
  'settings.customization.custom-fields.delete-all-button':
    'Supprimer tous les champs',
  'settings.customization.custom-fields.editor.title': 'Setup sur le terrain',
  'settings.customization.custom-fields.editor.label': 'Libellé du champ',
  'settings.customization.custom-fields.editor.label-desc':
    "Nom d'affichage pour ce champ",
  'settings.customization.custom-fields.editor.label-placeholder':
    'Entrez le libellé du champ',
  'settings.customization.custom-fields.editor.key': 'Clé de première ligne',
  'settings.customization.custom-fields.editor.key-desc':
    'Cette clé apparaîtra dans vos fiches trades :',
  'settings.customization.custom-fields.editor.key-placeholder': 'nom_champ',
  'settings.customization.custom-fields.editor.key-reserved':
    '⚠️ Nom du champ réservé',
  'settings.customization.custom-fields.editor.type': 'Type de champ',
  'settings.customization.custom-fields.editor.type-desc':
    'Type de champ de saisie',
  'settings.customization.custom-fields.editor.placeholder':
    "Texte d'espace réservé",
  'settings.customization.custom-fields.editor.placeholder-desc':
    "Texte d'espace réservé facultatif affiché dans un champ vide",
  'settings.customization.custom-fields.editor.placeholder-input':
    "Saisissez le texte de l'espace réservé",
  'settings.customization.custom-fields.editor.trade-log': 'Journal des trades',
  'settings.customization.custom-fields.editor.trade-log-desc':
    "Contrôler la façon dont ce champ apparaît lorsqu'il est ajouté en tant que colonne du journal des trades",
  'settings.customization.custom-fields.editor.column-label':
    'Étiquette de la colonne du journal des trades',
  'settings.customization.custom-fields.editor.column-label-desc':
    "Étiquette plus courte facultative utilisée uniquement dans l'en-tête du journal des trades",
  'settings.customization.custom-fields.editor.column-label-placeholder':
    "Utiliser l'étiquette du champ par défaut",
  'settings.customization.custom-fields.editor.display-as-currency':
    'Afficher comme devise',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Formate ce champ numérique comme une valeur monétaire uniquement dans le journal des trades',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'Mode de tri déroulant',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'Désactivé par défaut. Activez le tri uniquement lorsque cette liste déroulante a un ordre significatif.',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'Désactivé',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'Alphabétique',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'Numérique',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'Ordre des options configuré',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'Affichage réduit',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'Choisissez le rendu des valeurs à sélection multiple lorsque le mode étendu du journal des trades est désactivé',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'Insigne de comte',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'Liste de valeurs',
  'settings.customization.custom-fields.editor.validation': 'Validation',
  'settings.customization.custom-fields.editor.validation-desc':
    'Règles de validation des champs',
  'settings.customization.custom-fields.editor.validation.required':
    'Champ obligatoire',
  'settings.customization.custom-fields.editor.validation.required-desc':
    'Rendre ce champ obligatoire',
  'settings.customization.custom-fields.editor.validation.min-length':
    'Longueur minimale',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    'Nombre minimum de caractères',
  'settings.customization.custom-fields.editor.validation.no-min':
    'Pas de minimum',
  'settings.customization.custom-fields.editor.validation.max-length':
    'Longueur maximale',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    'Nombre maximum de caractères',
  'settings.customization.custom-fields.editor.validation.no-max':
    'Pas de maximum',
  'settings.customization.custom-fields.editor.validation.min-value':
    'Valeur minimale',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    'Nombre minimum autorisé',
  'settings.customization.custom-fields.editor.validation.max-value':
    'Valeur maximale',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    'Nombre maximum autorisé',
  'settings.customization.custom-fields.editor.options': 'Options',
  'settings.customization.custom-fields.editor.options-desc':
    'Choix disponibles pour ce champ',
  'settings.customization.custom-fields.editor.add-option':
    'Ajouter une nouvelle option',
  'settings.customization.custom-fields.editor.add-option-desc':
    'Entrez un nouveau choix',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    'Entrez une nouvelle option',
  'settings.customization.custom-fields.editor.allow-create':
    'Autoriser la création de nouvelles options',
  'settings.customization.custom-fields.editor.allow-create-desc':
    "Les utilisateurs peuvent créer de nouvelles options lorsqu'ils utilisent ce champ dans les formulaires de trading",
  'settings.customization.custom-fields.editor.save': 'Enregistrer le champ',
  'settings.customization.custom-fields.editor.delete': 'Supprimer le champ',
  'settings.customization.custom-fields.type.text': 'Texte',
  'settings.customization.custom-fields.type.number': 'Nombre',
  'settings.customization.custom-fields.type.date': 'Date',
  'settings.customization.custom-fields.type.datetime': 'Date et heure',
  'settings.customization.custom-fields.type.time': 'Temps',
  'settings.customization.custom-fields.error.cannot-save':
    "Impossible d'enregistrer le champ : {error}",
  'settings.customization.custom-fields.error.duplicate-key':
    'Un champ avec cette clé de front existe déjà',
  'settings.customization.custom-fields.error.save-failed':
    "Échec de l'enregistrement du champ. Veuillez réessayer.",
  'settings.customization.custom-fields.notice.import-summary':
    '{validCount} champs valides importés sur un total de {totalCount}',
  'settings.customization.custom-fields.delete.confirm-message':
    'Êtes-vous sûr de vouloir supprimer le champ personnalisé « {fieldLabel} » ?',
  'settings.customization.custom-fields.delete.cannot-undo':
    'Cette action ne peut pas être annulée.',
  'settings.customization.custom-fields.reset.confirm-message':
    'Êtes-vous sûr de vouloir supprimer TOUS les champs personnalisés ?',
  'settings.customization.custom-fields.saved-options.title':
    'Options personnalisées enregistrées',
  'settings.customization.custom-fields.saved-options.description':
    'Gérer les options créées par les utilisateurs pour les champs personnalisés',
  'settings.customization.custom-fields.saved-options.delete-error':
    "Échec de la suppression de l'option. Veuillez réessayer.",
  'settings.customization.custom-fields.saved-options.clear-error':
    'Échec de la suppression des options. Veuillez réessayer.',
  'settings.customization.custom-fields.option.delete-confirm':
    "Êtes-vous sûr de vouloir supprimer l'option « {optionName} » ?",
  'settings.customization.custom-fields.option.clear-confirm':
    'Êtes-vous sûr de vouloir supprimer TOUTES les options enregistrées pour « {fieldLabel} » ?',
  'onboarding.welcome.title': 'Bienvenue sur Journalit',
  'onboarding.welcome.subtitle':
    'Possédez vos données de trading. Façonnez votre propre flux de travail.',
  'onboarding.welcome.cta': 'Commencer',
  'onboarding.welcome.chart.week': 'Semaine {count}',
  'onboarding.view.title': 'Intégration de Journalit',
  'onboarding.welcome.discover-heading': 'Ce que vous découvrirez :',
  'onboarding.welcome.tagline':
    'Nous allons vous installer en moins de 60 secondes',
  'onboarding.welcome.insight.win-rate.title': 'Analyse du taux de réussite',
  'onboarding.welcome.insight.win-rate.content':
    '"Vos setups de petits groupes ont un taux de réussite de 82 % contre 67 % pour les retraits"',
  'onboarding.welcome.insight.timing.title': 'Modèles de synchronisation',
  'onboarding.welcome.insight.timing.content':
    '"Les trades tenues pendant 2 à 4 heures affichent un rapport risque-récompense 3 fois supérieur à celui des scalps"',
  'onboarding.welcome.insight.psychology.title': 'Suivi psychologique',
  'onboarding.welcome.insight.psychology.content':
    '"Vous prenez des bénéfices 15 % trop tôt lorsque vous avez augmenté de plus de 500 $"',
  'onboarding.welcome.trust.data-ownership':
    'Vos données, votre appareil - Propriété et contrôle complets',
  'onboarding.welcome.trust.any-broker':
    "Fonctionne avec n'importe quel broker - Synchronisation MetaTrader + saisie manuelle",
  'onboarding.welcome.trust.customizable':
    'Entièrement personnalisable - Suivez ce qui compte pour vous',
  'onboarding.common.continue': 'Continuer',
  'onboarding.common.close': 'Fermer',
  'onboarding.features.title':
    'Sélectionnez ce qui correspond à votre flux de travail.',
  'onboarding.features.feature.mt5-sync.label': 'Synchronisation MT5',
  'onboarding.features.feature.mt5-sync.description':
    'Importer automatiquement les trades depuis MetaTrader 5',
  'onboarding.features.feature.csv-import.label': 'Trade Import',
  'onboarding.features.feature.csv-import.description':
    "Importez des trades de n'importe quel broker avec Trade Import",
  'onboarding.features.feature.manual-entry.label': 'Saisie manuelle',
  'onboarding.features.feature.manual-entry.description':
    'Enregistrez les trades manuellement avec un contrôle total',
  'onboarding.features.feature.analytics.label': 'Analyses et informations',
  'onboarding.features.feature.analytics.description':
    'Mesures de performances, graphiques et statistiques de trading',
  'onboarding.features.feature.account-tracking.label': 'Suivi des comptes',
  'onboarding.features.feature.account-tracking.description':
    "Suivre plusieurs comptes personnels et d'entreprises d'accessoires",
  'onboarding.features.feature.trade-journal.label': 'Layout Builder',
  'onboarding.features.feature.trade-journal.description':
    'Créez des mises en page de revue personnalisées avec des widgets, des graphiques et des notes',
  'onboarding.features.feature.ai-trading-assistant.label':
    'Assistant de trading IA',
  'onboarding.features.feature.ai-trading-assistant.description':
    'Reconnaissance de formes, informations et conseils personnalisés',
  'onboarding.features.badge.coming-soon': 'À venir',
  'onboarding.features.badge.pro': 'Pro',
  'onboarding.features.trial.pro':
    'Les fonctionnalités Pro incluent un essai gratuit de 14 jours',
  'onboarding.explore.title': 'Explorer',
  'onboarding.explore.subtitle':
    'Journalit transforme votre vault en un journal de trading complet avec des tableaux de bord, un journal des trades, un suivi de compte et des mises en page personnalisables.',
  'onboarding.explore.subtitle2':
    "Conçu pour s'adapter à votre flux de travail, sans vous forcer à adopter le nôtre.",
  'onboarding.explore.tagline': 'Votre journal, vos règles.',
  'onboarding.explore.section.out-of-box.title': 'Vues et outils de base',
  'onboarding.explore.core.dashboard.label': 'Tableau de bord de trading',
  'onboarding.explore.core.dashboard.description':
    "Vos performances en un coup d'œil : P&L, taux de réussite, retraits, et bien plus encore.",
  'onboarding.explore.core.tradelog.label': 'Journal des trades',
  'onboarding.explore.core.tradelog.description':
    'Parcourez les trades par année/mois/semaine/jour et explorez instantanément.',
  'onboarding.explore.core.accounts.label': 'Suivi des comptes',
  'onboarding.explore.core.accounts.description':
    'Suivez plusieurs comptes et affichez les pages de performances spécifiques au compte.',
  'onboarding.explore.core.layouts.label': 'Layout Builder',
  'onboarding.explore.core.layouts.description':
    'Personnalisez les tableaux de bord et examinez les mises en page avec des widgets et des modèles.',
  'onboarding.explore.imports.title': 'Importations et synchronisation (Pro)',
  'onboarding.explore.imports.subtitle':
    "Prévisualisez et configurez à tout moment. L'importation/synchronisation nécessite Pro.",
  'onboarding.explore.imports.csv.label': 'Trade Import',
  'onboarding.explore.imports.csv.description':
    "Prévisualisez vos exports de broker et cartographiques. L'importation dans votre vault nécessite Pro.",
  'onboarding.explore.imports.mt.label': 'Synchronisation MetaTrader (MT4/MT5)',
  'onboarding.explore.imports.mt.description':
    'Synchronisation automatique des trades depuis MetaTrader. Nécessite Pro.',
  'onboarding.explore.cta.open': 'Ouvrir',
  'onboarding.explore.cta.manual': 'Ouvrir Docs',
  'onboarding.path.kicker': 'Choisir le chemin',
  'onboarding.path.tip.trial':
    'Astuce : les abonnements Pro incluent un essai gratuit de 14 jours.',
  'onboarding.path.title': 'Choisissez votre premier chemin',
  'onboarding.path.subtitle':
    'Choisissez le moyen le plus rapide d’obtenir votre premier trade dans Journalit.',
  'onboarding.path.option.manual.label': 'Saisie manuelle (gratuite)',
  'onboarding.path.option.manual.description':
    'Créez un trade en quelques secondes avec le formulaire Ajouter un trade.',
  'onboarding.path.option.csv.label': 'Trade Import',
  'onboarding.path.option.csv.description':
    'Use Pro backend-powered analysis for broker export files.',
  'onboarding.path.option.mt.label': 'Synchronisation MetaTrader (MT4/MT5)',
  'onboarding.path.option.mt.description':
    'Connectez MT4/MT5 pour une synchronisation automatique des trades.',
  'onboarding.final.manual.title': 'Vous êtes prêt à Journalit',
  'onboarding.final.manual.hotkey.title': 'Touche de raccourci suggérée',
  'onboarding.final.manual.hotkey.value': 'Mod + Alt + A',
  'onboarding.final.manual.cta.change-hotkey': 'Définir le raccourci clavier',
  'onboarding.final.manual.hit-hotkey':
    'Suggéré : {hotkey}. Cliquez sur Définir le raccourci clavier pour le configurer.',
  'onboarding.final.csv.title': 'Vous êtes prêt à apporter vos trades',
  'onboarding.final.csv.subtitle':
    "Ensuite, prévisualisez Trade Import. L'importation dans votre vault nécessite l'activation Pro.",
  'onboarding.final.csv.cta.open': 'Open Trade Import',
  'onboarding.final.mt.title': 'Vous êtes prêt à vous connecter à MetaTrader',
  'onboarding.final.mt.subtitle':
    "Ensuite, configurez la synchronisation MT4/MT5. Nécessite l'activation Pro.",
  'onboarding.final.mt.cta.open': 'Ouvrez le setup de MetaTrader',
  'onboarding.final.mt.hero.source.title': 'MétaTrader',
  'onboarding.final.mt.hero.source.subtitle': 'Rapports de trading',
  'onboarding.final.mt.hero.dest.title': 'Sauter',
  'onboarding.final.mt.hero.dest.subtitle': 'Notes de trading',
  'onboarding.final.finish': 'Finition',
  'onboarding.features.graphic.syncing': 'Synchronisation des trades...',
  'onboarding.features.graphic.complete': 'Synchronisation terminée',
  'onboarding.features.graphic.direction.long': 'LONGUE',
  'onboarding.features.graphic.direction.short': 'COURTE',
  'onboarding.features.graphic.status.win': 'GAGNER',
  'onboarding.features.graphic.status.loss': 'PERTE',
  'onboarding.activation.title': 'Connectez-vous à Journalit',
  'onboarding.activation.subtitle':
    'Authentification complète dans votre navigateur pour accéder à votre compte',
  'onboarding.activation.status.initializing':
    "Génération de votre code d'authentification...",
  'onboarding.activation.status.waiting': 'En attente de connexion...',
  'onboarding.activation.status.expired': 'Code expiré',
  'onboarding.activation.status.denied': 'Connexion refusée',
  'onboarding.activation.status.error': 'Échec de la connexion',
  'onboarding.activation.error.init':
    'Impossible de démarrer la connexion. Veuillez vérifier votre connexion Internet et réessayer.',
  'onboarding.activation.error.denied':
    'La connexion a été refusée. Vous pourrez vous connecter plus tard à partir des paramètres.',
  'onboarding.activation.error.expired':
    "Le code d'authentification a expiré. Veuillez redémarrer le processus de connexion.",
  'onboarding.activation.error.generic':
    "Quelque chose s'est mal passé. Veuillez réessayer.",
  'onboarding.activation.error.save':
    "La connexion a réussi mais n'a pas réussi à enregistrer. Veuillez redémarrer le plugin et réessayer.",
  'onboarding.activation.error.connection':
    'Connexion perdue. Veuillez vérifier votre connexion Internet et réessayer.',
  'onboarding.activation.notice.invalid-url':
    "URL d'activation invalide. Veuillez contacter l'assistance.",
  'onboarding.activation.notice.popup-blocked-copied':
    "Popup du navigateur bloqué. URL d'activation copiée dans le presse-papiers - veuillez la coller dans votre navigateur.",
  'onboarding.activation.notice.popup-blocked-manual':
    'Veuillez ouvrir cette URL dans votre navigateur : {url}',
  'onboarding.activation.notice.copy-code-failed':
    'Échec de la copie du code. Veuillez copier manuellement.',
  'onboarding.activation.label.code': "Votre code d'authentification",
  'onboarding.activation.button.copy': 'Copier le code',
  'onboarding.activation.button.copy-link': 'Copier le lien',
  'onboarding.activation.button.copied': 'Copié!',
  'onboarding.activation.step.open-browser':
    'Cliquez ci-dessous pour ouvrir votre navigateur',
  'onboarding.activation.step.enter-code':
    "Entrez votre code d'authentification",
  'onboarding.activation.step.complete-signin': 'Connexion complète',
  'onboarding.activation.step.return-here':
    'Revenez ici pour une complétion automatique',
  'onboarding.activation.button.open-browser':
    'Ouvrez le navigateur pour vous connecter',
  'onboarding.activation.waiting.title': 'En attente de connexion...',
  'onboarding.activation.waiting.hint':
    "Cela prend généralement moins d'une minute",
  'onboarding.activation.success.title': 'Connexion terminée !',
  'onboarding.activation.success.subtitle':
    'Vous êtes désormais connecté à votre compte Journalit',
  'onboarding.activation.features.title': 'Fonctionnalités disponibles :',
  'onboarding.activation.features.sync':
    'Synchronisez les trades sur tous les appareils',
  'onboarding.activation.features.analytics': 'Analyses et rapports avancés',
  'onboarding.activation.features.mt5': 'Synchronisation de trading MT5',
  'onboarding.activation.features.csv': 'Trade Import intelligent',
  'onboarding.activation.auto-advance':
    'Reprise automatique dans 10 secondes...',
  'onboarding.activation.skip': 'Activer plus tard',
  'onboarding.notice.complete-failed':
    "Échec de l'enregistrement de la fin de l'intégration. Veuillez réessayer plus tard.",
  'onboarding.notice.skip-failed':
    "Échec de l'enregistrement de l'étape d'intégration. Veuillez réessayer plus tard.",
  'onboarding.progress.aria-label': 'Étape {current} de {total}',
  'onboarding.progress.step': 'Étape {step}',
  'onboarding.progress.status.completed': '(complété)',
  'onboarding.progress.status.current': '(actuelle)',
  'onboarding.progress.announcement':
    'Étape {current} sur {total} terminée{label}',
  'widget.goals.title.daily': 'Objectifs quotidiens',
  'widget.goals.title.weekly': 'Objectifs hebdomadaires',
  'widget.goals.title.monthly': 'Objectifs mensuels',
  'widget.goals.title.quarterly': 'Objectifs trimestriels',
  'widget.goals.title.yearly': 'Objectifs annuels',
  'widget.goals.title.default': 'Objectifs',
  'widget.goals.tooltip.daily':
    "Les éléments ajoutés ici ne s'appliquent qu'à ce jour. Pour les éléments récurrents sur tous les nouveaux DRC, accédez à Paramètres > Revue.",
  'widget.goals.tooltip.weekly':
    "Les éléments ajoutés ici ne s'appliquent qu'à cette semaine. Pour les éléments récurrents sur tous les nouveaux revue hebdomadaires, accédez à Paramètres > Revue.",
  'widget.goals.tooltip.monthly':
    "Les éléments ajoutés ici ne s'appliquent qu'à ce mois-ci. Pour les éléments récurrents sur tous les nouveaux revue mensuels, accédez à Paramètres > Revue.",
  'widget.goals.tooltip.quarterly':
    "Les éléments ajoutés ici ne s'appliquent qu'à ce trimestre. Pour les éléments récurrents sur tous les nouveaux revue trimestriels, accédez à Paramètres > Revue.",
  'widget.goals.tooltip.yearly':
    'Les éléments ajoutés ici ne s’appliquent qu’à cette année. Pour les éléments récurrents sur tous les nouveaux revue annuels, accédez à Paramètres > Revue.',
  'widget.goals.completed': '{completed}/{total} terminé',
  'widget.goals.placeholder': 'Ajouter un nouvel objectif...',
  'widget.goals.empty.preview': 'Aucun objectif configuré',
  'widget.goals.empty.default':
    'Aucun objectif fixé. Ajoutez-en un ci-dessous.',
  'widget.goals.invalid-context':
    'Le widget Objectifs nécessite une note de revue (DRC, hebdomadaire, mensuelle, trimestrielle ou annuelle)',
  'widget.goals.aria.edit': "Modifier l'objectif",
  'widget.goals.aria.delete': "Supprimer l'objectif",
  'widget.header.name': 'En-tête',
  'widget.header.description': 'En-tête de navigation avec liens contextuels',
  'widget.header.invalid-context':
    'Frontmatter invalide : nécessite un « type » (drc/weekly-review/monthly-review/quarterly-review/trade) et un champ de date (« date » pour les revues, « entryTime » pour les trades)',
  'widget.header.aria.mark-reviewed': 'Cliquez pour marquer comme révisé',
  'widget.header.aria.mark-not-reviewed': 'Cliquez pour marquer comme non revu',
  'widget.header.unknown-instrument': 'Instrument inconnu',
  'widget.header.week': 'Semaine {number}',
  'widget.header.quarter': 'Q{number}',
  'widget.header.drc': 'DRC',
  'widget.header.nav.prev': '← Précédent',
  'widget.header.nav.next': 'Suivant →',
  'widget.header.day.0': 'Dimanche',
  'widget.header.day.1': 'Lundi',
  'widget.header.day.2': 'Mardi',
  'widget.header.day.3': 'Mercredi',
  'widget.header.day.4': 'Jeudi',
  'widget.header.day.5': 'Vendredi',
  'widget.header.day.6': 'Samedi',
  'widget.header.month.0': 'Janvier',
  'widget.header.month.1': 'Février',
  'widget.header.month.2': 'Mars',
  'widget.header.month.3': 'Avril',
  'widget.header.month.4': 'Mai',
  'widget.header.month.5': 'Juin',
  'widget.header.month.6': 'Juillet',
  'widget.header.month.7': 'Août',
  'widget.header.month.8': 'Septembre',
  'widget.header.month.9': 'Octobre',
  'widget.header.month.10': 'Novembre',
  'widget.header.month.11': 'Décembre',
  'widget.header.month-short.0': 'Jan',
  'widget.header.month-short.1': 'Fév',
  'widget.header.month-short.2': 'Mar',
  'widget.header.month-short.3': 'Avr',
  'widget.header.month-short.4': 'Mai',
  'widget.header.month-short.5': 'juin',
  'widget.header.month-short.6': 'Juillet',
  'widget.header.month-short.7': 'Août',
  'widget.header.month-short.8': 'Sep',
  'widget.header.month-short.9': 'Octobre',
  'widget.header.month-short.10': 'Nov',
  'widget.header.month-short.11': 'Déc',
  'widget.picker.placeholder': 'Sélectionnez un widget...',
  'widget.category.charts': 'Graphiques',
  'widget.category.statistics': 'Statistiques',
  'widget.category.content': 'Contenu',
  'widget.category.tables': 'Tableaux',
  'widget.category.layout': 'Mise en page',
  'widget.goals.name': 'Objectifs',
  'widget.goals.description':
    "Objectifs quotidiens avec cases à cocher d'achèvement",
  'widget.review.name': 'Revue',
  'widget.review.description': 'Niveaux de performance mentale et technique',
  'widget.review-context-fields.name': 'Champs de contexte de revue',
  'widget.review-context-fields.description':
    'Champs de contexte personnalisés modifiables pour les notes de revue',
  'widget.review-context-fields.group.default': 'Contexte de revue',
  'widget.review-context-fields.inherited-title': 'Contexte hérité',
  'widget.review-context-fields.local-title': 'Contexte local',
  'widget.review-context-fields.empty-title':
    "Aucun champ de contexte de revue n'est configuré pour ce type de revue.",
  'widget.review-context-fields.empty-desc':
    "Créez des champs de revue personnalisés dans les paramètres pour saisir le biais, le focus, l'intention et d'autres éléments de contexte de planification.",
  'widget.review-context-fields.configure': 'Configurer les champs de revue',
  'widget.review-context-fields.service-unavailable':
    'Les champs de revue personnalisés ne sont pas encore disponibles.',
  'widget.review-context-fields.unsupported-type':
    'Type de champ de revue non pris en charge.',
  'widget.review-context-fields.source-missing':
    "Cette revue parente n'existe pas encore.",
  'widget.review-context-fields.source-invalid':
    "Cette revue parente existe, mais ce n'est pas une note de revue valide.",
  'widget.review-context-fields.source-empty':
    "Aucune valeur héritée n'est encore renseignée dans cette revue parente.",
  'widget.review-context-fields.open-source': 'Ouvrir',
  'widget.review-context-fields.create-source': 'Créer',
  'widget.review.title': 'Évaluation de la performance',
  'widget.review.mental-game': 'Mental',
  'widget.review.technical-game': 'Technique',
  'widget.review.star-hint':
    'Cliquez pour une étoile complète, faites un clic droit pour une demi-étoile',
  'widget.review.invalid-context':
    'Le widget de revue nécessite une note DRC ou revue hebdomadaire (type de sujet : « drc » ou « weekly-review »)',
  'widget.checklist.name': 'Liste de contrôle',
  'widget.checklist.description':
    'Liste de contrôle de préparation pré-session',
  'widget.session-mistakes.name': 'Erreurs de séance',
  'widget.session-mistakes.description': 'Erreurs de fin de session',
  'widget.key-levels.name': 'Niveaux clés',
  'widget.key-levels.description':
    'Des niveaux de prix importants à surveiller',
  'widget.key-events.name': 'Événements clés',
  'widget.key-events.description': 'Événements importants de la période',
  'widget.key-events.title': 'Événements clés',
  'widget.key-events.tooltip':
    'Les événements clés sont enregistrés dans votre revue hebdomadaire et peuvent être ajoutés ou modifiés ici dans le DRC.',
  'widget.key-events.placeholder': 'Sélectionner ou créer un événement',
  'widget.key-events.color-label': 'Couleur:',
  'widget.key-events.color-aria': 'Sélectionnez la couleur {color}',
  'widget.key-events.day-label': 'Jour:',
  'widget.key-events.notes-placeholder': 'Notes sur cet événement (facultatif)',
  'widget.key-events.notes-label': 'Notes',
  'widget.key-events.default-notes-tooltip':
    "Les notes par défaut sont gérées dans Paramètres → Personnalisation → Événements. La sélection d'un événement ici remplira automatiquement ses notes par défaut enregistrées.",
  'widget.key-events.add-button': 'Ajouter un événement',
  'widget.key-events.empty-state': "Aucun événement clé pour aujourd'hui",
  'widget.key-events.empty-state-sub':
    'Ajoutez des événements dans votre revue hebdomadaire',
  'widget.missed-trades.name': 'Transactions manquées',
  'widget.missed-trades.description':
    "Transactions que vous avez identifiées mais que vous n'avez pas effectuées",
  'widget.images.name': 'Images',
  'widget.images.description':
    "Carrousel d'images avec prise en charge du téléchargement",
  'widget.images.invalid-context':
    'Le widget Images nécessite une note de revue (tapez : « drc », « revue hebdomadaire », « revue mensuelle », « revue trimestrielle » ou « revue annuelle »)',
  'widget.images.alt-prefix': 'Image de revue',
  'widget.images.stacked-alt': 'Image de revue {index}',
  'widget.images.open-fullscreen': "Ouvrir l'image {index} en plein écran",
  'widget.images.delete': "Supprimer l'image",
  'widget.images.empty': 'Aucune image',
  'widget.images.placeholder':
    "Coller l'URL de l'image ou le chemin du fichier...",
  'widget.images.placeholder-add-more': "Ajouter plus d'images...",
  'widget.mark-reviewed.name': 'Marquer comme révisé',
  'widget.mark-reviewed.description': 'Marquer la revue terminée',
  'widget.mark-reviewed.status.reviewed': 'RÉVISÉ',
  'widget.mark-reviewed.status.pending': "EN ATTENTE D'EXAMEN",
  'widget.mark-reviewed.button.undo': 'Défaire',
  'widget.mark-reviewed.button.mark': 'Marquer comme révisé',
  'widget.pnl-chart.name': 'Courbe des gains et pertes',
  'widget.pnl-chart.description': 'Profit/perte cumulé au fil du temps',
  'widget.drawdown-chart.name': 'Retrait',
  'widget.drawdown-chart.description':
    'Montant du drawdown des trades clôturés depuis le précédent pic de P&L réalisé',
  'widget.directional-pnl.name': 'P&L par direction',
  'widget.directional-pnl.description':
    'Comparaison des performances long et short',
  'widget.directional-drawdown.name': 'Drawdown réalisé par direction',
  'widget.directional-drawdown.description':
    'Courbes séparées de montant de drawdown des trades clôturés long et short',
  'widget.long-drawdown.name': 'Drawdown long réalisé',
  'widget.long-drawdown.description':
    'Courbe du montant de drawdown des trades long clôturés',
  'widget.short-drawdown.name': 'Drawdown short réalisé',
  'widget.short-drawdown.description':
    'Courbe du montant de drawdown des trades short clôturés',
  'widget.trades-chart.name': 'P&L de trading',
  'widget.trades-chart.description': 'Barre P&L pour chaque trade individuelle',
  'widget.trades-chart-daily.name': 'P&L quotidien',
  'widget.trades-chart-daily.description': 'P&L agrégé par jour',
  'widget.trades-chart-weekly.name': 'P&L hebdomadaire',
  'widget.trades-chart-weekly.description': 'P&L agrégé par semaine',
  'widget.trades-chart-monthly.name': 'P&L mensuel',
  'widget.trades-chart-monthly.description': 'P&L agrégé par mois',
  'widget.trades-chart-quarterly.name': 'P&L trimestriel',
  'widget.trades-chart-quarterly.description': 'P&L agrégé par trimestre',
  'widget.stats.name': 'Grille de statistiques',
  'widget.stats.description':
    'Indicateurs de performance clés sous forme de grille',
  'widget.stats.no-trades': 'Aucun trade clôturé pour cette période',
  'widget.stats.vs-prev': 'vs préc.',
  'dashboard.metrics.past-30d': '30 derniers j',
  'widget.stats.no-change': 'Aucun changement',
  'widget.stats.no-previous-data': 'Aucune donnée précédente',
  'widget.stats.net-pnl': 'P&L net',
  'widget.stats.win-rate': 'Taux de réussite',
  'widget.stats.profit-factor': 'Ratio gains/pertes',
  'widget.stats.expectancy': 'Espérance de gain',
  'widget.stats.total-trades': 'Total des trades',
  'widget.stats.avg-win': 'Victoire moyenne',
  'widget.stats.avg-loss': 'Perte moyenne',
  'widget.stats.pl-ratio': 'Rapport P/L',
  'widget.account-breakdown.name': 'Répartition par compte',
  'widget.account-breakdown.description':
    'Compare les performances des comptes sur cette période de revue',
  'widget.account-breakdown.empty': 'Aucun trade clôturé pour cette période',
  'widget.account-breakdown.column.account': 'Compte',
  'widget.account-breakdown.column.trades': 'Transactions',
  'widget.account-breakdown.column.pnl': 'P&L net',
  'widget.account-breakdown.column.win-rate': 'Taux de réussite',
  'widget.account-breakdown.column.profit-factor': 'Facteur de profit',
  'widget.setup-performance.name': 'Performances de setup',
  'widget.setup-performance.description':
    'Répartition des performances par setup de trading',
  'widget.best-worst-trades.name': 'Meilleurs/pires trades',
  'widget.best-worst-trades.description':
    'Meilleures trades gagnants et perdantes',
  'widget.best-worst.best-trade': 'Meilleur trade',
  'widget.best-worst.worst-trade': 'Le pire trade',
  'widget.best-worst.no-win-trades': 'Aucun trade gagnant',
  'widget.best-worst.no-loss-trades': 'Pas de trades perdants',
  'widget.best-worst.best-month': 'Meilleur mois',
  'widget.best-worst.worst-month': 'Pire mois',
  'widget.best-worst.no-profitable-months': 'Pas de mois rentables',
  'widget.best-worst.no-losing-months': 'Pas de mois perdus',
  'widget.best-worst.n-trades': '{count} trades',
  'widget.best-worst.win-rate': '{rate} % de taux de réussite',
  'widget.best-worst-days.name': 'Meilleurs/pires jours',
  'widget.best-worst-days.description':
    'Jours de P&L les plus élevés et les plus bas',
  'widget.best-worst-days.best-day': 'Meilleur jour',
  'widget.best-worst-days.worst-day': 'Le pire jour',
  'widget.best-worst-days.no-profitable-days': 'Pas de jours rentables',
  'widget.best-worst-days.no-losing-days': 'Pas de jours perdus',
  'widget.best-worst-days.trade-count.one': '{count} trade',
  'widget.best-worst-days.trade-count.few': '{count} trades',
  'widget.best-worst-days.trade-count.many': '{count} trades',
  'widget.best-worst-days.trade-count.other': '{count} trades',
  'widget.best-worst-days.win-rate': '{rate} % de taux de réussite',
  'widget.best-worst-days.invalid-context':
    'Ce widget est uniquement disponible dans les revues hebdomadaires et mensuelles',
  'widget.position-size.title': 'Taille de position',
  'widget.position-size.save-defaults': 'Enregistrer par défaut',
  'widget.position-size.reset-defaults': 'Réinitialiser aux valeurs par défaut',
  'widget.position-size.stock-crypto': 'Actions/Crypto',
  'widget.position-size.futures': 'Contrats à terme',
  'widget.position-size.forex': 'Forex',
  'widget.position-size.account-balance': 'Solde du compte',
  'widget.position-size.risk-percent': 'Risque %',
  'widget.position-size.entry-price': "Prix ​​d'entrée",
  'widget.position-size.profit-target-optional':
    'Objectif de profit (facultatif)',
  'widget.position-size.currency-pair': 'Paire de devises',
  'widget.position-size.stop-loss-pips': 'Stop-loss (pips)',
  'widget.position-size.target-pips-optional': 'Cible (pips, facultatif)',
  'widget.position-size.placeholder.example': 'par exemple, {value}',
  'widget.position-size.enter-values': 'saisir des valeurs',
  'widget.position-size.risk': 'Risque',
  'widget.position-size.reward': 'Récompense',
  'widget.position-size.stop': 'arrêt',
  'widget.position-size.pts': 'points',
  'widget.position-size.mini': 'mini',
  'widget.position-size.pip-value-info':
    'Valeur du pip : {value} $ (lot standard) |Taille du pip : {size}',
  'widget.position-size.futures-info':
    '{dollar}$/pt |Cochez : {size} = {value} $',
  'widget.position-size.investment-dollar': 'Investissement ($)',
  'widget.position-size.investment': 'Investissement',
  'widget.position-size.at-price': '@ ${price}',
  'widget.best-worst-weeks.name': 'Meilleures/pires semaines',
  'widget.best-worst-weeks.description':
    'Semaines de P&L les plus élevées et les plus basses',
  'widget.best-worst-weeks.best-week': 'Meilleure semaine',
  'widget.best-worst-weeks.worst-week': 'Pire semaine',
  'widget.best-worst-weeks.no-profitable': 'Pas de semaines rentables',
  'widget.best-worst-weeks.no-losing': 'Pas de semaines perdues',
  'widget.best-worst-weeks.week-name': 'Semaine {number} ({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} trades',
  'widget.best-worst-weeks.win-rate': '{percent} % de taux de réussite',
  'widget.best-worst-weeks.invalid-context':
    'Ce widget est uniquement disponible dans les revues hebdomadaires, mensuelles, trimestrielles et annuelles.',
  'widget.best-worst-months.name': 'Meilleurs/pires mois',
  'widget.best-worst-months.description':
    'Mois de P&L les plus élevés et les plus bas',
  'widget.best-worst-months.invalid-context':
    'Ce widget est uniquement disponible dans les revues trimestrielles et annuelles',
  'widget.best-worst-quarters.name': 'Meilleurs/pires trimestres',
  'widget.best-worst-quarters.description':
    'Trimestres de P&L les plus élevés et les plus bas',
  'widget.best-worst-quarters.best-quarter': 'Meilleur trimestre',
  'widget.best-worst-quarters.worst-quarter': 'Pire trimestre',
  'widget.best-worst-quarters.no-profitable': 'Aucun trimestre rentable',
  'widget.best-worst-quarters.no-losing': 'Pas de quarts perdants',
  'widget.best-worst-quarters.trade-count': '{count} trades',
  'widget.best-worst-quarters.win-rate': '{percent} % de taux de réussite',
  'widget.best-worst-quarters.invalid-context':
    'Ce widget est uniquement disponible dans les revues annuelles',
  'widget.technical-game.name': 'Technique',
  'widget.technical-game.description': 'Notes techniques hebdomadaires',
  'widget.mental-game.name': 'Mental',
  'widget.mental-game.description':
    'Distribution hebdomadaire des notes mentales des DRC',
  'widget.demon-tracker.name': 'Traqueur de démons',
  'widget.demon-tracker.description':
    'Suivez les erreurs de trading récurrentes',
  'widget.trading-score.title': 'Score de trading',
  'widget.trading-score.no-data': 'Aucune donnée de trading',
  'widget.trading-score.breakdown-title': 'Répartition des scores',
  'widget.trading-score.close-breakdown': 'Fermer la répartition',
  'widget.trading-score.of-weeks': 'de {count}',
  'widget.trading-score.start-trading':
    'Commencez à trader pour débloquer votre score',
  'widget.trading-score.one-week-down': "1 semaine d'arrêt, continuez !",
  'widget.trading-score.weeks-to-unlock.one':
    '{count} semaine supplémentaire à débloquer',
  'widget.trading-score.weeks-to-unlock.few':
    '{count} semaines supplémentaires à débloquer',
  'widget.trading-score.weeks-to-unlock.many':
    '{count} semaines supplémentaires à débloquer',
  'widget.trading-score.weeks-to-unlock.other':
    '{count} semaines supplémentaires à débloquer',
  'widget.trading-score.trades-to-unlock.one':
    '{count} trade supplémentaire à débloquer',
  'widget.trading-score.trades-to-unlock.few':
    '{count} trades supplémentaires à débloquer',
  'widget.trading-score.trades-to-unlock.many':
    '{count} trades supplémentaires à débloquer',
  'widget.trading-score.trades-to-unlock.other':
    '{count} trades supplémentaires à débloquer',
  'widget.trading-score.collect-more-data':
    'Collectez un peu plus de données pour débloquer votre score',
  'widget.trading-score.trades-logged.one': '{count} trade enregistré',
  'widget.trading-score.trades-logged.few': '{count} trades enregistrés',
  'widget.trading-score.trades-logged.many': '{count} trades enregistrés',
  'widget.trading-score.trades-logged.other': '{count} trades enregistrés',
  'widget.trading-score.trades-count': '{count} trades',
  'widget.trading-score.weight': 'Poids : {weight} %',
  'widget.trading-score.weeks-suffix': '· {weeks}w',
  'widget.trading-score.axis-aria':
    '{axis} : {score} points, {weight} % du poids',
  'widget.trading-score.phase.insufficient': 'Données insuffisantes',
  'widget.trading-score.phase.developing': 'Développement',
  'widget.trading-score.phase.established': 'Établie',
  'widget.trading-score.axis.profitability': 'Rentabilité',
  'widget.trading-score.axis.riskManagement': 'Gestion des risques',
  'widget.trading-score.axis.execution': 'Exécution',
  'widget.trading-score.axis.consistency': 'Cohérence',
  'widget.trading-score.axis.returnConsistency': 'Cohérence des retours',
  'widget.trading-score.axis.experience': 'Expérience',
  'widget.trading-score.axis.profitability.desc':
    'Mesure le ratio gains/pertes et l’espérance de gain par trade',
  'widget.trading-score.axis.riskManagement.desc':
    'Mesure le contrôle maximal du retrait et la capacité de récupération',
  'widget.trading-score.axis.execution.desc':
    'Mesure le taux de réussite et le ratio moyen de victoires/pertes',
  'widget.trading-score.axis.consistency.desc':
    'Les mesures rendent la stabilité et le contrôle des stries',
  'widget.trading-score.axis.returnConsistency.desc':
    'Mesure l’uniformité des take-profits et des stop-loss',
  'widget.trading-score.axis.experience.desc':
    'Mesure les semaines de trading actives et la cohérence',
  'widget.trades.name': 'Trades',
  'widget.trades.description': 'Liste des trades avec les détails clés',
  'widget.backtest-trades.name': 'Transactions de backtest',
  'widget.backtest-trades.description':
    'Liste des trades de backtest pour cette période de revue',
  'widget.breakdown-daily.name': 'Résumé quotidien',
  'widget.breakdown-daily.description':
    'Tableau des performances regroupées par jour',
  'widget.breakdown-weekly.name': 'Résumé hebdomadaire',
  'widget.breakdown-weekly.description':
    'Tableau des performances regroupées par semaine',
  'widget.breakdown-monthly.name': 'Sommaire mensuel',
  'widget.breakdown-monthly.description':
    'Tableau des performances regroupées par mois',
  'widget.breakdown-quarterly.name': 'Résumé trimestriel',
  'widget.breakdown-quarterly.description':
    'Tableau des performances regroupées par trimestre',
  'widget.breakdown.empty.days-week': 'Pas de jours de bourse cette semaine',
  'widget.breakdown.empty.weeks-month': 'Pas de semaines de trading ce mois-ci',
  'widget.breakdown.empty.months-quarter': 'Aucun mois de trading ce trimestre',
  'widget.breakdown.empty.quarters-year':
    'Pas de trimestres de trading cette année',
  'widget.table.header.date': 'Date',
  'widget.table.header.week': 'Semaine',
  'widget.table.header.month': 'Mois',
  'widget.table.header.quarter': 'Quart',
  'widget.table.header.year': 'Année',
  'widget.table.header.trades': 'Trades',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Gagner%',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.setup': 'Setup',
  'widget.table.header.a-games': 'Un jeux',
  'widget.table.header.b-games': 'Jeux B',
  'widget.table.header.c-games': 'Jeux C',
  'widget.table.header.rating': 'Notation',
  'widget.table.header.avg-rating': 'Note moyenne',
  'widget.demon-tracker.column.demon': 'DÉMON',
  'widget.demon-tracker.column.occurrences': 'OCCURRENCES',
  'widget.demon-tracker.column.stop-trading': 'ARRÊTER DE TRADER',
  'widget.demon-tracker.period.this-month': 'ce mois-ci',
  'widget.demon-tracker.period.this-quarter': 'ce trimestre',
  'widget.demon-tracker.period.this-year': 'cette année',
  'widget.demon-tracker.empty.title': 'Aucune erreur suivie {period}',
  'widget.demon-tracker.empty.description':
    'Les erreurs enregistrées dans vos trades apparaîtront ici pour vous aider à identifier les modèles',
  'widget.demon-tracker.summary.unique': 'Erreurs uniques :',
  'widget.demon-tracker.summary.total': "Nombre total d'événements :",
  'widget.demon-tracker.summary.critical': 'Critique (6+) :',
  'widget.markdown-zone.name': 'Zone de Markdown',
  'widget.markdown-zone.description':
    'Zone de contenu de Markdown de forme libre',
  'widget.markdown-header.name': 'En-tête de section',
  'widget.markdown-header.description':
    'Titre Markdown (H1-H6) avec texte personnalisé',
  'metric.netPnL.name': 'Résultat net',
  'metric.netPnL.description':
    'Total des profits et pertes sur tous les trades',
  'metric.winRate.name': 'Taux de réussite',
  'metric.winRate.description': 'Pourcentage de trades gagnants',
  'metric.profitFactor.name': 'Ratio gains/pertes',
  'metric.profitFactor.description':
    'Rapport entre le bénéfice brut et la perte brute',
  'metric.expectancy.name': 'Espérance de gain',
  'metric.expectancy.description': 'Montant moyen gagné ou perdu par trade',
  'metric.maxDrawdown.name': 'Retrait max.',
  'metric.maxDrawdown.description':
    'Plus grand montant de drawdown des trades clôturés depuis un précédent pic de P&L réalisé',
  'metric.bestDay.name': 'Meilleur jour',
  'metric.bestDay.description': 'P&L journalier le plus élevé',
  'metric.largestWin.name': 'La plus grande victoire',
  'metric.largestWin.description': 'Le plus grand trade gagnant',
  'metric.largestLoss.name': 'La plus grande perte',
  'metric.largestLoss.description': 'La plus grande trade perdant',
  'metric.longestWinStreak.name': 'Meilleure séquence',
  'metric.longestWinStreak.description':
    'Plus longue séquence de victoires consécutives par date de sortie',
  'metric.longestLossStreak.name': 'Pire séquence',
  'metric.longestLossStreak.description':
    'Plus longue séquence de défaites consécutives par date de sortie',
  'metric.numTrades.name': 'Total des trades',
  'metric.numTrades.description': 'Nombre total de trades clôturés',
  'metric.numWinTrades.name': 'Trades gagnants',
  'metric.numWinTrades.description': 'Nombre de trades gagnants',
  'metric.numLossTrades.name': 'Perdre des trades',
  'metric.numLossTrades.description': 'Nombre de trades perdants',
  'metric.avgWin.name': 'Victoire moyenne',
  'metric.avgWin.description': 'Bénéfice moyen des trades gagnants',
  'metric.avgLoss.name': 'Perte moyenne',
  'metric.avgLoss.description': 'Perte moyenne des trades perdants',
  'metric.avgRR.name': 'RR moyen (remboursement)',
  'metric.avgRR.description':
    'Ratio de gain basé sur la devise : gain moyen / perte moyenne',
  'metric.avgRRRiskBased.name': 'RR moyen (basé sur R)',
  'metric.avgRRRiskBased.description':
    'Ratio basé sur le risque utilisant des R-multiples : R gagnant moyen / R perdant moyen (nécessite des données stop/risque)',
  'metric.avgHoldTime.name': 'Temps de maintien moyen',
  'metric.avgHoldTime.description': 'Temps moyen dans tous les trades clôturés',
  'metric.avgWinHoldTime.name': 'Temps de maintien moyen des victoires',
  'metric.avgWinHoldTime.description':
    'Temps moyen pour remporter des trades clôturés',
  'metric.avgLossHoldTime.name': 'Temps de maintien moyen en cas de perte',
  'metric.avgLossHoldTime.description':
    'Temps moyen de perte des trades clôturés',
  'metric.avgWinnerHeat.name': 'Chaleur moy. gagnants',
  'metric.avgWinnerHeat.description':
    'MAE moyenne des trades gagnants clôturés, avec l’unité MAE/MFE enregistrée',
  'metric.winnerMaeP90.name': 'MAE P90 gagnants',
  'metric.winnerMaeP90.description':
    'Seuil MAE au 90e percentile pour les trades gagnants clôturés, avec l’unité MAE/MFE enregistrée',
  'metric.winnerMaeMedian.name': 'MAE médiane gagnants',
  'metric.winnerMaeMedian.description':
    'MAE médiane des trades gagnants clôturés, avec l’unité MAE/MFE enregistrée',
  'metric.avgLossHeat.name': 'Chaleur moy. pertes',
  'metric.avgLossHeat.description':
    'MAE moyenne des trades perdants clôturés, avec l’unité MAE/MFE enregistrée',
  'metric.winnerAvgMfe.name': 'MFE moy. gagnants',
  'metric.winnerAvgMfe.description':
    'MFE moyenne des trades gagnants clôturés, avec l’unité MAE/MFE enregistrée',
  'metric.loserAvgMfe.name': 'MFE moy. perdants',
  'metric.loserAvgMfe.description':
    'MFE moyenne des trades perdants clôturés, avec l’unité MAE/MFE enregistrée',
  'metric.winnerMfeP90.name': 'MFE P90 gagnants',
  'metric.winnerMfeP90.description':
    'Seuil MFE au 90e percentile pour les trades gagnants clôturés, avec l’unité MAE/MFE enregistrée',
  'metric.loserMfeP90.name': 'MFE P90 perdants',
  'metric.loserMfeP90.description':
    'Seuil MFE au 90e percentile pour les trades perdants clôturés, avec l’unité MAE/MFE enregistrée',
  'metric.timeInDrawdown.name': 'Temps en drawdown',
  'metric.timeInDrawdown.description':
    'Pourcentage du temps écoulé sous le précédent pic de P&L réalisé',
  'metric.avgRecoveryTime.name': 'Temps de récupération moyen',
  'metric.avgRecoveryTime.description':
    'Temps moyen nécessaire aux drawdowns réalisés des trades clôturés pour retrouver un nouveau pic',
  'metric.longestDrawdown.name': 'Plus long drawdown réalisé',
  'metric.longestDrawdown.description':
    'Temps écoulé le plus long passé dans un épisode de drawdown réalisé',
  'metric.drawdownEpisodes.name': 'Épisodes de retrait',
  'metric.drawdownEpisodes.description':
    "Nombre de périodes de drawdown réalisées dans l'ensemble de trades filtré actuel",
  'metric.category.performance': 'Performance',
  'metric.category.volume': 'Volume',
  'metric.category.average': 'Moyenne',
  'onboarding.wizard.cancelled-announcement':
    "Intégration annulée. Vous pouvez rejouer l'intégration plus tard à partir de la palette de commandes en recherchant « Journalit : Replay Onboarding ».",
  'onboarding.wizard.error.next-step': "Échec du passage à l'étape suivante",
  'onboarding.wizard.error.prev-step': "Échec du passage à l'étape précédente",
  'onboarding.wizard.error.trade-service': 'TradeService non disponible',
  'onboarding.wizard.error.account-service':
    'AccountPageService non disponible',
  'onboarding.wizard.error.create-sample-trade':
    "Échec de la création d'un exemple de trade",
  'onboarding.wizard.error.auth-failed': "Échec de l'authentification",
  'onboarding.wizard.error.backend-service':
    "Service d'intégration backend non disponible",
  'onboarding.wizard.error.sign-in-required':
    "Veuillez vous connecter pour générer des informations d'identification FTP",
  'onboarding.wizard.error.ftp-generation':
    "Échec de la génération des informations d'identification FTP",
  'onboarding.wizard.notice.sample-trade-created':
    'Exemple de trade créé avec succès ! Vous pouvez le trouver dans votre vault.',
  'onboarding.wizard.notice.auth-success':
    'Authentifié avec succès ! Vous pouvez désormais accéder aux fonctionnalités Pro.',
  'onboarding.wizard.notice.ftp-generated':
    'Identifiants FTP générés avec succès !',
  'onboarding.wizard.notice.password-masked':
    "Le mot de passe est masqué et ne peut pas être copié. Veuillez régénérer les informations d'identification FTP.",
  'onboarding.wizard.notice.copied': '{label} copié dans le presse-papier !',
  'onboarding.wizard.notice.copy-failed': 'Échec de la copie de {label}',
  'onboarding.wizard.unknown-step.title': 'Étape inconnue',
  'onboarding.wizard.unknown-step.description':
    "Nous avons rencontré une étape inattendue dans le processus d'intégration.",
  'onboarding.wizard.footer-default':
    'Terminez le setup pour démarrer avec Journalit',
  'onboarding.wizard.skip-aria': 'Passer cette étape',
  'onboarding.wizard.skip-onboarding': "Passer l'intégration",
  'onboarding.wizard.skip-step': "Sauter l'étape",
  'settings.reviews.weekly-checklist': 'Checklist de préparation hebdomadaire',
  'settings.reviews.weekly-checklist-desc':
    'Définissez les éléments de checklist qui apparaissent automatiquement dans chaque nouveau bilan hebdomadaire. Ils sont copiés à la création et peuvent être modifiés par semaine.',
  'settings.reviews.weekly-checklist-placeholder':
    'Ajouter un élément de checklist hebdomadaire...',
  'widget.checklist.weekly-title': 'Checklist préalable hebdomadaire',
  'widget.checklist.tooltip.weekly':
    'Les éléments ajoutés ici ne s’appliquent qu’à cette semaine.',
  'widget.checklist.tooltip.weekly-settings-link':
    'Pour les éléments récurrents dans tous les nouveaux bilans hebdomadaires, allez dans Paramètres > Reviews.',
  'guide.skip-guide': 'Passer le guide',
  'account.open-trade-log.error':
    'Impossible d’ouvrir le Trade Log pour ce compte.',
  'account.linked-trades.title': 'Trades liés',
  'account.linked-trades.empty-message': 'Aucun trade lié à ce compte',
  'account.linked-trades.empty-submessage':
    'Les trades apparaîtront ici une fois ajoutées à ce compte',
  'account.linked-trades.click-to-open': 'Cliquez pour ouvrir le trade',
  'account.linked-trades.no-path-available': 'Aucun chemin disponible',
  'account.linked-trades.no-path-warning':
    "Aucun chemin de fichier - impossible d'ouvrir",
  'account.linked-trades.entry': 'Entrée',
  'account.linked-trades.exit': 'Sortie',
  'account.linked-trades.size': 'Taille',
  'account.linked-trades.setups': 'Configurations',
  'account.linked-trades.mistakes': 'Erreurs',
  'account.linked-trades.tags': 'Balises',
  'account.linked-trades.reviewed': 'Révisé',
  'account.linked-trades.not-reviewed': 'Non révisé',
  'account.linked-trades.net-costs': 'Coûts nets',
  'account.linked-trades.net-credit': 'Crédit net',
  'account.create.title': 'Créer un compte',
  'account.create.field.name': 'Nom du compte',
  'account.create.field.name-desc':
    'Un nom unique pour votre compte de trading',
  'account.create.placeholder.name': 'Mon compte de trading',
  'account.create.field.type': 'Type de compte',
  'account.create.field.type-desc': 'Le type de compte de trading',
  'account.create.field.initial-balance': 'Solde initial',
  'account.create.field.initial-balance-desc':
    'Solde de départ du compte (facultatif, la valeur par défaut est 0)',
  'account.create.field.live-balance': 'Solde en direct',
  'account.create.field.live-balance-desc': 'Solde actuel du compte du broker',
  'account.create.field.creation-date': 'Date de création',
  'account.create.field.creation-date-desc': 'Quand le compte a été créé',
  'account.create.field.currency': 'Devise',
  'account.create.field.currency-desc': 'Devise native du compte à afficher',
  'account.create.field.drawdown-type': 'Type de drawdown',
  'account.create.field.drawdown-type-desc': 'Aucun |Fixe |Suivi EOD |Manuel',
  'account.create.field.drawdown-amount': 'Montant du drawdown',
  'account.create.field.drawdown-amount-desc': 'Limite de drawdown maximale',
  'account.create.field.profit-target-desc':
    'Définir un objectif de profit pour le compte',
  'account.create.field.monthly-cost': 'Coût mensuel',
  'account.create.field.monthly-cost-desc':
    "Frais d'abonnement, coûts de plateforme",
  'account.create.field.target-type': 'Type de cible',
  'account.create.field.target-type-desc': 'Absolu ou pourcentage',
  'account.create.field.target-percent': 'Cible (%)',
  'account.create.field.target-dollar': 'Cible ($)',
  'account.create.field.target-percent-desc': 'Objectif de gain en pourcentage',
  'account.create.field.target-dollar-desc': 'Objectif de montant en dollars',
  'account.create.field.target-date': 'Date cible (facultatif)',
  'account.create.field.target-date-desc':
    "Date pour atteindre l'objectif de profit",
  'account.create.type.demo': 'Démo',
  'account.create.type.evaluation': 'Évaluation',
  'account.create.type.funded': 'Financé',
  'account.create.success': 'Compte "{name}" créé avec succès',
  'account.create.error.name-required': 'Le nom du compte est requis',
  'account.create.error.name-exists':
    'Un compte portant le nom "{name}" existe déjà',
  'account.create.error.balance-negative':
    'Le solde initial ne peut pas être négatif',
  'account.create.error.invalid-live-balance':
    "Le solde en direct n'est pas valide",
  'account.create.error.drawdown-required':
    'Le montant du drawdown est requis lorsque le type de drawdown est activé',
  'account.create.error.profit-target-required':
    "Le montant de l'objectif de profit est requis lorsque l'objectif de profit est activé",
  'account.create.error.invalid-date': 'Date de création invalide',
  'account.create.error.future-date':
    'La date de création ne peut pas être postérieure',
  'account.create.error.cost-negative':
    'Le coût mensuel ne peut pas être négatif',
  'account.create.error.service-unavailable':
    "Le service de compte n'est pas disponible. Veuillez réessayer.",
  'account.create.error.fix-target-date':
    "Veuillez corriger l'erreur de date cible de profit avant de créer le compte",
  'account.create.error.invalid-target-date':
    'Date cible de bénéfice non valide',
  'account.create.error.failed': 'Échec de la création du compte : {error}',
  'account.add-event.title': 'Ajouter un dépôt/retrait',
  'account.add-event.field.type': 'Type de trade',
  'account.add-event.field.type-desc': 'Dépôt ou retrait',
  'account.add-event.field.amount': 'Montant',
  'account.add-event.field.amount-desc': 'Montant en {currency}',
  'account.add-event.field.date': 'Date',
  'account.add-event.field.date-desc': 'Date de trade',
  'account.add-event.field.description': 'Description (Facultatif)',
  'account.add-event.field.description-desc': 'Notes complémentaires',
  'account.add-event.type.deposit': 'Dépôt',
  'account.add-event.type.withdrawal': 'Retrait',
  'account.add-event.placeholder.deposit': 'Dépôt manuel',
  'account.add-event.placeholder.withdrawal': 'Retrait manuel',
  'account.add-event.button.add': 'Ajouter un trade',
  'account.add-event.button.adding': 'Ajout...',
  'account.add-event.success': '{type} sur {amount} ajouté avec succès',
  'account.add-event.error.amount-required':
    'Le montant doit être supérieur à 0',
  'account.add-event.error.date-required': 'La date est requise',
  'account.add-event.error.invalid-date': 'Format de date invalide',
  'account.add-event.error.future-date':
    'La date de trade ne peut pas être postérieure',
  'account.add-event.error.failed': "Erreur lors de l'ajout du trade : {error}",
  'account.add-event.confirm.title': 'Confirmer le trade',
  'account.add-event.confirm.message':
    'Ajouter {type} sur {amount} au compte « {account} » le {date} ?',
  'account.add-event.confirm.description': 'Description : {description}',
  'account.risk-metrics.loading': 'Chargement des métriques de risque...',
  'account.risk-metrics.title': 'Gestion des risques',
  'account.risk-metrics.drawdown-used': 'Limite de drawdown utilisée',
  'account.risk-metrics.profit-target': 'Objectif de profit',
  'account.risk-metrics.status.breached': 'VIOLÉ',
  'account.risk-metrics.status.achieved': 'OBTENUE',
  'account.risk-metrics.status.in-progress': 'EN COURS',
  'account.risk-metrics.not-set': 'Non défini',
  'account.risk-metrics.no-drawdown': 'Aucune limite de drawdown fixée',
  'account.risk-metrics.no-profit-target': 'Aucun objectif de profit fixé',
  'account.risk-metrics.label.used': 'Utilisée:',
  'account.risk-metrics.label.limit': 'Limite:',
  'account.risk-metrics.label.remaining': 'Restante:',
  'account.risk-metrics.label.progress': 'Progrès:',
  'account.risk-metrics.label.target': 'Cible:',
  'account.risk-metrics.label.target-date': 'Date cible :',
  'account.edit-event.title': 'Modifier {type}',
  'account.edit-event.field.type': 'Type de trade',
  'account.edit-event.field.type-desc':
    "Ne peut pas être modifié lors de l'édition",
  'account.edit-event.field.amount': 'Montant',
  'account.edit-event.field.amount-desc': 'Montant en {currency}',
  'account.edit-event.field.date': 'Date',
  'account.edit-event.field.date-desc': 'Date de trade',
  'account.edit-event.field.description': 'Description (Facultatif)',
  'account.edit-event.field.description-desc': 'Notes complémentaires',
  'account.edit-event.button.save': 'Enregistrer les modifications',
  'account.edit-event.button.saving': 'Économie...',
  'account.edit-event.button.delete': 'Supprimer {type}',
  'account.edit-event.button.deleting': 'Suppression...',
  'account.edit-event.success.update': '{type} a été mis à jour avec succès',
  'account.edit-event.success.delete': '{type} supprimé avec succès',
  'account.edit-event.error.update':
    'Erreur lors de la mise à jour du trade : {error}',
  'account.edit-event.error.delete':
    'Erreur lors de la suppression du trade : {error}',
  'account.edit-event.delete-confirm.title': 'Supprimer {type}',
  'account.edit-event.delete-confirm.message':
    'Êtes-vous sûr de vouloir supprimer ce {type} de {amount} de {date} ?',
  'account.edit-event.delete-confirm.warning':
    'Cette action ne peut pas être annulée.',
  'account.edit.title': 'Modifier le compte',
  'account.edit.field.name': 'Nom du compte',
  'account.edit.field.name-desc': 'Le nom unique de ce compte',
  'account.edit.placeholder.name': 'par exemple, Mon compte de trading',
  'account.edit.field.type': 'Type de compte',
  'account.edit.field.type-desc': 'Type de compte de trading',
  'account.edit.type.demo': 'Démo',
  'account.edit.type.evaluation': 'Évaluation',
  'account.edit.type.funded': 'Financé',
  'account.edit.field.initial-balance': 'Solde initial',
  'account.edit.field.initial-balance-desc': 'Solde initial du compte',
  'account.edit.field.live-balance': 'Solde en direct',
  'account.edit.field.live-balance-desc': 'Solde actuel du compte du broker',
  'account.edit.field.creation-date': 'Date de création',
  'account.edit.field.creation-date-desc': 'Quand le compte a été créé',
  'account.edit.field.currency': 'Devise',
  'account.edit.field.currency-desc': 'Devise native du compte à afficher',
  'account.edit.field.drawdown-type': 'Type de drawdown',
  'account.edit.field.drawdown-type-desc': 'Aucun |Fixe |Suivi EOD |Manuel',
  'account.edit.field.drawdown-amount': 'Montant du drawdown',
  'account.edit.field.drawdown-amount-desc':
    'Perte maximale autorisée à partir du solde de départ',
  'account.edit.field.manual-snapshots': 'Instantanés de retrait manuel',
  'account.edit.field.manual-snapshots-desc':
    'Gérer les instantanés de solde quotidien pour le calcul des drawdowns finaux EOD',
  'account.edit.field.profit-target-desc':
    'Définir un objectif de profit pour le compte',
  'account.copy-trading.title': 'Copie de trades',
  'account.copy-trading.description':
    'Dérive la performance de ce compte depuis un autre compte avec des périodes de copie historiques.',
  'account.copy-trading.enable': 'Ce compte copie un autre compte',
  'account.copy-trading.existing-trades-warning':
    'Ce compte contient déjà des trades directs. Ils resteront, et les trades copiés seront ajoutés depuis la date de début choisie.',
  'account.copy-trading.base-account': 'Compte de base',
  'account.copy-trading.base-account-desc':
    'Seuls les comptes non copiés avec la même devise peuvent être sélectionnés.',
  'account.copy-trading.base-account-placeholder':
    'Sélectionner le compte de base',
  'account.copy-trading.multiplier': 'Multiplicateur',
  'account.copy-trading.multiplier-desc': 'Plage autorisée : 0,1x à 100x',
  'account.copy-trading.all-history': 'Copier tous les trades historiques',
  'account.copy-trading.start-date': 'Copier depuis la date',
  'account.copy-trading.history': 'Historique de copie',
  'account.copy-trading.error.base-required':
    'Sélectionne un compte de base pour le copy trading.',
  'account.copy-trading.error.multiplier-range':
    'Le multiplicateur de copy trading doit être compris entre 0,1x et 100x.',
  'account.copy-trading.error.start-date-required':
    'Sélectionne une date de début du copy trading.',
  'account.edit.field.monthly-cost': 'Coût mensuel',
  'account.edit.field.monthly-cost-desc':
    "Frais d'abonnement, coûts de plateforme",
  'account.copy-trading.error.base-account-is-copied':
    'Ce compte est déjà utilisé comme compte de base et ne peut pas copier un autre compte.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'Ce compte sert actuellement de base à un autre compte copié.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'Les comptes de base ne peuvent pas aussi être des comptes de copie.',
  'account.edit.field.target-type': 'Type de cible',
  'account.edit.field.target-type-desc': 'Absolu ou pourcentage',
  'account.edit.field.target-percent': 'Cible (%)',
  'account.edit.field.target-dollar': 'Cible ($)',
  'account.edit.field.target-percent-desc': 'Objectif de gain en pourcentage',
  'account.edit.field.target-dollar-desc': 'Objectif de montant en dollars',
  'account.edit.field.target-date': 'Date cible (facultatif)',
  'account.edit.field.target-date-desc':
    "Date pour atteindre l'objectif de profit",
  'account.edit.button.show-snapshots':
    'Afficher Snapshot Manager ({count} enregistré)',
  'account.edit.button.hide-snapshots':
    "Masquer le gestionnaire d'instantanés ({count} enregistré)",
  'account.edit.delete-warning':
    'Il s’agit d’une action permanente qui ne peut être annulée !',
  'account.drawdown.none': 'Aucune',
  'account.drawdown.fixed': 'Fixe',
  'account.drawdown.eod-trailing': 'EOD en fuite',
  'account.drawdown.manual': 'Manuel',
  'account.profit-target.enable': "Activer l'objectif de profit",
  'account.profit-target.type.absolute': 'Montant absolu',
  'account.profit-target.type.percentage': 'Pourcentage',
  'account.create.button.creating': 'Création...',
  'account.create.button.create': 'Créer un compte',
  'account.edit.button.saving': 'Économie...',
  'account.edit.button.save': 'Enregistrer les modifications',
  'account.edit.button.delete': 'Supprimer le compte',
  'account.edit.button.delete-name': 'Supprimer "{name}"',
  'account.edit.modal.update-notes.title': 'Mettre à jour les notes liées ?',
  'account.edit.modal.update-notes.message':
    'Renommer mettra à jour toutes les notes faisant référence à « {oldName} » en « {newName} ». Ceci est nécessaire pour maintenir la cohérence des données.',
  'account.edit.modal.update-notes.yes': 'OK (notes de mise à jour)',
  'account.edit.modal.update-notes.no': "Conserver l'ancien nom",
  'account.edit.modal.update-notes.cancel': "Annuler l'action",
  'account.edit.modal.change-date.title': 'Modifier la date de création',
  'account.edit.modal.change-date.message':
    'Vous êtes sur le point de modifier la date de création du compte « {account} » de {oldDate} à {newDate}.',
  'account.edit.modal.change-date.warning':
    "Cela mettra à jour la date du trade de dépôt initiale et peut affecter les calculs de l'âge du compte, les cycles de facturation mensuels et d'autres mesures basées sur la date.",
  'account.edit.modal.change-date.info':
    'Cela mettra à jour la date de trade de dépôt initial pour correspondre à la nouvelle date de création.',
  'account.edit.modal.change-date.confirm':
    'Date de création de la mise à jour',
  'account.edit.modal.change-balance.title': 'Modifier le solde initial',
  'account.edit.modal.change-balance.message':
    'Vous êtes sur le point de modifier le solde initial de {oldBalance} à {newBalance}.',
  'account.edit.modal.change-balance.warning':
    'Vous êtes sur le point de modifier le solde initial de ce compte.',
  'account.edit.modal.change-balance.info':
    "Cela affectera tous les calculs de solde, les pourcentages de P&L, les calculs de drawdown et l'historique des trades.",
  'account.edit.modal.change-balance.info2':
    'Le solde actuel sera recalculé sur la base du nouveau solde initial plus tous les P&L de trading.',
  'account.edit.modal.change-balance.info3':
    "Ce changement peut avoir un impact significatif sur les statistiques du compte et l'exactitude des données historiques.",
  'account.edit.modal.change-balance.confirm': 'Mettre à jour le solde initial',
  'account.edit.modal.delete.title': 'Supprimer le compte',
  'account.edit.modal.delete.question':
    'Êtes-vous sûr de vouloir supprimer définitivement le compte « {name} » ?',
  'account.edit.modal.delete.warning':
    'Êtes-vous sûr de vouloir supprimer définitivement ce compte ?',
  'account.edit.modal.delete.will': 'Cette action va :',
  'account.edit.modal.delete.item1':
    'Supprimer toutes les métadonnées et paramètres du compte',
  'account.edit.modal.delete.item2':
    'Supprimer les références de compte de tous les trades liés',
  'account.edit.modal.delete.item3':
    'Supprimer les balises de compte générées automatiquement des notes',
  'common.note-label': 'Note:',
  'common.warning-label': 'Avertissement:',
  'common.tip-label': 'Conseil:',
  'common.backups-label': 'Sauvegardes :',
  'account.edit.error.name-required': 'Le nom du compte est requis',
  'account.edit.error.name-exists': 'Le compte "{name}" existe déjà',
  'account.edit.error.creation-date-required':
    'La date de création est requise',
  'account.edit.error.balance-required':
    'Le solde initial ne peut pas être négatif',
  'account.edit.error.invalid-live-balance':
    "Le solde en direct n'est pas valide",
  'account.edit.error.drawdown-required':
    'Le montant du drawdown doit être supérieur à 0',
  'account.edit.error.future-date':
    'La date de création ne peut pas être postérieure',
  'account.edit.error.update-failed':
    'Erreur lors de la mise à jour du compte : {error}',
  'account.edit.error.service-unavailable':
    "Le service de compte n'est pas disponible",
  'account.edit.error.delete-failed':
    'Erreur lors de la suppression du compte : {error}',
  'account.edit.success.updated': 'Compte "{name}" mis à jour avec succès',
  'account.edit.success.updated-with-references':
    'Compte mis à jour de « {oldName} » à « {newName} » et toutes les références de notes mises à jour',
  'account.edit.success.deleted': 'Compte "{name}" supprimé avec succès',
  'button.next': 'Suivante',
  'button.discard': 'Jeter',
  'guide.scroll-to-target.title': 'Faites défiler pour continuer le guide',
  'guide.scroll-to-target.description':
    'La prochaine étape est hors écran. Faites défiler pour continuer ou laissez Journalit vous y emmener.',
  'guide.scroll-to-target.description-up':
    "L'étape suivante est plus haut sur la page. Faites défiler vers le haut pour continuer ou laissez Journalit vous y emmener.",
  'guide.scroll-to-target.description-down':
    "L'étape suivante se trouve plus bas sur la page. Faites défiler vers le bas pour continuer, ou laissez Journalit vous y emmener.",
  'guide.scroll-to-target.button': 'Montre !',
  'templateEditor.loading': 'Chargement du layout...  ',
  'templateEditor.mode.preview': 'Aperçu',
  'templateEditor.mode.editor': 'Modification',
  'templateEditor.built-in-badge': '(en dur)',
  'templateEditor.built-in-notice':
    'Les modèles intégrés ne peuvent pas être modifiés. Dupliquez ce modèle ou créez-en un nouveau à personnaliser.',
  'templateEditor.unsaved-changes': 'Modifications non enregistrées',
  'templateEditor.field.template-name': 'Nom du layout',
  'templateEditor.field.widgets': 'Widgets ({count})',
  'templateEditor.button.add-widget': 'Ajouter un widget',
  'templateEditor.button.widget-library-docs': 'Bibliothèque de widgets',
  'templateEditor.widget.locked': 'Verrouillé',
  'templateEditor.widget.select-placeholder': 'Sélectionnez un widget',
  'templateEditor.widget.header-text-placeholder': 'En-tête du texte',
  'templateEditor.widget.markdown-zone-text-label': 'Texte préréglé',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'Texte à insérer dans les nouvelles notes de revue...',
  'templateEditor.widget.page-size': 'Taille de la page:',
  'templateEditor.widget.show-rating-column': 'Afficher la colonne de notation',
  'templateEditor.widget.demon-tracker.count-mode': 'Mode de comptage :',
  'templateEditor.widget.demon-tracker.count-mode.per-trade': 'Qté par trade',
  'templateEditor.widget.demon-tracker.count-mode.per-trading-day':
    'Jour du trade',
  'templateEditor.widget.demon-tracker.source-mode': 'Mode source :',
  'templateEditor.widget.demon-tracker.source-mode.trades':
    'Négociations uniquement',
  'templateEditor.widget.demon-tracker.source-mode.session':
    'Erreurs de session uniquement',
  'templateEditor.widget.demon-tracker.source-mode.combined':
    'Combiné (trades + session)',
  'notice.error.template-save-failed': 'Impossible de sauvegarder le layout',
  'builder.sidebar.title': 'Configurateur de page',
  'builder.sidebar.section.trade': 'Trade',
  'builder.sidebar.section.drc': 'DRC',
  'builder.sidebar.section.weekly': 'Hebdomadaire',
  'builder.sidebar.section.monthly': 'Mensuellement',
  'builder.sidebar.section.quarterly': 'Trimestriellement',
  'builder.sidebar.section.yearly': 'Annuel',
  'builder.sidebar.section.library': 'Bibliothèque',
  'builder.sidebar.new-item': 'Nouveau titre {title}',
  'builder.sidebar.coming-soon': 'Disponible prochainement',
  'builder.sidebar.built-in': 'Encastrement',
  'builder.sidebar.default-template': 'Layout par défaut',
  'builder.sidebar.set-as-default': 'Définir par défaut',
  'builder.sidebar.duplicate': 'DUPLIQUER<br>',
  'builder.sidebar.delete': 'Effacer',
  'builder.sidebar.no-templates': 'Pas encore de layouts',
  'builder.sidebar.share-template': 'Partagez votre layout',
  'builder.sidebar.new-template-name': 'Nouveau layout {type}',
  'builder.sidebar.copy-suffix': '(Copie)',
  'notice.default-trade-template-updated':
    'Modèle de trade par défaut mis à jour',
  'notice.trade-template-duplicated': 'Layout de trade dupliqué',
  'notice.trade-template-deleted': 'Layout de trade supprimé',
  'notice.error.create-template': 'Echec de la création du layout',
  'notice.error.duplicate-template': 'Impossible de dupliquer le layout',
  'notice.error.delete-template': 'Échec de la suppression du layout',
  'account.weight-legend.aria-label':
    'Légende de distribution du type de compte',
  'account.weight-legend.item-aria-label': '{name} : {percent}',
  'account.transaction.deposit': 'Dépôt',
  'account.transaction.withdrawal': 'Retrait',
  'account.transaction.click-to-edit':
    'Cliquez pour modifier ou supprimer cette transaction',
  'account.transaction.description': 'Description',
  'account.transaction.balance-after': 'Solde après',
  'account.deposits-withdrawals.title': 'Dépôts et retraits ({count})',
  'account.deposits-withdrawals.empty':
    'Aucun dépôt ou retrait manuel enregistré.',
  'account.deposits-withdrawals.empty-sub':
    "Cliquez sur le bouton + dans l'en-tête pour ajouter votre première trade.",
  'settings.reset.modal.title': 'Réinitialiser TOUS les réglages?',
  'settings.reset.modal.explanation':
    'Cela réinitialisera TOUS LES paramètres du plugin à leurs valeurs par défaut. Cela inclut :',
  'settings.reset.modal.item-custom-options':
    'Toutes les options personnalisées (tickers, setups, erreurs)',
  'settings.reset.modal.item-account-settings':
    'Paramètres et métadonnées du compte',
  'settings.reset.modal.item-dashboard-layouts':
    'Dispositions du tableau de bord',
  'settings.reset.modal.item-symbol-mappings': 'Mappages de symboles',
  'settings.reset.modal.item-csv-templates': 'Modèles Trade Import',
  'settings.reset.modal.item-other': 'Autres personnalisations',
  'settings.reset.modal.backup-note':
    'Une sauvegarde sera créée avant la réinitialisation.',
  'settings.reset.modal.warning':
    'Cette action ne peut pas être annulée (sauf en restaurant à partir de la sauvegarde).',
  'settings.reset.backup-failed.title': 'La sauvegarde a échoué',
  'settings.reset.backup-failed.message':
    'Impossible de créer une sauvegarde de vos paramètres actuels.',
  'settings.reset.backup-failed.warning':
    'Si vous procédez à la réinitialisation, vous ne pourrez pas restaurer vos paramètres actuels.',
  'notice.settings-reset-with-backup':
    'Les paramètres sont réinitialisés aux valeurs par défaut. Une sauvegarde a été créée. Redémarrez Obsidian pour appliquer toutes les modifications.',
  'notice.settings-reset-no-backup':
    "Les paramètres sont réinitialisés aux valeurs par défaut. Aucune sauvegarde n'a été créée. Redémarrez Obsidian pour appliquer toutes les modifications.",
  'home.quick-links.hide': 'Masquer le lien rapide ...',
  'home.quick-links.all-hidden':
    'Tous les liens rapides sont masqués. Utilisez « Ajouter un widget » pour les restaurer.',
  'home.quick-links.add-trade': 'Ajouter un trade',
  'home.quick-links.trade-log': "Journal d'Echange",
  'home.quick-links.trading-dashboard': 'Tableau de bord des opérations',
  'home.quick-links.account-dashboard': 'Tableau de bord du compte',
  'home.quick-links.todays-drc': "La DRC d'aujourd' hui",
  'home.quick-links.weekly-review': 'Bilan de cette semaine',
  'home.quick-links.monthly-review': 'Bilan de ce mois',
  'home.quick-links.quick-import': 'Import rapide',
  'home.quick-links.csv-import': 'Importation de trades',
  'home.quick-links.layout-builder': 'Configurateur de page',
  'home.quick-links.move-above':
    'Déplacer les liens rapides au-dessus des widgets',
  'home.quick-links.move-below': 'Déplacer les liens rapides sous les widgets',
  'home.widget-selector.title': "AJOUTER À L'ACCUEIL",
  'home.widget-selector.section.widgets': 'Widgets ',
  'home.widget-selector.section.quick-links': 'Liens rapides cachés',
  'home.widget-selector.restore': 'restaurer',
  'home.widget-selector.empty': 'Tous les widgets ont été ajoutés',
  'home.widget-selector.hint.navigate': 'Naviguer',
  'home.widget-selector.hint.select': 'SÉLECTIONNER',
  'home.widget-selector.hint.close': 'ESC : Fermer',
  'home.period.month': 'Ce mois',
  'home.period.quarter': 'Ce trimestre',
  'home.period.year': 'Cette année',
  'home.period.lifetime': 'A vie',
  'home.aria.filter-period': 'Période de filtrage',
  'home.aria.filter-trade-types': 'Filtrer les types de trades',
  'home.aria.add-widget': 'Ajouter un widget',
  'home.aria.save-layout': 'Enregistrer le modèle',
  'home.aria.customize': 'Personnaliser',
  'home.button.add-widget': 'Ajouter un widget',
  'home.trade-types.all': 'Classiques + backtest',
  'home.greeting.welcome': 'Bienvenue sur Journalit !',
  'home.greeting.hey': 'Bonjour',
  'home.greeting.nightowl': 'Bonsoir, oiseau de nuit',
  'home.greeting.still-up': 'toujours debout ?',
  'home.greeting.late-night': 'séance de fin de soirée ?',
  'home.greeting.midnight-oil': 'Peiner toute la nuit...',
  'home.greeting.good-morning': 'Bonjour',
  'home.greeting.rise-and-shine': 'Tout le monde debout !',
  'home.greeting.morning-trader': 'Trader du matin',
  'home.greeting.ready-conquer': 'prêt à conquérir la journée ?',
  'home.greeting.fresh-start': 'Nouveau départ',
  'home.greeting.good-afternoon': 'Bonjour',
  'home.greeting.day-going-well': "J'espère que votre journée se passe bien",
  'home.greeting.afternoon-checkin': "Arrivée l'après-midi",
  'home.greeting.midday-momentum': 'Motivation de midi',
  'home.greeting.hows-it-going':
    'comment ça va?/comment ça se passe?/ comment la vivez-vous ?/quoi de neuf ?/ça va?',
  'home.greeting.good-evening': 'Bonsoir',
  'home.greeting.winding-down': 'En mode détente',
  'home.greeting.evening-review': 'Bilan du soir',
  'home.greeting.how-did-today-go': "comment ça s'est passé aujourd'hui ?",
  'home.greeting.time-to-reflect': 'Place à la réflexion',
  'home.greeting.welcome-back': 'Heureux de vous revoir',
  'home.greeting.hey-there': 'Salut',
  'home.greeting.good-to-see-you': 'Content de te voir.',
  'home.subtitle.first-time': 'Commençons par votre parcours de trading',
  'home.subtitle.see-how-doing': 'Voyons comment vous allez',
  'home.subtitle.elevate-trading': "Il est temps d'améliorer votre trading",
  'home.subtitle.journey-continues': 'Votre parcours de trading se poursuit',
  'home.subtitle.check-progress': 'Vérifions vos progrès',
  'home.subtitle.ready-elevate': 'Prêt à améliorer votre trading ?',
  'home.subtitle.agenda-today': "Alors, quel est le programme aujourd'hui ?",
  'home.subtitle.trading-going': 'Comment se passe votre trading ?',
  'home.grid.error.title': 'Erreur de mise en page !',
  'home.grid.error.message': 'Erreur : {error}',
  'home.grid.error.retry': 'Réessayer',
  'home.grid.widget.remove-aria': 'Supprimer le widget',
  'home.grid.widget.unknown-type': 'Type de widget inconnu : {widgetId}',
  'home.widget.unreviewed.all-reviewed': 'Tous les trades sont revus',
  'home.widget.unreviewed.title-review':
    'Ouvrir le journal des trades à revoir',
  'home.widget.unreviewed.need-review.one': '{count} trade à revoir',
  'home.widget.unreviewed.need-review.few': '{count} trades à revoir',
  'home.widget.unreviewed.need-review.many': '{count} trades à revoir',
  'home.widget.unreviewed.need-review.other': '{count} trades à revoir',
  'home.widget.unreviewed.today': "{count} aujourd'hui",
  'home.widget.unreviewed.this-week': '{count} cette semaine',
  'home.widget.embedded-note.title': 'Note intégrée',
  'home.widget.embedded-note.select-note': 'Sélectionner une remarque',
  'home.widget.embedded-note.search-placeholder': 'recherche de blog',
  'home.widget.embedded-note.no-notes': 'Aucune Note trouvée',
  'home.widget.embedded-note.select-different': 'Sélectionner le différent',
  'home.widget.embedded-note.open-note': 'Cliquer pour ouvrir',
  'home.widget.embedded-note.change-note': 'Changer de note',
  'home.widget.embedded-note.error.not-found': 'Fichier introuvable : {path}',
  'home.widget.embedded-note.error.load-failed':
    'Échec du chargement du contenu de la note',
  'home.widget.embedded-note.error.deleted': 'Le fichier source a été supprimé',
  'home.widget.goals-progress.type.pnl': 'Objectif de P&L',
  'home.widget.goals-progress.type.pnl-desc':
    'Objectif de profit/perte pour une période',
  'home.widget.goals-progress.type.trades-logged': 'Nombre de trades',
  'home.widget.goals-progress.type.trades-logged-desc':
    'Nombre de trades à vie',
  'home.widget.goals-progress.type.win-rate': 'Taux de gain',
  'home.widget.goals-progress.type.win-rate-desc':
    'Objectif de pourcentage de victoires',
  'home.widget.goals-progress.period.daily': 'Tous les jours',
  'home.widget.goals-progress.period.weekly': 'Hebdomadaire',
  'home.widget.goals-progress.period.monthly': 'Mensuellement',
  'home.widget.goals-progress.period-label.today': "aujourd'hui",
  'home.widget.goals-progress.period-label.this-week': 'cette semaine',
  'home.widget.goals-progress.period-label.this-month': 'ce mois',
  'home.widget.goals-progress.period-label.total': 'total',
  'home.widget.goals-progress.trades-count': '{count} trades',
  'home.widget.goals-progress.set-goal': 'Fixer un objectif',
  'home.widget.goals-progress.target': 'Cibles',
  'home.widget.goals-progress.tracks-lifetime':
    'Suivi du total de la durée de vie',
  'home.widget.goals-progress.use-r-multiples': 'Utiliser des R-multiples',
  'home.widget.goals-progress.account-aware': 'Objectifs par compte',
  'home.widget.goals-progress.no-target-selected':
    'Aucun objectif pour le compte sélectionné',
  'home.widget.goals-progress.configured-for': 'Configuré pour {accounts}',
  'home.widget.goals-progress.account-scope': 'Portée du compte',
  'home.widget.goals-progress.add-account': 'Ajouter un compte',
  'home.widget.goals-progress.click-to-set': 'Cliquez pour définir un objectif',
  'home.widget.goals-progress.header.pnl': 'Objectif de P&L',
  'home.widget.goals-progress.header.trades': 'Objectif des trades',
  'home.widget.goals-progress.header.win-rate': 'Objectif de taux de réussite',
  'home.widget.goals-progress.of-target': 'de {target} {period}',
  'home.widget.goals-progress.complete-100': 'Finalisées à 100%',
  'home.widget.goals-progress.complete-percent':
    'POURCENTAGE COMPLÉTÉ {percent}',
  'home.widget.goals-progress.goal-reached': 'But atteint!',
  'home.widget.goals-progress.aria.save-goal': "Enregistrer l'objectif",
  'home.widget.goals-progress.aria.set-goal': 'Fixez-vous un objectif',
  'home.widget.goals-progress.aria.change-goal': 'Cliquer pour modifier',
  'home.widget.best-hours.title': 'Meilleures heures',
  'home.widget.best-hours.no-data': 'Pas de trade',
  'home.widget.best-hours.period-aria':
    '{label} : {pnl} P&L moyen par trade, {count} trades',
  'home.widget.best-hours.trades-count': '{count} trades',
  'home.widget.best-hours.win-rate': 'Gain de {rate}%',
  'home.widget.best-hours.win-rate-na': 'Taux de réussite indisponible',
  'home.widget.best-hours.days-count': '{count} jours',
  'home.widget.best-hours.avg-per-trade': 'moy./trade',
  'home.widget.best-hours.strongest-entry-window': 'Meilleur créneau d’entrée',
  'home.widget.best-hours.avg-summary': '{trades} trades · {days} jours',
  'home.widget.best-hours.hidden': 'Masqué',
  'home.widget.best-hours.hidden-detail': 'Mode confidentialité',
  'home.widget.best-hours.no-positive-window': 'Aucun créneau positif',
  'home.widget.best-hours.insufficient-history': 'Données insuffisantes',
  'home.widget.best-hours.sample-requirement':
    '{count}/2 créneaux échantillonnés',
  'home.widget.best-hours.developing': 'en cours',
  'home.widget.best-hours.no-positive-detail':
    'Les créneaux échantillonnés sont négatifs',
  'home.widget.best-hours.period-hidden-aria': 'Performance par heure masquée',
  'home.widget.aum.title': 'Actifs sous gestion',
  'home.widget.aum.period.month': 'Ce mois',
  'home.widget.aum.period.quarter': 'Ce trimestre',
  'home.widget.aum.period.year': 'Cette année',
  'home.widget.aum.period.all': 'Tout le temps',
  'home.widget.aum.unable-to-load': 'Il est impossible de charger le fichier.',
  'home.widget.aum.no-accounts': 'Aucun compte',
  'home.widget.aum.account-count': '{count} compte',
  'home.widget.aum.account-count-plural': '{count} comptes',
  'home.widget.streak.title': 'Série',
  'home.widget.streak.period.month': 'ce mois',
  'home.widget.streak.period.quarter': 'ce trimestre',
  'home.widget.streak.period.year': 'cette année',
  'home.widget.streak.period.ever': 'déjà',
  'home.widget.streak.win': 'victoire',
  'home.widget.streak.wins': 'victoires',
  'home.widget.streak.loss': 'défaite',
  'home.widget.streak.losses': 'Moins-values',
  'home.widget.streak.in-a-row': 'en rang, aligné, en ligne',
  'home.widget.streak.no-active': 'pas de strie active',
  'home.widget.streak.start-trading': 'commencer à trader pour créer une série',
  'home.widget.streak.best-streak': 'votre meilleure série {period}',
  'home.widget.streak.above-average': 'au-dessus de votre moyenne {period}',
  'home.widget.streak.stay-focused': 'restez concentré, continuez',
  'home.widget.streak.keep-going': 'Continuez !',
  'home.widget.streak.good-start': 'bon départ!',
  'home.widget.streak.pause': 'pause avant votre prochaine trade',
  'home.widget.streak.review': 'revue avant la prochaine trade',
  'home.widget.streak.losses-process': 'les pertes font partie du processus',
  'home.widget.streak.best': 'meilleur',
  'home.widget.streak.avg': 'moyenne',
  'home.widget.drawdown.title': 'Limite de drawdown',
  'home.widget.drawdown.breached': 'Violée',
  'home.widget.drawdown.remaining': 'restant(s).',
  'home.widget.drawdown.unable-to-load':
    'Il est impossible de charger le fichier.',
  'home.widget.drawdown.no-accounts': 'Aucun compte avec des limites',

  'home.widget.profit-target.title': 'Objectif de profit',
  'home.widget.profit-target.achieved': 'Atteint',
  'home.widget.profit-target.remaining': 'restant',
  'home.widget.profit-target.unable-to-load': 'Impossible de charger',
  'home.widget.profit-target.no-accounts': 'Aucun compte avec objectifs',
  'home.widget.recent.title': 'Récent',
  'home.widget.recent.unknown': 'Inconnu',
  'home.widget.recent.just-now': "A l'instant",
  'home.widget.recent.minutes-ago': 'il y a {minutes}m',
  'home.widget.recent.hours-ago': 'il y a {hours} h',
  'home.widget.recent.days-ago': 'Il y a {days}j',
  'home.widget.recent.no-items': 'Aucun article récent',
  'home.widget.recent.hint':
    'Ouvrez des fichiers ou des vues pour les voir ici',
  'home.widget.top-breakdown.title': 'Top {dimension}',
  'home.widget.top-breakdown.configure-title':
    'Personnaliser le top {dimension}',
  'home.widget.top-breakdown.aria.customize':
    'Cliquez pour personnaliser le Top {dimension}',
  'home.widget.setups.title': 'Meilleures configurations',
  'home.widget.setups.no-data': 'Aucun setup enregistrée pour le moment',
  'home.widget.setups.trades-count': '{count} trades',
  'home.widget.setups.win-rate': '{rate}% de taux de réussite',
  'home.widget.weekly.title': 'Cette semaine',
  'home.widget.weekly.no-trades': 'pas encore de trades cette semaine',
  'home.widget.weekly.losing-days': "{count} jours perdus d'affilée",
  'home.widget.weekly.winning-days': '{count} jours consécutifs gagnants',
  'home.widget.weekly.above-average': 'au-dessus de votre moyenne hebdomadaire',
  'home.widget.weekly.below-average':
    'en dessous de votre moyenne hebdomadaire',
  'home.widget.weekly.better-than-last': 'mieux que la semaine dernière',
  'home.widget.weekly.slower-than-last': 'plus lent que la semaine dernière',
  'home.widget.weekly.on-track': 'en bonne voie cette semaine',
  'home.widget.weekly.room-to-recover': 'guérir, se rétablir',
  'home.widget.weekly.solid-start': 'solide début de semaine',
  'home.widget.weekly.early-in-week': 'The new begi...',
  'home.widget.weekly.no-trade-data': 'Pas de trade',
  'home.widget.weekly.trade': 'trade',
  'home.widget.weekly.trades': 'batiment',
  'home.widget.weekly.no-trades-tooltip': 'Pas encore de trades',
  'home.widget.heatmap.last-3-months': 'Les 3 derniers mois',
  'home.widget.heatmap.last-6-months': '6 derniers mois',
  'home.widget.heatmap.year-activity': 'Activité {year}',
  'home.widget.heatmap.select-year': 'Sélectionner l’année ',
  'home.widget.heatmap.close-selector': "Sélecteur d'année de fermeture",
  'calendar.weekday.mon': 'Lun.',
  'calendar.weekday.tue': 'Mar.',
  'calendar.weekday.wed': 'Mer.',
  'calendar.weekday.thu': 'Jeu.',
  'calendar.weekday.fri': 'Ven.',
  'calendar.weekday.sat': 'Sam.',
  'calendar.weekday.sun': 'Dim.',
  'calendar.pnl': 'P&L',
  'calendar.week': 'semaine',
  'calendar.trade': '{count} trades',
  'calendar.trades': '{count} trades',
  'calendar.month.january': 'Janvier',
  'calendar.month.february': 'Février',
  'calendar.month.march': 'Mars',
  'calendar.month.april': 'AvriI',
  'calendar.month.june': 'Juin',
  'calendar.month.july': 'juiIIet',
  'calendar.month.august': 'Aout',
  'calendar.month.september': 'Septembre',
  'calendar.month.october': 'Octobre',
  'calendar.month.november': 'Novembre',
  'calendar.month.december': 'décembre',
  'trade.loading-navigation': 'Navigation chargement',
  'shared.collapsible.active-filters': '{count} filtres actifs',
  'filter.modal.title': 'Règles avancées',
  'filter.modal.active-filters': 'Filtres actifs ({count}) :',
  'filter.modal.no-active-filters': 'Aucun filtre actif',
  'filter.modal.clear-all': 'Effacer tout',
  'filter.modal.section.trading-data': 'Données de trading',
  'filter.modal.section.classification': 'Classification',
  'filter.modal.section.trade-criteria': 'Critères du trade équitable',
  'filter.modal.no-setup': 'Aucune préparation',
  'filter.modal.no-tags': 'Aucun mot-clé',
  'filter.modal.no-mistakes': 'sans erreur!',
  'filter.modal.type.regular': 'Classique',
  'filter.modal.type.missed': 'Manqué',
  'filter.modal.type.backtest': 'Backtesting',
  'filter.summary.regular-trades': 'Trades réguliers',
  'filter.modal.status.win': 'Victoire',
  'filter.modal.status.loss': 'Perte',
  'filter.modal.status.breakeven': 'Point Mort',
  'filter.modal.status.open': 'Ouvert',
  'filter.modal.status.closed': 'Fermé',
  'filter.modal.review-status': 'Statut de revue',
  'filter.modal.review-status.reviewed': 'Revu',
  'filter.modal.review-status.unreviewed': 'Non revu',
  'filter.modal.direction.long-call': 'Achat/Call',
  'filter.modal.direction.short-put': 'Vente/Put',
  'filter.modal.section.custom-fields': 'Champs personnalisés',
  'filter.modal.custom-field.n-selected': '{count} sélectionné',
  'filter.modal.custom-field.none-available': 'Pas de valeurs disponibles',
  'widget.checklist.title': 'Liste de contrôle pré-trading',
  'widget.checklist.tooltip.day-only':
    "Les articles ajoutés ici ne s'appliquent qu'à ce jour.",
  'widget.checklist.tooltip.settings-link':
    'Pour les éléments récurrents sur tous les nouveaux DRC, accédez à Paramètres > Revue.',
  'widget.checklist.completed': 'terminé',
  'widget.checklist.edit-item': "Editer l'annonce",
  'widget.checklist.delete-item': "Supprimer l'élément",
  'widget.checklist.empty.preview':
    'Aucun élément de liste de contrôle configuré',
  'widget.checklist.empty.add-one':
    'Aucun élément de la liste de contrôle. Ajoutez-en un ci-dessous.',
  'widget.checklist.placeholder':
    'Ajouter un nouvel élément de liste de contrôle...',
  'widget.checklist.invalid-context':
    "Le widget Checklist nécessite une note DRC (type de frontmatter : 'drc')",
  'widget.session-mistakes.title': 'Erreurs de session',
  'widget.session-mistakes.subtitle':
    'Consignez les erreurs une fois pour la session au lieu de les répéter à chaque trade.',
  'widget.session-mistakes.field-label': 'Erreurs',
  'widget.session-mistakes.placeholder': 'Sélectionner ou créer des erreurs',
  'widget.session-mistakes.empty': 'Aucune erreur de session enregistrée',
  'widget.session-mistakes.count': '{count} sélectionné',
  'widget.session-mistakes.invalid-context':
    "Le widget d'erreurs de session nécessite une note DRC (type de première ligne : 'drc')",
  'widget.directional-pnl.title.long': 'P&L des trades longs',
  'widget.directional-pnl.title.short': 'P&L des trades shorts',
  'widget.directional-pnl.empty.not-enough':
    'Pas assez de trades pour l’analyse directionnelle',
  'widget.directional-pnl.empty.no-closed':
    'Aucun trade clôturé sur cette période',
  'widget.directional-pnl.empty.no-long': 'Aucun trade long sur cette période',
  'widget.directional-pnl.empty.no-short':
    'Aucun trade short sur cette période',
  'widget.directional-drawdown.title.long': 'Drawdown long réalisé',
  'widget.directional-drawdown.title.short': 'Drawdown short réalisé',
  'widget.directional-drawdown.empty.not-enough':
    "Pas assez de trades fermés pour l'analyse directionnelle",
  'widget.directional-drawdown.empty.no-closed':
    'Aucun trade directionnel clôturé pour cette période',
  'widget.directional-drawdown.empty.no-long':
    'Aucun trade long clôturé pour cette période',
  'widget.directional-drawdown.empty.no-short':
    'Aucun trade short clôturé pour cette période',
  'widget.missed-trades.title': 'Transactions manquées',
  'widget.missed-trades.add-button': 'Ajouter',
  'widget.missed-trades.add-aria': 'Ajouter un trade manqué',
  'widget.missed-trades.missed-badge': 'Manqué',
  'widget.missed-trades.additional-setups': 'Setups supplémentaires :',
  'widget.missed-trades.no-trades-today': "Aucun aujourd'hui",
  'widget.missed-trades.no-trades-week': 'Aucun trade manqué cette semaine',
  'widget.missed-trades.invalid-context':
    "Le widget Trades manqués n'est disponible qu'en DRC et dans les notes de revue hebdomadaire.",
  'widget.missed-trades.error-no-date':
    'Impossible de déterminer la date du nouveau trade manqué',
  'widget.missed-trades.error-open-form':
    "Échec de l'ouverture du formulaire de trade manqué",
  'widget.backtest-trades.empty':
    'Aucune opération de backtest pour cette période',
  'widget.trade-table.column.images': 'Images',
  'widget.trade-table.column.date': 'Jour',
  'widget.trade-table.column.entry': 'Entrée',
  'widget.trade-table.column.ticker': 'Symbole',
  'widget.trade-table.column.account': 'Compte',
  'widget.trade-table.column.pnl': 'P&L',
  'widget.trade-table.column.direction': 'Sens',
  'widget.trade-table.column.setups': 'Configurations',
  'widget.trade-table.column.mistakes': 'Erreurs',
  'widget.trade-table.empty': 'Aucun trade pour cette période',
  'widget.trade-table.status.open': 'OUVERT',
  'widget.trade-table.na': 'Sans objet',
  'widget.trade-table.unknown': 'Inconnu',
  'widget.trade-table.unknown-account': 'Compte inconnu',
  'widget.trade-table.image-alt': 'Aperçu du trade {id}',
  'widget.trade-table.fullscreen-title': 'Image {id} de trading',
  'widget.trade-table.fullscreen-alt': 'Image {index} du trade {id}',
  'widget.trade-table.duration.days-hours': '{days}j {hours}h',
  'widget.trade-table.duration.hours-mins': '{hours}h {mins}m',
  'widget.trade-table.duration.mins': '{mins}m',
  'widget.trade-table.pagination.showing':
    'Affichage de {start} à {end} trades sur {total}',
  'widget.trade-table.pagination.prev': ' Préc',
  'widget.trade-table.pagination.next': 'Suivant →',
  'widget.trade-table.pagination.page': '{current} sur {total}',
  'widget.pagination.showing': 'Affichage de {start}-{end} sur {total} {items}',
  'widget.pagination.prev': 'Précédent',
  'widget.pagination.next': 'Suivant',
  'widget.pagination.page': '{current} sur {total}',
  'widget.pagination.weeks': 'semaines',
  'widget.pagination.months': 'mois',
  'widget.empty.no-data': 'Aucune donnée disponible',
  'widget.empty.no-trades': 'Aucun trade pour cette période',
  'widget.empty.no-closed-trades': 'Aucun trade clôturé pour cette période',
  'widget.empty.no-daily-data': 'Aucune données pour la période',
  'widget.empty.no-weekly-data': 'Aucune données pour la période',
  'widget.empty.no-monthly-data': 'Aucune données pour la période',
  'widget.empty.no-quarterly-data': 'Aucune données pour la période',
  'widget.empty.no-setup-data':
    'Aucune donnée de setup disponible pour cette période',
  'widget.empty.no-mental-game-data':
    'Aucune donnée de mental disponible pour {period}',
  'widget.empty.no-technical-game-data':
    'Aucune donnée technique de jeu disponible pour {period}',
  'widget.invalid-context.title': 'Contexte non valable',
  'widget.invalid-context.default':
    'Ce widget {widgetType} nécessite une note de revue ou de trading',
  'widget.invalid-context.monthly-quarterly-yearly':
    "Ce widget n'est disponible que dans les revues mensuelles, trimestrielles et annuelles",
  'widget.invalid-context.quarterly-yearly':
    "Ce widget n'est disponible que dans les revues trimestrielles et annuelles",
  'widget.invalid-context.yearly-only':
    "Ce widget n'est disponible que dans les revues annuelles",
  'widget.invalid-context.monthly-only':
    "Ce widget n'est disponible que dans les revues mensuelles",
  'widget.invalid-context.weekly-monthly':
    "Ce widget n'est disponible que dans les revues hebdomadaires et mensuelles",
  'widget.invalid-context.review-note':
    'Ce widget nécessite une note de DRC, de revue hebdomadaire, de revue mensuelle, de revue trimestrielle ou de revue annuelle',
  'widget.key-levels.title': 'Niveaux Clés',
  'widget.key-levels.support': 'Support',
  'widget.key-levels.resistance': 'Résistance',
  'widget.key-levels.no-levels': 'Aucun niveau défini',
  'widget.key-levels.price-placeholder': 'Prix...',
  'widget.key-levels.select-importance': "Sélectionner l'importance",
  'widget.key-levels.remove-level': 'Retirer un niveau',
  'widget.key-levels.invalid-context':
    'Le widget Niveaux clés nécessite une note DRC, de revue hebdomadaire ou de revue mensuelle',
  'widget.key-levels.source.weekly': 'Hebdomadaire',
  'widget.key-levels.source.monthly': 'Mensuel',
  'widget.key-levels.open-source-review': 'Ouvrir la revue {label}',
  'widget.key-levels.importance.none': 'Aucune',
  'widget.key-levels.importance.high': 'Élevée',
  'widget.key-levels.importance.medium': 'Moyen',
  'widget.key-levels.importance.low': 'Faible',
  'manual-drawdown.notice.deleted': 'Instantané supprimé',
  'manual-drawdown.notice.updated': 'Instantané mis à jour',
  'manual-drawdown.notice.added': 'Instantané ajouté',
  'manual-drawdown.validation.date-required': 'La date est obligatoire',
  'manual-drawdown.validation.invalid-date': 'Veuillez saisir une date valide',
  'manual-drawdown.validation.future-date':
    "La date ne peut pas être à l'avenir",
  'manual-drawdown.validation.limit-required':
    'La limite de drawdown est requise',
  'manual-drawdown.validation.limit-positive':
    'La limite de drawdown doit être un nombre positif',
  'manual-drawdown.validation.duplicate-date':
    'Un instantané existe déjà pour cette date. Veuillez choisir une autre date ou modifier la date existante.',
  'manual-drawdown.section.recorded': 'Instantanés enregistrés',
  'manual-drawdown.table.date': 'Date',
  'manual-drawdown.table.limit': 'Limite de rabattement de 50 m',
  'manual-drawdown.table.note': 'Remarque',
  'manual-drawdown.table.actions': 'Actions',
  'manual-drawdown.button.editing': 'Modification',
  'manual-drawdown.button.edit': 'editer',
  'manual-drawdown.button.delete': 'Effacer',
  'manual-drawdown.header.edit': 'Modifier la capture instantanée',
  'manual-drawdown.header.add': 'Ajouter la nouvelle capture instantanée',
  'manual-drawdown.field.date': 'Date de Retrait :',
  'manual-drawdown.field.date-desc': 'Lorsque le broker a émis cette limite',
  'manual-drawdown.field.limit': 'Score minimum',
  'manual-drawdown.field.limit-desc': 'Solde le plus bas autorisé',
  'manual-drawdown.field.note': 'Note (facultative)',
  'manual-drawdown.field.note-desc':
    'Contexte supplémentaire pour cet instantané',
  'manual-drawdown.placeholder.note': 'par exemple, relevé de fin de mois',
  'manual-drawdown.button.update': "Mettre à jour l'instantané",
  'manual-drawdown.button.add': 'Ajouter SnapShot',
  'manual-drawdown.button.cancel-edit': 'Annulé',
  'manual-drawdown.modal.delete-title':
    'Supprimer cette capture d&amp;apos;écran ?',
  'manual-drawdown.modal.delete-confirm':
    "Supprimer l'instantané de drawdown du {date} ?",
  'manual-drawdown.modal.delete-limit': 'Limite de drawdown : {limit}',
  'manual-drawdown.modal.delete-warning':
    'Cette action ne peut pas être annulée.',
  'dashboard.selector.title': 'Ajouter au tableau de bord',
  'dashboard.selector.metrics': 'Métriques',
  'dashboard.selector.charts': 'Graphiques ',
  'dashboard.selector.empty':
    'Tous les indicateurs et graphiques ont été ajoutés',
  'dashboard.selector.hint.navigate': 'Naviguer',
  'dashboard.selector.hint.select': 'SÉLECTIONNER',
  'dashboard.selector.hint.close': 'ESC : Fermer',
  'dashboard.component-selector.title': 'Ajouter un widget',
  'dashboard.component-selector.added': 'Ajouté',
  'dashboard.component-selector.category.performance': 'Performance',
  'dashboard.component-selector.category.analysis': 'Analyses',
  'dashboard.component-selector.category.journal': 'Journal',
  'widget.pnlChart.name': 'P&L cumulé',
  'widget.pnlChart.description':
    'Graphique linéaire du P&L cumulé dans le temps',
  'widget.longPnLChart.name': 'P&L Long',
  'widget.longPnLChart.description':
    'Courbe du P&L cumulé pour les trades longs clôturés uniquement',
  'widget.shortPnLChart.name': 'P&L Short',
  'widget.shortPnLChart.description':
    'Courbe du P&L cumulé pour les trades shorts clôturés uniquement',
  'widget.performanceCalendar.name': 'Calendrier de performance',
  'widget.performanceCalendar.description':
    'Vue calendrier montrant les performances quotidiennes',
  'widget.dailyPerformance.name': 'Performances quotidiennes',
  'widget.dailyPerformance.description':
    'Graphique à barres montrant le P&L pour chaque jour de bourse',
  'widget.tradesChart.name': 'Graphique des trades',
  'widget.tradesChart.description':
    'Graphique à barres montrant le P&L pour chaque trade individuelle',
  'widget.weekdayPerformance.name': 'Performance en semaine',
  'widget.weekdayPerformance.description':
    'Diagramme à barres montrant les performances pour chaque jour de la semaine',
  'widget.hourlyPerformance.name': 'Performance horaire',
  'widget.hourlyPerformance.description':
    'Histogramme montrant le P&L pour chaque heure de la journée',
  'widget.tradesChart.limit': '{count} trades',
  'widget.drawdownChart.name': 'Retrait Chart',
  'widget.drawdownChart.description':
    'Montant du drawdown des trades clôturés depuis le précédent pic de P&L réalisé',
  'widget.directionalDrawdownChart.name': 'Drawdown réalisé par direction',
  'widget.directionalDrawdownChart.description':
    'Affiche des courbes séparées de montant de drawdown des trades clôturés long et short',
  'widget.longDrawdownChart.name': 'Drawdown long réalisé',
  'widget.longDrawdownChart.description':
    'Affiche la courbe du montant de drawdown des trades long clôturés',
  'widget.shortDrawdownChart.name': 'Drawdown short réalisé',
  'widget.shortDrawdownChart.description':
    'Affiche la courbe du montant de drawdown des trades short clôturés',
  'widget.drawdownStats.name': 'Stats de drawdown réalisé',
  'widget.drawdownStats.description':
    'Statistiques de drawdown réalisé et de récupération',
  'widget.drawdownStats.no-conversion':
    'Les statistiques de drawdown ne sont pas disponibles pour les devises mixtes sans conversion de devises.',
  'widget.recentTrades.name': 'Trades récents',
  'widget.recentTrades.description':
    'Affiche les 10 trades les plus récentes avec des détails',
  'widget.recentTrades.date': 'Date',
  'widget.recentTrades.ticker': 'Symbole',
  'widget.recentTrades.direction': 'Sens',
  'widget.recentTrades.pnl': 'P&L',
  'widget.recentTrades.no-trades': 'Aucun trade trouvé',
  'widget.recentTrades.empty-submessage':
    'Essayez de sélectionner une autre plage de dates',
  'widget.recentTrades.unknown': 'Inconnu',
  'widget.rollingWinRate.name': 'Taux de réussite glissant',
  'widget.rollingWinRate.description':
    'Affiche le rapport entre les gains moyens et les pertes moyennes sur une période glissante',
  'widget.rollingStats.name': 'Gain/perte moyen continu (e)',
  'widget.rollingStats.description':
    'Affiche la moyenne des victoires et des défaites sur une période glissante',
  'forecast.chart-title': 'Titre, diagramme {title}',
  'forecast.upload-label': 'Télécharger le graphique {title}',
  'forecast.upload-label-plural': 'Télécharger les graphiques {title}',
  'forecast.alt-text': '{title} Prévisions',
  'forecast.description': '{title} Prévisions',
  'forecast.notes-placeholder': 'Ajoutez vos {title} notes ici...',
  'filter.chip.remove-aria': 'Supprimer le filtre {label}',
  'shared.filter.disabled-preview': "Filtres désactivés dans l'aperçu",
  'shared.filter.open': 'Ouvrir les filtres',
  'shared.filter.active-count': '{count} filtres actifs',
  'ui.toggle-switch.aria-label': 'Interrupteur à bascule',
  'ui.folder-browser.placeholder': 'Sélectionner un dossier…',
  'ui.folder-browser.root': 'Racine',
  'ui.folder-browser.clear-aria':
    "Effacer pour utiliser l'emplacement par défaut",
  'icon-select.default-title': 'Sélectionner une option',
  'combobox.placeholder.default': 'Sélectionnez ou tapez...',
  'combobox.aria.remove-item': 'Enlever cette œuvre {item}',
  'combobox.add-option': 'Valeur ajoutée {value}',
  'error.render-component': 'Erreur de rendu {component} : {error}',
  'error.session-expired':
    'Votre session a expiré. Veuillez vous reconnecter dans les paramètres du plugin.',
  'error.ftp-not-found':
    'Compte FTP introuvable. Le système en créera automatiquement un pour vous.',
  'error.no-trading-data':
    'Aucune donnée de trading trouvée. Veuillez vous assurer que votre compte MetaTrader est correctement connecté et possède un historique des trades.',
  'error.unable-connect-service':
    'Impossible de se connecter au service de données de trading. Veuillez vérifier votre connexion Internet.',
  'error.invalid-verification-code':
    'Code de vérification non valide. Veuillez vérifier le code et réessayer.',
  'error.invalid-registration-data':
    "Données d'enregistrement non valides. Veuillez vérifier vos paramètres et réessayer.",
  'error.invalid-request':
    'Demande non valide. Veuillez vérifier votre saisie et réessayer.',
  'error.access-denied':
    "Accès refusé. Veuillez vérifier les autorisations de votre compte ou contacter l'assistance.",
  'error.too-many-requests':
    'Veuillez attendre un moment avant d’essayer à nouveau.',
  'error.service-unavailable':
    'Le service de données de trading est temporairement indisponible. Veuillez réessayer dans quelques minutes.',
  'error.server-error':
    "Une erreur de serveur s'est produite. Veuillez réessayer plus tard ou contacter le support si le problème persiste.",
  'error.network-error':
    'Impossible de se connecter au service de données de trading. Veuillez vérifier votre connexion Internet et réessayer.',
  'error.unknown': "Une erreur inconnue s'est produite",
  'error.unexpected':
    "Une erreur inattendue s'est produite. Veuillez réessayer ou contacter l'assistance si le problème persiste.",
  'error.settings.invalid-pattern':
    'Modèle de validation non valide. Veuillez vérifier votre expression régulière et réessayer.',
  'error.settings.field-name-conflict':
    'Ce nom de champ est en conflit avec un champ existant. Veuillez choisir un autre nom.',
  'error.settings.invalid-field-name':
    'Nom de champ non valide. Les noms de champ ne peuvent contenir que des lettres, des chiffres et des traits de soulignement.',
  'error.settings.save-failed':
    "Impossible d'enregistrer vos modifications. Veuillez vérifier vos paramètres et réessayer.",
  'error.settings.load-failed':
    "Impossible de charger les paramètres des champs personnalisés. Vos champs personnalisés peuvent ne pas s'afficher correctement.",
  'error.settings.import-failed':
    "Impossible d'importer les paramètres du champ. Veuillez vérifier le format de fichier et réessayer.",
  'error.settings.create-failed':
    'Impossible de créer le champ personnalisé. Veuillez vérifier votre saisie et réessayer.',
  'error.settings.remove-failed':
    'Impossible de supprimer le champ personnalisé. Veuillez réessayer.',
  'error.settings.generic':
    "Une erreur s'est produite lors de la gestion des champs personnalisés. Veuillez vérifier vos paramètres et réessayer.",
  'error.options.duplicate':
    'Cette option existe déjà. Veuillez choisir un autre nom.',
  'error.options.invalid-ticker':
    'Symbole de ticker non valide. Utilisez uniquement des lettres, des chiffres et des périodes (par exemple, AAPL, SPX).',
  'error.options.add-ticker-failed':
    "Impossible d'ajouter le symbole de ticker. Veuillez vérifier le format et réessayer.",
  'error.options.add-failed':
    "Impossible d'ajouter l'option. Il peut déjà exister ou être invalide.",
  'error.options.update-failed':
    "Impossible de mettre à jour l'option. Il peut déjà exister ou être invalide.",
  'error.options.remove-failed':
    'Impossible de supprimer cet article. Veuillez réessayer',
  'error.options.no-options-reset':
    'Aucune option à réinitialiser. La catégorie est déjà vide.',
  'error.options.reset-failed':
    'Impossible de réinitialiser les options. Veuillez réessayer.',
  'error.options.save-failed':
    "Impossible d'enregistrer les modifications d'options. Veuillez vérifier vos paramètres et réessayer.",
  'error.options.generic':
    "Une erreur s'est produite lors de la gestion des options. Veuillez réessayer.",
  'error.clipboard.permission-denied':
    'Accès au Presse-papiers refusé. Veuillez autoriser les autorisations du Presse-papiers dans votre navigateur pour la fonctionnalité de collage.',
  'error.clipboard.not-supported':
    "Le collage du presse-papiers n'est pas pris en charge dans votre navigateur. Essayez d'utiliser Ctrl+V ou Cmd+V à la place.",
  'error.clipboard.image-too-large':
    "L'image est trop grande pour être collée. Veuillez utiliser des images de moins de 10 Mo.",
  'error.clipboard.no-content':
    "Rien trouvé dans le presse-papiers à coller. Essayez d'abord de copier une image.",
  'error.clipboard.no-images':
    "Aucune image trouvée dans le presse-papiers. Assurez-vous d'avoir copié une image, et non du texte ou tout autre contenu.",
  'error.clipboard.no-target':
    "Aucune zone de téléchargement d'image trouvée. Cliquez d'abord sur une zone de téléchargement d'image, puis collez votre image.",
  'error.clipboard.network-error':
    "Une erreur réseau s'est produite lors du traitement du collage. Veuillez vérifier votre connexion et réessayer.",
  'error.clipboard.paste-failed':
    "Impossible de terminer l'opération de collage. Veuillez réessayer de copier l'image et de la coller.",
  'error.clipboard.generic':
    'L’opération du presse-papiers a échoué. Veuillez réessayer de copier votre contenu puis de le coller.',
  'datetime.placeholder.time': '22h22 ou 10:22 AM',
  'datetime.aria.open-picker': 'Ouvrir le sélecteur de date',
  'datetime.error.date-required': 'Date requise',
  'datetime.error.invalid-format': 'Format invalide',
  'datetime.error.date-6-digits':
    'La date doit comporter 6 chiffres (format JJMMAA)',
  'datetime.error.invalid-month': 'Mois invalide',
  'datetime.error.invalid-day': 'Jour invalide',
  'datetime.error.invalid-date': 'Date invalide',
  'datetime.error.invalid-time-format': 'Format d’heure invalide',
  'datetime.error.time-3-4-digits': 'L’heure doit comporter 3 ou 4 chiffres',
  'datetime.error.hours-1-12':
    'Les heures doivent être comprises entre 1 et 12 avec AM/PM',
  'datetime.error.hours-0-23':
    'Les heures doivent être comprises entre 0 et 23 au format 24 heures',
  'datetime.error.minutes-0-59':
    'Les minutes doivent être comprises entre 0 et 59',
  'modal.template-switch.title': 'Changer de modèle ?',
  'modal.template-switch.switching-from': 'Vous passez de',
  'modal.template-switch.switching-to': 'à',
  'modal.template-switch.has-content-title': 'Cette note contient du contenu',
  'modal.template-switch.has-content-desc':
    'Le contenu sera réorganisé pour s’adapter à la nouvelle mise en page. Tout contenu qui ne peut pas être intégré sera conservé en bas de la note pour que vous puissiez le revoir.',
  'modal.template-switch.cannot-undo':
    'Cette action est irréversible (mais vous pouvez revenir au modèle précédent).',
  'modal.template-switch.button.switch': 'Changer de modèle',
  'monthly.game.header.week': 'Semaine',
  'monthly.game.header.a-games': 'A Games',
  'monthly.game.header.b-games': 'B Games',
  'monthly.game.header.c-games': 'C Games',
  'monthly.game.header.rating': 'Note',
  'monthly.game.header.notes': 'Notes',
  'monthly.game.week-label': 'S{week}',
  'monthly.game.rating-na': 'N/A',
  'monthly.game.no-data':
    'Aucune donnée de performance disponible pour ce mois',
  'release-notes.title': 'Notes de version',
  'release-notes.loading-plugin': 'Chargement du plugin...',
  'release-notes.loading': 'Chargement des notes de version...',
  'release-notes.no-content': 'Aucune note de version trouvée',
  'release-notes.current-version': 'Actuelle : v{version}',
  'release-notes.version': 'Version {version}',
  'release-notes.link.docs': 'Documentation',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',
  'skeleton.tradelog.loading': 'Chargement des données de trades',
  'skeleton.dashboard-widget.loading': 'Chargement des données du widget',
  'skeleton.account-page.loading': 'Chargement de la page du compte',
  'grid.aria.retry': 'Réessayer de charger la disposition de la grille',
  'grid.aria.remove-widget': 'Supprimer le widget',
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'Export CSV du widget Fills',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Ouvrez le widget Fills dans TT et passez à la vue Detail, Continuous ou Price with Detail',
  'csv.broker-guide.tradingtechnologies.step-2':
    'Faites un clic droit dans le widget Fills, sélectionnez « Request download », puis choisissez la plage horaire',
  'csv.broker-guide.tradingtechnologies.step-3':
    'Lorsque TT affiche la notification indiquant que le téléchargement est prêt, téléchargez le CSV puis importez-le ici',
  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Important :',
  'csv.broker-guide.tradingtechnologies.warning.message':
    'Ne modifiez pas le fichier exporté ni l’ordre des colonnes avant l’importation.',
  'csv.broker-guide.tradingtechnologies.doc-label':
    'Voir les instructions d’export Trading Technologies',
  'trade.metadata.broker-comment': 'Commentaire du broker',
  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'Calendrier de performance',
  'navigation.section.overview': 'Vue d’ensemble',
  'navigation.section.reviews': 'Revues',
  'navigation.section.tools': 'Outils',
  'navigation.edit-mode.toggle': 'Personnaliser la navigation',
  'navigation.edit-mode.hide-item': 'Masquer l’élément de navigation',
  'navigation.edit-mode.restore-section': 'Éléments masqués',
  'navigation.edit-mode.restore': 'Restaurer',
  'navigation.items.nav-home': 'Accueil',
  'navigation.items.nav-dashboard': 'Tableau de bord de trading',
  'navigation.items.nav-trade-log': 'Journal des trades',
  'navigation.items.nav-account-dashboard': 'Tableau de bord des comptes',
  'navigation.items.nav-drc': 'DRC du jour',
  'navigation.items.nav-weekly': 'Revue de cette semaine',
  'navigation.items.nav-monthly': 'Revue de ce mois',
  'navigation.items.nav-quarterly': 'Revue de ce trimestre',
  'navigation.items.nav-yearly': 'Revue de cette année',
  'navigation.items.nav-add-trade': 'Ajouter un trade',
  'navigation.items.nav-layout-builder': 'Layout Builder',
  'navigation.items.nav-quick-import': 'Importation rapide',
  'navigation.items.nav-csv-import': 'Importation de trades',
  'navigation.items.nav-position-size': 'Calculateur de taille de position',
  'settings.general.navigation-sidebar': 'Barre latérale de navigation',
  'navigation.setting.tab-behavior': 'Comportement des onglets de navigation',
  'navigation.setting.tab-behavior.desc':
    'Comment ouvrir les vues depuis la barre latérale de navigation',
  'navigation.setting.tab-behavior.new-tab': 'Ouvrir dans un nouvel onglet',
  'navigation.setting.tab-behavior.replace': 'Remplacer l’onglet actif',
  'navigation.search.placeholder': 'Rechercher des trades et des revues...',
  'navigation.search.clear': 'Effacer la recherche',
  'navigation.search.section.trades': 'Trades',
  'navigation.search.section.reviews': 'Revues',
  'navigation.search.empty': 'Aucun résultat trouvé',
  'navigation.search.trade-open': 'Ouvrir',
  'navigation.search.review.drc': 'Revue quotidienne',
  'navigation.search.review.weekly': 'Revue hebdomadaire',
  'navigation.search.review.monthly': 'Revue mensuelle',
  'navigation.search.review.quarterly': 'Revue trimestrielle',
  'navigation.search.review.yearly': 'Revue annuelle',
  'command.open-navigation-sidebar': 'Ouvrir la barre latérale de navigation',
  'command.open-calendar-sidebar': 'Ouvrir la barre latérale du calendrier',
  'widget.previous-trading-day-context.name':
    'Contexte du jour de trading précédent',
  'widget.previous-trading-day-context.description':
    'Contexte du DRC précédent',
  'widget.previous-trading-day-context.reference-label':
    'Référence du DRC précédent',
  'widget.previous-trading-day-context.open-source': 'Ouvrir le DRC précédent',
  'widget.previous-trading-day-context.image-alt-prefix':
    'Image du DRC précédent',
  'widget.previous-trading-day-context.no-sections-configured':
    'Choisissez au moins une section dans les paramètres du modèle.',
  'widget.previous-trading-day-context.preview-note':
    'Hier, le prix a balayé la liquidité, rejeté le niveau hebdomadaire, puis clôturé de nouveau dans la zone prévue.',
  'widget.previous-trading-day-context.preview-bullet-two':
    'Écart principal : entrée avant confirmation sur le premier repli.',
  'widget.previous-trading-day-context.preview-source':
    'Aperçu : DRC précédent du dernier jour de trading',
  'widget.previous-trading-day-context.preview-bullet-one':
    "Le biais journalier correspondait au plan après l'impulsion d'ouverture.",
  'widget.weekly-drc-context.name': 'Revues quotidiennes par jour',
  'widget.weekly-drc-context.description': 'Sections DRC par jour de semaine',
  'widget.weekly-drc-context.header-eyebrow': 'Revue hebdomadaire',
  'widget.weekly-drc-context.header-title': 'Revues quotidiennes par jour',
  'widget.weekly-drc-context.image-alt-prefix': 'Image DRC hebdomadaire',
  'widget.weekly-drc-context.no-activity': 'Aucune activité pour ce jour.',
  'widget.weekly-drc-context.no-sections-configured':
    'Choisissez au moins une section DRC dans les paramètres du modèle.',
  'widget.weekly-drc-context.current-week-not-found':
    'Revue hebdomadaire actuelle introuvable.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'Date de la revue hebdomadaire actuelle introuvable.',
  'widget.weekly-drc-context.load-error':
    'Impossible de charger la revue DRC hebdomadaire.',
  'widget.weekly-drc-context.invalid-context':
    'Ce widget est uniquement disponible dans les revues hebdomadaires',
  'templateEditor.widget.weekly-drc-day-label': 'Jour',
  'templateEditor.widget.weekly-drc-display-label': 'Affichage',
  'templateEditor.widget.weekly-drc-start-collapsed': 'Démarrer replié',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': 'Carte',
  'templateEditor.widget.weekly-drc-style-accordion': 'Accordion',
  'templateEditor.widget.weekly-drc-default-expanded': 'Expanded by default',
  'templateEditor.widget.previous-context-sections-label': 'Sections à inclure',
  'templateEditor.widget.previous-context-heading-label':
    'Titre de section du DRC précédent',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Choisir ou saisir un titre',
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
  'templateEditor.widget.previous-context-add-section': '+ Ajouter une section',
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
  'dashboard.conversion.original-pnl': "P&L d'origine",
  'dashboard.conversion.converted-pnl': 'P&L converti',
  'dashboard.conversion.details-label': 'Détails de conversion des devises',
  'dashboard.conversion.requires-conversion':
    'Les graphiques P&L multidevises nécessitent une conversion de taux de change.',

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
    'Supprimer également de mon coffre tous les trades liés à ce compte',
  'calendar.aria.open-daily-review': 'Ouvrir la revue quotidienne pour {date}',
  'calendar.aria.open-weekly-review':
    'Ouvrir la revue hebdomadaire pour {date}',
  'trade.header.aria.status': 'Statut du trade : {status}',
  'csv.mapper.aria.map-column': 'Mapper la colonne {header}',
  'trade-import.error.file-too-large':
    'Le fichier sélectionné dépasse la limite de taille de Trade Import',
  'trade-import.error.file-type-unsupported':
    'Le type de fichier sélectionné n’est pas pris en charge par Trade Import',
  'trade-import.error.broker-file-type-unsupported':
    'Le broker sélectionné ne prend pas en charge ce type de fichier',
  
  'quick-import.title': 'Import rapide',
  'quick-import.subtitle':
    'Utilisez votre configuration Trade Import favorite pour prévisualiser et importer un fichier plus vite.',
  'quick-import.gate.sign-in':
    'Connectez-vous pour utiliser l’import rapide avec votre configuration enregistrée.',
  'quick-import.gate.pro': 'L’import rapide est inclus avec Trade Import Pro.',
  'quick-import.message.needs-setup':
    'Choisissez un broker ou un modèle favori dans Trade Import avant d’utiliser l’import rapide.',
  'quick-import.message.capabilities-failed':
    'La configuration d’import rapide n’a pas pu être chargée.',
  'quick-import.message.mapping-required':
    'Ce fichier nécessite un mapping des colonnes. Ouvrez le flux Trade Import complet pour vérifier les mappings.',
  'quick-import.message.preview-failed':
    'Ce fichier doit être vérifié dans le flux Trade Import complet.',
  'quick-import.message.no-importable':
    'No importable trades were found. Review this file in Trade Import for details.',
  'quick-import.notice.consent-required':
    'Confirmez le traitement avant l’envoi.',
  'quick-import.consent':
    'Je comprends que ce fichier sera envoyé aux serveurs Journalit pour traitement.',
  'quick-import.privacy-note':
    'Les fichiers sont envoyés aux serveurs Journalit pour traitement et ne sont pas stockés par défaut.',
  'quick-import.dropzone.title': 'Déposez un export broker ici',
  'quick-import.dropzone.subtitle': 'Ou cliquez pour choisir un fichier',
  'quick-import.status.loading': 'Chargement de la configuration rapide...',
  'quick-import.status.checking-subscription':
    'Vérification de l’état de l’abonnement...',
  'quick-import.status.analysing': 'Analyse et préparation de l’aperçu...',
  'quick-import.status.importing': 'Import en cours...',
  'quick-import.processing.sent-to-server':
    'Uploaded to Journalit for private processing',
  'quick-import.file.selected': 'Selected file',
  'quick-import.file.processed': 'Processed and ready to write to your vault',
  'quick-import.summary.title': 'Prêt à importer',
  'quick-import.summary.trades': 'Trades prévisualisés',
  'quick-import.summary.to-import': 'À importer',
  'quick-import.summary.duplicates': 'Doublons',
  'quick-import.summary.failed': 'À vérifier',
  'quick-import.complete.title': 'Import terminé',
  'quick-import.complete.message':
    '{written} écrits, {duplicates} doublons, {failed} à vérifier.',
  'quick-import.action.open-full': 'Ouvrir Trade Import complet',
  'quick-import.action.review-in-trade-import': 'Vérifier dans Trade Import',
  'quick-import.action.setup-in-trade-import': 'Configurer dans Trade Import',
  'quick-import.action.import': 'Importer les trades',
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import-count': 'Import {count} trades',
  'quick-import.preview.more': '+ {count} more processed trades',

  'trade-import.notice.capabilities-failed':
    'Impossible de charger les fonctionnalités de Trade Import',
  'trade-import.notice.template-exists':
    'Un modèle Trade Import avec ce nom existe déjà',
  'trade-import.notice.template-saved': 'Modèle Trade Import enregistré',
  'trade-import.notice.analyse-failed': 'Échec de l’analyse Trade Import',
  'trade-import.notice.preview-failed': 'Échec de l’aperçu Trade Import',
  'trade-import.preview-error.guidance':
    'Vérifiez que tous les champs obligatoires sont mappés, que le format de date sélectionné correspond à votre fichier et que les colonnes numériques contiennent des valeurs de trade valides.',
  'trade-import.notice.complete':
    'Trade Import terminé : {written} écrits ou mis à jour, {duplicateCount} doublons, {failedCount} échecs',
  'trade-import.gate.sign-in':
    'Connectez-vous avant d’envoyer des exports de broker avec Trade Import.',
  'trade-import.gate.upgrade':
    'Trade Import est une fonctionnalité Pro. Une mise à niveau est requise avant d’envoyer des exports de broker.',
  'trade-import.action.open-settings': 'Ouvrir les paramètres',
  'trade-import.action.manage-subscription': 'Gérer l’abonnement',
  'trade-import.description':
    'Envoyez des exports CSV, XLSX, XLS, HTML ou relevés de broker pour une analyse et un aperçu côté backend.',
  'trade-import.step.select': '1. Sélectionner les paramètres d’import',
  'trade-import.step.privacy': '2. Confirmation de confidentialité',
  'trade-import.step.analyse': '3. Analyser et mapper',
  'trade-import.step.preview': '4. Aperçu',
  'trade-import.label.template': 'Modèle local de mapping',
  'trade-import.label.template-actions': 'Actions du modèle',
  'trade-import.template.none': 'Aucun modèle',
  'trade-import.label.account': 'Compte',
  'trade-import.label.broker': 'Broker',
  'trade-import.label.asset-type': 'Type d’actif',
  'trade-import.asset.stock': 'Action',
  'trade-import.asset.options': 'Options',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.label.manual-mode': 'Mode manuel',
  'trade-import.manual-mode.price-based': 'Basé sur les prix',
  'trade-import.manual-mode.direct-pnl': 'P&L direct',
  'trade-import.label.ai-mapping': 'Demander des suggestions de mapping IA',
  'trade-import.privacy.copy':
    'Trade Import envoie l’export de broker sélectionné aux serveurs Journalit pour traitement. Les exports de broker peuvent contenir des identifiants de compte, l’historique des trades, symboles, horodatages, prix, quantités, frais, soldes et P&L. Pour générer l’aperçu, Journalit envoie aussi le nom du compte sélectionné, les choix de mapping/modèle, les définitions de champs personnalisés et options enregistrées, ainsi qu’un contexte local limité des trades ouverts pour la correspondance des positions IBKR. Les fichiers bruts sont traités pour cet import et ne sont pas stockés par défaut.',
  'trade-import.privacy.acknowledge':
    'Je comprends et je souhaite envoyer cet export pour traitement.',
  'trade-import.action.analyse': 'Analyser le fichier',
  'trade-import.action.choose-file':
    'Cliquez pour téléverser ou glissez-déposez',
  'trade-import.guide.prompt': 'Vous ne savez pas quoi exporter ?',
  'trade-import.guide.link': 'Voir le guide du broker',
  'trade-import.action.drop-file': 'Déposez le fichier pour le téléverser',
  'trade-import.analyse.detected':
    '{fileType} détecté. Les en-têtes et lignes d’exemple sont renvoyés par le backend.',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Feuille',
  'trade-import.label.header-row': 'Ligne d’en-tête',
  'trade-import.placeholder.auto': 'Auto',
  'trade-import.label.date-format': 'Format de date',
  'trade-import.mapping.unmapped': 'Non mappé',
  'trade-import.label.save-template': 'Enregistrer le modèle de mapping',
  'trade-import.placeholder.template-name': 'Nom du modèle',
  'trade-import.action.save-template': 'Enregistrer le modèle',
  'trade-import.action.preview': 'Générer l’aperçu',
  'trade-import.preview.summary':
    '{previewCount} trades en aperçu, {failedCount} lignes en échec, {incompleteCount} lignes incomplètes.',
  'trade-import.table.status': 'Statut',
  'trade-import.table.symbol': 'Symbole',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Heure d’entrée',
  'trade-import.table.date': 'Jour',
  'trade-import.table.position': 'Taille de position',
  'trade-import.table.result': 'Résultat',
  'trade-import.table.quantity': 'Quantité',
  'trade-import.table.message': 'Message',
  'trade-import.action.confirm': 'Confirmer l’import',
  'trade-import.action.cancel-preview': 'Annuler l’aperçu',
  'trade-import.broker.manual': 'Mapping manuel',
  'trade-import.preview.message.duplicate-in-file':
    'Doublon dans le fichier d’import sélectionné',
  'trade-import.preview.message.multiple-open-matches':
    'Plusieurs trades ouverts correspondants trouvés pour l’aperçu close-only',
  'trade-import.preview.message.quantity-mismatch':
    'La quantité du trade ouvert correspondant diffère de l’aperçu close-only',
  'trade-import.preview.message.no-open-match':
    'Aucun trade ouvert correspondant trouvé pour l’aperçu close-only',
  'trade-import.restore.title':
    'Restaurer les trades importés depuis le backend',
  'trade-import.restore.description':
    'Crée les notes locales manquantes pour les trades importés dans le backend pour ce coffre. Cela ne crée pas de doublons côté backend.',
  'trade-import.restore.vault': 'Identité du coffre actuel : {vaultId}',
  'trade-import.restore.load':
    'Restaurer les trades importés depuis le backend',
  'trade-import.restore.none':
    'Aucune projection de trade importé manquante trouvée pour ce coffre.',
  'trade-import.restore.loaded':
    '{count} trades importés restaurables trouvés.',
  'trade-import.restore.load-failed':
    'Impossible de charger les trades importés restaurables.',
  'trade-import.restore.select-all': 'Tout sélectionner',
  'trade-import.restore.restore-selected': 'Restaurer la sélection ({count})',
  'trade-import.restore.complete':
    '{written} trades importés restaurés ; {failed} échecs.',
  'trade-import.restore.broker-label': 'Restauration backend',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.metatrader.description':
    'Synchronisez les trades depuis les rapports MetaTrader téléversés via votre connexion FTP.',
  'trade-sync.source.trade-import.description':
    'Restaurez les imports de fichiers broker entre coffres et récupérez les notes de trade locales manquantes.',
  'trade-sync.import.title': 'Synchronisation Trade Import',
  'trade-sync.import.description':
    'Restaurez les trades importés entre coffres et récupérez les notes locales manquantes.',
  'trade-sync.import.card.connection': 'Connexion',
  'trade-sync.import.card.backup': 'Sauvegarde des imports',
  'trade-sync.import.card.restorable': 'Trades restaurables',
  'trade-sync.import.card.import': 'Trade Import',
  'trade-sync.import.card.open-importer': 'Ouvrir l’importeur',
  'trade-sync.import.card.open-importer-desc':
    'Importez de nouveaux fichiers broker ici',
  'trade-sync.import.card.inventory-summary':
    '{accounts} compte(s) · {trades} trade(s)',
  'trade-sync.import.action.check': 'Vérifier',
  'trade-sync.import.action.open-import': 'Ouvrir Trade Import',
  'trade-sync.import.action.clear': 'Effacer',
  'trade-sync.import.action.select-all': 'Tout sélectionner',
  'trade-sync.import.action.restore-selected':
    'Restaurer la sélection ({count})',
  'trade-sync.import.action.create-local-account': 'Créer localement',
  'trade-sync.import.action.create-local-account-title':
    'Crée un compte local dans ce coffre avec le nom du compte backend.',
  'trade-sync.import.action.save-mapping': 'Enregistrer',
  'trade-sync.import.action.save-mapping-title':
    'Enregistre l’association entre ce compte backend et le compte local.',
  'trade-sync.import.action.mapped': 'Associé',
  'trade-sync.import.action.restore-account': 'Restaurer',
  'trade-sync.import.action.restore-account-title':
    'Restaure les notes de trade locales manquantes pour ce compte backend.',
  'trade-sync.import.action.restoring': 'Restauration…',
  'trade-sync.import.label.account': 'Compte',
  'trade-sync.import.vault-pending': 'Coffre en attente',
  'trade-sync.import.pending-acks': '{count} ACK en attente',
  'trade-sync.import.recovery.title': 'Notes locales manquantes',
  'trade-sync.import.empty': 'Ce coffre est à jour.',
  'trade-sync.import.empty-accounts':
    'Aucun compte Trade Import sauvegardé trouvé pour le moment.',
  'trade-sync.import.account.restorable-count': '{count} restaurable(s)',
  'trade-sync.import.account.synced-count': '{count} synchronisé(s)',
  'trade-sync.import.account.missing-count': '{count} manquant(s)',
  'trade-sync.import.account.issue-count': '{count} problème(s)',
  'trade-sync.import.account.local-account': 'Compte local',
  'trade-sync.import.account.mapping-hint':
    'Les trades restaurés seront écrits dans ce compte local.',
  'trade-sync.import.notice.restored':
    '{count} trade(s) importé(s) restauré(s).',
  'trade-sync.import.notice.load-failed':
    'Impossible de charger l’état de synchronisation Trade Import.',
  'trade-sync.import.notice.mapping-failed':
    'Impossible d’enregistrer l’association du compte Trade Import.',
  'trade-sync.import.notice.create-account-failed':
    'Impossible de créer le compte local.',
  'trade-sync.import.notice.restore-failed':
    'Impossible de restaurer le compte Trade Import.',
};
export default fr;
