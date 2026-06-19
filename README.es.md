<div align="center">

<img
  src="https://github.com/user-attachments/assets/ab7232d4-1352-4658-a284-86029c0246f1"
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
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[Instalación](#installation) · [Brokers compatibles](#supported-brokers) · [Privacidad](PRIVACY.md)

</div>

![Home View](https://github.com/user-attachments/assets/1d82c43a-9235-4659-85c2-eedf46bd34ac)

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
- **[Sincronización MetaTrader 4/5](https://journalit.co/metatrader-trading-journal)**: importación automática de operaciones mediante FTP.

## Avisos importantes

- **Núcleo local-first**: el diario principal funciona sin conexión y guarda tus notas y operaciones en tu bóveda de Obsidian.
- **Cuenta necesaria para acceso completo**: se requiere una cuenta de Journalit para funciones con autenticación y suscripción.
- **Funciones de pago**: se requiere una suscripción Pro para acceso completo a funciones Pro como la sincronización con MetaTrader y Trade Import.
- **Uso opcional de red**: el plugin solo usa servicios de red de Journalit cuando eliges funciones respaldadas por red. Iniciar sesión contacta con Journalit para verificación de correo, validación de tokens y estado de suscripción. Si usas MetaTrader sync o Trade Import, el plugin también se conecta a la API backend de Journalit para coordinación, obtención de operaciones e importación opcional, y MetaTrader sync usa infraestructura FTP gestionada por Journalit. Journalit también puede solicitar tipos de cambio a un servicio externo cuando se necesita conversión multidivisa. Estas funciones son opcionales.
- **Código disponible, licencia propietaria**: el plugin es software propietario con código revisable.
- **Detalles de privacidad**: consulta [PRIVACY.md](PRIVACY.md).

<a id="screenshots"></a>

## Capturas

### Panel de trading

![Trading Dashboard](https://github.com/user-attachments/assets/d5c7b636-b8f7-489a-a199-d1bba6958717)

### Constructor de diseños

![Layout Builder](https://github.com/user-attachments/assets/48bcc59a-2b17-4478-98b3-dce8677cca47)

![Layout Builder](https://github.com/user-attachments/assets/03f20e4b-37e7-43d9-94bf-fb444e43afbf)

### Registro de operaciones

![Trade Log](https://github.com/user-attachments/assets/84593d6b-9783-4df6-ad06-6201f101ffcd)

### Trade Import

![Trade Import](https://github.com/user-attachments/assets/68121823-8b24-4024-b676-a4199c81f207)

### Panel de cuentas

![Account Dashboard](https://github.com/user-attachments/assets/dbd1cd69-3f8b-4af8-883c-460dbfb8944b)

### Páginas de cuenta

![Account Pages](https://github.com/user-attachments/assets/8eeb0f2d-a8d8-412e-bf23-cb21e3a0401b)

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
- [JDR Securities Limited](https://journalit.co/docs/broker-guides-jdr)

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
