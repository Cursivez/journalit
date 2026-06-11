# **1.6.3-beta.2**
Stability fixes across review widgets, CSV imports, trade images, and IBKR reconciliation.

## **Quarterly Folder Migration + Trade Images**
Quarterly trade media paths are safer and migration is rerunnable
- **Quarterly media paths** - Uses quarterly folder paths for trade images
- **Failure-safe uploads** - Keeps images intact if submit fails
- **Rerunnable migration** - Merges legacy folders and surfaces skipped/error counts
*Run the Quarterly Folder Migration command if needed*

## **Review V2 Image Widgets**
Image widgets now stay isolated per widget instance
- **Stable widget IDs** - Assigns unique IDs to each `journalit-images` block

## **IBKR Cross-CSV Reconciliation**
IBKR imports now dedupe executions across overlapping CSVs

## **Account Settings + Ordering**
- **Zero balance support** - Allows initial balance to be zero
- **Archived lock** - Keeps Archived accounts at the bottom
- **Settings refresh** - Reorders update immediately after changes

## **Recent Items Icons**
- **Onboarding/layout tracking** - Tracks recent views correctly


## **Translation Fixes**
Fixed some translation issues thanks to @ilt980_04400 

+ quite a few other smaller fixes
