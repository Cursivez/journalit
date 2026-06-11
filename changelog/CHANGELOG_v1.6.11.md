# **[1.6.11] - 2026/03/25**
Trade type switching fixes, Obsidian compatibility hardening, and public submission polish.

### **Trade Type Switching Fixes**
Switch regular, missed, and backtest trades more reliably without notes disappearing or getting stuck in the wrong state.
- **Cleaner type conversions** — Prevent stale frontmatter and inconsistent routing when switching between regular, missed, and backtest trades
- **Immediate re-rendering** — Converted notes now refresh more reliably right after the type changes
- **Trade log stability** — Avoid invisible or duplicated notes after cross-type edits

### **Obsidian Compatibility Hardening**
A broad pass to align more closely with Obsidian plugin expectations and improve day-to-day reliability.
- **Safer note updates** — More editor-aware file mutation handling for active notes and safer background file changes
- **View restoration improvements** — Preserve Journalit views across plugin reloads instead of detaching them
- **UI consistency polish** — Reviewer-visible UI text and behavior have been cleaned up for better consistency

### **More Fixes**
- Recharts tooltip typings were stabilized
