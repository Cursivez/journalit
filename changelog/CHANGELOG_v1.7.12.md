# **[1.7.12] - 2026/06/23**

Small update regarding some fixes and improvements.

### **Best Hours Analytics Upgrade**

![Best Hours](https://github.com/user-attachments/assets/38a97d3d-4096-4617-99a8-bb6c67aedc9c)
The Home Best Hours widget is now more actionable.

- **30-minute time windows** — Compares practical entry-time buckets like 9:30-10:00 vs 10:30-11:00 instead of broad time ranges
- **Sample-aware ranking** — Avoids calling a tiny sample the “best” window too early

### **Dashboard Hourly Performance Controls**

The Trading Dashboard hourly chart now gives you more control over time-of-day analysis.

- **Bucket size selector** — View hourly performance in 15m, 30m, or 60m buckets
- **Metric selector** — Switch between Total and Average performance

### **Trade Import Restore + Multi-Vault Reliability**

![Trade Backup](https://github.com/user-attachments/assets/5420b6d4-234c-4a9c-a054-c75573c45a96)
Trade Import is now more reliable when using multiple vaults or restoring missing local trade notes.

- **Restore missing imported trades** — Recover deleted or missing local trade notes from backend imports without creating duplicate backend trades
- **Multi-vault import support** — Project the same backend imported trades into another vault more safely
- **Deletion tracking** — Local deletions are acknowledged in the background without blocking note deletion

### **Expired Login Handling**

Backend sync now handles expired sessions more cleanly.

### **Home Widget Settings Fixes**

Compact Home widgets are easier to configure.

- **Scrollable settings panels** — Goal Progress and Top Setups settings can be edited without resizing the widget first
- **Cancel restores saved settings** — Unsaved Goal Progress and Top Setups changes are discarded correctly
- **Cleaner action buttons** — Top Setups save/cancel buttons now match the Goal Progress styling

### **DRC Session Mistakes Dropdown Fix**

The Session Mistakes selector in Review V2 is now easier to use when other widgets sit directly below it.

### **Trade Form Commission Fixes**

Manual and automatic commissions now behave more reliably when creating or editing trades.
