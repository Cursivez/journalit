# Privacy Policy - Journalit

**Last Updated**: 2026-06-11

## Overview

Journalit is designed with privacy as a core principle. Your trading data stays in your Obsidian vault, and network features are entirely optional.

---

## Data Storage & Privacy

### Local-First Architecture

The core functionality of Journalit operates **entirely locally** within your Obsidian vault:

- **Trade Notes**: All manually created trade entries are stored only in your vault
- **Daily/Weekly/Monthly Reviews**: Review notes remain local
- **Account Data**: Account configurations stored in plugin settings
- **Custom Fields & Settings**: Customization data stays local except custom field definitions/options sent when you explicitly use Trade Import preview generation
- **Analytics & Charts**: Calculated locally from your vault data

**No manual trade data is ever transmitted to any server unless you explicitly use a network-backed feature such as Trade Import, which may send limited local open-trade context for IBKR matching as disclosed below.**

---

## Local Data Storage

### Plugin Settings

**Location**: `.obsidian/plugins/journalit/data.json`

Contains your preferences: currency, display name, date formats, custom fields, dashboard layout, and sync mappings. Never transmitted to any server.

### Authentication Data (If Authenticated)

Authentication credentials are stored locally using Obsidian's SecretStorage API. Legacy plaintext settings from older plugin versions are migrated into SecretStorage when possible and then cleared from plugin settings.

When you authenticate, the following is stored locally:

- JWT access token
- User ID and email
- Subscription tier

**Security**: SecretStorage is managed by Obsidian and the host platform. Journalit does not store authentication tokens in notes, trade files, or synced vault content.

### Cache Data

**Location**: `.journalit/cache/`

Query results and indexes for performance optimization. Stays local, never transmitted.

---

## Optional Network Features

Journalit includes optional features that require network connectivity. Backend synchronization is **disabled by default** and requires explicit authentication.

### Authentication (Required for Sync Features)

When you choose to authenticate:

**What is Transmitted:**

- Your email address (to receive a 6-digit verification code)
- The verification code you enter (to complete authentication)

**What is Returned:**

- JWT token (42-day expiry)
- User ID and subscription status

**What is NOT Transmitted:**

- Device fingerprints or hardware identifiers
- Passwords (we use passwordless email verification)

---

### MetaTrader 5 Sync (Optional)

When you enable MT5 sync in **Settings → Integration → Backend Integration**, the plugin:

**What is Transmitted:**

- **Only automatically synced trades** from your MetaTrader account
- Trade data: symbol, entry/exit times, prices, position size, P&L, commission, swap, fees
- Account information: MT5 account ID, display name
- Vault identifier: A SHA-256 hashed, non-reversible identifier for sync coordination

**What is NOT Transmitted:**

- Manual trades you create in Obsidian
- Trade notes or analysis you write
- Screenshots or attachments
- File contents or vault structure

**Infrastructure:**

- Backend Server (HTTPS encrypted)
- FTP Server (for MetaTrader report uploads)

**Control:**

- Requires explicit authentication via email verification
- Enable/disable in **Settings → Integration → Backend Integration**

---

### Trade Import (Optional Pro Feature)

Trade Import uploads the selected broker export to Journalit servers for processing. Supported inputs may include CSV, XLSX, XLS, HTML, and broker statement files. Broker exports may contain account identifiers, trade history, symbols, timestamps, prices, quantities, fees, balances, and P&L. Raw files are processed for the requested import and are not stored by default. For preview generation, the plugin also sends the selected account name, broker/file/mapping choices, custom field definitions and saved options, and limited local open-trade context for IBKR open-position matching.

**Control:**

- Requires sign-in and an active Pro subscription before upload.
- The plugin shows an upload acknowledgement before processing each view session.
- The backend returns preview data only; final note creation remains local in your Obsidian vault.

---

### Exchange-rate conversion (Optional)

When multi-currency conversion is needed, Journalit may request exchange rates from a third-party exchange-rate service:

**What is Transmitted:**

- Base currency code needed for the exchange-rate lookup
- Standard exchange-rate request parameters required to retrieve current rates

**What is NOT Transmitted:**

- Trade notes or journal text
- Vault contents or file structure
- Full trade history
- Authentication tokens for Journalit services

**Purpose:**

- Convert multi-currency P&L and analytics into your selected base currency

**Control:**

- This happens only when exchange-rate-backed conversion is needed for multi-currency calculations
- Cached rates are stored locally for performance and offline fallback

---

## Network Endpoints

When backend integration is enabled, the plugin communicates with the following endpoints:

**Authentication:**

- `/auth/login` - Request email verification code
- `/auth/verify` - Verify code and receive token
- `/auth/validate` - Validate existing token

**Sync Operations:**

- `/api/v1/obsidian/register-vault` - Initial vault registration
- `/api/v1/sync/ftp` - Trigger FTP synchronization
- `/api/v1/trades` - Fetch trade data from backend
- `/api/v1/mt-accounts` - MetaTrader account management
- `/api/v1/obsidian/status` - Check synchronization status
- `/api/v1/ftp-users` - FTP credential management
- `/api/v1/trade-import/capabilities` - Trade Import capabilities
- `/api/v1/trade-import/analyse` - Trade Import file analysis
- `/api/v1/trade-import/preview` - Trade Import canonical preview
- `/api/v1/health` - Backend health check

All authenticated API requests use JWT tokens in the Authorization header.

---

## Server-Side Data Storage

When you use sync features, the backend stores:

### User Data

- Email address
- Username (derived from email)
- Subscription tier and status
- Account creation timestamp

### Trading Data

- Synced trades from MetaTrader (symbol, times, prices, P&L, fees)
- MT account IDs and display names
- Processing history (which reports have been synced)

### Security Logs

- FTP login attempts (IP address, timestamp, success/failure)
- Used for security monitoring and abuse prevention

### Data Isolation

All user data is protected by PostgreSQL Row-Level Security (RLS). Each user can only access their own data.

---

## Data Security

### Encryption & Transport

- All network communications use **HTTPS (TLS 1.2+)**
- Authentication tokens stored locally using Obsidian SecretStorage
- FTP credentials stored locally using Obsidian SecretStorage
- Vault identifier is hashed using SHA-256 (non-reversible)

### Password Security

- FTP credentials: bcrypt hashed on server
- No plaintext passwords stored

---

## Data Retention

### Local Data

- Stored indefinitely until you delete files or uninstall the plugin
- You have full control over local data

### Server Data

- **Synced trades**: Stored for sync functionality until account deletion
- **Account data**: Stored until account deletion
- **FTP access logs**: Retained for security purposes, older entries periodically cleaned
- **Authentication codes**: Expired codes deleted within 24 hours

---

## Third-Party Services

### Email Delivery

Verification codes are sent via email service provider:

- Only your email address and verification code
- Used solely for authentication

### No Analytics or Tracking

- No Google Analytics
- No user behavior tracking or plugin-side telemetry
- No advertising networks
- No data sold to third parties

---

## Your Rights & Control

### Data Access

- All your data is accessible in your Obsidian vault
- Backend synced data available via sync status in settings

### Data Deletion

- **Local Data**: Delete by removing the plugin or deleting files
- **Backend Data**: Contact contact@journalit.co to request complete account deletion

### Data Export

- Local data: Already in your vault as markdown files
- Backend data: Contact contact@journalit.co for data export

### Opt-Out

- MT5 Sync: Disable in **Settings → Backend Integration**
- Authentication: Log out to revoke token access
- You can use the plugin 100% offline with no network features

---

## What We Do NOT Collect

- Browsing history or clickstream data
- Device identifiers or fingerprints (beyond what's used for local encryption)
- Location data
- Trading account passwords or API keys
- Contents of your Obsidian vault
- Your manual trades or personal notes
- Usage analytics or telemetry from the plugin

---

## Changes to This Policy

We will notify users of material changes to this privacy policy through:

- Plugin update notes
- Discord community announcements
- GitHub release notes

---

## Contact

Privacy questions or concerns:

- Email: contact@journalit.co
- Discord: [Join our server](https://discord.gg/AkSw3D9h8b)

---

## Compliance

This plugin adheres to:

- Obsidian Developer Policies
- Obsidian Plugin Guidelines
- GDPR principles (data minimization, purpose limitation, transparency)
