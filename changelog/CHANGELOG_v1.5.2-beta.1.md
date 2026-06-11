# **1.5.2-beta.1**
Major Trade Log overhaul with multi-select, enhanced filtering, and performance improvements.

## **MAJOR Trade Log Enchacements**
[Trade Log](https://github.com/user-attachments/assets/84593d6b-9783-4df6-ad06-6201f101ffcd)
Complete rebuild with modern features and dramatic performance gains
[Multi-select](https://github.com/user-attachments/assets/79a177a2-8dc2-4e37-8a3b-329e64cb50b8)
- **Multi-select** - Shift-click to select multiple trades, batch operations toolbar for bulk actions
- **Batch Operation Toolbar** - Easily mark as reviewed, add setups, add mistakes or delete selected trades
[Column Customisation](https://github.com/user-attachments/assets/5cceeb80-2142-48ec-8811-69418e0caeb5)
- **Column customization** - Choose which columns to display, reorder and resize to your preference
- **Scroll persistence** - TradeLog remembers your scroll position when navigating away
- **80-99% performance improvement** - Parallel cache refresh for lightning-fast data updates
*Access column settings via TradeLog header controls, multi-select with shift-click*

## **Advanced Filter System**
[Advanced Filters](https://github.com/user-attachments/assets/5ff0bcac-9cfe-44bd-96c6-9193055603a2)
Unified filtering interface with enhanced controls
*Access via filter button in Dashboard and TradeLog headers*

## **TradeZero CSV Import Support**
Import trades directly from TradeZero broker

## **Trade Form Protection**
[Form Protection](https://github.com/user-attachments/assets/e888a5ef-f0b8-4b98-bb2b-c935d70f99fc)
Prevent accidental data loss with unsaved changes

## **Fixes**
- Fixed race condition in trade file creation causing data loss
- Fixed performance calendar month labels overlaying sticky header
- Fixed missing Direction field for option trades in frontmatter
- Fixed duplicate images pasting into DRC and Weekly Review
- Fixed trade status detection bugs for trades with multiple entries
- Fixed focus loss in entry/exit rows during editing
- Fixed accountMetadata data loss during settings reconstruction
+ many more under the hood improvements and code quality enhancements
