# 1.4.2-beta.2

Working on the CSV importer as one of my main focuses for now but will still be fixing bugs and adding feature requests along the way.

## Review Notes Account Filtering

![Review Notes Account Filter](https://github.com/user-attachments/assets/2afaafc4-ef96-4ec2-9fd0-81edd5fae72d)

- Complete account filtering across all review components (DRC, Weekly Review, Monthly Review)
- Smart cache management to prevent calculation conflicts and improve performance
- Filter your data by specific accounts to get focused insights on individual trading strategies

## Trade Log Updates

![Trade Log Updates](https://github.com/user-attachments/assets/06be594f-30b8-4ebe-85e3-fc05561015b2)

- Added trade status filtering with open/closed/win/loss/breakeven options in Trade Log
- Added "This Quarter" time range filter button

## Better Date/Time Input in Trade Form

- Fast date/time input system with combined format support for quicker trade entry
- Type `280925 1104P` to get 28/09/25 1104PM

## Customisable Homepage Experience

- Drag-and-drop customisable quick links for personalised navigation
- Easily remove any of the homepage navigation buttons you don't want

## Custom Journalit Folder Location

- Customisable journal folder location with complete migration system
- Safety enhancements to prevent data loss during folder changes
- Centralised folder path management for better organisation
- Take full control of where your trading journal data is stored within your vault

## Calendar Fixes

- Eliminated phantom trade counts that were inflating statistics
- Resolved timezone date discrepancies between bar charts and calendar

## Other Fixes & Improvements

- Fixed Trade Log scrolling issues for datasets with ≤50 trades
- Improved tick size formatting and reduced unnecessary refreshes
- And more under the hood improvements
