# **1.6.2-beta.1**
Multi-currency support, new trade metrics, and quality-of-life improvements.

## **Multi-Currency Support**
![Multi-Currency Support](https://github.com/user-attachments/assets/e61a90ff-a11e-4764-9abe-05177a9145b7)
Automatic currency conversion for multi-currency portfolios
- **Unified P&L** - Trades in different currencies (USD, JPY, GBP, etc.) now convert to your display currency
- **ECB exchange rates** - Real-time rates with 24-hour caching for accurate conversions
- **Conversion transparency** - Tooltips show conversion dates, warnings for unsupported currencies
- **IBKR enhanced** - Currency field now extracted from IBKR imports automatically
*Configure your display currency in Settings to see converted totals across all charts and metrics*

## **MAE/MFE Tracking**
![MAE MFE columns](https://github.com/user-attachments/assets/553de95f-efa0-4ae9-8369-69853dc89689)
- **Flexible input** - Enter values as dollar amounts or price levels based on your preference
- **TradeLog columns** - Six new sortable columns for MAE/MFE analysis
*Add MAE/MFE values when creating/editing trades to analyze your entry and exit timing*

## **Position Size Dollar Input**
Enter position sizes as investment amounts instead of quantities
*Toggle dollar input mode in Settings*

## **Year Heatmap Selector**
![Year Heatmap Selector](https://github.com/user-attachments/assets/5c695c93-bcc6-402a-88a5-4def4af8080b)
- **Year navigation** - Interactive selector to view any year's trading heatmap
*Click the top right in the heatmap widget to browse previous years*

## **CSV Date Format Selector**
Manually specify date formats during manual CSV import

## **Fixes**
- Fixed year-boundary issues in weekly calendar causing incorrect quarters and missing events
- Fixed Trading Score widget incorrectly showing "insufficient data" at start of new year
- Fixed streak calculations incorrectly counting open trades (0 PnL) as streak breakers
- Fixed heatmap "Last 3/6 Months" views failing to cross year boundaries correctly
- Fixed modal styling inconsistencies across different Obsidian themes
- Dependency updates and under-the-hood improvements
