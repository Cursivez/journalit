# **[1.7.11] - 2026/06/19**

Trade import fixes, MetaTrader SL/TP sync, new Trade Log filters, and quality-of-life updates.

### **Profit Target + Account Goals**

![Account Goals](https://github.com/user-attachments/assets/85cefcf1-7217-4371-9f29-1b72c401154c)

- New Profit Target widget for account profit targets
- P&L Target, Trade Count, and Win Rate goals can use selected accounts
- Home account filters now apply to goal progress too

### **MetaTrader Stop Loss + Take Profit Sync**

Synced MetaTrader trades can now bring in stop loss and take-profit data.

- Take profits can be saved as multiple targets with close percentages

### **Trade Import Improvements**

Trade Import should behave better when files contain duplicates, updates, or trades that need review.

### **New Trade Log Filters**

- Filter by Reviewed or Unreviewed
- Filter by direction: Long/Call or Short/Put
- Click the Home Unreviewed Trades widget to open Trade Log with unreviewed trades selected

### **Trade Note Reading View + PDF Export**

- Trade Notes now render more reliably outside edit mode.
- Trade Notes now show up in Obsidian PDF exports

### **Vietnamese Language Support**

Journalit now includes Vietnamese.

### **Automatic Commission Fixes**

Automatic commission rules are now visible while editing a trade, instead of only showing up after save.

### **More Fixes**

- Sidebar edit mode: drag the whole row, with better top/bottom reordering
- Onboarding Explore cards now fit narrow Obsidian panes better
- Home Regular/Backtest dropdown clicks behave more consistently
- Key Levels priority dropdown styling is fixed
- New review notes no longer auto-generate tags
- Internal cache/index files moved out of the vault root `.journalit/` folder
  _this may cause your first load after this update to be slower than usual_
