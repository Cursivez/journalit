# **[1.7.5] - 2026/05/03**

Previous-period comparisons, previous DRC context, custom field improvements, and analytics fixes.

### **Previous-Period Comparisons**

![Prev compare](https://github.com/user-attachments/assets/00215281-263a-494b-9095-a0ef48a2b359)
Dashboard top metrics and review stats now show rows like `vs prev` and `past 30d`.

- **Date-aware comparisons** — Week, month, quarter, and year compare elapsed time against the previous period

### **Previous Trading Day Context Widget**

![Prev DRC](https://github.com/user-attachments/assets/0082352e-f087-445f-9915-1856102b857d)
Add previous DRC context to Daily Review Checklist templates.
_Access via Layout Builder → DRC templates → Previous Trading Day Context_

- **Section selection** — Choose which previous DRC sections to show
- **Trading-day aware** — Uses trading-day navigation and nearest-earlier fallback

### **Custom Trade Fields UX**

_Access via Settings → Customisation → Custom Trade Fields_

- **Field reordering** — Control custom field order in the trade form
- **Cleaner settings UI** — Cleaner hierarchy, empty states, editor layout, and actions
- **Better Advanced tab** — Clearer ordering and setup path when empty

### **More Accurate Trade Analytics**

Partial exits now appear in exit-date analytics before the full trade is closed.

- **Partial-exit P&L** — Realized partial exits now show in calendar, charts, and account analytics
- **Trade Log Risk $ fix** — Risk $ derives from stop loss, entry, and size when no manual risk is stored

### **Account Dashboard Fixes**

- **EOD trailing drawdown** — Drawdown used now uses the active trailed floor
- **Account type deletion** — Deleted account types no longer reappear

### **Position Size Calculator Command**

Assign your own Obsidian hotkey for the position size calculator.
_Access via Obsidian Settings → Hotkeys → Journalit: Open position size calculator_

### **Other fixes**

- French and German translation quality
- Home scrolling fix
- Dashboard metric edit polish
- Home weekly currency display
- Sidebar currency search
