# **1.6.7**
New CSV import support, import accuracy fixes, and dashboard metric improvements.

## **Trading Technologies (TT) CSV Import**
Import trades from Trading Technologies exports.
*Access via CSV Import → Broker selector → Trading Technologies*

## **Rithmic CSV Import**
First-class support for Rithmic exports.
*Access via CSV Import → Broker selector → Rithmic*

## **Import Accuracy Improvements**
More reliable timestamps and symbol handling across brokers.
- **Timezone-safe imports** — Prevent timezone-shifted timestamps when creating trades from imports
- **FXReplay CME symbol fix** — Resolve CME symbol import failures and normalize futures parsing

## **Account Growth Metrics Fix**
More accurate growth stats when you deposit/withdraw.

## **Dashboard + Calendar Polish**
Small UI/analytics changes that improve day-to-day readability.
- **Break-even styling** — Cleaner break-even visuals in the performance calendar
- **Break-even range classification** — Correctly classifies trades within the break-even range in Trade Note + dashboard widgets

## **More Fixes**
- ATAS Journal imports now include execution commissions