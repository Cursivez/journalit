# **[1.7.0] - 2026/04/02**
Custom trade fields, Home account filtering and manual trade/import fixes

## **Custom Trade Fields Across the App**
![Custom Field Columns](https://github.com/user-attachments/assets/92948032-db3c-4f15-88ca-e99b79846a0d)
Custom fields are now much more useful.
- **Trade Log custom fields** — Add custom columns to the trade log for your custom fields
- **Custom field filtering** — Filter the Trade Log, Trading Dashboard and Review notes by custom field values
*You can only filter `dropdown` and `multi-select` custom field types*
*You can add your custom columns at the bottom of the Available Columns in the Trade Log Column Settings*

## **Trade Note Cleanup + Display Custom Fields**
- **Trade note custom fields section** — Trade notes now show custom fields in a cleaner dedicated section
- **Cleaner trade note layout** — Remove the duplicated bottom trade details table while keeping key metrics and thesis visible
*this is not the trade note revamp, that is still WIP*

## **Home Account Filter**
![Account Filter](https://github.com/user-attachments/assets/d11f7995-bc8d-4129-906e-0447b50451ec)
Scope the full Home view to the accounts you actually want to see.

## **Trade Form + Currency Improvements**
Manual trade entry is more reliable, especially around account and currency handling.
- **Zero-account trade form UX** — Better behavior when no accounts exist yet, with fewer loading/state issues
- **CFD-specific symbol currency support** — Manual trades now handle CFD currency tickers more accurately

## **Import + Note Formatting Fixes**
Several quality-of-life fixes improve CSV import flexibility and note correctness.
- **Direct PnL imports without quantity** — Manual direct PnL CSV imports no longer require a quantity mapping
- **Thesis formatting fix** — Multiline thesis content now saves and renders correctly without leaking YAML formatting markers into notes

## **Settings + Event Reliability**
A couple of correctness fixes tighten up settings and internal state updates.
- **Customization reset fix** — Restore customization reset defaults and related widget processor cleanup
- **Event settings cleanup** — More reliable persistence and cleanup when editing event settings