

import type { Lang } from './en';

const fr: Lang = {
  'account.profiles.correction-title': 'Correction du catalogue',
  'account.profiles.correction-source': 'Source des règles',
  'account.profiles.correction-period': 'Historique concerné',
  'account.profiles.correction-guide':
    'Les corrections nécessitent votre accord avant de recalculer l’historique concerné.',
  'account.profiles.correction-history': 'Historique des corrections',
  'account.profiles.correction-stale':
    'L’historique du compte a changé. Rouvrez cette vérification.',
  'account.profiles.correction-result': 'Évaluation des règles strictes',
  'account.profiles.no-hard-breach': 'Aucune violation stricte détectée',
  'account.profiles.correction-consent': 'Recalculer l’historique',
  'account.profiles.correction-details': 'Détails',
  'account.profiles.correction-apply': 'Appliquer la correction',
  'account.profiles.purchase-date': 'Date d’achat initiale',
  'account.profiles.save-purchase': 'Enregistrer la date d’achat',
  'account.profiles.purchase-needed':
    'Saisissez la date d’achat initiale pour vérifier ces conditions.',
  'account.profiles.purchase-excluded':
    'Cet achat conserve ses conditions actuelles.',
  'account.profiles.purchase-uncertain':
    'La société doit confirmer leur applicabilité. Les règles restent inchangées.',
  'account.profiles.initial-terms':
    'Ces conditions s’appliquent dès l’achat ou avant cette phase. Vérifiez séparément la configuration initiale ; l’historique reste inchangé.',
  'account.profiles.announcement': 'Annonce de la société',
  'account.profiles.firm-effective': 'Date d’effet confirmée par la société',
  'account.profiles.published-date': 'Date d’effet publiée',
  'account.profiles.applicability-checking': 'Vérification de l’applicabilité…',
  'account.profiles.no-matching-phase':
    'Aucune phase correspondante dans ce profil.',
  'account.profiles.history-unchanged': 'L’historique reste inchangé.',
  'account.profiles.notice-title': 'Profil de challenge actualisé disponible',
  'account.profiles.notice-description':
    'Le profil source diffère du profil enregistré. Les règles de votre compte restent inchangées.',
  'account.profiles.review-changes': 'Examiner les modifications',
  'account.profiles.check-failed':
    'Impossible de vérifier les mises à jour des règles.',
  'account.profiles.retry': 'Réessayer',
  'account.profiles.source-changed':
    'Le profil source a changé pendant cet examen. Rouvrez l’examen avant d’appliquer les modifications.',
  'account.profiles.retain': 'Conserver les règles actuelles',
  'account.profiles.retain-help':
    'Conservez les règles du compte et masquez ces modifications source. Les changements ultérieurs pourront être signalés.',
  'account.profiles.comparison-help':
    'Seules les différences sont affichées. Développez une règle pour examiner ses champs. Des ajustements locaux peuvent expliquer les différences.',
  'account.profiles.added': 'Ajouté',
  'account.profiles.removed': 'Supprimé',
  'account.profiles.changed': 'Modifié',
  'account.profiles.not-configured': 'Non configuré',
  'account.profiles.no-rule-changes':
    'Aucune différence de règles ou de conditions de versement pour cette phase.',
  'account.profiles.accept': 'Appliquer la mise à jour',
  'account.profiles.cached':
    'Profils en cache utilisés ; les règles les plus récentes n’ont pas pu être vérifiées.',
  'account.profiles.guide':
    'Examinez les changements selon les conditions publiées ou confirmées par la société. Saisissez la date d’achat initiale si demandée. Enregistrez vos modèles dans Mes profils de sociétés via Modifier le compte.',
  'account.profiles.account-phase': 'Phase du compte',
  'account.profiles.choose': 'Choisir un profil enregistré',
  'account.profiles.completed':
    'Les phases terminées conservent leurs règles initiales.',
  'account.profiles.confirm': 'Ces règles s’appliquent à mon compte.',
  'account.profiles.currency':
    'Choisissez une devise de compte correspondant au profil avant de l’appliquer.',
  'account.profiles.current': 'Règles actuelles du compte',
  'account.profiles.custom-transition':
    'Conditions de transition personnalisées',
  'account.profiles.cycle-start': 'Début du cycle de retrait (heure locale)',
  'account.profiles.delete-help':
    'Supprimer ce profil enregistré ? Les comptes existants ne seront pas modifiés.',
  'account.profiles.effective': 'Applicable à partir du (heure locale)',
  'account.profiles.error':
    'Impossible d’enregistrer le profil. Vérifiez les valeurs et réessayez.',
  'account.profiles.floor': 'Plancher de drawdown à la transition',
  'account.profiles.history': 'Historique des règles',
  'account.profiles.history-help':
    'Les anciennes règles sont conservées. Utilisez Examiner la mise à jour du profil ; la modification directe est verrouillée pour protéger l’historique.',
  'account.profiles.incoming': 'Nouvelles règles du profil',
  'account.profiles.independent':
    'Les profils sont locaux à ce coffre. Leur application crée une copie indépendante ; une nouvelle révision ne modifie jamais les comptes existants.',
  'account.profiles.keep-help':
    'Les règles cochées conservent vos valeurs locales au lieu des nouvelles règles du même type. Décochez pour accepter. Les nouveaux types sont ajoutés.',
  'account.profiles.keep-local': 'Garder ma règle :',
  'account.profiles.keep-payout': 'Conserver la politique de retrait actuelle',
  'account.profiles.library': 'Mes profils de sociétés',
  'account.profiles.locked': 'Le plancher de drawdown est déjà verrouillé',
  'account.profiles.missing': 'Ce profil enregistré n’existe plus.',
  'account.profiles.peak': 'Solde maximal reporté',
  'account.profiles.review': 'Examiner la mise à jour du profil',
  'account.profiles.link-source': 'Lier un profil de firme',
  'account.profiles.save-new': 'Enregistrer comme nouveau profil',
  'account.profiles.save-revision':
    'Enregistrer une nouvelle révision du profil choisi',
  'account.profiles.source-phase': 'Phase du profil source',
  'account.profiles.transition-help':
    'Aucune condition de transition vérifiée n’est fournie. Saisissez le plancher, le pic et le début du cycle confirmés par la société. Ils sont marqués personnalisés. Le profit de phase et le nombre total de retraits sont conservés ; les anciens trades gardent leurs règles.',
  'account.profiles.transition-source':
    'Confirmation de la société ou référence',
  'account.profiles.unknown-baseline':
    'Ce compte ancien n’a pas de copie source initiale. Examinez chaque différence ; les modifications locales ne peuvent pas être reconnues automatiquement.',
  'account.profiles.update-available':
    'Des différences de profil sont à examiner. Le compte utilise toujours ses règles enregistrées.',
  'account.profiles.up-to-date':
    'Cette phase utilise la dernière définition examinée ; les modifications locales restent indépendantes.',
  'widget.mfeScatter.name': 'MFE vs PnL réalisé',
  'widget.mfeScatter.description':
    'Excursion favorable maximale comparée au PnL net réalisé des trades clôturés',
  'widget.mfeScatter.y': 'PnL réalisé ({unit})',
  'widget.mfeScatter.winners': 'Gagnants',
  'widget.mfeScatter.losers': 'Perdants',
  'widget.mfeScatter.breakeven': 'Seuil de rentabilité',
  'widget.mfeScatter.empty':
    'Aucun trade clôturé avec une MFE exploitable dans cette unité.',

  'trade.broker-synced-at': 'Courtier synchronisé {date}',
  'trade-sync.tradovate.status.connecting': 'Connexion en cours',
  'trade-sync.tradovate.status.setup-required':
    'Configuration du compte requise',
  'trade-sync.tradovate.status.paused': 'En pause',
  'trade-sync.tradovate.status.reauthorization-required':
    'Nouvelle autorisation requise',
  'trade-sync.tradovate.status.deleting': 'Suppression des données cloud',
  'trade-sync.tradovate.status.error': 'Erreur de connexion',

  'trade-sync.tradovate.sync-complete-connection':
    'Synchronisation de {connection} terminée.',
  'trade-sync.tradovate.sync-partial-connection':
    'La synchronisation de {connection} s’est terminée avec des problèmes.',
  'trade-sync.tradovate.sync-all': 'Tout synchroniser',
  'trade-sync.tradovate.sync-all-complete':
    '{succeeded} connexion(s) Tradovate synchronisée(s) sur {total}.',
  'trade-sync.tradovate.sync-all-partial':
    '{succeeded} connexion(s) Tradovate synchronisée(s) sur {total}. Vérifiez les connexions présentant des problèmes.',
  'trade-sync.tradovate.connect-another': 'Connecter un autre compte Tradovate',
  'trade-sync.tradovate.no-connections':
    'Connectez un compte Tradovate sur Journalit.co pour le configurer et le synchroniser ici.',
  'trade-sync.tradovate.claimed-by-connection':
    'La synchronisation est activée via {connection}. Désactivez-la sur cette connexion avant de changer ce compte.',
  'trade-sync.tradovate.claim-conflict':
    'Une autre connexion Tradovate a réservé ce compte. Vérifiez les cartes de connexion actualisées avant de réessayer.',
  'trade-sync.tradovate.reconciliation-issues':
    '{count} problème(s) de rapprochement',
  'trade-sync.tradovate.website-connection-description':
    'Connectez ou réautorisez Tradovate en toute sécurité sur Journalit.co, puis revenez ici pour choisir des comptes et synchroniser votre coffre.',
  'trade-sync.tradovate.paused-website-description':
    'Cette connexion Tradovate est en pause. Gérez-la sur Journalit.co pour la consulter ou la reprendre.',
  'trade-sync.tradovate.plugin-sync-description':
    'Une synchronisation récupère l’activité récente de Tradovate et écrit les trades correspondants dans ce coffre.',
  'trade-sync.tradovate.connect': 'Connecter',
  'trade-sync.tradovate.manage-connection': 'Gérer la connexion',
  'trade-sync.tradovate.setup-guide': 'Guide de configuration',
  'trade-sync.tradovate.setup-and-sync':
    'Terminer la configuration et synchroniser',
  'trade-sync.tradovate.sync-to-vault': 'Synchroniser',
  'trade-sync.tradovate.discovery-description':
    'Journalit doit détecter les comptes Demo et Live disponibles via votre connexion Tradovate.',
  'trade-sync.tradovate.discover-accounts': 'Détecter les comptes Tradovate',
  'trade-sync.tradovate.discovering': 'Détection des comptes…',
  'trade-sync.tradovate.discovery-failed':
    'Échec de la détection des comptes Tradovate. Réessayez ou gérez la connexion sur Journalit.co.',
  'trade-sync.tradovate.sync-account': 'Inclure dans la synchronisation',
  'trade-sync.tradovate.history-label': 'Historique initial',
  'trade-sync.tradovate.history-all': 'Tout l’historique disponible',
  'trade-sync.tradovate.history-recent': '90 derniers jours',
  'trade-sync.tradovate.history-custom': 'À partir d’une date précise',
  'trade-sync.tradovate.history-new': 'Nouveaux trades uniquement',
  'trade-sync.tradovate.start-date': 'Date de début',

  'trade-sync.tradovate.mapping-required':
    'Choisissez un compte local de ce coffre pour chaque compte Tradovate activé.',
  'trade-sync.tradovate.custom-date-required':
    'Choisissez une date de début pour chaque sélection d’historique personnalisée.',
  'trade-sync.tradovate.recovery-title':
    'Restaurer les notes de trades manquantes',
  'trade-sync.tradovate.recovery-count':
    '{count} note(s) de trades à restaurer',
  'trade-sync.tradovate.recovery-select-account':
    'Sélectionnez un compte local avant de restaurer les notes de trades.',
  'trade-sync.tradovate.recovery-confirm':
    'Restaurer {count} note(s) de trades dans {account} ?',

  'trade-sync.ctrader.status.setup-required': 'Configuration du compte requise',
  'trade-sync.ctrader.status.connecting': 'Connexion en cours',
  'trade-sync.ctrader.status.paused': 'En pause',
  'trade-sync.ctrader.status.reauthorization-required':
    'Nouvelle autorisation requise',
  'trade-sync.ctrader.status.deleting': 'Suppression des données cloud',
  'trade-sync.ctrader.status.error': 'Erreur de connexion',
  'trade-sync.ctrader.sync-complete-connection':
    'Synchronisation de {connection} terminée.',
  'trade-sync.ctrader.sync-partial-connection':
    'La synchronisation de {connection} s’est terminée avec des problèmes.',
  'trade-sync.ctrader.sync-all': 'Tout synchroniser',
  'trade-sync.ctrader.sync-all-complete':
    '{succeeded} connexion(s) cTrader synchronisée(s) sur {total}.',
  'trade-sync.ctrader.sync-all-partial':
    '{succeeded} connexion(s) cTrader synchronisée(s) sur {total}. Vérifiez les connexions présentant des problèmes.',
  'trade-sync.ctrader.connect-another': 'Connecter un autre compte cTrader',
  'trade-sync.ctrader.no-connections':
    'Connectez un compte cTrader sur Journalit.co pour le configurer et le synchroniser ici.',
  'trade-sync.ctrader.claimed-by-connection':
    'La synchronisation est activée via {connection}. Désactivez-la sur cette connexion avant de changer ce compte.',
  'trade-sync.ctrader.claim-conflict':
    'Une autre connexion cTrader a réservé ce compte. Vérifiez les cartes de connexion actualisées avant de réessayer.',
  'trade-sync.ctrader.reconciliation-issues':
    '{count} problème(s) de rapprochement',
  'trade-sync.ctrader.website-connection-description':
    'Connectez ou réautorisez cTrader en toute sécurité sur Journalit.co, puis revenez ici pour choisir des comptes et synchroniser votre coffre.',
  'trade-sync.ctrader.plugin-sync-description':
    'Une synchronisation récupère l’activité récente de cTrader et écrit les trades correspondants dans ce coffre.',
  'trade-sync.ctrader.connect': 'Connecter',
  'trade-sync.ctrader.manage-connection': 'Gérer la connexion',
  'trade-sync.ctrader.setup-guide': 'Guide de configuration',
  'trade-sync.ctrader.setup-and-sync':
    'Terminer la configuration et synchroniser',
  'trade-sync.ctrader.sync-to-vault': 'Synchroniser',
  'trade-sync.ctrader.discovery-description':
    'Journalit doit détecter les comptes Demo et Live disponibles via votre connexion cTrader.',
  'trade-sync.ctrader.discover-accounts': 'Détecter les comptes cTrader',
  'trade-sync.ctrader.discovering': 'Détection des comptes…',
  'trade-sync.ctrader.discovery-failed':
    'Échec de la détection des comptes cTrader. Réessayez ou gérez la connexion sur Journalit.co.',
  'trade-sync.ctrader.sync-account': 'Inclure dans la synchronisation',
  'trade-sync.ctrader.history-label': 'Historique initial',
  'trade-sync.ctrader.history-all': 'Tout l’historique disponible',
  'trade-sync.ctrader.history-recent': '90 derniers jours',
  'trade-sync.ctrader.history-custom': 'À partir d’une date précise',
  'trade-sync.ctrader.history-new': 'Nouveaux trades uniquement',
  'trade-sync.ctrader.start-date': 'Date de début',
  'trade-sync.ctrader.mapping-required':
    'Choisissez un compte local de ce coffre pour chaque compte cTrader activé.',
  'trade-sync.ctrader.custom-date-required':
    'Choisissez une date de début pour chaque sélection d’historique personnalisée.',
  'trade-sync.ctrader.recovery-title':
    'Restaurer les notes de trades manquantes',
  'trade-sync.ctrader.recovery-count': '{count} note(s) de trades à restaurer',
  'trade-sync.ctrader.recovery-select-account':
    'Sélectionnez un compte local avant de restaurer les notes de trades.',
  'trade-sync.ctrader.recovery-confirm':
    'Restaurer {count} note(s) de trades dans {account} ?',
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
  'trade-sync.ctrader.last-sync': 'Dernière synchronisation',
  'trade-sync.ctrader.pending-acks': '{count} ACK locaux en attente',
  'trade-sync.ctrader.never': 'Jamais',

  'command.add-trade': 'Ajouter un nouveau trade',
  'command.quick-import-trades': 'Importer rapidement des trades',
  'command.import-trades-csv': 'Ouvrir Trade Import',
  'command.create-drc': 'Ouvrir le DRC (rapport quotidien)',
  'command.create-weekly-review': 'Ouvrir la revue hebdomadaire',
  'command.create-monthly-review': 'Ouvrir la revue mensuelle',
  'command.create-quarterly-review': 'Ouvrir la revue trimestrielle',
  'command.create-yearly-review': 'Ouvrir la revue annuelle',
  'command.open-dashboard': 'Ouvrir le tableau de bord',
  'command.open-account-dashboard': 'Ouvrir les comptes',
  'command.open-trade-log': 'Ouvrir le journal des trades',
  'command.open-economic-calendar': 'Ouvrir le calendrier économique',
  'command.open-home': "Ouvrir la vue d'accueil",
  'command.open-settings': 'Ouvrir les paramètres',
  'command.open-position-size-calculator':
    'Ouvrir le calculateur de taille de position',
  'command.replay-onboarding': "Rejouer le flux d'intégration",
  'command.replay-current-view-guide': 'Rejouer le guide de la vue actuelle',
  'command.open-release-notes': 'Afficher les notes de version',
  'command.open-layout-builder': 'Ouvrir le Layout Builder',
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
  'template.switch-review-title': 'Changer de layout {type}',

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

  'auth.label.email': 'Adresse e-mail',

  'auth.button.send-code': 'Envoyer le code de vérification',

  'auth.label.code': 'Code de vérification',

  'auth.button.verify': 'Vérifier et se connecter',

  'auth.button.resend': 'Renvoyer le code',

  'auth.error.needs-premium': 'Fonctionnalité Pro',

  'auth.error.network-error': 'Erreur de connexion',

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

  'form.section.custom-fields-empty-title':
    'Aucun champ avancé pour le moment.',
  'form.section.custom-fields-empty-desc':
    "Enregistrez tout ce que les champs intégrés ne couvrent pas, comme la session, l'unité de temps ou la qualité du setup. Les champs personnalisés sont enregistrés avec chaque trade et peuvent devenir des colonnes triables du journal.",
  'form.section.attachments': 'Pièces jointes',
  'form.tab.basic': 'Général',
  'form.tab.details': 'Détails',
  'form.tab.advanced': 'Avancé',

  
  
  
  'form.import-shortcut.open': 'Ouvrir l’import de trades',
  'form.layout.customize': 'Personnaliser le formulaire',
  'form.layout.modal-title': 'Personnaliser le formulaire de trade',
  'form.layout.settings-title': 'Disposition du formulaire de trade',

  'form.layout.input-mode': 'Mode de saisie',
  'form.layout.input-mode-prices': 'Prix',
  'form.layout.input-mode-pnl-risk': 'P&L + Risque',
  'form.layout.input-mode-prices-desc':
    'Journalisez les prix d’entrée et de sortie, puis laissez Journalit calculer le P&L.',
  'form.layout.input-mode-pnl-risk-desc':
    'Journalisez directement le P&L du trade et le montant risqué. Journalit calcule automatiquement le multiple R.',
  'form.layout.asset-type-mode': 'Type d’actif',
  'form.layout.asset-type-mode-show': 'Demander',
  'form.layout.asset-type-mode-fixed': 'Fixe',
  'form.layout.default-asset-type': 'Type d’actif par défaut',
  'form.layout.active-fields': 'Blocs visibles',
  'form.layout.available-fields': 'Blocs masqués',
  'form.layout.active-fields-desc':
    'Faites glisser les blocs pour les réordonner. Retirez ce que vous n’utilisez pas.',
  'form.layout.available-fields-desc':
    'Ajoutez de nouveau les blocs masqués au formulaire quand vous en avez besoin.',
  'form.layout.empty-active': 'Aucun bloc optionnel n’est visible.',
  'form.layout.all-active': 'Tous les blocs optionnels sont visibles.',
  'form.layout.add-field-aria': 'Ajouter {field} au formulaire de trade',
  'form.layout.remove-field-aria':
    'Masquer {field} dans le formulaire de trade',
  'form.layout.saved': 'Disposition du formulaire de trade enregistrée',
  'form.layout.item.trading-costs.commission': 'Frais de commission',
  'form.layout.item.import-shortcut': 'Raccourci d’import',
  'form.layout.item.import-shortcut-desc':
    'Affiche un bouton de pied de page qui ouvre l’import de trades.',
  'form.layout.item.core-details': 'Détails principaux du trade',
  'form.layout.item.core-details-desc':
    'Compte, instrument, direction et entrées/sorties restent en premier.',
  'form.layout.item.asset-specific': 'Champs propres à l’actif',
  'form.layout.item.pnl-preview': 'Aperçu du P&L',

  'form.layout.item.trade-currency': 'Devise du trade / Taux de change',
  'form.layout.item.trade-currency-desc':
    'Saisir un trade dans une autre devise avec un taux de change manuel optionnel.',
  'form.layout.item.exchange-desc':
    'Champ de place de marché pour les trades actions et crypto.',
  'form.layout.item.direct-pnl-toggle-desc':
    "Basculer un trade sur la saisie d'un P&L total au lieu des prix de sortie.",
  'form.layout.manual-fx-rate': 'Remplacement du taux de change',
  'form.layout.result-r': 'Résultat en R',
  'form.layout.entry-time': 'Heure du trade',
  'form.field.account': 'Compte',
  'form.field.prop-challenge-phase': 'Phase associée : {name}',
  'form.field.prop-challenge-phase.none': 'Aucune phase à cet instant',
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

  'form.field.other-fees': 'Autres frais',
  'form.field.stop-loss': 'Stop-loss',
  'form.field.take-profit': 'Objectif de gain',
  'form.field.take-profit-short': 'N°',
  'form.field.target-price': 'Prix cible',
  'form.field.close-percent': '% clôturé',
  'form.field.close-size': 'Taille clôturée',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': 'Montant de clôture des objectifs de gain en',
  'form.layout.take-profit-unit-percent': '% clôturé',
  'form.layout.take-profit-unit-size': 'Taille',
  'trade.validation.take-profit-size-number':
    'La taille du take profit doit être un nombre valide.',
  'trade.validation.take-profit-size-positive':
    'La taille du take profit doit être supérieure à 0.',
  'trade.validation.take-profit-total-size-range':
    'Les tailles de take profit ne peuvent pas dépasser la taille de la position.',
  'form.field.risk-amount': 'Montant du risque',
  'form.field.profit-loss': 'Bénéfice/Perte',
  'form.field.total-pnl': 'P&L du trade',
  'form.field.realized-pnl': 'P&L réalisé',
  'form.field.floating-pnl': 'P&L flottant',
  'form.field.total-costs': 'Coûts totaux :',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Erreur',
  'form.field.custom-tags': 'Balises personnalisées',
  'form.field.trade-thesis': 'Thèse de trading',
  'form.field.time': 'Heure',
  'form.field.price': 'Prix',

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
  'form.account-empty-state.title': 'Configurez votre premier compte',
  'form.account-empty-state.description':
    'Les comptes suivent votre solde afin que Journalit puisse calculer rendement, risque et drawdown. Un nom suffit pour en créer un.',
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
  'form.field.trade-currency': 'Devise du trade',
  'form.field.fx-rate': 'Taux de change vers {base}',
  'form.field.fx-rate-override':
    'Remplacement du taux de change ({quote} → {base})',
  'form.forex.using-manual-rate': 'Taux de change manuel utilisé',
  'form.field.lot-size.standard': 'Standard (100 000)',
  'form.field.lot-size.mini': 'Mini (10 000)',
  'form.field.lot-size.micro': 'Micro (1 000)',
  'form.field.lot-size.custom': 'Personnalisé',
  'form.field.image-url-placeholder':
    "Ou collez l'URL de l'image (TradingView, etc.)...",
  'form.field.image-duplicate-error': 'Cette image est déjà ajoutée.',
  'form.field.trade-image-alt': 'Image de trading',

  'form.field.value-dollar': 'Valeur ($)',
  'form.field.dollar-amount-placeholder': 'Montant en dollars',
  'form.field.direct-pnl-placeholder':
    'Saisir le montant du profit ou de la perte',

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
  'form.placeholder.fx-rate': '1 {currency} = ? {base} (vide : taux du jour)',
  'form.placeholder.custom-tag':
    'Tapez une balise personnalisée et appuyez sur Entrée',
  'form.placeholder.thesis': 'Saisissez votre thèse pour ce trade...',

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
  'button.close': 'Fermer',
  'button.done': 'Fait',
  'button.edit': 'Modifier',
  'button.delete': 'Supprimer',
  'button.update': 'Mettre à jour',
  'button.open': 'Ouvrir',
  'button.add': 'Ajouter',
  'button.create': 'Créer',
  'button.reset': 'Réinitialiser',
  'button.reset-to-defaults': 'Réinitialiser aux valeurs par défaut',

  'button.confirm': 'Confirmer',

  'button.back': 'Retour',
  'button.add-trade': 'Ajouter un trade',
  'button.update-trade': 'Mettre à jour le trade',
  'button.save-changes': 'Enregistrer les modifications',
  'button.create-trade': 'Créer un trade',
  'button.delete-all': 'Supprimer tout',
  'button.clear-all': 'Tout effacer',

  'button.cancel-reset': 'Annuler la réinitialisation',
  'button.proceed-anyway': 'Continuer quand même',
  'button.mark-reviewed': 'Marquer comme révisé',
  'button.maybe-later': 'Peut-être plus tard',
  'button.upgrade-now': 'Mettre à niveau maintenant',

  'button.apply': 'Appliquer',

  'button.learn-more': 'En savoir plus',
  'button.upload-image': 'Télécharger un média',
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
    'La taille du lot doit être supérieure à zéro.',
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
  'trade.validation.fx-rate-number':
    'Le taux de change doit être un nombre valide.',
  'trade.validation.fx-rate-positive':
    'Le taux de change doit être supérieur à zéro.',
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

  'notice.login-success': 'Connecté avec succès !',
  'notice.pro-access-ready': 'L’accès PRO est prêt.',

  'notice.logout-success': 'Déconnexion réussie',
  'notice.ftp-created': "Informations d'identification FTP créées avec succès",
  'notice.ftp-password-rotated':
    "De nouveaux identifiants FTP ont été générés pour cet appareil. La synchronisation FTP configurée sur d'autres appareils (p. ex. votre EA MetaTrader) doit être mise à jour avec le nouveau mot de passe.",
  'notice.ftp-reused':
    "Identifiants FTP existants chargés depuis cet appareil. S'ils ne fonctionnent plus, utilisez Réinitialiser le mot de passe.",
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
  'notice.hotkey-set': 'Raccourci défini : {hotkey}',
  'notice.auto-sync-toggled': 'Synchronisation automatique {status}',
  'notice.auto-sync-enabled': 'activé',
  'notice.auto-sync-disabled': 'désactivé',
  'notice.reset-items': 'Réinitialiser les éléments aux valeurs par défaut',

  'notice.custom-fields-imported':
    'Champs personnalisés {count} importés avec succès',

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
  'notice.trades-duplicated.one': '{count} trade dupliqué',
  'notice.trades-duplicated.few': '{count} trades dupliqués',
  'notice.trades-duplicated.many': '{count} trades dupliqués',
  'notice.trades-duplicated.other': '{count} trades dupliqués',
  'notice.trades-deleted.one': '{count} trade supprimé',
  'notice.trades-deleted.few': '{count} trades supprimés',
  'notice.trades-deleted.many': '{count} trades supprimés',
  'notice.trades-deleted.other': '{count} trades supprimés',
  'notice.mark-reviewed.one': 'Marqué {count} trade comme révisé',
  'notice.mark-reviewed.few': '{count} trades marqués comme revus',
  'notice.mark-reviewed.many': '{count} trades marqués comme revus',
  'notice.mark-reviewed.other': '{count} trades marqués comme revus',

  'notice.error.open-journalit':
    "Échec de l'ouverture de Journalit. Veuillez essayer de recharger Obsidian.",
  'notice.error.open-drc': "Échec de l'ouverture du DRC : {error}",
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

  'notice.error.open-release-notes':
    "Échec de l'ouverture des notes de version : {error}",
  'notice.error.open-update-notification':
    "Échec de l'ouverture de la notification de mise à jour : {error}",
  'notice.error.open-layout-builder':
    "Échec de l'ouverture de Layout Builder : {error}",
  'notice.error.switch-template': 'Échec du changement de layout : {error}',
  'notice.error.switch-template-generic': 'Échec du changement de layout',

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

  'notice.error.cannot-change-folder-during-sync':
    'Impossible de modifier le chemin du dossier pendant la synchronisation. Veuillez attendre la fin de la synchronisation.',
  'notice.error.file-not-found': 'Fichier introuvable : {path}',

  'notice.error.mark-reviewed':
    'Erreur lors du marquage des trades comme revus : {error}',
  'notice.error.add-setups': "Erreur lors de l'ajout des setups : {error}",
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': "Erreur lors de l'ajout d'erreurs : {error}",
  'notice.error.duplicate-trades':
    'Erreur lors de la duplication des trades : {error}',
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

  'trade-form.guide.customization-modal.title':
    'Adaptez le formulaire à votre workflow',
  'trade-form.guide.customization-modal.description':
    'Ici, vous pouvez afficher, masquer et réordonner les blocs optionnels. Gardez le formulaire centré sur les champs que vous utilisez vraiment.',
  'trade-form.guide.finish.title': 'Voilà la fonction de personnalisation',
  'trade-form.guide.finish.description':
    'Vous pouvez revenir à ce bouton chaque fois que le formulaire doit correspondre à un autre workflow de journalisation.',
  'tradelog.guide.empty.intro.title': 'Bienvenue dans le journal des trades',
  'tradelog.guide.empty.intro.description':
    'Cette page devient votre espace principal pour parcourir, trier et examiner les trades. Une fois que vous avez ajouté des trades, vous obtiendrez également la visite complète du journal des trades.',
  'tradelog.guide.empty.state.title': 'Aucune donnée de trading disponible',
  'tradelog.guide.empty.state.description':
    'Importez vos anciens trades pour analyser vos performances dès maintenant, ou enregistrez un nouveau trade manuellement.',
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
  'tradelog.guide.gallery-mode.title': "Il y a aussi une galerie d'images",
  'tradelog.guide.gallery-mode.description':
    'Changez de mode ici pour parcourir vos captures de trades sous forme de galerie. Un court guide vous la présentera à la première ouverture.',
  'tradelog.guide.multi-select.title': 'Activer la sélection multiple',
  'tradelog.guide.multi-select.description':
    'Cliquez sur ce bouton pour sélectionner plusieurs trades à la fois. Lorsque la sélection multiple est activée, les clics sur les lignes sélectionnent les trades au lieu de les ouvrir.',
  'tradelog.guide.batch-actions.title': 'Ce sont vos actions par lots',
  'tradelog.guide.batch-actions.description':
    'Utilisez cette barre pour sélectionner tous les trades visibles, effacer votre sélection, marquer les trades comme revus, ajouter des setups, ajouter des erreurs, dupliquer des trades ou supprimer plusieurs trades à la fois. Vous pouvez également faire un Maj-clic pour sélectionner une plage de trades.',
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
    'Votre Dashboard devient utile dès que Journalit dispose d’un historique de trading à analyser.',
  'dashboard.guide.empty.state.title': 'Conservez votre historique de trading',
  'dashboard.guide.empty.state.description':
    'Importez vos anciens trades pour commencer avec des données de performance utiles, ou ajoutez un trade manuellement si vous enregistrez vos premiers trades.',
  'dashboard.guide.main.intro.title': 'Voici votre tableau de bord',
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
  'home.guide.intro.title': 'Bienvenue chez vous',
  'home.guide.intro.description':
    'Ceci est votre page principale. Il affiche vos statistiques de trading, vos actions rapides et des raccourcis vers le reste de Journalit.',
  'home.guide.filters.title':
    'Ces boutons changent ce que vos widgets affichent',
  'home.guide.filters.description':
    "Utilisez-les pour changer la période, le type de trade ou le compte afin que vos widgets d'accueil affichent les données que vous souhaitez consulter.",
  'home.guide.settings.title':
    'Les paramètres de Journalit sont toujours à portée de main',
  'home.guide.settings.description':
    'Utilisez ce bouton pour ouvrir directement les paramètres de Journalit.',
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
    'Ajoutez des widgets, restaurez des liens rapides ou ajoutez des raccourcis vers des comptes et configurations.',
  'home.guide.move-and-resize.description':
    "Il s'agit de la zone principale que vous pouvez réorganiser en mode édition. Faites glisser les widgets pour les déplacer ou faites glisser un widget depuis son coin inférieur droit pour le redimensionner.",
  'home.guide.add-widget.title': 'Ajoutez des éléments à l’accueil',
  'home.guide.add-widget.description':
    'Ouvrez Ajouter un widget pour ajouter des widgets, des liens rapides ou des raccourcis vers des comptes et configurations.',
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
    'Saisissez un nom, une description ou une catégorie dans le champ de recherche, puis choisissez le widget. Vous pouvez aussi appuyer sur Suivant pour sélectionner le premier résultat.',
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
  'tradelog.status.partially-closed': 'PARTIELLEMENT CLÔTURÉ',
  'tradelog.status.cancelled': 'ANNULÉ',
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

  'tradelog.copy-trade.adjustment-invalid':
    'Saisissez un ajustement de P&L valide.',
  'tradelog.copy-trade.adjustment-saved':
    'Ajustement du P&L du trade copié enregistré.',
  'tradelog.tooltip.still-open': 'toujours ouvert',

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

  'tradelog.batch.add-setups.label': 'Ajouter des setups',
  'tradelog.batch.add-tags.aria': 'Ajouter des tags',

  'tradelog.batch.add-tags.label': 'Ajouter des tags',
  'tradelog.batch.add-mistakes.aria': 'Ajouter des erreurs',

  'tradelog.batch.add-mistakes.label': 'Ajouter des erreurs',
  'tradelog.batch.adding': 'Ajout...',
  'tradelog.batch.add-count': 'Ajouter ({count})',
  'tradelog.batch.duplicate.aria': 'Dupliquer les trades',
  'tradelog.batch.duplicate.label': 'Dupliquer',
  'tradelog.batch.duplicating': 'Duplication...',
  'tradelog.batch.duplicate-skipped.one':
    '{count} note sélectionnée ne peut pas être dupliquée',
  'tradelog.batch.duplicate-skipped.few':
    '{count} notes sélectionnées ne peuvent pas être dupliquées',
  'tradelog.batch.duplicate-skipped.many':
    '{count} notes sélectionnées ne peuvent pas être dupliquées',
  'tradelog.batch.duplicate-skipped.other':
    '{count} notes sélectionnées ne peuvent pas être dupliquées',
  'tradelog.batch.delete.aria': 'Supprimer les trades',

  'tradelog.batch.deleting': 'Suppression...',
  'tradelog.batch.clear.aria': 'Effacer la sélection',

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
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
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
    'Importez vos anciens trades pour analyser vos performances dès maintenant, ou enregistrez un nouveau trade manuellement.',
  'dashboard.empty.import-action': 'Importer des trades existants',
  'dashboard.empty.manual-action': 'Ajouter un trade manuellement',
  'dashboard.empty.filter-hint': "Essayez d'ajuster vos paramètres de filtre",
  'dashboard.error.load-failed': 'Échec du chargement des données',
  'dashboard.no-data': 'Aucune donnée de trading disponible',
  'dashboard.button.add-widget': 'Ajouter un widget',
  'dashboard.button.save-layout': 'Enregistrer la mise en page',
  'dashboard.button.edit-layout': 'Modifier la mise en page',
  'dashboard.metrics.netPnL': 'Résultat net',
  'dashboard.metrics.incl-unrealized': 'dont {value} latent',
  'dashboard.metrics.winRate': 'Taux de réussite',
  'dashboard.metrics.profitFactor': 'Ratio gains/pertes',
  'dashboard.metrics.sharpeRatio': 'Ratio de Sharpe',
  'dashboard.metrics.expectancy': 'Espérance de gain',
  'dashboard.metrics.numTrades': 'Total des trades',

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
  'dashboard.sharpeRatio.tooltip.title': 'Ratio de Sharpe',
  'dashboard.sharpeRatio.tooltip.formula':
    "Formule : P&L net moyen des trades clôturés / écart-type d'échantillon du P&L net des trades clôturés. Le taux sans risque est 0 et la valeur n'est pas annualisée.",
  'dashboard.sharpeRatio.tooltip.coverage':
    'Calculé avec {valid} des {total} trades clôturés',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'Couverture partielle : {valid} des {total} trades clôturés ont un P&L net fini.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'Nécessite au moins deux trades clôturés avec une variabilité de P&L non nulle.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'Ce ratio de Sharpe est basé sur des devises mixtes sans conversion FX et peut être trompeur.',
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

  'dashboard.conversion.using-ecb': 'Utilisation des taux de la BCE ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Utilise le P&L en devise de base fourni par le courtier pour {count} {tradeLabel}',
  'dashboard.conversion.using-manual-rate':
    'Utilisation d’un taux de change manuel pour {count} {tradeLabel}',
  'dashboard.conversion.partial-warning':
    '⚠ Les coûts/risques en {currencies} n’ont pas pu être convertis et sont exclus',
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

  'dashboard.filter.accounts.none-found': 'Aucun compte trouvé',
  'dashboard.filter.accounts.phase-now': 'maintenant',
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

  'dashboard.widgets.hourly-performance.metric.total-r': 'R total',

  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'Aucun trade',
  'dashboard.widgets.setup-performance.title': 'Performance des setups',
  'dashboard.widgets.setup-performance.description':
    'Graphique en barres classé comparant la performance par configuration',
  'dashboard.widgets.setup-performance.empty':
    'Aucune donnée de performance des setups',
  'dashboard.widgets.setup-performance.masked-label': 'Configurations',
  'dashboard.widgets.tag-performance.title': 'Performance des tags',
  'dashboard.widgets.tag-performance.description':
    'Graphique en barres classé comparant la performance par balise',
  'dashboard.widgets.tag-performance.empty':
    'Aucune donnée de performance des tags',
  'dashboard.widgets.tag-performance.masked-label': 'Balises',
  'dashboard.widgets.ticker-performance.title': 'Performance par ticker',
  'dashboard.widgets.ticker-performance.metric-aria': 'Métrique',
  'dashboard.widgets.ticker-performance.view-aria': "Mode d'affichage",
  'dashboard.widgets.ticker-performance.view.best-and-worst':
    'Meilleurs et moins bons',
  'dashboard.widgets.ticker-performance.view.best': '10 meilleurs',
  'dashboard.widgets.ticker-performance.view.worst': '10 moins bons',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'P&L total',
  'dashboard.widgets.ticker-performance.metric.total-r': 'R total',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'Taux de réussite',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'Symbole : {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': 'Opérations : {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Taux de réussite : {rate} ({wins}G / {losses}P)',

  'dashboard.widgets.ticker-performance.empty':
    'Aucune donnée de performance par ticker',
  'dashboard.widgets.ticker-performance.empty-submessage':
    'Aucun trade clôturé avec un ticker ne correspond aux filtres actuels.',
  'dashboard.widgets.ticker-performance.masked-ticker': 'Symbole',
  'dashboard.widgets.ticker-performance.omitted-count': 'Omis : {count}',

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
  'dashboard.rolling_win_loss.ratio_undefined':
    'Rapport : aucune perte sur la période',
  'dashboard.rolling_win_loss.avg_win_label': 'Gain moyen : {value}',
  'dashboard.rolling_win_loss.no_losses_band': 'Aucune perte',
  'dashboard.rolling_win_loss.window_not_filled':
    'Nécessite au moins {count} trades clôturés',
  'dashboard.rolling_win_loss.avg_loss_label': 'Perte moyenne : {value}',
  'home.widget.recent-items.name': 'Articles récents',
  'home.widget.recent-items.description':
    'Affiche les fichiers et les vues récemment ouverts',
  'home.widget.year-heatmap.name': 'Carte thermique du trading',
  'home.widget.year-heatmap.description':
    "Calendrier montrant votre activité de trading pour l'année",
  'home.widget.getting-started.name': 'Commencer',
  'home.widget.getting-started.description':
    'Liste de contrôle pour ajouter votre historique de trading et configurer Journalit',
  'home.widget.getting-started.progress': '{completed}/{total} terminé',
  'home.widget.getting-started.progress.loading': 'Vérification des progrès...',
  'home.widget.getting-started.item.account.title':
    'Configurez votre compte de trading',
  'home.widget.getting-started.item.account.description':
    'Les trades sont enregistrés sur un compte qui suit votre solde. Sans compte, le rendement et le drawdown ne peuvent pas être calculés.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'Configurer le compte',
  'home.widget.getting-started.item.create.title':
    'Importez votre historique de trading',
  'home.widget.getting-started.item.create.description':
    'Importez des trades existants, connectez Trade Sync ou ajoutez votre premier trade manuellement.',
  'home.widget.getting-started.item.create.time': 'années 30',
  'home.widget.getting-started.item.create.cta': 'Ouvrir Trade Import',
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
  'home.widget.getting-started.item.sidebar.title':
    'Ouvrir la barre latérale de navigation',
  'home.widget.getting-started.item.sidebar.description':
    'Accédez rapidement aux pages, revues, outils et à la recherche de Journalit.',
  'home.widget.getting-started.item.sidebar.time': '10 secondes',
  'home.widget.getting-started.item.sidebar.cta': 'Ouvrir la barre latérale',
  'home.widget.getting-started.item.pro.title': 'Activer Pro',
  'home.widget.getting-started.item.pro.description':
    'Activez Trade Import, Trade Sync et le Calendrier économique.',
  'home.widget.getting-started.item.pro.time': '1 minute',
  'home.widget.getting-started.item.pro.cta': 'Activer',
  'home.widget.weekly-summary.name': 'Résumé hebdomadaire',
  'home.widget.weekly-summary.description':
    'Mesures de la semaine en cours avec graphique sparkline P&L quotidien',
  'home.widget.key-events.name': 'Événements clés',
  'home.widget.key-events.description':
    'Actualités et événements de marché importants de la revue hebdomadaire en cours',
  'home.widget.key-events.empty-title': 'Aucun événement clé',
  'home.widget.key-events.open-aria':
    'Ouvrir la revue hebdomadaire de cette semaine',
  'home.widget.position-size.name': 'Calculateur de taille de position',
  'home.widget.position-size.description':
    'Calculer la taille de la position en fonction du pourcentage de risque du compte',
  'home.widget.embedded-note.name': 'Remarque intégrée',
  'home.widget.embedded-note.description':
    "Afficher n'importe quelle note de Markdown de votre vault",
  'home.widget.current-streak.name': 'Série actuelle',
  'home.widget.current-streak.description':
    'Suivez les séries de trades et de revues',
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
  'account.header.back-to-dashboard': 'Retour au tableau de bord',
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
  'account.header.warning.trades-before-phase.one':
    '{count} trade trouvé avant le début de la Phase 1',
  'account.header.warning.trades-before-phase.few':
    '{count} trades trouvés avant le début de la Phase 1',
  'account.header.warning.trades-before-phase.many':
    '{count} trades trouvés avant le début de la Phase 1',
  'account.header.warning.trades-before-phase.other':
    '{count} trades trouvés avant le début de la Phase 1',
  'account.header.warning.earliest-trade-phase':
    'Première trade : {date}. Les trades antérieurs au début de la phase ne comptent pas pour le challenge.',
  'account.header.notice.phase-start-updated':
    'Début de la Phase 1 déplacé au {date}',
  'account.header.warning.earliest-trade':
    'Première trade : {date}. Cela peut entraîner des calculs de solde incorrects.',
  'account.header.warning.fix-phase-start.aria':
    'Corriger le début de la Phase 1',
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

  'view.dashboard': 'Tableau de bord',
  'view.trade-log': 'Journal des trades',
  'view.account-dashboard': 'Comptes',
  'view.account-page.title': 'Compte : {name}',
  'view.account-page.title-default': 'Page de compte',
  'view.account-page.no-account-selected': 'Aucun compte sélectionné',
  'view.account-page.no-account-instructions':
    'Ouvrez cette page depuis Comptes.',
  'view.account-page.service-loading':
    'Chargement du service de page de compte...',
  'view.account-page.balance-chart-title': 'Tableau du solde du compte',
  'view.account-page.balance-chart-loading':
    'Chargement du tableau du solde...',
  'view.layout-builder': 'Layout Builder',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': 'Calendrier économique',
  'view.economic-calendar.this-week': 'Cette semaine',
  'view.economic-calendar.sync.aria':
    'Ouvrir les réglages du calendrier économique',
  'view.economic-calendar.import-count.one': 'Importer {count} événement',
  'view.economic-calendar.import-count.few': 'Importer {count} événements',
  'view.economic-calendar.import-count.many': 'Importer {count} événements',
  'view.economic-calendar.import-count.other': 'Importer {count} événements',
  'view.economic-calendar.imported': 'Importé',
  'view.economic-calendar.update-available': 'Mise à jour disponible',
  'view.economic-calendar.filter.currency': 'Devise',
  'view.economic-calendar.filter.impact': 'Impact',
  'view.economic-calendar.impact.high': 'Élevé',
  'view.economic-calendar.impact.medium': 'Moyen',
  'view.economic-calendar.impact.low': 'Faible',
  'view.economic-calendar.impact.none': 'Aucun',
  'view.economic-calendar.pro-required':
    'Le calendrier économique nécessite Journalit Pro',
  'view.economic-calendar.error.offline':
    'Impossible de charger le calendrier économique hors ligne.',
  'view.economic-calendar.error.generic':
    'Impossible de charger le calendrier économique.',
  'view.economic-calendar.empty':
    'Aucun événement économique pour cette semaine.',
  'view.economic-calendar.refresh': 'Actualiser les événements',
  'view.economic-calendar.retry': 'Réessayer',
  'view.economic-calendar.select-all': 'Tout sélectionner',
  'view.economic-calendar.select-aria': 'Sélectionner {event}',
  'view.economic-calendar.impact-aria': 'Impact : {impact}',
  'view.economic-calendar.all-day': 'Toute la journée',
  'view.economic-calendar.holiday-aria': 'Jour férié',
  'view.economic-calendar.forecast': 'Prévision',
  'view.economic-calendar.previous': 'Précédent',
  'view.economic-calendar.actual': 'Réel',
  'view.economic-calendar.import-success':
    '{imported} importés, {updated} mis à jour',
  'view.economic-calendar.import-failed':
    "Impossible d'importer les événements.",
  'view.economic-calendar.restore-missing-events':
    'Restaurer les événements manquants ({count})',
  'economicCalendar.guide.main.intro.description':
    'Consultez ici toute la semaine. Journalit peut aussi tenir votre bilan hebdomadaire à jour automatiquement, l’importation manuelle reste donc facultative.',
  'economicCalendar.guide.main.filters.title':
    'Ces filtres modifient uniquement ce calendrier',
  'economicCalendar.guide.main.filters.description':
    'Les filtres de devise et d’impact limitent ce que vous voyez et sélectionnez ici. Ils ne modifient pas vos règles d’importation automatique.',
  'economicCalendar.guide.main.settings.title':
    'Configurer l’importation automatique dans les réglages',
  'economicCalendar.guide.main.settings.description':
    'Utilisez ce bouton pour choisir les devises, les niveaux d’impact et les jours fériés, puis activez l’importation automatique. Journalit synchronise la semaine en cours avec votre bilan hebdomadaire et actualise les données importées sans rajouter les événements que vous avez volontairement supprimés.',
  'economicCalendar.guide.main.manual-import.title':
    'Les importations manuelles sont facultatives',
  'economicCalendar.guide.main.manual-import.description':
    'Sélectionnez les lignes visibles et utilisez Importer les événements pour un import ponctuel. Cette opération n’est pas nécessaire chaque semaine lorsque l’importation automatique est activée.',
  'economicCalendar.guide.main.restore.title':
    'Restaurer les événements configurés manquants',
  'economicCalendar.guide.main.restore.description':
    'Ce bouton devient disponible si des événements correspondant à votre périmètre d’importation automatique manquent. Lorsque la semaine est de nouveau complète, il reste visible mais désactivé.',
  'economicCalendar.guide.main.summary.title':
    'Configurez une fois, puis consultez',
  'economicCalendar.guide.main.summary.description':
    'Une fois l’importation automatique configurée, votre bilan hebdomadaire reste alimenté. Revenez ici pour consulter, effectuer un import ponctuel ou restaurer des événements manquants.',
  'view.economic-calendar.pro-benefit':
    'Les événements à fort impact dans votre note hebdomadaire.',
  'view.economic-calendar.pro-benefit-trial':
    'Commencez avec un essai gratuit de 14 jours.',
  'settings.economic-calendar.title': 'Calendrier économique',
  'settings.economic-calendar.description':
    'Importe automatiquement les événements économiques de la semaine dans les événements clés de votre note hebdomadaire.',
  'settings.economic-calendar.auto-import':
    'Importer automatiquement les événements de la semaine',
  'settings.economic-calendar.auto-import-desc':
    'Garde la note hebdomadaire actuelle synchronisée avec le calendrier.',
  'settings.economic-calendar.currencies': 'Devises',
  'settings.economic-calendar.currencies-desc':
    'Importer les événements de ces devises. Sans sélection, toutes sont incluses.',
  'settings.economic-calendar.impacts': 'Niveaux d’impact',
  'settings.economic-calendar.impacts-desc':
    'Importer les événements ayant ces niveaux d’impact.',
  'settings.economic-calendar.impacts-empty':
    'Aucune publication sélectionnée. Les jours fériés peuvent encore être importés s’ils sont activés.',
  'settings.economic-calendar.include-holidays': 'Inclure les jours fériés',
  'settings.economic-calendar.include-holidays-desc':
    'Importer les jours fériés bancaires et les comptes rendus des banques centrales comme événements sur toute la journée.',
  'settings.economic-calendar.open-view': 'Ouvrir le calendrier économique',
  'settings.economic-calendar.open-view-desc':
    'Parcourir la semaine et importer des événements manuellement.',
  'settings.economic-calendar.pro-required':
    'Le calendrier économique nécessite un abonnement PRO.',
  'status-bar.update-available-branded': 'Mettre à jour Journalit',
  'status-bar.release-notes-branded':
    'Journalit · Afficher les notes de version',
  'status-bar.update-aria-label': 'Journalit {version} - Cliquez pour voir',
  'update.available.ready': 'Une nouvelle version est disponible',
  'template.transformation.orphaned-content.header':
    'Contenu du modèle précédent',
  'template.transformation.orphaned-content.desc1':
    'Le contenu suivant ne correspondait pas à la nouvelle présentation du modèle.',
  'template.transformation.orphaned-content.desc2':
    "Vérifiez-le et intégrez-le ci-dessus, ou supprimez-le s'il n'est plus nécessaire.",
  'template.editor.loading': 'Chargement du modèle...',
  'template.editor.built-in': 'Intégré',
  'template.editor.unsaved-changes': 'Modifications non enregistrées',

  'template.editor.built-in-notice':
    'Les modèles intégrés ne peuvent pas être modifiés. Dupliquez ce modèle ou créez-en un nouveau à personnaliser.',

  'template.editor.show-review-desc':
    'Quand afficher la section de revue sur les notes de trading',

  'template.editor.section-visibility': 'Visibilité des sections',
  'template.editor.trade-note-layout': 'Disposition de note de trade',

  'template.editor.other-asset-types': 'Autres',

  'template.editor.asset-type-add': 'Type d’actif',

  'template.editor.remove-asset-layout': 'Supprimer la disposition de l’actif',

  'template.editor.metrics': 'Métriques',
  'template.editor.metrics-desc':
    'Afficher les cartes entrée, sortie, durée et plan',
  'template.editor.thesis': 'Thèse',
  'template.editor.thesis-desc': 'Afficher le bloc de thèse du trade',
  'template.editor.missed-reason': 'Raison du trade manqué',
  'template.editor.missed-reason-desc':
    'Afficher pourquoi le trade manqué n’a pas été pris',
  'template.editor.metric-cards': 'Cartes de métriques',
  'template.editor.metadata-rows': 'Lignes de métadonnées',
  'template.editor.accounts': 'Comptes',
  'template.editor.setups': 'Configurations',
  'template.editor.mistakes': 'Erreurs',
  'template.editor.tags': 'Étiquettes',
  'template.editor.custom-fields': 'Champs personnalisés',
  'template.editor.custom-fields-desc':
    '{count} champs personnalisés configurés',

  'template.editor.metric.position-size': 'Taille de position',
  'template.editor.metric.execution-breakdown': 'Détail d’exécution',
  'template.editor.metric.pnl': 'Pertes et profits',
  'template.editor.metric.r-multiple': 'Multiple R',
  'template.editor.metric.costs': 'Coûts',
  'template.editor.nav-bar': 'Barre de navigation',
  'template.editor.nav-bar-desc':
    'Afficher la chronologie des trades et consulter les liens',
  'template.editor.images': 'Images',
  'template.editor.images-desc':
    'Afficher les images des graphiques de trading',
  'template.editor.metadata': 'Métadonnées',
  'template.editor.metadata-desc':
    'Afficher les comptes, les setups et les erreurs',

  'template.editor.review-button': 'Bouton Marquer comme révisé',
  'template.editor.review-button-desc':
    'Afficher le bouton pour marquer le trade comme révisé',

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

  'csv.mapper.asset-type.help':
    "Sélectionnez le type d'instrument dans ce fichier. Cela détermine les champs requis et la logique d’analyse.",

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

  'csv.template-import.label.share-code': 'Partager le code',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': "Modèle d'importation",

  'csv.template-import.error.import-failed': "Échec de l'importation du modèle",

  'csv.export-template.label.share-code': 'Partager le code',

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

  'csv.broker.label': "Broker / Format d'importation",

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
  'csv.broker.jdr': 'MetaTrader 4 / 5',

  'csv.account-selector.favorite.remove': 'Supprimer des favoris',
  'csv.account-selector.favorite.set': 'Définir comme favori',

  'csv.results.successfully-imported-suffix': 'trades',

  'csv.results.failed-to-import-prefix': "Échec de l'importation",
  'csv.results.failed-to-import-suffix': 'lignes (voir détails ci-dessous)',

  'csv.results.pending-local-writes':
    '{count} écriture(s) de notes de trading sont encore en attente. Journalit rapprochera les écritures terminées et laissera les projections inachevées disponibles pour restauration.',
  'csv.results.pending-title': "L'importation est toujours en cours",

  'csv.image-review.count': '{count} image(s)',

  'image.uploader.paste-title': 'Coller un média du presse-papiers (Ctrl+V)',
  'image.uploader.pasting': 'Coller...',
  'image.uploader.paste': 'Coller',
  'image.uploader.url-placeholder':
    "Coller l'URL de l'image ou le chemin du fichier...",
  'image.uploader.url-input-aria': "Saisie de l'URL du média",
  'image.uploader.file-upload-aria': "Télécharger à partir d'un fichier",
  'image.uploader.paste-clipboard-aria': 'Coller depuis le presse-papiers',
  'image.uploader.error-invalid-url':
    "URL de l'image invalide. Veuillez saisir un lien d'image direct.",
  'image.viewer.alt-default': 'Image',
  'image.viewer.description-default': 'Aperçu du média',

  'image.viewer.title-fullscreen': 'Cliquez pour voir en plein écran',

  'image.viewer.delete-button': 'Supprimer le média',
  'image.viewer.nav-prev': 'Image précédente',
  'image.viewer.nav-next': 'Image suivante',
  'image.viewer.zoom-in-hint': 'Pincez ou cliquez pour zoomer',
  'image.viewer.zoom-out-hint':
    '{scale}x (pincer ou cliquer pour effectuer un zoom arrière)',

  'image.viewer.close-aria': 'Fermer le mode plein écran',
  'image.viewer.copy-image': 'Copier l’image',

  'image.viewer.copied': 'Copié',
  'image.viewer.copy-failed':
    'Impossible de copier l’image dans le presse-papiers',
  'image.viewer.copy-unsupported':
    'La copie d’images dans le presse-papiers n’est pas prise en charge dans cet environnement',
  'media.viewer.video-controls': 'Contrôles vidéo',
  'media.viewer.play-video': 'Lire la vidéo',
  'media.viewer.pause-video': 'Mettre la vidéo en pause',
  'media.viewer.mute-video': 'Couper le son de la vidéo',
  'media.viewer.unmute-video': 'Réactiver le son de la vidéo',
  'media.viewer.volume': 'Volume',
  'media.viewer.back-5': 'Reculer de 5 secondes',
  'media.viewer.forward-5': 'Avancer de 5 secondes',
  'media.viewer.timeline': 'Chronologie de la vidéo',

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

  'datepicker.button.clear': 'Claire',
  'datepicker.button.today': "Aujourd'hui",
  'datepicker.button.now': 'Maintenant',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'AA',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',
  'common.loading': 'Chargement...',
  'common.error': 'Erreur',

  'common.warning': 'Avertissement',
  'common.info': 'Informations',
  'common.yes': 'Oui',
  'common.no': 'Non',
  'common.ok': "D'ACCORD",

  'common.select-option': 'Sélectionnez une option',

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

  'common.date': 'Date',

  'common.days': 'Jours',
  'common.week': 'Semaine',
  'common.weeks': 'Semaines',
  'common.month': 'Mois',
  'common.months': 'Mois',
  'common.year': 'Année',
  'common.years': 'Années',
  'common.quarter': 'Quart',
  'common.quarters': 'Quartiers',

  'common.min': 'Min.',
  'common.max': 'Max.',
  'common.best': 'Meilleure',
  'common.worst': 'Pire',
  'common.profit': 'Profit',

  'common.trade': 'Trade',
  'common.trades': 'Trades',

  'common.statuses': 'Statuts',
  'common.enabled': 'activé',
  'common.disabled': 'désactivé',
  'common.color.gray': 'Grise',
  'common.color.red': 'Rouge',
  'common.color.orange': 'Orange',
  'common.color.yellow': 'Jaune',
  'common.color.label': 'Couleur',
  'common.color.default': 'Par défaut',
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

  'chart.tooltip.trade-pnl': 'P&L du trade',

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
  'settings.ftp.instructions.title':
    'Instructions de configuration de MetaTrader 4 :',
  'settings.ftp.instructions.step1': 'Ouvrez MetaTrader 4 (MT4)',
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

  'settings.auth.status-offline': 'Hors ligne',
  'settings.auth.status-online': 'En ligne',

  'settings.auth.signed-in': 'Connecté',
  'settings.auth.sign-in-up': "Se connecter / S'inscrire",
  'settings.auth.sign-out': 'se déconnecter',

  'settings.auth.subscription-features': "Fonctionnalités d'abonnement",

  'settings.auth.offline-mode': 'Mode hors ligne',

  'settings.auth.guest': 'Invitée',

  'settings.auth.your-plan': 'Votre plan',

  'settings.auth.manage-subscription': "Gérer l'abonnement",
  'settings.tab.general': 'Générale',
  'settings.tab.reviews': 'Revues',

  'settings.tab.customization': 'Personnalisation',
  'settings.tab.journal-setup': 'Journal',
  'settings.tab.backend': 'Synchronisation de trading',
  'settings.tab.trading': 'Valeurs par défaut des trades',
  'settings.tab.sync': 'Compte et synchronisation',
  'settings.tab.accounts': 'Compte',
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Revue hebdomadaire',
  'settings.reviews.monthly': 'Revue mensuelle',
  'settings.reviews.quarterly': 'Revue trimestrielle',
  'settings.reviews.yearly': 'Revue annuelle',
  'settings.reviews.default-templates': 'Layouts par défaut',

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
  'settings.general.review-links-new-tab':
    'Ouvrir les liens des widgets de revue dans de nouveaux onglets',
  'settings.general.review-links-new-tab-desc':
    'Si cette option est désactivée, les liens remplacent l’onglet actuel.',
  'settings.general.review-links-new-tab-aria':
    'Ouvrir les liens de notes des widgets de revue dans de nouveaux onglets',
  'settings.general.tab-behavior': 'Comportement des onglets',
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

  'settings.reviews.notice.builder-not-found':
    'Commande Layout Builder introuvable',
  'settings.reviews.notice.global-auto-create':
    'Création automatique pour tous les revue {status}',
  'settings.reviews.notice.auto-create-nav':
    'Créer automatiquement {type} lors de la navigation {status}',
  'settings.reviews.daily.checklist-title':
    'Éléments de la liste de contrôle pré-trade',

  'settings.reviews.daily.questions-title': 'Questions de revue',

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
  'library.error.export-too-large':
    'Ce layout est trop volumineux pour être exporté comme code de partage.',
  'library.notice.copied': 'Partager le code copié dans le presse-papier !',
  'library.error.copy-failed': 'Échec de la copie dans le presse-papiers',
  'library.title.import': "Layout d'importation",
  'library.desc.import':
    "Collez un code de partage JRT pour importer un layout d'un autre utilisateur.",
  'library.label.share-code': 'Partager le code',
  'library.placeholder.import-code': 'Collez JRT-... partagez le code ici',
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

  'settings.reviews.daily.timeframes-title': 'Délais de prévision',

  'settings.reviews.daily.timeframes-placeholder':
    'Nouveau délai (par exemple, 15 M, 5 M)',
  'settings.weekly.review-questions': 'Questions de revue',

  'settings.weekly.forecast-timeframes': 'Délais de prévision',

  'settings.shared.timeframes.title': 'Délais de prévision',

  'settings.shared.timeframes.placeholder':
    'Nouveau délai (par exemple, 15 M, 5 M)',

  'shared.empty-state.message': 'Aucune donnée disponible',

  'weekly.tab.review': 'Revue',
  'weekly.review.drcs.title': 'Bilans quotidiens de cette semaine',

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
  'account.settings.section.challenge-stages.title': 'Étapes du challenge',
  'account.settings.section.challenge-stages.desc':
    'Type de compte appliqué lorsqu’un challenge atteint cette étape.',
  'account.settings.section.challenge-stages.no-change': 'Aucun changement',
  'account.settings.section.challenge-stages.aria':
    'Type de compte pour {stage}',
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

  'account.settings.section.order.move-up': 'Monter',
  'account.settings.section.order.move-down': 'Descendre',
  'account.settings.button.save': 'Enregistrer les paramètres',
  'account.settings.button.saving': 'Économie...',

  'weekly.review.performance.title': 'Auto-évaluation de la performance',
  'weekly.review.performance.mental': 'Performance mentale',

  'weekly.review.performance.technical': 'Exécution technique',

  'weekly.review.questions.title': 'Questions de revue hebdomadaire',

  'weekly.review.goals.title': 'Objectifs pour la semaine prochaine',

  'weekly.preparation.goals.title': 'Objectifs hebdomadaires',

  'weekly.preparation.events.title': 'Événements clés',

  'weekly.preparation.events.add-button': 'Ajouter un événement',

  'weekly.preparation.forecast.title': 'Prévisions hebdomadaires',
  'weekly.overview.pnl-chart.title': 'P&L cumulé hebdomadaire',

  'weekly.overview.drawdown-chart.title': 'Drawdown hebdomadaire',

  'weekly.overview.performance.title': 'Performance hebdomadaire',

  'weekly.overview.setup-performance.title': 'Performances de setup',

  'weekly.overview.trades-chart.title': 'Trades hebdomadaires',

  'weekly.overview.best-trade.title': 'Meilleur trade de la semaine',

  'weekly.overview.worst-trade.title': 'Le pire trade de la semaine',

  'weekly.overview.daily-performance.title': 'Performances quotidiennes',

  'weekly.overview.button.create-trade': 'Créer un trade',
  'weekly.overview.button.view-trade-details': 'Afficher les détails du trade',

  'monthly.tab.review': 'Revue',

  'backend.title': 'Synchronisation de trading',
  'backend.description':
    'Configurez Trade Sync pour les courtiers pris en charge afin de maintenir votre coffre à jour automatiquement.',

  'trade-sync.gate.pro.description':
    'La synchronisation des trades est une fonctionnalité Pro. Mettez à niveau pour continuer.',

  'trade-sync.gate.feature-unavailable.title': 'Fonctionnalité indisponible',
  'trade-sync.gate.feature-unavailable.description':
    'Cette fonctionnalité de synchronisation n’est pas activée pour votre compte Pro. Actualisez votre statut ou contactez l’assistance si le problème persiste.',
  'trade-sync.trial.title': 'Automatisez votre journal de trading',
  'trade-sync.trial.description':
    'Gagnez jusqu’à 7 heures par semaine avec Journalit Pro.',
  'trade-sync.trial.benefit.sync': 'Synchronisation automatique des trades',
  'trade-sync.trial.benefit.import': 'Importez des trades depuis n’importe où',
  'trade-sync.trial.cta': 'Commencez votre essai gratuit de 14 jours',
  'trade-sync.trial.existing-subscriber': 'Déjà abonné ? Connectez-vous',
  'trade-sync.trial.eligibility': 'Essai gratuit réservé aux nouveaux abonnés.',

  'premium.gate.cta.continue-pro': 'Continuer vers Pro',

  'premium.gate.cta.refresh': "Actualiser l'état",

  'premium.gate.offline':
    "Vous semblez être hors ligne. L'activation nécessite Internet.",
  'premium.gate.not-pro-yet':
    "Vous êtes connecté, mais votre compte n'est pas encore Pro. Mettez à niveau puis actualisez.",

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

  'backend.sync.auto-sync': 'Activer la synchronisation automatique',
  'backend.sync.auto-sync-desc':
    'Synchronisez automatiquement les trades depuis le serveur backend',
  'backend.sync.auto-sync-info':
    'La synchronisation automatique vérifie les nouvelles trades toutes les heures',
  'backend.sync.auto-sync-aria': 'Activer la synchronisation automatique',

  'backend.sync.syncing': 'Synchronisation...',

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

  'backend.cards.connection.title': 'Connexion',
  'backend.cards.connection.refresh': 'Rafraîchir',
  'backend.cards.sync.title': 'Statut de synchronisation',
  'backend.cards.sync.last-sync': 'Dernière synchronisation',
  'backend.cards.sync.total': 'Synchronisations totales',
  'backend.cards.sync.button': 'Synchroniser maintenant',
  'backend.cards.sync.cancel': 'Annuler la synchronisation',
  'backend.cards.accounts.title': 'Comptes',
  'backend.cards.accounts.linked': 'Comptes liés',
  'backend.cards.accounts.manage': 'Gérer',
  'backend.section.setup.title': 'Setup et setup',
  'backend.section.sync.title': 'Paramètres de synchronisation',
  'backend.section.accounts.title': 'Gestion des comptes',
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'Mapping Trade Import IA',
  'settings.auth.feature.trade-sync': 'Synchronisation des trades',
  'settings.auth.feature.economic-calendar': 'Calendrier économique',
  'settings.auth.feature.basic-tracking': 'Suivi de trading de base',

  'settings.auth.feature.manual-entry': 'Saisie manuelle des trades',
  'settings.auth.feature.analytics-reviews': 'Analyses et revue',
  'settings.auth.feature.priority-support': 'Assistance prioritaire',
  'backend.sync.just-now': "Tout à l' heure",
  'backend.sync.minutes-ago': 'il y a {count} minutes',
  'backend.sync.hours-ago': 'Il y a {count} heures',
  'backend.sync.days-ago': 'Il y a {count} jours',

  'csv.format': "Format d'importation :",

  'csv.button.export-template': "Modèle d'exportation",
  'csv.button.delete-template': 'Supprimer le modèle',

  'csv.button.import-another': 'Importer un autre fichier',
  'csv.results.complete': 'Importation terminée',
  'csv.results.history-ready': 'Votre historique de trading est prêt',
  'csv.results.completed-with-issues':
    "L'importation s'est terminée avec des problèmes",
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

  'csv.results.broker': 'Broker : {broker}',

  'csv.results.more-trades.one': 'et {count} plus de trades...',
  'csv.results.more-trades.few': 'et {count} trades supplémentaires...',
  'csv.results.more-trades.many': 'et {count} trades supplémentaires...',
  'csv.results.more-trades.other': 'et {count} trades supplémentaires...',
  'csv.results.errors-header': 'CLIQUEZ POUR VOIR LES ERREURS ({count})',
  'csv.results.discord-note':
    "Facultatif : si vous avez besoin d'aide, cliquez sur Copier le rapport et collez-le dans Discord.",

  'csv.errors.copy-report': 'Copier le rapport',

  'csv.errors.copied': 'Copié',
  'csv.errors.rows': 'Lignes : {rows}',
  'csv.errors.suggestion': 'Suggestion:',

  'csv.errors.raw-errors-limit':
    'Affichage des {shown} premières erreurs sur {total}',

  'csv.report.plugin-version': 'Version du plugin : {version}',

  'csv.report.broker': 'Broker : {broker}',

  'csv.report.top-issues': 'Problèmes majeurs :',

  'csv.broker-guide.tradovate.step-2':
    'Cliquez sur l\'onglet "Commandes" (PAS l\'onglet Performance)',

  'csv.broker-guide.tradovate.warning.emphasis': 'Important :',
  'csv.broker-guide.tradovate.warning.message':
    "Utilisez uniquement l'onglet Commandes. L'onglet Performances n'est pas compatible.",

  'csv.broker-guide.ibkr.warning.emphasis': 'Doit utiliser les commandes',

  'csv.broker-guide.tradingview.step-3':
    'Sélectionnez « Historique des commandes » dans la liste déroulante',

  'csv.broker-guide.tradingview.warning.message':
    "Les autres types d'exportation (tels que les positions ou les commandes) ne fonctionneront pas pour l'importation.",

  'csv.broker-guide.hyperliquid.warning.emphasis': 'Limite de 10 000 entrées.',

  'csv.broker-guide.sierrachart.step-1':
    'Ouvrir le journal des activités de trading (Trade → Journal des activités de trading ou Ctrl+Shift+A)',

  'csv.broker-guide.atas.warning.emphasis': 'Important :',
  'csv.broker-guide.atas.warning.message':
    "Ne modifiez pas le fichier exporté. Journalit préserve les trades de la feuille « Journal » et, lorsqu'elle est disponible, enrichit les commissions en utilisant les remplissages correspondants de la feuille « Exécutions ».",

  'csv.broker-guide.rithmic.warning.emphasis': 'Important :',

  'csv.broker-guide.jdr.warning.emphasis': 'Important :',

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
  'upgrade.benefit.economic-calendar':
    'Calendrier économique avec importation automatique des événements hebdomadaires',
  'upgrade.benefit.trade-sync': 'Trade Sync pour les courtiers pris en charge',
  'upgrade.benefit.multi-account': 'Prise en charge multi-comptes',
  'upgrade.prop-profiles.message-firms':
    'Journalit tient prêtes les règles de {count} sociétés prop pour préremplir votre challenge.',
  'upgrade.prop-profiles.message-firm':
    'Journalit a les règles de chaque challenge {firm} prêtes à préremplir.',
  'upgrade.prop-profiles.message':
    'Journalit garde les règles des prop firms prêtes à préremplir votre challenge.',
  'upgrade.prop-profiles.benefits-title': 'Ce que Pro remplit pour vous :',
  'upgrade.benefit.prop.rules':
    'Limites de drawdown et de perte journalière, issues des règles de votre société',
  'upgrade.benefit.prop.payout':
    'Seuils de paiement et conditions d’éligibilité',
  'upgrade.benefit.prop.phases':
    'Objectifs de phase et progression du challenge choisi',
  'upgrade.benefit.prop.updates':
    'Mises à jour des règles quand votre société les modifie',
  'upgrade.trial-notice':
    "Bénéficiez d'un essai gratuit de 2 semaines pour importer toutes vos trades historiques et essayez toutes les fonctionnalités Pro sans risque.",

  'monthly.overview.drawdown': 'Drawdown mensuel',
  'monthly.overview.no-drawdown-data': 'Aucune donnée de drawdown à afficher',

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
    'Les mouvements de trésorerie sont suivis ici',
  'account-page.guide.empty.transactions.description':
    'Cette section conserve ligne par ligne l’historique des dépôts et retraits manuels, présentés comme des retraits de gains sur un compte de prop challenge. Lorsqu’elle est vide, utilisez Ajouter un événement pour créer le premier.',
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
    'Le panneau de métriques connecté présente le facteur de profit, les résultats moyens, les trades gagnants et perdants, les commissions, les frais, les coûts ponctuels configurés ainsi que les coûts récurrents estimés du compte.',
  'account-page.guide.main.risk.title':
    'La progression des risques est suivie séparément ici',
  'account-page.guide.main.risk.description':
    'Cette section montre la progression du drawdown et de l’objectif de profit. Si le compte suit un challenge prop, sa phase actuelle et ses règles apparaissent juste en dessous.',
  'account-page.guide.main.transactions.title':
    'Les mouvements de trésorerie ont leur propre section',
  'account-page.guide.main.transactions.description':
    'Chaque ligne enregistre un mouvement de trésorerie avec son montant et le solde obtenu, afin de séparer la trésorerie de la performance de trading. Sur un compte de prop challenge, le même tableau s’affiche sous forme de retraits de gains numérotés.',
  'account-page.guide.main.trade-log.title':
    'Les trades liés ouvrent la note de trading réelle',
  'account-page.guide.main.trade-log.description':
    'Ouvre le Trade Log avec ce compte déjà sélectionné. Sur un challenge à plusieurs phases, le bouton suit la phase que vous consultez ; la flèche propose les autres phases ou l’ensemble du compte.',
  'account-page.guide.main.add-event.title':
    'Ajouter des dépôts et des retraits d’enregistrements d’événements',
  'account-page.guide.main.add-event.description':
    "Utilisez-le chaque fois que de l'argent est ajouté ou supprimé en dehors des résultats de trading normaux, afin que l'historique du compte reste précis.",
  'account-page.guide.main.edit-account.title':
    'Modifier le compte modifie les paramètres du compte',
  'account-page.guide.main.edit-account.description':
    "C'est ici que vous mettez à jour les détails du compte, les règles de risque, les drawdowns et l'objectif de profit s'ils changent au fil du temps.",
  'account-dashboard.title': 'Comptes',
  'account-dashboard.copy-badge.base': 'SOURCE',
  'account-dashboard.copy-badge.copy': 'COPIEUR',
  'account-dashboard.copy-badge.copied-by': 'Copié par',
  'account-dashboard.copy-badge.copies-tooltip-masked': 'Copie {account}',
  'account-dashboard.copy-badge.copies-tooltip':
    'Copie {account} à {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService non initialisé après plusieurs tentatives',
  'account-dashboard.error.loading':
    'Erreur lors du chargement des comptes : {error}',
  'account-dashboard.error.retry':
    "AccountPageService n'est pas prêt, nouvelle tentative dans {delay}ms (tentative {attempt}/{max})",
  'account-dashboard.challenges.empty.title': 'Aucun challenge pour l’instant',
  'account-dashboard.challenges.empty.message':
    'Suivez un challenge de prop firm comme un seul compte avec phases, règles et paiements.',
  'account-dashboard.challenges.empty.create': 'Nouveau challenge',
  'account-dashboard.challenges.empty.setup':
    'Configurer les comptes existants',
  'account-dashboard.empty.title': 'Aucun compte trouvé',
  'account-dashboard.empty.message':
    'Créez un compte pour commencer à suivre vos performances de trading',
  'account-dashboard.section.empty': 'Aucun compte {type}',
  'account-dashboard.section.empty-sub': 'Créez un compte pour le voir ici',
  'account-dashboard.button.create-first': 'Créez votre premier compte',
  'account-dashboard.action.create': 'Créer un nouveau compte',
  'account-dashboard.action.settings': 'Paramètres des comptes',
  'account-dashboard.weight-bar.aria':
    'Répartition des actifs sous gestion par type de compte',
  'account-dashboard.weight-bar.segment-aria':
    "{name} : {percent} % de l'actif total sous gestion",
  'account-dashboard.guide.empty.intro.title':
    'Cette page conserve tous vos comptes au même endroit',
  'account-dashboard.guide.empty.intro.description':
    'Utilisez Comptes pour voir tous vos comptes ensemble. Dès que des comptes existent, cette page permet de les comparer rapidement.',
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
  'account-dashboard.guide.main.intro.title': 'Voici vos comptes',
  'account-dashboard.guide.main.intro.description':
    'Utilisez cette page pour comparer les comptes, surveiller les totaux de tous les comptes et accéder à un seul compte lorsque vous avez besoin de plus de détails.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM désigne les actifs sous gestion',
  'account-dashboard.guide.main.aum-chart.description':
    'Ce graphique suit la valeur combinée de votre compte au fil du temps, y compris les dépôts, les retraits, les objectifs de profit et les niveaux de drawdown sur vos comptes.',
  'account-dashboard.guide.main.metrics.title':
    'Ces métriques résument tous les comptes visibles',
  'account-dashboard.guide.main.metrics.description':
    "Utilisez ces statistiques pour obtenir un instantané rapide au niveau du compte avant d'explorer des types de comptes spécifiques ou des comptes spécifiques.",
  'account-dashboard.guide.main.mode-switch.title':
    'Aperçu et Défis sont deux vues des mêmes comptes',
  'account-dashboard.guide.main.mode-switch.description':
    'L’aperçu conserve le graphique AUM et les totaux du portefeuille. Passez à Défis pour l’économie de vos défis prop : taux de réussite, coûts, paiements et goulots d’étranglement par phase sur tous les comptes de défi.',
  'account-dashboard.guide.main.create-account.title':
    "Vous pouvez créer un autre compte à partir d'ici à tout moment",
  'account-dashboard.guide.main.create-account.description':
    'Utilisez ce bouton chaque fois que vous souhaitez ajouter un nouveau compte au tableau de bord.',
  'account-dashboard.guide.main.settings-types.title':
    'Les paramètres peuvent gérer les types de comptes disponibles',
  'account-dashboard.guide.main.settings-types.description':
    'Dans les paramètres, vous pouvez ajouter des types de comptes personnalisés et supprimer les anciens si votre flux de travail change.',
  'account-dashboard.guide.main.settings-stages.title':
    'Les étapes du challenge peuvent définir le type de compte',
  'account-dashboard.guide.main.settings-stages.description':
    'Choisissez le type de compte appliqué lorsqu’un challenge atteint l’évaluation, le financement simulé ou le financement réel. Laissez une étape sur « Aucun changement » pour conserver le type de compte actuel.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Les paramètres peuvent modifier ce qui compte dans les totaux',
  'account-dashboard.guide.main.settings-inclusion.description':
    'Vous pouvez masquer les types de comptes des totaux du tableau de bord sans les supprimer, et vous pouvez décider séparément si leurs retraits comptent toujours.',
  'account-dashboard.guide.main.settings-order.title':
    "Cette section contrôle l'ordre des groupes de comptes",
  'account-dashboard.guide.main.settings-order.description':
    'Utilisez ces contrôles pour décider quels types de comptes apparaissent en premier sur le tableau de bord.',

  'account-dashboard.guide.main.open-account.title':
    "Ouvrez n'importe quelle carte de compte pour aller plus loin",
  'account-dashboard.guide.main.open-account.description':
    'Les comptes sont regroupés par type pour comparer les comptes similaires. Ouvrez une carte pour le détail complet ; le guide de la page de compte prend le relais.',
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    'Nouveau : challenges prop en plusieurs phases',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    'La progression des challenges prop est désormais intégrée au tableau de bord des comptes, avec rubans de phases, données économiques et groupes de comptes habituels.',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    'Activez le suivi lors de la création ou de la modification',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    'Dans Créer un compte ou Modifier le compte, activez le suivi du challenge prop. Le modèle par défaut fournit un point de départ en plusieurs phases que vous pouvez renommer et ajuster.',
  'account-dashboard.guide.whats-new.prop-challenges.overview.title':
    'Performances des défis en un coup d’œil',
  'account-dashboard.guide.whats-new.prop-challenges.overview.description':
    'Le tableau supérieur résume les défis actifs, le taux de réussite, les coûts, les retraits et le résultat net. Les tableaux comparent les blocages par phase et, lorsque plusieurs sociétés sont suivies, les performances par prop firm.',
  'account-dashboard.guide.whats-new.prop-challenges.ribbons.title':
    'Les rubans de phases rendent chaque challenge lisible en un coup d’œil',
  'account-dashboard.guide.whats-new.prop-challenges.ribbons.description':
    'Les cartes prop affichent les phases terminées, en cours, à venir et échouées, puis la progression de l’objectif, du drawdown, de la perte quotidienne et des jours de trading.',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    'Passez de l’analyse du portefeuille à celle des défis',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    'Choisissez Défis pour afficher l’économie globale ainsi que les analyses par phase et par société. L’aperçu des comptes reste centré sur l’AUM et les totaux du portefeuille.',
  'account-dashboard.guide.whats-new.prop-challenges.account-page.title':
    'Les comptes convertis restent dans le même parcours',
  'account-dashboard.guide.whats-new.prop-challenges.account-page.description':
    'Lorsqu’un challenge avance ou devient financé, le type de compte et l’historique des phases restent liés. Ouvrez la carte pour les décisions, les actions et le détail complet des règles.',
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
  'account-card.metric.trades': 'Trades',
  'account-card.metric.withdrawals': 'Retraits',
  'account-card.metric.age': 'Âge',
  'account-card.progress.profit-target': 'Objectif de profit',
  'account-card.progress.drawdown-used': 'Limite de drawdown utilisée',
  'account-card.progress.not-set': 'Non défini',
  'account-card.footer.monthly': 'Mensuelle:',
  'account-card.footer.total-costs': 'Coûts totaux :',
  'account.metrics.total-account-costs': 'Coûts totaux estimés',
  'account.metrics.total-costs': 'Coûts totaux',
  'account.metrics.one-time-costs': 'Coûts ponctuels',
  'account.metrics.recurring-costs-to-date': 'Coûts récurrents à ce jour',
  'account.metrics.monthly-cost': 'Coût mensuel',
  'account.chart.event.added': 'Compte ajouté',
  'account.chart.event.archived': 'Compte archivé',
  'account.balance-chart.drawdown-floor-off-scale':
    'Seuil de drawdown {value} ({distance} en dessous)',
  'account.balance-chart.profit-target-off-scale':
    'Objectif de profit {value} ({distance} au-dessus)',
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

  'account.link-modal.option.default':
    'Utiliser le nom par défaut : Compte-{id}',
  'account.link-modal.default-name': 'Compte-{id}',
  'account.link-modal.button.linking': 'Enchaînement...',
  'account.link-modal.notice.select-existing':
    'Veuillez sélectionner un compte existant',
  'account.link-modal.notice.failed':
    "Échec de l'association du compte : {error}",
  'trade.review.title': 'Revue de trading',

  'trade.details.entry': 'Entrée',
  'trade.details.exit': 'Sortie',

  'trade.details.duration': 'Durée',

  'trade.details.thesis': 'Thèse',

  'trade.details.entries-summary': '{count} entries',
  'trade.details.exits-summary': '{count} exits',
  'trade.details.take-profit-count': '{count} targets',

  'trade.metadata.account': 'Compte:',

  'trade.metadata.setups': 'Configurations',
  'trade.metadata.mistakes': 'Erreurs',
  'trade.image.no-images': 'Aucune image pour ce trade',
  'trade.image.click-edit': 'Cliquez sur modifier pour ajouter des images',
  'trade.image.alt-prefix': 'Image de trading',

  'trade.review.reviewed': 'Révisé',
  'trade.review.reviewed-on': 'Évalué le {date}',

  'timeline.status.loss': 'Perte',

  'timeline.aria.session-navigation': 'Same-day trade navigation',
  'timeline.aria.previous-trade': 'Previous trade: {trade}',
  'timeline.aria.next-trade': 'Next trade: {trade}',
  'timeline.aria.no-previous-trade': 'No previous trade in this trading day',
  'timeline.aria.no-next-trade': 'No next trade in this trading day',

  'drc.tab.review': 'Revue',

  'drc.missed-trades.label.reason': 'Raison:',

  'missed-trade.reason-title': 'Pourquoi ai-je raté ce trade ?',

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
  'settings.general.privacy-mode': 'Mode confidentialité',
  'settings.general.privacy-mode-desc':
    'Masque les valeurs sensibles de trading, de compte, de prix et de performance dans l’interface sans modifier les données enregistrées.',
  'settings.general.privacy-mode-aria':
    'Activer ou désactiver le mode confidentialité',
  'home.widget.profit-target-widget.name': 'Objectif de profit',
  'home.widget.profit-target-widget.description':
    'Suivre la progression des objectifs de profit des comptes',
  'home.widget.eval-roi.name': 'ROI des évals',
  'home.widget.challenge-alerts.name': 'Alertes challenge',
  'home.widget.challenge-alerts.description':
    'Comptes prop challenge nécessitant une décision : échoué, réussi ou paiement prêt',
  'home.widget.eval-roi.description':
    "Dépenses d'évaluation vs paiements sur les comptes prop challenge",
  'form.ideal-exit.title': 'Sorties idéales',

  'form.ideal-exit.price': 'Prix idéal',
  'form.ideal-exit.size': 'Taille',
  'form.ideal-exit.remove': 'Supprimer la sortie idéale',

  'form.ideal-exit.copy-actual': 'Copier les sorties réelles',

  'form.ideal-exit.tooltip':
    'Note le plan de sortie rétrospectif que tu aurais voulu exécuter. Prend en charge les sorties partielles pour analyser la capture.',
  'form.ideal-exit.empty': 'Aucune sortie idéale pour le moment',
  'form.unrealized.title': 'Instantané de position ouverte',
  'form.unrealized.tooltip':
    "Saisissez le prix de marché actuel de votre position ouverte pour suivre le P&L latent. L'instantané est supprimé automatiquement à la clôture du trade.",
  'form.unrealized.price': "Prix de l'instantané",
  'form.unrealized.time': "Heure de l'instantané",
  'form.unrealized.preview': 'P&L latent',
  'form.unrealized.captured': 'Capturé {time}',
  'form.layout.item.unrealized-snapshot-desc':
    'Suivre le P&L latent des positions ouvertes.',
  'trade.validation.unrealized-snapshot-price-non-negative':
    "Le prix de l'instantané doit être supérieur ou égal à zéro",
  'trade.validation.unrealized-snapshot-open-position-required':
    'L’instantané doit être pris pendant une position ouverte.',
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
  'settings.general.home-widget-opacity': 'Opacité des widgets',
  'settings.general.home-widget-opacity-desc':
    'Fonds des widgets avec une image : 0% est transparent, 100% est opaque. Le réglage concerne le thème actuel ; les valeurs des thèmes clair et sombre sont enregistrées séparément.',
  'settings.general.home-widget-opacity-save-failed':
    'Impossible d’enregistrer l’opacité des widgets. Veuillez réessayer.',
  'settings.general.home-background': 'Image d’arrière-plan de l’accueil',
  'settings.general.home-background-desc':
    'Utilisez une image de votre coffre ou choisissez-en une sur votre ordinateur pour la copier dans le coffre.',
  'settings.general.home-background-dashboard':
    'Afficher aussi l’arrière-plan dans le Dashboard',
  'settings.general.home-background-dashboard-desc':
    'Utilise la même image d’arrière-plan en mode Dashboard.',
  'settings.general.home-background-dashboard-aria':
    'Afficher l’arrière-plan de l’accueil dans le Dashboard',

  'settings.general.home-background-choose': 'Choisir une image',
  'settings.general.home-background-clear': 'Effacer',

  'settings.general.home-background-invalid-file':
    'Choisissez un fichier image pris en charge.',
  'settings.general.home-background-saved':
    'Image d’arrière-plan de l’accueil enregistrée.',
  'settings.general.home-background-cleared':
    'Image d’arrière-plan de l’accueil effacée.',
  'settings.general.home-background-save-failed':
    'Impossible d’enregistrer l’image d’arrière-plan de l’accueil.',
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
  'settings.general.show-seconds':
    'Afficher les secondes dans les heures de trading',
  'settings.general.show-seconds-desc':
    "Afficher les secondes lors de la saisie des heures d'entrée et de sortie.",
  'settings.general.show-seconds-aria':
    'Afficher les secondes dans les heures de trading',
  'settings.general.skip-weekends': 'Exclure les week-ends',
  'settings.general.skip-weekends-desc':
    'Lorsque cette option est activée, Journalit traite les week-ends comme des jours sans trading dans tout le plugin. Désactivez-la si vous tradez ou analysez une activité le samedi et le dimanche.',
  'settings.general.skip-weekends-aria': 'Exclure les week-ends dans Journalit',
  'settings.general.skip-weekends-toggled': 'Exclusion des week-ends {status}',
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
  'settings.general.mae-mfe-display-unit': 'Unité d’affichage MAE/MFE',
  'settings.general.mae-mfe-display-unit-desc':
    'Affichez la MAE/MFE en devise ou en ticks de contrats à terme dans les analyses et les vues de transactions. Le mode ticks recalcule automatiquement les transactions existantes compatibles sans modifier les données enregistrées.',
  'settings.general.mae-mfe-display-unit-aria':
    'Sélectionner l’unité d’affichage MAE/MFE',
  'settings.general.mae-mfe-display-dollar': 'Devise',
  'settings.general.mae-mfe-display-ticks': 'Ticks',
  'common.ticks': 'pas de cotation',
  'dashboard.mae-mfe-ticks.partial-coverage':
    'Seuls {eligible} trades sur {total} disposent de données de ticks de contrats à terme. Cette mesure exclut les trades non compatibles.',
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
    'Vérifie chaque jour les métadonnées publiques des versions de Journalit sur GitHub et vous avertit lorsqu’une version plus récente est disponible',
  'settings.general.update-notifications-aria':
    'Afficher les notifications de mise à jour',
  'settings.general.update-notifications-toggled':
    'Notifications de mise à jour {status}',
  'settings.general.data-management': 'Gestion des données & confidentialité',
  'settings.general.backup-restore-section':
    'Sauvegarde, restauration et réinitialisation',
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
  'settings.customization.trade-form-layout.description':
    'Choisissez les champs et sections affichés dans le formulaire de trade.',
  'settings.customization.trade-form-layout.button':
    'Personnaliser la disposition',
  'settings.customization.tickers-symbols': 'Tickers/Symboles',
  'settings.customization.symbol-mappings': 'Mappages de symboles',

  'settings.customization.setups': 'Setups',
  'settings.customization.mistakes': 'Erreurs',
  'settings.customization.tags': 'Balises',
  'settings.customization.events': 'Événements',

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

  'button.remove': 'Retirer',

  'button.move-up': 'Monter',
  'button.move-down': 'Descendre',

  'settings.customization.custom-fields.description':
    "Ajoutez vos propres champs à chaque trade, comme la session, l'unité de temps ou la qualité du setup. Ils apparaissent dans l'onglet Avancé du formulaire, sont enregistrés dans le frontmatter de la note et peuvent devenir des colonnes triables et filtrables du journal.",
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
    'Commencez par un champ que vous relirez vraiment plus tard, comme la session tradée ou le degré de correspondance du setup avec votre plan.',
  'settings.customization.custom-fields.add-new': 'Ajouter un nouveau champ',

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
    'Un journal de trading qui vit sur votre appareil.',
  'onboarding.welcome.cta': 'Configurer mon journal',
  'onboarding.welcome.chart.week': 'Semaine {count}',
  'onboarding.view.title': 'Intégration de Journalit',

  'onboarding.common.continue': 'Continuer',
  'onboarding.common.close': 'Fermer',

  'onboarding.features.badge.pro': 'Pro',

  'onboarding.features.graphic.syncing': 'Synchronisation des trades...',
  'onboarding.features.graphic.complete': 'Synchronisation terminée',
  'onboarding.features.graphic.direction.long': 'LONGUE',
  'onboarding.features.graphic.direction.short': 'COURTE',
  'onboarding.features.graphic.status.win': 'GAGNER',
  'onboarding.features.graphic.status.loss': 'PERTE',
  'onboarding.activation.title': 'Connectez-vous à Journalit',

  'onboarding.activation.status.initializing':
    "Génération de votre code d'authentification...",

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

  'onboarding.notice.complete-failed':
    "Échec de l'enregistrement de la fin de l'intégration. Veuillez réessayer plus tard.",
  'onboarding.notice.completed':
    'Votre journal est prêt. Intégration terminée.',
  'onboarding.familiarity.kicker': 'Question rapide',
  'onboarding.familiarity.title': 'Avez-vous déjà utilisé Obsidian ?',
  'onboarding.familiarity.subtitle':
    "Journalit fonctionne dans Obsidian. Si c'est nouveau pour vous, nous ne montrerons que l'essentiel.",
  'onboarding.familiarity.option.yes.label': 'Oui, je connais',
  'onboarding.familiarity.option.yes.description': "Passer l'orientation.",
  'onboarding.familiarity.option.no.label':
    'Non, Obsidian est nouveau pour moi',
  'onboarding.familiarity.option.no.description':
    'Un seul écran, pas de visite guidée.',
  'onboarding.orientation.kicker': 'Nouveau sur Obsidian',
  'onboarding.orientation.title': 'Quatre choses à savoir',
  'onboarding.orientation.subtitle':
    "C'est tout ce qu'il faut pour utiliser Journalit.",
  'onboarding.orientation.inside.title': 'Journalit fonctionne dans Obsidian',
  'onboarding.orientation.inside.body':
    "Pas besoin d'apprendre Obsidian d'abord. Cet écran est une vue Journalit.",
  'onboarding.orientation.sidebar.title': 'La barre latérale sert à naviguer',
  'onboarding.orientation.sidebar.body':
    "Accueil, Tableau de bord, Journal des trades et vos revues s'y trouvent.",
  'onboarding.orientation.sidebar.action': 'Montrer la barre latérale',
  'onboarding.orientation.sidebar.action-mobile': 'Ouvrir la barre latérale',
  'onboarding.orientation.sidebar.hint':
    'La voilà, à gauche. Cet écran reste ouvert.',
  'onboarding.orientation.sidebar.hint-mobile':
    "Elle s'ouvre par-dessus cet écran. Balayez ou touchez à côté pour revenir.",
  'onboarding.orientation.tabs.title': "Les vues s'ouvrent dans des onglets",
  'onboarding.orientation.tabs.body':
    "Comme celui-ci. Passez de l'un à l'autre en haut.",
  'onboarding.orientation.privacy.title':
    'Votre journal reste sur votre appareil',
  'onboarding.orientation.privacy.body':
    'Notes, captures et revues sont vos propres fichiers. Seuls les trades importés ou synchronisés transitent par les serveurs Journalit.',
  'onboarding.orientation.continue': 'Compris',
  'onboarding.data-source.kicker': 'Vos trades',
  'onboarding.data-source.title': 'Où sont vos trades en ce moment ?',
  'onboarding.data-source.subtitle':
    "Votre historique fait partie de votre avantage. Emportez-le et vos statistiques auront du sens dès le premier jour, au lieu d'attendre des mois de nouveaux trades.",
  'onboarding.data-source.option.broker.label':
    'Chez mon courtier ou ma plateforme',
  'onboarding.data-source.option.broker.description':
    'Connectez-le ou importez son export.',
  'onboarding.data-source.option.file.label': 'Dans un tableur ou un fichier',
  'onboarding.data-source.option.file.description':
    'Exports CSV, Excel ou HTML.',
  'onboarding.data-source.option.fresh.label':
    'Nulle part encore, je pars de zéro',
  'onboarding.data-source.option.fresh.description':
    'Ajoutez vos trades au fur et à mesure.',
  'onboarding.data-source.option.sample.label':
    'Nulle part encore, je veux explorer un exemple',
  'onboarding.data-source.option.sample.description':
    "Découvrez un journal déjà rempli avant d'ajouter vos propres trades.",
  'onboarding.broker.kicker': 'Votre courtier',
  'onboarding.broker.title': 'Quel courtier ou quelle plateforme ?',
  'onboarding.awaiting.sign-in.action': 'Se connecter pour continuer',
  'onboarding.awaiting.sign-in.body':
    "Connectez-vous ou créez d'abord un compte Journalit gratuit. Vos trades arriveront ensuite dans votre journal.",
  'onboarding.broker.badge.sync': 'Synchro auto',
  'onboarding.broker.search': 'Rechercher un courtier ou une plateforme',
  'onboarding.broker.subtitle':
    'Nous choisirons la meilleure façon de récupérer vos trades.',
  'onboarding.broker.option.unlisted.label': "Il n'est pas dans la liste",
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title':
    'Pas encore listé ? Dites-nous quel courtier',
  'onboarding.broker.request.body':
    'Les nouveaux courtiers sont ajoutés sur demande. Dites-nous lequel (un exemple d’export aide) ; en attendant, un export de fichier peut être associé à la main.',
  'onboarding.broker.request.discord': 'Demander sur Discord',
  'onboarding.broker.request.continue': 'Continuer avec l’import manuel',
  'onboarding.broker.loading': 'Vérification des courtiers pris en charge...',
  'onboarding.broker.offline':
    'Impossible de charger la liste complète. Vous pouvez toujours connecter un courtier pris en charge ou importer un fichier.',
  'onboarding.personalise.kicker': 'Configurez votre journal',
  'onboarding.personalise.title': 'Quelques choix rapides',
  'onboarding.personalise.subtitle':
    "Nous personnalisons Journalit d'après vos réponses.",
  'onboarding.personalise.style.question': 'Comment tradez-vous ?',
  'onboarding.personalise.style.scalping': 'Beaucoup de trades par jour',
  'onboarding.personalise.style.intraday':
    'Quelques trades par jour, rien la nuit',
  'onboarding.personalise.style.swing': 'Tenus des jours ou des semaines',
  'onboarding.personalise.style.position': 'Tenus des semaines ou des mois',
  'onboarding.personalise.account.question': 'Quel type de compte ?',
  'onboarding.personalise.account.personal': 'Personnel',
  'onboarding.personalise.account.practice': 'Démo ou entraînement',
  'onboarding.personalise.account.prop':
    'Challenge prop firm ou compte financé',
  'onboarding.personalise.asset.question': 'Que tradez-vous principalement ?',
  'onboarding.personalise.asset.stock': 'Actions',
  'onboarding.personalise.asset.futures': 'Futures',
  'onboarding.personalise.asset.forex': 'Forex',
  'onboarding.personalise.asset.crypto': 'Crypto',
  'onboarding.personalise.asset.options': 'Options',
  'onboarding.personalise.asset.mixed': 'Un mélange',
  'onboarding.first-trade.kicker': 'Presque terminé',
  'onboarding.first-trade.title': 'Ajoutez votre premier trade',
  'onboarding.first-trade.subtitle':
    'Votre journal est prêt. Enregistrez un trade et Journalit commence à travailler dessus.',
  'onboarding.first-trade.cta': 'Ajouter mon premier trade',
  'onboarding.first-trade.sample': "Explorer avec des données d'exemple",
  'onboarding.preparing-sample.title': "Préparation de votre journal d'exemple",
  'onboarding.preparing-sample.body':
    "Cela ne prend que quelques secondes. Obsidian peut sembler un peu lent pendant l'écriture des notes.",
  'onboarding.preparing-sample.starting': 'Démarrage…',
  'onboarding.preparing-sample.hint':
    "Vous pouvez retirer le journal d'exemple à tout moment depuis son badge dans le coin.",
  'onboarding.preparing-sample.failed.title':
    "Impossible de créer le journal d'exemple",
  'onboarding.preparing-sample.failed.body':
    'Réessayez ou choisissez une autre façon de commencer.',
  'onboarding.preparing-sample.retry': 'Réessayer',
  'onboarding.sample-exploring.kicker': "Journal d'exemple",
  'onboarding.sample-exploring.title': "Vous explorez le journal d'exemple",
  'onboarding.sample-exploring.body':
    "Prenez votre temps. Quand vous quitterez l'exemple, nous reprendrons ici : personnaliser votre propre journal et ajouter votre premier trade.",
  'onboarding.sample-exploring.exit': "Quitter l'exemple et continuer",
  'onboarding.sample-exploring.failed.title':
    "Le journal d'exemple n'a pas pu être restauré",
  'onboarding.sample-exploring.failed.body':
    "Quittez l'exemple pour supprimer ce qu'il en reste, puis continuez à configurer votre propre journal.",
  'onboarding.awaiting.kicker': 'En attente de vos premiers trades',
  'onboarding.awaiting.first-sync.title':
    'Terminez la connexion de votre courtier',
  'onboarding.awaiting.first-sync.body':
    "Terminez la connexion dans Réglages > Trade Sync. Dès que vos premiers trades seront synchronisés, cette configuration se fermera d'elle-même.",
  'onboarding.awaiting.first-sync.action': 'Ouvrir Trade Sync',
  'onboarding.awaiting.first-import.title': 'Importez votre fichier',
  'onboarding.awaiting.first-import.body':
    "Terminez l'import dans l'onglet Trade Import. Dès que vos premiers trades seront importés, cette configuration se fermera d'elle-même.",
  'onboarding.awaiting.first-import.action': 'Ouvrir Trade Import',
  'onboarding.awaiting.first-trade.title': 'Enregistrez votre premier trade',
  'onboarding.awaiting.first-trade.body':
    "Dès que votre premier trade sera enregistré, cette configuration se fermera d'elle-même.",
  'onboarding.awaiting.first-trade.action': 'Ajouter un trade',
  'onboarding.awaiting.change-route': 'Choisir une autre méthode',
  'onboarding.notice.personalise-failed':
    "Impossible d'appliquer vos choix de configuration. Vous pourrez les ajuster plus tard dans les Réglages.",
  'onboarding.notice.trade-sync-open-failed':
    'Impossible d’ouvrir Trade Sync. Veuillez réessayer.',
  'onboarding.notice.skip-failed':
    "Échec de l'enregistrement de l'étape d'intégration. Veuillez réessayer plus tard.",

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
  'widget.picker.search-placeholder': 'Rechercher des widgets...',
  'widget.picker.search-label': 'Rechercher des widgets',
  'widget.picker.clear-search': 'Effacer la recherche de widgets',
  'widget.picker.results-label': 'Widgets disponibles',
  'widget.picker.no-results': 'Aucun widget ne correspond à votre recherche',
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
  'widget.key-events.currency-label': 'Devise :',
  'widget.key-events.time-label': 'Heure :',
  'widget.key-events.field-unset': 'Non défini',
  'widget.key-events.notes-placeholder': 'Notes sur cet événement (facultatif)',
  'widget.key-events.notes-label': 'Notes',
  'widget.key-events.default-notes-tooltip':
    "Les notes par défaut sont gérées dans Paramètres → Personnalisation → Événements. La sélection d'un événement ici remplira automatiquement ses notes par défaut enregistrées.",
  'widget.key-events.add-button': 'Ajouter un événement',
  'widget.key-events.empty-state': "Aucun événement clé pour aujourd'hui",
  'widget.key-events.empty-state-sub':
    'Ajoutez des événements dans votre revue hebdomadaire',
  'widget.key-events.open-calendar-aria': 'Ouvrir le calendrier économique',
  'widget.key-events.restore-auto-import':
    'Restaurer les événements importés automatiquement',
  'widget.key-events.restore-missing-events':
    'Restaurer les événements manquants ({count})',
  'widget.missed-trades.name': 'Transactions manquées',
  'widget.missed-trades.description':
    "Transactions que vous avez identifiées mais que vous n'avez pas effectuées",
  'widget.images.name': 'Graphiques et médias',
  'widget.images.description':
    'Carrousel de médias avec prise en charge du téléchargement',
  'widget.images.invalid-context':
    'Le widget Images nécessite une note de revue (tapez : « drc », « revue hebdomadaire », « revue mensuelle », « revue trimestrielle » ou « revue annuelle »)',
  'widget.images.alt-prefix': 'Média de revue',
  'widget.images.stacked-alt': 'Média de revue {index}',
  'widget.images.open-fullscreen': 'Ouvrir le média {index} en plein écran',
  'widget.images.delete': 'Supprimer le média',
  'widget.images.empty': 'Aucun média',
  'widget.images.placeholder':
    "Coller l'URL de l'image ou le chemin du fichier...",
  'widget.images.placeholder-add-more': 'Ajouter plus de médias...',
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
  'widget.tag-performance.name': 'Performance des balises',
  'widget.tag-performance.description':
    'Répartition des performances par balise de trade',
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
  'widget.trade-review.name': 'Revue des trades',
  'widget.trade-review.description':
    'Passez chaque trade en revue avec images, faits clés et questions configurables',
  'widget.trade-review.status.reviewed': 'Revu',
  'widget.trade-review.status.pending': 'À revoir',
  'widget.trade-review.no-image': 'Aucune image du trade',
  'widget.trade-review.open-trade-note': 'Ouvrir la note',

  'widget.trade-review.loading': 'Chargement des revues...',
  'widget.trade-review.no-trades': 'Aucun trade à revoir.',
  'widget.trade-review.time.open': 'Ouvert',
  'widget.trade-review.fallback-title': 'Opération {index}',
  'widget.trade-review.question.win-what-worked':
    'Qu’est-ce qui a fonctionné ?',
  'widget.trade-review.placeholder.win-what-worked':
    'Qu’as-tu bien exécuté sur ce trade ?',
  'widget.trade-review.question.win-repeatable': 'Est-ce répétable ?',
  'widget.trade-review.placeholder.win-repeatable':
    'Qu’est-ce qui rend ce trade répétable ?',
  'widget.trade-review.question.key-lesson': 'Leçon clé',
  'widget.trade-review.placeholder.key-lesson':
    'Que faut-il retenir de ce trade ?',
  'widget.trade-review.question.loss-what-went-wrong':
    'Qu’est-ce qui n’a pas fonctionné ?',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    'Qu’est-ce qui a causé cette perte ?',
  'widget.trade-review.question.loss-valid-or-mistake':
    'Était-ce une perte valide ou une erreur d’exécution ?',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    'Indique si le processus était valide ou évitable.',
  'widget.trade-review.question.loss-avoid-next-time':
    'Qu’éviterai-je la prochaine fois ?',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    'Quel comportement précis doit changer ?',
  'widget.trade-review.question.be-managed-correctly':
    'La gestion était-elle correcte ?',
  'widget.trade-review.placeholder.be-managed-correctly':
    'La gestion suivait-elle ton plan ?',
  'widget.trade-review.image-alt-prefix': 'Image de revue du trade',
  'widget.trade-review.placeholder.default': 'Écris tes pensées...',

  'widget.trade-review.field.entry': 'Entrée',
  'widget.trade-review.field.exit': 'Sortie',
  'widget.trade-review.field.duration': 'Durée',
  'widget.trade-review.field.risk': 'Risque',
  'widget.trade-review.field.account': 'Compte',
  'widget.trade-review.field.setup': 'Configuration',
  'widget.trade-review.field.mistakes': 'Erreurs',
  'widget.trade-review.field.tags': 'Étiquettes',
  'widget.trade-review.more-context': 'Plus de contexte',
  'widget.trade-review.field.position-size': 'Taille de position',
  'widget.trade-review.field.stop-loss': 'Stop de perte',
  'widget.trade-review.field.take-profit': 'Objectif de gain',
  'widget.trade-review.field.fees': 'Frais',
  'widget.trade-review.field.commission': 'Frais de courtage',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': 'Thèse',
  'widget.trade-review.field.notes': 'Remarques',
  'widget.trade-review.field.custom-fields': 'Champs personnalisés',
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

  'widget.table.header.trades': 'Trades',
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': 'Gagner%',
  'widget.table.header.profit-factor': 'PF',
  'widget.table.header.tag': 'Balise',
  'widget.table.header.setup': 'Setup',
  'widget.table.header.a-games': 'Un jeux',
  'widget.table.header.b-games': 'Jeux B',
  'widget.table.header.c-games': 'Jeux C',
  'widget.table.header.rating': 'Notation',
  'widget.table.header.avg-rating': 'Note moyenne',
  'widget.demon-tracker.column.demon': 'DÉMON',
  'widget.demon-tracker.column.occurrences': 'OCCURRENCES',
  'widget.demon-tracker.column.stop-trading': 'ARRÊTER DE TRADER',
  'widget.demon-tracker.period.this-week': 'cette semaine',
  'widget.demon-tracker.period.this-month': 'ce mois-ci',
  'widget.demon-tracker.period.this-quarter': 'ce trimestre',
  'widget.demon-tracker.period.this-year': 'cette année',
  'widget.demon-tracker.empty.title': 'Aucune erreur suivie {period}',
  'widget.demon-tracker.empty.description':
    'Les erreurs enregistrées dans vos trades apparaîtront ici pour vous aider à identifier les modèles',
  'widget.demon-tracker.summary.unique': 'Erreurs uniques :',
  'widget.demon-tracker.summary.total': "Nombre total d'événements :",
  'widget.demon-tracker.summary.critical': 'Critique ({threshold}+) :',
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
  'metric.sharpeRatio.name': 'Ratio de Sharpe',
  'metric.sharpeRatio.description':
    "Ratio de Sharpe par trade : P&L net moyen des trades clôturés divisé par la volatilité d'échantillon du P&L",
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
    'MAE moyenne des trades gagnants clôturés, avec l’unité d’affichage MAE/MFE configurée',
  'metric.winnerMaeP90.name': 'MAE P90 gagnants',
  'metric.winnerMaeP90.description':
    'Seuil MAE au 90e percentile pour les trades gagnants clôturés, avec l’unité d’affichage MAE/MFE configurée',
  'metric.winnerMaeMedian.name': 'MAE médiane gagnants',
  'metric.winnerMaeMedian.description':
    'MAE médiane des trades gagnants clôturés, avec l’unité d’affichage MAE/MFE configurée',
  'metric.avgLossHeat.name': 'Chaleur moy. pertes',
  'metric.avgLossHeat.description':
    'MAE moyenne des trades perdants clôturés, avec l’unité d’affichage MAE/MFE configurée',
  'metric.winnerAvgMfe.name': 'MFE moy. gagnants',
  'metric.winnerAvgMfe.description':
    'MFE moyenne des trades gagnants clôturés, avec l’unité d’affichage MAE/MFE configurée',
  'metric.loserAvgMfe.name': 'MFE moy. perdants',
  'metric.loserAvgMfe.description':
    'MFE moyenne des trades perdants clôturés, avec l’unité d’affichage MAE/MFE configurée',
  'metric.winnerMfeP90.name': 'MFE P90 gagnants',
  'metric.winnerMfeP90.description':
    'Seuil MFE au 90e percentile pour les trades gagnants clôturés, avec l’unité d’affichage MAE/MFE configurée',
  'metric.loserMfeP90.name': 'MFE P90 perdants',
  'metric.loserMfeP90.description':
    'Seuil MFE au 90e percentile pour les trades perdants clôturés, avec l’unité d’affichage MAE/MFE configurée',
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

  'onboarding.wizard.skip-aria': 'Passer cette étape',
  'onboarding.wizard.skip-onboarding': "Passer l'intégration",

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

  'account.linked-trades.setups': 'Configurations',

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
  'account.create.error.rule-incomplete':
    'Chaque règle activée exige une valeur supérieure à zéro',
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
  'account.prop-challenge.summary.status.archived': 'Archivé',
  'account.prop-challenge.summary.status.hidden': 'Masqué',
  'account.prop-challenge.actions.progress-to': 'Passer à {phase}',
  'account.prop-challenge.actions.progress': 'Passer à la phase suivante',
  'account.prop-challenge.actions.mark-passed':
    'Marquer le challenge comme réussi',
  'account.prop-challenge.actions.mark-failed': 'Marquer comme échoué',
  'account.prop-challenge.actions.archive': 'Archiver le challenge',
  'account.prop-challenge.actions.stale':
    'Ce challenge a été mis à jour ailleurs. Vérifiez-le et réessayez.',
  'account.prop-challenge.actions.reopen': 'Rouvrir',
  'account.prop-challenge.view-trades': 'Voir les trades de {phase}',
  'account.prop-challenge.actions.manual': 'Actions manuelles',
  'account.prop-challenge.notice.failed-title': '{phase} échouée',
  'account.prop-challenge.notice.failed-description':
    '{rule} enfreinte le {date}',
  'account.prop-challenge.notice.failed-manual': 'Marquée comme échouée',
  'account.prop-challenge.notice.keep-open': 'Garder ouvert',
  'account.prop-challenge.notice.target-title': 'Objectif de {phase} atteint',
  'account.prop-challenge.notice.target-description':
    'Toutes les conditions sont remplies. Passer à {next} ?',
  'account.prop-challenge.notice.breach-after-reached':
    "Des règles ont été enfreintes après que l'objectif a été atteint à {time}. Définissez l'heure de transition pour exclure ces trades de cette phase.",
  'account.prop-challenge.notice.not-yet': 'Pas encore',
  'account.prop-challenge.notice.passed-title': 'Évaluation réussie',
  'account.prop-challenge.notice.passed-description':
    'Toutes les conditions sont remplies. Marquer le challenge comme réussi ?',
  'account.prop-challenge.notice.payout-title':
    'Paiement disponible : {amount}',
  'account.prop-challenge.notice.payout-plan': 'Votre plan : retirer {amount}',
  'account.prop-challenge.notice.record-payout': 'Enregistrer le paiement',
  'account.prop-challenge.notice.skip-cycle': 'Passer ce cycle',
  'account.prop-challenge.notice.payout-description': 'Paiement',
  'account.prop-challenge.notice.lost-title': 'Paiement plus disponible',
  'account.prop-challenge.notice.lost-description':
    'Non rempli : {requirements}',
  'account.prop-challenge.notice.dismiss': 'Ignorer',
  'account.prop-challenge.notice.unknown-title': 'Nouveau compte {label}',
  'account.prop-challenge.notice.unknown-description':
    '{count} trades depuis le {date} ne sont affectés à aucune phase.',
  'account.prop-challenge.notice.unknown-description-one':
    '1 trade depuis le {date} n’est affecté à aucune phase.',
  'account.prop-challenge.notice.same-phase': 'Même phase',
  'account.prop-challenge.notice.not-now': 'Pas maintenant',
  'account.prop-challenge.notice.error': "Impossible de mettre à jour l'avis.",
  'account.prop-challenge.notice.type-changed':
    'Type de compte défini sur {accountType}',
  'account.prop-challenge.payout.plan.title': 'Plan de paiement',
  'account.prop-challenge.payout.plan.notify-minimum':
    'Avertir à partir de ({currency})',
  'account.prop-challenge.payout.plan.withdrawal': 'Retrait suggéré',
  'account.prop-challenge.payout.plan.full': 'Montant total',
  'account.prop-challenge.payout.plan.percent': 'Pourcentage du disponible',
  'account.prop-challenge.payout.plan.amount': 'Montant fixe',
  'account.prop-challenge.payout.plan.percent-invalid':
    'Saisissez un pourcentage entre 1 et 100.',
  'account.prop-challenge.payout.plan.amount-invalid':
    'Saisissez un montant supérieur à zéro.',
  'account.prop-challenge.payout.plan.percent-value': 'Pourcentage',
  'account.prop-challenge.payout.plan.amount-value': 'Montant ({currency})',
  'account.prop-challenge.payout.plan.save': 'Enregistrer le plan',
  'account.prop-challenge.payout.plan.saved': 'Plan de paiement enregistré.',
  'account.prop-challenge.payout.plan.summary-notify': 'avertir ≥ {amount}',
  'account.prop-challenge.payout.plan.summary-percent': 'suggérer {percent} %',
  'account.prop-challenge.payout.plan.summary-amount': 'suggérer {amount}',
  'account.prop-challenge.payout.plan.summary-full': 'montant total',
  'account.prop-challenge.actions.error':
    'Impossible de mettre à jour le challenge prop firm.',
  'account.prop-challenge.confirm.advance':
    'Confirmer ce résultat et poursuivre le challenge ?',
  'account.prop-challenge.confirm.advance-with-promotion':
    'Cela fera avancer le challenge et changera le type de compte en {accountType}.',
  'account.prop-challenge.confirm.fail':
    'Marquer {account} comme échoué ? Le challenge « {challenge} » se termine à {phase}.',
  'account.prop-challenge.confirm.archive-failed':
    'Archiver {account} ? Le challenge « {challenge} » a échoué. Le compte passe en Archivé.',
  'account.prop-challenge.confirm.archive-passed':
    'Archiver {account} ? Le challenge « {challenge} » est réussi. Le compte passe en Archivé.',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → challenge réussi',
  'account.prop-challenge.confirm.reopen':
    'Rouvrir {account} ? Le challenge « {challenge} » revient à {phase}.',
  'account.prop-challenge.transition.time': 'Heure de transition',
  'account.prop-challenge.transition.now': 'Maintenant',
  'account.prop-challenge.transition.when-target-reached':
    "Lorsque l'objectif a été atteint",
  'account.prop-challenge.transition.too-early':
    "L'heure de transition ne peut pas précéder le début de cette phase.",
  'account.prop-challenge.costs.title': 'Coûts ponctuels',
  'account.prop-challenge.costs.description':
    'Suivez séparément les frais d’achat, de réinitialisation et d’activation.',
  'account.prop-challenge.costs.kind': 'Catégorie',
  'account.prop-challenge.costs.kind.purchase': 'Achat',
  'account.prop-challenge.costs.kind.reset': 'Réinitialisation',
  'account.prop-challenge.costs.kind.activation': 'Mise en service',
  'account.prop-challenge.costs.kind.other': 'Autre',
  'account.prop-challenge.costs.date': 'Date du coût',
  'account.prop-challenge.costs.amount': 'Montant',
  'account.prop-challenge.costs.note': 'Note (facultative)',
  'account.prop-challenge.costs.add': 'Ajouter un coût',
  'account.header.copies': 'Copie',
  'account.header.copied-by-more': '+{count} de plus',
  'account.header.created': 'Créé le :',
  'account.summary.current-balance': 'Solde actuel',
  'account.summary.net-cash-flow': 'Flux de trésorerie net',
  'account.summary.payouts': 'Paiements',
  'account.performance.title': 'Performance globale',
  'account-page.guide.whats-new.cockpit.intro.title':
    'Nouveautés de la page de compte',
  'account-page.guide.whats-new.cockpit.intro.description':
    'Le graphique du solde ouvre désormais l’analyse du compte. Un panneau de métriques connecté le suit, puis les règles du challenge prop apparaissent juste en dessous.',
  'account-page.guide.whats-new.cockpit.cockpit.title':
    'Les règles du challenge suivent la performance',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    'Pour les comptes prop, choisissez une phase dans l’en-tête des règles sous le panneau de métriques afin d’examiner chaque exigence et sa progression. Les actions de cycle de vie restent dans le menu adjacent.',
  'account-page.guide.whats-new.cockpit.summary.title':
    'Un panneau de métriques connecté',
  'account-page.guide.whats-new.cockpit.summary.description':
    "L'état du compte et la performance détaillée partagent désormais une même surface sous le graphique : solde, P&L net et flux de trésorerie d'abord, puis les autres indicateurs dans la même grille.",
  'account-page.guide.whats-new.cockpit.risk.title':
    'Une seule source de risque',
  'account-page.guide.whats-new.cockpit.risk.description':
    "Tant qu'un challenge est actif, réussi ou échoué, seules ses règles de phase sont affichées : aucun second chiffre de drawdown ne peut les contredire. Le risque générique revient pour les comptes classiques ou archivés.",
  'account-page.guide.main.challenge.title': "Votre challenge en un coup d'œil",
  'account-page.guide.main.challenge.description':
    'Sous le panneau de métriques connecté, choisissez une phase du challenge dans l’en-tête des règles et examinez chaque exigence avec sa progression et son état. Les actions restent à côté du sélecteur.',
  'account-page.guide.main.summary.title': "État du compte en un coup d'œil",
  'account-page.guide.main.summary.description':
    'Le panneau de métriques connecté commence par le solde, le P&L net, la croissance, les trades, le taux de réussite et le flux de trésorerie net — ou les paiements pour un compte prop.',
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

  'account.edit.modal.change-date.confirm':
    'Date de création de la mise à jour',
  'account.edit.modal.change-balance.title': 'Modifier le solde initial',
  'account.edit.modal.change-balance.message':
    'Vous êtes sur le point de modifier le solde initial de {oldBalance} à {newBalance}.',

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

  'account.edit.modal.delete.will': 'Cette action va :',
  'account.edit.modal.delete.item1':
    'Supprimer toutes les métadonnées et paramètres du compte',
  'account.edit.modal.delete.item2':
    'Supprimer les références de compte de tous les trades liés',
  'account.edit.modal.delete.item3':
    'Supprimer les balises de compte générées automatiquement des notes',
  'common.note-label': 'Note:',

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
  'templateEditor.widget.demon-tracker.tracking-method':
    'Suivre les erreurs par :',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    'Occurrences dans les trades',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    'Chaque trade associé à l’erreur est comptabilisé.',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days':
    'Jours de trading',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    'Les erreurs des trades et des revues quotidiennes sont fusionnées et comptées une fois par jour de trading.',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    'Entrées de revue quotidienne',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    'Seules les erreurs consignées dans les revues quotidiennes sont comptées.',
  'templateEditor.widget.demon-tracker.stop-after': 'Arrêter de trader après :',
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
  'account.transaction.edit-row-label':
    'Modifier ou supprimer cette transaction : {date}, {amount}',
  'account.deposits-withdrawals.title': 'Dépôts et retraits',
  'account.deposits-withdrawals.empty':
    'Aucun dépôt ou retrait manuel enregistré.',
  'account.deposits-withdrawals.empty-sub':
    "Cliquez sur le bouton + dans l'en-tête pour ajouter votre première trade.",
  'account.deposits-withdrawals.summary':
    '{deposits} déposés · {withdrawn} retirés · dernier {date}',
  'account.payouts.title': 'Retraits de gains',
  'account.payouts.summary': '{count} retraits · {total} · dernier {date}',
  'account.payouts.summary-masked':
    'Historique des retraits masqué tant que les valeurs le sont',
  'account.payouts.summary-one': '1 retrait · {total} · dernier {date}',
  'account.payouts.empty': 'Aucun retrait de gains pour le moment',
  'account.payouts.empty-sub':
    'Enregistrez un retrait avec le bouton + dans l’en-tête.',
  'account.ledger.column.date': 'Date',
  'account.ledger.column.type': 'Type',
  'account.ledger.column.payout': 'Retrait',
  'account.ledger.column.description': 'Description',
  'account.ledger.column.amount': 'Montant',
  'account.ledger.column.balance-after': 'Solde après',
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
  'home.quick-links.add-trade': 'Ajouter un trade',
  'home.quick-links.trade-log': "Journal d'Echange",
  'home.quick-links.trading-dashboard': 'Tableau de bord',
  'home.quick-links.account-dashboard': 'Comptes',
  'home.quick-links.todays-drc': "La DRC d'aujourd' hui",
  'home.quick-links.weekly-review': 'Bilan de cette semaine',
  'home.quick-links.monthly-review': 'Bilan de ce mois',
  'home.quick-links.quarterly-review': 'Bilan du trimestre',
  'home.quick-links.yearly-review': "Bilan de l'année",
  'home.quick-links.quick-import': 'Import rapide',
  'home.quick-links.csv-import': 'Importation de trades',
  'home.quick-links.layout-builder': 'Configurateur de page',
  'home.quick-links.navigation-sidebar': 'Barre latérale de navigation',
  'home.quick-links.session-mode': 'Mode session',
  'home.quick-links.economic-calendar': 'Calendrier économique',
  'home.quick-links.move-above':
    'Déplacer les liens rapides au-dessus des widgets',
  'home.quick-links.move-below': 'Déplacer les liens rapides sous les widgets',
  'home.widget-selector.title': "AJOUTER À L'ACCUEIL",
  'home.widget-selector.section.widgets': 'Widgets ',
  'home.widget-selector.section.quick-links': 'Liens rapides',
  'home.widget-selector.restore': 'restaurer',
  'home.widget-selector.add-shortcut':
    'Ajouter un raccourci compte/configuration',
  'home.widget-selector.hint.navigate': 'Naviguer',
  'home.widget-selector.hint.select': 'SÉLECTIONNER',
  'home.widget-selector.hint.close': 'ESC : Fermer',
  'home.period.month': 'Mois',
  'home.period.quarter': 'Trimestre',
  'home.period.year': 'Année',
  'home.period.lifetime': 'Tout le temps',

  'home.aria.filter-trade-types': 'Filtrer les types de trades',
  'home.aria.open-settings': 'Ouvrir les paramètres de Journalit',
  'home.aria.save-layout': 'Enregistrer le modèle',
  'home.aria.customize': 'Personnaliser',
  'home.button.add-widget': 'Ajouter un widget',

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
  'home.greeting.name-placeholder': 'Votre nom',
  'home.greeting.edit-name-aria': '{name}. Modifier le nom d’affichage',
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

  'home.widget.best-hours.hidden': 'Masqué',
  'home.widget.best-hours.hidden-detail': 'Mode confidentialité',
  'home.widget.best-hours.no-positive-window': 'Aucun créneau positif',
  'home.widget.best-hours.insufficient-history': 'Données insuffisantes',
  'home.widget.best-hours.sample-requirement':
    '{count}/2 créneaux échantillonnés',
  'home.widget.best-hours.developing': 'en cours',
  'home.widget.best-hours.no-positive-detail':
    'Les créneaux échantillonnés sont négatifs',

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
  'home.widget.eval-roi.title': 'ROI des évals',
  'home.widget.eval-roi.unable-to-load': 'Impossible de charger',
  'home.widget.eval-roi.no-challenges': 'Aucun prop challenge',
  'home.widget.eval-roi.challenge-count': '{count} éval',
  'home.widget.eval-roi.challenge-count-plural': '{count} évals',
  'home.widget.eval-roi.net': 'Net',
  'home.widget.eval-roi.spent': 'Dépensé',
  'home.widget.eval-roi.payouts': 'Paiements',
  'home.widget.eval-roi.break-even': 'Seuil de rentabilité',
  'home.widget.challenge-alerts.title': 'Alertes challenge',
  'home.widget.challenge-alerts.unable-to-load':
    'Impossible de vérifier les alertes du challenge',
  'home.widget.challenge-alerts.empty': 'Aucune alerte challenge',
  'home.widget.challenge-alerts.count': '{count} alerte',
  'home.widget.challenge-alerts.count-plural': '{count} alertes',
  'home.widget.challenge-alerts.more': '+{count} de plus',
  'home.widget.challenge-alerts.kind.failed': 'Échoué',
  'home.widget.challenge-alerts.kind.target': 'Objectif atteint',
  'home.widget.challenge-alerts.kind.passed': 'Réussi',
  'home.widget.challenge-alerts.kind.payout': 'Paiement prêt',
  'home.widget.challenge-alerts.kind.lost': 'Paiement plus disponible',
  'home.widget.challenge-alerts.kind.unknown-account': 'Nouveau compte {label}',
  'home.widget.eval-roi.roi-aria': "Rendement des dépenses d'évaluation",
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

  'home.widget.setups.trades-count': '{count} trades',
  'home.widget.setups.win-rate': '{rate}% de taux de réussite',
  'home.widget.weekly.title': 'Cette semaine',
  'home.widget.weekly.no-trades': 'pas encore de trades cette semaine',
  'home.widget.weekly.breakeven': "à l'équilibre cette semaine",
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
  'calendar.reviewed': 'Révisé',
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

  'widget.session-mistakes.placeholder': 'Sélectionner ou créer des erreurs',
  'widget.session-mistakes.empty': 'Aucune erreur de session enregistrée',

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

  'widget.empty.no-data': 'Aucune donnée disponible',
  'widget.empty.no-trades': 'Aucun trade pour cette période',
  'widget.empty.no-closed-trades': 'Aucun trade clôturé pour cette période',
  'widget.empty.no-daily-data': 'Aucune données pour la période',
  'widget.empty.no-weekly-data': 'Aucune données pour la période',
  'widget.empty.no-monthly-data': 'Aucune données pour la période',
  'widget.empty.no-quarterly-data': 'Aucune données pour la période',
  'widget.empty.no-tag-data':
    'Aucune donnée de balise disponible pour cette période',
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
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    "Ce widget n'est disponible que dans les revues hebdomadaires, mensuelles, trimestrielles et annuelles",
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

  'dashboard.component-selector.category.performance': 'Performance',

  'dashboard.component-selector.category.journal': 'Journal',
  'widget.pnlChart.name': 'P&L cumulé',

  'widget.longPnLChart.name': 'P&L Long',
  'widget.longPnLChart.description':
    'Courbe du P&L cumulé pour les trades longs clôturés uniquement',
  'widget.shortPnLChart.name': 'P&L Short',
  'widget.shortPnLChart.description':
    'Courbe du P&L cumulé pour les trades shorts clôturés uniquement',
  'widget.performanceCalendar.name': 'Calendrier de performance',

  'widget.dailyPerformance.name': 'Performances quotidiennes',

  'widget.tradesChart.name': 'Graphique des trades',

  'widget.weekdayPerformance.name': 'Performance en semaine',

  'widget.hourlyPerformance.name': 'Performance horaire',

  'widget.tickerPerformance.name': 'Performance par ticker',
  'widget.tickerPerformance.description':
    'Graphique à barres classé comparant les performances par ticker',
  'widget.tradesChart.limit': '{count} trades',
  'widget.drawdownChart.name': 'Retrait Chart',

  'widget.directionalDrawdownChart.name': 'Drawdown réalisé par direction',

  'widget.longDrawdownChart.name': 'Drawdown long réalisé',

  'widget.shortDrawdownChart.name': 'Drawdown short réalisé',

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

  'widget.rollingStats.name': 'Gain/perte moyen continu (e)',

  'filter.chip.remove-aria': 'Supprimer le filtre {label}',
  'shared.filter.disabled-preview': "Filtres désactivés dans l'aperçu",
  'shared.filter.open': 'Ouvrir les filtres',
  'shared.filter.active-count': '{count} filtres actifs',
  'ui.toggle-switch.aria-label': 'Interrupteur à bascule',
  'ui.folder-browser.placeholder': 'Sélectionner un dossier…',
  'ui.folder-browser.root': 'Racine',
  'ui.folder-browser.clear-aria':
    "Effacer pour utiliser l'emplacement par défaut",
  'ui.folder-browser.expand-folder': 'Développer le dossier',
  'ui.folder-browser.collapse-folder': 'Réduire le dossier',

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

  'datetime.aria.open-picker': 'Ouvrir le sélecteur de date',

  'modal.template-switch.title': 'Changer de modèle ?',
  'modal.template-switch.switching-from': 'Vous passez de',
  'modal.template-switch.switching-to': 'à',
  'modal.template-switch.has-content-title': 'Cette note contient du contenu',
  'modal.template-switch.has-content-desc':
    'Le contenu sera réorganisé pour s’adapter à la nouvelle mise en page. Tout contenu qui ne peut pas être intégré sera conservé en bas de la note pour que vous puissiez le revoir.',
  'modal.template-switch.cannot-undo':
    'Cette action est irréversible (mais vous pouvez revenir au modèle précédent).',
  'modal.template-switch.button.switch': 'Changer de modèle',

  'release-notes.title': 'Notes de version',
  'release-notes.loading-plugin': 'Chargement du plugin...',

  'release-notes.no-content': 'Aucune note de version trouvée',
  'release-notes.current-version': 'Actuelle : v{version}',
  'release-notes.version': 'Version {version}',
  'release-notes.link.docs': 'Documentation',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',
  'skeleton.tradelog.loading': 'Chargement des données de trades',
  'skeleton.dashboard-widget.loading': 'Chargement des données du widget',
  'skeleton.account-page.loading': 'Chargement de la page du compte',

  'grid.aria.remove-widget': 'Supprimer le widget',
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'Export CSV du widget Fills',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Ouvrez le widget Fills dans TT et passez à la vue Detail, Continuous ou Price with Detail',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Important :',

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
  'navigation.items.nav-settings': 'Paramètres',
  'navigation.shortcuts.add': 'Ajouter un raccourci',
  'navigation.shortcuts.remove': 'Supprimer le raccourci',
  'navigation.shortcuts.close': 'Fermer le sélecteur de raccourcis',
  'navigation.shortcuts.search': 'Rechercher des comptes et des stratégies',
  'navigation.shortcuts.accounts': 'Comptes',
  'navigation.shortcuts.setups': 'Stratégies',
  'navigation.shortcuts.empty': 'Aucun compte ni aucune stratégie disponible',
  'navigation.shortcuts.unavailable': 'Indisponible',
  'navigation.shortcuts.added': 'Ajouté',
  'navigation.shortcuts.parent-required':
    'Supprimez d’abord ses raccourcis avant de masquer cet élément de navigation.',
  'navigation.items.nav-home': 'Accueil',
  'navigation.items.nav-dashboard': 'Tableau de bord',
  'navigation.items.nav-trade-log': 'Journal des trades',
  'navigation.items.nav-account-dashboard': 'Comptes',
  'navigation.items.nav-drc': 'DRC du jour',
  'navigation.items.nav-weekly': 'Revue de cette semaine',
  'navigation.items.nav-monthly': 'Revue de ce mois',
  'navigation.items.nav-quarterly': 'Revue de ce trimestre',
  'navigation.items.nav-yearly': 'Revue de cette année',
  'navigation.items.nav-add-trade': 'Ajouter un trade',
  'navigation.items.nav-layout-builder': 'Layout Builder',
  'navigation.items.nav-quick-import': 'Importation rapide',
  'navigation.items.nav-csv-import': 'Importation de trades',
  'navigation.items.nav-session-mode': 'Mode session',
  'navigation.items.nav-economic-calendar': 'Calendrier économique',
  'navigation.items.nav-position-size': 'Calculateur de taille de position',
  'settings.general.navigation-sidebar': 'Barre latérale de navigation',
  'notice.error.open-navigation-sidebar':
    'Impossible d’ouvrir la barre latérale de navigation. Réessayez.',
  'navigation.setting.open': 'Ouvrir la barre latérale de navigation',
  'navigation.setting.open.desc':
    'Affichez-la maintenant et développez la barre latérale d’Obsidian si elle est réduite.',
  'navigation.setting.open.button': 'Ouvrir la barre latérale',
  'calendar.setting.open': 'Ouvrir le calendrier',
  'calendar.setting.open.button': 'Ouvrir le calendrier',
  'notice.error.open-calendar-sidebar':
    'Impossible d’ouvrir le calendrier. Réessayez.',
  'navigation.setting.tab-behavior': 'Comportement des onglets de navigation',
  'navigation.setting.tab-behavior.desc':
    'Comment ouvrir les vues et les revues depuis les barres latérales Journalit',
  'navigation.setting.tab-behavior.new-tab': 'Ouvrir dans un nouvel onglet',
  'navigation.setting.tab-behavior.replace': 'Remplacer l’onglet actif',
  'navigation.search.placeholder': 'Rechercher des trades et des revues...',
  'navigation.search.clear': 'Effacer la recherche',
  'navigation.search.section.trades': 'Trades',
  'navigation.search.section.reviews': 'Revues',
  'navigation.search.empty': 'Aucun résultat trouvé',
  'navigation.search.trade-open': 'Ouvrir',

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

  'templateEditor.widget.weekly-drc-start-collapsed': 'Démarrer replié',
  'templateEditor.widget.weekly-drc-day-all': 'All days',

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

  'templateEditor.widget.review-context-fields.context': 'Context',
  'templateEditor.widget.review-context-fields.context.both': 'Both',
  'templateEditor.widget.review-context-fields.inherited': 'Inherited',
  'templateEditor.widget.review-context-fields.current': 'Current',
  'templateEditor.widget.review-context-fields.empty-values': 'Empty values',
  'templateEditor.widget.review-context-fields.hide-empty': 'Hide empty values',
  'templateEditor.widget.trade-review.primary-metrics': 'Métriques principales',
  'templateEditor.widget.trade-review.classification': 'Classification',
  'templateEditor.widget.trade-review.more-context': 'Plus de contexte',
  'templateEditor.widget.trade-review.display': 'Affichage',
  'templateEditor.widget.trade-review.show-images': 'Afficher les images',
  'templateEditor.widget.trade-review.fields-none': 'Aucun champ',
  'templateEditor.widget.trade-review.fields-all': 'Tous les champs',
  'templateEditor.widget.trade-review.fields-count': '{count} champs',
  'templateEditor.widget.trade-review.no-fields': 'Aucun champ disponible',
  'templateEditor.widget.trade-review.questions': 'Questions de revue',
  'templateEditor.widget.trade-review.questions-help':
    'Choisissez les questions affichées pour chaque résultat de trade. Les identifiants des questions restent stables afin que les réponses enregistrées restent associées lorsque vous modifiez ou réorganisez les questions.',
  'templateEditor.widget.trade-review.outcome.win': 'Gagnants',
  'templateEditor.widget.trade-review.outcome.loss': 'Perdants',
  'templateEditor.widget.trade-review.outcome.breakeven': 'À l’équilibre',
  'templateEditor.widget.trade-review.outcome.open': 'Ouverts',
  'templateEditor.widget.trade-review.questions-empty':
    'Aucune question pour ce résultat.',
  'templateEditor.widget.trade-review.question-label': 'Question',
  'templateEditor.widget.trade-review.question-placeholder':
    'Saisissez une question de revue',
  'templateEditor.widget.trade-review.answer-placeholder-label':
    'Texte indicatif de réponse',
  'templateEditor.widget.trade-review.answer-placeholder':
    'Indication facultative affichée dans le champ de réponse',
  'templateEditor.widget.trade-review.add-question': '+ Ajouter une question',
  'templateEditor.widget.trade-review.answer-type-label': 'Type de réponse',
  'templateEditor.widget.trade-review.answer-type-text': 'Texte',
  'templateEditor.widget.trade-review.answer-type-choice': 'Choix',
  'templateEditor.widget.trade-review.option-placeholder':
    "Libellé de l'option",
  'templateEditor.widget.trade-review.add-option': '+ Ajouter une option',
  'templateEditor.widget.trade-review.condition-label': 'Afficher si',
  'templateEditor.widget.trade-review.condition-always': 'Toujours affichée',
  'templateEditor.widget.trade-review.condition-option-label':
    'Quand Q{questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section': '+ Ajouter une section',

  'templateEditor.widget.previous-context-fallback-label':
    'Previous DRC fallback',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Nearest earlier DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Expected previous trading day only',
  'dashboard.conversion.original-pnl': "P&L d'origine",
  'dashboard.conversion.converted-pnl': 'P&L converti',
  'dashboard.conversion.details-label': 'Détails de conversion des devises',

  'settings.general.include-copy-accounts-analytics':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-analytics-desc':
    'When enabled, all-account trading analytics include derived copy-account results and count them as account-level trades.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-toggled':
    'Copy accounts in all-account analytics {status}',
  'settings.general.include-unrealized-pnl':
    'Inclure le P&L latent dans les analyses',
  'settings.general.include-unrealized-pnl-desc':
    "Lorsque cette option est activée, les totaux de P&L net incluent le P&L latent des positions ouvertes disposant d'un instantané de prix, affiché séparément des résultats réalisés. Les statistiques comme le taux de réussite et les séries restent basées sur le réalisé.",
  'settings.general.include-unrealized-pnl-aria':
    'Inclure le P&L latent dans les analyses',
  'settings.general.include-unrealized-pnl-toggled':
    'P&L latent dans les analyses {status}',
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
    'Supprimer également de mon coffre tous les trades liés à ce compte',
  'calendar.aria.open-daily-review': 'Ouvrir la revue quotidienne pour {date}',
  'calendar.aria.open-weekly-review':
    'Ouvrir la revue hebdomadaire pour {date}',
  'calendar.aria.open-monthly-review': 'Ouvrir la revue mensuelle pour {date}',
  'calendar.aria.open-quarterly-review':
    'Ouvrir la revue trimestrielle pour {date}',

  'csv.mapper.aria.map-column': 'Mapper la colonne {header}',
  'trade-import.error.file-empty':
    'Ce fichier est vide. Exportez-le de nouveau, puis réessayez.',
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
    'Connectez-vous ou créez un compte Journalit gratuit pour prévisualiser des fichiers dans Trade Import. Pro est requis uniquement lorsque vous importez les trades.',
  'quick-import.gate.sign-in-cta':
    'Se connecter pour prévisualiser gratuitement',
  'quick-import.gate.pro': 'L’import rapide est inclus avec Trade Import Pro.',
  'quick-import.gate.preview-free': 'Prévisualiser votre fichier gratuitement',
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

  'quick-import.privacy-note':
    'Les fichiers sont envoyés aux serveurs Journalit pour traitement et ne sont pas stockés par défaut.',
  'quick-import.dropzone.title': 'Déposez un export broker ici',
  'quick-import.dropzone.subtitle': 'Ou cliquez pour choisir un fichier',

  'quick-import.status.checking-subscription':
    'Vérification de l’état de l’abonnement...',
  'quick-import.status.analysing': 'Analyse et préparation de l’aperçu...',
  'quick-import.status.importing': 'Import en cours...',
  'quick-import.processing.sent-to-server':
    'Uploaded to Journalit for private processing',
  'quick-import.file.selected': 'Selected file',
  'quick-import.file.processed': 'Processed and ready to write to your vault',
  'quick-import.summary.title': 'Prêt à importer',

  'quick-import.summary.to-import': 'À importer',
  'quick-import.summary.duplicates': 'Doublons',
  'quick-import.summary.failed': 'À vérifier',
  'quick-import.summary.failed-rows': 'Lignes non importées',
  'quick-import.summary.incomplete-rows': 'Lignes incomplètes ignorées',
  'quick-import.complete.title': 'Import terminé',
  'quick-import.complete.message':
    '{written} écrits, {duplicates} doublons, {failed} à vérifier.',
  'quick-import.action.open-full': 'Ouvrir Trade Import complet',
  'quick-import.action.review-in-trade-import': 'Vérifier dans Trade Import',
  'quick-import.action.setup-in-trade-import': 'Configurer dans Trade Import',
  'quick-import.action.import': 'Importer les trades',
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import-count.one': 'Importer {count} trade',
  'quick-import.action.import-count.few': 'Importer {count} trades',
  'quick-import.action.import-count.many': 'Importer {count} trades',
  'quick-import.action.import-count.other': 'Importer {count} trades',
  'quick-import.preview.more': '+ {count} more processed trades',

  'trade-import.notice.capabilities-failed':
    'Impossible de charger les fonctionnalités de Trade Import',
  'trade-import.notice.open-failed': 'Impossible d’ouvrir Trade Import',
  'trade-import.notice.template-exists':
    'Un modèle Trade Import avec ce nom existe déjà',
  'trade-import.notice.template-saved': 'Modèle Trade Import enregistré',
  'trade-import.notice.analyse-failed': 'Échec de l’analyse Trade Import',
  'trade-import.notice.preview-failed': 'Échec de l’aperçu Trade Import',
  'trade-import.notice.free-preview-rate-limited':
    'Limite d’aperçus gratuits atteinte. Activez PRO ou réessayez dans environ {minutes} minutes.',
  'trade-import.notice.free-preview-storage-limit-reached':
    'Le stockage des aperçus gratuits peut contenir jusqu’à {limit} trades. Vous en avez {storedItems} enregistrés et ce fichier en ajouterait {requestedItems}. Attendez l’expiration d’un aperçu précédent ou activez PRO.',
  'trade-import.preview-error.guidance':
    'Vérifiez que tous les champs obligatoires sont mappés, que le format de date sélectionné correspond à votre fichier et que les colonnes numériques contiennent des valeurs de trade valides.',
  'trade-import.notice.complete':
    'Trade Import terminé : {written} écrits ou mis à jour, {duplicateCount} doublons, {failedCount} échecs',
  'trade-import.gate.brand-left': 'Trades',
  'trade-import.gate.brand-right': 'Importer',
  'trade-import.gate.sign-in.title':
    'Prévisualisez gratuitement votre historique de trading',
  'trade-import.gate.sign-in':
    'Connectez-vous ou créez un compte Journalit gratuit pour analyser votre fichier. Pro est uniquement requis lorsque vous importez les trades.',
  'trade-import.gate.sign-in.reassurance':
    'Votre fichier est traité de manière confidentielle et n’est pas enregistré par défaut.',
  'trade-import.gate.sign-in.no-trial':
    'Aucun essai Pro n’est requis pour analyser et prévisualiser.',
  'trade-import.gate.sign-in.cta':
    'Se connecter pour prévisualiser gratuitement',

  'trade-import.step.select': '1. Sélectionner les paramètres d’import',
  'trade-import.step.privacy': '2. Confirmation de confidentialité',
  'trade-import.step.analyse': '3. Analyser et mapper',
  'trade-import.step.preview': '4. Aperçu',
  'trade-import.label.template': 'Modèle local de mapping',
  'trade-import.label.template-actions': 'Actions du modèle',
  'trade-import.template.none': 'Aucun modèle',
  'trade-import.label.account': 'Compte',
  'trade-import.label.broker': 'Source d’exportation / plateforme',
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

  'trade-import.label.save-template': 'Enregistrer le modèle de mapping',
  'trade-import.placeholder.template-name': 'Nom du modèle',
  'trade-import.action.save-template': 'Enregistrer le modèle',
  'trade-import.action.preview': 'Générer l’aperçu',

  'trade-import.preview.found.one': 'Nous avons trouvé {count} trade',
  'trade-import.preview.found.few': 'Nous avons trouvé {count} trades',
  'trade-import.preview.found.many': 'Nous avons trouvé {count} trades',
  'trade-import.preview.found.other': 'Nous avons trouvé {count} trades',
  'trade-import.preview.date-range': 'Du {start} au {end}',
  'trade-import.preview.metric.symbols': 'Symboles',
  'trade-import.preview.metric.ready': 'Prêts à importer',
  'trade-import.preview.metric.duplicates': 'Doublons possibles',
  'trade-import.preview.metric.attention': 'À vérifier',
  'trade-import.preview.completed.message':
    'Trades prêts à être importés : {count}.',
  'trade-import.preview.partial.message':
    'Trades prêts : {count}. Lignes impossibles à importer : {failed}. Lignes incomplètes ignorées : {incomplete}.',
  'trade-import.preview.partial.guidance':
    'Seuls les trades valides affichés ci-dessous seront importés.',

  'trade-import.preview.failed.message':
    'Aucun trade n’a pu être préparé à partir de ce fichier.',
  'trade-import.preview.failed.guidance':
    'Vérifiez le mapping des colonnes, le format de date, la feuille et la ligne d’en-tête sélectionnées, ainsi que les valeurs invalides ci-dessous.',
  'trade-import.preview.tradovate-performance.title':
    'Mauvais rapport Tradovate',
  'trade-import.preview.tradovate-performance.message':
    'Cela ressemble à un export Performance de Tradovate. Journalit importe le rapport Ordres afin de reconstruire précisément vos exécutions. Dans Tradovate, accédez à Reports > Orders et téléchargez le fichier CSV.',
  'trade-import.preview.tradovate-performance.guide':
    'Voir le guide d’export Tradovate',
  'trade-import.preview.metatrader-statement.title':
    'Relevé MetaTrader non pris en charge',
  'trade-import.preview.metatrader-statement.message':
    'Journalit importe le rapport original de l’historique du compte MetaTrader. Réglez MetaTrader en anglais, ouvrez Account History / History, choisissez Save as Report, puis importez le fichier .html ou .htm original sans le modifier ni le convertir.',
  'trade-import.preview.metatrader-statement.guide':
    'Voir le guide d’exportation MetaTrader',
  'trade-import.preview.tradingview-export.title': 'Mauvais export TradingView',
  'trade-import.preview.tradingview-export.message':
    'Journalit attend le fichier CSV Order History / History de TradingView Paper Trading. N’utilisez pas Account History, les données de graphique, les exports de stratégie ni d’autres fichiers CSV TradingView.',
  'trade-import.preview.tradingview-export.guide':
    'Voir le guide d’exportation TradingView',
  'trade-import.source-recovery.deepcharts.title':
    'Ce fichier ressemble à un export DeepCharts',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    'Le fichier provient de DeepCharts, même si le compte exécute les ordres via Rithmic. Utilisez DeepCharts afin que la Quantity signée détermine correctement le sens long ou short.',
  'trade-import.source-recovery.deepcharts.manual-message':
    'Utilisez l’importateur DeepCharts. DeepCharts encode le sens dans la Quantity signée ; ne mappez donc pas Quantity comme champ manuel de direction.',
  'trade-import.source-recovery.deepcharts.switch': 'Passer à DeepCharts',
  'trade-import.source-recovery.deepcharts.guide':
    'Voir le guide d’export DeepCharts',
  'trade-import.source-recovery.motivewave.title':
    'Ce fichier ressemble à un export d’exécutions MotiveWave',
  'trade-import.source-recovery.motivewave.message':
    'Utilisez MotiveWave afin que Journalit puisse regrouper correctement les lignes d’exécution en trades terminés.',
  'trade-import.source-recovery.motivewave.switch': 'Passer à MotiveWave',
  'trade-import.source-recovery.motivewave.guide':
    'Voir le guide d’export MotiveWave',
  'quick-import.message.source-mismatch':
    'Journalit a identifié une autre source d’export. Vérifiez le fichier dans Trade Import pour changer de source sans le téléverser à nouveau.',
  'trade-import.preview.no-eligible':
    'Le fichier a été analysé correctement, mais aucun trade nouveau ou mis à jour ne peut être importé. Vérifiez les détails sur les doublons et la classification ci-dessous.',
  'trade-import.pro-gate.title.one': '{count} trade est prêt à être importé',
  'trade-import.pro-gate.title.few':
    '{count} trades sont prêts à être importés',
  'trade-import.pro-gate.title.many':
    '{count} trades sont prêts à être importés',
  'trade-import.pro-gate.title.other':
    '{count} trades sont prêts à être importés',
  'trade-import.pro-gate.subtitle':
    'Activez PRO pour les écrire dans votre coffre sous forme de notes de trade.',
  'trade-import.pro-gate.cta': 'Activer PRO',
  'trade-import.preview.diagnostics': 'Détails à vérifier ({count})',
  'trade-import.preview.affected-rows': 'Lignes concernées : {count}',
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
  'trade-import.action.activate-pro.one':
    'Activer PRO pour importer {count} trade',
  'trade-import.action.activate-pro.few':
    'Activer PRO pour importer {count} trades',
  'trade-import.action.activate-pro.many':
    'Activer PRO pour importer {count} trades',
  'trade-import.action.activate-pro.other':
    'Activer PRO pour importer {count} trades',
  'trade-import.action.cancel-preview': 'Annuler l’aperçu',
  'trade-import.broker.manual': 'Mapping manuel',

  
  'home.quick-links.setups': 'Plans de trading',
  'setups.view.error.title': 'Impossible de charger les setups',
  'setups.view.error.load-failed': 'Échec du chargement des données de setup.',
  'setups.view.action.retry': 'Réessayer',

  'setups.view.action.create': 'Créer un setup',
  'setups.view.action.new': 'Nouveau setup',
  'setups.view.action.compare-selected': 'Comparer les setups sélectionnés',
  'setups.view.tabs.aria': 'Onglets de la vue des setups',
  'setups.view.tab.overview': 'Aperçu',
  'setups.view.tab.compare': 'Comparer',
  'setups.view.card.select-for-compare':
    'Sélectionner ce setup pour la comparaison',

  'setups.view.compare.title': 'Comparer les setups',

  'setups.view.compare.empty': 'Sélectionnez deux setups à comparer.',
  'setups.view.compare.metrics-title': 'Métriques de comparaison',
  'setups.view.compare.metric': 'Métrique',
  'setups.view.compare.edge-column': 'Avantage',
  'setups.view.compare.edge-label': 'Gagnant',

  'setups.view.compare.no-clear-edge': 'Aucun avantage net',
  'setups.view.compare.expectancy-edge': 'Avantage d’espérance',
  'setups.view.compare.confidence': 'Confiance',
  'setups.view.compare.sample': 'Échantillon',
  'setups.view.compare.confidence.high': 'Élevée',
  'setups.view.compare.confidence.moderate': 'Modérée',
  'setups.view.compare.confidence.low': 'Faible',
  'setups.view.compare.edge-strength.strong': 'Avantage fort',
  'setups.view.compare.edge-strength.clear': 'Avantage net',
  'setups.view.compare.edge-strength.slight': 'Léger avantage',
  'setups.view.compare.edge-reasons-privacy':
    'Les détails de l’avantage sont masqués en mode confidentialité.',
  'setups.view.compare.reason.higher.net-pnl': 'PnL net supérieur',
  'setups.view.compare.reason.lower.net-pnl': 'PnL net inférieur',
  'setups.view.compare.reason.similar.net-pnl': 'PnL net similaire',
  'setups.view.compare.reason.higher.win-rate': 'Taux de réussite supérieur',
  'setups.view.compare.reason.lower.win-rate': 'Taux de réussite inférieur',
  'setups.view.compare.reason.similar.win-rate': 'Taux de réussite similaire',
  'setups.view.compare.reason.higher.expectancy': 'Espérance supérieure',
  'setups.view.compare.reason.lower.expectancy': 'Espérance inférieure',
  'setups.view.compare.reason.similar.expectancy': 'Espérance similaire',
  'setups.view.compare.reason.higher.profit-factor': 'Profit factor supérieur',
  'setups.view.compare.reason.lower.profit-factor': 'Profit factor inférieur',
  'setups.view.compare.reason.similar.profit-factor': 'Profit factor similaire',

  'setups.view.compare.cumulative-title': 'Performance cumulée',
  'setups.view.compare.cumulative-privacy':
    'La performance cumulée est masquée en mode confidentialité.',
  'setups.view.compare.cumulative-empty':
    'Aucune donnée cumulée pour les setups sélectionnés.',

  'setups.view.title': 'Setups',

  'setups.view.summary.aria': 'Résumé de l’aperçu des setups',

  'setups.view.summary.needs-review': 'À revoir',
  'setups.view.summary.best-performer': 'Meilleure performance',

  'setups.view.ranking.metric-aria': 'Métrique de performance',
  'setups.view.ranking.privacy':
    'Les valeurs de performance sont masquées en mode confidentialité.',
  'setups.view.ranking.empty': 'Pas encore de données de performance.',

  'setups.view.metric.trade-count': 'Nombre de trades',
  'setups.view.metric.trades': 'trades',
  'setups.view.metric.net-pnl': 'PnL total',
  'setups.view.metric.total-pnl': 'PnL total',
  'setups.view.metric.win-rate': 'Taux de réussite',
  'setups.view.metric.profit-factor': 'Profit factor',
  'setups.view.metric.last-traded': 'Dernier trade',
  'setups.view.metric.expected-value': 'Valeur attendue',

  'setups.view.status.active': 'Actif',
  'setups.view.status.testing': 'En test',
  'setups.view.status.archived': 'Archivé',

  'setups.view.empty.no-setups':
    'Pas encore de setup. Créez votre premier setup pour suivre vos playbooks.',

  'setups.view.detail.back': 'Retour',

  'setups.view.detail.action.edit': 'Modifier le setup',
  'setups.view.detail.action.view-trades': 'Voir dans le journal des trades',

  'setups.view.detail.playbook': 'Playbook',

  'setups.view.detail.rules': 'Règles',
  'setups.view.detail.rule.required': 'Requis',

  'setups.view.detail.no-linked-notes': 'Pas encore de notes liées.',

  'setups.view.detail.performance.cumulative-pnl': 'PnL cumulé',
  'setups.view.detail.performance.cumulative-r': 'R cumulé',
  'setups.view.detail.performance.empty': 'Pas encore de trades liés.',

  'setups.view.detail.brief.health': 'Santé du setup',
  'setups.view.detail.brief.profile': 'Profil',
  'setups.view.detail.brief.linked-notes-modal.title': 'Notes liées',
  'setups.view.detail.brief.view-all': 'Voir tout',
  'setups.view.detail.brief.status.complete': 'Complet',
  'setups.view.detail.brief.status.missing': 'Manquant',
  'setups.view.detail.brief.health.playbook': 'Playbook',
  'setups.view.detail.brief.health.rules': 'Règles',
  'setups.view.detail.brief.health.notes': 'Notes',
  'setups.view.detail.brief.health.screenshots': 'Captures',
  'setups.view.detail.brief.health.trades': 'Trades',

  'setups.view.detail.brief.profile.direction': 'Direction',
  'setups.view.detail.brief.profile.sessions': 'Sessions',
  'setups.view.detail.brief.profile.timeframes': 'Unités de temps',
  'setups.view.detail.brief.profile.tickers': 'Symboles',
  'setups.view.detail.brief.direction.long': 'Achat',
  'setups.view.detail.brief.direction.short': 'Vente',
  'setups.view.detail.brief.direction.both': 'Les deux',
  'setups.view.completeness.incomplete-playbook': 'Playbook incomplet',
  'setups.view.completeness.no-rules': 'Aucune règle',
  'setups.view.completeness.no-linked-notes': 'Aucune note liée',
  'setups.view.date.never': 'Jamais',
  'setups.view.metric.expectancy-r': 'Espérance (R)',

  'setups.view.card.sparkline-aria': 'Mini-graphique du setup',
  'setups.view.date.today': 'Aujourd’hui',
  'setups.view.date.yesterday': 'Hier',
  'validation.setup-resolution-failed':
    'Impossible de préparer les setups sélectionnés. Vérifiez-les et réessayez.',
  'command.open-setups': 'Ouvrir les setups',
  'setups.create.title': 'Créer un setup',
  'setups.create.field.name': 'Nom du setup',
  'setups.create.placeholder.name': 'Impulsion d’ouverture',
  'setups.create.field.status': 'Statut',
  'setups.create.field.direction': 'Direction',
  'setups.create.field.color': 'Couleur',
  'setups.create.field.color-description':
    'Choisissez une couleur pour identifier ce setup.',
  'setups.create.profile.heading': 'Champs préférés',
  'setups.create.profile.optional-label': '(Facultatif)',
  'setups.create.field.sessions': 'Sessions',
  'setups.create.field.preferred-sessions-tooltip':
    'Gérez ces sessions dans Paramètres → Journal → Mode session.',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': 'Unités de temps',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'Tickers',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
  'setups.create.direction.any': 'Non spécifié',
  'setups.create.direction.long': 'Achat',
  'setups.create.direction.short': 'Vente',
  'setups.create.direction.both': 'Les deux',
  'setups.create.field.linked-notes': 'Notes liées',
  'setups.create.field.linked-notes-desc':
    'Joignez les notes existantes qui documentent le playbook de ce setup.',
  'setups.create.linked-notes.empty': 'Aucune note liée pour le moment.',
  'setups.create.linked-notes.add': '+ Lier une note',
  'setups.create.linked-notes.remove': 'Supprimer la note liée',
  'setups.create.linked-notes.picker-title': 'Choisir une note de playbook',
  'setups.create.linked-notes.search': 'Rechercher des notes...',
  'setups.create.linked-notes.no-notes': 'Aucune note Markdown trouvée.',
  'setups.create.button.creating': 'Création...',
  'setups.create.button.create': 'Créer un setup',
  'setups.create.success': 'Setup "{name}" créé avec succès',
  'setups.create.error.name-required': 'Le nom du setup est requis',
  'setups.create.error.failed': 'Impossible de créer le setup',
  'setups.edit.title': 'Modifier le setup',
  'setups.edit.button.saving': 'Enregistrement...',
  'setups.edit.button.save': 'Enregistrer le setup',
  'setups.edit.button.rename-and-update':
    'Renommer et mettre à jour les trades',
  'setups.edit.rename-warning.title':
    'Renommer le setup et mettre à jour les trades',
  'setups.edit.rename-warning.message':
    'Le renommage de {oldName} en {newName} mettra à jour les notes de trade utilisant l’ancien nom du setup.',
  'setups.edit.delete.button': 'Supprimer le setup',
  'setups.edit.delete.title': 'Supprimer le setup',
  'setups.edit.delete.confirm': 'Confirmer la suppression',
  'setups.edit.delete.warning':
    'La suppression de "{name}" retire définitivement le setup et le supprime des trades liés. Cette action est irréversible.',
  'setups.edit.delete.success': 'Setup "{name}" supprimé',
  'setups.edit.delete.error': 'Impossible de supprimer le setup',
  'setups.edit.success': 'Setup "{name}" mis à jour avec succès',
  'setups.edit.error.failed': 'Impossible de mettre à jour le setup',
  'setups.view.compare.empty-submessage':
    'Choisissez deux cartes de setup dans l’aperçu pour créer un rapport côte à côte.',
  'setups.view.compare.reason.higher.total-r': 'R total supérieur',
  'setups.view.compare.reason.lower.total-r': 'R total inférieur',
  'setups.view.compare.reason.similar.total-r': 'R total similaire',

  'setups.guide.create-new-setup.title': 'Créer de nouveaux setups',
  'setups.guide.create-new-setup.description':
    'Utilisez Nouveau setup pour ajouter un playbook. La fenêtre vous guide dans les détails, notes liées et règles.',
  'setups.guide.detail-intro.title': 'Voici la page du setup',
  'setups.guide.detail-intro.description':
    'Cette page met un playbook en évidence avec son graphique, son contexte, ses références, ses actions et ses règles d’exécution.',
  'setups.guide.detail-actions.title': 'Actions du setup',
  'setups.guide.detail-actions.description':
    'Utilisez ces boutons pour ouvrir les trades liés ou modifier détails, notes liées, captures et règles du playbook.',
  'setups.guide.empty.create-setup.title': 'Commencez avec Nouveau setup',
  'setups.guide.empty.create-setup.description':
    'Créez d’abord un setup. Une fois disponible, ce guide reprendra le parcours normal.',

  'setups.guide.intro.title': 'Bienvenue dans Setups',
  'setups.guide.intro.description':
    'Cette vue rassemble playbooks de setups, trades liés, notes, captures et règles au même endroit.',
  'setups.guide.view-tabs.title': 'Changer de vue de setups',
  'setups.guide.view-tabs.description':
    'Utilisez ces onglets pour passer entre l’aperçu, les paires et la comparaison quand il y a assez de setups.',
  'setups.guide.overview-chart.title': 'Classement de performance',
  'setups.guide.overview-chart.description':
    'Le graphique d’aperçu classe les setups selon la métrique choisie. Utilisez les contrôles en haut à droite pour changer de métrique ou cibler certains setups.',
  'setups.guide.tag-filter.title': 'Filtrer les setups',
  'setups.guide.tag-filter.description':
    'Filtrez les cartes, le graphique, les paires et la comparaison par tags ou direction. Les sélections d’un groupe utilisent OU, tandis que tags et direction se combinent.',
  'setups.guide.setup-cards.title': 'Cartes de setup',
  'setups.guide.setup-cards.description':
    'Les cartes résument chaque setup avec métriques clés, statut, dernière transaction et tendance de performance.',
  'setups.guide.open-detail.title': 'Ouvrir une page de setup',
  'setups.guide.open-detail.description':
    'Quand vous êtes prêt, ouvrez une carte de setup pour voir sa page. Un court guide vous y attend.',
  'setups.guide.detail-performance.title': 'Performance détaillée',
  'setups.guide.detail-performance.description':
    'L’onglet Performance montre le graphique et les métriques clés dans le temps : P&L, taux de réussite, espérance et drawdown.',
  'setups.guide.detail-context.title': 'Contexte du setup',
  'setups.guide.detail-context.description':
    'Ce panneau garde à portée de main santé, points d’attention, notes liées et captures.',
  'setups.guide.detail-playbook.title': 'Notes de playbook',
  'setups.guide.detail-playbook.description':
    'La zone playbook prévisualise la note liée. Elle peut contenir Markdown, images, Excalidraw ou tout matériel de référence.',
  'setups.guide.detail-rules.title': 'Règles d’exécution',
  'setups.guide.detail-rules.description':
    'Les règles capturent la checklist structurée des conditions, entrées, risque et erreurs à éviter.',
  'setups.guide.finish.title': 'Guide Setups terminé',
  'setups.guide.finish.description':
    'Vous avez vu les surfaces principales : Aperçu, Paires, Comparer et la page individuelle du setup.',

  'setups.guide.pairs-mode.title': 'Ouvrir les paires de setups',
  'setups.guide.pairs-mode.description':
    'Ouvrez Paires pour voir quelles combinaisons ont assez de trades partagés pour être comparées.',
  'setups.guide.pairs-chart.title': 'Classement des paires',
  'setups.guide.pairs-chart.description':
    'Le mode Paires met en évidence les combinaisons qui peuvent mieux ou moins bien fonctionner ensemble. Cliquez sur une barre pour ouvrir des insights plus détaillés.',

  'setups.guide.compare-mode.title': 'Démarrer la comparaison',
  'setups.guide.compare-mode.description':
    'Le mode comparaison permet de sélectionner deux cartes de setup pour une revue côte à côte.',
  'setups.guide.compare-select.title': 'Sélectionnez deux setups',
  'setups.guide.compare-select.description':
    'Sélectionnez deux cartes pour ouvrir la page de comparaison.',
  'setups.guide.compare-summary.title': 'Voici la page de comparaison',
  'setups.guide.compare-summary.description':
    'Cette page compare deux setups côte à côte. La ligne supérieure montre le gagnant, l’avantage d’espérance, la confiance et les raisons de l’avantage.',
  'setups.guide.compare-body.title': 'Ligne de résumé de comparaison',
  'setups.guide.compare-body.description':
    'La ligne supérieure résume la comparaison : gagnant, avantage d’espérance, confiance et raisons de l’avantage.',
  'setups.guide.compare-details.title': 'Détails de comparaison',
  'setups.guide.compare-details.description':
    'Utilisez le tableau de métriques et le graphique cumulé pour comprendre les différences entre les deux setups.',
  'setups.guide.detail-execution-gap.title': 'Analyse d’écart d’exécution',
  'setups.guide.detail-execution-gap.description':
    'Avec des trades manqués ou backtests, cet onglet compare l’exécution capturée à l’opportunité manquée ou au benchmark.',
  'setups.guide.back-to-overview.title': 'Retour aux cartes',
  'setups.guide.back-to-overview.description':
    'Revenez aux cartes lorsque vous avez terminé la comparaison.',

  'setups.view.open-as-markdown': 'Ouvrir en Markdown',
  'setups.view.open-as-setup': 'Ouvrir comme setup Journalit',

  'setups.view.overview.mode.pairs': 'Pairs',
  'setups.view.pairs.summary-aria': 'Résumé des paires de setups',
  'setups.view.pairs.best': 'Meilleure paire',
  'setups.view.pairs.worst': 'Pire paire',
  'setups.view.pairs.worst-short': 'Pire',
  'setups.view.pairs.empty':
    'Pas encore de paire de setups avec plus de 5 trades.',
  'setups.view.pairs.empty-submessage':
    'Les paires apparaissent lorsque deux setups partagent assez de trades liés.',
  'setups.view.pairs.privacy':
    'La performance des paires est masquée en mode confidentialité.',

  'setups.view.pairs.metric-aria': 'Métrique des paires',
  'setups.view.pairs.metric.edge': 'Avantage de la paire',
  'setups.view.pairs.metric.edge-short': 'edge',
  'setups.view.pairs.metric.expectancy': 'Espérance de la paire',

  'setups.view.pairs.together': 'Ensemble',
  'setups.view.pairs.table.setup-pair': 'Paire de setups',

  'setups.view.pairs.evidence': 'Éléments de preuve',
  'setups.view.pairs.edge-comparison': 'Comparaison des avantages',
  'setups.view.pairs.edge-caption': 'Avantage combiné : {edge}',
  'setups.view.overview.setup-filter.all': 'Setups: All',
  'setups.view.overview.setup-filter.selected': 'Setups: {count} selected',
  'setups.view.overview.setup-filter.aria': 'Choose setups to show',
  'setups.view.overview.setup-filter.select-all': 'Select all',
  'setups.view.overview.setup-filter.clear': 'Clear',

  'setups.view.overview.pnl-chart.dropdown-label': 'Cumulative P&L',

  'setups.view.overview.pnl-chart.combined': 'All setups',
  'setups.view.overview.pnl-chart.selected-combined': 'Selected setups',

  'setups.view.overview.pnl-chart.hidden':
    'Setup P&L over time is hidden while privacy mode is enabled.',
  'setups.view.overview.pnl-chart.trade': 'Trade',
  'setups.view.overview.pnl-chart.start': 'Start',
  'setups.view.ranking.empty-submessage':
    'Log trades with setups to start ranking performance.',
  'setups.view.empty.no-setups-submessage':
    'Setups collect your playbook notes, rules, trades, and performance in one place.',
  'setups.view.detail.no-playbook-note':
    'Link a playbook note to preview it here.',
  'setups.view.detail.link-playbook-note': 'Link note',
  'setups.view.detail.change-playbook-note': 'Change note',

  'setups.view.detail.playbook-note-modal.empty': 'No matching notes found.',
  'setups.view.detail.empty-playbook-note':
    'The linked playbook note is empty.',
  'setups.view.detail.rules.edit': 'Modifier les règles',

  'setups.view.detail.rules.add': 'Ajouter une règle',

  'setups.view.detail.rules.empty-title': 'Build the setup playbook',
  'setups.view.detail.rules.use-template': 'Use template',
  'setups.view.detail.rules.applying-template': 'Applying template...',
  'setups.view.detail.rules.add-custom': 'Custom rule',
  'setups.view.detail.rules.template-error':
    'Failed to apply playbook template.',
  'setups.view.detail.rules.template.best-conditions': 'Best Conditions',
  'setups.view.detail.rules.template.entry-criteria': 'Entry Criteria',
  'setups.view.detail.rules.template.invalidation': 'Invalidation',
  'setups.view.detail.rules.template.risk-management': 'Risk / Management',
  'setups.view.detail.rules.template.avoid-when': 'Avoid When',
  'setups.view.detail.rules.template.common-mistakes': 'Common Mistakes',
  'setups.view.detail.rules.template.rule.best-conditions':
    'Market context supports this setup',
  'setups.view.detail.rules.template.rule.entry-criteria':
    'Entry trigger is clearly defined',
  'setups.view.detail.rules.template.rule.invalidation':
    'Invalidation is clear before entry',
  'setups.view.detail.rules.template.rule.risk-management':
    'Risk is acceptable and target is defined',
  'setups.view.detail.rules.template.rule.avoid-when':
    'Avoid conditions are not present',
  'setups.view.detail.rules.template.rule.common-mistakes':
    'Known execution mistakes are avoided',
  'setups.view.detail.rules.field.label': 'Règle',
  'setups.view.detail.rules.field.description': 'Détails',
  'setups.view.detail.rules.field.group': 'Groupe',
  'setups.view.detail.rules.move-up': 'Déplacer la règle vers le haut',
  'setups.view.detail.rules.move-down': 'Déplacer la règle vers le bas',
  'setups.view.detail.rules.delete': 'Supprimer la règle',
  'setups.view.detail.rules.save-error':
    'Impossible d’enregistrer les règles du setup.',
  'setups.view.detail.rules.validation-label':
    'Ajoutez un nom de règle ou supprimez la règle vide avant d’enregistrer.',
  'setups.view.detail.rules.groups': 'Groups',
  'setups.view.detail.rules.add-group': 'Add group',
  'setups.view.detail.rules.new-group': 'New group',
  'setups.view.detail.rules.validation-group':
    'Add a group name or remove the blank group before saving.',
  'setups.view.detail.rules.summary': '{count} règles · {groups} groupes',

  'setups.view.detail.rule.category.context': 'Contexte',
  'setups.view.detail.rule.category.entry': 'Entrée',
  'setups.view.detail.rule.category.exit': 'Sortie',
  'setups.view.detail.rule.category.risk': 'Risque',
  'setups.view.detail.rule.category.management': 'Gestion',
  'setups.view.detail.rule.category.invalidation': 'Invalidation',
  'setups.view.detail.rule.category.psychology': 'Psychologie',
  'setups.view.detail.performance.drawdown': 'Drawdown',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',
  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Edit linked notes',

  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': 'R réel',
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
    'Aucune capture d’écran liée pour le moment.',
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

  'trade-import.restore.complete':
    '{written} trades importés restaurés ; {failed} échecs.',
  'trade-import.restore.broker-label': 'Restauration backend',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Synchronisation des trades',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'Synchronisez les trades depuis les rapports MetaTrader téléversés via votre connexion FTP.',
  'trade-sync.source.trade-import.description':
    'Restaurez les imports de fichiers broker entre coffres et récupérez les notes de trade locales manquantes.',
  'trade-sync.source.tradovate.description':
    'Synchronize Tradovate trades in the cloud and project them into this vault.',
  'trade-sync.tradovate.status-failed': 'Unable to load Tradovate status.',
  'trade-sync.tradovate.last-sync': 'Dernière synchronisation',
  'trade-sync.tradovate.last-projection': 'Dernière projection',
  'trade-sync.tradovate.pending-projections':
    '{count} projection(s) en attente',
  'trade-sync.tradovate.pending-acks': '{count} ACK locaux en attente',
  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Synchronisez les transactions Rithmic dans le cloud et projetez-les dans ce coffre.',
  'trade-sync.rithmic.plugin-sync-description':
    'Connectez Rithmic sur Journalit.co, puis synchronisez ici pour écrire votre activité Rithmic la plus récente dans ce coffre.',
  'trade-sync.rithmic.status-failed':
    'Impossible de charger le statut Rithmic.',
  'trade-sync.rithmic.status.connecting': 'Connexion',
  'trade-sync.rithmic.status.paused': 'En pause',
  'trade-sync.rithmic.status.waiting-for-accounts': 'En attente de comptes',
  'trade-sync.rithmic.status.reauthorization-required':
    'Réautorisation requise sur Journalit.co',
  'trade-sync.rithmic.status.error': 'Erreur de connexion',
  'trade-sync.rithmic.no-connections':
    'Connectez un compte Rithmic sur Journalit.co pour le synchroniser ici.',
  'trade-sync.rithmic.connect': 'Connecter',
  'trade-sync.rithmic.manage': 'Gérer sur Journalit.co',
  'trade-sync.rithmic.system': 'Système Rithmic',
  'trade-sync.rithmic.accounts': 'Comptes',
  'trade-sync.rithmic.last-sync': 'Dernière synchronisation',
  'trade-sync.rithmic.never': 'Jamais',
  'trade-sync.rithmic.job.running': 'Synchronisation en cours…',
  'trade-sync.rithmic.job.last': 'Dernière tâche : {status}',
  'trade-sync.job.status.queued': "En file d'attente",
  'trade-sync.job.status.running': 'En cours',
  'trade-sync.job.status.succeeded': 'Réussi',
  'trade-sync.job.status.partial': 'Partiel',
  'trade-sync.job.status.failed': 'Échoué',
  'trade-sync.job.status.cancelled': 'Annulé',
  'trade-sync.job.status.unknown': 'Inconnu',
  'trade-sync.rithmic.sync-to-vault': 'Synchroniser',
  'trade-sync.rithmic.syncing': 'Synchronisation…',
  'trade-sync.rithmic.mapping-required':
    'Choisissez un compte local du coffre pour chaque compte Rithmic synchronisé.',
  'trade-sync.rithmic.sync-complete-connection':
    'Synchronisation de {connection} terminée.',
  'trade-sync.rithmic.sync-partial-connection':
    'Synchronisation de {connection} terminée avec des problèmes.',
  'trade-sync.rithmic.sync-all': 'Tout synchroniser',
  'trade-sync.rithmic.sync-all-complete':
    '{succeeded} connexion(s) Rithmic synchronisée(s) sur {total}.',
  'trade-sync.rithmic.sync-all-partial':
    '{succeeded} connexion(s) Rithmic synchronisée(s) sur {total}. Vérifiez les connexions présentant des problèmes.',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic n’autorise qu’une seule session active. Fermez R|Trader, NinjaTrader ou toute autre plateforme utilisant cet identifiant Rithmic.',
  'trade-sync.rithmic.error.auto-retry': 'Journalit réessaie automatiquement.',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic a refusé les identifiants enregistrés. Mettez-les à jour sur Journalit.co, puis réessayez.',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic exige la signature des accords de données de marché dans R|Trader. Signez-les, puis réessayez.',
  'trade-sync.rithmic.error.disabled':
    'La synchronisation Rithmic est désactivée pour cette connexion. Gérez-la sur Journalit.co.',
  'trade-sync.rithmic.error.sync-failed':
    'La synchronisation Rithmic a échoué. Vérifiez la connexion sur Journalit.co, puis réessayez.',
  'trade-sync.broker.mapping-unsaved-hint':
    "L'association est enregistrée lors de la synchronisation.",
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'Modifications de compte non enregistrées. Synchronisez cette connexion pour les enregistrer.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    "Choisissez d'abord un compte Journalit pour chaque compte synchronisé.",
  'trade-sync.broker.sync-all-blocked.running-job':
    'Une synchronisation est déjà en cours.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'Aucune connexion n’est prête à être synchronisée.',
  'trade-sync.rithmic.connect-another': 'Connecter un autre compte Rithmic',
  'trade-sync.rithmic.error.sync-failed-detail':
    'La synchronisation Rithmic a échoué : {message}',
  'trade-sync.tradovate.never': 'Jamais',

  'trade-sync.import.card.connection': 'Connexion',
  'trade-sync.import.card.backup': 'Sauvegarde des imports',
  'trade-sync.import.card.restorable': 'Trades restaurables',
  'trade-sync.import.card.import': 'Trade Import',

  'trade-sync.import.card.open-importer-desc':
    'Importez de nouveaux fichiers broker ici',
  'trade-sync.import.card.inventory-summary':
    '{accounts} compte(s) · {trades} trade(s)',
  'trade-sync.import.action.check': 'Vérifier',

  'trade-sync.import.action.open-import': 'Ouvrir Trade Import',

  'trade-sync.import.action.create-local-account': 'Créer un compte',
  'trade-sync.import.action.create-local-account-title':
    'Crée un compte Journalit avec le nom du compte backend.',
  'trade-sync.import.action.save-mapping': 'Enregistrer',
  'trade-sync.import.action.save-mapping-title':
    'Enregistre l’association entre ce compte backend et le compte local.',

  'trade-sync.import.action.restore-account': 'Restaurer',
  'trade-sync.import.action.restore-account-title':
    'Restaure les notes de trade locales manquantes pour ce compte backend.',
  'trade-sync.import.action.restoring': 'Restauration…',

  'trade-sync.import.pending-acks': '{count} ACK en attente',

  'trade-sync.import.empty-accounts':
    'Aucun compte Trade Import sauvegardé trouvé pour le moment.',
  'trade-sync.import.account.restorable-count': '{count} restaurable(s)',
  'trade-sync.import.account.synced-count': '{count} synchronisé(s)',
  'trade-sync.import.account.missing-count': '{count} manquant(s)',
  'trade-sync.import.account.issue-count': '{count} problème(s)',
  'notice.error.canonical-trade-type-change':
    'Les trades synchronisés avec le courtier ne peuvent pas changer de type.',
  'trade-sync.import.account.conflict-repair':
    'Des notes canonicalTradeId en double ont été trouvées. Conservez une note puis retirez canonicalTradeId de la note en double ou supprimez-la. Renommer le fichier ne résout pas le conflit.',
  'trade-sync.import.account.local-account': 'Compte Journalit',
  'trade-sync.import.account.mapping-hint':
    'Les trades restaurés seront écrits dans ce compte Journalit.',
  'trade-sync.import.notice.restored':
    '{count} trade(s) importé(s) restauré(s).',

  'trade-sync.import.notice.sync-cloud-failed':
    'Unable to start cloud synchronization.',
  'trade-sync.import.notice.load-failed':
    'Impossible de charger l’état de synchronisation Trade Import.',
  'trade-sync.import.notice.mapping-failed':
    'Impossible d’enregistrer l’association du compte Trade Import.',
  'trade-sync.import.notice.create-account-failed':
    'Impossible de créer le compte local.',
  'trade-sync.import.notice.restore-failed':
    'Impossible de restaurer le compte Trade Import.',
  'trade-sync.rate-limit.action.mapping': 'Association de compte',
  'trade-sync.import.notice.rate-limited':
    '{action}: Trop de requêtes. Réessayez dans {seconds} s.',
  'setups.view.loading': 'Loading setups…',
  'settings.general.copy-trading-pnl-toggled': 'Copy trading PnL is {status}',
  'setups.view.trade.unknown-instrument': 'Unknown instrument',
  'command.open-session-mode': 'Ouvrir la session en direct',
  'view.session-mode': 'Session en direct',
  'widget.session-log.name': 'Journal de session',
  'widget.session-log.description':
    'Capturez des notes d’exécution horodatées et des événements de trade.',
  'session-log.title': 'Journal de session en direct',
  'session-log.description':
    'Capturez ce qui se passe pendant la session de trading actuelle.',
  'session-log.notice.invalid-timestamp':
    'Saisissez un horodatage valide pour le journal de session.',
  'session-log.action.auto-time': 'Heure automatique',
  'session-log.action.set-time': 'Définir l’heure',

  'session-log.composer.tag-label': 'Étiquette du journal de session',
  'session-log.placeholder.entry-short': 'Ajouter une note de session...',
  'session-log.action.add-entry': 'Ajouter une entrée horodatée',
  'session-log.action.add-note': 'Ajouter',
  'session-log.action.hide-composer': 'Masquer le composeur',
  'session-log.filter.all': 'Tout',
  'session-log.filter.label': 'Filtrer le journal de session',
  'session-log.filter.clear': 'Effacer le filtre',
  'session-log.timeline.most-recent': 'Plus récent',
  'session-log.timeline.start': 'Début de session',
  'session-log.empty': 'Aucune entrée de journal de session pour le moment.',
  'session-log.empty-filtered': 'Aucune entrée ne correspond à ce filtre.',
  'session-log.loading': 'Chargement du journal de session…',
  'session-log.lessons.title': 'Lessons learned',

  'session-log.lessons.badge': 'LSN',
  'session-log.session-group.outside': 'Hors sessions',

  'session-log.trade.entered': 'Entrée',
  'session-log.trade.exited': 'Sortie',
  'session-log.trade.size': 'taille',

  'session-log.status.unclassified': 'unclassified',
  'session-log.action.save': 'Enregistrer',
  'session-log.action.cancel': 'Annuler',

  'session-log.action.classify': 'Classify',
  'session-log.action.edit': 'Modifier',
  'session-log.action.delete': 'Supprimer',
  'session-log.action.open-trade': 'Ouvrir le trade',
  'session-log.preview':
    'Aperçu du journal de session : les notes horodatées et les événements de trade apparaîtront ici pendant la session en direct.',
  'session-log.alert.tag-concentration':
    '{tag} représente {percentage}% des notes de session ({count}/{total}). Vérifiez toute dérive avant de continuer.',

  'session-mode.loading': 'Chargement du mode session',

  'session-mode.section.timeline': 'Chronologie',
  'session-mode.title.ended': 'Session terminée',

  'session-mode.title.break': 'Pause de session',
  'session-mode.title.live': 'Session en direct',
  'session-mode.title.preparation': 'Préparation de session',

  'session-mode.prep.resources': 'Ressources',

  'session-mode.action.open-drc-for-date': 'Ouvrir le DRC pour {date}',
  'session-mode.ended.helper': 'Consignez vos trades ou révisez la journée.',
  'session-mode.ended.action.import-trades': 'Importer des trades',
  'session-mode.ended.action.add-trade-manually':
    'Ajouter un trade manuellement',
  'session-mode.ended.action.open-drc': 'Ouvrir le DRC',
  'session-log.session-group.unplanned': 'Non planifiée @ {time}',
  'session-mode.unplanned.name': 'Session non planifiée',
  'session-mode.unplanned.start': 'Démarrer une session non planifiée',
  'session-mode.unplanned.stop': 'Arrêter la session',
  'session-mode.unplanned.badge': 'Non planifiée',
  'session-mode.unplanned.status.live':
    'Démarrée à {time} · {elapsed} écoulées',
  'session-mode.unplanned.ended.summary':
    'Session non planifiée · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'Démarrer une session non planifiée',
  'session-mode.unplanned.modal.description':
    'Vous êtes en dehors de vos fenêtres de session planifiées. Cette session sera marquée comme non planifiée dans votre bilan quotidien. Notez pourquoi vous tradez maintenant.',
  'session-mode.unplanned.modal.reason-label': 'Raison',
  'session-mode.unplanned.modal.reason-placeholder':
    'ex. FOMC à 14h00, session du matin manquée',
  'session-mode.unplanned.modal.reason-required':
    'Indiquez une raison avant de démarrer.',
  'session-mode.unplanned.notice.started': 'Session non planifiée démarrée.',
  'session-mode.unplanned.notice.stopped': 'Session non planifiée arrêtée.',
  'session-mode.unplanned.notice.blocked-live':
    'Une session est déjà en cours.',
  'session-mode.unplanned.notice.none-running':
    'Aucune session non planifiée en cours.',
  'session-mode.unplanned.notice.failed':
    'Impossible de mettre à jour la session non planifiée. Consultez la console pour plus de détails.',
  'session-mode.ended.stat.trades': 'Trades',
  'session-mode.ended.stat.notes': 'Notes',
  'session-mode.ended.stat.gate-checks': 'Contrôles Gate',
  'session-mode.waiting.next-session': 'Prochaine session',
  'session-mode.waiting.starts-at': '{session} commence à {time}',
  'session-mode.waiting.preparation-opens-in':
    'La préparation s’ouvre dans {remaining}',
  'session-mode.waiting.open-drc': 'Ouvrir le DRC',

  'session-mode.break.reset-before': 'Reprenez vos esprits avant {session}',
  'session-mode.break.reset': 'Reprenez vos esprits avant la prochaine session',
  'session-mode.break.next-session-meta':
    'Prochaine session à {time} · {remaining} restantes',
  'session-mode.break.description':
    'Éloignez-vous, hydratez-vous et clarifiez votre esprit avant la prochaine session.',
  'session-mode.break.open-drc': 'Ouvrir le DRC',
  'session-mode.countdown.starts-in': 'Commence dans',
  'session-mode.countdown.starts-at': '{session} commence à {time}',
  'session-mode.countdown.hours': 'h',
  'session-mode.countdown.minutes': 'min',
  'session-mode.countdown.seconds': 's',
  'session-mode.phase.preparation': 'Préparation',
  'session-mode.phase.live': 'En direct',
  'session-mode.phase.waiting': 'En attente',
  'session-mode.phase.break': 'Pause',
  'session-mode.phase.ended': 'Terminée',
  'session-mode.phase.unconfigured': 'Horaire de session non configuré',
  'session-mode.status.preparation':
    '{session} commence à {time}. Il vous reste {remaining} pour vous préparer.',
  'session-mode.status.preparation-generic':
    'Préparez-vous pour la prochaine session de trading en direct.',
  'session-mode.status.waiting':
    '{session} commence à {time}. La préparation commence dans {remaining}.',
  'session-mode.status.waiting-generic':
    'Votre prochaine session est planifiée, mais la préparation n’a pas encore commencé.',
  'session-mode.status.live': '{remaining} restantes dans cette session.',
  'session-mode.status.live-generic': 'Votre session de trading est en direct.',
  'session-mode.status.break':
    '{session} commence à {time}. Vous êtes en pause pendant {remaining}.',
  'session-mode.status.break-generic':
    'Vous êtes entre deux sessions de trading.',
  'session-mode.status.ended':
    'Vos sessions de trading configurées sont terminées pour le moment.',
  'session-mode.status.unconfigured':
    'Configurez des fenêtres de session pour activer les phases préparation, direct, pause et terminée. La chronologie reste disponible pour le DRC du jour.',

  'session-mode.unconfigured.title': 'Définissez vos horaires de trading',
  'session-mode.unconfigured.description':
    'Ajoutez les horaires pendant lesquels vous tradez réellement afin que le Mode session passe automatiquement entre préparation, direct, pause et terminé.',
  'session-mode.unconfigured.step.window.title': 'Add a session window',

  'session-mode.unconfigured.step.prep.title': 'Review preparation timing',

  'session-mode.unconfigured.step.gate.title': 'Use the Starter Trade Gate',

  'session-mode.unconfigured.step.log.title': 'Log notes during live sessions',

  'session-mode.unconfigured.action': 'Configurer le Mode session',
  'session-mode.guide.why.title': 'Tradez votre plan, pas votre humeur',
  'session-mode.guide.why.description':
    "Le mode session vous prépare avant chaque session, vous tient à vos règles avec un Trade Gate pendant qu'elle est en cours, et garde un journal horodaté pour rejouer la journée. Deux minutes suffisent pour le configurer.",
  'session-mode.guide.configure.title': 'Configurez-le maintenant',
  'session-mode.guide.configure.description':
    'Ajoutez vos horaires de session et créez votre premier Trade Gate. Un court guide vous accompagnera dans les réglages.',
  'session-mode.guide.preparation.countdown.title': 'Votre session approche',
  'session-mode.guide.preparation.countdown.description':
    "C'est la phase de préparation. Le compte à rebours indique quand vous passez en direct, et cette page bascule d'elle-même en mode direct.",
  'session-mode.guide.preparation.goals.title': 'Fixez les objectifs du jour',
  'session-mode.guide.preparation.goals.description':
    "Écrivez à quoi ressemble une bonne session avant l'ouverture, pour avoir un repère auquel vous tenir.",
  'session-mode.guide.preparation.checklist.title': 'Parcourez votre checklist',
  'session-mode.guide.preparation.checklist.description':
    "Cochez ici votre routine d'avant-session. Tout ce que vous cochez est enregistré dans la note de revue du jour.",
  'session-mode.guide.preparation.next.title': 'Quand vous passez en direct',
  'session-mode.guide.preparation.next.description':
    'Votre Trade Gate et votre journal de session apparaîtront ici. Nous vous les présenterons la première fois.',
  'session-mode.guide.live.trade-gate.title':
    'Passez le Trade Gate avant chaque trade',
  'session-mode.guide.live.trade-gate.description':
    'Appuyez sur Démarrer et répondez aux questions issues de vos critères. Le gate se termine par feu vert, attendre ou pas de trade, pour ne prendre que les trades que votre système autorise.',
  'session-mode.guide.live.session-log.title':
    'Notez ce que vous voyez et ressentez',
  'session-mode.guide.live.session-log.description':
    "Consignez setups, émotions et décisions au fil de l'eau. Chaque note est horodatée, pour rejouer ensuite exactement ce qui se passait.",
  'session-mode.guide.live.settings.title': 'Ajustez-le à tout moment',
  'session-mode.guide.live.settings.description':
    'Modifier ouvre les réglages du mode session : horaires, mise en page par phase, workflows Trade Gate et tags du journal.',
  'session-mode.guide.ended.review.title':
    'Passez maintenant en revue la session',
  'session-mode.guide.ended.review.description':
    'Ouvrez le DRC du jour pour la revue. Ajoutez le widget Journal de session à votre mise en page DRC et chaque note horodatée y apparaîtra.',
  'settings.session-mode.guide.setting-name': 'Visite guidée',
  'settings.session-mode.guide.setting-desc':
    'Un court tour de ces réglages, des horaires de session à votre premier Trade Gate.',
  'settings.session-mode.guide.replay': 'Afficher le guide',
  'settings.session-mode.guide.intro.title': 'Configurons le mode session',
  'settings.session-mode.guide.intro.description':
    'Quatre choses : quand vos sessions ont lieu, ce que montre chaque phase, votre Trade Gate et les tags de votre journal.',
  'settings.session-mode.guide.lead-time.title': 'Délai de préparation',
  'settings.session-mode.guide.lead-time.description':
    "Combien de minutes avant une session la phase de préparation s'ouvre.",
  'settings.session-mode.guide.windows.title':
    'Ajoutez vos fenêtres de session',
  'settings.session-mode.guide.windows.description':
    "Une fenêtre par session tradée, avec un nom, un début et une fin. Le mode session s'en sert pour savoir quand préparer et quand vous êtes en direct.",
  'settings.session-mode.guide.layout.title':
    'Choisissez ce que montre chaque phase',
  'settings.session-mode.guide.layout.description':
    'Activez ou désactivez les modules par phase : ressources, objectifs et checklist en préparation ; Trade Gate et chronologie en direct.',
  'settings.session-mode.guide.trade-gate.title':
    'Construisez votre Trade Gate',
  'settings.session-mode.guide.trade-gate.description':
    'Ajouter crée la première fois un workflow de départ avec des questions courantes, puis un workflow vide ; la bibliothèque propose des questions prêtes. Chaque question mène à la suivante ou à un résultat : feu vert, attendre ou pas de trade.',
  'settings.session-mode.guide.editor.title': 'Questions et résultats',
  'settings.session-mode.guide.editor.description':
    'Dépliez un workflow pour ajouter des questions et définir où mène chaque réponse. Le bouton lecture le lance exactement comme en session.',
  'settings.session-mode.guide.tags.title':
    'Tags pour votre journal de session',
  'settings.session-mode.guide.tags.description':
    'Taguez vos notes en les consignant, par émotion ou par setup par exemple, pour les filtrer dans votre revue.',
  'settings.session-mode.guide.finish.title': "C'est prêt",
  'settings.session-mode.guide.finish.description':
    "Ouvrez le mode session depuis le ruban ou l'accueil. Ajoutez le widget Journal de session à votre DRC pour retrouver vos notes dans chaque revue.",

  'session-mode.layout.empty.title': 'Nothing enabled for this phase',
  'session-mode.layout.empty.description':
    'Turn modules back on to build this Session Mode phase.',
  'session-mode.duration.minutes': '{minutes}m',
  'session-mode.duration.hours': '{hours}h',
  'session-mode.duration.hours-minutes': '{hours}h {minutes}m',
  'settings.session-mode.title': 'Session en direct',
  'settings.session-mode.description':
    'Configurez les plages de session, la préparation, la disposition des phases, les workflows Trade Gate et les étiquettes du journal de session.',
  'settings.session-mode.preparation-lead-time':
    'Temps de préparation (minutes)',
  'settings.session-mode.preparation-lead-time-desc':
    'Quand le mode préparation commence avant une session.',
  'settings.session-mode.windows': 'Fenêtres de session',

  'settings.session-mode.add-window-short': 'Ajouter',
  'settings.session-mode.no-windows':
    'Aucune fenêtre de session configurée pour le moment. La chronologie en direct fonctionne toujours, mais la préparation par phases commence après l’ajout d’une fenêtre.',
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
  'settings.session-mode.linked-resources': 'Ressources liées',
  'settings.session-mode.linked-resources-desc':
    'Affiche des liens rapides vers les notes pendant la préparation.',
  'settings.session-mode.linked-resources-count': '{count} linked',
  'settings.session-mode.linked-resources-hide': 'Hide linked',
  'settings.session-mode.session-log': 'Journal de session',
  'settings.session-mode.session-log-desc':
    'Choisissez quels événements automatiques apparaissent à côté de vos notes de session.',
  'settings.session-mode.show-trade-executions': 'Entrées et sorties de trades',
  'settings.session-mode.show-trade-executions-desc':
    'Afficher les entrées et sorties de trades dans les journaux du mode session et de la revue quotidienne.',
  'settings.session-mode.session-log-tags': 'Étiquettes du journal de session',
  'settings.session-mode.session-log-tags-desc':
    'Personnalisez les étiquettes disponibles dans le compositeur du mode session et le journal de session DRC.',
  'settings.session-mode.tag-label-placeholder': 'Nom de l’étiquette',
  'settings.session-mode.tag-short-label-placeholder': 'Libellé court',
  'settings.session-mode.tag-label-example': 'Trade',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Couleur de l’étiquette',
  'settings.session-mode.tag-requires-resolution': 'Nécessite une résolution',
  'settings.session-mode.tag-lesson': 'Étiquette de leçon',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Les entrées avec cette étiquette sont marquées comme éléments de suivi jusqu’à leur résolution dans le journal de session. Utilisez-la pour les notes qui nécessitent une revue ou une action après la session.',
  'settings.session-mode.tag-lesson-tooltip':
    'Marque cette étiquette comme une entrée d’apprentissage. Les notes avec une étiquette de leçon peuvent être affichées comme leçons et mises en avant comme moments d’apprentissage dans les flux du journal de session.',
  'settings.session-mode.add-session-log-tag':
    'Ajouter une étiquette de journal de session',
  'settings.session-mode.reset-session-log-tags':
    'Réinitialiser les étiquettes du journal de session',
  'settings.session-mode.tag-color.blue': 'Bleu',
  'settings.session-mode.tag-color.indigo': 'Indigo',
  'settings.session-mode.tag-color.purple': 'Violet',
  'settings.session-mode.tag-color.green': 'Vert',
  'settings.session-mode.tag-color.pink': 'Rose',
  'settings.session-mode.tag-color.amber': 'Ambre',
  'settings.session-mode.tag-color.red': 'Rouge',
  'settings.session-mode.tag-color.orange': 'Orange',

  'settings.session-mode.search-resource-placeholder':
    'Rechercher des fichiers du coffre à lier…',

  'settings.session-mode.window-name': 'Nom de la session',
  'settings.session-mode.window-name-placeholder': 'ex. NY AM',

  'settings.session-mode.start-time': 'Heure de début',
  'settings.session-mode.end-time': 'Heure de fin',

  'trade-gate.workflow': 'Flux',

  'trade-gate.action.start-short': 'Start',
  'trade-gate.action.start-another': 'En démarrer une autre',
  'trade-gate.outcome.green-light': 'Feu vert',
  'trade-gate.outcome.green-light-description': 'Conditions remplies.',
  'trade-gate.outcome.no-trade': 'Pas de trade',
  'trade-gate.outcome.no-trade-description':
    'Les conditions ne sont pas remplies.',
  'trade-gate.outcome.wait': 'Attendre',
  'trade-gate.outcome.wait-description':
    'Le setup n’est pas prêt. Attendez la prochaine opportunité.',
  'settings.session-mode.trade-gate.title': 'Flux Trade Gate',
  'settings.session-mode.trade-gate.desc':
    'Créez des flux de décision IF/THEN pour les vérifications d’entrée en direct.',
  'settings.session-mode.trade-gate.delete-workflow.title':
    'Supprimer le workflow Trade Gate ?',
  'settings.session-mode.trade-gate.delete-workflow.message':
    'Supprimer « {name} » ? Toutes les questions et branches de ce workflow seront supprimées. Cette action est irréversible.',
  'settings.session-mode.trade-gate.delete-workflow.confirm':
    'Supprimer le workflow',
  'settings.session-mode.trade-gate.name': 'Nom du flux',
  'settings.session-mode.trade-gate.edit-question': 'Modifier la question',
  'settings.session-mode.trade-gate.no-options':
    'Ajoutez des options de réponse pour cette question.',
  'settings.session-mode.trade-gate.not-wired': 'Pas encore reliée',
  'settings.session-mode.trade-gate.not-wired-hint': 'Cliquez pour la relier',
  'settings.session-mode.trade-gate.target-group-questions': 'Questions',
  'settings.session-mode.trade-gate.target-current': 'Actuel : {title}',
  'settings.session-mode.trade-gate.target-group-outcomes': 'Résultats',
  'settings.session-mode.trade-gate.new-question-target': '+ Nouvelle question',
  'settings.session-mode.trade-gate.outcome-note':
    'Note du résultat (cette branche uniquement)',
  'settings.session-mode.trade-gate.remove-from-workflow': 'Retirer de ce flux',
  'settings.session-mode.trade-gate.used-in-workflows':
    'Utilisée dans les flux : {count}',
  'settings.session-mode.trade-gate.not-used': 'Pas encore utilisée',
  'settings.session-mode.trade-gate.question-count': 'Questions : {count}',
  'settings.session-mode.trade-gate.library-title': 'Bibliothèque de questions',
  'settings.session-mode.trade-gate.library-search':
    'Rechercher des questions…',
  'settings.session-mode.trade-gate.library-empty':
    'Aucune question trouvée. Créez-en une pour commencer.',
  'settings.session-mode.trade-gate.delete-question.title':
    'Supprimer la question ?',
  'settings.session-mode.trade-gate.delete-question.message':
    'Supprimer « {name} » de la bibliothèque de questions ? Cette action est irréversible.',
  'settings.session-mode.trade-gate.delete-question.message-used':
    'Supprimer « {name} » de la bibliothèque de questions ? Elle est utilisée dans : {workflows}. Ses branches seront supprimées de ces flux. Cette action est irréversible.',
  'settings.session-mode.trade-gate.delete-question.confirm':
    'Supprimer la question',
  'settings.session-mode.trade-gate.unplaced-title':
    'Dans ce flux, pas encore reliées',
  'settings.session-mode.trade-gate.no-start':
    'Choisissez une question de départ pour afficher le flux.',
  'settings.session-mode.trade-gate.untitled': 'Flux sans titre',
  'settings.session-mode.trade-gate.start-node': 'Question de départ',
  'settings.session-mode.trade-gate.simulation.show': 'Simuler',
  'settings.session-mode.trade-gate.simulation.unavailable':
    'Reliez la question de départ à au moins un résultat complet avant de lancer la simulation.',
  'settings.session-mode.trade-gate.add-question': 'Ajouter une question',
  'settings.session-mode.trade-gate.question': 'Question',
  'settings.session-mode.trade-gate.new-question-title': 'Nouvelle question',
  'settings.session-mode.trade-gate.question-title': 'Titre de la question',
  'settings.session-mode.trade-gate.prompt': 'Prompt',
  'settings.session-mode.trade-gate.options': 'Options',
  'settings.session-mode.trade-gate.option': 'Option',
  'settings.session-mode.trade-gate.option-label': 'Libellé de l’option',
  'settings.session-mode.trade-gate.option-target': 'Mène à',
  'settings.session-mode.trade-gate.flow-map': 'Carte du flux',
  'settings.session-mode.trade-gate.flow-fit': 'Ajuster',
  'settings.session-mode.trade-gate.flow-click-hint':
    'Cliquez sur un nœud ou une étiquette de chemin pour le modifier.',
  'settings.session-mode.trade-gate.flow-truncated':
    'Ce flux est trop grand pour être affiché entièrement. Certaines branches répétées sont masquées.',
  'settings.session-mode.trade-gate.no-questions':
    'Ajoutez la première question pour démarrer ce flux.',
  'filter.modal.image.annotation-status': 'Statut des annotations',
  'filter.modal.image.status.tagged': 'Étiquetées',
  'filter.modal.image.status.untagged': 'Sans étiquette',
  'filter.modal.image.status.has-notes': 'Avec notes',
  'filter.modal.image.status.no-notes': 'Sans notes',
  'filter.modal.image.tags': 'Tags média',
  'setups.view.detail.action.gallery': 'Ouvrir la galerie',
  'tradelog.mode.label': 'Mode du journal de trades',
  'tradelog.mode.trades': 'Transactions',
  'tradelog.mode.image-gallery': 'Galerie',

  'imageGallery.empty.error.title': 'Galerie indisponible',
  'imageGallery.empty.no-images.title': 'Aucun média pour le moment',
  'imageGallery.empty.no-images.description':
    'Les images, GIF, vidéos et liens YouTube attachés aux trades ou aux notes de review apparaîtront ici automatiquement.',
  'imageGallery.empty.no-results.title':
    'Aucun média ne correspond à ces filtres',
  'imageGallery.empty.no-results.description':
    'Essayez d’effacer les filtres actifs ou d’élargir la plage de dates pour afficher plus d’éléments de galerie.',
  'imageGallery.empty.no-source.title': 'Aucun média dans cette source',
  'imageGallery.empty.no-source.description':
    'Cette source ne contient pas encore d’éléments de galerie. Revenez à tous les médias ou choisissez une autre source.',
  'imageGallery.empty.action.clear-filters': 'Effacer les filtres',
  'imageGallery.empty.action.show-all': 'Afficher tous les médias',
  'imageGallery.error.load-failed': 'Impossible de charger la galerie.',

  'imageGallery.open-source': 'Ouvrir la note',
  'imageGallery.image-alt': 'Média {source} du {date}',
  'imageGallery.privacy-blurred': 'Flouté pour la confidentialité',

  'imageGallery.sort.label': 'Trier :',
  'imageGallery.sort.newest': 'Plus récentes',
  'imageGallery.sort.oldest': 'Plus anciennes',
  'imageGallery.sort.best': 'Meilleur P&L',
  'imageGallery.sort.worst': 'Pire P&L',
  'imageGallery.size-aria': 'Taille des médias de la galerie',
  'imageGallery.size.small': 'Petite',
  'imageGallery.size.medium': 'Moyenne',
  'imageGallery.size.large': 'Grande',
  'imageGallery.view-mode-aria': 'Regroupement des cartes de la galerie',
  'imageGallery.view-mode.grouped': 'Groupés',
  'imageGallery.view-mode.individual': 'Individuels',
  'imageGallery.group.additional-media':
    '{count} éléments média supplémentaires',
  'imageGallery.group.annotation-summary':
    '{annotated} éléments média annotés sur {total}',
  'imageGallery.group.navigation':
    'Média {mediaCurrent} sur {mediaTotal} · Entrée {groupCurrent} sur {groupTotal}',
  'imageGallery.source.label': 'Source :',
  'imageGallery.source.all': 'Tous les médias',
  'imageGallery.source.trade': 'Trades',
  'imageGallery.source.folder': 'Dossiers',
  'imageGallery.source.reviews': 'Reviews',
  'imageGallery.source.drc': 'Reviews quotidiennes',
  'imageGallery.source.weekly': 'Reviews hebdomadaires',
  'imageGallery.source.monthly': 'Reviews mensuelles',
  'imageGallery.source.quarterly': 'Reviews trimestrielles',
  'imageGallery.source.yearly': 'Reviews annuelles',

  'imageGallery.annotation.reviewed': 'Revue',
  'imageGallery.annotation.unreviewed': 'Non revue',
  'imageGallery.date.unknown': 'Date inconnue',
  'imageGallery.annotation.tag': 'Tag',

  'imageGallery.annotation.editor-title': 'Annoter le média',
  'imageGallery.annotation.editor-title-with-file': 'Annoter {fileName}',
  'imageGallery.annotation.tags': 'Tags',
  'imageGallery.annotation.tags-placeholder': 'Breakout, setup A+, erreur',
  'imageGallery.annotation.notes': 'Notes',
  'imageGallery.annotation.notes-placeholder':
    'Que doit retenir votre futur vous de ce graphique ?',
  'imageGallery.annotation.error.save-failed':
    'Impossible d’enregistrer l’annotation du média.',
  'imageGallery.annotation.error.load-failed':
    'Impossible de charger l’annotation du média.',
  'imageGallery.annotation.saving': 'Enregistrement...',
  'settings.gallery-folders.section': 'Galerie multimédia',
  'settings.gallery-folders.description':
    'Afficher les médias de ces dossiers dans la galerie du journal de trading.',
  'settings.gallery-folders.placeholder': 'Choisir un dossier...',
  'settings.gallery-folders.add': 'Ajouter',
  'settings.gallery-folders.remove-aria':
    'Supprimer le dossier de galerie {path}',
  'settings.gallery-folders.not-a-folder':
    'Sélectionnez un dossier plutôt qu’un fichier multimédia.',
  'settings.gallery-folders.save-failed':
    'Impossible d’enregistrer les dossiers de la galerie. Veuillez réessayer.',
  'tradelog.guide.switch-to-gallery.title': 'Passer des trades à la Galerie',
  'tradelog.guide.switch-to-gallery.description':
    'Utilisez ce sélecteur de mode pour passer du journal de trades classique à la Galerie. Cliquez sur Galerie pour continuer la visite avec vos images, GIF, vidéos et liens YouTube.',

  'tradelog.guide.gallery-grouping.title':
    'Regrouper les médias par entrée du journal',
  'tradelog.guide.gallery-grouping.description':
    'Le mode groupé conserve chaque trade ou review dans une seule carte. Le mode individuel affiche chaque élément média joint dans sa propre carte.',
  'tradelog.guide.gallery-source-sort.title':
    'Choisir la source et l’ordre des médias',
  'tradelog.guide.gallery-source-sort.description':
    'Utilisez Source pour afficher tous les médias, les pièces jointes de trades ou les médias de notes de review. Utilisez Trier pour revoir d’abord les trades les plus récents, les plus anciens, les meilleurs ou les pires.',
  'tradelog.guide.gallery-size.title': 'Ajuster la taille des aperçus',
  'tradelog.guide.gallery-size.description':
    'Utilisez ces boutons de taille pour passer d’un balayage compact à de plus grands aperçus de graphiques sans rogner les détails importants.',
  'tradelog.guide.gallery-filters.title':
    'Filtrer la galerie depuis le même point d’entrée',
  'tradelog.guide.gallery-filters.description':
    'Le bouton de filtre ouvre toujours les filtres avancés. En mode Galerie, il inclut aussi des filtres propres aux médias, comme le statut d’annotation et les tags média.',
  'tradelog.guide.gallery-filter-modal.title':
    'Les filtres média sont avec vos filtres de trade',
  'tradelog.guide.gallery-filter-modal.description':
    'Utilisez cette fenêtre pour combiner les filtres de trades et les filtres média. Par exemple, filtrez sur un setup, puis affichez seulement les médias avec des notes ou un tag média précis.',
  'tradelog.guide.gallery-grid.title':
    'Ouvrir les médias pour les examiner de près',
  'tradelog.guide.gallery-grid.description':
    'Chaque carte garde le graphique dégagé tout en affichant un contexte compact du trade ou de la review. Cliquez sur une carte, ou sur Suivant, pour ouvrir le premier élément visible en plein écran.',
  'tradelog.guide.gallery-fullscreen-actions.title':
    'Annoter les médias en plein écran',
  'tradelog.guide.gallery-fullscreen-actions.description':
    'Utilisez Tag pour ajouter des tags et notes propres au média lorsque l’élément est assez grand pour être inspecté. Ouvrir la note vous ramène au trade ou à la note de review source.',
  'tradelog.guide.gallery-open-annotation.title':
    'Ouvrir le panneau d’annotation',
  'tradelog.guide.gallery-open-annotation.description':
    'Cliquez sur Tag pour annoter ce média précis. Les tags et notes média décrivent la pièce jointe, pas tout le trade.',
  'tradelog.guide.gallery-annotation-panel.title':
    'Ajouter des tags et notes média',
  'tradelog.guide.gallery-annotation-panel.description':
    'Utilisez les tags média pour des idées propres au graphique, comme un balayage de liquidité ou une fausse cassure, et les notes pour le contexte de structure de marché à retenir.',
  'tradelog.guide.gallery-finish.title':
    'Vous connaissez maintenant les deux modes du journal de trades',
  'tradelog.guide.gallery-finish.description':
    'Utilisez Trades quand vous avez besoin du tableau et des actions par lots. Utilisez la Galerie pour revoir les images, GIF, vidéos, liens YouTube et annotations dans tout votre journal.',
  'tradelog.guide.image-gallery-empty.intro.title':
    'Aucun média pour le moment',
  'tradelog.guide.image-gallery-empty.intro.description':
    'Ajoutez des images, GIF, vidéos ou liens YouTube aux trades ou aux notes de review et ils apparaîtront ici automatiquement. Dès qu’il y aura des médias, Journalit affichera le guide complet de la galerie pour la revue plein écran, les tags et les notes.',

  'filter.modal.section.image-gallery': 'Galerie',
  'filter.modal.session-tags.placeholder': 'Tags de session',
  'filter.modal.session-tags.all': 'Tous les tags de session',
  'filter.modal.session-tags.n-selected': '{count} tags de session',
  'filter.modal.session-tags.select-all': 'Tout sélectionner',
  'filter.modal.session-tags.none-found': 'Aucun tag de session trouvé',
  'account.challenge.toggle.label': 'Challenge de prop firm',
  'account.challenge.toggle.help':
    'Suivez les phases de validation, les règles de la firme et les paiements pour ce compte.',
  'account.prop-challenge.title': 'Challenge de prop firm',
  'account.prop-challenge.identity': 'Identité du challenge',
  'account.prop-challenge.prefill.heading-link':
    'Préremplir depuis votre firme',
  'account.prop-challenge.prefill.phase-link': 'Préremplir les règles avec PRO',
  'account.prop-challenge.prefill.phase-link-firm':
    'Préremplir les règles de {firm} avec PRO',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} autres, règles préremplies avec PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, règles préremplies avec PRO',
  'account.prop-challenge.prefill.match':
    'Nous avons {firm} : {count} challenges avec règles prêtes',
  'account.prop-challenge.rules.empty':
    'Aucune règle ajoutée. Utilisez Ajouter une règle pour définir cette phase.',
  'account.prop-challenge.rules': 'Règles',
  'account.prop-challenge.costs.empty': 'Aucun coût ajouté.',
  'account.prop-challenge.description':
    'Suivez ce compte pendant un challenge en plusieurs phases.',
  'account.prop-challenge.enable': 'Activer le suivi du challenge',
  'account.prop-challenge.challenge-name': 'Nom du challenge',
  'account.prop-challenge.challenge-name-placeholder': 'p. ex. Évaluation 25K',
  'account.prop-challenge.firm-name': 'Nom de la société (facultatif)',
  'account.prop-challenge.firm-name-placeholder': 'p. ex. Apex Trader Funding',
  'account.prop-challenge.profile.title': 'Appliquer un profil de société',
  'account.prop-challenge.profile.firm': 'Société',
  'account.prop-challenge.profile.challenge': 'Épreuve',
  'account.prop-challenge.profile.apply': 'Appliquer',
  'account.prop-challenge.profile.loading':
    'Chargement des profils de sociétés…',
  'account.prop-challenge.profile.refreshing':
    'Recherche de mises à jour des profils…',
  'account.prop-challenge.profile.unavailable':
    'Les profils de sociétés sont indisponibles hors ligne.',

  'account.prop-challenge.profile.confirm-title':
    'Remplacer la configuration du challenge ?',
  'account.prop-challenge.profile.confirm-message':
    'L’application de ce profil remplace les phases et règles actuellement configurées.',
  'account.prop-challenge.current-phase': 'Phase actuelle',
  'account.prop-challenge.phase-rules': 'Règles pour {phase}',
  'account.prop-challenge.next-phase': 'Suivante : {phase}',
  'account.prop-challenge.view-phase': 'Voir la phase',
  'account.prop-challenge.unnamed-phase': 'Phase sans nom',
  'account.prop-challenge.phase-name': 'Nom de la phase',
  'account.prop-challenge.phase-type': 'Type de phase',
  'account.prop-challenge.phase-type.evaluation': 'Évaluation',
  'account.prop-challenge.phase-type.verification': 'Vérification',
  'account.prop-challenge.phase-type.sim_funded': 'Financé simulé',
  'account.prop-challenge.phase-type.live_funded': 'Financé réel',
  'account.prop-challenge.phase-type.custom': 'Personnalisé',
  'account.prop-challenge.starting-balance': 'Solde initial',
  'account.prop-challenge.broker-account-id': 'Comptes courtier',
  'account.prop-challenge.broker-accounts.assigned': 'Attribué à {phase}',
  'account.prop-challenge.broker-accounts.trades': '{count} transactions',
  'account.prop-challenge.broker-accounts.trade-one': '1 trade',
  'account.prop-challenge.phase-started': 'Démarrée',
  'account.prop-challenge.phase-completed': 'Terminée',
  'account.prop-challenge.timeline.completed-before-started':
    'La fin doit être postérieure ou égale au début pour {phase}.',
  'account.prop-challenge.timeline.out-of-order':
    '{phase} doit se terminer avant ou au début de {next}.',
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} commence après un changement de règles ultérieur. Reculez le début.',
  'account.prop-challenge.default-phase-name': 'Étape {number}',
  'account.prop-challenge.add-phase': 'Ajouter une phase',
  'account.prop-challenge.remove-phase': 'Supprimer la phase',
  'account.prop-challenge.add-rule': 'Ajouter une règle',
  'account.prop-challenge.rule.enabled': 'Règle activée',
  'account.prop-challenge.rule.amount': 'Montant',
  'account.prop-challenge.rule.target-type': 'Type d’objectif',
  'account.prop-challenge.rule.credit-withdrawals':
    'Compter les retraits dans l’objectif',
  'account.prop-challenge.rule.drawdown-mode': 'Mode de drawdown',
  'account.prop-challenge.rule.lock-at-balance': 'Solde de verrouillage',
  'account.prop-challenge.rule.daily-loss-model':
    'Montant de perte quotidienne',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'Montant fixe',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'Augmente au seuil de profit du compte',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    'Évolue avec le profit EOD maximal',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    'Utilise la limite fixe jusqu’à la clôture au solde d’activation. Dès le jour de trading suivant, la limite devient le pourcentage configuré du profit maximal en fin de journée et ne diminue jamais.',
  'account.prop-challenge.rule.scale-at-balance': 'Solde d’activation',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    'Profit EOD maximal utilisé comme limite (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    '{value} du profit EOD maximal',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    'Paliers de profit selon le solde EOD précédent',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    'Paliers selon l’EOD précédent',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    'Utilisez des paires profit:limite de perte. Le palier du profit EOD précédent s’applique à la session suivante.',
  'account.prop-challenge.rule.loss-tiers':
    'Paliers de profit et limites de perte',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'Le montant de perte quotidienne supérieur est activé définitivement lorsque le profit cumulé du compte atteint pour la première fois le pourcentage configuré du solde initial.',
  'account.prop-challenge.rule.profit-threshold-percent':
    'Seuil de profit du compte (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'Montant de perte quotidienne après le seuil',
  'account.prop-challenge.rule.breach-action':
    'Comportement en cas de dépassement',
  'account.prop-challenge.rule.breach-action.hard': 'Échec du compte',
  'account.prop-challenge.rule.breach-action.soft':
    "Suspendre jusqu'à la prochaine session",
  'account.prop-challenge.rule.days': 'Jours de trading',
  'account.prop-challenge.rule.minimum-daily-profit': 'Profit minimum par jour',
  'account.prop-challenge.rule.minimum-daily-profit-summary':
    '{value}+ par jour',
  'account.prop-challenge.rule.best-day-percent': 'Meilleur jour maximal (%)',
  'account.prop-challenge.rule.position-limit-model':
    'Modèle de limite de position',
  'account.prop-challenge.rule.position-limit-model.fixed': 'Limite fixe',
  'account.prop-challenge.rule.position-limit-model.eod-profit-tiers':
    'Paliers de profit de fin de journée',
  'account.prop-challenge.rule.position-profit-basis':
    'Base de profit pour la taille de position',
  'account.prop-challenge.rule.position-profit-basis.cumulative':
    'Profit cumulé des trades (les paiements ne réduisent pas)',
  'account.prop-challenge.rule.position-profit-basis.current-account':
    'Profit actuel du compte (les paiements réduisent)',
  'account.prop-challenge.rule.position-limit-model.eod-profit':
    'Évolue avec le profit de fin de journée',
  'account.prop-challenge.rule.position-tiers': 'Paliers de profit',
  'account.prop-challenge.rule.position-tiers-help':
    'Saisissez chaque seuil de profit de fin de journée atteint et sa nouvelle limite de contrats au format profit:contrats, séparés par des virgules. Un palier s’applique à partir du jour de trading suivant.',
  'account.prop-challenge.rule.position-scaling-help':
    'Chaque palier de profit atteint ajoute un contrat à partir du jour de trading suivant, jusqu’au maximum.',
  'account.prop-challenge.rule.initial-contracts': 'Contrats initiaux',
  'account.prop-challenge.rule.profit-per-contract':
    'Profit de fin de journée par contrat supplémentaire',
  'account.prop-challenge.rule.maximum-contracts':
    'Nombre maximal de contrats après ajustement',
  'account.prop-challenge.rule.max-contracts': 'Contrats maximum',
  'account.prop-challenge.rule.profit_target': 'Objectif de profit',
  'account.prop-challenge.rule.drawdown': 'Perte maximale',
  'account.prop-challenge.rule.daily_loss_limit': 'Limite de perte quotidienne',
  'account.prop-challenge.rule.live_review_daily_profit':
    'Profit journalier pour examen live',
  'account.prop-challenge.rule.best-profitable-day':
    'Seuil de profit journalier',
  'account.prop-challenge.rule.daily_profit_cap':
    'Plafond quotidien de profit crédité',
  'account.prop-challenge.rule.per-trading-day': 'Par jour de trading',
  'account.prop-challenge.rule.minimum_trading_days':
    'Jours de trading minimum',
  'account.prop-challenge.rule.minimum_profitable_days':
    'Jours rentables minimum',
  'account.prop-challenge.rule.consistency-cushion-percent':
    'Marge de régularité (points de pourcentage)',
  'account.prop-challenge.rule.consistency-cushion-short': 'marge',
  'account.prop-challenge.rule.consistency': 'Régularité',
  'account.prop-challenge.rule.max_position_size':
    'Taille de position maximale',
  'account.prop-challenge.drawdown.static': 'Statique',
  'account.prop-challenge.drawdown.eod-trailing': 'Suiveur fin de journée',
  'account.prop-challenge.drawdown.intraday-trailing':
    'Suiveur intrajournalier',
  'account.prop-challenge.summary.status.active': 'Actif',
  'account.prop-challenge.summary.status.passed': 'Réussi',
  'account.prop-challenge.summary.status.failed': 'Échoué',
  'account.prop-challenge.summary.status.pending': 'En attente',
  'account.prop-challenge.summary.status.warning': 'Proche de la limite',
  'account.prop-challenge.summary.phase-status.pending': 'En attente',
  'account.prop-challenge.summary.phase-status.active': 'Actif',
  'account.prop-challenge.summary.phase-status.passed': 'Réussi',
  'account.prop-challenge.summary.phase-status.failed': 'Échoué',
  'account.prop-challenge.summary.rule.profit_target': 'Objectif de profit',
  'account.prop-challenge.summary.rule.drawdown': 'Perte maximale',
  'account.prop-challenge.summary.rule.drawdown-static': 'Drawdown statique',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': 'Drawdown EOD',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing':
    'Drawdown intraday',
  'account.prop-challenge.summary.rule.daily_loss_limit': 'Perte journalière',
  'account.prop-challenge.summary.rule.live_review_daily_profit': 'Examen live',
  'account.prop-challenge.summary.rule.daily_profit_cap':
    'Profit quotidien crédité',
  'account.prop-challenge.summary.rule.minimum_trading_days':
    'Jours de trading',
  'account.prop-challenge.summary.rule.minimum_profitable_days':
    'Jours rentables',
  'account.prop-challenge.summary.rule.consistency':
    'Régularité du meilleur jour',
  'account.prop-challenge.summary.rule.max_position_size': 'Taille de position',
  'account.prop-challenge.ledger.value.of': '{current} sur {target}',
  'account.prop-challenge.ledger.section.payout': 'Conditions de retrait',
  'account.prop-challenge.ledger.requirement.minimum': 'au moins {value}',
  'account.prop-challenge.ledger.requirement.maximum': 'au plus {value}',
  'account.prop-challenge.ledger.value.ratio': '{current} / {target}',
  'account.prop-challenge.payout.met-of-total': '{met} sur {total} conditions',
  'account.prop-challenge.ledger.value.of-today':
    '{current} sur {target} aujourd’hui',
  'account.prop-challenge.ledger.value.credited-profit':
    '{credited} crédités sur {actual} de profit réel',
  'account.prop-challenge.ledger.value.used': '{used} utilisé',
  'account.prop-challenge.ledger.value.consistency-goal':
    '{current} sur {target} de l’objectif de régularité',
  'account.prop-challenge.ledger.value.best-day-share':
    'Meilleure journée {value} du profit',
  'account.prop-challenge.ledger.value.no-profit': 'Pas encore de profit',
  'account.prop-challenge.ledger.requirement.best-day':
    'Meilleure journée ≤ {value} du profit total',
  'account.prop-challenge.ledger.state.needs-profit': 'Profit requis',
  'account.prop-challenge.ledger.tooltip.open': 'Expliquer {rule}',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    'Limite la part du profit total de la phase pouvant provenir de la seule journée la plus rentable.',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    'Profit de la meilleure journée ÷ profit total de la phase × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    'Meilleure journée : {value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    'Profit total : {value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 = {share}',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    'Objectif de régularité : {best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    'La part diminue à mesure que vous ajoutez du profit les autres jours, mais une nouvelle meilleure journée relève l’objectif.',
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum} — conforme',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    'Le calcul démarre dès que le profit total de la phase devient positif.',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    'Un objectif de régularité exige un maximum supérieur à 0 %.',
  'account.prop-challenge.ledger.help.open': 'À propos de {rule}',
  'account.prop-challenge.ledger.help.profit_target':
    'Faire croître le compte de ce montant pour réussir la phase. Seuls les trades clôturés comptent.',
  'account.prop-challenge.ledger.help.profit_target.example':
    "Ce compte a besoin de {target} de profit : {current} pour l'instant, {remaining} restants.",
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'Objectif atteint : {current} sur {target}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    'Le maximum dont le solde peut descendre sous le solde de départ. Le plancher ne bouge jamais.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'Le plancher de ce compte est {floor} ; le solde doit rester au-dessus. Il reste {buffer} de la limite de {limit}.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    "Le plancher suit le plus haut solde de clôture journalière et ne fait que monter, jusqu'à se verrouiller au niveau de blocage de la société.",
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'Le plancher est actuellement {floor} (plus haute clôture moins {limit}) et il monte à chaque clôture plus haute. {buffer} restants.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    "Le plancher suit votre solde le plus élevé à tout moment, profit ouvert inclus. Journalit ne voit que les trades clôturés : ce plancher suit le meilleur solde après chaque clôture ; un pic atteint pendant un trade ouvert n'est pas compté. Vérifiez le chiffre de la firme.",
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    'Le plancher est actuellement {floor} (meilleur solde après trades clôturés moins {limit}). {buffer} restants ; le chiffre en direct de la société peut être plus serré.',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    "Le maximum que vous pouvez perdre en une journée de trading. L'atteindre fait échouer la phase ou suspend le trading jusqu'à la séance suivante, selon la société.",
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    "Aujourd'hui : {used} perdus sur la limite quotidienne de {limit}, {left} restants.",
  'account.prop-challenge.ledger.help.daily_profit_cap':
    "Seule une partie du profit de chaque jour est créditée vers l'objectif. Le profit au-dessus du plafond est conservé mais non compté.",
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    "Seuls {cap} du profit d'une journée sont crédités ; {excluded} au-dessus du plafond ne comptent pas pour l'instant.",
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'Une journée de trading à ce profit ou plus rend le compte éligible à une revue vers un compte réel.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    "Une journée à {trigger} ou plus qualifie ; meilleure journée jusqu'ici {bestDay}.",
  'account.prop-challenge.ledger.help.minimum_trading_days':
    "Jours avec au moins un trade clôturé. La phase ne peut pas être réussie avant d'en avoir autant, même si l'objectif est atteint plus tôt.",
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{current} sur {target} jours de trading effectués, {remaining} restants.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    "Jours de trading qui clôturent au profit quotidien minimum de la société ou au-dessus. L'équilibre ou de plus petits gains ne comptent pas.",
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{current} sur {target} jours clôturés à {minimum} ou plus, {remaining} restants.',
  'account.prop-challenge.ledger.help.consistency':
    'Votre meilleure journée ne peut pas dépasser cette part du profit total de la phase. Corrigez en gagnant plus les autres jours, pas en perdant.',
  'account.prop-challenge.ledger.help.consistency.example':
    'La meilleure journée {bestDay} représente {share} de {total} de profit total ; le profit total doit atteindre {goal} pour se situer à {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'La meilleure journée {bestDay} représente {share} du profit total, dans la limite de {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'Pas encore de profit, donc aucune meilleure journée à comparer.',
  'account.prop-challenge.ledger.help.max_position_size':
    'Le maximum de contrats détenus à la fois, toutes positions ouvertes confondues. Certaines sociétés relèvent la limite à mesure que le profit croît.',
  'account.prop-challenge.ledger.help.max_position_size.example':
    "Jusqu'à {maximum} contrats à la fois pour le moment ; plus grande position jusqu'ici {current}.",
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'Jours de trading du cycle de paiement en cours. Le compteur redémarre après un paiement approuvé.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '{current} sur {target} jours de trading de ce cycle, {remaining} restants.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'Jours de trading de ce cycle qui clôturent au profit quotidien minimum de la société ou au-dessus.',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '{current} sur {target} jours à {minimum} ou plus de ce cycle, {remaining} restants.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'Le profit depuis le début du cycle doit atteindre ce montant avant de pouvoir demander.',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '{current} gagnés ce cycle sur les {target} requis.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'Le solde doit être à ce niveau ou au-dessus au moment de la demande.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    "Solde {current} ; il doit être d'au moins {target}.",
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    'Après le premier paiement, chaque nouveau cycle doit être en profit avant une autre demande.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'Le profit du cycle est {current} ; il doit être supérieur à zéro.',
  'account.prop-challenge.ledger.help.payout.consistency':
    'Votre meilleure journée ne peut pas dépasser cette part du profit du cycle.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    "Le meilleur jour {bestDay} représente {share} des {total} de profit du cycle ; le profit du cycle doit atteindre {goal} pour qu'il soit à {maximum}.",
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'Le meilleur jour {bestDay} représente {share} du profit du cycle, dans la limite de {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'Pas encore de profit sur le cycle, donc aucun meilleur jour à comparer.',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    "Le plus petit paiement accepté par la société. Le montant disponible doit d'abord l'atteindre.",
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '{current} disponibles ; la demande minimale de la société est {target}.',
  'account.prop-challenge.ledger.help.payout.payout_count':
    "Combien de paiements cette étape autorise. Utiliser le contingent termine l'étape.",
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '{current} sur {target} paiements utilisés à cette étape.',
  'account.prop-challenge.ledger.help.payout.request_window':
    'Les demandes ne sont acceptées que ces jours ouvrables, dans le fuseau de la société.',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    "Aujourd'hui, nous sommes {today} ; les demandes s'ouvrent les {days} ({timeZone}).",
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'Le temps écoulé depuis le premier trade du cycle doit atteindre ceci avant de pouvoir demander.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '{current} sur {target} heures depuis le premier trade du cycle.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'Jours qualificatifs sur toute la phase financée, pas seulement ce cycle. Les paiements se débloquent une fois atteints.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '{current} sur {target} jours qualificatifs sur toute la phase.',
  'account.prop-challenge.ledger.requirement.target': 'objectif de {value}',
  'account.prop-challenge.ledger.requirement.buffer': 'marge de {value}',
  'account.prop-challenge.ledger.requirement.max': '{value} maximum',
  'account.prop-challenge.ledger.requirement.daily-cap':
    '{value} crédités par jour de trading',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{days} jours à {profit}+',
  'account.prop-challenge.ledger.requirement.days': '{value} jours',
  'account.prop-challenge.ledger.requirement.at-most': '≤ {value}',
  'account.prop-challenge.ledger.state.not-started': 'Non commencé',
  'account.prop-challenge.ledger.state.in-progress': 'En cours',
  'account.prop-challenge.ledger.state.reached': 'Atteint',
  'account.prop-challenge.ledger.state.met': 'Rempli',
  'account.prop-challenge.ledger.state.eligible': 'Éligible',
  'account.prop-challenge.ledger.state.safe': 'Sûr',
  'account.prop-challenge.ledger.state.clear': 'Intact',
  'account.prop-challenge.ledger.state.within-rule': 'Conforme',
  'account.prop-challenge.ledger.state.near-limit': 'Proche de la limite',
  'account.prop-challenge.ledger.state.limit-reached': 'Limite atteinte',
  'account.prop-challenge.ledger.state.cap-applied': 'Plafond appliqué',
  'account.prop-challenge.ledger.state.within-cap': 'Sous le plafond',
  'account.prop-challenge.ledger.state.breached': 'Enfreinte',
  'account-dashboard.prop.metrics.total': 'Défis',
  'account-dashboard.prop.metrics.pass-rate': 'Taux de réussite',
  'account-dashboard.prop.metrics.costs': 'Coûts des défis',
  'account-dashboard.prop.metrics.payouts': 'Retraits',
  'account-dashboard.prop.metrics.net': 'Solde net',
  'account-dashboard.prop.tabs.overview': 'Aperçu',
  'account-dashboard.mode.selector': 'Mode du tableau de comptes',
  'account-dashboard.mode.account-overview': 'Aperçu',
  'account-dashboard.mode.challenges': 'Défis',
  'account-dashboard.prop.metrics.active': 'Défis actifs',
  'account-dashboard.prop.economics.title': 'Économie',
  'account-dashboard.prop.economics.roi': 'Rendement',
  'account-dashboard.prop.economics.roi-no-cost': 'Sans coût',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    'Coût moyen par tentative',
  'account-dashboard.prop.economics.cost-per-funded-account':
    'Coût par compte financé',
  'account-dashboard.prop.economics.payout-conversion': 'Conversion en retrait',
  'account-dashboard.prop.insights.title': 'Analyse des challenges',
  'account-dashboard.prop.phases.title': 'Analyse des phases',
  'account-dashboard.prop.phases.phase': 'Étape',
  'account-dashboard.prop.phases.average-duration': 'Durée moyenne',
  'account-dashboard.prop.phases.show-more': 'Afficher {count} de plus',
  'account-dashboard.prop.phases.show-fewer': 'Afficher moins',
  'account-dashboard.prop.tooltip.open-explanation':
    'Expliquer le calcul de {metric}',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    'Pas encore assez de données terminées',
  'account-dashboard.prop.tooltip.pass-rate.description':
    'Part des défis terminés qui ont été réussis. Les défis actifs et archivés sans résultat sont exclus.',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    'Défis réussis ÷ défis terminés × 100',
  'account-dashboard.prop.tooltip.roi.description':
    'Rendement net des retraits (retraits moins coûts des défis) par rapport aux coûts. Le rendement est calculé uniquement si tous les défis utilisent la même devise.',
  'account-dashboard.prop.tooltip.roi.formula':
    '(Retraits − coûts des défis) ÷ coûts des défis × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    "Ces challenges n'ont rien coûté, il n'y a donc aucune base de coût à diviser. Le rendement net correspond aux {payouts} de versements.",
  'account-dashboard.prop.tooltip.average-cost.description':
    'Coût moyen de chaque tentative de défi, calculé séparément pour chaque devise.',
  'account-dashboard.prop.tooltip.average-cost.formula':
    'Coûts des défis ÷ nombre total de tentatives',
  'account-dashboard.prop.tooltip.funded-cost.description':
    'Coût moyen nécessaire pour chaque défi réussi, calculé séparément pour chaque devise.',
  'account-dashboard.prop.tooltip.funded-cost.formula':
    'Coûts des défis ÷ défis réussis',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    'Part des défis réussis ayant généré au moins un retrait.',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    'Défis réussis avec retrait ÷ défis réussis × 100',
  'account-dashboard.prop.tabs.phases': 'Phases',
  'account-dashboard.prop.tabs.firms': 'Sociétés',
  'account-dashboard.prop.firms.firm': 'Société',
  'account-dashboard.prop.firms.attempts': 'Tentatives',
  'account-dashboard.prop.phases.most-failed': 'Plus échouée',
  'account-dashboard.prop.phases.days': '{count} jours',
  'account-dashboard.prop.phases.empty': 'Aucune phase terminée pour le moment',

  'setups.create.field.tags': 'Tags',
  'setups.create.placeholder.tags': 'Momentum, Cassure, Matin',
  'setups.view.overview.tag-filter.aria': 'Filtrer les setups',
  'setups.view.overview.tag-filter.reset': 'Réinitialiser',
  'setups.view.overview.tag-filter.untagged': 'Sans tags',
  'setups.view.overview.tag-filter.empty':
    'Aucun setup ne correspond à ces filtres',
  'setups.view.overview.tag-filter.empty-submessage':
    'Modifiez ou effacez les filtres pour afficher plus de setups.',

  'setups.view.tags': 'Tags',
  'setups.create.error.tag-save-failed':
    'Le tag n’a pas pu être enregistré dans la liste globale des tags.',
  'settings.customization.options.confirm.remove-tag-message':
    'Supprimer le tag global « {option} » ? Il sera retiré de toutes les notes de trades et de setups Journalit.',
  'settings.customization.options.confirm.reset-tag-message':
    'Réinitialiser la liste globale des tags et leurs couleurs ? Les tags déjà attribués aux notes de trades et de setups resteront dans ces notes.',
  'home.mode.overview': 'Vue d’ensemble',
  'home.mode.dashboard': 'Tableau de bord',
  'home.mode.aria': 'Changer le mode Accueil',
  'home.filters.period': 'Période',
  'home.filters.trade-type': 'Type de trade',
  'home.filters.accounts': 'Comptes',
  'home.filters.back': 'Retour',
  'filter.reset': 'Réinitialiser les filtres',
  'home.guide.modes.title': 'Une dernière chose : le Tableau de bord',
  'home.guide.modes.description':
    'La Vue d’ensemble et le Tableau de bord partagent cette page. Passez maintenant au Tableau de bord pour continuer avec une courte visite de vos statistiques de performance.',
  'home.guide.whats-new.mode.title': 'Un seul Accueil, deux modes',
  'home.guide.whats-new.mode.description':
    'La Vue d’ensemble et le Tableau de bord partagent désormais la même page. Changez de mode sans perdre la disposition ni la position de défilement.',
  'home.guide.whats-new.filters.title': 'Les filtres Accueil sont regroupés',
  'home.guide.whats-new.filters.description':
    'Ouvrez le bouton de filtre pour choisir la Période, le Type de trade ou les Comptes dans un menu compact à plusieurs niveaux.',
  'home.guide.whats-new.done.title':
    'Votre espace de travail reste en contexte',
  'home.guide.whats-new.done.description':
    'Utilisez la Vue d’ensemble pour vos widgets personnels et le Tableau de bord pour une analyse approfondie. Chaque mode conserve ses filtres et sa disposition.',
  'account.prop-challenge.summary.status.payout_ready': 'Retrait disponible',
  'account.prop-challenge.ribbon.passed': '{phase} réussie',
  'account.prop-challenge.ribbon.failed': '{phase} échouée',
  'account.prop-challenge.ribbon.action.advance': 'Passer à {phase}',
  'account.prop-challenge.ribbon.action.advance-short': 'Passer',
  'account.prop-challenge.ribbon.action.mark-passed': 'Marquer comme réussi',
  'account.prop-challenge.ribbon.action.archive': 'Archiver',
  'account.prop-challenge.ribbon.action.record-payout':
    'Enregistrer le paiement',
  'account.prop-challenge.ribbon.action.record-payout-short': 'Paiement',
  'account.prop-challenge.payout.title': 'Éligibilité au retrait',
  'account.prop-challenge.payout.eligible': 'Retrait disponible',
  'account.prop-challenge.payout.available': 'Disponible maintenant',
  'account.prop-challenge.payout.cycle-profit': 'Profit du cycle',
  'account.prop-challenge.payout.history': 'Retraits',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'Jours admissibles cumulés',
  'account.prop-challenge.payout.requirement.days': 'Jours de trading',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'Jours admissibles',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'Solde minimum du compte',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'Profit de cycle positif',
  'account.prop-challenge.payout.requirement.cycle-profit': 'Profit du cycle',
  'account.prop-challenge.payout.requirement.consistency': 'Régularité',
  'account.prop-challenge.payout.requirement.minimum': 'Minimum disponible',
  'account.prop-challenge.payout.requirement.payouts': 'Limite de retraits',
  'account.prop-challenge.payout.requirement.request-window':
    'Fenêtre de demande',
  'account.prop-challenge.payout.timezone-invalid': 'Fuseau horaire inconnu.',
  'account.prop-challenge.payout.preview-amount': 'Aperçu du retrait',
  'account.prop-challenge.payout.you-receive': 'Part du trader',
  'account.prop-challenge.payout.balance-after': 'Solde après',
  'account.prop-challenge.payout.drawdown-floor': 'Plancher de drawdown',
  'account.prop-challenge.payout.buffer-after': 'Marge avant violation',
  'account.prop-challenge.payout.request-not-allowed':
    'Non admissible pour ce montant',
  'account.prop-challenge.payout.immediate-breach':
    'Ce retrait placerait le compte au niveau ou sous son plancher de drawdown.',
  'account.prop-challenge.payout.account-concludes':
    'Ce retrait termine le cycle de retrait simulé financé configuré.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'Ce retrait fait passer le compte à l’étape configurée suivante.',
  'account.prop-challenge.payout.live-review-after-payout':
    'Ce retrait rend le compte admissible à un examen pour passage en réel.',
  'account.prop-challenge.payout.cycle-resets':
    'La progression du retrait est réinitialisée après un retrait approuvé.',
  'account.prop-challenge.payout.cycle-continues':
    'La progression du retrait continue après un retrait approuvé.',
  'account.prop-challenge.payout.drawdown.unchanged':
    'Le plancher de drawdown actuel reste inchangé.',
  'account.prop-challenge.payout.drawdown.lock_at_balance':
    'Le plancher de drawdown est verrouillé après le retrait.',
  'account.prop-challenge.payout.drawdown.reset_from_starting_balance':
    'Le compte et les limites de drawdown sont réinitialisés après le retrait.',
  'account-page.guide.whats-new.cockpit.payout.title':
    'Savoir quand un retrait financé est sûr',
  'account-page.guide.whats-new.cockpit.payout.description':
    'Les comptes financés avec des règles vérifiées affichent désormais les exigences, le montant disponible et un aperçu des conséquences sur le solde et le drawdown.',
  'account-page.guide.main.payout.title': 'Planifier les retraits financés',
  'account-page.guide.main.payout.description':
    'Lorsque la phase financée possède des règles de retrait vérifiées, ce panneau suit l’éligibilité et prévisualise l’impact du montant demandé sur le compte.',
  'account.prop-challenge.stage': 'Type d’étape',
  'account.prop-challenge.stage.evaluation': 'Évaluation',
  'account.prop-challenge.stage.sim-funded': 'Financée simulée',
  'account.prop-challenge.stage.live-funded': 'Financée réelle',
  'account.prop-challenge.payout-rules.title': 'Règles de retrait',
  'account.prop-challenge.payout-rules.add': 'Ajouter des règles de retrait',
  'account.prop-challenge.payout-rules.remove':
    'Supprimer les règles de retrait',
  'account.prop-challenge.payout-rules.cycle': 'Cycle d’éligibilité',
  'account.prop-challenge.payout-rules.request-window': 'Période de demande',
  'account.prop-challenge.payout-rules.request-window.anytime':
    'Tous les jours',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'Jours de semaine spécifiques',
  'account.prop-challenge.payout-rules.request-window.time-zone':
    'Fuseau horaire',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'Jours de demande autorisés',
  'account.prop-challenge.payout-rules.cycle.none': 'Aucun cycle d’attente',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'Jours de trading',
  'account.prop-challenge.payout-rules.cycle.qualifying-days':
    'Jours admissibles',
  'account.prop-challenge.payout-rules.cycle.calendar-days':
    'Jours calendaires',
  'account.prop-challenge.payout-rules.days': 'Jours requis',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'Profit quotidien minimum',
  'account.prop-challenge.payout-rules.anchor': 'Début du cycle',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'Début de l’étape',
  'account.prop-challenge.payout-rules.anchor.first-trade':
    'Première opération',
  'account.prop-challenge.payout-rules.minimum-balance':
    'Solde minimum du compte',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Profit minimum du cycle',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'Profit minimum du cycle par numéro de paiement',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'Exiger un profit de cycle positif après le premier retrait',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Part maximale du meilleur jour (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'Part maximale du meilleur jour par numéro de paiement (%)',
  'account.prop-challenge.payout-rules.availability': 'Profit disponible',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Au-dessus du solde initial',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Au-dessus du plancher de solde',
  'account.prop-challenge.payout-rules.balance-floor': 'Plancher de solde',
  'account.prop-challenge.payout-rules.request-percent': 'Part retirable (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'Nouveau profit requis pour chaque demande (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'Plafonne la demande afin que le pourcentage configuré soit couvert par le profit réalisé pendant le cycle de retrait en cours. Par exemple, 50 % autorise une demande allant jusqu’au double du profit du cycle en cours.',
  'account.prop-challenge.payout-rules.minimum-request': 'Demande minimale',
  'account.prop-challenge.payout-rules.maximum': 'Demande maximale',
  'account.prop-challenge.payout-rules.maximum.none': 'Aucun maximum',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Maximum fixe',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'Plafond du premier retrait uniquement',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Maximum selon le numéro du retrait',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'Pourcentage du profit du cycle',
  'account.prop-challenge.payout-rules.maximum-amount': 'Montant maximal',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'Plafond du premier retrait',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'Profit maximal du cycle (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'Continuer d’utiliser le montant final pour les retraits suivants',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'Continuer à utiliser la dernière valeur pour les paiements suivants',
  'account.prop-challenge.payout-rules.schedule':
    'Montants selon le numéro du retrait',
  'account.prop-challenge.payout-rules.profit-split':
    'Part de profit du trader (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'Modifier les limites après les jours admissibles cumulés',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    'Compte les jours admissibles sur toute la phase financée, même lorsque les cycles de paiement sont réinitialisés.',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'Jours admissibles cumulés requis',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'Disponibilité après déblocage',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'Solde plancher après déblocage',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'Profit disponible après déblocage (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'Demande maximale après déblocage',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'Montant maximal après déblocage',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'Barème maximal après déblocage',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'Pourcentage maximal du profit du cycle après déblocage',
  'account.prop-challenge.payout-rules.profit-split-model':
    'Modèle de partage des profits',
  'account.prop-challenge.payout-rules.profit-split.fixed': 'Pourcentage fixe',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    'Change après les paiements cumulés',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'Part initiale du trader (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'Seuil de paiements cumulés',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'Part après le seuil (%)',
  'account.prop-challenge.payout-rules.maximum-payouts':
    'Nombre maximal de retraits',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'Après le dernier retrait',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'Continuer le compte',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'Clôturer le compte',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'Passer à l’étape suivante',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'Admissible à l’examen pour passage en réel',
  'account.prop-challenge.payout-rules.aftermath': 'Après un retrait approuvé',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'Déduire le retrait ; conserver le plancher de drawdown',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'Déduire le retrait ; verrouiller le plancher de drawdown',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'Réinitialiser le compte et le drawdown',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'Plancher de drawdown après retrait',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'Le premier retrait ignore le profit minimum du cycle',
  'account.prop-challenge.payout-rules.reset-cycle':
    'Réinitialiser le cycle d’éligibilité après retrait',
  'account.prop-challenge.payout-rules.group.eligibility': 'Éligibilité',
  'account.prop-challenge.payout-rules.group.availability':
    'Retrait disponible',
  'account.prop-challenge.payout-rules.group.terms': 'Conditions de retrait',
  'account.prop-challenge.payout-rules.group.aftermath': 'Après le retrait',
  'account.prop-challenge.payout.requirement.elapsed-hours': 'Temps écoulé',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'Varie selon le profit du compte',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'Le profit cumulé du compte correspond au solde actuel moins le solde initial, plus les retraits précédents. Le pourcentage sous le seuil ou à partir du seuil s’applique à la totalité de la demande.',
  'account.prop-challenge.payout-rules.profit-split.below':
    'Part du trader sous le seuil (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'Seuil de profit du compte',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'Part du trader à partir du seuil (%)',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Nombre minimal d’heures écoulées',

  
  'account.merge.challenge.move-earlier': 'Avancer {account}',
  'account.merge.challenge.move-later': 'Reculer {account}',
  'account.merge.warning.use-profile-balance': 'Utiliser le solde du profil',
  'account.merge.warning.edit-phases': 'Modifier les phases',
  'account.merge.title': 'Configurer le challenge',
  'account.merge.loading': 'Chargement...',
  'account.merge.step.accounts': 'Comptes',
  'account.merge.step.phases': 'Phases',
  'account.merge.step.review': 'Vérifier',
  'account.merge.accounts.title': 'Comptes à fusionner',
  'account.merge.accounts.show-archived': 'Afficher les archivés',
  'account.merge.accounts.empty': 'Aucun compte éligible',
  'account.merge.target.title': 'Compte cible',
  'account.merge.target.keep': 'Conserver',
  'account.merge.target.new': 'Nouveau nom',
  'account.merge.phase.name': 'Nom de phase',
  'account.merge.phase.status': 'Statut',
  'account.merge.phase.started': 'Début',
  'account.merge.phase.completed': 'Fin',
  'account.merge.phase.no-rules': 'Aucune',
  'account.merge.review.notes': 'trades déplacés',
  'account.merge.review.identities': 'comptes broker',
  'account.merge.warning.trade-outside-window':
    'Trades hors de leur fenêtre de phase',
  'account.merge.warning.identity-shared':
    'Identité revendiquée par plusieurs comptes',
  'account.merge.warning.copy-trading-dropped':
    'Périodes de copy trading abandonnées',
  'account.merge.error.too-few-sources': 'Sélectionne au moins deux comptes.',
  'account.merge.error.duplicate-source': 'Un compte figure deux fois.',
  'account.merge.error.target-exists': 'Ce nom appartient à un autre compte.',
  'account.merge.error.currency-mismatch':
    'Les comptes utilisent des devises différentes.',
  'account.merge.error.timeline-not-monotonic':
    'Les débuts de phase doivent être croissants.',
  'account.merge.error.invalid-override': 'Vérifie les dates de cette phase.',
  'account.merge.error.source-missing':
    'Un compte n’a aucun réglage enregistré.',
  'account.merge.error.unknown': 'Échec de la fusion.',
  'account.merge.action.merge': 'Fusionner',
  'account.merge.action.undo': 'Annuler la fusion',
  'account.merge.action.delete': 'Supprimer les anciens comptes',
  'account.merge.notice.converted': 'Converti en challenge',
  'account.merge.notice.title': 'Fusionné depuis {accounts}',
  'account.merge.notice.error': 'Échec de l’action.',
  'account.merge.undo.title': 'Annuler la fusion',
  'account.merge.undo.message': 'Restaure les anciens comptes et leurs trades.',
  'account.merge.delete.title': 'Supprimer les anciens comptes',
  'account.merge.delete.message':
    'Supprime les anciens comptes archivés. Action irréversible.',
  'command.open-legacy-challenge-onboarding': 'Configurer les prop challenges',
  'account.merge.step.challenge': 'Challenge',
  'account.merge.action.convert': 'Convertir',
  'account.merge.profile.applied': 'Appliqué : {firm} · {challenge}',
  'account.merge.profile.remove': 'Retirer',
  'account.merge.phase.apply-profile': 'Appliquer un profil de firme',
  'account.merge.profile.replace-rules.title':
    'Remplacer les règles saisies à la main ?',
  'account.merge.profile.replace-rules.body':
    'Le profil de {firm} définit les règles de chaque phase. Les règles saisies sur cette page seront remplacées.',
  'account.merge.profile.replace-rules.confirm': 'Remplacer les règles',
  'guide.legacy-setup.list.title': 'Chaque compte sans défi est listé ici',
  'guide.legacy-setup.list.description':
    'Décidez compte par compte. « Laisser tel quel » le conserve exactement ; vous pourrez toujours le configurer plus tard depuis les réglages du tableau de bord.',
  'guide.legacy-setup.assign.title': 'Regroupez les phases d’un même défi',
  'guide.legacy-setup.assign.description':
    'Les comptes qui étaient des phases du même défi vont dans un groupe (nous suggérons des groupes d’après les noms). Un compte seul devient un défi à une phase.',
  'guide.legacy-setup.continue.title': 'Une courte configuration par défi',
  'guide.legacy-setup.continue.description':
    'Continuer ouvre la configuration de chaque groupe tour à tour. Rien ne change tant que vous n’avez pas confirmé chacun.',
  'guide.merge-wizard.target.title': 'Un compte garde l’historique',
  'guide.merge-wizard.target.description':
    'Le compte cible subsiste avec toutes les phases. Les autres sont archivés, pas supprimés, et leurs trades passent sur le compte cible.',
  'guide.merge-wizard.identity.title': 'Nommez la firme et le défi',
  'guide.merge-wizard.identity.description':
    'Appliquer un profil de firme renseigne les vraies règles et la phase financée. Sans profil, les phases n’ont aucune règle tant que vous n’en ajoutez pas sur la page du compte.',
  'guide.merge-wizard.phases.title': 'Vérifiez chaque phase',
  'guide.merge-wizard.phases.description':
    'Choisissez le type d’étape, marquez les phases terminées comme Réussies et la phase en cours comme Active, puis confirmez les dates.',
  'guide.merge-wizard.review.title':
    'Rien ne se passe avant votre confirmation',
  'guide.merge-wizard.review.description':
    'Vérifiez les trades déplacés, les comptes archivés et les avertissements. Fusionner applique tout ; vous pouvez annuler depuis la page du compte.',
  'account.merge.challenge.accounts': 'Comptes',
  'account.merge.challenge.order-hint': 'Phase la plus ancienne en premier',
  'account.merge.challenge.single-hint':
    'Ce compte devient un challenge à lui seul',
  'account.merge.phase.identities-count': '{count} identités',
  'account.merge.phase.pending': 'En attente',
  'account.merge.review.phases': 'phases',
  'account.merge.review.archived': 'archivés',
  'account.merge.review.open': 'en cours',
  'account.merge.sequence': 'Challenge {index} sur {total}',
  'account.merge.warning.balance-differs':
    'Le solde initial diffère du profil de la firme',
  'account.merge.error.profile-phase-mismatch':
    'Plus de comptes que de phases dans le profil de la firme',
  'account.merge.error.profile-currency-mismatch':
    'La devise du profil diffère de celle de ces comptes.',
  'account.merge.error.source-changed': 'Un compte a changé. Revois la fusion.',
  'account.merge.error.multiple-active-phases':
    'Seul le dernier compte peut encore être actif.',
  'account.merge.error.phases-after-failed-source':
    'Un compte échoué met fin au challenge : il doit donc être sélectionné en dernier.',
  'account.merge.error.copy-trading-overlap':
    'Les périodes de copy trading se chevauchent. Clôture-en une d’abord.',
  'onboarding.legacy-challenge.legend':
    'Regroupez les comptes qui étaient les phases d’un même challenge. Un compte seul devient un challenge à part entière.',
  'onboarding.legacy-challenge.assign.leave': 'Laisser tel quel',
  'onboarding.legacy-challenge.assign.own': 'Challenge à part',
  'onboarding.legacy-challenge.assign.group': 'Challenge {letter}',
  'onboarding.legacy-challenge.assign.new-group': 'Nouveau challenge…',
  'onboarding.legacy-challenge.action.continue': 'Continuer',
  'onboarding.legacy-challenge.action.continue-count': 'Configurer {count}',
  'guide.action-step.dismiss': 'Pas maintenant',
  'guide.legacy-challenge.title': 'Vos comptes existants',
  'guide.legacy-challenge.description':
    'Combinez les comptes qui étaient les phases d’un challenge, ou transformez un compte en challenge à part entière.',
  'guide.legacy-challenge.action': 'Configurer mes comptes',
  'onboarding.legacy-challenge.title': 'Prop challenges',
  'onboarding.legacy-challenge.action.skip': 'Ignorer',
  'onboarding.legacy-challenge.accounts.show-archived': 'Afficher les archivés',
  'onboarding.legacy-challenge.accounts.empty': 'Aucun compte à configurer',
  'onboarding.legacy-challenge.loading': 'Chargement...',
  'onboarding.legacy-challenge.suggested': 'Suggéré',
  'onboarding.legacy-challenge.row.aria': 'Action pour {account}',
  'onboarding.legacy-challenge.status.combined': 'Fusionnés',
  'onboarding.legacy-challenge.status.converted': 'Converti',
  'onboarding.legacy-challenge.entry.name': 'Prop challenges',
  'onboarding.legacy-challenge.entry.desc':
    'Fusionnez ou convertissez des comptes existants en challenges.',
  'onboarding.legacy-challenge.entry.action': 'Configurer',

  'view.home': 'Accueil',
  'common.lose': 'Perdre',

  'dashboard.conversion.requires-conversion':
    'Les graphiques P&L multidevises nécessitent une conversion de taux de change.',

  'auth.error.invalid-email': 'Veuillez saisir une adresse e-mail valide',
  'auth.error.invalid-code': 'Code de vérification invalide',
  'form.layout.guide-trigger-label': 'Personnaliser le formulaire',
  'dashboard.filter.setup.none-found': 'Aucun setup trouvée',
  'nav.weekly': 'Revue hebdomadaire',
  'weekly.overview.drawdown-chart.empty':
    'Aucune donnée de drawdown à afficher',
  'trade-sync.gate.signin.cta': 'Se connecter',
  'backend.progress.ftp.desc': 'Créer des identifiants',
  'csv.errors.group.close-only': 'Les exécutions rapprochées ont été ignorées',
  'csv.report.file': 'Fichier : {file}',
  'csv.broker-guide.sierrachart.warning.message':
    "L'option Exporter enregistre les prix non ajustés. Enregistrer le journal sous conserve les prix tels qu’affichés.",
  'csv.broker-guide.rithmic.step-1':
    'Ouvrir l’historique des commandes dans R |Trader Pro et filtrez les commandes terminées/remplies pour votre compte/date',
  'csv.broker-guide.rithmic.step-2':
    "Utilisez Ajouter/Supprimer des colonnes et assurez-vous que le côté, le symbole, la quantité remplie, le prix de remplissage moyen et l'heure de remplissage/mise à jour sont visibles.",
  'trade.details.execution': 'Execution',
  'drc.preparation.checklist.title': 'Liste de contrôle pré-trading',
  'onboarding.welcome.insight.timing.title': 'Modèles de synchronisation',
  'onboarding.wizard.error.account-service':
    'AccountPageService non disponible',
  'account.create.field.drawdown-type-desc': 'Aucun |Fixe |Suivi EOD |Manuel',
  'account.edit.field.drawdown-type-desc': 'Aucun |Fixe |Suivi EOD |Manuel',
  'monthly.game.header.a-games': 'A Games',
  'trade-import.preview.message.no-open-match':
    'Aucun trade ouvert correspondant trouvé pour l’aperçu close-only',
  'setups.view.action.refresh': 'Actualiser',
  'setups.view.detail.no-playbook': 'Pas encore de playbook rédigé.',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'trade-sync.import.action.sync-cloud': 'Sync cloud trades',
  'session-log.placeholder.entry':
    'Que voyez-vous, pensez-vous ou ressentez-vous ?',
  'session-mode.unconfigured.step.gate.description':
    'Starter IF/THEN checklist is ready.',

  'home.widget.streak.kind.trade-outcome': 'Résultats des trades',
  'home.widget.streak.kind.trade-review': 'Revues de trades',
  'home.widget.streak.kind.drc-review': 'Revues DRC',
  'home.widget.streak.kind.weekly-review': 'Revues hebdomadaires',
  'home.widget.streak.kind.monthly-review': 'Revues mensuelles',
  'home.widget.streak.configure': 'Choisir le type de série',
  'home.widget.streak.configure-aria': 'Configurer la série {kind}',
  'home.widget.streak.no-review-streak': 'aucune série de revues active',
  'home.widget.streak.start-reviewing':
    'commencez à réviser pour créer une série',
  'home.widget.streak.keep-reviewing': 'continuez à réviser pour poursuivre',
  'home.widget.streak.reviewed-trades-in-a-row.one':
    'opération révisée à la suite',
  'home.widget.streak.reviewed-trades-in-a-row.few':
    'opérations révisées à la suite',
  'home.widget.streak.reviewed-trades-in-a-row.many':
    'opérations révisées à la suite',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'opérations révisées à la suite',
  'home.widget.streak.reviewed-days-in-a-row.one': 'jour révisé à la suite',
  'home.widget.streak.reviewed-days-in-a-row.few': 'jours révisés à la suite',
  'home.widget.streak.reviewed-days-in-a-row.many': 'jours révisés à la suite',
  'home.widget.streak.reviewed-days-in-a-row.other': 'jours révisés à la suite',
  'home.widget.streak.reviewed-weeks-in-a-row.one':
    'semaine révisée à la suite',
  'home.widget.streak.reviewed-weeks-in-a-row.few':
    'semaines révisées à la suite',
  'home.widget.streak.reviewed-weeks-in-a-row.many':
    'semaines révisées à la suite',
  'home.widget.streak.reviewed-weeks-in-a-row.other':
    'semaines révisées à la suite',
  'home.widget.streak.reviewed-months-in-a-row.one': 'mois révisé à la suite',
  'home.widget.streak.reviewed-months-in-a-row.few': 'mois révisés à la suite',
  'home.widget.streak.reviewed-months-in-a-row.many': 'mois révisés à la suite',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'mois révisés à la suite',
  'home.widget.streak.missed-trades.one':
    '{count} opération manquée depuis votre dernière revue',
  'home.widget.streak.missed-trades.few':
    '{count} opérations manquées depuis votre dernière revue',
  'home.widget.streak.missed-trades.many':
    '{count} opérations manquées depuis votre dernière revue',
  'home.widget.streak.missed-trades.other':
    '{count} opérations manquées depuis votre dernière revue',
  'home.widget.streak.missed-days.one':
    '{count} jour manqué depuis votre dernière revue',
  'home.widget.streak.missed-days.few':
    '{count} jours manqués depuis votre dernière revue',
  'home.widget.streak.missed-days.many':
    '{count} jours manqués depuis votre dernière revue',
  'home.widget.streak.missed-days.other':
    '{count} jours manqués depuis votre dernière revue',
  'home.widget.streak.missed-weeks.one':
    '{count} semaine manquée depuis votre dernière revue',
  'home.widget.streak.missed-weeks.few':
    '{count} semaines manquées depuis votre dernière revue',
  'home.widget.streak.missed-weeks.many':
    '{count} semaines manquées depuis votre dernière revue',
  'home.widget.streak.missed-weeks.other':
    '{count} semaines manquées depuis votre dernière revue',
  'home.widget.streak.missed-months.one':
    '{count} mois manqué depuis votre dernière revue',
  'home.widget.streak.missed-months.few':
    '{count} mois manqués depuis votre dernière revue',
  'home.widget.streak.missed-months.many':
    '{count} mois manqués depuis votre dernière revue',
  'home.widget.streak.missed-months.other':
    '{count} mois manqués depuis votre dernière revue',
  'trade-sync.quick.started': 'Synchronisation des sources de trades activées…',
  'trade-sync.quick.running': 'Synchronisation…',
  'trade-sync.quick.offline':
    'La synchronisation des trades nécessite une connexion Internet. Réessayez lorsque vous êtes en ligne.',
  'trade-sync.quick.no-sources':
    'Aucune source de synchronisation activée trouvée. Configurez Trade Sync dans les réglages.',
  'trade-sync.quick.complete':
    'Synchronisation terminée : {sources} sources synchronisées et {imported} trades importés ou mis à jour.',
  'trade-sync.quick.partial':
    'Synchronisation terminée avec des problèmes : {completed} sources sur {total} terminées et {imported} trades importés ou mis à jour.',
  'trade-sync.quick.failed':
    'La synchronisation de {sources} sources a échoué. Vérifiez les réglages de Trade Sync et réessayez.',
  'navigation.items.nav-sync-trades': 'Synchroniser les trades',
  'command.sync-trades-now': 'Synchroniser les trades',
  'home.quick-links.sync-trades': 'Synchroniser les trades',
  'trade-sync.quick.not-ready':
    'Aucune source de synchronisation activée n’est prête pour le moment. Attendez la fin des synchronisations en cours ou vérifiez les réglages de Trade Sync.',
  'trade-sync.quick.mapping-required':
    '{imported} trades ont été importés ou mis à jour. Terminez l’association des comptes pour {providers} dans Réglages → Trade Sync, puis réessayez.',
  'trade-handoff.action.view-trades-count.one': 'Voir {count} trade',
  'trade-handoff.action.view-trades-count.few': 'Voir {count} trades',
  'trade-handoff.action.view-trades-count.many': 'Voir {count} trades',
  'trade-handoff.action.view-trades-count.other': 'Voir {count} trades',
  'trade-handoff.action.review-now': 'Réviser maintenant',
  'trade-handoff.action.open-period': 'Ouvrir la revue {period}',
  'trade-handoff.review.creation-disabled':
    'Cette revue n’existe pas et la création automatique des revues est désactivée.',
  'trade-handoff.review.open-failed': 'Impossible d’ouvrir cette revue.',
  'trade-handoff.trades.open-failed':
    'Impossible d’ouvrir le journal des trades.',
  'trade-handoff.scope.label':
    'Affichage de {trades} de la dernière opération pour {accounts}',
  'trade-handoff.scope.exit': 'Quitter la vue de l’opération',
  'trade-handoff.trade-count.one': '{count} trade',
  'trade-handoff.trade-count.few': '{count} trades',
  'trade-handoff.trade-count.many': '{count} trades',
  'trade-handoff.trade-count.other': '{count} trades',
  'trade-handoff.title.sync': 'Synchronisation terminée',
  'trade-handoff.summary.import-complete': '{trades} importés',
  'trade-handoff.summary.import-partial':
    '{trades} importés avec des problèmes',
  'trade-handoff.summary.sync-complete': '{trades} synchronisés',
  'trade-handoff.summary.sync-partial':
    '{trades} synchronisés avec des problèmes',
  'trade-handoff.periods.choose': 'Choisir une autre période de revue',
  'trade-handoff.periods.recommended': 'Recommandé',
  'trade-handoff.action.dismiss': 'Fermer le résultat récent des trades',
  'sample.action.try': 'Essayer un journal d’exemple',
  'sample.action.reset': 'Réinitialiser l’exemple',
  'sample.popout.title': 'Journal d’exemple',
  'sample.popout.action.exit': 'Quitter',
  'sample.popout.description':
    'Les modifications ici servent uniquement à s’entraîner.',
  'sample.popout.closed': 'Journal d’entraînement enregistré et fermé.',
  'sample.popout.recovery': 'Le journal d’entraînement doit être restauré.',
  'sample.notice.sync-blocked':
    'Vous modifiez des données d’exemple fictives. La synchronisation avec le serveur est en pause.',
  'sample.notice.folder-locked':
    'Le dossier du journal ne peut pas être modifié tant que le journal d’exemple est actif.',
  'sample.empty.description':
    'Explorez un journal fictif rempli sans modifier les fichiers ni les réglages de votre journal.',
  'sample.progress.creating':
    'Création du journal d’exemple : {completed} éléments sur {total}',
  'sample.progress.removing':
    'Suppression du journal d’exemple : {completed} éléments sur {total}',
  'sample.progress.verifying':
    'Vérification du journal d’exemple : {completed} sur {total} éléments',
  'sample.exit.title': 'Quitter le journal d’exemple ?',
  'sample.exit.remove-warning':
    'La suppression efface les modifications des fichiers dont l’appartenance à l’exemple est prouvée. Les fichiers sans propriété d’exemple vérifiable sont conservés.',
  'sample.exit.remove': 'Quitter et supprimer',
  'sample.reset.title': 'Réinitialiser le journal d’exemple ?',
  'sample.reset.message':
    'Cette action restaure tous les fichiers d’exemple et les réglages propres à l’exemple depuis le paquet fictif d’origine.',
  'sample.reset.warning':
    'Vos modifications dans le journal d’exemple seront supprimées.',
  'sample.collision.title': 'Le dossier d’exemple existe déjà',
  'sample.collision.message':
    'Journalit ne remplacera pas le dossier existant. Créer plutôt le journal d’exemple dans « {path} » ?',
  'sample.collision.confirm': 'Utiliser le dossier disponible',
  'sample.notice.ready': 'Le journal d’exemple est prêt.',
  'sample.notice.reset': 'Journal d’exemple restauré.',
  'sample.notice.reset-preserved':
    'Journal d’exemple restauré. {count} fichiers sans propriété vérifiable ont été conservés.',
  'sample.notice.removed': 'Journal d’exemple supprimé.',
  'sample.notice.removed-preserved':
    'Journal d’exemple supprimé. {count} fichiers sans propriété vérifiable ont été conservés.',
  'sample.notice.error':
    'Échec de l’opération sur le journal d’exemple : {error}',
  'command.open-sample-journal': 'Ouvrir le journal d’exemple',
  'command.exit-sample-journal': 'Quitter le journal d’exemple',
  'command.reset-sample-journal': 'Réinitialiser le journal d’exemple',
  'sample.notice.busy':
    'Une autre opération du journal d’exemple est déjà en cours.',
};
export default fr;
