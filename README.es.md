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
  <a href="README.ta.md">தமிழ்</a>
</p>

[Instalación](#installation) · [Brokers compatibles](#supported-brokers) · [Privacidad](PRIVACY.md)

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
- **Panel de cuentas**: creado para objetivos de beneficio y drawdowns de prop firms.
- **Sistema de revisión (V2)**: plantillas diarias → anuales con constructor de diseños.
- **[Trade Import](https://journalit.co/csv-import)**: importaciones con backend para CSV, hojas de cálculo, HTML y extractos de brokers.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: sincronización automática de operaciones para brokers compatibles.

## Avisos importantes

- **Núcleo local-first**: el diario principal funciona sin conexión y guarda tus notas y operaciones en tu bóveda de Obsidian.
- **Cuenta necesaria para acceso completo**: se requiere una cuenta de Journalit para funciones con autenticación y suscripción.
- **Funciones de pago**: se requiere una suscripción Pro para acceso completo a funciones Pro como Trade Sync y Trade Import.
- **Uso de red**: Journalit comprueba de forma predeterminada metadatos públicos de versiones de GitHub para buscar actualizaciones, sin enviar datos del vault ni de la cuenta. Las funciones con sesión iniciada pueden usar servicios de Journalit; la sincronización MT4 usa FTP gestionado y la conversión de divisas puede usar un servicio externo de tipos de cambio. Consulta [PRIVACY.md](PRIVACY.md).
- **Código disponible, licencia propietaria**: el plugin es software propietario con código revisable.
- **Detalles de privacidad**: consulta [PRIVACY.md](PRIVACY.md) para obtener información sobre el tratamiento, la retención y la infraestructura de los datos.

<a id="screenshots"></a>

## Capturas

### Panel de trading

![Trading Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setups

![Resumen de setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Pares de setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![Comparación de setups](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Constructor de diseños

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Layout Builder](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Registro de operaciones y galería

![Trade Log](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Galería](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

### Panel de cuentas

![Account Dashboard](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

### Páginas de cuenta

![Account Pages](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

<a id="supported-brokers"></a>

## Brokers compatibles

Formatos de importación de brokers compatibles:

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- [TradingView](https://journalit.co/docs/broker-guides-tradingview)
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

¿Falta tu broker? Únete a [Discord](https://discord.gg/AkSw3D9h8b) y dinos cuál quieres ver.

<details>
<summary>Palabras clave de búsqueda</summary>

Keywords: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, MetaTrader, MT4 sync, MT5 sync, Trade Import, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown

</details>

<details>
<summary>Más recursos</summary>

- [Cómo funciona (local-first)](https://journalit.co/obsidian-trading-journal)
- [Resumen de Trade Import](https://journalit.co/csv-import)
- [Resumen de sincronización MetaTrader](https://journalit.co/metatrader-trading-journal)
- [Comparar con otros diarios](https://journalit.co/compare)

</details>

## Licencia

Este plugin es software propietario con código disponible. El código se publica para revisión de Obsidian e inspección de usuarios, pero no tiene licencia de código abierto. Consulta LICENSE para los usos permitidos.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
