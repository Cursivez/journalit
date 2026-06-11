# **1.6.1-beta.1**
Expanded trade analysis, streamlined CSV imports, and new exchange support.

## **Trade Log Columns**
![New Modal](https://github.com/user-attachments/assets/2cfa77f7-ce18-41ec-8fc2-b5401963abaf)
![Available Columns](https://github.com/user-attachments/assets/2b561777-dab7-4c8a-93fe-1ceb3c3f54a7)
13 new columns for comprehensive trade analysis
- **Timing columns** - Entry Time, Exit Time, Close Date for precise timing analysis
- **Price columns** - Weighted average Entry/Exit prices, Stop Loss level
- **Risk columns** - SL Distance ($/%%), Risk $, R:R ratio
- **Position columns** - Size $, Fees, Exchange
- **Expanded mode** - Display tags, setups, and mistakes as pill badges
*Access via settings in Trade Log - new two-panel modal with drag-to-reorder*

## **CSV Import Redesign**
![CSV Importer](https://github.com/user-attachments/assets/2868bf3d-aaa6-4917-bf89-e38182b92c7f)
Faster workflow with preferences and favorites
- **Radio selection** - Browse brokers and accounts at a glance
- **Favorites** - Star your most-used broker and account for auto-selection
- **Hide brokers** - Declutter the list by hiding unused brokers
- **Asset type memory** - Remembers last asset type per broker
*Archived accounts automatically hidden from selection*

## **Hyperliquid Support**
Import trades from Hyperliquid decentralized perpetuals exchange
*Export from Hyperliquid Trade History tab (10k entry limit)*

## **Blofin Support**
Import trades from Blofin crypto exchange

## **Account Date Warning**
Automatic detection of trades before account creation
Prevents balance calculation issues from date mismatches

## **Fixes**
- Fixed backup spam - UI state now stored separately, backups throttled to 5-minute intervals
- Fixed folder placement for trades and DRCs at year boundaries (W01-2026 disambiguation)
- Fixed timezone bug causing wrong dates in review widgets for negative UTC timezones
- Fixed review file creation - clicking DRC/Weekly/Monthly/Yearly in trade notes now auto-creates missing files
- Fixed account type validation when deleted type is no longer available
- Fixed deprecated layout items causing upgrade issues
- Fixed chart padding below x-axis labels
- Fixed account balance chart Y-axis to include drawdown levels
