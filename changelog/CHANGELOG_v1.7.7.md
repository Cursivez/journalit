# **[1.7.7] - 2026/05/16**

Weekly review improvements, plus hotfixes for trade note loading, Review V2 syncing, and dashboard partial-exit metrics.

### **Weekly Review DRC Improvements**

![Weekly DRC Review](https://github.com/user-attachments/assets/f6d87ebd-5be0-4c8a-a4fd-8e7b33cda2fd)
Review weekday DRCs faster from your Weekly Review.

- **Clickable DRC names** — The weekday DRC name now opens the related DRC, replacing the separate open button
- **Mark reviewed from weekly review** — Mark or unmark each weekday DRC directly inside the weekly context widget
- **Sticky headers** — Review actions stay available while reading longer DRC sections

### **Fixes**

- **Trade note loading** — Fixes trade notes opening as raw markdown/frontmatter instead of the Journalit trade UI
- **Review widget sync** — Keeps goals, checklists, grades, and weekly key events synced across Reading view and Live Preview
- **Nested DRC widgets** — Prevents recursive previous-day context widgets inside embedded DRC context sections
- **Weekly DRC context placement** — Weekly DRC context now only renders in Weekly Review notes
- **Review header layout** — Keeps the reviewed indicator aligned on narrow panes and mobile widths
- **Dashboard partial exits** — Improves monthly Net P&L, Recent Trades, and Weekday Performance in exit-date mode
