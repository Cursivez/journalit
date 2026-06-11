# **[1.7.8] - 2026/06/11**

Copy trading, better media support, new dashboard metrics, automatic commissions, and a lot of accuracy/UI fixes.

### **Account-Level Copy Trading**

![Copy Account](https://github.com/user-attachments/assets/bc8b0bdd-1fe4-4681-b937-121648c074d5)
Track copied account performance without duplicating trade notes.

- **Copy periods + multipliers** — Configure base accounts, copy multipliers, and historical copy periods
  _You can edit existing accounts to change to copy accounts or create new accounts as copy accounts_

### **Excalidraw + Vault Media Support**

Add vault images, wikilinks, embeds, and Excalidraw drawings to trade media.

### **Automatic Ticker Commissions**

Configure commission rules once per ticker/instrument and per account
_Access via Settings → Customization → Tickers / Instruments_

### **Dashboard Metric Improvements**

- **Hourly Performance widget** — New dashboard chart showing P&L by hour of day
- **MAE/MFE top metrics** — Optional heat and excursion stats for winners and losers
- **Drawdown percent fix** — Drawdown percentages now use account capital/balance basis instead of peak realized P&L

### **Quick Trade Imports + New Broker**

- **Quick Trade Import flow** — Import your favourited broker into your account faster using the new modal
  _Access via `Ctrl+P "Quick import"` and/or set a hotkey for it_
- **New broker format** - We now support TopStepX imports

### **Trade Entry Quality of Life**

New trade forms now keep the date filled but leave time fields blank.
_If left blank, Journalit saves the current time when you submit._

### **More Fixes + Polish**

- Account Breakdown now sorts accounts by PnL
- Better Review widget headers, star styling, and Layout Builder wording
- Trade Log, Home account filters, Key Events dropdowns, and loading skeletons got cleanup fixes
- Account charts now have cleaner axis scaling, zero handling, and balance coloring
- Minor UI alignment fixes across icons, badges, forms, calendar sidebar, Key Levels, and Trade Log controls
