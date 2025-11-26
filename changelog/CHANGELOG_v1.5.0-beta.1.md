# 1.5.0-beta.1

Major update: CSV Import, R-Multiple tracking, and critical stability improvements.

## CSV Import System

![CSV Import](https://github.com/user-attachments/assets/5c272fb2-19c7-4db0-94c0-0fecf67281be)

Import trades from any broker directly into your vault

- Built-in broker adapters - IBKR and Tradovate support
- Smart duplicate detection - Prevents re-importing via time/price matching
- AI-powered mapping - Optional OpenAI assistance for custom formats

![CSV Import Manual Mapping](https://github.com/user-attachments/assets/9466227d-f819-44cc-a505-fb04fbc019bb)

- Manual mapping - Map any CSV for unsupported brokers
- Template sharing - JTT codes enable community template distribution
- Access via homepage `Customize -> restore hidden` or `Ctrl+P` search `CSV`

## Manual Trailing Drawdown

![Manual Drawdown Entry](https://github.com/user-attachments/assets/18c45c6e-52a5-438f-9402-632d1187faee)

![Manual Drawdown Settings](https://github.com/user-attachments/assets/893c2b86-61d9-4fa1-abf9-01e9fe4aebb0)

- Snapshot system - Log dated drawdown limits manually
- Stepped chart - Visualize how limits change over time
- Progress tracking - Auto-calculates remaining room and percentage used
- Perfect for prop firms with live equity trailing drawdowns

## R-Multiple Risk Tracking

![R-Multiples & Breakeven Settings](https://github.com/user-attachments/assets/39c9a2cd-21b2-47f0-8432-8b66d353dc34)

Measure trades in risk units instead of currency

- Stop Loss field - Auto-calculates risk from entry-to-stop distance
- Manual override - Set custom risk amounts with preview
- Default risk - Pre-fills from settings
- Display toggle - View ALL metrics in R-multiples instead of currency

## Breakeven Range

- Define a range for breakeven instead of exact zero

## Fixes

- Fixed "plugin gone away" errors on reload
- Fixed date mismatches for UTC-1 to UTC-12 timezones
- Fixed TradeLog creating duplicate trades with random suffixes
- Cross-platform workspace compatibility
- Custom options persistence
- Reviewed trades filtering
- Plus more under the hood improvements
