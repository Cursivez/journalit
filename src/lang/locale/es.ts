
import type { Lang } from './en';

const es: Lang = {
  
  
  

  
  'command.add-trade': 'Añadir Nueva Operación',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': 'Abrir Trade Import',

  
  'command.create-drc': 'Abrir DRC (Reporte Diario)',
  'command.create-weekly-review': 'Abrir Revisión Semanal',
  'command.create-monthly-review': 'Abrir Revisión Mensual',
  'command.create-quarterly-review': 'Abrir Revisión Trimestral',
  'command.create-yearly-review': 'Abrir Revisión Anual',

  
  'command.open-dashboard': 'Abrir Panel de Trading',
  'command.open-account-dashboard': 'Abrir Panel de Cuenta',
  'command.open-trade-log': 'Abrir Registro de Operaciones',
  'command.open-home': 'Abrir Vista de Inicio',
  'command.open-position-size-calculator':
    'Abrir calculadora de tamaño de posición',

  
  'command.force-sync': 'Forzar Sincronización de Operaciones',
  'command.cancel-sync': 'Cancelar Sincronización',

  
  'command.replay-onboarding': 'Repetir Flujo de Incorporación',
  'command.replay-current-view-guide': 'Repetir guía de la vista actual',
  'command.open-release-notes': 'Ver notas de versión',
  'command.repair-trade-identities': 'Reparar identidades de operaciones',

  
  'command.open-layout-builder': 'Abrir Constructor de Diseño',
  'command.switch-template': 'Cambiar Plantilla',

  
  
  
  'auth.title.already-logged-in': 'Ya Iniciaste Sesión',
  'auth.desc.already-logged-in': 'Ya has iniciado sesión{email}.',
  'auth.title.sign-in': 'Iniciar Sesión en Journalit',
  'auth.desc.email':
    'Introduce tu dirección de correo electrónico para recibir un código de verificación y acceder a la beta privada.',
  'auth.label.email': 'Dirección de Correo Electrónico',
  'auth.placeholder.email': 'tu.correo@ejemplo.com',
  'auth.button.send-code': 'Enviar Código de Verificación',
  'auth.button.sending': 'Enviando...',
  'auth.desc.code':
    'Hemos enviado un código de verificación de 6 dígitos a {email}. Por favor, ingrésalo a continuación para completar tu inicio de sesión.',
  'auth.label.code': 'Código de Verificación',
  'auth.placeholder.code': '123456',
  'auth.button.verify': 'Verificar e Iniciar Sesión',
  'auth.button.verifying': 'Verificando...',
  'auth.button.resend': 'Reenviar Código',
  'auth.footer.trouble':
    '¿Tienes problemas? El código de verificación expira en 15 minutos.',
  'auth.footer.resend-wait':
    ' Puedes solicitar un nuevo código en {seconds} segundos.',
  'auth.footer.resend-now':
    ' Ahora puedes reenviar el código usando el botón de arriba.',
  'auth.footer.enter-email':
    ' Ingresa tu correo electrónico para recibir un código de verificación.',
  'auth.error.invalid-email':
    'Por favor ingresa una dirección de correo válida',
  'auth.error.enter-code': 'Por favor ingresa el código de verificación',
  'auth.error.code-digits': 'El código de verificación debe tener 6 dígitos',
  'auth.error.too-many-requests':
    'Has solicitado demasiados códigos. Por favor espera 30 minutos e intenta de nuevo.',
  'auth.error.send-failed': 'Error al enviar el código de verificación',
  'auth.error.verify-failed': 'Error al verificar el código',
  'auth.error.resend-failed': 'Error al reenviar el código de verificación',
  'auth.error.invalid-code': 'Código de verificación inválido',
  'auth.status.disconnected': 'Sesión Cerrada',
  'auth.error.token-expired':
    'Tu sesión ha expirado. Por favor inicia sesión de nuevo para continuar usando características Pro.',
  'auth.error.failed': 'No se pudo autenticar. Por favor intenta de nuevo.',
  'auth.error.failed-reason': 'No se pudo autenticar: {reason}',
  'auth.error.token-invalid': 'El token ya no es válido',
  'auth.error.server-validation-failed': 'La validación del servidor falló',
  'auth.error.invalid-user-data': 'Datos de usuario inválidos recibidos',
  'auth.error.needs-auth':
    'Inicia sesión para acceder a características Pro. Las características básicas aún están disponibles.',
  'auth.error.needs-premium': 'Característica Pro',
  'auth.error.needs-premium-desc':
    'Esta es una característica Pro. Visita nuestro sitio web para suscribirse y desbloquearla.',
  'auth.error.network-error': 'Error de Conexión',
  'auth.error.network-error-verify':
    'No se pudo verificar el acceso Pro. Verifica tu conexión o continúa con características básicas.',
  'auth.error.network-error-basic':
    'Operando sin conexión. Las características básicas aún están disponibles.',
  'auth.error.offline-expired':
    'El período de gracia sin conexión ha expirado. Por favor reconéctate para continuar usando características Pro.',
  'auth.expiry-warning-tomorrow':
    'Tu sesión expira mañana. Por favor inicia sesión pronto para continuar usando características Pro.',
  'auth.expiry-warning-days':
    'Tu sesión expira en {days} días. Por favor inicia sesión de nuevo para continuar usando características Pro.',
  'auth.offline.active':
    'Operando en modo sin conexión. Algunas características Pro pueden estar limitadas.',
  'auth.offline.grace-remaining':
    'Período de gracia sin conexión: {days} días restantes',

  
  
  
  'form.section.trade-details': 'Detalles de la Operación',
  'form.section.trading-costs': 'Costos de Trading',
  'form.section.risk-management': 'Gestión de Riesgo',
  'form.section.analysis-thesis': 'Análisis y Tesis',

  
  
  
  'form.tab.basic': 'Básico',
  'form.tab.details': 'Detalles',
  'form.tab.advanced': 'Avanzado',

  
  
  
  'form.field.account': 'Cuenta',
  'form.field.asset-type': 'Tipo de Activo',
  'form.field.direction': 'Dirección',
  'form.field.direction.long': 'Largo',
  'form.field.direction.short': 'Corto',
  'form.field.commission': 'Comisión',
  'form.field.commission-type': 'Tipo',
  'form.field.rebate': 'Reembolso',
  'form.field.swap': 'Swap',
  'form.field.swap-tooltip.forex':
    'Diferencial de tasas de interés entre divisas al mantener posiciones durante la noche',
  'form.field.swap-tooltip.cfd':
    'Costo de financiamiento nocturno para posiciones apalancadas de CFD',
  'form.field.swap-tooltip.default':
    'Costo de financiamiento nocturno cargado/acreditado por mantener posiciones',
  'form.field.other-fees': 'Otros Cargos',
  'form.field.stop-loss': 'Stop Loss',
  'form.field.risk-amount': 'Monto en Riesgo',
  'form.field.profit-loss': 'Ganancia/Pérdida',
  'form.field.total-pnl': 'P&L Total',
  'form.field.realized-pnl': 'P&L Realizado',
  'form.field.total-costs': 'Costos Totales:',
  'form.field.setup': 'Configuración',
  'form.field.mistake': 'Error',
  'form.field.custom-tags': 'Etiquetas Personalizadas',
  'form.field.trade-thesis': 'Tesis de la Operación',
  'form.field.time': 'Hora',
  'form.field.price': 'Precio',
  'form.field.size': 'Tamaño',
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
  'form.placeholder.risk-amount': 'Riesgo planificado en moneda',
  'form.placeholder.custom-tag': 'Escribe una etiqueta y presiona Enter',
  'form.placeholder.thesis': 'Ingresa tu tesis para esta operación...',
  'form.placeholder.pnl': 'Ingresa ganancia o pérdida total',
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
  'form.section.custom-fields-desc':
    'Campos personalizados definidos en la configuración del plugin. Estos campos se guardarán en el frontmatter de tu operación.',
  'form.section.custom-fields-empty':
    'No hay campos personalizados definidos. Crea campos personalizados en la configuración del plugin en Personalización.',
  'form.section.custom-fields-empty-title': 'Aún no hay campos avanzados.',
  'form.section.custom-fields-empty-desc':
    'Crea campos personalizados de operación en Configuración → Personalización → Campos personalizados de operación.',
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
  'form.field.mae-dollar-placeholder': 'Pérdida máxima en dólares',
  'form.field.mfe-dollar-placeholder': 'Ganancia máxima en dólares',
  'form.field.mae-placeholder-currency': 'Max drawdown in {currency}',
  'form.field.mfe-placeholder-currency': 'Max profit in {currency}',
  'form.calculated': 'Calculado',

  
  'form.field.image-url-placeholder':
    'Pegar URL de imagen o ruta de archivo...',
  'form.field.image-duplicate-error': 'Esta imagen ya está agregada.',
  'form.field.trade-image-alt': 'Imagen de Operación',

  
  'form.account-empty-state.title':
    'Crea una cuenta antes de añadir una operación',
  'form.account-empty-state.create-account': 'Crear Cuenta',
  'form.account-empty-state.submit-disabled':
    'Crea una cuenta primero para guardar esta operación.',
  'form.error.image-upload-unavailable': 'Carga de imagen no disponible',

  
  
  
  'button.save': 'Guardar',
  'button.cancel': 'Cancelar',
  'button.done': 'Listo',
  'button.edit': 'Editar',
  'button.delete': 'Eliminar',
  'button.update': 'Actualizar',
  'button.add': 'Añadir',
  'button.create': 'Crear',
  'button.reset': 'Restablecer',
  'button.reset-to-defaults': 'Restablecer a Predeterminados',
  'button.close': 'Cerrar',
  'button.confirm': 'Confirmar',
  'button.submit': 'Enviar',
  'button.back': 'Atrás',

  'button.add-trade': 'Añadir Operación',
  'button.update-trade': 'Actualizar Operación',
  'button.save-changes': 'Guardar Cambios',
  'button.create-trade': 'Crear Operación',
  'button.delete-all': 'Eliminar Todo',
  'button.clear-all': 'Limpiar Todo',
  'button.save-name-only': 'Guardar Solo Nombre',
  'button.cancel-action': 'Cancelar Acción',
  'button.cancel-reset': 'Cancelar Restablecimiento',
  'button.proceed-anyway': 'Continuar de Todos Modos',
  'button.mark-reviewed': 'Marcar como Revisado',
  'button.maybe-later': 'Quizás Después',
  'button.upgrade-now': 'Actualizar Ahora',
  'button.add-first-goal': 'Añadir Tu Primer Objetivo',
  'button.add-first-event': 'Añadir Tu Primer Evento',
  'button.create-daily-review': 'Crear Revisión Diaria',
  'button.apply': 'Aplicar',
  'button.apply-settings': 'Aplicar Configuración',
  'button.learn-more': 'Más información',
  'button.upload-image': 'Subir Imagen',
  'button.discord': 'Discord',
  'button.remove': 'Eliminar',
  'button.add-item': 'Añadir Elemento',
  'button.move-up': 'Mover arriba',
  'button.move-down': 'Mover abajo',
  'button.remove-section': 'Eliminar Sección',
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
  'validation.map-required-fields':
    'Por favor mapea todos los campos requeridos antes de importar',
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
    'El tamaño del lote no puede ser negativo.',
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
  'trade.validation.stop-loss-number': 'El stop loss debe ser un número.',
  'trade.validation.stop-loss-valid-number':
    'El stop loss debe ser un número válido.',
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

  
  
  
  'notice.verification-sent':
    '¡Código de verificación enviado! Revisa tu correo.',
  'notice.login-success': '¡Inicio de sesión exitoso!',
  'notice.new-verification-sent':
    '¡Nuevo código de verificación enviado! Revisa tu correo.',
  'notice.logout-success': 'Sesión cerrada exitosamente',
  'notice.hotkey-set': 'Hotkey set: {hotkey}',
  'notice.ftp-created': 'Credenciales FTP creadas exitosamente',
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
  'notice.reset-timeframes':
    'Marcos temporales restablecidos a valores predeterminados',
  'notice.custom-fields-imported':
    'Se importaron exitosamente {count} campos personalizados',
  'notice.csv-parsed': 'CSV/XLSX/XLS procesado exitosamente: {count} filas',
  'notice.setups-added': 'Configuraciones añadidas a {count} operaciones',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': 'Errores añadidos a {count} operaciones',
  'notice.trades-deleted.one': 'Se eliminó {count} operación',
  'notice.trades-deleted.few': 'Se eliminaron {count} operaciones',
  'notice.trades-deleted.many': 'Se eliminaron {count} operaciones',
  'notice.trades-deleted.other': 'Se eliminaron {count} operaciones',

  
  
  
  'notice.error.open-journalit':
    'Error al abrir Journalit. Por favor intenta recargar Obsidian.',
  'notice.error.open-drc': 'Error al abrir DRC: {error}',
  'notice.error.open-dashboard': 'Failed to open dashboard: {error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': 'Error al abrir Revisión Semanal: {error}',
  'notice.error.open-monthly-review':
    'Error al abrir Revisión Mensual: {error}',
  'notice.error.open-quarterly-review':
    'Error al abrir Revisión Trimestral: {error}',
  'notice.error.open-yearly-review': 'Error al abrir Revisión Anual: {error}',
  'notice.error.sync-trades': 'Error al sincronizar operaciones: {error}',
  'notice.error.open-release-notes': 'Error al abrir notas de versión: {error}',
  'notice.trade-identity-repair-complete':
    'Reparación de identidades completada: analizadas {scanned}, completadas {backfilled}, duplicados reparados {duplicates}.',
  'notice.error.repair-trade-identities':
    'Error al reparar identidades de operaciones: {error}',
  'notice.guide.replay-unavailable':
    'El sistema de guías aún no está listo. Inténtalo de nuevo.',
  'notice.guide.no-active-view':
    'Abre primero una vista compatible de Journalit y vuelve a ejecutar este comando.',
  'notice.guide.no-guide-for-view':
    'Todavía no hay una guía registrada para esta vista ({viewType}).',
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
  'notice.error.invalid-drc-date': 'Fecha de DRC inválida',
  'notice.error.invalid-drc-missed':
    'Fecha de DRC inválida. No se puede crear operación perdida.',
  'notice.error.trade-not-found': 'Archivo de operación no encontrado: {path}',
  'notice.error.mark-reviewed':
    'Error al marcar operaciones como revisadas: {error}',
  'notice.error.add-setups': 'Error al añadir configuraciones: {error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': 'Error al añadir errores: {error}',
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

  
  
  
  'notice.info.no-sync': 'No hay sincronización en progreso',

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
  'notice.csv-validation-failed': 'Validación de CSV/XLSX/XLS falló: {errors}',
  'notice.csv-parse-failed': 'Error al procesar archivo CSV/XLSX/XLS: {error}',
  'notice.csv-complete-fields':
    'Por favor completa todos los campos requeridos',
  'notice.csv-invalid-selection': 'Selección de broker/plantilla inválida',
  'notice.csv-import-success':
    '¡Se importaron exitosamente {count} operaciones!',
  'notice.csv-import-partial':
    'Se importaron {count} operaciones, se omitieron {duplicates} duplicadas',
  'notice.csv-import-failed': 'Importación fallida: {error}',
  'notice.csv-import-report-copy-failed':
    'No se pudo copiar el informe de importación',
  'notice.csv-template-saved':
    'Plantilla guardada. Ahora puedes seleccionar "{name}" para futuras importaciones.',
  'notice.csv-template-updated': 'Plantilla "{name}" actualizada exitosamente',
  'notice.csv-template-update-failed': 'Error al actualizar plantilla: {error}',
  'notice.csv-template-save-failed': 'Error al guardar plantilla: {error}',
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
  'notice.error.template-name-required':
    'Por favor ingresa un nombre de plantilla',
  'notice.error.template-name-exists': 'El nombre de la plantilla ya existe',
  'notice.error.open-account-dashboard':
    'Error al abrir panel de cuenta: {error}',
  'notice.error.open-trade-form-edit':
    'Error al abrir formulario de operación en modo edición: {error}',
  'notice.error.open-onboarding':
    'Error al abrir flujo de incorporación. Revisa la consola para más detalles.',
  'notice.error.open-update-notification':
    'Error al abrir notificación de actualización: {error}',
  'notice.error.switch-template-generic': 'Error al cambiar layout',
  'notice.error.plugin-not-available': 'Plugin no disponible',
  'notice.error.open-template-picker': 'Error al abrir selector de layout',

  'notice.error.invalid-weekly-review-date':
    'Fecha de revisión semanal inválida. No se puede guardar imagen de pronóstico.',
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
  'tradelog.empty': 'No se encontraron operaciones',
  'tradelog.empty.submessage':
    'Comienza a crear notas de operación para que aparezcan en tu registro de operaciones.',
  'tradelog.processing': 'Procesando datos de operaciones...',
  'tradelog.node.file-not-found': 'Archivo de operación no encontrado: {path}',
  'tradelog.node.no-review-available':
    'Sin revisión disponible para {type}: {id}',
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
  'tradelog.filter.all.desc': 'Todos los estados de operación',
  'tradelog.filter.winners': 'Ganadoras',
  'tradelog.filter.winners.desc': 'Operaciones ganadoras',
  'tradelog.filter.losers': 'Perdedoras',
  'tradelog.filter.losers.desc': 'Operaciones perdedoras',
  'tradelog.filter.breakeven': 'Sin cambio',
  'tradelog.filter.breakeven.desc': 'Operaciones sin cambio',
  'tradelog.filter.open': 'Abiertas',
  'tradelog.filter.open.desc': 'Posiciones actualmente abiertas',
  'tradelog.filter.closed': 'Cerradas',
  'tradelog.filter.closed.desc':
    'Todas las posiciones cerradas (ganancia/pérdida/sin cambio)',

  'tradelog.type.all': 'Todos los Tipos',
  'tradelog.type.all.desc': 'Todos los tipos de operación',
  'tradelog.type.regular': 'Regular',
  'tradelog.type.regular.desc': 'Operaciones estándar',
  'tradelog.type.missed': 'Perdida',
  'tradelog.type.missed.desc': 'Oportunidades perdidas',
  'tradelog.type.backtest': 'Backtesting',
  'tradelog.type.backtest.desc': 'Operaciones simuladas',

  
  'tradelog.status.win': 'GANANCIA',
  'tradelog.status.loss': 'PÉRDIDA',
  'tradelog.status.open': 'ABIERTA',
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
  'tradelog.copy-trade.adjustment-prompt':
    'Enter the manual PnL adjustment for this copied trade. Use a negative number for worse fills/costs.',
  'tradelog.copy-trade.adjustment-invalid': 'Enter a valid PnL adjustment.',
  'tradelog.copy-trade.adjustment-saved': 'Copied trade PnL adjustment saved.',
  'tradelog.tooltip.still-open': 'aún abierta',
  'tradelog.tooltip.performance-trade': 'operación con {indicator} desempeño',
  'tradelog.tooltip.performance-trade-on':
    'operación con {indicator} desempeño el {date}',
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
  'tradelog.batch.mark-reviewed.title':
    'Marcar operaciones seleccionadas como revisadas',
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
  'tradelog.batch.add-setups.title':
    'Añadir configuraciones a operaciones seleccionadas',
  'tradelog.batch.add-setups.label': 'Añadir Configuraciones',
  'tradelog.batch.add-tags.aria': 'Add tags',
  'tradelog.batch.add-tags.title': 'Add tags to selected trades',
  'tradelog.batch.add-tags.label': 'Add Tags',
  'tradelog.batch.add-mistakes.aria': 'Añadir errores',
  'tradelog.batch.add-mistakes.title':
    'Añadir errores a operaciones seleccionadas',
  'tradelog.batch.add-mistakes.label': 'Añadir Errores',
  'tradelog.batch.adding': 'Añadiendo...',
  'tradelog.batch.add-count': 'Añadir ({count})',
  'tradelog.batch.delete.aria': 'Eliminar operaciones',
  'tradelog.batch.delete.title': 'Eliminar operaciones seleccionadas',
  'tradelog.batch.deleting': 'Eliminando...',
  'tradelog.batch.clear.aria': 'Limpiar selección',
  'tradelog.batch.clear.title': 'Limpiar selección',
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
  'tradelog.column.mae': 'MAE $',
  'tradelog.column.mfe': 'MFE $',
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
    'Añade algunas operaciones para que tu panel cobre vida',
  'dashboard.empty.filter-hint': 'Intenta ajustar la configuración de filtros',
  'dashboard.error.load-failed': 'Error al cargar datos',
  'dashboard.button.add-widget': 'Añadir Widget',
  'dashboard.button.save-layout': 'Guardar Diseño',
  'dashboard.button.edit-layout': 'Editar Diseño',

  
  'dashboard.metrics.netPnL': 'P&L Neto',
  'dashboard.metrics.winRate': 'Tasa de Acierto',
  'dashboard.metrics.profitFactor': 'Factor de Ganancia',
  'dashboard.metrics.expectancy': 'Expectativa',
  'dashboard.metrics.numTrades': 'Total de Operaciones',
  'dashboard.metrics.closedTrades': 'Operaciones Cerradas',
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
  'dashboard.conversion.rates': 'Tasas: BCE ({date})',
  'dashboard.conversion.using-ecb': 'Usando tasas BCE ({date})',
  'dashboard.conversion.using-broker-pnl':
    'Using broker-provided base-currency P&L for {count} {tradeLabel}',
  'dashboard.conversion.trade-singular': 'trade',
  'dashboard.conversion.trade-plural': 'trades',
  'dashboard.conversion.excluded-warning':
    '⚠ {converted} de {total} trades ({excluded} excluidos: {currencies})',
  'dashboard.conversion.original-pnl': 'P&L original',
  'dashboard.conversion.converted-pnl': 'P&L convertido',
  'dashboard.conversion.details-label': 'Detalles de conversión de divisas',
  'dashboard.conversion.requires-conversion':
    'Los gráficos de P&L con varias divisas requieren conversión de tipos de cambio.',

  'dashboard.top-section.add-metric': 'Añadir Métrica',
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
  'dashboard.filter.accounts.select-all-option': '-- Seleccionar todo --',
  'dashboard.filter.accounts.none-found': 'No se encontraron cuentas',

  
  'dashboard.filter.tags.all': 'Todas las Etiquetas',
  'dashboard.filter.tags.none': 'Sin Etiquetas',
  'dashboard.filter.tags.n-selected': '{count} Etiquetas',
  'dashboard.filter.tags.select-all': 'Seleccionar Todo',
  'dashboard.filter.tags.none-found': 'No se encontraron etiquetas',

  
  'dashboard.filter.mistakes.all': 'Todos los Errores',
  'dashboard.filter.mistakes.none': 'Sin Errores',
  'dashboard.filter.mistakes.n-selected': '{count} Errores',
  'dashboard.filter.mistakes.select-all': 'Seleccionar Todo',
  'dashboard.filter.mistakes.none-found': 'No se encontraron errores',

  
  'dashboard.filter.tickers.all': 'Todos los Símbolos',
  'dashboard.filter.tickers.n-selected': '{count} Símbolos',
  'dashboard.filter.tickers.select-all': 'Seleccionar Todo',
  'dashboard.filter.tickers.none-found': 'No se encontraron símbolos',

  
  'dashboard.filter.setup.all': 'Todas las Configuraciones',
  'dashboard.filter.setup.none': 'Sin Configuración',
  'dashboard.filter.setup.n-selected': '{count} Configuraciones',
  'dashboard.filter.setup.select-all': 'Seleccionar Todo',
  'dashboard.filter.setup.none-found': 'No se encontraron configuraciones',

  
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
  'dashboard.widgets.weekday-performance.tooltip.no-trades': 'Sin operaciones',
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
  'dashboard.rolling_win_loss.avg_win_label': 'Ganancia Promedio: {value}',
  'dashboard.rolling_win_loss.avg_loss_label': 'Pérdida Promedio: {value}',

  
  'dashboard.selector.title': 'Añadir al Panel',
  'dashboard.selector.metrics': 'Métricas',
  'dashboard.selector.charts': 'Gráficos',
  'dashboard.selector.empty': 'Todas las métricas y gráficos han sido añadidos',
  'dashboard.selector.hint.navigate': '↑↓ navegar',
  'dashboard.selector.hint.select': '↵ seleccionar',
  'dashboard.selector.hint.close': 'esc cerrar',

  
  'dashboard.component-selector.title': 'Añadir Widget',
  'dashboard.component-selector.added': 'Añadido',
  'dashboard.component-selector.category.performance': 'Desempeño',
  'dashboard.component-selector.category.analysis': 'Análisis',
  'dashboard.component-selector.category.journal': 'Diario',

  
  
  
  'view.home': 'Inicio',
  'view.dashboard': 'Panel',
  'view.trade-log': 'Registro de Operaciones',
  'view.account-dashboard': 'Panel de Cuenta',
  'view.layout-builder': 'Constructor de Diseño',
  'view.csv-import': 'Trade Import',

  
  
  
  'nav.prev-day': 'Día Anterior',
  'nav.prev-week': 'Semana Anterior',
  'nav.prev-month': 'Mes Anterior',
  'nav.next-day': 'Día Siguiente',
  'nav.next-week': 'Semana Siguiente',
  'nav.next-month': 'Mes Siguiente',
  'nav.weekly-review': 'Revisión Semanal',
  'nav.monthly-review': 'Revisión Mensual',
  'nav.quarterly-review': 'Revisión Trimestral',
  'nav.yearly-review': 'Revisión Anual',
  'nav.drc': 'Reporte Diario (DRC)',
  'nav.edit-trade': 'Editar Operación',

  'review.loading': 'Cargando {name}...',
  'review.failed-to-load':
    'Error al cargar {name}. Por favor intenta recargar la página.',
  'review.date-unknown': 'Desconocido',

  
  
  
  'account.header.title': 'Cuenta: {name}',
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
  'account.header.warning.earliest-trade':
    'Primera operación: {date}. Esto puede causar cálculos de saldo incorrectos.',
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
  'account.settings.section.inclusion.title':
    'Configuración de Inclusión en Panel',
  'account.settings.section.inclusion.desc':
    'Elija qué tipos de cuenta incluir en los cálculos del panel. También configure si los retiros de cada tipo se incluyen en las métricas de retiros totales.',
  'account.settings.section.inclusion.include-dashboard': 'Incluir en Panel',
  'account.settings.section.inclusion.include-withdrawals': 'Incluir Retiros',
  'account.settings.section.inclusion.empty':
    'No hay tipos de cuenta disponibles para configurar.',
  'account.settings.section.order.title': 'Orden de Visualización',
  'account.settings.section.order.desc':
    'Reordenar cómo aparecen los tipos de cuenta en el panel.',
  'account.settings.section.order.empty':
    'No hay tipos de cuenta disponibles para ordenar.',
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
  'account.create.field.drawdown-type-desc':
    'Ninguno | Fijo | EOD Trailing | Manual',
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
  'account.edit.modal.change-date.info':
    'Esto actualizará la fecha de la transacción del depósito inicial para que coincida con la nueva fecha de creación.',
  'account.edit.modal.change-balance.message':
    'Estás a punto de cambiar el saldo inicial de {oldBalance} a {newBalance}.',
  'account.edit.modal.change-balance.warning':
    'Estás a punto de cambiar el saldo inicial de esta cuenta.',
  'account.edit.modal.change-balance.info':
    'Esto afectará a todos los cálculos de saldo, porcentajes de P&L, cálculos de drawdown e historial de transacciones.',
  'account.edit.modal.delete.question':
    '¿Estás seguro de que deseas eliminar permanentemente la cuenta "{name}"?',
  'account.edit.modal.delete.warning':
    '¿Estás seguro de que deseas eliminar permanentemente esta cuenta?',

  
  
  
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
  'account.edit.field.drawdown-type-desc':
    'Ninguno | Fijo | EOD Trailing | Manual',
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
  'account.profit-target.type.absolute': 'Monto Absoluto',
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
  'account.transaction.description': 'Descripción',
  'account.transaction.balance-after': 'Saldo después',

  
  
  
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
  'account.link-modal.no-existing-found':
    'No se encontraron cuentas existentes. Cree una nueva cuenta.',
  'account.link-modal.option.default':
    'Usar nombre predeterminado: Account-{id}',
  'account.link-modal.default-name': 'Account-{id}',
  'account.link-modal.button.linking': 'Vinculando...',
  'account.link-modal.notice.select-existing':
    'Por favor seleccione una cuenta existente',
  'account.link-modal.notice.failed': 'Error al vincular cuenta: {error}',

  
  
  
  'account.open-trade-log.error': 'Could not open Trade Log for this account.',
  'account.linked-trades.title': 'Operaciones Vinculadas',
  'account.linked-trades.empty-message':
    'No hay operaciones vinculadas a esta cuenta',
  'account.linked-trades.empty-submessage':
    'Las operaciones aparecerán aquí una vez que se agreguen a esta cuenta',
  'account.linked-trades.click-to-open': 'Clic para abrir operación',
  'account.linked-trades.no-path-available': 'Ruta no disponible',
  'account.linked-trades.no-path-warning':
    'Sin ruta de archivo - no se puede abrir',
  'account.linked-trades.entry': 'Entrada',
  'account.linked-trades.exit': 'Salida',
  'account.linked-trades.size': 'Tamaño',
  'account.linked-trades.setups': 'Setups',
  'account.linked-trades.mistakes': 'Errores',
  'account.linked-trades.tags': 'Etiquetas',
  'account.linked-trades.reviewed': 'Revisada',
  'account.linked-trades.not-reviewed': 'No Revisada',
  'account.linked-trades.net-costs': 'Costos Netos',
  'account.linked-trades.net-credit': 'Crédito Neto',

  
  
  
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

  
  
  
  'account.deposits-withdrawals.title': 'Depósitos y Retiros ({count})',
  'account.deposits-withdrawals.empty':
    'No hay depósitos ni retiros manuales registrados.',
  'account.deposits-withdrawals.empty-sub':
    'Haga clic en el botón + en el encabezado para agregar su primera transacción.',

  
  
  
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
    'Deposits and withdrawals are tracked here',
  'account-page.guide.empty.transactions.description':
    'This section keeps a history of manual deposits and withdrawals. When it is empty, use Add Event to create the first one.',
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
  'account-page.guide.main.metrics.title':
    'These metrics summarise this account only',
  'account-page.guide.main.metrics.description':
    'These numbers are calculated from trades linked to this account, so you can judge this account on its own.',
  'account-page.guide.main.risk.title':
    'Risk progress is tracked separately here',
  'account-page.guide.main.risk.description':
    'Use this section to see drawdown usage and profit-target progress, especially for funded or evaluation accounts with hard rules.',
  'account-page.guide.main.add-event.title':
    'Add Event records deposits and withdrawals',
  'account-page.guide.main.add-event.description':
    'Use this whenever money is added or removed outside of normal trade results, so the account history stays accurate.',
  'account-page.guide.main.edit-account.title':
    'Edit Account changes the account settings',
  'account-page.guide.main.edit-account.description':
    'This is where you update the account details and risk rules if they change over time.',
  'account-page.guide.main.transactions.title':
    'Deposits and withdrawals stay in their own section',
  'account-page.guide.main.transactions.description':
    'Each entry here can be reviewed later, so you can separate cash movements from trading performance.',
  'account-page.guide.main.trade-log.title':
    'Linked trades open the actual trade note',
  'account-page.guide.main.trade-log.description':
    'Click any linked trade to open the trade itself. This makes the account page the bridge between account-level review and individual trades.',
  
  
  
  'account-dashboard.title': 'Panel de Cuentas',
  'account-dashboard.copy-badge.base': 'BASE',
  'account-dashboard.copy-badge.copy': 'COPIADOR',
  'account-dashboard.copy-badge.copied-by': 'Copiado por',
  'account-dashboard.copy-badge.copies-tooltip':
    'Copia {account} a {multiplier}x',
  'account-dashboard.error.init':
    'AccountPageService no se inicializó después de múltiples intentos',
  'account-dashboard.error.loading': 'Error al cargar cuentas: {error}',
  'account-dashboard.error.retry':
    'AccountPageService no está listo, reintentando en {delay}ms (intento {attempt}/{max})',
  'account-dashboard.empty.title': 'No Se Encontraron Cuentas',
  'account-dashboard.empty.message':
    'Cree una cuenta para comenzar a rastrear su desempeño de trading',
  'account-dashboard.section.empty': 'No hay cuentas de {type}',
  'account-dashboard.section.empty-sub': 'Crea una cuenta para verla aquí',
  'account-dashboard.button.create-first': 'Crear Su Primera Cuenta',
  'account-dashboard.action.create': 'Crear nueva cuenta',
  'account-dashboard.action.settings': 'Configuración del panel de cuentas',
  'account-dashboard.weight-bar.aria': 'Distribución de AUM por tipo de cuenta',
  'account-dashboard.weight-bar.segment-aria':
    '{name}: {percent}% del AUM total',
  'account-dashboard.guide.empty.intro.title':
    'This page keeps all of your accounts in one place',
  'account-dashboard.guide.empty.intro.description':
    'Use the Account Dashboard to see all of your accounts together. Once accounts exist, this page becomes the fastest way to compare them.',
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
  'account-dashboard.guide.main.intro.title': 'This is your account dashboard',
  'account-dashboard.guide.main.intro.description':
    'Use this page to compare accounts, watch totals across all accounts, and jump into a single account when you need more detail.',
  'account-dashboard.guide.main.trade-filter.title':
    'This filter changes the whole dashboard',
  'account-dashboard.guide.main.trade-filter.description':
    'Use this filter to switch the dashboard between regular trades, backtests, or both.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM means assets under management',
  'account-dashboard.guide.main.aum-chart.description':
    'This chart tracks your combined account value over time, including deposits, withdrawals, and when accounts were added.',
  'account-dashboard.guide.main.metrics.title':
    'These metrics summarise all visible accounts',
  'account-dashboard.guide.main.metrics.description':
    'Use these stats for a quick account-level snapshot before drilling into specific account types or specific accounts.',
  'account-dashboard.guide.main.sections.title':
    'Accounts are grouped by account type',
  'account-dashboard.guide.main.sections.description':
    'These sections help you compare similar accounts together. Each card is clickable and opens the full page for that account.',
  'account-dashboard.guide.main.create-account.title':
    'You can create another account from here at any time',
  'account-dashboard.guide.main.create-account.description':
    'Use this button whenever you want to add a new account to the dashboard.',
  'account-dashboard.guide.main.settings.title':
    'Settings control how this dashboard is organised',
  'account-dashboard.guide.main.settings.description':
    'Open dashboard settings to manage account types, what counts in totals, and the order of the sections.',
  'account-dashboard.guide.main.settings-types.title':
    'Settings can manage available account types',
  'account-dashboard.guide.main.settings-types.description':
    'Inside settings, you can add custom account types and remove old ones if your workflow changes.',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Settings can change what counts in totals',
  'account-dashboard.guide.main.settings-inclusion.description':
    'You can hide account types from dashboard totals without deleting them, and you can separately decide whether their withdrawals still count.',
  'account-dashboard.guide.main.settings-order.title':
    'This section controls the order of account groups',
  'account-dashboard.guide.main.settings-order.description':
    'Use these controls to decide which account types appear first on the dashboard.',
  'account-dashboard.guide.main.close-settings.title':
    'Close settings to return to the dashboard',
  'account-dashboard.guide.main.close-settings.description':
    'Close this modal when you are done reviewing the dashboard settings.',
  'account-dashboard.guide.main.open-account.title':
    'Open any account card to go deeper',
  'account-dashboard.guide.main.open-account.description':
    'When you want the full breakdown for one account, open its card. The Account Page guide will take over there.',
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

  
  
  
  'account-card.status.breached': 'VIOLADO',
  'account-card.status.in-progress': 'EN PROGRESO',
  'account-card.status.achieved': 'LOGRADO',
  'account-card.metric.trades': 'Operaciones',
  'account-card.metric.withdrawals': 'Retiros',
  'account-card.metric.age': 'Antigüedad',
  'account-card.progress.profit-target': 'Objetivo de Ganancia',
  'account-card.progress.drawdown-used': 'Drawdown Limit Used',
  'account-card.progress.not-set': 'No establecido',
  'account-card.footer.monthly': 'Mensual:',
  'account-card.footer.total-costs': 'Costos Totales:',

  
  'account.chart.event.added': 'Cuenta Agregada',
  'account.chart.event.archived': 'Cuenta Archivada',
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
  'common.success': 'Éxito',
  'common.warning': 'Advertencia',
  'common.info': 'Información',
  'common.yes': 'Sí',
  'common.no': 'No',
  'common.ok': 'OK',
  'common.search': 'Buscar...',
  'common.select': 'Seleccionar...',
  'common.select-option': 'Selecciona una opción',
  'common.none': 'Ninguno',
  'common.other': 'Otro',
  'common.breakdown': 'Resumen',
  'common.all': 'Todo',
  'common.date': 'Fecha',
  'common.time': 'Hora',
  'common.today': 'Hoy',
  'common.yesterday': 'Ayer',
  'common.tomorrow': 'Mañana',
  'common.week': 'Semana',
  'common.month': 'Mes',
  'common.year': 'Año',
  'common.total': 'Total',
  'common.average': 'Promedio',
  'common.min': 'Mín',
  'common.max': 'Máx',
  'common.profit': 'Ganancia',
  'common.loss': 'Pérdida',
  'common.win': 'Ganar',
  'common.lose': 'Perder',
  'common.trade': 'Operación',
  'common.trades': 'Operaciones',
  'common.day': 'Día',
  'common.days': 'Días',
  'common.weeks': 'Semanas',
  'common.months': 'Meses',
  'common.years': 'Años',
  'common.quarter': 'Trimestre',
  'common.quarters': 'Trimestres',
  'common.best': 'Mejor',
  'common.worst': 'Peor',
  'common.goals': 'Objetivos',
  'common.statuses': 'Estados',
  'common.enabled': 'activado',
  'common.disabled': 'desactivado',
  'common.unknown': 'Desconocido',
  'common.unknown-error': 'Error desconocido',
  'common.na': 'N/A',
  'common.note-label': 'Nota:',
  'common.tip-label': 'Consejo:',
  'common.warning-label': 'Advertencia:',
  'common.backups-label': 'Respaldos:',
  'common.header': 'Encabezado',
  'common.view': 'Ver',
  'common.row-n': 'Fila {n}: ',
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
  'chart.tooltip.distance-to-recovery': 'Distance to Recovery',
  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',
  'chart.tooltip.trade-pnl': 'P&L del Trade',
  'chart.tooltip.account': 'Account',
  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'chart.loading': 'Cargando gráfico...',

  
  'chart.legend.entry': 'Entrada',
  'chart.legend.exit': 'Salida',
  'chart.legend.trade': 'Operación',

  
  
  
  'backend.title': 'Sincronización de operaciones',
  'backend.description':
    'Configura la sincronización de MetaTrader (MT4/MT5) y mantén tu bóveda actualizada automáticamente.',

  
  'trade-sync.gate.signin.title': 'Se requiere iniciar sesión',
  'trade-sync.gate.signin.description':
    'Para habilitar la sincronización de operaciones, primero inicia sesión en tu cuenta de Journalit.',
  'trade-sync.gate.signin.cta': 'Iniciar sesión',

  'trade-sync.gate.pro.title': 'Se requiere Pro',
  'trade-sync.gate.pro.description':
    'Trade Sync is a Pro feature. Upgrade to continue.',
  'trade-sync.gate.pro.cta': 'Upgrade now',

  
  'premium.gate.cta.activate': 'Activate PRO',
  'premium.gate.cta.upgrade-now': 'Upgrade now',
  'premium.gate.cta.signin-continue': 'Iniciar sesión y continuar',
  'premium.gate.cta.continue-pro': 'Continuar con PRO',
  'premium.gate.cta.keep-editing': 'Seguir editando',
  'premium.gate.cta.refresh': 'Refresh status',
  'premium.gate.import.state.signin.title': 'Te falta un paso para importar',
  'premium.gate.import.state.signin.description':
    'Tu archivo y asignaciones están listos. Inicia sesión para continuar.',
  'premium.gate.import.state.pro.title': 'Todo listo para importar',
  'premium.gate.import.state.pro.description':
    'Tu archivo y asignaciones están listos. Importar forma parte de PRO.',
  'premium.gate.import.reassurance':
    'Tu vista previa y las asignaciones de columnas se mantendrán exactamente como están.',
  'premium.gate.trial-hint':
    'Las primeras suscripciones a PRO incluyen una prueba gratuita de 14 días.',
  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  'backend.connection.title': 'Configuración de Conexión',
  'backend.connection.status': 'Estado de Conexión',
  'backend.connection.status-desc':
    'Estado actual de la conexión con el servidor de trading',
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
  'backend.ftp.credentials-title': 'Credenciales FTP de MetaTrader',
  'backend.sync.title': 'Configuración de Sincronización',
  'backend.sync.auto-sync': 'Habilitar Auto-Sincronización',
  'backend.sync.auto-sync-desc':
    'Sincroniza automáticamente operaciones nuevas desde el servidor de trading',
  'backend.sync.auto-sync-info':
    'La auto-sincronización verifica nuevas operaciones cada hora',
  'backend.sync.auto-sync-aria': 'Habilitar auto-sincronización',
  'backend.sync.manual': 'Sincronización Manual',
  'backend.sync.manual-desc': 'Forzar sincronización inmediata de operaciones',
  'backend.sync.manual-info':
    'Sincroniza inmediatamente cualquier operación nueva desde el servidor de trading',
  'backend.sync.syncing': 'Sincronizando...',
  'backend.sync.force-button': 'Forzar Sincronización Ahora',
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
  'backend.accounts.title': 'Cuentas de Trading',
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
  'backend.progress.title': 'Progreso de Configuración',
  'backend.progress.connection.label': 'Conectar',
  'backend.progress.connection.desc': 'Vincular vault al servidor',
  'backend.progress.ftp.label': 'FTP',
  'backend.progress.ftp.desc': 'Crear credenciales',
  'backend.progress.sync.label': 'Sincronizar',
  'backend.progress.sync.desc': 'Habilitar auto-sync',
  'backend.progress.accounts.label': 'Cuentas',
  'backend.progress.accounts.desc': 'Vincular cuentas MT',

  
  'backend.cards.connection.title': 'Conexión',
  'backend.cards.connection.refresh': 'Actualizar',
  'backend.cards.sync.title': 'Estado de Sync',
  'backend.cards.sync.last-sync': 'Última sync',
  'backend.cards.sync.total': 'Total de syncs',
  'backend.cards.sync.button': 'Sincronizar Ahora',
  'backend.cards.accounts.title': 'Cuentas',
  'backend.cards.accounts.linked': 'Cuentas vinculadas',
  'backend.cards.accounts.manage': 'Gestionar',

  
  'backend.section.setup.title': 'Configuración y Ajustes',
  'backend.section.sync.title': 'Ajustes de Sincronización',
  'backend.section.accounts.title': 'Gestión de Cuentas',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'Mapeo de Trade Import con IA',
  'settings.auth.feature.metatrader-sync': 'Sincronización MetaTrader',
  'settings.auth.feature.basic-tracking': 'Seguimiento básico',
  'settings.auth.feature.manual-csv': 'Importación manual de Trade Import',
  'settings.auth.feature.manual-entry': 'Entrada manual de operaciones',
  'settings.auth.feature.analytics-reviews': 'Analíticas y revisiones',
  'settings.auth.feature.priority-support': 'Soporte Prioritario',

  
  'backend.sync.just-now': 'Justo ahora',
  'backend.sync.minutes-ago': 'hace {count} min',
  'backend.sync.hours-ago': 'hace {count} hr',
  'backend.sync.days-ago': 'hace {count} días',

  
  
  
  'settings.title': 'Configuración de Journalit',
  'settings.language': 'Idioma',
  'settings.language-desc': 'Selecciona el idioma de visualización del plugin',

  
  
  
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
    'Instrucciones de Configuración de MetaTrader:',
  'settings.ftp.instructions.step1': 'Abre MetaTrader\u00A05 (MT5)',
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

  
  
  
  'settings.auth.title': 'Cuenta',
  'settings.auth.description':
    'Gestiona la autenticación y configuración de conexión.',
  'settings.auth.status': 'Estado',
  'settings.auth.status-desc': 'Estado actual de conexión y suscripción',
  'settings.auth.status-offline': 'Sin conexión',
  'settings.auth.status-online': 'En línea',
  'settings.auth.plan-suffix': 'Plan',
  'settings.auth.authentication': 'Autenticación',
  'settings.auth.sign-in-desc':
    'Inicia sesión para acceder a tu diario de trading',
  'settings.auth.signed-in': 'Sesión Iniciada',
  'settings.auth.sign-in-up': 'Iniciar Sesión / Registrarse',
  'settings.auth.sign-out': 'Cerrar Sesión',
  'settings.auth.sign-out-desc': 'Cerrar sesión de tu cuenta',
  'settings.auth.subscription-features': 'Características de Suscripción',
  'settings.auth.tier-free': 'Plan gratuito con funciones básicas.',
  'settings.auth.tier-pro':
    'Plan Pro con análisis avanzado y almacenamiento ilimitado.',
  'settings.auth.tier-enterprise':
    'Plan Enterprise con acceso completo y soporte prioritario.',
  'settings.auth.tier-unknown': 'Estado de suscripción desconocido.',
  'settings.auth.error-prefix': 'Error: ',
  'settings.auth.offline-mode': 'Modo Sin Conexión',
  'settings.auth.offline-desc':
    'Operando en modo sin conexión. Algunas funciones pueden estar limitadas. Se sincronizará automáticamente cuando haya conexión.',
  'settings.auth.grace-period': 'El período de gracia termina en {days} días',

  
  'settings.auth.guest': 'Invitado',
  'settings.auth.actions': 'Acciones',
  'settings.auth.your-plan': 'Tu Plan',
  'settings.auth.feature-basic-trades': 'Seguimiento básico de operaciones',
  'settings.auth.feature-basic-analytics': 'Análisis básico',
  'settings.auth.feature-unlimited-trades': 'Operaciones ilimitadas',
  'settings.auth.feature-advanced-analytics': 'Análisis avanzado',
  'settings.auth.feature-api-access': 'Acceso API',
  'settings.auth.feature-priority-support': 'Soporte prioritario',
  'settings.auth.manage-subscription': 'Gestionar Suscripción',

  
  
  
  'settings.tab.general': 'General',
  'settings.tab.reviews': 'Revisión',
  'settings.tab.customization': 'Personalización',
  'settings.tab.backend': 'Sincronización de operaciones',
  'settings.tab.accounts': 'Cuenta',

  
  
  
  'settings.reviews.drc': 'DRC',
  'settings.reviews.weekly': 'Revisión Semanal',
  'settings.reviews.monthly': 'Revisión Mensual',
  'settings.reviews.quarterly': 'Revisión Trimestral',
  'settings.reviews.yearly': 'Revisión Anual',

  'settings.reviews.default-templates': 'Layouts Predeterminadas',
  'settings.reviews.default-templates-desc':
    'Selecciona qué plantilla usar al crear nuevas notas. También puedes establecer valores predeterminados en el Constructor de Plantillas.',
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

  'settings.reviews.scalper-defaults': 'Valores predeterminados para scalpers',
  'settings.reviews.scalper-defaults-desc':
    'Configura valores globales para el comportamiento del Rastreador de Demonios. Cada widget puede sobrescribirlos desde el Layout Builder.',
  'settings.reviews.scalper-default-count-mode':
    'Modo de conteo predeterminado',
  'settings.reviews.scalper-default-count-mode-desc':
    'Elige si los errores recurrentes se cuentan por operación o una vez por día de trading.',
  'settings.reviews.scalper-default-source-mode':
    'Modo de origen predeterminado',
  'settings.reviews.scalper-default-source-mode-desc':
    'Elige si el Rastreador de Demonios usa errores de operaciones, errores de sesión o ambos.',
  'settings.reviews.scalper-auto-apply-session':
    'Aplicar automáticamente errores de sesión a operaciones del día',
  'settings.reviews.scalper-auto-apply-session-desc':
    'Cuando está activado, los errores de sesión pueden aplicarse por defecto a todas las operaciones del mismo día de trading.',
  'settings.reviews.scalper-auto-apply-session-aria':
    'Aplicar automáticamente errores de sesión a operaciones del día',

  'settings.reviews.notice.template-updated':
    'Plantilla predeterminada actualizada',
  'settings.reviews.notice.builder-not-found':
    'Comando del Constructor de Diseño no encontrado',
  'settings.reviews.notice.global-auto-create':
    'Auto-crear para todas las revisiones {status}',
  'settings.reviews.notice.auto-create-nav':
    'Auto-crear {type} al navegar {status}',

  'settings.reviews.daily.checklist-title': 'Elementos de Lista Pre-Operación',
  'settings.reviews.daily.checklist-desc':
    'Personaliza los elementos de lista que aparecen en tu Reporte Diario. Estas son tareas que debes completar antes de comenzar tu sesión de trading.',
  'settings.reviews.daily.checklist-placeholder': 'Nuevo elemento de lista',
  'settings.reviews.daily.questions-title': 'Preguntas de Revisión',
  'settings.reviews.daily.questions-desc':
    'Personaliza las preguntas de reflexión que aparecen en la sección de revisión. Estas preguntas te ayudan a reflexionar sobre tu desempeño de trading.',
  'settings.reviews.daily.questions-placeholder': 'Nueva pregunta de revisión',
  'settings.reviews.daily.timeframes-title': 'Marcos Temporales de Pronóstico',
  'settings.reviews.daily.timeframes-desc':
    'Personaliza los marcos temporales que aparecen en los pronósticos de tu Reporte Diario.',
  'settings.reviews.daily.timeframes-placeholder':
    'Nuevo marco temporal (ej., 15M, 5M)',

  
  
  
  'settings.weekly.review-questions': 'Preguntas de Revisión',
  'settings.weekly.review-questions-desc':
    'Personaliza las preguntas que aparecen en tu revisión semanal. Estas preguntas te ayudan a reflexionar sobre tu desempeño de trading durante la semana.',
  'settings.weekly.new-question-placeholder': 'Nueva pregunta de revisión',
  'settings.weekly.forecast-timeframes': 'Marcos Temporales de Pronóstico',
  'settings.weekly.forecast-timeframes-desc':
    'Personaliza los marcos temporales que aparecen en tu pronóstico semanal.',
  'settings.weekly.new-timeframe-placeholder':
    'Nuevo marco temporal (ej., Semanal, Diario)',
  'settings.weekly.default-question-1': '¿Qué funcionó bien esta semana?',
  'settings.weekly.default-question-2': '¿Qué no funcionó esta semana?',
  'settings.weekly.default-question-3':
    '¿Qué configuraciones fueron más rentables?',
  'settings.weekly.default-question-4': '¿Qué errores me costaron más dinero?',
  'settings.weekly.default-question-5':
    '¿Qué podría mejorar para la próxima semana?',
  'settings.weekly.default-timeframe-monthly': 'Mensual',
  'settings.weekly.default-timeframe-weekly': 'Semanal',
  'settings.weekly.default-timeframe-daily': 'Diario',

  
  
  
  'settings.shared.timeframes.title': 'Marcos Temporales de Pronóstico',
  'settings.shared.timeframes.desc':
    'Personaliza los marcos temporales que aparecen en tu pronóstico',
  'settings.shared.timeframes.placeholder':
    'Nuevo marco temporal (ej., 15M, 5M)',
  'settings.shared.timeframes.reset-to-defaults':
    'Restablecer a Predeterminados',

  
  
  
  'settings.loss-review.title': 'Configuración de Revisión de Pérdidas',
  'settings.loss-review.description':
    'Configura la Revisión de Pérdidas que aparece en la parte inferior de las operaciones perdedoras. Esto te ayuda a aprender de las pérdidas y mantener una psicología de trading adecuada.',
  'settings.loss-review.enable': 'Habilitar Revisión de Pérdidas',
  'settings.loss-review.enable-desc':
    'Mostrar sección de Revisión de Pérdidas para operaciones con P&L negativo',
  'settings.loss-review.sections-title': 'Secciones de Revisión de Pérdidas',
  'settings.loss-review.add-section': 'Añadir Sección',
  'settings.loss-review.reset-to-defaults': 'Restablecer a Predeterminados',
  'settings.loss-review.new-section-title': 'Nueva Sección',
  'settings.loss-review.empty-state':
    'No hay secciones configuradas. Haz clic en "Añadir Sección" para crear tu primera sección.',
  'settings.loss-review.field.content': 'Contenido',
  'settings.loss-review.field.checkbox-label': 'Etiqueta de Casilla',
  'settings.loss-review.field.placeholder-text': 'Texto de Marcador',
  'settings.loss-review.field.checkbox-items': 'Elementos de Casilla',
  'settings.loss-review.field.section-title': 'Título de Sección',
  'settings.loss-review.field.section-type': 'Tipo de Sección',
  'settings.loss-review.placeholder.header-content':
    'Ingresa contenido del encabezado (soporta markdown)',
  'settings.loss-review.placeholder.checkbox-label':
    'Ingresa etiqueta de casilla (soporta markdown)',
  'settings.loss-review.placeholder.textarea-placeholder':
    'Ingresa texto de marcador para el área de texto',
  'settings.loss-review.placeholder.checkbox-item':
    'Ingresa elemento de casilla (soporta markdown)',
  'settings.loss-review.placeholder.section-title': 'Ingresa título de sección',
  'settings.loss-review.untitled-section': 'Sección Sin Título',
  'settings.loss-review.type.header': 'Encabezado',
  'settings.loss-review.type.checkbox': 'Casilla Individual',
  'settings.loss-review.type.textarea': 'Área de Texto',
  'settings.loss-review.type.checkbox-list': 'Lista de Casillas',

  
  
  
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

  'settings.general.display-privacy-section': 'Visualización & Privacidad',
  'settings.general.privacy-mode': 'Modo Privacidad',
  'settings.general.privacy-mode-desc':
    'Oculta valores sensibles de operaciones, cuentas, precios y rendimiento en la interfaz sin cambiar los datos guardados.',
  'settings.general.privacy-mode-aria': 'Alternar modo privacidad',

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

  'settings.general.skip-weekends': 'Saltar Fines de Semana en Navegación',
  'settings.general.skip-weekends-desc':
    'Saltar fines de semana al navegar entre días de trading (ej., Viernes → Lunes)',
  'settings.general.skip-weekends-aria': 'Saltar fines de semana al navegar',
  'settings.general.skip-weekends-toggled': 'Saltar fines de semana {status}',

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
    'Mostrar una notificación cuando haya una nueva actualización del plugin disponible',
  'settings.general.update-notifications-aria':
    'Mostrar notificaciones de actualización',
  'settings.general.update-notifications-toggled':
    'Notificaciones de actualización {status}',

  'settings.general.data-management': 'Gestión de Datos & Privacidad',
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
  'settings.customization.tickers-symbols': 'Símbolos/Tickers',
  'settings.customization.symbol-mappings': 'Mapeo de Símbolos',
  'settings.customization.account-types': 'Tipos de Cuenta',
  'settings.customization.setups': 'Configuraciones',
  'settings.customization.mistakes': 'Errores',
  'settings.customization.tags': 'Etiquetas',
  'settings.customization.events': 'Eventos',
  'settings.customization.custom-fields': 'Campos Personalizados de Operación',

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
    'Crea campos personalizados que aparecerán en la pestaña Avanzado del formulario de operación. Estos campos se guardarán en el frontmatter de tu operación.',
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
    'Los campos personalizados aparecerán en la pestaña "Avanzado" del formulario de operación y se guardarán en el frontmatter de tus notas de operación.',
  'settings.customization.custom-fields.add-new': 'Añadir Nuevo Campo',
  'settings.customization.custom-fields.edit-field': 'Editar Campo',
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
  'widget.header.description':
    'Encabezado de navegación con enlaces de contexto',
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
  'widget.review-context-fields.inherited-title': 'Inherited Context',
  'widget.review-context-fields.local-title': 'Local Context',
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
  'widget.review-context-fields.open-source': 'Open',
  'widget.review-context-fields.create-source': 'Create',
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
  'widget.session-mistakes.field-label': 'Errores',
  'widget.session-mistakes.placeholder': 'Selecciona o crea errores',
  'widget.session-mistakes.empty': 'No hay errores de sesión registrados',
  'widget.session-mistakes.count': '{count} seleccionados',
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
  'widget.key-events.notes-placeholder': 'Notas sobre este evento (opcional)',
  'widget.key-events.notes-label': 'Notas',
  'widget.key-events.default-notes-tooltip':
    'Las notas predeterminadas se gestionan en Configuración → Personalización → Eventos. Al seleccionar un evento aquí, se autocompletarán sus notas predeterminadas guardadas.',
  'widget.key-events.add-button': 'Agregar Evento',
  'widget.key-events.empty-state': 'Sin eventos clave para hoy',
  'widget.key-events.empty-state-sub': 'Agrega eventos en tu Revisión Semanal',

  
  'widget.missed-trades.name': 'Operaciones Perdidas',
  'widget.missed-trades.description':
    'Operaciones que identificaste pero no tomaste',
  'widget.missed-trades.title': 'Operaciones Perdidas',
  'widget.missed-trades.add-button': 'Agregar',
  'widget.missed-trades.add-aria': 'Agregar operación perdida',
  'widget.missed-trades.missed-badge': 'Perdida',
  'widget.missed-trades.additional-setups': 'Configuraciones Adicionales:',
  'widget.missed-trades.no-trades-today': 'Ninguna hoy',
  'widget.missed-trades.no-trades-week': 'Sin operaciones perdidas esta semana',
  'widget.missed-trades.invalid-context':
    'El widget de Operaciones Perdidas requiere un contexto de revisión válido',
  'widget.missed-trades.error-no-date':
    'No se pudo determinar la fecha de la operación perdida',
  'widget.missed-trades.error-open-form':
    'Error al abrir formulario de operación perdida',

  
  'widget.images.name': 'Imágenes',
  'widget.images.description': 'Carrusel de imágenes con soporte de carga',
  'widget.images.invalid-context':
    'El widget de Imágenes requiere un contexto de revisión válido',
  'widget.images.alt-prefix': 'Imagen de revisión',
  'widget.images.stacked-alt': 'Imagen de revisión {index}',
  'widget.images.open-fullscreen': 'Abrir imagen {index} en pantalla completa',
  'widget.images.delete': 'Eliminar imagen',
  'widget.images.empty': 'Sin imágenes',
  'widget.images.placeholder': 'Pegar URL de imagen o ruta de archivo...',
  'widget.images.placeholder-add-more': 'Agregar más imágenes...',

  
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
  'widget.table.header.year': 'Año',
  'widget.table.header.trades': 'Operaciones',
  'widget.table.header.pnl': 'G/P',
  'widget.table.header.win-rate': '% Acierto',
  'widget.table.header.profit-factor': 'FG',
  'widget.table.header.setup': 'Configuración',
  'widget.table.header.a-games': 'Juegos A',
  'widget.table.header.b-games': 'Juegos B',
  'widget.table.header.c-games': 'Juegos C',
  'widget.table.header.rating': 'Calificación',
  'widget.table.header.avg-rating': 'Calif. Promedio',

  
  'widget.demon-tracker.column.demon': 'DEMONIO',
  'widget.demon-tracker.column.occurrences': 'OCURRENCIAS',
  'widget.demon-tracker.column.stop-trading': 'DEJAR DE OPERAR',
  'widget.demon-tracker.period.this-month': 'este mes',
  'widget.demon-tracker.period.this-quarter': 'este trimestre',
  'widget.demon-tracker.period.this-year': 'este año',
  'widget.demon-tracker.empty.title': 'No se registraron errores en {period}',
  'widget.demon-tracker.empty.description':
    'Los errores registrados en tus operaciones aparecerán aquí para ayudar a identificar patrones',
  'widget.demon-tracker.summary.unique': 'Errores únicos:',
  'widget.demon-tracker.summary.total': 'Ocurrencias totales:',
  'widget.demon-tracker.summary.critical': 'Críticos (6+):',

  
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
  'widget.trade-table.unknown-account': 'Unknown Account',
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
  'widget.pnlChart.description':
    'Gráfico de línea mostrando G/P acumulado en el tiempo',
  'widget.longPnLChart.name': 'P&L Largo',
  'widget.longPnLChart.description':
    'Curva de P&L acumulado solo para operaciones largas cerradas',
  'widget.shortPnLChart.name': 'P&L Corto',
  'widget.shortPnLChart.description':
    'Curva de P&L acumulado solo para operaciones cortas cerradas',
  'widget.performanceCalendar.name': 'Calendario de Rendimiento',
  'widget.performanceCalendar.description':
    'Vista de calendario de rendimiento diario de trading',
  'widget.dailyPerformance.name': 'Rendimiento Diario',
  'widget.dailyPerformance.description':
    'Resumen detallado del rendimiento del día',
  'widget.tradesChart.name': 'Gráfico de Operaciones',
  'widget.tradesChart.description':
    'Gráfico de barras de G/P de operaciones individuales',
  'widget.weekdayPerformance.name': 'Desempeño por Día de Semana',
  'widget.weekdayPerformance.description':
    'Gráfico de barras del desempeño para cada día de la semana',
  'widget.hourlyPerformance.name': 'Desempeño por Hora',
  'widget.hourlyPerformance.description':
    'Gráfico de barras que muestra P&L para cada hora del día',
  'widget.tradesChart.limit': '{count} Operaciones',
  'widget.drawdownChart.name': 'Drawdown Chart',
  'widget.drawdownChart.description':
    'Closed-trade drawdown amount from the prior realized P&L high',
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
    'Ratio de victoria/pérdida en ventana móvil',
  'widget.rollingStats.name': 'Promedio Móvil Victoria/Pérdida',
  'widget.rollingStats.description':
    'Valores promedio de victoria/pérdida en el tiempo',

  
  'widget.pagination.showing': 'Mostrando {start}-{end} de {total} {items}',
  'widget.pagination.prev': 'Anterior',
  'widget.pagination.next': 'Siguiente',
  'widget.pagination.page': 'Página {current} de {total}',
  'widget.pagination.weeks': 'semanas',
  'widget.pagination.months': 'meses',

  
  
  
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
  'error.clipboard.no-target':
    'No se encontró área de carga de imágenes. Haz clic en un área de carga de imágenes primero, luego pega tu imagen.',
  'error.clipboard.network-error':
    'Ocurrió un error de red al procesar el pegado. Por favor verifica tu conexión e intenta nuevamente.',
  'error.clipboard.paste-failed':
    'No se puede completar la operación de pegado. Por favor intenta copiar la imagen nuevamente y pegarla.',
  'error.clipboard.generic':
    'La operación del portapapeles falló. Por favor intenta copiar tu contenido nuevamente y pegarla.',

  
  
  

  
  
  
  'drc.trades.chart.cumulative-pnl': 'P&L Acumulado',
  'drc.trades.chart.drawdown': 'Drawdown',
  'drc.trades.stats.title': 'Estadísticas Diarias de Operaciones',
  'drc.trades.stats.net-pnl': 'P&L Neto',
  'drc.trades.stats.win-rate': 'Tasa de Ganancia',
  'drc.trades.stats.profit-factor': 'Factor de Ganancia',
  'drc.trades.stats.expectancy': 'Expectativa',
  'drc.trades.stats.total-trades': 'Total de Operaciones',
  'drc.trades.stats.avg-win': 'Ganancia Promedio',
  'drc.trades.stats.avg-loss': 'Pérdida Promedio',
  'drc.trades.stats.pl-ratio': 'Ratio G/P',
  'drc.trades.log.title': 'Registro de Operaciones',
  'drc.trades.log.empty': 'Sin operaciones para este día',
  'drc.trades.log.empty-sub':
    'Las operaciones aparecerán aquí una vez que se añadan',
  'drc.trades.table.images': 'Imágenes',
  'drc.trades.table.entry-exit-time': 'Hora Entrada/Salida',
  'drc.trades.table.ticker': 'Símbolo',
  'drc.trades.table.direction': 'Dirección',
  'drc.trades.table.setup': 'Configuración',
  'drc.trades.table.pnl': 'P&L',
  'drc.trades.table.open': 'ABIERTA',
  'drc.trades.table.na': 'N/A',
  'drc.trades.table.unknown': 'Desconocida',
  'drc.trades.image.alt': 'Imagen de Operación {id}',
  'drc.trades.image.preview-alt': 'Vista previa de Operación {id}',

  
  
  
  'drc.component-name': 'Reporte Diario de Operaciones',
  'drc.tab.preparation': 'Preparación',
  'drc.tab.trades': 'Operaciones',
  'drc.tab.review': 'Revisión',

  
  
  
  'drc.preparation.support-levels': 'Niveles de Soporte',
  'drc.preparation.resistance-levels': 'Niveles de Resistencia',
  'drc.preparation.enter-price': 'Ingresa nivel de precio',
  'drc.preparation.select-importance': 'Selecciona nivel de importancia',
  'drc.preparation.add-support': 'Añadir nivel de soporte',
  'drc.preparation.add-resistance': 'Añadir nivel de resistencia',
  'drc.preparation.remove-level': 'Eliminar nivel',
  'drc.preparation.no-support': 'Sin niveles de soporte definidos',
  'drc.preparation.no-resistance': 'Sin niveles de resistencia definidos',
  'drc.preparation.importance.none': 'Ninguno',
  'drc.preparation.importance.high': 'Alto',
  'drc.preparation.importance.medium': 'Medio',
  'drc.preparation.importance.low': 'Bajo',
  'drc.preparation.checklist.title': 'Lista de Verificación Pre-Operación',
  'drc.preparation.checklist.empty': 'Sin elementos de lista de verificación',
  'drc.preparation.checklist.sub-apply':
    'Aplicar elementos de lista de verificación desde la configuración del plugin',
  'drc.preparation.checklist.sub-add':
    'Añadir elementos de lista de verificación en la configuración del plugin',
  'drc.preparation.bias.title': 'Sesgo del Mercado',
  'drc.preparation.bias.bullish': 'Alcista',
  'drc.preparation.bias.bearish': 'Bajista',
  'drc.preparation.bias.neutral': 'Neutral',
  'drc.preparation.bias.placeholder': 'Selecciona sesgo del mercado',
  'drc.preparation.goals.title': 'Objetivos Diarios',
  'drc.preparation.goals.empty': 'Sin objetivos diarios del día anterior',
  'drc.preparation.events.title': 'Eventos Clave',
  'drc.preparation.events.all-week': 'Toda la Semana',
  'drc.preparation.events.empty': 'Sin eventos clave para hoy',
  'drc.preparation.events.sub-empty':
    'Los eventos se pueden añadir en la revisión semanal',
  'drc.preparation.forecast.title': 'Pronóstico Diario',
  'drc.preparation.media.title': 'Enlaces de Medios',
  'drc.preparation.media.youtube': 'Enlace de YouTube',
  'drc.preparation.media.youtube-placeholder':
    'Enlace a tu transmisión de trading',
  'drc.preparation.error.service-unavailable': 'Servicio DRC no disponible',
  'drc.preparation.error.image-upload': 'Error al subir imagen',

  
  
  
  'drc.missed-trades.title': 'Operaciones Perdidas',
  'drc.missed-trades.loading': 'Cargando operaciones perdidas...',
  'drc.missed-trades.error.service-unavailable':
    'Servicio de operaciones perdidas no disponible',
  'drc.missed-trades.error.load-failed': 'Error al cargar operaciones perdidas',
  'drc.missed-trades.error-prefix': 'Error: {error}',
  'drc.missed-trades.retry': 'Reintentar',
  'drc.missed-trades.unknown': 'Desconocida',
  'drc.missed-trades.no-setup': 'Sin configuración especificada',
  'drc.missed-trades.badge': 'PERDIDA',
  'drc.missed-trades.open-details-title': 'Abrir detalles de operación perdida',
  'drc.missed-trades.view-details': 'Ver Detalles →',
  'drc.missed-trades.label.setup': 'Configuración:',
  'drc.missed-trades.label.reason': 'Razón:',
  'drc.missed-trades.add-button': '+ Añadir Operación Perdida',
  'drc.missed-trades.add-title': 'Añadir una nueva operación perdida',
  'drc.missed-trades.empty': 'Sin operaciones perdidas para hoy',
  'drc.missed-trades.empty-sub':
    'Haz seguimiento de oportunidades de trading que perdiste para mejorar tu ejecución',

  
  
  
  'drc.review.goal-placeholder': 'Tu objetivo para la próxima sesión',
  'drc.review.no-questions':
    'Sin preguntas de reflexión definidas. Añade preguntas de revisión en la configuración.',
  'drc.review.answer-placeholder': 'Tu respuesta...',
  'drc.review.mental-game': 'Juego Mental:',
  'drc.review.mental-game-aria': 'Calificación de Juego Mental',
  'drc.review.technical-game': 'Juego Técnico:',
  'drc.review.technical-game-aria': 'Calificación de Juego Técnico',
  'drc.review.end-of-day-review': 'Revisión de Fin de Día',
  'drc.review.performance-grades': 'Calificaciones de Desempeño',
  'drc.review.reflection-questions': 'Preguntas de Reflexión',
  'drc.review.goals-for-next-session': 'Objetivos para Próxima Sesión',
  'drc.review.add-goal': 'Añadir Objetivo',
  'drc.review.end-of-day-screenshots': 'Capturas de Pantalla de Fin de Día',
  'drc.review.add-screenshots': 'Añadir capturas de pantalla',
  'drc.review.error.invalid-date':
    'Formato de fecha de DRC inválido. Por favor verifica la fecha en tu nota de DRC.',

  
  
  
  'csv.uploader.drop-here': 'Suelta el archivo CSV/XLSX/XLS/HTML aquí',
  'csv.uploader.click-drag': 'Haz clic para cargar o arrastra y suelta',
  'csv.uploader.hint': 'Solo Trade Import/XLSX/XLS/HTML, máximo 10MB',

  'csv.mapper.title': 'Mapear Columnas a Campos de Operación',
  'csv.mapper.subtitle':
    'Vincula tus columnas con los campos de operación que representan.',
  'csv.mapper.do-not-import': 'No importar',
  'csv.mapper.required-badge': 'Requerido',
  'csv.mapper.required-label': 'REQUERIDO',
  'csv.mapper.example': 'Ejemplo:',
  'csv.mapper.mode.title': 'Modo de importación',
  'csv.mapper.mode.help':
    'Elige cómo se deben interpretar las filas manuales. El análisis de PnL directo se habilitará en una fase posterior.',
  'csv.mapper.mode.price-based': 'Basado en precio (Entrada/Salida)',
  'csv.mapper.mode.direct-pnl': 'PnL directo',
  'csv.mapper.asset-type.help':
    'Selecciona el tipo de instrumento en este archivo. Esto determina los campos requeridos y la lógica de análisis.',
  'csv.mapper.date-format.title': 'Formato de Fecha en el Archivo',
  'csv.mapper.date-format.help':
    'Cómo aparecen las fechas en tu archivo. Importante para formatos ambiguos como 01/02/2024 (2 ene vs 1 feb).',
  'csv.mapper.date-format.placeholder': 'Selecciona formato de fecha...',
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

  'csv.ai-mapper.header.title': '¿Necesitas Ayuda?',
  'csv.ai-mapper.header.description':
    'La IA puede analizar tu CSV y sugerir mapeos de campos (opcional)',
  'csv.ai-mapper.button.label': 'Sugerir Mapeos con IA',
  'csv.ai-mapper.button.tooltip':
    'Usa IA para sugerir mapeos de columnas. Requiere conexión al backend.',
  'csv.ai-mapper.helper-text':
    'Las sugerencias de IA deben ser verificadas antes de importar — siempre revisa los mapeos por precisión.',
  'csv.ai-mapper.status.analyzing': 'Analizando estructura del CSV',
  'csv.ai-mapper.status.consulting': 'Consultando IA para mapeos de columnas',
  'csv.ai-mapper.status.processing': 'Procesando sugerencias de IA',
  'csv.ai-mapper.status.taking-longer':
    'Tomando más tiempo del esperado, aún trabajando',
  'csv.ai-mapper.notice.no-suggestions':
    'La IA no pudo sugerir mapeos. Por favor mapea manualmente.',
  'csv.ai-mapper.notice.suggested-count':
    'La IA sugirió mapeos para {count} columnas',
  'csv.ai-mapper.notice.unavailable':
    'Mapeo de IA no disponible. Por favor mapea columnas manualmente o usa una plantilla guardada.',

  'csv.template-save.title': 'Guardar Plantilla de Importación',
  'csv.template-save.description':
    'Guarda estos mapeos de columnas como una plantilla reutilizable para futuras importaciones.',
  'csv.template-save.label.name': 'Nombre de la Plantilla',
  'csv.template-save.placeholder.name': 'ej., Mi Formato de Broker',
  'csv.template-save.button.save': 'Guardar Plantilla',
  'csv.template-save.button.saving': 'Guardando...',

  'csv.template-import.title': 'Importar Plantilla',
  'csv.template-import.description':
    'Pega un código de compartir plantilla (JTT-v1-... o JTT-v2-...) para importarlo a tu bóveda.',
  'csv.template-import.label.share-code': 'Código de Compartir',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',
  'csv.template-import.helper-text':
    'La plantilla se añadirá a tus plantillas locales',
  'csv.template-import.button.import': 'Importar Plantilla',
  'csv.template-import.button.importing': 'Importando...',
  'csv.template-import.error.import-failed': 'Error al importar plantilla',

  'csv.template-delete.title': '¿Eliminar Plantilla?',
  'csv.template-delete.description':
    '¿Estás seguro de que deseas eliminar "{name}"? Esta acción no se puede deshacer.',
  'csv.template-delete.button.delete': 'Eliminar Plantilla',
  'csv.template-delete.button.deleting': 'Eliminando...',

  'csv.export-template.title': 'Exportar Plantilla: {name}',
  'csv.export-template.description':
    'Comparte este código con otros para permitirles usar tu configuración de plantilla.',
  'csv.export-template.label.share-code': 'Código de Compartir',
  'csv.export-template.helper-text':
    'Código completo copiado al portapapeles cuando hagas clic en el botón de abajo',
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

  
  
  
  'csv.broker.loading': 'Cargando brokers...',
  'csv.broker.loading-templates': 'Cargando plantillas...',
  'csv.broker.select-placeholder': 'Selecciona broker o plantilla...',
  'csv.broker.label': 'Broker / Formato de Importación',
  'csv.broker.helper-text':
    'Elige un broker soportado o crea un formato personalizado',
  'csv.broker.hidden-count': '{count} ocultos',
  'csv.broker.manage-hidden': 'Gestionar brokers ocultos',
  'csv.broker.supported-brokers': 'Brokers Soportados',
  'csv.broker.my-templates': 'Mis Plantillas',
  'csv.broker.show-more': 'Mostrar {count} más',
  'csv.broker.show-less': 'Mostrar menos',
  'csv.broker.create-new': '+ Crear Nuevo Formato',
  'csv.broker.favorite-selected': 'Tu favorito se selecciona automáticamente',
  'csv.broker.star-hint':
    'Marca un broker como favorito para seleccionarlo automáticamente',
  'csv.broker.hidden-modal-title': 'Brokers Ocultos',
  'csv.broker.no-hidden': 'Sin brokers ocultos',
  'csv.broker.restore': 'Restaurar',
  'csv.broker.restore-all': 'Restaurar Todo',
  'csv.broker.hide-aria': 'Ocultar este broker',
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
  'csv.broker.jdr': 'JDR Securities Limited',

  'csv.account-selector.loading': 'Cargando cuentas...',
  'csv.account-selector.no-accounts': 'No se encontraron cuentas.',
  'csv.account-selector.create-account-hint':
    'Por favor crea una cuenta antes de importar operaciones.',
  'csv.account-selector.create-account-cta': 'Crear Cuenta',
  'csv.account-selector.label': 'Seleccionar Cuenta',
  'csv.account-selector.error.load-failed': 'Error al cargar cuentas',
  'csv.account-selector.favorite.remove': 'Eliminar de favoritos',
  'csv.account-selector.favorite.set': 'Establecer como favorito',
  'csv.account-selector.show-less': 'Mostrar menos',
  'csv.account-selector.show-more': 'Mostrar {count} más',
  'csv.account-selector.favorite.auto-selected':
    'Tu favorito se selecciona automáticamente',
  'csv.account-selector.favorite.star-hint':
    'Marca una cuenta como favorita para seleccionarla automáticamente',

  
  'csv.preview-first-note':
    'Preview is free. Importing into your vault requires PRO activation.',
  'csv.preview.header-row.title': 'Selección de fila de encabezado',
  'csv.preview.header-row.help':
    'Si la primera fila es un título o agrupación, elige la fila que contiene los nombres reales de columnas.',
  'csv.preview.header-row.label': 'Fila de encabezado',
  'csv.preview.header-row.range': 'Elige una fila entre 1 y {max}.',
  'csv.preview.header-row.preview': 'Vista previa del encabezado seleccionado:',
  'csv.gate.import.title': 'PRO required to import',
  'csv.gate.import.description':
    'Importing trades into your vault is a PRO feature. Activate PRO to continue.',
  'csv.gate.templates.tooltip': 'PRO required (activate to use templates).',
  'csv.gate.ai.tooltip': 'PRO required (activate to use AI mapping).',

  
  
  
  'csv.results.import-successful': '¡Importación Exitosa!',
  'csv.results.successfully-imported-prefix': 'Se importaron exitosamente ',
  'csv.results.successfully-imported-suffix': ' operaciones',
  'csv.results.skipped-duplicates-prefix': 'Se omitieron ',
  'csv.results.skipped-duplicates-suffix': ' operaciones duplicadas',
  'csv.results.failed-to-import-prefix': 'Error al importar ',
  'csv.results.failed-to-import-suffix': ' filas (ver detalles abajo)',
  'csv.results.failed-rows-title': 'Filas Fallidas:',
  'csv.results.import-failed': 'Importación Fallida',
  'csv.results.import-error-generic': 'Ocurrió un error durante la importación',
  'csv.results.additional-errors': 'Errores Adicionales:',
  'csv.results.button.view-account': 'Ver Cuenta',
  'csv.results.button.import-another': 'Importar Otro CSV',
  'csv.results.button.try-again': 'Intentar de Nuevo',

  
  
  
  'csv.incomplete-options.title': 'Se Detectó Datos Incompletos de Opciones',
  'csv.incomplete-options.desc-single':
    'Una operación de opciones tiene metadatos requeridos faltantes:',
  'csv.incomplete-options.desc-plural':
    '{count} operaciones de opciones tienen metadatos requeridos faltantes:',
  'csv.incomplete-options.missing-strike-single':
    'operación sin precio de ejercicio',
  'csv.incomplete-options.missing-strike-plural':
    'operaciones sin precio de ejercicio',
  'csv.incomplete-options.missing-expiry-single':
    'operación sin fecha de vencimiento',
  'csv.incomplete-options.missing-expiry-plural':
    'operaciones sin fecha de vencimiento',
  'csv.incomplete-options.missing-option-type-single':
    'operación sin tipo de opción (call/put)',
  'csv.incomplete-options.missing-option-type-plural':
    'operaciones sin tipo de opción (call/put)',
  'csv.incomplete-options.impact-desc':
    'Estas operaciones se importarán sin datos completos de opciones, lo que puede afectar:',
  'csv.incomplete-options.impact-analytics': 'Análisis y filtrado',
  'csv.incomplete-options.impact-pl': 'Cálculos de P&L',
  'csv.incomplete-options.impact-accuracy': 'Precisión del diario de trading',
  'csv.incomplete-options.import-anyway': 'Importar de Todos Modos',
  'csv.incomplete-options.cancel-import': 'Cancelar Importación',

  
  
  
  'csv.image-review.title': 'Revisar Referencias de Imágenes',
  'csv.image-review.summary':
    'Se encontraron {imageCount} referencias de imagen en {tradeCount} operación(es).',
  'csv.image-review.rows': 'Filas: {rows}',
  'csv.image-review.count': '{count} imagen(es)',
  'csv.image-review.import-images': 'Importar Imágenes',
  'csv.image-review.discard-all': 'Descartar Todas las Imágenes',
  'csv.image-review.discard-confirmation':
    '¿Descartar todas las referencias de imagen para esta importación? Las operaciones se importarán sin imágenes.',
  'csv.image-review.confirm-discard': 'Sí, Descartar Todo',

  
  
  
  
  'csv.broker-guide.tradovate.step-1':
    'Navega a la pestaña "Reports" en el sitio web de Tradovate',
  'csv.broker-guide.tradovate.step-2':
    'Haz clic en la pestaña "Orders" (NO en Performance)',
  'csv.broker-guide.tradovate.step-3': 'Haz clic en el botón "Download CSV"',
  'csv.broker-guide.tradovate.warning.emphasis': 'Importante:',
  'csv.broker-guide.tradovate.warning.message':
    'Usa solo la pestaña Orders. La pestaña Performance no es compatible.',
  'csv.broker-guide.tradovate.doc-label': 'Ver guía detallada',

  
  'csv.broker-guide.ibkr.description':
    'Se requiere configuración de Flex Query única',
  'csv.broker-guide.ibkr.step-1':
    'Navega a Performance & Statements → Reports → Flex Queries',
  'csv.broker-guide.ibkr.step-2':
    'Crea una nueva consulta "Trade Confirmation" (selecciona Orders, deselecciona Executions)',
  'csv.broker-guide.ibkr.step-3':
    'Establece formato: CSV, Date "yyyyMMdd", Time "HHmmss"',
  'csv.broker-guide.ibkr.step-4':
    'Ejecuta la consulta y descarga el archivo CSV',
  'csv.broker-guide.ibkr.warning.emphasis': 'Debe usar Orders',
  'csv.broker-guide.ibkr.warning.message':
    '(no Executions) con formato de fecha/hora específico',
  'csv.broker-guide.ibkr.doc-label': 'Ver guía detallada de configuración',

  
  'csv.broker-guide.tradezero.step-1':
    'Exporta el archivo CSV desde la plataforma TradeZero',
  'csv.broker-guide.tradezero.step-2':
    'Verifica que el archivo sea formato CSV (NO XLSX)',
  'csv.broker-guide.tradezero.step-3': 'Importa el archivo abajo',
  'csv.broker-guide.tradezero.warning.emphasis': 'Solo se soporta formato CSV.',
  'csv.broker-guide.tradezero.warning.message':
    'Los archivos Excel (XLSX) no funcionarán.',
  'csv.broker-guide.tradezero.doc-label': 'Ver instrucciones de exportación',

  
  'csv.broker-guide.tradingview.description': 'Solo cuenta de Paper Trading',
  'csv.broker-guide.tradingview.step-1':
    'Haz clic en el tipo de broker "Paper Trading" en TradingView',
  'csv.broker-guide.tradingview.step-2':
    'Haz clic en el botón "Export data..."',
  'csv.broker-guide.tradingview.step-3':
    'Selecciona "Order History" del dropdown',
  'csv.broker-guide.tradingview.warning.emphasis': 'Debe usar Order History.',
  'csv.broker-guide.tradingview.warning.message':
    'Otros tipos de exportación (como Positions u Orders) no funcionarán para importación.',
  'csv.broker-guide.tradingview.doc-label': 'Ver guía detallada',

  
  'csv.broker-guide.bybit.description':
    'Historial de Operaciones de Perpetuals USDT',
  'csv.broker-guide.bybit.step-1':
    'Ve a Bybit → Orders → USDT Perpetual → Trade History',
  'csv.broker-guide.bybit.step-2':
    'Haz clic en el botón "Export" y selecciona rango de fechas',
  'csv.broker-guide.bybit.step-3':
    'Descarga el archivo CSV de Trade History (NO Closed P&L)',
  'csv.broker-guide.bybit.warning.emphasis':
    'Usa la exportación Trade History.',
  'csv.broker-guide.bybit.warning.message':
    'La exportación Closed P&L carece de datos de comisión y rellenos individuales.',
  'csv.broker-guide.bybit.doc-label': 'Ver instrucciones de exportación',

  
  'csv.broker-guide.blofin.description':
    'Exportación de Historial de Órdenes de Blofin (Solo sitio web)',
  'csv.broker-guide.blofin.step-1':
    'Ve a Assets → Order Center → Order History',
  'csv.broker-guide.blofin.step-2':
    'Haz clic en Download, selecciona Futures, y elige rango de fechas (máx 180 días)',
  'csv.broker-guide.blofin.step-3':
    'Haz clic en Export y espera la notificación cuando esté listo',
  'csv.broker-guide.blofin.warning.emphasis': 'Solo sitio web.',
  'csv.broker-guide.blofin.warning.message':
    'La app móvil no soporta exportaciones. Los archivos están disponibles durante 30 días después de exportar.',
  'csv.broker-guide.blofin.doc-label': 'Ver instrucciones de exportación',

  
  'csv.broker-guide.hyperliquid.description':
    'Historial de Operaciones de Perpetuals',
  'csv.broker-guide.hyperliquid.step-1': 'Conecta tu wallet en Hyperliquid',
  'csv.broker-guide.hyperliquid.step-2':
    'Haz clic en la pestaña "Trade history" en la parte inferior de la página',
  'csv.broker-guide.hyperliquid.step-3': 'Haz clic en el botón "Export to CSV"',
  'csv.broker-guide.hyperliquid.warning.emphasis': 'Límite de 10.000 entradas.',
  'csv.broker-guide.hyperliquid.warning.message':
    'Exporta regularmente - las operaciones más antiguas más allá de 10.000 entradas no se pueden recuperar.',
  'csv.broker-guide.hyperliquid.doc-label': 'Ver instrucciones de exportación',

  
  'csv.broker-guide.sierrachart.description':
    'Exportación de Lista de Operaciones de Futuros',
  'csv.broker-guide.sierrachart.step-1':
    'Abre Trade Activity Log (Trade → Trade Activity Log, o Ctrl+Shift+A)',
  'csv.broker-guide.sierrachart.step-2':
    'Haz clic en la pestaña "Trades" en la parte superior de la ventana',
  'csv.broker-guide.sierrachart.step-3':
    'Establece el rango de fechas mediante el botón [DisplaySettings] si es necesario',
  'csv.broker-guide.sierrachart.step-4':
    'Ve a File → Save Log As y guarda como archivo .txt',
  'csv.broker-guide.sierrachart.warning.emphasis':
    'Usa "Save Log As" no "Export".',
  'csv.broker-guide.sierrachart.warning.message':
    'La opción Export guarda precios sin ajustar. Save Log As preserva los precios tal como se muestran.',
  'csv.broker-guide.sierrachart.doc-label': 'Ver documentación de SierraChart',

  
  'csv.broker-guide.motivewave.description':
    'Exporta ejecuciones desde el panel de Cuenta en MotiveWave.',
  'csv.broker-guide.motivewave.step-1':
    'Abre el panel de Cuenta y selecciona la pestaña Executions',
  'csv.broker-guide.motivewave.step-2':
    'Haz clic en el icono Export to CSV encima de la lista de ejecuciones',
  'csv.broker-guide.motivewave.step-3':
    'Configura el rango "Export Executions Since" si es necesario',
  'csv.broker-guide.motivewave.step-4':
    'Guarda el archivo CSV e impórtalo aquí',
  'csv.broker-guide.motivewave.warning.emphasis': 'Nota:',
  'csv.broker-guide.motivewave.warning.message':
    'Algunos brokers solo ofrecen historial limitado de ejecuciones. Exporta con regularidad o usa el portal del broker para operaciones antiguas.',
  'csv.broker-guide.motivewave.doc-label': 'Ver documentación de MotiveWave',

  
  'csv.broker-guide.fxreplay.step-1':
    'Open FX Replay → Analytics and select the session or date range',
  'csv.broker-guide.fxreplay.step-2': 'Click "Export" and choose CSV',
  'csv.broker-guide.fxreplay.step-3':
    'Download the analytics CSV and upload it here',
  'csv.broker-guide.fxreplay.warning.emphasis': 'Pro feature:',
  'csv.broker-guide.fxreplay.warning.message':
    'CSV exports are available from the Analytics page and require a paid plan.',
  'csv.broker-guide.fxreplay.doc-label': 'Open FX Replay export guide',

  
  'csv.broker-guide.atas.description':
    'Exportar estadísticas → pestaña Journal (operaciones emparejadas)',
  'csv.broker-guide.atas.step-1':
    'En ATAS, abre la pestaña Statistics y selecciona RealTime o History (ajusta el rango de fechas si es necesario)',
  'csv.broker-guide.atas.step-2':
    'Haz clic en el icono de engranaje (arriba a la derecha) y elige “Export statistics”',
  'csv.broker-guide.atas.step-3':
    'Sube el archivo XLSX exportado aquí y selecciona ATAS en la lista de brokers',
  'csv.broker-guide.atas.warning.emphasis': 'Importante:',
  'csv.broker-guide.atas.warning.message':
    'No edites el archivo exportado. Journalit conserva los límites de operaciones de la hoja “Journal” y, cuando está disponible, completa la comisión usando ejecuciones coincidentes de la hoja “Executions”.',
  'csv.broker-guide.atas.doc-label': 'Ver instrucciones de exportación de ATAS',

  
  'csv.broker-guide.rithmic.description':
    'Exportación desde R | Trader Pro en Order History / Completed Orders.',
  'csv.broker-guide.rithmic.step-1':
    'Abre Order History en R | Trader Pro y filtra Completed/Filled para tu cuenta y fecha',
  'csv.broker-guide.rithmic.step-2':
    'En Add/Remove Columns, asegúrate de mostrar Side, Symbol, Qty Filled, Avg Fill Price y Fill/Update Time',
  'csv.broker-guide.rithmic.step-3':
    'Haz clic en el icono de Export/Clipboard para guardar CSV, súbelo aquí y selecciona Rithmic',
  'csv.broker-guide.rithmic.warning.emphasis': 'Importante:',
  'csv.broker-guide.rithmic.warning.message':
    'Rithmic solo exporta columnas visibles (y a menudo un solo día por vez). Si faltan columnas, la importación puede fallar.',
  'csv.broker-guide.rithmic.doc-label':
    'Ver guía de exportación de R | Trader Pro',

  
  'csv.broker-guide.jdr.description':
    'Exportación de estado HTML de MetaTrader (reporte estilo MT4).',
  'csv.broker-guide.jdr.step-1':
    'En tu terminal MetaTrader de JDR, abre la pestaña Historial de cuenta / History para el rango de fechas que quieras importar',
  'csv.broker-guide.jdr.step-2':
    'Haz clic derecho dentro de la tabla del historial y elige Save as Report para generar el estado HTML/HTM',
  'csv.broker-guide.jdr.step-3':
    'Sube aquí el estado HTML exportado y selecciona JDR Securities Limited',
  'csv.broker-guide.jdr.warning.emphasis': 'Importante:',
  'csv.broker-guide.jdr.warning.message':
    'Usa la exportación HTML del estado. Las órdenes pendientes/canceladas se ignoran automáticamente y los reportes HTML de MT5 todavía no son compatibles.',
  'csv.broker-guide.jdr.doc-label': 'Ver guías de exportación del broker',

  
  
  
  'csv.title': 'Importar Operaciones desde CSV',
  'csv.subtitle':
    'Carga el archivo CSV de tu broker para importar operaciones a tu diario.',
  'csv.how-to-export': 'Cómo Exportar desde Tu Broker',
  'csv.processing-file': 'Procesando archivo de importación...',
  'csv.importing-trades': 'Importando operaciones a la cuenta...',
  'csv.format': 'Formato de Importación: ',
  'csv.asset-type': 'Tipo de Activo',
  'csv.asset-type-desc':
    'Selecciona el tipo de instrumento en este CSV. Esto determina las especificaciones del contrato y las reglas de validación.',
  'csv.button.export-template': 'Exportar Plantilla',
  'csv.button.delete-template': 'Eliminar Plantilla',
  'csv.button.import-template': 'Importar Plantilla',
  'csv.button.import-rows': 'Importar {count} Filas',
  'csv.button.edit-format': 'Editar Formato',
  'csv.button.continue-mapping': 'Continuar al Mapeo de Columnas',
  'csv.button.update-template': 'Actualizar Plantilla',
  'csv.button.save-template': 'Guardar como Plantilla',
  'csv.button.back': 'Atrás',
  'csv.button.import-another': 'Importar Otro Archivo',
  'csv.button.view-account': 'Ver en Cuenta',
  'csv.results.complete': 'Importación Completa',
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
  'csv.results.skipped-incomplete':
    'Skipped {count} incomplete row(s) (missing required values)',
  'csv.results.custom-field-warnings':
    'Se omitieron {count} valor(es) inválido(s) de campos personalizados',
  'csv.results.custom-field-warnings-header':
    'CLICK TO SEE CUSTOM FIELD WARNINGS ({count})',
  'csv.results.broker': 'Broker: {broker}',
  'csv.results.manual-import': 'Importación Manual',
  'csv.results.preview-header':
    'Operaciones Recientemente Importadas (mostrando {shown} de {total})',
  'csv.results.more-trades.one': 'y {count} operación más...',
  'csv.results.more-trades.few': 'y {count} operaciones más...',
  'csv.results.more-trades.many': 'y {count} operaciones más...',
  'csv.results.more-trades.other': 'y {count} operaciones más...',
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  
  'csv.errors.copy-shareable': 'Copiar informe para compartir',
  'csv.errors.copy-report': 'Copiar informe',
  'csv.errors.copy-detailed': 'Copiar informe detallado',
  'csv.errors.copied': 'Copiado',
  'csv.errors.rows': 'Filas: {rows}',
  'csv.errors.suggestion': 'Sugerencia: ',
  'csv.errors.example': 'Ejemplo: ',
  'csv.errors.raw-errors': 'Errores sin procesar',
  'csv.errors.raw-errors-limit':
    'Mostrando las primeras {shown} de {total} errores',

  'csv.errors.group.missing-value':
    'Falta un valor obligatorio — {field} (columna "{column}")',
  'csv.errors.group.missing-column':
    'Falta una columna obligatoria — {field} (columna "{column}")',
  'csv.errors.group.invalid-date':
    'No se pudo interpretar la fecha (columna "{column}")',
  'csv.errors.group.invalid-number':
    'Número inválido — {field} (columna "{column}")',
  'csv.errors.group.invalid-direction':
    'Dirección inválida (columna "{column}")',
  'csv.errors.group.template-missing-mappings':
    'La plantilla no tiene asignaciones obligatorias de columnas',
  'csv.errors.group.batch-parsing-failed': 'Falló el análisis por lote',
  'csv.errors.group.no-valid-rows': 'No se importaron filas válidas',
  'csv.errors.group.no-trades-parsed': 'No se pudieron analizar operaciones',
  'csv.errors.group.close-only': 'Se omitieron ejecuciones solo de cierre',
  'csv.errors.group.other': 'Otros errores',

  'csv.errors.suggestion.select-date-format':
    'Selecciona un formato de fecha en el paso de mapeo y vuelve a importar.',
  'csv.errors.suggestion.fix-numbers':
    'Comprueba que los valores sean numéricos (sin texto) y que la columna correcta esté asignada.',
  'csv.errors.suggestion.fix-direction':
    'Asegúrate de que la columna Dirección tenga valores Comprar/Vender (o asigna la columna correcta).',
  'csv.errors.suggestion.check-mapping':
    'Revisa el mapeo de columnas y asegúrate de asignar los campos obligatorios.',
  'csv.errors.suggestion.check-broker':
    'Verifica que hayas seleccionado el bróker/plantilla correctos para este CSV.',
  'csv.errors.suggestion.check-raw-errors':
    'Abre "Errores sin procesar" para ver los mensajes exactos y números de fila.',

  
  'csv.report.title.shareable':
    'Importación CSV de Journalit — Informe para compartir',
  'csv.report.title.detailed':
    'Importación CSV de Journalit — Informe detallado',
  'csv.report.time': 'Hora: {time}',
  'csv.report.plugin-version': 'Versión del plugin: {version}',
  'csv.report.file': 'Archivo: {file}',
  'csv.report.account': 'Cuenta: {account}',
  'csv.report.broker': 'Bróker: {broker}',
  'csv.report.template': 'Plantilla: {name}',
  'csv.report.csv-rows': 'Filas CSV: {count}',
  'csv.report.asset-type': 'Tipo de activo: {type}',
  'csv.report.date-format': 'Formato de fecha: {format}',
  'csv.report.header-row': 'Fila de encabezado: {row}',
  'csv.report.result': 'Resultado: {result}',
  'csv.report.imported': 'Importadas: {count}',
  'csv.report.updated': 'Actualizadas: {count}',
  'csv.report.duplicates': 'Duplicados: {count}',
  'csv.report.skipped-incomplete': 'Skipped incomplete rows: {count}',
  'csv.report.errors': 'Errores: {count}',
  'csv.report.custom-field-warnings':
    'Advertencias de campos personalizados: {count}',
  'csv.report.sanitized-note':
    'Nota: Este es un informe para compartir. Puede omitir detalles sensibles.',
  'csv.report.top-issues': 'Problemas principales:',
  'csv.report.issue-groups': 'Grupos de problemas:',
  'csv.report.raw-custom-field-warnings':
    'Advertencias de campos personalizados:',
  'csv.report.raw-errors': 'Errores sin procesar:',
  'csv.report.more-errors': '...y {count} error(es) más',
  'csv.unmapped-symbols.title': 'Símbolos Sin Mapear Detectados',
  'csv.unmapped-symbols.desc-singular':
    'Se encontró un símbolo sin especificaciones de instrumento en tu importación:',
  'csv.unmapped-symbols.desc-plural':
    '{count} símbolos sin especificaciones de instrumento se encontraron en tu importación:',
  'csv.unmapped-symbols.map-label': 'Mapear a símbolo/ticker base:',
  'csv.unmapped-symbols.placeholder': 'ej., ES, NQ, GC',
  'csv.unmapped-symbols.warning':
    'Mapea estos símbolos a especificaciones incorporadas o tus tickers personalizados. Sin especificaciones, las operaciones no tendrán tamaños de tick precisos, dólares por punto, o cálculos de P&L.',
  'csv.unmapped-symbols.validation.not-found':
    'Símbolo "{symbol}" no encontrado en especificaciones de {assetType} o tickers personalizados',
  'csv.unmapped-symbols.notice.fix-errors':
    'Por favor corrige los errores de validación antes de guardar',
  'csv.unmapped-symbols.notice.save-failed': 'Error al guardar mapeos',
  'csv.unmapped-symbols.button.saving': 'Guardando...',
  'csv.unmapped-symbols.button.save': 'Guardar Mapeos',
  'csv.unmapped-symbols.button.skip': 'Omitir',

  
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
  'home.quick-links.all-hidden':
    'Todos los enlaces rápidos están ocultos. Usa "Añadir Widget" para restaurarlos.',
  
  'home.quick-links.add-trade': 'Agregar Operación',
  'home.quick-links.trade-log': 'Registro de Operaciones',
  'home.quick-links.trading-dashboard': 'Panel de Trading',
  'home.quick-links.account-dashboard': 'Panel de Cuentas',
  'home.quick-links.todays-drc': 'DRC de Hoy',
  'home.quick-links.weekly-review': 'Revisión Semanal',
  'home.quick-links.monthly-review': 'Revisión Mensual',
  'home.quick-links.quick-import': 'Quick Import',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.layout-builder': 'Constructor de Diseño',
  'home.quick-links.move-above': 'Mover enlaces rápidos encima de los widgets',
  'home.quick-links.move-below': 'Mover enlaces rápidos debajo de los widgets',

  
  
  
  'home.widget-selector.title': 'Añadir a Inicio',
  'home.widget-selector.section.widgets': 'Widgets',
  'home.widget-selector.section.quick-links': 'Enlaces Rápidos Ocultos',
  'home.widget-selector.restore': 'restaurar',
  'home.widget-selector.empty': 'Todos los widgets han sido agregados',
  'home.widget-selector.hint.navigate': '↑↓ navegar',
  'home.widget-selector.hint.select': '↵ seleccionar',
  'home.widget-selector.hint.close': 'esc cerrar',

  
  'home.period.month': 'Este Mes',
  'home.period.quarter': 'Este Trimestre',
  'home.period.year': 'Este Año',
  'home.period.lifetime': 'Toda la Vida',

  
  'home.aria.filter-period': 'Filtrar por Período',
  'home.aria.filter-trade-types': 'Filtrar tipos de trade',
  'home.aria.add-widget': 'Añadir Widget',
  'home.aria.save-layout': 'Guardar Diseño',
  'home.aria.customize': 'Personalizar',

  
  'home.button.add-widget': 'Añadir Widget',
  'home.trade-types.all': 'Regular + Backtest',

  
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
  'home.widget.embedded-note.select-different': 'Selecciona Una Nota Diferente',
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
    '{label}: {pnl} P&L, {count} operaciones',
  'home.widget.best-hours.trades-count': '{count} operaciones',
  'home.widget.best-hours.win-rate': '{rate}% ganador',

  
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
  'home.widget.setups.no-data': 'Aún no hay setups registrados',
  'home.widget.setups.trades-count': '{count} operaciones',
  'home.widget.setups.win-rate': '{rate}% tasa de ganancia',

  
  'home.widget.weekly.title': 'Esta Semana',
  'home.widget.weekly.no-trades': 'sin operaciones esta semana',
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
    'Calendario mostrando tu actividad de trading del año',

  
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

  
  'home.widget.weekly-summary.name': 'Resumen Semanal',
  'home.widget.weekly-summary.description':
    'Métricas de la semana actual con gráfico de P&L diario',

  
  'home.widget.position-size.name': 'Calculadora de Tamaño de Posición',
  'home.widget.position-size.description':
    'Calcula el tamaño de posición basado en el porcentaje de riesgo',

  
  'home.widget.embedded-note.name': 'Nota Incrustada',
  'home.widget.embedded-note.description':
    'Muestra cualquier nota markdown de tu bóveda',

  
  'home.widget.current-streak.name': 'Racha Actual',
  'home.widget.current-streak.description':
    'Rastrea tus rachas ganadoras y perdedoras',

  
  'home.widget.best-hours.name': 'Mejores Horas',
  'home.widget.best-hours.description':
    'Ve cuándo operas mejor por hora del día',

  
  'home.widget.setup-leaderboard.name': 'Desglose Top',
  'home.widget.setup-leaderboard.description':
    'Compara tus mejores setups, tags, tipos de activo o tickers',

  
  'home.widget.unreviewed-trades.name': 'Operaciones sin Revisar',
  'home.widget.unreviewed-trades.description':
    'Operaciones que necesitan tu revisión',

  
  'home.widget.goals-progress.name': 'Progreso de Metas',
  'home.widget.goals-progress.description':
    'Rastrea el progreso hacia tu meta de trading',

  
  'home.widget.trading-score.name': 'Puntuación de Trading',
  'home.widget.trading-score.description':
    'Puntuación integral de rendimiento con visualización de radar',

  
  'home.widget.aum.name': 'AUM',
  'home.widget.aum.description':
    'Total de activos bajo gestión con tendencia de 7 días',

  
  'home.widget.drawdown-monitor.name': 'Monitor de Drawdown',
  'home.widget.drawdown-monitor.description':
    'Rastrea el estado de drawdown en cuentas con límites configurados',

  
  
  

  
  'weekly.tab.preparation': 'Preparación',
  'weekly.tab.overview': 'Resumen',
  'weekly.tab.review': 'Revisión',

  
  'weekly.review.drcs.title': 'Revisiones Diarias de Esta Semana',
  'weekly.review.drcs.empty':
    'No se encontraron revisiones diarias esta semana',
  'weekly.review.drcs.empty-sub':
    'Crea revisiones diarias durante la semana para verlas resumidas aquí',
  'weekly.review.drcs.mental': 'Mental',
  'weekly.review.drcs.technical': 'Técnico',
  'weekly.review.drcs.view-button': 'Ver DRC',
  'weekly.review.drcs.no-answer': 'Sin respuesta',

  
  'weekly.review.performance.title': 'Autoevaluación de Rendimiento',
  'weekly.review.performance.mental': 'Rendimiento Mental',
  'weekly.review.performance.mental-placeholder':
    'Notas sobre tu rendimiento mental...',
  'weekly.review.performance.technical': 'Ejecución Técnica',
  'weekly.review.performance.technical-placeholder':
    'Notas sobre tu ejecución técnica...',

  
  'weekly.review.questions.title': 'Preguntas de Revisión Semanal',
  'weekly.review.questions.empty': 'No hay preguntas de revisión configuradas',
  'weekly.review.questions.empty-sub':
    'Añade preguntas de revisión en la pestaña de Revisión Semanal',
  'weekly.review.questions.answer-placeholder': 'Tu respuesta aquí...',
  'weekly.review.questions.settings-hint':
    'Las preguntas de revisión se pueden configurar en la pestaña de Revisión Semanal.',

  
  'weekly.review.goals.title': 'Objetivos para la Próxima Semana',
  'weekly.review.goals.empty': 'No hay objetivos para la próxima semana',
  'weekly.review.goals.empty-sub':
    'Define objetivos claros para enfocar tu trading',
  'weekly.review.goals.add-placeholder':
    'Añadir un objetivo para la próxima semana',
  'weekly.review.goals.add-button': 'Añadir Objetivo',

  
  'weekly.preparation.goals.title': 'Objetivos Semanales',
  'weekly.preparation.goals.empty': 'Sin objetivos de la semana anterior',

  
  'weekly.preparation.events.title': 'Eventos Clave',
  'weekly.preparation.events.colour': 'Color:',
  'weekly.preparation.events.day': 'Día:',
  'weekly.preparation.events.day-none': 'Ninguno (opcional)',
  'weekly.preparation.events.notes-placeholder': 'Notas sobre este evento',
  'weekly.preparation.events.add-button': 'Añadir Evento',
  'weekly.preparation.events.event-label': 'Evento',
  'weekly.preparation.events.event-placeholder': 'Selecciona o crea un evento',
  'weekly.preparation.events.empty': 'No hay eventos clave añadidos',
  'weekly.preparation.events.sub-empty':
    'Añade eventos de mercado importantes que puedan impactar tu trading',

  
  'weekly.preparation.forecast.title': 'Pronóstico Semanal',

  
  'weekly.overview.pnl-chart.title': 'P&L Acumulado Semanal',
  'weekly.overview.pnl-chart.empty': 'No hay datos de P&L para mostrar',
  'weekly.overview.pnl-chart.empty-sub':
    'Registra operaciones para ver tu gráfico de P&L acumulado',
  'weekly.overview.drawdown-chart.title': 'Drawdown Semanal',
  'weekly.overview.drawdown-chart.empty':
    'No hay datos de drawdown para mostrar',
  'weekly.overview.drawdown-chart.empty-sub':
    'Registra operaciones para ver tu gráfico de drawdown',

  
  'weekly.overview.performance.title': 'Rendimiento Semanal',
  'weekly.overview.metrics.net-pnl': 'P&L Neto',
  'weekly.overview.metrics.win-rate': 'Tasa de Acierto',
  'weekly.overview.metrics.profit-factor': 'Factor de Beneficio',
  'weekly.overview.metrics.expectancy': 'Expectativa',
  'weekly.overview.metrics.total-trades': 'Total de Operaciones',
  'weekly.overview.metrics.avg-win': 'Ganancia Prom.',
  'weekly.overview.metrics.avg-loss': 'Pérdida Prom.',
  'weekly.overview.metrics.pl-ratio': 'Ratio P/L',

  
  'weekly.overview.setup-performance.title': 'Rendimiento por Setup',
  'weekly.overview.setup-performance.col-setup': 'Setup',
  'weekly.overview.setup-performance.col-pnl': 'P&L',
  'weekly.overview.setup-performance.col-win-rate': 'Acierto %',
  'weekly.overview.setup-performance.col-trades': 'Operaciones',
  'weekly.overview.setup-performance.empty':
    'No hay datos de setup disponibles',
  'weekly.overview.setup-performance.empty-sub':
    'Añade etiquetas de setup a tus operaciones para ver métricas de rendimiento por setup',

  
  'weekly.overview.trades-chart.title': 'Operaciones Semanales',
  'weekly.overview.trades-chart.empty': 'No hay operaciones esta semana',
  'weekly.overview.trades-chart.empty-sub':
    'Registra tus operaciones individuales para verlas visualizadas aquí',

  
  'weekly.overview.best-trade.title': 'Mejor Operación de la Semana',
  'weekly.overview.best-trade.empty':
    'No hay operaciones ganadoras esta semana',
  'weekly.overview.best-trade.empty-sub':
    'Tus mejores operaciones aparecerán aquí para que puedas replicar tu éxito',
  'weekly.overview.worst-trade.title': 'Peor Operación de la Semana',
  'weekly.overview.worst-trade.empty':
    'No hay operaciones perdedoras esta semana',
  'weekly.overview.worst-trade.empty-sub':
    'Tus operaciones menos exitosas aparecerán aquí para ayudarte a aprender y mejorar',

  
  'weekly.overview.daily-performance.title': 'Rendimiento Diario',
  'weekly.overview.daily-performance.col-date': 'Fecha',
  'weekly.overview.daily-performance.col-trades': 'Operaciones',
  'weekly.overview.daily-performance.col-win-rate': 'Acierto%',
  'weekly.overview.daily-performance.col-profit-factor': 'Factor de Beneficio',
  'weekly.overview.daily-performance.col-pnl': 'P&L',
  'weekly.overview.daily-performance.empty': 'No hay operaciones esta semana',
  'weekly.overview.daily-performance.empty-sub':
    'Registra operaciones para ver tu desglose de rendimiento diario',

  
  'weekly.overview.trade.unknown': 'Desconocido',
  'weekly.overview.trade.na': 'N/A',
  'weekly.overview.trade.label-date': 'Fecha:',
  'weekly.overview.trade.label-setup': 'Setup:',
  'weekly.overview.trade.label-duration': 'Duración:',
  'weekly.overview.trade.label-tags': 'Etiquetas:',
  'weekly.overview.trade.label-mistakes': 'Errores:',
  'weekly.overview.trade.duration-format': '{hours}h {minutes}m',

  
  'weekly.overview.button.create-trade': 'Crear Operación',
  'weekly.overview.button.view-trade-details': 'Ver Detalles de Operación',

  
  
  

  
  'monthly.tab.overview': 'Resumen',
  'monthly.tab.review': 'Revisión',

  
  'monthly.review.demon-tracker.title': 'Rastreador de Demonios',
  'monthly.review.demon-tracker.description':
    'Rastrea tus errores recurrentes para identificar patrones y mejorar tu disciplina de trading.',
  'monthly.review.demon-tracker.column.demon': 'DEMONIO',
  'monthly.review.demon-tracker.column.stop-trading': 'DEJAR DE OPERAR',
  'monthly.review.demon-tracker.summary.unique-mistakes':
    'Total de Errores Únicos:',
  'monthly.review.demon-tracker.summary.total-occurrences':
    'Total de Ocurrencias:',
  'monthly.review.demon-tracker.summary.critical-mistakes':
    'Errores Críticos (6+):',
  'monthly.review.demon-tracker.empty': 'No hay errores registrados este mes',
  'monthly.review.demon-tracker.empty-sub':
    'Los errores registrados en tus operaciones aparecerán aquí para ayudar a identificar patrones',

  
  'monthly.review.mental-game-performance': 'Rendimiento del Juego Mental',
  'monthly.review.technical-game-performance': 'Rendimiento del Juego Técnico',

  
  'monthly.overview.cumulative-pnl': 'P&L Acumulado Mensual',
  'monthly.overview.no-pnl-data': 'No hay datos de P&L para mostrar',
  'monthly.overview.no-pnl-data-sub':
    'Registra operaciones para ver tu gráfico de P&L acumulado',
  'monthly.overview.drawdown': 'Drawdown Mensual',
  'monthly.overview.no-drawdown-data': 'No hay datos de drawdown para mostrar',
  'monthly.overview.no-drawdown-data-sub':
    'Registra operaciones para ver tu gráfico de drawdown',

  
  'monthly.overview.performance': 'Rendimiento Mensual',
  'monthly.overview.net-pnl': 'P&L Neto',
  'monthly.overview.win-rate': 'Tasa de Acierto',
  'monthly.overview.profit-factor': 'Factor de Beneficio',
  'monthly.overview.total-trades': 'Total de Operaciones',
  'monthly.overview.setup-performance': 'Rendimiento por Setup',

  
  'monthly.overview.biggest-winner': 'Mayor Ganador de {month}',
  'monthly.overview.biggest-loser': 'Mayor Perdedor de {month}',
  'monthly.overview.label-date': 'Fecha:',
  'monthly.overview.label-setup': 'Setup:',
  'monthly.overview.view-trade-details': 'Ver Detalles de Operación',
  'monthly.overview.no-winning-trades': 'No hay operaciones ganadoras este mes',
  'monthly.overview.no-winning-trades-sub':
    'Tus mejores operaciones aparecerán aquí',
  'monthly.overview.no-losing-trades': 'No hay operaciones perdedoras este mes',
  'monthly.overview.no-losing-trades-sub':
    'Tus peores operaciones aparecerán aquí',

  
  'monthly.overview.weekly-highlights': 'Destacados de Rendimiento Semanal',
  'monthly.overview.best-week': 'Mejor Semana',
  'monthly.overview.worst-week': 'Peor Semana',
  'monthly.overview.week-number': 'Semana {number}',
  'monthly.overview.view-week': 'Ver Semana',

  
  'monthly.overview.long-performance': 'Rendimiento Solo Largos',
  'monthly.overview.no-long-trades': 'No hay operaciones largas este mes',
  'monthly.overview.no-long-trades-sub':
    'Las métricas de rendimiento de tus operaciones largas aparecerán aquí',
  'monthly.overview.short-performance': 'Rendimiento Solo Cortos',
  'monthly.overview.no-short-trades': 'No hay operaciones cortas este mes',
  'monthly.overview.no-short-trades-sub':
    'Las métricas de rendimiento de tus operaciones cortas aparecerán aquí',

  
  'monthly.overview.weekly-breakdown': 'Desglose Semanal',
  'monthly.overview.table-week': 'Semana',
  'monthly.overview.table-trades': 'Operaciones',
  'monthly.overview.table-win-rate': 'Acierto%',
  'monthly.overview.table-profit-factor': 'Factor de Beneficio',
  'monthly.overview.table-pnl': 'P&L',
  'monthly.overview.week-abbrev': 'S{number}',
  'monthly.overview.no-weekly-data': 'No hay datos semanales disponibles',
  'monthly.overview.no-weekly-data-sub':
    'Registra operaciones para ver tu desglose de rendimiento semanal',

  
  'monthly.game.header.week': 'Semana',
  'monthly.game.header.a-games': 'Juegos A',
  'monthly.game.header.b-games': 'Juegos B',
  'monthly.game.header.c-games': 'Juegos C',
  'monthly.game.header.rating': 'Puntuación',
  'monthly.game.header.notes': 'Notas',
  'monthly.game.week-label': 'S{week}',
  'monthly.game.rating-na': 'N/A',
  'monthly.game.no-data':
    'No hay datos de rendimiento disponibles para este mes',

  
  
  

  
  'datepicker.aria.time': 'Hora',
  'datepicker.button.clear': 'Limpiar',
  'datepicker.button.today': 'Hoy',
  'datepicker.button.now': 'Ahora',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'AA',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',

  
  'icon-select.default-title': 'Seleccionar una opción',

  
  'ribbon.open-journalit': 'Abrir Journalit',

  
  'grid.aria.retry': 'Reintentar carga del diseño de cuadrícula',
  'grid.aria.remove-widget': 'Eliminar widget',

  
  'missed-trade.reason-title': 'Por qué perdí esta operación',
  'missed-trade.loading-navigation': 'Cargando navegación...',

  
  'status-bar.update-available': 'Actualización disponible',
  'status-bar.update-aria-label': 'Journalit {version} - Click para ver',

  
  'trade.review.title': 'Revisión de Operación',
  'trade.loading-navigation': 'Cargando navegación...',
  'trade.details.direction': 'Dirección',
  'trade.details.position-size': 'Tamaño de Posición',
  'trade.details.trading-costs': 'Costos de Trading',
  'trade.details.entry-price': 'Precio de Entrada',
  'trade.details.exit-price': 'Precio de Salida',
  'trade.details.entry': 'Entrada',
  'trade.details.exit': 'Salida',
  'trade.details.size': 'Tamaño',
  'trade.details.duration': 'Duración',
  'trade.details.instrument': 'Instrumento',
  'trade.details.exit-time': 'Hora de Salida',
  'trade.details.entry-time': 'Hora de Entrada',
  'trade.details.title': 'Detalles de la Operación',
  'trade.details.thesis': 'Tesis',
  'trade.details.no-thesis': 'No se proporcionó tesis para esta operación',
  'trade.details.add-thesis': "Haz clic en 'Editar' para agregar una tesis",

  
  'trade.metadata.account': 'Cuenta:',
  'trade.metadata.custom-tags': 'Etiquetas Personalizadas:',
  'trade.metadata.setups': 'Setups',
  'trade.metadata.mistakes': 'Errores',

  
  'trade.image.no-images': 'No hay imágenes para esta operación',
  'trade.image.click-edit': 'Haz clic en editar para agregar imágenes',
  'trade.image.alt-prefix': 'Imagen de operación',
  'trade.header.unknown-instrument': 'Instrumento desconocido',

  
  'trade.review.mark-as-reviewed': 'Marcar como Revisado',
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

  
  'forecast.chart-title': 'Gráfico de {title}',
  'forecast.upload-label': 'Subir Gráfico de {title}',
  'forecast.upload-label-plural': 'Subir Gráficos de {title}',
  'forecast.alt-text': 'Pronóstico de {title}',
  'forecast.description': 'Pronóstico de {title}',
  'forecast.notes-placeholder': 'Agrega tus notas de {title} aquí...',

  
  'review.error.failed-to-navigate': 'Error al navegar a la ruta',
  'review.error.update-failed': 'Error al actualizar {name}',
  'review.error.update-file-failed': 'Error al actualizar {name} en el archivo',

  
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
  'release-notes.loading': 'Cargando notas de la versión...',
  'release-notes.no-content': 'No se encontraron notas de la versión',
  'release-notes.current-version': 'Actual: v{version}',
  'release-notes.version': 'Versión {version}',
  'release-notes.link.docs': 'Docs',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',

  
  'shared.goal-tracker.title': 'Objetivos',
  'shared.goal-tracker.empty': 'No se encontraron objetivos',
  'shared.goal-tracker.remove-goal': 'Eliminar objetivo',
  'shared.goal-tracker.add-goal-placeholder': 'Agregar un nuevo objetivo',
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
  'upgrade.benefit.templates':
    'Plantillas personalizadas ilimitadas y compartir plantillas',
  'upgrade.benefit.mt5': 'Sincronización automática con MetaTrader 5',
  'upgrade.benefit.multi-account': 'Soporte multi-cuenta',
  'upgrade.benefit.analytics': 'Analíticas y métricas avanzadas',
  'upgrade.benefit.layouts': 'Diseños de panel personalizados',
  'upgrade.trial-notice':
    'Obtén una prueba gratuita de 2 semanas para importar todas tus operaciones históricas y probar todas las funciones Pro sin riesgo.',

  
  'timeline.trade-type.regular': 'Operación',
  'timeline.trade-type.missed': 'Operación Perdida',
  'timeline.trade-type.backtest': 'Operación de Backtesting',
  'timeline.status.open': 'Abierta',
  'timeline.status.profit': 'Ganancia',
  'timeline.status.loss': 'Pérdida',
  'timeline.status.breakeven': 'Sin Cambio',
  'timeline.aria.trade-status': '{ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.title.current-trade':
    '{tradeType} Actual: {ticker} {tradeType} {tradeNumber}',
  'timeline.title.view-trade':
    'Ver {ticker} {tradeType} {tradeNumber} ({status})',
  'timeline.title.trade-still-open': 'La operación aún está abierta',

  
  'datetime.placeholder.time': '1022p o 10:22 AM',
  'datetime.aria.open-picker': 'Abrir selector de fecha',
  'datetime.error.date-required': 'Fecha requerida',
  'datetime.error.invalid-format': 'Formato inválido',
  'datetime.error.date-6-digits':
    'La fecha debe tener 6 dígitos (formato DDMMAA)',
  'datetime.error.invalid-month': 'Mes inválido',
  'datetime.error.invalid-day': 'Día inválido',
  'datetime.error.invalid-date': 'Fecha inválida',
  'datetime.error.invalid-time-format': 'Formato de hora inválido',
  'datetime.error.time-3-4-digits': 'La hora debe tener 3 o 4 dígitos',
  'datetime.error.hours-1-12': 'Las horas deben ser 1-12 con AM/PM',
  'datetime.error.hours-0-23': 'Las horas deben ser 0-23 en formato 24 horas',
  'datetime.error.minutes-0-59': 'Los minutos deben ser 0-59',

  
  'view.account-page.title': 'Cuenta: {name}',
  'view.account-page.title-default': 'Página de Cuenta',
  'view.account-page.no-account-selected': 'No hay Cuenta Seleccionada',
  'view.account-page.no-account-instructions':
    'Por favor navega a esta página desde el Panel de Cuenta.',
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
  'templateEditor.widget.demon-tracker.count-mode': 'Modo de conteo:',
  'templateEditor.widget.demon-tracker.count-mode.per-trade': 'Por operación',
  'templateEditor.widget.demon-tracker.count-mode.per-trading-day':
    'Por día de trading',
  'templateEditor.widget.demon-tracker.source-mode': 'Modo de fuente:',
  'templateEditor.widget.demon-tracker.source-mode.trades': 'Solo operaciones',
  'templateEditor.widget.demon-tracker.source-mode.session':
    'Solo errores de sesión',
  'templateEditor.widget.demon-tracker.source-mode.combined':
    'Combinado (operaciones + sesión)',

  
  'nav.prev-quarter': 'Trimestre Anterior',
  'nav.prev-year': 'Año Anterior',
  'nav.weekly': 'Revisión Semanal',
  'nav.monthly': 'Revisión Mensual',

  
  'filter.modal.title': 'Filtros Avanzados',
  'filter.modal.active-filters': 'Filtros activos ({count}):',
  'filter.modal.no-active-filters': 'Sin filtros activos',
  'filter.modal.clear-all': 'Limpiar todo',
  'filter.modal.section.trading-data': 'Datos de Trading',
  'filter.modal.section.classification': 'Clasificación',
  'filter.modal.section.trade-criteria': 'Criterios de Operación',
  'filter.modal.no-setup': 'Sin Setup',
  'filter.modal.no-tags': 'Sin Etiquetas',
  'filter.modal.no-mistakes': 'Sin Errores',
  'filter.modal.type.regular': 'Regular',
  'filter.summary.regular-trades': 'Operaciones Regulares',
  'filter.modal.type.missed': 'Perdida',
  'filter.modal.type.backtest': 'Backtesting',
  'filter.modal.status.win': 'Ganancia',
  'filter.modal.status.loss': 'Pérdida',
  'filter.modal.status.breakeven': 'Sin Cambio',
  'filter.modal.status.open': 'Abierta',
  'filter.modal.status.closed': 'Cerrada',
  'filter.modal.section.custom-fields': 'Custom Fields',
  'filter.modal.custom-field.n-selected': '{count} selected',
  'filter.modal.custom-field.none-available': 'No values available',
  'filter.chip.remove-aria': 'Eliminar filtro {label}',

  
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

  
  'image.loading': 'Cargando...',
  'image.load-failed': 'No se pudo cargar la imagen',
  'image.uploader.paste-title': 'Pegar imagen del portapapeles (Ctrl+V)',
  'image.uploader.pasting': 'Pegando...',
  'image.uploader.paste': 'Pegar',
  'image.uploader.url-placeholder': 'Pegar URL de imagen o ruta de archivo...',
  'image.uploader.url-input-aria': 'Campo de URL de imagen',
  'image.uploader.file-upload-aria': 'Subir desde archivo',
  'image.uploader.paste-clipboard-aria': 'Pegar desde portapapeles',
  'image.uploader.error-invalid-url':
    'URL de imagen o ruta de archivo no válida. Ingresa una URL de imagen compatible, una ruta de imagen del vault o un enlace de Excalidraw.',
  'image.viewer.alt-default': 'Imagen',
  'image.viewer.description-default': 'Vista Previa de Imagen',
  'image.viewer.error-load':
    'No se pudo cargar la imagen. El archivo podría faltar o ser inaccesible.',
  'image.viewer.title-fullscreen': 'Click para ver en pantalla completa',
  'image.viewer.zoom-indicator': 'Click o mantén presionado para ampliar',
  'image.viewer.delete-button': 'Eliminar Imagen',
  'image.viewer.nav-prev': 'Imagen anterior',
  'image.viewer.nav-next': 'Imagen siguiente',
  'image.viewer.zoom-in-hint': 'Pellizca o haz click para acercar',
  'image.viewer.zoom-out-hint': '{scale}x (pellizca o haz click para alejar)',
  'image.viewer.no-images': 'No hay imágenes para mostrar',
  'image.viewer.thumbnail-alt': 'Miniatura {n}',
  'image.viewer.close-aria': 'Cerrar pantalla completa',
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
  'library.notice.copied': '¡Código de compartir copiado al portapapeles!',
  'library.error.copy-failed': 'Error al copiar al portapapeles',
  'library.title.import': 'Importar Layout',
  'library.desc.import':
    'Pega un código JRT-v1 para importar una plantilla de otro usuario.',
  'library.label.share-code': 'Código de Compartir',
  'library.placeholder.import-code': 'Pega el código JRT-v1-... aquí',
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
  'metric.expectancy.name': 'Expectativa',
  'metric.expectancy.description':
    'Cantidad promedio ganada o perdida por operación',
  'metric.maxDrawdown.name': 'Max Drawdown',
  'metric.maxDrawdown.description':
    'Largest closed-trade drawdown amount from a prior realized P&L high',
  'metric.bestDay.name': 'Mejor Día',
  'metric.bestDay.description': 'P&L más alto en un solo día',
  'metric.largestWin.name': 'Mayor Ganancia',
  'metric.largestWin.description': 'Operación ganadora más grande',
  'metric.largestLoss.name': 'Mayor Pérdida',
  'metric.largestLoss.description': 'Operación perdedora más grande',
  'metric.longestWinStreak.name': 'Mejor Racha',
  'metric.longestWinStreak.description':
    'Racha consecutiva de ganancias más larga por fecha de salida',
  'metric.longestLossStreak.name': 'Peor Racha',
  'metric.longestLossStreak.description':
    'Racha consecutiva de pérdidas más larga por fecha de salida',
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
  'metric.avgRR.description':
    'Relación promedio de recompensa/riesgo (ganancia promedio / pérdida promedio)',
  'metric.avgRRRiskBased.name': 'RR Promedio (basado en R)',
  'metric.avgRRRiskBased.description':
    'Relación promedio basada en R-múltiplos: R ganador promedio / R perdedor promedio (requiere datos de stop/riesgo)',
  'metric.avgHoldTime.name': 'Tiempo Promedio de Retención',
  'metric.avgHoldTime.description':
    'Tiempo promedio en todas las operaciones cerradas',
  'metric.avgWinHoldTime.name': 'Tiempo Prom. Ganancia',
  'metric.avgWinHoldTime.description':
    'Tiempo promedio en operaciones ganadoras cerradas',
  'metric.avgLossHoldTime.name': 'Tiempo Prom. Pérdida',
  'metric.avgLossHoldTime.description':
    'Tiempo promedio en operaciones perdedoras cerradas',

  'metric.avgWinnerHeat.name': 'Calor Prom. Ganadores',
  'metric.avgWinnerHeat.description':
    'MAE promedio de operaciones ganadoras cerradas, usando la unidad MAE/MFE guardada',
  'metric.winnerMaeP90.name': 'MAE P90 Ganadores',
  'metric.winnerMaeP90.description':
    'Umbral MAE del percentil 90 para operaciones ganadoras cerradas, usando la unidad MAE/MFE guardada',
  'metric.winnerMaeMedian.name': 'MAE Mediana Ganadores',
  'metric.winnerMaeMedian.description':
    'MAE mediano de operaciones ganadoras cerradas, usando la unidad MAE/MFE guardada',
  'metric.avgLossHeat.name': 'Calor Prom. Pérdidas',
  'metric.avgLossHeat.description':
    'MAE promedio de operaciones perdedoras cerradas, usando la unidad MAE/MFE guardada',
  'metric.winnerAvgMfe.name': 'MFE Prom. Ganadores',
  'metric.winnerAvgMfe.description':
    'MFE promedio de operaciones ganadoras cerradas, usando la unidad MAE/MFE guardada',
  'metric.loserAvgMfe.name': 'MFE Prom. Perdedores',
  'metric.loserAvgMfe.description':
    'MFE promedio de operaciones perdedoras cerradas, usando la unidad MAE/MFE guardada',
  'metric.winnerMfeP90.name': 'MFE P90 Ganadores',
  'metric.winnerMfeP90.description':
    'Umbral MFE del percentil 90 para operaciones ganadoras cerradas, usando la unidad MAE/MFE guardada',
  'metric.loserMfeP90.name': 'MFE P90 Perdedores',
  'metric.loserMfeP90.description':
    'Umbral MFE del percentil 90 para operaciones perdedoras cerradas, usando la unidad MAE/MFE guardada',
  'metric.timeInDrawdown.name': 'Time in Drawdown',
  'metric.timeInDrawdown.description':
    'Percentage of elapsed time spent below the prior realized P&L high',
  'metric.avgRecoveryTime.name': 'Avg Recovery Time',
  'metric.avgRecoveryTime.description':
    'Average time it takes closed-trade realized drawdowns to recover to a new high',
  'metric.longestDrawdown.name': 'Longest Realized Drawdown',
  'metric.longestDrawdown.description':
    'Longest elapsed time spent in a realized drawdown episode',
  'metric.drawdownEpisodes.name': 'Drawdown Episodes',
  'metric.drawdownEpisodes.description':
    'Number of realized drawdown periods in the current filtered trade set',
  'metric.category.performance': 'Rendimiento',
  'metric.category.volume': 'Volumen',
  'metric.category.average': 'Promedio',

  
  'template.switch-title': 'Cambiar Layout',
  'template.switch-trade-title': 'Cambiar Layout de Operación',
  'template.switch-review-title': 'Cambiar Layout de {type}',
  'template.no-template': 'Sin plantilla',
  'template.label': 'Plantilla',
  'template.assign-to-note': 'Asignar una plantilla a esta nota',
  'template.switch-action': 'Cambiar layout',
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
  'template.editor.review-title': 'Revisión de Operación',
  'template.editor.built-in-notice':
    'Las plantillas incorporadas no se pueden editar. Duplica esta plantilla o crea una nueva para personalizar.',
  'template.editor.show-review': 'Mostrar Sección de Revisión',
  'template.editor.show-review-desc':
    'Cuándo mostrar la sección de revisión en notas de operación',
  'template.editor.show-review.always': 'Siempre',
  'template.editor.show-review.losses-only': 'Solo Pérdidas',
  'template.editor.show-review.never': 'Nunca',
  'template.editor.show-missed': 'Mostrar para Operaciones Perdidas',
  'template.editor.show-missed-desc':
    'También mostrar sección de revisión en notas de operaciones perdidas',
  'template.editor.show-backtest': 'Mostrar para Operaciones de Backtesting',
  'template.editor.show-backtest-desc':
    'También mostrar sección de revisión en notas de backtesting',
  'template.editor.sections': 'Secciones de Revisión',
  'template.editor.add-section': '+ Agregar Sección',
  'template.editor.no-sections': 'No hay secciones de revisión configuradas.',
  'template.editor.add-section-hint':
    ' Haz click en "+ Agregar Sección" para crear una.',
  'template.editor.win-sections': 'Secciones de Ganancia',
  'template.editor.loss-sections': 'Secciones de Pérdida',
  'template.editor.win-sections-desc':
    'Mostradas en operaciones ganadoras y sin cambio',
  'template.editor.loss-sections-desc': 'Mostradas en operaciones perdedoras',
  'template.editor.section-visibility': 'Visibilidad de Sección',
  'template.editor.nav-bar': 'Barra de Navegación',
  'template.editor.nav-bar-desc':
    'Mostrar línea de tiempo de operaciones y enlaces de revisión',
  'template.editor.images': 'Imágenes',
  'template.editor.images-desc': 'Mostrar imágenes de gráficos de operación',
  'template.editor.metadata': 'Metadatos',
  'template.editor.metadata-desc': 'Mostrar cuentas, setups y errores',
  'template.editor.details': 'Detalles de Operación',
  'template.editor.details-desc': 'Mostrar detalles de entrada, salida y P&L',
  'template.editor.review-button': 'Botón Marcar Revisado',
  'template.editor.review-button-desc':
    'Mostrar botón para marcar operación como revisada',
  'template.editor.section-type': 'Tipo de Sección',
  'template.editor.type.textarea': 'Área de Texto',
  'template.editor.type.checkbox': 'Casilla Individual',
  'template.editor.type.checkboxList': 'Lista de Casillas',
  'template.editor.type.header': 'Encabezado',
  'template.editor.title-label': 'Título (soporta **markdown**)',
  'template.editor.title-placeholder': 'Título de sección',
  'template.editor.content-label': 'Contenido (soporta markdown)',
  'template.editor.content-placeholder': 'Contenido del encabezado',
  'template.editor.checkbox-label': 'Etiqueta de Casilla (soporta markdown)',
  'template.editor.checkbox-placeholder': 'Etiqueta de casilla',
  'template.editor.placeholder-label': 'Texto de Marcador de Posición',
  'template.editor.placeholder-hint': 'Texto mostrado cuando está vacío',
  'template.editor.items-label': 'Elementos de Casilla',
  'template.editor.item-n': 'Elemento {n}',
  'template.editor.add-item': '+ Agregar Elemento',
  'template.editor.preview-fallback': 'sección de {type}',

  
  
  
  'onboarding.welcome.title': 'Bienvenido a Journalit',
  'onboarding.welcome.subtitle':
    'Posee tus datos de trading. Da forma a tu propio flujo de trabajo.',
  'onboarding.welcome.cta': 'Comenzar',
  'onboarding.welcome.chart.week': 'Semana {count}',
  'onboarding.view.title': 'Onboarding de Journalit',
  'onboarding.wizard.skip-aria': 'Saltar este paso',
  'onboarding.wizard.skip-onboarding': 'Saltar incorporación',

  'onboarding.common.continue': 'Continuar',
  'onboarding.common.close': 'Cerrar',
  'onboarding.features.title':
    'Selecciona lo que se ajusta a tu flujo de trabajo.',
  'onboarding.features.feature.mt5-sync.label': 'Sincronización MT5',
  'onboarding.features.feature.mt5-sync.description':
    'Importa operaciones automáticamente desde MetaTrader 5',
  'onboarding.features.feature.csv-import.label': 'Trade Import',
  'onboarding.features.feature.csv-import.description':
    'Importa operaciones de cualquier bróker mediante Trade Import',
  'onboarding.features.feature.manual-entry.label': 'Entrada manual',
  'onboarding.features.feature.manual-entry.description':
    'Registra operaciones manualmente con control total',
  'onboarding.features.feature.analytics.label': 'Analítica e insights',
  'onboarding.features.feature.analytics.description':
    'Métricas de rendimiento, gráficos y estadísticas de operaciones',
  'onboarding.features.feature.account-tracking.label':
    'Seguimiento de cuentas',
  'onboarding.features.feature.account-tracking.description':
    'Seguimiento de múltiples cuentas de prop firm y personales',
  'onboarding.features.feature.trade-journal.label': 'Constructor de diseños',
  'onboarding.features.feature.trade-journal.description':
    'Crea diseños personalizados de revisión con widgets, gráficos y notas',
  'onboarding.features.feature.ai-trading-assistant.label':
    'Asistente de trading con IA',
  'onboarding.features.feature.ai-trading-assistant.description':
    'Reconocimiento de patrones, insights y orientación personalizada',
  'onboarding.features.badge.coming-soon': 'Próximamente',
  'onboarding.features.badge.pro': 'PRO',
  'onboarding.features.trial.pro':
    'Las funciones PRO incluyen una prueba gratuita de 14 días',

  
  
  
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

  'onboarding.features.graphic.syncing': 'Sincronizando operaciones...',
  'onboarding.features.graphic.complete': 'Sincronización completa',
  'onboarding.features.graphic.direction.long': 'LARGO',
  'onboarding.features.graphic.direction.short': 'CORTO',
  'onboarding.features.graphic.status.win': 'GANADA',
  'onboarding.features.graphic.status.loss': 'PÉRDIDA',

  'onboarding.activation.title': 'Inicia sesión en Journalit',
  'onboarding.activation.subtitle':
    'Completa la autenticación en tu navegador para acceder a tu cuenta',
  'onboarding.activation.status.initializing':
    'Generando tu código de autenticación...',
  'onboarding.activation.status.waiting': 'Esperando el inicio de sesión...',
  'onboarding.activation.status.expired': 'Código expirado',
  'onboarding.activation.status.denied': 'Inicio de sesión denegado',
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
  'onboarding.activation.notice.popup-blocked-copied':
    'Ventana emergente bloqueada. La URL de activación se copió al portapapeles; pégala en tu navegador.',
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
  'onboarding.activation.success.subtitle':
    'Ya estás conectado a tu cuenta de Journalit',
  'onboarding.activation.features.title': 'Funciones disponibles:',
  'onboarding.activation.features.sync':
    'Sincroniza operaciones entre dispositivos',
  'onboarding.activation.features.analytics': 'Analíticas avanzadas e informes',
  'onboarding.activation.features.mt5': 'Sincronización MT5',
  'onboarding.activation.features.csv': 'Trade Import inteligente',
  'onboarding.activation.auto-advance':
    'Continuando automáticamente en 10 segundos...',
  'onboarding.activation.skip': 'Activar más tarde',
  'onboarding.notice.complete-failed':
    'No se pudo guardar la finalización del onboarding. Inténtalo de nuevo más tarde.',
  'onboarding.notice.skip-failed':
    'No se pudo guardar el salto del onboarding. Inténtalo de nuevo más tarde.',

  'onboarding.progress.aria-label': 'Paso {current} de {total}',
  'onboarding.progress.step': 'Paso {step}',
  'onboarding.progress.status.completed': ' (completado)',
  'onboarding.progress.status.current': ' (actual)',
  'onboarding.progress.announcement':
    'Paso {current} de {total} completado{label}',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description':
    'Exportación CSV del widget Fills',
  'csv.broker-guide.tradingtechnologies.step-1':
    'Abre el widget Fills en TT y cambia a la vista Detail, Continuous o Price with Detail',
  'csv.broker-guide.tradingtechnologies.step-2':
    'Haz clic derecho dentro del widget Fills, selecciona “Request download” y elige el rango de tiempo',
  'csv.broker-guide.tradingtechnologies.step-3':
    'Cuando TT muestre la notificación de descarga lista, descarga el CSV e impórtalo aquí',
  'csv.broker-guide.tradingtechnologies.warning.emphasis': 'Importante:',
  'csv.broker-guide.tradingtechnologies.warning.message':
    'No edites el archivo exportado ni el orden de columnas antes de importarlo.',
  'csv.broker-guide.tradingtechnologies.doc-label':
    'Ver instrucciones de exportación de Trading Technologies',
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
  'navigation.items.nav-home': 'Inicio',
  'navigation.items.nav-dashboard': 'Panel de trading',
  'navigation.items.nav-trade-log': 'Registro de trades',
  'navigation.items.nav-account-dashboard': 'Panel de cuentas',
  'navigation.items.nav-drc': 'DRC de hoy',
  'navigation.items.nav-weekly': 'Revisión de esta semana',
  'navigation.items.nav-monthly': 'Revisión de este mes',
  'navigation.items.nav-quarterly': 'Revisión de este trimestre',
  'navigation.items.nav-yearly': 'Revisión de este año',
  'navigation.items.nav-add-trade': 'Añadir trade',
  'navigation.items.nav-layout-builder': 'Constructor de diseño',
  'navigation.items.nav-quick-import': 'Importación rápida',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-position-size': 'Calculadora de tamaño de posición',
  'settings.general.navigation-sidebar': 'Barra lateral de navegación',
  'navigation.setting.tab-behavior': 'Comportamiento de pestaña de navegación',
  'navigation.setting.tab-behavior.desc':
    'Cómo abrir vistas al hacer clic en la barra lateral de navegación',
  'navigation.setting.tab-behavior.new-tab': 'Abrir en nueva pestaña',
  'navigation.setting.tab-behavior.replace': 'Reemplazar pestaña activa',
  'navigation.search.placeholder': 'Buscar trades y revisiones...',
  'navigation.search.clear': 'Borrar búsqueda',
  'navigation.search.section.trades': 'Trades',
  'navigation.search.section.reviews': 'Revisiones',
  'navigation.search.empty': 'No se encontraron resultados',
  'navigation.search.trade-open': 'Abierto',
  'navigation.search.review.drc': 'Revisión diaria',
  'navigation.search.review.weekly': 'Revisión semanal',
  'navigation.search.review.monthly': 'Revisión mensual',
  'navigation.search.review.quarterly': 'Revisión trimestral',
  'navigation.search.review.yearly': 'Revisión anual',
  'command.open-navigation-sidebar': 'Abrir barra lateral de navegación',
  'command.open-calendar-sidebar': 'Abrir barra lateral del calendario',

  'widget.directional-drawdown.name': 'Directional Realized Drawdown',
  'widget.directional-drawdown.description':
    'Separate long and short closed-trade drawdown amount curves',

  'widget.long-drawdown.name': 'Long Realized Drawdown',
  'widget.long-drawdown.description':
    'Closed-trade drawdown amount curve for long trades only',
  'widget.short-drawdown.name': 'Short Realized Drawdown',
  'widget.short-drawdown.description':
    'Closed-trade drawdown amount curve for short trades only',
  'widget.directional-drawdown.title.long': 'Long Realized Drawdown',
  'widget.directional-drawdown.title.short': 'Short Realized Drawdown',
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

  'widget.longDrawdownChart.name': 'Long Realized Drawdown',
  'widget.longDrawdownChart.description':
    'Displays the closed-trade drawdown amount curve for long trades only',
  'widget.shortDrawdownChart.name': 'Short Realized Drawdown',
  'widget.shortDrawdownChart.description':
    'Displays the closed-trade drawdown amount curve for short trades only',
  'widget.drawdownStats.name': 'Realized Drawdown Stats',
  'widget.drawdownStats.description': 'Realized drawdown and recovery stats',
  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',

  'guide.skip-guide': 'Skip Guide',
  
  'onboarding.welcome.discover-heading': 'Lo que descubrirás:',
  'onboarding.welcome.tagline':
    'Te ayudamos a configurarlo en menos de 60 segundos',
  'onboarding.activation.button.copy-link': 'Copiar enlace',
  'onboarding.welcome.insight.win-rate.title': 'Análisis de tasa de acierto',
  'onboarding.welcome.insight.win-rate.content':
    '"Tus setups de ruptura tienen una tasa de acierto del 82 % frente al 67 % de los pullbacks"',
  'onboarding.welcome.insight.timing.title': 'Patrones de timing',
  'onboarding.welcome.insight.timing.content':
    '"Los trades mantenidos entre 2 y 4 horas muestran una relación riesgo-beneficio 3 veces mejor que los scalps"',
  'onboarding.welcome.insight.psychology.title': 'Seguimiento psicológico',
  'onboarding.welcome.insight.psychology.content':
    '"Tomas beneficios un 15 % demasiado pronto cuando vas ganando más de 500 $"',
  'onboarding.welcome.trust.data-ownership':
    'Tus datos, tu dispositivo: propiedad y control completos',
  'onboarding.welcome.trust.any-broker':
    'Funciona con cualquier broker: sincronización con MetaTrader + entrada manual',
  'onboarding.welcome.trust.customizable':
    'Totalmente personalizable: registra lo que importa para ti',
  'onboarding.wizard.cancelled-announcement':
    'Onboarding cancelado. Puedes repetirlo más tarde desde la paleta de comandos buscando "Journalit: Replay Onboarding".',
  'onboarding.wizard.error.next-step': 'No se pudo ir al siguiente paso',
  'onboarding.wizard.error.prev-step': 'No se pudo volver al paso anterior',
  'onboarding.wizard.error.trade-service': 'TradeService no está disponible',
  'onboarding.wizard.error.account-service':
    'AccountPageService no está disponible',
  'onboarding.wizard.error.create-sample-trade':
    'No se pudo crear el trade de ejemplo',
  'onboarding.wizard.error.auth-failed':
    'No se pudo completar la autenticación',
  'onboarding.wizard.error.backend-service':
    'El servicio de integración backend no está disponible',
  'onboarding.wizard.error.sign-in-required':
    'Inicia sesión para generar credenciales FTP',
  'onboarding.wizard.error.ftp-generation':
    'No se pudieron generar las credenciales FTP',
  'onboarding.wizard.notice.sample-trade-created':
    'Trade de ejemplo creado correctamente. Lo encontrarás en tu vault.',
  'onboarding.wizard.notice.auth-success':
    'Autenticación completada. Ya puedes acceder a las funciones Pro.',
  'onboarding.wizard.notice.ftp-generated':
    'Credenciales FTP generadas correctamente.',
  'onboarding.wizard.notice.password-masked':
    'La contraseña está oculta y no se puede copiar. Regenera las credenciales FTP.',
  'onboarding.wizard.notice.copied': '{label} copiado al portapapeles.',
  'onboarding.wizard.notice.copy-failed': 'No se pudo copiar {label}',
  'onboarding.wizard.unknown-step.title': 'Paso desconocido',
  'onboarding.wizard.unknown-step.description':
    'Encontramos un paso inesperado en el proceso de onboarding.',
  'onboarding.wizard.footer-default':
    'Completa la configuración para empezar con Journalit',
  'onboarding.wizard.skip-step': 'Omitir paso',
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
    'Este widget solo está disponible en revisiones semanales',
  'templateEditor.widget.weekly-drc-day-label': 'Día',
  'templateEditor.widget.weekly-drc-display-label': 'Visualización',
  'templateEditor.widget.weekly-drc-start-collapsed': 'Iniciar contraído',
  'templateEditor.widget.weekly-drc-day-all': 'All days',
  'templateEditor.widget.weekly-drc-style-card': 'Tarjeta',
  'templateEditor.widget.weekly-drc-style-accordion': 'Accordion',
  'templateEditor.widget.weekly-drc-default-expanded': 'Expanded by default',
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
  'widget.stats.vs-prev': 'vs prev',
  'dashboard.metrics.past-30d': 'past 30d',
  'widget.stats.no-change': 'No change',
  'widget.stats.no-previous-data': 'No previous data',

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

  'calendar.aria.open-daily-review': 'Abrir revisión diaria para {date}',
  'calendar.aria.open-weekly-review': 'Abrir revisión semanal para {date}',
  'trade.header.aria.status': 'Estado de la operación: {status}',
  'csv.mapper.aria.map-column': 'Asignar columna {header}',
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
  'quick-import.message.no-importable':
    'No importable trades were found. Review this file in Trade Import for details.',
  'quick-import.notice.consent-required':
    'Acknowledge processing before uploading.',
  'quick-import.consent':
    'I understand this file will be uploaded to Journalit servers for processing.',
  'quick-import.privacy-note':
    'Los archivos se suben a los servidores de Journalit para procesarse y no se almacenan de forma predeterminada.',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',
  'quick-import.status.loading': 'Loading quick setup...',
  'quick-import.status.checking-subscription':
    'Comprobando el estado de la suscripción...',
  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
  'quick-import.processing.sent-to-server':
    'Uploaded to Journalit for private processing',
  'quick-import.file.selected': 'Selected file',
  'quick-import.file.processed': 'Processed and ready to write to your vault',
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
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import': 'Import trades',
  'quick-import.action.import-count': 'Import {count} trades',
  'quick-import.preview.more': '+ {count} more processed trades',

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
  'trade-import.guide.prompt': '¿No sabes qué exportar?',
  'trade-import.guide.link': 'Ver guía del broker',
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
  'trade-import.table.date': 'Date',
  'trade-import.table.position': 'Position',
  'trade-import.table.result': 'Result',
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

export default es;
