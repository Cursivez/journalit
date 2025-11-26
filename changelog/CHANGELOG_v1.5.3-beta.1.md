# **1.5.3-beta.1**
Instrument specifications, TradingView import, enhanced dashboard metrics, and critical bug fixes.

## **Global Instrument Specifications**
![Global Specs](https://github.com/user-attachments/assets/f0f962e4-5e63-482c-9a65-b182a19debfd)
Define instrument parameters once and apply them automatically across all trades
- **Automatic symbol normalization** - Applies to all manual and imported trades
- **Symbol Mappings**
*Access via Settings > Customisation > Tickers/Symbols*

## **TradingView CSV Import**
Native support for TradingView paper trading exports

## **Dashboard Enhancements**
![Dashboard Widgets](https://github.com/user-attachments/assets/c745828e-165f-4b9d-b013-7353700272f4)
New metrics and improved widget controls
- **Avg win/loss hold time metrics**
- **Period selectors**
- **Rolling Win/Loss Ratio chart**

## **Update Notification System**
Stay informed about new releases
- **Release notes view** - Browse changelogs directly in the plugin *(CTRL + P, `View release notes`)*
*Can be disabled at the bottom of the general settings tab*

## **TradeLog Tags Column**
![TradeLog Tags](https://github.com/user-attachments/assets/9ad8d467-110c-4148-9f80-f286385d18b2)
Display custom user tags
- **Tags column** - See your trade tags at a glance without opening trade details
- **Legacy tag cleanup** - Removed auto generated tags. Please run **[Ctrl + P, `search for "Clean"`]** to remove legacy tags.

## **Fixes**
- Fixed critical P&L bugs: direction comparison, validation guards, error handling
- Fixed IBKR CSV import: SELL-only filtering and chronological sorting
- Fixed timezone bugs causing DRCs to show data from previous day
- Fixed UTC timezone shift in creation date handling
- Fixed account modal crashes from corrupted date data
- Fixed tag normalization and frontmatter serialization issues
- Fixed duplicate tags/mistakes with escaped quotes and tag paths
- Fixed cache not refreshed on options change
- Fixed trade note navigation to use NavigationManager
+ many more under the hood improvements and code quality enhancements

Please make sure to run **[Ctrl + P, `search for "Clean"`]** to remove legacy tags.
