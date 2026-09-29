
import type { Lang } from './en';

const es: Lang = {
  'templateEditor.widget.session-log.hide-empty-outside':
    'Ocultar el registro fuera de sesión cuando esté vacío',
  'account.profiles.correction-title': 'Corrección del catálogo',
  'account.profiles.correction-source': 'Fuente de las reglas',
  'account.profiles.correction-period': 'Historial afectado',
  'account.profiles.correction-history': 'Historial de correcciones',
  'account.profiles.correction-stale':
    'El historial de la cuenta cambió. Vuelve a abrir esta revisión.',
  'account.profiles.correction-result': 'Evaluación de reglas estrictas',
  'account.profiles.no-hard-breach': 'Sin incumplimiento estricto detectado',
  'account.profiles.correction-consent': 'Recalcular historial',
  'account.profiles.correction-details': 'Detalles',
  'account.profiles.correction-apply': 'Aplicar corrección',
  'account.profiles.purchase-date': 'Fecha de compra original',
  'account.profiles.save-purchase': 'Guardar fecha de compra',
  'account.profiles.purchase-needed':
    'Introduce la fecha de compra original para comprobar estas condiciones.',
  'account.profiles.purchase-excluded':
    'Esta compra conserva sus condiciones actuales.',
  'account.profiles.purchase-uncertain':
    'La empresa debe confirmar si se aplica. Las reglas no cambian.',
  'account.profiles.initial-terms':
    'Estas condiciones rigen desde la compra o antes de esta fase. Revisa la configuración inicial por separado; el historial no cambia.',
  'account.profiles.announcement': 'Comunicado de la empresa',
  'account.profiles.firm-effective':
    'Fecha de vigencia confirmada por la empresa',
  'account.profiles.published-date': 'Fecha de vigencia publicada',
  'account.profiles.applicability-checking': 'Comprobando aplicabilidad…',
  'account.profiles.no-matching-phase':
    'No hay una fase equivalente en estas reglas de la firma.',
  'account.profiles.history-unchanged': 'El historial anterior no cambia.',
  'account.profiles.notice-title': 'Hay reglas de la firma actualizadas',
  'account.profiles.notice-description':
    'Las reglas publicadas por la firma difieren de las guardadas en esta cuenta. Las reglas de tu cuenta no han cambiado.',
  'account.profiles.review-changes': 'Revisar cambios',
  'account.profiles.check-failed':
    'No se pudieron comprobar las actualizaciones de reglas.',
  'account.profiles.retry': 'Reintentar',
  'account.profiles.source-changed':
    'Las reglas de la firma cambiaron mientras esta revisión estaba abierta. Vuelve a abrir la revisión antes de aplicarla.',
  'account.profiles.retain': 'Conservar reglas actuales',
  'account.profiles.retain-help':
    'Conserva las reglas de la cuenta y descarta estos cambios de origen. Los cambios posteriores podrán notificarse.',
  'account.profiles.comparison-help':
    'Solo se muestran diferencias. Expande una regla para examinar sus campos. Los ajustes locales pueden explicar las diferencias.',
  'account.profiles.added': 'Añadido',
  'account.profiles.removed': 'Eliminado',
  'account.profiles.changed': 'Modificado',
  'account.profiles.not-configured': 'Sin configurar',
  'account.profiles.no-rule-changes':
    'No hay diferencias de reglas ni de política de retiros para esta fase.',
  'account.profiles.accept': 'Aplicar actualización',
  'account.profiles.cached':
    'Usando reglas de la firma en caché; no se pudieron comprobar las más recientes.',
  'account.profiles.account-phase': 'Fase de la cuenta',
  'account.profiles.choose': 'Elige reglas guardadas',
  'account.profiles.completed':
    'Las fases completadas conservan sus reglas originales.',
  'account.profiles.confirm': 'Estas reglas se aplican a mi cuenta.',
  'account.profiles.currency':
    'Elige una moneda de cuenta que coincida con estas reglas antes de aplicarlas.',
  'account.profiles.current': 'Reglas actuales de la cuenta',
  'account.profiles.custom-transition':
    'Condiciones de transición personalizadas',
  'account.profiles.cycle-start': 'Inicio del ciclo de retiro (hora local)',
  'account.profiles.delete-help':
    '¿Eliminar estas reglas guardadas? Las cuentas que ya las usan no cambiarán.',
  'account.profiles.effective': 'Vigente desde (hora local)',
  'account.profiles.error':
    'No se pudieron guardar las reglas. Revisa los valores e inténtalo de nuevo.',
  'account.profiles.floor': 'Suelo de drawdown en la transición',
  'account.profiles.history': 'Historial de reglas',
  'account.profiles.history-help':
    'Las reglas anteriores se conservan. Usa Revisar actualización de reglas para cambiar una fase versionada; la edición directa está bloqueada para proteger el historial.',
  'account.profiles.incoming': 'Reglas entrantes de la firma',
  'account.profiles.independent':
    'Las reglas guardadas son locales de esta bóveda. Al aplicarlas se crea una copia independiente en la cuenta; guardar una nueva revisión nunca cambia las cuentas existentes.',
  'account.profiles.keep-help':
    'Las reglas marcadas conservan tus valores locales en lugar de la regla entrante de ese tipo. Desmárcalas para aceptar el valor de la firma. Los nuevos tipos de regla se añaden.',
  'account.profiles.keep-local': 'Conservar mi regla:',
  'account.profiles.keep-payout': 'Conservar política de retiro actual',
  'account.profiles.library': 'Mis reglas guardadas',
  'account.profiles.locked': 'El suelo de drawdown ya está bloqueado',
  'account.profiles.missing': 'Estas reglas guardadas ya no existen.',
  'account.profiles.peak': 'Saldo máximo conservado',
  'account.profiles.review': 'Revisar actualización de reglas',
  'account.profiles.save-new': 'Guardar estas reglas',
  'account.profiles.saved': 'Guardado en Mis reglas guardadas.',
  'account.profiles.update-saved': 'Actualizar reglas guardadas',
  'account.profiles.delete-saved': 'Eliminar reglas guardadas',
  'account.profiles.save-revision':
    'Guardar como nueva revisión de las reglas seleccionadas',
  'account.profiles.source-phase': 'Fase de las reglas de la firma',
  'account.profiles.transition-help':
    'No hay condiciones de transición verificadas. Introduce suelo, máximo e inicio del ciclo confirmados por la firma. Se marcarán como personalizados. Se conservan el beneficio de fase y el total de retiros; las operaciones anteriores mantienen sus reglas.',
  'account.profiles.transition-source': 'Confirmación de la firma o referencia',
  'account.profiles.link-intro':
    'Vincula este desafío a las reglas de su firma y Journalit te avisará cuando la firma las cambie. Primero revisas en qué se diferencian de las reglas de esta cuenta; nada cambia hasta que aplicas.',
  'account.profiles.link-title': 'Vincular a reglas de la firma',
  'account.profiles.choose-source': 'Elige reglas de la firma',
  'account.profiles.update-available':
    'Las reglas de la firma han cambiado y deben revisarse. Tu cuenta sigue usando sus reglas guardadas.',
  'account.profiles.up-to-date':
    'Esta fase usa las últimas reglas de la firma revisadas; los ajustes locales siguen siendo independientes.',
  'widget.mfeScatter.name': 'MFE vs. PnL realizado',
  'widget.mfeScatter.description':
    'Máximo beneficio abierto vs P&L final por operación',
  'widget.mfeScatter.y': 'PnL realizado ({unit})',
  'widget.mfeScatter.winners': 'Ganadoras',
  'widget.mfeScatter.losers': 'Perdedoras',
  'widget.mfeScatter.breakeven': 'Punto de equilibrio',
  'widget.mfeScatter.empty':
    'No hay operaciones cerradas con MFE disponible en esta unidad.',

  'trade.broker-synced-at': 'Bróker sincronizado {date}',
  'trade-sync.tradovate.status.connecting': 'Conectando',
  'trade-sync.tradovate.status.setup-required':
    'Configuración de cuenta requerida',
  'trade-sync.tradovate.status.paused': 'En pausa',
  'trade-sync.tradovate.status.reauthorization-required':
    'Se requiere nueva autorización',
  'trade-sync.tradovate.status.deleting': 'Eliminando datos en la nube',
  'trade-sync.tradovate.status.error': 'Error de conexión',

  'trade-sync.tradovate.sync-complete-connection':
    'Sincronización de {connection} completada.',
  'trade-sync.tradovate.sync-partial-connection':
    'La sincronización de {connection} terminó con problemas.',
  'trade-sync.tradovate.sync-all': 'Sincronizar todo',
  'trade-sync.tradovate.sync-all-complete':
    'Se sincronizaron {succeeded} de {total} conexiones de Tradovate.',
  'trade-sync.tradovate.sync-all-partial':
    'Se sincronizaron {succeeded} de {total} conexiones de Tradovate. Revisa las conexiones con problemas.',
  'trade-sync.tradovate.connect-another': 'Conectar otra cuenta de Tradovate',
  'trade-sync.tradovate.no-connections':
    'Conecta una cuenta de Tradovate en Journalit.co para configurarla y sincronizarla aquí.',
  'trade-sync.tradovate.claimed-by-connection':
    'La sincronización está activada mediante {connection}. Desactívala allí antes de cambiar esta cuenta.',
  'trade-sync.tradovate.claim-conflict':
    'Otra conexión de Tradovate reclamó esta cuenta. Revisa las tarjetas de conexión actualizadas antes de volver a intentarlo.',
  'trade-sync.tradovate.reconciliation-issues':
    '{count} problema(s) de conciliación',
  'trade-sync.tradovate.website-connection-description':
    'Conecta o vuelve a autorizar Tradovate de forma segura en Journalit.co; después, vuelve aquí para elegir cuentas y sincronizar tu vault.',
  'trade-sync.tradovate.paused-website-description':
    'Esta conexión de Tradovate está en pausa. Gestiónala en Journalit.co para revisarla o reanudarla.',
  'trade-sync.tradovate.plugin-sync-description':
    'Una sincronización obtiene la actividad más reciente de Tradovate y escribe las operaciones resultantes en este vault.',
  'trade-sync.tradovate.connect': 'Conectar',
  'trade-sync.tradovate.manage-connection': 'Gestionar conexión',
  'trade-sync.tradovate.setup-guide': 'Guía de configuración',
  'trade-sync.tradovate.setup-and-sync':
    'Terminar la configuración y sincronizar',
  'trade-sync.tradovate.sync-to-vault': 'Sincronizar',
  'trade-sync.tradovate.discovery-description':
    'Journalit necesita descubrir las cuentas Demo y Live disponibles mediante tu conexión de Tradovate.',
  'trade-sync.tradovate.discover-accounts': 'Descubrir cuentas de Tradovate',
  'trade-sync.tradovate.discovering': 'Descubriendo cuentas…',
  'trade-sync.tradovate.discovery-failed':
    'No se pudieron descubrir las cuentas de Tradovate. Inténtalo de nuevo o gestiona la conexión en Journalit.co.',
  'trade-sync.tradovate.sync-account': 'Incluir en la sincronización',
  'trade-sync.tradovate.history-label': 'Historial inicial',
  'trade-sync.tradovate.history-all': 'Todo el historial disponible',
  'trade-sync.tradovate.history-recent': 'Últimos 90 días',
  'trade-sync.tradovate.history-custom': 'A partir de una fecha específica',
  'trade-sync.tradovate.history-new': 'Solo operaciones nuevas',
  'trade-sync.tradovate.start-date': 'Fecha de inicio',

  'trade-sync.tradovate.mapping-required':
    'Elige una cuenta local del vault para cada cuenta de Tradovate activada.',
  'trade-sync.tradovate.custom-date-required':
    'Elige una fecha de inicio para cada selección de historial personalizada.',
  'trade-sync.tradovate.recovery-title':
    'Restaurar notas de operaciones faltantes',
  'trade-sync.tradovate.recovery-count':
    '{count} nota(s) de operaciones para restaurar',
  'trade-sync.tradovate.recovery-select-account':
    'Selecciona una cuenta local antes de restaurar notas de operaciones.',
  'trade-sync.tradovate.recovery-confirm':
    '¿Restaurar {count} nota(s) de operaciones en {account}?',

  'trade-sync.ctrader.status.setup-required':
    'Configuración de cuenta requerida',
  'trade-sync.ctrader.status.connecting': 'Conectando',
  'trade-sync.ctrader.status.paused': 'En pausa',
  'trade-sync.ctrader.status.reauthorization-required':
    'Se requiere nueva autorización',
  'trade-sync.ctrader.status.deleting': 'Eliminando datos en la nube',
  'trade-sync.ctrader.status.error': 'Error de conexión',
  'trade-sync.ctrader.sync-complete-connection':
    'Sincronización de {connection} completada.',
  'trade-sync.ctrader.sync-partial-connection':
    'La sincronización de {connection} terminó con problemas.',
  'trade-sync.ctrader.sync-all': 'Sincronizar todo',
  'trade-sync.ctrader.sync-all-complete':
    'Se sincronizaron {succeeded} de {total} conexiones de cTrader.',
  'trade-sync.ctrader.sync-all-partial':
    'Se sincronizaron {succeeded} de {total} conexiones de cTrader. Revisa las conexiones con problemas.',
  'trade-sync.ctrader.connect-another': 'Conectar otra cuenta de cTrader',
  'trade-sync.ctrader.no-connections':
    'Conecta una cuenta de cTrader en Journalit.co para configurarla y sincronizarla aquí.',
  'trade-sync.ctrader.claimed-by-connection':
    'La sincronización está activada mediante {connection}. Desactívala allí antes de cambiar esta cuenta.',
  'trade-sync.ctrader.claim-conflict':
    'Otra conexión de cTrader reclamó esta cuenta. Revisa las tarjetas de conexión actualizadas antes de volver a intentarlo.',
  'trade-sync.ctrader.reconciliation-issues':
    '{count} problema(s) de conciliación',
  'trade-sync.ctrader.website-connection-description':
    'Conecta o vuelve a autorizar cTrader de forma segura en Journalit.co; después, vuelve aquí para elegir cuentas y sincronizar tu vault.',
  'trade-sync.ctrader.plugin-sync-description':
    'Una sincronización obtiene la actividad más reciente de cTrader y escribe las operaciones resultantes en este vault.',
  'trade-sync.ctrader.connect': 'Conectar',
  'trade-sync.ctrader.manage-connection': 'Gestionar conexión',
  'trade-sync.ctrader.setup-guide': 'Guía de configuración',
  'trade-sync.ctrader.setup-and-sync':
    'Terminar la configuración y sincronizar',
  'trade-sync.ctrader.sync-to-vault': 'Sincronizar',
  'trade-sync.ctrader.discovery-description':
    'Journalit necesita descubrir las cuentas Demo y Live disponibles mediante tu conexión de cTrader.',
  'trade-sync.ctrader.discover-accounts': 'Descubrir cuentas de cTrader',
  'trade-sync.ctrader.discovering': 'Descubriendo cuentas…',
  'trade-sync.ctrader.discovery-failed':
    'No se pudieron descubrir las cuentas de cTrader. Inténtalo de nuevo o gestiona la conexión en Journalit.co.',
  'trade-sync.ctrader.sync-account': 'Incluir en la sincronización',
  'trade-sync.ctrader.history-label': 'Historial inicial',
  'trade-sync.ctrader.history-all': 'Todo el historial disponible',
  'trade-sync.ctrader.history-recent': 'Últimos 90 días',
  'trade-sync.ctrader.history-custom': 'A partir de una fecha específica',
  'trade-sync.ctrader.history-new': 'Solo operaciones nuevas',
  'trade-sync.ctrader.start-date': 'Fecha de inicio',
  'trade-sync.ctrader.mapping-required':
    'Elige una cuenta local del vault para cada cuenta de cTrader activada.',
  'trade-sync.ctrader.custom-date-required':
    'Elige una fecha de inicio para cada selección de historial personalizada.',
  'trade-sync.ctrader.recovery-title':
    'Restaurar notas de operaciones faltantes',
  'trade-sync.ctrader.recovery-count':
    '{count} nota(s) de operaciones para restaurar',
  'trade-sync.ctrader.recovery-select-account':
    'Selecciona una cuenta local antes de restaurar notas de operaciones.',
  'trade-sync.ctrader.recovery-confirm':
    '¿Restaurar {count} nota(s) de operaciones en {account}?',
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
  'trade-sync.ctrader.last-sync': 'Last sync',
  'trade-sync.ctrader.pending-acks': '{count} ACK(s) locales pendientes',
  'trade-sync.ctrader.never': 'Never',

  
  
  

  
  'command.add-trade': 'Añadir Nueva Operación',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Abrir Trade Import',

  
  'command.create-drc': 'Abrir DRC (Reporte Diario)',
  'command.create-weekly-review': 'Abrir Revisión Semanal',
  'command.create-monthly-review': 'Abrir Revisión Mensual',
  'command.create-quarterly-review': 'Abrir Revisión Trimestral',
  'command.create-yearly-review': 'Abrir Revisión Anual',

  
  'command.open-dashboard': 'Abrir panel',
  'command.open-account-dashboard': 'Abrir cuentas',
  'command.open-trade-log': 'Abrir Registro de Operaciones',
  'command.open-home': 'Abrir Vista de Inicio',
  'command.open-settings': 'Abrir ajustes',
  'command.open-position-size-calculator':
    'Abrir calculadora de tamaño de posición',

  

  
  'command.replay-onboarding': 'Repetir Flujo de Incorporación',
  'command.replay-current-view-guide': 'Repetir guía de la vista actual',
  'command.open-release-notes': 'Ver notas de versión',

  
  'command.open-layout-builder': 'Abrir Constructor de Diseño',

  
  
  
  'auth.title.already-logged-in': 'Ya Iniciaste Sesión',
  'auth.desc.already-logged-in': 'Ya has iniciado sesión{email}.',
  'auth.title.sign-in': 'Iniciar Sesión en Journalit',

  'auth.label.email': 'Dirección de Correo Electrónico',

  'auth.button.send-code': 'Enviar Código de Verificación',

  'auth.label.code': 'Código de Verificación',

  'auth.button.verify': 'Verificar e Iniciar Sesión',

  'auth.button.resend': 'Reenviar Código',

  'auth.error.needs-premium': 'Característica Pro',

  'auth.error.network-error': 'Error de Conexión',

  
  
  
  'form.section.trade-details': 'Detalles de la Operación',
  'form.section.trading-costs': 'Costos de Trading',
  'form.section.risk-management': 'Gestión de Riesgo',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': 'Análisis y Tesis',

  
  
  
  'form.tab.basic': 'Básico',
  'form.tab.details': 'Detalles',
  'form.tab.advanced': 'Avanzado',

  
  
  
  'form.import-shortcut.open': 'Abrir importación de operaciones',
  'form.manual-import-nudge.title.one':
    'Consejo: has añadido {count} operación a mano',
  'form.manual-import-nudge.title.few':
    'Consejo: has añadido {count} operaciones a mano',
  'form.manual-import-nudge.title.many':
    'Consejo: has añadido {count} operaciones a mano',
  'form.manual-import-nudge.title.other':
    'Consejo: has añadido {count} operaciones a mano',
  'form.manual-import-nudge.body':
    'La importación de operaciones puede traer tu historial del bróker o de una hoja de cálculo de una sola vez, en lugar de una operación cada vez.',
  'form.manual-import-nudge.cta': 'Ver mis operaciones',
  'form.manual-import-nudge.dismiss': 'Ahora no',
  'form.layout.customize': 'Personalizar formulario',
  'form.layout.modal-title': 'Personalizar formulario de operación',
  'form.layout.settings-title': 'Diseño del formulario de operación',

  'form.layout.input-mode': 'Modo de entrada',
  'form.layout.input-mode-prices': 'Precios',
  'form.layout.input-mode-pnl-risk': 'P&L + Riesgo',
  'form.layout.input-mode-prices-desc':
    'Registra precios de entrada y salida, y deja que Journalit calcule el P&L.',
  'form.layout.input-mode-pnl-risk-desc':
    'Registra el P&L de la operación y el importe de riesgo directamente. Journalit calcula el múltiplo R automáticamente.',
  'form.layout.asset-type-mode': 'Tipo de activo',
  'form.layout.asset-type-mode-show': 'Preguntar',
  'form.layout.asset-type-mode-fixed': 'Fijo',
  'form.layout.default-asset-type': 'Tipo de activo predeterminado',
  'form.layout.active-fields': 'Bloques visibles',
  'form.layout.available-fields': 'Bloques ocultos',
  'form.layout.active-fields-desc':
    'Arrastra bloques para reordenarlos. Quita lo que no uses.',
  'form.layout.available-fields-desc':
    'Vuelve a añadir bloques ocultos al formulario cuando los necesites.',
  'form.layout.empty-active': 'No hay bloques opcionales visibles.',
  'form.layout.all-active': 'Todos los bloques opcionales están visibles.',
  'form.layout.add-field-aria': 'Añadir {field} al formulario de operación',
  'form.layout.remove-field-aria':
    'Ocultar {field} en el formulario de operación',
  'form.layout.saved': 'Diseño del formulario de operación guardado',
  'form.layout.item.trading-costs.commission': 'Comisión',
  'form.layout.item.import-shortcut': 'Atajo de importación',
  'form.layout.item.import-shortcut-desc':
    'Muestra un botón en el pie que abre Importación de operaciones.',
  'form.layout.item.core-details': 'Detalles principales de la operación',
  'form.layout.item.core-details-desc':
    'Cuenta, instrumento, dirección y entradas/salidas permanecen primero.',
  'form.layout.item.asset-specific': 'Campos específicos del activo',
  'form.layout.item.pnl-preview': 'Vista previa de P&L',

  'form.layout.item.trade-currency': 'Divisa de la operación / Tipo de cambio',
  'form.layout.item.trade-currency-desc':
    'Registra una operación en otra divisa con un tipo de cambio manual opcional.',
  'form.layout.item.exchange-desc':
    'Campo de mercado para operaciones de acciones y cripto.',
  'form.layout.item.direct-pnl-toggle-desc':
    'Cambiar una operación concreta a introducir el P&L total en lugar de los precios de salida.',
  'form.layout.manual-fx-rate': 'Anulación del tipo de cambio',
  'form.layout.result-r': 'Resultado en R',
  'form.layout.entry-time': 'Hora de la operación',

  
  
  
  'form.field.account': 'Cuenta',
  'form.field.prop-challenge-phase': 'Fase asignada: {name}',
  'form.field.prop-challenge-phase.none': 'Ninguna fase en este momento',
  'form.field.asset-type': 'Tipo de Activo',
  'form.field.direction': 'Dirección',
  'form.field.direction.long': 'Largo',
  'form.field.direction.short': 'Corto',
  'form.field.commission': 'Comisión',
  'form.field.commission-type': 'Tipo',
  'form.field.rebate': 'Reembolso',
  'form.field.swap': 'Swap',

  'form.field.other-fees': 'Otros Cargos',
  'form.field.stop-loss': 'Stop Loss',
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Target Price',
  'form.field.close-percent': 'Close %',
  'form.field.close-size': 'Tamaño de cierre',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': 'Cantidad de cierre del Take Profit como',
  'form.layout.take-profit-unit-percent': 'Close %',
  'form.layout.take-profit-unit-size': 'Tamaño',
  'trade.validation.take-profit-size-number':
    'El tamaño del take profit debe ser un número válido.',
  'trade.validation.take-profit-size-positive':
    'El tamaño del take profit debe ser mayor que 0.',
  'trade.validation.take-profit-total-size-range':
    'Los tamaños de take profit no pueden superar el tamaño de la posición.',
  'form.field.risk-amount': 'Monto en Riesgo',
  'form.field.profit-loss': 'Ganancia/Pérdida',
  'form.field.total-pnl': 'P&L Total',
  'form.field.realized-pnl': 'P&L Realizado',
  'form.field.floating-pnl': 'P&L Flotante',
  'form.field.total-costs': 'Costos Totales:',
  'form.field.setup': 'Configuración',
  'form.field.mistake': 'Error',
  'form.field.custom-tags': 'Etiquetas Personalizadas',
  'form.field.trade-thesis': 'Tesis de la Operación',
  'form.field.time': 'Hora',
  'form.field.price': 'Precio',

  'form.field.entries': 'Entradas',
  'form.field.exits': 'Salidas',
  'form.field.dividends': 'Dividendos',
  'form.field.dividend-amount': 'Importe del dividendo',
  'form.field.optional': '(opcional)',

  
  'form.field.position-size': 'Tamaño de Posición',
  'form.field.position-size.shares': 'Acciones',
  'form.field.position-size.contracts': 'Contratos',
  'form.field.position-size.lots': 'Lotes',
  'form.field.position-size.amount': 'Cantidad',
  'form.field.position-size.cfd-units': 'Unidades CFD',

  
  'form.field.instrument': 'Instrumento',
  'form.field.instrument.ticker': 'Símbolo',
  'form.field.instrument.option-symbol': 'Símbolo de Opción',
  'form.field.instrument.future-symbol': 'Símbolo de Futuro',
  'form.field.instrument.forex-pair': 'Par de Forex',
  'form.field.instrument.crypto-symbol': 'Símbolo de Cripto',
  'form.field.instrument.cfd-symbol': 'Símbolo de CFD',

  
  'form.field.exchange': 'Bolsa',
  'form.field.expiration-date': 'Fecha de Vencimiento',
  'form.field.strike-price': 'Precio de Ejercicio',
  'form.field.contract-size': 'Tamaño del Contrato',
  'form.field.dollars-per-point': 'Dólares por punto',
  'form.field.tick-size': 'Tamaño del Tick',
  'form.field.tick-value': 'Valor del Tick',
  'form.field.lot-size': 'Tamaño del Lote',
  'form.field.custom-lot-size': 'Tamaño de Lote Personalizado',
  'form.field.pip-value': 'Valor del Pip',
  'form.field.leverage-ratio': 'Ratio de Apalancamiento',
  'form.field.trade-currency': 'Divisa de la operación',
  'form.field.fx-rate': 'Tipo de cambio a {base}',
  'form.field.fx-rate-override':
    'Anulación del tipo de cambio ({quote} → {base})',

  
  'form.forex.using-manual-rate': 'Usando tipo de cambio manual',
  'form.field.lot-size.standard': 'Estándar (100.000)',
  'form.field.lot-size.mini': 'Mini (10.000)',
  'form.field.lot-size.micro': 'Micro (1.000)',
  'form.field.lot-size.custom': 'Personalizado',

  
  
  
  'form.placeholder.select-accounts': 'Seleccionar cuentas',
  'form.placeholder.commission': '0,15',
  'form.placeholder.commission-alt': '5,50',
  'form.placeholder.rebate': 'Reembolso/crédito de comisión',
  'form.placeholder.swap': 'Financiación nocturna',
  'form.placeholder.other-fees': 'Tarifas de plataforma/regulatorias',
  'form.placeholder.dividend-amount':
    'Importe en efectivo, positivo o negativo',
  'form.placeholder.stop-loss': 'Precio de stop loss opcional',
  'form.placeholder.target-price': 'Target price',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': 'Riesgo planificado en moneda',
  'form.placeholder.fx-rate': '1 {currency} = ? {base} (vacío: tipo diario)',
  'form.placeholder.custom-tag': 'Escribe una etiqueta y presiona Enter',
  'form.placeholder.thesis': 'Ingresa tu tesis para esta operación...',

  'form.placeholder.exchange-stock': 'ej., NYSE, NASDAQ',
  'form.placeholder.exchange-crypto': 'ej., Binance, Coinbase',
  'form.placeholder.futures-point-value': 'ej: 50 para ES1',
  'form.placeholder.leverage': 'ej., 100 para 1:100',

  
  
  
  'form.entry-exit.add-entry': '+ Añadir Entrada',
  'form.entry-exit.add-exit': '+ Añadir Salida',
  'form.entry-exit.remove-entry': 'Eliminar Entrada',
  'form.entry-exit.remove-exit': 'Eliminar Salida',
  'form.dividends.add-dividend': '+ Añadir Dividendo',
  'form.dividends.remove-dividend': 'Eliminar Dividendo',
  'form.dividends.total-dividends': 'Dividendos Totales:',
  'form.entry-exit.total-entry-size': 'Tamaño Total de Entrada:',
  'form.entry-exit.remaining-position': 'Posición Restante:',
  'form.entry-exit.open': '(Abierta)',
  'form.entry-exit.closed': '(Cerrada)',
  'form.entry-exit.direct-pnl': 'Ingresar P&L directamente en lugar de precios',
  'form.entry-exit.direct-pnl-desc':
    'Ingresa tu ganancia/pérdida total directamente. Las comisiones y tarifas aún se restarán.',
  'form.entry-exit.calc-pnl':
    'Calcular P&L desde precios de entrada/salida y tamaños de posición.',
  'form.ideal-exit.title': 'Salidas ideales',

  'form.ideal-exit.price': 'Precio ideal',
  'form.ideal-exit.size': 'Tamaño',
  'form.ideal-exit.remove': 'Eliminar salida ideal',

  'form.ideal-exit.copy-actual': 'Copiar salidas reales',

  'form.ideal-exit.tooltip':
    'Registra el plan de salida retrospectivo que te habría gustado ejecutar. Admite salidas escaladas para revisar la captura.',
  'form.ideal-exit.empty': 'Aún no hay salidas ideales',
  'form.unrealized.title': 'Instantánea de posición abierta',
  'form.unrealized.tooltip':
    'Registra el precio de mercado actual de tu posición abierta para seguir el P&L no realizado. La instantánea se elimina automáticamente al cerrar la operación.',
  'form.unrealized.price': 'Precio de la instantánea',
  'form.unrealized.time': 'Hora de la instantánea',
  'form.unrealized.preview': 'P&L no realizado',
  'form.unrealized.captured': 'Capturado {time}',
  'form.layout.item.unrealized-snapshot-desc':
    'Sigue el P&L no realizado de posiciones abiertas.',
  'trade.validation.unrealized-snapshot-price-non-negative':
    'El precio de la instantánea debe ser cero o mayor',
  'trade.validation.unrealized-snapshot-open-position-required':
    'La hora de la instantánea debe corresponder a una posición abierta.',
  
  
  
  'form.trade-type.title': 'Tipo de Operación',
  'form.trade-type.subtitle': 'Elige el tipo de operación que estás creando',
  'form.trade-type.regular': 'Operación Regular',
  'form.trade-type.regular-desc':
    'Operación normal con datos completos de entrada y salida',
  'form.trade-type.missed': 'Operación Perdida',
  'form.trade-type.missed-desc':
    'Oportunidad de trading que perdiste - campos de P&L y Cuenta opcionales',
  'form.trade-type.backtest': 'Operación de Backtesting',
  'form.trade-type.backtest-desc':
    'Escenario de backtesting para propósitos de análisis',
  'form.trade-type.missed-reason': '¿Por qué perdiste esta operación?',
  'form.trade-type.missed-reason-placeholder':
    'Describe por qué perdiste esta oportunidad de trading...',

  
  'form.modal.unsaved-changes.title': 'Cambios sin Guardar',
  'form.modal.unsaved-changes.body1':
    'Tienes cambios sin guardar en el formulario de operación.',
  'form.modal.unsaved-changes.body2':
    '¿Estás seguro de que quieres cerrar sin guardar?',
  'form.modal.unsaved-changes.continue': 'Continuar Editando',
  'form.modal.unsaved-changes.discard': 'Descartar Cambios',

  
  'template-builder.modal.unsaved-changes.title': 'Cambios sin Guardar',
  'template-builder.modal.unsaved-changes.body1':
    'Tienes cambios sin guardar en esta plantilla.',
  'template-builder.modal.unsaved-changes.body2':
    '¿Estás seguro de que quieres cambiar sin guardar?',
  'template-builder.modal.unsaved-changes.continue': 'Continuar Editando',
  'template-builder.modal.unsaved-changes.discard': 'Descartar Cambios',
  'template-builder.modal.delete.title': 'Eliminar Layout',
  'template-builder.modal.delete.body':
    '¿Estás seguro de que quieres eliminar "{name}"?',
  'template-builder.modal.delete.warning': 'Esta acción no se puede deshacer.',
  'template-builder.modal.delete.cancel': 'Cancelar',
  'template-builder.modal.delete.confirm': 'Eliminar',

  
  'tradelog.settings.modal.unsaved-changes.body1':
    'Tienes cambios sin guardar en la configuración de columnas.',
  'tradelog.settings.modal.unsaved-changes.body2':
    '¿Estás seguro de que quieres cerrar sin guardar?',

  
  'form.section.custom-fields': 'Campos Personalizados',

  'form.section.custom-fields-empty-title': 'Aún no hay campos avanzados.',
  'form.section.custom-fields-empty-desc':
    'Registra todo lo que los campos integrados no cubren, como sesión, marco temporal o calidad del setup. Los campos personalizados se guardan con cada operación y pueden convertirse en columnas ordenables del registro de operaciones.',
  'form.section.attachments': 'Archivos Adjuntos',

  
  'form.field.asset-type.stock': 'Acciones',
  'form.field.asset-type.options': 'Opciones',
  'form.field.asset-type.futures': 'Futuros',
  'form.field.asset-type.forex': 'Forex',
  'form.field.asset-type.crypto': 'Cripto',
  'form.field.asset-type.cfd': 'CFD',

  
  'form.field.option-type': 'Tipo de Opción',
  'form.field.option-type.call': 'Call',
  'form.field.option-type.put': 'Put',

  
  'form.field.commission-type.fixed': 'Fijo',
  'form.field.commission-type.percentage': 'Porcentaje (%)',

  
  'form.field.closed': 'cerrada',
  'form.field.incl-costs': '(incl. costos)',
  'form.field.value-dollar': 'Valor ($)',
  'form.field.dollar-amount-placeholder': 'Monto en dólares',
  'form.field.direct-pnl-placeholder': 'Ingresa ganancia o pérdida total',

  'form.field.mae-placeholder-currency': 'Max drawdown in {currency}',
  'form.field.mfe-placeholder-currency': 'Max profit in {currency}',
  'form.calculated': 'Calculado',

  
  'form.field.image-url-placeholder':
    'Pegar URL de imagen o ruta de archivo...',
  'form.field.image-duplicate-error': 'Esta imagen ya está agregada.',
  'form.field.trade-image-alt': 'Imagen de Operación',

  
  'form.account-empty-state.title': 'Configura tu primera cuenta',
  'form.account-empty-state.description':
    'Las cuentas registran tu saldo para que Journalit pueda calcular rentabilidad, riesgo y drawdown. Crear una solo necesita un nombre.',
  'form.account-empty-state.create-account': 'Crear Cuenta',
  'form.account-empty-state.submit-disabled':
    'Crea una cuenta primero para guardar esta operación.',
  'form.empty.take-profits': 'No take profit targets yet',
  'form.action.add-take-profit': 'Add Take Profit',
  'form.action.remove-take-profit': 'Remove take profit',
  'form.error.image-upload-unavailable': 'Carga de imagen no disponible',

  
  
  
  'button.save': 'Guardar',
  'button.cancel': 'Cancelar',
  'button.close': 'Cerrar',
  'button.done': 'Listo',
  'button.edit': 'Editar',
  'button.delete': 'Eliminar',
  'button.update': 'Actualizar',
  'button.open': 'Abrir',
  'button.add': 'Añadir',
  'button.create': 'Crear',
  'button.reset': 'Restablecer',
  'button.reset-to-defaults': 'Restablecer a Predeterminados',

  'button.confirm': 'Confirmar',

  'button.back': 'Atrás',

  'button.add-trade': 'Añadir Operación',
  'button.update-trade': 'Actualizar Operación',
  'button.save-changes': 'Guardar Cambios',
  'button.create-trade': 'Crear Operación',
  'button.delete-all': 'Eliminar Todo',
  'button.clear-all': 'Limpiar Todo',

  'button.cancel-reset': 'Cancelar Restablecimiento',
  'button.proceed-anyway': 'Continuar de Todos Modos',
  'button.mark-reviewed': 'Marcar como Revisado',
  'button.maybe-later': 'Quizás Después',
  'button.upgrade-now': 'Actualizar Ahora',

  'button.apply': 'Aplicar',

  'button.learn-more': 'Más información',
  'button.upload-image': 'Subir medios',
  'button.discord': 'Discord',
  'button.remove': 'Eliminar',

  'button.move-up': 'Mover arriba',
  'button.move-down': 'Mover abajo',

  'button.next': 'Siguiente',
  'button.discard': 'Descartar',
  'guide.scroll-to-target.title': 'Desplázate para continuar la guía',
  'guide.scroll-to-target.description':
    'El siguiente paso está fuera de la vista. Desplázate para continuar o deja que Journalit te lleve allí.',
  'guide.scroll-to-target.description-up':
    'El siguiente paso está más arriba en la página. Desplázate hacia arriba para continuar o deja que Journalit te lleve allí.',
  'guide.scroll-to-target.description-down':
    'El siguiente paso está más abajo en la página. Desplázate hacia abajo para continuar o deja que Journalit te lleve allí.',
  'guide.scroll-to-target.button': 'Muéstramelo',

  
  
  
  'validation.edit': 'EDITAR',
  'validation.fix-errors': 'Por favor corrige los siguientes errores:',
  'validation.basic-tab-errors.one': 'La pestaña Básico tiene {count} error',
  'validation.basic-tab-errors.few': 'La pestaña Básico tiene {count} errores',
  'validation.basic-tab-errors.many': 'La pestaña Básico tiene {count} errores',
  'validation.basic-tab-errors.other':
    'La pestaña Básico tiene {count} errores',
  'validation.details-tab-errors.one':
    'La pestaña Detalles tiene {count} error',
  'validation.details-tab-errors.few':
    'La pestaña Detalles tiene {count} errores',
  'validation.details-tab-errors.many':
    'La pestaña Detalles tiene {count} errores',
  'validation.details-tab-errors.other':
    'La pestaña Detalles tiene {count} errores',
  'validation.advanced-tab-errors.one':
    'La pestaña Avanzado tiene {count} error',
  'validation.advanced-tab-errors.few':
    'La pestaña Avanzado tiene {count} errores',
  'validation.advanced-tab-errors.many':
    'La pestaña Avanzado tiene {count} errores',
  'validation.advanced-tab-errors.other':
    'La pestaña Avanzado tiene {count} errores',
  'validation.complete-required':
    'Por favor completa todos los campos requeridos',

  'validation.missed-trade-requires-exit':
    'Las operaciones perdidas deben tener datos de salida con precios distintos de cero. Representan oportunidades que ya han pasado, por lo que debes especificar cuál habría sido el precio de salida.',
  'trade.validation.entry-required': 'Se requiere al menos una entrada.',
  'trade.validation.entry-time-required': 'La hora de entrada es obligatoria.',
  'trade.validation.entry-price-required':
    'El precio de entrada es obligatorio.',
  'trade.validation.entry-size-positive':
    'El tamaño de la entrada debe ser mayor que cero.',
  'trade.validation.exit-required-closed':
    'Se requiere al menos una salida para operaciones cerradas.',
  'trade.validation.exit-time-required': 'La hora de salida es obligatoria.',
  'trade.validation.exit-price-required': 'El precio de salida es obligatorio.',
  'trade.validation.exit-size-positive':
    'El tamaño de la salida debe ser mayor que cero.',
  'trade.validation.exit-size-exceeds-entry':
    'El tamaño total de salida no puede exceder el tamaño total de entrada.',
  'trade.validation.exit-before-entry':
    'Las salidas no pueden ocurrir antes de la primera entrada.',
  'trade.validation.dividend-time-required':
    'La hora del dividendo es obligatoria.',
  'trade.validation.dividend-amount-nonzero':
    'El importe del dividendo debe ser un número distinto de cero.',
  'trade.validation.direct-pnl-required':
    'Por favor ingresa un valor de ganancia/pérdida.',
  'trade.validation.entry-time-select':
    'Por favor selecciona una hora de entrada.',
  'trade.validation.direction-required': 'Por favor selecciona una dirección.',
  'trade.validation.asset-type-required':
    'Por favor selecciona un tipo de activo.',
  'trade.validation.ticker-required': 'Por favor selecciona un ticker.',
  'trade.validation.ticker-invalid':
    'Ingresa un símbolo de ticker válido (solo letras, números y puntos).',
  'trade.validation.account-required':
    'Por favor selecciona al menos una cuenta.',
  'trade.validation.exit-time-select':
    'Por favor selecciona una hora de salida.',
  'trade.validation.entry-price-invalid':
    'Por favor ingresa un precio de entrada válido.',
  'trade.validation.exit-price-invalid':
    'Por favor ingresa un precio de salida válido.',
  'trade.validation.position-size-invalid':
    'Por favor ingresa un tamaño de posición válido.',
  'trade.validation.exit-time-after-entry':
    'La hora de salida debe ser posterior a la hora de entrada.',
  'trade.validation.expiration-date-required':
    'Por favor selecciona una fecha de vencimiento.',
  'trade.validation.strike-price-required':
    'Por favor ingresa un precio de ejercicio.',
  'trade.validation.option-type-required':
    'Por favor selecciona un tipo de opción (call o put).',
  'trade.validation.contract-size-positive':
    'El tamaño del contrato debe ser mayor que cero.',
  'trade.validation.dollars-per-point-min':
    'Por favor ingresa dólares por punto (mín 0.01).',
  'trade.validation.lot-size-nonnegative':
    'El tamaño del lote debe ser mayor que cero.',
  'trade.validation.leverage-positive':
    'La relación de apalancamiento debe ser mayor que cero.',
  'trade.validation.commission-type-invalid':
    'El tipo de comisión debe ser "fixed" o "percentage".',
  'trade.validation.commission-number': 'La comisión debe ser un número.',
  'trade.validation.commission-percentage-range':
    'La comisión porcentual debe estar entre 0 y 100.',
  'trade.validation.rebate-options-only':
    'El reembolso solo se permite para operaciones de opciones.',
  'trade.validation.rebate-number': 'El reembolso debe ser un número.',
  'trade.validation.rebate-positive':
    'El reembolso debe ser un valor positivo.',
  'trade.validation.swap-invalid': 'Monto de swap inválido.',
  'trade.validation.fees-number': 'Las tarifas deben ser un número.',
  'trade.validation.risk-number': 'El monto de riesgo debe ser un número.',
  'trade.validation.risk-valid-number':
    'El monto de riesgo debe ser un número válido.',
  'trade.validation.risk-positive':
    'El monto de riesgo debe ser mayor que cero.',
  'trade.validation.fx-rate-number':
    'El tipo de cambio debe ser un número válido.',
  'trade.validation.fx-rate-positive':
    'El tipo de cambio debe ser mayor que cero.',
  'trade.validation.stop-loss-number': 'El stop loss debe ser un número.',
  'trade.validation.stop-loss-valid-number':
    'El stop loss debe ser un número válido.',
  'trade.validation.take-profit-price-required':
    'Take profit price is required.',
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
    'Take profit close percentages cannot exceed 100.',
  'validation.custom-field.key-empty':
    'La clave del campo no puede estar vacía',
  'validation.custom-field.key-conflict':
    'Este nombre de campo entra en conflicto con los campos integrados de operaciones',
  'validation.custom-field.key-format':
    'La clave del campo debe comenzar con una letra y contener solo letras, números y guiones bajos',
  'validation.custom-field.required': '{label} es obligatorio',
  'validation.custom-field.text': '{label} debe ser texto',
  'validation.custom-field.min-length':
    '{label} debe tener al menos {minLength} caracteres',
  'validation.custom-field.max-length':
    '{label} no debe tener más de {maxLength} caracteres',
  'validation.custom-field.pattern-invalid':
    'El formato de {label} no es válido',
  'validation.custom-field.pattern-invalid-pattern':
    '{label} tiene un patrón de validación inválido',
  'validation.custom-field.number': '{label} debe ser un número',
  'validation.custom-field.min': '{label} debe ser al menos {min}',
  'validation.custom-field.max': '{label} no debe ser más de {max}',
  'validation.custom-field.selection': '{label} debe ser una selección válida',
  'validation.custom-field.option': '{label} debe ser una opción válida',
  'validation.custom-field.array': '{label} debe ser una lista de selecciones',
  'validation.custom-field.invalid-option':
    '{label} contiene una opción inválida: {item}',
  'validation.custom-field.date': '{label} debe ser una fecha válida',
  'validation.custom-field.time': '{label} debe ser una hora válida',
  'validation.custom-field.time-format':
    '{label} debe tener un formato de hora válido (HH:MM, HH:MM:SS, o 12 horas con AM/PM)',
  'validation.custom-field.time-values':
    '{label} contiene valores de hora inválidos',

  
  
  

  'notice.login-success': '¡Inicio de sesión exitoso!',
  'notice.pro-access-ready': 'El acceso PRO está listo.',

  'notice.logout-success': 'Sesión cerrada exitosamente',
  'notice.hotkey-set': 'Atajo configurado: {hotkey}',
  'notice.ftp-created': 'Credenciales FTP creadas exitosamente',
  'notice.ftp-password-rotated':
    'Se generaron nuevas credenciales FTP para este dispositivo. La sincronización FTP configurada en otros dispositivos (p. ej., su EA de MetaTrader) debe actualizarse con la nueva contraseña.',
  'notice.ftp-reused':
    'Se cargaron las credenciales FTP existentes de este dispositivo. Si ya no funcionan, use Restablecer contraseña.',
  'notice.ftp-reset':
    '¡Contraseña FTP restablecida exitosamente! Guarda la nueva contraseña.',
  'notice.template-saved': 'Layout guardada',
  'notice.template-created': 'Layout creada',
  'notice.template-duplicated': 'Layout duplicada',
  'notice.template-deleted': 'Layout eliminada',
  'notice.default-template-updated': 'Layout predeterminada actualizada',
  'notice.tradelog-saved':
    'Configuración del Registro de Operaciones guardada exitosamente',
  'notice.settings-exported': 'Configuración exportada a {filename}',
  'notice.settings-imported':
    'Configuración importada exitosamente desde v{version}. Reinicia Obsidian para aplicar todos los cambios.',

  'notice.template-switched': 'Cambiado a: {name}',
  'notice.auto-sync-toggled': 'Sincronización automática {status}',
  'notice.auto-sync-enabled': 'activada',
  'notice.auto-sync-disabled': 'desactivada',
  'notice.reset-items': 'Elementos restablecidos a valores predeterminados',

  'notice.custom-fields-imported':
    'Se importaron exitosamente {count} campos personalizados',

  'notice.setups-added': 'Configuraciones añadidas a {count} operaciones',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': 'Errores añadidos a {count} operaciones',
  'notice.trades-duplicated.one': 'Se duplicó {count} operación',
  'notice.trades-duplicated.few': 'Se duplicaron {count} operaciones',
  'notice.trades-duplicated.many': 'Se duplicaron {count} operaciones',
  'notice.trades-duplicated.other': 'Se duplicaron {count} operaciones',
  'notice.trades-deleted.one': 'Se eliminó {count} operación',
  'notice.trades-deleted.few': 'Se eliminaron {count} operaciones',
  'notice.trades-deleted.many': 'Se eliminaron {count} operaciones',
  'notice.trades-deleted.other': 'Se eliminaron {count} operaciones',

  
  
  
  'notice.error.open-journalit':
    'Error al abrir Journalit. Por favor intenta recargar Obsidian.',
  'notice.error.open-drc': 'Error al abrir DRC: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': 'Error al abrir Revisión Semanal: {error}',
  'notice.error.open-monthly-review':
    'Error al abrir Revisión Mensual: {error}',
  'notice.error.open-quarterly-review':
    'Error al abrir Revisión Trimestral: {error}',
  'notice.error.open-yearly-review': 'Error al abrir Revisión Anual: {error}',

  'notice.error.open-release-notes': 'Error al abrir notas de versión: {error}',
  'notice.guide.replay-unavailable':
    'El sistema de guías aún no está listo. Inténtalo de nuevo.',
  'notice.guide.no-active-view':
    'Abre primero una vista compatible de Journalit y vuelve a ejecutar este comando.',
  'notice.guide.no-guide-for-view':
    'Todavía no hay una guía registrada para esta vista ({viewType}).',
  'notice.guide.unavailable-in-current-state':
    'La guía de esta vista no está disponible en su estado actual.',
  'notice.guide.replay-failed':
    'No se pudo iniciar la guía. Inténtalo de nuevo.',
  'notice.guide.replay-started': 'Guía reiniciada para esta vista.',
  'notice.error.open-layout-builder':
    'Error al abrir Constructor de Diseño: {error}',
  'notice.error.switch-template': 'Error al cambiar layout: {error}',
  'notice.error.no-active-file':
    'No hay archivo activo. Abre una nota primero.',
  'notice.error.no-template-support':
    'Este tipo de nota no soporta plantillas.',
  'notice.error.no-templates':
    'No hay plantillas disponibles para este tipo de nota.',
  'notice.error.asset-type-required':
    'El tipo de activo es requerido al añadir un instrumento',
  'notice.error.column-required':
    'Al menos una columna debe permanecer visible',
  'notice.error.save-settings': 'Error al guardar configuración: {error}',
  'notice.error.sign-in-vault':
    'Por favor inicia sesión para registrar tu bóveda.',
  'notice.error.sign-in-sync':
    'Por favor inicia sesión para usar la sincronización automática.',
  'notice.error.restore-auth':
    'No se pudo restaurar la autenticación. Vuelve a iniciar sesión desde Configuración → Autenticación.',
  'notice.error.export-settings':
    'Error al exportar configuración. Revisa la consola para más detalles.',
  'notice.error.import-settings': 'Error al importar configuración: {error}',
  'notice.error.reset-settings':
    'Error al restablecer configuración. Revisa la consola para más detalles.',

  'notice.error.mark-reviewed':
    'Error al marcar operaciones como revisadas: {error}',
  'notice.error.add-setups': 'Error al añadir configuraciones: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'Error al añadir errores: {error}',
  'notice.error.duplicate-trades': 'Error al duplicar operaciones: {error}',
  'notice.error.delete-trades': 'Error al eliminar operaciones: {error}',
  'notice.error.csv-validation': 'Validación de CSV/XLSX/XLS falló: {errors}',
  'notice.error.import-failed': 'Importación fallida: {error}',
  'notice.error.file-too-large':
    'El archivo es demasiado grande. El tamaño máximo es 10MB',
  'notice.error.select-csv':
    'Por favor selecciona un archivo CSV/XLSX/XLS/HTML',
  'notice.error.cannot-delete-builtin':
    'No se pueden eliminar plantillas predeterminadas',
  'notice.error.duplicate-to-customize':
    'Duplica esta plantilla para personalizarla',
  'notice.error.sign-out': 'No se pudo cerrar sesión. Inténtalo de nuevo.',
  'notice.error.open-upgrade-modal':
    'Se solicitó una función premium pero no se pudo cargar el diálogo de actualización.',

  
  
  

  'notice.info.settings-recovered':
    'La configuración se recuperó del respaldo. Algunos cambios recientes pueden haberse perdido.',
  'notice.info.cannot-remove-locked':
    'No se pueden eliminar widgets bloqueados',

  
  'notice.sync-mapping.updating':
    'Actualizando mapeos de sincronización de operaciones para la nueva ruta de carpeta...',
  'notice.sync-mapping.updated':
    'Mapeos de sincronización de operaciones actualizados exitosamente',
  'notice.error.sync-mapping-update-failed':
    'Error al actualizar mapeos de sincronización de operaciones. Por favor reinicia el plugin.',

  'notice.error.missed-trade-service-init':
    'El servicio de operaciones perdidas no está inicializado. Por favor espera un momento e intenta de nuevo.',
  'notice.error.backtest-trade-service-init':
    'El servicio de operaciones de backtesting no está inicializado. Por favor espera un momento e intenta de nuevo.',
  'notice.trade-updated': '{type} actualizada: {path}',
  'notice.trade-created': '{type} creada: {path}',
  'notice.new-trade-created':
    '📈 Nueva operación creada: {instrument} {direction}',
  'notice.error.trade-update-failed': 'Error al actualizar {type}: {error}',
  'notice.error.trade-create-failed': 'Error al crear {type}: {error}',
  'notice.template-applied': 'Layout aplicada: {name}',

  'notice.csv-template-deleted': 'Plantilla "{name}" eliminada',
  'notice.csv-template-delete-failed': 'Error al eliminar plantilla: {error}',
  'notice.csv-template-imported': 'Plantilla "{name}" importada exitosamente',
  'notice.csv-symbol-mappings-created.one': 'Se creó {count} mapeo de símbolo',
  'notice.csv-symbol-mappings-created.few':
    'Se crearon {count} mapeos de símbolo',
  'notice.csv-symbol-mappings-created.many':
    'Se crearon {count} mapeos de símbolo',
  'notice.csv-symbol-mappings-created.other':
    'Se crearon {count} mapeos de símbolo',
  'notice.csv-symbol-mapping-skipped': 'Mapeo de símbolo omitido',
  'notice.csv-missing-fields':
    'Por favor mapea todos los campos requeridos antes de importar',
  'notice.mark-reviewed.one': 'Se marcó {count} operación como revisada',
  'notice.mark-reviewed.few': 'Se marcaron {count} operaciones como revisadas',
  'notice.mark-reviewed.many': 'Se marcaron {count} operaciones como revisadas',
  'notice.mark-reviewed.other':
    'Se marcaron {count} operaciones como revisadas',

  'notice.error.open-account-dashboard':
    'No se pudieron abrir Cuentas: {error}',
  'notice.error.open-trade-form-edit':
    'Error al abrir formulario de operación en modo edición: {error}',
  'notice.error.open-onboarding':
    'Error al abrir flujo de incorporación. Revisa la consola para más detalles.',
  'notice.error.open-update-notification':
    'Error al abrir notificación de actualización: {error}',
  'notice.error.switch-template-generic': 'Error al cambiar layout',

  'notice.error.cannot-change-folder-during-sync':
    'No se puede cambiar la ruta de la carpeta mientras la sincronización está en progreso. Por favor espera a que se complete la sincronización.',
  'notice.error.file-not-found': 'Archivo no encontrado: {path}',
  'notice.plugin-updated': '¡Journalit actualizado a v{version}!',
  'notice.error.template-save-failed': 'Error al guardar layout: {error}',
  'notice.default-trade-template-updated':
    'Plantilla predeterminada de operación actualizada',
  'notice.trade-template-duplicated': 'Layout de operación duplicada',
  'notice.trade-template-deleted': 'Layout de operación eliminada',
  'notice.error.create-template': 'Error al crear layout: {error}',
  'notice.error.duplicate-template': 'Error al duplicar layout: {error}',
  'notice.error.delete-template': 'Error al eliminar layout: {error}',
  'notice.settings-reset-with-backup':
    'Configuración restablecida. Se creó un respaldo automáticamente.',
  'notice.settings-reset-no-backup':
    'Configuración restablecida. No se pudo crear un respaldo.',

  
  
  
  'tradelog.title': 'Registro de Operaciones',
  'tradelog.root.all-trades': 'Todas las Operaciones',
  'tradelog.view.selector.label': 'Vista',

  'trade-form.guide.customization-modal.title':
    'Adapta el formulario a tu flujo de trabajo',
  'trade-form.guide.customization-modal.description':
    'Aquí puedes mostrar, ocultar y reordenar bloques opcionales. Mantén el formulario centrado en los campos que realmente usas.',
  'trade-form.guide.finish.title': 'Esa es la función de personalización',
  'trade-form.guide.finish.description':
    'Puedes volver a este botón cuando necesites que el formulario se adapte a otro flujo de trabajo de diario.',
  'tradelog.guide.empty.intro.title': 'Welcome to Trade Log',
  'tradelog.guide.empty.intro.description':
    'This page becomes your main place for browsing, sorting, and reviewing trades. Once you add trades, you will also get the full Trade Log tour.',
  'tradelog.guide.empty.state.title': 'No hay datos de trading disponibles',
  'tradelog.guide.empty.state.description':
    'Importa operaciones anteriores para explorar tu rendimiento ahora o registra una nueva operación manualmente.',
  'tradelog.guide.intro.title': 'This is your Trade Log',
  'tradelog.guide.intro.description':
    'Use this page to review trades one by one, sort them, filter them, and make changes to many trades at once.',
  'tradelog.guide.view-selector.title':
    'Choose how you want to review your history',
  'tradelog.guide.view-selector.description':
    'Use this menu to switch between the full trade table and grouped time views like months, weeks, or days. Trades is the default, but grouped views are useful when you want to review by period.',
  'tradelog.guide.filters.title': 'Use filters to narrow the Trade Log',
  'tradelog.guide.filters.description':
    'Abre los filtros cuando quieras revisar solo ciertas cuentas, configuraciones, etiquetas, tipos de operación, estados o fechas. También puedes excluir cualquier valor para dejar fuera esas operaciones.',
  'tradelog.guide.sorting.title': 'Click column headers to sort the table',
  'tradelog.guide.sorting.description':
    'In Trades view, click a sortable column header to reorder the table. For example, click Net P&L to sort by your biggest win and biggest loss.',
  'tradelog.guide.gallery-mode.title': 'También hay una galería de imágenes',
  'tradelog.guide.gallery-mode.description':
    'Cambia de modo aquí para explorar las capturas de tus operaciones como una galería. Una guía breve te la mostrará la primera vez que la abras.',
  'tradelog.guide.multi-select.title': 'Turn on multi-select',
  'tradelog.guide.multi-select.description':
    'Click this button to select several trades at once. When multi-select is on, row clicks select trades instead of opening them.',
  'tradelog.guide.batch-actions.title': 'These are your batch actions',
  'tradelog.guide.batch-actions.description':
    'Use this bar to select all visible trades, clear your selection, mark trades as reviewed, add setups, add mistakes, duplicate trades, or delete several trades at once. You can also shift-click to select a range of trades.',
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
  'dashboard.guide.empty.intro.title': 'Welcome to your Dashboard',
  'dashboard.guide.empty.intro.description':
    'Tu panel resulta útil en cuanto Journalit dispone de historial de trading para analizar.',
  'dashboard.guide.empty.state.title': 'Lleva contigo tu historial de trading',
  'dashboard.guide.empty.state.description':
    'Importa operaciones anteriores para empezar con datos de rendimiento significativos o añade una operación manualmente si estás registrando tus primeras operaciones.',
  'dashboard.guide.main.intro.title': 'Este es tu panel',
  'dashboard.guide.main.intro.description':
    'Use this page to track your performance, review your stats, and keep your most useful charts in one place.',
  'dashboard.guide.main.filters.title': 'Filters change the whole Dashboard',
  'dashboard.guide.main.filters.description':
    'Usa los filtros cuando quieras que cada estadística y gráfico de esta página se actualice para otro rango de fechas, cuenta, configuración, etiqueta o tipo de operación. También puedes excluir cualquier valor para dejar fuera esas operaciones.',
  'dashboard.guide.main.edit-layout.title':
    'Turn on edit mode to customise this page',
  'dashboard.guide.main.edit-layout.description':
    'Click Edit Layout to unlock moving, resizing, removing, and adding Dashboard widgets.',
  'dashboard.guide.main.open-widget-selector.title': 'Open Add Widget',
  'dashboard.guide.main.open-widget-selector.description':
    'Click Add Widget to add more charts and bring back widgets you removed earlier.',
  'dashboard.guide.main.widget-picker.title': 'Pick what you want to show',
  'dashboard.guide.main.widget-picker.description':
    'Este panel muestra una vista previa de cada gráfico y métrica. Haz clic en uno para añadirlo; lo que ya está en tu Panel aparece en En uso.',
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
  'home.guide.intro.title': 'Bienvenido a casa',
  'home.guide.intro.description':
    'This is your main page. It shows your trading stats, quick actions, and shortcuts to the rest of Journalit.',
  'home.guide.filters.title': 'These buttons change what your widgets show',
  'home.guide.filters.description':
    'Use these to switch the time period, trade type, or account so your Home widgets show the data you want to look at.',
  'home.guide.settings.title':
    'Tu configuración de Journalit siempre está a mano',
  'home.guide.settings.description':
    'Usa este botón para abrir directamente la configuración de Journalit.',
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
    'Previsualiza y añade widgets, restaura enlaces rápidos o añade accesos directos a cuentas y configuraciones. Todo lo que ya está en Inicio aparece en «En uso», donde puedes quitarlo.',
  'home.guide.move-and-resize.description':
    'This is the main area you can rearrange in edit mode. Drag widgets to move them, or drag a widget from its bottom-right corner to resize it.',
  'home.guide.add-widget.title': 'Añade elementos a Inicio',
  'home.guide.add-widget.description':
    'Abre Añadir Widget para añadir widgets, enlaces rápidos o accesos directos a cuentas y configuraciones.',
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
    'Escribe en el cuadro de búsqueda para encontrar un widget por nombre, descripción o categoría y selecciónalo. También puedes pulsar Siguiente y Journalit elegirá el primer resultado.',
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
  'tradelog.empty': 'No se encontraron operaciones',
  'tradelog.empty.submessage':
    'Comienza a crear notas de operación para que aparezcan en tu registro de operaciones.',
  'tradelog.processing': 'Procesando datos de operaciones...',
  'tradelog.node.file-not-found': 'Archivo de operación no encontrado: {path}',
  'tradelog.node.expand': 'Expandir',
  'tradelog.node.collapse': 'Contraer',
  'tradelog.node.navigate-to-review': 'Navegar a revisión de {type}',
  'tradelog.node.performance.year': 'año con {indicator} desempeño',
  'tradelog.node.performance.quarter':
    'trimestre con {indicator} desempeño de {year}',
  'tradelog.node.performance.month':
    'mes con {indicator} desempeño de {quarter} {year}',
  'tradelog.node.performance.week':
    'semana con {indicator} desempeño de {month} {year}',
  'tradelog.node.performance.day':
    'día con {indicator} desempeño de {week} {year}',
  'tradelog.node.performance.period': 'período con {indicator} desempeño',

  'tradelog.filter.all': 'Todas',
  'tradelog.filter.winners': 'Ganadoras',
  'tradelog.filter.losers': 'Perdedoras',
  'tradelog.filter.breakeven': 'Sin cambio',
  'tradelog.filter.breakeven.desc': 'Operaciones sin cambio',
  'tradelog.filter.open': 'Abiertas',
  'tradelog.filter.open.desc': 'Posiciones actualmente abiertas',
  'tradelog.filter.closed': 'Cerradas',

  'tradelog.type.regular': 'Regular',
  'tradelog.type.regular.desc': 'Operaciones estándar',
  'tradelog.type.missed': 'Perdida',
  'tradelog.type.backtest': 'Backtesting',

  
  'tradelog.status.win': 'GANANCIA',
  'tradelog.status.loss': 'PÉRDIDA',
  'tradelog.status.open': 'ABIERTA',
  'tradelog.status.partially-closed': 'PARCIALMENTE CERRADA',
  'tradelog.status.cancelled': 'CANCELADA',
  'tradelog.status.breakeven': 'SIN CAMBIO',
  'tradelog.status.missed': 'PERDIDA',
  'tradelog.status.backtest': 'BACKTESTING',
  'tradelog.status.expired': 'VENCIDA',

  'tradelog.no-columns': 'Sin columnas configuradas',
  'tradelog.duration.ongoing': '(en curso)',
  'tradelog.tooltip.mistakes': 'Errores:',
  'tradelog.tooltip.setups': 'Configuraciones:',
  'tradelog.tooltip.tags': 'Etiquetas:',
  'tradelog.tooltip.thesis': 'Tesis:',
  'tradelog.tooltip.mtComment': 'Comentario MT:',
  'tradelog.tooltip.accounts': 'Cuentas:',
  'tradelog.copy-trade.tooltip': 'Copied from {account} at {multiplier}x',
  'tradelog.tooltip.partial-exits': 'Salidas Parciales:',
  'tradelog.copy-trade.base-tooltip-title': 'Copied account results',
  'tradelog.copy-trade.adjustment-action': 'Adjust copied PnL',
  'tradelog.copy-trade.adjustment-title': 'Adjust copied PnL',
  'tradelog.copy-trade.adjustment-description-primary':
    'Enter the manual PnL adjustment for this copied trade.',
  'tradelog.copy-trade.adjustment-description-secondary':
    'Use a negative number for worse fills/costs.',
  'tradelog.copy-trade.adjustment-preview': 'Preview net P&L:',

  'tradelog.copy-trade.adjustment-invalid': 'Enter a valid PnL adjustment.',
  'tradelog.copy-trade.adjustment-saved': 'Copied trade PnL adjustment saved.',
  'tradelog.tooltip.still-open': 'aún abierta',

  'tradelog.alt.trade-image': 'Imagen {instrument}',
  'tradelog.alt.trade-image-n': 'Imagen {instrument} {n}',

  
  'tradelog.batch.delete-confirm.title': 'Confirmar Eliminación',
  'tradelog.batch.delete-confirm.message.one':
    '¿Estás seguro de que deseas eliminar {count} operación seleccionada?',
  'tradelog.batch.delete-confirm.message.few':
    '¿Estás seguro de que deseas eliminar {count} operaciones seleccionadas?',
  'tradelog.batch.delete-confirm.message.many':
    '¿Estás seguro de que deseas eliminar {count} operaciones seleccionadas?',
  'tradelog.batch.delete-confirm.message.other':
    '¿Estás seguro de que deseas eliminar {count} operaciones seleccionadas?',
  'tradelog.batch.delete-confirm.warning': 'Esta acción no se puede deshacer.',
  'tradelog.batch.setups.title': 'Añadir Configuraciones a Operaciones',
  'tradelog.batch.setups.placeholder': 'Seleccionar o crear configuraciones...',
  'tradelog.batch.tags.title': 'Add Tags to Trades',
  'tradelog.batch.tags.placeholder': 'Select or create tags...',
  'tradelog.batch.mistakes.title': 'Añadir Errores a Operaciones',
  'tradelog.batch.mistakes.placeholder': 'Seleccionar o crear errores...',
  'tradelog.batch.none-selected': 'NINGUNO SELECCIONADO',
  'tradelog.batch.selected-count': '{count} SELECCIONADO(S)',
  'tradelog.batch.select-all.title':
    'Seleccionar todas las operaciones visibles',
  'tradelog.batch.select-all.label': 'Seleccionar Todo',

  'tradelog.batch.already-reviewed':
    'Las {total} operaciones seleccionadas ya están revisadas',
  'tradelog.batch.already-reviewed-single':
    'La operación seleccionada ya está revisada',
  'tradelog.batch.already-reviewed-plain': 'ya revisada',
  'tradelog.batch.no-updates-needed':
    'Sin operaciones que actualizar - las {total} ya tenían estos {type}',
  'tradelog.batch.already-had-all': '{count} ya tenían todos los {type}',
  'tradelog.batch.errors-count.one': '{count} error ocurrió',
  'tradelog.batch.errors-count.few': '{count} errores ocurrieron',
  'tradelog.batch.errors-count.many': '{count} errores ocurrieron',
  'tradelog.batch.errors-count.other': '{count} errores ocurrieron',
  'tradelog.batch.enable-multi-select': 'Habilitar selección múltiple',
  'tradelog.batch.disable-multi-select': 'Desabilitar selección múltiple',
  'tradelog.batch.column-settings': 'Configuración de columnas',
  'tradelog.batch.marking-reviewed': 'Marcando...',
  'tradelog.batch.add-setups.aria': 'Añadir configuraciones',

  'tradelog.batch.add-setups.label': 'Añadir Configuraciones',
  'tradelog.batch.add-tags.aria': 'Add tags',

  'tradelog.batch.add-tags.label': 'Add Tags',
  'tradelog.batch.add-mistakes.aria': 'Añadir errores',

  'tradelog.batch.add-mistakes.label': 'Añadir Errores',
  'tradelog.batch.adding': 'Añadiendo...',
  'tradelog.batch.add-count': 'Añadir ({count})',
  'tradelog.batch.duplicate.aria': 'Duplicar operaciones',
  'tradelog.batch.duplicate.label': 'Duplicar',
  'tradelog.batch.duplicating': 'Duplicando...',
  'tradelog.batch.duplicate-skipped.one':
    '{count} nota seleccionada no se puede duplicar',
  'tradelog.batch.duplicate-skipped.few':
    '{count} notas seleccionadas no se pueden duplicar',
  'tradelog.batch.duplicate-skipped.many':
    '{count} notas seleccionadas no se pueden duplicar',
  'tradelog.batch.duplicate-skipped.other':
    '{count} notas seleccionadas no se pueden duplicar',
  'tradelog.batch.delete.aria': 'Eliminar operaciones',

  'tradelog.batch.deleting': 'Eliminando...',
  'tradelog.batch.clear.aria': 'Limpiar selección',

  'tradelog.batch.clear.label': 'Limpiar',

  
  
  
  'tradelog.settings.active-columns': 'Columnas Activas',
  'tradelog.settings.available-columns': 'Columnas Disponibles',
  'tradelog.settings.active-desc':
    'Arrastra para reordenar columnas. Haz clic en X para eliminar.',
  'tradelog.settings.available-desc':
    'Haz clic en una columna para añadirla a tu tabla.',
  'tradelog.settings.no-active':
    'Sin columnas activas. Añade columnas desde la pestaña Disponibles.',
  'tradelog.settings.all-active': 'Todas las columnas están activas.',
  'tradelog.settings.expanded-view': 'Vista Expandida',
  'tradelog.settings.expanded-view-desc':
    'Mostrar etiquetas, configuraciones y errores como insignias de píldora',
  'tradelog.settings.expanded-view-aria': 'Alternar modo de vista expandida',
  'tradelog.settings.saving': 'Guardando...',
  'tradelog.settings.reset': 'Restablecer a Predeterminados',

  'tradelog.category.basic': 'Información Básica',
  'tradelog.category.timing': 'Temporización',
  'tradelog.category.prices': 'Precios',
  'tradelog.category.risk': 'Gestión de Riesgo',
  'tradelog.category.position': 'Posición y P&L',
  'tradelog.category.review': 'Revisión',

  'tradelog.column.image': 'Imagen',
  'tradelog.column.account': 'Cuenta',
  'tradelog.column.ticker': 'Símbolo',
  'tradelog.column.exchange': 'Bolsa',
  'tradelog.column.status': 'Estado',
  'tradelog.column.direction': 'Dirección',
  'tradelog.column.date': 'Fecha de Apertura',
  'tradelog.column.entryTime': 'Hora de Entrada',
  'tradelog.column.exitDate': 'Fecha de Cierre',
  'tradelog.column.exitTime': 'Hora de Salida',
  'tradelog.column.duration': 'Duración',
  'tradelog.column.expirationDate': 'Vencimiento',
  'tradelog.column.daysToExpiry': 'DTE',
  'tradelog.column.entryPrice': 'Entrada',
  'tradelog.column.exitPrice': 'Salida',
  'tradelog.column.priceMove': 'Mov. Precio',
  'tradelog.column.stopLoss': 'Stop Loss',
  'tradelog.column.slDistanceDollar': 'Dist. SL $',
  'tradelog.column.slDistancePercent': 'Dist. SL %',
  'tradelog.column.riskAmount': 'Riesgo $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.maePrice': 'Precio MAE',
  'tradelog.column.mfePrice': 'Precio MFE',
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': 'Tamaño #',
  'tradelog.column.positionValue': 'Tamaño $',
  'tradelog.column.fees': 'Comisiones',
  'tradelog.column.dividends': 'Dividendos',
  'tradelog.column.pnl': 'P&L Neto',
  'tradelog.column.returnPercent': 'Return %',
  'tradelog.column.setups': 'Configuraciones',
  'tradelog.column.mistakes': 'Errores',
  'tradelog.column.tags': 'Etiquetas',
  'tradelog.column.reviewed': 'Revisada',
  'tradelog.column.thesis': 'Tesis',
  'tradelog.column.mtComment': 'Comentario MT',

  
  
  
  'dashboard.title': 'Panel',
  'dashboard.no-data': 'No hay datos de trading disponibles',
  'dashboard.empty.message': 'No hay datos de trading disponibles',
  'dashboard.empty.submessage':
    'Importa operaciones anteriores para explorar tu rendimiento ahora o registra una nueva operación manualmente.',
  'dashboard.empty.import-action': 'Importar operaciones existentes',
  'dashboard.empty.manual-action': 'Añadir una operación manualmente',
  'dashboard.empty.filter-hint': 'Intenta ajustar la configuración de filtros',
  'dashboard.error.load-failed': 'Error al cargar datos',
  'dashboard.button.add-widget': 'Añadir Widget',
  'dashboard.button.save-layout': 'Guardar Diseño',
  'dashboard.button.edit-layout': 'Editar Diseño',

  
  'dashboard.metrics.netPnL': 'P&L Neto',
  'dashboard.metrics.incl-unrealized': 'incl. {value} no realizado',
  'dashboard.metrics.winRate': 'Tasa de Acierto',
  'dashboard.metrics.profitFactor': 'Factor de Ganancia',
  'dashboard.metrics.sharpeRatio': 'Ratio de Sharpe',
  'dashboard.metrics.expectancy': 'Expectativa',
  'dashboard.metrics.numTrades': 'Total de Operaciones',

  'dashboard.metrics.numWinTrades': 'Operaciones Ganadoras',
  'dashboard.metrics.numLossTrades': 'Operaciones Perdedoras',
  'dashboard.metrics.avgWin': 'Ganancia Promedio',
  'dashboard.metrics.avgLoss': 'Pérdida Promedio',
  'dashboard.metrics.totalCommission': 'Comisión Total',
  'dashboard.metrics.totalFees': 'Comisiones Totales',
  'dashboard.metrics.maxDrawdown': 'Max Drawdown',
  'dashboard.metrics.bestDay': 'Mejor Día',
  'dashboard.metrics.largestWin': 'Ganancia Mayor',
  'dashboard.metrics.largestLoss': 'Pérdida Mayor',
  'dashboard.metrics.longestWinStreak': 'Mejor Racha',
  'dashboard.metrics.longestLossStreak': 'Peor Racha',
  'dashboard.metrics.avgHoldTime': 'Tiempo Promedio de Tenencia',
  'dashboard.metrics.avgWinHoldTime': 'Tiempo Promedio de Ganancia',
  'dashboard.metrics.avgLossHoldTime': 'Tiempo Promedio de Pérdida',
  'dashboard.metrics.avgWinnerHeat': 'Calor Prom. Ganadores',
  'dashboard.metrics.winnerMaeP90': 'MAE P90 Ganadores',
  'dashboard.metrics.winnerMaeMedian': 'MAE Mediana Ganadores',
  'dashboard.metrics.avgLossHeat': 'Calor Prom. Pérdidas',
  'dashboard.metrics.winnerAvgMfe': 'MFE Prom. Ganadores',
  'dashboard.metrics.loserAvgMfe': 'MFE Prom. Perdedores',
  'dashboard.metrics.winnerMfeP90': 'MFE P90 Ganadores',
  'dashboard.metrics.loserMfeP90': 'MFE P90 Perdedores',
  'dashboard.metrics.avgRR': 'RR Promedio (Payoff)',
  'dashboard.metrics.avgRRRiskBased': 'RR Promedio (basado en R)',
  'dashboard.avgRR.tooltip.formula':
    'Fórmula: ganancia promedio / pérdida promedio',
  'dashboard.avgRR.tooltip.no-conversion':
    'Este ratio de payoff se basa en monedas mixtas sin conversión FX y puede ser engañoso.',
  'dashboard.sharpeRatio.tooltip.title': 'Ratio de Sharpe',
  'dashboard.sharpeRatio.tooltip.formula':
    'Fórmula: P&L neto promedio de trades cerrados / desviación estándar muestral del P&L neto de trades cerrados. La tasa libre de riesgo es 0 y el valor no está anualizado.',
  'dashboard.sharpeRatio.tooltip.coverage':
    'Calculado con {valid} de {total} trades cerrados',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    'Cobertura parcial: {valid} de {total} trades cerrados tienen P&L neto finito.',
  'dashboard.sharpeRatio.tooltip.no-data':
    'Requiere al menos dos trades cerrados con variabilidad de P&L distinta de cero.',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    'Este ratio de Sharpe se basa en divisas mixtas sin conversión FX y puede ser engañoso.',
  'dashboard.avgRRRiskBased.tooltip.title': 'RR Promedio (basado en R)',
  'dashboard.avgRRRiskBased.tooltip.formula':
    'Fórmula: R ganador promedio / R perdedor promedio',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    'Calculado con {valid} de {total} operaciones cerradas con datos de riesgo',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    'Ganadoras con riesgo válido: {wins}, perdedoras: {losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    'Cobertura de riesgo parcial: {valid} de {total} operaciones cerradas tienen datos de riesgo válidos.',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    'Datos insuficientes para calcular RR basado en R. Agrega datos de stop/riesgo y asegúrate de tener operaciones ganadoras y perdedoras válidas.',

  
  'dashboard.conversion.title': 'Convertido a {currency}',
  'dashboard.conversion.converted-total': 'Total Convertido',
  'dashboard.conversion.base': 'Base: {currency}',

  'dashboard.conversion.using-ecb': 'Usando tasas BCE ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Using broker-provided base-currency P&L for {count} {tradeLabel}',
  'dashboard.conversion.using-manual-rate':
    'Usando un tipo de cambio manual para {count} {tradeLabel}',
  'dashboard.conversion.partial-warning':
    '⚠ Los costes/riesgo en {currencies} no se pudieron convertir y están excluidos',
  'dashboard.conversion.trade-singular': 'trade',
  'dashboard.conversion.trade-plural': 'trades',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} de {total} trades ({excluded} excluidos: {currencies})',
  'dashboard.conversion.original-pnl': 'P&L original',
  'dashboard.conversion.converted-pnl': 'P&L convertido',
  'dashboard.conversion.details-label': 'Detalles de conversión de divisas',

  'dashboard.top-section.remove-metric': 'Eliminar métrica',
  'dashboard.top-section.failed-load': 'Error al cargar métricas',

  
  'dashboard.filter.date.today': 'Hoy',
  'dashboard.filter.date.yesterday': 'Ayer',
  'dashboard.filter.date.this-week': 'Esta Semana',
  'dashboard.filter.date.this-month': 'Este Mes',
  'dashboard.filter.date.this-quarter': 'Este Trimestre',
  'dashboard.filter.date.this-year': 'Este Año',
  'dashboard.filter.date.all-time': 'Todo el Tiempo',
  'dashboard.filter.date.custom': 'Personalizado',
  'dashboard.filter.date.from': 'Desde',
  'dashboard.filter.date.to': 'Hasta',

  
  'dashboard.filter.accounts.all': 'Todas las cuentas',
  'dashboard.filter.accounts.n-selected': '{count} cuentas',
  'dashboard.filter.accounts.select-all': 'Seleccionar todo',

  'dashboard.filter.accounts.none-found': 'No se encontraron cuentas',
  'dashboard.filter.accounts.phase-now': 'ahora',

  

  

  
  'dashboard.filter.tickers.none-found': 'No se encontraron símbolos',

  

  
  'dashboard.widgets.daily-performance.title': 'Desempeño Diario',
  'dashboard.widgets.daily-performance.period-aria': 'Período',
  'dashboard.widgets.daily-performance.period-days': '{count} Días',
  'dashboard.widgets.weekday-performance.title': 'Desempeño por Día de Semana',
  'dashboard.widgets.weekday-performance.metric-aria': 'Métrica',
  'dashboard.widgets.weekday-performance.metric.net': 'Neto',
  'dashboard.widgets.weekday-performance.metric.win-rate': 'Tasa de acierto',
  'dashboard.widgets.weekday-performance.metric.trades': 'Operaciones',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    'Tasa de acierto: {rate} ({wins}G / {losses}P)',
  'dashboard.widgets.weekday-performance.tooltip.trades':
    'Operaciones: {count}',
  'dashboard.widgets.hourly-performance.title': 'Desempeño por Hora',
  'dashboard.widgets.hourly-performance.tooltip.trades': 'Operaciones: {count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label':
    'Tasa de acierto',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    'Tasa de acierto: {rate} ({wins}G / {losses}P)',
  'dashboard.widgets.hourly-performance.bucket-aria': 'Tamaño del intervalo',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes} min',
  'dashboard.widgets.hourly-performance.metric-aria': 'Métrica',
  'dashboard.widgets.hourly-performance.metric.total': 'Total',
  'dashboard.widgets.hourly-performance.metric.average': 'Promedio',

  'dashboard.widgets.hourly-performance.metric.total-r': 'R total',

  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'Sin operaciones',
  'dashboard.widgets.setup-performance.title': 'Rendimiento por setups',
  'dashboard.widgets.setup-performance.description':
    'Barras que comparan el rendimiento por setup',
  'dashboard.widgets.setup-performance.empty':
    'No hay datos de rendimiento por setups',
  'dashboard.widgets.setup-performance.masked-label': 'Configuraciones',
  'dashboard.widgets.tag-performance.title': 'Rendimiento por etiquetas',
  'dashboard.widgets.tag-performance.description':
    'Barras que comparan el rendimiento por etiqueta',
  'dashboard.widgets.tag-performance.empty':
    'No hay datos de rendimiento por etiquetas',
  'dashboard.widgets.tag-performance.masked-label': 'Etiquetas',
  'dashboard.widgets.ticker-performance.title': 'Desempeño por Ticker',
  'dashboard.widgets.ticker-performance.metric-aria': 'Métrica',
  'dashboard.widgets.ticker-performance.view-aria': 'Modo de vista',
  'dashboard.widgets.ticker-performance.view.best-and-worst':
    'Mejores y peores',
  'dashboard.widgets.ticker-performance.view.best': 'Mejores 10',
  'dashboard.widgets.ticker-performance.view.worst': 'Peores 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': 'P&L total',
  'dashboard.widgets.ticker-performance.metric.total-r': 'R total',
  'dashboard.widgets.ticker-performance.metric.win-rate': 'Tasa de acierto',
  'dashboard.widgets.ticker-performance.tooltip.ticker': 'Ticker: {ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': 'Operaciones: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Tasa de acierto: {rate} ({wins}G / {losses}P)',

  'dashboard.widgets.ticker-performance.empty':
    'No hay datos de desempeño por ticker',
  'dashboard.widgets.ticker-performance.empty-submessage':
    'No hay operaciones cerradas con un ticker que coincida con los filtros actuales.',
  'dashboard.widgets.ticker-performance.masked-ticker': 'Ticker',
  'dashboard.widgets.ticker-performance.omitted-count': 'Omitidos: {count}',

  'dashboard.widgets.rollingStats.title': 'Promedio Móvil de Ganancia/Pérdida',
  'dashboard.widgets.rollingStats.period': 'Período',
  'dashboard.widgets.rollingStats.trades': '{count} Operaciones',
  'dashboard.widgets.rollingStats.avgWin': 'Ganancia Promedio',
  'dashboard.widgets.rollingStats.avgLoss': 'Pérdida Promedio',
  'dashboard.widgets.rollingStats.tooltip.trade': 'Operación {label}',

  
  'dashboard.rolling_win_loss.title': 'Proporción de Ganancia/Pérdida Móvil',
  'dashboard.rolling_win_loss.period_aria': 'Período',
  'dashboard.rolling_win_loss.trades_count': '{count} Operaciones',
  'dashboard.rolling_win_loss.trade_label': 'Operación {label}',
  'dashboard.rolling_win_loss.ratio_label': 'Proporción: {ratio}',
  'dashboard.rolling_win_loss.ratio_undefined':
    'Proporción: sin pérdidas en el periodo',
  'dashboard.rolling_win_loss.avg_win_label': 'Ganancia Promedio: {value}',
  'dashboard.rolling_win_loss.no_losses_band': 'Sin pérdidas',
  'dashboard.rolling_win_loss.window_not_filled':
    'Requiere al menos {count} operaciones cerradas',
  'dashboard.rolling_win_loss.avg_loss_label': 'Pérdida Promedio: {value}',

  
  'dashboard.selector.title': 'Añadir al Panel',
  'dashboard.selector.subtitle':
    'Explora gráficos y métricas por su vista previa y haz clic en uno para añadirlo al Panel.',
  'dashboard.selector.tab.performance': 'Rendimiento',
  'dashboard.selector.tab.breakdowns': 'Desgloses',
  'dashboard.selector.tab.risk': 'Riesgo y análisis',
  'widget-drawer.tab.all': 'Todos',
  'widget-drawer.search.placeholder': 'Buscar widgets',
  'widget-drawer.section.available': 'Disponibles',
  'widget-drawer.section.in-use': 'En uso',
  'widget-drawer.empty-search': 'Ningún widget coincide con tu búsqueda',
  'widget-drawer.added-count': '{count} añadidos',
  'widget-drawer.add-aria': 'Añadir {name}',
  'widget-drawer.remove': 'Quitar',
  'widget-drawer.remove-aria': 'Quitar {name}',
  'widget-drawer.close': 'Cerrar',
  'dashboard.selector.metrics': 'Métricas',

  

  
  
  

  'view.dashboard': 'Panel',
  'view.trade-log': 'Registro de Operaciones',
  'view.account-dashboard': 'Cuentas',
  'view.layout-builder': 'Constructor de Diseño',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': 'Calendario económico',
  'view.economic-calendar.this-week': 'Esta semana',
  'view.economic-calendar.sync.aria': 'Abrir ajustes del calendario económico',
  'view.economic-calendar.import-count.one': 'Importar {count} evento',
  'view.economic-calendar.import-count.few': 'Importar {count} eventos',
  'view.economic-calendar.import-count.many': 'Importar {count} eventos',
  'view.economic-calendar.import-count.other': 'Importar {count} eventos',
  'view.economic-calendar.imported': 'Importado',
  'view.economic-calendar.update-available': 'Actualización disponible',
  'view.economic-calendar.filter.currency': 'Divisa',
  'view.economic-calendar.filter.impact': 'Impacto',
  'view.economic-calendar.impact.high': 'Alto',
  'view.economic-calendar.impact.medium': 'Medio',
  'view.economic-calendar.impact.low': 'Bajo',
  'view.economic-calendar.impact.none': 'Ninguno',
  'view.economic-calendar.pro-required':
    'El calendario económico requiere Journalit Pro',
  'view.economic-calendar.error.offline':
    'No se puede cargar el calendario económico sin conexión.',
  'view.economic-calendar.error.generic':
    'No se puede cargar el calendario económico.',
  'view.economic-calendar.empty': 'No hay eventos económicos para esta semana.',
  'view.economic-calendar.refresh': 'Actualizar eventos',
  'view.economic-calendar.retry': 'Reintentar',
  'view.economic-calendar.select-all': 'Seleccionar todo',
  'view.economic-calendar.select-aria': 'Seleccionar {event}',
  'view.economic-calendar.impact-aria': 'Impacto: {impact}',
  'view.economic-calendar.all-day': 'Todo el día',
  'view.economic-calendar.holiday-aria': 'Festivo',
  'view.economic-calendar.forecast': 'Previsión',
  'view.economic-calendar.previous': 'Anterior',
  'view.economic-calendar.actual': 'Actual',
  'view.economic-calendar.import-success':
    '{imported} importados, {updated} actualizados',
  'view.economic-calendar.import-failed':
    'No se pudieron importar los eventos.',
  'view.economic-calendar.restore-missing-events':
    'Restaurar eventos que faltan ({count})',
  'economicCalendar.guide.main.intro.description':
    'Consulta aquí la semana completa. Journalit también puede mantener actualizado tu resumen semanal automáticamente, por lo que la importación manual es opcional.',
  'economicCalendar.guide.main.filters.title':
    'Estos filtros solo cambian este calendario',
  'economicCalendar.guide.main.filters.description':
    'Los filtros de divisa e impacto limitan lo que ves y seleccionas aquí. No cambian las reglas de importación automática.',
  'economicCalendar.guide.main.settings.title':
    'Configura la importación automática en Ajustes',
  'economicCalendar.guide.main.settings.description':
    'Usa este botón para elegir divisas, niveles de impacto y festivos, y activa la importación automática. Journalit sincroniza la semana actual con tu resumen semanal y actualiza los datos importados sin volver a añadir eventos que eliminaste deliberadamente.',
  'economicCalendar.guide.main.manual-import.title':
    'Las importaciones manuales son opcionales',
  'economicCalendar.guide.main.manual-import.description':
    'Selecciona filas visibles y usa Importar eventos para una importación puntual. No tienes que hacerlo cada semana si la importación automática está activada.',
  'economicCalendar.guide.main.restore.title':
    'Restaura eventos configurados que faltan',
  'economicCalendar.guide.main.restore.description':
    'Este botón estará disponible si faltan eventos del ámbito de importación automática guardado. Cuando la semana vuelva a estar completa, seguirá visible pero desactivado.',
  'economicCalendar.guide.main.summary.title': 'Configúralo una vez y revisa',
  'economicCalendar.guide.main.summary.description':
    'Después de configurar la importación automática, tu resumen semanal se mantiene completo. Vuelve aquí para explorar, hacer importaciones puntuales o restaurar eventos que falten.',
  'view.economic-calendar.pro-benefit':
    'Eventos de alto impacto en tu nota semanal.',
  'view.economic-calendar.pro-benefit-trial':
    'Empieza con una prueba gratuita de 14 días.',
  'view.economic-calendar.sign-in': '¿Ya tienes Pro? Inicia sesión',
  'settings.economic-calendar.title': 'Calendario económico',
  'settings.economic-calendar.description':
    'Importa automáticamente los eventos económicos de esta semana a los eventos clave de tu nota semanal.',
  'settings.economic-calendar.auto-import':
    'Importar eventos semanales automáticamente',
  'settings.economic-calendar.auto-import-desc':
    'Mantiene la nota semanal actual sincronizada con el calendario.',
  'settings.economic-calendar.currencies': 'Divisas',
  'settings.economic-calendar.currencies-desc':
    'Importar eventos de estas divisas. Sin selección se incluyen todas.',
  'settings.economic-calendar.impacts': 'Niveles de impacto',
  'settings.economic-calendar.impacts-desc':
    'Importar eventos con estos niveles de impacto.',
  'settings.economic-calendar.impacts-empty':
    'No hay publicaciones seleccionadas. Los festivos aún pueden importarse si están activados.',
  'settings.economic-calendar.include-holidays': 'Incluir festivos',
  'settings.economic-calendar.include-holidays-desc':
    'Importa festivos bancarios y actas de bancos centrales como entradas de todo el día.',
  'settings.economic-calendar.open-view': 'Abrir calendario económico',
  'settings.economic-calendar.open-view-desc':
    'Revisa esta semana e importa eventos manualmente.',
  'settings.economic-calendar.pro-required':
    'El calendario económico requiere una suscripción PRO.',

  
  
  

  
  
  
  'account.header.title': 'Cuenta: {name}',
  'account.header.back-to-dashboard': 'Volver al panel',
  'account.header.add-event.aria': 'Agregar Depósito/Retiro',
  'account.header.edit-account.aria': 'Editar Cuenta',
  'account.header.view-trades.aria': 'View trades in Trade Log',
  'account.header.type': 'Tipo:',
  'account.header.initial-balance': 'Saldo Inicial:',
  'account.header.current-balance': 'Saldo Actual:',
  'account.header.account-id': 'ID de Cuenta:',
  'account.header.warning.trades-before-creation.one':
    '{count} operación encontrada antes de la fecha de creación',
  'account.header.warning.trades-before-creation.few':
    '{count} operaciones encontradas antes de la fecha de creación',
  'account.header.warning.trades-before-creation.many':
    '{count} operaciones encontradas antes de la fecha de creación',
  'account.header.warning.trades-before-creation.other':
    '{count} operaciones encontradas antes de la fecha de creación',
  'account.header.warning.trades-before-phase.one':
    '{count} operación encontrada antes del inicio de la Fase 1',
  'account.header.warning.trades-before-phase.few':
    '{count} operaciones encontradas antes del inicio de la Fase 1',
  'account.header.warning.trades-before-phase.many':
    '{count} operaciones encontradas antes del inicio de la Fase 1',
  'account.header.warning.trades-before-phase.other':
    '{count} operaciones encontradas antes del inicio de la Fase 1',
  'account.header.warning.earliest-trade-phase':
    'Primera operación: {date}. Las operaciones anteriores al inicio de la fase no cuentan para el desafío.',
  'account.header.notice.phase-start-updated':
    'Inicio de la Fase 1 movido a {date}',
  'account.header.warning.earliest-trade':
    'Primera operación: {date}. Esto puede causar cálculos de saldo incorrectos.',
  'account.header.warning.fix-phase-start.aria':
    'Corregir el inicio de la Fase 1',
  'account.header.warning.fix-date.aria':
    'Corregir fecha de creación de cuenta',
  'account.header.warning.fixing': 'Corrigiendo...',
  'account.header.warning.fix-date': 'Corregir Fecha',
  'account.header.notice.date-updated':
    'Fecha de creación de cuenta actualizada a {date}',
  'account.header.notice.update-failed-log':
    'Error al actualizar la fecha de creación de cuenta:',
  'account.header.notice.update-failed': 'Error al actualizar fecha: {error}',

  
  
  
  'account.type.demo': 'Demo',
  'account.type.evaluation': 'Evaluación',
  'account.type.funded': 'Fondeada',
  'account.type.archived': 'Archivada',

  
  
  
  'account.settings.modal.title': 'Configuración del Panel de Cuentas',
  'account.settings.notice.name-empty':
    'El nombre del tipo de cuenta no puede estar vacío',
  'account.settings.notice.type-exists': 'El tipo de cuenta "{name}" ya existe',
  'account.settings.notice.reserved-name':
    '"{name}" es un nombre de tipo de cuenta reservado',
  'account.settings.notice.type-added':
    'Tipo de cuenta "{name}" agregado exitosamente',
  'account.settings.notice.add-error':
    'Error al agregar tipo de cuenta: {error}',
  'account.settings.notice.cannot-delete-archived':
    'No se puede eliminar el tipo "Archivada" - está reservado para archivar cuentas',
  'account.settings.notice.analyze-error':
    'Error al analizar uso del tipo de cuenta',
  'account.settings.notice.cannot-delete-has-accounts':
    'No se puede eliminar "{name}" - tiene {count} cuentas asociadas. Función de migración próximamente.',
  'account.settings.notice.saved':
    'Configuración del panel de cuentas guardada exitosamente',
  'account.settings.notice.save-error':
    'Error al guardar configuración: {error}',
  'account.settings.notice.migration-target-required':
    'Por favor seleccione un tipo de cuenta destino para reasignación',
  'account.settings.notice.migration-failed': 'Migración fallida: {error}',
  'account.settings.notice.type-deleted':
    'Tipo de cuenta "{name}" eliminado exitosamente',
  'account.settings.notice.type-deleted-with-cleanup':
    'Tipo de cuenta "{name}" eliminado exitosamente (limpiados: {actions})',
  'account.settings.notice.migration-error': 'Error durante migración: {error}',
  'account.settings.notice.delete-error':
    'Error al eliminar tipo de cuenta: {error}',
  'account.settings.notice.operation-failed': '{operation} fallida: {error}',
  'account.settings.notice.migration-no-targets':
    'No se pueden migrar cuentas - no hay otros tipos de cuenta disponibles. Cree un nuevo tipo primero.',
  'account.settings.notice.type-deleted-migrated':
    'Tipo de cuenta "{name}" eliminado exitosamente. {count} cuentas {action}',
  'account.settings.operation.type-deletion': 'Eliminación de tipo de cuenta',
  'account.settings.migration.error.target-required':
    'Tipo destino requerido para reasignación',
  'account.settings.migration.error.invalid-option':
    'Opción de migración inválida',
  'account.settings.unnamed-account': 'Cuenta Sin Nombre',
  'account.settings.migration.title': 'Migrar Cuentas Antes de Eliminar',
  'account.settings.migration.warning':
    'Está por eliminar "{name}" que tiene {count} cuentas asociadas.',
  'account.settings.migration.instruction':
    'Estas cuentas deben ser manejadas antes de poder eliminar el tipo:',
  'account.settings.migration.more-accounts': '... y {count} más',
  'account.settings.migration.choose-option':
    'Elija cómo manejar estas cuentas:',
  'account.settings.migration.option.reassign.title': 'Reasignar a otro tipo',
  'account.settings.migration.option.reassign.desc':
    'Mover todas las cuentas a otro tipo de cuenta',
  'account.settings.migration.target-type.label': 'Tipo de cuenta destino:',
  'account.settings.migration.option.archive.title': 'Archivar cuentas',
  'account.settings.migration.option.archive.desc':
    'Mover todas las cuentas a estado "archivada"',
  'account.settings.migration.option.delete.title': 'Marcar para eliminación',
  'account.settings.migration.option.delete.desc':
    'Marcar todas las cuentas como eliminadas',
  'account.settings.migration.button.migrate': 'Migrar y Eliminar Tipo',
  'account.settings.migration.button.migrating': 'Migrando...',
  'account.settings.migration.action.reassigned': 'reasignadas a "{target}"',
  'account.settings.migration.action.archived': 'movidas a estado archivada',
  'account.settings.migration.action.deleted': 'marcadas para eliminación',
  'account.settings.delete.title': 'Eliminar Tipo de Cuenta',
  'account.settings.delete.confirm-question':
    '¿Está seguro que desea eliminar el tipo de cuenta "{name}"?',
  'account.settings.delete.impact-analysis': 'Análisis de Impacto:',
  'account.settings.delete.affected-accounts':
    '⚠️ {count} cuenta(s) afectada(s):',
  'account.settings.delete.migration-notice':
    'Nota: Estas cuentas deberán ser reasignadas a un tipo diferente antes de poder proceder con la eliminación.',
  'account.settings.delete.no-affected':
    '✅ Ninguna cuenta está usando este tipo de cuenta',
  'account.settings.delete.cleanup-title':
    'Configuraciones que serán limpiadas:',
  'account.settings.delete.cleanup.excluded':
    '✓ Eliminado de tipos de cuenta excluidos',
  'account.settings.delete.cleanup.order':
    '✓ Eliminado del orden de visualización',
  'account.settings.delete.cleanup.withdrawals':
    '✓ Eliminado de configuración de retiros',
  'account.settings.delete.cleanup.none':
    'No se necesita limpieza de configuración',
  'account.settings.delete.button.setup-migration': 'Configurar Migración',
  'account.settings.delete.button.delete': 'Eliminar Tipo de Cuenta',
  'account.settings.delete.button.deleting': 'Eliminando...',
  'account.settings.section.available-types.title':
    'Tipos de Cuenta Disponibles',
  'account.settings.section.available-types.desc':
    'Tipos de cuenta actuales en su sistema.',
  'account.settings.section.available-types.placeholder':
    'Ingrese nombre del tipo de cuenta...',
  'account.settings.section.available-types.add-aria':
    'Agregar nuevo tipo de cuenta',
  'account.settings.section.available-types.delete-aria': 'Eliminar {name}',
  'account.settings.section.available-types.empty':
    'No hay tipos de cuenta personalizados definidos.',
  'account.settings.section.challenge-stages.title': 'Etapas del desafío',
  'account.settings.section.challenge-stages.desc':
    'Tipo de cuenta que se aplica cuando un desafío alcanza esta etapa.',
  'account.settings.section.challenge-stages.no-change': 'Sin cambios',
  'account.settings.section.challenge-stages.aria':
    'Tipo de cuenta para {stage}',
  'account.settings.section.inclusion.title':
    'Configuración de Inclusión en Panel',
  'account.settings.section.inclusion.desc':
    'Elija qué tipos de cuenta incluir en los cálculos del panel. También configure si los retiros de cada tipo se incluyen en las métricas de retiros totales.',
  'account.settings.section.inclusion.include-dashboard':
    'En estadísticas del panel',
  'account.settings.section.inclusion.include-withdrawals': 'Retiros',
  'account.settings.section.inclusion.empty':
    'No hay tipos de cuenta disponibles para configurar.',
  'account.settings.section.order.title': 'Orden de Visualización',

  'account.settings.section.order.move-up': 'Subir',
  'account.settings.section.order.move-down': 'Bajar',
  'account.settings.button.save': 'Guardar Configuración',
  'account.settings.button.saving': 'Guardando...',

  
  
  
  'account.create.title': 'Crear Cuenta',
  'account.create.field.name': 'Nombre de Cuenta',
  'account.create.field.name-desc': 'Un nombre único para tu cuenta de trading',
  'account.create.placeholder.name': 'Mi Cuenta de Trading',
  'account.create.field.type': 'Tipo de Cuenta',
  'account.create.field.type-desc': 'El tipo de cuenta de trading',
  'account.create.field.initial-balance': 'Saldo Inicial',
  'account.create.field.initial-balance-desc':
    'Saldo inicial de la cuenta (opcional, por defecto 0)',
  'account.create.field.live-balance': 'Saldo en Vivo',
  'account.create.field.live-balance-desc':
    'Saldo actual del bróker sin crear un movimiento de efectivo',
  'account.create.field.creation-date': 'Fecha de Creación',
  'account.create.field.creation-date-desc': 'Cuándo se creó la cuenta',
  'account.create.field.currency': 'Moneda',
  'account.create.field.currency-desc':
    'Moneda nativa de la cuenta para mostrar',
  'account.create.field.drawdown-type': 'Tipo de Drawdown',

  'account.create.field.drawdown-amount': 'Monto de Drawdown',
  'account.create.field.drawdown-amount-desc': 'Límite máximo de drawdown',
  'account.create.field.profit-target-desc':
    'Establecer objetivo de ganancias para la cuenta',
  'account.create.field.monthly-cost': 'Costo Mensual',
  'account.create.field.monthly-cost-desc':
    'Cuotas de suscripción, costos de plataforma',
  'account.create.field.target-type': 'Tipo de Objetivo',
  'account.create.field.target-type-desc': 'Absoluto o porcentaje',
  'account.create.field.target-percent': 'Objetivo (%)',
  'account.create.field.target-dollar': 'Objetivo ($)',
  'account.create.field.target-percent-desc': 'Objetivo de ganancia porcentual',
  'account.create.field.target-dollar-desc': 'Objetivo de monto en dólares',
  'account.create.field.target-date': 'Fecha Objetivo (Opcional)',
  'account.create.field.target-date-desc':
    'Fecha para alcanzar el objetivo de ganancias',
  'account.create.type.demo': 'Demo',
  'account.create.type.evaluation': 'Evaluación',
  'account.create.type.funded': 'Fondeada',
  'account.create.success': 'Cuenta "{name}" creada exitosamente',
  'account.create.error.name-required': 'El nombre de cuenta es requerido',
  'account.create.error.name-exists':
    'Ya existe una cuenta con el nombre "{name}"',
  'account.create.error.rule-incomplete':
    'Cada regla activada necesita un valor mayor que cero',
  'account.create.error.balance-negative':
    'El saldo inicial no puede ser negativo',
  'account.create.error.invalid-live-balance': 'El saldo en vivo no es válido',
  'account.create.error.drawdown-required':
    'El monto de drawdown es requerido cuando el tipo de drawdown está habilitado',
  'account.create.error.profit-target-required':
    'El monto del objetivo de ganancias es requerido cuando está habilitado',
  'account.create.error.invalid-date': 'Fecha de creación inválida',
  'account.create.error.future-date':
    'La fecha de creación no puede ser futura',
  'account.create.error.cost-negative':
    'El costo mensual no puede ser negativo',
  'account.create.error.service-unavailable':
    'El servicio de cuentas no está disponible. Por favor intente de nuevo.',
  'account.create.error.fix-target-date':
    'Por favor corrija el error de fecha objetivo antes de crear la cuenta',
  'account.create.error.invalid-target-date':
    'Fecha objetivo de ganancias inválida',
  'account.create.error.failed': 'Error al crear cuenta: {error}',

  
  
  
  'account.edit.modal.change-date.message':
    'Estás a punto de cambiar la fecha de creación de la cuenta "{account}" de {oldDate} a {newDate}.',
  'account.edit.modal.change-date.warning':
    'Esto actualizará la fecha de la transacción del depósito inicial y puede afectar los cálculos de la antigüedad de la cuenta, los ciclos de facturación mensuales y otras métricas basadas en fechas.',

  'account.edit.modal.change-balance.message':
    'Estás a punto de cambiar el saldo inicial de {oldBalance} a {newBalance}.',

  'account.edit.modal.change-balance.info':
    'Esto afectará a todos los cálculos de saldo, porcentajes de P&L, cálculos de drawdown e historial de transacciones.',
  'account.edit.modal.delete.question':
    '¿Estás seguro de que deseas eliminar permanentemente la cuenta "{name}"?',

  
  
  
  'account.edit-event.title': 'Editar {type}',
  'account.edit-event.field.type': 'Tipo de Transacción',
  'account.edit-event.field.type-desc': 'No se puede cambiar al editar',
  'account.edit-event.field.amount': 'Monto',
  'account.edit-event.field.amount-desc': 'Monto en {currency}',
  'account.edit-event.field.date': 'Fecha',
  'account.edit-event.field.date-desc': 'Fecha de transacción',
  'account.edit-event.field.description': 'Descripción (Opcional)',
  'account.edit-event.field.description-desc': 'Notas adicionales',
  'account.edit-event.button.save': 'Guardar Cambios',
  'account.edit-event.button.saving': 'Guardando...',
  'account.edit-event.button.delete': 'Eliminar {type}',
  'account.edit-event.button.deleting': 'Eliminando...',
  'account.edit-event.success.update': '{type} actualizado exitosamente',
  'account.edit-event.success.delete': '{type} eliminado exitosamente',
  'account.edit-event.error.update': 'Error al actualizar transacción: {error}',
  'account.edit-event.error.delete': 'Error al eliminar transacción: {error}',
  'account.edit-event.delete-confirm.title': 'Eliminar {type}',
  'account.edit-event.delete-confirm.message':
    '¿Está seguro que desea eliminar este {type} de {amount} del {date}?',
  'account.edit-event.delete-confirm.warning':
    'Esta acción no se puede deshacer.',

  
  
  
  'account.edit.title': 'Editar Cuenta',
  'account.edit.convert.discard-title': '¿Descartar los cambios sin guardar?',
  'account.edit.convert.discard-message':
    'La configuración del desafío se abre en su propia ventana y cierra este formulario. Los cambios hechos aquí no se guardarán.',
  'account.edit.convert.discard-confirm': 'Descartar y continuar',
  'account.edit.field.name': 'Nombre de Cuenta',
  'account.edit.field.name-desc': 'El nombre único para esta cuenta',
  'account.edit.placeholder.name': 'ej., Mi Cuenta de Trading',
  'account.edit.field.type': 'Tipo de Cuenta',
  'account.edit.field.type-desc': 'Tipo de cuenta de trading',
  'account.edit.type.demo': 'Demo',
  'account.edit.type.evaluation': 'Evaluación',
  'account.edit.type.funded': 'Fondeada',
  'account.edit.field.initial-balance': 'Saldo Inicial',
  'account.edit.field.initial-balance-desc': 'Saldo inicial de la cuenta',
  'account.edit.field.live-balance': 'Saldo en Vivo',
  'account.edit.field.live-balance-desc':
    'Saldo actual del bróker sin crear un movimiento de efectivo',
  'account.edit.field.creation-date': 'Fecha de Creación',
  'account.edit.field.creation-date-desc': 'Cuándo se creó la cuenta',
  'account.edit.field.currency': 'Moneda',
  'account.edit.field.currency-desc': 'Moneda nativa de la cuenta para mostrar',
  'account.edit.field.drawdown-type': 'Tipo de Drawdown',

  'account.edit.field.drawdown-amount': 'Monto de Drawdown',
  'account.edit.field.drawdown-amount-desc':
    'Pérdida máxima permitida desde el saldo inicial',
  'account.edit.field.manual-snapshots': 'Snapshots Manuales de Drawdown',
  'account.edit.field.manual-snapshots-desc':
    'Administrar snapshots diarios de saldo para cálculo de drawdown EOD trailing',
  'account.edit.field.profit-target-desc':
    'Establecer objetivo de ganancias para la cuenta',
  'account.copy-trading.title': 'Copy Trading',
  'account.copy-trading.description':
    'Derive this account’s performance from another account using historical copy periods.',
  'account.copy-trading.enable': 'This account copies another account',
  'account.copy-trading.existing-trades-warning':
    'This account already has direct trades. They will remain, and copied trades will be added from the selected start date.',
  'account.copy-trading.base-account': 'Base Account',
  'account.copy-trading.base-account-desc':
    'Only same-currency non-copy accounts can be selected.',
  'account.copy-trading.base-account-placeholder': 'Select base account',
  'account.copy-trading.multiplier': 'Multiplier',
  'account.copy-trading.multiplier-desc': 'Allowed range: 0.1x to 100x',
  'account.copy-trading.all-history': 'Copy all historical trades',
  'account.copy-trading.start-date': 'Copy From Date',
  'account.copy-trading.history': 'Copy history',
  'account.copy-trading.error.base-required':
    'Select a base account for copy trading.',
  'account.copy-trading.error.multiplier-range':
    'Copy trading multiplier must be between 0.1x and 100x.',
  'account.copy-trading.error.start-date-required':
    'Select a copy trading start date.',
  'account.edit.field.monthly-cost': 'Costo Mensual',
  'account.edit.field.monthly-cost-desc':
    'Cuotas de suscripción, costos de plataforma',
  'account.copy-trading.error.base-account-is-copied':
    'This account is already used as a base account and cannot copy another account.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'This account is currently the base for another copy account.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'Base accounts cannot also be copy accounts.',
  'account.prop-challenge.summary.status.archived': 'Archivado',
  'account.prop-challenge.summary.status.hidden': 'Oculto',
  'account.prop-challenge.actions.progress-to': 'Avanzar a {phase}',
  'account.prop-challenge.actions.progress': 'Avanzar a la siguiente fase',
  'account.prop-challenge.actions.mark-passed': 'Marcar desafío como superado',
  'account.prop-challenge.actions.mark-failed': 'Marcar como fallido',
  'account.prop-challenge.actions.archive': 'Archivar desafío',
  'account.prop-challenge.actions.stale':
    'Este desafío se actualizó en otro lugar. Revísalo e inténtalo de nuevo.',
  'account.prop-challenge.actions.reopen': 'Reabrir',
  'account.prop-challenge.actions.link-rules': 'Vincular a reglas de la firma…',
  'account.prop-challenge.view-trades': 'Ver operaciones de {phase}',
  'account.prop-challenge.actions.manual': 'Acciones manuales',
  'account.prop-challenge.notice.failed-title': '{phase} fallida',
  'account.prop-challenge.notice.failed-description':
    '{rule} incumplida el {date}',
  'account.prop-challenge.notice.failed-manual': 'Marcada como fallida',
  'account.prop-challenge.notice.keep-open': 'Mantener abierta',
  'account.prop-challenge.notice.target-title': 'Objetivo de {phase} alcanzado',
  'account.prop-challenge.notice.target-description':
    'Se cumplen todos los requisitos. ¿Pasar a {next}?',
  'account.prop-challenge.notice.breach-after-reached':
    'Se incumplieron reglas después de alcanzar el objetivo a las {time}. Ajusta la hora de transición para dejar esos trades fuera de esta fase.',
  'account.prop-challenge.notice.not-yet': 'Todavía no',
  'account.prop-challenge.notice.passed-title': 'Evaluación superada',
  'account.prop-challenge.notice.passed-description':
    'Se cumplen todos los requisitos. ¿Marcar el challenge como superado?',
  'account.prop-challenge.notice.payout-title': 'Pago disponible: {amount}',
  'account.prop-challenge.notice.payout-plan': 'Tu plan: retirar {amount}',
  'account.prop-challenge.notice.record-payout': 'Registrar pago',
  'account.prop-challenge.notice.skip-cycle': 'Omitir este ciclo',
  'account.prop-challenge.notice.payout-description': 'Pago',
  'account.prop-challenge.notice.lost-title': 'El pago ya no está disponible',
  'account.prop-challenge.notice.lost-description': 'Pendiente: {requirements}',
  'account.prop-challenge.notice.dismiss': 'Descartar',
  'account.prop-challenge.notice.unknown-title': 'Cuenta nueva {label}',
  'account.prop-challenge.notice.unknown-description':
    '{count} operaciones desde {date} no están asignadas a una fase.',
  'account.prop-challenge.notice.unknown-description-one':
    '1 operación desde {date} no está asignada a ninguna fase.',
  'account.prop-challenge.notice.same-phase': 'Misma fase',
  'account.prop-challenge.notice.not-now': 'Ahora no',
  'account.prop-challenge.notice.error': 'No se pudo actualizar el aviso.',
  'account.prop-challenge.notice.type-changed':
    'Tipo de cuenta cambiado a {accountType}',
  'account.prop-challenge.payout.plan.title': 'Plan de pagos',
  'account.prop-challenge.payout.plan.notify-minimum':
    'Avisar a partir de ({currency})',
  'account.prop-challenge.payout.plan.withdrawal': 'Retiro sugerido',
  'account.prop-challenge.payout.plan.full': 'Importe completo',
  'account.prop-challenge.payout.plan.percent': 'Porcentaje del disponible',
  'account.prop-challenge.payout.plan.amount': 'Importe fijo',
  'account.prop-challenge.payout.plan.percent-invalid':
    'Introduce un porcentaje entre 1 y 100.',
  'account.prop-challenge.payout.plan.amount-invalid':
    'Introduce un importe mayor que cero.',
  'account.prop-challenge.payout.plan.percent-value': 'Porcentaje',
  'account.prop-challenge.payout.plan.amount-value': 'Importe ({currency})',
  'account.prop-challenge.payout.plan.save': 'Guardar plan',
  'account.prop-challenge.payout.plan.saved': 'Plan de pagos guardado.',
  'account.prop-challenge.payout.plan.summary-notify': 'avisar ≥ {amount}',
  'account.prop-challenge.payout.plan.summary-percent': 'sugerir {percent}%',
  'account.prop-challenge.payout.plan.summary-amount': 'sugerir {amount}',
  'account.prop-challenge.payout.plan.summary-full': 'importe completo',
  'account.prop-challenge.actions.error':
    'No se pudo actualizar el desafío de prop firm.',
  'account.prop-challenge.confirm.advance':
    '¿Confirmar este resultado y continuar el desafío?',
  'account.prop-challenge.confirm.advance-with-promotion':
    'This will advance the challenge and change the account type to {accountType}.',
  'account.prop-challenge.confirm.fail':
    '¿Marcar {account} como fallida? El desafío «{challenge}» termina en {phase}.',
  'account.prop-challenge.confirm.archive-failed':
    '¿Archivar {account}? El desafío «{challenge}» falló. La cuenta pasa a Archivadas.',
  'account.prop-challenge.confirm.archive-passed':
    '¿Archivar {account}? El desafío «{challenge}» fue superado. La cuenta pasa a Archivadas.',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → desafío superado',
  'account.prop-challenge.confirm.reopen':
    '¿Reabrir {account}? El desafío «{challenge}» vuelve a {phase}.',
  'account.prop-challenge.transition.time': 'Hora de transición',
  'account.prop-challenge.transition.now': 'Ahora',
  'account.prop-challenge.transition.when-target-reached':
    'Cuando se alcanzó el objetivo',
  'account.prop-challenge.transition.too-early':
    'La hora de transición no puede ser anterior al inicio de esta fase.',
  'account.prop-challenge.costs.title': 'Costes únicos',
  'account.prop-challenge.costs.description':
    'Registra por separado las tarifas de compra, reinicio y activación.',
  'account.prop-challenge.costs.kind': 'Tipo',
  'account.prop-challenge.costs.kind.purchase': 'Compra',
  'account.prop-challenge.costs.kind.reset': 'Reinicio',
  'account.prop-challenge.costs.kind.activation': 'Activación',
  'account.prop-challenge.costs.kind.other': 'Otro',
  'account.prop-challenge.costs.date': 'Fecha',
  'account.prop-challenge.costs.amount': 'Importe',
  'account.prop-challenge.costs.note': 'Nota (opcional)',
  'account.prop-challenge.costs.add': 'Añadir coste',
  'account.header.copies': 'Copia',
  'account.header.copied-by-more': '+{count} más',
  'account.header.created': 'Creada:',
  'account.summary.current-balance': 'Saldo actual',
  'account.summary.net-cash-flow': 'Flujo de caja neto',
  'account.summary.payouts': 'Pagos',
  'account.performance.title': 'Rendimiento',
  'account-page.guide.whats-new.cockpit.intro.title':
    'Las reglas de tu desafío',
  'account-page.guide.whats-new.cockpit.intro.description':
    'En una cuenta de prop firm, cada regla de la firma y lo cerca que estás de ella aparecen debajo de las métricas.',
  'account-page.guide.whats-new.cockpit.cockpit.title':
    'Revisa una fase y actúa',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    'Elige una fase en el encabezado de reglas para ver sus reglas. Márcala como aprobada o fallida, o vuelve a abrirla, desde el menú ⋮ de al lado.',
  'account-page.guide.main.challenge.title': 'Tu desafío de un vistazo',
  'account-page.guide.main.challenge.description':
    'Elige una fase para ver cada regla con su progreso. Las fases fondeadas con reglas de retiro de beneficios verificadas también siguen aquí si puedes solicitar un retiro.',
  'account.edit.field.target-type': 'Tipo de Objetivo',
  'account.edit.field.target-type-desc': 'Absoluto o porcentaje',
  'account.edit.field.target-percent': 'Objetivo (%)',
  'account.edit.field.target-dollar': 'Objetivo ($)',
  'account.edit.field.target-percent-desc': 'Objetivo de ganancia porcentual',
  'account.edit.field.target-dollar-desc': 'Objetivo de monto en dólares',
  'account.edit.field.target-date': 'Fecha Objetivo (Opcional)',
  'account.edit.field.target-date-desc':
    'Fecha para alcanzar el objetivo de ganancias',
  'account.edit.button.show-snapshots':
    'Mostrar Administrador de Snapshots ({count} registrados)',
  'account.edit.button.hide-snapshots':
    'Ocultar Administrador de Snapshots ({count} registrados)',
  'account.edit.delete-warning':
    '¡Esta es una acción permanente que no se puede deshacer!',

  
  
  
  'account.drawdown.none': 'Ninguno',
  'account.drawdown.fixed': 'Fijo',
  'account.drawdown.eod-trailing': 'EOD Trailing',
  'account.drawdown.manual': 'Manual',

  
  
  
  'account.profit-target.enable': 'Habilitar Objetivo de Ganancias',
  'account.profit-target.type.absolute': 'Monto absoluto',
  'account.profit-target.type.percentage': 'Porcentaje',

  
  
  
  'account.create.button.creating': 'Creando...',
  'account.create.button.create': 'Crear Cuenta',
  'account.edit.button.saving': 'Guardando...',
  'account.edit.button.save': 'Guardar Cambios',
  'account.edit.button.delete': 'Eliminar Cuenta',
  'account.edit.button.delete-name': 'Eliminar "{name}"',

  
  
  
  'account.edit.modal.update-notes.title': '¿Actualizar Notas Vinculadas?',
  'account.edit.modal.update-notes.message':
    'Al renombrar se actualizarán todas las notas que hacen referencia a "{oldName}" a "{newName}". Esto es necesario para mantener los datos consistentes.',
  'account.edit.modal.update-notes.yes': 'OK (Actualizar Notas)',
  'account.edit.modal.update-notes.no': 'Mantener nombre anterior',
  'account.edit.modal.update-notes.cancel': 'Cancelar Acción',

  
  
  
  'account.edit.modal.change-date.title': 'Cambiar Fecha de Creación',
  'account.edit.modal.change-date.confirm': 'Actualizar Fecha de Creación',

  
  
  
  'account.edit.modal.change-balance.title': 'Cambiar Saldo Inicial',
  'account.edit.modal.change-balance.info2':
    'El saldo actual será recalculado basado en el nuevo saldo inicial más todas las G/P de operaciones.',
  'account.edit.modal.change-balance.info3':
    'Este cambio puede impactar significativamente las métricas de cuenta y la precisión de datos históricos.',
  'account.edit.modal.change-balance.confirm': 'Actualizar Saldo Inicial',

  
  
  
  'account.edit.modal.delete.title': 'Eliminar Cuenta',
  'account.edit.modal.delete.will': 'Esta acción:',
  'account.edit.modal.delete.item1':
    'Eliminará todos los metadatos y configuraciones de la cuenta',
  'account.edit.modal.delete.item2':
    'Eliminará referencias de cuenta de todas las operaciones vinculadas',
  'account.edit.modal.delete.item3':
    'Eliminará etiquetas de cuenta auto-generadas de las notas',

  'account.edit.modal.delete.delete-associated-trades':
    'Also delete all trades linked to this account from my vault',
  
  
  
  'account.edit.error.name-required': 'El nombre de cuenta es requerido',
  'account.edit.error.name-exists': 'La cuenta "{name}" ya existe',
  'account.edit.error.creation-date-required':
    'La fecha de creación es obligatoria',
  'account.edit.error.balance-required':
    'El saldo inicial no puede ser negativo',
  'account.edit.error.invalid-live-balance': 'El saldo en vivo no es válido',
  'account.edit.error.drawdown-required':
    'El monto de drawdown debe ser mayor a 0',
  'account.edit.error.future-date': 'La fecha de creación no puede ser futura',
  'account.edit.error.update-failed': 'Error al actualizar cuenta: {error}',
  'account.edit.error.service-unavailable':
    'El servicio de cuentas no está disponible',
  'account.edit.error.delete-failed': 'Error al eliminar cuenta: {error}',
  'account.edit.success.updated': 'Cuenta "{name}" actualizada exitosamente',
  'account.edit.success.updated-with-references':
    'Cuenta actualizada de "{oldName}" a "{newName}" y todas las referencias de notas actualizadas',
  'account.edit.success.deleted': 'Cuenta "{name}" eliminada exitosamente',

  
  
  
  'account.risk-metrics.loading': 'Cargando métricas de riesgo...',
  'account.risk-metrics.title': 'Gestión de Riesgo',
  'account.risk-metrics.drawdown-used': 'Drawdown Limit Used',
  'account.risk-metrics.profit-target': 'Objetivo de Ganancias',
  'account.risk-metrics.status.breached': 'VIOLADO',
  'account.risk-metrics.status.achieved': 'ALCANZADO',
  'account.risk-metrics.status.in-progress': 'EN PROGRESO',
  'account.risk-metrics.not-set': 'No configurado',
  'account.risk-metrics.no-drawdown': 'Sin límite de drawdown configurado',
  'account.risk-metrics.no-profit-target':
    'Sin objetivo de ganancias configurado',
  'account.risk-metrics.label.used': 'Usado:',
  'account.risk-metrics.label.limit': 'Límite:',
  'account.risk-metrics.label.remaining': 'Restante:',
  'account.risk-metrics.label.progress': 'Progreso:',
  'account.risk-metrics.label.target': 'Objetivo:',
  'account.risk-metrics.label.target-date': 'Fecha Objetivo:',

  
  
  
  'account.weight-legend.aria-label':
    'Leyenda de distribución de tipos de cuenta',
  'account.weight-legend.item-aria-label': '{name}: {percent}',

  
  
  
  'account.transaction.deposit': 'Depósito',
  'account.transaction.withdrawal': 'Retiro',
  'account.transaction.click-to-edit':
    'Haga clic para editar o eliminar esta transacción',
  'account.transaction.edit-row-label':
    'Editar o eliminar esta transacción: {date}, {amount}',

  
  
  
  'account.link-modal.title': 'Nueva Cuenta de Trading Detectada',
  'account.link-modal.account-id': 'ID de Cuenta:',
  'account.link-modal.broker': 'Broker:',
  'account.link-modal.first-seen': 'Primera Vez:',
  'account.link-modal.question': '¿Cómo desea manejar esta cuenta?',
  'account.link-modal.option.new':
    'Crear nueva cuenta con nombre personalizado',
  'account.link-modal.placeholder.custom-name': 'ej., Desafío FTMO',
  'account.link-modal.account-type': 'Tipo de Cuenta:',
  'account.link-modal.option.existing': 'Vincular a cuenta existente',
  'account.link-modal.no-accounts-available': '(no hay cuentas disponibles)',
  'account.link-modal.select-account': 'Seleccionar una cuenta...',

  'account.link-modal.option.default':
    'Usar nombre predeterminado: Account-{id}',
  'account.link-modal.default-name': 'Account-{id}',
  'account.link-modal.button.linking': 'Vinculando...',
  'account.link-modal.notice.select-existing':
    'Por favor seleccione una cuenta existente',
  'account.link-modal.notice.failed': 'Error al vincular cuenta: {error}',

  
  
  

  'account.linked-trades.setups': 'Setups',

  
  
  
  'account.add-event.title': 'Agregar Depósito/Retiro',
  'account.add-event.field.type': 'Tipo de Transacción',
  'account.add-event.field.type-desc': 'Depósito o retiro',
  'account.add-event.field.amount': 'Monto',
  'account.add-event.field.amount-desc': 'Monto en {currency}',
  'account.add-event.field.date': 'Fecha',
  'account.add-event.field.date-desc': 'Fecha de transacción',
  'account.add-event.field.description': 'Descripción (Opcional)',
  'account.add-event.field.description-desc': 'Notas adicionales',
  'account.add-event.type.deposit': 'Depósito',
  'account.add-event.type.withdrawal': 'Retiro',
  'account.add-event.placeholder.deposit': 'Depósito manual',
  'account.add-event.placeholder.withdrawal': 'Retiro manual',
  'account.add-event.button.add': 'Agregar Transacción',
  'account.add-event.button.adding': 'Agregando...',
  'account.add-event.success': '{type} de {amount} agregado exitosamente',
  'account.add-event.error.amount-required': 'El monto debe ser mayor a 0',
  'account.add-event.error.date-required': 'La fecha es requerida',
  'account.add-event.error.invalid-date': 'Formato de fecha inválido',
  'account.add-event.error.future-date':
    'La fecha de transacción no puede ser futura',
  'account.add-event.error.failed': 'Error al agregar transacción: {error}',
  'account.add-event.confirm.title': 'Confirmar Transacción',
  'account.add-event.confirm.message':
    '¿Agregar {type} de {amount} a la cuenta "{account}" el {date}?',
  'account.add-event.confirm.description': 'Descripción: {description}',

  
  
  
  'account.deposits-withdrawals.title': 'Depósitos y Retiros',
  'account.deposits-withdrawals.empty':
    'No hay depósitos ni retiros manuales registrados.',
  'account.deposits-withdrawals.empty-sub':
    'Haga clic en el botón + en el encabezado para agregar su primera transacción.',
  'account.deposits-withdrawals.summary':
    '{deposits} depositado · {withdrawn} retirado · último {date}',
  'account.payouts.title': 'Retiros de beneficios',
  'account.payouts.summary': '{count} retiros · {total} · último {date}',
  'account.payouts.summary-masked':
    'El historial de pagos está oculto mientras los valores están enmascarados',
  'account.payouts.summary-one': '1 retiro · {total} · último {date}',
  'account.payouts.empty': 'Aún no hay retiros de beneficios',
  'account.payouts.empty-sub':
    'Registre un retiro con el botón + en el encabezado.',
  'account.ledger.column.date': 'Fecha',
  'account.ledger.column.type': 'Tipo',
  'account.ledger.column.payout': 'Retiro',
  'account.ledger.column.description': 'Descripción',
  'account.ledger.column.amount': 'Importe',
  'account.ledger.column.balance-after': 'Saldo posterior',

  
  
  
  'account-page.error.title': 'Error al Cargar Cuenta',
  'account-page.error.not-found':
    'No se pudieron encontrar los datos de cuenta para "{accountName}"',
  'account-page.error.not-found-sub':
    'Por favor verifique si la cuenta existe o intente refrescar la página.',

  'account-page.guide.empty.intro.title': 'This page is one account in detail',
  'account-page.guide.empty.intro.description':
    'Use the Account Page to manage one account, record account events, and review the trades linked to it.',
  'account-page.guide.empty.edit-account.title':
    'Edit Account opens the full account settings',
  'account-page.guide.empty.edit-account.description':
    'Use this button to change the account name, type, currency, drawdown rules, profit target, monthly cost, and more.',
  'account-page.guide.empty.add-event.title':
    'Add Event records deposits and withdrawals',
  'account-page.guide.empty.add-event.description':
    'Use this button whenever money moves in or out of the account outside of normal trades.',
  'account-page.guide.empty.transactions.title':
    'Cash movements are tracked here',
  'account-page.guide.empty.transactions.description':
    'This section keeps a row-by-row record of manual deposits and withdrawals, shown as Payouts on a prop-challenge account. When it is empty, use Add Event to create the first one.',
  'account-page.guide.empty.trade-log.title': 'Linked trades will appear here',
  'account-page.guide.empty.trade-log.description':
    'Trades show up here when they are assigned to this account. Once you have linked trades, this page becomes your full account breakdown.',
  'account-page.guide.main.intro.title': 'This page is your account breakdown',
  'account-page.guide.main.intro.description':
    'Use the Account Page to understand one account clearly: balance history, performance, risk limits, cash movements, and linked trades.',
  'account-page.guide.main.balance-chart.title':
    'The balance chart shows the account over time',
  'account-page.guide.main.balance-chart.description':
    'Use this chart to see how the account changed over time, not just where it stands today.',
  'account-page.guide.main.metrics.title': 'Rendimiento solo de esta cuenta',
  'account-page.guide.main.metrics.description':
    'Balance, P&L, tasa de acierto y todos los costes de esta cuenta. Las cuentas prop muestran los retiros de beneficios en lugar del flujo de caja neto.',
  'account-page.guide.main.risk.title':
    'Risk progress is tracked separately here',
  'account-page.guide.main.risk.description':
    'Cuánto de tu límite de drawdown has usado y lo cerca que estás de tu objetivo de beneficio.',
  'account-page.guide.main.transactions.title':
    'Cash movements stay in their own section',
  'account-page.guide.main.transactions.description':
    'Depósitos y retiros con el balance tras cada uno, separados de los resultados de trading. Las cuentas prop muestran aquí sus retiros de beneficios.',
  'account-page.guide.main.actions.title': 'Operaciones, efectivo y ajustes',
  'account-page.guide.main.actions.description':
    'Abre las operaciones de esta cuenta en el Trade Log, registra un depósito o retiro con + o edita la cuenta y sus reglas.',
  
  
  
  'account-dashboard.title': 'Cuentas',
  'account-dashboard.copy-badge.base': 'BASE',
  'account-dashboard.copy-badge.copy': 'COPIADOR',
  'account-dashboard.copy-badge.copied-by': 'Copiado por',
  'account-dashboard.copy-badge.copies-tooltip-masked': 'Copia {account}',
  'account-dashboard.copy-badge.copies-tooltip':
    'Copia {account} a {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService no se inicializó después de múltiples intentos',
  'account-dashboard.error.loading': 'Error al cargar cuentas: {error}',
  'account-dashboard.error.retry':
    'AccountPageService no está listo, reintentando en {delay}ms (intento {attempt}/{max})',
  'account-dashboard.challenges.empty.title': 'Aún no hay desafíos',
  'account-dashboard.challenges.empty.message':
    'Sigue un desafío de prop firm como una sola cuenta con fases, reglas y pagos.',
  'account-dashboard.challenges.empty.create': 'Nuevo desafío',
  'account-dashboard.challenges.empty.setup': 'Configurar cuentas existentes',
  'account-dashboard.empty.title': 'No Se Encontraron Cuentas',
  'account-dashboard.empty.message':
    'Cree una cuenta para comenzar a rastrear su desempeño de trading',
  'account-dashboard.section.empty': 'No hay cuentas de {type}',
  'account-dashboard.section.empty-sub': 'Crea una cuenta para verla aquí',
  'account-dashboard.button.create-first': 'Crear Su Primera Cuenta',
  'account-dashboard.action.create': 'Crear nueva cuenta',
  'account-dashboard.action.settings': 'Configuración de cuentas',
  'account-dashboard.weight-bar.aria': 'Distribución de AUM por tipo de cuenta',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: {percent}% del AUM total',
  'account-dashboard.guide.empty.intro.title':
    'This page keeps all of your accounts in one place',
  'account-dashboard.guide.empty.intro.description':
    'Usa Cuentas para ver todas tus cuentas juntas. Cuando existan cuentas, esta página será la forma más rápida de compararlas.',
  'account-dashboard.guide.empty.state.title':
    'There is nothing here yet because no accounts exist',
  'account-dashboard.guide.empty.state.description':
    'The dashboard stays empty until you create your first account. After that, it will show account totals, sections, and shortcuts into each account page.',
  'account-dashboard.guide.empty.create.title':
    'Create your first account here',
  'account-dashboard.guide.empty.create.description':
    'Click this button to create the first account you want Journalit to track.',
  'account-dashboard.guide.empty.after-create.title':
    'After you save, Journalit opens the account page',
  'account-dashboard.guide.empty.after-create.description':
    'Fill in the basic account details and save. The next guide will pick up on the Account Page for that specific account.',
  'account-dashboard.guide.main.intro.title': 'Estas son tus cuentas',
  'account-dashboard.guide.main.intro.description':
    'Use this page to compare accounts, watch totals across all accounts, and jump into a single account when you need more detail.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM means assets under management',
  'account-dashboard.guide.main.aum-chart.description':
    'This chart tracks your combined account value over time, including deposits, withdrawals, and when accounts were added.',
  'account-dashboard.guide.main.metrics.title':
    'These metrics summarise all visible accounts',
  'account-dashboard.guide.main.metrics.description':
    'Use these stats for a quick account-level snapshot before drilling into specific account types or specific accounts.',
  'account-dashboard.guide.main.mode-switch.title':
    'Resumen y Desafíos son dos vistas de las mismas cuentas',
  'account-dashboard.guide.main.mode-switch.description':
    'Resumen mantiene el gráfico de AUM y los totales de la cartera. Cambia a Desafíos para ver la economía de tus desafíos prop: tasa de aprobación, costes, pagos y cuellos de botella por fase en todas las cuentas de desafío.',
  'account-dashboard.guide.main.create-account.title':
    'You can create another account from here at any time',
  'account-dashboard.guide.main.create-account.description':
    'Use this button whenever you want to add a new account to the dashboard.',
  'account-dashboard.guide.main.settings-types.title':
    'Settings can manage available account types',
  'account-dashboard.guide.main.settings-types.description':
    'Inside settings, you can add custom account types and remove old ones if your workflow changes.',
  'account-dashboard.guide.main.settings-stages.title':
    'Las etapas del desafío pueden definir el tipo de cuenta',
  'account-dashboard.guide.main.settings-stages.description':
    'Elige el tipo de cuenta que se aplica cuando un desafío llega a evaluación, financiado en simulación o financiado en real. Deja una etapa en «Sin cambios» para conservar el tipo de cuenta actual.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Settings can change what counts in totals',
  'account-dashboard.guide.main.settings-inclusion.description':
    'You can hide account types from dashboard totals without deleting them, and you can separately decide whether their withdrawals still count.',
  'account-dashboard.guide.main.settings-order.title':
    'This section controls the order of account groups',
  'account-dashboard.guide.main.settings-order.description':
    'Use these controls to decide which account types appear first on the dashboard.',

  'account-dashboard.guide.main.open-account.title':
    'Open any account card to go deeper',
  'account-dashboard.guide.main.open-account.description':
    'Las cuentas se agrupan por tipo para que compares las similares. Abre cualquier tarjeta para ver el desglose completo; allí continúa la guía de la página de cuenta.',
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    'Novedad: desafíos de prop firm',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    'Una cuenta ahora puede seguir un desafío de prop firm: sus fases, las reglas de la firma y tus pagos.',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    'Empieza un nuevo desafío',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    'Al crear una cuenta, activa Desafío de prop firm y elige tu firma. Sus reglas se rellenan por ti.',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    'Ve todos tus desafíos',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    'Cambia a Desafíos para ver el progreso, la tasa de aprobación, los costos y los pagos de todos tus desafíos.',
  'account-dashboard.metrics.total-accounts': 'Total de Cuentas',
  'account-dashboard.metrics.total-aum': 'AUM Total',
  'account-dashboard.metrics.total-growth': 'Crecimiento Total',
  'account-dashboard.metrics.growth-percent': '% Crecimiento',
  'account-dashboard.metrics.total-withdrawals': 'Retiros Totales',
  'account-dashboard.metrics.no-withdrawals': 'Sin retiros',
  'account-dashboard.metrics.total-trades': 'Total de Operaciones',
  'account-dashboard.type-header.excluded': 'Excluida',
  'account-dashboard.type-header.from-stats': 'De Estadísticas',
  'account-dashboard.type-header.of-total-aum': 'del AUM Total',
  'account-dashboard.type-header.aum': 'AUM',
  'account-dashboard.type-header.withdrawals': 'Retiros',
  'account-dashboard.type-header.account': 'Cuenta',
  'account-dashboard.type-header.accounts': 'Cuentas',
  'account-dashboard.type-header.trade': 'Operación',
  'account-dashboard.type-header.trades': 'Operaciones',
  'account-dashboard.type-header.growth': 'Crecimiento ({percent})',
  'account-card.metric.trades': 'Operaciones',
  'account-card.metric.withdrawals': 'Retiros',
  'account-card.metric.age': 'Antigüedad',
  'account-card.progress.profit-target': 'Objetivo de Ganancia',
  'account-card.progress.drawdown-used': 'Drawdown Limit Used',
  'account-card.progress.not-set': 'No establecido',
  'account-card.footer.monthly': 'Mensual:',
  'account-card.footer.total-costs': 'Costos Totales:',
  'account.metrics.total-account-costs': 'Costes totales estimados',
  'account.metrics.total-costs': 'Costes totales',
  'account.metrics.one-time-costs': 'Costes únicos',
  'account.metrics.recurring-costs-to-date':
    'Costes recurrentes hasta la fecha',
  'account.metrics.monthly-cost': 'Coste mensual',

  
  'account.chart.event.added': 'Cuenta Agregada',
  'account.chart.event.archived': 'Cuenta Archivada',
  'account.balance-chart.drawdown-floor-off-scale':
    'Límite de drawdown {value} ({distance} por debajo)',
  'account.balance-chart.profit-target-off-scale':
    'Objetivo de beneficio {value} ({distance} por encima)',
  'account.balance-chart.empty': 'No se encontraron operaciones',
  'account.balance-chart.empty-sub':
    'No hay actividad de trading disponible para esta cuenta',
  'account.aum-chart.empty': 'Sin datos de cuenta',
  'account.aum-chart.empty-sub': 'Agrega cuentas para ver el historial de AUM',
  'chart.shared.empty': 'No hay operaciones disponibles',
  'chart.shared.empty-sub':
    'Intenta seleccionar un período de tiempo diferente',

  
  
  
  'common.loading': 'Cargando...',
  'common.error': 'Error',

  'common.warning': 'Advertencia',
  'common.info': 'Información',
  'common.yes': 'Sí',
  'common.no': 'No',
  'common.ok': 'OK',

  'common.select-option': 'Selecciona una opción',
  'common.none': 'Ninguno',
  'common.other': 'Otro',
  'common.breakdown': 'Resumen',
  'common.all': 'Todo',
  'common.date': 'Fecha',

  'common.week': 'Semana',
  'common.month': 'Mes',
  'common.year': 'Año',

  'common.min': 'Mín',
  'common.max': 'Máx',
  'common.profit': 'Ganancia',

  'common.trade': 'Operación',
  'common.trades': 'Operaciones',

  'common.days': 'Días',
  'common.weeks': 'Semanas',
  'common.months': 'Meses',
  'common.years': 'Años',
  'common.quarter': 'Trimestre',
  'common.quarters': 'Trimestres',
  'common.best': 'Mejor',
  'common.worst': 'Peor',

  'common.statuses': 'Estados',
  'common.enabled': 'activado',
  'common.disabled': 'desactivado',
  'common.unknown': 'Desconocido',
  'common.unknown-error': 'Error desconocido',
  'common.na': 'N/A',
  'common.note-label': 'Nota:',

  'common.backups-label': 'Respaldos:',
  'common.header': 'Encabezado',

  'common.select-all': 'Seleccionar todo',
  'common.select-item': 'Seleccionar {item}',
  'common.n-types': '{count} Tipos',

  
  'common.day.monday': 'Lunes',
  'common.day.tuesday': 'Martes',
  'common.day.wednesday': 'Miércoles',
  'common.day.thursday': 'Jueves',
  'common.day.friday': 'Viernes',
  'common.day.saturday': 'Sábado',
  'common.day.sunday': 'Domingo',
  'common.day.all-week': 'Toda la Semana',

  
  'common.month.january': 'Enero',
  'common.month.february': 'Febrero',
  'common.month.march': 'Marzo',
  'common.month.april': 'Abril',
  'common.month.may': 'Mayo',
  'common.month.june': 'Junio',
  'common.month.july': 'Julio',
  'common.month.august': 'Agosto',
  'common.month.september': 'Septiembre',
  'common.month.october': 'Octubre',
  'common.month.november': 'Noviembre',
  'common.month.december': 'Diciembre',

  
  'common.color.gray': 'Gris',
  'common.color.red': 'Rojo',
  'common.color.orange': 'Naranja',
  'common.color.yellow': 'Amarillo',
  'common.color.label': 'Color',
  'common.color.default': 'Predeterminado',

  
  'common.score.poor': 'Pobre',
  'common.score.below-average': 'Por debajo del promedio',
  'common.score.average': 'Promedio',
  'common.score.strong': 'Fuerte',
  'common.score.excellent': 'Excelente',

  
  
  
  'chart.tooltip.pnl': 'P&L',
  'chart.tooltip.peak-equity': 'Peak realized P&L',
  'chart.tooltip.episode-start': 'Episode Start',
  'chart.tooltip.underwater-days': 'Time Underwater',
  'chart.tooltip.underwater-trades': 'Trades Underwater',

  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',
  'chart.tooltip.trade-pnl': 'P&L del Trade',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'chart.loading': 'Cargando gráfico...',

  
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'Entrada',
  'chart.legend.exit': 'Salida',
  'chart.legend.trade': 'Operación',

  
  
  
  'backend.title': 'Sincronización de operaciones',
  'backend.description':
    'Configura Trade Sync para brokers compatibles y mantén tu bóveda actualizada automáticamente.',

  

  'trade-sync.gate.pro.description':
    'Trade Sync is a Pro feature. Upgrade to continue.',

  'trade-sync.gate.feature-unavailable.title': 'Función no disponible',
  'trade-sync.gate.feature-unavailable.description':
    'Esta función de sincronización no está habilitada para tu cuenta Pro. Actualiza tu estado o contacta con soporte si el problema persiste.',
  'trade-sync.trial.title': 'Automatiza tu diario de trading',
  'trade-sync.trial.description':
    'Ahorra hasta 7 horas a la semana con Journalit Pro.',
  'trade-sync.trial.benefit.sync': 'Sincronización automática de operaciones',
  'trade-sync.trial.benefit.import':
    'Importa operaciones desde cualquier lugar',
  'trade-sync.trial.cta': 'Comienza tu prueba gratuita de 14 días',
  'trade-sync.trial.existing-subscriber': '¿Ya estás suscrito? Inicia sesión',
  'trade-sync.trial.eligibility':
    'Prueba gratuita disponible solo para nuevos suscriptores.',

  

  'premium.gate.cta.continue-pro': 'Continuar con PRO',

  'premium.gate.cta.refresh': 'Refresh status',

  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  'backend.status.connected': 'Conectado',
  'backend.status.disconnected': 'Desconectado',
  'backend.status.checking': 'Verificando...',
  'backend.register.title': 'Registrar Bóveda',
  'backend.register.description':
    'Registra tu bóveda de Obsidian con el servidor de trading para habilitar la sincronización de operaciones',
  'backend.register.button': 'Registrar Bóveda',
  'backend.register.registering': 'Registrando...',
  'backend.ftp.title': 'Credenciales FTP',
  'backend.ftp.description':
    'Crea credenciales FTP para permitir que MetaTrader suba reportes a tu servidor de trading',
  'backend.ftp.create-button': 'Crear Credenciales FTP',
  'backend.ftp.creating': 'Creando...',

  'backend.sync.auto-sync': 'Habilitar Auto-Sincronización',
  'backend.sync.auto-sync-desc':
    'Sincroniza automáticamente operaciones nuevas desde el servidor de trading',
  'backend.sync.auto-sync-info':
    'La auto-sincronización verifica nuevas operaciones cada hora',
  'backend.sync.auto-sync-aria': 'Habilitar auto-sincronización',

  'backend.sync.syncing': 'Sincronizando...',

  'backend.sync.last-result': 'Último Resultado de Sincronización',
  'backend.sync.synced-trades':
    'Sincronizadas {trades} operaciones ({files} archivos nuevos)',
  'backend.sync.no-new-trades': 'No hay operaciones nuevas para sincronizar',
  'backend.sync.status': 'Estado de Sincronización',
  'backend.sync.last-sync': 'Última sincronización',
  'backend.sync.total-syncs': 'Total de sincronizaciones',
  'backend.sync.never': 'Nunca',
  'backend.sync.invalid-date': 'Fecha inválida',
  'backend.notice.vault-registered':
    '✅ Bóveda registrada con el servidor de trading',
  'backend.notice.sync-cancelled': '⏹️ Sincronización cancelada',
  'backend.notice.sync-in-progress': '⚠️ Sincronización ya en progreso',
  'backend.notice.account-info-failed':
    '❌ Error al obtener información de la cuenta',
  'backend.notice.sync-batch-progress':
    '⏳ Sincronizando lote: {count} operaciones ({progress}% completo, {remaining} restantes)',
  'backend.notice.all-trades-synced':
    '✅ Todas las {count} operaciones sincronizadas exitosamente',
  'backend.notice.account-created': '📊 Cuenta creada: {name}',
  'backend.notice.batch-complete':
    '⏳ Lote completo: {processed}/{total} operaciones ({progress}%). Continuando...',
  'backend.notice.sync-complete':
    '✅ Sincronización completa: {total} operaciones procesadas ({newFiles} nuevas, {updated} actualizadas) en {accounts} cuenta(s)',
  'backend.notice.sync-complete-no-trades':
    '✅ Sincronización completa - no se encontraron operaciones nuevas',
  'backend.notice.sync-failed': '❌ Sincronización fallida: {error}',

  'backend.accounts.linked': 'Cuentas MT Vinculadas',
  'backend.accounts.linked-desc':
    'Cuentas de MetaTrader detectadas durante la sincronización',
  'backend.accounts.server-disconnected':
    'Conéctate al servidor para ver las cuentas vinculadas',
  'backend.accounts.loading': 'Cargando cuentas...',
  'backend.accounts.no-accounts': 'No se encontraron cuentas.',
  'backend.accounts.sync-to-detect':
    'Sincroniza algunas operaciones para detectar cuentas.',
  'backend.accounts.connect-to-see':
    'Conéctate al servidor de trading para ver las cuentas vinculadas',
  'backend.accounts.account-id': 'ID de Cuenta',
  'backend.accounts.broker': 'Broker',
  'backend.accounts.first-seen': 'Primera vez visto',
  'backend.accounts.last-seen': 'Última vez visto',
  'backend.accounts.refresh': 'Actualizar Cuentas',

  
  'backend.accounts.unlink-title': 'Desvincular cuenta de MetaTrader',
  'backend.accounts.unlink': 'Desvincular',
  'backend.accounts.unlink-confirm':
    '¿Desvincular la cuenta de MetaTrader {accountId}? Se ocultará de Trade Sync y las importaciones futuras se omitirán hasta que la vuelvas a vincular.',
  'backend.accounts.unlink-success': 'Cuenta de MetaTrader desvinculada',
  'backend.accounts.relink': 'Volver a vincular',
  'backend.accounts.relink-success': 'Cuenta de MetaTrader vinculada de nuevo',
  'backend.accounts.ignored.title': 'Cuentas desvinculadas',
  'backend.accounts.ignored.count': '{count} ocultas',
  'backend.accounts.ignored.empty': 'No hay cuentas desvinculadas.',
  'backend.accounts.ignored-at': 'Desvinculada',

  
  'backend.cards.connection.title': 'Conexión',
  'backend.cards.connection.refresh': 'Actualizar',
  'backend.cards.sync.title': 'Estado de Sync',
  'backend.cards.sync.last-sync': 'Última sync',
  'backend.cards.sync.total': 'Total de syncs',
  'backend.cards.sync.button': 'Sincronizar Ahora',
  'backend.cards.sync.cancel': 'Cancelar sincronización',
  'backend.cards.accounts.title': 'Cuentas',
  'backend.cards.accounts.linked': 'Cuentas vinculadas',
  'backend.cards.accounts.manage': 'Gestionar',

  
  'backend.section.setup.title': 'Configuración y Ajustes',
  'backend.section.sync.title': 'Ajustes de Sincronización',
  'backend.section.accounts.title': 'Gestión de Cuentas',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'Mapeo de Trade Import con IA',
  'settings.auth.feature.trade-sync': 'Sincronización de operaciones',
  'settings.auth.feature.economic-calendar': 'Calendario económico',
  'settings.auth.feature.basic-tracking': 'Seguimiento básico',

  'settings.auth.feature.manual-entry': 'Entrada manual de operaciones',
  'settings.auth.feature.analytics-reviews': 'Analíticas y revisiones',
  'settings.auth.feature.priority-support': 'Soporte Prioritario',

  
  'backend.sync.just-now': 'Justo ahora',
  'backend.sync.minutes-ago': 'hace {count} min',
  'backend.sync.hours-ago': 'hace {count} hr',
  'backend.sync.days-ago': 'hace {count} días',

  
  
  

  
  
  
  'settings.ftp.title': 'Credenciales FTP',
  'settings.ftp.title-metatrader': 'Credenciales FTP para MetaTrader',
  'settings.ftp.loading': 'Cargando credenciales FTP...',
  'settings.ftp.info-message':
    'Usa estas credenciales para configurar los ajustes de publicación FTP de MetaTrader:',
  'settings.ftp.label.server': 'Servidor FTP:',
  'settings.ftp.label.login': 'Usuario FTP:',
  'settings.ftp.label.password': 'Contraseña FTP:',
  'settings.ftp.aria.copy-server': 'Copiar servidor FTP',
  'settings.ftp.aria.copy-login': 'Copiar usuario FTP',
  'settings.ftp.aria.copy-password': 'Copiar contraseña',
  'settings.ftp.aria.password-unavailable':
    'Contraseña no disponible para copiar',
  'settings.ftp.aria.password-hidden': 'Contraseña oculta',
  'settings.ftp.aria.hide-password': 'Ocultar contraseña',
  'settings.ftp.aria.show-password': 'Mostrar contraseña',
  'settings.ftp.notice.password-masked':
    'La contraseña está guardada pero no disponible para ver/copiar. Restablece la contraseña para obtener una nueva.',
  'settings.ftp.notice.password-save':
    'Guarda esta contraseña de forma segura. No se puede recuperar después.',
  'settings.ftp.button.reset': 'Restablecer Contraseña FTP',
  'settings.ftp.button.resetting': 'Restableciendo Contraseña...',
  'settings.ftp.reset-hint':
    'Haz clic en este botón para generar una nueva contraseña FTP.',
  'settings.ftp.instructions.title':
    'Instrucciones de configuración de MetaTrader 4:',
  'settings.ftp.instructions.step1': 'Abre MetaTrader\u00A04 (MT4)',
  'settings.ftp.instructions.step2':
    'Haz clic en el menú "Herramientas" en la parte superior',
  'settings.ftp.instructions.step3': 'Selecciona "Opciones"',
  'settings.ftp.instructions.step4':
    'Navega a la pestaña "FTP" e ingresa el Servidor, Usuario y Contraseña FTP mostrados arriba',
  'settings.ftp.instructions.step5': 'Habilita "Modo pasivo"',
  'settings.ftp.instructions.step6':
    'Habilita la publicación automática de reportes vía FTP y configura el intervalo de actualización en 60\u00A0minutos',
  'settings.ftp.no-credentials':
    'No se encontraron credenciales FTP. Haz clic en "Crear Credenciales FTP" en la sección de arriba para generarlas.',
  'settings.ftp.error.reset-failed': 'Error al restablecer la contraseña',

  
  
  

  'settings.auth.status-offline': 'Sin conexión',
  'settings.auth.status-online': 'En línea',

  'settings.auth.signed-in': 'Sesión Iniciada',
  'settings.auth.sign-in-up': 'Iniciar Sesión / Registrarse',
  'settings.auth.sign-out': 'Cerrar Sesión',

  'settings.auth.subscription-features': 'Características de Suscripción',

  'settings.auth.offline-mode': 'Modo Sin Conexión',

  
  'settings.auth.guest': 'Invitado',

  'settings.auth.your-plan': 'Tu Plan',

  'settings.auth.manage-subscription': 'Gestionar Suscripción',

  
  
  
  'settings.tab.general': 'General',
  'settings.tab.reviews': 'Revisión',

  'settings.tab.customization': 'Personalización',
  'settings.tab.journal-setup': 'Diario',
  'settings.tab.backend': 'Sincronización de operaciones',
  'settings.tab.trading': 'Valores predeterminados de operaciones',
  'settings.tab.sync': 'Cuenta y sincronización',
  'settings.tab.accounts': 'Cuenta',

  
  
  
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Revisión Semanal',
  'settings.reviews.monthly': 'Revisión Mensual',
  'settings.reviews.quarterly': 'Revisión Trimestral',
  'settings.reviews.yearly': 'Revisión Anual',

  'settings.reviews.default-templates': 'Layouts Predeterminadas',

  'settings.reviews.trade-template': 'Layout de Operación',
  'settings.reviews.trade-template-desc':
    'Plantilla usada para nuevas Notas de Operación',
  'settings.reviews.drc-template': 'Layout DRC',
  'settings.reviews.drc-template-desc':
    'Plantilla usada para nuevos Reportes Diarios',
  'settings.reviews.weekly-template': 'Layout Semanal',
  'settings.reviews.weekly-template-desc':
    'Plantilla usada para nuevas Revisiones Semanales',
  'settings.reviews.monthly-template': 'Layout Mensual',
  'settings.reviews.monthly-template-desc':
    'Plantilla usada para nuevas Revisiones Mensuales',
  'settings.reviews.quarterly-template': 'Layout Trimestral',
  'settings.reviews.quarterly-template-desc':
    'Plantilla usada para nuevas Revisiones Trimestrales',
  'settings.reviews.yearly-template': 'Layout Anual',
  'settings.reviews.yearly-template-desc':
    'Plantilla usada para nuevas Revisiones Anuales',

  'settings.reviews.template-builder': 'Constructor de Diseño',
  'settings.reviews.template-builder-desc':
    'Crea, edita y gestiona tus diseños visualmente. La Vista del Constructor te permite arrastrar y soltar secciones, configurar opciones y previsualizar tus diseños en tiempo real.',
  'settings.reviews.open-builder': 'Abrir Constructor de Diseño',
  'settings.general.review-links-new-tab':
    'Abrir enlaces de widgets de revisión en pestañas nuevas',
  'settings.general.review-links-new-tab-desc':
    'Si se desactiva, los enlaces reemplazan la pestaña actual.',
  'settings.general.review-links-new-tab-aria':
    'Abrir enlaces de notas de widgets de revisión en pestañas nuevas',
  'settings.general.tab-behavior': 'Comportamiento de pestañas',

  'settings.reviews.recurring-goals': 'Objetivos Recurrentes',
  'settings.reviews.recurring-goals-desc':
    'Define objetivos que aparecen automáticamente en cada nueva revisión. Se copian cuando se crea la revisión y se pueden editar por revisión.',
  'settings.reviews.daily-goals': 'Objetivos Diarios',
  'settings.reviews.daily-goal-placeholder':
    'Añadir un objetivo diario recurrente...',
  'settings.reviews.weekly-goals': 'Objetivos Semanales',
  'settings.reviews.weekly-goal-placeholder':
    'Añadir un objetivo semanal recurrente...',

  'settings.reviews.pre-trade-checklist': 'Lista pre-operación del DRC',
  'settings.reviews.pre-trade-checklist-desc':
    'Define elementos de lista que aparecen automáticamente en cada nuevo Reporte Diario. Se copian a cada DRC cuando se crea y se pueden editar por día.',
  'settings.reviews.checklist-placeholder': 'Añadir un elemento de lista...',
  'settings.reviews.weekly-checklist': 'Lista de preparación semanal',
  'settings.reviews.weekly-checklist-desc':
    'Define elementos de lista que aparecen automáticamente en cada nueva revisión semanal. Se copian a cada revisión semanal cuando se crea y se pueden editar por semana.',
  'settings.reviews.weekly-checklist-placeholder':
    'Añadir un elemento de lista semanal...',

  'settings.reviews.auto-create': 'Auto-Crear Revisiones',
  'settings.reviews.global-auto-create': 'Auto-Crear Revisiones Global',
  'settings.reviews.global-auto-create-desc':
    'Crear revisiones automáticamente cuando se registra la primera operación del período correspondiente. Esta configuración aplica a revisiones diarias, semanales, mensuales, trimestrales y anuales.',
  'settings.reviews.global-auto-create-aria': 'Auto-crear revisiones global',
  'settings.reviews.auto-create-drc-nav': 'Auto-crear DRC al Navegar',
  'settings.reviews.auto-create-drc-nav-desc':
    'Crear automáticamente un nuevo Reporte Diario al navegar a un día que no tiene uno',
  'settings.reviews.auto-create-drc-nav-aria': 'Auto-crear DRC al navegar',
  'settings.reviews.auto-create-weekly-nav':
    'Auto-crear Revisión Semanal al Navegar',
  'settings.reviews.auto-create-weekly-nav-desc':
    'Crear automáticamente una nueva Revisión Semanal al navegar a una semana que no tiene una',
  'settings.reviews.auto-create-weekly-nav-aria':
    'Auto-crear Revisión Semanal al navegar',
  'settings.reviews.auto-create-monthly-nav':
    'Auto-crear Revisión Mensual al Navegar',
  'settings.reviews.auto-create-monthly-nav-desc':
    'Crear automáticamente una nueva Revisión Mensual al navegar a un mes que no tiene una',
  'settings.reviews.auto-create-monthly-nav-aria':
    'Auto-crear Revisión Mensual al navegar',
  'settings.reviews.auto-create-quarterly-nav':
    'Auto-crear Revisión Trimestral al Navegar',
  'settings.reviews.auto-create-quarterly-nav-desc':
    'Crear automáticamente una nueva Revisión Trimestral al navegar a un trimestre que no tiene una',
  'settings.reviews.auto-create-quarterly-nav-aria':
    'Auto-crear Revisión Trimestral al navegar',
  'settings.reviews.auto-create-yearly-nav':
    'Auto-crear Revisión Anual al Navegar',
  'settings.reviews.auto-create-yearly-nav-desc':
    'Crear automáticamente una nueva Revisión Anual al navegar a un año que no tiene una',
  'settings.reviews.auto-create-yearly-nav-aria':
    'Auto-crear Revisión Anual al navegar',

  'settings.reviews.notice.builder-not-found':
    'Comando del Constructor de Diseño no encontrado',
  'settings.reviews.notice.global-auto-create':
    'Auto-crear para todas las revisiones {status}',
  'settings.reviews.notice.auto-create-nav':
    'Auto-crear {type} al navegar {status}',

  'settings.reviews.daily.checklist-title': 'Elementos de Lista Pre-Operación',

  'settings.reviews.daily.questions-title': 'Preguntas de Revisión',

  'settings.reviews.daily.timeframes-title': 'Marcos Temporales de Pronóstico',

  'settings.reviews.daily.timeframes-placeholder':
    'Nuevo marco temporal (ej., 15M, 5M)',

  
  
  
  'settings.weekly.review-questions': 'Preguntas de Revisión',

  'settings.weekly.forecast-timeframes': 'Marcos Temporales de Pronóstico',

  
  
  
  'settings.shared.timeframes.title': 'Marcos Temporales de Pronóstico',

  'settings.shared.timeframes.placeholder':
    'Nuevo marco temporal (ej., 15M, 5M)',

  
  
  

  
  
  
  'settings.account-linking.title': 'Cambiar Vinculación de Cuenta',
  'settings.account-linking.description':
    'Mover todas las operaciones de una cuenta MT a una cuenta de Obsidian diferente',
  'settings.account-linking.source.title': 'Cuenta MT de Origen',
  'settings.account-linking.source.description':
    'Selecciona la cuenta MT cuyas operaciones quieres mover',
  'settings.account-linking.source.placeholder':
    'Seleccionar cuenta de origen...',
  'settings.account-linking.target.title': 'Cuenta de Obsidian de Destino',
  'settings.account-linking.target.description':
    'Selecciona la cuenta de Obsidian a la que vincular las operaciones',
  'settings.account-linking.target.placeholder':
    'Seleccionar cuenta de destino...',
  'settings.account-linking.button.processing': 'Procesando...',
  'settings.account-linking.button.relink': 'Revincular Cuenta',
  'settings.account-linking.warning':
    'Esto actualizará todas las operaciones sincronizadas de la cuenta de origen para vincularlas a la cuenta de destino. Esta operación no se puede deshacer.',
  'settings.account-linking.success.relinked':
    'Se revincularon exitosamente {count} operaciones de {source} a {target}',
  'settings.account-linking.error.select-both':
    'Por favor selecciona ambas cuentas de origen y destino',
  'settings.account-linking.error.source-not-found':
    'Cuenta de origen no encontrada',
  'settings.account-linking.error.target-not-found':
    'Cuenta de destino no encontrada',
  'settings.account-linking.error.already-linked':
    'Esta cuenta MT ya está vinculada a la cuenta de Obsidian seleccionada',
  'settings.account-linking.error.service-manager':
    'Gestor de servicios no disponible',
  'settings.account-linking.error.backend-service':
    'Servicio backend no disponible',
  'settings.account-linking.error.relink-failed':
    'Error al revincular cuenta: {error}',

  
  
  
  'settings.general.title': 'Configuración General',
  'settings.general.docs': 'Documentación',
  'settings.general.discord': 'Discord',
  'settings.general.github': 'GitHub',

  'settings.general.currency': 'Moneda',
  'settings.general.currency-desc':
    'Elige la moneda para mostrar todos los valores monetarios en el plugin',
  'settings.general.currency-aria':
    'Seleccionar moneda para mostrar valores monetarios',
  'settings.general.currency-changed':
    'Moneda cambiada a {currency}. ¡Todos los componentes se actualizarán inmediatamente!',
  'settings.general.currency-save-failed':
    'Error al guardar configuración de moneda. Por favor intenta de nuevo.',
  'settings.general.path-change.title':
    'Ubicación de la carpeta del diario cambiada',
  'settings.general.path-change.new-trades-title':
    'Las nuevas operaciones se crearán en la nueva ubicación de la carpeta',
  'settings.general.path-change.new-trades-desc':
    'Todos los diarios de trading futuros usarán:',
  'settings.general.path-change.manual-title': 'Se requiere acción manual:',
  'settings.general.path-change.manual-desc':
    'Tienes operaciones existentes en tu carpeta actual. Para moverlas:',
  'settings.general.path-change.step.open-explorer':
    'Abre el explorador de archivos de tu bóveda',
  'settings.general.path-change.step.find-folder-prefix': 'Encuentra tu',
  'settings.general.path-change.step.find-folder-suffix': 'carpeta',
  'settings.general.path-change.step.drag-drop':
    'Arrástrala y suéltala en la nueva ubicación cuando te convenga',
  'settings.general.path-change.manual-note':
    'Esto te da control total sobre cuándo y cómo se mueven tus archivos.',
  'settings.general.path-change.sync-title':
    'Actualización de mapeo de sincronización:',
  'settings.general.path-change.sync-desc':
    'El plugin actualizará automáticamente los mapeos de sincronización de operaciones para reflejar la nueva ruta de la carpeta. Esto asegura que tus operaciones sincronizadas permanezcan conectadas a sus registros en el backend.',
  'settings.general.path-change.button.cancel': 'Cancelar',
  'settings.general.path-change.button.confirm': 'Entiendo',

  'settings.general.display-name': 'Nombre para Mostrar',
  'settings.general.display-name-desc':
    'Nombre opcional para mostrar en el mensaje de bienvenida de la vista de Journalit (ej., "Buenos días, Alex")',
  'settings.general.display-name-placeholder':
    'Añadir nuevo nombre para mostrar...',
  'settings.general.display-name-aria':
    'Nombre para mostrar en mensaje de bienvenida',
  'settings.general.display-name-confirm-aria': 'Confirmar cambio de nombre',
  'settings.general.display-name-cancel-aria': 'Cancelar cambio de nombre',
  'settings.general.display-name-saved': 'Nombre guardado como "{name}"',
  'settings.general.display-name-cleared': 'Nombre eliminado',
  'settings.general.display-name-save-failed':
    'Error al guardar nombre. Por favor intenta de nuevo.',

  'settings.general.privacy-mode': 'Modo Privacidad',
  'settings.general.privacy-mode-desc':
    'Oculta valores sensibles de operaciones, cuentas, precios y rendimiento en la interfaz sin cambiar los datos guardados.',
  'settings.general.privacy-mode-aria': 'Alternar modo privacidad',

  'settings.general.appearance': 'Apariencia',
  'settings.general.accent-color': 'Color de acento',
  'settings.general.accent-color-desc':
    'Color de los botones, interruptores y resaltados de Journalit. El acento de Journalit solo se usa mientras Obsidian tiene su acento predeterminado; un acento elegido en los ajustes de Apariencia de Obsidian o un tema siempre tiene prioridad.',
  'settings.general.accent-color-journalit':
    'Acento de Journalit (predeterminado)',
  'settings.general.accent-color-obsidian': 'Seguir el acento de Obsidian',
  'settings.general.home-view-settings': 'Configuración de Vista de Inicio',
  'settings.general.home-auto-open': 'Auto-Abrir Vista de Inicio',
  'settings.general.home-auto-open-desc':
    'Elige cuándo abrir automáticamente la vista de Inicio',
  'settings.general.home-auto-open-always':
    'Siempre abrir + enfocar (predeterminado)',
  'settings.general.home-auto-open-ifnone': 'Solo si no hay archivo activo',
  'settings.general.home-auto-open-never': 'Nunca (solo manual)',
  'settings.general.home-auto-open-aria':
    'Seleccionar comportamiento de inicio',
  'settings.general.home-startup-changed':
    'Comportamiento de inicio de Journalit cambiado a: {behavior}',

  'settings.general.filter-recent':
    'Filtrar Elementos Recientes a Archivos de Journalit',
  'settings.general.filter-recent-desc':
    'Solo mostrar archivos relacionados con Journalit en el widget de Elementos Recientes (archivos dentro de la carpeta .journalit). Oculta todos los demás archivos de la bóveda de la lista de elementos recientes.',
  'settings.general.filter-recent-aria':
    'Filtrar elementos recientes a archivos de Journalit',
  'settings.general.filter-recent-toggled':
    'Filtrar elementos recientes a archivos de Journalit {status}',
  'settings.general.home-widget-opacity': 'Opacidad de los widgets',
  'settings.general.home-widget-opacity-desc':
    'Fondos de widgets con imagen: 0% es transparente y 100% es opaco. Se aplica al tema actual; los valores de los temas claro y oscuro se guardan por separado.',
  'settings.general.home-widget-opacity-save-failed':
    'No se pudo guardar la opacidad de los widgets. Inténtalo de nuevo.',
  'settings.general.home-background': 'Imagen de fondo de Home',
  'settings.general.home-background-desc':
    'Usa una imagen de tu bóveda o elige una de tu ordenador para copiarla a la bóveda.',
  'settings.general.home-background-dashboard':
    'Mostrar el fondo también en el Dashboard',
  'settings.general.home-background-dashboard-desc':
    'Usa la misma imagen de fondo en el modo Dashboard.',
  'settings.general.home-background-dashboard-aria':
    'Mostrar el fondo de Inicio en el Dashboard',

  'settings.general.home-background-choose': 'Elegir imagen',
  'settings.general.home-background-clear': 'Borrar',

  'settings.general.home-background-invalid-file':
    'Elige un archivo de imagen compatible.',
  'settings.general.home-background-saved': 'Imagen de fondo de Home guardada.',
  'settings.general.home-background-cleared':
    'Imagen de fondo de Home eliminada.',
  'settings.general.home-background-save-failed':
    'No se pudo guardar la imagen de fondo de Home.',

  'settings.general.folder-section': 'Ubicación de Carpeta y Rutas de Imágenes',
  'settings.general.journal-folder': 'Ubicación de Carpeta del Diario',
  'settings.general.journal-folder-desc':
    'Elige dónde se almacenan tus diarios de trading en tu bóveda.',
  'settings.general.journal-folder-desc-2':
    'Deja vacío para usar la ubicación predeterminada en la carpeta raíz.',
  'settings.general.journal-folder-placeholder':
    'Seleccionar carpeta personalizada...',
  'settings.general.journal-folder-default':
    'Predeterminado: Carpeta raíz (!Journalit)',

  'settings.general.update-image-paths': 'Actualizar Rutas de Imágenes',
  'settings.general.update-image-paths-desc':
    'Actualiza las rutas de imágenes en todas las operaciones para coincidir con la ubicación actual de la carpeta. Usa esto después de mover manualmente tu carpeta !Journalit.',
  'settings.general.update-image-paths-updating': 'Actualizando...',
  'settings.general.update-image-paths-match':
    'Todas las rutas de imágenes ya coinciden con la ubicación actual de la carpeta',
  'settings.general.update-image-paths-success':
    'Se actualizaron exitosamente las rutas de imágenes en {count} operaciones',
  'settings.general.update-image-paths-no-update':
    'No se necesitó actualizar ninguna ruta de imagen',
  'settings.general.update-image-paths-errors':
    'Se actualizaron {updated} operaciones con {failed} errores. Revisa la consola para más detalles.',
  'settings.general.update-image-paths-failed':
    'Error al actualizar rutas de imágenes. Revisa la consola para más detalles.',
  'settings.general.folder-updated':
    'Ruta de carpeta de diario actualizada. Las nuevas operaciones se crearán en: {path}',
  'settings.general.folder-update-failed':
    'Error al actualizar la ruta: {error}',

  'settings.general.trade-settings': 'Configuración de Operaciones',
  'settings.general.auto-open-trades': 'Auto-abrir Operaciones Creadas',
  'settings.general.auto-open-trades-desc':
    'Abrir automáticamente las notas de operación en una nueva pestaña después de crearlas',
  'settings.general.auto-open-trades-aria': 'Auto-abrir operaciones creadas',
  'settings.general.auto-open-toggled':
    'Auto-abrir operaciones creadas {status}',

  'settings.general.date-format': 'Formato de Fecha',
  'settings.general.date-format-desc':
    'Formato para mostrar fechas en todo el plugin',
  'settings.general.date-format-aria':
    'Seleccionar formato de fecha para notas de operación',
  'settings.general.date-format-ddmmyy': 'DD/MM/AA (31/12/23)',
  'settings.general.date-format-mmddyy': 'MM/DD/AA (12/31/23)',
  'settings.general.date-format-yymmdd': 'AA/MM/DD (23/12/31)',
  'settings.general.date-format-changed':
    'Formato de fecha de nota de operación cambiado a {format}',

  'settings.general.use-24-hour-time': 'Usar Formato de 24 Horas',
  'settings.general.use-24-hour-time-desc':
    'Mostrar horas en formato de 24 horas (14:30) en lugar de formato AM/PM de 12 horas (2:30 PM)',
  'settings.general.use-24-hour-time-aria': 'Usar formato de 24 horas',

  'settings.general.show-seconds': 'Mostrar segundos en las horas de operación',
  'settings.general.show-seconds-desc':
    'Mostrar segundos al introducir las horas de entrada y salida.',
  'settings.general.show-seconds-aria':
    'Mostrar segundos en las horas de operación',
  'settings.general.skip-weekends': 'Excluir fines de semana',
  'settings.general.skip-weekends-desc':
    'Cuando está activado, Journalit trata los fines de semana como días sin trading en todo el plugin. Desactívalo si operas o revisas actividad los sábados y domingos.',
  'settings.general.skip-weekends-aria': 'Excluir fines de semana en Journalit',
  'settings.general.skip-weekends-toggled':
    'Exclusión de fines de semana {status}',
  'settings.general.week-start': 'Día de Inicio de Semana',
  'settings.general.week-start-desc':
    'Elige qué día comienza tu semana de trading. Afecta revisiones e informes semanales.',
  'settings.general.week-start-aria': 'Seleccionar día de inicio de semana',
  'settings.general.week-start-changed':
    'Día de inicio de semana cambiado a {day}',
  'settings.general.analytics-date-basis': 'Base de fecha para análisis',
  'settings.general.analytics-date-basis-desc':
    'Ideal para swing traders. Usa la fecha de entrada o la fecha de salida final para los análisis. El modo por fecha de salida solo cuenta operaciones cerradas y requiere fecha de salida para operaciones con PnL directo.',
  'settings.general.analytics-date-basis-aria':
    'Seleccionar base de fecha para análisis',
  'settings.general.analytics-date-basis-entry': 'Fecha de entrada',
  'settings.general.analytics-date-basis-exit': 'Fecha de salida',
  'settings.general.analytics-date-basis-changed':
    'La base de fecha para análisis cambió a {basis}',

  'settings.general.dollar-value-input':
    'Ingresar Tamaño de Posición como Valor en Dólares',
  'settings.general.dollar-value-input-desc':
    'Cuando está habilitado, ingresa el tamaño de posición como monto en dólares (ej., $10,000) en lugar de cantidad (acciones/lotes/contratos). La cantidad se calculará automáticamente del precio. Funciona mejor para acciones; futuros/forex tienen multiplicadores de contrato que no se consideran.',
  'settings.general.dollar-value-input-aria':
    'Ingresar tamaño de posición como valor en dólares',
  'settings.general.dollar-value-input-toggled':
    'Entrada de tamaño de posición: {mode}',
  'settings.general.dollar-value': 'Valor en dólares',
  'settings.general.quantity': 'Cantidad',

  'settings.general.mae-mfe-input-mode': 'Modo de Entrada MAE/MFE',
  'settings.general.mae-mfe-input-mode-desc':
    'Elige cómo ingresar valores de Excursión Máxima Adversa/Favorable en el formulario de operación.',
  'settings.general.mae-mfe-input-mode-desc-price':
    'Niveles de precio: Ingresa el precio más bajo/alto alcanzado durante la operación.',
  'settings.general.mae-mfe-input-mode-desc-dollar':
    'Valores en dólares: Ingresa la máxima pérdida/ganancia en dólares directamente.',
  'settings.general.mae-mfe-input-mode-aria':
    'Seleccionar modo de entrada MAE/MFE',
  'settings.general.mae-mfe-input-mode-price': 'Niveles de precio',
  'settings.general.mae-mfe-input-mode-dollar': 'Valores en dólares',
  'settings.general.mae-mfe-display-unit': 'Unidad de visualización MAE/MFE',
  'settings.general.mae-mfe-display-unit-desc':
    'Muestra MAE/MFE en moneda o ticks de futuros en análisis y vistas de operaciones. El modo ticks recalcula automáticamente las operaciones de futuros existentes compatibles sin modificar los datos guardados.',
  'settings.general.mae-mfe-display-unit-aria':
    'Seleccionar unidad de visualización MAE/MFE',
  'settings.general.mae-mfe-display-dollar': 'Moneda',
  'settings.general.mae-mfe-display-ticks': 'Ticks',
  'common.ticks': 'ticks',
  'dashboard.mae-mfe-ticks.partial-coverage':
    'Solo {eligible} de {total} operaciones tienen datos de ticks de futuros. Esta métrica excluye las operaciones no compatibles.',

  'settings.general.cutoff-time': 'Hora de Corte del Día de Trading',
  'settings.general.cutoff-time-desc':
    'Hora que define el fin de un día de trading. Las operaciones después de esta hora se agruparán con el día siguiente. (formato 24 horas, ej., 23:30 para 11:30 PM)',
  'settings.general.cutoff-time-aria': 'Hora de corte del día de trading',
  'settings.general.cutoff-time-changed':
    'Hora de corte del día de trading cambiada a {time}',

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
  'settings.general.break-even-range': 'Rango de Punto de Equilibrio',
  'settings.general.break-even-range-desc':
    'Define un rango de P&L para considerar operaciones como punto de equilibrio. Por ejemplo, configurar Mín: -20 y Máx: 20 tratará operaciones entre -$20 y +$20 como punto de equilibrio. Configura ambos en 0 para solo considerar $0.00 exacto como punto de equilibrio. El mínimo debe ser menor o igual al máximo.',
  'settings.general.break-even-min-placeholder': 'Mín',
  'settings.general.break-even-max-placeholder': 'Máx',
  'settings.general.break-even-min-aria':
    'Mínimo del rango de punto de equilibrio',
  'settings.general.break-even-max-aria':
    'Máximo del rango de punto de equilibrio',
  'settings.general.break-even-to': 'a',
  'settings.general.break-even-warning':
    'Advertencia: El valor mínimo es mayor que el valor máximo. Esto evitará que las operaciones se clasifiquen como punto de equilibrio.',
  'settings.general.break-even-updated':
    'Rango de punto de equilibrio actualizado - las vistas se actualizarán en la próxima carga',

  'settings.general.default-risk': 'Monto de Riesgo Predeterminado',
  'settings.general.default-risk-desc':
    'Monto de riesgo predeterminado (en moneda de cuenta) usado para cálculos de R-múltiplo. Deja vacío para requerir entrada manual por operación.',
  'settings.general.default-risk-aria': 'Monto de riesgo predeterminado',

  'settings.general.display-r-multiples': 'Mostrar R-Múltiplos',
  'settings.general.display-r-multiples-desc':
    'Mostrar valores de R-múltiplo (ratios de riesgo-recompensa) en lugar de montos en moneda en todo el plugin',
  'settings.general.display-r-multiples-aria':
    'Mostrar R-múltiplos en vistas de operación',
  'settings.general.display-r-multiples-toggled':
    'Visualización de R-múltiplos {status}',

  'settings.general.include-copy-accounts-analytics':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-analytics-desc':
    'When enabled, all-account trading analytics include derived copy-account results and count them as account-level trades.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-toggled':
    'Copy accounts in all-account analytics {status}',
  'settings.general.include-unrealized-pnl':
    'Incluir P&L no realizado en analíticas',
  'settings.general.include-unrealized-pnl-desc':
    'Al activarlo, los totales de P&L neto incluyen el P&L no realizado de posiciones abiertas con instantánea de precio, mostrado por separado de los resultados realizados. Estadísticas como la tasa de acierto y las rachas siguen siendo solo realizadas.',
  'settings.general.include-unrealized-pnl-aria':
    'Incluir P&L no realizado en analíticas',
  'settings.general.include-unrealized-pnl-toggled':
    'P&L no realizado en analíticas {status}',

  'settings.general.notification-settings': 'Configuración de Notificaciones',
  'settings.general.sync-notifications': 'Notificaciones de Sincronización',
  'settings.general.sync-notifications-desc':
    'Mostrar notificaciones cuando se completen las operaciones de sincronización',
  'settings.general.sync-notifications-aria':
    'Habilitar notificaciones de sincronización',
  'settings.general.sync-notifications-toggled':
    'Notificaciones de sincronización {status}',

  'settings.general.new-trade-notifications':
    'Notificaciones de Nueva Operación',
  'settings.general.new-trade-notifications-desc':
    'Mostrar notificaciones cuando se detecten nuevos archivos de operación',
  'settings.general.new-trade-notifications-aria':
    'Habilitar notificaciones de nueva operación',
  'settings.general.new-trade-notifications-toggled':
    'Notificaciones de nueva operación {status}',

  'settings.general.update-notifications':
    'Mostrar Notificaciones de Actualización',
  'settings.general.update-notifications-desc':
    'Comprueba diariamente los metadatos públicos de versiones de Journalit en GitHub y te avisa cuando hay una versión más reciente',
  'settings.general.update-notifications-aria':
    'Mostrar notificaciones de actualización',
  'settings.general.update-notifications-toggled':
    'Notificaciones de actualización {status}',

  'settings.general.data-management': 'Gestión de Datos & Privacidad',
  'settings.general.backup-restore-section':
    'Copia de seguridad, restauración y restablecimiento',
  'settings.general.export-settings': 'Exportar Configuración',
  'settings.general.export-settings-desc':
    'Descargar toda la configuración del plugin como archivo JSON para respaldo o transferencia a otra bóveda',
  'settings.general.export-settings-exporting': 'Exportando...',

  'settings.general.import-settings': 'Importar Configuración',
  'settings.general.import-settings-desc':
    'Restaurar configuración desde un archivo JSON previamente exportado. La configuración se combinará con los valores actuales.',
  'settings.general.import-settings-importing': 'Importando...',

  'settings.general.reset-to-defaults': 'Restablecer a Predeterminados',
  'settings.general.reset-to-defaults-desc':
    'Restablecer toda la configuración del plugin a sus valores predeterminados. Se creará un respaldo automáticamente.',
  'settings.general.reset-to-defaults-warning':
    'Advertencia: Esto eliminará todas las opciones personalizadas, configuración de cuentas y diseños.',
  'settings.general.reset-to-defaults-resetting': 'Restableciendo...',

  'settings.general.enabled': 'habilitado',
  'settings.general.disabled': 'deshabilitado',

  
  
  
  'settings.customization.title': 'Personalización',
  'settings.customization.description':
    'Personaliza opciones, apariencia y comportamiento del plugin Journalit.',
  'settings.customization.trade-form-layout.description':
    'Elige qué campos y secciones aparecen en el formulario de operación.',
  'settings.customization.trade-form-layout.button': 'Personalizar diseño',
  'settings.customization.tickers-symbols': 'Símbolos/Tickers',
  'settings.customization.symbol-mappings': 'Mapeo de Símbolos',

  'settings.customization.setups': 'Configuraciones',
  'settings.customization.mistakes': 'Errores',
  'settings.customization.tags': 'Etiquetas',
  'settings.customization.events': 'Eventos',

  'settings.customization.options.confirm.update-notes':
    'OK (Actualizar Notas)',
  'settings.customization.options.confirm.save-name': 'Guardar Solo Nombre',
  'settings.customization.options.confirm.cancel': 'Cancelar Acción',
  'settings.customization.options.type.tickers': 'Tickers',
  'settings.customization.options.type.accounts': 'Cuentas',
  'settings.customization.options.type.account-types': 'Tipos de Cuenta',
  'settings.customization.options.type.setups': 'Configuraciones',
  'settings.customization.options.type.mistakes': 'Errores',
  'settings.customization.options.type.tags': 'Etiquetas',
  'settings.customization.options.type.events': 'Eventos',
  'settings.customization.options.asset-type.cfd': 'CFD',
  'settings.customization.options.notice.empty-name':
    'El nombre de la opción no puede estar vacío',
  'settings.customization.options.notice.invalid-ticker':
    'Formato de ticker inválido. Solo se permiten letras, números y puntos.',
  'settings.customization.options.notice.added':
    'Opción "{newValue}" añadida a {type}',
  'settings.customization.options.notice.duplicate':
    'Opción duplicada: {newValue} ya existe',
  'settings.customization.options.notice.asset-type-required':
    'El tipo de activo es requerido para instrumentos',
  'settings.customization.options.notice.updated-with-notes':
    'Opción actualizada de "{oldValue}" a "{newValue}" y se actualizaron {count} notas',
  'settings.customization.options.notice.updated':
    'Opción actualizada de "{oldValue}" a "{newValue}"',
  'settings.customization.options.confirm.rename-message':
    '¿Quieres actualizar todas las notas existentes que usan "{oldValue}" para usar "{newValue}" en su lugar?\n\nEsto buscará en todas las notas y actualizará el valor de la opción donde se encuentre.',
  'settings.customization.options.notice.cannot-delete-archived':
    'No se puede eliminar el tipo de cuenta "Archivado" - está reservado para archivar cuentas',
  'settings.customization.options.confirm.remove-message':
    '¿Estás seguro de que quieres eliminar "{option}"? Esto no se puede deshacer.',
  'settings.customization.options.notice.removed':
    'Opción "{option}" eliminada',
  'settings.customization.options.notice.remove-failed':
    'Error al eliminar la opción',
  'settings.customization.options.confirm.reset-message':
    '¿Estás seguro de que quieres restablecer todos los {type} a las opciones predeterminadas? Esto no se puede deshacer.',
  'settings.customization.options.notice.reset-success':
    'Se restablecieron los {type} a las opciones predeterminadas',
  'settings.customization.options.notice.no-options-to-reset':
    'Las opciones predeterminadas de {type} ya están en uso',
  'settings.customization.options.notice.mapping-symbols-required':
    'Se requieren ambos símbolos',
  'settings.customization.options.notice.mapping-added':
    'Mapeo añadido: {imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    'Error al añadir mapeo',
  'settings.customization.options.notice.mapping-deleted':
    'Mapeo eliminado: {symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    'Error al eliminar mapeo',
  'settings.customization.options.empty-state':
    'No se han añadido {type} personalizados todavía.',
  'settings.customization.options.label.save-changes': 'Guardar cambios',
  'settings.customization.options.label.cancel-editing': 'Cancelar edición',
  'settings.customization.options.label.edit-option': 'Editar {option}',
  'settings.customization.options.label.remove-option': 'Eliminar {option}',
  'settings.customization.options.placeholder.select-asset':
    'Seleccionar tipo de activo...',
  'settings.customization.options.field.pip-size': 'Tamaño del Pip',
  'settings.customization.options.field.priority': 'Prioridad:',
  'settings.customization.options.field.default-event-notes':
    'Notas predeterminadas del evento:',
  'settings.customization.options.placeholder.default-event-notes':
    'Notas que se autocompletarán cuando se seleccione este evento',
  'settings.customization.options.aria.confirm-add': 'Confirmar añadir {type}',
  'settings.customization.options.label.locked': 'Bloqueado',
  'settings.customization.options.label.archived-reserved':
    'Archivado (reservado)',
  'settings.customization.options.aria.reset-all':
    'Eliminar todos los {type} personalizados',
  'settings.customization.options.button.reset-all':
    'Restablecer Todos los {type}',
  'settings.customization.options.placeholder.new-name':
    'Nombre de nuevo {type}',
  'settings.customization.options.placeholder.dollar-per-point': '$/punto',
  'settings.customization.options.placeholder.tick-size': 'Tamaño del tick',
  'settings.customization.options.placeholder.tick-value': 'Valor del tick',
  'settings.customization.options.placeholder.lot-size': 'Tamaño del lote',
  'settings.customization.options.placeholder.pip-value': 'Valor del pip',
  'settings.customization.options.placeholder.pip-size': 'Tamaño del pip',
  'settings.customization.options.field.optional': '(opcional)',
  'settings.customization.options.mapping.description':
    'Mapea símbolos específicos de contrato (ej., NQZ5) a símbolos base (ej., NQ) para búsqueda automática de especificaciones',
  'settings.customization.options.mapping.auto-detected': 'Auto-detectado',
  'settings.customization.options.mapping.manual': 'Manual',
  'settings.customization.options.mapping.created-at': 'Creado {date}',
  'settings.customization.options.mapping.no-mappings':
    'No hay mapeos de símbolos todavía. Los mapeos se crean automáticamente durante las importaciones CSV cuando se detectan símbolos de contrato.',
  'settings.customization.options.mapping.placeholder-imported':
    'Símbolo importado (ej., NQZ5)',
  'settings.customization.options.mapping.placeholder-base':
    'Símbolo base (ej., NQ)',
  'settings.customization.options.mapping.button-add': 'Añadir Mapeo',
  'settings.customization.options.placeholder.add-new': 'Añadir nuevo {type}',
  'settings.customization.options.aria.delete-mapping': 'Eliminar mapeo',
  'settings.customization.options.instrument.specs-futures':
    '${dollar}/pt, {tick} tick, ${value} valor tick',
  'settings.customization.options.instrument.specs-forex':
    '{lot} lote, ${pip} valor pip, {size} tamaño pip',
  'settings.customization.options.instrument.built-in': '(integrado)',
  'settings.customization.options.instrument.mapped-to':
    'Mapeado a {base} (usa especificaciones de {base})',
  'settings.customization.options.instrument.no-specs':
    '(Sin especificaciones)',

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
  
  
  
  'settings.customization.custom-fields.description':
    'Añade tus propios campos a cada operación, como sesión, marco temporal o calidad del setup. Aparecen en la pestaña Avanzado del formulario, se guardan en el frontmatter de la nota y pueden convertirse en columnas ordenables y filtrables del registro de operaciones.',
  'settings.customization.custom-fields.title':
    'Campos Personalizados ({count})',
  'settings.customization.custom-fields.manage-desc':
    'Gestiona tus campos personalizados del formulario de operación',
  'settings.customization.custom-fields.type-dropdown': 'Desplegable',
  'settings.customization.custom-fields.type-multiselect': 'Multi-selección',
  'settings.customization.custom-fields.type-suffix': 'campo',
  'settings.customization.custom-fields.option-count.one': '{count} opción',
  'settings.customization.custom-fields.option-count.few': '{count} opciones',
  'settings.customization.custom-fields.option-count.many': '{count} opciones',
  'settings.customization.custom-fields.option-count.other': '{count} opciones',
  'settings.customization.custom-fields.no-fields':
    'No hay campos personalizados definidos todavía',
  'settings.customization.custom-fields.no-fields-desc':
    'Empieza con un campo que realmente vayas a revisar después, como la sesión en la que operaste o hasta qué punto el setup encajaba con tu plan.',
  'settings.customization.custom-fields.add-new': 'Añadir Nuevo Campo',

  'settings.customization.custom-fields.edit-field-with-name':
    'Editar “{fieldLabel}”',
  'settings.customization.custom-fields.configure-desc':
    'Configura los ajustes de tu campo personalizado abajo',
  'settings.customization.custom-fields.actions': 'Acciones',
  'settings.customization.custom-fields.actions-desc':
    'Gestiona tus campos personalizados',
  'settings.customization.custom-fields.add-button':
    'Añadir Campo Personalizado',
  'settings.customization.custom-fields.delete-all-button':
    'Eliminar Todos los Campos',

  'settings.customization.custom-fields.editor.title':
    'Configuración del Campo',
  'settings.customization.custom-fields.editor.label': 'Etiqueta del Campo',
  'settings.customization.custom-fields.editor.label-desc':
    'Nombre para mostrar de este campo',
  'settings.customization.custom-fields.editor.label-placeholder':
    'Ingresa etiqueta del campo',
  'settings.customization.custom-fields.editor.key': 'Clave de Frontmatter',
  'settings.customization.custom-fields.editor.key-desc':
    'Esta clave aparecerá en tus archivos de operación: ',
  'settings.customization.custom-fields.editor.key-placeholder': 'nombre_campo',
  'settings.customization.custom-fields.editor.key-reserved':
    '⚠️ Nombre de campo reservado',
  'settings.customization.custom-fields.editor.type': 'Tipo de Campo',
  'settings.customization.custom-fields.editor.type-desc':
    'Tipo de campo de entrada',
  'settings.customization.custom-fields.editor.placeholder':
    'Texto de Marcador',
  'settings.customization.custom-fields.editor.placeholder-desc':
    'Texto de marcador opcional que se muestra en campo vacío',
  'settings.customization.custom-fields.editor.placeholder-input':
    'Ingresa texto de marcador',
  'settings.customization.custom-fields.editor.validation': 'Validación',
  'settings.customization.custom-fields.editor.validation-desc':
    'Reglas de validación del campo',
  'settings.customization.custom-fields.editor.validation.required':
    'Campo Requerido',
  'settings.customization.custom-fields.editor.validation.required-desc':
    'Hacer este campo obligatorio',
  'settings.customization.custom-fields.editor.validation.min-length':
    'Longitud Mínima',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    'Número mínimo de caracteres',
  'settings.customization.custom-fields.editor.validation.no-min': 'Sin mínimo',
  'settings.customization.custom-fields.editor.validation.max-length':
    'Longitud Máxima',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    'Número máximo de caracteres',
  'settings.customization.custom-fields.editor.validation.no-max': 'Sin máximo',
  'settings.customization.custom-fields.editor.validation.min-value':
    'Valor Mínimo',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    'Número mínimo permitido',
  'settings.customization.custom-fields.editor.validation.max-value':
    'Valor Máximo',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    'Número máximo permitido',
  'settings.customization.custom-fields.editor.options': 'Opciones',
  'settings.customization.custom-fields.editor.options-desc':
    'Opciones disponibles para este campo',
  'settings.customization.custom-fields.editor.add-option':
    'Añadir Nueva Opción',
  'settings.customization.custom-fields.editor.add-option-desc':
    'Ingresa una nueva opción',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    'Ingresa nueva opción',
  'settings.customization.custom-fields.editor.allow-create':
    'Permitir Crear Nuevas Opciones',
  'settings.customization.custom-fields.editor.allow-create-desc':
    'Los usuarios pueden crear nuevas opciones cuando usen este campo en formularios de operación',
  'settings.customization.custom-fields.editor.save': 'Guardar Campo',
  'settings.customization.custom-fields.editor.delete': 'Eliminar Campo',

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
    'Mostrar como moneda',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Formatea este campo numérico como un valor monetario solo en el registro de operaciones',
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

  'settings.customization.custom-fields.type.text': 'Texto',
  'settings.customization.custom-fields.type.number': 'Número',
  'settings.customization.custom-fields.type.date': 'Fecha',
  'settings.customization.custom-fields.type.datetime': 'Fecha y Hora',
  'settings.customization.custom-fields.type.time': 'Hora',

  'settings.customization.custom-fields.error.cannot-save':
    'No se puede guardar el campo: {error}',
  'settings.customization.custom-fields.error.duplicate-key':
    'Ya existe un campo con esta clave de frontmatter',
  'settings.customization.custom-fields.error.save-failed':
    'Error al guardar el campo. Por favor intenta de nuevo.',
  'settings.customization.custom-fields.notice.import-summary':
    'Se importaron {validCount} campos válidos de {totalCount} totales',

  'settings.customization.custom-fields.delete.confirm-message':
    '¿Estás seguro de que quieres eliminar el campo personalizado "{fieldLabel}"?',
  'settings.customization.custom-fields.delete.cannot-undo':
    'Esta acción no se puede deshacer.',

  'settings.customization.custom-fields.reset.confirm-message':
    '¿Estás seguro de que quieres eliminar TODOS los campos personalizados?',

  'settings.customization.custom-fields.saved-options.title':
    'Opciones Personalizadas Guardadas',
  'settings.customization.custom-fields.saved-options.description':
    'Gestiona las opciones que los usuarios han creado para campos personalizados',
  'settings.customization.custom-fields.saved-options.delete-error':
    'Error al eliminar opción. Por favor intenta de nuevo.',
  'settings.customization.custom-fields.saved-options.clear-error':
    'Error al limpiar opciones. Por favor intenta de nuevo.',

  'settings.customization.custom-fields.option.delete-confirm':
    '¿Estás seguro de que quieres eliminar la opción "{optionName}"?',
  'settings.customization.custom-fields.option.clear-confirm':
    '¿Estás seguro de que quieres eliminar TODAS las opciones guardadas para "{fieldLabel}"?',

  
  
  
  
  'widget.goals.title.daily': 'Objetivos Diarios',
  'widget.goals.title.weekly': 'Objetivos Semanales',
  'widget.goals.title.monthly': 'Objetivos Mensuales',
  'widget.goals.title.quarterly': 'Objetivos Trimestrales',
  'widget.goals.title.yearly': 'Objetivos Anuales',
  'widget.goals.title.default': 'Objetivos',
  'widget.goals.tooltip.daily':
    'Define lo que quieres lograr en la sesión de trading de hoy. Usa esta lista para mantenerte enfocado en tus prioridades de desarrollo.',
  'widget.goals.tooltip.weekly':
    'Tus objetivos de trading para esta semana. Revísalos regularmente para seguir tu progreso.',
  'widget.goals.tooltip.monthly':
    'Áreas clave de enfoque para este mes. Objetivos más grandes que guían tus revisiones semanales.',
  'widget.goals.tooltip.quarterly':
    'Objetivos trimestrales que se alinean con tu plan de trading anual.',
  'widget.goals.tooltip.yearly':
    'Visión de largo plazo y objetivos principales para el año.',
  'widget.goals.completed': '{completed}/{total} completados',
  'widget.goals.placeholder': 'Agregar un nuevo objetivo...',
  'widget.goals.empty.preview': 'Sin objetivos configurados',
  'widget.goals.empty.default': 'Sin objetivos establecidos. Agrega uno abajo.',
  'widget.goals.invalid-context':
    'El widget de Objetivos requiere un contexto de revisión válido. Asegúrate de que este archivo sea una nota de Revisión Diaria, Revisión Semanal, Revisión Mensual, Revisión Trimestral o Revisión Anual.',
  'widget.goals.aria.edit': 'Editar objetivo',
  'widget.goals.aria.delete': 'Eliminar objetivo',
  'widget.goals.name': 'Objetivos',
  'widget.goals.description': 'Objetivos diarios con casillas de verificación',

  
  'widget.header.name': 'Encabezado',

  'widget.header.invalid-context':
    'El widget de Encabezado requiere un contexto de revisión válido (DRC, Semanal, Mensual, Trimestral, Anual o Trade)',
  'widget.header.aria.mark-reviewed': 'Clic para marcar como revisado',
  'widget.header.aria.mark-not-reviewed': 'Clic para marcar como no revisado',
  'widget.header.unknown-instrument': 'Desconocido',
  'widget.header.week': 'Semana {number}',
  'widget.header.quarter': 'T{number}',
  'widget.header.drc': 'DRC',
  'widget.header.nav.prev': '← Anterior',
  'widget.header.nav.next': 'Siguiente →',
  'widget.header.day.0': 'Domingo',
  'widget.header.day.1': 'Lunes',
  'widget.header.day.2': 'Martes',
  'widget.header.day.3': 'Miércoles',
  'widget.header.day.4': 'Jueves',
  'widget.header.day.5': 'Viernes',
  'widget.header.day.6': 'Sábado',
  'widget.header.month.0': 'Enero',
  'widget.header.month.1': 'Febrero',
  'widget.header.month.2': 'Marzo',
  'widget.header.month.3': 'Abril',
  'widget.header.month.4': 'Mayo',
  'widget.header.month.5': 'Junio',
  'widget.header.month.6': 'Julio',
  'widget.header.month.7': 'Agosto',
  'widget.header.month.8': 'Septiembre',
  'widget.header.month.9': 'Octubre',
  'widget.header.month.10': 'Noviembre',
  'widget.header.month.11': 'Diciembre',
  'widget.header.month-short.0': 'Ene',
  'widget.header.month-short.1': 'Feb',
  'widget.header.month-short.2': 'Mar',
  'widget.header.month-short.3': 'Abr',
  'widget.header.month-short.4': 'May',
  'widget.header.month-short.5': 'Jun',
  'widget.header.month-short.6': 'Jul',
  'widget.header.month-short.7': 'Ago',
  'widget.header.month-short.8': 'Sep',
  'widget.header.month-short.9': 'Oct',
  'widget.header.month-short.10': 'Nov',
  'widget.header.month-short.11': 'Dic',

  
  'widget.picker.placeholder': 'Seleccionar un widget...',
  'widget.picker.search-placeholder': 'Buscar widgets...',
  'widget.picker.search-label': 'Buscar widgets',
  'widget.picker.clear-search': 'Borrar búsqueda de widgets',
  'widget.picker.results-label': 'Widgets disponibles',
  'widget.picker.no-results': 'Ningún widget coincide con tu búsqueda',

  
  'widget.category.charts': 'Gráficos',
  'widget.category.statistics': 'Estadísticas',
  'widget.category.content': 'Contenido',
  'widget.category.tables': 'Tablas',
  'widget.category.layout': 'Diseño',

  
  'widget.review.name': 'Revisión',
  'widget.review.description': 'Calificaciones de desempeño mental y técnico',
  'widget.review-context-fields.name': 'Review Context Fields',
  'widget.review-context-fields.description':
    'Editable custom context fields for review notes',
  'widget.review-context-fields.group.default': 'Review Context',

  'widget.review-context-fields.empty-title':
    'No review context fields configured for this review type.',
  'widget.review-context-fields.empty-desc':
    'Create review custom fields in settings to capture bias, focus, intent, and other planning context.',
  'widget.review-context-fields.configure': 'Configure Review Fields',
  'widget.review-context-fields.service-unavailable':
    'Review custom fields are not available yet.',
  'widget.review-context-fields.unsupported-type':
    'Unsupported review field type.',
  'widget.review-context-fields.source-missing':
    'This parent review does not exist yet.',
  'widget.review-context-fields.source-invalid':
    'This parent review exists but is not a valid review note.',
  'widget.review-context-fields.source-empty':
    'Todavía no hay valores heredados completados en esta revisión principal.',

  'widget.review.title': 'Revisión de Desempeño',
  'widget.review.mental-game': 'Juego Mental',
  'widget.review.technical-game': 'Juego Técnico',
  'widget.review.star-hint':
    'Clic para estrella completa, clic derecho para media estrella',
  'widget.review.invalid-context':
    'El widget de Revisión requiere un contexto de revisión válido (DRC, Semanal, Mensual)',

  
  'widget.checklist.name': 'Lista de Verificación',
  'widget.checklist.description': 'Lista de preparación pre-sesión',
  'widget.checklist.title': 'Lista Pre-Trade',
  'widget.checklist.weekly-title': 'Lista previa semanal',
  'widget.checklist.tooltip.weekly':
    'Los elementos añadidos aquí solo se aplican a esta semana.',
  'widget.checklist.tooltip.weekly-settings-link':
    'Para elementos recurrentes en todas las nuevas revisiones semanales, ve a Configuración > Revisiones.',
  'widget.checklist.tooltip.day-only':
    'Tu lista de verificación personal pre-sesión. Completa estos elementos antes de comenzar a operar cada día.',
  'widget.checklist.tooltip.settings-link':
    'Edita tu lista de verificación en Configuración → Lista de Verificación Pre-Trade',
  'widget.checklist.completed': 'completado',
  'widget.checklist.edit-item': 'Editar elemento',
  'widget.checklist.delete-item': 'Eliminar elemento',
  'widget.checklist.empty.preview': 'Sin elementos de lista configurados',
  'widget.checklist.empty.add-one':
    'Sin elementos en la lista. Agrega uno abajo.',
  'widget.checklist.placeholder': 'Agregar nuevo elemento a la lista...',
  'widget.checklist.invalid-context':
    'El widget de Lista de Verificación requiere un contexto de revisión válido',

  
  'widget.session-mistakes.name': 'Errores de Sesión',
  'widget.session-mistakes.description':
    'Registra errores conductuales al final de la sesión',
  'widget.session-mistakes.title': 'Errores de Sesión',
  'widget.session-mistakes.subtitle':
    'Registra los errores una vez por sesión en lugar de repetirlos en cada operación.',

  'widget.session-mistakes.placeholder': 'Selecciona o crea errores',
  'widget.session-mistakes.empty': 'No hay errores de sesión registrados',

  'widget.session-mistakes.invalid-context':
    'El widget de Errores de Sesión requiere una nota DRC (type: drc)',

  
  'widget.key-levels.name': 'Niveles Clave',
  'widget.key-levels.description': 'Niveles de precio importantes a observar',
  'widget.key-levels.title': 'Niveles Clave',
  'widget.key-levels.support': 'Soporte',
  'widget.key-levels.resistance': 'Resistencia',
  'widget.key-levels.no-levels': 'Sin niveles definidos',
  'widget.key-levels.price-placeholder': 'Precio...',
  'widget.key-levels.select-importance': 'Seleccionar importancia',
  'widget.key-levels.remove-level': 'Eliminar nivel',
  'widget.key-levels.invalid-context':
    'El widget de Niveles Clave requiere un contexto de revisión válido',
  'widget.key-levels.source.weekly': 'Semanal',
  'widget.key-levels.source.monthly': 'Mensual',
  'widget.key-levels.open-source-review': 'Abrir revisión {label}',
  'widget.key-levels.importance.none': 'Ninguna',
  'widget.key-levels.importance.high': 'Alta',
  'widget.key-levels.importance.medium': 'Media',
  'widget.key-levels.importance.low': 'Baja',

  
  'widget.key-events.name': 'Eventos Clave',
  'widget.key-events.description': 'Eventos importantes durante el período',
  'widget.key-events.title': 'Eventos Clave',
  'widget.key-events.tooltip':
    'Los eventos clave se guardan en tu Revisión Semanal y se pueden agregar o editar aquí en el DRC.',
  'widget.key-events.placeholder': 'Seleccionar o crear evento',
  'widget.key-events.color-label': 'Color:',
  'widget.key-events.color-aria': 'Seleccionar color {color}',
  'widget.key-events.day-label': 'Día:',
  'widget.key-events.currency-label': 'Divisa:',
  'widget.key-events.time-label': 'Hora:',
  'widget.key-events.field-unset': 'Sin definir',
  'widget.key-events.notes-placeholder': 'Notas sobre este evento (opcional)',
  'widget.key-events.notes-label': 'Notas',
  'widget.key-events.default-notes-tooltip':
    'Las notas predeterminadas se gestionan en Configuración → Personalización → Eventos. Al seleccionar un evento aquí, se autocompletarán sus notas predeterminadas guardadas.',
  'widget.key-events.add-button': 'Agregar Evento',
  'widget.key-events.empty-state': 'Sin eventos clave para hoy',
  'widget.key-events.empty-state-sub': 'Agrega eventos en tu Revisión Semanal',
  'widget.key-events.open-calendar-aria': 'Abrir calendario económico',
  'widget.key-events.restore-auto-import':
    'Restaurar eventos importados automáticamente',
  'widget.key-events.restore-missing-events':
    'Restaurar eventos faltantes ({count})',

  
  'widget.missed-trades.name': 'Operaciones Perdidas',
  'widget.missed-trades.description':
    'Operaciones que identificaste pero no tomaste',
  'widget.missed-trades.title': 'Operaciones Perdidas',
  'widget.missed-trades.add-button': 'Agregar',
  'widget.missed-trades.add-aria': 'Agregar operación perdida',

  'widget.missed-trades.additional-setups': 'Configuraciones Adicionales:',
  'widget.missed-trades.no-trades-today': 'Ninguna hoy',
  'widget.missed-trades.no-trades-week': 'Sin operaciones perdidas esta semana',
  'widget.missed-trades.invalid-context':
    'El widget de Operaciones Perdidas requiere un contexto de revisión válido',
  'widget.missed-trades.error-no-date':
    'No se pudo determinar la fecha de la operación perdida',
  'widget.missed-trades.error-open-form':
    'Error al abrir formulario de operación perdida',

  
  'widget.images.name': 'Gráficos y medios',
  'widget.images.description': 'Carrusel de medios con soporte de carga',
  'widget.images.invalid-context':
    'El widget de Imágenes requiere un contexto de revisión válido',
  'widget.images.alt-prefix': 'Medio de revisión',
  'widget.images.stacked-alt': 'Medio de revisión {index}',
  'widget.images.open-fullscreen': 'Abrir medio {index} en pantalla completa',
  'widget.images.delete': 'Eliminar medio',
  'widget.images.empty': 'Sin medios',
  'widget.images.placeholder': 'Pegar URL de imagen o ruta de archivo...',
  'widget.images.placeholder-add-more': 'Agregar más medios...',

  
  'widget.mark-reviewed.name': 'Marcar como Revisado',
  'widget.mark-reviewed.description':
    'Botón para marcar la revisión como completada',
  'widget.mark-reviewed.status.reviewed': 'REVISADO',
  'widget.mark-reviewed.status.pending': 'REVISIÓN PENDIENTE',
  'widget.mark-reviewed.button.undo': 'Deshacer',
  'widget.mark-reviewed.button.mark': 'Marcar como Revisado',

  
  'widget.pnl-chart.name': 'Curva de Capital',
  'widget.pnl-chart.description': 'Ganancia/pérdida acumulada en el tiempo',
  'widget.drawdown-chart.name': 'Drawdown',
  'widget.drawdown-chart.description':
    'Closed-trade drawdown amount from the prior realized P&L high',
  'widget.directional-pnl.name': 'Directional P&L',
  'widget.directional-pnl.description': 'Long vs short performance comparison',
  'widget.directional-pnl.title.long': 'G/P Operaciones Largas',
  'widget.directional-pnl.title.short': 'G/P Operaciones Cortas',
  'widget.directional-pnl.empty.not-enough':
    'No hay suficientes operaciones cerradas para mostrar G/P direccional',
  'widget.directional-pnl.empty.no-closed':
    'Sin operaciones cerradas para este período',
  'widget.directional-pnl.empty.no-long':
    'Sin operaciones largas en este período',
  'widget.directional-pnl.empty.no-short':
    'Sin operaciones cortas en este período',
  'widget.trades-chart.name': 'G/P por Operación',
  'widget.trades-chart.description':
    'Barra de G/P para cada operación individual',
  'widget.trades-chart-daily.name': 'G/P Diario',
  'widget.trades-chart-daily.description': 'G/P agregado por día',
  'widget.trades-chart-weekly.name': 'G/P Semanal',
  'widget.trades-chart-weekly.description': 'G/P agregado por semana',
  'widget.trades-chart-monthly.name': 'G/P Mensual',
  'widget.trades-chart-monthly.description': 'G/P agregado por mes',
  'widget.trades-chart-quarterly.name': 'G/P Trimestral',
  'widget.trades-chart-quarterly.description': 'G/P agregado por trimestre',

  
  'widget.stats.name': 'Cuadrícula de Estadísticas',
  'widget.stats.description':
    'Métricas clave de rendimiento en formato cuadrícula',
  'widget.stats.no-trades': 'Sin operaciones cerradas para este período',
  'widget.stats.net-pnl': 'G/P Neto',
  'widget.stats.win-rate': 'Tasa de Acierto',
  'widget.stats.profit-factor': 'Factor de Beneficio',
  'widget.stats.expectancy': 'Esperanza',
  'widget.stats.total-trades': 'Total Operaciones',
  'widget.stats.avg-win': 'Ganancia Promedio',
  'widget.stats.avg-loss': 'Pérdida Promedio',
  'widget.stats.pl-ratio': 'Ratio G/P',
  'widget.account-breakdown.name': 'Account Breakdown',
  'widget.account-breakdown.description':
    'Compare performance across accounts in this review period',

  
  'widget.account-breakdown.empty': 'No closed trades for this period',
  'widget.account-breakdown.column.account': 'Account',
  'widget.account-breakdown.column.trades': 'Trades',
  'widget.account-breakdown.column.pnl': 'Net P&L',
  'widget.account-breakdown.column.win-rate': 'Win Rate',
  'widget.account-breakdown.column.profit-factor': 'Profit Factor',
  'widget.tag-performance.name': 'Rendimiento por etiquetas',
  'widget.tag-performance.description':
    'Desglose del rendimiento por etiqueta de operación',
  'widget.setup-performance.name': 'Rendimiento por Configuración',
  'widget.setup-performance.description':
    'Rendimiento desglosado por configuración de trading',

  
  'widget.best-worst-trades.name': 'Mejores/Peores Operaciones',
  'widget.best-worst-trades.description':
    'Operaciones con mayores ganancias y pérdidas',
  'widget.best-worst.best-trade': 'Mejor Operación',
  'widget.best-worst.worst-trade': 'Peor Operación',
  'widget.best-worst.no-win-trades': 'Sin operaciones ganadoras',
  'widget.best-worst.no-loss-trades': 'Sin operaciones perdedoras',
  'widget.best-worst.best-month': 'Mejor Mes',
  'widget.best-worst.worst-month': 'Peor Mes',
  'widget.best-worst.no-profitable-months': 'Sin meses rentables',
  'widget.best-worst.no-losing-months': 'Sin meses con pérdidas',
  'widget.best-worst.n-trades': '{count} operaciones',
  'widget.best-worst.win-rate': '{rate}% tasa de acierto',

  
  'widget.best-worst-days.name': 'Mejores/Peores Días',
  'widget.best-worst-days.description': 'Días con mayor y menor G/P',
  'widget.best-worst-days.best-day': 'Mejor Día',
  'widget.best-worst-days.worst-day': 'Peor Día',
  'widget.best-worst-days.no-profitable-days': 'Sin días rentables',
  'widget.best-worst-days.no-losing-days': 'Sin días con pérdidas',
  'widget.best-worst-days.trade-count.one': '{count} operación',
  'widget.best-worst-days.trade-count.few': '{count} operaciones',
  'widget.best-worst-days.trade-count.many': '{count} operaciones',
  'widget.best-worst-days.trade-count.other': '{count} operaciones',
  'widget.best-worst-days.win-rate': '{rate}% tasa de acierto',
  'widget.best-worst-days.invalid-context':
    'El widget de Mejores/Peores Días requiere un contexto de revisión válido',

  
  'widget.best-worst-weeks.name': 'Mejores/Peores Semanas',
  'widget.best-worst-weeks.description': 'Semanas con mayor y menor G/P',
  'widget.best-worst-weeks.best-week': 'Mejor Semana',
  'widget.best-worst-weeks.worst-week': 'Peor Semana',
  'widget.best-worst-weeks.no-profitable': 'Sin semanas rentables',
  'widget.best-worst-weeks.no-losing': 'Sin semanas con pérdidas',
  'widget.best-worst-weeks.week-name': 'Semana {number} ({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} operaciones',
  'widget.best-worst-weeks.win-rate': '{percent}% tasa de acierto',
  'widget.best-worst-weeks.invalid-context':
    'El widget de Mejores/Peores Semanas requiere un contexto de revisión válido',

  
  'widget.best-worst-months.name': 'Mejores/Peores Meses',
  'widget.best-worst-months.description': 'Meses con mayor y menor G/P',
  'widget.best-worst-months.invalid-context':
    'El widget de Mejores/Peores Meses requiere un contexto de revisión válido',

  
  'widget.best-worst-quarters.name': 'Mejores/Peores Trimestres',
  'widget.best-worst-quarters.description': 'Trimestres con mayor y menor G/P',
  'widget.best-worst-quarters.best-quarter': 'Mejor Trimestre',
  'widget.best-worst-quarters.worst-quarter': 'Peor Trimestre',
  'widget.best-worst-quarters.no-profitable': 'Sin trimestres rentables',
  'widget.best-worst-quarters.no-losing': 'Sin trimestres con pérdidas',
  'widget.best-worst-quarters.trade-count': '{count} operaciones',
  'widget.best-worst-quarters.win-rate': '{percent}% tasa de acierto',
  'widget.best-worst-quarters.invalid-context':
    'El widget de Mejores/Peores Trimestres requiere un contexto de revisión válido',

  
  'widget.position-size.title': 'Tamaño de Posición',
  'widget.position-size.save-defaults': 'Guardar como predeterminado',
  'widget.position-size.reset-defaults': 'Restablecer predeterminados',
  'widget.position-size.stock-crypto': 'Acciones/Cripto',
  'widget.position-size.futures': 'Futuros',
  'widget.position-size.forex': 'Forex',
  'widget.position-size.account-balance': 'Balance de Cuenta',
  'widget.position-size.risk-percent': 'Riesgo %',
  'widget.position-size.entry-price': 'Precio de Entrada',
  'widget.position-size.profit-target-optional':
    'Objetivo de Ganancia (opcional)',
  'widget.position-size.currency-pair': 'Par de Divisas',
  'widget.position-size.stop-loss-pips': 'Stop Loss (pips)',
  'widget.position-size.target-pips-optional': 'Objetivo (pips, opcional)',
  'widget.position-size.placeholder.example': 'p. ej., {value}',
  'widget.position-size.enter-values': 'ingresa valores',
  'widget.position-size.risk': 'Riesgo',
  'widget.position-size.reward': 'Recompensa',
  'widget.position-size.stop': 'stop',
  'widget.position-size.pts': 'pts',
  'widget.position-size.mini': 'mini',
  'widget.position-size.pip-value-info':
    'Valor de pip: ${value} (lote estándar) | Tamaño de pip: {size}',
  'widget.position-size.futures-info': '${dollar}/pt | Tick: {size} = ${value}',
  'widget.position-size.investment-dollar': 'Inversión ($)',
  'widget.position-size.investment': 'Inversión',
  'widget.position-size.at-price': '@ ${price}',

  
  'widget.technical-game.name': 'Juego Técnico',
  'widget.technical-game.description':
    'Califica tu ejecución técnica y disciplina de trading',
  'widget.mental-game.name': 'Juego Mental',
  'widget.mental-game.description':
    'Califica tu estado emocional y psicología de trading',

  
  'widget.demon-tracker.name': 'Rastreador de Demonios',
  'widget.demon-tracker.description': 'Rastrea errores de trading recurrentes',

  
  'widget.trading-score.title': 'Puntuación de Trading',
  'widget.trading-score.no-data': 'Sin datos de operaciones',
  'widget.trading-score.breakdown-title': 'Desglose de Puntuación',
  'widget.trading-score.close-breakdown': 'Cerrar desglose',
  'widget.trading-score.of-weeks': 'de {count}',
  'widget.trading-score.start-trading':
    'Comienza a operar para desbloquear tu puntuación',
  'widget.trading-score.one-week-down': '¡1 semana completada, sigue así!',
  'widget.trading-score.weeks-to-unlock.one':
    '{count} semana más para desbloquear',
  'widget.trading-score.weeks-to-unlock.few':
    '{count} semanas más para desbloquear',
  'widget.trading-score.weeks-to-unlock.many':
    '{count} semanas más para desbloquear',
  'widget.trading-score.weeks-to-unlock.other':
    '{count} semanas más para desbloquear',
  'widget.trading-score.trades-to-unlock.one':
    '{count} operación más para desbloquear',
  'widget.trading-score.trades-to-unlock.few':
    '{count} operaciones más para desbloquear',
  'widget.trading-score.trades-to-unlock.many':
    '{count} operaciones más para desbloquear',
  'widget.trading-score.trades-to-unlock.other':
    '{count} operaciones más para desbloquear',
  'widget.trading-score.collect-more-data':
    'Sigue operando para recopilar más datos',
  'widget.trading-score.trades-logged.one': '{count} operación registrada',
  'widget.trading-score.trades-logged.few': '{count} operaciones registradas',
  'widget.trading-score.trades-logged.many': '{count} operaciones registradas',
  'widget.trading-score.trades-logged.other': '{count} operaciones registradas',
  'widget.trading-score.trades-count': '{count} operaciones',
  'widget.trading-score.weight': 'Peso: {weight}%',
  'widget.trading-score.weeks-suffix': '· {weeks}s',
  'widget.trading-score.axis-aria': '{axis}: {score} puntos, {weight}% de peso',
  'widget.trading-score.phase.insufficient': 'Datos Insuficientes',
  'widget.trading-score.phase.developing': 'En Desarrollo',
  'widget.trading-score.phase.established': 'Establecido',
  'widget.trading-score.axis.profitability': 'Rentabilidad',
  'widget.trading-score.axis.riskManagement': 'Gestión de Riesgo',
  'widget.trading-score.axis.execution': 'Ejecución',
  'widget.trading-score.axis.consistency': 'Consistencia',
  'widget.trading-score.axis.returnConsistency': 'Consistencia de Retornos',
  'widget.trading-score.axis.experience': 'Experiencia',
  'widget.trading-score.axis.profitability.desc':
    'Qué tan rentable es tu trading en relación a las pérdidas',
  'widget.trading-score.axis.riskManagement.desc':
    'Qué tan bien gestionas el riesgo y limitas los retrocesos',
  'widget.trading-score.axis.execution.desc':
    'Qué tan bien ejecutas tus operaciones (entrada, salida, tamaño)',
  'widget.trading-score.axis.consistency.desc':
    'Qué consistente es tu tasa de acierto en el tiempo',
  'widget.trading-score.axis.returnConsistency.desc':
    'Qué estables son tus retornos de una semana a otra',
  'widget.trading-score.axis.experience.desc':
    'Tu historial de trading y cantidad de operaciones',

  
  'widget.trades.name': 'Operaciones',
  'widget.trades.description': 'Lista de operaciones con detalles clave',
  'widget.trade-review.name': 'Revisión de operaciones',
  'widget.trade-review.description':
    'Revisa cada operación con imágenes, datos clave y preguntas configurables',
  'widget.trade-review.status.reviewed': 'Revisada',
  'widget.trade-review.status.pending': 'Pendiente',
  'widget.trade-review.no-image': 'Sin imagen de la operación',
  'widget.trade-review.open-trade-note': 'Abrir nota',

  'widget.trade-review.loading': 'Cargando revisiones...',
  'widget.trade-review.no-trades': 'No hay operaciones para revisar.',
  'widget.trade-review.time.open': 'Abierta',
  'widget.trade-review.fallback-title': 'Operación {index}',
  'widget.trade-review.question.win-what-worked': '¿Qué funcionó?',
  'widget.trade-review.placeholder.win-what-worked':
    '¿Qué ejecutaste bien en esta operación?',
  'widget.trade-review.question.win-repeatable': '¿Fue repetible?',
  'widget.trade-review.placeholder.win-repeatable':
    '¿Qué hizo que esta operación fuera repetible?',
  'widget.trade-review.question.key-lesson': 'Lección clave',
  'widget.trade-review.placeholder.key-lesson':
    '¿Qué deberías recordar de esta operación?',
  'widget.trade-review.question.loss-what-went-wrong': '¿Qué salió mal?',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    '¿Qué causó esta pérdida?',
  'widget.trade-review.question.loss-valid-or-mistake':
    '¿Fue una pérdida válida o un error de ejecución?',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    'Describe si el proceso fue válido o evitable.',
  'widget.trade-review.question.loss-avoid-next-time':
    '¿Qué evitaré la próxima vez?',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    '¿Qué comportamiento específico debería cambiar?',
  'widget.trade-review.question.be-managed-correctly':
    '¿Se gestionó correctamente?',
  'widget.trade-review.placeholder.be-managed-correctly':
    '¿La gestión siguió tu plan?',
  'widget.trade-review.image-alt-prefix': 'Imagen de revisión de operación',
  'widget.trade-review.placeholder.default': 'Escribe tus ideas...',

  'widget.trade-review.field.entry': 'Entrada',
  'widget.trade-review.field.exit': 'Salida',
  'widget.trade-review.field.duration': 'Duración',
  'widget.trade-review.field.risk': 'Riesgo',
  'widget.trade-review.field.account': 'Cuenta',
  'widget.trade-review.field.setup': 'Setup',
  'widget.trade-review.field.mistakes': 'Errores',
  'widget.trade-review.field.tags': 'Etiquetas',
  'widget.trade-review.more-context': 'Más contexto',
  'widget.trade-review.field.position-size': 'Tamaño de posición',
  'widget.trade-review.field.stop-loss': 'Stop loss',
  'widget.trade-review.field.take-profit': 'Take profit',
  'widget.trade-review.field.fees': 'Comisiones',
  'widget.trade-review.field.commission': 'Comisión',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': 'Tesis',
  'widget.trade-review.field.notes': 'Notas',
  'widget.trade-review.field.custom-fields': 'Campos personalizados',
  'widget.backtest-trades.name': 'Operaciones de Backtest',
  'widget.backtest-trades.description':
    'Lista de operaciones de backtest para este periodo de revisión',

  
  'widget.breakdown-daily.name': 'Resumen Diario',
  'widget.breakdown-daily.description': 'Tabla de rendimiento agrupada por día',
  'widget.breakdown-weekly.name': 'Resumen Semanal',
  'widget.breakdown-weekly.description':
    'Tabla de rendimiento agrupada por semana',
  'widget.breakdown-monthly.name': 'Resumen Mensual',
  'widget.breakdown-monthly.description':
    'Tabla de rendimiento agrupada por mes',
  'widget.breakdown-quarterly.name': 'Resumen Trimestral',
  'widget.breakdown-quarterly.description':
    'Tabla de rendimiento agrupada por trimestre',
  'widget.breakdown.empty.days-week': 'No hay días de trading esta semana',
  'widget.breakdown.empty.weeks-month': 'No hay semanas de trading este mes',
  'widget.breakdown.empty.months-quarter':
    'No hay meses de trading este trimestre',
  'widget.breakdown.empty.quarters-year':
    'No hay trimestres de trading este año',

  
  'widget.table.header.date': 'Fecha',
  'widget.table.header.week': 'Semana',
  'widget.table.header.month': 'Mes',
  'widget.table.header.quarter': 'Trimestre',

  'widget.table.header.trades': 'Operaciones',
  'widget.table.header.pnl': 'G/P',
  'widget.table.header.win-rate': '% Acierto',
  'widget.table.header.profit-factor': 'FG',
  'widget.table.header.tag': 'Etiqueta',
  'widget.table.header.setup': 'Configuración',
  'widget.table.header.a-games': 'Juegos A',
  'widget.table.header.b-games': 'Juegos B',
  'widget.table.header.c-games': 'Juegos C',
  'widget.table.header.rating': 'Calificación',
  'widget.table.header.avg-rating': 'Calif. Promedio',

  
  'widget.demon-tracker.column.demon': 'DEMONIO',
  'widget.demon-tracker.column.occurrences': 'OCURRENCIAS',
  'widget.demon-tracker.column.stop-trading': 'DEJAR DE OPERAR',
  'widget.demon-tracker.period.this-week': 'esta semana',
  'widget.demon-tracker.period.this-month': 'este mes',
  'widget.demon-tracker.period.this-quarter': 'este trimestre',
  'widget.demon-tracker.period.this-year': 'este año',
  'widget.demon-tracker.empty.title': 'No se registraron errores en {period}',
  'widget.demon-tracker.empty.description':
    'Los errores registrados en tus operaciones aparecerán aquí para ayudar a identificar patrones',
  'widget.demon-tracker.summary.unique': 'Errores únicos:',
  'widget.demon-tracker.summary.total': 'Ocurrencias totales:',
  'widget.demon-tracker.summary.critical': 'Críticos ({threshold}+):',

  
  'widget.markdown-zone.name': 'Zona Markdown',
  'widget.markdown-zone.description': 'Área de contenido markdown libre',
  'widget.markdown-header.name': 'Encabezado de Sección',
  'widget.markdown-header.description':
    'Encabezado markdown para organizar secciones',

  
  'widget.trade-table.column.images': 'Imágenes',
  'widget.trade-table.column.date': 'Fecha',
  'widget.trade-table.column.entry': 'Entrada',
  'widget.trade-table.column.ticker': 'Ticker',
  'widget.trade-table.column.account': 'Account',
  'widget.trade-table.column.pnl': 'G/P',
  'widget.trade-table.column.direction': 'Dirección',
  'widget.trade-table.column.setups': 'Configuraciones',
  'widget.trade-table.column.mistakes': 'Errores',
  'widget.trade-table.empty': 'Sin operaciones para este período',
  'widget.trade-table.status.open': 'ABIERTA',
  'widget.trade-table.na': 'N/D',
  'widget.trade-table.unknown': 'Desconocido',

  'widget.trade-table.image-alt': 'Vista previa de operación {id}',
  'widget.trade-table.fullscreen-title': 'Imagen de Operación {id}',
  'widget.trade-table.fullscreen-alt': 'Imagen {index} de Operación {id}',
  'widget.trade-table.duration.days-hours': '{days}d {hours}h',
  'widget.trade-table.duration.hours-mins': '{hours}h {mins}m',
  'widget.trade-table.duration.mins': '{mins}m',
  'widget.trade-table.pagination.showing':
    'Mostrando {start}-{end} de {total} operaciones',
  'widget.trade-table.pagination.prev': '← Anterior',
  'widget.trade-table.pagination.next': 'Siguiente →',
  'widget.trade-table.pagination.page': 'Página {current} de {total}',
  'widget.backtest-trades.empty':
    'No hay operaciones de backtest para este periodo',

  
  
  
  'widget.empty.no-data': 'Sin datos disponibles',
  'widget.empty.no-trades': 'Sin operaciones para este período',
  'widget.empty.no-closed-trades': 'Sin operaciones cerradas para este período',
  'widget.empty.no-daily-data': 'Sin datos diarios para este período',
  'widget.empty.no-weekly-data': 'Sin datos semanales para este período',
  'widget.empty.no-monthly-data': 'Sin datos mensuales para este período',
  'widget.empty.no-quarterly-data': 'Sin datos trimestrales para este período',
  'widget.empty.no-tag-data':
    'No hay datos de etiquetas disponibles para este período',
  'widget.empty.no-setup-data':
    'Sin datos de configuración disponibles para este período',
  'widget.empty.no-mental-game-data':
    'Sin datos de juego mental disponibles para {period}',
  'widget.empty.no-technical-game-data':
    'Sin datos de juego técnico disponibles para {period}',

  
  
  
  'widget.invalid-context.title': 'Contexto Inválido',
  'widget.invalid-context.default':
    'Este widget de {widgetType} requiere una nota de revisión o trade',
  'widget.invalid-context.monthly-quarterly-yearly':
    'Este widget solo está disponible en revisiones Mensuales, Trimestrales y Anuales',
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    'Este widget solo está disponible en revisiones Semanales, Mensuales, Trimestrales y Anuales',
  'widget.invalid-context.quarterly-yearly':
    'Este widget solo está disponible en revisiones Trimestrales y Anuales',
  'widget.invalid-context.yearly-only':
    'Este widget solo está disponible en revisiones Anuales',
  'widget.invalid-context.monthly-only':
    'Este widget solo está disponible en revisiones Mensuales',
  'widget.invalid-context.weekly-monthly':
    'Este widget solo está disponible en revisiones Semanales y Mensuales',
  'widget.invalid-context.review-note':
    'Este widget requiere una nota de DRC, Revisión Semanal, Revisión Mensual, Revisión Trimestral o Revisión Anual',

  
  'widget.pnlChart.name': 'G/P Acumulado',
  'widget.pnlChart.description': 'P&L acumulado a lo largo del tiempo',

  'widget.longPnLChart.name': 'P&L Largo',
  'widget.longPnLChart.description': 'P&L acumulado de largos cerrados',
  'widget.shortPnLChart.name': 'P&L Corto',
  'widget.shortPnLChart.description': 'P&L acumulado de cortos cerrados',
  'widget.performanceCalendar.name': 'Calendario de Rendimiento',
  'widget.performanceCalendar.description': 'Calendario de tu P&L diario',

  'widget.dailyPerformance.name': 'Rendimiento Diario',
  'widget.dailyPerformance.description': 'P&L de cada día de trading',

  'widget.tradesChart.name': 'Gráfico de Operaciones',
  'widget.tradesChart.description': 'P&L de cada operación',

  'widget.weekdayPerformance.name': 'Desempeño por Día de Semana',
  'widget.weekdayPerformance.description': 'P&L por día de la semana',

  'widget.hourlyPerformance.name': 'Desempeño por Hora',
  'widget.hourlyPerformance.description': 'P&L por hora del día',

  'widget.tickerPerformance.name': 'Desempeño por Ticker',
  'widget.tickerPerformance.description':
    'Barras que comparan el rendimiento por ticker',
  'widget.tradesChart.limit': '{count} Operaciones',
  'widget.drawdownChart.name': 'Drawdown Chart',
  'widget.drawdownChart.description':
    'Caída desde tu máximo previo de P&L realizado',

  'widget.recentTrades.name': 'Operaciones Recientes',
  'widget.recentTrades.description': 'Lista de tus operaciones más recientes',
  'widget.recentTrades.date': 'Fecha',
  'widget.recentTrades.ticker': 'Ticker',
  'widget.recentTrades.direction': 'Dirección',
  'widget.recentTrades.pnl': 'G/P',
  'widget.recentTrades.no-trades': 'Sin operaciones encontradas',
  'widget.recentTrades.empty-submessage':
    'Registra tu primera operación para verla aquí',
  'widget.recentTrades.unknown': 'Desconocido',
  'widget.rollingWinRate.name': 'Ratio Victoria/Pérdida Móvil',
  'widget.rollingWinRate.description':
    'Ratio de ganancia/pérdida media reciente',

  'widget.rollingStats.name': 'Promedio Móvil Victoria/Pérdida',
  'widget.rollingStats.description':
    'Ganancia y pérdida media en operaciones recientes',

  
  'widget.pagination.showing': 'Mostrando {start}-{end} de {total} {items}',
  'widget.pagination.prev': 'Anterior',
  'widget.pagination.next': 'Siguiente',
  'widget.pagination.page': 'Página {current} de {total}',

  
  
  
  'settings.reset.modal.title': '¿Restablecer Configuración a Predeterminados?',
  'settings.reset.modal.explanation':
    'Esto restablecerá TODA la configuración del plugin a sus valores predeterminados. Esto incluye:',
  'settings.reset.modal.item-custom-options':
    'Todas las opciones personalizadas (tickers, configuraciones, errores)',
  'settings.reset.modal.item-account-settings':
    'Configuración y metadatos de cuentas',
  'settings.reset.modal.item-dashboard-layouts': 'Diseños del panel',
  'settings.reset.modal.item-symbol-mappings': 'Mapeos de símbolos',
  'settings.reset.modal.item-csv-templates': 'Plantillas de Trade Import',
  'settings.reset.modal.item-other': 'Todas las demás personalizaciones',
  'settings.reset.modal.backup-note':
    'Se creará un respaldo antes de restablecer.',
  'settings.reset.modal.warning':
    'Esta acción no se puede deshacer (excepto restaurando desde el respaldo).',
  'settings.reset.backup-failed.title': 'Error en Respaldo',
  'settings.reset.backup-failed.message':
    'No se pudo crear un respaldo de tu configuración actual.',
  'settings.reset.backup-failed.warning':
    'Si continúas con el restablecimiento, no podrás restaurar tu configuración actual.',

  
  
  

  
  'error.render-component': 'Error al renderizar {component}: {error}',

  
  'error.session-expired':
    'Tu sesión ha expirado. Por favor inicia sesión nuevamente en la configuración del plugin.',
  'error.ftp-not-found':
    'Cuenta FTP no encontrada. El sistema creará automáticamente una para ti.',
  'error.no-trading-data':
    'No se encontraron datos de trading. Por favor asegúrate de que tu cuenta MetaTrader esté correctamente conectada y tenga historial de operaciones.',
  'error.unable-connect-service':
    'No se puede conectar al servicio de datos de trading. Por favor verifica tu conexión a internet.',
  'error.invalid-verification-code':
    'Código de verificación inválido. Por favor verifica el código e intenta nuevamente.',
  'error.invalid-registration-data':
    'Datos de registro inválidos. Por favor verifica tu configuración e intenta nuevamente.',
  'error.invalid-request':
    'Solicitud inválida. Por favor verifica tu entrada e intenta nuevamente.',
  'error.access-denied':
    'Acceso denegado. Por favor verifica los permisos de tu cuenta o contacta al soporte.',
  'error.too-many-requests':
    'Demasiadas solicitudes. Por favor espera un momento antes de intentar nuevamente.',
  'error.service-unavailable':
    'El servicio de datos de trading no está disponible temporalmente. Por favor intenta nuevamente en unos pocos minutos.',
  'error.server-error':
    'Ocurrió un error en el servidor. Por favor intenta más tarde o contacta al soporte si el problema persiste.',
  'error.network-error':
    'No se puede conectar al servicio de datos de trading. Por favor verifica tu conexión a internet e intenta nuevamente.',
  'error.unknown': 'Ocurrió un error desconocido',
  'error.unexpected':
    'Ocurrió un error inesperado. Por favor intenta nuevamente o contacta al soporte si el problema persiste.',

  
  'error.settings.invalid-pattern':
    'Patrón de validación inválido. Por favor verifica tu expresión regular e intenta nuevamente.',
  'error.settings.field-name-conflict':
    'Este nombre de campo entra en conflicto con un campo existente. Por favor elige un nombre diferente.',
  'error.settings.invalid-field-name':
    'Nombre de campo inválido. Los nombres de campo solo pueden contener letras, números y guiones bajos.',
  'error.settings.save-failed':
    'No se pueden guardar tus cambios. Por favor verifica tu configuración e intenta nuevamente.',
  'error.settings.load-failed':
    'No se puede cargar la configuración de campos personalizados. Tus campos personalizados pueden no mostrarse correctamente.',
  'error.settings.import-failed':
    'No se puede importar la configuración de campos. Por favor verifica el formato del archivo e intenta nuevamente.',
  'error.settings.create-failed':
    'No se puede crear el campo personalizado. Por favor verifica tu entrada e intenta nuevamente.',
  'error.settings.remove-failed':
    'No se puede eliminar el campo personalizado. Por favor intenta nuevamente.',
  'error.settings.generic':
    'Ocurrió un error al gestionar campos personalizados. Por favor verifica tu configuración e intenta nuevamente.',

  
  'error.options.duplicate':
    'Esta opción ya existe. Por favor elige un nombre diferente.',
  'error.options.invalid-ticker':
    'Símbolo de ticker inválido. Usa solo letras, números y puntos (ej., AAPL, SPX).',
  'error.options.add-ticker-failed':
    'No se puede añadir el símbolo de ticker. Por favor verifica el formato e intenta nuevamente.',
  'error.options.add-failed':
    'No se puede añadir la opción. Puede que ya exista o sea inválida.',
  'error.options.update-failed':
    'No se puede actualizar la opción. Puede que ya exista o sea inválida.',
  'error.options.remove-failed':
    'No se puede eliminar la opción. Por favor intenta nuevamente.',
  'error.options.no-options-reset':
    'No hay opciones para restablecer. La categoría ya está vacía.',
  'error.options.reset-failed':
    'No se pueden restablecer las opciones. Por favor intenta nuevamente.',
  'error.options.save-failed':
    'No se pueden guardar los cambios de opción. Por favor verifica tu configuración e intenta nuevamente.',
  'error.options.generic':
    'Ocurrió un error al gestionar opciones. Por favor intenta nuevamente.',

  
  'error.clipboard.permission-denied':
    'Acceso al portapapeles denegado. Por favor permite permisos de portapapeles en tu navegador para la funcionalidad de pegar.',
  'error.clipboard.not-supported':
    'El pegado de portapapeles no es compatible con tu navegador. Intenta usando Ctrl+V o Cmd+V en su lugar.',
  'error.clipboard.image-too-large':
    'La imagen es demasiado grande para pegar. Por favor usa imágenes de menos de 10MB.',
  'error.clipboard.no-content':
    'No hay nada en el portapapeles para pegar. Intenta copiar una imagen primero.',
  'error.clipboard.no-images':
    'No se encontraron imágenes en el portapapeles. Asegúrate de haber copiado una imagen, no texto u otro contenido.',
  'error.clipboard.network-error':
    'Ocurrió un error de red al procesar el pegado. Por favor verifica tu conexión e intenta nuevamente.',
  'error.clipboard.paste-failed':
    'No se puede completar la operación de pegado. Por favor intenta copiar la imagen nuevamente y pegarla.',
  'error.clipboard.generic':
    'La operación del portapapeles falló. Por favor intenta copiar tu contenido nuevamente y pegarla.',

  
  
  

  
  
  

  
  
  

  'drc.tab.review': 'Revisión',

  
  
  

  
  
  

  'drc.missed-trades.label.reason': 'Razón:',

  
  
  

  
  
  

  'csv.mapper.title': 'Mapear Columnas a Campos de Operación',
  'csv.mapper.subtitle':
    'Vincula tus columnas con los campos de operación que representan.',
  'csv.mapper.do-not-import': 'No importar',
  'csv.mapper.required-badge': 'Requerido',
  'csv.mapper.required-label': 'REQUERIDO',
  'csv.mapper.example': 'Ejemplo:',
  'csv.mapper.mode.title': '¿Qué es cada fila?',
  'csv.mapper.mode.help':
    'Las hojas de diario suelen tener una operación cerrada por fila con una columna de P/L. Los historiales de órdenes del bróker muestran cada compra y venta en su propia fila.',

  'csv.mapper.asset-type.help':
    'Selecciona el tipo de instrumento en este archivo. Esto determina los campos requeridos y la lógica de análisis.',

  'csv.mapper.tip.title': 'Consejo: Mapea Campos Adicionales',
  'csv.mapper.tip.desc':
    'Mapear campos opcionales como comisión y ganancia_pérdida proporciona datos de operación más completos y mejor precisión en la detección de duplicados.',
  'csv.mapper.missing-fields': 'Faltan campos requeridos para {assetType}:',
  'csv.mapper.summary.title': 'Resumen:',
  'csv.mapper.summary.of': 'de',
  'csv.mapper.summary.columns-mapped': 'columnas mapeadas',
  'csv.mapper.summary.all-mapped': 'Todos los campos requeridos mapeados',
  'csv.mapper.available-fields.title': 'Campos de Operación Disponibles',
  'csv.mapper.available-fields.desc':
    'Organizados por categoría con descripciones para campos específicos de activos',

  'csv.template-import.label.share-code': 'Código de Compartir',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': 'Importar Plantilla',

  'csv.template-import.error.import-failed': 'Error al importar plantilla',

  'csv.export-template.label.share-code': 'Código de Compartir',

  'csv.export-template.button.copied': '¡Copiado!',
  'csv.export-template.button.copy': 'Copiar al Portapapeles',

  'csv.mapper.field.symbol': 'Símbolo',
  'csv.mapper.field.direction': 'Dirección (Largo/Corto)',
  'csv.mapper.field.entry-time': 'Hora de Entrada',
  'csv.mapper.field.exit-time': 'Hora de Salida',
  'csv.mapper.field.entry-price': 'Precio de Entrada',
  'csv.mapper.field.exit-price': 'Precio de Salida',
  'csv.mapper.field.quantity': 'Cantidad',
  'csv.mapper.field.notes': 'Notas',
  'csv.mapper.field.order-id': 'ID de Orden',
  'csv.mapper.field.account-id': 'ID de Cuenta',

  'csv.mapper.help.options-required': 'Requerido para operaciones de opciones',
  'csv.mapper.help.option-type-required':
    'Requerido para opciones (call o put)',
  'csv.mapper.help.contract-size':
    'Multiplicador para opciones (generalmente 100) o futuros',
  'csv.mapper.help.order-id': 'Usado para agregar rellenos parciales',
  'csv.mapper.help.asset-types': 'acciones, opciones, futuros, forex, cripto',
  'csv.mapper.help.status': 'Estado de operación: ABIERTA o CERRADA',

  'csv.mapper.category.required': 'Campos Requeridos',
  'csv.mapper.category.optional-core': 'Campos Principales Opcionales',
  'csv.mapper.category.identifiers': 'Identificadores',
  'csv.mapper.category.other': 'Otro',
  'csv.mapper.category.options': 'Campos de Opciones',
  'csv.mapper.category.futures': 'Campos de Futuros',

  
  
  

  'csv.broker.label': 'Broker / Formato de Importación',

  'csv.broker.remove-favorite-aria': 'Eliminar de favoritos',
  'csv.broker.set-favorite-aria': 'Establecer como favorito',

  
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
  'csv.broker.atas': 'ATAS (Estadísticas en tiempo real)',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker.jdr': 'MetaTrader 4 / 5',

  'csv.account-selector.favorite.remove': 'Eliminar de favoritos',
  'csv.account-selector.favorite.set': 'Establecer como favorito',

  

  
  
  

  'csv.results.successfully-imported-suffix': ' operaciones',

  'csv.results.failed-to-import-prefix': 'Error al importar ',
  'csv.results.failed-to-import-suffix': ' filas (ver detalles abajo)',

  'csv.results.pending-local-writes':
    '{count} escritura(s) de notas de operación siguen pendientes. Journalit conciliará las escrituras completadas y mantendrá las proyecciones sin terminar disponibles para restaurarlas.',
  'csv.results.pending-title': 'La importación aún se está sincronizando',

  
  
  

  
  
  

  'csv.image-review.count': '{count} imagen(es)',

  
  
  
  

  'csv.broker-guide.tradovate.step-2':
    'Haz clic en la pestaña "Orders" (NO en Performance)',

  'csv.broker-guide.tradovate.warning.emphasis': 'Importante:',
  'csv.broker-guide.tradovate.warning.message':
    'Usa solo la pestaña Orders. La pestaña Performance no es compatible.',

  

  'csv.broker-guide.ibkr.warning.emphasis': 'Debe usar Orders',

  

  

  'csv.broker-guide.tradingview.step-3':
    'Selecciona "Order History" del dropdown',

  'csv.broker-guide.tradingview.warning.message':
    'Otros tipos de exportación (como Positions u Orders) no funcionarán para importación.',

  

  

  

  'csv.broker-guide.hyperliquid.warning.emphasis': 'Límite de 10.000 entradas.',

  

  'csv.broker-guide.sierrachart.step-1':
    'Abre Trade Activity Log (Trade → Trade Activity Log, o Ctrl+Shift+A)',

  

  

  

  'csv.broker-guide.atas.warning.emphasis': 'Importante:',
  'csv.broker-guide.atas.warning.message':
    'No edites el archivo exportado. Journalit conserva los límites de operaciones de la hoja “Journal” y, cuando está disponible, completa la comisión usando ejecuciones coincidentes de la hoja “Executions”.',

  

  'csv.broker-guide.rithmic.warning.emphasis': 'Importante:',

  

  'csv.broker-guide.jdr.warning.emphasis': 'Importante:',

  
  
  

  'csv.format': 'Formato de Importación: ',

  'csv.button.export-template': 'Exportar Plantilla',
  'csv.button.delete-template': 'Eliminar Plantilla',

  'csv.button.import-another': 'Importar Otro Archivo',
  'csv.results.complete': 'Importación Completa',
  'csv.results.history-ready': 'Tu historial de trading está listo',
  'csv.results.completed-with-issues':
    'La importación se completó con problemas',
  'csv.results.failed': 'Importación Fallida',
  'csv.results.success.one':
    'Se importó exitosamente {count} operación a la Cuenta: {account}',
  'csv.results.success.few':
    'Se importaron exitosamente {count} operaciones a la Cuenta: {account}',
  'csv.results.success.many':
    'Se importaron exitosamente {count} operaciones a la Cuenta: {account}',
  'csv.results.success.other':
    'Se importaron exitosamente {count} operaciones a la Cuenta: {account}',
  'csv.results.updated.one': 'Se actualizó {count} operación existente',
  'csv.results.updated.few': 'Se actualizaron {count} operaciones existentes',
  'csv.results.updated.many': 'Se actualizaron {count} operaciones existentes',
  'csv.results.updated.other': 'Se actualizaron {count} operaciones existentes',
  'csv.results.skipped.one':
    'Se omitió {count} operación duplicada (ya en bóveda)',
  'csv.results.skipped.few':
    'Se omitieron {count} operaciones duplicadas (ya en bóveda)',
  'csv.results.skipped.many':
    'Se omitieron {count} operaciones duplicadas (ya en bóveda)',
  'csv.results.skipped.other':
    'Se omitieron {count} operaciones duplicadas (ya en bóveda)',

  'csv.results.broker': 'Broker: {broker}',

  'csv.results.more-trades.one': 'y {count} operación más...',
  'csv.results.more-trades.few': 'y {count} operaciones más...',
  'csv.results.more-trades.many': 'y {count} operaciones más...',
  'csv.results.more-trades.other': 'y {count} operaciones más...',
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  

  'csv.errors.copy-report': 'Copiar informe',

  'csv.errors.copied': 'Copiado',
  'csv.errors.rows': 'Filas: {rows}',
  'csv.errors.suggestion': 'Sugerencia: ',

  'csv.errors.raw-errors-limit':
    'Mostrando las primeras {shown} de {total} errores',

  

  'csv.report.plugin-version': 'Versión del plugin: {version}',

  'csv.report.broker': 'Bróker: {broker}',

  'csv.report.top-issues': 'Problemas principales:',

  
  'csv.date-format.auto-detect':
    'Autodetección (recomendado para formatos ISO/estándar)',
  'csv.date-format.us-date':
    'Fecha EE.UU.: 12/25/2024 (Schwab, Fidelity, E*TRADE)',
  'csv.date-format.us-datetime':
    'Fecha/Hora EE.UU.: 12/25/2024 14:30:00 (Webull)',
  'csv.date-format.us-short': 'Fecha EE.UU. corta: 1/5/2024 (TradeZero)',
  'csv.date-format.us-short-datetime':
    'Fecha/Hora EE.UU. corta: 1/5/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'ISO Fecha/Hora: 2024-12-25 14:30:00 (Bybit, Tradovate)',
  'csv.date-format.iso-date': 'ISO Fecha: 2024-12-25 (Interactive Brokers)',
  'csv.date-format.eu-date': 'Fecha UE: 25/12/2024 (día/mes/año)',
  'csv.date-format.eu-datetime': 'Fecha/Hora UE: 25/12/2024 14:30:00',
  'csv.date-format.eu-dash': 'Fecha UE con guión: 25-12-2024',
  'csv.date-format.eu-dash-datetime':
    'Fecha/Hora UE con guión: 25-12-2024 14:30:00',

  
  
  
  
  'home.quick-links.hide': 'Ocultar enlace rápido',
  'home.quick-links.add-trade': 'Agregar Operación',
  'home.quick-links.trade-log': 'Registro de Operaciones',
  'home.quick-links.trading-dashboard': 'Panel',
  'home.quick-links.account-dashboard': 'Cuentas',
  'home.quick-links.todays-drc': 'DRC de Hoy',
  'home.quick-links.weekly-review': 'Revisión Semanal',
  'home.quick-links.monthly-review': 'Revisión Mensual',
  'home.quick-links.quarterly-review': 'Revisión de este trimestre',
  'home.quick-links.yearly-review': 'Revisión de este año',
  'home.quick-links.quick-import': 'Quick Import',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'Constructor de Diseño',
  'home.quick-links.navigation-sidebar': 'Barra lateral de navegación',
  'home.quick-links.session-mode': 'Modo de Sesión',
  'home.quick-links.economic-calendar': 'Calendario económico',
  'home.quick-links.move-above': 'Mover enlaces rápidos encima de los widgets',
  'home.quick-links.move-below': 'Mover enlaces rápidos debajo de los widgets',

  
  
  
  'home.widget-selector.title': 'Añadir a Inicio',
  'home.widget-selector.subtitle':
    'Explora los widgets por su vista previa y haz clic en uno para añadirlo a Inicio.',
  'home.widget-selector.sample-note.title': 'Plan de trading',
  'home.widget-selector.sample-note.intro':
    'Opera solo setups A+ en niveles clave. Máximo 3 operaciones al día.',
  'home.widget-selector.sample-note.checklist':
    'Checklist previa a la apertura',
  'home.widget-selector.sample-note.task.calendar':
    'Revisar el calendario económico',
  'home.widget-selector.sample-note.task.levels':
    'Marcar niveles clave en el gráfico',
  'home.widget-selector.sample-note.task.max-loss':
    'Fijar la pérdida diaria máxima',
  'home.widget-selector.sample-note.task.journal':
    'Registrar la primera operación',
  'home.widget-selector.tab.performance': 'Rendimiento',
  'home.widget-selector.tab.accounts': 'Cuentas',
  'home.widget-selector.tab.workflow': 'Flujo de trabajo',
  'home.widget-selector.section.quick-links': 'Enlaces rápidos',
  'home.widget-selector.restore': 'restaurar',
  'home.widget-selector.add-shortcut':
    'Añadir acceso directo de cuenta/configuración',

  
  'home.period.month': 'Mes',
  'home.period.quarter': 'Trimestre',
  'home.period.year': 'Año',
  'home.period.lifetime': 'Todo el tiempo',

  

  'home.aria.filter-trade-types': 'Filtrar tipos de trade',
  'home.aria.open-settings': 'Abrir configuración de Journalit',
  'home.aria.save-layout': 'Guardar Diseño',
  'home.aria.customize': 'Personalizar',

  
  'home.button.add-widget': 'Añadir Widget',

  
  'home.greeting.welcome': '¡Bienvenido a Journalit!',
  'home.greeting.hey': 'Hola',

  
  'home.greeting.nightowl': 'Hola trasnochador',
  'home.greeting.still-up': '¿todavía despierto?',
  'home.greeting.late-night': '¿sesión de noche cerrada?',
  'home.greeting.midnight-oil': '¿quemando aceite de medianoche?',

  
  'home.greeting.good-morning': 'Buenos días',
  'home.greeting.rise-and-shine': 'Arriba y con ánimo',
  'home.greeting.morning-trader': 'Trader matutino',
  'home.greeting.ready-conquer': '¿listo para conquistar el día?',
  'home.greeting.fresh-start': 'Nuevo comienzo',

  
  'home.greeting.good-afternoon': 'Buenas tardes',
  'home.greeting.day-going-well': 'Espero que tu día vaya bien',
  'home.greeting.afternoon-checkin': 'Revisión de la tarde',
  'home.greeting.midday-momentum': 'Momentum del mediodía',
  'home.greeting.hows-it-going': '¿cómo va?',

  
  'home.greeting.good-evening': 'Buenas noches',
  'home.greeting.winding-down': '¿relajándote?',
  'home.greeting.evening-review': 'Revisión nocturna',
  'home.greeting.how-did-today-go': '¿cómo fue hoy?',
  'home.greeting.time-to-reflect': 'Tiempo para reflexionar',

  
  'home.greeting.welcome-back': 'Bienvenido de vuelta',
  'home.greeting.name-placeholder': 'Tu nombre',
  'home.greeting.edit-name-aria': '{name}. Editar nombre para mostrar',
  'home.greeting.hey-there': 'Hola',
  'home.greeting.good-to-see-you': 'Bueno verte',

  
  'home.subtitle.first-time': 'Comencemos con tu viaje de trading',

  
  'home.subtitle.see-how-doing': 'Veamos cómo estás yendo',
  'home.subtitle.elevate-trading': 'Tiempo para elevar tu trading',
  'home.subtitle.journey-continues': 'Tu viaje de trading continúa',
  'home.subtitle.check-progress': 'Revisemos tu progreso',

  
  'home.subtitle.ready-elevate': '¿Listo para elevar tu trading?',
  'home.subtitle.agenda-today': '¿Qué hay en la agenda hoy?',
  'home.subtitle.trading-going': '¿Cómo va tu trading?',

  
  
  
  'home.grid.error.title': 'Error de Diseño de Cuadrícula',
  'home.grid.error.message': 'Error: {error}',
  'home.grid.error.retry': 'Reintentar',
  'home.grid.widget.remove-aria': 'Eliminar widget',
  'home.grid.widget.unknown-type': 'Tipo de widget desconocido: {widgetId}',

  
  
  
  'home.widget.unreviewed.all-reviewed': 'Todas las operaciones revisadas',
  'home.widget.unreviewed.title-review':
    'Abre el Registro de Operaciones para revisar',
  'home.widget.unreviewed.need-review.one':
    '{count} operación necesita revisión',
  'home.widget.unreviewed.need-review.few':
    '{count} operaciones necesitan revisión',
  'home.widget.unreviewed.need-review.many':
    '{count} operaciones necesitan revisión',
  'home.widget.unreviewed.need-review.other':
    '{count} operaciones necesitan revisión',
  'home.widget.unreviewed.today': '{count} hoy',
  'home.widget.unreviewed.this-week': '{count} esta semana',

  
  'home.widget.embedded-note.title': 'Nota Incrustada',
  'home.widget.embedded-note.select-note': 'Selecciona una Nota',
  'home.widget.embedded-note.search-placeholder': 'Buscar notas...',
  'home.widget.embedded-note.no-notes': 'No se encontraron notas',

  'home.widget.embedded-note.open-note': 'Haz clic para abrir nota',
  'home.widget.embedded-note.change-note': 'Cambiar nota',
  'home.widget.embedded-note.error.not-found': 'Archivo no encontrado: {path}',
  'home.widget.embedded-note.error.load-failed':
    'Error al cargar el contenido de la nota',
  'home.widget.embedded-note.error.deleted':
    'El archivo de origen fue eliminado',

  
  'home.widget.goals-progress.type.pnl': 'Meta de P&L',
  'home.widget.goals-progress.type.pnl-desc':
    'Meta de ganancia/pérdida para un período',
  'home.widget.goals-progress.type.trades-logged': 'Conteo de Operaciones',
  'home.widget.goals-progress.type.trades-logged-desc':
    'Conteo de operaciones de por vida',
  'home.widget.goals-progress.type.win-rate': 'Tasa de Ganancias',
  'home.widget.goals-progress.type.win-rate-desc': 'Meta de porcentaje ganador',
  'home.widget.goals-progress.period.daily': 'Diario',
  'home.widget.goals-progress.period.weekly': 'Semanal',
  'home.widget.goals-progress.period.monthly': 'Mensual',
  'home.widget.goals-progress.period-label.today': 'hoy',
  'home.widget.goals-progress.period-label.this-week': 'esta semana',
  'home.widget.goals-progress.period-label.this-month': 'este mes',
  'home.widget.goals-progress.period-label.total': 'total',
  'home.widget.goals-progress.trades-count': '{count} operaciones',
  'home.widget.goals-progress.set-goal': 'Establecer Meta',
  'home.widget.goals-progress.target': 'Meta',
  'home.widget.goals-progress.tracks-lifetime': 'Rastrea el total de por vida',
  'home.widget.goals-progress.use-r-multiples': 'Usar múltiplos de R',
  'home.widget.goals-progress.account-aware': 'Objetivos por cuenta',
  'home.widget.goals-progress.no-target-selected':
    'Sin objetivo para la cuenta seleccionada',
  'home.widget.goals-progress.configured-for': 'Configurado para {accounts}',
  'home.widget.goals-progress.account-scope': 'Account scope',
  'home.widget.goals-progress.add-account': 'Add account',
  'home.widget.goals-progress.click-to-set':
    'Haz clic para establecer una meta',
  'home.widget.goals-progress.header.pnl': 'Meta de P&L',
  'home.widget.goals-progress.header.trades': 'Meta de Operaciones',
  'home.widget.goals-progress.header.win-rate': 'Meta de Tasa de Ganancias',
  'home.widget.goals-progress.of-target': 'de {target} {period}',
  'home.widget.goals-progress.complete-100': '100% completado',
  'home.widget.goals-progress.complete-percent': '{percent}% completado',
  'home.widget.goals-progress.goal-reached': 'Meta alcanzada',
  'home.widget.goals-progress.aria.save-goal': 'Guardar meta',
  'home.widget.goals-progress.aria.set-goal': 'Establecer una meta',
  'home.widget.goals-progress.aria.change-goal': 'Haz clic para cambiar meta',

  
  'home.widget.best-hours.title': 'Mejores Horas',
  'home.widget.best-hours.no-data': 'Sin datos de operaciones',
  'home.widget.best-hours.period-aria':
    '{label}: {pnl} P&L promedio por operación, {count} operaciones',
  'home.widget.best-hours.trades-count': '{count} operaciones',
  'home.widget.best-hours.win-rate': '{rate}% ganador',
  'home.widget.best-hours.win-rate-na': 'Tasa de acierto no disponible',
  'home.widget.best-hours.days-count': '{count} días',
  'home.widget.best-hours.avg-per-trade': 'prom./operación',

  'home.widget.best-hours.hidden': 'Oculto',
  'home.widget.best-hours.hidden-detail': 'Modo privacidad',
  'home.widget.best-hours.no-positive-window': 'Sin ventana positiva',
  'home.widget.best-hours.insufficient-history': 'Faltan datos',
  'home.widget.best-hours.sample-requirement': '{count}/2 ventanas muestreadas',
  'home.widget.best-hours.developing': 'en desarrollo',
  'home.widget.best-hours.no-positive-detail':
    'Las ventanas muestreadas son negativas',

  
  'home.widget.aum.title': 'AUM',
  'home.widget.aum.period.month': 'Este Mes',
  'home.widget.aum.period.quarter': 'Este Trimestre',
  'home.widget.aum.period.year': 'Este Año',
  'home.widget.aum.period.all': 'Toda la Vida',
  'home.widget.aum.unable-to-load': 'No se pudo cargar',
  'home.widget.aum.no-accounts': 'Sin cuentas',
  'home.widget.aum.account-count': '{count} cuenta',
  'home.widget.aum.account-count-plural': '{count} cuentas',

  
  'home.widget.streak.title': 'Racha',
  'home.widget.streak.period.month': 'este mes',
  'home.widget.streak.period.quarter': 'este trimestre',
  'home.widget.streak.period.year': 'este año',
  'home.widget.streak.period.ever': 'nunca',
  'home.widget.streak.win': 'ganancia',
  'home.widget.streak.wins': 'ganancias',
  'home.widget.streak.loss': 'pérdida',
  'home.widget.streak.losses': 'pérdidas',
  'home.widget.streak.in-a-row': 'seguidas',
  'home.widget.streak.no-active': 'sin racha activa',
  'home.widget.streak.start-trading':
    'comienza a operar para construir una racha',
  'home.widget.streak.best-streak': 'tu mejor racha {period}',
  'home.widget.streak.above-average': 'por encima de tu promedio {period}',
  'home.widget.streak.stay-focused': 'mantente enfocado, sigue adelante',
  'home.widget.streak.keep-going': 'sigue adelante',
  'home.widget.streak.good-start': 'buen comienzo',
  'home.widget.streak.pause': 'pausa antes de tu próxima operación',
  'home.widget.streak.review': 'revisa antes de la próxima operación',
  'home.widget.streak.losses-process': 'las pérdidas son parte del proceso',
  'home.widget.streak.best': 'mejor',
  'home.widget.streak.avg': 'promedio',

  
  'home.widget.drawdown.title': 'Drawdown Limit',
  'home.widget.drawdown.breached': 'Superado',
  'home.widget.drawdown.remaining': 'restante',
  'home.widget.drawdown.unable-to-load': 'No se pudo cargar',
  'home.widget.drawdown.no-accounts': 'Sin cuentas con límites',

  'home.widget.profit-target.title': 'Objetivo de ganancias',
  'home.widget.profit-target.achieved': 'Logrado',
  'home.widget.profit-target.remaining': 'restante',
  'home.widget.profit-target.unable-to-load': 'No se pudo cargar',
  'home.widget.profit-target.no-accounts': 'Sin cuentas con objetivos',
  'home.widget.account-progress.configure-aria': 'Elegir cuentas para {widget}',
  'home.widget.account-progress.config-title': 'Cuentas mostradas',
  'home.widget.account-progress.mode.automatic': 'Automático',
  'home.widget.account-progress.mode.selected': 'Elegir cuentas',
  'home.widget.account-progress.automatic-drawdown': 'Mayor drawdown primero.',
  'home.widget.account-progress.automatic-profit-target':
    'Más cerca del objetivo primero.',
  'home.widget.account-progress.max-label': 'Mostrar hasta',
  'home.widget.account-progress.max-all': 'Todas',
  'home.widget.account-progress.select-hint': 'Elige tantas como quieras.',
  'home.widget.account-progress.no-eligible': 'Aún no hay cuentas para elegir.',
  'home.widget.account-progress.none-selected':
    'Ninguna cuenta elegida. Haz clic para elegir.',
  'home.widget.account-progress.search': 'Buscar cuentas',
  'home.widget.account-progress.select-all': 'Todas',
  'home.widget.account-progress.select-none': 'Ninguna',
  'home.widget.account-progress.select-all-aria':
    'Elegir todas las cuentas mostradas',
  'home.widget.account-progress.select-none-aria':
    'Quitar las cuentas mostradas',
  'home.widget.account-progress.no-match': 'Ninguna cuenta coincide.',
  'home.widget.account-progress.none-available':
    'Ninguna de las cuentas elegidas se puede mostrar. Haz clic para elegir otras.',
  'home.widget.eval-roi.title': 'ROI de evals',
  'home.widget.eval-roi.unable-to-load': 'No se pudo cargar',
  'home.widget.eval-roi.no-challenges': 'Sin prop challenges',
  'home.widget.eval-roi.challenge-count': '{count} eval',
  'home.widget.eval-roi.challenge-count-plural': '{count} evals',
  'home.widget.eval-roi.net': 'Neto',
  'home.widget.eval-roi.spent': 'Gastado',
  'home.widget.eval-roi.payouts': 'Pagos',
  'home.widget.eval-roi.break-even': 'Punto de equilibrio',
  'home.widget.challenge-alerts.title': 'Alertas de challenge',
  'home.widget.challenge-alerts.unable-to-load':
    'No se pudieron comprobar las alertas del challenge',
  'home.widget.challenge-alerts.empty': 'Sin alertas de challenge',
  'home.widget.challenge-alerts.count': '{count} alerta',
  'home.widget.challenge-alerts.count-plural': '{count} alertas',
  'home.widget.challenge-alerts.more': '+{count} más',
  'home.widget.challenge-alerts.kind.failed': 'Fallida',
  'home.widget.challenge-alerts.kind.target': 'Objetivo alcanzado',
  'home.widget.challenge-alerts.kind.passed': 'Superada',
  'home.widget.challenge-alerts.kind.payout': 'Pago listo',
  'home.widget.challenge-alerts.kind.lost': 'Pago ya no disponible',
  'home.widget.challenge-alerts.kind.unknown-account': 'Cuenta nueva {label}',
  'home.widget.eval-roi.roi-aria': 'Retorno sobre el gasto en evaluaciones',
  
  'home.widget.recent.title': 'Reciente',
  'home.widget.recent.unknown': 'Desconocido',
  'home.widget.recent.just-now': 'Justo ahora',
  'home.widget.recent.minutes-ago': 'hace {minutes}m',
  'home.widget.recent.hours-ago': 'hace {hours}h',
  'home.widget.recent.days-ago': 'hace {days}d',
  'home.widget.recent.no-items': 'No hay elementos recientes',
  'home.widget.recent.hint': 'Abre archivos o vistas para verlos aquí',

  
  'home.widget.top-breakdown.title': 'Top {dimension}',
  'home.widget.top-breakdown.configure-title': 'Personalizar Top {dimension}',
  'home.widget.top-breakdown.aria.customize':
    'Haz clic para personalizar Top {dimension}',
  'home.widget.setups.title': 'Top Setups',

  'home.widget.setups.trades-count': '{count} operaciones',
  'home.widget.setups.win-rate': '{rate}% tasa de ganancia',

  
  'home.widget.weekly.title': 'Esta Semana',
  'home.widget.weekly.no-trades': 'sin operaciones esta semana',
  'home.widget.weekly.breakeven': 'en equilibrio esta semana',
  'home.widget.weekly.losing-days': '{count} días perdedores seguidos',
  'home.widget.weekly.winning-days': '{count} días ganadores seguidos',
  'home.widget.weekly.above-average': 'por encima de tu promedio semanal',
  'home.widget.weekly.below-average': 'por debajo de tu promedio semanal',
  'home.widget.weekly.better-than-last': 'mejor que la semana pasada',
  'home.widget.weekly.slower-than-last': 'más lento que la semana pasada',
  'home.widget.weekly.on-track': 'en el camino esta semana',
  'home.widget.weekly.room-to-recover': 'espacio para recuperarse',
  'home.widget.weekly.solid-start': 'comienzo sólido de la semana',
  'home.widget.weekly.early-in-week': 'principios de semana',
  'home.widget.weekly.no-trade-data': 'Sin datos de operaciones',
  'home.widget.weekly.trade': 'operación',
  'home.widget.weekly.trades': 'operaciones',
  'home.widget.weekly.no-trades-tooltip': 'sin operaciones',

  
  'home.widget.heatmap.last-3-months': 'Últimos 3 Meses',
  'home.widget.heatmap.last-6-months': 'Últimos 6 Meses',
  'home.widget.heatmap.year-activity': 'Actividad {year}',
  'home.widget.heatmap.select-year': 'Seleccionar Año',
  'home.widget.heatmap.close-selector': 'Cerrar selector de año',

  
  
  
  
  'calendar.day.mon': 'Lun',
  'calendar.day.tue': 'Mar',
  'calendar.day.wed': 'Mié',
  'calendar.day.thu': 'Jue',
  'calendar.day.fri': 'Vie',
  'calendar.day.sat': 'Sáb',
  'calendar.day.sun': 'Dom',

  
  'calendar.month.jan': 'Ene',
  'calendar.month.feb': 'Feb',
  'calendar.month.mar': 'Mar',
  'calendar.month.apr': 'Abr',
  'calendar.month.may': 'May',
  'calendar.month.jun': 'Jun',
  'calendar.month.jul': 'Jul',
  'calendar.month.aug': 'Ago',
  'calendar.month.sep': 'Sep',
  'calendar.month.oct': 'Oct',
  'calendar.month.nov': 'Nov',
  'calendar.month.dec': 'Dic',

  
  'calendar.legend.less': 'Menos',
  'calendar.legend.more': 'Más',
  'calendar.weekday.mon': 'Lun',
  'calendar.weekday.tue': 'Mar',
  'calendar.weekday.wed': 'Mié',
  'calendar.weekday.thu': 'Jue',
  'calendar.weekday.fri': 'Vie',
  'calendar.weekday.sat': 'Sáb',
  'calendar.weekday.sun': 'Dom',
  'calendar.pnl': 'P&L',
  'calendar.week': 'SEMANA',
  'calendar.trade': '{count} operación',
  'calendar.trades': '{count} operaciones',
  'calendar.reviewed': 'Revisado',
  'calendar.month.january': 'Enero',
  'calendar.month.february': 'Febrero',
  'calendar.month.march': 'Marzo',
  'calendar.month.april': 'Abril',
  'calendar.month.june': 'Junio',
  'calendar.month.july': 'Julio',
  'calendar.month.august': 'Agosto',
  'calendar.month.september': 'Septiembre',
  'calendar.month.october': 'Octubre',
  'calendar.month.november': 'Noviembre',
  'calendar.month.december': 'Diciembre',

  
  
  
  
  'home.widget.recent-items.name': 'Elementos Recientes',
  'home.widget.recent-items.description':
    'Muestra archivos y vistas abiertos recientemente',

  
  'home.widget.year-heatmap.name': 'Mapa de Calor de Trading',
  'home.widget.year-heatmap.description':
    'Calendario de tu actividad de trading del año',

  
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description':
    'Lista para configurar Journalit y tus operaciones',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.account.title':
    'Configura tu cuenta de trading',
  'home.widget.getting-started.item.account.description':
    'Las operaciones se registran en una cuenta que lleva el control de tu saldo. Sin ella no se pueden calcular la rentabilidad ni el drawdown.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'Configurar cuenta',
  'home.widget.getting-started.item.create.title':
    'Incorpora tu historial de trading',
  'home.widget.getting-started.item.create.description':
    'Importa operaciones existentes, conecta Trade Sync o añade tu primera operación manualmente.',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Abrir Trade Import',
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
    'Abrir la barra lateral de navegación',
  'home.widget.getting-started.item.sidebar.description':
    'Accede rápidamente a las páginas, revisiones, herramientas y búsqueda de Journalit.',
  'home.widget.getting-started.item.sidebar.time': '10 s',
  'home.widget.getting-started.item.sidebar.cta': 'Abrir barra lateral',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    'Activa Trade Import, Trade Sync y el Calendario Económico.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',

  
  'home.widget.weekly-summary.name': 'Resumen Semanal',
  'home.widget.weekly-summary.description':
    'Métricas de la semana con P&L diario',
  'home.widget.key-events.name': 'Eventos clave',
  'home.widget.key-events.description':
    'Noticias y eventos de la revisión de esta semana',
  'home.widget.key-events.empty-title': 'Aún no hay eventos clave',
  'home.widget.key-events.open-aria':
    'Abrir la revisión semanal de esta semana',

  
  'home.widget.position-size.name': 'Calculadora de Tamaño de Posición',
  'home.widget.position-size.description':
    'Calcula el tamaño según el riesgo de tu cuenta',

  
  'home.widget.embedded-note.name': 'Nota Incrustada',
  'home.widget.embedded-note.description':
    'Muestra cualquier nota markdown de tu bóveda',

  
  'home.widget.current-streak.name': 'Racha Actual',
  'home.widget.current-streak.description':
    'Sigue las rachas de operaciones y revisiones',

  
  'home.widget.best-hours.name': 'Mejores Horas',
  'home.widget.best-hours.description':
    'Ve cuándo operas mejor por hora del día',

  
  'home.widget.setup-leaderboard.name': 'Desglose Top',
  'home.widget.setup-leaderboard.description':
    'Compara setups, tags, activos o tickers',

  
  'home.widget.unreviewed-trades.name': 'Operaciones sin Revisar',
  'home.widget.unreviewed-trades.description':
    'Operaciones que necesitan tu revisión',

  
  'home.widget.goals-progress.name': 'Progreso de Metas',
  'home.widget.goals-progress.description':
    'Rastrea el progreso hacia tu meta de trading',

  
  'home.widget.trading-score.name': 'Puntuación de Trading',
  'home.widget.trading-score.description':
    'Una puntuación de tu rendimiento general',

  
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description':
    'Saldo total de cuentas con tendencia de 7 días',

  
  'home.widget.drawdown-monitor.name': 'Monitor de Drawdown',
  'home.widget.drawdown-monitor.description':
    'Uso del límite de drawdown por cuenta',
  'home.widget.profit-target-widget.name': 'Objetivo de ganancias',
  'home.widget.profit-target-widget.description':
    'Progreso del objetivo de ganancias por cuenta',
  'home.widget.eval-roi.name': 'ROI de evals',
  'home.widget.challenge-alerts.name': 'Alertas de challenge',
  'home.widget.challenge-alerts.description':
    'Cuentas de fondeo fallidas, aprobadas o con pago',
  'home.widget.eval-roi.description':
    'Tarifas de retos de fondeo vs pagos recibidos',

  
  
  

  

  'weekly.tab.review': 'Revisión',

  
  'weekly.review.drcs.title': 'Revisiones Diarias de Esta Semana',

  
  'weekly.review.performance.title': 'Autoevaluación de Rendimiento',
  'weekly.review.performance.mental': 'Rendimiento Mental',

  'weekly.review.performance.technical': 'Ejecución Técnica',

  
  'weekly.review.questions.title': 'Preguntas de Revisión Semanal',

  
  'weekly.review.goals.title': 'Objetivos para la Próxima Semana',

  
  'weekly.preparation.goals.title': 'Objetivos Semanales',

  
  'weekly.preparation.events.title': 'Eventos Clave',

  'weekly.preparation.events.add-button': 'Añadir Evento',

  
  'weekly.preparation.forecast.title': 'Pronóstico Semanal',

  
  'weekly.overview.pnl-chart.title': 'P&L Acumulado Semanal',

  'weekly.overview.drawdown-chart.title': 'Drawdown Semanal',

  
  'weekly.overview.performance.title': 'Rendimiento Semanal',

  
  'weekly.overview.setup-performance.title': 'Rendimiento por Setup',

  
  'weekly.overview.trades-chart.title': 'Operaciones Semanales',

  
  'weekly.overview.best-trade.title': 'Mejor Operación de la Semana',

  'weekly.overview.worst-trade.title': 'Peor Operación de la Semana',

  
  'weekly.overview.daily-performance.title': 'Rendimiento Diario',

  

  
  'weekly.overview.button.create-trade': 'Crear Operación',
  'weekly.overview.button.view-trade-details': 'Ver Detalles de Operación',

  
  
  

  

  'monthly.tab.review': 'Revisión',

  

  

  

  'monthly.overview.drawdown': 'Drawdown Mensual',
  'monthly.overview.no-drawdown-data': 'No hay datos de drawdown para mostrar',

  

  

  

  

  

  

  
  
  

  

  'datepicker.button.clear': 'Limpiar',
  'datepicker.button.today': 'Hoy',
  'datepicker.button.now': 'Ahora',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'AA',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',

  

  
  'ribbon.open-journalit': 'Abrir Journalit',

  

  'grid.aria.remove-widget': 'Eliminar widget',

  
  'missed-trade.reason-title': 'Por qué perdí esta operación',

  
  'status-bar.update-available-branded': 'Actualizar Journalit',
  'status-bar.release-notes-branded': 'Journalit · Ver notas de versión',
  'status-bar.update-aria-label': 'Journalit {version} - Click para ver',
  'update.available.ready': 'Hay una nueva versión disponible',

  
  'trade.review.title': 'Revisión de Operación',

  'trade.details.entry': 'Entrada',
  'trade.details.exit': 'Salida',

  'trade.details.duration': 'Duración',

  'trade.details.thesis': 'Tesis',

  'trade.details.entries-summary': '{count} entries',
  'trade.details.exits-summary': '{count} exits',
  'trade.details.take-profit-count': '{count} targets',

  
  'trade.metadata.account': 'Cuenta:',

  'trade.metadata.setups': 'Setups',
  'trade.metadata.mistakes': 'Errores',

  
  'trade.image.no-images': 'No hay imágenes para esta operación',
  'trade.image.click-edit': 'Haz clic en editar para agregar imágenes',
  'trade.image.alt-prefix': 'Imagen de operación',
  'command.share-note-as-image': 'Compartir la nota actual como imagen',
  'trade.share.copy-screenshot': 'Copiar captura de la operación',
  'trade.share.copied': 'Captura de la operación copiada al portapapeles',
  'trade.share.failed': 'No se pudo copiar la captura de la operación',
  'trade.share.not-ready':
    'La nota de la operación aún se está cargando. Inténtalo de nuevo en un momento.',
  'share.review.action': 'Compartir tarjeta de revisión',
  'share.review.modal-title': 'Compartir revisión',
  'share.review.section.top': 'Inicio de la nota',
  'share.review.select-all': 'Seleccionar todo',
  'share.review.clear': 'Borrar',
  'share.review.legend.widget': 'Widget',
  'share.review.legend.heading': 'Encabezado y su texto',
  'share.review.legend.media': 'Multimedia',
  'share.review.legend.text': 'Texto',
  'share.review.copy': 'Copiar imagen',
  'settings.general.hide-dollar-amounts-in-shares':
    'Ocultar importes en dólares en las imágenes compartidas',
  'settings.general.hide-dollar-amounts-in-shares-desc':
    'Con los múltiplos R activados, las capturas de operaciones y las tarjetas de revisión omiten el riesgo, las comisiones, los cargos y el MAE/MFE en dólares.',
  'share.review.hide-dollar-amounts': 'Ocultar importes en dólares',
  'share.review.hide-dollar-amounts-hint':
    'Omite el riesgo, las comisiones y otros valores en dólares.',
  'share.review.hide-dollar-amounts-needs-r':
    'Activa los múltiplos R en los ajustes para compartir sin importes en dólares.',
  'share.review.copied': 'Tarjeta copiada al portapapeles',
  'share.review.failed': 'No se pudo copiar la tarjeta',
  'trade.header.unknown-instrument': 'Instrumento desconocido',

  

  'trade.review.reviewed': 'Revisado',
  'trade.review.reviewed-on': 'Revisado el {date}',

  
  'combobox.placeholder.default': 'Seleccionar o escribir...',
  'combobox.aria.remove-item': 'Eliminar {item}',
  'combobox.add-option': 'Agregar "{value}"',

  
  'skeleton.tradelog.loading': 'Cargando datos de operaciones',
  'skeleton.dashboard-widget.loading': 'Cargando datos del widget',
  'skeleton.account-page.loading': 'Cargando página de cuenta',

  
  'ui.toggle-switch.aria-label': 'Interruptor',
  'ui.folder-browser.placeholder': 'Seleccionar una carpeta...',
  'ui.folder-browser.root': 'Raíz',
  'ui.folder-browser.clear-aria': 'Limpiar para usar ubicación predeterminada',
  'ui.folder-browser.expand-folder': 'Expandir carpeta',
  'ui.folder-browser.collapse-folder': 'Contraer carpeta',

  

  

  
  'modal.template-switch.title': '¿Cambiar Plantilla?',
  'modal.template-switch.switching-from': 'Estás cambiando de',
  'modal.template-switch.switching-to': 'a',
  'modal.template-switch.has-content-title': 'Esta nota tiene contenido',
  'modal.template-switch.has-content-desc':
    'El contenido se reorganizará para adaptarse al nuevo diseño. Cualquier contenido que no encaje se conservará al final de la nota para que lo revises.',
  'modal.template-switch.cannot-undo':
    'Esto no se puede deshacer (pero puedes volver a cambiar).',
  'modal.template-switch.button.switch': 'Cambiar Plantilla',

  
  'paste.notice.image-pasted': '📋 Imagen pegada exitosamente',
  'paste.notice.images-pasted': '📋 {count} imágenes pegadas exitosamente',
  'paste.error.clipboard-not-supported': 'API del portapapeles no soportada',
  'paste.error.clipboard-empty':
    'No se encontró nada en el portapapeles para pegar',
  'paste.error.file-size-exceeds':
    'El tamaño del archivo {size}MB excede el límite',
  'paste.error.no-images-found':
    'No se encontraron imágenes en el portapapeles. Intenta copiar una imagen primero.',
  'paste.error.permission-denied': 'Permiso denegado',

  
  'release-notes.title': 'Notas de la Versión',
  'release-notes.loading-plugin': 'Cargando plugin...',

  'release-notes.no-content': 'No se encontraron notas de la versión',
  'release-notes.current-version': 'Actual: v{version}',
  'release-notes.version': 'Versión {version}',
  'release-notes.link.docs': 'Docs',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',

  

  'shared.empty-state.message': 'No hay datos disponibles',
  'shared.collapsible.active-filters': '{count} filtros activos',
  'shared.filter.disabled-preview': 'Filtros deshabilitados en vista previa',
  'shared.filter.open': 'Abrir filtros',
  'shared.filter.active-count': '{count} filtros activos',

  
  'upgrade.title': 'Actualizar a Pro',
  'upgrade.feature-message':
    '{featureName} es una función Pro. Actualiza para desbloquear automatización avanzada y funciones.',
  'upgrade.benefits-title': 'Las Funciones Pro Incluyen:',
  'upgrade.benefit.csv': 'Trade Import con mapeo de columnas asistido por IA',
  'upgrade.benefit.economic-calendar':
    'Calendario Económico con importación automática semanal de eventos',
  'upgrade.benefit.trade-sync': 'Trade Sync para brokers compatibles',
  'upgrade.benefit.multi-account': 'Soporte multi-cuenta',
  'upgrade.prop-profiles.message-firms':
    'Journalit tiene listas las reglas de {count} firmas prop para rellenar tu desafío.',
  'upgrade.prop-profiles.message-firm':
    'Journalit tiene listas las reglas de cada desafío de {firm} para rellenar.',
  'upgrade.prop-profiles.message':
    'Journalit mantiene listas las reglas de las prop firms para rellenar tu challenge.',
  'upgrade.prop-profiles.message-updates':
    'Vincula tu desafío a las reglas publicadas de su firma y Journalit te avisará cuando la firma las cambie.',
  'upgrade.prop-profiles.message-updates-firm':
    'Vincula tu desafío a las reglas publicadas de {firm} y Journalit te avisará cuando {firm} las cambie.',
  'upgrade.prop-profiles.benefits-title': 'Lo que Pro rellena por ti:',
  'upgrade.benefit.prop.rules':
    'Límites de drawdown y pérdida diaria, directos de las reglas de tu firma',
  'upgrade.benefit.prop.payout':
    'Umbrales de retiro y condiciones de elegibilidad',
  'upgrade.benefit.prop.phases':
    'Objetivos de fase y progresión del desafío que elijas',
  'upgrade.benefit.prop.updates':
    'Actualizaciones de reglas cuando tu firma las cambia',
  'upgrade.trial-notice':
    'Obtén una prueba gratuita de 2 semanas para importar todas tus operaciones históricas y probar todas las funciones Pro sin riesgo.',

  

  'timeline.status.loss': 'Pérdida',

  'timeline.aria.session-navigation': 'Same-day trade navigation',
  'timeline.aria.previous-trade': 'Previous trade: {trade}',
  'timeline.aria.next-trade': 'Next trade: {trade}',
  'timeline.aria.no-previous-trade': 'No previous trade in this trading day',
  'timeline.aria.no-next-trade': 'No next trade in this trading day',

  

  'datetime.aria.open-picker': 'Abrir selector de fecha',

  
  'view.account-page.title': 'Cuenta: {name}',
  'view.account-page.title-default': 'Página de Cuenta',
  'view.account-page.no-account-selected': 'No hay Cuenta Seleccionada',
  'view.account-page.no-account-instructions':
    'Abre esta página desde Cuentas.',
  'view.account-page.service-loading':
    'Cargando servicio de página de cuenta...',
  'view.account-page.balance-chart-title': 'Gráfico de Balance de Cuenta',
  'view.account-page.balance-chart-loading': 'Cargando gráfico de balance...',

  
  'templateEditor.loading': 'Cargando layout...',
  'templateEditor.mode.preview': 'Vista Previa',
  'templateEditor.mode.editor': 'Editor',
  'templateEditor.built-in-badge': '(Incorporado)',
  'templateEditor.built-in-notice':
    'Las plantillas incorporadas no se pueden editar. Duplica esta plantilla o crea una nueva para personalizar.',
  'templateEditor.unsaved-changes': 'Cambios sin guardar',
  'templateEditor.field.template-name': 'Nombre de Layout',
  'templateEditor.field.widgets': 'Widgets ({count})',
  'templateEditor.button.add-widget': '+ Agregar Widget',
  'templateEditor.button.widget-library-docs': 'Widget library docs',
  'templateEditor.widget.locked': 'Bloqueado',
  'templateEditor.widget.select-placeholder': 'Seleccionar un widget...',
  'templateEditor.widget.header-text-placeholder': 'Texto del encabezado...',
  'templateEditor.widget.markdown-zone-text-label': 'Texto predefinido',
  'templateEditor.widget.markdown-zone-text-placeholder':
    'Texto para insertar en nuevas notas de revisión...',
  'templateEditor.widget.page-size': 'Tamaño de página:',
  'templateEditor.widget.show-rating-column': 'Mostrar columna de calificación',
  'templateEditor.widget.demon-tracker.tracking-method':
    'Registrar errores por:',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    'Ocurrencias en operaciones',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    'Cuenta cada operación etiquetada con el error.',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days':
    'Días de trading',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    'Los errores de operaciones y revisiones diarias se combinan y cuentan una vez por día de trading.',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    'Entradas de revisión diaria',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    'Solo cuentan los errores registrados en las revisiones diarias.',
  'templateEditor.widget.demon-tracker.stop-after':
    'Dejar de operar después de:',

  

  
  'filter.modal.no-setup': 'Sin Setup',
  'filter.modal.no-tags': 'Sin Etiquetas',
  'filter.modal.no-mistakes': 'Sin Errores',
  'filter.modal.type.regular': 'Regular',
  'filter.summary.regular-trades': 'Operaciones Regulares',
  'filter.modal.type.backtest': 'Backtesting',
  'filter.modal.status.breakeven': 'Sin Cambio',

  'filter.modal.review-status.reviewed': 'Reviewed',
  'filter.modal.review-status.unreviewed': 'Unreviewed',
  'filter.modal.direction.long-call': 'Long/Call',
  'filter.modal.direction.short-put': 'Short/Put',
  'filter.modal.section.custom-fields': 'Custom Fields',
  'filter.modal.custom-field.none-available': 'No values available',

  
  'builder.sidebar.title': 'Constructor de Diseño',
  'builder.sidebar.section.trade': 'Operación',
  'builder.sidebar.section.drc': 'DRC',
  'builder.sidebar.section.weekly': 'Semanal',
  'builder.sidebar.section.monthly': 'Mensual',
  'builder.sidebar.section.quarterly': 'Trimestral',
  'builder.sidebar.section.yearly': 'Anual',
  'builder.sidebar.section.library': 'Biblioteca',
  'builder.sidebar.new-item': 'Nuevo {title}',
  'builder.sidebar.coming-soon': 'Próximamente',
  'builder.sidebar.built-in': 'Incorporado',
  'builder.sidebar.default-template': 'Layout predeterminada',
  'builder.sidebar.set-as-default': 'Establecer como predeterminado',
  'builder.sidebar.duplicate': 'Duplicar',
  'builder.sidebar.delete': 'Eliminar',
  'builder.sidebar.no-templates': 'Aún no hay layouts',
  'builder.sidebar.share-template': 'Compartir Layout',
  'builder.sidebar.new-template-name': 'Nueva Layout de {type}',
  'builder.sidebar.copy-suffix': '(Copia)',

  

  'image.uploader.paste-title': 'Pegar medios del portapapeles (Ctrl+V)',
  'image.uploader.pasting': 'Pegando...',
  'image.uploader.paste': 'Pegar',
  'image.uploader.url-placeholder': 'Pegar URL de medios o ruta de archivo...',
  'image.uploader.url-input-aria': 'Campo de URL de medios',
  'image.uploader.file-upload-aria': 'Subir desde archivo',
  'image.uploader.paste-clipboard-aria': 'Pegar desde portapapeles',
  'image.uploader.error-invalid-url':
    'URL de imagen o ruta de archivo no válida. Ingresa una URL de imagen compatible, una ruta de imagen del vault o un enlace de Excalidraw.',
  'image.viewer.alt-default': 'Imagen',
  'image.viewer.description-default': 'Vista previa de medios',

  'image.viewer.title-fullscreen': 'Click para ver en pantalla completa',

  'image.viewer.delete-button': 'Eliminar Imagen',
  'image.viewer.nav-prev': 'Imagen anterior',
  'image.viewer.nav-next': 'Imagen siguiente',
  'image.viewer.zoom-in-hint': 'Pellizca o haz click para acercar',
  'image.viewer.zoom-out-hint': '{scale}x (pellizca o haz click para alejar)',

  'image.viewer.close-aria': 'Cerrar pantalla completa',
  'image.viewer.copy-image': 'Copiar imagen',

  'image.viewer.copied': 'Copiado',
  'image.viewer.copy-failed': 'No se pudo copiar la imagen al portapapeles',
  'image.viewer.copy-unsupported':
    'La copia de imágenes al portapapeles no es compatible en este entorno',
  'media.viewer.video-controls': 'Controles de video',
  'media.viewer.play-video': 'Reproducir video',
  'media.viewer.pause-video': 'Pausar video',
  'media.viewer.mute-video': 'Silenciar video',
  'media.viewer.unmute-video': 'Activar sonido del video',
  'media.viewer.volume': 'Volumen',
  'media.viewer.back-5': 'Retroceder 5 segundos',
  'media.viewer.forward-5': 'Avanzar 5 segundos',
  'media.viewer.timeline': 'Línea de tiempo del video',

  'image.carousel.no-images': 'No hay imágenes para mostrar',
  'image.carousel.prev': 'Imagen anterior',
  'image.carousel.next': 'Imagen siguiente',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': 'Miniatura {index}',

  
  'library.type.drc': 'DRC',
  'library.type.weekly': 'Semanal',
  'library.type.monthly': 'Mensual',
  'library.type.quarterly': 'Trimestral',
  'library.type.yearly': 'Anual',
  'library.type.trade': 'Operación',
  'library.error.invalid-share-code': 'Código de compartir inválido',
  'library.notice.import-success':
    '¡Plantilla "{name}" importada exitosamente!',
  'library.error.import-failed': 'Error al importar layout',
  'library.notice.select-template':
    'Por favor selecciona una plantilla para exportar',
  'library.notice.template-not-found': 'Layout no encontrada',
  'library.notice.code-generated': '¡Código de compartir generado!',
  'library.error.export-failed': 'Error al exportar layout',
  'library.error.export-too-large':
    'Este layout es demasiado grande para exportarlo como código compartido.',
  'library.notice.copied': '¡Código de compartir copiado al portapapeles!',
  'library.error.copy-failed': 'Error al copiar al portapapeles',
  'library.title.import': 'Importar Layout',
  'library.desc.import':
    'Pega un código JRT para importar una plantilla de otro usuario.',
  'library.label.share-code': 'Código de Compartir',
  'library.placeholder.import-code': 'Pega el código JRT-... aquí',
  'library.button.validating': 'Validando...',
  'library.button.validate': 'Validar',
  'library.button.import': 'Importar Layout',
  'library.preview.valid': 'Layout Válida',
  'library.preview.invalid': 'Código de Compartir Inválido',
  'library.title.export': 'Exportar Layout',
  'library.desc.export':
    'Selecciona una plantilla para generar un código que otros puedan importar.',
  'library.empty.title': 'No hay layouts personalizadas para exportar.',
  'library.empty.hint':
    'Crea una plantilla personalizada en las pestañas de Revisión o Plantillas de Operación primero, luego vuelve aquí para compartirla.',
  'library.label.select-template': 'Seleccionar Layout',
  'library.option.select-template': '-- Selecciona una layout --',
  'library.button.generate-code': 'Generar Código de Compartir',
  'library.button.copy-code': 'Copiar al Portapapeles',

  
  'manual-drawdown.notice.deleted': 'Instantánea eliminada',
  'manual-drawdown.notice.updated': 'Instantánea actualizada',
  'manual-drawdown.notice.added': 'Instantánea agregada',
  'manual-drawdown.validation.date-required': 'La fecha es requerida',
  'manual-drawdown.validation.invalid-date':
    'Por favor ingresa una fecha válida',
  'manual-drawdown.validation.future-date':
    'La fecha no puede ser en el futuro',
  'manual-drawdown.validation.limit-required':
    'El límite de pérdida es requerido',
  'manual-drawdown.validation.limit-positive':
    'El límite de pérdida debe ser un número positivo',
  'manual-drawdown.validation.duplicate-date':
    'Ya existe una instantánea para esta fecha. Por favor elige una fecha diferente o edita la existente.',
  'manual-drawdown.section.recorded': 'Instantáneas Registradas',
  'manual-drawdown.table.date': 'Fecha',
  'manual-drawdown.table.limit': 'Límite de Pérdida',
  'manual-drawdown.table.note': 'Nota',
  'manual-drawdown.table.actions': 'Acciones',
  'manual-drawdown.button.editing': 'Editando',
  'manual-drawdown.button.edit': 'Editar',
  'manual-drawdown.button.delete': 'Eliminar',
  'manual-drawdown.header.edit': 'Editar Instantánea',
  'manual-drawdown.header.add': 'Agregar Nueva Instantánea',
  'manual-drawdown.field.date': 'Fecha de Límite *',
  'manual-drawdown.field.date-desc': 'Cuándo el broker emitió este límite',
  'manual-drawdown.field.limit': 'Balance Mínimo ($) *',
  'manual-drawdown.field.limit-desc': 'Balance más bajo permitido',
  'manual-drawdown.field.note': 'Nota (Opcional)',
  'manual-drawdown.field.note-desc': 'Contexto adicional para esta instantánea',
  'manual-drawdown.placeholder.note': 'ej., Estado de fin de mes',
  'manual-drawdown.button.update': 'Actualizar Instantánea',
  'manual-drawdown.button.add': 'Agregar Instantánea',
  'manual-drawdown.button.cancel-edit': 'Cancelar Edición',
  'manual-drawdown.modal.delete-title': '¿Eliminar Instantánea?',
  'manual-drawdown.modal.delete-confirm':
    '¿Eliminar instantánea de pérdida del {date}?',
  'manual-drawdown.modal.delete-limit': 'Límite de pérdida: {limit}',
  'manual-drawdown.modal.delete-warning': 'Esta acción no se puede deshacer.',

  
  'metric.netPnL.name': 'P&L Neto',
  'metric.netPnL.description':
    'Ganancia y pérdida total de todas las operaciones',
  'metric.winRate.name': 'Tasa de Éxito',
  'metric.winRate.description': 'Porcentaje de operaciones ganadoras',
  'metric.profitFactor.name': 'Factor de Ganancia',
  'metric.profitFactor.description': 'Ratio de ganancia bruta a pérdida bruta',
  'metric.sharpeRatio.name': 'Ratio de Sharpe',
  'metric.sharpeRatio.description':
    'P&L medio por operación frente a su volatilidad',
  'metric.expectancy.name': 'Expectativa',
  'metric.expectancy.description':
    'Cantidad promedio ganada o perdida por operación',
  'metric.maxDrawdown.name': 'Max Drawdown',
  'metric.maxDrawdown.description': 'Mayor caída desde un máximo previo de P&L',
  'metric.bestDay.name': 'Mejor Día',
  'metric.bestDay.description': 'P&L más alto en un solo día',
  'metric.largestWin.name': 'Mayor Ganancia',
  'metric.largestWin.description': 'Operación ganadora más grande',
  'metric.largestLoss.name': 'Mayor Pérdida',
  'metric.largestLoss.description': 'Operación perdedora más grande',
  'metric.longestWinStreak.name': 'Mejor Racha',
  'metric.longestWinStreak.description':
    'Racha de ganancias consecutivas más larga',
  'metric.longestLossStreak.name': 'Peor Racha',
  'metric.longestLossStreak.description':
    'Racha de pérdidas consecutivas más larga',
  'metric.numTrades.name': 'Total de Operaciones',
  'metric.numTrades.description': 'Número total de operaciones cerradas',
  'metric.numWinTrades.name': 'Operaciones Ganadoras',
  'metric.numWinTrades.description': 'Número de operaciones ganadoras',
  'metric.numLossTrades.name': 'Operaciones Perdedoras',
  'metric.numLossTrades.description': 'Número de operaciones perdedoras',
  'metric.avgWin.name': 'Ganancia Promedio',
  'metric.avgWin.description': 'Ganancia promedio de operaciones ganadoras',
  'metric.avgLoss.name': 'Pérdida Promedio',
  'metric.avgLoss.description': 'Pérdida promedio de operaciones perdedoras',
  'metric.avgRR.name': 'RR Promedio (Payoff)',
  'metric.avgRR.description': 'Ganancia media dividida entre pérdida media',
  'metric.avgRRRiskBased.name': 'RR Promedio (basado en R)',
  'metric.avgRRRiskBased.description':
    'R ganador medio vs R perdedor (requiere stop)',
  'metric.avgHoldTime.name': 'Tiempo Promedio de Retención',
  'metric.avgHoldTime.description':
    'Tiempo promedio en todas las operaciones cerradas',
  'metric.avgWinHoldTime.name': 'Tiempo Prom. Ganancia',
  'metric.avgWinHoldTime.description': 'Tiempo medio en operaciones ganadoras',
  'metric.avgLossHoldTime.name': 'Tiempo Prom. Pérdida',
  'metric.avgLossHoldTime.description':
    'Tiempo medio en operaciones perdedoras',

  'metric.avgWinnerHeat.name': 'Calor Prom. Ganadores',
  'metric.avgWinnerHeat.description': 'MAE media en operaciones ganadoras',
  'metric.winnerMaeP90.name': 'MAE P90 Ganadores',
  'metric.winnerMaeP90.description':
    'Percentil 90 del MAE en operaciones ganadoras',
  'metric.winnerMaeMedian.name': 'MAE Mediana Ganadores',
  'metric.winnerMaeMedian.description': 'MAE mediano en operaciones ganadoras',
  'metric.avgLossHeat.name': 'Calor Prom. Pérdidas',
  'metric.avgLossHeat.description': 'MAE media en operaciones perdedoras',
  'metric.winnerAvgMfe.name': 'MFE Prom. Ganadores',
  'metric.winnerAvgMfe.description': 'MFE media en operaciones ganadoras',
  'metric.loserAvgMfe.name': 'MFE Prom. Perdedores',
  'metric.loserAvgMfe.description': 'MFE media en operaciones perdedoras',
  'metric.winnerMfeP90.name': 'MFE P90 Ganadores',
  'metric.winnerMfeP90.description':
    'Percentil 90 del MFE en operaciones ganadoras',
  'metric.loserMfeP90.name': 'MFE P90 Perdedores',
  'metric.loserMfeP90.description':
    'Percentil 90 del MFE en operaciones perdedoras',
  'metric.timeInDrawdown.name': 'Time in Drawdown',
  'metric.timeInDrawdown.description':
    'Tiempo pasado por debajo de tu máximo de P&L',
  'metric.avgRecoveryTime.name': 'Avg Recovery Time',
  'metric.avgRecoveryTime.description':
    'Tiempo medio para salir de un drawdown',
  'metric.longestDrawdown.name': 'Longest Drawdown',
  'metric.longestDrawdown.description': 'Mayor tiempo en un único drawdown',
  'metric.drawdownEpisodes.name': 'Drawdown Episodes',
  'metric.drawdownEpisodes.description':
    'Número de periodos de drawdown distintos',
  'metric.category.performance': 'Rendimiento',
  'metric.category.volume': 'Volumen',

  
  'template.switch-title': 'Cambiar Layout',
  'template.switch-review-title': 'Cambiar Layout de {type}',

  'template.review-type.drc': 'DRC',
  'template.review-type.weekly': 'Semanal',
  'template.review-type.monthly': 'Mensual',
  'template.review-type.quarterly': 'Trimestral',
  'template.review-type.yearly': 'Anual',
  'template.review-type.review': 'Revisión',
  'template.builder.select-template': 'Selecciona una layout para editar',
  'template.builder.loading': 'Cargando Constructor de Diseño...',
  'template.builder.create-from-sidebar':
    'O crea una nueva desde la barra lateral',
  'template.builder.snippet-coming-soon': 'Editor de fragmentos próximamente',

  'template.preview.empty': 'No hay widgets en esta plantilla',
  'template.preview.summary': 'Plantilla {type} - {count} widgets',
  'template.preview.mode': 'Modo de vista previa',
  'template.preview.markdown-zone-placeholder': 'Zona Markdown - escribe aquí',
  'template.preview.markdown-zone-placeholder-with-id':
    'Zona Markdown ({id}) - escribe aquí',
  'template.preview.widget.game-performance-desc':
    'Distribuciones de calificaciones mentales/técnicas',
  'template.preview.widget.unknown-desc': 'Tipo de widget desconocido',

  
  'template.section.forecast': 'Pronóstico',
  'template.section.performance': 'Rendimiento',
  'template.section.review': 'Revisión',
  'template.question.drc.q1': '¿Qué hice bien hoy?',
  'template.question.drc.q2': '¿Qué podría mejorar?',
  'template.question.drc.q3': '¿En qué me centraré en la próxima sesión?',
  'template.question.weekly.q1': '¿Qué funcionó bien esta semana?',
  'template.question.weekly.q2': '¿Qué no funcionó esta semana?',
  'template.question.weekly.q3': '¿Qué setups fueron más rentables?',
  'template.question.weekly.q4': '¿Qué errores me costaron más dinero?',
  'template.question.weekly.q5': '¿Qué podría mejorar para la próxima semana?',
  'template.question.monthly.q1':
    '¿Cuáles fueron las lecciones clave de este mes?',
  'template.question.monthly.q2': '¿Qué estrategias funcionaron mejor?',
  'template.question.monthly.q3': '¿Qué patrones noto en mi operativa?',
  'template.question.monthly.q4':
    '¿Cuáles son mis objetivos para el próximo mes?',
  'template.question.monthly.q5': '¿Cómo puedo mejorar mi gestión del riesgo?',

  'template-picker.empty': 'No hay layouts disponibles.',
  'template-picker.close': 'Cerrar',
  'template-picker.built-in': '(incorporada)',
  'template-picker.badge.default': 'Predeterminada',
  'template-picker.badge.current': 'Actual',
  'template-picker.cancel': 'Cancelar',
  'template.transformation.orphaned-content.header':
    'Contenido de la Plantilla Anterior',
  'template.transformation.orphaned-content.desc1':
    'El siguiente contenido no encajó en el nuevo diseño de plantilla.',
  'template.transformation.orphaned-content.desc2':
    'Revísalo e intégralo arriba, o elimínalo si ya no es necesario.',
  'template.editor.loading': 'Cargando plantilla...',
  'template.editor.built-in': 'Incorporado',
  'template.editor.unsaved-changes': 'Cambios sin guardar',

  'template.editor.built-in-notice':
    'Las plantillas incorporadas no se pueden editar. Duplica esta plantilla o crea una nueva para personalizar.',

  'template.editor.show-review-desc':
    'Cuándo mostrar la sección de revisión en notas de operación',

  'template.editor.section-visibility': 'Visibilidad de Sección',
  'template.editor.trade-note-layout': 'Diseño de nota de operación',

  'template.editor.other-asset-types': 'Otros',

  'template.editor.asset-type-add': 'Tipo de activo',

  'template.editor.remove-asset-layout': 'Eliminar diseño del activo',

  'template.editor.metrics': 'Métricas',
  'template.editor.metrics-desc':
    'Mostrar tarjetas de entrada, salida, duración y plan',
  'template.editor.thesis': 'Tesis',
  'template.editor.thesis-desc': 'Mostrar el bloque de tesis de la operación',
  'template.editor.metric-cards': 'Tarjetas de métricas',
  'template.editor.missed-reason': 'Razón de operación perdida',
  'template.editor.missed-reason-desc':
    'Mostrar por qué no se tomó la operación perdida',
  'template.editor.metadata-rows': 'Filas de metadatos',
  'template.editor.accounts': 'Cuentas',
  'template.editor.setups': 'Setups',
  'template.editor.mistakes': 'Errores',
  'template.editor.tags': 'Etiquetas',
  'template.editor.custom-fields': 'Campos personalizados',
  'template.editor.custom-fields-desc':
    '{count} campos personalizados configurados',

  'template.editor.metric.position-size': 'Tamaño de posición',
  'template.editor.metric.execution-breakdown': 'Desglose de ejecución',
  'template.editor.metric.pnl': 'PyG',
  'template.editor.metric.r-multiple': 'Múltiplo R',
  'template.editor.metric.costs': 'Costes',
  'template.editor.nav-bar': 'Barra de Navegación',
  'template.editor.nav-bar-desc':
    'Mostrar línea de tiempo de operaciones y enlaces de revisión',
  'template.editor.images': 'Imágenes',
  'template.editor.images-desc': 'Mostrar imágenes de gráficos de operación',
  'template.editor.metadata': 'Metadatos',
  'template.editor.metadata-desc': 'Mostrar cuentas, setups y errores',

  'template.editor.review-button': 'Botón Marcar Revisado',
  'template.editor.review-button-desc':
    'Mostrar botón para marcar operación como revisada',

  
  
  
  'onboarding.welcome.title': 'Bienvenido a Journalit',
  'onboarding.welcome.subtitle':
    'Un diario de trading que vive en tu dispositivo.',
  'onboarding.welcome.cta': 'Configurar mi diario',
  'onboarding.welcome.chart.week': 'Semana {count}',
  'onboarding.view.title': 'Onboarding de Journalit',
  'onboarding.wizard.skip-aria': 'Saltar este paso',
  'onboarding.wizard.skip-onboarding': 'Saltar incorporación',

  'onboarding.common.continue': 'Continuar',
  'onboarding.common.close': 'Cerrar',

  'onboarding.features.badge.pro': 'PRO',

  
  
  

  
  
  

  'onboarding.features.graphic.syncing': 'Sincronizando operaciones...',
  'onboarding.features.graphic.complete': 'Sincronización completa',
  'onboarding.features.graphic.direction.long': 'LARGO',
  'onboarding.features.graphic.direction.short': 'CORTO',
  'onboarding.features.graphic.status.win': 'GANADA',
  'onboarding.features.graphic.status.loss': 'PÉRDIDA',

  'onboarding.activation.title': 'Inicia sesión en Journalit',

  'onboarding.activation.status.initializing':
    'Generando tu código de autenticación...',

  'onboarding.activation.status.error': 'Inicio de sesión fallido',
  'onboarding.activation.error.init':
    'No se pudo iniciar el inicio de sesión. Comprueba tu conexión e inténtalo de nuevo.',
  'onboarding.activation.error.denied':
    'Se rechazó el inicio de sesión. Puedes iniciar sesión más tarde desde la configuración.',
  'onboarding.activation.error.expired':
    'El código expiró. Reinicia el flujo de incorporación para intentarlo de nuevo.',
  'onboarding.activation.error.generic': 'Algo salió mal. Inténtalo de nuevo.',
  'onboarding.activation.error.save':
    'El inicio de sesión se completó, pero no se pudo guardar. Reinicia el plugin e inténtalo de nuevo.',
  'onboarding.activation.error.connection':
    'Conexión perdida. Comprueba tu conexión e inténtalo de nuevo.',
  'onboarding.activation.notice.invalid-url':
    'URL de activación inválida. Contacta con soporte.',

  'onboarding.activation.notice.popup-blocked-manual':
    'Abre esta URL en tu navegador: {url}',
  'onboarding.activation.notice.copy-code-failed':
    'No se pudo copiar el código. Cópialo manualmente.',
  'onboarding.activation.label.code': 'Tu código de autenticación',
  'onboarding.activation.button.copy': 'Copiar código',
  'onboarding.activation.button.copied': '¡Copiado!',
  'onboarding.activation.step.open-browser':
    'Haz clic abajo para abrir tu navegador',
  'onboarding.activation.step.enter-code':
    'Introduce tu código de autenticación',
  'onboarding.activation.step.complete-signin': 'Completa el inicio de sesión',
  'onboarding.activation.step.return-here':
    'Regresa aquí para la finalización automática',
  'onboarding.activation.button.open-browser':
    'Abrir navegador para iniciar sesión',
  'onboarding.activation.waiting.title': 'Esperando el inicio de sesión...',
  'onboarding.activation.waiting.hint': 'Esto suele tardar menos de un minuto',
  'onboarding.activation.success.title': '¡Inicio de sesión completo!',

  'onboarding.notice.complete-failed':
    'No se pudo guardar la finalización del onboarding. Inténtalo de nuevo más tarde.',
  'onboarding.notice.completed': 'Tu diario está listo. Onboarding completado.',
  'onboarding.familiarity.kicker': 'Una pregunta rápida',
  'onboarding.familiarity.title': '¿Has usado Obsidian antes?',
  'onboarding.familiarity.subtitle':
    'Journalit funciona dentro de Obsidian. Si es nuevo para ti, solo te mostraremos lo necesario.',
  'onboarding.familiarity.option.yes.label': 'Sí, me manejo bien',
  'onboarding.familiarity.option.yes.description': 'Saltar la orientación.',
  'onboarding.familiarity.option.no.label': 'No, soy nuevo en Obsidian',
  'onboarding.familiarity.option.no.description':
    'Una pantalla corta, sin recorrido.',
  'onboarding.orientation.kicker': 'Nuevo en Obsidian',
  'onboarding.orientation.title': 'Cuatro cosas que saber',
  'onboarding.orientation.subtitle':
    'Es todo lo que necesitas para usar Journalit.',
  'onboarding.orientation.inside.title':
    'Journalit funciona dentro de Obsidian',
  'onboarding.orientation.inside.body':
    'No necesitas aprender Obsidian primero. Esta pantalla es una vista de Journalit.',
  'onboarding.orientation.sidebar.title': 'La barra lateral es tu navegación',
  'onboarding.orientation.sidebar.body':
    'Inicio, Panel, Registro de operaciones y tus revisiones están ahí.',
  'onboarding.orientation.sidebar.action': 'Mostrar la barra lateral',
  'onboarding.orientation.sidebar.action-mobile': 'Abrir la barra lateral',
  'onboarding.orientation.sidebar.hint':
    'Ahí está, a la izquierda. Esta pantalla sigue abierta.',
  'onboarding.orientation.sidebar.hint-mobile':
    'Se abre sobre esta pantalla. Desliza o toca fuera para volver.',
  'onboarding.orientation.tabs.title': 'Las vistas se abren como pestañas',
  'onboarding.orientation.tabs.body': 'Como esta. Cambia entre ellas arriba.',
  'onboarding.orientation.privacy.title':
    'Tu diario se queda en tu dispositivo',
  'onboarding.orientation.privacy.body':
    'Notas, capturas y revisiones son tus propios archivos. Solo las operaciones que importas o sincronizas pasan por los servidores de Journalit.',
  'onboarding.orientation.continue': 'Entendido',
  'onboarding.data-source.kicker': 'Tus operaciones',
  'onboarding.data-source.title': '¿Dónde están tus operaciones ahora?',
  'onboarding.data-source.subtitle':
    'Tu historial es parte de tu ventaja. Tráelo contigo y tus estadísticas tendrán sentido desde el primer día, en lugar de esperar meses a acumular operaciones nuevas.',
  'onboarding.data-source.option.broker.label': 'En mi bróker o plataforma',
  'onboarding.data-source.option.broker.description':
    'Conéctalo o importa lo que exporta.',
  'onboarding.data-source.option.file.label': 'En mi propia hoja de cálculo',
  'onboarding.data-source.option.file.description':
    'Un diario que llevas en Excel, Google Sheets o CSV.',
  'onboarding.data-source.option.fresh.label':
    'En ningún sitio, empiezo de cero',
  'onboarding.data-source.option.fresh.description':
    'Añade operaciones a medida que las haces.',
  'onboarding.data-source.option.sample.label':
    'En ningún sitio aún, quiero explorar un ejemplo',
  'onboarding.data-source.option.sample.description':
    'Echa un vistazo a un diario ya hecho antes de añadir tus operaciones.',
  'onboarding.broker.kicker': 'Tu bróker',
  'onboarding.broker.title': '¿Qué bróker o plataforma?',
  'onboarding.awaiting.sign-in.action': 'Inicia sesión para continuar',
  'onboarding.awaiting.sign-in.body':
    'Inicia sesión o crea una cuenta gratuita de Journalit primero. Tus operaciones llegarán después a tu diario.',
  'onboarding.broker.badge.sync': 'Sincronización',
  'onboarding.broker.search': 'Buscar brókers y plataformas',
  'onboarding.broker.subtitle':
    'Elegiremos la mejor forma de traer tus operaciones.',
  'onboarding.broker.option.unlisted.label': 'No está en la lista',
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title': '¿Aún no aparece? Dinos qué bróker usas',
  'onboarding.broker.request.body':
    'Los brókers nuevos se añaden bajo petición. Dinos cuál (una muestra de exportación ayuda); mientras tanto, un archivo exportado se puede mapear a mano.',
  'onboarding.broker.request.discord': 'Pedirlo en Discord',
  'onboarding.broker.request.continue': 'Continuar con importación manual',
  'onboarding.broker.loading': 'Comprobando brókers compatibles...',
  'onboarding.broker.offline':
    'No se pudo cargar la lista completa. Aún puedes conectar un bróker compatible o importar un archivo.',
  'onboarding.personalise.kicker': 'Configura tu diario',
  'onboarding.personalise.title': 'Unas decisiones rápidas',
  'onboarding.personalise.subtitle':
    'Personalizamos Journalit según tus respuestas.',
  'onboarding.personalise.style.question': '¿Cómo operas?',
  'onboarding.personalise.style.scalping': 'Muchas operaciones al día',
  'onboarding.personalise.style.intraday':
    'Pocas operaciones al día, nada nocturno',
  'onboarding.personalise.style.swing': 'Mantenidas días o semanas',
  'onboarding.personalise.style.position': 'Mantenidas semanas o meses',
  'onboarding.personalise.account.question': '¿Qué tipo de cuenta?',
  'onboarding.personalise.account.personal': 'Personal',
  'onboarding.personalise.account.practice': 'Demo o práctica',
  'onboarding.personalise.account.prop': 'Desafío de prop firm o fondeada',
  'onboarding.personalise.asset.question': '¿Qué operas principalmente?',
  'onboarding.personalise.asset.stock': 'Acciones',
  'onboarding.personalise.asset.futures': 'Futuros',
  'onboarding.personalise.asset.forex': 'Forex',
  'onboarding.personalise.asset.crypto': 'Cripto',
  'onboarding.personalise.asset.options': 'Opciones',
  'onboarding.personalise.asset.mixed': 'Una mezcla',
  'onboarding.first-trade.kicker': 'Casi listo',
  'onboarding.first-trade.title': 'Añade tu primera operación',
  'onboarding.first-trade.subtitle':
    'Tu diario está listo. Registra una operación y Journalit empieza a trabajar con ella.',
  'onboarding.first-trade.cta': 'Añadir mi primera operación',
  'onboarding.first-trade.sample': 'Explorar con datos de ejemplo',
  'onboarding.preparing-sample.title': 'Preparando tu diario de ejemplo',
  'onboarding.preparing-sample.body':
    'Solo tarda unos segundos. Obsidian puede ir un poco lento mientras se escriben las notas.',
  'onboarding.preparing-sample.starting': 'Iniciando…',
  'onboarding.preparing-sample.hint':
    'Puedes quitar el diario de ejemplo cuando quieras desde su insignia en la esquina.',
  'onboarding.preparing-sample.failed.title':
    'No se pudo crear el diario de ejemplo',
  'onboarding.preparing-sample.failed.body':
    'Puedes intentarlo de nuevo o elegir otra forma de empezar.',
  'onboarding.preparing-sample.retry': 'Reintentar',
  'onboarding.sample-exploring.kicker': 'Diario de ejemplo',
  'onboarding.sample-exploring.title': 'Estás explorando el diario de ejemplo',
  'onboarding.sample-exploring.body':
    'Tómate tu tiempo. Cuando salgas del ejemplo, seguiremos aquí: personalizar tu propio diario y añadir tu primera operación.',
  'onboarding.sample-exploring.exit': 'Salir del ejemplo y continuar',
  'onboarding.sample-exploring.failed.title':
    'No se pudo restaurar el diario de ejemplo',
  'onboarding.sample-exploring.failed.body':
    'Sal del ejemplo para eliminar lo que queda y sigue configurando tu propio diario.',
  'onboarding.awaiting.kicker': 'Esperando tus primeras operaciones',
  'onboarding.awaiting.first-sync.title': 'Termina de conectar tu bróker',
  'onboarding.awaiting.first-sync.body':
    'Completa la conexión en Ajustes > Trade Sync. Cuando se sincronicen tus primeras operaciones, esta configuración se cerrará sola.',
  'onboarding.awaiting.first-sync.action': 'Abrir Trade Sync',
  'onboarding.awaiting.first-import.title': 'Importa tu archivo',
  'onboarding.awaiting.first-import.body':
    'Termina la importación en la pestaña Trade Import. Cuando entren tus primeras operaciones, esta configuración se cerrará sola.',
  'onboarding.awaiting.first-import.action': 'Abrir Trade Import',
  'onboarding.awaiting.first-trade.title': 'Guarda tu primera operación',
  'onboarding.awaiting.first-trade.body':
    'Cuando guardes tu primera operación, esta configuración se cerrará sola.',
  'onboarding.awaiting.first-trade.action': 'Añadir una operación',
  'onboarding.awaiting.change-route': 'Elegir otra forma',
  'onboarding.notice.personalise-failed':
    'No se pudieron aplicar tus opciones de configuración. Puedes ajustarlas después en Ajustes.',
  'onboarding.notice.trade-sync-open-failed':
    'No se pudo abrir Trade Sync. Inténtalo de nuevo.',
  'onboarding.notice.skip-failed':
    'No se pudo guardar el salto del onboarding. Inténtalo de nuevo más tarde.',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'Exportación CSV del widget Fills',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Abre el widget Fills en TT y cambia a la vista Detail, Continuous o Price with Detail',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Importante:',

  'trade.metadata.broker-comment': 'Comentario del bróker',

  
  'navigation.title': 'Journalit',
  'calendar.sidebar.title': 'Calendario de rendimiento',
  'navigation.section.overview': 'General',
  'navigation.section.reviews': 'Revisiones',
  'navigation.section.tools': 'Herramientas',
  'navigation.edit-mode.toggle': 'Personalizar navegación',
  'navigation.edit-mode.hide-item': 'Ocultar elemento de navegación',
  'navigation.edit-mode.restore-section': 'Elementos ocultos',
  'navigation.edit-mode.restore': 'Restaurar',
  'navigation.items.nav-settings': 'Configuración',
  'navigation.shortcuts.add': 'Añadir acceso directo',
  'navigation.shortcuts.remove': 'Eliminar acceso directo',
  'navigation.shortcuts.close': 'Cerrar selector de accesos directos',
  'navigation.shortcuts.search': 'Buscar cuentas y estrategias',
  'navigation.shortcuts.accounts': 'Cuentas',
  'navigation.shortcuts.setups': 'Estrategias',
  'navigation.shortcuts.empty': 'No hay cuentas ni estrategias disponibles',
  'navigation.shortcuts.unavailable': 'No disponible',
  'navigation.shortcuts.added': 'Añadido',
  'navigation.shortcuts.parent-required':
    'Elimina primero sus accesos directos antes de ocultar este elemento de navegación.',
  'navigation.items.nav-home': 'Inicio',
  'navigation.items.nav-dashboard': 'Panel',
  'navigation.items.nav-trade-log': 'Registro de trades',
  'navigation.items.nav-account-dashboard': 'Cuentas',
  'navigation.items.nav-drc': 'DRC de hoy',
  'navigation.items.nav-weekly': 'Revisión de esta semana',
  'navigation.items.nav-monthly': 'Revisión de este mes',
  'navigation.items.nav-quarterly': 'Revisión de este trimestre',
  'navigation.items.nav-yearly': 'Revisión de este año',
  'navigation.items.nav-add-trade': 'Añadir trade',
  'navigation.items.nav-layout-builder': 'Constructor de diseño',
  'navigation.items.nav-quick-import': 'Importación rápida',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-session-mode': 'Modo sesión',
  'navigation.items.nav-economic-calendar': 'Calendario económico',
  'navigation.items.nav-position-size': 'Calculadora de tamaño de posición',
  'settings.general.navigation-sidebar': 'Barra lateral de navegación',
  'notice.error.open-navigation-sidebar':
    'No se pudo abrir la barra lateral de navegación. Inténtalo de nuevo.',
  'navigation.setting.open': 'Abrir barra lateral de navegación',
  'navigation.setting.open.desc':
    'Muéstrala ahora y expande la barra lateral de Obsidian si está contraída.',
  'navigation.setting.open.button': 'Abrir barra lateral',
  'calendar.setting.open': 'Abrir calendario',
  'calendar.setting.open.button': 'Abrir calendario',
  'notice.error.open-calendar-sidebar':
    'No se pudo abrir el calendario. Inténtalo de nuevo.',
  'navigation.setting.tab-behavior': 'Comportamiento de pestaña de navegación',
  'navigation.setting.tab-behavior.desc':
    'Cómo abrir vistas y revisiones desde las barras laterales de Journalit',
  'navigation.setting.tab-behavior.new-tab': 'Abrir en nueva pestaña',
  'navigation.setting.tab-behavior.replace': 'Reemplazar pestaña activa',
  'navigation.search.placeholder': 'Buscar trades y revisiones...',
  'navigation.search.clear': 'Borrar búsqueda',
  'navigation.search.section.trades': 'Trades',
  'navigation.search.section.reviews': 'Revisiones',
  'navigation.search.empty': 'No se encontraron resultados',
  'navigation.search.trade-open': 'Abierto',

  'command.open-navigation-sidebar': 'Abrir barra lateral de navegación',
  'command.open-calendar-sidebar': 'Abrir barra lateral del calendario',
  'command.open-economic-calendar': 'Abrir calendario económico',

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
  'widget.longDrawdownChart.description':
    'Drawdown solo de operaciones en largo',

  'widget.shortDrawdownChart.name': 'Short Drawdown',
  'widget.shortDrawdownChart.description':
    'Drawdown solo de operaciones en corto',

  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',

  'guide.skip-guide': 'Saltar guía',
  'guide.step-count': '{count} pasos',
  'guide.step-position': 'Paso {current} de {total}',
  

  'onboarding.activation.button.copy-link': 'Copiar enlace',

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
    'Este widget solo está disponible en revisiones semanales',
  'templateEditor.widget.weekly-drc-day-label': 'Día',

  'templateEditor.widget.weekly-drc-start-collapsed': 'Iniciar contraído',
  'templateEditor.widget.weekly-drc-day-all': 'All days',

  'templateEditor.widget.previous-context-sections-label':
    'Sections to include',
  'templateEditor.widget.previous-context-heading-label':
    'Previous DRC section heading',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Choose a heading',
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
  'templateEditor.widget.trade-review.primary-metrics': 'Métricas principales',
  'templateEditor.widget.trade-review.classification': 'Clasificación',
  'templateEditor.widget.trade-review.more-context': 'Más contexto',
  'templateEditor.widget.trade-review.display': 'Visualización',
  'templateEditor.widget.trade-review.show-images': 'Mostrar imágenes',
  'templateEditor.widget.trade-review.fields-none': 'Sin campos',
  'templateEditor.widget.trade-review.fields-all': 'Todos los campos',
  'templateEditor.widget.trade-review.fields-count': '{count} campos',
  'templateEditor.widget.trade-review.no-fields': 'No hay campos disponibles',
  'templateEditor.widget.trade-review.questions': 'Preguntas de revisión',
  'templateEditor.widget.trade-review.questions-help':
    'Elige las preguntas que se muestran para cada resultado de la operación. Los IDs de las preguntas permanecen estables para que las respuestas guardadas sigan vinculadas al editar o reordenar las preguntas.',
  'templateEditor.widget.trade-review.outcome.win': 'Ganadoras',
  'templateEditor.widget.trade-review.outcome.loss': 'Perdedoras',
  'templateEditor.widget.trade-review.outcome.breakeven': 'Empate',
  'templateEditor.widget.trade-review.outcome.open': 'Abiertas',
  'templateEditor.widget.trade-review.questions-empty':
    'No hay preguntas para este resultado.',
  'templateEditor.widget.trade-review.question-label': 'Pregunta',
  'templateEditor.widget.trade-review.question-placeholder':
    'Escribe una pregunta de revisión',
  'templateEditor.widget.trade-review.answer-placeholder-label':
    'Marcador de respuesta',
  'templateEditor.widget.trade-review.answer-placeholder':
    'Texto opcional mostrado en el campo de respuesta',
  'templateEditor.widget.trade-review.add-question': '+ Agregar pregunta',
  'templateEditor.widget.trade-review.answer-type-label': 'Tipo de respuesta',
  'templateEditor.widget.trade-review.answer-type-text': 'Texto',
  'templateEditor.widget.trade-review.answer-type-choice': 'Opción',
  'templateEditor.widget.trade-review.option-placeholder':
    'Etiqueta de la opción',
  'templateEditor.widget.trade-review.add-option': '+ Agregar opción',
  'templateEditor.widget.trade-review.condition-label': 'Mostrar cuando',
  'templateEditor.widget.trade-review.condition-always': 'Siempre visible',
  'templateEditor.widget.trade-review.condition-option-label':
    'Cuando P{questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section': '+ Add section',

  'templateEditor.widget.previous-context-fallback-label':
    'Previous DRC fallback',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Nearest earlier DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Expected previous trading day only',
  'widget.stats.vs-prev': 'vs prev',
  'common.r-missing.title': 'Sin R para esta operación',
  'common.r-missing.trade':
    'Esta operación no tiene importe de riesgo, así que su resultado no se puede mostrar en R.',
  'common.r-missing.fix':
    'Añade un importe de riesgo o define un importe de riesgo predeterminado en Ajustes.',
  'common.r-coverage.partial':
    'Basado en {valid} de {total} operaciones. Las operaciones sin importe de riesgo no cuentan en R.',
  'common.r-coverage.none':
    'Ninguna operación aquí tiene importe de riesgo, así que no hay R que mostrar.',
  'dashboard.r-coverage.no-comparison':
    'Sin cambio: el período de comparación no tiene valor en R para esta métrica.',
  'dashboard.metrics.past-30d': 'past 30d',

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

  'calendar.aria.open-daily-review': 'Abrir revisión diaria para {date}',
  'calendar.aria.open-weekly-review': 'Abrir revisión semanal para {date}',
  'calendar.aria.open-monthly-review': 'Abrir revisión mensual para {date}',
  'calendar.aria.open-quarterly-review':
    'Abrir revisión trimestral para {date}',

  'csv.mapper.aria.map-column': 'Asignar columna {header}',
  'trade-import.error.file-empty':
    'Este archivo está vacío. Vuelve a exportarlo e inténtalo de nuevo.',
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
    'Inicia sesión o crea una cuenta gratuita de Journalit para previsualizar archivos en Trade Import. Solo necesitas Pro cuando importes las operaciones.',
  'quick-import.gate.sign-in-cta': 'Iniciar sesión para previsualizar gratis',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
  'quick-import.gate.preview-free': 'Previsualizar archivo gratis',
  'quick-import.message.needs-setup':
    'Choose a favorite broker or template in Trade Import before using Quick Import.',
  'quick-import.message.capabilities-failed':
    'Quick Import setup could not be loaded.',
  'quick-import.message.mapping-required':
    'This file needs column mapping. Open the full Trade Import flow to review mappings.',
  'quick-import.message.preview-failed':
    'This file needs review in the full Trade Import flow.',
  'quick-import.message.no-importable':
    'No se encontraron operaciones importables. Revisa este archivo en Trade Import para ver los detalles.',

  'quick-import.privacy-note':
    'Los archivos se suben a los servidores de Journalit para procesarse y no se almacenan de forma predeterminada.',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',

  'quick-import.status.checking-subscription':
    'Comprobando el estado de la suscripción...',
  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
  'quick-import.processing.sent-to-server':
    'Uploaded to Journalit for private processing',
  'quick-import.file.selected': 'Selected file',
  'quick-import.file.processed': 'Processed and ready to write to your vault',
  'quick-import.summary.title': 'Listo para importar',

  'quick-import.summary.to-import': 'Para importar',
  'quick-import.summary.duplicates': 'Duplicados',
  'quick-import.summary.failed': 'Requiere revisión',
  'quick-import.summary.failed-rows': 'Filas no importadas',
  'quick-import.summary.incomplete-rows': 'Filas incompletas omitidas',
  'quick-import.complete.title': 'Import complete',
  'quick-import.complete.message':
    '{written} written, {duplicates} duplicates, {failed} need review.',
  'quick-import.action.open-full': 'Open full Trade Import',
  'quick-import.action.review-in-trade-import': 'Revisar en Trade Import',
  'quick-import.action.setup-in-trade-import': 'Set up in Trade Import',
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import': 'Import trades',
  'quick-import.action.import-count.one': 'Importar {count} operación',
  'quick-import.action.import-count.few': 'Importar {count} operaciones',
  'quick-import.action.import-count.many': 'Importar {count} operaciones',
  'quick-import.action.import-count.other': 'Importar {count} operaciones',
  'quick-import.preview.more': '+ {count} more processed trades',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.open-failed': 'No se pudo abrir Trade Import',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.notice.free-preview-rate-limited':
    'Has alcanzado el límite de vistas previas gratuitas. Activa PRO o inténtalo de nuevo en unos {minutes} minutos.',
  'trade-import.notice.free-preview-storage-limit-reached':
    'El almacenamiento de vistas previas gratuitas admite hasta {limit} operaciones. Tienes {storedItems} guardadas y este archivo añadiría {requestedItems}. Espera a que caduque una vista previa anterior o activa PRO.',
  'trade-import.preview-error.guidance':
    'Comprueba que todos los campos obligatorios estén asignados, que el formato de fecha seleccionado coincida con tu archivo y que las columnas numéricas contengan valores de operación válidos.',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': 'Operaciones',
  'trade-import.gate.brand-right': 'Importar',
  'trade-import.gate.sign-in.title':
    'Previsualiza gratis tu historial de trading',
  'trade-import.gate.sign-in':
    'Inicia sesión o crea una cuenta gratuita de Journalit para analizar tu archivo. Solo necesitas Pro cuando importes las operaciones.',
  'trade-import.gate.sign-in.reassurance':
    'Tu archivo se procesa de forma privada y no se almacena de manera predeterminada.',
  'trade-import.gate.sign-in.no-trial':
    'No necesitas una prueba de Pro para analizar y previsualizar.',
  'trade-import.gate.sign-in.cta': 'Iniciar sesión para previsualizar gratis',

  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': 'Fuente de exportación / plataforma',
  'trade-import.label.asset-type': 'Asset type',
  'trade-import.asset.stock': 'Stock',
  'trade-import.asset.options': 'Options',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.manual-mode.price-based':
    'Órdenes o ejecuciones (agrupadas en operaciones)',
  'trade-import.manual-mode.direct-pnl': 'Una operación por fila (usa P/L)',
  'trade-import.label.ai-mapping': 'Request AI mapping suggestions',
  'trade-import.privacy.copy':
    'Trade Import uploads the selected broker export to Journalit servers for processing. Broker exports may contain account identifiers, trade history, symbols, timestamps, prices, quantities, fees, balances, and P&L. For preview generation, Journalit also sends your selected account name, mapping/template choices, custom field definitions and saved options, and limited local open-trade context for IBKR open-position matching. Raw files are processed for this import and are not stored by default. When AI mapping suggestions are on, the column headers and a few sample rows are also sent to an AI model to suggest column matches; untick the option to map columns yourself.',

  'trade-import.action.analyse': 'Analyse file',
  'trade-import.action.choose-file': 'Choose file',
  'trade-import.guide.prompt': '¿No sabes qué exportar?',
  'trade-import.guide.link': 'Ver guía del broker',
  'trade-import.hyperliquid.export-guidance':
    'En Hyperliquid, usa Trade History → Export as CSV, no Export More (un informe externo). No uses Funding History ni Order History.',
  'trade-import.hyperliquid.date-us': 'EE. UU.: mes/día/año - hora de 24 horas',
  'trade-import.hyperliquid.date-day-first':
    'Día primero: día/mes/año, con o sin « - » antes de la hora',
  'trade-import.hyperliquid.date-german':
    'Alemán: día.mes.año - hora de 24 horas',
  'trade-import.hyperliquid.invalid-time-zone':
    'No se pudo detectar la zona horaria de este dispositivo. Revisa la configuración del sistema.',
  'trade-import.hyperliquid.backend-update-required':
    'Se necesita una actualización del servidor para previsualizar Hyperliquid. Inténtalo más tarde.',
  'trade-import.action.drop-file': 'Drop file to upload',
  'trade-import.analyse.detected':
    'Hemos leído tu archivo {fileType}. Revisa las filas de abajo y asigna cada columna a un campo de la operación.',
  'trade-import.table.screenshots': 'Capturas',
  'trade-import.preview.screenshot-alt':
    'Captura de {symbol} de la fila {row} de la hoja',
  'trade-import.preview.screenshots-more': '{count} más',
  'trade-import.preview.include-screenshots':
    'Añadir las capturas de tu hoja de cálculo a sus operaciones ({count})',
  'trade-import.completion.screenshots-added':
    'Capturas añadidas desde tu hoja de cálculo: {count}',
  'trade-import.completion.screenshots-failed':
    'Capturas de tu hoja de cálculo que no se pudieron añadir: {count}',
  'trade-import.preview.import-anyway': 'Importar de todos modos',
  'trade-import.preview.import-anyway-aria':
    'Importar {symbol} del {date} de todos modos',
  'trade-import.preview.import-all-anyway':
    'Importar de todos modos los {count} posibles duplicados',
  'csv.mapper.missing-fields.pnl-or-prices':
    'O asigna Precio de entrada, Precio de salida y Cantidad para calcular el P/L a partir de los precios.',
  'trade-import.pnl-from-prices.title':
    'El P/L se calculará a partir de tus precios',
  'trade-import.pnl-from-prices.body':
    'No hay columna de P/L, así que se calcula con el precio de entrada, el precio de salida y la cantidad. Solo es correcto con el tipo de activo adecuado, así que elige qué son estas operaciones.',
  'trade-import.pnl-from-prices.contract-size':
    'Forex y futuros también necesitan una columna de tamaño de contrato para calcular el P/L. Si no la tienes, asigna tu columna de P/L.',
  'trade-import.diagnostic.choose-date-format': 'Elegir formato de fecha',
  'trade-import.date-question.ambiguous':
    'Tus fechas son como {example}. ¿Qué fecha es?',
  'trade-import.date-question.mixed':
    'Algunas fechas de esta columna usan otro orden, como {example}. ¿Qué orden usan la mayoría de tus fechas?',
  'trade-import.date-question.mixed-note':
    'Las filas con el otro orden se listarán para que las corrijas en tu archivo.',
  'quick-import.message.date-order':
    'Tus fechas se pueden leer de dos formas. Abre la importación completa para elegir.',
  'csv.date-format.eu-dot': 'UE con puntos: 25.12.2024 (día.mes.año)',
  'csv.date-format.ymd-dot': 'Año primero con puntos: 2024.12.25',
  'trade-import.unmapped.title': 'No importadas ({count})',
  'trade-import.unmapped.body':
    'Estas columnas no coinciden con ningún campo de Journalit y se omitirán. Si algún campo encaja, asigna la columna arriba.',
  'trade-import.unmapped.keep': 'Conservar como campo personalizado',
  'trade-import.unmapped.keep-aria':
    'Conservar {header} como campo personalizado',
  'trade-import.custom-field.title':
    'Conservar «{header}» como campo personalizado',
  'trade-import.custom-field.hint':
    'Añade un campo a tus operaciones y lo rellena con esta columna. Si ya hay un campo de Journalit que encaje, asigna la columna a ese campo.',
  'trade-import.custom-field.name': 'Nombre del campo',
  'trade-import.custom-field.type': 'Tipo de campo',
  'trade-import.custom-field.type.text': 'Texto',
  'trade-import.custom-field.type.number': 'Número',
  'trade-import.custom-field.type.dropdown': 'Lista de opciones',
  'trade-import.custom-field.create': 'Crear campo',
  'trade-import.custom-field.error.reserved':
    'Este nombre lo usa un campo integrado de la operación. Elige otro nombre.',
  'trade-import.table.open-closed': 'Abierta/cerrada',
  'trade-import.status.open': 'Abierta',
  'trade-import.status.partially-closed': 'Cerrada parcialmente',
  'trade-import.status.closed': 'Cerrada',
  'trade-import.status.cancelled': 'Cancelada',
  'trade-import.diagnostic.column': 'Columna: {columns}',
  'trade-import.diagnostic.unmap-column': 'No importar esta columna',
  'trade-import.diagnostic.edit-mapping': 'Cambiar asignación',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Sheet',
  'trade-import.label.header-row': 'Header row',
  'trade-import.placeholder.auto': 'Auto',
  'trade-import.label.date-format': 'Date format',

  'trade-import.label.save-template': 'Save mapping template',
  'trade-import.placeholder.template-name': 'Template name',
  'trade-import.action.save-template': 'Save template',
  'trade-import.action.preview': 'Generate preview',

  'trade-import.preview.found.one': 'Encontramos {count} operación',
  'trade-import.preview.found.few': 'Encontramos {count} operaciones',
  'trade-import.preview.found.many': 'Encontramos {count} operaciones',
  'trade-import.preview.found.other': 'Encontramos {count} operaciones',
  'trade-import.preview.date-range': 'De {start} a {end}',
  'trade-import.preview.metric.symbols': 'Símbolos',
  'trade-import.preview.metric.ready': 'Listas para importar',
  'trade-import.preview.metric.duplicates': 'Posibles duplicados',
  'trade-import.preview.metric.attention': 'Requieren atención',
  'trade-import.preview.completed.message':
    'Operaciones listas para importar: {count}.',
  'trade-import.preview.partial.message':
    'Operaciones listas: {count}. Filas que no se pudieron importar: {failed}. Filas incompletas omitidas: {incomplete}.',
  'trade-import.preview.partial.guidance':
    'Solo se importarán las operaciones válidas que se muestran a continuación.',

  'trade-import.preview.failed.message':
    'No se pudo preparar ninguna operación a partir de este archivo.',
  'trade-import.preview.failed.guidance':
    'Revisa las asignaciones de columnas, el formato de fecha, la hoja y la fila de encabezado seleccionadas, así como los valores no válidos que aparecen a continuación.',
  'trade-import.preview.tradovate-performance.title':
    'Informe de Tradovate incorrecto',
  'trade-import.preview.tradovate-performance.message':
    'Parece una exportación de Rendimiento de Tradovate. Journalit importa el informe Órdenes para reconstruir tus ejecuciones con precisión. En Tradovate, ve a Reports > Orders y descarga el CSV.',
  'trade-import.preview.tradovate-performance.guide':
    'Ver guía de exportación de Tradovate',
  'trade-import.preview.metatrader-statement.title':
    'Extracto de MetaTrader no compatible',
  'trade-import.preview.metatrader-statement.message':
    'Journalit importa el informe original del historial de la cuenta de MetaTrader. Configura MetaTrader en inglés, abre Account History / History, elige Save as Report y sube el archivo .html o .htm original sin editarlo ni convertirlo.',
  'trade-import.preview.metatrader-statement.guide':
    'Ver guía de exportación de MetaTrader',
  'trade-import.preview.tradingview-export.title':
    'Exportación de TradingView incorrecta',
  'trade-import.preview.tradingview-export.message':
    'Journalit espera el CSV Order History / History de TradingView Paper Trading. No uses Account History, datos de gráficos, exportaciones de estrategias ni otros archivos CSV de TradingView.',
  'trade-import.preview.tradingview-export.guide':
    'Ver guía de exportación de TradingView',
  'trade-import.source-recovery.title':
    'Este archivo parece una exportación de {source}',
  'trade-import.source-recovery.message':
    'Journalit puede importar este archivo directamente con {source} en lugar de {selected}.',
  'trade-import.source-recovery.continue': 'Continuar con {selected}',
  'trade-import.source-recovery.switch': 'Cambiar a {source}',
  'trade-import.source-recovery.guide': 'Ver guía de exportación de {source}',
  'trade-import.source-recovery.metatrader.message':
    'Journalit puede importar este extracto de MetaTrader directamente, sin necesidad de asignar columnas.',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    'El archivo proviene de DeepCharts aunque la cuenta opere a través de Rithmic. Usa DeepCharts para que las operaciones largas y cortas se lean correctamente de la Trade List.',
  'trade-import.source-recovery.deepcharts.manual-message':
    'Usa el importador de DeepCharts. Lee largo y corto de la Quantity con signo o de la columna Direction de la Trade List, así que no hace falta asignación manual.',
  'trade-import.source-recovery.motivewave.title':
    'Este archivo parece una exportación de ejecuciones de MotiveWave',
  'trade-import.source-recovery.motivewave.message':
    'Usa MotiveWave para que Journalit pueda emparejar correctamente las filas de ejecución y convertirlas en operaciones completadas.',
  'quick-import.message.source-mismatch':
    'Journalit identificó una fuente de exportación diferente. Revísala en Trade Import para cambiar de fuente sin volver a subir el archivo.',
  'trade-import.preview.no-eligible':
    'El archivo se procesó correctamente, pero no hay operaciones nuevas ni actualizadas que se puedan importar. Revisa los detalles sobre duplicados y clasificación que aparecen a continuación.',
  'trade-import.pro-gate.title.one': '{count} operación lista para importar',
  'trade-import.pro-gate.title.few': '{count} operaciones listas para importar',
  'trade-import.pro-gate.title.many':
    '{count} operaciones listas para importar',
  'trade-import.pro-gate.title.other':
    '{count} operaciones listas para importar',
  'trade-import.pro-gate.subtitle':
    'Activa PRO para escribirlas en tu bóveda como notas de operación.',
  'trade-import.pro-gate.cta': 'Activar PRO',
  'trade-import.preview.diagnostics': 'Detalles para revisar ({count})',
  'trade-import.preview.affected-rows': 'Filas afectadas: {count}',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Entry time',
  'trade-import.table.date': 'Date',
  'trade-import.table.position': 'Position',
  'trade-import.table.result': 'Result',
  'trade-import.table.quantity': 'Quantity',
  'trade-import.table.message': 'Message',
  'trade-import.status.new': 'Nueva',
  'trade-import.status.already-imported': 'Ya importada',
  'trade-import.status.other-account': 'En otra cuenta',
  'trade-import.status.other-account.detail': 'Ya importada en {account}',
  'trade-import.status.updates-existing': 'Actualiza una operación existente',
  'trade-import.status.possible-duplicate': 'Posible duplicado',
  'trade-import.status.needs-review': 'Requiere revisión',
  'trade-import.status.duplicate-in-file': 'Duplicada en el archivo',
  'trade-import.status.invalid': 'Operación no válida',
  'trade-import.status.no-open-trade': 'No hay operación abierta que cerrar',
  'trade-import.status.multiple-open-trades':
    'Coinciden varias operaciones abiertas',
  'trade-import.status.quantity-mismatch': 'Cantidad no coincide',
  'trade-import.server-deletion.deleted':
    'Operaciones eliminadas del servidor de Journalit: {count}',
  'trade-import.server-deletion.kept':
    'Operaciones conservadas porque otra importación también las contiene: {count}',
  'trade-import.server-deletion.blocked-broker-connected':
    'Esta cuenta se sincroniza con una conexión de broker. Desconecta el broker para eliminar sus datos.',
  'trade-import.server-deletion.blocked-broker-history':
    'Esta cuenta tiene historial de sincronización del broker y no se puede eliminar aquí. Elimina importaciones individuales.',
  'trade-import.server-deletion.failed':
    'No se pudo eliminar del servidor de Journalit. Inténtalo de nuevo.',
  'trade-import.server-deletion.notice':
    'Notas de operaciones movidas a la papelera tras una eliminación en el servidor: {count}',
  'trade-import.server-deletion.account.title':
    '¿Eliminar la cuenta del servidor?',
  'trade-import.server-deletion.account.message':
    'Esto elimina de forma permanente «{account}» y sus operaciones importadas ({count} en el servidor) del servidor de Journalit y mueve sus notas a la papelera en todas las bóvedas sincronizadas. Después puedes volver a importar los archivos.',
  'trade-import.server-deletion.account.confirm': 'Eliminar del servidor',
  'trade-import.server-deletion.account.button': 'Eliminar del servidor',
  'trade-import.history.title': 'Historial de importaciones',
  'trade-import.completion.wrong-account':
    '¿Importaste en la cuenta equivocada?',
  'trade-import.completion.undo-import': 'Deshacer esta importación',
  'trade-import.action.manage-imports': 'Gestionar importaciones anteriores',
  'trade-import.history.loading': 'Cargando historial de importaciones…',
  'trade-import.history.load-failed':
    'No se pudo cargar el historial de importaciones.',
  'trade-import.history.empty': 'Aún no hay importaciones.',
  'trade-import.history.trades-on-server': '{count} en el servidor',
  'trade-import.history.delete.title': '¿Eliminar esta importación?',
  'trade-import.history.delete.message':
    'Esto elimina de forma permanente del servidor de Journalit las operaciones que esta importación añadió a «{account}» ({count} en el servidor) y mueve sus notas a la papelera en todas las bóvedas sincronizadas. Se conservan las operaciones que otra importación también contiene. Después puedes volver a importar el archivo.',
  'trade-import.history.delete.confirm': 'Eliminar importación',
  'trade-import.history.load-more': 'Cargar más',
  'account.edit.modal.delete.delete-server-trades':
    'Eliminar también sus operaciones importadas del servidor de Journalit ({count} en el servidor). Sus notas se moverán a la papelera en todas las bóvedas sincronizadas, aunque las conserves aquí.',
  'trade-import.preview.other-account.message':
    'Ya están en {account} ({count}), así que se omitirán.',
  'trade-import.preview.other-account.import-instead': 'Importar en {account}',
  'trade-import.preview.other-account.undo-earlier':
    'Deshacer la importación anterior',
  'trade-import.action.confirm': 'Confirm import',
  'trade-import.action.activate-pro.one':
    'Activar PRO para importar {count} operación',
  'trade-import.action.activate-pro.few':
    'Activar PRO para importar {count} operaciones',
  'trade-import.action.activate-pro.many':
    'Activar PRO para importar {count} operaciones',
  'trade-import.action.activate-pro.other':
    'Activar PRO para importar {count} operaciones',
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',
  'trade-import.source.title': '¿De dónde vienen estas operaciones?',
  'trade-import.source.subtitle':
    'Elige la plataforma desde la que exportaste. Journalit lee su formato de archivo directamente, sin mapear columnas.',
  'trade-import.source.search': 'Buscar brókers y plataformas',
  'trade-import.source.sync-available': 'También admite Trade Sync automático',
  'trade-import.source.manual.tile': 'Hoja de cálculo propia / otro archivo',
  'trade-import.source.manual.title': 'Hoja de cálculo propia u otro archivo',
  'trade-import.source.manual.hint':
    'Asignarás las columnas de tu archivo a los campos de Journalit.',
  'trade-import.source.native.hint':
    'El formato del archivo se lee automáticamente, sin mapeo.',
  'trade-import.source.guide': 'Cómo exportar',
  'trade-import.source.change': 'Cambiar',
  'trade-import.sync-suggestion.full.title':
    '{broker} puede sincronizarse automáticamente',
  'trade-import.sync-suggestion.full.body':
    'Trade Sync trae tus nuevas operaciones por sí solo, sin exportar nada. Aún puedes importar un archivo abajo.',
  'trade-import.sync-suggestion.partial.title':
    '¿Usas {provider}? Sincronízalo en su lugar',
  'trade-import.sync-suggestion.partial.body':
    'Trade Sync trae las operaciones de {provider} automáticamente. Otros extractos se siguen importando abajo.',
  'trade-import.sync-suggestion.action': 'Configurar Trade Sync',
  'trade-import.sync-suggestion.sync-only.title':
    '{broker} se conecta con Trade Sync',
  'trade-import.sync-suggestion.sync-only.body':
    'Sin exportar: Trade Sync trae tus operaciones de {broker} automáticamente. ¿Tienes igualmente un archivo de {broker}? Elige No aparece / archivo personalizado.',
  'trade-import.sync-suggestion.action.open': 'Abrir Trade Sync',

  
  'command.open-setups': 'Abrir setups',
  'setups.create.title': 'Crear setup',
  'setups.create.field.name': 'Nombre del setup',
  'setups.create.placeholder.name': 'Impulso de apertura',
  'setups.create.field.status': 'Estado',
  'setups.create.field.direction': 'Dirección',
  'setups.create.field.color': 'Color',
  'setups.create.field.color-description':
    'Elige un color para identificar este setup.',
  'setups.create.profile.heading': 'Campos preferidos',
  'setups.create.profile.optional-label': '(Opcional)',
  'setups.create.field.sessions': 'Sesiones',
  'setups.create.field.preferred-sessions-tooltip':
    'Gestiona estas sesiones en Configuración → Diario → Modo sesión.',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': 'Temporalidades',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'Tickers',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
  'setups.create.direction.any': 'Sin especificar',
  'setups.create.direction.long': 'Largo',
  'setups.create.direction.short': 'Corto',
  'setups.create.direction.both': 'Ambos',
  'setups.create.field.linked-notes': 'Notas vinculadas',
  'setups.create.field.linked-notes-desc':
    'Vincula notas existentes que documenten el playbook de este setup.',
  'setups.create.linked-notes.empty': 'Aún no hay notas vinculadas.',
  'setups.create.linked-notes.add': '+ Vincular nota',
  'setups.create.linked-notes.remove': 'Eliminar nota vinculada',
  'setups.create.linked-notes.picker-title': 'Elegir nota de playbook',
  'setups.create.linked-notes.search': 'Buscar notas...',
  'setups.create.linked-notes.no-notes': 'No se encontraron notas Markdown.',
  'setups.create.button.creating': 'Creando...',
  'setups.create.button.create': 'Crear setup',
  'setups.create.success': 'Setup "{name}" creado correctamente',
  'setups.create.error.name-required': 'El nombre del setup es obligatorio',
  'setups.create.error.failed': 'No se pudo crear el setup',
  'setups.edit.title': 'Editar setup',
  'setups.edit.button.saving': 'Guardando...',
  'setups.edit.button.save': 'Guardar setup',
  'setups.edit.button.rename-and-update': 'Rename and update trades',
  'setups.edit.rename-warning.title': 'Rename setup and update trades',
  'setups.edit.rename-warning.message':
    'Renaming {oldName} to {newName} will update trade notes that use the old setup name.',
  'setups.edit.delete.button': 'Eliminar setup',
  'setups.edit.delete.title': 'Eliminar setup',
  'setups.edit.delete.confirm': 'Confirmar eliminación',
  'setups.edit.delete.warning':
    'Eliminar "{name}" eliminará el setup permanentemente y lo quitará de las operaciones vinculadas. Esta acción no se puede deshacer.',
  'setups.edit.delete.success': 'Setup "{name}" eliminado',
  'setups.edit.delete.error': 'No se pudo eliminar el setup',
  'setups.edit.success': 'Setup "{name}" actualizado correctamente',
  'setups.edit.error.failed': 'No se pudo actualizar el setup',
  'setups.view.compare.empty-submessage':
    'Choose two setup cards from the overview to build a side-by-side report.',
  'setups.view.compare.reason.higher.total-r': 'R total superior',
  'setups.view.compare.reason.lower.total-r': 'R total inferior',
  'setups.view.compare.reason.similar.total-r': 'R total similar',

  'setups.guide.create-new-setup.title': 'Crear nuevos setups',
  'setups.guide.create-new-setup.description':
    'Usa Nuevo setup para añadir otro playbook. El modal te guía por detalles, notas vinculadas y reglas.',
  'setups.guide.detail-intro.title': 'Esta es la página del setup',
  'setups.guide.detail-intro.description':
    'Esta página enfoca un playbook con su gráfico de rendimiento, contexto, material de referencia, acciones y reglas de ejecución.',
  'setups.guide.detail-actions.title': 'Acciones del setup',
  'setups.guide.detail-actions.description':
    'Usa estos botones para abrir operaciones relacionadas o editar detalles, notas vinculadas, capturas y reglas del playbook.',
  'setups.guide.empty.create-setup.title': 'Empieza con Nuevo setup',
  'setups.guide.empty.create-setup.description':
    'Crea primero un setup. Cuando exista, esta guía continuará con el recorrido normal.',

  'setups.guide.intro.title': 'Bienvenido a Setups',
  'setups.guide.intro.description':
    'Esta vista reúne playbooks de setups, operaciones vinculadas, notas, capturas y reglas en un solo lugar.',
  'setups.guide.view-tabs.title': 'Cambia las vistas de setups',
  'setups.guide.view-tabs.description':
    'Usa estas pestañas para moverte entre resumen, pares de setups y comparación cuando haya suficientes setups.',
  'setups.guide.overview-chart.title': 'Ranking de rendimiento',
  'setups.guide.overview-chart.description':
    'El gráfico de resumen ordena los setups por la métrica elegida. Usa los controles de arriba a la derecha para cambiar la métrica o enfocar setups concretos.',
  'setups.guide.tag-filter.title': 'Filtrar setups',
  'setups.guide.tag-filter.description':
    'Filtra las tarjetas, el gráfico, los pares y la comparación por etiquetas o dirección. Las selecciones dentro de cada grupo usan O, y etiquetas y dirección se combinan entre sí.',
  'setups.guide.setup-cards.title': 'Tarjetas de setup',
  'setups.guide.setup-cards.description':
    'Las tarjetas resumen cada setup con métricas clave, estado, última operación y una pequeña tendencia de rendimiento.',
  'setups.guide.open-detail.title': 'Abrir una página de setup',
  'setups.guide.open-detail.description':
    'Cuando estés listo, abre una tarjeta de setup para ver su página. Allí te espera una guía breve.',
  'setups.guide.detail-performance.title': 'Rendimiento del detalle',
  'setups.guide.detail-performance.description':
    'La pestaña Rendimiento muestra el gráfico y métricas clave en el tiempo, como P&L, win rate, expectativa y drawdown.',
  'setups.guide.detail-context.title': 'Contexto del setup',
  'setups.guide.detail-context.description':
    'Este panel mantiene a mano salud, elementos de atención, notas vinculadas y capturas.',
  'setups.guide.detail-playbook.title': 'Notas de playbook',
  'setups.guide.detail-playbook.description':
    'El área de playbook previsualiza la nota vinculada. Puede ser markdown, imágenes, Excalidraw o cualquier material de referencia.',
  'setups.guide.detail-rules.title': 'Reglas de ejecución',
  'setups.guide.detail-rules.description':
    'Las reglas capturan la lista estructurada de condiciones, entradas, riesgo y errores a evitar.',
  'setups.guide.finish.title': 'Guía de Setups completada',
  'setups.guide.finish.description':
    'Ya viste las superficies principales: Resumen, Pares, Comparar y la página individual del setup.',

  'setups.guide.pairs-mode.title': 'Abre pares de setups',
  'setups.guide.pairs-mode.description':
    'Abre Pares para ver qué combinaciones de setups tienen suficientes operaciones compartidas para comparar.',
  'setups.guide.pairs-chart.title': 'Ranking de pares',
  'setups.guide.pairs-chart.description':
    'El modo Pares destaca combinaciones que pueden funcionar mejor o peor juntas. Haz clic en una barra para ver insights más profundos de esa combinación.',

  'setups.guide.compare-mode.title': 'Inicia el modo comparación',
  'setups.guide.compare-mode.description':
    'El modo comparación permite seleccionar dos tarjetas de setup para revisarlas lado a lado.',
  'setups.guide.compare-select.title': 'Selecciona dos setups',
  'setups.guide.compare-select.description':
    'Selecciona dos tarjetas para abrir la página de comparación.',
  'setups.guide.compare-summary.title': 'Esta es la página de comparación',
  'setups.guide.compare-summary.description':
    'Esta página compara dos setups lado a lado. La fila superior muestra ganador, ventaja de expectativa, confianza y por qué un setup puede tener ventaja.',
  'setups.guide.compare-body.title': 'Fila resumen de comparación',
  'setups.guide.compare-body.description':
    'La fila superior resume la comparación: ganador, ventaja de expectativa, confianza y razones de la ventaja.',
  'setups.guide.compare-details.title': 'Detalles de comparación',
  'setups.guide.compare-details.description':
    'Usa la tabla de métricas y el gráfico acumulado para entender cómo difieren los dos setups.',
  'setups.guide.detail-execution-gap.title': 'Análisis de brecha de ejecución',
  'setups.guide.detail-execution-gap.description':
    'Cuando hay operaciones perdidas o backtests, esta pestaña compara la ejecución capturada con oportunidad perdida o benchmark.',
  'setups.guide.back-to-overview.title': 'Volver a tarjetas',
  'setups.guide.back-to-overview.description':
    'Vuelve a las tarjetas cuando termines de comparar.',

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
  'setups.view.detail.no-playbook-note':
    'Vincula una nota del playbook para previsualizarla aquí.',
  'setups.view.detail.link-playbook-note': 'Vincular nota',
  'setups.view.detail.change-playbook-note': 'Cambiar nota',

  'setups.view.detail.playbook-note-modal.empty':
    'No se encontraron notas coincidentes.',
  'setups.view.detail.empty-playbook-note':
    'La nota del playbook vinculada está vacía.',
  'setups.view.detail.rules.edit': 'Editar reglas',

  'setups.view.detail.rules.add': 'Añadir regla',

  'setups.view.detail.rules.empty-title': 'Crear el playbook del setup',
  'setups.view.detail.rules.use-template': 'Usar plantilla',
  'setups.view.detail.rules.applying-template': 'Aplicando plantilla...',
  'setups.view.detail.rules.add-custom': 'Regla personalizada',
  'setups.view.detail.rules.template-error':
    'No se pudo aplicar la plantilla del playbook.',
  'setups.view.detail.rules.template.best-conditions': 'Mejores condiciones',
  'setups.view.detail.rules.template.entry-criteria': 'Criterios de entrada',
  'setups.view.detail.rules.template.invalidation': 'Invalidación',
  'setups.view.detail.rules.template.risk-management': 'Riesgo / gestión',
  'setups.view.detail.rules.template.avoid-when': 'Evitar cuando',
  'setups.view.detail.rules.template.common-mistakes': 'Errores comunes',
  'setups.view.detail.rules.template.rule.best-conditions':
    'El contexto del mercado favorece este setup',
  'setups.view.detail.rules.template.rule.entry-criteria':
    'El detonante de entrada está claramente definido',
  'setups.view.detail.rules.template.rule.invalidation':
    'La invalidación está clara antes de la entrada',
  'setups.view.detail.rules.template.rule.risk-management':
    'El riesgo es aceptable y el objetivo está definido',
  'setups.view.detail.rules.template.rule.avoid-when':
    'No están presentes las condiciones que deben evitarse',
  'setups.view.detail.rules.template.rule.common-mistakes':
    'Se evitan los errores de ejecución conocidos',
  'setups.view.detail.rules.field.label': 'Regla',
  'setups.view.detail.rules.field.description': 'Detalles',
  'setups.view.detail.rules.field.group': 'Grupo',
  'setups.view.detail.rules.move-up': 'Mover regla arriba',
  'setups.view.detail.rules.move-down': 'Mover regla abajo',
  'setups.view.detail.rules.delete': 'Eliminar regla',
  'setups.view.detail.rules.save-error':
    'No se pudieron guardar las reglas del setup.',
  'setups.view.detail.rules.validation-label':
    'Añade un nombre de regla o elimina la regla vacía antes de guardar.',
  'setups.view.detail.rules.groups': 'Grupos',
  'setups.view.detail.rules.add-group': 'Añadir grupo',
  'setups.view.detail.rules.new-group': 'Nuevo grupo',
  'setups.view.detail.rules.validation-group':
    'Añade un nombre de grupo o elimina el grupo vacío antes de guardar.',
  'setups.view.detail.rules.summary': '{count} reglas · {groups} grupos',

  'setups.view.detail.rule.category.context': 'Contexto',
  'setups.view.detail.rule.category.entry': 'Entrada',
  'setups.view.detail.rule.category.exit': 'Salida',
  'setups.view.detail.rule.category.risk': 'Riesgo',
  'setups.view.detail.rule.category.management': 'Gestión',
  'setups.view.detail.rule.category.invalidation': 'Invalidación',
  'setups.view.detail.rule.category.psychology': 'Psicología',
  'setups.view.detail.performance.drawdown': 'Drawdown',
  'setups.view.detail.performance.empty-submessage':
    'Trades using this setup will appear here once you start logging them.',
  'setups.view.detail.analysis.performance': 'Performance',
  'setups.view.detail.analysis.execution-gap': 'Execution Gap',
  'setups.view.detail.analysis.tabs-aria': 'Setup performance tabs',
  'setups.view.detail.brief.linked-notes-add': 'Editar notas vinculadas',

  'setups.view.detail.execution-gap.live-pnl': 'Live PnL',
  'setups.view.detail.execution-gap.live-r': 'R en vivo',
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
  'setups.view.detail.brief.linked-notes': '{count} notas vinculadas',
  'setups.view.detail.brief.linked-notes-modal.subtitle':
    'Notas vinculadas a {name}.',
  'setups.view.detail.brief.screenshots': '{count} capturas de pantalla',
  'setups.view.detail.brief.no-screenshots': 'Aún no hay capturas vinculadas.',
  'setups.view.detail.brief.screenshot-alt':
    'Captura de pantalla del setup {index}',
  'setups.view.detail.brief.screenshot-open':
    'Abrir captura de pantalla {index}',
  'setups.view.detail.brief.count.rules': '{count} reglas',
  'setups.view.detail.brief.count.notes': '{count} notas',
  'setups.view.detail.brief.count.images': '{count} imágenes',
  'setups.view.detail.brief.count.trades': '{count} trades',
  'setups.view.detail.brief.more': '+{count} más',
  'setups.view.detail.attention.title': 'Requiere atención',
  'setups.view.detail.attention.count': '{count} elementos',
  'setups.view.detail.attention.empty':
    'No se encontraron problemas en el setup.',
  'setups.view.detail.attention.show-more': '+{count} más',
  'setups.view.detail.attention.show-less': 'Mostrar menos',
  'setups.view.detail.attention.no-playbook-title':
    'Vincula una nota del playbook',
  'setups.view.detail.attention.no-playbook-detail':
    'Vincula una nota de origen para consultar el contexto y ejemplos.',
  'setups.view.detail.attention.no-rules-title':
    'Crea el playbook de ejecución',
  'setups.view.detail.attention.no-rules-detail':
    'Añade criterios de entrada, invalidación, riesgo y errores.',

  'setups.view.detail.attention.no-trades-title': 'Aún no hay trades en vivo',
  'setups.view.detail.attention.no-trades-detail':
    'Aún no hay historial de trades en vivo vinculados.',
  'setups.view.detail.attention.no-screenshots-title':
    'Guarda capturas de pantalla de ejemplo',
  'setups.view.detail.attention.no-screenshots-detail':
    'Adjunta capturas de pantalla a los trades para revisarlos como ejemplos.',
  'setups.view.detail.attention.stale-title': 'Revisa su relevancia reciente',
  'setups.view.detail.attention.stale-detail':
    'No se han registrado trades para este setup en {count} días.',
  'setups.view.detail.attention.profit-factor-title':
    'El rendimiento requiere revisión',
  'setups.view.detail.attention.profit-factor-detail':
    'El factor de beneficio es inferior a 1,0 en los trades vinculados.',
  'setups.view.detail.attention.expectancy-title': 'La expectativa es negativa',
  'setups.view.detail.attention.expectancy-detail':
    'El resultado medio de los trades vinculados está por debajo del punto de equilibrio.',
  'setups.view.card.open-named': '{name}',
  'setups.view.card.status.active': 'Stable',
  'setups.view.card.status.monitor': 'Monitor',
  'setups.view.card.status.review': 'Review',
  'setups.view.date.days-ago': '{count}',

  'trade-import.restore.complete':
    'Restored {written} imported trades; {failed} failed.',
  'trade-import.restore.broker-label': 'Backend restore',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Sincronización de operaciones',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'Sync trades from MetaTrader reports uploaded through your FTP connection.',
  'trade-sync.source.trade-import.description':
    'Restore broker-file imports across vaults and recover missing local trade notes.',
  'trade-sync.source.tradovate.description':
    'Synchronize Tradovate trades in the cloud and project them into this vault.',
  'trade-sync.tradovate.status-failed': 'Unable to load Tradovate status.',
  'trade-sync.tradovate.last-sync': 'Last sync',
  'trade-sync.tradovate.last-projection': 'Last projection',
  'trade-sync.tradovate.pending-projections': '{count} pending projection(s)',
  'trade-sync.tradovate.pending-acks': '{count} ACK(s) locales pendientes',
  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    'Sincroniza las operaciones de Rithmic en la nube y proyéctalas en esta bóveda.',
  'trade-sync.rithmic.plugin-sync-description':
    'Conecta Rithmic en Journalit.co y sincroniza aquí para escribir tu actividad más reciente de Rithmic en esta bóveda.',
  'trade-sync.rithmic.status-failed': 'No se pudo cargar el estado de Rithmic.',
  'trade-sync.rithmic.status.connecting': 'Conectando',
  'trade-sync.rithmic.status.paused': 'En pausa',
  'trade-sync.rithmic.status.waiting-for-accounts': 'Esperando cuentas',
  'trade-sync.rithmic.status.reauthorization-required':
    'Se requiere reautorización en Journalit.co',
  'trade-sync.rithmic.status.error': 'Error de conexión',
  'trade-sync.rithmic.no-connections':
    'Conecta una cuenta de Rithmic en Journalit.co para sincronizarla aquí.',
  'trade-sync.rithmic.connect': 'Conectar',
  'trade-sync.rithmic.manage': 'Gestionar en Journalit.co',
  'trade-sync.rithmic.system': 'Sistema Rithmic',
  'trade-sync.rithmic.accounts': 'Cuentas',
  'trade-sync.rithmic.last-sync': 'Última sincronización',
  'trade-sync.rithmic.never': 'Nunca',
  'trade-sync.rithmic.job.running': 'Sincronización en curso…',
  'trade-sync.rithmic.job.last': 'Último trabajo: {status}',
  'trade-sync.job.status.queued': 'En cola',
  'trade-sync.job.status.running': 'En ejecución',
  'trade-sync.job.status.succeeded': 'Completado',
  'trade-sync.job.status.partial': 'Parcial',
  'trade-sync.job.status.failed': 'Fallido',
  'trade-sync.job.status.cancelled': 'Cancelado',
  'trade-sync.job.status.unknown': 'Desconocido',
  'trade-sync.rithmic.sync-to-vault': 'Sincronizar',
  'trade-sync.rithmic.syncing': 'Sincronizando…',
  'trade-sync.rithmic.mapping-required':
    'Elige una cuenta local de la bóveda para cada cuenta de Rithmic sincronizada.',
  'trade-sync.rithmic.sync-complete-connection':
    'Sincronización de {connection} completada.',
  'trade-sync.rithmic.sync-partial-connection':
    'Sincronización de {connection} completada con incidencias.',
  'trade-sync.rithmic.sync-all': 'Sincronizar todo',
  'trade-sync.rithmic.sync-all-complete':
    'Se sincronizaron {succeeded} de {total} conexiones de Rithmic.',
  'trade-sync.rithmic.sync-all-partial':
    'Se sincronizaron {succeeded} de {total} conexiones de Rithmic. Revisa las conexiones con problemas.',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic solo permite una sesión activa. Cierra R|Trader, NinjaTrader o cualquier otra plataforma que use este acceso de Rithmic.',
  'trade-sync.rithmic.error.auto-retry':
    'Journalit lo reintenta automáticamente.',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic rechazó las credenciales guardadas. Actualízalas en Journalit.co e inténtalo de nuevo.',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic exige firmar los acuerdos de datos de mercado en R|Trader. Fírmalos e inténtalo de nuevo.',
  'trade-sync.rithmic.error.disabled':
    'La sincronización de Rithmic está desactivada para esta conexión. Gestiónala en Journalit.co.',
  'trade-sync.rithmic.error.sync-failed':
    'La sincronización de Rithmic falló. Revisa la conexión en Journalit.co e inténtalo de nuevo.',
  'trade-sync.broker.mapping-unsaved-hint':
    'La asignación se guarda al sincronizar.',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    'Cambios de cuenta sin guardar. Sincroniza esa conexión para guardarlos.',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    'Elige primero una cuenta de Journalit para cada cuenta que sincronices.',
  'trade-sync.broker.sync-all-blocked.running-job':
    'Ya hay una sincronización en curso.',
  'trade-sync.broker.sync-all-blocked.not-ready':
    'Ninguna conexión está lista para sincronizar.',
  'trade-sync.rithmic.connect-another': 'Conectar otra cuenta de Rithmic',
  'trade-sync.rithmic.error.sync-failed-detail':
    'La sincronización de Rithmic falló: {message}',
  'trade-sync.tradovate.never': 'Never',

  'trade-sync.import.card.inventory-summary':
    '{accounts} account(s) · {trades} trade(s)',
  'trade-sync.import.action.check': 'Check',
  'trade-sync.import.more-actions': 'Más acciones',

  'trade-sync.import.action.open-import': 'Open Trade Import',

  'trade-sync.import.action.create-local-account': 'Crear cuenta',

  'trade-sync.import.action.restore-account': 'Restore',
  'trade-sync.import.action.restoring': 'Restoring…',

  'trade-sync.import.pending-acks': '{count} pending ACK(s)',

  'trade-sync.import.empty-accounts':
    'No backed-up Trade Import accounts found yet.',
  'trade-sync.import.account.restorable-count': '{count} restorable',
  'trade-sync.import.account.synced-count': '{count} synced',
  'trade-sync.import.account.missing-count': '{count} missing',
  'trade-sync.import.account.issue-count': '{count} issue(s)',
  'notice.error.canonical-trade-type-change':
    'Los trades sincronizados con el bróker no pueden cambiarse a otro tipo de trade.',
  'trade-sync.import.account.conflict-repair':
    'Se encontraron notas con canonicalTradeId duplicado. Conserva una nota y elimina canonicalTradeId de la duplicada o elimina esa nota. Cambiar el nombre del archivo no resuelve el conflicto.',
  'trade-sync.import.account.local-account': 'Cuenta de Journalit',
  'trade-sync.import.notice.restored': 'Restored {count} imported trade(s).',

  'trade-sync.import.notice.sync-cloud-failed':
    'Unable to start cloud synchronization.',
  'trade-sync.import.notice.load-failed':
    'Could not load Trade Import sync status.',
  'trade-sync.import.notice.mapping-failed':
    'Could not save Trade Import account mapping.',
  'trade-sync.import.notice.create-account-failed':
    'Could not create local account.',
  'trade-sync.import.notice.restore-failed':
    'Could not restore Trade Import account.',
  'trade-sync.rate-limit.action.mapping': 'Asignación de cuenta',
  'trade-sync.import.notice.rate-limited':
    '{action}: Demasiadas solicitudes. Inténtalo de nuevo en {seconds} s.',
  'setups.view.loading': 'Loading setups…',
  'settings.general.copy-trading-pnl-toggled': 'Copy trading PnL is {status}',
  'setups.view.trade.unknown-instrument': 'Unknown instrument',
  'command.open-session-mode': 'Abrir sesión en vivo',
  'view.session-mode': 'Sesión en vivo',
  'widget.session-log.name': 'Registro de sesión',
  'widget.session-log.description':
    'Captura notas de ejecución con marca de tiempo y eventos de trades.',
  'session-log.title': 'Registro de sesión en vivo',
  'session-log.description':
    'Captura lo que ocurrió durante la sesión de trading actual.',
  'session-log.notice.invalid-timestamp':
    'Introduce una marca de tiempo válida para el registro de sesión.',
  'session-log.action.auto-time': 'Hora automática',
  'session-log.action.set-time': 'Definir hora',

  'session-log.composer.tag-label': 'Etiqueta del registro de sesión',
  'session-log.placeholder.entry-short': 'Añadir nota de sesión...',
  'session-log.action.add-entry': 'Agregar entrada con marca de tiempo',
  'session-log.action.add-note': 'Añadir',
  'session-log.action.hide-composer': 'Ocultar compositor',
  'session-log.filter.all': 'Todo',
  'session-log.filter.label': 'Filtrar registro de sesión',
  'session-log.filter.clear': 'Borrar filtro',
  'session-log.timeline.most-recent': 'Más reciente',
  'session-log.timeline.start': 'Inicio de sesión',
  'session-log.empty': 'Aún no hay entradas en el registro de sesión.',
  'session-log.empty-filtered':
    'No hay entradas que coincidan con este filtro.',
  'session-log.loading': 'Cargando registro de sesión…',
  'session-log.lessons.title': 'Lessons learned',

  'session-log.lessons.badge': 'LSN',
  'session-log.session-group.outside': 'Fuera de sesiones',

  'session-log.trade.entered': 'Entrada',
  'session-log.trade.exited': 'Salida',
  'session-log.trade.size': 'tamaño',

  'session-log.status.unclassified': 'unclassified',
  'session-log.action.save': 'Guardar',
  'session-log.action.cancel': 'Cancelar',

  'session-log.action.classify': 'Classify',
  'session-log.action.edit': 'Editar',
  'session-log.action.delete': 'Eliminar',
  'session-log.action.open-trade': 'Abrir trade',
  'session-log.preview':
    'Vista previa del registro de sesión: las notas con marca de tiempo y los eventos de trades aparecerán aquí durante la sesión en vivo.',
  'session-log.alert.tag-concentration':
    '{tag} representa el {percentage}% de las notas de sesión ({count}/{total}). Revísalo por posible desviación antes de continuar.',

  'session-mode.loading': 'Cargando modo sesión',

  'session-mode.section.timeline': 'Cronología',
  'session-mode.title.ended': 'Sesión finalizada',

  'session-mode.title.break': 'Pausa de sesión',
  'session-mode.title.live': 'Sesión en vivo',
  'session-mode.title.preparation': 'Preparación de sesión',

  'session-mode.prep.resources': 'Recursos',

  'session-mode.action.open-drc-for-date': 'Abrir DRC de {date}',
  'session-mode.ended.helper': 'Registra tus operaciones o revisa el día.',
  'session-mode.ended.action.import-trades': 'Importar operaciones',
  'session-mode.ended.action.add-trade-manually':
    'Añadir operación manualmente',
  'session-mode.ended.action.open-drc': 'Abrir DRC',
  'session-log.session-group.unplanned': 'No planificada @ {time}',
  'session-mode.unplanned.name': 'Sesión no planificada',
  'session-mode.unplanned.start': 'Iniciar sesión no planificada',
  'session-mode.unplanned.stop': 'Detener sesión',
  'session-mode.unplanned.badge': 'No planificada',
  'session-mode.unplanned.status.live':
    'Iniciada a las {time} · {elapsed} transcurridos',
  'session-mode.unplanned.ended.summary':
    'Sesión no planificada · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': 'Iniciar una sesión no planificada',
  'session-mode.unplanned.modal.description':
    'Estás fuera de tus ventanas de sesión planificadas. Esta sesión se marcará como no planificada en tu revisión diaria. Escribe por qué estás operando ahora.',
  'session-mode.unplanned.modal.reason-label': 'Motivo',
  'session-mode.unplanned.modal.reason-placeholder':
    'p. ej. FOMC a las 14:00, me perdí la sesión de la mañana',
  'session-mode.unplanned.modal.reason-required':
    'Indica un motivo antes de empezar.',
  'session-mode.unplanned.notice.started': 'Sesión no planificada iniciada.',
  'session-mode.unplanned.notice.stopped': 'Sesión no planificada detenida.',
  'session-mode.unplanned.notice.blocked-live': 'Ya hay una sesión en curso.',
  'session-mode.unplanned.notice.none-running':
    'No hay ninguna sesión no planificada en curso.',
  'session-mode.unplanned.notice.failed':
    'No se pudo actualizar la sesión no planificada. Consulta la consola para más detalles.',
  'session-mode.ended.stat.trades': 'Operaciones',
  'session-mode.ended.stat.notes': 'Notas',
  'session-mode.ended.stat.gate-checks': 'Revisiones de gate',
  'session-mode.waiting.next-session': 'Próxima sesión',
  'session-mode.waiting.starts-at': '{session} comienza a las {time}',
  'session-mode.waiting.preparation-opens-in':
    'La preparación se abre en {remaining}',
  'session-mode.waiting.open-drc': 'Abrir DRC',

  'session-mode.break.reset-before': 'Reinicia antes de {session}',
  'session-mode.break.reset': 'Reinicia antes de la próxima sesión',
  'session-mode.break.next-session-meta':
    'La próxima sesión empieza a las {time} · quedan {remaining}',
  'session-mode.break.description':
    'Aléjate, hidrátate y despeja la mente antes de la próxima sesión.',
  'session-mode.break.open-drc': 'Abrir DRC',
  'session-mode.countdown.starts-in': 'Empieza en',
  'session-mode.countdown.starts-at': '{session} empieza a las {time}',
  'session-mode.countdown.hours': 'h',
  'session-mode.countdown.minutes': 'min',
  'session-mode.countdown.seconds': 'seg',
  'session-mode.phase.preparation': 'Preparación',
  'session-mode.phase.live': 'En vivo',
  'session-mode.phase.waiting': 'En espera',
  'session-mode.phase.break': 'Descanso',
  'session-mode.phase.ended': 'Finalizada',
  'session-mode.phase.unconfigured': 'Horario de sesión no configurado',
  'session-mode.status.preparation':
    '{session} empieza a las {time}. Tienes {remaining} para prepararte.',
  'session-mode.status.preparation-generic':
    'Prepárate para la próxima sesión de trading en vivo.',
  'session-mode.status.waiting':
    '{session} empieza a las {time}. La preparación empieza en {remaining}.',
  'session-mode.status.waiting-generic':
    'Tu próxima sesión está programada, pero la preparación aún no ha empezado.',
  'session-mode.status.live': 'Quedan {remaining} en esta sesión.',
  'session-mode.status.live-generic': 'Tu sesión de trading está en vivo.',
  'session-mode.status.break':
    '{session} empieza a las {time}. Estás en descanso durante {remaining}.',
  'session-mode.status.break-generic': 'Estás entre sesiones de trading.',
  'session-mode.status.ended':
    'Tus sesiones de trading configuradas han terminado por ahora.',
  'session-mode.status.unconfigured':
    'Configura ventanas de sesión para activar las fases de preparación, en vivo, descanso y finalización. La cronología sigue disponible para el DRC de hoy.',

  'session-mode.unconfigured.title': 'Define tus horarios de trading',
  'session-mode.unconfigured.description':
    'Agrega los horarios en los que realmente operas para que el Modo sesión cambie automáticamente entre preparación, en vivo, descanso y finalizada.',
  'session-mode.unconfigured.step.window.title': 'Add a session window',

  'session-mode.unconfigured.step.prep.title': 'Review preparation timing',

  'session-mode.unconfigured.step.gate.title': 'Use the Starter Trade Gate',

  'session-mode.unconfigured.step.log.title': 'Log notes during live sessions',

  'session-mode.unconfigured.action': 'Configurar Modo sesión',
  'session-mode.guide.why.title': 'Opera tu plan, no tu estado de ánimo',
  'session-mode.guide.why.description':
    'El modo sesión te prepara antes de cada sesión, te hace cumplir tus reglas con un Trade Gate mientras está en curso y guarda un registro con marcas de tiempo para revivir el día. Se configura en dos minutos.',
  'session-mode.guide.configure.title': 'Configúralo ahora',
  'session-mode.guide.configure.description':
    'Añade tus horarios de sesión y crea tu primer Trade Gate. Una guía breve te acompañará en Ajustes.',
  'session-mode.guide.preparation.countdown.title':
    'Tu sesión está por empezar',
  'session-mode.guide.preparation.countdown.description':
    'Esta es la fase de preparación. La cuenta atrás muestra cuándo pasas a en curso, y esta página cambia sola al modo en curso.',
  'session-mode.guide.preparation.goals.title': 'Fija los objetivos de hoy',
  'session-mode.guide.preparation.goals.description':
    'Escribe cómo sería una buena sesión antes de la apertura, para tener algo a lo que atenerte.',
  'session-mode.guide.preparation.checklist.title':
    'Repasa tu lista de comprobación',
  'session-mode.guide.preparation.checklist.description':
    'Marca aquí tu rutina previa a la sesión. Todo lo que marques se guarda en la nota de revisión de hoy.',
  'session-mode.guide.preparation.next.title': 'Cuando pases a en curso',
  'session-mode.guide.preparation.next.description':
    'Tu Trade Gate y el registro de sesión aparecerán aquí. Te los mostraremos la primera vez.',
  'session-mode.guide.live.trade-gate.title':
    'Pasa por el Trade Gate antes de cada operación',
  'session-mode.guide.live.trade-gate.description':
    'Pulsa Iniciar y responde las preguntas creadas a partir de tus criterios. El gate termina en luz verde, esperar o no operar, así solo tomas las operaciones que tu sistema permite.',
  'session-mode.guide.live.session-log.title': 'Registra lo que ves y sientes',
  'session-mode.guide.live.session-log.description':
    'Anota setups, emociones y decisiones según ocurren. Cada nota lleva marca de tiempo, para que luego puedas revivir exactamente lo que pasaba.',
  'session-mode.guide.live.settings.title': 'Ajústalo cuando quieras',
  'session-mode.guide.live.settings.description':
    'Editar abre los ajustes del modo sesión: horarios, diseño por fase, flujos de Trade Gate y etiquetas del registro.',
  'session-mode.guide.ended.review.title': 'Ahora revisa la sesión',
  'session-mode.guide.ended.review.description':
    'Abre el DRC de hoy para revisar. Añade el widget de registro de sesión a tu diseño de DRC y cada nota con marca de tiempo aparecerá allí.',
  'settings.session-mode.guide.setting-name': 'Guía',
  'settings.session-mode.guide.setting-desc':
    'Un recorrido breve por estos ajustes, desde los horarios hasta tu primer Trade Gate.',
  'settings.session-mode.guide.replay': 'Mostrar guía',
  'settings.session-mode.guide.intro.title': 'Configuremos el modo sesión',
  'settings.session-mode.guide.intro.description':
    'Cuatro cosas: cuándo son tus sesiones, qué muestra cada fase, tu Trade Gate y las etiquetas del registro.',
  'settings.session-mode.guide.lead-time.title': 'Antelación de la preparación',
  'settings.session-mode.guide.lead-time.description':
    'Cuántos minutos antes de una sesión se abre la fase de preparación.',
  'settings.session-mode.guide.windows.title': 'Añade tus ventanas de sesión',
  'settings.session-mode.guide.windows.description':
    'Una ventana por cada sesión que operas, con nombre, inicio y fin. Así el modo sesión sabe cuándo preparar y cuándo estás en curso.',
  'settings.session-mode.guide.layout.title': 'Elige qué muestra cada fase',
  'settings.session-mode.guide.layout.description':
    'Activa o desactiva módulos por fase: recursos, objetivos y lista para la preparación; Trade Gate y línea de tiempo en curso.',
  'settings.session-mode.guide.trade-gate.title': 'Crea tu Trade Gate',
  'settings.session-mode.guide.trade-gate.description':
    'Añadir crea la primera vez un flujo inicial con preguntas habituales, y después uno vacío; la biblioteca tiene preguntas listas. Cada pregunta lleva a la siguiente o a un resultado: luz verde, esperar o no operar.',
  'settings.session-mode.guide.editor.title': 'Preguntas y resultados',
  'settings.session-mode.guide.editor.description':
    'Despliega un flujo para añadir preguntas y decidir adónde lleva cada respuesta. El botón de reproducir lo ejecuta tal como lo verás en la sesión.',
  'settings.session-mode.guide.tags.title': 'Etiquetas para tu registro',
  'settings.session-mode.guide.tags.description':
    'Etiqueta las notas al registrarlas, por ejemplo por emoción o setup, para filtrarlas en tu revisión.',
  'settings.session-mode.guide.finish.title': 'Todo listo',
  'settings.session-mode.guide.finish.description':
    'Abre el modo sesión desde la barra o Inicio. Añade el widget de registro de sesión a tu DRC para ver tus notas en cada revisión.',

  'session-mode.layout.empty.title': 'Nothing enabled for this phase',
  'session-mode.layout.empty.description':
    'Turn modules back on to build this Session Mode phase.',
  'session-mode.duration.minutes': '{minutes}m',
  'session-mode.duration.hours': '{hours}h',
  'session-mode.duration.hours-minutes': '{hours}h {minutes}m',
  'settings.session-mode.title': 'Sesión en vivo',
  'settings.session-mode.description':
    'Configura ventanas de sesión, preparación, diseño de fases, flujos de Trade Gate y etiquetas del registro de sesión.',
  'settings.session-mode.preparation-lead-time':
    'Tiempo de preparación (minutos)',
  'settings.session-mode.preparation-lead-time-desc':
    'Cuánto antes empieza el modo preparación antes de una sesión.',
  'settings.session-mode.windows': 'Ventanas de sesión',

  'settings.session-mode.add-window-short': 'Agregar',
  'settings.session-mode.no-windows':
    'Aún no hay ventanas de sesión configuradas. La cronología en vivo sigue funcionando, pero la preparación por fases empieza después de agregar una ventana.',
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
  'settings.session-mode.linked-resources': 'Recursos enlazados',
  'settings.session-mode.linked-resources-desc':
    'Muestra enlaces rápidos a notas durante la preparación.',
  'settings.session-mode.linked-resources-count': '{count} linked',
  'settings.session-mode.linked-resources-hide': 'Hide linked',
  'settings.session-mode.session-log': 'Registro de sesión',
  'settings.session-mode.session-log-desc':
    'Elige qué eventos automáticos aparecen junto a tus notas de sesión.',
  'settings.session-mode.show-trade-executions':
    'Entradas y salidas de operaciones',
  'settings.session-mode.show-trade-executions-desc':
    'Mostrar entradas y salidas de operaciones en los registros del Modo sesión y la Revisión diaria.',
  'settings.session-mode.session-log-tags': 'Etiquetas del registro de sesión',
  'settings.session-mode.session-log-tags-desc':
    'Personaliza las etiquetas disponibles en el compositor de Modo sesión y en el registro de sesión DRC.',
  'settings.session-mode.tag-label-placeholder': 'Nombre de etiqueta',
  'settings.session-mode.tag-short-label-placeholder': 'Etiqueta corta',
  'settings.session-mode.tag-label-example': 'Trade',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Color de etiqueta',
  'settings.session-mode.tag-requires-resolution': 'Requiere resolución',
  'settings.session-mode.tag-lesson': 'Etiqueta de lección',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Las entradas con esta etiqueta se marcan como elementos de seguimiento hasta que las resuelvas en el registro de sesión. Úsala para notas que necesitan revisión o acción después de la sesión.',
  'settings.session-mode.tag-lesson-tooltip':
    'Marca esta etiqueta como una entrada de aprendizaje. Las notas con etiqueta de lección pueden aparecer como lecciones y se destacan como momentos de aprendizaje en los flujos del registro de sesión.',
  'settings.session-mode.add-session-log-tag':
    'Añadir etiqueta del registro de sesión',
  'settings.session-mode.reset-session-log-tags':
    'Restablecer etiquetas del registro de sesión',
  'settings.session-mode.tag-color.blue': 'Azul',
  'settings.session-mode.tag-color.indigo': 'Índigo',
  'settings.session-mode.tag-color.purple': 'Morado',
  'settings.session-mode.tag-color.green': 'Verde',
  'settings.session-mode.tag-color.pink': 'Rosa',
  'settings.session-mode.tag-color.amber': 'Ámbar',
  'settings.session-mode.tag-color.red': 'Rojo',
  'settings.session-mode.tag-color.orange': 'Naranja',

  'settings.session-mode.search-resource-placeholder':
    'Buscar archivos del vault para enlazar…',

  'settings.session-mode.window-name': 'Nombre de sesión',
  'settings.session-mode.window-name-placeholder': 'p. ej. NY AM',

  'settings.session-mode.start-time': 'Hora de inicio',
  'settings.session-mode.end-time': 'Hora de fin',

  'trade-gate.workflow': 'Flujo',

  'trade-gate.action.start-short': 'Start',
  'trade-gate.action.start-another': 'Iniciar otra',
  'trade-gate.outcome.green-light': 'Luz verde',
  'trade-gate.outcome.green-light-description': 'Condiciones cumplidas.',
  'trade-gate.outcome.no-trade': 'No operar',
  'trade-gate.outcome.no-trade-description': 'Las condiciones no se cumplen.',
  'trade-gate.outcome.wait': 'Esperar',
  'trade-gate.outcome.wait-description':
    'El setup no está listo. Espera la próxima oportunidad.',
  'settings.session-mode.trade-gate.title': 'Flujos de Trade Gate',
  'settings.session-mode.trade-gate.desc':
    'Crea flujos de decisión IF/THEN para comprobaciones de entrada en vivo.',
  'settings.session-mode.trade-gate.delete-workflow.title':
    '¿Eliminar el flujo Trade Gate?',
  'settings.session-mode.trade-gate.delete-workflow.message':
    '¿Eliminar «{name}»? Esto elimina todas las preguntas y ramas de este flujo. Esta acción no se puede deshacer.',
  'settings.session-mode.trade-gate.delete-workflow.confirm': 'Eliminar flujo',
  'settings.session-mode.trade-gate.name': 'Nombre del flujo',
  'settings.session-mode.trade-gate.edit-question': 'Editar pregunta',
  'settings.session-mode.trade-gate.no-options':
    'Agrega opciones de respuesta para esta pregunta.',
  'settings.session-mode.trade-gate.not-wired': 'Aún no está conectada',
  'settings.session-mode.trade-gate.not-wired-hint': 'Haz clic para conectar',
  'settings.session-mode.trade-gate.target-group-questions': 'Preguntas',
  'settings.session-mode.trade-gate.target-current': 'Actual: {title}',
  'settings.session-mode.trade-gate.target-group-outcomes': 'Resultados',
  'settings.session-mode.trade-gate.new-question-target': '+ Nueva pregunta',
  'settings.session-mode.trade-gate.outcome-note':
    'Nota del resultado (solo en esta rama)',
  'settings.session-mode.trade-gate.remove-from-workflow':
    'Eliminar de este flujo',
  'settings.session-mode.trade-gate.used-in-workflows':
    'Usada en flujos: {count}',
  'settings.session-mode.trade-gate.not-used': 'Aún no se usa',
  'settings.session-mode.trade-gate.question-count': 'Preguntas: {count}',
  'settings.session-mode.trade-gate.library-title': 'Biblioteca de preguntas',
  'settings.session-mode.trade-gate.library-search': 'Buscar preguntas...',
  'settings.session-mode.trade-gate.library-empty':
    'No se encontraron preguntas. Crea una para empezar.',
  'settings.session-mode.trade-gate.delete-question.title':
    '¿Eliminar pregunta?',
  'settings.session-mode.trade-gate.delete-question.message':
    '¿Eliminar «{name}» de la biblioteca de preguntas? Esta acción no se puede deshacer.',
  'settings.session-mode.trade-gate.delete-question.message-used':
    '¿Eliminar «{name}» de la biblioteca de preguntas? Se usa en: {workflows}. Sus ramas se eliminarán de esos flujos. Esta acción no se puede deshacer.',
  'settings.session-mode.trade-gate.delete-question.confirm':
    'Eliminar pregunta',
  'settings.session-mode.trade-gate.unplaced-title':
    'En este flujo, aún no conectadas',
  'settings.session-mode.trade-gate.no-start':
    'Elige una pregunta inicial para ver el flujo.',
  'settings.session-mode.trade-gate.untitled': 'Flujo sin título',
  'settings.session-mode.trade-gate.start-node': 'Pregunta inicial',
  'settings.session-mode.trade-gate.simulation.show': 'Simular',
  'settings.session-mode.trade-gate.simulation.unavailable':
    'Conecta la pregunta inicial con al menos un resultado completo antes de iniciar la simulación.',
  'settings.session-mode.trade-gate.add-question': 'Agregar pregunta',
  'settings.session-mode.trade-gate.question': 'Pregunta',
  'settings.session-mode.trade-gate.new-question-title': 'Nueva pregunta',
  'settings.session-mode.trade-gate.question-title': 'Título de la pregunta',
  'settings.session-mode.trade-gate.prompt': 'Prompt',
  'settings.session-mode.trade-gate.options': 'Opciones',
  'settings.session-mode.trade-gate.option': 'Opción',
  'settings.session-mode.trade-gate.option-label': 'Etiqueta de opción',
  'settings.session-mode.trade-gate.option-target': 'Conduce a',
  'settings.session-mode.trade-gate.flow-map': 'Mapa de flujo',
  'settings.session-mode.trade-gate.flow-fit': 'Ajustar',
  'settings.session-mode.trade-gate.flow-click-hint':
    'Haz clic en un nodo o etiqueta de ruta para editarlo.',
  'settings.session-mode.trade-gate.flow-truncated':
    'Este flujo es demasiado grande para mostrarse por completo. Algunas ramas repetidas están ocultas.',
  'settings.session-mode.trade-gate.no-questions':
    'Agrega la primera pregunta para iniciar este flujo.',

  'validation.setup-resolution-failed':
    'No se pudo resolver el setup seleccionado.',
  'home.quick-links.setups': 'Setups',
  'setups.view.error.title': 'No se pudieron cargar los setups',
  'setups.view.error.load-failed': 'No se pudieron cargar los datos de setups.',
  'setups.view.action.retry': 'Reintentar',

  'setups.view.action.create': 'Crear setup',
  'setups.view.action.new': 'Nuevo setup',
  'setups.view.action.compare-selected': 'Comparar setups seleccionados',
  'setups.view.tabs.aria': 'Pestañas de la vista de setups',
  'setups.view.tab.overview': 'Resumen',
  'setups.view.tab.compare': 'Comparar',
  'setups.view.card.select-for-compare': 'Seleccionar setup para comparar',

  'setups.view.compare.title': 'Comparar setups',

  'setups.view.compare.empty': 'Selecciona dos setups para compararlos.',
  'setups.view.compare.metrics-title': 'Métricas de comparación',
  'setups.view.compare.metric': 'Métrica',
  'setups.view.compare.edge-column': 'Ventaja',
  'setups.view.compare.edge-label': 'Ganador',

  'setups.view.compare.no-clear-edge': 'Sin ventaja clara',
  'setups.view.compare.expectancy-edge': 'Ventaja de expectativa',
  'setups.view.compare.confidence': 'Confianza',
  'setups.view.compare.sample': 'Muestra',
  'setups.view.compare.confidence.high': 'Alta',
  'setups.view.compare.confidence.moderate': 'Moderada',
  'setups.view.compare.confidence.low': 'Baja',
  'setups.view.compare.edge-strength.strong': 'Ventaja sólida',
  'setups.view.compare.edge-strength.clear': 'Ventaja clara',
  'setups.view.compare.edge-strength.slight': 'Ventaja leve',
  'setups.view.compare.edge-reasons-privacy':
    'Los detalles de la ventaja están ocultos mientras el modo de privacidad está activado.',
  'setups.view.compare.reason.higher.net-pnl': 'PnL neto superior',
  'setups.view.compare.reason.lower.net-pnl': 'PnL neto inferior',
  'setups.view.compare.reason.similar.net-pnl': 'PnL neto similar',
  'setups.view.compare.reason.higher.win-rate': 'Tasa de acierto superior',
  'setups.view.compare.reason.lower.win-rate': 'Tasa de acierto inferior',
  'setups.view.compare.reason.similar.win-rate': 'Tasa de acierto similar',
  'setups.view.compare.reason.higher.expectancy': 'Expectativa superior',
  'setups.view.compare.reason.lower.expectancy': 'Expectativa inferior',
  'setups.view.compare.reason.similar.expectancy': 'Expectativa similar',
  'setups.view.compare.reason.higher.profit-factor':
    'Factor de beneficio superior',
  'setups.view.compare.reason.lower.profit-factor':
    'Factor de beneficio inferior',
  'setups.view.compare.reason.similar.profit-factor':
    'Factor de beneficio similar',

  'setups.view.compare.cumulative-title': 'Rendimiento acumulado',
  'setups.view.compare.cumulative-privacy':
    'El rendimiento acumulado está oculto mientras el modo de privacidad está activado.',
  'setups.view.compare.cumulative-empty':
    'No hay datos acumulados de trades para los setups seleccionados.',

  'setups.view.title': 'Setups',

  'setups.view.summary.aria': 'Resumen general de setups',

  'setups.view.summary.needs-review': 'Requiere revisión',
  'setups.view.summary.best-performer': 'Mejor rendimiento',

  'setups.view.ranking.metric-aria': 'Métrica de rendimiento',
  'setups.view.ranking.privacy':
    'Los valores de rendimiento están ocultos mientras el modo de privacidad está activado.',
  'setups.view.ranking.empty': 'Aún no hay datos de rendimiento de setups.',

  'setups.view.metric.trade-count': 'Cantidad de trades',
  'setups.view.metric.trades': 'trades',
  'setups.view.metric.net-pnl': 'PnL total',
  'setups.view.metric.total-pnl': 'PnL total',
  'setups.view.metric.win-rate': 'Tasa de acierto',
  'setups.view.metric.profit-factor': 'Factor de beneficio',
  'setups.view.metric.last-traded': 'Última operación',
  'setups.view.metric.expected-value': 'Valor esperado',

  'setups.view.status.active': 'Activo',
  'setups.view.status.testing': 'En prueba',
  'setups.view.status.archived': 'Archivado',

  'setups.view.empty.no-setups':
    'Aún no hay setups. Crea tu primer setup para empezar a seguir tus playbooks.',

  'setups.view.detail.back': 'Volver',

  'setups.view.detail.action.edit': 'Editar setup',
  'setups.view.detail.action.view-trades': 'Ver en el registro de trades',

  'setups.view.detail.playbook': 'Playbook',

  'setups.view.detail.rules': 'Reglas',

  'setups.view.detail.rule.required': 'Obligatoria',

  'setups.view.detail.no-linked-notes': 'Aún no hay notas vinculadas.',

  'setups.view.detail.performance.cumulative-pnl': 'PnL acumulado',
  'setups.view.detail.performance.cumulative-r': 'R acumulado',
  'setups.view.detail.performance.empty': 'Aún no hay trades vinculados.',

  'setups.view.detail.brief.health': 'Estado del setup',
  'setups.view.detail.brief.profile': 'Perfil',
  'setups.view.detail.brief.linked-notes-modal.title': 'Notas vinculadas',
  'setups.view.detail.brief.view-all': 'Ver todo',
  'setups.view.detail.brief.status.complete': 'Completo',
  'setups.view.detail.brief.status.missing': 'Pendiente',
  'setups.view.detail.brief.health.playbook': 'Playbook',
  'setups.view.detail.brief.health.rules': 'Reglas',
  'setups.view.detail.brief.health.notes': 'Notas',
  'setups.view.detail.brief.health.screenshots': 'Capturas de pantalla',
  'setups.view.detail.brief.health.trades': 'Trades',

  'setups.view.detail.brief.profile.direction': 'Dirección',
  'setups.view.detail.brief.profile.sessions': 'Sesiones',
  'setups.view.detail.brief.profile.timeframes': 'Marcos temporales',
  'setups.view.detail.brief.profile.tickers': 'Tickers',
  'setups.view.detail.brief.direction.long': 'Largo',
  'setups.view.detail.brief.direction.short': 'Corto',
  'setups.view.detail.brief.direction.both': 'Ambos',
  'setups.view.completeness.incomplete-playbook': 'Playbook incompleto',
  'setups.view.completeness.no-rules': 'Sin reglas',
  'setups.view.completeness.no-linked-notes': 'Sin notas vinculadas',
  'setups.view.date.never': 'Nunca',
  'setups.view.metric.expectancy-r': 'Expectativa (R)',

  'setups.view.card.sparkline-aria': 'Minigráfico del setup',
  'setups.view.date.today': 'Hoy',
  'setups.view.date.yesterday': 'Ayer',
  'filter.modal.image.annotation-status': 'Estado de anotación',
  'filter.modal.image.status.tagged': 'Etiquetadas',
  'filter.modal.image.status.untagged': 'Sin etiquetas',
  'filter.modal.image.status.has-notes': 'Con notas',
  'filter.modal.image.status.no-notes': 'Sin notas',
  'filter.modal.image.tags': 'Etiquetas multimedia',
  'setups.view.detail.action.gallery': 'Abrir galería',
  'tradelog.mode.label': 'Modo del registro de trades',
  'tradelog.mode.trades': 'Trades',
  'tradelog.mode.image-gallery': 'Galería',

  'imageGallery.empty.error.title': 'La galería no está disponible',
  'imageGallery.empty.no-images.title': 'Aún no hay contenido multimedia',
  'imageGallery.empty.no-images.description':
    'Las imágenes, GIF, vídeos y enlaces de YouTube adjuntos a trades o notas de revisión aparecerán aquí automáticamente.',
  'imageGallery.empty.no-results.title':
    'Ningún elemento multimedia coincide con estos filtros',
  'imageGallery.empty.no-results.description':
    'Prueba a borrar los filtros activos o ampliar el rango de fechas para volver a ver más elementos de la galería.',
  'imageGallery.empty.no-source.title':
    'No hay contenido multimedia en esta fuente',
  'imageGallery.empty.no-source.description':
    'Esta fuente aún no tiene elementos de la galería. Vuelve a todo el contenido multimedia o elige otra fuente.',
  'imageGallery.empty.action.clear-filters': 'Borrar filtros',
  'imageGallery.empty.action.show-all': 'Mostrar todo el contenido multimedia',
  'imageGallery.error.load-failed': 'No se pudo cargar la galería.',

  'imageGallery.open-source': 'Abrir nota',
  'imageGallery.image-alt': 'Contenido multimedia de {source} del {date}',
  'imageGallery.privacy-blurred': 'Difuminado por privacidad',

  'imageGallery.sort.label': 'Ordenar:',
  'imageGallery.sort.newest': 'Más recientes',
  'imageGallery.sort.oldest': 'Más antiguas',
  'imageGallery.sort.best': 'Mejor P&L',
  'imageGallery.sort.worst': 'Peor P&L',
  'imageGallery.size-aria': 'Tamaño del contenido multimedia de la galería',
  'imageGallery.size.small': 'Pequeño',
  'imageGallery.size.medium': 'Mediano',
  'imageGallery.size.large': 'Grande',
  'imageGallery.view-mode-aria': 'Agrupación de tarjetas de la galería',
  'imageGallery.view-mode.grouped': 'Agrupado',
  'imageGallery.view-mode.individual': 'Individual',
  'imageGallery.group.additional-media':
    '{count} elementos multimedia adicionales',
  'imageGallery.group.annotation-summary':
    '{annotated} de {total} elementos multimedia anotados',
  'imageGallery.group.navigation':
    'Medio {mediaCurrent} de {mediaTotal} · Entrada {groupCurrent} de {groupTotal}',
  'imageGallery.source.label': 'Fuente:',
  'imageGallery.source.all': 'Todo el contenido multimedia',
  'imageGallery.source.trade': 'Trades',
  'imageGallery.source.folder': 'Carpetas',
  'imageGallery.source.reviews': 'Revisiones',
  'imageGallery.source.drc': 'Revisiones diarias',
  'imageGallery.source.weekly': 'Revisiones semanales',
  'imageGallery.source.monthly': 'Revisiones mensuales',
  'imageGallery.source.quarterly': 'Revisiones trimestrales',
  'imageGallery.source.yearly': 'Revisiones anuales',

  'imageGallery.annotation.reviewed': 'Revisada',
  'imageGallery.annotation.unreviewed': 'Sin revisar',
  'imageGallery.date.unknown': 'Fecha desconocida',
  'imageGallery.annotation.tag': 'Etiqueta',

  'imageGallery.annotation.editor-title': 'Anotar contenido multimedia',
  'imageGallery.annotation.editor-title-with-file': 'Anotar {fileName}',
  'imageGallery.annotation.tags': 'Etiquetas',
  'imageGallery.annotation.tags-placeholder': 'Breakout, setup A+, error',
  'imageGallery.annotation.notes': 'Notas',
  'imageGallery.annotation.notes-placeholder':
    '¿Qué debería aprender tu yo futuro de este gráfico?',
  'imageGallery.annotation.error.save-failed':
    'No se pudo guardar la anotación del contenido multimedia.',
  'imageGallery.annotation.error.load-failed':
    'No se pudo cargar la anotación del contenido multimedia.',
  'imageGallery.annotation.saving': 'Guardando...',
  'settings.gallery-folders.section': 'Galería multimedia',
  'settings.gallery-folders.description':
    'Muestra medios de estas carpetas en la galería del registro de operaciones.',
  'settings.gallery-folders.placeholder': 'Elige una carpeta...',
  'settings.gallery-folders.add': 'Añadir',
  'settings.gallery-folders.remove-aria':
    'Eliminar la carpeta de galería {path}',
  'settings.gallery-folders.not-a-folder':
    'Selecciona una carpeta en lugar de un archivo multimedia.',
  'settings.gallery-folders.save-failed':
    'No se pudieron guardar las carpetas de la galería. Inténtalo de nuevo.',
  'tradelog.guide.switch-to-gallery.title': 'Cambia de trades a la Galería',
  'tradelog.guide.switch-to-gallery.description':
    'Usa este selector de modo para moverte entre el Registro de trades normal y la Galería. Haz clic en Galería para continuar el recorrido con tus imágenes, GIF, vídeos y enlaces de YouTube.',

  'tradelog.guide.gallery-grouping.title':
    'Agrupa el contenido multimedia por entrada del diario',
  'tradelog.guide.gallery-grouping.description':
    'Agrupado mantiene cada trade o revisión en una sola tarjeta. Individual muestra cada elemento multimedia adjunto en su propia tarjeta.',
  'tradelog.guide.gallery-source-sort.title':
    'Elige la fuente y el orden del contenido multimedia',
  'tradelog.guide.gallery-source-sort.description':
    'Usa Fuente para enfocarte en todo el contenido multimedia, adjuntos de trades o contenido multimedia de notas de revisión. Usa Ordenar para revisar primero los trades más recientes, antiguos, mejores o peores.',
  'tradelog.guide.gallery-size.title':
    'Ajusta el tamaño de vista previa de la galería',
  'tradelog.guide.gallery-size.description':
    'Usa estos botones de tamaño para alternar entre exploración compacta y vistas previas más grandes sin recortar detalles importantes del gráfico.',
  'tradelog.guide.gallery-filters.title':
    'Filtra la galería desde el mismo punto de entrada',
  'tradelog.guide.gallery-filters.description':
    'El menú de filtros funciona igual aquí. En el modo Galería también incluye una sección Galería con filtros de medios, como el estado de anotación y las etiquetas de medios.',
  'tradelog.guide.gallery-grid.title':
    'Abre el contenido multimedia para revisarlo de cerca',
  'tradelog.guide.gallery-grid.description':
    'Cada tarjeta mantiene el gráfico despejado mientras muestra contexto compacto del trade o revisión. Haz clic en cualquier tarjeta o pulsa Siguiente para abrir el primer elemento visible en pantalla completa.',
  'tradelog.guide.gallery-fullscreen-actions.title':
    'Anota contenido multimedia desde pantalla completa',
  'tradelog.guide.gallery-fullscreen-actions.description':
    'Usa Etiqueta para agregar etiquetas y notas a nivel multimedia mientras el elemento es lo suficientemente grande para inspeccionarlo. Abrir nota te lleva de vuelta al trade o nota de revisión fuente.',
  'tradelog.guide.gallery-open-annotation.title': 'Abre el panel de anotación',
  'tradelog.guide.gallery-open-annotation.description':
    'Haz clic en Etiqueta para anotar este elemento multimedia específico. Las etiquetas y notas multimedia describen el adjunto, no todo el trade.',
  'tradelog.guide.gallery-annotation-panel.title':
    'Agrega etiquetas y notas multimedia',
  'tradelog.guide.gallery-annotation-panel.description':
    'Usa etiquetas multimedia para ideas específicas del gráfico, como barrido de liquidez o ruptura fallida, y notas para el contexto de estructura de mercado que quieres recordar.',
  'tradelog.guide.gallery-finish.title':
    'Ahora conoces ambos modos del Registro de trades',
  'tradelog.guide.gallery-finish.description':
    'Usa Trades cuando necesites la tabla y las herramientas por lotes. Usa la Galería cuando quieras revisar imágenes, GIF, vídeos, enlaces de YouTube y anotaciones en todo tu journal.',
  'filter.menu.whats-new.open.title': 'Los filtros tienen un menú nuevo',
  'filter.menu.whats-new.open.description':
    'Todos los filtros están ahora en un menú por niveles, con dos formas nuevas de acotar tus operaciones. Ábrelo para verlas.',
  'filter.menu.whats-new.exclude.title': 'Excluye lo que no quieres',
  'filter.menu.whats-new.exclude.description':
    'Cada valor tiene un botón ⊘. Al excluir un valor, queda fuera cualquier operación que lo tenga, coincida con lo que coincida.',
  'filter.menu.whats-new.match.title': 'Elige cómo coinciden varios valores',
  'filter.menu.whats-new.match.description':
    'Si eliges varios valores, decide si una operación necesita «Cualquiera de», «Todos de», «Solo estos» o «Exactamente estos». Las etiquetas, las configuraciones, los errores y los campos personalizados tienen esta opción de Coincidencia.',
  'filter.menu.whats-new.phases.title': 'Filtra por fase del desafío',
  'filter.menu.whats-new.phases.description':
    'Las cuentas de fondeo con más de una fase abren una lista de sus fases. Elige fases sueltas en lugar de toda la cuenta.',
  'filter.menu.whats-new.done.title': 'Esto es lo nuevo en los filtros',
  'filter.menu.whats-new.done.description':
    'El mismo menú funciona en el Registro de Operaciones, el Panel, Inicio, Configuraciones y las revisiones. Los cambios se aplican en cuanto haces clic.',
  'tradelog.guide.image-gallery-empty.intro.title':
    'Aún no hay contenido multimedia',
  'tradelog.guide.image-gallery-empty.intro.description':
    'Agrega imágenes, GIF, vídeos o enlaces de YouTube a trades o notas de revisión y aparecerán aquí automáticamente. Cuando exista contenido multimedia, Journalit mostrará la guía completa de la galería para revisión en pantalla completa, etiquetas y notas.',

  'filter.modal.section.image-gallery': 'Galería',
  'filter.modal.session-tags.placeholder': 'Etiquetas de sesión',
  'filter.modal.session-tags.none-found':
    'No se encontraron etiquetas de sesión',
  'account.challenge.toggle.label': 'Desafío de prop firm',
  'account.challenge.toggle.help':
    'Sigue las fases de evaluación, las reglas de la firma y los pagos de esta cuenta.',
  'account.prop-challenge.title': 'Desafío de prop firm',
  'account.prop-challenge.identity': 'Identidad del desafío',
  'account.prop-challenge.prefill.heading-link': 'Rellenar desde tu firma',
  'account.prop-challenge.prefill.updates-link':
    'Mantén al día las reglas de la firma',
  'account.prop-challenge.prefill.updates-link-firm':
    'Mantén al día las reglas de {firm}',
  'account.prop-challenge.prefill.phase-link': 'Rellenar reglas con PRO',
  'account.prop-challenge.prefill.phase-link-firm':
    'Rellenar las reglas de {firm} con PRO',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} +{count} más, reglas rellenadas con PRO',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}, reglas rellenadas con PRO',
  'account.prop-challenge.prefill.match':
    'Tenemos {firm}: {count} desafíos con reglas listas',
  'account.prop-challenge.rules.empty':
    'Aún no hay reglas. Usa Añadir regla para definir esta fase.',
  'account.prop-challenge.rules': 'Reglas',
  'account.prop-challenge.costs.empty': 'Aún no se han añadido costes.',
  'account.prop-challenge.description':
    'Sigue esta cuenta durante un desafío de varias fases.',
  'account.prop-challenge.enable': 'Activar seguimiento del desafío',
  'account.prop-challenge.challenge-name': 'Nombre del desafío',
  'account.prop-challenge.challenge-name-placeholder':
    'p. ej., Evaluación de 25K',
  'account.prop-challenge.firm-name': 'Nombre de la firma (opcional)',
  'account.prop-challenge.firm-name-placeholder': 'p. ej., Apex Trader Funding',
  'account.prop-challenge.profile.title': 'Aplicar reglas de la firma',
  'account.prop-challenge.profile.firm': 'Firma',
  'account.prop-challenge.profile.challenge': 'Desafío',
  'account.prop-challenge.profile.choose-firm': 'Elige una firma',
  'account.prop-challenge.profile.choose-challenge': 'Elige un desafío',
  'account.prop-challenge.profile.custom-firm': 'Otra / firma personalizada',
  'account.prop-challenge.profile.help':
    'Elige tu firma y tu plan para rellenar sus reglas: drawdown, objetivos, pagos. Puedes editarlas después.',
  'account.prop-challenge.profile.current': 'Actual: {identity}',
  'account.prop-challenge.profile.apply': 'Aplicar',
  'account.prop-challenge.profile.loading': 'Cargando reglas de la firma…',
  'account.prop-challenge.profile.refreshing':
    'Buscando actualizaciones de reglas…',
  'account.prop-challenge.profile.unavailable':
    'Las reglas de la firma no están disponibles sin conexión.',

  'account.prop-challenge.profile.confirm-title':
    '¿Reemplazar la configuración del desafío?',
  'account.prop-challenge.profile.confirm-message':
    'Aplicar estas reglas de la firma reemplaza las fases y reglas configuradas actualmente.',
  'account.prop-challenge.current-phase': 'Fase actual',
  'account.prop-challenge.phase-rules': 'Reglas de {phase}',
  'account.prop-challenge.next-phase': 'Siguiente: {phase}',
  'account.prop-challenge.view-phase': 'Ver fase',
  'account.prop-challenge.unnamed-phase': 'Fase sin nombre',
  'account.prop-challenge.phase-name': 'Nombre de la fase',
  'account.prop-challenge.phase-type': 'Tipo de fase',
  'account.prop-challenge.phase-type.evaluation': 'Evaluación',
  'account.prop-challenge.phase-type.verification': 'Verificación',
  'account.prop-challenge.phase-type.sim_funded': 'Financiada simulada',
  'account.prop-challenge.phase-type.live_funded': 'Financiada real',
  'account.prop-challenge.phase-type.custom': 'Personalizada',
  'account.prop-challenge.starting-balance': 'Saldo inicial',
  'account.prop-challenge.broker-account-id': 'Cuentas del bróker',
  'account.prop-challenge.broker-accounts.assigned': 'Asignada a {phase}',
  'account.prop-challenge.broker-accounts.trades': '{count} operaciones',
  'account.prop-challenge.broker-accounts.trade-one': '1 operación',
  'account.prop-challenge.phase-started': 'Inicio',
  'account.prop-challenge.phase-completed': 'Finalización',
  'account.prop-challenge.timeline.completed-before-started':
    'La finalización debe ser posterior o igual al inicio en {phase}.',
  'account.prop-challenge.timeline.out-of-order':
    '{phase} debe terminar antes o cuando empiece {next}.',
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} empieza después de un cambio de reglas posterior. Retrasa el inicio.',
  'account.prop-challenge.default-phase-name': 'Fase {number}',
  'account.prop-challenge.add-phase': 'Añadir fase',
  'account.prop-challenge.remove-phase': 'Eliminar fase',
  'account.prop-challenge.add-rule': 'Añadir regla',
  'account.prop-challenge.rule.enabled': 'Regla activada',
  'account.prop-challenge.rule.amount': 'Importe',
  'account.prop-challenge.rule.target-type': 'Tipo de objetivo',
  'account.prop-challenge.rule.credit-withdrawals':
    'Contar los retiros para el objetivo',
  'account.prop-challenge.rule.drawdown-mode': 'Modo de drawdown',
  'account.prop-challenge.rule.lock-at-balance': 'Saldo de bloqueo',
  'account.prop-challenge.rule.daily-loss-model': 'Daily loss amount',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'Fixed amount',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'Increases at account profit threshold',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    'Escala con el beneficio EOD máximo',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    'Usa el límite fijo hasta que la cuenta cierre en el saldo de activación. Desde el siguiente día de trading, el límite es el porcentaje configurado del mayor beneficio al cierre y nunca disminuye.',
  'account.prop-challenge.rule.scale-at-balance': 'Saldo de activación',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    'Beneficio EOD máximo usado como límite (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    '{value} del beneficio EOD máximo',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    'Niveles de beneficio del saldo EOD anterior',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    'Niveles según el EOD anterior',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    'Usa pares beneficio:límite de pérdida. El nivel del beneficio EOD anterior se aplica a la siguiente sesión.',
  'account.prop-challenge.rule.loss-tiers':
    'Niveles de beneficio y límites de pérdida',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'The higher daily loss amount activates permanently when lifetime account profit first reaches the configured percentage of starting balance.',
  'account.prop-challenge.rule.profit-threshold-percent':
    'Account profit threshold (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'Daily loss amount after threshold',
  'account.prop-challenge.rule.breach-action':
    'Comportamiento al superar el límite',
  'account.prop-challenge.rule.breach-action.hard': 'Suspender la cuenta',
  'account.prop-challenge.rule.breach-action.soft':
    'Pausar hasta la próxima sesión',
  'account.prop-challenge.rule.days': 'Días de trading',
  'account.prop-challenge.rule.minimum-daily-profit': 'Ganancia mínima por día',
  'account.prop-challenge.rule.minimum-daily-profit-summary':
    '{value}+ por día',
  'account.prop-challenge.rule.best-day-percent': 'Mejor día máximo (%)',
  'account.prop-challenge.rule.position-limit-model': 'Position limit model',
  'account.prop-challenge.rule.position-limit-model.fixed': 'Fixed limit',
  'account.prop-challenge.rule.position-limit-model.eod-profit-tiers':
    'EOD profit tiers',
  'account.prop-challenge.rule.position-profit-basis':
    'Base de beneficio para escalar posiciones',
  'account.prop-challenge.rule.position-profit-basis.cumulative':
    'Beneficio acumulado de operaciones (los pagos no reducen)',
  'account.prop-challenge.rule.position-profit-basis.current-account':
    'Beneficio actual de la cuenta (los pagos reducen)',
  'account.prop-challenge.rule.position-limit-model.eod-profit':
    'Scales with EOD profit',
  'account.prop-challenge.rule.position-tiers': 'Profit tiers',
  'account.prop-challenge.rule.position-tiers-help':
    'Enter each completed EOD profit threshold and its new contract limit as profit:contracts, separated by commas. A tier applies from the next trading day.',
  'account.prop-challenge.rule.position-scaling-help':
    'Each completed profit step adds one contract starting on the next trading day, up to the maximum.',
  'account.prop-challenge.rule.initial-contracts': 'Initial contracts',
  'account.prop-challenge.rule.profit-per-contract':
    'EOD profit per additional contract',
  'account.prop-challenge.rule.maximum-contracts':
    'Maximum contracts after scaling',
  'account.prop-challenge.rule.micros-per-contract':
    'Contar 10 micros como 1 contrato',
  'account.prop-challenge.rule.micros-per-contract-help':
    'Actívalo si tu firma cuenta los futuros micro (MES, MNQ, MGC, ...) como una décima parte de un contrato estándar para este límite. Déjalo desactivado si cada micro cuenta como un contrato completo.',
  'account.prop-challenge.rule.max-contracts': 'Contratos máximos',
  'account.prop-challenge.rule.profit_target': 'Objetivo de beneficio',
  'account.prop-challenge.rule.drawdown': 'Drawdown',
  'account.prop-challenge.rule.daily_loss_limit': 'Límite de pérdida diaria',
  'account.prop-challenge.rule.live_review_daily_profit':
    'Ganancia diaria para revisión en vivo',
  'account.prop-challenge.rule.best-profitable-day':
    'Umbral de ganancia diaria',
  'account.prop-challenge.rule.daily_profit_cap':
    'Límite diario de ganancia acreditada',
  'account.prop-challenge.rule.per-trading-day': 'Por día de trading',
  'account.prop-challenge.rule.minimum_trading_days': 'Días mínimos de trading',
  'account.prop-challenge.rule.minimum_profitable_days':
    'Días rentables mínimos',
  'account.prop-challenge.rule.consistency-cushion-percent':
    'Margen de consistencia (puntos porcentuales)',
  'account.prop-challenge.rule.consistency-cushion-short': 'margen',
  'account.prop-challenge.rule.consistency': 'Consistencia',
  'account.prop-challenge.rule.max_position_size': 'Tamaño máximo de posición',
  'account.prop-challenge.drawdown.static': 'Estático',
  'account.prop-challenge.drawdown.eod-trailing': 'Trailing al cierre',
  'account.prop-challenge.drawdown.intraday-trailing': 'Trailing intradía',
  'account.prop-challenge.summary.status.active': 'Activo',
  'account.prop-challenge.summary.status.passed': 'Superado',
  'account.prop-challenge.summary.status.failed': 'Fallido',
  'account.prop-challenge.summary.status.pending': 'Pendiente',
  'account.prop-challenge.summary.status.warning': 'Cerca del límite',
  'account.prop-challenge.summary.phase-status.pending': 'Pendiente',
  'account.prop-challenge.summary.phase-status.active': 'Activo',
  'account.prop-challenge.summary.phase-status.passed': 'Superado',
  'account.prop-challenge.summary.phase-status.failed': 'Fallido',
  'account.prop-challenge.summary.rule.profit_target': 'Objetivo de beneficio',
  'account.prop-challenge.summary.rule.drawdown': 'Drawdown',
  'account.prop-challenge.summary.rule.drawdown-static': 'Drawdown estático',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': 'Drawdown EOD',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing':
    'Drawdown intradía',
  'account.prop-challenge.summary.rule.daily_loss_limit': 'Pérdida diaria',
  'account.prop-challenge.summary.rule.live_review_daily_profit':
    'Revisión en vivo',
  'account.prop-challenge.summary.rule.daily_profit_cap':
    'Ganancia diaria acreditada',
  'account.prop-challenge.summary.rule.minimum_trading_days': 'Días operados',
  'account.prop-challenge.summary.rule.minimum_profitable_days':
    'Días rentables',
  'account.prop-challenge.summary.rule.consistency':
    'Consistencia del mejor día',
  'account.prop-challenge.summary.rule.max_position_size': 'Tamaño de posición',
  'account.prop-challenge.ledger.value.of': '{current} de {target}',
  'account.prop-challenge.ledger.section.payout': 'Requisitos de retiro',
  'account.prop-challenge.ledger.requirement.minimum': 'mín. {value}',
  'account.prop-challenge.ledger.requirement.maximum': 'máx. {value}',
  'account.prop-challenge.ledger.value.ratio': '{current} / {target}',
  'account.prop-challenge.payout.met-of-total': '{met} de {total} requisitos',
  'account.prop-challenge.ledger.value.of-today': '{current} de {target} hoy',
  'account.prop-challenge.ledger.value.credited-profit':
    '{credited} acreditados de {actual} de ganancia real',
  'account.prop-challenge.ledger.value.used': '{used} usado',
  'account.prop-challenge.ledger.value.consistency-goal':
    '{current} de {target} del objetivo de consistencia',
  'account.prop-challenge.ledger.value.best-day-share':
    'Mejor día {value} del beneficio',
  'account.prop-challenge.ledger.value.no-profit': 'Aún sin beneficio',
  'account.prop-challenge.ledger.requirement.best-day':
    'Mejor día ≤ {value} del beneficio total',
  'account.prop-challenge.ledger.state.needs-profit': 'Falta beneficio',
  'account.prop-challenge.ledger.tooltip.open': 'Explicar {rule}',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    'Limita qué parte del beneficio total de la fase puede venir del día de trading más rentable.',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    'Beneficio del mejor día ÷ beneficio total de la fase × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    'Mejor día: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    'Beneficio total: {value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 = {share}',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    'Objetivo de consistencia: {best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    'La proporción baja al sumar beneficio en otros días, y un nuevo mejor día más grande eleva el objetivo.',
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum}: dentro de la regla',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    'El cálculo empieza cuando el beneficio total de la fase es positivo.',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    'Un objetivo de consistencia requiere un máximo superior al 0%.',
  'account.prop-challenge.ledger.help.open': 'Sobre {rule}',
  'account.prop-challenge.ledger.help.profit_target':
    'Haz crecer la cuenta en este importe para superar la fase. Solo cuentan las operaciones cerradas.',
  'account.prop-challenge.ledger.help.profit_target.example':
    'Esta cuenta necesita {target} de beneficio: {current} hasta ahora, {remaining} por alcanzar.',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    'Objetivo alcanzado: {current} de {target}.',
  'account.prop-challenge.ledger.help.drawdown.static':
    'Lo máximo que el saldo puede caer por debajo del saldo inicial. El suelo no se mueve.',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    'El suelo de esta cuenta es {floor}; el saldo debe mantenerse por encima. Quedan {buffer} del límite de {limit}.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    'El suelo sigue tu máximo saldo de cierre del día y solo sube, hasta fijarse en el nivel de bloqueo de la firma.',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    'Ahora el suelo es {floor} (mejor cierre menos {limit}) y sube con cada cierre más alto. Quedan {buffer}.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    'El suelo sigue tu saldo más alto en cualquier momento, incluido el beneficio abierto. Journalit solo ve operaciones cerradas, así que este suelo sigue el mejor saldo tras cada cierre; un máximo alcanzado dentro de una operación abierta no cuenta. Comprueba la cifra de la firma.',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    'Ahora el suelo es {floor} (mejor saldo tras operaciones cerradas menos {limit}). Quedan {buffer}; la cifra en vivo de la firma puede ser más estricta.',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    'Lo máximo que puedes perder en un día de trading. Alcanzarlo suspende la fase o pausa el trading hasta la siguiente sesión, según la firma.',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    'Hoy: {used} perdidos del límite diario de {limit}, quedan {left}.',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    'Solo una parte del beneficio de cada día cuenta para el objetivo. El exceso se conserva, pero no se contabiliza.',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    'Solo se acreditan {cap} del beneficio de un día; {excluded} por encima del tope no cuentan.',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    'Un día de trading con este beneficio o más hace la cuenta elegible para una revisión a cuenta real.',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    'Un día de {trigger} o más califica; mejor día hasta ahora {bestDay}.',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    'Días con al menos una operación cerrada. La fase no puede superarse antes de reunir esta cantidad, por rápido que se alcance el objetivo.',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{current} de {target} días de trading hechos, {remaining} por alcanzar.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'Días de trading que cierran en o por encima del beneficio diario mínimo de la firma. El break-even o ganancias menores no cuentan.',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '{current} de {target} días cerrados en {minimum} o más, {remaining} por alcanzar.',
  'account.prop-challenge.ledger.help.consistency':
    'Tu mejor día no puede superar esta parte del beneficio total de la fase. Se corrige ganando más en otros días, no perdiendo.',
  'account.prop-challenge.ledger.help.consistency.example':
    'El mejor día {bestDay} es el {share} de {total} de beneficio total; el beneficio total debe llegar a {goal} para situarse en {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-done':
    'El mejor día {bestDay} es el {share} del beneficio total, dentro del límite de {maximum}.',
  'account.prop-challenge.ledger.help.consistency.example-none':
    'Aún no hay beneficio, así que no hay un mejor día con el que comparar.',
  'account.prop-challenge.ledger.help.max_position_size':
    'El máximo de contratos permitido en una posición. Journalit comprueba el tamaño de cada operación. Algunas firmas suben el límite a medida que crece la ganancia.',
  'account.prop-challenge.ledger.help.max_position_size.example':
    'Hasta {maximum} contratos por operación ahora mismo; operación más grande hasta ahora {current}.',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    'Días de trading del ciclo de pago actual. El recuento se reinicia tras un pago aprobado.',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '{current} de {target} días de trading en este ciclo, {remaining} por alcanzar.',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    'Días de trading de este ciclo que cierran en o por encima del beneficio diario mínimo de la firma.',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '{current} de {target} días de {minimum} o más en este ciclo, {remaining} por alcanzar.',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    'El beneficio desde el inicio del ciclo debe alcanzar este importe antes de poder solicitar.',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '{current} ganados en este ciclo de los {target} necesarios.',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    'El saldo debe estar en o por encima de este nivel al solicitar.',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    'Saldo {current}; debe ser al menos {target}.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    'Tras el primer pago, cada ciclo nuevo debe estar en beneficio antes de otra solicitud.',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    'El beneficio del ciclo es {current}; debe ser mayor que cero.',
  'account.prop-challenge.ledger.help.payout.consistency':
    'Tu mejor día no puede superar esta parte del beneficio del ciclo.',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    'El mejor día {bestDay} es el {share} de {total} de beneficio del ciclo; el beneficio del ciclo debe llegar a {goal} para quedar en {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    'El mejor día {bestDay} es el {share} del beneficio del ciclo, dentro del límite de {maximum}.',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    'Aún no hay beneficio en el ciclo, así que no hay mejor día que comparar.',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    'El pago más pequeño que acepta la firma. El importe disponible debe alcanzarlo primero.',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '{current} disponibles; la solicitud mínima de la firma es {target}.',
  'account.prop-challenge.ledger.help.payout.payout_count':
    'Cuántos pagos permite esta etapa. Usar el cupo completa la etapa.',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '{current} de {target} pagos usados en esta etapa.',
  'account.prop-challenge.ledger.help.payout.request_window':
    'Las solicitudes solo se aceptan estos días laborables, en la zona horaria de la firma.',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    'Hoy es {today}; las solicitudes se abren los {days} ({timeZone}).',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    'El tiempo desde la primera operación del ciclo debe alcanzar esto antes de poder solicitar.',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '{current} de {target} horas desde la primera operación del ciclo.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    'Días válidos de toda la fase funded, no solo de este ciclo. Los pagos se desbloquean al alcanzarlos.',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '{current} de {target} días válidos en toda la fase.',
  'account.prop-challenge.ledger.requirement.target': 'objetivo de {value}',
  'account.prop-challenge.ledger.requirement.buffer': 'margen de {value}',
  'account.prop-challenge.ledger.requirement.max': 'máximo {value}',
  'account.prop-challenge.ledger.requirement.daily-cap':
    '{value} acreditados por día de trading',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{days} días con {profit}+',
  'account.prop-challenge.ledger.requirement.days': '{value} días',
  'account.prop-challenge.ledger.requirement.at-most': '≤ {value}',
  'account.prop-challenge.ledger.state.not-started': 'Sin empezar',
  'account.prop-challenge.ledger.state.in-progress': 'En curso',
  'account.prop-challenge.ledger.state.reached': 'Alcanzado',
  'account.prop-challenge.ledger.state.met': 'Cumplido',
  'account.prop-challenge.ledger.state.eligible': 'Elegible',
  'account.prop-challenge.ledger.state.safe': 'Seguro',
  'account.prop-challenge.ledger.state.clear': 'Sin usar',
  'account.prop-challenge.ledger.state.within-rule': 'Dentro de la regla',
  'account.prop-challenge.ledger.state.near-limit': 'Cerca del límite',
  'account.prop-challenge.ledger.state.limit-reached': 'Límite alcanzado',
  'account.prop-challenge.ledger.state.cap-applied': 'Límite aplicado',
  'account.prop-challenge.ledger.state.within-cap': 'Dentro del límite',
  'account.prop-challenge.ledger.state.breached': 'Incumplida',
  'account-dashboard.prop.metrics.total': 'Desafíos',
  'account-dashboard.prop.metrics.pass-rate': 'Tasa de éxito',
  'account-dashboard.prop.metrics.costs': 'Costes del desafío',
  'account-dashboard.prop.metrics.payouts': 'Retiros',
  'account-dashboard.prop.metrics.net': 'Neto',
  'account-dashboard.prop.tabs.overview': 'Resumen',
  'account-dashboard.mode.selector': 'Modo del panel de cuentas',
  'account-dashboard.mode.account-overview': 'Resumen',
  'account-dashboard.mode.challenges': 'Desafíos',
  'account-dashboard.prop.metrics.active': 'Desafíos activos',
  'account-dashboard.prop.economics.title': 'Economía',
  'account-dashboard.prop.economics.roi': 'ROI',
  'account-dashboard.prop.economics.roi-no-cost': 'Sin coste',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    'Coste medio por intento',
  'account-dashboard.prop.economics.cost-per-funded-account':
    'Coste por cuenta financiada',
  'account-dashboard.prop.economics.payout-conversion': 'Conversión a retiro',
  'account-dashboard.prop.insights.title': 'Análisis de desafíos',
  'account-dashboard.prop.phases.title': 'Datos de fases',
  'account-dashboard.prop.phases.phase': 'Fase',
  'account-dashboard.prop.phases.average-duration': 'Duración media',
  'account-dashboard.prop.phases.show-more': 'Mostrar {count} más',
  'account-dashboard.prop.phases.show-fewer': 'Mostrar menos',
  'account-dashboard.prop.tooltip.open-explanation':
    'Explicar el cálculo de {metric}',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    'Aún no hay suficientes datos completados',
  'account-dashboard.prop.tooltip.pass-rate.description':
    'Porcentaje de desafíos completados que se aprobaron. Se excluyen los desafíos activos y los archivados sin resultado.',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    'Desafíos aprobados ÷ desafíos completados × 100',
  'account-dashboard.prop.tooltip.roi.description':
    'Retorno neto de los retiros (retiros menos costes de desafíos) respecto a los costes. Solo se calcula cuando todos los desafíos incluidos usan una moneda.',
  'account-dashboard.prop.tooltip.roi.formula':
    '(Retiros − costes de desafíos) ÷ costes de desafíos × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    'Estos desafíos no tuvieron coste, así que no hay base de coste para dividir. El retorno neto son los {payouts} de pagos.',
  'account-dashboard.prop.tooltip.average-cost.description':
    'Coste medio de cada intento de desafío, calculado por separado para cada moneda.',
  'account-dashboard.prop.tooltip.average-cost.formula':
    'Costes de desafíos ÷ total de intentos',
  'account-dashboard.prop.tooltip.funded-cost.description':
    'Coste medio necesario por cada desafío aprobado, calculado por separado para cada moneda.',
  'account-dashboard.prop.tooltip.funded-cost.formula':
    'Costes de desafíos ÷ desafíos aprobados',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    'Porcentaje de desafíos aprobados que han generado al menos un retiro.',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    'Desafíos aprobados con retiro ÷ desafíos aprobados × 100',
  'account-dashboard.prop.tabs.phases': 'Fases',
  'account-dashboard.prop.tabs.firms': 'Firmas',
  'account-dashboard.prop.firms.firm': 'Firma',
  'account-dashboard.prop.firms.attempts': 'Intentos',
  'account-dashboard.prop.phases.most-failed': 'Más fallada',
  'account-dashboard.prop.phases.days': '{count} días',
  'account-dashboard.prop.phases.empty': 'Aún no hay fases completadas',

  'setups.create.field.tags': 'Etiquetas',
  'setups.create.placeholder.tags': 'Momentum, Ruptura, Mañana',
  'setups.view.overview.tag-filter.aria': 'Filtrar setups',
  'setups.view.overview.tag-filter.reset': 'Restablecer',
  'setups.view.overview.tag-filter.untagged': 'Sin etiquetas',
  'setups.view.overview.tag-filter.empty':
    'Ningún setup coincide con estos filtros',
  'setups.view.overview.tag-filter.empty-submessage':
    'Ajusta o borra los filtros para mostrar más setups.',

  'setups.view.tags': 'Etiquetas',
  'setups.create.error.tag-save-failed':
    'No se pudo guardar la etiqueta en la lista global de etiquetas.',
  'settings.customization.options.confirm.remove-tag-message':
    '¿Eliminar la etiqueta global "{option}"? Se eliminará de todas las notas de operaciones y setups de Journalit.',
  'settings.customization.options.confirm.reset-tag-message':
    '¿Restablecer la lista global de etiquetas y sus colores? Las etiquetas ya asignadas a notas de operaciones y setups permanecerán en esas notas.',
  'home.mode.overview': 'Resumen',
  'home.mode.dashboard': 'Panel',
  'home.mode.aria': 'Cambiar modo de Inicio',
  'home.filters.period': 'Período',
  'home.filters.trade-type': 'Tipo de operación',
  'home.filters.accounts': 'Cuentas',
  'home.filters.back': 'Atrás',
  'filter.reset': 'Restablecer filtros',
  'filter.menu.title': 'Filtrar por',
  'filter.menu.accounts': 'Cuentas',
  'filter.menu.tickers': 'Tickers',
  'filter.menu.setups': 'Setups',
  'filter.menu.tags': 'Etiquetas',
  'filter.menu.mistakes': 'Errores',
  'filter.menu.trade-type': 'Tipo de operación',
  'filter.menu.status': 'Estado',
  'filter.menu.direction': 'Dirección',
  'filter.menu.review-status': 'Estado de revisión',
  'filter.menu.status.cancelled': 'Cancelada',
  'filter.menu.included-count': '{count} incluidos',
  'filter.menu.excluded-count': '{count} excluidos',
  'filter.menu.search': 'Buscar',
  'filter.menu.no-matches': 'Sin coincidencias',
  'filter.menu.no-options': 'Aún no hay nada que filtrar',
  'filter.menu.clear': 'Borrar',
  'filter.menu.match.label': 'Coincidencia',
  'filter.menu.match.any': 'Cualquiera de',
  'filter.menu.match.all': 'Todos de',
  'filter.menu.match.only': 'Solo estos',
  'filter.menu.match.exact': 'Exactamente estos',
  'filter.menu.match.hint.any':
    'Operaciones con al menos uno de los valores seleccionados.',
  'filter.menu.match.hint.all':
    'Operaciones con todos los valores seleccionados. Se permiten otros valores.',
  'filter.menu.match.hint.only':
    'Operaciones cuyos valores están todos entre los seleccionados.',
  'filter.menu.match.hint.exact':
    'Operaciones con exactamente los valores seleccionados, ni más ni menos.',
  'filter.menu.match.no-value-any-only': 'Solo con «Cualquiera de»',
  'filter.menu.exclude-value': 'Excluir {label}',
  'filter.menu.match.badge.all': 'Todos',
  'filter.menu.match.badge.only': 'Solo',
  'filter.menu.match.badge.exact': 'Exacto',
  'home.guide.modes.title': 'Una cosa más: el Panel',
  'home.guide.modes.description':
    'El Resumen y el Panel comparten esta página. Cambia al Panel ahora para continuar con un breve recorrido por tus estadísticas de rendimiento.',
  'home.guide.whats-new.mode.title': 'Un Inicio, dos modos',
  'home.guide.whats-new.mode.description':
    'Resumen y Panel ahora comparten una página. Cambia de modo sin perder el diseño ni la posición de desplazamiento.',
  'home.guide.whats-new.filters.title':
    'Los filtros de Inicio están en un solo lugar',
  'home.guide.whats-new.filters.description':
    'Abre el botón de filtros para elegir Período, Tipo de operación o Cuentas en un menú compacto por niveles.',
  'home.guide.whats-new.done.title':
    'Tu espacio de trabajo mantiene el contexto',
  'home.guide.whats-new.done.description':
    'Usa Resumen para tus widgets personales y Panel para un análisis más profundo. Cada modo conserva sus propios filtros y diseño.',
  'account.prop-challenge.summary.status.payout_ready': 'Payout ready',
  'account.prop-challenge.ribbon.passed': '{phase} superada',
  'account.prop-challenge.ribbon.failed': '{phase} fallida',
  'account.prop-challenge.ribbon.action.advance': 'Avanzar a {phase}',
  'account.prop-challenge.ribbon.action.advance-short': 'Avanzar',
  'account.prop-challenge.ribbon.action.mark-passed': 'Marcar como superado',
  'account.prop-challenge.ribbon.action.archive': 'Archivar',
  'account.prop-challenge.ribbon.action.record-payout': 'Registrar pago',
  'account.prop-challenge.ribbon.action.record-payout-short': 'Pago',
  'account.prop-challenge.payout.title': 'Payout readiness',
  'account.prop-challenge.payout.eligible': 'Payout ready',
  'account.prop-challenge.payout.available': 'Available now',
  'account.prop-challenge.payout.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.history': 'Payouts',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'Días calificables acumulados',
  'account.prop-challenge.payout.requirement.days': 'Trading days',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'Qualifying days',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'Minimum account balance',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'Positive cycle profit',
  'account.prop-challenge.payout.requirement.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.requirement.consistency': 'Consistency',
  'account.prop-challenge.payout.requirement.minimum': 'Minimum available',
  'account.prop-challenge.payout.requirement.payouts': 'Payout allowance',
  'account.prop-challenge.payout.requirement.request-window': 'Request window',
  'account.prop-challenge.payout.timezone-invalid':
    'No es una zona horaria conocida.',
  'account.prop-challenge.payout.preview-amount': 'Vista previa del pago',
  'account.prop-challenge.payout.you-receive': 'Parte del trader',
  'account.prop-challenge.payout.balance-after': 'Saldo después',
  'account.prop-challenge.payout.drawdown-floor': 'Suelo de drawdown',
  'account.prop-challenge.payout.buffer-after': 'Room before breach',
  'account.prop-challenge.payout.request-not-allowed':
    'No elegible con este importe',
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
  'account.prop-challenge.payout-rules.minimum-balance':
    'Minimum account balance',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Minimum cycle profit',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'Ganancia mínima del ciclo por número de pago',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'Require positive cycle profit after first payout',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Maximum best-day share (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'Porcentaje máximo del mejor día por número de pago (%)',
  'account.prop-challenge.payout-rules.availability': 'Available profit',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Above starting balance',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Above balance floor',
  'account.prop-challenge.payout-rules.balance-floor': 'Balance floor',
  'account.prop-challenge.payout-rules.request-percent':
    'Withdrawable share (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'New profit required from each request (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'Caps the request so the configured percentage is backed by profit earned during the current payout cycle. For example, 50% allows a request up to twice current-cycle profit.',
  'account.prop-challenge.payout-rules.minimum-request': 'Minimum request',
  'account.prop-challenge.payout-rules.maximum': 'Maximum request',
  'account.prop-challenge.payout-rules.maximum.none': 'No maximum',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Fixed maximum',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'Máximo solo para el primer pago',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Maximum by payout number',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'Porcentaje de la ganancia del ciclo',
  'account.prop-challenge.payout-rules.maximum-amount': 'Maximum amount',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'Máximo del primer pago',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'Máximo de ganancia del ciclo (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'Keep using the final amount for later payouts',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'Seguir usando el último valor para pagos posteriores',
  'account.prop-challenge.payout-rules.schedule': 'Amounts by payout number',
  'account.prop-challenge.payout-rules.profit-split': 'Trader profit share (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'Cambiar límites tras los días calificables acumulados',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    'Cuenta los días calificables de toda la fase financiada, incluso cuando se reinician los ciclos de pago.',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'Días calificables acumulados requeridos',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'Disponibilidad tras el desbloqueo',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'Saldo mínimo tras el desbloqueo',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'Beneficio disponible tras el desbloqueo (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'Solicitud máxima tras el desbloqueo',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'Importe máximo tras el desbloqueo',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'Calendario máximo tras el desbloqueo',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'Porcentaje máximo del beneficio del ciclo tras el desbloqueo',
  'account.prop-challenge.payout-rules.profit-split-model':
    'Modelo de reparto de ganancias',
  'account.prop-challenge.payout-rules.profit-split.fixed': 'Porcentaje fijo',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    'Cambia tras pagos acumulados',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'Participación inicial del trader (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'Umbral de pagos acumulados',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'Participación tras el umbral (%)',
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
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'Changes by account profit',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'Lifetime account profit equals current balance minus starting balance plus prior withdrawals. The below or at/above percentage applies to the entire request.',
  'account.prop-challenge.payout-rules.profit-split.below':
    'Trader share below threshold (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'Account profit threshold',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'Trader share at or above threshold (%)',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Minimum elapsed hours',

  
  'account.merge.challenge.move-earlier': 'Mover {account} antes',
  'account.merge.challenge.move-later': 'Mover {account} después',
  'account.merge.warning.use-profile-balance': 'Usar el saldo de la firma',
  'account.merge.warning.edit-phases': 'Editar fases',
  'account.merge.title': 'Configurar desafío',
  'account.merge.loading': 'Cargando...',
  'account.merge.step.accounts': 'Cuentas',
  'account.merge.step.phases': 'Fases',
  'account.merge.step.review': 'Revisar',
  'account.merge.accounts.title': 'Cuentas a fusionar',
  'account.merge.accounts.show-archived': 'Mostrar archivadas',
  'account.merge.accounts.empty': 'No hay cuentas elegibles',
  'account.merge.target.title': 'Cuenta de destino',
  'account.merge.target.keep': 'Conservar',
  'account.merge.target.new': 'Nombre nuevo',
  'account.merge.phase.name': 'Nombre de fase',
  'account.merge.phase.status': 'Estado',
  'account.merge.phase.started': 'Inicio',
  'account.merge.phase.completed': 'Fin',
  'account.merge.phase.no-rules': 'Ninguna',
  'account.merge.review.notes': 'operaciones movidas',
  'account.merge.review.identities': 'cuentas de bróker',
  'account.merge.warning.trade-outside-window':
    'Operaciones fuera de su ventana de fase',
  'account.merge.warning.identity-shared':
    'Identidad reclamada por varias cuentas',
  'account.merge.warning.copy-trading-dropped':
    'Periodos de copy trading descartados',
  'account.merge.error.too-few-sources': 'Selecciona al menos dos cuentas.',
  'account.merge.error.duplicate-source': 'Una cuenta aparece dos veces.',
  'account.merge.error.target-exists': 'Ese nombre pertenece a otra cuenta.',
  'account.merge.error.currency-mismatch':
    'Las cuentas usan monedas distintas.',
  'account.merge.error.timeline-not-monotonic':
    'Los inicios de fase deben ser crecientes.',
  'account.merge.error.invalid-override': 'Revisa las fechas de esta fase.',
  'account.merge.error.source-missing':
    'Una cuenta no tiene ajustes guardados.',
  'account.merge.error.unknown': 'La fusión ha fallado.',
  'account.merge.action.merge': 'Fusionar',
  'account.merge.action.undo': 'Deshacer',
  'account.merge.action.looks-right': 'Se ve bien',
  'account.merge.action.delete': 'Eliminar cuentas antiguas',
  'account.merge.notice.converted': 'Convertida en desafío',
  'account.merge.summary.intro': 'Comprueba que esto coincide con tu desafío:',
  'account.merge.summary.phases': 'Fases: {phases}',
  'account.merge.summary.current':
    'Ahora en {phase} ({stage}), iniciada el {date}',
  'account.merge.summary.current-stage': 'Ahora en {phase}, iniciada el {date}',
  'account.merge.summary.trades':
    '{counted} de {total} operaciones cuentan para el desafío',
  'account.merge.summary.trades-missing':
    '{counted} de {total} operaciones cuentan para el desafío. El resto queda fuera de las fechas de todas las fases.',
  'account.merge.summary.rules': 'Reglas de {phase}: {rules}',
  'account.merge.summary.no-rules':
    'Aún no hay reglas para {phase}. Añade las reglas de tu firma en Editar cuenta.',
  'account.merge.notice.title': 'Fusionada desde {accounts}',
  'account.merge.notice.error': 'La acción ha fallado.',
  'account.merge.undo.title': 'Deshacer la fusión',
  'account.merge.undo.message':
    'Restaura las cuentas antiguas y sus operaciones.',
  'account.merge.delete.title': 'Eliminar cuentas antiguas',
  'account.merge.delete.message':
    'Elimina las cuentas antiguas archivadas. No se puede deshacer.',
  'command.open-legacy-challenge-onboarding': 'Configurar prop challenges',
  'account.merge.step.challenge': 'Desafío',
  'account.merge.action.convert': 'Convertir',
  'account.merge.profile.applied': 'Aplicado: {firm} · {challenge}',
  'account.merge.profile.remove': 'Quitar',
  'account.merge.phase.apply-profile': 'Aplicar reglas de la firma',
  'account.merge.profile.replace-rules.title':
    '¿Reemplazar las reglas escritas a mano?',
  'account.merge.profile.replace-rules.body':
    'El perfil de {firm} define las reglas de cada fase. Las reglas que escribiste en esta página se reemplazarán.',
  'account.merge.profile.replace-rules.confirm': 'Reemplazar reglas',
  'guide.legacy-setup.list.title': 'Aquí aparece cada cuenta sin desafío',
  'guide.legacy-setup.list.description':
    'Decide cuenta por cuenta. «Dejar como está» la conserva tal cual; siempre podrás configurarla más tarde desde los ajustes del panel.',
  'guide.legacy-setup.assign.title': 'Agrupa las fases de un mismo desafío',
  'guide.legacy-setup.assign.description':
    'Las cuentas que fueron fases del mismo desafío van en un grupo (sugerimos grupos por nombres coincidentes). Una cuenta sola se convierte en un desafío de una fase.',
  'guide.legacy-setup.continue.title': 'Una configuración breve por desafío',
  'guide.legacy-setup.continue.description':
    'Continuar abre la configuración de cada grupo por turno. Nada cambia hasta que confirmes cada uno.',
  'guide.merge-wizard.target.title': 'Una cuenta conserva el historial',
  'guide.merge-wizard.target.description':
    'La cuenta destino sobrevive con todas las fases. Las demás se archivan, no se eliminan, y sus operaciones pasan a la cuenta destino.',
  'guide.merge-wizard.identity.title': 'Elige las reglas de tu firma',
  'guide.merge-wizard.identity.description':
    'Elige tu firma y tu plan para rellenar sus fases y reglas. ¿Tu firma no aparece? Elige Otra / firma personalizada y define las reglas en la página siguiente.',
  'guide.merge-wizard.identity.free-title': 'Ponle nombre a tu desafío',
  'guide.merge-wizard.identity.free-description':
    'Dale un nombre y, si quieres, el de tu firma. Las reglas guardadas de un desafío anterior rellenan sus fases y reglas; si no, las defines en la página siguiente.',
  'guide.merge-wizard.phases.title': 'Revisa cada fase',
  'guide.merge-wizard.phases.description':
    'Define el tipo de etapa, marca como Superada las fases completadas y como Activa la actual, y confirma las fechas.',
  'guide.merge-wizard.review.title': 'Nada ocurre hasta que confirmes',
  'guide.merge-wizard.review.description':
    'Al convertir, la página de la cuenta muestra lo que se configuró para que lo compruebes, y puedes deshacerlo desde allí.',
  'account.merge.challenge.accounts': 'Cuentas',
  'account.merge.challenge.order-hint': 'La fase más antigua primero',
  'account.merge.challenge.single-hint':
    'Esta cuenta se convierte en un desafío por sí sola',
  'account.merge.phase.broker-accounts.one': '{count} cuenta de bróker',
  'account.merge.phase.broker-accounts.few': '{count} cuentas de bróker',
  'account.merge.phase.broker-accounts.many': '{count} cuentas de bróker',
  'account.merge.phase.broker-accounts.other': '{count} cuentas de bróker',
  'account.merge.review.phase-count.one': 'fase',
  'account.merge.review.phase-count.few': 'fases',
  'account.merge.review.phase-count.many': 'fases',
  'account.merge.review.phase-count.other': 'fases',
  'account.merge.phase.pending': 'Pendiente',
  'account.merge.phase.starts-after': 'Empieza al aprobar {phase}',
  'account.merge.phase.pending-rules': 'Reglas: {rules}',
  'account.merge.review.archived': 'archivadas',
  'account.merge.review.starts-after': 'Después de {phase}',
  'account.merge.review.since': 'Desde {date}',
  'account.merge.sequence': 'Desafío {index} de {total}',
  'account.merge.warning.balance-differs':
    'El saldo inicial difiere de las reglas de la firma',
  'account.merge.error.profile-phase-mismatch':
    'Más cuentas que fases en las reglas de la firma',
  'account.merge.error.profile-currency-mismatch':
    'Las reglas de la firma usan una moneda distinta a la de estas cuentas.',
  'account.merge.error.source-changed': 'Una cuenta cambió. Revisa la fusión.',
  'account.merge.error.multiple-active-phases':
    'Solo la última cuenta puede seguir activa.',
  'account.merge.error.phases-after-failed-source':
    'Una cuenta fallida termina el desafío, así que debe ser la última seleccionada.',
  'account.merge.error.copy-trading-overlap':
    'Los periodos de copy trading se solapan. Cierra uno primero.',
  'onboarding.legacy-challenge.legend':
    'Elige qué pasa con cada cuenta anterior. ¿Tenías una cuenta separada para cada fase, como Fase 1 y Fondeada? Ponlas en el mismo desafío para que se conviertan en una sola cuenta con fases.',
  'onboarding.legacy-challenge.assign.leave': 'Mantener como cuenta normal',
  'onboarding.legacy-challenge.assign.own': 'Convertir en desafío',
  'onboarding.legacy-challenge.assign.group': 'Añadir al desafío {letter}',
  'onboarding.legacy-challenge.assign.new-group':
    'Combinar en un nuevo desafío…',
  'onboarding.legacy-challenge.action.continue': 'Continuar',
  'onboarding.legacy-challenge.action.continue-count': 'Configurar {count}',
  'guide.action-step.dismiss': 'Ahora no',
  'guide.legacy-challenge.title':
    'Configura las cuentas de antes de esta actualización',
  'guide.legacy-challenge.description':
    'Convierte cuentas de evaluación o fondeadas anteriores en desafíos. La configuración te guía por las fases y fechas y, al final, muestra lo que se configuró para que puedas comprobarlo.',
  'guide.legacy-challenge.action': 'Configurar mis cuentas',
  'onboarding.legacy-challenge.title': 'Prop challenges',
  'onboarding.legacy-challenge.action.skip': 'Omitir',
  'onboarding.legacy-challenge.accounts.show-archived': 'Mostrar archivadas',
  'onboarding.legacy-challenge.accounts.empty': 'No hay cuentas que configurar',
  'onboarding.legacy-challenge.loading': 'Cargando...',
  'onboarding.legacy-challenge.suggested': 'Sugerido',
  'onboarding.legacy-challenge.row.aria': 'Acción para {account}',
  'onboarding.legacy-challenge.status.combined': 'Combinadas',
  'onboarding.legacy-challenge.status.converted': 'Convertida',
  'onboarding.legacy-challenge.entry.name': 'Prop challenges',
  'onboarding.legacy-challenge.entry.desc':
    'Combina o convierte cuentas existentes en challenges.',
  'onboarding.legacy-challenge.entry.action': 'Configurar',

  'view.home': 'Inicio',
  'common.lose': 'Perder',

  'dashboard.conversion.requires-conversion':
    'Los gráficos de P&L con varias divisas requieren conversión de tipos de cambio.',

  'auth.error.invalid-email':
    'Por favor ingresa una dirección de correo válida',
  'auth.error.invalid-code': 'Código de verificación inválido',
  'form.layout.guide-trigger-label': 'Personalizar formulario',
  'dashboard.filter.setup.none-found': 'No se encontraron configuraciones',
  'account.create.field.drawdown-type-desc':
    'Ninguno | Fijo | EOD Trailing | Manual',
  'account.edit.field.drawdown-type-desc':
    'Ninguno | Fijo | EOD Trailing | Manual',
  'trade-sync.gate.signin.cta': 'Iniciar sesión',
  'backend.progress.ftp.desc': 'Crear credenciales',
  'drc.preparation.checklist.title': 'Lista de Verificación Pre-Operación',
  'csv.broker-guide.sierrachart.warning.message':
    'La opción Export guarda precios sin ajustar. Save Log As preserva los precios tal como se muestran.',
  'csv.broker-guide.rithmic.step-1':
    'Abre Order History en R | Trader Pro y filtra Completed/Filled para tu cuenta y fecha',
  'csv.broker-guide.rithmic.step-2':
    'En Add/Remove Columns, asegúrate de mostrar Side, Symbol, Qty Filled, Avg Fill Price y Fill/Update Time',
  'csv.errors.group.close-only': 'Se omitieron ejecuciones solo de cierre',
  'csv.report.file': 'Archivo: {file}',
  'weekly.overview.drawdown-chart.empty':
    'No hay datos de drawdown para mostrar',
  'monthly.game.header.a-games': 'Juegos A',
  'trade.details.execution': 'Execution',
  'nav.weekly': 'Revisión Semanal',
  'onboarding.welcome.insight.timing.title': 'Patrones de timing',
  'onboarding.wizard.error.account-service':
    'AccountPageService no está disponible',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
  'setups.view.detail.execution-gap.title': 'Execution Gap',
  'trade-sync.import.action.sync-cloud': 'Sync cloud trades',
  'session-log.placeholder.entry': '¿Qué estás viendo, pensando o sintiendo?',
  'session-mode.unconfigured.step.gate.description':
    'Starter IF/THEN checklist is ready.',
  'setups.view.action.refresh': 'Actualizar',
  'setups.view.detail.no-playbook': 'Aún no hay un playbook escrito.',

  'home.widget.streak.kind.trade-outcome': 'Resultados de operaciones',
  'home.widget.streak.kind.trade-review': 'Revisiones de operaciones',
  'home.widget.streak.kind.drc-review': 'Revisiones DRC',
  'home.widget.streak.kind.weekly-review': 'Revisiones semanales',
  'home.widget.streak.kind.monthly-review': 'Revisiones mensuales',
  'home.widget.streak.configure': 'Elegir tipo de racha',
  'home.widget.streak.configure-aria': 'Configurar racha de {kind}',
  'home.widget.streak.no-review-streak': 'sin racha de revisiones activa',
  'home.widget.streak.start-reviewing':
    'empieza a revisar para crear una racha',
  'home.widget.streak.keep-reviewing': 'sigue revisando para continuar',
  'home.widget.streak.reviewed-trades-in-a-row.one':
    'operación revisada seguida',
  'home.widget.streak.reviewed-trades-in-a-row.few':
    'operaciones revisadas seguidas',
  'home.widget.streak.reviewed-trades-in-a-row.many':
    'operaciones revisadas seguidas',
  'home.widget.streak.reviewed-trades-in-a-row.other':
    'operaciones revisadas seguidas',
  'home.widget.streak.reviewed-days-in-a-row.one': 'día revisado seguido',
  'home.widget.streak.reviewed-days-in-a-row.few': 'días revisados seguidos',
  'home.widget.streak.reviewed-days-in-a-row.many': 'días revisados seguidos',
  'home.widget.streak.reviewed-days-in-a-row.other': 'días revisados seguidos',
  'home.widget.streak.reviewed-weeks-in-a-row.one': 'semana revisada seguida',
  'home.widget.streak.reviewed-weeks-in-a-row.few':
    'semanas revisadas seguidas',
  'home.widget.streak.reviewed-weeks-in-a-row.many':
    'semanas revisadas seguidas',
  'home.widget.streak.reviewed-weeks-in-a-row.other':
    'semanas revisadas seguidas',
  'home.widget.streak.reviewed-months-in-a-row.one': 'mes revisado seguido',
  'home.widget.streak.reviewed-months-in-a-row.few': 'meses revisados seguidos',
  'home.widget.streak.reviewed-months-in-a-row.many':
    'meses revisados seguidos',
  'home.widget.streak.reviewed-months-in-a-row.other':
    'meses revisados seguidos',
  'home.widget.streak.missed-trades.one':
    'falta {count} operación desde tu última revisión',
  'home.widget.streak.missed-trades.few':
    'faltan {count} operaciones desde tu última revisión',
  'home.widget.streak.missed-trades.many':
    'faltan {count} operaciones desde tu última revisión',
  'home.widget.streak.missed-trades.other':
    'faltan {count} operaciones desde tu última revisión',
  'home.widget.streak.missed-days.one':
    'falta {count} día desde tu última revisión',
  'home.widget.streak.missed-days.few':
    'faltan {count} días desde tu última revisión',
  'home.widget.streak.missed-days.many':
    'faltan {count} días desde tu última revisión',
  'home.widget.streak.missed-days.other':
    'faltan {count} días desde tu última revisión',
  'home.widget.streak.missed-weeks.one':
    'falta {count} semana desde tu última revisión',
  'home.widget.streak.missed-weeks.few':
    'faltan {count} semanas desde tu última revisión',
  'home.widget.streak.missed-weeks.many':
    'faltan {count} semanas desde tu última revisión',
  'home.widget.streak.missed-weeks.other':
    'faltan {count} semanas desde tu última revisión',
  'home.widget.streak.missed-months.one':
    'falta {count} mes desde tu última revisión',
  'home.widget.streak.missed-months.few':
    'faltan {count} meses desde tu última revisión',
  'home.widget.streak.missed-months.many':
    'faltan {count} meses desde tu última revisión',
  'home.widget.streak.missed-months.other':
    'faltan {count} meses desde tu última revisión',
  'trade-sync.quick.started':
    'Sincronizando las fuentes de operaciones activadas…',
  'trade-sync.quick.running': 'Sincronizando…',
  'trade-sync.quick.offline':
    'La sincronización de operaciones requiere conexión a internet. Inténtalo de nuevo cuando estés conectado.',
  'trade-sync.quick.no-sources':
    'No se encontraron fuentes de sincronización activadas. Configura Trade Sync en Ajustes.',
  'trade-sync.quick.complete':
    'Sincronización completada: {sources} fuentes sincronizadas y {imported} operaciones importadas o actualizadas.',
  'trade-sync.quick.partial':
    'La sincronización terminó con problemas: se completaron {completed} de {total} fuentes y se importaron o actualizaron {imported} operaciones.',
  'trade-sync.quick.failed':
    'No se pudo completar la sincronización de {sources} fuentes. Revisa los ajustes de Trade Sync e inténtalo de nuevo.',
  'navigation.items.nav-sync-trades': 'Sincronizar operaciones',
  'command.sync-trades-now': 'Sincronizar operaciones',
  'home.quick-links.sync-trades': 'Sincronizar operaciones',
  'trade-sync.quick.not-ready':
    'No hay fuentes de sincronización activadas listas en este momento. Espera a que terminen las sincronizaciones activas o revisa los ajustes de Trade Sync.',
  'trade-sync.quick.mapping-required':
    'Se importaron o actualizaron {imported} operaciones. Completa la asignación de cuentas para {providers} en Ajustes → Trade Sync y vuelve a intentarlo.',
  'trade-handoff.action.view-trades-count.one': 'Ver {count} operación',
  'trade-handoff.action.view-trades-count.few': 'Ver {count} operaciones',
  'trade-handoff.action.view-trades-count.many': 'Ver {count} operaciones',
  'trade-handoff.action.view-trades-count.other': 'Ver {count} operaciones',
  'trade-handoff.action.review-now': 'Revisar ahora',
  'trade-handoff.action.open-period': 'Abrir la revisión de {period}',
  'trade-handoff.review.creation-disabled':
    'Esa revisión no existe y la creación automática de revisiones está desactivada.',
  'trade-handoff.review.open-failed': 'No se pudo abrir esa revisión.',
  'trade-handoff.trades.open-failed':
    'No se pudo abrir el registro de operaciones.',
  'trade-handoff.scope.label':
    'Mostrando {trades} de la operación más reciente para {accounts}',
  'trade-handoff.scope.exit': 'Salir de la vista de operación',
  'trade-handoff.trade-count.one': '{count} operación',
  'trade-handoff.trade-count.few': '{count} operaciones',
  'trade-handoff.trade-count.many': '{count} operaciones',
  'trade-handoff.trade-count.other': '{count} operaciones',
  'trade-handoff.title.sync': 'Sincronización completada',
  'trade-handoff.summary.import-complete': '{trades} importadas',
  'trade-handoff.summary.import-partial': '{trades} importadas con incidencias',
  'trade-handoff.summary.sync-complete': '{trades} sincronizadas',
  'trade-handoff.summary.sync-partial':
    '{trades} sincronizadas con incidencias',
  'trade-handoff.periods.choose': 'Elegir otro periodo de revisión',
  'trade-handoff.periods.recommended': 'Recomendado',
  'trade-handoff.action.dismiss':
    'Descartar el resultado reciente de operaciones',
  'sample.action.try': 'Probar un diario de ejemplo',
  'sample.action.reset': 'Restablecer ejemplo',
  'sample.popout.title': 'Diario de ejemplo',
  'sample.popout.action.exit': 'Salir',
  'sample.popout.description': 'Los cambios aquí son solo para practicar.',
  'sample.popout.closed': 'Diario de práctica guardado y cerrado.',
  'sample.popout.recovery': 'El diario de práctica necesita recuperación.',
  'sample.notice.sync-blocked':
    'Estás editando datos ficticios de ejemplo. La sincronización con el servidor está pausada.',
  'sample.notice.folder-locked':
    'La carpeta del diario no se puede cambiar mientras el diario de muestra está activo.',
  'sample.empty.description':
    'Explora un diario ficticio completo sin cambiar los archivos ni los ajustes de tu diario.',
  'sample.progress.creating':
    'Creando diario de ejemplo: {completed} de {total} elementos',
  'sample.progress.removing':
    'Eliminando diario de ejemplo: {completed} de {total} elementos',
  'sample.progress.verifying':
    'Comprobando el diario de ejemplo: {completed} de {total} elementos',
  'sample.exit.title': '¿Salir del diario de ejemplo?',
  'sample.exit.remove-warning':
    'Al eliminarlo se borran las ediciones de los archivos cuya pertenencia al ejemplo está comprobada. Los archivos sin propiedad comprobable se conservan.',
  'sample.exit.remove': 'Salir y eliminar',
  'sample.reset.title': '¿Restablecer el diario de ejemplo?',
  'sample.reset.message':
    'Esto restaura todos los archivos de ejemplo y los ajustes exclusivos del ejemplo al paquete ficticio original.',
  'sample.reset.warning':
    'Se eliminarán tus cambios dentro del diario de ejemplo.',
  'sample.collision.title': 'La carpeta de ejemplo ya existe',
  'sample.collision.message':
    'Journalit no sobrescribirá la carpeta existente. ¿Crear el diario de ejemplo en “{path}” en su lugar?',
  'sample.collision.confirm': 'Usar carpeta disponible',
  'sample.notice.ready': 'El diario de ejemplo está listo.',
  'sample.notice.reset': 'Diario de ejemplo restaurado.',
  'sample.notice.reset-preserved':
    'Diario de ejemplo restaurado. Se conservaron {count} archivos cuya propiedad no pudo comprobarse.',
  'sample.notice.removed': 'Diario de ejemplo eliminado.',
  'sample.notice.removed-preserved':
    'Diario de ejemplo eliminado. Se conservaron {count} archivos cuya propiedad no pudo comprobarse.',
  'sample.notice.error': 'Error en la operación del diario de ejemplo: {error}',
  'command.open-sample-journal': 'Abrir diario de ejemplo',
  'command.exit-sample-journal': 'Salir del diario de ejemplo',
  'command.reset-sample-journal': 'Restablecer diario de ejemplo',
  'sample.notice.busy': 'Ya hay otra operación del diario de ejemplo en curso.',
  
  
};

export default es;
