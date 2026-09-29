
import type { Lang } from './en';

const ptBR: Partial<Lang> = {
  'command.share-note-as-image': 'Compartilhar a nota atual como imagem',
  'trade.share.copy-screenshot': 'Copiar captura do trade',
  'trade.share.copied': 'Captura do trade copiada para a área de transferência',
  'trade.share.failed': 'Não foi possível copiar a captura do trade',
  'trade.share.not-ready':
    'A nota do trade ainda está carregando. Tente novamente em instantes.',
  'share.review.action': 'Compartilhar cartão da revisão',
  'share.review.modal-title': 'Compartilhar revisão',
  'share.review.section.top': 'Início da nota',
  'share.review.select-all': 'Selecionar tudo',
  'share.review.clear': 'Limpar',
  'share.review.legend.widget': 'Widget',
  'share.review.legend.heading': 'Título e seu texto',
  'share.review.legend.media': 'Mídia',
  'share.review.legend.text': 'Texto',
  'share.review.copy': 'Copiar imagem',
  'settings.general.hide-dollar-amounts-in-shares':
    'Ocultar valores em dólares nas imagens compartilhadas',
  'settings.general.hide-dollar-amounts-in-shares-desc':
    'Com os múltiplos de R ativados, capturas de trades e cartões de revisão omitem risco, taxas, comissões e MAE/MFE em dólares.',
  'share.review.hide-dollar-amounts': 'Ocultar valores em dólares',
  'share.review.hide-dollar-amounts-hint':
    'Omite risco, taxas e outros valores em dólares.',
  'share.review.hide-dollar-amounts-needs-r':
    'Ative os múltiplos de R nas configurações para compartilhar sem valores em dólares.',
  'share.review.copied': 'Cartão copiado para a área de transferência',
  'share.review.failed': 'Não foi possível copiar o cartão',
  'trade.broker-synced-at': 'Corretora sincronizada {date}',
  'home.period.month': 'Mês',
  'home.period.quarter': 'Trimestre',
  'home.period.year': 'Ano',
  'home.period.lifetime': 'Todo o período',
  
  
  

  
  'command.add-trade': 'Adicionar Nova Operação',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Abrir Trade Import',

  
  'command.create-drc': 'Abrir DRC (Relatório Diário)',
  'command.create-weekly-review': 'Abrir Revisão Semanal',
  'command.create-monthly-review': 'Abrir Revisão Mensal',
  'command.create-quarterly-review': 'Abrir Revisão Trimestral',
  'command.create-yearly-review': 'Abrir Revisão Anual',

  
  'command.open-dashboard': 'Abrir painel',
  'command.open-account-dashboard': 'Abrir contas',
  'command.open-trade-log': 'Abrir Registro de Operações',
  'command.open-home': 'Abrir Página Inicial',
  'command.open-position-size-calculator':
    'Abrir calculadora de tamanho da posição',

  
  'navigation.items.nav-weekly': 'Revisão desta semana',
  'navigation.items.nav-monthly': 'Revisão deste mês',
  'navigation.items.nav-quarterly': 'Revisão deste trimestre',
  'navigation.items.nav-yearly': 'Revisão deste ano',

  
  'backend.cards.sync.cancel': 'Cancelar sincronização',

  
  'command.replay-onboarding': 'Repetir Fluxo de Integração',

  
  
  

  
  
  
  'onboarding.notice.trade-sync-open-failed':
    'Não foi possível abrir o Trade Sync. Tente novamente.',

  'command.open-release-notes': 'Ver notas de versão',

  
  'command.open-layout-builder': 'Abrir Construtor de Layout',

  
  
  
  'auth.title.already-logged-in': 'Already Logged In',
  'auth.desc.already-logged-in': 'You are already logged in{email}.',
  'auth.title.sign-in': 'Sign In to Journalit',
  'auth.label.email': 'Email Address',

  
  
  
  'form.section.trade-details': 'Detalhes da Operação',
  'form.section.trading-costs': 'Custos de Operação',
  'form.section.risk-management': 'Gestão de Risco',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': 'Análise e Tese',

  
  
  
  'form.tab.basic': 'Básico',
  'form.tab.details': 'Detalhes',
  'form.tab.advanced': 'Avançado',

  
  
  
  'form.import-shortcut.open': 'Abrir Importação de Trades',
  'form.layout.customize': 'Personalizar formulário',
  'form.layout.modal-title': 'Personalizar formulário de trade',
  'form.layout.settings-title': 'Layout do formulário de trade',

  'form.layout.input-mode': 'Modo de entrada',
  'form.layout.input-mode-prices': 'Preços',
  'form.layout.input-mode-pnl-risk': 'P&L + Risco',
  'form.layout.input-mode-prices-desc':
    'Registre preços de entrada e saída e deixe o Journalit calcular o P&L.',
  'form.layout.input-mode-pnl-risk-desc':
    'Registre diretamente o P&L do trade e o valor de risco. O Journalit calcula automaticamente o múltiplo R.',
  'form.layout.asset-type-mode': 'Tipo de ativo',
  'form.layout.asset-type-mode-show': 'Perguntar',
  'form.layout.asset-type-mode-fixed': 'Fixo',
  'form.layout.default-asset-type': 'Tipo de ativo padrão',
  'form.layout.active-fields': 'Blocos visíveis',
  'form.layout.available-fields': 'Blocos ocultos',
  'form.layout.active-fields-desc':
    'Arraste blocos para reordená-los. Remova o que você não usa.',
  'form.layout.available-fields-desc':
    'Adicione blocos ocultos de volta ao formulário quando precisar deles.',
  'form.layout.empty-active': 'Nenhum bloco opcional está visível.',
  'form.layout.all-active': 'Todos os blocos opcionais estão visíveis.',
  'form.layout.add-field-aria': 'Adicionar {field} ao formulário de trade',
  'form.layout.remove-field-aria': 'Ocultar {field} no formulário de trade',
  'form.layout.saved': 'Layout do formulário de trade salvo',
  'form.layout.item.trading-costs.commission': 'Comissão',
  'form.layout.item.import-shortcut': 'Atalho de importação',
  'form.layout.item.import-shortcut-desc':
    'Mostra um botão no rodapé que abre a Importação de Trades.',
  'form.layout.item.core-details': 'Detalhes principais da operação',
  'form.layout.item.core-details-desc':
    'Conta, instrumento, direção e entradas/saídas ficam primeiro.',
  'form.layout.item.asset-specific': 'Campos específicos do ativo',
  'form.layout.item.pnl-preview': 'Prévia de P&L',

  'form.layout.item.trade-currency': 'Moeda da operação / Taxa de câmbio',
  'form.layout.item.trade-currency-desc':
    'Registre uma operação em outra moeda com uma taxa de câmbio manual opcional.',
  'form.layout.item.exchange-desc':
    'Campo de bolsa para operações de ações e cripto.',
  'form.layout.item.direct-pnl-toggle-desc':
    'Alternar uma operação para informar o P&L total em vez dos preços de saída.',
  'form.layout.manual-fx-rate': 'Substituição da taxa de câmbio',
  'form.layout.result-r': 'Resultado em R',
  'form.layout.entry-time': 'Hora do trade',

  
  
  
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
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Target Price',
  'form.field.close-percent': 'Close %',
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
  'form.field.trade-currency': 'Moeda da operação',
  'form.field.fx-rate': 'Taxa de câmbio para {base}',
  'form.field.fx-rate-override':
    'Substituição da taxa de câmbio ({quote} → {base})',

  
  'form.forex.using-manual-rate': 'Usando taxa de câmbio manual',
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
  'form.placeholder.target-price': 'Target price',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': 'Risco planejado em moeda',
  'form.placeholder.fx-rate': '1 {currency} = ? {base} (vazio: taxa diária)',
  'form.placeholder.custom-tag': 'Digite uma tag e pressione Enter',
  'form.placeholder.thesis': 'Digite sua tese para esta operação...',

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
  'form.ideal-exit.title': 'Saídas ideais',

  'form.ideal-exit.price': 'Preço ideal',
  'form.ideal-exit.size': 'Tamanho',
  'form.ideal-exit.remove': 'Remover saída ideal',

  'form.ideal-exit.copy-actual': 'Copiar saídas reais',

  'form.ideal-exit.tooltip':
    'Registre o plano de saída retrospectivo que você gostaria de ter executado. Suporta saídas escalonadas para revisão.',
  'form.ideal-exit.empty': 'Ainda não há saídas ideais',
  
  
  
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

  'form.account-empty-state.title': 'Configure sua primeira conta',
  'form.account-empty-state.description':
    'As contas acompanham seu saldo para que o Journalit calcule retorno, risco e drawdown. Criar uma exige apenas um nome.',
  'form.account-empty-state.create-account': 'Criar Conta',
  'form.account-empty-state.submit-disabled':
    'Crie uma conta primeiro para salvar esta operação.',
  'form.empty.take-profits': 'No take profit targets yet',
  'form.action.add-take-profit': 'Add Take Profit',
  'form.action.remove-take-profit': 'Remove take profit',

  
  
  
  'button.save': 'Salvar',
  'button.cancel': 'Cancelar',
  'button.delete': 'Excluir',
  'button.update': 'Atualizar',
  'button.add': 'Adicionar',
  'button.create': 'Criar',
  'button.reset': 'Redefinir',

  'button.confirm': 'Confirmar',

  'button.add-trade': 'Adicionar Operação',
  'button.update-trade': 'Atualizar Operação',
  'button.save-changes': 'Salvar Alterações',
  'button.create-trade': 'Criar Operação',
  'button.delete-all': 'Excluir Tudo',
  'button.clear-all': 'Limpar Tudo',

  'button.cancel-reset': 'Cancelar Redefinição',
  'button.proceed-anyway': 'Prosseguir Mesmo Assim',
  'button.mark-reviewed': 'Marcar como Revisado',

  'button.learn-more': 'Saiba mais',
  'button.upload-image': 'Enviar mídia',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': 'EDITAR',
  'validation.fix-errors': 'Por favor, corrija os seguintes erros:',

  'validation.complete-required':
    'Por favor, preencha todos os campos obrigatórios',

  
  
  

  'notice.login-success': 'Login realizado com sucesso!',
  'notice.pro-access-ready': 'O acesso PRO está pronto.',

  'notice.logout-success': 'Desconectado com sucesso',
  'notice.hotkey-set': 'Atalho configurado: {hotkey}',
  'notice.ftp-created': 'Credenciais FTP criadas com sucesso',
  'notice.ftp-password-rotated':
    'Novas credenciais FTP foram geradas para este dispositivo. A sincronização FTP configurada em outros dispositivos (por exemplo, seu EA MetaTrader) deve ser atualizada com a nova senha.',
  'notice.ftp-reused':
    'Credenciais FTP existentes carregadas deste dispositivo. Se elas não funcionarem mais, use Redefinir senha.',
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

  'notice.custom-fields-imported':
    '{count} campos personalizados importados com sucesso',

  'notice.setups-added': 'Setups adicionados a {count} operações',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': 'Erros adicionados a {count} operações',

  
  
  
  'notice.error.open-journalit':
    'Falha ao abrir Journalit. Por favor, tente recarregar o Obsidian.',
  'notice.error.open-drc': 'Falha ao abrir DRC: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': 'Falha ao abrir Revisão Semanal: {error}',
  'notice.error.open-monthly-review': 'Falha ao abrir Revisão Mensal: {error}',
  'notice.error.open-quarterly-review':
    'Falha ao abrir Revisão Trimestral: {error}',
  'notice.error.open-yearly-review': 'Falha ao abrir Revisão Anual: {error}',

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

  
  
  

  'notice.info.settings-recovered':
    'Configurações foram recuperadas do backup. Algumas alterações recentes podem ter sido perdidas.',
  'notice.info.cannot-remove-locked':
    'Não é possível remover widgets bloqueados',

  
  
  
  'tradelog.title': 'Registro de Operações',
  'dashboard.guide.empty.intro.title': 'Welcome to your Dashboard',
  'dashboard.guide.empty.intro.description':
    'Your Dashboard becomes useful as soon as Journalit has trading history to analyse.',
  'dashboard.guide.empty.state.title': 'Bring your trading history with you',
  'dashboard.guide.empty.state.description':
    'Import previous trades to start with meaningful performance data, or add a trade manually if you are recording your first trades.',
  'dashboard.guide.main.intro.title': 'Este é o seu painel',
  'dashboard.guide.main.intro.description':
    'Use this page to track your performance, review your stats, and keep your most useful charts in one place.',
  'dashboard.guide.main.filters.title': 'Filters change the whole Dashboard',
  'dashboard.guide.main.filters.description':
    'Use os filtros quando quiser que todas as estatísticas e gráficos desta página sejam atualizados para outro período, conta, setup, tag ou tipo de operação. Você também pode excluir qualquer valor para deixar essas operações de fora.',
  'dashboard.guide.main.edit-layout.title':
    'Turn on edit mode to customise this page',
  'dashboard.guide.main.edit-layout.description':
    'Click Edit Layout to unlock moving, resizing, removing, and adding Dashboard widgets.',
  'dashboard.guide.main.open-widget-selector.title': 'Open Add Widget',
  'dashboard.guide.main.open-widget-selector.description':
    'Click Add Widget to add more charts and bring back widgets you removed earlier.',
  'dashboard.guide.main.widget-picker.title': 'Pick what you want to show',
  'dashboard.guide.main.widget-picker.description':
    'Este painel mostra uma prévia de cada gráfico e métrica. Clique em um para adicioná-lo; o que já está no seu Dashboard aparece em Em uso.',
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
  'home.guide.intro.title': 'Bem-vindo de volta',
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
    'Visualize e adicione widgets, restaure links rápidos ou adicione atalhos de contas e setups. Tudo o que já está no Início aparece em "Em uso", onde você pode removê-lo.',
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
    'Type in the search box to find a widget by name, description, or category, then choose it. You can also press Next and Journalit will choose the first result for you.',
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

  'trade-form.guide.customization-modal.title':
    'Adapte o formulário ao seu fluxo de trabalho',
  'trade-form.guide.customization-modal.description':
    'Aqui você pode mostrar, ocultar e reordenar blocos opcionais. Mantenha o formulário focado nos campos que você realmente usa.',
  'trade-form.guide.finish.title': 'Esse é o recurso de personalização',
  'trade-form.guide.finish.description':
    'Você pode voltar a este botão sempre que o formulário precisar combinar com outro fluxo de diário.',
  'tradelog.guide.empty.intro.title': 'Welcome to Trade Log',
  'tradelog.guide.empty.intro.description':
    'This page becomes your main place for browsing, sorting, and reviewing trades. Once you add trades, you will also get the full Trade Log tour.',
  'tradelog.guide.empty.state.title': 'No trading data available',
  'tradelog.guide.empty.state.description':
    'Import previous trades to explore your performance now, or record a new trade manually.',
  'tradelog.guide.intro.title': 'This is your Trade Log',
  'tradelog.guide.intro.description':
    'Use this page to review trades one by one, sort them, filter them, and make changes to many trades at once.',
  'tradelog.guide.view-selector.title':
    'Choose how you want to review your history',
  'tradelog.guide.view-selector.description':
    'Use this menu to switch between the full trade table and grouped time views like months, weeks, or days. Trades is the default, but grouped views are useful when you want to review by period.',
  'tradelog.guide.filters.title': 'Use filters to narrow the Trade Log',
  'tradelog.guide.filters.description':
    'Abra os filtros quando quiser revisar apenas certas contas, setups, tags, tipos de operação, status ou datas. Você também pode excluir qualquer valor para deixar essas operações de fora.',
  'tradelog.guide.sorting.title': 'Click column headers to sort the table',
  'tradelog.guide.sorting.description':
    'In Trades view, click a sortable column header to reorder the table. For example, click Net P&L to sort by your biggest win and biggest loss.',
  'tradelog.guide.multi-select.title': 'Turn on multi-select',
  'tradelog.guide.multi-select.description':
    'Click this button to select several trades at once. When multi-select is on, row clicks select trades instead of opening them.',
  'tradelog.guide.batch-actions.title': 'These are your batch actions',
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
  'tradelog.type.regular': 'Regular',
  'tradelog.type.missed': 'Perdida',
  'tradelog.type.backtest': 'Backtest',

  
  
  
  'dashboard.title': 'Painel',
  'dashboard.no-data': 'Nenhum dado de trading disponível',
  'dashboard.empty.import-action': 'Import existing trades',
  'dashboard.empty.manual-action': 'Add a trade manually',
  'dashboard.widgets.setup-performance.title': 'Desempenho por setups',
  'dashboard.widgets.setup-performance.description':
    'Barras que comparam o desempenho por setup',
  'dashboard.widgets.setup-performance.empty':
    'Nenhum dado de desempenho por setup',
  'dashboard.widgets.setup-performance.masked-label': 'Setup',
  'dashboard.widgets.tag-performance.title': 'Desempenho por tags',
  'dashboard.widgets.tag-performance.description':
    'Barras que comparam o desempenho por tag',
  'dashboard.widgets.tag-performance.empty':
    'Nenhum dado de desempenho por tag',
  'dashboard.widgets.tag-performance.masked-label': 'Tag',
  'dashboard.widgets.ticker-performance.title': 'Desempenho por ticker',
  'dashboard.widgets.ticker-performance.metric-aria': 'Métrica',
  'dashboard.widgets.ticker-performance.view-aria': 'Modo de visualização',
  'dashboard.widgets.ticker-performance.view.best-and-worst':
    'Melhores e piores',
  'dashboard.widgets.ticker-performance.view.best': 'Melhores 10',
  'dashboard.widgets.ticker-performance.view.worst': 'Piores 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'P&L total',
  'dashboard.widgets.ticker-performance.metric.total-r': 'R total',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'Taxa de vitória',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'Ticker: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': 'Operações: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Taxa de vitória: {rate} ({wins}V / {losses}D)',

  'dashboard.widgets.ticker-performance.empty':
    'Sem dados de desempenho por ticker',
  'dashboard.widgets.ticker-performance.empty-submessage':
    'Nenhuma operação fechada com ticker corresponde aos filtros atuais.',
  'dashboard.widgets.ticker-performance.masked-ticker': 'Ticker',
  'dashboard.widgets.ticker-performance.omitted-count': 'Omitidos: {count}',

  'widget.tickerPerformance.name': 'Desempenho por ticker',
  'widget.tickerPerformance.description':
    'Barras que comparam o desempenho por ticker',

  
  'dashboard.filter.accounts.all': 'Todas as contas',
  'dashboard.filter.accounts.n-selected': '{count} contas',
  'dashboard.filter.accounts.select-all': 'Selecionar tudo',

  'dashboard.filter.accounts.none-found': 'Nenhuma conta encontrada',

  

  
  
  
  'account.header.title': 'Conta: {name}',
  'account.header.back-to-dashboard': 'Voltar ao painel',
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
  'account.header.warning.trades-before-phase.one':
    '{count} operação encontrada antes do início da Fase 1',
  'account.header.warning.trades-before-phase.other':
    '{count} operações encontradas antes do início da Fase 1',
  'account.header.warning.earliest-trade-phase':
    'Operação mais antiga: {date}. Operações anteriores ao início da fase não contam para o desafio.',
  'account.header.notice.phase-start-updated':
    'Início da Fase 1 movido para {date}',
  'account.header.warning.earliest-trade':
    'Operação mais antiga: {date}. Isso pode causar cálculos de saldo incorretos.',
  'account.header.warning.fix-phase-start.aria': 'Corrigir início da Fase 1',
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

  'account.edit.modal.change-date.confirm': 'Atualizar Data de Criação',

  'account.edit.modal.change-balance.title': 'Alterar Saldo Inicial',
  'account.edit.modal.change-balance.message':
    'Você está prestes a alterar o saldo inicial de {oldBalance} para {newBalance}.',

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

  
  
  

  'view.dashboard': 'Painel',
  'view.trade-log': 'Registro de Operações',
  'view.account-dashboard': 'Contas',
  'view.layout-builder': 'Construtor de Layout',
  'view.csv-import': 'Trade Import',

  
  
  
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.history-ready': 'Your trading history is ready',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  
  

  'csv.errors.copy-report': 'Copiar relatório',

  
  
  

  

  
  
  
  'common.loading': 'Carregando...',
  'common.error': 'Erro',

  'common.warning': 'Aviso',
  'common.info': 'Informação',
  'common.yes': 'Sim',
  'common.no': 'Não',
  'common.ok': 'OK',

  'common.none': 'Nenhum',
  'common.all': 'Todos',
  'common.date': 'Data',

  'common.week': 'Semana',
  'common.month': 'Mês',
  'common.year': 'Ano',

  'common.min': 'Mín',
  'common.max': 'Máx',
  'common.profit': 'Lucro',

  'common.trade': 'Operação',
  'common.trades': 'Operações',
  'common.color.label': 'Cor',
  'common.color.default': 'Padrão',

  
  
  

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'Mapeamento Trade Import com IA',
  'settings.auth.feature.basic-tracking': 'Rastreamento básico',

  'settings.auth.feature.priority-support': 'Suporte Prioritário',

  
  
  
  
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description':
    'Checklist para configurar o Journalit e trades',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.account.title':
    'Configure sua conta de trading',
  'home.widget.getting-started.item.account.description':
    'As operações são registradas em uma conta que acompanha seu saldo. Sem ela, retorno e drawdown não podem ser calculados.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'Configurar conta',
  'home.widget.getting-started.item.create.title':
    'Bring in your trading history',
  'home.widget.getting-started.item.create.description':
    'Import existing trades, connect Trade Sync, or add your first trade manually.',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Open Trade Import',
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
  'home.widget.getting-started.item.sidebar.title':
    'Abrir a barra lateral de navegação',
  'home.widget.getting-started.item.sidebar.description':
    'Acesse rapidamente páginas, revisões, ferramentas e a busca do Journalit.',
  'home.widget.getting-started.item.sidebar.time': '10 s',
  'home.widget.getting-started.item.sidebar.cta': 'Abrir barra lateral',
  'home.quick-links.navigation-sidebar': 'Barra lateral de navegação',
  'notice.error.open-navigation-sidebar':
    'Não foi possível abrir a barra lateral de navegação. Tente novamente.',
  'navigation.setting.open': 'Abrir a barra lateral de navegação',
  'navigation.setting.open.desc':
    'Mostre-a agora e expanda a barra lateral do Obsidian se estiver recolhida.',
  'navigation.setting.open.button': 'Abrir barra lateral',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    'Ative o Trade Import, o Trade Sync e o Calendário Econômico.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',

  

  'premium.gate.cta.continue-pro': 'Continuar para o PRO',

  'premium.gate.cta.refresh': 'Refresh status',

  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description': 'Fills widget CSV export',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Open the Fills widget in TT and switch to Detail, Continuous, or Price with Detail view',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Important:',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker-guide.rithmic.step-1':
    'Abra o Order History no R | Trader Pro e filtre pelas ordens concluídas/executadas (Completed/Filled) da sua conta/data',
  'csv.broker-guide.rithmic.step-2':
    'Use Add/Remove Columns e confirme que as colunas Side, Symbol, Qty Filled, Avg Fill Price e Fill/Update Time estão visíveis',
  'csv.broker-guide.rithmic.warning.emphasis': 'Importante:',

  

  
  'dashboard.metrics.avgRR': 'RR Médio (Payoff)',
  'dashboard.metrics.sharpeRatio': 'Índice de Sharpe',
  'dashboard.metrics.avgRRRiskBased': 'RR Médio (baseado em R)',
  'dashboard.metrics.longestWinStreak': 'Melhor sequência',
  'dashboard.metrics.longestLossStreak': 'Pior sequência',
  'dashboard.sharpeRatio.tooltip.title': 'Índice de Sharpe',
  'dashboard.sharpeRatio.tooltip.formula':
    'Fórmula: P&L líquido médio dos trades fechados / desvio padrão amostral do P&L líquido dos trades fechados. A taxa livre de risco é 0 e o valor não é anualizado.',
  'dashboard.sharpeRatio.tooltip.coverage':
    'Calculado com {valid} de {total} trades fechados',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'Cobertura parcial: {valid} de {total} trades fechados têm P&L líquido finito.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'Requer pelo menos dois trades fechados com variabilidade de P&L diferente de zero.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'Este Índice de Sharpe é baseado em moedas mistas sem conversão FX e pode ser enganoso.',
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
  'metric.avgRR.description': 'Ganho médio dividido pela perda média',
  'metric.sharpeRatio.name': 'Índice de Sharpe',
  'metric.sharpeRatio.description':
    'P&L médio por operação vs sua volatilidade',
  'metric.avgRRRiskBased.name': 'RR Médio (baseado em R)',
  'metric.avgRRRiskBased.description':
    'R vencedor médio vs R perdedor (exige stop)',
  'metric.longestWinStreak.name': 'Melhor sequência',
  'metric.longestWinStreak.description': 'Maior sequência de ganhos seguidos',
  'metric.longestLossStreak.name': 'Pior sequência',
  'metric.longestLossStreak.description': 'Maior sequência de perdas seguidas',
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

  'widget.longDrawdownChart.name': 'Long Drawdown',

  'widget.shortDrawdownChart.name': 'Short Drawdown',

  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',

  'guide.skip-guide': 'Pular guia',
  'guide.step-count': '{count} etapas',
  'guide.step-position': 'Etapa {current} de {total}',
  'settings.general.data-management': 'Gerenciamento de Dados & Privacidade',

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

  'templateEditor.widget.weekly-drc-start-collapsed': 'Iniciar recolhido',
  'templateEditor.widget.weekly-drc-day-all': 'All days',

  'templateEditor.widget.previous-context-sections-label':
    'Sections to include',
  'templateEditor.widget.previous-context-heading-label':
    'Previous DRC section heading',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Choose a heading',
  'templateEditor.widget.previous-context-add-section': '+ Add section',

  'templateEditor.widget.previous-context-fallback-label':
    'Previous DRC fallback',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Nearest earlier DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Expected previous trading day only',
  'dashboard.conversion.original-pnl': 'P&L original',
  'dashboard.conversion.converted-pnl': 'P&L convertido',
  'dashboard.conversion.details-label': 'Detalhes da conversão de moeda',

  'widget.stats.vs-prev': 'vs prev',
  'common.r-missing.title': 'Sem R para esta operação',
  'common.r-missing.trade':
    'Esta operação não tem valor de risco, então seu resultado não pode ser mostrado em R.',
  'common.r-missing.fix':
    'Adicione um valor de risco ou defina um valor de risco padrão nas Configurações.',
  'common.r-coverage.partial':
    'Com base em {valid} de {total} operações. Operações sem valor de risco não entram no R.',
  'common.r-coverage.none':
    'Nenhuma operação aqui tem valor de risco, então não há R para mostrar.',
  'dashboard.r-coverage.no-comparison':
    'Nenhuma variação exibida: o período de comparação não tem valor em R para esta métrica.',
  'dashboard.metrics.past-30d': 'past 30d',

  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'widget.tag-performance.name': 'Desempenho por tags',
  'widget.tag-performance.description':
    'Detalhamento do desempenho por tag de operação',
  'widget.table.header.tag': 'Tag',
  'widget.empty.no-tag-data': 'Nenhum dado de tag disponível para este período',
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
    'Entre ou crie uma conta gratuita do Journalit para visualizar arquivos no Trade Import. O Pro só é necessário quando você importar os trades.',
  'quick-import.gate.sign-in-cta': 'Entrar para visualizar grátis',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
  'quick-import.gate.preview-free': 'Visualizar arquivo grátis',
  'quick-import.message.needs-setup':
    'Choose a favorite broker or template in Trade Import before using Quick Import.',
  'quick-import.message.capabilities-failed':
    'Quick Import setup could not be loaded.',
  'quick-import.message.mapping-required':
    'This file needs column mapping. Open the full Trade Import flow to review mappings.',
  'quick-import.message.preview-failed':
    'This file needs review in the full Trade Import flow.',

  'quick-import.privacy-note':
    'Os arquivos são enviados aos servidores da Journalit para processamento e não são armazenados por padrão.',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',

  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
  'quick-import.summary.title': 'Ready to import',

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
  'quick-import.action.import-count.one': 'Importar {count} trade',
  'quick-import.action.import-count.few': 'Importar {count} trades',
  'quick-import.action.import-count.many': 'Importar {count} trades',
  'quick-import.action.import-count.other': 'Importar {count} trades',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.open-failed': 'Unable to open Trade Import',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.notice.free-preview-rate-limited':
    'Limite de prévias gratuitas atingido. Ative o PRO ou tente novamente em cerca de {minutes} minutos.',
  'trade-import.notice.free-preview-storage-limit-reached':
    'O armazenamento de prévias gratuitas comporta até {limit} trades. Você tem {storedItems} armazenados e este arquivo adicionaria {requestedItems}. Aguarde uma prévia anterior expirar ou ative o PRO.',
  'trade-import.preview-error.guidance':
    'Verifique se todos os campos obrigatórios estão mapeados, se o formato de data selecionado corresponde ao arquivo e se as colunas numéricas contêm valores de trade válidos.',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': 'Trades',
  'trade-import.gate.brand-right': 'Importar',
  'trade-import.gate.sign-in.title':
    'Visualize seu histórico de trading grátis',
  'trade-import.gate.sign-in':
    'Entre ou crie uma conta gratuita do Journalit para analisar seu arquivo. O Pro só é necessário quando você importa os trades.',
  'trade-import.gate.sign-in.reassurance':
    'Seu arquivo é processado de forma privada e não é armazenado por padrão.',
  'trade-import.gate.sign-in.no-trial':
    'Não é necessário iniciar um teste do Pro para analisar e visualizar.',
  'trade-import.gate.sign-in.cta': 'Entrar para visualizar grátis',

  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': 'Fonte de exportação / plataforma',
  'trade-import.label.asset-type': 'Asset type',
  'trade-import.asset.stock': 'Stock',
  'trade-import.asset.options': 'Options',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.manual-mode.price-based':
    'Ordens ou execuções (agrupadas em operações)',
  'trade-import.manual-mode.direct-pnl': 'Uma operação por linha (usa o P/L)',
  'trade-import.label.ai-mapping': 'Request AI mapping suggestions',
  'trade-import.privacy.copy':
    'Trade Import uploads the selected broker export to Journalit servers for processing. Broker exports may contain account identifiers, trade history, symbols, timestamps, prices, quantities, fees, balances, and P&L. For preview generation, Journalit also sends your selected account name, mapping/template choices, custom field definitions and saved options, and limited local open-trade context for IBKR open-position matching. Raw files are processed for this import and are not stored by default. When AI mapping suggestions are on, the column headers and a few sample rows are also sent to an AI model to suggest column matches; untick the option to map columns yourself.',

  'trade-import.action.analyse': 'Analyse file',
  'trade-import.action.choose-file': 'Choose file',
  'trade-import.action.drop-file': 'Drop file to upload',
  'trade-import.analyse.detected':
    'Lemos seu arquivo {fileType}. Confira as linhas abaixo e depois associe cada coluna a um campo da operação.',
  'trade-import.table.screenshots': 'Capturas de tela',
  'trade-import.preview.screenshot-alt':
    'Captura de tela de {symbol} da linha {row} da planilha',
  'trade-import.preview.screenshots-more': 'mais {count}',
  'trade-import.preview.include-screenshots':
    'Adicionar as capturas de tela da planilha às operações ({count})',
  'trade-import.completion.screenshots-added':
    'Capturas de tela adicionadas da planilha: {count}',
  'trade-import.completion.screenshots-failed':
    'Capturas de tela da planilha que não puderam ser adicionadas: {count}',
  'trade-import.preview.import-anyway': 'Importar mesmo assim',
  'trade-import.preview.import-anyway-aria':
    'Importar {symbol} de {date} mesmo assim',
  'trade-import.preview.import-all-anyway':
    'Importar mesmo assim todas as {count} possíveis duplicatas',
  'csv.mapper.missing-fields.pnl-or-prices':
    'Ou associe Preço de entrada, Preço de saída e Quantidade para calcular o P/L pelos preços.',
  'trade-import.pnl-from-prices.title':
    'O P/L será calculado pelos seus preços',
  'trade-import.pnl-from-prices.body':
    'Não há coluna de P/L, então ele é calculado pelo preço de entrada, preço de saída e quantidade. Isso só fica certo com o tipo de ativo correto, então escolha o que são estas operações.',
  'trade-import.pnl-from-prices.contract-size':
    'Forex e futuros também precisam de uma coluna de tamanho do contrato para calcular o P/L. Sem ela, associe sua coluna de P/L.',
  'trade-import.diagnostic.choose-date-format': 'Escolher formato de data',
  'trade-import.date-question.ambiguous':
    'Suas datas são como {example}. Que data é essa?',
  'trade-import.date-question.mixed':
    'Algumas datas desta coluna usam outra ordem, como {example}. Qual ordem a maioria das suas datas usa?',
  'trade-import.date-question.mixed-note':
    'As linhas na outra ordem serão listadas para você corrigir no arquivo.',
  'quick-import.message.date-order':
    'Suas datas podem ser lidas de duas formas. Abra a importação completa para escolher.',
  'csv.date-format.eu-dot': 'UE com pontos: 25.12.2024 (dia.mês.ano)',
  'csv.date-format.ymd-dot': 'Ano primeiro com pontos: 2024.12.25',
  'onboarding.data-source.option.file.description':
    'Um diário que você mantém no Excel, Google Sheets ou CSV.',
  'onboarding.data-source.option.file.label': 'Na minha própria planilha',
  'trade-import.unmapped.title': 'Não importadas ({count})',
  'trade-import.unmapped.body':
    'Estas colunas não correspondem a nenhum campo do Journalit e ficarão de fora. Se algum campo servir, associe a coluna acima.',
  'trade-import.unmapped.keep': 'Manter como campo personalizado',
  'trade-import.unmapped.keep-aria': 'Manter {header} como campo personalizado',
  'trade-import.custom-field.title':
    'Manter “{header}” como campo personalizado',
  'trade-import.custom-field.hint':
    'Adiciona um campo às suas operações e o preenche com esta coluna. Se algum campo do Journalit já servir, associe a coluna a ele.',
  'trade-import.custom-field.name': 'Nome do campo',
  'trade-import.custom-field.type': 'Tipo de campo',
  'trade-import.custom-field.type.text': 'Texto',
  'trade-import.custom-field.type.number': 'Número',
  'trade-import.custom-field.type.dropdown': 'Lista de opções',
  'trade-import.custom-field.create': 'Criar campo',
  'trade-import.custom-field.error.reserved':
    'Este nome é usado por um campo nativo da operação. Escolha outro nome.',
  'trade-import.table.open-closed': 'Aberta/encerrada',
  'trade-import.status.open': 'Aberta',
  'trade-import.status.partially-closed': 'Encerrada parcialmente',
  'trade-import.status.closed': 'Encerrada',
  'trade-import.status.cancelled': 'Cancelada',
  'trade-import.diagnostic.column': 'Coluna: {columns}',
  'trade-import.diagnostic.unmap-column': 'Não importar esta coluna',
  'trade-import.diagnostic.edit-mapping': 'Alterar mapeamento',
  'trade-import.source.manual.tile': 'Planilha própria / outro arquivo',
  'trade-import.source.manual.title': 'Planilha própria ou outro arquivo',
  'csv.mapper.mode.title': 'O que é cada linha?',
  'csv.mapper.mode.help':
    'Planilhas de diário costumam ter uma operação encerrada por linha, com uma coluna de P/L. Históricos de ordens da corretora listam cada compra e venda em uma linha separada.',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Sheet',
  'trade-import.label.header-row': 'Header row',
  'trade-import.placeholder.auto': 'Auto',
  'trade-import.label.date-format': 'Date format',

  'trade-import.label.save-template': 'Save mapping template',
  'trade-import.placeholder.template-name': 'Template name',
  'trade-import.action.save-template': 'Save template',
  'trade-import.action.preview': 'Generate preview',

  'trade-import.preview.found.one': 'Encontramos {count} trade',
  'trade-import.preview.found.few': 'Encontramos {count} trades',
  'trade-import.preview.found.many': 'Encontramos {count} trades',
  'trade-import.preview.found.other': 'Encontramos {count} trades',
  'trade-import.preview.date-range': 'De {start} a {end}',
  'trade-import.preview.metric.symbols': 'Símbolos',
  'trade-import.preview.metric.ready': 'Prontos para importar',
  'trade-import.preview.metric.duplicates': 'Possíveis duplicados',
  'trade-import.preview.metric.attention': 'Precisam de atenção',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Entry time',
  'trade-import.table.quantity': 'Quantity',
  'trade-import.table.message': 'Message',
  'trade-import.status.new': 'Novo',
  'trade-import.status.already-imported': 'Já importado',
  'trade-import.status.other-account': 'Em outra conta',
  'trade-import.status.other-account.detail': 'Já importado em {account}',
  'trade-import.status.updates-existing': 'Atualiza um trade existente',
  'trade-import.status.possible-duplicate': 'Possível duplicado',
  'trade-import.status.needs-review': 'Precisa de revisão',
  'trade-import.status.duplicate-in-file': 'Duplicado no arquivo',
  'trade-import.status.invalid': 'Trade inválido',
  'trade-import.status.no-open-trade': 'Nenhum trade aberto para fechar',
  'trade-import.status.multiple-open-trades':
    'Vários trades abertos correspondem',
  'trade-import.status.quantity-mismatch': 'Quantidade divergente',
  'trade-import.server-deletion.deleted':
    'Trades excluídos do servidor do Journalit: {count}',
  'trade-import.server-deletion.kept':
    'Trades mantidos porque outra importação também os contém: {count}',
  'trade-import.server-deletion.blocked-broker-connected':
    'Esta conta é sincronizada por uma conexão com a corretora. Desconecte a corretora para excluir os dados dela.',
  'trade-import.server-deletion.blocked-broker-history':
    'Esta conta tem histórico de sincronização da corretora e não pode ser excluída aqui. Exclua importações individuais.',
  'trade-import.server-deletion.failed':
    'Não foi possível excluir do servidor do Journalit. Tente novamente.',
  'trade-import.server-deletion.notice':
    'Notas de trades movidas para a lixeira após uma exclusão no servidor: {count}',
  'trade-import.server-deletion.account.title': 'Excluir a conta do servidor?',
  'trade-import.server-deletion.account.message':
    'Isto exclui permanentemente "{account}" e seus trades importados ({count} no servidor) do servidor do Journalit e move as notas deles para a lixeira em todos os cofres sincronizados. Depois você pode importar os arquivos novamente.',
  'trade-import.server-deletion.account.confirm': 'Excluir do servidor',
  'trade-import.server-deletion.account.button': 'Excluir do servidor',
  'trade-import.history.title': 'Histórico de importações',
  'trade-import.completion.wrong-account': 'Importou na conta errada?',
  'trade-import.completion.undo-import': 'Desfazer esta importação',
  'trade-import.action.manage-imports': 'Gerenciar importações anteriores',
  'trade-sync.import.more-actions': 'Mais ações',
  'trade-import.history.loading': 'Carregando histórico de importações…',
  'trade-import.history.load-failed':
    'Não foi possível carregar o histórico de importações.',
  'trade-import.history.empty': 'Nenhuma importação ainda.',
  'trade-import.history.trades-on-server': '{count} no servidor',
  'trade-import.history.delete.title': 'Excluir esta importação?',
  'trade-import.history.delete.message':
    'Isto exclui permanentemente do servidor do Journalit os trades que esta importação adicionou a "{account}" ({count} no servidor) e move as notas deles para a lixeira em todos os cofres sincronizados. Trades que outra importação também contém são mantidos. Depois você pode importar o arquivo novamente.',
  'trade-import.history.delete.confirm': 'Excluir importação',
  'trade-import.history.load-more': 'Carregar mais',
  'account.edit.modal.delete.delete-server-trades':
    'Excluir também os trades importados do servidor do Journalit ({count} no servidor). As notas deles irão para a lixeira em todos os cofres sincronizados, mesmo que você as mantenha aqui.',
  'trade-import.preview.other-account.message':
    'Já estão em {account} ({count}), então serão ignorados.',
  'trade-import.preview.other-account.import-instead': 'Importar em {account}',
  'trade-import.preview.other-account.undo-earlier':
    'Desfazer a importação anterior',
  'trade-import.action.confirm': 'Confirm import',
  'trade-import.action.activate-pro.one':
    'Ativar o PRO para importar {count} trade',
  'trade-import.action.activate-pro.few':
    'Ativar o PRO para importar {count} trades',
  'trade-import.action.activate-pro.many':
    'Ativar o PRO para importar {count} trades',
  'trade-import.action.activate-pro.other':
    'Ativar o PRO para importar {count} trades',
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',

  
  'command.open-setups': 'Abrir setups',
  'setups.create.title': 'Create Setup',
  'setups.create.field.name': 'Setup Name',
  'setups.create.placeholder.name': 'Opening Drive',
  'setups.create.field.status': 'Status',
  'setups.create.field.direction': 'Direction',
  'setups.create.field.color': 'Cor',
  'setups.create.field.color-description':
    'Escolha uma cor para identificar este setup.',
  'setups.create.profile.heading': 'Campos preferenciais',
  'setups.create.profile.optional-label': '(Opcional)',
  'setups.create.field.sessions': 'Sessões',
  'setups.create.field.preferred-sessions-tooltip':
    'Gerencie essas sessões em Configurações → Diário → Modo de sessão.',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': 'Timeframes',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'Tickers',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
  'setups.create.direction.any': 'Not specified',
  'setups.create.direction.long': 'Long',
  'setups.create.direction.short': 'Short',
  'setups.create.direction.both': 'Both',
  'setups.create.field.linked-notes': 'Linked Notes',
  'setups.create.field.linked-notes-desc':
    'Attach existing notes that document the playbook for this setup.',
  'setups.create.linked-notes.empty': 'No notes linked yet.',
  'setups.create.linked-notes.add': '+ Link note',
  'setups.create.linked-notes.remove': 'Remove linked note',
  'setups.create.linked-notes.picker-title': 'Choose a playbook note',
  'setups.create.linked-notes.search': 'Search notes...',
  'setups.create.linked-notes.no-notes': 'No markdown notes found.',
  'setups.create.button.creating': 'Creating...',
  'setups.create.button.create': 'Create Setup',
  'setups.create.success': 'Setup "{name}" created successfully',
  'setups.create.error.name-required': 'Setup name is required',
  'setups.create.error.failed': 'Failed to create setup',
  'setups.edit.title': 'Edit Setup',
  'setups.edit.button.saving': 'Saving...',
  'setups.edit.button.save': 'Save Setup',
  'setups.edit.button.rename-and-update': 'Rename and update trades',
  'setups.edit.rename-warning.title': 'Rename setup and update trades',
  'setups.edit.rename-warning.message':
    'Renaming {oldName} to {newName} will update trade notes that use the old setup name.',
  'setups.edit.delete.button': 'Excluir setup',
  'setups.edit.delete.title': 'Excluir setup',
  'setups.edit.delete.confirm': 'Confirmar exclusão',
  'setups.edit.delete.warning':
    'A exclusão de "{name}" removerá o setup permanentemente e o retirará das operações vinculadas. Não é possível desfazer esta ação.',
  'setups.edit.delete.success': 'Setup "{name}" excluído',
  'setups.edit.delete.error': 'Não foi possível excluir o setup',
  'setups.edit.success': 'Setup "{name}" updated successfully',
  'setups.edit.error.failed': 'Failed to update setup',
  'setups.view.compare.empty-submessage':
    'Choose two setup cards from the overview to build a side-by-side report.',
  'setups.view.compare.reason.higher.total-r': 'R total maior',
  'setups.view.compare.reason.lower.total-r': 'R total menor',
  'setups.view.compare.reason.similar.total-r': 'R total semelhante',

  'setups.guide.create-new-setup.title': 'Criar novos setups',
  'setups.guide.create-new-setup.description':
    'Use Novo setup para adicionar outro playbook. O modal guia detalhes, notas vinculadas e regras.',
  'setups.guide.detail-intro.title': 'Esta é a página do setup',
  'setups.guide.detail-intro.description':
    'A página do setup foca um playbook com gráfico de performance, contexto, material de referência, ações e regras de execução.',
  'setups.guide.detail-actions.title': 'Ações do setup',
  'setups.guide.detail-actions.description':
    'Use estes botões para abrir trades relacionados ou editar detalhes, notas vinculadas, capturas e regras do playbook.',
  'setups.guide.empty.create-setup.title': 'Comece com Novo setup',
  'setups.guide.empty.create-setup.description':
    'Crie um setup primeiro. Depois que ele existir, este guia continuará com o fluxo normal.',

  'setups.guide.intro.title': 'Bem-vindo ao Setups',
  'setups.guide.intro.description':
    'Esta visão reúne playbooks de setup, trades vinculados, notas, capturas e regras em um só lugar.',
  'setups.guide.view-tabs.title': 'Alternar vistas de setups',
  'setups.guide.view-tabs.description':
    'Use estas abas para ir entre visão geral, pares e comparação quando houver setups suficientes.',
  'setups.guide.overview-chart.title': 'Ranking de performance',
  'setups.guide.overview-chart.description':
    'O gráfico classifica setups pela métrica escolhida. Use os controles no canto superior direito para trocar a métrica ou focar setups específicos.',
  'setups.guide.tag-filter.title': 'Filtrar setups',
  'setups.guide.tag-filter.description':
    'Filtre cartões, gráfico, pares e opções de comparação por tags ou direção. As seleções dentro de cada grupo usam OU; tags e direção são combinadas entre si.',
  'setups.guide.setup-cards.title': 'Cartões de setup',
  'setups.guide.setup-cards.description':
    'Os cartões resumem cada setup com métricas principais, status, último trade e tendência de performance.',
  'setups.guide.open-detail.title': 'Abrir página do setup',
  'setups.guide.open-detail.description':
    'Abra um cartão de setup para ver a página dedicada com gráfico, contexto, material do playbook e regras de execução.',
  'setups.guide.detail-performance.title': 'Performance detalhada',
  'setups.guide.detail-performance.description':
    'A aba Performance mostra o gráfico e métricas-chave ao longo do tempo, incluindo P&L, win rate, expectativa e drawdown.',
  'setups.guide.detail-context.title': 'Contexto do setup',
  'setups.guide.detail-context.description':
    'Este painel mantém saúde, itens de atenção, notas vinculadas e capturas à mão.',
  'setups.guide.detail-playbook.title': 'Notas do playbook',
  'setups.guide.detail-playbook.description':
    'A área de playbook pré-visualiza a nota vinculada. Pode ser Markdown, imagens, Excalidraw ou qualquer material de referência.',
  'setups.guide.detail-rules.title': 'Regras de execução',
  'setups.guide.detail-rules.description':
    'As regras capturam a checklist estruturada de condições, entradas, risco e erros a evitar.',
  'setups.guide.finish.title': 'Guia de Setups concluído',
  'setups.guide.finish.description':
    'Você viu as principais áreas: Visão geral, Pares, Comparar e a página individual do setup.',

  'setups.guide.pairs-mode.title': 'Abrir pares de setups',
  'setups.guide.pairs-mode.description':
    'Abra Pares para ver quais combinações têm trades compartilhados suficientes para comparar.',
  'setups.guide.pairs-chart.title': 'Ranking de pares',
  'setups.guide.pairs-chart.description':
    'O modo Pares destaca combinações que podem performar melhor ou pior juntas. Clique em uma barra para abrir insights mais profundos dessa combinação.',

  'setups.guide.compare-mode.title': 'Iniciar modo comparação',
  'setups.guide.compare-mode.description':
    'O modo comparação permite selecionar dois cartões de setup para revisão lado a lado.',
  'setups.guide.compare-select.title': 'Selecione dois setups',
  'setups.guide.compare-select.description':
    'Selecione dois cartões para abrir a página de comparação.',
  'setups.guide.compare-summary.title': 'Esta é a página de comparação',
  'setups.guide.compare-summary.description':
    'Esta página compara dois setups lado a lado. A linha superior mostra vencedor, vantagem de expectativa, confiança e por que um setup pode ter vantagem.',
  'setups.guide.compare-body.title': 'Linha de resumo da comparação',
  'setups.guide.compare-body.description':
    'A linha superior resume a comparação: vencedor, vantagem de expectativa, confiança e motivos da vantagem.',
  'setups.guide.compare-details.title': 'Detalhes da comparação',
  'setups.guide.compare-details.description':
    'Use a tabela de métricas e o gráfico acumulado para entender como os dois setups diferem.',
  'setups.guide.detail-execution-gap.title': 'Análise de lacuna de execução',
  'setups.guide.detail-execution-gap.description':
    'Quando há trades perdidos ou backtests, esta aba compara execução capturada com oportunidade perdida ou benchmark.',
  'setups.guide.back-to-overview.title': 'Voltar aos cartões',
  'setups.guide.back-to-overview.description':
    'Volte aos cartões quando terminar de comparar.',

  'setups.view.open-as-markdown': 'Open as Markdown',
  'setups.view.open-as-setup': 'Open as Journalit Setup',

  'setups.view.overview.mode.pairs': 'Pairs',
  'setups.view.pairs.summary-aria': 'Setup pairs summary',
  'setups.view.pairs.best': 'Best pair',
  'setups.view.pairs.worst': 'Worst pair',
  'setups.view.pairs.worst-short': 'Worst',
  'setups.view.pairs.empty': 'No setup pairs with 5+ trades yet.',
  'setups.view.pairs.empty-submessage':
    'Pairs appear after two setups share enough linked trades.',
  'setups.view.pairs.privacy':
    'Pair performance is hidden while Privacy Mode is on.',

  'setups.view.pairs.metric-aria': 'Pair metric',
  'setups.view.pairs.metric.edge': 'Pair edge',
  'setups.view.pairs.metric.edge-short': 'edge',
  'setups.view.pairs.metric.expectancy': 'Pair expectancy',

  'setups.view.pairs.together': 'Together',
  'setups.view.pairs.table.setup-pair': 'Setup pair',

  'setups.view.pairs.evidence': 'Evidence',
  'setups.view.pairs.edge-comparison': 'Edge comparison',
  'setups.view.pairs.edge-caption': 'Combined edge: {edge}',
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
  'setups.view.detail.performance.drawdown': 'Drawdown',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',
  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Edit linked notes',

  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': 'R ao vivo',
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
  'setups.view.detail.brief.no-screenshots': 'Nenhuma captura vinculada ainda.',
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
    'Restored {written} imported trades; {failed} failed.',
  'trade-import.restore.broker-label': 'Backend restore',
  'setups.view.loading': 'Loading setups…',
  'settings.general.copy-trading-pnl-toggled': 'Copy trading PnL is {status}',
  'setups.view.trade.unknown-instrument': 'Unknown instrument',
  'settings.session-mode.linked-resources-count': '{count} linked',
  'settings.session-mode.linked-resources-hide': 'Hide linked',
  'settings.session-mode.session-log-tags': 'Session log tags',
  'settings.session-mode.session-log-tags-desc':
    'Customize the tags available in the Session Mode composer and DRC session log.',
  'settings.session-mode.tag-label-placeholder': 'Tag name',
  'settings.session-mode.tag-short-label-placeholder': 'Short label',
  'settings.session-mode.tag-label-example': 'Trade',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Tag color',
  'settings.session-mode.tag-requires-resolution': 'Requires resolution',
  'settings.session-mode.tag-lesson': 'Lesson tag',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Entries with this tag are marked as follow-up items until you resolve them in the session log. Use it for notes that need review or action after the session.',
  'settings.session-mode.tag-lesson-tooltip':
    'Marks this tag as a learning entry. Lesson-tagged notes can be surfaced as lessons and are highlighted as learning moments in session log workflows.',
  'settings.session-mode.add-session-log-tag': 'Add session log tag',
  'settings.session-mode.reset-session-log-tags': 'Reset session log tags',
  'settings.session-mode.tag-color.blue': 'Blue',
  'settings.session-mode.tag-color.indigo': 'Indigo',
  'settings.session-mode.tag-color.purple': 'Purple',
  'settings.session-mode.tag-color.green': 'Green',
  'settings.session-mode.tag-color.pink': 'Pink',
  'settings.session-mode.tag-color.amber': 'Amber',
  'settings.session-mode.tag-color.red': 'Red',
  'settings.session-mode.tag-color.orange': 'Orange',
  'session-log.action.add-note': 'Add',
  'session-log.action.hide-composer': 'Hide composer',
  'session-log.filter.label': 'Filter session log',
  'session-log.filter.clear': 'Clear filter',
  'session-log.empty-filtered': 'No entries match this filter.',
  'media.viewer.mute-video': 'Silenciar vídeo',
  'media.viewer.unmute-video': 'Ativar som do vídeo',
  'media.viewer.volume': 'Volume',

  'imageGallery.empty.error.title': 'Galeria indisponível',
  'imageGallery.empty.no-images.title': 'Ainda não há mídia',
  'imageGallery.empty.no-images.description':
    'Imagens, GIFs, vídeos e links do YouTube anexados a trades ou notas de revisão aparecerão aqui automaticamente.',
  'imageGallery.empty.no-results.title':
    'Nenhuma mídia corresponde a estes filtros',
  'imageGallery.empty.no-results.description':
    'Tente limpar os filtros ativos ou ampliar o intervalo de datas para exibir mais itens da galeria.',
  'imageGallery.empty.no-source.title': 'Nenhuma mídia nesta fonte',
  'imageGallery.empty.no-source.description':
    'Esta fonte ainda não tem itens da galeria. Volte para toda a mídia ou escolha outra fonte.',
  'imageGallery.empty.action.clear-filters': 'Limpar filtros',
  'imageGallery.empty.action.show-all': 'Mostrar toda a mídia',
  'imageGallery.open-source': 'Abrir nota',
  'imageGallery.image-alt': 'Mídia de {source} em {date}',
  'imageGallery.annotation.reviewed': 'Revisada',
  'imageGallery.annotation.unreviewed': 'Não revisada',
  'imageGallery.annotation.tag': 'Tag',

  'imageGallery.annotation.editor-title': 'Anotar mídia',
  'imageGallery.annotation.editor-title-with-file': 'Anotar {fileName}',
  'imageGallery.annotation.tags': 'Tags',
  'imageGallery.annotation.tags-placeholder': 'Rompimento, Setup A+, Erro',
  'imageGallery.annotation.notes': 'Notas',
  'imageGallery.annotation.notes-placeholder':
    'O que seu eu do futuro deve aprender com este gráfico?',
  'imageGallery.annotation.error.save-failed':
    'Não foi possível salvar a anotação da mídia.',
  'imageGallery.annotation.error.load-failed':
    'Não foi possível carregar a anotação da mídia.',
  'imageGallery.annotation.saving': 'Salvando...',
  'command.replay-current-view-guide': 'Repetir guia da visualização atual',

  
  
  
  'tradelog.guide.switch-to-gallery.title': 'Mudar de trades para a Galeria',
  'tradelog.guide.switch-to-gallery.description':
    'Use este seletor de modo para alternar entre o Trade Log normal e a Galeria. Clique em Galeria para continuar o tour com suas imagens, GIFs, vídeos e links do YouTube.',

  'tradelog.guide.gallery-source-sort.title':
    'Escolha a fonte e a ordem das mídias',
  'tradelog.guide.gallery-source-sort.description':
    'Use Fonte para focar em toda a mídia, anexos de trades ou mídia de notas de revisão. Use Ordenar para revisar primeiro os trades mais novos, antigos, melhores ou piores.',
  'tradelog.guide.gallery-size.title': 'Ajuste o tamanho da prévia',
  'tradelog.guide.gallery-size.description':
    'Use estes botões de tamanho para alternar entre varredura compacta e prévias maiores dos gráficos sem cortar detalhes importantes.',
  'tradelog.guide.gallery-filters.title': 'Filtre a galeria pelo mesmo ponto',
  'tradelog.guide.gallery-filters.description':
    'O menu de filtros funciona da mesma forma aqui. No modo Galeria, ele também tem uma seção Galeria com filtros de mídia, como status de anotação e tags de mídia.',
  'tradelog.guide.gallery-grid.title': 'Abra mídias para revisar de perto',
  'tradelog.guide.gallery-grid.description':
    'Cada cartão mantém a mídia livre enquanto mostra contexto compacto do trade e da revisão. Clique em qualquer cartão para abrir o primeiro item em tela cheia.',
  'tradelog.guide.gallery-fullscreen-actions.title':
    'Anote mídias em tela cheia',
  'tradelog.guide.gallery-fullscreen-actions.description':
    'Use Tag para adicionar tags e notas no nível da mídia enquanto o item está grande o suficiente para inspeção. Abrir nota leva você de volta ao trade ou revisão de origem.',
  'tradelog.guide.gallery-open-annotation.title': 'Abra o painel de anotação',
  'tradelog.guide.gallery-open-annotation.description':
    'Clique em Tag para anotar esta mídia específica. Tags e notas de mídia descrevem o anexo, não o trade inteiro.',
  'tradelog.guide.gallery-annotation-panel.title':
    'Adicione tags e notas de mídia',
  'tradelog.guide.gallery-annotation-panel.description':
    'Use tags de mídia para ideias específicas do gráfico, como varredura de liquidez ou rompimento falho, e notas para o contexto de estrutura de mercado que deseja lembrar.',
  'tradelog.guide.gallery-finish.title':
    'Agora você conhece os dois modos do Trade Log',
  'tradelog.guide.gallery-finish.description':
    'Use Trades quando precisar da tabela e das ferramentas em lote. Use a Galeria quando quiser revisar imagens, GIFs, vídeos, links do YouTube e anotações em todo o diário.',
  'account.prop-challenge.prefill.heading-link': 'Prefill from your firm',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} more, rules prefilled with PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, rules prefilled with PRO',
  'account.prop-challenge.prefill.match':
    'We have {firm}: {count} challenges with rules ready',
  'account.prop-challenge.rules.empty':
    'Nenhuma regra adicionada. Use Adicionar regra para definir esta fase.',
  'trade.validation.fx-rate-number':
    'A taxa de câmbio deve ser um número válido.',
  'trade.validation.fx-rate-positive':
    'A taxa de câmbio deve ser maior que zero.',
  'dashboard.conversion.using-manual-rate':
    'Usando taxa de câmbio manual para {count} {tradeLabel}',
  'dashboard.conversion.partial-warning':
    '⚠ Custos/risco em {currencies} não puderam ser convertidos e foram excluídos',
  'trade-sync.providers.title': 'Sincronização de trades',

  'trade-sync.tradovate.pending-acks': '{count} ACK(s) locais pendentes',

  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Sincronize as operações da Rithmic na nuvem e projete-as neste cofre.',
  'trade-sync.rithmic.plugin-sync-description':
    'Conecte a Rithmic no Journalit.co e sincronize aqui para gravar sua atividade mais recente da Rithmic neste cofre.',
  'trade-sync.rithmic.status-failed':
    'Não foi possível carregar o status da Rithmic.',
  'trade-sync.rithmic.status.connecting': 'Conectando',
  'trade-sync.rithmic.status.paused': 'Pausado',
  'trade-sync.rithmic.status.waiting-for-accounts': 'Aguardando contas',
  'trade-sync.rithmic.status.reauthorization-required':
    'Reautorização necessária no Journalit.co',
  'trade-sync.rithmic.status.error': 'Erro de conexão',
  'trade-sync.rithmic.no-connections':
    'Conecte uma conta Rithmic no Journalit.co para sincronizá-la aqui.',
  'trade-sync.rithmic.connect': 'Conectar',
  'trade-sync.rithmic.manage': 'Gerenciar no Journalit.co',
  'trade-sync.rithmic.system': 'Sistema Rithmic',
  'trade-sync.rithmic.accounts': 'Contas',
  'trade-sync.rithmic.last-sync': 'Última sincronização',
  'trade-sync.rithmic.never': 'Nunca',
  'trade-sync.rithmic.job.running': 'Sincronização em andamento…',
  'trade-sync.rithmic.job.last': 'Último trabalho: {status}',
  'trade-sync.job.status.queued': 'Na fila',
  'trade-sync.job.status.running': 'Em execução',
  'trade-sync.job.status.succeeded': 'Concluído',
  'trade-sync.job.status.partial': 'Parcial',
  'trade-sync.job.status.failed': 'Falhou',
  'trade-sync.job.status.cancelled': 'Cancelado',
  'trade-sync.job.status.unknown': 'Desconhecido',
  'trade-sync.rithmic.sync-to-vault': 'Sincronizar',
  'trade-sync.rithmic.syncing': 'Sincronizando…',
  'trade-sync.rithmic.mapping-required':
    'Escolha uma conta local do cofre para cada conta Rithmic sincronizada.',
  'trade-sync.rithmic.sync-complete-connection':
    'Sincronização de {connection} concluída.',
  'trade-sync.rithmic.sync-partial-connection':
    'Sincronização de {connection} concluída com problemas.',
  'trade-sync.rithmic.sync-all': 'Sincronizar tudo',
  'trade-sync.rithmic.sync-all-complete':
    'Sincronizadas {succeeded} de {total} conexões Rithmic.',
  'trade-sync.rithmic.sync-all-partial':
    'Sincronizadas {succeeded} de {total} conexões Rithmic. Revise as conexões com problemas.',
  'trade-sync.rithmic.error.session-conflict':
    'A Rithmic permite apenas uma sessão ativa. Feche o R|Trader, o NinjaTrader ou qualquer outra plataforma que use este login Rithmic.',
  'trade-sync.rithmic.error.auto-retry':
    'O Journalit tenta novamente de forma automática.',
  'trade-sync.rithmic.error.invalid-credentials':
    'A Rithmic recusou as credenciais salvas. Atualize-as no Journalit.co e tente novamente.',
  'trade-sync.rithmic.error.agreements-required':
    'A Rithmic exige a assinatura dos acordos de dados de mercado no R|Trader. Assine-os e tente novamente.',
  'trade-sync.rithmic.error.disabled':
    'A sincronização da Rithmic está desativada para esta conexão. Gerencie-a no Journalit.co.',
  'trade-sync.rithmic.error.sync-failed':
    'A sincronização da Rithmic falhou. Revise a conexão no Journalit.co e tente novamente.',
  'trade-sync.broker.mapping-unsaved-hint':
    'O mapeamento é salvo ao sincronizar.',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'Alterações de conta não salvas. Sincronize essa conexão para salvá-las.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    'Escolha primeiro uma conta do Journalit para cada conta que você sincroniza.',
  'trade-sync.broker.sync-all-blocked.running-job':
    'Uma sincronização já está em andamento.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'Nenhuma conexão está pronta para sincronizar.',
  'trade-sync.rithmic.connect-another': 'Conectar outra conta Rithmic',
  'trade-sync.rithmic.error.sync-failed-detail':
    'A sincronização da Rithmic falhou: {message}',
  'notice.error.canonical-trade-type-change':
    'Trades sincronizados com a corretora não podem ser alterados para outro tipo de trade.',
  'trade-sync.import.account.conflict-repair':
    'Foram encontradas notas com canonicalTradeId duplicado. Mantenha uma nota e remova canonicalTradeId da duplicada ou exclua essa nota. Renomear o arquivo não corrige o conflito.',
  'setups.create.field.tags': 'Tags',
  'setups.create.placeholder.tags': 'Momentum, Rompimento, Manhã',
  'setups.view.overview.tag-filter.aria': 'Filtrar setups',
  'setups.view.overview.tag-filter.reset': 'Redefinir',
  'setups.view.overview.tag-filter.untagged': 'Sem tags',
  'setups.view.overview.tag-filter.empty':
    'Nenhum setup corresponde a estes filtros',
  'setups.view.overview.tag-filter.empty-submessage':
    'Ajuste ou limpe os filtros para mostrar mais setups.',

  'setups.view.tags': 'Tags',
  'setups.create.error.tag-save-failed':
    'Não foi possível salvar a tag na lista global de tags.',
  'settings.customization.options.confirm.remove-tag-message':
    'Excluir a tag global “{option}”? Ela será removida de todas as notas de trades e setups do Journalit.',
  'settings.customization.options.confirm.reset-tag-message':
    'Redefinir a lista global de tags e suas cores para os padrões? As tags já atribuídas às notas de trades e setups permanecerão nessas notas.',
  'home.mode.overview': 'Visão geral',
  'home.mode.dashboard': 'Painel',
  'home.mode.aria': 'Alternar modo da Página inicial',
  'home.filters.period': 'Período',
  'home.filters.trade-type': 'Tipo de operação',
  'home.filters.accounts': 'Contas',
  'home.filters.back': 'Voltar',
  'filter.reset': 'Redefinir filtros',
  'filter.menu.title': 'Filtrar por',
  'filter.menu.accounts': 'Contas',
  'filter.menu.tickers': 'Tickers',
  'filter.menu.setups': 'Setups',
  'filter.menu.tags': 'Tags',
  'filter.menu.mistakes': 'Erros',
  'filter.menu.trade-type': 'Tipo de trade',
  'filter.menu.status': 'Status',
  'filter.menu.direction': 'Direção',
  'filter.menu.review-status': 'Status de revisão',
  'filter.menu.status.cancelled': 'Cancelado',
  'filter.menu.included-count': '{count} incluídos',
  'filter.menu.excluded-count': '{count} excluídos',
  'filter.menu.search': 'Buscar',
  'filter.menu.no-matches': 'Nenhum resultado',
  'filter.menu.no-options': 'Ainda não há nada para filtrar',
  'filter.menu.clear': 'Limpar',
  'filter.menu.match.label': 'Correspondência',
  'filter.menu.match.any': 'Qualquer um',
  'filter.menu.match.all': 'Todos',
  'filter.menu.match.only': 'Somente estes',
  'filter.menu.match.exact': 'Exatamente estes',
  'filter.menu.match.hint.any':
    'Trades com pelo menos um dos valores selecionados.',
  'filter.menu.match.hint.all':
    'Trades com todos os valores selecionados. Outros valores são permitidos.',
  'filter.menu.match.hint.only':
    'Trades cujos valores estão todos entre os selecionados.',
  'filter.menu.match.hint.exact':
    'Trades com exatamente os valores selecionados, nem mais nem menos.',
  'filter.menu.match.no-value-any-only': 'Somente com “Qualquer um”',
  'filter.menu.exclude-value': 'Excluir {label}',
  'filter.menu.match.badge.all': 'Todos',
  'filter.menu.match.badge.only': 'Somente',
  'filter.menu.match.badge.exact': 'Exato',
  'home.guide.modes.title': 'Mais uma coisa: o Painel',
  'home.guide.modes.description':
    'A Visão geral e o Painel compartilham esta página. Mude para o Painel agora para continuar com um breve tour pelas suas estatísticas de desempenho.',
  'home.guide.whats-new.mode.title': 'Uma Página inicial, dois modos',
  'home.guide.whats-new.mode.description':
    'Visão geral e Painel agora compartilham uma página. Alterne sem perder o layout nem a posição de rolagem.',
  'home.guide.whats-new.filters.title':
    'Filtros da Página inicial em um só lugar',
  'home.guide.whats-new.filters.description':
    'Abra o botão de filtro para escolher Período, Tipo de operação ou Contas em um menu compacto em camadas.',
  'home.guide.whats-new.done.title': 'Seu espaço de trabalho mantém o contexto',
  'home.guide.whats-new.done.description':
    'Use Visão geral para widgets pessoais e Painel para análises mais profundas. Cada modo mantém seus próprios filtros e layout.',
  'home.widget.current-streak.description':
    'Acompanhe sequências de operações e revisões',

  'home.widget.streak.kind.trade-outcome': 'Resultados das operações',
  'home.widget.streak.kind.trade-review': 'Revisões de operações',
  'home.widget.streak.kind.drc-review': 'Revisões DRC',
  'home.widget.streak.kind.weekly-review': 'Revisões semanais',
  'home.widget.streak.kind.monthly-review': 'Revisões mensais',
  'home.widget.streak.configure': 'Escolher tipo de sequência',
  'home.widget.streak.configure-aria': 'Configurar sequência de {kind}',
  'home.widget.streak.no-review-streak': 'nenhuma sequência de revisões ativa',
  'home.widget.streak.start-reviewing':
    'comece a revisar para criar uma sequência',
  'home.widget.streak.keep-reviewing': 'continue revisando para manter',
  'home.widget.streak.reviewed-trades-in-a-row.one':
    'operação revisada em sequência',
  'home.widget.streak.reviewed-trades-in-a-row.few':
    'operações revisadas em sequência',
  'home.widget.streak.reviewed-trades-in-a-row.many':
    'operações revisadas em sequência',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'operações revisadas em sequência',
  'home.widget.streak.reviewed-days-in-a-row.one': 'dia revisado em sequência',
  'home.widget.streak.reviewed-days-in-a-row.few':
    'dias revisados em sequência',
  'home.widget.streak.reviewed-days-in-a-row.many':
    'dias revisados em sequência',
  'home.widget.streak.reviewed-days-in-a-row.other':
    'dias revisados em sequência',
  'home.widget.streak.reviewed-weeks-in-a-row.one':
    'semana revisada em sequência',
  'home.widget.streak.reviewed-weeks-in-a-row.few':
    'semanas revisadas em sequência',
  'home.widget.streak.reviewed-weeks-in-a-row.many':
    'semanas revisadas em sequência',
  'home.widget.streak.reviewed-weeks-in-a-row.other':
    'semanas revisadas em sequência',
  'home.widget.streak.reviewed-months-in-a-row.one':
    'mês revisado em sequência',
  'home.widget.streak.reviewed-months-in-a-row.few':
    'meses revisados em sequência',
  'home.widget.streak.reviewed-months-in-a-row.many':
    'meses revisados em sequência',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'meses revisados em sequência',
  'home.widget.streak.missed-trades.one':
    '{count} operação perdida desde sua última revisão',
  'home.widget.streak.missed-trades.few':
    '{count} operações perdidas desde sua última revisão',
  'home.widget.streak.missed-trades.many':
    '{count} operações perdidas desde sua última revisão',
  'home.widget.streak.missed-trades.other':
    '{count} operações perdidas desde sua última revisão',
  'home.widget.streak.missed-days.one':
    '{count} dia perdido desde sua última revisão',
  'home.widget.streak.missed-days.few':
    '{count} dias perdidos desde sua última revisão',
  'home.widget.streak.missed-days.many':
    '{count} dias perdidos desde sua última revisão',
  'home.widget.streak.missed-days.other':
    '{count} dias perdidos desde sua última revisão',
  'home.widget.streak.missed-weeks.one':
    '{count} semana perdida desde sua última revisão',
  'home.widget.streak.missed-weeks.few':
    '{count} semanas perdidas desde sua última revisão',
  'home.widget.streak.missed-weeks.many':
    '{count} semanas perdidas desde sua última revisão',
  'home.widget.streak.missed-weeks.other':
    '{count} semanas perdidas desde sua última revisão',
  'home.widget.streak.missed-months.one':
    '{count} mês perdido desde sua última revisão',
  'home.widget.streak.missed-months.few':
    '{count} meses perdidos desde sua última revisão',
  'home.widget.streak.missed-months.many':
    '{count} meses perdidos desde sua última revisão',
  'home.widget.streak.missed-months.other':
    '{count} meses perdidos desde sua última revisão',
  'account-dashboard.title': 'Contas',
  'home.quick-links.trading-dashboard': 'Painel',
  'home.quick-links.account-dashboard': 'Contas',
  'navigation.items.nav-dashboard': 'Painel',
  'navigation.items.nav-account-dashboard': 'Contas',

  'settings.general.home-background-dashboard':
    'Mostrar fundo também no Dashboard',
  'settings.general.home-background-dashboard-desc':
    'Usa a mesma imagem de fundo no modo Dashboard.',
  'settings.general.home-background-dashboard-aria':
    'Mostrar o fundo da Página inicial no Dashboard',
  'datepicker.placeholder.second': 'SS',
  'settings.general.show-seconds': 'Mostrar segundos nos horários da operação',
  'settings.general.show-seconds-desc':
    'Exibir segundos ao inserir os horários de entrada e saída.',
  'settings.general.show-seconds-aria':
    'Mostrar segundos nos horários da operação',
  'account.prop-challenge.summary.status.payout_ready': 'Payout ready',
  'account.prop-challenge.ribbon.passed': '{phase} aprovada',
  'account.prop-challenge.ribbon.failed': '{phase} reprovada',
  'account.prop-challenge.ribbon.action.advance': 'Avançar para {phase}',
  'account.prop-challenge.ribbon.action.advance-short': 'Avançar',
  'account.prop-challenge.ribbon.action.mark-passed': 'Marcar como aprovado',
  'account.prop-challenge.ribbon.action.archive': 'Arquivar',
  'account.prop-challenge.actions.stale':
    'Este desafio foi atualizado em outro lugar. Verifique e tente novamente.',
  'account.prop-challenge.confirm.reopen':
    'Reabrir {account}? O desafio “{challenge}” volta para {phase}.',
  'account.prop-challenge.confirm.fail':
    'Marcar {account} como reprovada? O desafio “{challenge}” termina em {phase}.',
  'account.prop-challenge.confirm.archive-failed':
    'Arquivar {account}? O desafio “{challenge}” foi reprovado. A conta vai para Arquivadas.',
  'account.prop-challenge.confirm.archive-passed':
    'Arquivar {account}? O desafio “{challenge}” foi aprovado. A conta vai para Arquivadas.',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → desafio aprovado',
  'account.prop-challenge.ribbon.action.record-payout': 'Registrar saque',
  'account.prop-challenge.ribbon.action.record-payout-short': 'Saque',
  'account.prop-challenge.payout.title': 'Payout readiness',
  'account.prop-challenge.payout.eligible': 'Payout ready',
  'account.prop-challenge.payout.available': 'Available now',
  'account.prop-challenge.payout.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.history': 'Payouts',
  'account.prop-challenge.payout.requirement.days': 'Trading days',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'Qualifying days',
  'account.prop-challenge.payout.requirement.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.requirement.consistency': 'Consistency',
  'account.prop-challenge.payout.requirement.minimum': 'Minimum available',
  'account.prop-challenge.payout.requirement.payouts': 'Payout allowance',
  'account.prop-challenge.payout.requirement.request-window': 'Request window',
  'account.prop-challenge.payout.timezone-invalid':
    'Não é um fuso horário conhecido.',
  'account.prop-challenge.payout.preview-amount': 'Preview payout amount',
  'account.prop-challenge.payout.you-receive': 'Estimated trader share',
  'account.prop-challenge.payout.balance-after': 'Balance after payout',
  'account.prop-challenge.payout.drawdown-floor': 'Drawdown floor after',
  'account.prop-challenge.payout.buffer-after': 'Room before breach',
  'account.prop-challenge.payout.request-not-allowed':
    'This amount is not currently eligible under the configured payout rules.',
  'account.prop-challenge.payout.immediate-breach':
    'This payout would leave the account at or below its drawdown floor.',
  'account.prop-challenge.payout.account-concludes':
    'This payout completes the configured simulated-funded payout cycle.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'This payout advances the account to its next configured stage.',
  'account.prop-challenge.payout.live-review-after-payout':
    'This payout makes the account eligible for live-account review.',
  'account.prop-challenge.payout.cycle-resets':
    'Payout progress resets after an approved payout.',
  'account.prop-challenge.payout.cycle-continues':
    'Payout progress continues after an approved payout.',
  'account.prop-challenge.payout.drawdown.unchanged':
    'The current drawdown floor remains in place.',
  'account.prop-challenge.payout.drawdown.lock_at_balance':
    'The drawdown floor locks after payout.',
  'account.prop-challenge.payout.drawdown.reset_from_starting_balance':
    'The account and drawdown limits reset after payout.',
  'account.prop-challenge.stage': 'Stage type',
  'account.prop-challenge.stage.evaluation': 'Evaluation',
  'account.prop-challenge.stage.sim-funded': 'Sim funded',
  'account.prop-challenge.stage.live-funded': 'Live funded',
  'account.prop-challenge.payout-rules.title': 'Payout rules',
  'account.prop-challenge.payout-rules.add': 'Add payout rules',
  'account.prop-challenge.payout-rules.remove': 'Remove payout rules',
  'account.prop-challenge.payout-rules.cycle': 'Eligibility cycle',
  'account.prop-challenge.payout-rules.request-window': 'Request timing',
  'account.prop-challenge.payout-rules.request-window.anytime': 'Any day',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'Specific weekdays',
  'account.prop-challenge.payout-rules.request-window.time-zone': 'Time zone',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'Allowed request days',
  'account.prop-challenge.payout-rules.cycle.none': 'No waiting cycle',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'Trading days',
  'account.prop-challenge.payout-rules.cycle.qualifying-days':
    'Qualifying days',
  'account.prop-challenge.payout-rules.cycle.calendar-days': 'Calendar days',
  'account.prop-challenge.payout-rules.days': 'Required days',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'Minimum daily profit',
  'account.prop-challenge.payout-rules.anchor': 'Cycle starts from',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'Stage start',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'First trade',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Minimum cycle profit',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Maximum best-day share (%)',
  'account.prop-challenge.payout-rules.availability': 'Available profit',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Above starting balance',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Above balance floor',
  'account.prop-challenge.payout-rules.balance-floor': 'Balance floor',
  'account.prop-challenge.payout-rules.request-percent':
    'Withdrawable share (%)',
  'account.prop-challenge.payout-rules.minimum-request': 'Minimum request',
  'account.prop-challenge.payout-rules.maximum': 'Maximum request',
  'account.prop-challenge.payout-rules.maximum.none': 'No maximum',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Fixed maximum',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'Limite apenas no primeiro saque',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Maximum by payout number',
  'account.prop-challenge.payout-rules.maximum-amount': 'Maximum amount',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'Limite do primeiro saque',
  'account.prop-challenge.payout-rules.schedule': 'Amounts by payout number',
  'account.prop-challenge.payout-rules.profit-split': 'Trader profit share (%)',
  'account.prop-challenge.payout-rules.maximum-payouts': 'Maximum payouts',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'After final payout',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'Continue account',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'Conclude account',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'Advance to next stage',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'Eligible for live review',
  'account.prop-challenge.payout-rules.aftermath': 'After an approved payout',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'Deduct payout; keep drawdown floor',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'Deduct payout; lock drawdown floor',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'Reset account and drawdown',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'Drawdown floor after payout',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'First payout ignores minimum cycle profit',
  'account.prop-challenge.payout-rules.reset-cycle':
    'Reset eligibility cycle after payout',
  'account.prop-challenge.payout-rules.group.eligibility': 'Eligibility',
  'account.prop-challenge.payout-rules.group.availability': 'Available payout',
  'account.prop-challenge.payout-rules.group.terms': 'Payout terms',
  'account.prop-challenge.payout-rules.group.aftermath': 'After payout',
  'account.prop-challenge.payout.requirement.elapsed-hours': 'Elapsed time',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Minimum elapsed hours',

  'account.prop-challenge.ledger.help.open': 'Sobre {rule}',
  'account.prop-challenge.ledger.help.profit_target':
    'Faça a conta crescer nesse valor para passar da fase. Só operações fechadas contam.',
  'account.prop-challenge.ledger.help.profit_target.example':
    'Esta conta precisa de {target} de lucro: {current} até agora, {remaining} restantes.',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'Meta atingida: {current} de {target}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    'O máximo que o saldo pode cair abaixo do saldo inicial. O piso não se move.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'O piso desta conta é {floor}; o saldo deve permanecer acima. Restam {buffer} do limite de {limit}.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    'O piso segue o maior saldo de fechamento do dia e só sobe, até travar no nível de bloqueio da firma.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'Agora o piso é {floor} (melhor fechamento menos {limit}) e sobe a cada fechamento mais alto. Restam {buffer}.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    'O piso segue seu saldo mais alto a qualquer momento, incluindo lucro aberto. O Journalit só vê operações fechadas, então este piso segue o melhor saldo após cada fechamento; um pico atingido dentro de uma operação aberta não conta. Confira o número da empresa.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    'Agora o piso é {floor} (melhor saldo após operações fechadas menos {limit}). Restam {buffer}; o valor ao vivo da firma pode ser mais apertado.',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    'O máximo que você pode perder em um dia de trading. Atingir o limite falha a fase ou pausa até a próxima sessão, conforme a firma.',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    'Hoje: {used} perdidos do limite diário de {limit}, restam {left}.',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    'Só parte do lucro de cada dia conta para a meta. O excesso fica, mas não é contabilizado.',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    'Só {cap} do lucro de um dia são creditados; {excluded} acima do teto até agora não contam.',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'Um dia de trading com esse lucro ou mais torna a conta elegível para revisão de conta ao vivo.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    'Um dia de {trigger} ou mais qualifica; melhor dia até agora {bestDay}.',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    'Dias com pelo menos uma operação fechada. A fase não passa antes desse número, por mais rápido que a meta seja atingida.',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{current} de {target} dias de trading feitos, {remaining} restantes.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'Dias de trading que fecham no lucro diário mínimo da firma ou acima. Empate ou ganhos menores não contam.',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{current} de {target} dias fechados em {minimum} ou mais, {remaining} restantes.',
  'account.prop-challenge.ledger.help.consistency':
    'Seu melhor dia não pode passar desta fatia do lucro total da fase. Corrija ganhando mais nos outros dias, não perdendo.',
  'account.prop-challenge.ledger.help.consistency.example':
    'O melhor dia {bestDay} é {share} de {total} de lucro total; o lucro total precisa chegar a {goal} para ficar em {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'O melhor dia {bestDay} é {share} do lucro total, dentro do limite de {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'Ainda não há lucro, então não há melhor dia para comparar.',
  'account.prop-challenge.ledger.help.max_position_size':
    'O máximo de contratos permitido em uma posição. O Journalit verifica o tamanho de cada operação. Algumas firmas aumentam o limite conforme o lucro cresce.',
  'account.prop-challenge.ledger.help.max_position_size.example':
    'Até {maximum} contratos por operação agora; maior operação até aqui {current}.',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'Dias de trading no ciclo de saque atual. A contagem recomeça após um saque aprovado.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '{current} de {target} dias de trading neste ciclo, {remaining} restantes.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'Dias de trading deste ciclo que fecham no lucro diário mínimo da firma ou acima.',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '{current} de {target} dias de {minimum} ou mais neste ciclo, {remaining} restantes.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'O lucro desde o início do ciclo precisa atingir este valor antes de solicitar.',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '{current} ganhos neste ciclo dos {target} necessários.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'O saldo deve estar neste nível ou acima ao solicitar.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    'Saldo {current}; deve ser pelo menos {target}.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    'Depois do primeiro saque, cada ciclo novo precisa estar no lucro antes de outra solicitação.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'O lucro do ciclo é {current}; deve ser maior que zero.',
  'account.prop-challenge.ledger.help.payout.consistency':
    'Seu melhor dia não pode passar desta fatia do lucro do ciclo.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    'O melhor dia {bestDay} é {share} de {total} de lucro do ciclo; o lucro do ciclo precisa chegar a {goal} para ficar em {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'O melhor dia {bestDay} é {share} do lucro do ciclo, dentro do limite de {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'Ainda não há lucro no ciclo, então não há melhor dia para comparar.',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    'O menor saque que a firma aceita. O valor disponível precisa atingi-lo primeiro.',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '{current} disponíveis; a solicitação mínima da firma é {target}.',
  'account.prop-challenge.ledger.help.payout.payout_count':
    'Quantos saques esta etapa permite. Usar a cota conclui a etapa.',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '{current} de {target} saques usados nesta etapa.',
  'account.prop-challenge.ledger.help.payout.request_window':
    'Os pedidos só são aceitos nestes dias úteis, no fuso da firma.',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    'Hoje é {today}; as solicitações abrem em {days} ({timeZone}).',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'O tempo desde a primeira operação do ciclo precisa atingir isto antes de solicitar.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '{current} de {target} horas desde a primeira operação do ciclo.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'Dias qualificatórios de toda a fase funded, não só deste ciclo. Os saques liberam ao atingir.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '{current} de {target} dias qualificatórios em toda a fase.',
  
  'account.merge.challenge.move-earlier': 'Mover {account} para antes',
  'account.merge.challenge.move-later': 'Mover {account} para depois',
  'account.merge.warning.use-profile-balance': 'Usar o saldo da firma',
  'account.merge.warning.edit-phases': 'Editar fases',
  'account.merge.title': 'Configurar desafio',
  'account.merge.loading': 'Carregando...',
  'account.merge.step.accounts': 'Contas',
  'account.merge.step.phases': 'Fases',
  'account.merge.step.review': 'Revisar',
  'account.merge.accounts.title': 'Contas a mesclar',
  'account.merge.accounts.show-archived': 'Mostrar arquivadas',
  'account.merge.accounts.empty': 'Nenhuma conta elegível',
  'account.merge.target.title': 'Conta de destino',
  'account.merge.target.keep': 'Manter',
  'account.merge.target.new': 'Novo nome',
  'account.merge.phase.name': 'Nome da fase',
  'account.merge.phase.status': 'Situação',
  'account.merge.phase.started': 'Início',
  'account.merge.phase.completed': 'Fim',
  'account.merge.phase.no-rules': 'Nenhuma',
  'account.merge.review.notes': 'operações movidas',
  'account.merge.review.identities': 'contas de corretora',
  'account.merge.warning.trade-outside-window':
    'Operações fora da janela da fase',
  'account.merge.warning.identity-shared':
    'Identidade reivindicada por várias contas',
  'account.merge.warning.copy-trading-dropped':
    'Períodos de copy trading descartados',
  'account.merge.error.too-few-sources': 'Selecione pelo menos duas contas.',
  'account.merge.error.duplicate-source': 'Uma conta aparece duas vezes.',
  'account.merge.error.target-exists': 'Esse nome pertence a outra conta.',
  'account.merge.error.currency-mismatch': 'As contas usam moedas diferentes.',
  'account.merge.error.timeline-not-monotonic':
    'Os inícios de fase devem ser crescentes.',
  'account.merge.error.invalid-override': 'Verifique as datas desta fase.',
  'account.merge.error.source-missing':
    'Uma conta não tem configurações salvas.',
  'account.merge.error.unknown': 'Falha ao mesclar.',
  'account.merge.action.merge': 'Mesclar',
  'account.merge.action.undo': 'Desfazer',
  'account.merge.action.looks-right': 'Está certo',
  'account.merge.action.delete': 'Excluir contas antigas',
  'account.merge.notice.converted': 'Convertida em desafio',
  'account.merge.summary.intro': 'Confira se isto corresponde ao seu desafio:',
  'account.merge.summary.phases': 'Fases: {phases}',
  'account.merge.summary.current':
    'Agora em {phase} ({stage}), iniciada em {date}',
  'account.merge.summary.current-stage': 'Agora em {phase}, iniciada em {date}',
  'account.merge.summary.trades':
    '{counted} de {total} operações contam para o desafio',
  'account.merge.summary.trades-missing':
    '{counted} de {total} operações contam para o desafio. As demais ficam fora das datas de todas as fases.',
  'account.merge.summary.rules': 'Regras de {phase}: {rules}',
  'account.merge.summary.no-rules':
    'Ainda não há regras para {phase}. Adicione as regras da sua firma em Editar conta.',
  'account.merge.notice.title': 'Mesclada de {accounts}',
  'account.merge.notice.error': 'Falha na ação.',
  'account.merge.undo.title': 'Desfazer mesclagem',
  'account.merge.undo.message': 'Restaura as contas antigas e suas operações.',
  'account.merge.delete.title': 'Excluir contas antigas',
  'account.merge.delete.message':
    'Exclui as contas antigas arquivadas. Não é possível desfazer.',
  'command.open-legacy-challenge-onboarding': 'Configurar prop challenges',
  'account.merge.step.challenge': 'Desafio',
  'account.merge.action.convert': 'Converter',
  'account.merge.phase.apply-profile': 'Aplicar regras da firma',
  'account.merge.challenge.accounts': 'Contas',
  'account.merge.challenge.order-hint': 'Fase mais antiga primeiro',
  'account.merge.challenge.single-hint': 'Esta conta vira um desafio por si só',
  'account.merge.phase.broker-accounts.one': '{count} conta de corretora',
  'account.merge.phase.broker-accounts.few': '{count} contas de corretora',
  'account.merge.phase.broker-accounts.many': '{count} contas de corretora',
  'account.merge.phase.broker-accounts.other': '{count} contas de corretora',
  'account.merge.review.phase-count.one': 'fase',
  'account.merge.review.phase-count.few': 'fases',
  'account.merge.review.phase-count.many': 'fases',
  'account.merge.review.phase-count.other': 'fases',
  'account.merge.phase.pending': 'Pendente',
  'account.merge.phase.starts-after': 'Começa após passar em {phase}',
  'account.merge.phase.pending-rules': 'Regras: {rules}',
  'account.merge.review.archived': 'arquivadas',
  'account.merge.review.starts-after': 'Depois de {phase}',
  'account.merge.review.since': 'Desde {date}',
  'account.merge.sequence': 'Desafio {index} de {total}',
  'account.merge.warning.balance-differs':
    'O saldo inicial difere das regras da firma',
  'account.merge.error.profile-phase-mismatch':
    'Mais contas do que fases nas regras da firma',
  'account.merge.error.profile-currency-mismatch':
    'As regras da firma usam uma moeda diferente destas contas.',
  'account.merge.error.source-changed': 'Uma conta mudou. Revise a mesclagem.',
  'account.merge.error.multiple-active-phases':
    'Apenas a última conta pode continuar ativa.',
  'account.merge.error.copy-trading-overlap':
    'Os períodos de copy trading se sobrepõem. Encerre um primeiro.',
  'onboarding.legacy-challenge.legend':
    'Escolha o que acontece com cada conta anterior. Você tinha uma conta separada para cada fase, como Fase 1 e Financiada? Coloque-as no mesmo desafio para que virem uma única conta com fases.',
  'onboarding.legacy-challenge.assign.leave': 'Manter como conta normal',
  'onboarding.legacy-challenge.assign.own': 'Transformar em desafio',
  'onboarding.legacy-challenge.assign.group': 'Adicionar ao desafio {letter}',
  'onboarding.legacy-challenge.assign.new-group':
    'Combinar em um novo desafio…',
  'onboarding.legacy-challenge.action.continue': 'Continuar',
  'onboarding.legacy-challenge.action.continue-count': 'Configurar {count}',
  'guide.action-step.dismiss': 'Agora não',
  'guide.legacy-challenge.title':
    'Configure as contas de antes desta atualização',
  'guide.legacy-challenge.description':
    'Transforme contas de avaliação ou financiadas antigas em desafios. A configuração guia você pelas fases e datas e, no fim, mostra o que foi configurado para você conferir.',
  'guide.legacy-challenge.action': 'Configurar minhas contas',
  'onboarding.legacy-challenge.title': 'Prop challenges',
  'onboarding.legacy-challenge.action.skip': 'Pular',
  'onboarding.legacy-challenge.accounts.show-archived': 'Mostrar arquivadas',
  'onboarding.legacy-challenge.accounts.empty': 'Nenhuma conta para configurar',
  'onboarding.legacy-challenge.loading': 'Carregando...',
  'onboarding.legacy-challenge.suggested': 'Sugerido',
  'onboarding.legacy-challenge.row.aria': 'Ação para {account}',
  'onboarding.legacy-challenge.status.combined': 'Combinadas',
  'onboarding.legacy-challenge.status.converted': 'Convertida',
  'onboarding.legacy-challenge.entry.name': 'Prop challenges',
  'onboarding.legacy-challenge.entry.desc':
    'Combine ou converta contas existentes em challenges.',
  'onboarding.legacy-challenge.entry.action': 'Configurar',

  'view.home': 'Início',
  'common.lose': 'Perda',

  'dashboard.conversion.requires-conversion':
    'Gráficos de P&L com várias moedas exigem conversão de câmbio.',

  'form.layout.guide-trigger-label': 'Personalizar formulário',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'session-log.session-group.unplanned': 'Não planejada @ {time}',
  'session-mode.unplanned.name': 'Sessão não planejada',
  'session-mode.unplanned.start': 'Iniciar sessão não planejada',
  'session-mode.unplanned.stop': 'Encerrar sessão',
  'session-mode.unplanned.badge': 'Não planejada',
  'session-mode.unplanned.status.live':
    'Iniciada às {time} · {elapsed} decorridos',
  'session-mode.unplanned.ended.summary':
    'Sessão não planejada · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'Iniciar uma sessão não planejada',
  'session-mode.unplanned.modal.description':
    'Você está fora das suas janelas de sessão planejadas. Esta sessão será marcada como não planejada na sua revisão diária. Escreva por que está operando agora.',
  'session-mode.unplanned.modal.reason-label': 'Motivo',
  'session-mode.unplanned.modal.reason-placeholder':
    'ex.: FOMC às 14:00, perdi a sessão da manhã',
  'session-mode.unplanned.modal.reason-required':
    'Informe um motivo antes de iniciar.',
  'session-mode.unplanned.notice.started': 'Sessão não planejada iniciada.',
  'session-mode.unplanned.notice.stopped': 'Sessão não planejada encerrada.',
  'session-mode.unplanned.notice.blocked-live':
    'Já existe uma sessão em andamento.',
  'session-mode.unplanned.notice.none-running':
    'Nenhuma sessão não planejada em andamento.',
  'session-mode.unplanned.notice.failed':
    'Não foi possível atualizar a sessão não planejada. Verifique o console para detalhes.',
  'calendar.aria.open-daily-review': 'Abrir revisão diária de {date}',
  'calendar.aria.open-weekly-review': 'Abrir revisão semanal de {date}',
  'calendar.aria.open-monthly-review': 'Abrir revisão mensal de {date}',
  'calendar.aria.open-quarterly-review': 'Abrir revisão trimestral de {date}',
  'filter.menu.whats-new.open.title': 'Os filtros têm um novo menu',
  'filter.menu.whats-new.open.description':
    'Todos os filtros agora ficam em um menu em camadas, com duas novas formas de restringir suas operações. Abra-o para vê-las.',
  'filter.menu.whats-new.exclude.title': 'Exclua o que você não quer',
  'filter.menu.whats-new.exclude.description':
    'Cada valor tem um botão ⊘. Excluir um valor deixa de fora toda operação que o tenha, não importa com o que mais ela corresponda.',
  'filter.menu.whats-new.match.title':
    'Escolha como vários valores correspondem',
  'filter.menu.whats-new.match.description':
    'Ao escolher vários valores, decida se uma operação precisa de "Qualquer um", "Todos", "Somente estes" ou "Exatamente estes". Tags, setups, erros e campos personalizados têm essa mesma opção de Correspondência.',
  'filter.menu.whats-new.phases.title': 'Filtre por fase do desafio',
  'filter.menu.whats-new.phases.description':
    'Contas de mesa proprietária com mais de uma fase abrem uma lista das fases. Escolha fases específicas em vez da conta inteira.',
  'filter.menu.whats-new.done.title': 'Essas são as novidades dos filtros',
  'filter.menu.whats-new.done.description':
    'O mesmo menu funciona no Registro de Operações, no Painel, no Início, em Setups e nas revisões. As mudanças valem assim que você clica.',
};

export default ptBR;
