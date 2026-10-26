
import type { Lang } from './en';

const es: Lang = {
  'tradelog.export.button': 'Exportar',
  'tradelog.export.title': 'Exportar operaciones',
  'tradelog.export.format': 'Formato',
  'tradelog.export.scope':
    '{count} operaciones coincidentes · {columns} columnas visibles',
  'tradelog.export.raw':
    'Valores sin ocultar, incluso en modo de privacidad. El P&L es dinero, no R; las imágenes son solo rutas.',
  'tradelog.export.mobile':
    'En móviles, el archivo se guarda en la raíz de la bóveda.',
  'tradelog.export.saved': 'Exportación guardada en la bóveda: {filename}',
  'tradelog.export.failed':
    'No se pudieron exportar las operaciones. Inténtalo de nuevo.',
  'tradelog.export.empty':
    'No hay operaciones coincidentes o columnas de datos visibles para exportar.',
  'tradelog.export.guide':
    'Usa Exportar para guardar todas las operaciones coincidentes como CSV, JSON o Markdown con tus columnas visibles y su orden. Los archivos contienen datos sin ocultar, incluso en modo de privacidad.',
  'expectancy-gap.benchmark-help':
    'Promedio del modelo/backtest. Compartido entre filtros; vacío para borrar.',
  'expectancy-gap.formula': 'Brecha = realizado − esperado',
  'expectancy-gap.realized-help':
    'Realizado = R neto medio de operaciones cerradas con datos de riesgo utilizables.',
  'expectancy-gap.interpretation':
    'Negativo = por debajo del modelo; positivo = por encima. No explica la causa.',
  'trade-import.recovery.bybit-header.columns':
    'Columnas obligatorias que faltan: {columns}.',
  'trade-import.recovery.bybit-header.title':
    'Revisa el encabezado o la exportación de Bybit',
  'trade-import.recovery.bybit-header.message':
    'El encabezado seleccionado no coincide con el historial de operaciones de Bybit. Revisa la fila de encabezados o exporta operaciones con precios y cantidades ejecutados, no solo precios de órdenes. Para asignar otro formato, elige explícitamente {manualSource}.',
  'update.installed.title': 'Novedades',
  'settings.general.available-update-notifications':
    'Mostrar recordatorios de actualización',
  'settings.general.available-update-notifications-desc':
    'Buscar nuevas versiones a diario y mostrar un recordatorio. Desactiva esta opción para ver solo las novedades después de actualizar.',
  'account.edit.field.unscoped-live-balance-desc':
    'No se pudo asignar una corrección anterior del saldo a una fase. Se conserva; introduce el saldo actual del bróker para conciliar la fase activa.',
  'account.edit.error.inactive-phase':
    'El saldo en vivo solo se puede cambiar en una fase activa.',
  'account.edit.error.phase-changed':
    'Los datos de la cuenta cambiaron durante la edición. Vuelve a abrir el editor de la cuenta antes de guardar.',
  'account.profiles.profitable-days-conflict':
    'Conserva tu política de retiro actual o modifica el requisito de días rentables antes de aplicar estas condiciones.',
  'account.prop-challenge.position-limits-not-monitored':
    'Journalit no supervisa los límites de posición ni las reglas de escalado de contratos. Consulta las reglas de tu firma y tu plataforma de trading.',
  'account.prop-challenge.rule.profit-basis.cumulative':
    'Beneficio acumulado de operaciones (los pagos no reducen)',
  'account.prop-challenge.rule.profit-basis': 'Base de beneficios del escalado',
  'account.prop-challenge.rule.manual_review':
    'Revisión de la empresa / condiciones no admitidas',
  'account.prop-challenge.summary.rule.manual_review': 'Revisión de la empresa',
  'account.prop-challenge.ledger.state.needs-review':
    'Se requiere revisión de la empresa',
  'account.prop-challenge.payout.estimated-net': 'Neto estimado del trader',
  'account.prop-challenge.payout.gross-withdrawals':
    'Retiradas brutas de la cuenta',
  'account.prop-challenge.payout.lifetime-gross':
    'Beneficio actual de la fase + todas las retiradas brutas anteriores de la fase (no solo el ciclo de pago)',
  'account.prop-challenge.payout.unresolved-cap':
    'Confirmar el límite con la empresa',
  'account.prop-challenge.payout.marginal-split':
    'Reparto por tramo de beneficio',
  'account.prop-challenge.payout-rules.profit-split.above':
    'Parte del trader por encima del umbral (%)',
  'account.prop-challenge.payout.not-calculated': 'Sin calcular',
  'account.prop-challenge.payout.manual-only':
    'No hay cálculos de retiro disponibles para estas condiciones. Puedes seguir registrando retiros reales.',
  'account.prop-challenge.payout.raise-floor':
    'Elevar el límite al saldo inicial sin reducirlo',
  'account.prop-challenge.rule.comparison': 'Comparación',
  'templateEditor.widget.session-log.hide-empty-outside':
    'Ocultar el registro fuera de sesión cuando esté vacío',
  'account.profiles.correction-title': 'Corrección del catálogo',
  'account.profiles.correction-source': 'Fuente de las reglas',
  'account.profiles.correction-period': 'Historial afectado',
  'account.profiles.correction-history': 'Correcciones de reglas',
  'account.profiles.correction-before': 'Antes',
  'account.profiles.correction-after': 'Después',
  'account.profiles.correction-stale':
    'El historial de la cuenta cambió. Vuelve a abrir esta revisión.',
  'account.profiles.correction-effect': 'Efecto en esta cuenta',
  'account.profiles.not-failed': 'No fallido',
  'account.profiles.correction-consent': 'Recalcular historial',
  'account.profiles.correction-consent-help':
    'Reemplaza las reglas de esta fase para el historial afectado y vuelve a comprobar su resultado. Las operaciones y los pagos no cambian.',
  'account.profiles.correction-period-open': 'Desde {date}',
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
  'widget.mfeScatter.name': 'MFE vs. PnL realizado',
  'widget.mfeScatter.description':
    'Máximo beneficio abierto vs P&L final por operación',
  'widget.excursionScatter.y': 'PnL realizado ({unit})',
  'widget.excursionScatter.winners': 'Ganadoras',
  'widget.excursionScatter.losers': 'Perdedoras',
  'widget.excursionScatter.breakeven': 'Punto de equilibrio',
  'widget.mfeScatter.empty':
    'No hay operaciones cerradas con MFE disponible en esta unidad.',
  'widget.maeScatter.name': 'MAE vs. PnL realizado',
  'widget.maeScatter.description':
    'Máxima pérdida abierta vs P&L final por operación',
  'widget.maeScatter.empty':
    'No hay operaciones cerradas con MAE disponible en esta unidad.',

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
  'trade-sync.tradovate.sync-all-provider-partial':
    'Se sincronizaron {succeeded} de {total} conexiones de Tradovate · sincronización completada en parte',
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
  'trade-sync.ctrader.sync-all-provider-partial':
    'Se sincronizaron {succeeded} de {total} conexiones de cTrader · sincronización completada en parte',
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
  'trade-sync.oauth.remap.title': 'Cambiar cuenta',
  'trade-sync.oauth.remap.message':
    '¿Usar {newAccount} también para las notas existentes? Si no, solo las futuras actualizaciones del bróker la usarán.',
  'trade-sync.oauth.remap.update-notes': 'Actualizar notas',
  'trade-sync.oauth.remap.future-only': 'Solo actualizaciones futuras',
  'trade-sync.oauth.remap.unavailable':
    'La reasignación de cuentas no está disponible. Actualiza el servidor de Journalit e inténtalo de nuevo.',
  'trade-sync.oauth.remap.restore-in-progress':
    'Espera a que termine la restauración e inténtalo de nuevo.',
  'trade-sync.oauth.remap.operation-conflict':
    'Esa solicitud de reasignación entró en conflicto con un intento anterior. Inténtalo de nuevo.',
  'trade-sync.oauth.remap.account-busy':
    'Esta cuenta se está sincronizando. Vuelve a intentarlo en breve.',
  'trade-sync.oauth.remap.account-unavailable':
    'Esta cuenta ya no está disponible. Actualiza e inténtalo de nuevo.',
  'trade-sync.oauth.remap.preserved-conflicts':
    '{count} conflicto(s) existente(s) se dejaron sin cambios.',
  'trade-sync.oauth.remap.notes-pending':
    '{count} actualización(es) de notas existentes siguen pendientes. Sincroniza de nuevo para reintentar.',
  'trade-sync.source.ctrader': 'cTrader',
  'trade-sync.source.hyperliquid': 'Hyperliquid',
  'trade-sync.source.hyperliquid.description':
    'Sincronización de solo lectura de perpetuos USDC de Hyperliquid, configurada en Journalit.co y escrita en esta bóveda.',
  'onboarding.broker.option.hyperliquid-sync.label':
    'Hyperliquid (perpetuos USDC)',
  'trade-sync.hyperliquid.recovery-title':
    'Restaurar notas de operaciones faltantes',
  'trade-sync.hyperliquid.recovery-count':
    '{count} nota(s) de operaciones para restaurar',
  'trade-sync.hyperliquid.recovery-select-account':
    'Selecciona una cuenta local antes de restaurar notas de operaciones.',
  'trade-sync.hyperliquid.recovery-confirm':
    '¿Restaurar {count} nota(s) de operaciones en {account}?',
  'trade-sync.hyperliquid.scope-description':
    'La sincronización solo cubre perpetuos liquidados en USDC, y el historial que Hyperliquid ofrece a través de su API puede estar incompleto. La importación CSV sigue disponible, pero las operaciones que coincidan entre CSV y la sincronización no se deduplican automáticamente.',
  'trade-sync.hyperliquid.description':
    'Solo lectura: conecta una dirección de wallet y elige cuentas e historial en Journalit.co. Aquí asignas cada cuenta a una cuenta de Journalit y sincronizas las operaciones en esta bóveda.',
  'trade-sync.hyperliquid.manage-on-website': 'Gestionar en Journalit.co',
  'trade-sync.hyperliquid.connect-on-website': 'Conectar en Journalit.co',
  'trade-sync.hyperliquid.manage-connection': 'Gestionar en el sitio web',
  'trade-sync.hyperliquid.pending-acks':
    '{count} actualización(es) de la bóveda pendiente(s) de confirmación.',
  'trade-sync.hyperliquid.disabled':
    'La sincronización de Hyperliquid aún no está disponible.',
  'trade-sync.hyperliquid.status-failed':
    'No se pudo cargar el estado de Hyperliquid.',
  'trade-sync.hyperliquid.no-connections':
    'Aún no hay conexiones de Hyperliquid. Conecta una dirección de wallet en Journalit.co y vuelve aquí.',
  'trade-sync.hyperliquid.never': 'Nunca',
  'trade-sync.hyperliquid.last-sync': 'Última sincronización',
  'trade-sync.hyperliquid.reconciliation-issues':
    '{count} problema(s) de conciliación',
  'trade-sync.hyperliquid.status.pending': 'Detectando cuentas',
  'trade-sync.hyperliquid.status.setup-required': 'Configuración necesaria',
  'trade-sync.hyperliquid.status.paused': 'En pausa',
  'trade-sync.hyperliquid.status.attention': 'Requiere atención',
  'trade-sync.hyperliquid.status.error': 'Error de conexión',
  'trade-sync.hyperliquid.status.deleting': 'Eliminando datos en la nube',
  'trade-sync.hyperliquid.notice.setup-required':
    'Elige en Journalit.co qué cuentas e historial sincronizar.',
  'trade-sync.hyperliquid.notice.paused':
    'La sincronización está en pausa. Las notas existentes se conservan. Reanúdala en Journalit.co.',
  'trade-sync.hyperliquid.notice.attention':
    'Esta conexión requiere atención. Revísala en Journalit.co o contacta con soporte.',
  'trade-sync.hyperliquid.account.selected': 'Seleccionada para sincronizar',
  'trade-sync.hyperliquid.account.not-selected': 'No seleccionada',
  'trade-sync.hyperliquid.claimed-by-connection':
    'Sincronizada mediante {connection}.',
  'trade-sync.hyperliquid.mapping-required':
    'Primero elige una cuenta de Journalit para cada cuenta seleccionada.',
  'trade-sync.hyperliquid.sync-to-vault': 'Sincronizar',
  'trade-sync.hyperliquid.sync-all': 'Sincronizar todo',
  'trade-sync.hyperliquid.sync-complete':
    'Sincronización de {connection} completada.',
  'trade-sync.hyperliquid.sync-partial':
    'Sincronización de {connection} completada con problemas.',
  'trade-sync.hyperliquid.sync-all-complete':
    'Se sincronizaron {succeeded} de {total} conexiones de Hyperliquid.',
  'trade-sync.hyperliquid.sync-all-partial':
    'Se sincronizaron {succeeded} de {total} conexiones de Hyperliquid. Revisa las conexiones con problemas.',
  'trade-sync.hyperliquid.sync-all-provider-partial':
    'Se sincronizaron {succeeded} de {total} conexiones de Hyperliquid · sincronización completada en parte',
  'trade-sync.source.ctrader.description':
    'Sincroniza las operaciones de cTrader en la nube y llévalas a esta bóveda.',
  'trade-sync.ctrader.status-failed': 'No se pudo cargar el estado de cTrader.',
  'trade-sync.ctrader.last-sync': 'Última sincronización',
  'trade-sync.ctrader.pending-acks': '{count} ACK(s) locales pendientes',
  'trade-sync.ctrader.never': 'Nunca',

  
  
  

  
  'command.add-trade': 'Añadir Nueva Operación',
  'command.quick-import-trades': 'Importación rápida de operaciones',
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

  
  
  

  
  
  
  'form.section.trade-details': 'Detalles de la Operación',
  'form.section.trading-costs': 'Costos de Trading',
  'form.section.risk-management': 'Gestión de Riesgo',
  'form.section.take-profits': 'Take profits',
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
  'form.layout.back-to-trade': 'Volver a la operación',
  'form.layout.save-layout': 'Guardar diseño',
  'form.layout.discard-changes.body':
    '¿Descartar la personalización sin guardar? Se conservará el borrador de tu operación.',
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
  'form.field.stop-loss': 'Stop loss',
  'form.field.take-profit': 'Take profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Precio objetivo',
  'form.field.close-percent': 'Cierre %',
  'form.field.close-size': 'Tamaño de cierre',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': 'Cantidad de cierre del Take Profit como',
  'form.layout.take-profit-unit-percent': 'Cierre %',
  'form.layout.take-profit-unit-size': 'Tamaño',
  'trade.validation.take-profit-size-number':
    'El tamaño del take profit debe ser un número válido.',
  'trade.validation.take-profit-size-positive':
    'El tamaño del take profit debe ser mayor que 0.',
  'trade.validation.take-profit-total-size-range':
    'Los tamaños de take profit no pueden superar el tamaño de la posición.',
  'form.field.risk-amount': 'Monto en Riesgo',
  'form.field.profit-loss': 'Ganancia/Pérdida',
  'form.field.total-pnl': 'P&L de la operación',
  'form.field.realized-pnl': 'P&L Realizado',
  'form.field.floating-pnl': 'P&L Flotante',
  'form.field.total-costs': 'Costos Totales:',
  'form.field.setup': 'Setup',
  'form.field.mistake': 'Error',
  'form.field.tags': 'Etiquetas',
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
  'form.placeholder.stop-loss': 'Precio de stop',
  'form.layout.stop-loss-unit': 'Importe del stop loss como',
  'form.layout.stop-loss-unit-percent': '% de la posición',
  'form.layout.stop-loss-unit-size': 'Tamaño',
  'form.field.stop-loss-short': 'SL',
  'form.field.stop-price': 'Precio de stop',
  'form.field.stop-loss-percent': '% de la posición',
  'form.field.stop-loss-size': 'Tamaño',
  'form.action.remove-stop-loss': 'Eliminar stop loss',
  'form.stop-loss.coverage': 'Los stops cubren el {percent} de la posición.',
  'form.stop-loss.coverage-partial':
    'El riesgo usa el Monto en Riesgo hasta que cada unidad tenga un stop.',
  'form.placeholder.stop-loss-rest': 'Resto',
  'form.empty.stop-losses': 'Aún no hay stop loss',
  'tradelog.tooltip.stop-losses': 'Stop loss',
  'form.placeholder.stop-loss-size-amount': '{size} unidades',
  'trade.validation.stop-loss-price-required':
    'El precio del stop loss es obligatorio.',
  'trade.validation.stop-loss-close-percent-number':
    'El porcentaje del stop loss debe ser un número válido.',
  'trade.validation.stop-loss-close-percent-range':
    'El porcentaje del stop loss debe estar entre 1 y 100.',
  'trade.validation.stop-loss-size-number':
    'El tamaño del stop loss debe ser un número válido.',
  'trade.validation.stop-loss-size-positive':
    'El tamaño del stop loss debe ser mayor que 0.',
  'trade.validation.stop-loss-single-blank-amount':
    'Solo un stop loss puede dejar su importe en blanco.',
  'trade.validation.stop-loss-total-over-position':
    'Los stop loss cubren más que la posición.',
  'trade.details.stop-loss-count': '{count} stops',
  'form.placeholder.target-price': 'Precio objetivo',
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
  'form.entry-exit.backtest-day':
    'Fechado el {date}, el día de tu última operación de backtest.',
  'form.entry-exit.use-today': 'Usar hoy',
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
  'form.entry-exit.direct-pnl':
    'Introducir directamente el P&L base de la operación en lugar de precios',
  'form.entry-exit.direct-pnl-desc':
    'Introduce la ganancia/pérdida de la operación antes de dividendos. La comisión y las tarifas se seguirán aplicando por separado.',
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
  'form.trade-type.missed': 'Operación no tomada',
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
    'Tienes cambios sin guardar en este layout.',
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

  'form.field.mae-placeholder-currency': 'Drawdown máximo en {currency}',
  'form.field.mfe-placeholder-currency': 'Beneficio máximo en {currency}',
  'form.calculated': 'Calculado',

  
  'form.field.image-url-placeholder':
    'Pega la URL o ruta del archivo multimedia...',
  'form.field.image-duplicate-error': 'Esta imagen ya está agregada.',
  'form.field.trade-image-alt': 'Imagen de Operación',

  
  'form.account-empty-state.title': 'Configura tu primera cuenta',
  'form.account-empty-state.description':
    'Las cuentas registran tu saldo para que Journalit pueda calcular rentabilidad, riesgo y drawdown. Crear una solo necesita un nombre.',
  'form.account-empty-state.create-account': 'Crear Cuenta',
  'form.account-empty-state.submit-disabled':
    'Crea una cuenta primero para guardar esta operación.',
  'form.empty.take-profits': 'Aún no hay objetivos de take profit',
  'form.action.remove-take-profit': 'Quitar take profit',
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
  'button.delete-all': 'Eliminar Todo',
  'button.clear-all': 'Limpiar Todo',

  'button.cancel-reset': 'Cancelar Restablecimiento',
  'button.proceed-anyway': 'Continuar de Todos Modos',
  'button.mark-reviewed': 'Marcar como Revisado',
  'button.maybe-later': 'Quizás Después',
  'button.upgrade-now': 'Actualizar Ahora',

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
    'Las operaciones no tomadas deben tener datos de salida con precios distintos de cero. Representan oportunidades que ya han pasado, por lo que debes especificar cuál habría sido el precio de salida.',
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
    'El precio del take profit es obligatorio.',
  'trade.validation.take-profit-price-number':
    'El precio del take profit debe ser un número.',
  'trade.validation.take-profit-price-valid-number':
    'El precio del take profit debe ser un número válido.',
  'trade.validation.take-profit-close-percent-number':
    'El porcentaje de cierre del take profit debe ser un número.',
  'trade.validation.take-profit-close-percent-valid-number':
    'El porcentaje de cierre del take profit debe ser un número válido.',
  'trade.validation.take-profit-close-percent-range':
    'El porcentaje de cierre del take profit debe estar entre 1 y 100.',
  'trade.validation.take-profit-total-close-percent-range':
    'Los porcentajes de cierre del take profit no pueden superar 100.',
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

  'notice.setups-added': 'Setups añadidos a {count} operaciones',
  'notice.tags-added': 'Etiquetas añadidas a {count} operaciones',
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
  'notice.error.open-trade-log':
    'No se pudo abrir el Registro de operaciones: {error}',
  'notice.error.open-csv-import': 'No se pudo abrir Trade Import: {error}',
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
  'notice.error.no-template-support': 'Este tipo de nota no admite layouts.',
  'notice.error.no-templates':
    'No hay layouts disponibles para este tipo de nota.',
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
  'notice.error.add-setups': 'Error al añadir setups: {error}',
  'notice.error.add-tags': 'Error al añadir etiquetas: {error}',
  'notice.error.add-mistakes': 'Error al añadir errores: {error}',
  'notice.error.duplicate-trades': 'Error al duplicar operaciones: {error}',
  'notice.error.delete-trades': 'Error al eliminar operaciones: {error}',
  'notice.error.cannot-delete-builtin':
    'No se pueden eliminar los layouts integrados',
  'notice.error.duplicate-to-customize':
    'Duplica este layout para personalizarlo',
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

  'notice.trade-updated': '{type} actualizada: {path}',
  'notice.trade-created': '{type} creada: {path}',
  'notice.new-trade-created':
    'Nueva operación creada: {instrument} {direction}',
  'notice.error.trade-update-failed': 'Error al actualizar {type}: {error}',
  'notice.error.trade-create-failed': 'Error al crear {type}: {error}',
  'notice.template-applied': 'Layout aplicada: {name}',

  'notice.csv-template-deleted': 'Plantilla "{name}" eliminada',
  'notice.csv-template-delete-failed': 'Error al eliminar plantilla: {error}',
  'notice.csv-template-imported': 'Plantilla "{name}" importada exitosamente',
  'notice.csv-missing-fields':
    'Asigna todos los campos obligatorios antes de generar una vista previa.',
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
  'notice.error.switch-template-generic': 'Error al cambiar layout',

  'notice.error.cannot-change-folder-during-sync':
    'No se puede cambiar la ruta de la carpeta mientras la sincronización está en progreso. Por favor espera a que se complete la sincronización.',
  'notice.error.file-not-found': 'Archivo no encontrado: {path}',
  'notice.plugin-updated': '¡Journalit actualizado a v{version}!',
  'notice.error.template-save-failed': 'No se pudo guardar el layout',
  'notice.default-trade-template-updated':
    'Layout de operación predeterminado actualizado',
  'notice.trade-template-duplicated': 'Layout de operación duplicada',
  'notice.trade-template-deleted': 'Layout de operación eliminada',
  'notice.error.create-template': 'No se pudo crear el layout',
  'notice.error.duplicate-template': 'No se pudo duplicar el layout',
  'notice.error.delete-template': 'No se pudo eliminar el layout',
  'notice.settings-reset-with-backup':
    'Configuración restablecida. Se creó un respaldo automáticamente.',
  'notice.settings-reset-no-backup':
    'Configuración restablecida. No se pudo crear un respaldo.',

  
  
  
  'tradelog.title': 'Registro de Operaciones',
  'tradelog.root.all-trades': 'Todas las Operaciones',
  'tradelog.view.selector.label': 'Vista',

  'trade-form.guide.customization-page.title':
    'Adapta el formulario a tu flujo de trabajo',
  'trade-form.guide.customization-page.description':
    'Aquí puedes mostrar, ocultar y reordenar bloques opcionales. Mantén el formulario centrado en los campos que realmente usas.',
  'trade-form.guide.finish.title': 'Esa es la función de personalización',
  'trade-form.guide.finish.description':
    'Puedes volver a este botón cuando necesites que el formulario se adapte a otro flujo de trabajo de diario.',
  'tradelog.guide.empty.intro.title': 'Bienvenido al Registro de operaciones',
  'tradelog.guide.empty.intro.description':
    'Esta página será tu lugar principal para explorar, ordenar y revisar operaciones. Cuando añadas operaciones, también tendrás el recorrido completo del Registro de operaciones.',
  'tradelog.guide.empty.state.title': 'No hay datos de trading disponibles',
  'tradelog.guide.empty.state.description':
    'Importa operaciones anteriores para explorar tu rendimiento ahora o registra una nueva operación manualmente.',
  'tradelog.guide.intro.title': 'Este es tu Registro de operaciones',
  'tradelog.guide.intro.description':
    'Usa esta página para revisar operaciones una a una, ordenarlas, filtrarlas y modificar muchas a la vez.',
  'tradelog.guide.view-selector.title':
    'Elige cómo quieres revisar tu historial',
  'tradelog.guide.view-selector.description':
    'Usa este menú para cambiar entre la tabla completa de operaciones y vistas agrupadas por periodos como meses, semanas o días. Operaciones es la vista predeterminada, pero las agrupadas son útiles para revisar por periodo.',
  'tradelog.guide.filters.title':
    'Usa filtros para acotar el Registro de operaciones',
  'tradelog.guide.filters.description':
    'Abre los filtros cuando quieras revisar solo ciertas cuentas, setups, etiquetas, tipos de operación, estados o fechas. También puedes excluir cualquier valor para dejar fuera esas operaciones.',
  'tradelog.guide.sorting.title':
    'Haz clic en los encabezados para ordenar la tabla',
  'tradelog.guide.sorting.description':
    'En la vista Operaciones, haz clic en el encabezado de una columna ordenable para reordenar la tabla. Por ejemplo, haz clic en P&L neto para ordenar por tu mayor ganancia y tu mayor pérdida.',
  'tradelog.guide.gallery-mode.title': 'También hay una galería de imágenes',
  'tradelog.guide.gallery-mode.description':
    'Cambia de modo aquí para explorar las capturas de tus operaciones como una galería. Una guía breve te la mostrará la primera vez que la abras.',
  'tradelog.guide.open-trades.title':
    'Haz clic en una operación para abrir su nota',
  'tradelog.guide.open-trades.description':
    'En modo normal, al hacer clic en una operación se abre. En modo de selección múltiple, el clic la selecciona. Cambia entre ambos comportamientos según lo que quieras hacer.',
  'dashboard.guide.empty.intro.title': 'Bienvenido a tu Panel',
  'dashboard.guide.empty.intro.description':
    'Tu panel resulta útil en cuanto Journalit dispone de historial de trading para analizar.',
  'dashboard.guide.empty.state.title': 'Lleva contigo tu historial de trading',
  'dashboard.guide.empty.state.description':
    'Importa operaciones anteriores para empezar con datos de rendimiento significativos o añade una operación manualmente si estás registrando tus primeras operaciones.',
  'dashboard.guide.main.intro.title': 'Este es tu panel',
  'dashboard.guide.main.intro.description':
    'Usa esta página para seguir tu rendimiento, revisar tus estadísticas y tener tus gráficos más útiles en un solo lugar.',
  'dashboard.guide.main.filters.title': 'Los filtros cambian todo el Panel',
  'dashboard.guide.main.filters.description':
    'Usa los filtros cuando quieras que cada estadística y gráfico de esta página se actualice para otro rango de fechas, cuenta, setup, etiqueta o tipo de operación. También puedes excluir cualquier valor para dejar fuera esas operaciones.',
  'dashboard.guide.main.edit-layout.title':
    'Activa el modo edición para personalizar esta página',
  'dashboard.guide.main.edit-layout.description':
    'Haz clic en Editar diseño para poder mover, redimensionar, quitar y añadir widgets del Panel.',
  'dashboard.guide.main.open-widget-selector.title': 'Abre Añadir widget',
  'dashboard.guide.main.open-widget-selector.description':
    'Haz clic en Añadir widget para añadir más gráficos y recuperar los widgets que quitaste antes.',
  'dashboard.guide.main.widget-picker.title': 'Elige qué quieres mostrar',
  'dashboard.guide.main.widget-picker.description':
    'Este panel muestra una vista previa de cada gráfico y métrica. Haz clic en uno para añadirlo; lo que ya está en tu Panel aparece en En uso.',
  'dashboard.guide.main.metrics.title':
    'Estas tarjetas superiores son tu resumen rápido',
  'dashboard.guide.main.metrics.description':
    'La fila superior te da respuestas rápidas como beneficio, tasa de acierto y total de operaciones. En modo edición puedes cambiar qué tarjetas aparecen y reordenarlas.',
  'dashboard.guide.main.bottom.title':
    'Aquí es donde se mueve y se redimensiona',
  'dashboard.guide.main.bottom.description':
    'Con Editar diseño activado, arrastra un widget para moverlo. Para cambiar su tamaño, arrastra su esquina inferior derecha. Es el paso que más usuarios pasan por alto.',
  'dashboard.guide.main.save-layout.title': 'Guarda tu diseño cuando termines',
  'dashboard.guide.main.save-layout.description':
    'Cuando termines de personalizar, haz clic en Guardar diseño para conservar los cambios. Puedes volver a editar esta página cuando quieras.',
  'home.guide.intro.title': 'Bienvenido a casa',
  'home.guide.intro.description':
    'Esta es tu página principal. Muestra tus estadísticas de trading, acciones rápidas y accesos directos al resto de Journalit.',
  'home.guide.filters.title':
    'Estos botones cambian lo que muestran tus widgets',
  'home.guide.filters.description':
    'Filtra por periodo, tipo de operación o cuenta. Elige Semana o define fechas Desde/Hasta inclusivas con Rango personalizado. Los widgets que dependen del periodo siguen tu selección; los widgets en vivo siguen en vivo.',
  'home.guide.customize.title':
    'Activa el modo edición para personalizar Inicio',
  'home.guide.customize.description':
    'Haz clic en este botón para empezar a personalizar. El modo edición permite mover, redimensionar, quitar y añadir widgets.',
  'home.guide.quick-links-position.title':
    'Mueve los Enlaces rápidos encima o debajo de los widgets',
  'home.guide.quick-links-position.description':
    'Usa este botón para elegir si la fila de Enlaces rápidos va encima o debajo del área principal de widgets.',
  'home.guide.quick-links.title':
    'Estos Enlaces rápidos son tus accesos directos',
  'home.guide.quick-links.description':
    'Los Enlaces rápidos son accesos de un clic a acciones y páginas habituales. En modo edición también puedes ocultar los que no quieras ver aquí.',
  'home.guide.move-and-resize.title': 'Mueve y redimensiona tus widgets',
  'home.guide.widget-picker.title': 'Añade widgets aquí',
  'home.guide.widget-picker.description':
    'Previsualiza y añade widgets, restaura enlaces rápidos o añade accesos directos a cuentas y setups. Todo lo que ya está en Inicio aparece en «En uso», donde puedes quitarlo.',
  'home.guide.move-and-resize.description':
    'Esta es el área principal que puedes reorganizar en modo edición. Arrastra los widgets para moverlos o arrastra un widget desde su esquina inferior derecha para redimensionarlo.',
  'home.guide.add-widget.title': 'Añade elementos a Inicio',
  'home.guide.add-widget.description':
    'Abre Añadir Widget para añadir widgets, enlaces rápidos o accesos directos a cuentas y setups.',
  'home.guide.save-layout.title': 'Guarda tu diseño cuando termines',
  'home.guide.save-layout.description':
    'Cuando estés conforme con el diseño, haz clic en este botón para guardar los cambios y salir del modo edición.',
  'layoutBuilder.guide.intro.title': 'Este es tu Constructor de diseño',
  'layoutBuilder.guide.intro.description':
    'Esta página controla cómo se estructuran tus layouts de revisión. La forma más fácil de empezar es duplicar un layout integrado y luego personalizar tu copia.',
  'layoutBuilder.guide.create-own-layout.title': 'Crea tu propio diseño',
  'layoutBuilder.guide.create-own-layout.description':
    'Los diseños integrados son de solo lectura. Haz clic en el icono de copiar de un diseño DRC integrado para duplicarlo, o pulsa + para empezar uno nuevo. Pulsa Siguiente para duplicar el DRC estándar.',
  'layoutBuilder.guide.editor-overview.title': 'Aquí editas el layout',
  'layoutBuilder.guide.editor-overview.description':
    'Cambia aquí el nombre del layout, revisa la lista de widgets, arrastra el asa izquierda para reordenarlos, haz clic en un widget para cambiarlo y quita lo que no necesites.',
  'layoutBuilder.guide.add-widget.title': 'Añade un widget',
  'layoutBuilder.guide.add-widget.description':
    'Usa Agregar Widget para añadir un bloque al final de tu diseño, o pasa el cursor entre dos widgets y haz clic en + para insertarlo exactamente donde quieras.',
  'layoutBuilder.guide.choose-widget.title': 'Elige un widget',
  'layoutBuilder.guide.choose-widget.description':
    'Escribe en el cuadro de búsqueda para encontrar un widget por nombre, descripción o categoría y selecciónalo. También puedes pulsar Siguiente y Journalit elegirá el primer resultado.',
  'layoutBuilder.guide.save-template.title': 'Guarda tu diseño',
  'layoutBuilder.guide.save-template.description':
    'Cuando tu copia esté como quieres, guárdala. Puedes seguir mejorándola más adelante a medida que mejore tu proceso de revisión.',
  'layoutBuilder.guide.set-default-template.title':
    'Hazlo tu diseño predeterminado',
  'layoutBuilder.guide.set-default-template.description':
    'Haz clic en la estrella de tu nuevo layout si quieres que las nuevas notas de revisión lo usen automáticamente.',
  'layoutBuilder.guide.whats-new.insert-slot.title':
    'Añade un widget donde quieras',
  'layoutBuilder.guide.whats-new.insert-slot.description':
    'Pasa el cursor entre dos widgets y pulsa + para añadir un widget justo ahí, en lugar de al final.',
  'layoutBuilder.guide.whats-new.add-widget-button.title': 'O añádelo al final',
  'layoutBuilder.guide.whats-new.add-widget-button.description':
    'Añadir widget sigue añadiendo al final del diseño, y ahora se desplaza al nuevo widget y abre su búsqueda.',
  'tradelog.empty': 'No se encontraron operaciones',
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

  'tradelog.filter.winners': 'Ganadoras',
  'tradelog.filter.losers': 'Perdedoras',
  'tradelog.filter.breakeven': 'Punto de equilibrio',
  'tradelog.filter.open': 'Abiertas',
  'tradelog.filter.closed': 'Cerradas',

  'tradelog.type.regular': 'Regular',
  'tradelog.type.missed': 'No tomada',
  'tradelog.type.backtest': 'Backtesting',

  
  'tradelog.status.win': 'GANANCIA',
  'tradelog.status.loss': 'PÉRDIDA',
  'tradelog.status.open': 'ABIERTA',
  'tradelog.status.cancelled': 'CANCELADA',
  'tradelog.status.breakeven': 'SIN CAMBIO',
  'tradelog.status.missed': 'NO TOMADA',
  'tradelog.status.backtest': 'BACKTESTING',
  'tradelog.status.expired': 'VENCIDA',

  'tradelog.no-columns': 'Sin columnas configuradas',
  'tradelog.duration.ongoing': '(en curso)',
  'tradelog.tooltip.mistakes': 'Errores:',
  'tradelog.tooltip.setups': 'Setups:',
  'tradelog.tooltip.tags': 'Etiquetas:',
  'tradelog.tooltip.thesis': 'Tesis:',
  'tradelog.tooltip.mtComment': 'Comentario MT:',
  'tradelog.tooltip.accounts': 'Cuentas:',
  'tradelog.copy-trade.tooltip': 'Copiada de {account} a {multiplier}x',
  'tradelog.tooltip.partial-exits': 'Salidas Parciales:',
  'tradelog.copy-trade.base-tooltip-title': 'Resultados de la cuenta copiada',
  'tradelog.copy-trade.adjustment-action': 'Ajustar el P&L copiado',
  'tradelog.copy-trade.adjustment-title': 'Ajustar el P&L copiado',
  'tradelog.copy-trade.adjustment-description-primary':
    'Introduce el ajuste manual de P&L para esta operación copiada.',
  'tradelog.copy-trade.adjustment-description-secondary':
    'Usa un número negativo para peores ejecuciones o costes.',
  'tradelog.copy-trade.adjustment-preview': 'Vista previa del P&L neto:',

  'tradelog.copy-trade.adjustment-invalid':
    'Introduce un ajuste de P&L válido.',
  'tradelog.copy-trade.adjustment-saved':
    'Ajuste de P&L de la operación copiada guardado.',
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
  'tradelog.batch.setups.title': 'Añadir setups a operaciones',
  'tradelog.batch.setups.placeholder': 'Seleccionar o crear setups...',
  'tradelog.batch.tags.title': 'Añadir etiquetas a las operaciones',
  'tradelog.batch.tags.placeholder': 'Selecciona o crea etiquetas...',
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
  'tradelog.batch.add-setups.aria': 'Añadir setups',

  'tradelog.batch.add-setups.label': 'Añadir setups',
  'tradelog.batch.add-tags.aria': 'Añadir etiquetas',

  'tradelog.batch.add-tags.label': 'Añadir etiquetas',
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
    'Mostrar etiquetas, setups y errores como insignias',
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
  'tradelog.column.stopLoss': 'Stop loss',
  'tradelog.column.slDistanceDollar': 'Dist. SL $',
  'tradelog.column.slDistancePercent': 'Dist. SL %',
  'tradelog.column.riskAmount': 'Riesgo $',
  'tradelog.column.rMultiple': 'R:R',
  'tradelog.column.maxR': 'R máx.',
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
  'tradelog.column.returnPercent': 'Rentabilidad %',
  'tradelog.column.setups': 'Setups',
  'tradelog.column.mistakes': 'Errores',
  'tradelog.column.tags': 'Etiquetas',
  'tradelog.column.reviewed': 'Revisada',
  'tradelog.column.tradeRating': 'Valoración',
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
  'dashboard.metrics.maxDrawdown': 'Drawdown máximo',
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
    'Usando el P&L en divisa base proporcionado por el bróker para {count} {tradeLabel}',
  'dashboard.conversion.using-manual-rate':
    'Usando un tipo de cambio manual para {count} {tradeLabel}',
  'dashboard.conversion.partial-warning':
    '⚠ Los costes/riesgo en {currencies} no se pudieron convertir y están excluidos',
  'dashboard.conversion.trade-singular': 'operación',
  'dashboard.conversion.trade-plural': 'operaciones',
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
  'dashboard.widgets.setup-performance.masked-label': 'Setup',
  'dashboard.widgets.tag-performance.title': 'Rendimiento por etiquetas',
  'dashboard.widgets.tag-performance.description':
    'Barras que comparan el rendimiento por etiqueta',
  'dashboard.widgets.tag-performance.empty':
    'No hay datos de rendimiento por etiquetas',
  'dashboard.widgets.tag-performance.masked-label': 'Etiquetas',
  'dashboard.widgets.rating-performance.title': 'Rendimiento por valoración',
  'dashboard.widgets.rating-performance.description':
    'P&L neto o tasa de acierto por cada valoración en estrellas que diste a tus operaciones',
  'dashboard.widgets.rating-performance.empty':
    'Aún no hay operaciones valoradas. Valóralas desde la nota de la operación para compararlas aquí.',
  'dashboard.widgets.rating-performance.masked-label': 'Valoración',
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
  'dashboard.widgets.ticker-performance.tooltip.trades': 'Operaciones: {count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    'Tasa de acierto: {rate} ({wins}G / {losses}P)',

  'dashboard.widgets.ticker-performance.empty':
    'No hay datos de desempeño por ticker',
  'dashboard.widgets.ticker-performance.masked-ticker': 'Símbolo',
  'dashboard.widgets.ticker-performance.omitted-count': '{count} omitidos',

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
    'Este botón se habilita cuando faltan eventos de tu alcance de importación automática guardado. Sigue visible pero desactivado cuando la semana vuelve a estar completa.',
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
    'No hay publicaciones seleccionadas. Los festivos se pueden seguir importando si están activados.',
  'settings.economic-calendar.include-holidays': 'Incluir festivos',
  'settings.economic-calendar.include-holidays-desc':
    'Importa festivos bancarios y actas de bancos centrales como entradas de todo el día.',
  'settings.economic-calendar.open-view': 'Abrir calendario económico',
  'settings.economic-calendar.open-view-desc':
    'Revisa esta semana e importa eventos manualmente.',
  'settings.economic-calendar.pro-required':
    'El calendario económico requiere una suscripción PRO.',

  
  
  

  
  
  
  'account.header.back-to-dashboard': 'Volver al panel',
  'account.header.add-event.aria': 'Agregar Depósito/Retiro',
  'account.header.edit-account.aria': 'Editar Cuenta',
  'account.header.view-trades.aria':
    'Ver operaciones en el Registro de operaciones',
  'account.header.type': 'Tipo:',
  'account.header.initial-balance': 'Saldo Inicial:',
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
  'account.settings.section.inclusion.title': 'Tipos de cuenta del panel',
  'account.settings.section.inclusion.desc':
    'Elige qué tipos de cuenta aparecen en las estadísticas del panel, si cuentan sus retiros y en qué orden se muestran.',
  'account.settings.section.inclusion.include-dashboard':
    'En estadísticas del panel',
  'account.settings.section.inclusion.include-withdrawals': 'Retiros',
  'account.settings.section.inclusion.empty':
    'No hay tipos de cuenta disponibles para configurar.',

  'account.settings.section.order.move-up': 'Subir',
  'account.settings.section.order.move-down': 'Bajar',
  'account.settings.button.save': 'Guardar Configuración',
  'account.settings.button.saving': 'Guardando...',

  
  
  
  'account.create.title': 'Crear Cuenta',
  'account.form.field.name': 'Nombre de Cuenta',
  'account.form.placeholder.name': 'Mi Cuenta de Trading',
  'account.form.field.type': 'Tipo de Cuenta',
  'account.form.type.demo': 'Demo',
  'account.form.type.evaluation': 'Evaluación',
  'account.form.type.funded': 'Fondeada',
  'account.form.field.initial-balance': 'Saldo Inicial',
  'account.form.field.initial-balance-desc':
    'Saldo inicial de la cuenta (por defecto 0)',
  'account.form.field.live-balance': 'Saldo en Vivo',
  'account.form.field.live-balance-desc':
    'Saldo actual del bróker sin crear un movimiento de efectivo',
  'account.form.field.creation-date': 'Fecha de Creación',
  'account.form.field.creation-date-desc': 'Cuándo se creó la cuenta',
  'account.form.field.currency': 'Moneda',
  'account.form.field.currency-desc': 'Moneda nativa de la cuenta para mostrar',
  'account.form.field.drawdown-type': 'Tipo de Drawdown',
  'account.form.field.drawdown-amount': 'Monto de Drawdown',
  'account.form.field.drawdown-amount-desc': 'Límite máximo de drawdown',
  'account.form.field.monthly-cost': 'Costo Mensual',
  'account.form.field.monthly-cost-desc':
    'Cuotas de suscripción, costos de plataforma',
  'account.form.field.target-type': 'Tipo de Objetivo',
  'account.form.field.target-type-desc': 'Absoluto o porcentaje',
  'account.form.field.target-percent': 'Objetivo (%)',
  'account.form.field.target-dollar': 'Objetivo ($)',
  'account.form.field.target-percent-desc': 'Objetivo de ganancia porcentual',
  'account.form.field.target-dollar-desc': 'Objetivo de monto en dólares',
  'account.form.field.target-date': 'Fecha Objetivo',
  'account.form.field.target-date-desc':
    'Fecha para alcanzar el objetivo de ganancias',
  'account.form.unsaved-changes.body':
    'Tienes cambios sin guardar en esta cuenta.',

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
  'account.create.error.profit-target-needs-balance':
    'Un objetivo de ganancias en porcentaje necesita un saldo inicial. Indique uno o use un objetivo en importe.',
  'account.create.error.phase-profit-target-needs-balance':
    'Un objetivo de ganancias en porcentaje necesita un saldo inicial de la fase. Indique uno o use un objetivo en importe.',
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

  'account.edit.field.manual-snapshots': 'Snapshots Manuales de Drawdown',
  'account.edit.field.manual-snapshots-desc':
    'Registra los límites de drawdown que tu bróker establece con el tiempo',
  'account.copy-trading.title': 'Copy Trading',
  'account.copy-trading.description':
    'Deriva el rendimiento de esta cuenta a partir de otra cuenta usando periodos de copia históricos.',
  'account.copy-trading.enable': 'Esta cuenta copia otra cuenta',
  'account.copy-trading.existing-trades-warning':
    'Esta cuenta ya tiene operaciones directas. Se conservarán y las operaciones copiadas se añadirán a partir de la fecha de inicio seleccionada.',
  'account.copy-trading.base-account': 'Cuenta base',
  'account.copy-trading.base-account-desc':
    'Misma divisa, no es una cuenta de copia',
  'account.copy-trading.base-account-placeholder': 'Selecciona la cuenta base',
  'account.copy-trading.multiplier': 'Multiplicador',
  'account.copy-trading.multiplier-desc': 'Rango permitido: 0.1x a 100x',
  'account.copy-trading.all-history': 'Copiar todas las operaciones históricas',
  'account.copy-trading.start-date': 'Copiar desde la fecha',
  'account.copy-trading.history': 'Historial de copia',
  'account.copy-trading.error.base-required':
    'Selecciona una cuenta base para el copy trading.',
  'account.copy-trading.error.multiplier-range':
    'El multiplicador de copy trading debe estar entre 0.1x y 100x.',
  'account.copy-trading.error.start-date-required':
    'Selecciona una fecha de inicio para el copy trading.',
  'account.copy-trading.error.base-account-is-copied':
    'Esta cuenta ya se usa como cuenta base y no puede copiar otra cuenta.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'Esta cuenta es actualmente la base de otra cuenta de copia.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'Las cuentas base no pueden ser también cuentas de copia.',
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
    'Esto hará avanzar el desafío y cambiará el tipo de cuenta a {accountType}.',
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
  'account.prop-challenge.costs.section-title': 'Costes',
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
  'account.edit.button.show-snapshots':
    'Mostrar Administrador de Snapshots ({count} registrados)',
  'account.edit.button.hide-snapshots':
    'Ocultar Administrador de Snapshots ({count} registrados)',
  'account.edit.delete-warning':
    '¡Esta es una acción permanente que no se puede deshacer!',

  
  
  
  'account.drawdown.none': 'Ninguno',
  'account.drawdown.fixed': 'Estático',
  'account.drawdown.eod-trailing': 'Trailing al cierre',
  'account.drawdown.manual': 'Manual',

  
  
  
  'account.profit-target.title': 'Objetivo de ganancias',
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
    'El saldo actual se recalculará a partir del nuevo saldo inicial más todo el P&L de las operaciones.',
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
    'Eliminar también de mi bóveda todas las operaciones vinculadas a esta cuenta',
  
  
  
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

  
  
  
  'account.risk-metrics.title': 'Gestión de Riesgo',
  'account.risk-metrics.drawdown-used': 'Límite de drawdown usado',
  'account.risk-metrics.profit-target': 'Objetivo de Ganancias',
  'account.risk-metrics.profit-target-needs-balance':
    'Un objetivo en porcentaje necesita un saldo inicial como referencia. Indíquelo en Editar cuenta o use un objetivo en importe.',
  'account.risk-metrics.status.breached': 'VIOLADO',
  'account.risk-metrics.status.achieved': 'ALCANZADO',
  'account.risk-metrics.status.in-progress': 'EN PROGRESO',
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
  'account.transaction.edit-row-label':
    'Editar o eliminar esta transacción: {date}, {amount}',

  
  
  
  'account.link-modal.title': 'Nueva Cuenta de Trading Detectada',
  'account.link-modal.account-id': 'ID de Cuenta:',
  'account.link-modal.broker': 'Bróker:',
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
  'account.link-modal.default-name': 'Cuenta-{id}',
  'account.link-modal.button.linking': 'Vinculando...',
  'account.link-modal.notice.select-existing':
    'Por favor seleccione una cuenta existente',
  'account.link-modal.notice.failed': 'Error al vincular cuenta: {error}',

  
  
  

  
  
  
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

  'account-page.guide.empty.intro.title':
    'Esta página muestra una cuenta en detalle',
  'account-page.guide.empty.intro.description':
    'Usa la página de cuenta para gestionar una cuenta, registrar sus eventos y abrir su Registro de operaciones filtrado cuando quieras revisar operaciones.',
  'account-page.guide.empty.edit-account.title':
    'Editar cuenta abre toda la configuración de la cuenta',
  'account-page.guide.empty.edit-account.description':
    'Usa este botón para cambiar el nombre, el tipo, la divisa, las reglas de drawdown, el objetivo de beneficio, el coste mensual de la cuenta y más.',
  'account-page.guide.empty.add-event.title':
    'Añadir evento registra depósitos y retiros',
  'account-page.guide.empty.add-event.description':
    'Usa este botón cada vez que entre o salga dinero de la cuenta fuera de las operaciones normales.',
  'account-page.guide.empty.transactions.title':
    'Aquí se registran los movimientos de efectivo',
  'account-page.guide.empty.transactions.description':
    'Esta sección guarda un registro fila a fila de los depósitos y retiros manuales, que en una cuenta de desafío de prop firm se muestran como Pagos. Cuando esté vacía, usa Añadir evento para crear el primero.',
  'account-page.guide.empty.trade-log.title':
    'Abrir esta cuenta en el Registro de operaciones',
  'account-page.guide.empty.trade-log.description':
    'Este botón del encabezado abre el Registro de operaciones con esta cuenta ya seleccionada, para que la revisión de operaciones se haga en su propia vista.',
  'account-page.guide.main.intro.title':
    'Esta página es el desglose de tu cuenta',
  'account-page.guide.main.intro.description':
    'Usa la página de cuenta para entender bien una cuenta: historial de saldo, rendimiento, límites de riesgo y movimientos de efectivo.',
  'account-page.guide.main.balance-chart.title':
    'El gráfico de saldo muestra más que el saldo',
  'account-page.guide.main.balance-chart.description':
    'Este gráfico muestra la cuenta a lo largo del tiempo, incluidos depósitos y retiros, además de los niveles de drawdown y objetivo de beneficio que configuraste para la cuenta.',
  'account-page.guide.main.metrics.title': 'Rendimiento solo de esta cuenta',
  'account-page.guide.main.metrics.description':
    'Balance, P&L, tasa de acierto y todos los costes de esta cuenta. Las cuentas prop muestran los retiros de beneficios en lugar del flujo de caja neto.',
  'account-page.guide.main.risk.title':
    'El progreso del riesgo se sigue aquí por separado',
  'account-page.guide.main.risk.description':
    'Cuánto de tu límite de drawdown has usado y lo cerca que estás de tu objetivo de beneficio.',
  'account-page.guide.main.transactions.title':
    'Los movimientos de efectivo tienen su propia sección',
  'account-page.guide.main.transactions.description':
    'Depósitos y retiros con el balance tras cada uno, separados de los resultados de trading. Las cuentas prop muestran aquí sus retiros de beneficios.',
  'account.monthly-returns.title': 'Rentabilidad mensual',
  'account.monthly-returns.total': 'Total',
  'account.monthly-returns.view-trades': 'Ver operaciones de {period}',
  'account.monthly-returns.unconverted':
    'No incluidas: cuentas en {currencies} (sin tipo de cambio disponible).',
  'account.monthly-returns.empty': 'Aún no hay rentabilidad mensual.',
  'account.monthly-returns.empty-sub':
    'Aparece cuando una cuenta tiene fondos y se cierra una operación.',
  'account.monthly-returns.error': 'No se pudo cargar la rentabilidad mensual.',
  'account-page.guide.main.monthly-returns.title': 'Rentabilidad mensual',
  'account-page.guide.main.monthly-returns.description':
    'La rentabilidad de cada mes sobre el capital de esta cuenta. Los depósitos y retiros se descuentan, así que nunca cuentan como beneficio, y la columna Total compone los meses. Selecciona un mes o un año para abrir sus operaciones.',
  'account-dashboard.guide.main.monthly-returns.title': 'Rentabilidad mensual',
  'account-dashboard.guide.main.monthly-returns.description':
    'La rentabilidad mensual combinada de las cuentas contabilizadas arriba, ponderada por el capital de cada cuenta. Las cuentas en otras divisas se convierten al tipo de cambio de hoy. Selecciona un mes o un año para abrir sus operaciones.',
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
    'Esta página reúne todas tus cuentas en un solo lugar',
  'account-dashboard.guide.empty.intro.description':
    'Usa Cuentas para ver todas tus cuentas juntas. Cuando existan cuentas, esta página será la forma más rápida de compararlas.',
  'account-dashboard.guide.empty.state.title':
    'Aún no hay nada porque no existe ninguna cuenta',
  'account-dashboard.guide.empty.state.description':
    'El panel queda vacío hasta que crees tu primera cuenta. Después mostrará totales, secciones y accesos directos a la página de cada cuenta.',
  'account-dashboard.guide.empty.create.title': 'Crea aquí tu primera cuenta',
  'account-dashboard.guide.empty.create.description':
    'Haz clic en este botón para crear la primera cuenta que quieres que Journalit siga.',
  'account-dashboard.guide.empty.after-create.title':
    'Al guardar, Journalit abre la página de la cuenta',
  'account-dashboard.guide.empty.after-create.description':
    'Completa los datos básicos de la cuenta y guarda. La siguiente guía continuará en la Página de Cuenta de esa cuenta.',
  'account-dashboard.guide.main.intro.title': 'Estas son tus cuentas',
  'account-dashboard.guide.main.intro.description':
    'Usa esta página para comparar todas tus cuentas en un solo lugar. Los desafíos de prop firm permanecen en los mismos grupos de cuentas, con su fase y el progreso de sus reglas en cada tarjeta.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM significa activos bajo gestión',
  'account-dashboard.guide.main.aum-chart.description':
    'Este gráfico sigue el valor combinado de tus cuentas a lo largo del tiempo. Si hay cuentas de prop firm, un registro de desafíos a su lado añade la tasa de aprobación, los costes, los pagos y los resultados netos.',
  'account-dashboard.guide.main.metrics.title':
    'Estas métricas resumen todas las cuentas visibles',
  'account-dashboard.guide.main.metrics.description':
    'Usa estas estadísticas para obtener una vista rápida a nivel de cuenta antes de profundizar en tipos de cuenta o cuentas concretas.',
  'account-dashboard.guide.main.mode-switch.title':
    'Resumen y Desafíos son dos vistas de las mismas cuentas',
  'account-dashboard.guide.main.mode-switch.description':
    'Resumen mantiene el gráfico de AUM y los totales de la cartera. Cambia a Desafíos para ver la economía de tus desafíos prop: tasa de aprobación, costes, pagos y cuellos de botella por fase en todas las cuentas de desafío.',
  'account-dashboard.guide.main.create-account.title':
    'Puedes crear otra cuenta desde aquí en cualquier momento',
  'account-dashboard.guide.main.create-account.description':
    'Usa este botón cuando quieras añadir una nueva cuenta al panel.',
  'account-dashboard.guide.main.settings-types.title':
    'La configuración permite gestionar los tipos de cuenta disponibles',
  'account-dashboard.guide.main.settings-types.description':
    'En la configuración puedes añadir tipos de cuenta personalizados y eliminar los antiguos si tu forma de trabajar cambia.',
  'account-dashboard.guide.main.settings-stages.title':
    'Las etapas del desafío pueden definir el tipo de cuenta',
  'account-dashboard.guide.main.settings-stages.description':
    'Elige el tipo de cuenta que se aplica cuando un desafío llega a evaluación, financiado en simulación o financiado en real. Deja una etapa en «Sin cambios» para conservar el tipo de cuenta actual.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'La configuración puede cambiar lo que cuenta en los totales',
  'account-dashboard.guide.main.settings-inclusion.description':
    'Puedes ocultar tipos de cuenta de los totales del panel sin eliminarlos y decidir por separado si sus retiros siguen contando.',
  'account-dashboard.guide.main.settings-order.title':
    'Esta sección controla el orden de los grupos de cuentas',
  'account-dashboard.guide.main.settings-order.description':
    'Usa estos controles para decidir qué tipos de cuenta aparecen primero en el panel.',

  'account-dashboard.guide.main.open-account.title':
    'Abre cualquier tarjeta de cuenta para ver más detalle',
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
  'common.section-error': 'Esta sección encontró un error.',
  'common.retry': 'Reintentar',

  'common.warning': 'Advertencia',
  'common.info': 'Información',
  'common.yes': 'Sí',
  'common.no': 'No',

  'common.select-option': 'Selecciona una opción',
  'common.none': 'Ninguno',
  'common.other': 'Otro',
  'common.breakdown': 'Resumen',
  'common.all': 'Todo',

  'common.week': 'Semana',
  'common.month': 'Mes',
  'common.year': 'Año',

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

  'common.enabled': 'activado',
  'common.disabled': 'desactivado',
  'common.unknown': 'Desconocido',
  'common.unknown-error': 'Error desconocido',
  'common.na': 'N/A',
  'common.note-label': 'Nota:',

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
  'chart.tooltip.peak-equity': 'Máximo de P&L realizado',
  'chart.tooltip.episode-start': 'Inicio del episodio',
  'chart.tooltip.underwater-days': 'Tiempo bajo el máximo',
  'chart.tooltip.underwater-trades': 'Operaciones bajo el máximo',

  'chart.tooltip.drawdown-amount': 'Importe',
  'chart.tooltip.drawdown-percent': 'Drawdown % de {basis}',
  'chart.tooltip.percent-basis': 'Base porcentual',
  'chart.tooltip.trade-pnl': 'P&L del Trade',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} más',
  'chart.loading': 'Cargando gráfico...',

  
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': 'Entrada',
  'chart.legend.exit': 'Salida',
  'chart.legend.trade': 'Operación',

  
  
  
  'backend.title': 'Sincronización de operaciones',
  'backend.description':
    'Configura Trade Sync para brokers compatibles y mantén tu bóveda actualizada automáticamente.',

  

  'trade-sync.gate.pro.description':
    'La sincronización de operaciones es una función Pro. Mejora tu plan para continuar.',

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

  'premium.gate.cta.refresh': 'Actualizar estado',

  'premium.gate.offline':
    'Parece que no tienes conexión. La activación requiere internet.',
  'premium.gate.not-pro-yet':
    'Has iniciado sesión, pero tu cuenta aún no es PRO. Mejora tu plan y luego actualiza.',

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
    'Bóveda registrada con el servidor de trading',
  'backend.notice.sync-cancelled': '⏹️ Sincronización cancelada',
  'backend.notice.sync-in-progress': 'Sincronización ya en progreso',
  'backend.notice.account-info-failed':
    'Error al obtener información de la cuenta',
  'backend.notice.sync-batch-progress':
    '⏳ Sincronizando lote: {count} operaciones ({progress}% completo, {remaining} restantes)',
  'backend.notice.all-trades-synced':
    'Todas las {count} operaciones sincronizadas exitosamente',
  'backend.notice.account-created': 'Cuenta creada: {name}',
  'backend.notice.batch-complete':
    '⏳ Lote completo: {processed}/{total} operaciones ({progress}%). Continuando...',
  'backend.notice.sync-complete':
    'Sincronización completa: {total} operaciones procesadas ({newFiles} nuevas, {updated} actualizadas) en {accounts} cuenta(s)',
  'backend.notice.sync-complete-no-trades':
    'Sincronización completa - no se encontraron operaciones nuevas',
  'backend.notice.sync-failed': 'Sincronización fallida: {error}',

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
  'backend.accounts.broker': 'Bróker',
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
  'settings.auth.feature.ai-tool-calls-free':
    '100 llamadas a herramientas de IA/mes',
  'settings.auth.feature.ai-tool-calls-pro':
    'Más llamadas a herramientas de IA',
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

  'settings.auth.sign-in-up': 'Iniciar Sesión / Registrarse',
  'settings.auth.sign-out': 'Cerrar Sesión',

  
  'settings.auth.guest': 'Invitado',

  'settings.auth.your-plan': 'Tu Plan',

  'settings.auth.manage-subscription': 'Gestionar Suscripción',

  
  
  
  'settings.tab.general': 'General',
  'settings.tab.reviews': 'Revisión',

  'settings.tab.customization': 'Personalización',
  'settings.tab.journal-setup': 'Diario',
  'settings.tab.trading': 'Valores predeterminados de operaciones',
  'settings.tab.sync': 'Cuenta y sincronización',
  'settings.page.reviews.title':
    'Layouts de revisión, objetivos y listas de verificación',
  'settings.page.reviews.desc':
    'Abre la configuración completa de revisiones: layouts, objetivos recurrentes y listas de verificación.',
  'settings.page.customization.desc':
    'Abre los campos personalizados, el diseño del formulario, los símbolos, las asignaciones, los setups, los errores, las etiquetas y los eventos.',
  'settings.page.trade-sync.desc':
    'Abre los proveedores de sincronización de brókers, las credenciales FTP, la gestión de cuentas, los diagnósticos y las preferencias de notificaciones de sincronización.',
  'settings.page.general.desc':
    'Moneda, nombre visible, vista de inicio, elementos recientes y preferencias de navegación.',
  'settings.page.sync.desc':
    'Cuenta de Journalit, suscripción, sincronización de operaciones, Trade Import y calendario económico.',
  'settings.page.trading.desc':
    'Valores predeterminados para nuevas operaciones, fechas, riesgo, lógica de punto de equilibrio y preferencias de visualización de análisis.',
  'settings.page.journal.desc':
    'Plantillas de revisión, automatización, campos personalizados, diseño del formulario, símbolos, setups, errores, etiquetas y eventos.',
  'settings.page.advanced.desc':
    'Carpeta del diario, mantenimiento de rutas de imágenes, copia de seguridad de la configuración, importación, exportación y restablecimiento.',
  'settings.page.mcp-access.desc':
    'Permite que las apps de IA que conectes mediante MCP usen esta bóveda, elige qué necesita tu aprobación y revisa la actividad de los agentes.',

  
  
  
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Revisión Semanal',
  'settings.reviews.monthly': 'Revisión Mensual',
  'settings.reviews.quarterly': 'Revisión Trimestral',
  'settings.reviews.yearly': 'Revisión Anual',

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

  'settings.reviews.checklist': 'Lista de verificación DRC',
  'settings.reviews.checklist-desc':
    'Define elementos de lista que aparecen automáticamente en cada nuevo Reporte Diario. Se copian a cada DRC cuando se crea y se pueden editar por día.',
  'settings.reviews.checklist-placeholder': 'Añadir un elemento de lista...',
  'settings.reviews.weekly-checklist': 'Lista de verificación semanal',
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

  'settings.general.break-even-threshold-mode':
    'Tipo de umbral de punto de equilibrio',
  'settings.general.break-even-threshold-mode-desc':
    'Elige si el punto de equilibrio se determina con un rango fijo de P&L o con un porcentaje del saldo actual de la cuenta de cada operación.',
  'settings.general.break-even-mode-fixed': 'Rango de importe fijo',
  'settings.general.break-even-mode-percent':
    'Porcentaje del saldo actual de la cuenta',
  'settings.general.break-even-percent': 'Porcentaje de punto de equilibrio',
  'settings.general.break-even-percent-desc':
    'Umbral simétrico alrededor de cero (±X% del saldo actual de la cuenta). Las operaciones sin un saldo de cuenta disponible se excluyen de las estadísticas de ganancias y pérdidas.',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'Porcentaje de punto de equilibrio sobre el saldo actual de la cuenta',
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
    'Incluir cuentas de copia en los análisis de todas las cuentas',
  'settings.general.include-copy-accounts-analytics-desc':
    'Si está activado, los análisis de trading de todas las cuentas incluyen los resultados derivados de las cuentas de copia y los cuentan como operaciones a nivel de cuenta.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Incluir cuentas de copia en los análisis de todas las cuentas',
  'settings.general.include-copy-accounts-toggled':
    'Cuentas de copia en los análisis de todas las cuentas: {status}',
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
    'Mostrar recordatorios de actualización y novedades después de actualizar.',
  'settings.general.update-notifications-aria':
    'Mostrar notificaciones de actualización',

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

  'settings.customization.setups': 'Setups',
  'settings.customization.mistakes': 'Errores',
  'settings.customization.tags': 'Etiquetas',
  'settings.customization.events': 'Eventos',

  'settings.customization.options.confirm.update-notes':
    'OK (Actualizar Notas)',
  'settings.customization.options.confirm.save-name': 'Guardar Solo Nombre',
  'settings.customization.options.confirm.cancel': 'Cancelar Acción',
  'settings.customization.options.type.tickers': 'Símbolos',
  'settings.customization.options.type.accounts': 'Cuentas',
  'settings.customization.options.type.account-types': 'Tipos de Cuenta',
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
  'settings.customization.options.field.pip-size': 'Tamaño del Pip',
  'settings.customization.options.field.priority': 'Prioridad:',
  'settings.customization.options.field.default-event-notes':
    'Notas predeterminadas del evento:',
  'settings.customization.options.placeholder.default-event-notes':
    'Notas que se autocompletarán cuando se seleccione este evento',
  'settings.customization.options.aria.confirm-add': 'Confirmar añadir {type}',
  'settings.customization.options.label.locked': 'Bloqueado',
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

  'settings.customization.options.commission.costs': 'Costes',
  'settings.customization.options.commission.add-rule':
    '+ Añadir regla de costes',
  'settings.customization.options.commission.applies-to': 'Se aplica a',
  'settings.customization.options.commission.method': 'Método',
  'settings.customization.options.commission.entry': 'Entrada',
  'settings.customization.options.commission.exit': 'Salida',
  'settings.customization.options.commission.round-trip': 'Ida y vuelta',
  'settings.customization.options.commission.all-accounts': 'Todas las cuentas',
  'settings.customization.options.commission.per-side': 'Por lado',
  'settings.customization.options.commission.remove-rule':
    'Quitar regla de costes',
  
  
  
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

  'settings.customization.custom-fields.editor.trade-log':
    'Registro de operaciones',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'Controla cómo aparece este campo cuando se añade como columna del Registro de operaciones',
  'settings.customization.custom-fields.editor.column-label':
    'Etiqueta de columna en el Registro de operaciones',
  'settings.customization.custom-fields.editor.column-label-desc':
    'Etiqueta más corta opcional que solo se usa en el encabezado del Registro de operaciones',
  'settings.customization.custom-fields.editor.column-label-placeholder':
    'Usa la etiqueta del campo por defecto',
  'settings.customization.custom-fields.editor.display-as-currency':
    'Mostrar como moneda',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    'Formatea este campo numérico como un valor monetario solo en el registro de operaciones',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'Orden del desplegable',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'Desactivado por defecto. Activa la ordenación solo si este desplegable tiene un orden significativo.',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'Desactivado',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'Alfabético',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'Numérico',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'Orden de opciones configurado',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'Vista contraída',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'Elige cómo se muestran los valores de selección múltiple cuando el modo expandido del Registro de operaciones está desactivado',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'Insignia de recuento',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'Lista de valores',

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
  'settings.customization.custom-fields.convert.action':
    'Convertir {fieldLabel} en Valoración',
  'settings.customization.custom-fields.convert.title':
    'Convertir {fieldLabel} en Valoración',
  'settings.customization.custom-fields.convert.editor-name':
    'Valoración integrada',
  'settings.customization.custom-fields.convert.editor-desc':
    'Journalit tiene una valoración con estrellas para cada operación. Pasa a ella el valor de {fieldLabel} de cada operación.',
  'settings.customization.custom-fields.convert.intro':
    'El valor de {fieldLabel} de cada operación se convierte en su valoración con estrellas. Tus valores de {fieldLabel} se conservan hasta que elimines el campo.',
  'settings.customization.custom-fields.convert.empty':
    'Ninguna operación tiene un valor de {fieldLabel}.',
  'settings.customization.custom-fields.convert.scale-label':
    'Escala de {fieldLabel}',
  'settings.customization.custom-fields.convert.scale-out-of': 'Sobre {max}',
  'settings.customization.custom-fields.convert.scale-custom': 'Personalizada',
  'settings.customization.custom-fields.convert.scale-custom-max':
    'Valor máximo',
  'settings.customization.custom-fields.convert.table':
    'Valores de {fieldLabel} y sus valoraciones',
  'settings.customization.custom-fields.convert.col-trades': 'Operaciones',
  'settings.customization.custom-fields.convert.value-rating':
    'Valoración para {value}',
  'settings.customization.custom-fields.convert.skip': 'No se convierte',
  'settings.customization.custom-fields.convert.unreadable.one':
    '{count} operación tiene un valor que no se puede leer como valoración y no se convertirá.',
  'settings.customization.custom-fields.convert.unreadable.other':
    '{count} operaciones tienen un valor que no se puede leer como valoración y no se convertirán.',
  'settings.customization.custom-fields.convert.conflict.one':
    '{count} operación ya tiene una valoración distinta',
  'settings.customization.custom-fields.convert.conflict.other':
    '{count} operaciones ya tienen una valoración distinta',
  'settings.customization.custom-fields.convert.conflict-keep':
    'Mantener su valoración',
  'settings.customization.custom-fields.convert.conflict-overwrite':
    'Usar {fieldLabel}',
  'settings.customization.custom-fields.convert.summary-rate.one':
    'Valora {count} operación',
  'settings.customization.custom-fields.convert.summary-rate.other':
    'Valora {count} operaciones',
  'settings.customization.custom-fields.convert.summary-done.one':
    '{count} ya convertida',
  'settings.customization.custom-fields.convert.summary-done.other':
    '{count} ya convertidas',
  'settings.customization.custom-fields.convert.summary-skip.one':
    '{count} sin convertir',
  'settings.customization.custom-fields.convert.summary-skip.other':
    '{count} sin convertir',
  'settings.customization.custom-fields.convert.submit.one':
    'Valorar {count} operación',
  'settings.customization.custom-fields.convert.submit.other':
    'Valorar {count} operaciones',
  'settings.customization.custom-fields.convert.continue': 'Continuar',
  'settings.customization.custom-fields.convert.progress':
    'Valorando operaciones: {done} de {total}',
  'settings.customization.custom-fields.convert.done.one':
    'Se valoró {count} operación.',
  'settings.customization.custom-fields.convert.done.other':
    'Se valoraron {count} operaciones.',
  'settings.customization.custom-fields.convert.changed.one':
    '{count} operación cambió después de abrir este diálogo y no se modificó. Ábrelo de nuevo para incluirla.',
  'settings.customization.custom-fields.convert.changed.other':
    '{count} operaciones cambiaron después de abrir este diálogo y no se modificaron. Ábrelo de nuevo para incluirlas.',
  'settings.customization.custom-fields.convert.failed.one':
    'No se pudo actualizar {count} operación:',
  'settings.customization.custom-fields.convert.failed.other':
    'No se pudieron actualizar {count} operaciones:',
  'settings.customization.custom-fields.convert.remove-title':
    '¿Eliminar {fieldLabel}?',
  'settings.customization.custom-fields.convert.remove-desc.one':
    'Borra {fieldLabel} de la {count} operación cuya valoración ya lo contiene y después elimina el campo.',
  'settings.customization.custom-fields.convert.remove-desc.other':
    'Borra {fieldLabel} de las {count} operaciones cuya valoración ya lo contiene y después elimina el campo.',
  'settings.customization.custom-fields.convert.remove-keeps.one':
    '{count} operación conserva su valor de {fieldLabel} porque no se convirtió.',
  'settings.customization.custom-fields.convert.remove-keeps.other':
    '{count} operaciones conservan su valor de {fieldLabel} porque no se convirtió.',
  'settings.customization.custom-fields.convert.remove-confirm.one':
    '¿Borrar {fieldLabel} de {count} operación y eliminar el campo?',
  'settings.customization.custom-fields.convert.remove-confirm.other':
    '¿Borrar {fieldLabel} de {count} operaciones y eliminar el campo?',
  'settings.customization.custom-fields.convert.remove-views':
    'Las columnas del Registro de operaciones, los filtros y los bloques de diseño que usan {fieldLabel} dejarán de mostrarlo.',
  'settings.customization.custom-fields.convert.remove':
    'Eliminar {fieldLabel}',
  'settings.customization.custom-fields.convert.remove-progress':
    'Eliminando {fieldLabel}: {done} de {total}',
  'settings.customization.custom-fields.convert.removed':
    'Se eliminó {fieldLabel}. Tus valoraciones se conservan.',
  'settings.customization.custom-fields.convert.remove-incomplete':
    'Algunas operaciones no se actualizaron, así que se conservó {fieldLabel}. Ábrelo de nuevo para terminar de eliminarlo.',
  'settings.customization.custom-fields.convert.remove-field-failed':
    '{fieldLabel} se eliminó de todas las operaciones, pero no se pudo borrar el campo. Bórralo desde Campos personalizados de operaciones.',
  'settings.customization.custom-fields.convert.field-changed':
    '{fieldLabel} se cambió o eliminó en otro lugar, así que las operaciones restantes no se actualizaron. Ábrelo de nuevo para continuar.',

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

  
  'review.header.guide.intro.title': 'Tu revisión empieza aquí',
  'review.header.guide.intro.description':
    'En el encabezado encontrarás todo lo necesario para navegar y gestionar esta revisión.',
  'review.header.guide.reviewed.title': 'Marcar como revisada',
  'review.header.guide.reviewed.description':
    'Haz clic en el círculo para marcar esta nota como revisada. Haz clic de nuevo para deshacerlo.',
  'review.header.guide.dates.title': 'Ir a otras revisiones',
  'review.header.guide.dates.description':
    'Haz clic en una fecha, como junio o 2026, para abrir su nota de revisión.',
  'review.header.guide.controls.title': 'Filtros, layout y navegación',
  'review.header.guide.controls.description':
    'Usa el embudo para filtrar operaciones, «Cambiar Layout» para cambiar el diseño de la nota y «Anterior» / «Siguiente» para ir a otro período de revisión.',
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
  'widget.review-context-fields.name': 'Campos de contexto de revisión',
  'widget.review-context-fields.description':
    'Campos de contexto personalizados y editables para notas de revisión',
  'widget.review-context-fields.group.default': 'Contexto de revisión',

  'widget.review-context-fields.empty-title':
    'No hay campos de contexto configurados para este tipo de revisión.',
  'widget.review-context-fields.empty-desc':
    'Crea campos personalizados de revisión en la configuración para registrar sesgo, enfoque, intención y otro contexto de planificación.',
  'widget.review-context-fields.configure': 'Configurar campos de revisión',
  'widget.review-context-fields.service-unavailable':
    'Los campos personalizados de revisión aún no están disponibles.',
  'widget.review-context-fields.unsupported-type':
    'Tipo de campo de revisión no compatible.',
  'widget.review-context-fields.source-missing':
    'Esta revisión principal aún no existe.',
  'widget.review-context-fields.source-invalid':
    'Esta revisión principal existe, pero no es una nota de revisión válida.',
  'widget.review-context-fields.source-empty':
    'Todavía no hay valores heredados completados en esta revisión principal.',

  'widget.review.title': 'Revisión de Desempeño',
  'widget.review.mental-game': 'Juego Mental',
  'widget.review.technical-game': 'Juego Técnico',
  'widget.review.star-hint':
    'Clic para estrella completa, clic de nuevo para media estrella',
  'widget.review.invalid-context':
    'El widget de Revisión requiere un contexto de revisión válido (DRC, Semanal, Mensual)',

  
  'widget.checklist.name': 'Lista de Verificación',
  'widget.checklist.description': 'Lista de preparación pre-sesión',
  'widget.checklist.title': 'Lista de verificación DRC',
  'widget.checklist.weekly-title': 'Lista de verificación semanal',
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
    "El widget de lista de verificación requiere una nota DRC o de revisión semanal (tipo de frontmatter: 'drc' o 'weekly-review')",

  
  'widget.session-mistakes.name': 'Errores de Sesión',
  'widget.session-mistakes.description':
    'Registra errores conductuales al final de la sesión',
  'widget.session-mistakes.title': 'Errores de Sesión',
  'widget.session-mistakes.subtitle':
    'Registra los errores una vez por sesión en lugar de repetirlos en cada operación.',

  'widget.session-mistakes.placeholder': 'Selecciona o crea errores',
  'widget.session-mistakes.empty': 'No hay errores de sesión registrados',

  'widget.day-trade-fields.name': 'Campos de trades del día',
  'widget.day-trade-fields.description':
    'Campos aplicados a todos los trades del día',
  'widget.day-trade-fields.title': 'Campos de trades del día',
  'widget.day-trade-fields.mistakes': 'Errores',
  'widget.day-trade-fields.tags': 'Etiquetas',
  'widget.day-trade-fields.not-set': 'Sin definir',
  'widget.day-trade-fields.apply.one': 'Aplicar a {count} trade',
  'widget.day-trade-fields.apply.few': 'Aplicar a {count} trades',
  'widget.day-trade-fields.apply.many': 'Aplicar a {count} trades',
  'widget.day-trade-fields.apply.other': 'Aplicar a {count} trades',
  'widget.day-trade-fields.add-field': 'Añadir campo',
  'widget.day-trade-fields.empty':
    'Define un campo una vez y se aplica a todos los trades de este día, incluidos los que hagas después.',
  'widget.day-trade-fields.invalid-context':
    "El widget Campos de trades del día requiere una nota DRC (frontmatter type: 'drc')",
  'widget.day-trade-fields.notice-updated.one': '{count} trade actualizado',
  'widget.day-trade-fields.notice-updated.few': '{count} trades actualizados',
  'widget.day-trade-fields.notice-updated.many': '{count} trades actualizados',
  'widget.day-trade-fields.notice-updated.other': '{count} trades actualizados',
  'widget.day-trade-fields.notice-failed.one':
    'No se pudo actualizar {count} trade',
  'widget.day-trade-fields.notice-failed.few':
    'No se pudieron actualizar {count} trades',
  'widget.day-trade-fields.notice-failed.many':
    'No se pudieron actualizar {count} trades',
  'widget.day-trade-fields.notice-failed.other':
    'No se pudieron actualizar {count} trades',
  'widget.day-trade-fields.notice-save-failed':
    'No se pudo guardar el campo del día',
  'widget.day-trade-fields.notice-conflict':
    'Los campos de operaciones del día cambiaron en otra vista. Revísalos y vuelve a aplicarlos.',
  'widget.day-trade-fields.retry': 'Reintentar',
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
    'El widget de niveles clave requiere una nota DRC, de revisión semanal o de revisión mensual',
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
  'widget.key-events.today': 'Hoy',
  'widget.key-events.day-picker-label': 'Día',
  'widget.key-events.show-all-days': 'Mostrar toda la semana',
  'widget.key-events.show-one-day': 'Mostrar un día',
  'widget.key-events.event-count.one': '{count} evento',
  'widget.key-events.event-count.few': '{count} eventos',
  'widget.key-events.event-count.many': '{count} eventos',
  'widget.key-events.event-count.other': '{count} eventos',
  'widget.key-events.empty-state': 'Sin eventos clave para hoy',
  'widget.key-events.empty-state-sub': 'Agrega eventos en tu Revisión Semanal',
  'widget.key-events.open-calendar-aria': 'Abrir calendario económico',
  'widget.key-events.restore-auto-import':
    'Restaurar eventos importados automáticamente',
  'widget.key-events.restore-missing-events':
    'Restaurar eventos faltantes ({count})',

  
  'widget.missed-trades.name': 'Operaciones no tomadas',
  'widget.missed-trades.description':
    'Operaciones que identificaste pero no tomaste',
  'widget.missed-trades.title': 'Operaciones no tomadas',
  'widget.missed-trades.add-button': 'Agregar',
  'widget.missed-trades.add-aria': 'Agregar operación no tomada',

  'widget.missed-trades.additional-setups': 'Setups adicionales:',
  'widget.missed-trades.no-trades-today': 'Ninguna hoy',
  'widget.missed-trades.no-trades-week':
    'Sin operaciones no tomadas esta semana',
  'widget.missed-trades.invalid-context':
    'El widget de Operaciones no tomadas requiere un contexto de revisión válido',
  'widget.missed-trades.error-no-date':
    'No se pudo determinar la fecha de la operación no tomada',
  'widget.missed-trades.error-open-form':
    'Error al abrir formulario de operación no tomada',

  
  'widget.images.name': 'Gráficos y medios',
  'widget.images.description': 'Carrusel de medios con soporte de carga',
  'widget.images.invalid-context':
    'El widget de Imágenes requiere un contexto de revisión válido',
  'widget.images.alt-prefix': 'Medio de revisión',
  'widget.images.open-fullscreen': 'Abrir medio {index} en pantalla completa',
  'widget.images.delete': 'Eliminar medio',
  'widget.images.empty': 'Sin medios',
  'widget.images.placeholder': 'Pega la URL o ruta del archivo multimedia...',
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
    'Importe de drawdown de operaciones cerradas desde el máximo previo de P&L realizado',
  'widget.directional-pnl.name': 'P&L por dirección',
  'widget.directional-pnl.description':
    'Comparación del rendimiento largo frente a corto',
  'widget.directional-pnl.title.long': 'P&L de operaciones largas',
  'widget.directional-pnl.title.short': 'P&L de operaciones cortas',
  'widget.directional-pnl.empty.not-enough':
    'No hay suficientes operaciones cerradas para mostrar P&L direccional',
  'widget.directional-pnl.empty.no-closed':
    'Sin operaciones cerradas para este período',
  'widget.directional-pnl.empty.no-long':
    'Sin operaciones largas en este período',
  'widget.directional-pnl.empty.no-short':
    'Sin operaciones cortas en este período',
  'widget.trades-chart.name': 'P&L por Operación',
  'widget.trades-chart.description':
    'Barra de P&L para cada operación individual',
  'widget.trades-chart-daily.name': 'P&L Diario',
  'widget.trades-chart-daily.description': 'P&L agregado por día',
  'widget.trades-chart-weekly.name': 'P&L Semanal',
  'widget.trades-chart-weekly.description': 'P&L agregado por semana',
  'widget.trades-chart-monthly.name': 'P&L Mensual',
  'widget.trades-chart-monthly.description': 'P&L agregado por mes',
  'widget.trades-chart-quarterly.name': 'P&L Trimestral',
  'widget.trades-chart-quarterly.description': 'P&L agregado por trimestre',

  
  'widget.stats.name': 'Cuadrícula de Estadísticas',
  'widget.stats.description':
    'Métricas clave de rendimiento en formato cuadrícula',
  'widget.stats.no-trades': 'Sin operaciones cerradas para este período',
  'widget.stats.net-pnl': 'P&L Neto',
  'widget.stats.win-rate': 'Tasa de Acierto',
  'widget.stats.profit-factor': 'Factor de Beneficio',
  'widget.stats.expectancy': 'Esperanza',
  'widget.stats.total-trades': 'Total Operaciones',
  'widget.stats.avg-win': 'Ganancia Promedio',
  'widget.stats.avg-loss': 'Pérdida Promedio',
  'widget.stats.pl-ratio': 'Ratio ganancia/pérdida',
  'widget.account-breakdown.name': 'Desglose por cuenta',
  'widget.account-breakdown.description':
    'Compara el rendimiento entre cuentas en este periodo de revisión',

  
  'widget.account-breakdown.empty':
    'No hay operaciones cerradas en este periodo',
  'widget.account-breakdown.column.account': 'Cuenta',
  'widget.account-breakdown.column.trades': 'Operaciones',
  'widget.account-breakdown.column.pnl': 'P&L neto',
  'widget.account-breakdown.column.win-rate': 'Tasa de acierto',
  'widget.account-breakdown.column.profit-factor': 'Factor de beneficio',
  'widget.tag-performance.name': 'Rendimiento por etiquetas',
  'widget.tag-performance.description':
    'Desglose del rendimiento por etiqueta de operación',
  'widget.setup-performance.name': 'Rendimiento por setup',
  'widget.setup-performance.description':
    'Rendimiento desglosado por setup de trading',

  
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
  'widget.best-worst-days.description': 'Días con mayor y menor P&L',
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
  'widget.best-worst-weeks.description': 'Semanas con mayor y menor P&L',
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
  'widget.best-worst-months.description': 'Meses con mayor y menor P&L',
  'widget.best-worst-months.invalid-context':
    'El widget de Mejores/Peores Meses requiere un contexto de revisión válido',

  
  'widget.best-worst-quarters.name': 'Mejores/Peores Trimestres',
  'widget.best-worst-quarters.description': 'Trimestres con mayor y menor P&L',
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
  'widget.position-size.stop-loss-pips': 'Stop loss (pips)',
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
  'widget.table.header.pnl': 'P&L',
  'widget.table.header.win-rate': '% Acierto',
  'widget.table.header.profit-factor': 'FG',
  'widget.table.header.tag': 'Etiqueta',
  'widget.table.header.setup': 'Setup',
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
  'widget.trade-table.column.ticker': 'Símbolo',
  'widget.trade-table.column.account': 'Cuenta',
  'widget.trade-table.column.pnl': 'P&L',
  'widget.trade-table.column.direction': 'Dirección',
  'widget.trade-table.column.setups': 'Setups',
  'widget.trade-table.column.mistakes': 'Errores',
  'widget.trade-table.empty': 'Sin operaciones para este período',
  'widget.trade-table.status.open': 'ABIERTA',
  'widget.trade-table.na': 'N/D',
  'widget.trade-table.unknown': 'Desconocido',

  'widget.trade-table.image-alt': 'Vista previa de operación {id}',
  'widget.trade-table.fullscreen-title': 'Imagen de Operación {id}',
  'widget.trade-table.fullscreen-alt': 'Imagen {index} de Operación {id}',
  'widget.trade-table.duration.days-hours': '{days} d {hours} h',
  'widget.trade-table.duration.hours-mins': '{hours} h {mins} min',
  'widget.trade-table.duration.mins': '{mins} min',
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
  'widget.empty.no-setup-data': 'No hay datos de setups para este periodo',
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

  
  'metric.expectancyGap.name': 'Brecha de expectativa',
  'metric.expectancyGap.description':
    'R real frente al esperado por operación.',
  'expectancy-gap.expected': 'Esperado (R/operación)',
  'expectancy-gap.realized': 'Realizado (R/operación)',
  'expectancy-gap.sample':
    '{included} de {total} operaciones cerradas tienen R neto utilizable.',
  'expectancy-gap.method-title': 'Cómo se calcula',
  'expectancy-gap.method':
    'Brecha = realizado − esperado. Se promedia el R neto de las operaciones reales totalmente cerradas, incluidas las de equilibrio. Se excluyen las abiertas, omitidas y de backtest. Los datos de beneficio o riesgo ausentes se excluyen, no cuentan como cero. Se usa el R registrado o el riesgo de cada operación, nunca el riesgo predeterminado actual. Los filtros de salida cuentan cada operación una vez al cierre final. Usa un modelo independiente o una referencia histórica con costes equivalentes. Una brecha negativa indica un rendimiento inferior, no demuestra mala ejecución. Borra la referencia para quitarla.',
  'expectancy-gap.invalid':
    'Introduce un número finito o deja el campo vacío para borrar.',
  'expectancy-gap.save-failed':
    'No se pudo guardar la referencia. Inténtalo de nuevo.',
  'widget.pnlChart.name': 'P&L Acumulado',
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
  'widget.drawdownChart.name': 'Gráfico de drawdown',
  'widget.drawdownChart.description':
    'Caída desde tu máximo previo de P&L realizado',

  'widget.recentTrades.name': 'Operaciones Recientes',
  'widget.recentTrades.description': 'Lista de tus operaciones más recientes',
  'widget.recentTrades.date': 'Fecha',
  'widget.recentTrades.ticker': 'Símbolo',
  'widget.recentTrades.direction': 'Dirección',
  'widget.recentTrades.pnl': 'P&L',
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
    'Todas las opciones personalizadas (tickers, setups, errores)',
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

  'csv.mapper.tip.title': 'Consejo: Mapea Campos Adicionales',
  'csv.mapper.tip.desc':
    'Asignar campos opcionales como la comisión y el P&L mejora la calidad de la importación. También puedes asignar varias columnas a campos de lista como etiquetas, imágenes, setups y errores.',
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
    'Multiplicador para opciones (generalmente 100), futuros o forex (unidades por lote, generalmente 100.000)',
  'csv.mapper.help.order-id': 'Usado para agregar rellenos parciales',
  'csv.mapper.help.asset-types': 'acciones, opciones, futuros, forex, cripto',
  'csv.mapper.help.status': 'Estado de operación: ABIERTA o CERRADA',

  'csv.mapper.category.required': 'Campos Requeridos',
  'csv.mapper.category.optional-core': 'Campos Principales Opcionales',
  'csv.mapper.category.identifiers': 'Identificadores',
  'csv.mapper.category.other': 'Otro',
  'csv.mapper.category.options': 'Campos de Opciones',
  'csv.mapper.category.futures': 'Campos de Futuros',

  
  
  

  'csv.broker.remove-favorite-aria': 'Eliminar de favoritos',
  'csv.broker.set-favorite-aria': 'Establecer como favorito',

  

  'csv.account-selector.favorite.remove': 'Eliminar de favoritos',
  'csv.account-selector.favorite.set': 'Establecer como favorito',

  

  
  
  

  'csv.results.failed-to-import-prefix': 'Error al importar ',
  'csv.results.failed-to-import-suffix': ' filas (ver detalles abajo)',

  'csv.results.pending-local-writes':
    '{count} escritura(s) de notas de operación siguen pendientes. Journalit conciliará las escrituras completadas y mantendrá las proyecciones sin terminar disponibles para restaurarlas.',
  'csv.results.pending-title': 'La importación aún se está sincronizando',

  
  
  

  
  
  

  
  
  

  

  

  

  

  

  
  
  

  'csv.button.export-template': 'Exportar Plantilla',
  'csv.button.delete-template': 'Eliminar Plantilla',

  'csv.button.import-another': 'Importar Otro Archivo',
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
  'csv.results.skipped.one':
    'Se omitió {count} operación duplicada (ya en bóveda)',
  'csv.results.skipped.few':
    'Se omitieron {count} operaciones duplicadas (ya en bóveda)',
  'csv.results.skipped.many':
    'Se omitieron {count} operaciones duplicadas (ya en bóveda)',
  'csv.results.skipped.other':
    'Se omitieron {count} operaciones duplicadas (ya en bóveda)',

  'csv.results.broker': 'Bróker: {broker}',

  'csv.results.errors-header': 'HAZ CLIC PARA VER LOS ERRORES ({count})',
  'csv.results.discord-note':
    'Opcional: si necesitas ayuda, haz clic en Copiar informe y pégalo en Discord.',

  

  'csv.errors.copy-report': 'Copiar informe',

  'csv.errors.copied': 'Copiado',
  'csv.errors.rows': 'Filas: {rows}',

  'csv.errors.raw-errors-limit':
    'Mostrando las primeras {shown} de {total} errores',

  

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
    'ISO Fecha/Hora: 2024-12-25 14:30:00 (Tradovate)',
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
  'home.quick-links.quick-import': 'Importación rápida',
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
  'home.widget-selector.sample-note.checklist': 'Lista de Verificación',
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
  'home.widget-selector.add-shortcut': 'Añadir acceso directo de cuenta/setup',

  
  'home.period.month': 'Mes',
  'home.period.week': 'Semana',
  'home.period.custom': 'Rango personalizado',
  'home.period.invalid-range':
    'La fecha final debe ser igual o posterior a la inicial.',
  'date-input.error.day': 'El día debe estar entre 1 y {max}.',
  'date-input.error.invalid': 'Por favor ingresa una fecha válida',
  'date-input.error.month': 'El mes debe estar entre 1 y 12.',
  'date-input.error.year': 'Usa YY (2000–2099) o YYYY (1000–9999).',
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
  'home.widget.goals-progress.account-scope': 'Alcance de cuentas',
  'home.widget.goals-progress.add-account': 'Añadir cuenta',
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
  'home.widget.aum.current-trend': 'Actual · tendencia de 30 días',
  'home.widget.aum.period.month': 'Este Mes',
  'home.widget.aum.period.quarter': 'Este Trimestre',
  'home.widget.aum.period.year': 'Este Año',
  'home.widget.aum.period.all': 'Toda la Vida',
  'home.widget.aum.unable-to-load': 'No se pudo cargar',
  'home.widget.aum.no-accounts': 'Sin cuentas',
  'home.widget.aum.account-count': '{count} cuenta',
  'home.widget.aum.account-count-plural': '{count} cuentas',

  
  'home.widget.streak.title': 'Racha',
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

  
  'home.widget.drawdown.title': 'Límite de drawdown',
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
  'home.widget.eval-roi.challenge-count': '{count} evaluación',
  'home.widget.eval-roi.challenge-count-plural': '{count} evaluaciones',
  'home.widget.eval-roi.net': 'Neto',
  'home.widget.eval-roi.spent': 'Gastado',
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
  'calendar.missed': '{count} no tomadas',
  'calendar.trades-short': '{count}O',
  'calendar.missed-short': '{count}P',
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

  
  'home.widget.getting-started.name': 'Primeros pasos',
  'home.widget.getting-started.description':
    'Lista para configurar Journalit y tus operaciones',
  'home.widget.getting-started.progress': '{completed}/{total} completados',
  'home.widget.getting-started.progress.loading': 'Comprobando el progreso...',
  'home.widget.getting-started.item.account.title':
    'Configura tu cuenta de trading',
  'home.widget.getting-started.item.account.description':
    'Las operaciones se registran en una cuenta que sigue tu saldo. Sin ella no se pueden calcular la rentabilidad ni el drawdown.',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': 'Configurar cuenta',
  'home.widget.getting-started.item.create.title':
    'Incorpora tu historial de trading',
  'home.widget.getting-started.item.create.description':
    'Importa operaciones existentes, conecta Trade Sync o añade tu primera operación manualmente.',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': 'Abrir Trade Import',
  'home.widget.getting-started.item.tradelog.title':
    'Abre el Registro de operaciones',
  'home.widget.getting-started.item.tradelog.description':
    'Tu base de datos de operaciones para analizarlas todas en un solo lugar.',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta':
    'Abrir el Registro de operaciones',
  'home.widget.getting-started.item.layouts.title':
    'Abre el Constructor de diseño',
  'home.widget.getting-started.item.layouts.description':
    'Diseña tus layouts de revisión a tu manera.',
  'home.widget.getting-started.item.layouts.time': '1 min',
  'home.widget.getting-started.item.layouts.cta':
    'Abrir el Constructor de diseño',
  'home.widget.getting-started.item.sidebar.title':
    'Abrir la barra lateral de navegación',
  'home.widget.getting-started.item.sidebar.description':
    'Accede rápidamente a las páginas, revisiones, herramientas y búsqueda de Journalit.',
  'home.widget.getting-started.item.sidebar.time': '10 s',
  'home.widget.getting-started.item.sidebar.cta': 'Abrir barra lateral',
  'home.widget.getting-started.item.pro.title': 'Activa PRO',
  'home.widget.getting-started.item.pro.description':
    'Activa Trade Import, Trade Sync y el Calendario Económico, además de más llamadas a herramientas de IA al mes.',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activar',

  
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
    'Saldos actuales de las cuentas con una tendencia de 30 días',

  
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

  
  
  

  

  
  
  

  

  

  

  

  

  

  

  

  
  
  

  

  'datepicker.button.clear': 'Limpiar',
  'datepicker.button.today': 'Hoy',
  'datepicker.button.now': 'Ahora',
  'datepicker.aria.hour': 'Hora',
  'datepicker.aria.minute': 'Minuto',
  'datepicker.aria.second': 'Segundo',
  'datepicker.aria.previous-month': 'Mes anterior',
  'datepicker.aria.next-month': 'Mes siguiente',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',

  

  
  'ribbon.open-journalit': 'Abrir Journalit',

  

  'grid.aria.remove-widget': 'Eliminar widget',

  
  'missed-trade.reason-title': 'Por qué perdí esta operación',

  
  'status-bar.update-available-branded': 'Actualizar Journalit',
  'status-bar.update-aria-label': 'Journalit {version} - Click para ver',
  'update.available.ready': 'Hay una nueva versión disponible',

  

  'trade.details.entry': 'Entrada',
  'trade.details.exit': 'Salida',

  'trade.details.duration': 'Duración',

  'trade.details.thesis': 'Tesis',

  'trade.details.entries-summary': '{count} entradas',
  'trade.details.exits-summary': '{count} salidas',
  'trade.details.take-profit-count': '{count} objetivos',

  
  'trade.metadata.account': 'Cuenta:',

  'trade.metadata.setups': 'Setups',
  'trade.metadata.mistakes': 'Errores',

  
  'trade.image.no-images': 'No hay imágenes para esta operación',
  'trade.image.click-edit': 'Añadir imagen',
  'trade.image.alt-prefix': 'Imagen de operación',
  'command.share-note-as-image': 'Compartir la nota actual como imagen',
  'trade.share.copied': 'Captura de la operación copiada al portapapeles',
  'trade.share.failed': 'No se pudo copiar la captura de la operación',
  'trade.share.not-ready':
    'La nota de la operación aún se está cargando. Inténtalo de nuevo en un momento.',
  'share.review.action': 'Compartir tarjeta de revisión',
  'share.trade.modal-title': 'Compartir operación',
  'share.trade.position-return':
    'Rentabilidad de la posición % (antes de costes)',
  'share.trade.account-return': 'Rentabilidad de la cuenta % (saldo actual)',
  'share.trade.hide-dollar-hint':
    'Elige R o % para ocultar importes monetarios. Los valores no disponibles se muestran con un guion.',
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
  'trade.rating.label': 'Valoración',
  'trade.rating.hint':
    'Haz clic en una estrella para valorar, otra vez para media estrella y una vez más para borrarla',

  
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

  

  

  
  'modal.template-switch.title': '¿Cambiar layout?',
  'modal.template-switch.switching-from': 'Estás cambiando de',
  'modal.template-switch.switching-to': 'a',
  'modal.template-switch.has-content-title': 'Esta nota tiene contenido',
  'modal.template-switch.has-content-desc':
    'El contenido se reorganizará para adaptarse al nuevo diseño. Cualquier contenido que no encaje se conservará al final de la nota para que lo revises.',
  'modal.template-switch.cannot-undo':
    'Esto no se puede deshacer (pero puedes volver a cambiar).',
  'modal.template-switch.button.switch': 'Cambiar layout',

  
  'paste.notice.image-pasted': 'Imagen pegada exitosamente',
  'paste.notice.images-pasted': '{count} imágenes pegadas exitosamente',
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
  'release-notes.link.docs': 'Documentación',
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
  'upgrade.benefit.ai-tool-calls':
    'Más llamadas a herramientas de IA al mes para apps de IA conectadas',
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

  

  'timeline.aria.session-navigation':
    'Navegación entre operaciones del mismo día',
  'timeline.aria.previous-trade': 'Operación anterior: {trade}',
  'timeline.aria.next-trade': 'Siguiente operación: {trade}',
  'timeline.aria.no-previous-trade':
    'No hay una operación anterior en este día de trading',
  'timeline.aria.no-next-trade':
    'No hay una operación siguiente en este día de trading',

  

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
    'Los layouts integrados no se pueden editar. Duplica este layout o crea uno nuevo para personalizarlo.',
  'templateEditor.unsaved-changes': 'Cambios sin guardar',
  'templateEditor.field.template-name': 'Nombre de Layout',
  'templateEditor.field.widgets': 'Widgets ({count})',
  'templateEditor.button.add-widget': '+ Agregar Widget',
  'templateEditor.button.insert-widget-here': 'Agregar widget aquí',
  'templateEditor.button.widget-library-docs':
    'Documentación de la biblioteca de widgets',
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

  'filter.modal.review-status.reviewed': 'Revisadas',
  'filter.modal.review-status.unreviewed': 'Sin revisar',
  'filter.modal.direction.long-call': 'Largo/Call',
  'filter.modal.direction.short-put': 'Corto/Put',
  'filter.modal.section.custom-fields': 'Campos personalizados',
  'filter.modal.custom-field.none-available': 'No hay valores disponibles',

  
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
    'URL o ruta de archivo multimedia no válida. Introduce una URL de imagen/vídeo compatible, una ruta de medios del vault o un enlace de Excalidraw.',
  'image.viewer.alt-default': 'Imagen',
  'image.viewer.description-default': 'Vista previa de medios',

  'image.viewer.title-fullscreen': 'Click para ver en pantalla completa',

  'image.viewer.delete-button': 'Eliminar archivo multimedia',
  'image.viewer.nav-prev': 'Imagen anterior',
  'image.viewer.nav-next': 'Imagen siguiente',
  'image.viewer.zoom-in-hint': 'Pellizca o haz click para acercar',
  'image.viewer.zoom-out-hint': '{scale}x (pellizca o haz click para alejar)',

  'image.youtube.unavailable-title': 'Vídeo de YouTube',

  'image.youtube.unavailable-description': 'Privado o no disponible',

  'image.youtube.open': 'Abrir en YouTube',

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
  'library.notice.import-success': 'Layout "{name}" importado correctamente.',
  'library.error.import-failed': 'Error al importar layout',
  'library.notice.select-template': 'Selecciona un layout para exportar',
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
    'Crea primero un layout personalizado en las pestañas de layouts de revisión o de operaciones y vuelve aquí para compartirlo.',
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
  'manual-drawdown.field.date': 'Fecha de Límite',
  'manual-drawdown.field.date-desc': 'Cuándo el broker emitió este límite',
  'manual-drawdown.field.limit': 'Balance Mínimo ($)',
  'manual-drawdown.field.limit-desc': 'Balance más bajo permitido',
  'manual-drawdown.field.note': 'Nota',
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
  'metric.calmarRatio.name': 'Ratio de Calmar',
  'metric.calmarRatio.description':
    'Rentabilidad realizada anualizada respecto a la caída porcentual máxima',
  'dashboard.calmarRatio.tooltip.formula':
    'Rentabilidad anualizada dividida por la caída máxima.',
  'dashboard.calmarRatio.unavailable.no-history':
    'Aún no hay historial de resultados realizados.',
  'dashboard.calmarRatio.unavailable.capital':
    'No hay capital inicial disponible en la moneda mostrada.',
  'dashboard.calmarRatio.unavailable.incomplete-history':
    'Faltan algunos resultados realizados.',
  'dashboard.calmarRatio.unavailable.dates':
    'Faltan algunas fechas de operaciones.',
  'dashboard.calmarRatio.unavailable.short-history':
    'Requiere al menos un día de historial.',
  'dashboard.calmarRatio.unavailable.no-drawdown':
    'Aún no se ha registrado ninguna caída.',
  'dashboard.calmarRatio.unavailable.non-positive-equity':
    'El patrimonio llegó a cero o menos.',
  'dashboard.calmarRatio.unavailable.non-finite':
    'El resultado es demasiado grande para calcularlo.',
  'dashboard.calmarRatio.unavailable.scope':
    'Selecciona todo el historial y solo cuentas completas.',
  'dashboard.calmarRatio.unavailable.conversion':
    'Algunas conversiones de moneda no están disponibles.',
  'metric.sharpeRatio.name': 'Ratio de Sharpe',
  'metric.sharpeRatio.description':
    'P&L medio por operación frente a su volatilidad',
  'metric.expectancy.name': 'Expectativa',
  'metric.expectancy.description':
    'Cantidad promedio ganada o perdida por operación',
  'metric.maxDrawdown.name': 'Drawdown máximo',
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
  'metric.timeInDrawdown.name': 'Tiempo en drawdown',
  'metric.timeInDrawdown.description':
    'Tiempo pasado por debajo de tu máximo de P&L',
  'metric.avgRecoveryTime.name': 'Tiempo medio de recuperación',
  'metric.avgRecoveryTime.description':
    'Tiempo medio para salir de un drawdown',
  'metric.longestDrawdown.name': 'Drawdown más largo',
  'metric.longestDrawdown.description': 'Mayor tiempo en un único drawdown',
  'metric.drawdownEpisodes.name': 'Episodios de drawdown',
  'metric.drawdownEpisodes.description':
    'Número de periodos de drawdown distintos',

  
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

  'template.preview.empty': 'No hay widgets en este layout',
  'template.preview.summary': 'Layout de {type}: {count} widgets',
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
    'Contenido del layout anterior',
  'template.transformation.orphaned-content.desc1':
    'El siguiente contenido no encajó en el nuevo layout.',
  'template.transformation.orphaned-content.desc2':
    'Revísalo e intégralo arriba, o elimínalo si ya no es necesario.',
  'template.editor.loading': 'Cargando layout...',
  'template.editor.built-in': 'Incorporado',
  'template.editor.unsaved-changes': 'Cambios sin guardar',

  'template.editor.built-in-notice':
    'Las plantillas incorporadas no se pueden editar. Duplica esta plantilla o crea una nueva para personalizar.',

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
  'template.editor.missed-reason': 'Razón de operación no tomada',
  'template.editor.missed-reason-desc':
    'Mostrar por qué no se tomó la operación',
  'template.editor.metadata-rows': 'Filas de metadatos',
  'template.editor.note-sections': 'Secciones de nota',
  'template.editor.note-sections-desc':
    'Encabezados y texto que se escriben bajo la operación en las notas nuevas, para todos los tipos de activo. Edítalos luego en la nota.',
  'template.editor.note-sections-zone-placeholder':
    'Texto para las nuevas notas de operación...',
  'template.editor.accounts': 'Cuentas',
  'template.editor.setups': 'Setups',
  'template.editor.mistakes': 'Errores',
  'template.editor.tags': 'Etiquetas',
  'template.editor.custom-fields': 'Campos personalizados',
  'template.editor.custom-fields-desc':
    '{count} campos personalizados configurados',

  'template.editor.metric.position-size': 'Tamaño de posición',
  'template.editor.metric.execution-breakdown': 'Desglose de ejecución',
  'template.editor.metric.pnl': 'P&L',
  'template.editor.metric.r-multiple': 'Múltiplo R',
  'template.editor.metric.costs': 'Costes',
  'template.editor.nav-bar': 'Barra de Navegación',
  'template.editor.nav-bar-desc':
    'Mostrar línea de tiempo de operaciones y enlaces de revisión',
  'template.editor.images': 'Imágenes',
  'template.editor.images-desc': 'Mostrar imágenes de gráficos de operación',
  'template.editor.image-layout': 'Diseño de imágenes',
  'template.editor.image-layout-desc':
    'Mostrar las imágenes de una en una o todas a la vez',
  'template.editor.image-layout-carousel': 'Carrusel',
  'template.editor.image-layout-stacked': 'Apiladas',
  'template.editor.metadata': 'Metadatos',
  'template.editor.metadata-desc': 'Mostrar cuentas, setups y errores',

  'template.editor.review-button': 'Botón Marcar Revisado',
  'template.editor.review-button-desc':
    'Mostrar botón para marcar operación como revisada',
  'template.editor.rating': 'Valoración',
  'template.editor.rating-desc':
    'Muestra la valoración en estrellas que das a la operación',

  
  
  
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
    'Inicio, Panel, Registro de operaciones y tus revisiones están todos ahí.',
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
    'Las notas, capturas y revisiones son tus propios archivos. Solo las operaciones que importas o sincronizas pasan por los servidores de Journalit.',
  'onboarding.orientation.continue': 'Entendido',
  'onboarding.data-source.kicker': 'Tus operaciones',
  'onboarding.data-source.title': '¿Dónde están tus operaciones ahora?',
  'onboarding.data-source.subtitle':
    'Tu historial forma parte de tu ventaja. Tráelo contigo y tus estadísticas tendrán sentido desde el primer día, en lugar de esperar meses a que se acumulen operaciones nuevas.',
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
  'navigation.shortcuts.setups': 'Setups',
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
  'navigation.search.section.trades': 'Operaciones',
  'navigation.search.section.reviews': 'Revisiones',
  'navigation.search.empty': 'No se encontraron resultados',
  'navigation.search.trade-open': 'Abierto',

  'command.open-navigation-sidebar': 'Abrir barra lateral de navegación',
  'command.open-calendar-sidebar': 'Abrir barra lateral del calendario',
  'command.open-economic-calendar': 'Abrir calendario económico',

  'widget.directional-drawdown.name': 'Drawdown realizado por dirección',
  'widget.directional-drawdown.description':
    'Curvas separadas del importe de drawdown de operaciones cerradas largas y cortas',

  'widget.long-drawdown.name': 'Drawdown en largos',
  'widget.long-drawdown.description':
    'Curva del importe de drawdown de operaciones cerradas, solo largos',
  'widget.short-drawdown.name': 'Drawdown en cortos',
  'widget.short-drawdown.description':
    'Curva del importe de drawdown de operaciones cerradas, solo cortos',
  'widget.directional-drawdown.title.long': 'Drawdown en largos',
  'widget.directional-drawdown.title.short': 'Drawdown en cortos',
  'widget.directional-drawdown.empty.not-enough':
    'No hay suficientes operaciones cerradas para el análisis direccional',
  'widget.directional-drawdown.empty.no-closed':
    'No hay operaciones direccionales cerradas en este periodo',
  'widget.directional-drawdown.empty.no-long':
    'No hay operaciones largas cerradas en este periodo',
  'widget.directional-drawdown.empty.no-short':
    'No hay operaciones cortas cerradas en este periodo',
  'widget.directionalDrawdownChart.name': 'Drawdown realizado por dirección',

  'widget.longDrawdownChart.name': 'Drawdown en largos',
  'widget.longDrawdownChart.description':
    'Drawdown solo de operaciones en largo',

  'widget.shortDrawdownChart.name': 'Drawdown en cortos',
  'widget.shortDrawdownChart.description':
    'Drawdown solo de operaciones en corto',

  'widget.drawdownStats.no-conversion':
    'Las estadísticas de drawdown no están disponibles para divisas mixtas sin conversión de divisas.',

  'guide.skip-guide': 'Saltar guía',
  'guide.step-count': '{count} pasos',
  'guide.step-position': 'Paso {current} de {total}',
  

  'onboarding.activation.button.copy-link': 'Copiar enlace',

  'widget.previous-trading-day-context.name':
    'Contexto del día de trading anterior',
  'widget.previous-trading-day-context.description':
    'Contexto de solo lectura tomado de los encabezados del DRC anterior',
  'widget.previous-trading-day-context.reference-label': 'DRC anterior',
  'widget.previous-trading-day-context.open-source': 'Abrir',
  'widget.previous-trading-day-context.image-alt-prefix':
    'Imagen del DRC anterior',
  'widget.previous-trading-day-context.no-sections-configured':
    'Elige al menos una sección en la configuración del layout.',
  'widget.previous-trading-day-context.preview-note':
    'Ayer el precio barrió liquidez, fue rechazado en el nivel semanal y cerró de nuevo dentro del rango previsto.',
  'widget.previous-trading-day-context.preview-bullet-two':
    'Desviación principal: entrada antes de la confirmación en el primer retroceso.',
  'widget.previous-trading-day-context.preview-source':
    'Vista previa: DRC anterior del día de trading previo',
  'widget.previous-trading-day-context.preview-bullet-one':
    'El sesgo diario coincidió con el plan tras el impulso de apertura.',
  'widget.weekly-drc-context.name': 'Revisiones diarias por día de la semana',
  'widget.weekly-drc-context.description':
    'Muestra las secciones del DRC seleccionadas para cada día en la revisión semanal',

  'widget.weekly-drc-context.no-activity': 'Sin actividad este día.',
  'widget.weekly-drc-context.no-sections-configured':
    'Elige al menos una sección del DRC en la configuración del layout.',
  'widget.weekly-drc-context.current-week-not-found':
    'No se encontró la revisión semanal actual.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'No se encontró la fecha de la revisión semanal actual.',
  'widget.weekly-drc-context.load-error':
    'No se pudo cargar la revisión DRC semanal.',
  'widget.weekly-drc-context.invalid-context':
    'Este widget solo está disponible en revisiones semanales',
  'templateEditor.widget.weekly-drc-day-label': 'Día',

  'templateEditor.widget.weekly-drc-start-collapsed': 'Iniciar contraído',
  'templateEditor.widget.weekly-drc-day-all': 'Todos los días',

  'templateEditor.widget.previous-context-sections-label':
    'Secciones a incluir',
  'templateEditor.widget.previous-context-heading-label':
    'Encabezado de sección del DRC anterior',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Elige un encabezado',
  'templateEditor.widget.review-context-fields.selection': 'Campos a mostrar',
  'templateEditor.widget.review-context-fields.selection.all':
    'Todos los campos',
  'templateEditor.widget.review-context-fields.selection.group':
    'Grupo de campos',
  'templateEditor.widget.review-context-fields.selection.fields':
    'Campos específicos',
  'templateEditor.widget.review-context-fields.group': 'Grupo',
  'templateEditor.widget.review-context-fields.group-placeholder':
    'Selecciona un grupo',
  'templateEditor.widget.review-context-fields.fields': 'Campos',
  'templateEditor.widget.review-context-fields.fields-placeholder':
    'Selecciona campos',
  'templateEditor.widget.review-context-fields.fields-selected':
    '{count} campos seleccionados',
  'templateEditor.widget.review-context-fields.no-fields':
    'Primero crea campos de revisión en la configuración.',

  'templateEditor.widget.review-context-fields.context': 'Contexto',
  'templateEditor.widget.review-context-fields.context.both': 'Ambos',
  'templateEditor.widget.review-context-fields.inherited': 'Heredado',
  'templateEditor.widget.review-context-fields.current': 'Actual',
  'templateEditor.widget.review-context-fields.empty-values': 'Valores vacíos',
  'templateEditor.widget.review-context-fields.hide-empty':
    'Ocultar valores vacíos',
  'templateEditor.widget.trade-review.more-context': 'Más contexto',
  'templateEditor.widget.trade-review.notes-sections': 'Secciones de notas',
  'templateEditor.widget.trade-review.notes-all': 'Todas las notas',
  'templateEditor.widget.trade-review.notes-sections-empty':
    'Añade encabezados en Secciones de nota en tu diseño de operación',
  'templateEditor.widget.trade-review.placement.cards':
    'Tarjetas de estadísticas',
  'templateEditor.widget.trade-review.placement.visible': 'Siempre visible',
  'templateEditor.widget.trade-review.future-custom-fields':
    'Campos personalizados añadidos más tarde',
  'templateEditor.widget.trade-review.display': 'Visualización',
  'templateEditor.widget.trade-review.show-images': 'Mostrar imágenes',
  'templateEditor.widget.trade-review.fields-none': 'Sin campos',
  'templateEditor.widget.trade-review.questions': 'Preguntas de revisión',
  'templateEditor.widget.trade-review.questions-help':
    'Elige las preguntas que se muestran para cada resultado de la operación. Los IDs de las preguntas permanecen estables para que las respuestas guardadas sigan vinculadas al editar o reordenar las preguntas.',
  'templateEditor.widget.trade-review.outcome.win': 'Ganadoras',
  'templateEditor.widget.trade-review.outcome.loss': 'Perdedoras',
  'templateEditor.widget.trade-review.outcome.breakeven': 'Punto de equilibrio',
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
  'templateEditor.widget.previous-context-add-section': '+ Añadir sección',

  'templateEditor.widget.previous-context-fallback-label':
    'Alternativa para el DRC anterior',
  'templateEditor.widget.previous-context-fallback-nearest':
    'DRC anterior más cercano',
  'templateEditor.widget.previous-context-fallback-expected':
    'Solo el día de trading anterior esperado',
  'widget.stats.vs-prev': 'vs. anterior',
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
  'dashboard.metrics.past-30d': 'últimos 30 d',

  'settings.customization.trade-fields': 'Campos de operación personalizados',
  'settings.customization.review-fields': 'Campos de revisión personalizados',
  'settings.customization.review-fields.description':
    'Crea campos personalizados para las notas de revisión. Estos campos se guardan en reviewCustomFields y luego pueden heredarse entre revisiones mensuales, semanales y diarias.',
  'settings.customization.review-fields.title': 'Campos de revisión ({count})',
  'settings.customization.review-fields.manage-desc':
    'Gestiona los campos personalizados de las notas de revisión',
  'settings.customization.review-fields.no-fields':
    'Aún no hay campos de revisión personalizados',
  'settings.customization.review-fields.no-fields-desc':
    'Los campos de revisión los usan los widgets de las notas de revisión y no aparecerán en el formulario de operación ni en el Registro de operaciones.',
  'settings.customization.review-fields.add-button': 'Añadir campo de revisión',
  'settings.customization.review-fields.delete-all-button':
    'Eliminar todos los campos de revisión',
  'settings.customization.review-fields.add-new':
    'Añadir nuevo campo de revisión',
  'settings.customization.review-fields.edit-field-with-name':
    'Editar «{fieldLabel}»',
  'settings.customization.review-fields.configure-desc':
    'Configura abajo los ajustes del campo de revisión',
  'settings.customization.review-fields.actions-desc':
    'Gestiona tus campos de revisión personalizados',
  'settings.customization.review-fields.default-label':
    'Nuevo campo de revisión',
  'settings.customization.review-fields.unknown-field':
    'Campo de revisión desconocido',
  'settings.customization.review-fields.field-summary':
    'Tipo: {type} • Revisiones: {reviews}',
  'settings.customization.review-fields.error.save-failed':
    'No se pudo guardar el campo de revisión. Inténtalo de nuevo.',
  'settings.customization.review-fields.delete.confirm-message':
    '¿Seguro que quieres eliminar el campo de revisión personalizado "{fieldLabel}"?',
  'settings.customization.review-fields.reset.confirm-message':
    '¿Seguro que quieres eliminar TODOS los campos de revisión personalizados?',
  'settings.customization.review-fields.editor.title':
    'Configuración del campo de revisión',
  'settings.customization.review-fields.editor.label-desc':
    'Nombre visible de este campo de revisión',
  'settings.customization.review-fields.editor.label-placeholder':
    'Introduce la etiqueta del campo de revisión',
  'settings.customization.review-fields.editor.key':
    'Clave del campo de revisión',
  'settings.customization.review-fields.editor.key-desc':
    'Esta clave se guardará en el frontmatter de la nota de revisión en',
  'settings.customization.review-fields.editor.type-desc':
    'Tipo de entrada del campo de revisión',
  'settings.customization.review-fields.editor.description': 'Descripción',
  'settings.customization.review-fields.editor.description-desc':
    'Texto de ayuda opcional para este campo de revisión',
  'settings.customization.review-fields.editor.description-placeholder':
    'Explica cómo debe usarse este campo',
  'settings.customization.review-fields.editor.placeholder-desc':
    'Texto de ejemplo opcional que se muestra al introducir un valor local',
  'settings.customization.review-fields.editor.placeholder-input':
    'Introduce el texto de ejemplo del campo de revisión',

  'settings.customization.review-fields.editor.group': 'Grupo de campos',
  'settings.customization.review-fields.editor.group-desc':
    'Elige el grupo al que pertenece este campo de revisión.',
  'settings.customization.review-fields.groups.add-button': 'Añadir grupo',
  'settings.customization.review-fields.groups.default-name': 'Nuevo grupo',
  'settings.customization.review-fields.groups.untitled': 'Grupo sin título',
  'settings.customization.review-fields.groups.ungrouped': 'Sin grupo',
  'settings.customization.review-fields.groups.field-count': '{count} campos',
  'settings.customization.review-fields.groups.empty':
    'Aún no hay campos en este grupo.',
  'settings.customization.review-fields.groups.rename-prompt':
    'Nombre del grupo',
  'settings.customization.review-fields.groups.delete-message':
    '¿Eliminar el grupo de campos de revisión "{groupName}"?',
  'settings.customization.review-fields.groups.delete-note':
    'Los campos de este grupo quedarán sin grupo. Sus valores de revisión guardados no se eliminan.',
  'settings.customization.review-fields.groups.error.duplicate':
    'Ya existe un grupo de campos de revisión con este nombre.',
  'settings.customization.review-fields.groups.error.save-failed':
    'No se pudo guardar el grupo de campos de revisión.',
  'settings.customization.review-fields.editor.compact': 'Vista compacta',
  'settings.customization.review-fields.editor.compact-desc':
    'Preferir una presentación compacta cuando este campo aparece en widgets de revisión',
  'settings.customization.review-fields.editor.appears-on': 'Aparece en',
  'settings.customization.review-fields.editor.appears-on-desc':
    'Tipos de nota de revisión que pueden mostrar este campo',
  'settings.customization.review-fields.editor.editable-on': 'Editable en',
  'settings.customization.review-fields.editor.editable-on-desc':
    'Tipos de nota de revisión donde se puede introducir un valor local',
  'settings.customization.review-fields.editor.inherit-to': 'Se hereda en',
  'settings.customization.review-fields.editor.inherit-to-desc':
    'Tipos de nota de revisión inferiores que pueden mostrar valores heredados de este campo',
  'settings.customization.review-fields.editor.inheritance': 'Activar herencia',
  'settings.customization.review-fields.editor.inheritance-desc':
    'Permite leer este campo desde notas de revisión de un periodo superior',
  'settings.customization.review-fields.editor.inheritance-mode':
    'Modo de herencia',
  'settings.customization.review-fields.editor.inheritance-mode-desc':
    'Controla si las revisiones hijas muestran valores heredados, locales o ambos',
  'settings.customization.review-fields.editor.sources': 'Fuentes de herencia',
  'settings.customization.review-fields.editor.sources-desc':
    'Tipos de revisión de periodo superior de los que este campo puede heredar',

  'settings.customization.review-fields.editor.options-desc':
    'Opciones disponibles para este campo de revisión',
  'settings.customization.review-fields.editor.allow-create-desc':
    'Los usuarios pueden crear opciones nuevas al usar este campo en notas de revisión',
  'settings.customization.review-fields.editor.save':
    'Guardar campo de revisión',
  'settings.customization.review-fields.editor.delete':
    'Eliminar campo de revisión',
  'settings.customization.review-fields.inheritance-mode.inherit-only':
    'Solo heredado',
  'settings.customization.review-fields.inheritance-mode.local-only':
    'Solo local',
  'settings.customization.review-fields.inheritance-mode.inherit-and-local':
    'Heredado y local',

  'calendar.aria.open-daily-review': 'Abrir revisión diaria para {date}',
  'calendar.aria.open-weekly-review': 'Abrir revisión semanal para {date}',
  'calendar.aria.open-monthly-review': 'Abrir revisión mensual para {date}',
  'calendar.aria.open-quarterly-review':
    'Abrir revisión trimestral para {date}',

  'csv.mapper.aria.map-column': 'Asignar columna {header}',
  'trade-import.error.file-empty':
    'Este archivo está vacío. Vuelve a exportarlo e inténtalo de nuevo.',
  'trade-import.error.file-too-large':
    'El archivo seleccionado supera el límite de tamaño de Trade Import',
  'trade-import.error.file-type-unsupported':
    'Trade Import no admite el tipo de archivo seleccionado',
  'trade-import.error.broker-file-type-unsupported':
    'El bróker seleccionado no admite este tipo de archivo',
  
  'quick-import.title': 'Importación rápida',
  'quick-import.subtitle':
    'Usa tu configuración favorita de Trade Import para previsualizar e importar un archivo más rápido.',
  'quick-import.gate.sign-in':
    'Inicia sesión o crea una cuenta gratuita de Journalit para previsualizar archivos en Trade Import. Solo necesitas Pro cuando importes las operaciones.',
  'quick-import.gate.sign-in-cta': 'Iniciar sesión para previsualizar gratis',
  'quick-import.gate.pro':
    'La Importación rápida está incluida en Trade Import Pro.',
  'quick-import.gate.preview-free': 'Previsualizar archivo gratis',
  'quick-import.message.needs-setup':
    'Elige un bróker o una plantilla favorita en Trade Import antes de usar la Importación rápida.',
  'quick-import.message.capabilities-failed':
    'No se pudo cargar la configuración de la Importación rápida.',
  'quick-import.message.mapping-required':
    'Este archivo necesita asignación de columnas. Abre el flujo completo de Trade Import para revisar las asignaciones.',
  'quick-import.message.preview-failed':
    'Este archivo debe revisarse en el flujo completo de Trade Import.',
  'quick-import.message.no-importable':
    'No se encontraron operaciones importables. Revisa este archivo en Trade Import para ver los detalles.',

  'quick-import.privacy-note':
    'El archivo seleccionado y las opciones de importación se envían a Journalit. Los registros de diagnóstico cifrados caducan al cabo de 1 día (gratis) o 14 días (Pro); las vistas previas, a los 7 días. El mapeo opcional con IA envía encabezados y filas de muestra a un modelo de IA. Trade Import no envía telemetría del cliente ni informes de errores en segundo plano por separado.',
  'quick-import.dropzone.title': 'Suelta aquí una exportación del bróker',
  'quick-import.dropzone.subtitle': 'O haz clic para elegir un archivo',

  'quick-import.status.checking-subscription':
    'Comprobando el estado de la suscripción...',
  'quick-import.status.analysing': 'Analizando y preparando la vista previa...',
  'quick-import.status.importing': 'Importando...',
  'quick-import.processing.sent-to-server':
    'Subido a Journalit para su procesamiento privado',
  'quick-import.file.selected': 'Archivo seleccionado',
  'quick-import.file.processed':
    'Procesado y listo para escribirse en tu bóveda',
  'quick-import.summary.title': 'Listo para importar',

  'quick-import.summary.to-import': 'Para importar',
  'quick-import.summary.duplicates': 'Duplicados',
  'quick-import.summary.failed': 'Requiere revisión',
  'quick-import.summary.failed-rows': 'Filas no importadas',
  'quick-import.summary.incomplete-rows': 'Filas incompletas omitidas',
  'quick-import.complete.title': 'Importación completada',
  'quick-import.complete.message':
    '{written} escritas, {duplicates} duplicadas, {failed} requieren revisión.',
  'quick-import.action.open-full': 'Abrir Trade Import completo',
  'quick-import.action.review-in-trade-import': 'Revisar en Trade Import',
  'quick-import.action.setup-in-trade-import': 'Configurar en Trade Import',
  'quick-import.action.replace-file': 'Reemplazar archivo',
  'quick-import.action.import-count.one': 'Importar {count} operación',
  'quick-import.action.import-count.few': 'Importar {count} operaciones',
  'quick-import.action.import-count.many': 'Importar {count} operaciones',
  'quick-import.action.import-count.other': 'Importar {count} operaciones',
  'quick-import.preview.more': '+ {count} operaciones procesadas más',

  'trade-import.notice.capabilities-failed':
    'No se pudieron cargar las capacidades de Trade Import',
  'trade-import.notice.open-failed': 'No se pudo abrir Trade Import',
  'trade-import.notice.template-exists':
    'Ya existe una plantilla de Trade Import con este nombre',
  'trade-import.notice.template-saved': 'Plantilla de Trade Import guardada',
  'trade-import.notice.analyse-failed': 'Falló el análisis de Trade Import',
  'trade-import.notice.preview-failed': 'Falló la vista previa de Trade Import',
  'trade-import.notice.free-preview-rate-limited':
    'Has alcanzado el límite de vistas previas gratuitas. Activa PRO o inténtalo de nuevo en unos {minutes} minutos.',
  'trade-import.notice.free-preview-storage-limit-reached':
    'El almacenamiento de vistas previas gratuitas admite hasta {limit} operaciones. Tienes {storedItems} guardadas y este archivo añadiría {requestedItems}. Espera a que caduque una vista previa anterior o activa PRO.',
  'trade-import.preview-error.guidance':
    'Comprueba que todos los campos obligatorios estén asignados, que el formato de fecha seleccionado coincida con tu archivo y que las columnas numéricas contengan valores de operación válidos.',
  'trade-import.notice.complete':
    'Trade Import completado: {written} escritas o actualizadas, {duplicateCount} duplicadas, {failedCount} fallidas',
  'trade-import.gate.brand-left': 'Operaciones',
  'trade-import.gate.brand-right': 'Importar',
  'trade-import.gate.sign-in.title':
    'Previsualiza gratis tu historial de trading',
  'trade-import.gate.sign-in':
    'Inicia sesión o crea una cuenta gratuita de Journalit para analizar tu archivo. Solo necesitas Pro cuando importes las operaciones.',
  'trade-import.gate.sign-in.cta': 'Iniciar sesión para previsualizar gratis',

  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Plantilla de asignación local',
  'trade-import.label.template-actions': 'Acciones de plantilla',
  'trade-import.template.none': 'Sin plantilla',
  'trade-import.label.account': 'Cuenta',
  'trade-import.label.broker': 'Fuente de exportación / plataforma',
  'trade-import.label.asset-type': 'Tipo de activo',
  'trade-import.label.destination': 'Importar como',
  'trade-import.destination.live': 'Operaciones reales',
  'trade-import.destination.backtest': 'Operaciones de backtest',
  'trade-import.destination.backtest-hint':
    'Se guardan como operaciones de backtest, separadas de tus operaciones reales.',
  'trade-import.label.export-format': 'Tipo de exportación',
  'trade-import.format.tradingview.paper': 'Trading simulado',
  'trade-import.format.tradingview.strategy': 'Probador de estrategias',
  'trade-import.format.tradingview.paper-hint':
    'La exportación Order History del panel Paper Trading.',
  'trade-import.format.tradingview.strategy-hint':
    'La exportación List of Trades del probador de estrategias.',
  'trade-import.label.symbol': 'Símbolo',
  'trade-import.symbol.hint':
    'Esta exportación no indica el símbolo con el que se probó. Escríbelo como lo muestra TradingView, por ejemplo CME_MINI:ES1!.',
  'trade-import.asset.stock': 'Acciones',
  'trade-import.asset.options': 'Opciones',
  'trade-import.asset.futures': 'Futuros',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Cripto',
  'trade-import.manual-mode.price-based':
    'Órdenes o ejecuciones (agrupadas en operaciones)',
  'trade-import.manual-mode.direct-pnl': 'Una operación por fila (usa P/L)',
  'trade-import.label.ai-mapping': 'Solicitar sugerencias de asignación con IA',
  'trade-import.privacy.copy':
    'El archivo seleccionado y las opciones de importación se envían a Journalit. Los registros de diagnóstico cifrados caducan al cabo de 1 día (gratis) o 14 días (Pro); las vistas previas, a los 7 días. El mapeo opcional con IA envía encabezados y filas de muestra a un modelo de IA. Trade Import no envía telemetría del cliente ni informes de errores en segundo plano por separado. Los archivos pueden contener identificadores de cuenta, historial de operaciones, notas, precios, cantidades, comisiones, saldos y pérdidas y ganancias. Las solicitudes también envían definiciones de campos personalizados y opciones guardadas; la vista previa incluye el nombre de la cuenta de destino. Desactiva el mapeo con IA para evitar ese procesamiento.',

  'trade-import.action.analyse': 'Analizar archivo',
  'trade-import.action.choose-file': 'Choose file',
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
  'trade-import.action.drop-file': 'Suelta el archivo para subirlo',
  'trade-import.analyse.detected':
    'Hemos leído tu archivo {fileType}. Revisa las filas de abajo y asigna cada columna a un campo de la operación.',
  'trade-import.analyse.detected-native':
    'Hemos leído tu archivo {fileType}. Revisa las filas de abajo y selecciona «Generar vista previa».',
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
  'quick-import.message.symbol-required':
    'Esta exportación no indica su símbolo. Abre la importación completa para escribirlo.',
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
  'trade-import.label.sheet': 'Hoja',
  'trade-import.label.header-row': 'Fila de encabezado',
  'trade-import.placeholder.auto': 'Automático',
  'trade-import.label.date-format': 'Formato de fecha',

  'trade-import.label.save-template': 'Guardar plantilla de asignación',
  'trade-import.placeholder.template-name': 'Nombre de la plantilla',
  'trade-import.action.save-template': 'Guardar plantilla',
  'trade-import.action.preview': 'Generar vista previa',

  'trade-import.preview.found.one': 'Encontramos {count} operación',
  'trade-import.preview.found.few': 'Encontramos {count} operaciones',
  'trade-import.preview.found.many': 'Encontramos {count} operaciones',
  'trade-import.preview.found.other': 'Encontramos {count} operaciones',
  'trade-import.preview.date-range': 'De {start} a {end}',
  'trade-import.preview.metric.symbols': 'Símbolos',
  'trade-import.preview.metric.ready': 'Listas para importar',
  'trade-import.preview.metric.duplicates': 'Posibles duplicados',
  'trade-import.preview.metric.attention': 'Requieren atención',
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
  'trade-import.table.status': 'Estado',
  'trade-import.table.symbol': 'Símbolo',
  'trade-import.table.direction': 'Dirección',
  'trade-import.table.entry-time': 'Hora de entrada',
  'trade-import.table.date': 'Fecha',
  'trade-import.table.result': 'Resultado',
  'trade-import.table.quantity': 'Cantidad',
  'trade-import.table.message': 'Mensaje',
  'trade-import.status.new': 'Nueva',
  'trade-import.status.already-imported': 'Ya importada',
  'trade-import.status.other-account': 'En otra cuenta',
  'trade-import.status.other-account.detail': 'Ya importada en {account}',
  'trade-import.status.split-across-trades.detail':
    'Sus ejecuciones ya están en tu diario, repartidas en varias operaciones. Para añadir las que faltan, importa los mismos rangos de fechas que antes.',
  'trade-import.status.updates-existing': 'Actualiza una operación existente',
  'trade-import.status.possible-duplicate': 'Posible duplicado',
  'trade-import.status.needs-review': 'Requiere revisión',
  'trade-import.status.duplicate-in-file': 'Duplicada en el archivo',
  'trade-import.status.invalid': 'Operación no válida',
  'trade-import.status.no-open-trade': 'No hay operación abierta que cerrar',
  'trade-import.status.multiple-open-trades':
    'Coinciden varias operaciones abiertas',
  'trade-import.status.quantity-mismatch': 'Cantidad no coincide',
  'trade-import.commit-failure.update-target-changed':
    'La operación que esta fila actualiza se cambió o eliminó después de la vista previa. Vuelve a importar el archivo.',
  'trade-import.commit-failure.tradovate-overlap':
    'Se solapa con una operación ya sincronizada desde Tradovate con la que no se pudo emparejar.',
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
    'Esto elimina definitivamente "{account}" y sus operaciones importadas ({count} en el servidor) del servidor de Journalit y mueve sus notas a la papelera en todos los vaults sincronizados. Después puedes volver a importar los archivos.',
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
    'Esto elimina definitivamente del servidor de Journalit las operaciones que esta importación añadió a "{account}" ({count} en el servidor) y mueve sus notas a la papelera en todos los vaults sincronizados. Las operaciones que también contiene otra importación se conservan. Después puedes volver a importar el archivo.',
  'trade-import.history.delete.updates-kept':
    'Los cambios que hizo en operaciones importadas antes, como cerrarlas, se mantienen.',
  'trade-import.history.delete.message-updates-only':
    'Esta importación solo modificó operaciones importadas antes, por ejemplo cerrándolas. Al eliminarla desaparece del historial de importaciones; esos cambios se mantienen.',
  'trade-import.history.delete.message-none-deleted':
    'No se elimina ninguna operación: todas las de esta importación están también en otra importación. Eliminarla solo la quita del historial de importaciones.',
  'trade-import.history.delete.confirm': 'Eliminar importación',
  'trade-import.history.load-more': 'Cargar más',
  'account.edit.modal.delete.delete-server-trades':
    'Eliminar también sus operaciones importadas del servidor de Journalit ({count} en el servidor). Sus notas irán a la papelera en todos los vaults sincronizados, aunque las conserves aquí.',
  'trade-import.preview.other-account.message':
    'Ya están en {account} ({count}), así que se omitirán.',
  'trade-import.preview.other-account.import-instead': 'Importar en {account}',
  'trade-import.preview.other-account.undo-earlier':
    'Deshacer la importación anterior',
  'trade-import.action.confirm': 'Confirmar importación',
  'trade-import.action.activate-pro.one':
    'Activar PRO para importar {count} operación',
  'trade-import.action.activate-pro.few':
    'Activar PRO para importar {count} operaciones',
  'trade-import.action.activate-pro.many':
    'Activar PRO para importar {count} operaciones',
  'trade-import.action.activate-pro.other':
    'Activar PRO para importar {count} operaciones',
  'trade-import.action.cancel-preview': 'Cancelar vista previa',
  'trade-import.broker.manual': 'Asignación manual',
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
  'trade-import.recovery.rithmic-order-history.title':
    'Formato de Rithmic no compatible',
  'trade-import.recovery.rithmic-order-history.message':
    'Sube un historial de órdenes de Rithmic o elige la plataforma que creó este archivo.',
  'trade-import.recovery.no-trade-rows.title':
    'Este archivo no tiene operaciones para importar',
  'trade-import.recovery.no-trade-rows.message':
    'Corrígelo en una nueva exportación y elige el archivo nuevo.',
  'trade-import.action.choose-another-file': 'Elegir otro archivo',
  'trade-import.source.change-action': 'Cambiar origen',
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
  'setups.create.placeholder.preferred-sessions': 'Londres, Nueva York',
  'setups.create.field.timeframes': 'Temporalidades',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': 'Símbolos',
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
  'setups.edit.button.rename-and-update': 'Renombrar y actualizar operaciones',
  'setups.edit.rename-warning.title':
    'Renombrar setup y actualizar operaciones',
  'setups.edit.rename-warning.message':
    'Renombrar {oldName} a {newName} actualizará las notas de operaciones que usan el nombre anterior del setup.',
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
    'Elige dos tarjetas de setup en la vista general para crear un informe comparativo.',
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

  'setups.guide.compare-select.title': 'Selecciona dos setups',
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
    'Cuando hay operaciones no tomadas o backtests, esta pestaña compara la ejecución capturada con oportunidad perdida o benchmark.',

  'setups.view.open-as-markdown': 'Abrir como Markdown',
  'setups.view.open-as-setup': 'Abrir como setup de Journalit',

  'setups.view.overview.mode.pairs': 'Pares',
  'setups.view.pairs.summary-aria': 'Resumen de pares de setups',
  'setups.view.pairs.best': 'Mejor par',
  'setups.view.pairs.worst': 'Peor par',
  'setups.view.pairs.worst-short': 'Peor',
  'setups.view.pairs.empty':
    'Aún no hay pares de setups con 5 o más operaciones.',
  'setups.view.pairs.empty-submessage':
    'Los pares aparecen cuando dos setups comparten suficientes operaciones vinculadas.',
  'setups.view.pairs.privacy':
    'El rendimiento de los pares se oculta mientras el modo privacidad está activado.',

  'setups.view.pairs.metric-aria': 'Métrica del par',
  'setups.view.pairs.metric.edge': 'Ventaja del par',
  'setups.view.pairs.metric.edge-short': 'ventaja',
  'setups.view.pairs.metric.expectancy': 'Expectativa del par',

  'setups.view.pairs.together': 'Juntos',
  'setups.view.pairs.table.setup-pair': 'Par de setups',

  'setups.view.pairs.evidence': 'Evidencia',
  'setups.view.pairs.edge-comparison': 'Comparación de ventaja',
  'setups.view.pairs.edge-caption': 'Ventaja combinada: {edge}',
  'setups.view.overview.setup-filter.all': 'Setups: todos',
  'setups.view.overview.setup-filter.selected': 'Setups: {count} seleccionados',
  'setups.view.overview.setup-filter.aria': 'Elige los setups que se muestran',
  'setups.view.overview.setup-filter.select-all': 'Seleccionar todo',
  'setups.view.overview.setup-filter.clear': 'Borrar',

  'setups.view.overview.pnl-chart.dropdown-label': 'Cumulative P&L',

  'setups.view.overview.pnl-chart.combined': 'Todos los setups',
  'setups.view.overview.pnl-chart.selected-combined': 'Setups seleccionados',

  'setups.view.overview.pnl-chart.hidden':
    'El P&L de los setups a lo largo del tiempo se oculta mientras el modo privacidad está activado.',
  'setups.view.overview.pnl-chart.trade': 'Operación',
  'setups.view.overview.pnl-chart.start': 'Inicio',
  'setups.view.ranking.empty-submessage':
    'Registra operaciones con setups para empezar a clasificar su rendimiento.',
  'setups.view.empty.no-setups-submessage':
    'Los setups reúnen tus notas de playbook, reglas, operaciones y rendimiento en un solo lugar.',
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
    'Las operaciones con este setup aparecerán aquí cuando empieces a registrarlas.',
  'setups.view.detail.analysis.performance': 'Rendimiento',
  'setups.view.detail.analysis.execution-gap': 'Brecha de ejecución',
  'setups.view.detail.analysis.tabs-aria': 'Pestañas de rendimiento del setup',
  'setups.view.detail.brief.linked-notes-add': 'Editar notas vinculadas',

  'setups.view.detail.execution-gap.live-pnl': 'P&L real',
  'setups.view.detail.execution-gap.live-r': 'R en vivo',
  'setups.view.detail.execution-gap.missed-edge': 'Ventaja no aprovechada',
  'setups.view.detail.execution-gap.live-plus-missed': 'Real + no tomadas',
  'setups.view.detail.execution-gap.backtest': 'Backtest',

  'setups.view.detail.execution-gap.capture-rate': 'Tasa de captura',
  'setups.view.detail.execution-gap.capture-rate-tooltip':
    'P&L real ÷ (P&L real + P&L de operaciones no tomadas). Muestra cuánta de la ventaja disponible capturaste.',
  'setups.view.detail.execution-gap.average-r-delta': 'Delta R media',
  'setups.view.detail.execution-gap.live-execution': 'Ejecución real',
  'setups.view.detail.execution-gap.backtest-benchmark':
    'Referencia de backtest',
  'setups.view.detail.execution-gap.hidden':
    'La brecha de ejecución se oculta en modo privacidad.',
  'setups.view.detail.execution-gap.empty':
    'Registra operaciones no tomadas o de backtest para este setup para analizar las brechas de ejecución.',
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
  'setups.view.detail.brief.count.trades': '{count} operaciones',
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
  'setups.view.card.status.active': 'Estable',
  'setups.view.card.status.monitor': 'Vigilar',
  'setups.view.card.status.review': 'Revisar',
  'setups.view.date.days-ago': '{count}',

  'trade-import.restore.complete':
    'Se restauraron {written} operaciones importadas; {failed} fallaron.',
  'trade-import.restore.broker-label': 'Restauración desde el servidor',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': 'Sincronización de operaciones',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'Sincroniza operaciones desde los informes de MetaTrader subidos mediante tu conexión FTP.',
  'trade-sync.source.trade-import.description':
    'Restaura importaciones de archivos del bróker entre bóvedas y recupera notas de operaciones locales que falten.',
  'trade-sync.source.tradovate.description':
    'Sincroniza las operaciones de Tradovate en la nube y llévalas a esta bóveda.',
  'trade-sync.tradovate.status-failed':
    'No se pudo cargar el estado de Tradovate.',
  'trade-sync.tradovate.last-sync': 'Última sincronización',
  'trade-sync.tradovate.last-projection': 'Última proyección',
  'trade-sync.tradovate.pending-projections':
    '{count} proyección(es) pendiente(s)',
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
  'trade-sync.rithmic.sync-all-provider-partial':
    'Se sincronizaron {succeeded} de {total} conexiones de Rithmic · sincronización completada en parte',
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
  'trade-sync.tradovate.never': 'Nunca',

  'trade-sync.import.card.inventory-summary':
    '{accounts} cuenta(s) · {trades} operación(es)',
  'trade-sync.import.action.check': 'Comprobar',
  'trade-sync.import.more-actions': 'Más acciones',

  'trade-sync.import.action.open-import': 'Abrir Trade Import',

  'trade-sync.import.action.create-local-account': 'Crear cuenta',

  'trade-sync.import.action.restore-account': 'Restaurar',
  'trade-sync.import.action.restoring': 'Restaurando…',

  'trade-sync.import.pending-acks': '{count} confirmación(es) pendiente(s)',

  'trade-sync.import.empty-accounts':
    'Aún no se encontraron cuentas de Trade Import con copia de seguridad.',
  'trade-sync.import.account.restorable-count': '{count} restaurable(s)',
  'trade-sync.import.account.synced-count': '{count} sincronizada(s)',
  'trade-sync.import.account.missing-count': '{count} faltante(s)',
  'trade-sync.import.account.issue-count': '{count} problema(s)',
  'notice.error.canonical-trade-type-change':
    'Los trades sincronizados con el bróker no pueden cambiarse a otro tipo de trade.',
  'trade-sync.import.account.conflict-repair':
    'Se encontraron notas con canonicalTradeId duplicado. Conserva una nota y elimina canonicalTradeId de la duplicada o elimina esa nota. Cambiar el nombre del archivo no resuelve el conflicto.',
  'trade-sync.import.account.local-account': 'Cuenta de Journalit',
  'trade-sync.import.notice.restored':
    'Se restauraron {count} operación(es) importada(s).',

  'trade-sync.import.notice.sync-cloud-failed':
    'No se pudo iniciar la sincronización en la nube.',
  'trade-sync.import.notice.load-failed':
    'No se pudo cargar el estado de sincronización de Trade Import.',
  'trade-sync.import.notice.mapping-failed':
    'No se pudo guardar la asignación de cuentas de Trade Import.',
  'trade-sync.import.notice.create-account-failed':
    'No se pudo crear la cuenta local.',
  'trade-sync.import.notice.restore-failed':
    'No se pudo restaurar la cuenta de Trade Import.',
  'trade-sync.rate-limit.action.mapping': 'Asignación de cuenta',
  'trade-sync.import.notice.rate-limited':
    '{action}: Demasiadas solicitudes. Inténtalo de nuevo en {seconds} s.',
  'setups.view.loading': 'Cargando setups…',
  'setups.view.trade.unknown-instrument': 'Instrumento desconocido',
  'command.open-session-mode': 'Abrir sesión en vivo',
  'view.session-mode': 'Modo sesión',
  'widget.session-log.name': 'Registro de sesión',
  'widget.session-log.description':
    'Captura notas de ejecución con marca de tiempo y eventos de trades.',
  'session-log.title': 'Registro del modo sesión',
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
  'session-log.lessons.title': 'Lecciones aprendidas',

  'session-log.lessons.badge': 'LSN',
  'session-log.session-group.outside': 'Fuera de sesiones',

  'session-log.trade.entered': 'Entrada',
  'session-log.trade.exited': 'Salida',
  'session-log.trade.size': 'tamaño',

  'session-log.status.unclassified': 'sin clasificar',
  'session-log.action.save': 'Guardar',
  'session-log.action.cancel': 'Cancelar',

  'session-log.action.classify': 'Clasificar',
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

  'session-mode.unconfigured.title': 'Configurar el modo sesión',
  'session-mode.unconfigured.description':
    'Añade tus horarios de sesión para empezar.',
  'session-mode.unconfigured.step.window.title':
    'Agregar una ventana de sesión',
  'session-mode.unconfigured.step.prep.title':
    'Revisar el tiempo de preparación',
  'session-mode.unconfigured.step.gate.title': 'Usar el Trade Gate inicial',
  'session-mode.unconfigured.step.log.title':
    'Tomar notas durante las sesiones en vivo',
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

  'session-mode.layout.empty.title': 'No hay nada activado para esta fase',
  'session-mode.layout.empty.description':
    'Vuelve a activar módulos para construir esta fase del modo sesión.',
  'session-mode.duration.minutes': '{minutes} min',
  'session-mode.duration.hours': '{hours} h',
  'session-mode.duration.hours-minutes': '{hours} h {minutes} min',
  'settings.session-mode.title': 'Modo sesión',
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
  'settings.session-mode.layout.title': 'Diseño de fases',

  'settings.session-mode.layout.phase-desc.preparation':
    'Elige qué se muestra durante la preparación antes de empezar a operar.',
  'settings.session-mode.layout.phase-desc.live':
    'Elige qué se muestra mientras una sesión de trading configurada está en curso.',

  'settings.session-mode.layout.phase-desc.ended':
    'Elige qué se muestra cuando han terminado todas las sesiones de trading configuradas.',
  'settings.session-mode.layout.reset-phase': 'Restablecer',

  'settings.session-mode.layout.module.preparation-resources': 'Recursos',
  'settings.session-mode.layout.module.preparation-resources-desc':
    'Muestra las notas de preparación y los playbooks vinculados.',
  'settings.session-mode.layout.module.preparation-goals': 'Objetivos',
  'settings.session-mode.layout.module.preparation-goals-desc':
    'Muestra el widget de objetivos del DRC para centrarte antes de la sesión.',
  'settings.session-mode.layout.module.preparation-checklist':
    'Lista de verificación',
  'settings.session-mode.layout.module.preparation-checklist-desc':
    'Muestra el widget de checklist del DRC para preparar la sesión.',
  'settings.session-mode.layout.module.trade-gate': 'Trade Gate',
  'settings.session-mode.layout.module.trade-gate-desc':
    'Ejecuta tu gate SI/ENTONCES configurado durante la sesión en vivo.',
  'settings.session-mode.layout.module.timeline': 'Cronología de la sesión',
  'settings.session-mode.layout.module.timeline-desc':
    'Muestra las notas y entradas de operaciones de la sesión actual en la cronología.',

  'settings.session-mode.layout.module.ended-actions':
    'Acciones de fin de sesión',
  'settings.session-mode.layout.module.ended-actions-desc':
    'Muestra acciones de importación, operación manual y DRC cuando terminan las sesiones.',
  'settings.session-mode.layout.module.ended-stats':
    'Estadísticas de la sesión',
  'settings.session-mode.layout.module.ended-stats-desc':
    'Muestra los totales de operaciones, notas y comprobaciones del gate del día.',
  'settings.session-mode.linked-resources': 'Recursos enlazados',
  'settings.session-mode.linked-resources-desc':
    'Muestra enlaces rápidos a notas durante la preparación.',
  'settings.session-mode.linked-resources-count': '{count} vinculados',
  'settings.session-mode.linked-resources-hide': 'Ocultar vinculados',
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
  'settings.session-mode.tag-short-label-placeholder': 'Etiqueta',
  'settings.session-mode.tag-label-example': 'Operación',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': 'Color de etiqueta',
  'settings.session-mode.tag-requires-resolution': 'Requiere clasificación',
  'settings.session-mode.tag-lesson': 'Etiqueta de lección',
  'settings.session-mode.tag-requires-resolution-tooltip':
    'Las entradas con esta etiqueta se tratan como notas sin categoría. Úsala cuando la etiqueta correcta no esté clara durante la sesión y clasifica la entrada más tarde.',
  'settings.session-mode.tag-lesson-tooltip':
    'Marca esta etiqueta como entrada de aprendizaje. Las notas con etiqueta de lección se quedan en el registro de sesión y pueden destacarse con filtros de lecciones y resúmenes de revisión.',
  'settings.session-mode.add-session-log-tag':
    'Añadir etiqueta del registro de sesión',
  'settings.session-mode.reset-session-log-tags': 'Restablecer',
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

  'trade-gate.action.start-short': 'Iniciar',
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
  'settings.session-mode.trade-gate.prompt': 'Pregunta',
  'settings.session-mode.trade-gate.options': 'Opciones',
  'settings.session-mode.trade-gate.option': 'Opción',
  'settings.session-mode.trade-gate.option-label': 'Etiqueta de opción',
  'settings.session-mode.trade-gate.option-target': 'Conduce a',
  'settings.session-mode.trade-gate.flow-map': 'Mapa de flujo',
  'settings.session-mode.trade-gate.flow-fit': 'Ajustar',
  'settings.session-mode.trade-gate.flow-click-hint':
    'Haz clic en una tarjeta, una etiqueta de ruta o un resultado para editarlo.',
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
  'setups.view.metric.trades': 'operaciones',
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
  'setups.view.detail.brief.health.trades': 'Operaciones',

  'setups.view.detail.brief.profile.direction': 'Dirección',
  'setups.view.detail.brief.profile.sessions': 'Sesiones',
  'setups.view.detail.brief.profile.timeframes': 'Marcos temporales',
  'setups.view.detail.brief.profile.tickers': 'Símbolos',
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
  'tradelog.mode.trades': 'Operaciones',
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

  'imageGallery.open-source': 'Abrir origen',
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
  'imageGallery.source.trade': 'Operaciones',
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
  'tradelog.guide.gallery-grouping.title':
    'Agrupa el contenido multimedia por entrada del diario',
  'tradelog.guide.gallery-grouping.description':
    'Agrupado mantiene juntas cada operación, revisión o carpeta configurada. Individual muestra cada elemento multimedia como su propia tarjeta.',
  'tradelog.guide.gallery-source-sort.title':
    'Elige la fuente y el orden del contenido multimedia',
  'tradelog.guide.gallery-source-sort.description':
    'Usa Origen para centrarte en todos los medios, los adjuntos de operaciones, los medios de notas de revisión o las carpetas del vault configuradas. Usa Ordenar para revisar los elementos del más reciente al más antiguo o por rendimiento de la operación.',
  'tradelog.guide.gallery-filters.title':
    'Filtra la galería desde el mismo punto de entrada',
  'tradelog.guide.gallery-filters.description':
    'El menú de filtros funciona igual aquí. En el modo Galería también incluye una sección Galería con filtros de medios, como el estado de anotación y las etiquetas de medios.',
  'tradelog.guide.gallery-grid.title':
    'Abre el contenido multimedia para revisarlo de cerca',
  'tradelog.guide.gallery-grid.description':
    'Cada tarjeta mantiene el gráfico despejado mientras muestra contexto compacto del trade o revisión. Haz clic en cualquier tarjeta o pulsa Siguiente para abrir el primer elemento visible en pantalla completa.',
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
    'Si eliges varios valores, decide si una operación necesita «Cualquiera de», «Todos de», «Solo estos» o «Exactamente estos». Las etiquetas, los setups, los errores y los campos personalizados tienen esta opción de Coincidencia.',
  'filter.menu.whats-new.phases.title': 'Filtra por fase del desafío',
  'filter.menu.whats-new.phases.description':
    'Las cuentas de fondeo con más de una fase abren una lista de sus fases. Elige fases sueltas en lugar de toda la cuenta.',
  'filter.menu.whats-new.done.title': 'Esto es lo nuevo en los filtros',
  'filter.menu.whats-new.done.description':
    'El mismo menú funciona en el Registro de operaciones, el Panel, Inicio, Setups y las revisiones. Los cambios se aplican en cuanto haces clic.',
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
  'account.prop-challenge.challenge-name': 'Nombre del desafío',
  'account.prop-challenge.challenge-name-placeholder':
    'p. ej., Evaluación de 25K',
  'account.prop-challenge.firm-name': 'Nombre de la firma',
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
  'account.prop-challenge.phase-rules': 'Reglas de {phase}',
  'account.prop-challenge.next-phase': 'Siguiente: {phase}',
  'account.prop-challenge.view-phase': 'Ver fase',
  'account.prop-challenge.unnamed-phase': 'Fase sin nombre',
  'account.prop-challenge.phase-name': 'Nombre de la fase',
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
  'account.prop-challenge.rule.daily-loss-model': 'Importe de pérdida diaria',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'Importe fijo',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'Aumenta al alcanzar el umbral de beneficio de la cuenta',
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
    'Introduce pares beneficio:límite-de-pérdida separados por comas. La base de beneficio al cierre del día anterior fija el límite del siguiente día, que puede subir o bajar.',
  'account.prop-challenge.rule.loss-tiers':
    'Niveles de beneficio y límites de pérdida',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'El límite monetario ajustado se activa permanentemente cuando el beneficio realizado acumulado de operaciones de esta fase alcanza el porcentaje configurado de su saldo inicial.',
  'account.prop-challenge.rule.help.target-amount':
    'Las metas absolutas usan la moneda de la cuenta; los porcentajes, el saldo inicial de esta fase. El progreso usa el aumento del saldo tras aplicar el límite diario de beneficio acreditado, sin P&L no realizado.',
  'account.prop-challenge.rule.target-needs-balance':
    'Un objetivo en porcentaje necesita un saldo inicial mayor que 0.',
  'account.prop-challenge.rule.help.credit-withdrawals':
    'Suma los importes brutos de los retiros registrados al progreso de la meta absoluta. No cambia el saldo ni la elegibilidad para retiros.',
  'account.prop-challenge.rule.help.drawdown-amount':
    'Distancia monetaria bajo el saldo inicial (estático) o el máximo de saldo realizado (móvil). Tocar el suelo infringe la regla.',
  'account.prop-challenge.rule.help.drawdown-mode':
    'El estático mantiene el suelo fijo. El móvil EOD sigue los máximos al cierre del día de trading; el intradía sigue transacciones de saldo realizado, no patrimonio no realizado.',
  'account.prop-challenge.rule.help.lock-balance':
    'Techo del suelo de drawdown móvil, no saldo de activación. El suelo deja de subir en este saldo. Vacío significa sin techo.',
  'account.prop-challenge.rule.help.daily-loss-amount':
    'Límite monetario de la peor pérdida neta realizada acumulada de operaciones en un día de trading, no de la caída desde su máximo. Tocar el límite infringe la regla.',
  'account.prop-challenge.rule.help.breach-action':
    'Fallar la cuenta mantiene activa una infracción histórica. Pausar hasta la próxima sesión se aplica solo al día de trading actual; las infracciones anteriores quedan en el historial.',
  'account.prop-challenge.rule.help.daily-loss-model':
    'Elige un límite fijo, un cambio permanente por umbral de beneficio, escalado por beneficio EOD máximo o niveles del EOD anterior. Los campos condicionales configuran el modelo elegido.',
  'account.prop-challenge.rule.help.profit-basis':
    'El beneficio acumulado de operaciones excluye flujos de efectivo. El beneficio actual de la cuenta los incluye, por lo que los retiros lo reducen. Ambos usan cierres de días de trading anteriores.',
  'account.prop-challenge.rule.help.position-model':
    'Elige un límite por operación fijo, un contrato adicional por escalón de beneficio o niveles explícitos. El escalado usa cierres de días de trading anteriores.',
  'account.prop-challenge.rule.help.max-contracts':
    'Tamaño máximo por operación tras la conversión opcional de micros, no exposición conjunta de varias operaciones. Superar el límite infringe la regla.',
  'account.prop-challenge.rule.help.initial-contracts':
    'Límite inicial de contratos por operación antes de que el beneficio al cierre del día permita límites mayores.',
  'account.prop-challenge.rule.help.maximum-contracts':
    'Techo opcional de los aumentos de contratos basados en beneficio. Vacío significa sin techo adicional.',
  'account.prop-challenge.rule.help.daily-profit':
    'Umbral monetario del P&L neto realizado diario, incluidas ganancias, pérdidas y costes. El beneficio no realizado y los flujos de efectivo no cuentan.',
  'account.prop-challenge.rule.help.consistency-cushion':
    'Se suma al porcentaje máximo del mejor día en puntos porcentuales: 30% + 5 puntos permite 35%. Vacío no añade margen.',
  'account.prop-challenge.rule.help.daily-profit-cap':
    'Tope monetario del beneficio de cada día de trading acreditado a la meta de fase. El exceso permanece en el saldo; las pérdidas cuentan completas.',
  'account.prop-challenge.rule.help.live-review':
    'Beneficio neto realizado que un día de trading debe alcanzar para ser elegible para revisión. No avanza la fase automáticamente ni concede una cuenta real.',
  'account.prop-challenge.rule.profit-threshold-percent':
    'Umbral de beneficio de la cuenta (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'Pérdida diaria tras el umbral',
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
  'account.prop-challenge.rule.strict-help':
    'El beneficio neto del mejor día debe ser estrictamente inferior al límite. La igualdad no basta.',
  'account.prop-challenge.rule.profit-basis.current-account':
    'Beneficio actual de la cuenta (los pagos reducen)',
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
    'Alcanza el aumento de saldo configurado para pasar la fase. Los topes de beneficio acreditado y el crédito opcional de retiros afectan al progreso; el beneficio no realizado no cuenta.',
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
    'Días distintos de entrada de operaciones exigidos en esta fase, incluidas entradas aún abiertas. Usa el corte del día de trading configurado, no la medianoche.',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '{current} de {target} días de trading hechos, {remaining} por alcanzar.',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    'Días exigidos que alcanzan el beneficio neto realizado diario mínimo en esta fase. Los retiros registrados no reinician esta regla de toda la fase.',
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
  'account-dashboard.prop.metrics.pass-rate': 'Tasa de éxito',
  'account-dashboard.prop.metrics.costs': 'Costes del desafío',
  'account-dashboard.prop.metrics.net': 'Neto',
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
  'filter.menu.tickers': 'Símbolos',
  'filter.menu.setups': 'Setups',
  'filter.menu.tags': 'Etiquetas',
  'filter.menu.mistakes': 'Errores',
  'filter.menu.trade-type': 'Tipo de operación',
  'filter.menu.status': 'Estado',
  'filter.menu.direction': 'Dirección',
  'filter.menu.review-status': 'Estado de revisión',
  'filter.menu.rating': 'Valoración',
  'filter.menu.rating.unrated': 'Sin valorar',
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
  'account.prop-challenge.summary.status.payout_ready': 'Listo para el pago',
  'account.prop-challenge.ribbon.passed': '{phase} superada',
  'account.prop-challenge.ribbon.failed': '{phase} fallida',
  'account.prop-challenge.ribbon.action.advance': 'Avanzar a {phase}',
  'account.prop-challenge.ribbon.action.advance-short': 'Avanzar',
  'account.prop-challenge.ribbon.action.mark-passed': 'Marcar como superado',
  'account.prop-challenge.ribbon.action.archive': 'Archivar',
  'account.prop-challenge.ribbon.action.record-payout': 'Registrar pago',
  'account.prop-challenge.ribbon.action.record-payout-short': 'Pago',
  'account.prop-challenge.payout.title': 'Preparación para el pago',
  'account.prop-challenge.payout.available': 'Disponible ahora',
  'account.prop-challenge.payout.lifetime-qualifying-days':
    'Días calificables acumulados',
  'account.prop-challenge.payout.requirement.days': 'Días de trading',
  'account.prop-challenge.payout.requirement.qualifying-days': 'Días válidos',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'Saldo mínimo de la cuenta',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'Beneficio del ciclo positivo',
  'account.prop-challenge.payout.requirement.cycle-profit':
    'Beneficio del ciclo',
  'account.prop-challenge.payout.requirement.consistency': 'Consistencia',
  'account.prop-challenge.payout.requirement.minimum': 'Mínimo disponible',
  'account.prop-challenge.payout.requirement.payouts': 'Pagos permitidos',
  'account.prop-challenge.payout.requirement.request-window':
    'Ventana de solicitud',
  'account.prop-challenge.payout.timezone-invalid':
    'No es una zona horaria conocida.',
  'account.prop-challenge.payout.preview-amount': 'Vista previa del pago',
  'account.prop-challenge.payout.you-receive': 'Parte del trader',
  'account.prop-challenge.payout.balance-after': 'Saldo después',
  'account.prop-challenge.payout.drawdown-floor': 'Suelo de drawdown',
  'account.prop-challenge.payout.buffer-after':
    'Margen antes del incumplimiento',
  'account.prop-challenge.payout.request-not-allowed':
    'No elegible con este importe',
  'account.prop-challenge.payout.immediate-breach':
    'Este pago dejaría la cuenta en su suelo de drawdown o por debajo.',
  'account.prop-challenge.payout.account-concludes':
    'Este pago completa el ciclo de pagos configurado de la cuenta financiada simulada.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'Este pago hace avanzar la cuenta a su siguiente etapa configurada.',
  'account.prop-challenge.payout.live-review-after-payout':
    'Este pago hace que la cuenta sea apta para la revisión de cuenta real.',
  'account.prop-challenge.stage': 'Tipo de etapa',
  'account.prop-challenge.stage.evaluation': 'Evaluación',
  'account.prop-challenge.stage.sim-funded': 'Financiada simulada',
  'account.prop-challenge.stage.live-funded': 'Financiada real',
  'account.prop-challenge.payout-rules.title': 'Reglas de pago',
  'account.prop-challenge.payout-rules.cycle': 'Ciclo de elegibilidad',
  'account.prop-challenge.payout-rules.request-window':
    'Momento de la solicitud',
  'account.prop-challenge.payout-rules.request-window.anytime': 'Cualquier día',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'Días de la semana concretos',
  'account.prop-challenge.payout-rules.request-window.time-zone':
    'Zona horaria',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'Días permitidos para solicitar',
  'account.prop-challenge.payout-rules.cycle.none': 'Sin ciclo de espera',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'Días de trading',
  'account.prop-challenge.payout-rules.cycle.qualifying-days': 'Días válidos',
  'account.prop-challenge.payout-rules.cycle.calendar-days': 'Días naturales',
  'account.prop-challenge.payout-rules.days': 'Días requeridos',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'Beneficio diario mínimo',
  'account.prop-challenge.payout-rules.anchor': 'El ciclo empieza desde',
  'account.prop-challenge.payout-rules.anchor.phase-start':
    'Inicio de la etapa',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'Primera operación',
  'account.prop-challenge.payout-rules.minimum-balance':
    'Saldo mínimo de la cuenta',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Beneficio mínimo del ciclo',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'Ganancia mínima del ciclo por número de pago',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'Exigir beneficio positivo en el ciclo tras el primer pago',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Participación máxima del mejor día (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'Porcentaje máximo del mejor día por número de pago (%)',
  'account.prop-challenge.payout-rules.availability': 'Beneficio disponible',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Por encima del saldo inicial',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Por encima del suelo de saldo',
  'account.prop-challenge.payout-rules.balance-floor': 'Suelo de saldo',
  'account.prop-challenge.payout-rules.request-percent':
    'Porcentaje retirable (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'Nuevo beneficio exigido por solicitud (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'Limita la solicitud para que el porcentaje configurado esté respaldado por el beneficio obtenido en el ciclo de pago actual. Por ejemplo, 50% permite solicitar hasta el doble del beneficio del ciclo actual.',
  'account.prop-challenge.payout-rules.minimum-request': 'Solicitud mínima',
  'account.prop-challenge.payout-rules.maximum': 'Solicitud máxima',
  'account.prop-challenge.payout-rules.maximum.none': 'Sin máximo',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Máximo fijo',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    'Máximo solo para el primer pago',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Máximo según número de pago',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    'Porcentaje de la ganancia del ciclo',
  'account.prop-challenge.payout-rules.maximum-amount': 'Importe máximo',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'Máximo del primer pago',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'Máximo de ganancia del ciclo (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'Seguir usando el último importe en los pagos posteriores',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'Seguir usando el último valor para pagos posteriores',
  'account.prop-challenge.payout-rules.schedule':
    'Importes según número de pago',
  'account.prop-challenge.payout-rules.profit-split':
    'Participación del trader en el beneficio (%)',
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
  'account.prop-challenge.payout-rules.maximum-payouts': 'Pagos máximos',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'Tras el último pago',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'Continuar la cuenta',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'Cerrar la cuenta',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'Avanzar a la siguiente etapa',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'Apta para revisión de cuenta real',
  'account.prop-challenge.payout-rules.aftermath': 'Tras un pago aprobado',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'Descontar el pago; mantener el suelo de drawdown',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'Descontar el pago; fijar el suelo de drawdown',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'Restablecer cuenta y drawdown',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'Suelo de drawdown tras el pago',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'El primer pago ignora el beneficio mínimo del ciclo',
  'account.prop-challenge.payout-rules.reset-cycle':
    'Reiniciar el ciclo de elegibilidad tras el pago',
  'account.prop-challenge.payout-rules.group.eligibility': 'Elegibilidad',
  'account.prop-challenge.payout-rules.group.availability': 'Pago disponible',
  'account.prop-challenge.payout-rules.group.terms': 'Condiciones de pago',
  'account.prop-challenge.payout-rules.group.aftermath': 'Después del pago',
  'account.prop-challenge.payout.requirement.elapsed-hours':
    'Tiempo transcurrido',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'Cambia según el beneficio de la cuenta',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'El beneficio acumulado de la cuenta es el saldo actual menos el saldo inicial más los retiros anteriores. El porcentaje por debajo o en/por encima del umbral se aplica a toda la solicitud.',
  'account.prop-challenge.payout-rules.profit-split.marginal-help':
    'La parte de la solicitud por debajo de este umbral de beneficio de la cuenta usa el porcentaje inferior; la parte superior usa el porcentaje superior.',
  'account.prop-challenge.payout-rules.profit-split.below':
    'Participación del trader por debajo del umbral (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'Umbral de beneficio de la cuenta',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'Participación del trader en o por encima del umbral (%)',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Horas mínimas transcurridas',

  
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
  'account.merge.error.target-needs-balance':
    'El saldo inicial de esta cuenta es 0, así que un objetivo en porcentaje no se puede medir. Use un objetivo en importe, o cancele e indique primero el saldo inicial de la cuenta.',
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
  'onboarding.legacy-challenge.title': 'Desafíos de prop firm',
  'onboarding.legacy-challenge.action.skip': 'Omitir',
  'onboarding.legacy-challenge.accounts.show-archived': 'Mostrar archivadas',
  'onboarding.legacy-challenge.accounts.empty': 'No hay cuentas que configurar',
  'onboarding.legacy-challenge.loading': 'Cargando...',
  'onboarding.legacy-challenge.suggested': 'Sugerido',
  'onboarding.legacy-challenge.row.aria': 'Acción para {account}',
  'onboarding.legacy-challenge.status.combined': 'Combinadas',
  'onboarding.legacy-challenge.status.converted': 'Convertida',
  'onboarding.legacy-challenge.entry.name': 'Desafíos de prop firm',
  'onboarding.legacy-challenge.entry.desc':
    'Combina o convierte cuentas existentes en challenges.',
  'onboarding.legacy-challenge.entry.action': 'Configurar',

  'dashboard.conversion.requires-conversion':
    'Los gráficos de P&L con varias divisas requieren conversión de tipos de cambio.',

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
  'trade-handoff.summary.update-complete': '{trades} actualizadas',
  'trade-handoff.summary.update-partial':
    '{trades} actualizadas con incidencias',
  'trade-handoff.summary.mixed-complete':
    '{imported} importadas · {updated} actualizadas',
  'trade-handoff.summary.mixed-partial':
    '{imported} importadas · {updated} actualizadas, con incidencias',
  'trade-handoff.summary.import-partial': '{trades} importadas con incidencias',
  'trade-handoff.summary.import-provider-partial':
    '{trades} importadas · sincronización completada en parte',
  'trade-handoff.summary.update-provider-partial':
    '{trades} actualizadas · sincronización completada en parte',
  'trade-handoff.summary.mixed-provider-partial':
    '{imported} importadas · {updated} actualizadas · sincronización completada en parte',
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
  
  
  'account.prop-challenge.field.help-label': 'Ayuda: {field}',
  'account.prop-challenge.payout-rules.help.cycle':
    'Mide la espera por días con entradas de operaciones, días que cumplen el beneficio neto mínimo o días naturales transcurridos. Sin ciclo solo desactiva este requisito de días.',
  'account.prop-challenge.payout-rules.help.days':
    'Días exigidos por el ciclo elegido: días de entrada, días con beneficio neto suficiente o períodos completos de 24 horas.',
  'account.prop-challenge.payout-rules.help.daily-profit':
    'Beneficio realizado neto mínimo por día, después de costes. Se suman las operaciones según el cierre de tu día de trading. El umbral debe ser mayor que cero.',
  'account.prop-challenge.payout-rules.help.qualifying-days':
    'Añade días con beneficio mínimo al ciclo de espera. Ambos requisitos deben cumplirse en el ciclo de pago actual.',
  'account.prop-challenge.payout-rules.help.profitable-days':
    'Número de días distintos cuyo beneficio realizado neto alcanza el mínimo diario en el ciclo de pago actual.',
  'account.prop-challenge.payout-rules.help.anchor':
    'La espera natural comienza al inicio del ciclo o con su primera entrada. Si se reinicia el ciclo, un retiro registrado inicia el siguiente.',
  'account.prop-challenge.payout-rules.help.elapsed-hours':
    'Horas desde la primera entrada del ciclo actual. Sin una operación, el reloj no empieza. Vacío desactiva este requisito.',
  'account.prop-challenge.payout-rules.help.request-window':
    'Permite solicitudes cualquier día o solo los días elegidos en la zona horaria indicada. Los demás requisitos siguen aplicándose.',
  'account.prop-challenge.payout-rules.help.time-zone':
    'Zona horaria para determinar los días permitidos, por ejemplo America/New_York. No cambia el cierre del día de trading.',
  'account.prop-challenge.payout-rules.help.request-days':
    'Días de la semana permitidos en la zona horaria elegida. Debes seleccionar al menos uno.',
  'account.prop-challenge.payout-rules.help.minimum-balance':
    'Saldo exigido antes del pago; no es el suelo usado para calcular beneficios disponibles. Vacío desactiva este requisito.',
  'account.prop-challenge.payout-rules.help.cycle-profit':
    'Beneficio realizado neto de trading exigido en el ciclo actual. No cuentan depósitos ni ajustes de saldo. Vacío desactiva este requisito.',
  'account.prop-challenge.payout-rules.help.profit-schedule':
    'Beneficios mínimos separados por comas para el primer pago, el segundo y los siguientes. Sustituye el mínimo único por ciclo.',
  'account.prop-challenge.payout-rules.help.repeat-final':
    'Reutiliza el último valor para pagos posteriores a los números incluidos en la lista.',
  'account.prop-challenge.payout-rules.help.positive-cycle':
    'Después del primer pago registrado, exige beneficio realizado neto del ciclo estrictamente superior a cero.',
  'account.prop-challenge.payout-rules.help.consistency':
    'Mayor beneficio diario dividido por el beneficio realizado neto del ciclo. Los días negativos reducen el total y pueden aumentar el porcentaje. Vacío desactiva el límite.',
  'account.prop-challenge.payout-rules.help.consistency-schedule':
    'Límites porcentuales del mejor día separados por comas para cada número de pago. Sustituye el límite único de consistencia.',
  'account.prop-challenge.payout-rules.help.availability':
    'Calcula el beneficio solicitable por encima del saldo inicial de la fase o del suelo elegido. Siguen aplicándose porcentajes y otros límites.',
  'account.prop-challenge.payout-rules.help.balance-floor':
    'Saldo excluido del beneficio disponible. El porcentaje retirable se aplica solo al excedente; no modifica la regla de drawdown.',
  'account.prop-challenge.payout-rules.help.request-percent':
    'Porcentaje solicitable del saldo que excede el suelo elegido. Los límites de solicitud y beneficio nuevo pueden reducirlo.',
  'account.prop-challenge.payout-rules.help.minimum-request':
    'Solicitud mínima permitida. El importe disponible calculado también debe alcanzar este mínimo.',
  'account.prop-challenge.payout-rules.help.maximum':
    'Elige un límite fijo, solo para el primer pago, por número de pago o como porcentaje del beneficio del ciclo. Sin máximo elimina solo este límite.',
  'account.prop-challenge.payout-rules.help.maximum-amount':
    'Solicitud bruta máxima antes del reparto. El beneficio disponible y otros límites pueden reducirla.',
  'account.prop-challenge.payout-rules.help.first-maximum':
    'Límite bruto solo para el primer pago de esta fase. Después desaparece este límite, pero siguen aplicándose los demás.',
  'account.prop-challenge.payout-rules.help.maximum-schedule':
    'Límites brutos separados por comas para cada pago. Sin repetir el último valor, los pagos posteriores no incluidos tienen un límite de cero.',
  'account.prop-challenge.payout-rules.help.maximum-percent':
    'Limita la solicitud bruta a este porcentaje del beneficio realizado neto del ciclo. Es distinto del porcentaje retirable del saldo.',
  'account.prop-challenge.payout-rules.help.lifetime-days':
    'Total de días válidos en la fase financiada para activar nuevos límites de disponibilidad y solicitud. Los reinicios de pago no borran este total.',
  'account.prop-challenge.payout-rules.help.split-model':
    'Usa un reparto fijo, cambia tasas según pagos brutos acumulados o el beneficio total de la cuenta. El reparto determina lo que recibes, no el límite de solicitud.',
  'account.prop-challenge.payout-rules.help.trader-share':
    'Porcentaje de la solicitud bruta pagado al trader con esta tasa. El resto corresponde a la firma.',
  'account.prop-challenge.payout-rules.help.cumulative-threshold':
    'Pagos brutos registrados en esta fase a partir de los cuales rige la tasa posterior. Una solicitud que cruza el umbral reparte sus partes con ambas tasas.',
  'account.prop-challenge.payout-rules.help.maximum-payouts':
    'Número de pagos registrados permitidos en esta fase. Al alcanzarlo se bloquean los siguientes. Vacío elimina este límite.',
  'account.prop-challenge.payout-rules.help.maximum-outcome':
    'Al llegar al último pago: continuar, concluir la cuenta, avanzar de fase o ser elegible para revisión en vivo. La elegibilidad no implica aprobación automática.',
  'account.prop-challenge.payout-rules.help.aftermath':
    'Tratamiento del saldo y drawdown tras un pago registrado: deducir la solicitud, deducir y fijar el suelo, o restablecer saldo inicial y drawdown.',
  'account.prop-challenge.payout-rules.help.drawdown-floor':
    'Suelo de drawdown fijado después del pago cuando se elige ese tratamiento. El saldo restante debe mantenerse por encima de ese suelo.',
  'account.prop-challenge.payout-rules.help.first-exempt':
    'En el primer pago de esta fase, el beneficio mínimo del ciclo se considera cero: el beneficio realizado neto del ciclo no puede ser negativo. Los demás requisitos siguen vigentes.',
  'account.prop-challenge.payout-rules.help.reset-cycle':
    'Reinicia días, beneficio diario, beneficio del ciclo y consistencia después de un pago registrado. Conserva días válidos de toda la fase; una vista previa no reinicia nada.',
  
  
  
  'actions.value.cleared': 'sin valor',
  'actions.trade.set.account_id': 'Cuenta: {value}',
  'actions.trade.set.setup_id': 'Setup: {value}',
  'actions.trade.set.stop_loss': 'Stop loss: {value}',
  'actions.trade.thesis.set': 'Actualizar tesis',
  'actions.trade.thesis.clear': 'Eliminar tesis',
  'actions.trade.reviewed.mark': 'Marcar como revisado',
  'actions.trade.reviewed.unmark': 'Marcar como no revisado',
  'actions.trade.notes.set': 'Reemplazar notas',
  'actions.trade.stop-losses': 'Stop loss: {value}',
  'actions.trade.stop-losses.clear': 'Eliminar stop loss',
  'actions.trade.take-profits': 'Take profits: {value}',
  'actions.trade.take-profits.clear': 'Eliminar take profits',
  'actions.trade.set.take_profit': 'Take profit: {value}',
  'actions.trade.set.risk_amount': 'Riesgo: {value}',
  'actions.trade.add-tags': 'Añadir etiquetas: {labels}',
  'actions.trade.remove-tags': 'Quitar etiquetas: {labels}',
  'actions.trade.add-mistakes': 'Añadir errores: {labels}',
  'actions.trade.remove-mistakes': 'Quitar errores: {labels}',
  'actions.review.summary': 'Reemplazar el resumen',
  'actions.review.target.day': 'Revisión diaria {date}',
  'actions.review.target.week': 'Revisión semanal {date}',
  'actions.review.target.month': 'Revisión mensual {date}',
  'actions.review.target.quarter': 'Revisión trimestral {date}',
  'actions.review.target.year': 'Revisión anual {date}',
  'agent-requests.deny': 'Rechazar',
  'agent-requests.approve': 'Aprobar',
  'actions.options.catalog.tags': 'Etiquetas',
  'actions.options.catalog.mistakes': 'Errores',
  'actions.options.catalog.account_types': 'Tipos de cuenta',
  'actions.options.catalog.events': 'Eventos',
  'actions.options.create': 'Crear: {labels}',
  'actions.options.set-color': 'Cambiar el color de {value}',
  'actions.options.clear-color': 'Quitar el color de {value}',
  'actions.options.update-style': 'Actualizar el estilo de {value}',
  'actions.options.rename.one': 'Renombrar {source} a {target} en {count} nota',
  'actions.options.rename.other':
    'Renombrar {source} a {target} en {count} notas',
  'actions.options.rename-account-type.one':
    'Renombrar {source} a {target} en {count} cuenta',
  'actions.options.rename-account-type.other':
    'Renombrar {source} a {target} en {count} cuentas',
  'actions.options.merge.one': 'Fusionar {source} en {target} en {count} nota',
  'actions.options.merge.other':
    'Fusionar {source} en {target} en {count} notas',
  'actions.options.delete.one': 'Eliminar {value} de {count} nota',
  'actions.options.delete.other': 'Eliminar {value} de {count} notas',
  'actions.options.delete-entry': 'Eliminar {value}',
  'actions.options.move': 'Mover {value} antes de {before}',
  'actions.options.move-last': 'Mover {value} al final',
  'actions.configuration.target.settings': 'Ajustes',
  'actions.configuration.target.dashboard_layouts': 'Diseños del panel',
  'actions.configuration.target.home_layouts': 'Diseños de inicio',
  'actions.configuration.target.review_templates': 'Plantillas de revisión',
  'actions.configuration.target.session_workflows': 'Flujos de sesión',
  'actions.configuration.settings': 'Cambiar {count} ajustes',
  'actions.configuration.create': 'Crear {name}',
  'actions.configuration.duplicate': 'Crear {name} como copia',
  'actions.configuration.replace': 'Reemplazar {name}',
  'actions.configuration.rename': 'Renombrar a {name}',
  'actions.configuration.delete': 'Eliminar {name}',
  'actions.configuration.delete-question.one':
    'Eliminar «{name}» y su {count} ubicación {workflows}',
  'actions.configuration.delete-question.other':
    'Eliminar «{name}» y sus {count} ubicaciones {workflows}',
  'actions.configuration.delete-question-workflows.one': 'en {count} flujo',
  'actions.configuration.delete-question-workflows.other': 'en {count} flujos',
  'actions.configuration.delete-question-unused':
    'Eliminar «{name}» (no se usa en ningún flujo)',
  'actions.configuration.set-active': 'Hacer de {name} el diseño activo',
  'actions.configuration.set-default':
    'Cambiar la plantilla {type} predeterminada',
  'actions.configuration.reset-default':
    'Usar la plantilla {type} integrada de forma predeterminada',
  'actions.setup.target': 'Setup {name}',
  'actions.setup.update': 'Actualizar: {fields}',
  'actions.setup.field.status': 'estado',
  'actions.setup.field.direction': 'dirección',
  'actions.setup.field.color': 'color',
  'actions.setup.field.tags': 'etiquetas',
  'actions.setup.field.preferred_sessions': 'sesiones preferidas',
  'actions.setup.field.preferred_timeframes': 'marcos temporales preferidos',
  'actions.setup.field.preferred_tickers': 'tickers preferidos',
  'actions.setup.field.playbook': 'playbook',
  'actions.setup.field.rules': 'reglas',
  'actions.setup.field.linked_notes': 'notas vinculadas',
  'actions.trade.set.direction': 'Dirección: {value}',
  'actions.trade.set.direct_pnl': 'P&L directo: {value}',
  'actions.trade.set.commission': 'Comisión: {value}',
  'actions.trade.set.fees': 'Tarifas: {value}',
  'actions.trade.set.swap': 'Swap: {value}',
  'actions.trade.executions': 'Reemplazar ejecuciones: {entries}, {exits}',
  'actions.trade.set.missed_reason': 'Motivo de la operación perdida: {value}',
  'actions.trade.create':
    'Crear {type}: {direction} {instrument}, {entries}, {exits}',
  'actions.trade.create.new-instrument':
    'Añadir {instrument} a los instrumentos',
  'actions.trade.set-type': 'Cambiar tipo: de {source} a {target}',
  'actions.trade.delete': 'Mover la nota de la operación a la papelera',
  'actions.trade.custom-fields': 'Campos personalizados: {labels}',
  'actions.custom-field.create': 'Crear campo {label} ({type})',
  'actions.custom-field.field.label': 'nombre',
  'actions.custom-field.field.options': 'opciones',
  'actions.custom-field.field.validation': 'validación',
  'actions.custom-field.field.placeholder': 'texto de ejemplo',
  'actions.custom-field.field.helper_text': 'texto de ayuda',
  'actions.custom-field.field.allow_create_options':
    'opciones nuevas desde operaciones',
  'actions.custom-field.order-target': 'Campos personalizados',
  'actions.custom-field.reorder': 'Nuevo orden: {labels}',
  'actions.session-log-tag.create': 'Crear etiqueta {short} {label}',
  'actions.session-log-tag.field.label': 'nombre',
  'actions.session-log-tag.field.short_label': 'etiqueta corta',
  'actions.session-log-tag.field.color': 'color',
  'actions.session-log-tag.field.requires_resolution': 'requiere clasificación',
  'actions.session-log-tag.field.lesson': 'etiqueta de lección',
  'actions.session-log-tag.delete-alert-rule':
    'La regla de alerta del registro de sesión cuenta esta etiqueta',
  'actions.custom-field.delete.one':
    'Eliminar el campo; {count} operación conserva su valor',
  'actions.custom-field.delete.other':
    'Eliminar el campo; {count} operaciones conservan sus valores',
  'actions.session-log-tag.delete.one':
    'Quitar la etiqueta del editor; {count} día de registros de sesión la conserva',
  'actions.session-log-tag.delete.other':
    'Quitar la etiqueta del editor; {count} días de registros de sesión la conservan',
  'actions.review.answers.one': 'Responder {count} pregunta',
  'actions.review.answers.other': 'Responder {count} preguntas',
  'actions.review.goals.one': 'Establecer {count} objetivo',
  'actions.review.goals.other': 'Establecer {count} objetivos',
  'actions.review.checklist.one': 'Establecer {count} elemento de la lista',
  'actions.review.checklist.other': 'Establecer {count} elementos de la lista',
  'actions.review.key-levels':
    'Establecer niveles clave: {support} soporte, {resistance} resistencia',
  'actions.review.grade.mental': 'Nota mental: {value}',
  'actions.review.grade.technical': 'Nota técnica: {value}',
  'actions.review.reviewed': 'Marcar como revisada',
  'actions.review.not-reviewed': 'Marcar como no revisada',
  'actions.review.session-log.add.one':
    'Añadir {count} entrada al registro de sesión',
  'actions.review.session-log.add.other':
    'Añadir {count} entradas al registro de sesión',
  'actions.review.session-log.update':
    'Actualizar una entrada del registro de sesión: {fields}',
  'actions.review.session-log.field.time': 'hora',
  'actions.review.session-log.field.tag_id': 'etiqueta',
  'actions.review.session-log.field.text': 'texto',
  'actions.review.session-log.field.resolved': 'clasificación',
  'actions.review.session-log.delete':
    'Eliminar una entrada del registro de sesión',
  'actions.review.images.add.one': 'Añadir {count} imagen',
  'actions.review.images.add.other': 'Añadir {count} imágenes',
  'actions.review.images.remove.one': 'Quitar {count} imagen',
  'actions.review.images.remove.other': 'Quitar {count} imágenes',
  'actions.images.annotate.one': 'Cambiar etiquetas o notas de {count} imagen',
  'actions.images.annotate.other':
    'Cambiar etiquetas o notas de {count} imágenes',
  'actions.review.key-events.add.one': 'Añadir {count} evento clave',
  'actions.review.key-events.add.other': 'Añadir {count} eventos clave',
  'actions.review.key-events.update': 'Actualizar el evento clave {name}',
  'actions.review.key-events.delete': 'Eliminar el evento clave {name}',
  'actions.review.day-trade-fields.set.one':
    'Fijar campos del día y actualizar {count} operación',
  'actions.review.day-trade-fields.set.other':
    'Fijar campos del día y actualizar {count} operaciones',
  'actions.session.unplanned.start':
    'Iniciar una sesión no planificada: {reason}',
  'actions.session.unplanned.stop': 'Detener la sesión no planificada',
  'actions.account.create':
    'Crear una cuenta {type} en {currency} con un saldo inicial de {balance}',
  'actions.account.field.account_type': 'tipo',
  'actions.account.field.currency': 'divisa',
  'actions.account.field.created_date': 'fecha de inicio',
  'actions.account.field.initial_balance': 'saldo inicial',
  'actions.account.field.live_balance': 'saldo real',
  'actions.account.field.drawdown': 'drawdown',
  'actions.account.field.profit_target': 'objetivo de beneficio',
  'actions.account.field.monthly_cost': 'coste mensual',
  'actions.account.field.copy_trading': 'copy trading',
  'actions.account.rename': 'Cambiar el nombre a {name}',
  'actions.account.rename-trades.one':
    'Actualizar {count} operación que la usa',
  'actions.account.rename-trades.other':
    'Actualizar {count} operaciones que la usan',
  'actions.account.delete': 'Eliminar la cuenta',
  'actions.account.transaction.deposit':
    'Registrar un depósito de {amount} el {date}',
  'actions.account.transaction.withdrawal':
    'Registrar un retiro de {amount} el {date}',
  'actions.account.transaction.delete-deposit':
    'Eliminar el depósito de {amount} del {date}',
  'actions.account.transaction.delete-withdrawal':
    'Eliminar el retiro de {amount} del {date}',
  'actions.prop-challenge.advance': 'Aprobar {from} e iniciar {to}',
  'actions.prop-challenge.conclude':
    'Aprobar {phase} y cerrar el desafío como aprobado',
  'actions.prop-challenge.account-type': 'Cambiar la cuenta a {type}',
  'actions.prop-challenge.fail': 'Marcar {phase} y el desafío como fallidos',
  'actions.prop-challenge.reopen': 'Reabrir {phase}',
  'actions.prop-challenge.cost.purchase':
    'Registrar una compra de {amount} el {date}',
  'actions.prop-challenge.cost.reset':
    'Registrar un reinicio de {amount} el {date}',
  'actions.prop-challenge.cost.activation':
    'Registrar una activación de {amount} el {date}',
  'actions.prop-challenge.cost.other':
    'Registrar un coste de {amount} el {date}',
  'actions.prop-challenge.cost.delete':
    'Eliminar el coste de {amount} del {date}',
  'actions.prop-challenge.configure.create.one':
    'Configurar {name} con {count} fase',
  'actions.prop-challenge.configure.create.other':
    'Configurar {name} con {count} fases',
  'actions.prop-challenge.configure.update.one':
    'Actualizar {name}: {count} fase y sus reglas',
  'actions.prop-challenge.configure.update.other':
    'Actualizar {name}: {count} fases y sus reglas',
  'actions.prop-challenge.configure.remove-phase':
    'Quitar la fase pendiente {phase}',
  'agent-history.title': 'Cambios recientes de agentes',
  'agent-history.empty':
    'Aquí aparecen los cambios que hacen los agentes de IA en este dispositivo.',
  'agent-history.undo': 'Deshacer',
  'agent-history.undone': 'Deshecho',
  'agent-history.undone-notice': 'Se deshizo el cambio del agente.',
  'agent-history.undo-failed':
    'Parte de este cambio no se pudo deshacer porque se editó después.',
  'agent-history.undo-in-use':
    'Parte de este cambio no se pudo deshacer porque el elemento ahora se usa en tu diario.',
  'agent-history.partly-applied': 'Solo se aplicó parte de este cambio.',
  'agent-history.not-applied': 'Este cambio no se aplicó.',
  'agent-action.title.trade.create': 'Crear operación',
  'agent-action.title.trade.update': 'Actualizar operación',
  'agent-action.title.trade.set_type': 'Cambiar tipo de operación',
  'agent-action.title.trade.delete': 'Eliminar operación',
  'agent-action.title.review.create': 'Crear revisión',
  'agent-action.title.review.update': 'Actualizar revisión',
  'agent-action.title.review.add_session_log_entries':
    'Añadir entradas al registro de sesión',
  'agent-action.title.review.update_session_log_entry':
    'Actualizar entrada del registro de sesión',
  'agent-action.title.review.delete_session_log_entry':
    'Eliminar entrada del registro de sesión',
  'agent-action.title.review.add_images': 'Añadir imágenes a la revisión',
  'agent-action.title.review.set_image_annotations':
    'Definir etiquetas y notas de imágenes de la revisión',
  'agent-action.title.trade.set_image_annotations':
    'Definir etiquetas y notas de imágenes de la operación',
  'agent-action.title.review.add_key_events': 'Añadir eventos clave',
  'agent-action.title.review.update_key_event': 'Actualizar evento clave',
  'agent-action.title.review.delete_key_event': 'Eliminar evento clave',
  'agent-action.title.review.set_day_trade_fields':
    'Fijar campos de operaciones del día',
  'agent-action.title.session.start_unplanned': 'Iniciar sesión no planificada',
  'agent-action.title.session.stop_unplanned': 'Detener sesión no planificada',
  'agent-action.title.review.remove_images': 'Quitar imágenes de la revisión',
  'agent-action.title.tag.create': 'Crear etiquetas',
  'agent-action.title.tag.set_color': 'Definir color de etiqueta',
  'agent-action.title.tag.clear_color': 'Quitar color de etiqueta',
  'agent-action.title.tag.rename': 'Renombrar etiqueta',
  'agent-action.title.tag.merge': 'Fusionar etiquetas',
  'agent-action.title.tag.delete': 'Eliminar etiqueta',
  'agent-action.title.mistake.create': 'Crear errores',
  'agent-action.title.mistake.rename': 'Renombrar error',
  'agent-action.title.mistake.merge': 'Fusionar errores',
  'agent-action.title.mistake.delete': 'Eliminar error',
  'agent-action.title.account_type.create': 'Crear tipos de cuenta',
  'agent-action.title.account_type.rename': 'Renombrar tipo de cuenta',
  'agent-action.title.account_type.move': 'Mover tipo de cuenta',
  'agent-action.title.account_type.delete': 'Eliminar tipo de cuenta',
  'agent-action.title.event.create': 'Crear eventos',
  'agent-action.title.event.update_style': 'Actualizar estilo de evento',
  'agent-action.title.event.rename': 'Renombrar evento',
  'agent-action.title.event.merge': 'Fusionar eventos',
  'agent-action.title.event.delete': 'Eliminar evento',
  'agent-action.title.settings.set_analytics_calculation':
    'Definir cálculo de análisis',
  'agent-action.title.settings.set_date_time_display':
    'Definir formato de fecha y hora',
  'agent-action.title.settings.set_display_preferences':
    'Configurar preferencias de visualización',
  'agent-action.title.settings.set_trading_day': 'Configurar día de trading',
  'agent-action.title.settings.set_risk_display':
    'Configurar riesgo y visualización',
  'agent-action.title.settings.set_break_even':
    'Configurar umbral de punto de equilibrio',
  'agent-action.title.settings.set_trade_entry':
    'Configurar preferencias de registro de operaciones',
  'agent-action.title.settings.set_review_automation':
    'Configurar automatización de revisiones',
  'agent-action.title.settings.set_economic_calendar':
    'Configurar importación del calendario económico',
  'agent-action.title.settings.set_session_schedule':
    'Configurar horario de sesiones',
  'agent-action.title.dashboard_layout.create': 'Crear diseño del panel',
  'agent-action.title.dashboard_layout.duplicate': 'Duplicar diseño del panel',
  'agent-action.title.dashboard_layout.update': 'Reemplazar diseño del panel',
  'agent-action.title.dashboard_layout.rename': 'Renombrar diseño del panel',
  'agent-action.title.dashboard_layout.delete': 'Eliminar diseño del panel',
  'agent-action.title.dashboard_layout.set_active': 'Activar diseño del panel',
  'agent-action.title.home_layout.create': 'Crear diseño de inicio',
  'agent-action.title.home_layout.duplicate': 'Duplicar diseño de inicio',
  'agent-action.title.home_layout.update': 'Reemplazar diseño de inicio',
  'agent-action.title.home_layout.rename': 'Renombrar diseño de inicio',
  'agent-action.title.home_layout.delete': 'Eliminar diseño de inicio',
  'agent-action.title.home_layout.set_active': 'Activar diseño de inicio',
  'agent-action.title.review_template.create': 'Crear plantilla de revisión',
  'agent-action.title.review_template.duplicate':
    'Duplicar plantilla de revisión',
  'agent-action.title.review_template.update':
    'Reemplazar plantilla de revisión',
  'agent-action.title.review_template.delete': 'Eliminar plantilla de revisión',
  'agent-action.title.review_template.set_default':
    'Definir plantilla de revisión predeterminada',
  'agent-action.title.session_workflow.create': 'Crear flujo de sesión',
  'agent-action.title.session_workflow.update': 'Reemplazar flujo de sesión',
  'agent-action.title.session_workflow.delete': 'Eliminar flujo de sesión',
  'agent-action.title.session_workflow.delete_question':
    'Eliminar pregunta de sesión de la biblioteca',
  'agent-action.title.setup.create': 'Crear setup',
  'agent-action.title.setup.update': 'Actualizar setup',
  'agent-action.title.setup.rename': 'Renombrar setup',
  'agent-action.title.setup.delete': 'Eliminar setup',
  'agent-action.title.custom_field.create': 'Crear campo personalizado',
  'agent-action.title.custom_field.update': 'Actualizar campo personalizado',
  'agent-action.title.custom_field.delete': 'Eliminar campo personalizado',
  'agent-action.title.custom_field.reorder': 'Reordenar campos personalizados',
  'agent-action.title.session_log_tag.create':
    'Crear etiqueta del registro de sesión',
  'agent-action.title.session_log_tag.update':
    'Actualizar etiqueta del registro de sesión',
  'agent-action.title.session_log_tag.delete':
    'Eliminar etiqueta del registro de sesión',
  'agent-action.title.account.create': 'Crear cuenta',
  'agent-action.title.account.update': 'Actualizar cuenta',
  'agent-action.title.account.rename': 'Renombrar cuenta',
  'agent-action.title.account.delete': 'Eliminar cuenta',
  'agent-action.title.account.add_transaction': 'Registrar depósito o retiro',
  'agent-action.title.account.delete_transaction': 'Eliminar depósito o retiro',
  'agent-action.title.prop_challenge.advance': 'Avanzar fase del desafío',
  'agent-action.title.prop_challenge.fail': 'Marcar desafío como fallido',
  'agent-action.title.prop_challenge.reopen': 'Reabrir desafío',
  'agent-action.title.prop_challenge.add_cost': 'Registrar coste del desafío',
  'agent-action.title.prop_challenge.delete_cost': 'Eliminar coste del desafío',
  'agent-action.title.prop_challenge.configure': 'Configurar desafío',
  'agent-history.undo-confirm.title': '¿Deshacer el cambio del agente?',
  'agent-history.undo-confirm.message':
    'Journalit revierte este cambio. Lo que se haya editado después se mantiene.',
  'agent-approval.eyebrow': 'Solicitud de agente de IA',
  'agent-approval.position': '{index} de {total}',
  'agent-approval.previous': 'Solicitud anterior',
  'agent-approval.next': 'Siguiente solicitud',
  'agent-approval.hide': 'Ocultar por ahora',
  'agent-approval.details': 'Detalles',
  'agent-approval.hide-details': 'Ocultar detalles',
  'agent-approval.approved': 'Aprobado. Pide al agente que continúe.',
  'agent-approval.denied': 'Denegado. El agente no hará estos cambios.',
  'agent-approval.expired':
    'Esa solicitud caducó. Pide al agente que lo intente de nuevo.',
  'agent-activity.title': 'Actividad de agentes de IA',
  'agent-activity.waiting': 'Esperando tu respuesta',
  'command.open-agent-activity': 'Abrir actividad de agentes de IA',
  'settings.mcp-access.title': 'Apps de IA (MCP)',
  'settings.mcp-access.description':
    'Permite que las apps de IA que conectes a tu cuenta de Journalit, como Claude o ChatGPT, lean y actualicen esta bóveda mediante MCP.',
  'settings.mcp-access.loading': 'Cargando acceso MCP…',
  'settings.mcp-access.unavailable':
    'El acceso MCP no está disponible ahora. Vuelve a abrir los ajustes para intentarlo de nuevo.',
  'settings.mcp-access.toggle.label': 'Activar acceso MCP',
  'settings.mcp-access.toggle.description':
    'Pon esta bóveda a disposición de las apps de IA que apruebes en journalit.co.',
  'settings.mcp-access.status.label': 'Estado',
  'settings.mcp-access.status.off': 'Desactivado',
  'settings.mcp-access.status.off-detail':
    'Ninguna app de IA puede usar esta bóveda. Actívalo para que apps como Claude y ChatGPT la lean y actualicen; aquí verás cómo conectar una.',
  'settings.mcp-access.status.connecting': 'Conectando',
  'settings.mcp-access.status.connecting-detail':
    'Registrando esta bóveda en tu cuenta de Journalit.',
  'settings.mcp-access.status.connected': 'Conectado',
  'settings.mcp-access.status.connected-detail':
    'Las apps de IA que apruebes pueden usar esta bóveda.',
  'settings.mcp-access.status.failed': 'No conectado',
  'settings.mcp-access.status.lost-detail':
    'Journalit ya no reconoce la conexión de este vault, así que tus apps de IA no pueden usarlo. Vuelve a conectarlo para permitirles el acceso.',
  'settings.mcp-access.failed.account-unavailable':
    'Tu cuenta de Journalit no puede usar el acceso MCP ahora.',
  'settings.mcp-access.failed.vault-limit-reached':
    'Tu plan no tiene acceso MCP disponible para otra bóveda.',
  'settings.mcp-access.failed.vault-limit-move':
    'Las apps de IA están conectadas a otra bóveda, "{vault}" (último uso: {lastUsed}), y se alcanzó el límite de bóvedas de tu plan.',
  'settings.mcp-access.failed.vault-limit-move-never-used':
    'Las apps de IA están conectadas a otra bóveda, "{vault}" (nunca usada), y se alcanzó el límite de bóvedas de tu plan.',
  'settings.mcp-access.action.move-here': 'Mover el acceso de IA a esta bóveda',
  'settings.mcp-access.move.confirm-title':
    '¿Mover el acceso de IA a esta bóveda?',
  'settings.mcp-access.move.confirm-message':
    'Las apps de IA conectadas a "{vault}" dejarán de funcionar allí. Tendrás que volver a conectarlas a esta bóveda.',
  'settings.mcp-access.move.confirm': 'Mover acceso de IA',
  'settings.mcp-access.failed.temporarily-unavailable':
    'El acceso MCP no está disponible temporalmente. Inténtalo de nuevo en un momento.',
  'settings.mcp-access.failed.settings-unavailable':
    'No se pudo guardar tu ajuste de acceso MCP en esta bóveda. Inténtalo de nuevo.',
  'settings.mcp-access.activity.description':
    'Aprueba las solicitudes pendientes y revisa o deshaz los cambios recientes de los agentes.',
  'settings.mcp-access.activity.open': 'Abrir',
  'settings.mcp-access.action.retry': 'Reintentar',
  'settings.mcp-access.action.reconnect': 'Volver a conectar',
  'settings.mcp-access.failed.sign-in-required':
    'Inicia sesión en tu cuenta de Journalit y vuelve a intentarlo.',
  'settings.mcp-access.failed.vault-identity':
    'No se pudo identificar este vault. Reinicia Obsidian y vuelve a intentarlo.',
  'settings.mcp-access.failed.request-rejected':
    'No se pudo registrar esta bóveda. Comprueba tu cuenta e inténtalo de nuevo.',
  'settings.mcp-access.failed.unexpected-response':
    'Journalit envió una respuesta inesperada. Inténtalo de nuevo en un momento.',
  'settings.mcp-access.failed.rate-limited':
    'Demasiados intentos. Espera un momento antes de volver a intentarlo.',
  'settings.mcp-access.failed.connection':
    'No se pudo conectar con Journalit. Comprueba tu conexión y vuelve a intentarlo.',
  'settings.mcp-access.full-access.label': 'Acceso total',
  'settings.mcp-access.full-access.description':
    'Permite que los agentes de IA hagan cualquier cambio sin preguntar. Si está desactivado, las eliminaciones, fusiones y cambios grandes esperan tu aprobación.',
  'settings.mcp-access.full-access.warning':
    'Con acceso total, un agente puede eliminar y cambiar operaciones, cuentas, revisiones y ajustes, y reescribir muchas notas, sin tu aprobación. Actívalo solo para agentes de confianza.',
  'settings.mcp-access.usage.label': 'Uso mensual',
  'settings.mcp-access.usage.loading': 'Cargando el uso…',
  'settings.mcp-access.usage.unavailable':
    'El uso no está disponible ahora mismo.',
  'settings.mcp-access.usage.limited':
    '{consumed} de {limit} llamadas a herramientas de IA usadas este mes. Se restablece el {date}.',
  'settings.mcp-access.usage.unlimited':
    '{consumed} llamadas a herramientas de IA este mes. Se restablece el {date}.',
  'settings.mcp-access.usage.reached':
    'Has usado las {limit} llamadas a herramientas de IA de este mes. Se restablece el {date}.',
  'settings.mcp-access.usage.upgrade': 'Mejorar plan',
  'settings.mcp-access.usage.not-counted':
    'Las inspecciones, vistas previas, la navegación, la visualización de imágenes y las consultas a la documentación no cuentan.',
  'settings.mcp-access.usage.pro-offer':
    'Pasa a Pro para tener más llamadas a herramientas de IA',
  'settings.mcp-access.connect.title': 'Conectar una app de IA',
  'settings.mcp-access.connect.url-label': 'URL del servidor MCP',
  'settings.mcp-access.connect.copy': 'Copiar',
  'settings.mcp-access.connect.copied': 'Copiado',
  'settings.mcp-access.connect.copy-failed': 'No se pudo copiar',
  'settings.mcp-access.connect.copy-url': 'Copiar la URL del servidor MCP',
  'settings.mcp-access.connect.copy-command': 'Copiar el comando',
  'settings.mcp-access.connect.app-label': 'App de IA',
  'settings.mcp-access.connect.claude.open':
    'En Claude (web o escritorio), abre Customize → Connectors.',
  'settings.mcp-access.connect.claude.add':
    'Elige + Add → Add custom connector y pega la URL del servidor MCP.',
  'settings.mcp-access.connect.chatgpt.open':
    'En ChatGPT en la web, abre Plugins (chatgpt.com/plugins).',
  'settings.mcp-access.connect.chatgpt.add':
    'Elige + → Add custom MCP server, pega la URL del servidor MCP y elige OAuth.',
  'settings.mcp-access.connect.step.approve':
    'Inicia sesión en Journalit y aprueba el acceso.',
  'settings.mcp-access.connect.claude-code.run':
    'Ejecuta este comando en tu terminal:',
  'settings.mcp-access.connect.claude-code.sign-in':
    'En Claude Code, ejecuta /mcp e inicia sesión en Journalit.',
  'settings.mcp-access.connect.sign-in-note':
    'Tu app de IA abrirá journalit.co para que inicies sesión y elijas esta bóveda.',
  'settings.mcp-access.connect.manage': 'Gestionar apps conectadas',
  'actions.options.rename-none': 'Renombrar {source} a {target}',
  'actions.options.merge-none': 'Fusionar {source} en {target}',
  'actions.custom-field.delete-unused':
    'Eliminar el campo; ninguna operación tiene un valor en él',
  'actions.session-log-tag.delete-unused':
    'Quitar la etiqueta del editor; ningún registro de sesión la usa',
  'actions.trade.entries.one': '{count} entrada',
  'actions.trade.entries.other': '{count} entradas',
  'actions.trade.exits.one': '{count} salida',
  'actions.trade.exits.other': '{count} salidas',
  'agent-requests.changes.one': '{count} cambio',
  'agent-requests.changes.other': '{count} cambios',
  'agent-requests.kind-count': '{title} ×{count}',
};

export default es;
