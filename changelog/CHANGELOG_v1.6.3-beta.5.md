# **1.6.3-beta.5**
Trade form improvements, FX Replay CSV import support, and a batch of stability fixes.

## **FX Replay CSV Import (Analytics Export)**
Added support for FX Replay CSV import
*Access via CSV Import → Broker → FX Replay*

## **Trade Form Reliability**
A big pass on validation and submit flow to reduce “stuck” errors and improve UX.

## **Fixes**
- Backend authguards, avoids unauthenticated requests and stale UI state in the backend integration tab.
- Fixes edge cases where trades could be incorrectly treated as open.
- Fixed indexed trade queries sometimes returning non-arrays
- Fixed duplicate widget codeblock processor registration errors on plugin reload
+ more
