<div align="center">

<img
  src="https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/journalit-logo.png"
  alt="Journalit"
  width="420"
  style="max-width: 100%; height: auto;"
/>

Diario de trading local-first para Obsidian.

[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-purple?style=flat-square&logo=obsidian)](https://obsidian.md/)
[![Docs](https://img.shields.io/badge/docs-journalit.co-0B7285?style=flat-square&logo=readthedocs&logoColor=white)](https://journalit.co/docs)
[![Discord](https://img.shields.io/badge/discord-join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/AkSw3D9h8b)

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.hi.md">हिन्दी</a> |
  <a href="README.ta.md">தமிழ்</a> |
  <a href="README.ar.md">العربية</a>
</p>

[Instalación](#installation) · [Apps de IA (MCP)](#ai-apps-mcp) · [Brokers compatibles](#supported-brokers) · [Privacidad](PRIVACY.md)

</div>

![Home View](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/home-view.png)

<a id="installation"></a>

## Instalación

Instala Journalit desde los plugins de la comunidad de Obsidian:

1. Abre **Ajustes → Plugins de la comunidad → Explorar**
2. Busca `Journalit`
3. Haz clic en **Instalar** y luego en **Activar**

Página de la comunidad: https://community.obsidian.md/plugins/journalit

## Aspectos destacados

- **Local-first**: el diario principal permanece dentro de tu bóveda de Obsidian.
- **Panel Home View**: widgets arrastrables y mapa de calor de trading.
- **Panel de trading**: sigue el rendimiento y los patrones de un vistazo.
- **[Prop challenges](https://journalit.co/docs/prop-challenges)**: sigue las fases de evaluación y funded, el drawdown, la pérdida diaria, los objetivos de beneficio y las reglas de pago, con perfiles de firmas para configurarlas.
- **Sistema de revisión (V2)**: plantillas diarias → anuales con constructor de diseños.
- **[Trade Import](https://journalit.co/csv-import)**: importaciones con backend para CSV, hojas de cálculo, HTML y extractos de brokers.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: sincronización automática de operaciones para brokers compatibles.
- **[Apps de IA (MCP)](https://journalit.co/docs/ai-apps)**: conecta tu app de IA para analizar operaciones, redactar revisiones y actualizar tu diario.

<a id="screenshots"></a>

## Capturas

### Panel de trading

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setups

![Resumen de setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Pares de setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Comparación de setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Cuentas y prop challenges

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

### Constructor de diseños

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Registro de operaciones y galería

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Galería](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

<a id="ai-apps-mcp"></a>

## Apps de IA (MCP)

Conecta Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot u otra app compatible a tu diario mediante MCP (Model Context Protocol). Pídele que analice tus operaciones, redacte una revisión semanal o actualice campos del diario sin copiar notas en un chat.

1. Inicia sesión en Journalit desde Obsidian. Abre **Ajustes → Journalit → Apps de IA (MCP)** y activa **Activar acceso MCP**.
2. Añade `https://api.journalit.co/mcp` como servidor MCP remoto en tu app de IA.
3. Inicia sesión en Journalit cuando se te solicite, elige tu bóveda, revisa los permisos solicitados y aprueba la conexión.

Mantén Obsidian abierto con Journalit en ejecución. De forma predeterminada, las eliminaciones, fusiones y cambios de gran alcance requieren tu aprobación.

Consulta la **[guía de configuración de apps de IA](https://journalit.co/docs/ai-apps)** para ver los pasos de cada cliente, los permisos, cómo deshacer cambios y los límites de uso mensuales.

<a id="supported-brokers"></a>

## Brokers compatibles

Trade Sync crea una conexión continua. Trade Import lee archivos exportados. Que una fuente admita uno no implica que admita el otro.

### Trade Sync automático

- [MetaTrader 4](https://journalit.co/docs/trade-sync-metatrader)
- [Tradovate](https://journalit.co/docs/trade-sync-tradovate)
- [cTrader](https://journalit.co/docs/trade-sync-ctrader)
- [Hyperliquid](https://journalit.co/docs/trade-sync-hyperliquid): perpetuos liquidados en USDC, con acceso de solo lectura

[Rithmic Trade Sync](https://journalit.co/docs/trade-sync-rithmic) es una versión preliminar solo para testers aprobados. Los extractos de MetaTrader 5 se importan con Trade Import, no con Trade Sync basado en FTP.

### Trade Import desde archivos

Fuentes y formatos de exportación compatibles:

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- TradingView: [historial de órdenes de Paper Trading](https://journalit.co/docs/broker-guides-tradingview) y List of Trades de Strategy Tester (backtests)
- [Bybit](https://journalit.co/docs/broker-guides-bybit)
- [BloFin](https://journalit.co/docs/broker-guides-blofin)
- [Hyperliquid](https://journalit.co/docs/broker-guides-hyperliquid)
- [Sierra Chart](https://journalit.co/docs/broker-guides-sierrachart)
- [MotiveWave](https://journalit.co/docs/broker-guides-motivewave)
- [FX Replay](https://journalit.co/docs/broker-guides-fxreplay)
- [ATAS](https://journalit.co/docs/broker-guides-atas)
- [Trading Technologies (TT)](https://journalit.co/docs/broker-guides-tradingtechnologies)
- [Rithmic](https://journalit.co/docs/broker-guides-rithmic)
- [MetaTrader 4/5](https://journalit.co/docs/broker-guides-jdr)
- [DeepCharts](https://journalit.co/docs/broker-guides-deepcharts): Trade List de Strategy Report
- [Breakout Terminal](https://journalit.co/docs/broker-guides-breakout-terminal): `trades.csv`
- Merrill Edge: actividad de la cuenta en CSV
- PropReports: informe Executions de acciones

Usa Manual Mapping para otros archivos compatibles. Consulta el [resumen de Trade Import](https://journalit.co/csv-import) y la guía de cada fuente para saber qué exportación necesitas.

¿Falta tu broker? Únete a [Discord](https://discord.gg/AkSw3D9h8b) y dinos cuál quieres ver.

<details>
<summary>Palabras clave de búsqueda</summary>

Palabras clave: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, Trade Import, Trade Sync, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown, prop challenge, evaluation, funded phase, payout rules, daily loss limit

IA: MCP, Model Context Protocol, Obsidian MCP, AI trading journal, AI-assisted journaling, Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot

Brokers y plataformas: MetaTrader, MetaTrader 4, MT4 sync, MetaTrader 5 imports, IBKR, Interactive Brokers, Tradovate, cTrader, Hyperliquid, Rithmic, TopStepX, TradeZero, TradingView, TradingView Strategy Tester, Bybit, BloFin, Sierra Chart, MotiveWave, FX Replay, ATAS, Trading Technologies, DeepCharts, Breakout Terminal, Merrill Edge, PropReports

</details>

<details>
<summary>Más recursos</summary>

- [Cómo funciona (local-first)](https://journalit.co/obsidian-trading-journal)
- [Resumen de Trade Import](https://journalit.co/csv-import)
- [Resumen de sincronización MetaTrader](https://journalit.co/metatrader-trading-journal)
- [Comparar con otros diarios](https://journalit.co/compare)
- [Guía de prop challenges](https://journalit.co/docs/prop-challenges)

</details>

## Avisos importantes

- **Núcleo local-first**: el diario principal funciona sin conexión y guarda tus notas y operaciones en tu bóveda de Obsidian.
- **Cuenta necesaria para acceso completo**: se requiere una cuenta de Journalit para funciones con autenticación y suscripción.
- **Funciones de pago**: se requiere una suscripción Pro para Trade Sync, confirmar importaciones con Trade Import, el calendario económico y los perfiles de prop firms precompletados. Los usuarios gratuitos que hayan iniciado sesión pueden analizar archivos de Trade Import y ver su vista previa.
- **Uso de red**: Journalit comprueba de forma predeterminada metadatos públicos de versiones de GitHub para buscar actualizaciones, sin enviar datos del vault ni de la cuenta. Las funciones con sesión iniciada pueden usar servicios de Journalit; la sincronización MT4 usa FTP gestionado y la conversión de divisas puede usar un servicio externo de tipos de cambio. Consulta [PRIVACY.md](PRIVACY.md).
- **Acceso opcional de IA**: al activar MCP y autorizar una app de IA, los datos solicitados del diario se comparten con ella a través de los servicios de Journalit. Los datos que lea quedan sujetos a las condiciones de privacidad del proveedor de IA. Puedes desconectar la app o desactivar MCP en cualquier momento.
- **Procesamiento de Trade Import**: el análisis y la vista previa envían el archivo seleccionado y las opciones de importación a Journalit. Las capturas de diagnóstico cifradas en el servidor caducan tras 1 día para cuentas gratuitas o 14 días para Pro; las vistas previas guardadas caducan tras 7 días. Las indicaciones de compatibilidad se devuelven en esas respuestas y se muestran localmente, sin una carga adicional de informes de errores desde el cliente. Consulta [PRIVACY.md](PRIVACY.md).
- **Otros diagnósticos de red**: el código existente de Tradovate Sync envía eventos de diagnóstico de sincronización del cliente según lo descrito en [PRIVACY.md](PRIVACY.md), por separado de Trade Import. Los botones de mejora del plan abren journalit.co solo al hacer clic, con parámetros de campaña fijos, sin identificadores, para la atribución en el servidor.
- **Código disponible, licencia propietaria**: el plugin es software propietario con código revisable.
- **Detalles de privacidad**: consulta [PRIVACY.md](PRIVACY.md) para obtener información sobre el tratamiento, la retención y la infraestructura de los datos.

## Licencia

Este plugin es software propietario con código disponible. El código se publica para revisión de Obsidian e inspección de usuarios, pero no tiene licencia de código abierto. Consulta LICENSE para los usos permitidos.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
