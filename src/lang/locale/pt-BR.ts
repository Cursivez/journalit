
import type { Lang } from './en';

const ptBR: Partial<Lang> = {
  
  
  

  
  'command.add-trade': 'Adicionar Nova Operação',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Abrir Trade Import',

  
  'command.create-drc': 'Abrir DRC (Relatório Diário)',
  'command.create-weekly-review': 'Abrir Revisão Semanal',
  'command.create-monthly-review': 'Abrir Revisão Mensal',
  'command.create-quarterly-review': 'Abrir Revisão Trimestral',
  'command.create-yearly-review': 'Abrir Revisão Anual',

  
  'command.open-dashboard': 'Abrir Painel de Trading',
  'command.open-account-dashboard': 'Abrir Painel da Conta',
  'command.open-trade-log': 'Abrir Registro de Operações',
  'command.open-home': 'Abrir Página Inicial',
  'command.open-position-size-calculator':
    'Abrir calculadora de tamanho da posição',

  
  'navigation.items.nav-weekly': 'Revisão desta semana',
  'navigation.items.nav-monthly': 'Revisão deste mês',
  'navigation.items.nav-quarterly': 'Revisão deste trimestre',
  'navigation.items.nav-yearly': 'Revisão deste ano',

  
  'command.force-sync': 'Forçar Sincronização',
  'command.cancel-sync': 'Cancelar Sincronização',

  
  'command.replay-onboarding': 'Repetir Fluxo de Integração',

  
  
  
  'onboarding.explore.title': 'Explore',
  'onboarding.explore.subtitle':
    'Journalit turns your vault into a full trading journal with dashboards, trade log, account tracking, and customisable layouts.',
  'onboarding.explore.subtitle2':
    'Designed to adapt to your workflow, not force you into ours.',
  'onboarding.explore.tagline': 'Your journal, your rules.',
  'onboarding.explore.section.out-of-box.title': 'Core views & tools',
  'onboarding.explore.core.dashboard.label': 'Trading Dashboard',
  'onboarding.explore.core.dashboard.description':
    'Your performance at a glance — P&L, win rate, drawdowns, and more.',
  'onboarding.explore.core.tradelog.label': 'Trade Log',
  'onboarding.explore.core.tradelog.description':
    'Browse trades by year/month/week/day and drill down instantly.',
  'onboarding.explore.core.accounts.label': 'Account Tracking',
  'onboarding.explore.core.accounts.description':
    'Track multiple accounts and view account-specific performance pages.',
  'onboarding.explore.core.layouts.label': 'Layout Builder',
  'onboarding.explore.core.layouts.description':
    'Customize dashboards and review layouts with widgets and templates.',
  'onboarding.explore.imports.title': 'Imports & Sync (PRO)',
  'onboarding.explore.imports.subtitle':
    'Preview and setup anytime. Importing/sync requires Pro.',
  'onboarding.explore.imports.csv.label': 'Trade Import',
  'onboarding.explore.imports.csv.description':
    'Upload CSV, spreadsheet, HTML, and broker statement exports for backend-powered analysis and preview.',
  'onboarding.explore.imports.mt.label': 'MetaTrader Sync (MT4/MT5)',
  'onboarding.explore.imports.mt.description':
    'Automatic trade syncing from MetaTrader. Requires Pro.',
  'onboarding.explore.cta.open': 'Open',
  'onboarding.explore.cta.manual': 'Open Docs',

  
  
  
  'onboarding.path.kicker': 'Choose Path',
  'onboarding.path.tip.trial':
    'Tip: PRO subscriptions include a 14-day free trial.',
  'onboarding.path.title': 'Choose your first path',
  'onboarding.path.subtitle':
    'Pick the fastest way to get your first trade in Journalit.',
  'onboarding.path.option.manual.label': 'Manual Entry (Free)',
  'onboarding.path.option.manual.description':
    'Create a trade in seconds with the Add Trade form.',
  'onboarding.path.option.csv.label': 'Trade Import',
  'onboarding.path.option.csv.description':
    'Use Pro backend-powered analysis for broker export files.',
  'onboarding.path.option.mt.label': 'MetaTrader Sync (MT4/MT5)',
  'onboarding.path.option.mt.description':
    'Connect MT4/MT5 for automatic trade syncing.',

  
  
  
  'onboarding.final.manual.title': "You're ready to Journalit",

  'onboarding.final.manual.hotkey.title': 'Suggested hotkey',
  'onboarding.final.manual.hotkey.value': 'Mod + Alt + A',

  'onboarding.final.manual.cta.change-hotkey': 'Set hotkey',
  'onboarding.final.manual.hit-hotkey':
    'Suggested: {hotkey}. Click Set hotkey to configure it.',
  'onboarding.final.csv.title': "You're ready to bring in your trades",
  'onboarding.final.csv.subtitle':
    'Next, open Trade Import. Uploading and processing broker exports requires PRO activation.',
  'onboarding.final.csv.cta.open': 'Open Trade Import',
  'onboarding.final.mt.title': "You're ready to connect MetaTrader",
  'onboarding.final.mt.subtitle':
    'Next, set up MT4/MT5 sync. Requires PRO activation.',
  'onboarding.final.mt.cta.open': 'Open MetaTrader Setup',
  'onboarding.final.mt.hero.source.title': 'MetaTrader',
  'onboarding.final.mt.hero.source.subtitle': 'Trade reports',
  'onboarding.final.mt.hero.dest.title': 'Vault',
  'onboarding.final.mt.hero.dest.subtitle': 'Trade notes',
  'onboarding.final.finish': 'Finish',
  'command.open-release-notes': 'Ver notas de versão',

  
  'command.open-layout-builder': 'Abrir Construtor de Layout',
  'command.switch-template': 'Trocar Modelo',

  
  
  
  'auth.title.already-logged-in': 'Already Logged In',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign In to Journalit',
  'auth.label.email': 'Email Address',
  'auth.placeholder.email': 'your.email@example.com',

  
  
  
  'form.section.trade-details': 'Detalhes da Operação',
  'form.section.trading-costs': 'Custos de Operação',
  'form.section.risk-management': 'Gestão de Risco',
  'form.section.analysis-thesis': 'Análise e Tese',

  
  
  
  'form.tab.basic': 'Básico',
  'form.tab.details': 'Detalhes',
  'form.tab.advanced': 'Avançado',

  
  
  
  'form.field.account': 'Conta',
  'form.field.asset-type': 'Tipo de Ativo',
  'form.field.direction': 'Direção',
  'form.field.direction.long': 'Compra',
  'form.field.direction.short': 'Venda',
  'form.field.commission': 'Comissão',
  'form.field.commission-type': 'Tipo',
  'form.field.rebate': 'Reembolso',
  'form.field.swap': 'Swap',
  'form.field.other-fees': 'Outras Taxas',
  'form.field.stop-loss': 'Stop Loss',
  'form.field.risk-amount': 'Valor em Risco',
  'form.field.profit-loss': 'Lucro/Prejuízo',
  'form.field.total-pnl': 'L&P Total',
  'form.field.realized-pnl': 'L&P Realizado',
  'form.field.total-costs': 'Custos Totais:',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Erro',
  'form.field.custom-tags': 'Tags Personalizadas',
  'form.field.trade-thesis': 'Tese da Operação',
  'form.field.time': 'Horário',
  'form.field.price': 'Preço',
  'form.field.size': 'Tamanho',
  'form.field.entries': 'Entradas',
  'form.field.exits': 'Saídas',
  'form.field.optional': '(opcional)',

  
  'form.field.position-size': 'Tamanho da Posição',
  'form.field.position-size.shares': 'Ações',
  'form.field.position-size.contracts': 'Contratos',
  'form.field.position-size.lots': 'Lotes',
  'form.field.position-size.amount': 'Quantidade',
  'form.field.position-size.cfd-units': 'Unidades CFD',

  
  'form.field.instrument': 'Instrumento',
  'form.field.instrument.ticker': 'Ticker',
  'form.field.instrument.option-symbol': 'Símbolo da Opção',
  'form.field.instrument.future-symbol': 'Símbolo do Futuro',
  'form.field.instrument.forex-pair': 'Par Forex',
  'form.field.instrument.crypto-symbol': 'Símbolo Cripto',
  'form.field.instrument.cfd-symbol': 'Símbolo CFD',

  
  'form.field.exchange': 'Bolsa',
  'form.field.expiration-date': 'Data de Vencimento',
  'form.field.strike-price': 'Preço de Exercício',
  'form.field.contract-size': 'Tamanho do Contrato',
  'form.field.dollars-per-point': 'Dólares por ponto',
  'form.field.tick-size': 'Tamanho do Tick',
  'form.field.tick-value': 'Valor do Tick',
  'form.field.lot-size': 'Tamanho do Lote',
  'form.field.custom-lot-size': 'Tamanho de Lote Personalizado',
  'form.field.pip-value': 'Valor do Pip',
  'form.field.leverage-ratio': 'Taxa de Alavancagem',

  
  'form.field.lot-size.standard': 'Padrão (100.000)',
  'form.field.lot-size.mini': 'Mini (10.000)',
  'form.field.lot-size.micro': 'Micro (1.000)',
  'form.field.lot-size.custom': 'Personalizado',

  
  
  
  'form.placeholder.select-accounts': 'Selecionar contas',
  'form.placeholder.commission': '0,15',
  'form.placeholder.commission-alt': '5,50',
  'form.placeholder.rebate': 'Crédito/reembolso de comissão',
  'form.placeholder.swap': 'Financiamento overnight',
  'form.placeholder.other-fees': 'Taxas de plataforma/regulatórias',
  'form.placeholder.stop-loss': 'Preço de stop loss opcional',
  'form.placeholder.risk-amount': 'Risco planejado em moeda',
  'form.placeholder.custom-tag': 'Digite uma tag e pressione Enter',
  'form.placeholder.thesis': 'Digite sua tese para esta operação...',
  'form.placeholder.pnl': 'Digite o lucro ou prejuízo total',
  'form.placeholder.exchange-stock': 'ex: B3, NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'ex: Binance, Coinbase',
  'form.placeholder.futures-point-value': 'ex: 50 para ES1',
  'form.placeholder.leverage': 'ex: 100 para 1:100',

  
  
  
  'form.entry-exit.add-entry': '+ Adicionar Entrada',
  'form.entry-exit.add-exit': '+ Adicionar Saída',
  'form.entry-exit.remove-entry': 'Remover Entrada',
  'form.entry-exit.remove-exit': 'Remover Saída',
  'form.entry-exit.total-entry-size': 'Tamanho Total de Entrada:',
  'form.entry-exit.remaining-position': 'Posição Restante:',
  'form.entry-exit.open': '(Aberta)',
  'form.entry-exit.closed': '(Fechada)',
  'form.entry-exit.direct-pnl': 'Inserir L&P diretamente em vez de preços',
  'form.entry-exit.direct-pnl-desc':
    'Insira seu lucro/prejuízo total diretamente. Comissão e taxas ainda serão subtraídas.',
  'form.entry-exit.calc-pnl':
    'Calcular L&P a partir dos preços de entrada/saída e tamanhos de posição.',

  
  
  
  'form.trade-type.title': 'Tipo de Operação',
  'form.trade-type.subtitle':
    'Escolha o tipo de operação que você está criando',
  'form.trade-type.regular': 'Operação Regular',
  'form.trade-type.regular-desc':
    'Operação normal com dados completos de entrada e saída',
  'form.trade-type.missed': 'Operação Perdida',
  'form.trade-type.missed-desc':
    'Oportunidade de operação que você perdeu - campos L&P e Conta são opcionais',
  'form.trade-type.backtest': 'Operação de Backtest',
  'form.trade-type.backtest-desc': 'Cenário de backtest para fins de análise',
  'form.trade-type.missed-reason': 'Por que você perdeu esta operação?',
  'form.trade-type.missed-reason-placeholder':
    'Descreva por que você perdeu esta oportunidade de operação...',

  'form.account-empty-state.title':
    'Crie uma conta antes de adicionar uma operação',
  'form.account-empty-state.create-account': 'Criar Conta',
  'form.account-empty-state.submit-disabled':
    'Crie uma conta primeiro para salvar esta operação.',

  
  
  
  'button.save': 'Salvar',
  'button.cancel': 'Cancelar',
  'button.delete': 'Excluir',
  'button.update': 'Atualizar',
  'button.add': 'Adicionar',
  'button.create': 'Criar',
  'button.reset': 'Redefinir',
  'button.close': 'Fechar',
  'button.confirm': 'Confirmar',
  'button.submit': 'Enviar',

  'button.add-trade': 'Adicionar Operação',
  'button.update-trade': 'Atualizar Operação',
  'button.save-changes': 'Salvar Alterações',
  'button.create-trade': 'Criar Operação',
  'button.delete-all': 'Excluir Tudo',
  'button.clear-all': 'Limpar Tudo',
  'button.save-name-only': 'Salvar Apenas o Nome',
  'button.cancel-action': 'Cancelar Ação',
  'button.cancel-reset': 'Cancelar Redefinição',
  'button.proceed-anyway': 'Prosseguir Mesmo Assim',
  'button.mark-reviewed': 'Marcar como Revisado',
  'button.add-first-goal': 'Adicionar Sua Primeira Meta',
  'button.add-first-event': 'Adicionar Seu Primeiro Evento',
  'button.create-daily-review': 'Criar Revisão Diária',
  'button.apply-settings': 'Aplicar Configurações',
  'button.learn-more': 'Saiba mais',
  'button.upload-image': 'Enviar Imagem',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': 'EDITAR',
  'validation.fix-errors': 'Por favor, corrija os seguintes erros:',

  'validation.complete-required':
    'Por favor, preencha todos os campos obrigatórios',
  'validation.map-required-fields':
    'Por favor, mapeie todos os campos obrigatórios antes de importar',

  
  
  
  'notice.verification-sent':
    'Código de verificação enviado! Verifique seu e-mail.',
  'notice.login-success': 'Login realizado com sucesso!',
  'notice.new-verification-sent':
    'Novo código de verificação enviado! Verifique seu e-mail.',
  'notice.logout-success': 'Desconectado com sucesso',
  'notice.hotkey-set': 'Hotkey set: {hotkey}',
  'notice.ftp-created': 'Credenciais FTP criadas com sucesso',
  'notice.ftp-reset': 'Senha FTP redefinida com sucesso! Salve a nova senha.',
  'notice.template-saved': 'Layout salvo',
  'notice.template-created': 'Layout criado',
  'notice.template-duplicated': 'Layout duplicado',
  'notice.template-deleted': 'Layout excluído',
  'notice.default-template-updated': 'Layout padrão atualizado',
  'notice.tradelog-saved':
    'Configurações do registro de operações salvas com sucesso',
  'notice.settings-exported': 'Configurações exportadas para {filename}',
  'notice.settings-imported':
    'Configurações importadas com sucesso da v{version}. Reinicie o Obsidian para aplicar todas as alterações.',

  'notice.template-switched': 'Trocado para: {name}',
  'notice.auto-sync-toggled': 'Sincronização automática {status}',
  'notice.auto-sync-enabled': 'ativada',
  'notice.auto-sync-disabled': 'desativada',
  'notice.reset-items': 'Itens redefinidos para o padrão',
  'notice.reset-timeframes': 'Timeframes redefinidos para o padrão',
  'notice.custom-fields-imported':
    '{count} campos personalizados importados com sucesso',
  'notice.csv-parsed': 'CSV/XLSX/XLS processado com sucesso: {count} linhas',
  'notice.setups-added': 'Setups adicionados a {count} operações',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': 'Erros adicionados a {count} operações',

  
  
  
  'notice.error.open-journalit':
    'Falha ao abrir Journalit. Por favor, tente recarregar o Obsidian.',
  'notice.error.open-drc': 'Falha ao abrir DRC: {error}',
  'notice.error.open-dashboard': 'Failed to open dashboard: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': 'Falha ao abrir Revisão Semanal: {error}',
  'notice.error.open-monthly-review': 'Falha ao abrir Revisão Mensal: {error}',
  'notice.error.open-quarterly-review':
    'Falha ao abrir Revisão Trimestral: {error}',
  'notice.error.open-yearly-review': 'Falha ao abrir Revisão Anual: {error}',
  'notice.error.sync-trades': 'Falha ao sincronizar operações: {error}',
  'notice.error.open-release-notes': 'Falha ao abrir notas de versão: {error}',
  'notice.error.open-layout-builder':
    'Falha ao abrir Construtor de Layout: {error}',
  'notice.error.switch-template': 'Falha ao trocar layout: {error}',
  'notice.error.no-active-file':
    'Nenhum arquivo ativo. Abra uma nota primeiro.',
  'notice.error.no-template-support': 'Este tipo de nota não suporta layouts.',
  'notice.error.no-templates':
    'Nenhum modelo disponível para este tipo de nota.',
  'notice.error.asset-type-required':
    'Tipo de ativo é obrigatório ao adicionar um instrumento',
  'notice.error.column-required':
    'Pelo menos uma coluna deve permanecer visível',
  'notice.error.save-settings': 'Erro ao salvar configurações: {error}',
  'notice.error.sign-in-vault':
    'Por favor, faça login para registrar seu cofre.',
  'notice.error.sign-in-sync':
    'Por favor, faça login para usar a sincronização automática.',
  'notice.error.export-settings':
    'Falha ao exportar configurações. Verifique o console para detalhes.',
  'notice.error.import-settings': 'Falha ao importar configurações: {error}',
  'notice.error.reset-settings':
    'Falha ao redefinir configurações. Verifique o console para detalhes.',

  'notice.error.invalid-drc-date': 'Data do DRC inválida',
  'notice.error.invalid-drc-missed':
    'Data do DRC inválida. Não é possível criar operação perdida.',
  'notice.error.trade-not-found': 'Arquivo de operação não encontrado: {path}',
  'notice.error.mark-reviewed':
    'Erro ao marcar operações como revisadas: {error}',
  'notice.error.add-setups': 'Erro ao adicionar setups: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'Erro ao adicionar erros: {error}',
  'notice.error.delete-trades': 'Erro ao excluir operações: {error}',
  'notice.error.csv-validation': 'Validação do CSV/XLSX/XLS falhou: {errors}',
  'notice.error.import-failed': 'Importação falhou: {error}',
  'notice.error.file-too-large': 'Arquivo muito grande. Tamanho máximo é 10MB',
  'notice.error.select-csv': 'Por favor, selecione um arquivo CSV/XLSX/XLS',
  'notice.error.cannot-delete-builtin':
    'Não é possível excluir modelos integrados',
  'notice.error.duplicate-to-customize':
    'Duplique este modelo para personalizá-lo',

  
  
  
  'notice.info.no-sync': 'Nenhuma sincronização em andamento',

  'notice.info.settings-recovered':
    'Configurações foram recuperadas do backup. Algumas alterações recentes podem ter sido perdidas.',
  'notice.info.cannot-remove-locked':
    'Não é possível remover widgets bloqueados',

  
  
  
  'tradelog.title': 'Registro de Operações',
  'dashboard.guide.empty.intro.title': 'Welcome to your Dashboard',
  'dashboard.guide.empty.intro.description':
    'This page gives you a quick view of your trading performance. Once you have trades, it becomes your daily command center.',
  'dashboard.guide.empty.state.title': 'Start by adding your first trade',
  'dashboard.guide.empty.state.description':
    'You do not have any trades yet. Add a trade manually or import data, then come back to unlock the full Dashboard tour.',
  'dashboard.guide.main.intro.title': 'This is your trading dashboard',
  'dashboard.guide.main.intro.description':
    'Use this page to track your performance, review your stats, and keep your most useful charts in one place.',
  'dashboard.guide.main.filters.title': 'Filters change the whole Dashboard',
  'dashboard.guide.main.filters.description':
    'Use filters when you want every stat and chart on this page to update for a different date range, account, setup, tag, or trade type.',
  'dashboard.guide.main.edit-layout.title':
    'Turn on edit mode to customise this page',
  'dashboard.guide.main.edit-layout.description':
    'Click Edit Layout to unlock moving, resizing, removing, and adding Dashboard widgets.',
  'dashboard.guide.main.open-widget-selector.title': 'Open Add Widget',
  'dashboard.guide.main.open-widget-selector.description':
    'Click Add Widget to add more charts and bring back widgets you removed earlier.',
  'dashboard.guide.main.widget-picker.title': 'Pick what you want to show',
  'dashboard.guide.main.widget-picker.description':
    'This picker shows the metrics and widgets that are not currently on your Dashboard. Click one to add it.',
  'dashboard.guide.main.metrics.title':
    'These top cards are your quick summary',
  'dashboard.guide.main.metrics.description':
    'The top row gives you fast answers like profit, win rate, and total trades. In edit mode, you can change which cards appear and reorder them.',
  'dashboard.guide.main.bottom.title':
    'This is where moving and resizing happens',
  'dashboard.guide.main.bottom.description':
    'While Edit Layout is on, drag a widget to move it. To resize a widget, drag its bottom-right corner. This is the step many users miss.',
  'dashboard.guide.main.save-layout.title':
    'Save your layout when you are done',
  'dashboard.guide.main.save-layout.description':
    'When you finish customising, click Save Layout to keep your changes. You can come back and edit this page again anytime.',
  'home.guide.intro.title': 'Welcome to Home',
  'home.guide.intro.description':
    'This is your main page. It shows your trading stats, quick actions, and shortcuts to the rest of Journalit.',
  'home.guide.filters.title': 'These buttons change what your widgets show',
  'home.guide.filters.description':
    'Use these to switch the time period, trade type, or account so your Home widgets show the data you want to look at.',
  'home.guide.customize.title': 'Turn on edit mode to customise Home',
  'home.guide.customize.description':
    'Click this button to start customising. Edit mode unlocks moving, resizing, removing, and adding widgets.',
  'home.guide.quick-links-position.title':
    'Move Quick Links above or below the widgets',
  'home.guide.quick-links-position.description':
    'Use this button to choose whether the Quick Links row sits above the main widget area or below it.',
  'home.guide.quick-links.title': 'These Quick Links are your fast shortcuts',
  'home.guide.quick-links.description':
    'Quick Links give you one-click shortcuts to common actions and pages. In edit mode, you can also hide links you do not want showing here.',
  'home.guide.move-and-resize.title': 'Move and resize your widgets',
  'home.guide.widget-picker.title': 'Add widgets here',
  'home.guide.widget-picker.description':
    'This picker lets you add more widgets and bring back quick links that you previously hid.',
  'home.guide.move-and-resize.description':
    'This is the main area you can rearrange in edit mode. Drag widgets to move them, or drag a widget from its bottom-right corner to resize it.',
  'home.guide.add-widget.title': 'Add widgets or bring back hidden quick links',
  'home.guide.add-widget.description':
    'Click Add Widget to open the picker, where you can add more widgets and restore quick links that you previously hid.',
  'home.guide.save-layout.title': 'Save your layout when you are done',
  'home.guide.save-layout.description':
    'When you are happy with the layout, click this button to save your changes and leave edit mode.',
  'home.guide.widget-interactions.title': 'That is the main idea of Home',
  'home.guide.widget-interactions.description':
    'Home is your customisable dashboard. Use edit mode to change the layout, and click widgets to open tools, settings, or deeper pages.',
  'layoutBuilder.guide.intro.title': 'This is your Layout Builder',
  'layoutBuilder.guide.intro.description':
    'This page controls how your review templates are structured. The easiest way to start is to duplicate a built-in template, then customise your copy.',
  'layoutBuilder.guide.sidebar-overview.title':
    'This sidebar is where you choose what you are editing',
  'layoutBuilder.guide.sidebar-overview.description':
    'Each section in the sidebar is a different template type. Trade templates are separate from your review templates, and the Library section is for sharing templates. After you make your own copy, you can star it to make it the default for new review notes.',
  'layoutBuilder.guide.pick-built-in.title':
    'Start with a built-in DRC template',
  'layoutBuilder.guide.pick-built-in.description':
    'For your first layout, start with one of the built-in DRC templates. It gives you a safe starting point before you make your own copy.',
  'layoutBuilder.guide.duplicate.title': 'Duplicate the built-in layout',
  'layoutBuilder.guide.duplicate.description':
    'Built-in templates are starting points. Duplicate one first so you can safely make your own version.',
  'layoutBuilder.guide.preview-template.title':
    'This preview shows what the template will look like',
  'layoutBuilder.guide.preview-template.description':
    'Scroll through the preview and get a feel for the flow. This is useful for checking whether the template reads clearly before you start editing it.',
  'layoutBuilder.guide.switch-to-editor.title': 'Switch to Editor',
  'layoutBuilder.guide.switch-to-editor.description':
    'Preview shows you what the template will look like. Editor is where you actually change it.',
  'layoutBuilder.guide.editor-overview.title':
    'This is where you edit the template',
  'layoutBuilder.guide.editor-overview.description':
    'Rename the template here, review the widget list, drag the left handle to rearrange widgets, click a widget to change it, and remove anything you do not need.',
  'layoutBuilder.guide.add-widget.title': 'Add a widget to your copy',
  'layoutBuilder.guide.add-widget.description':
    'Use Add Widget to put new blocks into your template. This is how you shape the workflow to match how you review.',
  'layoutBuilder.guide.open-widget-picker.title': 'Open the widget picker',
  'layoutBuilder.guide.open-widget-picker.description':
    'This picker shows the widgets you can add for this review type.',
  'layoutBuilder.guide.choose-widget.title': 'Choose a widget',
  'layoutBuilder.guide.choose-widget.description':
    'This list shows every widget you can add for this review type. Pick any widget you want, or press Next and Journalit will choose the first one for you.',
  'layoutBuilder.guide.widget-library-docs.title':
    'Use the widget library if you get stuck',
  'layoutBuilder.guide.widget-library-docs.description':
    'This opens the docs page with the widget library, examples, and availability table for each review type.',
  'layoutBuilder.guide.save-template.title': 'Save your layout',
  'layoutBuilder.guide.save-template.description':
    'Once your copy looks right, save it. You can keep refining it later as your review process improves.',
  'layoutBuilder.guide.set-default-template.title':
    'Set this copy as your default template',
  'layoutBuilder.guide.set-default-template.description':
    'Click the star on your new template if you want new review notes to use this layout automatically.',
  'tradelog.guide.empty.intro.title': 'Welcome to Trade Log',
  'tradelog.guide.empty.intro.description':
    'This page becomes your main place for browsing, sorting, and reviewing trades. Once you add trades, you will also get the full Trade Log tour.',
  'tradelog.guide.empty.state.title': 'Start by adding your first trade',
  'tradelog.guide.empty.state.description':
    'You do not have any trades here yet. Click the Create Trade button to make your first trade, then come back to learn the full table and batch tools.',
  'tradelog.guide.intro.title': 'This is your Trade Log',
  'tradelog.guide.intro.description':
    'Use this page to review trades one by one, sort them, filter them, and make changes to many trades at once.',
  'tradelog.guide.view-selector.title':
    'Choose how you want to review your history',
  'tradelog.guide.view-selector.description':
    'Use this menu to switch between the full trade table and grouped time views like months, weeks, or days. Trades is the default, but grouped views are useful when you want to review by period.',
  'tradelog.guide.filters.title': 'Use filters to narrow the Trade Log',
  'tradelog.guide.filters.description':
    'Open filters when you want to review only certain accounts, setups, tags, trade types, statuses, or dates.',
  'tradelog.guide.filter-modal.title': 'These are your detailed filters',
  'tradelog.guide.filter-modal.description':
    'Use this modal when you want more control over exactly which trades are shown. Close it when you are done reviewing or changing filters.',
  'tradelog.guide.sorting.title': 'Click column headers to sort the table',
  'tradelog.guide.sorting.description':
    'In Trades view, click a sortable column header to reorder the table. For example, click Net P&L to sort by your biggest win and biggest loss.',
  'tradelog.guide.multi-select.title': 'Turn on multi-select',
  'tradelog.guide.multi-select.description':
    'Click this button to select several trades at once. When multi-select is on, row clicks select trades instead of opening them.',
  'tradelog.guide.batch-actions.title': 'These are your batch actions',
  'tradelog.guide.batch-actions.description':
    'Use this bar to select all visible trades, clear your selection, mark trades as reviewed, add setups, add mistakes, or delete several trades at once. You can also shift-click to select a range of trades.',
  'tradelog.guide.column-settings.title': 'Open column settings',
  'tradelog.guide.column-settings.description':
    'Click this button to choose which columns are shown and how dense or detailed the table should feel.',
  'tradelog.guide.active-columns.title':
    'Reorder or remove the columns you already use',
  'tradelog.guide.active-columns.description':
    'In Active Columns, drag a column to move it, or remove one you do not need. This changes the order of the table from left to right.',
  'tradelog.guide.available-columns.title':
    'Add hidden columns back when you need more detail',
  'tradelog.guide.available-columns.description':
    'Open Available Columns to add fields back into the table. That is where you bring back anything you removed earlier.',
  'tradelog.guide.open-trades.title':
    'Click a trade when you want to open its note',
  'tradelog.guide.open-trades.description':
    'In normal mode, clicking a trade opens it. In multi-select mode, clicking selects it instead. Switch between those two behaviours depending on what you want to do.',
  'tradelog.empty': 'Nenhuma operação encontrada',
  'tradelog.filter.all': 'Todas',
  'tradelog.filter.winners': 'Ganhadoras',
  'tradelog.filter.losers': 'Perdedoras',
  'tradelog.filter.breakeven': 'Empate',
  'tradelog.filter.open': 'Abertas',
  'tradelog.type.all': 'Todos os Tipos',
  'tradelog.type.regular': 'Regular',
  'tradelog.type.missed': 'Perdida',
  'tradelog.type.backtest': 'Backtest',

  
  
  
  'dashboard.title': 'Painel',
  'dashboard.no-data': 'Nenhum dado de trading disponível',

  
  'dashboard.filter.accounts.all': 'Todas as contas',
  'dashboard.filter.accounts.n-selected': '{count} contas',
  'dashboard.filter.accounts.select-all': 'Selecionar tudo',
  'dashboard.filter.accounts.select-all-option': '-- Selecionar tudo --',
  'dashboard.filter.accounts.none-found': 'Nenhuma conta encontrada',

  
  'dashboard.filter.mistakes.all': 'Todos os Erros',
  'dashboard.filter.mistakes.none': 'Sem Erros',
  'dashboard.filter.mistakes.n-selected': '{count} Erros',
  'dashboard.filter.mistakes.select-all': 'Selecionar tudo',
  'dashboard.filter.mistakes.none-found': 'Nenhum erro encontrado',

  
  
  
  'account.header.title': 'Conta: {name}',
  'account.header.add-event.aria': 'Adicionar Depósito/Saque',
  'account.header.edit-account.aria': 'Editar Conta',
  'account.header.view-trades.aria': 'View trades in Trade Log',
  'account.header.type': 'Tipo:',
  'account.header.initial-balance': 'Saldo Inicial:',
  'account.header.current-balance': 'Saldo Atual:',
  'account.header.account-id': 'ID da Conta:',
  'account.header.warning.trades-before-creation.one':
    '{count} operação encontrada antes da data de criação da conta',
  'account.header.warning.trades-before-creation.other':
    '{count} operações encontradas antes da data de criação da conta',
  'account.header.warning.earliest-trade':
    'Operação mais antiga: {date}. Isso pode causar cálculos de saldo incorretos.',
  'account.header.warning.fix-date.aria': 'Corrigir data de criação da conta',
  'account.header.warning.fixing': 'Corrigindo...',
  'account.header.warning.fix-date': 'Corrigir Data',
  'account.header.notice.date-updated':
    'Data de criação da conta atualizada para {date}',
  'account.header.notice.update-failed-log':
    'Falha ao atualizar a data de criação da conta:',
  'account.header.notice.update-failed': 'Falha ao atualizar a data: {error}',

  
  
  
  'account.edit.modal.update-notes.title': 'Atualizar Notas Vinculadas?',
  'account.edit.modal.update-notes.message':
    'Renomear atualizará todas as notas que referenciam "{oldName}" para "{newName}". Isso é necessário para manter os dados consistentes.',
  'account.edit.modal.update-notes.yes': 'OK (Atualizar Notas)',
  'account.edit.modal.update-notes.no': 'Manter nome antigo',
  'account.edit.modal.update-notes.cancel': 'Cancelar Ação',

  'account.edit.modal.change-date.title': 'Alterar Data de Criação',
  'account.edit.modal.change-date.message':
    'Você está prestes a alterar a data de criação da conta "{account}" de {oldDate} para {newDate}.',
  'account.edit.modal.change-date.warning':
    'Isso atualizará a data da transação de depósito inicial e poderá afetar os cálculos de idade da conta, ciclos de faturamento mensal e outras métricas baseadas em datas.',
  'account.edit.modal.change-date.info':
    'Isso atualizará a data da transação do depósito inicial para corresponder à nova data de criação.',
  'account.edit.modal.change-date.confirm': 'Atualizar Data de Criação',

  'account.edit.modal.change-balance.title': 'Alterar Saldo Inicial',
  'account.edit.modal.change-balance.message':
    'Você está prestes a alterar o saldo inicial de {oldBalance} para {newBalance}.',
  'account.edit.modal.change-balance.warning':
    'Você está prestes a alterar o saldo inicial desta conta. Esta ação tem consequências importantes para o seu histórico.',
  'account.edit.modal.change-balance.info':
    'Esta alteração afetará todos os cálculos de saldo, porcentagens de lucro e perda (L&P), cálculos de rebaixamento (drawdown) e o histórico completo de transações.',
  'account.edit.modal.change-balance.info2':
    'O saldo atual da conta será recalculado automaticamente com base no novo saldo inicial, somado a todo o L&P das operações registradas.',
  'account.edit.modal.change-balance.info3':
    'Esta mudança pode impactar significativamente a precisão das suas métricas de desempenho e dados históricos. Proceda com cautela.',
  'account.edit.modal.change-balance.confirm': 'Atualizar Saldo Inicial',

  'account.edit.modal.delete.title': 'Excluir Conta',
  'account.edit.modal.delete.question':
    'Tem certeza de que deseja excluir permanentemente a conta "{name}"?',
  'account.edit.modal.delete.warning':
    'Tem certeza de que deseja excluir permanentemente esta conta? Todos os dados associados serão perdidos e esta ação não pode ser desfeita.',
  'account.edit.modal.delete.will': 'Esta ação irá:',
  'account.edit.modal.delete.item1':
    'Remover todos os metadados e configurações da conta',
  'account.edit.modal.delete.item2':
    'Remover referências da conta de todas as operações vinculadas',
  'account.edit.modal.delete.item3':
    'Remover tags de conta geradas automaticamente das notas',

  'account.edit.modal.delete.delete-associated-trades':
    'Also delete all trades linked to this account from my vault',
  
  'account.edit.error.name-exists': 'A conta "{name}" já existe',
  'account.edit.error.creation-date-required':
    'A data de criação é obrigatória',

  
  
  
  'view.home': 'Início',
  'view.dashboard': 'Painel',
  'view.trade-log': 'Registro de Operações',
  'view.account-dashboard': 'Painel da Conta',
  'view.layout-builder': 'Construtor de Layout',
  'view.csv-import': 'Trade Import',

  
  
  
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  
  
  'csv.errors.copy-shareable': 'Copiar relatório compartilhável',
  'csv.errors.copy-report': 'Copiar relatório',
  'csv.errors.copy-detailed': 'Copiar relatório detalhado',

  
  
  
  'csv.account-selector.loading': 'Carregando contas...',
  'csv.account-selector.no-accounts': 'Nenhuma conta encontrada.',
  'csv.account-selector.create-account-hint':
    'Por favor, crie uma conta antes de importar operações.',
  'csv.account-selector.create-account-cta': 'Criar Conta',
  'csv.account-selector.label': 'Selecionar Conta',

  
  'csv.preview-first-note':
    'Preview is free. Importing into your vault requires PRO activation.',
  'csv.gate.import.title': 'PRO required to import',
  'csv.gate.import.description':
    'Importing trades into your vault is a PRO feature. Activate PRO to continue.',
  'csv.gate.templates.tooltip': 'PRO required (activate to use templates).',
  'csv.gate.ai.tooltip': 'PRO required (activate to use AI mapping).',

  
  
  
  'common.loading': 'Carregando...',
  'common.error': 'Erro',
  'common.success': 'Sucesso',
  'common.warning': 'Aviso',
  'common.info': 'Informação',
  'common.yes': 'Sim',
  'common.no': 'Não',
  'common.ok': 'OK',
  'common.search': 'Buscar...',
  'common.select': 'Selecionar...',
  'common.none': 'Nenhum',
  'common.all': 'Todos',
  'common.date': 'Data',
  'common.time': 'Horário',
  'common.today': 'Hoje',
  'common.yesterday': 'Ontem',
  'common.tomorrow': 'Amanhã',
  'common.week': 'Semana',
  'common.month': 'Mês',
  'common.year': 'Ano',
  'common.total': 'Total',
  'common.average': 'Média',
  'common.min': 'Mín',
  'common.max': 'Máx',
  'common.profit': 'Lucro',
  'common.loss': 'Prejuízo',
  'common.win': 'Ganho',
  'common.lose': 'Perda',
  'common.trade': 'Operação',
  'common.trades': 'Operações',

  
  
  
  'settings.title': 'Configurações do Journalit',
  'settings.language': 'Idioma',
  'settings.language-desc': 'Selecione o idioma de exibição do plugin',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'Mapeamento Trade Import com IA',
  'settings.auth.feature.metatrader-sync': 'Sincronização MetaTrader',
  'settings.auth.feature.basic-tracking': 'Rastreamento básico',
  'settings.auth.feature.manual-csv': 'Importação manual do Trade Import',
  'settings.auth.feature.priority-support': 'Suporte Prioritário',

  
  
  
  
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description':
    'Checklist to help you add your first trades and activate PRO',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.create.title': 'Create your first trade',
  'home.widget.getting-started.item.create.description':
    'Unlock your dashboard and journaling flow.',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Create Trade',
  'home.widget.getting-started.item.tradelog.title': 'Open Trade Log',
  'home.widget.getting-started.item.tradelog.description':
    'Your trade database for analysing all your trades in one place.',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta': 'Open Trade Log',
  'home.widget.getting-started.item.layouts.title': 'Open Layout Builder',
  'home.widget.getting-started.item.layouts.description':
    'Design your review templates your way.',
  'home.widget.getting-started.item.layouts.time': '1 min',
  'home.widget.getting-started.item.layouts.cta': 'Open Layout Builder',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    'Enable Trade Import, MetaTrader sync, and AI mapping.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',

  
  'premium.gate.cta.activate': 'Activate PRO',
  'premium.gate.cta.upgrade-now': 'Upgrade now',
  'premium.gate.cta.signin-continue': 'Fazer login e continuar',
  'premium.gate.cta.continue-pro': 'Continuar para o PRO',
  'premium.gate.cta.keep-editing': 'Continuar editando',
  'premium.gate.cta.refresh': 'Refresh status',
  'premium.gate.import.state.signin.title': 'Falta só um passo para importar',
  'premium.gate.import.state.signin.description':
    'Seu arquivo e mapeamentos estão prontos. Faça login para continuar.',
  'premium.gate.import.state.pro.title': 'Tudo pronto para importar',
  'premium.gate.import.state.pro.description':
    'Seu arquivo e mapeamentos estão prontos. Importar faz parte do PRO.',
  'premium.gate.import.reassurance':
    'Sua prévia e os mapeamentos de colunas permanecem exatamente como estão.',
  'premium.gate.trial-hint':
    'As primeiras assinaturas PRO incluem um teste grátis de 14 dias.',
  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description': 'Fills widget CSV export',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Open the Fills widget in TT and switch to Detail, Continuous, or Price with Detail view',
  'csv.broker-guide.tradingtechnologies.step-2':
    'Right-click inside the Fills widget, select “Request download”, and choose the time range',
  'csv.broker-guide.tradingtechnologies.step-3':
    'When TT shows the download-ready notification, download the CSV and import it here',
  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Important:',
  'csv.broker-guide.tradingtechnologies.warning.message':
    'Do not edit the exported file or column order before importing.',
  'csv.broker-guide.tradingtechnologies.doc-label':
    'View Trading Technologies export instructions',

  
  'csv.results.custom-field-warnings':
    'Skipped {count} invalid custom field value(s)',
  'csv.results.custom-field-warnings-header':
    'CLICK TO SEE CUSTOM FIELD WARNINGS ({count})',
  'csv.report.custom-field-warnings': 'Custom field warnings: {count}',
  'csv.report.raw-custom-field-warnings': 'Custom field warnings:',

  
  'dashboard.metrics.avgRR': 'RR Médio (Payoff)',
  'dashboard.metrics.avgRRRiskBased': 'RR Médio (baseado em R)',
  'dashboard.metrics.longestWinStreak': 'Melhor sequência',
  'dashboard.metrics.longestLossStreak': 'Pior sequência',
  'dashboard.avgRRRiskBased.tooltip.title': 'RR Médio (baseado em R)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'Fórmula: R médio vencedor / R médio perdedor',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    'Calculado com {valid} de {total} trades fechados com dados de risco',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'Vencedores com risco válido: {wins}, perdedores: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'Cobertura de risco parcial: {valid} de {total} trades fechados têm dados de risco válidos.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'Dados insuficientes para calcular RR baseado em R. Adicione dados de stop/risco e garanta trades vencedores e perdedores válidos.',
  'metric.avgRR.name': 'RR Médio (Payoff)',
  'metric.avgRR.description':
    'Relação média risco/retorno (ganho médio / perda média)',
  'metric.avgRRRiskBased.name': 'RR Médio (baseado em R)',
  'metric.avgRRRiskBased.description':
    'Relação baseada em múltiplos R: R médio vencedor / R médio perdedor (requer dados de stop/risco)',
  'metric.longestWinStreak.name': 'Melhor sequência',
  'metric.longestWinStreak.description':
    'Maior sequência consecutiva de ganhos por data de saída',
  'metric.longestLossStreak.name': 'Pior sequência',
  'metric.longestLossStreak.description':
    'Maior sequência consecutiva de perdas por data de saída',
  'metric.numTrades.name': 'Total de Trades',
  'metric.numTrades.description': 'Número total de trades fechados',
  'settings.customization.custom-fields.editor.trade-log': 'Trade Log',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'Control how this field appears when added as a Trade Log column',
  'settings.customization.custom-fields.editor.column-label':
    'Trade Log Column Label',
  'settings.customization.custom-fields.editor.column-label-desc':
    'Optional shorter label used only in the Trade Log header',
  'settings.customization.custom-fields.editor.column-label-placeholder':
    'Use field label by default',
  'settings.customization.custom-fields.editor.display-as-currency':
    'Exibir como moeda',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Formata este campo numérico como valor monetário apenas no registro de trades',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'Dropdown Sort Mode',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'Disabled by default. Enable sorting only when this dropdown has a meaningful order.',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'Disabled',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'Alphabetical',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'Numeric',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'Configured option order',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'Collapsed Display',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'Choose how multiselect values render when Trade Log expanded mode is off',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'Count badge',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'Value list',
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.returnPercent': 'Return %',
  'filter.modal.section.custom-fields': 'Custom Fields',
  'filter.modal.custom-field.n-selected': '{count} selected',
  'filter.modal.custom-field.none-available': 'No values available',
  'settings.general.analytics-date-basis': 'Base de data para análises',
  'settings.general.analytics-date-basis-desc':
    'Melhor para swing traders. Usa a data de entrada ou a data de saída final nas análises. O modo por data de saída conta apenas operações fechadas e exige data de saída para operações com PnL direto.',
  'settings.general.analytics-date-basis-aria':
    'Selecionar base de data para análises',
  'settings.general.analytics-date-basis-entry': 'Data de entrada',
  'settings.general.analytics-date-basis-exit': 'Data de saída',
  'settings.general.analytics-date-basis-changed':
    'Base de data para análises alterada para {basis}',
  'trade.metadata.broker-comment': 'Comentário da corretora',
  'tradelog.column.mtComment': 'Comentário MT',
  'tradelog.tooltip.mtComment': 'Comentário MT:',
  
  'settings.general.break-even-threshold-mode': 'Break-even Threshold Type',
  'settings.general.break-even-threshold-mode-desc':
    "Choose whether break-even is determined by a fixed P&L range or by a percentage of each trade account's current balance.",
  'settings.general.break-even-mode-fixed': 'Fixed amount range',
  'settings.general.break-even-mode-percent':
    'Percentage of current account balance',
  'settings.general.break-even-percent': 'Break-even Percentage',
  'settings.general.break-even-percent-desc':
    'Symmetric threshold around zero (±X% of current account balance). Trades without a resolvable account balance are excluded from win/loss stats.',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'Break-even percentage of current account balance',
  'widget.directional-drawdown.name': 'Directional Realized Drawdown',
  'widget.directional-drawdown.description':
    'Separate long and short closed-trade drawdown amount curves',

  'widget.long-drawdown.name': 'Long Drawdown',
  'widget.long-drawdown.description':
    'Closed-trade drawdown amount curve for long trades only',
  'widget.short-drawdown.name': 'Short Drawdown',
  'widget.short-drawdown.description':
    'Closed-trade drawdown amount curve for short trades only',
  'widget.directional-drawdown.title.long': 'Long Drawdown',
  'widget.directional-drawdown.title.short': 'Short Drawdown',
  'widget.directional-drawdown.empty.not-enough':
    'Not enough closed trades for directional analysis',
  'widget.directional-drawdown.empty.no-closed':
    'No closed directional trades for this period',
  'widget.directional-drawdown.empty.no-long':
    'No long closed trades for this period',
  'widget.directional-drawdown.empty.no-short':
    'No short closed trades for this period',
  'widget.directionalDrawdownChart.name': 'Directional Realized Drawdown',
  'widget.directionalDrawdownChart.description':
    'Displays separate long and short closed-trade drawdown amount curves',

  'widget.longDrawdownChart.name': 'Long Drawdown',
  'widget.longDrawdownChart.description':
    'Displays the closed-trade drawdown amount curve for long trades only',
  'widget.shortDrawdownChart.name': 'Short Drawdown',
  'widget.shortDrawdownChart.description':
    'Displays the closed-trade drawdown amount curve for short trades only',
  'widget.drawdownStats.name': 'Realized Drawdown Stats',
  'widget.drawdownStats.description': 'Realized drawdown and recovery stats',
  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',

  'guide.skip-guide': 'Skip Guide',
  'settings.general.data-management': 'Gerenciamento de Dados & Privacidade',

  'settings.general.display-privacy-section': 'Exibição & Privacidade',

  'settings.general.privacy-mode': 'Modo de Privacidade',

  'settings.general.privacy-mode-desc':
    'Mascara valores sensíveis de trades, contas, preços e desempenho na interface sem alterar os dados salvos.',

  'settings.general.privacy-mode-aria': 'Alternar modo de privacidade',
  'settings.customization.options.field.default-event-notes':
    'Default event notes:',
  'settings.customization.options.placeholder.default-event-notes':
    'Notes to auto-fill when this event is selected',
  'widget.key-events.notes-label': 'Notes',
  'widget.key-events.default-notes-tooltip':
    'Default notes are managed in Settings → Customisation → Events. Selecting an event here will auto-fill its saved default notes.',
  'widget.previous-trading-day-context.name': 'Previous Trading Day Context',
  'widget.previous-trading-day-context.description':
    'Read-only context pulled from headings in the previous DRC',
  'widget.previous-trading-day-context.reference-label': 'Previous DRC',
  'widget.previous-trading-day-context.open-source': 'Open',
  'widget.previous-trading-day-context.image-alt-prefix': 'Previous DRC image',
  'widget.previous-trading-day-context.no-sections-configured':
    'Choose at least one section in the template settings.',
  'widget.previous-trading-day-context.preview-note':
    'Yesterday price swept liquidity, rejected from the weekly level, and closed back inside the planned range.',
  'widget.previous-trading-day-context.preview-bullet-two':
    'Main deviation: entered before confirmation on the first pullback.',
  'widget.previous-trading-day-context.preview-source':
    'Preview: previous DRC from the prior trading day',
  'widget.previous-trading-day-context.preview-bullet-one':
    'Daily bias matched the plan after the opening drive.',
  'widget.weekly-drc-context.name': 'Daily Reviews by Weekday',
  'widget.weekly-drc-context.description':
    'Show selected DRC sections for each day in the weekly review',
  'widget.weekly-drc-context.header-eyebrow': 'Weekly review',
  'widget.weekly-drc-context.header-title': 'Daily Reviews by Weekday',
  'widget.weekly-drc-context.image-alt-prefix': 'Weekly DRC image',
  'widget.weekly-drc-context.no-activity': 'No activity for this day.',
  'widget.weekly-drc-context.no-sections-configured':
    'Choose at least one DRC section in the template settings.',
  'widget.weekly-drc-context.current-week-not-found':
    'Current weekly review not found.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'Current weekly review date not found.',
  'widget.weekly-drc-context.load-error': 'Failed to load weekly DRC review.',
  'widget.weekly-drc-context.invalid-context':
    'Este widget está disponível apenas em revisões semanais',
  'templateEditor.widget.weekly-drc-day-label': 'Dia',
  'templateEditor.widget.weekly-drc-display-label': 'Exibição',
  'templateEditor.widget.weekly-drc-start-collapsed': 'Iniciar recolhido',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': 'Cartão',
  'templateEditor.widget.weekly-drc-style-accordion': 'Accordion',
  'templateEditor.widget.weekly-drc-default-expanded': 'Expanded by default',
  'templateEditor.widget.previous-context-sections-label':
    'Sections to include',
  'templateEditor.widget.previous-context-heading-label':
    'Previous DRC section heading',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Choose a heading',
  'templateEditor.widget.previous-context-add-section': '+ Add section',
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
  'dashboard.conversion.original-pnl': 'P&L original',
  'dashboard.conversion.converted-pnl': 'P&L convertido',
  'dashboard.conversion.details-label': 'Detalhes da conversão de moeda',
  'dashboard.conversion.requires-conversion':
    'Gráficos de P&L com várias moedas exigem conversão de câmbio.',
  'widget.stats.vs-prev': 'vs prev',
  'dashboard.metrics.past-30d': 'past 30d',
  'widget.stats.no-change': 'No change',
  'widget.stats.no-previous-data': 'No previous data',
  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',
  'chart.tooltip.account': 'Account',
  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'widget.account-breakdown.name': 'Account Breakdown',
  'widget.account-breakdown.description':
    'Compare performance across accounts in this review period',
  'widget.account-breakdown.empty': 'No closed trades for this period',
  'widget.account-breakdown.column.account': 'Account',
  'widget.account-breakdown.column.trades': 'Trades',
  'widget.account-breakdown.column.pnl': 'Net P&L',
  'widget.account-breakdown.column.win-rate': 'Win Rate',
  'widget.account-breakdown.column.profit-factor': 'Profit Factor',
  'widget.trade-table.column.account': 'Account',
  'widget.trade-table.unknown-account': 'Unknown Account',
  'trade-import.error.file-too-large':
    'Selected file exceeds the Trade Import size limit',
  'trade-import.error.file-type-unsupported':
    'Selected file type is not supported by Trade Import',
  'trade-import.error.broker-file-type-unsupported':
    'Selected broker does not support this file type',
  
  'quick-import.title': 'Quick Import',
  'quick-import.subtitle':
    'Use your favorite Trade Import setup to preview and import a file faster.',
  'quick-import.gate.sign-in':
    'Sign in to use Quick Import with your saved setup.',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
  'quick-import.message.needs-setup':
    'Choose a favorite broker or template in Trade Import before using Quick Import.',
  'quick-import.message.capabilities-failed':
    'Quick Import setup could not be loaded.',
  'quick-import.message.mapping-required':
    'This file needs column mapping. Open the full Trade Import flow to review mappings.',
  'quick-import.message.preview-failed':
    'This file needs review in the full Trade Import flow.',
  'quick-import.notice.consent-required':
    'Acknowledge processing before uploading.',
  'quick-import.consent':
    'I understand this file will be uploaded to Journalit servers for processing.',
  'quick-import.privacy-note':
    'Os arquivos são enviados aos servidores da Journalit para processamento e não são armazenados por padrão.',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',
  'quick-import.status.loading': 'Loading quick setup...',
  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
  'quick-import.summary.title': 'Ready to import',
  'quick-import.summary.trades': 'Preview trades',
  'quick-import.summary.to-import': 'To import',
  'quick-import.summary.duplicates': 'Duplicates',
  'quick-import.summary.failed': 'Needs review',
  'quick-import.complete.title': 'Import complete',
  'quick-import.complete.message':
    '{written} written, {duplicates} duplicates, {failed} need review.',
  'quick-import.action.open-full': 'Open full Trade Import',
  'quick-import.action.review-in-trade-import': 'Review in Trade Import',
  'quick-import.action.setup-in-trade-import': 'Set up in Trade Import',
  'quick-import.action.import': 'Import trades',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.sign-in':
    'Sign in is required before uploading broker exports for Trade Import.',
  'trade-import.gate.upgrade':
    'Trade Import is a Pro feature. Upgrade is required before uploading broker exports.',
  'trade-import.action.open-settings': 'Open settings',
  'trade-import.action.manage-subscription': 'Manage subscription',
  'trade-import.description':
    'Upload CSV, XLSX, XLS, HTML, or broker statements for backend-powered analysis and preview.',
  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': 'Broker',
  'trade-import.label.asset-type': 'Asset type',
  'trade-import.asset.stock': 'Stock',
  'trade-import.asset.options': 'Options',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.label.manual-mode': 'Manual mode',
  'trade-import.manual-mode.price-based': 'Price based',
  'trade-import.manual-mode.direct-pnl': 'Direct P&L',
  'trade-import.label.ai-mapping': 'Request AI mapping suggestions',
  'trade-import.privacy.copy':
    'Trade Import uploads the selected broker export to Journalit servers for processing. Broker exports may contain account identifiers, trade history, symbols, timestamps, prices, quantities, fees, balances, and P&L. For preview generation, Journalit also sends your selected account name, mapping/template choices, custom field definitions and saved options, and limited local open-trade context for IBKR open-position matching. Raw files are processed for this import and are not stored by default.',
  'trade-import.privacy.acknowledge':
    'I understand and want to upload this export for processing.',
  'trade-import.action.analyse': 'Analyse file',
  'trade-import.action.choose-file': 'Choose file',
  'trade-import.guide.prompt': 'Não sabe o que exportar?',
  'trade-import.guide.link': 'Ver guia da corretora',
  'trade-import.action.drop-file': 'Drop file to upload',
  'trade-import.analyse.detected':
    'Detected {fileType}. Headers and sample rows are returned by the backend.',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Sheet',
  'trade-import.label.header-row': 'Header row',
  'trade-import.placeholder.auto': 'Auto',
  'trade-import.label.date-format': 'Date format',
  'trade-import.mapping.unmapped': 'Unmapped',
  'trade-import.label.save-template': 'Save mapping template',
  'trade-import.placeholder.template-name': 'Template name',
  'trade-import.action.save-template': 'Save template',
  'trade-import.action.preview': 'Generate preview',
  'trade-import.preview.summary':
    '{previewCount} preview trades, {failedCount} failed rows, {incompleteCount} incomplete rows.',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Entry time',
  'trade-import.table.quantity': 'Quantity',
  'trade-import.table.message': 'Message',
  'trade-import.action.confirm': 'Confirm import',
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',
  'trade-import.preview.message.duplicate-in-file':
    'Duplicate in selected import file',
  'trade-import.preview.message.multiple-open-matches':
    'Multiple matching open trades found for close-only preview',
  'trade-import.preview.message.quantity-mismatch':
    'Matching open trade quantity differs from close-only preview',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
};

export default ptBR;
